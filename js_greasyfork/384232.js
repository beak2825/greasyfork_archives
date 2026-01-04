// ==UserScript==
// @name           UIModules
// @name:en        UIModules
// @description    Modules for UI constructing
// @description:en Modules for UI constructing
// @namespace      https://greasyfork.org/users/174399
// @version        0.1.0
// @include        *://*.mozilla.org/*
// @run-at         document-start
// @grant          none
// ==/UserScript==

(function(window) {
    'use strict';
    const listSymbol = Symbol('list');
    const modeSymbol = Symbol('mode');
    const valueSymbol = Symbol('value');
    const fn = {};
    fn.toJSON = function() {
        return {
            __function_body__: this.toString().replace(/\s+/g, ' '),
            __function_name__: this.name,
            __function_length__: this.length,
         };
    };
    function reviver(key, value) {
        if (key === '__function_body__') {
            return new Function('return ' + value)();
        }
        if (typeof value === 'object' && typeof value.__function_body__ === 'function') {
            return value.__function_body__;
        }
        return value;
    }
    /*
    const interfaceTemplate = {
        title: 'template interface',
        version: '0.1.0',
        mode: 'normal',
        tabs: {
            data: {
                'general': {},
            },
            order: ['general'],
        },
    };
    const tabDataTemplate = {
        name: 'general',
        label: 'General',
        options: {
            data: {
                'option-name': {},
            },
            order: ['option-name'],
        },
    };
    const optionDataTemplate = {
        name: 'option-name',
        label: 'Option name',
        value: 'option-value',
        description: 'description text (optional)',
        type: 'string',
        mode: 'normal',
        tab: 'general',
    };
    */
    /*
    <div class="interface-ui">
        <div class="tabs-ui tabs-ui-active">
            <div class="tab-ui tab-ui-active" data-name="{tabUI.name}">
                <div class="tab-ui-label">
                    <span>{tabUI.label}</span>
                </div>
                <div class="tab-ui-data">
                    <input type="radio" name="file-size" data-key="10G" value="10G" />
                    <input type="radio" name="file-size" data-key="1G"  value="1G" />
                    <input type="radio" name="file-size" data-key="1M"  value="1M" />
                    <input type="radio" name="file-size" data-key="1Kb"  value="1024" />
                    <input type="text" name="file-name" value="foo.txt" />
                </div>
            </div>
            <div class="tab-ui"/>
        </div>
    </div>
    */
    function dummy() {}
    function Mode(name = 'normal', label = '', onChange = dummy) {
        let nam;
        Object.defineProperty(this, 'name', { 
            get: function() { return nam; },
            set: function(n) {
                try {
                    Mode.validateName(n);
                    nam = n;
                    onChange(null, n);
                } catch (err) {
                    onChange(err);
                }
            },
            enumerable: true,
        });
        this.name = name;
        this.label = label || name;
    }
    Object.defineProperties(Mode, {
        'NORMAL': {
            value: 'normal',
            enumerable: true,
        },
        'ADVANCED': {
            value: 'advanced',
            enumerable: true,
        },
        'NAMES': {
            get: function(){
                return [Mode.NORMAL, Mode.ADVANCED];
            },
            enumerable: true,
        },
    });
    Mode.validateName = function(name) {
        switch (name) {
            case Mode.NORMAL:
            case Mode.ADVANCED:
                return true;
            default:
                throw new Error('invalid mode name (' + name + '), valid names = [' + Mode.NAMES.join(', ') + ']');
        }
    };
    Mode.descriptor = {
        get: function() { return this[modeSymbol]; },
        set: function(mode) {
            try {
                Mode.validateName(mode);
                this[modeSymbol] = mode;
            } catch (error) {
                if (typeof this.onChange === 'function') {
                    this.onChange(error);
                } else {
                    console.error('mode validation: ', error);
                }
            }
        },
        enumerable: true,
    };
    function Datum({
        mode = Mode.NORMAL,
        label,
        key,
        name,
        description,
        onChange = dummy,
        validate = dummy,
        setter = function(v) { return v; },
    } = {}) {
        console.log('new Datum() -> args: ', JSON.stringify(arguments[0], null, 2));
        this.onChange = onChange;
        this.validate = validate;
        this.setter = setter;
        this.label = label;
        this.description = description;
        this.mode = mode;
        Object.defineProperty(this, 'name', { value: name });
        Object.defineProperty(this, 'key', { value: (key || name) });
    }
    Datum.descriptor = {
        get: function(){ return this[valueSymbol]; },
        set: function(val) {
            try {
                this.validate(val);
                this[valueSymbol] = this.setter(val);
                this.onChange(null, this[valueSymbol], val);
            } catch (error) {
                this.onChange(error);
            }
        },
        enumerable: true,
    };
    Object.defineProperty(Datum.prototype, 'mode',  extend({}, Mode.descriptor));
    Datum.prototype.toJSON = function() {
        const { mode, name, label, description, key } = this;
        return { mode, name, label, description, key };
    };
    Datum.prototype.assign = function(item, checkName = false) {
        if (!item || item === this) {
            return this;
        }
        const {
            key,
            name,
            validate = this.validate,
            onChange = this.onChange,
            label = this.label,
            description = this.description,
        } = item;
        if (name !== this.name && checkName) {
            throw new Error('In assign (' + this.TYPE + ', name does not match, expected "' + this.name + '", but got "' + name + '"');
        }
        this.validate = validate;
        this.onChange = onChange;
        this.label = label;
        this.description = description;
        return this;
    };
    function Input({
        mode = Mode.NORMAL,
        label,
        name,
        key,
        value,
        description,
        type,
        onChange,
        validate,
        setter,
    } = {}) {
        this.index = Input.index++;
        console.log('new Input() -> args: ', JSON.stringify(arguments[0], null, 2));
        Datum.call(this, { mode, label, name, key, description, onChange, validate, setter });
        Object.defineProperty(this, 'value', extend({}, Datum.descriptor));
        Object.defineProperty(this, 'tag', { value: 'input' });
        let _type;
        Object.defineProperty(this, 'type', {
            get: function(){ return _type; },
            set: function(t) {
                if (Input.TYPES.indexOf(t) === -1) {
                    throw new TypeError('invalid input type, expected one of ' + JSON.stringify(Input.TYPES) + ', but got ' + t);
                }
                _type = t;
            },
            enumerable: true,
        });
        this.type = type;
        this.value = value;
    }
    Input.index = 0;
    Input.TYPES = ['number', 'text', 'checkbox', 'date', 'email', 'radio', 'tel', 'time'];
    Object.defineProperty(Input.prototype, 'mode',  extend({}, Mode.descriptor));
    Input.parse = function(item){
        if (item instanceof Input) {
            return item;
        }
        if (typeof item === 'object') {
            return new Input(item);
        }
        return new Input();
    };
    Input.prototype.toJSON = function() {
        const { value, type } = this;
        return extend({ value, type }, Datum.prototype.toJSON.call(this));
    };
    Input.prototype.toHTML = function() {
        const div = document.createElement('div');
        const elem = document.createElement('input');
        elem.setAttribute('type', this.type);
        elem.setAttribute('value', this.value);
        elem.setAttribute('name', this.name);
        elem.setAttribute('data-key', this.key);
        const id = this.name + '-' + (this.key === this.name ? this.globalIndex : this.key);
        elem.setAttribute('id', id);
        elem.setAttribute('title', this.description);
        div.appendChild(elem);
        return div.firstElementChild;
    };
    Input.prototype.assign = function(item, checkName = false) {
        if (!item || item === this) {
            return this;
        }
        Datum.prototype.assign.call(this, item, checkName);
        const { value = this.value } = item;
        this.value = value;
        return this;
    };
    
    function Option({
        label,
        name,
        key,
        value,
        description,
        onChange,
        validate,
        setter,
    } = {}) {
        this.globalIndex = Option.index++;
        console.log('new Option() -> args: ', JSON.stringify(arguments[0], null, 2));
        Datum.call(this, { label, name, key, description, onChange, validate, setter });
        Object.defineProperty(this, 'value', extend({}, Datum.descriptor));
        Object.defineProperty(this, 'tag', { value: 'option' });
        this.value = value;
    }
    Object.defineProperty(Option.prototype, 'mode',  extend({}, Mode.descriptor));
    Option.parse = function(item){
        if (item instanceof Option) {
            return item;
        }
        if (typeof item === 'object') {
            return new Option(item);
        }
        return new Option();
    };
    Option.prototype.toJSON = function() {
        const { value, type } = this;
        return extend({ value, type }, Datum.prototype.toJSON.call(this));
    };
    Option.index = 0;
    Option.prototype.toHTML = function() {
        const div = document.createElement('div');
        const elem = document.createElement('option');
        elem.setAttribute('value', this.value);
        elem.setAttribute('name', this.name);
        elem.setAttribute('data-key', this.key);
        const id = this.name + '-' + (this.key === this.name ? this.globalIndex : this.key);
        elem.setAttribute('id', id);
        elem.setAttribute('title', this.description);
        div.appendChild(elem);
        return div.firstElementChild;
    };
    Option.prototype.assign = function(item, checkName = false) {
        if (!item || item === this) {
            return this;
        }
        Datum.prototype.assign.call(this, item, checkName);
        const { value = this.value } = item;
        this.value = value;
        return this;
    };
    
    function List(Item = Input, itemKey = 'name', itemDefaults = {}) {
        Object.defineProperty(this, 'Item', { value: Item });
        this.data = {};
        this.order = [];
        this.itemDefaults = itemDefaults;
        List.validateItemKey(itemKey);
        Object.defineProperty(this, 'itemKey', { value: itemKey });
    }
    List.ITEM_KEYS = ['key', 'name'];
    List.validateItemKey = function(key) {
        if (List.ITEM_KEYS.indexOf(key) === -1) {
            throw new Error('Invalid key property name, expected ' + JSON.stringify(List.ITEM_KEYS) + ', but got ' + key + ' (typeof = ' + typeof key + ')');
        }
    };
    List.prototype.add = function(...data) {
        const { Item, itemKey, itemDefaults } = this;
        for (const datum of data) {
            const item = datum instanceof Item ? datum : new Item(extend({}, itemDefaults, datum));
            const { [itemKey]: name } = item;
            if (this.data[name] || this.order.indexOf(name) !== -1) {
                throw new Error('data already exists, type = "' + Item.name + '", name = "' + name + '"');
            }
            this.data[name] = item;
            this.order.push(name);
        }
    };
    List.prototype.update = function(datum) {
        if (!datum || typeof datum !== 'object') {
            return;
        }
        const { Item, itemKey } = this;
        const { [itemKey]: name } = datum;
        const item = this.data[name];
        if (item instanceof Item) {
            item.assign(datum);
        }
    };
    List.prototype.remove = function(name = '') {
        if (!name) {
            return;
        }
        const { Item } = this;
        const item = this.data[name];
        const index = this.order.indexOf(name);
        if (item) {
            delete this.data[name];
        }
        if (index !== -1) {
            this.order.splice(index, 1);
        }
    };
    List.prototype.setValue = function(name = '', value) {
        const { Item } = this;
        const item = this.data[name];
        if (item instanceof Item) {
            item.value = value;
        }
    };
    List.prototype.getValue = function(name = '') {
        const { Item } = this;
        const item = this.data[name];
        if (item instanceof Item) {
            return item.value;
        }
        return null;
    };
    List.prototype.assign = function(_list) {
        if (!_list || _list === this) {
            return this;
        }
        if (!(_list instanceof List) && typeof _list !== 'object') {
            return this;
        }
        const {
            data = this.data,
            order = this.order,
            itemKey = this.itemKey,
            itemDefaults = this.itemDefaults,
        } = _list;
        if (order !== this.order && itemKey !== 'key') {
            this.order = [...order];
        }
        if (itemKey !== this.itemKey) {
            this.itemKey = itemKey;
        }
        if (itemDefaults !== this.itemDefaults) {
            this.itemDefaults = itemDefaults;
        }
        if (data !== this.data) {
            this.data = extend({}, data);
        }
        return this;
    };
    List.parse = function(elem) {
        if (elem instanceof List) {
            return elem;
        }
        if (typeof elem === 'object') {
            let Item;
            switch (elem.itemType) {
                case 'Datum':
                    Item = Datum;
                    break;
                case 'Input':
                    Item = Input;
                    break;
                case 'Radio':
                    Item = Radio;
                    break;
                case 'Option':
                    Item = Option;
                    break;
                case 'Tab':
                    Item = Tab;
                    break;
                case 'TabItem':
                    Item = TabItem;
                    break;
                case 'List':
                    Item = List;
                    break;
                case 'Mode':
                    Item = Mode;
                    break;
                case 'Select':
                    Item = Select;
                    break;
                default:
                    throw new TypeError('Invalid itemType (' + itemType + ', ' + typeof itemType + ')');
            }
            const { itemKey, itemDefaults, data = {}, order = [] } = elem;
            const list = new List(Item, itemKey, itemDefaults);
            for (const key of order) {
                list.add(data[key]);
            }
            return list;
        }
        return new List();
    };
    List.prototype.toJSON = function() {
        const { data, order, itemKey, itemDefaults, Item } = this;
        return { data, order, itemKey, itemDefaults, itemType: Item.name };
    };
    
    function Radio({ mode, label, description, name, value, onChange, validate, setter } = {}) {
        Datum.call(this, { mode, label, description, name, onChange, validate, setter });
        Object.defineProperty(this, 'value', Datum.descriptor);
        List.call(this, Input, 'key', {
            type: 'radio',
            name: this.name,
            mode: this.mode,
            validate: this.validate,
            setter: this.setter,
        });
    }
    Object.defineProperty(Radio.prototype, 'mode',  Mode.descriptor);
    for (const fn of ['add', 'update', 'remove', 'setValue', 'getValue']) {
        Radio.prototype[fn] = function(...args) {
            return List.prototype[fn].apply(this, args);
        };
    }
    Radio.prototype.changeItem = function(itemValue) {
        const { Item, itemDefaults } = this;
        console.log('------ itemDefaults: ', JSON.stringify(itemDefaults, null, 2));
        console.log('changeItem: ', itemValue);
        let error;
        const elem = new Item(extend({}, itemDefaults, {
            value: itemValue,
            onChange: function(err){
                error = err;
            },
        }));
        console.log('changeItem -> elem: ', JSON.stringify(elem, null, 2));
        if (error) {
            console.log('In changeItem, ', error);
            return;
        }
        console.log('changeItem -> item: ', JSON.stringify(elem, null, 2));
        for (const key of this.order) {
            const item = this.data[key];
            console.log('[' + key + ']: ', JSON.stringify(item, null, 2));
            if (item.value === elem.value) {
                this.value = itemValue;
                console.log('-------------------- found');
                break;
            }
        }
    };
    Radio.prototype.assign = function(radio) {
        if (!radio || radio === this) {
            return this;
        }
        if (radio instanceof Radio || typeof radio === 'object') {
            const { value = this.value } = radio;
            this.value = value;
        }
        Datum.prototype.assign.call(this, radio);
        List.prototype.assign.call(this, radio);
        return this;
    };
    Radio.parse = function(elem) {
        if (elem instanceof Radio) {
            return elem;
        }
        if (typeof elem === 'object') {
            const radio = new Radio(elem);
            const { data = {}, order = [] } = elem;
            for (const key of order) {
                radio.add(data[key]);
            }
            return radio;
        }
        return new Radio();
    };
    Radio.prototype.toJSON = function() {
        const { value } = this;
        return extend(
            { value, type: 'radio' },
            Datum.prototype.toJSON.call(this),
            List.prototype.toJSON.call(this),
        );
    };
    function Select({ mode, label, description, name, value, onChange, validate, setter } = {}) {
        Datum.call(this, { mode, label, description, name, onChange, validate, setter });
        Object.defineProperty(this, 'value', Datum.descriptor);
        List.call(this, Option, 'key', {
            name: this.name,
            mode: this.mode,
            validate: this.validate,
            setter: this.setter,
        });
    }
    Object.defineProperty(Select.prototype, 'mode',  Mode.descriptor);
    for (const fn of ['add', 'update', 'remove', 'setValue', 'getValue']) {
        Radio.prototype[fn] = function(...args) {
            return List.prototype[fn].apply(this, args);
        };
    }
    Select.prototype.changeItem = function(itemValue) {
        const { Item, itemDefaults } = this;
        console.log('------ itemDefaults: ', JSON.stringify(itemDefaults, null, 2));
        console.log('changeItem: ', itemValue);
        let error;
        const elem = new Item(extend({}, itemDefaults, {
            value: itemValue,
            onChange: function(err){
                error = err;
            },
        }));
        console.log('changeItem -> elem: ', JSON.stringify(elem, null, 2));
        if (error) {
            console.log('changeItem -> elem: ', JSON.stringify(elem, null, 2));
            return;
        }
        console.log('changeItem -> item: ', JSON.stringify(elem, null, 2));
        for (const key of this.order) {
            const item = this.data[key];
            console.log('[' + key + ']: ', JSON.stringify(item, null, 2));
            if (item.value === elem.value) {
                this.value = itemValue;
                console.log('-------------------- found');
                break;
            }
        }
    };
    Select.prototype.assign = function(elem) {
        if (!elem || elem === this) {
            return this;
        }
        if (elem instanceof Select || typeof elem === 'object') {
            const { value = this.value } = elem;
            this.value = value;
        }
        Datum.prototype.assign.call(this, elem);
        List.prototype.assign.call(this, elem);
        return this;
    };
    Select.parse = function(elem) {
        if (elem instanceof Select) {
            return elem;
        }
        if (typeof elem === 'object') {
            const select = new Select(elem);
            const { data = {}, order = [] } = elem;
            for (const key of order) {
                select.add(data[key]);
            }
            return select;
        }
        return new Select();
    };
    Select.prototype.toJSON = function() {
        const { value } = this;
        return extend(
            { value, type: 'select' },
            Datum.prototype.toJSON.call(this),
            List.prototype.toJSON.call(this),
        );
    };
    const list = new List();
    const onChange = function(error, value) {
        if (error) {
            console.log('error occured while setting value, ', error);
            return;
        }
        console.log('next value: ', value);
    };
    onChange.toJSON = fn.toJSON;
    const validate = function(value) {
        let match;
        switch (typeof value) {
            case 'undefined':
            case 'number':
                break;
            case 'string':
                match = value.trim().match(/^(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i);
                if (match && match[1]) break;
            default:
                throw new TypeError('invalid value');
        }
    };
    validate.toJSON = fn.toJSON;
    const setter = function(value) {
        let match;
        switch (typeof value) {
            case 'string':
                match = value.trim().match(/^(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i);
                return +match[1] * Math.pow(1024, match[2] ? ['', 'k', 'm', 'g', 't'].indexOf(match[2].toLowerCase()) : undefined);
            case 'number':
                return value;
            default:
                throw new TypeError('invalid value');
        }
    };
    setter.toJSON = fn.toJSON;
    const input = new Input({
        name: 'file-size',
        label: 'File size (bytes)',
        description: 'Here is size of uploaded file in bytes',
        value: 1023,
        key: '1G',
        type: 'radio',
        onChange,
        validate,
        setter,
    });
    list.add(input);
    console.log('item: ', JSON.stringify(input, null, 2));
    console.log('list: ', JSON.stringify(list, null, 2));
    list.setValue('file-size', '1 GB');
    console.log('item.value: ', input.value);
    const radio = new Radio({ name: 'file-size', value: '1G', onChange, validate, setter });
    radio.add(input);
    radio.add(new Input({
        name: 'file-size',
        key: '10MB',
        label: 'File size (bytes)',
        value: '10 MB',
        type: 'radio',
        onChange,
        validate,
        setter,
    }));
    radio.changeItem('10MB');
    radio.value;
    console.log('radio: ', JSON.stringify(radio, null, 2));
    function TabItem({
        mode, type, name, label, description, value, onChange, validate, setter,
    } = {}) {
        let Item;
        switch (type) {
            case 'radio':
                Item = Radio;
                break;
            case 'select':
                Item = Select;
                break;
            default:
                Item = Input;
        }
        Object.defineProperty(this, 'Class', { value: Item });
        this.Class.call(this, arguments[0]);
    }
    Object.defineProperty(TabItem.prototype, 'mode',  Mode.descriptor);
    TabItem.prototype.assign = function() {
        return this.Class.prototype.assign.apply(this, arguments);
    };
    TabItem.parse = function(elem) {
        if (elem instanceof Option) {
            return elem;
        }
        if (typeof elem !== 'object') {
            return new Option();
        }
        const { type } = elem;
        if (type === 'radio') {
            const opt = new TabItem(elem);
            const { data = {}, order = [] } = elem;
            for (const key of order) {
                opt.add(data[key]);
            }
            return opt;
        }
        return new TabItem(elem);
    };
    TabItem.prototype.toJSON = function() {
        return this.Class.prototype.toJSON.apply(this, arguments);
    };
    for (const fn of ['add', 'update', 'remove', 'setValue', 'getValue', 'changeItem']) {
        TabItem.prototype[fn] = function() {
            if (this.Class === Radio) {
                return Radio.prototype[fn].apply(this, arguments);
            }
        };
    }
    const opt = new TabItem({ mode: Mode.ADVANCED, type: 'radio', name: 'file-size', value: '10.5 MB', onChange, validate, setter });
    opt.add({
        key: '1MB', value: '1MB',
    }, {
        key: '2MB', value: '2MB',
    }, {
        key: '1Gb', value: '1GB',
    }, {
        key: '2KB', value: '2K',
    });
    opt.changeItem('2kb');
    console.log('================== value: ', opt.value);
    const opt2 = new TabItem({ mode: Mode.ADVANCED, type: 'text', name: 'file-name', value: 'my_file.txt', onChange });
    console.log('================== opt2: ', JSON.stringify(opt2, null, 2));
    console.log('================== opt: ', JSON.stringify(opt, null, 2));
    opt2.value = 'my_file_xxx.out';
    console.log('================== opt2: ', JSON.stringify(opt2, null, 2));
    const json = JSON.stringify({ setter }, null, 2);
    console.log('{ setter }: ', json);
    const parsed = JSON.parse(json, reviver);
    console.log('parsed.setter: ', parsed.setter);
    try {
        if (1024 === parsed.setter('1Kb')) {
            console.log('PASSED');
        } else {
            console.log('FAILED');
        }
    } catch (err) {
        console.log('setter error: ', err);
    }
    const optJson = JSON.stringify(opt2, null, 2);
    const parsedOpt = JSON.parse(optJson, reviver);
    const opt3 = TabItem.parse(parsedOpt);
    console.log('opt3: ', opt3);
    
    function Tab({ name, key, label, description } = {}) {
        this.name = name;
        this.key = key || name;
        this.label = label;
        this.description = description;
        List.call(this, TabItem);
    }
    for (const fn of ['add', 'update', 'remove', 'setValue', 'getValue']) {
        Tab.prototype[fn] = function() {
            return List.prototype[fn].apply(this, arguments);
        };
    }
    Tab.prototype.assign = function(elem) {
        throw new Error('TODO');
    }; // TODO
    Tab.prototype.toJSON = function() {
        const { name, key, label, description } = this;
        return extend({
            name, key, label, description,
        }, List.prototype.toJSON.call(this));
    };
    Tab.parse = function(elem) {
        if (elem instanceof Tab) {
            return elem;
        }
        if (typeof elem !== 'object') {
            return new Tab();
        }
        const tb = new Tab(elem);
        const { data = {}, order = [] } = elem;
        for (const key of order) {
            tb.add(data[key]);
        }
        return tb;
    };
    const tab = new Tab({ name: 'general', label: 'General', description: 'Here are general options' });
    tab.add({ name: 'file-owner', type: 'text', value: 'Enakin Skywalker' });
    tab.add({ name: 'file-size', type: 'radio', value: '1Mb', validate, setter });
    tab.data['file-size'].add({
        key: '1Mb', value: '1M',
    }, {
        key: '10Mb', value: '10M',
    }, {
        key: '1Gb', value: '1GB',
    });
    const tabJson = JSON.stringify(tab, null, 2);
    console.log('tab: ', tabJson);
    const tab2 = Tab.parse(JSON.parse(tabJson, reviver));
    console.log('tab2: ', tab2);
    function Interface({
        mode: modeName = Mode.NORMAL, title = 'Interface', version = '0.1.0', onChangeMode = function(){},
    } = {}) {
        const mode = new Mode(modeName, null, onChangeMode);
        Object.defineProperty(this, 'mode', {
            get: function() { return mode.name; },
            set: function(n) { mode.name = n; },
            enumerable: true,
        });
        this.title = title;
        this.version = version;
        this.onChangeMode = onChangeMode;
        List.call(this, Tab);
    }
    for (const fn of ['add', 'update', 'remove']) {
        Interface.prototype[fn] = function() {
            return List.prototype[fn].apply(this, arguments);
        };
    }
    Interface.prototype.toJSON = function() {
        const { mode, title, version } = this;
        return extend({
            mode, title, version,
        }, List.prototype.toJSON.call(this));
    };
    Interface.parse = function(elem) {
        if (elem instanceof Interface) {
            return elem;
        }
        if (typeof elem !== 'object') {
            return new Interface();
        }
        const intf = new Interface(elem);
        const { data = {}, order = [] } = elem;
        for (const key of order) {
            intf.add(data[key]);
        }
        return intf;
    };
    const iface = new Interface({
        onChangeMode: function(error, mode) {
            if (error) {
                console.log('onChangeMode: ', error);
                return;
            }
            console.log('new mode: ', mode);
        },
    });
    iface.add(tab);
    tab2.name = 'advanced';
    iface.add(tab2);
    const ifaceJson = JSON.stringify(iface, null, 2);
    console.log('interface: ', ifaceJson);
    const iface2 = Interface.parse(JSON.parse(ifaceJson));
    console.log('interface2: ', iface2);

    function extend(target) {
        target = target || {};
        const args = Array.prototype.slice.call(arguments, 1);
        for (const arg of args) {
            for (const key of Object.keys(arg)) {
                target[key] = arg[key];
            }
        }
        return target;
    }
    const { ESModules = {} } = window;
    ESModules.UIModules = {
        Mode,
        Datum,
        Input,
        Option,
        List,
        Radio,
        Select,
        Tab,
        TabItem,
        Interface,
        functionToJSON: fn.toJSON,
        functionReviver: reviver,
        memoryValidator: validate,
        memorySetter: setter,
    };
    window.ESModules = ESModules;
})(window)
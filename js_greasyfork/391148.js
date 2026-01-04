// ==UserScript==
// @name           Vk Media Downloader User Settings
// @name:en        Vk Media Downloader User Settings
// @description    Модалка с пользовательскими настройками для скрипта Vk Media Downloader
// @description:en User settings modal for Vk Media Downloader script
// @namespace      https://greasyfork.org/users/136230
// @version        0.3.0
// @author         EisenStein
// @include        https://vk.com/*
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/391148/Vk%20Media%20Downloader%20User%20Settings.user.js
// @updateURL https://update.greasyfork.org/scripts/391148/Vk%20Media%20Downloader%20User%20Settings.meta.js
// ==/UserScript==
// @grant          GM_info
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_notification
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant          GM.setValue
// @grant          GM.getValue
// @grant          GM.deleteValue
// @grant          GM.listValues

(function(window, WINDOW, undefined){
    if (top !== self) {
        return;
    }
    const str = '===============================================';
    console.log(['MODAL START', str, `document.readyState: ${document.readyState}`].join('\n'));
    const { scriptHandler, version, script } = typeof GM_info !== 'undefined' ? GM_info : {};
    console.log('script handler: ', scriptHandler, version);
    console.log('script version: ', script && script.name, script && script.version);
    const Modal = {};
    DOMReady(function(){
        Modal.create();
        Modal.insert();
    });
    function DOMReady(callback) {
        let resolve;
        const promise = new Promise(function(res){ resolve = res; });
        const func = function(){
            resolve();
            if (callback) callback();
        };
        switch (document.readyState) {
            case 'loading':
                document.addEventListener('DOMContentLoaded', function(){ func(); });
                break;
            default:
                setTimeout(func, 10);
        }
        return promise;
    }
    Modal.create = function(){
        // creates HTMLElement:
        var div = document.createElement('div');
        div.innerHTML = Modal.html;
        Modal.element = div.firstChild;
        // creates style
        Modal.style = document.createElement('style');
        Modal.style.innerHTML = Modal.css;
        console.log('[+] Modal created');
    };
    Modal.insert = function() {
        if (!Modal.element || !Modal.style) {
            Modal.create();
        }
        // insert to DOM
        document.body.appendChild(Modal.element);
        document.head.appendChild(Modal.style);
        console.log('[+] Modal inserted into DOM');
    };
    Modal.html = `
    <div class="modal-wrapper">
        <input type="checkbox" style="display: none" id="modal-checkbox" />
        <div class="modal-container">
            <label for="modal-checkbox" class="modal-close-background" ></label>
            <div class="modal-content">
                ${'' && '<div class="modal-header"><label for="modal-checkbox" title="close" class="modal-close-x"><div></div></label></div>'}
                <div class="modal-body"></div>
                <div class="modal-footer"></div>
            </div>
        </div>
    </div>`.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
    Modal.css = `
    .modal-container {
        position: fixed;
        opacity: 0;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        transition: all .25s;
        z-index: -1000;
    }
    #modal-checkbox {
        top: 20px;
        left: 20px;
        position: fixed;
        z-index: 9999999999999;
        display: block;
    }
    #modal-checkbox:checked + .modal-container {
        z-index: 9999999;
        opacity: 1;
    }
    #modal-checkbox:checked + .modal-container label {
        display: block;
    }
    #modal-checkbox:checked + .modal-container .modal-content {
        bottom: 0;
        transition: all .25s;
        display: flex;
    }
    .modal-content {
        position: absolute;
        background-color: gray;
        min-width: 400px;
        min-height: 225px;
        max-width: 500px;
        max-height: 280px;
        width: 40%;
        height: 40%;
        opacity: 1;
        flex-direction: column;
        align-items: center;
        right: 0;
        bottom: -20%;
        transition: all .25s;
    }
    .modal-header {
        display: flex;
        flex-direction: row;
        position: relative;
        align-items: center;
        width: 100%;
    }
    .modal-close-x {
        margin: 5px 10px 5px 0;
        z-index: 12;
        cursor: pointer;
    }
    .modal-close-x div {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }
    .modal-close-x,
    .modal-close-x div {
        width: 24px;
        height: 24px;
    }
    .modal-close-x div:after,
    .modal-close-x div:before {
        content: "";
        position: absolute;
        background: #fff;
        width: 2.5px;
        height: 24px;
        display: block;
        transform: rotate(45deg);
    }
    .modal-close-x div:before {
        transform: rotate(-45deg);
    }
    .modal-close-background {
        position: absolute;
        background-color: black;
        width: 100%;
        height: 100%;
        opacity: 0.4;
        cursor: pointer;
        display: none;
    }
    `.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
    console.log(['MODAL END', str].join('\n'));
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, window);

(function(window, WINDOW, undefined){
    const str = '===============================================';
    console.log(['USER_OPTIONS START', str].join('\n'));
    const { scriptHandler, version, script } = typeof GM_info !== 'undefined' ? GM_info : {};
    console.log('script handler: ', scriptHandler, version);
    console.log('script version: ', script && script.name, script && script.version);
    const logoUrl = 'https://vk.com/images/svg_icons/ic_head_logo.svg';

    const USER_STORAGE_KEY = 'user-options';
    WINDOW.GM_notification = typeof WINDOW.GM_notification === 'function' ? WINDOW.GM_notification : function(options){
        try{
            let promise;
            if (Notification.permission !== 'granted') {
                promise = Notification.requestPermission();
            } else {
                promise = Promise.resolve('granted');
            }
            promise.then(function(permission){
                if (permission !== 'granted') {
                    return;
                }
                const notification = new Notification(options.title, { body: options.text, icon: options.image });
                if (options.timeout) {
                    setTimeout(notification.close, options.timeout);
                }
            });
		} catch (error) {
            console.error('[-] notification.error: ', error);
        }
    };
    function UserOptions(storage, eventEmitter, global){
        this._global = global;
        this._storage = storage;
        this._eventEmitter = eventEmitter;
        this.list = new UserOptionsData();
        this.data = this.list.reduce(function(acc, option, index){
            option.index = index;
            acc[option.key] = option;
            return acc;
        }, {});
        this._eventListener = this._eventListener.bind(this);
        this._flatternData = this._flatternData.bind(this);
        this._formatData = this._formatData.bind(this);
        for (const option of this.list) {
            this.eventEmitter.on(option.key, this._eventListener);
        }
        console.log('[+] UserOptions created');
    }
    UserOptions.prototype._eventListener = function(event, val, autosave = false) {
        const option = this.data[event];
        const ret = option.setValue(val);
        if (ret) {
            console.warn('value validation failed for event: ', event);
        }
        this.updateOldKey(option);
        this.updateLinkedOptions(option);
        this.updateTopLeftButton(option);
        this.updateNotification(option);
        if (this._isAutosave()) {
            this.saveData();
        }
        this.eventEmitter.emit('change-autosave', this._isAutosave());
    };
    UserOptions.prototype.updateLinkedOptions = function(option) {
        const { isParent, childNames } = option;
        if (isParent && childNames && childNames.length) {
            for (const name of childNames) {
                this.data[name].setValue(option.getValue());
                this.updateOldKey(this.data[name]);
            }
        }
        const { isChild, parentName } = option;
        const parent = this.data[parentName];
        if (isChild && parentName && parent && parent.isParent && Array.isArray(parent.childNames) && parent.childNames.indexOf(option.key) !== -1) {
            const parentValue = parent.getValue();
            let isCheckedAll = false;
            for (const name of parent.childNames) {
                isCheckedAll = this.data[name].getValue();
                if (!isCheckedAll) {
                    break;
                }
            }
            if (parentValue !== isCheckedAll) {
                parent.setValue(isCheckedAll);
                this.updateOldKey(parent);
            }
        }
        this.eventEmitter.emit('change-data', this.flatData, this.formatedData);
    };
    UserOptions.prototype.updateOldKey = function(option) {
        if (option.oldKey && typeof this._global[option.oldKey] !== 'undefined') {
            this._global[option.oldKey] = typeof option.value !== 'undefined' ? option.value : option.defaultValue;
        }
        if (option.category === 'logger' && option.key.indexOf('log-level') !== -1) {
            const name = option.key.slice(10);
            this.updateLogger(this._global.LOGGER, name, option.getValue());
        } else if (option.category === 'logger' && option.key === 'log-with-console') {
            this.updateLoggersAll(this._global.LOGGER);
        }
    };
    UserOptions.prototype.updateNotification = async function(option) {
        if (option.key === 'disable-noisy-notification') {
            const info = await this.storage.get('info', {});
            info.disabled = option.getValue();
            await this.storage.set('info', info);
        }
    };
    UserOptions.prototype._closeOnSave = function(){
        return this.data['save-and-close'].getValue();
    };
    UserOptions.prototype._closeOnDelete = function(){
        return this.data['delete-and-close'].getValue();
    };
    UserOptions.prototype._saveOnReset = function(){
        return this.data['reset-and-save'].getValue();
    };
    UserOptions.prototype._isAutosave = function(){
        var autosave = this.data[this._autosaveKey()];
        return autosave.getValue();
    };
    UserOptions.prototype._autosaveKey = function(){
        return 'autosave';
    };
    UserOptions.prototype.deleteData = async function(){
        await this.storage.remove(USER_STORAGE_KEY);
        this.eventEmitter.emit('delete-data');
    };
    UserOptions.prototype.fetchData = async function(){
        const listValues = await this.storage.listValues();
        this.firstLoad = listValues.indexOf(USER_STORAGE_KEY) === -1;
        await this.populateData();
        await this.saveData();
        console.log('[+] UserOptions data fetched from storage');
    };
    UserOptions.prototype.saveData = async function(){
        const flatData = this.flatData;
        await this.storage.set(USER_STORAGE_KEY, flatData);
        this.eventEmitter.emit('save-data', flatData, this._isAutosave());
    };
    UserOptions.prototype.resetDefault = async function(){
        for (const key of Object.keys(this.data)) {
            if (key === 'reset-and-save') continue;
            delete this.data[key].value;
        }
        if (this._isAutosave() || this._saveOnReset()) {
            await this.saveData();
        }
        this.eventEmitter.emit('change-data', this.flatData, this.formatedData);
        this.eventEmitter.emit('change-autosave', this._isAutosave());
    };
    UserOptions.prototype.populateData = async function(){
        const flatData = await this.storage.get(USER_STORAGE_KEY, this.flatData);
        this._updateData(flatData);
        for (const option of this.list) {
            this.updateOldKey(option);
            this.updateNotification(option);
        }
        this.eventEmitter.emit('change-data', flatData, this.formatedData);
    };
    UserOptions.prototype._updateData = function(flatData) {
        for (const key of Object.keys(flatData)) {
            if (this.data[key].defaultValue !== flatData[key]) {
                this.data[key].value = flatData[key];
            }
        }
    };
    UserOptions.prototype._flatternData = function(acc, key) {
        acc[key] = this.data[key].getValue();
        return acc;
    };
    UserOptions.prototype._formatData = function(acc, key) {
        const opt = this.data[key];
        if (opt.formatValue) {
            acc[key] = opt.formatValue();
            return acc;
        }
        return this._flatternData(acc, key);
    };
    UserOptions._findByKey = function(arr, key, val) {
        for (const item of arr) {
            if (item[key] === val) {
                return item;
            }
        }
        return null;
    };
    UserOptions.prototype.getTabs = function(){
        const tabs = this.list.reduce(function(acc, option){
            let category = UserOptions._findByKey(acc, 'title', option.category);
            if (!category) {
                category = {
                    title: option.category,
                    options: [],
                };
                acc.push(category);
            }
            const item = {};
            switch (option.type) {
                case 'number':
                case 'text':
                    item['data-type'] = 'number';
                case 'checkbox':
                    item.id = option.key;
                    item.type = option.type;
                    item.description = option.label;
                    item.title = option.description || '';
                    item.hidden = !!option.hidden;
                    if (option.type === 'checkbox') {
                        item.checked = option.defaultValue;
                    } else {
                        item.value = option.defaultValue;
                    }
                    break;
                default:
                    throw new Error(`option type (${option.type}) not available`);
            }
            category.options.push(item);
            return acc;
        }, []);
        return tabs;
    };
    UserOptions.onChange = function(e) {
        var name = e.target.getAttribute('name');
        if (name === 'ui-tab') {
            return;
        }
        var autosave = this._isAutosave();
        switch (e.target.type) {
            case 'checkbox':
            case 'radio':
                this.eventEmitter.emit(e.target.id, e.target.checked, autosave);
                break;
            default:
                this.eventEmitter.emit(e.target.id, e.target.value, autosave);
        }
    };
    UserOptions.prototype.events = function(){
        const uiContents = document.querySelector('.ui-contents');
        const fn = UserOptions.onChange.bind(this);
        uiContents.addEventListener('change', function(e) {
            if (e.isTrusted) fn(e);
        });
        console.log('[+] UserOptions events activated');
    };
    UserOptions.storageDescriptor = {
        get: function(){ return this._storage; },
        enumerable: true,
    };
    UserOptions.eventEmitterDescriptor = {
        get: function(){ return this._eventEmitter; },
        enumerable: true,
    };
    UserOptions.flatDataDescriptor = {
        get: function() {
            return Object.keys(this.data).reduce(this._flatternData, {});
        },
        enumerable: true,
    };
    UserOptions.formatedDataDescriptor = {
        get: function() {
            return Object.keys(this.data).reduce(this._formatData, {});
        }
    };
    Object.defineProperties(UserOptions.prototype, {
        storage: extend({}, UserOptions.storageDescriptor),
        eventEmitter: extend({}, UserOptions.eventEmitterDescriptor),
        flatData: extend({}, UserOptions.flatDataDescriptor),
        formatedData: extend({}, UserOptions.formatedDataDescriptor),
    });
    UserOptions.prototype.destroy = function(){
        for (const event of Object.keys(this.data)) {
            this.eventEmitter.off(event, this._eventListener);
        }
    };
    UserOptions.prototype.getLogLevel = function(){
        const regex = /log\-level/;
        const dt = this.data;
        const keys = Object.keys(this.data).filter(function(k){
            return dt[k].category === 'logger' && regex.test(k);
        });
        let level = 0;
        for (const key of keys) {
            level += logger[key].getValue() ? logger[key].level : 0;
        }
        return level;
    };
    UserOptions.prototype.updateLogger = function(_LOGGER, name, value) {
        const logConsole = this.data['log-with-console'].getValue();
        if (value) {
            _LOGGER[name] = _LOGGER.create(name, logConsole);
            console.log(`[+] LOGGER.${name} enabled ${logConsole ? '+ console' : ''}`);
        } else {
            const type = ['log', 'error', 'warn', 'info'].indexOf(name) !== -1 ? name : 'log';
            _LOGGER[name] = logConsole ? console[type] : function(){};
            console.log(`[+] LOGGER.${name} ${logConsole ? ('enabled as console.' + type) : 'disabled'}`);
        }
    };
    UserOptions.prototype.updateLoggersAll = function(_LOGGER) {
        const dt = this.data;
        const regex = /^log\-level\-(.*)$/;
        const keys = Object.keys(this.data).filter(function(k){
            return dt[k].category === 'logger' && k.indexOf('log-level') !== -1;
        });
        const enableAllLogs = this.data['enable-all-logs'].getValue();
        for (const key of keys) {
            this.updateLogger(_LOGGER, key.match(regex)[1], this.data[key].getValue() || enableAllLogs);
        }
    };
    UserOptions.prototype.updateTopLeftButton = function(option) {
        if (option.key !== 'hide-top-left-button') {
            return;
        }
        const btn = document.querySelector('.ui-vkmd-top-left');
        if (btn) {
            btn.classList[option.getValue() ? 'add' : 'remove']('hidden');
        }
    }

    function UserOptionsData() {
        const _setValue = function(val) {
            if (!this.validateValue) {
                this.value = val;
            } else if (this.validateValue(val)) {
                this.value = this.parseValue ? this.parseValue(val) : val;
            } else {
                return 1;
            }
            return 0;
        };
        const _getValue = function(){
            return typeof this.value !== 'undefined' ? this.value : this.defaultValue;
        };
        return [{
            category: 'hls',
            type: 'text',
            key: 'hls-max-size',
            oldKey: 'HLS_MAX_SIZE',
            label: 'maximum size',
            get description() {
                const min = { value: this.minValue };
                const max = { value: this.maxValue };
                return `maximum size of hls media to download (minimum ${this.formatValue.call(min)}, maximum ${this.formatValue.call(max)})`;
            },
            minValue: 100 * 1024 * 1024,
            maxValue: 2 * 1024 * 1024 * 1024,
            defaultValue: 1024 * 1024 * 1024,
            setValue: _setValue,
            getValue: _getValue,
            /**
             * @param {string|number} val
             * @return {boolean}
             */
            validateValue: function(val) {
                try {
                    const value = this.parseValue(val);
                    return value >= this.minValue && value <= this.maxValue;
                } catch (e) {
                    console.error('validateValue (hls-max-size) error: ', e);
                    return false;
                }
            },
            /**
             * @param {string|number} val size in B, KB, MB, GB
             * @return {number} size in bytes
             */
            parseValue: function(val) {
                if (typeof val === 'number') {
                    return Math.round(val);
                }
                if (typeof val !== 'string') {
                    throw new Error('parseValue (hls-max-size) invalid value type: ' + typeof val);
                }
                const match = val.match(/^([\d.]+)\s*([gmkbGMKB]+)?$/);
                if (!match) {
                    throw new Error('parseValue (hls-max-size) invalid value: ' + val);
                }
                const number = +match[1];
                const measure = (match[2] || '').toUpperCase();
                if (!measure) {
                    return Math.round(number);
                }
                switch (measure) {
                    case 'G':
                    case 'GB':
                        return Math.round(number * 1024 * 1024 * 1024);
                    case 'M':
                    case 'MB':
                        return Math.round(number * 1024 * 1024);
                    case 'K':
                    case 'KB':
                        return Math.round(number * 1024);
                    case 'B':
                        return Math.round(number);
                    default:
                        throw new Error('parseValue (hls-max-size) unknown size measure: ' + measure);
                }
            },
            /**
             * @return {string} size in B, KB, MB, or GB dependening of size value
             */
            formatValue: function(){
                const val = typeof this.value === 'number' ? this.value : this.defaultValue;
                const _1GB = 1024 * 1024 * 1024;
                if (val >= _1GB) {
                    return (val / _1GB).toFixed(1) + ' GB';
                }
                const _1MB = 1024 * 1024;
                if (val >= _1MB) {
                    return (val / _1MB).toFixed(0) + ' MB';
                }
                if (val >= 1024) {
                    return (val / 1024).toFixed(0) + ' KB';
                }
                return val + ' B';
            },
        }, {
            category: 'hls',
            type: 'text',
            key: 'hls-max-duration',
            oldKey: 'HLS_MAX_DURATION',
            label: 'maximum duration',
            get description() {
                const min = { value: this.minValue };
                const max = { value: this.maxValue };
                return `maximum duration of hls media to download (minimum ${this.formatValue.call(min)}, maximum ${this.formatValue.call(max)})`;
            },
            minValue: 1, // 1 second
            maxValue: 10 * 60 * 60, // 10 hours
            defaultValue: 3 * 60 * 60, // 3 hours
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function(val) {
                try {
                    const value = this.parseValue(val);
                    return value >= this.minValue && value <= this.maxValue;
                } catch (e) {
                    console.error('validateValue (hls-max-duration) error: ', e);
                    return false;
                }
            },
            /**
             * @param {string|number} val duration in seconds, minutes, hours
             */
            parseValue: function(val) {
                if (typeof val === 'number') {
                    return Math.round(val);
                }
                if (typeof val !== 'string') {
                    throw new Error('parseValue (hls-max-duration) invalid value type: ' + typeof val);
                }
                const match = val.match(/^([\d.]+)\s*([secondmiuthrSECONDMIUTHR]+)?$/);
                if (!match) {
                    throw new Error('parseValue (hls-max-duration) invalid value: ' + val);
                }
                const number = +match[1];
                const measure = (match[2] || '').toLowerCase();
                if (!measure) {
                    return Math.round(number);
                }
                switch (measure) {
                    case 's':
                    case 'sec':
                    case 'second':
                    case 'seconds':
                        return Math.round(number);
                    case 'm':
                    case 'min':
                    case 'minute':
                    case 'minutes':
                        return Math.round(number * 60);
                    case 'h':
                    case 'hour':
                    case 'hours':
                        return Math.round(number * 60 * 60);
                    default:
                        throw new Error('parseValue (hls-max-duration) unsupported duration measure: ', measure);
                }
            },
            formatValue: function(){
                const value = typeof this.value !== 'undefined' ? this.value : this.defaultValue;
                const _1h = 60 * 60;
                if (value >= _1h) {
                    return (value / _1h).toFixed(1) + ' h';
                }
                if (value >= 60) {
                    return (value / 60).toFixed(1) + ' min';
                }
                return Math.round(value) + ' sec';
            },
        },
        {
            category: 'hls',
            type: 'checkbox',
            key: 'download-ts',
            oldKey: 'DOWNLOAD_TS',
            label: 'download *.ts files',
            description: 'if true, then enable downloading of *.ts fragments of m3u8 playlist, otherwise convert m3u8 to mp3 by HLS library (not recommended)',
            defaultValue: true,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'logger',
            type: 'checkbox',
            key: 'log-with-console',
            oldKey: 'LOG_WITH_CONSOLE',
            label: 'log into console',
            description: 'print logs into console (press Shift+S to save logs)',
            defaultValue: false,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'logger',
            type: 'checkbox',
            key: 'enable-all-logs',
            oldKey: null,
            label: 'enable all loggers',
            isParent: true,
            childNames: [
                'log-level-log',
                'log-level-out',
                'log-level-audio',
                'log-level-ajax',
                'log-level-keydown',
                'log-level-att',
            ],
            level: -1,
            defaultValue: false,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'logger',
            type: 'checkbox',
            key: 'log-level-log',
            isChild: true,
            parentName: 'enable-all-logs',
            oldKey: null,
            level: 1,
            label: 'basic log level',
            defaultValue: false,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'logger',
            type: 'checkbox',
            key: 'log-level-out',
            isChild: true,
            parentName: 'enable-all-logs',
            oldKey: null,
            level: 2,
            label: 'log functions',
            defaultValue: false,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'logger',
            type: 'checkbox',
            key: 'log-level-audio',
            isChild: true,
            parentName: 'enable-all-logs',
            oldKey: null,
            level: 4,
            label: 'log audio events',
            defaultValue: false,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'logger',
            type: 'checkbox',
            key: 'log-level-ajax',
            isChild: true,
            parentName: 'enable-all-logs',
            oldKey: null,
            level: 8,
            label: 'log ajax requests',
            defaultValue: false,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'logger',
            type: 'checkbox',
            key: 'log-level-att',
            isChild: true,
            parentName: 'enable-all-logs',
            oldKey: null,
            level: 16,
            label: 'log audio tooltip events',
            defaultValue: false,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'logger',
            type: 'checkbox',
            key: 'log-level-keydown',
            isChild: true,
            parentName: 'enable-all-logs',
            oldKey: null,
            level: 32,
            label: 'log kedown events',
            defaultValue: false,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'advanced',
            type: 'checkbox',
            key: 'js-inline-cbox',
            oldKey: 'JS_INLINE',
            label: 'inline scripts',
            description: 'embed helper scripts (jQuery, jQuery.ui, Hls, UrlToolkit, JSZip) as inline scripts or as external ones',
            defaultValue: true,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'advanced',
            type: 'checkbox',
            key: 'use-custom-ua',
            oldKey: 'USE_CUSTOM_UA',
            label: 'try to fetch mp3 link',
            description: 'whether or not change User-Agent header to Edge\'s one in audio requests, P.S. Edge users can fetch direct mp3 links instead of m3u8',
            defaultValue: false,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'general',
            type: 'checkbox',
            key: 'autosave',
            label: 'autosave settings',
            defaultValue: true,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'general',
            type: 'checkbox',
            key: 'save-and-close',
            label: 'close on save',
            description: 'close settings modal after click on save button',
            defaultValue: true,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'general',
            type: 'checkbox',
            key: 'hide-top-left-button',
            hidden: true,
            label: 'hide vkmd button from top left',
            defaultValue: false,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'general',
            type: 'checkbox',
            key: 'delete-and-close',
            label: 'close on delete',
            description: 'close settings modal after click on delete button',
            defaultValue: true,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        },
        {
            category: 'general',
            type: 'checkbox',
            key: 'reset-and-save',
            label: 'save on reset',
            description: 'save data on reset',
            defaultValue: true,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        }, {
            category: 'general',
            type: 'checkbox',
            key: 'disable-noisy-notification',
            label: 'disable noisy notifications',
            description: 'update notifications',
            defaultValue: false,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        }, {
            category: 'general',
            type: 'checkbox',
            key: 'try-mp3-from-m3u8',
            oldKey: 'TRY_MP3_FROM_M3U8',
            label: 'try mp3 from m3u8',
            description: 'try to download mp3 file from m3u8 link',
            defaultValue: true,
            setValue: _setValue,
            getValue: _getValue,
            validateValue: function (val) { return typeof val === 'boolean'; },
        }];
    }
    function Storage(){
        if (typeof GM !== 'undefined' && typeof GM.getValue !== 'undefined' && typeof GM.setValue !== 'undefined' && typeof GM.deleteValue !== 'undefined') {
            this.getValue = GM.getValue;
            this.setValue = GM.setValue;
            this.deleteValue = GM.deleteValue;
            if (typeof GM.listValues !== 'undefined') {
                this.listValues = GM.listValues;
            } else {
                this.listValues = function() {
                    return Promise.reject(new Error('listValues not found'));
                };
            }
            if (localStorage.getItem(USER_STORAGE_KEY)) {
                console.warn('you have data in localStorage');
            }
            console.log('[+] GM storage');
        } else {
            this.getValue = async function(key, defaultValue) {
                const val = localStorage.getItem(key);
                return (typeof val === 'undefined' || val === null) ? defaultValue : val;
            };
            this.setValue = async function(key, value) {
                localStorage.setItem(key, value);
            };
            this.deleteValue = async function(key) {
                localStorage.removeItem(key);
            };
            this.listValues = async function() {
                return Object.keys(localStorage);
            };
            console.log('[+] localStorage');
        }
    }
    /**
     * @param {string} key
     * @param {string|number|Object.<string, any>} [defaultValue]
     * @return {Promise.<Object.<string, any>|string|number|boolean>}
     */
    Storage.prototype.get = async function(key, defaultValue) {
        const val = await this.getValue(key, defaultValue);
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            } catch (e) {}
        }
        return val;
    };
    /**
     * @param {string} key
     * @param {any} value
     * @return {Promise.<void>}
     */
    Storage.prototype.set = async function(key, value) {
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        await this.setValue(key, value);
    };
    Storage.prototype.keys = function() {
        return this.listValues();
    };
    Storage.prototype.remove = function(key) {
        return this.deleteValue(key);
    };
    
    function UInterface(){}
    UInterface.create = function(config){
        // ui HTMLElement
        let div = document.createElement('div');
        div.innerHTML = UInterface.createHTML(config);
        UInterface.element = div.firstChild;
        // ui VkMD button
        div.innerHTML = '<label for="modal-checkbox" class="top_nav_link ui-vkmd ui-vkmd-top-left">VkMD</label>';
        UInterface.button = div.firstChild;
        if (config.hiddenTopLeftButton) {
            UInterface.button.classList.add('hidden');
        }
        div.innerHTML = '<label for="modal-checkbox" class="top_profile_mrow ui-vkmd-right" style="cursor:pointer">VkMD</label>';
        UInterface.button2 = div.firstChild;
        // ui VkMD button (mobile)
        div.innerHTML = `<label for="modal-checkbox" class="MainMenu__menuItem al_menu Row" href="/vkmd" data-skiponclick="1" style="cursor: pointer;">
          <div class="MainMenu__menuItemIcon Icon Icon_menu_vkmd"></div>
          <div class="MainMenu__menuItemTitle">Vk Media Downloader</div>
        </label>`.replace(/\n+/g, '');
        UInterface.button3 = div.firstChild;
        
        div.innerHTML = `<li class="mmi_vkmd">
        <label for="modal-checkbox" style="cursor: pointer" href="/vkmd" data-skiponclick="1" class="mm_item al_menu" data-header="Vk Media Downloader">
          <i class="i_icon"></i>
          <span class="mmi_wrap">
            <span class="mm_label">Vk Media Downloader</span>
          </span>
        </label></li>`.replace(/\n+/g, '');
        UInterface.button4 = div.firstChild;
        // left button
        div.innerHTML = `<li id="l_vkmd">
          <label for="modal-checkbox" href="/apps?act=vkmd" class="left_row" style="cursor: pointer">
            <span class="left_fixer" style="cursor: pointer;">
              <span class="left_count_wrap fl_r left_void" style="opacity: 1; display: block;">
                <span class="inl_bl left_count_sign"></span>
              </span>
              <span class="left_icon fl_l"></span>
              <span class="left_label inl_bl">VkMD</span>
            </span>
          </label>
          <div class="left_settings" onclick="menuSettings(0)">
            <div class="left_settings_inner"></div>
          </div>
        </li>`.replace(/\n+/g, '');
        UInterface.button5 = div.firstChild;
        // popup settings button
        div.innerHTML = `<a onclick="return Settings.toggleMenuBoxRow(this, 0, 'no_apps_manage')" class="olist_item_wrap olist_item_menu olist_item_vkmd olist_item_wrap_on">
          <div class="olist_item clear_fix">
            <span class="olist_checkbox fl_r"></span>
            <span class="olist_item_photo fl_l"></span>
            <span class="olist_item_name fl_l">Vk Media Downloader</span>
          </div>
        </a>`.replace(/\n+/g, '');
        UInterface.settingsButton = div.firstChild;
        // ui-style
        const style = document.createElement('style');
        style.classList.add('ui-style');
        style.innerHTML = UInterface.css;
        UInterface.style = style;
        console.log('[+] UInterface created');
    };
    UInterface.insert = function(root) {
        // insert to DOM
        (root || document.body).appendChild(UInterface.element);
        document.head.appendChild(UInterface.style);
        
        const pageHeaderWrap = document.querySelector('#page_header_wrap');
        const headNavItem = document.querySelector('.head_nav .head_nav_item');
        if (headNavItem) {
            headNavItem.appendChild(UInterface.button);
        } else if (pageHeaderWrap) {
            pageHeaderWrap.appendChild(UInterface.button);
        } else {
            UInterface.button.style.position = 'fixed';
            UInterface.button.style.zIndex = 100;
            document.body.appendChild(UInterface.button);
        }
        
        const supportLink = document.querySelector('#top_support_link');
        if (supportLink) {
            supportLink.parentNode.insertBefore(UInterface.button2, supportLink.nextSibling);
            const sep = document.querySelector('.top_profile_sep');
            if (sep) {
                supportLink.parentNode.insertBefore(sep.cloneNode(true), supportLink.nextSibling);
            }
        }
        // left side button
        if (!document.querySelector('#side_bar .side_bar_inner #l_vkmd')) {
            const sideBarInner = document.querySelector('#side_bar .side_bar_inner nav ol');
            if (sideBarInner) {
                sideBarInner.appendChild(UInterface.button5);
            }
        }
        // popup settings button
        /*
        const insertSettingButton = function (node) {
            console.log('insert settings button');
            console.log('node: ', node ? node.cloneNode(true) : node);
            const section = (node || document).querySelector('.settings_menu_rows .olist_section');
            if (section && !section.querySelector('.olist_item_vkmd')) {
                section.appendChild(UInterface.settingsButton);
                console.log('inserted');
            }
        };
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        const observer = new MutationObserver(function (mutations) {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    console.log('added node: ', node.classList);
                    if (node.nodeType !== 1) {
                        continue;
                    }
                    if (node.classList.contains('olist_section') || node.querySelector('.olist_section')) {
                        try {
                            insertSettingButton();
                        } catch (e) {
                            console.error('error: ', e);
                        }
                    }
                }
            };
        });
        try {
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        } catch (e) {
            console.error('popup_box_container observer error: ', e);
        }
        */
        // mobile buttons
        UInterface.insertMobileButtons();
        console.log('[+] UInterface inserted into DOM, root element: ', root);
    };
    UInterface.insertMobileButtons = function () {
        if (!document.querySelector('.MainMenu__menuItem Icon_menu_vkmd')) {
            const mainMenuItems = document.querySelectorAll('.MainMenu__menuItem');
            if (mainMenuItems.length) {
                mainMenuItems[0].parentNode.insertBefore(UInterface.button3, mainMenuItems[mainMenuItems.length - 1]);
            }
        }
        if (!document.querySelector('.main_menu mmi_vkmd')) {
            const mainMenuLi = document.querySelectorAll('.main_menu > li');
            if (mainMenuLi.length) {
                mainMenuLi[0].parentNode.insertBefore(UInterface.button4, mainMenuLi[mainMenuLi.length - 1]);
            }
        }
    };
    UInterface.events = function() {
        // listen to change events of radio inputs
        const uiContents = document.querySelector('.ui-contents');
        const fn = UInterface.onChangeTab;
        uiContents.addEventListener('change', function(e) { fn(e); });
        UInterface.onChangeTab({ target: uiContents.querySelector('input') });
        console.log('[+] UInterface events activated');
    };
    UInterface.onChangeTab = function(e){
        // add .checked className
        const tab = document.querySelector(`label.ui-tab[for="${e.target.id}"]`);
        if (!tab) {
            return;
        }
        tab.classList.add('checked');
        // remove .checked className
        const tabs = [].slice.call(document.querySelectorAll(`label.ui-tab:not([for="${e.target.id}"])`));
        for (const t of tabs) {
            t.classList.remove('checked');
        }
    };
    UInterface.createHTML = function(config) {
        var tabs = config.tabs;
        var title = config.title || 'head';
        var titles = {
            del: config.deleteTitle || 'Delete data from storage',
            reset: config.resetTitle || 'Reset data to default ones',
            save: config.saveTitle || 'Save data to storage',
        };
        return `
        <div class="ui-container">
            <div class="ui-head modal-header">
                <div class="ui-head-title">${title}</div>
                <label for="modal-checkbox" title="close" class="modal-close-x"><div></div></label>
                <div class="ui-flash-message hidden"></div>
            </div>
            <div class="ui-body">
                <div class="ui-vklogo-container">
                    <img class="ui-vklogo" src="${logoUrl}" />
                </div>
                <div class="ui-tabs">
                    ${tabs.map(Tab.createHTML).join('')}
                </div>
                <div class="ui-contents">
                    ${tabs.map(Content.createHTML).join('')}
                </div>
            </div>
            <div class="ui-foot">
                <div class="ui-button-vkmd ui-delete touchable" title="${titles.del}">
                    <svg version="1.1" id="recycle-t2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 465.311 465.311" style="enable-background:new 0 0 465.311 465.311;" xml:space="preserve" width="24" height="24"><g><g>
                        <path d="M372.811,51.002h-59.908V36.566C312.902,16.404,296.499,0,276.335,0h-87.356c-20.163,0-36.567,16.404-36.567,36.566v14.436   H92.5c-20.726,0-37.587,16.861-37.587,37.587v38.91c0,8.284,6.716,15,15,15h7.728v307.812c0,8.284,6.716,15,15,15H372.67   c8.284,0,15-6.716,15-15V142.499h7.728c8.284,0,15-6.716,15-15v-38.91C410.397,67.863,393.536,51.002,372.811,51.002z    M182.412,36.566c0-3.621,2.946-6.566,6.567-6.566h87.356c3.621,0,6.567,2.946,6.567,6.566v14.436h-100.49V36.566z M84.914,88.589   c0-4.184,3.403-7.587,7.587-7.587h280.31c4.184,0,7.587,3.403,7.587,7.587v23.91H84.914V88.589z M357.67,435.311H107.641V142.499   H357.67V435.311z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path>
                        <path d="M137.41,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988   C127.41,409.008,131.887,413.485,137.41,413.485z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path>
                        <path d="M200.907,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988   C190.907,409.008,195.384,413.485,200.907,413.485z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path>
                        <path d="M264.404,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988   C254.404,409.008,258.881,413.485,264.404,413.485z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path>
                        <path d="M327.901,413.485c5.523,0,10-4.477,10-10V166.497c0-5.523-4.477-10-10-10s-10,4.477-10,10v236.988   C317.901,409.008,322.378,413.485,327.901,413.485z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path>
                        </g></g>
                    </svg>
                </div>
                <div class="ui-button-vkmd ui-reset touchable" title="${titles.reset}">
                    <svg version="1.1" id="recycle-c1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 383.631 383.631" style="enable-background:new 0 0 383.631 383.631;" xml:space="preserve" width="24" height="24" class="">
                        <g><path d="M47.331,210.289c-1.408,1.375-3.273,2.296-5.374,2.508c-0.116,0.012-0.232,0.021-0.349,0.029  c-0.006,0-0.013,0.001-0.02,0.001c-0.185,0.011-0.367,0.017-0.549,0.017c-2.109,0-4.073-0.737-5.624-1.982  c-0.001,0-0.001,0-0.001-0.001c-0.007-0.005-0.013-0.01-0.019-0.015c-0.002-0.001-0.004-0.003-0.006-0.004  c-0.004-0.003-0.009-0.007-0.013-0.011c-0.003-0.002-0.007-0.005-0.01-0.008s-0.006-0.005-0.009-0.007  c-0.004-0.003-0.009-0.007-0.013-0.01c-0.002-0.001-0.004-0.003-0.006-0.005c-0.005-0.004-0.011-0.008-0.016-0.013  c-0.046-0.038-0.092-0.077-0.138-0.116c-0.006-0.005-0.012-0.01-0.018-0.015c-0.001-0.001-0.002-0.002-0.003-0.002  c-0.005-0.004-0.01-0.009-0.016-0.013c-0.001-0.002-0.004-0.004-0.006-0.005c-0.004-0.004-0.008-0.007-0.013-0.011  c-0.003-0.002-0.006-0.005-0.009-0.007c-0.003-0.003-0.006-0.006-0.01-0.009c-0.004-0.004-0.009-0.008-0.014-0.012  c-0.001-0.002-0.003-0.003-0.005-0.005c-0.207-0.183-0.405-0.375-0.595-0.575L2.505,176.658c-3.44-3.587-3.322-9.285,0.266-12.725  c3.587-3.44,9.284-3.322,12.725,0.265l16.426,17.125c3.887-58.736,40.101-111.535,95.123-135.771  c39.08-17.212,82.524-18.177,122.331-2.714c39.805,15.462,71.206,45.501,88.417,84.582c2.004,4.549-0.06,9.861-4.608,11.864  c-4.55,2.003-9.862-0.061-11.864-4.609c-15.273-34.68-43.139-61.336-78.462-75.058c-35.322-13.721-73.875-12.867-108.558,2.409  C85.342,83.591,53.163,130.64,49.854,182.927l18.381-17.632c3.589-3.44,9.285-3.322,12.726,0.265s3.322,9.284-0.265,12.725  L47.331,210.289z M381.087,207.409l-32.648-33.615c-1.759-1.838-4.291-2.921-7-2.769c-0.005,0-0.01,0-0.017,0.001  c-0.143,0.008-0.285,0.02-0.428,0.034c-2.123,0.221-4.005,1.169-5.415,2.575l-32.732,32.273c-3.54,3.49-3.58,9.188-0.091,12.728  c3.491,3.54,9.189,3.58,12.728,0.09l17.594-17.346c-3.513,52.052-35.643,98.837-84.405,120.314  c-18.545,8.168-37.91,12.033-56.982,12.032c-54.556-0.002-106.675-31.636-130.038-84.682c-2.003-4.548-7.314-6.612-11.864-4.609  c-4.549,2.003-6.612,7.315-4.608,11.864c26.329,59.781,85.053,95.43,146.536,95.426c21.487-0.001,43.319-4.357,64.213-13.559  c55.03-24.239,91.261-77.082,95.127-135.845l17.12,17.627c3.463,3.565,9.16,3.649,12.727,0.186  C384.467,216.673,384.55,210.975,381.087,207.409z" data-original="#000000" class="active-path" data-old_color="#000000" style="fill:#FFFFFF"></path></g>
                    </svg>
                </div>
                <div class="ui-button-vkmd ui-save touchable" title="${titles.save}">
                Save
                </div>
            </div>
        </div>
        `.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
    };
    function Tab({ title, options }) {
        var tab = { title };
        Object.defineProperty(tab, 'inputId', {
            get: function(){
                return `${this.title.replace(/\s+/g, '-')}-options`;
            },
            enumerable: true,
        });
        tab.options = options || [];
        return tab;
    }
    Tab.createHTML = function(tab) {
        return `
        <label class="ui-tab touchable" for="${tab.inputId}" title="${tab.title}">
            <span>${tab.title}</span>
        </label>
        `.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
    };
    function Content() {}
    Content.createHTML = function(tab, index) {
        return `
        <input id="${tab.inputId}" style="display: none" type="radio" name="ui-tab" ${index === 0 ? 'checked' : ''} />
        <div class="ui-content">
            <div class="ui-content-title">${tab.title}</div>
            <div class="ui-content-options">${tab.options.map(Option.createHTML).join('')}</div>
        </div>
        `.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
    };
    function Option(){}
    Option.createHTML = function(option, index) {
        Option._count = (Option._count || 0) + 1;
        return (option && option.html ? `
        <div class="ui-option${option.hidden ? ' hidden' : ''}">
            ${option.html}
        </div>` : `
        <div class="ui-option touchable">
            <input type="checkbox" id="option-${index}-${Option._count}"/>
            <label for="option-${index}-${Option._count}">option-${index}-${Option._count}</label>
        </div>
        `).replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
    };
    /**
     * @typedef {{
     *   id: string,
     *   type: string,
     *   size?: string,
     *   min?: string|number,
     *   max?: string|number,
     *   name?: string,
     *   className?: string,
     *   value?: string,
     *   checked?: string,
     * }} InputConfigType
     * @typedef {{
     *   id: string,
     *   description: string,
     *   className?: string,
     * }} LabelConfigType
     * @typedef {{
     *   value: string,
     *   description: string,
     *   className?: string,
     *   selected?: boolean,
     * }} OptionConfigType
     * @typedef {InputConfigType & { html: string }} InputType
     * @typedef {{
     *   for: string,
     *   description: string,
     *   className?: string,
     *   html: string,
     * }} LabelType
     * @typedef {OptionConfigType & { html: string }} OptionType
     */
    /**
     * RadioGroup
     *
     * @param {{
     *   name: string,
     *   className?: string,
     *   radios: (InputConfigType & LabelConfigType & { reverse?: boolean })[],
     * }} config
     * @return {{
     *   radios: { input: InputType, label: LabelType, reverse?: boolean }[],
     *   html: string,
     * }}
     */
    function RadioGroup(config) {
        const { className, name } = config;
        const radios = config.radios.map(r => Radio(extend({}, r, { name })));
        const radioGroup = { radios };
        radioGroup.html = `
        <div class="${className || ''}">
            ${radios.map(wrapRadio).join('')}
        </div>
        `.replace(/\s+/g, ' ').split(/\n/g).join(' ').trim();
        return radioGroup;
    }
    /**
     * Select
     *
     * @param {{ options: OptionConfigType[] }} config
     * @return {{
     *   options: OptionType[],
     *   html: string,
     * }}
     */
    function Select(config) {
        const { className } = config;
        const options = config.options.map(SOption);
        const select = { options };
        select.html = `
        <select class="${className || ''}">
            ${options.map(wrapOpt).join('')}
        </select>
        `.replace(/\s+/g, ' ').split(/\n/g).join(' ').trim();
        return select;
    }
    function Radio(config) {
        return Checkbox(extend({}, config, { type: 'radio' }));
    }
    /**
     * @param {{ html: string }} option
     * @return {string}
     */
    function wrapOpt(option) {
        return `
        <div class="div-select-option">
            ${option.html}
        </div>
        `.replace(/\s+/g, ' ').split(/\n/g).join(' ').trim();
    }
    /**
     * @param {{ name: string, html: string }} radio
     * @return {string}
     */
    function wrapRadio(radio) {
        return `
        <div class="div-radio-${radio.name || 'item'}">
            ${radio.html}
        </div>
        `.replace(/\s+/g, ' ').split(/\n/g).join(' ').trim();
    }
    /**
     * SOption
     *
     * @param {OptionConfigType} config
     * @return {OptionType}
     */
    function SOption(config) {
        const {
            value,
            description,
            selected,
            className,
        } = config;
        const option = { value, description, className, selected };
        option.html = `
        <option
            value="${value}"
            ${selected ? 'selected' : ''}
            ${className ? 'class="' + className + '"' : ''}
        >${description}</option>
        `.replace(/\s+/g, ' ').split(/\n/g).join(' ').trim();
        return option;
    }
    /**
     * Input
     *
     * @param {InputConfigType} config
     * @return {InputType}
     */
    function Input(config){
        const {
            id,
            type,
            name,
            className,
            value,
            checked,
            size,
            min,
            max,
            'data-type': dataType,
            hidden,
        } = config;
        const input = {
            id,
            type,
            name,
            className,
            value,
            checked,
            size,
            min,
            max,
            'data-type': dataType,
            hidden,
        };
        input.html = `
        <input
            id="${id}"
            type="${type}"
            ${name ? 'name="' + name + '"' : ''}
            ${typeof min !== 'undefined' ? 'min="' + min + '"' : ''}
            ${typeof max !== 'undefined' ? 'max="' + max + '"' : ''}
            ${typeof size !== 'undefined' ? 'size="' + size + '"' : ''}
            ${className ? 'class="' + className + '"' : ''}
            ${value ? 'value="' + value + '"' : ''}
            ${dataType ? 'data-type="' + dataType + '"' : ''}
            ${checked ? 'checked' : ''}
        />
        `.replace(/\s+/g, ' ').split(/\n/g).join(' ').trim();
        return input;
    }
    /**
     * Label
     *
     * @param {LabelConfigType} config
     * @return {LabelType}
     */
    function Label(config){
        const { id, description, className, title, hidden } = config;
        const label = {
            'for': id,
            description,
            className,
        };
        label.html = `
        <label
            for="${id}"
            ${title ? 'title="' + title + '"' : ''}
            ${className ? 'class="' + className + '"' : ''}
        >${description}</label>
        `.replace(/\s+/g, ' ').split(/\n/g).join(' ').trim();
        return label;
    }
    /**
     * Checkbox
     *
     * @param { InputConfigType & LabelConfigType & { reverse?: boolean } } config
     * @return {{
     *   input: InputType,
     *   label: LabelType,
     *   reverse?: boolean,
     *   html: string,
     * }}
     */
    function Checkbox(config) {
        config.type = config.type || 'checkbox';
        var input = Input(config);
        var label = Label(extend({}, config, { className: config.labelClass }));
        var checkbox = { input, label, reverse: config.reverse };
        checkbox.html = config.reverse ? label.html + input.html : input.html + label.html;
        return checkbox;
    }
    UInterface.css = `
    .ui-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        width: 100%;
        overflow: auto;
        font-family: consolas;
        background-color: #edeef0;
    }
    /*.ui-head:before {
        content: "";
        margin-left: 10px;
    }*/
    .ui-head {
        position: relative;
        background-color: #4a76a8;
        font-size: 20px;
        flex: 0;
        justify-content: space-between;
        color: #fff;
    }
    .ui-body {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        flex-grow: 1;
        flex-shrink: 1;
        flex-basis: 100%;
        overflow: auto;
        color: #285473;
        position: relative;
        opacity: 0.99;
        background-color: #edeef0;
        z-index: 11;
    }
    .ui-foot {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        flex: 0;
        width: 100%;
        background-color: #4a76a8;
        height: 40px;
    }
    .ui-flash-message.hidden {
        display: block;
        opacity: 0;
        z-index: -1;
        bottom: -100%;
    }
    .ui-flash-message {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 10;
        background-color: #1ed00e;
        text-align: center;
        text-transform: capitalize;
        opacity: 1;
        transition: all .2s;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .ui-head-title {
        margin-left: 10px;
    }
    .ui-tabs {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        flex: 1;
        /*margin-left: 10px;*/
        /*padding-right: 5px;*/
        overflow-y: auto;
    }
    .ui-contents {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        flex: 2;
        border-left: 1px #4a76a8 solid;
        overflow: auto;
        /*scrollbar-color: #4a76a8 #edeef0;*/
        opacity: 0.99;
        position: relative;
    }
    /*
    .ui-contents::-webkit-scrollbar-thumb {
        background-color: #4a76a8;
    }
    .ui-contents::-webkit-scrollbar-track-piece{
        background-color: #edeef0;
    }
    */
    .ui-button-vkmd {
        margin: 5px 10px;
        padding: 0 10px;
        cursor: pointer;
        height: 100%;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .ui-button-vkmd:hover {
        background-color: #3d6898;
    }
    .ui-button-vkmd.ui-delete,
    .ui-button-vkmd.ui-reset {
        width: 24px;
    }
    .ui-button-vkmd.ui-save {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
    }
    .ui-save.hidden {
        display: none;
    }
    .ui-tab {
        width: calc(100% - 15px);
        text-transform: capitalize;
        padding-left: 10px;
        padding-right: 5px;
        line-height: 30px;
        cursor: pointer;
    }
    .ui-tabs .ui-tab:hover {
        background-color: #e1e5eb;
    }
    .ui-option.hidden {
        display: none;
    }
    .ui-option:hover {
        background-color: rgba(225, 229, 235, 0.5);
    }
    .ui-tab.checked {
        background-color: #e1e5eb;
        text-decoration: underline;
    }
    input[name="ui-tab"]:checked + .ui-content {
        display: flex;
        opacity: 1;
        transition: all .25s;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        flex: 1;
        width: 100%;
    }
    .ui-vklogo-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        position: absolute;
        z-index: -1;
    }
    .ui-vklogo {
        position: absolute;
        z-index: -1;
        opacity: 0.75;
        width: 50%;
        margin-right: 10%;
    }
    .ui-content {
        display: none;
        opacity: 0;
        overflow-y: auto;
    }
    .ui-content-title {
        display: flex;
        align-self: center;
        text-transform: uppercase;
        line-height: 30px;
        font-weight: 700;
        font-size: 20px;
    }
    .ui-content-options {
        overflow: auto;
        width: 100%;
    }
    .ui-option {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        cursor: pointer;
        width: 100%;
        line-height: 30px;
    }
    .ui-option > input {
        margin-left: 5px;
        font-family: consolas;
    }
    .ui-option label {
        width: 100%;
        cursor: pointer;
    }
    .ui-option > input[type="number"] + label,
    .ui-option > input[type="text"][data-type="number"] + label
    {
        margin-left: 5px;
    }
    .ui-option > input[type="number"],
    .ui-option > input[type="text"][data-type="number"]
    {
        max-width: 4.5em;
        min-width: 3em;
        padding: 0 5px;
        height: 25px;
        border: 1px solid #d3d9de;
        background: rgba(255, 255, 255, 0.6);
    }
    .ui-option > input[type="text"][data-type="number"]::-webkit-inner-spin-button,
    .ui-option > input[type="text"][data-type="number"]::-webkit-outer-spin-button,
    .ui-option input[type="number"]::-webkit-inner-spin-button,
    .ui-option input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0;
    }
    .ui-option input[type="number"],
    .ui-option input[type="text"][data-type="number"] {
        -moz-appearance: textfield;
    }
    .ui-option select {
        -webkit-appearance: none;
        -moz-appearance: none;
        text-indent: 1px;
        text-overflow: '';
    }
    .ui-vkmd {
        position: absolute;
        color: #fff;
        line-height: 42px;
        top: 0;
        left: 80px;
        font-weight: 700;
        cursor: pointer;
    }
    .ui-vkmd.hidden {
        display: none;
    }
    .MainMenu__menuItemIcon.Icon_menu_vkmd:before {
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiM4MDgwODAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
        width: 24px;
        height: 24px;
        opacity: 0.65;
    }
    .mmi_vkmd .i_icon {
        background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiM5ZGE4YmMiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
    }
    #l_vkmd .left_icon.fl_l {
        background: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiM3ZDljYjgiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K) no-repeat 7px;
    }
    .settings_menu_rows .olist_item_menu.olist_item_vkmd .olist_item_photo {
        background: #e6edf4 url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiM3ZDljYjgiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K) no-repeat 8px;
    }
    `.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
    function EventEmitter() {
        this.listeners = {};
    }
    EventEmitter.validateEvent = function (event) {
        return !!event && (typeof event === 'string' || typeof event === 'symbol');
    };
    EventEmitter.validateCallback = function (callback) {
        return typeof callback === 'function';
    };
    EventEmitter.prototype.on = function (event, callback, once = false) {
        if (!EventEmitter.validateEvent(event)) {
            throw new Error('invalid event');
        }
        if (!EventEmitter.validateCallback(callback)) {
            throw new Error('invalid callback');
        }
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push({ callback, once });
    };
    EventEmitter.prototype.once = function (event, callback) {
        this.on(event, callback, true);
    };
    EventEmitter.prototype.off = function (event, callback) {
        const list = this.listeners[event] || [];
        if (!list.length) {
            return;
        }
        if (!callback) {
            list.length = 0;
            return;
        }
        for (let i = 0; i < list.length; ++i) {
            if (list[i].callback === callback) {
                list.splice(i, 1);
                return;
            }
        }
    };
    EventEmitter.prototype.emit = function (event) {
        const list = this.listeners[event] || [];
        const args = Array.prototype.slice.call(arguments);
        console.log(`${args[0]}: `, ...args.slice(1));
        for (const { callback } of list) {
            try {
                callback(...args);
            } catch (error) {
                console.error(error);
            }
        }
        const oldList = list.slice();
        list.length = 0;
        for (const item of oldList) {
            if (!item.once) {
                list.push(item);
            }
        }
    };
    function extend(target) {
        target = target || {};
        for (let i = 1; i < arguments.length; ++i) {
            const arg = arguments[i];
            for (const key of Object.keys(arg)) {
                if (typeof arg[key] !== 'undefined') {
                    target[key] = arg[key];
                }
            }
        }
        return target;
    }
    const single = {};
    async function createData(global) {
        if (single.calledCreateData) return;
        const eventEmitter = new EventEmitter();
        const storage = new Storage();
        const userOptions = new UserOptions(storage, eventEmitter, global);
        await userOptions.fetchData();
        single.calledCreateData = true;
        return userOptions;
    }
    async function attachInterface(userOptions) {
        if (single.calledAttachInterface) return;
        const global = userOptions._global;
        const eventEmitter = userOptions.eventEmitter;
        const storage = userOptions.storage;
        const activateFooterButtons = function(){
            const delBtn = document.querySelector('.ui-foot .ui-button-vkmd.ui-delete');
            delBtn.addEventListener('click', function(){
                userOptions.deleteData();
                if (userOptions._closeOnDelete()) {
                    document.querySelector('#modal-checkbox').checked = false;
                }
            });
            const resetBtn = document.querySelector('.ui-foot .ui-button-vkmd.ui-reset');
            resetBtn.addEventListener('click', function(){
                userOptions.resetDefault();
            });
            const saveBtn = document.querySelector('.ui-foot .ui-button-vkmd.ui-save');
            saveBtn.addEventListener('click', function(){
                userOptions.saveData();
                if (userOptions._closeOnSave()) {
                    document.querySelector('#modal-checkbox').checked = false;
                }
            });
            console.log('[+] UInterface footer buttons activated');
        };
        const tabsOrder = ['general', 'logger', 'hls', 'advanced'];
        const tabs = userOptions.getTabs().sort(function(a, b){
            return tabsOrder.indexOf(a.title) - tabsOrder.indexOf(b.title);
        });
        tabs.forEach(function(tab){
            tab.options = tab.options.map(function(option){
                switch (option.type) {
                    case 'select':
                        return Select(option);
                    case 'radio-group':
                    case 'radioGroup':
                        return RadioGroup(option);
                    case 'number':
                    case 'checkbox':
                    case 'text':
                        return Checkbox(option);
                    default:
                        return Checkbox(option);
                }
            });
        });

        UInterface.create({
            title: `${global.SCRIPT_NAME} ${global.SCRIPT_VERSION}`,
            tabs: tabs.map(Tab),
            hiddenTopLeftButton: userOptions.data['hide-top-left-button'].getValue(),
        });
        UInterface.insert(document.querySelector('.modal-content'));
        UInterface.events();
        userOptions.events();
        activateFooterButtons();
        const onChangeAutosave = function(event, value) {
            const btn = document.querySelector('.ui-button-vkmd.ui-save');
            if (!btn) return;
            btn.classList[value ? 'add' : 'remove']('hidden');
        };
        onChangeAutosave(null, userOptions._isAutosave());
        eventEmitter.on('change-autosave', onChangeAutosave);
        const onChangeData = function(event, flatData, formatedData) {
            var inputs = [].slice.call(document.querySelectorAll('.ui-option input'));
            for (const input of inputs) {
                switch (input.type) {
                    case 'checkbox':
                    case 'radio':
                        input.checked = formatedData[input.id];
                        break;
                    default:
                        input.value = formatedData[input.id];
                }
            }
        };
        eventEmitter.on('change-data', onChangeData);
        const timer = {};
        eventEmitter.on('save-data', function(event, flatData, isAutosave){
            if (isAutosave) {
                return;
            }
            const flashMessage = document.querySelector('.ui-flash-message');
            if (!flashMessage) {
                return;
            }
            for (const timerId of Object.keys(timer)) {
                clearTimeout(timerId);
            }
            flashMessage.classList.remove('hidden');
            flashMessage.innerHTML = 'data saved';
            flashMessage.style.backgroundColor = '#1ed00e';
            timer.saveTimerId = setTimeout(function(){
                flashMessage.classList.add('hidden');
            }, 1500);
        });
        eventEmitter.on('delete-data', function(){
            const flashMessage = document.querySelector('.ui-flash-message');
            if (!flashMessage) {
                return;
            }
            for (const timerId of Object.keys(timer)) {
                clearTimeout(timerId);
            }
            flashMessage.classList.remove('hidden');
            flashMessage.style.backgroundColor = '#ff1515';
            flashMessage.innerHTML = 'data deleted';
            timer.deleteTimerId = setTimeout(function(){
                flashMessage.classList.add('hidden');
            }, 1500);
        });
        console.log('[+] UserSettings (Modal + UserOptions + UInterface) creation complete');
        onChangeData(null, null, userOptions.formatedData);
        single.calledAttachInterface = true;
    }
    WINDOW.createData = createData;
    WINDOW.attachInterface = attachInterface;
    WINDOW.createStorage = function(){ return new Storage(); };
    function DOMReady(callback) {
        let resolve;
        const promise = new Promise(function(res){ resolve = res; });
        const func = function(){
            resolve();
            if (callback) callback();
        };
        switch (document.readyState) {
            case 'loading':
                document.addEventListener('DOMContentLoaded', function(){ func(); });
                break;
            default:
                setTimeout(func, 10);
        }
        return promise;
    }
    console.log(['USER_OPTIONS END', str].join('\n'));
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, window);

(function(window, WINDOW, undefined){
    const storage = WINDOW.createStorage ? WINDOW.createStorage() : null;
    const notification = {
        ru: 'Вышла новая версия (v%version%), пожалуйста, обновите скрипт',
        en: 'New version is available (v%version%), please update the script',
    };
    let lang;
    try {
        lang = (navigator.language || navigator.userLanguage).match(/^([a-zA-Z]+)/)[1];
    } catch (e) {}
    lang = (lang || 'en').toLowerCase();
    function Meta() {}
    Meta.prototype.load = async function(id) {
        try {
            this.id = id || 1;
            const { data } = await request({ url: `${this.url}?r=${Date.now()}` });
            this.data_raw = data;
            return data;
        } catch (error) {
            console.error('[meta] load.error: ', error, this);
        }
    };
    Object.defineProperty(Meta.prototype, 'url', {
        get: function(){
            return `https://greasyfork.org/scripts/${this.id}/code/script.meta.js`;
        },
    });
    Meta.prototype.parse = function() {
        const { data_raw } = this;
        if (!data_raw || typeof data_raw !== 'string') {
            return null;
        }
        const self = this;
        this.data = data_raw.split('\n').filter(function(line){
            return line.trim();
        }).reduce(function(acc, line){
            const match = line.trim().match(self.regexp);
            if (!match) {
                return acc;
            }
            const [m, key, val] = match;
            if (typeof acc[key] === 'undefined') {
                acc[key] = val;
            } else {
                acc[key] = Array.isArray(acc[key]) ? acc[key] : [acc[key]];
                acc[key].push(val);
            }
            return acc;
        }, {});
        return this.data;
    };
    Meta.prototype.regexp = /\@([^\s]+)\s+(\S.+)$/;
    async function request(details, options){
        details = extend({}, details, { method: 'GET', headers: {} });
        options = typeof options === 'boolean' ? { forceGM: options } : {};
        const handler = {};
        const promise = new Promise(function(resolve, reject){
            handler.resolve = resolve;
            handler.reject = reject;
        });
        details = extend({
            onload: function(ev){
                const resp = ev.target ? ev.target : ev;
                handler.resolve({ data: resp.response });
            },
            onerror: function(){
                handler.reject(new Error('network error'));
            },
        }, details);
        if (!options.forceGM) {
            const xhr = new XMLHttpRequest();
            xhr.open(details.method, details.url, true);
            for (const key of Object.keys(details.headers)) {
                xhr.setRequestHeader(key, details.headers[key]);
            }
            xhr.addEventListener('load', details.onload);
            xhr.addEventListener('error', function(){
                if (options.fallBack) {
                    request(details, true).then(handler.resolve).catch(handler.reject);
                } else {
                    handler.reject(new Error('network error'));
                }
            });
            xhr.send(details.data);
        } else if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined') {
            GM.xmlHttpRequest(details);
        } else if (typeof GM_xmlhttpRequest !== 'undefined') {
            GM_xmlhttpRequest(details);
        } else {
            handler.reject(new Error('GM.xmlHttpRequest not supported'));
        }
        return promise;
    }
    function extend(target){
        target = target || {};
        let i;
        let key;
        for (i = 1; i < arguments.length; ++i) {
            for (key of Object.keys(arguments[i])) {
                if (typeof target[key] === 'undefined') {
                    target[key] = arguments[i][key];
                }
            }
        }
        return target;
    }
    async function checkVersion(script){
        if (window.self !== window.top) {
            return;
        }
        
        script = script || {};
        script.name = script.name || (typeof GM_info !== 'undefined' ? GM_info.script.name : 'Vk Media Downloader');
        script.version = script.version || (typeof GM_info !== 'undefined' ? GM_info.script.version : '0.0.0');
        
        let info = await getInfo();
        if (info.time && info.version && (info.time + 86400000) > Date.now() && info.disabled) {
            return 0;
        }
        if (info.version && compareVersions(script.version, info.version) >= 0) {
            return 1;
        }
        if (!info.time || !info.version || (info.time + 86400000) < Date.now()) {
            const meta = new Meta();
            await meta.load(38614);
            meta.parse();
            info = { version: meta.data.version, time: Date.now(), disabled: !!info.disabled };
        }
        if (info.version && compareVersions(script.version, info.version) >= 0) {
            return 2;
        }
        
        const title = (script.title || `${script.name} v${script.version}`).replace('%name%', script.name).replace('%version%', script.version);
        const text = (notification[lang] || notification.en).replace('%version%', info.version);
        if (WINDOW.GM_notification) {
            WINDOW.GM_notification({ title, text, timeout: 5e3 });
        } else {
            WINDOW.alert(`${title}. ${text}`);
        }
        
        await setInfo(info);
    }
    function compareVersions(v1, v2) {
        v1 = parseVersion(v1);
        v2 = parseVersion(v2);
        const ret = {};
        const vkeys = ['major', 'minor', 'patch'];
        for (const key of vkeys) {
            ret[key] = v1[key] - v2[key];
            if (ret[key] < 0) {
                return -1;
            } else if (ret[key] > 0) {
                return 1;
            }
        }
        return 0;
    }
    function parseVersion(version) {
        const regex = /^(\d+)\.(\d+)\.(\d+)\-?([\w.]+)?/;
        const match = version.match(regex);
        return {
            major: +match[1],
            minor: +match[2],
            patch: +match[3],
            other: match[4],
        };
    }
    function getInfo() {
        return storage ? storage.get('info', '{}') : Promise.resolve({});
    }
    function setInfo(info) {
        return storage ? storage.set('info', info) : Promise.resolve();
    }
    WINDOW.checkVersion = checkVersion;
    checkVersion();
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, window);
// ==UserScript==
// @name         Pendoria+
// @description  Improve Pendoria with visual enhancements and statistics
// @namespace    http://pendoria.net/
// @version      0.6.2
// @author       Michael Owens (Xikeon)
// @match        *://pendoria.net/game*
// @match        *://www.pendoria.net/game*
// @grant        none
// @require      https://unpkg.com/vue@2.5.13/dist/vue.min.js
// @downloadURL https://update.greasyfork.org/scripts/36141/Pendoria%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/36141/Pendoria%2B.meta.js
// ==/UserScript==

(function () {
function __$styleInject(css, returnValue) {
  if (typeof document === 'undefined') {
    return returnValue;
  }
  css = css || '';
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';
  head.appendChild(style);
  
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  return returnValue;
}

function __$strToBlobUri(str, mime, isBinary) {try {return window.URL.createObjectURL(new Blob([Uint8Array.from(str.split('').map(function(c) {return c.charCodeAt(0)}))], {type: mime}));} catch (e) {return "data:" + mime + (isBinary ? ";base64," : ",") + str;}}

let debug = false;

function log() {
  if (!debug) {
    return
  }

  console.log('[PendoriaPlus]', ...arguments);
}

function capitalize([first, ...rest]) {
  if (!first) {
    return ''
  }
  return first.toUpperCase() + rest.join('')
}

function guessType (setting) {
  let type = 'string';

  if (setting.type) {
    return setting.type
  }

  if ('options' in setting) {
    return 'select'
  }

  if ('constraint' in setting) {
    if ('min' in setting.constraint || 'max' in setting.constraint) {
      return 'number'
    }
  }

  if ('default' in setting && typeof setting.default === 'boolean') {
    return 'checkbox'
  }

  return type
}

function secondsToString (sec_num) {
  let hours   = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  let str = '';
  if (hours > 0) {
    if (hours < 10) hours = '0' + hours;
    str += hours + 'h';
  }

  if (hours > 0 || minutes > 0) {
    if (minutes < 10) minutes = '0' + minutes;
    str += minutes + 'm';
  }

  if (seconds < 10) seconds = '0' + seconds;
  str += seconds + 's';

  return str
}

function ModuleSetting (setting) {
  const defaults = {
    type: guessType(setting),
    value: ('value' in setting ? setting.value : setting.default),
    toString () {
      return this.value || this.default
    }
  };

  let obj = Object.assign(defaults, setting);
  let oldValue = JSON.parse(JSON.stringify(obj.value));
  if ('onChange' in obj) {
    setInterval(() => {
      if (obj.value !== oldValue) {
        oldValue = JSON.parse(JSON.stringify(obj.value));
        obj.onChange(obj.value);
      }
    }, 10);
  }

  return obj
}

/*export class ModuleSetting {
  constructor (options) {
    const defaults = {
      type: this.guessType(options)
    }

    this.options = Object.assign({}, defaults, options)
  }

  get value() {
    return this.options.value
  }

  set value(value) {
    if (this.options.type === 'number') {
      this.options.value = parseInt(value, 10)
      return
    }

    this.options.value = value
  }

  guessType (options) {
    let type = 'string'

    if (options.type) {
      return options.type
    }

    if ('constraint' in options) {
      if ('min' in options.constraint || 'max' in options.constraint) {
        return 'number'
      }
    }

    if ('default' in options && typeof options.default === 'boolean') {
      return 'checkbox'
    }

    return type
  }

  toString () {
    return this.options.value
  }
}*/

/**
 * Hook onto jQuery.ajaxComplete and be able to attach events to ajax calls
 */

let AJAX_CALLBACKS = {};

var AjaxCallback = {
  init () {
    $(document).ajaxComplete((e, xhr, settings) => {
      let foundPath = Object.keys(AJAX_CALLBACKS).find(path => settings.url.match(path));
      if (!foundPath) {
        return
      }

      AJAX_CALLBACKS[foundPath].forEach(cb => {
        cb(e, xhr, settings);
      });
    });
  },

  on (path, fn) {
    if (!fn) {
      return
    }

    AJAX_CALLBACKS[path] = AJAX_CALLBACKS[path] || [];
    AJAX_CALLBACKS[path].push(fn);
  },

  off (path, fn) {
    if (!fn) {
      return
    }

    let cbs = AJAX_CALLBACKS[path];

    if (!cbs) {
      return
    }

    let i = cbs.findIndex(currentCallback => currentCallback === fn);

    if (i > -1) {
      AJAX_CALLBACKS[path].splice(i, 1);
      log('[AjaxCallback]', 'after splice', AJAX_CALLBACKS[path]);
    }
  }
};

// Needs a rewrite
let log$1 = (...args) => console.log(...args);
let $$1 = window.jQuery;
let inDepTarget = null;

let dotFromObject = function (obj, dotNotation) {
  return dotNotation.split('.').reduce((o,i) => {
    if (!(i in o)) {
      return ''
    }
    return o[i]
  }, obj)
};

let updateDotFromObject = function (obj, dotNotation, value) {
  var dots = dotNotation.split('.');
  var parentDataObject = dots.reduce((o, i, ci) => {
    if (ci === dots.length - 1) {
      return o
    }
    return o[i]
  }, obj);

  var lastdot = dots[dots.length - 1];
  parentDataObject[lastdot] = value;
};

let $template = function (input, ...values) {
  // compile html with tmp holders for nested nodes
  let strings = input;
  let html = '';
  let nodes = [];
  let varFilters = {};
  let lastuid = -1;

  if (typeof strings === String) {
    strings = strings.split('\n');
  }

  for (var i in strings) {
    html += strings[i];

    let value = values[i];
    if (value) {
      if (value instanceof Node || value instanceof jQuery) {
        html += `<div id="jQTpl-tmp-node-${i}"></div>`;
        nodes.push(i);
      } else {
        html += value;
      }
    }
  }

  // find variables
  html = html.replace(/{{(.*?)}}/g, function (m, key) {
    lastuid += 1;

    // save and strip filters
    let [cleanKey, ...filters] = key.split('|');

    if (filters) {
      varFilters[cleanKey] = varFilters[cleanKey] || {};
      varFilters[cleanKey][lastuid] = filters;
    }

    return `<span class="jQTpl-tmp-var-${cleanKey}" data-uid="${lastuid}"></span>`
  });

  // return function that will start the app
  return function ($data, $root) {
    let $dataFilters = {};
    if (typeof $data === 'object' && typeof $data._onChange !== 'function') {
      $dataFilters = $data.filters || {};
      $data = $data.scope;
    }

    $data = $data || null;
    $root = $root || $$1('#app');

    // add watcher for changes
    let $dataEls = {};
    let changeListeners = {};
    let showListeners = {};

    let applyFilters = function (value, datakey, uid) {
      let filters = varFilters[datakey][uid];

      if (Array.isArray(filters) && filters.length) {
        value = filters.reduce((acc, cur) => $dataFilters[cur](acc), value);
      }

      return value
    };

    if ($data) {
      $data._onChange((key, newValue, oldValue) => {
        // Update textNodes
        if (key in $dataEls) {
          $dataEls[key].forEach(node => {
            node.el.nodeValue = applyFilters(newValue, key, node.uid);
          });
        }

        // 2-way binding: from data to view
        if (key in changeListeners) {
          changeListeners[key].forEach(node => node.val(newValue));
        }

        // show/hide elements
        if (key in showListeners) {
          showListeners[key].forEach(node => node[0].toggle(node[1](newValue)));
        }
      });
    }

    let $doc = $$1(html);
    nodes.forEach((i) => {
      $doc.find(`#jQTpl-tmp-node-${i}`).replaceWith(values[i]);
    });

    $doc.find(`[class^=jQTpl-tmp-var-]`).each((k, el) => {
      let datakey = el.className.split('-').pop();
      let value = dotFromObject($data, datakey);
      let uid = el.getAttribute('data-uid');
      value = applyFilters(value, datakey, uid);
      let t = document.createTextNode(value);
      el.replaceWith(t);
      $dataEls[datakey] = $dataEls[datakey] || [];
      $dataEls[datakey].push({
        el: t,
        uid: uid
      });
    });

    let updatingRelatedRadios = false;
    $doc.tplModel = function (selector, model) {
      let cleanSelector = selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      // log('[jQTpl]', 'cleanSelector', cleanSelector)
      let tplModelRegex = new RegExp('tplModel[\\s]*\\([\\s]*([\'"`])' + cleanSelector + '\\1[\s]*,[\s]*(.+?)\\)', 'g');
      let tplModelCall = tplModelRegex.exec(arguments.callee.caller.toString());

      if (!tplModelCall || tplModelCall.length < 3) {
        return this;
      }

      var dots = tplModelCall[2].split('.');
      dots.shift();
      var dataDotNotation = dots.join('.');
      log$1('[jQTpl]', 'get', dataDotNotation, 'in', $data);
      var value = dotFromObject($data, dataDotNotation);
      var $el = this.find(selector);
      // var $dataEl = $dataEls[dataDotNotation].el

      $el
        .val(value)
        .on('input change paste deselect', (e) => {
          if (e.target.type.includes('select') && e.type === 'input') {
            // Select boxes trigger input & event, ignore one of them
            return
          }

          if (updatingRelatedRadios) {
            $$1(e.target).prop('checked', false);
            return
          }

          let newValue = e.target.value;

          if (e.target.type === 'radio' && !updatingRelatedRadios) {
            // update other radios with same name
            let name = $el.attr('name');
            updatingRelatedRadios = true;
            // $(`[type="radio"][jq-model="${dataDotNotation}"]`).not(e.target).change()
            updatingRelatedRadios = false;
            newValue = $$1(e.target).prop('checked', true).val();
          }

          if (e.target.type === 'checkbox') {
            newValue = e.target.checked;
          }

          updateDotFromObject($data, dataDotNotation, newValue);
        }); // this doesn't work for dot notation of course

      if (['radio', 'checkbox'].includes($el[0].type)) {
        $el.prop('checked', value);
      } else {
        $el.val(value);
      }

      changeListeners[dataDotNotation] = changeListeners[dataDotNotation] || [];
      changeListeners[dataDotNotation].push($el);

      return this
    };

    $doc.tplShow = function (selector, model, validator) {
      if (!validator) {
        validator = (value) => value;
      }

      if (typeof model === 'undefined') {
        model = selector;
        selector = null;
      }

      let tplShowCall;
      if (selector) {
        let cleanSelector = selector.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        let tplShowRegex = new RegExp('tplShow[\\s]*\\([\\s]*([\'"`])' + cleanSelector + '\\1[\\s]*,[\\s]*(.+)[\\s]*\\)', 'g');
        tplShowCall = tplShowRegex.exec(arguments.callee.caller.toString());
      }  else {
        let tplShowRegex = new RegExp('tplShow[\\s]*\\([\\s]*(.+)[\\s]*\\)', 'g');
        tplShowCall = tplShowRegex.exec(arguments.callee.caller.toString());
      }

      if (!tplShowCall || tplShowCall.length < 3) {
        return this;
      }

      let lastParams = tplShowCall[2].split(',');
      let m = lastParams.shift();

      let dots = m.split('.');
      dots.shift();
      let dataDotNotation = dots.join('.');
      let $el = (selector ? this.find(selector) : this);

      showListeners[dataDotNotation] = showListeners[dataDotNotation] || [];
      showListeners[dataDotNotation].push([$el, validator, model]);

      $el.toggle(validator(model));

      return this
    };

    $root.append($doc);

    return $doc
  }
};

let observable = function (obj) {
  let listeners = [];

  const handler = function (root) {
    root = root || '';
    if (root) root += '.';

    let deps = {};

    return {
      set(target, key, value, receiver) {
        // extend proxify to appended nested object
        if(({}).toString.call(value) === "[object Object]") {
          value = deepApply(key, value);
        }

        let oldValue = target[key];
        target[key] = value;

        listeners.forEach(cb => cb(`${root}${key}`, target[key], oldValue));

        if (key in deps && deps[key]) {
          deps[key].forEach(changeFunc => {
            setTimeout(changeFunc);
          });
        }

        return Reflect.set(target, key, value, receiver)
      },
      get(target, key, receiver) {
        if (key === 'toJSON') {
          return function() { return target; }
        }

        if(!(key in target)) {
          target[key] = null; // new Proxy(null, handler())
        }

        if (inDepTarget) {
          deps[key] = deps[key] || [];

          if (deps[key].indexOf(inDepTarget) == -1) {
            deps[key].push(inDepTarget);
          }
        }

        return Reflect.get(target, key, receiver)
      },
      deleteProperty(target, key) {
        delete target[key];
      },
      has: function(target, prop) {
        if (prop === '_onChange') {
          return false
        }

        return prop in target
      }
    }
  };

  let deepApply = function (property, data)
  {
    var proxy = new Proxy({}, handler(property));
    var props = Object.keys(data);
    var size = props.length;

    for (var i = 0; i < size; i++)
    {
      property = props[i];
      proxy[property] = data[property];
    }
    return proxy
  };

  Object.defineProperty(obj, '_onChange', {
    configurable: false,
    writable: false,
    enumerable: false, // hide it from for..in
    value: function (cb) {
      listeners.push(cb); //console.log('_onChange registered')
    }
  });

  Object.keys(obj).forEach(k => {
    let v = obj[k];
    if(({}).toString.call(v) === "[object Object]") {
      v = deepApply(k, v);
    }

    obj[k] = v;
  });

  let p = new Proxy(obj || {}, handler());

  Object.keys(obj).forEach(key => {
    if (typeof obj[key] !== 'function') {
      return
    }

    let f = obj[key]; //.bind(p)
    let value;
    let onDependencyUpdated = function () {
      let oldValue = value;
      value = f(p);
      listeners.forEach(cb => cb(key, value, oldValue));
    };

    Object.defineProperty(p, key, {
      get: function () {
        inDepTarget = onDependencyUpdated;
        value = f(p);
        inDepTarget = null;

        return value
      }
    });
  });

  return p
};

/**
 * Color resources red/green based on if you hit the goal (Guild Buildings & Scraptown)
 */

var Global = {
  settings: {
    enabled: ModuleSetting({
      label: 'Enabled',
      default: true,
    }),
    colorCodingEnabled: ModuleSetting({
      label: 'Color-code resources remaining (scraptown, guild buildings)',
      default: true,
      onChange (value) {
        if (this.settings.enabled.value) {
          this.toggleColorCoding(value);
        }
      }
    }),
  },

  init () {
    // do I need this?
    if (!PendoriaPlus.isInitialized) {
      console.error('Module VisualResourceStatus loaded before PendoriaPlus was initialized!');
      return
    }

    log('[VisualResourceStatus]', 'init');

    this.ajaxGuildBuildings = this.ajaxGuildBuildings.bind(this);
    this.ajaxScraptownDetails = this.ajaxScraptownDetails.bind(this);

    this.ranEnable = false;

    if (this.settings.enabled.value) {
      this.enable();
    }
  },

  enable () {
    if (this.ranEnable) {
      return
    }

    this.ranEnable = true;

    if (this.settings.colorCodingEnabled.value) {
      this.setEventHandlers();
    }
  },

  disable () {
    if (!this.ranEnable) {
      return
    }

    this.ranEnable = false;
    this.removeEventHandlers();
  },

  setEventHandlers () {
    AjaxCallback.on('/guild/buildings', this.ajaxGuildBuildings);
    AjaxCallback.on('/scraptown/details/*', this.ajaxScraptownDetails);
  },

  removeEventHandlers () {
    AjaxCallback.off('/guild/buildings', this.ajaxGuildBuildings);
    AjaxCallback.off('/scraptown/details/*', this.ajaxScraptownDetails);
  },

  toggleColorCoding (value) {
    if (typeof value == 'undefined') {
      value = !this.settings.colorCodingEnabled;
    }

    value = !!value;
    this[value ? 'setEventHandlers' : 'removeEventHandlers']();
  },

  coloredElement (from, to) {
    let goalReached = from >= to;
    let $statSpan = $('<span>');

    return $statSpan
      .text(from.toLocaleString())
      .css('color', (goalReached ? 'rgb(29, 166, 87)' : 'red'))
  },

  ajaxGuildBuildings () {
    $('.guild-overview .guild-section:nth-child(2) table tr').each((k, el) => {
      let $el = $(el);
      let $columns = $(el).find('td');

      // check if building is activated
      if ($columns.length < 2) {
        return
      }

      let $statsCol = $columns.eq(1);
      let statsText = $statsCol.text();

      // check if row has stats (x / x,xxx)
      if (!statsText.includes('/')) {
        return
      }

      let [from, to] = statsText.split(' / ').map(str => +str.replace(/[,.]/g, ''));
      let $statSpan = this.coloredElement(from, to);

      $statsCol.text('').append(
        $statSpan,
        ' / ' + to.toLocaleString()
      );
    });
  },

  // Phat arrow to keep scope
  ajaxScraptownDetails () {
    $('.display-item span:eq(1) div:not(.dotted)').each((k, el) => {
      let $el = $(el);
      let [from, _, to, type] = $el.text().split(' ');

      from = +from.replace(/[,.]/g, '');
      to = +to.replace(/[,.]/g, '');

      let $statSpan = this.coloredElement(from, to);

      $el.text('').append(
        $statSpan,
        ' / ' + to.toLocaleString() + ' ' + type
      );
    });
  }
};

__$styleInject("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n.pp_settings_module_header {\n  border-bottom: 1px solid white;\n}\n",undefined);

var settingsView = {render: function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"pp_settings"}},[_c('ul',{staticClass:"nav nav-tabs"},[_c('li',{class:{active: _vm.tab == 'settings'}},[_c('a',{on:{"click":function($event){_vm.tab = 'settings';}}},[_vm._v("Settings")])]),_vm._v(" "),_c('li',{class:{active: _vm.tab == 'about'}},[_c('a',{on:{"click":function($event){_vm.tab = 'about';}}},[_vm._v("About Pendoria+")])])]),_vm._v(" "),_c('div',{staticClass:"tab-game-content"},[(_vm.tab == 'settings')?_c('div',[_vm._l((_vm.modulesWithSettings),function(module,name){return _c('div',[_c('h2',{staticClass:"pp_settings_module_header",on:{"click":function($event){_vm.toggleModuleSettings(name);}}},[('enabled' in module.settings)?_c('input',{directives:[{name:"model",rawName:"v-model",value:(module.settings.enabled.value),expression:"module.settings.enabled.value"}],attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(module.settings.enabled.value)?_vm._i(module.settings.enabled.value,null)>-1:(module.settings.enabled.value)},on:{"click":function($event){_vm.toggleModule(name, $event);},"change":function($event){var $$a=module.settings.enabled.value,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(module.settings.enabled.value=$$a.concat([$$v]));}else{$$i>-1&&(module.settings.enabled.value=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.$set(module.settings.enabled, "value", $$c);}}}}):_vm._e(),_vm._v(" "+_vm._s(name)+" ")]),_vm._v(" "),_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.modulesOpened.includes(name) || true),expression:"modulesOpened.includes(name) || true"}]},_vm._l((module.settings),function(value,setting){return (setting != 'enabled')?_c('div',{staticStyle:{"min-height":"31px"}},[_c('label',{attrs:{"for":setting}},[_vm._v(" "+_vm._s(value.label)+" ")]),_vm._v(" "),(value.type == 'checkbox')?_c('input',{directives:[{name:"model",rawName:"v-model",value:(value.value),expression:"value.value"}],attrs:{"id":setting,"type":"checkbox"},domProps:{"checked":Array.isArray(value.value)?_vm._i(value.value,null)>-1:(value.value)},on:{"change":function($event){var $$a=value.value,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_vm._i($$a,$$v);if($$el.checked){$$i<0&&(value.value=$$a.concat([$$v]));}else{$$i>-1&&(value.value=$$a.slice(0,$$i).concat($$a.slice($$i+1)));}}else{_vm.$set(value, "value", $$c);}}}}):_vm._e(),_vm._v(" "),(value.type == 'number')?_c('div',{staticStyle:{"display":"inline-block","width":"40%"}},[_c('input',{directives:[{name:"model",rawName:"v-model.number",value:(value.value),expression:"value.value",modifiers:{"number":true}}],attrs:{"id":setting,"type":"range","min":value.constraint.min,"max":value.constraint.max},domProps:{"value":(value.value)},on:{"__r":function($event){_vm.$set(value, "value", _vm._n($event.target.value));},"blur":function($event){_vm.$forceUpdate();}}}),_vm._v(" "+_vm._s(value.value)+" ")]):_vm._e(),_vm._v(" "),(value.type == 'select')?_c('select',{directives:[{name:"model",rawName:"v-model",value:(value.value),expression:"value.value"}],attrs:{"id":setting},on:{"change":function($event){var $$selectedVal = Array.prototype.filter.call($event.target.options,function(o){return o.selected}).map(function(o){var val = "_value" in o ? o._value : o.value;return val}); _vm.$set(value, "value", $event.target.multiple ? $$selectedVal : $$selectedVal[0]);}}},_vm._l((value.options),function(option){return _c('option',{domProps:{"value":option}},[_vm._v(" "+_vm._s(_vm._f("capitalize")(option))+" ")])})):_vm._e(),_vm._v(" "),(setting === 'sound')?_c('button',{on:{"click":_vm.playSound}},[_vm._v("►")]):_vm._e()]):_vm._e()}))])}),_vm._v(" "),_c('button',{on:{"click":_vm.saveSettings}},[_vm._v("Save settings")])],2):_vm._e(),_vm._v(" "),(_vm.tab == 'about')?_c('div',[_vm._m(0),_vm._v(" "),_c('p',[_vm._v(" Pendoria+ is a combination of visual improvements and enhancements to the overal Pendoria experience. Created by Xikeon. ")])]):_vm._e()])])},staticRenderFns: [function(){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('p',[_vm._v(" Thanks for using "),_c('strong',[_vm._v("Pendoria+")]),_vm._v("! ")])}],
  filters: {capitalize},

  data () {
    return {
      modulesOpened: []
    }
  },

  computed: {
    modulesWithSettings () {
      return Object.keys(this.modules)
        .filter(k => 'settings' in this.modules[k] && Object.keys(this.modules[k].settings).length > 0)
        .reduce((res, k) => (res[k] = this.modules[k], res), {})
    }
  },

  methods: {
    toggleModule (name, value) {
      // Note: this couldn't be a deep watcher due to Vue internally giving a stack overflow
      if (value instanceof MouseEvent) {
        value = value.target.checked;
      }

      if (value) {
        setTimeout(() => {
          this.modules[name].enable();
        }, 50);
      } else {
        this.$nextTick(() => {
          this.modules[name].disable();
        });
      }
    },

    toggleModuleSettings (name) {
      return
      const idx = this.modulesOpened.indexOf(name);
      if (idx !== -1) {
        this.modulesOpened.splice(idx, 1);
      } else {
        this.modulesOpened.push(name);
      }
    },

    saveSettings () {
      ModuleManager.saveSettings();
    }
  }
};

__$styleInject("#pp_settings label {\r\n  width: 50%;\r\n  max-width: 40%;\r\n  /*height: 20px;*/\r\n}\r\n\r\n#pp_settings input[type=\"range\"] {\r\n  display: inline-block;\r\n  width: 75%;\r\n  margin-right: 5px;\r\n}",undefined);

const defaultScope = {
  test_version: '0.1',
  modules: {},
  tab: 'settings',
  text: '',
  radio: '',
  checkbox: '',
  select: '',
};

// TODO: load from localstorage?
let scope$1 = defaultScope;

var Settings = {
  methods: {
    playSound () {
      log('[Settings]', 'test sound');
      StatsPanel.playSound();
    }
  },

  init () {
    log('[Settings]', 'init');
    this.addModules();
    this.addMenuItem();
  },

  addModules () {
    let modules = ModuleManager.get();
    Object.keys(modules).forEach(name => {
      log('[Settings]', 'add module', name);
      scope$1.modules[name] = modules[name];
    });
  },

  addMenuItem () {
    let $item = $('<li><a href="#" id="pendoriaplus-button"> <i class="fa fa-wrench"> </i>Pendoria+</a></li>');

    $item.find('a').on('click', this.open.bind(this));

    // $("#gameframe-menu ul li:first-child").before($item)
    $("#menu ul li:last-child").before($item);
  },

  open () {
    if (this.vm) {
      this.vm.$destroy();
      this.vm = null;
      setTimeout(this.open.bind(this), 1); // give Vue time to destroy
      return
    }

    this.$wrapper = $('<div id="pendoriaplus_settings"></div>');
    $('#gameframe-battle').hide();
    $('#gameframe-content').show().html(this.$wrapper);

    this.initView();
  },

  initView () {
    const ViewCtor = Vue.extend(settingsView);
    this.vm = new ViewCtor({
      el: this.$wrapper[0],
      // template: settingsView,
      data: scope$1,
      methods: this.methods,
      // methods: methods
    });
  },
};

__$styleInject("#pendoriaplus_stats {\r\n  position: relative;\r\n  background: rgba(0, 0, 0, .8);\r\n  color: #fff;\r\n  margin-bottom: 20px;\r\n}\r\n\r\n.pendoriaplus_stats_content {\r\n  padding: 15px 15px 15px 15px;\r\n}\r\n\r\n.pendoriaplus_stats_content label {\r\n  margin: 0;\r\n}",undefined);

var appView = "<div>\r\n  <div class=\"frame frame-vertical-left\"></div>\r\n  <div class=\"frame frame-vertical-right\"></div>\r\n  <div class=\"frame frame-horizontal-top\"></div>\r\n  <div class=\"frame frame-horizontal-bottom\"></div>\r\n  <div class=\"frame frame-top-left\"></div>\r\n  <div class=\"frame frame-top-right\"></div>\r\n  <div class=\"frame frame-bottom-right\"></div>\r\n  <div class=\"frame frame-bottom-left\"></div>\r\n  <div class=\"pendoriaplus_stats_content\">\r\n    <div><a href=\"#\" class=\"pendoriaplus_reset_stats\">Reset</a></div>\r\n\r\n    <div>\r\n      <label>Actions:</label>\r\n      {{stats.actions|toLocaleString}}\r\n    </div>\r\n    <div>\r\n      <label>Exp gained:</label>\r\n      {{stats.exp|toLocaleString}}\r\n    </div>\r\n\r\n    <div id=\"pendoriaplus_stats_battle\">\r\n      <div class=\"pendoriaplus_ts_only\">\r\n        <label>Win / Loss:</label>\r\n        {{stats.wins|toLocaleString}} / {{stats.losses|toLocaleString}} ({{winPercentage}}%)\r\n      </div>\r\n      <div class=\"pendoriaplus_ts_only\">\r\n        <label>Gold gained:</label>\r\n        {{stats.gold|toLocaleString}}\r\n      </div>\r\n      <div class=\"pendoriaplus_ts_only\">\r\n        <label>Gold p/h:</label>\r\n        {{goldPerHour|toLocaleString}}\r\n      </div>\r\n    </div>\r\n\r\n    <div id=\"pendoriaplus_stats_ts\">\r\n      <div class=\"pendoriaplus_ts_only\">\r\n        <label>Quint procs:</label>\r\n        {{stats.quints|toLocaleString}} ({{quintsPercentage}}%)\r\n      </div>\r\n      <div class=\"pendoriaplus_ts_only\">\r\n        <label>{{skill|ucfirst}} gained:</label>\r\n        {{stats.resources|toLocaleString}}\r\n      </div>\r\n      <div class=\"pendoriaplus_ts_only\">\r\n        <label>{{skill|ucfirst}}/h:</label>\r\n        {{resourcesPerHour|toLocaleString}}\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>";

let sounds = {
  plucky: 'https://notificationsounds.com/soundfiles/1728efbda81692282ba642aafd57be3a/file-sounds-1101-plucky.wav',
  openEnded: 'https://notificationsounds.com/soundfiles/8eefcfdf5990e441f0fb6f3fad709e21/file-sounds-1100-open-ended.wav',
  ping: 'https://notificationsounds.com/soundfiles/4e4b5fbbbb602b6d35bea8460aa8f8e5/file-sounds-1096-light.wav',
};

function perHour(total, actions) {
  let hours = (actions * 6) / 3600;
  return Math.round(total / hours)
}

let scope$$1 = observable({
  type: 'battle',
  skill: '',
  stats: {
    actions: 0,
    exp: 0,
    wins: 0,
    losses: 0,
    gold: 0,
    quints: 0,
    resources: 1,
  },
  resetStatsDate: +new Date(),
  winPercentage (data) {
    const totalBattles = data.stats.wins + data.stats.losses;
    if (totalBattles === 0) {
      return 0
    }
    return (100 / totalBattles * data.stats.wins).toFixed(2)
  },
  quintsPercentage (data) {
    if (data.stats.actions === 0 || data.stats.quints === 0) {
      return 0
    }

    return (100 / data.stats.actions * data.stats.quints).toFixed(2)
  },
  resourcesPerHour (data) {
    // let passedHours = Math.abs(new Date(data.resetStatsDate) - new Date()) / 36e5
    // return Math.round(data.stats.resources / passedHours);
    if (data.stats.actions === 0) {
      return 0
    }

    return perHour(data.stats.resources, data.stats.actions)
  },
  goldPerHour (data) {
    // let passedHours = Math.abs(new Date(data.resetStatsDate) - new Date()) / 36e5
    // return Math.round(data.stats.gold / passedHours);
    if (data.stats.gold === 0) {
      return 0
    }

    return perHour(data.stats.gold, data.stats.actions)
  },
});

let filters = {
  toLocaleString: (value) => value.toLocaleString(),
  ucfirst: capitalize
};

var StatsPanel = {
  settings: {
    enabled: ModuleSetting({
      label: 'Enabled',
      default: true,
    }),
    timeToLevel: ModuleSetting({
      label: 'Show estimated time to next level',
      default: true,
      onChange (value) {
        if (!this.settings.enabled.value) {
          return
        }

        this.$nextLevel.toggle(value);
      }
    }),
    panelEnabled: ModuleSetting({
      label: 'Show panel under mini profile',
      default: true,
      onChange (value) {
        if (!this.settings.enabled.value) {
          return
        }

        this[value ? 'initPanel' : 'removePanel']();
      },
    }),
    lowActionSoundEnabled: ModuleSetting({
      label: 'Low action sound enabled',
      default: true,
    }),
    lowActions: ModuleSetting({
      label: 'Low action sound at actions remaining',
      default: 50,
      constraint: {
        min: 1,
        max: 100,
      },
    }),
    lowActionRepeat: ModuleSetting({
      label: 'Repeat sound every 6 seconds',
      default: true,
    }),
    sound: ModuleSetting({
      label: 'Low action sound',
      default: 'plucky',
      options: Object.keys(sounds)
    }),
    volume: ModuleSetting({
      label: 'Low action sound volume',
      default: 50,
      constraint: {
        min: 0,
        max: 100,
      },
    }),
  },

  init () {
    log('[StatsPanel]', 'init');
    log('[StatsPanel]', 'sounds', sounds);

    this.ranEnable = false;
    this.soundTimeout = null;

    this.$nextLevel = $('<div style="text-align: center; margin-top: 3px;"></div>').insertAfter('#exp');

    this.onTradeskillData = this.onTradeskillData.bind(this);
    this.onBattleData = this.onBattleData.bind(this);

    if (this.settings.enabled.value) {
      this.enable();
    }
  },

  enable () {
    if (this.ranEnable) {
      return
    }

    this.ranEnable = true;

    this.bindSocketMessages();
    this.initPanel();
    this.setSound(this.settings.sound.value);
    this.setVolume(this.settings.volume.value);

    this.$nextLevel.toggle(this.settings.timeToLevel.value);
  },

  disable () {
    if (!this.ranEnable) {
      return
    }

    this.ranEnable = false;

    this.unbindSocketMessages();
    this.removePanel();
    this.removeSound();
    this.$nextLevel.toggle(false);
  },

  bindSocketMessages () {
    socket.on('tradeskill data', this.onTradeskillData);
    socket.on('battle data', this.onBattleData);
  },

  unbindSocketMessages () {
    socket.off('tradeskill data', this.onTradeskillData);
    socket.off('battle data', this.onBattleData);
  },

  setSound (name) {
    this.audio = new Audio(sounds[name]);
    this.audio.setAttribute('name', name);
  },

  setVolume (volume) {
    if (volume < 0 || volume > 100) {
      return
    }

    this.audio.volume = volume / 100;
  },

  playSound() {
    if (!this.audio || !this.settings.lowActionSoundEnabled.value) {
      return
    }

    if (this.audio.getAttribute('name') != this.settings.sound.value) {
      this.setSound(this.settings.sound.value);
    }

    if (this.audio.volume !== this.settings.volume.value / 100) {
      this.setVolume(this.settings.volume.value);
    }

    this.audio.play();
  },

  removeSound () {
    this.audio = null;
  },

  initPanel () {
    if (this.$wrapper || !this.settings.panelEnabled.value) {
      return
    }

    this.$wrapper = $('<div id="pendoriaplus_stats"></div>').insertAfter($('#profile'));
    let app = $template(appView);
    this.$app = app({scope: scope$$1, filters}, this.$wrapper);

    this.initPanelBindings();
  },

  removePanel () {
    if (!this.$wrapper) {
      return
    }

    this.$wrapper.remove();
    this.$wrapper = null;
    this.$app = null;
  },

  initPanelBindings () {
    this.$app.find('.pendoriaplus_reset_stats').on('click', e => {
      e.preventDefault();
      Object.keys(scope$$1.stats).forEach(k => {
          scope$$1.stats[k] = 0;
      });
      scope$$1.resetStatsDate = +new Date();
    });

    this.$app
      // .tplShow('> div', this.settings.panelEnabled.value)
      .tplShow('#pendoriaplus_stats_battle', scope$$1.type, type => type === 'battle')
      .tplShow('#pendoriaplus_stats_ts', scope$$1.type, type => type === 'tradeskill');
  },

  checkActionsRemaining (data) {
    if (this.soundTimeout) {
      clearTimeout(this.soundTimeout);
      this.soundTimeout = null;
    }

    // TODO: improve check so if it skips a number magically, it will still play?
    if (data.actionsRemaining === this.settings.lowActions.value ||
      (this.settings.lowActionRepeat.value && data.actionsRemaining <= this.settings.lowActions.value)) {
      this.playSound();
    }

    if (data.actionsRemaining <= 0) {
      this.soundTimeout = setTimeout(() => {
        this.checkActionsRemaining(data);
      }, 6000);
    }
  },

  onTradeskillData (data) {
    if (scope$$1.type !== 'tradeskill') {
      this.resetStats();
    }

    this.checkActionsRemaining(data);
    this.calculateTimeToLevel(data.expToLevel, data.exp, data.gainedExp);

    scope$$1.type = 'tradeskill';
    scope$$1.skill = data.skill;
    scope$$1.stats.actions += 1;

    if (data.quintProc) {
        scope$$1.stats.quints += 1;
    }

    if (data.gainedAmount) {
        scope$$1.stats.resources += data.gainedAmount;
        scope$$1.stats.exp += data.gainedExp;
    }
  },

  onBattleData (data) {
    if (scope$$1.type !== 'battle') {
      this.resetStats();
    }

    this.checkActionsRemaining(data);
    this.calculateTimeToLevel(data.expToLevel, data.exp, data.gainedexp);

    scope$$1.type = 'battle';
    scope$$1.stats.actions += 1;

    if (data.victory) {
      scope$$1.stats.wins++;
    } else {
      scope$$1.stats.losses++;
    }

    if (data.gainedgold) {
      scope$$1.stats.gold += data.gainedgold;
      scope$$1.stats.exp += data.gainedexp;
    }
  },

  calculateTimeToLevel (max, totalGained, gained) {
    // TODO: maybe use saved stats, to be more accurate for battlers who can e.g. win 90%
    if (!this.settings.timeToLevel.value) {
      return
    }

    let timeToLevel = secondsToString(Math.round(((max - totalGained) / gained) * 6));

    if (!gained) {
      timeToLevel = '?';
    }

    setTimeout(() => {
      this.$nextLevel.text(`Next level: ${timeToLevel}`);
    }, 10);
  },

  resetStats () {
    Object.keys(scope$$1.stats).forEach(stat => scope$$1.stats[stat] = 0);
  }
};

__$styleInject("#chat_wrapper {\r\n  position: absolute;\r\n  bottom: 0;\r\n  left: 50%;\r\n  transform: translateX(-50%);\r\n  padding: 0 20px;\r\n  height: 30%;\r\n  width: 100%;\r\n  max-width: 1100px;\r\n  pointer-events: none;\r\n}\r\n\r\n#chat_wrapper #chat {\r\n  position: relative;\r\n  margin: 0 0 0 auto;\r\n  height: 100%;\r\n  width: calc(80%);\r\n  pointer-events: all;\r\n}\r\n\r\n/* Not so much an aside anymore, is it */\r\n#chat.with-tabs #chat-content {\r\n  width: 100%;\r\n  margin: 0;\r\n}\r\n\r\n#chat.with-tabs .wrapper {\r\n  display: grid;\r\n  grid-template-rows: min-content auto;\r\n}\r\n\r\n#chat.with-tabs aside {\r\n  float: none;\r\n  overflow: hidden;\r\n  height: auto;\r\n  width: 100%;\r\n  padding: 10px 0px 0 0;\r\n}\r\n\r\n#chat.with-tabs aside ul {\r\n  float: left;\r\n  margin: 0;\r\n}\r\n\r\n#chat.with-tabs aside li {\r\n  display: inline-block;\r\n  margin-right: 10px;\r\n}\r\n",undefined);

var Chat = {
  // ranEnable: false,

  settings: {
    enabled: ModuleSetting({
      label: 'Enabled',
      default: true,
    }),
    size: ModuleSetting({
      label: 'Chat size & position',
      default: 'content',
      options: ['default', 'content', 'side-by-side'],
      onChange (value) {
        this.setSize(value);
      }
    }),
    tabs: ModuleSetting({
      label: 'Channels as tabs',
      default: true,
      onChange (value) {
        this.toggleTabs(value);
      },
    })
  },

  init () {
    this.ranEnable = false;
    this.$wrapper = $('<div id="chat_wrapper"></div>');
    this.$chat = $(document).find('#chat');

    this.isDragging = false;
    this.onMouseMove = this.onMouseMove.bind(this);

    $(document).on('mouseup', () => {
      this.isDragging = false;
    });
    $(document).on('mousemove', this.onMouseMove);
    this.$chat.find('#dragable').on('mousedown', (e) => {
      if (this.settings.size.value === 'content') {
        e.stopPropagation();
        window.isDragging = false;
        this.isDragging = true;
      }
    });

    if (this.settings.enabled) {
      this.enable();
    }
  },

  enable () {
    if (this.ranEnable) {
      return
    }

    this.ranEnable = true;

    this.setSize();
    this.toggleTabs(this.settings.tabs.value);
  },

  disable () {
    if (!this.ranEnable) {
      return
    }

    this.ranEnable = false;

    this.setSize('default');
    this.toggleTabs(false);
  },

  setSize (value) {
    if (typeof value === 'undefined') {
      value = this.settings.size.value;
    }

    if (value === 'content') {
      this.$chat.wrap(this.$wrapper);
      this.$chat
        .prepend('<div class="frame frame-vertical-left"></div>')
        .prepend('<div class="frame frame-vertical-right"></div>');
    } else {
      this.$chat.unwrap();
      this.$chat.find('.frame-vertical-left, .frame-vertical-right').remove();
    }

    $('body')[value === 'side-by-side' ? 'addClass' : 'removeClass']('pp_chat_side_by_side');
  },

  onMouseMove (e) {
    if (!this.isDragging) {
      return
    }

    if (e && e.target.tagName !== 'input') {
      e.stopPropagation();
    }

    var height = (1 - (e.clientY / $(window).height())) * 100;
    if(height > 85) {
      height = '85%';
    } else if (height < 30) {
      height = '30%';
    } else {
      height = height + '%';
    }
    $('#chat_wrapper').css('height', height);
  },

  toggleTabs (value) {
    if (typeof value === 'undefined') {
      value = !this.settings.tabs.value;
    }

    value = !!value;
    this.$chat[value ? 'addClass' : 'removeClass']('with-tabs');
  },
};

__$styleInject("#pp_timeRemaining {\r\n  color: #fff;\r\n  margin-right: 10px;\r\n}",undefined);

var Quests = {
  settings: {
    enabled: ModuleSetting({
      label: 'Enabled',
      default: true,
    }),
    showTimeRemaning: ModuleSetting({
      label: 'Show est. time remaining',
      default: true,
    }),
  },

  init () {
    log('[StatsPanel]', 'init');

    this.ranEnable = false;
    this.$timeRemaining = null;

    this.onSocketData = this.onSocketData.bind(this);

    if (this.settings.enabled.value) {
      this.enable();
    }
  },

  enable () {
    if (this.ranEnable) {
      return
    }

    this.ranEnable = true;

    this.bindSocketMessages();

    if (this.settings.showTimeRemaning.value) {
      this.initTimeRemaning();
    }
  },

  disable () {
    if (!this.ranEnable) {
      return
    }

    this.ranEnable = false;

    this.unbindSocketMessages();
    this.removeTimeRemaining();
  },

  initTimeRemaning () {
    this.$timeRemaining = $('<span id="pp_timeRemaining"></span>').insertAfter('#quest_prog');
  },

  removeTimeRemaining () {
    if (!this.$timeRemaining) {
      return
    }

    this.$timeRemaining.remove();
    this.$timeRemaining = null;
  },

  bindSocketMessages () {
    socket.on('tradeskill data', this.onSocketData);
    socket.on('battle data', this.onSocketData);
  },

  unbindSocketMessages () {
    socket.off('tradeskill data', this.onSocketData);
    socket.off('battle data', this.onSocketData);
  },

  onSocketData (data) {
    if (data.quest_status !== 2) {
      this.$timeRemaining.text('');
      return
    }

    this.setRemainingTime(data.quest_count);
  },

  setRemainingTime (actions) {
    const sec_num = actions * 6;
    const str = secondsToString(sec_num);

    log('[Quests]', 'setRemainingTime', actions, str);
    this.$timeRemaining.text(str ? `(${str})` : '');
  },
};

const modules = {
  AjaxCallback,
  StatsPanel,
  Chat,
  Quests,
  Global,
  Settings,
};

window.pp_modules = modules;

var ModuleManager = {
  init () {
    log('[ModuleManager]', 'init');
  },

  saveSettings () {
    log('[ModuleManager]', 'saveSettings');
    let settings = {};
    Object.keys(modules).forEach(moduleName => {
      if ('settings' in modules[moduleName]) {
        settings[moduleName] = {};

        let moduleSettings = modules[moduleName].settings;
        Object.keys(moduleSettings).forEach(settingName => {
          settings[moduleName][settingName] = moduleSettings[settingName].value;
        });
      }
    });

    localStorage.setItem('PendoriaPlus', JSON.stringify(settings));
  },

  loadSettings () {
    let settings = localStorage.getItem('PendoriaPlus');

    if (settings) {
      log('[ModuleManager]', 'Loading settings');
      try {
        settings = JSON.parse(settings);
        log('[ModuleManager]', settings);
        Object.keys(settings).forEach(moduleName => {
          const moduleSettings = settings[moduleName];
          Object.keys(moduleSettings).forEach(settingName => {
            modules[moduleName].settings[settingName].value = moduleSettings[settingName];
          });
        });
      } catch (e) {
        log('[ModuleManager]', 'Error loading settings:', e.toString());
      }
    }
  },

  get (name = '') {
    if (!name) {
      return modules
    }

    if (!(name in modules)) {
      return null
    }

    return modules[name]
  },

  add (name, module) {
    if (!name) {
      log('[ModuleManager]', 'tried to add empty module');
      return
    }

    if (!module || typeof module !== 'object') {
      log('[ModuleManager]', 'tried to add invalid module:', name);
      return
    }

    modules[name] = module;
  }
};

__$styleInject("#gameframe-menu {\r\n  width: 80%;\r\n}\r\n\r\n.pp_chat_side_by_side #content\r\n{\r\n  right: auto;\r\n  width: 60%;\r\n  height: 90%;\r\n}\r\n\r\n.pp_chat_side_by_side #chat\r\n{\r\n  left: auto;\r\n  width: 42%;\r\n  height: 94%;\r\n  top: 60px;\r\n}\r\n\r\n@media only screen and (max-width: 980px) {\r\n  #gameframe-menu li a {\r\n    font-size: 12px;\r\n  }\r\n}\r\n",undefined);

var PendoriaPlus = {
  isInitialized: false,

  init () {
    log('Initializing');

    this.isInitialized = true;

    this.initModules();
  },

  initModules () {
    ModuleManager.loadSettings();

    Object.values(ModuleManager.get())
      .forEach(module => {
        if ('settings' in module) {
          Object.keys(module.settings)
            .forEach(key => {
              let setting = module.settings[key];
              if (setting.onChange) {
                setting.onChange = setting.onChange.bind(module);
              }
            });
        }
        module.init();
      });
  },

  getSocket () {
    return window.socket
  }
};

(function ($) {
  if (typeof $ === 'undefined') {
    console.error('PendoriaPlus could not load, jQuery was not found. Is the website even working?');
    return
  }

  $(function () {
    if (!window.hasPendoriaPlus) {
      window.hasPendoriaPlus = true;
      PendoriaPlus.init();
    }
  });
})(jQuery);

}());

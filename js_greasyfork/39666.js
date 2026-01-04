
// ==UserScript==
// @name         巴哈姆特站內信簽名檔
// @namespace    https://blog.maple3142.net/
// @version      0.5.1
// @description  幫巴哈姆特站內信的站內信加上簽名檔功能
// @author       maple3142
// @match        https://mailbox.gamer.com.tw/*
// @require      https://unpkg.com/vue@2.5.16/dist/vue.runtime.min.js
// @require      https://unpkg.com/vuex@3.0.1/dist/vuex.min.js
// @require      https://unpkg.com/vuejs-storage@2.1.1/dist/vuejs-storage.js
// @require      https://unpkg.com/sortablejs@1.7.0/Sortable.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39666/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E7%AB%99%E5%85%A7%E4%BF%A1%E7%B0%BD%E5%90%8D%E6%AA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/39666/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E7%AB%99%E5%85%A7%E4%BF%A1%E7%B0%BD%E5%90%8D%E6%AA%94.meta.js
// ==/UserScript==

(function (Vue,$,Vuex,vjss,Sortable) {
'use strict';

Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;
$ = $ && $.hasOwnProperty('default') ? $['default'] : $;
Vuex = Vuex && Vuex.hasOwnProperty('default') ? Vuex['default'] : Vuex;
vjss = vjss && vjss.hasOwnProperty('default') ? vjss['default'] : vjss;
Sortable = Sortable && Sortable.hasOwnProperty('default') ? Sortable['default'] : Sortable;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

Vue.use(Vuex);
var Signature = function Signature(name) {
  _classCallCheck(this, Signature);

  this.name = name;
  this.content = '';
  this.id = Date.now().toString() + Math.random();
};
var store = new Vuex.Store({
  state: {
    signatures: []
  },
  mutations: {
    create: function create(state, _ref) {
      var name = _ref.name,
          content = _ref.content;
      state.signatures.push(new Signature(name, content));
    },
    edit: function edit(state, _ref2) {
      var id = _ref2.id,
          content = _ref2.content;
      state.signatures = state.signatures.map(function (s) {
        if (s.id !== id) return s;
        s.content = content;
        return s;
      });
    },
    rename: function rename(state, _ref3) {
      var id = _ref3.id,
          name = _ref3.name;
      state.signatures = state.signatures.map(function (s) {
        if (s.id !== id) return s;
        s.name = name;
        return s;
      });
    },
    del: function del(state, _ref4) {
      var id = _ref4.id;
      state.signatures = state.signatures.filter(function (s) {
        return s.id !== id;
      });
    },
    updateSignatures: function updateSignatures(state, sigs) {
      state.signatures = sigs;
    }
  },
  plugins: [vjss({
    namespace: 'bahamail-signature',
    keys: ['signatures']
  })]
});

var isMailingPage = $('textarea[name=content]').length > 0;

(function () {
  if (typeof document !== 'undefined') {
    var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style'),
        css = " .fw[data-v-125f8210] { width: 100%; } ";
    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }
})();

var Signature$1 = {
  render: function render() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "fw BH-rbox"
    }, [_c('h5', [_c('i', {
      staticClass: "sig-drag fa fa-bars"
    }), _vm._v(" " + _vm._s(_vm.signature.name) + " ")]), _vm._v(" "), _c('textarea', {
      directives: [{
        name: "model",
        rawName: "v-model",
        value: _vm.text,
        expression: "text"
      }],
      staticClass: "fw",
      attrs: {
        "rows": "5"
      },
      domProps: {
        "value": _vm.text
      },
      on: {
        "input": function input($event) {
          if ($event.target.composing) {
            return;
          }

          _vm.text = $event.target.value;
        }
      }
    }), _vm._v(" "), _c('div', [_vm.isMailingPage ? _c('button', {
      on: {
        "click": function click($event) {
          _vm.apply(_vm.signature.content);
        }
      }
    }, [_vm._v("插入簽名檔")]) : _vm._e(), _vm._v(" "), _c('button', {
      on: {
        "click": _vm.rename
      }
    }, [_vm._v("重新命名")]), _vm._v(" "), _c('button', {
      on: {
        "click": _vm.del
      }
    }, [_vm._v("刪除")])])]);
  },
  staticRenderFns: [],
  _scopeId: 'data-v-125f8210',
  props: {
    signature: {
      type: Object,
      required: true
    }
  },
  computed: {
    text: {
      get: function get() {
        return this.signature.content;
      },
      set: function set(content) {
        this.$store.commit('edit', _objectSpread({}, this.signature, {
          content: content
        }));
      }
    },
    isMailingPage: function isMailingPage$$1() {
      return isMailingPage;
    }
  },
  methods: {
    apply: function apply(text) {
      var $tx = $('textarea[name=content]');
      var val = $tx.val();
      $tx.val(val + text);
    },
    rename: function rename() {
      var name = prompt("\u628A\u7C3D\u540D\u6A94 \"".concat(this.signature.name, "\" \u6539\u6210?"));
      if (!name) return;
      this.$store.commit('rename', _objectSpread({}, this.signature, {
        name: name
      }));
    },
    del: function del() {
      var result = confirm("\u78BA\u8A8D\u522A\u9664\u7C3D\u540D\u6A94 \"".concat(this.signature.name, "\"?"));
      if (result) this.$store.commit('del', this.signature);
    }
  }
};

(function () {
  if (typeof document !== 'undefined') {
    var head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style'),
        css = " .bms-btn-wrap[data-v-38cab9c1] { margin-bottom: 1em; } ";
    style.type = 'text/css';

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
  }
})(); //vuedraggable doesn't export anything to window


var App = {
  render: function render() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', [_c('div', {
      staticClass: "bms-btn-wrap"
    }, [_c('button', {
      on: {
        "click": _vm.create
      }
    }, [_vm._v("新增簽名檔")])]), _vm._v(" "), _c('div', [_c('div', {
      ref: "list"
    }, _vm._l(_vm.signatures, function (sig) {
      return _c('signature', {
        key: sig.id,
        attrs: {
          "signature": sig
        }
      });
    }))])]);
  },
  staticRenderFns: [],
  _scopeId: 'data-v-38cab9c1',
  components: {
    Signature: Signature$1
  },
  computed: {
    signatures: {
      get: function get() {
        return this.$store.state.signatures;
      },
      set: function set(value) {
        this.$store.commit('updateSignatures', value);
      }
    }
  },
  methods: {
    create: function create() {
      var name = prompt('新簽名檔名稱?');
      if (!name) return;
      this.$store.commit('create', {
        name: name
      });
    }
  },
  mounted: function mounted() {
    var _this = this;

    Sortable.create(this.$refs.list, {
      handle: '.sig-drag',
      onUpdate: function onUpdate(e) {
        var s = _this.signatures;
        var oldIndex = e.oldIndex,
            newIndex = e.newIndex;
        var _ref = [s[newIndex], s[oldIndex]];
        s[oldIndex] = _ref[0];
        s[newIndex] = _ref[1];
        _this.signatures = s;
      }
    });
  }
};

var app = new Vue({
  render: function render(h) {
    return h(App);
  },
  store: store
});
var div = document.createElement('div');
$('#BH-slave').append(div);
app.$mount(div);
window.__bahamail_signature = {
  app: app,
  store: store
};

}(Vue,jQuery,Vuex,vuejsStorage,Sortable));

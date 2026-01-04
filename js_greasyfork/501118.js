// ==UserScript==
// @name         codeTheme
// @namespace    Baozoulolw
// @version      0.1.7
// @author       Baozoulolw
// @description  修改editor样式
// @license      MIT
// @icon         https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/theme.svg
// @match        *://*/*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/501118/codeTheme.user.js
// @updateURL https://update.greasyfork.org/scripts/501118/codeTheme.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const e=document.createElement("style");e.textContent=n,document.head.append(e)})(` #self_dialog{
  font-size: 18px;
  margin-right: 10px;
}
.head-right{
  display: flex;
  align-items: center;
}
.custom-tree-node[data-v-545643b4] {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.el-input[data-v-93c5e0b4] .el-input__inner {
  text-align: left;
} `);

(async function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var _a, _b, _c, _d, _e2, _f, _g, _h, _i, _j, _k, _l, _m, _n2, _o, _p, _q, _r;
  function waitForElementByClass(className, callback) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        Array.from(mutation.addedNodes).forEach((addedNode) => {
          let classNames = addedNode.className;
          if (!classNames || typeof classNames !== "string")
            return;
          if (classNames.includes(className)) {
            callback(addedNode);
            observer.disconnect();
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const monacoEditorInnerLanguages = [
    "css",
    "vue",
    "html",
    "javascript",
    "less",
    "pug",
    "scss",
    "typescript",
    "coffee"
  ];
  const scopeNameMap = {
    html: "text.html.basic",
    vue: "text.html.basic",
    pug: "text.pug",
    css: "source.css",
    less: "source.css.less",
    scss: "source.css.scss",
    sass: "source.sassdoc",
    typescript: "source.ts",
    javascript: "source.js",
    javascriptreact: "source.js.jsx",
    coffeescript: "source.coffee",
    json: "source.json"
  };
  const tmGrammarJsonMap = {
    "text.html.basic": "html.tmLanguage.json",
    "text.pug": "pug.tmLanguage.json",
    "source.css": "css.tmLanguage.json",
    "source.css.less": "less.tmLanguage.json",
    "source.less": "less.tmLanguage.json",
    "source.css.scss": "scss.tmLanguage.json",
    "source.sass": "scss.tmLanguage.json",
    "source.sassdoc": "sassdoc.tmLanguage.json",
    "source.stylus": "css.tmLanguage.json",
    "source.ts": "TypeScript.tmLanguage.json",
    "source.js": "JavaScript.tmLanguage.json",
    "source.js.jsx": "JavaScriptReact.tmLanguage.json",
    "source.coffee": "coffeescript.tmLanguage.json",
    "source.js.regexp": {
      format: "plist",
      path: "Regular Expressions (JavaScript).tmLanguage"
    },
    "source.json": "JSON.tmLanguage.json"
  };
  const completionItemKinds = [
    { name: "Text", value: 1, description: "\u666E\u901A\u6587\u672C" },
    { name: "Method", value: 2, description: "\u65B9\u6CD5\u6216\u51FD\u6570" },
    { name: "Function", value: 3, description: "\u51FD\u6570\uFF08\u975E\u65B9\u6CD5\uFF09" },
    { name: "Constructor", value: 4, description: "\u6784\u9020\u51FD\u6570" },
    { name: "Field", value: 5, description: "\u7C7B\u7684\u5B57\u6BB5\u6216\u5C5E\u6027" },
    { name: "Variable", value: 6, description: "\u53D8\u91CF" },
    { name: "Class", value: 7, description: "\u7C7B" },
    { name: "Interface", value: 8, description: "\u63A5\u53E3" },
    { name: "Module", value: 9, description: "\u6A21\u5757" },
    { name: "Property", value: 10, description: "\u5BF9\u8C61\u7684\u5C5E\u6027" },
    { name: "Unit", value: 11, description: "\u5355\u4F4D\uFF0C\u5982\u50CF\u7D20\u3001\u79D2\u7B49" },
    { name: "Value", value: 12, description: "\u5E38\u91CF\u6216\u679A\u4E3E\u6210\u5458" },
    { name: "Enum", value: 13, description: "\u679A\u4E3E\u7C7B\u578B" },
    { name: "Keyword", value: 14, description: "\u5173\u952E\u5B57\uFF0C\u5982\u8BED\u8A00\u4FDD\u7559\u5B57" },
    { name: "Snippet", value: 15, description: "\u4EE3\u7801\u7247\u6BB5" },
    { name: "Color", value: 16, description: "\u989C\u8272" },
    { name: "File", value: 17, description: "\u6587\u4EF6" },
    { name: "Reference", value: 18, description: "\u5F15\u7528\uFF0C\u901A\u5E38\u6307\u5411\u53E6\u4E00\u4E2A\u8865\u5168\u9879" },
    { name: "Folder", value: 19, description: "\u6587\u4EF6\u5939" },
    { name: "EnumMember", value: 20, description: "\u679A\u4E3E\u7684\u6210\u5458" },
    { name: "Constant", value: 21, description: "\u5E38\u91CF" },
    { name: "Struct", value: 22, description: "\u7ED3\u6784\u4F53" },
    { name: "Event", value: 23, description: "\u4E8B\u4EF6" },
    { name: "Operator", value: 24, description: "\u8FD0\u7B97\u7B26" },
    { name: "TypeParameter", value: 25, description: "\u6CDB\u578B\u6216\u7C7B\u578B\u53C2\u6570" }
  ];
  const insertTextRules = [
    { name: "None", value: 1, description: "\u6CA1\u6709\u7279\u6B8A\u89C4\u5219\uFF0C\u63D2\u5165\u6587\u672C\u5C06\u66FF\u6362\u6574\u4E2A\u8303\u56F4" },
    { name: "InsertAsSnippet", value: 2, description: "\u63D2\u5165\u6587\u672C\u5E94\u88AB\u89C6\u4E3A\u4EE3\u7801\u7247\u6BB5\uFF0C\u5141\u8BB8\u4F7F\u7528\u5360\u4F4D\u7B26" },
    { name: "KeepWhitespace", value: 4, description: "\u4FDD\u7559\u524D\u5BFC\u548C\u5C3E\u968F\u7A7A\u767D\u5B57\u7B26\uFF0C\u5373\u4F7F\u5B83\u4EEC\u5728\u63D2\u5165\u6587\u672C\u4E4B\u5916" },
    { name: "AdjustIndentation", value: 8, description: "\u8C03\u6574\u7F29\u8FDB\uFF0C\u4EE5\u5339\u914D\u63D2\u5165\u4F4D\u7F6E\u7684\u7F29\u8FDB\u7EA7\u522B" },
    { name: "ReplaceAllEnclosing", value: 16, description: "\u66FF\u6362\u6574\u4E2A\u8303\u56F4\uFF0C\u5305\u62EC\u5305\u56F4\u7684\u62EC\u53F7\u3001\u5F15\u53F7\u7B49" },
    { name: "InsertAfter", value: 32, description: "\u5728\u8303\u56F4\u4E4B\u540E\u63D2\u5165\u6587\u672C\uFF0C\u4FDD\u7559\u8303\u56F4\u5185\u7684\u6587\u672C" },
    { name: "InsertBefore", value: 64, description: "\u5728\u8303\u56F4\u4E4B\u524D\u63D2\u5165\u6587\u672C\uFF0C\u4FDD\u7559\u8303\u56F4\u5185\u7684\u6587\u672C" },
    { name: "InsertAfterComment", value: 128, description: "\u5728\u6CE8\u91CA\u7ED3\u675F\u6807\u8BB0\u540E\u63D2\u5165\u6587\u672C" }
  ];
  const tips = [
    {
      id: "1",
      label: "log",
      insertText: "console.log(${1:})",
      kind: 2,
      documentation: "Logs a message to the console.",
      detail: "Shortcut for console.log()",
      insertTextRules: [2],
      sortText: "001",
      supportLanguage: "javascript"
    },
    {
      id: "3",
      label: "watchEffectOnce",
      insertText: "const ${1:} = await zzUtil.watchEffectOnce(() => this.\\$page('${2:}'))",
      kind: 1,
      documentation: "watchEffectOnce",
      detail: "watchEffectOnce",
      insertTextRules: [2],
      sortText: "001",
      supportLanguage: "javascript"
    },
    {
      id: "2",
      label: "<xtypeRender",
      insertText: 'xtypeRender v-bind="\\$attrs" v-model="value"></xtypeRender>',
      kind: 1,
      documentation: "xtypeRender",
      detail: "xtypeRender",
      insertTextRules: [2],
      sortText: "001",
      supportLanguage: "html"
    }
  ];
  var render$2 = function() {
    var _vm = this;
    var _h2 = _vm.$createElement;
    var _c2 = _vm._self._c || _h2;
    return _c2("div", [_c2("el-tree", {
      attrs: {
        "data": _vm.languages,
        "props": _vm.defaultProps
      },
      scopedSlots: _vm._u([{
        key: "default",
        fn: function(_ref) {
          var node = _ref.node;
          _ref.data;
          return _c2("span", {
            staticClass: "custom-tree-node"
          }, [_c2("span", [_vm._v(_vm._s(node.label))])]);
        }
      }])
    }), _c2("el-dialog", {
      attrs: {
        "append-to-body": "",
        "title": "\u65B0\u589E\u4EE3\u7801\u7247\u6BB5",
        "visible": _vm.formShow,
        "before-close": _vm.dialogClose
      }
    }, [_c2("el-form", {
      ref: "form",
      attrs: {
        "rules": _vm.rules,
        "label-width": "120px",
        "model": _vm.editTips
      }
    }, [_c2("el-form-item", {
      attrs: {
        "label": "label"
      }
    }, [_c2("el-input", {
      attrs: {
        "autosize": {
          minRows: 3
        },
        "type": "textarea"
      },
      model: {
        value: _vm.editTips.label,
        callback: function($$v) {
          _vm.$set(_vm.editTips, "label", $$v);
        },
        expression: "editTips.label"
      }
    })], 1), _c2("el-form-item", {
      attrs: {
        "label": "insertText"
      }
    }, [_c2("el-input", {
      attrs: {
        "autosize": {
          minRows: 4
        },
        "type": "textarea"
      },
      model: {
        value: _vm.editTips.insertText,
        callback: function($$v) {
          _vm.$set(_vm.editTips, "insertText", $$v);
        },
        expression: "editTips.insertText"
      }
    })], 1), _c2("el-form-item", {
      attrs: {
        "label": "kind"
      }
    }, [_c2("el-select", {
      staticClass: "tw-w-full",
      model: {
        value: _vm.editTips.kind,
        callback: function($$v) {
          _vm.$set(_vm.editTips, "kind", $$v);
        },
        expression: "editTips.kind"
      }
    }, _vm._l(_vm.completionItemKinds, function(item) {
      return _c2("el-option", {
        key: item.value,
        attrs: {
          "label": item.name,
          "value": item.value
        }
      });
    }), 1)], 1), _c2("el-form-item", {
      attrs: {
        "label": "documentation"
      }
    }, [_c2("el-input", {
      model: {
        value: _vm.editTips.documentation,
        callback: function($$v) {
          _vm.$set(_vm.editTips, "documentation", $$v);
        },
        expression: "editTips.documentation"
      }
    })], 1), _c2("el-form-item", {
      attrs: {
        "label": "detail"
      }
    }, [_c2("el-input", {
      model: {
        value: _vm.editTips.detail,
        callback: function($$v) {
          _vm.$set(_vm.editTips, "detail", $$v);
        },
        expression: "editTips.detail"
      }
    })], 1), _c2("el-form-item", {
      attrs: {
        "label": "insertTextRules"
      }
    }, [_c2("el-select", {
      staticClass: "tw-w-full",
      attrs: {
        "multiple": ""
      },
      model: {
        value: _vm.editTips.insertTextRules,
        callback: function($$v) {
          _vm.$set(_vm.editTips, "insertTextRules", $$v);
        },
        expression: "editTips.insertTextRules"
      }
    }, _vm._l(_vm.insertTextRules, function(item) {
      return _c2("el-option", {
        key: item.value,
        attrs: {
          "label": item.name,
          "value": item.value
        }
      });
    }), 1), _c2("div", _vm._l(_vm.showTags, function(item) {
      return _c2("el-tag", {
        key: item.value
      }, [_vm._v(_vm._s(item.name))]);
    }), 1)], 1), _c2("el-form-item", {
      attrs: {
        "label": "sortText"
      }
    }, [_c2("el-input", {
      model: {
        value: _vm.editTips.sortText,
        callback: function($$v) {
          _vm.$set(_vm.editTips, "sortText", $$v);
        },
        expression: "editTips.sortText"
      }
    })], 1)], 1), _c2("span", {
      staticClass: "dialog-footer",
      attrs: {
        "slot": "footer"
      },
      slot: "footer"
    }, [_c2("el-button", {
      on: {
        "click": _vm.cancel
      }
    }, [_vm._v("\u53D6 \u6D88")]), _c2("el-button", {
      attrs: {
        "type": "primary"
      },
      on: {
        "click": _vm.confirm
      }
    }, [_vm._v("\u786E \u5B9A")])], 1)], 1)], 1);
  };
  var staticRenderFns$1 = [];
  function normalizeComponent(scriptExports, render2, staticRenderFns2, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
    var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
    if (render2) {
      options.render = render2;
      options.staticRenderFns = staticRenderFns2;
      options._compiled = true;
    }
    if (functionalTemplate) {
      options.functional = true;
    }
    if (scopeId) {
      options._scopeId = "data-v-" + scopeId;
    }
    var hook;
    if (moduleIdentifier) {
      hook = function(context) {
        context = context || this.$vnode && this.$vnode.ssrContext || this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext;
        if (!context && typeof __VUE_SSR_CONTEXT__ !== "undefined") {
          context = __VUE_SSR_CONTEXT__;
        }
        if (injectStyles) {
          injectStyles.call(this, context);
        }
        if (context && context._registeredComponents) {
          context._registeredComponents.add(moduleIdentifier);
        }
      };
      options._ssrRegister = hook;
    } else if (injectStyles) {
      hook = shadowMode ? function() {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        );
      } : injectStyles;
    }
    if (hook) {
      if (options.functional) {
        options._injectStyles = hook;
        var originalRender = options.render;
        options.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        var existing = options.beforeCreate;
        options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
    return {
      exports: scriptExports,
      options
    };
  }
  const _$3 = _unsafeWindow._;
  const __vue2_script$1 = {
    name: "",
    data: () => ({
      languages: [
        {
          name: "javascript",
          children: []
        },
        {
          name: "css",
          children: []
        },
        {
          name: "html",
          children: []
        },
        {
          name: "json",
          children: []
        }
      ],
      activeNames: "",
      colSpans: {},
      formShow: false,
      defaultProps: {
        children: "children",
        label: "name"
      },
      editTips: {},
      completionItemKinds: [],
      insertTextRules: [],
      rules: {
        label: [{ required: true, message: "\u8BF7\u8F93\u5165label", trigger: "blur" }],
        insertText: [
          { required: true, message: "\u8BF7\u8F93\u5165insertText", trigger: "blur" }
        ],
        kind: [{ required: true, message: "\u8BF7\u9009\u62E9kind", trigger: "change" }],
        detail: [{ required: true, message: "\u8BF7\u8F93\u5165detail", trigger: "blur" }],
        documentation: [
          { required: true, message: "\u8BF7\u8F93\u5165documentation", trigger: "blur" }
        ]
      }
    }),
    computed: {
      colKeys() {
        return Object.keys(this.colSpans);
      },
      showTags() {
        const { insertTextRules: rules = [] } = this.editTips;
        return insertTextRules.filter((i) => rules.includes(i.value));
      }
    },
    methods: {
      handleChange() {
      },
      editSnippet() {
      },
      getLabel(node) {
        console.log(node);
      },
      append(node, data) {
        this.formShow = true;
      },
      edit(node, data) {
        console.log(data);
        this.editTips = data.data;
        this.formShow = true;
      },
      dialogClose() {
        this.editTips = {};
        this.formShow = false;
      },
      cancel() {
        this.dialogClose();
      },
      async confirm() {
        const check = await this.$refs.form.validate();
        if (!check)
          return;
      },
      initData() {
        let codeSnippets = _unsafeWindow.editorTips;
        let obj = _$3.groupBy(codeSnippets, "supportLanguage");
        this.languages.forEach((language) => {
          var _a2;
          let arr = (_a2 = obj[language.name]) != null ? _a2 : [];
          language.children = arr.map((i) => ({
            name: `${i.label}(${i.detail})`,
            data: i
          }));
        });
      }
    },
    async mounted() {
      this.completionItemKinds = completionItemKinds;
      this.insertTextRules = insertTextRules;
      this.initData();
    }
  };
  const __cssModules$1 = {};
  var __component__$1 = /* @__PURE__ */ normalizeComponent(
    __vue2_script$1,
    render$2,
    staticRenderFns$1,
    false,
    __vue2_injectStyles$1,
    "545643b4",
    null,
    null
  );
  function __vue2_injectStyles$1(context) {
    for (let o in __cssModules$1) {
      this[o] = __cssModules$1[o];
    }
  }
  var Tips = /* @__PURE__ */ function() {
    return __component__$1.exports;
  }();
  const codeThemeList = [
    { name: "vs", value: "vs", out: true, group: "\u9ED8\u8BA4" },
    { name: "vs-dark", value: "vs-dark", out: true, group: "\u9ED8\u8BA4" },
    { name: "hc-black", value: "hc-black", out: true, group: "\u9ED8\u8BA4" },
    {
      "group": "Winter is Coming",
      "name": "Winter Is Coming1",
      "themeName": "WinterIsComing1",
      "path": "WinterIsComing-dark-blue-color-no-italics-theme.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Winter is Coming",
      "name": "Winter is Coming5",
      "themeName": "WinterisComing5",
      "path": "WinterIsComing-light-color-no-italics-theme.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Winter is Coming",
      "name": "Winter is Coming6",
      "themeName": "WinterisComing6",
      "path": "WinterIsComing-light-color-theme.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Winter is Coming",
      "name": "Winter Is Coming3",
      "themeName": "WinterIsComing3",
      "path": "WinterIsComing-dark-color-no-italics-theme.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Winter is Coming",
      "name": "Winter Is Coming4",
      "themeName": "WinterIsComing4",
      "path": "WinterIsComing-dark-color-theme.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Winter is Coming",
      "name": "Winter Is Coming2",
      "themeName": "WinterIsComing2",
      "path": "WinterIsComing-dark-blue-color-theme.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Catppuccin",
      "name": "Catppuccin Macchiato",
      "themeName": "CatppuccinMacchiato",
      "path": "macchiato.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Catppuccin",
      "name": "Catppuccin Mocha",
      "themeName": "CatppuccinMocha",
      "path": "mocha.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Catppuccin",
      "name": "Catppuccin Frapp\xE9",
      "themeName": "CatppuccinFrapp\xE9",
      "path": "frappe.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Catppuccin",
      "name": "Catppuccin Latte",
      "themeName": "CatppuccinLatte",
      "path": "latte.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Atom One Dark Theme",
      "name": "OneDark",
      "themeName": "OneDark",
      "path": "OneDark.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "One Dark Pro",
      "name": "One Dark Pro1",
      "themeName": "OneDarkPro1",
      "path": "OneDark-Pro-darker.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "One Dark Pro",
      "name": "One Dark Pro2",
      "themeName": "OneDarkPro2",
      "path": "OneDark-Pro-flat.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "One Dark Pro",
      "name": "One Dark Pro3",
      "themeName": "OneDarkPro3",
      "path": "OneDark-Pro-mix.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "One Dark Pro",
      "name": "One Dark Pro4",
      "themeName": "OneDarkPro4",
      "path": "OneDark-Pro.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "GitHub's",
      "name": "GitHub Dark High Contrast",
      "themeName": "GitHubDarkHighContrast",
      "path": "dark-high-contrast.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "GitHub's",
      "name": "GitHub Dark Colorblind",
      "themeName": "GitHubDarkColorblind",
      "path": "dark-colorblind.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "GitHub's",
      "name": "GitHub Light Colorblind",
      "themeName": "GitHubLightColorblind",
      "path": "light-colorblind.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "GitHub's",
      "name": "GitHub Light",
      "themeName": "GitHubLight",
      "path": "light.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "GitHub's",
      "name": "GitHub Light Default",
      "themeName": "GitHubLightDefault",
      "path": "light-default.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "GitHub's",
      "name": "GitHub Light High Contrast",
      "themeName": "GitHubLightHighContrast",
      "path": "light-high-contrast.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "GitHub's",
      "name": "GitHub Dark",
      "themeName": "GitHubDark",
      "path": "dark.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "GitHub's",
      "name": "GitHub Dark Default",
      "themeName": "GitHubDarkDefault",
      "path": "dark-default.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "GitHub's",
      "name": "GitHub Dark Dimmed",
      "themeName": "GitHubDarkDimmed",
      "path": "dark-dimmed.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Monokai Pro",
      "name": "Monokai Classic",
      "themeName": "MonokaiClassic",
      "path": "Monokai Classic.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Monokai Pro",
      "name": "Monokai Pro (Filter Ristretto)",
      "themeName": "MonokaiProFilterRistretto",
      "path": "Monokai Pro (Filter Ristretto).json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Monokai Pro",
      "name": "Monokai Pro",
      "themeName": "MonokaiPro",
      "path": "Monokai Pro.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Monokai Pro",
      "name": "Monokai Pro (Filter Machine)",
      "themeName": "MonokaiProFilterMachine",
      "path": "Monokai Pro (Filter Machine).json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Monokai Pro",
      "name": "Monokai Pro (Filter Octagon)",
      "themeName": "MonokaiProFilterOctagon",
      "path": "Monokai Pro (Filter Octagon).json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Monokai Pro",
      "name": "Monokai Pro (Filter Spectrum)",
      "themeName": "MonokaiProFilterSpectrum",
      "path": "Monokai Pro (Filter Spectrum).json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Bluloco Dark",
      "name": "Bluloco Dark Italic",
      "themeName": "BlulocoDarkItalic",
      "path": "bluloco-dark-italic-color-theme.json",
      "loaded": false,
      "cache": ""
    },
    {
      "group": "Bluloco Dark",
      "name": "Bluloco Dark",
      "themeName": "BlulocoDark",
      "path": "bluloco-dark-color-theme.json",
      "loaded": false,
      "cache": ""
    }
  ];
  const fontFamilys = [
    { label: "Fira Code", value: "Fira Code, Monoid, Consolas, monospace" },
    { label: "Menlo", value: "Menlo, Monaco, Courier New, monospace" }
  ];
  var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
  function getAugmentedNamespace(n) {
    if (n.__esModule)
      return n;
    var a = Object.defineProperty({}, "__esModule", { value: true });
    Object.keys(n).forEach(function(k) {
      var d2 = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d2.get ? d2 : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }
  var main$1 = {};
  var registry = {};
  var grammar = {};
  var utils = {};
  Object.defineProperty(utils, "__esModule", { value: true });
  function clone(something) {
    return doClone(something);
  }
  utils.clone = clone;
  function doClone(something) {
    if (Array.isArray(something)) {
      return cloneArray(something);
    }
    if (typeof something === "object") {
      return cloneObj(something);
    }
    return something;
  }
  function cloneArray(arr) {
    var r = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      r[i] = doClone(arr[i]);
    }
    return r;
  }
  function cloneObj(obj) {
    var r = {};
    for (var key in obj) {
      r[key] = doClone(obj[key]);
    }
    return r;
  }
  function mergeObjects(target) {
    var sources = [];
    for (var _i2 = 1; _i2 < arguments.length; _i2++) {
      sources[_i2 - 1] = arguments[_i2];
    }
    sources.forEach(function(source) {
      for (var key in source) {
        target[key] = source[key];
      }
    });
    return target;
  }
  utils.mergeObjects = mergeObjects;
  var CAPTURING_REGEX_SOURCE = /\$(\d+)|\${(\d+):\/(downcase|upcase)}/;
  var RegexSource = function() {
    function RegexSource2() {
    }
    RegexSource2.hasCaptures = function(regexSource) {
      return CAPTURING_REGEX_SOURCE.test(regexSource);
    };
    RegexSource2.replaceCaptures = function(regexSource, captureSource, captureIndices) {
      return regexSource.replace(CAPTURING_REGEX_SOURCE, function(match, index, commandIndex, command) {
        var capture = captureIndices[parseInt(index || commandIndex, 10)];
        if (capture) {
          var result = captureSource.substring(capture.start, capture.end);
          while (result[0] === ".") {
            result = result.substring(1);
          }
          switch (command) {
            case "downcase":
              return result.toLowerCase();
            case "upcase":
              return result.toUpperCase();
            default:
              return result;
          }
        } else {
          return match;
        }
      });
    };
    return RegexSource2;
  }();
  utils.RegexSource = RegexSource;
  var rule = {};
  var __viteBrowserExternal = {};
  var __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    "default": __viteBrowserExternal
  }, Symbol.toStringTag, { value: "Module" }));
  var require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
  var lib = {};
  var onigasmH = {};
  var onigasm = { exports: {} };
  (function(module, exports) {
    var Onigasm = function() {
      typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
      return function(Onigasm2) {
        Onigasm2 = Onigasm2 || {};
        var Module = typeof Onigasm2 !== "undefined" ? Onigasm2 : {};
        var moduleOverrides = {};
        var key;
        for (key in Module) {
          if (Module.hasOwnProperty(key)) {
            moduleOverrides[key] = Module[key];
          }
        }
        var ENVIRONMENT_IS_WORKER = false;
        var scriptDirectory = "";
        function locateFile(path2) {
          if (Module["locateFile"]) {
            return Module["locateFile"](path2, scriptDirectory);
          }
          return scriptDirectory + path2;
        }
        var readBinary;
        {
          readBinary = function readBinary2(f2) {
            var data;
            if (typeof readbuffer === "function") {
              return new Uint8Array(readbuffer(f2));
            }
            data = read(f2, "binary");
            assert(typeof data === "object");
            return data;
          };
          if (typeof scriptArgs != "undefined") {
            scriptArgs;
          }
          if (typeof print !== "undefined") {
            if (typeof console === "undefined")
              console = {};
//             console.log = print;
//             console.warn = console.error = typeof printErr !== "undefined" ? printErr : print;
          }
        }
        var out = Module["print"] || console.log.bind(console);
        var err = Module["printErr"] || console.warn.bind(console);
        for (key in moduleOverrides) {
          if (moduleOverrides.hasOwnProperty(key)) {
            Module[key] = moduleOverrides[key];
          }
        }
        moduleOverrides = null;
        if (Module["arguments"])
          Module["arguments"];
        if (Module["thisProgram"])
          Module["thisProgram"];
        if (Module["quit"])
          Module["quit"];
        var wasmBinary;
        if (Module["wasmBinary"])
          wasmBinary = Module["wasmBinary"];
        if (Module["noExitRuntime"])
          Module["noExitRuntime"];
        if (typeof WebAssembly !== "object") {
          err("no native wasm support detected");
        }
        var wasmMemory;
        var wasmTable = new WebAssembly.Table({ "initial": 244, "maximum": 244 + 0, "element": "anyfunc" });
        var ABORT = false;
        function assert(condition, text) {
          if (!condition) {
            abort("Assertion failed: " + text);
          }
        }
        function getCFunc(ident) {
          var func = Module["_" + ident];
          assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
          return func;
        }
        function ccall(ident, returnType, argTypes, args, opts) {
          var toC = { "string": function(str) {
            var ret2 = 0;
            if (str !== null && str !== void 0 && str !== 0) {
              var len = (str.length << 2) + 1;
              ret2 = stackAlloc(len);
              stringToUTF8(str, ret2, len);
            }
            return ret2;
          }, "array": function(arr) {
            var ret2 = stackAlloc(arr.length);
            writeArrayToMemory(arr, ret2);
            return ret2;
          } };
          function convertReturnValue(ret2) {
            if (returnType === "string")
              return UTF8ToString(ret2);
            if (returnType === "boolean")
              return Boolean(ret2);
            return ret2;
          }
          var func = getCFunc(ident);
          var cArgs = [];
          var stack = 0;
          if (args) {
            for (var i = 0; i < args.length; i++) {
              var converter = toC[argTypes[i]];
              if (converter) {
                if (stack === 0)
                  stack = stackSave();
                cArgs[i] = converter(args[i]);
              } else {
                cArgs[i] = args[i];
              }
            }
          }
          var ret = func.apply(null, cArgs);
          ret = convertReturnValue(ret);
          if (stack !== 0)
            stackRestore(stack);
          return ret;
        }
        var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : void 0;
        function UTF8ArrayToString(u8Array, idx, maxBytesToRead) {
          var endIdx = idx + maxBytesToRead;
          var endPtr = idx;
          while (u8Array[endPtr] && !(endPtr >= endIdx))
            ++endPtr;
          if (endPtr - idx > 16 && u8Array.subarray && UTF8Decoder) {
            return UTF8Decoder.decode(u8Array.subarray(idx, endPtr));
          } else {
            var str = "";
            while (idx < endPtr) {
              var u0 = u8Array[idx++];
              if (!(u0 & 128)) {
                str += String.fromCharCode(u0);
                continue;
              }
              var u1 = u8Array[idx++] & 63;
              if ((u0 & 224) == 192) {
                str += String.fromCharCode((u0 & 31) << 6 | u1);
                continue;
              }
              var u2 = u8Array[idx++] & 63;
              if ((u0 & 240) == 224) {
                u0 = (u0 & 15) << 12 | u1 << 6 | u2;
              } else {
                u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | u8Array[idx++] & 63;
              }
              if (u0 < 65536) {
                str += String.fromCharCode(u0);
              } else {
                var ch = u0 - 65536;
                str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
              }
            }
          }
          return str;
        }
        function UTF8ToString(ptr, maxBytesToRead) {
          return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
        }
        function stringToUTF8Array(str, outU8Array, outIdx, maxBytesToWrite) {
          if (!(maxBytesToWrite > 0))
            return 0;
          var startIdx = outIdx;
          var endIdx = outIdx + maxBytesToWrite - 1;
          for (var i = 0; i < str.length; ++i) {
            var u = str.charCodeAt(i);
            if (u >= 55296 && u <= 57343) {
              var u1 = str.charCodeAt(++i);
              u = 65536 + ((u & 1023) << 10) | u1 & 1023;
            }
            if (u <= 127) {
              if (outIdx >= endIdx)
                break;
              outU8Array[outIdx++] = u;
            } else if (u <= 2047) {
              if (outIdx + 1 >= endIdx)
                break;
              outU8Array[outIdx++] = 192 | u >> 6;
              outU8Array[outIdx++] = 128 | u & 63;
            } else if (u <= 65535) {
              if (outIdx + 2 >= endIdx)
                break;
              outU8Array[outIdx++] = 224 | u >> 12;
              outU8Array[outIdx++] = 128 | u >> 6 & 63;
              outU8Array[outIdx++] = 128 | u & 63;
            } else {
              if (outIdx + 3 >= endIdx)
                break;
              outU8Array[outIdx++] = 240 | u >> 18;
              outU8Array[outIdx++] = 128 | u >> 12 & 63;
              outU8Array[outIdx++] = 128 | u >> 6 & 63;
              outU8Array[outIdx++] = 128 | u & 63;
            }
          }
          outU8Array[outIdx] = 0;
          return outIdx - startIdx;
        }
        function stringToUTF8(str, outPtr, maxBytesToWrite) {
          return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
        }
        typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : void 0;
        function writeArrayToMemory(array, buffer2) {
          HEAP8.set(array, buffer2);
        }
        var WASM_PAGE_SIZE = 65536;
        function alignUp(x2, multiple) {
          if (x2 % multiple > 0) {
            x2 += multiple - x2 % multiple;
          }
          return x2;
        }
        var buffer, HEAP8, HEAPU8, HEAP32;
        function updateGlobalBufferAndViews(buf) {
          buffer = buf;
          Module["HEAP8"] = HEAP8 = new Int8Array(buf);
          Module["HEAP16"] = new Int16Array(buf);
          Module["HEAP32"] = HEAP32 = new Int32Array(buf);
          Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
          Module["HEAPU16"] = new Uint16Array(buf);
          Module["HEAPU32"] = new Uint32Array(buf);
          Module["HEAPF32"] = new Float32Array(buf);
          Module["HEAPF64"] = new Float64Array(buf);
        }
        var DYNAMIC_BASE = 5507664, DYNAMICTOP_PTR = 264624;
        var INITIAL_TOTAL_MEMORY = Module["TOTAL_MEMORY"] || 157286400;
        if (Module["wasmMemory"]) {
          wasmMemory = Module["wasmMemory"];
        } else {
          wasmMemory = new WebAssembly.Memory({ "initial": INITIAL_TOTAL_MEMORY / WASM_PAGE_SIZE });
        }
        if (wasmMemory) {
          buffer = wasmMemory.buffer;
        }
        INITIAL_TOTAL_MEMORY = buffer.byteLength;
        updateGlobalBufferAndViews(buffer);
        HEAP32[DYNAMICTOP_PTR >> 2] = DYNAMIC_BASE;
        function callRuntimeCallbacks(callbacks) {
          while (callbacks.length > 0) {
            var callback = callbacks.shift();
            if (typeof callback == "function") {
              callback();
              continue;
            }
            var func = callback.func;
            if (typeof func === "number") {
              if (callback.arg === void 0) {
                Module["dynCall_v"](func);
              } else {
                Module["dynCall_vi"](func, callback.arg);
              }
            } else {
              func(callback.arg === void 0 ? null : callback.arg);
            }
          }
        }
        var __ATPRERUN__ = [];
        var __ATINIT__ = [];
        var __ATMAIN__ = [];
        var __ATPOSTRUN__ = [];
        function preRun() {
          if (Module["preRun"]) {
            if (typeof Module["preRun"] == "function")
              Module["preRun"] = [Module["preRun"]];
            while (Module["preRun"].length) {
              addOnPreRun(Module["preRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPRERUN__);
        }
        function initRuntime() {
          callRuntimeCallbacks(__ATINIT__);
        }
        function preMain() {
          callRuntimeCallbacks(__ATMAIN__);
        }
        function postRun() {
          if (Module["postRun"]) {
            if (typeof Module["postRun"] == "function")
              Module["postRun"] = [Module["postRun"]];
            while (Module["postRun"].length) {
              addOnPostRun(Module["postRun"].shift());
            }
          }
          callRuntimeCallbacks(__ATPOSTRUN__);
        }
        function addOnPreRun(cb) {
          __ATPRERUN__.unshift(cb);
        }
        function addOnPostRun(cb) {
          __ATPOSTRUN__.unshift(cb);
        }
        var runDependencies = 0;
        var dependenciesFulfilled = null;
        function addRunDependency(id) {
          runDependencies++;
          if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
          }
        }
        function removeRunDependency(id) {
          runDependencies--;
          if (Module["monitorRunDependencies"]) {
            Module["monitorRunDependencies"](runDependencies);
          }
          if (runDependencies == 0) {
            if (dependenciesFulfilled) {
              var callback = dependenciesFulfilled;
              dependenciesFulfilled = null;
              callback();
            }
          }
        }
        Module["preloadedImages"] = {};
        Module["preloadedAudios"] = {};
        function abort(what) {
          if (Module["onAbort"]) {
            Module["onAbort"](what);
          }
          what += "";
          out(what);
          err(what);
          ABORT = true;
          what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
          throw new WebAssembly.RuntimeError(what);
        }
        var dataURIPrefix = "data:application/octet-stream;base64,";
        function isDataURI(filename) {
          return String.prototype.startsWith ? filename.startsWith(dataURIPrefix) : filename.indexOf(dataURIPrefix) === 0;
        }
        var wasmBinaryFile = "onigasm.wasm";
        if (!isDataURI(wasmBinaryFile)) {
          wasmBinaryFile = locateFile(wasmBinaryFile);
        }
        function getBinary() {
          try {
            if (wasmBinary) {
              return new Uint8Array(wasmBinary);
            }
            if (readBinary) {
              return readBinary(wasmBinaryFile);
            } else {
              throw "both async and sync fetching of the wasm failed";
            }
          } catch (err2) {
            abort(err2);
          }
        }
        function getBinaryPromise() {
          if (!wasmBinary && ENVIRONMENT_IS_WORKER && typeof fetch === "function") {
            return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
              if (!response["ok"]) {
                throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
              }
              return response["arrayBuffer"]();
            }).catch(function() {
              return getBinary();
            });
          }
          return new Promise(function(resolve, reject) {
            resolve(getBinary());
          });
        }
        function createWasm() {
          var info = { "env": asmLibraryArg, "wasi_unstable": asmLibraryArg };
          function receiveInstance(instance, module2) {
            var exports3 = instance.exports;
            Module["asm"] = exports3;
            removeRunDependency();
          }
          addRunDependency();
          function receiveInstantiatedSource(output) {
            receiveInstance(output["instance"]);
          }
          function instantiateArrayBuffer(receiver) {
            return getBinaryPromise().then(function(binary) {
              return WebAssembly.instantiate(binary, info);
            }).then(receiver, function(reason) {
              err("failed to asynchronously prepare wasm: " + reason);
              abort(reason);
            });
          }
          function instantiateAsync() {
            if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
              fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
                var result = WebAssembly.instantiateStreaming(response, info);
                return result.then(receiveInstantiatedSource, function(reason) {
                  err("wasm streaming compile failed: " + reason);
                  err("falling back to ArrayBuffer instantiation");
                  instantiateArrayBuffer(receiveInstantiatedSource);
                });
              });
            } else {
              return instantiateArrayBuffer(receiveInstantiatedSource);
            }
          }
          if (Module["instantiateWasm"]) {
            try {
              var exports2 = Module["instantiateWasm"](info, receiveInstance);
              return exports2;
            } catch (e4) {
              err("Module.instantiateWasm callback failed with error: " + e4);
              return false;
            }
          }
          instantiateAsync();
          return {};
        }
        __ATINIT__.push({ func: function() {
          ___wasm_call_ctors();
        } });
        function _abort() {
          abort();
        }
        function _emscripten_get_heap_size() {
          return HEAP8.length;
        }
        function _emscripten_get_sbrk_ptr() {
          return 264624;
        }
        function _emscripten_memcpy_big(dest, src, num) {
          HEAPU8.set(HEAPU8.subarray(src, src + num), dest);
        }
        function emscripten_realloc_buffer(size) {
          try {
            wasmMemory.grow(size - buffer.byteLength + 65535 >> 16);
            updateGlobalBufferAndViews(wasmMemory.buffer);
            return 1;
          } catch (e4) {
          }
        }
        function _emscripten_resize_heap(requestedSize) {
          var oldSize = _emscripten_get_heap_size();
          var PAGE_MULTIPLE = 65536;
          var LIMIT = 2147483648 - PAGE_MULTIPLE;
          if (requestedSize > LIMIT) {
            return false;
          }
          var MIN_TOTAL_MEMORY = 16777216;
          var newSize = Math.max(oldSize, MIN_TOTAL_MEMORY);
          while (newSize < requestedSize) {
            if (newSize <= 536870912) {
              newSize = alignUp(2 * newSize, PAGE_MULTIPLE);
            } else {
              newSize = Math.min(alignUp((3 * newSize + 2147483648) / 4, PAGE_MULTIPLE), LIMIT);
            }
          }
          var replacement = emscripten_realloc_buffer(newSize);
          if (!replacement) {
            return false;
          }
          return true;
        }
        var SYSCALLS = { buffers: [null, [], []], printChar: function(stream, curr) {
          var buffer2 = SYSCALLS.buffers[stream];
          if (curr === 0 || curr === 10) {
            (stream === 1 ? out : err)(UTF8ArrayToString(buffer2, 0));
            buffer2.length = 0;
          } else {
            buffer2.push(curr);
          }
        }, varargs: 0, get: function(varargs) {
          SYSCALLS.varargs += 4;
          var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
          return ret;
        }, getStr: function() {
          var ret = UTF8ToString(SYSCALLS.get());
          return ret;
        }, get64: function() {
          var low = SYSCALLS.get();
          SYSCALLS.get();
          return low;
        }, getZero: function() {
          SYSCALLS.get();
        } };
        function _fd_close(fd) {
          try {
            return 0;
          } catch (e4) {
            if (typeof FS === "undefined" || !(e4 instanceof FS.ErrnoError))
              abort(e4);
            return e4.errno;
          }
        }
        function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
          try {
            return 0;
          } catch (e4) {
            if (typeof FS === "undefined" || !(e4 instanceof FS.ErrnoError))
              abort(e4);
            return e4.errno;
          }
        }
        function _fd_write(fd, iov, iovcnt, pnum) {
          try {
            var num = 0;
            for (var i = 0; i < iovcnt; i++) {
              var ptr = HEAP32[iov + i * 8 >> 2];
              var len = HEAP32[iov + (i * 8 + 4) >> 2];
              for (var j2 = 0; j2 < len; j2++) {
                SYSCALLS.printChar(fd, HEAPU8[ptr + j2]);
              }
              num += len;
            }
            HEAP32[pnum >> 2] = num;
            return 0;
          } catch (e4) {
            if (typeof FS === "undefined" || !(e4 instanceof FS.ErrnoError))
              abort(e4);
            return e4.errno;
          }
        }
        function _setTempRet0($i) {
        }
        var asmLibraryArg = { "abort": _abort, "emscripten_get_sbrk_ptr": _emscripten_get_sbrk_ptr, "emscripten_memcpy_big": _emscripten_memcpy_big, "emscripten_resize_heap": _emscripten_resize_heap, "fd_close": _fd_close, "fd_seek": _fd_seek, "fd_write": _fd_write, "memory": wasmMemory, "setTempRet0": _setTempRet0, "table": wasmTable };
        var asm = createWasm();
        Module["asm"] = asm;
        var ___wasm_call_ctors = Module["___wasm_call_ctors"] = function() {
          return Module["asm"]["__wasm_call_ctors"].apply(null, arguments);
        };
        Module["_malloc"] = function() {
          return Module["asm"]["malloc"].apply(null, arguments);
        };
        Module["_free"] = function() {
          return Module["asm"]["free"].apply(null, arguments);
        };
        Module["_getLastError"] = function() {
          return Module["asm"]["getLastError"].apply(null, arguments);
        };
        Module["_compilePattern"] = function() {
          return Module["asm"]["compilePattern"].apply(null, arguments);
        };
        Module["_disposeCompiledPatterns"] = function() {
          return Module["asm"]["disposeCompiledPatterns"].apply(null, arguments);
        };
        Module["_findBestMatch"] = function() {
          return Module["asm"]["findBestMatch"].apply(null, arguments);
        };
        Module["___cxa_demangle"] = function() {
          return Module["asm"]["__cxa_demangle"].apply(null, arguments);
        };
        Module["_setThrew"] = function() {
          return Module["asm"]["setThrew"].apply(null, arguments);
        };
        var stackSave = Module["stackSave"] = function() {
          return Module["asm"]["stackSave"].apply(null, arguments);
        };
        var stackAlloc = Module["stackAlloc"] = function() {
          return Module["asm"]["stackAlloc"].apply(null, arguments);
        };
        var stackRestore = Module["stackRestore"] = function() {
          return Module["asm"]["stackRestore"].apply(null, arguments);
        };
        Module["__growWasmMemory"] = function() {
          return Module["asm"]["__growWasmMemory"].apply(null, arguments);
        };
        Module["dynCall_vi"] = function() {
          return Module["asm"]["dynCall_vi"].apply(null, arguments);
        };
        Module["dynCall_iiii"] = function() {
          return Module["asm"]["dynCall_iiii"].apply(null, arguments);
        };
        Module["dynCall_iiiii"] = function() {
          return Module["asm"]["dynCall_iiiii"].apply(null, arguments);
        };
        Module["dynCall_iii"] = function() {
          return Module["asm"]["dynCall_iii"].apply(null, arguments);
        };
        Module["dynCall_iidiiii"] = function() {
          return Module["asm"]["dynCall_iidiiii"].apply(null, arguments);
        };
        Module["dynCall_vii"] = function() {
          return Module["asm"]["dynCall_vii"].apply(null, arguments);
        };
        Module["dynCall_ii"] = function() {
          return Module["asm"]["dynCall_ii"].apply(null, arguments);
        };
        Module["dynCall_i"] = function() {
          return Module["asm"]["dynCall_i"].apply(null, arguments);
        };
        Module["dynCall_v"] = function() {
          return Module["asm"]["dynCall_v"].apply(null, arguments);
        };
        Module["dynCall_viiiiii"] = function() {
          return Module["asm"]["dynCall_viiiiii"].apply(null, arguments);
        };
        Module["dynCall_viiiii"] = function() {
          return Module["asm"]["dynCall_viiiii"].apply(null, arguments);
        };
        Module["dynCall_viiii"] = function() {
          return Module["asm"]["dynCall_viiii"].apply(null, arguments);
        };
        Module["dynCall_jiji"] = function() {
          return Module["asm"]["dynCall_jiji"].apply(null, arguments);
        };
        Module["asm"] = asm;
        Module["ccall"] = ccall;
        var calledRun;
        Module["then"] = function(func) {
          if (calledRun) {
            func(Module);
          } else {
            var old = Module["onRuntimeInitialized"];
            Module["onRuntimeInitialized"] = function() {
              if (old)
                old();
              func(Module);
            };
          }
          return Module;
        };
        dependenciesFulfilled = function runCaller() {
          if (!calledRun)
            run();
          if (!calledRun)
            dependenciesFulfilled = runCaller;
        };
        function run(args) {
          if (runDependencies > 0) {
            return;
          }
          preRun();
          if (runDependencies > 0)
            return;
          function doRun() {
            if (calledRun)
              return;
            calledRun = true;
            if (ABORT)
              return;
            initRuntime();
            preMain();
            if (Module["onRuntimeInitialized"])
              Module["onRuntimeInitialized"]();
            postRun();
          }
          if (Module["setStatus"]) {
            Module["setStatus"]("Running...");
            setTimeout(function() {
              setTimeout(function() {
                Module["setStatus"]("");
              }, 1);
              doRun();
            }, 1);
          } else {
            doRun();
          }
        }
        Module["run"] = run;
        if (Module["preInit"]) {
          if (typeof Module["preInit"] == "function")
            Module["preInit"] = [Module["preInit"]];
          while (Module["preInit"].length > 0) {
            Module["preInit"].pop()();
          }
        }
        run();
        return Onigasm2;
      };
    }();
    module.exports = Onigasm;
  })(onigasm);
  Object.defineProperty(onigasmH, "__esModule", { value: true });
  const OnigasmModuleFactory = onigasm.exports;
  async function initModule(bytes) {
    return new Promise((resolve, reject) => {
      OnigasmModuleFactory({
        instantiateWasm(imports, successCallback) {
          WebAssembly.instantiate(bytes, imports).then((output) => {
            successCallback(output.instance);
          }).catch((e4) => {
            throw e4;
          });
          return {};
        }
      }).then((moduleH) => {
        onigasmH.onigasmH = moduleH;
        resolve();
      });
    });
  }
  let isInitialized = false;
  async function loadWASM$1(data) {
    if (isInitialized) {
      throw new Error(`Onigasm#init has been called and was succesful, subsequent calls are not allowed once initialized`);
    }
    if (typeof data === "string") {
      const arrayBuffer = await (await fetch(data)).arrayBuffer();
      await initModule(arrayBuffer);
    } else if (data instanceof ArrayBuffer) {
      await initModule(data);
    } else {
      throw new TypeError(`Expected a string (URL of .wasm file) or ArrayBuffer (.wasm file itself) as first parameter`);
    }
    isInitialized = true;
  }
  onigasmH.loadWASM = loadWASM$1;
  var OnigRegExp$1 = {};
  var OnigScanner$1 = {};
  var yallist = Yallist$1;
  Yallist$1.Node = Node;
  Yallist$1.create = Yallist$1;
  function Yallist$1(list) {
    var self2 = this;
    if (!(self2 instanceof Yallist$1)) {
      self2 = new Yallist$1();
    }
    self2.tail = null;
    self2.head = null;
    self2.length = 0;
    if (list && typeof list.forEach === "function") {
      list.forEach(function(item) {
        self2.push(item);
      });
    } else if (arguments.length > 0) {
      for (var i = 0, l = arguments.length; i < l; i++) {
        self2.push(arguments[i]);
      }
    }
    return self2;
  }
  Yallist$1.prototype.removeNode = function(node) {
    if (node.list !== this) {
      throw new Error("removing node which does not belong to this list");
    }
    var next = node.next;
    var prev = node.prev;
    if (next) {
      next.prev = prev;
    }
    if (prev) {
      prev.next = next;
    }
    if (node === this.head) {
      this.head = next;
    }
    if (node === this.tail) {
      this.tail = prev;
    }
    node.list.length--;
    node.next = null;
    node.prev = null;
    node.list = null;
    return next;
  };
  Yallist$1.prototype.unshiftNode = function(node) {
    if (node === this.head) {
      return;
    }
    if (node.list) {
      node.list.removeNode(node);
    }
    var head = this.head;
    node.list = this;
    node.next = head;
    if (head) {
      head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
      this.tail = node;
    }
    this.length++;
  };
  Yallist$1.prototype.pushNode = function(node) {
    if (node === this.tail) {
      return;
    }
    if (node.list) {
      node.list.removeNode(node);
    }
    var tail = this.tail;
    node.list = this;
    node.prev = tail;
    if (tail) {
      tail.next = node;
    }
    this.tail = node;
    if (!this.head) {
      this.head = node;
    }
    this.length++;
  };
  Yallist$1.prototype.push = function() {
    for (var i = 0, l = arguments.length; i < l; i++) {
      push(this, arguments[i]);
    }
    return this.length;
  };
  Yallist$1.prototype.unshift = function() {
    for (var i = 0, l = arguments.length; i < l; i++) {
      unshift(this, arguments[i]);
    }
    return this.length;
  };
  Yallist$1.prototype.pop = function() {
    if (!this.tail) {
      return void 0;
    }
    var res = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
      this.tail.next = null;
    } else {
      this.head = null;
    }
    this.length--;
    return res;
  };
  Yallist$1.prototype.shift = function() {
    if (!this.head) {
      return void 0;
    }
    var res = this.head.value;
    this.head = this.head.next;
    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }
    this.length--;
    return res;
  };
  Yallist$1.prototype.forEach = function(fn2, thisp) {
    thisp = thisp || this;
    for (var walker = this.head, i = 0; walker !== null; i++) {
      fn2.call(thisp, walker.value, i, this);
      walker = walker.next;
    }
  };
  Yallist$1.prototype.forEachReverse = function(fn2, thisp) {
    thisp = thisp || this;
    for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
      fn2.call(thisp, walker.value, i, this);
      walker = walker.prev;
    }
  };
  Yallist$1.prototype.get = function(n) {
    for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
      walker = walker.next;
    }
    if (i === n && walker !== null) {
      return walker.value;
    }
  };
  Yallist$1.prototype.getReverse = function(n) {
    for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
      walker = walker.prev;
    }
    if (i === n && walker !== null) {
      return walker.value;
    }
  };
  Yallist$1.prototype.map = function(fn2, thisp) {
    thisp = thisp || this;
    var res = new Yallist$1();
    for (var walker = this.head; walker !== null; ) {
      res.push(fn2.call(thisp, walker.value, this));
      walker = walker.next;
    }
    return res;
  };
  Yallist$1.prototype.mapReverse = function(fn2, thisp) {
    thisp = thisp || this;
    var res = new Yallist$1();
    for (var walker = this.tail; walker !== null; ) {
      res.push(fn2.call(thisp, walker.value, this));
      walker = walker.prev;
    }
    return res;
  };
  Yallist$1.prototype.reduce = function(fn2, initial) {
    var acc;
    var walker = this.head;
    if (arguments.length > 1) {
      acc = initial;
    } else if (this.head) {
      walker = this.head.next;
      acc = this.head.value;
    } else {
      throw new TypeError("Reduce of empty list with no initial value");
    }
    for (var i = 0; walker !== null; i++) {
      acc = fn2(acc, walker.value, i);
      walker = walker.next;
    }
    return acc;
  };
  Yallist$1.prototype.reduceReverse = function(fn2, initial) {
    var acc;
    var walker = this.tail;
    if (arguments.length > 1) {
      acc = initial;
    } else if (this.tail) {
      walker = this.tail.prev;
      acc = this.tail.value;
    } else {
      throw new TypeError("Reduce of empty list with no initial value");
    }
    for (var i = this.length - 1; walker !== null; i--) {
      acc = fn2(acc, walker.value, i);
      walker = walker.prev;
    }
    return acc;
  };
  Yallist$1.prototype.toArray = function() {
    var arr = new Array(this.length);
    for (var i = 0, walker = this.head; walker !== null; i++) {
      arr[i] = walker.value;
      walker = walker.next;
    }
    return arr;
  };
  Yallist$1.prototype.toArrayReverse = function() {
    var arr = new Array(this.length);
    for (var i = 0, walker = this.tail; walker !== null; i++) {
      arr[i] = walker.value;
      walker = walker.prev;
    }
    return arr;
  };
  Yallist$1.prototype.slice = function(from, to) {
    to = to || this.length;
    if (to < 0) {
      to += this.length;
    }
    from = from || 0;
    if (from < 0) {
      from += this.length;
    }
    var ret = new Yallist$1();
    if (to < from || to < 0) {
      return ret;
    }
    if (from < 0) {
      from = 0;
    }
    if (to > this.length) {
      to = this.length;
    }
    for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
      walker = walker.next;
    }
    for (; walker !== null && i < to; i++, walker = walker.next) {
      ret.push(walker.value);
    }
    return ret;
  };
  Yallist$1.prototype.sliceReverse = function(from, to) {
    to = to || this.length;
    if (to < 0) {
      to += this.length;
    }
    from = from || 0;
    if (from < 0) {
      from += this.length;
    }
    var ret = new Yallist$1();
    if (to < from || to < 0) {
      return ret;
    }
    if (from < 0) {
      from = 0;
    }
    if (to > this.length) {
      to = this.length;
    }
    for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
      walker = walker.prev;
    }
    for (; walker !== null && i > from; i--, walker = walker.prev) {
      ret.push(walker.value);
    }
    return ret;
  };
  Yallist$1.prototype.splice = function(start, deleteCount) {
    if (start > this.length) {
      start = this.length - 1;
    }
    if (start < 0) {
      start = this.length + start;
    }
    for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
      walker = walker.next;
    }
    var ret = [];
    for (var i = 0; walker && i < deleteCount; i++) {
      ret.push(walker.value);
      walker = this.removeNode(walker);
    }
    if (walker === null) {
      walker = this.tail;
    }
    if (walker !== this.head && walker !== this.tail) {
      walker = walker.prev;
    }
    for (var i = 2; i < arguments.length; i++) {
      walker = insert(this, walker, arguments[i]);
    }
    return ret;
  };
  Yallist$1.prototype.reverse = function() {
    var head = this.head;
    var tail = this.tail;
    for (var walker = head; walker !== null; walker = walker.prev) {
      var p = walker.prev;
      walker.prev = walker.next;
      walker.next = p;
    }
    this.head = tail;
    this.tail = head;
    return this;
  };
  function insert(self2, node, value) {
    var inserted = node === self2.head ? new Node(value, null, node, self2) : new Node(value, node, node.next, self2);
    if (inserted.next === null) {
      self2.tail = inserted;
    }
    if (inserted.prev === null) {
      self2.head = inserted;
    }
    self2.length++;
    return inserted;
  }
  function push(self2, item) {
    self2.tail = new Node(item, self2.tail, null, self2);
    if (!self2.head) {
      self2.head = self2.tail;
    }
    self2.length++;
  }
  function unshift(self2, item) {
    self2.head = new Node(item, null, self2.head, self2);
    if (!self2.tail) {
      self2.tail = self2.head;
    }
    self2.length++;
  }
  function Node(value, prev, next, list) {
    if (!(this instanceof Node)) {
      return new Node(value, prev, next, list);
    }
    this.list = list;
    this.value = value;
    if (prev) {
      prev.next = this;
      this.prev = prev;
    } else {
      this.prev = null;
    }
    if (next) {
      next.prev = this;
      this.next = next;
    } else {
      this.next = null;
    }
  }
  try {
    require("./iterator.js")(Yallist$1);
  } catch (er2) {
  }
  const Yallist = yallist;
  const MAX = Symbol("max");
  const LENGTH = Symbol("length");
  const LENGTH_CALCULATOR = Symbol("lengthCalculator");
  const ALLOW_STALE = Symbol("allowStale");
  const MAX_AGE = Symbol("maxAge");
  const DISPOSE = Symbol("dispose");
  const NO_DISPOSE_ON_SET = Symbol("noDisposeOnSet");
  const LRU_LIST = Symbol("lruList");
  const CACHE = Symbol("cache");
  const UPDATE_AGE_ON_GET = Symbol("updateAgeOnGet");
  const naiveLength = () => 1;
  class LRUCache$1 {
    constructor(options) {
      if (typeof options === "number")
        options = { max: options };
      if (!options)
        options = {};
      if (options.max && (typeof options.max !== "number" || options.max < 0))
        throw new TypeError("max must be a non-negative number");
      this[MAX] = options.max || Infinity;
      const lc = options.length || naiveLength;
      this[LENGTH_CALCULATOR] = typeof lc !== "function" ? naiveLength : lc;
      this[ALLOW_STALE] = options.stale || false;
      if (options.maxAge && typeof options.maxAge !== "number")
        throw new TypeError("maxAge must be a number");
      this[MAX_AGE] = options.maxAge || 0;
      this[DISPOSE] = options.dispose;
      this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
      this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
      this.reset();
    }
    set max(mL) {
      if (typeof mL !== "number" || mL < 0)
        throw new TypeError("max must be a non-negative number");
      this[MAX] = mL || Infinity;
      trim(this);
    }
    get max() {
      return this[MAX];
    }
    set allowStale(allowStale) {
      this[ALLOW_STALE] = !!allowStale;
    }
    get allowStale() {
      return this[ALLOW_STALE];
    }
    set maxAge(mA) {
      if (typeof mA !== "number")
        throw new TypeError("maxAge must be a non-negative number");
      this[MAX_AGE] = mA;
      trim(this);
    }
    get maxAge() {
      return this[MAX_AGE];
    }
    set lengthCalculator(lC) {
      if (typeof lC !== "function")
        lC = naiveLength;
      if (lC !== this[LENGTH_CALCULATOR]) {
        this[LENGTH_CALCULATOR] = lC;
        this[LENGTH] = 0;
        this[LRU_LIST].forEach((hit) => {
          hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
          this[LENGTH] += hit.length;
        });
      }
      trim(this);
    }
    get lengthCalculator() {
      return this[LENGTH_CALCULATOR];
    }
    get length() {
      return this[LENGTH];
    }
    get itemCount() {
      return this[LRU_LIST].length;
    }
    rforEach(fn2, thisp) {
      thisp = thisp || this;
      for (let walker = this[LRU_LIST].tail; walker !== null; ) {
        const prev = walker.prev;
        forEachStep(this, fn2, walker, thisp);
        walker = prev;
      }
    }
    forEach(fn2, thisp) {
      thisp = thisp || this;
      for (let walker = this[LRU_LIST].head; walker !== null; ) {
        const next = walker.next;
        forEachStep(this, fn2, walker, thisp);
        walker = next;
      }
    }
    keys() {
      return this[LRU_LIST].toArray().map((k) => k.key);
    }
    values() {
      return this[LRU_LIST].toArray().map((k) => k.value);
    }
    reset() {
      if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
        this[LRU_LIST].forEach((hit) => this[DISPOSE](hit.key, hit.value));
      }
      this[CACHE] = /* @__PURE__ */ new Map();
      this[LRU_LIST] = new Yallist();
      this[LENGTH] = 0;
    }
    dump() {
      return this[LRU_LIST].map((hit) => isStale(this, hit) ? false : {
        k: hit.key,
        v: hit.value,
        e: hit.now + (hit.maxAge || 0)
      }).toArray().filter((h) => h);
    }
    dumpLru() {
      return this[LRU_LIST];
    }
    set(key, value, maxAge) {
      maxAge = maxAge || this[MAX_AGE];
      if (maxAge && typeof maxAge !== "number")
        throw new TypeError("maxAge must be a number");
      const now = maxAge ? Date.now() : 0;
      const len = this[LENGTH_CALCULATOR](value, key);
      if (this[CACHE].has(key)) {
        if (len > this[MAX]) {
          del(this, this[CACHE].get(key));
          return false;
        }
        const node = this[CACHE].get(key);
        const item = node.value;
        if (this[DISPOSE]) {
          if (!this[NO_DISPOSE_ON_SET])
            this[DISPOSE](key, item.value);
        }
        item.now = now;
        item.maxAge = maxAge;
        item.value = value;
        this[LENGTH] += len - item.length;
        item.length = len;
        this.get(key);
        trim(this);
        return true;
      }
      const hit = new Entry(key, value, len, now, maxAge);
      if (hit.length > this[MAX]) {
        if (this[DISPOSE])
          this[DISPOSE](key, value);
        return false;
      }
      this[LENGTH] += hit.length;
      this[LRU_LIST].unshift(hit);
      this[CACHE].set(key, this[LRU_LIST].head);
      trim(this);
      return true;
    }
    has(key) {
      if (!this[CACHE].has(key))
        return false;
      const hit = this[CACHE].get(key).value;
      return !isStale(this, hit);
    }
    get(key) {
      return get(this, key, true);
    }
    peek(key) {
      return get(this, key, false);
    }
    pop() {
      const node = this[LRU_LIST].tail;
      if (!node)
        return null;
      del(this, node);
      return node.value;
    }
    del(key) {
      del(this, this[CACHE].get(key));
    }
    load(arr) {
      this.reset();
      const now = Date.now();
      for (let l = arr.length - 1; l >= 0; l--) {
        const hit = arr[l];
        const expiresAt = hit.e || 0;
        if (expiresAt === 0)
          this.set(hit.k, hit.v);
        else {
          const maxAge = expiresAt - now;
          if (maxAge > 0) {
            this.set(hit.k, hit.v, maxAge);
          }
        }
      }
    }
    prune() {
      this[CACHE].forEach((value, key) => get(this, key, false));
    }
  }
  const get = (self2, key, doUse) => {
    const node = self2[CACHE].get(key);
    if (node) {
      const hit = node.value;
      if (isStale(self2, hit)) {
        del(self2, node);
        if (!self2[ALLOW_STALE])
          return void 0;
      } else {
        if (doUse) {
          if (self2[UPDATE_AGE_ON_GET])
            node.value.now = Date.now();
          self2[LRU_LIST].unshiftNode(node);
        }
      }
      return hit.value;
    }
  };
  const isStale = (self2, hit) => {
    if (!hit || !hit.maxAge && !self2[MAX_AGE])
      return false;
    const diff = Date.now() - hit.now;
    return hit.maxAge ? diff > hit.maxAge : self2[MAX_AGE] && diff > self2[MAX_AGE];
  };
  const trim = (self2) => {
    if (self2[LENGTH] > self2[MAX]) {
      for (let walker = self2[LRU_LIST].tail; self2[LENGTH] > self2[MAX] && walker !== null; ) {
        const prev = walker.prev;
        del(self2, walker);
        walker = prev;
      }
    }
  };
  const del = (self2, node) => {
    if (node) {
      const hit = node.value;
      if (self2[DISPOSE])
        self2[DISPOSE](hit.key, hit.value);
      self2[LENGTH] -= hit.length;
      self2[CACHE].delete(hit.key);
      self2[LRU_LIST].removeNode(node);
    }
  };
  class Entry {
    constructor(key, value, length, now, maxAge) {
      this.key = key;
      this.value = value;
      this.length = length;
      this.now = now;
      this.maxAge = maxAge || 0;
    }
  }
  const forEachStep = (self2, fn2, node, thisp) => {
    let hit = node.value;
    if (isStale(self2, hit)) {
      del(self2, node);
      if (!self2[ALLOW_STALE])
        hit = void 0;
    }
    if (hit)
      fn2.call(thisp, hit.value, hit.key, self2);
  };
  var lruCache = LRUCache$1;
  var OnigString$1 = {};
  Object.defineProperty(OnigString$1, "__esModule", { value: true });
  class OnigString {
    constructor(content) {
      this.substring = (start, end) => {
        return this.source.substring(start, end);
      };
      this.toString = (start, end) => {
        return this.source;
      };
      if (typeof content !== "string") {
        throw new TypeError("Argument must be a string");
      }
      this.source = content;
      this._utf8Bytes = null;
      this._utf8Indexes = null;
    }
    get utf8Bytes() {
      if (!this._utf8Bytes) {
        this.encode();
      }
      return this._utf8Bytes;
    }
    get utf8Indexes() {
      if (!this._utf8Bytes) {
        this.encode();
      }
      return this._utf8Indexes;
    }
    get content() {
      return this.source;
    }
    get length() {
      return this.source.length;
    }
    get hasMultiByteCharacters() {
      return this.utf8Indexes !== null;
    }
    convertUtf8OffsetToUtf16(utf8Offset) {
      if (utf8Offset < 0) {
        return 0;
      }
      const utf8Array = this._utf8Bytes;
      if (utf8Offset >= utf8Array.length - 1) {
        return this.source.length;
      }
      const utf8OffsetMap = this.utf8Indexes;
      if (utf8OffsetMap && utf8Offset >= this._mappingTableStartOffset) {
        return findFirstInSorted(utf8OffsetMap, utf8Offset - this._mappingTableStartOffset) + this._mappingTableStartOffset;
      }
      return utf8Offset;
    }
    convertUtf16OffsetToUtf8(utf16Offset) {
      if (utf16Offset < 0) {
        return 0;
      }
      const utf8Array = this._utf8Bytes;
      if (utf16Offset >= this.source.length) {
        return utf8Array.length - 1;
      }
      const utf8OffsetMap = this.utf8Indexes;
      if (utf8OffsetMap && utf16Offset >= this._mappingTableStartOffset) {
        return utf8OffsetMap[utf16Offset - this._mappingTableStartOffset] + this._mappingTableStartOffset;
      }
      return utf16Offset;
    }
    encode() {
      const str = this.source;
      const n = str.length;
      let utf16OffsetToUtf8;
      let utf8Offset = 0;
      let mappingTableStartOffset = 0;
      function createOffsetTable(startOffset) {
        const maxUtf8Len = (n - startOffset) * 3;
        if (maxUtf8Len <= 255) {
          utf16OffsetToUtf8 = new Uint8Array(n - startOffset);
        } else if (maxUtf8Len <= 65535) {
          utf16OffsetToUtf8 = new Uint16Array(n - startOffset);
        } else {
          utf16OffsetToUtf8 = new Uint32Array(n - startOffset);
        }
        mappingTableStartOffset = startOffset;
        utf16OffsetToUtf8[utf8Offset++] = 0;
      }
      const u8view = new Uint8Array(n * 3 + 1);
      let ptrHead = 0;
      let i = 0;
      while (i < str.length) {
        let codepoint;
        const c = str.charCodeAt(i);
        if (utf16OffsetToUtf8) {
          utf16OffsetToUtf8[utf8Offset++] = ptrHead - mappingTableStartOffset;
        }
        if (c < 55296 || c > 57343) {
          codepoint = c;
        } else if (c >= 56320) {
          codepoint = 65533;
        } else {
          if (i === n - 1) {
            codepoint = 65533;
          } else {
            const d2 = str.charCodeAt(i + 1);
            if (56320 <= d2 && d2 <= 57343) {
              if (!utf16OffsetToUtf8) {
                createOffsetTable(i);
              }
              const a = c & 1023;
              const b = d2 & 1023;
              codepoint = 65536 + (a << 10) + b;
              i += 1;
              utf16OffsetToUtf8[utf8Offset++] = ptrHead - mappingTableStartOffset;
            } else {
              codepoint = 65533;
            }
          }
        }
        let bytesRequiredToEncode;
        let offset;
        if (codepoint <= 127) {
          bytesRequiredToEncode = 1;
          offset = 0;
        } else if (codepoint <= 2047) {
          bytesRequiredToEncode = 2;
          offset = 192;
        } else if (codepoint <= 65535) {
          bytesRequiredToEncode = 3;
          offset = 224;
        } else {
          bytesRequiredToEncode = 4;
          offset = 240;
        }
        if (bytesRequiredToEncode === 1) {
          u8view[ptrHead++] = codepoint;
        } else {
          if (!utf16OffsetToUtf8) {
            createOffsetTable(ptrHead);
          }
          u8view[ptrHead++] = (codepoint >> 6 * --bytesRequiredToEncode) + offset;
          while (bytesRequiredToEncode > 0) {
            const temp = codepoint >> 6 * (bytesRequiredToEncode - 1);
            u8view[ptrHead++] = 128 | temp & 63;
            bytesRequiredToEncode -= 1;
          }
        }
        i += 1;
      }
      const utf8 = u8view.slice(0, ptrHead + 1);
      utf8[ptrHead] = 0;
      this._utf8Bytes = utf8;
      if (utf16OffsetToUtf8) {
        this._utf8Indexes = utf16OffsetToUtf8;
        this._mappingTableStartOffset = mappingTableStartOffset;
      }
    }
  }
  function findFirstInSorted(array, i) {
    let low = 0;
    let high = array.length;
    if (high === 0) {
      return 0;
    }
    while (low < high) {
      const mid = Math.floor((low + high) / 2);
      if (array[mid] >= i) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    while (low > 0 && (low >= array.length || array[low] > i)) {
      low--;
    }
    if (low > 0 && array[low] === array[low - 1]) {
      low--;
    }
    return low;
  }
  OnigString$1.default = OnigString;
  Object.defineProperty(OnigScanner$1, "__esModule", { value: true });
  const LRUCache = lruCache;
  const onigasmH_1$1 = onigasmH;
  const OnigString_1$1 = OnigString$1;
  function mallocAndWriteString(str) {
    const ptr = onigasmH_1$1.onigasmH._malloc(str.utf8Bytes.length);
    onigasmH_1$1.onigasmH.HEAPU8.set(str.utf8Bytes, ptr);
    return ptr;
  }
  function convertUTF8BytesFromPtrToString(ptr) {
    const chars = [];
    let i = 0;
    while (onigasmH_1$1.onigasmH.HEAPU8[ptr] !== 0) {
      chars[i++] = onigasmH_1$1.onigasmH.HEAPU8[ptr++];
    }
    return chars.join();
  }
  const cache = new LRUCache({
    dispose: (scanner, info) => {
      const regexTPtrsPtr = onigasmH_1$1.onigasmH._malloc(info.regexTPtrs.length);
      onigasmH_1$1.onigasmH.HEAPU8.set(info.regexTPtrs, regexTPtrsPtr);
      const status = onigasmH_1$1.onigasmH._disposeCompiledPatterns(regexTPtrsPtr, scanner.patterns.length);
      if (status !== 0) {
        const errMessage = convertUTF8BytesFromPtrToString(onigasmH_1$1.onigasmH._getLastError());
        throw new Error(errMessage);
      }
      onigasmH_1$1.onigasmH._free(regexTPtrsPtr);
    },
    max: 1e3
  });
  class OnigScanner {
    constructor(patterns) {
      if (onigasmH_1$1.onigasmH === null) {
        throw new Error(`Onigasm has not been initialized, call loadWASM from 'onigasm' exports before using any other API`);
      }
      for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        if (typeof pattern !== "string") {
          throw new TypeError(`First parameter to OnigScanner constructor must be array of (pattern) strings`);
        }
      }
      this.sources = patterns.slice();
    }
    get patterns() {
      return this.sources.slice();
    }
    findNextMatch(string, startPosition, callback) {
      if (startPosition == null) {
        startPosition = 0;
      }
      if (typeof startPosition === "function") {
        callback = startPosition;
        startPosition = 0;
      }
      try {
        const match = this.findNextMatchSync(string, startPosition);
        callback(null, match);
      } catch (error) {
        callback(error);
      }
    }
    findNextMatchSync(string, startPosition) {
      if (startPosition == null) {
        startPosition = 0;
      }
      startPosition = this.convertToNumber(startPosition);
      let onigNativeInfo = cache.get(this);
      let status = 0;
      if (!onigNativeInfo) {
        const regexTAddrRecieverPtr = onigasmH_1$1.onigasmH._malloc(4);
        const regexTPtrs = [];
        for (let i = 0; i < this.sources.length; i++) {
          const pattern = this.sources[i];
          const patternStrPtr = mallocAndWriteString(new OnigString_1$1.default(pattern));
          status = onigasmH_1$1.onigasmH._compilePattern(patternStrPtr, regexTAddrRecieverPtr);
          if (status !== 0) {
            const errMessage = convertUTF8BytesFromPtrToString(onigasmH_1$1.onigasmH._getLastError());
            throw new Error(errMessage);
          }
          const regexTAddress = onigasmH_1$1.onigasmH.HEAP32[regexTAddrRecieverPtr / 4];
          regexTPtrs.push(regexTAddress);
          onigasmH_1$1.onigasmH._free(patternStrPtr);
        }
        onigNativeInfo = {
          regexTPtrs: new Uint8Array(Uint32Array.from(regexTPtrs).buffer)
        };
        onigasmH_1$1.onigasmH._free(regexTAddrRecieverPtr);
        cache.set(this, onigNativeInfo);
      }
      const onigString = string instanceof OnigString_1$1.default ? string : new OnigString_1$1.default(this.convertToString(string));
      const strPtr = mallocAndWriteString(onigString);
      const resultInfoReceiverPtr = onigasmH_1$1.onigasmH._malloc(8);
      const regexTPtrsPtr = onigasmH_1$1.onigasmH._malloc(onigNativeInfo.regexTPtrs.length);
      onigasmH_1$1.onigasmH.HEAPU8.set(onigNativeInfo.regexTPtrs, regexTPtrsPtr);
      status = onigasmH_1$1.onigasmH._findBestMatch(
        regexTPtrsPtr,
        this.sources.length,
        strPtr,
        onigString.utf8Bytes.length - 1,
        onigString.convertUtf16OffsetToUtf8(startPosition),
        resultInfoReceiverPtr
      );
      if (status !== 0) {
        const errMessage = convertUTF8BytesFromPtrToString(onigasmH_1$1.onigasmH._getLastError());
        throw new Error(errMessage);
      }
      const [
        bestPatternIdx,
        encodedResultBeginAddress,
        encodedResultLength
      ] = new Uint32Array(onigasmH_1$1.onigasmH.HEAPU32.buffer, resultInfoReceiverPtr, 3);
      onigasmH_1$1.onigasmH._free(strPtr);
      onigasmH_1$1.onigasmH._free(resultInfoReceiverPtr);
      onigasmH_1$1.onigasmH._free(regexTPtrsPtr);
      if (encodedResultLength > 0) {
        const encodedResult = new Uint32Array(onigasmH_1$1.onigasmH.HEAPU32.buffer, encodedResultBeginAddress, encodedResultLength);
        const captureIndices = [];
        let i = 0;
        let captureIdx = 0;
        while (i < encodedResultLength) {
          const index = captureIdx++;
          let start = encodedResult[i++];
          let end = encodedResult[i++];
          if (onigString.hasMultiByteCharacters) {
            start = onigString.convertUtf8OffsetToUtf16(start);
            end = onigString.convertUtf8OffsetToUtf16(end);
          }
          captureIndices.push({
            end,
            index,
            length: end - start,
            start
          });
        }
        onigasmH_1$1.onigasmH._free(encodedResultBeginAddress);
        return {
          captureIndices,
          index: bestPatternIdx,
          scanner: this
        };
      }
      return null;
    }
    convertToString(value) {
      if (value === void 0) {
        return "undefined";
      }
      if (value === null) {
        return "null";
      }
      if (value instanceof OnigString_1$1.default) {
        return value.content;
      }
      return value.toString();
    }
    convertToNumber(value) {
      value = parseInt(value, 10);
      if (!isFinite(value)) {
        value = 0;
      }
      value = Math.max(value, 0);
      return value;
    }
  }
  OnigScanner$1.OnigScanner = OnigScanner;
  OnigScanner$1.default = OnigScanner;
  Object.defineProperty(OnigRegExp$1, "__esModule", { value: true });
  const OnigScanner_1$1 = OnigScanner$1;
  class OnigRegExp {
    constructor(source) {
      this.source = source;
      try {
        this.scanner = new OnigScanner_1$1.default([this.source]);
      } catch (error) {
      }
    }
    searchSync(string, startPosition) {
      let match;
      if (startPosition == null) {
        startPosition = 0;
      }
      match = this.scanner.findNextMatchSync(string, startPosition);
      return this.captureIndicesForMatch(string, match);
    }
    search(string, startPosition, callback) {
      if (startPosition == null) {
        startPosition = 0;
      }
      if (typeof startPosition === "function") {
        callback = startPosition;
        startPosition = 0;
      }
      try {
        const ret = this.searchSync(string, startPosition);
        callback(null, ret);
      } catch (error) {
        callback(error);
      }
    }
    testSync(string) {
      if (typeof this.source === "boolean" || typeof string === "boolean") {
        return this.source === string;
      }
      return this.searchSync(string) != null;
    }
    test(string, callback) {
      if (typeof callback !== "function") {
        callback = () => {
        };
      }
      try {
        callback(null, this.testSync(string));
      } catch (error) {
        callback(error);
      }
    }
    captureIndicesForMatch(string, match) {
      if (match != null) {
        const { captureIndices } = match;
        let capture;
        string = this.scanner.convertToString(string);
        for (let i = 0; i < captureIndices.length; i++) {
          capture = captureIndices[i];
          capture.match = string.slice(capture.start, capture.end);
        }
        return captureIndices;
      } else {
        return null;
      }
    }
  }
  OnigRegExp$1.default = OnigRegExp;
  Object.defineProperty(lib, "__esModule", { value: true });
  const onigasmH_1 = onigasmH;
  var loadWASM = lib.loadWASM = onigasmH_1.loadWASM;
  const OnigRegExp_1 = OnigRegExp$1;
  lib.OnigRegExp = OnigRegExp_1.default;
  const OnigScanner_1 = OnigScanner$1;
  lib.OnigScanner = OnigScanner_1.default;
  const OnigString_1 = OnigString$1;
  lib.OnigString = OnigString_1.default;
  var __extends = commonjsGlobal && commonjsGlobal.__extends || function() {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b) {
      d2.__proto__ = b;
    } || function(d2, b) {
      for (var p in b)
        if (b.hasOwnProperty(p))
          d2[p] = b[p];
    };
    return function(d2, b) {
      extendStatics(d2, b);
      function __() {
        this.constructor = d2;
      }
      d2.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
  }();
  Object.defineProperty(rule, "__esModule", { value: true });
  var path = require$$0;
  var utils_1$1 = utils;
  var onigasm_1 = lib;
  var HAS_BACK_REFERENCES = /\\(\d+)/;
  var BACK_REFERENCING_END = /\\(\d+)/g;
  var Rule = function() {
    function Rule2($location, id, name, contentName) {
      this.$location = $location;
      this.id = id;
      this._name = name || null;
      this._nameIsCapturing = utils_1$1.RegexSource.hasCaptures(this._name);
      this._contentName = contentName || null;
      this._contentNameIsCapturing = utils_1$1.RegexSource.hasCaptures(this._contentName);
    }
    Object.defineProperty(Rule2.prototype, "debugName", {
      get: function() {
        return this.constructor.name + "#" + this.id + " @ " + path.basename(this.$location.filename) + ":" + this.$location.line;
      },
      enumerable: true,
      configurable: true
    });
    Rule2.prototype.getName = function(lineText, captureIndices) {
      if (!this._nameIsCapturing) {
        return this._name;
      }
      return utils_1$1.RegexSource.replaceCaptures(this._name, lineText, captureIndices);
    };
    Rule2.prototype.getContentName = function(lineText, captureIndices) {
      if (!this._contentNameIsCapturing) {
        return this._contentName;
      }
      return utils_1$1.RegexSource.replaceCaptures(this._contentName, lineText, captureIndices);
    };
    Rule2.prototype.collectPatternsRecursive = function(grammar2, out, isFirst) {
      throw new Error("Implement me!");
    };
    Rule2.prototype.compile = function(grammar2, endRegexSource, allowA, allowG) {
      throw new Error("Implement me!");
    };
    return Rule2;
  }();
  rule.Rule = Rule;
  var CaptureRule = function(_super) {
    __extends(CaptureRule2, _super);
    function CaptureRule2($location, id, name, contentName, retokenizeCapturedWithRuleId) {
      var _this = _super.call(this, $location, id, name, contentName) || this;
      _this.retokenizeCapturedWithRuleId = retokenizeCapturedWithRuleId;
      return _this;
    }
    return CaptureRule2;
  }(Rule);
  rule.CaptureRule = CaptureRule;
  var RegExpSource = function() {
    function RegExpSource2(regExpSource, ruleId, handleAnchors) {
      if (handleAnchors === void 0) {
        handleAnchors = true;
      }
      if (handleAnchors) {
        this._handleAnchors(regExpSource);
      } else {
        this.source = regExpSource;
        this.hasAnchor = false;
      }
      if (this.hasAnchor) {
        this._anchorCache = this._buildAnchorCache();
      }
      this.ruleId = ruleId;
      this.hasBackReferences = HAS_BACK_REFERENCES.test(this.source);
    }
    RegExpSource2.prototype.clone = function() {
      return new RegExpSource2(this.source, this.ruleId, true);
    };
    RegExpSource2.prototype.setSource = function(newSource) {
      if (this.source === newSource) {
        return;
      }
      this.source = newSource;
      if (this.hasAnchor) {
        this._anchorCache = this._buildAnchorCache();
      }
    };
    RegExpSource2.prototype._handleAnchors = function(regExpSource) {
      if (regExpSource) {
        var pos = void 0, len = void 0, ch = void 0, nextCh = void 0, lastPushedPos = 0, output = [];
        var hasAnchor = false;
        for (pos = 0, len = regExpSource.length; pos < len; pos++) {
          ch = regExpSource.charAt(pos);
          if (ch === "\\") {
            if (pos + 1 < len) {
              nextCh = regExpSource.charAt(pos + 1);
              if (nextCh === "z") {
                output.push(regExpSource.substring(lastPushedPos, pos));
                output.push("$(?!\\n)(?<!\\n)");
                lastPushedPos = pos + 2;
              } else if (nextCh === "A" || nextCh === "G") {
                hasAnchor = true;
              }
              pos++;
            }
          }
        }
        this.hasAnchor = hasAnchor;
        if (lastPushedPos === 0) {
          this.source = regExpSource;
        } else {
          output.push(regExpSource.substring(lastPushedPos, len));
          this.source = output.join("");
        }
      } else {
        this.hasAnchor = false;
        this.source = regExpSource;
      }
    };
    RegExpSource2.prototype.resolveBackReferences = function(lineText, captureIndices) {
      var capturedValues = captureIndices.map(function(capture) {
        return lineText.substring(capture.start, capture.end);
      });
      BACK_REFERENCING_END.lastIndex = 0;
      return this.source.replace(BACK_REFERENCING_END, function(match, g1) {
        return escapeRegExpCharacters(capturedValues[parseInt(g1, 10)] || "");
      });
    };
    RegExpSource2.prototype._buildAnchorCache = function() {
      var A0_G0_result = [];
      var A0_G1_result = [];
      var A1_G0_result = [];
      var A1_G1_result = [];
      var pos, len, ch, nextCh;
      for (pos = 0, len = this.source.length; pos < len; pos++) {
        ch = this.source.charAt(pos);
        A0_G0_result[pos] = ch;
        A0_G1_result[pos] = ch;
        A1_G0_result[pos] = ch;
        A1_G1_result[pos] = ch;
        if (ch === "\\") {
          if (pos + 1 < len) {
            nextCh = this.source.charAt(pos + 1);
            if (nextCh === "A") {
              A0_G0_result[pos + 1] = "\uFFFF";
              A0_G1_result[pos + 1] = "\uFFFF";
              A1_G0_result[pos + 1] = "A";
              A1_G1_result[pos + 1] = "A";
            } else if (nextCh === "G") {
              A0_G0_result[pos + 1] = "\uFFFF";
              A0_G1_result[pos + 1] = "G";
              A1_G0_result[pos + 1] = "\uFFFF";
              A1_G1_result[pos + 1] = "G";
            } else {
              A0_G0_result[pos + 1] = nextCh;
              A0_G1_result[pos + 1] = nextCh;
              A1_G0_result[pos + 1] = nextCh;
              A1_G1_result[pos + 1] = nextCh;
            }
            pos++;
          }
        }
      }
      return {
        A0_G0: A0_G0_result.join(""),
        A0_G1: A0_G1_result.join(""),
        A1_G0: A1_G0_result.join(""),
        A1_G1: A1_G1_result.join("")
      };
    };
    RegExpSource2.prototype.resolveAnchors = function(allowA, allowG) {
      if (!this.hasAnchor) {
        return this.source;
      }
      if (allowA) {
        if (allowG) {
          return this._anchorCache.A1_G1;
        } else {
          return this._anchorCache.A1_G0;
        }
      } else {
        if (allowG) {
          return this._anchorCache.A0_G1;
        } else {
          return this._anchorCache.A0_G0;
        }
      }
    };
    return RegExpSource2;
  }();
  rule.RegExpSource = RegExpSource;
  function createOnigScanner(sources) {
    return new onigasm_1.OnigScanner(sources);
  }
  function createOnigString(sources) {
    var r = new onigasm_1.OnigString(sources);
    r.$str = sources;
    return r;
  }
  rule.createOnigString = createOnigString;
  function getString(str) {
    return str.$str;
  }
  rule.getString = getString;
  var RegExpSourceList = function() {
    function RegExpSourceList2() {
      this._items = [];
      this._hasAnchors = false;
      this._cached = null;
      this._cachedSources = null;
      this._anchorCache = {
        A0_G0: null,
        A0_G1: null,
        A1_G0: null,
        A1_G1: null
      };
    }
    RegExpSourceList2.prototype.push = function(item) {
      this._items.push(item);
      this._hasAnchors = this._hasAnchors || item.hasAnchor;
    };
    RegExpSourceList2.prototype.unshift = function(item) {
      this._items.unshift(item);
      this._hasAnchors = this._hasAnchors || item.hasAnchor;
    };
    RegExpSourceList2.prototype.length = function() {
      return this._items.length;
    };
    RegExpSourceList2.prototype.setSource = function(index, newSource) {
      if (this._items[index].source !== newSource) {
        this._cached = null;
        this._anchorCache.A0_G0 = null;
        this._anchorCache.A0_G1 = null;
        this._anchorCache.A1_G0 = null;
        this._anchorCache.A1_G1 = null;
        this._items[index].setSource(newSource);
      }
    };
    RegExpSourceList2.prototype.compile = function(grammar2, allowA, allowG) {
      if (!this._hasAnchors) {
        if (!this._cached) {
          var regExps = this._items.map(function(e4) {
            return e4.source;
          });
          this._cached = {
            scanner: createOnigScanner(regExps),
            rules: this._items.map(function(e4) {
              return e4.ruleId;
            }),
            debugRegExps: regExps
          };
        }
        return this._cached;
      } else {
        this._anchorCache = {
          A0_G0: this._anchorCache.A0_G0 || (allowA === false && allowG === false ? this._resolveAnchors(allowA, allowG) : null),
          A0_G1: this._anchorCache.A0_G1 || (allowA === false && allowG === true ? this._resolveAnchors(allowA, allowG) : null),
          A1_G0: this._anchorCache.A1_G0 || (allowA === true && allowG === false ? this._resolveAnchors(allowA, allowG) : null),
          A1_G1: this._anchorCache.A1_G1 || (allowA === true && allowG === true ? this._resolveAnchors(allowA, allowG) : null)
        };
        if (allowA) {
          if (allowG) {
            return this._anchorCache.A1_G1;
          } else {
            return this._anchorCache.A1_G0;
          }
        } else {
          if (allowG) {
            return this._anchorCache.A0_G1;
          } else {
            return this._anchorCache.A0_G0;
          }
        }
      }
    };
    RegExpSourceList2.prototype._resolveAnchors = function(allowA, allowG) {
      var regExps = this._items.map(function(e4) {
        return e4.resolveAnchors(allowA, allowG);
      });
      return {
        scanner: createOnigScanner(regExps),
        rules: this._items.map(function(e4) {
          return e4.ruleId;
        }),
        debugRegExps: regExps
      };
    };
    return RegExpSourceList2;
  }();
  rule.RegExpSourceList = RegExpSourceList;
  var MatchRule = function(_super) {
    __extends(MatchRule2, _super);
    function MatchRule2($location, id, name, match, captures) {
      var _this = _super.call(this, $location, id, name, null) || this;
      _this._match = new RegExpSource(match, _this.id);
      _this.captures = captures;
      _this._cachedCompiledPatterns = null;
      return _this;
    }
    Object.defineProperty(MatchRule2.prototype, "debugMatchRegExp", {
      get: function() {
        return "" + this._match.source;
      },
      enumerable: true,
      configurable: true
    });
    MatchRule2.prototype.collectPatternsRecursive = function(grammar2, out, isFirst) {
      out.push(this._match);
    };
    MatchRule2.prototype.compile = function(grammar2, endRegexSource, allowA, allowG) {
      if (!this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns = new RegExpSourceList();
        this.collectPatternsRecursive(grammar2, this._cachedCompiledPatterns, true);
      }
      return this._cachedCompiledPatterns.compile(grammar2, allowA, allowG);
    };
    return MatchRule2;
  }(Rule);
  rule.MatchRule = MatchRule;
  var IncludeOnlyRule = function(_super) {
    __extends(IncludeOnlyRule2, _super);
    function IncludeOnlyRule2($location, id, name, contentName, patterns) {
      var _this = _super.call(this, $location, id, name, contentName) || this;
      _this.patterns = patterns.patterns;
      _this.hasMissingPatterns = patterns.hasMissingPatterns;
      _this._cachedCompiledPatterns = null;
      return _this;
    }
    IncludeOnlyRule2.prototype.collectPatternsRecursive = function(grammar2, out, isFirst) {
      var i, len, rule2;
      for (i = 0, len = this.patterns.length; i < len; i++) {
        rule2 = grammar2.getRule(this.patterns[i]);
        rule2.collectPatternsRecursive(grammar2, out, false);
      }
    };
    IncludeOnlyRule2.prototype.compile = function(grammar2, endRegexSource, allowA, allowG) {
      if (!this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns = new RegExpSourceList();
        this.collectPatternsRecursive(grammar2, this._cachedCompiledPatterns, true);
      }
      return this._cachedCompiledPatterns.compile(grammar2, allowA, allowG);
    };
    return IncludeOnlyRule2;
  }(Rule);
  rule.IncludeOnlyRule = IncludeOnlyRule;
  function escapeRegExpCharacters(value) {
    return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
  }
  var BeginEndRule = function(_super) {
    __extends(BeginEndRule2, _super);
    function BeginEndRule2($location, id, name, contentName, begin, beginCaptures, end, endCaptures, applyEndPatternLast, patterns) {
      var _this = _super.call(this, $location, id, name, contentName) || this;
      _this._begin = new RegExpSource(begin, _this.id);
      _this.beginCaptures = beginCaptures;
      _this._end = new RegExpSource(end, -1);
      _this.endHasBackReferences = _this._end.hasBackReferences;
      _this.endCaptures = endCaptures;
      _this.applyEndPatternLast = applyEndPatternLast || false;
      _this.patterns = patterns.patterns;
      _this.hasMissingPatterns = patterns.hasMissingPatterns;
      _this._cachedCompiledPatterns = null;
      return _this;
    }
    Object.defineProperty(BeginEndRule2.prototype, "debugBeginRegExp", {
      get: function() {
        return "" + this._begin.source;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(BeginEndRule2.prototype, "debugEndRegExp", {
      get: function() {
        return "" + this._end.source;
      },
      enumerable: true,
      configurable: true
    });
    BeginEndRule2.prototype.getEndWithResolvedBackReferences = function(lineText, captureIndices) {
      return this._end.resolveBackReferences(lineText, captureIndices);
    };
    BeginEndRule2.prototype.collectPatternsRecursive = function(grammar2, out, isFirst) {
      if (isFirst) {
        var i = void 0, len = void 0, rule2 = void 0;
        for (i = 0, len = this.patterns.length; i < len; i++) {
          rule2 = grammar2.getRule(this.patterns[i]);
          rule2.collectPatternsRecursive(grammar2, out, false);
        }
      } else {
        out.push(this._begin);
      }
    };
    BeginEndRule2.prototype.compile = function(grammar2, endRegexSource, allowA, allowG) {
      var precompiled = this._precompile(grammar2);
      if (this._end.hasBackReferences) {
        if (this.applyEndPatternLast) {
          precompiled.setSource(precompiled.length() - 1, endRegexSource);
        } else {
          precompiled.setSource(0, endRegexSource);
        }
      }
      return this._cachedCompiledPatterns.compile(grammar2, allowA, allowG);
    };
    BeginEndRule2.prototype._precompile = function(grammar2) {
      if (!this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns = new RegExpSourceList();
        this.collectPatternsRecursive(grammar2, this._cachedCompiledPatterns, true);
        if (this.applyEndPatternLast) {
          this._cachedCompiledPatterns.push(this._end.hasBackReferences ? this._end.clone() : this._end);
        } else {
          this._cachedCompiledPatterns.unshift(this._end.hasBackReferences ? this._end.clone() : this._end);
        }
      }
      return this._cachedCompiledPatterns;
    };
    return BeginEndRule2;
  }(Rule);
  rule.BeginEndRule = BeginEndRule;
  var BeginWhileRule = function(_super) {
    __extends(BeginWhileRule2, _super);
    function BeginWhileRule2($location, id, name, contentName, begin, beginCaptures, _while, whileCaptures, patterns) {
      var _this = _super.call(this, $location, id, name, contentName) || this;
      _this._begin = new RegExpSource(begin, _this.id);
      _this.beginCaptures = beginCaptures;
      _this.whileCaptures = whileCaptures;
      _this._while = new RegExpSource(_while, -2);
      _this.whileHasBackReferences = _this._while.hasBackReferences;
      _this.patterns = patterns.patterns;
      _this.hasMissingPatterns = patterns.hasMissingPatterns;
      _this._cachedCompiledPatterns = null;
      _this._cachedCompiledWhilePatterns = null;
      return _this;
    }
    BeginWhileRule2.prototype.getWhileWithResolvedBackReferences = function(lineText, captureIndices) {
      return this._while.resolveBackReferences(lineText, captureIndices);
    };
    BeginWhileRule2.prototype.collectPatternsRecursive = function(grammar2, out, isFirst) {
      if (isFirst) {
        var i = void 0, len = void 0, rule2 = void 0;
        for (i = 0, len = this.patterns.length; i < len; i++) {
          rule2 = grammar2.getRule(this.patterns[i]);
          rule2.collectPatternsRecursive(grammar2, out, false);
        }
      } else {
        out.push(this._begin);
      }
    };
    BeginWhileRule2.prototype.compile = function(grammar2, endRegexSource, allowA, allowG) {
      this._precompile(grammar2);
      return this._cachedCompiledPatterns.compile(grammar2, allowA, allowG);
    };
    BeginWhileRule2.prototype._precompile = function(grammar2) {
      if (!this._cachedCompiledPatterns) {
        this._cachedCompiledPatterns = new RegExpSourceList();
        this.collectPatternsRecursive(grammar2, this._cachedCompiledPatterns, true);
      }
    };
    BeginWhileRule2.prototype.compileWhile = function(grammar2, endRegexSource, allowA, allowG) {
      this._precompileWhile(grammar2);
      if (this._while.hasBackReferences) {
        this._cachedCompiledWhilePatterns.setSource(0, endRegexSource);
      }
      return this._cachedCompiledWhilePatterns.compile(grammar2, allowA, allowG);
    };
    BeginWhileRule2.prototype._precompileWhile = function(grammar2) {
      if (!this._cachedCompiledWhilePatterns) {
        this._cachedCompiledWhilePatterns = new RegExpSourceList();
        this._cachedCompiledWhilePatterns.push(this._while.hasBackReferences ? this._while.clone() : this._while);
      }
    };
    return BeginWhileRule2;
  }(Rule);
  rule.BeginWhileRule = BeginWhileRule;
  var RuleFactory = function() {
    function RuleFactory2() {
    }
    RuleFactory2.createCaptureRule = function(helper, $location, name, contentName, retokenizeCapturedWithRuleId) {
      return helper.registerRule(function(id) {
        return new CaptureRule($location, id, name, contentName, retokenizeCapturedWithRuleId);
      });
    };
    RuleFactory2.getCompiledRuleId = function(desc, helper, repository) {
      if (!desc.id) {
        helper.registerRule(function(id) {
          desc.id = id;
          if (desc.match) {
            return new MatchRule(desc.$vscodeTextmateLocation, desc.id, desc.name, desc.match, RuleFactory2._compileCaptures(desc.captures, helper, repository));
          }
          if (!desc.begin) {
            if (desc.repository) {
              repository = utils_1$1.mergeObjects({}, repository, desc.repository);
            }
            return new IncludeOnlyRule(desc.$vscodeTextmateLocation, desc.id, desc.name, desc.contentName, RuleFactory2._compilePatterns(desc.patterns, helper, repository));
          }
          if (desc.while) {
            return new BeginWhileRule(desc.$vscodeTextmateLocation, desc.id, desc.name, desc.contentName, desc.begin, RuleFactory2._compileCaptures(desc.beginCaptures || desc.captures, helper, repository), desc.while, RuleFactory2._compileCaptures(desc.whileCaptures || desc.captures, helper, repository), RuleFactory2._compilePatterns(desc.patterns, helper, repository));
          }
          return new BeginEndRule(desc.$vscodeTextmateLocation, desc.id, desc.name, desc.contentName, desc.begin, RuleFactory2._compileCaptures(desc.beginCaptures || desc.captures, helper, repository), desc.end, RuleFactory2._compileCaptures(desc.endCaptures || desc.captures, helper, repository), desc.applyEndPatternLast, RuleFactory2._compilePatterns(desc.patterns, helper, repository));
        });
      }
      return desc.id;
    };
    RuleFactory2._compileCaptures = function(captures, helper, repository) {
      var r = [], numericCaptureId, maximumCaptureId, i, captureId;
      if (captures) {
        maximumCaptureId = 0;
        for (captureId in captures) {
          if (captureId === "$vscodeTextmateLocation") {
            continue;
          }
          numericCaptureId = parseInt(captureId, 10);
          if (numericCaptureId > maximumCaptureId) {
            maximumCaptureId = numericCaptureId;
          }
        }
        for (i = 0; i <= maximumCaptureId; i++) {
          r[i] = null;
        }
        for (captureId in captures) {
          if (captureId === "$vscodeTextmateLocation") {
            continue;
          }
          numericCaptureId = parseInt(captureId, 10);
          var retokenizeCapturedWithRuleId = 0;
          if (captures[captureId].patterns) {
            retokenizeCapturedWithRuleId = RuleFactory2.getCompiledRuleId(captures[captureId], helper, repository);
          }
          r[numericCaptureId] = RuleFactory2.createCaptureRule(helper, captures[captureId].$vscodeTextmateLocation, captures[captureId].name, captures[captureId].contentName, retokenizeCapturedWithRuleId);
        }
      }
      return r;
    };
    RuleFactory2._compilePatterns = function(patterns, helper, repository) {
      var r = [], pattern, i, len, patternId, externalGrammar, rule2, skipRule;
      if (patterns) {
        for (i = 0, len = patterns.length; i < len; i++) {
          pattern = patterns[i];
          patternId = -1;
          if (pattern.include) {
            if (pattern.include.charAt(0) === "#") {
              var localIncludedRule = repository[pattern.include.substr(1)];
              if (localIncludedRule) {
                patternId = RuleFactory2.getCompiledRuleId(localIncludedRule, helper, repository);
              }
            } else if (pattern.include === "$base" || pattern.include === "$self") {
              patternId = RuleFactory2.getCompiledRuleId(repository[pattern.include], helper, repository);
            } else {
              var externalGrammarName = null, externalGrammarInclude = null, sharpIndex = pattern.include.indexOf("#");
              if (sharpIndex >= 0) {
                externalGrammarName = pattern.include.substring(0, sharpIndex);
                externalGrammarInclude = pattern.include.substring(sharpIndex + 1);
              } else {
                externalGrammarName = pattern.include;
              }
              externalGrammar = helper.getExternalGrammar(externalGrammarName, repository);
              if (externalGrammar) {
                if (externalGrammarInclude) {
                  var externalIncludedRule = externalGrammar.repository[externalGrammarInclude];
                  if (externalIncludedRule) {
                    patternId = RuleFactory2.getCompiledRuleId(externalIncludedRule, helper, externalGrammar.repository);
                  }
                } else {
                  patternId = RuleFactory2.getCompiledRuleId(externalGrammar.repository.$self, helper, externalGrammar.repository);
                }
              }
            }
          } else {
            patternId = RuleFactory2.getCompiledRuleId(pattern, helper, repository);
          }
          if (patternId !== -1) {
            rule2 = helper.getRule(patternId);
            skipRule = false;
            if (rule2 instanceof IncludeOnlyRule || rule2 instanceof BeginEndRule || rule2 instanceof BeginWhileRule) {
              if (rule2.hasMissingPatterns && rule2.patterns.length === 0) {
                skipRule = true;
              }
            }
            if (skipRule) {
              continue;
            }
            r.push(patternId);
          }
        }
      }
      return {
        patterns: r,
        hasMissingPatterns: (patterns ? patterns.length : 0) !== r.length
      };
    };
    return RuleFactory2;
  }();
  rule.RuleFactory = RuleFactory;
  var matcher = {};
  Object.defineProperty(matcher, "__esModule", { value: true });
  function createMatchers(selector, matchesName) {
    var results = [];
    var tokenizer = newTokenizer(selector);
    var token = tokenizer.next();
    while (token !== null) {
      var priority = 0;
      if (token.length === 2 && token.charAt(1) === ":") {
        switch (token.charAt(0)) {
          case "R":
            priority = 1;
            break;
          case "L":
            priority = -1;
            break;
          default:
            console.log("Unknown priority " + token + " in scope selector");
        }
        token = tokenizer.next();
      }
      var matcher2 = parseConjunction();
      if (matcher2) {
        results.push({ matcher: matcher2, priority });
      }
      if (token !== ",") {
        break;
      }
      token = tokenizer.next();
    }
    return results;
    function parseOperand() {
      if (token === "-") {
        token = tokenizer.next();
        var expressionToNegate = parseOperand();
        return function(matcherInput) {
          return expressionToNegate && !expressionToNegate(matcherInput);
        };
      }
      if (token === "(") {
        token = tokenizer.next();
        var expressionInParents = parseInnerExpression();
        if (token === ")") {
          token = tokenizer.next();
        }
        return expressionInParents;
      }
      if (isIdentifier(token)) {
        var identifiers = [];
        do {
          identifiers.push(token);
          token = tokenizer.next();
        } while (isIdentifier(token));
        return function(matcherInput) {
          return matchesName(identifiers, matcherInput);
        };
      }
      return null;
    }
    function parseConjunction() {
      var matchers = [];
      var matcher3 = parseOperand();
      while (matcher3) {
        matchers.push(matcher3);
        matcher3 = parseOperand();
      }
      return function(matcherInput) {
        return matchers.every(function(matcher4) {
          return matcher4(matcherInput);
        });
      };
    }
    function parseInnerExpression() {
      var matchers = [];
      var matcher3 = parseConjunction();
      while (matcher3) {
        matchers.push(matcher3);
        if (token === "|" || token === ",") {
          do {
            token = tokenizer.next();
          } while (token === "|" || token === ",");
        } else {
          break;
        }
        matcher3 = parseConjunction();
      }
      return function(matcherInput) {
        return matchers.some(function(matcher4) {
          return matcher4(matcherInput);
        });
      };
    }
  }
  matcher.createMatchers = createMatchers;
  function isIdentifier(token) {
    return token && token.match(/[\w\.:]+/);
  }
  function newTokenizer(input) {
    var regex = /([LR]:|[\w\.:][\w\.:\-]*|[\,\|\-\(\)])/g;
    var match = regex.exec(input);
    return {
      next: function() {
        if (!match) {
          return null;
        }
        var res = match[0];
        match = regex.exec(input);
        return res;
      }
    };
  }
  var debug = {};
  Object.defineProperty(debug, "__esModule", { value: true });
  debug.CAPTURE_METADATA = typeof process === "undefined" ? false : !!process.env["VSCODE_TEXTMATE_DEBUG"];
  debug.IN_DEBUG_MODE = typeof process === "undefined" ? false : !!process.env["VSCODE_TEXTMATE_DEBUG"];
  Object.defineProperty(grammar, "__esModule", { value: true });
  var utils_1 = utils;
  var rule_1 = rule;
  var matcher_1 = matcher;
  var debug_1$1 = debug;
  function createGrammar(grammar2, initialLanguage, embeddedLanguages, tokenTypes, grammarRepository) {
    return new Grammar(grammar2, initialLanguage, embeddedLanguages, tokenTypes, grammarRepository);
  }
  grammar.createGrammar = createGrammar;
  function _extractIncludedScopesInPatterns(result, patterns) {
    for (var i = 0, len = patterns.length; i < len; i++) {
      if (Array.isArray(patterns[i].patterns)) {
        _extractIncludedScopesInPatterns(result, patterns[i].patterns);
      }
      var include = patterns[i].include;
      if (!include) {
        continue;
      }
      if (include === "$base" || include === "$self") {
        continue;
      }
      if (include.charAt(0) === "#") {
        continue;
      }
      var sharpIndex = include.indexOf("#");
      if (sharpIndex >= 0) {
        result[include.substring(0, sharpIndex)] = true;
      } else {
        result[include] = true;
      }
    }
  }
  function _extractIncludedScopesInRepository(result, repository) {
    for (var name in repository) {
      var rule2 = repository[name];
      if (rule2.patterns && Array.isArray(rule2.patterns)) {
        _extractIncludedScopesInPatterns(result, rule2.patterns);
      }
      if (rule2.repository) {
        _extractIncludedScopesInRepository(result, rule2.repository);
      }
    }
  }
  function collectIncludedScopes(result, grammar2) {
    if (grammar2.patterns && Array.isArray(grammar2.patterns)) {
      _extractIncludedScopesInPatterns(result, grammar2.patterns);
    }
    if (grammar2.repository) {
      _extractIncludedScopesInRepository(result, grammar2.repository);
    }
    delete result[grammar2.scopeName];
  }
  grammar.collectIncludedScopes = collectIncludedScopes;
  function scopesAreMatching(thisScopeName, scopeName) {
    if (!thisScopeName) {
      return false;
    }
    if (thisScopeName === scopeName) {
      return true;
    }
    var len = scopeName.length;
    return thisScopeName.length > len && thisScopeName.substr(0, len) === scopeName && thisScopeName[len] === ".";
  }
  function nameMatcher(identifers, scopes) {
    if (scopes.length < identifers.length) {
      return false;
    }
    var lastIndex = 0;
    return identifers.every(function(identifier) {
      for (var i = lastIndex; i < scopes.length; i++) {
        if (scopesAreMatching(scopes[i], identifier)) {
          lastIndex = i + 1;
          return true;
        }
      }
      return false;
    });
  }
  function collectInjections(result, selector, rule2, ruleFactoryHelper, grammar2) {
    var matchers = matcher_1.createMatchers(selector, nameMatcher);
    var ruleId = rule_1.RuleFactory.getCompiledRuleId(rule2, ruleFactoryHelper, grammar2.repository);
    for (var _i2 = 0, matchers_1 = matchers; _i2 < matchers_1.length; _i2++) {
      var matcher2 = matchers_1[_i2];
      result.push({
        matcher: matcher2.matcher,
        ruleId,
        grammar: grammar2,
        priority: matcher2.priority
      });
    }
  }
  var ScopeMetadata = function() {
    function ScopeMetadata2(scopeName, languageId, tokenType, themeData) {
      this.scopeName = scopeName;
      this.languageId = languageId;
      this.tokenType = tokenType;
      this.themeData = themeData;
    }
    return ScopeMetadata2;
  }();
  grammar.ScopeMetadata = ScopeMetadata;
  var ScopeMetadataProvider = function() {
    function ScopeMetadataProvider2(initialLanguage, themeProvider, embeddedLanguages) {
      this._initialLanguage = initialLanguage;
      this._themeProvider = themeProvider;
      this.onDidChangeTheme();
      this._embeddedLanguages = /* @__PURE__ */ Object.create(null);
      if (embeddedLanguages) {
        var scopes = Object.keys(embeddedLanguages);
        for (var i = 0, len = scopes.length; i < len; i++) {
          var scope = scopes[i];
          var language = embeddedLanguages[scope];
          if (typeof language !== "number" || language === 0) {
            console.warn("Invalid embedded language found at scope " + scope + ": <<" + language + ">>");
            continue;
          }
          this._embeddedLanguages[scope] = language;
        }
      }
      var escapedScopes = Object.keys(this._embeddedLanguages).map(function(scopeName) {
        return ScopeMetadataProvider2._escapeRegExpCharacters(scopeName);
      });
      if (escapedScopes.length === 0) {
        this._embeddedLanguagesRegex = null;
      } else {
        escapedScopes.sort();
        escapedScopes.reverse();
        this._embeddedLanguagesRegex = new RegExp("^((" + escapedScopes.join(")|(") + "))($|\\.)", "");
      }
    }
    ScopeMetadataProvider2.prototype.onDidChangeTheme = function() {
      this._cache = /* @__PURE__ */ Object.create(null);
      this._defaultMetaData = new ScopeMetadata("", this._initialLanguage, 0, [this._themeProvider.getDefaults()]);
    };
    ScopeMetadataProvider2.prototype.getDefaultMetadata = function() {
      return this._defaultMetaData;
    };
    ScopeMetadataProvider2._escapeRegExpCharacters = function(value) {
      return value.replace(/[\-\\\{\}\*\+\?\|\^\$\.\,\[\]\(\)\#\s]/g, "\\$&");
    };
    ScopeMetadataProvider2.prototype.getMetadataForScope = function(scopeName) {
      if (scopeName === null) {
        return ScopeMetadataProvider2._NULL_SCOPE_METADATA;
      }
      var value = this._cache[scopeName];
      if (value) {
        return value;
      }
      value = this._doGetMetadataForScope(scopeName);
      this._cache[scopeName] = value;
      return value;
    };
    ScopeMetadataProvider2.prototype._doGetMetadataForScope = function(scopeName) {
      var languageId = this._scopeToLanguage(scopeName);
      var standardTokenType = this._toStandardTokenType(scopeName);
      var themeData = this._themeProvider.themeMatch(scopeName);
      return new ScopeMetadata(scopeName, languageId, standardTokenType, themeData);
    };
    ScopeMetadataProvider2.prototype._scopeToLanguage = function(scope) {
      if (!scope) {
        return 0;
      }
      if (!this._embeddedLanguagesRegex) {
        return 0;
      }
      var m = scope.match(this._embeddedLanguagesRegex);
      if (!m) {
        return 0;
      }
      var language = this._embeddedLanguages[m[1]] || 0;
      if (!language) {
        return 0;
      }
      return language;
    };
    ScopeMetadataProvider2.prototype._toStandardTokenType = function(tokenType) {
      var m = tokenType.match(ScopeMetadataProvider2.STANDARD_TOKEN_TYPE_REGEXP);
      if (!m) {
        return 0;
      }
      switch (m[1]) {
        case "comment":
          return 1;
        case "string":
          return 2;
        case "regex":
          return 4;
        case "meta.embedded":
          return 8;
      }
      throw new Error("Unexpected match for standard token type!");
    };
    ScopeMetadataProvider2._NULL_SCOPE_METADATA = new ScopeMetadata("", 0, 0, null);
    ScopeMetadataProvider2.STANDARD_TOKEN_TYPE_REGEXP = /\b(comment|string|regex|meta\.embedded)\b/;
    return ScopeMetadataProvider2;
  }();
  var Grammar = function() {
    function Grammar2(grammar2, initialLanguage, embeddedLanguages, tokenTypes, grammarRepository) {
      this._scopeMetadataProvider = new ScopeMetadataProvider(initialLanguage, grammarRepository, embeddedLanguages);
      this._rootId = -1;
      this._lastRuleId = 0;
      this._ruleId2desc = [];
      this._includedGrammars = {};
      this._grammarRepository = grammarRepository;
      this._grammar = initGrammar(grammar2, null);
      this._tokenTypeMatchers = [];
      if (tokenTypes) {
        for (var _i2 = 0, _a2 = Object.keys(tokenTypes); _i2 < _a2.length; _i2++) {
          var selector = _a2[_i2];
          var matchers = matcher_1.createMatchers(selector, nameMatcher);
          for (var _b2 = 0, matchers_2 = matchers; _b2 < matchers_2.length; _b2++) {
            var matcher2 = matchers_2[_b2];
            this._tokenTypeMatchers.push({
              matcher: matcher2.matcher,
              type: tokenTypes[selector]
            });
          }
        }
      }
    }
    Grammar2.prototype.onDidChangeTheme = function() {
      this._scopeMetadataProvider.onDidChangeTheme();
    };
    Grammar2.prototype.getMetadataForScope = function(scope) {
      return this._scopeMetadataProvider.getMetadataForScope(scope);
    };
    Grammar2.prototype.getInjections = function() {
      var _this = this;
      if (!this._injections) {
        this._injections = [];
        var rawInjections = this._grammar.injections;
        if (rawInjections) {
          for (var expression in rawInjections) {
            collectInjections(this._injections, expression, rawInjections[expression], this, this._grammar);
          }
        }
        if (this._grammarRepository) {
          var injectionScopeNames = this._grammarRepository.injections(this._grammar.scopeName);
          if (injectionScopeNames) {
            injectionScopeNames.forEach(function(injectionScopeName) {
              var injectionGrammar = _this.getExternalGrammar(injectionScopeName);
              if (injectionGrammar) {
                var selector = injectionGrammar.injectionSelector;
                if (selector) {
                  collectInjections(_this._injections, selector, injectionGrammar, _this, injectionGrammar);
                }
              }
            });
          }
        }
        this._injections.sort(function(i1, i2) {
          return i1.priority - i2.priority;
        });
      }
      if (this._injections.length === 0) {
        return this._injections;
      }
      return this._injections;
    };
    Grammar2.prototype.registerRule = function(factory) {
      var id = ++this._lastRuleId;
      var result = factory(id);
      this._ruleId2desc[id] = result;
      return result;
    };
    Grammar2.prototype.getRule = function(patternId) {
      return this._ruleId2desc[patternId];
    };
    Grammar2.prototype.getExternalGrammar = function(scopeName, repository) {
      if (this._includedGrammars[scopeName]) {
        return this._includedGrammars[scopeName];
      } else if (this._grammarRepository) {
        var rawIncludedGrammar = this._grammarRepository.lookup(scopeName);
        if (rawIncludedGrammar) {
          this._includedGrammars[scopeName] = initGrammar(rawIncludedGrammar, repository && repository.$base);
          return this._includedGrammars[scopeName];
        }
      }
    };
    Grammar2.prototype.tokenizeLine = function(lineText, prevState) {
      var r = this._tokenize(lineText, prevState, false);
      return {
        tokens: r.lineTokens.getResult(r.ruleStack, r.lineLength),
        ruleStack: r.ruleStack
      };
    };
    Grammar2.prototype.tokenizeLine2 = function(lineText, prevState) {
      var r = this._tokenize(lineText, prevState, true);
      return {
        tokens: r.lineTokens.getBinaryResult(r.ruleStack, r.lineLength),
        ruleStack: r.ruleStack
      };
    };
    Grammar2.prototype._tokenize = function(lineText, prevState, emitBinaryTokens) {
      if (this._rootId === -1) {
        this._rootId = rule_1.RuleFactory.getCompiledRuleId(this._grammar.repository.$self, this, this._grammar.repository);
      }
      var isFirstLine;
      if (!prevState || prevState === StackElement.NULL) {
        isFirstLine = true;
        var rawDefaultMetadata = this._scopeMetadataProvider.getDefaultMetadata();
        var defaultTheme = rawDefaultMetadata.themeData[0];
        var defaultMetadata = StackElementMetadata.set(0, rawDefaultMetadata.languageId, rawDefaultMetadata.tokenType, defaultTheme.fontStyle, defaultTheme.foreground, defaultTheme.background);
        var rootScopeName = this.getRule(this._rootId).getName(null, null);
        var rawRootMetadata = this._scopeMetadataProvider.getMetadataForScope(rootScopeName);
        var rootMetadata = ScopeListElement.mergeMetadata(defaultMetadata, null, rawRootMetadata);
        var scopeList = new ScopeListElement(null, rootScopeName, rootMetadata);
        prevState = new StackElement(null, this._rootId, -1, null, scopeList, scopeList);
      } else {
        isFirstLine = false;
        prevState.reset();
      }
      lineText = lineText + "\n";
      var onigLineText = rule_1.createOnigString(lineText);
      var lineLength = rule_1.getString(onigLineText).length;
      var lineTokens = new LineTokens(emitBinaryTokens, lineText, this._tokenTypeMatchers);
      var nextState = _tokenizeString(this, onigLineText, isFirstLine, 0, prevState, lineTokens);
      return {
        lineLength,
        lineTokens,
        ruleStack: nextState
      };
    };
    return Grammar2;
  }();
  grammar.Grammar = Grammar;
  function initGrammar(grammar2, base) {
    grammar2 = utils_1.clone(grammar2);
    grammar2.repository = grammar2.repository || {};
    grammar2.repository.$self = {
      $vscodeTextmateLocation: grammar2.$vscodeTextmateLocation,
      patterns: grammar2.patterns,
      name: grammar2.scopeName
    };
    grammar2.repository.$base = base || grammar2.repository.$self;
    return grammar2;
  }
  function handleCaptures(grammar2, lineText, isFirstLine, stack, lineTokens, captures, captureIndices) {
    if (captures.length === 0) {
      return;
    }
    var len = Math.min(captures.length, captureIndices.length);
    var localStack = [];
    var maxEnd = captureIndices[0].end;
    for (var i = 0; i < len; i++) {
      var captureRule = captures[i];
      if (captureRule === null) {
        continue;
      }
      var captureIndex = captureIndices[i];
      if (captureIndex.length === 0) {
        continue;
      }
      if (captureIndex.start > maxEnd) {
        break;
      }
      while (localStack.length > 0 && localStack[localStack.length - 1].endPos <= captureIndex.start) {
        lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, localStack[localStack.length - 1].endPos);
        localStack.pop();
      }
      if (localStack.length > 0) {
        lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, captureIndex.start);
      } else {
        lineTokens.produce(stack, captureIndex.start);
      }
      if (captureRule.retokenizeCapturedWithRuleId) {
        var scopeName = captureRule.getName(rule_1.getString(lineText), captureIndices);
        var nameScopesList = stack.contentNameScopesList.push(grammar2, scopeName);
        var contentName = captureRule.getContentName(rule_1.getString(lineText), captureIndices);
        var contentNameScopesList = nameScopesList.push(grammar2, contentName);
        var stackClone = stack.push(captureRule.retokenizeCapturedWithRuleId, captureIndex.start, null, nameScopesList, contentNameScopesList);
        _tokenizeString(grammar2, rule_1.createOnigString(rule_1.getString(lineText).substring(0, captureIndex.end)), isFirstLine && captureIndex.start === 0, captureIndex.start, stackClone, lineTokens);
        continue;
      }
      var captureRuleScopeName = captureRule.getName(rule_1.getString(lineText), captureIndices);
      if (captureRuleScopeName !== null) {
        var base = localStack.length > 0 ? localStack[localStack.length - 1].scopes : stack.contentNameScopesList;
        var captureRuleScopesList = base.push(grammar2, captureRuleScopeName);
        localStack.push(new LocalStackElement(captureRuleScopesList, captureIndex.end));
      }
    }
    while (localStack.length > 0) {
      lineTokens.produceFromScopes(localStack[localStack.length - 1].scopes, localStack[localStack.length - 1].endPos);
      localStack.pop();
    }
  }
  function debugCompiledRuleToString(ruleScanner) {
    var r = [];
    for (var i = 0, len = ruleScanner.rules.length; i < len; i++) {
      r.push("   - " + ruleScanner.rules[i] + ": " + ruleScanner.debugRegExps[i]);
    }
    return r.join("\n");
  }
  function matchInjections(injections, grammar2, lineText, isFirstLine, linePos, stack, anchorPosition) {
    var bestMatchRating = Number.MAX_VALUE;
    var bestMatchCaptureIndices = null;
    var bestMatchRuleId;
    var bestMatchResultPriority = 0;
    var scopes = stack.contentNameScopesList.generateScopes();
    for (var i = 0, len = injections.length; i < len; i++) {
      var injection = injections[i];
      if (!injection.matcher(scopes)) {
        continue;
      }
      var ruleScanner = grammar2.getRule(injection.ruleId).compile(grammar2, null, isFirstLine, linePos === anchorPosition);
      var matchResult = ruleScanner.scanner.findNextMatchSync(lineText, linePos);
      if (debug_1$1.IN_DEBUG_MODE) {
        console.log("  scanning for injections");
        console.log(debugCompiledRuleToString(ruleScanner));
      }
      if (!matchResult) {
        continue;
      }
      var matchRating = matchResult.captureIndices[0].start;
      if (matchRating >= bestMatchRating) {
        continue;
      }
      bestMatchRating = matchRating;
      bestMatchCaptureIndices = matchResult.captureIndices;
      bestMatchRuleId = ruleScanner.rules[matchResult.index];
      bestMatchResultPriority = injection.priority;
      if (bestMatchRating === linePos) {
        break;
      }
    }
    if (bestMatchCaptureIndices) {
      return {
        priorityMatch: bestMatchResultPriority === -1,
        captureIndices: bestMatchCaptureIndices,
        matchedRuleId: bestMatchRuleId
      };
    }
    return null;
  }
  function matchRule(grammar2, lineText, isFirstLine, linePos, stack, anchorPosition) {
    var rule2 = stack.getRule(grammar2);
    var ruleScanner = rule2.compile(grammar2, stack.endRule, isFirstLine, linePos === anchorPosition);
    var r = ruleScanner.scanner.findNextMatchSync(lineText, linePos);
    if (debug_1$1.IN_DEBUG_MODE) {
      console.log("  scanning for");
      console.log(debugCompiledRuleToString(ruleScanner));
    }
    if (r) {
      return {
        captureIndices: r.captureIndices,
        matchedRuleId: ruleScanner.rules[r.index]
      };
    }
    return null;
  }
  function matchRuleOrInjections(grammar2, lineText, isFirstLine, linePos, stack, anchorPosition) {
    var matchResult = matchRule(grammar2, lineText, isFirstLine, linePos, stack, anchorPosition);
    var injections = grammar2.getInjections();
    if (injections.length === 0) {
      return matchResult;
    }
    var injectionResult = matchInjections(injections, grammar2, lineText, isFirstLine, linePos, stack, anchorPosition);
    if (!injectionResult) {
      return matchResult;
    }
    if (!matchResult) {
      return injectionResult;
    }
    var matchResultScore = matchResult.captureIndices[0].start;
    var injectionResultScore = injectionResult.captureIndices[0].start;
    if (injectionResultScore < matchResultScore || injectionResult.priorityMatch && injectionResultScore === matchResultScore) {
      return injectionResult;
    }
    return matchResult;
  }
  function _checkWhileConditions(grammar2, lineText, isFirstLine, linePos, stack, lineTokens) {
    var anchorPosition = -1;
    var whileRules = [];
    for (var node = stack; node; node = node.pop()) {
      var nodeRule = node.getRule(grammar2);
      if (nodeRule instanceof rule_1.BeginWhileRule) {
        whileRules.push({
          rule: nodeRule,
          stack: node
        });
      }
    }
    for (var whileRule = whileRules.pop(); whileRule; whileRule = whileRules.pop()) {
      var ruleScanner = whileRule.rule.compileWhile(grammar2, whileRule.stack.endRule, isFirstLine, anchorPosition === linePos);
      var r = ruleScanner.scanner.findNextMatchSync(lineText, linePos);
      if (debug_1$1.IN_DEBUG_MODE) {
        console.log("  scanning for while rule");
        console.log(debugCompiledRuleToString(ruleScanner));
      }
      if (r) {
        var matchedRuleId = ruleScanner.rules[r.index];
        if (matchedRuleId !== -2) {
          stack = whileRule.stack.pop();
          break;
        }
        if (r.captureIndices && r.captureIndices.length) {
          lineTokens.produce(whileRule.stack, r.captureIndices[0].start);
          handleCaptures(grammar2, lineText, isFirstLine, whileRule.stack, lineTokens, whileRule.rule.whileCaptures, r.captureIndices);
          lineTokens.produce(whileRule.stack, r.captureIndices[0].end);
          anchorPosition = r.captureIndices[0].end;
          if (r.captureIndices[0].end > linePos) {
            linePos = r.captureIndices[0].end;
            isFirstLine = false;
          }
        }
      } else {
        stack = whileRule.stack.pop();
        break;
      }
    }
    return { stack, linePos, anchorPosition, isFirstLine };
  }
  function _tokenizeString(grammar2, lineText, isFirstLine, linePos, stack, lineTokens) {
    var lineLength = rule_1.getString(lineText).length;
    var STOP = false;
    var whileCheckResult = _checkWhileConditions(grammar2, lineText, isFirstLine, linePos, stack, lineTokens);
    stack = whileCheckResult.stack;
    linePos = whileCheckResult.linePos;
    isFirstLine = whileCheckResult.isFirstLine;
    var anchorPosition = whileCheckResult.anchorPosition;
    while (!STOP) {
      scanNext();
    }
    function scanNext() {
      if (debug_1$1.IN_DEBUG_MODE) {
        console.log("");
        console.log("@@scanNext: |" + rule_1.getString(lineText).replace(/\n$/, "\\n").substr(linePos) + "|");
      }
      var r = matchRuleOrInjections(grammar2, lineText, isFirstLine, linePos, stack, anchorPosition);
      if (!r) {
        if (debug_1$1.IN_DEBUG_MODE) {
          console.log("  no more matches.");
        }
        lineTokens.produce(stack, lineLength);
        STOP = true;
        return;
      }
      var captureIndices = r.captureIndices;
      var matchedRuleId = r.matchedRuleId;
      var hasAdvanced = captureIndices && captureIndices.length > 0 ? captureIndices[0].end > linePos : false;
      if (matchedRuleId === -1) {
        var poppedRule = stack.getRule(grammar2);
        if (debug_1$1.IN_DEBUG_MODE) {
          console.log("  popping " + poppedRule.debugName + " - " + poppedRule.debugEndRegExp);
        }
        lineTokens.produce(stack, captureIndices[0].start);
        stack = stack.setContentNameScopesList(stack.nameScopesList);
        handleCaptures(grammar2, lineText, isFirstLine, stack, lineTokens, poppedRule.endCaptures, captureIndices);
        lineTokens.produce(stack, captureIndices[0].end);
        var popped = stack;
        stack = stack.pop();
        if (!hasAdvanced && popped.getEnterPos() === linePos) {
          console.error("[1] - Grammar is in an endless loop - Grammar pushed & popped a rule without advancing");
          stack = popped;
          lineTokens.produce(stack, lineLength);
          STOP = true;
          return;
        }
      } else {
        var _rule = grammar2.getRule(matchedRuleId);
        lineTokens.produce(stack, captureIndices[0].start);
        var beforePush = stack;
        var scopeName = _rule.getName(rule_1.getString(lineText), captureIndices);
        var nameScopesList = stack.contentNameScopesList.push(grammar2, scopeName);
        stack = stack.push(matchedRuleId, linePos, null, nameScopesList, nameScopesList);
        if (_rule instanceof rule_1.BeginEndRule) {
          var pushedRule = _rule;
          if (debug_1$1.IN_DEBUG_MODE) {
            console.log("  pushing " + pushedRule.debugName + " - " + pushedRule.debugBeginRegExp);
          }
          handleCaptures(grammar2, lineText, isFirstLine, stack, lineTokens, pushedRule.beginCaptures, captureIndices);
          lineTokens.produce(stack, captureIndices[0].end);
          anchorPosition = captureIndices[0].end;
          var contentName = pushedRule.getContentName(rule_1.getString(lineText), captureIndices);
          var contentNameScopesList = nameScopesList.push(grammar2, contentName);
          stack = stack.setContentNameScopesList(contentNameScopesList);
          if (pushedRule.endHasBackReferences) {
            stack = stack.setEndRule(pushedRule.getEndWithResolvedBackReferences(rule_1.getString(lineText), captureIndices));
          }
          if (!hasAdvanced && beforePush.hasSameRuleAs(stack)) {
            console.error("[2] - Grammar is in an endless loop - Grammar pushed the same rule without advancing");
            stack = stack.pop();
            lineTokens.produce(stack, lineLength);
            STOP = true;
            return;
          }
        } else if (_rule instanceof rule_1.BeginWhileRule) {
          var pushedRule = _rule;
          if (debug_1$1.IN_DEBUG_MODE) {
            console.log("  pushing " + pushedRule.debugName);
          }
          handleCaptures(grammar2, lineText, isFirstLine, stack, lineTokens, pushedRule.beginCaptures, captureIndices);
          lineTokens.produce(stack, captureIndices[0].end);
          anchorPosition = captureIndices[0].end;
          var contentName = pushedRule.getContentName(rule_1.getString(lineText), captureIndices);
          var contentNameScopesList = nameScopesList.push(grammar2, contentName);
          stack = stack.setContentNameScopesList(contentNameScopesList);
          if (pushedRule.whileHasBackReferences) {
            stack = stack.setEndRule(pushedRule.getWhileWithResolvedBackReferences(rule_1.getString(lineText), captureIndices));
          }
          if (!hasAdvanced && beforePush.hasSameRuleAs(stack)) {
            console.error("[3] - Grammar is in an endless loop - Grammar pushed the same rule without advancing");
            stack = stack.pop();
            lineTokens.produce(stack, lineLength);
            STOP = true;
            return;
          }
        } else {
          var matchingRule = _rule;
          if (debug_1$1.IN_DEBUG_MODE) {
            console.log("  matched " + matchingRule.debugName + " - " + matchingRule.debugMatchRegExp);
          }
          handleCaptures(grammar2, lineText, isFirstLine, stack, lineTokens, matchingRule.captures, captureIndices);
          lineTokens.produce(stack, captureIndices[0].end);
          stack = stack.pop();
          if (!hasAdvanced) {
            console.error("[4] - Grammar is in an endless loop - Grammar is not advancing, nor is it pushing/popping");
            stack = stack.safePop();
            lineTokens.produce(stack, lineLength);
            STOP = true;
            return;
          }
        }
      }
      if (captureIndices[0].end > linePos) {
        linePos = captureIndices[0].end;
        isFirstLine = false;
      }
    }
    return stack;
  }
  var StackElementMetadata = function() {
    function StackElementMetadata2() {
    }
    StackElementMetadata2.toBinaryStr = function(metadata) {
      var r = metadata.toString(2);
      while (r.length < 32) {
        r = "0" + r;
      }
      return r;
    };
    StackElementMetadata2.printMetadata = function(metadata) {
      var languageId = StackElementMetadata2.getLanguageId(metadata);
      var tokenType = StackElementMetadata2.getTokenType(metadata);
      var fontStyle = StackElementMetadata2.getFontStyle(metadata);
      var foreground = StackElementMetadata2.getForeground(metadata);
      var background = StackElementMetadata2.getBackground(metadata);
      console.log({
        languageId,
        tokenType,
        fontStyle,
        foreground,
        background
      });
    };
    StackElementMetadata2.getLanguageId = function(metadata) {
      return (metadata & 255) >>> 0;
    };
    StackElementMetadata2.getTokenType = function(metadata) {
      return (metadata & 1792) >>> 8;
    };
    StackElementMetadata2.getFontStyle = function(metadata) {
      return (metadata & 14336) >>> 11;
    };
    StackElementMetadata2.getForeground = function(metadata) {
      return (metadata & 8372224) >>> 14;
    };
    StackElementMetadata2.getBackground = function(metadata) {
      return (metadata & 4286578688) >>> 23;
    };
    StackElementMetadata2.set = function(metadata, languageId, tokenType, fontStyle, foreground, background) {
      var _languageId = StackElementMetadata2.getLanguageId(metadata);
      var _tokenType = StackElementMetadata2.getTokenType(metadata);
      var _fontStyle = StackElementMetadata2.getFontStyle(metadata);
      var _foreground = StackElementMetadata2.getForeground(metadata);
      var _background = StackElementMetadata2.getBackground(metadata);
      if (languageId !== 0) {
        _languageId = languageId;
      }
      if (tokenType !== 0) {
        _tokenType = tokenType === 8 ? 0 : tokenType;
      }
      if (fontStyle !== -1) {
        _fontStyle = fontStyle;
      }
      if (foreground !== 0) {
        _foreground = foreground;
      }
      if (background !== 0) {
        _background = background;
      }
      return (_languageId << 0 | _tokenType << 8 | _fontStyle << 11 | _foreground << 14 | _background << 23) >>> 0;
    };
    return StackElementMetadata2;
  }();
  grammar.StackElementMetadata = StackElementMetadata;
  var ScopeListElement = function() {
    function ScopeListElement2(parent, scope, metadata) {
      this.parent = parent;
      this.scope = scope;
      this.metadata = metadata;
    }
    ScopeListElement2._equals = function(a, b) {
      do {
        if (a === b) {
          return true;
        }
        if (a.scope !== b.scope || a.metadata !== b.metadata) {
          return false;
        }
        a = a.parent;
        b = b.parent;
        if (!a && !b) {
          return true;
        }
        if (!a || !b) {
          return false;
        }
      } while (true);
    };
    ScopeListElement2.prototype.equals = function(other) {
      return ScopeListElement2._equals(this, other);
    };
    ScopeListElement2._matchesScope = function(scope, selector, selectorWithDot) {
      return selector === scope || scope.substring(0, selectorWithDot.length) === selectorWithDot;
    };
    ScopeListElement2._matches = function(target, parentScopes) {
      if (parentScopes === null) {
        return true;
      }
      var len = parentScopes.length;
      var index = 0;
      var selector = parentScopes[index];
      var selectorWithDot = selector + ".";
      while (target) {
        if (this._matchesScope(target.scope, selector, selectorWithDot)) {
          index++;
          if (index === len) {
            return true;
          }
          selector = parentScopes[index];
          selectorWithDot = selector + ".";
        }
        target = target.parent;
      }
      return false;
    };
    ScopeListElement2.mergeMetadata = function(metadata, scopesList, source) {
      if (source === null) {
        return metadata;
      }
      var fontStyle = -1;
      var foreground = 0;
      var background = 0;
      if (source.themeData !== null) {
        for (var i = 0, len = source.themeData.length; i < len; i++) {
          var themeData = source.themeData[i];
          if (this._matches(scopesList, themeData.parentScopes)) {
            fontStyle = themeData.fontStyle;
            foreground = themeData.foreground;
            background = themeData.background;
            break;
          }
        }
      }
      return StackElementMetadata.set(metadata, source.languageId, source.tokenType, fontStyle, foreground, background);
    };
    ScopeListElement2._push = function(target, grammar2, scopes) {
      for (var i = 0, len = scopes.length; i < len; i++) {
        var scope = scopes[i];
        var rawMetadata = grammar2.getMetadataForScope(scope);
        var metadata = ScopeListElement2.mergeMetadata(target.metadata, target, rawMetadata);
        target = new ScopeListElement2(target, scope, metadata);
      }
      return target;
    };
    ScopeListElement2.prototype.push = function(grammar2, scope) {
      if (scope === null) {
        return this;
      }
      if (scope.indexOf(" ") >= 0) {
        return ScopeListElement2._push(this, grammar2, scope.split(/ /g));
      }
      return ScopeListElement2._push(this, grammar2, [scope]);
    };
    ScopeListElement2._generateScopes = function(scopesList) {
      var result = [], resultLen = 0;
      while (scopesList) {
        result[resultLen++] = scopesList.scope;
        scopesList = scopesList.parent;
      }
      result.reverse();
      return result;
    };
    ScopeListElement2.prototype.generateScopes = function() {
      return ScopeListElement2._generateScopes(this);
    };
    return ScopeListElement2;
  }();
  grammar.ScopeListElement = ScopeListElement;
  var StackElement = function() {
    function StackElement2(parent, ruleId, enterPos, endRule, nameScopesList, contentNameScopesList) {
      this.parent = parent;
      this.depth = this.parent ? this.parent.depth + 1 : 1;
      this.ruleId = ruleId;
      this._enterPos = enterPos;
      this.endRule = endRule;
      this.nameScopesList = nameScopesList;
      this.contentNameScopesList = contentNameScopesList;
    }
    StackElement2._structuralEquals = function(a, b) {
      do {
        if (a === b) {
          return true;
        }
        if (a.depth !== b.depth || a.ruleId !== b.ruleId || a.endRule !== b.endRule) {
          return false;
        }
        a = a.parent;
        b = b.parent;
        if (!a && !b) {
          return true;
        }
        if (!a || !b) {
          return false;
        }
      } while (true);
    };
    StackElement2._equals = function(a, b) {
      if (a === b) {
        return true;
      }
      if (!this._structuralEquals(a, b)) {
        return false;
      }
      return a.contentNameScopesList.equals(b.contentNameScopesList);
    };
    StackElement2.prototype.clone = function() {
      return this;
    };
    StackElement2.prototype.equals = function(other) {
      if (other === null) {
        return false;
      }
      return StackElement2._equals(this, other);
    };
    StackElement2._reset = function(el) {
      while (el) {
        el._enterPos = -1;
        el = el.parent;
      }
    };
    StackElement2.prototype.reset = function() {
      StackElement2._reset(this);
    };
    StackElement2.prototype.pop = function() {
      return this.parent;
    };
    StackElement2.prototype.safePop = function() {
      if (this.parent) {
        return this.parent;
      }
      return this;
    };
    StackElement2.prototype.push = function(ruleId, enterPos, endRule, nameScopesList, contentNameScopesList) {
      return new StackElement2(this, ruleId, enterPos, endRule, nameScopesList, contentNameScopesList);
    };
    StackElement2.prototype.getEnterPos = function() {
      return this._enterPos;
    };
    StackElement2.prototype.getRule = function(grammar2) {
      return grammar2.getRule(this.ruleId);
    };
    StackElement2.prototype._writeString = function(res, outIndex) {
      if (this.parent) {
        outIndex = this.parent._writeString(res, outIndex);
      }
      res[outIndex++] = "(" + this.ruleId + ", TODO-" + this.nameScopesList + ", TODO-" + this.contentNameScopesList + ")";
      return outIndex;
    };
    StackElement2.prototype.toString = function() {
      var r = [];
      this._writeString(r, 0);
      return "[" + r.join(",") + "]";
    };
    StackElement2.prototype.setContentNameScopesList = function(contentNameScopesList) {
      if (this.contentNameScopesList === contentNameScopesList) {
        return this;
      }
      return this.parent.push(this.ruleId, this._enterPos, this.endRule, this.nameScopesList, contentNameScopesList);
    };
    StackElement2.prototype.setEndRule = function(endRule) {
      if (this.endRule === endRule) {
        return this;
      }
      return new StackElement2(this.parent, this.ruleId, this._enterPos, endRule, this.nameScopesList, this.contentNameScopesList);
    };
    StackElement2.prototype.hasSameRuleAs = function(other) {
      return this.ruleId === other.ruleId;
    };
    StackElement2.NULL = new StackElement2(null, 0, 0, null, null, null);
    return StackElement2;
  }();
  grammar.StackElement = StackElement;
  var LocalStackElement = function() {
    function LocalStackElement2(scopes, endPos) {
      this.scopes = scopes;
      this.endPos = endPos;
    }
    return LocalStackElement2;
  }();
  grammar.LocalStackElement = LocalStackElement;
  var LineTokens = function() {
    function LineTokens2(emitBinaryTokens, lineText, tokenTypeOverrides) {
      this._emitBinaryTokens = emitBinaryTokens;
      this._tokenTypeOverrides = tokenTypeOverrides;
      if (debug_1$1.IN_DEBUG_MODE) {
        this._lineText = lineText;
      }
      if (this._emitBinaryTokens) {
        this._binaryTokens = [];
      } else {
        this._tokens = [];
      }
      this._lastTokenEndIndex = 0;
    }
    LineTokens2.prototype.produce = function(stack, endIndex) {
      this.produceFromScopes(stack.contentNameScopesList, endIndex);
    };
    LineTokens2.prototype.produceFromScopes = function(scopesList, endIndex) {
      if (this._lastTokenEndIndex >= endIndex) {
        return;
      }
      if (this._emitBinaryTokens) {
        var metadata = scopesList.metadata;
        for (var _i2 = 0, _a2 = this._tokenTypeOverrides; _i2 < _a2.length; _i2++) {
          var tokenType = _a2[_i2];
          if (tokenType.matcher(scopesList.generateScopes())) {
            metadata = StackElementMetadata.set(metadata, 0, toTemporaryType(tokenType.type), -1, 0, 0);
          }
        }
        if (this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 1] === metadata) {
          this._lastTokenEndIndex = endIndex;
          return;
        }
        this._binaryTokens.push(this._lastTokenEndIndex);
        this._binaryTokens.push(metadata);
        this._lastTokenEndIndex = endIndex;
        return;
      }
      var scopes = scopesList.generateScopes();
      if (debug_1$1.IN_DEBUG_MODE) {
        console.log("  token: |" + this._lineText.substring(this._lastTokenEndIndex, endIndex).replace(/\n$/, "\\n") + "|");
        for (var k = 0; k < scopes.length; k++) {
          console.log("      * " + scopes[k]);
        }
      }
      this._tokens.push({
        startIndex: this._lastTokenEndIndex,
        endIndex,
        scopes
      });
      this._lastTokenEndIndex = endIndex;
    };
    LineTokens2.prototype.getResult = function(stack, lineLength) {
      if (this._tokens.length > 0 && this._tokens[this._tokens.length - 1].startIndex === lineLength - 1) {
        this._tokens.pop();
      }
      if (this._tokens.length === 0) {
        this._lastTokenEndIndex = -1;
        this.produce(stack, lineLength);
        this._tokens[this._tokens.length - 1].startIndex = 0;
      }
      return this._tokens;
    };
    LineTokens2.prototype.getBinaryResult = function(stack, lineLength) {
      if (this._binaryTokens.length > 0 && this._binaryTokens[this._binaryTokens.length - 2] === lineLength - 1) {
        this._binaryTokens.pop();
        this._binaryTokens.pop();
      }
      if (this._binaryTokens.length === 0) {
        this._lastTokenEndIndex = -1;
        this.produce(stack, lineLength);
        this._binaryTokens[this._binaryTokens.length - 2] = 0;
      }
      var result = new Uint32Array(this._binaryTokens.length);
      for (var i = 0, len = this._binaryTokens.length; i < len; i++) {
        result[i] = this._binaryTokens[i];
      }
      return result;
    };
    return LineTokens2;
  }();
  function toTemporaryType(standardType) {
    switch (standardType) {
      case 4:
        return 4;
      case 2:
        return 2;
      case 1:
        return 1;
      case 0:
      default:
        return 8;
    }
  }
  Object.defineProperty(registry, "__esModule", { value: true });
  var grammar_1$1 = grammar;
  var SyncRegistry = function() {
    function SyncRegistry2(theme2) {
      this._theme = theme2;
      this._grammars = {};
      this._rawGrammars = {};
      this._injectionGrammars = {};
    }
    SyncRegistry2.prototype.setTheme = function(theme2) {
      var _this = this;
      this._theme = theme2;
      Object.keys(this._grammars).forEach(function(scopeName) {
        var grammar2 = _this._grammars[scopeName];
        grammar2.onDidChangeTheme();
      });
    };
    SyncRegistry2.prototype.getColorMap = function() {
      return this._theme.getColorMap();
    };
    SyncRegistry2.prototype.addGrammar = function(grammar2, injectionScopeNames) {
      this._rawGrammars[grammar2.scopeName] = grammar2;
      var includedScopes = {};
      grammar_1$1.collectIncludedScopes(includedScopes, grammar2);
      if (injectionScopeNames) {
        this._injectionGrammars[grammar2.scopeName] = injectionScopeNames;
        injectionScopeNames.forEach(function(scopeName) {
          includedScopes[scopeName] = true;
        });
      }
      return Object.keys(includedScopes);
    };
    SyncRegistry2.prototype.lookup = function(scopeName) {
      return this._rawGrammars[scopeName];
    };
    SyncRegistry2.prototype.injections = function(targetScope) {
      return this._injectionGrammars[targetScope];
    };
    SyncRegistry2.prototype.getDefaults = function() {
      return this._theme.getDefaults();
    };
    SyncRegistry2.prototype.themeMatch = function(scopeName) {
      return this._theme.match(scopeName);
    };
    SyncRegistry2.prototype.grammarForScopeName = function(scopeName, initialLanguage, embeddedLanguages, tokenTypes) {
      if (!this._grammars[scopeName]) {
        var rawGrammar = this._rawGrammars[scopeName];
        if (!rawGrammar) {
          return null;
        }
        this._grammars[scopeName] = grammar_1$1.createGrammar(rawGrammar, initialLanguage, embeddedLanguages, tokenTypes, this);
      }
      return this._grammars[scopeName];
    };
    return SyncRegistry2;
  }();
  registry.SyncRegistry = SyncRegistry;
  var grammarReader = {};
  var main = {};
  main.__esModule = true;
  main.parse = main.parseWithLocation = void 0;
  function parseWithLocation(content, filename, locationKeyName) {
    return _parse(content, filename, locationKeyName);
  }
  main.parseWithLocation = parseWithLocation;
  function parse$1(content) {
    return _parse(content, null, null);
  }
  main.parse = parse$1;
  function _parse(content, filename, locationKeyName) {
    var len = content.length;
    var pos = 0;
    var line = 1;
    var char = 0;
    if (len > 0 && content.charCodeAt(0) === 65279) {
      pos = 1;
    }
    function advancePosBy(by) {
      if (locationKeyName === null) {
        pos = pos + by;
      } else {
        while (by > 0) {
          var chCode2 = content.charCodeAt(pos);
          if (chCode2 === 10) {
            pos++;
            line++;
            char = 0;
          } else {
            pos++;
            char++;
          }
          by--;
        }
      }
    }
    function advancePosTo(to) {
      if (locationKeyName === null) {
        pos = to;
      } else {
        advancePosBy(to - pos);
      }
    }
    function skipWhitespace() {
      while (pos < len) {
        var chCode2 = content.charCodeAt(pos);
        if (chCode2 !== 32 && chCode2 !== 9 && chCode2 !== 13 && chCode2 !== 10) {
          break;
        }
        advancePosBy(1);
      }
    }
    function advanceIfStartsWith(str) {
      if (content.substr(pos, str.length) === str) {
        advancePosBy(str.length);
        return true;
      }
      return false;
    }
    function advanceUntil(str) {
      var nextOccurence = content.indexOf(str, pos);
      if (nextOccurence !== -1) {
        advancePosTo(nextOccurence + str.length);
      } else {
        advancePosTo(len);
      }
    }
    function captureUntil(str) {
      var nextOccurence = content.indexOf(str, pos);
      if (nextOccurence !== -1) {
        var r = content.substring(pos, nextOccurence);
        advancePosTo(nextOccurence + str.length);
        return r;
      } else {
        var r = content.substr(pos);
        advancePosTo(len);
        return r;
      }
    }
    var state = 0;
    var cur = null;
    var stateStack = [];
    var objStack = [];
    var curKey = null;
    function pushState(newState, newCur) {
      stateStack.push(state);
      objStack.push(cur);
      state = newState;
      cur = newCur;
    }
    function popState() {
      if (stateStack.length === 0) {
        return fail("illegal state stack");
      }
      state = stateStack.pop();
      cur = objStack.pop();
    }
    function fail(msg) {
      throw new Error("Near offset " + pos + ": " + msg + " ~~~" + content.substr(pos, 50) + "~~~");
    }
    var dictState = {
      enterDict: function() {
        if (curKey === null) {
          return fail("missing <key>");
        }
        var newDict = {};
        if (locationKeyName !== null) {
          newDict[locationKeyName] = {
            filename,
            line,
            char
          };
        }
        cur[curKey] = newDict;
        curKey = null;
        pushState(1, newDict);
      },
      enterArray: function() {
        if (curKey === null) {
          return fail("missing <key>");
        }
        var newArr = [];
        cur[curKey] = newArr;
        curKey = null;
        pushState(2, newArr);
      }
    };
    var arrState = {
      enterDict: function() {
        var newDict = {};
        if (locationKeyName !== null) {
          newDict[locationKeyName] = {
            filename,
            line,
            char
          };
        }
        cur.push(newDict);
        pushState(1, newDict);
      },
      enterArray: function() {
        var newArr = [];
        cur.push(newArr);
        pushState(2, newArr);
      }
    };
    function enterDict() {
      if (state === 1) {
        dictState.enterDict();
      } else if (state === 2) {
        arrState.enterDict();
      } else {
        cur = {};
        if (locationKeyName !== null) {
          cur[locationKeyName] = {
            filename,
            line,
            char
          };
        }
        pushState(1, cur);
      }
    }
    function leaveDict() {
      if (state === 1) {
        popState();
      } else if (state === 2) {
        return fail("unexpected </dict>");
      } else {
        return fail("unexpected </dict>");
      }
    }
    function enterArray() {
      if (state === 1) {
        dictState.enterArray();
      } else if (state === 2) {
        arrState.enterArray();
      } else {
        cur = [];
        pushState(2, cur);
      }
    }
    function leaveArray() {
      if (state === 1) {
        return fail("unexpected </array>");
      } else if (state === 2) {
        popState();
      } else {
        return fail("unexpected </array>");
      }
    }
    function acceptKey(val) {
      if (state === 1) {
        if (curKey !== null) {
          return fail("too many <key>");
        }
        curKey = val;
      } else if (state === 2) {
        return fail("unexpected <key>");
      } else {
        return fail("unexpected <key>");
      }
    }
    function acceptString(val) {
      if (state === 1) {
        if (curKey === null) {
          return fail("missing <key>");
        }
        cur[curKey] = val;
        curKey = null;
      } else if (state === 2) {
        cur.push(val);
      } else {
        cur = val;
      }
    }
    function acceptReal(val) {
      if (isNaN(val)) {
        return fail("cannot parse float");
      }
      if (state === 1) {
        if (curKey === null) {
          return fail("missing <key>");
        }
        cur[curKey] = val;
        curKey = null;
      } else if (state === 2) {
        cur.push(val);
      } else {
        cur = val;
      }
    }
    function acceptInteger(val) {
      if (isNaN(val)) {
        return fail("cannot parse integer");
      }
      if (state === 1) {
        if (curKey === null) {
          return fail("missing <key>");
        }
        cur[curKey] = val;
        curKey = null;
      } else if (state === 2) {
        cur.push(val);
      } else {
        cur = val;
      }
    }
    function acceptDate(val) {
      if (state === 1) {
        if (curKey === null) {
          return fail("missing <key>");
        }
        cur[curKey] = val;
        curKey = null;
      } else if (state === 2) {
        cur.push(val);
      } else {
        cur = val;
      }
    }
    function acceptData(val) {
      if (state === 1) {
        if (curKey === null) {
          return fail("missing <key>");
        }
        cur[curKey] = val;
        curKey = null;
      } else if (state === 2) {
        cur.push(val);
      } else {
        cur = val;
      }
    }
    function acceptBool(val) {
      if (state === 1) {
        if (curKey === null) {
          return fail("missing <key>");
        }
        cur[curKey] = val;
        curKey = null;
      } else if (state === 2) {
        cur.push(val);
      } else {
        cur = val;
      }
    }
    function escapeVal(str) {
      return str.replace(/&#([0-9]+);/g, function(_2, m0) {
        return String.fromCodePoint(parseInt(m0, 10));
      }).replace(/&#x([0-9a-f]+);/g, function(_2, m0) {
        return String.fromCodePoint(parseInt(m0, 16));
      }).replace(/&amp;|&lt;|&gt;|&quot;|&apos;/g, function(_2) {
        switch (_2) {
          case "&amp;":
            return "&";
          case "&lt;":
            return "<";
          case "&gt;":
            return ">";
          case "&quot;":
            return '"';
          case "&apos;":
            return "'";
        }
        return _2;
      });
    }
    function parseOpenTag() {
      var r = captureUntil(">");
      var isClosed = false;
      if (r.charCodeAt(r.length - 1) === 47) {
        isClosed = true;
        r = r.substring(0, r.length - 1);
      }
      return {
        name: r.trim(),
        isClosed
      };
    }
    function parseTagValue(tag2) {
      if (tag2.isClosed) {
        return "";
      }
      var val = captureUntil("</");
      advanceUntil(">");
      return escapeVal(val);
    }
    while (pos < len) {
      skipWhitespace();
      if (pos >= len) {
        break;
      }
      var chCode = content.charCodeAt(pos);
      advancePosBy(1);
      if (chCode !== 60) {
        return fail("expected <");
      }
      if (pos >= len) {
        return fail("unexpected end of input");
      }
      var peekChCode = content.charCodeAt(pos);
      if (peekChCode === 63) {
        advancePosBy(1);
        advanceUntil("?>");
        continue;
      }
      if (peekChCode === 33) {
        advancePosBy(1);
        if (advanceIfStartsWith("--")) {
          advanceUntil("-->");
          continue;
        }
        advanceUntil(">");
        continue;
      }
      if (peekChCode === 47) {
        advancePosBy(1);
        skipWhitespace();
        if (advanceIfStartsWith("plist")) {
          advanceUntil(">");
          continue;
        }
        if (advanceIfStartsWith("dict")) {
          advanceUntil(">");
          leaveDict();
          continue;
        }
        if (advanceIfStartsWith("array")) {
          advanceUntil(">");
          leaveArray();
          continue;
        }
        return fail("unexpected closed tag");
      }
      var tag = parseOpenTag();
      switch (tag.name) {
        case "dict":
          enterDict();
          if (tag.isClosed) {
            leaveDict();
          }
          continue;
        case "array":
          enterArray();
          if (tag.isClosed) {
            leaveArray();
          }
          continue;
        case "key":
          acceptKey(parseTagValue(tag));
          continue;
        case "string":
          acceptString(parseTagValue(tag));
          continue;
        case "real":
          acceptReal(parseFloat(parseTagValue(tag)));
          continue;
        case "integer":
          acceptInteger(parseInt(parseTagValue(tag), 10));
          continue;
        case "date":
          acceptDate(new Date(parseTagValue(tag)));
          continue;
        case "data":
          acceptData(parseTagValue(tag));
          continue;
        case "true":
          parseTagValue(tag);
          acceptBool(true);
          continue;
        case "false":
          parseTagValue(tag);
          acceptBool(false);
          continue;
      }
      if (/^plist/.test(tag.name)) {
        continue;
      }
      return fail("unexpected opened tag " + tag.name);
    }
    return cur;
  }
  var json = {};
  Object.defineProperty(json, "__esModule", { value: true });
  function doFail(streamState, msg) {
    throw new Error("Near offset " + streamState.pos + ": " + msg + " ~~~" + streamState.source.substr(streamState.pos, 50) + "~~~");
  }
  function parse(source, filename, withMetadata) {
    var streamState = new JSONStreamState(source);
    var token = new JSONToken();
    var state = 0;
    var cur = null;
    var stateStack = [];
    var objStack = [];
    function pushState() {
      stateStack.push(state);
      objStack.push(cur);
    }
    function popState() {
      state = stateStack.pop();
      cur = objStack.pop();
    }
    function fail(msg) {
      doFail(streamState, msg);
    }
    while (nextJSONToken(streamState, token)) {
      if (state === 0) {
        if (cur !== null) {
          fail("too many constructs in root");
        }
        if (token.type === 3) {
          cur = {};
          if (withMetadata) {
            cur.$vscodeTextmateLocation = token.toLocation(filename);
          }
          pushState();
          state = 1;
          continue;
        }
        if (token.type === 2) {
          cur = [];
          pushState();
          state = 4;
          continue;
        }
        fail("unexpected token in root");
      }
      if (state === 2) {
        if (token.type === 5) {
          popState();
          continue;
        }
        if (token.type === 7) {
          state = 3;
          continue;
        }
        fail("expected , or }");
      }
      if (state === 1 || state === 3) {
        if (state === 1 && token.type === 5) {
          popState();
          continue;
        }
        if (token.type === 1) {
          var keyValue = token.value;
          if (!nextJSONToken(streamState, token) || token.type !== 6) {
            fail("expected colon");
          }
          if (!nextJSONToken(streamState, token)) {
            fail("expected value");
          }
          state = 2;
          if (token.type === 1) {
            cur[keyValue] = token.value;
            continue;
          }
          if (token.type === 8) {
            cur[keyValue] = null;
            continue;
          }
          if (token.type === 9) {
            cur[keyValue] = true;
            continue;
          }
          if (token.type === 10) {
            cur[keyValue] = false;
            continue;
          }
          if (token.type === 11) {
            cur[keyValue] = parseFloat(token.value);
            continue;
          }
          if (token.type === 2) {
            var newArr = [];
            cur[keyValue] = newArr;
            pushState();
            state = 4;
            cur = newArr;
            continue;
          }
          if (token.type === 3) {
            var newDict = {};
            if (withMetadata) {
              newDict.$vscodeTextmateLocation = token.toLocation(filename);
            }
            cur[keyValue] = newDict;
            pushState();
            state = 1;
            cur = newDict;
            continue;
          }
        }
        fail("unexpected token in dict");
      }
      if (state === 5) {
        if (token.type === 4) {
          popState();
          continue;
        }
        if (token.type === 7) {
          state = 6;
          continue;
        }
        fail("expected , or ]");
      }
      if (state === 4 || state === 6) {
        if (state === 4 && token.type === 4) {
          popState();
          continue;
        }
        state = 5;
        if (token.type === 1) {
          cur.push(token.value);
          continue;
        }
        if (token.type === 8) {
          cur.push(null);
          continue;
        }
        if (token.type === 9) {
          cur.push(true);
          continue;
        }
        if (token.type === 10) {
          cur.push(false);
          continue;
        }
        if (token.type === 11) {
          cur.push(parseFloat(token.value));
          continue;
        }
        if (token.type === 2) {
          var newArr = [];
          cur.push(newArr);
          pushState();
          state = 4;
          cur = newArr;
          continue;
        }
        if (token.type === 3) {
          var newDict = {};
          if (withMetadata) {
            newDict.$vscodeTextmateLocation = token.toLocation(filename);
          }
          cur.push(newDict);
          pushState();
          state = 1;
          cur = newDict;
          continue;
        }
        fail("unexpected token in array");
      }
      fail("unknown state");
    }
    if (objStack.length !== 0) {
      fail("unclosed constructs");
    }
    return cur;
  }
  json.parse = parse;
  var JSONStreamState = function() {
    function JSONStreamState2(source) {
      this.source = source;
      this.pos = 0;
      this.len = source.length;
      this.line = 1;
      this.char = 0;
    }
    return JSONStreamState2;
  }();
  var JSONToken = function() {
    function JSONToken2() {
      this.value = null;
      this.offset = -1;
      this.len = -1;
      this.line = -1;
      this.char = -1;
    }
    JSONToken2.prototype.toLocation = function(filename) {
      return {
        filename,
        line: this.line,
        char: this.char
      };
    };
    return JSONToken2;
  }();
  function nextJSONToken(_state, _out) {
    _out.value = null;
    _out.type = 0;
    _out.offset = -1;
    _out.len = -1;
    _out.line = -1;
    _out.char = -1;
    var source = _state.source;
    var pos = _state.pos;
    var len = _state.len;
    var line = _state.line;
    var char = _state.char;
    var chCode;
    do {
      if (pos >= len) {
        return false;
      }
      chCode = source.charCodeAt(pos);
      if (chCode === 32 || chCode === 9 || chCode === 13) {
        pos++;
        char++;
        continue;
      }
      if (chCode === 10) {
        pos++;
        line++;
        char = 0;
        continue;
      }
      break;
    } while (true);
    _out.offset = pos;
    _out.line = line;
    _out.char = char;
    if (chCode === 34) {
      _out.type = 1;
      pos++;
      char++;
      do {
        if (pos >= len) {
          return false;
        }
        chCode = source.charCodeAt(pos);
        pos++;
        char++;
        if (chCode === 92) {
          pos++;
          char++;
          continue;
        }
        if (chCode === 34) {
          break;
        }
      } while (true);
      _out.value = source.substring(_out.offset + 1, pos - 1).replace(/\\u([0-9A-Fa-f]{4})/g, function(_2, m0) {
        return String.fromCodePoint(parseInt(m0, 16));
      }).replace(/\\(.)/g, function(_2, m0) {
        switch (m0) {
          case '"':
            return '"';
          case "\\":
            return "\\";
          case "/":
            return "/";
          case "b":
            return "\b";
          case "f":
            return "\f";
          case "n":
            return "\n";
          case "r":
            return "\r";
          case "t":
            return "	";
          default:
            doFail(_state, "invalid escape sequence");
        }
      });
    } else if (chCode === 91) {
      _out.type = 2;
      pos++;
      char++;
    } else if (chCode === 123) {
      _out.type = 3;
      pos++;
      char++;
    } else if (chCode === 93) {
      _out.type = 4;
      pos++;
      char++;
    } else if (chCode === 125) {
      _out.type = 5;
      pos++;
      char++;
    } else if (chCode === 58) {
      _out.type = 6;
      pos++;
      char++;
    } else if (chCode === 44) {
      _out.type = 7;
      pos++;
      char++;
    } else if (chCode === 110) {
      _out.type = 8;
      pos++;
      char++;
      chCode = source.charCodeAt(pos);
      if (chCode !== 117) {
        return false;
      }
      pos++;
      char++;
      chCode = source.charCodeAt(pos);
      if (chCode !== 108) {
        return false;
      }
      pos++;
      char++;
      chCode = source.charCodeAt(pos);
      if (chCode !== 108) {
        return false;
      }
      pos++;
      char++;
    } else if (chCode === 116) {
      _out.type = 9;
      pos++;
      char++;
      chCode = source.charCodeAt(pos);
      if (chCode !== 114) {
        return false;
      }
      pos++;
      char++;
      chCode = source.charCodeAt(pos);
      if (chCode !== 117) {
        return false;
      }
      pos++;
      char++;
      chCode = source.charCodeAt(pos);
      if (chCode !== 101) {
        return false;
      }
      pos++;
      char++;
    } else if (chCode === 102) {
      _out.type = 10;
      pos++;
      char++;
      chCode = source.charCodeAt(pos);
      if (chCode !== 97) {
        return false;
      }
      pos++;
      char++;
      chCode = source.charCodeAt(pos);
      if (chCode !== 108) {
        return false;
      }
      pos++;
      char++;
      chCode = source.charCodeAt(pos);
      if (chCode !== 115) {
        return false;
      }
      pos++;
      char++;
      chCode = source.charCodeAt(pos);
      if (chCode !== 101) {
        return false;
      }
      pos++;
      char++;
    } else {
      _out.type = 11;
      do {
        if (pos >= len) {
          return false;
        }
        chCode = source.charCodeAt(pos);
        if (chCode === 46 || chCode >= 48 && chCode <= 57 || (chCode === 101 || chCode === 69) || (chCode === 45 || chCode === 43)) {
          pos++;
          char++;
          continue;
        }
        break;
      } while (true);
    }
    _out.len = pos - _out.offset;
    if (_out.value === null) {
      _out.value = source.substr(_out.offset, _out.len);
    }
    _state.pos = pos;
    _state.line = line;
    _state.char = char;
    return true;
  }
  Object.defineProperty(grammarReader, "__esModule", { value: true });
  var plist = main;
  var debug_1 = debug;
  var json_1 = json;
  function parseJSONGrammar(contents, filename) {
    if (debug_1.CAPTURE_METADATA) {
      return json_1.parse(contents, filename, true);
    }
    return JSON.parse(contents);
  }
  grammarReader.parseJSONGrammar = parseJSONGrammar;
  function parsePLISTGrammar(contents, filename) {
    if (debug_1.CAPTURE_METADATA) {
      return plist.parseWithLocation(contents, filename, "$vscodeTextmateLocation");
    }
    return plist.parse(contents);
  }
  grammarReader.parsePLISTGrammar = parsePLISTGrammar;
  var theme = {};
  Object.defineProperty(theme, "__esModule", { value: true });
  var ParsedThemeRule = function() {
    function ParsedThemeRule2(scope, parentScopes, index, fontStyle, foreground, background) {
      this.scope = scope;
      this.parentScopes = parentScopes;
      this.index = index;
      this.fontStyle = fontStyle;
      this.foreground = foreground;
      this.background = background;
    }
    return ParsedThemeRule2;
  }();
  theme.ParsedThemeRule = ParsedThemeRule;
  function isValidHexColor(hex) {
    if (/^#[0-9a-f]{6}$/i.test(hex)) {
      return true;
    }
    if (/^#[0-9a-f]{8}$/i.test(hex)) {
      return true;
    }
    if (/^#[0-9a-f]{3}$/i.test(hex)) {
      return true;
    }
    if (/^#[0-9a-f]{4}$/i.test(hex)) {
      return true;
    }
    return false;
  }
  function parseTheme(source) {
    if (!source) {
      return [];
    }
    if (!source.settings || !Array.isArray(source.settings)) {
      return [];
    }
    var settings = source.settings;
    var result = [], resultLen = 0;
    for (var i = 0, len = settings.length; i < len; i++) {
      var entry = settings[i];
      if (!entry.settings) {
        continue;
      }
      var scopes = void 0;
      if (typeof entry.scope === "string") {
        var _scope = entry.scope;
        _scope = _scope.replace(/^[,]+/, "");
        _scope = _scope.replace(/[,]+$/, "");
        scopes = _scope.split(",");
      } else if (Array.isArray(entry.scope)) {
        scopes = entry.scope;
      } else {
        scopes = [""];
      }
      var fontStyle = -1;
      if (typeof entry.settings.fontStyle === "string") {
        fontStyle = 0;
        var segments = entry.settings.fontStyle.split(" ");
        for (var j2 = 0, lenJ = segments.length; j2 < lenJ; j2++) {
          var segment = segments[j2];
          switch (segment) {
            case "italic":
              fontStyle = fontStyle | 1;
              break;
            case "bold":
              fontStyle = fontStyle | 2;
              break;
            case "underline":
              fontStyle = fontStyle | 4;
              break;
          }
        }
      }
      var foreground = null;
      if (typeof entry.settings.foreground === "string" && isValidHexColor(entry.settings.foreground)) {
        foreground = entry.settings.foreground;
      }
      var background = null;
      if (typeof entry.settings.background === "string" && isValidHexColor(entry.settings.background)) {
        background = entry.settings.background;
      }
      for (var j2 = 0, lenJ = scopes.length; j2 < lenJ; j2++) {
        var _scope = scopes[j2].trim();
        var segments = _scope.split(" ");
        var scope = segments[segments.length - 1];
        var parentScopes = null;
        if (segments.length > 1) {
          parentScopes = segments.slice(0, segments.length - 1);
          parentScopes.reverse();
        }
        result[resultLen++] = new ParsedThemeRule(scope, parentScopes, i, fontStyle, foreground, background);
      }
    }
    return result;
  }
  theme.parseTheme = parseTheme;
  function resolveParsedThemeRules(parsedThemeRules) {
    parsedThemeRules.sort(function(a, b) {
      var r = strcmp(a.scope, b.scope);
      if (r !== 0) {
        return r;
      }
      r = strArrCmp(a.parentScopes, b.parentScopes);
      if (r !== 0) {
        return r;
      }
      return a.index - b.index;
    });
    var defaultFontStyle = 0;
    var defaultForeground = "#000000";
    var defaultBackground = "#ffffff";
    while (parsedThemeRules.length >= 1 && parsedThemeRules[0].scope === "") {
      var incomingDefaults = parsedThemeRules.shift();
      if (incomingDefaults.fontStyle !== -1) {
        defaultFontStyle = incomingDefaults.fontStyle;
      }
      if (incomingDefaults.foreground !== null) {
        defaultForeground = incomingDefaults.foreground;
      }
      if (incomingDefaults.background !== null) {
        defaultBackground = incomingDefaults.background;
      }
    }
    var colorMap = new ColorMap();
    var defaults = new ThemeTrieElementRule(0, null, defaultFontStyle, colorMap.getId(defaultForeground), colorMap.getId(defaultBackground));
    var root = new ThemeTrieElement(new ThemeTrieElementRule(0, null, -1, 0, 0), []);
    for (var i = 0, len = parsedThemeRules.length; i < len; i++) {
      var rule2 = parsedThemeRules[i];
      root.insert(0, rule2.scope, rule2.parentScopes, rule2.fontStyle, colorMap.getId(rule2.foreground), colorMap.getId(rule2.background));
    }
    return new Theme(colorMap, defaults, root);
  }
  var ColorMap = function() {
    function ColorMap2() {
      this._lastColorId = 0;
      this._id2color = [];
      this._color2id = /* @__PURE__ */ Object.create(null);
    }
    ColorMap2.prototype.getId = function(color) {
      if (color === null) {
        return 0;
      }
      color = color.toUpperCase();
      var value = this._color2id[color];
      if (value) {
        return value;
      }
      value = ++this._lastColorId;
      this._color2id[color] = value;
      this._id2color[value] = color;
      return value;
    };
    ColorMap2.prototype.getColorMap = function() {
      return this._id2color.slice(0);
    };
    return ColorMap2;
  }();
  theme.ColorMap = ColorMap;
  var Theme = function() {
    function Theme2(colorMap, defaults, root) {
      this._colorMap = colorMap;
      this._root = root;
      this._defaults = defaults;
      this._cache = {};
    }
    Theme2.createFromRawTheme = function(source) {
      return this.createFromParsedTheme(parseTheme(source));
    };
    Theme2.createFromParsedTheme = function(source) {
      return resolveParsedThemeRules(source);
    };
    Theme2.prototype.getColorMap = function() {
      return this._colorMap.getColorMap();
    };
    Theme2.prototype.getDefaults = function() {
      return this._defaults;
    };
    Theme2.prototype.match = function(scopeName) {
      if (!this._cache.hasOwnProperty(scopeName)) {
        this._cache[scopeName] = this._root.match(scopeName);
      }
      return this._cache[scopeName];
    };
    return Theme2;
  }();
  theme.Theme = Theme;
  function strcmp(a, b) {
    if (a < b) {
      return -1;
    }
    if (a > b) {
      return 1;
    }
    return 0;
  }
  theme.strcmp = strcmp;
  function strArrCmp(a, b) {
    if (a === null && b === null) {
      return 0;
    }
    if (!a) {
      return -1;
    }
    if (!b) {
      return 1;
    }
    var len1 = a.length;
    var len2 = b.length;
    if (len1 === len2) {
      for (var i = 0; i < len1; i++) {
        var res = strcmp(a[i], b[i]);
        if (res !== 0) {
          return res;
        }
      }
      return 0;
    }
    return len1 - len2;
  }
  theme.strArrCmp = strArrCmp;
  var ThemeTrieElementRule = function() {
    function ThemeTrieElementRule2(scopeDepth, parentScopes, fontStyle, foreground, background) {
      this.scopeDepth = scopeDepth;
      this.parentScopes = parentScopes;
      this.fontStyle = fontStyle;
      this.foreground = foreground;
      this.background = background;
    }
    ThemeTrieElementRule2.prototype.clone = function() {
      return new ThemeTrieElementRule2(this.scopeDepth, this.parentScopes, this.fontStyle, this.foreground, this.background);
    };
    ThemeTrieElementRule2.cloneArr = function(arr) {
      var r = [];
      for (var i = 0, len = arr.length; i < len; i++) {
        r[i] = arr[i].clone();
      }
      return r;
    };
    ThemeTrieElementRule2.prototype.acceptOverwrite = function(scopeDepth, fontStyle, foreground, background) {
      if (this.scopeDepth > scopeDepth) {
        console.log("how did this happen?");
      } else {
        this.scopeDepth = scopeDepth;
      }
      if (fontStyle !== -1) {
        this.fontStyle = fontStyle;
      }
      if (foreground !== 0) {
        this.foreground = foreground;
      }
      if (background !== 0) {
        this.background = background;
      }
    };
    return ThemeTrieElementRule2;
  }();
  theme.ThemeTrieElementRule = ThemeTrieElementRule;
  var ThemeTrieElement = function() {
    function ThemeTrieElement2(mainRule, rulesWithParentScopes, children) {
      if (rulesWithParentScopes === void 0) {
        rulesWithParentScopes = [];
      }
      if (children === void 0) {
        children = {};
      }
      this._mainRule = mainRule;
      this._rulesWithParentScopes = rulesWithParentScopes;
      this._children = children;
    }
    ThemeTrieElement2._sortBySpecificity = function(arr) {
      if (arr.length === 1) {
        return arr;
      }
      arr.sort(this._cmpBySpecificity);
      return arr;
    };
    ThemeTrieElement2._cmpBySpecificity = function(a, b) {
      if (a.scopeDepth === b.scopeDepth) {
        var aParentScopes = a.parentScopes;
        var bParentScopes = b.parentScopes;
        var aParentScopesLen = aParentScopes === null ? 0 : aParentScopes.length;
        var bParentScopesLen = bParentScopes === null ? 0 : bParentScopes.length;
        if (aParentScopesLen === bParentScopesLen) {
          for (var i = 0; i < aParentScopesLen; i++) {
            var aLen = aParentScopes[i].length;
            var bLen = bParentScopes[i].length;
            if (aLen !== bLen) {
              return bLen - aLen;
            }
          }
        }
        return bParentScopesLen - aParentScopesLen;
      }
      return b.scopeDepth - a.scopeDepth;
    };
    ThemeTrieElement2.prototype.match = function(scope) {
      if (scope === "") {
        return ThemeTrieElement2._sortBySpecificity([].concat(this._mainRule).concat(this._rulesWithParentScopes));
      }
      var dotIndex = scope.indexOf(".");
      var head;
      var tail;
      if (dotIndex === -1) {
        head = scope;
        tail = "";
      } else {
        head = scope.substring(0, dotIndex);
        tail = scope.substring(dotIndex + 1);
      }
      if (this._children.hasOwnProperty(head)) {
        return this._children[head].match(tail);
      }
      return ThemeTrieElement2._sortBySpecificity([].concat(this._mainRule).concat(this._rulesWithParentScopes));
    };
    ThemeTrieElement2.prototype.insert = function(scopeDepth, scope, parentScopes, fontStyle, foreground, background) {
      if (scope === "") {
        this._doInsertHere(scopeDepth, parentScopes, fontStyle, foreground, background);
        return;
      }
      var dotIndex = scope.indexOf(".");
      var head;
      var tail;
      if (dotIndex === -1) {
        head = scope;
        tail = "";
      } else {
        head = scope.substring(0, dotIndex);
        tail = scope.substring(dotIndex + 1);
      }
      var child;
      if (this._children.hasOwnProperty(head)) {
        child = this._children[head];
      } else {
        child = new ThemeTrieElement2(this._mainRule.clone(), ThemeTrieElementRule.cloneArr(this._rulesWithParentScopes));
        this._children[head] = child;
      }
      child.insert(scopeDepth + 1, tail, parentScopes, fontStyle, foreground, background);
    };
    ThemeTrieElement2.prototype._doInsertHere = function(scopeDepth, parentScopes, fontStyle, foreground, background) {
      if (parentScopes === null) {
        this._mainRule.acceptOverwrite(scopeDepth, fontStyle, foreground, background);
        return;
      }
      for (var i = 0, len = this._rulesWithParentScopes.length; i < len; i++) {
        var rule2 = this._rulesWithParentScopes[i];
        if (strArrCmp(rule2.parentScopes, parentScopes) === 0) {
          rule2.acceptOverwrite(scopeDepth, fontStyle, foreground, background);
          return;
        }
      }
      if (fontStyle === -1) {
        fontStyle = this._mainRule.fontStyle;
      }
      if (foreground === 0) {
        foreground = this._mainRule.foreground;
      }
      if (background === 0) {
        background = this._mainRule.background;
      }
      this._rulesWithParentScopes.push(new ThemeTrieElementRule(scopeDepth, parentScopes, fontStyle, foreground, background));
    };
    return ThemeTrieElement2;
  }();
  theme.ThemeTrieElement = ThemeTrieElement;
  var __awaiter = commonjsGlobal && commonjsGlobal.__awaiter || function(thisArg, _arguments, P2, generator) {
    return new (P2 || (P2 = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e4) {
          reject(e4);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e4) {
          reject(e4);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : new P2(function(resolve2) {
          resolve2(result.value);
        }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var __generator = commonjsGlobal && commonjsGlobal.__generator || function(thisArg, body) {
    var _2 = { label: 0, sent: function() {
      if (t[0] & 1)
        throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f2, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f2)
        throw new TypeError("Generator is already executing.");
      while (_2)
        try {
          if (f2 = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
            return t;
          if (y = 0, t)
            op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _2.label++;
              return { value: op[1], done: false };
            case 5:
              _2.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _2.ops.pop();
              _2.trys.pop();
              continue;
            default:
              if (!(t = _2.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _2 = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _2.label = op[1];
                break;
              }
              if (op[0] === 6 && _2.label < t[1]) {
                _2.label = t[1];
                t = op;
                break;
              }
              if (t && _2.label < t[2]) {
                _2.label = t[2];
                _2.ops.push(op);
                break;
              }
              if (t[2])
                _2.ops.pop();
              _2.trys.pop();
              continue;
          }
          op = body.call(thisArg, _2);
        } catch (e4) {
          op = [6, e4];
          y = 0;
        } finally {
          f2 = t = 0;
        }
      if (op[0] & 5)
        throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
  Object.defineProperty(main$1, "__esModule", { value: true });
  var registry_1 = registry;
  var grammarReader_1 = grammarReader;
  var theme_1 = theme;
  var grammar_1 = grammar;
  var DEFAULT_OPTIONS = {
    getGrammarDefinition: function(scopeName) {
      return null;
    },
    getInjections: function(scopeName) {
      return null;
    }
  };
  var Registry = function() {
    function Registry2(locator) {
      if (locator === void 0) {
        locator = DEFAULT_OPTIONS;
      }
      this._locator = locator;
      this._syncRegistry = new registry_1.SyncRegistry(theme_1.Theme.createFromRawTheme(locator.theme));
      this.installationQueue = /* @__PURE__ */ new Map();
    }
    Registry2.prototype.setTheme = function(theme2) {
      this._syncRegistry.setTheme(theme_1.Theme.createFromRawTheme(theme2));
    };
    Registry2.prototype.getColorMap = function() {
      return this._syncRegistry.getColorMap();
    };
    Registry2.prototype.loadGrammarWithEmbeddedLanguages = function(initialScopeName, initialLanguage, embeddedLanguages) {
      return this.loadGrammarWithConfiguration(initialScopeName, initialLanguage, { embeddedLanguages });
    };
    Registry2.prototype.loadGrammarWithConfiguration = function(initialScopeName, initialLanguage, configuration) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              return [4, this._loadGrammar(initialScopeName)];
            case 1:
              _a2.sent();
              return [2, this.grammarForScopeName(initialScopeName, initialLanguage, configuration.embeddedLanguages, configuration.tokenTypes)];
          }
        });
      });
    };
    Registry2.prototype.loadGrammar = function(initialScopeName) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a2) {
          return [2, this._loadGrammar(initialScopeName)];
        });
      });
    };
    Registry2.prototype._loadGrammar = function(initialScopeName, dependentScope) {
      if (dependentScope === void 0) {
        dependentScope = null;
      }
      return __awaiter(this, void 0, void 0, function() {
        var prom;
        var _this = this;
        return __generator(this, function(_a2) {
          switch (_a2.label) {
            case 0:
              if (this._syncRegistry.lookup(initialScopeName)) {
                return [2, this.grammarForScopeName(initialScopeName)];
              }
              if (this.installationQueue.has(initialScopeName)) {
                return [2, this.installationQueue.get(initialScopeName)];
              }
              prom = new Promise(function(resolve, reject) {
                return __awaiter(_this, void 0, void 0, function() {
                  var grammarDefinition, rawGrammar, injections, deps;
                  var _this2 = this;
                  return __generator(this, function(_a3) {
                    switch (_a3.label) {
                      case 0:
                        return [4, this._locator.getGrammarDefinition(initialScopeName, dependentScope)];
                      case 1:
                        grammarDefinition = _a3.sent();
                        if (!grammarDefinition) {
                          throw new Error("A tmGrammar load was requested but registry host failed to provide grammar definition");
                        }
                        if (grammarDefinition.format !== "json" && grammarDefinition.format !== "plist" || grammarDefinition.format === "json" && typeof grammarDefinition.content !== "object" && typeof grammarDefinition.content !== "string" || grammarDefinition.format === "plist" && typeof grammarDefinition.content !== "string") {
                          throw new TypeError('Grammar definition must be an object, either `{ content: string | object, format: "json" }` OR `{ content: string, format: "plist" }`)');
                        }
                        rawGrammar = grammarDefinition.format === "json" ? typeof grammarDefinition.content === "string" ? grammarReader_1.parseJSONGrammar(grammarDefinition.content, "c://fakepath/grammar.json") : grammarDefinition.content : grammarReader_1.parsePLISTGrammar(grammarDefinition.content, "c://fakepath/grammar.plist");
                        injections = typeof this._locator.getInjections === "function" && this._locator.getInjections(initialScopeName);
                        rawGrammar.scopeName = initialScopeName;
                        deps = this._syncRegistry.addGrammar(rawGrammar, injections);
                        return [4, Promise.all(deps.map(function(scopeNameD) {
                          return __awaiter(_this2, void 0, void 0, function() {
                            return __generator(this, function(_a4) {
                              try {
                                return [2, this._loadGrammar(scopeNameD, initialScopeName)];
                              } catch (error) {
                                throw new Error("While trying to load tmGrammar with scopeId: '" + initialScopeName + "', it's dependency (scopeId: " + scopeNameD + ") loading errored: " + error.message);
                              }
                              return [2];
                            });
                          });
                        }))];
                      case 2:
                        _a3.sent();
                        resolve(this.grammarForScopeName(initialScopeName));
                        return [2];
                    }
                  });
                });
              });
              this.installationQueue.set(initialScopeName, prom);
              return [4, prom];
            case 1:
              _a2.sent();
              this.installationQueue.delete(initialScopeName);
              return [2, prom];
          }
        });
      });
    };
    Registry2.prototype.grammarForScopeName = function(scopeName, initialLanguage, embeddedLanguages, tokenTypes) {
      if (initialLanguage === void 0) {
        initialLanguage = 0;
      }
      if (embeddedLanguages === void 0) {
        embeddedLanguages = null;
      }
      if (tokenTypes === void 0) {
        tokenTypes = null;
      }
      return this._syncRegistry.grammarForScopeName(scopeName, initialLanguage, embeddedLanguages, tokenTypes);
    };
    return Registry2;
  }();
  var Registry_1 = main$1.Registry = Registry;
  main$1.INITIAL = grammar_1.StackElement.NULL;
  var dist = {};
  var tmToMonacoToken = {};
  Object.defineProperty(tmToMonacoToken, "__esModule", { value: true });
  tmToMonacoToken.TMToMonacoToken = void 0;
  const TMToMonacoToken = (editor, scopes) => {
    let scopeName = "";
    for (let i = scopes[0].length - 1; i >= 0; i -= 1) {
      const char = scopes[0][i];
      if (char === ".") {
        break;
      }
      scopeName = char + scopeName;
    }
    for (let i = scopes.length - 1; i >= 0; i -= 1) {
      const scope = scopes[i];
      for (let i2 = scope.length - 1; i2 >= 0; i2 -= 1) {
        const char = scope[i2];
        if (char === ".") {
          const token = scope.slice(0, i2);
          if (editor["_themeService"]._theme._tokenTheme._match(token + "." + scopeName)._foreground > 1) {
            return token + "." + scopeName;
          }
          if (editor["_themeService"]._theme._tokenTheme._match(token)._foreground > 1) {
            return token;
          }
        }
      }
    }
    return "";
  };
  tmToMonacoToken.TMToMonacoToken = TMToMonacoToken;
  Object.defineProperty(dist, "__esModule", { value: true });
  var wireTmGrammars_1 = dist.wireTmGrammars = void 0;
  const monaco_textmate_1 = main$1;
  const tm_to_monaco_token_1 = tmToMonacoToken;
  class TokenizerState {
    constructor(_ruleStack) {
      __publicField(this, "_ruleStack");
      this._ruleStack = _ruleStack;
    }
    get ruleStack() {
      return this._ruleStack;
    }
    clone() {
      return new TokenizerState(this._ruleStack);
    }
    equals(other) {
      if (!other || !(other instanceof TokenizerState) || other !== this || other._ruleStack !== this._ruleStack) {
        return false;
      }
      return true;
    }
  }
  function wireTmGrammars(monaco, registry2, languages, editor) {
    return Promise.all(Array.from(languages.keys()).map(async (languageId) => {
      const grammar2 = await registry2.loadGrammar(languages.get(languageId));
      monaco.languages.setTokensProvider(languageId, {
        getInitialState: () => new TokenizerState(monaco_textmate_1.INITIAL),
        tokenize: (line, state) => {
          const res = grammar2.tokenizeLine(line, state.ruleStack);
          return {
            endState: new TokenizerState(res.ruleStack),
            tokens: res.tokens.map((token) => ({
              ...token,
              scopes: editor ? (0, tm_to_monaco_token_1.TMToMonacoToken)(editor, token.scopes) : token.scopes[token.scopes.length - 1]
            }))
          };
        }
      });
    }));
  }
  wireTmGrammars_1 = dist.wireTmGrammars = wireTmGrammars;
  const initMonacoEditor = async () => {
    await loadWASM(`${"https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/data"}/onigasm/onigasm.wasm`);
  };
  const wire = async (languageId, editor, monaco) => {
    languageId = ["vue2", "vue3", "vue"].includes(languageId) ? "vue" : languageId;
    if (!scopeNameMap[languageId]) {
      return;
    }
    const grammars = /* @__PURE__ */ new Map();
    grammars.set(languageId, scopeNameMap[languageId]);
    const registry2 = new Registry_1({
      getGrammarDefinition: async (scopeName) => {
        let jsonMap = tmGrammarJsonMap[scopeName];
        if (!jsonMap) {
          return null;
        }
        let format = "json";
        let path2 = jsonMap;
        if (typeof jsonMap !== "string") {
          format = jsonMap.format;
          path2 = jsonMap.path;
        }
        let text = await (await fetch(`${"https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/data"}/grammars/${path2}`)).text();
        return {
          format,
          content: text
        };
      }
    });
    if (!monacoEditorInnerLanguages.includes(languageId)) {
      monaco.languages.register({ id: languageId });
    }
    await wireTmGrammars_1(monaco, registry2, grammars, editor);
  };
  var E;
  (function(e4) {
    e4[e4.Canceled = 1] = "Canceled", e4[e4.Unknown = 2] = "Unknown", e4[e4.InvalidArgument = 3] = "InvalidArgument", e4[e4.DeadlineExceeded = 4] = "DeadlineExceeded", e4[e4.NotFound = 5] = "NotFound", e4[e4.AlreadyExists = 6] = "AlreadyExists", e4[e4.PermissionDenied = 7] = "PermissionDenied", e4[e4.ResourceExhausted = 8] = "ResourceExhausted", e4[e4.FailedPrecondition = 9] = "FailedPrecondition", e4[e4.Aborted = 10] = "Aborted", e4[e4.OutOfRange = 11] = "OutOfRange", e4[e4.Unimplemented = 12] = "Unimplemented", e4[e4.Internal = 13] = "Internal", e4[e4.Unavailable = 14] = "Unavailable", e4[e4.DataLoss = 15] = "DataLoss", e4[e4.Unauthenticated = 16] = "Unauthenticated";
  })(E || (E = {}));
  function N(e4, t) {
    if (!e4)
      throw new Error(t);
  }
  var On = 34028234663852886e22, Un = -34028234663852886e22, Rn = 4294967295, Fn = 2147483647, _n = -2147483648;
  function L(e4) {
    if (typeof e4 != "number")
      throw new Error("invalid int 32: " + typeof e4);
    if (!Number.isInteger(e4) || e4 > Fn || e4 < _n)
      throw new Error("invalid int 32: " + e4);
  }
  function j(e4) {
    if (typeof e4 != "number")
      throw new Error("invalid uint 32: " + typeof e4);
    if (!Number.isInteger(e4) || e4 > Rn || e4 < 0)
      throw new Error("invalid uint 32: " + e4);
  }
  function oe(e4) {
    if (typeof e4 != "number")
      throw new Error("invalid float 32: " + typeof e4);
    if (Number.isFinite(e4) && (e4 > On || e4 < Un))
      throw new Error("invalid float 32: " + e4);
  }
  var Tt = Symbol("@bufbuild/protobuf/enum-type");
  function St(e4) {
    let t = e4[Tt];
    return N(t, "missing enum type on enum object"), t;
  }
  function $e(e4, t, n, r) {
    e4[Tt] = je(t, n.map((o) => ({ no: o.no, name: o.name, localName: e4[o.no] })));
  }
  function je(e4, t, n) {
    let r = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ Object.create(null), i = [];
    for (let s of t) {
      let a = Nt(s);
      i.push(a), r[s.name] = a, o[s.no] = a;
    }
    return { typeName: e4, values: i, findName(s) {
      return r[s];
    }, findNumber(s) {
      return o[s];
    } };
  }
  function At(e4, t, n) {
    let r = {};
    for (let o of t) {
      let i = Nt(o);
      r[i.localName] = i.no, r[i.no] = i.localName;
    }
    return $e(r, e4, t), r;
  }
  function Nt(e4) {
    return "localName" in e4 ? e4 : Object.assign(Object.assign({}, e4), { localName: e4.name });
  }
  var w = class {
    equals(t) {
      return this.getType().runtime.util.equals(this.getType(), this, t);
    }
    clone() {
      return this.getType().runtime.util.clone(this);
    }
    fromBinary(t, n) {
      let r = this.getType(), o = r.runtime.bin, i = o.makeReadOptions(n);
      return o.readMessage(this, i.readerFactory(t), t.byteLength, i), this;
    }
    fromJson(t, n) {
      let r = this.getType(), o = r.runtime.json, i = o.makeReadOptions(n);
      return o.readMessage(r, t, i, this), this;
    }
    fromJsonString(t, n) {
      let r;
      try {
        r = JSON.parse(t);
      } catch (o) {
        throw new Error(`cannot decode ${this.getType().typeName} from JSON: ${o instanceof Error ? o.message : String(o)}`);
      }
      return this.fromJson(r, n);
    }
    toBinary(t) {
      let n = this.getType(), r = n.runtime.bin, o = r.makeWriteOptions(t), i = o.writerFactory();
      return r.writeMessage(this, i, o), i.finish();
    }
    toJson(t) {
      let n = this.getType(), r = n.runtime.json, o = r.makeWriteOptions(t);
      return r.writeMessage(this, o);
    }
    toJsonString(t) {
      var n;
      let r = this.toJson(t);
      return JSON.stringify(r, null, (n = t == null ? void 0 : t.prettySpaces) !== null && n !== void 0 ? n : 0);
    }
    toJSON() {
      return this.toJson({ emitDefaultValues: true });
    }
    getType() {
      return Object.getPrototypeOf(this).constructor;
    }
  };
  function Pt(e4, t, n, r) {
    var o;
    let i = (o = r == null ? void 0 : r.localName) !== null && o !== void 0 ? o : t.substring(t.lastIndexOf(".") + 1), s = { [i]: function(a) {
      e4.util.initFields(this), e4.util.initPartial(a, this);
    } }[i];
    return Object.setPrototypeOf(s.prototype, new w()), Object.assign(s, { runtime: e4, typeName: t, fields: e4.util.newFieldList(n), fromBinary(a, c) {
      return new s().fromBinary(a, c);
    }, fromJson(a, c) {
      return new s().fromJson(a, c);
    }, fromJsonString(a, c) {
      return new s().fromJsonString(a, c);
    }, equals(a, c) {
      return e4.util.equals(s, a, c);
    } }), s;
  }
  function vt(e4, t, n, r) {
    return { syntax: e4, json: t, bin: n, util: r, makeMessageType(o, i, s) {
      return Pt(this, o, i, s);
    }, makeEnum: At, makeEnumType: je, getEnumType: St };
  }
  var f;
  (function(e4) {
    e4[e4.DOUBLE = 1] = "DOUBLE", e4[e4.FLOAT = 2] = "FLOAT", e4[e4.INT64 = 3] = "INT64", e4[e4.UINT64 = 4] = "UINT64", e4[e4.INT32 = 5] = "INT32", e4[e4.FIXED64 = 6] = "FIXED64", e4[e4.FIXED32 = 7] = "FIXED32", e4[e4.BOOL = 8] = "BOOL", e4[e4.STRING = 9] = "STRING", e4[e4.BYTES = 12] = "BYTES", e4[e4.UINT32 = 13] = "UINT32", e4[e4.SFIXED32 = 15] = "SFIXED32", e4[e4.SFIXED64 = 16] = "SFIXED64", e4[e4.SINT32 = 17] = "SINT32", e4[e4.SINT64 = 18] = "SINT64";
  })(f || (f = {}));
  var R;
  (function(e4) {
    e4[e4.BIGINT = 0] = "BIGINT", e4[e4.STRING = 1] = "STRING";
  })(R || (R = {}));
  function kt() {
    let e4 = 0, t = 0;
    for (let r = 0; r < 28; r += 7) {
      let o = this.buf[this.pos++];
      if (e4 |= (o & 127) << r, !(o & 128))
        return this.assertBounds(), [e4, t];
    }
    let n = this.buf[this.pos++];
    if (e4 |= (n & 15) << 28, t = (n & 112) >> 4, !(n & 128))
      return this.assertBounds(), [e4, t];
    for (let r = 3; r <= 31; r += 7) {
      let o = this.buf[this.pos++];
      if (t |= (o & 127) << r, !(o & 128))
        return this.assertBounds(), [e4, t];
    }
    throw new Error("invalid varint");
  }
  function se(e4, t, n) {
    for (let i = 0; i < 28; i = i + 7) {
      let s = e4 >>> i, a = !(!(s >>> 7) && t == 0), c = (a ? s | 128 : s) & 255;
      if (n.push(c), !a)
        return;
    }
    let r = e4 >>> 28 & 15 | (t & 7) << 4, o = !!(t >> 3);
    if (n.push((o ? r | 128 : r) & 255), !!o) {
      for (let i = 3; i < 31; i = i + 7) {
        let s = t >>> i, a = !!(s >>> 7), c = (a ? s | 128 : s) & 255;
        if (n.push(c), !a)
          return;
      }
      n.push(t >>> 31 & 1);
    }
  }
  var ie = 4294967296;
  function He(e4) {
    let t = e4[0] === "-";
    t && (e4 = e4.slice(1));
    let n = 1e6, r = 0, o = 0;
    function i(s, a) {
      let c = Number(e4.slice(s, a));
      o *= n, r = r * n + c, r >= ie && (o = o + (r / ie | 0), r = r % ie);
    }
    return i(-24, -18), i(-18, -12), i(-12, -6), i(-6), t ? Ut(r, o) : ze(r, o);
  }
  function Ot(e4, t) {
    let n = ze(e4, t), r = n.hi & 2147483648;
    r && (n = Ut(n.lo, n.hi));
    let o = Xe(n.lo, n.hi);
    return r ? "-" + o : o;
  }
  function Xe(e4, t) {
    if ({ lo: e4, hi: t } = Jn(e4, t), t <= 2097151)
      return String(ie * t + e4);
    let n = e4 & 16777215, r = (e4 >>> 24 | t << 8) & 16777215, o = t >> 16 & 65535, i = n + r * 6777216 + o * 6710656, s = r + o * 8147497, a = o * 2, c = 1e7;
    return i >= c && (s += Math.floor(i / c), i %= c), s >= c && (a += Math.floor(s / c), s %= c), a.toString() + Ct(s) + Ct(i);
  }
  function Jn(e4, t) {
    return { lo: e4 >>> 0, hi: t >>> 0 };
  }
  function ze(e4, t) {
    return { lo: e4 | 0, hi: t | 0 };
  }
  function Ut(e4, t) {
    return t = ~t, e4 ? e4 = ~e4 + 1 : t += 1, ze(e4, t);
  }
  var Ct = (e4) => {
    let t = String(e4);
    return "0000000".slice(t.length) + t;
  };
  function Ye(e4, t) {
    if (e4 >= 0) {
      for (; e4 > 127; )
        t.push(e4 & 127 | 128), e4 = e4 >>> 7;
      t.push(e4);
    } else {
      for (let n = 0; n < 9; n++)
        t.push(e4 & 127 | 128), e4 = e4 >> 7;
      t.push(1);
    }
  }
  function Rt() {
    let e4 = this.buf[this.pos++], t = e4 & 127;
    if (!(e4 & 128))
      return this.assertBounds(), t;
    if (e4 = this.buf[this.pos++], t |= (e4 & 127) << 7, !(e4 & 128))
      return this.assertBounds(), t;
    if (e4 = this.buf[this.pos++], t |= (e4 & 127) << 14, !(e4 & 128))
      return this.assertBounds(), t;
    if (e4 = this.buf[this.pos++], t |= (e4 & 127) << 21, !(e4 & 128))
      return this.assertBounds(), t;
    e4 = this.buf[this.pos++], t |= (e4 & 15) << 28;
    for (let n = 5; e4 & 128 && n < 10; n++)
      e4 = this.buf[this.pos++];
    if (e4 & 128)
      throw new Error("invalid varint");
    return this.assertBounds(), t >>> 0;
  }
  function Mn() {
    let e4 = new DataView(new ArrayBuffer(8));
    if (typeof BigInt == "function" && typeof e4.getBigInt64 == "function" && typeof e4.getBigUint64 == "function" && typeof e4.setBigInt64 == "function" && typeof e4.setBigUint64 == "function" && (typeof process != "object" || typeof process.env != "object" || {}.BUF_BIGINT_DISABLE !== "1")) {
      let o = BigInt("-9223372036854775808"), i = BigInt("9223372036854775807"), s = BigInt("0"), a = BigInt("18446744073709551615");
      return { zero: BigInt(0), supported: true, parse(c) {
        let l = typeof c == "bigint" ? c : BigInt(c);
        if (l > i || l < o)
          throw new Error(`int64 invalid: ${c}`);
        return l;
      }, uParse(c) {
        let l = typeof c == "bigint" ? c : BigInt(c);
        if (l > a || l < s)
          throw new Error(`uint64 invalid: ${c}`);
        return l;
      }, enc(c) {
        return e4.setBigInt64(0, this.parse(c), true), { lo: e4.getInt32(0, true), hi: e4.getInt32(4, true) };
      }, uEnc(c) {
        return e4.setBigInt64(0, this.uParse(c), true), { lo: e4.getInt32(0, true), hi: e4.getInt32(4, true) };
      }, dec(c, l) {
        return e4.setInt32(0, c, true), e4.setInt32(4, l, true), e4.getBigInt64(0, true);
      }, uDec(c, l) {
        return e4.setInt32(0, c, true), e4.setInt32(4, l, true), e4.getBigUint64(0, true);
      } };
    }
    let n = (o) => N(/^-?[0-9]+$/.test(o), `int64 invalid: ${o}`), r = (o) => N(/^[0-9]+$/.test(o), `uint64 invalid: ${o}`);
    return { zero: "0", supported: false, parse(o) {
      return typeof o != "string" && (o = o.toString()), n(o), o;
    }, uParse(o) {
      return typeof o != "string" && (o = o.toString()), r(o), o;
    }, enc(o) {
      return typeof o != "string" && (o = o.toString()), n(o), He(o);
    }, uEnc(o) {
      return typeof o != "string" && (o = o.toString()), r(o), He(o);
    }, dec(o, i) {
      return Ot(o, i);
    }, uDec(o, i) {
      return Xe(o, i);
    } };
  }
  var x = Mn();
  var A;
  (function(e4) {
    e4[e4.Varint = 0] = "Varint", e4[e4.Bit64 = 1] = "Bit64", e4[e4.LengthDelimited = 2] = "LengthDelimited", e4[e4.StartGroup = 3] = "StartGroup", e4[e4.EndGroup = 4] = "EndGroup", e4[e4.Bit32 = 5] = "Bit32";
  })(A || (A = {}));
  var ae = class {
    constructor(t) {
      this.stack = [], this.textEncoder = t != null ? t : new TextEncoder(), this.chunks = [], this.buf = [];
    }
    finish() {
      this.chunks.push(new Uint8Array(this.buf));
      let t = 0;
      for (let o = 0; o < this.chunks.length; o++)
        t += this.chunks[o].length;
      let n = new Uint8Array(t), r = 0;
      for (let o = 0; o < this.chunks.length; o++)
        n.set(this.chunks[o], r), r += this.chunks[o].length;
      return this.chunks = [], n;
    }
    fork() {
      return this.stack.push({ chunks: this.chunks, buf: this.buf }), this.chunks = [], this.buf = [], this;
    }
    join() {
      let t = this.finish(), n = this.stack.pop();
      if (!n)
        throw new Error("invalid state, fork stack empty");
      return this.chunks = n.chunks, this.buf = n.buf, this.uint32(t.byteLength), this.raw(t);
    }
    tag(t, n) {
      return this.uint32((t << 3 | n) >>> 0);
    }
    raw(t) {
      return this.buf.length && (this.chunks.push(new Uint8Array(this.buf)), this.buf = []), this.chunks.push(t), this;
    }
    uint32(t) {
      for (j(t); t > 127; )
        this.buf.push(t & 127 | 128), t = t >>> 7;
      return this.buf.push(t), this;
    }
    int32(t) {
      return L(t), Ye(t, this.buf), this;
    }
    bool(t) {
      return this.buf.push(t ? 1 : 0), this;
    }
    bytes(t) {
      return this.uint32(t.byteLength), this.raw(t);
    }
    string(t) {
      let n = this.textEncoder.encode(t);
      return this.uint32(n.byteLength), this.raw(n);
    }
    float(t) {
      oe(t);
      let n = new Uint8Array(4);
      return new DataView(n.buffer).setFloat32(0, t, true), this.raw(n);
    }
    double(t) {
      let n = new Uint8Array(8);
      return new DataView(n.buffer).setFloat64(0, t, true), this.raw(n);
    }
    fixed32(t) {
      j(t);
      let n = new Uint8Array(4);
      return new DataView(n.buffer).setUint32(0, t, true), this.raw(n);
    }
    sfixed32(t) {
      L(t);
      let n = new Uint8Array(4);
      return new DataView(n.buffer).setInt32(0, t, true), this.raw(n);
    }
    sint32(t) {
      return L(t), t = (t << 1 ^ t >> 31) >>> 0, Ye(t, this.buf), this;
    }
    sfixed64(t) {
      let n = new Uint8Array(8), r = new DataView(n.buffer), o = x.enc(t);
      return r.setInt32(0, o.lo, true), r.setInt32(4, o.hi, true), this.raw(n);
    }
    fixed64(t) {
      let n = new Uint8Array(8), r = new DataView(n.buffer), o = x.uEnc(t);
      return r.setInt32(0, o.lo, true), r.setInt32(4, o.hi, true), this.raw(n);
    }
    int64(t) {
      let n = x.enc(t);
      return se(n.lo, n.hi, this.buf), this;
    }
    sint64(t) {
      let n = x.enc(t), r = n.hi >> 31, o = n.lo << 1 ^ r, i = (n.hi << 1 | n.lo >>> 31) ^ r;
      return se(o, i, this.buf), this;
    }
    uint64(t) {
      let n = x.uEnc(t);
      return se(n.lo, n.hi, this.buf), this;
    }
  }, ce = class {
    constructor(t, n) {
      this.varint64 = kt, this.uint32 = Rt, this.buf = t, this.len = t.length, this.pos = 0, this.view = new DataView(t.buffer, t.byteOffset, t.byteLength), this.textDecoder = n != null ? n : new TextDecoder();
    }
    tag() {
      let t = this.uint32(), n = t >>> 3, r = t & 7;
      if (n <= 0 || r < 0 || r > 5)
        throw new Error("illegal tag: field no " + n + " wire type " + r);
      return [n, r];
    }
    skip(t) {
      let n = this.pos;
      switch (t) {
        case A.Varint:
          for (; this.buf[this.pos++] & 128; )
            ;
          break;
        case A.Bit64:
          this.pos += 4;
        case A.Bit32:
          this.pos += 4;
          break;
        case A.LengthDelimited:
          let r = this.uint32();
          this.pos += r;
          break;
        case A.StartGroup:
          let o;
          for (; (o = this.tag()[1]) !== A.EndGroup; )
            this.skip(o);
          break;
        default:
          throw new Error("cant skip wire type " + t);
      }
      return this.assertBounds(), this.buf.subarray(n, this.pos);
    }
    assertBounds() {
      if (this.pos > this.len)
        throw new RangeError("premature EOF");
    }
    int32() {
      return this.uint32() | 0;
    }
    sint32() {
      let t = this.uint32();
      return t >>> 1 ^ -(t & 1);
    }
    int64() {
      return x.dec(...this.varint64());
    }
    uint64() {
      return x.uDec(...this.varint64());
    }
    sint64() {
      let [t, n] = this.varint64(), r = -(t & 1);
      return t = (t >>> 1 | (n & 1) << 31) ^ r, n = n >>> 1 ^ r, x.dec(t, n);
    }
    bool() {
      let [t, n] = this.varint64();
      return t !== 0 || n !== 0;
    }
    fixed32() {
      return this.view.getUint32((this.pos += 4) - 4, true);
    }
    sfixed32() {
      return this.view.getInt32((this.pos += 4) - 4, true);
    }
    fixed64() {
      return x.uDec(this.sfixed32(), this.sfixed32());
    }
    sfixed64() {
      return x.dec(this.sfixed32(), this.sfixed32());
    }
    float() {
      return this.view.getFloat32((this.pos += 4) - 4, true);
    }
    double() {
      return this.view.getFloat64((this.pos += 8) - 8, true);
    }
    bytes() {
      let t = this.uint32(), n = this.pos;
      return this.pos += t, this.assertBounds(), this.buf.subarray(n, n + t);
    }
    string() {
      return this.textDecoder.decode(this.bytes());
    }
  };
  function H(e4, t) {
    return t instanceof w || !e4.fieldWrapper ? t : e4.fieldWrapper.wrapField(t);
  }
  ({ "google.protobuf.DoubleValue": f.DOUBLE, "google.protobuf.FloatValue": f.FLOAT, "google.protobuf.Int64Value": f.INT64, "google.protobuf.UInt64Value": f.UINT64, "google.protobuf.Int32Value": f.INT32, "google.protobuf.UInt32Value": f.UINT32, "google.protobuf.BoolValue": f.BOOL, "google.protobuf.StringValue": f.STRING, "google.protobuf.BytesValue": f.BYTES });
  function F(e4, t, n) {
    if (t === n)
      return true;
    if (e4 == f.BYTES) {
      if (!(t instanceof Uint8Array) || !(n instanceof Uint8Array) || t.length !== n.length)
        return false;
      for (let r = 0; r < t.length; r++)
        if (t[r] !== n[r])
          return false;
      return true;
    }
    switch (e4) {
      case f.UINT64:
      case f.FIXED64:
      case f.INT64:
      case f.SFIXED64:
      case f.SINT64:
        return t == n;
    }
    return false;
  }
  function X(e4, t) {
    switch (e4) {
      case f.BOOL:
        return false;
      case f.UINT64:
      case f.FIXED64:
      case f.INT64:
      case f.SFIXED64:
      case f.SINT64:
        return t == 0 ? x.zero : "0";
      case f.DOUBLE:
      case f.FLOAT:
        return 0;
      case f.BYTES:
        return new Uint8Array(0);
      case f.STRING:
        return "";
      default:
        return 0;
    }
  }
  function Ke(e4, t) {
    let n = t === void 0, r = A.Varint, o = t === 0;
    switch (e4) {
      case f.STRING:
        o = n || !t.length, r = A.LengthDelimited;
        break;
      case f.BOOL:
        o = t === false;
        break;
      case f.DOUBLE:
        r = A.Bit64;
        break;
      case f.FLOAT:
        r = A.Bit32;
        break;
      case f.INT64:
        o = n || t == 0;
        break;
      case f.UINT64:
        o = n || t == 0;
        break;
      case f.FIXED64:
        o = n || t == 0, r = A.Bit64;
        break;
      case f.BYTES:
        o = n || !t.byteLength, r = A.LengthDelimited;
        break;
      case f.FIXED32:
        r = A.Bit32;
        break;
      case f.SFIXED32:
        r = A.Bit32;
        break;
      case f.SFIXED64:
        o = n || t == 0, r = A.Bit64;
        break;
      case f.SINT64:
        o = n || t == 0;
        break;
    }
    let i = f[e4].toLowerCase();
    return [r, i, n || o];
  }
  var D = Symbol("@bufbuild/protobuf/unknown-fields"), Ft = { readUnknownFields: true, readerFactory: (e4) => new ce(e4) }, _t = { writeUnknownFields: true, writerFactory: () => new ae() };
  function Gn(e4) {
    return e4 ? Object.assign(Object.assign({}, Ft), e4) : Ft;
  }
  function Bn(e4) {
    return e4 ? Object.assign(Object.assign({}, _t), e4) : _t;
  }
  function Jt() {
    return { makeReadOptions: Gn, makeWriteOptions: Bn, listUnknownFields(e4) {
      var t;
      return (t = e4[D]) !== null && t !== void 0 ? t : [];
    }, discardUnknownFields(e4) {
      delete e4[D];
    }, writeUnknownFields(e4, t) {
      let r = e4[D];
      if (r)
        for (let o of r)
          t.tag(o.no, o.wireType).raw(o.data);
    }, onUnknownField(e4, t, n, r) {
      let o = e4;
      Array.isArray(o[D]) || (o[D] = []), o[D].push({ no: t, wireType: n, data: r });
    }, readMessage(e4, t, n, r) {
      let o = e4.getType(), i = n === void 0 ? t.len : t.pos + n;
      for (; t.pos < i; ) {
        let [s, a] = t.tag(), c = o.fields.find(s);
        if (!c) {
          let m = t.skip(a);
          r.readUnknownFields && this.onUnknownField(e4, s, a, m);
          continue;
        }
        let l = e4, h = c.repeated, y = c.localName;
        switch (c.oneof && (l = l[c.oneof.localName], l.case != y && delete l.value, l.case = y, y = "value"), c.kind) {
          case "scalar":
          case "enum":
            let m = c.kind == "enum" ? f.INT32 : c.T, p = ue;
            if (c.kind == "scalar" && c.L > 0 && (p = Dn), h) {
              let v = l[y];
              if (a == A.LengthDelimited && m != f.STRING && m != f.BYTES) {
                let T = t.uint32() + t.pos;
                for (; t.pos < T; )
                  v.push(p(t, m));
              } else
                v.push(p(t, m));
            } else
              l[y] = p(t, m);
            break;
          case "message":
            let g = c.T;
            h ? l[y].push(le(t, new g(), r)) : l[y] instanceof w ? le(t, l[y], r) : (l[y] = le(t, new g(), r), g.fieldWrapper && !c.oneof && !c.repeated && (l[y] = g.fieldWrapper.unwrapField(l[y])));
            break;
          case "map":
            let [b, I] = Ln(c, t, r);
            l[y][b] = I;
            break;
        }
      }
    } };
  }
  function le(e4, t, n) {
    return t.getType().runtime.bin.readMessage(t, e4, e4.uint32(), n), t;
  }
  function Ln(e4, t, n) {
    let r = t.uint32(), o = t.pos + r, i, s;
    for (; t.pos < o; ) {
      let [a] = t.tag();
      switch (a) {
        case 1:
          i = ue(t, e4.K);
          break;
        case 2:
          switch (e4.V.kind) {
            case "scalar":
              s = ue(t, e4.V.T);
              break;
            case "enum":
              s = t.int32();
              break;
            case "message":
              s = le(t, new e4.V.T(), n);
              break;
          }
          break;
      }
    }
    if (i === void 0) {
      let a = X(e4.K, R.BIGINT);
      i = e4.K == f.BOOL ? a.toString() : a;
    }
    if (typeof i != "string" && typeof i != "number" && (i = i.toString()), s === void 0)
      switch (e4.V.kind) {
        case "scalar":
          s = X(e4.V.T, R.BIGINT);
          break;
        case "enum":
          s = 0;
          break;
        case "message":
          s = new e4.V.T();
          break;
      }
    return [i, s];
  }
  function Dn(e4, t) {
    let n = ue(e4, t);
    return typeof n == "bigint" ? n.toString() : n;
  }
  function ue(e4, t) {
    switch (t) {
      case f.STRING:
        return e4.string();
      case f.BOOL:
        return e4.bool();
      case f.DOUBLE:
        return e4.double();
      case f.FLOAT:
        return e4.float();
      case f.INT32:
        return e4.int32();
      case f.INT64:
        return e4.int64();
      case f.UINT64:
        return e4.uint64();
      case f.FIXED64:
        return e4.fixed64();
      case f.BYTES:
        return e4.bytes();
      case f.FIXED32:
        return e4.fixed32();
      case f.SFIXED32:
        return e4.sfixed32();
      case f.SFIXED64:
        return e4.sfixed64();
      case f.SINT64:
        return e4.sint64();
      case f.UINT32:
        return e4.uint32();
      case f.SINT32:
        return e4.sint32();
    }
  }
  function Mt(e4, t, n, r, o) {
    e4.tag(n.no, A.LengthDelimited), e4.fork();
    let i = r;
    switch (n.K) {
      case f.INT32:
      case f.FIXED32:
      case f.UINT32:
      case f.SFIXED32:
      case f.SINT32:
        i = Number.parseInt(r);
        break;
      case f.BOOL:
        N(r == "true" || r == "false"), i = r == "true";
        break;
    }
    switch (V(e4, n.K, 1, i, true), n.V.kind) {
      case "scalar":
        V(e4, n.V.T, 2, o, true);
        break;
      case "enum":
        V(e4, f.INT32, 2, o, true);
        break;
      case "message":
        fe(e4, t, n.V.T, 2, o);
        break;
    }
    e4.join();
  }
  function fe(e4, t, n, r, o) {
    if (o !== void 0) {
      let i = H(n, o);
      e4.tag(r, A.LengthDelimited).bytes(i.toBinary(t));
    }
  }
  function V(e4, t, n, r, o) {
    let [i, s, a] = Ke(t, r);
    (!a || o) && e4.tag(n, i)[s](r);
  }
  function Gt(e4, t, n, r) {
    if (!r.length)
      return;
    e4.tag(n, A.LengthDelimited).fork();
    let [, o] = Ke(t);
    for (let i = 0; i < r.length; i++)
      e4[o](r[i]);
    e4.join();
  }
  function Bt() {
    return Object.assign(Object.assign({}, Jt()), { writeMessage(e4, t, n) {
      let r = e4.getType();
      for (let o of r.fields.byNumber()) {
        let i, s = o.repeated, a = o.localName;
        if (o.oneof) {
          let c = e4[o.oneof.localName];
          if (c.case !== a)
            continue;
          i = c.value;
        } else
          i = e4[a];
        switch (o.kind) {
          case "scalar":
          case "enum":
            let c = o.kind == "enum" ? f.INT32 : o.T;
            if (s)
              if (o.packed)
                Gt(t, c, o.no, i);
              else
                for (let l of i)
                  V(t, c, o.no, l, true);
            else
              i !== void 0 && V(t, c, o.no, i, !!o.oneof || o.opt);
            break;
          case "message":
            if (s)
              for (let l of i)
                fe(t, n, o.T, o.no, l);
            else
              fe(t, n, o.T, o.no, i);
            break;
          case "map":
            for (let [l, h] of Object.entries(i))
              Mt(t, n, o, l, h);
            break;
        }
      }
      return n.writeUnknownFields && this.writeUnknownFields(e4, t), t;
    } });
  }
  var _$2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), me = [];
  for (let e4 = 0; e4 < _$2.length; e4++)
    me[_$2[e4].charCodeAt(0)] = e4;
  me[45] = _$2.indexOf("+");
  me[95] = _$2.indexOf("/");
  var J = { dec(e4) {
    let t = e4.length * 3 / 4;
    e4[e4.length - 2] == "=" ? t -= 2 : e4[e4.length - 1] == "=" && (t -= 1);
    let n = new Uint8Array(t), r = 0, o = 0, i, s = 0;
    for (let a = 0; a < e4.length; a++) {
      if (i = me[e4.charCodeAt(a)], i === void 0)
        switch (e4[a]) {
          case "=":
            o = 0;
          case `
`:
          case "\r":
          case "	":
          case " ":
            continue;
          default:
            throw Error("invalid base64 string.");
        }
      switch (o) {
        case 0:
          s = i, o = 1;
          break;
        case 1:
          n[r++] = s << 2 | (i & 48) >> 4, s = i, o = 2;
          break;
        case 2:
          n[r++] = (s & 15) << 4 | (i & 60) >> 2, s = i, o = 3;
          break;
        case 3:
          n[r++] = (s & 3) << 6 | i, o = 0;
          break;
      }
    }
    if (o == 1)
      throw Error("invalid base64 string.");
    return n.subarray(0, r);
  }, enc(e4) {
    let t = "", n = 0, r, o = 0;
    for (let i = 0; i < e4.length; i++)
      switch (r = e4[i], n) {
        case 0:
          t += _$2[r >> 2], o = (r & 3) << 4, n = 1;
          break;
        case 1:
          t += _$2[o | r >> 4], o = (r & 15) << 2, n = 2;
          break;
        case 2:
          t += _$2[o | r >> 6], t += _$2[r & 63], n = 0;
          break;
      }
    return n && (t += _$2[o], t += "=", n == 1 && (t += "=")), t;
  } };
  var Lt = { ignoreUnknownFields: false }, Dt = { emitDefaultValues: false, enumAsInteger: false, useProtoFieldName: false, prettySpaces: 0 };
  function Vn(e4) {
    return e4 ? Object.assign(Object.assign({}, Lt), e4) : Lt;
  }
  function qn(e4) {
    return e4 ? Object.assign(Object.assign({}, Dt), e4) : Dt;
  }
  function qt(e4) {
    let t = e4($n, Vt);
    return { makeReadOptions: Vn, makeWriteOptions: qn, readMessage(n, r, o, i) {
      if (r == null || Array.isArray(r) || typeof r != "object")
        throw new Error(`cannot decode message ${n.typeName} from JSON: ${this.debug(r)}`);
      i = i != null ? i : new n();
      let s = {};
      for (let [a, c] of Object.entries(r)) {
        let l = n.fields.findJsonName(a);
        if (!l) {
          if (!o.ignoreUnknownFields)
            throw new Error(`cannot decode message ${n.typeName} from JSON: key "${a}" is unknown`);
          continue;
        }
        let h = l.localName, y = i;
        if (l.oneof) {
          if (c === null && l.kind == "scalar")
            continue;
          let m = s[l.oneof.localName];
          if (m)
            throw new Error(`cannot decode message ${n.typeName} from JSON: multiple keys for oneof "${l.oneof.name}" present: "${m}", "${a}"`);
          s[l.oneof.localName] = a, y = y[l.oneof.localName] = { case: h }, h = "value";
        }
        if (l.repeated) {
          if (c === null)
            continue;
          if (!Array.isArray(c))
            throw new Error(`cannot decode field ${n.typeName}.${l.name} from JSON: ${this.debug(c)}`);
          let m = y[h];
          for (let p of c) {
            if (p === null)
              throw new Error(`cannot decode field ${n.typeName}.${l.name} from JSON: ${this.debug(p)}`);
            let g;
            switch (l.kind) {
              case "message":
                g = l.T.fromJson(p, o);
                break;
              case "enum":
                if (g = We(l.T, p, o.ignoreUnknownFields), g === void 0)
                  continue;
                break;
              case "scalar":
                try {
                  g = z(l.T, p, l.L);
                } catch (b) {
                  let I = `cannot decode field ${n.typeName}.${l.name} from JSON: ${this.debug(p)}`;
                  throw b instanceof Error && b.message.length > 0 && (I += `: ${b.message}`), new Error(I);
                }
                break;
            }
            m.push(g);
          }
        } else if (l.kind == "map") {
          if (c === null)
            continue;
          if (Array.isArray(c) || typeof c != "object")
            throw new Error(`cannot decode field ${n.typeName}.${l.name} from JSON: ${this.debug(c)}`);
          let m = y[h];
          for (let [p, g] of Object.entries(c)) {
            if (g === null)
              throw new Error(`cannot decode field ${n.typeName}.${l.name} from JSON: map value null`);
            let b;
            switch (l.V.kind) {
              case "message":
                b = l.V.T.fromJson(g, o);
                break;
              case "enum":
                if (b = We(l.V.T, g, o.ignoreUnknownFields), b === void 0)
                  continue;
                break;
              case "scalar":
                try {
                  b = z(l.V.T, g, R.BIGINT);
                } catch (I) {
                  let v = `cannot decode map value for field ${n.typeName}.${l.name} from JSON: ${this.debug(c)}`;
                  throw I instanceof Error && I.message.length > 0 && (v += `: ${I.message}`), new Error(v);
                }
                break;
            }
            try {
              m[z(l.K, l.K == f.BOOL ? p == "true" ? true : p == "false" ? false : p : p, R.BIGINT).toString()] = b;
            } catch (I) {
              let v = `cannot decode map key for field ${n.typeName}.${l.name} from JSON: ${this.debug(c)}`;
              throw I instanceof Error && I.message.length > 0 && (v += `: ${I.message}`), new Error(v);
            }
          }
        } else
          switch (l.kind) {
            case "message":
              let m = l.T;
              if (c === null && m.typeName != "google.protobuf.Value") {
                if (l.oneof)
                  throw new Error(`cannot decode field ${n.typeName}.${l.name} from JSON: null is invalid for oneof field "${a}"`);
                continue;
              }
              y[h] instanceof w ? y[h].fromJson(c, o) : (y[h] = m.fromJson(c, o), m.fieldWrapper && !l.oneof && (y[h] = m.fieldWrapper.unwrapField(y[h])));
              break;
            case "enum":
              let p = We(l.T, c, o.ignoreUnknownFields);
              p !== void 0 && (y[h] = p);
              break;
            case "scalar":
              try {
                y[h] = z(l.T, c, l.L);
              } catch (g) {
                let b = `cannot decode field ${n.typeName}.${l.name} from JSON: ${this.debug(c)}`;
                throw g instanceof Error && g.message.length > 0 && (b += `: ${g.message}`), new Error(b);
              }
              break;
          }
      }
      return i;
    }, writeMessage(n, r) {
      let o = n.getType(), i = {}, s;
      try {
        for (let a of o.fields.byMember()) {
          let c;
          if (a.kind == "oneof") {
            let l = n[a.localName];
            if (l.value === void 0)
              continue;
            if (s = a.findField(l.case), !s)
              throw "oneof case not found: " + l.case;
            c = t(s, l.value, r);
          } else
            s = a, c = t(s, n[s.localName], r);
          c !== void 0 && (i[r.useProtoFieldName ? s.name : s.jsonName] = c);
        }
      } catch (a) {
        let c = s ? `cannot encode field ${o.typeName}.${s.name} to JSON` : `cannot encode message ${o.typeName} to JSON`, l = a instanceof Error ? a.message : String(a);
        throw new Error(c + (l.length > 0 ? `: ${l}` : ""));
      }
      return i;
    }, readScalar: z, writeScalar: Vt, debug: $t };
  }
  function $t(e4) {
    if (e4 === null)
      return "null";
    switch (typeof e4) {
      case "object":
        return Array.isArray(e4) ? "array" : "object";
      case "string":
        return e4.length > 100 ? "string" : `"${e4.split('"').join('\\"')}"`;
      default:
        return String(e4);
    }
  }
  function z(e4, t, n) {
    switch (e4) {
      case f.DOUBLE:
      case f.FLOAT:
        if (t === null)
          return 0;
        if (t === "NaN")
          return Number.NaN;
        if (t === "Infinity")
          return Number.POSITIVE_INFINITY;
        if (t === "-Infinity")
          return Number.NEGATIVE_INFINITY;
        if (t === "" || typeof t == "string" && t.trim().length !== t.length || typeof t != "string" && typeof t != "number")
          break;
        let r = Number(t);
        if (Number.isNaN(r) || !Number.isFinite(r))
          break;
        return e4 == f.FLOAT && oe(r), r;
      case f.INT32:
      case f.FIXED32:
      case f.SFIXED32:
      case f.SINT32:
      case f.UINT32:
        if (t === null)
          return 0;
        let o;
        if (typeof t == "number" ? o = t : typeof t == "string" && t.length > 0 && t.trim().length === t.length && (o = Number(t)), o === void 0)
          break;
        return e4 == f.UINT32 ? j(o) : L(o), o;
      case f.INT64:
      case f.SFIXED64:
      case f.SINT64:
        if (t === null)
          return x.zero;
        if (typeof t != "number" && typeof t != "string")
          break;
        let i = x.parse(t);
        return n ? i.toString() : i;
      case f.FIXED64:
      case f.UINT64:
        if (t === null)
          return x.zero;
        if (typeof t != "number" && typeof t != "string")
          break;
        let s = x.uParse(t);
        return n ? s.toString() : s;
      case f.BOOL:
        if (t === null)
          return false;
        if (typeof t != "boolean")
          break;
        return t;
      case f.STRING:
        if (t === null)
          return "";
        if (typeof t != "string")
          break;
        try {
          encodeURIComponent(t);
        } catch {
          throw new Error("invalid UTF8");
        }
        return t;
      case f.BYTES:
        if (t === null || t === "")
          return new Uint8Array(0);
        if (typeof t != "string")
          break;
        return J.dec(t);
    }
    throw new Error();
  }
  function We(e4, t, n) {
    if (t === null)
      return 0;
    switch (typeof t) {
      case "number":
        if (Number.isInteger(t))
          return t;
        break;
      case "string":
        let r = e4.findName(t);
        if (r || n)
          return r == null ? void 0 : r.no;
        break;
    }
    throw new Error(`cannot decode enum ${e4.typeName} from JSON: ${$t(t)}`);
  }
  function $n(e4, t, n, r) {
    var o;
    if (t === void 0)
      return t;
    if (t === 0 && !n)
      return;
    if (r)
      return t;
    if (e4.typeName == "google.protobuf.NullValue")
      return null;
    let i = e4.findNumber(t);
    return (o = i == null ? void 0 : i.name) !== null && o !== void 0 ? o : t;
  }
  function Vt(e4, t, n) {
    if (t !== void 0)
      switch (e4) {
        case f.INT32:
        case f.SFIXED32:
        case f.SINT32:
        case f.FIXED32:
        case f.UINT32:
          return N(typeof t == "number"), t != 0 || n ? t : void 0;
        case f.FLOAT:
        case f.DOUBLE:
          return N(typeof t == "number"), Number.isNaN(t) ? "NaN" : t === Number.POSITIVE_INFINITY ? "Infinity" : t === Number.NEGATIVE_INFINITY ? "-Infinity" : t !== 0 || n ? t : void 0;
        case f.STRING:
          return N(typeof t == "string"), t.length > 0 || n ? t : void 0;
        case f.BOOL:
          return N(typeof t == "boolean"), t || n ? t : void 0;
        case f.UINT64:
        case f.FIXED64:
        case f.INT64:
        case f.SFIXED64:
        case f.SINT64:
          return N(typeof t == "bigint" || typeof t == "string" || typeof t == "number"), n || t != 0 ? t.toString(10) : void 0;
        case f.BYTES:
          return N(t instanceof Uint8Array), n || t.byteLength > 0 ? J.enc(t) : void 0;
      }
  }
  function jt() {
    return qt((e4, t) => function(r, o, i) {
      if (r.kind == "map") {
        let s = {};
        switch (r.V.kind) {
          case "scalar":
            for (let [c, l] of Object.entries(o)) {
              let h = t(r.V.T, l, true);
              N(h !== void 0), s[c.toString()] = h;
            }
            break;
          case "message":
            for (let [c, l] of Object.entries(o))
              s[c.toString()] = l.toJson(i);
            break;
          case "enum":
            let a = r.V.T;
            for (let [c, l] of Object.entries(o)) {
              N(l === void 0 || typeof l == "number");
              let h = e4(a, l, true, i.enumAsInteger);
              N(h !== void 0), s[c.toString()] = h;
            }
            break;
        }
        return i.emitDefaultValues || Object.keys(s).length > 0 ? s : void 0;
      } else if (r.repeated) {
        let s = [];
        switch (r.kind) {
          case "scalar":
            for (let a = 0; a < o.length; a++)
              s.push(t(r.T, o[a], true));
            break;
          case "enum":
            for (let a = 0; a < o.length; a++)
              s.push(e4(r.T, o[a], true, i.enumAsInteger));
            break;
          case "message":
            for (let a = 0; a < o.length; a++)
              s.push(H(r.T, o[a]).toJson(i));
            break;
        }
        return i.emitDefaultValues || s.length > 0 ? s : void 0;
      } else
        switch (r.kind) {
          case "scalar":
            return t(r.T, o, !!r.oneof || r.opt || i.emitDefaultValues);
          case "enum":
            return e4(r.T, o, !!r.oneof || r.opt || i.emitDefaultValues, i.enumAsInteger);
          case "message":
            return o !== void 0 ? H(r.T, o).toJson(i) : void 0;
        }
    });
  }
  function Ht() {
    return { setEnumType: $e, initPartial(e4, t) {
      if (e4 === void 0)
        return;
      let n = t.getType();
      for (let r of n.fields.byMember()) {
        let o = r.localName, i = t, s = e4;
        if (s[o] !== void 0)
          switch (r.kind) {
            case "oneof":
              let a = s[o].case;
              if (a === void 0)
                continue;
              let c = r.findField(a), l = s[o].value;
              c && c.kind == "message" && !(l instanceof c.T) ? l = new c.T(l) : c && c.kind === "scalar" && c.T === f.BYTES && (l = Y(l)), i[o] = { case: a, value: l };
              break;
            case "scalar":
            case "enum":
              let h = s[o];
              r.T === f.BYTES && (h = r.repeated ? h.map(Y) : Y(h)), i[o] = h;
              break;
            case "map":
              switch (r.V.kind) {
                case "scalar":
                case "enum":
                  if (r.V.T === f.BYTES)
                    for (let [p, g] of Object.entries(s[o]))
                      i[o][p] = Y(g);
                  else
                    Object.assign(i[o], s[o]);
                  break;
                case "message":
                  let m = r.V.T;
                  for (let p of Object.keys(s[o])) {
                    let g = s[o][p];
                    m.fieldWrapper || (g = new m(g)), i[o][p] = g;
                  }
                  break;
              }
              break;
            case "message":
              let y = r.T;
              if (r.repeated)
                i[o] = s[o].map((m) => m instanceof y ? m : new y(m));
              else if (s[o] !== void 0) {
                let m = s[o];
                y.fieldWrapper ? y.typeName === "google.protobuf.BytesValue" ? i[o] = Y(m) : i[o] = m : i[o] = m instanceof y ? m : new y(m);
              }
              break;
          }
      }
    }, equals(e4, t, n) {
      return t === n ? true : !t || !n ? false : e4.fields.byMember().every((r) => {
        let o = t[r.localName], i = n[r.localName];
        if (r.repeated) {
          if (o.length !== i.length)
            return false;
          switch (r.kind) {
            case "message":
              return o.every((s, a) => r.T.equals(s, i[a]));
            case "scalar":
              return o.every((s, a) => F(r.T, s, i[a]));
            case "enum":
              return o.every((s, a) => F(f.INT32, s, i[a]));
          }
          throw new Error(`repeated cannot contain ${r.kind}`);
        }
        switch (r.kind) {
          case "message":
            return r.T.equals(o, i);
          case "enum":
            return F(f.INT32, o, i);
          case "scalar":
            return F(r.T, o, i);
          case "oneof":
            if (o.case !== i.case)
              return false;
            let s = r.findField(o.case);
            if (s === void 0)
              return true;
            switch (s.kind) {
              case "message":
                return s.T.equals(o.value, i.value);
              case "enum":
                return F(f.INT32, o.value, i.value);
              case "scalar":
                return F(s.T, o.value, i.value);
            }
            throw new Error(`oneof cannot contain ${s.kind}`);
          case "map":
            let a = Object.keys(o).concat(Object.keys(i));
            switch (r.V.kind) {
              case "message":
                let c = r.V.T;
                return a.every((h) => c.equals(o[h], i[h]));
              case "enum":
                return a.every((h) => F(f.INT32, o[h], i[h]));
              case "scalar":
                let l = r.V.T;
                return a.every((h) => F(l, o[h], i[h]));
            }
            break;
        }
      });
    }, clone(e4) {
      let t = e4.getType(), n = new t(), r = n;
      for (let o of t.fields.byMember()) {
        let i = e4[o.localName], s;
        if (o.repeated)
          s = i.map(de);
        else if (o.kind == "map") {
          s = r[o.localName];
          for (let [a, c] of Object.entries(i))
            s[a] = de(c);
        } else
          o.kind == "oneof" ? s = o.findField(i.case) ? { case: i.case, value: de(i.value) } : { case: void 0 } : s = de(i);
        r[o.localName] = s;
      }
      return n;
    } };
  }
  function de(e4) {
    if (e4 === void 0)
      return e4;
    if (e4 instanceof w)
      return e4.clone();
    if (e4 instanceof Uint8Array) {
      let t = new Uint8Array(e4.byteLength);
      return t.set(e4), t;
    }
    return e4;
  }
  function Y(e4) {
    return e4 instanceof Uint8Array ? e4 : new Uint8Array(e4);
  }
  var pe = class {
    constructor(t, n) {
      this._fields = t, this._normalizer = n;
    }
    findJsonName(t) {
      if (!this.jsonNames) {
        let n = {};
        for (let r of this.list())
          n[r.jsonName] = n[r.name] = r;
        this.jsonNames = n;
      }
      return this.jsonNames[t];
    }
    find(t) {
      if (!this.numbers) {
        let n = {};
        for (let r of this.list())
          n[r.no] = r;
        this.numbers = n;
      }
      return this.numbers[t];
    }
    list() {
      return this.all || (this.all = this._normalizer(this._fields)), this.all;
    }
    byNumber() {
      return this.numbersAsc || (this.numbersAsc = this.list().concat().sort((t, n) => t.no - n.no)), this.numbersAsc;
    }
    byMember() {
      if (!this.members) {
        this.members = [];
        let t = this.members, n;
        for (let r of this.list())
          r.oneof ? r.oneof !== n && (n = r.oneof, t.push(n)) : t.push(r);
      }
      return this.members;
    }
  };
  function Qe(e4, t) {
    let n = Yt(e4);
    return t ? n : zn(Xn(n));
  }
  function Xt(e4) {
    return Qe(e4, false);
  }
  var zt = Yt;
  function Yt(e4) {
    let t = false, n = [];
    for (let r = 0; r < e4.length; r++) {
      let o = e4.charAt(r);
      switch (o) {
        case "_":
          t = true;
          break;
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          n.push(o), t = false;
          break;
        default:
          t && (t = false, o = o.toUpperCase()), n.push(o);
          break;
      }
    }
    return n.join("");
  }
  var jn = /* @__PURE__ */ new Set(["constructor", "toString", "toJSON", "valueOf"]), Hn = /* @__PURE__ */ new Set(["getType", "clone", "equals", "fromBinary", "fromJson", "fromJsonString", "toBinary", "toJson", "toJsonString", "toObject"]), Kt = (e4) => `${e4}$`, Xn = (e4) => Hn.has(e4) ? Kt(e4) : e4, zn = (e4) => jn.has(e4) ? Kt(e4) : e4;
  var he = class {
    constructor(t) {
      this.kind = "oneof", this.repeated = false, this.packed = false, this.opt = false, this.default = void 0, this.fields = [], this.name = t, this.localName = Xt(t);
    }
    addField(t) {
      N(t.oneof === this, `field ${t.name} not one of ${this.name}`), this.fields.push(t);
    }
    findField(t) {
      if (!this._lookup) {
        this._lookup = /* @__PURE__ */ Object.create(null);
        for (let n = 0; n < this.fields.length; n++)
          this._lookup[this.fields[n].localName] = this.fields[n];
      }
      return this._lookup[t];
    }
  };
  var d = vt("proto3", jt(), Bt(), Object.assign(Object.assign({}, Ht()), { newFieldList(e4) {
    return new pe(e4, Yn);
  }, initFields(e4) {
    for (let t of e4.getType().fields.byMember()) {
      if (t.opt)
        continue;
      let n = t.localName, r = e4;
      if (t.repeated) {
        r[n] = [];
        continue;
      }
      switch (t.kind) {
        case "oneof":
          r[n] = { case: void 0 };
          break;
        case "enum":
          r[n] = 0;
          break;
        case "map":
          r[n] = {};
          break;
        case "scalar":
          r[n] = X(t.T, t.L);
          break;
      }
    }
  } }));
  function Yn(e4) {
    var t, n, r, o;
    let i = [], s;
    for (let a of typeof e4 == "function" ? e4() : e4) {
      let c = a;
      if (c.localName = Qe(a.name, a.oneof !== void 0), c.jsonName = (t = a.jsonName) !== null && t !== void 0 ? t : zt(a.name), c.repeated = (n = a.repeated) !== null && n !== void 0 ? n : false, a.kind == "scalar" && (c.L = (r = a.L) !== null && r !== void 0 ? r : R.BIGINT), c.packed = (o = a.packed) !== null && o !== void 0 ? o : a.kind == "enum" || a.kind == "scalar" && a.T != f.BYTES && a.T != f.STRING, a.oneof !== void 0) {
        let l = typeof a.oneof == "string" ? a.oneof : a.oneof.name;
        (!s || s.name != l) && (s = new he(l)), c.oneof = s, s.addField(c);
      }
      i.push(c);
    }
    return i;
  }
  var P;
  (function(e4) {
    e4[e4.Unary = 0] = "Unary", e4[e4.ServerStreaming = 1] = "ServerStreaming", e4[e4.ClientStreaming = 2] = "ClientStreaming", e4[e4.BiDiStreaming = 3] = "BiDiStreaming";
  })(P || (P = {}));
  var K;
  (function(e4) {
    e4[e4.NoSideEffects = 1] = "NoSideEffects", e4[e4.Idempotent = 2] = "Idempotent";
  })(K || (K = {}));
  function W(e4) {
    let t = E[e4];
    return typeof t != "string" ? e4.toString() : t[0].toLowerCase() + t.substring(1).replace(/[A-Z]/g, (n) => "_" + n.toLowerCase());
  }
  var ye;
  function Wt(e4) {
    if (!ye) {
      ye = {};
      for (let t of Object.values(E))
        typeof t != "string" && (ye[W(t)] = t);
    }
    return ye[e4];
  }
  var S = class e extends Error {
    constructor(t, n = E.Unknown, r, o, i) {
      super(Kn(t, n)), this.name = "ConnectError", Object.setPrototypeOf(this, new.target.prototype), this.rawMessage = t, this.code = n, this.metadata = new Headers(r != null ? r : {}), this.details = o != null ? o : [], this.cause = i;
    }
    static from(t, n = E.Unknown) {
      return t instanceof e ? t : t instanceof Error ? t.name == "AbortError" ? new e(t.message, E.Canceled) : new e(t.message, n, void 0, void 0, t) : new e(String(t), n, void 0, void 0, t);
    }
    findDetails(t) {
      let n = "typeName" in t ? { findMessage: (o) => o === t.typeName ? t : void 0 } : t, r = [];
      for (let o of this.details) {
        if (o instanceof w) {
          n.findMessage(o.getType().typeName) && r.push(o);
          continue;
        }
        let i = n.findMessage(o.type);
        if (i)
          try {
            r.push(i.fromBinary(o.value));
          } catch {
          }
      }
      return r;
    }
  };
  function Kn(e4, t) {
    return e4.length ? `[${W(t)}] ${e4}` : `[${W(t)}]`;
  }
  function Ze(...e4) {
    let t = new Headers();
    for (let n of e4)
      n.forEach((r, o) => {
        t.append(o, r);
      });
    return t;
  }
  function Qt(e4, t) {
    let n = {};
    for (let [r, o] of Object.entries(e4.methods)) {
      let i = t(Object.assign(Object.assign({}, o), { localName: r, service: e4 }));
      i != null && (n[r] = i);
    }
    return n;
  }
  function et(e4) {
    let t, n = new Uint8Array(0);
    function r(o) {
      let i = new Uint8Array(n.length + o.length);
      i.set(n), i.set(o, n.length), n = i;
    }
    return new ReadableStream({ start() {
      t = e4.getReader();
    }, async pull(o) {
      let i;
      for (; ; ) {
        if (i === void 0 && n.byteLength >= 5) {
          let c = 0;
          for (let l = 1; l < 5; l++)
            c = (c << 8) + n[l];
          i = { flags: n[0], length: c };
        }
        if (i !== void 0 && n.byteLength >= i.length + 5)
          break;
        let a = await t.read();
        if (a.done)
          break;
        r(a.value);
      }
      if (i === void 0) {
        if (n.byteLength == 0) {
          o.close();
          return;
        }
        o.error(new S("premature end of stream", E.DataLoss));
        return;
      }
      let s = n.subarray(5, 5 + i.length);
      n = n.subarray(5 + i.length), o.enqueue({ flags: i.flags, data: s });
    } });
  }
  function tt(e4, t) {
    let n = new Uint8Array(t.length + 5);
    n.set(t, 5);
    let r = new DataView(n.buffer, n.byteOffset, n.byteLength);
    return r.setUint8(0, e4), r.setUint32(1, t.length), n;
  }
  var Wn = function(e4) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e4[Symbol.asyncIterator], n;
    return t ? t.call(e4) : (e4 = typeof __values == "function" ? __values(e4) : e4[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
      return this;
    }, n);
    function r(i) {
      n[i] = e4[i] && function(s) {
        return new Promise(function(a, c) {
          s = e4[i](s), o(a, c, s.done, s.value);
        });
      };
    }
    function o(i, s, a, c) {
      Promise.resolve(c).then(function(l) {
        i({ value: l, done: a });
      }, s);
    }
  }, Q = function(e4) {
    return this instanceof Q ? (this.v = e4, this) : new Q(e4);
  }, Qn = function(e4, t, n) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e4, t || []), o, i = [];
    return o = {}, s("next"), s("throw"), s("return"), o[Symbol.asyncIterator] = function() {
      return this;
    }, o;
    function s(m) {
      r[m] && (o[m] = function(p) {
        return new Promise(function(g, b) {
          i.push([m, p, g, b]) > 1 || a(m, p);
        });
      });
    }
    function a(m, p) {
      try {
        c(r[m](p));
      } catch (g) {
        y(i[0][3], g);
      }
    }
    function c(m) {
      m.value instanceof Q ? Promise.resolve(m.value.v).then(l, h) : y(i[0][2], m);
    }
    function l(m) {
      a("next", m);
    }
    function h(m) {
      a("throw", m);
    }
    function y(m, p) {
      m(p), i.shift(), i.length && a(i[0][0], i[0][1]);
    }
  }, Zn = function(e4) {
    var t, n;
    return t = {}, r("next"), r("throw", function(o) {
      throw o;
    }), r("return"), t[Symbol.iterator] = function() {
      return this;
    }, t;
    function r(o, i) {
      t[o] = e4[o] ? function(s) {
        return (n = !n) ? { value: Q(e4[o](s)), done: false } : i ? i(s) : s;
      } : i;
    }
  };
  function Zt(e4) {
    return Qn(this, arguments, function* () {
      yield Q(yield* Zn(Wn(e4)));
    });
  }
  var en = function(e4) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e4[Symbol.asyncIterator], n;
    return t ? t.call(e4) : (e4 = typeof __values == "function" ? __values(e4) : e4[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
      return this;
    }, n);
    function r(i) {
      n[i] = e4[i] && function(s) {
        return new Promise(function(a, c) {
          s = e4[i](s), o(a, c, s.done, s.value);
        });
      };
    }
    function o(i, s, a, c) {
      Promise.resolve(c).then(function(l) {
        i({ value: l, done: a });
      }, s);
    }
  }, q = function(e4) {
    return this instanceof q ? (this.v = e4, this) : new q(e4);
  }, er = function(e4) {
    var t, n;
    return t = {}, r("next"), r("throw", function(o) {
      throw o;
    }), r("return"), t[Symbol.iterator] = function() {
      return this;
    }, t;
    function r(o, i) {
      t[o] = e4[o] ? function(s) {
        return (n = !n) ? { value: q(e4[o](s)), done: false } : i ? i(s) : s;
      } : i;
    }
  }, tr = function(e4, t, n) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e4, t || []), o, i = [];
    return o = {}, s("next"), s("throw"), s("return"), o[Symbol.asyncIterator] = function() {
      return this;
    }, o;
    function s(m) {
      r[m] && (o[m] = function(p) {
        return new Promise(function(g, b) {
          i.push([m, p, g, b]) > 1 || a(m, p);
        });
      });
    }
    function a(m, p) {
      try {
        c(r[m](p));
      } catch (g) {
        y(i[0][3], g);
      }
    }
    function c(m) {
      m.value instanceof q ? Promise.resolve(m.value.v).then(l, h) : y(i[0][2], m);
    }
    function l(m) {
      a("next", m);
    }
    function h(m) {
      a("throw", m);
    }
    function y(m, p) {
      m(p), i.shift(), i.length && a(i[0][0], i[0][1]);
    }
  };
  function nt(e4, t) {
    return Qt(e4, (n) => {
      switch (n.kind) {
        case P.Unary:
          return nr(t, e4, n);
        case P.ServerStreaming:
          return rr(t, e4, n);
        case P.ClientStreaming:
          return or(t, e4, n);
        case P.BiDiStreaming:
          return ir(t, e4, n);
        default:
          return null;
      }
    });
  }
  function nr(e4, t, n) {
    return async function(r, o) {
      var i, s;
      let a = await e4.unary(t, n, o == null ? void 0 : o.signal, o == null ? void 0 : o.timeoutMs, o == null ? void 0 : o.headers, r, o == null ? void 0 : o.contextValues);
      return (i = o == null ? void 0 : o.onHeader) === null || i === void 0 || i.call(o, a.header), (s = o == null ? void 0 : o.onTrailer) === null || s === void 0 || s.call(o, a.trailer), a.message;
    };
  }
  function rr(e4, t, n) {
    return function(r, o) {
      return tn(e4.stream(t, n, o == null ? void 0 : o.signal, o == null ? void 0 : o.timeoutMs, o == null ? void 0 : o.headers, Zt([r]), o == null ? void 0 : o.contextValues), o);
    };
  }
  function or(e4, t, n) {
    return async function(r, o) {
      var i, s, a, c, l, h;
      let y = await e4.stream(t, n, o == null ? void 0 : o.signal, o == null ? void 0 : o.timeoutMs, o == null ? void 0 : o.headers, r, o == null ? void 0 : o.contextValues);
      (l = o == null ? void 0 : o.onHeader) === null || l === void 0 || l.call(o, y.header);
      let m;
      try {
        for (var p = true, g = en(y.message), b; b = await g.next(), i = b.done, !i; p = true)
          c = b.value, p = false, m = c;
      } catch (I) {
        s = { error: I };
      } finally {
        try {
          !p && !i && (a = g.return) && await a.call(g);
        } finally {
          if (s)
            throw s.error;
        }
      }
      if (!m)
        throw new S("protocol error: missing response message", E.Internal);
      return (h = o == null ? void 0 : o.onTrailer) === null || h === void 0 || h.call(o, y.trailer), m;
    };
  }
  function ir(e4, t, n) {
    return function(r, o) {
      return tn(e4.stream(t, n, o == null ? void 0 : o.signal, o == null ? void 0 : o.timeoutMs, o == null ? void 0 : o.headers, r, o == null ? void 0 : o.contextValues), o);
    };
  }
  function tn(e4, t) {
    let n = function() {
      var r, o;
      return tr(this, arguments, function* () {
        let i = yield q(e4);
        (r = t == null ? void 0 : t.onHeader) === null || r === void 0 || r.call(t, i.header), yield q(yield* er(en(i.message))), (o = t == null ? void 0 : t.onTrailer) === null || o === void 0 || o.call(t, i.trailer);
      });
    }()[Symbol.asyncIterator]();
    return { [Symbol.asyncIterator]: () => ({ next: () => n.next() }) };
  }
  function nn(...e4) {
    let t = new AbortController(), n = e4.filter((o) => o !== void 0).concat(t.signal);
    for (let o of n) {
      if (o.aborted) {
        r.apply(o);
        break;
      }
      o.addEventListener("abort", r);
    }
    function r() {
      t.signal.aborted || t.abort(rt(this));
      for (let o of n)
        o.removeEventListener("abort", r);
    }
    return t;
  }
  function rn(e4) {
    let t = new AbortController(), n = () => {
      t.abort(new S("the operation timed out", E.DeadlineExceeded));
    }, r;
    return e4 !== void 0 && (e4 <= 0 ? n() : r = setTimeout(n, e4)), { signal: t.signal, cleanup: () => clearTimeout(r) };
  }
  function rt(e4) {
    if (!e4.aborted)
      return;
    if (e4.reason !== void 0)
      return e4.reason;
    let t = new Error("This operation was aborted");
    return t.name = "AbortError", t;
  }
  function ge() {
    return { get(e4) {
      return e4.id in this ? this[e4.id] : e4.defaultValue;
    }, set(e4, t) {
      return this[e4.id] = t, this;
    }, delete(e4) {
      return delete this[e4.id], this;
    } };
  }
  function be(e4, t, n) {
    let r = typeof t == "string" ? t : t.typeName, o = typeof n == "string" ? n : n.name;
    return e4.toString().replace(/\/?$/, `/${r}/${o}`);
  }
  function ot(e4, t) {
    return t instanceof w ? t : new e4(t);
  }
  function on(e4, t) {
    function n(r) {
      return r.done === true ? r : { done: r.done, value: ot(e4, r.value) };
    }
    return { [Symbol.asyncIterator]() {
      let r = t[Symbol.asyncIterator](), o = { next: () => r.next().then(n) };
      return r.throw !== void 0 && (o.throw = (i) => r.throw(i).then(n)), r.return !== void 0 && (o.return = (i) => r.return(i).then(n)), o;
    } };
  }
  function Ee(e4) {
    var t;
    let n = Object.assign({}, e4);
    return (t = n.ignoreUnknownFields) !== null && t !== void 0 || (n.ignoreUnknownFields = true), n;
  }
  function we(e4, t, n, r) {
    let o = t ? sn(e4.I, r) : an(e4.I, n);
    return { parse: (t ? sn(e4.O, r) : an(e4.O, n)).parse, serialize: o.serialize };
  }
  function sn(e4, t) {
    return { parse(n) {
      try {
        return e4.fromBinary(n, t);
      } catch (r) {
        let o = r instanceof Error ? r.message : String(r);
        throw new S(`parse binary: ${o}`, E.InvalidArgument);
      }
    }, serialize(n) {
      try {
        return n.toBinary(t);
      } catch (r) {
        let o = r instanceof Error ? r.message : String(r);
        throw new S(`serialize binary: ${o}`, E.Internal);
      }
    } };
  }
  function an(e4, t) {
    var n, r;
    let o = (n = t == null ? void 0 : t.textEncoder) !== null && n !== void 0 ? n : new TextEncoder(), i = (r = t == null ? void 0 : t.textDecoder) !== null && r !== void 0 ? r : new TextDecoder(), s = Ee(t);
    return { parse(a) {
      try {
        let c = i.decode(a);
        return e4.fromJsonString(c, s);
      } catch (c) {
        throw S.from(c, E.InvalidArgument);
      }
    }, serialize(a) {
      try {
        let c = a.toJsonString(s);
        return o.encode(c);
      } catch (c) {
        throw S.from(c, E.Internal);
      }
    } };
  }
  var sr = /^application\/(connect\+)?(?:(json)(?:; ?charset=utf-?8)?|(proto))$/i;
  var cn = "application/proto", ln = "application/json", un = "application/connect+proto", fn = "application/connect+json";
  function mn(e4) {
    let t = e4 == null ? void 0 : e4.match(sr);
    if (!t)
      return;
    let n = !!t[1], r = !!t[3];
    return { stream: n, binary: r };
  }
  function Z(e4, t, n) {
    if (t && new Headers(t).forEach((s, a) => n.metadata.append(a, s)), typeof e4 != "object" || e4 == null || Array.isArray(e4) || !("code" in e4) || typeof e4.code != "string")
      throw n;
    let r = Wt(e4.code);
    if (r === void 0)
      throw n;
    let o = e4.message;
    if (o != null && typeof o != "string")
      throw n;
    let i = new S(o != null ? o : "", r, t);
    if ("details" in e4 && Array.isArray(e4.details))
      for (let s of e4.details) {
        if (s === null || typeof s != "object" || Array.isArray(s) || typeof s.type != "string" || typeof s.value != "string" || "debug" in s && typeof s.debug != "object")
          throw n;
        try {
          i.details.push({ type: s.type, value: J.dec(s.value), debug: s.debug });
        } catch {
          throw n;
        }
      }
    return i;
  }
  var xe = 2;
  function it(e4) {
    let t = new S("invalid end stream", E.InvalidArgument), n;
    try {
      n = JSON.parse(typeof e4 == "string" ? e4 : new TextDecoder().decode(e4));
    } catch {
      throw t;
    }
    if (typeof n != "object" || n == null || Array.isArray(n))
      throw t;
    let r = new Headers();
    if ("metadata" in n) {
      if (typeof n.metadata != "object" || n.metadata == null || Array.isArray(n.metadata))
        throw t;
      for (let [i, s] of Object.entries(n.metadata)) {
        if (!Array.isArray(s) || s.some((a) => typeof a != "string"))
          throw t;
        for (let a of s)
          r.append(i, a);
      }
    }
    let o = "error" in n ? Z(n.error, r, t) : void 0;
    return { metadata: r, error: o };
  }
  var ee = "Content-Type", dn = "Content-Length", Ie = "Content-Encoding";
  var st = "Accept-Encoding";
  var pn = "Connect-Timeout-Ms", Te = "Connect-Protocol-Version", hn = "User-Agent";
  function yn(e4) {
    switch (e4) {
      case 400:
        return E.InvalidArgument;
      case 401:
        return E.Unauthenticated;
      case 403:
        return E.PermissionDenied;
      case 404:
        return E.Unimplemented;
      case 408:
        return E.DeadlineExceeded;
      case 409:
        return E.Aborted;
      case 412:
        return E.FailedPrecondition;
      case 413:
        return E.ResourceExhausted;
      case 415:
        return E.Internal;
      case 429:
        return E.Unavailable;
      case 431:
        return E.ResourceExhausted;
      case 502:
        return E.Unavailable;
      case 503:
        return E.Unavailable;
      case 504:
        return E.Unavailable;
      default:
        return E.Unknown;
    }
  }
  function Se(e4) {
    let t = new Headers(), n = new Headers();
    return e4.forEach((r, o) => {
      o.toLowerCase().startsWith("trailer-") ? n.set(o.substring(8), r) : t.set(o, r);
    }), [t, n];
  }
  var Ae = "1";
  function Ne(e4, t, n, r) {
    let o = new Headers(r != null ? r : {});
    return n !== void 0 && o.set(pn, `${n}`), o.set(ee, e4 == P.Unary ? t ? cn : ln : t ? un : fn), o.set(Te, Ae), o.set(hn, "connect-es/1.1.3"), o;
  }
  function Pe(e4, t, n) {
    let r = n.get("Content-Type"), o = mn(r);
    if (t !== 200) {
      let i = new S(`HTTP ${t}`, yn(t), n);
      if (e4 == P.Unary && o && !o.binary)
        return { isUnaryError: true, unaryError: i };
      throw i;
    }
    return { isUnaryError: false };
  }
  var gn = "application/";
  function cr(e4, t) {
    return t ? J.enc(e4).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : encodeURIComponent(new TextDecoder().decode(e4));
  }
  function at(e4, t, n) {
    let r = `?connect=v${Ae}`, o = e4.header.get(ee);
    (o == null ? void 0 : o.indexOf(gn)) === 0 && (r += "&encoding=" + encodeURIComponent(o.slice(gn.length)));
    let i = e4.header.get(Ie);
    i !== null && i !== "identity" && (r += "&compression=" + encodeURIComponent(i), n = true), n && (r += "&base64=1"), r += "&message=" + cr(t, n);
    let s = e4.url + r, a = new Headers(e4.header);
    return [Te, ee, dn, Ie, st].forEach((c) => a.delete(c)), Object.assign(Object.assign({}, e4), { init: Object.assign(Object.assign({}, e4.init), { method: "GET" }), url: s, header: a });
  }
  function ct(e4) {
    let t = En(e4.next, e4.interceptors), [n, r, o] = bn(e4), i = Object.assign(Object.assign({}, e4.req), { message: ot(e4.req.method.I, e4.req.message), signal: n });
    return t(i).then((s) => (o(), s), r);
  }
  function lt(e4) {
    let t = En(e4.next, e4.interceptors), [n, r, o] = bn(e4), i = Object.assign(Object.assign({}, e4.req), { message: on(e4.req.method.I, e4.req.message), signal: n }), s = false;
    return n.addEventListener("abort", function() {
      var a, c;
      let l = e4.req.message[Symbol.asyncIterator]();
      s || (a = l.throw) === null || a === void 0 || a.call(l, this.reason).catch(() => {
      }), (c = l.return) === null || c === void 0 || c.call(l).catch(() => {
      });
    }), t(i).then((a) => Object.assign(Object.assign({}, a), { message: { [Symbol.asyncIterator]() {
      let c = a.message[Symbol.asyncIterator]();
      return { next() {
        return c.next().then((l) => (l.done == true && (s = true, o()), l), r);
      } };
    } } }), r);
  }
  function bn(e4) {
    let { signal: t, cleanup: n } = rn(e4.timeoutMs), r = nn(e4.signal, t);
    return [r.signal, function(i) {
      let s = S.from(t.aborted ? rt(t) : i);
      return r.abort(s), n(), Promise.reject(s);
    }, function() {
      n(), r.abort();
    }];
  }
  function En(e4, t) {
    var n;
    return (n = t == null ? void 0 : t.concat().reverse().reduce((r, o) => o(r), e4)) !== null && n !== void 0 ? n : e4;
  }
  var ke = ((n) => (n[n.UNSPECIFIED = 0] = "UNSPECIFIED", n[n.JUPYTER_FORMAT = 77] = "JUPYTER_FORMAT", n))(ke || {});
  d.util.setEnumType(ke, "exa.codeium_common_pb.ExperimentKey", [{ no: 0, name: "UNSPECIFIED" }, { no: 77, name: "JUPYTER_FORMAT" }]);
  var ut = ((t) => (t[t.CODEIUM = 0] = "CODEIUM", t))(ut || {});
  d.util.setEnumType(ut, "exa.codeium_common_pb.AuthSource", [{ no: 0, name: "AUTH_SOURCE_CODEIUM" }]);
  var ft = ((i) => (i[i.UNSPECIFIED = 0] = "UNSPECIFIED", i[i.ENABLE_CODEIUM = 1] = "ENABLE_CODEIUM", i[i.DISABLE_CODEIUM = 2] = "DISABLE_CODEIUM", i[i.SHOW_PREVIOUS_COMPLETION = 3] = "SHOW_PREVIOUS_COMPLETION", i[i.SHOW_NEXT_COMPLETION = 4] = "SHOW_NEXT_COMPLETION", i))(ft || {});
  d.util.setEnumType(ft, "exa.codeium_common_pb.EventType", [{ no: 0, name: "EVENT_TYPE_UNSPECIFIED" }, { no: 1, name: "EVENT_TYPE_ENABLE_CODEIUM" }, { no: 2, name: "EVENT_TYPE_DISABLE_CODEIUM" }, { no: 3, name: "EVENT_TYPE_SHOW_PREVIOUS_COMPLETION" }, { no: 4, name: "EVENT_TYPE_SHOW_NEXT_COMPLETION" }]);
  var Oe = ((o) => (o[o.UNSPECIFIED = 0] = "UNSPECIFIED", o[o.TYPING_AS_SUGGESTED = 1] = "TYPING_AS_SUGGESTED", o[o.CACHE = 2] = "CACHE", o[o.NETWORK = 3] = "NETWORK", o))(Oe || {});
  d.util.setEnumType(Oe, "exa.codeium_common_pb.CompletionSource", [{ no: 0, name: "COMPLETION_SOURCE_UNSPECIFIED" }, { no: 1, name: "COMPLETION_SOURCE_TYPING_AS_SUGGESTED" }, { no: 2, name: "COMPLETION_SOURCE_CACHE" }, { no: 3, name: "COMPLETION_SOURCE_NETWORK" }]);
  var $ = ((u) => (u[u.UNSPECIFIED = 0] = "UNSPECIFIED", u[u.C = 1] = "C", u[u.CLOJURE = 2] = "CLOJURE", u[u.COFFEESCRIPT = 3] = "COFFEESCRIPT", u[u.CPP = 4] = "CPP", u[u.CSHARP = 5] = "CSHARP", u[u.CSS = 6] = "CSS", u[u.CUDACPP = 7] = "CUDACPP", u[u.DOCKERFILE = 8] = "DOCKERFILE", u[u.GO = 9] = "GO", u[u.GROOVY = 10] = "GROOVY", u[u.HANDLEBARS = 11] = "HANDLEBARS", u[u.HASKELL = 12] = "HASKELL", u[u.HCL = 13] = "HCL", u[u.HTML = 14] = "HTML", u[u.INI = 15] = "INI", u[u.JAVA = 16] = "JAVA", u[u.JAVASCRIPT = 17] = "JAVASCRIPT", u[u.JSON = 18] = "JSON", u[u.JULIA = 19] = "JULIA", u[u.KOTLIN = 20] = "KOTLIN", u[u.LATEX = 21] = "LATEX", u[u.LESS = 22] = "LESS", u[u.LUA = 23] = "LUA", u[u.MAKEFILE = 24] = "MAKEFILE", u[u.MARKDOWN = 25] = "MARKDOWN", u[u.OBJECTIVEC = 26] = "OBJECTIVEC", u[u.OBJECTIVECPP = 27] = "OBJECTIVECPP", u[u.PERL = 28] = "PERL", u[u.PHP = 29] = "PHP", u[u.PLAINTEXT = 30] = "PLAINTEXT", u[u.PROTOBUF = 31] = "PROTOBUF", u[u.PBTXT = 32] = "PBTXT", u[u.PYTHON = 33] = "PYTHON", u[u.R = 34] = "R", u[u.RUBY = 35] = "RUBY", u[u.RUST = 36] = "RUST", u[u.SASS = 37] = "SASS", u[u.SCALA = 38] = "SCALA", u[u.SCSS = 39] = "SCSS", u[u.SHELL = 40] = "SHELL", u[u.SQL = 41] = "SQL", u[u.STARLARK = 42] = "STARLARK", u[u.SWIFT = 43] = "SWIFT", u[u.TSX = 44] = "TSX", u[u.TYPESCRIPT = 45] = "TYPESCRIPT", u[u.VISUALBASIC = 46] = "VISUALBASIC", u[u.VUE = 47] = "VUE", u[u.XML = 48] = "XML", u[u.XSL = 49] = "XSL", u[u.YAML = 50] = "YAML", u[u.SVELTE = 51] = "SVELTE", u[u.TOML = 52] = "TOML", u[u.DART = 53] = "DART", u[u.RST = 54] = "RST", u[u.OCAML = 55] = "OCAML", u[u.CMAKE = 56] = "CMAKE", u[u.PASCAL = 57] = "PASCAL", u[u.ELIXIR = 58] = "ELIXIR", u[u.FSHARP = 59] = "FSHARP", u[u.LISP = 60] = "LISP", u[u.MATLAB = 61] = "MATLAB", u[u.POWERSHELL = 62] = "POWERSHELL", u[u.SOLIDITY = 63] = "SOLIDITY", u[u.ADA = 64] = "ADA", u[u.OCAML_INTERFACE = 65] = "OCAML_INTERFACE", u))($ || {});
  d.util.setEnumType($, "exa.codeium_common_pb.Language", [{ no: 0, name: "LANGUAGE_UNSPECIFIED" }, { no: 1, name: "LANGUAGE_C" }, { no: 2, name: "LANGUAGE_CLOJURE" }, { no: 3, name: "LANGUAGE_COFFEESCRIPT" }, { no: 4, name: "LANGUAGE_CPP" }, { no: 5, name: "LANGUAGE_CSHARP" }, { no: 6, name: "LANGUAGE_CSS" }, { no: 7, name: "LANGUAGE_CUDACPP" }, { no: 8, name: "LANGUAGE_DOCKERFILE" }, { no: 9, name: "LANGUAGE_GO" }, { no: 10, name: "LANGUAGE_GROOVY" }, { no: 11, name: "LANGUAGE_HANDLEBARS" }, { no: 12, name: "LANGUAGE_HASKELL" }, { no: 13, name: "LANGUAGE_HCL" }, { no: 14, name: "LANGUAGE_HTML" }, { no: 15, name: "LANGUAGE_INI" }, { no: 16, name: "LANGUAGE_JAVA" }, { no: 17, name: "LANGUAGE_JAVASCRIPT" }, { no: 18, name: "LANGUAGE_JSON" }, { no: 19, name: "LANGUAGE_JULIA" }, { no: 20, name: "LANGUAGE_KOTLIN" }, { no: 21, name: "LANGUAGE_LATEX" }, { no: 22, name: "LANGUAGE_LESS" }, { no: 23, name: "LANGUAGE_LUA" }, { no: 24, name: "LANGUAGE_MAKEFILE" }, { no: 25, name: "LANGUAGE_MARKDOWN" }, { no: 26, name: "LANGUAGE_OBJECTIVEC" }, { no: 27, name: "LANGUAGE_OBJECTIVECPP" }, { no: 28, name: "LANGUAGE_PERL" }, { no: 29, name: "LANGUAGE_PHP" }, { no: 30, name: "LANGUAGE_PLAINTEXT" }, { no: 31, name: "LANGUAGE_PROTOBUF" }, { no: 32, name: "LANGUAGE_PBTXT" }, { no: 33, name: "LANGUAGE_PYTHON" }, { no: 34, name: "LANGUAGE_R" }, { no: 35, name: "LANGUAGE_RUBY" }, { no: 36, name: "LANGUAGE_RUST" }, { no: 37, name: "LANGUAGE_SASS" }, { no: 38, name: "LANGUAGE_SCALA" }, { no: 39, name: "LANGUAGE_SCSS" }, { no: 40, name: "LANGUAGE_SHELL" }, { no: 41, name: "LANGUAGE_SQL" }, { no: 42, name: "LANGUAGE_STARLARK" }, { no: 43, name: "LANGUAGE_SWIFT" }, { no: 44, name: "LANGUAGE_TSX" }, { no: 45, name: "LANGUAGE_TYPESCRIPT" }, { no: 46, name: "LANGUAGE_VISUALBASIC" }, { no: 47, name: "LANGUAGE_VUE" }, { no: 48, name: "LANGUAGE_XML" }, { no: 49, name: "LANGUAGE_XSL" }, { no: 50, name: "LANGUAGE_YAML" }, { no: 51, name: "LANGUAGE_SVELTE" }, { no: 52, name: "LANGUAGE_TOML" }, { no: 53, name: "LANGUAGE_DART" }, { no: 54, name: "LANGUAGE_RST" }, { no: 55, name: "LANGUAGE_OCAML" }, { no: 56, name: "LANGUAGE_CMAKE" }, { no: 57, name: "LANGUAGE_PASCAL" }, { no: 58, name: "LANGUAGE_ELIXIR" }, { no: 59, name: "LANGUAGE_FSHARP" }, { no: 60, name: "LANGUAGE_LISP" }, { no: 61, name: "LANGUAGE_MATLAB" }, { no: 62, name: "LANGUAGE_POWERSHELL" }, { no: 63, name: "LANGUAGE_SOLIDITY" }, { no: 64, name: "LANGUAGE_ADA" }, { no: 65, name: "LANGUAGE_OCAML_INTERFACE" }]);
  var ve = (_a = class extends w {
    constructor(n) {
      super();
      this.completionId = "";
      this.text = "";
      this.prefix = "";
      this.stop = "";
      this.score = 0;
      this.tokens = [];
      this.decodedTokens = [];
      this.probabilities = [];
      this.adjustedProbabilities = [];
      this.generatedLength = x.zero;
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _a().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _a().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _a().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_a, n, r);
    }
  }, (() => {
    _a.runtime = d;
  })(), (() => {
    _a.typeName = "exa.codeium_common_pb.Completion";
  })(), (() => {
    _a.fields = d.util.newFieldList(() => [{ no: 1, name: "completion_id", kind: "scalar", T: 9 }, { no: 2, name: "text", kind: "scalar", T: 9 }, { no: 3, name: "prefix", kind: "scalar", T: 9 }, { no: 4, name: "stop", kind: "scalar", T: 9 }, { no: 5, name: "score", kind: "scalar", T: 1 }, { no: 6, name: "tokens", kind: "scalar", T: 4, repeated: true }, { no: 7, name: "decoded_tokens", kind: "scalar", T: 9, repeated: true }, { no: 8, name: "probabilities", kind: "scalar", T: 1, repeated: true }, { no: 9, name: "adjusted_probabilities", kind: "scalar", T: 1, repeated: true }, { no: 10, name: "generated_length", kind: "scalar", T: 4 }]);
  })(), _a), G = (_b = class extends w {
    constructor(n) {
      super();
      this.ideName = "";
      this.ideVersion = "";
      this.extensionName = "";
      this.extensionVersion = "";
      this.apiKey = "";
      this.locale = "";
      this.sessionId = "";
      this.requestId = x.zero;
      this.userAgent = "";
      this.url = "";
      this.authSource = 0;
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _b().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _b().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _b().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_b, n, r);
    }
  }, (() => {
    _b.runtime = d;
  })(), (() => {
    _b.typeName = "exa.codeium_common_pb.Metadata";
  })(), (() => {
    _b.fields = d.util.newFieldList(() => [{ no: 1, name: "ide_name", kind: "scalar", T: 9 }, { no: 7, name: "ide_version", kind: "scalar", T: 9 }, { no: 12, name: "extension_name", kind: "scalar", T: 9 }, { no: 2, name: "extension_version", kind: "scalar", T: 9 }, { no: 3, name: "api_key", kind: "scalar", T: 9 }, { no: 4, name: "locale", kind: "scalar", T: 9 }, { no: 10, name: "session_id", kind: "scalar", T: 9 }, { no: 9, name: "request_id", kind: "scalar", T: 4 }, { no: 13, name: "user_agent", kind: "scalar", T: 9 }, { no: 14, name: "url", kind: "scalar", T: 9 }, { no: 15, name: "auth_source", kind: "enum", T: d.getEnumType(ut) }]);
  })(), _b), Ce = (_c = class extends w {
    constructor(n) {
      super();
      this.tabSize = x.zero;
      this.insertSpaces = false;
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _c().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _c().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _c().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_c, n, r);
    }
  }, (() => {
    _c.runtime = d;
  })(), (() => {
    _c.typeName = "exa.codeium_common_pb.EditorOptions";
  })(), (() => {
    _c.fields = d.util.newFieldList(() => [{ no: 1, name: "tab_size", kind: "scalar", T: 4 }, { no: 2, name: "insert_spaces", kind: "scalar", T: 8 }]);
  })(), _c);
  _d = class extends w {
    constructor(n) {
      super();
      this.eventType = 0;
      this.eventJson = "";
      this.timestampUnixMs = x.zero;
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _d().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _d().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _d().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_d, n, r);
    }
  }, (() => {
    _d.runtime = d;
  })(), (() => {
    _d.typeName = "exa.codeium_common_pb.Event";
  })(), (() => {
    _d.fields = d.util.newFieldList(() => [{ no: 1, name: "event_type", kind: "enum", T: d.getEnumType(ft) }, { no: 2, name: "event_json", kind: "scalar", T: 9 }, { no: 3, name: "timestamp_unix_ms", kind: "scalar", T: 3 }]);
  })();
  var bt = ((s) => (s[s.UNSPECIFIED = 0] = "UNSPECIFIED", s[s.INACTIVE = 1] = "INACTIVE", s[s.PROCESSING = 2] = "PROCESSING", s[s.SUCCESS = 3] = "SUCCESS", s[s.WARNING = 4] = "WARNING", s[s.ERROR = 5] = "ERROR", s))(bt || {});
  d.util.setEnumType(bt, "exa.language_server_pb.CodeiumState", [{ no: 0, name: "CODEIUM_STATE_UNSPECIFIED" }, { no: 1, name: "CODEIUM_STATE_INACTIVE" }, { no: 2, name: "CODEIUM_STATE_PROCESSING" }, { no: 3, name: "CODEIUM_STATE_SUCCESS" }, { no: 4, name: "CODEIUM_STATE_WARNING" }, { no: 5, name: "CODEIUM_STATE_ERROR" }]);
  var xn = ((r) => (r[r.UNSPECIFIED = 0] = "UNSPECIFIED", r[r.SINGLE = 1] = "SINGLE", r[r.MULTI = 2] = "MULTI", r))(xn || {});
  d.util.setEnumType(xn, "exa.language_server_pb.LineType", [{ no: 0, name: "LINE_TYPE_UNSPECIFIED" }, { no: 1, name: "LINE_TYPE_SINGLE" }, { no: 2, name: "LINE_TYPE_MULTI" }]);
  var Et = ((o) => (o[o.UNSPECIFIED = 0] = "UNSPECIFIED", o[o.INLINE = 1] = "INLINE", o[o.BLOCK = 2] = "BLOCK", o[o.INLINE_MASK = 3] = "INLINE_MASK", o))(Et || {});
  d.util.setEnumType(Et, "exa.language_server_pb.CompletionPartType", [{ no: 0, name: "COMPLETION_PART_TYPE_UNSPECIFIED" }, { no: 1, name: "COMPLETION_PART_TYPE_INLINE" }, { no: 2, name: "COMPLETION_PART_TYPE_BLOCK" }, { no: 3, name: "COMPLETION_PART_TYPE_INLINE_MASK" }]);
  var Ue = (_e2 = class extends w {
    constructor(n) {
      super();
      this.otherDocuments = [];
      this.modelName = "";
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _e2().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _e2().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _e2().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_e2, n, r);
    }
  }, (() => {
    _e2.runtime = d;
  })(), (() => {
    _e2.typeName = "exa.language_server_pb.GetCompletionsRequest";
  })(), (() => {
    _e2.fields = d.util.newFieldList(() => [{ no: 1, name: "metadata", kind: "message", T: G }, { no: 2, name: "document", kind: "message", T: M }, { no: 3, name: "editor_options", kind: "message", T: Ce }, { no: 5, name: "other_documents", kind: "message", T: M, repeated: true }, { no: 7, name: "experiment_config", kind: "message", T: mt }, { no: 10, name: "model_name", kind: "scalar", T: 9 }]);
  })(), _e2), Re = (_f = class extends w {
    constructor(n) {
      super();
      this.completionItems = [];
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _f().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _f().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _f().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_f, n, r);
    }
  }, (() => {
    _f.runtime = d;
  })(), (() => {
    _f.typeName = "exa.language_server_pb.GetCompletionsResponse";
  })(), (() => {
    _f.fields = d.util.newFieldList(() => [{ no: 1, name: "state", kind: "message", T: dt }, { no: 2, name: "completion_items", kind: "message", T: gt, repeated: true }]);
  })(), _f), Fe = (_g = class extends w {
    constructor(n) {
      super();
      this.completionId = "";
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _g().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _g().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _g().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_g, n, r);
    }
  }, (() => {
    _g.runtime = d;
  })(), (() => {
    _g.typeName = "exa.language_server_pb.AcceptCompletionRequest";
  })(), (() => {
    _g.fields = d.util.newFieldList(() => [{ no: 1, name: "metadata", kind: "message", T: G }, { no: 2, name: "completion_id", kind: "scalar", T: 9 }]);
  })(), _g), _e = (_h = class extends w {
    constructor(t) {
      super(), d.util.initPartial(t, this);
    }
    static fromBinary(t, n) {
      return new _h().fromBinary(t, n);
    }
    static fromJson(t, n) {
      return new _h().fromJson(t, n);
    }
    static fromJsonString(t, n) {
      return new _h().fromJsonString(t, n);
    }
    static equals(t, n) {
      return d.util.equals(_h, t, n);
    }
  }, (() => {
    _h.runtime = d;
  })(), (() => {
    _h.typeName = "exa.language_server_pb.AcceptCompletionResponse";
  })(), (() => {
    _h.fields = d.util.newFieldList(() => []);
  })(), _h), Je = (_i = class extends w {
    constructor(t) {
      super(), d.util.initPartial(t, this);
    }
    static fromBinary(t, n) {
      return new _i().fromBinary(t, n);
    }
    static fromJson(t, n) {
      return new _i().fromJson(t, n);
    }
    static fromJsonString(t, n) {
      return new _i().fromJsonString(t, n);
    }
    static equals(t, n) {
      return d.util.equals(_i, t, n);
    }
  }, (() => {
    _i.runtime = d;
  })(), (() => {
    _i.typeName = "exa.language_server_pb.GetAuthTokenRequest";
  })(), (() => {
    _i.fields = d.util.newFieldList(() => []);
  })(), _i), Me = (_j = class extends w {
    constructor(n) {
      super();
      this.authToken = "";
      this.uuid = "";
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _j().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _j().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _j().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_j, n, r);
    }
  }, (() => {
    _j.runtime = d;
  })(), (() => {
    _j.typeName = "exa.language_server_pb.GetAuthTokenResponse";
  })(), (() => {
    _j.fields = d.util.newFieldList(() => [{ no: 1, name: "auth_token", kind: "scalar", T: 9 }, { no: 2, name: "uuid", kind: "scalar", T: 9 }]);
  })(), _j), te = (_k = class extends w {
    constructor(n) {
      super();
      this.row = x.zero;
      this.col = x.zero;
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _k().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _k().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _k().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_k, n, r);
    }
  }, (() => {
    _k.runtime = d;
  })(), (() => {
    _k.typeName = "exa.language_server_pb.DocumentPosition";
  })(), (() => {
    _k.fields = d.util.newFieldList(() => [{ no: 1, name: "row", kind: "scalar", T: 4 }, { no: 2, name: "col", kind: "scalar", T: 4 }]);
  })(), _k), M = (_l = class extends w {
    constructor(n) {
      super();
      this.absolutePath = "";
      this.relativePath = "";
      this.text = "";
      this.editorLanguage = "";
      this.language = 0;
      this.cursorOffset = x.zero;
      this.lineEnding = "";
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _l().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _l().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _l().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_l, n, r);
    }
  }, (() => {
    _l.runtime = d;
  })(), (() => {
    _l.typeName = "exa.language_server_pb.Document";
  })(), (() => {
    _l.fields = d.util.newFieldList(() => [{ no: 1, name: "absolute_path", kind: "scalar", T: 9 }, { no: 2, name: "relative_path", kind: "scalar", T: 9 }, { no: 3, name: "text", kind: "scalar", T: 9 }, { no: 4, name: "editor_language", kind: "scalar", T: 9 }, { no: 5, name: "language", kind: "enum", T: d.getEnumType($) }, { no: 6, name: "cursor_offset", kind: "scalar", T: 4 }, { no: 8, name: "cursor_position", kind: "message", T: te }, { no: 7, name: "line_ending", kind: "scalar", T: 9 }]);
  })(), _l), mt = (_m = class extends w {
    constructor(n) {
      super();
      this.forceEnableExperiments = [];
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _m().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _m().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _m().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_m, n, r);
    }
  }, (() => {
    _m.runtime = d;
  })(), (() => {
    _m.typeName = "exa.language_server_pb.ExperimentConfig";
  })(), (() => {
    _m.fields = d.util.newFieldList(() => [{ no: 1, name: "force_enable_experiments", kind: "enum", T: d.getEnumType(ke), repeated: true }]);
  })(), _m), dt = (_n2 = class extends w {
    constructor(n) {
      super();
      this.state = 0;
      this.message = "";
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _n2().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _n2().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _n2().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_n2, n, r);
    }
  }, (() => {
    _n2.runtime = d;
  })(), (() => {
    _n2.typeName = "exa.language_server_pb.State";
  })(), (() => {
    _n2.fields = d.util.newFieldList(() => [{ no: 1, name: "state", kind: "enum", T: d.getEnumType(bt) }, { no: 2, name: "message", kind: "scalar", T: 9 }]);
  })(), _n2), pt = (_o = class extends w {
    constructor(n) {
      super();
      this.startOffset = x.zero;
      this.endOffset = x.zero;
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _o().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _o().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _o().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_o, n, r);
    }
  }, (() => {
    _o.runtime = d;
  })(), (() => {
    _o.typeName = "exa.language_server_pb.Range";
  })(), (() => {
    _o.fields = d.util.newFieldList(() => [{ no: 1, name: "start_offset", kind: "scalar", T: 4 }, { no: 2, name: "end_offset", kind: "scalar", T: 4 }, { no: 3, name: "start_position", kind: "message", T: te }, { no: 4, name: "end_position", kind: "message", T: te }]);
  })(), _o), ht = (_p = class extends w {
    constructor(n) {
      super();
      this.text = "";
      this.deltaCursorOffset = x.zero;
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _p().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _p().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _p().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_p, n, r);
    }
  }, (() => {
    _p.runtime = d;
  })(), (() => {
    _p.typeName = "exa.language_server_pb.Suffix";
  })(), (() => {
    _p.fields = d.util.newFieldList(() => [{ no: 1, name: "text", kind: "scalar", T: 9 }, { no: 2, name: "delta_cursor_offset", kind: "scalar", T: 3 }]);
  })(), _p), yt = (_q = class extends w {
    constructor(n) {
      super();
      this.text = "";
      this.offset = x.zero;
      this.type = 0;
      this.prefix = "";
      this.line = x.zero;
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _q().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _q().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _q().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_q, n, r);
    }
  }, (() => {
    _q.runtime = d;
  })(), (() => {
    _q.typeName = "exa.language_server_pb.CompletionPart";
  })(), (() => {
    _q.fields = d.util.newFieldList(() => [{ no: 1, name: "text", kind: "scalar", T: 9 }, { no: 2, name: "offset", kind: "scalar", T: 4 }, { no: 3, name: "type", kind: "enum", T: d.getEnumType(Et) }, { no: 4, name: "prefix", kind: "scalar", T: 9 }, { no: 5, name: "line", kind: "scalar", T: 4 }]);
  })(), _q), gt = (_r = class extends w {
    constructor(n) {
      super();
      this.source = 0;
      this.completionParts = [];
      d.util.initPartial(n, this);
    }
    static fromBinary(n, r) {
      return new _r().fromBinary(n, r);
    }
    static fromJson(n, r) {
      return new _r().fromJson(n, r);
    }
    static fromJsonString(n, r) {
      return new _r().fromJsonString(n, r);
    }
    static equals(n, r) {
      return d.util.equals(_r, n, r);
    }
  }, (() => {
    _r.runtime = d;
  })(), (() => {
    _r.typeName = "exa.language_server_pb.CompletionItem";
  })(), (() => {
    _r.fields = d.util.newFieldList(() => [{ no: 1, name: "completion", kind: "message", T: ve }, { no: 5, name: "suffix", kind: "message", T: ht }, { no: 2, name: "range", kind: "message", T: pt }, { no: 3, name: "source", kind: "enum", T: d.getEnumType(Oe) }, { no: 8, name: "completion_parts", kind: "message", T: yt, repeated: true }]);
  })(), _r);
  var O = class e2 {
    constructor(t, n) {
      this.line = t, this.character = n, this.lineNumber = t + 1, this.column = n + 1;
    }
    static fromMonaco(t) {
      return new e2(t.lineNumber - 1, t.column - 1);
    }
    static fromPosition(t) {
      return new e2(t.line, t.character);
    }
  }, B = class e3 {
    constructor(t, n) {
      this.start = t, this.end = n, this.startLineNumber = t.line + 1, this.startColumn = t.character + 1, this.endLineNumber = n.line + 1, this.endColumn = n.character + 1;
    }
    static fromMonaco(t) {
      return new e3(new O(t.startLineNumber - 1, t.startColumn - 1), new O(t.endLineNumber - 1, t.endColumn - 1));
    }
    static fromRange(t) {
      return new e3(t.start, t.end);
    }
  };
  var Ge = class {
    constructor(t, n) {
      this.text = t, this.range = n;
    }
  };
  var Be = class {
    constructor(t) {
      this.model = t, this.uri = t.uri, this.languageId = t.getLanguageId();
    }
    get lineCount() {
      return this.model.getLineCount();
    }
    lineAt(t) {
      return typeof t != "number" && (t = t.line), new Ge(this.model.getLineContent(t + 1), new B(new O(t, 0), new O(t, this.model.getLineLength(t + 1))));
    }
    offsetAt(t) {
      return this.model.getOffsetAt(O.fromPosition(t));
    }
    positionAt(t) {
      return O.fromMonaco(this.model.getPositionAt(t));
    }
    getText(t) {
      return t ? this.model.getValueInRange(B.fromRange(t)) : this.model.getValue();
    }
  };
  var In = () => {
    try {
      return window.location.origin;
    } catch {
      return null;
    }
  }, Tn = () => "1.0.10";
  function Sn(e4) {
    return e4 < 128 ? 1 : e4 < 2048 ? 2 : e4 < 65536 ? 3 : 4;
  }
  function An(e4, t) {
    if (t === 0)
      return 0;
    let n = 0, r = 0;
    for (let o of e4)
      if (r += o.length, n += Sn(o.codePointAt(0)), t !== void 0 && r >= t)
        break;
    return n;
  }
  function wt(e4, t) {
    if (t === 0)
      return 0;
    let n = 0, r = 0;
    for (let o of e4)
      if (r += Sn(o.codePointAt(0)), n += o.length, t !== void 0 && r >= t)
        break;
    return n;
  }
  var Nn = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e4) => {
    let t = Math.random() * 16 | 0;
    return (e4 === "x" ? t : t & 3 | 8).toString(16);
  }), Le = (e4) => {
    switch (e4.toLowerCase()) {
      case "c":
        return 1;
      case "clojure":
        return 2;
      case "coffeescript":
        return 3;
      case "cpp":
        return 4;
      case "csharp":
        return 5;
      case "css":
        return 6;
      case "cudacpp":
        return 7;
      case "dockerfile":
        return 8;
      case "go":
        return 9;
      case "groovy":
        return 10;
      case "handlebars":
        return 11;
      case "haskell":
        return 12;
      case "hcl":
        return 13;
      case "html":
        return 14;
      case "ini":
        return 15;
      case "java":
        return 16;
      case "javascript":
        return 17;
      case "json":
        return 18;
      case "julia":
        return 19;
      case "kotlin":
        return 20;
      case "latex":
        return 21;
      case "less":
        return 22;
      case "lua":
        return 23;
      case "makefile":
        return 24;
      case "markdown":
        return 25;
      case "objectivec":
        return 26;
      case "objectivecpp":
        return 27;
      case "perl":
        return 28;
      case "php":
        return 29;
      case "plaintext":
        return 30;
      case "protobuf":
        return 31;
      case "pbtxt":
        return 32;
      case "python":
        return 33;
      case "r":
        return 34;
      case "ruby":
        return 35;
      case "rust":
        return 36;
      case "sass":
        return 37;
      case "scala":
        return 38;
      case "scss":
        return 39;
      case "shell":
        return 40;
      case "sql":
        return 41;
      case "starlark":
        return 42;
      case "swift":
        return 43;
      case "tsx":
        return 44;
      case "typescript":
        return 45;
      case "visualbasic":
        return 46;
      case "vue":
        return 47;
      case "xml":
        return 48;
      case "xsl":
        return 49;
      case "yaml":
        return 50;
      case "svelte":
        return 51;
      case "toml":
        return 52;
      case "dart":
        return 53;
      case "rst":
        return 54;
      case "ocaml":
        return 55;
      case "cmake":
        return 56;
      case "pascal":
        return 57;
      case "elixir":
        return 58;
      case "fsharp":
        return 59;
      case "lisp":
        return 60;
      case "matlab":
        return 61;
      case "powershell":
        return 62;
      case "solidity":
        return 63;
      case "ada":
        return 64;
      case "ocaml_interface":
        return 65;
      default:
        return 0;
    }
  };
  var xt = class {
    constructor(t, n, r) {
      this.insertText = t, this.text = t, this.range = n, this.command = { id: "codeium.acceptCompletion", title: "Accept Completion", arguments: [r, t] };
    }
  }, ur = "d49954eb-cfba-4992-980f-d8fb37f0e942", De = class {
    constructor(t, n, r, o) {
      this.setStatus = n;
      this.setMessage = r;
      this.apiKey = o;
      this.otherDocuments = [];
      this.sessionId = `react-editor-${Nn()}`, this.client = t;
    }
    getAuthHeader() {
      let t = this.getMetadata();
      return { Authorization: `Basic ${t.apiKey}-${t.sessionId}` };
    }
    getMetadata() {
      var _a2, _b2;
      return new G({ ideName: "web", ideVersion: (_a2 = In()) != null ? _a2 : "unknown", extensionName: "@codeium/react-code-editor", extensionVersion: Tn(), apiKey: (_b2 = this.apiKey) != null ? _b2 : ur, sessionId: this.sessionId });
    }
    async provideInlineCompletions(t, n, r) {
      let o = new Be(t), i = O.fromMonaco(n);
      r.onCancellationRequested(() => {
        var _a2;
        return (_a2 = r.cancellationCallback) == null ? void 0 : _a2.call(r);
      });
      let s = new AbortController();
      r.onCancellationRequested(() => {
        s.abort();
      });
      let a = s.signal;
      this.setStatus("processing"), this.setMessage("Generating completions...");
      let c = this.getDocumentInfo(o, i), l = { tabSize: BigInt(t.getOptions().tabSize), insertSpaces: t.getOptions().insertSpaces }, h = this.otherDocuments;
      h.length > 10 && (h = h.slice(0, 10));
      let y;
      try {
        y = await this.client.getCompletions({ metadata: this.getMetadata(), document: c, editorOptions: l, otherDocuments: h }, { signal: a, headers: this.getAuthHeader() });
      } catch (b) {
        b instanceof S && b.code === E.Canceled || (this.setStatus("error"), this.setMessage("Something went wrong; please try again."));
        return;
      }
      if (!y.completionItems) {
        let b = " No completions were generated";
        this.setStatus("success"), this.setMessage(b);
        return;
      }
      let p = y.completionItems.map((b) => this.createInlineCompletionItem(b, o)).filter((b) => !!b);
      this.setStatus("success");
      let g = `Generated ${p.length} completions`;
      return p.length === 1 && (g = "Generated 1 completion"), this.setMessage(g), { items: p };
    }
    acceptedLastCompletion(t) {
      new Promise((n, r) => {
        this.client.acceptCompletion({ metadata: this.getMetadata(), completionId: t }, { headers: this.getAuthHeader() }).then(n).catch((o) => {
        });
      });
    }
    getDocumentInfo(t, n) {
      let r = t.getText(), o = t.offsetAt(n), i = An(r, o), s = Le(t.languageId);
      return new M({ text: r, editorLanguage: t.languageId, language: s, cursorOffset: BigInt(i), lineEnding: `
` });
    }
    createInlineCompletionItem(t, n) {
      if (!t.completion || !t.range)
        return;
      let r = n.getText(), o = n.positionAt(wt(r, Number(t.range.startOffset))), i = n.positionAt(wt(r, Number(t.range.endOffset))), s = new B(o, i);
      return new xt(t.completion.text, s, t.completion.completionId);
    }
  };
  var Ve = class {
    constructor(t, n, r, o, i, s) {
      this.setCompletionCount = n;
      this.getEditorDocuments = i;
      this.numCompletionsProvided = 0, this.completionProvider = new De(t, r, o, s);
    }
    freeInlineCompletions() {
    }
    async provideInlineCompletions(t, n, r, o) {
      this.updateOtherDocuments(this.getEditorDocuments(t));
      let i = await this.completionProvider.provideInlineCompletions(t, n, o);
      return i && (this.numCompletionsProvided += 1, this.setCompletionCount(this.numCompletionsProvided)), i;
    }
    acceptedLastCompletion(t) {
      this.completionProvider.acceptedLastCompletion(t);
    }
    updateOtherDocuments(t) {
      this.completionProvider.otherDocuments = t;
    }
  };
  function Pn() {
    try {
      new Headers();
    } catch {
      throw new Error("connect-web requires the fetch API. Are you running on an old version of Node.js? Node.js is not supported in Connect for Web - please stay tuned for Connect for Node.");
    }
  }
  var ne = function(e4) {
    return this instanceof ne ? (this.v = e4, this) : new ne(e4);
  }, fr = function(e4, t, n) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e4, t || []), o, i = [];
    return o = {}, s("next"), s("throw"), s("return"), o[Symbol.asyncIterator] = function() {
      return this;
    }, o;
    function s(m) {
      r[m] && (o[m] = function(p) {
        return new Promise(function(g, b) {
          i.push([m, p, g, b]) > 1 || a(m, p);
        });
      });
    }
    function a(m, p) {
      try {
        c(r[m](p));
      } catch (g) {
        y(i[0][3], g);
      }
    }
    function c(m) {
      m.value instanceof ne ? Promise.resolve(m.value.v).then(l, h) : y(i[0][2], m);
    }
    function l(m) {
      a("next", m);
    }
    function h(m) {
      a("throw", m);
    }
    function y(m, p) {
      m(p), i.shift(), i.length && a(i[0][0], i[0][1]);
    }
  };
  function It(e4) {
    var t;
    Pn();
    let n = (t = e4.useBinaryFormat) !== null && t !== void 0 ? t : false;
    return { async unary(r, o, i, s, a, c, l) {
      var h;
      let { serialize: y, parse: m } = we(o, n, e4.jsonOptions, e4.binaryOptions);
      return s = s === void 0 ? e4.defaultTimeoutMs : s <= 0 ? void 0 : s, await ct({ interceptors: e4.interceptors, signal: i, timeoutMs: s, req: { stream: false, service: r, method: o, url: be(e4.baseUrl, r, o), init: { method: "POST", credentials: (h = e4.credentials) !== null && h !== void 0 ? h : "same-origin", redirect: "error", mode: "cors" }, header: Ne(o.kind, n, s, a), contextValues: l != null ? l : ge(), message: c }, next: async (p) => {
        var g;
        let b = e4.useHttpGet === true && o.idempotency === K.NoSideEffects, I = null;
        b ? p = at(p, y(p.message), n) : I = y(p.message);
        let T = await ((g = e4.fetch) !== null && g !== void 0 ? g : globalThis.fetch)(p.url, Object.assign(Object.assign({}, p.init), { headers: p.header, signal: p.signal, body: I })), { isUnaryError: k, unaryError: U } = Pe(o.kind, T.status, T.headers);
        if (k)
          throw Z(await T.json(), Ze(...Se(T.headers)), U);
        let [C, re] = Se(T.headers);
        return { stream: false, service: r, method: o, header: C, message: n ? m(new Uint8Array(await T.arrayBuffer())) : o.O.fromJson(await T.json(), Ee(e4.jsonOptions)), trailer: re };
      } });
    }, async stream(r, o, i, s, a, c, l) {
      var h;
      let { serialize: y, parse: m } = we(o, n, e4.jsonOptions, e4.binaryOptions);
      function p(b, I) {
        return fr(this, arguments, function* () {
          let T = et(b).getReader(), k = false;
          for (; ; ) {
            let U = yield ne(T.read());
            if (U.done)
              break;
            let { flags: C, data: re } = U.value;
            if ((C & xe) === xe) {
              k = true;
              let qe = it(re);
              if (qe.error)
                throw qe.error;
              qe.metadata.forEach((Cn, kn) => I.set(kn, Cn));
              continue;
            }
            yield yield ne(m(re));
          }
          if (!k)
            throw "missing EndStreamResponse";
        });
      }
      async function g(b) {
        if (o.kind != P.ServerStreaming)
          throw "The fetch API does not support streaming request bodies";
        let I = await b[Symbol.asyncIterator]().next();
        if (I.done == true)
          throw "missing request message";
        return tt(0, y(I.value));
      }
      return s = s === void 0 ? e4.defaultTimeoutMs : s <= 0 ? void 0 : s, await lt({ interceptors: e4.interceptors, timeoutMs: s, signal: i, req: { stream: true, service: r, method: o, url: be(e4.baseUrl, r, o), init: { method: "POST", credentials: (h = e4.credentials) !== null && h !== void 0 ? h : "same-origin", redirect: "error", mode: "cors" }, header: Ne(o.kind, n, s, a), contextValues: l != null ? l : ge(), message: c }, next: async (b) => {
        var I;
        let T = await ((I = e4.fetch) !== null && I !== void 0 ? I : globalThis.fetch)(b.url, Object.assign(Object.assign({}, b.init), { headers: b.header, signal: b.signal, body: await g(b.message) }));
        if (Pe(o.kind, T.status, T.headers), T.body === null)
          throw "missing response body";
        let k = new Headers();
        return Object.assign(Object.assign({}, b), { header: T.headers, trailer: k, message: p(T.body, k) });
      } });
    } };
  }
  var vn = { typeName: "exa.language_server_pb.LanguageServerService", methods: { getCompletions: { name: "GetCompletions", I: Ue, O: Re, kind: P.Unary }, acceptCompletion: { name: "AcceptCompletion", I: Fe, O: _e, kind: P.Unary }, getAuthToken: { name: "GetAuthToken", I: Je, O: Me, kind: P.Unary } } };
  var mr = (e4, { onAutocomplete: t, languageServer: n = "https://web-backend.codeium.com", apiKey: r, getEditors: o = () => [] } = {}) => {
    let i = 1, s = 0, a = (T) => {
      s = T;
    }, c = "inactive", l = (T) => {
      c = T;
    }, h = "", y = (T) => {
      h = T;
    }, m = It({ baseUrl: n, useBinaryFormat: true }), p = nt(vn, m), g = new Ve(p, a, l, y, v, r), b = e4.languages.registerInlineCompletionsProvider({ pattern: "**" }, g), I = e4.editor.registerCommand("codeium.acceptCompletion", (T, k, U) => {
      try {
        typeof t == "function" && t(U), i = i + 1, g.acceptedLastCompletion(k);
      } catch {
      }
    });
    function v(T) {
      let k = [];
      return o().forEach((U) => {
        let C = U.getModel();
        !C || C === T || k.push(new M({ absolutePath: C.uri.path, relativePath: C.uri.path.startsWith("/") ? C.uri.path.slice(1) : C.uri.path, text: U.getValue(), editorLanguage: C.getLanguageId(), language: Le(C.getLanguageId()) }));
      }), k;
    }
    return { getCompletionCount: () => s, getCodeiumStatus: () => c, getCodeiumStatusMessage: () => h, getAcceptedCompletionCount: () => i, dispose: () => {
      b.dispose(), I.dispose();
    } };
  };
  const _$1 = _unsafeWindow._;
  const regTheme = async (theme2) => {
    let themes = _unsafeWindow.codeThemes;
    let themeItem = themes.find((i) => i.themeName === theme2);
    if (themeItem.out)
      return;
    if (themeItem.loaded && themeItem.cache)
      return;
    let editor = _unsafeWindow.monaco.editor;
    const response = await fetch(`${"https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/data"}/theme/${themeItem.group}/${themeItem.path}`);
    if (response.ok) {
      const json2 = await response.json();
      editor.defineTheme(theme2, json2);
      themeItem.loaded = true;
      themeItem.cache = json2;
    }
  };
  const setFeature = (font = {}) => {
    let dom = document.querySelector(
      ".view-lines.monaco-mouse-cursor-text"
    );
    if (!dom)
      return;
    dom.style["fontFamily"] = font.value;
  };
  const regTips = (language, monaco) => {
    var _a2;
    let allTips = _unsafeWindow.editorTips;
    const tipsList = allTips.filter((i) => i.supportLanguage === language);
    const completionItems = tipsList.map((tip) => {
      let kind = completionItemKinds.find((i) => i.value === tip.kind).name;
      let rule2 = tip.insertTextRules.map((i) => insertTextRules.find((fi) => fi.value === i).name);
      let result;
      for (let i = 0; i < rule2.length; i++) {
        result |= monaco.languages.CompletionItemInsertTextRule[rule2];
      }
      return {
        label: tip.label,
        kind: monaco.languages.CompletionItemKind[kind],
        insertText: tip.insertText,
        documentation: tip.documentation,
        detail: tip.detail,
        insertTextRules: result,
        sortText: tip.sortText
      };
    });
    if (_$1.isEmpty(completionItems))
      return;
    let { [language]: disposable = {} } = (_a2 = _unsafeWindow.disposables) != null ? _a2 : {};
    if (!_$1.isEmpty(disposable)) {
      disposable.dispose();
    }
    disposable = monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems(model, position) {
        return { suggestions: completionItems };
      }
    });
    _unsafeWindow.disposables[language] = disposable;
  };
  const editorCreated = async (monaco) => {
    await setDefaultSetting();
    useDTS(monaco, "lodash");
    useDTS(monaco, "Big");
    _unsafeWindow.disposables = {};
    let create = monaco.editor.create;
    monaco.editor.create = (ref, options, ...params) => {
      var _a2;
      let settings = (_a2 = JSON.parse(_unsafeWindow.localStorage.getItem("codeSettings"))) != null ? _a2 : {};
      let option = _$1.omit(options, ["theme", "fontFamily", "fontSize", "tabSize", "fontFeatureSettings"]);
      let font = fontFamilys.find((i) => i.value === settings.fontFamily);
      let editor = create(ref, {
        ...option,
        theme: settings.theme,
        fontFamily: settings.fontFamily,
        fontSize: settings.fontSize,
        tabSize: settings.tabSize,
        cursorSmoothCaretAnimation: true,
        roundedSelection: true,
        fontLigatures: true,
        formatOnType: true,
        minimap: {
          enabled: false
        },
        EditorAutoClosingEditStrategy: "auto",
        autoClosingComments: true,
        cursorBlinking: "smooth",
        overviewRulerBorder: true
      }, ...params);
      setFeature(font);
      setOther(option.language, editor, monaco);
      regTips(option.language, monaco);
      if (settings.aiCode) {
        addCodeium(monaco);
      }
      return editor;
    };
    previewEditor(monaco);
    monaco.editor.onWillDisposeModel(async function(editor) {
      disposeAi();
    });
  };
  const setOther = async (mode, editor, monaco) => {
    await wire(mode, editor, monaco);
  };
  const defineTheme = async () => {
    var _a2;
    const { theme: theme2 = "vs" } = (_a2 = JSON.parse(_unsafeWindow.localStorage.getItem("codeSettings"))) != null ? _a2 : {};
    await regTheme(theme2);
  };
  const setDefaultSetting = async () => {
    let defaultSetting = {
      fontSize: 13,
      fontFamily: "Menlo, Monaco, Courier New, monospace",
      theme: "vs",
      tabSize: 2,
      aiCode: false
    };
    let settings = _unsafeWindow.localStorage.getItem("codeSettings");
    if (_$1.isEmpty(settings)) {
      _unsafeWindow.localStorage.setItem("codeSettings", JSON.stringify(defaultSetting));
    } else {
      settings = JSON.parse(settings);
      Object.keys(defaultSetting).forEach((key) => {
        if (!_$1.has(settings, key)) {
          settings[key] = defaultSetting[key];
        }
      });
      _unsafeWindow.localStorage.setItem("codeSettings", JSON.stringify(settings));
      defineTheme();
    }
  };
  const initWork = () => {
    _unsafeWindow.MonacoEnvironment = {
      getWorkerUrl: function(workerId, label) {
        var _a2, _b2;
        let editorPath = ((_a2 = _unsafeWindow.$GLOBAL_CONFIG) == null ? void 0 : _a2.editorPath) ? _unsafeWindow.$GLOBAL_CONFIG.editorPath : `${((_b2 = _unsafeWindow.$GLOBAL_CONFIG) == null ? void 0 : _b2.resRoot) || ""}/fe_components/lowcode/third-party/monaco-editor/min`;
        return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
          self.MonacoEnvironment = {
            baseUrl: '${editorPath}'
          };
          importScripts('${editorPath}/vs/base/worker/workerMain.js');`)}`;
      }
    };
  };
  const previewEditor = async (monaco) => {
    initWork();
    let editor = monaco.editor.create(document.createElement("div"), {
      language: "javascript",
      regTip: false
    });
    editor.dispose();
  };
  const addCodeium = async (monaco) => {
    _unsafeWindow.codeiumProvider = mr(
      monaco,
      {
        languageServer: "https://web-backend.codeium.com",
        apiKey: "d49954eb-cfba-4992-980f-d8fb37f0e942",
        onAutocomplete: (acceptedText) => {
        },
        getEditors: () => {
          return [];
        }
      }
    );
  };
  const disposeAi = () => {
    if (_$1.has(_unsafeWindow, "codeiumProvider")) {
      _unsafeWindow.codeiumProvider.dispose();
      delete _unsafeWindow.codeiumProvider;
    }
  };
  const useDTS = async (monaco, type) => {
    const response = await fetch(`${"https://baozoulolw.oss-cn-chengdu.aliyuncs.com/codeSet/data"}/type/${type}.d.ts`);
    const text = await response.text();
    const libUrl = `ts:fileName/${type}.d.ts`;
    monaco.languages.typescript.javascriptDefaults.addExtraLib(text, libUrl);
    monaco.editor.createModel(text, "typescript", monaco.Uri.parse(libUrl));
  };
  var render$1 = function() {
    var _vm = this;
    var _h2 = _vm.$createElement;
    var _c2 = _vm._self._c || _h2;
    return _c2("div", {
      attrs: {
        "id": "self_dialog"
      }
    }, [_c2("el-popover", {
      attrs: {
        "placement": "bottom",
        "width": "250",
        "trigger": "click"
      }
    }, [_c2("el-form", {
      attrs: {
        "label-width": "50px"
      }
    }, [_c2("el-form-item", {
      attrs: {
        "label": "\u5B57\u53F7"
      }
    }, [_c2("el-input-number", {
      staticClass: "tw-w-full",
      attrs: {
        "controls-position": "right"
      },
      model: {
        value: _vm.setting.fontSize,
        callback: function($$v) {
          _vm.$set(_vm.setting, "fontSize", $$v);
        },
        expression: "setting.fontSize"
      }
    })], 1), _c2("el-form-item", {
      attrs: {
        "label": "\u5B57\u4F53"
      }
    }, [_c2("el-select", {
      staticClass: "tw-w-full",
      model: {
        value: _vm.setting.fontFamily,
        callback: function($$v) {
          _vm.$set(_vm.setting, "fontFamily", $$v);
        },
        expression: "setting.fontFamily"
      }
    }, _vm._l(_vm.fontFamilys, function(item) {
      return _c2("el-option", {
        key: item.value,
        attrs: {
          "label": item.label,
          "value": item.value
        }
      });
    }), 1)], 1), _c2("el-form-item", {
      attrs: {
        "label": "\u7F29\u8FDB"
      }
    }, [_c2("el-input-number", {
      staticClass: "tw-w-full",
      attrs: {
        "controls-position": "right"
      },
      model: {
        value: _vm.setting.tabSize,
        callback: function($$v) {
          _vm.$set(_vm.setting, "tabSize", $$v);
        },
        expression: "setting.tabSize"
      }
    })], 1), _c2("el-form-item", {
      attrs: {
        "label": "\u4E3B\u9898"
      }
    }, [_c2("el-select", {
      staticClass: "tw-w-full",
      attrs: {
        "filterable": true
      },
      on: {
        "change": _vm.themeChange
      },
      model: {
        value: _vm.setting.theme,
        callback: function($$v) {
          _vm.$set(_vm.setting, "theme", $$v);
        },
        expression: "setting.theme"
      }
    }, _vm._l(_vm.themes, function(list, index) {
      return _c2("el-option-group", {
        key: index,
        attrs: {
          "label": list.group,
          "divider": true
        }
      }, _vm._l(list.children, function(item) {
        return _c2("el-option", {
          key: item.themeName,
          attrs: {
            "value": item.themeName,
            "label": item.name
          }
        });
      }), 1);
    }), 1)], 1), _c2("el-form-item", {
      attrs: {
        "label": "AI"
      }
    }, [_c2("el-switch", {
      attrs: {
        "active-color": "#13ce66",
        "inactive-color": "#ff4949",
        "inactive-text": "",
        "active-text": _vm.setting.aiCode ? "\u5DF2\u5F00\u542F" : "\u5DF2\u5173\u95ED"
      },
      on: {
        "change": _vm.aiCodeChange
      },
      model: {
        value: _vm.setting.aiCode,
        callback: function($$v) {
          _vm.$set(_vm.setting, "aiCode", $$v);
        },
        expression: "setting.aiCode"
      }
    })], 1)], 1), _c2("el-button", {
      staticStyle: {
        "float": "right"
      },
      on: {
        "click": _vm.regTips
      }
    }, [_vm._v("\u6CE8\u518C\u4EE3\u7801\u63D0\u793A")]), _c2("el-button", {
      attrs: {
        "slot": "reference",
        "icon": "el-icon-setting"
      },
      on: {
        "click": _vm.initData
      },
      slot: "reference"
    }, [_vm._v("\u8BBE\u7F6E")])], 1), _c2("el-drawer", {
      attrs: {
        "title": "\u6CE8\u518C\u4EE3\u7801\u63D0\u793A",
        "visible": _vm.drawer,
        "size": 500,
        "append-to-body": ""
      },
      on: {
        "update:visible": function($event) {
          _vm.drawer = $event;
        }
      }
    }, [_c2("tips")], 1)], 1);
  };
  var staticRenderFns = [];
  const _ = _unsafeWindow._;
  const __vue2_script = {
    props: {},
    components: { Tips },
    data() {
      return {
        setting: {},
        themes: [],
        fontFamilys: [],
        drawer: false
      };
    },
    watch: {
      setting: {
        handler: function(n, o) {
          this.setData(n);
        },
        deep: true
      }
    },
    methods: {
      initData() {
        let settings = _unsafeWindow.localStorage.getItem(
          "codeSettings"
        );
        if (!_.isEmpty(settings)) {
          let obj = JSON.parse(settings);
          Object.keys(obj).forEach((key) => {
            this.$set(this.setting, key, obj[key]);
          });
        }
      },
      themeChange(theme2) {
        if (_.isEmpty(theme2))
          return;
        regTheme(theme2);
      },
      setData(val) {
        _unsafeWindow.localStorage.setItem(
          "codeSettings",
          JSON.stringify(val)
        );
      },
      initOptions() {
        let obj = _.groupBy(codeThemeList, "group");
        Object.keys(obj).forEach((key) => {
          this.themes.push({
            group: key === "undefined" ? "\u5176\u4ED6" : key,
            children: obj[key]
          });
        });
      },
      regTips: function() {
        this.drawer = true;
      },
      aiCodeChange(val) {
      }
    },
    mounted() {
      this.initData();
      this.initOptions();
      this.fontFamilys = fontFamilys;
    }
  };
  const __cssModules = {};
  var __component__ = /* @__PURE__ */ normalizeComponent(
    __vue2_script,
    render$1,
    staticRenderFns,
    false,
    __vue2_injectStyles,
    "93c5e0b4",
    null,
    null
  );
  function __vue2_injectStyles(context) {
    for (let o in __cssModules) {
      this[o] = __cssModules[o];
    }
  }
  var App = /* @__PURE__ */ function() {
    return __component__.exports;
  }();
  const Vue = _unsafeWindow.Vue;
  window.Vue = Vue;
  const render = (el) => {
    new Vue({
      render: (h) => h(App)
    }).$mount("#self_dialog");
  };
  let renderHeader = async (dom) => {
    dom.className = dom.className + " head-right";
    const app = document.createElement("div");
    app.setAttribute("id", "self_dialog");
    dom.insertBefore(app, dom.firstChild);
    render();
  };
  if (_unsafeWindow.location.hash.startsWith("#/widgetPage")) {
    let selector = ".design-container .header-box>span:nth-child(2)";
    let dom = document.querySelector(selector);
    if (dom) {
      await( renderHeader(dom));
    } else {
      waitForElementByClass("edit-page-design", async (e4) => {
        if (!document.getElementById("self_dialog")) {
          dom = document.querySelector(selector);
          await renderHeader(dom);
        }
      });
    }
    await( initMonacoEditor());
    _unsafeWindow.codeThemes = codeThemeList;
    _unsafeWindow.editorTips = tips;
    _unsafeWindow.require(["vs/editor/editor.main"], (monaco) => editorCreated(monaco));
  }

})();
// ==UserScript==
// @name         头歌复制粘贴限制解除（暂停更新）
// @namespace    http://tampermonkey.net/
// @version      1.8.1
// @description  用于解除头歌平台的复制粘贴限制，即开即用，无需复杂操作
// @author       Alore
// @match        https://www.educoder.net/tasks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.educoder.net
// @license      GPL-2.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477837/%E5%A4%B4%E6%AD%8C%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%EF%BC%88%E6%9A%82%E5%81%9C%E6%9B%B4%E6%96%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/477837/%E5%A4%B4%E6%AD%8C%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%EF%BC%88%E6%9A%82%E5%81%9C%E6%9B%B4%E6%96%B0%EF%BC%89.meta.js
// ==/UserScript==


(function () {
"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([[94049],{

/***/ 94049:
/*!************************************************************!*\
  !*** ./src/components/monaco-editor/index.jsx + 4 modules ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  SV: function() { return /* binding */ DiffEditor; },
  ZP: function() { return /* binding */ monaco_editor; }
});

// UNUSED EXPORTS: getLanguageByMirrorName

// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.23.6@@babel/runtime/helpers/objectSpread2.js
var objectSpread2 = __webpack_require__(82242);
var objectSpread2_default = /*#__PURE__*/__webpack_require__.n(objectSpread2);
// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.23.6@@babel/runtime/helpers/toConsumableArray.js
var toConsumableArray = __webpack_require__(37205);
var toConsumableArray_default = /*#__PURE__*/__webpack_require__.n(toConsumableArray);
// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.23.6@@babel/runtime/helpers/regeneratorRuntime.js
var regeneratorRuntime = __webpack_require__(7557);
var regeneratorRuntime_default = /*#__PURE__*/__webpack_require__.n(regeneratorRuntime);
// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.23.6@@babel/runtime/helpers/asyncToGenerator.js
var asyncToGenerator = __webpack_require__(41498);
var asyncToGenerator_default = /*#__PURE__*/__webpack_require__.n(asyncToGenerator);
// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.23.6@@babel/runtime/helpers/createForOfIteratorHelper.js
var createForOfIteratorHelper = __webpack_require__(91232);
var createForOfIteratorHelper_default = /*#__PURE__*/__webpack_require__.n(createForOfIteratorHelper);
// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.23.6@@babel/runtime/helpers/slicedToArray.js
var slicedToArray = __webpack_require__(79800);
var slicedToArray_default = /*#__PURE__*/__webpack_require__.n(slicedToArray);
// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.23.6@@babel/runtime/helpers/objectWithoutProperties.js
var objectWithoutProperties = __webpack_require__(39647);
var objectWithoutProperties_default = /*#__PURE__*/__webpack_require__.n(objectWithoutProperties);
// EXTERNAL MODULE: ./node_modules/_react@17.0.2@react/index.js
var _react_17_0_2_react = __webpack_require__(59301);
// EXTERNAL MODULE: ./node_modules/_resize-observer-polyfill@1.5.1@resize-observer-polyfill/dist/ResizeObserver.es.js
var ResizeObserver_es = __webpack_require__(76374);
;// CONCATENATED MODULE: ./src/components/monaco-editor/keywords.tsx
var cLangage = {
  keywords: ['print', 'auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while']
};
var javaLangage = {
  quickKey: [{
    label: "main",
    content: ['public static void main(String[] args) {', '\t$0', '}'].join('\n')
  }, {
    label: "System.out.println",
    content: ['System.out.println($0)'].join('\n')
  }, {
    label: "System.out.print",
    content: ['System.out.print($0)'].join('\n')
  }],
  keywords: ['abstract', 'continue', 'for', 'new', 'switch', 'assert', 'default', 'goto', 'package', 'synchronized', 'boolean', 'do', 'if', 'private', 'this', 'break', 'double', 'implements', 'protected', 'throw', 'byte', 'else', 'import', 'public', 'throws', 'case', 'enum', 'instanceof', 'return', 'transient', 'catch', 'extends', 'int', 'short', 'try', 'char', 'final', 'interface', 'static', 'void', 'class', 'finally', 'long', 'strictfp', 'volatile', 'const', 'float', 'native', 'super', 'while', 'true', 'false']
};
var cppLangage = {
  keywords: ['abstract', 'amp', 'array', 'auto', 'bool', 'break', 'case', 'catch', 'char', 'class', 'const', 'constexpr', 'const_cast', 'continue', 'cpu', 'decltype', 'default', 'delegate', 'delete', 'do', 'double', 'dynamic_cast', 'each', 'else', 'enum', 'event', 'explicit', 'export', 'extern', 'false', 'final', 'finally', 'float', 'friend', 'gcnew', 'generic', 'goto', 'in', 'initonly', 'inline', 'int', 'interface', 'interior_ptr', 'internal', 'literal', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'nullptr', '__nullptr', 'operator', 'override', 'partial', 'pascal', 'pin_ptr', 'private', 'property', 'protected', 'public', 'ref', 'register', 'reinterpret_cast', 'restrict', 'return', 'safe_cast', 'sealed', 'short', 'signed', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct', 'switch', 'template', 'this', 'thread_local', 'throw', 'tile_static', 'true', 'try', 'typedef', 'typeid', 'typename', 'union', 'unsigned', 'using', 'virtual', 'void', 'volatile', 'wchar_t', 'where', 'while', '_asm', '_based', '_cdecl', '_declspec', '_fastcall', '_if_exists', '_if_not_exists', '_inline', '_multiple_inheritance', '_pascal', '_single_inheritance', '_stdcall', '_virtual_inheritance', '_w64', '__abstract', '__alignof', '__asm', '__assume', '__based', '__box', '__builtin_alignof', '__cdecl', '__clrcall', '__declspec', '__delegate', '__event', '__except', '__fastcall', '__finally', '__forceinline', '__gc', '__hook', '__identifier', '__if_exists', '__if_not_exists', '__inline', '__int128', '__int16', '__int32', '__int64', '__int8', '__interface', '__leave', '__m128', '__m128d', '__m128i', '__m256', '__m256d', '__m256i', '__m64', '__multiple_inheritance', '__newslot', '__nogc', '__noop', '__nounwind', '__novtordisp', '__pascal', '__pin', '__pragma', '__property', '__ptr32', '__ptr64', '__raise', '__restrict', '__resume', '__sealed', '__single_inheritance', '__stdcall', '__super', '__thiscall', '__try', '__try_cast', '__typeof', '__unaligned', '__unhook', '__uuidof', '__value', '__virtual_inheritance', '__w64', '__wchar_t'],
  operators: ['=', '>', '<', '!', '~', '?', ':', '==', '<=', '>=', '!=', '&&', '||', '++', '--', '+', '-', '*', '/', '&', '|', '^', '%', '<<', '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=', '^=', '%=', '<<=', '>>=', '>>>='],
  quickKey: [{
    label: "ifelse",
    content: ['if (${1:condition}) {', '\t$0', '} else {', '\t', '}'].join('\n')
  }, {
    label: "include",
    content: 'include<$0>'
  }, {
    label: "printf",
    content: 'printf($0)'
  }, {
    label: "system",
    content: 'system("$0")'
  }, {
    label: "main",
    content: ['int main () {', '\t$0', '}'].join('\n')
  }, {
    label: "if",
    content: ['if () {', '\t$0', '}'].join('\n')
  }, {
    label: "for",
    content: ['for(int j=0 ; j<10; j++){', '\t$0', '}'].join('\n')
  }, {
    label: "trycatch",
    content: ['try{', '\t$0', '}catch(ExceptionName e){', '}'].join('\n')
  }, {
    label: "using namespace std;",
    content: ['using namespace std;'].join('\n')
  }, {
    label: "include <iostream>",
    content: ['#include <iostream>'].join('\n')
  }, {
    label: "include <vector>",
    content: ['#include <vector>'].join('\n')
  }, {
    label: "include <cstdio>",
    content: ['#include <cstdio>'].join('\n')
  }, {
    label: "include <cstring>",
    content: ['#include <cstring>'].join('\n')
  }, {
    label: "include <sstream>",
    content: ['#include <sstream>'].join('\n')
  }, {
    label: "include <fstream>",
    content: ['#include <fstream>'].join('\n')
  }, {
    label: "include <map>",
    content: ['#include <map>'].join('\n')
  }, {
    label: "include <string>",
    content: ['#include <string>'].join('\n')
  }, {
    label: "include <cmath>",
    content: ['#include <cmath>'].join('\n')
  }]
};
var pythonLangage = {
  keywords: ['and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'exec', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None', 'not', 'or', 'pass', 'raise', 'return', 'self', 'try', 'while', 'with', 'yield', 'int', 'float', 'long', 'complex', 'hex', 'abs', 'all', 'any', 'apply', 'basestring', 'bin', 'bool', 'buffer', 'bytearray', 'callable', 'chr', 'classmethod', 'cmp', 'coerce', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'execfile', 'file', 'filter', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'help', 'id', 'input', 'intern', 'isinstance', 'issubclass', 'iter', 'len', 'locals', 'list', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'reversed', 'range', 'raw_input', 'reduce', 'reload', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'unichr', 'unicode', 'vars', 'xrange', 'zip', 'True', 'False', '__dict__', '__methods__', '__members__', '__class__', '__bases__', '__name__', '__mro__', '__subclasses__', '__init__', '__import__'],
  quickKey: [{
    label: "print",
    content: ['print($0)'].join('\n')
  }
  // { label: "#include", content: '#include ""' },
  // { label: "printf", content: 'printf("")' },
  ]
};
var scalaLangage = {
  keywords: ['asInstanceOf', 'catch', 'class', 'classOf', 'def', 'do', 'else', 'extends', 'finally', 'for', 'foreach', 'forSome', 'if', 'import', 'isInstanceOf', 'macro', 'match', 'new', 'object', 'package', 'return', 'throw', 'trait', 'try', 'type', 'until', 'val', 'var', 'while', 'with', 'yield',
  // Dotty-specific:
  'given', 'enum', 'then'],
  quickKey: [{
    label: "println",
    content: ['println($0)'].join('\n')
  }
  // { label: "#include", content: '#include ""' },
  // { label: "printf", content: 'printf("")' },
  ]
};
// EXTERNAL MODULE: ./node_modules/_js-beautify@1.15.1@js-beautify/js/index.js
var js = __webpack_require__(86061);
var js_default = /*#__PURE__*/__webpack_require__.n(js);
;// CONCATENATED MODULE: ./src/components/monaco-editor/monaco-suggest-config.tsx






var baseConfig = {
  languages: ['c', 'abap', 'apex', 'azcli', 'bat', 'cameligo', 'clojure', 'coffee', 'cpp', 'csharp', 'csp', 'css', 'dockerfile', 'fsharp', 'go', 'graphql', 'handlebars', 'html', 'ini', 'java', 'javascript', 'json', 'kotlin', 'less', 'lua', 'markdown', 'mips', 'msdax', 'mysql', 'objective-c', 'pascal', 'pascaligo', 'perl', 'pgsql', 'php', 'postiats', 'powerquery', 'powershell', 'pug', 'python', 'r', 'razor', 'redis', 'redshift', 'restructuredtext', 'ruby', 'rust', 'sb', 'scheme', 'scss', 'shell', 'solidity', 'sophia', 'sql', 'st', 'swift', 'tcl', 'twig', 'vb', 'xml', "yaml'"],
  tables: {
    users: ["name", "id", "email", "phone", "password"],
    roles: ["id", "name", "order", "created_at", "updated_at", "deleted_at"]
  }
};
var getKeywordsSuggest = function getKeywordsSuggest(monaco, keywords) {
  return keywords.map(function (key) {
    return {
      label: key,
      // 显示的名称
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: key // 真实补全的值
    };
  });
};
var getTableSuggest = function getTableSuggest(monaco) {
  return Object.keys(baseConfig.tables).map(function (key) {
    return {
      label: key,
      // 显示的名称
      kind: monaco.languages.CompletionItemKind.Variable,
      insertText: key // 真实补全的值
    };
  });
};
var getFieldsSuggest = function getFieldsSuggest(tableName, monaco) {
  var fields = baseConfig.tables[tableName];
  if (!fields) {
    return [];
  }
  return fields.map(function (name) {
    return {
      label: name,
      kind: monaco.languages.CompletionItemKind.Field,
      insertText: name
    };
  });
};
function getSuggestions(monaco, model, position, keywords, snippts) {
  var word = model.getWordUntilPosition(position);
  var range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn
  };
  var rs = keywords.map(function (item) {
    return {
      label: item,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: item,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
      range: range
    };
  });
  snippts.map(function (item) {
    rs.push(_objectSpread(_objectSpread({}, item), {}, {
      range: range
    }));
  });
  return rs;
}
/* harmony default export */ var monaco_suggest_config = (function (monaco) {
  baseConfig.languages.map(function (item) {
    monaco.languages.registerDocumentFormattingEditProvider(item, {
      provideDocumentFormattingEdits: function provideDocumentFormattingEdits(model, options, token) {
        return asyncToGenerator_default()( /*#__PURE__*/regeneratorRuntime_default()().mark(function _callee() {
          var formattedText;
          return regeneratorRuntime_default()().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                formattedText = js_default()(model.getValue(), {
                  "indent_size": "2",
                  "indent_char": " ",
                  "max_preserve_newlines": "2",
                  "preserve_newlines": true,
                  "keep_array_indentation": true,
                  "break_chained_methods": false,
                  "indent_scripts": "normal",
                  "brace_style": "collapse",
                  "space_before_conditional": true,
                  "unescape_strings": false,
                  "jslint_happy": false,
                  "end_with_newline": true,
                  "wrap_line_length": "0",
                  "indent_inner_html": false,
                  "comma_first": false,
                  "e4x": false,
                  "indent_empty_lines": false
                });
                return _context.abrupt("return", [{
                  range: model.getFullModelRange(),
                  text: formattedText
                }]);
              case 2:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }))();
      }
    });
    return item;
  });
  var cppKeyPrompt = cppLangage.quickKey.map(function (item) {
    return {
      label: item.label,
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: item.content,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    };
  });
  var pythonKeyPrompt = pythonLangage.quickKey.map(function (item) {
    return {
      label: item.label,
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: item.content,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    };
  });
  var javaKeyPrompt = javaLangage.quickKey.map(function (item) {
    return {
      label: item.label,
      kind: monaco.languages.CompletionItemKind.Method,
      insertText: item.content,
      insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
    };
  });
  monaco.languages.registerCompletionItemProvider('cpp', {
    provideCompletionItems: function provideCompletionItems(model, position) {
      var word = model.getWordUntilPosition(position);
      var wordRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      var value = model.getLineContent(position.lineNumber).substring(word.startColumn - 2, word.endColumn);
      return {
        suggestions: [].concat(toConsumableArray_default()(cppLangage.keywords.map(function (item) {
          return {
            label: item,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: item,
            insertText: item,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: wordRange
          };
        })), toConsumableArray_default()(cppLangage.quickKey.map(function (item) {
          return {
            label: item.label,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: item.content,
            insertText: value.startsWith("#") ? item.content.replace(/#/, '') : item.content,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: wordRange
          };
        })))
      };
    }
  });
  monaco.languages.registerCompletionItemProvider('c', {
    provideCompletionItems: function provideCompletionItems(model, position) {
      var word = model.getWordUntilPosition(position);
      var wordRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      return {
        suggestions: toConsumableArray_default()(cLangage.keywords.map(function (item) {
          return {
            label: item,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: item,
            insertText: item,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: wordRange
          };
        }))
      };
    }
  });
  monaco.languages.registerCompletionItemProvider('java', {
    provideCompletionItems: function provideCompletionItems(model, position) {
      var word = model.getWordUntilPosition(position);
      var wordRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      var value = model.getLineContent(position.lineNumber).substring(word.startColumn - 2, word.endColumn);
      return {
        suggestions: [].concat(toConsumableArray_default()(javaLangage.keywords.map(function (item) {
          return {
            label: item,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: item,
            insertText: item,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: wordRange
          };
        })), toConsumableArray_default()(javaLangage.quickKey.map(function (item) {
          return {
            label: item.label,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: item.content,
            insertText: value.startsWith("#") ? item.content.replace(/#/, '') : item.content,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: wordRange
          };
        })))
      };
    }
  });
  monaco.languages.registerCompletionItemProvider('scala', {
    provideCompletionItems: function provideCompletionItems(model, position) {
      var word = model.getWordUntilPosition(position);
      var wordRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      var value = model.getLineContent(position.lineNumber).substring(word.startColumn - 2, word.endColumn);
      return {
        suggestions: [].concat(toConsumableArray_default()(scalaLangage.keywords.map(function (item) {
          return {
            label: item,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: item,
            insertText: item,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: wordRange
          };
        })), toConsumableArray_default()(scalaLangage.quickKey.map(function (item) {
          return {
            label: item.label,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: item.content,
            insertText: value.startsWith("#") ? item.content.replace(/#/, '') : item.content,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: wordRange
          };
        })))
      };
    }
  });
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: function provideCompletionItems(model, position) {
      var word = model.getWordUntilPosition(position);
      var wordRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn
      };
      var value = model.getLineContent(position.lineNumber).substring(word.startColumn - 2, word.endColumn);
      return {
        suggestions: [].concat(toConsumableArray_default()(pythonLangage.keywords.map(function (item) {
          return {
            label: item,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: item,
            insertText: item,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: wordRange
          };
        })), toConsumableArray_default()(pythonLangage.quickKey.map(function (item) {
          return {
            label: item.label,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: item.content,
            insertText: value.startsWith("#") ? item.content.replace(/#/, '') : item.content,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: wordRange
          };
        })))
      };
    }
  });
});
var tipTxt = '该任务关卡设置了禁止复制粘贴，请手动输入代码。';
// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.23.6@@babel/runtime/helpers/classCallCheck.js
var classCallCheck = __webpack_require__(82100);
var classCallCheck_default = /*#__PURE__*/__webpack_require__.n(classCallCheck);
// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.23.6@@babel/runtime/helpers/createClass.js
var createClass = __webpack_require__(29186);
var createClass_default = /*#__PURE__*/__webpack_require__.n(createClass);
// EXTERNAL MODULE: ./node_modules/_@babel_runtime@7.23.6@@babel/runtime/helpers/defineProperty.js
var defineProperty = __webpack_require__(85573);
var defineProperty_default = /*#__PURE__*/__webpack_require__.n(defineProperty);
;// CONCATENATED MODULE: ./src/components/monaco-editor/placeholder.js



var PlaceholderContentWidget = /*#__PURE__*/function () {
  function PlaceholderContentWidget(placeholder, editor, monaco) {
    var _this = this;
    classCallCheck_default()(this, PlaceholderContentWidget);
    this.placeholder = placeholder;
    this.editor = editor;
    this.monaco = monaco;
    // register a listener for editor code changes
    editor.onDidChangeModelContent(function () {
      return _this.onDidChangeModelContent();
    });
    // ensure that on initial load the placeholder is shown
    this.onDidChangeModelContent();
  }
  createClass_default()(PlaceholderContentWidget, [{
    key: "onDidChangeModelContent",
    value: function onDidChangeModelContent() {
      if (this.editor.getValue() === '') {
        this.editor.addContentWidget(this);
      } else {
        this.editor.removeContentWidget(this);
      }
    }
  }, {
    key: "getId",
    value: function getId() {
      return PlaceholderContentWidget.ID;
    }
  }, {
    key: "getDomNode",
    value: function getDomNode() {
      if (!this.domNode) {
        this.domNode = document.createElement('div');
        this.domNode.style.width = 'max-content';
        this.domNode.textContent = this.placeholder;
        this.domNode.style.fontStyle = 'initial';
        this.domNode.style.color = '#D7D7D7';
        this.domNode.style.pointerEvents = 'none';
        this.editor.applyFontInfo(this.domNode);
      }
      return this.domNode;
    }
  }, {
    key: "getPosition",
    value: function getPosition() {
      return {
        position: {
          lineNumber: 1,
          column: 1
        },
        preference: [this.monaco.editor.ContentWidgetPositionPreference.EXACT]
      };
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.editor.removeContentWidget(this);
    }
  }]);
  return PlaceholderContentWidget;
}();
defineProperty_default()(PlaceholderContentWidget, "ID", 'editor.widget.placeholderHint');
/* harmony default export */ var monaco_editor_placeholder = (PlaceholderContentWidget);
// EXTERNAL MODULE: ./node_modules/_monaco-editor@0.30.0@monaco-editor/esm/vs/platform/actions/common/actions.js
var actions = __webpack_require__(96236);
// EXTERNAL MODULE: ./node_modules/_antd@5.9.0@antd/es/message/index.js + 4 modules
var message = __webpack_require__(8591);
// EXTERNAL MODULE: ./node_modules/_lodash@4.17.21@lodash/lodash.js
var lodash = __webpack_require__(89392);
// EXTERNAL MODULE: ./src/components/mediator.js
var mediator = __webpack_require__(30929);
;// CONCATENATED MODULE: ./src/components/monaco-editor/index.css
// extracted by mini-css-extract-plugin

// EXTERNAL MODULE: ./node_modules/_react@17.0.2@react/jsx-runtime.js
var jsx_runtime = __webpack_require__(37712);
;// CONCATENATED MODULE: ./src/components/monaco-editor/index.jsx







var _excluded = ["width", "height", "value", "language", "style", "options", "overrideServices", "theme", "onEditBlur", "onSave", "autoHeight", "forbidCopy", "onChange", "editorDidMount", "onFocus", "onBreakPoint", "breakPointValue", "filename", "errorLine", "errorContent", "highlightLine", "openBreakPoint", "placeholder"];











function processSize(size) {
  return !/^\d+$/.test(size) ? size : "".concat(size, "px");
}
function noop() {}
var __prevent_trigger_change_event = false;
var DICT = {
  'Python3.6': 'python',
  'Python2.7': 'python',
  Dynamips: 'cpp',
  Java: 'java',
  Web: 'php',
  Html: 'html',
  Hive: 'sql',
  Hadoop: 'java',
  SDL: 'cpp',
  PHP: 'php',
  Matlab: 'python',
  Git: 'python',
  Python: 'python',
  'C/C++': 'cpp',
  'C++': 'cpp',
  C: 'cpp',
  Ruby: 'ruby',
  Shell: 'shell',
  JavaScript: 'javascript',
  Perl6: 'perl',
  Kotlin: 'kotlin',
  Elixir: 'elixir',
  Android: 'java',
  JavaWeb: 'java',
  Go: 'go',
  Spark: 'sql',
  MachineLearning: 'python',
  Verilog: 'xml',
  'Verilog/VNC': 'xml',
  Docker: 'dockerfile',
  'C#': 'csharp',
  SQLite3: 'sql',
  Oracle: 'sql',
  Vhdl: 'vhdl',
  R: 'r',
  Swift: 'swift',
  SQLServer: 'mysql',
  MySQL: 'mysql',
  Mongo: 'sql',
  PostgreSql: 'pgsql',
  Hbase: 'powershell',
  Sqoop: 'sql',
  Nasm: 'cpp',
  Kafka: 'java',
  Flink: 'java',
  Sml: 'javascript',
  OpenGL: 'cpp',
  Perl5: 'perl',
  Orange: 'python',
  Scala: "scale",
  solidity: "sol"
};
function getLanguageByMirrorName() {
  var mirror_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var lang = mirror_name;
  if (Array.isArray(mirror_name)) {
    for (var i = 0; i < mirror_name.length; i++) {
      var languageVal = DICT[mirror_name[i]];
      if (languageVal) {
        return languageVal;
      }
    }
    return lang[0];
  }
  return DICT[lang] || lang;
}

//onCodeChange 必须是幂等的，因为只会注册一次，如果有变化，会响应旧的，产生脏数据
var monaco = null;
/* harmony default export */ var monaco_editor = (function (_ref) {
  var _ref$width = _ref.width,
    width = _ref$width === void 0 ? '100%' : _ref$width,
    _ref$height = _ref.height,
    height = _ref$height === void 0 ? '100%' : _ref$height,
    value = _ref.value,
    _ref$language = _ref.language,
    language = _ref$language === void 0 ? 'javascript' : _ref$language,
    _ref$style = _ref.style,
    style = _ref$style === void 0 ? {} : _ref$style,
    _ref$options = _ref.options,
    options = _ref$options === void 0 ? {} : _ref$options,
    _ref$overrideServices = _ref.overrideServices,
    overrideServices = _ref$overrideServices === void 0 ? {} : _ref$overrideServices,
    _ref$theme = _ref.theme,
    theme = _ref$theme === void 0 ? 'vs-dark' : _ref$theme,
    onEditBlur = _ref.onEditBlur,
    onSave = _ref.onSave,
    _ref$autoHeight = _ref.autoHeight,
    autoHeight = _ref$autoHeight === void 0 ? false : _ref$autoHeight,
    _ref$forbidCopy = _ref.forbidCopy,
    forbidCopy = false,
    _ref$onChange = _ref.onChange,
    onChange = _ref$onChange === void 0 ? noop : _ref$onChange,
    _ref$editorDidMount = _ref.editorDidMount,
    editorDidMount = _ref$editorDidMount === void 0 ? noop : _ref$editorDidMount,
    _ref$onFocus = _ref.onFocus,
    onFocus = _ref$onFocus === void 0 ? noop : _ref$onFocus,
    _ref$onBreakPoint = _ref.onBreakPoint,
    onBreakPoint = _ref$onBreakPoint === void 0 ? noop : _ref$onBreakPoint,
    _ref$breakPointValue = _ref.breakPointValue,
    breakPointValue = _ref$breakPointValue === void 0 ? [] : _ref$breakPointValue,
    _ref$filename = _ref.filename,
    filename = _ref$filename === void 0 ? 'educoder.txt' : _ref$filename,
    errorLine = _ref.errorLine,
    _ref$errorContent = _ref.errorContent,
    errorContent = _ref$errorContent === void 0 ? '' : _ref$errorContent,
    highlightLine = _ref.highlightLine,
    _ref$openBreakPoint = _ref.openBreakPoint,
    openBreakPoint = _ref$openBreakPoint === void 0 ? false : _ref$openBreakPoint,
    _ref$placeholder = _ref.placeholder,
    placeholder = _ref$placeholder === void 0 ? '' : _ref$placeholder,
    props = objectWithoutProperties_default()(_ref, _excluded);
  var editorEl = (0,_react_17_0_2_react.useRef)();
  var editor = (0,_react_17_0_2_react.useRef)({});
  var optionsRef = (0,_react_17_0_2_react.useRef)();
  var timeRef = (0,_react_17_0_2_react.useRef)();
  var breakpointsFake = (0,_react_17_0_2_react.useRef)([]);
  var inputLock = (0,_react_17_0_2_react.useRef)(false);
  var inputLockTime = (0,_react_17_0_2_react.useRef)();
  var noAllowTime = (0,_react_17_0_2_react.useRef)();
  var _useState = (0,_react_17_0_2_react.useState)(false),
    _useState2 = slicedToArray_default()(_useState, 2),
    init = _useState2[0],
    setInit = _useState2[1];
  function onLayout() {
    var ro;
    if (editorEl.current) {
      ro = new ResizeObserver_es/* default */.Z(function (entries) {
        var _iterator = createForOfIteratorHelper_default()(entries),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entry = _step.value;
            if (entry.target.offsetHeight > 0 || entry.target.offsetWidth > 0) {
              editor.current.instance.layout();
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      });
      ro.observe(editorEl.current);
    }
    return ro;
  }
  function tipWarn() {
    message/* default */.ZP.warning({
      content: decodeURIComponent(tipTxt),
      key: "monaco-editor-tip"
    });
  }
  var setCodeValue = function setCodeValue() {
    var instance = editor.current.instance;
    if (value != null && instance && init) {
      var model = instance.getModel();
      if (model && value !== model.getValue()) {
        __prevent_trigger_change_event = true;
        model.setValue(value);
        instance.layout();
        __prevent_trigger_change_event = false;
      }
    }
  };
  (0,_react_17_0_2_react.useEffect)(function () {
    var unSub = mediator/* default */.Z.subscribe('formatDocument', function (status) {
      var _instance$getAction;
      var instance = editor.current.instance;
      instance === null || instance === void 0 || (_instance$getAction = instance.getAction) === null || _instance$getAction === void 0 || _instance$getAction.call(instance, 'editor.action.formatDocument').run();
    });
    // 自动化测试使用
    window.updateMonacoValue = function (value) {
      onChange(value);
    };
    return unSub;
  }, []);
  (0,_react_17_0_2_react.useEffect)(function () {
    var instance = editor.current.instance;
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(function () {
      setCodeValue();
    }, 500);
    if (value && !!(value !== null && value !== void 0 && value.length)) {
      var _instance$updateOptio;
      instance === null || instance === void 0 || (_instance$updateOptio = instance.updateOptions) === null || _instance$updateOptio === void 0 || _instance$updateOptio.call(instance, {
        lineNumbersMinChars: Math.max(Math.floor(Math.log10(value.split(/\r\n|\r|\n/g).length)) + 3, 5)
      });
    }
  }, [value, init, editor.current]);
  (0,_react_17_0_2_react.useEffect)(function () {
    if (errorLine && editor.current && editor.current.instance) {
      var instance = editor.current.instance;
      instance.changeViewZones(function (changeAccessor) {
        var domNode = document.createElement('div');
        domNode.style.padding = '10px 20px';
        domNode.style.width = 'calc(100% - 20px)';
        domNode.className = 'my-error-line-wrp';
        domNode.innerHTML = errorContent;
        changeAccessor.addZone({
          afterLineNumber: errorLine || 11,
          heightInLines: 3,
          domNode: domNode
        });
      });
      var overlayWidget = {
        domNode: null,
        getId: function getId() {
          return 'my.overlay.widget';
        },
        getDomNode: function getDomNode() {
          if (!this.domNode) {
            this.domNode = document.createElement('div');
            this.domNode.innerHTML = '';
            this.domNode.style.width = '100%';
            this.domNode.style.padding = '20px 100px';
            this.domNode.style.right = '0px';
            this.domNode.style.top = '50px';
            this.domNode.style.position = 'relative';
            this.domNode.style.color = '#333';
          }
          return this.domNode;
        },
        getPosition: function getPosition() {
          return null;
        }
      };
      instance.addOverlayWidget(overlayWidget);
      // instance.revealPositionInCenter(11,1);
      instance.revealPositionInCenter({
        lineNumber: 20,
        column: 1
      });
    }
  }, [errorLine, editor.current, init]);
  var noAllow = function noAllow() {
    var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var lineNumber = arguments.length > 1 ? arguments[1] : undefined;
    if (!str || str.trim() === '') {
      return true;
    }
    var model = editor.current.instance.getModel();
    var lineTokens = model.getLineTokens(lineNumber);
    var comment = false;
    for (var i = 0; i < 2; i++) {
      if (lineTokens.getStandardTokenType(i) === 1) {
        comment = true;
      }
    }
    return comment;
  };
  (0,_react_17_0_2_react.useEffect)(function () {
    var _editor$current;
    if ((_editor$current = editor.current) !== null && _editor$current !== void 0 && _editor$current.instance && init && openBreakPoint) {
      var instance = editor.current.instance;
      var model = instance.getModel();
      if (!model) return;

      // 高亮指定的行数
      var dealHighlightLine = function dealHighlightLine() {
        var lines = [];
        var ids = [];
        var decorations = model.getAllDecorations();
        var _iterator2 = createForOfIteratorHelper_default()(decorations),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var decoration = _step2.value;
            if (decoration.options.className === 'highlighted-line') {
              var _decoration$range;
              lines.push(decoration === null || decoration === void 0 || (_decoration$range = decoration.range) === null || _decoration$range === void 0 ? void 0 : _decoration$range.startLineNumber);
              ids.push(decoration === null || decoration === void 0 ? void 0 : decoration.id);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        if (highlightLine === lines[0]) return;
        model.deltaDecorations(ids, []);
        var lineCount = model.getLineCount();
        if (!!highlightLine && highlightLine <= lineCount) {
          instance.deltaDecorations([], [{
            range: new monaco.Range(highlightLine, 1, highlightLine, model.getLineMaxColumn(highlightLine)),
            options: {
              isWholeLine: true,
              className: 'highlighted-line'
            }
          }]);
          instance.revealLineInCenter(highlightLine);
        }
      };
      dealHighlightLine();

      //处理断点集合
      var dealBreakPoint = function dealBreakPoint() {
        var isReturn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var lines = [];
        var ids = [];
        var decorations = model.getAllDecorations();
        var _iterator3 = createForOfIteratorHelper_default()(decorations),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var decoration = _step3.value;
            if (decoration.options.linesDecorationsClassName === 'breakpoints-select') {
              var _decoration$range2;
              lines.push(decoration === null || decoration === void 0 || (_decoration$range2 = decoration.range) === null || _decoration$range2 === void 0 ? void 0 : _decoration$range2.startLineNumber);
              ids.push(decoration === null || decoration === void 0 ? void 0 : decoration.id);
            }
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        if (isReturn) return {
          lines: lines,
          ids: ids
        };
        onBreakPoint(lines);
      };

      //添加断点
      var addBreakPoint = /*#__PURE__*/function () {
        var _ref2 = asyncToGenerator_default()( /*#__PURE__*/regeneratorRuntime_default()().mark(function _callee(line) {
          var value;
          return regeneratorRuntime_default()().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                value = {
                  range: new monaco.Range(line, 1, line, 1),
                  options: {
                    isWholeLine: false,
                    linesDecorationsClassName: 'breakpoints-select'
                  }
                };
                _context.next = 3;
                return model.deltaDecorations([], [value]);
              case 3:
                dealBreakPoint();
              case 4:
              case "end":
                return _context.stop();
            }
          }, _callee);
        }));
        return function addBreakPoint(_x) {
          return _ref2.apply(this, arguments);
        };
      }();

      //删除断点，如果指定了line，删除指定行的断点，否则删除当前model里面的所有断点
      var removeBreakPoint = /*#__PURE__*/function () {
        var _ref3 = asyncToGenerator_default()( /*#__PURE__*/regeneratorRuntime_default()().mark(function _callee2(line) {
          var ids, decorations, _iterator4, _step4, decoration;
          return regeneratorRuntime_default()().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                ids = [];
                decorations = instance.getLineDecorations(line);
                _iterator4 = createForOfIteratorHelper_default()(decorations);
                try {
                  for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                    decoration = _step4.value;
                    if (decoration.options.linesDecorationsClassName === 'breakpoints-select') {
                      ids.push(decoration.id);
                    }
                  }
                } catch (err) {
                  _iterator4.e(err);
                } finally {
                  _iterator4.f();
                }
                _context2.next = 6;
                return model.deltaDecorations(ids, []);
              case 6:
                dealBreakPoint();
              case 7:
              case "end":
                return _context2.stop();
            }
          }, _callee2);
        }));
        return function removeBreakPoint(_x2) {
          return _ref3.apply(this, arguments);
        };
      }();

      //判断该行是否存在断点
      var hasBreakPoint = function hasBreakPoint(line) {
        var decorations = instance.getLineDecorations(line);
        var _iterator5 = createForOfIteratorHelper_default()(decorations),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var decoration = _step5.value;
            if (decoration.options.linesDecorationsClassName === 'breakpoints-select') {
              return true;
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
        return false;
      };

      // breakPointValue改变时赋予新的断点
      if (!(0,lodash.isEqual)(breakPointValue, dealBreakPoint(true).lines)) {
        model.deltaDecorations(dealBreakPoint(true).ids, []);
        var values = breakPointValue.map(function (line) {
          return {
            range: new monaco.Range(line, 1, line, 1),
            options: {
              isWholeLine: false,
              linesDecorationsClassName: 'breakpoints-select'
            }
          };
        });
        model.deltaDecorations([], values);
      }

      // let lastPosition

      var elModelContent = instance.onDidChangeModelContent(function (e) {
        //获取当前的鼠标位置
        var pos = instance.getPosition();
        if (pos) {
          //获取当前的行
          var line = pos.lineNumber;
          //如果当前行的内容为空，注释
          clearTimeout(noAllowTime.current);
          noAllowTime.current = setTimeout(function () {
            if (noAllow(model.getLineContent(line), line)) {
              removeBreakPoint(line);
            } else if (hasBreakPoint(line)) {
              //如果当前行存在断点，删除多余的断点只保留一个
              removeBreakPoint(line);
              addBreakPoint(line);
            } else {
              dealBreakPoint();
            }
          }, 100);
        }
      });
      var elMouseDown = instance.onMouseDown(function (e) {
        var _e$target;
        //这里限制了一下点击的位置，只有点击breakpoint应该出现的位置，才会创建，其他位置没反应
        if (e.target.detail && (_e$target = e.target) !== null && _e$target !== void 0 && (_e$target = _e$target.element) !== null && _e$target !== void 0 && (_e$target = _e$target.className) !== null && _e$target !== void 0 && _e$target.includes('line-numbers')) {
          var line = e.target.position.lineNumber;
          //空行,注释不创建
          if (noAllow(model.getLineContent(line), line)) {
            return;
          }
          //如果点击的位置没有的话创建breakpoint，有的话，删除
          if (!hasBreakPoint(line)) {
            addBreakPoint(line);
          } else {
            removeBreakPoint(line);
          }
          //如果存在上个位置，将鼠标移到上个位置，否则使editor失去焦点
          // if (lastPosition) {
          //   instance.setPosition(lastPosition)
          // } else {
          //   document.activeElement.blur()
          // }
        }
        //更新lastPosition为当前鼠标的位置（只有点击编辑器里面的内容的时候）
        // if (e.target.type === 6 || e.target.type === 7) {
        //   lastPosition = instance.getPosition()
        // }
      });

      //添加一个伪breakpoint
      var addFakeBreakPoint = function addFakeBreakPoint(line) {
        var value = {
          range: new monaco.Range(line, 1, line, 1),
          options: {
            isWholeLine: false,
            linesDecorationsClassName: 'breakpoints-fake'
          }
        };
        breakpointsFake.current = instance.deltaDecorations(breakpointsFake.current, [value]);
      };
      //删除所有的伪breakpoint
      var removeFakeBreakPoint = function removeFakeBreakPoint() {
        breakpointsFake.current = instance.deltaDecorations(breakpointsFake.current, []);
      };
      var elMouseMove = instance.onMouseMove(function (e) {
        var _e$target2;
        removeFakeBreakPoint();
        if (e.target.detail && (_e$target2 = e.target) !== null && _e$target2 !== void 0 && (_e$target2 = _e$target2.element) !== null && _e$target2 !== void 0 && (_e$target2 = _e$target2.className) !== null && _e$target2 !== void 0 && _e$target2.includes('line-numbers')) {
          var line = e.target.position.lineNumber;
          if (noAllow(model.getLineContent(line), line)) {
            return;
          }
          addFakeBreakPoint(line);
        }
      });
      var elMouseLeave = instance.onMouseLeave(function () {
        removeFakeBreakPoint();
      });

      // const elKeyDown = instance.onKeyDown(e => {
      //   if (e.code === 'Enter') {
      //     removeFakeBreakPoint()
      //   }
      // })
      return function () {
        elModelContent.dispose();
        elMouseDown.dispose();
        elMouseMove.dispose();
        elMouseLeave.dispose();
        // elKeyDown.dispose();
      };
    }
  }, [editor.current, init, breakPointValue, highlightLine, openBreakPoint, language]);

  //清除组件自带选中
  (0,_react_17_0_2_react.useEffect)(function () {
    var _editor$current2;
    if ((_editor$current2 = editor.current) !== null && _editor$current2 !== void 0 && _editor$current2.instance && openBreakPoint) {
      editor.current.instance.setPosition({
        lineNumber: 0,
        column: 0
      });
    }
  }, [highlightLine]);
  function onPaste() {
    var instance = editor.current.instance;
    if (instance) {
      var selection = instance.getSelection();
      var pastePos = editor.current.pastePos || {};
      var range = new monaco.Range(pastePos.startLineNumber || selection.endLineNumber, pastePos.startColumn || selection.endColumn, pastePos.endLineNumber || selection.endLineNumber, pastePos.endColumn || selection.endColumn);
      setTimeout(function () {
        instance.executeEdits('', [{
          range: range,
          text: ''
        }]);
      }, 300);
    }
  }
  function onSaveHandler(e) {
    if ((window.navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {
      e.preventDefault();
      onSave();
    }
  }
  var autoCalcHeight = function autoCalcHeight() {
    if (autoHeight && editor.current.instance) {
      var _height = editor.current.instance.getContentHeight();
      setFixedHeight(_height < height ? height : _height);
    } else {
      setFixedHeight(height);
    }
  };
  function fakeClick(obj) {
    var ev = document.createEvent('MouseEvents');
    ev.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    obj.dispatchEvent(ev);
  }
  var checkPaste = function checkPaste(event) {
    var keyCode = event.keyCode,
      ctrlKey = event.ctrlKey,
      metaKey = event.metaKey,
      target = event.target,
      type = event.type;
    if ((type === "paste" || (keyCode === 67 || keyCode === 86) && (metaKey || ctrlKey)) && target.nodeName === "TEXTAREA") {
      tipWarn();
      event.preventDefault();
    }
    return false;
  };
  function exportRaw(name, data) {
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    fakeClick(save_link);
  }
  (0,_react_17_0_2_react.useEffect)(function () {
    autoCalcHeight();
  }, [autoCalcHeight]);
  (0,_react_17_0_2_react.useEffect)(function () {
    if (editorEl.current && !init) {
      // require.config({ paths: { vs: 'monaco-editor/min/vs' } });
      // require.config({
      //   'vs/nls': {
      //     availableLanguages: {
      //       '*': 'de',
      //     },
      //   },
      // });
      Promise.all(/*! import() */[__webpack_require__.e(19208), __webpack_require__.e(39404), __webpack_require__.e(71448), __webpack_require__.e(73529)]).then(__webpack_require__.bind(__webpack_require__, /*! monaco-editor */ 71448)).then(function (mod) {
        try {
          monaco = mod;
          editor.current.instance = monaco.editor.create(editorEl.current, {
            value: value,
            language: getLanguageByMirrorName(language),
            theme: theme,
            requireConfig: {
              'vs/nls': {
                availableLanguages: {
                  '*': 'zh-cn'
                }
              }
            },
            wordWrap: true,
            autoIndent: true,
            contextmenu: true,
            // formatOnPaste: true,
            formatOnType: true
          }, overrideServices);
          var instance = editor.current.instance;
          var menus = actions/* MenuRegistry */.BH._menuItems;
          var contextMenuEntry = toConsumableArray_default()(menus).find(function (entry) {
            return entry[0]._debugName == "EditorContext";
          });
          var contextMenuLinks = contextMenuEntry[1];
          var removableIds = ["editor.action.clipboardCopyWithSyntaxHighlightingAction", "editor.action.quickCommand", "editor.action.clipboardCopyAction", "editor.action.clipboardPasteAction", "editor.action.clipboardCutAction"];
          var removeById = function removeById(list, ids) {
            var node = list._first;
            do {
              var _node$element;
              var shouldRemove = ids.includes((_node$element = node.element) === null || _node$element === void 0 || (_node$element = _node$element.command) === null || _node$element === void 0 ? void 0 : _node$element.id);
              if (shouldRemove) {
                list._remove(node);
              }
            } while (node = node.next);
          };
          editorDidMount(instance, monaco);
          setTimeout(function () {
            autoCalcHeight();
            editor.current.instance.addAction({
              id: 'd123123',
              label: 'Download File',
              contextMenuGroupId: '9_cutcopypaste',
              run: function run() {
                exportRaw(filename || 'educoder.txt', instance.getValue());
              }
            });

            // instance.getDomNode().addEventListener('input', () => {
            // if (optionsRef.current.autoFormat)
            // instance.getAction('editor.action.formatDocument').run();
            // });
          }, 500);
          editor.current.subscription = instance.onDidChangeModelContent(function (event) {
            if (!inputLock.current) {
              autoCalcHeight();
              onChange(instance.getValue(), event);
            } else {
              clearTimeout(inputLockTime.current);
            }
            inputLockTime.current = setTimeout(function () {
              inputLock.current = false;
            }, 500);
          });
          if (!window.Monaco) monaco_suggest_config(monaco, getLanguageByMirrorName(language));
          if (forbidCopy) {
            removeById(contextMenuLinks, removableIds);
            editorEl.current.classList.add("noCopyPaste");
            window.removeEventListener("keydown", checkPaste);
            window.removeEventListener("paste", checkPaste);
            window.addEventListener("keydown", checkPaste);
            window.addEventListener("paste", checkPaste);
          }
          window.Monaco = monaco;
          if (onEditBlur) {
            instance.onDidBlurEditorWidget(function () {
              onEditBlur(instance.getValue());
            });
          }
          if (onFocus) {
            instance.onDidFocusEditorText(function () {
              onFocus(instance.getValue());
            });
          }
          if (forbidCopy) {
            try {
              instance.onDidPaste(function (event) {
                var selection = instance.getSelection();
                var pastePos = editor.current.pastePos || {};
                var range = new monaco.Range(pastePos.startLineNumber || selection.endLineNumber, pastePos.startColumn || selection.endColumn, pastePos.endLineNumber || selection.endLineNumber, pastePos.endColumn || selection.endColumn);
                instance.executeEdits('', [{
                  range: event.range,
                  text: ''
                }]);
              });
              // window.addEventListener('paste', onPaste);
            } catch (e) {}
          }
          var ro = onLayout();
          if (placeholder && typeof placeholder === 'string') {
            new monaco_editor_placeholder(placeholder, instance, monaco);
          }
          setInit(true);
          return function () {
            var el = editor.current.instance;
            el.dispose();
            var model = el.getModel();
            if (model) {
              model.dispose();
            }
            if (editor.current.subscription) {
              editor.current.subscription.dispose();
            }
            // if (forbidCopy) {
            //   window.removeEventListener('paste', onPaste);
            // }
            ro.unobserve(editorEl.current);
          };
        } catch (e) {
          //  ;
        }
      });
    }
  }, []);
  (0,_react_17_0_2_react.useEffect)(function () {
    var instance = editor.current.instance;
    if (instance && init) {
      document.addEventListener('keydown', onSaveHandler, false);
      return function () {
        document.removeEventListener('keydown', onSaveHandler);
      };
    }
  }, [onSave, init]);
  (0,_react_17_0_2_react.useEffect)(function () {
    var instance = editor.current.instance;
    if (instance && init) {
      var lang = getLanguageByMirrorName(language);
      monaco.editor.setModelLanguage(instance.getModel(), lang);
    }
  }, [language, init]);
  (0,_react_17_0_2_react.useEffect)(function () {
    var instance = editor.current.instance;
    if (instance && init) {
      monaco.editor.setTheme(theme);
    }
  }, [theme, init]);
  (0,_react_17_0_2_react.useEffect)(function () {
    var instance = editor.current.instance;
    optionsRef.current = options;
    if (instance && init) {
      instance.updateOptions(objectSpread2_default()({}, options));
      setTimeout(function () {
        instance.getModel().updateOptions(objectSpread2_default()({}, options));
      }, 200);
    }
  }, [JSON.stringify(options), init]);
  (0,_react_17_0_2_react.useEffect)(function () {
    var instance = editor.current.instance;
    if (instance && init) {
      instance.layout();
    }
  }, [width, height, init]);

  // const fixedWidth = processSize(width);
  // const fixedHeight = processSize(height);

  var _useState3 = (0,_react_17_0_2_react.useState)(processSize(width)),
    _useState4 = slicedToArray_default()(_useState3, 2),
    fixedWidth = _useState4[0],
    setFixedWidth = _useState4[1];
  var _useState5 = (0,_react_17_0_2_react.useState)(processSize(height)),
    _useState6 = slicedToArray_default()(_useState5, 2),
    fixedHeight = _useState6[0],
    setFixedHeight = _useState6[1];
  var mergeStyle = objectSpread2_default()(objectSpread2_default()({}, style), {}, {
    width: fixedWidth,
    height: fixedHeight
  });
  return /*#__PURE__*/(0,jsx_runtime.jsx)("div", {
    className: "my-monaco-editor",
    ref: editorEl,
    style: mergeStyle
  });
});
function DiffEditor(_ref4) {
  var _ref4$width = _ref4.width,
    width = _ref4$width === void 0 ? '100%' : _ref4$width,
    _ref4$height = _ref4.height,
    height = _ref4$height === void 0 ? '100%' : _ref4$height,
    original = _ref4.original,
    modified = _ref4.modified,
    language = _ref4.language,
    _ref4$options = _ref4.options,
    options = _ref4$options === void 0 ? {} : _ref4$options;
  var editorEl = (0,_react_17_0_2_react.useRef)();
  var _useState7 = (0,_react_17_0_2_react.useState)(null),
    _useState8 = slicedToArray_default()(_useState7, 2),
    instance = _useState8[0],
    setInstance = _useState8[1];
  function onLayout(instance) {
    var ro;
    if (editorEl.current) {
      ro = new ResizeObserver_es/* default */.Z(function (entries) {
        var _iterator6 = createForOfIteratorHelper_default()(entries),
          _step6;
        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var entry = _step6.value;
            if (entry.target.offsetHeight > 0 || entry.target.offsetWidth > 0) {
              instance.layout();
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      });
      ro.observe(editorEl.current);
    }
    return ro;
  }
  (0,_react_17_0_2_react.useEffect)(function () {
    if (editorEl.current) {
      Promise.all(/*! import() | monaco-editor */[__webpack_require__.e(19208), __webpack_require__.e(39404)]).then(__webpack_require__.bind(__webpack_require__, /*! monaco-editor/esm/vs/editor/editor.api.js */ 2550)).then(function (mod) {
        monaco = mod;
        var instance = monaco.editor.createDiffEditor(editorEl.current, objectSpread2_default()(objectSpread2_default()({
          enableSplitViewResizing: false,
          scrollBeyondLastLine: false,
          roundedSelection: false,
          renderIndicators: false,
          useShadows: false,
          horizontal: 'hidden',
          lineNumbers: 'off',
          wordWrap: "off",
          ignoreTrimWhitespace: false,
          'semanticHighlighting.enabled': true,
          followsCaret: true,
          // resets the navigator state when the user selects something in the editor
          ignoreCharChanges: true,
          // jump from line to line,
          minimap: {
            enabled: false
          },
          readOnly: true
        }, options), {}, {
          wordWrap: true
        }));
        setInstance(instance);
        var ro = onLayout(instance);
        return function () {
          instance.dispose();
          var model = instance.getModel();
          if (model) {
            model.dispose();
          }
          ro.unobserve(editorEl.current);
        };
      });
    }
    return function () {
      window.removeEventListener("keydown", checkPaste);
      window.removeEventListener("paste", checkPaste);
    };
  }, []);
  (0,_react_17_0_2_react.useEffect)(function () {
    if (instance) {
      instance.setModel({
        original: monaco.editor.createModel(original, language),
        modified: monaco.editor.createModel(modified, language)
      });
    }
  }, [original, modified, language, instance]);
  var fixedWidth = processSize(width);
  var fixedHeight = processSize(height);
  var style = {
    width: fixedWidth,
    height: fixedHeight
  };
  return /*#__PURE__*/(0,jsx_runtime.jsx)("div", {
    className: "my-diff-editor",
    ref: editorEl,
    style: style
  });
}

/***/ })

}]);
})();
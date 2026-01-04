// ==UserScript==
// @name         Userjs digger
// @namespace    userjs-digger
// @version      0.6.4
// @author       enpitsulin <enpitsulin@gmail.com>
// @description  Show all userjs available in current site
// @license      MIT
// @icon         https://user-images.githubusercontent.com/29378026/227717136-4c9dfba4-0f90-41a2-905a-4cf19e751b5c.png
// @homepage     https://github.com/enpitsulin/userjs-digger#readme
// @homepageURL  https://github.com/enpitsulin/userjs-digger#readme
// @website      https://github.com/enpitsuLin/userjs-digger
// @source       https://github.com/enpitsulin/userjs-digger.git
// @include      *
// @require      https://unpkg.com/vue@3.3.4/dist/vue.global.prod.js
// @require      https://unpkg.com/psl@1.9.0/dist/psl.min.js
// @require      https://unpkg.com/vue-i18n@9.2.2/dist/vue-i18n.runtime.global.js
// @connect      greasyfork.org
// @grant        GM_deleteValue
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/462535/Userjs%20digger.user.js
// @updateURL https://update.greasyfork.org/scripts/462535/Userjs%20digger.meta.js
// ==/UserScript==

(e=>{const d=document.createElement("style");d.dataset.source="vite-plugin-monkey",d.textContent=e,document.head.append(d)})(" userjs-digger{--ud-text: #262626;--ud-text-secondary: #31313188;--ud-bg: #f5f5f5;--ud-bg-secondary: #d0d0d0;--ud-bg-hover: #d4d4d4;--ud-border: #e5e7eb;--ud-border-secondary: #d1d5db}.dark userjs-digger,[data-color-mode=dark] userjs-digger,[data-theme=dark] userjs-digger{--ud-text: #f5f5f5;--ud-text-secondary: #d5d5d588;--ud-bg: #262626;--ud-bg-secondary: #525252;--ud-bg-hover: #737373;--ud-border: #374151;--ud-border-secondary: #4b5563} ");

(function (require$$0, require$$1, require$$2) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	(function (module, exports) {
		(function(global2, factory) {
		  factory(require$$0, require$$1, require$$2) ;
		})(commonjsGlobal, function(vue, vueI18n, psl) {
	var __defProp = Object.defineProperty;
		var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
		var __publicField = (obj, key, value) => {
		  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
		  return value;
		};
		  const reset = '/*\nPlease read: https://github.com/unocss/unocss/blob/main/packages/reset/tailwind-compat.md\n*/\n\n/*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user\'s configured `sans` font-family by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user\'s configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type=\'button\'],\n[type=\'reset\'],\n[type=\'submit\'] {\n  -webkit-appearance: button; /* 1 */\n  /*will affect the button style of most component libraries, so disable it*/\n  /*https://github.com/unocss/unocss/issues/2127*/\n  /*background-color: transparent; !* 2 *!*/\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type=\'search\'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user\'s configured gray 400 color.\n*/\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don\'t get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden] {\n  display: none;\n}\n\n';
		  const resource$1 = {
		    "tip": (ctx) => {
		      const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		      return _normalize(["发现", _interpolate(_named("count")), "个脚本适用于网站 ", _interpolate(_named("host"))]);
		    },
		    "table": {
		      "toggle-expand": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["展开更多"]);
		      },
		      "title": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["脚本标题"]);
		      },
		      "daily": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["日安装量"]);
		      },
		      "update": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["更新时间"]);
		      },
		      "install": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["安装"]);
		      },
		      "version": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["版本"]);
		      },
		      "score": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["评分"]);
		      },
		      "total-installs": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["总安装量"]);
		      },
		      "authors": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["作者"]);
		      },
		      "description": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["脚本描述"]);
		      },
		      "empty": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["这个网站没有适用的脚本"]);
		      }
		    },
		    "settings": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["设置"]);
		    },
		    "language": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["语言"]);
		    },
		    "language-desc": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["切换用户语言设置"]);
		    },
		    "enable": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["本页启用"]);
		    },
		    "enable-desc": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["控制本页面是否启用功能(会话)"]);
		    },
		    "nsfw": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["成人内容"]);
		    },
		    "nsfw-desc": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["列表中展示Sleazyfork的搜索结果"]);
		    },
		    "filter": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["过滤"]);
		    },
		    "filter-desc": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["过滤标题含有指定内容或指定开发者的用户脚本"]);
		    },
		    "filter-tips": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["使用title:过滤标题或是author:指定开发者,没有相关描述则默认过滤标题,支持正则表达式"]);
		    },
		    "search-placeholder": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["为指定网站搜索用户脚本"]);
		    },
		    "time-ago": {
		      "just-now": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["就在刚刚"]);
		      },
		      "past": (ctx) => {
		        const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		        return _normalize([_interpolate(_named("n")), "前"]);
		      },
		      "future": (ctx) => {
		        const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		        return _normalize([_interpolate(_named("n")), "后"]);
		      },
		      "month": {
		        "past": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["上个月"]);
		        },
		        "future": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["下个月"]);
		        },
		        "n": (ctx) => {
		          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		          return _normalize([_interpolate(_named("n")), "个月"]);
		        }
		      },
		      "year": {
		        "past": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["去年"]);
		        },
		        "future": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["明年"]);
		        },
		        "n": (ctx) => {
		          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		          return _normalize([_interpolate(_named("n")), "年"]);
		        }
		      },
		      "day": {
		        "past": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["昨天"]);
		        },
		        "future": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["明天"]);
		        },
		        "n": (ctx) => {
		          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		          return _normalize([_interpolate(_named("n")), "天"]);
		        }
		      },
		      "week": {
		        "past": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["上周"]);
		        },
		        "future": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["下周"]);
		        },
		        "n": (ctx) => {
		          const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		          return _normalize([_interpolate(_named("n")), "周"]);
		        }
		      },
		      "hour": (ctx) => {
		        const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		        return _normalize([_interpolate(_named("n")), "小时"]);
		      },
		      "minute": (ctx) => {
		        const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		        return _normalize([_interpolate(_named("n")), "分钟"]);
		      },
		      "second": (ctx) => {
		        const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		        return _normalize([_interpolate(_named("n")), "秒"]);
		      },
		      "invalid": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["无效"]);
		      }
		    }
		  };
		  const resource = {
		    "tip": (ctx) => {
		      const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		      return _normalize(["Found ", _interpolate(_named("count")), " user scripts for the ", _interpolate(_named("host"))]);
		    },
		    "table": {
		      "toggle-expand": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["Toggle expand"]);
		      },
		      "title": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["Title"]);
		      },
		      "daily": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["Daily"]);
		      },
		      "update": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["Update"]);
		      },
		      "install": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["Install"]);
		      },
		      "version": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["Version"]);
		      },
		      "score": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["Score"]);
		      },
		      "total-installs": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["Total installs"]);
		      },
		      "authors": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["Author(s)"]);
		      },
		      "description": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["Description"]);
		      },
		      "empty": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["There has no Userjs for this site"]);
		      }
		    },
		    "settings": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["Settings"]);
		    },
		    "language": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["Language"]);
		    },
		    "language-desc": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["Switch language"]);
		    },
		    "enable": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["Enable on this page"]);
		    },
		    "enable-desc": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["To enable this plugin on this page or not (Session)"]);
		    },
		    "nsfw": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["NSFW"]);
		    },
		    "nsfw-desc": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["Show Sleazyfork's result in list"]);
		    },
		    "filter": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["Filter"]);
		    },
		    "filter-desc": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["Filter user script with specific content in title or specific developer"]);
		    },
		    "filter-tips": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["use title: to filter title or author: for developer, title for default"]);
		    },
		    "search-placeholder": (ctx) => {
		      const { normalize: _normalize } = ctx;
		      return _normalize(["Search user script for website"]);
		    },
		    "time-ago": {
		      "just-now": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize(["just now"]);
		      },
		      "past": (ctx) => {
		        const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		        return _normalize([_interpolate(_named("n")), " ago"]);
		      },
		      "future": (ctx) => {
		        const { normalize: _normalize, interpolate: _interpolate, named: _named } = ctx;
		        return _normalize(["in ", _interpolate(_named("n"))]);
		      },
		      "month": {
		        "past": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["last month"]);
		        },
		        "future": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["next month"]);
		        },
		        "n": (ctx) => {
		          const { normalize: _normalize, interpolate: _interpolate, named: _named, plural: _plural } = ctx;
		          return _plural([_normalize([_interpolate(_named("n")), " month"]), _normalize([_interpolate(_named("n")), " months"])]);
		        }
		      },
		      "year": {
		        "past": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["last year"]);
		        },
		        "future": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["next year"]);
		        },
		        "n": (ctx) => {
		          const { normalize: _normalize, interpolate: _interpolate, named: _named, plural: _plural } = ctx;
		          return _plural([_normalize([_interpolate(_named("n")), " year"]), _normalize([_interpolate(_named("n")), " years"])]);
		        }
		      },
		      "day": {
		        "past": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["yesterday"]);
		        },
		        "future": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["tomorrow"]);
		        },
		        "n": (ctx) => {
		          const { normalize: _normalize, interpolate: _interpolate, named: _named, plural: _plural } = ctx;
		          return _plural([_normalize([_interpolate(_named("n")), " day"]), _normalize([_interpolate(_named("n")), " days"])]);
		        }
		      },
		      "week": {
		        "past": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["last week"]);
		        },
		        "future": (ctx) => {
		          const { normalize: _normalize } = ctx;
		          return _normalize(["next week"]);
		        },
		        "n": (ctx) => {
		          const { normalize: _normalize, interpolate: _interpolate, named: _named, plural: _plural } = ctx;
		          return _plural([_normalize([_interpolate(_named("n")), " week"]), _normalize([_interpolate(_named("n")), " weeks"])]);
		        }
		      },
		      "hour": (ctx) => {
		        const { normalize: _normalize, interpolate: _interpolate, named: _named, plural: _plural } = ctx;
		        return _plural([_normalize([_interpolate(_named("n")), " hour"]), _normalize([_interpolate(_named("n")), " hours"])]);
		      },
		      "minute": (ctx) => {
		        const { normalize: _normalize, interpolate: _interpolate, named: _named, plural: _plural } = ctx;
		        return _plural([_normalize([_interpolate(_named("n")), " minute"]), _normalize([_interpolate(_named("n")), " minutes"])]);
		      },
		      "second": (ctx) => {
		        const { normalize: _normalize, interpolate: _interpolate, named: _named, plural: _plural } = ctx;
		        return _plural([_normalize([_interpolate(_named("n")), " second"]), _normalize([_interpolate(_named("n")), " seconds"])]);
		      },
		      "invalid": (ctx) => {
		        const { normalize: _normalize } = ctx;
		        return _normalize([]);
		      }
		    }
		  };
		  function tryOnScopeDispose(fn) {
		    if (vue.getCurrentScope()) {
		      vue.onScopeDispose(fn);
		      return true;
		    }
		    return false;
		  }
		  function createEventHook() {
		    const fns = /* @__PURE__ */ new Set();
		    const off = (fn) => {
		      fns.delete(fn);
		    };
		    const on = (fn) => {
		      fns.add(fn);
		      const offFn = () => off(fn);
		      tryOnScopeDispose(offFn);
		      return {
		        off: offFn
		      };
		    };
		    const trigger = (param) => {
		      return Promise.all(Array.from(fns).map((fn) => fn(param)));
		    };
		    return {
		      on,
		      off,
		      trigger
		    };
		  }
		  function createGlobalState(stateFactory) {
		    let initialized = false;
		    let state;
		    const scope = vue.effectScope(true);
		    return (...args) => {
		      if (!initialized) {
		        state = scope.run(() => stateFactory(...args));
		        initialized = true;
		      }
		      return state;
		    };
		  }
		  function toValue(r) {
		    return typeof r === "function" ? r() : vue.unref(r);
		  }
		  const resolveUnref = toValue;
		  const isClient = typeof window !== "undefined";
		  const noop = () => {
		  };
		  const isIOS = /* @__PURE__ */ getIsIOS();
		  function getIsIOS() {
		    var _a;
		    return isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /* @__PURE__ */ /iP(ad|hone|od)/.test(window.navigator.userAgent);
		  }
		  function createFilterWrapper(filter, fn) {
		    function wrapper(...args) {
		      return new Promise((resolve, reject) => {
		        Promise.resolve(filter(() => fn.apply(this, args), { fn, thisArg: this, args })).then(resolve).catch(reject);
		      });
		    }
		    return wrapper;
		  }
		  const bypassFilter = (invoke) => {
		    return invoke();
		  };
		  function debounceFilter(ms, options = {}) {
		    let timer;
		    let maxTimer;
		    let lastRejector = noop;
		    const _clearTimeout = (timer2) => {
		      clearTimeout(timer2);
		      lastRejector();
		      lastRejector = noop;
		    };
		    const filter = (invoke) => {
		      const duration = toValue(ms);
		      const maxDuration = toValue(options.maxWait);
		      if (timer)
		        _clearTimeout(timer);
		      if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
		        if (maxTimer) {
		          _clearTimeout(maxTimer);
		          maxTimer = null;
		        }
		        return Promise.resolve(invoke());
		      }
		      return new Promise((resolve, reject) => {
		        lastRejector = options.rejectOnCancel ? reject : resolve;
		        if (maxDuration && !maxTimer) {
		          maxTimer = setTimeout(() => {
		            if (timer)
		              _clearTimeout(timer);
		            maxTimer = null;
		            resolve(invoke());
		          }, maxDuration);
		        }
		        timer = setTimeout(() => {
		          if (maxTimer)
		            _clearTimeout(maxTimer);
		          maxTimer = null;
		          resolve(invoke());
		        }, duration);
		      });
		    };
		    return filter;
		  }
		  function throttleFilter(ms, trailing = true, leading = true, rejectOnCancel = false) {
		    let lastExec = 0;
		    let timer;
		    let isLeading = true;
		    let lastRejector = noop;
		    let lastValue;
		    const clear = () => {
		      if (timer) {
		        clearTimeout(timer);
		        timer = void 0;
		        lastRejector();
		        lastRejector = noop;
		      }
		    };
		    const filter = (_invoke) => {
		      const duration = toValue(ms);
		      const elapsed = Date.now() - lastExec;
		      const invoke = () => {
		        return lastValue = _invoke();
		      };
		      clear();
		      if (duration <= 0) {
		        lastExec = Date.now();
		        return invoke();
		      }
		      if (elapsed > duration && (leading || !isLeading)) {
		        lastExec = Date.now();
		        invoke();
		      } else if (trailing) {
		        lastValue = new Promise((resolve, reject) => {
		          lastRejector = rejectOnCancel ? reject : resolve;
		          timer = setTimeout(() => {
		            lastExec = Date.now();
		            isLeading = true;
		            resolve(invoke());
		            clear();
		          }, Math.max(0, duration - elapsed));
		        });
		      }
		      if (!leading && !timer)
		        timer = setTimeout(() => isLeading = true, duration);
		      isLeading = false;
		      return lastValue;
		    };
		    return filter;
		  }
		  function pausableFilter(extendFilter = bypassFilter) {
		    const isActive = vue.ref(true);
		    function pause() {
		      isActive.value = false;
		    }
		    function resume() {
		      isActive.value = true;
		    }
		    const eventFilter = (...args) => {
		      if (isActive.value)
		        extendFilter(...args);
		    };
		    return { isActive: vue.readonly(isActive), pause, resume, eventFilter };
		  }
		  function promiseTimeout(ms, throwOnTimeout = false, reason = "Timeout") {
		    return new Promise((resolve, reject) => {
		      if (throwOnTimeout)
		        setTimeout(() => reject(reason), ms);
		      else
		        setTimeout(resolve, ms);
		    });
		  }
		  function containsProp(obj, ...props) {
		    return props.some((k) => k in obj);
		  }
		  function toRef(...args) {
		    if (args.length !== 1)
		      return vue.toRef(...args);
		    const r = args[0];
		    return typeof r === "function" ? vue.readonly(vue.customRef(() => ({ get: r, set: noop }))) : vue.ref(r);
		  }
		  function useThrottleFn(fn, ms = 200, trailing = false, leading = true, rejectOnCancel = false) {
		    return createFilterWrapper(
		      throttleFilter(ms, trailing, leading, rejectOnCancel),
		      fn
		    );
		  }
		  var __defProp$9 = Object.defineProperty;
		  var __defProps$7 = Object.defineProperties;
		  var __getOwnPropDescs$7 = Object.getOwnPropertyDescriptors;
		  var __getOwnPropSymbols$b = Object.getOwnPropertySymbols;
		  var __hasOwnProp$b = Object.prototype.hasOwnProperty;
		  var __propIsEnum$b = Object.prototype.propertyIsEnumerable;
		  var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
		  var __spreadValues$9 = (a, b) => {
		    for (var prop in b || (b = {}))
		      if (__hasOwnProp$b.call(b, prop))
		        __defNormalProp$9(a, prop, b[prop]);
		    if (__getOwnPropSymbols$b)
		      for (var prop of __getOwnPropSymbols$b(b)) {
		        if (__propIsEnum$b.call(b, prop))
		          __defNormalProp$9(a, prop, b[prop]);
		      }
		    return a;
		  };
		  var __spreadProps$7 = (a, b) => __defProps$7(a, __getOwnPropDescs$7(b));
		  function toRefs(objectRef, options = {}) {
		    if (!vue.isRef(objectRef))
		      return vue.toRefs(objectRef);
		    const result = Array.isArray(objectRef.value) ? Array.from({ length: objectRef.value.length }) : {};
		    for (const key in objectRef.value) {
		      result[key] = vue.customRef(() => ({
		        get() {
		          return objectRef.value[key];
		        },
		        set(v) {
		          var _a;
		          const replaceRef = (_a = toValue(options.replaceRef)) != null ? _a : true;
		          if (replaceRef) {
		            if (Array.isArray(objectRef.value)) {
		              const copy = [...objectRef.value];
		              copy[key] = v;
		              objectRef.value = copy;
		            } else {
		              const newObject = __spreadProps$7(__spreadValues$9({}, objectRef.value), { [key]: v });
		              Object.setPrototypeOf(newObject, Object.getPrototypeOf(objectRef.value));
		              objectRef.value = newObject;
		            }
		          } else {
		            objectRef.value[key] = v;
		          }
		        }
		      }));
		    }
		    return result;
		  }
		  function tryOnMounted(fn, sync = true) {
		    if (vue.getCurrentInstance())
		      vue.onMounted(fn);
		    else if (sync)
		      fn();
		    else
		      vue.nextTick(fn);
		  }
		  function tryOnUnmounted(fn) {
		    if (vue.getCurrentInstance())
		      vue.onUnmounted(fn);
		  }
		  function createUntil(r, isNot = false) {
		    function toMatch(condition, { flush = "sync", deep = false, timeout, throwOnTimeout } = {}) {
		      let stop = null;
		      const watcher = new Promise((resolve) => {
		        stop = vue.watch(
		          r,
		          (v) => {
		            if (condition(v) !== isNot) {
		              stop == null ? void 0 : stop();
		              resolve(v);
		            }
		          },
		          {
		            flush,
		            deep,
		            immediate: true
		          }
		        );
		      });
		      const promises = [watcher];
		      if (timeout != null) {
		        promises.push(
		          promiseTimeout(timeout, throwOnTimeout).then(() => toValue(r)).finally(() => stop == null ? void 0 : stop())
		        );
		      }
		      return Promise.race(promises);
		    }
		    function toBe(value, options) {
		      if (!vue.isRef(value))
		        return toMatch((v) => v === value, options);
		      const { flush = "sync", deep = false, timeout, throwOnTimeout } = options != null ? options : {};
		      let stop = null;
		      const watcher = new Promise((resolve) => {
		        stop = vue.watch(
		          [r, value],
		          ([v1, v2]) => {
		            if (isNot !== (v1 === v2)) {
		              stop == null ? void 0 : stop();
		              resolve(v1);
		            }
		          },
		          {
		            flush,
		            deep,
		            immediate: true
		          }
		        );
		      });
		      const promises = [watcher];
		      if (timeout != null) {
		        promises.push(
		          promiseTimeout(timeout, throwOnTimeout).then(() => toValue(r)).finally(() => {
		            stop == null ? void 0 : stop();
		            return toValue(r);
		          })
		        );
		      }
		      return Promise.race(promises);
		    }
		    function toBeTruthy(options) {
		      return toMatch((v) => Boolean(v), options);
		    }
		    function toBeNull(options) {
		      return toBe(null, options);
		    }
		    function toBeUndefined(options) {
		      return toBe(void 0, options);
		    }
		    function toBeNaN(options) {
		      return toMatch(Number.isNaN, options);
		    }
		    function toContains(value, options) {
		      return toMatch((v) => {
		        const array = Array.from(v);
		        return array.includes(value) || array.includes(toValue(value));
		      }, options);
		    }
		    function changed(options) {
		      return changedTimes(1, options);
		    }
		    function changedTimes(n = 1, options) {
		      let count = -1;
		      return toMatch(() => {
		        count += 1;
		        return count >= n;
		      }, options);
		    }
		    if (Array.isArray(toValue(r))) {
		      const instance = {
		        toMatch,
		        toContains,
		        changed,
		        changedTimes,
		        get not() {
		          return createUntil(r, !isNot);
		        }
		      };
		      return instance;
		    } else {
		      const instance = {
		        toMatch,
		        toBe,
		        toBeTruthy,
		        toBeNull,
		        toBeNaN,
		        toBeUndefined,
		        changed,
		        changedTimes,
		        get not() {
		          return createUntil(r, !isNot);
		        }
		      };
		      return instance;
		    }
		  }
		  function until(r) {
		    return createUntil(r);
		  }
		  function useTimeoutFn(cb, interval, options = {}) {
		    const {
		      immediate = true
		    } = options;
		    const isPending = vue.ref(false);
		    let timer = null;
		    function clear() {
		      if (timer) {
		        clearTimeout(timer);
		        timer = null;
		      }
		    }
		    function stop() {
		      isPending.value = false;
		      clear();
		    }
		    function start(...args) {
		      clear();
		      isPending.value = true;
		      timer = setTimeout(() => {
		        isPending.value = false;
		        timer = null;
		        cb(...args);
		      }, toValue(interval));
		    }
		    if (immediate) {
		      isPending.value = true;
		      if (isClient)
		        start();
		    }
		    tryOnScopeDispose(stop);
		    return {
		      isPending: vue.readonly(isPending),
		      start,
		      stop
		    };
		  }
		  function useToggle(initialValue = false, options = {}) {
		    const {
		      truthyValue = true,
		      falsyValue = false
		    } = options;
		    const valueIsRef = vue.isRef(initialValue);
		    const _value = vue.ref(initialValue);
		    function toggle(value) {
		      if (arguments.length) {
		        _value.value = value;
		        return _value.value;
		      } else {
		        const truthy = toValue(truthyValue);
		        _value.value = _value.value === truthy ? toValue(falsyValue) : truthy;
		        return _value.value;
		      }
		    }
		    if (valueIsRef)
		      return toggle;
		    else
		      return [_value, toggle];
		  }
		  function watchArray(source, cb, options) {
		    let oldList = (options == null ? void 0 : options.immediate) ? [] : [
		      ...source instanceof Function ? source() : Array.isArray(source) ? source : toValue(source)
		    ];
		    return vue.watch(source, (newList, _, onCleanup) => {
		      const oldListRemains = Array.from({ length: oldList.length });
		      const added = [];
		      for (const obj of newList) {
		        let found = false;
		        for (let i = 0; i < oldList.length; i++) {
		          if (!oldListRemains[i] && obj === oldList[i]) {
		            oldListRemains[i] = true;
		            found = true;
		            break;
		          }
		        }
		        if (!found)
		          added.push(obj);
		      }
		      const removed = oldList.filter((_2, i) => !oldListRemains[i]);
		      cb(newList, oldList, added, removed, onCleanup);
		      oldList = [...newList];
		    }, options);
		  }
		  var __getOwnPropSymbols$8 = Object.getOwnPropertySymbols;
		  var __hasOwnProp$8 = Object.prototype.hasOwnProperty;
		  var __propIsEnum$8 = Object.prototype.propertyIsEnumerable;
		  var __objRest$5 = (source, exclude) => {
		    var target = {};
		    for (var prop in source)
		      if (__hasOwnProp$8.call(source, prop) && exclude.indexOf(prop) < 0)
		        target[prop] = source[prop];
		    if (source != null && __getOwnPropSymbols$8)
		      for (var prop of __getOwnPropSymbols$8(source)) {
		        if (exclude.indexOf(prop) < 0 && __propIsEnum$8.call(source, prop))
		          target[prop] = source[prop];
		      }
		    return target;
		  };
		  function watchWithFilter(source, cb, options = {}) {
		    const _a = options, {
		      eventFilter = bypassFilter
		    } = _a, watchOptions = __objRest$5(_a, [
		      "eventFilter"
		    ]);
		    return vue.watch(
		      source,
		      createFilterWrapper(
		        eventFilter,
		        cb
		      ),
		      watchOptions
		    );
		  }
		  var __defProp$6 = Object.defineProperty;
		  var __defProps$6$1 = Object.defineProperties;
		  var __getOwnPropDescs$6$1 = Object.getOwnPropertyDescriptors;
		  var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
		  var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
		  var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
		  var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
		  var __spreadValues$6 = (a, b) => {
		    for (var prop in b || (b = {}))
		      if (__hasOwnProp$6.call(b, prop))
		        __defNormalProp$6(a, prop, b[prop]);
		    if (__getOwnPropSymbols$6)
		      for (var prop of __getOwnPropSymbols$6(b)) {
		        if (__propIsEnum$6.call(b, prop))
		          __defNormalProp$6(a, prop, b[prop]);
		      }
		    return a;
		  };
		  var __spreadProps$6$1 = (a, b) => __defProps$6$1(a, __getOwnPropDescs$6$1(b));
		  var __objRest$3 = (source, exclude) => {
		    var target = {};
		    for (var prop in source)
		      if (__hasOwnProp$6.call(source, prop) && exclude.indexOf(prop) < 0)
		        target[prop] = source[prop];
		    if (source != null && __getOwnPropSymbols$6)
		      for (var prop of __getOwnPropSymbols$6(source)) {
		        if (exclude.indexOf(prop) < 0 && __propIsEnum$6.call(source, prop))
		          target[prop] = source[prop];
		      }
		    return target;
		  };
		  function watchDebounced(source, cb, options = {}) {
		    const _a = options, {
		      debounce = 0,
		      maxWait = void 0
		    } = _a, watchOptions = __objRest$3(_a, [
		      "debounce",
		      "maxWait"
		    ]);
		    return watchWithFilter(
		      source,
		      cb,
		      __spreadProps$6$1(__spreadValues$6({}, watchOptions), {
		        eventFilter: debounceFilter(debounce, { maxWait })
		      })
		    );
		  }
		  var __defProp$2 = Object.defineProperty;
		  var __defProps$2 = Object.defineProperties;
		  var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
		  var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
		  var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
		  var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
		  var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
		  var __spreadValues$2 = (a, b) => {
		    for (var prop in b || (b = {}))
		      if (__hasOwnProp$2.call(b, prop))
		        __defNormalProp$2(a, prop, b[prop]);
		    if (__getOwnPropSymbols$2)
		      for (var prop of __getOwnPropSymbols$2(b)) {
		        if (__propIsEnum$2.call(b, prop))
		          __defNormalProp$2(a, prop, b[prop]);
		      }
		    return a;
		  };
		  var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
		  var __objRest$1 = (source, exclude) => {
		    var target = {};
		    for (var prop in source)
		      if (__hasOwnProp$2.call(source, prop) && exclude.indexOf(prop) < 0)
		        target[prop] = source[prop];
		    if (source != null && __getOwnPropSymbols$2)
		      for (var prop of __getOwnPropSymbols$2(source)) {
		        if (exclude.indexOf(prop) < 0 && __propIsEnum$2.call(source, prop))
		          target[prop] = source[prop];
		      }
		    return target;
		  };
		  function watchPausable(source, cb, options = {}) {
		    const _a = options, {
		      eventFilter: filter
		    } = _a, watchOptions = __objRest$1(_a, [
		      "eventFilter"
		    ]);
		    const { eventFilter, pause, resume, isActive } = pausableFilter(filter);
		    const stop = watchWithFilter(
		      source,
		      cb,
		      __spreadProps$2(__spreadValues$2({}, watchOptions), {
		        eventFilter
		      })
		    );
		    return { stop, pause, resume, isActive };
		  }
		  function unrefElement(elRef) {
		    var _a;
		    const plain = toValue(elRef);
		    return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
		  }
		  const defaultWindow = isClient ? window : void 0;
		  const defaultDocument = isClient ? window.document : void 0;
		  function useEventListener(...args) {
		    let target;
		    let events;
		    let listeners;
		    let options;
		    if (typeof args[0] === "string" || Array.isArray(args[0])) {
		      [events, listeners, options] = args;
		      target = defaultWindow;
		    } else {
		      [target, events, listeners, options] = args;
		    }
		    if (!target)
		      return noop;
		    if (!Array.isArray(events))
		      events = [events];
		    if (!Array.isArray(listeners))
		      listeners = [listeners];
		    const cleanups = [];
		    const cleanup = () => {
		      cleanups.forEach((fn) => fn());
		      cleanups.length = 0;
		    };
		    const register = (el, event, listener, options2) => {
		      el.addEventListener(event, listener, options2);
		      return () => el.removeEventListener(event, listener, options2);
		    };
		    const stopWatch = vue.watch(
		      () => [unrefElement(target), toValue(options)],
		      ([el, options2]) => {
		        cleanup();
		        if (!el)
		          return;
		        cleanups.push(
		          ...events.flatMap((event) => {
		            return listeners.map((listener) => register(el, event, listener, options2));
		          })
		        );
		      },
		      { immediate: true, flush: "post" }
		    );
		    const stop = () => {
		      stopWatch();
		      cleanup();
		    };
		    tryOnScopeDispose(stop);
		    return stop;
		  }
		  let _iOSWorkaround = false;
		  function onClickOutside(target, handler, options = {}) {
		    const { window: window2 = defaultWindow, ignore = [], capture = true, detectIframe = false } = options;
		    if (!window2)
		      return;
		    if (isIOS && !_iOSWorkaround) {
		      _iOSWorkaround = true;
		      Array.from(window2.document.body.children).forEach((el) => el.addEventListener("click", noop));
		      window2.document.documentElement.addEventListener("click", noop);
		    }
		    let shouldListen = true;
		    const shouldIgnore = (event) => {
		      return ignore.some((target2) => {
		        if (typeof target2 === "string") {
		          return Array.from(window2.document.querySelectorAll(target2)).some((el) => el === event.target || event.composedPath().includes(el));
		        } else {
		          const el = unrefElement(target2);
		          return el && (event.target === el || event.composedPath().includes(el));
		        }
		      });
		    };
		    const listener = (event) => {
		      const el = unrefElement(target);
		      if (!el || el === event.target || event.composedPath().includes(el))
		        return;
		      if (event.detail === 0)
		        shouldListen = !shouldIgnore(event);
		      if (!shouldListen) {
		        shouldListen = true;
		        return;
		      }
		      handler(event);
		    };
		    const cleanup = [
		      useEventListener(window2, "click", listener, { passive: true, capture }),
		      useEventListener(window2, "pointerdown", (e) => {
		        const el = unrefElement(target);
		        if (el)
		          shouldListen = !e.composedPath().includes(el) && !shouldIgnore(e);
		      }, { passive: true }),
		      detectIframe && useEventListener(window2, "blur", (event) => {
		        setTimeout(() => {
		          var _a;
		          const el = unrefElement(target);
		          if (((_a = window2.document.activeElement) == null ? void 0 : _a.tagName) === "IFRAME" && !(el == null ? void 0 : el.contains(window2.document.activeElement)))
		            handler(event);
		        }, 0);
		      })
		    ].filter(Boolean);
		    const stop = () => cleanup.forEach((fn) => fn());
		    return stop;
		  }
		  function useMounted() {
		    const isMounted = vue.ref(false);
		    if (vue.getCurrentInstance()) {
		      vue.onMounted(() => {
		        isMounted.value = true;
		      });
		    }
		    return isMounted;
		  }
		  function useSupported(callback) {
		    const isMounted = useMounted();
		    return vue.computed(() => {
		      isMounted.value;
		      return Boolean(callback());
		    });
		  }
		  function useMediaQuery(query, options = {}) {
		    const { window: window2 = defaultWindow } = options;
		    const isSupported = useSupported(() => window2 && "matchMedia" in window2 && typeof window2.matchMedia === "function");
		    let mediaQuery;
		    const matches = vue.ref(false);
		    const handler = (event) => {
		      matches.value = event.matches;
		    };
		    const cleanup = () => {
		      if (!mediaQuery)
		        return;
		      if ("removeEventListener" in mediaQuery)
		        mediaQuery.removeEventListener("change", handler);
		      else
		        mediaQuery.removeListener(handler);
		    };
		    const stopWatch = vue.watchEffect(() => {
		      if (!isSupported.value)
		        return;
		      cleanup();
		      mediaQuery = window2.matchMedia(toValue(query));
		      if ("addEventListener" in mediaQuery)
		        mediaQuery.addEventListener("change", handler);
		      else
		        mediaQuery.addListener(handler);
		      matches.value = mediaQuery.matches;
		    });
		    tryOnScopeDispose(() => {
		      stopWatch();
		      cleanup();
		      mediaQuery = void 0;
		    });
		    return matches;
		  }
		  const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : {};
		  const globalKey = "__vueuse_ssr_handlers__";
		  const handlers = /* @__PURE__ */ getHandlers();
		  function getHandlers() {
		    if (!(globalKey in _global))
		      _global[globalKey] = _global[globalKey] || {};
		    return _global[globalKey];
		  }
		  function getSSRHandler(key, fallback) {
		    return handlers[key] || fallback;
		  }
		  function guessSerializerType(rawInit) {
		    return rawInit == null ? "any" : rawInit instanceof Set ? "set" : rawInit instanceof Map ? "map" : rawInit instanceof Date ? "date" : typeof rawInit === "boolean" ? "boolean" : typeof rawInit === "string" ? "string" : typeof rawInit === "object" ? "object" : !Number.isNaN(rawInit) ? "number" : "any";
		  }
		  var __defProp$l = Object.defineProperty;
		  var __getOwnPropSymbols$o = Object.getOwnPropertySymbols;
		  var __hasOwnProp$o = Object.prototype.hasOwnProperty;
		  var __propIsEnum$o = Object.prototype.propertyIsEnumerable;
		  var __defNormalProp$l = (obj, key, value) => key in obj ? __defProp$l(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
		  var __spreadValues$l = (a, b) => {
		    for (var prop in b || (b = {}))
		      if (__hasOwnProp$o.call(b, prop))
		        __defNormalProp$l(a, prop, b[prop]);
		    if (__getOwnPropSymbols$o)
		      for (var prop of __getOwnPropSymbols$o(b)) {
		        if (__propIsEnum$o.call(b, prop))
		          __defNormalProp$l(a, prop, b[prop]);
		      }
		    return a;
		  };
		  const StorageSerializers = {
		    boolean: {
		      read: (v) => v === "true",
		      write: (v) => String(v)
		    },
		    object: {
		      read: (v) => JSON.parse(v),
		      write: (v) => JSON.stringify(v)
		    },
		    number: {
		      read: (v) => Number.parseFloat(v),
		      write: (v) => String(v)
		    },
		    any: {
		      read: (v) => v,
		      write: (v) => String(v)
		    },
		    string: {
		      read: (v) => v,
		      write: (v) => String(v)
		    },
		    map: {
		      read: (v) => new Map(JSON.parse(v)),
		      write: (v) => JSON.stringify(Array.from(v.entries()))
		    },
		    set: {
		      read: (v) => new Set(JSON.parse(v)),
		      write: (v) => JSON.stringify(Array.from(v))
		    },
		    date: {
		      read: (v) => new Date(v),
		      write: (v) => v.toISOString()
		    }
		  };
		  const customStorageEventName = "vueuse-storage";
		  function useStorage(key, defaults, storage, options = {}) {
		    var _a;
		    const {
		      flush = "pre",
		      deep = true,
		      listenToStorageChanges = true,
		      writeDefaults = true,
		      mergeDefaults = false,
		      shallow,
		      window: window2 = defaultWindow,
		      eventFilter,
		      onError = (e) => {
		        console.error(e);
		      }
		    } = options;
		    const data = (shallow ? vue.shallowRef : vue.ref)(defaults);
		    if (!storage) {
		      try {
		        storage = getSSRHandler("getDefaultStorage", () => {
		          var _a2;
		          return (_a2 = defaultWindow) == null ? void 0 : _a2.localStorage;
		        })();
		      } catch (e) {
		        onError(e);
		      }
		    }
		    if (!storage)
		      return data;
		    const rawInit = toValue(defaults);
		    const type = guessSerializerType(rawInit);
		    const serializer = (_a = options.serializer) != null ? _a : StorageSerializers[type];
		    const { pause: pauseWatch, resume: resumeWatch } = watchPausable(
		      data,
		      () => write(data.value),
		      { flush, deep, eventFilter }
		    );
		    if (window2 && listenToStorageChanges) {
		      useEventListener(window2, "storage", update);
		      useEventListener(window2, customStorageEventName, updateFromCustomEvent);
		    }
		    update();
		    return data;
		    function write(v) {
		      try {
		        if (v == null) {
		          storage.removeItem(key);
		        } else {
		          const serialized = serializer.write(v);
		          const oldValue = storage.getItem(key);
		          if (oldValue !== serialized) {
		            storage.setItem(key, serialized);
		            if (window2) {
		              window2.dispatchEvent(new CustomEvent(customStorageEventName, {
		                detail: {
		                  key,
		                  oldValue,
		                  newValue: serialized,
		                  storageArea: storage
		                }
		              }));
		            }
		          }
		        }
		      } catch (e) {
		        onError(e);
		      }
		    }
		    function read(event) {
		      const rawValue = event ? event.newValue : storage.getItem(key);
		      if (rawValue == null) {
		        if (writeDefaults && rawInit !== null)
		          storage.setItem(key, serializer.write(rawInit));
		        return rawInit;
		      } else if (!event && mergeDefaults) {
		        const value = serializer.read(rawValue);
		        if (typeof mergeDefaults === "function")
		          return mergeDefaults(value, rawInit);
		        else if (type === "object" && !Array.isArray(value))
		          return __spreadValues$l(__spreadValues$l({}, rawInit), value);
		        return value;
		      } else if (typeof rawValue !== "string") {
		        return rawValue;
		      } else {
		        return serializer.read(rawValue);
		      }
		    }
		    function updateFromCustomEvent(event) {
		      update(event.detail);
		    }
		    function update(event) {
		      if (event && event.storageArea !== storage)
		        return;
		      if (event && event.key == null) {
		        data.value = rawInit;
		        return;
		      }
		      if (event && event.key !== key)
		        return;
		      pauseWatch();
		      try {
		        data.value = read(event);
		      } catch (e) {
		        onError(e);
		      } finally {
		        if (event)
		          vue.nextTick(resumeWatch);
		        else
		          resumeWatch();
		      }
		    }
		  }
		  var __defProp$g = Object.defineProperty;
		  var __defProps$6 = Object.defineProperties;
		  var __getOwnPropDescs$6 = Object.getOwnPropertyDescriptors;
		  var __getOwnPropSymbols$i = Object.getOwnPropertySymbols;
		  var __hasOwnProp$i = Object.prototype.hasOwnProperty;
		  var __propIsEnum$i = Object.prototype.propertyIsEnumerable;
		  var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
		  var __spreadValues$g = (a, b) => {
		    for (var prop in b || (b = {}))
		      if (__hasOwnProp$i.call(b, prop))
		        __defNormalProp$g(a, prop, b[prop]);
		    if (__getOwnPropSymbols$i)
		      for (var prop of __getOwnPropSymbols$i(b)) {
		        if (__propIsEnum$i.call(b, prop))
		          __defNormalProp$g(a, prop, b[prop]);
		      }
		    return a;
		  };
		  var __spreadProps$6 = (a, b) => __defProps$6(a, __getOwnPropDescs$6(b));
		  function useDraggable(target, options = {}) {
		    var _a, _b;
		    const {
		      pointerTypes,
		      preventDefault,
		      stopPropagation,
		      exact,
		      onMove,
		      onEnd,
		      onStart,
		      initialValue,
		      axis = "both",
		      draggingElement = defaultWindow,
		      handle: draggingHandle = target
		    } = options;
		    const position = vue.ref(
		      (_a = toValue(initialValue)) != null ? _a : { x: 0, y: 0 }
		    );
		    const pressedDelta = vue.ref();
		    const filterEvent = (e) => {
		      if (pointerTypes)
		        return pointerTypes.includes(e.pointerType);
		      return true;
		    };
		    const handleEvent = (e) => {
		      if (toValue(preventDefault))
		        e.preventDefault();
		      if (toValue(stopPropagation))
		        e.stopPropagation();
		    };
		    const start = (e) => {
		      if (!filterEvent(e))
		        return;
		      if (toValue(exact) && e.target !== toValue(target))
		        return;
		      const rect = toValue(target).getBoundingClientRect();
		      const pos = {
		        x: e.clientX - rect.left,
		        y: e.clientY - rect.top
		      };
		      if ((onStart == null ? void 0 : onStart(pos, e)) === false)
		        return;
		      pressedDelta.value = pos;
		      handleEvent(e);
		    };
		    const move = (e) => {
		      if (!filterEvent(e))
		        return;
		      if (!pressedDelta.value)
		        return;
		      let { x, y } = position.value;
		      if (axis === "x" || axis === "both")
		        x = e.clientX - pressedDelta.value.x;
		      if (axis === "y" || axis === "both")
		        y = e.clientY - pressedDelta.value.y;
		      position.value = {
		        x,
		        y
		      };
		      onMove == null ? void 0 : onMove(position.value, e);
		      handleEvent(e);
		    };
		    const end = (e) => {
		      if (!filterEvent(e))
		        return;
		      if (!pressedDelta.value)
		        return;
		      pressedDelta.value = void 0;
		      onEnd == null ? void 0 : onEnd(position.value, e);
		      handleEvent(e);
		    };
		    if (isClient) {
		      const config = { capture: (_b = options.capture) != null ? _b : true };
		      useEventListener(draggingHandle, "pointerdown", start, config);
		      useEventListener(draggingElement, "pointermove", move, config);
		      useEventListener(draggingElement, "pointerup", end, config);
		    }
		    return __spreadProps$6(__spreadValues$g({}, toRefs(position)), {
		      position,
		      isDragging: vue.computed(() => !!pressedDelta.value),
		      style: vue.computed(
		        () => `left:${position.value.x}px;top:${position.value.y}px;`
		      )
		    });
		  }
		  var __getOwnPropSymbols$h = Object.getOwnPropertySymbols;
		  var __hasOwnProp$h = Object.prototype.hasOwnProperty;
		  var __propIsEnum$h = Object.prototype.propertyIsEnumerable;
		  var __objRest$2 = (source, exclude) => {
		    var target = {};
		    for (var prop in source)
		      if (__hasOwnProp$h.call(source, prop) && exclude.indexOf(prop) < 0)
		        target[prop] = source[prop];
		    if (source != null && __getOwnPropSymbols$h)
		      for (var prop of __getOwnPropSymbols$h(source)) {
		        if (exclude.indexOf(prop) < 0 && __propIsEnum$h.call(source, prop))
		          target[prop] = source[prop];
		      }
		    return target;
		  };
		  function useResizeObserver(target, callback, options = {}) {
		    const _a = options, { window: window2 = defaultWindow } = _a, observerOptions = __objRest$2(_a, ["window"]);
		    let observer;
		    const isSupported = useSupported(() => window2 && "ResizeObserver" in window2);
		    const cleanup = () => {
		      if (observer) {
		        observer.disconnect();
		        observer = void 0;
		      }
		    };
		    const targets = vue.computed(
		      () => Array.isArray(target) ? target.map((el) => unrefElement(el)) : [unrefElement(target)]
		    );
		    const stopWatch = vue.watch(
		      targets,
		      (els) => {
		        cleanup();
		        if (isSupported.value && window2) {
		          observer = new ResizeObserver(callback);
		          for (const _el of els)
		            _el && observer.observe(_el, observerOptions);
		        }
		      },
		      { immediate: true, flush: "post", deep: true }
		    );
		    const stop = () => {
		      cleanup();
		      stopWatch();
		    };
		    tryOnScopeDispose(stop);
		    return {
		      isSupported,
		      stop
		    };
		  }
		  function useElementBounding(target, options = {}) {
		    const {
		      reset: reset2 = true,
		      windowResize = true,
		      windowScroll = true,
		      immediate = true
		    } = options;
		    const height = vue.ref(0);
		    const bottom = vue.ref(0);
		    const left = vue.ref(0);
		    const right = vue.ref(0);
		    const top = vue.ref(0);
		    const width = vue.ref(0);
		    const x = vue.ref(0);
		    const y = vue.ref(0);
		    function update() {
		      const el = unrefElement(target);
		      if (!el) {
		        if (reset2) {
		          height.value = 0;
		          bottom.value = 0;
		          left.value = 0;
		          right.value = 0;
		          top.value = 0;
		          width.value = 0;
		          x.value = 0;
		          y.value = 0;
		        }
		        return;
		      }
		      const rect = el.getBoundingClientRect();
		      height.value = rect.height;
		      bottom.value = rect.bottom;
		      left.value = rect.left;
		      right.value = rect.right;
		      top.value = rect.top;
		      width.value = rect.width;
		      x.value = rect.x;
		      y.value = rect.y;
		    }
		    useResizeObserver(target, update);
		    vue.watch(() => unrefElement(target), (ele) => !ele && update());
		    if (windowScroll)
		      useEventListener("scroll", update, { capture: true, passive: true });
		    if (windowResize)
		      useEventListener("resize", update, { passive: true });
		    tryOnMounted(() => {
		      if (immediate)
		        update();
		    });
		    return {
		      height,
		      bottom,
		      left,
		      right,
		      top,
		      width,
		      x,
		      y,
		      update
		    };
		  }
		  function useElementSize(target, initialSize = { width: 0, height: 0 }, options = {}) {
		    const { window: window2 = defaultWindow, box = "content-box" } = options;
		    const isSVG = vue.computed(() => {
		      var _a, _b;
		      return (_b = (_a = unrefElement(target)) == null ? void 0 : _a.namespaceURI) == null ? void 0 : _b.includes("svg");
		    });
		    const width = vue.ref(initialSize.width);
		    const height = vue.ref(initialSize.height);
		    useResizeObserver(
		      target,
		      ([entry]) => {
		        const boxSize = box === "border-box" ? entry.borderBoxSize : box === "content-box" ? entry.contentBoxSize : entry.devicePixelContentBoxSize;
		        if (window2 && isSVG.value) {
		          const $elem = unrefElement(target);
		          if ($elem) {
		            const styles = window2.getComputedStyle($elem);
		            width.value = Number.parseFloat(styles.width);
		            height.value = Number.parseFloat(styles.height);
		          }
		        } else {
		          if (boxSize) {
		            const formatBoxSize = Array.isArray(boxSize) ? boxSize : [boxSize];
		            width.value = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0);
		            height.value = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0);
		          } else {
		            width.value = entry.contentRect.width;
		            height.value = entry.contentRect.height;
		          }
		        }
		      },
		      options
		    );
		    vue.watch(
		      () => unrefElement(target),
		      (ele) => {
		        width.value = ele ? initialSize.width : 0;
		        height.value = ele ? initialSize.height : 0;
		      }
		    );
		    return {
		      width,
		      height
		    };
		  }
		  var __defProp$e = Object.defineProperty;
		  var __defProps$5 = Object.defineProperties;
		  var __getOwnPropDescs$5 = Object.getOwnPropertyDescriptors;
		  var __getOwnPropSymbols$f = Object.getOwnPropertySymbols;
		  var __hasOwnProp$f = Object.prototype.hasOwnProperty;
		  var __propIsEnum$f = Object.prototype.propertyIsEnumerable;
		  var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
		  var __spreadValues$e = (a, b) => {
		    for (var prop in b || (b = {}))
		      if (__hasOwnProp$f.call(b, prop))
		        __defNormalProp$e(a, prop, b[prop]);
		    if (__getOwnPropSymbols$f)
		      for (var prop of __getOwnPropSymbols$f(b)) {
		        if (__propIsEnum$f.call(b, prop))
		          __defNormalProp$e(a, prop, b[prop]);
		      }
		    return a;
		  };
		  var __spreadProps$5 = (a, b) => __defProps$5(a, __getOwnPropDescs$5(b));
		  const payloadMapping = {
		    json: "application/json",
		    text: "text/plain"
		  };
		  function isFetchOptions(obj) {
		    return obj && containsProp(obj, "immediate", "refetch", "initialData", "timeout", "beforeFetch", "afterFetch", "onFetchError", "fetch");
		  }
		  function headersToObject(headers) {
		    if (typeof Headers !== "undefined" && headers instanceof Headers)
		      return Object.fromEntries([...headers.entries()]);
		    return headers;
		  }
		  function useFetch(url, ...args) {
		    var _a;
		    const supportsAbort = typeof AbortController === "function";
		    let fetchOptions = {};
		    let options = { immediate: true, refetch: false, timeout: 0 };
		    const config = {
		      method: "GET",
		      type: "text",
		      payload: void 0
		    };
		    if (args.length > 0) {
		      if (isFetchOptions(args[0]))
		        options = __spreadValues$e(__spreadValues$e({}, options), args[0]);
		      else
		        fetchOptions = args[0];
		    }
		    if (args.length > 1) {
		      if (isFetchOptions(args[1]))
		        options = __spreadValues$e(__spreadValues$e({}, options), args[1]);
		    }
		    const {
		      fetch = (_a = defaultWindow) == null ? void 0 : _a.fetch,
		      initialData,
		      timeout
		    } = options;
		    const responseEvent = createEventHook();
		    const errorEvent = createEventHook();
		    const finallyEvent = createEventHook();
		    const isFinished = vue.ref(false);
		    const isFetching = vue.ref(false);
		    const aborted = vue.ref(false);
		    const statusCode = vue.ref(null);
		    const response = vue.shallowRef(null);
		    const error = vue.shallowRef(null);
		    const data = vue.shallowRef(initialData || null);
		    const canAbort = vue.computed(() => supportsAbort && isFetching.value);
		    let controller;
		    let timer;
		    const abort = () => {
		      if (supportsAbort) {
		        controller == null ? void 0 : controller.abort();
		        controller = new AbortController();
		        controller.signal.onabort = () => aborted.value = true;
		        fetchOptions = __spreadProps$5(__spreadValues$e({}, fetchOptions), {
		          signal: controller.signal
		        });
		      }
		    };
		    const loading = (isLoading) => {
		      isFetching.value = isLoading;
		      isFinished.value = !isLoading;
		    };
		    if (timeout)
		      timer = useTimeoutFn(abort, timeout, { immediate: false });
		    const execute = async (throwOnFailed = false) => {
		      var _a2;
		      abort();
		      loading(true);
		      error.value = null;
		      statusCode.value = null;
		      aborted.value = false;
		      const defaultFetchOptions = {
		        method: config.method,
		        headers: {}
		      };
		      if (config.payload) {
		        const headers = headersToObject(defaultFetchOptions.headers);
		        const payload = toValue(config.payload);
		        if (!config.payloadType && payload && Object.getPrototypeOf(payload) === Object.prototype && !(payload instanceof FormData))
		          config.payloadType = "json";
		        if (config.payloadType)
		          headers["Content-Type"] = (_a2 = payloadMapping[config.payloadType]) != null ? _a2 : config.payloadType;
		        defaultFetchOptions.body = config.payloadType === "json" ? JSON.stringify(payload) : payload;
		      }
		      let isCanceled = false;
		      const context = {
		        url: toValue(url),
		        options: __spreadValues$e(__spreadValues$e({}, defaultFetchOptions), fetchOptions),
		        cancel: () => {
		          isCanceled = true;
		        }
		      };
		      if (options.beforeFetch)
		        Object.assign(context, await options.beforeFetch(context));
		      if (isCanceled || !fetch) {
		        loading(false);
		        return Promise.resolve(null);
		      }
		      let responseData = null;
		      if (timer)
		        timer.start();
		      return new Promise((resolve, reject) => {
		        var _a3;
		        fetch(
		          context.url,
		          __spreadProps$5(__spreadValues$e(__spreadValues$e({}, defaultFetchOptions), context.options), {
		            headers: __spreadValues$e(__spreadValues$e({}, headersToObject(defaultFetchOptions.headers)), headersToObject((_a3 = context.options) == null ? void 0 : _a3.headers))
		          })
		        ).then(async (fetchResponse) => {
		          response.value = fetchResponse;
		          statusCode.value = fetchResponse.status;
		          responseData = await fetchResponse[config.type]();
		          if (!fetchResponse.ok) {
		            data.value = initialData || null;
		            throw new Error(fetchResponse.statusText);
		          }
		          if (options.afterFetch)
		            ({ data: responseData } = await options.afterFetch({ data: responseData, response: fetchResponse }));
		          data.value = responseData;
		          responseEvent.trigger(fetchResponse);
		          return resolve(fetchResponse);
		        }).catch(async (fetchError) => {
		          let errorData = fetchError.message || fetchError.name;
		          if (options.onFetchError)
		            ({ error: errorData } = await options.onFetchError({ data: responseData, error: fetchError, response: response.value }));
		          error.value = errorData;
		          errorEvent.trigger(fetchError);
		          if (throwOnFailed)
		            return reject(fetchError);
		          return resolve(null);
		        }).finally(() => {
		          loading(false);
		          if (timer)
		            timer.stop();
		          finallyEvent.trigger(null);
		        });
		      });
		    };
		    const refetch = toRef(options.refetch);
		    vue.watch(
		      [
		        refetch,
		        toRef(url)
		      ],
		      ([refetch2]) => refetch2 && execute(),
		      { deep: true }
		    );
		    const shell = {
		      isFinished,
		      statusCode,
		      response,
		      error,
		      data,
		      isFetching,
		      canAbort,
		      aborted,
		      abort,
		      execute,
		      onFetchResponse: responseEvent.on,
		      onFetchError: errorEvent.on,
		      onFetchFinally: finallyEvent.on,
		      // method
		      get: setMethod("GET"),
		      put: setMethod("PUT"),
		      post: setMethod("POST"),
		      delete: setMethod("DELETE"),
		      patch: setMethod("PATCH"),
		      head: setMethod("HEAD"),
		      options: setMethod("OPTIONS"),
		      // type
		      json: setType("json"),
		      text: setType("text"),
		      blob: setType("blob"),
		      arrayBuffer: setType("arrayBuffer"),
		      formData: setType("formData")
		    };
		    function setMethod(method) {
		      return (payload, payloadType) => {
		        if (!isFetching.value) {
		          config.method = method;
		          config.payload = payload;
		          config.payloadType = payloadType;
		          if (vue.isRef(config.payload)) {
		            vue.watch(
		              [
		                refetch,
		                toRef(config.payload)
		              ],
		              ([refetch2]) => refetch2 && execute(),
		              { deep: true }
		            );
		          }
		          return __spreadProps$5(__spreadValues$e({}, shell), {
		            then(onFulfilled, onRejected) {
		              return waitUntilFinished().then(onFulfilled, onRejected);
		            }
		          });
		        }
		        return void 0;
		      };
		    }
		    function waitUntilFinished() {
		      return new Promise((resolve, reject) => {
		        until(isFinished).toBe(true).then(() => resolve(shell)).catch((error2) => reject(error2));
		      });
		    }
		    function setType(type) {
		      return () => {
		        if (!isFetching.value) {
		          config.type = type;
		          return __spreadProps$5(__spreadValues$e({}, shell), {
		            then(onFulfilled, onRejected) {
		              return waitUntilFinished().then(onFulfilled, onRejected);
		            }
		          });
		        }
		        return void 0;
		      };
		    }
		    if (options.immediate)
		      Promise.resolve().then(() => execute());
		    return __spreadProps$5(__spreadValues$e({}, shell), {
		      then(onFulfilled, onRejected) {
		        return waitUntilFinished().then(onFulfilled, onRejected);
		      }
		    });
		  }
		  function useScriptTag(src, onLoaded = noop, options = {}) {
		    const {
		      immediate = true,
		      manual = false,
		      type = "text/javascript",
		      async = true,
		      crossOrigin,
		      referrerPolicy,
		      noModule,
		      defer,
		      document: document2 = defaultDocument,
		      attrs = {}
		    } = options;
		    const scriptTag = vue.ref(null);
		    let _promise = null;
		    const loadScript = (waitForScriptLoad) => new Promise((resolve, reject) => {
		      const resolveWithElement = (el2) => {
		        scriptTag.value = el2;
		        resolve(el2);
		        return el2;
		      };
		      if (!document2) {
		        resolve(false);
		        return;
		      }
		      let shouldAppend = false;
		      let el = document2.querySelector(`script[src="${toValue(src)}"]`);
		      if (!el) {
		        el = document2.createElement("script");
		        el.type = type;
		        el.async = async;
		        el.src = toValue(src);
		        if (defer)
		          el.defer = defer;
		        if (crossOrigin)
		          el.crossOrigin = crossOrigin;
		        if (noModule)
		          el.noModule = noModule;
		        if (referrerPolicy)
		          el.referrerPolicy = referrerPolicy;
		        Object.entries(attrs).forEach(([name, value]) => el == null ? void 0 : el.setAttribute(name, value));
		        shouldAppend = true;
		      } else if (el.hasAttribute("data-loaded")) {
		        resolveWithElement(el);
		      }
		      el.addEventListener("error", (event) => reject(event));
		      el.addEventListener("abort", (event) => reject(event));
		      el.addEventListener("load", () => {
		        el.setAttribute("data-loaded", "true");
		        onLoaded(el);
		        resolveWithElement(el);
		      });
		      if (shouldAppend)
		        el = document2.head.appendChild(el);
		      if (!waitForScriptLoad)
		        resolveWithElement(el);
		    });
		    const load = (waitForScriptLoad = true) => {
		      if (!_promise)
		        _promise = loadScript(waitForScriptLoad);
		      return _promise;
		    };
		    const unload = () => {
		      if (!document2)
		        return;
		      _promise = null;
		      if (scriptTag.value)
		        scriptTag.value = null;
		      const el = document2.querySelector(`script[src="${toValue(src)}"]`);
		      if (el)
		        document2.head.removeChild(el);
		    };
		    if (immediate && !manual)
		      tryOnMounted(load);
		    if (!manual)
		      tryOnUnmounted(unload);
		    return { scriptTag, load, unload };
		  }
		  function useSessionStorage(key, initialValue, options = {}) {
		    const { window: window2 = defaultWindow } = options;
		    return useStorage(key, initialValue, window2 == null ? void 0 : window2.sessionStorage, options);
		  }
		  const defaultSortFn = (source, compareFn) => source.sort(compareFn);
		  const defaultCompare = (a, b) => a - b;
		  function useSorted(...args) {
		    var _a, _b, _c, _d;
		    const [source] = args;
		    let compareFn = defaultCompare;
		    let options = {};
		    if (args.length === 2) {
		      if (typeof args[1] === "object") {
		        options = args[1];
		        compareFn = (_a = options.compareFn) != null ? _a : defaultCompare;
		      } else {
		        compareFn = (_b = args[1]) != null ? _b : defaultCompare;
		      }
		    } else if (args.length > 2) {
		      compareFn = (_c = args[1]) != null ? _c : defaultCompare;
		      options = (_d = args[2]) != null ? _d : {};
		    }
		    const {
		      dirty = false,
		      sortFn = defaultSortFn
		    } = options;
		    if (!dirty)
		      return vue.computed(() => sortFn([...toValue(source)], compareFn));
		    vue.watchEffect(() => {
		      const result = sortFn(toValue(source), compareFn);
		      if (vue.isRef(source))
		        source.value = result;
		      else
		        source.splice(0, source.length, ...result);
		    });
		    return source;
		  }
		  const DEFAULT_UNITS = [
		    { max: 6e4, value: 1e3, name: "second" },
		    { max: 276e4, value: 6e4, name: "minute" },
		    { max: 72e6, value: 36e5, name: "hour" },
		    { max: 5184e5, value: 864e5, name: "day" },
		    { max: 24192e5, value: 6048e5, name: "week" },
		    { max: 28512e6, value: 2592e6, name: "month" },
		    { max: Number.POSITIVE_INFINITY, value: 31536e6, name: "year" }
		  ];
		  const DEFAULT_MESSAGES = {
		    justNow: "just now",
		    past: (n) => n.match(/\d/) ? `${n} ago` : n,
		    future: (n) => n.match(/\d/) ? `in ${n}` : n,
		    month: (n, past) => n === 1 ? past ? "last month" : "next month" : `${n} month${n > 1 ? "s" : ""}`,
		    year: (n, past) => n === 1 ? past ? "last year" : "next year" : `${n} year${n > 1 ? "s" : ""}`,
		    day: (n, past) => n === 1 ? past ? "yesterday" : "tomorrow" : `${n} day${n > 1 ? "s" : ""}`,
		    week: (n, past) => n === 1 ? past ? "last week" : "next week" : `${n} week${n > 1 ? "s" : ""}`,
		    hour: (n) => `${n} hour${n > 1 ? "s" : ""}`,
		    minute: (n) => `${n} minute${n > 1 ? "s" : ""}`,
		    second: (n) => `${n} second${n > 1 ? "s" : ""}`,
		    invalid: ""
		  };
		  function DEFAULT_FORMATTER(date) {
		    return date.toISOString().slice(0, 10);
		  }
		  function formatTimeAgo(from, options = {}, now = Date.now()) {
		    var _a;
		    const {
		      max,
		      messages = DEFAULT_MESSAGES,
		      fullDateFormatter = DEFAULT_FORMATTER,
		      units = DEFAULT_UNITS,
		      showSecond = false,
		      rounding = "round"
		    } = options;
		    const roundFn = typeof rounding === "number" ? (n) => +n.toFixed(rounding) : Math[rounding];
		    const diff = +now - +from;
		    const absDiff = Math.abs(diff);
		    function getValue(diff2, unit) {
		      return roundFn(Math.abs(diff2) / unit.value);
		    }
		    function format(diff2, unit) {
		      const val = getValue(diff2, unit);
		      const past = diff2 > 0;
		      const str = applyFormat(unit.name, val, past);
		      return applyFormat(past ? "past" : "future", str, past);
		    }
		    function applyFormat(name, val, isPast) {
		      const formatter = messages[name];
		      if (typeof formatter === "function")
		        return formatter(val, isPast);
		      return formatter.replace("{0}", val.toString());
		    }
		    if (absDiff < 6e4 && !showSecond)
		      return messages.justNow;
		    if (typeof max === "number" && absDiff > max)
		      return fullDateFormatter(new Date(from));
		    if (typeof max === "string") {
		      const unitMax = (_a = units.find((i) => i.name === max)) == null ? void 0 : _a.max;
		      if (unitMax && absDiff > unitMax)
		        return fullDateFormatter(new Date(from));
		    }
		    for (const [idx, unit] of units.entries()) {
		      const val = getValue(diff, unit);
		      if (val <= 0 && units[idx - 1])
		        return format(diff, units[idx - 1]);
		      if (absDiff < unit.max)
		        return format(diff, unit);
		    }
		    return messages.invalid;
		  }
		  function useVirtualList(list, options) {
		    const { containerStyle, wrapperProps, scrollTo, calculateRange, currentList, containerRef } = "itemHeight" in options ? useVerticalVirtualList(options, list) : useHorizontalVirtualList(options, list);
		    return {
		      list: currentList,
		      scrollTo,
		      containerProps: {
		        ref: containerRef,
		        onScroll: () => {
		          calculateRange();
		        },
		        style: containerStyle
		      },
		      wrapperProps
		    };
		  }
		  function useVirtualListResources(list) {
		    const containerRef = vue.ref(null);
		    const size = useElementSize(containerRef);
		    const currentList = vue.ref([]);
		    const source = vue.shallowRef(list);
		    const state = vue.ref({ start: 0, end: 10 });
		    return { state, source, currentList, size, containerRef };
		  }
		  function createGetViewCapacity(state, source, itemSize) {
		    return (containerSize) => {
		      if (typeof itemSize === "number")
		        return Math.ceil(containerSize / itemSize);
		      const { start = 0 } = state.value;
		      let sum = 0;
		      let capacity = 0;
		      for (let i = start; i < source.value.length; i++) {
		        const size = itemSize(i);
		        sum += size;
		        capacity = i;
		        if (sum > containerSize)
		          break;
		      }
		      return capacity - start;
		    };
		  }
		  function createGetOffset(source, itemSize) {
		    return (scrollDirection) => {
		      if (typeof itemSize === "number")
		        return Math.floor(scrollDirection / itemSize) + 1;
		      let sum = 0;
		      let offset = 0;
		      for (let i = 0; i < source.value.length; i++) {
		        const size = itemSize(i);
		        sum += size;
		        if (sum >= scrollDirection) {
		          offset = i;
		          break;
		        }
		      }
		      return offset + 1;
		    };
		  }
		  function createCalculateRange(type, overscan, getOffset, getViewCapacity, { containerRef, state, currentList, source }) {
		    return () => {
		      const element = containerRef.value;
		      if (element) {
		        const offset = getOffset(type === "vertical" ? element.scrollTop : element.scrollLeft);
		        const viewCapacity = getViewCapacity(type === "vertical" ? element.clientHeight : element.clientWidth);
		        const from = offset - overscan;
		        const to = offset + viewCapacity + overscan;
		        state.value = {
		          start: from < 0 ? 0 : from,
		          end: to > source.value.length ? source.value.length : to
		        };
		        currentList.value = source.value.slice(state.value.start, state.value.end).map((ele, index) => ({
		          data: ele,
		          index: index + state.value.start
		        }));
		      }
		    };
		  }
		  function createGetDistance(itemSize, source) {
		    return (index) => {
		      if (typeof itemSize === "number") {
		        const size2 = index * itemSize;
		        return size2;
		      }
		      const size = source.value.slice(0, index).reduce((sum, _, i) => sum + itemSize(i), 0);
		      return size;
		    };
		  }
		  function useWatchForSizes(size, list, calculateRange) {
		    vue.watch([size.width, size.height, list], () => {
		      calculateRange();
		    });
		  }
		  function createComputedTotalSize(itemSize, source) {
		    return vue.computed(() => {
		      if (typeof itemSize === "number")
		        return source.value.length * itemSize;
		      return source.value.reduce((sum, _, index) => sum + itemSize(index), 0);
		    });
		  }
		  const scrollToDictionaryForElementScrollKey = {
		    horizontal: "scrollLeft",
		    vertical: "scrollTop"
		  };
		  function createScrollTo(type, calculateRange, getDistance, containerRef) {
		    return (index) => {
		      if (containerRef.value) {
		        containerRef.value[scrollToDictionaryForElementScrollKey[type]] = getDistance(index);
		        calculateRange();
		      }
		    };
		  }
		  function useHorizontalVirtualList(options, list) {
		    const resources = useVirtualListResources(list);
		    const { state, source, currentList, size, containerRef } = resources;
		    const containerStyle = { overflowX: "auto" };
		    const { itemWidth, overscan = 5 } = options;
		    const getViewCapacity = createGetViewCapacity(state, source, itemWidth);
		    const getOffset = createGetOffset(source, itemWidth);
		    const calculateRange = createCalculateRange("horizontal", overscan, getOffset, getViewCapacity, resources);
		    const getDistanceLeft = createGetDistance(itemWidth, source);
		    const offsetLeft = vue.computed(() => getDistanceLeft(state.value.start));
		    const totalWidth = createComputedTotalSize(itemWidth, source);
		    useWatchForSizes(size, list, calculateRange);
		    const scrollTo = createScrollTo("horizontal", calculateRange, getDistanceLeft, containerRef);
		    const wrapperProps = vue.computed(() => {
		      return {
		        style: {
		          height: "100%",
		          width: `${totalWidth.value - offsetLeft.value}px`,
		          marginLeft: `${offsetLeft.value}px`,
		          display: "flex"
		        }
		      };
		    });
		    return {
		      scrollTo,
		      calculateRange,
		      wrapperProps,
		      containerStyle,
		      currentList,
		      containerRef
		    };
		  }
		  function useVerticalVirtualList(options, list) {
		    const resources = useVirtualListResources(list);
		    const { state, source, currentList, size, containerRef } = resources;
		    const containerStyle = { overflowY: "auto" };
		    const { itemHeight, overscan = 5 } = options;
		    const getViewCapacity = createGetViewCapacity(state, source, itemHeight);
		    const getOffset = createGetOffset(source, itemHeight);
		    const calculateRange = createCalculateRange("vertical", overscan, getOffset, getViewCapacity, resources);
		    const getDistanceTop = createGetDistance(itemHeight, source);
		    const offsetTop = vue.computed(() => getDistanceTop(state.value.start));
		    const totalHeight = createComputedTotalSize(itemHeight, source);
		    useWatchForSizes(size, list, calculateRange);
		    const scrollTo = createScrollTo("vertical", calculateRange, getDistanceTop, containerRef);
		    const wrapperProps = vue.computed(() => {
		      return {
		        style: {
		          width: "100%",
		          height: `${totalHeight.value - offsetTop.value}px`,
		          marginTop: `${offsetTop.value}px`
		        }
		      };
		    });
		    return {
		      calculateRange,
		      scrollTo,
		      containerStyle,
		      wrapperProps,
		      currentList,
		      containerRef
		    };
		  }
		  function useWindowSize(options = {}) {
		    const {
		      window: window2 = defaultWindow,
		      initialWidth = Number.POSITIVE_INFINITY,
		      initialHeight = Number.POSITIVE_INFINITY,
		      listenOrientation = true,
		      includeScrollbar = true
		    } = options;
		    const width = vue.ref(initialWidth);
		    const height = vue.ref(initialHeight);
		    const update = () => {
		      if (window2) {
		        if (includeScrollbar) {
		          width.value = window2.innerWidth;
		          height.value = window2.innerHeight;
		        } else {
		          width.value = window2.document.documentElement.clientWidth;
		          height.value = window2.document.documentElement.clientHeight;
		        }
		      }
		    };
		    update();
		    tryOnMounted(update);
		    useEventListener("resize", update, { passive: true });
		    if (listenOrientation) {
		      const matches = useMediaQuery("(orientation: portrait)");
		      vue.watch(matches, () => update());
		    }
		    return { width, height };
		  }
		  function formatTimeAgoWithI18n(from) {
		    const { t } = vueI18n.useI18n();
		    return formatTimeAgo(from, {
		      messages: {
		        justNow: t("time-ago.just-now"),
		        past: (n) => n.match(/\d/) ? t("time-ago.past", { n }) : n,
		        future: (n) => n.match(/\d/) ? t("time-ago.future", { n }) : n,
		        month: (n, past) => n === 1 ? past ? t("time-ago.month.past") : t("time-ago.month.future") : t("time-ago.month.n", { n }),
		        year: (n, past) => n === 1 ? past ? t("time-ago.year.past") : t("time-ago.year.future") : t("time-ago.year.n", { n }),
		        day: (n, past) => n === 1 ? past ? t("time-ago.day.past") : t("time-ago.day.future") : t("time-ago.day.n", { n }),
		        week: (n, past) => n === 1 ? past ? t("time-ago.week.past") : t("time-ago.week.future") : t("time-ago.week.n", { n }),
		        hour: (n) => t("time-ago.hour", { n }),
		        minute: (n) => t("time-ago.minute", { n }),
		        second: (n) => t("time-ago.second", { n }),
		        invalid: "invalid"
		      }
		    });
		  }
		  const _hoisted_1$6 = { class: "inline-block min-w-full align-middle" };
		  const _hoisted_2$5 = { class: "relative overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5" };
		  const _hoisted_3$4 = { class: "min-w-full divide-y divide-$ud-border-secondary" };
		  const _hoisted_4$4 = { class: "bg-$ud-bg-secondary select-none" };
		  const _hoisted_5$4 = {
		    style: { "table-layout": "fixed" },
		    class: "table"
		  };
		  const _hoisted_6$4 = {
		    scope: "col",
		    class: "w-8 relative p-2"
		  };
		  const _hoisted_7$3 = { class: "sr-only" };
		  const _hoisted_8$3 = {
		    scope: "col",
		    class: "w-60 py-2 pl-4 pr-3 text-left text-xs font-semibold"
		  };
		  const _hoisted_9$3 = { class: "inline-flex items-center" };
		  const _hoisted_10$3 = { class: "relative ml-0.5" };
		  const _hoisted_11$3 = { class: "inline-flex items-center" };
		  const _hoisted_12$1 = { class: "relative ml-0.5" };
		  const _hoisted_13$1 = {
		    scope: "col",
		    class: "relative py-2 pl-3 pr-4"
		  };
		  const _hoisted_14$1 = { class: "sr-only" };
		  const _hoisted_15$1 = {
		    key: 0,
		    class: "flex items-center justify-center py-10"
		  };
		  const _hoisted_16$1 = /* @__PURE__ */ vue.createElementVNode("svg", {
		    class: "animate-spin w-10 h-10 text-indigo-500",
		    xmlns: "http://www.w3.org/2000/svg",
		    fill: "none",
		    viewBox: "0 0 24 24"
		  }, [
		    /* @__PURE__ */ vue.createElementVNode("circle", {
		      class: "opacity-25",
		      cx: "12",
		      cy: "12",
		      r: "10",
		      stroke: "currentColor",
		      "stroke-width": "4"
		    }),
		    /* @__PURE__ */ vue.createElementVNode("path", {
		      class: "opacity-75",
		      fill: "currentColor",
		      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		    })
		  ], -1);
		  const _hoisted_17$1 = [
		    _hoisted_16$1
		  ];
		  const _hoisted_18$1 = {
		    key: 1,
		    class: "p-3 text-center text-sm"
		  };
		  const _hoisted_19$1 = { class: "table w-full" };
		  const _hoisted_20$1 = ["onClick"];
		  const _hoisted_21$1 = ["title"];
		  const _hoisted_22 = ["href"];
		  const _hoisted_23 = { class: "w-20 break-all truncate px-3 py-2 text-xs text-$ud-text-secondary" };
		  const _hoisted_24 = { class: "w-22 break-all truncate px-3 py-2 text-xs text-$ud-text-secondary" };
		  const _hoisted_25 = { class: "relative truncate py-2 pl-3 pr-4 text-right text-xs font-medium" };
		  const _hoisted_26 = ["href"];
		  const _hoisted_27 = { class: "sr-only" };
		  const _hoisted_28 = {
		    key: 0,
		    class: "table w-full"
		  };
		  const _hoisted_29 = {
		    colspan: "5",
		    class: "py-2"
		  };
		  const _hoisted_30 = { class: "mx-2" };
		  const _hoisted_31 = { class: "text-xs grid grid-cols-6 gap-y-2" };
		  const _hoisted_32 = { class: "font-semibold" };
		  const _hoisted_33 = { class: "text-$ud-text" };
		  const _hoisted_34 = { class: "font-semibold" };
		  const _hoisted_35 = { class: "text-$ud-text" };
		  const _hoisted_36 = { class: "font-semibold" };
		  const _hoisted_37 = { class: "text-$ud-text" };
		  const _hoisted_38 = { class: "font-semibold" };
		  const _hoisted_39 = { class: "col-span-5 text-$ud-text" };
		  const _hoisted_40 = ["href"];
		  const _hoisted_41 = { class: "font-semibold" };
		  const _hoisted_42 = { class: "col-span-5 text-$ud-text" };
		  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
		    __name: "DataTable",
		    props: {
		      data: {},
		      loading: { type: Boolean }
		    },
		    setup(__props) {
		      const props = __props;
		      const expanded = vue.ref([]);
		      watchArray(
		        () => props.data,
		        () => {
		          expanded.value = Array.from({ length: props.data.length }, () => false);
		        }
		      );
		      function toggleExpand(i) {
		        expanded.value[i] = !expanded.value[i];
		      }
		      const sort = vue.reactive({
		        updated: "",
		        daily: ""
		      });
		      const sortedData = useSorted(
		        vue.computed(() => props.data),
		        (a, b) => {
		          if (sort.updated !== "") {
		            if (sort.updated === "asc")
		              return +new Date(a.code_updated_at) - +new Date(b.code_updated_at);
		            return +new Date(b.code_updated_at) - +new Date(a.code_updated_at);
		          }
		          if (sort.daily === "asc")
		            return a.daily_installs - b.daily_installs;
		          return b.daily_installs - a.daily_installs;
		        }
		      );
		      const { list, containerProps, wrapperProps } = useVirtualList(sortedData, {
		        itemHeight: (index) => {
		          if (expanded.value[index])
		            return 112;
		          else
		            return 32;
		        }
		      });
		      function sortIcon(sort2) {
		        if (sort2 === "")
		          return "i-carbon-caret-sort";
		        return { desc: "i-carbon-caret-sort-down", asc: "i-carbon-caret-sort-up" }[sort2];
		      }
		      function onSortClick(key) {
		        sort[key] = sort[key] === "" ? "desc" : sort[key] === "desc" ? "asc" : "";
		        sort[key === "daily" ? "updated" : "daily"] = "";
		      }
		      const { t } = vueI18n.useI18n();
		      return (_ctx, _cache) => {
		        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
		          vue.createElementVNode("div", _hoisted_2$5, [
		            vue.createElementVNode("table", _hoisted_3$4, [
		              vue.createElementVNode("thead", _hoisted_4$4, [
		                vue.createElementVNode("tr", _hoisted_5$4, [
		                  vue.createElementVNode("th", _hoisted_6$4, [
		                    vue.createElementVNode("span", _hoisted_7$3, vue.toDisplayString(vue.unref(t)("table.toggle-expand")), 1)
		                  ]),
		                  vue.createElementVNode("th", _hoisted_8$3, vue.toDisplayString(vue.unref(t)("table.title")), 1),
		                  vue.createElementVNode("th", {
		                    scope: "col",
		                    class: "w-20 px-2 py-2 text-left text-xs font-semibold cursor-pointer",
		                    onClick: _cache[0] || (_cache[0] = ($event) => onSortClick("daily"))
		                  }, [
		                    vue.createElementVNode("div", _hoisted_9$3, [
		                      vue.createElementVNode("div", null, vue.toDisplayString(vue.unref(t)("table.daily")), 1),
		                      vue.createElementVNode("div", _hoisted_10$3, [
		                        vue.createElementVNode("div", {
		                          class: vue.normalizeClass(sortIcon(vue.unref(sort).daily))
		                        }, null, 2)
		                      ])
		                    ])
		                  ]),
		                  vue.createElementVNode("th", {
		                    scope: "col",
		                    class: "w-22 px-2 py-2 text-left text-xs font-semibold cursor-pointer",
		                    onClick: _cache[1] || (_cache[1] = ($event) => onSortClick("updated"))
		                  }, [
		                    vue.createElementVNode("div", _hoisted_11$3, [
		                      vue.createElementVNode("div", null, vue.toDisplayString(vue.unref(t)("table.update")), 1),
		                      vue.createElementVNode("div", _hoisted_12$1, [
		                        vue.createElementVNode("div", {
		                          class: vue.normalizeClass(sortIcon(vue.unref(sort).updated))
		                        }, null, 2)
		                      ])
		                    ])
		                  ]),
		                  vue.createElementVNode("th", _hoisted_13$1, [
		                    vue.createElementVNode("span", _hoisted_14$1, vue.toDisplayString(vue.unref(t)("table.install")), 1)
		                  ])
		                ])
		              ]),
		              vue.createElementVNode("tbody", vue.mergeProps(vue.unref(containerProps), { class: "h-60 overflow-y-overlay block divide-y divide-$ud-border w-full bg-$ud-bg" }), [
		                vue.createElementVNode("div", vue.normalizeProps(vue.guardReactiveProps(vue.unref(wrapperProps))), [
		                  _ctx.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_15$1, _hoisted_17$1)) : _ctx.data.length === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_18$1, vue.toDisplayString(vue.unref(t)("table.empty")), 1)) : (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 2 }, vue.renderList(vue.unref(list), (item) => {
		                    return vue.openBlock(), vue.createElementBlock(vue.Fragment, {
		                      key: item.index
		                    }, [
		                      vue.createElementVNode("tr", _hoisted_19$1, [
		                        vue.createElementVNode("td", {
		                          class: "w-8 relative truncate p-2 text-right text-xs font-medium cursor-pointer",
		                          onClick: ($event) => toggleExpand(item.index)
		                        }, [
		                          vue.createElementVNode("div", {
		                            class: vue.normalizeClass(["i-carbon-chevron-right", vue.unref(expanded)[item.index] && "rotate-90"])
		                          }, null, 2)
		                        ], 8, _hoisted_20$1),
		                        vue.createElementVNode("td", {
		                          title: item.data.name,
		                          class: "w-60 break-all truncate py-2 pl-4 pr-3 text-xs font-medium max-w-60"
		                        }, [
		                          vue.createElementVNode("a", {
		                            href: item.data.url,
		                            target: "_blank"
		                          }, vue.toDisplayString(item.data.name), 9, _hoisted_22)
		                        ], 8, _hoisted_21$1),
		                        vue.createElementVNode("td", _hoisted_23, vue.toDisplayString(item.data.daily_installs), 1),
		                        vue.createElementVNode("td", _hoisted_24, vue.toDisplayString(vue.unref(formatTimeAgoWithI18n)(new Date(item.data.code_updated_at))), 1),
		                        vue.createElementVNode("td", _hoisted_25, [
		                          vue.createElementVNode("a", {
		                            href: item.data.code_url,
		                            target: "_blank",
		                            class: "text-indigo-600 hover:text-indigo-900"
		                          }, [
		                            vue.createTextVNode(vue.toDisplayString(vue.unref(t)("table.install")) + " ", 1),
		                            vue.createElementVNode("span", _hoisted_27, ", " + vue.toDisplayString(item.data.name), 1)
		                          ], 8, _hoisted_26)
		                        ])
		                      ]),
		                      vue.unref(expanded)[item.index] ? (vue.openBlock(), vue.createElementBlock("tr", _hoisted_28, [
		                        vue.createElementVNode("td", _hoisted_29, [
		                          vue.createElementVNode("div", _hoisted_30, [
		                            vue.createElementVNode("dl", _hoisted_31, [
		                              vue.createElementVNode("dt", _hoisted_32, vue.toDisplayString(vue.unref(t)("table.version")), 1),
		                              vue.createElementVNode("dd", _hoisted_33, vue.toDisplayString(item.data.version), 1),
		                              vue.createElementVNode("dt", _hoisted_34, vue.toDisplayString(vue.unref(t)("table.score")), 1),
		                              vue.createElementVNode("dd", _hoisted_35, vue.toDisplayString(item.data.fan_score), 1),
		                              vue.createElementVNode("dt", _hoisted_36, vue.toDisplayString(vue.unref(t)("table.total-installs")), 1),
		                              vue.createElementVNode("dd", _hoisted_37, vue.toDisplayString(item.data.total_installs.toLocaleString()), 1),
		                              vue.createElementVNode("dt", _hoisted_38, vue.toDisplayString(vue.unref(t)("table.authors")), 1),
		                              vue.createElementVNode("dd", _hoisted_39, [
		                                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(item.data.users, (user) => {
		                                  return vue.openBlock(), vue.createElementBlock("a", {
		                                    key: user.id,
		                                    href: user.url,
		                                    target: "_blank",
		                                    class: "underline underline-$ud-border"
		                                  }, vue.toDisplayString(user.name), 9, _hoisted_40);
		                                }), 128))
		                              ]),
		                              vue.createElementVNode("dt", _hoisted_41, vue.toDisplayString(vue.unref(t)("table.description")), 1),
		                              vue.createElementVNode("dd", _hoisted_42, vue.toDisplayString(item.data.description), 1)
		                            ])
		                          ])
		                        ])
		                      ])) : vue.createCommentVNode("", true)
		                    ], 64);
		                  }), 128))
		                ], 16)
		              ], 16)
		            ])
		          ])
		        ]);
		      };
		    }
		  });
		  var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
		  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
		  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
		  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
		  const GMStorage = {
		    getItem(key) {
		      return _GM_getValue(key);
		    },
		    setItem(key, value) {
		      _GM_setValue(key, value);
		    },
		    removeItem(key) {
		      _GM_deleteValue(key);
		    }
		  };
		  function useGMStorage(key, defaults) {
		    return useStorage(key, defaults, GMStorage);
		  }
		  const useInjectContainer = () => vue.inject("container");
		  const defaultSettings = {
		    locale: navigator.language ?? "en",
		    nsfw: false,
		    filter: [],
		    debugger: false
		  };
		  const toString = Object.prototype.toString;
		  const useUserjsDiggerSettings = createGlobalState(() => {
		    const settings2 = useGMStorage("ud_settings", defaultSettings);
		    Object.entries(settings2.value).forEach(([key, value]) => {
		      if (toString.call(value) !== toString.call(defaultSettings[key])) {
		        settings2.value[key] = defaultSettings[key];
		      }
		    });
		    return settings2;
		  });
		  const AUTHOR_REGEX = /^author:(\S+)$/;
		  const TITLE_REGEX = /^title:(\S+)$/;
		  function isAuthorFilter(filter) {
		    return !!filter.match(AUTHOR_REGEX);
		  }
		  function getTypedFilter(filter) {
		    if (filter.includes(":")) {
		      if (isAuthorFilter(filter)) {
		        const regexp = new RegExp(filter.match(AUTHOR_REGEX)[1]);
		        return { type: "author", regexp };
		      } else {
		        return getTypedFilter(filter.match(TITLE_REGEX)[1]);
		      }
		    }
		    return {
		      type: "title",
		      regexp: new RegExp(filter)
		    };
		  }
		  function useGreasyfork(host, { site, immediate } = {
		    site: "https://greasyfork.org",
		    immediate: true
		  }) {
		    const apiEndpoint = vue.computed(
		      () => `${site}/scripts/by-site/${resolveUnref(host)}.json`
		    );
		    const fetch = _unsafeWindow.fetch;
		    const afterFetch = async ({
		      data: prevData,
		      response
		    }) => {
		      if ((prevData == null ? void 0 : prevData.length) === 50) {
		        const prevPage = Number(new URL(response.url).searchParams.get("page")) || 1;
		        const nextPage = `${apiEndpoint.value}?page=${prevPage + 1}`;
		        const { data, execute } = useFetch(nextPage, {
		          fetch,
		          immediate: false,
		          afterFetch
		        }).json();
		        await execute();
		        return {
		          response: new Response(),
		          data: prevData == null ? void 0 : prevData.concat(data.value ?? [])
		        };
		      }
		      return { data: prevData };
		    };
		    return useFetch(apiEndpoint, {
		      fetch,
		      immediate,
		      afterFetch
		    }).json();
		  }
		  function useDataList(host) {
		    const settings2 = useUserjsDiggerSettings();
		    const {
		      data: greasyfork,
		      isFetching,
		      execute: executeGreasyfork
		    } = useGreasyfork(host);
		    const {
		      data: sleazyfork,
		      execute: executeSleazyfork,
		      isFetching: isSleazyforkFetching
		    } = useGreasyfork(host, { site: "https://sleazyfork.org", immediate: false });
		    vue.watch(
		      () => settings2.value.nsfw,
		      (val) => {
		        if (val) {
		          if (!sleazyfork.value)
		            executeSleazyfork();
		        }
		      },
		      { immediate: true }
		    );
		    const data = vue.computed(() => {
		      var _a;
		      return (((_a = greasyfork.value) == null ? void 0 : _a.concat(
		        settings2.value.nsfw ? sleazyfork.value ?? [] : []
		      )) ?? []).filter(
		        (item) => settings2.value.filter.every((keywords) => {
		          const filter = getTypedFilter(keywords);
		          if (filter.type === "title")
		            return !filter.regexp.test(item.name);
		          else
		            return item.users.every((user) => !filter.regexp.test(user.name));
		        })
		      );
		    });
		    const isLoading = vue.computed(() => {
		      if (settings2.value.nsfw)
		        return isFetching.value || isSleazyforkFetching.value;
		      return isFetching.value;
		    });
		    const execute = () => {
		      greasyfork.value = [];
		      sleazyfork.value = [];
		      executeGreasyfork();
		      if (settings2.value.nsfw)
		        executeSleazyfork();
		    };
		    return { data, isLoading, execute };
		  }
		  const _hoisted_1$5 = { class: "p-2 text-sm truncate" };
		  const _hoisted_2$4 = ["title"];
		  const _hoisted_3$3 = { class: "p-2 leading-5 flex-1" };
		  const _hoisted_4$3 = ["placeholder"];
		  const _hoisted_5$3 = /* @__PURE__ */ vue.createElementVNode("div", { class: "i-carbon:search" }, null, -1);
		  const _hoisted_6$3 = [
		    _hoisted_5$3
		  ];
		  const _hoisted_7$2 = /* @__PURE__ */ vue.createElementVNode("div", { class: "i-carbon:settings-adjust" }, null, -1);
		  const _hoisted_8$2 = [
		    _hoisted_7$2
		  ];
		  const _hoisted_9$2 = /* @__PURE__ */ vue.createElementVNode("div", { class: "i-carbon-close" }, null, -1);
		  const _hoisted_10$2 = [
		    _hoisted_9$2
		  ];
		  const _hoisted_11$2 = { key: 0 };
		  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
		    __name: "MainPanel",
		    props: {
		      show: { type: Boolean }
		    },
		    emits: ["update:show", "setting"],
		    setup(__props, { emit }) {
		      const target = vue.ref(null);
		      const container = useInjectContainer();
		      const [showTable, toggleShowTable] = useToggle(false);
		      const searchSite = vue.ref("");
		      const pagePsl = vue.computed(() => {
		        if (searchSite.value === "")
		          return psl.get(window.location.hostname) ?? "";
		        return searchSite.value;
		      });
		      const [search, toggleSearch] = useToggle(false);
		      const searchInput = vue.ref();
		      const { data, isLoading, execute } = useDataList(pagePsl);
		      onClickOutside(
		        target,
		        (val) => {
		          if (val) {
		            emit("update:show", false);
		            toggleShowTable(false);
		          }
		        },
		        { ignore: [container] }
		      );
		      function onSearchEnter() {
		        toggleSearch(false);
		        execute();
		      }
		      return (_ctx, _cache) => {
		        const _component_i18n_t = vue.resolveComponent("i18n-t");
		        const _component_DataTable = _sfc_main$7;
		        return vue.openBlock(), vue.createElementBlock("div", {
		          ref_key: "target",
		          ref: target,
		          class: vue.normalizeClass([[_ctx.show ? "translate-x-0" : "translate-x-[calc(100%_+_1rem)]"], "fixed rounded-lg bg-$ud-bg text-$ud-text right-4 bottom-4 w-130 transition-all shadow-md divide-y divide-$ud-border-secondary"])
		        }, [
		          vue.createElementVNode("header", {
		            class: "relative w-full flex px-3 items-center select-none cursor-pointer",
		            onClick: _cache[6] || (_cache[6] = ($event) => vue.unref(toggleShowTable)())
		          }, [
		            vue.createElementVNode("div", null, [
		              vue.createElementVNode("div", {
		                class: vue.normalizeClass(["i-carbon-chevron-left", vue.unref(showTable) ? "-rotate-90" : "rotate-90"])
		              }, null, 2)
		            ]),
		            vue.withDirectives(vue.createElementVNode("div", _hoisted_1$5, [
		              vue.createVNode(_component_i18n_t, { keypath: "tip" }, {
		                count: vue.withCtx(() => {
		                  var _a;
		                  return [
		                    vue.createElementVNode("span", {
		                      class: vue.normalizeClass([vue.unref(isLoading) && "animate-pulse text-transparent", "rounded-full mx-1 px-2 py-0.25 text-xs bg-indigo-500 text-white"])
		                    }, vue.toDisplayString((_a = vue.unref(data)) == null ? void 0 : _a.length), 3)
		                  ];
		                }),
		                host: vue.withCtx(() => [
		                  vue.createElementVNode("span", {
		                    title: vue.unref(pagePsl) ?? ""
		                  }, vue.toDisplayString(vue.unref(pagePsl)), 9, _hoisted_2$4)
		                ]),
		                _: 1
		              })
		            ], 512), [
		              [vue.vShow, !vue.unref(search)]
		            ]),
		            vue.withDirectives(vue.createElementVNode("div", _hoisted_3$3, [
		              vue.withDirectives(vue.createElementVNode("input", {
		                ref_key: "searchInput",
		                ref: searchInput,
		                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(searchSite) ? searchSite.value = $event : null),
		                type: "text",
		                class: "bg-$ud-bg text-sm p-0 border-none rounded-sm px-1 w-full",
		                placeholder: _ctx.$t("search-placeholder"),
		                onClick: _cache[1] || (_cache[1] = vue.withModifiers(() => {
		                }, ["stop"])),
		                onKeypress: _cache[2] || (_cache[2] = vue.withKeys(($event) => onSearchEnter(), ["enter"]))
		              }, null, 40, _hoisted_4$3), [
		                [vue.vModelText, vue.unref(searchSite)]
		              ])
		            ], 512), [
		              [vue.vShow, vue.unref(search)]
		            ]),
		            vue.createElementVNode("div", {
		              class: "ml-auto hover:bg-$ud-bg-hover rounded p-1",
		              onClick: _cache[3] || (_cache[3] = vue.withModifiers(($event) => vue.unref(toggleSearch)(), ["stop"]))
		            }, _hoisted_6$3),
		            vue.createElementVNode("div", {
		              class: "hover:bg-$ud-bg-hover rounded p-1",
		              onClick: _cache[4] || (_cache[4] = vue.withModifiers(($event) => _ctx.$emit("setting"), ["stop"]))
		            }, _hoisted_8$2),
		            vue.createElementVNode("div", {
		              class: "hover:bg-$ud-bg-hover rounded p-1",
		              onClick: _cache[5] || (_cache[5] = vue.withModifiers(($event) => _ctx.$emit("update:show", false), ["stop"]))
		            }, _hoisted_10$2)
		          ]),
		          vue.unref(showTable) ? (vue.openBlock(), vue.createElementBlock("section", _hoisted_11$2, [
		            vue.createVNode(_component_DataTable, {
		              data: vue.unref(data) ?? [],
		              loading: vue.unref(isLoading)
		            }, null, 8, ["data", "loading"])
		          ])) : vue.createCommentVNode("", true)
		        ], 2);
		      };
		    }
		  });
		  const _hoisted_1$4 = /* @__PURE__ */ vue.createElementVNode("div", { class: "select-none" }, [
		    /* @__PURE__ */ vue.createElementVNode("div", { class: "i-carbon-settings w-4 h-4" })
		  ], -1);
		  const _hoisted_2$3 = [
		    _hoisted_1$4
		  ];
		  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
		    __name: "FloatActionButton",
		    props: {
		      modelValue: { type: Boolean }
		    },
		    emits: ["update:modelValue"],
		    setup(__props, { emit }) {
		      const props = __props;
		      const fab = vue.ref(null);
		      const { width: fabWidth, height: fabHeight } = useElementBounding(fab);
		      const { width, height } = useWindowSize();
		      const position = useGMStorage("ud_position", {
		        x: width.value - 64,
		        y: height.value - 64
		      });
		      const time = vue.ref(+/* @__PURE__ */ new Date());
		      const { isDragging, x, y, style: style2 } = useDraggable(fab, {
		        initialValue: position,
		        preventDefault: true,
		        onStart: () => {
		          time.value = +/* @__PURE__ */ new Date();
		        },
		        onEnd: (_pos) => {
		          if (+/* @__PURE__ */ new Date() - time.value < 100)
		            emit("update:modelValue", !props.modelValue);
		        }
		      });
		      const isLeft = vue.computed(() => x.value < width.value / 2);
		      watchDebounced(
		        () => ({ x: x.value, y: y.value }),
		        (val) => {
		          position.value = val;
		        },
		        { debounce: 500, deep: true }
		      );
		      vue.watch(isDragging, (val) => {
		        if (!val) {
		          if (x.value >= width.value / 2)
		            x.value = width.value - fabWidth.value - 32;
		          else
		            x.value = 16;
		          if (y.value >= height.value - fabHeight.value)
		            y.value = height.value - fabHeight.value;
		          else if (y.value < -16)
		            y.value = 0;
		        }
		      });
		      vue.watch(width, (w, oldW) => {
		        if (x.value >= (oldW ?? height.value) / 2)
		          x.value = w - fabWidth.value - 16;
		        else
		          x.value = 16;
		      });
		      vue.watch(height, (h, oldH) => {
		        if (y.value >= (oldH ?? height.value) / 2) {
		          const bottom = (oldH ?? height.value) - y.value;
		          y.value = h - bottom;
		        }
		      });
		      return (_ctx, _cache) => {
		        return vue.openBlock(), vue.createElementBlock("div", {
		          ref_key: "fab",
		          ref: fab,
		          class: vue.normalizeClass(["fixed ease-out rounded-md shadow-md bg-$ud-bg text-$ud-text p-2", [
		            vue.unref(isDragging) ? "transition-transform" : "transition-all",
		            _ctx.modelValue ? vue.unref(isLeft) ? "-translate-x-[calc(100%_+_1rem)]" : "translate-x-[calc(100%_+_1rem)]" : "translate-x-0"
		          ]]),
		          style: vue.normalizeStyle([{ "touch-action": "none" }, vue.unref(style2)])
		        }, _hoisted_2$3, 6);
		      };
		    }
		  });
		  const _hoisted_1$3 = { class: "p-2 gap-y-1 inline-flex flex-wrap relative shadow-sm border-1px border-$ud-border rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500" };
		  const _hoisted_2$2 = ["onClick"];
		  const _hoisted_3$2 = /* @__PURE__ */ vue.createElementVNode("div", { class: "sr-only" }, " Remove ", -1);
		  const _hoisted_4$2 = /* @__PURE__ */ vue.createElementVNode("div", { class: "h-3 w-3 i-carbon-close" }, null, -1);
		  const _hoisted_5$2 = [
		    _hoisted_3$2,
		    _hoisted_4$2
		  ];
		  const _hoisted_6$2 = ["onKeypress"];
		  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
		    __name: "TagsInput",
		    props: {
		      tags: {}
		    },
		    emits: ["update:tags"],
		    setup(__props, { emit }) {
		      const props = __props;
		      const inputVal = vue.ref("");
		      function onFilterAdd() {
		        if (inputVal.value !== "") {
		          emit("update:tags", [...props.tags, inputVal.value]);
		          inputVal.value = "";
		        }
		      }
		      const onFilterBack = useThrottleFn(() => {
		        if (props.tags.length > 0 && inputVal.value === "")
		          removeByIndex(props.tags.length - 1);
		      }, 500);
		      function removeByIndex(index) {
		        emit(
		          "update:tags",
		          props.tags.filter((_, i) => i !== index)
		        );
		      }
		      return (_ctx, _cache) => {
		        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
		          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(_ctx.tags, (item, i) => {
		            return vue.openBlock(), vue.createElementBlock("div", {
		              key: item,
		              class: "inline-flex mr-1 rounded-full items-center py-0.5 pl-2.5 pr-1 text-xs font-medium bg-indigo-100 text-indigo-700"
		            }, [
		              vue.createElementVNode("span", null, vue.toDisplayString(item), 1),
		              vue.createElementVNode("button", {
		                type: "button",
		                class: "flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white",
		                onClick: ($event) => removeByIndex(i)
		              }, _hoisted_5$2, 8, _hoisted_2$2)
		            ]);
		          }), 128)),
		          vue.withDirectives(vue.createElementVNode("input", {
		            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.isRef(inputVal) ? inputVal.value = $event : null),
		            type: "text",
		            class: "bg-transparent border-none ring-none! flex-1 p-0 text-xs",
		            onKeypress: vue.withKeys(onFilterAdd, ["enter"]),
		            onKeydown: _cache[1] || (_cache[1] = vue.withKeys(
		              //@ts-ignore
		              (...args) => vue.unref(onFilterBack) && vue.unref(onFilterBack)(...args),
		              ["backspace"]
		            ))
		          }, null, 40, _hoisted_6$2), [
		            [vue.vModelText, vue.unref(inputVal)]
		          ])
		        ]);
		      };
		    }
		  });
		  const _hoisted_1$2 = ["aria-checked"];
		  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
		    __name: "Toggle",
		    props: {
		      modelValue: { type: Boolean }
		    },
		    emits: ["update:modelValue"],
		    setup(__props) {
		      return (_ctx, _cache) => {
		        return vue.openBlock(), vue.createElementBlock("button", {
		          type: "button",
		          class: vue.normalizeClass(["relative inline-flex flex-shrink-0 h-4 w-9 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", _ctx.modelValue ? "bg-indigo-600" : "bg-gray-200"]),
		          role: "switch",
		          "aria-checked": _ctx.modelValue,
		          onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:modelValue", !_ctx.modelValue))
		        }, [
		          vue.createElementVNode("span", {
		            "aria-hidden": "true",
		            class: vue.normalizeClass(["pointer-events-none inline-block h-3 w-3 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200", _ctx.modelValue ? "translate-x-5" : "translate-x-0"])
		          }, null, 2)
		        ], 10, _hoisted_1$2);
		      };
		    }
		  });
		  const _hoisted_1$1 = { class: "mt-1 relative" };
		  const _hoisted_2$1 = ["aria-expanded"];
		  const _hoisted_3$1 = { class: "flex items-center" };
		  const _hoisted_4$1 = { class: "block truncate uppercase" };
		  const _hoisted_5$1 = /* @__PURE__ */ vue.createElementVNode("span", { class: "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none" }, [
		    /* @__PURE__ */ vue.createElementVNode("div", { class: "i-carbon-chevron-sort" })
		  ], -1);
		  const _hoisted_6$1 = ["aria-activedescendant"];
		  const _hoisted_7$1 = ["id", "onClick", "onKeydown"];
		  const _hoisted_8$1 = { class: "flex items-center" };
		  const _hoisted_9$1 = {
		    key: 0,
		    class: "text-indigo-600 group-focus:text-$ud-text hover:text-$ud-text absolute inset-y-0 right-0 flex items-center pr-4"
		  };
		  const _hoisted_10$1 = /* @__PURE__ */ vue.createElementVNode("div", { class: "i-carbon-checkmark" }, null, -1);
		  const _hoisted_11$1 = [
		    _hoisted_10$1
		  ];
		  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
		    __name: "LocaleSelect",
		    setup(__props) {
		      const { locale, messages } = vueI18n.useI18n({ useScope: "global" });
		      const [show, toggleShow] = useToggle(false);
		      const locales = vue.computed(() => Object.keys(messages.value));
		      function onChangeLocale(to) {
		        locale.value = to;
		        toggleShow(false);
		      }
		      const button = vue.ref(null);
		      const listbox = vue.ref(null);
		      const activedescendant = vue.ref(0);
		      function onKeyboardShow() {
		        toggleShow(true);
		        vue.nextTick(() => {
		          var _a;
		          ((_a = listbox.value) == null ? void 0 : _a.children.item(0)).focus();
		        });
		      }
		      function onKeyArrowUp(e) {
		        activedescendant.value = activedescendant.value - 1 < 0 ? locales.value.length - 1 : activedescendant.value - 1;
		        const parentEl = e.target.parentElement;
		        if (!parentEl)
		          return;
		        parentEl.children.item(activedescendant.value).focus();
		      }
		      function onKeyArrowDown(e) {
		        activedescendant.value = activedescendant.value + 1 > locales.value.length - 1 ? 0 : activedescendant.value + 1;
		        const parentEl = e.target.parentElement;
		        if (!parentEl)
		          return;
		        parentEl.children.item(activedescendant.value).focus();
		      }
		      function onLocaleEnter(to) {
		        var _a;
		        onChangeLocale(to);
		        (_a = button.value) == null ? void 0 : _a.focus();
		      }
		      function onEsc() {
		        var _a;
		        toggleShow(false);
		        (_a = button.value) == null ? void 0 : _a.focus();
		      }
		      const settings2 = useUserjsDiggerSettings();
		      vue.watch(locale, (val) => {
		        settings2.value.locale = val;
		      });
		      return (_ctx, _cache) => {
		        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
		          vue.createElementVNode("button", {
		            ref_key: "button",
		            ref: button,
		            type: "button",
		            class: "relative w-full bg-$ud-bg border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
		            "aria-haspopup": "listbox",
		            "aria-expanded": vue.unref(show),
		            onClick: _cache[0] || (_cache[0] = ($event) => vue.unref(toggleShow)()),
		            onKeydown: _cache[1] || (_cache[1] = vue.withKeys(vue.withModifiers(($event) => onKeyboardShow(), ["prevent"]), ["arrow-down"]))
		          }, [
		            vue.createElementVNode("div", _hoisted_3$1, [
		              vue.createElementVNode("span", _hoisted_4$1, vue.toDisplayString(vue.unref(locale)), 1)
		            ]),
		            _hoisted_5$1
		          ], 40, _hoisted_2$1),
		          vue.createVNode(vue.Transition, {
		            "leave-active-class": "transition ease-in duration-100",
		            "leave-from-class": "opacity-100",
		            "leave-to-class": "opacity-0"
		          }, {
		            default: vue.withCtx(() => [
		              vue.unref(show) ? (vue.openBlock(), vue.createElementBlock("ul", {
		                key: 0,
		                ref_key: "listbox",
		                ref: listbox,
		                class: "absolute z-10 mt-1 w-full bg-$ud-bg shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm",
		                tabindex: "-1",
		                "aria-activedescendant": `listbox-option-${vue.unref(activedescendant)}`
		              }, [
		                (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(locales), (lang, index) => {
		                  return vue.openBlock(), vue.createElementBlock("li", {
		                    id: `listbox-option-${index + 1}`,
		                    key: lang,
		                    class: "group text-$ud-text cursor-default select-none relative py-2 pl-3 pr-9 focus:text-white focus:bg-indigo-600 hover:text-white hover:bg-indigo-600",
		                    role: "option",
		                    tabindex: "0",
		                    onClick: ($event) => onChangeLocale(lang),
		                    onKeydown: [
		                      vue.withKeys(vue.withModifiers(($event) => onLocaleEnter(lang), ["prevent"]), ["enter"]),
		                      vue.withKeys(vue.withModifiers(onKeyArrowUp, ["prevent"]), ["arrow-up"]),
		                      vue.withKeys(vue.withModifiers(onKeyArrowDown, ["prevent"]), ["arrow-down"]),
		                      vue.withKeys(vue.withModifiers(onEsc, ["prevent"]), ["esc"])
		                    ]
		                  }, [
		                    vue.createElementVNode("div", _hoisted_8$1, [
		                      vue.createElementVNode("span", {
		                        class: vue.normalizeClass(["font-normal block truncate uppercase", vue.unref(locale) === lang ? "font-semibold" : "font-normal"])
		                      }, vue.toDisplayString(lang), 3)
		                    ]),
		                    lang === vue.unref(locale) ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_9$1, _hoisted_11$1)) : vue.createCommentVNode("", true)
		                  ], 40, _hoisted_7$1);
		                }), 128))
		              ], 8, _hoisted_6$1)) : vue.createCommentVNode("", true)
		            ]),
		            _: 1
		          })
		        ]);
		      };
		    }
		  });
		  const _hoisted_1 = { class: "border-b border-b-$ud-border p-4 flex items-center" };
		  const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("div", { class: "i-carbon-close" }, null, -1);
		  const _hoisted_3 = [
		    _hoisted_2
		  ];
		  const _hoisted_4 = { class: "divide-y divide-$ud-border px-4 py-2 h-60 overflow-y-scroll" };
		  const _hoisted_5 = { class: "py-2 flex items-center justify-between space-x-4" };
		  const _hoisted_6 = { class: "flex flex-col w-4/5 overflow-hidden" };
		  const _hoisted_7 = { class: "text-sm font-medium" };
		  const _hoisted_8 = { class: "text-sm text-$ud-text-secondary text-xs" };
		  const _hoisted_9 = { class: "py-2 flex items-center justify-between space-x-4" };
		  const _hoisted_10 = { class: "flex flex-col w-4/5 overflow-hidden" };
		  const _hoisted_11 = { class: "text-sm font-medium" };
		  const _hoisted_12 = { class: "text-sm text-$ud-text-secondary text-xs" };
		  const _hoisted_13 = { class: "py-2 flex items-center justify-between space-x-4" };
		  const _hoisted_14 = { class: "flex flex-col w-4/5 overflow-hidden" };
		  const _hoisted_15 = { class: "text-sm font-medium" };
		  const _hoisted_16 = { class: "text-sm text-$ud-text-secondary text-xs" };
		  const _hoisted_17 = { class: "py-2 flex flex-col space-y-2" };
		  const _hoisted_18 = { class: "flex flex-col w-4/5 overflow-hidden" };
		  const _hoisted_19 = { class: "text-sm font-medium" };
		  const _hoisted_20 = { class: "text-sm text-$ud-text-secondary text-xs" };
		  const _hoisted_21 = ["title"];
		  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
		    __name: "SettingsPanel",
		    props: {
		      show: { type: Boolean }
		    },
		    emits: ["update:show"],
		    setup(__props, { emit }) {
		      const dialog = vue.ref(null);
		      onClickOutside(dialog, () => {
		        emit("update:show", false);
		      });
		      const settings2 = useUserjsDiggerSettings();
		      const enable = useSessionStorage("ud_show", true);
		      const { t } = vueI18n.useI18n();
		      return (_ctx, _cache) => {
		        const _component_LocaleSelect = _sfc_main$2;
		        const _component_Toggle = _sfc_main$3;
		        const _component_TagsInput = _sfc_main$4;
		        return _ctx.show ? (vue.openBlock(), vue.createElementBlock("div", {
		          key: 0,
		          ref_key: "dialog",
		          ref: dialog,
		          class: "fixed left-1/2 -translate-x-1/2 top-25vh w-100 shadow-md rounded bg-$ud-bg text-$ud-text"
		        }, [
		          vue.createElementVNode("div", _hoisted_1, [
		            vue.createElementVNode("div", null, vue.toDisplayString(vue.unref(t)("settings")), 1),
		            vue.createElementVNode("div", {
		              class: "ml-auto p-1 hover:bg-$ud-bg-hover rounded",
		              onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("update:show", false))
		            }, _hoisted_3)
		          ]),
		          vue.createElementVNode("ul", _hoisted_4, [
		            vue.createElementVNode("li", _hoisted_5, [
		              vue.createElementVNode("div", _hoisted_6, [
		                vue.createElementVNode("p", _hoisted_7, vue.toDisplayString(vue.unref(t)("language")), 1),
		                vue.createElementVNode("p", _hoisted_8, vue.toDisplayString(vue.unref(t)("language-desc")), 1)
		              ]),
		              vue.createVNode(_component_LocaleSelect)
		            ]),
		            vue.createElementVNode("li", _hoisted_9, [
		              vue.createElementVNode("div", _hoisted_10, [
		                vue.createElementVNode("p", _hoisted_11, vue.toDisplayString(vue.unref(t)("enable")), 1),
		                vue.createElementVNode("p", _hoisted_12, vue.toDisplayString(vue.unref(t)("enable-desc")), 1)
		              ]),
		              vue.createVNode(_component_Toggle, {
		                modelValue: vue.unref(enable),
		                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.isRef(enable) ? enable.value = $event : null)
		              }, null, 8, ["modelValue"])
		            ]),
		            vue.createElementVNode("li", _hoisted_13, [
		              vue.createElementVNode("div", _hoisted_14, [
		                vue.createElementVNode("p", _hoisted_15, vue.toDisplayString(vue.unref(t)("nsfw")), 1),
		                vue.createElementVNode("p", _hoisted_16, vue.toDisplayString(vue.unref(t)("nsfw-desc")), 1)
		              ]),
		              vue.createVNode(_component_Toggle, {
		                modelValue: vue.unref(settings2).nsfw,
		                "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(settings2).nsfw = $event)
		              }, null, 8, ["modelValue"])
		            ]),
		            vue.createElementVNode("li", _hoisted_17, [
		              vue.createElementVNode("div", _hoisted_18, [
		                vue.createElementVNode("p", _hoisted_19, vue.toDisplayString(vue.unref(t)("filter")), 1),
		                vue.createElementVNode("p", _hoisted_20, [
		                  vue.createTextVNode(vue.toDisplayString(vue.unref(t)("filter-desc")) + " ", 1),
		                  vue.createElementVNode("span", {
		                    class: "underline cursor-help",
		                    title: vue.unref(t)("filter-tips")
		                  }, "(?)", 8, _hoisted_21)
		                ])
		              ]),
		              vue.createVNode(_component_TagsInput, {
		                tags: vue.unref(settings2).filter,
		                "onUpdate:tags": _cache[3] || (_cache[3] = ($event) => vue.unref(settings2).filter = $event)
		              }, null, 8, ["tags"])
		            ])
		          ])
		        ], 512)) : vue.createCommentVNode("", true);
		      };
		    }
		  });
		  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
		    __name: "App",
		    setup(__props) {
		      const collapse = vue.ref(false);
		      const enable = useSessionStorage("ud_show", true);
		      const [settingShow, toggleSettingShow] = useToggle(false);
		      return (_ctx, _cache) => {
		        const _component_SettingsPanel = _sfc_main$1;
		        const _component_FloatActionButton = _sfc_main$5;
		        const _component_MainPanel = _sfc_main$6;
		        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
		          vue.createVNode(_component_SettingsPanel, {
		            show: vue.unref(settingShow),
		            "onUpdate:show": _cache[0] || (_cache[0] = ($event) => vue.isRef(settingShow) ? settingShow.value = $event : null)
		          }, null, 8, ["show"]),
		          vue.unref(enable) ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 0 }, [
		            vue.createVNode(_component_FloatActionButton, {
		              modelValue: vue.unref(collapse),
		              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.isRef(collapse) ? collapse.value = $event : null)
		            }, null, 8, ["modelValue"]),
		            vue.createVNode(_component_MainPanel, {
		              show: vue.unref(collapse),
		              "onUpdate:show": _cache[2] || (_cache[2] = ($event) => vue.isRef(collapse) ? collapse.value = $event : null),
		              onSetting: _cache[3] || (_cache[3] = ($event) => vue.unref(toggleSettingShow)(true))
		            }, null, 8, ["show"])
		          ], 64)) : vue.createCommentVNode("", true)
		        ], 64);
		      };
		    }
		  });
		  function attachUnocss(root) {
		    {
		      Promise.resolve().then(() => __unocss_raw$1).then(({ default: css }) => {
		        const style2 = document.createElement("style");
		        style2.innerText = css;
		        root.appendChild(style2);
		      });
		    }
		  }
		  const settings = useUserjsDiggerSettings();
		  const i18n = vueI18n.createI18n({
		    legacy: false,
		    locale: settings.value.locale,
		    fallbackLocale: "en",
		    messages: { zh: resource$1, en: resource }
		  });
		  if (!HTMLElement.prototype.attachShadow) {
		    console.error("shadow-dom doesn't support in current website, load polyfill");
		    useScriptTag("https://unpkg.com/attachshadow@0.3.0/min.js", () => {
		      initUserjsDigger(Element.prototype.attachShadow);
		    });
		  } else {
		    initUserjsDigger();
		  }
		  function initUserjsDigger(attachShadow = HTMLElement.prototype.attachShadow) {
		    customElements.define(
		      "userjs-digger",
		      class extends HTMLElement {
		        constructor() {
		          super();
		          __publicField(this, "app");
		          const app = document.createElement("div");
		          const shadow = attachShadow.call(this, { mode: "open" });
		          const resetStyle = document.createElement("style");
		          resetStyle.innerHTML = reset;
		          attachUnocss(shadow);
		          shadow.appendChild(resetStyle);
		          shadow.appendChild(app);
		          this.app = vue.createApp(_sfc_main);
		          this.app.use(i18n);
		          this.app.provide("container", app);
		          this.app.mount(app);
		        }
		      }
		    );
		    const userDigger = document.createElement("userjs-digger");
		    document.body.append(userDigger);
		  }
		  const __unocss_raw = `/* layer: preflights */*,::before,::after{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgba(0,0,0,0);--un-ring-shadow:0 0 rgba(0,0,0,0);--un-shadow-inset: ;--un-shadow:0 0 rgba(0,0,0,0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 rgba(0,0,0,0);--un-ring-shadow:0 0 rgba(0,0,0,0);--un-shadow-inset: ;--un-shadow:0 0 rgba(0,0,0,0);--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,0.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: ;}[type='text'], [type='email'], [type='url'], [type='password'], [type='number'], [type='date'], [type='datetime-local'], [type='month'], [type='search'], [type='tel'], [type='time'], [type='week'], [multiple], textarea, select { appearance: none;background-color: #fff;border-color: #6b7280;border-width: 1px;border-radius: 0;padding-top: 0.5rem;padding-right: 0.75rem;padding-bottom: 0.5rem;padding-left: 0.75rem;font-size: 1rem;line-height: 1.5rem;--un-shadow: 0 0 #0000; }[type='text']:focus, [type='email']:focus, [type='url']:focus, [type='password']:focus, [type='number']:focus, [type='date']:focus, [type='datetime-local']:focus, [type='month']:focus, [type='search']:focus, [type='tel']:focus, [type='time']:focus, [type='week']:focus, [multiple]:focus, textarea:focus, select:focus { outline: 2px solid transparent;outline-offset: 2px;--un-ring-inset: var(--un-empty,/*!*/ /*!*/);--un-ring-offset-width: 0px;--un-ring-offset-color: #fff;--un-ring-color: #2563eb;--un-ring-offset-shadow: var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color);--un-ring-shadow: var(--un-ring-inset) 0 0 0 calc(1px + var(--un-ring-offset-width)) var(--un-ring-color);box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);border-color: #2563eb; }input::placeholder, textarea::placeholder { color: #6b7280;opacity: 1; }::-webkit-datetime-edit-fields-wrapper { padding: 0; }::-webkit-date-and-time-value { min-height: 1.5em; }::-webkit-datetime-edit, ::-webkit-datetime-edit-year-field, ::-webkit-datetime-edit-month-field, ::-webkit-datetime-edit-day-field, ::-webkit-datetime-edit-hour-field, ::-webkit-datetime-edit-minute-field, ::-webkit-datetime-edit-second-field, ::-webkit-datetime-edit-millisecond-field, ::-webkit-datetime-edit-meridiem-field { padding-top: 0;padding-bottom: 0; }select { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");background-position: right 0.5rem center;background-repeat: no-repeat;background-size: 1.5em 1.5em;padding-right: 2.5rem;print-color-adjust: exact; }[multiple] { background-image: initial;background-position: initial;background-repeat: unset;background-size: initial;padding-right: 0.75rem;print-color-adjust: unset; }[type='checkbox'], [type='radio'] { appearance: none;padding: 0;print-color-adjust: exact;display: inline-block;vertical-align: middle;background-origin: border-box;user-select: none;flex-shrink: 0;height: 1rem;width: 1rem;color: #2563eb;background-color: #fff;border-color: #6b7280;border-width: 1px;--un-shadow: 0 0 #0000; }[type='checkbox'] { border-radius: 0; }[type='radio'] { border-radius: 100%; }[type='checkbox']:focus, [type='radio']:focus { outline: 2px solid transparent;outline-offset: 2px;--un-ring-inset: var(--un-empty,/*!*/ /*!*/);--un-ring-offset-width: 2px;--un-ring-offset-color: #fff;--un-ring-color: #2563eb;--un-ring-offset-shadow: var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color);--un-ring-shadow: var(--un-ring-inset) 0 0 0 calc(2px + var(--un-ring-offset-width)) var(--un-ring-color);box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow); }[type='checkbox']:checked, [type='radio']:checked { border-color: transparent;background-color: currentColor;background-size: 100% 100%;background-position: center;background-repeat: no-repeat; }[type='checkbox']:checked { background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e"); }[type='radio']:checked { background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e"); }[type='checkbox']:checked:hover, [type='checkbox']:checked:focus, [type='radio']:checked:hover, [type='radio']:checked:focus { border-color: transparent;background-color: currentColor; }[type='checkbox']:indeterminate { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");border-color: transparent;background-color: currentColor;background-size: 100% 100%;background-position: center;background-repeat: no-repeat; }[type='checkbox']:indeterminate:hover, [type='checkbox']:indeterminate:focus { border-color: transparent;background-color: currentColor; }[type='file'] { background: unset;border-color: inherit;border-width: 0;border-radius: 0;padding: 0;font-size: unset;line-height: inherit; }[type='file']:focus { outline: 1px solid ButtonText , 1px auto -webkit-focus-ring-color; }[data-v-app]{font-size:16px}:host{z-index:999999;position:relative}/* layer: icons */.i-carbon-caret-sort{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m24 24l-8 8l-8-8zM8 8l8-8l8 8z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}.i-carbon-caret-sort-down{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m24 24l-8 8l-8-8z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}.i-carbon-caret-sort-up{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m8 8l8-8l8 8z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}.i-carbon-checkmark{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m13 24l-9-9l1.414-1.414L13 21.171L26.586 7.586L28 9L13 24z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}.i-carbon-chevron-left{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M10 16L20 6l1.4 1.4l-8.6 8.6l8.6 8.6L20 26z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}.i-carbon-chevron-right{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M22 16L12 26l-1.4-1.4l8.6-8.6l-8.6-8.6L12 6z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}.i-carbon-chevron-sort{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m16 28l-7-7l1.41-1.41L16 25.17l5.59-5.58L23 21l-7 7zm0-24l7 7l-1.41 1.41L16 6.83l-5.59 5.58L9 11l7-7z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}.i-carbon-close{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}.i-carbon-settings{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11.35 11.35 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.48 11.48 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11.35 11.35 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.48 11.48 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.86 8.86 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.36 9.36 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.86 8.86 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.36 9.36 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z'/%3E%3Cpath fill='currentColor' d='M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6Zm0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}.i-carbon\\:search{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='m29 27.586l-7.552-7.552a11.018 11.018 0 1 0-1.414 1.414L27.586 29ZM4 13a9 9 0 1 1 9 9a9.01 9.01 0 0 1-9-9Z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}.i-carbon\\:settings-adjust{--un-icon:url("data:image/svg+xml;utf8,%3Csvg viewBox='0 0 32 32' width='1em' height='1em' xmlns='http://www.w3.org/2000/svg' %3E%3Cpath fill='currentColor' d='M30 8h-4.1c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2h14.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30V8zm-9 4c-1.7 0-3-1.3-3-3s1.3-3 3-3s3 1.3 3 3s-1.3 3-3 3zM2 24h4.1c.5 2.3 2.5 4 4.9 4s4.4-1.7 4.9-4H30v-2H15.9c-.5-2.3-2.5-4-4.9-4s-4.4 1.7-4.9 4H2v2zm9-4c1.7 0 3 1.3 3 3s-1.3 3-3 3s-3-1.3-3-3s1.3-3 3-3z'/%3E%3C/svg%3E");-webkit-mask:var(--un-icon) no-repeat;mask:var(--un-icon) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;width:1em;height:1em;}/* layer: shortcuts */.container{width:100%;}@media (min-width: 640px){.container{max-width:640px;}}@media (min-width: 768px){.container{max-width:768px;}}@media (min-width: 1024px){.container{max-width:1024px;}}@media (min-width: 1280px){.container{max-width:1280px;}}@media (min-width: 1536px){.container{max-width:1536px;}}/* layer: default */.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;}.pointer-events-none{pointer-events:none;}.absolute{position:absolute;}.fixed{position:fixed;}.relative{position:relative;}.inset-y-0{top:0;bottom:0;}.bottom-4{bottom:16px;}.left-1\\/2{left:50%;}.right-0{right:0;}.right-4{right:16px;}.top-25vh{top:25vh;}.z-10{z-index:10;}.grid{display:grid;}.col-span-5{grid-column:span 5/span 5;}.grid-cols-6{grid-template-columns:repeat(6,minmax(0,1fr));}.mx-1{margin-left:4px;margin-right:4px;}.mx-2{margin-left:8px;margin-right:8px;}.ml-0\\.5{margin-left:2px;}.ml-auto{margin-left:auto;}.mr-1{margin-right:4px;}.mt-1{margin-top:4px;}.block{display:block;}.inline-block{display:inline-block;}.h-10{height:40px;}.h-3{height:12px;}.h-4{height:16px;}.h-60{height:240px;}.max-h-60{max-height:240px;}.max-w-60{max-width:240px;}.min-w-full{min-width:100%;}.w-10{width:40px;}.w-100{width:400px;}.w-130{width:520px;}.w-20{width:80px;}.w-22{width:88px;}.w-3{width:12px;}.w-4{width:16px;}.w-4\\/5{width:80%;}.w-60{width:240px;}.w-8{width:32px;}.w-9{width:36px;}.w-full{width:100%;}.flex{display:flex;}.inline-flex{display:inline-flex;}.flex-1{flex:1 1 0%;}.flex-shrink-0{flex-shrink:0;}.flex-col{flex-direction:column;}.flex-wrap{flex-wrap:wrap;}.table{display:table;}.-translate-x-\\[calc\\(100\\%_\\+_1rem\\)\\]{--un-translate-x:calc(calc(100% + 16px) * -1);transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}.-translate-x-1\\/2{--un-translate-x:-50%;transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}.translate-x-\\[calc\\(100\\%_\\+_1rem\\)\\]{--un-translate-x:calc(100% + 16px);transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}.translate-x-0{--un-translate-x:0;transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}.translate-x-5{--un-translate-x:20px;transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}.-rotate-90{--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-rotate:-90deg;transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}.rotate-90{--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-rotate:90deg;transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}.transform{transform:translateX(var(--un-translate-x)) translateY(var(--un-translate-y)) translateZ(var(--un-translate-z)) rotate(var(--un-rotate)) rotateX(var(--un-rotate-x)) rotateY(var(--un-rotate-y)) rotateZ(var(--un-rotate-z)) skewX(var(--un-skew-x)) skewY(var(--un-skew-y)) scaleX(var(--un-scale-x)) scaleY(var(--un-scale-y)) scaleZ(var(--un-scale-z));}@keyframes pulse{0%, 100% {opacity:1} 50% {opacity:.5}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.animate-pulse{animation:pulse 2s cubic-bezier(0.4,0,.6,1) infinite;}.animate-spin{animation:spin 1s linear infinite;}.cursor-default{cursor:default;}.cursor-help{cursor:help;}.cursor-pointer{cursor:pointer;}.select-none{-webkit-user-select:none;user-select:none;}.items-center{align-items:center;}.justify-center{justify-content:center;}.justify-between{justify-content:space-between;}.gap-y-1{row-gap:4px;}.gap-y-2{row-gap:8px;}.space-x-4>:not([hidden])~:not([hidden]){--un-space-x-reverse:0;margin-left:calc(16px * calc(1 - var(--un-space-x-reverse)));margin-right:calc(16px * var(--un-space-x-reverse));}.space-y-2>:not([hidden])~:not([hidden]){--un-space-y-reverse:0;margin-top:calc(8px * calc(1 - var(--un-space-y-reverse)));margin-bottom:calc(8px * var(--un-space-y-reverse));}.divide-y>:not([hidden])~:not([hidden]){--un-divide-y-reverse:0;border-top-width:calc(1px * calc(1 - var(--un-divide-y-reverse)));border-bottom-width:calc(1px * var(--un-divide-y-reverse));}.divide-\\$ud-border-secondary>:not([hidden])~:not([hidden]){border-color:var(--ud-border-secondary);}.border-\\$ud-border,.divide-\\$ud-border>:not([hidden])~:not([hidden]){border-color:var(--ud-border);}.overflow-auto{overflow:auto;}.overflow-hidden{overflow:hidden;}.overflow-y-overlay{overflow-y:overlay;}.overflow-y-scroll{overflow-y:scroll;}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.break-all{word-break:break-all;}.border,.border-1px{border-width:1px;}.border-2{border-width:2px;}.border-b{border-bottom-width:1px;}.border-gray-300{--un-border-opacity:1;border-color:rgba(209,213,219,var(--un-border-opacity));}.border-transparent{border-color:transparent;}.focus-within\\:border-indigo-500:focus-within{--un-border-opacity:1;border-color:rgba(99,102,241,var(--un-border-opacity));}.focus\\:border-indigo-500:focus{--un-border-opacity:1;border-color:rgba(99,102,241,var(--un-border-opacity));}.border-b-\\$ud-border{border-bottom-color:var(--ud-border);}.rounded{border-radius:4px;}.rounded-full{border-radius:9999px;}.rounded-lg{border-radius:8px;}.rounded-md{border-radius:6px;}.rounded-sm{border-radius:2px;}.border-none{border-style:none;}.bg-\\$ud-bg{background-color:var(--ud-bg);}.bg-\\$ud-bg-secondary{background-color:var(--ud-bg-secondary);}.bg-gray-200{--un-bg-opacity:1;background-color:rgba(229,231,235,var(--un-bg-opacity));}.bg-indigo-100{--un-bg-opacity:1;background-color:rgba(224,231,255,var(--un-bg-opacity));}.bg-indigo-500{--un-bg-opacity:1;background-color:rgba(99,102,241,var(--un-bg-opacity));}.bg-indigo-600{--un-bg-opacity:1;background-color:rgba(79,70,229,var(--un-bg-opacity));}.bg-transparent{background-color:transparent;}.bg-white{--un-bg-opacity:1;background-color:rgba(255,255,255,var(--un-bg-opacity));}.hover\\:bg-\\$ud-bg-hover:hover{background-color:var(--ud-bg-hover);}.hover\\:bg-indigo-200:hover{--un-bg-opacity:1;background-color:rgba(199,210,254,var(--un-bg-opacity));}.hover\\:bg-indigo-600:hover{--un-bg-opacity:1;background-color:rgba(79,70,229,var(--un-bg-opacity));}.focus\\:bg-indigo-500:focus{--un-bg-opacity:1;background-color:rgba(99,102,241,var(--un-bg-opacity));}.focus\\:bg-indigo-600:focus{--un-bg-opacity:1;background-color:rgba(79,70,229,var(--un-bg-opacity));}.p-0{padding:0;}.p-1{padding:4px;}.p-2{padding:8px;}.p-3{padding:12px;}.p-4{padding:16px;}.px-1{padding-left:4px;padding-right:4px;}.px-2{padding-left:8px;padding-right:8px;}.px-3{padding-left:12px;padding-right:12px;}.px-4{padding-left:16px;padding-right:16px;}.py-0\\.25{padding-top:1px;padding-bottom:1px;}.py-0\\.5{padding-top:2px;padding-bottom:2px;}.py-1{padding-top:4px;padding-bottom:4px;}.py-10{padding-top:40px;padding-bottom:40px;}.py-2{padding-top:8px;padding-bottom:8px;}.pl-2\\.5{padding-left:10px;}.pl-3{padding-left:12px;}.pl-4{padding-left:16px;}.pr-1{padding-right:4px;}.pr-10{padding-right:40px;}.pr-2{padding-right:8px;}.pr-3{padding-right:12px;}.pr-4{padding-right:16px;}.pr-9{padding-right:36px;}.text-center{text-align:center;}.text-left{text-align:left;}.text-right{text-align:right;}.align-middle{vertical-align:middle;}.text-base{font-size:16px;line-height:24px;}.text-sm{font-size:14px;line-height:20px;}.text-xs{font-size:12px;line-height:16px;}.font-medium{font-weight:500;}.font-normal{font-weight:400;}.font-semibold{font-weight:600;}.leading-5{line-height:20px;}.uppercase{text-transform:uppercase;}.text-\\$ud-text,.group:focus .group-focus\\:text-\\$ud-text{color:var(--ud-text);}.text-\\$ud-text-secondary{color:var(--ud-text-secondary);}.text-indigo-400{--un-text-opacity:1;color:rgba(129,140,248,var(--un-text-opacity));}.text-indigo-500{--un-text-opacity:1;color:rgba(99,102,241,var(--un-text-opacity));}.text-indigo-600{--un-text-opacity:1;color:rgba(79,70,229,var(--un-text-opacity));}.text-indigo-700{--un-text-opacity:1;color:rgba(67,56,202,var(--un-text-opacity));}.text-transparent{color:transparent;}.text-white{--un-text-opacity:1;color:rgba(255,255,255,var(--un-text-opacity));}.hover\\:text-\\$ud-text:hover{color:var(--ud-text);}.hover\\:text-indigo-500:hover{--un-text-opacity:1;color:rgba(99,102,241,var(--un-text-opacity));}.hover\\:text-indigo-900:hover{--un-text-opacity:1;color:rgba(49,46,129,var(--un-text-opacity));}.hover\\:text-white:hover{--un-text-opacity:1;color:rgba(255,255,255,var(--un-text-opacity));}.focus\\:text-white:focus{--un-text-opacity:1;color:rgba(255,255,255,var(--un-text-opacity));}.underline{text-decoration-line:underline;}.underline-\\$ud-border{-webkit-text-decoration-color:var(--ud-border);text-decoration-color:var(--ud-border);}.opacity-0{opacity:0;}.opacity-100{opacity:1;}.opacity-25{opacity:0.25;}.opacity-75{opacity:0.75;}.shadow{--un-shadow:var(--un-shadow-inset) 0 1px 3px 0 var(--un-shadow-color, rgba(0,0,0,0.1)),var(--un-shadow-inset) 0 1px 2px -1px var(--un-shadow-color, rgba(0,0,0,0.1));box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);}.shadow-lg{--un-shadow:var(--un-shadow-inset) 0 10px 15px -3px var(--un-shadow-color, rgba(0,0,0,0.1)),var(--un-shadow-inset) 0 4px 6px -4px var(--un-shadow-color, rgba(0,0,0,0.1));box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);}.shadow-md{--un-shadow:var(--un-shadow-inset) 0 4px 6px -1px var(--un-shadow-color, rgba(0,0,0,0.1)),var(--un-shadow-inset) 0 2px 4px -2px var(--un-shadow-color, rgba(0,0,0,0.1));box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);}.shadow-sm{--un-shadow:var(--un-shadow-inset) 0 1px 2px 0 var(--un-shadow-color, rgba(0,0,0,0.05));box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px;}.ring-0{--un-ring-width:0;--un-ring-offset-shadow:var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color);--un-ring-shadow:var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color);box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);}.ring-1{--un-ring-width:1px;--un-ring-offset-shadow:var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color);--un-ring-shadow:var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color);box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);}.ring-none\\!{--un-ring-width:0 !important;--un-ring-offset-shadow:var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color) !important;--un-ring-shadow:var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color) !important;box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow) !important;}.focus-within\\:ring-2:focus-within{--un-ring-width:2px;--un-ring-offset-shadow:var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color);--un-ring-shadow:var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color);box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);}.focus\\:ring-1:focus{--un-ring-width:1px;--un-ring-offset-shadow:var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color);--un-ring-shadow:var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color);box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);}.focus\\:ring-2:focus{--un-ring-width:2px;--un-ring-offset-shadow:var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color);--un-ring-shadow:var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color);box-shadow:var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow);}.focus\\:ring-offset-2:focus{--un-ring-offset-width:2px;}.ring-black{--un-ring-opacity:1;--un-ring-color:rgba(0,0,0,var(--un-ring-opacity));}.focus-within\\:ring-indigo-500:focus-within{--un-ring-opacity:1;--un-ring-color:rgba(99,102,241,var(--un-ring-opacity));}.focus\\:ring-indigo-500:focus{--un-ring-opacity:1;--un-ring-color:rgba(99,102,241,var(--un-ring-opacity));}.ring-opacity-5{--un-ring-opacity:0.05;}.filter{filter:var(--un-blur) var(--un-brightness) var(--un-contrast) var(--un-drop-shadow) var(--un-grayscale) var(--un-hue-rotate) var(--un-invert) var(--un-saturate) var(--un-sepia);}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transition-duration:150ms;}.duration-100{transition-duration:100ms;}.duration-200{transition-duration:200ms;}.ease-in{transition-timing-function:cubic-bezier(0.4, 0, 1, 1);}.ease-in-out{transition-timing-function:cubic-bezier(0.4, 0, 0.2, 1);}.ease-out{transition-timing-function:cubic-bezier(0, 0, 0.2, 1);}@media (min-width: 640px){.sm\\:text-sm{font-size:14px;line-height:20px;}}`;
		  const __unocss_raw$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
		    __proto__: null,
		    default: __unocss_raw
		  }, Symbol.toStringTag, { value: "Module" }));
		}); 
	} ());

})(Vue, VueI18n, psl);

// ==UserScript==
// @name         Steam Activity Alt
// @namespace    https://github.com/unluckyninja
// @version      0.1.0
// @description  make steam activites easier to look through
// @author       UnluckyNinja
// @include      /https://steamcommunity.com/.*/home/?/
// @grant        GM_addStyle
// @noframes
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.6/dist/vue.global.min.js
// @require      https://unpkg.com/vue-router@4.0.11/dist/vue-router.global.prod.js
// @downloadURL https://update.greasyfork.org/scripts/433564/Steam%20Activity%20Alt.user.js
// @updateURL https://update.greasyfork.org/scripts/433564/Steam%20Activity%20Alt.meta.js
// ==/UserScript==

          var styleEle = GM_addStyle(`.header[data-v-b5214c52]{font-size:1.125rem;line-height:1.75rem;margin:.5rem}.content[data-v-b5214c52]{margin:1rem}a[data-v-b5214c52]{--tw-text-opacity: 1;color:rgba(29,78,216,var(--tw-text-opacity))}*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset: var(--tw-empty, );--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgba(59, 130, 246, .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}:-moz-focusring{outline:1px dotted ButtonText}:-moz-ui-invalid{box-shadow:none}::moz-focus-inner{border-style:none;padding:0}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}abbr[title]{-webkit-text-decoration:underline dotted;text-decoration:underline dotted}a{color:inherit;text-decoration:inherit}body{margin:0;font-family:inherit;line-height:inherit}button{font-family:inherit;font-size:100%;line-height:1.15;margin:0;text-transform:none;background-color:transparent;background-image:none;padding:0;line-height:inherit;color:inherit}button,[type=button],[type=reset],[type=submit]{-webkit-appearance:button}button:focus{outline:1px dotted;outline:5px auto -webkit-focus-ring-color}button,[role=button]{cursor:pointer}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";line-height:1.5}img{border-style:solid;display:block;vertical-align:middle;max-width:100%;height:auto}p{margin:0}html,body,#app{height:100%;margin:0;padding:0}img{border-width:0px}html.dark{background:#121212}.btn{--tw-bg-opacity: 1;background-color:rgba(13,148,136,var(--tw-bg-opacity));border-radius:.25rem;cursor:pointer;display:inline-block;padding:.25rem 1rem;--tw-text-opacity: 1;color:rgba(255,255,255,var(--tw-text-opacity))}.btn:hover{--tw-bg-opacity: 1;background-color:rgba(15,118,110,var(--tw-bg-opacity))}.btn:disabled{--tw-bg-opacity: 1;background-color:rgba(75,85,99,var(--tw-bg-opacity));cursor:default;opacity:.5}.icon-btn{cursor:pointer;display:inline-block;opacity:.75;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-transition-property:background-color,border-color,color,fill,stroke,opacity,-webkit-box-shadow,-webkit-transform,filter,backdrop-filter;-o-transition-property:background-color,border-color,color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter;transition-property:background-color,border-color,color,fill,stroke,opacity,box-shadow,-webkit-box-shadow,transform,-webkit-transform,filter,backdrop-filter;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);-o-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transition-duration:.15s;-o-transition-duration:.15s;transition-duration:.15s;-webkit-transition-duration:.2s;-o-transition-duration:.2s;transition-duration:.2s;font-size:.9em}.icon-btn:hover{opacity:1;--tw-text-opacity: 1;color:rgba(13,148,136,var(--tw-text-opacity))}.bg-blue-gray-300{--tw-bg-opacity: 1;background-color:rgba(203,213,225,var(--tw-bg-opacity))}.dark .dark\:bg-blue-gray-700{--tw-bg-opacity: 1;background-color:rgba(51,65,85,var(--tw-bg-opacity))}.bg-red-500{--tw-bg-opacity: 1;background-color:rgba(239,68,68,var(--tw-bg-opacity))}.border-blue-gray-500{--tw-border-opacity: 1;border-color:rgba(100,116,139,var(--tw-border-opacity))}.border-current{border-color:currentColor}.rounded{border-radius:.25rem}.border{border-width:1px}.border-t{border-top-width:1px}.border-b-0{border-bottom-width:0px}.border-b{border-bottom-width:1px}.inline-block{display:inline-block}.flex{display:-webkit-box;display:-ms-flexbox;display:-webkit-flex;display:flex}.grid{display:-ms-grid;display:grid}.hidden{display:none}.flex-col{-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.items-center{-webkit-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center}.justify-center{-webkit-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center}.flex-1{-webkit-box-flex:1;-ms-flex:1 1 0%;-webkit-flex:1 1 0%;flex:1 1 0%}.flex-auto{-webkit-box-flex:1;-ms-flex:1 1 auto;-webkit-flex:1 1 auto;flex:1 1 auto}.h-10{height:2.5rem}.h-full{height:100%}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-4xl{font-size:2.25rem;line-height:2.5rem}.m-2{margin:.5rem}.m-4{margin:1rem}.m-3{margin:.75rem}.mx-2{margin-left:.5rem;margin-right:.5rem}.mx-auto{margin-left:auto;margin-right:auto}.ml-auto{margin-left:auto}.mt-1{margin-top:.25rem}.mr-1{margin-right:.25rem}.mr-4{margin-right:1rem}.mt-6{margin-top:1.5rem}.mt-8{margin-top:2rem}.max-w-screen-sm{max-width:640px}.min-h-0{min-height:0px}.opacity-50{opacity:.5}.focus\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.\!outline-none{outline:2px solid transparent!important;outline-offset:2px!important}.overflow-y-auto{overflow-y:auto}.p-4{padding:1rem}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-0{top:0px;right:0px;bottom:0px;left:0px}.right-full{right:100%}.shadow{--tw-shadow-color: 0, 0, 0;--tw-shadow: 0 1px 3px 0 rgba(var(--tw-shadow-color), .1), 0 1px 2px 0 rgba(var(--tw-shadow-color), .06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow\.appendChild\(realRoot\){--tw-shadow-color: 0, 0, 0;--tw-shadow: 0 1px 3px 0 rgba(var(--tw-shadow-color), .1), 0 1px 2px 0 rgba(var(--tw-shadow-color), .06);-webkit-box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.text-blue-gray-700{--tw-text-opacity: 1;color:rgba(51,65,85,var(--tw-text-opacity))}.dark .dark\:text-blue-gray-400{--tw-text-opacity: 1;color:rgba(148,163,184,var(--tw-text-opacity))}.w-full{width:100%}.w-10{width:2.5rem}.w-max{width:-webkit-max-content;width:-moz-max-content;width:max-content}.z-9000{z-index:9000}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.transform{--tw-rotate: 0;--tw-rotate-x: 0;--tw-rotate-y: 0;--tw-rotate-z: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-scale-z: 1;--tw-skew-x: 0;--tw-skew-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-translate-z: 0;-webkit-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));-ms-transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotateZ(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z));transform:rotate(var(--tw-rotate)) rotateX(var(--tw-rotate-x)) rotateY(var(--tw-rotate-y)) rotate(var(--tw-rotate-z)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) scaleZ(var(--tw-scale-z)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) translate(var(--tw-translate-x)) translateY(var(--tw-translate-y)) translateZ(var(--tw-translate-z))}.-translate-y-full{--tw-translate-y: -100%}.transition-transform{-webkit-transition-property:-webkit-transform;-o-transition-property:transform;transition-property:transform,-webkit-transform;-webkit-transition-timing-function:cubic-bezier(.4,0,.2,1);-o-transition-timing-function:cubic-bezier(.4,0,.2,1);transition-timing-function:cubic-bezier(.4,0,.2,1);-webkit-transition-duration:.15s;-o-transition-duration:.15s;transition-duration:.15s}.duration-200{-webkit-transition-duration:.2s;-o-transition-duration:.2s;transition-duration:.2s}.filter{--tw-blur: var(--tw-empty, );--tw-brightness: var(--tw-empty, );--tw-contrast: var(--tw-empty, );--tw-grayscale: var(--tw-empty, );--tw-hue-rotate: var(--tw-empty, );--tw-invert: var(--tw-empty, );--tw-saturate: var(--tw-empty, );--tw-sepia: var(--tw-empty, );--tw-drop-shadow: var(--tw-empty, );-webkit-filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.hover\:brightness-150:hover{--tw-brightness: brightness(1.5)}.active\:brightness-75:active{--tw-brightness: brightness(.75)}
`)
          styleEle.id = 'injected-styles'
          var __defProp = Object.defineProperty, __getOwnPropSymbols = Object.getOwnPropertySymbols, __hasOwnProp = Object.prototype.hasOwnProperty, __propIsEnum = Object.prototype.propertyIsEnumerable, __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: value
}) : obj[key] = value, __spreadValues = (a, b) => {
    for (var prop in b || (b = {})) __hasOwnProp.call(b, prop) && __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) __propIsEnum.call(b, prop) && __defNormalProp(a, prop, b[prop]);
    return a;
}, __require = "undefined" != typeof require ? require : x => {
    throw new Error('Dynamic require of "' + x + '" is not supported');
};

!function(vue, vueRouter) {
    "use strict";
    const _hoisted_1$a = {
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        width: "1.2em",
        height: "1.2em",
        preserveAspectRatio: "xMidYMid meet",
        viewBox: "0 0 24 24"
    }, _hoisted_3$6 = [ vue.createElementVNode("path", {
        d: "M21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19l7-7z",
        fill: "currentColor"
    }, null, -1) ];
    var __unplugin_components_0$2 = {
        name: "mdi-share",
        render: function(_ctx, _cache) {
            return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$a, _hoisted_3$6);
        }
    };
    const _hoisted_1$9 = {
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        width: "1.2em",
        height: "1.2em",
        preserveAspectRatio: "xMidYMid meet",
        viewBox: "0 0 24 24"
    }, _hoisted_3$5 = [ vue.createElementVNode("path", {
        d: "M9 22a1 1 0 0 1-1-1v-3H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6.1l-3.7 3.71c-.2.19-.45.29-.7.29H9M5 5v2h14V5H5m0 4v2h8V9H5m0 4v2h10v-2H5z",
        fill: "currentColor"
    }, null, -1) ];
    var __unplugin_components_1$2 = {
        name: "mdi-comment-text",
        render: function(_ctx, _cache) {
            return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$9, _hoisted_3$5);
        }
    };
    const _hoisted_1$8 = {
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        width: "1.2em",
        height: "1.2em",
        preserveAspectRatio: "xMidYMid meet",
        viewBox: "0 0 24 24"
    }, _hoisted_3$4 = [ vue.createElementVNode("path", {
        d: "M12.1 18.55l-.1.1l-.11-.1C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5c1.54 0 3.04 1 3.57 2.36h1.86C13.46 6 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5c0 2.89-3.14 5.74-7.9 10.05M16.5 3c-1.74 0-3.41.81-4.5 2.08C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.41 2 8.5c0 3.77 3.4 6.86 8.55 11.53L12 21.35l1.45-1.32C18.6 15.36 22 12.27 22 8.5C22 5.41 19.58 3 16.5 3z",
        fill: "currentColor"
    }, null, -1) ];
    var BlotterType, BlotterType2, __unplugin_components_2 = {
        name: "mdi-heart-outline",
        render: function(_ctx, _cache) {
            return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$8, _hoisted_3$4);
        }
    };
    (BlotterType2 = BlotterType || (BlotterType = {}))[BlotterType2.USER_STATUS = 0] = "USER_STATUS", 
    BlotterType2[BlotterType2.GAME_PURCHASE = 1] = "GAME_PURCHASE", BlotterType2[BlotterType2.RECOMMENDATION = 2] = "RECOMMENDATION", 
    BlotterType2[BlotterType2.GROUP_STATUS = 3] = "GROUP_STATUS", BlotterType2[BlotterType2.DAILY_ROLLUP = 4] = "DAILY_ROLLUP";
    var _export_sfc = (sfc, props) => {
        for (const [key, val] of props) sfc[key] = val;
        return sfc;
    };
    vue.pushScopeId("data-v-b5214c52");
    const _hoisted_1$7 = {
        class: "border border-blue-gray-500"
    }, _hoisted_2$7 = {
        key: 0,
        class: "relative"
    }, _hoisted_3$3 = {
        class: "absolute right-full rounded mr-4 w-10 h-10 bg-red-500"
    }, _hoisted_4 = [ "src" ], _hoisted_5 = {
        class: "header"
    }, _hoisted_6 = [ "href" ], _hoisted_7 = {
        key: 0
    }, _hoisted_8 = {
        key: 0,
        class: "content"
    }, _hoisted_9 = {
        key: 1,
        class: "relative"
    }, _hoisted_10$1 = {
        class: "absolute right-full rounded mr-4 w-10 h-10 bg-red-500"
    }, _hoisted_11 = [ "src" ], _hoisted_12 = {
        key: 0,
        class: "header"
    }, _hoisted_13 = [ "href" ], _hoisted_14 = {
        key: 1,
        class: "header"
    }, _hoisted_15 = {
        class: "content"
    }, _hoisted_16 = {
        key: 2,
        class: "relative"
    }, _hoisted_17 = {
        class: "absolute right-full rounded mr-4 w-max bg-red-500"
    }, _hoisted_18 = [ "href" ], _hoisted_19 = [ "src" ], _hoisted_20 = {
        class: "header"
    }, _hoisted_21 = [ "href" ], _hoisted_22 = {
        class: "text-sm"
    }, _hoisted_23 = vue.createTextVNode(" by "), _hoisted_24 = [ "href" ], _hoisted_25 = vue.createElementVNode("p", {
        class: "content"
    }, " Just click the link above. ", -1), _hoisted_26 = {
        key: 3
    }, _hoisted_27 = {
        class: "grid grid-cols-3"
    }, _hoisted_28 = {
        class: "border-t border-blue-gray-500 flex justify-center"
    }, _hoisted_29 = {
        class: "border border-b-0 border-blue-gray-500 flex justify-center"
    }, _hoisted_30 = {
        class: "border-t border-blue-gray-500 flex justify-center"
    };
    vue.popScopeId();
    var __unplugin_components_0$1 = _export_sfc(vue.defineComponent({
        props: {
            blotter: {
                type: null,
                required: !0
            }
        },
        setup(__props) {
            const props = __props;
            return (_ctx, _cache) => {
                const _component_i_mdi_share = __unplugin_components_0$2, _component_i_mdi_comment_text = __unplugin_components_1$2, _component_i_mdi_heart_outline = __unplugin_components_2;
                return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$7, [ __props.blotter.type === vue.unref(BlotterType).GAME_PURCHASE ? (vue.openBlock(), 
                vue.createElementBlock("div", _hoisted_2$7, [ vue.createElementVNode("div", _hoisted_3$3, [ vue.createElementVNode("img", {
                    src: __props.blotter.assets.avatarURL,
                    alt: ""
                }, null, 8, _hoisted_4) ]), vue.createElementVNode("header", _hoisted_5, [ vue.createTextVNode(vue.toDisplayString(__props.blotter.authorName) + " just bought ", 1), (vue.openBlock(!0), 
                vue.createElementBlock(vue.Fragment, null, vue.renderList(__props.blotter.games, ((game, i) => (vue.openBlock(), 
                vue.createElementBlock(vue.Fragment, {
                    key: i
                }, [ vue.createElementVNode("a", {
                    href: `https://store.steampowered.com/${game.type}/${game.id}/`
                }, vue.toDisplayString(game.title), 9, _hoisted_6), i !== __props.blotter.games.length - 1 ? (vue.openBlock(), 
                vue.createElementBlock("span", _hoisted_7, " | ")) : vue.createCommentVNode("", !0) ], 64)))), 128)) ]), __props.blotter.description ? (vue.openBlock(), 
                vue.createElementBlock("p", _hoisted_8, vue.toDisplayString(__props.blotter.description), 1)) : vue.createCommentVNode("", !0) ])) : __props.blotter.type === vue.unref(BlotterType).USER_STATUS ? (vue.openBlock(), 
                vue.createElementBlock("div", _hoisted_9, [ vue.createElementVNode("div", _hoisted_10$1, [ vue.createElementVNode("img", {
                    src: __props.blotter.assets.avatarURL,
                    alt: ""
                }, null, 8, _hoisted_11) ]), __props.blotter.game ? (vue.openBlock(), vue.createElementBlock("header", _hoisted_12, [ vue.createTextVNode(vue.toDisplayString(__props.blotter.authorName) + " posted a status about ", 1), vue.createElementVNode("a", {
                    href: `https://store.steampowered.com/${__props.blotter.game.type}/${__props.blotter.game.id}/`
                }, vue.toDisplayString(__props.blotter.game.title), 9, _hoisted_13) ])) : (vue.openBlock(), 
                vue.createElementBlock("header", _hoisted_14, vue.toDisplayString(__props.blotter.authorName) + " posted a status ", 1)), vue.createElementVNode("p", _hoisted_15, vue.toDisplayString(__props.blotter.content), 1) ])) : __props.blotter.type === vue.unref(BlotterType).GROUP_STATUS ? (vue.openBlock(), 
                vue.createElementBlock("div", _hoisted_16, [ vue.createElementVNode("div", _hoisted_17, [ vue.createElementVNode("a", {
                    href: __props.blotter.origin
                }, [ vue.createElementVNode("img", {
                    src: __props.blotter.assets.imageURL,
                    alt: ""
                }, null, 8, _hoisted_19) ], 8, _hoisted_18) ]), vue.createElementVNode("header", _hoisted_20, [ vue.createElementVNode("a", {
                    href: __props.blotter.link
                }, vue.toDisplayString(__props.blotter.title), 9, _hoisted_21), vue.createElementVNode("span", _hoisted_22, [ _hoisted_23, vue.createElementVNode("a", {
                    href: __props.blotter.origin
                }, vue.toDisplayString(__props.blotter.name), 9, _hoisted_24) ]) ]), _hoisted_25 ])) : (vue.openBlock(), 
                vue.createElementBlock("div", _hoisted_26, " Blotter is " + vue.toDisplayString(vue.unref(BlotterType)[props.blotter.type]), 1)), vue.createElementVNode("div", _hoisted_27, [ vue.createElementVNode("div", _hoisted_28, [ vue.createVNode(_component_i_mdi_share, {
                    class: "m-2"
                }) ]), vue.createElementVNode("div", _hoisted_29, [ vue.createVNode(_component_i_mdi_comment_text, {
                    class: "m-2"
                }) ]), vue.createElementVNode("div", _hoisted_30, [ vue.createVNode(_component_i_mdi_heart_outline, {
                    class: "m-2"
                }) ]) ]) ]);
            };
        }
    }), [ [ "__scopeId", "data-v-b5214c52" ] ]);
    const _hoisted_1$6 = vue.createElementVNode("span", {
        class: "flex-auto border-b border-current"
    }, null, -1), _hoisted_2$6 = vue.createElementVNode("span", {
        class: "flex-auto border-b border-current"
    }, null, -1), _sfc_main$4 = vue.defineComponent({
        props: {
            blotters: {
                type: Array,
                required: !0
            },
            date: {
                type: Number,
                required: !0
            }
        },
        setup(__props) {
            const props = __props, dateString = vue.computed((() => {
                const date = new Date(1e3 * props.date);
                return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
            }));
            return (_ctx, _cache) => {
                const _component_Blotter = __unplugin_components_0$1;
                return vue.openBlock(), vue.createElementBlock("div", null, [ _cache[0] || (vue.setBlockTracking(-1), 
                _cache[0] = vue.createElementVNode("div", {
                    class: "flex items-center"
                }, [ _hoisted_1$6, vue.createElementVNode("span", null, vue.toDisplayString(vue.unref(dateString)), 1), _hoisted_2$6 ]), 
                vue.setBlockTracking(1), _cache[0]), (vue.openBlock(!0), vue.createElementBlock(vue.Fragment, null, vue.renderList(props.blotters, ((blotter, i) => (vue.openBlock(), 
                vue.createBlock(_component_Blotter, {
                    key: i,
                    class: "m-4",
                    blotter: blotter
                }, null, 8, [ "blotter" ])))), 128)) ]);
            };
        }
    }), _hoisted_1$5 = {
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        width: "1.2em",
        height: "1.2em",
        preserveAspectRatio: "xMidYMid meet",
        viewBox: "0 0 24 24"
    }, _hoisted_10 = [ vue.createStaticVNode('<circle cx="12" cy="2" r="0" fill="currentColor"><animate attributeName="r" values="0;2;0;0" dur="1s" repeatCount="indefinite" begin="0" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline"></animate></circle><circle transform="rotate(45 12 12)" cx="12" cy="2" r="0" fill="currentColor"><animate attributeName="r" values="0;2;0;0" dur="1s" repeatCount="indefinite" begin="0.125s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline"></animate></circle><circle transform="rotate(90 12 12)" cx="12" cy="2" r="0" fill="currentColor"><animate attributeName="r" values="0;2;0;0" dur="1s" repeatCount="indefinite" begin="0.25s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline"></animate></circle><circle transform="rotate(135 12 12)" cx="12" cy="2" r="0" fill="currentColor"><animate attributeName="r" values="0;2;0;0" dur="1s" repeatCount="indefinite" begin="0.375s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline"></animate></circle><circle transform="rotate(180 12 12)" cx="12" cy="2" r="0" fill="currentColor"><animate attributeName="r" values="0;2;0;0" dur="1s" repeatCount="indefinite" begin="0.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline"></animate></circle><circle transform="rotate(225 12 12)" cx="12" cy="2" r="0" fill="currentColor"><animate attributeName="r" values="0;2;0;0" dur="1s" repeatCount="indefinite" begin="0.625s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline"></animate></circle><circle transform="rotate(270 12 12)" cx="12" cy="2" r="0" fill="currentColor"><animate attributeName="r" values="0;2;0;0" dur="1s" repeatCount="indefinite" begin="0.75s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline"></animate></circle><circle transform="rotate(315 12 12)" cx="12" cy="2" r="0" fill="currentColor"><animate attributeName="r" values="0;2;0;0" dur="1s" repeatCount="indefinite" begin="0.875s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline"></animate></circle>', 8) ];
    var __unplugin_components_1$1 = {
        name: "eos-icons-bubble-loading",
        render: function(_ctx, _cache) {
            return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$5, _hoisted_10);
        }
    };
    const STEAM_API_ENDPOINT_UserNews = "https://steamcommunity.com/my/ajaxgetusernews/";
    function parseHtml(blotter) {
        const list = (new DOMParser).parseFromString(blotter, "text/html").querySelectorAll(".blotter_day > .blotter_block");
        return Array.from(list).map((el => {
            if (el.querySelector(".blotter_daily_rollup")) return {
                type: BlotterType.DAILY_ROLLUP
            };
            if (el.querySelector(".blotter_gamepurchase")) return (el => {
                var _a;
                const result = {
                    type: BlotterType.GAME_PURCHASE
                }, author_block = el.querySelector(".blotter_author_block");
                el.querySelector(".blotter_gamepurchase_details") ? function() {
                    const games = [];
                    el.querySelectorAll(".blotter_gamepurchase_details a").forEach((node => {
                        const game = {};
                        game.title = node.textContent;
                        const match = node.href.match(/(sub|app)\/(\d+)/);
                        if (!match) throw new Error(`Not founding any games when parsing ${el} as game purchase`);
                        game.type = match[1], game.id = match[2], games.push(game);
                    })), result.games = games;
                }() : function() {
                    var _a2;
                    result.description = null == (_a2 = el.querySelector(".blotter_gamepurchase_text")) ? void 0 : _a2.textContent;
                    const game = {}, sublink = null == author_block ? void 0 : author_block.querySelector('a[href^="https://store.steampowered.com/sub/"]');
                    if (sublink) game.id = sublink.href.match(/sub\/(\d+)/)[1], game.type = "sub", result.games = [ __spreadValues({
                        title: sublink.textContent
                    }, game) ]; else {
                        const applink = null == author_block ? void 0 : author_block.querySelector('a[href^="https://store.steampowered.com/app/"]');
                        game.id = applink.href.match(/app\/(\d+)/)[1], game.type = "app", result.games = [ __spreadValues({
                            title: null == applink ? void 0 : applink.textContent
                        }, game) ];
                    }
                }();
                const avatar = el.querySelector(".blotter_author_block .playerAvatar > img");
                result.authorID = null == avatar ? void 0 : avatar.dataset.miniprofile, result.authorName = null == (_a = el.querySelector("div.blotter_author_block > div:nth-child(2)")) ? void 0 : _a.textContent, 
                result.assets = {
                    avatarURL: null == avatar ? void 0 : avatar.src
                };
                const commentLink = el.querySelector('.blotter_comment_thread a[href*="friendactivitydetail"]');
                return result.date = null == commentLink ? void 0 : commentLink.href.match(/friendactivitydetail\/\d\/(\d+)/)[1], 
                result;
            })(el);
            if (el.querySelector(".blotter_userstatus[id^=group]")) return (el => {
                var _a;
                const result = {
                    type: BlotterType.GROUP_STATUS
                }, author = el.querySelector(".blotter_group_announcement_header_text a");
                result.name = null == author ? void 0 : author.textContent, result.origin = null == author ? void 0 : author.href;
                const title = el.querySelector(".blotter_group_announcement_headline a");
                result.link = null == title ? void 0 : title.href, result.title = null == title ? void 0 : title.textContent;
                const imageURL = null == (_a = el.querySelector(".blotter_rollup_avatar img")) ? void 0 : _a.src;
                return result.assets = {
                    imageURL: imageURL
                }, result;
            })(el);
            if (el.querySelector(".blotter_recommendation")) return {
                type: BlotterType.RECOMMENDATION
            };
            if (el.querySelector(".blotter_userstatus[id^=userstatus]")) return (el => {
                var _a, _b, _c;
                const result = {
                    type: BlotterType.USER_STATUS
                }, avatar = el.querySelector(".blotter_author_block .playerAvatar > img");
                result.authorID = null == avatar ? void 0 : avatar.dataset.miniprofile, result.authorName = null == (_a = el.querySelector("div.blotter_author_block > div:nth-child(3)")) ? void 0 : _a.textContent, 
                result.assets = {
                    avatarURL: null == avatar ? void 0 : avatar.src
                };
                const appLink = el.querySelector("a.blotter_userstats_game");
                if (appLink) {
                    const game = {};
                    game.id = appLink.href.match(/app\/(\d+)/)[1];
                    const link = el.querySelector("div.blotter_author_block > div:nth-child(4) a");
                    game.title = null == link ? void 0 : link.textContent, game.type = "app", result.game = game, 
                    result.assets.capsuleURL = null == (_b = appLink.querySelector("img")) ? void 0 : _b.src;
                }
                result.content = null == (_c = el.querySelector(".blotter_userstatus_content")) ? void 0 : _c.textContent;
                const commentLink = el.querySelector('.blotter_comment_thread a[href*="status"]');
                return result.date = null == commentLink ? void 0 : commentLink.href.match(/status\/(\d+)/)[1], 
                result;
            })(el);
            throw new Error(`can not identify blotter type: ${el}`);
        }));
    }
    function daysEarlier(num) {
        return (new Date).setHours(0, 0, 0, 0) - 24 * num * 3600 * 1e3;
    }
    const _hoisted_1$4 = {
        class: "max-w-screen-sm h-full mx-auto"
    }, _hoisted_2$4 = {
        key: 1,
        class: "flex justify-center p-4"
    }, routes = [ {
        name: "index",
        path: "/",
        component: vue.defineComponent({
            setup(__props) {
                const unixtime = daysEarlier(0) / 1e3, blottersList = vue.shallowReactive([]), loading = vue.ref(!0);
                async function loadNewsSince(unixtime2) {
                    const blotters = vue.shallowReactive([]);
                    blottersList.push(blotters);
                    const json = await async function(unixtime) {
                        const res = await fetch(`${STEAM_API_ENDPOINT_UserNews}?start=${unixtime.toFixed(0)}`, {
                            method: "GET",
                            credentials: "include"
                        });
                        return await res.json();
                    }(unixtime2);
                    blotters.push(...parseHtml(json.blotter_html));
                }
                loadNewsSince(unixtime).then((() => {
                    loading.value = !1;
                }));
                const bottom = vue.ref(null);
                function loadMore() {
                    if (!loading.value) {
                        const checkline = bottom.value.getBoundingClientRect().top;
                        window.innerHeight > checkline && (loading.value = !0, loadNewsSince(daysEarlier(blottersList.length) / 1e3).then((() => {
                            loading.value = !1;
                        })));
                    }
                }
                return vue.onMounted((() => {
                    document.addEventListener("scroll", loadMore, !0);
                })), vue.onUnmounted((() => {
                    document.removeEventListener("scroll", loadMore, !0);
                })), (_ctx, _cache) => {
                    const _component_BlotterList = _sfc_main$4, _component_i_eos_icons_bubble_loading = __unplugin_components_1$1;
                    return vue.openBlock(), vue.createElementBlock("main", _hoisted_1$4, [ (vue.openBlock(!0), 
                    vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(blottersList), ((blotters, index) => (vue.openBlock(), 
                    vue.createElementBlock("section", {
                        key: index
                    }, [ blotters.length > 0 ? (vue.openBlock(), vue.createBlock(_component_BlotterList, {
                        key: 0,
                        blotters: blotters,
                        date: unixtime - 86400 * index
                    }, null, 8, [ "blotters", "date" ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$4, [ vue.createVNode(_component_i_eos_icons_bubble_loading) ])) ])))), 128)), vue.createElementVNode("div", {
                        ref: (_value, _refs) => {
                            _refs.bottom = _value, bottom.value = _value;
                        },
                        class: "flex justify-center"
                    }, " ⭐ ", 512) ]);
                };
            }
        }),
        props: !0
    }, {
        name: "hi-name",
        path: "/hi/:name",
        component: () => Promise.resolve().then((function() {
            return _name_;
        })),
        props: !0
    }, {
        name: "all",
        path: "/:all(.*)*",
        component: () => Promise.resolve().then((function() {
            return ____all_$1;
        })),
        props: !0
    } ], _hoisted_1$3 = {
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        width: "1.2em",
        height: "1.2em",
        preserveAspectRatio: "xMidYMid meet",
        viewBox: "0 0 24 24"
    }, _hoisted_3$2 = [ vue.createElementVNode("path", {
        d: "M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m0 16H5V5h14v14M17 8.4L13.4 12l3.6 3.6l-1.4 1.4l-3.6-3.6L8.4 17L7 15.6l3.6-3.6L7 8.4L8.4 7l3.6 3.6L15.6 7L17 8.4z",
        fill: "currentColor"
    }, null, -1) ];
    var __unplugin_components_0 = {
        name: "mdi-close-box-outline",
        render: function(_ctx, _cache) {
            return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$3, _hoisted_3$2);
        }
    };
    const _hoisted_1$2 = {
        xmlns: "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        width: "1.2em",
        height: "1.2em",
        preserveAspectRatio: "xMidYMid meet",
        viewBox: "0 0 24 24"
    }, _hoisted_3$1 = [ vue.createElementVNode("path", {
        d: "M20 4c1.11 0 2 .89 2 2v12c0 1.11-.89 2-2 2H4c-1.11 0-2-.89-2-2V6c0-1.11.89-2 2-2h16M8.5 15V9H7.25v3.5L4.75 9H3.5v6h1.25v-3.5L7.3 15h1.2m5-4.74V9h-4v6h4v-1.25H11v-1.11h2.5v-1.26H11v-1.12h2.5m7 3.74V9h-1.25v4.5h-1.12V10h-1.25v3.5h-1.13V9H14.5v5a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1z",
        fill: "currentColor"
    }, null, -1) ];
    var __unplugin_components_1 = {
        name: "mdi-new-box",
        render: function(_ctx, _cache) {
            return vue.openBlock(), vue.createElementBlock("svg", _hoisted_1$2, _hoisted_3$1);
        }
    };
    const _hoisted_1$1 = {
        class: "flex w-full"
    }, _hoisted_2$1 = {
        class: "min-h-0 text-blue-gray-700 dark:text-blue-gray-400"
    }, _hoisted_3 = vue.createElementVNode("span", {
        style: {
            flex: "auto"
        }
    }, " Change to Alt Feeds ", -1), _sfc_main$2 = vue.defineComponent({
        setup(__props) {
            const insertPos = vue.ref(document.body), [showFeeds, toggle] = function(initialValue = !1) {
                if (vue.isRef(initialValue)) return value => {
                    initialValue.value = "boolean" == typeof value ? value : !initialValue.value;
                };
                {
                    const boolean = vue.ref(initialValue), toggle = value => {
                        boolean.value = "boolean" == typeof value ? value : !boolean.value;
                    };
                    return [ boolean, toggle ];
                }
            }(!1);
            let handler;
            return vue.onMounted((() => {
                if (handler = vue.watch(showFeeds, ((newVal, oldVal) => {
                    document.body.style.overflow = newVal ? "hidden" : "auto";
                })), insertPos.value === document.body) {
                    const anchor = document.querySelector("#friendactivity_right_column > div > div:nth-child(1)");
                    insertPos.value = document.createElement("div"), anchor && anchor.insertAdjacentElement("afterend", insertPos.value);
                }
            })), vue.onUnmounted((() => {
                handler && (handler(), handler = null);
            })), (_ctx, _cache) => {
                const _component_i_mdi_close_box_outline = __unplugin_components_0, _component_router_view = vue.resolveComponent("router-view"), _component_i_mdi_new_box = __unplugin_components_1;
                return vue.openBlock(), vue.createElementBlock("div", {
                    class: vue.normalizeClass([ "fixed inset-0 flex-col overflow-y-auto bg-blue-gray-300 dark:bg-blue-gray-700 transition-transform transform z-9000 duration-200", {
                        "-translate-y-full": !vue.unref(showFeeds)
                    } ])
                }, [ vue.createElementVNode("div", _hoisted_1$1, [ vue.createElementVNode("button", {
                    class: "w-10 h-10 rounded flex ml-auto mt-1 mr-1 items-center filter focus:outline-none hover:brightness-150 active:brightness-75",
                    onClick: _cache[0] || (_cache[0] = $event => vue.unref(toggle)(!1))
                }, [ vue.createVNode(_component_i_mdi_close_box_outline, {
                    class: "flex-1 text-3xl"
                }) ]) ]), vue.createElementVNode("div", _hoisted_2$1, [ vue.createVNode(_component_router_view) ]), vue.withDirectives((vue.openBlock(), 
                vue.createBlock(vue.Teleport, {
                    to: insertPos.value
                }, [ vue.createElementVNode("button", {
                    class: "btn_grey_grey btn_small_thin ico_hover",
                    style: vue.normalizeStyle({
                        display: "flex",
                        width: "100%",
                        "align-items": "center",
                        padding: "0.5rem",
                        margin: "0.5rem auto",
                        "font-size": "1.875rem",
                        "line-height": "2.25rem"
                    }),
                    onClick: _cache[1] || (_cache[1] = $event => vue.unref(toggle)(!0))
                }, [ vue.createVNode(_component_i_mdi_new_box, {
                    style: {
                        flex: "none"
                    }
                }), _hoisted_3 ], 4) ], 8, [ "to" ])), [ [ vue.vShow, !1 ] ]) ], 2);
            };
        }
    });
    const app = vue.createApp(_sfc_main$2), router = vueRouter.createRouter({
        history: vueRouter.createWebHashHistory(),
        routes: routes
    });
    app.use(router);
    const appRoot = document.createElement("div");
    appRoot.dataset.desp = "root of userscript steam-activity-alt-userscript", document.body.appendChild(appRoot), 
    app.mount(appRoot);
    const _hoisted_1 = {
        class: "text-4xl"
    }, _hoisted_2 = vue.createElementVNode("p", {
        class: "text-sm opacity-50"
    }, [ vue.createElementVNode("em", null, "Dynamic route!") ], -1), _sfc_main$1 = vue.defineComponent({
        props: {
            name: {
                type: String,
                required: !0
            }
        },
        setup(__props) {
            const props = __props, router2 = vueRouter.useRouter();
            return (_ctx, _cache) => {
                const _component_carbon_pedestrian = vue.resolveComponent("carbon-pedestrian");
                return vue.openBlock(), vue.createElementBlock("div", null, [ vue.createElementVNode("p", _hoisted_1, [ vue.createVNode(_component_carbon_pedestrian, {
                    class: "inline-block"
                }) ]), vue.createElementVNode("p", null, " Hi, " + vue.toDisplayString(props.name), 1), _hoisted_2, vue.createElementVNode("div", null, [ vue.createElementVNode("button", {
                    class: "btn m-3 text-sm mt-8",
                    onClick: _cache[0] || (_cache[0] = $event => vue.unref(router2).back())
                }, " Back ") ]) ]);
            };
        }
    });
    var _name_ = Object.freeze({
        __proto__: null,
        [Symbol.toStringTag]: "Module",
        default: _sfc_main$1
    });
    var ____all_ = _export_sfc({}, [ [ "render", function(_ctx, _cache) {
        return vue.openBlock(), vue.createElementBlock("div", null, " Not Found ");
    } ] ]), ____all_$1 = Object.freeze({
        __proto__: null,
        [Symbol.toStringTag]: "Module",
        default: ____all_
    });
}(Vue, VueRouter);

// ==UserScript==
// @name         JSON Viewer
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @author       Feny
// @description  格式化显示 JSON 使数据看起来更加漂亮。支持 JSON 主题色切换。支持 JSON 脑图，清晰明了的查看 JSON 层级。支持通过 JSON Crack 查看 JSON。支持手动输入 JSON，HTTP 请求获取 JSON
// @license      GPL-3.0-only
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAeAB4AAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9wvjF8bLX4ZrHZx+XNqlwnmKjH5YUyRvb6kEAd8H058d1b47XV5Ir3eoN++bagaXYrN6KOBn2FfPPx5/aEutX8a+KNWhIubhruZLSNj8u1WMcIOP4QoXOOwNS/wDBM79lDTfjh8YNe+IXj63TxRdeHfKjsE1KMTxtdSbmMmxvlAiVV2IBsUybgAyKR9ZTy6lhsM69Xovm2+iPmKmOqYjEKjT6v5WXU9e8beKrjxZpp/s/xFrfhjWIwWs9X0q42z2kmPlZo2zDcxjqYZ0eNv7obDDf/YL/AG8L745eJNc+G3xCttP0n4qeEWZZ2sVZNP8AENsu0rd2ysS0ZKPG7RMSQsisCcukWd+3x4RtfhpqGk+JNPjS0g1mV7a8iT5UM4XesgHYsofdjglQepJPxwPE1x4V/au8LePtNkeK40ma0lmdDgyorvHMhPo9uxjP+y1bUcHRxmGbS1adn1TXT0/4fcipiqmExCi3pfVdGn19f+GLni/w7ceGf2wPFXga+Vo5rW/vDbI3WWI/v4HA/wBqBg3tk+lfWX7AXia1+F/iDV9B1CRbWHXjFLayyHannpuUxk+rqy4zxlMdWAPQft7fsL33x91nQfiD4DutP0r4oeDXVrT7cWWx1y3UsTZ3LKCyAh5FEigkLLIpHzBk5vwj4JuvE2kLJfeHdY8N6lGAl5pepwBZrOT+JRIuYp0ByBNCzxPg4bIICqYyljMKot62Sa6prr6P/gBDC1MLiHJLS90+jT6ev/Dnmn/BVP8Aaw0nxv4/8P8Aw18KXK69qmk3MlxqEdiRMwuivlpbrtPLopkMnZNy5IIYLyPwa/Z8vvEmv+HtHu4/Ovr+5iS6KDcqAtukwe6om7nuEJxX0XoH7PK/bJG0vRoY5rr/AFslvbLGZf8AfcAf+PGvafgv8CbX4byNqFyI5tWmXYCoytsh6qvqx7t+A4yWiWYUsLhlRpbr72318kVHA1MTiHVqbP7kl0P/2Q==
// @homepage     https://github.com/xFeny/UserScript/tree/main/monkey-jsonviewer
// @match        *://*/*
// @require      https://unpkg.com/jsmind@0.8.7/es6/jsmind.js
// @require      data:application/javascript,%3Bwindow.jsmind%3DjsMind%3B
// @require      https://unpkg.com/dom-to-image@2.6.0/src/dom-to-image.js
// @require      data:application/javascript,%3Bwindow.domtoimage%3Ddomtoimage%3B
// @require      https://unpkg.com/beautifier@0.1.7
// @require      data:application/javascript,%3Bwindow.beautifier%3Djs_beautify%3Bwindow.js_beautify%3Djs_beautify%3Bwindow.css_beautify%3Dcss_beautify%3B
// @require      https://unpkg.com/@highlightjs/cdn-assets@11.10.0/highlight.min.js
// @require      data:application/javascript,%3Bwindow.hljs%3Dhljs%3B
// @connect      *
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/508417/JSON%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/508417/JSON%20Viewer.meta.js
// ==/UserScript==

(o=>{window.addEventListener("message",r=>{const{data:t}=r;if(!t?.addStyle)return;if(typeof GM_addStyle=="function")return GM_addStyle(o);const e=document.createElement("style");e.textContent=o,document.head.append(e)})})(` @charset "UTF-8";body,iframe,ul{margin:0;padding:0}iframe{border:0}input:focus,select:focus,textarea:focus{outline:0}.jsonp{color:#657b83}#jsoncrackEmbed{border:0;width:100%;height:100%}.tippy-box[data-theme~=layer]{color:#fff;padding:5px;font-size:12px;line-height:20px;background-color:#2e59a7}.tippy-box[data-theme~=layer] .tippy-arrow{color:#2e59a7}.tippy-box[data-theme~=imagebox]{background-color:#d9d9d9}.tippy-box[data-theme~=imagebox] .tippy-arrow{color:#d9d9d9}@media screen and (max-width: 640px){.rightbox{right:0!important}.rightbox .tools{display:none!important}}@media screen and (max-width: 400px){.searchbox{display:none!important}}.json-viewer-layout{top:0;left:0;z-index:10;width:100vw;height:100vh;display:flex;position:fixed;flex-direction:column}.json-viewer-layout .panel{display:flex;line-height:28px;user-select:none;flex-direction:column;background-color:#ececec}.json-viewer-layout .tabs,.json-viewer-layout .toolbar{display:flex;border-bottom:1px solid #ccc}.json-viewer-layout .tabs>div,.json-viewer-layout .toolbar>div{cursor:pointer;padding:0 10px;font-size:12px;transition:background-color .2s ease}.json-viewer-layout .tabs>div:hover,.json-viewer-layout .toolbar>div:hover{background-color:#d4d4d4}.json-viewer-layout .tabs-item{border-top:3px solid #ececec}.json-viewer-layout .tabs-item:hover{border-top-color:#c3c3c6}.json-viewer-layout .tabs-item.active{color:#0060df;border-top-color:#0060df;background-color:#f1f1f1}.json-viewer-layout .toolbar{line-height:23px}.json-viewer-layout .toolbar .searchbox{padding:0;display:flex;flex-grow:1}.json-viewer-layout .toolbar .searchbox:hover{background-color:transparent}.json-viewer-layout .toolbar .searchbox input{flex-grow:1;border:none;outline:none;font-size:12px;padding-left:23px;border-left:1.5px solid #ccc;background-size:14px;background-repeat:no-repeat;background-position:7px center;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAipJREFUWEftljuIE1EUhv8zpJB0FqugItiIdmKnnQ+wjPhq3EILRYt1JTDnDvhgUJG55zY+ELO7hRZupYWCCIK6nXYiNoqlrIUKaxes5siFBGKYSSbJTnaLTDMwl/Ofj8Pc/z+ENX5ojftjfQFYay8AuEFEU2VMRlV/A7hujGm09f+bgIj8APCtjOYdmjuZeWsewCMAZwBcYub7qwkiIjMA7gF4zMxnMwHiOK5Wq9UXAA6r6kljzLPVgLDWniCipwDeNJvNWhzHzUwA/zFJku1BEHiIPUS0PwzDD6NAOOf2qep7AJ/SNK1FUfS9Uy/zFojIXgAeYhsRbQ7D8NcwEM65Tar6E8AygBozf+zWyb2GSZIcCYLgORH9DcNw45AAf1R1Q5qmR6Moep2l0dMHrLWniegJgK/MvHsQCBH5AmCXqk4bYxbzavsakYjMArgD4B0zHyoCISJvARwEcJmZ7/aq6Qvgi0XkJoCrqrpgjDnfS9BaO09E5wDcYuZr/YALAbQgHgLwTpnrER13vcHMF/s19+eFAVoQS/7NzAeyxJ1zS6qaez7wT9hdICITgMkEJhOYTMCq6jEimmXmV90+UboRtdzQ7wZ+aW1UKpUr9Xp9pQ0yFoCuXFhW1agdt2MD8BDOOb83zgPYAWAxCILbqvqg1CzIChMRmQPgI3qFiD773Z+ZTxVJwoHTME9URI4TUV1VtwCYYeaXYwUo2mzkOB6l0dA7YRlNOzX/ATTlNjBwsoHnAAAAAElFTkSuQmCC)}.json-viewer-layout .toolbar .searchbox .clear{flex:0 0 auto;align-self:center;margin:0 4px;padding:0;border:0;width:16px;height:16px;background-color:transparent;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAANZJREFUOE+t0zFKg0EQhuEndbpgIVZ26eIJFK1SeQcPYKuWmlJIb6lHkJRpFFKnE2zTpBAknaUgA/+Q5SfBwGaaZWfne3dmdraj0job9Ae4wwAn+MUcn3jCotS0Aad4RW9LYj+4xkuel4ArPO9Y0RlmEZuAY3ygi/cGct6Clf4V+vhOwCNuG0EEXuAB941v1OzfkOAxbhIwwWVxYwoCEhZrCQzfFMMELHHUSjkhCchsMuwLh3sDVJfwXxOj/ihpaxOrnzEaUzVI2dmqUU5I1Wfa8Susw/4A1fw8ES1B6icAAAAASUVORK5CYII=)}.json-viewer-layout .rightbox{right:200px;display:flex;font-size:12px;position:absolute}.json-viewer-layout .rightbox>div{padding:0 5px;margin-top:2px}.json-viewer-layout .rightbox>div span{cursor:pointer;display:inline;padding:5px 10px;border-radius:3px;transition:background-color .2s ease}.json-viewer-layout .rightbox>div span:hover{background-color:#ccc}.json-viewer-layout .rightbox>div span:after{content:"";width:0;height:0;right:-5px;position:relative;border-style:solid;display:inline-block;vertical-align:middle;border-width:7px 5px 0 5px;border-color:#999 transparent transparent transparent;transform:rotate(0);transition:transform .3s ease}.json-viewer-layout .rightbox>div span.active:after{transform:rotate(180deg)}.json-viewer-layout .rightbox>div ul{color:#333;cursor:pointer;text-align:center;border-radius:3px}.json-viewer-layout .rightbox>div ul li{font-size:12px;padding:5px 20px;list-style-type:none;background-color:#dfdfdf;transition:background-color .2s ease}.json-viewer-layout .rightbox>div ul li:hover{border-radius:3px;background-color:#ccc}.json-viewer-layout .rightbox>div ul li.active:before{left:15px;content:"\u221A";display:inline;position:absolute}.json-viewer-layout .rightbox>div .tippy-box{background-color:#dfdfdf!important}.json-viewer-layout .rightbox>div .tippy-box .tippy-content{padding:5px}.json-viewer-layout .rightbox>div .tippy-box .tippy-arrow{color:#dfdfdf!important}.json-viewer-layout .container{flex-grow:1;overflow:auto;line-height:1.4;font-size:13.5px;font-family:monospace}.json-viewer-layout .container>div{display:none}.json-viewer-layout .container>div.active{display:block}.json-viewer-layout .container #formatBox{padding:5px 0 8px 8px}.json-viewer-layout .container #rawTextBox{font-size:13px;padding:5px 8px}.json-viewer-layout .container #rawTextBox pre{margin:0;padding:0;white-space:pre-wrap;overflow-wrap:break-word}.json-viewer-layout #mindBox{width:100vw;height:calc(100vh - 57px)}.json-viewer-layout #mindBox jmnode{display:flex;align-items:center;padding:0 7px 0 22px;color:#475872!important;box-shadow:none!important;background-color:transparent!important}.json-viewer-layout #mindBox jmnode.root{padding:0;color:transparent!important}.json-viewer-layout #mindBox jmnode:before{content:"";margin-top:1px;position:absolute;border-radius:50%;top:50%!important;transform:translateY(-50%);background-color:#8149bf80}.json-viewer-layout #mindBox jmnode.root:before{left:50%;width:18px;height:18px;transform:translate(-18px,-50%)}.json-viewer-layout #mindBox jmnode:hover{text-shadow:0px 0px 1px currentColor}.json-viewer-layout #mindBox jmnode:not(.root):before{left:0;width:15px;height:15px}.json-viewer-layout #mindBox jmexpander{margin-top:1px;line-height:9px}.json-viewer-layout #mindBox .datatype{opacity:.6;font-size:12px;margin-top:2px;padding-left:5px}.httpRequest{padding:20px;width:700px}.httpRequest .requestbox{display:flex;height:35px}.httpRequest input,.httpRequest select{border-radius:0;padding-left:10px;border:1px solid #ccc}.httpRequest input{flex-grow:1}.httpRequest input[name=url],.httpRequest input:first-child,.httpRequest select{border-right:none}.httpRequest button{cursor:pointer;padding:0 15px;border:1px solid #ccc}.httpRequest button:active{background-color:#cfcfcf}.httpRequest .form-group{display:flex;margin-top:15px;flex-direction:column;gap:5px}.httpRequest label{font-weight:700;font-size:12px}.httpRequest textarea{min-height:100px;resize:vertical;padding:8px;border:1px solid #ccc;border-radius:4px;font-size:14px}.dark-theme .json-viewer-layout li,.dark-theme .json-viewer-layout pre,.dark-theme .json-viewer-layout td:first-child,.dark-plus-theme .json-viewer-layout li,.dark-plus-theme .json-viewer-layout pre,.dark-plus-theme .json-viewer-layout td:first-child{color:#ccc}.dark-theme .json-viewer-layout .panel,.dark-plus-theme .json-viewer-layout .panel{color:#c4c4c4;background-color:#333}.dark-theme .json-viewer-layout .panel>div,.dark-plus-theme .json-viewer-layout .panel>div{border-bottom-color:#464646}.dark-theme .json-viewer-layout .panel .tabs-item:hover,.dark-theme .json-viewer-layout .panel .toolbar-item:hover,.dark-plus-theme .json-viewer-layout .panel .tabs-item:hover,.dark-plus-theme .json-viewer-layout .panel .toolbar-item:hover{background-color:#464646}.dark-theme .json-viewer-layout .panel .tabs-item,.dark-plus-theme .json-viewer-layout .panel .tabs-item{border-top-color:#333}.dark-theme .json-viewer-layout .panel .tabs-item:hover,.dark-plus-theme .json-viewer-layout .panel .tabs-item:hover{border-top-color:#c3c3c6}.dark-theme .json-viewer-layout .panel .tabs-item.active,.dark-plus-theme .json-viewer-layout .panel .tabs-item.active{color:#c4c4c4;border-top-color:#64b7ff;background-color:#464646}.dark-theme .json-viewer-layout .searchbox input,.dark-plus-theme .json-viewer-layout .searchbox input{color:#ccc;background-color:#464646;border-left-color:#333}.dark-theme .json-viewer-layout .searchbox .clear,.dark-plus-theme .json-viewer-layout .searchbox .clear{filter:invert(.8)}.dark-theme .json-viewer-layout .rightbox>div span:hover,.dark-plus-theme .json-viewer-layout .rightbox>div span:hover{background-color:#464646}.dark-theme .json-viewer-layout .rightbox .tippy-box,.dark-plus-theme .json-viewer-layout .rightbox .tippy-box{background-color:#4e4e4e!important}.dark-theme .json-viewer-layout .rightbox .tippy-box .tippy-arrow,.dark-plus-theme .json-viewer-layout .rightbox .tippy-box .tippy-arrow{color:#4e4e4e!important}.dark-theme .json-viewer-layout .rightbox .tippy-box li,.dark-plus-theme .json-viewer-layout .rightbox .tippy-box li{background-color:#4e4e4e!important}.dark-theme .json-viewer-layout .rightbox .tippy-box li:hover,.dark-plus-theme .json-viewer-layout .rightbox .tippy-box li:hover{background-color:#464646!important}.dark-theme .json-viewer-layout jmnode,.dark-plus-theme .json-viewer-layout jmnode{filter:brightness(2)}.dark-theme .json-viewer-layout jmexpander,.dark-plus-theme .json-viewer-layout jmexpander{background-color:#dfdfdf}.js-mind-child-node{width:300px;height:300px;margin:10px;overflow-y:scroll;position:relative;padding:5px 20px;background-color:#f8f9fa}.js-mind-child-node div{color:#475872;line-height:25px}.js-mind-copy{top:5px;right:10px;width:20px;height:20px;cursor:pointer;position:absolute;background-size:20px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAYRJREFUWEftlzFOw0AQRefbF+EMVJFA1kzcUNGRW8ABkFBASBQgUZAiLSUiHb29W1DTQUFFzxFQvGglO8JW1uuElQIGl8545/n/0eQbtOELG+5PNYA8z28AHIaAMsZMhsPhke+sBYDW+mE+nz9FUaR9D3X5vSgKjuN4m5n32+oXAEopQ0QiIkEAlFJMREpEWm3uP0BD/ndjzAzArFLaq0Appdf2pnWVBdbWLw9vEdEYwJSZL+39VoA8z3cAPHq7Ez3HcTxKkuSlqnXNQJZlp1EU7YnIwAvQobGzxAXQvO+1YF2I/gBYz7qokKZprS6YAhsH6PL2y2qCKfC3AbTWB8aY+y4qABgx88y3iFbeA99dxc1/w5UBurz9/xD2Q4EqEzZX6rozYDfoskzYNoS7RHRORDbLhbhstjwRkVqecAI4fFREdBYqqNoevw7gCsAHMx+H8MSe4YxkDgsGAC6KorgD8BoAogql18w8qWVC1+GlZ+NAw/lWztRt1e9nfZwGkHjlIz4Bw1VmMCtaHCkAAAAASUVORK5CYII=)}.tippy-box[data-animation=fade][data-state=hidden]{opacity:0}[data-tippy-root]{max-width:calc(100vw - 10px)}.tippy-box{position:relative;background-color:#333;color:#fff;border-radius:4px;font-size:14px;line-height:1.4;white-space:normal;outline:0;transition-property:transform,visibility,opacity}.tippy-box[data-placement^=top]>.tippy-arrow{bottom:0}.tippy-box[data-placement^=top]>.tippy-arrow:before{bottom:-7px;left:0;border-width:8px 8px 0;border-top-color:initial;transform-origin:center top}.tippy-box[data-placement^=bottom]>.tippy-arrow{top:0}.tippy-box[data-placement^=bottom]>.tippy-arrow:before{top:-7px;left:0;border-width:0 8px 8px;border-bottom-color:initial;transform-origin:center bottom}.tippy-box[data-placement^=left]>.tippy-arrow{right:0}.tippy-box[data-placement^=left]>.tippy-arrow:before{border-width:8px 0 8px 8px;border-left-color:initial;right:-7px;transform-origin:center left}.tippy-box[data-placement^=right]>.tippy-arrow{left:0}.tippy-box[data-placement^=right]>.tippy-arrow:before{left:-7px;border-width:8px 8px 8px 0;border-right-color:initial;transform-origin:center right}.tippy-box[data-inertia][data-state=visible]{transition-timing-function:cubic-bezier(.54,1.5,.38,1.11)}.tippy-arrow{width:16px;height:16px;color:#333}.tippy-arrow:before{content:"";position:absolute;border-color:transparent;border-style:solid}.tippy-content{position:relative;padding:5px 9px;z-index:1}.monkey-js-css-beautify body{padding-top:20px;padding-left:5px}.monkey-js-css-beautify body .beautify_checkbox{top:0;left:0;z-index:999;width:100vw;display:flex;position:fixed;padding:5px 10px;user-select:none;align-items:center;background-color:#f3f3f3;border-bottom:1px solid #ccc}.monkey-js-css-beautify body .beautify_checkbox label{font-size:13px}.monkey-js-css-beautify body .beautify_checkbox input[type=checkbox]{top:1.5px;width:14px;height:14px;margin-right:5px;position:relative}pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{background:#fff;color:#000}.xml .hljs-meta{color:silver}.hljs-comment,.hljs-quote{color:#007400}.hljs-attribute,.hljs-keyword,.hljs-literal,.hljs-name,.hljs-selector-tag,.hljs-tag{color:#aa0d91}.hljs-template-variable,.hljs-variable{color:#3f6e74}.hljs-code,.hljs-meta .hljs-string,.hljs-string{color:#c41a16}.hljs-link,.hljs-regexp{color:#0e0eff}.hljs-bullet,.hljs-number,.hljs-symbol,.hljs-title{color:#1c00cf}.hljs-meta,.hljs-section{color:#643820}.hljs-built_in,.hljs-class .hljs-title,.hljs-params,.hljs-title.class_,.hljs-type{color:#5c2699}.hljs-attr{color:#836c28}.hljs-subst{color:#000}.hljs-formula{background-color:#eee;font-style:italic}.hljs-addition{background-color:#baeeba}.hljs-deletion{background-color:#ffc8bd}.hljs-selector-class,.hljs-selector-id{color:#9b703f}.hljs-doctag,.hljs-strong{font-weight:700}.hljs-emphasis{font-style:italic}ul,li{list-style-type:none}wrapper{display:contents}.hidden{display:none!important}.json-viewer ul{border-left:.5px dotted #ccc}.json-viewer ul li{padding-left:20px}.json-bracket{font-weight:700}.json-copy{width:13px;height:13px;cursor:pointer;margin-left:.15em;display:inline-block;background-size:13px;vertical-align:text-bottom;background-repeat:no-repeat;transition:background-image ease .3s;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAYRJREFUWEftlzFOw0AQRefbF+EMVJFA1kzcUNGRW8ABkFBASBQgUZAiLSUiHb29W1DTQUFFzxFQvGglO8JW1uuElQIGl8545/n/0eQbtOELG+5PNYA8z28AHIaAMsZMhsPhke+sBYDW+mE+nz9FUaR9D3X5vSgKjuN4m5n32+oXAEopQ0QiIkEAlFJMREpEWm3uP0BD/ndjzAzArFLaq0Appdf2pnWVBdbWLw9vEdEYwJSZL+39VoA8z3cAPHq7Ez3HcTxKkuSlqnXNQJZlp1EU7YnIwAvQobGzxAXQvO+1YF2I/gBYz7qokKZprS6YAhsH6PL2y2qCKfC3AbTWB8aY+y4qABgx88y3iFbeA99dxc1/w5UBurz9/xD2Q4EqEzZX6rozYDfoskzYNoS7RHRORDbLhbhstjwRkVqecAI4fFREdBYqqNoevw7gCsAHMx+H8MSe4YxkDgsGAC6KorgD8BoAogql18w8qWVC1+GlZ+NAw/lWztRt1e9nfZwGkHjlIz4Bw1VmMCtaHCkAAAAASUVORK5CYII=)}.json-copy.success{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAhZJREFUWEftlU1IFGEYx//Pu2R0kLrYwUMg7M5EHjwklNUOLoInxYMg7W6HTkEIgkLMLF6CsllDokN4Vfy4SnSqk+7sRghBFBT7IWKHQATFSxCLM09sabjjO/thLnuZ9zjPx//3/t9n3pfQ5EVN1ocP4DvgO9AwB/RMsJNYjAF4wEwz01rukeyXbwjAZEbttpmXAKhHokQ8bN4prLghzhwgkVHCzLQE8JUyMeblpFa411AAIxXshxCLAC6fFOKbZriw3jAA3VKHiLgk3uoS+UWMqKnlX9c8AwkreA0i0GM7vFu0i2svI1v7ld4M3VLuEmEBwLnjeQTsMyiaDOfeetVLZ8BIhz4CdP2w6CuxM2JqG99kTYz3oftwaE4S23Zsij3vza1Wgj8BYKSDvYBwF0khdEt9SMSzEoHvJETUvJ39UO219XBA2QHQ5iougzAsZRyEFxKBHAJONHlr41M18VLc6wgmAXoqafAHgoUYAuOZJP6Z2Il5HVfNQ1hK1NPKKAGvZBAAOiXf1wGOJcOFzVp2/u+CqpRsZNQ4/t5oVRalAkWOT/Xlf1TLrPseSKRDAw7TIhEuyS3kd2gJxM0b2d16xT1nwN1IT4U0IWiegY6yGPObg4sXYjNdX36eRrxmgMOZ6CLQE4AHGdgTjOXzdvvE48jawWnF6wI4EkmsKlfNSD77P6LHa8/8NawXzAfwHfAdaLoDvwHyYK0h/tY7mwAAAABJRU5ErkJggg==)}.json-arrow{width:0;opacity:.2;display:inline-block}.json-arrow:hover{opacity:.35}.json-arrow:before{width:0;height:0;left:-13px;content:"";cursor:pointer;position:relative;border-style:solid;display:inline-block;vertical-align:middle;transform:rotate(90deg);border-width:5px 0 5px 8px;transition:transform .3s ease;border-color:transparent transparent transparent currentColor}.collapsed .json-arrow:before{transform:rotate(0)}.json-desc{display:none;cursor:pointer;font-size:12px;font-weight:700;color:#9aa160;user-select:none;margin-left:.3em}.json-desc span{margin:0 .5em;font-weight:400}.json-desc span:hover{text-decoration:underline}.json-color{width:.7em;height:.7em;margin-right:.3em;display:inline-block;vertical-align:middle;border:1px solid #ccc}.json-comma{margin-left:.15em;font-family:Courier New,monospace}.json-colon{margin:0 .3em 0 .15em}.default-theme{background-color:#fefefe}.default-theme .json-bracket[type=object]{color:#6d9331}.default-theme .json-bracket[type=array]{color:#8e9331}.default-theme .json-key{color:#910f93;cursor:pointer}.default-theme .json-string,.default-theme .json-string a{color:#2e7c16}.default-theme .json-bigint,.default-theme .json-number{color:#164ff1}.default-theme .json-boolean{color:#c41a16}.default-theme .json-null{color:#228fec}.light-theme{background-color:#fefefe}.light-theme .json-bracket[type=object]{color:#6d9331}.light-theme .json-bracket[type=array]{color:#8e9331}.light-theme .json-key{color:#0040cf;cursor:pointer}.light-theme .json-string,.light-theme .json-string a{color:#a31515}.light-theme .json-bigint,.light-theme .json-number{color:#0b7500}.light-theme .json-boolean{color:#00f}.light-theme .json-null{color:#05f}.dark-theme{background-color:#252526}.dark-theme .json-bracket[type=object]{color:#9bba43}.dark-theme .json-bracket[type=array]{color:#c4af00}.dark-theme .json-key{color:#9cdcfe;cursor:pointer}.dark-theme .json-string,.dark-theme .json-string a{color:#ce9178}.dark-theme .json-bigint,.dark-theme .json-number{color:#b5cea8}.dark-theme .json-boolean{color:#358cd6}.dark-theme .json-null{color:#569cd6}.dark-plus-theme{background-color:#1e1f22}.dark-plus-theme .json-bracket[type=object]{color:#bb9667}.dark-plus-theme .json-bracket[type=array]{color:#a1a84e}.dark-plus-theme .json-key{color:#c77dbb;cursor:pointer}.dark-plus-theme .json-string,.dark-plus-theme .json-string a{color:#6aab73}.dark-plus-theme .json-bigint,.dark-plus-theme .json-number{color:#28aab4}.dark-plus-theme .json-boolean{color:#ce8951}.dark-plus-theme .json-null{color:#c78d61}.dark-theme .json-viewer ul,.dark-plus-theme .json-viewer ul{border-left:.5px dotted #5e5e5e}.dark-theme .json-colon,.dark-theme .json-comma,.dark-plus-theme .json-colon,.dark-plus-theme .json-comma{color:#ccc}.dark-theme .json-arrow,.dark-plus-theme .json-arrow{color:#fff;opacity:.35}.dark-theme .json-arrow:hover,.dark-plus-theme .json-arrow:hover{opacity:.5}.json-tree-table{border-collapse:collapse;width:-webkit-fill-available}.json-tree-table tr.selected *{color:#fff!important;background-color:#3875d7}.json-tree-table tr:hover{background-color:#f0f9fe}.json-tree-table tr td:first-child{width:120px}.dark-theme .json-tree-table tr:hover,.dark-plus-theme .json-tree-table tr:hover{background-color:#353b48}.scroll-top{right:15px;width:45px;height:45px;z-index:999;bottom:30px;display:none;font-size:12px;cursor:pointer;position:fixed;border-radius:50%;background-size:30px;background-color:#fff;background-position:center;background-repeat:no-repeat;box-shadow:0 0 5px #3eaf7c4d;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHN0eWxlPSJmaWxsOiMzZWFmN2MiIGNsYXNzPSJpY29uIGJhY2stdG8tdG9wLWljb24iIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiIGZpbGw9ImN1cnJlbnRDb2xvciIgYXJpYS1sYWJlbD0iYmFjay10by10b3AgaWNvbiI+PHBhdGggZD0iTTUxMiA4NDMuMmMtMzYuMiAwLTY2LjQtMTMuNi04NS44LTIxLjgtMTAuOC00LjYtMjIuNiAzLjYtMjEuOCAxNS4ybDcgMTAyYy40IDYuMiA3LjYgOS40IDEyLjYgNS42bDI5LTIyYzMuNi0yLjggOS0xLjggMTEuNCAybDQxIDY0LjJjMyA0LjggMTAuMiA0LjggMTMuMiAwbDQxLTY0LjJjMi40LTMuOCA3LjgtNC44IDExLjQtMmwyOSAyMmM1IDMuOCAxMi4yLjYgMTIuNi01LjZsNy0xMDJjLjgtMTEuNi0xMS0yMC0yMS44LTE1LjItMTkuNiA4LjItNDkuNiAyMS44LTg1LjggMjEuOHoiPjwvcGF0aD48cGF0aCBkPSJtNzk1LjQgNTg2LjItOTYtOTguMkM2OTkuNCAxNzIgNTEzIDMyIDUxMyAzMlMzMjQuOCAxNzIgMzI0LjggNDg4bC05NiA5OC4yYy0zLjYgMy42LTUuMiA5LTQuNCAxNC4yTDI2MS4yIDgyNGMxLjggMTEuNCAxNC4yIDE3IDIzLjYgMTAuOEw0MTkgNzQ0czQxLjQgNDAgOTQuMiA0MGM1Mi44IDAgOTIuMi00MCA5Mi4yLTQwbDEzNC4yIDkwLjhjOS4yIDYuMiAyMS42LjYgMjMuNi0xMC44bDM3LTIyMy44Yy40LTUuMi0xLjItMTAuNC00LjgtMTR6TTUxMyAzODRjLTM0IDAtNjEuNC0yOC42LTYxLjQtNjRzMjcuNi02NCA2MS40LTY0YzM0IDAgNjEuNCAyOC42IDYxLjQgNjRTNTQ3IDM4NCA1MTMgMzg0eiI+PC9wYXRoPjwvc3ZnPg==)}.scroll-top:hover{background-color:#f9f9f9}.dark-theme .scroll-top,.dark-plus-theme .scroll-top{background-color:#464646;box-shadow:0 0 5px #505050}.tippy-box[data-theme~=scroll]{font-size:12px}/**
* @license BSD
* @copyright 2014-2025 hizzgdev@163.com
* 
* Project Home:
*   https://github.com/hizzgdev/jsmind/
*/.jsmind-inner{position:relative;overflow:auto;width:100%;height:100%;outline:none}.jsmind-inner{moz-user-select:-moz-none;-moz-user-select:none;-o-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}.jsmind-inner canvas{position:absolute}svg.jsmind{position:absolute;z-index:1}canvas.jsmind{position:absolute;z-index:1}jmnodes{position:absolute;z-index:2;background-color:#0000}jmnode{position:absolute;cursor:default;max-width:400px}jmexpander{position:absolute;width:11px;height:11px;display:block;overflow:hidden;line-height:12px;font-size:10px;text-align:center;border-radius:6px;border-width:1px;border-style:solid;cursor:pointer}.jmnode-overflow-wrap jmnodes{min-width:420px}.jmnode-overflow-hidden jmnode{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}jmnode{padding:10px;background-color:#fff;color:#333;border-radius:5px;box-shadow:1px 1px 1px #666;font:16px/1.125 Verdana,Arial,Helvetica,sans-serif}jmnode:hover{box-shadow:2px 2px 8px #000;background-color:#ebebeb;color:#333}jmnode.selected{background-color:#11f;color:#fff;box-shadow:2px 2px 8px #000}jmnode.root{font-size:24px}jmexpander{border-color:gray}jmexpander:hover{border-color:#000}@media screen and (max-device-width: 1024px){jmnode{padding:5px;border-radius:3px;font-size:14px}jmnode.root{font-size:21px}}jmnodes.theme-primary jmnode{background-color:#428bca;color:#fff;border-color:#357ebd}jmnodes.theme-primary jmnode:hover{background-color:#3276b1;border-color:#285e8e}jmnodes.theme-primary jmnode.selected{background-color:#f1c40f;color:#fff}jmnodes.theme-warning jmnode{background-color:#f0ad4e;border-color:#eea236;color:#fff}jmnodes.theme-warning jmnode:hover{background-color:#ed9c28;border-color:#d58512}jmnodes.theme-warning jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-danger jmnode{background-color:#d9534f;border-color:#d43f3a;color:#fff}jmnodes.theme-danger jmnode:hover{background-color:#d2322d;border-color:#ac2925}jmnodes.theme-danger jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-success jmnode{background-color:#5cb85c;border-color:#4cae4c;color:#fff}jmnodes.theme-success jmnode:hover{background-color:#47a447;border-color:#398439}jmnodes.theme-success jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-info jmnode{background-color:#5dc0de;border-color:#46b8da;color:#fff}jmnodes.theme-info jmnode:hover{background-color:#39b3d7;border-color:#269abc}jmnodes.theme-info jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-greensea jmnode{background-color:#1abc9c;color:#fff}jmnodes.theme-greensea jmnode:hover{background-color:#16a085}jmnodes.theme-greensea jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-nephrite jmnode{background-color:#2ecc71;color:#fff}jmnodes.theme-nephrite jmnode:hover{background-color:#27ae60}jmnodes.theme-nephrite jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-belizehole jmnode{background-color:#3498db;color:#fff}jmnodes.theme-belizehole jmnode:hover{background-color:#2980b9}jmnodes.theme-belizehole jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-wisteria jmnode{background-color:#9b59b6;color:#fff}jmnodes.theme-wisteria jmnode:hover{background-color:#8e44ad}jmnodes.theme-wisteria jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-asphalt jmnode{background-color:#34495e;color:#fff}jmnodes.theme-asphalt jmnode:hover{background-color:#2c3e50}jmnodes.theme-asphalt jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-orange jmnode{background-color:#f1c40f;color:#fff}jmnodes.theme-orange jmnode:hover{background-color:#f39c12}jmnodes.theme-orange jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-pumpkin jmnode{background-color:#e67e22;color:#fff}jmnodes.theme-pumpkin jmnode:hover{background-color:#d35400}jmnodes.theme-pumpkin jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-pomegranate jmnode{background-color:#e74c3c;color:#fff}jmnodes.theme-pomegranate jmnode:hover{background-color:#c0392b}jmnodes.theme-pomegranate jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-clouds jmnode{background-color:#ecf0f1;color:#333}jmnodes.theme-clouds jmnode:hover{background-color:#bdc3c7}jmnodes.theme-clouds jmnode.selected{background-color:#11f;color:#fff}jmnodes.theme-asbestos jmnode{background-color:#95a5a6;color:#fff}jmnodes.theme-asbestos jmnode:hover{background-color:#7f8c8d}jmnodes.theme-asbestos jmnode.selected{background-color:#11f;color:#fff} `);

!function(){function e(e,t){return(t||"")+" (SystemJS Error#"+e+" https://github.com/systemjs/systemjs/blob/main/docs/errors.md#"+e+")"}function t(e,t){if(-1!==e.indexOf("\\")&&(e=e.replace(j,"/")),"/"===e[0]&&"/"===e[1])return t.slice(0,t.indexOf(":")+1)+e;if("."===e[0]&&("/"===e[1]||"."===e[1]&&("/"===e[2]||2===e.length&&(e+="/"))||1===e.length&&(e+="/"))||"/"===e[0]){var n,r=t.slice(0,t.indexOf(":")+1);if(n="/"===t[r.length+1]?"file:"!==r?(n=t.slice(r.length+2)).slice(n.indexOf("/")+1):t.slice(8):t.slice(r.length+("/"===t[r.length])),"/"===e[0])return t.slice(0,t.length-n.length-1)+e;for(var i=n.slice(0,n.lastIndexOf("/")+1)+e,o=[],s=-1,u=0;u<i.length;u++)-1!==s?"/"===i[u]&&(o.push(i.slice(s,u+1)),s=-1):"."===i[u]?"."!==i[u+1]||"/"!==i[u+2]&&u+2!==i.length?"/"===i[u+1]||u+1===i.length?u+=1:s=u:(o.pop(),u+=2):s=u;return-1!==s&&o.push(i.slice(s)),t.slice(0,t.length-n.length)+o.join("")}}function n(e,n){return t(e,n)||(-1!==e.indexOf(":")?e:t("./"+e,n))}function r(e,n,r,i,o){for(var s in e){var a=t(s,r)||s,f=e[s];if("string"==typeof f){var l=c(i,t(f,r)||f,o);l?n[a]=l:u("W1",s,f,"bare specifier did not resolve")}}}function i(e,t,i){var o;for(o in e.imports&&r(e.imports,i.imports,t,i,null),e.scopes||{}){var s=n(o,t);r(e.scopes[o],i.scopes[s]||(i.scopes[s]={}),t,i,s)}for(o in e.depcache||{})i.depcache[n(o,t)]=e.depcache[o];for(o in e.integrity||{})i.integrity[n(o,t)]=e.integrity[o]}function o(e,t){if(t[e])return e;var n=e.length;do{var r=e.slice(0,n+1);if(r in t)return r}while(-1!==(n=e.lastIndexOf("/",n-1)))}function s(e,t){var n=o(e,t);if(n){var r=t[n];if(null===r)return;if(!(e.length>n.length&&"/"!==r[r.length-1]))return r+e.slice(n.length);u("W2",n,r,"should have a trailing '/'")}}function u(t,n,r,i){console.warn(e(t,"Package target "+i+", resolving target '"+r+"' for "+n))}function c(e,t,n){for(var r=e.scopes,i=n&&o(n,r);i;){var u=s(t,r[i]);if(u)return u;i=o(i.slice(0,i.lastIndexOf("/")),r)}return s(t,e.imports)||-1!==t.indexOf(":")&&t}function a(){this[M]={}}function f(e){return e.id}function l(e,t,n,r){if(e.onload(n,t.id,t.d&&t.d.map(f),!!r),n)throw n}function d(t,n,r,i){var o=t[M][n];if(o)return o;var s=[],u=Object.create(null);P&&Object.defineProperty(u,P,{value:"Module"});var c=Promise.resolve().then((function(){return t.instantiate(n,r,i)})).then((function(r){if(!r)throw Error(e(2,"Module "+n+" did not instantiate"));var i=r[1]((function(e,t){o.h=!0;var n=!1;if("string"==typeof e)e in u&&u[e]===t||(u[e]=t,n=!0);else{for(var r in e)t=e[r],r in u&&u[r]===t||(u[r]=t,n=!0);e&&e.__esModule&&(u.__esModule=e.__esModule)}if(n)for(var i=0;i<s.length;i++){var c=s[i];c&&c(u)}return t}),2===r[1].length?{import:function(e,r){return t.import(e,n,r)},meta:t.createContext(n)}:void 0);return o.e=i.execute||function(){},[r[0],i.setters||[],r[2]||[]]}),(function(e){throw o.e=null,o.er=e,l(t,o,e,!0),e})),a=c.then((function(e){return Promise.all(e[0].map((function(r,i){var o=e[1][i],s=e[2][i];return Promise.resolve(t.resolve(r,n)).then((function(e){var r=d(t,e,n,s);return Promise.resolve(r.I).then((function(){return o&&(r.i.push(o),!r.h&&r.I||o(r.n)),r}))}))}))).then((function(e){o.d=e}))}));return o=t[M][n]={id:n,i:s,n:u,m:i,I:c,L:a,h:!1,d:void 0,e:void 0,er:void 0,E:void 0,C:void 0,p:void 0}}function h(e,t,n,r){if(!r[t.id])return r[t.id]=!0,Promise.resolve(t.L).then((function(){return t.p&&null!==t.p.e||(t.p=n),Promise.all(t.d.map((function(t){return h(e,t,n,r)})))})).catch((function(n){if(t.er)throw n;throw t.e=null,l(e,t,n,!1),n}))}function p(e,t){return t.C=h(e,t,t,{}).then((function(){return v(e,t,{})})).then((function(){return t.n}))}function v(e,t,n){function r(){try{var n=o.call(L);if(n)return n=n.then((function(){t.C=t.n,t.E=null,l(e,t,null,!0)}),(function(n){throw t.er=n,t.E=null,l(e,t,n,!0),n})),t.E=n;t.C=t.n,t.L=t.I=void 0}catch(r){throw t.er=r,r}finally{l(e,t,t.er,!0)}}if(!n[t.id]){if(n[t.id]=!0,!t.e){if(t.er)throw t.er;return t.E?t.E:void 0}var i,o=t.e;return t.e=null,t.d.forEach((function(r){try{var o=v(e,r,n);o&&(i=i||[]).push(o)}catch(s){throw t.er=s,l(e,t,s,!1),s}})),i?Promise.all(i).then(r):r()}}function m(){[].forEach.call(document.querySelectorAll("script"),(function(t){if(!t.sp)if("systemjs-module"===t.type){if(t.sp=!0,!t.src)return;System.import("import:"===t.src.slice(0,7)?t.src.slice(7):n(t.src,g)).catch((function(e){if(e.message.indexOf("https://github.com/systemjs/systemjs/blob/main/docs/errors.md#3")>-1){var n=document.createEvent("Event");n.initEvent("error",!1,!1),t.dispatchEvent(n)}return Promise.reject(e)}))}else if("systemjs-importmap"===t.type){t.sp=!0;var r=t.src?(System.fetch||fetch)(t.src,{integrity:t.integrity,priority:t.fetchPriority,passThrough:!0}).then((function(e){if(!e.ok)throw Error("Invalid status code: "+e.status);return e.text()})).catch((function(n){return n.message=e("W4","Error fetching systemjs-import map "+t.src)+"\n"+n.message,console.warn(n),"function"==typeof t.onerror&&t.onerror(),"{}"})):t.innerHTML;W=W.then((function(){return r})).then((function(n){!function(t,n,r){var o={};try{o=JSON.parse(n)}catch(s){console.warn(Error(e("W5","systemjs-importmap contains invalid JSON")+"\n\n"+n+"\n"))}i(o,r,t)}(N,n,t.src||g)}))}}))}var g,y="undefined"!=typeof Symbol,b="undefined"!=typeof self,S="undefined"!=typeof document,w=b?self:global;if(S){var O=document.querySelector("base[href]");O&&(g=O.href)}if(!g&&"undefined"!=typeof location){var E=(g=location.href.split("#")[0].split("?")[0]).lastIndexOf("/");-1!==E&&(g=g.slice(0,E+1))}var x,j=/\\/g,P=y&&Symbol.toStringTag,M=y?Symbol():"@",I=a.prototype;I.import=function(e,t,n){var r=this;return t&&"object"==typeof t&&(n=t,t=void 0),Promise.resolve(r.prepareImport()).then((function(){return r.resolve(e,t,n)})).then((function(e){var t=d(r,e,void 0,n);return t.C||p(r,t)}))},I.createContext=function(e){var t=this;return{url:e,resolve:function(n,r){return Promise.resolve(t.resolve(n,r||e))}}},I.onload=function(){},I.register=function(e,t,n){x=[e,t,n]},I.getRegister=function(){var e=x;return x=void 0,e};var L=Object.freeze(Object.create(null));w.System=new a;var C,R,W=Promise.resolve(),N={imports:{},scopes:{},depcache:{},integrity:{}},T=S;if(I.prepareImport=function(e){return(T||e)&&(m(),T=!1),W},I.getImportMap=function(){return JSON.parse(JSON.stringify(N))},S&&(m(),window.addEventListener("DOMContentLoaded",m)),I.addImportMap=function(e,t){i(e,t||g,N)},S){window.addEventListener("error",(function(e){J=e.filename,_=e.error}));var A=location.origin}I.createScript=function(e){var t=document.createElement("script");t.async=!0,e.indexOf(A+"/")&&(t.crossOrigin="anonymous");var n=N.integrity[e];return n&&(t.integrity=n),t.src=e,t};var J,_,k={},U=I.register;I.register=function(e,t){if(S&&"loading"===document.readyState&&"string"!=typeof e){var n=document.querySelectorAll("script[src]"),r=n[n.length-1];if(r){C=e;var i=this;R=setTimeout((function(){k[r.src]=[e,t],i.import(r.src)}))}}else C=void 0;return U.call(this,e,t)},I.instantiate=function(t,n){var r=k[t];if(r)return delete k[t],r;var i=this;return Promise.resolve(I.createScript(t)).then((function(r){return new Promise((function(o,s){r.addEventListener("error",(function(){s(Error(e(3,"Error loading "+t+(n?" from "+n:""))))})),r.addEventListener("load",(function(){if(document.head.removeChild(r),J===t)s(_);else{var e=i.getRegister(t);e&&e[0]===C&&clearTimeout(R),o(e)}})),document.head.appendChild(r)}))}))},I.shouldFetch=function(){return!1},"undefined"!=typeof fetch&&(I.fetch=fetch);var $=I.instantiate,B=/^(text|application)\/(x-)?javascript(;|$)/;I.instantiate=function(t,n,r){var i=this;return this.shouldFetch(t,n,r)?this.fetch(t,{credentials:"same-origin",integrity:N.integrity[t],meta:r}).then((function(r){if(!r.ok)throw Error(e(7,r.status+" "+r.statusText+", loading "+t+(n?" from "+n:"")));var o=r.headers.get("content-type");if(!o||!B.test(o))throw Error(e(4,'Unknown Content-Type "'+o+'", loading '+t+(n?" from "+n:"")));return r.text().then((function(e){return e.indexOf("//# sourceURL=")<0&&(e+="\n//# sourceURL="+t),(0,eval)(e),i.getRegister(t)}))})):$.apply(this,arguments)},I.resolve=function(n,r){return c(N,t(n,r=r||g)||n,r)||function(t,n){throw Error(e(8,"Unable to resolve bare specifier '"+t+(n?"' from "+n:"'")))}(n,r)};var F=I.instantiate;I.instantiate=function(e,t,n){var r=N.depcache[e];if(r)for(var i=0;i<r.length;i++)d(this,this.resolve(r[i],e),e);return F.call(this,e,t,n)},b&&"function"==typeof importScripts&&(I.instantiate=function(e){var t=this;return Promise.resolve().then((function(){return importScripts(e),t.getRegister(e)}))}),function(e){function t(t){return!e.hasOwnProperty(t)||!isNaN(t)&&t<e.length||a&&e[t]&&"undefined"!=typeof window&&e[t].parent===window}var n,r,i,o=e.System.constructor.prototype,s=o.import;o.import=function(o,u,c){return function(){for(var o in n=r=void 0,e)t(o)||(n?r||(r=o):n=o,i=o)}(),s.call(this,o,u,c)};var u=[[],function(){return{}}],c=o.getRegister;o.getRegister=function(){var o=c.call(this);if(o)return o;var s,a=function(o){var s,u,c=0;for(var a in e)if(!t(a)){if(0===c&&a!==n||1===c&&a!==r)return a;s?(i=a,u=o&&u||a):s=a===i,c++}return u}(this.firstGlobalProp);if(!a)return u;try{s=e[a]}catch(f){return u}return[[],function(e){return{execute:function(){e(s),e({default:s,__useDefault:!0})}}}]};var a="undefined"!=typeof navigator&&-1!==navigator.userAgent.indexOf("Trident")}("undefined"!=typeof self?self:global),function(e){var t=e.System.constructor.prototype,r=/^[^#?]+\.(css|html|json|wasm)([?#].*)?$/,i=t.shouldFetch.bind(t);t.shouldFetch=function(e){return i(e)||r.test(e)};var o=/^application\/json(;|$)/,s=/^text\/css(;|$)/,u=/^application\/wasm(;|$)/,c=t.fetch;t.fetch=function(t,r){return c(t,r).then((function(i){if(r.passThrough)return i;if(!i.ok)return i;var c=i.headers.get("content-type");return o.test(c)?i.json().then((function(e){return new Response(new Blob(['System.register([],function(e){return{execute:function(){e("default",'+JSON.stringify(e)+")}}})"],{type:"application/javascript"}))})):s.test(c)?i.text().then((function(e){return e=e.replace(/url\(\s*(?:(["'])((?:\\.|[^\n\\"'])+)\1|((?:\\.|[^\s,"'()\\])+))\s*\)/g,(function(e,r,i,o){return["url(",r,n(i||o,t),r,")"].join("")})),new Response(new Blob(["System.register([],function(e){return{execute:function(){var s=new CSSStyleSheet();s.replaceSync("+JSON.stringify(e)+');e("default",s)}}})'],{type:"application/javascript"}))})):u.test(c)?(WebAssembly.compileStreaming?WebAssembly.compileStreaming(i):i.arrayBuffer().then(WebAssembly.compile)).then((function(n){e.System.wasmModules||(e.System.wasmModules=Object.create(null)),e.System.wasmModules[t]=n;var r=[],i=[];return WebAssembly.Module.imports&&WebAssembly.Module.imports(n).forEach((function(e){var t=JSON.stringify(e.module);-1===r.indexOf(t)&&(r.push(t),i.push("function(m){i["+t+"]=m}"))})),new Response(new Blob(["System.register(["+r.join(",")+"],function(e){var i={};return{setters:["+i.join(",")+"],execute:function(){return WebAssembly.instantiate(System.wasmModules["+JSON.stringify(t)+"],i).then(function(m){e(m.exports)})}}})"],{type:"application/javascript"}))})):i}))}}("undefined"!=typeof self?self:global);var q="undefined"!=typeof Symbol&&Symbol.toStringTag;I.get=function(e){var t=this[M][e];if(t&&null===t.e&&!t.E)return t.er?null:t.n},I.set=function(t,n){try{new URL(t)}catch(s){console.warn(Error(e("W3",'"'+t+'" is not a valid URL to set in the module registry')))}var r;q&&"Module"===n[q]?r=n:(r=Object.assign(Object.create(null),n),q&&Object.defineProperty(r,q,{value:"Module"}));var i=Promise.resolve(r),o=this[M][t]||(this[M][t]={id:t,i:[],h:!1,d:[],e:null,er:void 0,E:void 0});return!o.e&&!o.E&&(Object.assign(o,{n:r,I:void 0,L:void 0,C:i}),r)},I.has=function(e){return!!this[M][e]},I.delete=function(e){var t=this[M],n=t[e];if(!n||n.p&&null!==n.p.e||n.E)return!1;var r=n.i;return n.d&&n.d.forEach((function(e){var t=e.i.indexOf(n);-1!==t&&e.i.splice(t,1)})),delete t[e],function(){var n=t[e];if(!n||!r||null!==n.e||n.E)return!1;r.forEach((function(e){n.i.push(e),e(n.n)})),r=null}};var D="undefined"!=typeof Symbol&&Symbol.iterator;I.entries=function(){var e,t,n=this,r=Object.keys(n[M]),i=0,o={next:function(){for(;void 0!==(t=r[i++])&&void 0===(e=n.get(t)););return{done:void 0===t,value:void 0!==t&&[t,e]}}};return o[D]=function(){return this},o}}();
!function(t){function e(t){t.registerRegistry=Object.create(null),t.namedRegisterAliases=Object.create(null)}var r=t.System;e(r);var i,s,n=r.constructor.prototype,l=r.constructor,a=function(){l.call(this),e(this)};a.prototype=n,r.constructor=a;var o=n.register;n.register=function(t,e,r,n){if("string"!=typeof t)return o.apply(this,arguments);var l=[e,r,n];return this.registerRegistry[t]=l,i||(i=l,s=t),Promise.resolve().then((function(){i=null,s=null})),o.apply(this,[e,r,n])};var u=n.resolve;n.resolve=function(t,e){try{return u.call(this,t,e)}catch(r){if(t in this.registerRegistry)return this.namedRegisterAliases[t]||t;throw r}};var c=n.instantiate;n.instantiate=function(t,e,r){var i=this.registerRegistry[t];return i?(this.registerRegistry[t]=null,i):c.call(this,t,e,r)};var g=n.getRegister;n.getRegister=function(t){var e=g.call(this,t);s&&t&&(this.namedRegisterAliases[s]=t);var r=i||e;return i=null,s=null,r}}("undefined"!=typeof self?self:global);
;(typeof System!='undefined')&&(System=new System.constructor());
System.addImportMap({ imports: {"highlight.js":"user:highlight.js","beautifier":"user:beautifier","jsmind":"user:jsmind","dom-to-image":"user:dom-to-image"} });
System.set("user:highlight.js", (()=>{const _=hljs;('default' in _)||(_.default=_);return _})());
System.set("user:beautifier", (()=>{const _=beautifier;('default' in _)||(_.default=_);return _})());
System.set("user:jsmind", (()=>{const _=jsmind;('default' in _)||(_.default=_);return _})());
System.set("user:dom-to-image", (()=>{const _=domtoimage;('default' in _)||(_.default=_);return _})());

System.register("./__entry.js", ['./__monkey.entry-CYSHb-BY.js'], (function (exports, module) {
	'use strict';
	return {
		setters: [null],
		execute: (function () {



		})
	};
}));

System.register("./__monkey.entry-CYSHb-BY.js", [], (function (exports, module) {
  'use strict';
  return {
    execute: (function () {

      const scriptRel = function detectScriptRel() {
        const relList = typeof document !== "undefined" && document.createElement("link").relList;
        return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
      }();
      const assetsURL = function(dep) {
        return "/" + dep;
      };
      const seen = {};
      const __vitePreload = function preload(baseModule, deps, importerUrl) {
        let promise = Promise.resolve();
        if (deps && deps.length > 0) {
          document.getElementsByTagName("link");
          const cspNonceMeta = document.querySelector(
            "meta[property=csp-nonce]"
          );
          const cspNonce = cspNonceMeta?.nonce || cspNonceMeta?.getAttribute("nonce");
          promise = Promise.allSettled(
            deps.map((dep) => {
              dep = assetsURL(dep);
              if (dep in seen) return;
              seen[dep] = true;
              const isCss = dep.endsWith(".css");
              const cssSelector = isCss ? '[rel="stylesheet"]' : "";
              if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
                return;
              }
              const link = document.createElement("link");
              link.rel = isCss ? "stylesheet" : scriptRel;
              if (!isCss) {
                link.as = "script";
              }
              link.crossOrigin = "";
              link.href = dep;
              if (cspNonce) {
                link.setAttribute("nonce", cspNonce);
              }
              document.head.appendChild(link);
              if (isCss) {
                return new Promise((res, rej) => {
                  link.addEventListener("load", res);
                  link.addEventListener(
                    "error",
                    () => rej(new Error(`Unable to preload CSS for ${dep}`))
                  );
                });
              }
            })
          );
        }
        function handlePreloadError(err) {
          const e = new Event("vite:preloadError", {
            cancelable: true
          });
          e.payload = err;
          window.dispatchEvent(e);
          if (!e.defaultPrevented) {
            throw err;
          }
        }
        return promise.then((res) => {
          for (const item of res || []) {
            if (item.status !== "rejected") continue;
            handlePreloadError(item.reason);
          }
          return baseModule().catch(handlePreloadError);
        });
      };
      var jsonBigintNative = {};
      var stringify = { exports: {} };
      (function(module) {
        var JSON = module.exports;
        (function() {
          var escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
            // table of character substitutions
            "\b": "\\b",
            "	": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\"
          }, rep;
          function quote(string) {
            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
              var c = meta[a];
              return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
          }
          function str(key, holder) {
            var i, k, v, length, mind = gap, partial, value = holder[key];
            if (value && typeof value === "object" && typeof value.toJSON === "function") {
              value = value.toJSON(key);
            }
            if (typeof rep === "function") {
              value = rep.call(holder, key, value);
            }
            switch (typeof value) {
              case "string":
                return quote(value);
              case "number":
                return isFinite(value) ? String(value) : "null";
              case "boolean":
              case "null":
              case "bigint":
                return String(value);
              case "object":
                if (!value) {
                  return "null";
                }
                gap += indent;
                partial = [];
                if (Object.prototype.toString.apply(value) === "[object Array]") {
                  length = value.length;
                  for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || "null";
                  }
                  v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
                  gap = mind;
                  return v;
                }
                if (rep && typeof rep === "object") {
                  length = rep.length;
                  for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === "string") {
                      k = rep[i];
                      v = str(k, value);
                      if (v) {
                        partial.push(quote(k) + (gap ? ": " : ":") + v);
                      }
                    }
                  }
                } else {
                  Object.keys(value).forEach(function(k2) {
                    var v2 = str(k2, value);
                    if (v2) {
                      partial.push(quote(k2) + (gap ? ": " : ":") + v2);
                    }
                  });
                }
                v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
                gap = mind;
                return v;
            }
          }
          if (typeof JSON.stringify !== "function") {
            JSON.stringify = function(value, replacer, space) {
              var i;
              gap = "";
              indent = "";
              if (typeof space === "number") {
                for (i = 0; i < space; i += 1) {
                  indent += " ";
                }
              } else if (typeof space === "string") {
                indent = space;
              }
              rep = replacer;
              if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
                throw new Error("JSON.stringify");
              }
              return str("", { "": value });
            };
          }
        })();
      })(stringify);
      var stringifyExports = stringify.exports;
      var json_parse$1 = function(options) {
        var _options;
        var at, ch, escapee = {
          '"': '"',
          "\\": "\\",
          "/": "/",
          b: "\b",
          f: "\f",
          n: "\n",
          r: "\r",
          t: "	"
        }, text, error = function(m) {
          throw {
            name: "SyntaxError",
            message: m,
            at,
            text
          };
        }, next = function(c) {
          if (c && c !== ch) {
            error("Expected '" + c + "' instead of '" + ch + "'");
          }
          ch = text.charAt(at);
          at += 1;
          return ch;
        }, number = function() {
          var number2, string2 = "";
          if (ch === "-") {
            string2 = "-";
            next("-");
          }
          while (ch >= "0" && ch <= "9") {
            string2 += ch;
            next();
          }
          if (ch === ".") {
            string2 += ".";
            while (next() && ch >= "0" && ch <= "9") {
              string2 += ch;
            }
          }
          if (ch === "e" || ch === "E") {
            string2 += ch;
            next();
            if (ch === "-" || ch === "+") {
              string2 += ch;
              next();
            }
            while (ch >= "0" && ch <= "9") {
              string2 += ch;
              next();
            }
          }
          number2 = +string2;
          if (!isFinite(number2)) {
            error("Bad number");
          } else {
            if (string2.length > 15 && string2.indexOf(".") === -1) {
              try {
                return BigInt(string2);
              } catch (e) {
                switch (_options.fallbackTo) {
                  case "number":
                    return number2;
                  case "string":
                    return string2;
                  default:
                    throw e;
                }
              }
            } else {
              return number2;
            }
          }
        }, string = function() {
          var hex, i, string2 = "", uffff;
          if (ch === '"') {
            var startAt = at;
            while (next()) {
              if (ch === '"') {
                if (at - 1 > startAt) string2 += text.substring(startAt, at - 1);
                next();
                return string2;
              }
              if (ch === "\\") {
                if (at - 1 > startAt) string2 += text.substring(startAt, at - 1);
                next();
                if (ch === "u") {
                  uffff = 0;
                  for (i = 0; i < 4; i += 1) {
                    hex = parseInt(next(), 16);
                    if (!isFinite(hex)) {
                      break;
                    }
                    uffff = uffff * 16 + hex;
                  }
                  string2 += String.fromCharCode(uffff);
                } else if (typeof escapee[ch] === "string") {
                  string2 += escapee[ch];
                } else {
                  break;
                }
                startAt = at;
              }
            }
          }
          error("Bad string");
        }, white = function() {
          while (ch && ch <= " ") {
            next();
          }
        }, word = function() {
          switch (ch) {
            case "t":
              next("t");
              next("r");
              next("u");
              next("e");
              return true;
            case "f":
              next("f");
              next("a");
              next("l");
              next("s");
              next("e");
              return false;
            case "n":
              next("n");
              next("u");
              next("l");
              next("l");
              return null;
          }
          error("Unexpected '" + ch + "'");
        }, value, array = function() {
          var array2 = [];
          if (ch === "[") {
            next("[");
            white();
            if (ch === "]") {
              next("]");
              return array2;
            }
            while (ch) {
              array2.push(value());
              white();
              if (ch === "]") {
                next("]");
                return array2;
              }
              next(",");
              white();
            }
          }
          error("Bad array");
        }, object = function() {
          var key, object2 = {};
          if (ch === "{") {
            next("{");
            white();
            if (ch === "}") {
              next("}");
              return object2;
            }
            while (ch) {
              key = string();
              white();
              next(":");
              if (_options.strict === true && Object.hasOwnProperty.call(object2, key)) {
                error('Duplicate key "' + key + '"');
              }
              Object.defineProperty(object2, key, {
                value: value(),
                writable: true,
                enumerable: true,
                configurable: true
              });
              white();
              if (ch === "}") {
                next("}");
                return object2;
              }
              next(",");
              white();
            }
          }
          error("Bad object");
        };
        value = function() {
          white();
          switch (ch) {
            case "{":
              return object();
            case "[":
              return array();
            case '"':
              return string();
            case "-":
              return number();
            default:
              return ch >= "0" && ch <= "9" ? number() : word();
          }
        };
        return function(source, reviver, options2) {
          _options = {
            strict: false,
            // not being strict means do not generate syntax errors for "duplicate key"
            fallbackTo: "number"
            // toggles whether the values should be stored as BigInt (default) or a string
          };
          if (options2 !== void 0 && options2 !== null) {
            if (options2.strict === true) {
              _options.strict = true;
            }
            if (typeof options2.fallbackTo !== "undefined") {
              if (options2.fallbackTo === "number" || options2.fallbackTo === "string" || options2.fallbackTo === "error") {
                _options.fallbackTo = options2.fallbackTo;
              } else {
                throw new Error(
                  'Incorrect value for fallbackTo option, must be "number", "string", "error" or undefined but passed ' + options2.fallbackTo
                );
              }
            }
          }
          var result;
          text = source + "";
          at = 0;
          ch = " ";
          result = value();
          white();
          if (ch) {
            error("Syntax error");
          }
          return typeof reviver === "function" ? function walk(holder, key) {
            var v, value2 = holder[key];
            if (value2 && typeof value2 === "object") {
              Object.keys(value2).forEach(function(k) {
                v = walk(value2, k);
                if (v !== void 0) {
                  value2[k] = v;
                } else {
                  delete value2[k];
                }
              });
            }
            return reviver.call(holder, key, value2);
          }({ "": result }, "") : result;
        };
      };
      var parse = json_parse$1();
      var json_stringify = stringifyExports.stringify;
      var json_parse = parse;
      jsonBigintNative.parse = json_parse;
      jsonBigintNative.stringify = json_stringify;
      var _GM = exports("e", /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)());
      var _GM_getValue = exports("a", /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)());
      var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
      var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
      var _GM_setClipboard = exports("c", /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)());
      var _GM_setValue = exports("b", /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)());
      var _unsafeWindow = exports("_", /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)());
      NodeList.prototype.filter = Array.prototype.filter;
      NodeList.prototype.some = Array.prototype.some;
      NodeList.prototype.map = Array.prototype.map;
      function getDefaultDisplay(ele) {
        let display = ele.defaultDisplay;
        const doc = ele.ownerDocument;
        if (display) return display;
        const temp = doc.body.appendChild(doc.createElement(ele.nodeName));
        display = getComputedStyle(temp).display;
        temp.parentNode.removeChild(temp);
        if (display === "none") display = "block";
        ele.defaultDisplay = display;
        return display;
      }
      function getMaxKeysAndDepthObject(list) {
        function getObjectDepth(obj) {
          if (typeof obj !== "object" || obj === null) return 0;
          let maxDepth2 = 0;
          for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              const depth = getObjectDepth(obj[key]);
              maxDepth2 = Math.max(maxDepth2, depth);
            }
          }
          return maxDepth2 + 1;
        }
        function countKeys(obj) {
          if (typeof obj !== "object" || obj === null) return 0;
          let keyCount = Object.keys(obj).length;
          for (let key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
              keyCount += countKeys(obj[key]);
            }
          }
          return keyCount;
        }
        let maxKeys = 0;
        let maxDepth = 0;
        let result = null;
        for (let item of list) {
          const keys = countKeys(item);
          const depth = getObjectDepth(item);
          if (keys > maxKeys || keys === maxKeys && depth > maxDepth) {
            maxKeys = keys;
            maxDepth = depth;
            result = item;
          }
        }
        return result;
      }
      const Utils = exports("U", {
        getMaxKeysAndDepthObject,
        isImg(str) {
          const regexp = /(ico|bmp|gif|jpg|jpeg|png|svg|webp|ICO|BMP|GIF|JPG|JPEG|PNG|WEBP|SVG)([\w#!:.?+=&%@!\-\/])?/i;
          return regexp.test(str);
        },
        isJSON(str) {
          try {
            jsonBigintNative.parse(str);
            return true;
          } catch (e) {
            return false;
          }
        },
        parse(text, reviver) {
          return jsonBigintNative.parse(text, reviver);
        },
        stringify(value, replacer, space) {
          return jsonBigintNative.stringify(value, replacer, space);
        },
        isObject(o) {
          return Object.is(typeof o, "object");
        },
        getType(o) {
          return this.getPropType(o).toLowerCase();
        },
        getPropType(o) {
          return Object.prototype.toString.call(o).match(/\s(.+)]/)[1];
        },
        random(len = 10) {
          let array = new Uint8Array(len);
          window.crypto.getRandomValues(array);
          const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
          const count = characters.length;
          let randomStr = "";
          for (let i = 0; i < len; i++) {
            randomStr += characters[array[i] % count];
          }
          return randomStr;
        },
        downloadText(content, filename) {
          const blob = new Blob([content], { type: "application/json;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          this.createElement("a", { href: url, download: filename }).click();
          URL.revokeObjectURL(url);
        },
        matchJsonp(rawText) {
          const tokens = rawText.match(/^([^\s(]*)\s*\(([\s\S]*)\)\s*;?$/);
          if (tokens && tokens[1] && tokens[2]) {
            return { rawText: tokens[2], jsonpFun: tokens[1] };
          }
          return { rawText, jsonpFun: null };
        },
        debounce(fn, delay = 300) {
          let timer;
          return function() {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, arguments), delay);
          };
        },
        setClipboard(text) {
          if (_GM_setClipboard) {
            _GM_setClipboard(text);
          } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
          } else {
            console.error("复制内容失败");
          }
        },
        addEvent(eventType, selector, callback) {
          const types = eventType.split(" ");
          types.forEach((type) => {
            function handler(event) {
              let target = event.target;
              if (!target.matches) return;
              while (!target.matches(selector)) {
                target = target.parentNode;
                if (!target || !target.matches) return;
              }
              Object.defineProperty(event, "currentTarget", {
                configurable: true,
                get() {
                  return target;
                }
              });
              const returnValue = callback.call(target, event);
              if (returnValue === false) {
                event.preventDefault();
                event.stopPropagation();
              }
              event.stopImmediatePropagation();
            }
            document.addEventListener(type, handler, true);
          });
        },
        isVisible(ele) {
          return !!(ele.offsetWidth || ele.offsetHeight || ele.getClientRects().length);
        },
        createElement(name, attrs, text) {
          const element = document.createElement(name);
          if (text) element.textContent = text;
          if (attrs) this.attr(element, attrs);
          return element;
        },
        attr(ele, attrs, value) {
          if (!ele) return;
          if (typeof attrs === "object") {
            for (const name in attrs) ele.setAttribute(name, attrs[name]);
            return;
          }
          if (value === void 0) return ele.getAttribute(attrs);
          if (value === false || value === null) return ele.removeAttribute(attrs);
          ele.setAttribute(attrs, value);
        },
        query(selector, context) {
          const ctx = context || document;
          if (selector instanceof HTMLElement) return selector;
          return ctx.querySelector(selector);
        },
        queryAll(selector, context) {
          const ctx = context || document;
          if (selector instanceof HTMLElement) return new NodeList(selector);
          if (selector instanceof NodeList) return selector;
          return ctx.querySelectorAll(selector);
        },
        closest(element, selector) {
          while (element) {
            if (element.matches(selector)) return element;
            element = element.parentElement;
          }
          return null;
        },
        addClass(ele, className) {
          if (!ele) return;
          if (ele instanceof HTMLElement) return ele.classList.add(className);
          if (ele instanceof NodeList || ele instanceof Array) {
            ele.forEach((el) => this.addClass(el, className));
          }
        },
        removeClass(ele, className) {
          if (!ele) return;
          if (ele instanceof HTMLElement) {
            const classList = ele.classList;
            if (className === void 0) {
              while (classList.length > 0) {
                classList.remove(classList.item(0));
              }
              return;
            }
            return classList.remove(className);
          }
          if (ele instanceof NodeList || ele instanceof Array) {
            ele.forEach((el) => this.removeClass(el, className));
          }
        },
        toggleClass(ele, className) {
          if (!ele) return;
          this.hasClass(ele, className) ? this.removeClass(ele, className) : this.addClass(ele, className);
        },
        hasClass(ele, className) {
          if (!ele) return false;
          if (ele instanceof HTMLElement) return ele.classList.contains(className);
          if (ele instanceof NodeList) {
            return ele.some((el) => this.hasClass(el, className));
          }
        },
        show(ele) {
          if (!ele) return;
          const style = ele.style;
          const display = getComputedStyle(ele).display;
          if (style.display === "none") style.display = "";
          if (style.display === "" && display === "none") {
            style.display = getDefaultDisplay(ele);
          }
        },
        hide(ele) {
          if (ele.defaultDisplay === void 0) {
            const computedDisplay = getComputedStyle(ele).display;
            if (!Object.is(computedDisplay, "none")) {
              ele.defaultDisplay = computedDisplay;
            }
          }
          ele.style.display = "none";
        }
      });
      const URL$1 = exports("d", {
        EXAMPLE_JSON: "https://pastebin.com/raw/c6kXS9Vf",
        JSON_CRACK_WIDGET: "https://jsoncrack.feny.ink/widget",
        LAYUI_JS: "https://unpkg.com/layui@2.7.6/dist/layui.js"
      });
      const layout = `
<template data-for="viewFormater">
  <div class="toolbar-item btn" id="saveJson">保存</div>
  <div class="toolbar-item btn" id="copyJson">复制</div>
  <div class="toolbar-item btn" id="sorted">排序</div>
  <div class="toolbar-item btn" id="collapseAll">全部折叠</div>
  <div class="toolbar-item btn" id="expandAll">全部展开</div>
  <div class="searchbox">
    <input class="filter" type="text" placeholder="JSON 过滤" />
    <button class="clear" hidden></button>
  </div>
</template>
<template data-for="viewMind">
  <div class="toolbar-item btn" id="saveJson">保存</div>
  <div class="toolbar-item btn" id="collapseAll">全部折叠</div>
  <div class="toolbar-item btn" id="expandAll">全部展开</div>
  <div class="toolbar-item btn" id="jsoncrack">JSON Crack</div>
</template>
<template data-for="viewRawText">
  <div class="toolbar-item btn" id="saveJson">保存</div>
  <div class="toolbar-item btn" id="copyJson">复制</div>
  <div class="toolbar-item btn" id="beautify">美化输出</div>
</template>
<div class="json-viewer-layout">
  <div class="panel">
    <div class="tabs">
      <div class="tabs-item btn active" id="viewFormater">JSON 格式化</div>
      <div class="tabs-item btn" id="viewMind">JSON 脑图</div>
      <div class="tabs-item btn" id="viewRawText">原始数据</div>
    </div>
    <div class="toolbar"></div>
    <div class="rightbox">
      <div class="style">
        <span>风格</span>
        <template data-type="style">
          <ul>
            <li data-type="style" data-value="default">默认</li>
            <li data-type="style" data-value="table">表格</li>
          </ul>
        </template>
      </div>
      <div class="theme">
        <span>主题</span>
        <template data-type="theme">
          <ul>
            <li data-type="theme" data-value="default">默认</li>
            <li data-type="theme" data-value="light">浅色</li>
            <li data-type="theme" data-value="dark">暗黑</li>
            <li data-type="theme" data-value="dark-plus">暗黑+</li>
          </ul>
        </template>
      </div>
      <div class="tools">
        <span>工具</span>
        <template data-type="tools">
          <ul>
            <li data-type="tools" data-value="inputJson">JSON 输入</li>
            <li data-type="tools" data-value="fetchJson">HTTP 请求</li>
          </ul>
        </template>
      </div>
    </div>
  </div>
  <div class="container">
    <div class="active" data-for="viewFormater" id="formatBox"></div>
    <div data-for="viewMind" id="mindBox"></div>
    <div data-for="viewRawText" id="rawTextBox">
      <pre></pre>
    </div>
  </div>
</div>
`;
      const { EXAMPLE_JSON, LAYUI_JS } = URL$1;
      (function() {
        const openInTab = () => _GM_openInTab(EXAMPLE_JSON);
        _GM_registerMenuCommand("JSON示例 ( Alt + J )", openInTab);
        window.addEventListener("keydown", ({ code, altKey }) => altKey && code === "KeyJ" && openInTab());
        const innerText = document.body.innerText;
        const { rawText, jsonpFun } = Utils.matchJsonp(innerText);
        if (!Utils.isJSON(rawText)) return __vitePreload(() => module.import('./index-D_4ZLSio-BtOCbpRm.js'), void 0 );
        _unsafeWindow.RAW_TEXT = rawText;
        _unsafeWindow.GLOBAL_JSONP_FUN = jsonpFun;
        _unsafeWindow.GLOBAL_JSON = Utils.parse(_unsafeWindow.RAW_TEXT);
        Utils.hide(Utils.query("pre"));
        window.postMessage({ addStyle: true });
        const meta = Utils.createElement("meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" });
        document.head.appendChild(meta);
        const script = Utils.createElement("script", { src: LAYUI_JS, type: "text/javascript" });
        document.head.appendChild(script);
        setTimeout(async () => {
          document.body.insertAdjacentHTML("afterbegin", layout);
          const temp = Utils.query('template[data-for="viewFormater"]');
          Utils.query(".toolbar").innerHTML = temp.innerHTML;
          await __vitePreload(() => module.import('./index-DD94hAxE-D1eUeifO.js'), void 0 );
          __vitePreload(() => module.import('./index-BxySEv1i-D_PDa3oV.js'), void 0 );
          __vitePreload(() => module.import('./index-D0V4wvmP-CG0IuMi1.js'), void 0 );
        });
      })();

    })
  };
}));

System.register("./index-D_4ZLSio-BtOCbpRm.js", ['highlight.js', 'beautifier', './__monkey.entry-CYSHb-BY.js'], (function (exports, module) {
  'use strict';
  var hljs, css_beautify, js_beautify, Utils;
  return {
    setters: [module => {
      hljs = module.default;
    }, module => {
      css_beautify = module.css_beautify;
      js_beautify = module.js_beautify;
    }, module => {
      Utils = module.U;
    }],
    execute: (function () {

      const layout = `
<div class="beautify_checkbox">
  <input type="checkbox" id="beautify" />
  <label for="beautify">美化输出</label>
</div>
`;
      (function() {
        const docType = ["application/x-javascript", "application/javascript", "text/javascript", "text/css"];
        const contentType = document.contentType;
        if (!docType.includes(contentType)) return;
        const preElement = Utils.query("pre");
        if (!preElement) return;
        window.postMessage({ addStyle: true });
        Utils.addClass(Utils.query("html"), "monkey-js-css-beautify");
        setTimeout(() => {
          const rawText = preElement.innerText;
          document.body.insertAdjacentHTML("afterbegin", layout);
          const checkbox = Utils.query(".beautify_checkbox input");
          checkbox.addEventListener("click", function() {
            if (this.checked) {
              beautifyCode(contentType, preElement, rawText);
            } else {
              preElement.innerText = rawText;
            }
          });
        });
      })();
      function beautifyCode(contentType, element, rawText) {
        const language = contentType.substring(contentType.indexOf("/") + 1);
        if (!["css", "javascript", "x-javascript"].includes(language)) return;
        let beautifyCode2;
        if ("css" === language) {
          const cssBeautify = css_beautify ? css_beautify : window.css_beautify;
          beautifyCode2 = hljs.highlight(cssBeautify(rawText), { language }).value;
        } else {
          const jsBeautify = js_beautify ? js_beautify : window.js_beautify;
          beautifyCode2 = hljs.highlight(jsBeautify(rawText), { language: "javascript" }).value;
        }
        element.innerHTML = `<code>${beautifyCode2}</code>`;
      }

    })
  };
}));

System.register("./index-DD94hAxE-D1eUeifO.js", ['./__monkey.entry-CYSHb-BY.js', './tippy.esm-D1eoMe9a-Bn9PjR6Y.js'], (function (exports, module) {
  'use strict';
  var Utils, _unsafeWindow, _GM_getValue, _GM_setValue, _GM_setClipboard, tippy;
  return {
    setters: [module => {
      Utils = module.U;
      _unsafeWindow = module._;
      _GM_getValue = module.a;
      _GM_setValue = module.b;
      _GM_setClipboard = module.c;
    }, module => {
      tippy = module.t;
    }],
    execute: (function () {

      var __defProp = Object.defineProperty;
      var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
      const STYLE = Object.freeze({ TABLE: "table", VIEWER: "viewer" });
      const SORTED = Object.freeze({ NONE: "none", ASC: "ASC", DESC: "DESC" });
      class JsonFormat {
        constructor(options, tag, clazz) {
          __publicField(this, "Root", "Root");
          __publicField(this, "DEFAULTS", { json: null, style: null, container: null, theme: "default", sort: SORTED.NONE });
          // 括号
          __publicField(this, "BRACKET", Object.freeze({
            array: { START: "[", END: "]", FULL: "[]" },
            object: { START: "{", END: "}", FULL: "{}" }
          }));
          // 排序枚举
          __publicField(this, "SORT_ENUM", Object.freeze({
            [SORTED.NONE]: { value: SORTED.ASC, text: "升序" },
            [SORTED.ASC]: { value: SORTED.DESC, text: "降序" },
            [SORTED.DESC]: { value: SORTED.NONE, text: "排序" }
          }));
          this.tag = tag;
          this.clazz = clazz;
          this.options = Object.assign(this.DEFAULTS, options);
          if (!options.container) throw new Error("Container is required");
          if (!options.json) throw new Error("json is required");
          this.container = Utils.query(options.container);
          this.setTheme(this.options.theme);
          this.render(tag, clazz);
        }
        render(tag, clazz) {
          this.container.innerHTML = "";
          const wrapper = Utils.createElement(tag, { class: clazz });
          const fragment = document.createDocumentFragment();
          this.buildNode(fragment, this.options.json);
          wrapper.appendChild(fragment);
          this.container.appendChild(wrapper);
          this.bindEvent();
        }
        buildNode() {
          throw new Error("此方法必须由子类实现具体功能");
        }
        setTheme(theme) {
          const classList = document.body.classList;
          classList.forEach((clas) => {
            if (clas.includes("theme")) classList.remove(clas);
          });
          classList.add(`${theme}-theme`);
        }
        keySort(json) {
          const { sort } = this.options;
          if (Array.isArray(json)) return json;
          if (sort === SORTED.NONE) return json;
          const entries = Object.entries(json);
          const asc = ([prev], [next]) => prev.localeCompare(next);
          const desc = ([prev], [next]) => next.localeCompare(prev);
          const result = Object.is(SORTED.ASC, sort) ? entries.sort(asc) : entries.sort(desc);
          return Object.fromEntries(result);
        }
        sorted() {
          const sort = this.SORT_ENUM[this.options.sort];
          this.options.sort = sort.value;
          this.render(this.tag, this.clazz);
          return sort.text;
        }
        iterateJson(json, parentId, parentPath, tagName, callback) {
          const entries = Object.entries(this.keySort(json));
          const entryCount = entries.length;
          const lastIndex = entryCount - 1;
          for (let index = 0; index < entryCount; index++) {
            const id = Utils.random();
            const [key, value] = entries[index];
            const type = Utils.getType(value);
            const hasNext = this.hasNext(value);
            const notLast = !Object.is(index, lastIndex);
            const path = this.spliceJsonPath(parentPath, key);
            const element = Utils.createElement(tagName, { path, "data-node-id": id, "data-node-pid": parentId });
            if (hasNext) element.setAttribute("class", "collapsible expanded");
            callback.call(this, { id, key, value, type, path, hasNext, element, notLast });
          }
        }
        creatValueNode(type, value) {
          if (this.isIterator(value)) return this.createBracket(type);
          const node = Utils.createElement("span", { class: `json-${type}` });
          if (this.isUrl(value)) {
            const link = Utils.createElement("a", { target: "_blank", href: value }, `"${value}"`);
            node.appendChild(link);
            return node;
          }
          node.textContent = Object.is("string", type) ? Utils.stringify(value) : `${value}`;
          if (this.isColor(value)) {
            const span = Utils.createElement("span", { class: "json-color", style: `background-color: ${value}` });
            node.prepend(span);
          }
          return node;
        }
        creatExtraNodes(node, json) {
          if (!this.hasNext(json)) return;
          node.prepend(this.creatArrowNode());
          node.appendChild(this.creatCopyNode(json));
          node.appendChild(this.creatDescNode(json));
        }
        creatArrowNode() {
          return Utils.createElement("span", { class: "json-arrow" });
        }
        creatCopyNode(json) {
          const copy = Utils.createElement("span", { title: "复制", class: "json-copy" });
          copy.json = json;
          return copy;
        }
        creatDescNode(json) {
          const type = Utils.getType(json);
          const desc = Utils.createElement("span", { class: "json-desc" });
          const count = Object.keys(json).length;
          const span = Utils.createElement("span");
          span.textContent = `${count} ${type === "object" ? count > 1 ? "keys" : "key" : count > 1 ? "items" : "item"}`;
          desc.appendChild(span);
          if (STYLE.TABLE === this.options.style) {
            desc.insertAdjacentText("afterbegin", this.BRACKET[type].START);
            desc.insertAdjacentText("beforeend", this.BRACKET[type].END);
          }
          return desc;
        }
        createBracket(type) {
          return Utils.createElement("span", { type, class: `json-bracket` }, this.BRACKET[type].FULL);
        }
        bindEvent() {
          this.addEvent("click", ".json-copy", ({ target }) => {
            const className = "success";
            if (!target.json || Utils.hasClass(target, className)) return;
            Utils.setClipboard(Utils.stringify(target.json, null, 2));
            setTimeout(() => Utils.removeClass(target, className), 1500);
            Utils.addClass(target, className);
          });
          this.addEvent("click", ".json-arrow", ({ target }) => {
            const node = Utils.closest(target, ".collapsible");
            Utils.hasClass(node, "expanded") ? this.collapse(node) : this.expand(node);
          });
          this.addEvent("click", ".json-desc", ({ target }) => this.expand(Utils.closest(target, ".collapsible")));
        }
        expandAll() {
          this.nodes().forEach((node) => this.expand(node));
        }
        collapseAll() {
          this.nodes().forEach((node) => this.collapse(node));
        }
        expand(node) {
          this.toggleDescs(node, false);
          Utils.hide(this.descNode(node));
          Utils.addClass(node, "expanded");
          Utils.removeClass(node, "collapsed");
        }
        collapse(node) {
          this.toggleDescs(node, true);
          Utils.show(this.descNode(node));
          Utils.addClass(node, "collapsed");
          Utils.removeClass(node, "expanded");
        }
        toggleDescs(node, hidden) {
          const target = Utils.query(`#${node.dataset.nodeId}`);
          hidden ? Utils.addClass(target, "hidden") : Utils.removeClass(target, "hidden");
        }
        descNode(node) {
          return Utils.query(`*[data-node-id="${node.dataset.nodeId}"] .json-desc`, node);
        }
        findChildren(node) {
          return Utils.queryAll(`*[data-node-pid="${node.dataset.nodeId}"]`, this.container);
        }
        findByID(id) {
          return Utils.query(`*[data-node-id="${id}"]`, this.container);
        }
        expandByID(id) {
          this.expand(this.findByID(id));
        }
        collapseByID(id) {
          this.collapse(this.findByID(id));
        }
        nodes() {
          return Utils.queryAll(".collapsible", this.container);
        }
        addEvent(type, selector, fn) {
          Utils.queryAll(selector).forEach((el) => el.addEventListener(type, fn));
        }
        spliceJsonPath(path, key) {
          if (this.isNumber(key)) return `${path}[${key}]`;
          if (key.includes(".")) return `${path}["${key}"]`;
          return `${path}.${key}`;
        }
        isNumber(str) {
          return /^\d+$/.test(str);
        }
        isIterator(data) {
          return ["array", "object"].includes(Utils.getType(data));
        }
        hasNext(data) {
          return this.isIterator(data) ? Object.keys(data).length > 0 : false;
        }
        isUrl(str) {
          const regexp = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
          return regexp.test(str);
        }
        isColor(str) {
          const rgbRegex = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
          const hexRegex = /^#([A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
          const rgbaRegex = /^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0|1|0\.\d+)\s*\)$/;
          return hexRegex.test(str) || rgbRegex.test(str) || rgbaRegex.test(str);
        }
      }
      __publicField(JsonFormat, "STYLE", STYLE);
      class JsonViewer extends JsonFormat {
        constructor(options) {
          options.style = JsonFormat.STYLE.VIEWER;
          super(options, "div", "json-viewer");
        }
        buildNode(fragment, json, parentPath = this.Root, parentId = this.Root) {
          const type = Utils.getType(json);
          fragment.appendChild(Utils.createElement("span", { type, class: `json-bracket` }, this.BRACKET[type].START));
          if (this.Root !== parentId) this.creatExtraNodes(fragment, json);
          this.iterateNodes(fragment, json, parentPath, parentId);
          fragment.appendChild(Utils.createElement("span", { type, class: `json-bracket` }, this.BRACKET[type].END));
        }
        iterateNodes(fragment, json, parentPath, parentId) {
          const wrapper = Utils.createElement("ul", { id: parentId });
          this.iterateJson(json, parentId, parentPath, "li", (data) => {
            const { id, key, value, type, path, hasNext, element, notLast } = data;
            this.createKeyNode(element, key);
            if (hasNext) this.buildNode(element, value, path, id);
            if (!hasNext) element.appendChild(this.creatValueNode(type, value));
            if (notLast) element.appendChild(Utils.createElement("span", { class: "json-comma" }, ","));
            wrapper.appendChild(element);
          });
          fragment.appendChild(wrapper);
        }
        createKeyNode(node, key) {
          if (this.isNumber(key)) return;
          node.appendChild(Utils.createElement("span", { class: "json-key" }, `"${key}"`));
          node.appendChild(Utils.createElement("span", { class: "json-colon" }, ":"));
        }
      }
      class JsonToTable extends JsonFormat {
        constructor(options) {
          options.style = JsonFormat.STYLE.TABLE;
          super(options, "table", "json-tree-table");
        }
        buildNode(fragment, json, parentPath = this.Root, parentId = this.Root, nodeDepth = 1) {
          const wrapper = Utils.createElement("wrapper", { id: parentId });
          this.iterateJson(json, parentId, parentPath, "tr", (data) => {
            const { id, key, value, type, path, hasNext, element } = data;
            element.appendChild(this.createKeyNode(key, value, nodeDepth, hasNext));
            if (!hasNext) {
              const td = Utils.createElement("td");
              td.appendChild(this.creatValueNode(type, value));
              element.appendChild(td);
            }
            wrapper.appendChild(element);
            if (hasNext) this.buildNode(wrapper, value, path, id, nodeDepth + 1);
          });
          fragment.appendChild(wrapper);
        }
        createKeyNode(key, value, nodeDepth, hasNext) {
          const paddingLeft = nodeDepth * 20;
          const node = Utils.createElement("td", { style: `padding-left: ${paddingLeft}px` });
          if (hasNext) node.setAttribute("colspan", 2);
          node.appendChild(Utils.createElement("span", { class: "json-key" }, `${key}`));
          node.appendChild(Utils.createElement("span", { class: "json-colon" }, ":"));
          this.creatExtraNodes(node, value);
          return node;
        }
        bindEvent() {
          super.bindEvent();
          Utils.addEvent("mousedown", "table tr", function({ ctrlKey, target }) {
            const { tagName, className } = target;
            if (ctrlKey || tagName === "A" || tagName === "SPAN" && className !== "json-key") return;
            const filter = Utils.queryAll(".selected").filter((el) => el !== this);
            Utils.removeClass(filter, "selected");
            Utils.toggleClass(this, "selected");
          });
        }
      }
      class FormaterFactory {
        static getInstance(options) {
          return Object.is(JsonToTable.STYLE.TABLE, options.style) ? new JsonToTable(options) : new JsonViewer(options);
        }
      }
      const evnet = {
        urlHover() {
          Utils.addEvent("mouseenter", "a[href]", function() {
            const href = Utils.attr(this, "href");
            if (!Utils.isImg(href)) return;
            const content = `<img style="width:100%" src="${href}" />`;
            tippy(this, { maxWidth: 500, duration: 800, allowHTML: true, theme: "imagebox", content }).show();
          });
          return this;
        },
        eventPath() {
          Utils.addEvent("click mouseenter", ".json-key", ({ type, ctrlKey, target }) => {
            const path = Utils.closest(target, "[path]").getAttribute("path");
            if (ctrlKey && type === "click") return _GM_setClipboard(path) & layer.msg("复制成功", { time: 1500 });
            const content = `<i>ctrl＋click 复制</i><br/><b>路径：</b>${path}`;
            tippy(target, { duration: 800, theme: "layer", allowHTML: true, maxWidth: "none", content }).show();
          });
          return this;
        },
        init() {
          this.urlHover().eventPath();
        }
      };
      const format = exports("default", {
        changeStyle(style) {
          _GM_setValue("style", style) & this.setStyle();
          return this;
        },
        setStyle() {
          _unsafeWindow.FILTER_VALUE = "";
          Utils.query(".filter").value = "";
          Utils.attr(Utils.query(".clear"), "hidden", true);
          this.render(_unsafeWindow.GLOBAL_JSON);
          return this;
        },
        render(json) {
          const container = Utils.query("#formatBox");
          const style = _GM_getValue("style") || "default";
          const theme = _GM_getValue("theme") || "default";
          const options = { json, style, theme, container };
          _unsafeWindow.JSON_FORMATER = FormaterFactory.getInstance(options);
          if (_unsafeWindow.GLOBAL_JSONP_FUN) {
            const start = Utils.createElement("div", { class: "jsonp" });
            start.textContent = `${_unsafeWindow.GLOBAL_JSONP_FUN}(`;
            container.prepend(start);
            const end = start.cloneNode(true);
            end.textContent = ")";
            container.append(end);
          }
          return this;
        },
        filter(json, text) {
          text = text.toLowerCase();
          function match(json2, text2) {
            const newJson = Array.isArray(json2) ? new Array() : new Object();
            const entries = Object.entries(json2);
            for (const [key, value] of entries) {
              const type = Utils.getType(value);
              const _key = key.toLowerCase();
              const _value = Utils.stringify(value).toLowerCase();
              if (!_key.includes(text2) && !_value.includes(text2)) continue;
              if (["array", "object"].includes(type)) {
                const result = match(value, text2);
                const _result = Utils.stringify(result).toLowerCase();
                if (_key.includes(text2) || _result.includes(text2)) {
                  newJson[key] = result;
                }
              } else {
                newJson[key] = value;
              }
            }
            return newJson;
          }
          return match(json, text);
        },
        input() {
          const debounceInput = Utils.debounce((event) => {
            const value = event.target.value;
            _unsafeWindow.FILTER_VALUE = value;
            const clear = Utils.query(".clear");
            Utils.attr(clear, "hidden", !value);
            const newJson = this.filter(_unsafeWindow.GLOBAL_JSON, value);
            this.render(newJson);
          }, 400);
          Utils.addEvent("input", ".filter", debounceInput);
          return this;
        },
        clear() {
          Utils.addEvent("click", ".clear", () => this.setStyle());
          return this;
        },
        init() {
          this.setStyle().input().clear();
          evnet.init();
        }
      });
      window.addEventListener("message", function({ data }) {
        if (data?.reload) return format.setStyle();
        if (Object.is(data?.type, "style")) format.changeStyle(data?.value);
      });
      format.init();

    })
  };
}));

System.register("./index-BxySEv1i-D_PDa3oV.js", ['./tippy.esm-D1eoMe9a-Bn9PjR6Y.js', './__monkey.entry-CYSHb-BY.js'], (function (exports, module) {
	'use strict';
	var tippy, Utils;
	return {
		setters: [module => {
			tippy = module.t;
		}, module => {
			Utils = module.U;
		}],
		execute: (function () {

			const scroll = Utils.createElement("div", { class: "scroll-top" });
			document.body.appendChild(scroll);
			tippy(scroll, { theme: "scroll", placement: "left", content: "返回顶部" });
			const $container = Utils.query(".container");
			$container.addEventListener("scroll", ({ target }) => target.scrollTop > 500 ? Utils.show(scroll) : Utils.hide(scroll));
			scroll.addEventListener("click", () => $container.scrollTop = 0);

		})
	};
}));

System.register("./index-D0V4wvmP-CG0IuMi1.js", ['./tippy.esm-D1eoMe9a-Bn9PjR6Y.js', 'jsmind', 'dom-to-image', './__monkey.entry-CYSHb-BY.js'], (function (exports, module) {
  'use strict';
  var tippy, require$$0, require$$1, Utils, _unsafeWindow, _GM_getValue, URL$1, _GM_setClipboard, _GM_setValue, _GM;
  return {
    setters: [module => {
      tippy = module.t;
    }, module => {
      require$$0 = module.default;
    }, module => {
      require$$1 = module.default;
    }, module => {
      Utils = module.U;
      _unsafeWindow = module._;
      _GM_getValue = module.a;
      URL$1 = module.d;
      _GM_setClipboard = module.c;
      _GM_setValue = module.b;
      _GM = module.e;
    }],
    execute: (function () {

      var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
      /**
      * @license BSD-3-Clause
      * @copyright 2014-2025 hizzgdev@163.com
      *
      * Project Home:
      *   https://github.com/hizzgdev/jsmind/
      */
      (function(module, exports) {
        !function(e, t) {
          t(require$$0, require$$1);
        }(commonjsGlobal, function(e, t) {
          function i(e2) {
            return e2 && "object" == typeof e2 && "default" in e2 ? e2 : { default: e2 };
          }
          var n = i(e), o = i(t);
          if (!n.default) throw new Error("jsMind is not defined");
          if (!o.default) throw new Error("dom-to-image is required");
          const r = n.default.$, s = { filename: null, watermark: { left: r.w.location, right: "https://github.com/hizzgdev/jsmind" }, background: "transparent" };
          class a {
            constructor(e2, t2) {
              var i2 = {};
              n.default.util.json.merge(i2, s), n.default.util.json.merge(i2, t2), this.version = "0.2.0", this.jm = e2, this.options = i2, this.dpr = e2.view.device_pixel_ratio;
            }
            shoot() {
              let e2 = this.create_canvas(), t2 = e2.getContext("2d");
              t2.scale(this.dpr, this.dpr), Promise.resolve(t2).then(() => this.draw_background(t2)).then(() => this.draw_lines(t2)).then(() => this.draw_nodes(t2)).then(() => this.draw_watermark(e2, t2)).then(() => this.download(e2)).then(() => this.clear(e2));
            }
            create_canvas() {
              let e2 = r.c("canvas");
              const t2 = this.jm.view.size.w, i2 = this.jm.view.size.h;
              return e2.width = t2 * this.dpr, e2.height = i2 * this.dpr, e2.style.width = t2 + "px", e2.style.height = i2 + "px", e2.style.visibility = "hidden", this.jm.view.e_panel.appendChild(e2), e2;
            }
            clear(e2) {
              e2.parentNode.removeChild(e2);
            }
            draw_background(e2) {
              return new Promise(function(t2, i2) {
                const n2 = this.options.background;
                n2 && "transparent" !== n2 && (e2.fillStyle = this.options.background, e2.fillRect(0, 0, this.jm.view.size.w, this.jm.view.size.h)), t2(e2);
              }.bind(this));
            }
            draw_lines(e2) {
              return new Promise(function(t2, i2) {
                this.jm.view.graph.copy_to(e2, function() {
                  t2(e2);
                });
              }.bind(this));
            }
            draw_nodes(e2) {
              return o.default.toSvg(this.jm.view.e_nodes, { style: { zoom: 1 } }).then(this.load_image).then(function(t2) {
                return e2.drawImage(t2, 0, 0), e2;
              });
            }
            draw_watermark(e2, t2) {
              return t2.textBaseline = "bottom", t2.fillStyle = "#000", t2.font = "11px Verdana,Arial,Helvetica,sans-serif", this.options.watermark.left && (t2.textAlign = "left", t2.fillText(this.options.watermark.left, 5.5, e2.height - 2.5)), this.options.watermark.right && (t2.textAlign = "right", t2.fillText(this.options.watermark.right, e2.width - 5.5, e2.height - 2.5)), t2;
            }
            load_image(e2) {
              return new Promise(function(t2, i2) {
                let n2 = new Image();
                n2.onload = function() {
                  t2(n2);
                }, n2.onerror = i2, n2.src = e2;
              });
            }
            download(e2) {
              var t2 = (this.options.filename || this.jm.mind.name) + ".png";
              if (navigator.msSaveBlob && e2.msToBlob) {
                var i2 = e2.msToBlob();
                navigator.msSaveBlob(i2, t2);
              } else {
                var n2 = e2.toDataURL(), o2 = r.c("a");
                if ("download" in o2) {
                  o2.style.visibility = "hidden", o2.href = n2, o2.download = t2, r.d.body.appendChild(o2);
                  var s2 = r.d.createEvent("MouseEvents");
                  s2.initEvent("click", true, true), o2.dispatchEvent(s2), r.d.body.removeChild(o2);
                } else location.href = n2;
              }
            }
          }
          let d = new n.default.plugin("screenshot", function(e2, t2) {
            var i2 = new a(e2, t2);
            e2.screenshot = i2, e2.shoot = function() {
              i2.shoot();
            };
          });
          n.default.register_plugin(d);
        });
      })();
      const jsonMind = {
        isFirst: true,
        transform(json) {
          const result = [];
          if (Utils.isObject(json)) {
            for (const key in json) {
              let value = json[key];
              const isArray = Array.isArray(value);
              const type = Utils.getPropType(value);
              if (isArray && value.length > 0) value = Utils.getMaxKeysAndDepthObject(value);
              const isObject = Object.is(Utils.getType(value), "object");
              const keys = isObject ? Object.keys(value) : null;
              const children = this.transform(value);
              const topic = `${key}<span class="datatype">${type}</span>`;
              result.push({ keys, topic, isArray, children, chain: key, id: Utils.random() });
            }
          }
          return result;
        },
        getChain(node) {
          let chain = node?.data?.chain;
          if (!node?.parent) return chain;
          const parent = node.parent;
          const parentChain = this.getChain(parent);
          if (parent.data.isArray) return `${parentChain}[i].${chain}`;
          if (chain.includes(".")) return `${parentChain}["${chain}"]`;
          return `${parentChain}.${chain}`;
        },
        show(json) {
          let isArray = Array.isArray(json);
          if (isArray) {
            if (typeof json[0] !== "object") {
              layer.msg("无法生成脑图", { time: 1e3 });
              return this;
            }
            json = Utils.getMaxKeysAndDepthObject(json);
          }
          if (!this.isFirst) return this;
          const children = this.transform(json);
          _unsafeWindow.GLOBAL_JSMIND.show({
            format: "node_tree",
            meta: { version: "1.0", name: "JSON脑图", author: "1220301855@qq.com" },
            data: { isArray, children, id: "root", chain: "Root", topic: "Root", direction: "left", keys: Object.keys(json) }
          });
          this.isFirst = false;
          return this;
        },
        event() {
          Utils.addEvent("click mouseover", "jmnode", ({ type, ctrlKey, target }) => {
            const nodeid = Utils.attr(target, "nodeid");
            const node = _unsafeWindow.GLOBAL_JSMIND.get_node(nodeid);
            const chain = this.getChain(node);
            if (!chain) return;
            if (type === "click") {
              if (ctrlKey) return _GM_setClipboard(chain), layer.msg("复制成功", { time: 1500 });
              if (node?.data?.keys?.length > 0) this.popup(chain, node?.data?.keys);
            } else {
              const content = `<i>ctrl＋click 复制</i><br/><b>路径：</b>${chain}`;
              tippy(target, { content, duration: 800, theme: "layer", allowHTML: true, maxWidth: "none" }).show();
            }
          });
          return this;
        },
        popup(chain, keys) {
          layer.open({
            type: 1,
            move: false,
            shadeClose: true,
            title: " 节点",
            content: function() {
              const chain2 = Utils.createElement("div");
              const chainCon = Utils.createElement("div");
              chain2.appendChild(chainCon);
              const content = Utils.createElement("div", { class: "js-mind-child-node" });
              const copy = Utils.createElement("div", { title: "复制", class: "js-mind-copy" });
              content.appendChild(copy);
              keys.forEach((i) => {
                const child = Utils.createElement("div");
                child.textContent = i;
                content.appendChild(child);
              });
              return content.outerHTML;
            }(),
            success(layero) {
              layero.on("click", ".js-mind-copy", function() {
                _GM_setClipboard(chain + "\n\n" + keys.join("\n"));
                layer.msg("复制成功", { time: 1500 });
              });
            }
          });
        },
        init(json) {
          if (_unsafeWindow.GLOBAL_JSMIND) return;
          _unsafeWindow.GLOBAL_JSMIND = new require$$0({
            mode: "side",
            editable: false,
            container: "mindBox",
            view: { hmargin: 50, vmargin: 50, engine: "svg", draggable: true, support_html: false, line_color: "#C4C9D0" },
            layout: { vspace: 5, hspace: 130 }
          });
          this.show(json).event();
        }
      };
      const mindBox = Utils.query("#mindBox");
      const formatBox = Utils.query("#formatBox");
      const rawTextBox = Utils.query("#rawTextBox");
      const rawTextPre = Utils.query("pre", rawTextBox);
      const tabs = {
        viewFormater() {
          const value = _unsafeWindow.FILTER_VALUE || "";
          Utils.query(".filter").value = value;
          Utils.attr(Utils.query(".clear"), "hidden", !value);
        },
        saveJson() {
          if (Utils.isVisible(mindBox)) return _unsafeWindow.GLOBAL_JSMIND.shoot();
          const content = rawTextPre.textContent || _unsafeWindow.RAW_TEXT;
          const filename = (/* @__PURE__ */ new Date()).getTime() + ".json";
          Utils.downloadText(content, filename);
        },
        copyJson() {
          _GM_setClipboard(rawTextPre.textContent || _unsafeWindow.RAW_TEXT);
          layer.msg("复制成功", { time: 1500 });
        },
        sorted(el) {
          el.textContent = _unsafeWindow.JSON_FORMATER.sorted();
        },
        collapseAll() {
          Utils.isVisible(formatBox) ? _unsafeWindow.JSON_FORMATER.collapseAll() : _unsafeWindow.GLOBAL_JSMIND.collapse_all();
        },
        expandAll() {
          if (Utils.isVisible(formatBox)) return _unsafeWindow.JSON_FORMATER.expandAll();
          _unsafeWindow.GLOBAL_JSMIND.expand_all();
          _unsafeWindow.GLOBAL_JSMIND.scroll_node_to_center(_unsafeWindow.GLOBAL_JSMIND?.get_root());
        },
        viewMind() {
          jsonMind.init(_unsafeWindow.GLOBAL_JSON);
          _unsafeWindow.GLOBAL_JSMIND.scroll_node_to_center(_unsafeWindow.GLOBAL_JSMIND.get_root());
        },
        jsoncrack() {
          const theme2 = (_GM_getValue("theme") || "light").replace(/-.*/, "");
          layer.closeAll();
          layer.open({
            type: 1,
            move: false,
            title: false,
            area: ["100vw", "100vh"],
            content: `<iframe id="jsoncrackEmbed" src="${URL$1.JSON_CRACK_WIDGET}"></iframe>`,
            success() {
              const jsonCrackEmbed = Utils.query("#jsoncrackEmbed");
              window?.addEventListener("message", () => {
                const msg = { options: { theme: theme2 }, json: _unsafeWindow.RAW_TEXT };
                jsonCrackEmbed?.contentWindow?.postMessage(msg, "*");
              });
            }
          });
        },
        _setRawText() {
          let rawText = _unsafeWindow.RAW_TEXT;
          if (_unsafeWindow.GLOBAL_JSONP_FUN) {
            rawText = `${_unsafeWindow.GLOBAL_JSONP_FUN}(${rawText})`;
          }
          rawTextPre.textContent = rawText;
        },
        firstFormat: true,
        viewRawText() {
          if (!this.firstFormat) return;
          this.firstFormat = false;
          this._setRawText();
        },
        isBeautify: false,
        beautify() {
          this.isBeautify = !this.isBeautify;
          if (!this.isBeautify) return this._setRawText();
          let str = Utils.stringify(_unsafeWindow.GLOBAL_JSON, null, 2);
          if (_unsafeWindow.GLOBAL_JSONP_FUN) {
            str = `${_unsafeWindow.GLOBAL_JSONP_FUN}(${str})`;
          }
          rawTextPre.textContent = str;
        },
        init() {
          Utils.addEvent("click", ".btn", ({ target }) => {
            const id = target.id;
            if (Utils.hasClass(target, "tabs-item")) {
              const clas = "active";
              Utils.removeClass(Utils.queryAll(".tabs-item"), clas);
              Utils.addClass(target, clas);
              Utils.removeClass(Utils.queryAll("div[data-for]"), clas);
              Utils.addClass(Utils.query(`div[data-for="${id}"]`), clas);
              const template = Utils.query(`template[data-for='${id}']`);
              Utils.query(".toolbar").innerHTML = template.innerHTML;
            }
            this[id](target);
          });
        }
      };
      window.addEventListener("message", function({ data }) {
        if (!data?.reload) return;
        mindBox.innerHTML = "";
        jsonMind.isFirst = true;
        tabs.isBeautify = false;
        tabs.firstFormat = true;
        _unsafeWindow.GLOBAL_JSMIND = void 0;
        if (Utils.isVisible(rawTextBox)) return tabs.viewRawText();
        if (Utils.isVisible(mindBox)) return jsonMind.init(_unsafeWindow.GLOBAL_JSON);
      });
      const theme = {
        changeTheme(theme2) {
          _GM_setValue("theme", theme2) & this.setTheme();
        },
        setTheme() {
          const theme2 = _GM_getValue("theme") || "default";
          _unsafeWindow.JSON_FORMATER.setTheme(theme2);
        }
      };
      const http_form = `
<form class="httpRequest">
  <div class="requestbox">
    <select name="method">
      <option value="POST">POST</option>
      <option value="GET">GET</option>
      <option value="PUT">PUT</option>
      <option value="DELETE">DELETE</option>
      <option value="PATCH">PATCH</option>
    </select>
    <input name="url" placeholder="请求地址" />
    <select name="contentType">
      <option value="application/x-www-form-urlencoded;charset=UTF-8">urlencoded</option>
      <option value="application/json;charset=UTF-8">application/json</option>
    </select>
    <button type="submit">发送请求</button>
  </div>
  <div class="form-group">
    <label for="headers">请求头</label>
    <textarea id="headers" name="headers" placeholder='例如: {"token": "test"}'></textarea>
  </div>
  <div class="form-group">
    <label for="body">请求参数</label>
    <textarea id="body" name="params" placeholder='例如: {"name": "test"}'></textarea>
  </div>
</form>`;
      const tools = {
        inputJson() {
          layer.prompt(
            {
              move: false,
              formType: 2,
              btn: ["确认"],
              shadeClose: true,
              title: "JSON 输入",
              area: ["400px", "300px"],
              maxlength: Number.MAX_VALUE
            },
            (text) => {
              if (!text) return layer.msg("内容不能为空", { time: 1500 });
              const { rawText, jsonpFun } = Utils.matchJsonp(text);
              try {
                const json = Utils.parse(rawText);
                this.reload(json, rawText, jsonpFun);
              } catch (e) {
                layer.msg("JSON格式不正确", { time: 1500 });
                console.log("格式化异常: ", e);
              }
            }
          );
          return this;
        },
        fetchJson() {
          const success = () => {
            const formElem = Utils.query("form");
            formElem.addEventListener("submit", (event) => {
              event.preventDefault();
              const formData = new FormData(formElem);
              const submitData = {};
              for (const [name, value] of formData) {
                submitData[name] = value;
              }
              this._submit(submitData);
            });
          };
          layer.open({
            success,
            type: 1,
            shadeClose: true,
            title: "HTTP 请求",
            content: http_form
          });
          return this;
        },
        async _submit(submitData) {
          let { url, method, headers, params, contentType } = submitData;
          if (!url) return layer.msg("请求地址不能为空");
          if (headers && !(headers.startsWith("{") && headers.endsWith("}"))) return layer.msg("请求头 格式不合法");
          if (params && !(params.startsWith("{") && params.endsWith("}"))) return layer.msg("请求参数 格式不合法");
          headers = JSON.parse(headers || "{}");
          params = JSON.parse(params || "{}");
          try {
            layer.load();
            headers["Content-Type"] = contentType;
            if (method === "GET") url = this.buildUrlWithParams(url, this.queryParams(params));
            if (contentType.includes("urlencoded")) params = this.queryParams(params);
            const response = await _GM.xmlHttpRequest({ method, url, headers, data: params }).catch((e) => console.error(e));
            const result = response.responseText;
            const { rawText, jsonpFun } = Utils.matchJsonp(result);
            const json = Utils.parse(rawText);
            this.reload(json, rawText, jsonpFun);
          } catch (e) {
            layer.closeAll();
            layer.msg("请求异常：" + e.message);
            console.log("HTTP 请求异常：", e);
          }
        },
        reload(json, rawText, jsonpFun) {
          layer.closeAll();
          _unsafeWindow.RAW_TEXT = rawText;
          _unsafeWindow.GLOBAL_JSON = json;
          _unsafeWindow.GLOBAL_JSONP_FUN = jsonpFun;
          window.postMessage({ reload: true });
        },
        queryParams(data) {
          const params = [];
          for (const [key, value] of Object.entries(data)) {
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
          }
          return params.join("&");
        },
        buildUrlWithParams: function(baseUrl, queryParams) {
          if (!queryParams) return baseUrl;
          const separator = baseUrl.includes("?") ? "&" : "?";
          return `${baseUrl}${separator}${queryParams}`;
        }
      };
      const active = "active";
      const handleBar = {
        currentTippy: null,
        handle() {
          const tagName = "span";
          [".style", ".theme", ".tools"].forEach((selector) => {
            tippy(selector, {
              duration: 500,
              allowHTML: true,
              interactive: true,
              trigger: "click",
              appendTo: Utils.query(selector).parentNode,
              onTrigger: (instance) => {
                this.currentTippy = instance;
                const target = instance.reference;
                Utils.addClass(Utils.query(tagName, target), active);
                const template = Utils.query("template", target);
                const ul = template.content.cloneNode(true);
                const type = template.dataset.type;
                const value = _GM_getValue(type) || "default";
                const current = Utils.query(`li[data-value=${value}]`, ul);
                Utils.addClass(current, active);
                const tempDiv = Utils.createElement("div");
                while (ul.firstChild) tempDiv.appendChild(ul.firstChild);
                instance.setContent(tempDiv.innerHTML);
              },
              onHide(instance) {
                Utils.removeClass(Utils.query(tagName, instance.reference));
              }
            });
          });
          return this;
        },
        checked() {
          const selector = ".rightbox li";
          Utils.addEvent("click", selector, ({ target }) => {
            if (Utils.hasClass(target, active)) return;
            const type = target.dataset.type;
            const value = target.dataset.value;
            window.postMessage({ type, value });
            if (Object.is(type, "tools")) return this.currentTippy.hide();
            Utils.removeClass(Utils.queryAll(selector));
            Utils.addClass(target, active);
          });
          return this;
        },
        init() {
          this.handle().checked();
        }
      };
      tabs.init();
      theme.setTheme();
      handleBar.init();
      window.addEventListener("message", function({ data }) {
        if (Object.is(data?.type, "tools")) return tools[data?.value]();
        if (Object.is(data?.type, "theme")) return theme.changeTheme(data?.value);
      });

    })
  };
}));

System.register("./tippy.esm-D1eoMe9a-Bn9PjR6Y.js", [], (function (exports, module) {
  'use strict';
  return {
    execute: (function () {

      exports("t", tippy);

      var top = "top";
      var bottom = "bottom";
      var right = "right";
      var left = "left";
      var auto = "auto";
      var basePlacements = [top, bottom, right, left];
      var start = "start";
      var end = "end";
      var clippingParents = "clippingParents";
      var viewport = "viewport";
      var popper = "popper";
      var reference = "reference";
      var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
        return acc.concat([placement + "-" + start, placement + "-" + end]);
      }, []);
      var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
        return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
      }, []);
      var beforeRead = "beforeRead";
      var read = "read";
      var afterRead = "afterRead";
      var beforeMain = "beforeMain";
      var main = "main";
      var afterMain = "afterMain";
      var beforeWrite = "beforeWrite";
      var write = "write";
      var afterWrite = "afterWrite";
      var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
      function getNodeName(element) {
        return element ? (element.nodeName || "").toLowerCase() : null;
      }
      function getWindow(node) {
        if (node == null) {
          return window;
        }
        if (node.toString() !== "[object Window]") {
          var ownerDocument = node.ownerDocument;
          return ownerDocument ? ownerDocument.defaultView || window : window;
        }
        return node;
      }
      function isElement$1(node) {
        var OwnElement = getWindow(node).Element;
        return node instanceof OwnElement || node instanceof Element;
      }
      function isHTMLElement(node) {
        var OwnElement = getWindow(node).HTMLElement;
        return node instanceof OwnElement || node instanceof HTMLElement;
      }
      function isShadowRoot(node) {
        if (typeof ShadowRoot === "undefined") {
          return false;
        }
        var OwnElement = getWindow(node).ShadowRoot;
        return node instanceof OwnElement || node instanceof ShadowRoot;
      }
      function applyStyles(_ref) {
        var state = _ref.state;
        Object.keys(state.elements).forEach(function(name) {
          var style = state.styles[name] || {};
          var attributes = state.attributes[name] || {};
          var element = state.elements[name];
          if (!isHTMLElement(element) || !getNodeName(element)) {
            return;
          }
          Object.assign(element.style, style);
          Object.keys(attributes).forEach(function(name2) {
            var value = attributes[name2];
            if (value === false) {
              element.removeAttribute(name2);
            } else {
              element.setAttribute(name2, value === true ? "" : value);
            }
          });
        });
      }
      function effect$2(_ref2) {
        var state = _ref2.state;
        var initialStyles = {
          popper: {
            position: state.options.strategy,
            left: "0",
            top: "0",
            margin: "0"
          },
          arrow: {
            position: "absolute"
          },
          reference: {}
        };
        Object.assign(state.elements.popper.style, initialStyles.popper);
        state.styles = initialStyles;
        if (state.elements.arrow) {
          Object.assign(state.elements.arrow.style, initialStyles.arrow);
        }
        return function() {
          Object.keys(state.elements).forEach(function(name) {
            var element = state.elements[name];
            var attributes = state.attributes[name] || {};
            var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
            var style = styleProperties.reduce(function(style2, property) {
              style2[property] = "";
              return style2;
            }, {});
            if (!isHTMLElement(element) || !getNodeName(element)) {
              return;
            }
            Object.assign(element.style, style);
            Object.keys(attributes).forEach(function(attribute) {
              element.removeAttribute(attribute);
            });
          });
        };
      }
      const applyStyles$1 = {
        name: "applyStyles",
        enabled: true,
        phase: "write",
        fn: applyStyles,
        effect: effect$2,
        requires: ["computeStyles"]
      };
      function getBasePlacement$1(placement) {
        return placement.split("-")[0];
      }
      var max = Math.max;
      var min = Math.min;
      var round = Math.round;
      function getUAString() {
        var uaData = navigator.userAgentData;
        if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
          return uaData.brands.map(function(item) {
            return item.brand + "/" + item.version;
          }).join(" ");
        }
        return navigator.userAgent;
      }
      function isLayoutViewport() {
        return !/^((?!chrome|android).)*safari/i.test(getUAString());
      }
      function getBoundingClientRect(element, includeScale, isFixedStrategy) {
        if (includeScale === void 0) {
          includeScale = false;
        }
        if (isFixedStrategy === void 0) {
          isFixedStrategy = false;
        }
        var clientRect = element.getBoundingClientRect();
        var scaleX = 1;
        var scaleY = 1;
        if (includeScale && isHTMLElement(element)) {
          scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
          scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
        }
        var _ref = isElement$1(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
        var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
        var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
        var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
        var width = clientRect.width / scaleX;
        var height = clientRect.height / scaleY;
        return {
          width,
          height,
          top: y,
          right: x + width,
          bottom: y + height,
          left: x,
          x,
          y
        };
      }
      function getLayoutRect(element) {
        var clientRect = getBoundingClientRect(element);
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        if (Math.abs(clientRect.width - width) <= 1) {
          width = clientRect.width;
        }
        if (Math.abs(clientRect.height - height) <= 1) {
          height = clientRect.height;
        }
        return {
          x: element.offsetLeft,
          y: element.offsetTop,
          width,
          height
        };
      }
      function contains(parent, child) {
        var rootNode = child.getRootNode && child.getRootNode();
        if (parent.contains(child)) {
          return true;
        } else if (rootNode && isShadowRoot(rootNode)) {
          var next = child;
          do {
            if (next && parent.isSameNode(next)) {
              return true;
            }
            next = next.parentNode || next.host;
          } while (next);
        }
        return false;
      }
      function getComputedStyle(element) {
        return getWindow(element).getComputedStyle(element);
      }
      function isTableElement(element) {
        return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
      }
      function getDocumentElement(element) {
        return ((isElement$1(element) ? element.ownerDocument : (
          // $FlowFixMe[prop-missing]
          element.document
        )) || window.document).documentElement;
      }
      function getParentNode(element) {
        if (getNodeName(element) === "html") {
          return element;
        }
        return (
          // this is a quicker (but less type safe) way to save quite some bytes from the bundle
          // $FlowFixMe[incompatible-return]
          // $FlowFixMe[prop-missing]
          element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
          element.parentNode || // DOM Element detected
          (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
          // $FlowFixMe[incompatible-call]: HTMLElement is a Node
          getDocumentElement(element)
        );
      }
      function getTrueOffsetParent(element) {
        if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
        getComputedStyle(element).position === "fixed") {
          return null;
        }
        return element.offsetParent;
      }
      function getContainingBlock(element) {
        var isFirefox = /firefox/i.test(getUAString());
        var isIE = /Trident/i.test(getUAString());
        if (isIE && isHTMLElement(element)) {
          var elementCss = getComputedStyle(element);
          if (elementCss.position === "fixed") {
            return null;
          }
        }
        var currentNode = getParentNode(element);
        if (isShadowRoot(currentNode)) {
          currentNode = currentNode.host;
        }
        while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
          var css = getComputedStyle(currentNode);
          if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
            return currentNode;
          } else {
            currentNode = currentNode.parentNode;
          }
        }
        return null;
      }
      function getOffsetParent(element) {
        var window2 = getWindow(element);
        var offsetParent = getTrueOffsetParent(element);
        while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
          offsetParent = getTrueOffsetParent(offsetParent);
        }
        if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
          return window2;
        }
        return offsetParent || getContainingBlock(element) || window2;
      }
      function getMainAxisFromPlacement(placement) {
        return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
      }
      function within(min$1, value, max$1) {
        return max(min$1, min(value, max$1));
      }
      function withinMaxClamp(min2, value, max2) {
        var v = within(min2, value, max2);
        return v > max2 ? max2 : v;
      }
      function getFreshSideObject() {
        return {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        };
      }
      function mergePaddingObject(paddingObject) {
        return Object.assign({}, getFreshSideObject(), paddingObject);
      }
      function expandToHashMap(value, keys) {
        return keys.reduce(function(hashMap, key) {
          hashMap[key] = value;
          return hashMap;
        }, {});
      }
      var toPaddingObject = function toPaddingObject2(padding, state) {
        padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
          placement: state.placement
        })) : padding;
        return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
      };
      function arrow(_ref) {
        var _state$modifiersData$;
        var state = _ref.state, name = _ref.name, options = _ref.options;
        var arrowElement = state.elements.arrow;
        var popperOffsets2 = state.modifiersData.popperOffsets;
        var basePlacement = getBasePlacement$1(state.placement);
        var axis = getMainAxisFromPlacement(basePlacement);
        var isVertical = [left, right].indexOf(basePlacement) >= 0;
        var len = isVertical ? "height" : "width";
        if (!arrowElement || !popperOffsets2) {
          return;
        }
        var paddingObject = toPaddingObject(options.padding, state);
        var arrowRect = getLayoutRect(arrowElement);
        var minProp = axis === "y" ? top : left;
        var maxProp = axis === "y" ? bottom : right;
        var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
        var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
        var arrowOffsetParent = getOffsetParent(arrowElement);
        var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
        var centerToReference = endDiff / 2 - startDiff / 2;
        var min2 = paddingObject[minProp];
        var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
        var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
        var offset2 = within(min2, center, max2);
        var axisProp = axis;
        state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
      }
      function effect$1(_ref2) {
        var state = _ref2.state, options = _ref2.options;
        var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
        if (arrowElement == null) {
          return;
        }
        if (typeof arrowElement === "string") {
          arrowElement = state.elements.popper.querySelector(arrowElement);
          if (!arrowElement) {
            return;
          }
        }
        if (!contains(state.elements.popper, arrowElement)) {
          return;
        }
        state.elements.arrow = arrowElement;
      }
      const arrow$1 = {
        name: "arrow",
        enabled: true,
        phase: "main",
        fn: arrow,
        effect: effect$1,
        requires: ["popperOffsets"],
        requiresIfExists: ["preventOverflow"]
      };
      function getVariation(placement) {
        return placement.split("-")[1];
      }
      var unsetSides = {
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto"
      };
      function roundOffsetsByDPR(_ref, win) {
        var x = _ref.x, y = _ref.y;
        var dpr = win.devicePixelRatio || 1;
        return {
          x: round(x * dpr) / dpr || 0,
          y: round(y * dpr) / dpr || 0
        };
      }
      function mapToStyles(_ref2) {
        var _Object$assign2;
        var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
        var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
        var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
          x,
          y
        }) : {
          x,
          y
        };
        x = _ref3.x;
        y = _ref3.y;
        var hasX = offsets.hasOwnProperty("x");
        var hasY = offsets.hasOwnProperty("y");
        var sideX = left;
        var sideY = top;
        var win = window;
        if (adaptive) {
          var offsetParent = getOffsetParent(popper2);
          var heightProp = "clientHeight";
          var widthProp = "clientWidth";
          if (offsetParent === getWindow(popper2)) {
            offsetParent = getDocumentElement(popper2);
            if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
              heightProp = "scrollHeight";
              widthProp = "scrollWidth";
            }
          }
          offsetParent = offsetParent;
          if (placement === top || (placement === left || placement === right) && variation === end) {
            sideY = bottom;
            var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
              // $FlowFixMe[prop-missing]
              offsetParent[heightProp]
            );
            y -= offsetY - popperRect.height;
            y *= gpuAcceleration ? 1 : -1;
          }
          if (placement === left || (placement === top || placement === bottom) && variation === end) {
            sideX = right;
            var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
              // $FlowFixMe[prop-missing]
              offsetParent[widthProp]
            );
            x -= offsetX - popperRect.width;
            x *= gpuAcceleration ? 1 : -1;
          }
        }
        var commonStyles = Object.assign({
          position
        }, adaptive && unsetSides);
        var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
          x,
          y
        }, getWindow(popper2)) : {
          x,
          y
        };
        x = _ref4.x;
        y = _ref4.y;
        if (gpuAcceleration) {
          var _Object$assign;
          return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
        }
        return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
      }
      function computeStyles(_ref5) {
        var state = _ref5.state, options = _ref5.options;
        var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
        var commonStyles = {
          placement: getBasePlacement$1(state.placement),
          variation: getVariation(state.placement),
          popper: state.elements.popper,
          popperRect: state.rects.popper,
          gpuAcceleration,
          isFixed: state.options.strategy === "fixed"
        };
        if (state.modifiersData.popperOffsets != null) {
          state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.popperOffsets,
            position: state.options.strategy,
            adaptive,
            roundOffsets
          })));
        }
        if (state.modifiersData.arrow != null) {
          state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
            offsets: state.modifiersData.arrow,
            position: "absolute",
            adaptive: false,
            roundOffsets
          })));
        }
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
          "data-popper-placement": state.placement
        });
      }
      const computeStyles$1 = {
        name: "computeStyles",
        enabled: true,
        phase: "beforeWrite",
        fn: computeStyles,
        data: {}
      };
      var passive = {
        passive: true
      };
      function effect(_ref) {
        var state = _ref.state, instance = _ref.instance, options = _ref.options;
        var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
        var window2 = getWindow(state.elements.popper);
        var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
        if (scroll) {
          scrollParents.forEach(function(scrollParent) {
            scrollParent.addEventListener("scroll", instance.update, passive);
          });
        }
        if (resize) {
          window2.addEventListener("resize", instance.update, passive);
        }
        return function() {
          if (scroll) {
            scrollParents.forEach(function(scrollParent) {
              scrollParent.removeEventListener("scroll", instance.update, passive);
            });
          }
          if (resize) {
            window2.removeEventListener("resize", instance.update, passive);
          }
        };
      }
      const eventListeners = {
        name: "eventListeners",
        enabled: true,
        phase: "write",
        fn: function fn() {
        },
        effect,
        data: {}
      };
      var hash$1 = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom"
      };
      function getOppositePlacement(placement) {
        return placement.replace(/left|right|bottom|top/g, function(matched) {
          return hash$1[matched];
        });
      }
      var hash = {
        start: "end",
        end: "start"
      };
      function getOppositeVariationPlacement(placement) {
        return placement.replace(/start|end/g, function(matched) {
          return hash[matched];
        });
      }
      function getWindowScroll(node) {
        var win = getWindow(node);
        var scrollLeft = win.pageXOffset;
        var scrollTop = win.pageYOffset;
        return {
          scrollLeft,
          scrollTop
        };
      }
      function getWindowScrollBarX(element) {
        return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
      }
      function getViewportRect(element, strategy) {
        var win = getWindow(element);
        var html = getDocumentElement(element);
        var visualViewport = win.visualViewport;
        var width = html.clientWidth;
        var height = html.clientHeight;
        var x = 0;
        var y = 0;
        if (visualViewport) {
          width = visualViewport.width;
          height = visualViewport.height;
          var layoutViewport = isLayoutViewport();
          if (layoutViewport || !layoutViewport && strategy === "fixed") {
            x = visualViewport.offsetLeft;
            y = visualViewport.offsetTop;
          }
        }
        return {
          width,
          height,
          x: x + getWindowScrollBarX(element),
          y
        };
      }
      function getDocumentRect(element) {
        var _element$ownerDocumen;
        var html = getDocumentElement(element);
        var winScroll = getWindowScroll(element);
        var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
        var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
        var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
        var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
        var y = -winScroll.scrollTop;
        if (getComputedStyle(body || html).direction === "rtl") {
          x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
        }
        return {
          width,
          height,
          x,
          y
        };
      }
      function isScrollParent(element) {
        var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
        return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
      }
      function getScrollParent(node) {
        if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
          return node.ownerDocument.body;
        }
        if (isHTMLElement(node) && isScrollParent(node)) {
          return node;
        }
        return getScrollParent(getParentNode(node));
      }
      function listScrollParents(element, list) {
        var _element$ownerDocumen;
        if (list === void 0) {
          list = [];
        }
        var scrollParent = getScrollParent(element);
        var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
        var win = getWindow(scrollParent);
        var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
        var updatedList = list.concat(target);
        return isBody ? updatedList : (
          // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
          updatedList.concat(listScrollParents(getParentNode(target)))
        );
      }
      function rectToClientRect(rect) {
        return Object.assign({}, rect, {
          left: rect.x,
          top: rect.y,
          right: rect.x + rect.width,
          bottom: rect.y + rect.height
        });
      }
      function getInnerBoundingClientRect(element, strategy) {
        var rect = getBoundingClientRect(element, false, strategy === "fixed");
        rect.top = rect.top + element.clientTop;
        rect.left = rect.left + element.clientLeft;
        rect.bottom = rect.top + element.clientHeight;
        rect.right = rect.left + element.clientWidth;
        rect.width = element.clientWidth;
        rect.height = element.clientHeight;
        rect.x = rect.left;
        rect.y = rect.top;
        return rect;
      }
      function getClientRectFromMixedType(element, clippingParent, strategy) {
        return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement$1(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
      }
      function getClippingParents(element) {
        var clippingParents2 = listScrollParents(getParentNode(element));
        var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
        var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
        if (!isElement$1(clipperElement)) {
          return [];
        }
        return clippingParents2.filter(function(clippingParent) {
          return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
        });
      }
      function getClippingRect(element, boundary, rootBoundary, strategy) {
        var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
        var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
        var firstClippingParent = clippingParents2[0];
        var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
          var rect = getClientRectFromMixedType(element, clippingParent, strategy);
          accRect.top = max(rect.top, accRect.top);
          accRect.right = min(rect.right, accRect.right);
          accRect.bottom = min(rect.bottom, accRect.bottom);
          accRect.left = max(rect.left, accRect.left);
          return accRect;
        }, getClientRectFromMixedType(element, firstClippingParent, strategy));
        clippingRect.width = clippingRect.right - clippingRect.left;
        clippingRect.height = clippingRect.bottom - clippingRect.top;
        clippingRect.x = clippingRect.left;
        clippingRect.y = clippingRect.top;
        return clippingRect;
      }
      function computeOffsets(_ref) {
        var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
        var basePlacement = placement ? getBasePlacement$1(placement) : null;
        var variation = placement ? getVariation(placement) : null;
        var commonX = reference2.x + reference2.width / 2 - element.width / 2;
        var commonY = reference2.y + reference2.height / 2 - element.height / 2;
        var offsets;
        switch (basePlacement) {
          case top:
            offsets = {
              x: commonX,
              y: reference2.y - element.height
            };
            break;
          case bottom:
            offsets = {
              x: commonX,
              y: reference2.y + reference2.height
            };
            break;
          case right:
            offsets = {
              x: reference2.x + reference2.width,
              y: commonY
            };
            break;
          case left:
            offsets = {
              x: reference2.x - element.width,
              y: commonY
            };
            break;
          default:
            offsets = {
              x: reference2.x,
              y: reference2.y
            };
        }
        var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
        if (mainAxis != null) {
          var len = mainAxis === "y" ? "height" : "width";
          switch (variation) {
            case start:
              offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
              break;
            case end:
              offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
              break;
          }
        }
        return offsets;
      }
      function detectOverflow(state, options) {
        if (options === void 0) {
          options = {};
        }
        var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
        var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
        var altContext = elementContext === popper ? reference : popper;
        var popperRect = state.rects.popper;
        var element = state.elements[altBoundary ? altContext : elementContext];
        var clippingClientRect = getClippingRect(isElement$1(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
        var referenceClientRect = getBoundingClientRect(state.elements.reference);
        var popperOffsets2 = computeOffsets({
          reference: referenceClientRect,
          element: popperRect,
          placement
        });
        var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
        var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
        var overflowOffsets = {
          top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
          bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
          left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
          right: elementClientRect.right - clippingClientRect.right + paddingObject.right
        };
        var offsetData = state.modifiersData.offset;
        if (elementContext === popper && offsetData) {
          var offset2 = offsetData[placement];
          Object.keys(overflowOffsets).forEach(function(key) {
            var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
            var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
            overflowOffsets[key] += offset2[axis] * multiply;
          });
        }
        return overflowOffsets;
      }
      function computeAutoPlacement(state, options) {
        if (options === void 0) {
          options = {};
        }
        var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
        var variation = getVariation(placement);
        var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
          return getVariation(placement2) === variation;
        }) : basePlacements;
        var allowedPlacements = placements$1.filter(function(placement2) {
          return allowedAutoPlacements.indexOf(placement2) >= 0;
        });
        if (allowedPlacements.length === 0) {
          allowedPlacements = placements$1;
        }
        var overflows = allowedPlacements.reduce(function(acc, placement2) {
          acc[placement2] = detectOverflow(state, {
            placement: placement2,
            boundary,
            rootBoundary,
            padding
          })[getBasePlacement$1(placement2)];
          return acc;
        }, {});
        return Object.keys(overflows).sort(function(a, b) {
          return overflows[a] - overflows[b];
        });
      }
      function getExpandedFallbackPlacements(placement) {
        if (getBasePlacement$1(placement) === auto) {
          return [];
        }
        var oppositePlacement = getOppositePlacement(placement);
        return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
      }
      function flip(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        if (state.modifiersData[name]._skip) {
          return;
        }
        var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
        var preferredPlacement = state.options.placement;
        var basePlacement = getBasePlacement$1(preferredPlacement);
        var isBasePlacement = basePlacement === preferredPlacement;
        var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
        var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
          return acc.concat(getBasePlacement$1(placement2) === auto ? computeAutoPlacement(state, {
            placement: placement2,
            boundary,
            rootBoundary,
            padding,
            flipVariations,
            allowedAutoPlacements
          }) : placement2);
        }, []);
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var checksMap = /* @__PURE__ */ new Map();
        var makeFallbackChecks = true;
        var firstFittingPlacement = placements2[0];
        for (var i = 0; i < placements2.length; i++) {
          var placement = placements2[i];
          var _basePlacement = getBasePlacement$1(placement);
          var isStartVariation = getVariation(placement) === start;
          var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
          var len = isVertical ? "width" : "height";
          var overflow = detectOverflow(state, {
            placement,
            boundary,
            rootBoundary,
            altBoundary,
            padding
          });
          var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
          if (referenceRect[len] > popperRect[len]) {
            mainVariationSide = getOppositePlacement(mainVariationSide);
          }
          var altVariationSide = getOppositePlacement(mainVariationSide);
          var checks = [];
          if (checkMainAxis) {
            checks.push(overflow[_basePlacement] <= 0);
          }
          if (checkAltAxis) {
            checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
          }
          if (checks.every(function(check) {
            return check;
          })) {
            firstFittingPlacement = placement;
            makeFallbackChecks = false;
            break;
          }
          checksMap.set(placement, checks);
        }
        if (makeFallbackChecks) {
          var numberOfChecks = flipVariations ? 3 : 1;
          var _loop = function _loop2(_i2) {
            var fittingPlacement = placements2.find(function(placement2) {
              var checks2 = checksMap.get(placement2);
              if (checks2) {
                return checks2.slice(0, _i2).every(function(check) {
                  return check;
                });
              }
            });
            if (fittingPlacement) {
              firstFittingPlacement = fittingPlacement;
              return "break";
            }
          };
          for (var _i = numberOfChecks; _i > 0; _i--) {
            var _ret = _loop(_i);
            if (_ret === "break") break;
          }
        }
        if (state.placement !== firstFittingPlacement) {
          state.modifiersData[name]._skip = true;
          state.placement = firstFittingPlacement;
          state.reset = true;
        }
      }
      const flip$1 = {
        name: "flip",
        enabled: true,
        phase: "main",
        fn: flip,
        requiresIfExists: ["offset"],
        data: {
          _skip: false
        }
      };
      function getSideOffsets(overflow, rect, preventedOffsets) {
        if (preventedOffsets === void 0) {
          preventedOffsets = {
            x: 0,
            y: 0
          };
        }
        return {
          top: overflow.top - rect.height - preventedOffsets.y,
          right: overflow.right - rect.width + preventedOffsets.x,
          bottom: overflow.bottom - rect.height + preventedOffsets.y,
          left: overflow.left - rect.width - preventedOffsets.x
        };
      }
      function isAnySideFullyClipped(overflow) {
        return [top, right, bottom, left].some(function(side) {
          return overflow[side] >= 0;
        });
      }
      function hide(_ref) {
        var state = _ref.state, name = _ref.name;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var preventedOffsets = state.modifiersData.preventOverflow;
        var referenceOverflow = detectOverflow(state, {
          elementContext: "reference"
        });
        var popperAltOverflow = detectOverflow(state, {
          altBoundary: true
        });
        var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
        var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
        var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
        var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
        state.modifiersData[name] = {
          referenceClippingOffsets,
          popperEscapeOffsets,
          isReferenceHidden,
          hasPopperEscaped
        };
        state.attributes.popper = Object.assign({}, state.attributes.popper, {
          "data-popper-reference-hidden": isReferenceHidden,
          "data-popper-escaped": hasPopperEscaped
        });
      }
      const hide$1 = {
        name: "hide",
        enabled: true,
        phase: "main",
        requiresIfExists: ["preventOverflow"],
        fn: hide
      };
      function distanceAndSkiddingToXY(placement, rects, offset2) {
        var basePlacement = getBasePlacement$1(placement);
        var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
        var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
          placement
        })) : offset2, skidding = _ref[0], distance = _ref[1];
        skidding = skidding || 0;
        distance = (distance || 0) * invertDistance;
        return [left, right].indexOf(basePlacement) >= 0 ? {
          x: distance,
          y: skidding
        } : {
          x: skidding,
          y: distance
        };
      }
      function offset(_ref2) {
        var state = _ref2.state, options = _ref2.options, name = _ref2.name;
        var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
        var data = placements.reduce(function(acc, placement) {
          acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
          return acc;
        }, {});
        var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
        if (state.modifiersData.popperOffsets != null) {
          state.modifiersData.popperOffsets.x += x;
          state.modifiersData.popperOffsets.y += y;
        }
        state.modifiersData[name] = data;
      }
      const offset$1 = {
        name: "offset",
        enabled: true,
        phase: "main",
        requires: ["popperOffsets"],
        fn: offset
      };
      function popperOffsets(_ref) {
        var state = _ref.state, name = _ref.name;
        state.modifiersData[name] = computeOffsets({
          reference: state.rects.reference,
          element: state.rects.popper,
          placement: state.placement
        });
      }
      const popperOffsets$1 = {
        name: "popperOffsets",
        enabled: true,
        phase: "read",
        fn: popperOffsets,
        data: {}
      };
      function getAltAxis(axis) {
        return axis === "x" ? "y" : "x";
      }
      function preventOverflow(_ref) {
        var state = _ref.state, options = _ref.options, name = _ref.name;
        var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
        var overflow = detectOverflow(state, {
          boundary,
          rootBoundary,
          padding,
          altBoundary
        });
        var basePlacement = getBasePlacement$1(state.placement);
        var variation = getVariation(state.placement);
        var isBasePlacement = !variation;
        var mainAxis = getMainAxisFromPlacement(basePlacement);
        var altAxis = getAltAxis(mainAxis);
        var popperOffsets2 = state.modifiersData.popperOffsets;
        var referenceRect = state.rects.reference;
        var popperRect = state.rects.popper;
        var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
          placement: state.placement
        })) : tetherOffset;
        var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
          mainAxis: tetherOffsetValue,
          altAxis: tetherOffsetValue
        } : Object.assign({
          mainAxis: 0,
          altAxis: 0
        }, tetherOffsetValue);
        var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
        var data = {
          x: 0,
          y: 0
        };
        if (!popperOffsets2) {
          return;
        }
        if (checkMainAxis) {
          var _offsetModifierState$;
          var mainSide = mainAxis === "y" ? top : left;
          var altSide = mainAxis === "y" ? bottom : right;
          var len = mainAxis === "y" ? "height" : "width";
          var offset2 = popperOffsets2[mainAxis];
          var min$1 = offset2 + overflow[mainSide];
          var max$1 = offset2 - overflow[altSide];
          var additive = tether ? -popperRect[len] / 2 : 0;
          var minLen = variation === start ? referenceRect[len] : popperRect[len];
          var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
          var arrowElement = state.elements.arrow;
          var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
            width: 0,
            height: 0
          };
          var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
          var arrowPaddingMin = arrowPaddingObject[mainSide];
          var arrowPaddingMax = arrowPaddingObject[altSide];
          var arrowLen = within(0, referenceRect[len], arrowRect[len]);
          var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
          var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
          var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
          var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
          var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
          var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
          var tetherMax = offset2 + maxOffset - offsetModifierValue;
          var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset2, tether ? max(max$1, tetherMax) : max$1);
          popperOffsets2[mainAxis] = preventedOffset;
          data[mainAxis] = preventedOffset - offset2;
        }
        if (checkAltAxis) {
          var _offsetModifierState$2;
          var _mainSide = mainAxis === "x" ? top : left;
          var _altSide = mainAxis === "x" ? bottom : right;
          var _offset = popperOffsets2[altAxis];
          var _len = altAxis === "y" ? "height" : "width";
          var _min = _offset + overflow[_mainSide];
          var _max = _offset - overflow[_altSide];
          var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
          var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
          var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
          var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
          var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
          popperOffsets2[altAxis] = _preventedOffset;
          data[altAxis] = _preventedOffset - _offset;
        }
        state.modifiersData[name] = data;
      }
      const preventOverflow$1 = {
        name: "preventOverflow",
        enabled: true,
        phase: "main",
        fn: preventOverflow,
        requiresIfExists: ["offset"]
      };
      function getHTMLElementScroll(element) {
        return {
          scrollLeft: element.scrollLeft,
          scrollTop: element.scrollTop
        };
      }
      function getNodeScroll(node) {
        if (node === getWindow(node) || !isHTMLElement(node)) {
          return getWindowScroll(node);
        } else {
          return getHTMLElementScroll(node);
        }
      }
      function isElementScaled(element) {
        var rect = element.getBoundingClientRect();
        var scaleX = round(rect.width) / element.offsetWidth || 1;
        var scaleY = round(rect.height) / element.offsetHeight || 1;
        return scaleX !== 1 || scaleY !== 1;
      }
      function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
        if (isFixed === void 0) {
          isFixed = false;
        }
        var isOffsetParentAnElement = isHTMLElement(offsetParent);
        var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
        var documentElement = getDocumentElement(offsetParent);
        var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
        var scroll = {
          scrollLeft: 0,
          scrollTop: 0
        };
        var offsets = {
          x: 0,
          y: 0
        };
        if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
          if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
          isScrollParent(documentElement)) {
            scroll = getNodeScroll(offsetParent);
          }
          if (isHTMLElement(offsetParent)) {
            offsets = getBoundingClientRect(offsetParent, true);
            offsets.x += offsetParent.clientLeft;
            offsets.y += offsetParent.clientTop;
          } else if (documentElement) {
            offsets.x = getWindowScrollBarX(documentElement);
          }
        }
        return {
          x: rect.left + scroll.scrollLeft - offsets.x,
          y: rect.top + scroll.scrollTop - offsets.y,
          width: rect.width,
          height: rect.height
        };
      }
      function order(modifiers) {
        var map = /* @__PURE__ */ new Map();
        var visited = /* @__PURE__ */ new Set();
        var result = [];
        modifiers.forEach(function(modifier) {
          map.set(modifier.name, modifier);
        });
        function sort(modifier) {
          visited.add(modifier.name);
          var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
          requires.forEach(function(dep) {
            if (!visited.has(dep)) {
              var depModifier = map.get(dep);
              if (depModifier) {
                sort(depModifier);
              }
            }
          });
          result.push(modifier);
        }
        modifiers.forEach(function(modifier) {
          if (!visited.has(modifier.name)) {
            sort(modifier);
          }
        });
        return result;
      }
      function orderModifiers(modifiers) {
        var orderedModifiers = order(modifiers);
        return modifierPhases.reduce(function(acc, phase) {
          return acc.concat(orderedModifiers.filter(function(modifier) {
            return modifier.phase === phase;
          }));
        }, []);
      }
      function debounce$1(fn2) {
        var pending;
        return function() {
          if (!pending) {
            pending = new Promise(function(resolve) {
              Promise.resolve().then(function() {
                pending = void 0;
                resolve(fn2());
              });
            });
          }
          return pending;
        };
      }
      function mergeByName(modifiers) {
        var merged = modifiers.reduce(function(merged2, current) {
          var existing = merged2[current.name];
          merged2[current.name] = existing ? Object.assign({}, existing, current, {
            options: Object.assign({}, existing.options, current.options),
            data: Object.assign({}, existing.data, current.data)
          }) : current;
          return merged2;
        }, {});
        return Object.keys(merged).map(function(key) {
          return merged[key];
        });
      }
      var DEFAULT_OPTIONS = {
        placement: "bottom",
        modifiers: [],
        strategy: "absolute"
      };
      function areValidElements() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return !args.some(function(element) {
          return !(element && typeof element.getBoundingClientRect === "function");
        });
      }
      function popperGenerator(generatorOptions) {
        if (generatorOptions === void 0) {
          generatorOptions = {};
        }
        var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
        return function createPopper2(reference2, popper2, options) {
          if (options === void 0) {
            options = defaultOptions;
          }
          var state = {
            placement: "bottom",
            orderedModifiers: [],
            options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
            modifiersData: {},
            elements: {
              reference: reference2,
              popper: popper2
            },
            attributes: {},
            styles: {}
          };
          var effectCleanupFns = [];
          var isDestroyed = false;
          var instance = {
            state,
            setOptions: function setOptions(setOptionsAction) {
              var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
              cleanupModifierEffects();
              state.options = Object.assign({}, defaultOptions, state.options, options2);
              state.scrollParents = {
                reference: isElement$1(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
                popper: listScrollParents(popper2)
              };
              var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
              state.orderedModifiers = orderedModifiers.filter(function(m) {
                return m.enabled;
              });
              runModifierEffects();
              return instance.update();
            },
            // Sync update – it will always be executed, even if not necessary. This
            // is useful for low frequency updates where sync behavior simplifies the
            // logic.
            // For high frequency updates (e.g. `resize` and `scroll` events), always
            // prefer the async Popper#update method
            forceUpdate: function forceUpdate() {
              if (isDestroyed) {
                return;
              }
              var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
              if (!areValidElements(reference3, popper3)) {
                return;
              }
              state.rects = {
                reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
                popper: getLayoutRect(popper3)
              };
              state.reset = false;
              state.placement = state.options.placement;
              state.orderedModifiers.forEach(function(modifier) {
                return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
              });
              for (var index = 0; index < state.orderedModifiers.length; index++) {
                if (state.reset === true) {
                  state.reset = false;
                  index = -1;
                  continue;
                }
                var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
                if (typeof fn2 === "function") {
                  state = fn2({
                    state,
                    options: _options,
                    name,
                    instance
                  }) || state;
                }
              }
            },
            // Async and optimistically optimized update – it will not be executed if
            // not necessary (debounced to run at most once-per-tick)
            update: debounce$1(function() {
              return new Promise(function(resolve) {
                instance.forceUpdate();
                resolve(state);
              });
            }),
            destroy: function destroy() {
              cleanupModifierEffects();
              isDestroyed = true;
            }
          };
          if (!areValidElements(reference2, popper2)) {
            return instance;
          }
          instance.setOptions(options).then(function(state2) {
            if (!isDestroyed && options.onFirstUpdate) {
              options.onFirstUpdate(state2);
            }
          });
          function runModifierEffects() {
            state.orderedModifiers.forEach(function(_ref) {
              var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect3 = _ref.effect;
              if (typeof effect3 === "function") {
                var cleanupFn = effect3({
                  state,
                  name,
                  instance,
                  options: options2
                });
                var noopFn = function noopFn2() {
                };
                effectCleanupFns.push(cleanupFn || noopFn);
              }
            });
          }
          function cleanupModifierEffects() {
            effectCleanupFns.forEach(function(fn2) {
              return fn2();
            });
            effectCleanupFns = [];
          }
          return instance;
        };
      }
      var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
      var createPopper = /* @__PURE__ */ popperGenerator({
        defaultModifiers
      });
      var BOX_CLASS = "tippy-box";
      var CONTENT_CLASS = "tippy-content";
      var BACKDROP_CLASS = "tippy-backdrop";
      var ARROW_CLASS = "tippy-arrow";
      var SVG_ARROW_CLASS = "tippy-svg-arrow";
      var TOUCH_OPTIONS = {
        passive: true,
        capture: true
      };
      var TIPPY_DEFAULT_APPEND_TO = function TIPPY_DEFAULT_APPEND_TO2() {
        return document.body;
      };
      function getValueAtIndexOrReturn(value, index, defaultValue) {
        if (Array.isArray(value)) {
          var v = value[index];
          return v == null ? Array.isArray(defaultValue) ? defaultValue[index] : defaultValue : v;
        }
        return value;
      }
      function isType(value, type) {
        var str = {}.toString.call(value);
        return str.indexOf("[object") === 0 && str.indexOf(type + "]") > -1;
      }
      function invokeWithArgsOrReturn(value, args) {
        return typeof value === "function" ? value.apply(void 0, args) : value;
      }
      function debounce(fn5, ms) {
        if (ms === 0) {
          return fn5;
        }
        var timeout;
        return function(arg) {
          clearTimeout(timeout);
          timeout = setTimeout(function() {
            fn5(arg);
          }, ms);
        };
      }
      function splitBySpaces(value) {
        return value.split(/\s+/).filter(Boolean);
      }
      function normalizeToArray(value) {
        return [].concat(value);
      }
      function pushIfUnique(arr, value) {
        if (arr.indexOf(value) === -1) {
          arr.push(value);
        }
      }
      function unique(arr) {
        return arr.filter(function(item, index) {
          return arr.indexOf(item) === index;
        });
      }
      function getBasePlacement(placement) {
        return placement.split("-")[0];
      }
      function arrayFrom(value) {
        return [].slice.call(value);
      }
      function removeUndefinedProps(obj) {
        return Object.keys(obj).reduce(function(acc, key) {
          if (obj[key] !== void 0) {
            acc[key] = obj[key];
          }
          return acc;
        }, {});
      }
      function div() {
        return document.createElement("div");
      }
      function isElement(value) {
        return ["Element", "Fragment"].some(function(type) {
          return isType(value, type);
        });
      }
      function isNodeList(value) {
        return isType(value, "NodeList");
      }
      function isMouseEvent(value) {
        return isType(value, "MouseEvent");
      }
      function isReferenceElement(value) {
        return !!(value && value._tippy && value._tippy.reference === value);
      }
      function getArrayOfElements(value) {
        if (isElement(value)) {
          return [value];
        }
        if (isNodeList(value)) {
          return arrayFrom(value);
        }
        if (Array.isArray(value)) {
          return value;
        }
        return arrayFrom(document.querySelectorAll(value));
      }
      function setTransitionDuration(els, value) {
        els.forEach(function(el) {
          if (el) {
            el.style.transitionDuration = value + "ms";
          }
        });
      }
      function setVisibilityState(els, state) {
        els.forEach(function(el) {
          if (el) {
            el.setAttribute("data-state", state);
          }
        });
      }
      function getOwnerDocument(elementOrElements) {
        var _element$ownerDocumen;
        var _normalizeToArray = normalizeToArray(elementOrElements), element = _normalizeToArray[0];
        return element != null && (_element$ownerDocumen = element.ownerDocument) != null && _element$ownerDocumen.body ? element.ownerDocument : document;
      }
      function isCursorOutsideInteractiveBorder(popperTreeData, event) {
        var clientX = event.clientX, clientY = event.clientY;
        return popperTreeData.every(function(_ref) {
          var popperRect = _ref.popperRect, popperState = _ref.popperState, props = _ref.props;
          var interactiveBorder = props.interactiveBorder;
          var basePlacement = getBasePlacement(popperState.placement);
          var offsetData = popperState.modifiersData.offset;
          if (!offsetData) {
            return true;
          }
          var topDistance = basePlacement === "bottom" ? offsetData.top.y : 0;
          var bottomDistance = basePlacement === "top" ? offsetData.bottom.y : 0;
          var leftDistance = basePlacement === "right" ? offsetData.left.x : 0;
          var rightDistance = basePlacement === "left" ? offsetData.right.x : 0;
          var exceedsTop = popperRect.top - clientY + topDistance > interactiveBorder;
          var exceedsBottom = clientY - popperRect.bottom - bottomDistance > interactiveBorder;
          var exceedsLeft = popperRect.left - clientX + leftDistance > interactiveBorder;
          var exceedsRight = clientX - popperRect.right - rightDistance > interactiveBorder;
          return exceedsTop || exceedsBottom || exceedsLeft || exceedsRight;
        });
      }
      function updateTransitionEndListener(box, action, listener) {
        var method = action + "EventListener";
        ["transitionend", "webkitTransitionEnd"].forEach(function(event) {
          box[method](event, listener);
        });
      }
      function actualContains(parent, child) {
        var target = child;
        while (target) {
          var _target$getRootNode;
          if (parent.contains(target)) {
            return true;
          }
          target = target.getRootNode == null ? void 0 : (_target$getRootNode = target.getRootNode()) == null ? void 0 : _target$getRootNode.host;
        }
        return false;
      }
      var currentInput = {
        isTouch: false
      };
      var lastMouseMoveTime = 0;
      function onDocumentTouchStart() {
        if (currentInput.isTouch) {
          return;
        }
        currentInput.isTouch = true;
        if (window.performance) {
          document.addEventListener("mousemove", onDocumentMouseMove);
        }
      }
      function onDocumentMouseMove() {
        var now = performance.now();
        if (now - lastMouseMoveTime < 20) {
          currentInput.isTouch = false;
          document.removeEventListener("mousemove", onDocumentMouseMove);
        }
        lastMouseMoveTime = now;
      }
      function onWindowBlur() {
        var activeElement = document.activeElement;
        if (isReferenceElement(activeElement)) {
          var instance = activeElement._tippy;
          if (activeElement.blur && !instance.state.isVisible) {
            activeElement.blur();
          }
        }
      }
      function bindGlobalEventListeners() {
        document.addEventListener("touchstart", onDocumentTouchStart, TOUCH_OPTIONS);
        window.addEventListener("blur", onWindowBlur);
      }
      var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
      var isIE11 = isBrowser ? (
        // @ts-ignore
        !!window.msCrypto
      ) : false;
      var pluginProps = {
        animateFill: false,
        followCursor: false,
        inlinePositioning: false,
        sticky: false
      };
      var renderProps = {
        allowHTML: false,
        animation: "fade",
        arrow: true,
        content: "",
        inertia: false,
        maxWidth: 350,
        role: "tooltip",
        theme: "",
        zIndex: 9999
      };
      var defaultProps = Object.assign({
        appendTo: TIPPY_DEFAULT_APPEND_TO,
        aria: {
          content: "auto",
          expanded: "auto"
        },
        delay: 0,
        duration: [300, 250],
        getReferenceClientRect: null,
        hideOnClick: true,
        ignoreAttributes: false,
        interactive: false,
        interactiveBorder: 2,
        interactiveDebounce: 0,
        moveTransition: "",
        offset: [0, 10],
        onAfterUpdate: function onAfterUpdate() {
        },
        onBeforeUpdate: function onBeforeUpdate() {
        },
        onCreate: function onCreate() {
        },
        onDestroy: function onDestroy() {
        },
        onHidden: function onHidden() {
        },
        onHide: function onHide() {
        },
        onMount: function onMount() {
        },
        onShow: function onShow() {
        },
        onShown: function onShown() {
        },
        onTrigger: function onTrigger() {
        },
        onUntrigger: function onUntrigger() {
        },
        onClickOutside: function onClickOutside() {
        },
        placement: "top",
        plugins: [],
        popperOptions: {},
        render: null,
        showOnCreate: false,
        touch: true,
        trigger: "mouseenter focus",
        triggerTarget: null
      }, pluginProps, renderProps);
      var defaultKeys = Object.keys(defaultProps);
      var setDefaultProps = function setDefaultProps2(partialProps) {
        var keys = Object.keys(partialProps);
        keys.forEach(function(key) {
          defaultProps[key] = partialProps[key];
        });
      };
      function getExtendedPassedProps(passedProps) {
        var plugins = passedProps.plugins || [];
        var pluginProps2 = plugins.reduce(function(acc, plugin) {
          var name = plugin.name, defaultValue = plugin.defaultValue;
          if (name) {
            var _name;
            acc[name] = passedProps[name] !== void 0 ? passedProps[name] : (_name = defaultProps[name]) != null ? _name : defaultValue;
          }
          return acc;
        }, {});
        return Object.assign({}, passedProps, pluginProps2);
      }
      function getDataAttributeProps(reference2, plugins) {
        var propKeys = plugins ? Object.keys(getExtendedPassedProps(Object.assign({}, defaultProps, {
          plugins
        }))) : defaultKeys;
        var props = propKeys.reduce(function(acc, key) {
          var valueAsString = (reference2.getAttribute("data-tippy-" + key) || "").trim();
          if (!valueAsString) {
            return acc;
          }
          if (key === "content") {
            acc[key] = valueAsString;
          } else {
            try {
              acc[key] = JSON.parse(valueAsString);
            } catch (e) {
              acc[key] = valueAsString;
            }
          }
          return acc;
        }, {});
        return props;
      }
      function evaluateProps(reference2, props) {
        var out = Object.assign({}, props, {
          content: invokeWithArgsOrReturn(props.content, [reference2])
        }, props.ignoreAttributes ? {} : getDataAttributeProps(reference2, props.plugins));
        out.aria = Object.assign({}, defaultProps.aria, out.aria);
        out.aria = {
          expanded: out.aria.expanded === "auto" ? props.interactive : out.aria.expanded,
          content: out.aria.content === "auto" ? props.interactive ? null : "describedby" : out.aria.content
        };
        return out;
      }
      var innerHTML = function innerHTML2() {
        return "innerHTML";
      };
      function dangerouslySetInnerHTML(element, html) {
        element[innerHTML()] = html;
      }
      function createArrowElement(value) {
        var arrow2 = div();
        if (value === true) {
          arrow2.className = ARROW_CLASS;
        } else {
          arrow2.className = SVG_ARROW_CLASS;
          if (isElement(value)) {
            arrow2.appendChild(value);
          } else {
            dangerouslySetInnerHTML(arrow2, value);
          }
        }
        return arrow2;
      }
      function setContent(content, props) {
        if (isElement(props.content)) {
          dangerouslySetInnerHTML(content, "");
          content.appendChild(props.content);
        } else if (typeof props.content !== "function") {
          if (props.allowHTML) {
            dangerouslySetInnerHTML(content, props.content);
          } else {
            content.textContent = props.content;
          }
        }
      }
      function getChildren(popper2) {
        var box = popper2.firstElementChild;
        var boxChildren = arrayFrom(box.children);
        return {
          box,
          content: boxChildren.find(function(node) {
            return node.classList.contains(CONTENT_CLASS);
          }),
          arrow: boxChildren.find(function(node) {
            return node.classList.contains(ARROW_CLASS) || node.classList.contains(SVG_ARROW_CLASS);
          }),
          backdrop: boxChildren.find(function(node) {
            return node.classList.contains(BACKDROP_CLASS);
          })
        };
      }
      function render(instance) {
        var popper2 = div();
        var box = div();
        box.className = BOX_CLASS;
        box.setAttribute("data-state", "hidden");
        box.setAttribute("tabindex", "-1");
        var content = div();
        content.className = CONTENT_CLASS;
        content.setAttribute("data-state", "hidden");
        setContent(content, instance.props);
        popper2.appendChild(box);
        box.appendChild(content);
        onUpdate(instance.props, instance.props);
        function onUpdate(prevProps, nextProps) {
          var _getChildren = getChildren(popper2), box2 = _getChildren.box, content2 = _getChildren.content, arrow2 = _getChildren.arrow;
          if (nextProps.theme) {
            box2.setAttribute("data-theme", nextProps.theme);
          } else {
            box2.removeAttribute("data-theme");
          }
          if (typeof nextProps.animation === "string") {
            box2.setAttribute("data-animation", nextProps.animation);
          } else {
            box2.removeAttribute("data-animation");
          }
          if (nextProps.inertia) {
            box2.setAttribute("data-inertia", "");
          } else {
            box2.removeAttribute("data-inertia");
          }
          box2.style.maxWidth = typeof nextProps.maxWidth === "number" ? nextProps.maxWidth + "px" : nextProps.maxWidth;
          if (nextProps.role) {
            box2.setAttribute("role", nextProps.role);
          } else {
            box2.removeAttribute("role");
          }
          if (prevProps.content !== nextProps.content || prevProps.allowHTML !== nextProps.allowHTML) {
            setContent(content2, instance.props);
          }
          if (nextProps.arrow) {
            if (!arrow2) {
              box2.appendChild(createArrowElement(nextProps.arrow));
            } else if (prevProps.arrow !== nextProps.arrow) {
              box2.removeChild(arrow2);
              box2.appendChild(createArrowElement(nextProps.arrow));
            }
          } else if (arrow2) {
            box2.removeChild(arrow2);
          }
        }
        return {
          popper: popper2,
          onUpdate
        };
      }
      render.$$tippy = true;
      var idCounter = 1;
      var mouseMoveListeners = [];
      var mountedInstances = [];
      function createTippy(reference2, passedProps) {
        var props = evaluateProps(reference2, Object.assign({}, defaultProps, getExtendedPassedProps(removeUndefinedProps(passedProps))));
        var showTimeout;
        var hideTimeout;
        var scheduleHideAnimationFrame;
        var isVisibleFromClick = false;
        var didHideDueToDocumentMouseDown = false;
        var didTouchMove = false;
        var ignoreOnFirstUpdate = false;
        var lastTriggerEvent;
        var currentTransitionEndListener;
        var onFirstUpdate;
        var listeners = [];
        var debouncedOnMouseMove = debounce(onMouseMove, props.interactiveDebounce);
        var currentTarget;
        var id = idCounter++;
        var popperInstance = null;
        var plugins = unique(props.plugins);
        var state = {
          // Is the instance currently enabled?
          isEnabled: true,
          // Is the tippy currently showing and not transitioning out?
          isVisible: false,
          // Has the instance been destroyed?
          isDestroyed: false,
          // Is the tippy currently mounted to the DOM?
          isMounted: false,
          // Has the tippy finished transitioning in?
          isShown: false
        };
        var instance = {
          // properties
          id,
          reference: reference2,
          popper: div(),
          popperInstance,
          props,
          state,
          plugins,
          // methods
          clearDelayTimeouts,
          setProps,
          setContent: setContent2,
          show,
          hide: hide2,
          hideWithInteractivity,
          enable,
          disable,
          unmount,
          destroy
        };
        if (!props.render) {
          return instance;
        }
        var _props$render = props.render(instance), popper2 = _props$render.popper, onUpdate = _props$render.onUpdate;
        popper2.setAttribute("data-tippy-root", "");
        popper2.id = "tippy-" + instance.id;
        instance.popper = popper2;
        reference2._tippy = instance;
        popper2._tippy = instance;
        var pluginsHooks = plugins.map(function(plugin) {
          return plugin.fn(instance);
        });
        var hasAriaExpanded = reference2.hasAttribute("aria-expanded");
        addListeners();
        handleAriaExpandedAttribute();
        handleStyles();
        invokeHook("onCreate", [instance]);
        if (props.showOnCreate) {
          scheduleShow();
        }
        popper2.addEventListener("mouseenter", function() {
          if (instance.props.interactive && instance.state.isVisible) {
            instance.clearDelayTimeouts();
          }
        });
        popper2.addEventListener("mouseleave", function() {
          if (instance.props.interactive && instance.props.trigger.indexOf("mouseenter") >= 0) {
            getDocument().addEventListener("mousemove", debouncedOnMouseMove);
          }
        });
        return instance;
        function getNormalizedTouchSettings() {
          var touch = instance.props.touch;
          return Array.isArray(touch) ? touch : [touch, 0];
        }
        function getIsCustomTouchBehavior() {
          return getNormalizedTouchSettings()[0] === "hold";
        }
        function getIsDefaultRenderFn() {
          var _instance$props$rende;
          return !!((_instance$props$rende = instance.props.render) != null && _instance$props$rende.$$tippy);
        }
        function getCurrentTarget() {
          return currentTarget || reference2;
        }
        function getDocument() {
          var parent = getCurrentTarget().parentNode;
          return parent ? getOwnerDocument(parent) : document;
        }
        function getDefaultTemplateChildren() {
          return getChildren(popper2);
        }
        function getDelay(isShow) {
          if (instance.state.isMounted && !instance.state.isVisible || currentInput.isTouch || lastTriggerEvent && lastTriggerEvent.type === "focus") {
            return 0;
          }
          return getValueAtIndexOrReturn(instance.props.delay, isShow ? 0 : 1, defaultProps.delay);
        }
        function handleStyles(fromHide) {
          if (fromHide === void 0) {
            fromHide = false;
          }
          popper2.style.pointerEvents = instance.props.interactive && !fromHide ? "" : "none";
          popper2.style.zIndex = "" + instance.props.zIndex;
        }
        function invokeHook(hook, args, shouldInvokePropsHook) {
          if (shouldInvokePropsHook === void 0) {
            shouldInvokePropsHook = true;
          }
          pluginsHooks.forEach(function(pluginHooks) {
            if (pluginHooks[hook]) {
              pluginHooks[hook].apply(pluginHooks, args);
            }
          });
          if (shouldInvokePropsHook) {
            var _instance$props;
            (_instance$props = instance.props)[hook].apply(_instance$props, args);
          }
        }
        function handleAriaContentAttribute() {
          var aria = instance.props.aria;
          if (!aria.content) {
            return;
          }
          var attr = "aria-" + aria.content;
          var id2 = popper2.id;
          var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
          nodes.forEach(function(node) {
            var currentValue = node.getAttribute(attr);
            if (instance.state.isVisible) {
              node.setAttribute(attr, currentValue ? currentValue + " " + id2 : id2);
            } else {
              var nextValue = currentValue && currentValue.replace(id2, "").trim();
              if (nextValue) {
                node.setAttribute(attr, nextValue);
              } else {
                node.removeAttribute(attr);
              }
            }
          });
        }
        function handleAriaExpandedAttribute() {
          if (hasAriaExpanded || !instance.props.aria.expanded) {
            return;
          }
          var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
          nodes.forEach(function(node) {
            if (instance.props.interactive) {
              node.setAttribute("aria-expanded", instance.state.isVisible && node === getCurrentTarget() ? "true" : "false");
            } else {
              node.removeAttribute("aria-expanded");
            }
          });
        }
        function cleanupInteractiveMouseListeners() {
          getDocument().removeEventListener("mousemove", debouncedOnMouseMove);
          mouseMoveListeners = mouseMoveListeners.filter(function(listener) {
            return listener !== debouncedOnMouseMove;
          });
        }
        function onDocumentPress(event) {
          if (currentInput.isTouch) {
            if (didTouchMove || event.type === "mousedown") {
              return;
            }
          }
          var actualTarget = event.composedPath && event.composedPath()[0] || event.target;
          if (instance.props.interactive && actualContains(popper2, actualTarget)) {
            return;
          }
          if (normalizeToArray(instance.props.triggerTarget || reference2).some(function(el) {
            return actualContains(el, actualTarget);
          })) {
            if (currentInput.isTouch) {
              return;
            }
            if (instance.state.isVisible && instance.props.trigger.indexOf("click") >= 0) {
              return;
            }
          } else {
            invokeHook("onClickOutside", [instance, event]);
          }
          if (instance.props.hideOnClick === true) {
            instance.clearDelayTimeouts();
            instance.hide();
            didHideDueToDocumentMouseDown = true;
            setTimeout(function() {
              didHideDueToDocumentMouseDown = false;
            });
            if (!instance.state.isMounted) {
              removeDocumentPress();
            }
          }
        }
        function onTouchMove() {
          didTouchMove = true;
        }
        function onTouchStart() {
          didTouchMove = false;
        }
        function addDocumentPress() {
          var doc = getDocument();
          doc.addEventListener("mousedown", onDocumentPress, true);
          doc.addEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
          doc.addEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
          doc.addEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
        }
        function removeDocumentPress() {
          var doc = getDocument();
          doc.removeEventListener("mousedown", onDocumentPress, true);
          doc.removeEventListener("touchend", onDocumentPress, TOUCH_OPTIONS);
          doc.removeEventListener("touchstart", onTouchStart, TOUCH_OPTIONS);
          doc.removeEventListener("touchmove", onTouchMove, TOUCH_OPTIONS);
        }
        function onTransitionedOut(duration, callback) {
          onTransitionEnd(duration, function() {
            if (!instance.state.isVisible && popper2.parentNode && popper2.parentNode.contains(popper2)) {
              callback();
            }
          });
        }
        function onTransitionedIn(duration, callback) {
          onTransitionEnd(duration, callback);
        }
        function onTransitionEnd(duration, callback) {
          var box = getDefaultTemplateChildren().box;
          function listener(event) {
            if (event.target === box) {
              updateTransitionEndListener(box, "remove", listener);
              callback();
            }
          }
          if (duration === 0) {
            return callback();
          }
          updateTransitionEndListener(box, "remove", currentTransitionEndListener);
          updateTransitionEndListener(box, "add", listener);
          currentTransitionEndListener = listener;
        }
        function on(eventType, handler, options) {
          if (options === void 0) {
            options = false;
          }
          var nodes = normalizeToArray(instance.props.triggerTarget || reference2);
          nodes.forEach(function(node) {
            node.addEventListener(eventType, handler, options);
            listeners.push({
              node,
              eventType,
              handler,
              options
            });
          });
        }
        function addListeners() {
          if (getIsCustomTouchBehavior()) {
            on("touchstart", onTrigger2, {
              passive: true
            });
            on("touchend", onMouseLeave, {
              passive: true
            });
          }
          splitBySpaces(instance.props.trigger).forEach(function(eventType) {
            if (eventType === "manual") {
              return;
            }
            on(eventType, onTrigger2);
            switch (eventType) {
              case "mouseenter":
                on("mouseleave", onMouseLeave);
                break;
              case "focus":
                on(isIE11 ? "focusout" : "blur", onBlurOrFocusOut);
                break;
              case "focusin":
                on("focusout", onBlurOrFocusOut);
                break;
            }
          });
        }
        function removeListeners() {
          listeners.forEach(function(_ref) {
            var node = _ref.node, eventType = _ref.eventType, handler = _ref.handler, options = _ref.options;
            node.removeEventListener(eventType, handler, options);
          });
          listeners = [];
        }
        function onTrigger2(event) {
          var _lastTriggerEvent;
          var shouldScheduleClickHide = false;
          if (!instance.state.isEnabled || isEventListenerStopped(event) || didHideDueToDocumentMouseDown) {
            return;
          }
          var wasFocused = ((_lastTriggerEvent = lastTriggerEvent) == null ? void 0 : _lastTriggerEvent.type) === "focus";
          lastTriggerEvent = event;
          currentTarget = event.currentTarget;
          handleAriaExpandedAttribute();
          if (!instance.state.isVisible && isMouseEvent(event)) {
            mouseMoveListeners.forEach(function(listener) {
              return listener(event);
            });
          }
          if (event.type === "click" && (instance.props.trigger.indexOf("mouseenter") < 0 || isVisibleFromClick) && instance.props.hideOnClick !== false && instance.state.isVisible) {
            shouldScheduleClickHide = true;
          } else {
            scheduleShow(event);
          }
          if (event.type === "click") {
            isVisibleFromClick = !shouldScheduleClickHide;
          }
          if (shouldScheduleClickHide && !wasFocused) {
            scheduleHide(event);
          }
        }
        function onMouseMove(event) {
          var target = event.target;
          var isCursorOverReferenceOrPopper = getCurrentTarget().contains(target) || popper2.contains(target);
          if (event.type === "mousemove" && isCursorOverReferenceOrPopper) {
            return;
          }
          var popperTreeData = getNestedPopperTree().concat(popper2).map(function(popper22) {
            var _instance$popperInsta;
            var instance2 = popper22._tippy;
            var state2 = (_instance$popperInsta = instance2.popperInstance) == null ? void 0 : _instance$popperInsta.state;
            if (state2) {
              return {
                popperRect: popper22.getBoundingClientRect(),
                popperState: state2,
                props
              };
            }
            return null;
          }).filter(Boolean);
          if (isCursorOutsideInteractiveBorder(popperTreeData, event)) {
            cleanupInteractiveMouseListeners();
            scheduleHide(event);
          }
        }
        function onMouseLeave(event) {
          var shouldBail = isEventListenerStopped(event) || instance.props.trigger.indexOf("click") >= 0 && isVisibleFromClick;
          if (shouldBail) {
            return;
          }
          if (instance.props.interactive) {
            instance.hideWithInteractivity(event);
            return;
          }
          scheduleHide(event);
        }
        function onBlurOrFocusOut(event) {
          if (instance.props.trigger.indexOf("focusin") < 0 && event.target !== getCurrentTarget()) {
            return;
          }
          if (instance.props.interactive && event.relatedTarget && popper2.contains(event.relatedTarget)) {
            return;
          }
          scheduleHide(event);
        }
        function isEventListenerStopped(event) {
          return currentInput.isTouch ? getIsCustomTouchBehavior() !== event.type.indexOf("touch") >= 0 : false;
        }
        function createPopperInstance() {
          destroyPopperInstance();
          var _instance$props2 = instance.props, popperOptions = _instance$props2.popperOptions, placement = _instance$props2.placement, offset2 = _instance$props2.offset, getReferenceClientRect = _instance$props2.getReferenceClientRect, moveTransition = _instance$props2.moveTransition;
          var arrow2 = getIsDefaultRenderFn() ? getChildren(popper2).arrow : null;
          var computedReference = getReferenceClientRect ? {
            getBoundingClientRect: getReferenceClientRect,
            contextElement: getReferenceClientRect.contextElement || getCurrentTarget()
          } : reference2;
          var tippyModifier = {
            name: "$$tippy",
            enabled: true,
            phase: "beforeWrite",
            requires: ["computeStyles"],
            fn: function fn5(_ref2) {
              var state2 = _ref2.state;
              if (getIsDefaultRenderFn()) {
                var _getDefaultTemplateCh = getDefaultTemplateChildren(), box = _getDefaultTemplateCh.box;
                ["placement", "reference-hidden", "escaped"].forEach(function(attr) {
                  if (attr === "placement") {
                    box.setAttribute("data-placement", state2.placement);
                  } else {
                    if (state2.attributes.popper["data-popper-" + attr]) {
                      box.setAttribute("data-" + attr, "");
                    } else {
                      box.removeAttribute("data-" + attr);
                    }
                  }
                });
                state2.attributes.popper = {};
              }
            }
          };
          var modifiers = [{
            name: "offset",
            options: {
              offset: offset2
            }
          }, {
            name: "preventOverflow",
            options: {
              padding: {
                top: 2,
                bottom: 2,
                left: 5,
                right: 5
              }
            }
          }, {
            name: "flip",
            options: {
              padding: 5
            }
          }, {
            name: "computeStyles",
            options: {
              adaptive: !moveTransition
            }
          }, tippyModifier];
          if (getIsDefaultRenderFn() && arrow2) {
            modifiers.push({
              name: "arrow",
              options: {
                element: arrow2,
                padding: 3
              }
            });
          }
          modifiers.push.apply(modifiers, (popperOptions == null ? void 0 : popperOptions.modifiers) || []);
          instance.popperInstance = createPopper(computedReference, popper2, Object.assign({}, popperOptions, {
            placement,
            onFirstUpdate,
            modifiers
          }));
        }
        function destroyPopperInstance() {
          if (instance.popperInstance) {
            instance.popperInstance.destroy();
            instance.popperInstance = null;
          }
        }
        function mount() {
          var appendTo = instance.props.appendTo;
          var parentNode;
          var node = getCurrentTarget();
          if (instance.props.interactive && appendTo === TIPPY_DEFAULT_APPEND_TO || appendTo === "parent") {
            parentNode = node.parentNode;
          } else {
            parentNode = invokeWithArgsOrReturn(appendTo, [node]);
          }
          if (!parentNode.contains(popper2)) {
            parentNode.appendChild(popper2);
          }
          instance.state.isMounted = true;
          createPopperInstance();
        }
        function getNestedPopperTree() {
          return arrayFrom(popper2.querySelectorAll("[data-tippy-root]"));
        }
        function scheduleShow(event) {
          instance.clearDelayTimeouts();
          if (event) {
            invokeHook("onTrigger", [instance, event]);
          }
          addDocumentPress();
          var delay = getDelay(true);
          var _getNormalizedTouchSe = getNormalizedTouchSettings(), touchValue = _getNormalizedTouchSe[0], touchDelay = _getNormalizedTouchSe[1];
          if (currentInput.isTouch && touchValue === "hold" && touchDelay) {
            delay = touchDelay;
          }
          if (delay) {
            showTimeout = setTimeout(function() {
              instance.show();
            }, delay);
          } else {
            instance.show();
          }
        }
        function scheduleHide(event) {
          instance.clearDelayTimeouts();
          invokeHook("onUntrigger", [instance, event]);
          if (!instance.state.isVisible) {
            removeDocumentPress();
            return;
          }
          if (instance.props.trigger.indexOf("mouseenter") >= 0 && instance.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(event.type) >= 0 && isVisibleFromClick) {
            return;
          }
          var delay = getDelay(false);
          if (delay) {
            hideTimeout = setTimeout(function() {
              if (instance.state.isVisible) {
                instance.hide();
              }
            }, delay);
          } else {
            scheduleHideAnimationFrame = requestAnimationFrame(function() {
              instance.hide();
            });
          }
        }
        function enable() {
          instance.state.isEnabled = true;
        }
        function disable() {
          instance.hide();
          instance.state.isEnabled = false;
        }
        function clearDelayTimeouts() {
          clearTimeout(showTimeout);
          clearTimeout(hideTimeout);
          cancelAnimationFrame(scheduleHideAnimationFrame);
        }
        function setProps(partialProps) {
          if (instance.state.isDestroyed) {
            return;
          }
          invokeHook("onBeforeUpdate", [instance, partialProps]);
          removeListeners();
          var prevProps = instance.props;
          var nextProps = evaluateProps(reference2, Object.assign({}, prevProps, removeUndefinedProps(partialProps), {
            ignoreAttributes: true
          }));
          instance.props = nextProps;
          addListeners();
          if (prevProps.interactiveDebounce !== nextProps.interactiveDebounce) {
            cleanupInteractiveMouseListeners();
            debouncedOnMouseMove = debounce(onMouseMove, nextProps.interactiveDebounce);
          }
          if (prevProps.triggerTarget && !nextProps.triggerTarget) {
            normalizeToArray(prevProps.triggerTarget).forEach(function(node) {
              node.removeAttribute("aria-expanded");
            });
          } else if (nextProps.triggerTarget) {
            reference2.removeAttribute("aria-expanded");
          }
          handleAriaExpandedAttribute();
          handleStyles();
          if (onUpdate) {
            onUpdate(prevProps, nextProps);
          }
          if (instance.popperInstance) {
            createPopperInstance();
            getNestedPopperTree().forEach(function(nestedPopper) {
              requestAnimationFrame(nestedPopper._tippy.popperInstance.forceUpdate);
            });
          }
          invokeHook("onAfterUpdate", [instance, partialProps]);
        }
        function setContent2(content) {
          instance.setProps({
            content
          });
        }
        function show() {
          var isAlreadyVisible = instance.state.isVisible;
          var isDestroyed = instance.state.isDestroyed;
          var isDisabled = !instance.state.isEnabled;
          var isTouchAndTouchDisabled = currentInput.isTouch && !instance.props.touch;
          var duration = getValueAtIndexOrReturn(instance.props.duration, 0, defaultProps.duration);
          if (isAlreadyVisible || isDestroyed || isDisabled || isTouchAndTouchDisabled) {
            return;
          }
          if (getCurrentTarget().hasAttribute("disabled")) {
            return;
          }
          invokeHook("onShow", [instance], false);
          if (instance.props.onShow(instance) === false) {
            return;
          }
          instance.state.isVisible = true;
          if (getIsDefaultRenderFn()) {
            popper2.style.visibility = "visible";
          }
          handleStyles();
          addDocumentPress();
          if (!instance.state.isMounted) {
            popper2.style.transition = "none";
          }
          if (getIsDefaultRenderFn()) {
            var _getDefaultTemplateCh2 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh2.box, content = _getDefaultTemplateCh2.content;
            setTransitionDuration([box, content], 0);
          }
          onFirstUpdate = function onFirstUpdate2() {
            var _instance$popperInsta2;
            if (!instance.state.isVisible || ignoreOnFirstUpdate) {
              return;
            }
            ignoreOnFirstUpdate = true;
            void popper2.offsetHeight;
            popper2.style.transition = instance.props.moveTransition;
            if (getIsDefaultRenderFn() && instance.props.animation) {
              var _getDefaultTemplateCh3 = getDefaultTemplateChildren(), _box = _getDefaultTemplateCh3.box, _content = _getDefaultTemplateCh3.content;
              setTransitionDuration([_box, _content], duration);
              setVisibilityState([_box, _content], "visible");
            }
            handleAriaContentAttribute();
            handleAriaExpandedAttribute();
            pushIfUnique(mountedInstances, instance);
            (_instance$popperInsta2 = instance.popperInstance) == null ? void 0 : _instance$popperInsta2.forceUpdate();
            invokeHook("onMount", [instance]);
            if (instance.props.animation && getIsDefaultRenderFn()) {
              onTransitionedIn(duration, function() {
                instance.state.isShown = true;
                invokeHook("onShown", [instance]);
              });
            }
          };
          mount();
        }
        function hide2() {
          var isAlreadyHidden = !instance.state.isVisible;
          var isDestroyed = instance.state.isDestroyed;
          var isDisabled = !instance.state.isEnabled;
          var duration = getValueAtIndexOrReturn(instance.props.duration, 1, defaultProps.duration);
          if (isAlreadyHidden || isDestroyed || isDisabled) {
            return;
          }
          invokeHook("onHide", [instance], false);
          if (instance.props.onHide(instance) === false) {
            return;
          }
          instance.state.isVisible = false;
          instance.state.isShown = false;
          ignoreOnFirstUpdate = false;
          isVisibleFromClick = false;
          if (getIsDefaultRenderFn()) {
            popper2.style.visibility = "hidden";
          }
          cleanupInteractiveMouseListeners();
          removeDocumentPress();
          handleStyles(true);
          if (getIsDefaultRenderFn()) {
            var _getDefaultTemplateCh4 = getDefaultTemplateChildren(), box = _getDefaultTemplateCh4.box, content = _getDefaultTemplateCh4.content;
            if (instance.props.animation) {
              setTransitionDuration([box, content], duration);
              setVisibilityState([box, content], "hidden");
            }
          }
          handleAriaContentAttribute();
          handleAriaExpandedAttribute();
          if (instance.props.animation) {
            if (getIsDefaultRenderFn()) {
              onTransitionedOut(duration, instance.unmount);
            }
          } else {
            instance.unmount();
          }
        }
        function hideWithInteractivity(event) {
          getDocument().addEventListener("mousemove", debouncedOnMouseMove);
          pushIfUnique(mouseMoveListeners, debouncedOnMouseMove);
          debouncedOnMouseMove(event);
        }
        function unmount() {
          if (instance.state.isVisible) {
            instance.hide();
          }
          if (!instance.state.isMounted) {
            return;
          }
          destroyPopperInstance();
          getNestedPopperTree().forEach(function(nestedPopper) {
            nestedPopper._tippy.unmount();
          });
          if (popper2.parentNode) {
            popper2.parentNode.removeChild(popper2);
          }
          mountedInstances = mountedInstances.filter(function(i) {
            return i !== instance;
          });
          instance.state.isMounted = false;
          invokeHook("onHidden", [instance]);
        }
        function destroy() {
          if (instance.state.isDestroyed) {
            return;
          }
          instance.clearDelayTimeouts();
          instance.unmount();
          removeListeners();
          delete reference2._tippy;
          instance.state.isDestroyed = true;
          invokeHook("onDestroy", [instance]);
        }
      }
      function tippy(targets, optionalProps) {
        if (optionalProps === void 0) {
          optionalProps = {};
        }
        var plugins = defaultProps.plugins.concat(optionalProps.plugins || []);
        bindGlobalEventListeners();
        var passedProps = Object.assign({}, optionalProps, {
          plugins
        });
        var elements = getArrayOfElements(targets);
        var instances = elements.reduce(function(acc, reference2) {
          var instance = reference2 && createTippy(reference2, passedProps);
          if (instance) {
            acc.push(instance);
          }
          return acc;
        }, []);
        return isElement(targets) ? instances[0] : instances;
      }
      tippy.defaultProps = defaultProps;
      tippy.setDefaultProps = setDefaultProps;
      tippy.currentInput = currentInput;
      Object.assign({}, applyStyles$1, {
        effect: function effect2(_ref) {
          var state = _ref.state;
          var initialStyles = {
            popper: {
              position: state.options.strategy,
              left: "0",
              top: "0",
              margin: "0"
            },
            arrow: {
              position: "absolute"
            },
            reference: {}
          };
          Object.assign(state.elements.popper.style, initialStyles.popper);
          state.styles = initialStyles;
          if (state.elements.arrow) {
            Object.assign(state.elements.arrow.style, initialStyles.arrow);
          }
        }
      });
      tippy.setDefaultProps({
        render
      });

    })
  };
}));

System.import("./__entry.js", "./");
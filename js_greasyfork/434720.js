// ==UserScript==
// @name         VC驿站优化
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  VC驿站复制代码优化脚本
// @author       coder2002
// @match        *://www.cctry.com/*
// @icon         https://www.cctry.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434720/VC%E9%A9%BF%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/434720/VC%E9%A9%BF%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    function hook(object, attr) {
        var func = object[attr];
        object[attr] = function () {
            arguments[0] = arguments[0].replace(/^([\s]{2,24})/gm, (match)=> {
                let ret = '';
                switch(match.length){
                    case 24:
                        ret = '\t\t\t';
                        break;

                    case 16:
                        ret = '\t\t';
                        break;

                    case 2:
                    case 4:
                    case 6:
                    case 7:
                    case 8:
                        ret = '\t';
                        break;

                    case 3:
                    case 5:
                    case 9:
                        ret = '\n\t';
                        break;

                    default:
                        ret = '\t'
                }
                return ret;
            }).replace(/([\s]{4,8})/g, '\t').replace(/([a-zA-Z\"])([\s]{2,3})([a-zA-Z\"])/g, '$1 $3');
            arguments[1] = "复制成功";
            var ret = func.apply(object, arguments);
            //debugger;
            return ret;
        }
    }
    hook(window, 'setCopy');
})();
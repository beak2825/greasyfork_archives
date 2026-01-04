// ==UserScript==
// @name         Gapi-Replacer
// @name:zh-CN   Google服务替换助手
// @namespace    http://github.com/gavinin
// @version      1.0
// @description  The script is using in some location which can't connect to google service
// @description:zh-cn  这是一个脚本替换工具，将GoogleAPI替换成国内的镜像
// @author       Gavinin
// @grant        none
// @match        http://*/*
// @match        https://*/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/430943/Gapi-Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/430943/Gapi-Replacer.meta.js
// ==/UserScript==


(function () {
    /*务必填写API地址
    可以替换成bootcdn等，loli是我自己在用，因为比较全*/
    var replaceArrays = {
        script: {
            "googleusercontent.com": "loli.net",
            "googleapis.com": "loli.net",
            "www.recaptcha.net/recaptcha/": "www.google.com/recaptcha/"
        },
        link: {
            "googleapis.com": "loli.net",
        }

    }

    var type2Node={
        script:"src",
        link:"href"
    }

    "use strict";
    for (var type in replaceArrays) {
        if (Object.prototype.hasOwnProperty.call(replaceArrays, type)) {
            for (var key in replaceArrays[type]) {
                if (Object.prototype.hasOwnProperty.call(replaceArrays[type], key)) {
                    console.log(key, replaceArrays[type][key])
                    querySelector({type:type,nodeName:type2Node[type]}, key, replaceArrays[type][key])
                }
            }
        }
    }
})();
function querySelector(config, originUrl, replacedUrl) {
    document.querySelectorAll(config.type).forEach((function (e) {
        if (e[config.nodeName].indexOf(originUrl) >= 0) {
            var newObj = e[config.nodeName].replace("http://", "https://")
                .replace(originUrl, replacedUrl);
            e.parentNode.replaceChild(function (e) {
                var newObj = document.createElement(config.type);
                return newObj.src = e, newObj;
            }(newObj), e);
        }
    }));
}




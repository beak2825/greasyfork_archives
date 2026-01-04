// ==UserScript==
// @name         天翼网盘总容量单位显示为G
// @namespace    https://greasyfork.org/zh-CN/users/4330
// @version      2.3
// @description  修改天翼网盘总容量单位显示为G
// @author       x2009again
// @match        http*://cloud.189.cn/web/main/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/423169/%E5%A4%A9%E7%BF%BC%E7%BD%91%E7%9B%98%E6%80%BB%E5%AE%B9%E9%87%8F%E5%8D%95%E4%BD%8D%E6%98%BE%E7%A4%BA%E4%B8%BAG.user.js
// @updateURL https://update.greasyfork.org/scripts/423169/%E5%A4%A9%E7%BF%BC%E7%BD%91%E7%9B%98%E6%80%BB%E5%AE%B9%E9%87%8F%E5%8D%95%E4%BD%8D%E6%98%BE%E7%A4%BA%E4%B8%BAG.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function formatFileSize(bytes, fixedDigits, unitFlag, floorFlag) {
        if (!(bytes.toString().search(/B|K|M|G|T/) > - 1)) {
            var humanSize,
                unit,
                _bytes = parseFloat(bytes),
                absBytes = Math.abs(_bytes);
            fixedDigits == undefined && (fixedDigits = 2),
                unitFlag == undefined && (unitFlag = !0),
                //        absBytes < 1024 ? (fixedDigits = 0, humanSize = _bytes, unit = 'B') : absBytes < 921600 ? (humanSize = _bytes / 1024, unit = 'K') : absBytes < 943718400 ? (humanSize = _bytes / 1048576, unit = 'M') : absBytes < 966367641600 || 0 === fixedDigits && absBytes < 10995116277760 ? (humanSize = _bytes / 1073741824, unit = 'G') : (humanSize = _bytes / 1099511627776, unit = 'T'),
                humanSize = _bytes / 1073741824, unit = 'G',
                humanSize = Math.round(humanSize * Math.pow(10, fixedDigits)) / parseFloat(Math.pow(10, fixedDigits)),
                humanSize = humanSize.toFixed(fixedDigits);
            var result;
            return result = floorFlag && fixedDigits > 0 ? humanSize != Math.floor(humanSize) ? humanSize : parseInt(Math.floor(humanSize), 10) : humanSize,
                unitFlag && (result += unit),
                result
        }
    }
    (function(open) {
        XMLHttpRequest.prototype.open = function() {
            this.addEventListener("readystatechange", function() {
                if(this.responseURL.indexOf("getUserInfoForPortal.action")>-1&&this.readyState==3)
                {
                    var userLoginedInfosData=JSON.parse(this.response);
                    setTimeout(function(){
                        document.querySelector('.member-tips').textContent=('总容量：' + formatFileSize(userLoginedInfosData.capacity, 2, !0, !1));
                    },1000);
                }

            }, false);
            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);
})();
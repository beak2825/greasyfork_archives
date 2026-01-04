// ==UserScript==
// @name        sf-taobao.com
// @namespace   Violentmonkey Scripts
// @match       https://zc-paimai.taobao.com/wow/pm/default/pc/*
// @grant       none
// @version     1.0
// @require     https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @author      -
// @description 2023/2/21 上午12:17:39
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460404/sf-taobaocom.user.js
// @updateURL https://update.greasyfork.org/scripts/460404/sf-taobaocom.meta.js
// ==/UserScript==

// 封装ajax
function addXMLRequestCallback(callback) {
    let oldSend, i;
    if (XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback);
    } else {
        XMLHttpRequest.callbacks = [callback];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function () {
            for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                XMLHttpRequest.callbacks[i](this);
            }
            try {
                oldSend.apply(this, arguments);
            } catch (e) {
                console.log(e);
            }
        }
    }
}

(function () {
    'use strict';

    addXMLRequestCallback(xhr => {
        xhr.addEventListener("load", () => {
            if (xhr.responseURL.includes("h5/mtop.taobao.datafront.invoke.auctionwalle/1.0")) {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (xhr.responseText.indexOf('9018433170') > 0) {
                        var sss = JSON.parse(xhr.response).data.data.GQL_getPageModulesData[9018433170].items.schemeList
                        $.ajax({
                            url: 'http://localhost/sf/dd',
                            type: 'POST',
                            data : JSON.stringify({"asd": JSON.stringify(sss)}),
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            success: res => {
                                console.log(res)
                            }
                        })
                    }
                }
            }
        });
    });

})();
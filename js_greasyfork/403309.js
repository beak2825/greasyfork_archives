// ==UserScript==
// @name         微博网页分享
// @namespace    3782faa221424202846b63437a2bc394
// @version      0.1
// @description  网页版微博增加分享功能，不用转发，直接分享当前微博本身
// @author       tomoya92
// @match        https://weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403309/%E5%BE%AE%E5%8D%9A%E7%BD%91%E9%A1%B5%E5%88%86%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/403309/%E5%BE%AE%E5%8D%9A%E7%BD%91%E9%A1%B5%E5%88%86%E4%BA%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener("click", function(e) {
        var icon_e = e.target;
        var icon_class_name = e.target.className;
        if (icon_class_name.indexOf("W_ficon") != -1) {
            var nextSibling = icon_e.parentNode.parentNode;
            var ul = nextSibling.querySelector(".layer_menu_list>ul:first-child");
            var lis = ul.getElementsByTagName("li");
            var uid,aid,has = false;
            for(var i = 0; i < lis.length; i++) {
                var text = lis[i].textContent;
                if (text.indexOf("取消关注") != -1) {
                    var actionData = lis[i].firstChild.getAttribute("action-data");
                    var urls = actionData.split("&");
                    for(var j = 0; j < urls.length; j++) {
                        if (urls[j].indexOf('uid') != -1) {
                            uid = urls[j].split("=")[1];
                        }
                    }
                } else if (text.indexOf("投诉") != -1) {
                    var clickUrl = lis[i].firstChild.getAttribute("onclick");
                    clickUrl = clickUrl.replace("javascript:window.open('https://service.account.weibo.com/reportspam?", "");
                    var _urls = clickUrl.split("&");
                    for(var k = 0; k < _urls.length; k++) {
                        if (_urls[k].indexOf('rid') != -1) {
                            aid = _urls[k].split("=")[1];
                        }
                    }
                } else if (text.indexOf("分享") != -1) {
                    has = true;
                }
            }
            if (!has) {
                var newli = document.createElement("li");
                var newa = document.createElement("a");
                newa.setAttribute("href", "https://weibo.com/" + uid + "/" + aid);
                newa.setAttribute("target", "_blank");
                newa.innerHTML = "分享";
                newli.appendChild(newa);
                ul.appendChild(newli);
            }
        }
    })
})();
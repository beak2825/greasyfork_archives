// ==UserScript==
// @name        自定义余额显示数额（本地）
// @namespace   Violentmonkey Scripts
// @match       *://store.steampowered.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 2022/7/5 上午3:30:43
// @run-at      document-start
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/447431/%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BD%99%E9%A2%9D%E6%98%BE%E7%A4%BA%E6%95%B0%E9%A2%9D%EF%BC%88%E6%9C%AC%E5%9C%B0%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447431/%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BD%99%E9%A2%9D%E6%98%BE%E7%A4%BA%E6%95%B0%E9%A2%9D%EF%BC%88%E6%9C%AC%E5%9C%B0%EF%BC%89.meta.js
// ==/UserScript==
(function () {//JQ功能扩展
    $.extend({
        ObserveNewElements: function (selector, response) {//ObserveNewElements(选择器,回调{NEW_ELE})
            'use strict';
            if (!!selector) {
                let config = {
                    childList: true,
                    subtree: true
                };
                const mutationCallback = (mutationsList) => {
                    for (let mutation of mutationsList) {
                        let type = mutation.type;
                        if (type == "childList") {
                            if (mutation.addedNodes.length != 0) {
                                var ele_list = $(mutation.addedNodes).find("*");
                                for (let index = 0; index < ele_list.length; index++) {
                                    var for_ele = ele_list[index]
                                    if ($(for_ele).is(selector) == true) {
                                        response.call(mutation, for_ele)
                                    }
                                }
                            }
                        }
                    }
                };
                var observe = new MutationObserver(mutationCallback);
                observe.observe(document, config)
            }
        }
    })
    $.ObserveNewElements("#header_wallet_balance", function (NewEle) {
        (function Init(NewEle) {
            /*--------------------------------------------------------------*/
            var od = "8,896";//余额前缀
            var ou = true;//true = 启动余额前缀
            /*--------------------------------------------------------------*/
            var ele = NewEle, text, symbol, inHtml = ele.innerHTML;
            if (ele != undefined) {
                var Exp = /(\d+)[.|,](\d+)/.exec(inHtml);
                for (let index = 0; index < Exp.length; index++) {
                    if (index > 0) {
                        if (index == 1) {
                            if (ou) {
                                text = "$ " + od;
                            } else {
                                text = "$ " + Exp[index];
                            }
                        } else {
                            if (Exp.length == (index + 1)) {
                                symbol = ".";
                            } else {
                                symbol = ",";
                            }
                            text = text + symbol + Exp[index];
                        }
                    }
                }
                ele.innerHTML = text;
            }
        }(NewEle))
    })
}());
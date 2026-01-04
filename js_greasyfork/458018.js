// ==UserScript==
// @name         Pure百度 （百度纯净版PC端） 2023.1.11
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  精简了部分无关元素，让搜索回归本质
// @author       FuchengWang
// @match        *://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458018/Pure%E7%99%BE%E5%BA%A6%20%EF%BC%88%E7%99%BE%E5%BA%A6%E7%BA%AF%E5%87%80%E7%89%88PC%E7%AB%AF%EF%BC%89%202023111.user.js
// @updateURL https://update.greasyfork.org/scripts/458018/Pure%E7%99%BE%E5%BA%A6%20%EF%BC%88%E7%99%BE%E5%BA%A6%E7%BA%AF%E5%87%80%E7%89%88PC%E7%AB%AF%EF%BC%89%202023111.meta.js
// ==/UserScript==


(function () {
    // querySelector 的包装器， dom不存在时创建一个
    function q(str) {
        var q = document.querySelector(str);
        if (q) {
            return q;
        }
        else {
            return document.createElement("div");
        }
    }

    q('.s-hotsearch-wrapper').style.setProperty("display", "none", "important");
    q('#con-ceiling-wrapper').style.setProperty("display", "none", "important");
    q('#searchTag').style.setProperty("display", "none", "important");

    // 1. 创建1个mutationObserver 	// 需要一个回调function作为参数
    function callback(mutationList, observer) {
        for (let mutation of mutationList) {
            // mutation type
            // mutation attributeName

            if (mutation.type == 'attributes') {
                if (mutation.attributeName == 'value') {
                    console.log(mutation.attributeName + " 变了");

                    // 移除不需要的东西 (搜索页）
                    q('#content_right').style.setProperty("display", "none", "important");
                    q('#searchTag').style.setProperty("display", "none", "important");
                    q('#con-ceiling-wrapper').style.setProperty("display", "none", "important");
                    q('#rs_new').style.setProperty("display", "none", "important");

                    var ops = document.querySelectorAll('.result-op');
                    for (let op of ops) {
                        console.log(op)
                        if (op.getAttribute('tpl') == 'recommend_list') {
                            op.style.setProperty('display', 'none', 'important')
                        }
                    }

                    // 移除 首页
                    q('.s-hotsearch-wrapper').style.setProperty("display", "none", "important");
                    q('#con-ceiling-wrapper').style.setProperty("display", "none", "important");
                }
            }
        }

    }
    var config = { attributes: true, subtree: true }
    var target = document.querySelector('#wrapper');

    var ob = new MutationObserver(callback);
    ob.observe(target, config)
})();
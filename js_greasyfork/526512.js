// ==UserScript==
// @name         Fxxk WeiBo
// @namespace    http://tampermonkey.net/
// @version      0.0.17
// @description  delete sina weibo modules
// @author       You
// @match        https://*.weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526512/Fxxk%20WeiBo.user.js
// @updateURL https://update.greasyfork.org/scripts/526512/Fxxk%20WeiBo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hehe = ['赵露思', '虞书欣','肖战','王一博','王鹤棣','孙颖莎','王楚钦','郑钦文','张本智和','樊振东','乒乓'];

    function removeEditor() {
        var dom1 = document.getElementById('homeWrap');
        if (dom1) {
            var dom1_exit = dom1.querySelector('.woo-panel-main.woo-panel-top.woo-panel-right.woo-panel-bottom.woo-panel-left');
            dom1_exit && dom1_exit.remove();
        }

        var dom2 = document.getElementById('pl_topic_header');
        if (dom2) {
            dom2.remove();
        }

        var dom3 = document.querySelector('[node-type="sendweibo"]');
        if (dom3) {
            dom3.remove();
        }

        var dom4 = document.querySelector('.card-topic-presenter');
        if (dom4) {
            dom4.remove();
        }

        var dom5 = document.querySelector('.card-about');
        if (dom5) {
            dom5.remove();
        }

        var dom6 = document.getElementById('pl_right_msg');
        if (dom6) {
            if(dom6.previousElementSibling){
                dom6.previousElementSibling.remove();
            }
            dom6.remove();
        }

    }

    function removeMyHotReach() {
        const parentDom = document.querySelector(".wbpro-side-main");
        const prefix = "cardHotSearch_tabItem";
        let isFind = false
        parentDom.querySelectorAll("*").forEach(el => {
            if (!isFind && [...el.classList].some(cls => cls && cls.startsWith(prefix))) {
                el.parentElement.remove();
                isFind = true;
                return true;
            }
        });

        parentDom.querySelectorAll("*").forEach(el => {
            if ([...el.classList].some(cls => cls && cls.startsWith(prefix))) {
                el.click()
                el.parentElement.click();
                el.parentElement.parentElement.click();
                return true;
            }
        });

        parentDom.querySelectorAll('.wbpro-textcut').forEach(i => {
            hehe.some(j => {
                if (i.innerText && i.innerText.includes(j) && i.parentElement.parentElement.parentElement) {
                    console.error(i.innerText);
                    i.parentElement.parentElement.parentElement.remove();
                    return true;
                }
            })
        })
    }

    function removeMyHotReach2() {
        const parentDom = document.querySelector(".hot-band-tabs");
        parentDom.querySelector('.hot-band-tabs-item').firstChild.remove();
        parentDom.querySelector('.hot-band-tabs-item').firstChild.click();
        setTimeout(function(){
            parentDom.querySelectorAll('.hot-band-tabs-list-item-content-title').forEach(i => {
                hehe.some(j => {
                    if (i.innerText && i.innerText.includes(j) && i.parentElement.parentElement.parentElement) {
                        console.error(i.innerText);
                        i.parentElement.parentElement.parentElement.remove();
                        return true;
                    }
                })
            })
        },1000);
    }

    function removeOtherPanel() {
        document.querySelector("[curcarddata]").remove();
        const dom = document.querySelector('.wbpro-side-main').childNodes;
        dom[dom.length - 1].remove();
        document.querySelector('.wbpro-side-copy').remove();
    }

    function waitForElementByClass(className, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(`${className}`);
            if (element) {
                callback(element); // 执行回调函数
                obs.disconnect(); // 停止监听，防止重复触发
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    waitForElementByClass("#homeWrap", (el) => {
        removeEditor();
    });

    waitForElementByClass("#pl_feed_main", (el) => {
        removeEditor();
    });

    // 示例：当 `.target-class` 出现时执行回调
    waitForElementByClass(".wbpro-side-panel", (el) => {
        removeMyHotReach();
        removeOtherPanel();
    });

    waitForElementByClass(".hot-band-tabs", (el) => {
        removeMyHotReach2();
    });

})();
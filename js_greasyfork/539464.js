// ==UserScript==
// @name         fuck-ugg
// @namespace    http://*/
// @namespace    https://*/
// @version      1.3
// @description  删除UGG页面中倒胃口的垃圾信息
// @author       fuck-ugg
// @license      AGPL License
// @include      https://www.uu-gg.one/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/539464/fuck-ugg.user.js
// @updateURL https://update.greasyfork.org/scripts/539464/fuck-ugg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /////////////////////////////////////////////////////////////////////////////
    // 狗叫禁声 /////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////

    // 关闭傻逼设置的每日一弹
    const tms = new Date().getTime();
    localStorage.setItem('modalLastShown', tms);

    // 关闭置垃圾恶心置顶贴
    const ids = "[2206,108116,96060,77813,76301,3090,2646,55832]";
    localStorage.setItem('Discuz_sticktids', ids);

    // 关闭顶部的垃圾提醒，全是垃圾恶心人的信息
    GM_addStyle('.a_ugg_mu{display:none !important}');

    // 关闭滚动垃圾信息，全是垃圾恶心人的信息
    GM_addStyle('#toptable{display:none !important}');

    // 关闭喇叭，全是垃圾恶心人的信息
    GM_addStyle('#laba{display:none !important}');
    // 删除发贴页面的垃圾提示
    GM_addStyle("#wolfcodepostwarn_div .wolfcodepostwarn_text>div:not(:first-child){display:none !important}");

    window.addEventListener("DOMContentLoaded", () => {
        // 关闭傻逼设置的发贴警告，点回复直接发贴
        unsafeWindow.confirmSubmit = function (content, formId) {
            return true;
        }

        // 删除发贴页面的垃圾提示
        const st = document.getElementById("scrolling-table");
        if (st) st.style.display = 'none';

         const lj = document.getElementById('wolfcodepostwarn_div');
        if (lj) {
            const ds = lj.querySelectorAll('.wolfcodepostwarn_text>div');
            if (ds) {
                ds.forEach(function(d, i){
                    if (i > 0) {d.style.display = "none"} else {
                        d.querySelectorAll('div').forEach(function(d){
                            if (d.textContent.includes('封') || d.textContent.includes('违规') || d.textContent.includes('---')|| d.textContent.includes('垃圾')) {
                                d.style.display = 'none';
                            }
                        });
                    }
                })
            }
        }


        // 删除发贴输入框中的垃圾恶心人的提示
        const as = document.querySelectorAll("textarea,input")
        if (as) {
            as.forEach(function(a, i){
                a.placeholder = "请输入内容";
            })
        }

        // 删除每个帖子底部垃圾恶心人的封号提示
        const signs = document.querySelectorAll(".sign");
        if (signs){
            signs.forEach(function(d, i){
                if (d.textContent.includes('封号提醒')) {
                    d.style.display = 'none';
                }
            });
        }
    })

})();
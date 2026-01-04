// ==UserScript==
// @name         Steam好友动态日期选择器
// @namespace    https://greasyfork.org/users/101223
// @version      0.2.3
// @description  Steam 好友动态日期选择器
// @author       Splash
// @match        *://steamcommunity.com/*/home
// @match        *://steamcommunity.com/*/home/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @supportURL   https://keylol.com/t812679-1-1
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/445525/Steam%E5%A5%BD%E5%8F%8B%E5%8A%A8%E6%80%81%E6%97%A5%E6%9C%9F%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/445525/Steam%E5%A5%BD%E5%8F%8B%E5%8A%A8%E6%80%81%E6%97%A5%E6%9C%9F%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    jQuery('.blotter_page_title span').prepend('<span style="margin-right: 5px;">选择日期:</span><input type="date">&nbsp;|&nbsp;');
    let contentObj = jQuery('.blotter_day'),
    inputDate = jQuery('.blotter_page_title span input'),
    success;
    inputDate.on('change', function () {
        inputDate.prop('disabled', true);
        success = false;
        getUserNews(Math.floor(new Date(this.value).getTime() / 1000));
    });
    function getUserNews(date) {
        jQuery.ajax({
            url: `https://steamcommunity.com/my/ajaxgetusernews?start=${date}`,
            type: 'get',
            success: (resp) => {
                if (resp.success) {
                    success = true;
                    g_BlotterNextLoadURL = resp.next_request;
                    contentObj.empty();
                    contentObj.append(resp.blotter_html);
                } else {
                    console.log(resp);
                }
            },
            error: (resp) => {
                console.log(resp);
            },
            complete: () => {
                inputDate.prop('disabled', false);
                if (!success) {
                    ShowAlertDialog('错误', `加载失败，请重试！<br>（请按F12打开控制台查看相关信息或到 <a href="${GM_info.script.supportURL}" target="_blank">这里</a> 反馈！）<br><br>注：最多只能查看最近几个月的记录，如果选择日期过早，可能出现此错误。`)
                }
            }
        });
    }
})();

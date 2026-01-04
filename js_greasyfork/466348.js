// ==UserScript==
// @name         gu_name_replace
// @namespace    https://feedback.booster.gearupportal.com/
// @version      1.0.2
// @description  替换GU游戏的name为display_name
// @author       ming
// @match        https://feedback.booster.gearupportal.com/transfer/list*
// @match        https://feedback.booster.gearupportal.com/feedback/logs*
// @include      /^https:\/\/feedback\.booster\.gearupportal\.com\/[0-9a-z]{24}$/
// @icon         http://cos.qaming.cn/monkey/%E9%85%B8%E5%A5%B6-Yogurt.png
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      Apache License 2.0
// @connect      qa.devouter.uu.netease.com
// @connect      qa.devouter.uu.163.com
// @connect      127.0.0.1
// @downloadURL https://update.greasyfork.org/scripts/466348/gu_name_replace.user.js
// @updateURL https://update.greasyfork.org/scripts/466348/gu_name_replace.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function game_name_replace() {
        const table = document.getElementsByClassName("table");
        for (let i = 0; i < table.length; i++) {
            let elementsByTagName = table[i].getElementsByTagName("tr");
            // td_qq[3].innerHTML = "<a href=" + href_qq + " target='_blank'>" + qq_text + "</a>"
            // 包括图片栏在内刚好三行，小于三行就不请求跳转游戏后台了
            if (elementsByTagName.length <= 3) {
                continue;
            }
            const table_tr_3 = elementsByTagName[2];
            const td_name = table_tr_3.children;
            const a = td_name[0].getElementsByTagName("a");
            // 截取这部分为了可以跳转到后台的query界面
            const game_name = a[0].text;
            let api_url = "https://qa.devouter.uu.163.com/apis/gu_name_replace?";
            const params = "name=" + game_name;

            api_url = api_url + params;
            let replace_game_name = ''
            // 请求游戏名称对应的id，插入跳转的href
            GM_xmlhttpRequest({
                url: api_url,
                method: "GET",
                data: "",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                },
                onload: function (xhr) {
                    console.log(xhr.responseText);
                    let res = JSON.parse(xhr.responseText);
                    replace_game_name = res['display_name']
                    // 从td_name找到a标签，并替换内容
                    a[0].text = replace_game_name;
                },
                onerror: function (err) {
                    console.log('error')
                }
            });
        }
    }


    setTimeout(game_name_replace, 1000);
})();

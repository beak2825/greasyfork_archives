// ==UserScript==
// @name         全民K歌私密作品一键清理
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动清理全民K歌私密作品
// @author       baldnbrave
// @include      *://node.kg.qq.com/personal*
// @include      *://kg.qq.com/node/personal*
// @icon         https://kg.qq.com/favicon.ico
// @run-at       context-menu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432698/%E5%85%A8%E6%B0%91K%E6%AD%8C%E7%A7%81%E5%AF%86%E4%BD%9C%E5%93%81%E4%B8%80%E9%94%AE%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/432698/%E5%85%A8%E6%B0%91K%E6%AD%8C%E7%A7%81%E5%AF%86%E4%BD%9C%E5%93%81%E4%B8%80%E9%94%AE%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function () {
    'use strict';

    alert("请解除所有置顶曲目以便删除更多私密作品")
    // override confirm
    //window.confirm = () => { return true }
    while (document.querySelectorAll(".mod_playlist__lock").length > 0) {
            let locked_count = document.querySelectorAll(".mod_playlist__lock").length
    alert("有" + locked_count + "首私密作品")
        if (confirm("该操作不可逆，请确认执行")) {

            let locked_songs = document.querySelectorAll(".mod_playlist__lock")
            // locked_shareid = []
            // locked_ksongmid = []
            let locked_names = []
            let locked_delete_button = []

            // get buttons
            locked_songs.forEach(song => {
                // locked_shareid.push(song.parentElement.parentElement.parentElement.getAttribute('data-shareid'))
                // locked_ksongmid.push(song.parentElement.parentElement.parentElement.getAttribute('data-ksongmid'))
                locked_names.push(song.parentElement.parentElement.querySelector('.mod_playlist__work').text)
                locked_delete_button.push(song.parentElement.parentElement.querySelector('.j_delete_song'))
            });
            if (confirm("确认删除以下歌曲" + locked_songs)) {
                // delete each
                locked_delete_button.forEach(button => {
                    button.click()
                });
            }

            // refresh songs
            location.reload()
        }
    }

})();
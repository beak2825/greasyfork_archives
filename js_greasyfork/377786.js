// ==UserScript==
// @name         个人使用
// @namespace    undefined
// @version      0.0.2
// @description  个人使用插件
// @author       个人使用
// @match        *://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/pageinfo_list.do
// @match        个人使用
// @downloadURL https://update.greasyfork.org/scripts/377786/%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/377786/%E4%B8%AA%E4%BA%BA%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

$(document).ready(function () {
    alert("超级VIP获取成功😝")
    var length = $(".gome_list_table tbody tr").length;
    var charu = $(".gome_list_table tbody tr td:last-child");
    var id = [];

    for (var i = 0; i < length; i++) {
        id.push(charu.eq(i).children("a").eq(0).attr("href") )
    }

    for (var j = 0; j < id.length; j++) {
        $(".gome_list_table tbody tr td:last-child").eq(j).append(`<a href="javascript:edit_pginfo(` + id[j].replace(/[^0-9]/ig,"").slice(0,-1) + `, '0')"><i class="splashy-contact_blue_new"></i>超级VIP</a>`)
    }
})
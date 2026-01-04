// ==UserScript==
// @name         PC万能打开
// myBlog        wangyongjie.top
// @namespace    undefined
// @version      1.0.0
// @description  王永杰PC万能打开插件
// @author       王永杰PC万能打开
// @match        *://cxcms.ds.gome.com.cn/gome-cms-web/pageGenerator/pageList.do
// @match        王永杰PC万能打开
// @downloadURL https://update.greasyfork.org/scripts/412122/PC%E4%B8%87%E8%83%BD%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/412122/PC%E4%B8%87%E8%83%BD%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

$(document).ready(function () {
    console.log("超级VIP获取成功😝")
    var length = $(".panel-default .table-bordered > tbody tr").length;
    var charu = $(".panel-default .table-bordered > tbody tr");
    var id = [];

    for (var i = 0; i < length; i++) {
        // id.push(charu.eq(i).children("a").eq(0).attr("href") )
        id.push(charu.eq(i).children("td:first-child").html() )

    }

    console.log(id,"获取成功")

    for (var j = 0; j < id.length; j++) {
        // $(".panel-default .table-bordered > tbody tr td:last-child").eq(j).append(`<a href="javascript:edit_pginfo(` + id[j].replace(/[^0-9]/ig,"").slice(0,-1) + `, '0')"><i class="splashy-contact_blue_new"></i>超级牛逼VIP</a>`)
        $(".panel-default .table-bordered > tbody tr td:last-child").eq(j).append(` <br/> <a href="javascript:void(0);" onclick="edit_pgbasicinfo('` + id[j] + `');"><i class="splashy-contact_blue_new"></i>杰哥超级VIP编辑信息😝</a>`)
        $(".panel-default .table-bordered > tbody tr td:last-child").eq(j).append(` <br/> <a href="javascript:void(0);" onclick="edit_pginfo('` + id[j] + `');"><i class="splashy-contact_blue_new"></i>杰哥超级VIP编辑页面🐂</a>`)
    }
})
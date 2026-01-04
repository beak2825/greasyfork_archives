// ==UserScript==
// @name         王永杰个人测试使用
// myBlog        wangyongjie.top
// @namespace    undefined
// @version      7.0.0
// @description  王永杰个人测试使用插件
// @author       王永杰个人测试使用
// @include      *://cms.ds.gome.com.cn
// @include      *://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/channel_pageinfo_list.do
// @match        *://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/channel_pageinfo_list.do
// @match        *://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/pageinfo_list.do
// @match        *://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/sale_pageinfo_list.do
// @match        王永杰个人测试使用
// @downloadURL https://update.greasyfork.org/scripts/388242/%E7%8E%8B%E6%B0%B8%E6%9D%B0%E4%B8%AA%E4%BA%BA%E6%B5%8B%E8%AF%95%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/388242/%E7%8E%8B%E6%B0%B8%E6%9D%B0%E4%B8%AA%E4%BA%BA%E6%B5%8B%E8%AF%95%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

$(document).ready(function () {
    console.log("超级VIP获取成功😝")
    $(".form-group #businessType option").eq(8).attr("value","10").html();

    // wang()
    function wang(){
        var length = $(".gome_list_table tbody tr").length;
        var charu = $(".gome_list_table tbody tr td:last-child");
        var id = [];
    
        for (var i = 0; i < length; i++) {
            id.push(charu.eq(i).children("a").eq(0).attr("href") )
        }
    
        for (var j = 0; j < id.length; j++) {
            $(".gome_list_table tbody tr td:last-child").eq(j).append(`<a href="javascript:edit_pginfo(` + id[j].replace(/[^0-9]/ig,"").slice(0,-1) + `, '0')"><i class="splashy-contact_blue_new"></i>超级VIP</a>`)
        }
    }

    setTimeout(function(){
        wang()
    },1000)

})
// ==UserScript==
// @name         频道页超级VIP
// myBlog        wangyongjie.top
// @namespace    undefined
// @version      0.0.1
// @description  频道页插件
// @author       频道页
// @match        *://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/channel_pageinfo_list.do
// @match        频道页
// @downloadURL https://update.greasyfork.org/scripts/412061/%E9%A2%91%E9%81%93%E9%A1%B5%E8%B6%85%E7%BA%A7VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/412061/%E9%A2%91%E9%81%93%E9%A1%B5%E8%B6%85%E7%BA%A7VIP.meta.js
// ==/UserScript==
$(document).ready(function() {
    console.log("频道页超级vip")
    // yong()
    function yong() {
        var length = $(".gome_list_table tbody tr").length;
        var charu = $(".gome_list_table tbody tr td:last-child");
        var urldom = $(".gome_list_table tbody tr td:nth-child(4)");
      var keydom = $(".gome_list_table tbody tr td:nth-child(1)");
        var id = [], wyj_url=[], wyj_key=[];

        for (var i = 0; i < length; i++) {
            id.push(charu.eq(i).children("a").eq(0).attr("href"))
            wyj_url.push(urldom.eq(i).text())
          wyj_key.push(keydom.eq(i).text())
        }

        for (var j = 0; j < id.length; j++) {
            var newSrc = wyj_url[j].replace(/ /g, '');
            var vipId = id[j].replace(/[^0-9]/ig, "");
            var vipId1 = vipId + "&url=" + newSrc + "&key=" + wyj_key[j];
            $(".gome_list_table tbody tr td:last-child").eq(j).append(`<a href="javascript:edit_pginfo('` + vipId1 + `', '0')"><i class="splashy-contact_blue_new"></i>超级VIP</a>`)
            $(".gome_list_table tbody tr td:nth-child(4)").eq(j).append(`<a target="_blank" href='` + newSrc  + `' style="font-weight: 900;">打开</a>`)
        }
        // 
        $(".my_table_center th, .my_table_center td").css({
            "fontSize": "12px",
            "fontFamily": "serif"
        })
    }
    setTimeout(function() {
        yong()
    }, 1000)
})
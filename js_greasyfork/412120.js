// ==UserScript==
// @name         app活动页&超级VIP
// myBlog        wangyongjie.top
// @namespace    undefined
// @version      8.0.2
// @description  王永杰app活动页插件
// @author       王永杰app活动页
// @match        *://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/pageinfo_list.do
// @match        *://cms.ds.gome.com.cn/gome-mobile-web/pageinfo/sale_pageinfo_list.do
// @match        王永杰app活动页
// @downloadURL https://update.greasyfork.org/scripts/412120/app%E6%B4%BB%E5%8A%A8%E9%A1%B5%E8%B6%85%E7%BA%A7VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/412120/app%E6%B4%BB%E5%8A%A8%E9%A1%B5%E8%B6%85%E7%BA%A7VIP.meta.js
// ==/UserScript==
$(document).ready(function () {
    console.log("超级VIP获取成功😝")
    // $(".form-group #businessType option").eq(8).attr("value", "10").html();

    // wang()
    function wang() {
          var mycss = `
          <style>
            .gome_list_table .goUrl {
              cursor: pointer; 
            }
            .myred {
              color:red !important;
            }
            .my_table_center th, .my_table_center td,* {
              font-size: 12px;
              font-family: serif;
            }
          </style>
          `;
        $("body").append(mycss)
      
        var length = $(".gome_list_table tbody tr").length;
        var charu = $(".gome_list_table tbody tr td:last-child");
        var urldom = $(".gome_list_table tbody tr td:nth-child(3)");
        var keydom = $(".gome_list_table tbody tr td:nth-child(1)");
        var id = [], wyj_url=[], wyj_key=[];

        for (var i = 0; i < length; i++) {
            id.push(charu.eq(i).children("a").eq(0).attr("href"))
            wyj_url.push(urldom.eq(i).text())
            wyj_key.push(keydom.eq(i).text())
        }

        for (var j = 0; j < id.length; j++) {
          // console.log(keydom)
            var newSrc = wyj_url[j].replace(/ /g,'');
            var vipId = id[j].replace(/[^0-9]/ig, "");
            var vipId1 = vipId + "&url=" + newSrc + "&key=" + wyj_key[j];
            $(".gome_list_table tbody tr td:last-child").eq(j).append(`<a href="javascript:edit_pginfo('` + vipId1 + `', '0')"><i class="splashy-contact_blue_new"></i>超级VIP</a>`)
            $(".gome_list_table tbody tr td:nth-child(3)").eq(j).append(`<a target="_blank" href="`+ newSrc +`" style="font-weight: 900;">打开</a>`)
        }
        // 复制

      $(".gome_list_table tbody tr td:nth-child(3)").addClass("goUrl")
      function copyToClip(content) {
        var aux = document.createElement("input");
        aux.setAttribute("value", content);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
      }

      $(".gome_list_table .goUrl").click(function () {
        copyToClip($(this).children("a").attr("href"))
        $(this).addClass("myred")
        // alert("复制链接成功！");
      })
    }

  
  setTimeout(function () {
      wang()
  }, 1000)
})
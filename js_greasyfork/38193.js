// ==UserScript==
// @name         bt天堂网站电影快速下载
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Chaoqun Yang
// @match        https://www.bttt.la/*
// @grant    unsafeWindow
// @grant    GM_xmlhttpRequest
// @grant    GM.xmlHttpRequest
// @grant    GM_openInTab
// @grant    GM.openInTab
// @run-at document-end
// @require     https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/38193/bt%E5%A4%A9%E5%A0%82%E7%BD%91%E7%AB%99%E7%94%B5%E5%BD%B1%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/38193/bt%E5%A4%A9%E5%A0%82%E7%BD%91%E7%AB%99%E7%94%B5%E5%BD%B1%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /** 获取url 参数*/
    function getQueryString(search,name) {
       var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = decodeURI(search).substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;//unescape 若不适用与中文  可用 decodeURI
  }
    /**form post提交窗口 用于post下载*/
    function postDownload(data){
      var form = $("<form action='https://www.bttt.la/download4.php' method='post' ></form>");
      var htmlStr = "";
      for(var key in data){
        htmlStr += "<input type='hide' name='" + key + "' value='" + data[key] + "'> ";
      }
      form.append(htmlStr);
      $("body").append(form);
      form.submit();
      form.remove();
    }
    function down(id, uhash){
        postDownload({
              "action":"download",
              "imageField.x":"104",
              "imageField.y":"25",
              "id":id,
              "uhash":uhash
            });
    }
    $(function(){
        /**遍历电影  查询详情页面 获取下载按钮*/
       $(".item.cl .title>.tt>a").each(function(i, item){
           var $this = $(this);
           var href = $this.attr("href");
           var id = /(\d{4,6}).html/.exec(href)[1];
           $.ajax({
               url: href,
               dataType:'text',
               success:function(data){
                   var flag = true;
                   var tinfoArr =  data.match(/download\/(\d+)\/([\da-z]+).+title="([^"]+).+<em>.+<\/em>/g);
                   if((flag = tinfoArr == null)) tinfoArr = data.match(/temp=yes&id=\d{4,6}&uhash=([\d\w]{20,30}).+title="([^"]+).+<em>.+<\/em>/g);
                   var htmlStr = "";
                   for(var i = 0; i < tinfoArr.length; i ++){
                       var tinfo = flag ? tinfoArr[i].match(/uhash=([\d\w]{20,30}).+title="((【[^】]+】)[^"]+).+<em>(.+)<\/em>/):
                          tinfoArr[i].match(/download\/\d+\/([\da-z]+).+title="((【[^】]+】)[^"]+).+<em>(.+)<\/em>/);
                       htmlStr += "<button class='fastDown' _id='"+id+"' _uhash="+tinfo[1]+"') title='"+tinfo[2]+"'>"+tinfo[3]+tinfo[4]+"</button>";
                   }
                   $this.closest(".title").append(htmlStr);
               }
           });
       });

        $(".tinfo a").click(function(){
            var param = this.href.match(/download\/(\d+)\/([\da-z]+)/) || [null,getQueryString(this.href,"id"),getQueryString(this.href,"uhash")];
            down(param[1],param[2]);
            return false;
        });
        $(document).on("click","button.fastDown", function(){
            down(this.getAttribute("_id"),this.getAttribute("_uhash"));
        });
    });
    // Your code here...
})();
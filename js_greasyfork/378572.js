// ==UserScript==
// @name         删除所有twitter推文
// @namespace    https://www.jianshu.com/u/15893823363f
// @version      1.0
// @description  删除当前页面所有推文
// @author       Zszen
// @match        https://twitter.com/*
// @match        https://www.twitter.com/*
// @downloadURL https://update.greasyfork.org/scripts/378572/%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89twitter%E6%8E%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/378572/%E5%88%A0%E9%99%A4%E6%89%80%E6%9C%89twitter%E6%8E%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    // $(".js-actionDelete").each(function(){
    //     $(this).click();
    //     $(".delete-action").get(0).click();
    // });
    // setTimeout(function (){
    //     window.location.reload();
    //     document.URL=location.href;
    // },5000);
    var menuTopList = $(".nav.right-actions");
    // alert(menuTopList.children().length);
    var deleteAll1 = $('<li><button><span class="text">DeleteAll</span></button></li>');
    menuTopList.append(deleteAll1);
    deleteAll1.click(function(){
        var mymessage=confirm("是否删除当前页面全部推文信息？");
		if(mymessage==true){
            $(".js-actionDelete").each(function(){
                $(this).click();
                $(".delete-action").get(0).click();
            });
        }
    });
})();
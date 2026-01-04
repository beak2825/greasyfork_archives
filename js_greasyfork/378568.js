// ==UserScript==
// @name                新浪微博一键清空
// @namespace           https://github.com/zszen
// @version             1.2
// @description         在自己主页的右上角设置中最后一项增加了一个“删除所有”的按钮，取消删除刷新网页即可
// @author              Zszen John
// @require             http://ajax.aspnetcdn.com/ajax/jquery/jquery-1.7.2.js
// @grant               none
// @include            https://weibo.com/*
// @downloadURL https://update.greasyfork.org/scripts/378568/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/378568/%E6%96%B0%E6%B5%AA%E5%BE%AE%E5%8D%9A%E4%B8%80%E9%94%AE%E6%B8%85%E7%A9%BA.meta.js
// ==/UserScript==

(function(){
    var menuLast1 = $(".gn_topmenulist.gn_topmenulist_set>ul");
    var menuLast2 = $(".gn_set.S_line1");
    var deleteAll1 = $("<li><a class='delete_all_weibo'>删除所有</a></li>");
    var deleteAll2 = $('<div class="gn_set_list"><a class="delete_all_weibo"><em class="W_ficon ficon_set S_ficon">*</em></a></div>');
    menuLast1.append(deleteAll1);
    menuLast2.append(deleteAll2);
    deleteAll1.click(deleteAllAfterConfirm);
    deleteAll2.click(deleteAllAfterConfirm);
    function deleteAllAfterConfirm(){
        var mymessage=confirm("是否删除当前页面全部微博信息？");
		if(mymessage==true){
			window.setInterval(function (){
	            $('a[action-type="fl_menu"]')[0].click();
	            $('a[title="删除此条微博"]')[0].click();
	            $('a[action-type="ok"]')[0].click();
	        },500);
		}
    }
})();

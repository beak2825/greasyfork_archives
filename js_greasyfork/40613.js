// ==UserScript==
// @name         福利吧好孩子看得见
// @namespace    theliang
// @version      1.22.729
// @icon        https://www.wnflb99.com/favicon.ico
// @description  在福利吧帖子中将隐藏的链接、文字高亮显示
// @author       Theliang
// @match        *://www.wnflb99.com/thread-*
// @match        *://www.wnflb99.com/forum.php?mod=viewthread&tid=*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @blog         http://selier.cnblogs.com/
// @license             GNU General Public License v3.0 or later
// @downloadURL https://update.greasyfork.org/scripts/40613/%E7%A6%8F%E5%88%A9%E5%90%A7%E5%A5%BD%E5%AD%A9%E5%AD%90%E7%9C%8B%E5%BE%97%E8%A7%81.user.js
// @updateURL https://update.greasyfork.org/scripts/40613/%E7%A6%8F%E5%88%A9%E5%90%A7%E5%A5%BD%E5%AD%A9%E5%AD%90%E7%9C%8B%E5%BE%97%E8%A7%81.meta.js
// ==/UserScript==

(function() {
	$(".t_f font").attr("color", "red");

	$(".t_f a>font").text("好孩子点这！");

	$(".t_f a").each(function() {
		var contains = $(this).text();
		if(contains.length < 2) {
			$(this).html("<font color='red'>好孩子点这！</font>");
		}
	});

    var html = $('td[id^="postmessage_"]').eq(0).html();

    var reg = /(<font.*?>)(https?:\/\/.*?)</g;

    console.log(html.match(reg));

    //html = html.replace(reg,function(rs){
    //	var s = rs.substring(0,rs.length-1);
    //	return "<a href='"+s+"'>"+s+"</a><";
    //});

    html = html.replace(reg,function(rs,$1,$2,offset,source){
        return $1+"<a href='"+$2+"'>"+$2+"</a><";

    });
    $('td[id^="postmessage_"]').eq(0).html(html);
})();
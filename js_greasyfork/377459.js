// ==UserScript==
// @name         煎蛋自动加载下一页
// @namespace    sac@jandan
// @version      0.2
// @description  自动加载下一页，只在 http://jandan.net/pic 启用，子页面不使用该功能，启用脚本时刷新页面将回到页面顶部，主评论框将被移动到页面顶端
// @author       Sacnussem
// @match        http*://jandan.net/pic
// @icon         https://cdn.jandan.net/static/img/favicon.ico
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377459/%E7%85%8E%E8%9B%8B%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E4%B8%8B%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/377459/%E7%85%8E%E8%9B%8B%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E4%B8%8B%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var debug=false;
    var $ = window.jQuery;
	function dbg(o){if(debug)console.log(o);}
	function info(o){console.log(o);}
    var currentList=$("#body #content #comments ol");
    var currnetPage=$("#comments > div:nth-child(4) > div > span").html().replace("[","").replace("]","");
    var loading=false;
    function loadNew(pageID){
        $.ajax({
            async:true,
            type:"GET",
            url:"pic/page-"+pageID+"#comments",
            success:function(data){
                dbg(data);
                var newHtml = $("<code></code>").append($(data));
                var list=$("#body #content #comments ol li",newHtml);
                dbg(list);
                for(var i=0;i<list.length;i++){
                    currentList.append(list[i]);
                    dbg(list[i]);
                }
                $(".comment-like, .comment-unlike").click(function () {
                    ooxx_action($(this), "comment")
                });
                $(".tucao-btn").click(function () {
                    var n = $(this);
                    var m = n.data("id");
                    var o = n.closest("li");
                    var l = o.find("div.jandan-tucao");
                    if (l.length) {
                        l.slideToggle("fast")
                    } else {
                        tucao_load_content(o, m)
                    }
                });
                loading=false;
            }
        });
    }
    function load(){
        loading=true;
        info("Load new page, id = "+(currnetPage-1))
        loadNew(currnetPage-1);
        currnetPage--;
    }
    function loadCheck(){
        if(loading)return false;
        var expectHeight=(Math.floor($(document).height()/$(window).height())-1)*$(window).height();
        var currentHeight=$(document).scrollTop();
        if(currentHeight>=expectHeight)return true;
        else return false;
    }
    function moveComment(){
		var a=$("#comments > div:nth-child(8)");
		var b=$("#commentform")
        $("#comments h3#comments").remove();
		a.remove();
		b.remove();
		$("#comments").prepend(a,b);
	}
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
	moveComment();
    $(document).bind('scroll', function() {
        if(loadCheck())load();
        dbg(loadCheck())
    });
})();
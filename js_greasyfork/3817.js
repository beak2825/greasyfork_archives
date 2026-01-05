// ==UserScript==
// @name           手机贴吧触屏版改进
// @description    去除广告，隐藏及重新显示帖子，移除悬浮按钮，界面改进
// @include        http://tieba.baidu.com/*
// @author         yechenyin
// @version        0.68
// @namespace 	   https://greasyfork.org/users/3586-yechenyin
// @require	       https://code.jquery.com/jquery-1.11.2.min.js
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/3817/%E6%89%8B%E6%9C%BA%E8%B4%B4%E5%90%A7%E8%A7%A6%E5%B1%8F%E7%89%88%E6%94%B9%E8%BF%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/3817/%E6%89%8B%E6%9C%BA%E8%B4%B4%E5%90%A7%E8%A7%A6%E5%B1%8F%E7%89%88%E6%94%B9%E8%BF%9B.meta.js
// ==/UserScript==




/****************************************************/

//默认页面刷新后“显示隐藏帖子”开关恢复关闭状态，保持不显示隐藏帖子
//如果想保存“显示隐藏帖子”开关的设置，请将true改为false
var keep_hiding = true;


//广告
var ads = [
"a.client_ghost_icon",
"ul.threads_list>div.special",
//"ul.threads_list>div[class!='tl_shadow']",
"#main>div[id^='cpro_u']",
"a.light_see_index",
"div.forum_recommend_w",
"div.first_floor_ad_wrapper",
"div[id^=cpro]",
"div.client_ad_topBanner ~ li",
"div.client_ad_topBanner",
"div[id^=BAIDU_DUP_wrapper]",
"ul.threads_list>div.tl_gap",
"ul.threads_list>div.tl_top",
"div.client_ad_top",
"ul.threads_list>li.tl_spread",
"li.first_floor_ad_wrapper",
"li.special-thread",
".more_content_btn",
"div.pb-selected-banner",
"li.special"];

/****************************************************/
jQuery.fn.hide = function(action, delay) {
  $('head').append($('<style>').text(this.selector + ' {display:none}'));
};

if ($("#tieba_sp_improved").length === 0) {
    for (i=0; i<ads.length; i++)
	if ($(ads[i]).length > 0)
	    $(ads[i]).hide();

    $("body").append($("<script>").attr("id", "tieba_sp_improved"));


if (location.href.search("http://tieba.baidu.com/f?") === 0) {

    if (localStorage.display_hidden_threads === undefined || localStorage.display_hidden_threads == "false") {
	$("li.tl_shadow>a").each(function() {
	    if (localStorage.hidden_threads && localStorage.hidden_threads.search($(this).attr("tid")) >= 0)
	        $(this).parent().hide();
	});
    }

    $("div.ti_zan_reply").each(function () {
	var hide = $("<a>", {class:"ti_func_btn", text:"隐藏"});
	hide.css({width:30, marginLeft:-6, marginRight:4});
	hide.click(toggle_thread);

	$(this).append(hide);
	//$(this).parent().appendTo(this.parentNode.parentNode.parentNode);
    });

    $("div.light_post_entrance").addClass("icon_btn blue_kit_icon new_frs_sprite_icons blue_kit_icon_post");
    $("div.light_post_entrance").css({left:"auto", right:90, bottom:"auto", top:1, "z-index":1000});

    var my_message = $("<a>", {class:"mode_setup_message_title", text:"我的消息", href:"http://tieba.baidu.com/mo/q/msg"});
    $(".mode_setup_message_title").replaceWith(my_message);
    var bawu = $("div.blue_kit_right>a[href*='bawuindex']").removeClass().addClass("mode_setup_message_title");
    bawu.css({position:"absolute", right:9});
    bawu.insertBefore($(".person_info_content"));
    //$("span.info_look").css({marginRight:15});


    var display_hidden_threads = $("ul.mode_setup_list>li:nth-child(2)").clone();
    display_hidden_threads.contents().filter(function() { return this.nodeType == 3; }).replaceWith("显示隐藏帖子");
    if (localStorage.display_hidden_threads === undefined || localStorage.display_hidden_threads == "false") {
	display_hidden_threads.children().eq(1).removeClass().addClass("mode_setup_switch switch_off");
    } else {
	display_hidden_threads.children().eq(1).removeClass().addClass("mode_setup_switch switch_on");
    }
    display_hidden_threads.children().eq(1).click(display_hidden_switch);
    $("ul.mode_setup_list").append(display_hidden_threads);

    //$("div.zan_reply").css({position: "relative", border:"none", zIndex:1}).appendTo($("#pblist>li:first-child"));
    $("#j_ghost_tool_share").removeClass().addClass("spinner_item pb_icon").css("background-position", "10px -561px").wrap("<li></li>").appendTo($("ul.more_spinner"));
    $("div#j_ghost").hide();

    $("a.pager_next, a.pager_prev").click(function() {

	for (i=0; i<ads.length; i++)
	    if ($(ads[i])[0] !== undefined)
		$(ads[i]).remove();

	if (localStorage.display_hidden_threads === undefined || localStorage.display_hidden_threads == "false") {
	    $("li.tl_shadow>a").each(function() {
		if (localStorage.hidden_threads && localStorage.hidden_threads.search($(this).attr("tid")) >= 0)
		    $(this).parent().hide();
	    });
	}

	$("a.sign-button").click();
	$("a.dia_closebtn_container").click();

	$("div.ti_author_time").each(function () {
	    var zan_btn = $(this).next().children().eq(0).children().eq(0);
	    zan_btn.css({left:"auto", float:"right", display:"inline", position:"relative", marginRight:-1, marginTop:-1});
	    var zan_num = $(this).next().children().eq(0).children().eq(1);
	    zan_num.addClass("ti_func_btn");
	    zan_num.css({left:"auto", float:"right", width:"auto", marginTop:-1, marginRight:12, display:"inline"});
	    var reply = $(this).next().children().eq(2);
	    reply.css({left:"auto", float:"right", width:"auto", marginTop:-1, marginRight:8, display:"inline"});
	    var hide = $("<a>", {class:"ti_func_btn", text:"隐藏"});
	    hide.css({float:"right", width:30, marginTop:-1, marginRight:2, display:"inline"});
	    hide.click(toggle_thread);

	    $(this).append(hide, reply, zan_num, zan_btn);
	    $(this).next().remove();
	    $(this).insertAfter($(this).parent());
	});

});

/*
    openDB().onsuccess  = function(event){
	var db = event.target.result;
	var transaction = db.transaction(["read"],"readwrite");
	var store = transaction.objectStore("read");

	if (localStorage.tieba_last_read) {
	    var last_read = localStorage.tieba_last_read.substring(url.indexOf(":")+1, url.length);
	    var url = localStorage.tieba_last_read.substring(url.indexOf(":")+1, url.length);
	    localStorage.tieba_last_read = "";
	    var request = store.get(url);
	    request.onsuccess = function(event){
		if (!request.result) {
		    console.log("Adding  " + url + " : " + last_read);
		    store.add({url: url, last: parseInt(last_read)});
		} else {
		    console.log("Updating " + url + " : " +event.target.result.last + " to " + last_read);
		    request.result.last = parseInt(last_read);
		    store.put(request.result);
		}
	    };
	}

	for (var i=0; i<$("li[class^=tl]>a.ti_item").length; i++) {
	    (function(i) {
	    var thread = $("li[class^=tl]>a.ti_item")[i];
	    var amount = parseInt($(thread).next().find("span.btn_icon").text());
	    var url = thread.href.match(/\/p\/\d+/)[0];
	    url = url.substring(url.lastIndexOf("/")+1, url.length);
	    console.log(i + ":" + amount+ ":" + url);
	    var request = store.get(url);
	    request.onsuccess = function(event){
		if (event.target.result) {
		    var start = event.target.result.last + 1;
		    if (start > amount)
			start = amount;
		    console.log(start + "::" + amount);
		    var pn = parseInt(start/50)*50;
		    thread.href = "/p/" + url + "?pn=" + pn + "&fn=" + start + "&";
		    console.log(pn + "<" + thread.href);
		}
	    };
	    })(i);
	}
}; */
}



if (location.href.search("http://tieba.baidu.com/p/") === 0) {
  //window.scrollTo(0, $('.btn more_content_close').offset().top);
  $('.btn more_content_close').click();
    if (location.href.match("&fn=")) {
	var selector = "li[fn='" + location.href.match(/fn=\d+/)[0].replace("fn=","") + "']";
	var offset = $("li[fn='" + location.href.match(/fn=\d+/)[0].replace("fn=","") + "']").offset().top;
	console.log("scroll:"+offset);
	window.scrollTo(0, offset);
	//$("html, body").animate({scrollTop:offset}, 0);
	console.log("scrollend:"+offset);
    }

    for (var i=0; i<$("#pblist>li").length; i++) {
	var c = $("#pblist>li")[i];
	if (!c.hasAttribute("tid"))
	    $(c).hide();
    }

    $("div.zan_reply").css({position: "relative", border:"none", zIndex:1}).appendTo($("#pblist>li:first-child"));
    $("#j_ghost_tool_share").removeClass().addClass("spinner_item pb_icon").css("background-position", "10px -561px").wrap("<li></li>").appendTo($("ul.more_spinner"));
    $("div#j_ghost").hide();

    $("a[href^='/mo/q/checkurl']").each(function() {
	this.href = this.innerHTML;
    });

    $(window).unload(function(){
	var last_read = $("li.list_item").last().attr("fn");
	var url = location.href.match(/\/p\/\d+/)[0];
	url = url.substring(url.lastIndexOf("/")+1, url.length);
	localStorage.tieba_last_read = url + ":" + last_read;
	console.log(localStorage.tieba_last_read);
    });
}

}


function openDB() {
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    if(!window.indexedDB)
       console.log("你的浏览器不支持IndexedDB");

    var request = window.indexedDB.open("tiebaDB", 1);
    var db;
    request.onerror = function(event){
	console.log("打开DB失败", event);
};
    request.onupgradeneeded   = function(event){
	console.log("Upgrading");
	db = event.target.result;
	var objectStore = db.createObjectStore("read", { keyPath : "url" });
	objectStore.createIndex("last", "last", { unique: false });
    };
    return request;
}

function toggle_thread() {
    if($(this).text() == "隐藏") {
	$(this).parent().parent().parent().hide();
	$(this).text("显示");
	this.parentNode.parentNode.style.display = "none";
	if (localStorage.hidden_threads === undefined)
	    localStorage.hidden_threads = "";
	localStorage.hidden_threads += $(this).parent().parent().prev().attr("tid") + " ";
    } else if($(this).text() == "显示") {
	$(this).text("隐藏");
	$(this).parent().parent().parent().show();
	var hidden_threads = localStorage.hidden_threads;
	localStorage.hidden_threads = hidden_threads.replace($(this).parent().parent().prev().attr("tid")+" ", "");
    }
}

function display_hidden_switch() {
    if (this.className.match("switch_off")) {
	$("li.tl_shadow>a").map(function() {
	    if (localStorage.hidden_threads.search($(this).attr("tid")) >= 0) {
		$(this).next().children().eq(2).text("显示");
		$(this).parent().show();
	    }
	});
	if (!keep_hiding) {
	    localStorage.display_hidden_threads = "true";
	}
	$(this).removeClass("switch_on").removeClass("switch_off").addClass("switch_on");
    } else {
	$("li.tl_shadow>a").map(function() {
	    if (localStorage.hidden_threads.search($(this).attr("tid")) >= 0) {
		$(this).next().children().eq(2).text("显示");
		$(this).parent().hide();
	    }
	});
	localStorage.display_hidden_threads = "false";
	$(this).removeClass("switch_on").removeClass("switch_off").addClass("switch_off");
    }
}

// ==UserScript==
// @name        Kona-chan cleanup
// @namespace   http://www.konachan.* scroll/
// @description A small userscript to ease to browsing of konachan.net
// @include     http://*konachan.net/post?*
// @include     https://*konachan.net/post?*
// @include     http://*konachan.net/post
// @include     https://*konachan.net/post
// @include     http://*konachan.net/post/show/*
// @include     https://*konachan.net/post/show/*
// @version     1.0.5
// @require     http://code.jquery.com/jquery-2.2.1.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/26840/Kona-chan%20cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/26840/Kona-chan%20cleanup.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);

if(window.location.pathname == "/post") {
    var pageNum = 1;
    var list = $('#post-list-posts');
    GM_addStyle("#post-list-posts img {min-height: 100px;} #post-list .content {  } #post-list-posts li { width: auto; height: 100%;padding-right: 5px; } #post-list-posts li img { display: block; } #post-list-posts li a {width: 100%; display: inline-block; text-align: center; background: #2A1E1E; } #post-list-posts li a:hover {background: #514747;}");
    GM_addStyle(".sidebar > div:first-child { position: fixed;    top: 150px;    left: 40px;    background: rgb(34, 34, 34); margin: 0; } .sidebar > div { margin-top:30px; } .sidebar { width: auto !important; margin-top: 40px;} .internalContent {display: block; margin-left: 210px} iframe {display: block;}");
    list.html("");
    list.css('display', 'inline-block');
    list.parent().css('margin-top', '1rem');
    $(".lsidebar").appendTo($('.sidebar').first().children().last().prev()).css('float', 'unset');
    $("#paginator").hide();
	document.querySelector("#post-list .content").className = "internalContent";
    var tags = "";
    try {
        var arr = window.location.search.split("?")[1].split("&");
        for (var i = 0; i < arr.length; i++) {
            var tagarr = arr[i].split("=");
            if (tagarr[0]== "tags") {
                tags = tagarr[1];
                break;
            }
        }
    } catch(err) {}
    var ad = $($(".content")[0]);
	$(".content .content").removeClass("content");
    var nexting = false;
    function nextPage () {
        if(!nexting) {
            nexting = true;
            $.get((/.*\.net.*/i.test(window.location.host) ? "http://konachan.net/post.json?limit=24&page=" : "http://konachan.com/post.json?limit=24&page=") + (pageNum++) + "&tags=rating:safe%20"+ tags, {data: 'here'}, function(data) {
                data.forEach(function(image) {
                    list.append("<li><a href=\"/post/show/" + image.id + "\" target=\"_blank\"><img src=\""+ image.preview_url + "\" title=\"" + image.tags + "\" alt=\"" + image.tags + "\" />" + image.width + "x" + image.height + "</a></li>");
                });
               //$(list).append(ad.html());
            });
            $('.sidebar iframe').slice(0,2).clone().appendTo($('.sidebar').first().find('iframe').first().parent())
            setTimeout(function() { nexting = false; }, 200);
        }
    }
    $(window).bind('scroll', function(e) {
        if($(document).scrollTop() + $(window).height()>=$(document).height() - 500)
        {
            nextPage();
        }
    });
    nextPage();
    $($("#tag-sidebar").parent()).hide();
    $("#blacklisted-sidebar").hide();
} else {
    GM_addStyle("#image { width: calc(100vw - 30%); margin-right: 0 !important; padding-right: 2rem; box-sizing: border-box;}");
    var imi = document.getElementById("image");
    imi.removeAttribute("width");
    imi.removeAttribute("height");
    imi.removeAttribute("large_width");
    imi.removeAttribute("large_height");
}

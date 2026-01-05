// ==UserScript==
// @name         163music
// @namespace    http://ouo.us/
// @version      1.5
// @description  播放那些因版权无法播放的云音乐
// @author       pojtt
// @match        *://music.163.com/*
// @grant        GM_addStyle
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28573/163music.user.js
// @updateURL https://update.greasyfork.org/scripts/28573/163music.meta.js
// ==/UserScript==

(function() {
    var song = function() {
        if ($("a.u-btni-play") && $("a.u-btni-play").length>0) {
            $("a.u-btni-play").html('<i>喵阅播放</i>');
            $("a.u-btni-play").attr('title','使用喵阅播放♪');
            $("a.u-btni-play").removeClass('u-btni-play-dis');
            $("a.u-btni-play").attr('onclick',"window.open('http://ouo.us/fm/163/?id="+$("a.u-btni-play").parent().attr("data-rid")+"#min','163','height=478,width=333,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');");
        } else {
            $("em.f-ff2").after('<a title="使用喵阅播放♪" onclick="window.open(\'http://ouo.us/fm/163/?id='+$("a.u-btni-addply").attr("data-res-id")+'#min\',\'163\',\'height=478,width=333,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no\');"><img src="//ooo.0o0.ooo/2017/05/09/591159a158823.png"></a>');
        }
    };
    var list = function() {
        if ($(".m-table") && $(".m-table").length>0) {
            GM_addStyle("div[class^='auto-']{display:none}.m-table .js-dis *{color:#5791B5!important}");
            $(".m-table tr.js-dis").each(function(){
                var $ply = $(this).find("span.ply");
                $ply.attr('style','opacity:1;cursor:pointer');
                $ply.attr('title','使用喵阅播放♪');
                $ply.attr('onclick',"window.open('http://ouo.us/fm/163/?id="+$ply.attr("data-res-id")+"#min','163','height=478,width=333,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');");
            });
        }
    };
    var search = function() {
        if ($("#m-search") && $("#m-search").length>0) {
            GM_addStyle("div[class^='auto-']{display:none}.n-srchrst .srchsongst .js-dis *{color:#5791B5!important}.u-page{display:block!important}");
            $("#m-search div.js-dis").each(function(){
                var $ply = $(this).find("a.ply");
                $ply.attr('style','opacity:1;cursor:pointer');
                $ply.attr('title','使用喵阅播放♪');
                $ply.attr('onclick',"window.open('http://ouo.us/fm/163/?id="+$ply.attr("data-res-id")+"#min','163','height=478,width=333,top=0,left=0,toolbar=no,menubar=no,scrollbars=no, resizable=no,location=no, status=no');");
            });
            $(".u-page a").bind('click', function(){
                window.setTimeout(search,345);
            });
        }
    };
    var binds = function() {
        if (location.href.indexOf('/song')>0) {
            song();
        } else if (location.href.indexOf('/search')>0) {
            window.setTimeout(search,423);
        } else if (location.href.indexOf('/my')>0) {
            window.setTimeout(list,423);
        } else if (location.href.indexOf('/album')>0 || location.href.indexOf('/artist')>0 || location.href.indexOf('/playlist')>0) {
            list();
        }
    };
    binds();
    $(window).bind('hashchange', function() {
        binds();
    });
})();
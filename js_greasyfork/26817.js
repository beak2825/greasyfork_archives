// ==UserScript==
// @name         2chScript
// @namespace    https://greasyfork.org/ja/users/94414
// @version      0.1.1
// @description  ブラウザから見る2ch.netを強化（新鯖のみ対応）
// @author       Petitsurume
// @match        http://*.2ch.net/test/read.cgi/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant   GM_getValue
// @grant   GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/26817/2chScript.user.js
// @updateURL https://update.greasyfork.org/scripts/26817/2chScript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(function(){
        var ng_ids = JSON.parse(GM_getValue("2ch_ng_ids","[]"))
        var filter_flag=false
        console.log("NG:",ng_ids)
        function setNGCSS(){
            ng_ids.forEach(function(id){
                var $post = $('.post[data-userid="'+id+'"]')
                $post.find(".name").html("<b>あぼーん</b>")
                $post.find(".message").text("あぼーん")
                $post.find(".date").text("あぼーん(UserScript "+id+")")
                var $$hide_link=$("<a>")
                $$hide_link.attr("href","#"+Math.random())
                $$hide_link.css("margin-left","0.5em")
                $$hide_link.click(function(){
                    $('.post[data-userid="'+id+'"]').hide()
                })
                $$hide_link.text("[透明化]")
                $post.find(".date").append($$hide_link)
            })
        }
        function addNG(id){
            ng_ids.push(id)
            GM_setValue("2ch_ng_ids",JSON.stringify(ng_ids))
            setNGCSS()
        }
        $(".post").each(function(){
            var $post = $(this)
            var $date = $post.find(".date")
            var $message = $post.find(".message")
            var userid = $post.data("userid")
            var isAnon = (userid == "ID:???" || userid =="")
            // 発言カウンター
            if(!isAnon) {
                var $$counter = $("<span>")
                if($('.post[data-userid="'+userid+'"]').length > 5) $$counter.css("color","#a00"); else $$counter.css("color","#888")
                var count = "??"
                var _count=0
                $('.post[data-userid="'+userid+'"]').each(function(){
                    _count++
                    if($(this).data("id") == $post.data("id")) count=_count
                        })
                $$counter.text(" ("+count+"/"+($('.post[data-userid="'+userid+'"]').length)+"回発言)")
                $date.append($$counter)
            }
            // NGリンク
            if(userid !== "") {
                var $$ng_link = $("<a>")
                $$ng_link.attr("href","#."+Math.random())
                $$ng_link.text("[IDをNG]")
                $$ng_link.css("margin-left","0.5em")
                $$ng_link.click(function(e){
                    e.preventDefault()
                    if(!confirm(userid+"をNGします")) return
                    addNG($post.data("userid"))
                        })
                $date.append($$ng_link)
            }
            // 抽出リンク
            if(userid !== "") {
                var $$filter_link = $("<a>")
                $$filter_link.attr("href","#."+Math.random())
                $$filter_link.text("[IDで抽出]")
                $$filter_link.css("margin-left","0.5em")
                $$filter_link.addClass("filter_link")
                $$filter_link.click(function(e){
                    e.preventDefault()
                    if(filter_flag){
                        filter_flag=false
                        $(".filter_link").text("[IDで抽出]")
                        $(".post").removeClass("filter_gisei")
                        return
                    }
                    $(".post").each(function(){
                        var $post=$(this)
                        if($post.data("userid") != userid) $post.addClass("filter_gisei")
                            })
                    $(".filter_link").text("[抽出をやめる]")
                    filter_flag = true
                })
                $date.append($$filter_link)
            }
            // リンク解析
            var $preview = $("<div>")
            $message.append($preview)
            $message.find("a").each(function(){
                var $link = $(this)
                var url =  $link.text()
                var hostname = $("<a>").attr("href",$link.text()).get(0).hostname
                if($link.text().substring(0,2) == ">>") { // アンカー
                    $link.attr("href",location.href.replace(location.hash,"")+"#"+$link.text().substring(2))
                    $link.attr("target","")
                }
                if(hostname == "i.imgur.com") { // imgur プレビュー
                    var $$img_a = $("<a>")
                    var $$img = $("<img>")
                    $$img.attr("src",url)
                    $$img_a.attr("href",url)
                    $$img.css("width","3em")
                    $$img.css("height","3em")
                    $$img_a.attr("target","_blank")
                    $$img_a.append($$img)
                    $preview.append($$img_a)
                }
            })
        })
        $("body").append($("<style>.filter_gisei{display:none;}</style>"))
        setNGCSS()
    })
})();
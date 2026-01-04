// ==UserScript==
// @name         Tower Record in One Screen
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Tower Record in One Screen (Personal use)
// @author       InfinityLoop
// @match        https://tower.jp/search/advanced/*
// @require      http://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/clipboard.js/2.0.4/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/376151/Tower%20Record%20in%20One%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/376151/Tower%20Record%20in%20One%20Screen.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var clipboard = new ClipboardJS('.btn');

    // フレームを入れる
    $("#headerNav").after("<div class='newFrame'></div>")
    $(".newFrame").before($(".searchPagerWrap02").clone())
    // リストを処理
    $(".discographyTableDivLine01.cfix").map(function(i, b) {
        // 画像とタイトルを抽出する
        var imgAndTitle = $(this).children(".discographyTableImg01").children("p").children("a").children("img")
        // 画像リンク
        var imgLink = imgAndTitle.attr("src")
        var imgTitle = imgAndTitle.attr("alt")
        // アーティストと発売日を抽出する
        var artistAndDate =  $(this).children(".discographyTable01In")
        // タイトルのリンク
        var titleLink = artistAndDate.children(".title").children("a").attr("href")
        // アーティスト
        var artist = artistAndDate.children(".artist").text()
        // アーティストリンク
        var artistLink = "https://tower.jp" + artistAndDate.children(".artist").children("a").attr("href")
        // 発売日
        var date = artistAndDate.children(".categoryDiscographyColumn.cfix").children(".discographyDl01").children("dd:first").text().replace("年", "-").replace("月", "-").replace("日", "")
        // オブジェクトを作成する
        $(".newFrame").append("<div class='object' style='display: inline-block; padding: 10px; width:150px; border: 1px solid'><div><img src='" + imgLink +
                              "' width='100px'></img></div><div><a href='" + titleLink +
                              "'> " + imgTitle +
                              "</a><a target='_blank' href='https://www.amazon.co.jp/s/ref=nb_sb_noss?__mk_ja_JP=カタカナ&url=search-alias%3Daps&field-keywords=" + imgTitle + "+" + artist + "'><button type='button'>Amazon</button></div><div><a href='" + artistLink +
                              "' style='color:red'>" + artist +
                              "&nbsp</a><button class='btn' data-clipboard-text='" + artist +
                              "'>copy</button></div><button class='btn' data-clipboard-text='" + date +
                              "'>" + date + "</button><input type='button' style='margin: 5px' value='(C)RS' onclick=document.getElementsByTagName('iframe')[0].setAttribute('src','" + titleLink + "')></input></div>")
    })


    $(".newFrame").append('<div id="radiodiv" style="width:1000px; height:300px; overflow:hidden; position:relative"><iframe src="" height="1800" width="1000" class="crsText" style="position:absolute;top:-800px;left:-30px" marginwidth="0" marginheight="0" frameborder="1"></iframe></div>')

})();
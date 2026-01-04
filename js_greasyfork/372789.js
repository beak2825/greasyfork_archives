// ==UserScript==
// @name         TweetDeckの文字入力欄を見やすくする
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  TweetDeckの文字入力欄を入力文字の行数に合わせます。
// @author       RPL_LSF
// @match        https://tweetdeck.twitter.com/*
// @grant        none
/* load jQuery */
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372789/TweetDeck%E3%81%AE%E6%96%87%E5%AD%97%E5%85%A5%E5%8A%9B%E6%AC%84%E3%82%92%E8%A6%8B%E3%82%84%E3%81%99%E3%81%8F%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/372789/TweetDeck%E3%81%AE%E6%96%87%E5%AD%97%E5%85%A5%E5%8A%9B%E6%AC%84%E3%82%92%E8%A6%8B%E3%82%84%E3%81%99%E3%81%8F%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==
setTimeout(function(){
    //テキストエリアにIDを追加
    var $textarea = $('textarea');
    $textarea.eq(0).attr('id','ta');

    //テキストエリアを入力行数に合わせる
    //参考：https://qiita.com/YoshiyukiKato/items/507b8022e6df5e996a59
    $("#ta").height(30);//init
    $("#ta").css("lineHeight","20px");//init

    $("#ta").on("input",function(evt){
        if(evt.target.scrollHeight > evt.target.offsetHeight){
            $(evt.target).height(evt.target.scrollHeight);
        }else{
            var lineHeight = Number($(evt.target).css("lineHeight").split("px")[0]);
            while (true){
                $(evt.target).height($(evt.target).height() - lineHeight);
                if(evt.target.scrollHeight > evt.target.offsetHeight){
                    $(evt.target).height(evt.target.scrollHeight);
                    break;
                }
            }
        }
    });
},1000);
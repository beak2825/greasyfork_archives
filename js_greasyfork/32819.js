// ==UserScript==
// @name         Knzkru-button
// @namespace    https://github.com/yuzulabo
// @version      1.0.3
// @description  南無りまくれぇ！(神崎おにいさんver)
// @author       neziri_wasabi (yuzu_1203)
// @match        https://knzk.me/*
// @license       MIT License
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/32819/Knzkru-button.user.js
// @updateURL https://update.greasyfork.org/scripts/32819/Knzkru-button.meta.js
// ==/UserScript==

/*

 神崎おにいさんボイスについて
 1: 可視光線様のKNZK_ZONEの一部を使用しています。: http://nico.ms/sm31146004
 2: 「溺れ死ぬボーちゃんの深海少女。を歌ってみた」の一部を使用しています。：http://nico.ms/sm31734029

 これらの音声はスクリプト作者の個人サーバにアップロードされていますが、問題があればお問い合わせください。

 連絡先: https://knzk.me/@y
*/
(function() {
    var css = ".star-icon, .icon-button {filter: grayscale(100%);}.fa-star:before{content: \"\\1F60B\";white-space: nowrap;} .star-icon.active, .icon-button.active {filter: none;}";

    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));

    var heads = document.getElementsByTagName("head");
    heads[0].appendChild(node);

    var audio_element  = Array();
    var audio_src  = Array();
    var audio_d = Array();

    audio_src[0] = "https://yuzu.tk/files/yuzu_1203/knzk.wav";
    audio_src[1] = "https://yuzu.tk/files/yuzu_1203/knzk2.wav";
    audio_src[2] = "https://yuzu.tk/files/yuzu_1203/knzk3.wav";
    audio_src[3] = "https://yuzu.tk/files/yuzu_1203/knzk4.wav";

    var i = 0;
    while (audio_src[i]) {
        audio_element[i] = document.createElement("audio");
        audio_element[i].src = audio_src[i];
        audio_element[i].setAttribute('controls', '0');
        audio_element[i].setAttribute('id', 'namuru'+i+'_audio');
        audio_element[i].setAttribute('preload', 'auto');

        heads[0].appendChild(audio_element[i]);
        audio_d[i] = document.getElementById('namuru'+i+'_audio');
        i++;
    }

    var audio_mode = 9999;
    $(document).on('click', 'button.star-icon', function(event) {
        audio_mode = 9999;
        audio_mode = Math.floor(Math.random()*audio_src.length);

        audio_d[audio_mode].currentTime = 0;
        audio_d[audio_mode].play();

        console.log("南無！");
    });
})();

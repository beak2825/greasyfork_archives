// ==UserScript==
// @name         Namuru-button
// @namespace    https://github.com/yuzulabo
// @version      1.4.4
// @description  南無りまくれぇ！
// @author       neziri_wasabi (yuzu_1203)
// @match        https://knzk.me/*
// @license       MIT License
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/32694/Namuru-button.user.js
// @updateURL https://update.greasyfork.org/scripts/32694/Namuru-button.meta.js
// ==/UserScript==

/*
 「ゴーン」効果音について
フリー素材を使用しています。魔王魂: http://maoudamashii.jokersounds.com/

「チーン」効果音について
フリー素材を使用しています。http://nico.ms/nc42872

 木魚　効果音について
 フリー素材を使用しています。http://nico.ms/nc92438

 レア音声：神崎おにいさんについて
 1: 可視光線様のKNZK_ZONEの一部を使用しています。: http://nico.ms/sm31146004
 2: 「溺れ死ぬボーちゃんの深海少女。を歌ってみた」の一部を使用しています。：http://nico.ms/sm31734029

 これらの音声はスクリプト作者の個人サーバにアップロードされていますが、問題があればお問い合わせください。
 連絡先: https://knzk.me/@y
*/
(function() {
    var css = ".star-icon, .icon-button {filter: grayscale(100%);}.fa-star:before{content: \"\\1F64F\" !important;white-space: nowrap;} .star-icon.active, .icon-button.active {filter: none;}";

    // 旧版「ﾅﾑ」ボタンを有効化するには次の行のコメントアウトを削除
    // css = ".fa-star:before {content: \"ﾅﾑ\";white-space: nowrap;}";

    var node = document.createElement("style");
    node.type = "text/css";
    node.appendChild(document.createTextNode(css));

    var heads = document.getElementsByTagName("head");
    heads[0].appendChild(node);

    var audio_element  = Array();
    var audio_src  = Array();
    var audio_d = Array();
    var rand_sp = Array();
    var rand_def = Array();

    rand_def[0] = 0;
    audio_src[0] = "https://yuzu.tk/files/yuzu_1203/gooooon.wav";

    rand_sp[0] = 1;
    audio_src[1] = "https://yuzu.tk/files/yuzu_1203/knzk.wav";

    rand_def[1] = 2;
    audio_src[2] = "https://yuzu.tk/files/yuzu_1203/nc42872.wav";

    rand_sp[1] = 3;
    audio_src[3] = "https://yuzu.tk/files/yuzu_1203/knzk2.wav";

    rand_def[2] = 4;
    audio_src[4] = "https://yuzu.tk/files/yuzu_1203/nc92438.wav";

    rand_sp[2] = 5;
    audio_src[5] = "https://yuzu.tk/files/yuzu_1203/knzk3.wav";

    rand_sp[3] = 6;
    audio_src[6] = "https://yuzu.tk/files/yuzu_1203/knzk4.wav";

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

    var rand_def_mode = 0;
    var rand_sp_mode = 0;
    var audio_rand = 0;
    var audio_mode = 9999;
    $(document).on('click', 'button.star-icon', function(event) {
        audio_mode = 9999;
        audio_rand = Math.floor( Math.random() * 10000 );
        rand_def_mode = Math.floor(Math.random()*rand_def.length);
        rand_sp_mode = Math.floor(Math.random()*rand_sp.length);

        if (audio_rand < 334) {
            audio_mode = rand_sp[rand_sp_mode];
        } else {
            audio_mode = rand_def[rand_def_mode];
        }

        audio_d[audio_mode].currentTime = 0;
        audio_d[audio_mode].play();

        console.log("南無！");
    });
})();

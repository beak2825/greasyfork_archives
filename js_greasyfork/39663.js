// ==UserScript==
// @name         pornhub video frame changer
// @namespace    http://ncii.kr/
// @copyright    2018, ncii.kr
// @version      1.0.100
// @description  pornhub video frame changer !! 
// @icon         https://www.google.com/s2/favicons?domain=www.pornhub.com
// @author       You
// @match        *://www.pornhub.com/view_video*
// @run-at       document-end
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/39663/pornhub%20video%20frame%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/39663/pornhub%20video%20frame%20changer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var player_container = document.getElementsByClassName('playerFlvContainer')[0];
    var info_container = document.getElementsByClassName('video-actions-menu')[0];
    var info_container2 = document.getElementsByClassName('video-actions-container')[0];
    info_container.remove();
    info_container2.remove();
    player_container.remove();
    var el = document.getElementById('player');
    var idx = el.getAttribute('data-video-id');
    var quality = eval("qualityItems_" + idx);


    var qu_txt;
    var down_link;
    var convert_qua;
    var max_qua = [];
    var save_link = [];
    for (var i = 0; i < quality.length; i++){
        qu_txt = quality[i].text;
        down_link = quality[i].url;
        convert_qua = qu_txt.replace(/[^0-9]/g,'');
        if (convert_qua < 1080){
            max_qua.push(convert_qua);
            save_link.push(down_link);
        };
    };
    var max_ = (Math.max.apply(Math,max_qua));
    for (var l = 0; l < save_link.length; l++){
        var now_ = save_link[l];
        var match_link = now_.indexOf(max_);
        if ( match_link != -1 ){
            var inject_video = document.createElement('video');
            inject_video.setAttribute('controls','');
            inject_video.setAttribute('name','media');
            inject_video.setAttribute('class','html5-download-video');
            var createSource = document.createElement('source');
            createSource.setAttribute('src',now_);
            createSource.setAttribute('type','video/mp4');
            document.getElementById('player').appendChild(inject_video);
            document.getElementsByClassName('html5-download-video')[0].appendChild(createSource);
            break;
        };
    };


})();
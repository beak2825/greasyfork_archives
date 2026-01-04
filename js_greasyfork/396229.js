// ==UserScript==
// @name         Polyv Shorcode
// @namespace    https://www.iplaysoft.com
// @version      0.41
// @description  Polyv Shorcode for wordpress.
// @author       X-Force
// @match        http://my.polyv.net/*
// @match        https://my.polyv.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396229/Polyv%20Shorcode.user.js
// @updateURL https://update.greasyfork.org/scripts/396229/Polyv%20Shorcode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(window.location.protocol != "https:"){
        var newUrl = window.location.href.replace("http://", "https://");
        window.location=newUrl;
    }

    //Remove KeFu
    setTimeout(function(){
        //document.getElementById( 'zhichiBtn' ).style.display = 'none';
        var elem = document.getElementById( 'zhichiBtnBox' );
        elem.parentNode.removeChild(elem);
    },1500);

    var template = '[video url="{{url}}" youku="" vqq="" bilibili=""]{{url}}[/video]';
    var urlBase = 'https://share.polyv.net/front/video/preview?vid=';

    var vids = document.getElementsByClassName("video-list__duration");
    for(var i=0;i<vids.length;i++){
        var copy = vids[i].getElementsByClassName("copy-vid")[0];
        var id = copy.getAttribute('data-clipboard-text');
        var url= urlBase+id;
        var data= template.replace(/{{url}}/g,url);
        copy.setAttribute('data-clipboard-text',data);
    }
})();
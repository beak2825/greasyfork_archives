// ==UserScript==
// @name         BYUtv Facebook Share
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Share videos on facebook
// @author       Kevin Butler
// @match        https://www.byutv.org/player/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394744/BYUtv%20Facebook%20Share.user.js
// @updateURL https://update.greasyfork.org/scripts/394744/BYUtv%20Facebook%20Share.meta.js
// ==/UserScript==


setTimeout(function() {
    'use strict';
    //debugger;

    let bannerInfo = document.querySelector('.player-banner .info'),
        fbRoot = document.getElementById('fb-root');
    if ( bannerInfo && !fbRoot ) {
        let button = document.createElement('div');
        button.setAttribute('class', 'fb-share-button');
        button.setAttribute('data-href', document.URL);
        button.setAttribute('data-layout', 'button_count');

        bannerInfo.append(button);

        let ext = document.createElement('div');
        ext.class='fb-share';
        ext.innerHTML = `<div id='fb-root'></div>`;
        document.body.append(ext);

        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
            fjs.parentNode.insertBefore(js, fjs);
        })(document, 'script', 'facebook-jssdk');
    }
}, 1000);
// ==UserScript==
// @name         Youtube Gray-Out
// @namespace    http://do20c2oidj11xsy0ujgb2.com
// @version      1.1
// @description  Overlay thumbnails of already watched videos with white layer and view counter. Aims to counteract Youtube's clickbait design.
// @author       BakaChan777
// @run-at       document-end
// @match        https://*.youtube.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/22124/Youtube%20Gray-Out.user.js
// @updateURL https://update.greasyfork.org/scripts/22124/Youtube%20Gray-Out.meta.js
// ==/UserScript==

(function( A, B, C, D, E, F, X, T ){
    'use strict';

    E = document.createElement('div');
    E.style.width = '100%';
    E.style.height = '100%';
    E.style.position = 'absolute';
    E.style.backgroundColor = 'white';
    E.style.opacity = 0.8;
    E.style.top = '0px';
    E.style.lineHeight = '100%';
    E.style.fontSize = '50px';
    E.style.display = 'flex';
    E.style.alignItems = 'center';
    E.style.zIndex = '5000';
    E.style.justifyContent = 'center';
    E.style.color = '#ff9bf1';

    function check(){

        window.location.href==X || evaluate();
        fix_thumbnails();
    }

    function fix_thumbnails(){
        C = document.querySelectorAll('[href^="/watch"] img[src]:not([grayout-status])');
        if(!C.length) return;

        A = GM_getValue('YoutubeSeenVideos', {});
        D = Object.getOwnPropertyNames(A);

        for(var x=0; x<C.length; x++){
            for(var y=0; y<D.length; y++) if(C[x].src.indexOf(D[y])!=-1){
                F = C[x].parentNode.insertBefore(E.cloneNode(),C[x]);
                F.innerHTML = A[D[y]]; break;
            };
            C[x].setAttribute('grayout-status', true);
        }
    }

    function is_fixed(e,s){
        if((s=e.getAttribute('grayout-status'))==undefined) return false;
        return true;
    }

    function is_video_page(){
        return window.location.href.indexOf('watch') != -1;
    }

    function update_video_list(){
        B=/v=([a-zA-Z0-9-_]+)/g.exec(window.location.href)[1];
        A[B]===undefined && (A[B]=0); A[B]++;

        //update or generate thumbnail of current video

        for(var x = 0, y = document.querySelectorAll('img[src*="'+B+'"]'); x<y.length; x++){
            if(y[x].parentNode.firstChild == y[x])
                F = y[x].parentNode.insertBefore(E.cloneNode(),y[x]);
            else
                F = y[x].parentNode.firstChild;
            F.innerHTML = A[B];
        }
    }

    function evaluate() {
        A = GM_getValue('YoutubeSeenVideos', {});
        X = window.location.href;

        is_video_page() && update_video_list();
        GM_setValue('YoutubeSeenVideos', A);
    }

    window.addEventListener('yt-visibility-refresh', check);
    check();

})();
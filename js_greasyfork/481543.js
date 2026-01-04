// ==UserScript==
// @name         Filma24 pa reklama
// @namespace    https://t.me/miridev
// @version      1.2
// @description  Filma24 ad
// @author       Miri
// @include        *://*.filma24.tld/*
// @icon         https://www.filma24.pl/wp-content/themes/cr_filma_greenv2/assets/img/favicon.ico
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481543/Filma24%20pa%20reklama.user.js
// @updateURL https://update.greasyfork.org/scripts/481543/Filma24%20pa%20reklama.meta.js
// ==/UserScript==


(function() {
    'use strict';

    try{
        document.body.innerHTML += `<style>.loader-wrapper{position: fixed; top: 0;left: 0;width: 100%;height: 100%;background-color: rgba(15 118 145 / 100%); display: flex; justify-content: center; align-items: center; z-index: 9999;}
        .loader{border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite;}
        @keyframes spin{0% {transform: rotate(0deg);} 100% {transform: rotate(360deg);}}
        .loaded .loader-wrapper{display: none;}</style>
        <div class="loader-wrapper" id="loader"><div class="loader"></div></div>`;
        setTimeout( function(){ document.getElementById('loader').remove(); },3000);
    }catch(e){console.log('1');}



    let rundel = setInterval(runn, 1000);
    var llog = 0;

    function runn() {
        try{
            var doc = document;
            //console.log('load '+llog);
            doc.getElementsByTagName('title')[0].innerText = 'Filma dhe seriale me Titra Shqip HD';
            var bod = doc.getElementsByTagName('body')[0];

            if(bod.getElementsByTagName('b-int')[0] != undefined ){
                bod.getElementsByTagName('b-int')[0].remove();
                bod.style.overflow = "auto";
            }

            if(bod.getElementsByTagName('b-hgrid')[0] != undefined){
                bod.getElementsByTagName('b-hgrid')[0].remove();
            }

            if(bod.getElementsByClassName('fab-fa-instagram')[0] != undefined ){
                bod.getElementsByClassName('fab-fa-instagram')[0].remove();
            }

            if(bod.getElementsByClassName('fab-fa-tiktok')[0] != undefined){
                bod.getElementsByClassName('fab-fa-tiktok')[0].getElementsByClassName('fab-fa-tiktok')[0].href='https://www.tiktok.com/@mirimiri9049/';
            }

            if(bod.getElementsByClassName('njt-nofi-container')[0] != undefined){
                var ale = bod.getElementsByClassName('njt-nofi-container')[0];
                ale.getElementsByClassName('njt-nofi-text njt-nofi-padding-text')[0].innerText ='Per me shume info ';
                ale.getElementsByTagName('a')[0].href = 'https://t.me/miridev';
                ale.getElementsByTagName('a')[0].innerText = 'Kliko ketu';
            }

            if(document.getElementsByTagName('footer')[0] != undefined){
                var fot = document.getElementsByTagName('footer')[0].getElementsByTagName('a');
                for(var i=0;i<fot.length;i++){
                    fot[i].href = 'https://t.me/miridev';
                    fot[i].innerText = 'Telegram';
                }
                document.getElementsByTagName('footer')[0].getElementsByClassName('text-center mb-0')[0].innerHTML ='Copyright © '+new Date().getFullYear()+' | Filma24 MOD by <a target="_blank" href="https://t.me/miridev">Miri</a>';
            }


            if(bod.getElementsByClassName('footer-reklama')[0] != undefined){
                bod.getElementsByClassName('footer-reklama')[0].remove();
            }

            if(doc.getElementById('vidad') != undefined){
                doc.getElementById('vidad').remove();
            }

            if(doc.getElementById('f24ytb') != undefined){
                doc.getElementById('f24ytb').remove();
            }



            var cont = bod.getElementsByClassName('container-lg')[0];

            if(cont.getElementsByClassName('col-4')[0] != undefined){
                cont.getElementsByClassName('col-4')[0].remove();
            }
            if(doc.getElementById('disqus_thread') != undefined){
                doc.getElementById('disqus_thread').remove();
            }

            var lee = cont.getElementsByClassName('col-12 text-center mb-2');
            if(lee != undefined){
                for(var ii=0;ii<lee.length;ii++){
                    lee[ii].remove();
                }
            }

            var leee = cont.getElementsByClassName('col-12 text-center mb-3');
            if(leee != undefined){
                for(var e=0;e<leee.length;e++){
                    leee[e].remove();
                }
            }

            var leeee = cont.getElementsByClassName('col-12 text-center mb-4');
            if(leeee != undefined){
                for(var ee=0;ee<leeee.length;ee++){
                    leeee[ee].remove();
                }
            }



            if(llog >10){
                clearInterval(rundel);
            }
            llog++;

        }catch(e){console.log('2');}
    }
})();
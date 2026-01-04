// ==UserScript==
// @name         PopSpins (Bot)
// @icon         https://icons.duckduckgo.com/ip2/popspins.com.ico
// @version      0.1.8
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para PopSpins, aumenta tus ganancias.
// @author       wuniversales
// @include      https://popspins.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/37236-monkeyconfig/code/MonkeyConfig.js
// @grant        GM_Config
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416640/PopSpins%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416640/PopSpins%20%28Bot%29.meta.js
// ==/UserScript==

var cfg = new MonkeyConfig({
    title: 'Configuración',
    menuCommand: true,
    params: {
        Auto_reclamo: {
            type: 'checkbox',
            default: true
        },
        Auto_girar: {
            type: 'checkbox',
            default: true
        },
        Esconder_publicidad: {
            type: 'checkbox',
            default: true
        },
    }
});

var autoreclamo=cfg.get('Auto_reclamo');
var autogirar=cfg.get('Auto_girar');
var esconderpublicidad=cfg.get('Esconder_publicidad');

(function() {
    'use strict';
    function sleep(milliseconds) {const date = Date.now();let currentDate = null;do {currentDate = Date.now();} while (currentDate - date < milliseconds);}
    function aleatorio(min,max) {return Math.round(Math.random() * (max - min) + min);}
    var numaleatorio=null;
    $(document).ready(function(){
        //if(location.hostname=='popspins.com'){if(window.location.pathname.indexOf("/trivia.php")==0){setInterval(function(){try{diff=100000;}catch(e){}},1000);}}
        if(autoreclamo==true){
            async function autoreclamo() {
                if(location.hostname=='popspins.com'){
                    setInterval(function(){
                        if($('div#claimouter').is(':visible')==true){
                            $('div#claimouter > a#requestdaily')[0].click();
                        }
                        if($('div.swal-overlay.swal-overlay--show-modal > div > div.swal-footer > div > button.swal-button.swal-button--confirm').is(':visible')==true){
                            $('div.swal-overlay.swal-overlay--show-modal > div > div.swal-footer > div > button.swal-button.swal-button--confirm').click();
                        }

                    },1000);
                }
            }
            autoreclamo();
        }
        if(autogirar==true){
            async function autogirar() {
                if(location.hostname=='popspins.com'){
                    setInterval(function(){
                        if($('input#playFancy').is(':enabled')==true && $('input#playFancy').is(':visible')==true && $('input#playFancy').val()=='' || $('input#playFancy').val()=='Play'){$('input#playFancy:enabled').click();}
                        if($('div#100redblackwrapper').is(':visible')==true){
                            numaleatorio=aleatorio(1,2);
                            if(numaleatorio==1){open_case('red');}else{open_case('black');}
                            $('div#100redblackwrapper').hide();
                        }
                        if($('div#100chestswrapper').is(':visible')==true){
                            numaleatorio=aleatorio(1,3);
                            openChest(numaleatorio);
                            $('div#100chestswrapper').hide();
                        }
                        if($('div#runModal > div > div > div.modal-header > a > span').is(':visible')==true){
                            $('div#runModal > div > div > div.modal-header > a > span').click();
                        }
                    },10000);
                }
            }
            autogirar();
        }
        if(esconderpublicidad==true){
            async function esconderpublicidad() {
                if(location.hostname=='popspins.com'){
                    setInterval(function(){
                        if($('iframe:nth-child(4)').length > 0){$('iframe:nth-child(4)').css("visibility", "hidden");}
                        if($('iframe:nth-child(5)').length > 0){$('iframe:nth-child(5)').css("visibility", "hidden");}
                        if($('iframe:nth-child(6)').length > 0){$('iframe:nth-child(6)').css("visibility", "hidden");}
                        if($('div[id^="container-"]').length > 0){$('div[id^="container-"]').css("visibility", "hidden");}
                        if($('div[class^="_"]').length > 0){$('div[class^="_"]').click();}
                        if(window.location.pathname.indexOf("/website_open.php")==0){$('div.map-container').css("visibility", "hidden");}
                    },500);
                }
            }
            esconderpublicidad();
        }
    });
})();
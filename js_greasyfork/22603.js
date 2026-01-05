// ==UserScript==
// @name         AjaxChat MOD
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Modificacion del AjaxChat de ChatCave
// @author       Mairtrus
// @match        *chatcave.me/chat/simpsonitox/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.1.0.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/22603/AjaxChat%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/22603/AjaxChat%20MOD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var NombreDeUsuario = '';
    var Contrasenia = '';
    var SeConectaSolo = false; // cambiar a true para que conecte solo al iniciar el chat
    var SeReconectaSolito = false; // cambiar a true para que se reconecte solo tras una desconeccion

    $( document ).ready(function(){
        if ($('#loginContent').length && $("#errorContainer > div").length === 0){
            var isLogout = (window.location.href.indexOf('logout=true') > -1);
            if ((SeConectaSolo && !isLogout) || (SeReconectaSolito && isLogout)){
                $('#userNameField').val(NombreDeUsuario);
                $('#passwordField').val(Contrasenia);
                $('#loginButton').click();
            }
        }
    });

    ajaxChat.dirs.emoticons = '';
    ajaxChat.emoticonCodes = [
		':)',
        ':(',
        ';)',
        ':P',
        ':D',
        ':|',
        ':O',
        ':?',
        '8o',
        ':-(',
        ':-*',
        ':help:',
        ':error:',
        ':warning:',
        ':favorite:',
        ':awesome:',
        ':suspect:',
        ':te:',
        ':te2:',
        ':ola:',
        ':ugu:',
        ':loco:',
        ':mad:',
        ':abrazo:',
        ':nono:',
        ':snusnu:',
        ':risa:',
        ':suicidio:',
        ':yonofui:',
        ':radiohead:',
        ':timidon:',
        ':putoelquelee:',
        ':desierto:',
        ':perdido:',
        ':nein:'
 	];
    ajaxChat.emoticonFiles = [
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/smile_zps3mqpchdl.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/sad_zpsxlxricqp.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/wink_zpszzfs7axx.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/razz_zpsissyan94.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/icon_mrgreen_zpsaoekcwl9.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/plain_zpsk2aav2cn.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/surprise_zpsenyersdh.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/confused_zpsu3iybqfb.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/eek_zpsn07s451l.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/crying_zpsaogrqyad.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/kiss_zpsbqidl2in.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/help_zpskzawdmgf.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/error_zps4rpcvmze.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/warning_zpsxkho5or9.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/favorite_zps2uakg1r2.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/awesome_face_bigger_zps8peuzrp5.png~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/emoticon-suspicious2_zpsgmjb2dpq.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/te_210_zpsl0c7rirs.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/te210_zpsd7efo5qq.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/1276839zippyhello_zpswjrhnhfw.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/249780_zpspl0ods7b.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/gua10_zpsbwbovx4c.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/angry-smiley-053_zpsm1gzpudw.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/hug10_zpsdrbjjiez.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/nono10_zps5eldm6dc.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/yea2.gif.pagespeed.ce.wWf4JcbSyE_zpss4lkrj48.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/Heristical_zpsv3rlttw7.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/1suici10_zpsm58se5ei.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/859926_zps3jgtdo6g.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/parano10_zpsogeod6xc.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/blush_zps7m5p9o2d.gif~original',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/angry-smiley-055__zpsbqg2ldmr.gif~original',
        'https://dl.dropboxusercontent.com/s/56smrz85l208f27/th_tum13.gif',
        'https://dl.dropboxusercontent.com/s/q0575p6hfpst0f4/th_Lost_by_Ugghhzilla.gif',
        'http://i114.photobucket.com/albums/n273/patriaka/emoticones/no_zpsj9quolxb.gif~original'
	];
})();
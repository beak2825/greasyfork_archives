// ==UserScript==
// @name         磁力云播
// @version      1.9.2
// @description  找出页面的磁力链，添加云播接口
// @author       磁力云播
// @icon         http://demo.sc.chinaz.com/Files/pic/iconsico/4204/3.ico
// @include      http*://btdigg.org/search*
// @include      http://www.mp4ba.com/*
// @include      http*://*.jav*.*
// @include      http*://*.torrent*.*/*
// @include      http*://*.panc.cc
// @include      http*://*.bt*.*
// @include      http*://bt*.*
// @include      http*://*.*bt.*
// @include      http*://*.*bt*.*
// @include      http*://*.cili*.*
// @include      http*://thepiratebay.org/search/*
// @require      http://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @run-at      document-end
// @namespace https://greasyfork.org/users/54472
// @downloadURL https://update.greasyfork.org/scripts/23789/%E7%A3%81%E5%8A%9B%E4%BA%91%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/23789/%E7%A3%81%E5%8A%9B%E4%BA%91%E6%92%AD.meta.js
// ==/UserScript==

function getAllMagnet(rawMagnets) {
    var magnetNum = rawMagnets.length;
    var rawString = "";
    var rex = new RegExp("\\w{40}", 'g'); //regular expression to match all 40 bit code 
    if (magnetNum !== 0) { //prase all magnet herf nodes into string
        for (var i = 0; i < magnetNum; i++) {
            rawString += rawMagnets[i].toString();
        }
    }
    return rawString.match(rex); //return the code list
}



function code2down1(str) {
    var s1, s2, btih, torrentURL;
    btih = str.toLocaleUpperCase();
    s1 = btih.substr(0, 2);
    s2 = btih.substr(str.length - 2);
    torrentURL = "data:text/html,<meta http-equiv=\"refresh\" content=\"0.1;url=https://apiv.ga/magnet/" + btih + "\">";
    return torrentURL;
}

function code2down2(str) {
    var btih, torrentURL;
    btih = str.toLocaleUpperCase();
    torrentURL = "data:text/html,<meta http-equiv=\"refresh\" content=\"0.1;url=https://1qkdy.com/playm3u8/?type=magnet&vid=" + btih + "\">";
    return torrentURL;
}
function code2down3(str) {
    var btih, torrentURL;
    btih = str.toLocaleUpperCase();
    torrentURL = "data:text/html,<meta http-equiv=\"refresh\" content=\"0.1;url=https://www.mrenwu.com/playm3u8/index.php?url=magnet:?xt=urn:btih:" + btih + "\">";
    return torrentURL;
}

function include(Things,obj) {
    for (var i = Things.length - 1; i >= 0; i--) {
        if ($(Things[i]).attr('href')===$(obj).attr('href')){
            return true;
        }
    }
}

function setCss(){
    $('head').append('<style>.color1{background-color:#FFEB3B}.color2{background-color:#F44336}.color3{background-color:#4CAF50}a.wxz-a{ background-repeat: no-repeat;background-position: center;    display: inline-block;margin-left:5px;height: 20px;width: 20px;background-size: 20px;border-radius: 50%;background-image: url("http://demo.sc.chinaz.com/Files/pic/icons/4723/4.png");vertical-align: middle;}</style>');
}

function getAllTorrentsNew() {
    var rawnodes = $('a[href^="magnet"]').get();
    var nodes = [];
    var codeList = [];
    var listLen = 0;
    for (var i = 0; i <rawnodes.length; i++) {
        if(!include(nodes,rawnodes[i])){
            nodes.push(rawnodes[i]);
        }
    }
    codeList = getAllMagnet(nodes);
    listLen = codeList.length;
    setCss();

    if (listLen !== 0) { //prase all magnet herf nodes into string
        for (var i = 0; i < listLen; i++) {
            $(nodes[i]).after($(nodes[i]).clone().addClass('wxz-a color3').empty().attr("target","_blank").attr("title","Play" ).attr("href", code2down3(codeList[i])));
            $(nodes[i]).after($(nodes[i]).clone().addClass('wxz-a color1').empty().attr("target","_blank").attr("title","Play" ).attr("href", code2down1(codeList[i])));
            $(nodes[i]).after($(nodes[i]).clone().addClass('wxz-a color2').empty().attr("target","_blank").attr("title","Play" ).attr("href", code2down2(codeList[i])));
        }
    }
    $('.wxz-a').css('b','d');
}


function getAllTorrents() {
    var nodes = $('a[href^="magnet"]');
    var codeList = [];
    var listLen = 0;
    var i = 0;
    codeList = getAllMagnet(nodes);
    listLen = codeList.length;
    if (listLen !== 0) { //prase all magnet herf nodes into string
        for (i = 0; i < listLen; i++) {
            $(nodes[i]).after($(nodes[i]).clone().empty().html("[BT_2]").attr("target","_blank").attr("title","download torrent from torcache" ).attr("href", code2down3(codeList[i])));
        }
    }
}

var i=0;


var t=window.setInterval(function() { //wait 2 seconds to execute getAllTorrents() function
    if($('a[href^="magnet"]').length>0||i>20){
        window.clearInterval(t);
        getAllTorrentsNew();
    }else{
        i++;
    }
}, 500);
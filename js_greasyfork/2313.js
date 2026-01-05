// ==UserScript==
// @name        Baixaki sem instalador
// @namespace   http://openuserjs.org/users/alpe
// @include     http://www.baixaki.com.br/download/*
// @include     http://www.baixaki.com.br/iphone/download/*
// @include     http://www.baixaki.com.br/windows-phone/download/*
// @include     http://www.baixaki.com.br/windows-8/*
// @include     http://www.baixaki.com.br/site/*
// @version     0.3.11
// @description Remove o instalador do Baixaki e a página adicional de download, fornecendo o link direito na página de detalhes.
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2313/Baixaki%20sem%20instalador.user.js
// @updateURL https://update.greasyfork.org/scripts/2313/Baixaki%20sem%20instalador.meta.js
// ==/UserScript==

function getContentByMetaTagName(c) {
  for (var b = document.getElementsByTagName("meta"), a = 0; a < b.length; a++) {
    if (c == b[a].name || c == b[a].getAttribute("property")) { return b[a].content; }
  } return false;
}

var page = window.location.pathname.split('/')[1];

if (page == "download" || page == "iphone" || page == "windows-phone" || page == "windows-8"){
    if (typeof(urlsdown) !== 'undefined'){
        if(typeof(urlsdown[1]) !== 'undefined'){
            if (urlsdown[1][0] !== ""){
                if (urlsdown[1][1] == ""){
                    var dlink64 = urlsdown[1][0].toString().split("").reverse().join("");
                    console.log('novo metodo sem instalador detectado (x64)');
                } else {
                    var dlink64 = urlsdown[1][1].toString().split("").reverse().join("");
                    console.log('novo metodo com instalador detectado (x64)');
                }
            } else { var dlink64 = ""; }
        } else { var dlink64 = ""; }
        if (urlsdown[0][1] == ""){
            var dlink86 = urlsdown[0][0].toString().split("").reverse().join("");
            console.log('novo metodo sem instalador detectado (x86)');
        } else {
            if(urlsdown[0][0] === urlsdown[0][1] || urlsdown[0][0].replace(/02%/g, '-') === urlsdown[0][1]){
                notfound = true;
            } else {
                var dlink86 = urlsdown[0][1].toString().split("").reverse().join("");
                console.log('novo metodo com instalador detectado (x86)');
            }
        }
        if (dlink64 !== ""){
            var dlink = dlink64;
            document.querySelector(".dld .btndld").innerHTML = "<b>Baixar</b>(x64)"+document.querySelector(".dld .btndld").innerHTML.split('<b>Baixar</b>')[1];
            x86Div = document.createElement('a'); x86Div.innerHTML = 'Baixar (x86)'; x86Div.href = dlink86;
            document.querySelector(".btndld-contb").appendChild(x86Div);
        } else {
            if (typeof(notfound) !== "undefined" || dlink86.match(/(esd.nzs.com.br|www.baixakidownloadfiles|re-iguredor33.com)/) !== null){
                dlink = document.getElementById("down-android").getElementsByTagName("a")[0].href;
                console.log("link fake (x86) detectado");
            } else {
                var dlink = dlink86;
            }
        }
        if (page == "iphone"){
            var dlink = dlink.split('?u=')[1];
            console.log('iphone mod');
        }
        element = document.querySelectorAll(".dld li.btndld-contb");
        for (var i=0; i<element.length; i++) {
            var bar = element[i].getElementsByTagName("div")[0];
            var link = element[i].getElementsByTagName("a")[0];
            link.removeAttribute('onclick');
            link.setAttribute('href', dlink);
            if (typeof(bar) !== 'undefined'){ bar.parentNode.removeChild(bar); }
        }
    } else if (document.querySelector(".dwl-info").getElementsByTagName("div")[0].getAttribute('class') == "dwl-bt-container" && document.querySelector(".dwl-bt-container").getElementsByTagName("a")[1].getAttribute("class") == "seminstalador"){
        var link = document.querySelector(".dwl-bt-container").getElementsByTagName("a")[0];
        var link2 = document.querySelector(".dwl-bt-container").getElementsByTagName("a")[1];
        var link3 = document.querySelectorAll(".dwl-bt-container")[1].getElementsByTagName("a")[0];
        var link4 = document.querySelectorAll(".dwl-bt-container")[1].getElementsByTagName("a")[1];
        var dlink = link2.getAttribute('onclick').toString().split("'")[1].toString().split("").reverse().join("");
        link.removeAttribute('onclick');
        link.setAttribute('href', dlink);
        link3.removeAttribute('onclick');
        link3.setAttribute('href', dlink);
        link.getElementsByTagName('span')[1].textContent = 'sem instalador Baixaki';
        link3.getElementsByTagName('span')[1].textContent = 'sem instalador Baixaki';
        link2.parentNode.removeChild(link2);
        link4.parentNode.removeChild(link4);
        console.log('instalador detectado');
    } else {
        var linktop = document.querySelector(".dwl-info").getElementsByTagName("a")[0];
        var linkbot = document.querySelector(".dlw-footer").getElementsByTagName("a")[0];
        var dlink = linktop.getAttribute('onclick').toString().split("'")[1].toString().split("").reverse().join("");
        linktop.removeAttribute('onclick');
        linktop.setAttribute('href', dlink);
        linkbot.removeAttribute('onclick');
        linkbot.setAttribute('href', dlink);
        console.log('instalador não detectado');
    }
} else if (page == "site"){
    window.location = getContentByMetaTagName('og:url');
}
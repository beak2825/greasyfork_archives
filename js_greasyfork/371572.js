// ==UserScript==
// @name         StreamCraft HBeira Style
// @namespace    https://greasyfork.org/en/scripts/371572-streamcraft-hbeira-style
// @version      1.3
// @description  Remove o enorme ranking de contribuições, e aumenta a área de chat.
// @author       HBeira
// @include      http://www.streamcraft.com/*
// @include      http://streamcraft.com/*
// @downloadURL https://update.greasyfork.org/scripts/371572/StreamCraft%20HBeira%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/371572/StreamCraft%20HBeira%20Style.meta.js
// ==/UserScript==

var myVar = setInterval(aplicarHBeiraStyle, 2000);

function aplicarHBeiraStyle(){

                removeElementsByClass('sider-item tab-app');
                changeElementsByClass('chat-lists vue-scrollbar__wrapper');
                clearInterval(myVar);

}

function removeElementsByClass(className){

    var elements = document.getElementsByClassName(className);
    elements[0].parentNode.removeChild(elements[0]);

}

function changeElementsByClass(className){

    var elements = document.getElementsByClassName(className);
    elements[0].style.height= "440px";

}
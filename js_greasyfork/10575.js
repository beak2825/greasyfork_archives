// ==UserScript==
// @name           Tabun LFL_link
// @description    LFL_link
// @include        http*://tabun.everypony.ru/*
// @grant          none
// @version 0.0.1.2
// @namespace https://greasyfork.org/users/12642
// @downloadURL https://update.greasyfork.org/scripts/10575/Tabun%20LFL_link.user.js
// @updateURL https://update.greasyfork.org/scripts/10575/Tabun%20LFL_link.meta.js
// ==/UserScript==
var nav = document.getElementById('dropdown-user'),
    link = nav.getElementsByTagName('a')[0],
    name = link.href.match(/profile\/(.*)\//)[1],
    mess = document.createElement('a'),
    text = document.createTextNode('LFL'),
    green = "background-color: #FFFFEE;";
mess.href = 'http://tabun.everypony.ru/blog/LFL/';
mess.setAttribute('class', 'username');
mess.setAttribute('style', 'margin-right: 5px;');
mess.appendChild(text);
nav.insertBefore(mess, link.nextSibling);
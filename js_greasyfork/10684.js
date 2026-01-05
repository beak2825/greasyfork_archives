// ==UserScript==
// @name           Tabun koridor_link
// @description    LFL_link
// @include        http*://tabun.everypony.ru/*
// @grant          none
// @version 0.0.1.2
// @namespace https://greasyfork.org/users/12642
// @downloadURL https://update.greasyfork.org/scripts/10684/Tabun%20koridor_link.user.js
// @updateURL https://update.greasyfork.org/scripts/10684/Tabun%20koridor_link.meta.js
// ==/UserScript==
var nav = document.getElementById('dropdown-user'),
    link = nav.getElementsByTagName('a')[0],
    name = link.href.match(/profile\/(.*)\//)[1],
    mess = document.createElement('a'),
    text = document.createTextNode('Зеркальный Коридор'),
    green = "background-color: #FFFFEE;";
mess.href = 'http://tabun.everypony.ru/blog/zerkalnyykoridor/';
mess.setAttribute('class', 'username');
mess.setAttribute('style', 'margin-right: 5px; color: green;'); //для изменения цвета, просто измени в этой строчке "green" на другое название цвета.
mess.appendChild(text);
nav.insertBefore(mess, link.nextSibling);

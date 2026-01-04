// ==UserScript==
// @name         Forum Praxe
// @namespace    http://tampermonkey.net/DarkModeForum
// @version      0.9
// @description  Bora tornar as coisas bonitas.
// @author       Tiago Sinde
// @license      MIT
// @match        https://fef.boards.net
// @include      /^https?://fef.boards.net
// @icon         https://storage2.proboards.com/forum/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438598/Forum%20Praxe.user.js
// @updateURL https://update.greasyfork.org/scripts/438598/Forum%20Praxe.meta.js
// ==/UserScript==


//             ALTEREI cor FUNDO , COR BARRA NAVEGAÇAO, caixa de quick reply- preto, estilo alguns botões


'use strict';
const Version = 0.9;

console.log(`A versão ${Version} do "Forum bonito" foi carregada.`);

document.getElementById("logo").innerHTML = "Praxe de FÍSICA CARALHO!";

var ModoEscuro = true;
// por defeito uso o modo escuro
DarkMode();

// // butão mudar tema
// document.body.insertAdjacentHTML("beforeend",
// `<div>
//     <button type="button" id="DarkModeButton">
//         Mudar Tema
//     </button>
// </div>`);

// document.getElementById("DarkModeButton").addEventListener("click",clickChangeMode);
// document.head.insertAdjacentHTML("beforeend",
// `<style>
//     #DarkModeButton{
//         display: block;
//         position: absolute;
//         top: 5%;
//         right: 0%;
//     }
// <\style>`);
// function clickChangeMode() {
//     if (ModoEscuro == false){
//         DarkMode()
//     } else {
//         location.reload();
//     }
// }

function DarkMode() {
    ModoEscuro = true;
    // escreve por cima do estilo original
    document.head.insertAdjacentHTML(
        "beforeend",
        `<style type="text/css" id="invert-style">
        body {
            background-image: radial-gradient(#555,#333,#111);
        }
        #banner {
            background-color:#14cfdd;
            text-align:center;
        }
        .container>.title-bar,#navigation-menu>ul li a.state-active {
            background-color:#4827bb;
        }
        #navigation-menu{
            background-color:#04777f;
        }
        .container.copy .clone,
        .container>.content, .ui-dialog .ui-dialog-buttonpane,
        .ui-dialog .ui-dialog-content,
        #navigation-tree, .recent-threads-button,element.style,
        .post .quote div.quote div.quote_body, .post.even .quote div.quote_body, .posts .post,
        .post.item .quote .quote abbr.time, .post.item abbr.time, .post.item.even .quote abbr.time,
        .mini-profile,.mini-profile .info,.mini-profile .personal-text, 
        .wysiwyg-area .content>form>div, html, .quick-reply textarea, .container .note{
            background-color:#212121;
            border-color: #7158ca;
            color: #d6d6d6;
        }
        .post .quote div.quote_body, .post.even .quote div.quote div.quote_body, .posts .post.even,
        .post.item .quote abbr.time, .post.item.even .quote .quote abbr.time, .post.item.even abbr.time,
        .even .mini-profile .info, .even .mini-profile,.even .mini-profile .personal-text{
            background-color: #3c2d6c;
            border-color: #7158ca;
            color: #d6d6d6;
        }
        body,table.list,.stats.content,span,table.list .last-edited,
        table.list abbr.time,.container abbr.time{
            color: #d6d6d6;
        }
        table.list>tbody>tr>td, table.list>thead>tr>th,.posts .labels, .posts .post>td{
            border-color: #7158ca;
        }
        .list a,div.mini-profile a,.even div.mini-profile a {
            color: #39d7e2;
        }
        #calendar-list .item:hover, .list .board.item:hover, .list .item.state-hover,
        .popup_html .ui-menu li:hover, .popup_html li:hover,
        #nav-tree .ui-menu li:hover, #nav-tree>li:hover {
            color:#d6d6d6;
            background-color: #164733fc;
        }
        .list .item:hover>.main .link a, .list .item>.main.state-hover .link a,
        #nav-tree .ui-menu li:hover, #nav-tree>li:hover {
            color: #39d7e2;
        }
        .popup_html ul{
            background-color:#212121;
        }
        .container>.control-bar {
            background: #212121;
            border: 1px solid #7158ca;
        }
        a.button.quote-button{
            color: #212121;
        }
        .container>.title-bar>.controls li a, .container>.title-bar>.controls li div{
            color: #d6d6d6;
            background-color: #212121;
        }
        </style>`
    );
};
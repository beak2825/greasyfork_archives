// ==UserScript==
// @name        HATSHOP
// @version     0.1
// @description A Better Sploop.io Shop
// @author      DETIX
// @match       https://sploop.io/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @namespace https://greasyfork.org/users/1311498
// @downloadURL https://update.greasyfork.org/scripts/528963/HATSHOP.user.js
// @updateURL https://update.greasyfork.org/scripts/528963/HATSHOP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const hatMenu = document.getElementById("hat-menu");
    hatMenu.style.background = "rgba(0,0,0,0)";

    const style = document.createElement('style');
    style.textContent = `
        #hat-menu {
            height: 350px;
            width: 0;
            border: 1px dotted rgba(0, 0, 0, 0);
            box-shadow: none;
        }

        #hat-menu .menu .content .menu-item .description {
            font-size: 14px;
            color: skyblue;
            padding-bottom: 15px;
        }

        #hat-menu .menu .content .menu-item .menu-pricing .action {
            margin-left: auto;
            outline: none;
            border: 0;
            padding: 7px;
            cursor: url(img/ui/cursor-pointer.png) 6 0, pointer;
            border-radius: 10px;
            font-size: 24px;
            text-align: right;
            color: #C13636;
        }

        #hat-menu .subcontent-bg {
            background: rgba(0, 0, 0, 0.25);
            width: 400px;
            height: 200px;
            position: absolute;
            top: 50px;
            border: 4px solid transparent;
            box-shadow: inset 0 5px 0 rgba(0, 0, 0, 0);
        }

        #hat-menu .green-button {
            background-color: transparent;
            border: none;
            box-shadow: inset 0 -5px 0 rgba(0, 0, 0, 0);
            color: #C13636;
            cursor: pointer;
        }

        #hat-menu .green-button:hover {
            color: #C72323 !important;
            background: transparent;
        }
        ::-webkit-scrollbar {
            display: none;
        }
        * {
            scrollbar-width: none;
        }
        .pop-top, .column-flex.column-flex-extra{
            display: none;
        }

        .menu .content .menu-item {
            border-bottom: none;
        }
    `;

    document.head.appendChild(style);
})();


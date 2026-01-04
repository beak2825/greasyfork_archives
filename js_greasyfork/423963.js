// ==UserScript==
// @name     Steam Archive Menu
// @description	Because we despise scammers
// @version		2022.10
// @author       SkauOfArcadia
// @homepage https://skau.neocities.org/
// @contactURL https://t.me/SkauOfArcadia
// @match  *://steamcommunity.com/*
// @match  *://store.steampowered.com/*
// @run-at      document-idle
// @grant none
// @license     AGPL-3.0-or-later
// @namespace https://greasyfork.org/users/751327
// @downloadURL https://update.greasyfork.org/scripts/423963/Steam%20Archive%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/423963/Steam%20Archive%20Menu.meta.js
// ==/UserScript==
/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function() {
    "use strict";
     switch(location.pathname.split('/')[1]) {
        case "id":
            let vanity = location.pathname.split('/')[2];
            if (location.pathname.lastIndexOf('/') === 3 || location.pathname.split('/')[3].length === 0) {
                let y = JSON.parse('{' + document.getElementById('responsive_page_template_content').getElementsByTagName('script')[0].innerHTML.split('{')[1].split('}')[0] + '}').steamid;
                if (isNumeric(y)) {
                    y = BigInt(y);
                    console.log('Obtained SteamID64: ' + y);
                    addArchiveMenu('/profiles/' + y);
                    if (!localStorage.getItem('arch_id_' + vanity.toLowerCase()) || BigInt(localStorage.getItem('arch_id_' + vanity.toLowerCase())) !== y) {
                        localStorage.setItem('arch_id_' + vanity.toLowerCase(), y); console.log('Saved ID ' + y + ' for ' + vanity);
                    }
                }
            } else if (!!localStorage.getItem('arch_id_' + vanity.toLowerCase())) {
                addArchiveMenu('/id/' + vanity, '/profiles/' + localStorage.getItem('arch_id_' + vanity.toLowerCase()))
            } else {
                addArchiveMenu(location.pathname);
            }
            break;
        case "app":
        case "bundle":
            if(location.hostname == "store.steampowered.com"){
                let y = location.pathname;
                let path = '/' + y.split('/')[1] + '/';
                y = y.split(path).pop().split('/')[0];
                if (isNumeric(y)) {
                    addArchiveMenu(path + y);
                }
            } else {
                addArchiveMenu(location.pathname);
            }
            break;
        default:
            addArchiveMenu(location.pathname);
            break;
    }

    function addArchiveMenu(path, replacement) {
        var isHover = false
        let archUrl = location.protocol + "//" + location.hostname + path

        if(!!replacement && !!path) {
            archUrl = location.protocol + "//" + location.hostname + location.pathname.replace(path, replacement);
        }

        if (location.search.indexOf('?l=') !== -1 || location.search.indexOf('&l=') !== -1 ||
            location.search.indexOf('?searchtext=') !== -1 || location.search.indexOf('&searchtext=') !== -1) {
            let params = new URLSearchParams(location.search)
            params.delete('l');
            params.delete('searchtext');
            if (String(params).length > 0) {
                archUrl += '?' + params;
            }
        } else {
            archUrl += location.search
        }
        //Create menu elements
        var menuitem = document.getElementsByClassName("menuitem");
        var archmenu = document.createElement("a");
        var archtxt = document.createTextNode("ARCHIVE...");
        archmenu.setAttribute("class", "menuitem archive");
        archmenu.setAttribute("data-tooltip-type", "selector");
        archmenu.setAttribute("data-tooltip-content", ".submenu_archive");
        archmenu.appendChild(archtxt);
        var archnav = document.createElement("div")
        archnav.setAttribute("style", "position: absolute; z-index: 1500; opacity: 0; left: 300px; top: 64px; pointer-events: none;");
        archnav.setAttribute("class", "supernav_content archive");
        var archsub = document.createElement("div")
        archsub.setAttribute("class", "submenu_archive");
        archsub.setAttribute("style", "");
        archsub.setAttribute("data-submenuid", "archive");
        var archit1 = document.createElement("a");
        archit1.setAttribute("class", "submenuitem");
        archit1.setAttribute("href", "https://web.archive.org/save/" + archUrl);
        archit1.setAttribute("target", "_blank");
        archit1.setAttribute("rel", "noopener noreferrer");
        var archit1txt = document.createTextNode("Archive this page");
        archit1.appendChild(archit1txt);
        var archit2 = document.createElement("a");
        archit2.setAttribute("class", "submenuitem");
        archit2.setAttribute("href", "https://web.archive.org/web/*/" + archUrl);
        archit2.setAttribute("target", "_blank");
        archit2.setAttribute("rel", "noopener noreferrer");
        var archit2txt = document.createTextNode("View History");
        archit2.appendChild(archit2txt);
        archsub.appendChild(archit1);
        archsub.appendChild(archit2);
        archnav.appendChild(archsub);

        insertAfter(archnav, menuitem[menuitem.length - 1]);

        insertAfter(archmenu, menuitem[menuitem.length - 1]);

        var parentClass = document.getElementsByClassName("menuitem archive")[0];
        var childClass = document.getElementsByClassName("supernav_content archive")[0];

        parentClass.addEventListener("mouseover", mouseOver);
        parentClass.addEventListener("mouseout", mouseOut);
        childClass.addEventListener("mouseover", mouseOver);
        childClass.addEventListener("mouseout", mouseOut);

        function mouseOver() {
            var parentPos = getOffset(parentClass).left - getOffset(parentClass.parentNode).left
            console.log(parentPos)
            childClass.style.left = Math.round(parentPos) + "px";
            childClass.style.opacity = "1";
            childClass.style.pointerEvents = "auto";
            isHover = true
        }

        function mouseOut() {
            isHover=false
            setTimeout(() => { if(!isHover){childClass.style.opacity = "0"; childClass.style.pointerEvents = "none";} }, 100);
        }
    }

     function isNumeric(str) {
       if (typeof str != "string") return false
       return !isNaN(str) &&
              !isNaN(parseFloat(str))
     }

     function insertAfter(newNode, referenceNode) {
         referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
     }

     function getOffset( el ) {
         var _x = 0;
         var _y = 0;
         while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
             _x += el.offsetLeft - el.scrollLeft;
             _y += el.offsetTop - el.scrollTop;
             el = el.offsetParent;
         }
         return { top: _y, left: _x };
     }
})();
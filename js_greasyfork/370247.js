// ==UserScript==
// @id             poppen.de_MobileSearch
// @name           poppen.de_MobileSearch
// @namespace      de.poppen.search
// @version        0.6
// @author         Useless
// @description    Show search for Poppen.de community on mobile Devices
// @include        http*://*.poppen.de/community/forum/*
// @run-at         document-end
// @iconURL        https://www.poppen.de/favicon.ico
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370247/poppende_MobileSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/370247/poppende_MobileSearch.meta.js
// ==/UserScript==

(function() {
    var screenObj = window.screen;
    let esearch = document.getElementById('elSearchExpanded');
    let activity = document.getElementById('elNavSecondary_8');
    let newlink = document.createElement('a');
    var linkText = document.createTextNode("Erweiterte Suche");
    newlink.appendChild(linkText);
    newlink.title = "Erweiterte Suche";
    newlink.href = "/community/search";
    esearch.appendChild(newlink);
    if (screenObj.width <= 979)
    {
        let search = document.getElementById('elSearch');
        //let expsearch = document.getElementById('elSearchExpanded');
        let breadcrumb = document.getElementsByClassName('ipsBreadcrumb');
        let listItems = document.querySelectorAll('.ipsBreadcrumb li');
        for (let link of listItems) {
            link.style.display = 'none';
        }
        search.style.display = 'block'; // show
        activity.style.display = 'block';
        let menus = activity.querySelectorAll('li');
        for (let menu of menus) {
            menu.style.display = 'block';
        }
        let radios = search.querySelectorAll('li');
        for (let radio of radios) {
            radio.style.display = 'block';
        }
        esearch.style.right = "-50px";
        breadcrumb[0].style.display = 'block';
    }
})();
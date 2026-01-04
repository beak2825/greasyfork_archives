// ==UserScript==
// @name         HWM_EnableHoverOnMobile
// @namespace    Небылица
// @version      1.0
// @description  Возможность использования без мышки элементов, выпадающих по наведению курсора
// @author       Небылица
// @include      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/.+/
// @exclude      /^https{0,1}:\/\/((www|qrator)\.heroeswm\.ru|178\.248\.235\.15)\/(login|war|cgame|campaign|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost)\.php.*/
// @downloadURL https://update.greasyfork.org/scripts/383685/HWM_EnableHoverOnMobile.user.js
// @updateURL https://update.greasyfork.org/scripts/383685/HWM_EnableHoverOnMobile.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // Вспомогательные функции
    function isMobileDevice(){ // Возвращает true/false в зависимости от того, является ли устройство мобильным (имеет ои сменную ориентацию экрана)
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };
    function setMouseOverOutHrefs(element, hrefOver){ // Вяжет к element обработчики mouseover и mouseout, меняющие ссылки при открытии/закрытии выпадающего меню
        element.addEventListener("mouseover", function(){
            window.setTimeout(function(){
                element.setAttribute("href", hrefOver);
            }, 100);
        });
        element.addEventListener("mouseout", function(){
            element.setAttribute("href", "#");
        });
    }
    //

    if (isMobileDevice()){
        // Главное меню
        var menuTabs = {
            "1": "home.php",
            "2": "map.php",
            "3": "bselect.php",
            "5": "roulette.php",
            "6": "plstats.php",
            "7": "forum.php",
            "8": "frames.php"
        },
            menuTabNumber,
            menuTab;
        for (menuTabNumber in menuTabs){
            menuTab = document.querySelector("nobr > a[href^='" + menuTabs[menuTabNumber] + "']");
            if (menuTab){
                menuTab.setAttribute("href", "#");
                if (menuTabNumber !== "3"){
                    setMouseOverOutHrefs(menuTab, menuTabs[menuTabNumber]);
                } else{
                    setMouseOverOutHrefs(menuTab, "bselect.php?all=1");
                }
            }
        }

        // HWM_Magearts
        var mageartsHeaderTitle = document.getElementById("mageartsHeaderTitle");
        if (mageartsHeaderTitle){
            mageartsHeaderTitle.setAttribute("href", "#");
            setMouseOverOutHrefs(mageartsHeaderTitle, "magearts.php");
        }

        // SetsMaster
        var menuSetsTable0HeaderHref = document.getElementById("menuSetsTable0Header").firstChild.firstChild,
            menuSetsTable1HeaderHref = document.getElementById("menuSetsTable1Header").firstChild.firstChild,
            menuSetsTable2HeaderHref = document.getElementById("menuSetsTable2Header").firstChild.firstChild;
        if (menuSetsTable0HeaderHref){
            menuSetsTable0HeaderHref.setAttribute("href", "#");
            setMouseOverOutHrefs(menuSetsTable0HeaderHref, "inventory.php");
        }
        if (menuSetsTable1HeaderHref){
            menuSetsTable1HeaderHref.setAttribute("href", "#");
            setMouseOverOutHrefs(menuSetsTable1HeaderHref, "skillwheel.php");
        }
        if (menuSetsTable2HeaderHref){
            menuSetsTable2HeaderHref.setAttribute("href", "#");
            setMouseOverOutHrefs(menuSetsTable2HeaderHref, "army.php");
        }

        // [hwm]_change_fraction
        var spanFractionsHref = document.getElementById("spanFractions").firstChild;
        if (spanFractionsHref){
            spanFractionsHref.setAttribute("href", "#");
            setMouseOverOutHrefs(spanFractionsHref, "castle.php");
        }

        // GN_CriticalStrikeSet
        var criticalStrikeHref = document.querySelector("td a.pi[href='castle.php']");
        if (criticalStrikeHref){
            criticalStrikeHref.setAttribute("href", "#");
            setMouseOverOutHrefs(criticalStrikeHref, "castle.php");
        }
    }
})();
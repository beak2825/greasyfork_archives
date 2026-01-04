// ==UserScript==
// @name         AutoScrollAndFocusOnPreviousSuiteTestIt
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  При переключении сьютов каждый раз запоминает активный сьют (по имени), при перезагрузке дерева (перемещение/ренейм) - скролит дерево вниз, ищет сьют по имени и активирует его. Если было переименование - по старому имени не найдет, просто проскролит вниз. Если несколько сьютов с одинаковым именем - будет выбирать первый по дереву.
// @author       You
// @match        https://oro-bsststit-01.luxoft.com/projects/*/tests
// @grant        none
// @noframes
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/407524/AutoScrollAndFocusOnPreviousSuiteTestIt.user.js
// @updateURL https://update.greasyfork.org/scripts/407524/AutoScrollAndFocusOnPreviousSuiteTestIt.meta.js
// ==/UserScript==


(function() {

    'use strict';

    console.log("user script run");
    var x = [];

    function GoToSuiteByName(suiteName){
        var finds = Array.from(document.querySelectorAll("app-tree-list div.list-item"));
        //stop if find array not changed
        if(x.length == finds.length
          && x[0]==finds[0])
        {
            console.log("not found suite with name = "+suiteName);
            return;
        }

        x = Array.from(finds);
        //("div.list-item__title"));
        var oldActiveSuite = finds.filter(e=>e.innerText == suiteName);
        if(oldActiveSuite.length > 0){
            oldActiveSuite[0].click();
            oldActiveSuite[0].scrollIntoView(true);
        } else {
            finds[finds.length-1].scrollIntoView(true);
            setTimeout(()=>GoToSuiteByName(suiteName), 100);
        }
    }

    var activeSuite = "";
    var mutationObserverDialog = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            //console.log(mutation);
            //clear tree
            if(Array.from(mutation.removedNodes).filter(u=>u.tagName=="APP-TREE-LIST").length==1){
                console.log("tree cleared");
                setTimeout(()=>GoToSuiteByName(activeSuite), 500);
            }
            //change active suite
            else if(mutation.type=="attributes"
                    && mutation.attributeName=="class"
                    && mutation.target.classList.contains("list-item_active")
                    && mutation.target.classList.contains("list-item_visible"))
            {
                activeSuite = mutation.target.innerText
                console.log(activeSuite);
            }
        });
    });

    function registerMonitor()
    {
        var tree = document.querySelector("app-section-tree");
        if(tree == undefined){
            console.log("not found, try");
            setTimeout(()=>registerMonitor(), 1000);
            return;
        }

        console.log("register");

        // Запускаем наблюдение за изменениями в корневом HTML-элементе страницы
        mutationObserverDialog.observe(tree, {
            attributes: true,
            // characterData: true,
            childList: true,
            subtree: true,
            // attributeOldValue: true,
            // characterDataOldValue: true
        });
    }

    registerMonitor();
    //mutationObserverDialog.disconnect();
})();
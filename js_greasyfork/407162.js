// ==UserScript==
// @name         JiraLinkTypeCleaner
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  remove type not added to script constant
// @author       You
// @match        https://luxproject.luxoft.com/jira/*
// @grant        none
// @noframes
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/407162/JiraLinkTypeCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/407162/JiraLinkTypeCleaner.meta.js
// ==/UserScript==


(function() {

    'use strict';

    console.log("user script run");

    function RemoveOptions(element){
        console.log("find");
        var select = element.querySelector("select#link-type")
        if(select){
            console.log("find STOP, clean");
            var options = select.querySelectorAll("option");
            const saveOptions = ["is affected by",
                                 "affects",
                                 "incorporates",
                                 "is incorporated by",
                                 "has to be done before",
                                 "has to be done after",
                                 "is parent task of",
                                 "is child task of",
                                 "Clones",
                                 "is cloned from",
                                 "relates to",
                                 "is related to",
                                 "requires",
                                 "is required for"];

            Array.from(options).filter(o=>saveOptions.indexOf(o.innerText)<0).forEach(o=>select.removeChild(o));
        } else if(element){
            setTimeout((element)=>RemoveOptions(element), 200, element);
        } else {
            console.log("element is undefined, stop cycle");
        }
    }

// https://habr.com/ru/company/ruvds/blog/351256/
    var mutationObserverDialog = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            //console.log(mutation);
            var linkDialog = Array.from(mutation.addedNodes).filter(el=>el.tagName == "DIV" && el.id == "link-issue-dialog")[0];
            if(linkDialog){
                console.log("find link dialog");
                RemoveOptions(linkDialog);
            }
        });
    });


    function registerMonitor()
    {
        var tree = document.getElementsByTagName("body")[0];
        if(tree == undefined || tree.id != "jira"){
            console.log("not found, try");
            setTimeout(()=>registerMonitor(), 1000);
            return;
        }

        console.log("register");

            // Запускаем наблюдение за изменениями в корневом HTML-элементе страницы
		mutationObserverDialog.observe(tree, {
			childList: true,
			subtree: false
		});
    }

    registerMonitor();

    //mutationObserverDialog.disconnect();

})();
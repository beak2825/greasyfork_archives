// ==UserScript==
// @name         Eatclub Sorter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  add basic buttons to sort meal options
// @author       adobley
// @match        https://www.eatclub.com/invite/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382401/Eatclub%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/382401/Eatclub%20Sorter.meta.js
// ==/UserScript==
var menuController
(function() {
    'use strict';
    window.addEventListener('load', function() {
        function waitUntilLoaded(menuCtrl, callback) {
            if(menuCtrl.menuLoading) {
                console.log('waiting');
                window.setTimeout(waitUntilLoaded.bind(null, menuCtrl, callback), 100); /* this checks the flag every 100 milliseconds*/
            } else {
                console.log('done');
                callback();
            }
        }

        function createButton(menuController, name) {
            var button = document.createElement("input");
                button.type = "button";
                button.value = name;
                button.onclick = () => {
                    menuController.menuFilterService.setSortOption(name)
                    menuController.refreshMenu()
                }
            return button
        }

        function createMealFilter(menuController, names) {
            var meal_filter = document.createElement('div');
            meal_filter.id = "meal_filter";
            meal_filter.style.textAlign = "center";

            names.forEach(function(name) {
                var button = createButton(menuController, name)
                meal_filter.appendChild(button);
            })

            return meal_filter
        }

        // There should only be one menu-items node, maybe this should have some safety checks
        var menuItems = document.getElementsByTagName("menu-items")[0];
        var menuController = angular.element(menuItems).scope().menuCtrl;

        waitUntilLoaded(menuController, () => {
                var sortOptions = menuController.menuFilterService.sortOptions
                var optionNames = sortOptions.map(a => a.name)
                var meal_filter = createMealFilter(menuController, optionNames)
                var the_menu = document.getElementsByTagName("the-menu")[0];
                the_menu.insertBefore(meal_filter, the_menu.firstChild);
        })
    }, false);
})();


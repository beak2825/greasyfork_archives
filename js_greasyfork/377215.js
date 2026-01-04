// ==UserScript==
// @name         Quizlet — Add to favourites with dragging
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  So important
// @author       Smetanin D
// @match        https://quizlet.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/377215/Quizlet%20%E2%80%94%20Add%20to%20favourites%20with%20dragging.user.js
// @updateURL https://update.greasyfork.org/scripts/377215/Quizlet%20%E2%80%94%20Add%20to%20favourites%20with%20dragging.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        var stars, termsList, starsLength, termsLength, startingStar, dragging = false, selectedItems;
        function createButton() {
            var optionsContainer = document.querySelectorAll('.SetPage-controls--main .SetPage-filterToggle .UIFieldset-fields')[0];
            optionsContainer.insertAdjacentHTML('beforeend', '<button type="button" class="UIButton" id="deselectAll" style="height: 42px;"><svg class="UIIcon UIIcon--star-empty"><noscript></noscript><use xlink:href="#star-empty"></use><noscript></noscript></svg><span>Deselect everything</span></button>');
            document.getElementById('deselectAll').addEventListener("click", function(){
                var selected = document.querySelectorAll('.SetPageTerm.is-selected.is-showing .SetPageTerm-star .UIButton[type="button"]'),
                    selectedLength = selected.length;
                for (i = 0; i < selectedLength; i++) selected[i].click();
            });
        }
        function refreshData(){
            stars = document.querySelectorAll('.SetPageTerm-star .UIButton[type="button"]');
            termsList = document.querySelectorAll('.SetPage-term');
            starsLength = stars.length;
            termsLength = termsList.length;
            var selectedItems = document.querySelectorAll('.SetPageTerm-star .UIButton[type="button"] .UIIcon--star');
            console.log('[Favourite manager] List of items is updated. There are currently ' + starsLength + ' items, ' + selectedItems.length + ' selected.');
            if (selectedItems.length > 0) { if (document.getElementById('deselectAll') === null) { createButton(); } else document.querySelectorAll('#deselectAll span')[0].innerHTML = 'Deselect everything (' + selectedItems.length + ')'; }
        }
        refreshData();
        setInterval(function(){refreshData()},1000);
        function selectByHover(e) { event.target.querySelectorAll('.SetPageTerm-star .UIButton[type="button"]')[0].click(); }
        function clickit(e) { this.click(); }
        for (var i = 0; i < starsLength; i++) {
            stars[i].addEventListener("mousedown", function() {
                startingStar = this;
                dragging = true;
                console.log('mousedown');
                for (var j = 0; j < termsLength; j++) {
                    termsList[j].addEventListener("mouseenter", selectByHover);
                }
                startingStar.addEventListener("mouseleave", clickit);
            });
        }
        document.addEventListener("mouseup", function(event) {
            if (dragging) {
                for (var j = 0; j < termsLength; j++) {
                    termsList[j].removeEventListener("mouseenter", selectByHover);
                }
                startingStar.removeEventListener("mouseleave", clickit);
                console.log('mouseup');
            }
        });
    }, 500);
})();
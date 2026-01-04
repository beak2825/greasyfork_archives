// ==UserScript==
// @name         Workflowy Sort
// @namespace    https://workflowy.com
// @version      0.1
// @description  Alphabetically sort open lists in workflowy
// @author       Roland
// @match        https://workflowy.com
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39239/Workflowy%20Sort.user.js
// @updateURL https://update.greasyfork.org/scripts/39239/Workflowy%20Sort.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // On page load, listen for bullets to populate, then sort them
    var bulletLoaded = setInterval(function(){
        console.log('checking bullets');
        if( document.getElementById('loadingScreen').style.display === 'none' ) {
            console.log('bullets loaded!');
            sortBullets();
            clearInterval(bulletLoaded);
        }
    }, 200);

    // sort bullets on click events (bullet expansion and clicking into a bullet)
    document.addEventListener ("mousedown", autoSort);

    // sort bullets on hotkey press (Ctrl+Shift+S by default)
    document.addEventListener('keydown', keyDownSortBullets);

    function autoSort() {
        $(".bullet, a.content, #expandButton").unbind();
        $('.bullet, a.content').click(function(event){
            setTimeout(function(){
                sortBullets();
                console.log('bullet sort');
            }, 250);
        });
        $('#expandButton').click(function(event){
           // if($(this).attr('data-open-on-last-click') === "true" || typeof $(this).attr('data-open-on-last-click') === 'undefined'){
                setTimeout(function(){
                    sortBullets();
                    console.log('expand sort');
                }, 50);
           // }
        });

    }

    function sortBullets() {
        jQuery.fn.sortDomElements = (function() {
            return function(comparator) {
                return Array.prototype.sort.call(this, comparator).each(function(i) {
                    this.parentNode.appendChild(this);
                });
            };
        })();
        $('div.children').children('.project').sortDomElements(function(a,b){
            var akey = $(a).children('.name').children('.content').text().toLowerCase();
            var bkey = $(b).children('.name').children('.content').text().toLowerCase();
            if (akey == bkey) return 0;
            if (akey < bkey) return -1;
            if (akey > bkey) return 1;
        });
        return true;
    }

    function keyDownSortBullets(e) {
        if(e.ctrlKey && e.shiftKey && e.keyCode === 83){
            e.preventDefault();
            console.log('sorting...');
            sortBullets();
            return false;
            //saveAll();
        }
    }
})();
// ==UserScript==
// @name         Old Game Finder
// @namespace    Arcbell
// @version      1.2
// @description  Search old lobby pages by game ID
// @author       Arcbell
// @match        https://epicmafia.com/lobby*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20864/Old%20Game%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/20864/Old%20Game%20Finder.meta.js
// ==/UserScript==


var scope = $("#lobby_container").scope();

if (scope) {
    //scope is enabled
    //<form class="form rt ng-pristine ng-valid" id="findgamepage"></form>
    var s = '<input autocomplete="off" id="findgametypebox" name="game" placeholder="Search for a game" type="text">';
    var div = document.createElement('div');
    div.innerHTML = s;
    var newparent = $('.sortnav.rt')[0];
    newparent.insertBefore(div,newparent.firstChild);

    var input = document.getElementById("findgametypebox");
    if (input.addEventListener) {
        input.addEventListener("keypress", function(e) {
            if (e.keyCode === 13) {
                gogetpage();
                e.preventDefault();
            }
        }, false);
    } else if (input.attachEvent) {
        input.attachEvent("onkeypress", function(e) {
            if (e.keyCode === 13) {
                gogetpage();
            }
        });
    }
    gogetpage = function () {
        var v = $('#findgametypebox')[0].value;
        if (!isNaN(v)) {
            scope.loadgamepage({page: 80121, last_id: v});
        } else {alert("That's not a game number!");}
    };
} else {
    var pagesearch = document.createElement("a");
    var newparent = $('.sortnav.rt')[0];
    newparent.insertBefore(pagesearch,newparent.firstChild);
    pagesearch.onclick = function () {angular.reloadWithDebugInfo();};
    pagesearch.innerHTML = '<i class="icon-search"></i>';
}
// ==UserScript==
// @name         Amboss No Distractions
// @namespace    http://oix.cc/gm
// @description  Hide all distractions and maximize your reading efficiency in Miamed Amboss. It hides the top / side bar and expand all sections of a card automatically.
// @author       Bin Zhang
// @icon         https://amboss.miamed.de/favicon-192x192.png
// @homepageURL  http://oix.cc/amboss
// @version      0.0.3
// @match        https://amboss.miamed.de/library
// @include      /^https?://amboss-miamed-de\.ezproxy\..*/library$/
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/22908/Amboss%20No%20Distractions.user.js
// @updateURL https://update.greasyfork.org/scripts/22908/Amboss%20No%20Distractions.meta.js
// ==/UserScript==

(function(){

var loadingWatcher;

if (typeof angular !== 'undefined' || typeof angular.element('#LibraryContent').scope() !== 'undefined') {
    setWatcher();
    window.addEventListener("hashchange", setWatcher);
}

function setWatcher() {
    var i;
    if (!i) i = 50;
    if (null !== getParameterByName('xid', '?' + window.location.hash.substring(1))) {
        // only cards set $root.loading, poll loading
        loadingWatcher = setInterval(checkLoading, i);
    } else {
        i = 1000;
        loadingWatcher = setInterval(function (){
            clearInterval(loadingWatcher);
            loaded();
        }, i);
    }
    //console.log('i=' + i);
}
    
function checkLoading() {
    //console.log('watch');
    //console.log(angular.element('#LibraryContent').scope().$root.loading);

    if (angular.element('#LibraryContent').scope().$root.loading !== true) {
        //console.log(typeof angular.element('#LibraryContent').scope().$root.loading);
        clearInterval(loadingWatcher);
        loaded();
    }
}

function loaded () {
    //console.log('loaded');
    //console.log($('#LibraryContent').html());

    if (null !== getParameterByName('xid', '?' + window.location.hash.substring(1)) && $('#LibraryContent').find('article.LearningCard:visible').length > 0) {
        //console.log('card');
        
        if ($('#amboss-menu').hasClass("move")) {
            $('#amboss-menu').click();
            //angular.element('#amboss-menu').click();
        }
        
        var e = $("#LibraryIndex").find("button.Sidemenu");
        if (e.hasClass("active")) {
            //e.addClass("active");
            LibrarySideMenu.toggleSidemenu();
            //e.hasClass("active") ? (e.removeClass("active"),
            //LibrarySideMenu.closeSidemenu()) : ();
        }
    
        if (null === getParameterByName('anker', '?' + window.location.hash.substring(1)) && false === angular.element('#LearningCard').scope().allUncollapsed) {
            angular.element('#LearningCard').scope().triggerKeyEvent(32);
            // Simulate keyup event
            //var ev = $.Event('keyup');
            //ev.which = 32; // space
            //$('#LearningCard').trigger(ev);
        }
    
        //$('#LibraryContent').find('article.LearningCard').length > 0 && Page.updateElements(1)
    } 
    if ($('#LibraryContent').find('#LibraryList:visible').length > 0) {
        //console.log('list');
        
        if ($('#amboss-menu').hasClass("move")) {
            $('#amboss-menu').click();
            //angular.element('#amboss-menu').click();
        }
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

}());

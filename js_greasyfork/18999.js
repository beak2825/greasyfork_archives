// ==UserScript==
// @name         GitHubFlow PR merge idiot-proofing
// @namespace    https://gist.github.com/raveren/f08ba2673a92c582692e1a233621762f
// @version      0.3
// @author       raveren
// @description  Confirmation before common mistakes when merging Pull Requests in github
// @match        https://github.com/*/pull/*
// @downloadURL https://update.greasyfork.org/scripts/18999/GitHubFlow%20PR%20merge%20idiot-proofing.user.js
// @updateURL https://update.greasyfork.org/scripts/18999/GitHubFlow%20PR%20merge%20idiot-proofing.meta.js
// ==/UserScript==

(function() {
    document.querySelector('.js-merge-branch-action').addEventListener('click', function(e){
        if ( document.querySelector('#commits_tab_counter').innerHTML.trim()!='1'
            && !confirm('More than one commit, you still wanna merge?')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
        
        if ( document.querySelector('.text-pending') && !confirm('Build not complete yet, you still wanna merge?')) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
})();
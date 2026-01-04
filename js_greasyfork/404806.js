// ==UserScript==
// @name        Atlassian JIRA - Cleaner Rapid Board
// @namespace   Violentmonkey Scripts
// @match       https://*.atlassian.net/secure/RapidBoard.jspa*
// @grant       none
// @version     1.2
// @author      William Yeh <william.pjyeh@gmail.com>
// @description 2020/06/17 12:00:00
// @downloadURL https://update.greasyfork.org/scripts/404806/Atlassian%20JIRA%20-%20Cleaner%20Rapid%20Board.user.js
// @updateURL https://update.greasyfork.org/scripts/404806/Atlassian%20JIRA%20-%20Cleaner%20Rapid%20Board.meta.js
// ==/UserScript==

// jshint esversion:6

var hideStatus = false;


(function(){
  // @see https://stackoverflow.com/a/3171058/714426
  document.addEventListener('keydown', function(e) {
    // Ctrl-H
    if (e.keyCode == 72 && !e.shiftKey && e.ctrlKey && !e.altKey && !e.metaKey) {
      if (hideStatus === false) {
        // For horizontal headers  
        addGlobalStyle('.css-e2mdyo, #ghx-header { display: none !important; }');  
        // For card fields
        addGlobalStyle('section.ghx-extra-fields, div.ghx-row.ghx-highlighted-field { display: none !important; }');
        // For backlog fields
        addGlobalStyle('.ghx-plan-extra-fields { display: none !important; }');

        hideStatus = true;
      }
      else {
        // For horizontal headers  
        addGlobalStyle('.css-e2mdyo, #ghx-header { display: inline !important; }');  
        // For card fields
        addGlobalStyle('section.ghx-extra-fields, div.ghx-row.ghx-highlighted-field { display: inline !important; }');
        // For backlog fields
        addGlobalStyle('.ghx-plan-extra-fields { display: flex !important; }');

        hideStatus = false;
      }    
    }
  }, false);
})();

/*

// Use VM.registerShortcut
// @see https://github.com/violentmonkey/vm-shortcut
VM.registerShortcut('c-h', () => {
  //console.log('You have pressed Ctrl-H');

  if (hideStatus === false) {
    // For horizontal headers  
    addGlobalStyle('.css-e2mdyo, #ghx-header { display: none !important; }');  
    // For card fields
    addGlobalStyle('section.ghx-extra-fields, div.ghx-row.ghx-highlighted-field { display: none !important; }');
    
    hideStatus = true;
  }
  else {
    // For horizontal headers  
    addGlobalStyle('.css-e2mdyo, #ghx-header { display: inline !important; }');  
    // For card fields
    addGlobalStyle('section.ghx-extra-fields, div.ghx-row.ghx-highlighted-field { display: inline !important; }');
    
    hideStatus = false;
  }
  
});
*/


/* 
 * @see https://somethingididnotknow.wordpress.com/2013/07/01/change-page-styles-with-greasemonkeytampermonkey/ 
 */
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
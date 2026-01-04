// ==UserScript==
// @name          Facebook recent dinamic figuccio
// @namespace     https://greasyfork.org/users/237458
// @version       0.7
// @author        figuccio
// @description   button passa a feed recenti senza ricaricare solo lingua italiano facebook 2023
// @match         https://*.facebook.com/*
// @grant         GM_addStyle
// @grant         GM_registerMenuCommand
// @run-at        document-start
// @icon          https://facebook.com/favicon.ico
// @noframes
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/466726/Facebook%20recent%20dinamic%20figuccio.user.js
// @updateURL https://update.greasyfork.org/scripts/466726/Facebook%20recent%20dinamic%20figuccio.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
        // Attendi che la pagina si carichi completamente
        setTimeout(NEWaddtopnavbarrecentbutt, 3000); // Regola il ritardo se necessario
    });
////////////////////////////////////////logout
function NEWaddtopnavbarrecentbutt(){
    console.log('addtopnavbarrecentbutt');
  if(document.querySelectorAll('div[role="banner"] div[role="navigation"]').length!=2) {
    console.log("Didn't find insert point for recent button");
	return;
  }

  var recent=document.createElement('a');
  recent.innerHTML="&nbsp;Rec<br/>&nbsp;ent&nbsp;";
  recent.title = 'Feed Recenti senza reflesh';
  recent.id="Link";
  recent.style="text-decoration: none;margin-left:-40px;color:var(--primary-text);position:relative;left:-950px;background-color:var(--secondary-button-background);font-weight:700;padding-left: 4px;padding-right: 4px;padding-top: 4px; padding-bottom: 4px; leftmargin:15px;border-top-left-radius: 50%;border-bottom-left-radius: 50%;border-top-right-radius: 50%;border-bottom-right-radius: 50%;";

  document.querySelectorAll('div[role="banner"] div[role="navigation"]')[1].firstChild.parentNode.insertBefore(recent,document.querySelectorAll('div[role="banner"] div[role="navigation"]')[1].firstChild);

  recent.addEventListener("click",modifylink);
  function modifylink() {
  var link = Array.from(document.querySelectorAll('.x1iyjqo2'));
  for (let i = 0; i < link.length; i++) {
  if (link[i].textContent === 'Feed') {
  link[i].click();
  }
  }

}
modifylink();
    //////////////////////////////////////
}

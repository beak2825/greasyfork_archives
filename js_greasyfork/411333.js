// ==UserScript==
// @name          facebook logout new facebook
// @description   pulsante logout facebook
// @author        figuccio
// @version       10.0
// @namespace     https://greasyfork.org/users/237458
// @match         https://*.facebook.com/*
// @noframes
// @grant         GM_addStyle
// @icon          https://facebook.com/favicon.ico
// @require       https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/411333/facebook%20logout%20new%20facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/411333/facebook%20logout%20new%20facebook.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
        // Attendi che la pagina si carichi completamente
        setTimeout(NEWaddtopnavbarlogoutbutt, 100); // Regola il ritardo se necessario
    });
////////////////////////////////////////logout
function NEWaddtopnavbarlogoutbutt(){
    console.log('addtopnavbarlogoutbutt');
  if(document.querySelectorAll('div[role="banner"] div[role="navigation"]').length!=2) {
    console.log("Didn't find insert point for logout button");
	return;
  }
 // Controlla se il pulsante esiste già
    if (document.getElementById("fbpLogoutLink")) {
        console.log("Logout button already exists");
        return;
    }

  var logoutlink=document.createElement('a');
  logoutlink.innerHTML="&nbsp;Log<br/>&nbsp;Out&nbsp;";
  logoutlink.href="";
  logoutlink.title = 'esci';
  logoutlink.id="fbpLogoutLink";
  logoutlink.style="text-decoration: none;margin-left:7px;color:var(--primary-text);position:relative;background-color:var(--secondary-button-background);font-weight:700;padding-left: 4px;padding-right: 4px;padding-top: 4px; padding-bottom: 4px; leftmargin:15px;border-top-left-radius: 50%;border-bottom-left-radius: 50%;border-top-right-radius: 50%;border-bottom-right-radius: 50%;";

  document.querySelectorAll('div[role="banner"] div[role="navigation"]')[1].firstChild.parentNode.insertBefore(logoutlink,document.querySelectorAll('div[role="banner"] div[role="navigation"]')[1].firstChild);

  logoutlink.addEventListener("click", function(e) {e.preventDefault(); document.querySelector('form[action^="/logout.php?"').submit(); e.target.innerHTML='<img src="//www.facebook.com/images/loaders/indicator_blue_small.gif"/>'},false);

}

window.setTimeout(NEWaddtopnavbarlogoutbutt,7000);

// ==UserScript==
// @name         Admin
// @namespace    http://prodgaming.fr/*
// @version      1.1
// @description  enter something useful
// @author       Marentdu93
// @match        http://prodgaming.fr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12400/Admin.user.js
// @updateURL https://update.greasyfork.org/scripts/12400/Admin.meta.js
// ==/UserScript==

$ ('.navTabs .visitorTabs').append('<li class="navTab secret Popup PopupControl PopupContainerControl PopupClose"><a href="http://prodgaming.fr/admin.php" TARGET = "_blank" rel="Menu" class="navLink NoPopupGadget"><i class="fa fa-user-secret "></i></a></li>') 	

var element = document.getElementById("moderatorBar");
 
// boucle tant qu'un enfant existe
while (element.firstChild) {
   // le supprime
   element.removeChild(element.firstChild);
}
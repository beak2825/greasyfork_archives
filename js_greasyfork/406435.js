// ==UserScript==
// @author Federico Nicotra
// @name     WhatsWebDarkMode
// @version  1.0
// @grant    none
// @description This script allows Whatsapp Web to be in Dark Mode.
// @namespace https://greasyfork.org/users/663025
// @icon http://makewhatswebdarker.altervista.org/IMG/wdfavicon.png
// @match *://web.whatsapp.com/*
// @compatible firefox
// @compatible chrome
// @compatible safari
// @compatible opera
// @license CC BY-NC-ND 4.0 International. https://creativecommons.org/licenses/by-nc-nd/4.0/
// @downloadURL https://update.greasyfork.org/scripts/406435/WhatsWebDarkMode.user.js
// @updateURL https://update.greasyfork.org/scripts/406435/WhatsWebDarkMode.meta.js
// ==/UserScript==

(
  function() {
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    
    if (this.readyState == 4 && this.status == 200) {
      
        var css = document.createElement('style');
        var body = document.getElementsByTagName('body')[0];
        var resp = document.createTextNode(xhttp.responseText);
        css.type = 'text/css';
        css.appendChild(resp);
        body.appendChild(css);
      
    }
  };
  
  xhttp.open("GET", "https://makewhatswebdarker.altervista.org/files/wwd_lst.css", true);
  
  xhttp.send();
}
 
)();
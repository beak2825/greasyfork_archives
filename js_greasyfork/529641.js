// ==UserScript==
// @name     SpaceApp Menu
// @version  1.2
// @grant    none
// @description replace spaceapp menu
// @match        https://spaceapp.ru/*
// @namespace https://greasyfork.org/users/1443482
// @downloadURL https://update.greasyfork.org/scripts/529641/SpaceApp%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/529641/SpaceApp%20Menu.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const links = document.querySelectorAll("ul.nav:nth-child(2) > li");


  links.forEach((item) => {
    const link = item.querySelector("a");
    if (item instanceof HTMLElement) {
        
      if (["GitLab", "Kibana", "Zabbix", "Платежи"].includes(link.innerText)) {
      	link.remove()
      }
      
      if (link.innerText === "Википедия") {
		link.href = "https://docs.spaceapp-dev.com/";
      }
    }
  })

})();

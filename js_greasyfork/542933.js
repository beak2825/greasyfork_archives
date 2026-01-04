// ==UserScript==
// @name        Hide/Show sidebar on boot.dev solution pages
// @namespace   https://github.com/luigiMinardi
// @match       https://www.boot.dev/solution/*
// @grant       none
// @version     1.0
// @author      luigiMinardi
// @license     MIT
// @description Hide/Show sidebar on boot.dev solution pages by providing a button that changes the display of the sidebar.
// @homepageURL https://greasyfork.org/en/scripts/542933-hide-show-sidebar-on-boot-dev-solution-pages
// @downloadURL https://update.greasyfork.org/scripts/542933/HideShow%20sidebar%20on%20bootdev%20solution%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/542933/HideShow%20sidebar%20on%20bootdev%20solution%20pages.meta.js
// ==/UserScript==

let button = document.createElement("input");

button.type = "button"; // type of input element to button
button.value = "Hide"; // Button text
button.style.zIndex = "9999"; // to make sure button always appear
button.style.position = "absolute"; // Make button position independent to where it is attached
button.style.bottom = "1rem"; // Adjust button position on screen
button.style.right = "1rem"; // Adjust button position on screen

// Style button to be similar to boot.dev button
button.style.background = "radial-gradient(circle at center, hsla(0, 0%, 100%, .3), transparent 70%), linear-gradient(to bottom, #c4d1db, #a3b3c7)";
button.style.borderColor = "#d7dee6";
button.style.color = "rgb(24 27 38/1)"
button.style.fontWeight = 600;
button.style.borderWidth = "1px";
button.style.borderRadius = "9999px";
button.style.paddingTop = ".5rem";
button.style.paddingBottom = ".5rem";
button.style.paddingLeft = "1rem";
button.style.paddingRight = "1rem";


button.onclick = function () {
  // find sidebar
  let sidebar = document.querySelector("#__nuxt > div > div.static-bgimage.bg-image-blue.h-full.w-full.overflow-auto > div > div > div.flex-shrink-1.flex.h-full.w-min.flex-col.overflow-y-auto.border-r.border-gray-400.pt-4");
  if (sidebar.style.display !== "none") {
      sidebar.style.display = 'none';
      button.value = "Show";
  } else {
    sidebar.style.removeProperty("display");
    button.value = "Hide";
  }
};
// find nuxt element so that we can attach the button to it.
let page = document.getElementById('__nuxt');
// attach button to page
page.appendChild(button);
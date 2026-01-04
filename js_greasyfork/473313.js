// ==UserScript==
// @name        Ebay - Remove selected countries from list
// @namespace   ebay_remove_selected_countries
// @description Removes unneeded countries from listings
// @include     /^https://www\.ebay\.com/sch.*/i\.html.*$/
// @include     /^https://www\.ebay\.(..)/sch.*/i\.html.*$/
// @include     /^https://www\.ebay\.co\.(..)/sch.*/i\.html.*$/
// @include     /^https://www\.ebay\.com\.(..)/sch.*/i\.html.*$/
// @author      Jous
// @grant       none
// @license     Unlicense; http://unlicense.org/
// @version     1.1.5
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ebay.com

// @downloadURL https://update.greasyfork.org/scripts/473313/Ebay%20-%20Remove%20selected%20countries%20from%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/473313/Ebay%20-%20Remove%20selected%20countries%20from%20list.meta.js
// ==/UserScript==

  var blacklist = ['China',
                   'Japan',
                   'Hong Kong',
                   'Canada',
                   'Australia',
                   'United Kingdom',
                   'United States',
                   'India',
                   'Israel',
                   'Sri Lanka',
                   'Taiwan'
                  ];


  // Show to user how many products were removed
  var infoMsg = document.createElement("div");
	var a = document.createElement('a');
	a.onclick = remove_countries;
  a.appendChild(document.createTextNode("remove"));
  infoMsg.appendChild(a);
  infoMsg.appendChild(document.createTextNode(" non-eu countries"));
  infoMsg.style.position = "absolute";
  infoMsg.style.top = "100px";
  infoMsg.style.right = "10px";
  infoMsg.style.padding = "10px";
  infoMsg.style.backgroundColor = "#ccc";
  document.body.appendChild(infoMsg);

  function remove_countries() {

    var tags = null;
    var count = 0;

    tags = document.querySelectorAll(".s-item__itemLocation");

    Array.prototype.forEach.call(tags, function(elem) {
      var country = elem.innerHTML.substr(elem.innerHTML.indexOf(" ") + 1);
      if (blacklist.includes(country)) {
        var removeElement = elem.parentNode.parentNode.parentNode.parentNode.parentNode;
        removeElement.parentNode.removeChild(removeElement);
        count++;
      }
    });

    infoMsg.removeChild(infoMsg.firstChild)
    infoMsg.removeChild(infoMsg.firstChild)
    infoMsg.appendChild(document.createTextNode(count + " listings removed."));
  }

// ==UserScript==
// @name     AWS shortcut keys
// @description AWS navigation shortcut keys
// @include  http*://*aws.amazon.com/*
// @version  1.02
// @grant    none
// @namespace https://greasyfork.org/users/304483
// @downloadURL https://update.greasyfork.org/scripts/409469/AWS%20shortcut%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/409469/AWS%20shortcut%20keys.meta.js
// ==/UserScript==

// Based on this example:
// https://greasyfork.org/en/scripts/2656-facebook-logout-shortcut-just-press-alt-l/code

var eventUtility = {
    addEvent : function(el, type, fn) {
        if (typeof addEventListener !== "undefined") {
            el.addEventListener(type, fn, false);
        } else if (typeof attachEvent !== "undefined") {
            el.attachEvent("on" + type, fn);
        } else {
            el["on" + type] = fn;
        }
    }
};

function ascii (a) { return a.charCodeAt(0); }

function getClassElementWithTitle(classname, title)
{
  // assess parent frame/document
  {
    var items = document.getElementsByClassName(classname);

    for (i = 0; i < items.length; i++)
    {
      if (items[i].title == title)
        return items[i];
    }
  }
  
  // assess *all* iframes
  for (k = 0; k < window.frames.length; k++)
  {
    var items = window.frames[k].document.getElementsByClassName(classname);

    for (i = 0; i < items.length; i++)
    {
      if (items[i].title == title)
        return items[i];
    }
  }
  return null;  
}

function checkForShortcutKeys(evt)
{
  var code = evt.keyCode,
      altKey = evt.altKey;
  shiftKey = evt.shiftKey;

  // ALT + / = Go to search box
  if (altKey && code === 191)
  {
    var searchfield = document.getElementById("search-box-input");
    searchfield.focus()
    searchfield.select()
  }

  // ALT + R = Click 'refresh' button/link in page
  if (altKey && code === ascii('R'))
  {
    var refreshBtn = getClassElementWithTitle('gwt-Image', 'Refresh');
    if (refreshBtn)
      refreshBtn.click();
  }    
  
  // ALT + S = 'Services' menu
  if (altKey && code === ascii('S'))
  {
    var services = document.getElementById("nav-servicesMenu");
    services.click();
    evt.preventDefault();
  }
}


(function() {
  
  // BASE FRAME EVENT HANDLER
  // ========================
	eventUtility.addEvent(document, "keydown",
		function(evt) {
      checkForShortcutKeys(evt);
		});
  
  // IFRAME EVENT HANDLER
  // ====================
  for (k = 0; k < window.frames.length; k++)
  {
    eventUtility.addEvent(window.frames[k].document, "keydown",
      function(evt) {
        checkForShortcutKeys(evt);
      });
  }
}());
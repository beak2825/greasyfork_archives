// ==UserScript==
// @name         Market menu shortcut
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Add some shortcuts
// @author       Kobe42
// @match        *://talibri.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370175/Market%20menu%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/370175/Market%20menu%20shortcut.meta.js
// ==/UserScript==

var shortcuts = {'City': 'https://talibri.com/cities/Gild', 'Market': 'https://talibri.com/trade/1'}
var links_to_remove = ['User Script', 'About']

function getElementsByXPath(xpath, parent)
{
  let results = [];
  let query = document.evaluate(xpath,
      parent || document,
      null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i=0, length=query.snapshotLength; i<length; ++i) {
    results.push(query.snapshotItem(i));
  }
  return results;
}

function add_shortcuts() {
    var navbar = $('ul.nav.navbar-nav').first()

    for(var key in shortcuts){
        var url = shortcuts[key];

        if ( $('#shortcut_market').length <= 0 ) {
            let item_id = key.split(' ').join('_').toLowerCase()
            navbar.append('<li id="shortcut_' + item_id + '"><a href="' + url + '">' + key + '</a></li>');
        }
    }

    links_to_remove.forEach(function(text) {
        let elements = getElementsByXPath('//ul[contains(@class, "nav")]//li[contains(., "' + text + '")]')
        if (elements != null && elements.length > 0) {
            elements[0].remove()
        }
    });
}

$(add_shortcuts()) // document ready
document.addEventListener('turbolinks:load', add_shortcuts);
// ==UserScript==
// @name         TagGrabber
// @namespace    Empornium Scripts
// @version      1.0.1
// @description  Copies all tags from title page to space-separated string.
// @author       vandenium
// @include /^https://www\.empornium\.(me|sx|is)\/torrents.php\?id=*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=empornium.is
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500058/TagGrabber.user.js
// @updateURL https://update.greasyfork.org/scripts/500058/TagGrabber.meta.js
// ==/UserScript==
// Changelog:
// Version 1.0.0
//  - Initial version. Works with Tag Highlighter and Hoverbabe.
// Version 1.0.1
//  - Space-separated instead of comma-separated.
(function() {
    'use strict';
    function createButton() {
      const button = document.createElement('button');
      button.id = 'tag-grabber-button';
      button.innerText = 'Grab Tags';
      button.addEventListener('click', (e) => {
          const selectorVanilla = 'ul#torrent_tags_list>li>a:first-child';
          const selectorETH = 'ul#torrent_tags_list>li>span>a';
          const isETHLoaded = !!document.querySelector('span.s-tag');
          const tagList = Array.from(document.querySelectorAll(`${isETHLoaded ? selectorETH : selectorVanilla}`)).map(i => i.innerText).map(v => v.replace('📸', ''));
          navigator.clipboard.writeText(tagList.toString().replace(/,/g, ' '));
          alert(`Copied ${tagList.length} tags list to clipboard.`);
      });
      return button;
    }

    function addToDom(el) {
      document.querySelector('div#tag_container').prepend(el);
    }

    addToDom(createButton());
    
})();
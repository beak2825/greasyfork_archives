// ==UserScript==
// @name           Findgaytube Download Button
// @namespace      https://www.findgaytube.com
// @version        1.0.0
// @description    Adds a download button to findgaytube.com
// @author         persistentScripter
// @include        http*://www.findgaytube.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/389665/Findgaytube%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/389665/Findgaytube%20Download%20Button.meta.js
// ==/UserScript==

$(document).ready(function($) {
  const tabsContainer = $('.b-tabs-navigation.f-right');
  const source = $('source');

  if (tabsContainer.length && source.length) {
    const {src} = source[0];
    const downloadButton = tabsContainer.prepend(`<a id="__download__" href="${src}" class="report" rel="nofollow">Download</a>`);

    downloadButton.on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.open(src);
    });
  }
});

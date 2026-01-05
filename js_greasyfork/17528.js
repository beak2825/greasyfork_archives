// ==UserScript==
// @name         eBay copy short url button
// @namespace    https://github.com/arieljannai
// @version      0.1.4
// @description  Adds a copy short url button to ebay item page. Copies a nice link instead of a long one. The short url - http://www.ebay.com/itm/item_id
// @author       Ariel Jannai
// @include		   *://www.ebay.com/itm/*
// @include		   *://www.ebay.de/itm/*
// @include		   *://www.ebay.co.uk/itm/*
// @include		   *://www.ebay.com.au/itm/*
// @run-at       document-end
// @icon         https://cdn4.iconfinder.com/data/icons/flat-brand-logo-2/512/ebay-128.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/17528/eBay%20copy%20short%20url%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/17528/eBay%20copy%20short%20url%20button.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// http://icons.iconarchive.com/icons/icons8/windows-8/32/Editing-Copy-Link-icon.png
var copyIcon = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAC0klEQVR42sWXW4hOURTH1+cyuUWiaYrShEmuzaN5kCFvkgcPmDFNUUpRDNM0pmaIkEKjKPdLuecSJS+SEo2HmUEeJJd4kEJKDTLD/99aX9+Z851zvn2+M2es+rX3Od/Z3/7vvc5ae52M5Gwt2Ahmg6ESbr3gLtgAPkhCy1h7DqyJOfYzWAqeJhXAlZ+w60/gIvgeMaYETAWvwFfQDvqSCOgC82zySmsL2QxQ4dnBIPsFHoCfhQT8EfX5QbDFYeJTYL7jAj+CGvAwSsBf67eBHRF/Ng08ARMcJ8/ab1ALriYVcFv0paMdFX1xeyKeHw+uW8vIqQMXihUwFnwDQ+xPahxXfwsss36gCFcBc0G39VeLRoqLnQb1nus8Ea4CGCVd1l9uKytGQJ6I/yEgK2IFuJm2gD2gKeQ3vsBVaQsYDpZYSxsDykAjKAWP0hYQZrvAdnbSFsAcwBB+77vfavOlJmAkOCYasswdz2zc28EQwMnvgEXgEngNtoHHoHowBEwBM8EkyR3zZ0XPg2yhk4qAYaJFTZWoz4+I1gujQKdoHVGelgBuOw+rxaLFCf3eARZ63FFvOzHgArw+3w+aRWN/Mlhp95mM9nnGDJgA7+SHwDvRg4qplud/dcDkeQL6rKX6xpgCuKU8WPaC8+C5aIVFKwmZPE/ACzBLtMSeI8EFaZAAVkasjK+AVfYbV1xri+JO3A9ZUD8B/BZotx/eiNZ8PzwPv7SJ/ALK7fndoEU04zEKOmxRUdVSPwF8Y29IrnLx2xnzb5ALmOFYHV8WLVSnR2x7qAAaE0QD2CSaQFwFcBeOi4YbY3+n5EItlgCvTQSjPdd0R6m5grZeNM8nsQNgM+jNOA5glvsi6mfuBLNdj+NYv7Ee6LS221UAjWG61fo8YK5Jga+eABsnGjFldr0ujoAR4B5YUOTK/ca8URdHAI2lFX3HD9qKIiZlhmSIHgYneeMfv6reNvMbmkwAAAAASUVORK5CYII=")';
var copyButton = '<div style="float:left"><a rel="nofollow" href="javascript:;" ' +
				'class="copy-url" aria-label="Copy short url to clipboard" ' +
				'title="Copy short url to clipboard" target="_blank"><span class="copy-short-url"/></a></div>';

function tryShortUrl(url) {
	var urlPattern = /ebay\.(com|de|co\.uk)\/itm/;

	if(urlPattern.test(url)) {
		var id = url.match(/\/(\d{12})(\?|$)/)[1];
		return 'http://www.' + urlPattern.exec(url)[0] + '/' + id;
	} else {
		return url;
	}
}

// https://somethingididnotknow.wordpress.com/2013/07/01/change-page-styles-with-greasemonkeytampermonkey/
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

// http://stackoverflow.com/a/30810322/2350423
function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a flash,
  // so some of these are just precautions. However in IE the element
  // is visible whilst the popup box asking the user for permission for
  // the web page to copy to the clipboard.
  //

  // Place in top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em';
  textArea.style.height = '2em';

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = 0;

  // Clean up any borders.
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';

  // Avoid flash of white box if rendered for any reason.
  textArea.style.background = 'transparent';


  textArea.value = text;

  document.body.appendChild(textArea);

  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg + ': ' + text);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}

// start

addGlobalStyle('.copy-short-url { background: ' + copyIcon + '; width: 18px; height: 18px; float: left; background-size: contain;}');
addGlobalStyle('.copy-url { margin-right: 3px; }');

$('div.social-widget > div')[0].style.float = "right";
$('div.social-widget').prepend(copyButton);

$('.copy-url')[0].addEventListener('click', function(event) {
	copyTextToClipboard(tryShortUrl(document.location.href));
});

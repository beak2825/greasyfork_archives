// ==UserScript==
// @name        SearchFox Search Result Copy
// @description Injects buttons to the left of searchfox.org results, allowing for a one-click copy of the <path>:<line> of the location of the result.
// @icon        https://searchfox.org/mozilla-central/static/icons/search.png
// @license     MIT https://mit-license.org/
// @match       https://searchfox.org/*/search?*
// @namespace   https://github.com/bytesized
// @version     1.03
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/528503/SearchFox%20Search%20Result%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/528503/SearchFox%20Search%20Result%20Copy.meta.js
// ==/UserScript==

/**
 * Adapted from an icon obtained from: https://www.svgrepo.com/svg/522391/copy
 * Modified to change the coloring and transparency.
 * Original icon created by Luka Marr and licensed under CC Attribution License: https://creativecommons.org/licenses/by/4.0/deed.en
 */
const copy_icon_svg = `
<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="8" width="12" height="12" rx="1" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
  <path d="M8 6V5C8 4.44772 8.44772 4 9 4H19C19.5523 4 20 4.44772 20 5V15C20 15.5523 19.5523 16 19 16H18" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="2 2" />
</svg>
`;

/**
 * Adapted from an icon obtained from: https://www.svgrepo.com/svg/509325/check-circle
 * Modified to change the coloring.
 * Original icon created by Afnizarnur and licensed under MIT License: https://mit-license.org/
 * The MIT license requires that a copy of the license be distributed with the work. I was unable
 * to locate any copy of the license directly attached to the work, so I am including the the
 * license as it is currently available on https://mit-license.org/
 *
 * The MIT License (MIT)
 *
 * Copyright © 2025 <copyright holders>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const copied_icon_svg = `
<?xml version="1.0" encoding="utf-8"?>
<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path fill="white" fill-rule="evenodd" d="M3 10a7 7 0 019.307-6.611 1 1 0 00.658-1.889 9 9 0 105.98 7.501 1 1 0 00-1.988.22A7 7 0 113 10zm14.75-5.338a1 1 0 00-1.5-1.324l-6.435 7.28-3.183-2.593a1 1 0 00-1.264 1.55l3.929 3.2a1 1 0 001.38-.113l7.072-8z" />
</svg>
`;

function make_svg_url(svg) {
  return "data:image/svg+xml," + encodeURIComponent(svg.replaceAll("\n", "").replaceAll(/^ */g, ""));
}

const copy_icon_url = make_svg_url(copy_icon_svg);
const copied_icon_url = make_svg_url(copied_icon_svg);

let g_injected_stylesheet = null;
function inject_css_rule(rule) {
  if (!g_injected_stylesheet) {
    g_injected_stylesheet = document.createElement("style");
    document.head.append(g_injected_stylesheet);
    g_injected_stylesheet = g_injected_stylesheet.sheet;
  }
  
  g_injected_stylesheet.insertRule(rule, g_injected_stylesheet.cssRules.length);
}

function find_or_wait_for_element(selector, callback, once = false) {
  for (let node of document.querySelectorAll(selector)) {
    callback(node);
    if (once) {
      return;
    }
  }

  let observer = new MutationObserver((mutation_list, observer) => {
    for (let node of document.querySelectorAll(selector)) {
      callback(node);
      if (once) {
        observer.disconnect();
        return;
      }
    }
  });
  let config = {
    attributes: false,
    characterData: false,
    childList: true,
    subtree: true,
  };
  observer.observe(document.body, config);
}

async function until_element(selector) {
  return new Promise(resolve => find_or_wait_for_element(selector, resolve));
}

function add_copy_buttons() {
  if (document.body.dataset.bytesizedCopyButtonsInjected) {
    return;
  }
  document.body.dataset.bytesizedCopyButtonsInjected = "true";

	inject_css_rule(`
  	table.results .bytesized_line_copy_button {
    	width: 1.2rem;
      height: 1.2rem;
      background-image: url('${copy_icon_url}');
      background-repeat: no-repeat;
      background-size: contain;
      float: left;
      border-width: 0;
      border-radius: 0.25rem;
      cursor: pointer;
    }
	`);
	inject_css_rule(`
  	table.results .bytesized_line_copy_button.copied {
      background-image: url('${copied_icon_url}');
    }
	`);
  inject_css_rule(`
  	table.results td.left-column {
    	width: 11ex;
    }
	`);
  inject_css_rule(`
  	table.results td.left-column a {
    	margin-left: 1rem;
    }
	`);

  for (const el of document.querySelectorAll("table.results td.left-column")) {
    if (el.children.length < 1) {
      continue;
    }
    const anchor = el.children[0];
    if (anchor.nodeName.toLowerCase() != "a") {
      continue;
    }
    let url = anchor.href;
    const url_prefix = "https://searchfox.org/";
    if (!url.match(url_prefix)) {
      continue;
    }
    url = url.substring(url_prefix.length);
    if (!url.includes("/")) {
      continue;
    }
    let url_parts = url.split("/");
    // Remove the `/repo/source/` from the url path.
    url_parts.shift();
    if (!url_parts.shift() == "source") {
      continue;
    }
    let url_path = url_parts.join("/");
    if (!url_path.includes("#")) {
      continue;
    }
    const [path, line] = url_path.split("#", 2);

    const copy_button_el = document.createElement("button");
    copy_button_el.classList.add("bytesized_line_copy_button");
    
    copy_button_el.addEventListener("click", () => {
      navigator.clipboard.writeText(`${path}:${line}`).then(() => copy_button_el.classList.add("copied"));
    });

    el.append(copy_button_el);
  }
}
until_element("table.results td.left-column").then(add_copy_buttons);

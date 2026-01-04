// ==UserScript==
// @name        Youtube toggle "Related Videos" visibility
// @namespace   Violentmonkey Scripts
// @match       http*://*.youtube.com/watch*
// @grant       none
// @version     1.2a
// @author      Eliran Gonen
// @description Adds toggle text button to hide/show Related Videos. Useful in zoomed in mode in order to easily skip to the comments.
// @downloadURL https://update.greasyfork.org/scripts/406436/Youtube%20toggle%20%22Related%20Videos%22%20visibility.user.js
// @updateURL https://update.greasyfork.org/scripts/406436/Youtube%20toggle%20%22Related%20Videos%22%20visibility.meta.js
// ==/UserScript==


window.related_toggle_hidden = function () {
  related = document.querySelector("ytd-watch-next-secondary-results-renderer.style-scope");

	related.hidden = !related.hidden

	related_button = document.querySelector("#RelatedToggleBtn")
  if (related_button.textContent[0] == "+")
		related_button.textContent = related_button.textContent.replace("+", "-")
	else if (related_button.textContent[0] == "-")
		related_button.textContent = related_button.textContent.replace("-", "+")
}

function add_related_toggle_button() {
  related = document.querySelector("div#related.style-scope.ytd-watch-flexy");

  if (related == null) {
    console.error("grease: could not find 'related' element")
    return
  } else {
    console.info("grease: found related selector")
  }

    // <div>
	div_el = document.createElement("div")
	div_el.id = "related_toggle_button"

	// <button>
  button_el = document.createElement("button")
  button_el.id = "RelatedToggleBtn"
  button_el.setAttribute("onclick", "javascript:related_toggle_hidden()")
  button_el.textContent = "Toggle related"
  button_el.style.marginBottom = "6px"

  div_el.appendChild(button_el)

  console.log("grease: inserting element")

  related.insertBefore(div_el, related.children[0]);

  button_el.click(); /* comment this to start the page with "related" column visible */
}

setTimeout(function() {
  console.log("grease: starting YT")

  add_related_toggle_button()
}, 2500); /* I found this to be optimal but you can vary this if you need */
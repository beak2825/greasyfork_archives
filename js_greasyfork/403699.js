// ==UserScript==
// @name        Google search bar swap Images<->Videos position
// @match       http*://*.google.com/search?*
// @grant       none
// @version     1.0
// @author      You
// @description Swap "Videos" and "Images' tabs position
// @namespace https://greasyfork.org/users/233017
// @downloadURL https://update.greasyfork.org/scripts/403699/Google%20search%20bar%20swap%20Images%3C-%3EVideos%20position.user.js
// @updateURL https://update.greasyfork.org/scripts/403699/Google%20search%20bar%20swap%20Images%3C-%3EVideos%20position.meta.js
// ==/UserScript==

// Clone and remove the hidden Videos menu item
//videos_element = document.querySelector(".AchQod")
videos_element = document.querySelector(".il8Sef > a:nth-child(1)")
videos_clone = videos_element.cloneNode(true)
videos_element.remove()

// Insert a div and append the clone as a child to it
div_clone = document.querySelector("div.hdtb-mitem:nth-child(3)").cloneNode(false)
after=document.querySelector("div.hdtb-mitem:nth-child(3)")
new_div = after.parentNode.insertBefore(div_clone, after.nextSibling)
after.nextSibling.appendChild(videos_clone)
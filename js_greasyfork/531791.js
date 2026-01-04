// ==UserScript==
// @name Old Reddit Image Loader
// @description 2025-04-03
// @author -
// @match https://www.reddit.com/*
// @grant none
// @version 1.0
// @namespace https://greasyfork.org/users/128589
// @downloadURL https://update.greasyfork.org/scripts/531791/Old%20Reddit%20Image%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/531791/Old%20Reddit%20Image%20Loader.meta.js
// ==/UserScript==

[...document.querySelectorAll('a')].forEach((element) => {
  if(element.innerHTML == '&lt;image&gt;'){
    const my_img = document.createElement('img')
    my_img.src = element.href
    my_img.style = 'max-width:240px;width:100%'

    const link = document.createElement('a')
    link.href = element.href
    link.target = '_blank'
    link.appendChild(my_img)

    element.replaceWith(link)
  }
});

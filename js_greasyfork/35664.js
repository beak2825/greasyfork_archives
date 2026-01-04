// ==UserScript==
// @name        FEH Wiki Img Extractor
// @namespace   _feh_wiki_img_extr
// @description Extract images from wiki pages
// @include     https://feheroes.gamepedia.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version     0.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/35664/FEH%20Wiki%20Img%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/35664/FEH%20Wiki%20Img%20Extractor.meta.js
// ==/UserScript==

var output = ""

// Extract image links from the infobox
var query = $('#mw-content-text .hero-infobox img').attr('src')
if (typeof query != "undefined") {
  output += "    thumbnail:\n"
  for (var i = 0; i < query.length; i++) {
    let link = query.eq(i).attr('src').split('/')
    let stripped = "https://" +  link.slice(2, 5).join('/') + "/" + link.slice(6, 9).join('/')
    output += "        - "
    output += stripped
    output += '\n'
  }
}

// Extract image links from the skill table
query = $('#mw-content-text table.skills-table tr td img')
if (typeof query != "undefined") {
  output += "    icon:\n"
  for (var i = 0; i < query.length; i++) {
    let link = query.eq(i).attr('src').split('/')
    let stripped = "https://" +  link.slice(2, 5).join('/') + "/" + link.slice(6, 9).join('/')
    output += "        - "
    output += stripped
    output += '\n'
  }
}
console.log(output)
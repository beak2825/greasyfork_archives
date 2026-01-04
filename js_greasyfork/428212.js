// ==UserScript==
// @name        Better kontaktbazar.at posts
// @namespace   Violentmonkey Scripts
// @match       https://www.kontaktbazar.at/kbaz-details.php
// @grant       none
// @version     1.0
// @author      -
// @description Expand images in posts - 6/20/2021, 6:05:09 AM
// @downloadURL https://update.greasyfork.org/scripts/428212/Better%20kontaktbazarat%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/428212/Better%20kontaktbazarat%20posts.meta.js
// ==/UserScript==
$("td.eintragFooter").ready(function () {
  main_src = $("tr.eintragMain > td.eintragFoto > img").attr("src")
  // alert(main_src)
  images_onmouseover = $("td.eintragFooter td.eintragFoto > img.startbild").map((i, el) => el.getAttribute('onmouseover')).get()
  images_src = images_onmouseover.map(function (x) {
    /*
      the onmouseover is of the format:
      return overlib('<img src=/fotos/1234/1234_uf2_06-21.jpg height=450 \>',CAPTION,'',FGCOLOR,'#efefef',BGCOLOR,'#4b4b4b',CAPCOLOR,'#ffffff',VAUTO,HAUTO);
    */
    matches = x.match(/overlib\('<img src=(\/fotos\/[^ ]+)/)
    if (matches !== null && matches[1]) {
      return matches[1]
    }
    return null
  }).filter(x => x !== null)
  images_src.unshift(main_src)
  $("table.eintragFooter > tbody").append($('<tr>').append($('<td>').attr('id', 'largeImages').attr('class', 'eintragFooter').append($('<br>'))))
  images_src.map(function(i) {
    $("td#largeImages").append($('<br>')).append($('<br>')).append($('<img>').attr('src', i))
  })
  
})
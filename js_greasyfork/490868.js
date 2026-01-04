// ==UserScript==
// @name        Get magnet link from 1337x
// @namespace   Useful Scripts
// @match       https://1337x.*/*
// @grant       none
// @version     1.0
// @author      -
// @description 25/03/2024, 18:18:25
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490868/Get%20magnet%20link%20from%201337x.user.js
// @updateURL https://update.greasyfork.org/scripts/490868/Get%20magnet%20link%20from%201337x.meta.js
// ==/UserScript==

$(document).ready(function() {

    let listLink = new Set();

    // I am no fan of jQuery, but this is the way;
    let wrapperDiv = $(`<div style="display:flex; flex-direction:column; gap:0.5rem;" > </div>`);

    // Get all <a> tags tha has a href containing magnet
    $('a[href*="magnet"]').each(function() {
        const link = ($(this).attr('href'));
        listLink.add(link);
    });

    // Converts Set ro Array
    const linkArray = Array.from(listLink);

    //Iterate over array to create links
    linkArray?.forEach(link => {
        let linkToInsert = $(`<a style="border: 2px solid red; padding: 4px; overflow:hidden; text-overflow: ellipsis;" href= ${link} > ${link}</a>`);
        wrapperDiv.append(linkToInsert);
    })

    // Inserts link on the begining of the page
    $('body').prepend(wrapperDiv);
    wrapperDiv.focus()

    // Display link on console, because why not?
    console.log("All magnet links found:" ,linkArray)

  // Are there any links?
    if (linkArray.length > 0){
      const totalLinkCount = linkArray.length
      const wasOk = window.prompt(`This is the first ${totalLinkCount > 1 ? `(from ${totalLinkCount})` : ""} magnet link found on this page. Just hit CTRL+C to copy the link or press OK to open in a new tab (your browser will probably prevent it...)`, linkArray[0])
      wasOk && window.open(linkArray[0])
    } else {
      // window.alert("No magnet links found...")
    }


});
/* jshint esversion: 8 */

// ==UserScript==
// @version      1.1.2
// @author       rjromo
// @match        https://rubenjromo.com/*
// @name         RJR visitor
// @description  Automatically visits a random number of pages in your desired blog
// @license      GPL-3.0
// @require      https://code.jquery.com/jquery-3.5.1.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @namespace https://greasyfork.org/users/797149
// @downloadURL https://update.greasyfork.org/scripts/429924/RJR%20visitor.user.js
// @updateURL https://update.greasyfork.org/scripts/429924/RJR%20visitor.meta.js
// ==/UserScript==


function clicker (){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{

      resolve( $('.postTitle').click())

    },120000)
  })
}
//setInterval($('.postTitle').click(), 60000);

async function surfer(){



  await clicker()
}

// Trigger the function

surfer();








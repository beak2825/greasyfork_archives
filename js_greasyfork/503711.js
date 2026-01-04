// ==UserScript==
// @name        docx4java.org - Add heading meta
// @namespace   Violentmonkey Scripts
// @match       http://webapp.docx4java.org/OnlineDemo/ecma376/*
// @grant       none
// @version     1.0
// @author      -
// @license MIT 
// @description 8/15/2024, 3:52:52 PM
// @downloadURL https://update.greasyfork.org/scripts/503711/docx4javaorg%20-%20Add%20heading%20meta.user.js
// @updateURL https://update.greasyfork.org/scripts/503711/docx4javaorg%20-%20Add%20heading%20meta.meta.js
// ==/UserScript==


function main(){
  for (let i = 0; i <=6; i++) {

    const headings = document.getElementsByClassName("Heading"+i)
    for (let j = 0; j < headings.length; j ++) {
      const heading = headings[j]
      heading.role = 'heading'
      heading.ariaLevel = '' + i
    }

  }

}


main()
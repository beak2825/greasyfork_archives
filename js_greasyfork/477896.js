// ==UserScript==
// @name         Link Vest
// @namespace    linkvest
// @version      0.1
// @description  Check all links that have a hyperlink as their text but a different "href" attribute.
// @author       p̴a̴r̴a̴c̴o̴m̴e̴t̴
// @match        *://*/*
// @icon         https://api.iconify.design/noto:safety-vest.svg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477896/Link%20Vest.user.js
// @updateURL https://update.greasyfork.org/scripts/477896/Link%20Vest.meta.js
// ==/UserScript==

'use strict';

( function() {

  const documentReady = () => document.readyState == 'complete' || document.readyState == 'loaded' || document.readyState == 'interactive'
  const isURL = ( string ) => {
    try {
      new URL( string )
      return true
    } catch ( error ) {
      return false
    }
  }

  if ( documentReady ) {
      setTimeout( () => {
        const links = document.querySelectorAll( 'a' )
        const dialog = document.createElement( 'dialog' )
        dialog.id = 'link-mismatch-detector'
        document.body.append( dialog )
        links.forEach( link => {
          if ( isURL( link.textContent ) ) {
              if ( link.textContent !== link.href ) {
                  const linkInnerText = document.createElement( 'code' )
                  linkInnerText.textContent = link.textContent
                  const linkHref = document.createElement( 'code' )
                  linkHref.textContent = link.href
                  dialog.innerHTML = `
                    <p style="margin-top: 0">This link may be trying to trick you! Its contents do not match its text. The text reads:</p>
                    <code>${link.textContent}</code>
                    <p>And the destination will take you to:</p>
                    <code>${link.href}</code>
                    <p>Do you wish to continue?</p>
                    <a href="${link.href}" target="_blank">Continue</a>
                    <button>No, abort</button>
                  `
                  const closeButton = document.querySelector( '#link-mismatch-detector button' )
                  closeButton.addEventListener( 'click', () => dialog.close() )
                  link.addEventListener( 'click', ( event ) => {
                      event.preventDefault()
                      dialog.showModal()
                  } )
              }
          }
      } )
    }, 2000 )
  }
} )()
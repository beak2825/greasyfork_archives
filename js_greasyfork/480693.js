// ==UserScript==
// @name         Quadruple/Quintuple/Sextuple Click Selections
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPL v3
// @author       jcunews
// @description  Add quadruple/quintuple/sextuple clicks for selecting page content beyond the current block. Also allow selection when double/trplie/etc. clicking an image.
// @match        https://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/480693/QuadrupleQuintupleSextuple%20Click%20Selections.user.js
// @updateURL https://update.greasyfork.org/scripts/480693/QuadrupleQuintupleSextuple%20Click%20Selections.meta.js
// ==/UserScript==

/*
Web browsers can select the whole block content when triple clicking on a text.
This script add quadruple/quintuple/sextuple click to select the whole parent, grandparent, or great grandparent block of the clicked block.
Web browsers however, won't select the block content when triple clicking on an image (IMG/SVG element).
This script allow the block content to be selected.
Web browsers also won't select an image when an image was double clicked.
This script also allow that, but the ALT key must be held down when double clicking the image, to avoid interfering site functionality if it use image double clicking.
Triple/Quadruple/quintuple/sextuple clicking on an image will always select the parent, grandparent, or great grandparent block of the clicked block.
*/

((t, c) => {
  //=== CONFIG BEGIN ===

  let dblClickDuration              = 333;  //duration in milliseconds between clicks to be considered as double/triple/etc. click.
  let selectImageOnAltDblClick      = true; //select image (IMG/SVG) element on double click. by default, web browsers don't select the image.
  let selectBlockOnTripleClickImage = true; //select block content of the triple clicked image. by default, web browsers don't select the block content.
  let quadrupleClick                = true; //enable quadruple click to select the parent block content of the current quadruple clicked block.
  let quintupleClick                = true; //enable quintuple click to select the grandparent block content of the current quintuple clicked block.
  let sextupleClick                 = true; //enable sextuple click to select the great grandparent block content of the current sextuple clicked block.

  //=== CONFIG END ===

  function preventHandlers(ev) {
    ev.stopImmediatePropagation();
    ev.stopPropagation();
    ev.preventDefault();
  }
  function getNonInlineParent(e) {
    while (e = e.parentNode) {
      if (getComputedStyle(e).display !== "inline") return e
    }
  }
  function selectContent(ev, e) {
    preventHandlers(ev);
    getSelection().selectAllChildren(e)
  }
  t = c = 0;
  addEventListener("mousedown", (ev, e, f) => {
    if (!ev.button && !ev.ctrlKey && !ev.shiftKey) {
      if ((ev.timeStamp - t) <= dblClickDuration) {
        c++;
        switch (c) {
          case 1: //alt double click image. select the image
            if (selectImageOnAltDblClick && ev.altKey && ev.target.matches('img,svg')) {
              preventHandlers(ev);
              getSelection().removeAllRanges();
              (e = new Range).selectNode(ev.target);
              getSelection().addRange(e)
            }
            break;
          case 2: //triple click image. select the block which contains the image
            if (selectBlockOnTripleClickImage && ev.target.matches('img,svg')) {
              if (e = getNonInlineParent(ev.target)) selectContent(ev, e)
            }
            break;
          case 3: //quadruple click. select parent block of current block
            if (quadrupleClick && (e = getNonInlineParent(ev.target)) && (e = getNonInlineParent(e))) selectContent(ev, e)
            break;
          case 4: //quintuple click. select grandparent block of current block
            if (quintupleClick && (e = getNonInlineParent(ev.target)) && (e = getNonInlineParent(e)) && (e = getNonInlineParent(e))) selectContent(ev, e);
            break;
          case 5: //sextuple click. select great grandparent block of current block
            if (sextupleClick && (e = getNonInlineParent(ev.target)) && (e = getNonInlineParent(e)) && (e = getNonInlineParent(e)) && (e = getNonInlineParent(e))) {
              selectContent(ev, e)
            }
        }
      } else c = 0;
      t = ev.timeStamp
    } else c = 0
  }, {capture: true, passive: false});
})()

// ==UserScript==
// @name        Share Links Without Tracking
// @namespace   UserScripts
// @match       https://*/*
// @match       http://*/*
// @version     0.1.3
// @author      CY Fung
// @license     MIT
// @description To remove tracking parameters in links of sharing
// @run-at      document-start
// @allFrames   true
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/475564/Share%20Links%20Without%20Tracking.user.js
// @updateURL https://update.greasyfork.org/scripts/475564/Share%20Links%20Without%20Tracking.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const win = typeof unsafeWindow === 'object' ? unsafeWindow : this;
  const { navigator, Clipboard, DataTransfer, document } = win;

  function fixByTextContent(textNode) {

    let t = textNode.textContent;

    let d = fixByText(t);
    if (d && d !== t) textNode.textContent = d;
  }

  function fixByText(t) {


    if (!t) return;
    if (!t.includes('http')) return;
    let withQ = t.includes('?');
    let m;
    if (withQ && (m = /^(https?\:\/\/(twitter|x)\.com\/[^\/]+\/status\/[\d]+)\?\w+/.exec(t))) {
      return m[1];
    }
    if (withQ) {
      m = /https?\:\/\/[^\s\?\&]+\w(\?[^\s]+)?/.exec(t);
      let u = m ? t.indexOf(m[0]) : -1;
      let v = m ? t.lastIndexOf(m[0]) : -1;
      if (m && v >= 0 && v === u) {

        let p = null;
        try {

          p = new URL(m[0]);
        } catch (e) {

        }

        if (p) {
          // console.log(p)
          let searchParams = p.searchParams;
          if (searchParams) {
            if (searchParams.has('utm_source') && searchParams.has('utm_medium')) {
              // tvb
              searchParams.delete('utm_source');
              searchParams.delete('utm_medium');
            }
            searchParams.delete('utm_campaign');
            searchParams.delete('utm_term');
            searchParams.delete('utm_content');
            searchParams.delete('gclid');
            searchParams.delete('dclid');
            searchParams.delete('fbclid');

            for (const entry of [...searchParams]) {
              const [k, v] = entry;
              if (v && typeof v === 'string' && v.includes('refer')) searchParams.delete(k);
            }

          }

          let pathname1 = p.pathname;
          let pathname2 = null;
          if (typeof pathname1 === 'string' && pathname1.includes('%')) {
            let w = null;
            try {
              w = decodeURI(pathname1);
            } catch (e) { }
            if (w && typeof w === 'string' && w.length < pathname1.length) {

              let w2 = w;
              let p2 = pathname1;
              w2 = w2.replace(/[\u3400-\uFFFF]+/g, (_) => {
                p2 = p2.replace(encodeURI(_));
              });
              if (w2 === p2) {
                pathname2 = w;
              }
            }
          }

          t = t.replace(m[0], p + "");
          if (pathname2) t = t.replace(pathname1, pathname2);
        }

      }

      return t;
    }
  }

  document.execCommand94 = document.execCommand;
  document.execCommand = function () {
    if (arguments[0] === 'copy') {

      try {

        const { anchorNode, focusNode } = window.getSelection();
        // console.log(anchorNode, focusNode)
        if (anchorNode && anchorNode === focusNode) {
          if (anchorNode.firstElementChild === null && anchorNode.firstChild === anchorNode.lastChild) {
            fixByTextContent(anchorNode.firstChild)
          } else {
            let tc1 = anchorNode.textContent;
            let em2 = anchorNode.querySelector('textarea');
            let tc2 = em2 ? em2.textContent : null;
            if (tc1 === tc2 && tc1 && em2.firstElementChild === null && em2.firstChild === em2.lastChild) {
              fixByTextContent(em2.firstChild)

            }
          }
        }
        // let content = range.extractContents(); // Extract content from document


        let selection = window.getSelection();

        if (selection.rangeCount > 0) {
          let ranges = [];

          for (let i = 0; i < selection.rangeCount; i++) {
            let range = selection.getRangeAt(i);
            ranges.push(range);
          }

          // Now the "ranges" array contains all the ranges of the selection.
          // console.log(ranges);

          if (ranges.length === 1 && ranges[0].collapsed === true && document.activeElement && (document.activeElement.nodeName === "TEXTAREA" || document.activeElement.nodeName === "INPUT")) {


            let textValue = document.activeElement.value;
            if (typeof textValue === 'string') {



              // let range = selection.getRangeAt(0); // Get the first range (assuming a single range for simplicity)

              // let content = range.extractContents(); // Extract content from document

              let strong = document.createElement(document.activeElement.nodeName); // Create a new <strong> element
              let u = fixByText(textValue);

              strong.value = u ? u : textValue

              let range = selection.getRangeAt(0); // Get the first range (assuming a single range for simplicity)

              // let content = range.extractContents(); // Extract content from document

              // let strong = document.createElement("strong"); // Create a new <strong> element
              // strong.appendChild(content); // Append the extracted content inside the <strong> element

              range.insertNode(strong); // Insert the <strong> element back into the document

              // If you want the new content to be selected
              selection.removeAllRanges(); // Remove existing selection
              range.selectNodeContents(strong); // Select the new content
              selection.addRange(range); // Add the modified range back to the selection

              strong.select();
              Promise.resolve().then(() => strong.remove())



            }


          }

        }

        // console.log(555, window.getSelection() + "")

      } catch (e) {
        console.warn(e);
      }

    }
    // console.log('execCommand', [...arguments])

    return this.execCommand94.apply(this, arguments)
  }


  Clipboard.prototype.writeText94 = Clipboard.prototype.writeText;
  Clipboard.prototype.writeText = function () {
    if (typeof arguments[0] === 'string') {
      let q = fixByText(arguments[0])
      if (q && q !== arguments[0]) arguments[0] = q;
    }

    // console.log('writeText', [...arguments])
    return this.writeText94.apply(this, arguments)

  }


  // console.log(12355, win)
})();
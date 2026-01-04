// ==UserScript==
// @name        Odds Conversion
// @namespace   SB
// @match       *://*oddsportal.com/*
// @description 5/14/2024, 3:12:45 PM
// @author       Sertalp B. Cay
// @grant        GM_addStyle
// @version      0.0.2
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/494971/Odds%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/494971/Odds%20Conversion.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function() {

    // 'use strict';

    GM_addStyle ( `
      .sb_top_control {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        z-index: 999;
            background: #0080686e;
      }

      button.sb_control_button {
        background: white;
        color: black;
            margin: 0.2em;
            padding: 0 0.3em;
      }
  ` );

    function get_percentage(match) {
      const num = parseInt(match.slice(1, match.length));
      let replacement = "";
      if (match[0] === "-") {
        replacement = ((num / (num + 100)) * 100).toFixed(1);
      } else {
        replacement = ((100 / (num + 100)) * 100).toFixed(1);
      }
      return replacement + "%";
    }

    function get_decimal(match) {
      const num = parseInt(match.slice(1, match.length));
      let replacement = "";
      if (match[0] === "-") {
        replacement = (100/num)+1;
      }
      else {
        replacement = (num/100)+1;
      }
      return _.round(replacement, 2)
    }

    function replace_it() {
      const allElements = document.querySelectorAll('*');
      const elementsWithPlus = Array.from(allElements).filter(element => {
        let txt = element.firstChild && element.firstChild.nodeType === Node.TEXT_NODE ? element.firstChild.textContent.trim() : '';
        return txt.startsWith('+') || txt.startsWith('-');
      });

      // Now `elementsWithPlus` contains all elements whose inner text starts with '+'
      elementsWithPlus.forEach((element) => {

        if (element.classList.contains('transformed')) { return }
        if (element.classList.contains('min-mt:!hidden')) { return }

        // create new container
        var div = document.createElement("div");
        let parentNode = element.parentNode;

        // move existing child
        element.classList.add('transformed')
        parentNode.appendChild(div);
        div.appendChild(element);

        //create new text
        var perc_div = document.createElement("div")
        perc_div.innerHTML = get_percentage(element.textContent)
        perc_div.style.fontSize = '70%'
        perc_div.style.lineHeight = '100%'
        div.appendChild(perc_div)

        //create new text
        var dec_div = document.createElement("div")
        dec_div.innerHTML = get_decimal(element.textContent)
        dec_div.style.fontSize = '70%'
        dec_div.style.lineHeight = '100%'
        div.appendChild(dec_div)
      })
    }

    function clear_it() {
      let transformed_elems = document.querySelectorAll(".transformed")
      Array.from(transformed_elems).forEach((elem) => {
        let div_parent = elem.parentNode
        let actual_parent = div_parent.parentNode
        actual_parent.insertBefore(elem, div_parent)
        elem.classList.remove("transformed")
        div_parent.remove()
      })

    }

    let control_box = document.createElement('div')
    control_box.classList.add("sb_top_control")

    let process_button = document.createElement('button')
    process_button.textContent = 'Process'
    process_button.addEventListener('click', replace_it)
  process_button.classList.add("sb_control_button")
    control_box.appendChild(process_button)

    let clear_button = document.createElement('button')
    clear_button.textContent = 'Clear'
    clear_button.addEventListener('click', clear_it)
    clear_button.classList.add("sb_control_button")
    control_box.appendChild(clear_button)

    document.body.insertBefore(control_box, document.body.childNodes[0])

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', replace_it, false);

})();


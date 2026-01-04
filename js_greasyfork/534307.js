// ==UserScript==
// @name        quotelinkify quotes of postIDs
// @namespace   Violentmonkey Scripts
// @match       https://boards.4chan.org/*
// @grant       none
// @version     1.2
// @author      justrunmyscripts
// @description run this script before 4chan-x to allow quotes of postIDs that "look like quotelinks" to become real quotelinks, set 4chan-x to load on document-end
// @run-at      document-end
// @license     MIT
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/534307/quotelinkify%20quotes%20of%20postIDs.user.js
// @updateURL https://update.greasyfork.org/scripts/534307/quotelinkify%20quotes%20of%20postIDs.meta.js
// ==/UserScript==

// const thread = document.getElementsByClassName('thread')[0];
// const disconnect = VM.observe(thread, () => { // failed attempt

  console.log('running quotelinkify...')

  const all_quotes = document.getElementsByClassName("quote");

  const quoteLinkify = (quote_element) => {
    const post_id = quote_element.innerText.match(/\d+/)[0];

    const new_element = document.createElement("a");
    new_element.href = `#p${post_id}`;
    new_element.innerHTML = `>${post_id}`;
    new_element.className = "quotelink";

    quote_element.replaceWith(new_element);
  };

  // reverse iteration since we are replacing elements as we go
  for (let i = all_quotes.length - 1; i > 0; i--) {
    let quote = all_quotes[i];
    if (quote.innerText.match(/>\d+$/)) {
      quoteLinkify(quote);
    }
  }

// }); // failed attempt

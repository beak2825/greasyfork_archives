// ==UserScript==
// @name     Change Google Colab Font
// @description Changes the editor, output and markdown render font in Google's Colab.
// @include  https://colab.research.google.com/drive/*
// @grant    GM_addStyle
// @grant    GM_getValue
// @grant    GM_setValue
// @run-at   document-start
// @license BSD-3
// @version 0.0.1.20220122033449
// @namespace https://greasyfork.org/users/867680
// @downloadURL https://update.greasyfork.org/scripts/438954/Change%20Google%20Colab%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/438954/Change%20Google%20Colab%20Font.meta.js
// ==/UserScript==

(async () => {

  const DEFAULT_FONT = JSON.stringify(
    "Fira Code"
  );

  const GetFont = async (key) => {
    var value = await GM_getValue(key+'_font', DEFAULT_FONT);
    
    (value === DEFAULT_FONT) && await GM_setValue(key+'_font', value);

    return value;
  };


  GM_addStyle(`
    @import url(https://cdn.jsdelivr.net/gh/tonsky/FiraCode@4/distr/fira_code.css);

    .view-line {
      font-family: ${await GetFont('editor')} !important;
    }
    .output_text {
      font-family: ${await GetFont('output')} !important;
    }
    .markdown {
      font-family: ${await GetFont('markdown')} !important;
    }
  `);

})();
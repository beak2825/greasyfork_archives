// ==UserScript==
// @name         DLsite Affiliate Formatter
// @namespace    http://mizle.net/
// @version      0.1.2
// @description  DLsiteのアフィリエイトリンクをどこでも作れる便利なやつ
// @author       eai04191
// @license      MIT
// @supportURL   https://github.com/eai04191/DLsiteAffiliateFormatter/issues
// @match        http://www.dlsite.com/home/*
// @match        http://www.dlsite.com/soft/*
// @match        http://www.dlsite.com/comic/*
// @match        http://www.dlsite.com/maniax/*
// @match        http://www.dlsite.com/pro/*
// @match        http://www.dlsite.com/books/*
// @match        http://www.dlsite.com/girls/*
// @match        http://www.dlsite.com/girls-pro/*
// @match        http://www.dlsite.com/gay/*
// @match        http://www.dlsite.com/eng/*
// @match        http://www.dlsite.com/ecchi-eng/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369655/DLsite%20Affiliate%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/369655/DLsite%20Affiliate%20Formatter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const affiliateID = "eai04191";

  function headerInjection() {
    let header = document.getElementsByClassName("eisysGroupHeaderAccount")[0];
    let title = document.title;
    let URL = location.href;

    let category = URL.match(/dlsite.com\/(home|soft|comic|maniax|pro|books|girls|girls-pro|gay|eng|ecchi-eng)\//)[1];

    let affiliateURL = "";
    if (/work\/=\/product_id\//.test(URL)) {
      // 作品ページ
      let workID = URL.match(/(..\d{6})/)[1];
      affiliateURL = `http://www.dlsite.com/${category}/dlaf/=/link/work/aid/${affiliateID}/id/${workID}.html`;
    } else {
      // 作品以外のページ
      affiliateURL = `http://www.dlsite.com/${category}/dlaf/=/aid/${affiliateID}/url/${encodeURIComponent(URL)}`;
    }

    let tweetURLBase = "https://twitter.com/intent/tweet?text=";
    let tweetText = `${title} ${affiliateURL}`;

    let injectionHTML = `
<li class="eisysGroupHeaderService-link type-dlsite" id="dlaf">
<a href="${tweetURLBase + encodeURIComponent(tweetText)}" target="_blank" id="dlaf-tweet">ツイート</a>
<a href="#" id="dlaf-copy-url">URLコピー</a>
<a href="#" id="dlaf-copy-md">MDコピー</a>
</li>`;
    header.innerHTML = injectionHTML + header.innerHTML;

    document.getElementById("dlaf-copy-url").onclick = function () {
      window.prompt("Copy to clipboard: Ctrl+C, Enter", affiliateURL);
    };

    document.getElementById("dlaf-copy-md").onclick = function () {
      let md = `[${title}](${affiliateURL})`;
      window.prompt("Copy to clipboard: Ctrl+C, Enter", md);
    };
  }

  headerInjection();
})();
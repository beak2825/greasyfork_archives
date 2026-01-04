// ==UserScript==
// @name         ChainEDGE  Alpha Stream QOL
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Add some quality-of-life changes to the ChainEDGE Alpha Stream
// @match        https://app.chainedge.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chainedge.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472407/ChainEDGE%20%20Alpha%20Stream%20QOL.user.js
// @updateURL https://update.greasyfork.org/scripts/472407/ChainEDGE%20%20Alpha%20Stream%20QOL.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const DEXSCREENER_PREFIX = "https://dexscreener.com";
  const DEXSCREENER_FAVICON = "https://dexscreener.com/favicon.png";
  const DEXSCREENER_CLASS = "qol-dexscreener";
  const TOKENSNIFFER_FAVICON = "https://tokensniffer.com/logo2-solid.png";
  const TOKENSNIFFER_PREFIX = "https://tokensniffer.com/token";
  const HONEYPOT_FAVICON = "https://honeypot.is/favicons/favicon-32x32.png";
  const HONEYPOT_PREFIX = "https://honeypot.is";
  const TWITTER_FAVICON = "https://abs.twimg.com/favicons/twitter.3.ico";
  const TWITTER_PREFXI = "https://twitter.com/search?q=";
  const COPY_CLASS = "qol-copy";
  const GENERIC_SPAN_CSS = "display: inline-block;";
  const IS_ALPHASTREAM = location.href.includes("/alpha_stream");
  const IS_INSIGHTS = location.href.includes("/insights");
  const IS_TOKENSEARCH =
    location.href.includes("/search/?search=") ||
    location.href.includes("/dashboard/");

  // ======== FUNCTION DECLARATIONS ========
  function qolDebugLog(message) {
    // console.log("====" + message);
  }

  function qolCopyToClipboard(inputString) {
    qolDebugLog(`== Copying ${inputString}`);

    navigator.clipboard
      .writeText(inputString)
      .then(() => {
        // Maybe show a success message or something
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  }

  function qolExtractAddressFromLink(inputString) {
    if (!inputString) {
      return "";
    }
    const searchParam = "?search=";
    const startIndex = inputString.indexOf(searchParam);
    if (startIndex === -1) {
      return "";
    }
    return inputString.slice(startIndex + searchParam.length);
  }

  // Return chain value for dexscreener URL
  function qolMapDexScreenerChain(ceChain) {
    var mapping = {
      eth: "ethereum",
      arb: "arbitrum",
      matic: "polygon",
      op: "optimism",
      avax: "avalanche",
      ftm: "fantom",
    };
    //TODO: need to map more chains here
    return mapping.hasOwnProperty(ceChain) ? mapping[ceChain] : ceChain;
  }

  // Return chain value for TokenSniffer URL
  function qolMapTokenSnifferChain(ceChain) {
    var mapping = {
      matic: "poly",
      op: "opt",
    };
    //TODO: need to map more chains here
    return mapping.hasOwnProperty(ceChain) ? mapping[ceChain] : ceChain;
  }

  function qolAddCopyHandler(tr) {
    $(tr)
      .find(`.${COPY_CLASS}`)
      .on("click", function (event) {
        event.preventDefault();
        qolCopyToClipboard($(this).data("address"));

        const copyLink = $(this);
        $(this).animate({ opacity: 0.4 }, 100, function () {
          // Reset the opacity to its original value (1) after the animation
          $(copyLink).css("opacity", 1);
        });
      });
  }

  function appendLinksToTD(td, chainValue) {
    var dsChain = qolMapDexScreenerChain(chainValue);
    var tsChain = qolMapTokenSnifferChain(chainValue);

    var tokenAddress = qolExtractAddressFromLink(
      $(td).find("a").eq(0).attr("href")
    );
    var tokenSymbol = "$" + $(td).find("a").eq(0).text();
    var dsLink = `${DEXSCREENER_PREFIX}/${dsChain}/${tokenAddress}`;
    var tsLink = `${TOKENSNIFFER_PREFIX}/${tsChain}/${tokenAddress}`;
    var twitterLink = `${TWITTER_PREFXI}${encodeURIComponent(tokenSymbol)}`;
    var isHoneyPotAvailable = chainValue == "bsc" || chainValue == "eth";

    var appendText = `
    <a href="/Copy-${tokenAddress}" class="${COPY_CLASS}"
    style="${GENERIC_SPAN_CSS} font-family: 'FontAwesome'; padding-left: 10px;"
    data-address="${tokenAddress}"
    title="Copy Address">
      <span style="font-family: 'FontAwesome';">&#xf0c5;</span>
    </a>
    <a target="_blank" href="${dsLink}"
    class="${DEXSCREENER_CLASS}" style="${GENERIC_SPAN_CSS}">
      <img src="${DEXSCREENER_FAVICON}" alt="Dexscreener Icon" width="14" height="14">
    </a>
    <a target="_blank" href="${tsLink}"
    style="${GENERIC_SPAN_CSS}">
      <img src="${TOKENSNIFFER_FAVICON}" alt="Dexscreener Icon" width="14" height="14">
    </a>
    `;
    if (isHoneyPotAvailable) {
      var hpLink = `${HONEYPOT_PREFIX}/ethereum?address=${tokenAddress}`;
      if (chainValue == "bsc") {
        hpLink = `${HONEYPOT_PREFIX}/?address=${tokenAddress}`;
      }
      appendText += `
      <a target="_blank" href="${hpLink}"
      style="${GENERIC_SPAN_CSS}">
        <img src="${HONEYPOT_FAVICON}" alt="Dexscreener Icon" width="14" height="14">
      </a>
      `;
    }
    appendText += `
    <a target="_blank" href="${twitterLink}"
    style="${GENERIC_SPAN_CSS}">
      <img src="${TWITTER_FAVICON}" alt="Dexscreener Icon" width="14" height="14">
    </a>
    `;

    var isWrapperDivExisted = $(td).find("div.text-ellipse").length > 0;
    if (isWrapperDivExisted) {
      $(td).find("div.text-ellipse").append(appendText);
    } else {
      $(td).append(appendText);
    }
  }

  function qolAddLinksAlphaStream() {
    qolDebugLog("=== Adding links");

    $("#datatable tbody tr")
      // .slice(0, 2)
      .each(function () {
        var findDexScreenerLink = $(this).find(`.${DEXSCREENER_CLASS}`);
        if (findDexScreenerLink.length > 0) {
          // In case the links are added multiple times, exit here
          return;
        }

        var chainValue = $(this).find("td:nth-child(7)").eq(0).text();
        var tdBuyToken = $(this).find("td:nth-child(2)").eq(0);
        var tdSellToken = $(this).find("td:nth-child(4)").eq(0);
        appendLinksToTD(tdBuyToken, chainValue);
        appendLinksToTD(tdSellToken, chainValue);

        // Handle "Copy to clipboard" action
        qolAddCopyHandler(this);
      });
  }

  function qolAddLinksInsights() {
    $("#swapInfows,#swapOutfow")
      .find("tbody tr")
      .each(function () {
        var findDexScreenerLink = $(this).find(`.${DEXSCREENER_CLASS}`);
        if (findDexScreenerLink.length > 0) {
          // In case the links are added multiple times, exit here
          return;
        }
        var chainValue = "eth"; // No chain data on Insights, assume everything is on Ethereum main net
        var tdToken = $(this).find("td:nth-child(1)").eq(0);
        appendLinksToTD(tdToken, chainValue);

        // Handle "Copy to clipboard" action
        qolAddCopyHandler(this);
      });
  }

  function qolAddLinksTokenSearch() {
    $("#alphatable")
      .find("tbody tr")
      .each(function () {
        var findDexScreenerLink = $(this).find(`.${DEXSCREENER_CLASS}`);
        if (findDexScreenerLink.length > 0) {
          // In case the links are added multiple times, exit here
          return;
        }

        var chainValue = $(this).find("td:nth-child(7)").eq(0).text();
        var tdBuyToken = $(this).find("td:nth-child(2)").eq(0);
        var tdSellToken = $(this).find("td:nth-child(4)").eq(0);
        appendLinksToTD(tdBuyToken, chainValue);
        appendLinksToTD(tdSellToken, chainValue);

        // Handle "Copy to clipboard" action
        qolAddCopyHandler(this);
      });
  }
  // ======== END FUNCTION DECLARATIONS ========

  qolDebugLog("===== QOL Script Loaded =====");

  setTimeout(function () {
    qolDebugLog("===== 1s later");

    if (IS_ALPHASTREAM) {
      var tableAlphaStream = $("#datatable").DataTable();
      tableAlphaStream.on("draw", function () {
        qolAddLinksAlphaStream();
      });
      qolAddLinksAlphaStream();
    }

    if (IS_INSIGHTS) {
      var tablesInsights = $("#swapInfows,#swapOutfow").DataTable();
      tablesInsights.on("draw", function () {
        qolAddLinksInsights();
      });
      qolAddLinksInsights();
    }

    if (IS_TOKENSEARCH) {
      var tableTokenSearch = $("#alphatable").DataTable();
      tableTokenSearch.on("draw", function () {
        qolAddLinksTokenSearch();
      });
      qolAddLinksTokenSearch();
    }
  }, 1000);
})();

// ==UserScript==
// @name        Amazon Camel Syringe
// @description previous price charts on amazon pages
// @match       https://www.amazon.it/*
// @match       https://www.amazon.de/*
// @match       https://www.amazon.co.uk/*
// @match       https://www.amazon.fr/*
// @match       https://www.amazon.es/*
// @match       https://www.amazon.com/*
// @grant       none
// @version     1.0
// @author      J-Bird
// @grant       GM_xmlhttpRequest
// @namespace https://greasyfork.org/en/users/729550-sugimoto
// @downloadURL https://update.greasyfork.org/scripts/441181/Amazon%20Camel%20Syringe.user.js
// @updateURL https://update.greasyfork.org/scripts/441181/Amazon%20Camel%20Syringe.meta.js
// ==/UserScript==

(async () => {
  let locale = "us";
  const URL = window.location.href;
  if (URL.includes(".it"))    locale = "it";
  if (URL.includes(".de"))    locale = "de";
  if (URL.includes(".fr"))    locale = "fr";
  if (URL.includes(".es"))    locale = "es";
  if (URL.includes(".co.uk")) locale = "uk";

  if (URL.includes("/dp/") || URL.includes("/gp/product/")) {
    let itemId = URL;
    if (URL.includes("?"))            itemId = itemId.split("?")[0];
    if (URL.includes("/dp/"))         itemId = itemId.split("/dp/")[1];
    if (URL.includes("/gp/product/")) itemId = itemId.split("/gp/product/")[1];
    if (itemId.includes('/'))         itemId = itemId.split("/")[0];

    const graphImageURL = `https://charts.camelcamelcamel.com/${locale}/${itemId}/amazon-new.png?force=1&zero=0&w=700&h=700&desired=false&legend=1&ilt=1&tp=all&fo=0&lang=en`;
    const camelPageURL = (locale === "us")
      ? `https://camelcamelcamel.com/product/${itemId}`
      : `https://${locale}.camelcamelcamel.com/product/${itemId}`;

    const camelGraph = document.createElement("img");
      camelGraph.src = graphImageURL;
      camelGraph.style.filter = "invert(100%)";
    const camelLink = document.createElement("a");
      camelLink.href = camelPageURL;
    const camelWidget = document.createElement("div");
      camelWidget.style.paddingLeft = "40px";

    camelLink.append(camelGraph);
    camelWidget.append(camelLink);

    const target = document.getElementById("leftCol");
    target.append(camelWidget);
  }
})();

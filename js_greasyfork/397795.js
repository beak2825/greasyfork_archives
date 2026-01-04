// ==UserScript==
// @name         lvz-plus-reader
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       erjb
// @match        https://www.lvz.de/*
// @match        https://lvz.de/*
// @match        https://*.lvz.de/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/397795/lvz-plus-reader.user.js
// @updateURL https://update.greasyfork.org/scripts/397795/lvz-plus-reader.meta.js
// ==/UserScript==

(function () {
  "use strict";
  let trigger = false;
  let scanCounter = 0;

  setTimeout(scan, 1000); // just wait a sec for page init

  function scan() {
    const fusionMetadata = document.querySelector(
      'script[id="fusion-metadata"]'
    );
    console.log("scan", Boolean(fusionMetadata));
    if (fusionMetadata && !trigger) {
      trigger = true;
      parseArticle();
    } else if (scanCounter < 10) {
      scanCounter++;
      setTimeout(scan(), 2000);
    }
  }

  function parseArticle() {
    const elements = window.Fusion?.globalContent?.elements;
      console.log(elements)
    const nav =
      "<nav>" + document.querySelector("article nav")?.innerHTML + "</nav>";
    const header =
      "<header>" +
      document.querySelector("article header")?.innerHTML +
      "</header>";
    let newHtml = nav + header;

    for (let element of elements) {
      if (element.type === "text") {
        newHtml += `
                <p style="margin-top: 5px;">
                ${element.text}
                </p>
            `;
      } else if (element.type === "header") {
        newHtml += `
                <blockquote style="margin-top: 5px;
                background-color: lightgray;
                border-radius: 4px;
                padding: 4px;">
                ${element.text}
                </blockquote>
            `;
      } else if (element.type === "rawHtml") {
        newHtml += `
            <p style="margin-top: 5px;">
            ${element.html}
            </p>
        `;
      } else if (element.type === "image") {
        const articleWidth = document.querySelector("article").offsetWidth;
        const ration = articleWidth/element.imageInfo.width;
        const imageHeight = element.imageInfo.height * ration;

        newHtml += `
            <img
            src="${element.imageInfo.src}"
            alt="${element.imageInfo.alt}"
            title="${element.imageInfo.alt}"
            height="${imageHeight}"
            width="${articleWidth}"
            style="border-radius: 4px;margin-top: 5px;">
        `;
      }
    }
    document.querySelector("article").innerHTML = newHtml;
    document
      .querySelector("article")
      .setAttribute(
        "style",
        'margin: 0px;padding-bottom: 8px;padding-top: 8px;font-family: "Source Serif Pro", Palatino, "Droid Serif", serif;font-size: 17px;font-weight: 400;letter-spacing: 0px;line-height: 26px;color: rgb(41, 56, 69);'
      );

    // cleanup headline
    const paywalled = document.querySelector(".paywalledContent");
    paywalled?.setAttribute("style", "height: auto;");
    if (paywalled?.lastElementChild) {
      paywalled.removeChild(paywalled.lastElementChild);
    }
  }
})();
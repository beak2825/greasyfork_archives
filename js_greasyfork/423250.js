let poplarVisId = "id";
let poplarVisKey = "key";
let poplarVisCss = "css";
let poplarVisButton = "AddToCart";

// ==UserScript==
// @name         Poplar AR Button Tag
// @namespace    http://github.com/we-are-poplar
// @version      0.22
// @description  Add AR Button to Websites
// @author       OllieTyler
// @run-at document-start
// @include *
// @downloadURL https://update.greasyfork.org/scripts/423250/Poplar%20AR%20Button%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/423250/Poplar%20AR%20Button%20Tag.meta.js
// ==/UserScript==

let productName = document.URL;

function iOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

if (productName.indexOf("product") !== -1) {
  console.log("Poplar Studio Product Visualisation Unit");
  productName = productName.substring(productName.lastIndexOf("/") + 1);
  let end = productName.lastIndexOf("#");
  if (end >= 0) {
    productName = productName.substring(0, end);
  }
  end = productName.lastIndexOf("?");
  if (end >= 0) {
    productName = productName.substring(0, end);
  }
  console.log("url:" + productName);

  const html = `
<br />
    <button
        onclick="click"
        class="${poplarVisCss}"
        id="ar-button"
    >
        <span>AR View</span>
    </button>
    <button type="submit" name="add" style="display: none;" id="addToCartProductVis"/>
  `;

  const containerHTML = document.getElementById(poplarVisButton);
  console.log(containerHTML);
  containerHTML.parentElement.parentElement.parentElement.innerHTML += html;

  let mainParams = new URL(document.URL).searchParams;
  if (mainParams.get("atc")) {
    const addToCart = document.getElementById("addToCartProductVis");
    addToCart.click();
  }

  const arButton = document.getElementById("ar-button");

  arButton.onclick = function (event) {
    event.preventDefault();

    if (!iOS()) {
      const productVis = document.createElement("div");
      productVis.className = "poplar-product-vis";
      productVis.id = "poplar-product-vis";

      productVis.style.position = "fixed";
      productVis.style.top = "0px";
      productVis.style.left = "0px";
      productVis.style.zIndex = "999";
      productVis.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
      productVis.style.width = "100vw";
      productVis.style.height = "100vh";
      productVis.style.display = "flex";
      productVis.style.alignItems = "center";
      productVis.style.justifyContent = "center";

      const productVisIframe = document.createElement("iframe");

      productVisIframe.onload = function () {
        productVisIframe.contentWindow.postMessage(
          [poplarVisId, poplarVisKey],
          "*"
        );
      };

      productVisIframe.className = "poplar-product-vis-iframe";
      productVisIframe.allow = "camera;microphone";
      productVisIframe.src = `https://0.0.0.0:8080?key=${productName}&store=true`;

      function SetWindowSize() {
        if (window.innerWidth > 800) {
          productVisIframe.style.width = "90%";
          productVisIframe.style.height = "90%";
          productVisIframe.style.border = "none";
          productVisIframe.style.borderRadius = "10px";
        } else {
          productVisIframe.style.width = "100%";
          productVisIframe.style.height = `${window.innerHeight}px`;
          productVisIframe.style.border = "none";
          productVisIframe.style.position = "fixed";
          productVisIframe.style.top = "0px";
          productVisIframe.style.left = "0px";
        }
      }
      SetWindowSize();
      window.addEventListener("resize", SetWindowSize);

      productVis.appendChild(productVisIframe);

      document.body.appendChild(productVis);

      function CloseModal(event) {
        if (event.data === "closeEmbed") {
          const productVis = document.getElementById("poplar-product-vis");
          productVis.remove();
        } else if (event.data === "addToCart") {
          const productVis = document.getElementById("poplar-product-vis");
          productVis.remove();

          const addToCart = document.getElementById("addToCartProductVis");
          addToCart.click();
        }
      }
      window.addEventListener("message", CloseModal);
    } else {
      window.open(
        `https://staging-embed.poplar.studio?redirect=${document.URL}&key=${productName}#${poplarVisId}.${poplarVisKey}`,
        "_self"
      );
    }
  };
}
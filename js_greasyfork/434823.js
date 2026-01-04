// ==UserScript==
// @name         Saks Script Tag
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Saks Testing
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434823/Saks%20Script%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/434823/Saks%20Script%20Tag.meta.js
// ==/UserScript==

const poplarVisId = "74893311-5ec0-4109-b864-b120e95b165b";
const poplarVisCss = "add-to-cart";
const productUrl = document.URL;

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

async function Main() {
  if(!document.getElementsByClassName(poplarVisCss)[0]) {
     return;
  }



  const productName = '';
  const button = document.getElementsByClassName(poplarVisCss)[0];
  const buttonContainer = button.parentElement;
  const arButtonContainer = document.createElement("p");
  const arButton = document.createElement("button");
  const text = document.createTextNode("View On Hand");
  arButton.appendChild(text);
  arButton.className = button.className;
  arButton.onclick = function (event) {
    event.preventDefault();
    LoadUnit(productName);
  };
  arButtonContainer.appendChild(arButton);

  buttonContainer.appendChild(arButtonContainer);
}
Main();

function LoadUnit(productName) {
  if (!iOS()) {
    const productVis = document.createElement("div");
    productVis.className = "poplar-product-vis";
    productVis.id = "poplar-product-vis";

    productVis.style.position = "fixed";
    productVis.style.top = "0px";
    productVis.style.left = "0px";
    productVis.style.zIndex = "9999999999";
    productVis.style.backgroundColor = "rgba(0, 0, 0, 0.25)";
    productVis.style.width = "100vw";
    productVis.style.height = "100vh";
    productVis.style.display = "flex";
    productVis.style.alignItems = "center";
    productVis.style.justifyContent = "center";

    const productVisIframe = document.createElement("iframe");

    productVisIframe.className = "poplar-product-vis-iframe";
    productVisIframe.allow = "camera;microphone";
    productVisIframe.src = `https://ringspiration.poplar.studio/${poplarVisId}?key=1`;

    function SetWindowSize() {
      if (window.innerWidth > 800) {
        productVisIframe.style.width = "90%";
        productVisIframe.style.height = "90%";
        productVisIframe.style.border = "none";
        productVisIframe.style.borderRadius = "10px";
        productVisIframe.style.position = "static";
        productVisIframe.style.top = "auto";
        productVisIframe.style.left = "auto";
      } else {
        productVisIframe.style.width = "100%";
        productVisIframe.style.height = `${window.innerHeight}px`;
        productVisIframe.style.border = "none";
        productVisIframe.style.borderRadius = "0px";
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
      if (event.data.id === "closeEmbed") {
        const productVis = document.getElementById("poplar-product-vis");
        if (productVis) {
          productVis.remove();
        }
      } else if (event.data.id === "addToCart") {
        const productVis = document.getElementById("poplar-product-vis");
        if (productVis) {
          productVis.remove();
        }

        const addToCart = document.getElementsByClassName(
          "add-to-cart-without-addons"
        )[0];
        addToCart.click();
      }
    }
    window.addEventListener("message", CloseModal);
  } else {
    window.open(
      `https://localhost:8080/2c20e4f5-6a3a-4340-b171-0c4f244f577f?key=10220`,
      "_self"
    );
  }
}

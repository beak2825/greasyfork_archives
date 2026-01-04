// ==UserScript==
// @name         Poplar Pitch Demo Script Tag
// @namespace    https://poplar.studio
// @version      0.2
// @description  demo script tag for pitches
// @author       Ollie Poplar
// @icon         https://www.google.com/s2/favicons?domain=poplar.studio
// @match      *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435390/Poplar%20Pitch%20Demo%20Script%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/435390/Poplar%20Pitch%20Demo%20Script%20Tag.meta.js
// ==/UserScript==

const poplarVisId = "e3e097f6-bf9a-48be-847b-17520b35dd03";
const poplarVisCss = "add_to_bag_button_ctaButton__3akSr button-module_button_large__2KRWv button-module_button__4s-13 button-module_button_primary_navy__11d8a button-module_button_primary__3aFsZ";
const key="tar-baby";
const buttonText = "View On Wall";
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
  const text = document.createTextNode(buttonText);
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
    productVisIframe.src = `https://embed.poplar.studio/${poplarVisId}?key=${key}`;

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
      `https://embed.poplar.studio/${poplarVisId}?key=${key}`,
      "_self"
    );
  }
}


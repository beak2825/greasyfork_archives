// ==UserScript==
// @name         dinolino1
// @version      0.1
// @description  Unlimited Instant Paying Faucets Script
// @match        https://shortlinksfaucet.xyz/?p=instantpayingfaucets
// @match        *://*/*
// @noframes
// @icon
// @grant        window.close
// @namespace https://greasyfork.org/users/1041189
// @downloadURL https://update.greasyfork.org/scripts/461783/dinolino1.user.js
// @updateURL https://update.greasyfork.org/scripts/461783/dinolino1.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //Instructions:
  //1. Install the script and set the number of tabs and faucetpay address below.
  //2. Visit https://shortlinksfaucet.xyz/?p=instantpayingfaucets
  //3. Allow popups for https://shortlinksfaucet.xyz
  //4. Use Ablinks, Recaptcha and Hcaptcha Solver

  // Set the number of tabs you want to open at once
  const NO_OF_TABS = 1;
  const DELAY = 120; //Time in seconds after which new tabs open

  //Enable or Disable recaptcha or Hcaptcha Faucets
  const ENABLE_RECAPTCHA_FAUCET = true;
  const ENABLE_HCAPTCHA_FAUCET = true;

  // Recommended to use new profile to avoid unnecessary tabs being opened
  //Set this value to true if you create a new profile in browser or are not using any other website.
  //If if enabled , it closes all other windows after 120 seconds
  const CLOSE_ALL_OTHER_WINDOWS = true;

  // Enter your Faucetpay details here

  var FAUCETPAY_EMAIL = "dinolino2014@gmail.com"; // Ex: var FAUCETPAY_EMAIL ="test@gmail.com";
  var bitcoin = "1DJkEGedpo8PEYKjmT68rYBaG18Hn3nZD6"; // Ex: var bitcoin="1HeD2a11n8d9zBTaznNWfVxtw1dKuW2vT5";
  var binance = "0xC71f3e088D44F8379e31B1CabbbD00D3d1F6a927";
  var bitcoincash = "qrwtyhs2areht5cnu6aqs4yl865d4ata6sexzxq50s";
  var dash = "XnhjLNABgy16GVsoP7AY5ADthgK7TZxVVY";
  var dogecoin = "DBxah19JkGMTvaD32RFH2araRxQ8DmX9io";
  var digibyte = "DN4qAR4hdLjJuezQpJ2L79mqNs4BGXXWma";
  var ethereum = "0x1D7a700C4d33115e401CFF953Bf7C70013b55458";
  var feyorra = "0x1D7a700C4d33115e401CFF953Bf7C70013b55458";
  var litecoin = "MJbGp4VCJtdLt3djSRvCSzPxp7jedtHWWj";
  var solana = "GcDmcakjJCFGGeSGbgpC3McqgainoVg3DM1mDgGTrrrP";
  var tron = "TPTPZmxc98cdTbinAAP7cqoNBX2KLgZ6Rs";
  var tether = "TPTPZmxc98cdTbinAAP7cqoNBX2KLgZ6Rs";
  var zcash = "t1XiNEzKgk81DTCEuMQ448Q5tso9TfSCqMc";

  //=================================DO NOT EDIT THE CODE BELOW UNLESS YOU KNOW WHAT YOU ARE DOING==================================================================//

  //Function to sleep or delay
  async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function buttonExists(element) {
    element = element.toLowerCase();

    if (Array.from(document.querySelectorAll('input')).find(el => el.value.toLowerCase().includes(element))) {
      return true;
    }

    if (Array.from(document.querySelectorAll('a')).find(el => el.textContent.toLowerCase().includes(element))) {
      return true;
    }

    if (Array.from(document.querySelectorAll('button')).find(el => el.textContent.toLowerCase().includes(element))) {
      return true;
    }

    return false;

  }

  function clickElement(element) {
    element = element.toLowerCase();

    if (Array.from(document.querySelectorAll('input')).find(el => el.value.toLowerCase().toLowerCase().includes(element))) {
      Array.from(document.querySelectorAll('input')).find(el => el.value.toLowerCase().toLowerCase().includes(element)).click();
    }

    if (Array.from(document.querySelectorAll('a')).find(el => el.textContent.toLowerCase().includes(element))) {
      Array.from(document.querySelectorAll('a')).find(el => el.textContent.toLowerCase().includes(element)).click();
    }

    if (Array.from(document.querySelectorAll('button')).find(el => el.textContent.toLowerCase().includes(element))) {
      Array.from(document.querySelectorAll('button')).find(el => el.textContent.toLowerCase().includes(element)).click();
    }

  }

  function clickElementEqual(element) {
    element = element.toLowerCase();

    if (Array.from(document.querySelectorAll('input')).find(el => el.value.toLowerCase() == element)) {
      Array.from(document.querySelectorAll('input')).find(el => el.value.toLowerCase() == element).click();
    }

    if (Array.from(document.querySelectorAll('a')).find(el => el.textContent.toLowerCase() == element)) {
      Array.from(document.querySelectorAll('a')).find(el => el.textContent.toLowerCase().toLowerCase() == element).click();
    }

    if (Array.from(document.querySelectorAll('button')).find(el => el.textContent.toLowerCase().toLowerCase() == element)) {
      Array.from(document.querySelectorAll('button')).find(el => el.textContent.toLowerCase().toLowerCase() == element).click();
    }

  }

  function setElementValue(element, value) {
    element = element.toLowerCase();
    if (Array.from(document.querySelectorAll('input')).find(el => el.name.toLowerCase().includes(element))) {
      Array.from(document.querySelectorAll('input')).find(el => el.name.toLowerCase().includes(element)).value = value;
    }

    if (Array.from(document.querySelectorAll('input')).find(el => el.type.toLowerCase().includes(element))) {
      Array.from(document.querySelectorAll('input')).find(el => el.type.toLowerCase().includes(element)).value = value;
    }

    if (Array.from(document.querySelectorAll('input')).find(el => el.placeholder.toLowerCase().includes(element))) {
      Array.from(document.querySelectorAll('input')).find(el => el.placeholder.toLowerCase().includes(element)).value = value;
    }
  }

  var ablinksSolved = false;

  function ablinksCaptcha() {

    var interval = setInterval(function () {

      if (document.querySelector("#switch") && document.querySelector("#switch").innerText.toLowerCase().includes("hcaptcha")) {
        document.querySelector("#switch").click();
      }
      else if (document.querySelector("#switch") && document.querySelector("#switch").innerText.toLowerCase().includes("recaptcha")) {
        document.querySelector("#switch").click();
      }
      var count = 0;

      var abModels = [".modal-content [href='/']", ".modal-body [href='/']", ".antibotlinks [href='/']"];
      var abModelsImg = [".modal-content [href='/'] img", ".modal-body [href='/'] img", ".antibotlinks [href='/'] img"];
      for (let j = 0; j < abModelsImg.length; j++) {
        if (document.querySelector(abModelsImg[j]) &&
          document.querySelector(abModelsImg[j]).value == "####") {
          window.close();
          break;
        }
      }

      if (document.querySelectorAll("#freenmads > div > div.modal-bodyfree > center > table > tbody > tr td").length == 6) {
        let k = 0
        for (let i = 0; i < document.querySelectorAll("#freenmads > div > div.modal-bodyfree > center > table > tbody > tr td div").length; i++) {
          if (document.querySelectorAll("#freenmads > div > div.modal-bodyfree > center > table > tbody > tr td div")[i].style.display == 'none') {
            k++;
          }
        }

        if (k == 4) {
          ablinksSolved = true;
          clearInterval(interval);
        }

      }

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < abModels.length; j++) {
          if (document.querySelectorAll(abModelsImg[j]).length == 4 &&
            document.querySelectorAll(abModels[j])[i] &&
            document.querySelectorAll(abModels[j])[i].style &&
            document.querySelectorAll(abModels[j])[i].style.display == 'none') {
            count++;
            break;
          }
        }
      }
      if (count == 4) {
        ablinksSolved = true;
        clearInterval(interval);
      }
    }, 5000);

  }

  function isAblinksPresent() {

    if (document.querySelectorAll(".modal-content [href='/'] img").length == 4 && document.querySelectorAll(".modal-content img").length >= 5) {
      return true;
    }
    else if (document.querySelector(".modal-header img") && document.querySelectorAll(".modal-body [href='/'] img").length == 4) {
      return true;
    }
    else if (document.querySelector(".alert.alert-info img") && document.querySelectorAll(".antibotlinks [href='/'] img").length == 4) {
      return true;
    }
    else if (document.querySelector(".alert.alert-warning img") && document.querySelectorAll(".antibotlinks [href='/'] img").length == 3) {
      return true;
    }
    else if (document.querySelector(".alert.alert-warning img") && document.querySelectorAll(".antibotlinks img").length == 3) {
      return true;
    }
    else if (document.querySelector(".alert.alert-warning img") && document.querySelectorAll(".antibotlinks [href='#'] img").length == 3) {
      return true;
    }
    else if (document.querySelector(".sm\\:flex.items-center img") && document.querySelectorAll("[href='javascript:void(0)'] img").length == 3) {
      return true;
    }
    else if (document.querySelectorAll(".modal-content [href='/'] img").length == 3 && document.querySelectorAll(".modal-content img").length >= 4) {
      return true;
    }
    else if (document.querySelector(".modal-header img") && document.querySelectorAll(".modal-body [href='/'] img").length == 3) {
      return true;
    }
    else if (document.querySelector(".alert.alert-info img") && document.querySelectorAll(".antibotlinks [href='/'] img").length == 3) {
      return true;
    }
    else if (document.querySelectorAll("#freenmads > div > div.modal-bodyfree > center > table > tbody > tr td").length == 6) {
      return true;
    }
    else if (document.querySelectorAll(".invert-0").length >= 4) {
      return true;
    }
    else {
      return false;
    }

    return false;

  }

  function shortlinkStepClicker() {

    var interval = setInterval(function () {
      if (Array.from(document.querySelectorAll('button')).find(el => el.textContent.toLowerCase().includes("step 0"))) {
        if (unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0) {
          Array.from(document.querySelectorAll('button')).find(el => el.textContent.toLowerCase().includes("step 0")).click();
          clearInterval(interval);
        }
      }
      else if (Array.from(document.querySelectorAll('button')).find(el => el.textContent.toLowerCase().includes("step"))) {
        Array.from(document.querySelectorAll('button')).find(el => el.textContent.toLowerCase().includes("step")).click();
        clearInterval(interval);
      }
      else {
        clearInterval(interval);
      }

    }, 15000);
  }

  function setInputAddress(fpCoin) {
    //Set the input address
    setElementValue("address", fpCoin);
    setElementValue("makejar", fpCoin);
    setElementValue("Faucetpay Username", fpCoin);
    setElementValue("i.e.", fpCoin);
  }

  function clickElementAfterCaptcha() {
    if (buttonExists("Claim Now")) {
      clickElement("Claim Now");
      return true;
    }
    if (buttonExists("Claim Your Coin")) {
      clickElement("Claim Your Coin");
      return true;
    }
    if (buttonExists("Unlock")) {
      clickElement("Unlock");
      return true;
    }
    if (buttonExists("Get reward")) {
      clickElement("Get reward");
      return true;
    }

    if (buttonExists("Verify Captcha")) {
      clickElement("Verify Captcha");
      console.log("Button clicked")
      return true;
    }

  }

  if (window.location.href.includes("https://shortlinksfaucet.xyz/?p=instantpayingfaucets")) {

    var j = 1;

    setTimeout(function () {
      let count = 0;
      for (let i = j; i < document.querySelectorAll("#start > table > tbody > tr").length && count < NO_OF_TABS; i++) {

        let checkboxStatus = document.querySelectorAll("#start > table > tbody > tr")[i].querySelector("input[type=checkbox]").checked;
        let captchaType = document.querySelectorAll("#start > table > tbody > tr")[i].querySelectorAll("td")[3].innerText;

        if (ENABLE_RECAPTCHA_FAUCET && checkboxStatus && captchaType == "Recaptcha") {
          window.open(document.querySelectorAll("#start > table > tbody > tr")[i].querySelector("td a").href, "InstantFaucet" + count);
          count++;
        }

        if (ENABLE_HCAPTCHA_FAUCET && checkboxStatus && captchaType == "Hcaptcha") {
          window.open(document.querySelectorAll("#start > table > tbody > tr")[i].querySelector("td a").href, "InstantFaucet" + count);
          count++;
        }

        j++;

      }
    }, 5000);

    setInterval(function () {

      let count = 0;
      for (let i = j; i < document.querySelectorAll("#start > table > tbody > tr").length && count < NO_OF_TABS; i++) {

        let checkboxStatus = document.querySelectorAll("#start > table > tbody > tr")[i].querySelector("input[type=checkbox]").checked;
        let captchaType = document.querySelectorAll("#start > table > tbody > tr")[i].querySelectorAll("td")[3].innerText;

        if (ENABLE_RECAPTCHA_FAUCET && checkboxStatus && captchaType == "Recaptcha") {
          window.open(document.querySelectorAll("#start > table > tbody > tr")[i].querySelector("td a").href, "InstantFaucet" + count);
          count++;
        }

        if (ENABLE_HCAPTCHA_FAUCET && checkboxStatus && captchaType == "Hcaptcha") {
          window.open(document.querySelectorAll("#start > table > tbody > tr")[i].querySelector("td a").href, "InstantFaucet" + count);
          count++;
        }

        j++;

      }

      if (j == document.querySelectorAll("#start > table > tbody > tr").length) {
        j = 1;
      }

    }, DELAY * 1000)

  }
  else {

    setTimeout(function () {

      shortlinkStepClicker();

      if (CLOSE_ALL_OTHER_WINDOWS) {
        if (document.querySelector(".alert.alert-success") && Array.from(document.querySelectorAll(".alert.alert-success")).find(el => el.textContent.toLowerCase().includes("was sent"))) {
          window.close();
        }
        setTimeout(function () {
          window.close();
        }, 120000)
      }

      if (window.name.includes("Shortlink:") && !window.name.includes(window.location.host)) {
        setTimeout(function () {
          window.close();
        }, 90000)
        return;

      }

      if ((!window.name.includes("InstantFaucet") && !window.name.includes("Shortlink:")) && !(document.querySelector('input[placeholder]') && document.querySelector('input[placeholder]').placeholder) && !buttonExists("Go to Sponsor's Link")) {
        return;
      }

      if (document.querySelector(".alert.alert-danger") && document.querySelector(".alert.alert-danger").innerText.length > 2) {
        window.close();
      }

      if (document.querySelector(".alert.alert-success") && Array.from(document.querySelectorAll(".alert.alert-success")).find(el => el.textContent.toLowerCase().includes("was sent"))) {
        window.close();
      }

      var placeholder = "";
      if (document.querySelector('input[placeholder]') && document.querySelector('input[placeholder]').placeholder) {
        placeholder = document.querySelector('input[placeholder]').placeholder;
      }

      placeholder = placeholder.toLowerCase();
      let url = window.location.href;
      let lowerCaseUrl = url.toLowerCase();

      //Priority based logic to identify coin
      console.log(placeholder);
      if (placeholder.includes("email")) {
        console.log("Email Detected");
        setInputAddress(FAUCETPAY_EMAIL);
      }
      else if (placeholder.includes("bitcoincash") || placeholder.includes("bch") || placeholder.includes("bitcoin-cash")) {
        setInputAddress(bitcoincash);
      }
      else if (placeholder.includes("doge") || placeholder.includes("doge")) {
        setInputAddress(dogecoin);
      }
      else if (placeholder.includes("bitcoin") || placeholder.includes("btc")) {
        setInputAddress(bitcoin);
      }
      else if (placeholder.includes("binance") || placeholder.includes("bnb")) {
        setInputAddress(binance);
      }
      else if (placeholder.includes("litecoin") || placeholder.includes("ltc")) {
        setInputAddress(litecoin);
      }
      else if (placeholder.includes("fey")) {
        setInputAddress(feyorra);
      }
      else if (placeholder.includes("tron") || placeholder.includes("trx")) {
        setInputAddress(tron);
      }
      else if (placeholder.includes("digibyte") || placeholder.includes("dgb")) {
        setInputAddress(digibyte);
      }
      else if (placeholder.includes("solana") || placeholder.includes("sol")) {
        setInputAddress(solana);
      }
      else if (placeholder.includes("tether") || placeholder.includes("usdt")) {
        setInputAddress(tether);
      }
      else if (placeholder.includes("dash") || placeholder.includes("dash")) {
        setInputAddress(dash);
      }
      else if (placeholder.includes("zcash") || placeholder.includes("ZEC")) {
        setInputAddress(zcash);
      }
      else if (placeholder.includes("ethereum") || placeholder.includes("eth")) {
        setInputAddress(ethereum);
      }
      else if (url.includes("bitcoincash") || url.includes("bch") || url.includes("bitcoin-cash")) {
        setInputAddress(bitcoincash);
      }
      else if (url.includes("doge") || url.includes("doge")) {
        setInputAddress(dogecoin);
      }
      else if (url.includes("bitcoin") || url.includes("btc")) {
        setInputAddress(bitcoin);
      }
      else if (url.includes("binance") || url.includes("bnb")) {
        setInputAddress(binance);
      }
      else if (url.includes("litecoin") || url.includes("ltc")) {
        setInputAddress(litecoin);
      }
      else if (url.includes("fey")) {
        setInputAddress(feyorra);
      }
      else if (url.includes("tron") || url.includes("trx")) {
        setInputAddress(tron);
      }
      else if (url.includes("digibyte") || url.includes("dgb")) {
        setInputAddress(digibyte);
      }
      else if (url.includes("solana") || url.includes("sol")) {
        setInputAddress(solana);
      }
      else if (url.includes("tether") || url.includes("usdt")) {
        setInputAddress(tether);
      }
      else if (url.includes("dash") || url.includes("dash")) {
        setInputAddress(dash);
      }
      else if (url.includes("zcash") || url.includes("ZEC")) {
        setInputAddress(zcash);
      }
      else if (url.includes("ethereum") || url.includes("eth")) {
        setInputAddress(ethereum);
      }
      else {
        //Set to default BTC
        setElementValue("address", bitcoin);
        setElementValue("makejar", bitcoin);
        setElementValue("Faucetpay Username", bitcoin);
        setElementValue("i.e.", bitcoin);
        setElementValue("email", FAUCETPAY_EMAIL);
      }

      //If shortlink is present click on the button
      if (buttonExists("Click here to prove you are a human")) {
        window.name = "Shortlink:" + window.location.host;
        clickElement("Click here to prove you are a human");
      }

      //If shortlink is present click on the button
      if (buttonExists("Click here to get 800% bonus on your next claim.")) {
        window.name = "Shortlink:" + window.location.host;
        clickElement("Click here to get 800% bonus on your next claim.");
      }

      //Sponsor link After solving captcha
      if (buttonExists("Go to Sponsor's Link")) {
        window.name = "Shortlink:" + window.location.host;
        clickElement("Go to Sponsor's Link");
      }

      //Click on login button
      clickElement("login");
      clickElement("continue");
      clickElement("Start");
      clickElementEqual("Claim");

      // Adding Exceptions based on websites
      if (window.location.href.includes("bits.io")) {
        clickElement("Claim Reward");
        clickElement("Get Reward");
      }

      setTimeout(function () {
        var ablinksVisible = isAblinksPresent();

        if (ablinksVisible) {
          ablinksCaptcha();
        }

        //Click on claim button after captcha
        var interval = setInterval(function () {

          //Check if Ablinks are present and solved
          if (ablinksVisible && !ablinksSolved) {
            return;
          }

          if (unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0) {

            if (clickElementAfterCaptcha()) {
              clearInterval(interval);
              return;
            }

          }

          for (var hc = 0; hc < document.querySelectorAll("iframe").length; hc++) {
            if (document.querySelectorAll("iframe")[hc] &&
              document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response") &&
              document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response").length > 0) {

              if (clickElementAfterCaptcha()) {
                clearInterval(interval);
                return;
              }

              break;
            }
          }
        }, 5000);
      }, 10000);
    }, 5000);

  }

})();

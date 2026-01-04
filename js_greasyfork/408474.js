// ==UserScript==
// @name         Taobao Copy OrderInfo for Shipping
// @namespace    https://flyfy1.github.io
// @version      0.1
// @description  Simple script to take Taobao Order information from Taobao's order page
// @author       Yangyu Song
// @match        https://trade.tmall.com/detail/orderDetail.htm?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408474/Taobao%20Copy%20OrderInfo%20for%20Shipping.user.js
// @updateURL https://update.greasyfork.org/scripts/408474/Taobao%20Copy%20OrderInfo%20for%20Shipping.meta.js
// ==/UserScript==

(function() {
  console.log("matched tampermonkey script")
  window.addEventListener("load", () => {
    addButton("Hello Customer");
  });

  function writeToClipBoard(text){
    navigator.permissions.query({name:'clipboard-write'}).then(function(result) {
        console.log("result state: ", result.state);

        if (result.state == 'granted') {
            console.log("would proceed with normal biz logic here");
        } else if (result.state == 'prompt') {

        } else if (result.state == 'denied') {
            console.log("would proceed with error handling biz logic here");
        }

        result.onchange = function() {
            console.log("permission changed, args: ", arguments)
        }
    })
  }

  var textArea = document.createElement("textarea")

  function addButton(text, onclick, cssObj) {
    cssObj = cssObj || {
      position: "fixed",
      top: "15%",
      right: "4%",
      "z-index": 3,
      fontWeight: "600",
      fontSize: "14px",
      backgroundColor: "#00cccc",
      color: "white",
      border: "none",
      padding: "10px 20px"
    };

    let buttonArea = document.createElement("div"),
    btnStyle = buttonArea.style;

    let button = document.createElement("button");
    button.innerHTML = text
    // Settin function for button when it is clicked.
    button.onclick = selectReadFn;

    buttonArea.appendChild(button);
    buttonArea.appendChild(textArea);

    document.body.appendChild(buttonArea);

    Object.keys(cssObj).forEach(key => (btnStyle[key] = cssObj[key]));
    return button;
  }

  function selectReadFn(event) {
      var deliveryInfo = document.querySelector("#appOrders > div > table > tbody > tr > td > ul > li > div")
      var deliveryCompany = deliveryInfo.querySelector("span:nth-child(2)").innerText
      var deliveryID = deliveryInfo.querySelector("span:nth-child(4)").innerText

      var itemName = document.querySelector("#appOrders > div > table > tbody > tr > td > ul > li > table > tbody > tr > td.header-item.order-item-info > div > div.item-meta > a").innerText
      var priceAreaChildren = document.querySelector('#appAmount > div > table > tbody > tr > td.total-count > .total-count-wrapper').children
      var totalPrice = priceAreaChildren[priceAreaChildren.length - 1].innerText.split("￥")[1]

      var str = `${itemName}\t${deliveryCompany}\t${deliveryID}\t\t\t\t${totalPrice}`
      textArea.value = str
      textArea.select()
      document.execCommand("copy")
      // compute order info in the page
      // Just to show button is pressed
      this.innerHTML = "copied";
  }
})();

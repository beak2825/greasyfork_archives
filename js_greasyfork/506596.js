// ==UserScript==
// @name        Idle Pixel Networth Calculator
// @namespace   finally.idle-pixel.networth
// @match       https://idle-pixel.com/login/play/*
// @grant       none
// @version     1.1
// @author      finally
// @description Calculates your Idle Pixel Networth based on Market Min/Max Prices
// @downloadURL https://update.greasyfork.org/scripts/506596/Idle%20Pixel%20Networth%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/506596/Idle%20Pixel%20Networth%20Calculator.meta.js
// ==/UserScript==

(() => {
  return new Promise((resolve) => {
    function check() {
      if (window.websocket &&
          window.websocket.connected_socket &&
          websocket.connected_socket.readyState == 1 &&
          document.querySelector(".dropdown-menu")) {
        resolve();
        return;
      }
      setTimeout(check, 200);
    }
    check();
  });
})().then(() => {
  let items = {};

  function handleMessage(e) {
    if (!e.data.startsWith("MARKET_BROWSE_ITEM_TRADABLES_MODAL")) return;

    window.websocket.connected_socket.removeEventListener("message", handleMessage);
    document.querySelector("#modal-market-select-item .btn-close").click();

    let [,itemdata] = e.data.split("=");

    itemdata = itemdata.split("~");
    for (let i = 0; i < itemdata.length; i += 4) {
      items[itemdata[i]] = {
        min: ~~itemdata[i+1],
        max: ~~itemdata[i+2],
        group: itemdata[i+3],
      };
    }
  }
  window.websocket.connected_socket.addEventListener("message", handleMessage);
  window.websocket.send("MARKET_BROWSE_BUTTON_CLICKED");

  function calc_networth() {
    let keys = Object.keys(items);
    let networth = [~~window["var_coins"], ~~window["var_coins"]];
    let notfound = [];
    for (let i = 0; i < keys.length; i++) {
      let item = items[keys[i]];
      let amount = window[`var_${keys[i]}`];
      if (!amount) {
        notfound.push(`var_${keys[i]}`);
        continue;
      }

      networth[0] += item.min * amount;
      networth[1] += item.max * amount;
    }

    if (notfound.length) {
      console.log("vars not found", notfound);
    }

    return networth;
  }

  let nwMenuItem = document.createElement("li");
  nwMenuItem.innerHTML = `<a class="dropdown-item" href="#"><img src="https://cdn.idle-pixel.com/images/coins.png" class="img-20"> Networth Calc</a>`;
  document.querySelector(".dropdown-menu").appendChild(nwMenuItem);

  nwMenuItem.addEventListener("click", () => {
    let networth = calc_networth();
    Modals.open_image_modal("Networth", "images/coins.png",`If you sold all your items:<br/><br/>Min: ${networth[0].toLocaleString("en-US")}<br/>Max:  ${networth[1].toLocaleString("en-US")}<br/>Avg:  ${((networth[0]+networth[1])/2).toLocaleString("en-US")}`, null, "Close", null);

    console.log();
  });
});

// ==UserScript==
// @name         Sticky snowball autobuyer
// @namespace    http://tampermonkey.net/
// @version      0.6.0
// @description  Buys a sticky snowball every 30-36mins
// @author       Tyler Durden
// @grant        GM_xmlhttpRequest
// @match        http://www.neopets.com/faerieland/springs.phtml
// @downloadURL https://update.greasyfork.org/scripts/402607/Sticky%20snowball%20autobuyer.user.js
// @updateURL https://update.greasyfork.org/scripts/402607/Sticky%20snowball%20autobuyer.meta.js
// ==/UserScript==
window.addEventListener(
  "load",
  function () {
    const depositStickSnowballs = () => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "http://www.neopets.com/quickstock.phtml",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "http://www.neopets.com",
          Referer: "http://www.neopets.com/inventory.phtml",
          "Upgrade-Insecure-Requests": 1,
        },
        onload: function (response) {
          var el = document.createElement("html");
          el.innerHTML = response.responseText;
          let allItems = el
            .getElementsByTagName("FORM")[1]
            .querySelector("table")
            .querySelector("tbody")
            .querySelectorAll("tr");
          el.remove();
          let tempData = {
            buyitem: "0",
          };
          let count = 1;
          for (const item of allItems) {
            try {
              if (item.querySelector("td")) {
                if (!isNaN(item.querySelector("input").value)) {
                  let temp = "id_arr[" + count + "]";
                  tempData[temp] = item.querySelector("input").value;

                  if (
                    item
                      .querySelector("td")
                      .innerHTML.includes("Sticky Snowball")
                  ) {
                    let temp1 = "radio_arr[" + count + "]";
                    tempData[temp1] = "deposit";
                  }
                  count++;
                }
              }
            } catch (err) {}
          }
          const searchParams = Object.keys(tempData)
            .map((key) => {
              return (
                encodeURIComponent(key) +
                "=" +
                encodeURIComponent(tempData[key])
              );
            })
            .join("&");
          const depositItems = async () => {
            await new Promise((r) => setTimeout(r, 5000));

            GM_xmlhttpRequest({
              method: "POST",
              url: "http://www.neopets.com/process_quickstock.phtml",
              data: searchParams,
              headers: {
                "Content-Type":
                  "application/x-www-form-urlencoded;charset=UTF-8",
                Origin: "http://www.neopets.com",
                Referer: "http://www.neopets.com/quickstock.phtml",
              },

              onload: function (response) {
                console.log("Deposited all sticky snowballs");
              },
            });
          };
          depositItems();
        },
      });
    };

    const refreshLow = 2;
    const refreshHigh = 6;
    const stickySnowballUrl =
      "http://www.neopets.com/faerieland/process_springs.phtml?obj_info_id=8429";
    const stickySnowballID = 8429;
    const secondsToMilliseconds = 1000;
    const minutesToSeconds = 60;
    const everyNMinutes = 30;
    const getRandomizer = () => {
      return (
        (Math.floor(Math.random() * (1 + refreshHigh - refreshLow)) +
          refreshLow) *
        secondsToMilliseconds *
        minutesToSeconds
      );
    };
    const buySnowball = () => {
      try {
        GM_xmlhttpRequest({
          method: "POST",
          url: stickySnowballUrl,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "http://www.neopets.com",
            Referer: "http://www.neopets.com/faerieland/springs.phtml",
            "Upgrade-Insecure-Requests": 1,
          },
          data: {
            obj_info_id: stickySnowballID,
          },
          onload: function (response) {
            console.log("Bought a sticky snowball");
          },
        });
        depositStickSnowballs();
        console.log("Success recursion");
        setTimeout(
          buySnowball,
          getRandomizer() +
            everyNMinutes * minutesToSeconds * secondsToMilliseconds
        );
      } catch (err) {
        console.log("Failed retry");
        setTimeout(buySnowball, getRandomizer());
      }
    };
    buySnowball();
  },
  false
);

// ==UserScript==
// @name         QA Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  A tool to help in the Live QA process, highlighting important info for some of the QA items.
// @author       Cristian Macedo :)
// @match        *://*.ibm.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_xmlHttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM.xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/391220/QA%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/391220/QA%20Helper.meta.js
// ==/UserScript==

(function() {
  "use strict";

  var isCms = null;
  var isDrupal = null;

  const colors = {
    "red-100": "2c080a",
    "red-90": "570408",
    "red-80": "750e13",
    "red-70": "a51920",
    "red-60": "da1e28",
    "red-50": "fb4b53",
    "red-40": "ff767c",
    "red-30": "ffa4a9",
    "red-20": "fcd0d3",
    "red-10": "fff0f1",
    "magenta-100": "2a0a16",
    "magenta-90": "57002b",
    "magenta-80": "760a3a",
    "magenta-70": "a11950",
    "magenta-60": "d12765",
    "magenta-50": "ee538b",
    "magenta-40": "fa75a6",
    "magenta-30": "ffa0c2",
    "magenta-20": "ffcfe1",
    "magenta-10": "fff0f6",
    "purple-100": "1e1033",
    "purple-90": "38146b",
    "purple-80": "4f2196",
    "purple-70": "6e32c9",
    "purple-60": "8a3ffc",
    "purple-50": "a66efa",
    "purple-40": "bb8eff",
    "purple-30": "d0b0ff",
    "purple-20": "e6d6ff",
    "purple-10": "f7f1ff",
    "blue-100": "051243",
    "blue-90": "061f80",
    "blue-80": "0530ad",
    "blue-70": "054ada",
    "blue-60": "0062ff",
    "blue-50": "408bfc",
    "blue-40": "6ea6ff",
    "blue-30": "97c1ff",
    "blue-20": "c9deff",
    "blue-10": "edf4ff",
    "cyan-100": "07192b",
    "cyan-90": "002b50",
    "cyan-80": "003d73",
    "cyan-70": "0058a1",
    "cyan-60": "0072c3",
    "cyan-50": "1191e6",
    "cyan-40": "30b0ff",
    "cyan-30": "6ccaff",
    "cyan-20": "b3e6ff",
    "cyan-10": "e3f6ff",
    "teal-100": "081a1c",
    "teal-90": "003137",
    "teal-80": "004548",
    "teal-70": "006161",
    "teal-60": "007d79",
    "teal-50": "009c98",
    "teal-40": "00bab6",
    "teal-30": "20d5d2",
    "teal-20": "92eeee",
    "teal-10": "dbfbfb",
    "green-100": "081b09",
    "green-90": "01330f",
    "green-80": "054719",
    "green-70": "10642a",
    "green-60": "198038",
    "green-50": "24a148",
    "green-40": "3dbb61",
    "green-30": "56d679",
    "green-20": "9deeb2",
    "green-10": "dafbe4",
    black: "000000",
    "cool-gray 100": "13171a",
    "cool-gray 90": "242a2e",
    "cool-gray 80": "373d42",
    "cool-gray 70": "50565b",
    "cool-gray 60": "697077",
    "cool-gray 50": "868d95",
    "cool-gray 40": "9fa5ad",
    "cool-gray 30": "b9bfc7",
    "cool-gray 20": "d5d9e0",
    "cool-gray 10": "f2f4f8",
    white: "ffffff",
    "gray-100": "171717",
    "gray-90": "282828",
    "gray-80": "3d3d3d",
    "gray-70": "565656",
    "gray-60": "6f6f6f",
    "gray-50": "8c8c8c",
    "gray-40": "a4a4a4",
    "gray-30": "bebebe",
    "gray-20": "dcdcdc",
    "gray-10": "f3f3f3",
    "warm-gray 100": "1a1717",
    "warm-gray 90": "2b2828",
    "warm-gray 80": "403c3c",
    "warm-gray 70": "595555",
    "warm-gray 60": "726e6e",
    "warm-gray 50": "8f8b8b",
    "warm-gray 40": "a7a2a2",
    "warm-gray 30": "c1bcbb",
    "warm-gray 20": "e0dbda",
    "warm-gray 10": "f7f3f1"
  };

  function validateSection() {
    isCms = window.location.href.includes("cms");
    isDrupal = digitalData.page.pageInfo.ibm.contentDelivery == "Drupal 8";
  }

  function isValid(value) {
    if (value == " " || value == "" || value == null || value == undefined) {
      return false;
    } else {
      return true;
    }
  }

  function createButton() {
    const li = document.createElement("li");
    li.role = "presentation";
    li.innerHTML =
      '<a class="ibm-bold" id="ibm-qa-help" style="color:#0058a1" href="#" role="menuitem" target="_self" tabindex="0">Get a QA Help</a>';

    if (document.querySelector(".ibm-sitenav-menu-list ul")) {
      document.querySelector(".ibm-sitenav-menu-list ul").append(li);
    } else {
      const ul = document.createElement("ul");
      ul.role = "menubar";
      ul.append(li);
      document.querySelector(".ibm-sitenav-menu-list").append(ul);
    }
  }

  function returnStatus(url, callback) {
    GM.xmlHttpRequest({
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      url: url,
      onload: function(res) {
        callback(String(res.status));
      },
      onabort: function() {
        console.error("There was an abort");
      },
      ontimeout: function() {
        console.error("It timeout");
      },
      onerror: function() {
        console.error("There was an error");
      }
    });
  }

  function checkAlt() {
    let imgs = document.querySelectorAll("img");

    imgs.forEach(img => {
      let msg = "";
      let color = "";

      if (isValid(img.alt)) {
        msg = '• Alt-text: "' + img.alt + '"';
        color = colors["green-60"];
      } else {
        msg = "Missing alt text";
        color = colors["red-50"];
      }

      const div = document.createElement("div");
      div.style.background = "#" + color;
      div.style.color = "#" + colors["white"];
      div.classList.add("ibm-bold");
      div.innerText = msg;

      img.parentNode.append(div);
    });
  }

  function checkKaltura() {
    let msg = "";
    let color = "";
    let videos = document.querySelectorAll('a[data-widget="videoplayer"]');

    videos.forEach(video => {
      let videotype = video.getAttribute("data-videotype");

      if (videotype == "youtube") {
        let kalturaid = video.getAttribute("data-kaltura-fallbackid");

        if (isValid(kalturaid)) {
          msg =
            '• Video has Kaltura ID <a href="https://mediacenter.ibm.com/media/' +
            kalturaid +
            '" target="_blank">(Mediacenter link)</a>';
          color = colors["green-60"];
        } else {
          msg = "• Video doesn't have Kaltura ID";
          color = colors["red-50"];
        }
      } else {
        msg = "• Kaltura video";
        color = colors["green-60"];
      }

      const div = document.createElement("div");
      div.style.background = "#" + color;
      div.style.color = "#" + colors["white"];
      div.classList.add("ibm-bold");
      div.innerHTML = msg;

      video.parentNode.append(div);
    });
  }

  function checkRelativeLinks() {
    let buttons = document.links;
    buttons = Array.prototype.slice.call(buttons);

    let mapedButtons = buttons.map(button => {
      let url = button.getAttribute("href");

      if (url.includes("ibm")) {
        if (url.includes("www")) {
          return {
            url: url.replace("www", "cms"),
            cta: button
          };
        }
      }

      return false;
    });

    let filteredButtons = mapedButtons.filter(button => {
      return button;
    });

    filteredButtons.forEach(button => {
      let color = "";
      let msg = "";

      returnStatus(button.url, function(status) {
        if (status.startsWith("2")) {
          color = colors["red-50"];
          msg = "• Link should be coded as relative";

          let br = document.createElement("br");
          let span = document.createElement("span");
          span.classList.add("ibm-bold");
          span.style.color = "#" + colors.white;
          span.style.background = "#" + colors["red-50"];
          span.innerText = msg;

          button.cta.appendChild(br);
          button.cta.appendChild(span);
        } else {
          return false;
        }
      });
    });
  }

  function checkLinks() {
    let buttons = document.links;
    buttons = Array.prototype.slice.call(buttons);

    let mapedButtons = buttons.map(button => {
      let url = button.getAttribute("href");

      if (!url.includes("http")) {
        if (!url.includes("www")) {
          if (url.includes("/")) {
            url = "http://cms.ibm.com" + url;
          } else {
            return false;
          }
        }
      }

      return {
        url: url,
        cta: button
      };
    });

    let filteredButtons = mapedButtons.filter(button => {
      return button;
    });

    filteredButtons.forEach(button => {
      let color = "";
      let msg = "";

      returnStatus(button.url, function(status) {
        if (status.startsWith("2")) {
          color = colors["green-60"];
          msg = "Success";
        } else if (status.startsWith("3")) {
          color = colors["purple-60"];
          msg = "Redirection";
        } else if (status.startsWith("4")) {
          color = colors["red-60"];
          msg = "Client error";
        } else {
          color = colors["magenta-60"];
          msg = "Server error";
        }

        button.cta.style.background = "#" + color;
        button.cta.style.color = "#" + colors["white"];
        button.cta.setAttribute("title", msg + " - " + status);
      });
    });
  }

  function check() {
    checkAlt();
    checkKaltura();
    checkLinks();

    if (isDrupal) {
      checkRelativeLinks();
    } else {
      console.log("Limited QA help, this page is not drupal");
    }
  }

  function init() {
    createButton();
    document
      .querySelector("#ibm-qa-help")
      .addEventListener("click", function() {
        validateSection();
        check();
      });
  }

  window.addEventListener(
    "load",
    function() {
      init();
    },
    false
  );
})();

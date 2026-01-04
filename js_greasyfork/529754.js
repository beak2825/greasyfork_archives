// ==UserScript==
// @name         target-loader
// @namespace    target-loader.zero.nao
// @version      0.1
// @description  target loader
// @author       nao [2669774]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/529754/target-loader.user.js
// @updateURL https://update.greasyfork.org/scripts/529754/target-loader.meta.js
// ==/UserScript==

let api = localStorage.getItem("api_full");
let url = window.location.href;
let rfc = getRFC();

function getRFC() {
  var rfc = $.cookie("rfc_v");
  if (!rfc) {
    var cookies = document.cookie.split("; ");
    for (var i in cookies) {
      var cookie = cookies[i].split("=");
      if (cookie[0] == "rfc_v") {
        return cookie[1];
      }
    }
  }
  return rfc;
}
const divContainer = document.createElement("div");
divContainer.id = "iframe-container";
divContainer.style.display = "none"; // Initially hidden
divContainer.style.position = "absolute";
divContainer.style.width = "300px";
divContainer.style.height = "500px";
divContainer.style.border = "2px solid black";
divContainer.style.zIndex = "1000";

let iframe = document.createElement("iframe");
iframe.style.height = "100%";

const iframe_close_icon = document.createElement("div");
iframe_close_icon.id = "iframe-close-icon";
iframe_close_icon.style.position = "absolute";
iframe_close_icon.style.top = "0";
iframe_close_icon.style.right = "0";
iframe_close_icon.style.cursor = "pointer";
iframe_close_icon.style.backgroundColor = "#000000";
iframe_close_icon.style.color = "#f00";
iframe_close_icon.style.padding = "5px";
iframe_close_icon.style.fontSize = "20px";
iframe_close_icon.style.zIndex = "1001";
iframe_close_icon.innerHTML = "&times;";

iframe_close_icon.addEventListener("click", () => {
  divContainer.style.display = "none";
});

divContainer.appendChild(iframe_close_icon);
divContainer.appendChild(iframe);
document.body.appendChild(divContainer);

function createElement() {
  const container_child = document.querySelector("#users-list-root");
  if (!container_child) {
    setTimeout(createElement, 1000);
    return;
  }

  const parentWrapper = document.createElement("div");
  parentWrapper.style.display = "flex";
  wrap(container_child, parentWrapper);

  const element = document.createElement("div");
  element.id = "target-loader";
  element.style.height = "50%";
  element.style.position = "absolute";
  element.style.top = "0";
  element.style.right = "0";

  element.appendChild(iframe);

  parentWrapper.appendChild(element);
}

function changeBehavior() {
  return;
  const links = document.querySelectorAll("a[href*='getInAttack']");
  if (links.length == 0) {
    setTimeout(changeBehavior, 1000);
    return;
  }

  const rows = document.querySelectorAll("li[class^='tableRow']");
  rows.forEach((row) => {
    const link = row.querySelector("a[href*='getInAttack']");
    const url = link.href;
    const status = row.querySelector("span[class$='status']").parentElement;

    status.addEventListener("click", (event) => {
      event.stopPropagation();
      iframe.src = url;
      iframe.style.left = `${event.pageX}px`;
      iframe.style.top = `${event.pageY}px`;
      iframe.style.display = "block";
    });

    status.style.backgroundColor = "#007bff";
  });
}

function wrap(el, wrapper) {
  el.parentNode.insertBefore(wrapper, el);
  wrapper.appendChild(el);
}

function removeElementsFromIframe() {
  const iframeDoc = iframe.contentWindow.document;
  if (!iframeDoc) {
    setTimeout(removeElementsFromIframe, 500);
    return;
  }

  const elementsToRemove = ["#chatRoot", "#header-root"];

  elementsToRemove.forEach((selector) => {
    iframeDoc.querySelectorAll(selector).forEach((el) => el.remove());
  });
}

// Ensure the function runs once the iframe loads
iframe.onload = removeElementsFromIframe;

function handleTargetPage() {
  $(document).on("click", "span[class$='status']", function (event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("Click event detected:", event);

    const object = $(this); // Use jQuery for better compatibility
    const parent = object.parent().parent().parent();

    console.log("Parent element:", parent);

    const link = parent.find("a[href*='getInAttack']").get(0);

    if (!link) {
      console.log("No attack link found.");
      return; // Exit if no link is found
    }
    displayIframe(link.href, event);
  });
}

function handleFactionWarPage() {
  $(document).on("click", ".status", function (event) {
    event.preventDefault();
    event.stopPropagation();

    console.log("Click event detected:", event);

    const object = $(this); // Use jQuery for better compatibility
    const parent = object.parent();

    console.log("Parent element:", parent);

    const link = parent.find("a[href*='profiles.php']").get(0);
    const id = link.href.split("profiles.php?XID=")[1];
    const attackLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${id}`;
    displayIframe(attackLink, event);
  });
}

function displayIframe(src, event) {
  divContainer.remove();
  document.body.appendChild(divContainer);
  iframe.src = src;
  let leftDist = event.pageX;
  const viewportWidth = window.innerWidth;
  if (leftDist > viewportWidth / 2) {
    leftDist -= 300;
  }
  divContainer.style.left = `${leftDist}px`;
  divContainer.style.top = `${event.pageY}px`;

  // Add a small delay before showing to ensure iframe has started loading
  setTimeout(() => {
    divContainer.style.display = "block";
    console.log("Iframe displayed.");
  }, 50);
}

function handleBountiesPage() {
  $(document).on("click", "div[class='claim left']", function (e) {
    e.stopPropagation();
    $(".confirm.cclaim").remove();
    const parent = $(this).parents("ul[class='item']");
    const id = $("a[href*='profiles.php?XID=']", $(parent))
      .attr("href")
      .split("ID=")[1];
    const attackLink = `https://www.torn.com/loader.php?sid=attack&user2ID=${id}`;
    displayIframe(attackLink, e);
  });
}

if (window.location.href.includes("torn.com/page.php?sid=list&type=targets")) {
  handleTargetPage();
} else if (window.location.href.includes("faction")) {
  handleFactionWarPage();
} else if (window.location.href.includes("bounties")) {
  handleBountiesPage();
}

// ==UserScript==
// @name         Roblox Snlmbe Erişim Menüsü 🚀 (Versiyon 3)
// @name:en      Roblox Snlmbe Access Menu 🚀 (Version 3)
// @namespace    Violentmonkey Scripts
// @version      3.1.0
// @author       snlmbe
// @license      GPL-3.0-only
// @description  👩🏽‍🚀 Bu betik, Roblox web sitesindeki gezinme menüsünün yerine hızlı erişim sağlayan kullanıcı dostu bir menü ekler. Menü sayfanın ortasında aşağı kısımda yer alır ve önemli bağlantılara kolayca erişim imkanı sunar. Bu versiyonda çeşitli geliştirmeler yapılmıştır.
// @description:en 👩🏽‍🚀 This script adds a user-friendly menu that provides quick access to important links, replacing the navigation menu on the Roblox website. The menu is located in the bottom center of the page and allows easy navigation to essential destinations. This version includes various enhancements.
// @grant        none
// @match        *://*.roblox.com/*
// @match        *://roblox.com/*
// @icon         https://i.hizliresim.com/ngyn45v.png
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/480921/Roblox%20Snlmbe%20Eri%C5%9Fim%20Men%C3%BCs%C3%BC%20%F0%9F%9A%80%20%28Versiyon%203%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480921/Roblox%20Snlmbe%20Eri%C5%9Fim%20Men%C3%BCs%C3%BC%20%F0%9F%9A%80%20%28Versiyon%203%29.meta.js
// ==/UserScript==

function addStyles(styles) {
  var styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(styles));
  document.head.appendChild(styleElement);
}

function addDockMenu() {
  var dockContainer = document.createElement("div");
  dockContainer.id = "dock-container";

  var dockMenu = document.createElement("div");
  dockMenu.className = "dock-menu";

  for (var i = 0; i < dockLinks.length; i++) {
    var dockLink = document.createElement("a");
    dockLink.className = "dock-link";
    dockLink.href = dockLinks[i].url;
    dockLink.innerHTML = '<span class="' + dockLinks[i].iconClass + '"></span>';

    var tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    tooltip.textContent = dockLinks[i].tooltipText;

    dockLink.addEventListener("click", handleLinkClick);
    dockMenu.appendChild(dockLink);
  }

  dockContainer.appendChild(dockMenu);
  document.body.appendChild(dockContainer);
}

var dockStyle = `
#dock-container {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 430px;
  height: 60px;
  background-color: #222;
  border-radius: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  z-index: 9999;
}

.dock-menu {
  display: flex;
  align-items: center;
}

.dock-link {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  color: #fff;
  font-size: 14px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
  padding: 5px;
  position: relative;
}

.dock-link.selected {
  opacity: 1;
}

.dock-link:hover {
  opacity: 1;
}

.dock-link span {
  margin-bottom: 5px;
}

.tooltip {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #000;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.dock-link:hover .tooltip {
  opacity: 1;
  visibility: visible;
}
`;

var dockLinks = [
  { iconClass: "icon-nav-home", tooltipText: "Home", url: "https://www.roblox.com/home" },
  { iconClass: "icon-nav-profile", tooltipText: "Profile", url: "https://www.roblox.com/users/profile" },
  { iconClass: "icon-nav-message", tooltipText: "Messages", url: "https://www.roblox.com/my/messages/#!/inbox" },
  { iconClass: "icon-nav-friends", tooltipText: "Friend Requests", url: "https://www.roblox.com/users/friends#!/friend-requests" },
  { iconClass: "icon-nav-charactercustomizer", tooltipText: "Avatar", url: "https://www.roblox.com/my/avatar" },
  { iconClass: "icon-nav-inventory", tooltipText: "Inventory", url: "https://www.roblox.com/users//inventory" },
  { iconClass: "icon-nav-trade", tooltipText: "Trades", url: "https://www.roblox.com/trades" },
  { iconClass: "icon-nav-group", tooltipText: "Groups", url: "https://www.roblox.com/my/groups" },
  { iconClass: "icon-nav-blog", tooltipText: "Blog", url: "https://blog.roblox.com/" },
  { iconClass: "icon-nav-shop", tooltipText: "Amazon", url: "https://www.amazon.com/roblox?&_encoding=UTF8&tag=r05d13-20&linkCode=ur2&linkId=5562fc29c05b45562a86358c198356eb&camp=1789&creative=9325" },
  { iconClass: "icon-nav-giftcards", tooltipText: "Gift Cards", url: "https://www.roblox.com/giftcards-us" },
  { iconClass: "", tooltipText: "Premium", url: "https://www.roblox.com/premium/membership?ctx=leftnav" }
];

var selectedLink = null;

function handleLinkClick(event) {
  event.preventDefault();
  var target = event.target.closest(".dock-link");

  if (!target.classList.contains("selected")) {
    if (selectedLink !== null) {
      selectedLink.classList.remove("selected");
    }
    target.classList.add("selected");
    selectedLink = target;
  }
    event.stopPropagation();
    window.location.href = target.href;
}

addStyles(dockStyle);

document.addEventListener("DOMContentLoaded", function() {
  addDockMenu();
});

const css = `

`;

function addStyles(styles) {
  var styleElement = document.createElement("style");
  styleElement.type = "text/css";
  styleElement.appendChild(document.createTextNode(styles));
  document.head.appendChild(styleElement);
}

function tanıtıcıLinkClick(event) {
  event.preventDefault();
  var target = event.target.closest(".dock-link");

  if (!target.classList.contains("selected")) {
    if (seçiliBağlantı !== null) {
      seçiliBağlantı.classList.remove("selected");
    }
    target.classList.add("selected");
    seçiliBağlantı = target;

    window.location.href = target.href;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  addDockMenu();
});

addStyles(css);
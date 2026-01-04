// ==UserScript==
// @name         npc item shortcuts
// @version      v1.0
// @description  sw & tp shortcuts under items in ur inventory/sdb/shops :)
// @author       gnome
// @include      https://neopetsclassic.com/*
// @include      https://wwww.neopetsclassic.com/*
// @exclude      https://neopetsclassic.com/itemview/*
// @exclude      https://neopetsclassic.com/useobject/*
// @noframes
// @grant        none
// @namespace
// @namespace https://greasyfork.org/users/799416
// @downloadURL https://update.greasyfork.org/scripts/431892/npc%20item%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/431892/npc%20item%20shortcuts.meta.js
// ==/UserScript==

const whereShortcutsShouldAppear = {
  inventory: true,
  shopStock: true,
  safetyDepositBox: true,
  userShops: false,
  neopianShops: true,
  galleries: false,
  kadoatery: true,
  jobAgency: true,
  quickStock: false,
  moneyTree: false
}

const appendChildren = (parent, childrenArray) => {
  for (let i = 0; i < childrenArray.length; i++) {
    parent.appendChild(childrenArray[i]);
  }
}

const urlContains = (urlSegment) => {
  return window.location.href.indexOf(urlSegment) !== -1;
}

const elementContains = (element, string) => {
  return element.innerHTML.indexOf(string) !== -1;
}

const pageContains = (string) => {
  return elementContains(document.body, string);
}

const createShortcuts = (itemName) => {
  const shortcutData = {
    sw: {
      icon: 'https://i.imgur.com/CFPfiVf.png',
      url: `https://neopetsclassic.com/market/wizard/#query=${itemName}&search_method=1`
    },
    tp: {
      icon: 'https://i.imgur.com/HWJM0nT.png',
      url: `https://neopetsclassic.com/island/tradingpost/browse/#query=${itemName}&category=2`
    },
    sdb: {
      icon: 'https://i.imgur.com/DW4mgJK.png',
      url: `https://neopetsclassic.com/safetydeposit/?page=1&query=${itemName.split(' ').join('+')}&category=0`
    }
  }
  const createShortcut = ({ icon, url }) => {
    const shortcut = document.createElement('a');
    const img = document.createElement('img');
    img.src = icon;
    img.style = 'width: auto; height: 16px; padding: 3px;';
    shortcut.href = url;
    shortcut.setAttribute('target', '_blank');
    shortcut.appendChild(img);
    return shortcut;
  }
  const shortcutContainer = document.createElement('div');
  const shortcutBoxes = Object.values(shortcutData).map(createShortcut);
  appendChildren(shortcutContainer, shortcutBoxes);
  return shortcutContainer;
}

const parseQuery = () => {
  const hashParams = window.location.hash.substr(1).split('&');
  hashParams.forEach(hashParam => {
    if (hashParam !== '') {
      const [inputName, inputValue] = hashParam.split('=');
      const inputs = document.querySelectorAll(`*[name=${inputName}]`);
      inputs.forEach((input, index) => {
        input.value = decodeURIComponent(inputValue);
        if (index === inputs.length - 1) {
          const container = input.closest('table');
          const form = container.querySelector('form');
          form?.submit?.();
        }
      });
    }
  });
}

if (whereShortcutsShouldAppear.shopStock) {
  const tds = document.querySelectorAll('.sdbtd');
  if (pageContains('<a href="/market/till/">Shop Till</a>')) {
    tds.forEach(td => {
      if (td.id === 'sdbname') {
        const itemName = td.getElementsByTagName('b')[0].textContent;
        const shortcuts = createShortcuts(itemName);
        td.appendChild(shortcuts);
      }
    });
  }
}

if (whereShortcutsShouldAppear.safetyDepositBox) {
  const tds = document.querySelectorAll('.sdbtd');
  if (pageContains('<div class="safetyDepositHeader">')) {
    tds.forEach(td => {
      if (td.id === 'sdbname') {
        const itemName = td.getElementsByTagName('b')[0].textContent;
        const shortcuts = createShortcuts(itemName);
        td.appendChild(shortcuts);
      }
    });
  }
}

if (whereShortcutsShouldAppear.inventory) {
  const inventoryItems = document.querySelectorAll('.inventoryitem');
  inventoryItems.forEach(div => {
    const rawNode = div.cloneNode(true);
    const extra = rawNode.querySelectorAll('font');
    extra.forEach(fontEl => {
      rawNode.removeChild(fontEl);
    });
    const itemName = rawNode.textContent.trim();
    const shortcuts = createShortcuts(itemName);
    div.appendChild(shortcuts);
  });
}

const addShortcutsToShopItems = (shopItems) => {
  shopItems.forEach(item => {
    const td = item.parentElement;
    const boldedText = td.querySelector('b');
    const itemName = boldedText.textContent;
    const shortcuts = createShortcuts(itemName);
    td.insertBefore(shortcuts, boldedText.nextSibling);
    td.removeChild(shortcuts.nextElementSibling); // remove <br>
  });
}

if (whereShortcutsShouldAppear.userShops) {
  if (urlContains('neopetsclassic.com/market/browseshop/?owner=')) {
    const shopItemLinks = document.querySelectorAll(`a[href^='/market/buyitem/']`) // all <a> elements whose href attribute starts with "/buyitem/"
    addShortcutsToShopItems(shopItemLinks);
  }
}

if (whereShortcutsShouldAppear.neopianShops) {
  const shopItemLinks = document.querySelectorAll(`a[href^='/buyitem/']`) // all <a> elements whose href attribute starts with "/buyitem/"
  addShortcutsToShopItems(shopItemLinks);
}

if (whereShortcutsShouldAppear.galleries) {
  if (urlContains('neopetsclassic.com/gallery')) {
    const itemImages = document.querySelectorAll(`td[width='120'] > img[src^='/images/items/']`);
    addShortcutsToShopItems(itemImages);
  }
}

if (whereShortcutsShouldAppear.kadoatery) {
  if (pageContains('Get in there and help some Kadoaties')) {
    const kadLinks = document.querySelectorAll(`td a[href^='/games/kadoatery/feed']`); // all <a> elements whose href attribute starts with "/games/kadoatery/feed"
    kadLinks.forEach(link => {
      const td = link.closest('td');
      if (!elementContains(td, 'You should give it')) return;
      const p = link.nextElementSibling;
      const boldedText = p.querySelector('b');
      const itemName = boldedText.textContent;
      const shortcuts = createShortcuts(itemName);
      p.appendChild(shortcuts);
    });
  }
}

if (whereShortcutsShouldAppear.jobAgency) {
  if (pageContains('The job listings refresh every 10 minutes')) {
    const cells = document.querySelectorAll(`td[colspan='2']`);
    const tds = Array.from(cells).filter(cell => elementContains(cell, '<b>Base Reward:</b>'));
    tds.forEach(td => {
      const [firstBr, secondBr] = td.querySelectorAll('br');
      const firstPart = td.innerHTML.split('<br>')[0].trim();
      const itemName = firstPart.split('</b>')[1].trim();
      const shortcuts = createShortcuts(itemName);
      shortcuts.style.margin = '0.5rem 0';
      td.insertBefore(shortcuts, firstBr);
      td.removeChild(firstBr);
      td.removeChild(secondBr);
    });
  }
}

if (whereShortcutsShouldAppear.quickStock) {
  if (pageContains('This is designed to make life easier when putting items in your deposit box, the money tree, or in your shop.')) {
    const tds = document.querySelectorAll('.safetyDepositContent .qstable tr:not(#qsfooter) td:not(#qstd):not(#qsfooter)');
    tds.forEach(td => {
      const itemName = td.innerHTML.trim();
      const shortcuts = createShortcuts(itemName);
      td.appendChild(shortcuts);
    });
  }
}

if (whereShortcutsShouldAppear.moneyTree) {
  if (pageContains('Money Tree is a place where people donate their Neopoints')) {
    const item = document.querySelectorAll('.donation_item');
    item.forEach(item => {
      const itemName = item.querySelector('b').innerHTML.trim();
      const shortcuts = createShortcuts(itemName);
      item.appendChild(shortcuts);
      shortcuts.previousElementSibling.remove()
    });
  }
}

parseQuery();
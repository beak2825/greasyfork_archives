// ==UserScript==
// @name         GC - Quest Quick Links
// @namespace    https://greasyfork.org/en/users/1202961-twiggies
// @version      1.21
// @description  On the quest pages, attaches to the images for each quest item a link to either the SDB if you have the item in your SDB, or the Shop Wizard.
// @author       Twiggies
// @match        https://www.grundos.cafe/*/accept/
// @match        https://www.grundos.cafe/*/complete/
// @match        https://www.grundos.cafe/winter/snowfaerie/
// @match        https://www.grundos.cafe/winter/grundo/
// @match        https://www.grundos.cafe/halloween/witchtower/
// @match        https://www.grundos.cafe/halloween/braintree/
// @match        https://www.grundos.cafe/halloween/esophagor/
// @match        https://www.grundos.cafe/island/kitchen/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483101/GC%20-%20Quest%20Quick%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/483101/GC%20-%20Quest%20Quick%20Links.meta.js
// ==/UserScript==

let itemList;
let swList = [];
let sdbList = [];

itemList = document.querySelectorAll('div.itemList > div.centered-item')

if (itemList == undefined || itemList.length == 0) {
    itemList = document.querySelectorAll('div.quest-item');
}

if (itemList != undefined) {
    //Loop through each item
    for (let i = 0; i < itemList.length; i++) {
      let link = '';
      let sdbImg = itemList[i].querySelector('div.searchhelp a[href*="/safetydeposit/"] img');
      if (sdbImg != undefined) {
          //Check if the safety deposit box link has a checkmark.
          if (sdbImg.src.includes('_check')) {
              link = sdbImg.parentElement.href
              if (window.location.href.endsWith('/accept/') || !window.location.href.endsWith('/complete/')) {
                  sdbList.push(itemList[i]);
              }
              else {
                  sdbList.push(itemList[i].parentNode);
              }
          }
          //Otherwise, use the shop wizard link.
          else {
              link = itemList[i].querySelector('div.searchhelp a[href*="/wizard/"]').href;
              if (window.location.href.endsWith('/accept/') || !window.location.href.endsWith('/complete/')) {
                  swList.push(itemList[i]);
              }
              else {
                  swList.push([itemList[i].parentNode, itemList[i].parentNode.nextElementSibling]);
              }
          }
          //Set the image for this item to the link.
          const imgElem = itemList[i].querySelector('img')
          const linkElem = document.createElement('a');
          linkElem.href = link;
          linkElem.target = '_blank';
          linkElem.appendChild(imgElem.cloneNode(true));
          itemList[i].replaceChild(linkElem,imgElem);
      }

    }
    //After all that we want to rearrange the order of the items.
    //We're going to do this by looping through the swList, if the sdbList is not empty.
    if (sdbList.length > 0) {
        //We work slightly differently for the complete page vs the other pages due to the way the divs are laid out.
        if (window.location.href.endsWith('/complete/')) {
            for (let i = 0; i < swList.length; i++) {
                swList[i][0].parentNode.insertBefore(swList[i][0],sdbList[0]);
                swList[i][0].parentNode.insertBefore(swList[i][1],sdbList[0]);
            }
        }
        else {
            for (let i = 0; i < swList.length; i++) {
                swList[i].parentNode.insertBefore(swList[i],sdbList[0]);
            }
        }
    }
}
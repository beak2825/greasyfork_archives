// ==UserScript==
// @name            User Links Neoboards
// @description     Adds a quick way to insert user links into the neoboard's reply textbox.
//
// @author    https://www.reddit.com/user/vincent_r_a/
//
// @license   GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
//
// @match     www.neopets.com/neoboards/*
//
// @version   1.1
//
// @run-at    document-start|document-end
// @namespace https://greasyfork.org/users/526303
// @downloadURL https://update.greasyfork.org/scripts/430759/User%20Links%20Neoboards.user.js
// @updateURL https://update.greasyfork.org/scripts/430759/User%20Links%20Neoboards.meta.js
// ==/UserScript==

var username = 'USERNAME';

var container = document.createElement('div');
container.setAttribute('style', 'grid-column: 3/4; grid-row: 4/5; display: flex;flex-direction: row;flex-wrap: wrap;justify-content: space-evenly;align-content: space-around;align-items: center;');
var replyContainer = document.getElementsByClassName('topicReplyContainer')[0];
if (replyContainer === undefined) {
  replyContainer = document.getElementsByClassName('topicCreateContainer')[0];
}

// From Jawsch's https://greasyfork.org/en/scripts/8860-neopets-neoboard-enhancements
let linkmap = { // for urls and images
  neomail: {
    "url": "http://www.neopets.com/neomessages.phtml?type=send&recipient=%s",
    "img": "//images.neopets.com/themes/h5/basic/images/v3/neomail-icon.svg",
    "hint": "Insert your neomail link!",
    "show": 1
  },
  trades: {
    "url": "http://www.neopets.com/island/tradingpost.phtml?type=browse&criteria=owner&search_string=%s",
    "img": "//images.neopets.com/themes/h5/basic/images/tradingpost-icon.png",
    "hint": "Insert your trading post link!",
    "show": 1
  },
  auctions: {
    "url": "http://www.neopets.com/genie.phtml?type=find_user&auction_username=%s",
    "img": "//images.neopets.com/themes/h5/basic/images/auction-icon.png",
    "hint": "Insert your auctions link!",
    "show": 1
  },
  gallery: {
    "url": "http://www.neopets.com/gallery/index.phtml?gu=%s",
    "img": "//images.neopets.com/themes/h5/basic/images/v3/gallery-icon.svg",
    "hint": "Insert your gallery link!",
    "show": 1
  },
  myshop: {
    "url": "http://www.neopets.com/browseshop.phtml?owner=%s",
    "img": "//images.neopets.com/themes/h5/basic/images/myshop-icon.png",
    "hint": "Insert your shop link!",
    "show": 1
  },
};

if (replyContainer !== undefined) {

  for (const [link, data] of Object.entries(linkmap)) {
    if (!data.show) { continue; }
    let tag = document.createElement('a');
    tag.setAttribute('href', 'javascript:;');
    tag.setAttribute('onclick', 'insertSmiley("' + data.url.replace('%s', username) + '")');
    tag.setAttribute('return', 'false:;');
    tag.innerHTML = `<img src="${data.img}" width="50px" height="50px" alt="${link}" border="0" title="${data.hint}"></a>`;
    container.appendChild(tag);
  }

  replyContainer.appendChild(container);
}
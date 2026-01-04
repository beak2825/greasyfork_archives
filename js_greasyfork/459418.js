// ==UserScript==
// @name        メルカリユーザーブロッカー v2
// @description SakuraScript
// @author      Sakura_Kocho
// @namespace   https://twitter.com/Sakura_Kocho
// @version     2.1
// @match       https://jp.mercari.com/search*
// @icon        https://pbs.twimg.com/profile_images/1471673794754654208/e4U53d02_400x400.png
// @run-at      document-idle
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/459418/%E3%83%A1%E3%83%AB%E3%82%AB%E3%83%AA%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/459418/%E3%83%A1%E3%83%AB%E3%82%AB%E3%83%AA%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E3%83%96%E3%83%AD%E3%83%83%E3%82%AB%E3%83%BC%20v2.meta.js
// ==/UserScript==
GM_registerMenuCommand("DPoP", SetDPoP);
GM_registerMenuCommand("FuckUser", SetFuckUser);
function SetDPoP() {
  var DPoP = prompt("取得したDPoPを入力して下さい\n※\"https://api.mercari.jp/items/get?id=\"で絞り込み", LocalDPoP);
  if (DPoP != null) {
    GM_setValue("DPoP", DPoP);
  }
}
function SetFuckUser() {
  var EditFuckUser = prompt("クソ野郎一覧", GM_getValue("FuckUsers"));
  if (EditFuckUser != null) {
    GM_setValue("FuckUsers", EditFuckUser);
  }
}

var LocalDPoP = GM_getValue("DPoP");
if (!LocalDPoP) {
  SetDPoP();
}

function LoadWait() {
if (document.querySelector('div[id="search-result"]') == null) {
  console.log("読み込み中 1");
  setTimeout( LoadWait, 500 );
  return;
  } else {
    if (document.querySelectorAll('li[data-testid*="item-cell"]')[0].childNodes[0].childNodes[0].href == null) {
      console.log("読み込み中 2");
      setTimeout( LoadWait, 500 );
      return;
    } else {
      Start();
    }
  }
}
LoadWait();

var ItemID;
var url;
var UrlCC = "1"
function Start() {
  var ItemList = document.querySelectorAll('li[data-testid*="item-cell"]');
  for (var i = 0; i < ItemList.length; i++) {
    var Item = ItemList[i];
    ItemID = ItemList[i].childNodes[0].childNodes[0].href.replace(/^.*item\/(m\d+)$/, "$1");
    url = "https://api.mercari.jp/items/get?id=" + ItemID;
    MosaicName(Item);
  };
  if (!GM_getValue("FuckUsers")) {
    GM_setValue("FuckUsers", "0");
  }
  var Omanko = GM_getValue("FuckUsers").split("|");
  var ElementTarget = document.querySelector('ul[class*="ItemGrid"]');
  var ElementObserver = new MutationObserver(function(mutations, observer) {
      for(const mutation of mutations) {
       if (Omanko.includes(mutation.addedNodes[0].attributes.sellerid.value)) {
         mutation.addedNodes[0].parentNode.setAttribute("FuckUser", "fuck");
       }
        mutation.addedNodes[0].addEventListener("click", {SellerID: mutation.addedNodes[0].attributes.sellerid.value, handleEvent: UserBlock} , false);
      }
  });
  ElementObserver.observe(ElementTarget, {childList: true, subtree: true});
  var URLObserver = new MutationObserver(function(mutations, observer) {
    if (UrlCC != "2") {
      UrlCC = parseInt(UrlCC) +1
    } else {
      UrlCC = "1"
      ElementObserver.disconnect();
      URLObserver.disconnect();
      LoadWait();
    }
  });
  URLObserver.observe(document.querySelector('div[class="ItemList__ItemListContainer-sc-1d1a01g-0"]'), {childList: true, subtree: false});
}

function UserBlock(zEvent) {
  var FuckUser = GM_getValue("FuckUsers") + "|" + this.SellerID;
  GM_setValue("FuckUsers", FuckUser);
//  document.querySelectorAll('div[sellerid="' + this.SellerID + '"]');
  for (var i = 0; i < document.querySelectorAll('div[sellerid="' + this.SellerID + '"]').length; i++) {
    document.querySelectorAll('div[sellerid="' + this.SellerID + '"]')[i].parentNode.setAttribute("FuckUser", "fuck");
  };
}

var SellerID;
async function MosaicName(Item) {
  var response = await makeGetRequest(Item);
  // if (!JSON.parse(response).code) {
  //   SellerID = JSON.parse(response).data.seller.id;
  // }
}

function makeGetRequest(Item) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      headers: {
        "X-Platform":"web",
        "DPoP": LocalDPoP,
      },
      onload: function(response) {
        resolve(response.responseText);
        if (JSON.parse(response.responseText).code != 3) {
          Item.insertAdjacentHTML('beforeend', '<div itemid=' + ItemID + ' sellerid=' + JSON.parse(response.responseText).data.seller.id + ' style="position: relative; top: -98%; right: -94%; font-size: 1.3em;">&times;</div>');
        } else {
          console.log("DPoPに問題があります。");
        }
      }
    });
  });
}


(function() {
let css = `
  li[fuckuser="fuck"] {
    display: none !important;
  }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
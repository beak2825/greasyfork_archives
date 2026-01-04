// ==UserScript==
// @name     				SteamDB Community Items Download
// @author   				dougwritescode
// @description     Creates download links to mass download community-item-related media from steamdb.info
// @version  				2
// @grant    				none
// @include  				https://steamdb.info/app/*
// @icon		 				https://steamdb.info/static/logos/vector_prefers_schema.svg
// @namespace       dougwritescode
// @license	 				MIT
// @downloadURL https://update.greasyfork.org/scripts/486990/SteamDB%20Community%20Items%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/486990/SteamDB%20Community%20Items%20Download.meta.js
// ==/UserScript==

// Find tab-content element
tab_content_elem = document.querySelector(".tab-content");

// Get the title for this repo
title_name = document.querySelector('h1[itemprop="name"]').innerText;

// Download function stolen from here: https://bobbyhadz.com/blog/javascript-download-image#how-to-download-images-using-javascript
// Creates an anchor element and duplicates the asset link therein, appends the element to the document body, assigning the download attribute.
// It then clicks the element and removes then removes it.
async function downloadAsset(
  imageSrc,
  nameOfDownload
) {
  const response = await fetch(imageSrc);
  const assetBlob = await response.blob();
  const href = URL.createObjectURL(assetBlob);

  const anchorElement = document.createElement('a');
  anchorElement.href = href;
  anchorElement.download = nameOfDownload;
  document.body.appendChild(anchorElement);
  anchorElement.click();

  document.body.removeChild(anchorElement);
  window.URL.revokeObjectURL(href);
}

// Generalized download button making
function make_button(
  titleString, 
  onClickFunc, 
  classStr = "btn btn-info", 
  styleStr = "margin-left: 15px; padding: 1px 5px;"
) {
  var new_button = document.createElement("input");
  new_button.type = "button";
  new_button.value = titleString;
  new_button.onclick = onClickFunc;
  new_button.setAttribute("class", classStr);
  new_button.setAttribute("style", styleStr);
  return new_button
}

// Function to add download button for badges
function add_download_badges_button(headerObj, itemContainerObj) {
  
  async function downloadBadges() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelector("img").src;
      const extension = img_src.split(".").pop();
      const badge_title = items[i].innerText
      const name = `${title_name} - badge ${parseInt(i) + 1} - ${badge_title}.${extension}`
      downloadAsset(img_src, name);
    }
  }
  
  var dl_button = make_button("Download All", downloadBadges);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dl_button); 
}

// Function to add download buttons for trading cards and card wallpapers
function add_download_trading_cards_button(headerObj, itemContainerObj) {
  
  async function downloadTradingCards() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelector("img").src;
      const extension = img_src.split(".").pop();
      const card_title = items[i].innerText
      const name = `${title_name} - card ${parseInt(i) + 1} - ${card_title}.${extension}`
      downloadAsset(img_src, name);
    }
  }
  
  async function downloadTradingCardWallpapers() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelector("a").href;
      const extension = img_src.split(".").pop();
      const wall_title = items[i].innerText
      const name = `${title_name} - card wallpaper ${parseInt(i) + 1} - ${wall_title}.${extension}`
      downloadAsset(img_src, name);
    }
  }
  
  var dl_button = make_button("Download Cards", downloadTradingCards);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dl_button); 
  
  var dll_button = make_button("Download Wallpapers", downloadTradingCardWallpapers);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dll_button); 
}

// Function to add download button for profile backgrounds
function add_download_profile_backgrounds_button(headerObj, itemContainerObj) {

  async function downloadProfileBackgrounds() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelector(".view-profile-background").href;
      const extension = img_src.split(".").pop();
      const background_title = items[i].querySelector(".b").innerText;
      const name = `${title_name} - profile background ${parseInt(i) + 1} - ${background_title}.${extension}`
      downloadAsset(img_src, name);
      const webm_link = items[i].querySelector('a[href$=".webm"]')
      if (webm_link != null) {
        const webm_src = webm_link.href;
        const webm_name = `${title_name} - animated profile background ${parseInt(i) + 1} - ${background_title}.webm,`
        downloadAsset(webm_src, webm_name);
      }
    }
  }
  
  var dl_button = make_button("Download All", downloadProfileBackgrounds);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dl_button); 
}

// Function to add download buttons for emoticons
function add_download_emoticons_button(headerObj, itemContainerObj) {
  
  async function downloadSmallEmoticons() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelectorAll("img")[0].src;
      const extension = img_src.split(".").pop();
      const emoticon_title = items[i].querySelector(".b").innerText;
      const name = `${title_name} - small emoticon ${parseInt(i) + 1} - ${emoticon_title}.${extension}`
      downloadAsset(img_src, name);
    }
  }
    
  async function downloadLargeEmoticons() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelectorAll("img")[1].src;
      const extension = img_src.split(".").pop();
      const emoticon_title = items[i].querySelector(".b").innerText;
      const name = `${title_name} - large emoticon ${parseInt(i) + 1} - ${emoticon_title}.${extension}`
      downloadAsset(img_src, name);
    }
  }
  
  var dl_button = make_button("Download Small Emoticons", downloadSmallEmoticons);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dl_button);
  
  var dll_button = make_button("Download Large Emoticons", downloadLargeEmoticons);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dll_button);
}

// Function to add download button for booster pack
function add_download_booster_pack_image_button(headerObj, itemContainerObj) {
  
  async function downloadBoosterPack() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelector("img").src;
      const extension = img_src.split(".").pop();
      const name = `${title_name} - Booster Pack.${extension}`
      downloadAsset(img_src, name);
    }
  }

  var dl_button = make_button("Download Pack", downloadBoosterPack);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dl_button);
}

// Adds download button for chat stickers
function add_download_chat_stickers_button(headerObj, itemContainerObj) {
  
  async function downloadChatStickers() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelector("img").src;
      const extension = img_src.split(".").pop();
      const sticker_title = items[i].querySelector(".b").innerText;
      const name = `${title_name} - sticker ${parseInt(i) + 1} - ${sticker_title}.${extension}`
      downloadAsset(img_src, name);
    }
	}

  var dl_button = make_button("Download All", downloadChatStickers);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dl_button);
}

// Adds download button for chat effects (So far, the only ones are from the Winter Sale Event 2019) 
function add_download_chat_effects_button(headerObj, itemContainerObj) {
    
  async function downloadChatEffects() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelectorAll("img")[1].src;
      const extension = img_src.split(".").pop();
      const effect_title = items[i].querySelector(".b").innerText;
      const name = `${title_name} - chat effect icon ${parseInt(i) + 1} - ${effect_title}.${extension}`
      downloadAsset(img_src, name);
    }
	}

  var dl_button = make_button("Download All", downloadChatEffects);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dl_button);
}

// Adds download button for mini profile backgrounds
function add_download_mini_profile_backgrounds_button(headerObj, itemContainerObj) {
  
  async function downloadMiniProfileBackgrounds() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelector('a[href$=".webm"]').href;
      const extension = img_src.split(".").pop();
      const mini_profile_title = items[i].querySelector(".b").innerText;
      const name = `${title_name} - mini profile background ${parseInt(i) + 1} - ${mini_profile_title}.${extension}`
      downloadAsset(img_src, name);
    }
  }

  var dl_button = make_button("Download All", downloadMiniProfileBackgrounds);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dl_button);
}

// Adds download button for avatar frames
function add_download_avatar_frames_button(headerObj, itemContainerObj) {

  async function downloadAvatarFrames() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelector("img").src;
      const extension = img_src.split(".").pop();
      const avatar_frame_title = items[i].querySelector(".b").innerText;
      const name = `${title_name} - avatar frame ${parseInt(i) + 1} - ${avatar_frame_title}.${extension}`
      downloadAsset(img_src, name);
    }
  }

  var dl_button = make_button("Download All", downloadAvatarFrames);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dl_button);
}

// Adds download button for animated avatars
function add_download_animated_avatars_button(headerObj, itemContainerObj) {

  async function downloadAnimatedAvatars() {
    let items = itemContainerObj.querySelectorAll(".community-item");
    for (let i in items) {
      const img_src = items[i].querySelector("img").src;
      const extension = img_src.split(".").pop();
      const animated_avatar_title = items[i].querySelector(".b").innerText;
      const name = `${title_name} - animated avatar ${parseInt(i) + 1} - ${animated_avatar_title}.${extension}`
      downloadAsset(img_src, name);
    }
  }

  var dl_button = make_button("Download All", downloadAnimatedAvatars);
  headerObj.querySelector(".panel-heading").children[0].appendChild(dl_button);
}

// Adds all download buttons for which there are headers
function add_buttons() {
  
  if (!document.querySelector(".community-items-header")) {
    return false;
  }
  
  // Locate all of the item header panel elements
  panel_headers = tab_content_elem.querySelectorAll(".community-items");
  
  if (panel_headers.length == 0) {
  	return false; 
  }
  
  for (let i in panel_headers) {
    var item_class_id = panel_headers[i].id;
    if (item_class_id == null) {
      continue;
    }
    var item_container = panel_headers[i].querySelector(".community-items-container");
    switch(item_class_id) {
      case "item-class-1": // Badges
        add_download_badges_button(panel_headers[i], item_container);
        break;
      case "item-class-2": // Trading cards
        add_download_trading_cards_button(panel_headers[i], item_container);
        break;
      case "item-class-3": // Profile backgrounds
        add_download_profile_backgrounds_button(panel_headers[i], item_container);
        break;
      case "item-class-4": // Emoticons
        add_download_emoticons_button(panel_headers[i], item_container);
        break;
      case "item-class-5": // Booster packs
        add_download_booster_pack_image_button(panel_headers[i], item_container);
        break;
      // item-class-6 is ?
      // item-class-7 is ?
      // item-class-8 is profile modifiers (collections of avatar + frame + profile background + mini profile background), nothing to download
      // item-class-9 is ?
      // item-class-10 is ?
      case "item-class-11": // Chat stickers
        add_download_chat_stickers_button(panel_headers[i], item_container);
        break;
      case "item-class-12": // Chat effects
        add_download_chat_effects_button(panel_headers[i], item_container);
        break;
      case "item-class-13": // Mini profile backgrounds 
        add_download_mini_profile_backgrounds_button(panel_headers[i], item_container);
        break;
      case "item-class-14": // Avatar frames
        add_download_avatar_frames_button(panel_headers[i], item_container);
        break;
      case "item-class-15": // Animated avatars
        add_download_animated_avatars_button(panel_headers[i], item_container);
        break;
      // item-class-16 is Steam Deck keyboards (nothing to download)
      // item-class-17 is Steam Deck / Big Picture startup movies (direct links not provided on steamdb as of Feb 9, 2024)
      default:
        break;
    }
  } 
  return true;
}

// Event listener for vanilla javascript to trigger adding buttons once the DOM has loaded
document.addEventListener("DOMContentLoaded", () => {
  add_buttons()
});

// Mutation observer code to trigger adding buttons in the event of moving to the community items tab from another repo page
const targetNode = tab_content_elem;
const config = { childList: true };
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    let added = add_buttons();
    if (added == true) {
      observer.disconnect();
    }
  }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);


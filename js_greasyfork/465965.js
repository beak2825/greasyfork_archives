// ==UserScript==
// @name         MH: Crown Flexer Data Pull
// @author       Warden Slayer
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      1.0.2
// @description  Update the data for the crown flexer app
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://www.mousehuntgame.com/images/ui/crowns/crown_platinum.png?asset_cache_version=2
// @include      http://www.mousehuntgame.com/*
// @include      https://www.mousehuntgame.com/*
// @connect      http://www.mousehuntgame.com/*
// @connect      https://www.mousehuntgame.com/*
// @grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/465965/MH%3A%20Crown%20Flexer%20Data%20Pull.user.js
// @updateURL https://update.greasyfork.org/scripts/465965/MH%3A%20Crown%20Flexer%20Data%20Pull.meta.js
// ==/UserScript==
$(document).ready(function () {
  const debug = localStorage.getItem("ws.debug");
  //loadFunction();
});

function loadFunction() {
  const range = 1124;
  let tagArray = new Array();
  let miceArray = new Array();
  let imgArray = new Array();
  hg.utils.MouseUtil.getMouseNames(function (data) {
    for (const key in data) {
      tagArray[key] = data[key].type;
    }
  });
  setTimeout(function () {
    tagArray = tagArray.slice(range);
    hg.utils.MouseUtil.getMice(tagArray, function (data) {
      if (data) {
        for (const i in data) {
          const thisData = data[i];
          if (thisData) {
            const thisMouse = {
              type: thisData.type,
              name: thisData.name,
              img: thisData.type + ".png",
              landscape: thisData.landscape,
            };
            miceArray.push(thisMouse);
            imgArray.push([data[i].type, data[i].large]);
          } else {
            //why is the hg util returning false here?
            //seems to be broken at 998 or 'rift_gaunt_melee'
            hg.utils.MouseUtil.getMouse(tagArray[i], function (data) {
              //console.log(tagArray[i])
              miceArray.push({
                type: data.type,
                name: data.name,
                img: data.type + ".png",
                landscape: data.landscape,
              });
              imgArray.push([data.type, data.large]);
            });
          }
        }
      } else {
        console.log("No Mice");
      }
    });
  }, 5000);
  setTimeout(function () {
    console.log(miceArray);
    //console.log(JSON.stringify(miceArray))
    //console.log(imgArray)
    //imgArray.forEach(download)
  }, 8000);
}

function download(source) {
  const fileName = source[0] + ".png";
  //console.log(fileName,source)
  var el = document.createElement("a");
  el.setAttribute("href", source[1]);
  el.setAttribute("download", fileName);
  $("#mousehuntContainer").append(el);
  el.click();
  el.remove();
  sleep(2000);
}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if (new Date().getTime() - start > milliseconds) {
      break;
    }
  }
}

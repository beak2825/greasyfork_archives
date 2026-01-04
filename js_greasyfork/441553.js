// ==UserScript==
// @name         drrr.com QoL Tools
// @namespace    https://greasyfork.org/users/700963
// @version      v1.0.8
// @description  Show drrr.com chat room language on lounge so you don't need to hover on each room just to check the language.
// @author       eterNEETy
// @match        https://drrr.com/lounge*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drrr.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441553/drrrcom%20QoL%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/441553/drrrcom%20QoL%20Tools.meta.js
// ==/UserScript==


var ui_icons = {
  "bot": "&#xf111;",
  "tv": "&#xf121;",
  "tablet": "&#xf11a;",
  "mobile": "&#xf11c;",
  "desktop": "&#xf118;",
  "console": "&#xf141;",
  "glass": "&#xf115;",
  "watch": "&#xf123;"
}

var flags_lang = {
  "zh-hans-MOE": "CN",
  "zh-hant-MOE": "TW",
  "ka-MOE": "JP",
  "ja-MOE": "JP"
}

function showDevice(r) {
  let el_profile = document.getElementById("profile");
  let el_name = el_profile.querySelector(".name");
  let el_tripcode = "";
  if ("tripcode" in r.profile) {
    el_tripcode = '<span class="tripcode">#' + r.profile.tripcode + '</span>';
  }
  el_name.innerHTML = r.profile.name + el_tripcode + '&nbsp;<span style="font-family: ui-icon;">'+ui_icons[r.profile.device]+'</span>';
}

function processRoom(room) {
  let el_room = document.querySelector('ul.rooms[data-meta*="' + room.id + '"] > li.name');
  if (el_room != null) {
    let el_flag = document.getElementById(room.id + "-flag");
    let lang_code = "US";
    if (room.language in flags_lang) {
      lang_code = flags_lang[room.language];
    } else {
      lang_code = room.language.slice(-2); 
    }
    if (el_flag == null) {
      el_flag = document.createElement("i");
      el_flag.id = room.id + "-flag";
      el_flag.className = "region region-" + lang_code;
      el_room.prepend(el_flag);
    } else {
      el_flag.className = "region region-" + lang_code;
    }
  }
}

function processRooms(r) {
  for (let i=0; i<r.rooms.length; i++) {
    let room = r.rooms[i];
    if ("id" in room) {
      processRoom(room);
    }
  }
}

(function() {
  'use strict';
  let origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function() {
      let url_obj = new URL(this.responseURL);
      if (url_obj.pathname == "/lounge" && url_obj.search == "?api=json") {
        let response = JSON.parse(this.responseText);
        processRooms(response);
        showDevice(response);
      }
    });
    origOpen.apply(this, arguments);
  };
})();
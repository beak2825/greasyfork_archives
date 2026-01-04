// ==UserScript==
// @name         Steam level badge changer
// @description  Preview Steam level badges
// @author       Anon || Upload by me
// @match        https://steamcommunity.com/id/*
// @match        https://steamcommunity.com/profiles/*
// @match        https://steamcommunity.com/groups/*
// @match        https://steamcommunity.com/gid/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @version      1.0.1
// @namespace    steam
// @icon         https://cdn.steamsets.com/logo.ico
// @source       https://github.com/SteamSets/SteamScripts/raw/main/LevelChanger/index.js
// @homepage     https://steamsets.com
// @website      https://steamsets.com
// @downloadURL https://update.greasyfork.org/scripts/422895/Steam%20level%20badge%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/422895/Steam%20level%20badge%20changer.meta.js
// ==/UserScript==

$(document).ready(function () {
  const url = $(location).attr("href");
  let group, lvl_badge, lvl_number, background_url;
  // alert(url.startsWith('https://steamcommunity.com/profiles/') || url.startsWith('https://steamcommunity.com/id/'))
  if (
    url.startsWith("https://steamcommunity.com/profiles/") ||
    url.startsWith("https://steamcommunity.com/id/")
  ) {
    var profileHTML = $(`
      <label for="custom_level_input"> Custom level badge:</label> <br />
      <input type="text" id="custom_level_input" /><a id="set_custom_level"> Set Level </a><br /a>
      <label for="custom_background_input"> Custom Background:</label> <br />
      <input type="text" id="custom_background_input" /><a id="set_custom_background"> Set Background </a><br /a>
      <label for="custom_profile_input"> Custom Background:</label> <br />
      <input type="text" id="custom_profile_input" /><a id="set_profile_background"> Set Picture </a><br /a>
    `);
    $(".profile_in_game").append(profileHTML);

    lvl_badge = $("div > .friendPlayerLevel")[0];
    lvl_number = $(".friendPlayerLevelNum")[0];
    profilePicture = $(".playerAvatarAutoSizeInner")[0];
    background_url = $(".no_header");

    $("#set_custom_level")[0].onclick = setLevel;
    $("#custom_level_input")[0].onchange = function (e) {
      setLevel(e.target.value);
    };

    $("#set_custom_background")[0].onclick = setBackground;
    $("#custom_background_input")[0].onchange = function (e) {
      setBackground(e.target.value);
    };

    $("#set_profile_background")[0].onclick = setProfilePicture;
    $("#custom_profile_input")[0].onchange = function (e) {
      setProfilePicture(e.target.value);
    };
  } else if (
    url.startsWith("https://steamcommunity.com/groups/") ||
    url.startsWith("https://steamcommunity.com/gid/")
  ) {
    var groupHTML = $(`
      <label for="custom_picture_input"> Custom Picture badge:</label> <br />
      <input type="text" id="custom_picture_input" /><a id="set_custom_picture"> Set Picture </a><br /a>
    `);
    $("div > .group_summary").append(groupHTML);
    group = $(".grouppage_logo")[0];

    $("#set_custom_picture")[0].onclick = setGroupPicture;
    $("#custom_picture_input")[0].onchange = function (e) {
      setGroupPicture(e.target.value);
    };
  } else {
    alert("no");
  }

  function setCharAt(str, index, chr) {
    return str.substring(0, index) + chr + str.substring(index + 1);
  }

  function setGroupPicture(val) {
    val = typeof val == "string" ? val : $("#custom_picture_input")[0].value;
    if (!val.match(/\.(gif|jpe?g|tiff?|png|webp|bmp)$/i) || !val) {
      return ($("#custom_picture_input")[0].value = "");
    }
    group.firstElementChild.src = val;
  }

  function setBackground(val) {
    val = typeof val == "string" ? val : $("#custom_background_input")[0].value;
    if (!val.match(/(http(s?):)|([/|.|\w|\s])*\.(?:jpg|gif|png)/g) || !val) {
      return ($("#custom_background_input")[0].value = "");
    }
    background_url.css("background-image", "url(" + val + ")");
  }
  function setProfilePicture(val) {
    val = typeof val == "string" ? val : $("#custom_profile_input")[0].value;
    if (!val.match(/(http(s?):)|([/|.|\w|\s])*\.(?:jpg|gif|png)/g) || !val) {
      return ($("#custom_profile_input")[0].value = "");
    }
    profilePicture.firstElementChild.src = val;
  }
  function setLevel(val) {
    val = typeof val == "string" ? val : $("#custom_level_input")[0].value;

    if (val.match(/\D/gm) && isNaN(Number(val))) {
      return ($("#custom_level_input")[0].value = "");
    }

    lvl_number.innerText = val;
    let tenth = val.substr(-2);
    tenth = setCharAt(tenth, 1, "0");
    val = setCharAt(val, val.length - 1, "0");
    val = setCharAt(val, val.length - 2, "0");
    lvl_badge.className = "friendPlayerLevel lvl_" + val + " lvl_plus_" + tenth;
  }
});

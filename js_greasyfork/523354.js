// ==UserScript==
// @name        Show revivable in faction list
// @namespace   Violentmonkey Scripts
// @match       *://www.torn.com/factions.php*
// @grant       none
// @version     2.1
// @author      callmericky [3299880] / whatdoesthespacebardo
// @description Adds a button to the faction page that will show you if members are revivable by you. Additionally, with a limited key + faction access, you can view the exact revive settings of your faction.
// @grant       GM_registerMenuCommand
// @grant       GM.setValue
// @grant       GM.getValue
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523354/Show%20revivable%20in%20faction%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/523354/Show%20revivable%20in%20faction%20list.meta.js
// ==/UserScript==

/* ===============================================================
 *                           IMPORTANT
 * ---------------------------------------------------------------
 * This only works if you have the ability to revive,
 *   or if you use an API key provided by someone that can revive.
 *   revives set to 'Friends & Faction' vs 'Everyone'.
 * If the person of interest is revivable by the API key provider,
 *   they will show up as revivable.
 * ===============================================================
 */

//IF DROPDOWN MENU DOESN'T WORK USE, MANUALLY ADD YOUR **LIMITED** API KEY HERE
var APIKey = null;
const PDA_APIKey = "###PDA-APIKEY###"

//STOP CHANGING THINGS FROM HERE
if (!isPDA()) {
  const menu_command_1 = GM_registerMenuCommand("Set API Key (public, optional limited faction access)", menuCommand)
}

async function getAPIKey() {
  if (isPDA()) {
    APIKey = PDA_APIKey
    return PDA_APIKey
  } else if (APIKey == null) {
    return await GM.getValue("CMR_ReviveView_APIKey", null)
      .then(function(data) {
        APIKey = data
        return data
      })
  }
}

function isPDA() {
  const PDATestRegex = !/^(###).+(###)$/.test(PDA_APIKey);
  return PDATestRegex;
}

async function menuCommand(event) {
  let _userKey = window.prompt("Show revivable in faction list\n- Requires a public/limited API key with optional faction access\n- For enemy factions, this is based on YOUR ability to revive the target.\n- For friendly factions, a LIMITED key will tell you the revive setting.\n\nSet API Key:", APIKey)
  if ((_userKey == null || _userKey == "")) {
    window.alert("Show revivable in faction list\nYou did not set an API Key - this script will not run")
  } else {
    await GM.setValue("CMR_ReviveView_APIKey", _userKey)
  }
}

let memberListObj = {};
let pageURL = $(location).attr("href");
let _factionID = ""

function populateMemberList() {
  memberList = {};
  let _memberRows = $("div.members-list ul.table-body div[class^=honorWrap] > a[class^=linkWrap]");
  let _matchregex = /profiles\.php.+XID=(\d+)/i;
  for (var i = 0; i < _memberRows.length; i++) {
    var _memberID = _matchregex.exec(_memberRows[i].href);
    memberList[_memberID[1]] = {
      "pageRow": i,
      "isRevivable": false
    };
  }
  return _memberRows.length;
}

async function checkFactionPage(pageURL) {
  if (pageURL.search("step=profile") >= 0 ) {
    let _matchregex = /ID\=(\d+)/i
    _factionID = (_matchregex.exec(pageURL))[1]
    return true;
  } else if ((pageURL.search("step=your") >= 0) && (pageURL.search("tab=info") >= 0)) {
      return await $.getJSON(`https://api.torn.com/v2/faction/basic?key=${APIKey}`)
      .then(function(data) {
        _factionID = data.basic.id
        return true;
      });
  } else {
    return false;
  }
}

function removeExistingIcons() {
  var revivableIconList = $("li div.revivableResult");
  if (revivableIconList.length > 0) {
    for (i = 0; i<revivableIconList.length; i++) {
      revivableIconList[i].remove();
    }
  }
}

async function parseMemberList() {
  await getMemberList()
    .then( (data) => {
      for (var i=0; i<data.members.length; i++) {
        //Factions you are not in will have 'unknown' in revive_setting
        if ((data.members[i].revive_setting).toLowerCase() == "unknown") {
          memberList[data.members[i].id].isRevivable = data.members[i].is_revivable
        } else {
          memberList[data.members[i].id].isRevivable = data.members[i].revive_setting.toLowerCase()
        }
      }
      for (var _memberID of Object.keys(memberList)) {
        $("div[class^=userInfoBox_]")[memberList[_memberID].pageRow].prepend(createReviveIcon(memberList[_memberID].pageRow, memberList[_memberID].isRevivable))
      }
    })
}

async function getMemberList() {
  return await $.getJSON(`https://api.torn.com/v2/faction/${_factionID}/members?key=${APIKey}&striptags=true`)
    .then( function(data) {
      return data
    })
}

function createReviveIcon(_memberID, _revivable) {
  var _xmlns = "http://www.w3.org/2000/svg";
  let _titleText = "Revives: Unknown"
  let _revivablePath = "m16.2,8.36c-.27.02-.52.18-.66.41l-1.07,1.98-1.32-3.8c-.09-.29-.36-.49-.66-.5-.3,0-.59.15-.74.41l-.91,2.15L9.43.59c-.08-.33-.41-.66-.74-.58-.35,0-.65.24-.74.58l-1.24,9.84-.99-5.29c-.06-.32-.33-.57-.66-.58-.32-.06-.63.11-.74.41l-1.65,3.47H0v1.49h3.06c.28,0,.54-.16.66-.41l.91-1.82,1.49,7.44c.09.34.4.57.74.58h0c.37-.01.69-.29.74-.66l1.24-9.67,1.07,6.36c.06.32.33.57.66.58.31.02.6-.14.74-.41l1.16-2.65,1.24,3.64c.09.29.36.49.66.5.3,0,.59-.15.74-.41l1.65-3.14h3.22v-1.49h-3.8Z"
  let _friendsPath = "m6.11,17.14l-1.49-7.44-.91,1.82c-.12.25-.38.41-.66.41H0v-1.49h2.65l1.65-3.47c.12-.3.43-.47.74-.41.33.01.6.25.66.58l.99,5.29,1.24-9.83c.09-.33.4-.57.74-.58.33-.08.66.25.74.58l1.41,8.43.91-2.15c.16-.26.44-.41.74-.41.3.01.57.21.66.5l1.32,3.8,1.07-1.98c.14-.24.39-.39.66-.41h3.8v1.49h-3.22l-1.65,3.14c-.16.26-.44.42-.74.41-.3-.01-.57-.21-.66-.5l-1.24-3.64-1.16,2.64c-.14.27-.43.44-.74.41-.33-.01-.6-.25-.66-.58l-1.07-6.36-1.24,9.67c-.06.37-.37.65-.74.66-.35-.01-.65-.25-.74-.58Zm6.89-9.14v-.33c0-.89.03-1.4,1.06-1.64,1.12-.26,2.23-.49,1.7-1.47-1.58-2.91-.45-4.56,1.24-4.56s2.82,1.59,1.25,4.56c-.52.98.55,1.21,1.7,1.47,1.03.24,1.06.75,1.06,1.65v.32h-8.01Z"
  let _notRevivablepath = "m6.12,15.14l-.71-3.57-3.99,3.99-1.41-1.42,4.93-4.93-.3-1.51-.91,1.82c-.12.25-.38.41-.66.41H0v-1.49h2.64l1.65-3.47c.12-.3.43-.47.74-.41.33.01.6.25.66.58l.52,2.78.9-.9.81-6.43c.09-.34.4-.57.74-.58.33-.08.66.25.74.58l.59,3.54L14.14,0l1.42,1.41-5.14,5.14.41,2.47.91-2.15c.16-.26.44-.42.74-.41.3.01.57.21.66.5l1.32,3.8,1.07-1.98c.14-.24.39-.39.66-.41h3.8v1.49h-3.22l-1.65,3.14c-.16.26-.44.41-.74.41-.3,0-.57-.21-.66-.5l-1.24-3.64-1.16,2.64c-.14.27-.44.44-.74.41-.33-.01-.6-.25-.66-.58l-.68-4.02-.8.8-.84,6.52c-.06.37-.37.65-.74.66-.35,0-.65-.24-.74-.58Zm.58-4.71l.02-.17-.04.04.02.13Z"
  let _pathFillColor = ""

  var _listItem = document.createElementNS(null, "div");
  _listItem.setAttributeNS(null, "class", "icon_show revivableResult");
  _listItem.setAttributeNS(null, "style", "margin-bottom: 0px; background-image: 0;");
  _listItem.setAttributeNS(null, "id", "icon15__a revivableResultClickIcon");
  _listItem.setAttributeNS(null, "data-memberID", _memberID);

  var _svgElem = document.createElementNS(_xmlns, "svg");
  _svgElem.setAttributeNS(null, "viewbox", "0 0 16.4 14");
  _svgElem.setAttributeNS(null, "width", "15.4");
  _svgElem.setAttributeNS(null, "height", "13");

  var _path = document.createElementNS(_xmlns,"path");
  if (_revivable == true) {
    _titleText = "Revivable by you"
    _pathFillColor = "#74B816"
    _path.setAttributeNS(null, "d", _revivablePath);
  } else if (_revivable == false) {
    _titleText = "Not revivable by you"
    _pathFillColor = "#FA5252"
    _path.setAttributeNS(null, "d", _notRevivablepath);
  } else if (_revivable.toLowerCase() == "everyone") {
    _titleText = "Revives: Everyone"
    _pathFillColor = "#74B816"
    _path.setAttributeNS(null, "d",_revivablePath);
  } else if (_revivable.toLowerCase() == "no one") {
    _titleText = "Revives: No One"
    _pathFillColor = "#FA5252"
    _path.setAttributeNS(null, "d", _notRevivablepath);
  } else if (_revivable.toLowerCase().search("friends") >= 0) {
    _titleText = "Revives: Friends & Faction"
    _pathFillColor = "#f59f00"
    _path.setAttributeNS(null, "d", _friendsPath);
  }

  _listItem.setAttributeNS(null, "title", _titleText);
  _path.setAttributeNS(null, "fill", _pathFillColor);
  _svgElem.appendChild(_path);
  _listItem.appendChild(_svgElem);

  return _listItem;
}

function removeLinkFromLinksList() {
  if ( $("#topLinksReviveView").length > 0 ) {
    $("#topLinksReviveView").remove();
    return true;
  }
  return false;
}

async function addLinkToLinksList() {
  if ($("#topLinksReviveView").length > 0 ) {
    return;
  } else {
    $("#top-page-links-list").append(`<a id="topLinksReviveView" class="revive-icon t-clear h c-pointer line-h24 right last"><span class="icon-wrap svg-icon-wrap">
    <span class="link-icon-svg"><svg xmlns="http://www.w3.org/2000/svg" stroke="transparent" stroke-width="0" width="21" height="16" viewBox="0 1 16 16"><g><path d="m16.2,8.36c-.27.02-.52.18-.66.41l-1.07,1.98-1.32-3.8c-.09-.29-.36-.49-.66-.5-.3,0-.59.15-.74.41l-.91,2.15L9.43.59c-.08-.33-.41-.66-.74-.58-.35,0-.65.24-.74.58l-1.24,9.84-.99-5.29c-.06-.32-.33-.57-.66-.58-.32-.06-.63.11-.74.41l-1.65,3.47H0v1.49h3.06c.28,0,.54-.16.66-.41l.91-1.82,1.49,7.44c.09.34.4.57.74.58h0c.37-.01.69-.29.74-.66l1.24-9.67,1.07,6.36c.06.32.33.57.66.58.31.02.6-.14.74-.41l1.16-2.65,1.24,3.64c.09.29.36.49.66.5.3,0,.59-.15.74-.41l1.65-3.14h3.22v-1.49h-3.8Z"></path></g></svg>
      </span></span><span id="topLinksReviveViewSpan">Revive View</span></a>`);
    if (APIKey == null) {
      $("#topLinksReviveView").html("Provide an API key!")
    } else {
      $("#topLinksReviveView").off().on("click", function() {
        $("#topLinksReviveViewSpan").html("Refresh Revive View");
        removeExistingIcons();
        populateMemberList();
        parseMemberList();
      });
    }
  }
}

async function mainFunction() {
  await getAPIKey()
  removeExistingIcons();
  let pageURL = $(location).attr("href");
  if (await checkFactionPage(pageURL)) {
    addLinkToLinksList();
  } else {
    removeLinkFromLinksList();
  }
}

mainFunction();

$(window).on('hashchange', mainFunction);



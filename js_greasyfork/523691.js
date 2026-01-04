// ==UserScript==
// @name        [TORN] OC 2.0 Helper with OC Timer
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/*
// @version     4
// @author      callmericky [3299880] / whatdoesthespacebardo / zachwozn [2301700]
// @description Adds a list of members available for OC2.0, and adds a notifier to the sidebar if you are not in an OC.
// @require     http://code.jquery.com/jquery-3.6.0.min.js
// @grant       GM_registerMenuCommand
// @grant       GM.setValue
// @grant       GM.getValue
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/523691/%5BTORN%5D%20OC%2020%20Helper%20with%20OC%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/523691/%5BTORN%5D%20OC%2020%20Helper%20with%20OC%20Timer.meta.js
// ==/UserScript==

/*
 * All edits can be done from the dropdown menu from your userscript extension
 */

//IF DROPDOWN MENU DOESN'T WORK, MANUALLY ADD YOUR API KEY HERE
var APIKey = "";
const PDA_APIKey = "###PDA-APIKEY###"

//fix for tampermonkey
var $ = window.jQuery;

//STOP CHANGING THINGS FROM HERE
let memberInfo = {};
let pageURL = $(location).attr("href");
let totalMembers = 0;
let availableMembers = 0;
let activeMembers = 0;
let userInfo = {};
let crimeListUninitiated = []
let crimeListRecruiting = []
let crimeListPlanning = []
let crimeList = []
let myFactionInfo = null
let itemIDObj = {}
let containerMaxWidth = "784px"
let userSettings = {
  "sortType": "time-asc", //time-asc / time-desc / level-asc / level-desc
  "display": "compact" //compact / verbose
}

var OC2_timerID = null

var membersButtonShowText = (`&#9205;`) //⏵ &#9205;
var membersButtonHideText = (`&#9207;`) //⏷ &#9207;
if (isPDA()) {
  membersButtonShowText = (`&#9654;`) //▶ &#9654;
  membersButtonHideText = (`&#9660;`) //▼ &#9660;
}
const crimeButtonShowText = (`Show Crimes`)
const crimeButtonHideText = (`Hide Crimes`)
const settingsButtonAscText = (`&#9652;`) //▴ &#9652;
const settingsButtonDescText = (`&#9662;`) // ▾ &#9662;

let _isWindowNormal = window.matchMedia("(min-width: 785px)")
let _isWindowSmall = window.matchMedia("(max-width: 784px) and (min-width: 387px)")
let _isWindowTiny = window.matchMedia("(max-width: 386px)")

function getUserID() {
  let _profileLink = $(".settings-menu > .link > a")[0]
  let _matchregex = /profiles\.php.+XID=(\d+)/i
  let _userID = _matchregex.exec(_profileLink)
  userInfo.id = _userID[1]
  return _userID[1]
}

//GM_registerMenuCommand stuff
if (!isPDA()) {
  const menu_command_1 = GM_registerMenuCommand("Set API Key (Limited + faction access)", menuCommand_APIKey)
}

async function getAPIKey() {
  if (isPDA()) {
    APIKey = PDA_APIKey
    return PDA_APIKey
  } else {
    return await GM.getValue("CMR_OC2_APIKey", null)
      .then(function(data) {
        APIKey = data
        return data
      })
  }
}

async function menuCommand_APIKey(event) {
  await getAPIKey()
  let _userKey = window.prompt("OC 2.0 participation and notifier\n- Requires a minimal API key with faction access\n\nSet API Key:", APIKey)
  if (APIKey) {
    return
  }
  if ((APIKey == null || APIKey == "")) {
    if ((_userKey == null) || (_userKey == "")) {
      window.alert("OC 2.0 participation and notifier\nYou did not set an API Key - this script will not run")
    }
    GM.setValue("CMR_OC2_APIKey", _userKey)
  }
}

//boolean logic functions
function isPDA() {
  const PDATestRegex = !/^(###).+(###)$/.test(PDA_APIKey);
  return PDATestRegex;
}

function checkCrimesPage() {
  let pageURL = $(location).attr("href")
  return ((pageURL.search("step=your") >= 0) && (pageURL.search("tab=crimes") >= 0))
}

async function checkTravelFactionPage() {
  let pageURL = $(location).attr("href")
  if ( ($('body').attr("data-traveling") == "true") || ($('body').attr("data-traveling") == true) || ($('body').attr("data-abroad") == "true") || ($('body').attr("data-abroad") == true) ) {
    if (!myFactionInfo) {
        await getAndAnalyzeAPIData()
    }
    if (pageURL.search("ID="+myFactionInfo.id) >= 0) {
      return true;
    }
  }
  return false;
}

//API call functions
async function getAndAnalyzeAPIData() {
  await $.getJSON(`https://api.torn.com/v2/faction/basic,crimes,members?key=${APIKey}&cat=available&offset=0&striptags=true&comment=OC2-helper`)
    .then(data => {
      checkMembersInCrimes(data)
      myFactionInfo = data.basic
    })

}

async function getItemNamesFromID(_arrayOfIds) {
  return await $.getJSON(`https://api.torn.com/torn/${_arrayOfIds.toString()}?selections=items&key=${APIKey}&comment=OC2-helper`)
}

//calculations and conversions
async function convertItemIDArrayToItems() {
  let _arrayOfIDs = []
  let _matchregex = /\<\#(\d+)\>/i
  for (var _key of Object.keys(itemIDObj)) {
    _arrayOfIDs.push(_key)
  }
  await getItemNamesFromID(_arrayOfIDs)
    .then( (_data) => {
     for (var _itemID of Object.keys(_data.items)) {
       itemIDObj[_itemID].name = _data.items[_itemID].name
     }
  })
  for (let i = 0; i < $(".OC2-tableCrimeMemberItem:has(*)").length; i++) {
    let _oldTitle = $(".OC2-tableCrimeMemberItem:has(*)").eq(i).attr("title")
    let _regexResult = _matchregex.exec($(".OC2-tableCrimeMemberItem:has(*)").eq(i).attr("title"))
    let _newTitle = _oldTitle.replace(_matchregex, `${itemIDObj[_regexResult[1]].name} <$1>`)
    $(".OC2-tableCrimeMemberItem:has(*)").eq(i).attr("title", _newTitle)
  }
}

function timestampDiff(laterTimestamp) {
  var currentTimestamp = Math.floor(Date.now()/1000)
  var _returnString = ""
  var timeDiff = 0
  var _highlightClass = ""

  if (laterTimestamp > currentTimestamp) {
    timeDiff = laterTimestamp - currentTimestamp
  }

  if (timeDiff < 43200) { //12 hours = 12 * 60 * 60 = 43200
    _highlightClass = "OC2-highlightText"
  }

  let _d = timeDiff < 86400 ? 0 : Math.floor(timeDiff/86400)
  let _h = timeDiff < 3600 ? 0 : Math.floor(timeDiff/3600) - _d*24 //24h in 1d
  let _m = timeDiff < 60 ? 0 : Math.floor(timeDiff/60) - _h*60 - _d*1440 //60m in 1h, 1440m in 1d
  let _s = timeDiff - _m*60 - _h*3600 - _d*86400 //60s in 1m, 3600s in 1h, 86400s in 1d

  _returnString += `<span class="${_highlightClass}">${_d.toString().padStart(2,'0')}:${_h.toString().padStart(2,'0')}:${_m.toString().padStart(2,'0')}:${_s.toString().padStart(2,'0')}</span>`

  return _returnString
}

const timerTick = () => {
  let _timeList = $("span.OC2-countdown")
  for (let i = 0; i < _timeList.length; i++) {
    $(_timeList[i]).html(timestampDiff(parseInt($(_timeList[i]).attr("data-countdown"))))
  }
  OC2_timerID = setTimeout(timerTick, 1000)
  $(".OC2-highlightText").css({
    "color": "rgb(252, 196, 25)",
    "font-weight": "bold"
  })
  if ($("body").css("background-color") == "rgb(204, 204, 204)") {
    $(".OC2-highlightText").css({
      "color": "rgb(230, 119, 0)",
      "font-weight": "bold"
    })
  }
}

//the nitty gritty functions
function checkMembersInCrimes(_data) {
  //put all member ids into a list
  for (let i = 0; i < (_data.members).length; i++) {
    if (_data.members[i].status.state == "Fallen") {
      //skip fallen members
    } else if (_data.members[i].position == "Recruit") {
      //skip recruits since they can't join OC
    } else {
      memberInfo[_data.members[i].id] = {
        "name": _data.members[i].name,
        "last_action": _data.members[i].last_action.relative,
        "statusDesc": _data.members[i].status.description,
        "status": _data.members[i].status.state
      }
    }
  }
  totalMembers = (_data.members).length;
  activeMembers = 0 //if this doesn't reset, hashchange will cause the following part to re-fire and get activemembers count wrong.

  //go through crime list
  for (let i = 0; i < (_data.crimes).length; i++) {
    //sort members into objects
    //if crime is not initiated, it will be null for planning_at. No point looking for members because there won't be any.
    if (_data.crimes[i].planning_at) {
      for (let j=0; j<(_data.crimes[i].slots).length; j++) {
        if (_data.crimes[i].slots[j].user_id) {
          memberInfo[_data.crimes[i].slots[j].user_id].crimeInfo = {
            "crimeName": _data.crimes[i].name,
            "crimeDifficulty": _data.crimes[i].difficulty,
            "crimeId": _data.crimes[i].id,
            "crimePosition": _data.crimes[i].slots[j].position,
            "crimeSuccess": _data.crimes[i].slots[j].success_chance,
            "readyAt": _data.crimes[i].ready_at
          }
          activeMembers = activeMembers + 1;
          if ((_data.crimes[i].slots[j].user_id) == getUserID()) {
            userInfo = memberInfo[_data.crimes[i].slots[j].user_id]
          }
        }
      }
    }
    //sort crimes into arrays
    //crimes in recruiting include both crimes with members (has planning_at and with no members (don't have planning_at)
    if (_data.crimes[i].status == "Recruiting") {
      //get crimes with no members
      if (_data.crimes[i].planning_at == null) {
        crimeListUninitiated.push(_data.crimes[i])
      } else {
        crimeListRecruiting.push(_data.crimes[i])
      }
    }
    //crimes filled with members move to status = planning
    if (_data.crimes[i].status == "Planning") {
      crimeListPlanning.push(_data.crimes[i])
    }
  }

  availableMembers = totalMembers - activeMembers;
}

function sortCrimeInfo() {
  //remove all crime Lis
  $(".OC2-memberViewer li.OC2-crimeLi").not(".OC2-memberViewer li[class*='OC2-titleLi']").remove()
  $("li.OC2-crimeMemberLi").remove()
  if (userSettings.sortType == "level-asc") {
    crimeListUninitiated.sort( (a,b) => a.difficulty - b.difficulty)
    crimeListRecruiting.sort( (a,b) => a.difficulty - b.difficulty)
    crimeListPlanning.sort( (a,b) => a.difficulty - b.difficulty)
  } else if (userSettings.sortType == "level-desc") {
    crimeListUninitiated.sort( (a,b) => b.difficulty - a.difficulty)
    crimeListRecruiting.sort( (a,b) => b.difficulty - a.difficulty)
    crimeListPlanning.sort( (a,b) => b.difficulty - a.difficulty)
  } else if (userSettings.sortType == "time-desc") { //asc and desc are swapped around. I don't know why but it works. Some math thing. I need to think about it.
    crimeListUninitiated.sort( (a,b) => a.expired_at - b.expired_at)
    crimeListRecruiting.sort( (a,b) => a.ready_at - b.ready_at)
    crimeListPlanning.sort( (a,b) => a.ready_at - b.ready_at)
  } else if (userSettings.sortType == "time-asc") {
    crimeListUninitiated.sort( (a,b) => b.expired_at - a.expired_at)
    crimeListRecruiting.sort( (a,b) => b.ready_at - a.ready_at)
    crimeListPlanning.sort( (a,b) => b.ready_at - a.ready_at)
  }
}

function putMemberInfoIntoTable() {
  //fix for tornPDA, idk why but checking the li.tablecell works but checking the ul.table doesn't
  if ($(".OC2-memberTable .OC2-tableCell")[0]) {
    return
  }
  for (var _key of Object.keys(memberInfo)) {
    let _outputHTML = ""
    let _memberHighlight = "OC2-memberAvailable"
    if (_key == userInfo.id) {
      _memberHighlight += " OC2-userIndicator"
    }
    _outputHTML = (`<li class="table-cell ${_memberHighlight}">
        <div class="OC2-tableCell OC2-tableMember"><a href="https://www.torn.com/profiles.php?XID=${_key}">${memberInfo[_key].name}</a></div>
        <div class="OC2-tableCell OC2-tableStatus">${styleMemberStatus(memberInfo[_key].status,memberInfo[_key].statusDesc)}</div>
      </li>`)
    //put all the members currently in crimes below
    if (!(memberInfo[_key].crimeInfo)) {
      $(".OC2-memberTable li.OC2-titleLiAvailableMembers").after(_outputHTML)
    }
  }
  $(".OC2-memberTableFooter").not(".OC2-settingsFooter").text(`${availableMembers} / ${totalMembers} members available (${activeMembers} in an OC)`)

  sortCrimeInfo()
  putCrimeInfoIntoTable(crimeListUninitiated, $(".OC2-memberTable li.OC2-titleLiUninitiated").eq(0))
  putCrimeInfoIntoTable(crimeListRecruiting, $(".OC2-memberTable li.OC2-titleLiRecruiting").eq(0))
  putCrimeInfoIntoTable(crimeListPlanning, $(".OC2-memberTable li.OC2-titleLiPlanning").eq(0))

  convertItemIDArrayToItems()
  styleTable()
  if (OC2_timerID) {
    clearTimeout(OC2_timerID)
  }
  timerTick()
}

function putCrimeInfoIntoTable(_crimeArray, _afterElm) {
  let _countdownText = ""
  let _countdownToTimestamp = ""
  let _countdownMouseover = ""
  let _memberOutputHTML = ""
  let _userIndicatorClass = ""
  let _userIndicatorCrimeClass = ""
  if (_crimeArray.length > 0) {
    for (let i = 0; i < _crimeArray.length; i++) {
      //crimes in recruiting include both crimes with members (has planning_at) and with no members (don't have planning_at)
      if (_crimeArray[i].status == "Recruiting") {
        //get crimes with no members
        if (_crimeArray[i].planning_at == null) {
          _countdownText = "Expires: "
          _countdownToTimestamp = _crimeArray[i].expired_at
          _countdownMouseover = "Time until this crime is no longer be available"
        } else {
          _countdownText = "Join in:"
          _countdownToTimestamp = _crimeArray[i].ready_at
          _countdownMouseover = "Time until this crime needs a new member to join to continue planning"
        }
      }
      //crimes filled with members move to status = planning
      if (_crimeArray[i].status == "Planning") {
        _countdownText = "Ready in:"
        _countdownToTimestamp = _crimeArray[i].ready_at
        _countdownMouseover = "Time until this crime is ready to start"
      }

      _memberOutputHTML = ""
      _userIndicatorCrimeClass = ""
      let _memberCount = 0
      //count number of slots filled
      for (let j = 0; j < (_crimeArray[i].slots).length; j++) {
        let _crimeSlotMemberName = `<span class="OC2-textGray">&nbsp;&nbsp;&nbsp;&nbsp;N/A</span>`
        let _crimeSlotMemberID = ""
        let _crimeSlotMemberStatus = ""
        let _crimeSlotPosition = ""
        let _crimeItem = ""
        let _crimeItemMouseover = ""
        let _crimeItemIcon = (`&#128736;`) //🛠 &#128736;
        if (isPDA()) {
          _crimeItemIcon = (`&#9874;`) // ⚒ $#9874;
        }
        let _crimeSuccess = ""
        let _crimeSuccessWrapper = ""
        _userIndicatorClass = ""
        if (_crimeArray[i].slots[j].item_requirement) {
          if(!(_crimeArray[i].slots[j].item_requirement.id in itemIDObj)) {
              itemIDObj[_crimeArray[i].slots[j].item_requirement.id] = {
                "name": ""
              };
          }
          _crimeItemMouseover = (`Required item: <#${_crimeArray[i].slots[j].item_requirement.id}>`)
          if (_crimeArray[i].slots[j].item_requirement.is_reusable) {
            _crimeItemMouseover += (` (reusable)`)
            _crimeItemIcon += (`<span style="vertical-align:top">∞</span>`)
          }
          if (_crimeArray[i].slots[j].item_requirement.is_available) {
             _crimeItemMouseover += (`<br />Item is owned by member`)
          }
          _crimeItem = (`<span class="OC2-itemHave${_crimeArray[i].slots[j].item_requirement.is_available}">${_crimeItemIcon}</span>`)
        }
        if (_crimeArray[i].slots[j].user_id) {
          if (_crimeArray[i].slots[j].user_id == userInfo.id) {
            _userIndicatorClass = "OC2-userIndicator"
            _userIndicatorCrimeClass = "OC2-userIndicator"
          }
          _memberCount = _memberCount + 1
          _crimeSlotMemberName = `<a href="https://www.torn.com/profiles.php?XID=${_crimeArray[i].slots[j].user_id}">${memberInfo[_crimeArray[i].slots[j].user_id].name}</a>`
          _crimeSlotMemberStatus = styleMemberStatus(memberInfo[_crimeArray[i].slots[j].user_id].status, memberInfo[_crimeArray[i].slots[j].user_id].statusDesc)
          if (_crimeArray[i].slots[j].success_chance > 90) {
            _crimeSuccessWrapper = "OC2-highSuccess"
          } else if (_crimeArray[i].slots[j].success_chance > 50) {
            _crimeSuccessWrapper = "OC2-midSuccess"
          } else {
            _crimeSuccessWrapper = "OC2-lowSuccess"
          }
          _crimeSuccess = (`<span class="${_crimeSuccessWrapper}">${_crimeArray[i].slots[j].success_chance}</span>`)
        } else {
          _crimeSuccess = (`<span class="OC2-textGray">-</span>`)
        }
        _memberOutputHTML += (`<li class="table-cell OC2-crimeMemberLi OC2-crimeID_${_crimeArray[i].id} ${_userIndicatorClass}">
          <div class="OC2-tableCell OC2-tableCrimeMemberSuccess">${_crimeSuccess}</div>
          <div class="OC2-tableCell OC2-tableCrimeMemberItem" title="${_crimeItemMouseover}" >${_crimeItem}</div>
          <div class="OC2-tableCell OC2-hideSmall OC2-tableCrimePosition">${_crimeArray[i].slots[j].position}</div>
          <div class="OC2-tableCell OC2-tableCrimeMemberName">${_crimeSlotMemberName}</div>
          <div class="OC2-tableCell OC2-tableCrimeMemberStatus">${_crimeSlotMemberStatus}</div>
        </li>`)
      }
      let _outputHTML = (`<li class="table-cell OC2-crimeLi OC2-crimeID_${_crimeArray[i].id} ${_userIndicatorCrimeClass}">
        <div class="OC2-tableCell OC2-tableCrimeMemberCount OC2-crimeID_${_crimeArray[i].id}">${_memberCount} / ${(_crimeArray[i].slots).length} <span class="hideMembersButton">${membersButtonShowText}</span></div>
        <div class="OC2-tableCell OC2-tableCrime"><a href="https://www.torn.com/factions.php?step=your&type=12#/tab=crimes&crimeId=${_crimeArray[i].id}">Lv${_crimeArray[i].difficulty} ${_crimeArray[i].name}</a></div>
        <div class="OC2-tableCell OC2-tableCountdown OC2-crimeID_${_crimeArray[i].id}" title="${_countdownMouseover}"><span class="OC2-countdownText OC2-hideSmall">${_countdownText}</span> <span class="OC2-countdown" data-countdown="${_countdownToTimestamp}">${_countdownToTimestamp}</span></div>
      </li>`)
      _afterElm.after(_outputHTML)
      $("li.OC2-crimeID_"+_crimeArray[i].id).after(_memberOutputHTML)
      $("div.OC2-crimeID_"+_crimeArray[i].id).off().on("click", (event) => {
        toggleMemberView(((event.currentTarget.attributes.class.value).split("OC2-crimeID_"))[1])
        if ($(event.currentTarget).parent(".OC2-crimeLi").hasClass("OC2-crimeLiActive")) {
          $(event.currentTarget).parent(".OC2-crimeLi.OC2-crimeLiActive").removeClass("OC2-crimeLiActive")
        } else {
          $(event.currentTarget).parent(".OC2-crimeLi").not(".OC2-crimeLiActive").addClass("OC2-crimeLiActive")
        }
        styleCrimeLiActive()
      }).css({"cursor": "pointer"})
    }
  } else {
    _afterElm.after(`<li class="table-cell OC2-crimeLi"><div class="OC2-tableCell OC2-tableCrime">None</div></li>`)
  }
}

//templating functions
async function generateInsertHTML() {
  let _insertHTML = (`
  <div class="category-wrap OC2-memberViewer m-top10">
    <div class="title-black top-round t-overflow">OC 2.0 Overview <span class="hideCrimesButton">${crimeButtonShowText}</span></div>
    <div class="cont-gray OC2-memberTable"><ul class="table-body">
      <li class="table-cell OC2-availableMembers OC2-titleLiAvailableMembers"><div class="OC2-titleCell OC2-fancyBg">Members not in an OC</div></li>
      <li class="table-cell OC2-crimeLi OC2-titleLiCrimeSeciton"><div class="OC2-titleCell OC2-fancyBg">Crimes<div class="OC2-sortType">Sort: <div id="sortLevelButton">level</div><div id="sortTimeButton">time</div></div></div></li>
      <li class="table-cell OC2-crimeLi OC2-titleLiUninitiated"><div class="OC2-titleCell">Uninitiated Crimes</div></li>
      <li class="table-cell OC2-crimeLi OC2-horizLine"></li>
      <li class="table-cell OC2-crimeLi OC2-titleLiRecruiting"><div class="OC2-titleCell">Recruiting Crimes</div></li>
      <li class="table-cell OC2-crimeLi OC2-horizLine"></li>
      <li class="table-cell OC2-crimeLi OC2-titleLiPlanning"><div class="OC2-titleCell">Full Crimes</div></li>
    </ul></div>
    <div class="OC2-memberTableFooter"></div>
  </div>`)
  //what to do in normal crimes2.0 page
  if (checkCrimesPage()) {
    $("div#faction-crimes").before(_insertHTML)
    putMemberInfoIntoTable()
    styleTable()
    $(".hideCrimesButton").off().on("click", event => {
      toggleCrimeView()
    })
    $(".OC2-sortType div").off().on("click", event => {
      resortCrimeTable(event.currentTarget)
    })
    $(".OC2-crimeMemberLi").hide();
    $(".OC2-crimeLi").hide();
  } else //this "else" is important to like the two if statements. Without it, it won't load on the faction -> crimes OC page because the second if statement takes precidence due to await
  //what to do if traveling AND on faction page
  if (await checkTravelFactionPage()) {
    waitForElm('div#react-root').then((elm) => {
      $(elm).before(_insertHTML)
      putMemberInfoIntoTable()
      styleTable()
      $(".hideCrimesButton").off().on("click", event => {
        toggleCrimeView()
      })
      $(".OC2-sortType div").off().on("click", event => {
        resortCrimeTable(event.currentTarget)
      })
      $(".OC2-crimeMemberLi").hide();
      $(".OC2-crimeLi").hide();
      })
  }
}

function insertOCNotifier() {
  let _userNotice = (`<a href="https://www.torn.com/factions.php?step=your#/tab=crimes"><span class="OC2-redtext">No active OC.</span></a>`)
  if (userInfo.crimeInfo) {
    _userNotice = (`<a href="https://www.torn.com/factions.php?step=your&type=5#/tab=crimes&crimeId=${userInfo.crimeInfo.crimeId}"><span class="OC2-countdown" data-countdown="${userInfo.crimeInfo.readyAt}"></span> <span class="OC2-normaltext">(Lv ${userInfo.crimeInfo.crimeDifficulty})</a></span> `)
  }
  let _insertHTML = (`<div class="OC2-sidebarNotice"><a href="https://www.torn.com/factions.php?step=your#/tab=crimes"><span style="font-weight: bold">OC 2.0:</span></a>
    ${_userNotice}
  </div>`)
  $('div[class^="sidebar_"] div[class^="user-information_"] div[class^="toggle-block_"] div[class^="toggle-content_"] div[class^="content_"]').append(_insertHTML)
   timerTick()
  styleOCNotifier()
}

//on click functions
function toggleCrimeView() {
  if ($(".hideCrimesButton").hasClass("text-hide")) {
    $(".hideCrimesButton").html(crimeButtonShowText)
    $(".hideCrimesButton").removeClass("text-hide")
    $(".OC2-crimeLi").slideUp()
  } else {
    $(".hideCrimesButton").html(crimeButtonHideText)
    $(".hideCrimesButton").addClass("text-hide")
    $(".OC2-crimeLi").slideDown()
  }
  $(".hideMembersButton").html(membersButtonShowText)
  $(".hideMembersButton").removeClass("text-hide")
  $(".OC2-crimeMemberLi").hide()
  $(".OC2-crimeLi.OC2-crimeLiActive").removeClass("OC2-crimeLiActive")
  styleCrimeLiActive()
}

function toggleMemberView(_crimeID) {
  if ($(".OC2-crimeID_"+_crimeID+" .hideMembersButton").hasClass("text-hide")) {
    $(".OC2-crimeID_"+_crimeID+" .hideMembersButton").html(membersButtonShowText)
    $(".OC2-crimeID_"+_crimeID+" .hideMembersButton").removeClass("text-hide")
    $(".OC2-crimeMemberLi.OC2-crimeID_"+_crimeID).slideUp()
  } else {
    $(".OC2-crimeID_"+_crimeID+" .hideMembersButton").html(membersButtonHideText)
    $(".OC2-crimeID_"+_crimeID+" .hideMembersButton").addClass("text-hide")
    $(".OC2-crimeMemberLi.OC2-crimeID_"+_crimeID).slideDown()
  }
}

//<div class="OC2-sortType">Sort: <span id="sortLevelButton">level</span><span id="sortTimeButton">time</span></div>
function resortCrimeTable(_target) {
  $(".OC2-sortType div").removeClass("text-underline")
  $(".OC2-sortType div#sortLevelButton").html("level")
  $(".OC2-sortType div#sortTimeButton").html("time")
  $(_target).addClass("text-underline")
  if ($(_target).attr("id") == "sortLevelButton") {
    if (userSettings.sortType == "level-asc") {
      userSettings.sortType = "level-desc"
      $(_target).html(`level${settingsButtonAscText}`)
    } else {
      userSettings.sortType = "level-asc"
      $(_target).html(`level${settingsButtonDescText}`)
    }
  }
  if ($(_target).attr("id") == "sortTimeButton") {
    if (userSettings.sortType == "time-asc") {
      userSettings.sortType = "time-desc"
      $(_target).html(`time${settingsButtonDescText}`)
    } else {
      userSettings.sortType = "time-asc"
      $(_target).html(`time${settingsButtonAscText}`)
    }
  }
  sortCrimeInfo()
  putCrimeInfoIntoTable(crimeListUninitiated, $(".OC2-memberTable li.OC2-titleLiUninitiated").eq(0))
  putCrimeInfoIntoTable(crimeListRecruiting, $(".OC2-memberTable li.OC2-titleLiRecruiting").eq(0))
  putCrimeInfoIntoTable(crimeListPlanning, $(".OC2-memberTable li.OC2-titleLiPlanning").eq(0))
  convertItemIDArrayToItems()
  styleTable()
  timerTick()
  $("li.OC2-crimeLi .hideMembersButton").removeClass("text-hide")
  $("li.OC2-crimeMemberLi").hide()
}

//prettifying functions
function styleCrimeLiActive() {
  $(".OC2-crimeLi.OC2-crimeLiActive").not(".OC2-userIndicator").css({
    "background-color": "rgba(150,150,150,0.2)"
  })
  $(".OC2-crimeLi").not(".OC2-crimeLiActive").not(".OC2-userIndicator").css({
    "background-color": "transparent"
  })
  if ($("#dark-mode-state").prop("checked")) {
    $(".OC2-crimeLi.OC2-crimeLiActive").not(".OC2-userIndicator").css({
      "background-color": "rgba(0,0,0,0.3)"
    })
  }
}

function styleMemberStatus(_statusState, _statusDesc) {
  let _outputText = ""
  let _country = ""
  return (`<span title="${_statusDesc}" class="OC2-statusText ${_statusState.toLowerCase()}">${_statusState}</span><span title="${_statusDesc}" class="OC2-statusText OC2-hideSmall ${_statusState.toLowerCase()}">${_statusDesc}</span>`)
}

function styleTable() {
  /* notes to self
 * Small: 386px
 * Tiny: 320px
 * Normal: 784px
 */
  //set colours for light/dark mode styling
  let colorObj = {
    "link": {
      "darkmode": "rgb(116, 192, 252)",
      "lightmode": "#006699"
    },
    "recolor": {
      "green": {
        "darkmode": "rgb(130, 201, 30)",
        "lightmode": "rgb(92, 148, 13)"
      },
      "yellow": {
        "darkmode": "rgb(252, 196, 25)",
        "lightmode": "rgb(230, 119, 0)"
      },
      "red": {
        "darkmode": "rgb(255, 135, 135)",
        "lightmode": "rgb(255, 121, 76)"
      },
      "blue": {
        "darkmode": "rgb(59, 201, 219)",
        "lightmode": "rgb(12, 133, 153)"
      }
    },
    "userindicatorbg": {
      "darkmode": "rgb(63, 68, 45)",
      "lightmode": "rgb(238, 241, 228)"
    },
    "footerbg": {
      "darkmode": "rgb(51, 51, 51)",
      "lightmode": "rgb(242, 242, 242)"
    },
    "crimeselectbg": {
      "darkmode": "rgba(0,0,0,0.2)",
      "lightmode": "rgba(150,150,150,0.1)"
    },
    "fancyBg": {
      "darkmode": "inherit",
      "lightmode": "#fff"
    }

  }
  let colorDisplayMode = $("#dark-mode-state").prop("checked") ? "darkmode" : "lightmode"

  $(".OC2-memberTable ul.table-body").css({
    "display": "flex",
    "flex-direction": "row",
    "flex-wrap": "wrap"
  })
  $(".OC2-memberTable a").css({
    "color": colorObj.link[colorDisplayMode],
    "text-decoration": "none"
  })
  $(".OC2-memberTable a").hover(
    function() {
      $(this).css({
         "text-decoration": "underline"
      })
    },
    function() {
      $(this).css({
        "text-decoration": "none"
      })
    })
  $(".OC2-memberTable div.OC2-tableCrimeMemberName a").css({
    "color": "inherit",
  })
  $(".OC2-memberTable div.OC2-tableMember a").css({
    "color": "inherit",
  })
  $(".OC2-memberTable li.table-cell").css({
    "display": "flex",
    "flex-direction": "row",
  })
  $(".OC2-memberTable li.OC2-memberAvailable").css({
    "font-weight": "normal",
  })
  $(".OC2-memberTable .OC2-textGray").css({
    "color": "rgb(153, 153, 153)",
  })
  $(".OC2-memberTable div").css({
    "font-size": "11px",
    "line-height": "12px",
    "padding": "5px 0"
  })
  $(".OC2-memberTable div.OC2-titleCell").css({
    "display": "inline",
    "font-family": "Fjalla One",
    "padding-left": "10px",
    "width": containerMaxWidth,
    "box-sizing": "border-box",
  })
  $(".OC2-memberTable div.OC2-titleCell.OC2-fancyBg").css({
    "background": "repeating-linear-gradient(90deg, #2e2e2e, #2e2e2e 2px, #282828 0, #282828 4px)",
    "color": colorObj.fancyBg[colorDisplayMode]
  })
  $(".OC2-horizLine").css({
    "border-bottom": "1px solid rgb(34,34,34)",
    "width": containerMaxWidth,
    "box-sizing": "border-box",
    "height": "3px",
  })
  $(".OC2-memberTable div.OC2-tableMember").css({
    "width": "150px",
  })
  $(".OC2-memberTable div.OC2-tableStatus").css({
    "width": "220px",
    "text-align": "left"
  })
  //compact mode - COMING SOON
  $(".OC2-memberTable div.OC2-tableMember.compact").css({
    "width": "150px",
  })
  $(".OC2-memberTable div.OC2-tableStatus.compact").css({
    "width": "150px",
    "text-align": "center"
  })
  $(".OC2-statusText.okay").css({
    "color": colorObj.recolor.green[colorDisplayMode]
  })
  $(".OC2-statusText.abroad, .OC2-statusText.traveling").css({
    "color": colorObj.recolor.blue[colorDisplayMode]
  })
  $(".OC2-statusText.hospital").css({
    "color": colorObj.recolor.red[colorDisplayMode]
  })
  $(".OC2-statusText.jail").css({
    "color": colorObj.recolor.red[colorDisplayMode]
  })
  $(".OC2-memberTable div.OC2-tableStatus img").css({
    "height": "11px"
  })
  $(".OC2-memberTable div.OC2-tableCrimeMemberCount").css({
    "width": "50px",
  })
  $(".OC2-memberTable div.OC2-tableCrimePosition").css({
    "width": "100px",
    "font-size": "10px",
  })
  $(".OC2-memberTable div.OC2-tableCrimeMemberName").css({
    "width": "230px",
  })
  $(".OC2-memberTable div.OC2-tableCrimeMemberStatus").css({
    "width": "auto",
  })
  $(".OC2-memberTable div.OC2-tableCrimeMemberSuccess").css({
    "width": "25px",
    "text-align": "center"
  })
  $(".OC2-memberTable div.OC2-tableCrimeMemberItem").css({
    "width": "40px",
    "text-align": "center"
  })
  $(".OC2-memberTable .OC2-tableCrimeMemberSuccess .OC2-highSuccess").css({
    "color": colorObj.recolor.green[colorDisplayMode]
  })
  $(".OC2-memberTable .OC2-tableCrimeMemberSuccess .OC2-midSuccess").css({
    "color": colorObj.recolor.yellow[colorDisplayMode]
  })
  $(".OC2-memberTable .OC2-tableCrimeMemberSuccess .OC2-lowSuccess").css({
    "color": colorObj.recolor.red[colorDisplayMode]
  })
  $(".OC2-memberTable .OC2-itemHavetrue").css({
    "color": colorObj.recolor.green[colorDisplayMode]
  })
  $(".OC2-memberTable .OC2-itemHavefalse").css({
    "color": colorObj.recolor.red[colorDisplayMode]
  })
  $(".OC2-memberTable div.OC2-tableCrime").css({
    "width": "335px",
  })
  $(".OC2-memberTable div.OC2-tableCountdown").css({
    "width": "auto"
  })
  $(".OC2-memberTableFooter").css({
    "border-radius": "0 0 5px 5px",
    "background-color": colorObj.footerbg[colorDisplayMode],
    "padding": "5px 5px 5px 10px",
    "text-align": "center"
  })
  $(".hideCrimesButton").css({
    "position": "absolute",
    "right": "10px",
    "cursor": "pointer"
  })
  $(".OC2-memberTable li.OC2-memberAvailable").css({
    "padding-left": "20px"
  })
  $(".OC2-memberTable li.OC2-crimeMemberLi").css({
    "padding-left": "25px",
    "background-color": colorObj.crimeselectbg[colorDisplayMode],
    "width": containerMaxWidth
  })
  $(".OC2-memberTable li.OC2-crimeLi").not(".OC2-memberTable li[class*='OC2-titleLi']").css({
    "padding-left": "20px",
    "width": containerMaxWidth
  })
  $(".OC2-crimeLi").prev(".OC2-crimeMemberLi").css({
    "border-radius": "0 0 15px 15px"
  })
  $(".OC2-sortType").css({
    "display": "inline",
    "padding-left": parseInt(containerMaxWidth) - 150 + "px",
  })
  $(".OC2-sortType div").css({
    "display": "inline-block",
    "font-family": "Arial",
    "padding": "0 0 0 5px",
    "width": "35px"
  })
  $(".OC2-memberTable .OC2-sortType div").css({
    "text-decoration": "none"
  })
  $(".OC2-memberTable .OC2-sortType div.text-underline").css({
    "text-decoration": "underline"
  })
  $(".OC2-userIndicator").css({
    "background-color": colorObj.userindicatorbg[colorDisplayMode]
  })
  if (_isWindowTiny.matches) {
    styleTableTinyScreen()
  } else if (_isWindowSmall.matches) {
    styleTableSmallScreen()
  } else {
    styleTableBigScreen()
  }
  if (($(".OC2-crimeMemberLi").last().next()).length < 1) {
    $(".OC2-crimeMemberLi").last().css({
      "border-radius": "0 0 15px 15px",
    })
  }
}

function styleTableSmallScreen() {
  //console.log("Smallscreen!")
  //total row length: 386
  //margins: 20px <item> 10px
  //OC2-tableMember 260px
  $(".OC2-memberTable li.OC2-memberAvailable").css({
    "padding-left": "15px"
  })
  $(".OC2-hideSmall").css({
    "display": "none"
  })
  $(".OC2-memberTable div.OC2-tableStatus").css({
    "width": "55px",
    "text-align": "left"
  })
  $(".OC2-memberTable div.OC2-tableMember").css({
    "width": "120px",
  })
  $(".OC2-memberTable div.OC2-tableCrime").css({
    "width": "210px",
  })
  $(".OC2-memberTable div.OC2-tableCrimeMemberName").css({
    "width": "220px",
  })
  $(".OC2-statusText").not(".OC2-hideSmall").css({
    "display": ""
  })
  $(".OC2-memberTable div.OC2-tableCrimePosition").css({
    "width": "70px",
    "font-size": "10px",
  })
  $(".OC2-memberTable div.OC2-tableCrimeMemberName").css({
    "width": "220px",
  })
  $(".OC2-memberTable div.OC2-tableCrimeMemberStatus").css({
    "width": "90px",
    "text-align": "left"
  })
  $(".OC2-memberTable div.OC2-tableCrimeMemberSuccess").css({
    "width": "18px",
    "text-align": "center"
  })
  $(".OC2-memberTable div.OC2-tableCrimeMemberItem").css({
    "width": "30px",
    "text-align": "center"
  })
}

function styleTableTinyScreen() {
  //console.log("Tinyscreen!")
  $(".OC2-memberTable li.OC2-crimeLi").not(".OC2-memberTable li[class*='OC2-titleLi']").css({
    "padding-left": "15px",
    "width": containerMaxWidth
  })
  $(".OC2-hideSmall").css({
    "display": "none"
  })
  $(".OC2-tableCrimeMemberCount").css({
    "width": "40px"
  })
  $(".OC2-memberTable div.OC2-tableStatus").css({
    "width": "90px",
    "text-align": "left"
  })
  $(".OC2-memberTable div.OC2-tableCrime").css({
    "width": "190px",
  })
  $(".OC2-memberTable div.OC2-tableCrimeMemberName").css({
    "width": "165px",
  })
  $(".OC2-statusText").not(".OC2-hideSmall").css({
    "display": ""
  })
  $(".OC2-memberTable li.OC2-crimeMemberLi").css({
    "padding-left": "18px",
  })
    $(".OC2-memberTable li.OC2-memberAvailable").css({
    "padding-left": "12px"
  })
  $(".OC2-memberTable li.OC2-crimeLi").not(".OC2-memberTable li[class*='OC2-titleLi']").css({
    "padding-left": "12px"
  })
}

function styleTableBigScreen() {
  $(".OC2-hideSmall").css({
    "display": ""
  })
  $(".OC2-statusText").not(".OC2-hideSmall").css({
    "display": "none"
  })
}

function styleOCNotifier() {
  $(".OC2-sidebarNotice a").css({
    "text-decoration": "none",
    "color": "inherit"
  })
  $(".OC2-sidebarNotice .OC2-redtext").css({
    "text-decoration": "none",
    "color": "rgb(255, 121, 76)"
  })
}


//main functions
/* if page is the crimes 2.0 page
 *  -> if memberViewer table does NOT exist, get data and fill table
 *  -> otherwise, show the table
 * -> otherwise, hide the table
 */
async function hashChangeFunction() {
  if (checkCrimesPage()) {
    if (!$(".OC2-memberViewer")[0]) {
      if (!myFactionInfo) {
        await getAndAnalyzeAPIData()
      }
      generateInsertHTML();
    } else {
      $(".OC2-memberViewer").show()
    }
  } else {
    if ($(".OC2-memberViewer")[0]) {
      $(".OC2-memberViewer").hide();
    }
  }
}

async function runOnceFunction() {
  //exit if API key doesn't exist
  await getAPIKey()
    .then(function(data) {
    if (APIKey == null || APIKey == "") {
      return;
    }
  })
  //sidebar notifier, but not if the sidebar doesn't exist
  if (($("div[class*='sidebar_'][class*='desktop_']")[0]) && (!isPDA())) {
    await getAndAnalyzeAPIData()
    insertOCNotifier()
  }
  //insert member overview
  if (checkCrimesPage() || await checkTravelFactionPage()) {
    if (!$(".OC2-memberViewer .OC2-tableCell")[0]) {
      if (!myFactionInfo) {
        await getAndAnalyzeAPIData()
      }
      generateInsertHTML()
    } else {
      $(".OC2-memberViewer").show()
    }
  }
}

//taken from stackoverflow https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists because mutation observer confuses me
//needed because the faction page info only loads after the document is ready
function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });
        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function checkWindowWidth() {
  if (_isWindowNormal.matches) {
    containerMaxWidth = "784px"
  } else if (_isWindowSmall.matches) {
    containerMaxWidth = "386px"
  } else if (_isWindowTiny.matches) {
    containerMaxWidth = "320px"
  }
  if (!isPDA()) {
    styleTable()
  }
}

_isWindowNormal.addEventListener("change", function() {
  checkWindowWidth()
});
_isWindowSmall.addEventListener("change", function() {
  checkWindowWidth()
});
_isWindowTiny.addEventListener("change", function() {
  checkWindowWidth()
});

checkWindowWidth()
runOnceFunction()
$(window).on('hashchange', hashChangeFunction)

$("#dark-mode-state").on('change', styleTable)

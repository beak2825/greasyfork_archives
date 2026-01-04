// ==UserScript==
// @name        [TORN] OC 2.0 Helper
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/*
// @version     5.3.0
// @author      callmericky [3299880] / whatdoesthespacebardo
// @description Gives an overview of OC 2.0, showing members not in crimes, members in each crime, and if there are issues with any crimes. Visible when flying.
// @require     http://code.jquery.com/jquery-3.6.0.min.js
// @connect     tornprobability.com
// @connect     tornprobability.com:3000
// @grant       GM_registerMenuCommand
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.xmlHttpRequest
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/522974/%5BTORN%5D%20OC%2020%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/522974/%5BTORN%5D%20OC%2020%20Helper.meta.js
// ==/UserScript==

//IF DROPDOWN MENU DOESN'T WORK, MANUALLY ADD YOUR API KEY HERE
var APIKey = "";
const PDA_APIKey = "###PDA-APIKEY###"

/*
 * STOP CHANGING THINGS FROM HERE
 */

//fix for tampermonkey
var $ = window.jQuery;

//fix for tornPDA
const XHR = GM.xmlHttpRequest || GM.xmlhttpRequest;

let memberInfo = {};
let pageURL = $(location).attr("href");
let totalMembers = 0;
let availableMembers = 0;
let soonAvailableMembers = 0;
let soonAvailableMembersList = []
let activeMembers = 0;
let userInfo = {};
let crimeListUninitiated = []
let crimeListRecruiting = []
let crimeListPlanning = []
let crimeIDListUninitiated = []
let crimeIDListRecruiting = []
let crimeIDListFull = []
let crimeList = []
let availMemberList = []
let myAPIData = null
let itemIDObj = {}
let containerMaxWidth = "784px"
let containerBigMaxWidth = "976px"
let userSettings = {}
let displayIgnoreList = []
let skippedMemberCount = 0
let skippedMemberList = []
let availableCrimeSlots = {}
let availableCrimeSlotsCount = 0
let tornProbabilityAvailableScenarios = []
let calculatedSuccessChanceObj = {}
let alreadyGotItemKeys = false

var OC2_timerID = null

const crimeListShowText = (`[ Show all ]`)
const crimeListHideText = (`[ Hide all ]`)
const crimeButtonShowText = (`Show Crimes`)
const crimeButtonHideText = (`Hide Crimes`)
const lazyMembersButtonShowText = (`Show Members`)
const lazyMembersButtonHideText = (`Hide Members`)
const settingsButtonAscText = (`&#9652;`) //▴ &#9652;
const settingsButtonDescText = (`&#9662;`) // ▾ &#9662;
var crimeItemIcon = (`&#128736;`) //🛠 &#128736;
if (isPDA()) {
  crimeItemIcon = (`&#9874;`) // ⚒ $#9874;
}
const defaultUserSettings = {
  "memberShow": "member-show",
  "crimesShow": "crimes-hide",
  "sortType": "time-asc", //time-asc / time-desc / level-asc / level-desc
  "memberSort": "OC-desc", //OC-asc / OC-desc / active-asc / active-desc
  "lastOC_yellow": 24,
  "lastOC_red": 48,
  "lastActivity": 96,
  "memberIgnoreList": [],
  "showSidebarOC": "sidebar-show",
  "showNegativeTimes": "negative-timer-hide",
  "warnMissingItems": "warn-items-show",
  "warnLowSuccess": "warn-success-show",
  "warnLowSuccessPercentage": 50,
  "showProgressPercentage": "progress-show",
  "showSelfSuccessRate": "self-success-show",
  "showAllenoneScript": "torn-probability-show",
  "memberDirectionality": "row-column", // row-column / column-row
}

let _isWindowNormal = window.matchMedia("(min-width: 1000px)")
let _isWindowSmallish = window.matchMedia("(min-width: 785px)")
let _isWindowSmall = window.matchMedia("(max-width: 784px) and (min-width: 387px)")
let _isWindowTiny = window.matchMedia("(max-width: 386px)")

let colorObj = {
  "normal_font": {
    "darkmode": "rgb(221, 221, 221)",
    "lightmode": "rgb(51, 51, 51)"
  },
  "dark_bg_link": {
    "darkmode": "rgb(116, 192, 252)",
    "lightmode": "rgb(116, 192, 252)"
  },
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
      "lightmode": "rgb(199, 139, 7)"
    },
    "red": {
      "darkmode": "rgb(255, 135, 135)",
      "lightmode": "rgb(224, 49, 49)"
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
  },
  "crimeIcon": {
    "default": {
      "lightmode": "rgba(100, 100, 100, 0.5)",
      "darkmode": "rgba(221, 221, 221, 0.5)"
    },
    "highlightYellow": {
      "lightmode": "rgb(230, 180, 0)",
      "darkmode": "rgba(252, 196, 25, 0.8)"
    },
    "highlightRed": {
      "lightmode": "rgba(255, 135, 135, 1)",
      "darkmode": "rgba(255, 135, 135, 0.8)"
    },
    "highlightVeryRed": {
      "lightmode": "rgba(200, 33, 33, 1)",
      "darkmode": "rgba(200, 33, 33, 1)"
    }
  },
  "buttons": {
    "background": {
      "lightmode": "linear-gradient(rgb(255, 255, 255) 0%, rgb(221, 221, 221) 100%)",
      "darkmode": "linear-gradient(rgb(85, 85, 85) 0%, rgb(51, 51, 51) 100%)"
    },
    "textcolor": {
      "lightmode": "rgb(102, 102, 102)",
      "darkmode": "rgb(221, 221, 221)"
    },
    "hovercolor": {
      "lightmode": "rgb(200,200,200)",
      "darkmode": "rgb(28,28,28)"
    }
  }
}
let colorDisplayMode = $("body#body").hasClass("dark-mode") ? "darkmode" : "lightmode"

var membersButtonShowText = (`<svg width="8px" height="8px" viewBox="1 1 13 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><polygon class="OC2-triangle" points="13,8 5,16 5,0" fill="${colorObj.normal_font[colorDisplayMode]}" /></svg>`) //⏵ &#9205; <svg width="11px" height="11x" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><rect width="16" height="16" id="icon-bound" fill="none" /><polygon points="13,8 5,16 5,0" /></svg>
var membersButtonHideText = (`<svg width="8px" height="8px" viewBox="1 1 13 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><polygon class="OC2-triangle" points="8,13 0,5 16,5" fill="${colorObj.normal_font[colorDisplayMode]}" /></svg>`) //⏷ &#9207;
var moreInfoHover = (`<svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="${colorObj.link[colorDisplayMode]}" stroke-width="2"/><path d="M12 7H12.01" stroke="${colorObj.link[colorDisplayMode]}" stroke-width="2" stroke-linecap="round"/><path d="M10 11H12V16" stroke="${colorObj.link[colorDisplayMode]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 16H14" stroke="${colorObj.link[colorDisplayMode]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`)

function getUserID() {
  let _profileLink = $(".settings-menu > .link > a")[0]
  let _matchregex = /profiles\.php.+XID=(\d+)/i
  let _userID = _matchregex.exec(_profileLink)
  userInfo.id = _userID[1]
  return _userID[1]
}

//user settings functions
if (!isPDA()) {
  const menu_command_1 = GM_registerMenuCommand("Open Settings Page", showSettingsPage)
}

function showSettingsPage() {
  window.open("https://www.torn.com/OC2_Settings_Page", "_blank")
}

async function getAPIKey() {
  if (isPDA()) {
    APIKey = PDA_APIKey
    return PDA_APIKey
  } else if (APIKey != null && APIKey.length > 0) {
    return APIKey
  } else {
    return await GM.getValue("CMR_OC2_APIKey", null)
      .then(function(data) {
        APIKey = data
        return data
      })
  }
}

async function setUserSettings(_settings) {
  if (!_settings) {
    return
  }
  if (isPDA()) {
    localStorage.setItem("CMR_OC2_userSettings", JSON.stringify(_settings))
    if ( $("#OC2-APIInput").val().length > 5 && $("#OC2-APITestResult-Final").hasClass("color-green") ) {
      localStorage.setItem("CMR_OC2_APIKey", $("#OC2-APIInput").val())
    }
    return
  } else {
    await GM.setValue("CMR_OC2_userSettings", JSON.stringify(_settings))
  }
  if ( $("#OC2-APIInput").val().length > 5 && $("#OC2-APITestResult-Final").hasClass("color-green") ) {
    await GM.setValue("CMR_OC2_APIKey", $("#OC2-APIInput").val())
  }
}

async function getUserSettings(event) {
  if (isPDA()) {
    if (!localStorage.getItem("CMR_OC2_userSettings")) {
      userSettings = defaultUserSettings
    } else {
      userSettings = JSON.parse(localStorage.getItem("CMR_OC2_userSettings"))
    }
    return
  }
  return await GM.getValue("CMR_OC2_userSettings", JSON.stringify(defaultUserSettings))
    .then( (data) => {
      userSettings = JSON.parse(data)
    })
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
    if (!myAPIData) {
      try {
        let _successfulGetAPIData = await getAndAnalyzeAPIData()
        if (_successfulGetAPIData.error) {
          $(".OC2-memberTable").hide()
          $(".OC2-memberTableErrorDisplay").html(`<span style="margin-left: 20px">Error occured: ${_successfulGetAPIData.error.error}. Please visit the <a href="https://www.torn.com/OC2_Settings_Page" target="_new" style="color: inherit; font-weight: bold; text-decoration: underline">Settings Page</a> to set up an API key</span>`)
          $(".OC2-memberTableErrorDisplay").show()
          return _successfulGetAPIData.error
        }
      } catch(_err) {
          return false
      }
    }
    if (pageURL.search("ID="+myAPIData.basic.id) >= 0) {
      return true;
    }
  }
  return false;
}

//API call functions
async function getAndAnalyzeAPIData() {
  console.log("OC 2.0 Overview Script: Sending API request to get OC 2.0 crime data")
  return await $.ajax({
    dataType: "json",
    url: (`https://api.torn.com/v2/faction/basic,crimes,members?cat=available,completed&offset=0&striptags=true&comment=OC2-helper`),
    headers: {
      Authorization: (`ApiKey ${APIKey}`)
    }
  }).done( data => {
    if (data.error) {
      return data
    }
    checkMembersInCrimes(data)
    myAPIData = data
    return data
  }).fail( (error) => {
    return error
  })
}

async function getItemNamesFromID(_arrayOfIds) {
  console.log("OC 2.0 Overview Script: Sending API request to get item ID names")
  return await $.getJSON(`https://api.torn.com/torn/${_arrayOfIds.toString()}?selections=items&key=${APIKey}&comment=OC2-helper`)
}

async function getTornProbabilityCrimeSuccess(_scenarioName, _successRates, _crimeID) {
  let _payload = {
    "scenario": _scenarioName,
    "parameters": _successRates
  }
  return await XHR({
    method: "POST",
    responseType: "json",
    headers:    {
        "Content-Type": "application/json"
    },
    timeout: 5000,
    url: "https://tornprobability.com:3000/api/CalculateSuccess",
    data: JSON.stringify(_payload),
    onload: function(response) {
      try {
        if (response.status >= 200 && response.status < 300) {
          calculatedSuccessChanceObj[_crimeID] = (response.response.successChance*100).toFixed(2)
          let _crimeLi_originalHTML = $("li.OC2-crimeLi.OC2-crimeID_" + _crimeID + " div.OC2-tableCrime").html()
          $("li.OC2-crimeLi.OC2-crimeID_" + _crimeID + " div.OC2-tableCrime").html(_crimeLi_originalHTML + `&nbsp;&nbsp;${(response.response.successChance*100).toFixed(2)}%`)
          alreadyGotItemKeys = true
          return (response.response);
        } else {
          return (new Error(response.error || 'Problem with API endpoint tornprobability.com - try again later'))
        }
      } catch (err) {
        return err
      }
    },
    onerror: (err) => {return err},
    ontimeout: (err) => {return err}
  });
}

async function getTornProbabilitySupportedScenarios() {
  return await XHR({
    method: "GET",
    responseType: "json",
    timeout: 5000,
    url: "https://tornprobability.com:3000/api/GetSupportedScenarios",
    onload: function(response) {
      try {
        if (response.status >= 200 && response.status < 300) {
          for (let i = 0; i < response.response.length; i++) {
            tornProbabilityAvailableScenarios.push(response.response[i].name)
          }
          return response.response;
        } else {
          return (new Error(response.error || 'Problem with API endpoint tornprobability.com - try again later'))
        }
      } catch (err) {
        return err
      }
    },
    onerror: (err) => {return err},
    ontimeout: (err) => {return err}
  });
}

//calculations and conversions
async function convertItemIDArrayToItems() {
  let _arrayOfIDs = []
  let _matchregex = /<\#(\d+)>/i
  for (var _key of Object.keys(itemIDObj)) {
    _arrayOfIDs.push(_key)
  }
  if (alreadyGotItemKeys == false) {
    await getItemNamesFromID(_arrayOfIDs)
      .then( (_data) => {
      for (var _itemID of Object.keys(_data.items)) {
        itemIDObj[_itemID].name = _data.items[_itemID].name
      }
    })
  }
  for (let i = 0; i < $(".OC2-tableCrimeMemberItem:has(*)").length; i++) {
    let _oldTitle = $(".OC2-tableCrimeMemberItem:has(*)").eq(i).attr("title")
    let _regexResult = _matchregex.exec($(".OC2-tableCrimeMemberItem:has(*)").eq(i).attr("title"))
    let _newTitle = _oldTitle.replace(_matchregex, `${itemIDObj[_regexResult[1]].name} <$1>`)
    $(".OC2-tableCrimeMemberItem:has(*)").eq(i).attr("title", _newTitle)
  }
  //this needs more IFs to prevent errors, since the item ID may exist but the span with the warning does not exist
  for (let i = 0; i < $(".OC2-crimeMouseoverWarning").length; i++) {
    let _oldTitle = $(".OC2-crimeMouseoverWarning").eq(i).attr("title")
    if (_oldTitle) {
      let _regexResult = _matchregex.exec($(".OC2-crimeMouseoverWarning").eq(i).attr("title"))
      if (_regexResult) {
        let _newTitle = _oldTitle.replace(_matchregex, `${itemIDObj[_regexResult[1]].name} <$1>`)
        $(".OC2-crimeMouseoverWarning").eq(i).attr("title", _newTitle)
      }
    }
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

  if ((laterTimestamp < currentTimestamp) && userSettings?.showNegativeTimes == "negative-timer-show" ) {
    timeDiff = currentTimestamp - laterTimestamp
    _highlightClass = "OC2-highlightRed"
  }

  let _d = timeDiff < 86400 ? 0 : Math.floor(timeDiff/86400)
  let _h = timeDiff < 3600 ? 0 : Math.floor(timeDiff/3600) - _d*24 //24h in 1d
  let _m = timeDiff < 60 ? 0 : Math.floor(timeDiff/60) - _h*60 - _d*1440 //60m in 1h, 1440m in 1d
  let _s = timeDiff - _m*60 - _h*3600 - _d*86400 //60s in 1m, 3600s in 1h, 86400s in 1d

  _returnString += `<span class="${_highlightClass}">${_d.toString().padStart(2,'0')}:${_h.toString().padStart(2,'0')}:${_m.toString().padStart(2,'0')}:${_s.toString().padStart(2,'0')}</span>`

  return _returnString
}

function stringifyTimestampOld(_timeDiff) {
  var currentTimestamp = Math.floor(Date.now()/1000)
  var _returnString = ""
  var _highlightClass = ""

  if (_timeDiff == -1) {
    return (`User has not joined the last ${myAPIData.crimes.length} OCs`)
  }

  let _d = _timeDiff < 86400 ? 0 : Math.floor(_timeDiff/86400)
  let _h = _timeDiff < 3600 ? 0 : Math.floor(_timeDiff/3600) - _d*24 //24h in 1d
  let _m = _timeDiff < 60 ? 0 : Math.floor(_timeDiff/60) - _h*60 - _d*1440 //60m in 1h, 1440m in 1d
  let _s = _timeDiff - _m*60 - _h*3600 - _d*86400 //60s in 1m, 3600s in 1h, 86400s in 1d

  if (_d > 0) {
    _returnString += (`${_d.toString().padStart(1,'0')}d `)
  }
  if (_d > 0 || _h > 0) {
    _returnString += (`${_h.toString().padStart(2,'0')}h `)
  }
  if (_d > 0 || _h > 0 || _m > 0) {
    _returnString += (`${_m.toString().padStart(2,'0')}m `)
  }
  _returnString += (`ago`)

  return _returnString
}

function timestampOldDiff(olderTimestamp) {
  var currentTimestamp = Math.floor(Date.now()/1000)
  if (olderTimestamp == 0) {
    return -1
  }
  return currentTimestamp - olderTimestamp //time since last OC in seconds
}


const timerTick = () => {
  let _timeList = $("span.OC2-countdown")
  for (let i = 0; i < _timeList.length; i++) {
    $(_timeList[i]).html(timestampDiff(parseInt($(_timeList[i]).attr("data-countdown"))))
  }
  OC2_timerID = setTimeout(timerTick, 1000)
  $(".OC2-highlightText").css({
    "color": colorObj.recolor.yellow[colorDisplayMode],
    "font-weight": "bold"
  })
  $(".OC2-highlightRed").css({
    "color": colorObj.recolor.red[colorDisplayMode],
    "font-weight": "bold"
  })
}

//the nitty gritty functions
function checkMembersInCrimes(_data) {
  //put all member ids into a list
  let fallenMemberCount = 0
  for (let i = 0; i < (_data.members).length; i++) {
    if (_data.members[i].status.state == "Fallen") {
      fallenMemberCount += 1;
      //skip fallen members
    } else if (_data.members[i].position == "Recruit") {
      //skip recruits since they can't join OC
      skippedMemberCount += 1;
      skippedMemberList.push({
        "id": _data.members[i].id,
        "name": _data.members[i].name
      })
    } else {
      memberInfo[_data.members[i].id] = {
        "id": _data.members[i].id,
        "name": _data.members[i].name,
        "last_action": _data.members[i].last_action,
        "statusDesc": _data.members[i].status.description,
        "status": _data.members[i].status.state,
        "lastCrime": 0
      }
      if (userSettings.memberIgnoreList.includes((_data.members[i].id).toString())) {
        //remember to subtract ignored members
        skippedMemberCount += 1;
      }
    }
  }
  totalMembers = (_data.members).length - skippedMemberCount - fallenMemberCount;
  activeMembers = 0 //if this doesn't reset, hashchange will cause the following part to re-fire and get activemembers count wrong.

  //go through crime list
  for (let i = 0; i < (_data.crimes).length; i++) {
    if (_data.crimes[i].status == 'Expired') {
      continue; //skip all expired crimes
    }

    //sort members into objects
    if ((_data.crimes[i].status == 'Successful' || _data.crimes[i].status == 'Failure')) { //for crimes that were complete, put that crime's info to member's last crime completed section
      for (let j=0; j<(_data.crimes[i].slots).length; j++) {
        //skip slots that are empty
        if (_data.crimes[i].slots[j].user) {
          //ignore members that left the faction
          if (!memberInfo[_data.crimes[i].slots[j].user.id]) {
            continue
          }
          let _lastCrimeTime = _data.crimes[i].ready_at
          if (_data.crimes[i].executed_at) { //take into account executed at, for crimes that were stalled
            _lastCrimeTime = _data.crimes[i].executed_at
          }
          if (memberInfo[_data.crimes[i].slots[j].user.id].lastCrime < _lastCrimeTime) { //make sure that the lastCrime in the memberInfo is the latest crime so far
            memberInfo[_data.crimes[i].slots[j].user.id].lastCrime = _lastCrimeTime
          }
        }
      }
    }
    if ((_data.crimes[i].status == 'Recruiting' || _data.crimes[i].status == 'Planning')) {
      if (_data.crimes[i].planning_at) { //if crime is not initiated, it will be null for planning_at. No point looking for members because there won't be any.
        for (let k=0; k<(_data.crimes[i].slots).length; k++) {
          if (_data.crimes[i].slots[k].user) {
           //ignore members that left the faction
            if (!memberInfo[_data.crimes[i].slots[k].user.id]) {
              continue
            }
            memberInfo[_data.crimes[i].slots[k].user.id].crimeInfo = {
              "crimeName": _data.crimes[i].name,
              "crimeDifficulty": _data.crimes[i].difficulty,
              "crimeId": _data.crimes[i].id,
              "crimePosition": _data.crimes[i].slots[k].position,
              "crimeSuccess": _data.crimes[i].slots[k].checkpoint_pass_rate,
              "crimeProgress": _data.crimes[i].slots[k].user.progress
            }
            activeMembers = activeMembers + 1;
            //if the crime is almost done AND it is in the planning stage, add member count to soonAvailableMembers
            if ((_data.crimes[i].ready_at < (Math.floor(Date.now()/1000)+60*60*24) ) && (_data.crimes[i].status == 'Planning')) {
                soonAvailableMembers = soonAvailableMembers + 1;
                soonAvailableMembersList.push(_data.crimes[i].slots[k].user.id)
            }
            //if this is the user, then store info for later use
            if ((_data.crimes[i].slots[k].user.id) == getUserID()) {
              userInfo = memberInfo[_data.crimes[i].slots[k].user.id]
              userInfo.crimeInfo.crimeTime = _data.crimes[i].ready_at
            }
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
  if (userSettings.sortType == "level-desc") {
    crimeListUninitiated.sort( (a,b) => a.difficulty - b.difficulty)
    crimeListRecruiting.sort( (a,b) => a.difficulty - b.difficulty)
    crimeListPlanning.sort( (a,b) => a.difficulty - b.difficulty)
  } else if (userSettings.sortType == "level-asc") {
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

function sortAvailMembers() {
  $("li.OC2-memberAvailable").remove()
  if (userSettings.memberSort == "OC-asc") {
    availMemberList.sort( (a,b) => b.lastCrime - a.lastCrime )
  }
  if (userSettings.memberSort == "OC-desc") {
    availMemberList.sort( (a,b) => a.lastCrime - b.lastCrime )
  }
  if (userSettings.memberSort == "active-asc") {
    availMemberList.sort( (a,b) => a.last_action.timestamp - b.last_action.timestamp )
  }
  if (userSettings.memberSort == "active-desc") {
    availMemberList.sort( (a,b) => b.last_action.timestamp - a.last_action.timestamp )
  }
}

function arrangeMemberDirectionality() {
  //sort available members
  if (userSettings.memberDirectionality == "column-row" && !_isWindowTiny.matches) {
    let availMemberElms = $(".OC2-memberTable li.OC2-memberAvailable")
    let _internalCount = 0;
    for (let i = 1; i < availMemberElms.length + 1; i++) {
      if (i < (availMemberElms.length / 2) + 1) {
        _internalCount = _internalCount + 1
        $(availMemberElms[i-1]).css("order", _internalCount*2-1)
      } else {
        if (_internalCount >= (availMemberElms.length / 2)) {
          _internalCount = 0;
        }
        _internalCount = _internalCount + 1;
        $(availMemberElms[i-1]).css("order", _internalCount*2)
      }
    }
  }
}


function putAvailMembersIntoTable(_memberArray, _afterElm) {
  if (_memberArray.length < 1) {
    return //don't do anything if there are no members
  }
  let _ignoreTitleText = ""
  let _skipTitleText = ""
  if (skippedMemberList.length > 0) {
    _skipTitleText = "Recruits unavailable for OCs:"
    skippedMemberList.forEach( (_skippedMemberName) => {
      _skipTitleText += (`<br />${_skippedMemberName.name} [${_skippedMemberName.id}]`)
    })
  }
  _memberArray.forEach( (_member) => {
    if (userSettings.memberIgnoreList) {
      if (userSettings.memberIgnoreList.includes((_member.id).toString())) {
        if (_ignoreTitleText == "") {
          _ignoreTitleText = "<br />Ignored members:"
        }
        _ignoreTitleText += `<br />${_member.name} [${_member.id}]`
        return //skip member to be ignored
      }
    }
    let _outputHTML = ""
    let _memberHighlight = "OC2-memberAvailable"
    let _memberInactiveTitle = `Last Action: ${_member.last_action.relative}`
    let _memberCrimeFill = colorObj.crimeIcon.default[colorDisplayMode]
    let _memberNameColor = ""
    if (_member.id == userInfo.id) {
      _memberHighlight += " OC2-userIndicator"
    }
    if (_member.lastCrime == 0) { //user is not found in the crimes obtained from the API
      _memberCrimeFill = colorObj.crimeIcon.highlightVeryRed[colorDisplayMode]
    }
    if (timestampOldDiff(_member.lastCrime) > parseInt(userSettings.lastOC_yellow) * 60 * 60) {
      _memberCrimeFill = colorObj.crimeIcon.highlightYellow[colorDisplayMode]
    }
    if (timestampOldDiff(_member.lastCrime) > parseInt(userSettings.lastOC_red) * 60 * 60) {
      _memberCrimeFill = colorObj.crimeIcon.highlightRed[colorDisplayMode]
    }
    if ( (Math.floor(Date.now()/1000) - _member.last_action.timestamp) > parseInt(userSettings.lastActivity) * 60 * 60) {
      _memberNameColor = "inactive"
    }
    if ( (_member.status).toLowerCase() == "federal" ) {
      _memberNameColor = "federal"
    }
    let _lastCrimeIcon = (`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="11" height="11" viewBox="0 0 30 40"><path fill="${_memberCrimeFill} "d="M397,168c-7.573,0-15,5.76-15,13.333,0,4.589,3.375,10.129,6.512,14.524a10.05,10.05,0,0,1,16.935-.067c3.22-4.457,6.553-9.865,6.553-14.457C412,173.76,404.573,168,397,168Zm-5.83,18.333a4.166,4.166,0,1,1,4.167-4.166A4.167,4.167,0,0,1,391.17,186.333Zm11.667,0A4.166,4.166,0,1,1,407,182.167,4.166,4.166,0,0,1,402.837,186.333ZM397,194.52a6.74,6.74,0,1,0,6.74,6.74A6.741,6.741,0,0,0,397,194.52Zm1.752,2.458a1.07,1.07,0,1,1-1.07,1.07A1.071,1.071,0,0,1,398.752,196.978Zm-3.574,0a1.07,1.07,0,1,1-1.068,1.07A1.071,1.071,0,0,1,395.178,196.978Zm-1.918,5.35a1.07,1.07,0,1,1,1.07-1.07A1.071,1.071,0,0,1,393.26,202.328Zm1.918,3.212a1.069,1.069,0,1,1,1.07-1.07A1.07,1.07,0,0,1,395.178,205.54Zm.752-4.28a1.07,1.07,0,1,1,1.07,1.07A1.071,1.071,0,0,1,395.93,201.26Zm2.822,4.28a1.069,1.069,0,1,1,1.07-1.07A1.071,1.071,0,0,1,398.752,205.54Zm1.988-3.212a1.07,1.07,0,1,1,1.07-1.07A1.069,1.069,0,0,1,400.74,202.328Z" transform="translate(-382 -168)"></path></svg>`)
    _outputHTML = (`<li class="table-cell ${_memberHighlight}">
        <div class="OC2-tableCell OC2-tableMember" title="${_member.name} [${_member.id}]<br />Last OC joined: ${stringifyTimestampOld(timestampOldDiff(_member.lastCrime))}<br />${_memberInactiveTitle}">
          <div class="OC2-tableLastCrime OC2-lazyCountup" data-countup="${timestampOldDiff(_member.lastCrime)}"><span>${_lastCrimeIcon}</span></div>
          <a href="https://www.torn.com/profiles.php?XID=${_member.id}"><span class="OC2-memberName ${_memberNameColor}">${_member.name}</span><span class="screen-reader-hidden">: Last OC joined: ${stringifyTimestampOld(timestampOldDiff(_member.lastCrime))}: ${_memberInactiveTitle}</span></a>
        </div>
        <div class="OC2-tableCell OC2-tableStatus"><span class="screen-reader-hidden">Status:</span>${styleMemberStatus(_member.status,_member.statusDesc)}</div>
      </li>`)
    _afterElm.after(_outputHTML)
  })
  let _ignoreText = (``)
  if (userSettings.memberIgnoreList.length > 0) {
    _ignoreText = (`(${userSettings.memberIgnoreList.length} ignored)`)
  }
  $(".OC2-memberTableFooter").not(".OC2-settingsFooter").html(`<div class="OC2-memberTableFooterFlex"><div title="${_skipTitleText}">${availableMembers} members available ${_ignoreText}</div><div class="OC2-footerSoonAvailableMembers">+${soonAvailableMembers} available within 24h</div><div class="OC2-footerCrimeSlots">[calculating crime slots...]</div></div>`)
  $(".OC2-memberTableFooter div.OC2-memberTableFooterFlex").css({
    "display": "flex",
    "flex-wrap": "wrap",
    "flex-direction": "row",
    "flex-flow": "space-evenly"
  })
  $(".OC2-memberTableFooter div div").css({
    "padding": "2px 5px",
    "flex-grow": 1,
  })
}

function calculateCrimeSlots() {
  //add crime slot count to table
  let _availableCrimeSlotTitleText = "All crime slots are occupied by members"
  if (availableCrimeSlotsCount > 0) {
    _availableCrimeSlotTitleText = (`<span style="font-weight: bold">Available slots:</span><br />`)
    for (const [_slotLevel,_slotCount] of Object.entries(availableCrimeSlots)) {
      _availableCrimeSlotTitleText = _availableCrimeSlotTitleText + `Lvl ${_slotLevel} x ${_slotCount}<br />`
    }
  }
  $(".OC2-footerCrimeSlots").attr('title', _availableCrimeSlotTitleText)
  $(".OC2-footerCrimeSlots").html(`${availableCrimeSlotsCount} crime slots available`)
}

function calculateSoonAvailMembers() {
  //add mouseover title for members nearing completion
  let _soonAvailableMembersTitleText = ""
  if (soonAvailableMembers > 0) {
    _soonAvailableMembersTitleText = (`<span style="font-weight: bold">OCs finishing soon:</span><br />`)
    let _soonAvailableMemberCRObj = {}
    for (let n = 0; n < soonAvailableMembersList.length; n++) {
      _soonAvailableMemberCRObj[memberInfo[soonAvailableMembersList[n]].crimeInfo.crimeDifficulty] = (_soonAvailableMemberCRObj[memberInfo[soonAvailableMembersList[n]].crimeInfo.crimeDifficulty] || 0) + 1
      //_soonAvailableMembersTitleText = _soonAvailableMembersTitleText + (`Lvl ${memberInfo[soonAvailableMembersList[n]].crimeInfo.crimeDifficulty} (${memberInfo[soonAvailableMembersList[n]].crimeInfo.crimeSuccess}%): ${memberInfo[soonAvailableMembersList[n]].name}<br />`)
    }
    for (const [_slotLevel,_slotCount] of Object.entries(_soonAvailableMemberCRObj)) {
      _soonAvailableMembersTitleText = _soonAvailableMembersTitleText + `Lvl ${_slotLevel} x ${_slotCount} members<br />`
    }
  }
  $(".OC2-footerSoonAvailableMembers").attr('title', _soonAvailableMembersTitleText)
}

function putMemberInfoIntoTable() {
  //fix for tornPDA, idk why but checking the li.tablecell works but checking the ul.table doesn't
  if ($(".OC2-memberTable .OC2-tableCell")[0]) {
    return
  }
  availMemberList = []
  for (var _key of Object.keys(memberInfo)) {
    if (memberInfo[_key].crimeInfo) {
      continue //skip all members in crimes
    }
    availMemberList.push(memberInfo[_key])
  }
  sortAvailMembers()
  putAvailMembersIntoTable(availMemberList, $(".OC2-memberTable li.OC2-titleLiAvailableMembers"))
  sortCrimeInfo()
  putCrimeInfoIntoTable(crimeListUninitiated, $(".OC2-memberTable li.OC2-titleLiUninitiated").eq(0))
  putCrimeInfoIntoTable(crimeListRecruiting, $(".OC2-memberTable li.OC2-titleLiRecruiting").eq(0))
  putCrimeInfoIntoTable(crimeListPlanning, $(".OC2-memberTable li.OC2-titleLiPlanning").eq(0))

  $(".OC2-hideAtStart").css({
    "display": ""
  })

  $("#OC2-titleUninitiated > span.toggleCatCrimesButton").on("click", (event) => {
    if ((event.currentTarget.attributes.class.value).includes("OC2-crimeListExpand")) {
      //expanded, shut all
      $(event.currentTarget).removeClass("OC2-crimeListExpand")
      $(event.currentTarget).html(crimeListShowText)
      crimeIDListUninitiated.forEach(function(item) {
        $("li.OC2-crimeLi.OC2-crimeID_"+item).removeClass("OC2-crimeLiActive")
        $(".OC2-crimeID_"+item+" .hideMembersButton").html(membersButtonShowText)
        $(".OC2-crimeID_"+item+" .hideMembersButton").removeClass("text-hide")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).removeClass("crimeMemberLiShow")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).slideUp()
      })
    } else {
      //shut, expand all
      $(event.currentTarget).addClass("OC2-crimeListExpand")
      $(event.currentTarget).html(crimeListHideText)
      crimeIDListUninitiated.forEach(function(item) {
        $("li.OC2-crimeLi.OC2-crimeID_"+item).addClass("OC2-crimeLiActive")
        $(".OC2-crimeID_"+item+" .hideMembersButton").html(membersButtonHideText)
        $(".OC2-crimeID_"+item+" .hideMembersButton").addClass("text-hide")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).addClass("crimeMemberLiShow")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).slideDown()
      })
    }
    styleCrimeLiActive()
  })

  $("#OC2-titleRecruiting > span.toggleCatCrimesButton").on("click", (event) => {
    if ((event.currentTarget.attributes.class.value).includes("OC2-crimeListExpand")) {
      //expanded, shut all
      $(event.currentTarget).removeClass("OC2-crimeListExpand")
      $(event.currentTarget).html(crimeListShowText)
      crimeIDListRecruiting.forEach(function(item) {
        $("li.OC2-crimeLi.OC2-crimeID_"+item).removeClass("OC2-crimeLiActive")
        $(".OC2-crimeID_"+item+" .hideMembersButton").html(membersButtonShowText)
        $(".OC2-crimeID_"+item+" .hideMembersButton").removeClass("text-hide")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).removeClass("crimeMemberLiShow")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).slideUp()
      })
    } else {
      //shut, expand all
      $(event.currentTarget).addClass("OC2-crimeListExpand")
      $(event.currentTarget).html(crimeListHideText)
      crimeIDListRecruiting.forEach(function(item) {
        $("li.OC2-crimeLi.OC2-crimeID_"+item).addClass("OC2-crimeLiActive")
        $(".OC2-crimeID_"+item+" .hideMembersButton").html(membersButtonHideText)
        $(".OC2-crimeID_"+item+" .hideMembersButton").addClass("text-hide")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).addClass("crimeMemberLiShow")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).slideDown()
      })
    }
    styleCrimeLiActive()
  })

  $("#OC2-titleFull > span.toggleCatCrimesButton").on("click", (event) => {
    if ((event.currentTarget.attributes.class.value).includes("OC2-crimeListExpand")) {
      //expanded, shut all
      $(event.currentTarget).removeClass("OC2-crimeListExpand")
      $(event.currentTarget).html(crimeListShowText)
      crimeIDListFull.forEach(function(item) {
        $("li.OC2-crimeLi.OC2-crimeID_"+item).removeClass("OC2-crimeLiActive")
        $(".OC2-crimeID_"+item+" .hideMembersButton").html(membersButtonShowText)
        $(".OC2-crimeID_"+item+" .hideMembersButton").removeClass("text-hide")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).removeClass("crimeMemberLiShow")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).slideUp()
      })
    } else {
      //shut, expand all
      $(event.currentTarget).addClass("OC2-crimeListExpand")
      $(event.currentTarget).html(crimeListHideText)
      crimeIDListFull.forEach(function(item) {
        $("li.OC2-crimeLi.OC2-crimeID_"+item).addClass("OC2-crimeLiActive")
        $(".OC2-crimeID_"+item+" .hideMembersButton").html(membersButtonHideText)
        $(".OC2-crimeID_"+item+" .hideMembersButton").addClass("text-hide")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).addClass("crimeMemberLiShow")
        $(".OC2-crimeMemberLi.OC2-crimeID_"+item).slideDown()
      })
    }
    styleCrimeLiActive()
  })

  convertItemIDArrayToItems()
  styleTable()
  arrangeMemberDirectionality()
  calculateCrimeSlots()
  calculateSoonAvailMembers()
  checkDefaultHideState()
  if (OC2_timerID) {
    clearTimeout(OC2_timerID)
  }
  timerTick()
}

async function putCrimeInfoIntoTable(_crimeArray, _afterElm) {
  let _countdownText = ""
  let _countdownToTimestamp = ""
  let _countdownMouseover = ""
  let _memberOutputHTML = ""
  let _userIndicatorClass = ""
  let _userIndicatorCrimeClass = ""
  let _crimeListType = ""
  if (_crimeArray.length > 0) {
    for (let i = 0; i < _crimeArray.length; i++) {
      //crimes in recruiting include both crimes with members (has planning_at) and with no members (don't have planning_at)
      if (_crimeArray[i].status == "Recruiting") {
        //get crimes with no members
        if (_crimeArray[i].planning_at == null) {
          _countdownText = ((_isWindowSmall.matches) || (_isWindowTiny.matches)) ? "E:" : "Expires: "
          _countdownToTimestamp = _crimeArray[i].expired_at
          _countdownMouseover = "Time until this crime is no longer be available"
          _crimeListType = "OC2-crimeUninitiated"
          crimeIDListUninitiated.push(_crimeArray[i].id)
        } else {
          _countdownText = ((_isWindowSmall.matches) || (_isWindowTiny.matches)) ? "J:" : "Join in: "
          _countdownToTimestamp = _crimeArray[i].ready_at
          _countdownMouseover = "Time until this crime needs a new member to join to continue planning"
          _crimeListType = "OC2-crimeRecruiting"
          crimeIDListRecruiting.push(_crimeArray[i].id)
          if ((_countdownToTimestamp < Math.floor(Date.now()/1000)) && (userSettings?.showNegativeTimes == "negative-timer-show")) {
            _countdownText = ((_isWindowSmall.matches) || (_isWindowTiny.matches)) ? "D:" : "Delay:"
          _countdownMouseover = "Delay in planning due to lack of members joining"
        }
        }
      }
      //crimes filled with members move to status = planning
      if (_crimeArray[i].status == "Planning") {
        _countdownText = ((_isWindowSmall.matches) || (_isWindowTiny.matches)) ? "R:" : "Ready in: "
        _countdownToTimestamp = _crimeArray[i].ready_at
        _countdownMouseover = "Time until this crime is ready to start"
        _crimeListType = "OC2-crimeFull"
        crimeIDListFull.push(_crimeArray[i].id)
        if ((_countdownToTimestamp < Math.floor(Date.now()/1000)) && (userSettings?.showNegativeTimes == "negative-timer-show")) {
          _countdownText = ((_isWindowSmall.matches) || (_isWindowTiny.matches)) ? "D:" :"Delay: "
          _countdownMouseover = "Delay since crime should have started due to members not being available"
        }
      }

      _memberOutputHTML = ""
      _userIndicatorCrimeClass = ""
      let _memberCount = 0
      let _crimeWarningIcon = ""
      let _crimeWarningMouseover = ""
      let _warningSuccessChance = ""
      let _warningItemNeeded = ""
      let _crimeSlotPositionArray = []
      let _crimeSuccessRateList = []
      //count number of slots filled
      for (let j = 0; j < (_crimeArray[i].slots).length; j++) {
        let _crimeSlotMemberName = `<span class="OC2-textGray">&nbsp;&nbsp;&nbsp;&nbsp;N/A</span>`
        let _crimeSlotMemberID = ""
        let _crimeSlotMemberStatus = ""
        let _crimeSlotPosition = ""
        let _crimeItem = ""
        let _crimeItemIconDisplay = crimeItemIcon
        let _crimeItemMouseover = ""
        let _crimeSuccess = ""
        let _crimeSuccessWrapper = ""
        let _crimeProgressString = ""
        _userIndicatorClass = ""

        //collect all success rates into an array if the crime status is planning
        if (_crimeArray[i].status == "Planning") {
          _crimeSuccessRateList.push(_crimeArray[i].slots[j].checkpoint_pass_rate)
        }
        _crimeSlotPositionArray.push(_crimeArray[i].slots[j].position)
        if (_crimeArray[i].slots[j].item_requirement) {
          if(!(_crimeArray[i].slots[j].item_requirement.id in itemIDObj)) {
              itemIDObj[_crimeArray[i].slots[j].item_requirement.id] = {
                "name": ""
              };
          }
          _crimeItemMouseover = (`Required item: <#${_crimeArray[i].slots[j].item_requirement.id}>`)
          if (_crimeArray[i].slots[j].item_requirement.is_reusable) {
            _crimeItemMouseover += (` (reusable)`)
            _crimeItemIconDisplay += (`<span style="vertical-align:top">∞</span>`)
          }
          if (_crimeArray[i].slots[j].item_requirement.is_available) {
             _crimeItemMouseover += (`<br />Item is owned by member`)
          }
          _crimeItem = (`<span class="OC2-itemHave${_crimeArray[i].slots[j].item_requirement.is_available}">${_crimeItemIconDisplay}</span>`)
        }
        if (_crimeArray[i].slots[j].user) {
          if (_crimeArray[i].slots[j].user.id == userInfo.id) {
            _userIndicatorClass = "OC2-userIndicator"
            _userIndicatorCrimeClass = "OC2-userIndicator"
          }
          _memberCount = _memberCount + 1
          if (userSettings?.showProgressPercentage == "progress-show") {
            _crimeProgressString = (`<span style="font-size: 9px">${memberInfo[_crimeArray[i].slots[j].user.id].crimeInfo.crimeProgress}%</span>`)
          }
          _crimeSlotMemberName = `<a href="https://www.torn.com/profiles.php?XID=${_crimeArray[i].slots[j].user.id}">${memberInfo[_crimeArray[i].slots[j].user.id].name}</a> ${_crimeProgressString} `
          _crimeSlotMemberStatus = styleMemberStatus(memberInfo[_crimeArray[i].slots[j].user.id].status, memberInfo[_crimeArray[i].slots[j].user.id].statusDesc)
          if (_crimeArray[i].slots[j].checkpoint_pass_rate > 75) {
            _crimeSuccessWrapper = "OC2-highSuccess"
          } else if (_crimeArray[i].slots[j].checkpoint_pass_rate > 50) {
            _crimeSuccessWrapper = "OC2-midSuccess"
          } else {
            _crimeSuccessWrapper = "OC2-lowSuccess"
          }
          if (_crimeArray[i].slots[j].checkpoint_pass_rate < ((userSettings?.warnLowSuccessPercentage) ? userSettings.warnLowSuccessPercentage : 50)) {
            _crimeSuccessWrapper = "OC2-lowSuccess"
          }
          _crimeSuccess = (`<span class="${_crimeSuccessWrapper}">${_crimeArray[i].slots[j].checkpoint_pass_rate}</span>`)
          if (_crimeArray[i].slots[j].checkpoint_pass_rate < userSettings?.warnLowSuccessPercentage) {
            if (_warningSuccessChance.length < 1) {
              _warningSuccessChance = (`Low Success Chance:<br />`)
            } else {
              _warningSuccessChance += "<br />"
            }
            _warningSuccessChance += `&nbsp;${_crimeArray[i].slots[j].checkpoint_pass_rate}% - ${memberInfo[_crimeArray[i].slots[j].user.id].name}`
          }
          if (_crimeArray[i].slots[j].item_requirement?.is_available == false) { //item is not available for member
            if (_warningItemNeeded.length < 1) {
              _warningItemNeeded = (`Item Missing:<br />`)
            } else {
              _warningItemNeeded += "<br />"
            }
            _warningItemNeeded += `&nbsp;<#${_crimeArray[i].slots[j].item_requirement.id}> - ${memberInfo[_crimeArray[i].slots[j].user.id].name}<br />`
          }
        } else {
          availableCrimeSlots[_crimeArray[i].difficulty] = (availableCrimeSlots[_crimeArray[i].difficulty] || 0) + 1
          availableCrimeSlotsCount += 1
          if (userSettings.showSelfSuccessRate == "self-success-hide") {
            _crimeSuccess = (`<span class="OC2-textGray">-</span>`)
          } else {
            _crimeSuccess = (`<span class="OC2-textGray">${_crimeArray[i].slots[j].checkpoint_pass_rate}</span>`)
          }
        }
        _memberOutputHTML += (`<li class="table-cell OC2-crimeMemberLi OC2-crimeID_${_crimeArray[i].id} ${_userIndicatorClass}">
          <div class="OC2-tableCell OC2-tableCrimeMemberSuccess">${_crimeSuccess}</div>
          <div class="OC2-tableCell OC2-tableCrimeMemberItem" title="${_crimeItemMouseover}" >${_crimeItem}</div>
          <div class="OC2-tableCell OC2-hideSmall OC2-tableCrimePosition">${_crimeArray[i].slots[j].position}</div>
          <div class="OC2-tableCell OC2-tableCrimeMemberName">${_crimeSlotMemberName}</div>
          <div class="OC2-tableCell OC2-tableCrimeMemberStatus">${_crimeSlotMemberStatus}</div>
        </li>`)
      }
      _crimeWarningMouseover = _warningSuccessChance + (((_warningItemNeeded.length > 0) && (_warningSuccessChance.length > 0)) ? "<br />": "") + _warningItemNeeded
      if (_warningSuccessChance.length > 0) {
        _crimeWarningIcon += "%"
      }
      if (_warningItemNeeded.length > 0) {
        _crimeWarningIcon += crimeItemIcon
      }
      if (_crimeWarningIcon.length > 0) {
        _crimeWarningIcon = "[" + _crimeWarningIcon + "]&nbsp;"
      }
      let _outputHTML = (`<li class="table-cell OC2-crimeLi ${_crimeListType} OC2-crimeID_${_crimeArray[i].id} ${_userIndicatorCrimeClass}">
        <div class="OC2-tableCell OC2-tableCrimeMemberCount OC2-crimeID_${_crimeArray[i].id}"><span class="hideMembersButton">${membersButtonShowText}</span>&nbsp;&nbsp;${_memberCount} / ${(_crimeArray[i].slots).length}</div>
        <div class="OC2-tableCell OC2-tableCrime"><span class="OC2-crimeMouseoverWarning" title="${_crimeWarningMouseover}">${_crimeWarningIcon}</span><a href="https://www.torn.com/factions.php?step=your&type=12#/tab=crimes&crimeId=${_crimeArray[i].id}">Lv${_crimeArray[i].difficulty} ${_crimeArray[i].name}</a></div>
        <div class="OC2-tableCell OC2-tableCountdown OC2-crimeID_${_crimeArray[i].id}" title="${_countdownMouseover}"><span class="OC2-countdownText">${_countdownText}</span> <span class="OC2-countdown" data-countdown="${_countdownToTimestamp}">${_countdownToTimestamp}</span></div>
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
      //give numbers to crimes with more than one of the same named role
      let _crimeSlotPositionMap = _crimeSlotPositionArray.reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {})
      for (const [_pos, _count] of Object.entries(_crimeSlotPositionMap)) {
        if (_count > 1) {
          let _matchedDivs = $("li.OC2-crimeID_"+_crimeArray[i].id+" .OC2-tableCrimePosition:contains("+_pos+")")
          for (let m = 0; m < _matchedDivs.length; m++) {
            _matchedDivs[m].innerHTML = _matchedDivs[m].innerHTML + ` ${m+1}`
          }
        }
      }
      //logic for Allenone's API can go here-------------------------------------------------
      if (userSettings.showAllenoneScript == "torn-probability-hide") {
        //do nothing
      } else {
        if (_crimeArray[i].status == "Planning") {
          if (!calculatedSuccessChanceObj[_crimeArray[i].id]) {
            if (tornProbabilityAvailableScenarios.includes(_crimeArray[i].name)) {
              getTornProbabilityCrimeSuccess(_crimeArray[i].name, _crimeSuccessRateList, _crimeArray[i].id)
            }
          } else {
            let _crimeLi_originalHTML = $("li.OC2-crimeLi.OC2-crimeID_" + _crimeArray[i].id + " div.OC2-tableCrime").html()
            $("li.OC2-crimeLi.OC2-crimeID_" + _crimeArray[i].id + " div.OC2-tableCrime").html(_crimeLi_originalHTML + `&nbsp;&nbsp;${calculatedSuccessChanceObj[_crimeArray[i].id]}%`)
          }
        }
       }
    }
  } else {
    _afterElm.after(`<li class="table-cell OC2-crimeLi"><div class="OC2-tableCell OC2-tableCrime">None</div></li>`)
  }
}

//templating functions
async function generateInsertHTML() {

  if ($(".OC2-memberViewer .OC2-memberTable")[0]) {
    return
  }
  let _insertHTML = (`
  <div class="category-wrap OC2-memberViewer m-top10">
    <div class="title-black top-round t-overflow">OC 2.0 Overview <a href="https://www.torn.com/OC2_Settings_Page" target="_blank"><span title="Go to Settings Page" class="extraSettingsButton">&#9881;</span></a><span class="hideLazyMembersButton OC2-hideAtStart"></span><span class="hideCrimesButton OC2-hideAtStart"></span></div>
    <div class="cont-gray OC2-memberTableErrorDisplay" style="display:none; padding: 5px 0"></div>
    <div class="cont-gray OC2-memberTable" style="display:none"><ul class="table-body">
      <li class="table-cell OC2-availableMembers OC2-titleLiAvailableMembers"><div class="OC2-titleCell OC2-fancyBg">Members not in an OC<div class="OC2-sortTypeMember">Sort: <div id="sortOCButton">OC</div><div id="sortActiveButton">active</div></div></div></li>
      <li class="table-cell OC2-crimeLi OC2-titleLiCrimeSeciton"><div class="OC2-titleCell OC2-fancyBg">Crimes<div class="OC2-sortType">Sort: <div id="sortLevelButton">level</div><div id="sortTimeButton">time</div></div></div></li>
      <li class="table-cell OC2-crimeLi OC2-titleLiUninitiated"><div class="OC2-titleCell" id="OC2-titleUninitiated"><span class="catCrimeTitle">Uninitiated Crimes</span> <span class="toggleCatCrimesButton">${crimeListShowText}<span></div></li>
      <li class="table-cell OC2-crimeLi OC2-horizLine"></li>
      <li class="table-cell OC2-crimeLi OC2-titleLiRecruiting"><div class="OC2-titleCell" id="OC2-titleRecruiting"><span class="catCrimeTitle">Recruiting Crimes</span> <span class="toggleCatCrimesButton">${crimeListShowText}<span></div></li>
      <li class="table-cell OC2-crimeLi OC2-horizLine"></li>
      <li class="table-cell OC2-crimeLi OC2-titleLiPlanning"><div class="OC2-titleCell" id="OC2-titleFull"><span class="catCrimeTitle">Full Crimes</span> <span class="toggleCatCrimesButton">${crimeListShowText}<span></div></li>
    </ul></div>
    <div class="OC2-memberTableFooter"></div>
  </div>`)
  //what to do in normal crimes2.0 page
  $(".OC2-hideAtStart").css({
    "display": "none"
  })
  if (checkCrimesPage()) {
    $("div#faction-crimes").before(_insertHTML)
    checkDefaultSortState()
    styleTable()
    $(".hideCrimesButton").off().on("click", event => {
      toggleCrimeView()
    })
    $(".OC2-sortType div").off().on("click", event => {
      resortCrimeTable(event.currentTarget)
    })
    $(".OC2-sortTypeMember div").off().on("click", event => {
      resortAvailMemberTable(event.currentTarget)
    })
    $(".hideLazyMembersButton").off().on("click", event => {
      toggleLazyMembersView()
    })
  } else //this "else" is important to like the two if statements. Without it, it won't load on the faction -> crimes OC page because the second if statement takes precidence due to await
  //what to do if traveling AND on faction page
  if (await checkTravelFactionPage()) {
    waitForElm('div#react-root').then((elm) => {
      $(elm).before(_insertHTML)
      checkDefaultSortState()
      styleTable()
      $(".hideCrimesButton").off().on("click", event => {
        toggleCrimeView()
      })
      $(".OC2-sortType div").off().on("click", event => {
        resortCrimeTable(event.currentTarget)
      })
      $(".OC2-sortTypeMember div").off().on("click", event => {
        resortAvailMemberTable(event.currentTarget)
      })
      $(".hideLazyMembersButton").off().on("click", event => {
        toggleLazyMembersView()
      })
      if (myAPIData) {
        putMemberInfoIntoTable()
      }
    })
  }
}

function checkDefaultHideState() {
  $(".OC2-memberTable").show()
  if (userSettings.memberShow == "member-hide") {
    $(".hideLazyMembersButton").html(lazyMembersButtonShowText)
    $(".OC2-availableMembers").hide()
    $(".OC2-memberAvailable").hide()
  } else {
    $(".hideLazyMembersButton").addClass("text-hide")
    $(".hideLazyMembersButton").html(lazyMembersButtonHideText)
  }
  if (userSettings.crimesShow == "crimes-hide") {
    $(".hideCrimesButton").html(crimeButtonShowText)
    $(".OC2-crimeMemberLi").hide()
    $(".OC2-crimeLi").hide()
  } else {
    $(".hideCrimesButton").addClass("text-hide")
    $(".hideCrimesButton").html(crimeButtonHideText)
    $(".OC2-crimeMemberLi").hide();
  }
}

function checkDefaultSortState() {
  //userSettings.memberSort "OC-desc", //OC-asc / OC-desc / active-asc / active-desc
  //userSettings.sortType "time-asc", //time-asc / time-desc / level-asc / level-desc
  let _memberTarget = userSettings.memberSort.split("-")[0]
  let _memberDirection = userSettings.memberSort.split("-")[1]
  let _crimeTarget = userSettings.sortType.split("-")[0]
  let _crimeDirection = userSettings.sortType.split("-")[1]

  _memberTarget = _memberTarget[0].toUpperCase() + _memberTarget.slice(1)
  _crimeTarget = _crimeTarget[0].toUpperCase() + _crimeTarget.slice(1)

  let _arrowDisplayMember = settingsButtonAscText
  let _arrowDisplayCrime = settingsButtonAscText
  if (_memberDirection == "desc") {
    _arrowDisplayMember = settingsButtonDescText
  }
  if (_crimeDirection == "desc") {
    _arrowDisplayCrime= settingsButtonDescText
  }
  $(`.OC2-sortTypeMember div[id=sort${_memberTarget}Button]`).addClass("text-underline")
  $(`.OC2-sortTypeMember div[id=sort${_memberTarget}Button]`).html(`${_memberTarget.toLowerCase()}${_arrowDisplayMember}`)
  $(`.OC2-sortType div[id=sort${_crimeTarget}Button]`).addClass("text-underline")
  $(`.OC2-sortType div[id=sort${_crimeTarget}Button]`).html(`${_crimeTarget.toLowerCase()}${_arrowDisplayCrime}`)
}

function insertOCNotifier() {
  let _userNotice = (`<a href="https://www.torn.com/factions.php?step=your#/tab=crimes"><span class="OC2-redtext">No active OC.</span></a>`)
  let _userMouseover = (`You are not currently participating in an OC.`)
  if (userInfo.crimeInfo) {
    _userNotice = (`<span class="OC2-normaltext"><a href="https://www.torn.com/factions.php?step=your&type=5#/tab=crimes&crimeId=${userInfo.crimeInfo.crimeId}">Lv ${userInfo.crimeInfo.crimeDifficulty} ${userInfo.crimeInfo.crimeName}</a></span>`)
    _userMouseover = (`${userInfo.crimeInfo.crimePosition} (${userInfo.crimeInfo.crimeSuccess}%)`)
  }
  let _insertHTML = (`<div class="OC2-sidebarNotice" title="${_userMouseover}"><a href="https://www.torn.com/factions.php?step=your#/tab=crimes"><span style="font-weight: bold">OC 2.0:</span></a>
    ${_userNotice}
  </div>`)
  $('div[class^="sidebar_"] div[class^="user-information_"] div[class^="toggle-block_"] div[class^="toggle-content_"] div[class^="content_"]').append(_insertHTML)
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
    $(".OC2-crimeMemberLi.OC2-crimeID_"+_crimeID).removeClass("crimeMemberLiShow")
    $(".OC2-crimeMemberLi.OC2-crimeID_"+_crimeID).slideUp()
  } else {
    $(".OC2-crimeID_"+_crimeID+" .hideMembersButton").html(membersButtonHideText)
    $(".OC2-crimeID_"+_crimeID+" .hideMembersButton").addClass("text-hide")
    $(".OC2-crimeMemberLi.OC2-crimeID_"+_crimeID).addClass("crimeMemberLiShow")
    $(".OC2-crimeMemberLi.OC2-crimeID_"+_crimeID).slideDown()

  }
}

//OC2-availableMembers
function toggleLazyMembersView() {
  if ($(".hideLazyMembersButton").hasClass("text-hide")) {
    $(".hideLazyMembersButton").html(lazyMembersButtonShowText)
    $(".hideLazyMembersButton").removeClass("text-hide")
    $(".OC2-availableMembers").slideUp()
    $(".OC2-memberAvailable").slideUp()
  } else {
    $(".hideLazyMembersButton").html(lazyMembersButtonHideText)
    $(".hideLazyMembersButton").addClass("text-hide")
    $(".OC2-availableMembers").slideDown()
    $(".OC2-memberAvailable").slideDown()
  }
}

function resortCrimeTable(_target) {
  $(".OC2-sortType div").removeClass("text-underline")
  $(".OC2-sortType div#sortLevelButton").html("level")
  $(".OC2-sortType div#sortTimeButton").html("time")
  $(_target).addClass("text-underline")
  if ($(_target).attr("id") == "sortLevelButton") {
    if (userSettings.sortType == "level-asc") {
      userSettings.sortType = "level-desc"
      $(_target).html(`level${settingsButtonDescText}`)
    } else {
      userSettings.sortType = "level-asc"
      $(_target).html(`level${settingsButtonAscText}`)
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
  if ( !$(".hideLazyMembersButton").eq(0).hasClass("text-hide") ) {
    $("li.OC2-availableMembers").hide()
    $("li.OC2-memberAvailable").hide()
  }
}

function resortAvailMemberTable(_target) {
  $(".OC2-sortTypeMember div").removeClass("text-underline")
  $(".OC2-sortTypeMember div#sortOCButton").html("OC")
  $(".OC2-sortTypeMember div#sortActiveButton").html("active")
  $(_target).addClass("text-underline")
  if ($(_target).attr("id") == "sortOCButton") {
    if (userSettings.memberSort == "OC-asc") {
      userSettings.memberSort = "OC-desc"
      $(_target).html(`OC${settingsButtonAscText}`)
    } else {
      userSettings.memberSort = "OC-asc"
      $(_target).html(`OC${settingsButtonDescText}`)
    }
  }
  if ($(_target).attr("id") == "sortActiveButton") {
    if (userSettings.memberSort == "active-desc") {
      userSettings.memberSort = "active-asc"
      $(_target).html(`active${settingsButtonAscText}`)
    } else {
      userSettings.memberSort = "active-desc"
      $(_target).html(`active${settingsButtonDescText}`)
    }
  }
  sortAvailMembers()
  putAvailMembersIntoTable(availMemberList, $(".OC2-memberTable li.OC2-titleLiAvailableMembers"))
  styleTable()
  arrangeMemberDirectionality()
  calculateCrimeSlots()
  calculateSoonAvailMembers()
  $("li.OC2-crimeLi .hideMembersButton").removeClass("text-hide")
  $("li.OC2-crimeLi.OC2-crimeLiActive").removeClass("OC2-crimeLiActive")
  styleCrimeLiActive()
  $("li.OC2-crimeMemberLi").hide()
  if ( !$(".hideCrimesButton").eq(0).hasClass("text-hide") ) {
    $("li.OC2-crimeLi").hide()
  }
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
  return (`<span title="${_statusDesc}" class="OC2-statusText ${_statusState.toLowerCase()}">${_statusState}</span><span title="${_statusDesc}" class="OC2-statusText OC2-hideSmall ${_statusState.toLowerCase()}">${_statusDesc}</span>`)
}

function styleTable() {
  /* notes to self
 * Small: 386px
 * Tiny: 320px
 * Normal: 784px
 */
  $(".OC2-memberTable ul.table-body").css({
    "display": "flex",
    "flex-direction": "row",
    "flex-wrap": "wrap"
  })
  $(".OC2-memberTable li.table-cell").not(".OC2-memberAvailable").css({
    "order": 420
  })
  $(".OC2-titleLiAvailableMembers").css({
     "order": 0
  })
  $(".OC2-memberTable a").css({
    "color": colorObj.link[colorDisplayMode],
    "text-decoration": "none"
  })
  $(".extraSettingsButton").css({
    "color": colorObj.dark_bg_link[colorDisplayMode],
    "text-decoration": "none"
  })
  $(".extraSettingsButton").on("mouseenter", function(event) {
    $(event.currentTarget).css({
      "color": colorObj.recolor.yellow[colorDisplayMode]
    })
  })
  $(".extraSettingsButton").on("mouseleave", function(event) {
    $(event.currentTarget).css({
      "color": colorObj.dark_bg_link[colorDisplayMode]
    })
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
  $(".OC2-memberTable div.OC2-tableLastCrime").css({
    "width": "13px",
    "display": "inline-block",
    "margin": "auto",
    "padding": "0 3px"
  })
  $(".OC2-memberTable div.OC2-tableLastCrime svg").css({
    "display": "inline-block",
    "margin": "0 auto -1px auto"
  })
  $(".OC2-memberTable div.OC2-tableMember").css({
    "width": "148px",
  })
  $(".OC2-memberTable div.OC2-tableStatus").css({
    "width": "222px",
    "text-align": "left"
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
  $(".OC2-statusText.federal").css({
    "color": colorObj.recolor.red[colorDisplayMode]
  })
  $(".OC2-memberName.federal").css({
    "text-decoration": "line-through",
    "color": colorObj.recolor.red[colorDisplayMode]
  })
  $(".OC2-memberName.inactive").css({
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
    "width": "322px",
  })
  $(".OC2-crimeMouseoverWarning").css({
    "margin-left": "10px",
    "display": "inline-block",
    "color": colorObj.recolor.red[colorDisplayMode]
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
  $(".hideLazyMembersButton").css({
    "position": "absolute",
    "right": "100px",
    "cursor": "pointer"
  })
  $(".OC2-memberTable li.OC2-memberAvailable").css({
    "padding-left": "10px"
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
    "display": "inline-block",
    "padding-left": parseInt(containerMaxWidth) - 158 + "px",
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
  $(".OC2-sortTypeMember").css({
    "display": "inline",
    "padding-left": parseInt(containerMaxWidth) - 220 + "px",
  })
  $(".OC2-sortTypeMember div").css({
    "display": "inline-block",
    "font-family": "Arial",
    "padding": "0 0 0 5px",
    "width": "35px"
  })
  $(".OC2-memberTable .OC2-sortTypeMember div").css({
    "text-decoration": "none"
  })
  $(".OC2-memberTable .OC2-sortTypeMember div.text-underline").css({
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
  $(".OC2-horizLine").css({
    "border-bottom": "1px solid rgb(34,34,34)",
    "width": $(this).parent().width() + "px",
    "box-sizing": "border-box",
    "height": "3px",
  })
  if (($(".OC2-crimeMemberLi").last().next()).length < 1) {
    $(".OC2-crimeMemberLi").last().css({
      "border-radius": "0 0 15px 15px",
    })
  }
  $(".catCrimeTitle").css({
    "width": "120px",
    "display": "inline-block"
  })
  $(".toggleCatCrimesButton").css({
    "font-size": "11px",
    "font-family": "Arial",
    "width": "50px",
    //"margin": "0 0 0 50px",
    "cursor": "pointer",
  })
  //hide screen reader fields
  $(".screen-reader-hidden").css({
    "position": "absolute",
    "overflow": "hidden",
    "width": "1px",
    "height": "1px",
    "clip": "rect(1px, 1px, 1px, 1px)",
    "padding": "0",
    "border": "0",
    "white-space": "nowrap"
  })
}

function styleTableSmallScreen() {
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
    if (!$(".OC2-memberViewer .OC2-memberTable")[0]) {
      generateInsertHTML();
      if (!myAPIData) {
        try {
          let _successfulGetAPIData = await getAndAnalyzeAPIData()
          if (_successfulGetAPIData.error) {
            $(".OC2-memberTable").hide()
            $(".OC2-memberTableErrorDisplay").html(`<span style="margin-left: 20px">Error occured: ${_successfulGetAPIData.error.error}. Please visit the <a href="https://www.torn.com/OC2_Settings_Page" target="_new" style="color: inherit; font-weight: bold; text-decoration: underline">Settings Page</a> to set up an API key</span>`)
            $(".OC2-memberTableErrorDisplay").show()
          } else {
            putMemberInfoIntoTable()
          }
        } catch(_err) {
          return _err
        }
      }
    } else {
        $(".OC2-memberViewer").show()
    }
  } else {
    if ($(".OC2-memberViewer .OC2-memberTable")[0]) {
      $(".OC2-memberViewer").hide();
    }
  }
}

async function runOnceFunction() {
  //load saved data
  await getUserSettings()
  await getAPIKey()

  //get Allenone's API compatibility
  if (userSettings.showAllenoneScript == "torn-probability-hide") {
    //do nothing
  } else {
    await getTornProbabilitySupportedScenarios() //run this by default
  }
  //prepare settings page if on correct URL
  if ($(location).attr("pathname").search("OC2_Settings_Page") >= 0) {
    $(document).prop('title', 'OC2 Overview - Settings | TORN');
    $("div.main-wrap").removeClass("error-404")
    $("div.content-title #skip-to-content").text("OC 2.0 Overview: Settings")
    prepareSettingsPage()
    getSavedValues()
    settingsFillSelect()
  }
  //insert member overview
  if (checkCrimesPage() || await checkTravelFactionPage()) {
    if (!$(".OC2-memberViewer .OC2-memberTable")[0]) {
      generateInsertHTML()
      if (!myAPIData) {
        try {
          let _successfulGetAPIData = await getAndAnalyzeAPIData()
          if (_successfulGetAPIData.error) {
            $(".OC2-memberTable").hide()
            $(".OC2-memberTableErrorDisplay").html(`<span style="margin-left: 20px">Error occured: ${_successfulGetAPIData.error.error}. Please visit the <a href="https://www.torn.com/OC2_Settings_Page" target="_new" style="color: inherit; font-weight: bold; text-decoration: underline">Settings Page</a> to set up an API key</span>`)
            $(".OC2-memberTableErrorDisplay").show()
          } else {
            putMemberInfoIntoTable()
          }
        } catch(_err) {
          return _err
        }
      }
    } else {
      $(".OC2-memberViewer").show()
    }
  }
  //sidebar notifier, but not if the sidebar doesn't exist
  if (userSettings.showSidebarOC == "sidebar-show") {
    if ( ($("div[class*='sidebar_'][class*='desktop_']")[0]) && (!isPDA()) ) {
      if (!myAPIData) {
        let _successfulGetAPIData = await getAndAnalyzeAPIData()
        if (_successfulGetAPIData.error) {
          return
        }
      }
      insertOCNotifier()
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
    containerBigMaxWidth = "976px"
  } else if (_isWindowSmallish.matches) {
    containerMaxWidth = "784px"
    containerBigMaxWidth = "578px"
  }else if (_isWindowSmall.matches) {
    containerMaxWidth = "386px"
    containerBigMaxWidth = "578px"
  } else if (_isWindowTiny.matches) {
    containerMaxWidth = "320px"
    containerBigMaxWidth = "320px"
  }
  if (!isPDA()) {
    styleTable()
    $(".OC2-crimeMemberLi").not(".crimeMemberLiShow").css({
      "display": "none"
    })
  }
}

_isWindowNormal.addEventListener("change", function() {
  checkWindowWidth()
});
_isWindowSmallish.addEventListener("change", function() {
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

$("#dark-mode-state").on('change', modeChangeFunction)

function modeChangeFunction() {
  colorDisplayMode = $("body#body").hasClass("dark-mode") ? "darkmode" : "lightmode"
  styleTable()
  checkDefaultHideState()
  styleSettings()
}

/* ====
 * Settings page stuff
 * ====
*/

async function testAPIKey(_APIKey) {
  $(".OC2-APITestResults div[id^=OC2-APITestResult-]").remove()
  $(".OC2-APITestResults").append(`<div>Testing...</div>`)
  let _insertHTML = ""
  return await $.ajax({
    dataType: "json",
    url: (`https://api.torn.com/key/?selections=info&key=${_APIKey}`)
  }).then( data => {
    try {
      let _testResults = {
        "limited": data.access_level >= 2,
        "basic": data.selections.faction.includes("basic"),
        "crimes": data.selections.faction.includes("crimes"),
        "members": data.selections.faction.includes("members"),
        "items": data.selections.torn.includes("items"),
        "final": false
      }
      _testResults.final = (_testResults.limited && _testResults.basic && _testResults.crimes && _testResults.members && _testResults.items)
      let _insertHTML = (`
            <div id="OC2-APITestResult-Limited" class="${_testResults.limited ? "color-green" : "color-red"}">Minimal Key (or higher) ${_testResults.limited ? "OK" : "X"}</div>
            <div id="OC2-APITestResult-Basic" class="${_testResults.basic ? "color-green" : "color-red"}">/v2/factions/basic ${_testResults.basic ? "OK" : "X"}</div>
            <div id="OC2-APITestResult-Crimes" class="${_testResults.crimes ? "color-green" : "color-red"}">/v2/factions/crimes ${_testResults.crimes ? "OK" : "X"}</div>
            <div id="OC2-APITestResult-Members" class="${_testResults.members ? "color-green" : "color-red"}">/v2/factions/members ${_testResults.members ? "OK" : "X"}</div>
            <div id="OC2-APITestResult-Items" class="${_testResults.items ? "color-green" : "color-red"}">/v1/torn/items ${_testResults.items ? "OK" : "X"}</div>
            <div id="OC2-APITestResult-Final" class="${_testResults.final ? "color-green" : "color-red"}">${_testResults.final ? "API Key good to go!" : "API Key not usable!"}</div>
            <div id="OC2-APITestResult-Final" class="${_testResults.final ? "color-green" : "color-red"}">${_testResults.crimes && _testResults.members ? "Save settings to enable Member Ignore List" : `You do not have faction API permission. Please ask your faction leader to give you a role with "Faction API access" permissions.`}</div>
      `)
      $(".OC2-APITestResults div").remove()
      $(".OC2-APITestResults").append(_insertHTML)
    } catch(err) {
      $(".OC2-APITestResults div").remove()
      $(".OC2-APITestResults").append(`<div id="OC2-APITestResult-Fail" class="color-red">Error: API Key not valid</div>`)
    }
    $(".OC2-APITestResults div[id^=OC2-APITestResult-]").css({
      "margin-left": "15px"
    })
    $("div[id^=OC2-APITestResult-].color-green").css({
      "color": colorObj.recolor.green[colorDisplayMode]
    })
    $("div[id^=OC2-APITestResult-].color-red").css({
      "color": colorObj.recolor.red[colorDisplayMode]
    })
    $(".OC2-APITestButton").off().on("click", (event) => {
      APITestClickEvent(event)
    })
  })
}

async function setSavedValues() {
  let _userValues = {
    "memberShow": $("input[name=OC2-display-choice-availMembers]:checked")[0].value,
    "crimesShow": $("input[name=OC2-display-choice-crimes]:checked")[0].value, //crimes-hide / crimes-show
    "sortType": $("input[name=OC2-display-choice-crimes-sort]:checked")[0].value, //time-asc / time-desc / level-asc / level-desc
    "memberSort": $("input[name=OC2-display-choice-availMembers-sort]:checked")[0].value, //OC-asc / OC-desc / active-asc / active-desc
    "lastOC_yellow": $(`input[id=OC-indicator-yellow]`).val(),
    "lastOC_red": $(`input[id=OC-indicator-red]`).val(),
    "lastActivity": $(`input[id=activity-indicator]`).val(),
    "memberIgnoreList": displayIgnoreList,
    "showSidebarOC": $("input[name=OC2-display-choice-sidebarShow]:checked")[0].value, //sidebar-show / sidebar-hide
    "showNegativeTimes": $("input[name=OC2-display-choice-negative-timer]:checked")[0].value, //negative-timer-show / negative-timer-hide
    "warnLowSuccessPercentage": $(`input[id=warn-low-success]`).val(),
    "showProgressPercentage": $("input[name=OC2-display-crime-progress]:checked")[0].value, //progress-show / progress-hide
    "showSelfSuccessRate": $("input[name=OC2-display-choice-self-success]:checked")[0].value,
    "showAllenoneScript": $("input[name=OC2-display-choice-torn-probability]:checked")[0].value,
    "memberDirectionality": $("input[name=OC2-display-choice-availMembers-order]:checked")[0].value,
  }
  await setUserSettings(_userValues)
  await getUserSettings()
  if ( $("#OC2-APITestResult-Final").hasClass("color-green") ) {
    await saveAPIKey()
    $("#OC2-addToIgnoreButton").show()
    $("#OC2-ignoreMemberInput").prop("disabled", false)
    $("#OC2-ignoreMemberSelect").prop("disabled", false)
    $(".OC2-errorAPIKey").remove()
    settingsFillSelect()
  }
  getSavedValues()
}

async function saveAPIKey() {
  let _userKey = $("#OC2-APIInput").val()
  await GM.setValue("CMR_OC2_APIKey", _userKey)
  await getAPIKey()
}

async function replaceSavedValues() {
  displayIgnoreList = []
  userSettings = defaultUserSettings
  getSavedValues()
}

function getSavedValues() {
  $(`input[name=OC2-display-choice-availMembers][id=${userSettings?.memberShow}]`).prop("checked", true)
  $(`input[name=OC2-display-choice-crimes][id=${userSettings?.crimesShow}]`).prop("checked", true)
  $(`input[name=OC2-display-choice-crimes-sort][id=${userSettings?.sortType}]`).prop("checked", true)
  $(`input[name=OC2-display-choice-availMembers-sort][id=${userSettings?.memberSort}]`).prop("checked", true)
  $(`input[name=OC2-display-choice-sidebarShow][id=${userSettings?.showSidebarOC}]`).prop("checked", true)
  $(`input[name=OC2-display-choice-negative-timer][id=${userSettings?.showNegativeTimes}]`).prop("checked", true)
  $(`input[name=OC2-display-crime-progress][id=${userSettings?.showProgressPercentage}]`).prop("checked", true)
  $(`input[id=OC-indicator-yellow]`).val(userSettings?.lastOC_yellow)
  $(`input[id=OC-indicator-red]`).val(userSettings?.lastOC_red)
  $(`input[id=activity-indicator]`).val(userSettings?.lastActivity)
  $(`input[id=warn-low-success]`).val(userSettings?.warnLowSuccessPercentage)
  $(`input[name=OC2-display-choice-self-success][id=${(userSettings?.showSelfSuccessRate || defaultUserSettings.showSelfSuccessRate )}]`).prop("checked", true)
  $(`input[name=OC2-display-choice-torn-probability][id=${(userSettings?.showAllenoneScript || defaultUserSettings.showAllenoneScript )}]`).prop("checked", true)
  $(`input[name=OC2-display-choice-availMembers-order][id=${(userSettings?.memberDirectionality || defaultUserSettings.memberDirectionality )}]`).prop("checked", true)
  fillMemberIgnoreList()
}

function APITestClickEvent(_event) {
  $("#OC2-APIInput").val( $("#OC2-APIInput").val().trim() ) //trim trailing spaces
  let _testKey = $("#OC2-APIInput").val()
  testAPIKey(_testKey)
}

async function deleteAPIKey() {
  $(".OC2-errorAPIKey").remove()
  $(".OC2-APITestResults div").remove()
  if (isPDA()) {
    $(".OC2-APITestResults").append(`<div class="color-yellow">TornPDA: Unable to remove API Key via script because it's saved on TornPDA itself.</div>`)
    return
  }
  GM.setValue("CMR_OC2_APIKey", null)
  APIKey = null
  $(".OC2-APITestResults").append(`<div class="color-red">API Key removed from script memory. If you wish to be sure that your API key is secure, delete the provided key from torn's settings page.</div>`)
  $("#OC2-APIInput").val(APIKey? APIKey : "")
  settingsFillSelect()
}

function prepareSettingsPage() {
  let _displayAPIKey = "API Key saved in TornPDA"
  if (!isPDA()) {
    _displayAPIKey = APIKey? APIKey : ""
  }
  let _injectHTML = (`
    <div id="OC2-Settings" class="category-wrap m-top10">
    <div class="title-black top-round t-overflow">OC 2.0 Settings</div>
    <div class="cont-gray OC2-settingsTable"><ul class="table-body">
      <li class="table-cell OC2-settingsTitle"><div class="OC2-titleCell OC2-fancyBg">API Key</div></li>
      <li class="table-cell OC2-settingsSection">
        <div class="OC2-settingsCell"><input id="OC2-APIInput" type="textbox" style="line-height: 14px; padding: 10px 8px" value="${_displayAPIKey}" /><div id="OC2-APITestButton" class="OC2-button">Test API Key</div></div>
      </li>
      <li class="table-cell OC2-settingsSection">
        <div class="OC2-settingsCell"><div id="OC2-deleteAPIKeyButton" class="OC2-button">Delete API Key</div></div>
      </li>
      <li class="table-cell OC2-settingsSection">
          <div class="OC2-settingsCell OC2-APITestResults">
          </div>
      </li>
      <li class="table-cell OC2-horizLine"></li>
      <li class="table-cell OC2-memberAvailable OC2-settingsTitle"><div class="OC2-titleCell OC2-fancyBg">Preferences</div></li>
      <li class="table-cell OC2-settingsSection">
        <div class="OC2-settingsCell">
          <div class="OC2-settingsSubTitle">Default View</div>
            <fieldset class="OC2-choice">
              <legend><span title="(TornTools also provides this)<br />Adds a text indicator to the sidebar on your current OC, and gives a warning if you are not in an OC.<br />Note: Will cause the script to request one more API call per page load if the sidebar is visible.<br />Will have no effect on TornPDA users, or users with small screens." class="OC2-infoHover">${moreInfoHover}</span>Show OC information in sidebar? </legend>
              <div class="OC2-choice-buttons">
                <input type="radio" name="OC2-display-choice-sidebarShow" id="sidebar-show" value="sidebar-show" /><label for="sidebar-show">Yes</label>
                <input type="radio" name="OC2-display-choice-sidebarShow" id="sidebar-hide" value="sidebar-hide" /><label for="sidebar-hide">No</label>
              </div>
            </fieldset>
            <fieldset class="OC2-choice">
              <legend> <span title="If enabled, crime timers will turn <span style='color:${colorObj.recolor.red[colorDisplayMode]}'>red</span> and start counting up if they are delayed.<br />If disabled, crime timers will stay at <span style='color:${colorObj.recolor.red[colorDisplayMode]}'>0:00:00:00</span> if they are delayed." class="OC2-infoHover">${moreInfoHover}</span>Show countup timer if crime is delayed?</legend>
              <div class="OC2-choice-buttons">
                <input type="radio" name="OC2-display-choice-negative-timer" id="negative-timer-show" value="negative-timer-show" /><label for="negative-timer-show">Yes</label>
                <input type="radio" name="OC2-display-choice-negative-timer" id="negative-timer-hide" value="negative-timer-hide" /><label for="negative-timer-hide">No</label>
              </div>
            </fieldset>
            <fieldset class="OC2-choice">
              <legend> <span title="If enabled, success chance of the API key holder (which should be you) will be shown in all empty crime slots.<br />If disabled, the success chance will not be shown." class="OC2-infoHover">${moreInfoHover}</span>Show self success chance in empty crimes?</legend>
              <div class="OC2-choice-buttons">
                <input type="radio" name="OC2-display-choice-self-success" id="self-success-show" value="self-success-show" /><label for="self-success-show">Yes</label>
                <input type="radio" name="OC2-display-choice-self-success" id="self-success-hide" value="self-success-hide" /><label for="self-success-hide">No</label>
              </div>
            </fieldset>
            <fieldset class="OC2-choice">
              <legend><span title="This will only show success chances for crimes that have their routes mapped out.<br />Please check out the link to Allenone's forum post for more details." class="OC2-infoHover">${moreInfoHover}</span>Show overall success chance of full crimes? (uses <a class="settingshref" href="https://www.torn.com/forums.php#/p=threads&f=67&t=16449999" target="_blank">Allenone's API</a>)</legend>
              <div class="OC2-choice-buttons">
                <input type="radio" name="OC2-display-choice-torn-probability" id="torn-probability-show" value="torn-probability-show" /><label for="torn-probability-show">Yes</label>
                <input type="radio" name="OC2-display-choice-torn-probability" id="torn-probability-hide" value="torn-probability-hide" /><label for="torn-probability-hide">No</label>
              </div>
            </fieldset>
            <fieldset class="OC2-choice">
              <legend><span title="If enabled, the list of members not currently in an OC will be shown when the script loads.<br />If disabled, you will need to click on the 'show members' button to see this section." class="OC2-infoHover">${moreInfoHover}</span>On load, show "Members not in an OC" section? </legend>
              <div class="OC2-choice-buttons">
                <input type="radio" name="OC2-display-choice-availMembers" id="member-show" value="member-show" /><label for="member-show">Yes</label>
                <input type="radio" name="OC2-display-choice-availMembers" id="member-hide" value="member-hide" /><label for="member-hide">No</label>
              </div>
            </fieldset>
            <fieldset class="OC2-choice">
              <legend><span title="Default sort behaviour for list of members not currently in OCs.<br />Options:<br /> - OC: Asc = Members with most recent OCs will be first<br> - OC: Desc = Members that have not participated recently will be first<br /> - Active: Asc = Most recently active members will be first<br /> - Active: Desc = Members that have not been active recently will be shown first" class="OC2-infoHover">${moreInfoHover}</span>Default sort for "Members not in an OC"? </legend>
              <div class="OC2-choice-buttons">
                <input type="radio" name="OC2-display-choice-availMembers-sort" id="OC-desc" value="OC-desc" /><label for="OC-desc">OC: Asc&nbsp;&nbsp;</label>
                <input type="radio" name="OC2-display-choice-availMembers-sort" id="OC-asc" value="OC-asc" /><label for="OC-asc">OC: Desc</label>
                <input type="radio" name="OC2-display-choice-availMembers-sort" id="active-asc" value="active-asc" /><label for="active-asc">Active: Asc</label>
                <input type="radio" name="OC2-display-choice-availMembers-sort" id="active-desc" value="active-desc" /><label for="active-desc">Active: Desc</label>
              </div>
            </fieldset>
            <fieldset class="OC2-choice">
              <legend><span title="Will only take effect if your screen size is large enough for 2 columns.<br />'left-to-right, row then column' = Members will be shown left-to-right, row by row.<br />'top-to-bottom, column then row' = Members will be shown down the left column, then down the right column." class="OC2-infoHover">${moreInfoHover}</span>Ordering of member list (if 2 columns are shown)? </legend>
              <div class="OC2-choice-buttons">
                <input type="radio" name="OC2-display-choice-availMembers-order" id="row-column" value="row-column" /><label for="row-column">left-to-right, row then column</label>
                <input type="radio" name="OC2-display-choice-availMembers-order" id="column-row" value="column-row" /><label for="column-row">top-to-bottom, column then row</label>
              </div>
            </fieldset>
            <fieldset class="OC2-choice">
              <legend><span title="If enabled, the list of crimes will be shown when the script loads.<br />If disabled, you will need to click on the 'show crimes' button to see this section." class="OC2-infoHover">${moreInfoHover}</span>On load, show "Crimes" section? </legend>
              <div class="OC2-choice-buttons">
                <input type="radio" name="OC2-display-choice-crimes" id="crimes-show" value="crimes-show" /><label for="crimes-show">Yes</label>
                <input type="radio" name="OC2-display-choice-crimes" id="crimes-hide" value="crimes-hide" /><label for="crimes-hide">No</label>
              </div>
            </fieldset>
            <fieldset class="OC2-choice">
              <legend><span title="Default sort behaviour for crimes.<br />Options:<br /> - Time: Asc = Crimes near completion/expiry/requiring attention will be shown first<br /> - Time: Desc = The opposite of the above.<br /> - Level: Asc = Lowest level crimes will be shown first<br /> - Level: Desc = Highest level crimes will be shown first." class="OC2-infoHover">${moreInfoHover}</span>Default sort for "Crimes"? </legend>
              <div class="OC2-choice-buttons">
                <input type="radio" name="OC2-display-choice-crimes-sort" id="time-asc" value="time-asc" /><label for="time-asc">Time: Asc</label>
                <input type="radio" name="OC2-display-choice-crimes-sort" id="time-desc" value="time-desc" /><label for="time-desc">Time: Desc</label>
                <input type="radio" name="OC2-display-choice-crimes-sort" id="level-asc" value="level-asc" /><label for="level-asc">Level: Asc</label>
                <input type="radio" name="OC2-display-choice-crimes-sort" id="level-desc" value="level-desc" /><label for="level-desc">Level: Desc</label>
              </div>
            </fieldset>
            <fieldset class="OC2-choice">
              <legend><span title="Shows the progress of each member's crime planning completion rate next to their names." class="OC2-infoHover">${moreInfoHover}</span>Show member crime planning %? </legend>
              <div class="OC2-choice-buttons">
                <input type="radio" name="OC2-display-crime-progress" id="progress-show" value="progress-show" /><label for="progress-show">Yes</label>
                <input type="radio" name="OC2-display-crime-progress" id="progress-hide" value="progress-hide" /><label for="progress-hide">No</label>
              </div>
            </fieldset>
        </div>
      </li>
      <li class="table-cell OC2-horizLine"></li>
      <li class="table-cell OC2-settingsSection">
        <div class="OC2-settingsCell">
          <div class="OC2-settingsSubTitle">Highlight & Indicator settings</div>
          <ul>
            <li><div class="OC2-settingsText"><div class="OC2-settingsLabel"><span title="The crime icon next to members' names will turn <span style='color:${colorObj.recolor.yellow[colorDisplayMode]}'>yellow</span> if their last OC participation is longer than this time" class="OC2-infoHover">${moreInfoHover}</span>Time since last OC for 'yellow' highlight:</div><input id="OC-indicator-yellow" type="textbox" style="line-height: 12px; padding: 5px" placeholder="24" size="10" /> hours</div></li>
            <li><div class="OC2-settingsText"><div class="OC2-settingsLabel"><span title="The crime icon next to members' names will turn <span style='color:${colorObj.recolor.red[colorDisplayMode]}'>red</span> if their last OC participation is longer than this time" class="OC2-infoHover">${moreInfoHover}</span>Time since last OC for 'red' highlight:</div><input id="OC-indicator-red" type="textbox" style="line-height: 12px; padding: 5px" placeholder="48" size="10" /> hours</div></li>
            <li><div class="OC2-settingsText"><div class="OC2-settingsLabel"><span title="Member's name will turn <span style='color:${colorObj.recolor.red[colorDisplayMode]}'>red</span> if they are inactive for longer than this time" class="OC2-infoHover">${moreInfoHover}</span>Time since last activity for 'inactive' indicator:</div><input id="activity-indicator" type="textbox" style="line-height: 12px; padding: 5px" palceholder="96" size="10" /> hours</div></li>
            <li><div class="OC2-settingsText"><div class="OC2-settingsLabel"><span title="A <span style='color:${colorObj.recolor.red[colorDisplayMode]}'>[%]</span> icon will appear next to crimes that have a member with a success rate lower than this number" class="OC2-infoHover">${moreInfoHover}</span>Member slot 'low success warning' threshold:</div><input id="warn-low-success" type="textbox" style="line-height: 12px; padding: 5px" palceholder="50" size="10" /> %</div></li>
          </ul>
        </div>
      </li>
      <li class="table-cell OC2-horizLine"></li>
      <li class="table-cell OC2-settingsSection">
        <div class="OC2-settingsCell">
          <div class="OC2-settingsSubTitle"><span title="Members on the ignore list will not be counted as 'available members' and their names will not be shown with the list of available members" class="OC2-infoHover">${moreInfoHover}</span>Member Ignore List</div>
          <div class="OC2-settingsText">
            <div class="OC2-memberIgnoreWrapper">Add member:
              <input id="OC2-ignoreMemberInput" type="textbox" />
              <select id="OC2-ignoreMemberSelect">
                <option class="default-option" value="" selected></option>
              </select>
              <div id="OC2-addToIgnoreButton" class="OC2-button">Add</div>
            </div>
          </div>
          <div class="OC2-settingsText">Ignored Members:
            <ul class="OC2-memberIgnoreList">
              <li class="OC2-ignoreTitles" style="font-weight: bold; margin-bottom: 5px"><div class="OC2-ignoreName">Member Name [id]</div> <div class="OC2-ignoreTime">Last Active Time</div><div class="OC2-ignoreButtons">Action</div></li>
            </ul>
          </div>
        </div>
      </li>
      <li class="table-cell OC2-horizLine"></li>
      <li class="table-cell OC2-settingsSection">
        <div class="OC2-settingsCell">
          <div class="OC2-buttonDiv">
            <div id="OC2-APIResetButton" class="OC2-button">Reset to Default</div><div id="OC2-APISaveButton" class="OC2-button">Save Changes</div>
          </div>
          <div id="OC2-buttonResult"></div>
        </div>
      </li>
    </ul></div>
    <div class="OC2-memberTableFooter OC2-settingsFooter"></div>
  </div>
  `)
  $("div.main-wrap").html(_injectHTML)
  //onclick functions
  $("#OC2-APITestButton").off().on("click", (event) => {
    APITestClickEvent(event)
  })
  $("#OC2-APISaveButton").off().on("click", (event) => {
    setSavedValues()
      .then( () => {
        $("#OC2-buttonResult").html("Settings saved!")
        if ($("#OC2-buttonResult").is(":visible")) {
          $("#OC2-buttonResult").slideUp("fast")
        }
        $("#OC2-buttonResult").slideDown("slow")
      })
  })
  $("#OC2-APIResetButton").off().on("click", (event) => {
    replaceSavedValues()
      .then( () => {
        $("#OC2-buttonResult").html("Settings reset to default")
        if ($("#OC2-buttonResult").is(":visible")) {
          $("#OC2-buttonResult").slideUp("fast")
        }
        $("#OC2-buttonResult").slideDown("slow")
      })
  })
  $("#OC2-deleteAPIKeyButton").off().on("click", (event) => {
    deleteAPIKey()
  })
  if (isPDA()) {
    $("#OC2-APIInput").prop("disabled", true)
    $("#OC2-APITestButton").off()
    $("#OC2-deleteAPIKeyButton").off()
  }
  $("#OC2-ignoreMemberInput").off()
  $("#OC2-ignoreMemberSelect").off()
  $("#OC2-ignoreMemberInput").on("keyup", (event) => {
    $("#OC2-ignoreMemberSelect option").not(".default-option").remove()
    let _insertOption = ""
    let _displayMemberList = myAPIData.members.filter((member) => (member.name.toLowerCase()).search(event.currentTarget.value.toLowerCase()) > -1)
    _displayMemberList.forEach( (member) => {
      _insertOption += (`<option value="${member.id}">${member.name} [${member.id}]</option>`)
    })
    $("#OC2-ignoreMemberSelect").append(_insertOption)
    $("#OC2-ignoreMemberSelect").attr("size", Math.min(7,_displayMemberList.length+1))
  })
  $("#OC2-ignoreMemberInput").on("focus", (event) => {
    $("#OC2-ignoreMemberSelect").attr("size", 7)
  })
  $("#OC2-ignoreMemberInput").on("blur", (event) => {
    if (event.relatedTarget != $("#OC2-ignoreMemberSelect")[0]) {
      $("#OC2-ignoreMemberSelect").attr("size", 0)
    }
  })
  $("#OC2-ignoreMemberSelect").on("change", (event) => {
    $("#OC2-ignoreMemberInput").val($("#OC2-ignoreMemberSelect :selected").text())
    $("#OC2-ignoreMemberSelect").attr("size", 0)
  })
  $("#OC2-addToIgnoreButton").off().on("click", (event) => {
    let _memberToIgnore = $("#OC2-ignoreMemberSelect :selected").val().toString()
    if (displayIgnoreList.includes(_memberToIgnore)) {
      return //do nothing
    } else {
      displayIgnoreList.push(_memberToIgnore)
      fillMemberIgnoreList()
    }
  })
  styleSettings()
}

function styleSettings() {
  colorDisplayMode = $("body#body").hasClass("dark-mode") ? "darkmode" : "lightmode"
  $(".settingshref").css({
    "color": colorObj.link[colorDisplayMode],
    "text-decoration": "none"
  })
  $(".settingshref").hover(
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
  $(".OC2-buttonDiv").css({
    "display": "flex",
    "flex-direction": "row",
    "justify-content": "center",
    //"width": (_isWindowTiny.matches)? parseInt(containerBigMaxWidth) - 30 + "px" : $(this).parent().width() - 50 + "px"
  })

  $("#OC2-buttonResult").css({
    "margin": "3px auto 8px -8px",
    "text-align": "center",
    "padding": "5px 0",
    "background-color": colorObj.userindicatorbg[colorDisplayMode],
    "display": "none",
    "width": "100%"
  })
  $(".OC2-APITestResults").css({
    "display": "flex",
    "flex-direction": "row",
    "flex-wrap": "wrap"
  })
  $(".OC2-choice").css({
    "display": "flex",
    "flex-direction": "row",
    "flex-wrap": "wrap"
  })
  $(".OC2-settingsSubTitle").css({
    "margin-bottom": "10px",
    "font-weight": "bold"
  })
  $(".OC2-settingsLabel").css({
    "width": "50%",
    "display": "inline-block"
  })
  $("fieldset.OC2-choice").css({
    "display": "inline-block",
    "width": "100%",
    "margin": "5px 0 5px 10px"
  })
  $("fieldset.OC2-choice .OC2-choice-buttons").css({
    "display": "flex",
    "flex-direction": "row",
  })
  $("fieldset.OC2-choice legend").css({
    "float": "left",
    "width": "50%"
  })
  $("span.OC2-infoHover").css({
    "padding-right": "8px"
  })
  $("fieldset.OC2-choice label").css({
    "display": "inline-block",
    "margin": "0 10px 0 5px"
  })
  $(".OC2-settingsText").css({
    "margin-left": "11px",
  })
  $("#OC2-Settings ul.table-body").css({
    "display": "flex",
    "flex-direction": "row",
    "flex-wrap": "wrap"
  })
  $("#OC2-Settings li.table-cell").css({
    "display": "flex",
    "flex-direction": "row",
    "width": "100%",
    "font-size": "12px",
  })
  $("#OC2-Settings .OC2-titleCell.OC2-fancyBg").css({
    "width": "100%",
    "background": "repeating-linear-gradient(90deg, #2e2e2e, #2e2e2e 2px, #282828 0, #282828 4px)",
    "padding": "5px 0",
    "padding-left": "10px",
    "font-weight": "bold",
    "color": colorObj.fancyBg[colorDisplayMode]
  })
  $("#OC2-Settings .OC2-settingsCell").css({
    "padding": "5px 0",
    "margin-left": "15px",
    "font-weight": "normal",
    "width": "100%"
  })
  $(".OC2-button").css({
    "margin-left": "5px",
    "padding": "5px 10px",
    "text-align": "center",
    "display": "inline-block",
    "background": colorObj.buttons.background[colorDisplayMode],
    "cursor": "pointer",
    "color": colorObj.buttons.textcolor[colorDisplayMode]
  })
  $(".OC2-button").on("mouseenter", function(event) {
    $(event.currentTarget).css({
      "background": colorObj.buttons.hovercolor[colorDisplayMode]
    })
  })
  $(".OC2-button").on("mouseleave", function(event) {
    $(event.currentTarget).css({
      "background": colorObj.buttons.background[colorDisplayMode]
    })
  })
  $(".OC2-memberIgnoreWrapper").css({
    "position": "relative",
    "margin-bottom": "15px",
    "margin-top": "10px",
    "display": "inline-block"
  })
  $("#OC2-addToIgnoreButton").css({
    "position": "absolute",
    "left": "310px",
    "top": "-4px"
  })
  $("#OC2-ignoreMemberSelect").css({
    "position": "absolute",
    "top": "0px",
    "left": "105px",
    "width": "200px",
  })
  $("#OC2-ignoreMemberInput").css({
    "position": "absolute",
    "top": "-7px",
    "left": "100px",
    "width": "200px",
    "padding": "5px",
    "z-index": "10"
  })
  $(".OC2-infoHover").css({
    "vertical-align": "middle"
  })
  $(".OC2-settingsFooter").css({
    "padding-bottom": "100px",
    "height": "10px"
  })
  styleMemberIgnoreList()
  if (_isWindowTiny.matches || _isWindowSmall.matches ) {
    styleSettingsTiny()
  }
  if (isPDA()) {
    $("#OC2-ignoreMemberInput").off()
    $("#OC2-ignoreMemberInput").css({
      "display": "none"
    })
    $("#OC2-APITestButton").hide()
    $("#OC2-deleteAPIKeyButton").hide()
  }
  $(".OC2-horizLine").css({
    "border-bottom": "1px solid rgb(34,34,34)",
    "width": $(this).parent().width() + "px",
    "box-sizing": "border-box",
    "height": "3px",
  })
}

function styleSettingsTiny() {
  $(".OC2-settingsCell").css({
    "margin-left": "10px"
  })
  $(".OC2-settingsLabel").css({
    "width": "90%",
  })
  $("fieldset.OC2-choice legend").css({
    "float": "left",
    "width": "90%"
  })
  $("fieldset.OC2-choice").css({
    "margin": "10px 0 10px 5px",
  })
  $("fieldset.OC2-choice legend").css({
    "float": "none",
    "margin-bottom": "5px",
  })
  $("fieldset.OC2-choice .OC2-choice-buttons").css({
    "margin-left": "10px",
  })
  $("fieldset.OC2-choice label").css({
    "margin": "0 3px 0 3px",
    "width": "100%"
  })
  $(".OC2-settingsText").css({
    "margin-left": "5px",
    "margin-bottom": "5px"
  })
  $("#OC2-addToIgnoreButton").css({
    "left": "240px",
    "top": "-4px"
  })
  $("#OC2-ignoreMemberSelect").css({
    "top": "0px",
    "left": "85px",
    "width": "150px",
  })
  $("#OC2-ignoreMemberInput").css({
    "top": "-7px",
    "left": "80px",
    "width": "150px",
    "padding": "5px",
    "z-index": "10"
  })
  $(".OC2-memberIgnoreList").css({
    "margin": "5px 0 0 0",
  })
  $(".OC2-memberIgnoreList li").not("li.OC2-ignoreTitles").css({
    "align-items": "center"
  })
  $(".OC2-ignoreName").css({
    "width": "120px"
  })
  $(".OC2-ignoreTime").css({
    "width": "120px",
  })
}

function styleMemberIgnoreList() {
  colorDisplayMode = $("body#body").hasClass("dark-mode") ? "darkmode" : "lightmode"
  $(".OC2-memberIgnoreList a").css({
    "color": "inherit"
  })
  $(".OC2-memberIgnoreList").css({
    "display": "flex",
    "flex-direction": "row",
    "margin": "5px 0 0 10px",
    "flex-wrap": "wrap"
  })
  $(".OC2-memberIgnoreList li").css({
    "display": "flex",
    "flex-direction": "row",
    "width": parseInt(containerBigMaxWidth) + "px",
    "padding": "3px 0",
    "align-items": "center"
  })
  $(".OC2-ignoreName").css({
    "width": "200px"
  })
  $(".OC2-ignoreTime").css({
    "width": "200px"
  })
  $(".OC2-ignoreButtons .OC2-button").css({
    "margin-top": "3px",
    "margin-left": "-10px",
    "padding": "5px 10px",
    "text-align": "center",
    "display": "inline-block",
    "background": colorObj.buttons.background[colorDisplayMode],
    "cursor": "pointer",
    "color": colorObj.buttons.textcolor[colorDisplayMode]
  })
  $(".OC2-button").on("mouseenter", function(event) {
    $(event.currentTarget).css({
      "background": colorObj.buttons.hovercolor[colorDisplayMode]
    })
  })
  $(".OC2-button").on("mouseleave", function(event) {
    $(event.currentTarget).css({
      "background": colorObj.buttons.background[colorDisplayMode]
    })
  })
  if (_isWindowSmall.matches || _isWindowTiny.matches ) {
    styleSettingsTiny()
  }
}

function fillMemberIgnoreList() {
  $(".OC2-memberIgnoreList li").not("li.OC2-ignoreTitles").remove()
  //this breaks easily lol
  if (!userSettings.memberIgnoreList) {
    return
  }
  if (!displayIgnoreList) {
    return
  }
  if (displayIgnoreList.length == 0) {
    return
  }
  displayIgnoreList.forEach( (_id) => {
    _id = _id.toString()
    //remove stray memberIDs if they are not part of the faction
    if (!memberInfo[_id]) {
      displayIgnoreList = displayIgnoreList.filter(item => item !== _id)
      return
    }
    $(".OC2-memberIgnoreList").append(`<li data-memberid="${_id}">
      <div class="OC2-ignoreName">${memberInfo[_id].name} [${_id}]</div>
      <div class="OC2-ignoreTime">${memberInfo[_id].last_action.relative}</div>
      <div class="OC2-ignoreButtons"><div class="OC2-button">Remove</div></div>
    </li>`)
    $(`li[data-memberid=${_id}] div.OC2-button`).off().on("click", (event) => {
      displayIgnoreList = displayIgnoreList.filter(item => item !== _id)
      fillMemberIgnoreList()
    })
  })
  styleMemberIgnoreList()
}

async function settingsFillSelect() {
  if (!myAPIData) {
    let _APITest = await getAndAnalyzeAPIData()
    if (_APITest.error) {
      $("#OC2-addToIgnoreButton").hide()
      $("#OC2-ignoreMemberInput").prop("disabled", true)
      $("#OC2-ignoreMemberSelect").prop("disabled", true)
      $(".OC2-memberIgnoreWrapper").parent().prepend(`<div class="color-red OC2-errorAPIKey">This function requires an API key to be registered</div>`)
      return
    }
  }
  let _insertOption = ""
  let _displayMemberList = myAPIData.members
  _displayMemberList.sort( (a,b) => (a.name).localeCompare(b.name))
  _displayMemberList.forEach( (member) => {
    _insertOption += (`<option value="${member.id}">${member.name} [${member.id}]</option>`)
  })
  $("#OC2-ignoreMemberSelect").append(_insertOption)
  //fill up displayIgnoreList, also syntax is like this as a PDA fix
  if (userSettings.memberIgnoreList) {
    displayIgnoreList = userSettings.memberIgnoreList
  } else {
    displayIgnoreList = []
  }
  fillMemberIgnoreList()
}
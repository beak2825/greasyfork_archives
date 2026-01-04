// ==UserScript==
// @name     CL 多台系統-測試
// @description CL 多台系統-測試中
// @license MIT
// @version  0.0.7
// @include *://www.cali999.net/*
// @include *://www.cali888.net/*
// @include *://www.cali777.net/*
// @include *://www.cali666.net/*
// @include *://www.cali555.net/*
// @include *://www.cali333.net/*
// @include *://www.cali1122.net/*
// @include *://www.cali2233.net/*
// @include *://www.calibet8.net/*
// @include *://www.calibet9.net/*
// @include *://www.cali1356a.net/*
// @include *://www.cali1356b.net/*
// @grant    GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1028078
// @downloadURL https://update.greasyfork.org/scripts/461241/CL%20%E5%A4%9A%E5%8F%B0%E7%B3%BB%E7%B5%B1-%E6%B8%AC%E8%A9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/461241/CL%20%E5%A4%9A%E5%8F%B0%E7%B3%BB%E7%B5%B1-%E6%B8%AC%E8%A9%A6.meta.js
// ==/UserScript==
//----------------------------------

var host;
var username;
var password;
var room;
var bet;
var chipCode1;
var chipCode2;
//----------------------------------

var RefreshObserver = null;
var ErrorMsgObserver = null;

const loginFaileThreshold = 1000 * 60;
const goDragonFaileThreshold = 1000 * 20;
var LoginFailedMethod;
var GoToMutiTableFailedMethod;

InsertButton();
document.onreadystatechange = function () {
  host = unsafeWindow.host;
  username = unsafeWindow.username;
  password = unsafeWindow.password;
  room = unsafeWindow.room;
  bet = unsafeWindow.bet;
  chipCode1 = unsafeWindow.chipCode1;
  chipCode2 = unsafeWindow.chipCode2;
  OnWebStateChanged();
};

function InsertButton() {
  var zNode = document.createElement('div');
  zNode.innerHTML = `<button id="myButton" type="button">Enter Room</button><br>`;
  zNode.setAttribute('id', 'myContainer');
  var first = document.body.firstChild;
  document.body.insertBefore(zNode, first);
  document
    .getElementById('myButton')
    .addEventListener('click', GoLoginPage, false);
}


function OnWebStateChanged() {
  if (document.readyState === 'complete') {
    ChangeBetListThroughLocalStorage();
    if (RefreshObserver != null) {
      RefreshObserver.disconnect();
      RefreshObserver = null;
    }
    RefreshObserver = new MutationObserver(mutations => {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (addn) {
          if (addn === undefined) {
            return;
          }
          if (addn.classList != undefined) {
            if (addn.classList.contains('tableWrap')) {
              clearTimeout(GoToMutiTableFailedMethod);
              HandleTableWrap(addn);
            }
          }
          if (addn.id === 'loginPage') {
            setTimeout(function () {
              ReLoginWebsite();
            }, 3000);
          }
        });
        mutation.removedNodes.forEach(function (n) {
          // console.log(n)
          if (n === undefined) {
            return;
          }
          if (n.id === 'loginPage') {
            console.log('cancel login faile method');
            clearTimeout(LoginFailedMethod);
            setTimeout(function () {
              console.log('NavigateToMutiTable');
              NavigateToMutiTable();
            }, 3000);
          }
        });
      });
    });

    RefreshObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });
  }
}
function ChangeBetListThroughLocalStorage() {

  
  let CustomChipDefaultSetting = `{"chip1":{"value":"${(bet - 1) * 100}","isSelected":true},"chip2":{"value":"${(bet) * 100}","isSelected":true},"chip3":{"value":"${(bet + 1) * 100}","isSelected":true},"chip4":{"value":"${(bet + 2) * 100}","isSelected":true},"chip5":{"value":"${(bet + 3) * 100}","isSelected":true}}`;
  localStorage.setItem("playerTableCustomChip", CustomChipDefaultSetting);

  let ChipSetDefaultSetting = "{"
  for(i=0;i<chipCode1.length;i++){
　		ChipSetDefaultSetting+=`"handicapId${chipCode1[i]}":["${(bet - 1) * 100}","${(bet) * 100}","${(bet + 1) * 100}","${(bet + 2) * 100}","${(bet + 3) * 100}"]`;
    if(i!=chipCode1.length-1)
      ChipSetDefaultSetting+=",";
	}
  ChipSetDefaultSetting+="}";
  console.log(ChipSetDefaultSetting)
  localStorage.setItem("playerTableChipSet", ChipSetDefaultSetting);

  let VipChipDefaultSetting = `{"handicapId${chipCode2}":["50","100","200","500","1000","2000","5000","10000","20000","50000","100000","200000","500000","1000000","2000000"]}`;
  localStorage.setItem("vipPlayerTableChipSet", VipChipDefaultSetting);

}
function NavigateToMutiTable() {
  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', true, true);
  document.getElementsByClassName('MULTITABLE')[0].dispatchEvent(evt);
  GoToMutiTableFailedMethod = setTimeout(GoLoginPage, goDragonFaileThreshold);
}

function GoLoginPage(zEvent) {
  window.location.href = host;
}

function ReLoginWebsite() {
  document.getElementById('mLoginInput').value = username;
  document.getElementById('mPasswordInput').value = password;
  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', true, true);
  document.getElementById('loginBtn').dispatchEvent(evt);
  console.log('Login...');
  LoginFailedMethod = setTimeout(GoLoginPage, loginFaileThreshold);
}

function HandleTableWrap(tableWrap) {
  console.log("find!!")
  setTimeout(function () {
    let tableNameNode = tableWrap.querySelector(".MultiTableTableName")

    if (!room.some(t => tableNameNode.innerText.includes(t))) {
      console.log("砍掉: " + tableNameNode.innerText)
      tableWrap.remove();
    } else {
      console.log("保留: " + tableNameNode.innerText)
      tableWrap.style.height = '100px';
      tableWrap.style.backgroundColor = "#000000"
      var tableName = tableWrap.querySelector(".tableName");
      tableName.style.fontSize = '44px';
      tableName.style.top = '50px'
      var road = tableWrap.querySelector(".Baccarat8MultiTableRoadmap");
      road.remove();
      StartMonitorTotal(tableWrap);
      StartMonitorErrorMsg();
    }
  }, 3000);
}


function StartMonitorTotal(tableWrap) {
  var tableName = tableWrap.querySelector(".tableName");
  let zNode = document.createElement('div');
  zNode.setAttribute('id', 'myRound');
  zNode.style.textAlign = 'left';
  zNode.style.width = '100px'
  zNode.style.left = '41px';
  zNode.style.color = "#FF0000"
  zNode.style.textAlign = 'center';
  zNode.style.backgroundColor = "#000000"
  zNode.style.fontSize = '44px'

  tableName.parentNode.append(zNode);
  let totalValueNode = tableWrap.querySelector(".detailContainer.evenBg.baccarat")
    .querySelector(".detailTitle.yellow.Total")
    .parentNode
    .querySelector(".detailValue")
  zNode.innerText = totalValueNode.innerText;
  let TotalRoundObserver = new MutationObserver(mutations => {
    mutations.forEach(function (mutation) {
      zNode.innerText = mutation.target.innerText;
      console.log("Total Monitor:");
      console.log(mutation.target.innerText);
    });
  });

  TotalRoundObserver.observe(totalValueNode, {
    childList: true,
    attributes: true,
    characterData: true,
  });
}


function StartMonitorErrorMsg() {
  if (ErrorMsgObserver != null) {
    ErrorMsgObserver.disconnect();
    ErrorMsgObserver = null;
  }
  ErrorMsgObserver = new MutationObserver(mutations => {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (n) {
        TableEventHandleNodeAdded(n);
      });
    });
    mutations.forEach(function (mutation) {
      mutation.removedNodes.forEach(function (n) {
        TableEventHandleNodeRemoved(n);
      });
    });
  });
  ErrorMsgObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
}

function TableEventHandleNodeRemoved(n) {
  if (n === undefined) {
    return;
  }

  var popup = n.classList.contains('confirmMessagePopup');
  if (popup) {
    setTimeout(function () {
      console.log('kick out window close, and NavigateToDragon')
      GoLoginPage(null);
    }, 2000);
  }
}
function TableEventHandleNodeAdded(n) {
  if (n === undefined) {
    return;
  }

  var popup = n.classList.contains('inTablePopup');
  var popupMsg = n.classList.contains('confirmMessagePopup');
  var reconnectMsg = n.classList.contains('reconnect');

  if (popup || popupMsg) {
    console.log('Error message popup');

    if (reconnectMsg) {
      setTimeout(function () {
        console.log('kick out window close, and NavigateToDragon')
        GoLoginPage(null);
      }, 2000);

    } else {
      setTimeout(function () {
        const sureBtns = document.getElementsByClassName('confirm');
        if (sureBtns.length > 0) {
          console.log('close sure window')
          var clickSureEvent = document.createEvent('HTMLEvents');
          clickSureEvent.initEvent('click', true, true);
          sureBtns[0].dispatchEvent(clickSureEvent);
        } else
          console.log('close sure not found')
      }, 2000);
    }
  }
}


// ==UserScript==
// @name CL 系統
// @description CL 更新
// @license MIT
// @version  2.0.0
// @include *://www.cali111.net/*
// @include *://www.cali222.net/*
// @include *://www.cali333.net/*
// @include *://www.cali444.net/*
// @include *://www.cali555.net/*
// @include *://www.cali666.net/*
// @include *://www.cali777.net/*
// @include *://www.cali888.net/*
// @include *://www.cali999.net/*
// @grant GM.xmlHttpRequest
// @namespace https://greasyfork.org/users/1028078
// @downloadURL https://update.greasyfork.org/scripts/460127/CL%20%E7%B3%BB%E7%B5%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/460127/CL%20%E7%B3%BB%E7%B5%B1.meta.js
// ==/UserScript==
var host;
var username;
var password;
var room;

//----------------------------------

var DragonObserver = null;
var RefreshObserver = null;
var ErrorMsgObserver = null;

const loginFaileThreshold = 1000 * 60;
const goDragonFaileThreshold = 1000 * 20;
var LoginFailedMethod;
var GoToDragonFailedMethod;

var NeedToRelogin = false;
const NeedToReloginThreshold = 1000 * 60 * 30;

setTimeout(function () {
  NeedToRelogin = true;
}, NeedToReloginThreshold);

InsertButton();
document.onreadystatechange = function () {
  console.log(unsafeWindow.host)
  host = unsafeWindow.host;
  username = unsafeWindow.username;
  password = unsafeWindow.password;
  room = unsafeWindow.room;
  OnWebStateChanged();
};

function InsertButton() {
  var zNode = document.createElement('div');
  zNode.innerHTML = `<button id="myButton" type="button">Enter Room</button><br>
                     <button id="btn_prepare" type="button">Prepare</button>`;
  zNode.setAttribute('id', 'myContainer');
  var first = document.body.firstChild;
  document.body.insertBefore(zNode, first);
  document
    .getElementById('myButton')
    .addEventListener('click', GoLoginPage, false);
  
  document
    .getElementById('btn_prepare')
    .addEventListener('click', Prepare, false);
}

function Prepare()
{
  console.log("prepare");
   if (ErrorMsgObserver != null) {
    ErrorMsgObserver.disconnect();
    ErrorMsgObserver = null;
  }
    
  NavigateToDragon()
}

function OnWebStateChanged() {
  if (document.readyState === 'complete') {
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
              console.log('NavigateToDragon');
              NavigateToDragon();
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

function NavigateToDragon() {
  if (DragonObserver != null) {
    DragonObserver.disconnect();
    DragonObserver = null;
  }
  DragonObserver = new MutationObserver(mutations => {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (n) {
        if (n.data) {
          let roomID = room;
          if (n.data.includes(' ' + roomID)) {
            setTimeout(function () {
              console.log('cancel Go Dragon faile method');
              clearTimeout(GoToDragonFailedMethod);
              enterRoom();
            }, 2000);
          }
        }
      });
    });
  });

  DragonObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });

  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', true, true);
  document.getElementsByClassName('DRAGON_HALL')[0].dispatchEvent(evt);
  GoToDragonFailedMethod = setTimeout(GoLoginPage, goDragonFaileThreshold);
}

// simulate click evnet
function enterRoom() {
  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('click', true, false);
  console.log(room);

  for (const div of document.querySelectorAll('div')) {
    if (div === undefined || div.classList === undefined) {
      continue;
    }
    if (div.classList != 'tableName') {
      continue;
    }
    if (div.textContent.includes(' ' + room)) {
      div.dispatchEvent(evt);
      if (RefreshObserver != null) {
        RefreshObserver.disconnect();
        RefreshObserver = null;
      }
      if (DragonObserver != null) {
        DragonObserver.disconnect();
        DragonObserver = null;
      }
      StartMonitorErrorMsg();
      return;
    }
  }
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
   			enterRoom();
     },2000);
  }
}
function TableEventHandleNodeAdded(n) {
  if (n === undefined) {
    return;
  }
  
  var popup = n.classList.contains('inTablePopup');
  var popupMsg = n.classList.contains('confirmMessagePopup');

  if (popup || popupMsg){
    console.log('Error message popup');  
    if (NeedToRelogin) {
      NeedToRelogin = false;
      GoLoginPage();
    }else{
      setTimeout(function () {
      	const sureBtns = document.getElementsByClassName('confirm');
      	if (sureBtns.length > 0) {
          console.log('close sure window')
        	var clickSureEvent = document.createEvent('HTMLEvents');
        	clickSureEvent.initEvent('click', true, true);
        	sureBtns[0].dispatchEvent(clickSureEvent);
        }
      }, 2000);
    }
  }
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
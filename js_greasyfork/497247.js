// ==UserScript==
// @name         BugMeNot Everywhere
// @namespace    StephenP
// @homepage     https://greasyfork.org/scripts/35957/
// @supportURL   https://greasyfork.org/scripts/35957/feedback
// @version      1.2.0
// @description  Add a list of login accounts from BugMeNot ( bugmenot.com ) on any website when clicking on password input
// @author       StephenP
// @icon         http://bugmenot.com/favicon.ico
// @match        *://*/*
// @connect      bugmenot.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/497247/BugMeNot%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/497247/BugMeNot%20Everywhere.meta.js
// ==/UserScript==

/*
  Original script by Hồng Minh Tâm (https://greasyfork.org/users/37096/)
  Original script page: https://greasyfork.org/scripts/35957/
*/

const inputElsQuery='input:not([type]):not([data-bmn-checked="true"]), input[type=text]:not([data-bmn-checked="true"]), input[type=email]:not([data-bmn-checked="true"]), input[type=tel]:not([data-bmn-checked="true"]), input[type=password]:not([data-bmn-checked="true"])'
function getLogins() {
  'use strict';

  const icons = {
    username: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 172"><path fill="currentColor" d="M114.66667,50.16667c0,15.83216 -12.8345,28.66667 -28.66667,28.66667c-15.83216,0 -28.66667,-12.8345 -28.66667,-28.66667c0,-15.83216 12.8345,-28.66667 28.66667,-28.66667c15.83216,0 28.66667,12.8345 28.66667,28.66667zM86,114.66667c9.374,0 17.62608,-4.56102 22.85775,-11.51986c20.1885,4.472 41.64225,14.27902 41.64225,29.43652v17.91667h-129v-17.91667c0,-15.1575 21.45375,-24.96452 41.64225,-29.43652c5.23167,6.95883 13.48375,11.51986 22.85775,11.51986z"></path></svg>',
    password: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 172 172"><path fill="currentColor" d="M50.16667,35.83333c-27.70633,0 -50.16667,22.46033 -50.16667,50.16667c0,27.70633 22.46033,50.16667 50.16667,50.16667c22.72313,0 41.89756,-15.11458 48.06706,-35.83333h30.76628v21.5h28.66667v-21.5h14.33333v-28.66667h-73.76628c-6.1695,-20.71875 -25.34393,-35.83333 -48.06706,-35.83333zM50.16667,64.5c11.87517,0 21.5,9.62483 21.5,21.5c0,11.87517 -9.62483,21.5 -21.5,21.5c-11.87517,0 -21.5,-9.62483 -21.5,-21.5c0,-11.87517 9.62483,-21.5 21.5,-21.5z"></path></svg>',
  }

  GM_addStyle([
    '.bmn-list { display:none; list-style: none; border: 1px solid #ccc; padding: 0; margin: 0; background-color: #fff; position: fixed; cursor: default; z-index: 9999999999; box-sizing: border-box; overflow: auto; text-align: left; }',
    '.bmn-list.show { display:block; }',
    '.bmn-list .bmn-row { position: relative; margin: 0 5px 5px 5px; display: -ms-flexbox; display: -webkit-flex; display: flex; }',
    '.bmn-list .bmn-row:last-child { margin-bottom: 0; }',
    '.bmn-list .bmn-col { position: relative; display: -ms-flexbox; display: -webkit-flex; display: flex; -webkit-flex-direction: column; -ms-flex-direction: column; flex-direction: column; }',
    '.bmn-list .bmn-full { -webkit-flex: 1 0 auto; -ms-flex: 1 0 auto; flex: 1 0 auto; }',
    '.bmn-list .bmn-align-items-center { -webkit-align-items: center; -ms-flex-align: center; align-items: center; }',
    '.bmn-list .bmn-align-self-center { -webkit-align-self: center; -ms-flex-item-align: center; align-self: center; }',
    '.bmn-list .bmn-justify-content-center { -webkit-justify-content: center; -ms-flex-pack: center; justify-content: center; }',
    '.bmn-list .bmn-item { position: relative; padding: 5px 2px 5px 7px; margin: 0; cursor: pointer; border-bottom: 1px solid rgba(0,0,0,.125); color: #495057; }',
    '.bmn-list .bmn-item:last-child { border-bottom: 0; }',
    '.bmn-list .bmn-item:hover { background-color: #f8f9fa; }',
    '.bmn-list .bmn-item:before { position: absolute; content: ""; width: 5px; top: 0; left: 0; bottom: 0; background-color: #f7704f; }',
    '.bmn-list .bmn-item .bmn-icon { width: 32px; height: 32px; padding: 5px; background-color: #e9ecef; border: 1px solid #ced4da; }',
    '.bmn-list .bmn-item .bmn-username { margin-left: 10px; font-weight: 700; }',
    '.bmn-list .bmn-item .bmn-password { margin-left: 10px; color: #666; }',
    '.bmn-list .bmn-item .bmn-success { display: inline-block; font-weight: 700; }',
    '.bmn-list .bmn-item.bmn-success-100 .bmn-success { color: rgb(0,198,0); }',
    '.bmn-list .bmn-item.bmn-success-100:before { background-color: rgb(0,198,0); }',
    '.bmn-list .bmn-item.bmn-success-90 .bmn-success { color: rgb(50,180,0); }',
    '.bmn-list .bmn-item.bmn-success-90:before { background-color: rgb(50,180,0); }',
    '.bmn-list .bmn-item.bmn-success-80 .bmn-success { color: rgb(99,164,0); }',
    '.bmn-list .bmn-item.bmn-success-80:before { background-color: rgb(99,164,0); }',
    '.bmn-list .bmn-item.bmn-success-70 .bmn-success { color: rgb(149,146,0); }',
    '.bmn-list .bmn-item.bmn-success-70:before { background-color: rgb(149,146,0); }',
    '.bmn-list .bmn-item.bmn-success-60 .bmn-success { color: rgb(199,129,0); }',
    '.bmn-list .bmn-item.bmn-success-60:before { background-color: rgb(199,129,0); }',
    '.bmn-list .bmn-item.bmn-success-50 .bmn-success { color: rgb(247,112,0); }',
    '.bmn-list .bmn-item.bmn-success-50:before { background-color: rgb(247,112,0); }',
    '.bmn-list .bmn-item.bmn-success-40 .bmn-success { color: rgb(247,90,0); }',
    '.bmn-list .bmn-item.bmn-success-40:before { background-color: rgb(247,90,0); }',
    '.bmn-list .bmn-item.bmn-success-30 .bmn-success { color: rgb(247,67,0); }',
    '.bmn-list .bmn-item.bmn-success-30:before { background-color: rgb(247,67,0); }',
    '.bmn-list .bmn-item.bmn-success-20 .bmn-success { color: rgb(247,45,0); }',
    '.bmn-list .bmn-item.bmn-success-20:before { background-color: rgb(247,45,0); }',
    '.bmn-list .bmn-item.bmn-success-10 .bmn-success { color: rgb(247,22,0); }',
    '.bmn-list .bmn-item.bmn-success-10:before { background-color: rgb(247,22,0); }',
    '.bmn-list .bmn-item .bmn-vote { display: inline-block; margin-left: 16px; float: right; }',
    '.bmn-list .bmn-no-logins-found { padding: 5px 10px; margin: 0; cursor: default; text-align: center; background-color: #a90000; color: #fff; }',
  ].join(''));

  Object.defineProperty(String.prototype, 'toDOM', {
    value: function (isFull) {
      var parser = new DOMParser(),
        dom = parser.parseFromString(this, 'text/html');
      return isFull ? dom : dom.body.childNodes[0];
    },
    enumerable: false
  });

  function setValueInput(input, value, isInputSimulate) {
    var setValue = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setValue.call(input, value);
    if (isInputSimulate) {
      var e = new Event('input', {
        bubbles: true
      });
      input.dispatchEvent(e);
    }
  }

  function getOffset(element) {
    var elementRect = element.getBoundingClientRect();
    return {
      left: elementRect.left,
      right: elementRect.right,
      top: elementRect.top,
      bottom: elementRect.bottom,
    };
  }

  function handleEvent(func, data) {
    return function (event) {
      func.bind(this)(event, data);
    };
  }

  var accounts = [];
  var inputUsernameCurrentEl, inputPasswordCurrentEl;
  var minHeightListBMN = 100;
  GM_xmlhttpRequest({
    method: 'GET',
    url: 'http://bugmenot.com/view/' + location.hostname,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    onload: function (response) {
      var bmnEl = response.responseText.toDOM(true);
      var accountEls = bmnEl.getElementsByClassName('account');
      if(accountEls.length>0){
        for (var i = 0; i < accountEls.length; i++) {
          var accountEl = accountEls[i];
          var infoEl = accountEl.getElementsByTagName('kbd');
          var statsEl = accountEl.getElementsByClassName('stats')[1].getElementsByTagName('li');
          var account = {
            username: infoEl[0].innerHTML || '',
            password: infoEl[1].innerHTML || '',
            success: parseInt(statsEl[0].innerHTML.match(/\d+(?=%)/)[0]),
            vote: parseInt(statsEl[1].innerHTML.match(/\d+(?=\svotes)/)[0]),
            time: statsEl[2].innerHTML
          };
          accounts.push(account);
        }
        console.log(accounts)
        init();
      }
      else{
        if(response.responseText.includes("This site has been barred from the bugmenot system.")){
          alert("This site has been barred from the bugmenot system.");
          changeForThisSite();
        }
        else{
          alert("No accounts available at the moment.");
        }
      }
    },
    onerror: function (response) { }
  });

  function init() {
    checkAndEventToInput();
    var listBMNEl = document.createElement('ul');
    listBMNEl.classList.add('bmn-list');
    document.body.appendChild(listBMNEl);

    function showListBMNEl() {
      listBMNEl.classList.add('show');
    }

    function hideListBMNEl() {
      listBMNEl.classList.remove('show');
    }

    if (accounts.length) {
      accounts.forEach(function (account, index) {
        var itemBMNEl = document.createElement('li');
        itemBMNEl.classList.add('bmn-item');
        itemBMNEl.classList.add(getClassSuccess(account.success));
        var itemBMNElHTML = [
          '<div class="bmn-row">',
          '  <div class="bmn-col bmn-full">',
          '    <div class="bmn-row bmn-align-items-center">',
          '      <div class="bmn-icon">' + icons.username + '</div>',
          '      <span class="bmn-username">' + account.username + '</span>',
          '    </div>',
          '    <div class="bmn-row bmn-align-items-center">',
          '      <div class="bmn-icon">' + icons.password + '</div>',
          '      <span class="bmn-password">' + account.password + '</span>',
          '    </div>',
          '  </div>',
          '  <div class="bmn-col bmn-align-self-center">',
          '    <div class="bmn-success">' + account.success + '%</div>',
          '  </div>',
          '</div>',
          '<div class="bmn-row">',
          '  <div class="bmn-vote">' + account.vote + ' votes</div>',
          '</div>',
          // ',<div class="time">' + account.time + '</div>',
        ].join('');
        itemBMNEl.innerHTML = itemBMNElHTML;
        itemBMNEl.title = [
          'Username: ' + account.username,
          'Password: ' + account.password,
          '',
          account.success + '% success rate',
          account.vote + ' votes',
          account.time
        ].join('\n');
        itemBMNEl.onmousedown = handleEvent(onMouseDownItem);
        itemBMNEl.onclick = handleEvent(onClickItem, account);
        itemBMNEl.onmouseover = handleEvent(onMouseOverItem, account);
        itemBMNEl.onmouseout = handleEvent(onMouseOutItem);
        listBMNEl.appendChild(itemBMNEl);
      });
    } else {
      var itemBMNNoLoginsFoundEl = document.createElement('li');
      itemBMNNoLoginsFoundEl.classList.add('bmn-no-logins-found');
      itemBMNNoLoginsFoundEl.innerHTML = 'No logins found';
      listBMNEl.appendChild(itemBMNNoLoginsFoundEl);
    }

    window.onscroll = function (event) {
      if (inputUsernameCurrentEl) {
        addStyleListBMNEl(inputUsernameCurrentEl);
      }
    };

    window.onresize = function (event) {
      if (inputUsernameCurrentEl) {
        addStyleListBMNEl(inputUsernameCurrentEl);
      }
    };

    var enableMouseOut = true;

    function setValueInputItem(inputUsernameEl, inputPasswordEl, username, password, isInputSimulate) {
      // inputUsernameEl.value = username;
      // inputPasswordEl.value = password;
      setValueInput(inputUsernameEl, username, isInputSimulate);
      setValueInput(inputPasswordEl, password, isInputSimulate);
    }

    function onMouseDownItem(event) {
      event.preventDefault();
    }

    function onClickItem(event, account) {
      event.stopPropagation();
      enableMouseOut = false;
      if (inputUsernameCurrentEl && inputPasswordCurrentEl) {
        setValueInputItem(inputUsernameCurrentEl, inputPasswordCurrentEl, account.username, account.password, true);
        inputUsernameCurrentEl.setAttribute('value', account.username);
        hideListBMNEl();
      }
    }

    function onMouseOverItem(event, account) {
      if (inputUsernameCurrentEl && inputPasswordCurrentEl) {
        setValueInputItem(inputUsernameCurrentEl, inputPasswordCurrentEl, account.username, account.password);
      }
    }

    function onMouseOutItem(event) {
      if (!enableMouseOut) {
        enableMouseOut = true;
        return;
      }
      if (inputUsernameCurrentEl && inputPasswordCurrentEl) {
        setValueInputItem(inputUsernameCurrentEl, inputPasswordCurrentEl, '', '');
      }
    }

    function getClassSuccess(success) {
      if (success > 91) return 'bmn-success-100';
      else if (success > 81) return 'bmn-success-90';
      else if (success > 71) return 'bmn-success-80';
      else if (success > 61) return 'bmn-success-70';
      else if (success > 51) return 'bmn-success-60';
      else if (success > 31) return 'bmn-success-50';
      else if (success > 21) return 'bmn-success-30';
      else if (success > 11) return 'bmn-success-20';
      else return 'bmn-success-10';
    }

    function addStyleListBMNEl(inputEl) {
      listBMNEl.style.width = inputEl.offsetWidth + 'px';
      var offsetTarget = getOffset(inputEl);
      var windowHeight = document.documentElement.clientHeight;
      if (offsetTarget.top >= minHeightListBMN) {
        listBMNEl.style.bottom = (windowHeight - offsetTarget.top) + 'px';
        listBMNEl.style.top = '';
        listBMNEl.style.left = offsetTarget.left + 'px';
        listBMNEl.style.maxHeight = offsetTarget.top + 'px';
      } else {
        listBMNEl.style.top = offsetTarget.bottom + 'px';
        listBMNEl.style.bottom = '';
        listBMNEl.style.left = offsetTarget.left + 'px';
        listBMNEl.style.maxHeight = (windowHeight - offsetTarget.bottom) + 'px';
      }
    }

    function onFocusInput(event, data) {
      inputUsernameCurrentEl = data.inputUsernameEl;
      inputPasswordCurrentEl = data.inputPasswordEl;
      addStyleListBMNEl(inputUsernameCurrentEl);
      showListBMNEl();
    }

    function onBlurInput(event) {
      if (!event.target.isSameNode(document.activeElement)) {
        hideListBMNEl();
      }
    }

    function onInputInput(event) {
      enableMouseOut = false;
      hideListBMNEl();
    }

    function checkAndEventToInput() {
      var inputEls = document.querySelectorAll(inputElsQuery);
      if (inputEls.length > 1) {
        for (var i = 1; i < inputEls.length; i++) {
          inputEls[i].dataset.bmnChecked = true;
          if (inputEls[i].type === 'password') {
            if ((inputEls[i + 1] && inputEls[i + 1].type === 'password')) {
              continue;
            }

            if (inputEls[i - 1]) {
              if (inputEls[i - 1].type === 'password') {
                continue;
              } else {
                var inputUsernameEl = inputEls[i - 1];
                var inputPasswordEl = inputEls[i];
                var data = {
                  inputUsernameEl: inputUsernameEl,
                  inputPasswordEl: inputPasswordEl
                };
                inputUsernameEl.onclick = handleEvent(onFocusInput, data);
                inputUsernameEl.onfocus = handleEvent(onFocusInput, data);
                inputUsernameEl.onblur = handleEvent(onBlurInput);
                inputUsernameEl.oninput = handleEvent(onInputInput);
                if (inputUsernameEl.isSameNode(document.activeElement)) onFocusInput(undefined, data);
              }
            }
          }
        }
      }
    }

    var observeDOM = (function () {
      var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

      return function (obj, callback) {
        if (MutationObserver) {
          var obs = new MutationObserver(function (mutations, observer) {
            if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
              callback();
            }
          });
          obs.observe(obj, {
            childList: true,
            subtree: true
          });
        } else if (eventListenerSupported) {
          obj.addEventListener('DOMNodeInserted', callback, false);
          obj.addEventListener('DOMNodeRemoved', callback, false);
        }
      };
    })();

    observeDOM(document, function () {
      checkAndEventToInput();
    });
  }
}
var alreadyRun=false;
var url;
//list of disabled sites (synced with the "disabledSites" list saved with GM_setValue())
var disabledSites=[];
var l;
//localizations in JSON format
const jsonLocalization=JSON.parse(`
{
    "en": {
        "disableFor": "Disable for ",
        "enableFor": "Enable again for ",
		"disabledSites": "Disabled sites: ",
		"isDisabled": " is currently disabled.",
		"isNotDisabled": " isn't currently disabled."
	},
    "it": {
        "disableFor": "Disabilita per ",
        "enableFor": "Abilita nuovamente per ",
		"disabledSites": "Siti disabilitati: ",
		"isDisabled": " è attualmente disabilitato.",
		"isNotDisabled": " non è attualmente disabilitato."
    }
}
`);

//Program start: checks and sets the language, looks for which sites the execution has been disabled and launches the function to add the specific css and js for each site.
(async function(){
  let lang=getLang();
  if(lang.startsWith("it")){
    l=jsonLocalization.it;
  }
  else{
    l=jsonLocalization.en;
  }
  disabledSites=await getDisabledSites();
  if(!disabledSites.includes(document.location.hostname)){
    GM_registerMenuCommand(l.disableFor+document.location.hostname, changeForThisSite, "D");
    start();
  }
  else{
    GM_registerMenuCommand(l.enableFor+document.location.hostname, changeForThisSite, "E");
  }
})();



function start(){
  var inputFields=document.querySelectorAll("input[type=password]:not([data-bmn-checked='true']");
  for(let iF of inputFields){
    iF.addEventListener("click",chooseLogin);
  }
}

function chooseLogin(){
  if(!alreadyRun){
    if (confirm("Do you want to use BugMeNot to log in?") == true) {
      getLogins();
    } else {
      if(confirm("Remember this choice for "+window.location.hostname+"?")==true){
        changeForThisSite();
      }
    }
    alreadyRun=true;
  }
}






function getLang() {
  try{
    if (navigator.languages != undefined)
      return navigator.languages[0];
    return navigator.language;
  }
  catch(e){
    return "en"
  }
}
async function getDisabledSites(){
  var dS=await GM_getValue("disabledSites");
  console.log(l.disabledSites+dS);
  if(dS){
		return dS.split(',');
  }
  else{
    return [];
  }
}
//this function switches the setting of a site from enabled to disabled and viceversa
function changeForThisSite(){
  let tS=document.location.hostname;
  if(disabledSites.includes(tS)){
    console.log(tS+l.isDisabled);
    var filtered = disabledSites.filter(function(value){
      return value !== document.location.hostname;
    });
    console.log(filtered);
    disabledSites=filtered;
    GM_setValue("disabledSites",filtered.join(","));
    document.location.reload();
  }
  else if(!disabledSites.includes(tS)){
    console.log(tS+l.isNotDisabled);
    disabledSites.push(tS);
    GM_setValue("disabledSites",disabledSites.join(","));
    document.location.reload();
  }
}
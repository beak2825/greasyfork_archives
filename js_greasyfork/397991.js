// ==UserScript==
// @name               自动登录到GreasyFork
// @name:zh-CN         自动登录到GreasyFork
// @name:en            Automatically login to GreasyFork by GitHub.
// @description        通过GitHub自动登录到GreasyFork。
// @description:zh-CN  通过GitHub自动登录到GreasyFork。
// @description:en     Automatically login to GreasyFork by GitHub.
// @namespace          https://github.com/HaleShaw
// @version            1.0.3
// @author             HaleShaw
// @copyright          2020+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-ALGreasyFork
// @supportURL         https://github.com/HaleShaw/TM-ALGreasyFork/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAAAAAAAAAAAAAAAAAAAAAAABAQEAAAD///8FBQUQEBAMDAzy8vLq6uoUFBTj4+Pf398ZGRn19fXu7u5/f390dHQ9PT0jIyPl5eXk5OTExMS1tbWmpqagoKApKSkfHx9pXf6IAAAAB3RSTlMA+tmelyPQ+DFQWAAAAIZJREFUGNNlz9cOwyAMQFEzHJuR1Yzu9v//ssagNlLvC9LBSAZK6K0x1iO03B5Ic6B19BqbdHpPUziPvxnc3/NBEHzs52EK66WKB0tJ5Mp8V7BgSGRl5qeCERDJAn2qYMsRb4+Fl6hPPNXiibOIB6TWIJIIAdxXMm+urt6Km65+mCn3f9//ABblB2YEl8VXAAAAAElFTkSuQmCC
// @require            https://greasyfork.org/scripts/398010-commonutils/code/CommonUtils.js?version=781197
// @match              https://greasyfork.org/*
// @compatible         Chrome
// @grant              GM_addStyle
// @grant              GM_info
// @downloadURL https://update.greasyfork.org/scripts/397991/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%88%B0GreasyFork.user.js
// @updateURL https://update.greasyfork.org/scripts/397991/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%88%B0GreasyFork.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
  'use strict';

  const mainStyle = `
  #site-name img {
    width: 32px;
    height: 32px;
  }

  #main-header h1 {
      font-size: 36px;
  }
  `;

  const personalCenterStyle = `
  #about-user > a,
  #about-user > h2,
  #control-panel > header,
  #user-discussions-on-scripts-written,
  #user-discussions,
  #user-conversations,
  #user-script-sets-section {
    display: none !important;
  }

  #about-user {
    display: flex;
    position: fixed;
    right: 20px;
    margin: 0;
    padding: 0 10px 0 0;
  }

  .script-list li:not(.ad-entry) {
      padding: 0.5em 1em;
  }
  `;

  main();

  function main() {
    logInfo(GM_info.script.name, GM_info.script.version);
    GM_addStyle(mainStyle);
    beautifyPersonalCenter();
    login();
  }

  function login() {
    var st = setTimeout(function show() {
      if (isValidByClassName("external-login github-login")) {
        if (isValidById("remember_me")) {
          document.getElementById("remember_me").checked = true;
        }
        const btnGitHub = document.getElementsByClassName("external-login github-login")[0];
        if ("使用 GitHub 登录" == btnGitHub.innerText || "Sign in with GitHub" == btnGitHub.innerText) {
          showMsg();
          btnGitHub.click();
        }
      }

      if (isValidByClassName('sign-in-link') && !isValidByClassName("external-login github-login")) {
        console.log("Login Button is exist, and will be clicked soon.");

        var btnLogin = document.getElementsByClassName("sign-in-link")[0].children[0];
        if ("登录" == btnLogin.textContent || "Sign in" == btnLogin.textContent) {
          showMsg();
          btnLogin.click();
        }
      }
    }, 1000);
  }

  function showMsg() {
    // Create A
    var aMsg = document.createElement("a");
    aMsg.text = "Auto login...";
    aMsg.style.color = 'white';
    aMsg.style.fontWeight = 'bold';

    const divSite = document.getElementById("site-name-text");
    divSite.appendChild(aMsg);
  }

  function beautifyPersonalCenter() {
    let user = document.querySelector('.user-profile-link');
    if (!user) {
      return;
    }
    if (window.location.pathname.indexOf(user.textContent.toLowerCase()) != -1) {
      GM_addStyle(personalCenterStyle);
    }
  }

  /**
   * Log the title and version at the front of the console.
   * @param {String} title title.
   * @param {String} version script version.
   */
  function logInfo(title, version) {
    console.clear();
    const titleStyle = 'color:white;background-color:#606060';
    const versionStyle = 'color:white;background-color:#1475b2';
    const logTitle = ' ' + title + ' ';
    const logVersion = ' ' + version + ' ';
    console.log('%c' + logTitle + '%c' + logVersion, titleStyle, versionStyle);
  }
})();

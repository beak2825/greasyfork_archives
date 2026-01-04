// ==UserScript==
// @name        ExHentai - Working Login Screen (Cookies)
// @namespace   Violentmonkey Scripts
// @match       https://exhentai.org/*
// @grant       GM_getValue
// @version     1.7
// @author      shlsdv
// @license     MIT
// @description Displays a (working) login form.
// @icon        https://e-hentai.org/favicon.ico
// @homepageURL https://greasyfork.org/en/scripts/470374-working-exhentai-login-screen-cookies
// @downloadURL https://update.greasyfork.org/scripts/470374/ExHentai%20-%20Working%20Login%20Screen%20%28Cookies%29.user.js
// @updateURL https://update.greasyfork.org/scripts/470374/ExHentai%20-%20Working%20Login%20Screen%20%28Cookies%29.meta.js
// ==/UserScript==

function getCookie(name) {
  var cookies = document.cookie.split(';');
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

function isLoggedIn() {
  return getCookie('igneous') && getCookie('igneous') !== 'mystery'
      && getCookie('ipb_member_id') && getCookie('ipb_pass_hash');
}

function setCookie(name, value, domain) {
  document.cookie = name + '=' + value + '; path=/' + (domain ? '; domain=' + domain+';' : '');
}

function deleteAllCookies() {
  var cookieList  = document.cookie.split (/;\s*/);
  for (var J = cookieList.length - 1;   J >= 0;  --J) {
      var cookieName = cookieList[J].replace (/\s*(\w+)=.+$/, "$1");
      eraseCookie (cookieName);
  }
}

function eraseCookie(cookieName) {
    var domain      = document.domain;
    var domain2     = document.domain.replace (/^www\./, "");
    var domain3     = document.domain.replace (/^(\w+\.)+?(\w+\.\w+)$/, "$2");;
    var pathNodes   = location.pathname.split ("/").map ( function (pathWord) {
        return '/' + pathWord;
    } );
    var cookPaths   = [""].concat (pathNodes.map ( function (pathNode) {
        if (this.pathStr) {
            this.pathStr += pathNode;
        } else {
            this.pathStr = "; path=";
            return (this.pathStr + pathNode);
        }
        return (this.pathStr);
    } ) );
    ( eraseCookie = function (cookieName) {
        cookPaths.forEach ( function (pathStr) {
            var diagStr     = cookieName + "=" + pathStr + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = diagStr;
            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain  + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain2 + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
            document.cookie = cookieName + "=" + pathStr + "; domain=" + domain3 + "; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
        } );
    } ) (cookieName);
}

function addCustomCookies(id, pass, sk=""){
  setCookie('sl', 'dm_1');
  setCookie('ipb_member_id', id);
  setCookie('ipb_pass_hash', pass);
  if (sk) {
    setCookie('sk', sk, '.exhentai.org');
  }
}

function submitLoginForm() {
  deleteAllCookies();
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var [id, sk=""] = username.split(';');
  addCustomCookies(id.trim(), password.trim(), sk.trim());
  location.reload();
}

function checkStoredLogin() {
  var id = GM_getValue('ipb_member_id', '');
  var pass = GM_getValue('ipb_pass_hash', '');
  var sk = GM_getValue('sk', '');
  if (id && pass) {
    console.log("Stored credentials found. Setting cookies.");
    addCustomCookies(id, pass, sk);
    location.reload();
    return true;
  }
  return false;
}

(function() {
  function addLoginForm() {
    if (typeof isLoggedIn === "function" && isLoggedIn()) {
      console.log("Cookies found, not adding form");
      return;
    }

    if (checkStoredLogin()) return;

    console.log("Adding login form");

    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#ffffff';

    var loginForm = document.createElement('form');
    loginForm.setAttribute('id', 'login-form');
    loginForm.style.position = 'fixed';
    loginForm.style.top = '50%';
    loginForm.style.left = '50%';
    loginForm.style.transform = 'translate(-50%, -50%)';
    loginForm.style.zIndex = '9999';
    loginForm.style.backgroundColor = '#ffffff';
    loginForm.style.padding = '30px';
    loginForm.style.borderRadius = '8px';
    loginForm.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.1)';
    loginForm.style.fontFamily = 'Arial, sans-serif';
    loginForm.style.color = '#333';
    loginForm.style.transition = 'all 0.3s ease';
    loginForm.style.width = '300px';

    loginForm.innerHTML = `
      <div style="text-align: center;">
          <h2>Login</h2>
          <input type="text" id="username" name="username" placeholder="ipb_member_id;sk" style="height: 30px;" required><br><br>
          <input type="password" id="password" name="password" placeholder="ipb_pass_hash" style="height: 30px;" required><br><br>
          <input type="submit" value="Submit" style="width: 80px; height: 40px;">
      </div>
      <p>
        <b>Update</b>: The igneous cookie should no longer be used.
      </p>
      <details>
        <summary style="cursor: pointer; color: blue; text-decoration: underline;">Help</summary>
        <p>
          In the first field, enter your 'ipb_member_id' cookie.
          In the second field, enter your 'ipb_pass_hash'.
          Obtain these two cookies in your browser's developer tools after successfully entering ExHentai.
          You can also add your 'sk' cookie after a semicolon in the first field to fix potential watchlist-related issues.
        </p>
      </details>
    `;

    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      submitLoginForm();
    });

    document.addEventListener('keydown', function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        submitLoginForm();
      }
    });

    document.body.appendChild(loginForm);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    addLoginForm();
  } else {
    document.addEventListener('DOMContentLoaded', addLoginForm);
  }
})();


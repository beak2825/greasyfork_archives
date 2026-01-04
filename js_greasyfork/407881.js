// ==UserScript==
// @name         Heikeyun login
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Heikeyun Login
// @author       sdfsung
// @require      https://greasyfork.org/scripts/399614-tampermonkey-utils/code/tampermonkey_utils.js?version=788382
// @require      https://greasyfork.org/scripts/408004-websocket-wrapper/code/Websocket%20wrapper.js?version=832780
// @match        http://lx.heikeyun.com/login.aspx
// @classname    runHeikeyunLogin
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407881/Heikeyun%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/407881/Heikeyun%20login.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const run = function() {
    const runHeikeyunLogin = function() {
      const performTkTask = function(taskName, par1, par2) {
        let cmd = taskName;
        if (par1) cmd += '=:=' + par1;
        if (par2) cmd += '=:=' + par2;
        console.log(cmd);
        cmd = cmd.replace(/&/g, '| |');

        const server = 'http://172.16.0.21:8765';
        const xhr = new XMLHttpRequest();

        xhr.open('POST', server, true);
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send('title=Remote Command&command=' + cmd);
      };

      const getCode = function() {
        const img = document.querySelector('#logincode');
        var canvas1 = document.createElement("canvas");
        canvas1.width = img.width;
        canvas1.height = img.height;
        var ctx1 = canvas1.getContext("2d");
        ctx1.drawImage(img, 0, 0);
        return canvas1.toDataURL();
      };

      performTkTask('*generateHeikeyunCode', getCode());
    };

    return {
      runHeikeyunLogin: runHeikeyunLogin,
    };
  };

  (() => {
    const wsi = new WebSocketIn('777');
    wsi.onmessage = ({data}) => {
      console.log(data);
      const {code, user, password} = JSON.parse(data);
      // const code = data;
      // const user = 'hky_o';
      // const password = 'rrOUWiq@XmMX';
      console.log(code);
      document.querySelector('#txtId').value = user;
      document.querySelector('#txtPwd').value = password;
      document.querySelector('#txtCode').value = code;
      document.querySelector('#btnLogin').click();
    };
    run()[TmUtils.getClassName4Run()]();
  })();
})();

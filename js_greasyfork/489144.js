// ==UserScript==
// @name Auto-Complete AWS/OKTA Authorization requested
// @namespace Zeko Scripts
// @include *://device.sso.us-east-1.amazonaws.com/?user_code*
// @include *://${comp}-sso.awsapps.com/start/user-consent/authorize.html?clientId*
// @include https://${comp}-sso.awsapps.com/start/user-consent/login-success.html
// @include *://${comp}.okta.com/oauth2/v1/authorize?client_id*
// @include *//${comp}.okta.com/app/amazon_aws_sso*
// @grant none
// @description Confirm automatically.
// @author zeko zhang
// @version 1.0.0
// @require https://code.jquery.com/jquery-1.7.2.min.js
// @icon https://device.sso.us-east-1.amazonaws.com/favicon.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489144/Auto-Complete%20AWSOKTA%20Authorization%20requested.user.js
// @updateURL https://update.greasyfork.org/scripts/489144/Auto-Complete%20AWSOKTA%20Authorization%20requested.meta.js
// ==/UserScript==

var waitInterval = 500;
var loadInterval = 3000;
var pwd = ''


$(() => {
  var clickOKTASubmit = function() {
    // Get password
    var password = $('input[name="credentials.passcode"]')[0];

    let event = document.createEvent('HTMLEvents');
    event.initEvent('input', true, true);
    password.value = pwd;
    password.dispatchEvent(event)

    setTimeout(function () {
      var savaButton = $('input[data-type="save"]');
      savaButton[0].click();
    }, waitInterval);
  }

  var waitPasswordAndClickOKTASubmit = function() {
    if ($('input[name="credentials.passcode"]')[0] !== undefined) {
        clickOKTASubmit();
    } else {
        setTimeout(waitPasswordAndClickOKTASubmit, waitInterval);
    }
  }

  var clickOKTAVerify = function() {
    // Click Okta Verify
    setTimeout(function () {
      var windowX = window.screenX;
      var windowY = window.screenY;
      console.log('当前窗口位置：', windowX, windowY);

      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;

      console.log('窗口宽度：', windowWidth);
      console.log('窗口高度：', windowHeight);

      var buttonX = windowX + windowWidth/2 - 130;
      var buttonY = windowY + windowHeight/2 + (470/2)/1.647 - 30
      console.log('按钮位置：', buttonX, buttonY);

      setTimeout(function () {
        // 创建一个虚拟的点击目标
        var virtualTarget = document.createElement('div');
        virtualTarget.style.width = '100px';
        virtualTarget.style.height = '30px';
        virtualTarget.style.backgroundColor = 'red';
        virtualTarget.style.position = 'absolute';
        virtualTarget.style.top = buttonY+'px'; // 设置点击目标的位置
        virtualTarget.style.left = buttonX+'px'; // 设置点击目标的位置
        document.body.appendChild(virtualTarget);

        // 创建一个鼠标点击事件
        var clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        // 在虚拟点击目标上触发点击事件
        virtualTarget.dispatchEvent(clickEvent);
      }, 5000);

    }, 5000);
  }

  var waitUserNameOrPasswordThenRun = function() {
    if ($('input[name="identifier"]')[0] !== undefined || $('input[name="credentials.passcode"]')[0] !== undefined) {
        var userNames = $('input[name="identifier"]');
        if(userNames !== undefined && userNames.length > 0) {
          // Submit username
          setTimeout(function () {
            var savaButton = $('input[data-type="save"]');
            savaButton[0].click();
          }, waitInterval);


          // Submit password
          waitPasswordAndClickOKTASubmit();
        } else {
          // Submit password
          waitPasswordAndClickOKTASubmit();
        }
    } else {
        setTimeout(waitUserNameOrPasswordThenRun, waitInterval);
    }
  }

  var autoConfirmFunc = function () {
      var confirmCodeButton = $('#cli_verification_btn');
      if(confirmCodeButton !== null) {
        confirmCodeButton.click();
      }

      var loginButton = $('#cli_login_button');
      if(loginButton !== null) {
          loginButton.click();
      }

      var currentUrl = window.location.href;
      if(currentUrl === 'https://${comp}-sso.awsapps.com/start/user-consent/login-success.html') {
        console.log("Current URL：" + currentUrl);
      }

      if(currentUrl.startsWith('https://${comp}.okta.com/oauth2/v1/authorize?client_id') || currentUrl.startsWith('https://${comp}.okta.com/app/amazon_aws_sso')) {
        waitUserNameOrPasswordThenRun();
      }
  }

  setTimeout(function () {
      autoConfirmFunc();
  }, waitInterval);
})
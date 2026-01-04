// ==UserScript==
// @name         饭否手机网页版优化
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  1.移动输入框位置，方便手机发饭。2.收藏按钮弹出提示防止误点。3.添加方便按钮。4.过滤功能。 5.左右手模式
// @author       limuxy
// @match        *://m.fanfou.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38233/%E9%A5%AD%E5%90%A6%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/38233/%E9%A5%AD%E5%90%A6%E6%89%8B%E6%9C%BA%E7%BD%91%E9%A1%B5%E7%89%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

/* jshint esnext: false */
/* jshint esversion: 6 */

(function() {
  'use strict';

  function GM_addStyle (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
  }

  var styles = `
  h2 + p, p + p {
    border-bottom: 1px solid #eee;
  }

  .extra-btn {
    width: 32px;
    height: 32px;
    background-color: #fff;
    position: fixed;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 2px 2px 2px rgba(0,0,0,0.1);
  }

  body.rightHand .extra-btn {
    right: 20px;
  }

  body.leftHand .extra-btn {
    left: 20px;
  }

  #plusBtn {
    bottom: 20px;
  }

  #replyBtn {
    bottom: 60px;
  }

  #homeBtn {
    bottom: 100px;
  }

  form {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: #fff;
    padding-top: 10px;
    padding-bottom: 10px;
    box-shadow: 0px -3px 4px rgba(0,0,0,0.2);
  }

  form textarea {
    border: 1px solid #68cefe;
    height: 60px;
    width: 100%;
  }

  form input[type=submit] {
    background-color: #68cefe;
    border: 0;
    color: #fff;
  }

  #closeBtn {
    background-color: #eee;
    border: 0;
    color: #000;
    margin-left: 5px;
  }

  body.rightHand form input[type=submit] {
    float: right;
  }
  body.rightHand #closeBtn {
    float: right
  }

  body.leftHand form input[type=submit] {
    float: left;
  }
  body.leftHand #closeBtn {
    float: left
  }

  #filterConfigModal {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #fff;
    top: 0;
    left: 0;
    display: none;
  }

  #filterConfigModal button {
    background-color: #68cefe;
    border: 0;
    color: #fff;
    margin-left: 5px;
    margin-top: 10px;
  }

  @media only screen and (max-device-width: 420px) and (min-device-height: 480px) and (min-device-width: 320px) {
    #closeBtn {
      padding: .3em .8em;
      margin-right: 3%;
    }
    form textarea {
      width: 97% !important;
    }
  }
  `;

  var initStyles = function() {
    GM_addStyle(styles);
  };

  var removeTextareaLengthLimit = function() {
    $('textarea').attr('maxlength', '');
  };

  var addPlusBtn = function() {
    var plusBtn = $('<span id="plusBtn" class="extra-btn"><img  src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDQzOC41MzMgNDM4LjUzMyIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDM4LjUzMyA0MzguNTMzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTQwOS4xMzMsMTA5LjIwM2MtMTkuNjA4LTMzLjU5Mi00Ni4yMDUtNjAuMTg5LTc5Ljc5OC03OS43OTZDMjk1LjczNiw5LjgwMSwyNTkuMDU4LDAsMjE5LjI3MywwICAgYy0zOS43ODEsMC03Ni40Nyw5LjgwMS0xMTAuMDYzLDI5LjQwN2MtMzMuNTk1LDE5LjYwNC02MC4xOTIsNDYuMjAxLTc5LjgsNzkuNzk2QzkuODAxLDE0Mi44LDAsMTc5LjQ4OSwwLDIxOS4yNjcgICBjMCwzOS43OCw5LjgwNCw3Ni40NjMsMjkuNDA3LDExMC4wNjJjMTkuNjA3LDMzLjU5Miw0Ni4yMDQsNjAuMTg5LDc5Ljc5OSw3OS43OThjMzMuNTk3LDE5LjYwNSw3MC4yODMsMjkuNDA3LDExMC4wNjMsMjkuNDA3ICAgczc2LjQ3LTkuODAyLDExMC4wNjUtMjkuNDA3YzMzLjU5My0xOS42MDIsNjAuMTg5LTQ2LjIwNiw3OS43OTUtNzkuNzk4YzE5LjYwMy0zMy41OTYsMjkuNDAzLTcwLjI4NCwyOS40MDMtMTEwLjA2MiAgIEM0MzguNTMzLDE3OS40ODUsNDI4LjczMiwxNDIuNzk1LDQwOS4xMzMsMTA5LjIwM3ogTTM0Ny4xNzksMjM3LjUzOWMwLDQuOTQ4LTEuODExLDkuMjM2LTUuNDI4LDEyLjg0NyAgIGMtMy42MiwzLjYxNC03LjkwMSw1LjQyOC0xMi44NDcsNS40MjhoLTczLjA5MXY3My4wODRjMCw0Ljk0OC0xLjgxMyw5LjIzMi01LjQyOCwxMi44NTRjLTMuNjEzLDMuNjEzLTcuODk3LDUuNDIxLTEyLjg0Nyw1LjQyMSAgIGgtMzYuNTQzYy00Ljk0OCwwLTkuMjMxLTEuODA4LTEyLjg0Ny01LjQyMWMtMy42MTctMy42MjEtNS40MjYtNy45MDUtNS40MjYtMTIuODU0di03My4wODRoLTczLjA4OSAgIGMtNC45NDgsMC05LjIyOS0xLjgxMy0xMi44NDctNS40MjhjLTMuNjE2LTMuNjEtNS40MjQtNy44OTgtNS40MjQtMTIuODQ3di0zNi41NDdjMC00Ljk0OCwxLjgwOS05LjIzMSw1LjQyNC0xMi44NDcgICBjMy42MTctMy42MTcsNy44OTgtNS40MjYsMTIuODQ3LTUuNDI2aDczLjA5MnYtNzMuMDg5YzAtNC45NDksMS44MDktOS4yMjksNS40MjYtMTIuODQ3YzMuNjE2LTMuNjE2LDcuODk4LTUuNDI0LDEyLjg0Ny01LjQyNCAgIGgzNi41NDdjNC45NDgsMCw5LjIzMywxLjgwOSwxMi44NDcsNS40MjRjMy42MTQsMy42MTcsNS40MjgsNy44OTgsNS40MjgsMTIuODQ3djczLjA4OWg3My4wODRjNC45NDgsMCw5LjIzMiwxLjgwOSwxMi44NDcsNS40MjYgICBjMy42MTcsMy42MTUsNS40MjgsNy44OTgsNS40MjgsMTIuODQ3VjIzNy41Mzl6IiBmaWxsPSIjMDBjY2ZmIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" /></span>');
    plusBtn.on('click', function(){
      $('.extra-btn').hide();
      $('form').show();
    });
    $('body').append(plusBtn);
  };

  var addReplyBtn = function() {
    var replyBtn = $('<span id="replyBtn" class="extra-btn"><img  src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCIgdmlld0JveD0iMCAwIDQyMS45NCA0MjEuOTM5IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MjEuOTQgNDIxLjkzOTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik0yMTkuODY2LDE2My44MTRjLTcuMjU0LDAtMTMuOTY0LDIuMDUzLTIwLjEyNSw2LjE3M2MtNi4xNzMsNC4xMDctMTEuNDksOS40MTItMTUuOTYxLDE1Ljk0OCAgICBjLTQuNDg4LDYuNTM2LTcuOTI2LDEzLjg1MS0xMC4zNDMsMjEuOTQxYy0yLjQyOSw4LjExNi0zLjYyNywxNi4wMTgtMy42MjcsMjMuNzY1YzAsNy45NzQsMS42MzMsMTQuNTA3LDQuOSwxOS41ODcgICAgYzMuMjYzLDUuMDY4LDguODcyLDcuNjE0LDE2Ljg2MSw3LjYxNGMzLjM3NSwwLDcuMDI1LTEuMDIxLDEwLjg5LTMuMDg2YzMuODY3LTIuMDU0LDcuNTk5LTQuNzY5LDExLjIzOC04LjE2NyAgICBjMy42My0zLjM3NSw3LjEyMi03LjI1NCwxMC41MjEtMTEuNjAyYzMuMzc1LTQuMzQ3LDYuNDAxLTguOTQ3LDkuMDY3LTEzLjc3NGw5LjA3My01MC4wNTZjLTMuMTY0LTIuNjY5LTYuNDI1LTQuNzIzLTkuOC02LjE3MyAgICBDMjI5LjE2NywxNjQuNTMyLDIyNC45MzQsMTYzLjgxNCwyMTkuODY2LDE2My44MTR6IiBmaWxsPSIjMDBjY2ZmIi8+CgkJPHBhdGggZD0iTTIxMC45NzYsMEM5NC40NjEsMCwwLDk0LjQ1MywwLDIxMC45NjRjMCwxMTYuNTE0LDk0LjQ1MiwyMTAuOTc2LDIxMC45NzUsMjEwLjk3NiAgICBjMTE2LjUyNiwwLDIxMC45NjMtOTQuNDU1LDIxMC45NjMtMjEwLjk3NkM0MjEuOTM5LDk0LjQ1MywzMjcuNTE0LDAsMjEwLjk3NiwweiBNMzQ1LjkwNywyNjQuMjgzICAgIGMtOS41Niw5LjkyLTIwLjY3NSwxNy43OC0zMy4zNjMsMjMuNTc1Yy0xMi42ODgsNS44MDEtMjYuMzA3LDguNzA3LTQwLjgxNCw4LjcwN2MtNi4wNTksMC0xMS42NjctMC42NTUtMTYuODY3LTEuOTg3ICAgIGMtNS4yMDYtMS4zNC05LjU2NS0zLjU2Ny0xMy4wNTUtNi43MmMtMy41MDctMy4xNDYtNi4xMTItNy4yNTQtNy44MTItMTIuMzM0Yy0xLjY5My01LjA4LTIuMTczLTExLjM2MS0xLjQzNS0xOC44NDloLTEuNDUzICAgIGMtMy42MTUsNS4wNjItNy41NjEsMTAuMDI3LTExLjc5NCwxNC44NjdjLTQuMjE4LDQuODQtOC44NzIsOS4xMjEtMTMuOTY0LDEyLjg3NWMtNS4wNjUsMy43NTktMTAuNjM3LDYuNzE5LTE2LjY2OSw4Ljg4NyAgICBjLTYuMDYyLDIuMTc0LTEyLjcwMywzLjI2MS0xOS45NiwzLjI2MWMtNS43OTgsMC0xMS4zNjEtMS4yNzMtMTYuNjkzLTMuODA4Yy01LjMwOS0yLjU0LTkuOTA1LTYuMTA2LTEzLjc3NS0xMC42OTQgICAgYy0zLjg2Ny00LjU4OC02Ljk1My0xMC4xNi05LjIzNS0xNi42OTNjLTIuMzE3LTYuNTI3LTMuNDYxLTEzLjc3NC0zLjQ2MS0yMS43NjFjMC0xNC45OTQsMi40MjktMjkuNTU5LDcuMjU2LTQzLjcwMyAgICBjNC44NC0xNC4xNDcsMTEuNDMxLTI2LjY2MiwxOS43NjgtMzcuNTM5YzguMzQ0LTEwLjg4NCwxOC4wMjktMTkuNjMzLDI5LjAzLTI2LjI5OGMxMS02LjY0MiwyMi42NjUtOS45NjgsMzQuOTkzLTkuOTY4ICAgIGM4LjQ3LDAsMTUuNjA0LDEuMjczLDIxLjM5OCwzLjgwN2M1Ljc5NSwyLjU0NiwxMS4xMjcsNS44NiwxNS45NjcsOS45NzlsMTEuMjM0LTExLjYxNmgyNS4zOTVsLTE3LjQwMSw5OC4zMDIgICAgYy0xLjkzNCwxMS4zNjEtMS45OTQsMTkuNTg4LTAuMTkyLDI0LjY2OGMxLjgyNSw1LjA2Nyw1Ljg2LDcuNjE0LDEyLjE1Myw3LjYxNGM2LjI4MSwwLDEyLjQ2Ni0xLjQ1MywxOC41MDctNC4zNTkgICAgYzYuMDI5LTIuOSwxMS40Ny03LjM2MiwxNi4zMjEtMTMuNDIyYzQuODE1LTYuMDM0LDguNzY3LTEzLjY2LDExLjc4MS0yMi44NDJjMy4wMjYtOS4xOTksNC41MjctMjAuMDgzLDQuNTI3LTMyLjY1NyAgICBjMC0xOC4xMzQtMy4wMjYtMzMuNjE3LTkuMDY3LTQ2LjQzMmMtNi4wNTMtMTIuODE0LTE0LjMyNy0yMy4zOTUtMjQuODM1LTMxLjcyOUMyOTEuODcsOTkuMDcsMjc5LjQ2OSw5Mi45NjcsMjY1LjIwMiw4OS4xICAgIGMtMTQuMjYxLTMuODctMjkuNjIxLTUuODEyLTQ2LjA2NS01LjgxMmMtMTguODUyLDAtMzYuMzg5LDMuMzg3LTUyLjU5MywxMC4xNDVjLTE2LjIwMSw2Ljc4OS0zMC4yODgsMTYuMDkzLTQyLjI2MiwyNy45MzUgICAgYy0xMS45NTksMTEuODU2LTIxLjMyOSwyNS45NDQtMjguMTEyLDQyLjI2MmMtNi43NTIsMTYuMzIxLTEwLjE0NSwzNC4wMzUtMTAuMTQ1LDUzLjEzNGMwLDE4Ljg2NywyLjg0NiwzNS43ODgsOC41MTUsNTAuNzc2ICAgIGM1LjY5NiwxNS4wMTIsMTMuOTc3LDI3Ljc1NCwyNC44NiwzOC4yNzRjMTAuODcxLDEwLjUyMSwyNC4zNTUsMTguNjE1LDQwLjQ0OCwyNC4yOTVjMTYuMDY1LDUuNjgyLDM0LjUsOC41MzMsNTUuMzA0LDguNTMzICAgIGM3LjAxNCwwLDE0Ljk4OC0wLjg0NywyMy45NDctMi41MzRjOC45MzYtMS42OTMsMTcuMDQyLTQuMjMzLDI0LjI5Ni03LjYyNmwxMS4yNCwzNC44MjhjLTkuOTA3LDQuODQtMjAuMDA4LDguMjE1LTMwLjI4OCwxMC4xNDIgICAgYy0xMC4yOCwxLjkzNC0yMi4wNjIsMi45MjUtMzUuMzcxLDIuOTI1Yy0yMy40NTIsMC00NS4xNTYtMy4zOTgtNjUuMDkyLTEwLjE1NGMtMTkuOTU3LTYuNzc5LTM3LjI1NC0xNi44MTMtNTEuODg1LTMwLjEwNyAgICBjLTE0LjYyNy0xMy4zMDctMjYuMDU4LTI5LjgwOS0zNC4yNzItNDkuNTA0Yy04LjIyNy0xOS43MDgtMTIuMzIyLTQyLjUwMi0xMi4zMjItNjguMzcxYzAtMjYuMzYxLDQuNzA4LTUwLjE4OCwxNC4xMzUtNzEuNDY5ICAgIGM5LjQyOC0yMS4yNjksMjIuMTQ5LTM5LjQwMywzOC4wOTItNTQuNDA2YzE1Ljk2NC0xNC45OTcsMzQuNDU4LTI2LjUyNiw1NS40ODEtMzQuNjUxYzIxLjA1Ni04LjA4LDQzLjI5NC0xMi4xNDIsNjYuNzQ2LTEyLjE0MiAgICBjMjIuMjQyLDAsNDIuOTIyLDMuMjA0LDYyLjAxOCw5LjYxMWMxOS4xMDcsNi40MTMsMzUuNjY4LDE1LjU5Nyw0OS42OTUsMjcuNTU5YzE0LjAyNywxMS45NzEsMjUuMDI4LDI2LjYxMywzMy4wMDMsNDMuODk2ICAgIGM3Ljk4NiwxNy4zLDExLjk4NSwzNi45NDQsMTEuOTg1LDU4Ljk0NmMwLDE1LjQ4My0yLjcyNywyOS45OTEtOC4xNjcsNDMuNTMyQzM2Mi45NDIsMjQyLjY0MywzNTUuNDYsMjU0LjM3NSwzNDUuOTA3LDI2NC4yODN6IiBmaWxsPSIjMDBjY2ZmIi8+Cgk8L2c+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" /></span>');
    replyBtn.on('click', function(){
      location.href = '/mentions';
    });
    $('body').append(replyBtn);
  };

  var addHomeBtn = function() {
    var homeBtn = $('<span id="homeBtn" class="extra-btn"><img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDQ0IDQ0IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0NCA0NCIgd2lkdGg9IjMycHgiIGhlaWdodD0iMzJweCI+CiAgPGc+CiAgICA8cGF0aCBkPSJtMjIsMGMtMTIuMiwwLTIyLDkuOC0yMiwyMnM5LjgsMjIgMjIsMjIgMjItOS44IDIyLTIyLTkuOC0yMi0yMi0yMnptMTIsMjBoLTEuNWMtMC4zLDAtMC41LDAuMi0wLjUsMC41djEyLjVjMCwwLjYtMC40LDEtMSwxaC0xOGMtMC42LDAtMS0wLjQtMS0xdi0xMi41YzAtMC4zLTAuMi0wLjUtMC41LTAuNWgtMS41Yy0wLjYsMC0xLTAuNC0xLTEgMC0wLjMgMC4yLTAuNyAwLjQtMC44bDEyLThjMC4yLTAuMSAwLjMtMC4yIDAuNi0wLjJzMC40LDAuMSAwLjYsMC4ybDEyLDhjMC4zLDAuMiAwLjQsMC41IDAuNCwwLjggMCwwLjYtMC40LDEtMSwxeiIgZmlsbD0iIzAwY2NmZiIvPgogICAgPHBhdGggZD0ibTIyLjMsMTQuOGMtMC4yLTAuMS0wLjQtMC4xLTAuNiwwbC01LjUsMy43Yy0wLjEsMC4xLTAuMiwwLjItMC4yLDAuNHYxMC42YzAsMC4zIDAuMiwwLjUgMC41LDAuNWgzYzAuMywwIDAuNS0wLjIgMC41LTAuNXYtNC41YzAtMC42IDAuNC0xIDEtMWgyYzAuNiwwIDEsMC40IDEsMXY0LjVjMCwwLjMgMC4yLDAuNSAwLjUsMC41aDNjMC4zLDAgMC41LTAuMiAwLjUtMC41di0xMC42YzAtMC4yLTAuMS0wLjMtMC4yLTAuNGwtNS41LTMuN3oiIGZpbGw9IiMwMGNjZmYiLz4KICA8L2c+Cjwvc3ZnPgo=" /></span>');
    homeBtn.on('click', function(){
      location.href = '/';
    });
    $('body').append(homeBtn);
  };

  var rearrangeForm = function() {
    $('body').find('h2').each(function(){
      if ($(this).text() === '你在做什么？') {
        $(this).remove();
      }
    });
    var closeBtn = $('<input type="button" id="closeBtn" value="关闭">');
    closeBtn.on('click', function() {
      $('form').hide();
      $('.extra-btn').show();
    });
    $('form').find('input[type=submit]').before(closeBtn);
    var form = $('form').detach();
    $('body').append(form);
    if (location.pathname.indexOf('/photo.upload') > -1 ||
    location.pathname.indexOf('/msg.reply') > -1 ||
    location.pathname.indexOf('/msg.forward') > -1) {
      $('.extra-btn').hide();
    } else {
      form.hide();
    }
  };

  var hijackFav = function() {
    $('body').on('click', 'a', function(e){
      if ($(this).text() === '收藏') {
        e.preventDefault();
        var href = $(this).attr('href');
        if (window.confirm('确定要收藏吗？')) {
          location.href = href;
        }
      }
    });
  };

  var addFilterConfigBtn = function() {
    $('body').append('<div id="filterConfigModal"><ul id="filterList"></ul><input id="newFilterInput" placeholder="过滤关键词"><button id="filterConfigAddBtn">添加</button><button id="filterConfigCloseBtn">保存</button></div>');
    $('#nav').find('p').append('<br><a href="javascript:void(0)" id="filterConfigBtn">过滤配置</a>&nbsp;<a href="javascript:void(0)" id="toggleFilter">启用过滤</a>');

    const filterEnabled = localStorage.getItem('filterEnabled');
    if (filterEnabled === 'true') {
      $('#toggleFilter').text('禁用过滤');
    } else {
      $('#toggleFilter').text('启用过滤');
    }
    $('#toggleFilter').on('click', function() {
      const filterEnabled = localStorage.getItem('filterEnabled');
      if (filterEnabled !== 'true') {
        localStorage.setItem('filterEnabled', 'true');
      } else {
        localStorage.setItem('filterEnabled', 'false');
      }
      location.reload();
    });

    $('#nav').on('click', '#filterConfigBtn', function() {
      let filterListString = localStorage.getItem('filterList');
      if (!filterListString) {
        filterListString = '[]';
      }
      const filterList = JSON.parse(filterListString);
      $('#filterList').empty();
      filterList.forEach(function(keyword, index) {
        $('#filterList').append('<li>' + keyword + '&nbsp; <a href="javascript:void(0)" class="removeFilter" data-index="' + index +'">移除</a></li>');
      });
      $('#filterConfigModal').show();
    });

    $('#filterConfigCloseBtn').on('click', function() {
      location.reload();
    });

    $('#filterConfigAddBtn').on('click', function() {
      let filterListString = localStorage.getItem('filterList');
      if (!filterListString) {
        filterListString = '[]';
      }
      const filterList = JSON.parse(filterListString);
      const keyword = $('#newFilterInput').val();
      filterList.push(keyword);
      localStorage.setItem('filterList', JSON.stringify(filterList));
      $('#filterList').append('<li>' + keyword + '&nbsp; <a href="javascript:void(0)" class="removeFilter" data-index="' + (filterList.length - 1) +'">移除</a></li>');
      $('#newFilterInput').val('');
    });

    $('#filterList').on('click', '.removeFilter', function() {
      const index = parseInt($(this).attr('data-index'));
      let filterListString = localStorage.getItem('filterList');
      if (!filterListString) {
        filterListString = '[]';
      }
      const filterList = JSON.parse(filterListString);
      filterList.splice(index, 1);
      $('#filterList').find('li:nth-child(' + (index+1) +')').remove();
      localStorage.setItem('filterList', JSON.stringify(filterList));
    });
  };

  var doFilter = function() {
    const filterEnabled = localStorage.getItem('filterEnabled');
    if (filterEnabled !== 'true') return;
    const filterListString = localStorage.getItem('filterList');
    if (!filterListString) return;
    const filterList = JSON.parse(filterListString);

    $('body > p').each(function() {
      const p = this;
      filterList.forEach(function(keyword) {
        if ($(p).text().indexOf(keyword) > -1) {
          $(p).remove();
        }
      });
    });
  };

  var initHandModeSwitch = function() {
    let handMode = localStorage.getItem('handMode');
    if (!handMode) {
      handMode = 'rightHand';
    }
    $('body').removeClass('leftHand').removeClass('rightHand').addClass(handMode);
    $('#nav').find('p').append('&nbsp;<a href="javascript:void(0)" id="toggleHandMode">右手模式</a>');
    if (handMode === 'rightHand') {
      $('#toggleHandMode').text('右手模式');
      $('a[accesskey=6]').parent('p').css('text-align', 'right');
    } else {
      $('#toggleHandMode').text('左手模式');
      $('a[accesskey=6]').parent('p').css('text-align', 'left');
    }
    $('#toggleHandMode').on('click', function() {
      let handMode = localStorage.getItem('handMode');
      if (handMode === 'leftHand') {
        handMode = 'rightHand';
        $('#toggleHandMode').text('右手模式');
        $('a[accesskey=6]').parent('p').css('text-align', 'right');
      } else {
        handMode = 'leftHand';
        $('#toggleHandMode').text('左手模式');
        $('a[accesskey=6]').parent('p').css('text-align', 'left');
      }
      localStorage.setItem('handMode', handMode);
      $('body').removeClass('leftHand').removeClass('rightHand').addClass(handMode);
    });
  };

  var initView = function() {
    $('h1').remove();
    if (location.pathname === '/') {
      return;
    }
    if (location.pathname.indexOf('/statuses/') > -1 ||
    location.pathname.indexOf('/photo') > -1) {
      addReplyBtn();
      addHomeBtn();
    }
    if ($('form').find('p:first').text() === 'Email或手机号：') {
      return;
    }
    initStyles();
    removeTextareaLengthLimit();
    addPlusBtn();
    addReplyBtn();
    addHomeBtn();
    rearrangeForm();
    hijackFav();
    addFilterConfigBtn();
    doFilter();
    initHandModeSwitch();
  };

  initView();
})();

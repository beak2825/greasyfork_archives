// ==UserScript==
// @name         V2EX工具箱
// @namespace    rollup-react
// @version      0.0.1
// @description  V2ex工具箱，集成多项功能
// @author       greatbody
// @include     https://*.v2ex.com/*
// @include     https://v2ex.com/*
// @grant       unsafeWindow
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/389922/V2EX%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/389922/V2EX%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==
// Refs:// https://greasyfork.org/en/scripts/3452-v2ex%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var MarkBuildingOwner = function MarkBuildingOwner() {
  classCallCheck(this, MarkBuildingOwner);
};

MarkBuildingOwner.markOwner = function () {
  var ownerHtml = ' <font color=green>[楼主]</font>';
  var ownerName = document.querySelector('.header .gray a').innerHTML;
  var ownerLinks = document.querySelectorAll('#Main .box .dark');
  for (var i = 0; i < ownerLinks.length; i += 1) {
    if (ownerLinks[i].innerHTML === ownerName) {
      ownerLinks[i].innerHTML += ownerHtml;
    }
  }
};

var AtPeople = function AtPeople() {
  var _this = this;

  classCallCheck(this, AtPeople);
  this.managerTeam = '@Livid @Kai @Olivia @GordianZ @sparanoid ';

  this.getAllInPage = function () {
    var ownerName = document.querySelector('.header .gray a').innerHTML;
    return [].concat(toConsumableArray(document.querySelectorAll('#Main .box .dark'))).map(function (link) {
      return link.innerHTML;
    }).filter(function (userName) {
      return userName.indexOf(ownerName) === -1;
    }).map(function (userName) {
      return '@' + userName;
    }).join(' ');
  };

  this.addButtons = function () {
    var aAtAll = _this.createAtAllButton();
    var aAtManagerTeam = _this.createAtManagerTeamButton();
    var form = document.querySelector('#Main .box form');
    form.appendChild(aAtAll);
    form.appendChild(aAtManagerTeam);
  };

  this.createAtAllButton = function () {
    var aAtAll = document.createElement('a');
    // eslint-disable-next-line no-script-url
    aAtAll.href = 'javascript:void(0);';
    aAtAll.innerText = '@所有人';
    aAtAll.style.cursor = 'pointer;';
    aAtAll.style.marginLeft = '10px';
    aAtAll.onclick = function () {
      var allInPage = _this.getAllInPage() + ' ';
      var textarea = document.querySelector('#reply_content');
      if (textarea.value.length > 0) {
        textarea.value += '\n' + allInPage;
      } else {
        textarea.value = allInPage;
      }
      setTimeout(function () {
        textarea.focus();
      }, 1);
    };
    return aAtAll;
  };

  this.createAtManagerTeamButton = function () {
    var aAtManagerTeam = document.createElement('a');
    // eslint-disable-next-line no-script-url
    aAtManagerTeam.href = 'javascript:void(0);';
    aAtManagerTeam.innerText = '@管理员';
    aAtManagerTeam.style.cursor = 'pointer;';
    aAtManagerTeam.style.marginLeft = '10px';
    aAtManagerTeam.onclick = function () {
      var textarea = document.querySelector('#reply_content');
      if (textarea.value.length > 0) {
        textarea.value += '\n' + _this.managerTeam;
      } else {
        textarea.value = _this.managerTeam;
      }
      setTimeout(function () {
        textarea.focus();
      }, 1);
    };
    return aAtManagerTeam;
  };

  this.addButtons();
};

AtPeople.new = function () {
  return new AtPeople();
};

var Runner = function Runner() {
  classCallCheck(this, Runner);

  this.run = function () {
    console.log('Hello, this is V2EX tool');
    MarkBuildingOwner.markOwner();
    AtPeople.new();
  };
};

// eslint-disable-next-line


(function () {

  var runner = new Runner();
  runner.run();
  // eslint-disable-next-line
})();

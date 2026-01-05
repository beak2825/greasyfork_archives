// ==UserScript==
// @name        osu! Mark User With Modes Icons
// @namespace   https://osu.ppy.sh/u/376831
// @description Mark osu, taiko, ctb and mania icons in osu user profile page
// @include     *osu.ppy.sh/u/*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10469/osu%21%20Mark%20User%20With%20Modes%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/10469/osu%21%20Mark%20User%20With%20Modes%20Icons.meta.js
// ==/UserScript==
var transparent = 0.3;
var cookiesSaveDays = 30;
addLoadEvent(loadEvent);
function loadEvent() {
  var userNameElement = document.getElementsByClassName('profile-username');
  addModesImgsToEnd(userNameElement[0].parentNode.parentNode);
  setImgsTransparentBySetting(readImgsSetting());
  setModeImgsFunctions();
}
function createModeImg(modeType) {
  var img = document.createElement('img');
  img.setAttribute('id', 'modeType' + modeType);
  img.setAttribute('src', 'https://osu.ppy.sh/forum/images/icons/misc/' + modeType + '.gif');
  img.style['cursor'] = 'pointer';
  setImgTransparent(img, true);
  return img;
}
function addModesImgsToEnd(element) {
  var imgs = document.createElement('div');
  var osu = createModeImg('osu');
  var taiko = createModeImg('taiko');
  var ctb = createModeImg('ctb');
  var mania = createModeImg('mania');
  imgs.appendChild(osu);
  imgs.appendChild(taiko);
  imgs.appendChild(ctb);
  imgs.appendChild(mania);
  element.appendChild(imgs);
}
function setModeImgFunctions(element) {
  element.onmouseover = function () {
    if (element.style['opacity'] == transparent) {
      setImgTransparent(element, false);
    }
  };
  element.onmousedown = function () {
    var setting = readImgsSetting();
    switch (element.id) {
      case 'modeTypeosu':
        setting = (setting.substr(0, 1) == '1' ? '0' : '1') + setting.substr(1, 3);
        break;
      case 'modeTypetaiko':
        setting = setting.substr(0, 1) + (setting.substr(1, 1) == '1' ? '0' : '1') + setting.substr(2, 2);
        break;
      case 'modeTypectb':
        setting = setting.substr(0, 2) + (setting.substr(2, 1) == '1' ? '0' : '1') + setting.substr(3, 1);
        break;
      case 'modeTypemania':
        setting = setting.substr(0, 3) + (setting.substr(3, 1) == '1' ? '0' : '1');
        break;
    };
    saveImgsSetting(setting);
  };
  element.onmouseout = function () {
    setImgsTransparentBySetting(readImgsSetting());
  };
  element.onmouseup = function () {
    setImgsTransparentBySetting(readImgsSetting());
  };
}
function setModeImgsFunctions() {
  setModeImgFunctions(document.getElementById('modeTypeosu'));
  setModeImgFunctions(document.getElementById('modeTypetaiko'));
  setModeImgFunctions(document.getElementById('modeTypectb'));
  setModeImgFunctions(document.getElementById('modeTypemania'));
}
function setImgTransparent(element, boolean) {
  if (boolean) {
    element.style['filter'] = 'alpha(opacity=' + transparent * 100 + ')';
    element.style['-moz-opacity'] = transparent;
    element.style['-khtml-opacity'] = transparent;
    element.style['opacity'] = transparent;
  } else {
    element.style['filter'] = 'alpha(opacity=100)';
    element.style['-moz-opacity'] = '1';
    element.style['-khtml-opacity'] = '1';
    element.style['opacity'] = '1';
  }
}
function setImgsTransparentBySetting(setting) {
  setImgTransparent(document.getElementById('modeTypeosu'), setting.substr(0, 1) == '0');
  setImgTransparent(document.getElementById('modeTypetaiko'), setting.substr(1, 1) == '0');
  setImgTransparent(document.getElementById('modeTypectb'), setting.substr(2, 1) == '0');
  setImgTransparent(document.getElementById('modeTypemania'), setting.substr(3, 1) == '0');
}
function getImgsTransparentSetting() {
  var std = document.getElementById('modeTypeosu').style['opacity'] == transparent ? '0' : '1';
  var taiko = document.getElementById('modeTypetaiko').style['opacity'] == transparent ? '0' : '1';
  var ctb = document.getElementById('modeTypectb').style['opacity'] == transparent ? '0' : '1';
  var mania = document.getElementById('modeTypemania').style['opacity'] == transparent ? '0' : '1';
  return (std + taiko + ctb + mania);
}
function readImgsSetting() {
  var name = trim(document.getElementsByClassName('profile-username') [0].innerHTML);
  var setting = getCookie('osuUserModesIconsSetting');
  if (!setting) {
    return '0000';
  } else {
    var index = setting.indexOf(name);
    if (index == - 1) {
      return '0000';
    } else {
      return setting.substr(index + name.length + 1, 4);
    }
  }
}
function saveImgsSetting(newSetting) {
  var name = trim(document.getElementsByClassName('profile-username') [0].innerHTML);
  var setting = getCookie('osuUserModesIconsSetting');
  if (!setting) {
    addCookie('osuUserModesIconsSetting', name + ',' + newSetting);
  } else {
    var index = setting.indexOf(name);
    if (index == - 1) {
      addCookie('osuUserModesIconsSetting', setting + ',' + name + ',' + newSetting);
    } else {
      addCookie('osuUserModesIconsSetting', setting.substr(0, index + name.length + 1) + newSetting + setting.substr(index + name.length + 5));
    }
  }
}
function addCookie(name, value) {
  var exp = new Date();
  exp.setTime(exp.getTime() + cookiesSaveDays * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + value + ';expires=' + exp.toGMTString() + ';path=/';
}
function removeCookie(name) {
  document.cookie = name + '=;expires=' + (new Date(0)).toGMTString() + ';path=/';
}
function getCookie(name) {
  var arr,
  reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } 
  else {
    return null;
  }
}
function trim(str) {
  str = str.replace(/^(\s|\u00A0)+/, '');
  for (var i = str.length - 1; i >= 0; i--) {
    if (/\S/.test(str.charAt(i))) {
      str = str.substring(0, i + 1);
      break;
    }
  }
  return str;
}
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function () {
      oldonload();
      func();
    }
  }
}

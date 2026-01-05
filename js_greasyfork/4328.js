// ==UserScript==
// @name  Baidu Multiuser Unsafe
// @name:zh-CN  百度马甲切换不安全版
// @namespace http://geraldl.ml/
// @author  Gerald <gera2ld@163.com>
// @icon  http://cn.gravatar.com/avatar/a0ad718d86d21262ccd6ff271ece08a3?s=80
// @version 2.1.2
// @description 百度马甲切换不安全版（将保存用户名和密码，请慎用！）
// @homepageURL http://gerald.top/code/BaiduMultiuserUnsafe
// @match *://*.baidu.com/*
// @include *.baidu.com/*
// @exclude http://developer.baidu.com/*
// @exclude http://web.im.baidu.com/*
// @run-at  document-start
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_addStyle
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/4328/Baidu%20Multiuser%20Unsafe.user.js
// @updateURL https://update.greasyfork.org/scripts/4328/Baidu%20Multiuser%20Unsafe.meta.js
// ==/UserScript==

'use strict';

function safeText(text) {
  return text.replace(/[&<]/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
    }[m];
  });
}

function getValue(key, def) {
  var val = GM_getValue(key) || '';
  try {
    val = JSON.parse(val);
  } catch(e) {
    val = def;
  }
  return val;
}

function setValue(key, val) {
  GM_setValue(key, JSON.stringify(val));
}

function showMessage(msg) {
  var msgbox = manager.msgbox;
  msgbox.firstChild.innerHTML = msg;
  msgbox.style.display = 'block';
  msgbox.style.top = (innerHeight - msgbox.offsetHeight) / 2 + 'px';
  msgbox.style.left = (innerWidth - msgbox.offsetWidth) / 2 + 'px';
}

// function doSetCookie(str) {
//  var date = new Date();
//  if (str) date.setTime(16094e8);
//  else str = '';
//  document.cookie = 'BDUSS=' + str + ';domain=baidu.com;path=/;expires=' + date.toGMTString();
// }
//
// function setCookie(str) {
//  var re = /\bBDUSS=/;
//  if (re.test(document.cookie)) {
//    doSetCookie(str);
//    return true;
//  }
//  doSetCookie(str ? str : 'logout');
//  if (re.test(document.cookie)) {
//    if (!str) doSetCookie(str);
//    return true;
//  }
// }
//
// function extractData(form) {
//  var data = {};
//  form.replace(/<input [^>]*>/g, function(value) {
//    var attrs = {};
//    value.replace(/(\w+)="(.*?)"/g, function(value, group1, group2) {
//      attrs[group1] = group2;
//    });
//    data[attrs.name] = attrs.value;
//  });
//  return data;
// }
//
// function encodeData(data) {
//  var items = [];
//  for (var i in data)
//    items.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
//  return items.join('&');
// }

function switchUser(user) {
  function checkLogIn(callback) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'http://www.baidu.com',
      onload: function(res) {
        var match = res.responseText.match(/<span class=user-name>(.*?)<\/span>/);
        // if (match) setValue('ge_cuser', user);
        callback(!!match);
      },
    });
  }
  // function checkLogInMobile(res) {
  //  if (res.finalUrl.slice(0, manager.url_waplogin.length) == manager.url_waplogin)
  //    preLogInMobile(res.responseText);
  //  else if (res.finalUrl.slice(0, manager.url_protect.length) == manager.url_protect)
  //    logInProtect(res.responseText, res.finalUrl);
  //  else checkLogIn(function(ok) {
  //    if (ok) location.reload();
  //    else alert('出错了！我也不知道要怎么办。。');
  //  });
  // }
  // function logInProtect(src, url) {
  //  var j = src.indexOf('<div class="mod-content">');
  //  var i = src.indexOf('<form action="" method="post">');
  //  var msg = src.slice(j, i).match(/>([^<]*)</);
  //  j = src.indexOf('</form>', i);
  //  var form = src.slice(i, j);
  //  var data = extractData(form);
  //  var resend = src.match(/<a href="([^"]*)">再次发送<\/a>/);
  //  form = document.createElement('form');
  //  form.innerHTML =
  //    '<h3>马甲切换</h3>' +
  //    '<p>已启动登录保护！</p>' +
  //    (msg ? '<p>' + msg[1] + '</p>' : '') +
  //    '请输入手机收到的激活码：<input type=text class=vcode><br>' +
  //    '<button>重新发送</button>' +
  //    '<input type=submit>';
  //  if (resend) form.querySelector('button').onclick = function () {
  //    this.disabled = true;
  //    this.innerHTML = '正在发送...';
  //    GM_xmlhttpRequest({
  //      method: 'GET',
  //      url: 'http://wappass.baidu.com' + resend[1],
  //      headers: {
  //        'User-Agent': manager.User_Agent,
  //      },
  //      onload: function (res) {
  //        logInProtect(res.responseText, res.finalUrl);
  //      },
  //    });
  //  };
  //  form.onsubmit = function (e) {
  //    e.preventDefault();
  //    data.vcode = form.querySelector('.vcode').value;
  //    GM_xmlhttpRequest({
  //      method: 'POST',
  //      url: url,
  //      data: encodeData(data),
  //      headers: {
  //      },
  //      onload: checkLogInMobile,
  //    });
  //  };
  //  manager.msgbox.firstChild.innerHTML = '';
  //  manager.msgbox.firstChild.appendChild(form);
  // }
  // function doLogInMobile(data) {
  //  showMessage('正在使用手机版登录，请等待...');
  //  data['username'] = user;
  //  data['password'] = manager.users[user];
  //  GM_xmlhttpRequest({
  //    method: 'POST',
  //    url: manager.url_waplogin,
  //    data: encodeData(data),
  //    headers: postHeaders,
  //    onload: checkLogInMobile,
  //  });
  // }
  // function preLogInMobile(src) {
  //  var i = src.indexOf('<div id="error_area"');
  //  var j = src.indexOf('</div>', i);
  //  var msg = src.slice(i, j).match(/<span class="highlight">(.*?)<\/span>/);
  //  if (msg && msg[1] != '请您输入验证码')
  //    return showMessage('登录失败：' + msg[1]);
  //  i = src.indexOf('<form action="/passport/login"');
  //  j = src.indexOf('</form>', i);
  //  var form = src.slice(i, j);
  //  var data = extractData(form);
  //  data.submit = '登录';
  //  if (data['vcodestr']) {
  //    form = document.createElement('form');
  //    form.innerHTML =
  //      '<h3>马甲切换</h3>' +
  //      '请输入验证码：<input type=text class=vcode><br>' +
  //      '<img src=http://wappass.baidu.com/cgi-bin/genimage?' + data['vcodestr'] + ' style="cursor:pointer" title="看不清，换一张">' +
  //      '<input type=submit>';
  //    form.onsubmit = function (e) {
  //      e.preventDefault();
  //      data.verifycode = form.querySelector('.vcode').value;
  //      doLogInMobile(data);
  //    };
  //    form.querySelector('img').onclick = function () {
  //      setTimeout(logInMobile, 0);
  //    };
  //    manager.msgbox.firstChild.innerHTML = '';
  //    manager.msgbox.firstChild.appendChild(form);
  //  } else doLogInMobile(data);
  // }
  // function logInMobile(planB) {
  //  if (planB) showMessage('正在尝试手机版登录，请等待...');
  //  GM_xmlhttpRequest({
  //    method: 'GET',
  //    url: manager.url_waplogin + '?type=1',
  //    headers: {
  //      'User-Agent': manager.User_Agent,
  //    },
  //    onload: function (res) {
  //      if (!res.finalUrl) {
  //        setValue('ge_mobile', manager.mobile = false);
  //        showMessage('您的运行环境不支持手机版登录，已自动关闭此功能，正在切换到普通登录...');
  //        if (planB) setTimeout(planB, 2000);
  //        return;
  //      }
  //      preLogInMobile(res.responseText);
  //    },
  //  });
  // }
  function logInNormal() {
    setValue('ge_login', user);
    location.href = manager.url_login + encodeURIComponent(location.href);
  }
  function logIn() {
    // if (manager.mobile)
    //  logInMobile(logInNormal);
    // else
      logInNormal();
  }
  function logOut() {
    location.href = (/*manager.mobile ? manager.url_waplogout :*/ manager.url_logout) + encodeURIComponent(location.href);
  }
  // var postHeaders = {
  //   'User-Agent': manager.User_Agent,
  //   'Content-Type': 'application/x-www-form-urlencoded',
  // };
  if (user) { // 切换账号
    /*
    if (manager.mobile) {
      var cookie = manager.cookies[user];
      if(cookie) {
        if(setCookie(cookie))
          return checkLogIn(function (ok) {
            if (ok) location.reload();
            else {
              showMessage('Cookie失效了，正在尝试重新登录...');
              setTimeout(logIn, 1000);
            }
          });
        else
          showMessage('设置Cookie失败，正在尝试重新登录...<br>这可能是因为您使用了普通登录。');
      } else
        showMessage('没有找到Cookie，正在尝试重新登录...');
      return setTimeout(logIn,1000);
    }
    */
    logIn();
  } else {  // 登出
    /*
    if (manager.mobile) {
      if (setCookie())
        return checkLogIn(function (ok) {
          if(ok) logOut();
          else location.reload();
        });
      else
        showMessage('设置Cookie失败，正在尝试登出...<br>这可能是因为您使用了普通登录。');
    }
    */
    logOut();
  }
}

function initLoc() {
  var gu = manager.container;
  gu.right = gu._right = gu.parentNode.offsetWidth - gu.offsetWidth - gu.offsetLeft;
  gu.top = gu._top = gu.offsetTop;
}

function saveAndUpdate() {
  setValue('ge_users', manager.users);
  initMenu();
}

// function saveCookies() {
//  setValue('ge_cookies', manager.cookies);
// }

function saveLoc() {
  var gu = manager.container;
  setValue('ge_users_loc', {right: gu.right, top: gu.top});
}

function panelClick(e) {
  e.preventDefault();
  var target = e.target;
  var cmd = target.dataset.cmd;
  if(cmd == 'settings') { // 设置
    manager.showOptions();
  } else if (cmd == 'logout') { // 登出
    switchUser();
  } else if (cmd[0] == 'u') { // 切换
    cmd = decodeURI(cmd.slice(1));
    if (cmd) switchUser(cmd);
  }
}

function locate(loc) {
  var gu = manager.container;
  if (loc) {
    gu.right = loc && !isNaN(loc.right) ? loc.right : 100;
    gu.top = loc && !isNaN(loc.top) ? loc.top : 100;
  }
  gu.style.right = gu.right + 'px';
  gu.style.top = gu.top + 'px';
}

function mousemove(e) {
  var gu = manager.container;
  var loc = {
    right: gu._right + gu.x - e.pageX,
    top: gu._top + e.pageY - gu.y,
  };
  locate(loc);
}

function pinUpdate() {
  var gu = manager.container;
  var symbol = manager.symbol;
  if (gu.pin) {
    symbol.classList.add('ge_pin');
    symbol.setAttribute('title', '固定在页面上');
    gu.style.position = 'absolute';
  } else {
    symbol.classList.remove('ge_pin');
    symbol.setAttribute('title', '固定在屏幕上');
    gu.style.position = '';
  }
}

function pin() {
  var gu = manager.container;
  initLoc();
  if (gu.pin) // fixed => absolute
    gu.top += window.pageYOffset;
  else  // absolute => fixed
    gu.top -= window.pageYOffset;
  pinUpdate();
  locate();
  saveLoc();
}

function buildMenu() {
  GM_addStyle('\
#ge_uu{display:block;padding:10px;text-align:left;}\
#ge_uu .ge_h{display:none;}\
#ge_uu{z-index:10006;font:normal normal 400 12px/18px 宋体;position:fixed;}\
#ge_uu>span{background:white;color:blue;border-radius:3px;border:1px solid #c0c0c0;padding:3px;cursor:pointer;vertical-align:middle;}\
#ge_uu>div{position:relative;margin-top:3px;}\
#ge_uu>div>*{position:absolute;margin:0;padding:0;}\
.ge_uu{background:white;border:1px solid silver;box-shadow:5px 5px 7px #333;}\
.ge_uu{width:120px;max-height:400px;overflow-x:hidden;overflow-y:auto;}\
.ge_uu>li{position:relative;display:block;padding:2px 20px 4px 6px;}\
.ge_uu>li:hover,#gu_users .ge_user:hover{background:lightgray;}\
.ge_uu>li:last-child:hover{background:white;}\
.ge_uu span{position:absolute;top:0;right:0;color:white;background:#77f;border-radius:3px;margin:2px;cursor:pointer;padding:2px;}\
.ge_uu span:hover{background:red;}\
.ge_uu a,#gu_users span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;max-width:100%;}\
.ge_uu>li:last-child a{display:inline;}\
#gu_users{width:340px;height:100px;overflow:auto;border:1px solid;margin-bottom:.5em;}\
#gu_users .ge_user{position:relative;color:dodgerblue;}\
#gu_users .ge_name{display:block;margin-right:100px;padding:3px 5px;}\
#gu_users .ge_control{position:absolute;top:0;right:0;text-align:right;}\
.ge_sym{display:inline-block;width:7px;height:7px;border:1px solid #c0c0c0;border-radius:4px;margin-left:3px;}\
.ge_sym.ge_pin{background:#c0c0c0;}\
');
  if (!document.querySelector('#ge_css')) GM_addStyle('\
.ge_popup{display:none;z-index:10006;font:normal normal 400 12px/18px 宋体;position:fixed;background:white;border:1px solid silver;box-shadow:5px 5px 7px #333;text-align:left;}\
.ge_opt{padding:20px;border-radius:5px;}\
.ge_opt fieldset{border:1px solid silver;border-radius:5px;padding:5px;}\
.ge_opt textarea{min-height:100px;width:100%;}\
');
  var gu = manager.container = document.createElement('div');
  gu.id = 'ge_uu';
  gu.innerHTML = '<span>马甲<span class=ge_sym></span></span><div><ul class="ge_uu ge_h"></ul></div>';
  gu.style.display = getValue('float', '');
  var ul = manager.list = gu.querySelector('ul');
  ul.addEventListener('click', panelClick, false);
  var symbol = manager.symbol = gu.querySelector('.ge_sym');
  gu.pin = !!getValue('ge_pin');
  pinUpdate();
  symbol.addEventListener('click', function () {
    setValue('ge_pin', gu.pin = !gu.pin);
    pin();
  }, false);
  gu.addEventListener('mouseover', function (e) {
    if (this.contains(e.relatedTarget)) return;
    ul.classList.remove('ge_h');
    if (gu.offsetLeft + gu.firstChild.offsetLeft + ul.offsetWidth <= document.body.offsetWidth)
      ul.style.pixelLeft = 0;
    else
      ul.style.pixelLeft = document.body.offsetWidth - gu.offsetLeft - gu.firstChild.offsetLeft - ul.offsetWidth;
  }, false);
  gu.addEventListener('mouseout', function (e) {
    if (!this.contains(e.relatedTarget)) ul.classList.add('ge_h');
  }, false);
  document.body.appendChild(gu);
  gu.moving = false;
  locate(getValue('ge_users_loc', {}));
  gu.firstChild.draggable = true;
  gu.firstChild.addEventListener('dragstart', function (e) {
    e.preventDefault();
    if (e.target != gu.firstChild || gu.moving) return;
    gu.moving = true;
    initLoc();
    gu.x = e.pageX;
    gu.y = e.pageY;
    document.addEventListener('mousemove', mousemove, false);
  }, false);
  gu.addEventListener('mouseup', function (e) {
    if (!gu.moving) return;
    gu.moving = false;
    e.preventDefault();
    e.stopPropagation();
    document.removeEventListener('mousemove', mousemove, false);
    saveLoc();
  }, false);
  watch('ge_users', function (data) {
    manager.users = data;
    initMenu();
  }, function (now, old) {
    return !old && now || JSON.stringify(now) != JSON.stringify(old);
  });
  initMenu();
}

function initMenu() {
  var data = [];
  for(var i in manager.users)
    data.push('<li><a href=# data-cmd="u' + encodeURI(i) + '">' + safeText(i) + '</a></li>');
  data.push('<li><a href=# data-cmd=settings>设置</a> | <a href=# data-cmd=logout>登出</a></li>');
  manager.list.innerHTML = data.join('');
}

function initManage() {
  function addItem(name) {
    var div = document.createElement('div');
    div.className = 'ge_user';
    div.dataset.name = name;
    div.innerHTML = '<div class=ge_name>' + safeText(name) + '</div><div class=ge_control><button data-cmd=mod>修改</button><button data-cmd=del>删除</button></div>';
    users.appendChild(div);
  }
  var msgbox = manager.msgbox = document.createElement('div');
  msgbox.className = 'ge_popup ge_opt';
  msgbox.innerHTML = '<div></div><p align=right><button>关闭</button></p>';
  msgbox.querySelector('button').addEventListener('click', function () {
    msgbox.style.display = '';
  }, false);
  document.body.appendChild(msgbox);
  var popup = document.createElement('div');
  popup.className = 'ge_popup ge_opt';
  popup.innerHTML =
'<h3>百度马甲切换<font color=red>不安全版</font></h3>' +
'<fieldset><legend>马甲管理 <button data-id=add>添加</button></legend>' +
'<form data-id=modify style="display:none;">' +
'<input type=text data-id=user placeholder="用户名">' +
'<input type=password data-id=pwd placeholder="密码">' +
'<input type=submit value="确认">' +
'<input type=button data-id=cancel value="取消">' +
'</form><div id=gu_users></div>' +
// '<label><input type=checkbox data-id=mobile>尝试使用<b>手机版</b>登录模式和<b>Cookie快速切换</b>功能 ' +
// '<a title="使用手机版登录后其他脚本也可以获取cookie，主要缺点是使用频率较高时就会要求输入验证码">(?)</a></label><br>' +
'</fieldset>' +
'<fieldset><legend>马甲数据 <button data-id=import>导入</button> <button data-id=export>导出</button> ' +
'<a title="复制数据到以下文本框然后点击导入即可导入数据。\n点击导出后复制数据文本即可用于导入。">(?)</a></legend>' +
'<textarea data-id=data></textarea></fieldset>' +
'<p align=right><button data-id=close>关闭</button></p>';
  document.body.appendChild(popup);
  //popup.addEventListener('click', function (e) {e.stopPropagation();}, false);
  var users = popup.querySelector('#gu_users');
  var items = {}, current;
  Array.prototype.forEach.call(popup.querySelectorAll('[data-id]'), function(node) {
    items[node.dataset.id] = node;
  });
  // items.mobile.checked = manager.mobile;
  // items.mobile.addEventListener('change', function (e) {
  //  setValue('ge_mobile', manager.mobile = this.checked);
  // });
  items.add.addEventListener('click', function () {
    items.user.value = items.pwd.value = '';
    items.user.disabled = false;
    items.modify.style.display = 'block';
    current = null;
    items.user.focus();
  }, false);
  users.addEventListener('click', function (e) {
    var target = e.target;
    var cmd = target.dataset.cmd;
    if (cmd) {
      current = target.parentNode.parentNode;
      var user = current.dataset.name;
      if(cmd == 'del') {
        delete manager.users[user];
        // delete manager.cookies[user];
        current.parentNode.removeChild(current);
        current = null;
        saveAndUpdate();
        // saveCookies();
      } else if(cmd == 'mod') {
        items.user.value = user;
        items.user.disabled = true;
        items.pwd.value = manager.users[user];
        items.modify.style.display = 'block';
        items.pwd.focus();
        items.pwd.select();
      }
    }
  }, false);
  items.modify.addEventListener('submit', function (e) {
    e.preventDefault();
    var user = items.user.value;
    var pwd = items.pwd.value;
    if (!user || !pwd) return;
    if (current) {
      current.dataset.name = user;
      current.firstChild.innerHTML = safeText(user);
    } else addItem(user);
    manager.users[user] = pwd;
    saveAndUpdate();
    items.modify.style.display = 'none';
    current = null;
  }, false);
  items.cancel.addEventListener('click', function (e) {
    e.preventDefault();
    items.modify.style.display = 'none';
  }, false);
  items.data.addEventListener('click', function () {this.select();}, false);
  items.import.addEventListener('click', function () {
    var data = null;
    try{
      data = JSON.parse(unescape(window.atob(items.data.value)));
    } catch(e) {}
    if (data && data.version == 'unsafe' && data.users) {
      for (var i in data.users) manager.users[i] = data.users[i];
      saveAndUpdate();
      alert('导入成功！');
      manager.showOptions();
    } else alert('导入失败！');
  }, false);
  items.export.addEventListener('click', function () {
    var data = {version: 'unsafe', users: manager.users};
    items.data.value = window.btoa(escape(JSON.stringify(data)));
  }, false);
  items.close.addEventListener('click', function () {popup.style.display = '';}, false);
  manager.showOptions = function () {
    popup.style.display = 'block';
    popup.style.top = (innerHeight - popup.offsetHeight) / 2 + 'px';
    popup.style.left = (innerWidth - popup.offsetWidth) / 2 + 'px';
    users.innerHTML = '';
    for(var i in manager.users) addItem(i);
  };
}

function watch(key, cb, comp, interval) {
  function loop() {
    var value = getValue(key);
    if (comp ? comp(value, lastValue) : value != lastValue) cb(value);
    lastValue = value;
    setTimeout(loop, interval || 1000);
  }
  var lastValue;
  loop();
}

function init() {
  var user = getValue('ge_login');
  var pwd;
  manager.users = getValue('ge_users', {});
  if (typeof manager.users == 'string') try {
    manager.users = JSON.parse(manager.users);
  } catch(e) {
    manager.users = {};
  }
  // manager.cookies = getValue('ge_cookies', {});
  // manager.mobile = getValue('ge_mobile', true);
  if (location.href.slice(0, manager.url_login.length) == manager.url_login) {
    pwd = manager.users[user];
    // XXX: encode pwd
  }
  if (user) setValue('ge_login', '');
  if (pwd) {
    !function(user){
      window.addEventListener('load', function () {
        document.querySelector('#TANGRAM__PSP_3__userName').value = user;
        document.querySelector('#TANGRAM__PSP_3__password').value = pwd;
        document.querySelector('#TANGRAM__PSP_3__submit').click();
      }, false);
    }(user);
  } else {
    window.addEventListener('DOMContentLoaded', function () {
      if (window.top === window && document.head) {
        initManage();
        buildMenu();
      }
    }, false);
  }
  // user = getValue('ge_cuser');
  // if (user) {  // update cookie
  //  var match = document.cookie.match(/\bBDUSS=(.*?)(;|$)/);
  //  if (match) {
  //    manager.cookies[user] = match[1];
  //    saveCookies();
  //  }
  //  setValue('ge_cuser', '');
  // }
}

var manager = {
  // User_Agent: 'Most handsome in the world',
  // url_waplogin: 'http://wappass.baidu.com/passport/login',
  // url_waplogout: 'http://wappass.baidu.com/passport/?logout&u=',
  url_login: 'https://passport.baidu.com/v2/?login&u=',
  url_logout: 'https://passport.baidu.com/?logout&u=',
  url_protect: 'http://wappass.baidu.com/wp/login/sec?u=',
};
init();

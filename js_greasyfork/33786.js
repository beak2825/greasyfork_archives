// ==UserScript==
// @name         FxP Block+
// @namespace    https://greasyfork.org/he/users/62051-dacurse0
// @version      1.0.1
// @description  Completly blocks users in FxP
// @author       DaCurse0
// @copyright    2017+, DaCurse0+
// @match        https://www.fxp.co.il/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33786/FxP%20Block%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/33786/FxP%20Block%2B.meta.js
// ==/UserScript==
const factoryDefaults = {
  blocked: [],
  dba: ''
}

const Parser = new DOMParser();
const Data = getLocalData();

function get_userid(username) {
  return new Promise(async(res, rej) => {
    let data = await $.get(`https://www.fxp.co.il/member.php?username=${username}`);
    let doc = Parser.parseFromString(data, 'text/html');
    try {
      let uid = $(doc).find('.userprof_content>dl>dd>a').attr('href').substr(35);
      res(uid);
    } catch (ex) {
      rej('User doesn\'t exist');
    }
  });
}

function get_username(userid) {
  return new Promise(async(res, rej) => {
    let data = await $.get(`https://www.fxp.co.il/member.php?u=${userid}`);
    let doc = Parser.parseFromString(data, 'text/html');
    let un = $(doc).find('.member_username').text().trim();
    if (un === '') rej('User doesn\'t exist');
    else res(un);
  });
}

function getLocalData() {
  let data;
  try {
    data = JSON.parse(localStorage.fxpblockplus);
  } catch (ex) {
    data = factoryDefaults;
  }
  return data;
}

function saveData() {
  localStorage.fxpblockplus = JSON.stringify(Data);
}

function menuOption() {
  let option = $('#yui-gen0').children().last().prev();
  let sepHtml = $('<div>').append(option.clone()).html();
  option.before(sepHtml);
  option.before('<div style="height: 15px;"><a href="javascript:" id="blockplus">הגדרות Block+</a></div>');
}

function createMenu() {
  let menuCss =
    `<style>
#blockplus-menu {
  width: 400px;
  height: 400px;
  z-index: 9999;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
}

#blockplus-menu > div {
  margin: 10px;
}

#blocked-users {
  width: 100%;
  min-height: 200px;
  margin-bottom: 5px;
}

#blockplus-menu button {
  padding: 5px 10px;
  font-size: 12pt;
  margin-bottom: 8px;
}

#userblockname, #userblockmsg {
  width: 83%;
  height: 30px;
  font-size: 14pt;
  border: solid 1px #6b91ab;
  outline: none;
}

#remusers, #closeusers {
  width: 100%;
}
</style>`;

  $('head').append(menuCss);

  let menuHtml =
    `<div id="blockplus-menu" style="display: none;">
  <div>
    <label for="blocked-users">משתמשים חסומים:</label>
    <select multiple id="blocked-users">

    </select>
    <input type="text" id="userblockname" placeholder="שם משתמש..." />
    <button id="adduser">הוסף</button><br/>
    <input type="text" id="userblockmsg" placeholder="כרגע מבוטל" />
    <button id="changemsg" disabled>שנה </button><br/>
    <button id="remusers" disabled>מחק בחירה</button>
    <button id="closeusers" onclick="$('#blockplus-menu').hide()">סגור</button>
  </div>
</div>`

  $('body').append(menuHtml);
  $('#userblockmsg').val(Data.dba);
  bindEvents();
  refreshUsers();

}

function refreshUsers() {
  $('#blocked-users').children().remove();
  Data.blocked.forEach(async u => {
    let username = await get_username(u);
    $('#blocked-users').append(`<option>${username} - ${u}</option>`);
    //blockUsers2();
  });
}

function bindEvents() {
  $('#blockplus').click(() => {
    $('#blocked-users option:selected').removeAttr('selected');
    $('#remusers').attr('disabled', true);
    $('#blockplus-menu').show();
    $('#yui-gen1').get(0).click();
  });
  $('#adduser').click(async() => {
    $('#adduser').attr('disabled', true);
    let username = $('#userblockname').val();
    let userid;
    try {
      $('#userblockname').val('');
      userid = await get_userid(username);
    } catch (ex) {
      alert('המשתמש הזה לא קיים או שהוא בבאן!');
      $('#adduser').removeAttr('disabled');
      return;
    }
    $('#adduser').removeAttr('disabled');
    if (Data.blocked.includes(userid)) {
      alert("המשתמש הזה כבר קיים ברשימת החסומים!");
      return;
    }
    Data.blocked.push(userid);
    refreshUsers();
  });
  $('#blocked-users').change(() => {
    let users = $('#blocked-users').val();
    (users !== null) ?
    $('#remusers').removeAttr('disabled'):
      $('#remusers').attr('disabled', true);
  });
  $('#remusers').click(() => {
    let users = $('#blocked-users').val();
    if (users !== null) {
      let uids = [];
      users.forEach(u => {
        uids.push(u.split(' - ')[1]);
      });
      Data.blocked = Data.blocked.filter(u => {
        return uids.indexOf(u) === -1;
      });
      refreshUsers();
      $('#remusers').attr('disabled', true);
    }
  });
  $('#changemsg').click(() => {
    let msg = $('#userblockmsg').val();
    if (msg.trim() == '') {
      alert('השדה לא יכול להיות ריק!');
      return;
    }
    Data.dba = msg;
  });
  blockUsers();
}

function blockUsers() {
  let path = location.pathname;
  if (path === "/forumdisplay.php") {
    $('.threadbit').each((_, t) => {
      let uid = $(t).find('.label a').attr('href');
      Data.blocked.forEach(u => {
        if (uid.includes(u)) {
          $(t).remove();
        }
      });
    });
  } else if (path === "/showthread.php") {
    $('.postbit').each((_, c) => {
      let uid = $(c).find('.username').attr('href');
      Data.blocked.forEach(u => {
        if (uid.includes(u)) {
          $(c).remove();
        }
      });
    });
  }
}

function blockUsers2() {
  let uns = [];
  $('#blocked-users').children().each((_, o) => {
    uns.push($(o).text().split(' - ')[0]);
  });
  uns.forEach(u => {
    $('#postlist').html($('#postlist').html().split(u).join(Data.dba));
  });
}

function Init() {
  $(window).unload(() => {
    saveData();
  });
  menuOption();
  createMenu();
}

$(Init);

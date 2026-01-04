// ==UserScript==
// @name Gerrit fill user and pass
// @name:zh-CN   gerrit自动填写用户名和密码
// @namespace    https://greasyfork.org/en/scripts/468104-gerrit-fill-user-and-pass
// @description  On page of gerrit, JIRA and bugzilla login, fill username and password, and click OK.
// @description:zh-CN 在gerrit、JIRA和bugzilla登录页面填写用户名和密码并点击完成。
// @license      Apache-2.0. And not welcomed to be modified or used by, or, if possible, redistributed to people who discriminate against people based on race, gender or sexual orientation.
// @author       Allen Tse
// @version      2.2
// @include      SetYourUrl4GerritJiraBugzilla
// @grant GM.getValue
// @grant GM.setValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/468104/Gerrit%20fill%20user%20and%20pass.user.js
// @updateURL https://update.greasyfork.org/scripts/468104/Gerrit%20fill%20user%20and%20pass.meta.js
// ==/UserScript==

/* jshint esversion: 8 */ //for async()

function run() {
  var svr=chkEles();
  console.log('server='+svr);
  if (svr=='') {
    return;
  }
//
(async () => {
  var usrname=await GM.getValue('usrname', '');
  var passwd=await GM.getValue('passwd', '');

  if (!usrname || usrname.toString()=='') {
    usrname=prompt('user name', '');
    if (!usrname || usrname.toString()=='') {
      return;
    }
    GM.setValue('usrname', usrname);
  }
  if (!passwd || passwd.toString()=='') {
    passwd=prompt('password', '');
    if (!passwd || passwd.toString()=='') {
      return;
    }
    GM.setValue('passwd', passwd);
  }
  console.log("passwd,usrname="+passwd.toString()+","+usrname.toString());

  switch (svr) {
    case 'gerrit':
      filgerrit(usrname, passwd);
      break;
    case 'jira':
      filjira(usrname, passwd);
      break;
    case 'bugzilla':
      filbz(usrname, passwd);
  }
})();
}

function gerrit_getUsr() {
  return document.getElementById('f_user');
}
function gerrit_getPass() {
  return document.getElementById('f_pass');
}
function gerrit_getBut() {
    return document.getElementById('b_signin');
}
function gerrit_getFrm() {
    return document.getElementById('login_form');
}

function jira_getUsr() {
  return document.getElementById('login-form-username');
}
function jira_getPass() {
  return document.getElementById('login-form-password');
}
function jira_getBut() {
  return document.getElementById('login');
}
function jira_getFrm() {
  return document.getElementById('login-form');
}

function bz_getUsr() {
  return document.getElementById('Bugzilla_login_top');
}
function bz_getPass() {
  return document.getElementById('Bugzilla_password_top');
}
function bz_getBut() {
  return null;
}
function bz_getFrm() {
  return document.getElementById('mini_login_top');
}

function chkEles() {
  var ret='';
  var meta = document.getElementsByTagName("meta");
  if (meta) {
    for (let mt1 of meta) {
      var val = mt1.name;
      if (!val) {
        continue;
      }
      switch (val) {
        case 'application-name':  //JIRA
          val = mt1.content;
          if (!val) {
            break;
          }
          switch (val) {
            case 'JIRA':
              ret='jira';
          }
          break;
        case 'description': //Gerrit
          val = mt1.content;
          if (!val) {
            break;
          }
          switch (val) {
            case 'Gerrit Code Review':
              ret='gerrit';
          }
      }
      if (ret!='') {
        break;
      }
    }
  }
  if (ret=='') {
    if (document.getElementById('gerrit_body')) {
      ret='gerrit';
    } else if (document.getElementById('bugzilla-body')) {
      ret='bugzilla';
    }
  }
  var ele1;
  switch (ret) {
    case 'gerrit':
      if (gerrit_getUsr() && gerrit_getPass() &&
      (gerrit_getBut() || gerrit_getFrm())) {
        ele1=document.getElementById('error_message');
        if (ele1) {
          console.log('gerrit error');
          ret='';
        }
      } else {
        console.log('gerrit missing elements');
        ret='';
      }
      break;
    case 'jira':
      if (jira_getUsr() && jira_getPass() &&
      (jira_getBut() || jira_getFrm())) {
        ele1=document.getElementsByClassName('aui-message error');
        if (ele1 && ele1.length > 0) {
          console.log('jira error');
          ret='';
        }
      } else {
        console.log('jira missing elements');
        ret='';
      }
      break;
    case 'bugzilla':
      if (bz_getUsr() && bz_getPass() &&
      (bz_getBut() || bz_getFrm())) {
      } else {
        console.log('bugzilla missing elements');
        ret='';
      }
  }
  return ret;
}

function filgerrit(usrname, passwd) {
  var ele1=gerrit_getUsr();
  if (ele1) {
    ele1.value = usrname;
    ele1=gerrit_getPass();
    if (ele1) {
      ele1.value = passwd;
      ele1=gerrit_getBut();
      if (ele1) {
        ele1.click();
      } else {
        ele1=gerrit_getFrm();
        if (ele1) {
          ele1.submit();
        }
      }
    }
  }
}

function filjira(usrname, passwd) {
  var ele1=jira_getUsr();
  if (ele1) {
    ele1.value = usrname;
    ele1=jira_getPass();
    if (ele1) {
      ele1.value = passwd;
      ele1=jira_getBut();
      if (ele1) {
        ele1.click();
      } else {
        ele1=jira_getFrm();
        if (ele1) {
          ele1.submit();
        }
      }
    }
  }
}

function filjira(usrname, passwd) {
  var ele1=jira_getUsr();
  if (ele1) {
    ele1.value = usrname;
    ele1=jira_getPass();
    if (ele1) {
      ele1.value = passwd;
      ele1=jira_getBut();
      if (ele1) {
        ele1.click();
      } else {
        ele1=jira_getFrm();
        if (ele1) {
          ele1.submit();
        }
      }
    }
  }
}

function filbz(usrname, passwd) {
  var ele1=bz_getUsr();
  if (ele1) {
    ele1.value = usrname;
    ele1=bz_getPass();
    if (ele1) {
      ele1.value = passwd;
      ele1=bz_getBut();
      if (ele1) {
        ele1.click();
      } else {
        ele1=bz_getFrm();
        if (ele1) {
          ele1.submit();
        }
      }
    }
  }
}

// in case the document is already rendered
if (document.readyState!='loading') run();
// modern browsers
else if (document.addEventListener) document.addEventListener('DOMContentLoaded', run);
// IE <= 8
else document.attachEvent('onreadystatechange', function(){
    if (document.readyState=='complete') run();
});
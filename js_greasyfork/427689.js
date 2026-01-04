// ==UserScript==
// @name         UMMoodle enhancer
// @version      3.92
// @Time stamp   [2021-10-19]
// @description  Enhancing UMMoodle usability
// @author       Anthony Tang
// @email        ???
// @icon         https://ummoodle.um.edu.mo/theme/image.php/boost/theme/1546050157/favicon
// @noframes
// @match        https://ummoodle.um.edu.mo/course/view.php*
// @license      MIT
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @run-at      document-start
// @namespace https://greasyfork.org/users/781390
// @downloadURL https://update.greasyfork.org/scripts/427689/UMMoodle%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/427689/UMMoodle%20enhancer.meta.js
// ==/UserScript==
'use strict';




//Thing to do when loading is done
document.addEventListener('DOMContentLoaded', function() {
    var pagePosition = sessionStorage.getItem("pagePosition");
    if (pagePosition > 0) {
        window.scrollTo({ top: pagePosition, behavior: 'smooth' });
        sessionStorage.setItem("pagePosition", -1); //disable scroll at next load
    }


    if(document.getElementsByClassName("meta role role-student").length > 0) {//Currently in student mode
        changeBorder("groove");
    }
}, false);



var toggleEditingButton = '<div id="div-editing-btn" onclick="javascript:;" title="Toggle editing on/off"></div>';
var toggleRoleButton = '<div id="div-role-btn" onclick="javascript:;" title="Toggle professor/student modes"></div>';
var changeRichEditorButton = '<div id="div-rich-editor-btn" onclick="javascript:;" title="Switch to HTML/richtext editor"></div>';
var changeTextEditorButton = '<div id="div-text-editor-btn" onclick="javascript:;" title="Switch to text/markdown editor"></div>';

addGlobalStyle('editing', '#div-editing-btn { background: ' + getIcon('editing') + ' no-repeat; z-index: 999; background-size: contain; width: 50px; height: 50px; position: fixed; top: 430px; left: 280px; opacity: 0.6; cursor: pointer; } #div-editing-btn:hover { opacity: 1; }');
addGlobalStyle('changeRole', '#div-role-btn { background: ' + getIcon('changeRole') + ' no-repeat; z-index: 999; background-size: contain; width: 50px; height: 50px; position: fixed; top: 490px; left: 280px; opacity: 0.6; cursor: pointer; } #div-role-btn:hover { opacity: 1; }');
addGlobalStyle('changeRichEditor', '#div-rich-editor-btn { background: ' + getIcon('changeRichEditor') + ' no-repeat; z-index: 999; background-size: contain; width: 50px; height: 50px; position: fixed; top: 550px; left: 280px; opacity: 0.6; cursor: pointer; } #div-rich-editor-btn:hover { opacity: 1; }');
addGlobalStyle('changeTextEditor', '#div-text-editor-btn { background: ' + getIcon('changeTextEditor') + ' no-repeat; z-index: 999; background-size: contain; width: 50px; height: 50px; position: fixed; top: 610px; left: 280px; opacity: 0.6; cursor: pointer; } #div-text-editor-btn:hover { opacity: 1; }');

var tempDivEditing = document.createElement('div');
tempDivEditing.innerHTML = toggleEditingButton;
document.body.insertAdjacentElement('beforeend', tempDivEditing.firstChild);

var tempDivRole = document.createElement('div');
tempDivRole.innerHTML = toggleRoleButton;
document.body.insertAdjacentElement('beforeend', tempDivRole.firstChild);

var tempDivRichEditor = document.createElement('div');
tempDivRichEditor.innerHTML = changeRichEditorButton;
document.body.insertAdjacentElement('beforeend', tempDivRichEditor.firstChild);

var tempDivTextEditor = document.createElement('div');
tempDivTextEditor.innerHTML = changeTextEditorButton;
document.body.insertAdjacentElement('beforeend', tempDivTextEditor.firstChild);

var tgEditingBtn = document.getElementById('div-editing-btn');
var tgRoleBtn = document.getElementById('div-role-btn');
var chgRichBtn = document.getElementById('div-rich-editor-btn');
var chgTextBtn = document.getElementById('div-text-editor-btn');

function findButtonbyTextContent(text) {
  var buttons = document.querySelectorAll('button');
  for (var i=0, l=buttons.length; i<l; i++) {
    if (buttons[i].firstChild.nodeValue == text)
      return buttons[i];
  }  
}

tgEditingBtn.onclick = function(event) {
    if (document.getElementsByClassName("meta role role-student").length > 0) {//already in student mode, editing is not allowed
        alert("Currently you are under student mode. You need to switch back to professor mode first!");
        return;
    }

    var ypos = document.getScroll()[1];
    var btn_on = findButtonbyTextContent("Turn editing on")
    if (typeof btn_on != "undefined")
    {
      sessionStorage.setItem("pagePosition", readonly2editing(ypos));
      btn_on.click()
    }
else
    {
      var btn_off = findButtonbyTextContent("Turn editing off")
      if (typeof btn_off != "undefined")
      {
        sessionStorage.setItem("pagePosition", editing2readonly(ypos));
        btn_off.click()
      }
      else
        alert('Toggle button not found! Please examine the HTML source.');
      
    }
    //alert(pagePostion);
    // var button = document.getElementsByTagName("button");
    // for (var i = 0; i < button.length; i++) {
    //   if (button[i].innerHTML === "text") {
    //     button[i].click();
    //   }
    // }
    // if(document.getElementsByClassName("section_action_menu").length > 0) {//Currently in editing mode, toggle to read-only
    //     sessionStorage.setItem("pagePosition", editing2readonly(ypos));
    //     document.getElementById("single_button616da932649a92").click();
    // }
    // else {//Currently in read-only mode, toggle to editing
    //     sessionStorage.setItem("pagePosition", readonly2editing(ypos));
    //     document.getElementById("action-menu-2-menu").getElementsByTagName("a")[1].click();
    // }
}


tgRoleBtn.onclick = function(event) {
    var ypos = document.getScroll()[1];
    sessionStorage.setItem("pagePosition", ypos);

    if (document.getElementsByClassName("meta role role-student").length > 0) {//already in student mode, return to regular role
        document.getElementById("action-menu-1-menu").getElementsByTagName("a")[6].click();
    }
    else {
        //parse course id from url: https://ummoodle.umac.mo/course/view.php?id=123456
        var matches = /id=([^&#=]*)/.exec(window.location.search);
        var courseID = matches[1];

        var sessionKey = getSession();

        //alert(courseID + "/" + sessionKey);
        post('/course/switchrole.php', {id: courseID, switchrole: '5', returnurl: 'https://ummoodle.um.edu.mo/course/view.php?id=' + courseID, sesskey: sessionKey });
    }
}


chgRichBtn.onclick = function(event) {
    var ypos = document.getScroll()[1];
    sessionStorage.setItem("pagePosition", ypos);

    var userid = document.getElementById("nav-notification-popover-container").getAttribute("data-userid");

    var matches = /id=([^&#=]*)/.exec(window.location.search);
    var courseID = matches[1];

    var sessionKey = getSession();

    //alert(userid + "/" + courseID + "/" + sessionKey);
    post('/user/editor.php', {id: userid, sesskey: sessionKey, _qf__user_edit_editor_form: '1', preference_htmleditor: 'tinymce'});
    var urlCoursePortal = 'https://ummoodle.um.edu.mo/course/view.php?id=' + courseID;
    alert("Default editor has been changed to: Atto HTML editor");
    window.location.href = urlCoursePortal;
}


chgTextBtn.onclick = function(event) {

    var ypos = document.getScroll()[1];
    sessionStorage.setItem("pagePosition", ypos);

    var userid = document.getElementById("nav-notification-popover-container").getAttribute("data-userid");

    var matches = /id=([^&#=]*)/.exec(window.location.search);
    var courseID = matches[1];

    var sessionKey = getSession();

    post('/user/editor.php', {id: userid, sesskey: sessionKey, _qf__user_edit_editor_form: '1', preference_htmleditor: 'textarea'});
    var urlCoursePortal = 'https://ummoodle.um.edu.mo/course/view.php?id=' + courseID;
    alert("Default editor has been changed to: plain text (markdown) editor");
    window.location.href = urlCoursePortal;
}





//For debug use
// var divMain = document.getElementById("region-main");
// divMain.onclick = function(event) {
//     alert(document.getScroll()[1]);
// }



function addGlobalStyle(name, css) {
 var head, style;
 head = document.getElementsByTagName('head')[0];
 if (!head) {
  return;
 }
 style = document.createElement('style');
 style.type = 'text/css';
 style.innerHTML = css;
 style.className += ' ' + name + '-btn-css ';
 head.appendChild(style);
}



/**
 * sends a request to the specified url from a form. this will change the window location.
 * @param {string} path the path to send the post request to
 * @param {object} params the paramiters to add to the url
 * @param {string} [method=post] the method to use on the form
 */

function post(path, params, method='post') {

    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    const form = document.createElement('form');
    form.method = method;
    form.action = path;

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const hiddenField = document.createElement('input');
        hiddenField.type = 'hidden';
        hiddenField.name = key;
        hiddenField.value = params[key];

        form.appendChild(hiddenField);
      }
    }

    document.body.appendChild(form);
    form.submit();
  }


document.getScroll = function() {
    if (window.pageYOffset !== undefined) {
        return [pageXOffset, pageYOffset];
    } else {
        var sx, sy, d = document,
            r = d.documentElement,
            b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return [sx, sy];
    }
}

function changeBorder(style){
    document.getElementById("region-main").style.border = style;
}


//Parse session id from the html document header
function getSession(){
    var document_markup = document.documentElement.innerHTML;
    var sessionKey = document_markup.match(/"sesskey":"(.*)","sessiontimeout/)[1];
    return sessionKey;
}


//Read-only mode takes less space, therefore should scroll less so as to accurately re-locate after reloading
//tranformation functions. The magical numbers below are from the regression model of readonly->editing created by fitting 6 pairs of y positions (.9996 R-square!)
//Note that it may not fit as good in other display resolutions than 1920 x 1200
/*
editing	    187	665	1102	1867	2340	2526
read-only	200	670	1055	1715	2147	2331
*/
function readonly2editing(x){
    return -56.65587549 + x* 1.111965417;
}

function editing2readonly(x){
    return (x+ 56.65587549) /1.111965417;
}



// Resource definition /////////////////////////////////////////////////////////////

function getIcon(name) {
 var editingIcon = 'url("data:image/png;base64,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")';
 var roleIcon = 'url("data:image/png;base64,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")';
 var richEditorIcon = 'url("data:image/png;base64,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")';
 var textEditorIcon = 'url("data:image/png;base64,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")';
 var nullIcon = 'url("data:image/png;base64,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")';

 switch (name) {
  case 'editing':
   return editingIcon;
  case 'changeRole':
   return roleIcon;
  case 'changeRichEditor':
   return richEditorIcon;
  case 'changeTextEditor':
   return textEditorIcon;
  default:
   return nullIcon;
 }
}


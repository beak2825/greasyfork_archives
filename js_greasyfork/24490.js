// ==UserScript==
// @name         IITU Contester tools
// @namespace    https://greasyfork.org/ru/users/77226
// @version      0.4.3
// @description  Customize your contester
// @author       Diasonti
// @match        http://contester.iitu.kz/*
// @license      Creative Commons; http://creativecommons.org/licenses/by/4.0/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/highlight.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/languages/cpp.min.js
// @resource highlightJsCss https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.8.0/styles/atom-one-light.min.css
// @grant GM_addStyle
// @grant GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/24490/IITU%20Contester%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/24490/IITU%20Contester%20tools.meta.js
// ==/UserScript==
//-----------------GM_set/getValue fix------------------------------------------------------------------
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf('not supported') > - 1)) {
  this.GM_getValue = function (key, def) {
    return localStorage[key] || def;
  };
  this.GM_setValue = function (key, value) {
    localStorage[key] = value;
  };
  this.GM_deleteValue = function (key) {
    return delete localStorage[key];
  };
} //----------------Global Variables-------------------------------------------------------------------

var defaultCompiler = '' + GM_getValue('ctdc', 'cpp');
var defaultSubmType = '' + GM_getValue('ctdsb', 'text');
var defaultStudent = '' + GM_getValue('ctdst', 'Admin');
var enableSH = GM_getValue('ctsh', 1);
/*
console.log("Defaults loaded");
console.log("defaultCompiler: " + defaultCompiler);
console.log("defaultSubmType: " + defaultSubmType);
console.log("defaultStudent: " + defaultStudent);
console.log("enableSH: " + enableSH);
*/
//-------------------------MAIN----------------------------------------------------------------------
GM_addStyle(GM_getResourceText('highlightJsCss'));
hljs.configure({
  tabReplace: '    ',
  useBR: true,
  languages: [
    'cpp'
  ]
});
$(document).ready(function () {
  initSettingsBlock();
  initSettingsButton();
  $('button#save').click(function () {
    saveSettings();
  });
  $('button#cancel').click(function () {
    $('div#ctsetb').show();
    $('div#ctsettings').hide();
  });
  $('div#ctsetb').click(function () {
    $('div#ctsetb').hide();
    $('div#ctsettings').show();
  });
  $('body').click(function () {
    setStudent(defaultStudent);
    setSubmType(defaultSubmType);
    setComp(defaultCompiler);
    if (defaultCompiler == 'cpp') {
      highlightCode();
    }
  });
  /*
            setTimeout(function(){
                console.log("TIMER");
                setSubmType(defaultSubmType);
                setComp(defaultCompiler);
            }, 200);
            */
});
//----------------------------FUNCTIONS-------------------------------------------------------------
function setSubmType(st) { //----SET SUBMISSION TYPE
  if (st == 'file') {
    //show('m_code_as_file');
    document.getElementById('m_code_as_file').style = '';
    //hide('m_code_as_text');
    document.getElementById('m_code_as_text').style = 'display:none;';
    //obj('m_take').value = 'file'; //to file
    document.getElementById('m_take').value = 'file';
  } 
  else if (st == 'text') {
    //show('m_code_as_text');
    document.getElementById('m_code_as_text').style = '';
    //hide('m_code_as_file');
    document.getElementById('m_code_as_file').style = 'display:none;';
    //obj('m_take').value = 'text'; // to text
    document.getElementById('m_take').value = 'text';
  }  //console.log('Submtype set: ' + st);

  return;
}
function setComp(dc) { //----SET COMPILER
  if (dc == 'cpp') {
    $('#m_acompiler option:contains("C++ (C++)")').attr('selected', true);
  } 
  else if (dc === 'pascal') {
    $('#m_acompiler option:contains("Pascal (Free Pascal 2.6.0)")').attr('selected', true);
  }  //console.log('Compiler set: ' + dc);

  return;
}
function setStudent(ds) { //-------SET STUDENT
  $('#sgr_uid option:contains(' + ds + ')').attr('selected', true);
  $('#m_uid option:contains(' + ds + ')').attr('selected', true);
  //console.log('Student set: ' + ds);
  return;
}
function highlightCode() { //----------HIGHLIGHT CODE
  if (document.getElementsByTagName('nobr') [0] !== undefined && enableSH == 1) {
    for (var j = 0; j < document.getElementsByTagName('nobr').length; j++) {
      var pre = document.createElement('pre');
      var newcode = document.createElement('code');
      var code = document.getElementsByTagName('nobr') [j];
      pre.appendChild(newcode);
      code.parentElement.appendChild(pre);
      newcode.appendChild(code);
      $('pre code nobr').each(function (i, block) {
        hljs.highlightBlock(block);
      });
      $('pre').css({
        'margin': '0'
      });
      $('code').css({
        'padding': '0'
      });
      $('nobr').css({
        'padding': '0',
        'background': 'none'
      });
      pre.parentElement.parentElement.parentElement.parentElement.parentElement.style = pre.parentElement.parentElement.parentElement.parentElement.parentElement.style + 'width:100%;';
      //console.log('Code Highlighted');
    }
  }
}
function initSettingsBlock() { //----SETTINGS BLOCK
  var set = document.createElement('div');
  document.body.appendChild(set);
  set.id = 'ctsettings';
  $('div#ctsettings').css({
    'position': 'fixed',
    'bottom': '0',
    'right': '0',
    'height': '350px',
    'width': '300px',
    'background': 'white',
    'border': '1px solid black'
  });
  var mainb = document.createElement('div');
  var footb = document.createElement('div');
  document.getElementById('ctsettings').appendChild(mainb);
  document.getElementById('ctsettings').appendChild(footb);
  mainb.id = 'mainb';
  footb.id = 'footb';
  $('div#mainb').css({
    'height': '310px',
    'padding': '7px'
  });
  $('div#footb').css({
    'height': '40px',
    'padding': '2px'
  });
  //----Main Section
  var header = document.createElement('p');
  document.getElementById('mainb').appendChild(header);
  header.id = 'ctheader';
  header.innerHTML = '<b>Contester Tools</b>';
  $('p#ctheader').css({
    'margin': '2px'
  });
  var compilerLabel = document.createElement('p');
  document.getElementById('mainb').appendChild(compilerLabel);
  compilerLabel.id = 'ctclabel';
  compilerLabel.innerHTML = 'Default compiler: <br>';
  var compilerSelect = document.createElement('select');
  document.getElementById('mainb').appendChild(compilerSelect);
  compilerSelect.id = 'ctcsel';
  /*
    var defopt = document.createElement("option");
    document.getElementById("ctcsel").appendChild(defopt);
    defopt.id = "def";
    defopt.innerHTML = "def";
    $("option#def").attr("value","java");
*/
  var cppopt = document.createElement('option');
  document.getElementById('ctcsel').appendChild(cppopt);
  cppopt.id = 'cpp';
  cppopt.innerHTML = 'C++';
  $('option#cpp').attr('value', 'cpp');
  var pascalopt = document.createElement('option');
  document.getElementById('ctcsel').appendChild(pascalopt);
  pascalopt.id = 'pascal';
  pascalopt.innerHTML = 'Pascal';
  $('option#pascal').attr('value', 'pascal');
  $('option#' + defaultCompiler).attr('selected', true);
  var submLabel = document.createElement('p');
  document.getElementById('mainb').appendChild(submLabel);
  submLabel.id = 'ctsblabel';
  submLabel.innerHTML = 'Default submission type: <br>';
  var submSelect = document.createElement('select');
  document.getElementById('mainb').appendChild(submSelect);
  submSelect.id = 'ctsbsel';
  var textopt = document.createElement('option');
  document.getElementById('ctsbsel').appendChild(textopt);
  textopt.id = 'textopt';
  textopt.innerHTML = 'Text';
  $('option#textopt').attr('value', 'text');
  var fileopt = document.createElement('option');
  document.getElementById('ctsbsel').appendChild(fileopt);
  fileopt.id = 'fileopt';
  fileopt.innerHTML = 'File';
  $('option#fileopt').attr('value', 'file');
  $('option#' + defaultSubmType + 'opt').attr('selected', true);
  var studentLabel = document.createElement('p');
  document.getElementById('mainb').appendChild(studentLabel);
  studentLabel.id = 'ctslabel';
  studentLabel.innerHTML = 'Default student: <br>';
  if (document.getElementById('sgr_uid') !== null) {
    var studentsList = document.getElementById('sgr_uid');
    var studentSelect = studentsList.cloneNode(true);
    document.getElementById('mainb').appendChild(studentSelect);
    studentSelect.id = 'ctssel';
    $('#ctssel').removeAttr('name class onchange');
    $('#ctssel option:contains(' + defaultStudent + ')').attr('selected', true);
  } 
  else {
    var studentl = document.createElement('select');
    document.getElementById('mainb').appendChild(studentl);
    studentl.id = 'studentl';
    var student = document.createElement('option');
    document.getElementById('studentl').appendChild(student);
    student.innerHTML = defaultStudent;
    $('select#studentl').attr('disabled', 'true');
  }
  var syntaxLabel = document.createElement('p');
  document.getElementById('mainb').appendChild(syntaxLabel);
  syntaxLabel.id = 'ctsynlabel';
  syntaxLabel.innerHTML = 'Syntax highlight: ';
  var syntaxCheckBox = document.createElement('input');
  document.getElementById('mainb').appendChild(syntaxCheckBox);
  syntaxCheckBox.id = 'ctsyncb';
  syntaxCheckBox.type = 'checkbox';
  var a;
  if (enableSH == 1) {
    a = true;
  } 
  else {
    a = false;
  }
  syntaxCheckBox.checked = a;
  //----Foot Bar
  var savebutton = document.createElement('button');
  var cancelbutton = document.createElement('button');
  document.getElementById('footb').appendChild(savebutton);
  document.getElementById('footb').appendChild(cancelbutton);
  savebutton.id = 'save';
  cancelbutton.id = 'cancel';
  savebutton.innerHTML = 'Save';
  cancelbutton.innerHTML = 'Cancel';
  $('button#save').css({
    'position': 'absolute',
    'left': '7px',
    'bottom': '4px'
  });
  $('button#cancel').css({
    'position': 'absolute',
    'right': '7px',
    'bottom': '4px'
  });
  //-----Hide Block by default
  $('div#ctsettings').hide();
  return;
}
function initSettingsButton() { //----SETTINGS BUTTON
  var setB = document.createElement('div');
  var setlabel = document.createElement('p');
  document.body.appendChild(setB);
  setB.appendChild(setlabel);
  setlabel.innerHTML = 'CTools<br>Settings';
  setB.id = 'ctsetb';
  $('div#ctsetb p').css({
    'cursor': 'pointer'
  });
  $('div#ctsetb').css({
    'position': 'fixed',
    'bottom': '0',
    'right': '0',
    'height': '50px',
    'width': '50px',
    'background': 'pink',
    'border': '2px solid black',
    'opacity': '0.5',
    'cursor': 'pointer'
  });
  return;
}
function saveSettings() {
  defaultCompiler = document.getElementById('ctcsel').options[document.getElementById('ctcsel').selectedIndex].value;
  GM_setValue('ctdc', defaultCompiler);
  defaultSubmType = document.getElementById('ctsbsel').options[document.getElementById('ctsbsel').selectedIndex].value;
  GM_setValue('ctdsb', defaultSubmType);
  if (document.getElementById('ctsyncb').checked) {
    enableSH = 1;
  } 
  else {
    enableSH = 0;
  }
  GM_setValue('ctsh', enableSH);
  if (document.getElementById('ctssel') !== null) {
    defaultStudent = document.getElementById('ctssel').options[document.getElementById('ctssel').selectedIndex].innerHTML;
    GM_setValue('ctdst', defaultStudent);
  }
  return;
}

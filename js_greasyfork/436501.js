// ==UserScript==
// @name        SHKOLO dark mode
// @namespace   Violentmonkey Scripts
// @match       https://app.shkolo.bg/*
// @description Adds a suite of color customization to the SHKOLO school site
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.52
// @author      RedTTG
// @run-at      document-body
// @license     MIT
// @description 12/3/2021, 10:31:05 AM
// @downloadURL https://update.greasyfork.org/scripts/436501/SHKOLO%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/436501/SHKOLO%20dark%20mode.meta.js
// ==/UserScript==

var version = "1.52"

var head  = document.getElementsByTagName('head')[0];
var link  = document.createElement('link');


// DEFAULT COLOR VALUES
var dc_dark = "#202040";
var dc_light = "#404080";
var dc_blind = "#6060A0";
var dc_blinding = "#A0A0FA";
var dc_red = "#F02F2F";
var dc_text = "#ADFEFF";
var dc_text_dark = "#003C3D";
var dc_text_hover = "#00FF44";
var dc_gold = "#B0B000";
var dc_enable_profile_pick = false;
var dc_image_url = "https://app.shkolo.bg/favicon.ico";
// INIT MOD
function initSettingElements() {
  initGMStorage();
}
document.addEventListener("DOMContentLoaded", function(){
  initMenu();
  customProfile();
  if (url.indexOf("customize") > -1){
    initCustomize();
  }
});

// INIT VALUES
function initGMStorage(reset = false) {
  if (!GM_getValue("colorVeryDark") || reset) {
    GM_setValue("colorVeryDark", dc_dark);
  }

  if (!GM_getValue("colorDark") || reset) {
    GM_setValue("colorDark", dc_light);
  }

  if (!GM_getValue("colorLight") || reset) {
    GM_setValue("colorLight", dc_blind);
  }

  if (!GM_getValue("colorVeryLight") || reset) {
    GM_setValue("colorVeryLight", dc_blinding);
  }

  if (!GM_getValue("colorRed") || reset) {
    GM_setValue("colorRed", dc_red);
  }

  if (!GM_getValue("colorText") || reset) {
    GM_setValue("colorText", dc_text);
  }

  if (!GM_getValue("colorTextDark") || reset) {
    GM_setValue("colorTextDark", dc_text_dark);
  }

  if (!GM_getValue("colorTextHover") || reset) {
    GM_setValue("colorTextHover", dc_text_hover);
  }

  if (!GM_getValue("colorGold") || reset) {
    GM_setValue("colorGold", dc_gold);
  }

  if (!GM_getValue("enableProfilePick") || reset) {
    GM_setValue("enableProfilePick", dc_enable_profile_pick);
  }


  if (!GM_getValue("imageURL") || reset) {
    GM_setValue("imageURL", dc_image_url);
  }
}
function initMenu() {
  x = document.getElementsByClassName('sub-menu');
  for(i = 0; i < x.length; i++){
    if (x[i].parentNode.children[0].children[1].textContent != "Администрация"){
      console.log(x[i].parentNode.children[0].children[1].textContent);
      continue;
    }
    var tag = document.createElement('h5');
    var text = document.createTextNode("Черен режим :)");
    tag.appendChild(text);
    tag.classList.add('menu-title');
    x[i].appendChild(tag);
    tag = document.createElement('li');
    var tag2 = document.createElement('a');
    tag2.href = '/customize';
    tag2.id = 'settingsDarkId';
    tag2.classList.add('nav-link');
    var tag3 = document.createElement('i');
    tag3.classList.add('far');
    tag3.classList.add('fa-solid');
    tag3.classList.add('fa-brush');
    text = document.createTextNode(' Опций');
    tag2.appendChild(tag3);
    tag2.appendChild(text);
    tag.appendChild(tag2);
    x[i].appendChild(tag);
  }
}
function initCustomize(reset = false){
  if (reset){
    x = document.getElementsByClassName('customizeMenu');
  } else {
    x = document.getElementsByClassName('page-404');
  }

  var parent;
  for(i = 0; i < x.length; i++){
    parent = x[i].parentNode;
    x[i].parentNode.removeChild(x[i]);
  }
  var tag = document.createElement('div');
  // ADD COLORS
  var index = 0
  tag.appendChild(generateColorPicker(c_dark,                'h3', 'Най-тъмен цвят....',    'c_dark',              index));index++;
  tag.appendChild(generateColorPicker(c_light,               'h3', 'Тъмен цвят....',        'c_light',             index));index++;
  tag.appendChild(generateColorPicker(c_blind,               'h3', 'Светъл цвят....',       'c_blind',             index));index++;
  tag.appendChild(generateColorPicker(c_blinding,            'h3', 'Най-светъл цвят....',   'c_blinding',          index));index++;
  tag.appendChild(generateColorPicker(c_red,                 'h3', 'Червен цвят....',       'c_red',               index));index++;
  tag.appendChild(generateColorPicker(c_gold,                'h3', 'Жълт цвят....',         'c_gold',              index));index++;
  tag.appendChild(generateColorPicker(c_text,                'h3', 'Текст (бял)....',       'c_text',              index));index++;
  tag.appendChild(generateColorPicker(c_text_dark,           'h3', 'Текст (тъмен)....',     'c_text_dark',         index));index++;
  tag.appendChild(generateColorPicker(c_text_hover,          'h3', 'Текст (подчертан)....', 'c_text_hover',        index));index++;
  tag.appendChild(generateBooleanPicker(enable_profile_pick, 'h3', 'Профилна снимка....',   'enable_profile_pick', index, function(x){enable_profile_pick = x.srcElement.checked;initCustomize(true);customProfile();}));index++;
  if (enable_profile_pick){
    tag.appendChild(generateTextPicker(image_url,            'h3', 'Линк за снимка....',    'image_url',           index, function(x){image_url = x.srcElement.value;customProfile();}));index++;
  }
  // ADD SUBMIT BUTTONS
  var button_1 = document.createElement('button'); var button_2 = document.createElement('button'); // Make buttons
  button_1.style.position = 'absolute'; button_2.style.position = 'absolute';
  var max = (20+index*46-(index/3.5));
  var topv = max-index*30;
  var lowv = max-index*15;
  button_1.style.top = topv+'px'; button_2.style.top = lowv+'px';
  button_1.style.left = '350px'; button_2.style.left = '350px';
  var text = document.createTextNode('Save Changes');
  button_1.appendChild(text);
  text = document.createTextNode('Reset');
  button_2.appendChild(text);
  button_1.classList.add('darkButton'); button_2.classList.add('darkButton'); // Add class to buttons
  tag.appendChild(button_1); tag.appendChild(button_2); // Apply buttons to customization menu
  // BUTTON ACTION
  button_1.onclick = function(){customizeSave();refreshPage();};
  button_2.onclick = function(){initGMStorage(true);refreshPage();};
  // FINISH OFF
  tag.classList.add('customizeMenu');
  parent.appendChild(tag);
}

function generateColorPicker(color = "#000000", tag = "h1", text = "Color Picker", id = null, index = 0){
  var input = document.createElement('input');
  var textTag = document.createElement(tag);
  var textNode = document.createTextNode(text);
  textTag.appendChild(textNode);
  input.type = 'color';
  input.value = color;
  input.style.position = 'absolute';
  var y = 40+46.451*index
  input.style.top = y+'px';
  input.style.left = '250px';
  if (id != null){
    input.id = id;
  }
  textTag.appendChild(input);
  textTag.classList.add('colorPicker');
  return textTag
}
function generateBooleanPicker(boolean = false, tag = "h1", text = "Color Picker", id = null, index = 0, onclick = function(){}){
  var input = document.createElement('input');
  var textTag = document.createElement(tag);
  var checkboxTag = document.createElement('label');
  var sliderTag = document.createElement('div');
  var textNode = document.createTextNode(text);
  textTag.appendChild(textNode);
  input.type = 'checkbox';
  input.checked = boolean;
  input.onclick = onclick;
  checkboxTag.style.position = 'absolute';
  var y = 40+46.451*index;
  checkboxTag.style.top = y+'px';
  checkboxTag.style.left = '272px';
  if (id != null){
    input.id = id;
  }
  checkboxTag.appendChild(input);
  checkboxTag.appendChild(sliderTag);
  textTag.appendChild(checkboxTag);
  checkboxTag.classList.add('booleanPickerCheckbox');
  checkboxTag.setAttribute('for', id);
  textTag.classList.add('booleanPicker');
  sliderTag.classList.add('booleanPickerSlider');
  sliderTag.classList.add('booleanPickerSliderRound');
  return textTag
}
function generateTextPicker(value = "holdup", tag = "h1", text = "Color Picker", id = null, index = 0, onchange = function(){}){
  var input = document.createElement('input');
  var textTag = document.createElement(tag);
  var textNode = document.createTextNode(text);
  textTag.appendChild(textNode);
  input.type = 'text';
  input.value = value;
  input.onchange = onchange;
  input.style.position = 'absolute';
  var y = 40+46.451*index
  input.style.top = y+'px';
  input.style.left = '253px';
  if (id != null){
    input.id = id;
  }
  textTag.appendChild(input);
  textTag.classList.add('textPicker');
  return textTag
}

function customizeSave(){
  dc_dark = document.getElementById('c_dark').value;
  dc_light = document.getElementById('c_light').value;
  dc_blind = document.getElementById('c_blind').value;
  dc_blinding = document.getElementById('c_blinding').value;
  dc_red = document.getElementById('c_red').value;
  dc_gold = document.getElementById('c_gold').value;
  dc_text = document.getElementById('c_text').value;
  dc_text_dark = document.getElementById('c_text_dark').value;
  dc_text_hover = document.getElementById('c_text_hover').value;
  dc_enable_profile_pick = document.getElementById('enable_profile_pick').checked;
  if (enable_profile_pick){
  dc_image_url = document.getElementById('image_url').value;} else {
  dc_image_url = image_url;
  }
  initGMStorage(true);
}
function refreshPage(){
  window.location.reload();
}
// LOAD VALUES
initSettingElements()
var c_dark = GM_getValue("colorVeryDark");
var c_light = GM_getValue("colorDark");
var c_blind = GM_getValue("colorLight");
var c_blinding = GM_getValue("colorVeryLight");
var c_red = GM_getValue("colorRed");
var c_text = GM_getValue("colorText");
var c_text_dark = GM_getValue("colorTextDark");
var c_text_hover = GM_getValue("colorTextHover");
var c_gold = GM_getValue("colorGold");
var enable_profile_pick = GM_getValue("enableProfilePick");
var image_url = GM_getValue("imageURL");

// LOAD CSS
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = 'https://www.redttg.com/shkolo_dark/'+
  argument(c_dark)+       //01
  argument(c_light)+      //02
  argument(c_blind)+      //03
  argument(c_blinding)+   //04
  argument(c_red)+        //05
  argument(c_text)+       //06
  argument(c_text_dark)+  //07
  argument(c_text_hover)+ //08
  argument(c_gold)+       //09
  'dashboard.css';
function argument(color = '#000000'){
  return color.replace('#','')+'/'
}
link.media = 'all';
head.appendChild(link);
//

var url = window.location.href;

// CHECK AND HACK PAGE

if(url.indexOf("dashboard") > -1){
  var x = document.getElementsByClassName("page-header");
  for(i = 0; i < x.length; i++){
    x[i].style.backgroundColor = c_dark;
  }

  x = document.getElementsByClassName("page-footer");
  for(i = 0; i < x.length; i++){
    x[i].style.backgroundColor = c_dark;
  }

  x = document.getElementsByClassName("col-md-12");
  for(i = 0; i < x.length; i++){
    x[i].style.backgroundColor = c_dark;
  }
  x = document.getElementsByClassName("col-sm-6");
  for(i = 0; i < x.length; i++){
    x[i].style.backgroundColor = c_dark;
  }
}
else if(url.indexOf("diary") > -1){
  var x = document.getElementsByClassName("page-header");
  for(i = 0; i < x.length; i++){
    x[i].style.backgroundColor = c_dark;
  }

  x = document.getElementsByClassName("page-footer");
  for(i = 0; i < x.length; i++){
    x[i].style.backgroundColor = c_dark;
  }

  x = document.getElementsByClassName("portlet light  gradesBody");
  for(i = 0; i < x.length; i++){
    x[i].style.backgroundColor = c_light;
    x[i].style.color = c_blind;
  }
}
else if (url.indexOf("test/result") > -1){

}
else if (url.indexOf("app.shkolo.bg") > -1){
  var x = document.getElementsByClassName("tab-content");
  for(i = 0; i < x.length; i++){
    x[i].style.backgroundColor = c_blind;
  }
  x = document.getElementsByClassName("auth-tabs");
  for(i = 0; i < x.length; i++){
    x[i].style.backgroundColor = c_light;
  }
  x = document.getElementsByClassName("or-login-text");
  for(i = 0; i < x.length; i++){
    if (x[i].firstElementChild.nodeName == "H4")
    {
      x[i].firstElementChild.firstElementChild.style.backgroundColor = c_blind;
    }
  }
  x = document.getElementsByClassName("auth-tabs");
  for(i = 0; i < x.length; i++){
    for(kid = 0; kid < x[i].children.length; kid++)
    {
      if (x[i].children[kid].nodeName == "LI")
      {
      x[i].children[kid].firstElementChild.style.backgroundColor = c_light;
      }
    }
  }
  x = document.getElementsByClassName("phone-label");
  for(i = 0; i < x.length; i++){
    x[i].style.setProperty("background-color", c_light, "important");
  }
  //btn btn-xs btn-custom-primary
  x = document.getElementsByClassName("btn-custom-primary");
  for(i = 0; i < x.length; i++){
    x[i].style.setProperty("background-color", c_light, "important");
  }
}
else {
  console.log("Couldn't find dark mode mod for this page of shkolo, anything besides the background and side menus might be broken.");
  console.log("Or it could be it doesn't need javascript, and css is enough, in which case enjoy!");
}


function customProfile() {
  if (enable_profile_pick == '1') {
    var x = document.getElementsByClassName("img-circle avatar small");
    if (!x[0]) { return; }

    original = x[0].src;
    images = document.getElementsByTagName("img");
    for (const img of images) {
      if (img.src === original) { img.src = image_url; }
    }

  }
}

//

console.log("Shkolo dark mode, checking for updates...")

var urls = "https://greasyfork.org/en/scripts/436501-shkolo-dark-mode";

function popup(url) {
    return window.open(url, '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=1, height=1, top=0, left=0, visible=none');
}

fetch(urls)
  .then(function(response) {
    return response.text();
  }).then(function(data) {
    if (data.includes("<dd class=\"script-show-version\"><span>"+version+"</span></dd>")){
      console.log("no update found!");
    }
    else {
      console.log("update avaliable!");
      w = popup("https://greasyfork.org/scripts/436501-shkolo-dark-mode/code/SHKOLO dark mode.user.js")
      setTimeout(function () {w.close();console.log('closed?');}, 1000);
      }
});


console.log("Shkolo Dark Mode finished running for this page.");
console.log("Thanks for download!");
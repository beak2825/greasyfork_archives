// ==UserScript==
// @name        GN_PersistentStorage
// @namespace   Gradient
// @description Операции с БД
// @include     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/.+/
// @exclude     /^https{0,1}:\/\/((www|mirror)\.heroeswm\.ru|my\.lordswm\.com)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|chat2020|battlechat|campaign)\.php.*/
// @version     1.0.7
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/14046/GN_PersistentStorage.user.js
// @updateURL https://update.greasyfork.org/scripts/14046/GN_PersistentStorage.meta.js
// ==/UserScript==

"use strict";

//----------------------------------------------------------------------------//

var script_name = 'GN_PersistentStorage'; // Enter your script name here

//----------------------------------------------------------------------------//

(function(){ try{ // wrapper start

//----------------------------------------------------------------------------//

//var operations = [ 'save', 'load', 'remove' ];
//var states     = [ 'complete', 'incomplete' ];

var div = document.createElement('div');
div.id = 'GN_GM_Handler';
div.setAttribute('desc',      '');
div.setAttribute('value',     '');
div.setAttribute('operation', 'unknown');
div.setAttribute('state',     'incomplete');
div.setAttribute('is_null',   'false');

div.addEventListener('click', function(e){
  e.preventDefault();

  div.setAttribute('state', 'incomplete');

  var operation = div.getAttribute('operation');

  if(operation == 'save'){
    save_value(div.getAttribute('desc'), div.getAttribute('value'));
    div.setAttribute('value', '');
  }
  else if(operation == 'load'){
    var value = load_value(div.getAttribute('desc'));

    div.setAttribute('is_null', !value ? 'true' : 'false');
    div.setAttribute('value', value ? value : '');
  }
  else if(operation == 'remove'){
    remove_value(div.getAttribute('desc'));
    div.setAttribute('value', '');
  }

  div.setAttribute('desc',      '');
  div.setAttribute('operation', 'unknown');
  div.setAttribute('state',     'complete');
});

document.body.appendChild(div);

//----------------------------------------------------------------------------//

function save_value(desc, value){
  if(check_gm_function()){
    GM_setValue(desc, value);
    return;
  }

  check_local_storage();

  try{
    localStorage.setItem(desc, value);
  }
  catch(e){
    show_error('Ошибка при сохранении значения');
  }
}

//----------------------------------------------------------------------------//

function load_value(value){
  if(check_gm_function())
    return GM_getValue(value, null);

  check_local_storage();

  return localStorage.getItem(value);
}

//----------------------------------------------------------------------------//

function remove_value(value){
  if(check_gm_function()){
    GM_deleteValue(value);
    return;
  }

  check_local_storage();

  localStorage.removeItem(value);
}

//----------------------------------------------------------------------------//

function check_local_storage(){
  if('localStorage' in window && window['localStorage'] !== null)
    return;

  show_error('Не найдено локальное хранилище');
}

//----------------------------------------------------------------------------//

function check_gm_function(){
  return typeof GM_setValue == 'function';
}

//----------------------------------------------------------------------------//

function show_error(error_string){
  throw new Error(error_string);
}

//----------------------------------------------------------------------------//

} catch(e){
  alert('Ошибка в скрипте ' + script_name + ', обратитесь к разработчику:\n' + e);
  throw e;
}}()); // wrapper end

//----------------------------------------------------------------------------//
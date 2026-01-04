// ==UserScript==
// @name        HWM_hunt_notes
// @namespace   Helther
// @author      helther
// @description заметки для существ на экране карты
// @include     /^https{0,1}:\/\/(www\.heroeswm\.ru|178\.248\.235\.15)\/map\.php.*/
// @version     1.0.6
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476902/HWM_hunt_notes.user.js
// @updateURL https://update.greasyfork.org/scripts/476902/HWM_hunt_notes.meta.js
// ==/UserScript==

var script_name = 'HWM_hunt_notes';
var hunt_name_prefix = 'HWM_note_';

function get_cookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function set_cookie(name, value, options = {}) {

  options = {
    path: '/',
    ...options
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

function delete_cookie(name) {
  set_cookie(name, "", {
    'max-age': -1
  })
}

function get_hwm_cookies() {
  let matches = document.cookie.match(new RegExp(
    "("+hunt_name_prefix + "[^= ]*) *(?=\=)", "g"));
  return matches ? matches : undefined;
}

function clear_cookies() {
  let names = get_hwm_cookies()
  for (let name of names) {
      delete_cookie(name)
  }
}

function get_parent_nodes() {
  let buttons = document.querySelectorAll('div.map_buttons_container');
  let buttons_list = Array.from(buttons)
  const elements_map = new Map()
  buttons_list.forEach(node => {
    let parent = node ? node.parentNode : null
    if (parent) {
      let hunt_ref = parent.querySelector("a[href*='army_info.php?name']")
      if (hunt_ref) {
        let name_key = "?name="
        let pos_start = hunt_ref.href.indexOf(name_key)
        if (pos_start !== -1)
          elements_map.set(hunt_ref.href.substring(pos_start + name_key.length), node)
        else {
          throw "Failed to find hunt name"
        }
      }
      else {
        throw "Failed to find href"
      }
    }
    else {
      throw "Failed to find buttons parent"
    }
  })
  return elements_map
}

function create_note(hunt, next_sibling) {
  let note = document.createElement('textarea');
  note.type	       = 'text';
  note.className   = 'wblight';
  note.width       = next_sibling.width;
  note.align       = 'center';
  note.maxLength   = 3500;
  note.placeholder = 'Вводите...';
  note.rows 	     = 4;
  let note_val = get_cookie(hunt_name_prefix + hunt)
  if (note_val)
    note.value = note_val

  let save_button = document.createElement('input');
  save_button.type	    = 'button';
    save_button.value 	= 'Сохранить заметку';
    save_button.id     	= script_name + 'Save';
  save_button.width     = next_sibling.width;
  save_button.align     = 'center';
  save_button.addEventListener('click', function(e){
    e.preventDefault();
    if (note.length !== 0)
      set_cookie(hunt_name_prefix + hunt, note.value, {'max-age': 10000})
  });

  next_sibling.parentNode.insertBefore(note, next_sibling);
  next_sibling.parentNode.insertBefore(save_button, next_sibling);
}

function create_clear_all_btn() {
  let buttons = document.querySelector('div.map_buttons_container');
  let parent = buttons ? buttons.parentNode.parentNode.parentNode : null
  if (parent) {
    let button = document.createElement('input');
    button.type	     = 'button';
    button.value 	 = 'Очистить все заметки (Осторожно!)';
    button.id        = script_name + 'ClearAll';
    button.width     = parent.width;
    button.align     = 'center';
    button.addEventListener('click', function(e){
      e.preventDefault();
      if (window.confirm("Вы уверены, что хотите всё потереть к хуям?")) {
        clear_cookies();
      }
    });
    parent.appendChild(button)
  }
}

// =============================== wrapper start ============================//
(function(){ try {

  'use strict';

  let hunt_names_divs_map = get_parent_nodes()
  for (const [key, value] of hunt_names_divs_map) {
    // console.log(`${key} = ${value}`);
    create_note(key, value)
  }
  create_clear_all_btn()

} catch(e){
    alert('Ошибка в скрипте ' + script_name + ', не смейте обращаться к разработчику:\n' + e);
    throw e;
  }}()); // wrapper end

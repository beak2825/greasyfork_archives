// ==UserScript==
// @name        Soybooru Ext
// @namespace   https://github.com/thoughever
// @match       https://booru.soy/*
// @match       http://booru.soy/*
// @match       https://www.booru.soy/*
// @match       http://www.booru.soy/*
// @grant       GM_setClipboard
// @version     0.1.2
// @author      thoughever
// @license     MIT
// @description Add autocomplete to the Soybooru upload form
// @downloadURL https://update.greasyfork.org/scripts/437146/Soybooru%20Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/437146/Soybooru%20Ext.meta.js
// ==/UserScript==

(function () {

  "use strict";

  /* Global settings */
  const g_autocomplete_query_delay_ms = 300;

  /* Utils */
  function add_page_styles(styles) {
    let tag_styles = document.createElement('style');
    tag_styles.type = 'text/css';
    tag_styles.innerHTML = styles;
    let head = document.getElementsByTagName('head')[0];
    head.appendChild(tag_styles);
  }

  function insert_after(reference_elem, new_elem) {
      reference_elem.parentNode.insertBefore(new_elem, reference_elem.nextSibling);
  }

  function reverse_str(str){
      return [...str].reverse().join("");
  }

  function insert_mid_str(str, i,  j, insert_str) {
    return `${str.slice(0, i)}${insert_str}${str.slice(j, str.length)}`;
  }

  function legacy_copy_to_clipboard(text) {
    let textarea = document.createElement("textarea");
    textarea.classList.add("shimmieext-legacy-clipboard-textarea");
    textarea.value = text;

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
    } catch (e) {}
    document.body.removeChild(textarea);
  }

  function copy_to_clipboard(text) {
    try {
      GM_setClipboard(text);
    } catch(e) {
      if(navigator.clipboard) {
        navigator.clipboard.writeText(text);
      } else {
        legacy_copy_to_clipboard(text);
      }
    }
  }

  const KEYCODE_TAB = 9;
  const KEYCODE_ENTER = 13;
  const KEYCODE_ARROW_LEFT = 37;
  const KEYCODE_ARROW_UP = 38;
  const KEYCODE_ARROW_RIGHT = 39;
  const KEYCODE_ARROW_DOWN = 40;

  /* Autocomplete elements */
  class AutocompleteDropdown {
    constructor() {
      this.node = document.createElement("ul");
      this.node.classList.add("shimmieext-autocomplete");
      this.node.tabIndex = "-1";
      let _this = this;
      this.node.addEventListener("keydown", function(e) {
        let key_code = e.keyCode || e.which;
        switch(key_code) {
          case KEYCODE_ARROW_UP:
            _this.focus_prev();
            e.preventDefault();
            break;
          case KEYCODE_ARROW_DOWN:
            _this.focus_next();
            e.preventDefault();
            break;
          case KEYCODE_ARROW_RIGHT:
          case KEYCODE_TAB:
            _this.select_focused();
            e.preventDefault();
        }
      }, false);
      this.items = [];
    }

    focus_prev() {
      let prev_li = document.activeElement.previousSibling;
      if(prev_li) {
        prev_li.focus();
      }
    }

    focus_next() {
      let next_li = document.activeElement.nextSibling;
      if(next_li) {
        next_li.focus();
      }
    }

    set_focus(i) {
      let li = this.items[i];
      if(li) {
        li.focus();
      }
    }

    select_focused() {
      let focused_elem = document.activeElement;
      if(this.items.includes(focused_elem)) {
        focused_elem.click();
      }
    }

    select(i) {
      let li = this.items[i];
      if(li) {
        li.click();
      }
    }

    clear() {
      this.node.replaceChildren();
      this.items = [];
    }

    show() {
      this.node.classList.remove("shimmieext-hidden");
    }

    hide() {
      this.node.classList.add("shimmieext-hidden");
    }

    _add_li(li) {
      this.node.appendChild(li);
      this.items.push(li);
    }

    add_item(tag, count, on_select) {
      let new_li = document.createElement("li");
      new_li.classList.add("shimmieext-autocomplete");
      new_li.innerHTML = `${tag} (${count})`;
      new_li.tabIndex = "0";

      let _this = this;
      let hide_select = function() {
        _this.hide();
        on_select(tag);
      };
      new_li.addEventListener("click", function() {
        hide_select();
      }, false);
      new_li.addEventListener("keydown", function(e) {
        let key_code = e.keyCode || e.which;
        if(key_code === KEYCODE_ENTER) {
          hide_select();
          e.preventDefault();
        }
      }, false);

      this._add_li(new_li);
    }
  }

  class AutocompleteField {
    constructor(elem_input, delay_query, shimmie_api) {
      this.root = elem_input;
      this.delay = delay_query;
      this.api = shimmie_api;
      this.timer = undefined;

      const _this = this;
      this.root.addEventListener("input", function(e) {
        let text = _this.root.value;
        if(text) {
          // Reset delay if another key pressed before finished
          _this.clear_timer();
          _this.timer = setTimeout(function() {
            let cursor_i = e.target.selectionStart;
            // If at end of input or space in front
            let cursor_at_end = text[cursor_i] === undefined;
            if(cursor_at_end || text[cursor_i] === " ") {
              // Get word behind cursor
              let i = cursor_i - 1;
              let c = text[i];
              let word_behind = "";
              while(c !== undefined && c !== " ") {
                word_behind += c;
                i--;
                c = text[i];
              }
              let word_start_i = i + 1;
              if(word_behind) {
                word_behind = reverse_str(word_behind);
                _this.api_get_autocomplete(word_behind, function(res_text) {
                  _this.populate_dropdown(JSON.parse(res_text), word_start_i, cursor_i, cursor_at_end);
                });
              }
            }
          }, _this.delay);
        }
      }, false);

      this.root.addEventListener("keydown", function(e) {
        let key_code = e.keyCode || e.which;
        switch(key_code) {
          case KEYCODE_TAB:
          case KEYCODE_ARROW_DOWN:
          case KEYCODE_ENTER:
            _this.dropdown.set_focus(0);
            _this.clear_timer();
            e.preventDefault();
            break;
        }
      }, false);

      this.dropdown = new AutocompleteDropdown();
      this.dropdown.hide();
      insert_after(this.root, this.dropdown.node);
    }

    clear_timer() {
      if(this.timer) {
        clearTimeout(this.timer);
      }
    }

    populate_dropdown(res_json, insert_start_i, insert_end_i, add_space) {
      this.dropdown.clear();
      let _this = this;
      for (const [k, v] of Object.entries(res_json)) {
        this.dropdown.add_item(k, v, function(selected_tag) {
          _this.root.value = insert_mid_str(_this.root.value, insert_start_i, insert_end_i, selected_tag);
          if(add_space) {
            _this.root.value += " ";
          }
          _this.root.focus();
        });
      }
      this.dropdown.show();
    }

    api_get_autocomplete(query_text, on_load) {
      const xhttp = new XMLHttpRequest();
      const _this = this;
      xhttp.onload = function() {
        on_load(this.responseText);
      };
      xhttp.open("GET", `${_this.api}/api/internal/autocomplete?s=${query_text}`, true);
      xhttp.send();
    }
  }

  /* Upload form autocomplete */
  function page_upload(shimmie_api) {
    let upload_form = document.getElementById("file_upload");
    // Prevent form submit on enter press
    upload_form.addEventListener("keydown", function(e) {
      let key_code = e.keyCode || e.which;
      if(key_code === KEYCODE_ENTER){
        e.preventDefault();
      }
    }, false);

    // Add enter press submit back to post button
    let upload_button = document.getElementById("uploadbutton");
    upload_button.addEventListener("keydown", function(e) {
      let key_code = e.keyCode || e.which;
      if(key_code === KEYCODE_ENTER){
        upload_form.submit();
      }
    }, false);

    let autocomplete_fields = [];
    let autocomplete_inputs = upload_form.getElementsByClassName('autocomplete_tags');
    for (const input_node of autocomplete_inputs) {
      autocomplete_fields.push(new AutocompleteField(input_node, g_autocomplete_query_delay_ms, shimmie_api));
    }

    // Close dropdown on click anywhere else
    document.body.addEventListener("click", function() {
      for (const field of autocomplete_fields) {
        field.dropdown.hide();
      }
    }, false);
  }

  /* Single page copy tags and autocomplete tag editor */
  function page_single_image(shimmie_api) {
    let tag_editor_input = document.getElementById("tag_editor");
    let tag_editor_autocomplete_field = new AutocompleteField(tag_editor_input, g_autocomplete_query_delay_ms, shimmie_api);

    let tags = tag_editor_input.value;
    let info_table = document.querySelector(".image_info tbody");

    let new_tr = document.createElement("tr");
    let new_td = document.createElement("td");
    let new_button = document.createElement("input");

    new_td.colSpan = "4";

    new_button.value = "Copy Tags";
    new_button.type = "button";
    new_button.classList.add("shimmieext-button-copy-tags");
    new_button.addEventListener("click", function() {
      copy_to_clipboard(tags);
    }, false);

    new_td.appendChild(new_button);
    new_tr.appendChild(new_td);
    info_table.appendChild(new_tr);
  }

  function main() {
    let url = window.location.href.split('/');
    let shimmie_api = `${url[0]}//${url[2]}`;

    let page;
    if(url[3] === "post" && url[4] === "view" || url[3] === "random_image" && url[4] === "view") {
      page = page_single_image;
    } else if(url[3] === "upload") {
      page = page_upload;
    }

    if(page) {
      add_page_styles("ul.shimmieext-autocomplete {list-style: none; padding: 2px; margin: 0; display: block; outline: none; color: #444444; border: 1px solid #dddddd; z-index: 100;\
font-size: 1.1em; font-family: Helvetica,Arial,sans-serif; text-align: left; background-color: #ffffff; position: absolute; cursor: pointer;}\
li.shimmieext-autocomplete {list-style: none;}\
li.shimmieext-autocomplete:hover, li.shimmieext-autocomplete:focus {font-weight: bold; background-color: #0a78eb; color: #ffffff; }\
.shimmieext-hidden {display: none !important;}\
.shimmieext-button-copy-tags {cursor: pointer;} .shimmieext-button-copy-tags:active  {background-color:#E9E9ED;}\
.shimmieext-legacy-clipboard-textarea {top: 0; left: 0; position: fixed;}");

      page(shimmie_api);
    }
  }

  main();

})();

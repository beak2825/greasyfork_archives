// ==UserScript==
// @name        rms-functions
// @namespace   rms-functions 1
// @match       https://google.com
// @grant       none
// @version     1.14
// @author      -
// @license     MIT
// @description helper functions for private-use script
// @downloadURL https://update.greasyfork.org/scripts/447097/rms-functions.user.js
// @updateURL https://update.greasyfork.org/scripts/447097/rms-functions.meta.js
// ==/UserScript==

function input_text(question_text, text_to_write) {
  let question_node = get_corresponding_question_node(question_text);
  if (question_node == null) {
    return;
  }
  
  let text_node = get_corresponding_text_node(question_node);
  if (text_node == null) {
    console.log(`[input_text] Input/textarea node not found"`);
    return;
  }

  text_node.value = text_to_write;

  let event = new Event('change');
  text_node.dispatchEvent(event);
  event = new Event('blur');
  text_node.dispatchEvent(event);
}

function get_corresponding_text_node(question_node) {
  return question_node.querySelector('[id$="WebQuestion"]').querySelector('textarea, input');
}

function click_radio(question_text, option_text) {
  let question_node = get_corresponding_question_node(question_text);
  if (question_node == null) {
    return;
  }
  
  for (let option_node of question_node.querySelector('[id$="WebQuestion"]').querySelectorAll('label')) {
    if ( option_node.innerText.trim().startsWith(option_text) ) {
      option_node.parentNode.children[0].click();
      return;
    }
  }
  console.log(`[click_radio] Option text not found: "${option_text}"`);
}

function get_corresponding_question_node(question_text) {
  let QUESTION_NODES = document.querySelector("#MasterContentCell > table.BodyText > tbody").children;
  for (let node of QUESTION_NODES) {
    if ( get_question_text(node).toLowerCase().includes(question_text.toLowerCase()) ) {
      return node;
    }
  }
  console.log(`[get_corresponding_question_node] Question text not found: "${question_text}"`);
  return null;
}

function get_next_sibling(mynode) {
  let nodes = mynode.parentNode.querySelectorAll('tr');
  
  for (let i = 0; i < nodes.length; ++i) {
    if (nodes[i] == mynode) {
      return nodes[i + 1];
    }
  }
  
  return null;
}

function get_root_node(question_text) {
  let nodes = document.querySelectorAll("label[for^='ctl00_']");
  
  for (let node of nodes) {
    let main_node = node.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
    if (main_node.nodeName == 'TD') {
      let question_text_node = main_node.querySelector('span');
      if ( question_text_node.innerText.startsWith(question_text) ) {
        return main_node.parentNode;
      }
    }
  }
  return null;
}

function fill_timekeeping() {
  let time_re = /(?:([0-9]+) *hr *)?([0-9]+) *min/gmi;
  let title = get_project_title();
  let match = time_re.exec(title);
  
  if (match == null) {
    return;
  }
  
  if (match[0] == null) {
    match[0] = '0';
  }
  
  let hours_node = document.querySelector("#ctl00_ContentPlaceHolder_ReportEditor_gridTimeEntries_ctl02_ctl01");
  let options = hours_node.querySelectorAll('option');
  for (let option of options) {
    if ( option.getAttribute('value').toString() == match[1] ) {
      option.selected = true;
      break;
    }
  }
  
  let mins_node = document.querySelector("#ctl00_ContentPlaceHolder_ReportEditor_gridTimeEntries_ctl02_ctl02");
  options = mins_node.querySelectorAll('option');
  for (let option of options) {
    if ( option.getAttribute('value').toString() == match[2] ) {
      option.selected = true;
      break;
    }
  }
  
  let event = new Event('change');
  hours_node.dispatchEvent(event);
}

function get_question_text(question_node) {
  return question_node.querySelector('[id$="QuestionText"]').innerText;
}

function get_project_title() {
  return document.querySelector("[id$='_ProjectNameLabel']").innerText;
}

function get_store_label() {
  return document.querySelector("[id$='_StoreNameLabel']").innerText;
}

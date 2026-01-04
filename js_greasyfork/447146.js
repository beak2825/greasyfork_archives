// ==UserScript==
// @name        fs-functions
// @namespace   fs-functions 1
// @match       https://google.com
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description helper functions for private-use script
// @downloadURL https://update.greasyfork.org/scripts/447146/fs-functions.user.js
// @updateURL https://update.greasyfork.org/scripts/447146/fs-functions.meta.js
// ==/UserScript==
 
var NEXT_TIME_TO_WAIT = 250;
var TIME_TO_ADD = 400;

var MANAGER_NAMES = {
    "NY, EAST ELMHURST | 7914 21ST AVE | TRADE FAIR SUPERMARKET-0": ["Mike", ","],
    "NY, CORONA | 10214 37TH AVE | KEY FOOD": ["Wilson", ","],
    "NY, CORONA | 10209 NORTHERN BLVD | PIONEER SUPERMARKET": ["Mike", ","],
    "NY, EAST ELMHURST | 9910 ASTORIA BLVD | TRADE FAIR SUPERMARKET": ["Rom\xe1n", ","],
    "NY, JACKSON HEIGHTS | 8602 NORTHERN BLVD | KEY FOOD": ["Jes\xfas", "Mart\xednez"],
    "NY, EAST ELMHURST | 7555 31ST AVE | FOOD UNIVERSE": ["Juan", ","],
    "NY, JACKSON HEIGHTS | 3420 JUNCTION BLVD | FOOD BAZAAR": ["Ahsanul", ","],
    "NY, CORONA | 3560 JUNCTION BLVD | FOOD BAZAAR": ["Bianca", ","],
    "NY, JACKSON HEIGHTS | 9030 ROOSEVELT AVE | BRAVO SUPERMARKET": ["David", ","],
    "NY, JACKSON HEIGHTS | 3754 90TH ST | KEY FOOD": ["Tony", ","],
    "NY, JACKSON HEIGHTS | 8902 37TH AVE | TRADE FAIR SUPERMARKET": ["Alejandro", ","],
    "NY, JACKSON HEIGHTS | 8508 37TH AVE | C TOWN SUPERMARKET": ["Isiah", ","],
    "NY, JACKSON HEIGHTS | 8515 ROOSEVELT AVE | MI TIERRA": ["Danny", ","],
    "NY, ELMHURST | 8210 BAXTER AVE | FOOD UNIVERSE": ["Miguel", ","],
    "NY, JACKSON HEIGHTS | 7610 37TH AVE | FOODTOWN": ["Jazmin", ","],
    "NY, JACKSON HEIGHTS | 7507 37TH AVE | FOOD DYNASTY": ["Joe", ","],
    "NY, WOODSIDE | 6209 ROOSEVELT AVE | FRESH N SAVE MARKETPLACE": ["Russel", ","],
    "NY, WOODSIDE | 5915 ROOSEVELT AVE | C TOWN SUPERMARKET": ["Kodie", ","],
    "NY, WOODSIDE | 5018 SKILLMAN AVE | FRESH N SAVE MARKETPLACE": ["Ronald", ","],
    "NY, SUNNYSIDE | 4407 43RD AVE | FOOD UNIVERSE": ["Michael", ","],
    "NY, WOODSIDE | 6110 QUEENS BLVD | DANS SUPREME SUPERMARKETS": ["Jason", ","],
    "NY, WOODSIDE | 4911 30TH AVE | TRADE FAIR SUPERMARKET": ["Jonathan", ","],
    "NY, CORONA | 10879 ROOSEVELT AVE | C TOWN SUPERMARKET": ["Rafael", ","],
    "TEST": ["test_firstname", "test_lastname"]
};

var FILL_INFO = {
  'Did you verify the store informantion ABOVE is corrrect?*': 'I Affirm', 
  'Did you Verify the Store Information ABOVE is Correct?': 'I Affirm', 
  'Where is the store getting their Marcal brand product from? (if applicable)*': 'n/a', 
  'Did you rotate COTTONELLE ULTRACLEAN MR BATH TISSUE 4 PK OLD UPC (3600054154) to the front shelf?*': 'Yes', 
  'Did you rotate COTTONELLE ULTRACLEAN MR BATH TISSUE 9 PK OLD UPC (036000478259) to the front shelf?*': 'Yes', 
  'Did you rotate COTTONELLE ULTRACMFRT MR BATH TISSUE 9 PK OLD UPC (036000485943) to the front shelf?*': 'Yes', 
  'Did you rotate OLD COUNT of COTTONELLE ULTRA CLEANCARE and ULTRA COMFORTCARE (various counts) to the front shelf?*': 'Yes', 
  'Did you rotate OLD COUNT of KLEENEX ANTI-VIRAL, SOOTHING LOTION, ULTRA SOFT, SOOTHING LOTION, TRUSTED CARE, ULTRA SOFT tissues (various counts) to the front shelf?*': 'Yes',
  'Did you rotate OLD COUNT of HUGGIES SNUG & DRY, LITTLE SNUGGLERS, LITTLE MOVERS (various counts) to the front shelf?*': 'Yes', 
  'Did you rotate HUGGIES BIG PACK DISCONTINUED SNUG & DRY, LITTLE SNUGGLERS, LITTLE MOVERS (various counts) to the front shelf? - Copy*': 'Yes', 
  'Was the Kingsford Rolling Rack on the floor upon arrival?*': 'No',
  'Were you able to locate, build, and stock the Kingsford Rolling Rack?*': 'No', 
  'Please provide a reason for not building and stocking the Kingsford Rolling Rack.*': 'No, unable to locate the Kingsford Rolling Rack', 
  'Decision Maker Name*': ['test_name', ',']
};
 
function fill_from_presets(node) {
  let label_node = node.querySelector('[class^="fsLabel"]');
  if (label_node == null) {
    return;
  }
  
  let answer = null;
//   console.log(` > Checking fsLabel (question text): ${label_node.innerText}`);
  if (label_node.innerText in FILL_INFO) {
    answer = FILL_INFO[label_node.innerText];
  }
  else {
    return;
  }
  
  let next_node = label_node.nextElementSibling;
  if (next_node == null) {
    return;
  }
  
  if (next_node.nodeName == 'INPUT' ) {
    next_node.value = FILL_INFO[label_node.innerText];
  }
  // check if next node is fieldset, which means it is a set of radio buttons
  else if ( next_node.hasAttribute('class') && next_node.getAttribute('class') == 'fieldset-content') {
    for ( let radio_node of next_node.querySelectorAll('input[type="radio"]') ) {
      if (radio_node.value == answer) {
        radio_node.click();
      }
    }
  }
  // check if next node is fsSubFieldGroup, which means it has multiple text input nodes
  else if ( next_node.hasAttribute('class') && next_node.getAttribute('class') == 'fsSubFieldGroup') {
    let input_nodes = next_node.querySelectorAll('input[type="text"]');
    for (let i=0; i<answer.length; ++i) {
      input_nodes[i].value = answer[i];
    }
  }
}
 
function get_product_nodes() {
  let product_nodes = [];
  let nodes = document.querySelectorAll("div[class='fsSection fs1Col']");
  
  // filter for product questions
  for (let node of nodes) {
    if (node.querySelector("div") == null) {
      continue;
    }
    
    // let title = next_div.children[0].innerText;
    // console.log(title);
    if ( is_product_question(node) ) {
      product_nodes.push(node);
    }
  }
  
  return product_nodes;
}
 
function input_text(question_text, text_to_write) {
  let input_nodes = document.querySelectorAll("input[type='number'], [type='text']");
  
  for (let input_node of input_nodes) {
    let parent_node = input_node.parentNode;
    let question_text_node = parent_node.querySelector("label[id^='label']");
    if (question_text_node == null) {
      continue;
    }
    
    if ( question_text_node.innerText.startsWith(question_text) ) {
      input_node.value = text_to_write;
    }
  }
}
 
function check_radio(starting_node, header_title, checkbox_text) {
  let nodes = null;
  if (starting_node == document) {
    nodes = document.querySelectorAll('div[id^="fsRow"][class="fsRow fsFieldRow fsLastRow"]');
  }
  else {
    nodes = starting_node.querySelectorAll('div[id^="fsRow"][class="fsRow fsFieldRow fsLastRow"]');
  }
  
  for (let node of nodes) {
    if (header_title != '') {
      let header_node = node.querySelector('[class="fsLabel fsRequiredLabel fsLabelVertical"]');
      if (header_node == null || header_node.innerText.toLowerCase() != header_title.toLowerCase()) {
        continue;
      }
    }
    
    let radio_node = node.querySelector(`input[type="radio"][value="${checkbox_text}"]`);
    if (radio_node == null) {
      continue;
    }
    
    radio_node.click();
  }
}
 
function is_product_question(node) {
  return node.innerText.toLowerCase().includes('What is the Status upon arrival'.toLowerCase());
}

function get_manager_names() {
  for (const [store, names] of Object.entries(MANAGER_NAMES)) {
    let store_detail = get_store_detail();
    if (store_detail.startsWith(store)) {
      return names;
    }
  }
  return null;
}
 
function fill_manager_name() {
  let first_name_node = document.querySelector("input[aria-label='First Name']");
  let last_name_node = document.querySelector("input[aria-label='Last Name']");
  
  let store_detail = get_store_detail();
  
  for (const [store, names] of Object.entries(MANAGER_NAMES)) {
    if (store_detail.startsWith(store)) {
      first_name_node.value = names[0];
      last_name_node.value = names[1];  
      return;
    }
  }
}

function get_trunc_store_name(store_label) {
  let store_name_re = /.*?\| *(.*)/mi;
  let match = store_name_re.exec(store_label);
  if (match == null) {
    return store_label;
  }
  
  return match[1];
}

function get_product_name_no_upc(full_product_name) {
  let product_name_re = /(.*)[-\|] *[0-9]+/mi;
  let match = product_name_re.exec(full_product_name);
  if (match == null) {
    return full_product_name;
  }
  return match[1];
}

function is_oos(node) {
  let target_question_text = 'What is the Status upon arrival';
  let target_include_for_oos = 'not on shelf';
  let wanted_node = null;
  for (let el of node.children) {
    if ( el.innerText.toLowerCase().includes(target_question_text.toLowerCase())  ) {
      wanted_node = el;
      break;
    }
  }
  if (wanted_node == null) {
    return false
  }
  
  let input_nodes = wanted_node.querySelectorAll('input[type="radio"]');
  let wanted_input_node = null;
  for (let el of input_nodes) {
    if (el.checked) {
      wanted_input_node = el;
      break;
    }
  }
  if (wanted_input_node == null) {
    return false;
  }
  
  return wanted_input_node.parentNode.innerText.toLowerCase().includes(target_include_for_oos.toLowerCase());
}
 
function get_question_text(node) {
  return node.children[0].children[0].innerText;
}

function get_check_digit(test_upc) {
    let array = test_upc.split('').reverse();

    let total = 0;
    let i = 1;
    array.forEach(number => {
        number = parseInt(number);
        if (i % 2 === 0) {
            total = total + number;
        }
        else {
            total = total + (number * 3);
        }
        i++;
    });

    let res = (Math.ceil(total / 10) * 10) - total;

    // console.log(`Check digit is ${res}, type: ${typeof(res)}`);

    return res;
}

function get_full_upc_from_length11(first_digit, trunc_upc) {
  if ( is_valid_upc(first_digit + trunc_upc) ) {
    console.log('UPC length 11: appendleft the first_digit')
    return first_digit + trunc_upc;
  }
  else {
    console.log('UPC length 11: append check digit')
    return trunc_upc + get_check_digit(trunc_upc);
  }
}

function is_valid_upc(test_upc) {
  return test_upc.length == 12 && test_upc.slice(-1) == get_check_digit(test_upc.slice(0, 11));
}

function get_full_upc(trunc_upc, client_name) {
  trunc_upc = trunc_upc.trim();
  first_digit = (client_name == 'YASSO' ? '8' : '0');

  if (trunc_upc.length == 12) {
    console.log('UPC length 12')
    return trunc_upc;
  }
  else if (trunc_upc.length == 10) {
    console.log('UPC length 10')
    temp = first_digit + trunc_upc;
    return temp + get_check_digit(temp);
  }
  else if (trunc_upc.length == 11) {
    return get_full_upc_from_length11(first_digit, trunc_upc);
  }

  return null;
}

function get_upc_from_question_node(node) {
    upc_re = /.*[-\|] *([0-9]+)/i;
    question_text = get_question_text(node);
    
    match = upc_re.exec(question_text);
    if (match == null) {
        return null;
    }
    
    return match[1];
}

function get_upc_image_url(node) {
    img_node = node.querySelector('img');
    if (img_node == null || !img_node.hasAttribute('src')) {
        return null;
    }
    
    return img_node.getAttribute('src');
}

function get_client_name() {
  let current_url = window.location.href;
  let client_re = /https?:\/\/.*?\/(\w+?)_/i;
  
  match = client_re.exec(current_url);
  if (match == null) {
    return null;
  }
  return match[1];  
}
 
function is_within_target(actual_percent, target_percent) {
  if (actual_percent <= target_percent) {
    return true;
  }
  return false;
}
 
function rand_percent() {
  return Math.floor(Math.random() * (100 - 0 + 1)) + 0;
}
 
function get_store_detail() {
  let parent_node = document.querySelector("div[fs-field-validation-name='STORE DETAIL']");
  if (parent_node == null) {
      parent_node = document.querySelector('[fs-field-validation-name="STORE"]')
  }
  let store_detail = parent_node.children[0].getAttribute('value');
  return store_detail;
}
 
function get_timeout() {
  let ret = NEXT_TIME_TO_WAIT;
  NEXT_TIME_TO_WAIT += TIME_TO_ADD;
  
  return ret;
}

function capitalizeFirstLetter(string_) {
    return string_[0].toUpperCase() + string_.slice(1).toLowerCase();
}

function titleCase(string_) {
    return string_.split(" ").map(x => capitalizeFirstLetter(x)).join(" ");
}


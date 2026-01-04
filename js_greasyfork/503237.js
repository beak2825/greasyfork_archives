// ==UserScript==
// @name         MyMHAnyTrapAnySkin
// @namespace    https://greasyfork.org/en/users/39779
// @version      2024-08-12.001
// @description  Turn any trap or skin you own, into a skin for your current setup.
// @author       lounge
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503237/MyMHAnyTrapAnySkin.user.js
// @updateURL https://update.greasyfork.org/scripts/503237/MyMHAnyTrapAnySkin.meta.js
// ==/UserScript==

let base_skin_button;
let trap_skin_button;
const stolen_base_layer = document.createElement('div');
const stolen_weapon_layer = document.createElement('div');
const stolen_bait_layer = document.createElement('div');
const white_bg_layer = document.createElement('div');

const flex_div = document.createElement('div');
const buttonstyle = document.createElement('style');
buttonstyle.innerHTML =
  '.buttonstyle {display:block;width:auto;height:20px;margin:5px 36px 0;background:#f6f3eb;border:1px solid #534023;-webkit-box-shadow:-1px -1px 1px #d3cecb inset;box-shadow:-1px -1px 1px #d3cecb inset;border-radius:4px;padding:0;z-index:15}';
document.head.appendChild(buttonstyle);

// Skin buttons are the buttons below your trap setup to toggle visibility of stolen setups
function generate_skin_button(element) {
  let button = element;
  button.style.flex = '1 1 50%';
  button.style.minWidth = 0;
  button.classList.add('buttonstyle');
  return button;
}

function inject_skin_buttons() {
  let tsv_summary = document.getElementsByClassName(
    'trapSelectorView__summary'
  );
  if (tsv_summary.length == 0) {
    return;
  }
  let codex_container = document.getElementsByClassName(
    'trapSelectorView__activeCodexContainer'
  );
  if (!document.getElementById('custom-skins-flex')) {
    tsv_summary[0].insertBefore(flex_div, codex_container[0]);
  }
}

function steal() {
  let wb_button = document.getElementById('wb-steal');
  let s_button = document.getElementById('s-steal');
  let item_view_container =
    document.getElementsByClassName('itemViewContainer')[0];
  let item_id = item_view_container.getAttribute('data-item-id');
  hg.utils.UserInventory.getItem(item_id, function (e) {
    if (e.quantity >= 0) {
      if (item_view_container.classList.contains('weapon')) {
        localStorage.setItem('stolen-weapon', item_id);
        wb_button.classList.replace('available', 'selected');
      } else if (item_view_container.classList.contains('base')) {
        localStorage.setItem('stolen-base', item_id);
        wb_button.classList.replace('available', 'selected');
      } else if (item_view_container.classList.contains('skin')) {
        localStorage.setItem('stolen-weapon', item_id);
        s_button.classList.replace('available', 'selected');
      }
    } else {
      alert('You do not own this item.');
    }
  });
}

function generate_steal_button() {
  let button = document.createElement('a');
  button.classList.add(
    'mousehuntActionButton',
    'itemView-action-component-actionButton',
    'available'
  );
  button.onclick = function (click_event) {
    steal();
  };
  let steal_span = document.createElement('span');
  steal_span.classList.add('itemView-action-text-componentStatus', 'available');
  steal_span.textContent = 'Steal';
  let stolen_span = document.createElement('span');
  stolen_span.classList.add('itemView-action-text-componentStatus', 'selected');
  stolen_span.textContent = 'Stealened';
  button.appendChild(steal_span);
  button.appendChild(stolen_span);
  return button;
}

function inject_steal_button() {
  let itemviewcontainer =
    document.getElementsByClassName('itemViewContainer')[0];
  let item_id = itemviewcontainer.getAttribute('data-item-id');
  let itemview_actioncontainer = document.getElementsByClassName(
    'itemView-actionContainer'
  )[0];
  if (itemview_actioncontainer.children.length == 0) {
    let manual_itemview_action = document.createElement('div');
    manual_itemview_action.classList.add('itemView-action', 'weapon', 'base');
    itemview_actioncontainer.appendChild(manual_itemview_action);
  }
  let itemView_action_skin = document.createElement('div');
  itemView_action_skin.classList.add('itemView-action', 'skin');
  itemview_actioncontainer.appendChild(itemView_action_skin);
  let itemView_action_weapon = document.getElementsByClassName(
    'itemView-action weapon'
  )[0];
  let wb_button = generate_steal_button();
  wb_button.id = 'wb-steal';
  let s_button = generate_steal_button();
  s_button.id = 's-steal';
  if (
    item_id == localStorage.getItem('stolen-weapon') ||
    item_id == localStorage.getItem('stolen-base')
  ) {
    wb_button.classList.replace('available', 'selected');
    s_button.classList.replace('available', 'selected');
  }
  itemView_action_weapon.appendChild(wb_button);
  itemView_action_skin.appendChild(s_button);
}

function make_small(element) {
  element.style.left = '20%';
  element.style.top = '30%';
  element.style.width = '70%';
}
function make_normal(element) {
  element.style.left = '';
  element.style.top = '';
  element.style.width = '';
}
function make_sphynx(element) {
  element.style.left = '21%';
  element.style.top = '23%';
  element.style.width = '70%';
}

function create_stolen_layers() {
  stolen_bait_layer.id = 'stolen-bait-layer';
  stolen_bait_layer.classList.add('trapImageView-layer');
  stolen_base_layer.id = 'stolen-base-layer';
  stolen_base_layer.classList.add('trapImageView-layer');
  stolen_weapon_layer.id = 'stolen-weapon-layer';
  stolen_weapon_layer.classList.add('trapImageView-layer');
  white_bg_layer.id = 'white-bg';
  white_bg_layer.classList.add('trapImageView-layer');
  white_bg_layer.style.backgroundColor = '#fff';
}

function move_stolen_layers() {
  let to_show = localStorage.getItem('stolen-show');
  let trap_layers = document.getElementsByClassName(
    'trapImageView-layerWrapper'
  )[0];
  let real_base_layer = document.getElementsByClassName(
    'trapImageView-layer base'
  )[0];
  let real_weapon_layer = document.getElementsByClassName(
    'trapImageView-layer weapon'
  )[0];
  let real_bait_layer = document.getElementsByClassName(
    'trapImageView-layer bait'
  )[0];
  switch (to_show) {
    case 'none':
      trap_layers.appendChild(white_bg_layer);
      trap_layers.appendChild(real_base_layer);
      trap_layers.appendChild(real_weapon_layer);
      trap_layers.appendChild(real_bait_layer);
      if (real_weapon_layer.getAttribute('large-weapon')) {
        make_small(real_base_layer);
      } else {
        make_normal(real_base_layer);
      }
      break;
    case 'both':
      //Show both
      trap_layers.appendChild(white_bg_layer);
      trap_layers.appendChild(stolen_base_layer);
      trap_layers.appendChild(stolen_weapon_layer);
      trap_layers.appendChild(stolen_bait_layer);
      if (stolen_weapon_layer.getAttribute('large-weapon')) {
        make_small(stolen_base_layer);
        make_small(stolen_bait_layer);
      } else {
        make_normal(stolen_base_layer);
        make_normal(stolen_bait_layer);
      }
      //Sphynx fix
      if (stolen_weapon_layer.classList.contains('sphynx-weapon')) {
        make_sphynx(stolen_bait_layer);
      }
      break;
    case 'base':
      //Show base only
      trap_layers.appendChild(white_bg_layer);
      trap_layers.appendChild(stolen_base_layer);
      trap_layers.appendChild(real_weapon_layer);
      trap_layers.appendChild(real_bait_layer);
      if (real_weapon_layer.getAttribute('large-weapon')) {
        make_small(stolen_base_layer);
      } else {
        make_normal(stolen_base_layer);
      }
      break;
    case 'weapon':
      //Show weapon only
      trap_layers.appendChild(white_bg_layer);
      trap_layers.appendChild(real_base_layer);
      trap_layers.appendChild(stolen_weapon_layer);
      trap_layers.appendChild(stolen_bait_layer);
      if (stolen_weapon_layer.getAttribute('large-weapon')) {
        make_small(real_base_layer);
        make_small(stolen_bait_layer);
      } else {
        make_normal(real_base_layer);
        make_normal(stolen_bait_layer);
      }
      //Sphynx fix
      if (stolen_weapon_layer.classList.contains('sphynx-weapon')) {
        make_sphynx(stolen_bait_layer);
      }
      break;
  }
}

function populate_stolen_layers() {
  let real_weapon_id = user.weapon_item_id;
  let stolen_base_id = localStorage.getItem('stolen-base');
  let stolen_weapon_id = localStorage.getItem('stolen-weapon');
  hg.utils.UserInventory.getItems(
    [stolen_base_id, stolen_weapon_id, real_weapon_id],
    (e) => {
      let stolen_base = e[0];
      let stolen_weapon = e[1];
      let real_weapon = e[2];
      let trap_layers = document.getElementsByClassName(
        'trapImageView-layerWrapper'
      )[0];
      let real_base_layer = document.getElementsByClassName(
        'trapImageView-layer base'
      )[0];
      let real_weapon_layer = document.getElementsByClassName(
        'trapImageView-layer weapon'
      )[0];
      let real_bait_layer = document.getElementsByClassName(
        'trapImageView-layer bait'
      )[0];
      if (stolen_weapon.weapon_image_large) {
        stolen_weapon_layer.setAttribute('large-weapon', true);
      }
      if (real_weapon.weapon_image_large) {
        real_weapon_layer.setAttribute('large-weapon', true);
      }
      if (real_weapon.classification == 'weapon') {
        if (
          real_weapon.type == 'sphynx_weapon' ||
          real_weapon.type == 'chrome_sphynx_weapon'
        ) {
          real_weapon_layer.classList.add('sphynx-weapon');
        }
      } else if (real_weapon.classification == 'skin') {
        if (
          real_weapon.component_type == 'sphynx_weapon' ||
          real_weapon.component_type == 'chrome_sphynx_weapon'
        ) {
          real_weapon_layer.classList.add('sphynx-weapon');
        }
      }
      if (stolen_weapon.classification == 'weapon') {
        if (
          stolen_weapon.type == 'sphynx_weapon' ||
          stolen_weapon.type == 'chrome_sphynx_weapon'
        ) {
          stolen_weapon_layer.classList.add('sphynx-weapon');
        }
      } else if (stolen_weapon.classification == 'skin') {
        if (
          stolen_weapon.component_type == 'sphynx_weapon' ||
          stolen_weapon.component_type == 'chrome_sphynx_weapon'
        ) {
          stolen_weapon_layer.classList.add('sphynx-weapon');
        }
      }
      stolen_base_layer.style.backgroundImage =
        'url(' + stolen_base.image_trap + ')';
      stolen_weapon_layer.style.backgroundImage =
        'url(' + stolen_weapon.image_trap + ')';
      stolen_bait_layer.style.backgroundImage =
        real_bait_layer.style.backgroundImage;
      move_stolen_layers();
    }
  );
}

function watch_weapon() {
  // When weapon class changes i.e new real weapon selected, checks and sets large-weapon if large weapon
  new MutationObserver(function (mutationList) {
    if (mutationList[0].target.className == mutationList[0].oldValue) {
      return;
    }
    hg.utils.UserInventory.getItem(user.weapon_item_id, function (e) {
      let real_weapon_layer = document.getElementsByClassName(
        'trapImageView-layer weapon'
      )[0];
      if (
        e.weapon_image_large &&
        real_weapon_layer.getAttribute('large-weapon') == null
      ) {
        real_weapon_layer.setAttribute('large-weapon', true);
      } else {
        real_weapon_layer.removeAttribute('large-weapon');
      }
      move_stolen_layers();
    });
  }).observe(document.getElementsByClassName('trapImageView-layer weapon')[0], {
    attributeFilter: ['class'],
    attributeOldValue: true
  });
}

(function () {
  'use strict';

  if (document.body.classList.contains('PageItem')) {
    inject_steal_button();
    return;
  }

  if (localStorage.getItem('stolen-base') == null) {
    localStorage.setItem('stolen-base', '31');
  }
  if (localStorage.getItem('stolen-weapon') == null) {
    localStorage.setItem('stolen-weapon', '51');
  }
  if (localStorage.getItem('stolen-show') == null) {
    localStorage.setItem('stolen-show', 'both');
  }

  flex_div.id = 'custom-skins-flex';
  flex_div.style.display = 'flex';
  flex_div.style.justifyContent = 'center';

  let to_show = localStorage.getItem('stolen-show');
  base_skin_button = generate_skin_button(document.createElement('a'));
  base_skin_button.id = 'base-skin-button';
  base_skin_button.style.marginRight = 0;
  base_skin_button.onclick = function () {
    let base_skin_button = document.getElementById('base-skin-button');
    switch (base_skin_button.style.backgroundColor) {
      case 'rgb(211, 211, 211)':
        base_skin_button.style.backgroundColor = '#228B22';
        break;
      case 'rgb(34, 139, 34)':
        base_skin_button.style.backgroundColor = '#D3D3D3';
        break;
    }
    switch (localStorage.getItem('stolen-show')) {
      case 'none':
        localStorage.setItem('stolen-show', 'base');
        break;
      case 'both':
        localStorage.setItem('stolen-show', 'weapon');
        break;
      case 'weapon':
        localStorage.setItem('stolen-show', 'both');
        break;
      case 'base':
        localStorage.setItem('stolen-show', 'none');
        break;
    }
    move_stolen_layers();
  };

  trap_skin_button = generate_skin_button(document.createElement('a'));
  trap_skin_button.id = 'trap-skin-button';
  trap_skin_button.style.marginLeft = 0;
  trap_skin_button.onclick = function () {
    let trap_skin_button = document.getElementById('trap-skin-button');
    switch (trap_skin_button.style.backgroundColor) {
      case 'rgb(211, 211, 211)':
        trap_skin_button.style.backgroundColor = '#228B22';
        break;
      case 'rgb(34, 139, 34)':
        trap_skin_button.style.backgroundColor = '#D3D3D3';
        break;
    }
    switch (localStorage.getItem('stolen-show')) {
      case 'none':
        localStorage.setItem('stolen-show', 'weapon');
        break;
      case 'both':
        localStorage.setItem('stolen-show', 'base');
        break;
      case 'weapon':
        localStorage.setItem('stolen-show', 'none');
        break;
      case 'base':
        localStorage.setItem('stolen-show', 'both');
        break;
    }
    move_stolen_layers();
  };

  switch (to_show) {
    case 'none':
      base_skin_button.style.backgroundColor = '#D3D3D3';
      trap_skin_button.style.backgroundColor = '#D3D3D3';
      break;
    case 'both':
      base_skin_button.style.backgroundColor = '#228B22';
      trap_skin_button.style.backgroundColor = '#228B22';
      break;
    case 'weapon':
      base_skin_button.style.backgroundColor = '#D3D3D3';
      trap_skin_button.style.backgroundColor = '#228B22';
      break;
    case 'base':
      base_skin_button.style.backgroundColor = '#228B22';
      trap_skin_button.style.backgroundColor = '#D3D3D3';
      break;
  }
  flex_div.appendChild(base_skin_button);
  flex_div.appendChild(trap_skin_button);

  let modify_popup = function (mutationList) {
    if (
      document
        .getElementById('overlayPopup')
        .classList.contains('itemViewPopup')
    ) {
      inject_steal_button();
    }
  };
  new MutationObserver(modify_popup).observe(
    document.getElementById('overlayPopup'),
    { attributeFilter: ['class'] }
  );

  new MutationObserver(function (mutationList) {
    if (
      document.body.classList.contains('PageCamp') ||
      document.body.classList.contains('PageHunterProfile')
    ) {
      watch_weapon();
      inject_skin_buttons();
      create_stolen_layers();
      populate_stolen_layers();
    }
  }).observe(document.body, { attributeFilter: ['class'] });

  if (document.body.classList.contains('PageCamp')) {
    watch_weapon();
    inject_skin_buttons();
    create_stolen_layers();
    populate_stolen_layers();
  }
})();

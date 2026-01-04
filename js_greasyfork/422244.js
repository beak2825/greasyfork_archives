// ==UserScript==
// @name         cytube user highlight
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  highlight users in chat
// @author       unrealfag
// @match        https://cytu.be/r/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422244/cytube%20user%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/422244/cytube%20user%20highlight.meta.js
// ==/UserScript==
'use strict';

const defaultColor = '#2c902c99';
const toggleOnClass = 'glyphicon glyphicon-heart';
const toggleOffClass = 'glyphicon glyphicon-heart-empty';
const storageId = 'unrealfags-usercolor-menu';
const openMessage = `<i class="glyphicon glyphicon-list"></i> Highlights `;
const closeMessage = `<i class="glyphicon glyphicon-floppy-disk"></i> Save! `;

const storage = (name, value) => {
	if (typeof value === 'undefined') {
  	return localStorage[name] ? JSON.parse(localStorage[name]) : undefined;
  }
  localStorage[name] = JSON.stringify(value);
};

const createElement = (tag, inner, style) => {
  const el = document.createElement(tag);
  if (style) Object.keys(style).forEach(key => { el.style[key] = style[key]; });
  if (typeof inner === 'object' && inner !== null) el.appendChild(inner);
  else el.innerHTML = inner || '';
  return el;
};

const Menu = createElement('ul', null, {
  display: 'none',
  'white-space': 'nowrap',
  padding: '5px',
});
const MenuHelpers = {
  MenuHandlers: [],
  getNameListInput: (nameList) => {
    const NamesInput = createElement('input', null, {
      height: '11px',
      display: 'inline-block',
      width: 'initial',
    });
    NamesInput.type = 'text';
    NamesInput.className = 'form-control';
    NamesInput.value = nameList;
    NamesInput.placeholder = 'user1 user2 userName...';
    return NamesInput;
  },
  getColorInput: (color) => {
    const ColorInput = createElement('input', null, {
      height: '11px',
      display: 'inline-block',
      color: 'white',
      width: '100px',
      'font-family': 'monospace',
      margin: '0px 5px',
    });
    ColorInput.addEventListener('input', MenuHelpers.onColorInputChanged);
    ColorInput.className = 'form-control';
    ColorInput.value = color || defaultColor;
    ColorInput.style.background = color || defaultColor;
    return ColorInput;
  },
  onColorInputChanged: (target) => {
    const color = target.target.value.match(/#[a-fA-F0-9]{8}/g);
    if (color) {
      target.target.style.background = color;
      target.target.style['border-color'] = 'initial';
    } else {
      target.target.style.background = 'transparent';
      target.target.style['border-color'] = 'red';
    }
  },
  getToggleButton: (isOn) => {
    const ToggleButton = document.createElement('i');
    ToggleButton.addEventListener('click', MenuHelpers.toggleRow);
    ToggleButton.className = isOn ? toggleOnClass : toggleOffClass;
    return ToggleButton;
  },
  toggleRow: (target) => {
    const isOn = target.target.className === toggleOnClass;
    target.target.className = isOn ? toggleOffClass : toggleOnClass;
  },
  getMenuRow: (isOn, color, nameList) => {
    const ToggleButton = MenuHelpers.getToggleButton(isOn);
    const ColorInput = MenuHelpers.getColorInput(color);
    const NamesInput = MenuHelpers.getNameListInput(nameList);
    const MenuRow = createElement('div');
    MenuRow.appendChild(ToggleButton);
    MenuRow.appendChild(ColorInput);
    MenuRow.appendChild(NamesInput);
    const MenuItem = createElement('li', MenuRow);
    return {
      element: MenuItem,
      isEnabled: () => ToggleButton.className === toggleOnClass,
      getColor: () => ColorInput.value || defaultColor,
      getNameList: () => NamesInput.value || '',
    };
  },
  openMenu: () => {
    const menuItems = storage(storageId) || [];
    menuItems.push({
      isOn: true,
      color: defaultColor,
      names: '',
    });
    menuItems.forEach(item => {
      const itemData = MenuHelpers.getMenuRow(item.isOn, item.color, item.names);
      MenuHelpers.MenuHandlers.push(itemData);
      Menu.appendChild(itemData.element);
    });
    MenuButton.innerHTML = closeMessage;
    Menu.style.display = 'block';
  },
  closeMenu: () => {
    const listData = MenuHelpers.MenuHandlers.map(menuData => {
      const isOn = menuData.isEnabled();
      const color = menuData.getColor();
      const names = menuData.getNameList();
      if (names && color) {
        return { isOn, color, names };
      }
      return null;
    }).filter(i => i !== null);
    storage(storageId, listData);
    MenuHelpers.MenuHandlers.length = 0;
    while (Menu.firstChild) { Menu.removeChild(Menu.firstChild); }
    MenuButton.innerHTML = openMessage;
    Menu.style.display = 'none';
    applyColors();
  }
};
Menu.className = 'dropdown-menu';

const MenuButton = createElement('button', openMessage, {
  padding: '2px 5px 2px 5px',
  'font-size': '11px',
  height: '20px',
  'vertical-align': 'top',
});
MenuButton.addEventListener('click', () => {
  const isClosed = Menu.style.display === 'none';
  if (isClosed) MenuHelpers.openMenu();
  else MenuHelpers.closeMenu();
});
MenuButton.className = 'btn btn-primary';

const Container = createElement('div');
Container.className = 'dropdown pull-right';
Container.appendChild(MenuButton);
Container.appendChild(Menu);

const applyColors = () => {
  if (!head) { return; }
  const styleClass = `${storageId}_style`;
  var oldStyles = head.getElementsByClassName(styleClass);
  while (oldStyles[0]) {
    head.removeChild(oldStyles[0]);
  }

  const userColorData = storage(storageId);
  userColorData.forEach(colorData => {
    if (colorData.isOn) {
      const names = colorData.names.split(' ');
      const style = createElement('style', `\
${names.map(name => `.chat-msg-${name}>:not(:last-of-type)`).join(', ')} {\
    display: inline-block;
    vertical-align: middle;
    line-height: 20px;
    background-color: ${colorData.color};\
}`);
      style.type = 'text/css';
      style.className = styleClass;
      head.appendChild(style);
    }
  });
};

const ChatHeader = document.getElementById('chatheader');
ChatHeader.appendChild(Container);
const head = document.getElementsByTagName('head')[0];
applyColors();
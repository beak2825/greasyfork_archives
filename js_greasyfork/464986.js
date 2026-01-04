// ==UserScript==
// @name        lucianjp-library
// @namespace   lucianjp
// @version     1.0.0
// @author      lucianjp
// @grant       GM_addStyle
// @description Core library to handle webpages dom with userscripts
// ==/UserScript==

class LucianJP_Menu {
  constructor() {
    this.menuContainer = null;
    this.isActive = true;
  }
  
  get container() {
    return this.menuContainer = this.menuContainer || document.querySelector('.lucianjp-menu') || this.createMenuContainer();
  }

  createMenuContainer() {
    this.menuContainer = document.createElement('div');
    this.menuContainer.classList.add('lucianjp-menu');
    document.body.appendChild(this.menuContainer);

    // Handle shift keypress to show/hide the menu
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Shift') {
        this.toggleMenu();
      }
    });

    return this.menuContainer;
  }

   add(text, onClick) {
    if (typeof onClick !== 'function') {
      console.error('LucianJP_Menu.add(): onClick argument must be a function.');
      return;
    }

    const menuItem = document.createElement('div');
    menuItem.innerText = text;
    menuItem.classList.add('lucianjp-menu-item');
    menuItem.addEventListener('click', onClick);
    this.container.appendChild(menuItem);
  }

  toggleMenu() {
    this.isActive = !this.isActive;
    this.container.classList.toggle('lucianjp-menu-close', !this.isActive);
  }
}

const lucianjp = {
  observe: (t, cb, once = false) => {
    let complete = true;

    const disconnectHandler = VM.observe(document, () => {
      if (!complete) return true;
      complete = false;
      const node = document.querySelector(t);

      if (node) {
        cb(node);
        return true;
      }

      complete = true;
    });
    if (once) ready(disconnectHandler);
  },
  ready: callback => {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
  },

  menu: new LucianJP_Menu()
}

// Add styles
GM_addStyle(`
  .lucianjp-menu {
    position: fixed;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 9999;
    transition: transform 0.3s ease-in-out;
  }

  .lucianjp-menu-close {
    transform: translateX(calc(100% - 20px)) translateY(-50%);
  }

  .lucianjp-menu-item {
    padding: 8px 16px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    color: #fff;
    background: #007aff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    margin: 8px 0;
  }

  .lucianjp-menu-item:hover {
    background: #0066cc;
  }
`);
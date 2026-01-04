// ==UserScript==
// @name Sploop.io simple hat menu
// @author rrrqqrr5rrqrr
// @description hat menu small left side
// @match *://sploop.io/*
// @run-at document-start
// @grant none
// @version 1.0
// @license MIT
// @namespace Sploop.io simple hat menu
// @downloadURL https://update.greasyfork.org/scripts/524933/Sploopio%20simple%20hat%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/524933/Sploopio%20simple%20hat%20menu.meta.js
// ==/UserScript==

// STOP USE AUTOBUILD AUTOPLACE AUTOPUSH OR WHATEVER "ENJOY" THE GAME

document.getElementById('hat-menu').style.left = '1%';
document.getElementById('hat-menu').style.top = '20';
const popBox = document.querySelector('.pop-box');
if (popBox) {
    popBox.style.border = 'none';
    popBox.style.boxShadow = 'none';
}
const hat_menu_content = document.querySelector('.pop-box');
if (hat_menu_content) {
    hat_menu_content.style.padding = 'none';
}
(function () {
    'use strict';

    const elementsToClean = [
        { id: 'hat-menu', styles: { width: '200px', height: '700px' } },
        { id: 'game-bottom-content', remove: true },
        { id: 'left-content', remove: true },
        { id: 'right-content', remove: true },
        { id: 'logo', remove: true },
        { id: 'pop-top select', remove: true },
        { id: 'pop-title text-shadowed-4', remove: true },
        { id: 'hat-menu-close-button', remove: true },
        { id: 'cross-promo', remove: true },
        { id: 'hat-menu', styles: { background: 'none', userSelect: 'auto' } },
        { id: 'main-content', styles: { background: 'none', userSelect: 'auto' } },
        { id: 'homepage', styles: { background: 'none', userSelect: 'auto' } },
        { id: 'pop-box-menu', styles: { background: 'none', userSelect: 'auto' } },
        { id: 'hat_menu_content', styles: { overflow: 'hidden' } },
        { id: 'menu-item', remove: true }
    ];

    elementsToClean.forEach(({ id, classes, styles, remove }) => {
        const element = document.getElementById(id);
        if (element) {
            if (remove) {
                element.remove();
                return;
            }
            if (classes) {
                element.classList.remove(...classes);
            }
            if (styles) {
                Object.entries(styles).forEach(([key, value]) => {
                    element.style[key] = value;
                });
            }
        } else {
            console.warn(`Element mit ID "${id}" nicht gefunden!`);
        }
    });
})();

const menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(item => {
  const header = item.querySelector('.header');
  if (header) {
    header.remove();
  }
  const description = item.querySelector('.description');
  if (description) {
    description.remove();
  }
  menuItems.forEach(item => {
    item.style.padding = '0';
    item.style.width = '0';
  });
  const pricing = item.querySelector('.pricing');
  if (pricing) {
    pricing.remove();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.menu-item');

  menuItems.forEach(item => {
    const button = item.querySelector('.green-button');
    if (button) {
      const buttonClickFunction = button.onclick;
      button.remove();

      const image = item.querySelector('img');
      if (image) {
        image.style.pointerEvents = 'auto';

        image.addEventListener('click', () => {
          if (buttonClickFunction) {
            buttonClickFunction();
          }
        });
      }
    }
  });
});


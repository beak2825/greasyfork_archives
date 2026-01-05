// ==UserScript==
// @name         The Works Burger Chooser
// @namespace    https://greasyfork.org/users/649
// @version      1.3.1
// @description  Choose a random burger on the works menu
// @author       Adrien Pyke
// @match        *://worksburger.com/menu/burger-menu/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/22582/The%20Works%20Burger%20Chooser.user.js
// @updateURL https://update.greasyfork.org/scripts/22582/The%20Works%20Burger%20Chooser.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const W = unsafeWindow || window;

  const SCRIPT_NAME = 'The Works Burger Chooser';

  const Util = {
    log(...args) {
      args.unshift(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: #233c7b;');
      console.log(...args);
    },
    q: (query, context = document) => context.querySelector(query),
    qq: (query, context = document) =>
      Array.from(context.querySelectorAll(query)),
    prepend: (parent, child) => parent.insertBefore(child, parent.firstChild),
    createCheckbox(text) {
      const label = document.createElement('label');
      label.textContent = text;
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      label.appendChild(checkbox);
      return label;
    },
    randomColor() {
      const letters = '0123456789ABCDEF'.split('');
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * letters.length)];
      }
      return color;
    },
    createStyle(css) {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    }
  };

  Util.createStyle(`
		.vc_grid-item-mini .vc_col-sm-12 {
			width: 100%
		}
	`);

  const container = document.createElement('div');
  container.setAttribute(
    'style',
    `
		position: fixed;
		bottom: 20px;
		left: 20px;
		padding: 5px;
		z-index: 99999;
		background-color: white;
		display: flex;
		flex-direction: column;
	`
  );

  const vegetarian = Util.createCheckbox('Vegetarian ');
  const cbVegetarian = Util.q('input', vegetarian);
  container.appendChild(vegetarian);

  const button = document.createElement('button');
  button.textContent = 'Choose Random Burger';
  container.appendChild(button);

  document.body.appendChild(container);

  const selectBurger = () => {
    Util.log('Choosing Random Burger...');

    let burgers = Util.qq('.vc_grid-item-mini');
    burgers.forEach(burger => burger.removeAttribute('style'));
    if (cbVegetarian.checked) {
      burgers = burgers.filter(b =>
        Util.q('img[src="/wp-content/uploads/2017/11/veg.png"]', b)
      );
    }

    const burger = burgers[Math.floor(Math.random() * burgers.length)];

    burger.setAttribute(
      'style',
      `
			transition: 0.5s;
			box-shadow: inset 0 0 100px ${Util.randomColor()};
			transform: scale(1.2, 1.2);
			border-radius: 20px;
		`
    );

    setTimeout(() => (burger.style.transform = 'scale(1, 1)'), 500);

    burger.scrollIntoView();
  };

  if (W.BM_MODE) {
    selectBurger();
  }

  button.onclick = selectBurger;
})();

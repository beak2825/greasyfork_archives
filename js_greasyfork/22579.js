// ==UserScript==
// @name         Loft Lounge Board Game Filters
// @namespace    https://greasyfork.org/users/649
// @version      1.1.6
// @description  Adds Filters to the Loft Lounge board game page
// @author       Adrien Pyke
// @match        *://www.theloftlounge.ca/pages/board-games*
// @match        *://www.theloftlounge.ca/pages/new-games*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22579/Loft%20Lounge%20Board%20Game%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/22579/Loft%20Lounge%20Board%20Game%20Filters.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const SCRIPT_NAME = 'Loft Lounge Board Game Filters';

  const Util = {
    log(...args) {
      args.unshift(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: #233c7b;');
      console.log(...args);
    },
    q(query, context = document) {
      return context.querySelector(query);
    },
    qq(query, context = document) {
      return Array.from(context.querySelectorAll(query));
    },
    prepend(parent, child) {
      parent.insertBefore(child, parent.firstChild);
    },
    createTextbox() {
      const input = document.createElement('input');
      input.type = 'text';
      return input;
    },
    createCheckbox(lbl) {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(lbl));
      return label;
    },
    createButton(text, onclick) {
      const button = document.createElement('button');
      button.textContent = text;
      button.onclick = onclick;
      return button;
    },
    toTitleCase(str) {
      return str.replace(
        /[a-z0-9]+/giu,
        word => word.slice(0, 1).toUpperCase() + word.slice(1)
      );
    },
    appendStyle(str) {
      const style = document.createElement('style');
      style.textContent = str;
      document.head.appendChild(style);
    }
  };

  Util.appendStyle(/* css */ `
		/* Fix Ctrl+F */
		#sidebar-holder, #content-holder {
			position: static!important;
			height: auto!important;
		}
		#content {
			position: static!important;
			margin-left: 290px;
			width: auto;
		}
		#content-holder {
			width: 100%!important;
			float: right;
		}
		@media (max-width: 900px), (max-device-width: 1024px) {
			#content {
				margin-left: 0px;
			}
		}

		/* Additional Styles */
		.category-list {
			border: 1px solid black;
			border-radius: 6px;
			padding: 6px;
			background-color: white;
			color: black;
			position: absolute;
			z-index: 9999;
		}

		.rte table tr td:nth-of-type(1) {
			width: 75%;
		}

		.rte table tr td:nth-of-type(2) {
			width: 25%;
		}
	`);

  const table = Util.q('#page-content > div > table > tbody');
  const rows = Util.qq('tr:not(:first-of-type)', table);
  const categories = new Set(
    rows
      .map(row => {
        const typos = {
          Triva: 'Trivia'
        };
        const td = Util.q('td:last-of-type', row);
        let category = Util.toTitleCase(td.textContent.trim());
        if (typos[category]) {
          td.textContent = category = typos[category];
        }
        return category;
      })
      .sort()
  );

  const tr = document.createElement('tr');
  const td1 = document.createElement('td');
  const td2 = document.createElement('td');
  tr.appendChild(td1);
  tr.appendChild(td2);

  const nameFilter = Util.createTextbox();
  td1.appendChild(nameFilter);

  const selectedCategories = [];

  const filter = function () {
    rows.forEach(row => (row.hidden = true));
    let rowsFilter = rows;

    if (selectedCategories.length > 0) {
      rowsFilter = rowsFilter.filter(row => {
        const category = Util.q('td:last-of-type', row)
          .textContent.trim()
          .toLowerCase();
        return selectedCategories.includes(category);
      });
    }

    const value = nameFilter.value.trim().toLowerCase();
    if (value) {
      rowsFilter = rowsFilter.filter(row => {
        const name = Util.q('td:first-of-type', row)
          .textContent.trim()
          .toLowerCase();
        return name.includes(value);
      });
    }

    rowsFilter.forEach(row => (row.hidden = false));
  };

  nameFilter.oninput = filter;

  const categoryDiv = document.createElement('div');
  categoryDiv.classList.add('category-list');
  categoryDiv.hidden = true;

  const categorySpan = document.createElement('span');

  categories.forEach(category => {
    const label = Util.createCheckbox(category);
    categoryDiv.appendChild(label);
    categoryDiv.appendChild(document.createElement('br'));
    const check = Util.q('input', label);
    check.oninput = () => {
      const cat = category.trim().toLowerCase();
      const index = selectedCategories.indexOf(cat);
      if (check.checked) {
        if (index === -1) {
          selectedCategories.push(cat);
        }
      } else if (index !== -1) {
        selectedCategories.splice(index, 1);
      }
      categorySpan.textContent = selectedCategories
        .map(category => Util.toTitleCase(category))
        .join(', ');
      filter();
    };
  });

  const categoryButton = Util.createButton('Categories...', () => {
    if (categoryDiv.hidden) {
      categoryDiv.hidden = false;
    } else {
      categoryDiv.hidden = true;
    }
  });

  document.body.addEventListener('click', e => {
    if (e.target !== categoryButton && !categoryDiv.contains(e.target)) {
      categoryDiv.hidden = true;
    }
  });

  td2.appendChild(categoryButton);
  td2.appendChild(document.createElement('br'));
  td2.appendChild(categoryDiv);
  td2.appendChild(categorySpan);

  Util.prepend(table, tr);
})();

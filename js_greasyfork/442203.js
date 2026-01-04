// ==UserScript==
// @name         RF5 Category Filter
// @namespace    https://kurobam.github.io/
// @version      1.0.0
// @description  Adds buttons to filter recipes by category for Rune Factory 5
// @author       Redeven
// @match        https://kurobam.github.io/RF5-html-static/recipe_data.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442203/RF5%20Category%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/442203/RF5%20Category%20Filter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let ordered_recipes;
  let filterContainer;
  let buttons = [];

  function getAllRecipes() {
    let recipe_nodes = Array.from(document.getElementsByClassName('col-xs-6 mg-tb'));
    let recipes = recipe_nodes.map((node) => {
      const recipe_category = node.getElementsByClassName('recipe-category')[0].innerHTML;
      const skill_lvl = Number(node.getElementsByClassName('skill-lvl')[0].innerHTML.replace('Level: ', ''));
      return { node, recipe_category, skill_lvl };
    });
    ordered_recipes = recipes.sort((a, b) => {
      if (a.recipe_category === b.recipe_category) {
        return a.skill_lvl - b.skill_lvl;
      }
      return a.recipe_category > b.recipe_category ? 1 : a.recipe_category < b.recipe_category ? -1 : 0;
    });
    let parent_container = recipes[0].node.parentElement;
    ordered_recipes.forEach((row) => row.node.parentElement.removeChild(row.node));
    ordered_recipes.forEach((row) => parent_container.appendChild(row.node));
  }

  function setStyles(el, st) {
    Object.entries(st).forEach(([key, value]) => {
      el.style[key] = value;
    });
  }

  function addButton(itemType, colorHex, startNewLine = false) {
    if (!filterContainer) {
      filterContainer =
        document.getElementById('filterContainer') ||
        (() => {
          let container = document.createElement('div');
          container.id = 'filterContainer';
          setStyles(container, { marginLeft: '20%', width: '60%' });
          let first_row = document.getElementsByClassName('col-xs-6 mg-tb')[0];
          first_row.parentElement.insertBefore(container, first_row);
          return container;
        })();
    }
    const new_button = document.createElement('button');
    new_button.innerHTML = itemType;
    new_button.onclick = () => {
      ordered_recipes.forEach((recipe) => {
        if (itemType === 'Reset') {
          buttons.forEach((button) => setStyles(button, { fontWeight: null, textTransform: null }));
          setStyles(recipe.node, { display: null });
        } else {
          buttons.forEach((button) => setStyles(button, { fontWeight: null, textTransform: null }));
          setStyles(new_button, { fontWeight: 'bold', textTransform: 'uppercase' });
          setStyles(recipe.node, { display: recipe.recipe_category === itemType ? null : 'none' });
        }
      });
    };
    setStyles(new_button, {
      marginRight: '5px',
      marginBottom: '5px',
      padding: '10px 20px',
      border: '1px solid black',
      backgroundColor: colorHex,
    });
    if (startNewLine) {
      filterContainer.appendChild(document.createElement('br'));
    }
    filterContainer.appendChild(new_button);
    buttons.push(new_button);
  }

  function addAllButtons() {
    addButton('Reset', 'white');
    addButton('Farm tool', 'lightblue');
    addButton('Pharmacy', 'lightgreen');
    addButton('Short sword', 'yellow', true);
    addButton('Long sword', 'yellow');
    addButton('Spear', 'yellow');
    addButton('Axe', 'yellow');
    addButton('Hammer', 'yellow');
    addButton('Dual blades', 'yellow');
    addButton('Gloves', 'yellow');
    addButton('Staff', 'yellow');
    addButton('Armor', 'pink', true);
    addButton('Shield', 'pink');
    addButton('Headgear', 'pink');
    addButton('Shoes', 'pink');
    addButton('Accessory', 'pink');
    addButton('Handmade', 'orange', true);
    addButton('Frying pan', 'orange');
    addButton('Pot', 'orange');
    addButton('Steamer', 'orange');
    addButton('Knife', 'orange');
    addButton('Mixer', 'orange');
    addButton('Oven', 'orange');
  }

  const fake_onload = (...args) => {};
  const real_onload = window.onload || fake_onload;
  window.onload = (...args) => {
    real_onload(...args);
    getAllRecipes();
    addAllButtons();
  };
})();

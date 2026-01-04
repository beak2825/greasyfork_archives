// ==UserScript==
// @name        Belfry filtering buttons
// @description adds some filtering buttons to the belfry comic listing
// @namespace   https://sleazyfork.org/en/users/96703-justrunmyscripts
// @match       *://*belfrycomics.net/*
// @grant       none
// @version     1.0
// @author      justrunmyscripts
// @downloadURL https://update.greasyfork.org/scripts/399632/Belfry%20filtering%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/399632/Belfry%20filtering%20buttons.meta.js
// ==/UserScript==

const filterColumns = (category) => {
  elems = document.querySelectorAll('.column span > a');
  
  if (category === '') {
    elems.forEach(e => e.parentNode.style.visibility = 'visible');    
    return;
  }
  
  elems.forEach(e => e.parentNode.style.visibility = 'hidden');

  elems = document.querySelectorAll('.column em.warn');
  elems.forEach(e => {
    if (e.textContent.indexOf(category) !== -1 ) {
      e.parentNode.style.visibility = 'visible';    
    }
  });  
}
window.filterColumns = filterColumns;

const createButton = (value) => {
  b = document.createElement('button');
  b.textContent = value ? value : '*';
  b.onclick = () => {filterColumns(value)};
  return b;
}

const insertButtons = (targetElem) => {
  buttonContainer = document.createElement('div');
  
  for (const value of ['','A', 'L', 'N', 'V', 'X']) {
    b = createButton(value);
    buttonContainer.appendChild(b);
  }

  parent = targetElem.parentNode;

  parent.insertBefore(buttonContainer, targetElem);
}
targetElem = document.querySelector('.widehead');
insertButtons(targetElem);

window.insertButtons = insertButtons
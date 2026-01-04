// ==UserScript==
// @name        Redmine - hide comments dynamically
// @namespace   Violentmonkey Scripts
// @match       https://www.redmine.org/issues/*
// @grant       none
// @version     1.0
// @author      bagage
// @description Modify Redmine UI to toggle comments visibility on issue pages.
// @downloadURL https://update.greasyfork.org/scripts/421253/Redmine%20-%20hide%20comments%20dynamically.user.js
// @updateURL https://update.greasyfork.org/scripts/421253/Redmine%20-%20hide%20comments%20dynamically.meta.js
// ==/UserScript==

function addButton(parent, text, ischecked, onclickcb) {
  const button = document.createElement('button');
  button.innerText = text;
  button.onclick = onclickcb;
  parent.appendChild(button);
  if (ischecked) {
    onclickcb({ target: button });
  }
  return button;
}

function addCheckbox(parent, ischecked, onclick) {
  const checkbox = document.createElement('input');
  checkbox.setAttribute('type', 'checkbox');
  checkbox.setAttribute('class', 'journal-link');
  if (ischecked) checkbox.setAttribute('checked', 1);
  checkbox.onclick = onclick;
  parent.appendChild(checkbox);
  return checkbox;
}

const h3 = document.querySelector('#history>h3');
/* do nothing if there are no comments yet */
if (!h3) {
  console.log('no comments found yet, skipping.');
  return;
}
/* add custom CSS styles */

/* make buttons sticky */
h3.style.position = 'sticky';
h3.style.top = 0;
h3.style.zIndex = 1;
document.head.appendChild(document.createElement('style')).textContent =
  'button { background-color: #ddd; text-decoration: line-through; } .button-active { background-color: #cfc; text-decoration: none; } ';
const style = document.head.appendChild(document.createElement('style'));
const hiddenStyles = ['.hidden {display:none;}', '.hidden {opacity:0.5;}'];

/* load settings */
const storageKey = 'redmine-monkey';
const issue = location.pathname.split('/')[3];
const settings = JSON.parse(localStorage.getItem(storageKey) || '{}');
if (!settings[issue]) settings[issue] = [];

/* add checkbox to toggle all comments visibility */
addButton(h3, 'Comments', settings['show_comments'] !== false, e => {
  const commentsBtn = e.target;
  const active = commentsBtn.classList.toggle('button-active');
  style.textContent = hiddenStyles[active ? 1 : 0];
  settings['show_comments'] = active;
  localStorage.setItem(storageKey, JSON.stringify(settings));
});
/* add checkbox to hide revisions */
const revisions = document.querySelector('#issue-changesets');
if (revisions) {
  addButton(h3, 'Revs', settings['show_revisions'] !== false, e => {
    const revsBtn = e.target;
    const active = revsBtn.classList.toggle('button-active');
    if (active) {
      revisions.style.display = '';
    } else {
      revisions.style.display = 'none';
    }
    settings['show_revisions'] = active;
    localStorage.setItem(storageKey, JSON.stringify(settings));
  });
  if (settings['show_revisions'] === false) revisions.style.display = 'none';
}

/* hide meta comments by default and add checkbox to hide each user comments individually */ 
document.querySelectorAll('.journal h4').forEach(h4 => {
  let journal = h4.parentElement;
  if (!journal.classList.contains(".journal"))
    journal = journal.parentElement;
  const metaComment = journal.classList.contains('has-details') && 
                      !journal.classList.contains('has-notes');
  const isHidden = settings[issue].indexOf(journal.id) !== -1 || metaComment;
  
  if (isHidden) 
    journal.classList.add('hidden');
  
  const checkbox = addCheckbox(h4, !isHidden && !metaComment, () => {
    if (checkbox.checked) {
      journal.classList.remove('hidden');
      const idx = settings[issue].indexOf(journal.id);
      settings[issue].splice(idx, 1);
    } else {
      journal.classList.add('hidden');
      settings[issue].push(journal.id);
    }
    localStorage.setItem(storageKey, JSON.stringify(settings));
  });
  if (metaComment) {
    checkbox.setAttribute('disabled', true);
  }
});

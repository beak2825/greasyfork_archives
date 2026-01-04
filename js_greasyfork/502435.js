// ==UserScript==
// @name     ao3 slightly enhanced
// @version  1
// @grant    none
// @description hides extra tags for each tag category, made for personal use
// @match    https://archiveofourown.org/*
// @namespace https://greasyfork.org/users/1322440
// @downloadURL https://update.greasyfork.org/scripts/502435/ao3%20slightly%20enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/502435/ao3%20slightly%20enhanced.meta.js
// ==/UserScript==


// TODO: this should not run when going back
// idunno maybe add a variable or something on the page

work_list = document.querySelector(".work.index.group");
works = work_list = work_list.querySelectorAll(".work");

const tag_limit = 5;


works.forEach((work) => {
  const tag_list = work.querySelector(".tags");
  
  const relationship_tags = tag_list.querySelectorAll(".relationships");
  if (relationship_tags.length > tag_limit) {
    addExpander(relationship_tags, relationship_tags[relationship_tags.length - 1]);
    hideElements(relationship_tags);
  }
  
  const character_tags = tag_list.querySelectorAll(".characters");
	if (character_tags.length > tag_limit) {
    addExpander(character_tags, character_tags[character_tags.length - 1]);
    hideElements(character_tags);
  }
  const freeform_tags = tag_list.querySelectorAll(".freeforms");
  if (freeform_tags.length > tag_limit) {
    addExpander(freeform_tags, freeform_tags[freeform_tags.length - 1]);
    hideElements(freeform_tags);
  }
});


function addExpander(target_list, target) {
  const existing_button = target.parentElement.querySelector('#button');
  if (existing_button) {
    return;
  }
  
  const expand_button = document.createElement('button');
  expand_button.id = "button";
  expand_button.innerText = "Expand";
  expand_button.style.display = "inline-block";
  expand_button.style.padding = ".5rem";
  expand_button.style.margin = "1rem";
 
  const collapse_button = document.createElement('button');
  expand_button.id = "button";
  collapse_button.innerText = "Collapse";
  collapse_button.style.display = "none";
  collapse_button.style.padding = ".5rem";
  collapse_button.style.margin = "1rem";
  
  expand_button.onclick = function () {
    expand(expand_button, collapse_button ,target_list);
  };
  collapse_button.onclick = function () { 
    collapse(expand_button, collapse_button, target_list);
  };
  
  const parent_list = target.parentElement;
  parent_list.insertBefore(expand_button, target.nextSibling);
  parent_list.insertBefore(collapse_button, target.nextSibling);
}


function expand(expand, collapse, target) {
  target.forEach((item, index) => {
		item.style.display = 'inline-block';
	});
  
  expand.style.display = "none";
  collapse.style.display = 'inline-block';
}

function collapse(expand, collapse, target) {
  hideElements(target);
  
  expand.style.display = "inline-block";
  collapse.style.display = 'none';
}

function hideElements(target) {
  target.forEach((item, index) => {
    if (index >= tag_limit) {
      item.style.display = 'none';
    }
  });
}
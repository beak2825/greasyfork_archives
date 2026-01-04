// ==UserScript==
// @name        EMCSA Plus
// @namespace   gkrishna.gent
// @match       https://mcstories.com/WhatsNew.html
// @grant       GM_getValue
// @version     0.5
// @author      Gopi Krishna
// @description Enhance the Erotic Mind Control Stories Archive with some additional functionality
// @downloadURL https://update.greasyfork.org/scripts/416009/EMCSA%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/416009/EMCSA%20Plus.meta.js
// ==/UserScript==

function selectStoryByCond({authors_to_select=[]}) {
  var stories = document.getElementsByClassName("story");
  var wanted_stories = [];
  var matched_elements = [];

  storyloop: for (let story of stories) {
    subels = story.children;

    // validity check
    all_ok = true;
    if (subels.length != 3) { all_ok = false; }
    for (let se of subels) {
      if (se.nodeName != 'DIV') { all_ok = false; }
    }
    if (!all_ok) { 
      console.error("Page structure has changed, update the addon");
      return null;
    }

    author_els = subels[1].getElementsByTagName('a');
    for (let author_el of author_els) {
      for (let author of authors_to_select) {
        if (author_el.text.localeCompare(author, 'en', { sensitivity: 'base' }) == 0) {
          wanted_stories.push(story);
          matched_elements.push(author_el);
          continue storyloop;
        }
      }
    }
  }
  return [wanted_stories, matched_elements];
}


function hide_blocked_authors() {
  var authors_to_block = GM_getValue('authors_to_block', '');
  [stories_to_hide, ] = selectStoryByCond({authors_to_select: authors_to_block});
  for (let story of stories_to_hide) {
    console.log('Story '+story.children[0].children[0]+' '+
                story.children[1].textContent+' is hidden');
    story.style.display = 'none';
  }
}

function highlight_authors() {
  var authors_to_highlight = GM_getValue('authors_to_highlight', '');
  [, matched_authors] = selectStoryByCond({authors_to_select: authors_to_highlight});
  for (let author_el of matched_authors) {
    author_el.style.border = "medium solid lime";
  }
}

hide_blocked_authors();
highlight_authors();

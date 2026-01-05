// ==UserScript==
// @name        E-hentai Gallaries Easy Voting
// @namespace   ehgallary
// @include     http://g.e-hentai.org/g/*
// @include     http://exhentai.org/g/*
// @include     http://r.e-hentai.org/g/*
// @version     1
// @grant       none
// @description shortcuts for tagging in ehentai
// @downloadURL https://update.greasyfork.org/scripts/11895/E-hentai%20Gallaries%20Easy%20Voting.user.js
// @updateURL https://update.greasyfork.org/scripts/11895/E-hentai%20Gallaries%20Easy%20Voting.meta.js
// ==/UserScript==

/*
//unable to execute after ajax response now...... so use the alternative method
var shiftIsPressed = false;

window.addEventListener('keydown', function (e) {
  if (e.keyCode == 16) // SHIFT
  {
    shiftIsPressed = true;
  }
})

window.addEventListener('keyup', function (e) {
  if (e.keyCode == 16) // SHIFT
  {
    shiftIsPressed = false;
  }
})

function overrideTagpane() {
  var pending_tags = document.getElementsByClassName('gtl');
  for (i = 0; i < pending_tags.length; i++) {
    pending_tags[i].firstChild.onclick = function () {
      var selectedTag = this.id.slice(3).replace(/_/g, ' ');
      if (shiftIsPressed) {
        if (this.className == 'tup') { //already voted
          send_vote(selectedTag, - 1); //vote down
        } else {
          send_vote(selectedTag, 1); //vote up
        }
        return false;
      } else {
        return toggle_tagmenu(selectedTag, this);
      }
    };
  };
}

overrideTagpane();
*/

//-----------------------------------

function taggingIsLegit() {
  return document.getElementById('tagmenu_act').style.display != 'none';
}
//after select a tag, press 'f' to upvote, press 'd' to downvote, 'a' to search tag
//'d' to  view definition 'g' to add new tag

window.addEventListener('keydown', function (e) {
  if (taggingIsLegit()) {
    if (e.keyCode == 70) { // 'f'
      tag_vote_up();
    } else if (e.keyCode == 68) { // 'd'
      tag_vote_down();
    } else if (e.keyCode == 83) { // 's'
      tag_define();
    } else if (e.keyCode == 65) { // 'a'
      tag_show_galleries();
    } else if (e.keyCode == 71) { // 'g'
      toggle_tagmenu(undefined, undefined);
    }
  }
})
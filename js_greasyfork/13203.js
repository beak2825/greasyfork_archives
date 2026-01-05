// ==UserScript==
// @name        Tabun CommentHider L
// @author      Йетанозер
// @namespace   localhaust
// @description I Want my autohide back!

// @include  http://tabun.everypony.ru/*
// @include  http://tabun.everypony.info/*
// @include  http://табун.всепони.рф/*

// @include  https://tabun.everypony.ru/*
// @include  https://tabun.everypony.info/*
// @include  https://табун.всепони.рф/*

//@downloadURL	https://greasyfork.org/scripts/13203-tabun-commenthider-l/code/Tabun%20CommentHider%20L.user.js
//@updateURL	https://greasyfork.org/scripts/13203-tabun-commenthider-l/code/Tabun%20CommentHider%20L.user.js

// @grant    GM_setValue
// @grant    GM_deleteValue
// @grant    GM_getValue

// @version     0.3.3

// @downloadURL https://update.greasyfork.org/scripts/13203/Tabun%20CommentHider%20L.user.js
// @updateURL https://update.greasyfork.org/scripts/13203/Tabun%20CommentHider%20L.meta.js
// ==/UserScript==
function unhideComment(commentid) {
  var comm = document.getElementById('comment_content_id_' + commentid);
  comm.getElementsByClassName('text') [0].style.display = 'block';
  comm.removeChild(comm.lastChild);
  document.getElementById('hide_' + commentid).style.display = 'block';
  GM_deleteValue(commentid);
}

function createUnhideButton(commentid) {
  var newLink = document.createElement('a');
  newLink.href = '#';
  newLink.title = 'UNHIDE THIS FOR CELESTIA\'S SAKE';
  newLink.innerHTML = 'Комментарий скрыт. Показать?';
  newLink.id = 'unhide_' + commentid;
  newLink.classList.add('link-dotted');
  newLink.onclick = function (event) {
    event.preventDefault();
    unhideComment(commentid);
  };
  return newLink;
}

function hideComment(commentid) {
  var comm = document.getElementById('comment_content_id_' + commentid);
  comm.getElementsByClassName('text') [0].style.display = 'none';
  comm.appendChild(createUnhideButton(commentid));
  document.getElementById('hide_' + commentid).style.display = 'none';
  GM_setValue(commentid, true);
}

function createHideButton(commentid) {
  var newButt = document.createElement('li');
  var newLink = document.createElement('a');
  newLink.href = '#';
  newLink.title = 'HIDE THIS FOR CELESTIA\'S SAKE';
  newLink.innerHTML = 'Скрыть';
  newLink.id = 'hide_' + commentid;
  newLink.onclick = function (event) {
    event.preventDefault();
    hideComment(commentid);
  };
  newButt.appendChild(newLink);
  return newButt;
}

var GlobTimePassed = 0;

function updateNewComms() {
  if (GlobTimePassed > 8000){
    GlobTimePassed = 0;
    return;
  }
  if (document.getElementById('new_comments_counter').innerHTML === '0') {
    GlobTimePassed+=50;
    setTimeout(updateNewComms, 50);
    return;
  }
  GlobTimePassed = 0;
  var comms = document.querySelectorAll('.comment:not(.comment-deleted):not(.comment-bad):not(.hdr-processed)');
  for (var i = 0; i < comms.length; i++) {
    comms[i].getElementsByClassName('comment-info') [0].appendChild(createHideButton(comms[i].dataset.id));
    comms[i].classList.add('hdr-processed');
    if (parseInt((/-?\d+/).exec(comms[i].getElementsByClassName('vote-count') [0].innerHTML) [0], 10) < - 5) {
      hideComment(comms[i].dataset.id);
    }
  }
}

var comms = document.querySelectorAll('.comment:not(.comment-deleted):not(.comment-bad)');
for (var i = 0; i < comms.length; i++) {
  comms[i].getElementsByClassName('comment-info') [0].appendChild(createHideButton(comms[i].dataset.id));
  comms[i].classList.add('hdr-processed');
  if (GM_getValue(comms[i].dataset.id) === true) {
    hideComment(comms[i].dataset.id);
    continue;
  }
  if (parseInt((/-?\d+/).exec(comms[i].getElementsByClassName('vote-count') [0].innerHTML) [0], 10) < - 5) {
    hideComment(comms[i].dataset.id);
  }
}

document.getElementById('update-comments').addEventListener('click', function (event) {
  updateNewComms();
}, false)
document.getElementById('footer').innerHTML += ' :3'; //Просто признак того, что всё сработало

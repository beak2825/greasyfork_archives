// ==UserScript==
// @name        lor-deleted-comments-reveal
// @namespace   lor
// @description Shows links on the deleted comments. Board-style.
// @include     *.linux.org.ru/*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/404690/lor-deleted-comments-reveal.user.js
// @updateURL https://update.greasyfork.org/scripts/404690/lor-deleted-comments-reveal.meta.js
// ==/UserScript==


window.addEventListener('load', function() {
  // hook into evil-penguin pages
  var threadLink = document.querySelector('#warning-text p a');
  if (threadLink) {
    var parser = new DOMParser();

    fetch(threadLink.href).then(function(result) {
      if (result.ok) {
        return result.text();
      }
    }).then(function(text) {
      var dom = parser.parseFromString(text,'text/html');
      var forms = dom.querySelectorAll('form');
      var deletedForm = null;
      for (var form of forms) {
        if (form.querySelector('input[name="deleted"]')) {
          deletedForm = form;
          break;
        }
      }
      if (deletedForm) {
        document.body.appendChild(deletedForm);
        setTimeout(function() {
          deletedForm.querySelector('input[type="submit"]').click();
        }, 0);
        localStorage.setItem('deleted-comments-reveal-cid', window.location.href.match(/.*cid=(\d+)/)[1]);
        return;
      }
    });
  }
  
  // restore links on thread pages
  var comments = document.querySelectorAll('#comments article.msg');
  if (comments) {
    for (var comment of comments) {
      if (comment.id) {
        var id = comment.id.match(/comment-(\d+)/)[1];
        var replyLinks = comment.querySelectorAll('.reply a');
        if (replyLinks && replyLinks.length) {
          for (var link of replyLinks) {
            if (link.innerHTML.trim() === 'Ссылка') {
              link.innerHTML = '#' + id;
              break;
            }
          }
        } else {
          replyBlock = document.createElement('div');
          replyBlock.className = 'reply';
          var link = document.createElement('a');
          link.innerHTML = '#' + id;
          link.href = location.href + '#' + id;
          replyBlock.appendChild(link);
          comment.querySelector('.msg_body').appendChild(replyBlock);
        }
      }
    }
  }
  
  // jump to the deleted comment
  
  // pop once so the re-anchoring never repeats
  var cid = localStorage.getItem('deleted-comments-reveal-cid');
  localStorage.removeItem('deleted-comments-reveal-cid');
  
  if (cid) {
    location.href += '#comment-' + cid;
  }
});

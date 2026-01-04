// ==UserScript==
// @name        BitbucketServer_FirstParentsOnly
// @namespace   http://max630.net
// @include     https://example.com/projects/FOO/repos/BAR/commits*
// @version     1.0.1
// @grant       none
// @run-at      document-idle
// @locale      en-US
// @description Emulate --first-parent in Bitbucket Server's commit list
// @downloadURL https://update.greasyfork.org/scripts/30474/BitbucketServer_FirstParentsOnly.user.js
// @updateURL https://update.greasyfork.org/scripts/30474/BitbucketServer_FirstParentsOnly.meta.js
// ==/UserScript==

// jshint esversion: 6

function HandleContent() {
  while (window.rc_last.nextElementSibling !== null) {
    var rc_next = window.rc_last.nextElementSibling;
    console.log('tag name: ' + rc_next.tagName);
    while (rc_next !== null && rc_next.tagName.toLowerCase() != 'tr') { rc_next = rc_next.nextElementSibling; }
    var commit_data = JSON.parse(rc_next.getAttribute('data-commit-json'));
    if (window.rc_waitParent !== '' && window.rc_waitParent != commit_data.id) {
      console.log('drop: ' + commit_data.id);
      window.rc_tbody.removeChild(rc_next);
    } else {
      window.rc_last = rc_next;
      window.rc_waitParent = commit_data.parents[0].id;
      console.log('next parent: ' + window.rc_waitParent);
    }
  }
}

var rc_trs = document.getElementsByTagName('tr');
console.log('size: ' + rc_trs.length);
for (let el of rc_trs[Symbol.iterator]()) {
  console.log('commit ' + el.classList);
  if (el.classList.contains('commit-row')) {
    window.rc_tbody = el.parentNode;
    console.log('rc_body ' + el.parentNode.innerHTML);
    break;
  }
}
window.rc_waitParent = '';
window.rc_last = window.rc_tbody.firstElementChild;
HandleContent();
window.rc_updateHandler = (()=> {
  var obj = {};
  obj.triggerUpdate = () => {
    if(obj.triggered) {
      obj.observer.disconnect();
    }

    obj.triggered = true;
    obj.observer.disconnect();
    window.setTimeout(() => { obj.runUpdate(); });
  };
  obj.runUpdate = () => {
    obj.observer.disconnect();
    HandleContent();
    obj.triggered = false;
    obj.observer.observe(window.rc_tbody, { childList: true });
  };
  obj.observer = new MutationObserver(() => { obj.triggerUpdate(); });
  obj.triggered = false;
  obj.observer.observe(window.rc_tbody, { childList: true });
})();
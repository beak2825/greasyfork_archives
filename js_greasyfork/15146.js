// ==UserScript==
// @name        Widen Code Container (GitHub)
// @namespace   https://github.com/chriskim06/userscripts
// @description Adds a button to allow you to widen the container when viewing unified diffs
// @match       https://github.com/*/*/commit/*
// @match       https://github.com/*/*/pull/*/files*
// @version     1.4.4
// @downloadURL https://update.greasyfork.org/scripts/15146/Widen%20Code%20Container%20%28GitHub%29.user.js
// @updateURL https://update.greasyfork.org/scripts/15146/Widen%20Code%20Container%20%28GitHub%29.meta.js
// ==/UserScript==

(function() {

  // Create button to widen container and add it next to an element
  function addButton(id, float) {
    var s = document.querySelector('#' + id + ' .refined-github-toggle-whitespace');
    if (s) {
      var btn = document.createElement('div');
      btn.setAttribute('class', (float) ? 'diffbar-item float-right' : 'diffbar-item');
      var ln = document.createElement('a');
      ln.setAttribute('id', 'code-widen-button');
      ln.setAttribute('class', 'btn btn-sm btn-outline BtnGroup-item tooltipped tooltipped-s');
      ln.setAttribute('aria-label', 'Widen the code container');
      ln.innerText = 'Widen';
      btn.appendChild(ln);
      s.parentNode.insertBefore(btn, s.nextElementSibling);
    }
  }

  // Add the widen button on pull request and commit pages if its not there
  if (!document.querySelector('#code-widen-button') && document.querySelector('meta[name="diff-view"]').content === 'unified') {
    if (location.href.match(/^https:\/\/github\.com\/.+\/.+\/pull\/[\d]+\/files/)) {
      addButton('files_bucket', false);
    } else if (location.href.match(/^https:\/\/github\.com\/.+\/.+\/commit/)) {
      addButton('toc', true);
    }

    // Add listener on newly added button if it exists
    var widenBtn = document.querySelector('#code-widen-button');
    if (widenBtn) {
      widenBtn.addEventListener('click', function(e) {
        e.preventDefault();
        var container = document.querySelector('.container.new-discussion-timeline.experiment-repo-nav');
        var wide = Math.floor(window.innerWidth * 0.95);
        var wasNormal = container.offsetWidth < wide;
        container.style.width = ((wasNormal) ? wide : Math.floor(window.innerWidth * 0.68)) + 'px';
        this.setAttribute('aria-label', (wasNormal) ? 'Return to normal width' : 'Widen the code container');
        this.innerText = (wasNormal) ? 'Normal' : 'Widen';
      });
    }
  }

})();


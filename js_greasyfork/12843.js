// ==UserScript==
// @name        Fold All Gone Kickstarter Rewards
// @namespace   https://github.com/johan
// @version     1.0
// @description Fold all no-longer-available rewards at Kickstarter by default. (Click to unfold or refold again.)
// @match       https://www.kickstarter.com/projects/*
// @downloadURL https://update.greasyfork.org/scripts/12843/Fold%20All%20Gone%20Kickstarter%20Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/12843/Fold%20All%20Gone%20Kickstarter%20Rewards.meta.js
// ==/UserScript==

var gone = Array.from(document.querySelectorAll('.reward--all-gone'));

function toggle(me) {
  var on = me.style.display !== 'none';
  me.style.display = on ? 'none' : '';
}

function toggleAll() {
  gone.forEach(toggle);
}

var first = gone[0];
if (first) {
  var parent = first.parentNode;
  var folded = first.cloneNode();
  var rewards = [];
  gone.forEach((li) => {
    var amt = li.querySelector('.reward__pledge-amount');
    if (amt && (amt = (amt.firstChild.textContent.match(/Pledge (\S+)+/)||[])[1]))
      rewards.push(amt);
  });
  folded.innerHTML = '<div class="reward__info"><div class="reward__backer-count">'
  + '<span class="ksr-icon__backer-badge"></span> Folded Gone Tiers: ' + gone.length
  + '<span class="reward__limit reward__limit--all-gone">Toggle</span>'
  + '</div></div>';
  parent.insertBefore(folded, first);
  toggleAll();
  gone.push(folded);
  gone.forEach((n) => {
    n.addEventListener('click', toggleAll);
    n.style.cursor = 'pointer';
    n.title = 'toggle';
  });
  folded.title = 'Folded tiers:' + rewards.join(', ');
}

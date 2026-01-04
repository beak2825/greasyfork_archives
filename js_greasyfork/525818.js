// ==UserScript==
// @name        HN SuperCompact UI
// @match       https://news.ycombinator.com/*
// @grant       none
// @version     1.14
// @author      hncompact
// @description Makes the HN UI even more compact than it is now.
// @license     MIT
// @run-at      document-end
// @namespace https://greasyfork.org/users/1430513
// @downloadURL https://update.greasyfork.org/scripts/525818/HN%20SuperCompact%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/525818/HN%20SuperCompact%20UI.meta.js
// ==/UserScript==

let POSTS_CSS = `
  <style>
  .votelinks a { display:none }
  tr.submission a b { font-weight:normal; color:#f60; }
  tr.submission .votelinks { min-width:0 }
  tr.submission .votelinks center { min-width:1em }
  tr.submission.local .votelinks center::before { content:'*'; color:#6f0; }
  tr.submission + tr { display:none }
  tr.submission td:not(:last-child) { font-size:8pt; line-height:14pt; white-space:nowrap; text-align:right; vertical-align:top; }
  tr.submission td:first-child a:hover { text-decoration:underline }
  tr.submission .titleline .sitebit { display:none }
  </style>
`;

let COMMS_CSS = `
  <style>
  tr.comtr .votelinks center font { display:none }
  tr.comtr .votelinks center { min-width:1em }
  tr.comtr .votelinks a { display:none }
  tr.comtr .reply a.downvote { display:none }
  tr.comtr .reply .expand:not(:empty) { margin-right:0.5em }
  tr.comtr .reply .expand { cursor:pointer; color:#fff; }
  tr.comtr .reply .expand b { font-weight:normal; color:#f60; }
  tr.comtr .reply .expand i { font-style:normal; color:#6f0; }
  tr.comtr:not(.coll) .reply * { font-size:8pt }
  tr.comtr:not(.coll) .reply > p > *:not(.expand) { opacity:0.5 }
  tr.comtr.recent .votelinks center::before { content:'*'; color:#6f0 !important; }
  tr.comtr .default > *:not(.comment) { display:none }
  tr.comtr .reply a { color:#444 }
  tr.comtr .reply .age a { text-decoration:none }
  tr.comtr a.hnuser { text-decoration:none }
  tr.comtr .navs *:not(.togg) { display:none }
  tr.comtr.coll .comment.noshow { display:inherit }
  tr.comtr.coll .comment.noshow .commtext { display:none }
  tr.comtr.coll .comment.noshow .reply > p > *:not(.comhead) { display:none }
  /* tr.compact .reply { display:none } */
  </style>
`;

let $ = (s) => document.querySelector(s);
let $$ = (s) => document.querySelectorAll(s);

if ($$('tr.submission').length > 0)
  init();
else
  document.addEventListener("DOMContentLoaded", init);

function init() {
  switch (location.pathname) {
    case '/':
    case '/news':
      document.head.insertAdjacentHTML('beforeend', POSTS_CSS);
      initPosts();
      break;
    case '/item':
      document.head.insertAdjacentHTML('beforeend', COMMS_CSS);
      initComments();
      break;
  }
}

function initPosts() {
  for (let tr of $$('tr.submission')) {
    //console.debug('tr.id=' + tr.id);
    let tr2 = tr.nextElementSibling;
    let subtext = tr2.textContent.trim();
    let [,comms='0'] = subtext.match(/(\d+)\scomments/)||[];
    let [,score='0'] = subtext.match(/(\d+)\spoints/)||[];
    let [,time='0', units=''] = subtext.match(/(\d+)\s(\w+)\sago/)||[];
    let td1 = tr.children[0];
    td1.className = '';
    td1.textContent = '';

    let bcomms = document.createElement('b');
    bcomms.textContent = comms;

    let link = tr2.querySelector('a:last-child');
    link.remove();
    link.textContent = '';
    link.append(score, ':', bcomms);
    td1.append(link);

    //let span = document.createElement('span');
    //span.className = 'comhead';
    //span.append(' ', time, units[0]||'');
    //tr.querySelector('.titleline').append(span);

    for (let a of tr.querySelectorAll('.votelinks a'))
      a.remove();

    if (units.match(/minute/))
      tr.classList.add('recent');

    if (!tr.querySelector('.sitebit'))
      tr.classList.add('local');
  }
}

function initComments() {
  let postId = new URLSearchParams(location.search).get('id');
  let lastVisit = +localStorage.getItem('lastseen' + postId);
  localStorage.setItem('lastseen' + postId, Date.now()/1000|0);

  for (let tr of $$('tr.comtr')) {
    let ind = tr.querySelector('.ind');
    let d = +ind.getAttribute('indent') || 0;
    tr.setAttribute('d', d);

    //console.debug('tr.id=' + tr.id);
    let reply = tr.querySelector('.reply > p');
    if (!reply) continue;

    for (let a of tr.querySelectorAll('.votelinks a')) {
      let va = a.querySelector('.votearrow');
      let type = va ? va.getAttribute('title') : '';
      a.textContent = type;
      a.classList.add(type);
      a.remove();
      reply.append(a, ' ');
    }

    let comhead = tr.querySelector('.comhead');
    comhead.remove();
    reply.append(comhead);

    let age = reply.querySelector('.age');
    if (age) {
      let title = age.getAttribute('title');
      let time = +title?.split(' ')[1];
      //age.querySelector('a').textContent = time + units[0];
      if (lastVisit > 0 && time > 0 && time > lastVisit)
        tr.classList.add('recent');
    }

    let navs = comhead.querySelector('.navs');
    for (let node of navs ? navs.childNodes : [])
      if (node.nodeName == '#text')
        node.remove();

    let collapse = navs && navs.querySelector('a.togg');
    if (collapse && collapse.textContent.match(/^\[.\]$/))
      collapse.textContent = '[ - ]';

    let counter = document.createElement('u');
    counter.classList.add('expand');
    reply.prepend(counter);
  }

  $('.comment-tree').addEventListener('click', e => {
    let exp = e.target.closest('.expand');
    if (!exp) return;
    let tr = exp.closest('tr.comtr');
    toggleComment(tr);
  });

  // update comment counters
  let stack = [$('tr.comtr')];
  while (stack[0]) {
    let tr = stack[stack.length-1];
    tr.imm = tr.imm || 0;
    tr.tot = tr.tot || 0;
    tr.new = tr.new || 0;
    let tr2 = tr.nextElementSibling;
    if (!tr2) break;
    let d = +tr.getAttribute('d') || 0;
    let d2 = tr2 ? +tr2.getAttribute('d') : -1;

    if (d2 <= d) {
      let tr0;
      do {
        let tr = stack.pop();
        let exp = tr.querySelector('u.expand');
        exp.textContent = '';
        if (tr.tot > 0) {
          let b = document.createElement('b');
          b.textContent = tr.imm;
          exp.append(tr.tot, ':', b);
          if (tr.new > 0) {
            let i = document.createElement('i');
            i.textContent = tr.new;
            exp.append(':', i);
          }
        }

        tr0 = stack[stack.length-1];
        // tr0 is the parent of tr
        if (tr0) {
          tr0.tot += tr.tot + 1;
          tr0.imm += +tr0.getAttribute('d') + 1 == +tr.getAttribute('d');
          tr0.new += tr.new + tr.classList.contains('recent');
        }
      } while (tr0 && d2 <= tr0.getAttribute('d'));
    }

    stack.push(tr2);
  }

  for (let tr of $$('.comment-tree tr.comtr[d="0"]'))
    toggleComment(tr);
}

function toggleComment(tr) {
  let d = +tr.getAttribute('d') || 0;
  let is_compact = tr.classList.toggle('compact');
  let tr2 = tr.nextElementSibling;

  while (tr2 && tr2.getAttribute('d') > d) {
    let d2 = +tr2.getAttribute('d');
    let hide = is_compact || d2 >= d + 2;
    //console.debug('tr#' + tr2.id, 'd=' + d2);
    tr2.classList.toggle('compact', !hide);
    tr2.classList.toggle('noshow', hide);
    tr2 = tr2.nextElementSibling;
  }
}

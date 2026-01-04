// ==UserScript==
// @name        Show script size on Greasy Fork
// @description Add script size info to search page
// @version     0.1
// @namespace   https://github.com/mentha
// @match       https://greasyfork.org/*/scripts/*
// @license     CC0
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/478498/Show%20script%20size%20on%20Greasy%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/478498/Show%20script%20size%20on%20Greasy%20Fork.meta.js
// ==/UserScript==

function get_size_from_doc(doc) {
  let t = doc.querySelector('#script-content .code-container pre').innerText;
  return {
    lines: t.split('\n').length,
    chars: t.length,
  };
}

function handle_code_page() {
  let s = get_size_from_doc(document);
  let e = document.createElement('span');
  e.innerText = `Lines: ${s.lines}, Characters: ${s.chars}`;
  document.querySelector('#install-area').appendChild(e);
}

function search_add_size_stats(li) {
  let sid = li.getAttribute('data-script-id');
  let sver = li.getAttribute('data-script-version');
  let codeurl = li.querySelector('a.script-link').href + '/code';

  let stats = li.querySelector('.inline-script-stats')
  let e = document.createElement('dt');
  e.innerText = 'Lines';
  stats.appendChild(e);
  let s_lines = document.createElement('dd');
  s_lines.innerHTML = '<button>Query</button>';
  stats.appendChild(s_lines);
  e = document.createElement('dt');
  e.innerText = 'Characters';
  stats.appendChild(e);
  let s_chars = document.createElement('dd');
  s_chars.innerHTML = '<button>Query</button>';
  stats.appendChild(s_chars);

  let s = GM_getValue(sid);
  if (s && s.version == sver) {
    s_lines.innerText = s.lines;
    s_chars.innerText = s.chars;
    return;
  }

  let startquery = (async () => {
    s_lines.innerText = '...';
    s_chars.innerText = '...';
    let resp = await fetch(codeurl);
    let rbody = await resp.text();
    let parser = new DOMParser();
    let doc = parser.parseFromString(rbody, resp.headers.get('content-type').split(';')[0]);
    let s = get_size_from_doc(doc);
    s.version = sver;
    GM_setValue(sid, s);
    s_lines.innerText = s.lines;
    s_chars.innerText = s.chars;
  });

  s_lines.children[0].onclick = startquery;
  s_chars.children[0].onclick = startquery;
}

function handle_other() {
  let ol = document.querySelector('#browse-script-list');
  if (!ol)
    return;
  for (let li of ol.children) {
    if (!li.getAttribute('data-script-id'))
      continue;
    search_add_size_stats(li);
  }
}

function main() {
  if (document.location.pathname.endsWith('/code'))
    handle_code_page();
  else
    handle_other();
}

main()
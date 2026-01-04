// ==UserScript==
// @name         Super-phrase - automatic "phrase search" on DuckDuckGo.
// @namespace    https://github.com/josefandersson/userscripts/
// @version      1.2
// @description  Adds a verbatim tick-box to the DuckDuckGo search bar.
//               When ticked, anything typed in the box is auto-wrapped 
//               in quote marks and thus "searched as a phrase".
//		 Works on main home-page only. Use to form your initial phrase,
//               then you add additional search keywords and knock-outs in the 
//               search-box on the results page.
// @author       Josef Andersson, under paid contract to myself.
// @author       Working regex for "phrase wrapping" then supplied to me by 
//               Fechinsir on Fivver, again under paid contract to myself.
// @match        https://duckduckgo.com/*

// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/411090/Super-phrase%20-%20automatic%20%22phrase%20search%22%20on%20DuckDuckGo.user.js
// @updateURL https://update.greasyfork.org/scripts/411090/Super-phrase%20-%20automatic%20%22phrase%20search%22%20on%20DuckDuckGo.meta.js
// ==/UserScript==

if (location.pathname === '/') {
    const test = document.getElementById('content_homepage');
    if (test == null) {
        return;
    }

    let form = document.getElementById('search_form_homepage');
    let input = form.querySelector('input');

    form.addEventListener('submit', ev => {
        if (localStorage.getItem('forceVerbatim') === 'true') {
            input.value = input.value.replace(/(^.*$)/g, '"$1"');
        }
    }, {
        capture: true
    });

    const div = document.createElement('div');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    label.innerText = 'Verbatim';
    label.htmlFor = 'forceVerbatim'
    checkbox.id = 'forceVerbatim';
    checkbox.type = 'checkbox';
    checkbox.checked = localStorage.getItem('forceVerbatim') === 'true';
    div.appendChild(label);
    div.appendChild(checkbox);
    Object.assign(div.style, { margin:'-30px -3px 0 0', color:'#888', fontSize:'.8em', textAlign:'right' });
    Object.assign(checkbox.style, {})

    form.parentElement.insertBefore(div, form);

    checkbox.addEventListener('change', _ => {
        localStorage.setItem('forceVerbatim', checkbox.checked);
    });
}
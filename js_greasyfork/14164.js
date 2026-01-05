// ==UserScript==
// @name          kinozal.tv: remove external scripts
// @description   Remove external scripts (ads/tracking) on kinozal.tv
// @version       2.0
// @author        wOxxOm
// @namespace     https://greasyfork.org/users/2159-woxxom
// @license       MIT License
// @match         http://kinozal.tv/*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/14164/kinozaltv%3A%20remove%20external%20scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/14164/kinozaltv%3A%20remove%20external%20scripts.meta.js
// ==/UserScript==

stop();

(function overwrite(link) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', link.href);
  xhr.onload = () => {
    var html = xhr.responseText
      .replace(/<script\b[\s\S]*?<\/script>/g, s => {
        if (s.includes('fromCharCode') ||
            s.includes('iframe') ||
            s.includes('document.write') ||
            s.includes('document.createElement("script")') ||
            s.includes("document.createElement('script')") ||
            /^[^>]+?src=['"][^'"/]*\/\//.test(s)) {
          // console.debug(GM_info.script.name + ': ' + s);
          return '';
        } else {
          return s;
        }
      })
      .replace(/<(object|iframe)\s[\s\S]*?<\/\1>/g, ''); // strip swfs
    document.open();
    document.write(html);
    document.close();

    document.querySelector('[id*="ScriptRoot"]').parentNode.remove();

    if (link.nodeName)
      history.pushState(0, document.title, link.href);

    var prevUrl = location.href;
    window.addEventListener('popstate', e => {
      if (!prevUrl.includes('#') && !location.href.includes('#'))
        overwrite(location);
    });

    window.addEventListener('click', e => {
      var a = e.target.closest('a');
      if (a && !a.onclick && a.hostname == location.hostname) {
        e.preventDefault();
        overwrite(a);
      }
    });
  };
  xhr.send();
})(location);

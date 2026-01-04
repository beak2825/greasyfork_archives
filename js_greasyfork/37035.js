// ==UserScript==
// @name        GreasyFork script icon - Dinofied for @iconURL
// @namespace   wOxxOm.scripts
// @description On a script info page it shows its icon from the script meta block
// @icon        https://icons.iconarchive.com/icons/custom-icon-design/mono-general-1/64/information-icon.png
// @version     1.1.2
// @author      wOxxOm
// @include     /^https://greasyfork\.org/(.*?/)?scripts/\d+.*$/
// @run-at      document-start
// @connect-src *
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/37035/GreasyFork%20script%20icon%20-%20Dinofied%20for%20%40iconURL.user.js
// @updateURL https://update.greasyfork.org/scripts/37035/GreasyFork%20script%20icon%20-%20Dinofied%20for%20%40iconURL.meta.js
// ==/UserScript==

var scriptID = location.href.match(/scripts\/(\d+)/)[1];
var iconsrc = GM_getValue(scriptID);

if (iconsrc && iconsrc.match(/^data:image|https:/))
  addIcon();
else {
  GM_xmlhttpRequest({
    method: 'GET',
    url: location.href.replace(/(scripts\/\d+[^/]+)(\/.*)?$/,'$1/code/1.user.js'),
    timeout: 10000,
    onload: function (r) {
      var m = r.responseText.match(/\n\s*\/\/\s+@iconURL\s+(https?)(:\/\/.*?)[\s\r\n]/);
      var m = r.responseText.match(/\n\s*\/\/\s+@icon\s+(https?)(:\/\/.*?)[\s\r\n]/);
      if (!m)
        return;

      if (m[1] == 'https')
        return addIcon(m[1]+m[2]);

      // download http icon and store it in script db if it's small
      GM_xmlhttpRequest({
        method: 'GET',
        url: m[1]+m[2],
        timeout: 10000,
        headers: {'Accept':'image/png,image/*;q=0.8,*/*;q=0.5'},
        overrideMimeType: 'text\/plain; charset=x-user-defined',
        onload: function(ri) {
          var rb = ri.response, rbl = rb.length;
          if (rbl > 100000) {
            console.log('Script icon exceeds 100k, ignoring');
            return;
          }

          var ext = ri.finalUrl.substr(ri.finalUrl.lastIndexOf('.')+1).toLowerCase();
          var mime = ['png','bmp','gif'].indexOf(ext) >= 0 ? ext : ext.match(/'^jpe?g?/) ? 'jpeg' : ext=='ico' ? 'x-icon' : null;
          if (!mime)
            return;

          var rb8 = new Uint8Array(rbl)
          for (var i=0; i<rbl; i++)
            rb8[i] = rb.charCodeAt(i);
          var rbs = String.fromCharCode.apply(null, rb8);

          addIcon('data:image/' + mime + ';base64,' + btoa(rbs));
        }
      });
    }
  });
}

function addIcon(url) {
  if (url)
    iconsrc = url;

  var h2 = document.querySelector('#script-info header h2');
  h2 ? __add(h2) : __wait();

  function __add(h2) {
    if (!h2)
      if (!(h2 = document.querySelector('#script-info header h2')))
        return;

    h2.insertAdjacentHTML('afterbegin','<div style="\
        position: absolute;\
        width: 80px;\
        margin-left: calc(-80px - 1ex);\
        display: inline-block;\
        text-align: right"></div>')
    var img = h2.firstChild.appendChild(document.createElement('img'));
    img.style.maxWidth = img.style.maxHeight = '64px';
    img.style.width = img.style.height = 'auto';
    img.src = iconsrc;

    GM_setValue(scriptID, iconsrc);
  }

  function __wait() {
    var ob = new MutationObserver(function(mutations){
      for (var i=0, ml=mutations.length, m; (i<ml) && (m=mutations[i]); i++) {
        if (m.target.localName == 'h2') {
          __add();
          ob.disconnect();
          return;
        }
      }
    });
    ob.observe(document, {subtree:true, childList:true});
  }
}
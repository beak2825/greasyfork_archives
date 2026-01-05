// ==UserScript==
// @name           CC-chotkiy chatec
// @name:ru        ЧЧ-чоткий чатец
// @namespace      Reshpekt Fund Russia
// @author         Reshpekt Fund Russia
// @description    Beautify it!
// @description:ru Наводим красотень!
// @version        0.9
// @include        http://чаттрейдеров.рф/chat*
// @include        http://xn--80aefdbw1bleoa1d.xn--p1ai/chat*
// @grant          none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/19016/CC-chotkiy%20chatec.user.js
// @updateURL https://update.greasyfork.org/scripts/19016/CC-chotkiy%20chatec.meta.js
// ==/UserScript==

(function () {

    var st = '.time{cursor:pointer;}';

    (function (st) {
        try {
            var h = document.getElementsByTagName('head')[0],
                s = document.createElement('style');
            s.type = 'text/css';
            h.appendChild(s);
            s.innerHTML = st;
        } catch (e) {
            if (!document.styleSheets.length) {
                document.createStyleSheet();
            }
            document.styleSheets[0].cssText += st;
        }
    })(st);

    function F(x) {
        var name = x.querySelector('span.user-nickname'),
            time = x.querySelector('span.time'),
            text = x.querySelector('span.body');

        if (current_username) {
            if (name.textContent.replace(/^\s*|\s*$|/g, '') == 'Вы') name.textContent = current_username;
            if (text.textContent.search('@' + current_username) != -1) {
                text.style.cssText = 'background-color:#DFE8FF !important;';
            }
        }
        switch (name.textContent.replace(/^\s*|\s*$|/g, '')) {
            case 'Lawyer':    name.style.cssText = 'color:red'; break;
            case 'Blanch':    name.style.cssText = 'color:green'; break;
            case 'ator':      name.style.cssText = 'color:mediumblue'; break;
            case 'kaa':       name.style.cssText = 'color:red'; break;
            case 'RFR':       name.style.cssText = 'color:navy'; break;
            case 'ktototam':  name.style.cssText = 'color:navy'; break;
            case 'Korax':     name.style.cssText = 'color:maroon'; break;
            case 'KPAX2017':  name.style.cssText = 'color:steelblue'; break;
            case 'КРАХ2018':  name.style.cssText = 'color:steelblue'; break;
            case 'Papay':     name.style.cssText = 'color:#660066'; break;
            case 'sgl':       name.style.cssText = 'color:darkgreen'; break;
            default:          name.style.cssText = 'color:#333';
        }

        time.onclick = function () {
            var t = document.querySelector('#chat-textarea');
            t.focus();
            t.value = '(' + time.getAttribute('data-original-title').replace(' ', ', ').split(' ')[1] + ') @' + name.textContent.replace(/^\s*|\s*$|/g, '') + '> ';
        }
    }
    
    var t = document.querySelector('ul.chat-body');

    if (t) {
      var observer = new MutationObserver(function(mutations) {
          mutations.forEach(function(mutation) {
              for (var i = 0; i < mutation.addedNodes.length; i++){
                  if (mutation.addedNodes[i].nodeType == 1) {
                      F(mutation.addedNodes[i]);
                  }
              }
          });
      });
      observer.observe(t, {childList: true, subtree: true});
    }

})();
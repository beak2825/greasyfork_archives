// ==UserScript==
// @name         Bilibili番剧订阅入口
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在用户菜单中添加番剧订阅快速入口
// @author       落地开花(823691221@qq.com)
// @match        *.bilibili.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/368231/Bilibili%E7%95%AA%E5%89%A7%E8%AE%A2%E9%98%85%E5%85%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/368231/Bilibili%E7%95%AA%E5%89%A7%E8%AE%A2%E9%98%85%E5%85%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function(window) {
  'use strict';
  if (!window) {
    return;
  }

  var bangumiIconNor = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB70lEQVQ4T6WSP2hTURTGv3NfGyyKgyI4uFjpIg4OIkEFFx2L0kGc6uSfvJeAj7zEviTgkj/lNa8VXt6rZHDQSYIIRRwEoUMH7eIiiKAOQXEodukQg7nnSCIpsaQl4h3vOd/vfue7h/Cfhwb1qUzhBLM+J0STiuh9baH0rFu/nXZPjhEuCeiQAq/WqvOrfV0fQJaTawC4IoJ1AEyEuAjegEQgiBPRc4E0AUoSsKLaW7NBELR7ACvjJkQw0+nQbP1B+Xv3LmHPTZKhXpBIh1muLi/Nf+m5yRSmDNYvAXoV+WWLbNueaKuJJjOdfrhU+jZKJHfs/FmleO2noQ+Tmc5fIOJqWK3ERxH3e6x07i0T5ymRcS8qhhP6lel/AZhObgXENXIcZ39LYp9bRmfqkedtjQghy3Gbvww+1QvRdNw6gTbDanluFICZztmAHI38yr0e4I+L8XUIReFiOdwL0ssMHLUMfb7reHuRUtnsMa3H3hEkCv3K/WGQZDZ/RjQ/UYa+HHje127PkE3k1wJZ22h+utFoNHQfZDruTRLcZcOYWfaKH3du4vaDqZR7RMfoKSAHhOW6jsmP8Y56DMJB1ca1IKhsDLr7y8FgIZnO3xLiooA2ldBizS/Vh421K6DbnHQKx1lhX+QVP+wW7J6AUb70N3DZzQXzYYFeAAAAAElFTkSuQmCC',
    bangumiIconSel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB9UlEQVQ4T6WSP2gUQRTGvze3ay65kODtKhY2RhZDnAQLkaCCjTaCKCmCoLldFQWJhYIQwcLGUqz0ihS6t8ZCRYQgFoKQwkLTSLw9owQtTsXC3YOgGA9358necXLBJKw41fD+/ObN9z7Cfx5q7+91y1s1gd3Eok8x+zVHPkzy+anKAEVqPxHyUJgJTgzOtPqaAGYySpUHID4MYJZAisHDBHoBBjfveKQIVcF0DuDpYGO2gINWvQEw3PJZEEZIZArB2MCXJNZ793WfFonHYI4inY8sHhv6kMR7br+x1gn1hIGnoS3HCfc/dppLi1WGviO0t31OI4lR8neB+TnFukHrvcpewXwttOVwmuZWjVHyXwLiMpne/D5wfDGw5aF/Arj+NINvELy5nKnEe8S6FZzq/5YKkoju+VXV2SUbIpolf5KBWmjLS2kAede/QMCm0JETzTV6czlDZWYBFENH3lwL0tBMqSLF+p5k4j9Gyk8tbBZx/RUYxcCRV1aCmF55JyvcYS17oHbc+pTU/O1EomfJisIuaWOU4hYo7/mnSeE8ZbSRYKz/3XIntj3XfWthQ0emfg+M7khXR4WeC8WPJY+Anp+qY/T7Setr+3TLJmhPmG7lDKCuMqFGLK4HzvbJlb61KqBhZ+/tFg2/smFhcH41YdcEpFnpb88kv+dbn/88AAAAAElFTkSuQmCC',
    on = function(event, cb) {
      if (this.attachEvent) {
        this.attachEvent('on' + event, cb);
      } else {
        this.addEventListener(event, cb, true);
      }
    },
    off = function(event, cb) {
      if (this.detachEvent) {
        this.detachEvent('on' + event, cb);
      } else {
        this.removeEventListener(event, cb, true);
      }
    },
    createStyleNode = function(document, cssText) {
      var head = document.getElementsByTagName('head')[0],
        style = document.createElement('style');
      style.type = 'text/css';
      if (style.styleSheet) {
        style.styleSheet.cssText = cssText;
      } else {
        style.appendChild(document.createTextNode(cssText));
      }
      head.appendChild(style);
    },
    findIDFromCookie = function(document) {
      var cookies = document.cookie;
      return cookies.match(/DedeUserID=(\d+)/)[1];
    },
    findProfileInfo = function(document) {
      var els = document.getElementsByClassName('nav-item profile-info');
      if (els.length > 0) {
        return els[0];
      }
      return null;
    },
    insertBangumiItem = function(window, anchor) {
      var document = window.document,
        nodeInsertCallback = function(e) {
          e.preventDefault();
          off.call(anchor, 'DOMNodeInserted', nodeInsertCallback);

          var userId = findIDFromCookie(document),
            aLink = document.createElement('a'),
            aIcon = document.createElement('i'),
            aText = document.createTextNode('番剧订阅'),
            liNodes = anchor.getElementsByTagName('li'),
            liNodesLen = liNodes.length;

          aIcon.className = 'bili-icon b-icon-p-member bili-icon-bangumi-subscription';

          aLink.setAttribute('target', '_blank');
          aLink.setAttribute('href', '//space.bilibili.com/' + userId + '/bangumi');
          aLink.appendChild(aIcon);
          aLink.appendChild(aText);

          if (liNodesLen > 0) {
            liNodes[liNodesLen - 1].appendChild(aLink);
          }
        }

      on.call(anchor, 'DOMNodeInserted', nodeInsertCallback);
    },
    init = function(window) {
      var document = window.document,
        profileInfo = findProfileInfo(document),
        cssText = '.bili-header-m .profile-m .member-menu li a .bili-icon-bangumi-subscription { background-image: url(' + bangumiIconNor + '); background-position: 0 0 !important; } .bili-header-m .profile-m .member-menu li a:hover .bili-icon-bangumi-subscription { background-image: url(' + bangumiIconSel + '); }';

      createStyleNode(document, cssText);

      if (profileInfo !== null) {
        insertBangumiItem(window, profileInfo);
      } else {
        setTimeout(init, 200, window);
      }
    },
    onLoadCallback = function() {
      init(window);
    };

  on.call(window, 'load', onLoadCallback);

})(window);

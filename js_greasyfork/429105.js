// ==UserScript==
// @name  百度网盘无障碍优化
// @namespace    https://accjs.org/
// @version      0.1
// @description  百度网盘无障碍优化脚本
// @description  alt加x切换文件，alt加z切换返回、上传、对话框等
// @author  杨永全
// @match  https://pan.baidu.com/*
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/429105/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%97%A0%E9%9A%9C%E7%A2%8D%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429105/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E6%97%A0%E9%9A%9C%E7%A2%8D%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
cproc();
acmo(cproc);
aamo(aproc);

document.addEventListener('keydown', function(e) {
let t = e.target || null;
let xSelector = '.accjs-check-all, .file-name .text a';
let xKey = e.keyCode == 88;
let zSelector = 'a[node-type="upload"], a[data-deep="-1"], .dialog, .context-menu';
let zKey = e.keyCode == 90;
        if (e.altKey && e.shiftKey && xKey) {
          e.preventDefault();
          previousFocus(xSelector);
        } else if (e.altKey && xKey) {
          e.preventDefault();
          nextFocus(xSelector);
        } else         if (e.altKey && e.shiftKey && zKey) {
          e.preventDefault();
          previousFocus(zSelector);
        } else if (e.altKey && zKey) {
          e.preventDefault();
          nextFocus(zSelector);
        } else if(e.keyCode == 32 || e.keyCode == 13) {
if(t.matches('.accjs-click')) {
t.click();
}
}
}, null);

function aproc(records) {
document.querySelectorAll('.accjs-checkbox').forEach(function(el) {
let p = el.parentNode;
let checked = false;
//p.matches('.EzubGg, .drys0wyn, .JS-item-active') || p.classList.contains('g-clearfix') && p.classList.length = 4 || p.classList.length == 3;
if(p.classList.length == 4) {
checked = true;
} else if(p.classList.length == 3 && p.classList.contains('g-clearfix')) {
checked = false;
} else if(p.classList.length == 3) {
checked = true;
}
el.setAttribute('aria-checked', checked);
});
document.querySelectorAll('.treeview-node').forEach(function(el) {
let checked = el.matches('.treeview-node-on');
el.setAttribute('aria-checked', checked);
});
}

function cproc() {
//search input
document.querySelectorAll('input[name="q"]:not(.accjs-has)').forEach(function(el) {
el.setAttribute('aria-label', '搜索关键词');
addClass(el, 'accjs-has');
});

//dialog close button
document.querySelectorAll('.dialog-close:not(.accjs-has)').forEach(function(el) {
el.setAttribute('role', 'button');
el.setAttribute('tabindex', '0');
el.setAttribute('aria-label', '关闭');
addClass(el, 'accjs-has accjs-click');
});

//treview for files
document.querySelectorAll('.treeview-node').forEach(function(el) {
el.setAttribute('tabindex', '0');
el.setAttribute('role', 'checkbox');
let checked = el.matches('.treeview-node-on');
el.setAttribute('aria-checked', checked);
addClass(el, 'accjs-has accjs-click');
});

//check all
document.querySelectorAll('[data-key="name"] > div[node-type], [data-key="server_filename"] > div[node-type]').forEach(function(el) {
el.setAttribute('role', 'checkbox');
el.setAttribute('tabindex', '0');
el.setAttribute('aria-label', '全选');
addClass(el, 'accjs-has accjs-click accjs-checkbox accjs-check-all');
});

//filelist
document.querySelectorAll('dd[_installed]').forEach(function(el) {
let _el = el.querySelector('[node-type]');
if(_el !== null) {
let checked = el.matches('.drys0wyn');
let filename = el.querySelector('a').innerText || '';
_el.setAttribute('role', 'checkbox');
_el.setAttribute('tabindex', '0');
_el.setAttribute('aria-label', filename);
_el.setAttribute('aria-checked', checked);
addClass(_el, 'accjs-has accjs-click accjs-checkbox');
}
});

//context-menu
document.querySelectorAll('.context-menu').forEach(function(el) {
el.setAttribute('aria-label', '上下文菜单');
let mis = el.querySelectorAll('li[data-check-display]');
mis.forEach(function(el) {
el.setAttribute('tabindex', '0');
el.setAttribute('role', 'link');
addClass(el, 'accjs-has accjs-click');
});
if(mis.length > 0) {
mis[0].focus();
}
addClass(el, 'accjs-has');
});

//end cproc function
}


function addClass(el, classes) {
classes.split(' ').forEach(function(className) {
el.classList.add(className);
});
}

  function isVisible(t) {
    return !! (!t.hasAttribute('disabled') && t.getAttribute('aria-hidden') !== 'true' && t.offsetParent !== null);
  }

  function gi(i, len, op) {
    let n = op == '+' ? +1 : -1;
    i = i + n;
    if (i >= len) {
      i = 0;
    }
    if (i < 0) {
      i = len - 1;
    }
    return i;
  }

  function _toFocus(el) {
    let tagName = el.tagName.toLowerCase();
    let tagNames = ['div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'form', 'img', 'nav', 'header', 'main', 'footer', 'section', 'aside'];
    if (tagNames.includes(tagName) || (tagName == 'a' && !el.hasAttribute('href'))) {
      if (!el.hasAttribute('tabindex')) {
        el.setAttribute('tabindex', '-1');
      }
    }
    el.focus();
  }

  function toFocus(focusSelector, op) {
    let els = Array.prototype.slice.call(document.body.querySelectorAll('*'));
    let len = els.length;
    let aeIndex = Math.max(0, els.indexOf(document.activeElement));
    let i = aeIndex == 0 ? 0 : gi(aeIndex, len, op);
    do {
      if (els[i].matches(focusSelector) && isVisible(els[i])) {
        _toFocus(els[i]);
        break;
      }
      i = gi(i, len, op);
    } while ( i != aeIndex );
  }

  function nextFocus(selector) {
    toFocus(selector, '+');
  }

  function previousFocus(selector) {
    toFocus(selector, '-');
  }

function aamo(proc) {
    var mo = new MutationObserver((records) => {
proc(records);
});
    mo.observe(document.body, {
      'attributes': true,
//'attributeOldValue': true,
      'subtree': true,
'attributeFilter': ['class']
    });
return mo;
}

function acmo(proc) {
    let mo = new MutationObserver((records) => {
proc();
});
    mo.observe(document.body, {
      'childList': true,
      'subtree': true
    });
return mo;
}

})();

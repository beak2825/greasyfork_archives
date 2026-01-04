// ==UserScript==
// @name  蓝奏云无障碍优化
// @namespace    https://accjs.org/
// @version      0.1
// @description  蓝奏云无障碍优化脚本
// @author  杨永全
// @updated  2021-11-03 09:28:10
// @match  https://*.woozooo.com/*
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/434900/%E8%93%9D%E5%A5%8F%E4%BA%91%E6%97%A0%E9%9A%9C%E7%A2%8D%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/434900/%E8%93%9D%E5%A5%8F%E4%BA%91%E6%97%A0%E9%9A%9C%E7%A2%8D%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
function amo(proc, target, options) {
target = target || document.body;
options = options || {
      'childList': true,
      'subtree': true
    };
    let mo = new MutationObserver((records) => {proc();});
    mo.observe(target, options);
return mo;
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

//get label from attributes
function getLabel(labels, src) {
let label = '';
if(typeof src != 'string' || src == '') {
return label;
}
label = src;
for(let key in labels) {
if(src.includes(labels[key])) {
label = key;
break;
}
}
return label;
}


function proc() {

//label map
let labels = {
"关闭": "f_cl",
"操作": "f_sela",
"删除": "f_selb",
"启用": "f_pwdon",
"禁用": "f_pwdoff"
};

//开始上传按钮、等待上传的文件列表、当前位置、文件和文件夹名、文件和文件夹的操作链接以及操作菜单、对话框的关闭按钮、移动对话框里选择文件夹
document.querySelectorAll('.uploadBtn, .filelist .title, .filelist .cancel, .f_tp .f_tpspan, .f_name2 .follink, .f_name .aspanlink, .f_sel a, .f_sel .f_view > div, div.f_cl, div.f_midf6').forEach(function(el) {
el.setAttribute('tabindex', '0');
el.setAttribute('role', 'link');
});

//需要添加 label 的元素
document.querySelectorAll('div.f_cl, .f_sel a').forEach(function(el) {
el.setAttribute('aria-label', getLabel(labels, el.getAttribute('class')));
});


//设置密码的开关
document.querySelectorAll('.f_pwdon, .f_pwdoff').forEach(function(el) {
el.setAttribute('role', 'checkbox');
el.setAttribute('aria-checked', 'true');
el.setAttribute('tabindex', '0');
el.setAttribute('aria-label', getLabel(labels, el.getAttribute('class')));
});

//文件浏览按钮在谷歌浏览器的提示不够友好，处理一下
document.querySelectorAll('input[type="file"]').forEach(function(el) {
el.setAttribute('aria-label', '浏览');
});

//页面底部有个上传按钮，看起来没什么用，隐藏掉
document.querySelectorAll('input[id*="html5"]').forEach(function(el) {
el.setAttribute('tabindex', '-1');
el.setAttribute('aria-hidden', 'true');
});

}
document.addEventListener('keydown', function(e) {
let t = e.target || null;
let xSelector = '.f_name a, .f_name2 .follink, .f_name .aspanlink';
let xKey = e.keyCode == 88;
let zSelector = '.uploadBtn, div.f_cl';
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
if(t.matches('[role="checkbox"], [role="button"], [role="link"]')) {
t.click();
}
}
}, null);
amo(proc);
proc();
})();

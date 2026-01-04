// ==UserScript==
// @name  阿里云盘无障碍优化
// @namespace    https://accjs.org/
// @version      0.1
// @description  阿里云盘无障碍优化脚本
// @author  杨永全
// @updated  2021-10-14 15:11:59
// @match  https://www.aliyundrive.com/*
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/425431/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%97%A0%E9%9A%9C%E7%A2%8D%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/425431/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%97%A0%E9%9A%9C%E7%A2%8D%E4%BC%98%E5%8C%96.meta.js
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

function proc() {
/*utils*/
//icon map
let icons = {
"图片": "PDSImage",
"视频": "PDSVideo",
"文件夹": "PDSFolder",
"文档": "PDSDoc",
"音频": "PDSAudio",
"info": "PDSInfo",
"文件": "PDSFile",
"相册": "PDSAlbum",
"保险箱": "PDSVault",
"搜索": "PDSSearch",
"添加": "PDSAdd",
"排序": "PDSSort",
"拖拽": "PDSDrag",
"SquareGrid": "SquareGrid",
"左箭头": "ArrowLeft",
"右箭头": "ArrowRight",
"上箭头": "ArrowUp",
"下箭头": "PDSArrowDown",
"左箭头": "PDSArrowLeftBox",
"右箭头": "PDSArrowRightBox",
"上箭头": "PDSArrowUpBox",
"下箭头": "PDSArrowDownBox",
"箭头": "PDSArrowRULD",
"左三角箭头": "PDSArrowLeftTriangle",
"右三角箭头": "PDSArrowRightTriangle",
"上三角箭头": "PDSArrowUpTriangle",
"下三角箭头": "PDSArrowDownTriangle",
"chevron left": "PDSChevronLeft",
"chevron right": "PDSChevronRight",
"chevron up": "PDSChevronUp",
"chevron down": "PDSChevronDown",
"下载": "DownLoad",
"分享": "Share",
"收藏": "Star",
"喜欢": "PDSLike",
"删除": "Trash",
"编辑": "PDSEditCircle",
"时间": "PDSTime",
"路径": "PDSMappin",
"重命名": "PDSRename",
"pip": "PDSPip",
"快进": "PDSForwardEndFill",
"播放": "PDSPlayCircle",
"sidebar": "PDSSidebar",
"播放": "PlayFill",
"播放列表": "PlayList",
"速度": "Speed",
"重复": "Repeat",
"静音": "volume3",
"取消静音": "volume0",
"已选中": "Checkmark",
"更多": "MoreCircle",
"更多": "More",
"关闭": "CloseCircle",
"关闭": "Close"
};

//get label from icon
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


//storage usage and user info
document.querySelectorAll('[class*="usage-progress"], [class*="user-info-name"]').forEach(function(el) {
el.setAttribute('role', 'text');
el.setAttribute('tabindex', '0');
});

//file list
document.querySelectorAll('div[data-index]').forEach(function(el) {
el.querySelectorAll('[role="checkbox"]').forEach(function(cb) {
cb.setAttribute('tabindex', '0');
cb.setAttribute('aria-label', (el.querySelector('[class*="title"], [class*="text-primary"]').innerText || ''));
});
el.querySelectorAll('[class*="info"], [class*="text-primary"]').forEach(function(el1) {
el1.setAttribute('tabindex', '0');
el1.setAttribute('role', 'link');
});
});

//check all
document.querySelectorAll('div[class*="header-wrapper"] [class*="list-sum"] [role="checkbox"]').forEach(function(el) {
el.setAttribute('tabindex', '0');
el.setAttribute('aria-label', '全选');
});

//icon buttons
document.querySelectorAll('[data-icon-type]').forEach(function(el) {
el.setAttribute('tabindex', '0');
el.setAttribute('role', 'button');
el.setAttribute('aria-label', getLabel(icons, el.getAttribute('data-icon-type')));
//el.setAttribute('aria-label', el.getAttribute('data-icon-type'));
});
//navbar menu
document.querySelectorAll('li[class*="nav-menu-item"]').forEach(function(el) {
el.setAttribute('role','link');
el.setAttribute('tabindex', '0');
el.querySelectorAll('span[data-icon-type]').forEach(function(el1) {
el1.removeAttribute('tabindex');
el1.removeAttribute('role');
el1.setAttribute('aria-hidden', 'true');
});
});

//ant-dropdown-menu-item
document.querySelectorAll('[role="menu"], [role="menuitem"]').forEach(function(el) {
el.removeAttribute('role');
});

document.querySelectorAll('.ant-dropdown-menu-item [class*="menu-inner"]').forEach(function(el) {
if(el.querySelectorAll('[class*="menu-name"], span[role="button"]').length > 0) {
el.querySelectorAll('[class*="menu-name"]').forEach(function(el) {
el.setAttribute('tabindex', '0');
el.setAttribute('role','button');
});
el.querySelectorAll('span[role="button"]').forEach(function(btn) {
btn.setAttribute('aria-label', (el.innerText || (btn.getAttribute('aria-label') || '')));
});
} else {
el.setAttribute('role', 'button');
el.setAttribute('tabindex', '0');
}
});

//primary and secondary button
document.querySelectorAll('[data-type="primary"], [data-type="secondary"]').forEach(function(el) {
el.setAttribute('role', 'button');
el.setAttribute('tabindex', '0');
});

//move
document.querySelectorAll('.ant-modal-body [class*="breadcrumb-item-link"], .ant-modal-body [data-type="folder"], .ant-modal-footer [class*="create"]').forEach(function(el) {
el.setAttribute('tabindex', '0');
el.setAttribute('role', 'button');
});

//create folder button
document.querySelectorAll('[aria-label="已选中"][class*="create-folder-action-icon"]').forEach(function(el) {
el.setAttribute('aria-label', '确定');
});

//tabindex=0 and aria-hidden=true
document.querySelectorAll('[tabindex="0"][aria-hidden="true"]').forEach(function(el) {
el.removeAttribute('tabindex');
});

//for share page
document.querySelectorAll('header [class*="action"] [class*="button-wrapper"]').forEach(function(el) {
el.setAttribute('tabindex', '0');
el.setAttribute('role', 'button');
});
document.querySelectorAll('[data-col-key="name"]').forEach(function(el) {
el.querySelectorAll('[role="checkbox"]').forEach(function(cb) {
cb.setAttribute('tabindex', '0');
cb.setAttribute('aria-label', (el.querySelector('[class*="text-primary"]').innerText || ''));
});
});
}
document.addEventListener('keydown', function(e) {
let t = e.target || null;
let xSelector = 'div[class*="header-wrapper"] [class*="list-sum"], div[data-index] [class*="info"], div[data-index] [class*="text-primary"]';
let xKey = e.keyCode == 88;
let zSelector = 'span[role=button][aria-label="添加"], .ant-dropdown-menu';
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

// ==UserScript==
// @name  问卷星无障碍优化
// @namespace    https://accjs.org/
// @version      0.1
// @description  问卷星无障碍优化脚本
// @author  杨永全
// @match  https://*.wjx.com/*
// @match  https://*.wjx.cn/*
// @match  https://*.wjx.top/*
// @grant  none
// @downloadURL https://update.greasyfork.org/scripts/429724/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%97%A0%E9%9A%9C%E7%A2%8D%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429724/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%97%A0%E9%9A%9C%E7%A2%8D%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
cproc();
aamo(aproc);

document.addEventListener('keydown', function(e) {
let t = e.target || null;
if(e.keyCode == 32 || e.keyCode == 13) {
if(t.matches('.accjs-click')) {
t.click();
if(t.matches('textarea[province]')) {
setTimeout(function() {
var iframe = document.querySelector('iframe');
if(iframe != null) {
var select = iframe.contentDocument.querySelector('select');
if(select != null) {
select.focus();
}
}
}, 300);
}
}
}
}, null);

function aproc(records) {
document.querySelectorAll('.jqRadio, .jqCheckbox').forEach(function(el) {
let checked = el.matches('.jqChecked');
attr(el, 'aria-checked', checked);
});
}

function cproc() {
let titles = document.querySelectorAll('h1, .surveydescription, .div_title_cut_question, .div_title_question_all');
titles.forEach(function(el) {
let label = el.innerText;
attr(el, 'aria-label', label);
attr(el, 'tabindex', '0');
let pe = el.parentNode;
if(pe != null) {
pe.querySelectorAll('textarea, input').forEach(function(el) {
attr(el, 'aria-label', label);
});
}
});
if(titles.length > 0) {
titles[0].focus();
}

document.querySelectorAll('.jqRadio, .jqCheckbox').forEach(function(el) {
let label = el.parentNode.innerText || '';
attr(el, 'aria-label', label);
attr(el, 'aria-checked', 'false');
addClass(el, 'accjs-click');
let pe = el.parentNode;
if(pe != null) {
pe.querySelectorAll('label').forEach(function(el) {
attr(el, 'aria-hidden', 'true');
});
pe.querySelectorAll('input').forEach(function(el) {
attr(el, 'aria-label', label);
});
}
});

document.querySelectorAll('.jqRadio').forEach(function(el) {
attr(el, 'role', 'radio');
attr(el, 'tabindex', '-1');
});

document.querySelectorAll('.jqCheckbox').forEach(function(el) {
attr(el, 'role', 'checkbox');
});

document.querySelectorAll('.div_question').forEach(function(el) {
let radios = el.querySelectorAll('.jqRadio');
if(radios.length > 0) {
radios[0].setAttribute('tabindex', '0');
}
});

document.querySelectorAll('#divProgressBar').forEach(function(el) {
attr(el, 'tabindex', '0');
//attr(el, 'role', 'progressbar');
});

document.querySelectorAll('textarea[province]').forEach(function(el) {
attr(el, 'title', '按空格键或回车键打开地区选择对话框');
el.removeAttribute('aria-label');
addClass(el, 'accjs-click');
});

//end cproc function
}


function attr(el, key, val) {
el.setAttribute(key, val);
}

function addClass(el, classes) {
classes.split(' ').forEach(function(className) {
el.classList.add(className);
});
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

document.addEventListener('keydown', (k) => {
shortcutKey(k);
}, null);
let allElement = [];
//存储焦点元素的数组下标
let focusElementIndex;
function shortcutKey(k) {
if (k.keyCode !== 65 &&
k.keyCode !== 90) {
return false;
} else {
//获取页面所有元素，转成数组
allElement = Array.prototype.slice.call(document.body.querySelectorAll('*'));
//获取焦点元素的数组下标
focusElementIndex = allElement.indexOf(document.activeElement);
accesskey(k);
}
}
// 前一条内容
function previousTarget(target, subscriptArray) {
for (let i = 0, l = target.length || subscriptArray.length; i < l; i++) {
if (focusElementIndex > subscriptArray[l - 1] || focusElementIndex <= subscriptArray[0]) {
target[l - 1].focus();
break;
} else if (focusElementIndex <= subscriptArray[i]) {
let xv = target.indexOf(target[i]);
target[xv - 1].focus();
break;
}
}
return false;
}
// 后一条内容
function nextTarget(target, subscriptArray) {
for (let i = 0, l = target.length || subscriptArray.length; i < l; i++) {
if (focusElementIndex < subscriptArray[i]) {
let xv = target.indexOf(target[i]);
target[xv].focus();
break;
} else if (focusElementIndex < subscriptArray[0] || focusElementIndex >= subscriptArray[l - 1]) {
target[0].focus();
break;
}
}
return false;
}
function accesskey(k) {
let script = [];
let acc = allElement.filter(function (t) {
if (t.classList.contains('hotkey-AZ')) {
script.push(allElement.indexOf(t));
return t;
}
});
let focusElement = document.activeElement;
if (k.ctrlKey || k.shiftKey || k.altKey ||
isTextbox(focusElement))
return false;
if (k.keyCode == 65) {
nextTarget(acc, script)
}
if (k.keyCode == 90) {
previousTarget(acc, script);
}
}
//判断是否是文本编辑框
function isTextbox(t) {
if ((t.type == 'text' || t.type == 'password' || t.type == 'email' || t.type == 'number' || t.type == 'search' || t.type == 'tel' || t.type == 'url') && t.tagName == 'INPUT' ||
t.tagName == 'PRE' ||
t.tagName == 'TEXTAREA' ||
t.tagName == 'INPUT' && t.getAttribute('type') == null ||
t.hasAttribute && t.hasAttribute('role') && t.getAttribute('role') == 'textbox')
return true;
}
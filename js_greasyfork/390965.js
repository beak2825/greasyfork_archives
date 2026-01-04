// ==UserScript==
// @name         微信对话生成器界面优化
// @namespace    https://penicillin.github.io/
// @version      0.1
// @description  try to take over the world!
// @author       静夜轻风
// @match        http://www.makepic.net/Tools/default/WXChat
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/390965/%E5%BE%AE%E4%BF%A1%E5%AF%B9%E8%AF%9D%E7%94%9F%E6%88%90%E5%99%A8%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/390965/%E5%BE%AE%E4%BF%A1%E5%AF%B9%E8%AF%9D%E7%94%9F%E6%88%90%E5%99%A8%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

var tag=document.getElementsByClassName('slt-xinqi')[0];
var inp1=document.createElement('input');
var inp2=document.createElement('input');
var inp3=document.createElement('input');
var split1=document.createElement('span');
var split2=document.createElement('span');
var split3=document.createElement('span');

tag.style.display="none";

split1.innerText='年';
split2.innerText='月';
split3.innerText='日';

inp1.style.width='55px';
inp2.style.width='30px';
inp3.style.width='30px';
inp1.style.height='23px';
inp2.style.height='23px';
inp3.style.height='23px';

inp1.setAttribute('maxlength','4');
inp2.setAttribute('maxlength','2');
inp3.setAttribute('maxlength','2');

tag.previousSibling.appendChild(inp1);
tag.previousSibling.appendChild(split1);
tag.previousSibling.appendChild(inp2);
tag.previousSibling.appendChild(split2);
tag.previousSibling.appendChild(inp3);
tag.previousSibling.appendChild(split3);

function inpKeyUp(){
    if(inp1.value!=''&&inp2.value!=''&&inp3.value!=''){
    tag.options[0].value=inp1.value+'年'+inp2.value+'月'+inp3.value+'日';
}else{
    tag.options[0].value='-';
}
}
inp1.addEventListener('keyup',inpKeyUp);
inp2.addEventListener('keyup',inpKeyUp);
inp3.addEventListener('keyup',inpKeyUp);

var saveBtn=document.getElementById('save');
var saveBtnParent=saveBtn.parentElement;
saveBtnParent.innerHTML='';
saveBtnParent.append(saveBtn);
// ==UserScript==
// @name         Bionic Reading
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  加粗英文单词的前半部分，或是加下划线
// @author       RhDu
// @match        *://*/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445268/Bionic%20Reading.user.js
// @updateURL https://update.greasyfork.org/scripts/445268/Bionic%20Reading.meta.js
// ==/UserScript==

const styleEl = document.createElement('style');

const excludeTagNames = ['script','style','xmp','input','textarea','pre','code'].map(a=>a.toUpperCase());

let textEls = [];
const gather = el=>{
    el.childNodes.forEach(el=>{
        if(el.isEnB) return;
        if(el.nodeType === 3){
            textEls.push(el);
        }else if(el.childNodes){
            if(excludeTagNames.includes(el.tagName)) return;
            gather(el)
        }
    })
};

let body = document.body;

const customStyleEl = document.querySelector('#custom_style');
if(customStyleEl)customStyleEl.removeAttribute('id');

const enCodeHTML = s=> s.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
    return '&#'+i.charCodeAt(0)+';';
 });

const run = _=>{
    textEls = [];
    gather(body);

    textEls.forEach(textEl=>{
        const text = textEl.data;
        if(!/[a-z][a-z0-9]+/i.test(text))return;

        const spanEl = document.createElement('spann');
        spanEl.setAttribute("isModified","1");
        spanEl.isEnB = true;
        spanEl.innerHTML = enCodeHTML(text).replace(/[a-z][a-z0-9]+/ig,word=>{
            return '<bbb>'+word.substr(0,Math.ceil(word.length/2))+'</bbb>'+word.substr(Math.ceil(word.length/2))
        })
        textEl.after(spanEl);
        textEl.remove();
    });
    document.head.appendChild(styleEl);
}

var fixedQueryButton = document.createElement("div");
fixedQueryButton.id = "queryButton";
fixedQueryButton.style.margin = "0";
fixedQueryButton.style.padding = "0";
fixedQueryButton.style.position = "fixed";
fixedQueryButton.style.width = "100px";
fixedQueryButton.style.height = "96px";
fixedQueryButton.style.right = "0px";
fixedQueryButton.style.bottom = "50vh";
fixedQueryButton.style.color = "black";
fixedQueryButton.style.background = "white";
fixedQueryButton.style.opacity = "80%";

var fixedQuerySwitch = document.createElement("div");
fixedQuerySwitch.id = "switchQuery";
fixedQuerySwitch.style.margin = "0";
fixedQuerySwitch.style.padding = "0";
fixedQuerySwitch.style.position = "fixed";
fixedQuerySwitch.style.width = "20px";
fixedQuerySwitch.style.height = "96px";
fixedQuerySwitch.style.right = "100px";
fixedQuerySwitch.style.bottom = "50vh";
fixedQuerySwitch.style.color = "black";
fixedQuerySwitch.style.background = "white";
fixedQuerySwitch.style.opacity = "80%";

var queryText = document.createElement("p");
queryText.id = "switchContent";
queryText.textContent = ">"
queryText.style.textAlign = "center";
queryText.style.padding = "4px 0";
queryText.style.margin = "0";
queryText.style.fontSize = "16px";
queryText.style.userSelect = "none";

fixedQuerySwitch.appendChild(queryText);

var workButton1 = document.createElement("button");
workButton1.onclick = function(){
    styleEl.innerHTML = 'bbb{font-weight:bold;}';
    run();
    console.log("111");
    //return;
};
workButton1.textContent = "加粗单词";

var workButton2 = document.createElement("button");
workButton2.onclick = function(){
    styleEl.innerHTML = 'bbb{text-decoration:underline;}';
    run();
    console.log("222");
    //return;
};
workButton2.textContent = "加下划线";

var workButton3 = document.createElement("button");
workButton3.onclick = function(){
    styleEl.innerHTML = 'bbb{text-decoration:none;}';
    run();
    console.log("333");
    //return;
};
workButton3.textContent = "清除样式";

fixedQueryButton.appendChild(workButton1);
fixedQueryButton.appendChild(workButton2);
fixedQueryButton.appendChild(workButton3);

body.appendChild(fixedQueryButton);
body.appendChild(fixedQuerySwitch);

$("#switchQuery").on("click", function () {
    if ($("#queryButton").width() != 0) {
        $("#queryButton").animate({width: "0px"});
        $("#switchQuery").animate({right: "0px"});
        $("#switchContent")[0].innerText = "<";
    }
    else {
        $("#queryButton").animate({width: "100px"});
        $("#switchQuery").animate({right: "100px"});
        $("#switchContent")[0].innerText = ">";
    }
});

const _run = ms=> _=>setTimeout(run,ms);

const {open,send} = XMLHttpRequest.prototype;

XMLHttpRequest.prototype.open = function(){
    this.addEventListener('load',_run(200));
    return open.apply(this,arguments);
};

document.addEventListener('click',_run(250));
window.addEventListener('load',_run(200));
document.addEventListener("DOMContentLoaded",_run(200));
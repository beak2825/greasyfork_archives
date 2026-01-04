// ==UserScript==
// @name        Auto play - nhentai.net
// @namespace   Violentmonkey Scripts
// @match       https://nhentai.net/g/*
// @grant       none
// @version     1.3
// @author      Whiter-
// @description 2023/2/11 下午6:48:29
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459842/Auto%20play%20-%20nhentainet.user.js
// @updateURL https://update.greasyfork.org/scripts/459842/Auto%20play%20-%20nhentainet.meta.js
// ==/UserScript==


var auto_button = document.createElement('div');
auto_button.style.width = '70px';
auto_button.style.height = '30px';
auto_button.style.position = 'absolute';
auto_button.style.background = 'gray';
auto_button.style.content = 'Auto';
auto_button.style.left = '70px';
auto_button.style.margin = '5px';
auto_button.style.lineHeight = '30px';
auto_button.style.fontWeight = '900';
auto_button.style.borderRadius = '5px';
auto_button.style.userSelect = 'none'
auto_button.style.hover
auto_button.appendChild(document.createTextNode("AUTO"));
auto_button.setAttribute('id','auto_button');

var option_bar = document.getElementsByClassName('reader-bar')[0];
option_bar.appendChild(auto_button);

//------



var range_bar = document.createElement('div');
range_bar.setAttribute('id','range_bar');
range_bar.style.position = 'absolute';
range_bar.style.left = '160px';
range_bar.style.height = '40px';
range_bar.style.userSelect = 'none';


var range_input = document.createElement('input');
range_input.setAttribute('id','range_input')
range_input.setAttribute('type','range');
range_input.setAttribute('list','timelist');
range_input.setAttribute('min','1');
range_input.setAttribute('max','10');
range_input.setAttribute('value','3');
range_bar.appendChild(range_input);


var datalist = document.createElement('datalist');
datalist.style.display = 'flex';
datalist.style.justifyContent = 'space-between';
datalist.style.fontSize = '5px';
datalist.style.marginTop = '-5px';
datalist.setAttribute('id','timelist')
range_bar.appendChild(datalist);

option_bar.appendChild(range_bar);

datalist = document.getElementById('timelist')
Array(10).fill(0).map((_,n)=>{
  var optionElement = document.createElement('option');
  optionElement.setAttribute('value',n+1);
  optionElement.setAttribute('label',n+1);
  datalist.appendChild(optionElement);
})


range_input = document.getElementById('range_input');
auto_button = document.getElementById('auto_button');

var delay = 3000;





var auto_flag = false;
var auto_interval = null;

function auto_loop(flag){
  if(flag){
    delay = parseInt(range_input.value)*1000;
    auto_button.style.background = 'gold';
    auto_button.style.color = 'black';
    auto_interval = setInterval(()=>{
    document.body.dispatchEvent(new KeyboardEvent('keydown',{
    key:'ArrowRight',
    keyCode: 39,
    code:'ArrowRight',
    which: 39,
    shiftKey: false,
    ctrlKey: false,
    metaKey: false,
    }))
  },delay)
  }else{
    auto_button.style.background = 'gray';
    auto_button.style.color = 'white';
    clearInterval(auto_interval);
  }
}


auto_button.addEventListener('click',(e)=>{
  auto_flag = !auto_flag
  auto_loop(auto_flag)
})








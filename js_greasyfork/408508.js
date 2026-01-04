// ==UserScript==
// @name        Cytube white list
// @namespace   Violentmonkey Scripts
// @match       https://cytu.be/r/*
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @version     1.0.1
// @author      -
// @description Makes chat whitelisted
// @downloadURL https://update.greasyfork.org/scripts/408508/Cytube%20white%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/408508/Cytube%20white%20list.meta.js
// ==/UserScript==

window.allowset = new Set(JSON.parse(localStorage.whitelist||'[]'));

function addcontrol(elem) {
 console.log('elem',elem);
 if(elem.controladded) return;
 elem.controladded=true;
 var name=elem.innerText;
 console.log('name',name);
 var state=allowset.has(name)||false;
 var control=document.createElement('span');
 control.innerText=state?'-':'+';
 control.title=state?'Black list':'White list';
 var style = control.style;
 style.paddingLeft='2px';
 style.paddingTop='0';
 style.paddingRight='2px';
 style.paddingBottom='0';
 style.marginLeft='2px';
 style.backgroundColor='#735757';
 style.borderRadius='2px';
 elem.appendChild(control);
 control.addEventListener('mouseup',e=>e.preventDefault());
 console.log('first state',state);
 control.addEventListener('click',e=>{
  e.preventDefault();
  e.stopPropagation();
  console.log('state',state);
  state=!state;
  console.log('new state',state);
  control.innerText=state?'-':'+';
  if(state) {
   window.allowset.add(name);
   $('.chat-msg-'+name).each((i,e)=>e.style.display='block');
   control.title='Black list';
  }
  else {
   window.allowset.delete(name);
   $('.chat-msg-'+name).each((i,e)=>e.style.display='none');
   control.title='White list';
  }
  var outlist=[];
  window.allowset.forEach(e=>outlist.push(e));
  localStorage.whitelist=JSON.stringify(outlist);
  return false;
 },true);
}

console.log('violent monkey works');
var userlistinterval=setInterval(()=>{
  var userlist=$('#userlist');
  if(userlist) {
   console.log('userlist',userlist,userlist.children());  
   clearInterval(userlistinterval);
   userlist.children().each((i,e)=>addcontrol(e));
   var observer = new MutationObserver((list,observer)=>{
    list.forEach(observation=>{
     observation.addedNodes.forEach(n=>addcontrol(n));
     console.log('observation',observation);
    });
   });
   observer.observe(userlist[0],{childList:true});
  }
},100);

var messagebufferinterval=setInterval(()=>{
 var messagebuffer=$('#messagebuffer');
 if(messagebuffer) {
  console.log('messagebuffer',messagebuffer);
  clearInterval(messagebufferinterval);
  var observer = new MutationObserver((list,observer)=>{
   list.forEach(observation=>{
    observation.addedNodes.forEach(n=>{
     var className = n.className;
     if(className.startsWith('chat-msg-')) {
      var user = className.replace('chat-msg-','');
      if(!allowset.has(user)) n.style.display='none';
     }
    });
   });
  });
  observer.observe(messagebuffer[0],{childList:true});
 }
},100);

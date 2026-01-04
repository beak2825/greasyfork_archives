// ==UserScript==
// @name         SploMod Clean ++
// @description  Autobreak, Smart AutoPush, Autoheal, SmartAutoPlace, Emoji AutoChat, macros, mobile menu button, performance tweaks
// @version      4.1.0
// @author       refactor-by-chatgpt
// @match        *://sploop.io/*
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @grant        none
// @namespace https://greasyfork.org/users/1406718
// @downloadURL https://update.greasyfork.org/scripts/545713/SploMod%20Clean%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/545713/SploMod%20Clean%20%2B%2B.meta.js
// ==/UserScript==

(function(){
const emojiPool = [..."😀😁😂🤣😃😄😅😆😉😊😋😎😍😘🥰😗😙😚🙂🤗🤩🤔🤨😐😑😶🙄😏😣😥😮🤐😯😪😫🥱😴😌😛😜😝🤤😒😓😔😕🙃🤑😲☹️🙁😖😞😟😤😢😭😦😧😨😩🤯😬😰😱🥵🥶😳🤪😵🥴😠😡🤬😷🤒🤕🤢🤮🤧😇🥳🥺🤠🤡🤥🤫🤭🧐🤓💀👻👽🤖🎃🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🙈🙉🙊🐒🐔🐧🐦🐤🐣🐥🦆🦅🦉🦇🐺🐗🐴🦄🐝🐛🦋🐌🐞🐜🦟🦗🕷️🦂🐢🐍🦎🦖🦕🐙🦑🦐🦞🦀🐡🐠🐟🐬🐳🐋🦈🐊🦧🦍🐘🦛🦏🐪🐫🦙🦒🐃🐂🐄🐎🐖🐏🐑🦮🐕‍🦺🐩🐕🦌🦃🐓🐁🐀🐿️🦔"];

let wsPushing=false,Game,Entity=[],Canvas,Context,keyDown=[],user={},enemy,encoder=new TextEncoder(),teammates=[];let Config={serverUpdate:1e3/9,autoChatPool:emojiPool};let Toggle={UI:true,autoBreak:true,autoPush:true,autoPlace:true,autoSync:true,autoRespawn:false,autoChat:false,tracers:true,autoHeal:true,optHeal:false};

const getDistance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),getAngle=(a,b)=>Math.atan2(a.y-b.y,a.x-b.x);

class Sploop{
 static place(id,angle){Game.send(new Uint8Array([0,id]));let ang=(65535*(angle+Math.PI))/(2*Math.PI);Game.send(new Uint8Array([19,255&ang,(ang>>8)&255]));Game.send(new Uint8Array([18]));Game.send(new Uint8Array([0,Config.weapon]));}
 static smartPlace(){if(!enemy)return;let dist=getDistance(enemy,user);let predicted={x:enemy.x+enemy.xVel*3,y:enemy.y+enemy.yVel*3};let idToPlace=dist<100?4:7;if(user.health<40)idToPlace=7;let angleStep=Math.PI/16;for(let a=0;a<Math.PI*2;a+=angleStep){setTimeout(()=>{Sploop.place(idToPlace,a)},a*5);}}
 static autoChat(){if(user.alive)Sploop.chat(Config.autoChatPool[Math.floor(Math.random()*Config.autoChatPool.length)]);}
 static chat(txt){let e=encoder.encode(txt);Game.send(new Uint8Array([7,...e]));}
}

class Script{run(ws){this.ws=ws;setInterval(()=>{if(Toggle.autoChat)Sploop.autoChat();},1000);}
 send(d){if(this.ws&&1===this.ws.readyState)this.ws.send(d);}
 message(e){let data=new Uint8Array(e.data);if(data[0]===20){enemy=null;for(let i=1;i<data.length;i+=19){let id=data[i+2]|data[i+3]<<8,x=data[i+4]|data[i+5]<<8,y=data[i+6]|data[i+7]<<8,type=data[i],owner=data[i+1],hp=data[i+13]/255*100;let ent={id,type,x,y,id2:owner,health:hp};Entity[id]=ent;if(!ent.type)enemy=ent;if(ent.id===user.id)Object.assign(user,ent);}if(Toggle.autoPlace)Sploop.smartPlace();}}
}

Game=new Script();WebSocket.prototype.send=function(d){if(!this._init){this._init=true;this.addEventListener('message',e=>Game.message(e));Game.run(this);}Game.send(d);};

const mobileMenuBtn=document.createElement("button");Object.assign(mobileMenuBtn.style,{position:"absolute",top:"10px",right:"10px",background:"white",border:"2px solid #000",borderRadius:"50%",width:"40px",height:"40px",zIndex:"10000",fontSize:"20px",cursor:"pointer"});mobileMenuBtn.textContent="☰";mobileMenuBtn.onclick=()=>{const m=document.getElementById("settingMenu");m.style.display=m.style.display==="flex"?"none":"flex";};document.addEventListener("DOMContentLoaded",()=>document.body.appendChild(mobileMenuBtn));
})();

// ==UserScript==
// @name        H 336's teleportation
// @namespace   H 336's teleportation
// @include     http://brofist.io/modes/sandbox/c/index.html
// @version     1
// @description for myself only, teleportation
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/423883/H%20336%27s%20teleportation.user.js
// @updateURL https://update.greasyfork.org/scripts/423883/H%20336%27s%20teleportation.meta.js
// ==/UserScript==
(()=>{if(!window.tweenObjects){console.dir("Вставь это ПОСЛЕ захода в игру!");return};let img=new Image(1809,925),can=document.createElement("canvas"),ctx=can.getContext("2d"),map={left:-280.9398498535156,top:161.9472198486328,right:169.01568603515625,bottom:-67.97335815429688},imgWidth=603,imgHeight=308,me=tweenObjects[0].refP.p.world.bodies.find(t=>.9==t.damping);me.ref.setX=me.ref.setY=(()=>{}),map.width=map.right-map.left,map.height=map.top-map.bottom,can.width=imgWidth,can.height=imgHeight,can.style.position="absolute",can.style.right=0,can.style.top=0,can.style.border="3px solid",can.style.boxShadow="0 0 15px #333",can.onclick=(t=>{me.position[0]=t.offsetX/imgWidth*map.width+map.left,me.position[1]=map.top-t.offsetY/imgHeight*map.height}),document.body.appendChild(can),img.src="https://cdn.discordapp.com/attachments/686605835765547107/793229635617423410/unknown.png",img.onload=(()=>{ctx.fillStyle=ctx.strokeStyle="#F00",(loop=(()=>{let t=(me.position[0]-map.left)/map.width*imgWidth,e=(map.top-me.position[1])/map.height*imgHeight;ctx.clearRect(0,0,imgWidth,imgHeight),ctx.drawImage(img,0,0,imgWidth,imgHeight),ctx.beginPath(),ctx.arc(t,e,3,0,2*Math.PI),ctx.fill(),ctx.beginPath(),ctx.moveTo(0,e),ctx.lineTo(imgWidth,e),ctx.stroke(),ctx.beginPath(),ctx.moveTo(t,0),ctx.lineTo(t,imgHeight),ctx.stroke(),requestAnimationFrame(loop)}))()})})();
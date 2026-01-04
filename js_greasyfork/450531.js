// ==UserScript==
// @name        scenexe.io AFK
// @namespace   https://scnxwged.glitch.me/
// @description press F, moves you back if too far from place where AFK was turned ON
// @author      BZZZZ
// @license     GPLv3
// @include     /^https?\:\/\/scenexe\.io\/([?#]|$)/
// @include     /^https?\:\/\/new\-test\.scenexe\.io\/([?#]|$)/
// @include     /^https?\:\/\/test\.scenexe\.io\/([?#]|$)/
// @include     /^https?\:\/\/test2\.scenexe\.io\/([?#]|$)/
// @version     0.7
// @grant       none
// @run-at      document-end
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/450531/scenexeio%20AFK.user.js
// @updateURL https://update.greasyfork.org/scripts/450531/scenexeio%20AFK.meta.js
// ==/UserScript==

const d=document.createElementNS('http://www.w3.org/1999/xhtml','div')
d.dataset.x='\'use strict\'\n'+(()=>{
const MAX_DIST_SQ=120*120,INTERVAL_MS=200,

pre=/^Position: (-?\d+(?:\.\d+)?), (-?\d+(?:\.\d+)?)$/,
log=console.log.bind(null,'%c[AFK]','font-weight:bold;color:#F0F;'),
{sqrt,round}=Math,
afkloop=()=>{
	if(1!==afk.ws.readyState){
		clearInterval(afk.iid)
		afk=null
		log('off because websocket isn\'t open')
		return
	}
	const p=pre.exec(afk.p.textContent)
	if(!p){
		clearInterval(afk.iid)
		afk=null
		log('off because can\'t understand text in #position')
		return
	}
	let dx=afk.tx-p[1],dy=afk.ty-p[2],d=dx*dx+dy*dy
	if(d>MAX_DIST_SQ){
		d=32/sqrt(d)
		dx=round(d*dx)
		dy=round(d*dy)
		if(dx>32)dx=32
		else if(dx<-32)dx=-32
		if(dy>32)dy=32
		else if(dy<-32)dy=-32
		dx=afk.xor^255&dx
		dy=afk.xor^255&dy
		if(afk.arr[1]===dx&&afk.arr[2]===dy)return
		afk.arr[1]=dx
		afk.arr[2]=dy
	}else{
		if(afk.arr[1]===afk.xor&&afk.arr[2]===afk.xor)return
		afk.arr[1]=afk.arr[2]=afk.xor
	}
	afk.ws.send(afk.arr)
}
let afk=null
document.body.addEventListener('keyup',event=>{
	if('KeyF'!==event.code)return
	var ae=document.activeElement
	if(ae)switch(ae.tagName){
		case 'INPUT':
		case 'TEXTAREA':
			return
	}
	if(afk){
		clearInterval(afk.iid)
		afk=null
		log('off')
		return
	}
	const p=document.getElementById('position')
	if(!p){
		log('can\'t on because can\'t get #position')
		return
	}
	const t=pre.exec(p.textContent)
	if(!t){
		log('can\'t on because can\'t understand text in #position')
		return
	}
	let sendcalled=false
	const oldsend=WebSocket.prototype.send
	WebSocket.prototype.send=function(msg){
		sendcalled=true
		WebSocket.prototype.send=oldsend
		this.send(msg)
		if(!(msg instanceof Uint8Array&&4===msg.length)){
			log('can\'t on because can\'t understand movement packet')
			return
		}
		afk={
			p,
			ws:this,
			arr:msg,
			xor:msg[1]=msg[2]=146^msg[0],
			tx:+t[1],
			ty:+t[2],
			iid:setInterval(afkloop,INTERVAL_MS)
		}
		log('on')
	}
	let e=new Event('keydown')
	e.keyCode=37
	dispatchEvent(e)
	e=new Event('keyup')
	e.keyCode=37
	dispatchEvent(e)
	if(sendcalled)return
	log('can\'t on because WebSocket.prototype.send not called')
	WebSocket.prototype.send=oldsend
},{passive:true,__proto__:null})
}).toString().substring(4)
d.setAttribute('onclick','setTimeout(this.dataset.x,0)')
d.click()
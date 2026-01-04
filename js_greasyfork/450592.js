// ==UserScript==
// @name		     Paulinho Console
// @run-at			document-start
// @version			0.1
// @description	paulin console br
// @author		        Paulinho
// @match				https://www.kogama.com/page/webgl-frame/*
// @match				https://kogama.com.br/page/webgl-frame/*
// @match				https://friends.kogama.com/page/webgl-frame/*
// @grant				none

// @namespace https://greasyfork.org/users/776013
// @downloadURL https://update.greasyfork.org/scripts/450592/Paulinho%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/450592/Paulinho%20Console.meta.js
// ==/UserScript==

/*sniffers*/

WS_Original = WebSocket;
WebSocket = function(url, type){
	let ws = new WS_Original(url, type);
	kcc.ws = ws;

	ws._send = ws.send;
	ws.send = kcc.injectClient;
	kcc.logClient('injected client');
	function waitServer(e){
		kcc.injectServer(e);
		if(!this.editServer){
			this.removeEventListener('message', waitServer);
			this._msg = this.onmessage;
			this.onmessage = kcc.injectServer;
		}
		kcc.logServer('injected server');
	}
	ws.addEventListener('message', waitServer);

	return ws;
};

/*Utils*/
Uint8Array.prototype.equals=
Array.prototype.equals=function(array){
	if(!(array&&this.length==array.length))return false;
	for(var i=0,l=this.length;i<l;i++){
		if(this[i] instanceof Array&&array[i] instanceof Array){
				if(!this[i].equals(array[i]))return false;
		}else if(this[i]!=array[i]){return false;}
	}
	return true;
}
Object.defineProperty(window.Uint8Array.prototype,"equals",{enumerable:false});
Object.defineProperty(window.Array.prototype,"equals",{enumerable:false});
decode=d=>new TextDecoder().decode(d);
encode=d=>new TextEncoder().encode(d);
top.toByte16=toByte16=num=>new Uint8Array(new Uint16Array([num]).buffer).reverse();
top.toNum16Sign=toNum16Sign=nums=>new Int16Array(new Uint8Array(nums).reverse().buffer)[0];
top.toNum16=toNum16=nums=>new Uint16Array(new Uint8Array(nums).reverse().buffer)[0];
top.unsign16=unsign16=num=>new Uint16Array([num])[0];
top.toByte32=toByte32=num=>new Uint8Array(num?new Uint32Array([num]).buffer:[]).reverse();
top.toNum32=toNum32=nums=>new Uint32Array(nums?new Uint8Array(nums).reverse().buffer:0)[0];
getJSON=str=>{
	let pos=0,left=0,i=0,arr=[];
	while(i++<str.length){
		if(str[i]=='{'&&str[i+1]=='"'){
			if(!left)pos=i;
			left++;
		}
		if(str[i]=='}'){
			if(left>0){
				left--;
				if(!left)arr.push(str.slice(pos,i+1));
			}
		}
	}
	return arr.map(a=>JSON.parse(a));
}
top.format=format=str=>{//ff0011->[255,0,17]
	let rez=[];
	let n=0;
	for(let i=0;i<str.length;i++){
		rez.push(str[i]);
		if((i+2-n)%3==0){n+=2;rez.push(" ");}
	}
	rez.pop();
	return new Uint8Array(rez.join('').split(' ').map(n=>parseInt(n,16)))
};

/*kogama console*/
{
	window.html=top.html=id=>top.document.getElementById(id);
	window.make=top.make=tag=>top.document.createElement(tag);
	window.kc=top.kc={green:'#43B581',red:'#F04747',blue:'#72A9DA',none:'rgba(0, 0, 0, 0.7)',//none:rgba(0, 0, 0, 0.7)
		    Impulsegun:()=>{kcc.ws._msg({data:new Uint8Array([243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,2,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,2,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,115,0,9,97,110,105,109,97,116,105,111,110,68,0,0,0,2,115,0,5,115,116,97,116,101,115,0,4,73,100,108,101,115,0,9,116,105,109,101,83,116,97,109,112,105,70,131,252,232,254,105,0,0,0,0]).buffer});
                      },
                                                                                       slapgun:()=>{kcc.ws._msg({data:new Uint8Array([243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,65,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0]).buffer});
                      },
     cubegun:()=>{
                          kcc.ws._send(new Uint8Array([
                              243,2,25,0,2,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,4,115,0,4,116,121,112,101,105,0,0,0,11,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,115,0,8,105,116,101,109,68,97,116,97,68,0,0,0,1,115,0,8,109,97,116,101,114,105,97,108,98,20
                          ]));
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,4,115,0,4,116,121,112,101,105,0,0,0,11,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,115,0,8,105,116,101,109,68,97,116,97,68,0,0,0,1,115,0,8,109,97,116,101,114,105,97,108,98,20,254,105,0,0,0,0
                          ]).buffer});
                      },

                      Bazooka:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,4,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      autofire:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,8,105,115,70,105,114,105,110,103,111,1,254,105,0,0,0,0
                          ]).buffer});
                      },

                      pistol:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,12,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      mousegun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,60,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      healgun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,70,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      shotgun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,9,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      centralgun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,1,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      railgun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,6,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      sword:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,8,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      growthgun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,2,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,62,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,115,0,9,97,110,105,109,97,116,105,111,110,68,0,0,0,2,115,0,5,115,116,97,116,101,115,0,4,73,100,108,101,115,0,9,116,105,109,101,83,116,97,109,112,105,80,15,108,52,254,105,0,0,0,0
                          ]).buffer});
                      },
                      pistol2x:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,13,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      flamethrower:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,10,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      shuriken:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,45,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      shuriken5x:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,46,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },

		action:(actionId,PID=kcc.self)=>kcc.ws.send(new Uint8Array([243,2,27,0,2,22,105,...toByte32(PID),83,68,0,0,0,1,98,0,120,0,0,0,2,1,actionId])),
		
		log:(msg,clr='#FFF')=>{
			if(html('console_log').lastChild&&msg==html('console_log').lastChild.textContent){
				let counter=html('console_log').lastChild.children[0];
				if(counter){
					counter.value=1+Number(counter.value);
				}else{
					counter=make('input');
					counter.style=`height:20px;width:20px;
					text-align:center;padding:0px;
					background:${kc.green};color:#FFFA;
					border:none;border-radius:100%;cursor:default;`;
					counter.value=2;
					counter.disabled=true;
					html('console_log').lastChild.appendChild(counter)
				}
				return;
			}
			let scroll=html('console_log').scrollTop/(html('console_log').scrollHeight-html('console_log').offsetHeight);
			if(isNaN(scroll)||scroll>0.9)scroll=true;
			else scroll=false;
			let el=make('div');
			el.style='padding:2% 1% 0px 2%;width:100%;color:'+clr+';';
			el.textContent=msg;
			html('console_log').appendChild(el);
			if(scroll)html('console_log').scrollTop=html('console_log').scrollHeight-html('console_log').offsetHeight;
		},
		command:str=>{
			kc.log(str,'#FFF8');
		}
	};
	window.makeCheat=top.makeCheat=(name='unknown',clr='#888',func=()=>{})=>{
		let el=make('input');
		el.id=name;
		el.value=name;
		el.className='cheat_element';
		el.type='button';
		el.style=`color:${clr};background-color: rgba(0, 0, 0, 0.7);border-radius:10px;border:none;padding:2px;`;
		el.addEventListener('click',func);
		html('cheat_box').appendChild(el);
	};
	window.addBB=top.addBB=(name='unknown',id='unknown',box='unknown_box',choosen=0)=>{
		let el=make('div');
		el.id=box;
		el.style=`
			position:absolute;
			display:${choosen?'block':'none'};
			width:75%;height:90%;
			top:10%;
			right:0px;
		`;
		html('console').appendChild(el);
		el=make('div');
		el.id='console_bar_'+id;
		el.className='bar_element bar_element_'+(choosen?'on':'off');
		el.textContent=name;
		el.addEventListener('click',function(e){
			if(this!=html('console_bar').cur){
				html(box).style.display='block';
				html('console').cur.style.display='none';
				html('console').cur=html(box);
				this.className='bar_element bar_element_on';
				html('console_bar').cur.className='bar_element bar_element_off';
				html('console_bar').cur=this;
			}
		});
		html('console_bar').appendChild(el);
	};
	var sheet=top.document.head.appendChild(make('style')).sheet;
	sheet.insertRules=rules=>rules.replace(/\}/g,'}^').split('^').map(r=>(r.indexOf('{')+1)&&sheet.insertRule(r));
	sheet.insertRules(`
		.scroller{overflow-y:auto;}
		.scroller::-webkit-scrollbar{
			width:10px;
		}
		.scroller::-webkit-scrollbar-thumb{
			background-color:rgba(0,0,0,.4);
			-webkit-box-shadow:inset 0 0 2px rgba(0,0,0,.5);
			box-shadow:inset 0 0 2px rgba(0,0,0,.5);
		}
		.scroller::-webkit-scrollbar-track{
			background-color:rgba(0,0,0,.3);
		}
		.scroller::-webkit-scrollbar-thumb{
			background:#000;
		}
		.bar_element:hover{
			opacity:0.9;
			background:#40444bAA;
			transition-duration: 0.3s;
		}
		.bar_element{
			color:#FFF;
			line-height: 200%;
			cursor:pointer;
			height:10%;
			width:100%;
		}
		.cheat_element:hover{
			color:#FFF !important;
		}
		.bar_element_off{
			opacity:0.5;
			background:#0000;
		}
		.bar_element_on{
			opacity:1;
			background:#40444b;
		}
	`);
	let el=make('div');
	top.document.body.appendChild(el);
	el.id='console';
	el.style=`
position: fixed;
background-color: #ff9800;
        box-shadow: 0 5px 13px #fff;

text-align: center;
z-index: 9999;
background-color: rgba(0, 0, 0, 0.7);
overflow: auto;
display: none;
	`;
	top.addEventListener('resize',function(){
		html('console').style.width=top.outerWidth*0.25+'px';
		html('console').style.height=top.outerHeight*0.35+'px';
	});
	top.dispatchEvent(new Event('resize'));
	top.document.addEventListener('mouseup',e=>{
		if(html('console').movement){
			html('console').movement=false;
			e.preventDefault();
			e.stopPropagation();
		}
	})
	top.document.addEventListener('mousemove',e=>{
		if(html('console').movement){
			html('console').style.left=(html('console').startPos.x+e.x-html('console').startPos.mx)+'px';
			html('console').style.top=(html('console').startPos.y+e.y-html('console').startPos.my)+'px';
			if(html('console').offsetTop<0)html('console').style.top='0px';
			e.preventDefault();
			e.stopPropagation();
		}
	});
	top.document.addEventListener('contextmenu', e=>{
		if(e.target==top.document.querySelector('#profile-extended-toggle>a>i')){
			html('console').style.display='block';
			e.preventDefault();
		}
	});
	el=make('div');
	el.id='console_head';
	el.innerHTML='KoGaMa Gun';
	el.style=`
		width:100%;height:10%;
		background-color: rgba(0, 0, 0, 0.7);
		cursor:default;
		border-top-left-radius:15px;
		border-top-right-radius:15px;
	`;
	html('console').appendChild(el);
	html('console_head').addEventListener('mousedown',e=>{
		html('console').movement=true;
		html('console').startPos={x:html('console').offsetLeft,y:html('console').offsetTop,mx:e.x,my:e.y};
		e.preventDefault();
		e.stopPropagation();
	});
	el=make('input');
	el.id='console_close';
	el.type='button';
	el.value='X';
	el.style=`
		position:absolute;
		height:6%;width:5%;
		right:0px;
		background-color:${kc.none};
		color:#FFF;line-height:0.5;
		border:none;
		border-top-right-radius:3px;
	`;
	html('console_head').appendChild(el);
	html('console_close').addEventListener('mousedown',e=>{
		if(e.which==1){
			pos={x:html('console').offsetLeft,y:html('console').offsetTop};
			html('console').style.display='none';
			html('console').style.left=pos.x+'px';
			html('console').style.top=pos.y+'px';
		}
		e.preventDefault();
		e.stopPropagation();
	});
	el=make('div');
	el.id='console_bar';
	el.style=`
		position:absolute;
		top:10%;left:0px;
		width:25%;height:90%;
		background-color: rgba(0, 0, 0, 0.7);
	`;
	html('console').appendChild(el);

	addBB('Console','console','console_box',1);
	html('console').appendChild(el);
	el=make('input');
	el.id='console_input';
	el.placeholder='Enter command...';
	el.style=`
		position:absolute;
		width:95%;height:10%;
		bottom:2.5%;right:2.5%;
		background-color:#4f545c;
		border:none;color:#FFF8;
		border-radius:15px;
		text-align:center;
		cursor:text;
	`;
	html('console_box').appendChild(el);
	html('console_input').index=-1;
	html('console_input').old=[];
	html('console_input').addEventListener('keydown',function(e){
		switch(e.keyCode){
                			
			case 13:
				if(this.value){
					kc.command(this.value);
					if(this.old[this.old.length-1]!=this.value)this.old.push(this.value);
					if(this.old>30)this.old.splice(0,1);
					this.was=undefined;
					this.index=this.old.length;
					this.value='';
				}
			break;
			case 38://up
				this.index-=2;
			case 40://down
				this.index++;
				if(this.index>this.old.length-1)this.index=this.old.length;
				if(this.index<0)this.index=0;
				if(this.index>this.old.length-1){
					if(this.was!==undefined)this.value=this.was;
					this.was=undefined;
				}else{
					if(this.was===undefined)this.was=this.value;
					this.value=this.old[this.index];
				}
			break;
		}
	});
	el=make('div');
	el.id='console_log';
	el.className='scroller';
	el.style=`
		position:absolute;
		text-align:left;
		width:100%;height:85%;
		word-break:break-all;
	`;
	html('console_box').appendChild(el);

	html('console').cur=html('console_box');
	html('console_bar').cur=html('console_bar_console');

	addBB('Cheat List','list','cheat_box');
	html('cheat_box').className='scroller';
makeCheat('cubegun',kc.darkblue,()=>kc.cubegun());
    makeCheat('impulsegun',kc.black,()=>kc.Impulsegun());
    makeCheat('mousegun',kc.black,()=>kc.mousegun());




    makeCheat('healgun',kc.black,()=>kc.healgun());
    makeCheat('shotgun',kc.black,()=>kc.shotgun());
    makeCheat('growthgun',kc.black,()=>kc.growthgun());
    makeCheat('railgun',kc.black,()=>kc.railgun());//new
    makeCheat('centralgun',kc.black,()=>kc.centralgun());//new
    makeCheat('sword',kc.black,()=>kc.sword());//new
    makeCheat('pistol',kc.black,()=>kc.pistol());//new
    makeCheat('pistol2x',kc.black,()=>kc.pistol2x());//new
    makeCheat('flamethrower',kc.black,()=>kc.flamethrower());//new
    makeCheat('shuriken',kc.black,()=>kc.shuriken());//new
    makeCheat('shuriken5x',kc.black,()=>kc.shuriken5x());//new
    makeCheat('slapgun',kc.black,()=>kc.slapgun());//new
}
/*Kogama Cheat Client*/
window.kcc=top.kcc={
	ws:{},
	self:0,
	pos:[0,0,0],
	names:{},
	parts:[],
	cubeSize:4,
	cubeD:1812,
	superbounce:1846,
	poison:1820,
	blackice:1835,
	ice:1817,
	magma:1818,
	bounce:1819,
	cubeId:0,
	cubeXZ:10,
	roomSize:4,
	cubeMode:0,
	cubeWay:50,
	cubeServer:(randomId=kcc.self,x=0,y=0,z=0,material)=>new Uint8Array([243,4,10,0,3,47,105,...toByte32(randomId),49,120,0,0,0,...(material?[9,2]:[7,0]),...toByte16(x),...toByte16(y),...toByte16(z),...(material?toByte16(material):[]),254,105,0,0,0,material?3:1]),
	cube:(randomId=kcc.self,x=0,y=0,z=0,material)=>new Uint8Array([243,2,7,0,2,47,105,...toByte32(randomId),49,120,0,0,0,...(material?[9,2]:[7,0]),...toByte16(x),...toByte16(y),...toByte16(z),...(material?toByte16(material):[])]),
	logClient:(msg,...items)=>{
		console.log.apply(console,['%c'+msg,"background-color:#0808;",...items]);
	},
	logServer:(msg,...items)=>{
		console.log.apply(console,['%c'+msg,"background-color:#F808;",...items]);
	},
	injectClient:function(data){
		data = new Uint8Array(data);
		data = kcc.separator(data);
		if(data)this._send(data);
	},
	injectServer:function(e){
		let data = new Uint8Array(e.data);
		if(this != kcc.ws){
			kcc.logServer(`wait injection: [${data.toString()}]`);
			return;
		}
		data = kcc.separator(data);
		if(data)this._msg({data:data.buffer});
	}
};

/*requests separating*/
kcc.no_sense=data=>{
	if(data.length<7)return true;//not action
	return false;
	/*
	if(data.equals([243,4,81,0,0])){//each tick
		//kcc.logServer('short_ping');
		return true;
	}else if(data.equals([243,2,58,0,0])){//1 time
		//kcc.logClient('short_ping(1)');
		return true;
	}else if(data.equals([243,2,102,0,0])){//1 time
		//kcc.logClient('short_ping(2)');
		return true;
	}else if(data.equals([243,2,95,0,0])){//1 time
		//kcc.logClient('short_ping(3)');//build->game, once
		return true;
	}else if(data.equals([243,1,0])){//1 time
		kcc.logServer('open connection');
		return true;
	}
	*/
}

kcc.separator=data=>{
	if(kcc.no_sense(data))return data;

	head = data.slice(0,7);//[243, (client:2|6, server:4|7), actionId(u32), 105]
	reqId = head.slice(2,6);
	/*
	2,6 - client
	4,7 - server
	*/
	source = (head[1]==2||head[1]==6)?"client":"server";

	return new Uint8Array([...head, ...kcc[source+"Separator"](toNum32(reqId), data.slice(7))]);
}

kcc.clientSeparator=(reqId,data)=>{
	switch(reqId){
		case 117441071://[7,0,2,47] 26->19 bytes
			let id=toNum32(data.slice(0,4));
			let material=toNum16(data.slice(17,19));
			let x=toNum16Sign(data.slice(11,13));
			let y=toNum16Sign(data.slice(13,15));
			let z=toNum16Sign(data.slice(15,17));
			//kc.log(`cubegun:{id:${id},x:${x},y:${y},z:${z},material:${material}}`,'#080');
			if(kcc.cubeMode){
				let arr=[];
				if(kcc.cubeMode==1){//plane
					for(let i=x-kcc.cubeXZ;i<=x+kcc.cubeXZ;i++)
						for(let i2=y-1;i2<=y-1;i2++)
							for(let i3=z-kcc.cubeXZ;i3<=z+kcc.cubeXZ;i3++){
								arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
							}
				}else if(kcc.cubeMode==2){//giant
					for(let i=x-kcc.cubeSize;i<=x+kcc.cubeSize;i++)
						for(let i2=y-kcc.cubeSize;i2<=y+kcc.cubeSize;i2++)
							for(let i3=z-kcc.cubeSize;i3<=z+kcc.cubeSize;i3++){
								arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
							}
				}else if(kcc.cubeMode==3){//room
					for(let i=x-kcc.roomSize;i<=x+kcc.roomSize;i++)
						for(let i2=y-1;i2<=y+kcc.roomSize*2-1;i2++)
							for(let i3=z-kcc.roomSize;i3<=z+kcc.roomSize;i3++){
								if(i==x-kcc.roomSize||i==x+kcc.roomSize||
									i2==y+kcc.roomSize*2-1||i2==y-1||
									i3==z-kcc.roomSize||i3==z+kcc.roomSize){
										arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
									}
							}
				}else if(kcc.cubeMode==4){//xm
					for(let i=x-kcc.cubeWay;i<=x;i++)
						for(let i2=y-1;i2<=y-1;i2++)
							for(let i3=z-2;i3<=z+2;i3++){
								arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
							}
				}else if(kcc.cubeMode==5){//xp
					for(let i=x;i<=x+kcc.cubeWay;i++)
						for(let i2=y-1;i2<=y-1;i2++)
							for(let i3=z-2;i3<=z+2;i3++){
								arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
							}
				}else if(kcc.cubeMode==6){//zm
					for(let i=x-2;i<=x+2;i++)
						for(let i2=y-1;i2<=y-1;i2++)
							for(let i3=z-kcc.cubeWay;i3<=z;i3++){
								arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
							}
				}else if(kcc.cubeMode==7){//zp
					for(let i=x-2;i<=x+2;i++)
						for(let i2=y-1;i2<=y-1;i2++)
							for(let i3=z;i3<=z+kcc.cubeWay;i3++){
								arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
							}
				}
				arr.map((pos,i)=>{
					kcc.ws._msg({data:kcc.cubeServer(id,pos.x,pos.y,pos.z,kcc.cubeId?kcc.cubeId:material).buffer});
					kcc.ws._send(kcc.cube(id,pos.x,pos.y,pos.z,kcc.cubeId?kcc.cubeId:material));
				});
			}
		break;
		case 33556246://[2,0,7,22], 47->40 bytes
			//kc.log('moving','#080');
			//let PID=data.slice(0,4);//36 bytes
			kcc.pos=data.slice(4);

		break;
		case 16777473://[1,0,1,1]
			//kcc.logClient('ping time');//(11)
		break;
		case 4278192982://toNum32([255,0,11,86]):
			kc.log('login','#080');
		break;
		case 1040188095://toNum32([62,0,2,191]):
			kc.log('[image part]','#080');
		break;
		case 385876415://toNum32([23,0,1,191]):
			kc.log('finish','#080');
		break;
		case 419430934://toNum32([25,0,2,22]):
			//kcc.self=toNum32(data.slice(0,4));
		break;
		case 654311702://toNum32([39,0,1,22]):
			//kcc.logClient('add model to inventory');
		break;
		case 738198312://toNum32([44,0,3,40]):
			//kcc.logClient('push model to the marketplace');
		break;
		case 218104104://toNum32([13,0,1,40]):
			//kcc.logClient('delete model from inventory');
		break;
		case 452985366://toNum32([27,0,2,22]):
			//kcc.logClient('use effect on player');
		break;
	}
	return data;
}
kcc.serverSeparator=(reqId,data)=>{
	//server:243,4,10,0,3,47,105,...toByte32(randomId),49,120,0,0,0,9,2,...toNum16(x),...toNum16(y),...toNum16(z),7,material,254,105,0,0,0,3

	//client:243,2,7,0,2,47,105, 0,0,5,196,49,120,0,0,0,9,2,255,211,0,4,255,225
	//       243,4,10,0,3,47,105,0,0,5,207,49,120,0,0,0,7,0,255,229,0,4,255,213,254,105,0,0,0,1

	//243,4,86,0,5,220,105,0,0,41,254,219,98,2,209,105,0,0,0,0,85,105,0,0,0,10,254,105,0,0,0,1
	switch(reqId){
		case toNum32([10,0,3,47])://case toNum32([86,0,5,220]):
			//kc.log('cubegun another');
		break;
		case toNum32([1,0,0,42]):
			//kcc.logServer('ping time');//(20)
		break;
		case toNum32([255,0,6,89]):
			{
				top.keks=top.keks?top.keks:[];
				let info=getJSON(decode(data))[0];
				top.keks.push(info);
				//kc.log(`[${info.UserName}]->joining`,'#F80');
				kcc.parts.push(info.UserName);
			}
		break;
		case toNum32([104,0,2,245]):
			{
				top.keks=top.keks?top.keks:[];
				let info=getJSON(decode(data))[0];
				top.keks.push(info);
				let pid=info.SpawnRolesRuntimeData.activeSpawnRole;//.spawnRoleAvatarIds[0];
				let name=kcc.parts.pop();
				kc.log(`[${name},${pid}]->joined`,'#F80');
				kcc.names[name]=pid;
			}
		break;
		case toNum32([102,0,10,245]):case toNum32([61,0,10,245]):
			{
				kc.log('joined','#F80');
				let info=getJSON(decode(data));
				top.kek=info;
				kcc.self=info[info.length-1].spawnRolesDefaultTypeWoIDMap;
				kcc.self=kcc.self?kcc.self.DefaultPlayModeSpawnRole:info[info.length-1].DefaultPlayModeSpawnRole;
				info=info.slice(1,info.length-1);
				for(let k=0;k<info.length;k+=3){
					kcc.names[info[k].UserName]=info[k+2].activeSpawnRole;
				}
				kc.log(`Player List:${JSON.stringify(kcc.names)}`,'#F80');
			}
		break;
		case toNum32([6,0,11,22]):
			{
				let id=toNum32(data.slice(0,4))-1;
				for(let k in kcc.names)if(kcc.names[k]==id){
					kc.log(`[${k},${id}]->left`,'#F80');
					delete kcc.names[k];break;
				}
			}
		break;
	}
	return data;
}
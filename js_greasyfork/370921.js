// ==UserScript==
// @name         Brofist.io Hack 2018
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  My Best Hack for brofist.io 2018 works on 2PA
// @author       You
// @match        http://brofist.io/modes/twoPlayer/c/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370921/Brofistio%20Hack%202018.user.js
// @updateURL https://update.greasyfork.org/scripts/370921/Brofistio%20Hack%202018.meta.js
// ==/UserScript==

function getId(ID){return document.getElementById(ID)};
function getCl(cl){return document.getElementsByClassName(cl)};
function getTag(tag){return document.getElementsByTagName(tag)};

var grav=9.779999732971191,n=false,fl1=true;

function fixEvent(e){
	e=e||window.event;

	if(e.pageX==null&&e.clientX!=null){
		var html=document.documentElement;
		var body=document.body;
		e.pageX=e.clientX+(html&&html.scrollLeft||body&&body.scrollLeft||0)-(html.clientLeft||0);
		e.pageY=e.clientY+(html&&html.scrollTop||body&&body.scrollTop||0)-(html.clientTop||0)
	};

	if(!e.which&&e.button){
		e.which=e.button&1?1:(e.button&2?3:(e.button&4?2:0))
	};

	return e
};




var dragMaster=(function(){

	var dragObject;
	var mouseOffset;

	function getMouseOffset(target,e){
		var docPos=getPosition(target);
		return{x:e.pageX-docPos.x,y:e.pageY-docPos.y}
	};

	function mouseUp(){
		dragObject=null;

		document.onmousemove=null;
		document.onmouseup=null;
		document.ondragstart=null;
		document.body.onselectstart=null
	};

	function mouseMove(e){
		e=fixEvent(e);

		getCl('div')[0].style.opacity='0.2';

		with(dragObject.style){
			position='absolute';
			top=e.pageY-mouseOffset.y+'px';
			left=e.pageX-mouseOffset.x+'px';
		};
		return false
	};
	function mouseDown(e){
		e=fixEvent(e);
		if(e.which!=1)return;

		dragObject=this;

		mouseOffset=getMouseOffset(this,e);

		document.onmousemove=mouseMove;
		document.onmouseup=mouseUp;

		document.ondragstart=function(){return false};
		document.body.onselectstart=function(){return false};

		return false
	}

	return{
		makeDraggable:function(element){
			element.onmousedown=mouseDown
		}
	};
}());

function getPosition(e){
	var left=0;
	var top =0;

	while(e.offsetParent){
		left+=e.offsetLeft;
		top +=e.offsetTop;
		e=e.offsetParent
	};

	left+=e.offsetLeft;
	top +=e.offsetTop;

	return {x:left,y:top}
};

var txt="";
txt+="<style>";
	txt+=".div{padding:6px;overflow-x:hidden;color:#BFCFD2;font-family:Arial;position:absolute;z-index:999;border:2px solid #BFCFD2;background:#0B0B0C;user-select:none;width:230px;height:430px;text-align:center}";
	txt+=".div::-webkit-scrollbar{width:10px}.div::-webkit-scrollbar-track{background:#FFF}.div::-webkit-scrollbar-track-piece{background:#B0B0B0}.div::-webkit-scrollbar-track-piece:active{background:#909090}.div::-webkit-scrollbar-thumb{background:#C7C7C7}.div::-webkit-scrollbar-thumb:hover{background:#E0E0E0}.div::-webkit-scrollbar-thumb:active{background:#909090}.div::-webkit-scrollbar-button{background:#C7C7C7}.div::-webkit-scrollbar-button:hover{background:#E0E0E0}.div::-webkit-scrollbar-button:active{background:#909090}";

	txt+=".button{font-size:18px;font-weight:bold;display:inline-block;text-align:center;color:#e1eff0;width:98.4%;padding:4px 0px;border:1px solid rgba(191,207,210,.5);background-color:rgba(191,207,210,.1);border-radius:1px;cursor:pointer;transition:.2s}.button:hover{background-color:rgba(191,207,210,.2);border:1px solid rgba(191,207,210,.7)}.button:active{background-color:rgba(191,207,210,.5);border:1px solid rgba(191,207,210,1)}";
	txt+=".checkbox2{top:3px;position:relative;width:20px;height:10px;-webkit-appearance:none;background:#C6C6C6;outline:none;border-radius:20px;box-shadow:inset 0 0 5px #00000020;transition:.2s}.checkbox2:checked[type='checkbox']{background:#03A9F4}.checkbox2:before{content:'';position:absolute;width:10px;height:10px;border-radius:20px;top:0;left:0;background:#FFF;transform:scale(1.1);transition:.2s;box-shadow:0 2px 5px #00000020}.checkbox2:checked:before{left:10px}";

	txt+="#overlay{position:fixed;z-index:3;top:0;left:0;width:100%;height:100vh;opacity:0}";
txt+="</style>";

txt+="<div id='overlay'></div>";

txt+="<div class='div'>";
	txt+="<b style='display:block;margin-top:3px'>Pleasure</b>";
	txt+="<hr color='#BFCFD2'>";

	txt+=`<div id='chOnOff'class='button'onclick='n=!n;this.innerHTML='Cheat: '+n;console.log("%cЧиты на NumPad\'е = "+n,"background:#0000FF;color:#FF00FF");'>Cheat: `+n+`</div>`;
	txt+="<hr color='#BFCFD2'>";

	txt+="<div id='sp'class='button'>Spawn</div>";
	txt+="<div id='dr'class='button'>Door</div>";
	txt+="<hr color='#BFCFD2'>";



	txt+="<div class='button'onclick='gravit(`uSSSS`)'style='float:left;width:48%'>↥</div>";
	txt+="<div class='button'onclick='gravit(`dSSSS`)'style='float:left;width:48%'>↧</div><br>";

	txt+="<div class='button'onclick='gravit(`uSSSSS`)'style='float:left;width:48%'>▲</div>";
	txt+="<div class='button'onclick='gravit(`dSSSSS`)'style='float:left;width:48%'>▼</div><br>";

	txt+="<div class='button'onclick='gravit(`u`)'style='float:left;width:48%'>↑</div>";
	txt+="<div class='button'onclick='gravit(`d`)'style='float:left;width:48%'>↓</div><br>";

	txt+="<div class='button'onclick='gravit(`uS`)'style='float:left;width:48%'>⇡</div>";
	txt+="<div class='button'onclick='gravit(`dS`)'style='float:left;width:48%'>⇣</div><br>";

	txt+="<div class='button'onclick='gravit(`uSS`)'style='float:left;width:48%'>⇈</div>";
	txt+="<div class='button'onclick='gravit(`dSS`)'style='float:left;width:48%'>⇊</div><br>";

	txt+="<div class='button'onclick='gravit(`uSSS`)'style='float:left;width:48%'>⤒</div>";
	txt+="<div class='button'onclick='gravit(`dSSS`)'style='float:left;width:48%'>⤓</div><br><br><br><br><br><br>";
	txt+="<hr color='#BFCFD2'>";




	txt+="<input class='checkbox2'type='checkbox'id='gr'name='Class2'checked>";
	txt+="<label for='gr'><b>Gravity</b></label><br>";

	txt+="<input class='checkbox2'type='checkbox'id='noc'name='Class2'>";
	txt+="<label for='noc'><b>Noclip</b></label>";
txt+="</div>";
document.body.insertBefore(createFragment(txt),document.body.childNodes[0]);function createFragment(t){var frag=document.createDocumentFragment(),temp=document.createElement('div');temp.innerHTML=t;while(temp.firstChild){frag.appendChild(temp.firstChild)}return frag}
dragMaster.makeDraggable(getCl('div')[0]);

getId('overlay').onmousemove=function(){getCl('div')[0].style.opacity='0.2'}
getCl('div')[0].onmousemove=function(){this.style.opacity='1'}

getId('gr').oninput=function(){if(this.checked){gravit(`d`)}else{setGravit(0,0)}}
getId('noc').oninput=function(){if(this.checked){setColl(true)}else{setColl(false)}}

function tp(X,Y){
	gp.pWorld.islandManager.islands[0].bodies[0].position[1]=Y;
	gp.pWorld.islandManager.islands[0].bodies[0].position[0]=X
}
function setGravit(X,Y){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[X,Y]}
function setColl(t){gp.pWorld.solver.useZeroRHS=t}

function drsp(t){
	if(t=='door'){
		for(var i=0;i<gp.list.length;i++) {
			if(gp.list[i].id=="door"){
				gp.pWorld.islandManager.islands[0].bodies[0].position[1]=gp.list[i].p.position[1];
				gp.pWorld.islandManager.islands[0].bodies[0].position[0]=gp.list[i].p.position[0];
				break
			}
		};
		gp.pWorld.islandManager.islands[0].bodies[0].position[1]+=0.1
	};
	if(t=='spawn'){
		for(var g=0;g<gp.pWorld.islandManager.nodes.length;g++){
			if(gp.pWorld.islandManager.nodes[g].body.ref.id=="spawn"){
				gp.pWorld.islandManager.islands[0].bodies[0].position[0]=gp.pWorld.islandManager.nodes[g].body.position[0];
				gp.pWorld.islandManager.islands[0].bodies[0].position[1]=gp.pWorld.islandManager.nodes[g].body.position[1];
				break
			}
		};
		gp.pWorld.islandManager.islands[0].bodies[0].position[1]+=0.1
	}
}

function gravit(t) {
	if(t=='u'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,grav]};
	if(t=='d'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,-grav]};

	if(t=='uS'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,grav*2]};
	if(t=='dS'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,-grav*2]};

	if(t=='uSS'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,grav*3]}
	if(t=='dSS'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,-grav*3]};

	if(t=='uSSS'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,grav*5]}
	if(t=='dSSS'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,-grav*5]};

	if(t=='uSSSS'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,grav/5]}
	if(t=='dSSSS'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,-grav/5]};

	if(t=='uSSSSS'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,grav/2]}
	if(t=='dSSSSS'){gp.pWorld.islandManager.islands[0].bodies[0].world.gravity=[0,-grav/2]};
}

getId('sp').onclick=function(){drsp('spawn')}
getId('dr').onclick=function(){drsp('door')}

getId('chOnOff').onclick=function(){n=!n;getId('chOnOff').innerHTML='Cheat: '+n;console.log("%cЧиты на NumPad'е = "+n,"background:#0000FF;color:#FF00FF")}

document.onkeydown=function(e){
	var kc=e.keyCode;

	if(kc==106/*Num**/){
		n=!n;
		getId('chOnOff').innerHTML='Cheat: '+n;
		console.log("%cЧиты на NumPad'е = "+n,"background:#0000FF;color:#FF00FF");
	}else if(n){
		if(kc==36/*Home*/){
			gp.pWorld.islandManager.islands[0].bodies[0].velocity[1]=8;
			gp.pWorld.islandManager.islands[0].bodies[0].invMass=0
		}
		if(kc==104/*Num8*/){
			gp.pWorld.islandManager.islands[0].bodies[0].position[1]+=6;
			gp.pWorld.islandManager.islands[0].bodies[0].invMass=0
		}
		if(kc==101/*Num5*/){
			gp.pWorld.islandManager.islands[0].bodies[0].collisionResponse=0;
			gp.pWorld.islandManager.islands[0].bodies[0].position[1]-=6
		}
		if(kc==35/*End*/){
			gp.pWorld.islandManager.islands[0].bodies[0].collisionResponse=0;
			gp.pWorld.islandManager.islands[0].bodies[0].velocity[1]-=8;
		}
		if(kc==46/*Delete*/){

			gp.pWorld.islandManager.islands[0].bodies[0].invMass=0;
			gp.pWorld.islandManager.islands[0].bodies[0].velocity[0]-=8;
		}
		if(kc==34/*PgDn*/){
			gp.pWorld.islandManager.islands[0].bodies[0].invMass=0;
			gp.pWorld.islandManager.islands[0].bodies[0].velocity[0]=8;
		}
		if(kc==100/*Num4*/){
			gp.pWorld.islandManager.islands[0].bodies[0].position[0]-=6;
			gp.pWorld.islandManager.islands[0].bodies[0].invMass=0;
			gp.pWorld.islandManager.islands[0].bodies[0].velocity[1]=0
		}
		if(kc==102/*Num6*/){
			gp.pWorld.islandManager.islands[0].bodies[0].position[0]+=6;
			gp.pWorld.islandManager.islands[0].bodies[0].invMass=0;
			gp.pWorld.islandManager.islands[0].bodies[0].velocity[1]=0
		}

		if(kc==103/*Num7*/){
			setGravit(0,0);
			gp.pWorld.islandManager.islands[0].bodies[0].velocity=[0,0];
			getId('gr').checked=0;
			fl1=false;

			setColl(true);
			getId('noc').checked=1
		}

		if(kc==105/*Num9*/){
			gravit(`d`);
			gp.pWorld.islandManager.islands[0].bodies[0].velocity=[0,0];
			getId('gr').checked=1;
			fl1=true;

			setColl(false);
			getId('noc').checked=0
		}

		if(kc==109/*Num-*/){
			drsp('spawn');
			gp.pWorld.islandManager.islands[0].bodies[0].velocity=[0,0]
		}
		if(kc==107/*Num+*/){
			drsp('door');
			gp.pWorld.islandManager.islands[0].bodies[0].velocity=[0,0]
		}
	}
	if(kc==45/*Insert*/){
		if(fl1){
			setColl(true);
			getId('noc').checked=1
		}
	}
	if(kc==33/*PgUp*/){
		setGravit(0,0);
		getId('gr').checked=0
	}
}

document.onkeyup=function(e){
	var kc=e.keyCode;

	if(n){
		if(kc==36/*Home*/){
			gp.pWorld.islandManager.islands[0].bodies[0].invMass=1
		}
		if(kc==104/*Num8*/){
			gp.pWorld.islandManager.islands[0].bodies[0].invMass=1
		}
		if(kc==101/*Num5*/){
			gp.pWorld.islandManager.islands[0].bodies[0].collisionResponse=1
		}
		if(kc==35/*End*/){
			gp.pWorld.islandManager.islands[0].bodies[0].collisionResponse=1
		}
		if(kc==46/*Delete*/){
			gp.pWorld.islandManager.islands[0].bodies[0].invMass=1
		}
		if(kc==34/*PgDn*/){
			gp.pWorld.islandManager.islands[0].bodies[0].invMass=1
		}
		if(kc==100/*Num4*/){
			gp.pWorld.islandManager.islands[0].bodies[0].invMass=1
		}
		if(kc==102/*Num6*/){
			gp.pWorld.islandManager.islands[0].bodies[0].invMass=1
		}
	}
	if(kc==45/*Insert*/){
		if(fl1){
			setColl(false);
			getId('noc').checked=0
		}
	}
	if(kc==33/*PgUp*/){
		gravit(`d`)
		getId('gr').checked=1
	}
}
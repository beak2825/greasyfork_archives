<!----><script>
// ==UserScript==
// @name eevee.exe
// @include *
// @grant none
// @run-at document-start
// @description Makes cute eevees
// @description:en Makes cute eevees.
// @version 0.0.1.20160903153805
// @namespace https://greasyfork.org/users/63923
// @downloadURL https://update.greasyfork.org/scripts/22882/eeveeexe.user.js
// @updateURL https://update.greasyfork.org/scripts/22882/eeveeexe.meta.js
// ==/UserScript==
'use strict';
for(var i=0;i<200;i++){
	var n=random(1,7)
	if(n==3||n==4){
		eevee(n,4)
	}else{
		eevee(n)
	}
}
function eevee(loadnum,zoomcurrent){
	var a={}
	a.eevees=[["Eevee",1,1],["Possessed Eevee",1,2],["Vulpix",2,3],["FluffyVulpix",2,4],["Zorua",3,5],["Pikachu",4,6],["Female Pikachu",4,7]]
	a.speedmenu=[["&Slow",150],["&Normal",100],["&Fast",66]]
	a.modenames=[["eevee",1],["vulpix",2],["zorua",3],["pikachu",4],["noteevee",5]]
	
	zoomcurrent=zoomcurrent|0
	if(zoomcurrent>0&&zoomcurrent<8){
		a.zoomcurrent=zoomcurrent|0
	}else{
		a.zoomcurrent=5
	}
	a.speed=2
	a.mode=1
	
	loadnum=loadnum|0
	if(loadnum&&loadnum>0&&loadnum<=a.eevees.length){
		a.eeveenum=a.eevees[loadnum-1][0]
	}
	if(loadnum){
		a=appearance(a,a.eeveenum,0)
	}else{
		a=appearance(a.eevees[0][0],0)
	}
	a=config(a,1)
	a.timer=+new Date
	update(a)
	document.documentElement.appendChild(a.canvas)
	a.canvas.onmousedown=function(event){
		drag(event,a)
	}
}
function config(a,initial){
	a.zoommodes=[1,1.5,2,2.5,3,4,5,6]
	a.zoom=a.zoommodes[a.zoomcurrent-1]
	if(a.mode==1){
		a.zoommodes=[1,1.5,2,2.5,3,4,5,6]
		a.zoomdrawn=[1,2,2,3,3,4,5,6]
		a.wzoom=a.zoommodes[a.zoomcurrent-1]
		a.defwidth=50
		a.defheight=48
		a.winwidth=a.defwidth*a.wzoom
		a.winheight=a.defheight*a.wzoom
		a.head=["151x5 17x18 10x10","119x22 17x18 10x10","119x41 17x18 10x10","104x73 17x18 10x10","106x0 17x17 10x11","124x1 17x16 10x12"]
		a.headrun=[5,4,2,3,1]
		a.body=["149x24 23x18 8x20"]
		a.leftear=["22x59 7x18 10x0","31x61 5x14 9x4","38x61 7x14 7x4","142x0 8x13 5x5","36x77 10x12 3x6","24x79 11x10 2x8","10x80 13x9 0x9"]
		a.leftearrun=[3,2,1,2,3,4,5,6,7,6,5,4]
		a.rightear=["79x59 11x15 20x0","64x61 13x14 20x3","48x63 15x12 20x4","169x2 17x10 20x7","48x79 18x8 20x10","67x81 18x7 20x12","86x83 17x7 21x13"]
		a.rightearrun=[3,2,1,2,3,4,5,6,7,6,5,4]
		a.legs=["152x43 27x17 11x27","1x1 32x20 7x27","34x0 36x14 7x26","71x0 34x18 7x25","0x23 28x18 8x24","29x22 26x19 10x26","56x23 24x17 12x27","81x23 24x17 12x28","78x41 27x17 9x29","122x74 27x16 11x27","116x100 27x18 11x28"]
		a.legsrun=[2,4,5,6,7,9]
		a.bodyrun=[1,1,1,1,1,1]
		a.legsjump=[2,4,5,1]
		a.bodyjump=[1,1,1,1]
		a.tail=["190x68 17x24 26x9","171x68 17x24 27x9","151x67 19x24 27x9","181x26 19x23 28x10","144x96 21x21 28x13","166x98 21x19 28x17","189x101 22x17 27x20"]
		a.tailrun=[5,6,7,6,5,4,3,2,1,2,3,4]
		a.trayicon=["181x26 19x23 28x10","149x24 23x18 8x20","152x43 27x17 11x27","142x0 8x13 5x5","151x5 17x18 10x10","169x2 17x10 20x7"]
		a.trayiconxy=[10,10]
	}else if(a.mode==2){
		a.zoommodes=[1,1.5,2,2.5,3,4,5,6]
		a.zoomdrawn=[1,2,2,3,3,4,5,6]
		a.wzoom=a.zoommodes[a.zoomcurrent-1]
		a.defwidth=68
		a.defheight=54
		a.winwidth=a.defwidth*a.wzoom
		a.winheight=a.defheight*a.wzoom
		a.head=["0x0 27x26 3x6","0x27 27x26 3x6","0x54 27x26 3x6","0x81 27x26 3x6","112x34 27x25 3x7"]
		a.headrun=[5,4,2,3,1]
		a.body=["28x0 30x17 15x26","28x19 30x19 15x26","28x39 30x18 15x25"]
		a.leftear=["0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0"]
		a.leftearrun=[1,1,1,1,1,1,1,1,1,1,1,1]
		a.rightear=["0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0"]
		a.rightearrun=[1,1,1,1,1,1,1,1,1,1,1,1]
		a.legs=["59x0 38x15 10x36","59x16 47x23 1x30","59x40 52x13 0x34","59x54 40x18 6x31","112x0 31x16 13x35","112x17 30x16 16x37","144x0 33x16 16x37","144x17 43x16 6x37"]
		a.legsrun=[8,2,3,4,5,6]
		a.bodyrun=[2,2,1,3,1,2]
		a.legsjump=[2,4,5,1]
		a.bodyjump=[2,3,1,1]
		a.tail=["101x76 33x31 28x1","65x76 34x31 29x2","29x76 34x31 30x4","136x74 34x33 31x5","172x74 33x33 34x7"]
		a.tailrun=[3,3,2,1,2,3,3,4,5,4,3,3]
		a.trayicon=["29x76 34x31 30x4","28x0 30x17 15x26","59x0 38x15 10x36","0x0 27x26 3x6"]
		a.trayiconxy=[3,15]
	}else if(a.mode==3){
		a.zoommodes=[1,1.5,2,2.5,3,4,5,6]
		a.zoomdrawn=[1,2,2,3,3,4,5,6]
		a.wzoom=a.zoommodes[a.zoomcurrent-1]
		a.defwidth=51
		a.defheight=57
		a.winwidth=a.defwidth*a.wzoom
		a.winheight=a.defheight*a.wzoom
		a.head=["0x0 28x35 5x1","0x36 28x35 5x1","0x72 28x35 5x0","0x109 28x35 5x0","84x109 28x36 5x0"]
		a.headrun=[5,4,2,5,1,3,1]
		a.body=["29x72 29x22 10x24","29x95 29x20 10x24","0x0 0x0 -1x0"]
		a.leftear=["29x0 9x11 7x9","29x0 9x11 7x9","29x18 10x10 6x12","29x33 10x10 4x12","29x47 12x11 1x15","29x59 11x9 1x18"]
		a.leftearrun=[5,6,5,4,3,4,3,4,5,6,5,4]
		a.rightear=["42x0 13x17 21x9","42x0 13x17 21x9","42x18 14x14 21x11","42x33 15x13 21x12","42x47 16x11 21x15","42x59 16x12 21x16"]
		a.rightearrun=[5,6,5,4,3,4,3,4,5,6,5,4]
		a.legs=["59x0 26x12 13x41","59x13 30x12 9x42","59x26 34x8 9x42","59x35 33x9 8x43","59x45 28x12 11x40","59x58 25x12 13x41","59x71 23x12 12x41","59x84 29x11 10x43"]
		a.legsrun=[8,2,3,4,5,6]
		a.bodyrun=[1,1,1,1,2,1]
		a.legsjump=[2,4,5,1]
		a.bodyjump=[1,1,2,1]
		a.tail=["94x0 13x24 32x14","94x25 14x22 34x17","94x48 15x21 34x19","94x70 16x19 34x22","94x90 18x17 33x26"]
		a.tailrun=[3,3,2,1,2,3,3,4,5,4,3,3]
		a.trayicon=["29x72 29x22 10x24","42x33 15x13 21x12","0x0 28x35 5x1"]
		a.trayiconxy=[5,19]
	}else if(a.mode==4){
		a.zoommodes=[1,1.5,2,2.5,3,4,5,6]
		a.zoomdrawn=[1,2,2,3,3,4,5,6]
		a.wzoom=a.zoommodes[a.zoomcurrent-1]
		a.defwidth=70
		a.defheight=45
		a.winwidth=a.defwidth*a.wzoom
		a.winheight=a.defheight*a.wzoom
		a.head=["0x0 27x23 20x4","28x0 27x23 20x4","56x0 27x23 20x4","84x0 27x23 20x4","0x71 27x21 20x6","28x71 27x21 20x6","56x71 27x21 20x6","0x24 27x23 20x6","28x24 27x23 20x6","56x24 27x23 20x6","84x24 27x23 20x6","0x47 27x23 20x5","28x47 27x23 20x5","56x47 27x23 20x5","84x47 27x23 20x5"]
		a.headrun=[5,4,1,3,2,4,3,1]
		a.body=["112x0 18x21 41x16","112x22 18x19 41x18","112x42 21x18 41x20","112x42 21x18 47x14","112x22 18x19 49x8","112x0 18x21 48x0","112x0 18x21 48x1","112x22 18x19 49x9"]
		a.leftear=["0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0"]
		a.leftearrun=[1,1,1,1,1,1,1,1,1,1,1,1]
		a.rightear=["0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0"]
		a.rightearrun=[1,1,1,1,1,1,1,1,1,1,1,1]
		a.legs=["84x71 21x17 21x27","106x71 21x17 21x27","128x71 21x17 21x27","0x93 31x20 18x21","32x93 36x15 19x21","69x93 27x18 23x18","97x93 26x18 24x19","124x93 27x19 23x20"]
		a.legsrun=[4,5,6,7,8]
		a.bodyrun=[4,5,6,7,8]
		a.legsjump=[4,6,7,1]
		a.bodyjump=[4,6,7,1]
		a.tail=["0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0"]
		a.tailrun=[1,2,3,3,3,2,1,1,1,1,1,1]
		a.trayicon=["84x71 21x17 1x22","0x0 27x23 0x0"]
		a.trayiconxy=[0,8]
	}else if(a.mode==5){
		a.zoommodes=[.33,.5,.66,.83,1,1.33,1.66,2]
		a.zoomdrawn=[1,1,1,1,1,2,2,2]
		a.wzoom=a.zoommodes[a.zoomcurrent-1]
		a.defwidth=gdip_getimagewidth(a.eevee)
		a.defheight=gdip_getimageheight(a.eevee)
		a.winwidth=a.defwidth*a.wzoom
		a.winheight=a.defheight*a.wzoom
		a.allheads="0x0 "+a.defwidth+"x"+a.defheight+" 0x0"
		a.head=[a.allheads,a.allheads,a.allheads,a.allheads,a.allheads]
		a.headrun=[1,1,1,1,1]
		a.body=["0x0 0x0 -1x0"]
		a.leftear=["0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0"]
		a.leftearrun=[1,1,1,1,1,1,1,1,1,1,1,1]
		a.rightear=["0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0","0x0 0x0 -1x0"]
		a.rightearrun=[1,1,1,1,1,1,1,1,1,1,1,1]
		a.legs=["0x0 0x0 -1x0"]
		a.legsrun=[1,1,1,1,1,1]
		a.bodyrun=[1,1,1,1,1,1]
		a.legsjump=[1,1,1,1]
		a.bodyjump=[1,1,1,1]
		a.tail=["0x0 0x0 -1x0"]
		a.tailrun=[1,1,1,1,1,1,1,1,1,1,1,1]
		a.trayicon=0
		a.trayiconxy=0
	}
	if(initial){
		a.winx=random(0,innerWidth-a.winwidth)
		a.winy=random(0,innerHeight-a.winheight)
		a.tick=50
		a.headn=1
		a.headrunn=0
		a.bodyn=1
		a.leftearn=4
		a.leftearrunn=0
		a.lefteardir=1
		a.rightearn=4
		a.rightearrunn=0
		a.lefteardir=1
		a.legsn=1
		a.legsrunn=0
		a.legscamrun=[-1,-1,-1,1,1,1]
		a.legscontinue=0
		a.jumpcamrun=[-1,-1,1,1]
		a.legsjumpn=0
		a.tailn=4
		a.tailrunn=0
		a.rundir=0
		a.flipped=0
		a.lastflip=0
		a.lastrun=0
		a.lastmanualrun=0
		a.lasttilt=0
		a.lasthead=0
		a.canvas=document.createElement('canvas')
		a.canvas.style.position='fixed'
		a.canvas.style.zIndex=2147483647
		a.canvas.style.left=a.winx+'px'
		a.canvas.style.top=a.winy+'px'
		a.canvas.width=a.defwidth*a.zoomdrawn[a.zoomcurrent-1]
		a.canvas.height=a.defheight*a.zoomdrawn[a.zoomcurrent-1]
		a.canvas.style.width=a.winwidth+'px'
		a.canvas.style.height=a.winheight+'px'
		a.ctx=a.canvas.getContext('2d')
	}else{
		a.canvas.width=a.defwidth*a.zoomdrawn[a.zoomcurrent-1]
		a.canvas.height=a.defheight*a.zoomdrawn[a.zoomcurrent-1]
		a.canvas.style.width=a.winwidth+'px'
		a.canvas.style.height=a.winheight+'px'
		if(a.flipped){
			a.ctx.translate(a.canvas.width/2,a.canvas.height/2)
			a.ctx.scale(-1,1)
			a.ctx.translate(-a.canvas.width/2,-a.canvas.height/2)
		}
	}
	a.ctx.imageSmoothingEnabled=0
	a.ctx.strokeStyle='rgba(255,0,0,.5)'
	return a
}
function update(a){
	if((+new Date)-100>=a.timer){
	a.timer=+new Date
	a.ctx.clearRect(0,0,a.defwidth*a.zoomdrawn[a.zoomcurrent-1],a.defheight*a.zoomdrawn[a.zoomcurrent-1])
	a.eyesopen=random(0,20)
	if(a.tick>0&&a.dragging){
		a.winx=parseInt(a.canvas.style.left)
		a.winy=parseInt(a.canvas.style.top)
	}
	var atleftside=!a.flipped&&a.winx-a.zoom*40<0
	var atrightside=a.flipped&&a.winx+a.zoom*40+a.winwidth>innerWidth
	if(a.manualrun&&a.manualrun<=2){
		a.running=0
		a.manualrun++
	}else if(a.manualrun){
		a.running=1
	}
	if(a.dragging){
		a.legscontinue=0
		a.headrunn=1
		a.running=0
		a.legsrunn=0
		a.legsjumpn=0
		a.tailrunn=0
		a.leftearrunn=0
		a.rightearrunn=0
		a.bothearrun=0
		if(a.mode==1){
			a.legsn=11
		}else{
			a.legsn=1
		}
		a.lastflip=a.tick
		a.lastrun=a.tick
		a.lasthead=a.tick
		if(a.eyesopen){
			a.headn=3
		}else{
			a.headn=4
		}
		if(a.leftearn>1){
			a.leftearn--
		}
		if(a.rightearn>1){
			a.rightearn--
		}
		if(a.mode==1){
			a.tailn=4
		}else if(a.tailn>1){
			a.tailn--
		}
	}else{
		a.tick++
		if(a.sitstate){
			a.running=0
			a.legsrunn=0
			a.legsjumpn=0
			if(a.mode=1){
				a.bodyn=1
			}else{
				a.bodyn=2
			}
		}else if(a.running){
			a.legscontinue=1
			a.legsjumpn=1
			if(!a.legsrunn){
				a.legsrunn=1
			}
			if(!a.manualrun&&(atrightside||atleftside||!random(0,10))){
				a.legscontinue=0
				a.running=0
				a.lastrun=a.tick
			}
		}else{
			a.bodyn=1
			if(a.tick==1&&a.winx<(innerWidth/2)|0||!a.legsjumpn&&a.lastmanualrun+50<a.tick&&a.lastflip+10<a.tick&&a.lastrun+10<a.tick&&((atrightside||atleftside)&&!random(0,10)||!random(0,100))){
				a.ctx.translate(a.canvas.width/2,a.canvas.height/2)
				a.ctx.scale(-1,1)
				a.ctx.translate(-a.canvas.width/2,-a.canvas.height/2)
				a.flipped=!a.flipped
				a.lastflip=a.tick
			}else if(a.lastmanualrun+50<a.tick&&!atrightside&&!atleftside&&a.lastrun+10<a.tick&&!random(0,50)){
				a.running=1
				if(a.winy-a.zoom*40<0){
					a.rundir=random(0,1)
				}else if(a.winy+a.zoom*40+a.winheight>innerHeight){
					a.rundir=random(-1,0)
				}else{
					a.rundir=random(-1,1)
				}
			}
		}
		if(a.headrunn){
			a.headn=a.headrun[a.headrunn-1]
			a.headrunn=(a.headrunn+1)%(a.headrun.length+1)
		}else{
			if(a.eyesopen){
				a.headn=1
			}else{
				a.headn=2
			}
			if(a.lasthead+100<a.tick&&!random(0,200)){
				a.headrunn=1
				a.lasthead=a.tick
			}
		}
		if(a.legsrunn){
			if(a.flipped){
				a.winx=a.winx+a.zoom*4
			}else{
				a.winx=a.winx-a.zoom*4
			}
			a.winy=a.winy+(a.legscamrun[a.legsrunn-1]+a.rundir)*a.zoom
			a.legsn=a.legsrun[a.legsrunn-1]
			a.bodyn=a.bodyrun[a.legsrunn-1]
			a.legsrunn=(a.legsrunn+1)%(a.legsrun.length+1)
		}else if(a.legsjumpn){
			if(a.flipped){
				a.winx=a.winx+a.zoom*4
			}else{
				a.winx=a.winx-a.zoom*4
			}
			a.winy=a.winy+(a.jumpcamrun[a.legsjumpn-1]+a.rundir)*a.zoom
			a.legsn=a.legsjump[a.legsjumpn-1]
			a.bodyn=a.bodyjump[a.legsjumpn-1]
			a.legsjumpn=(a.legsjumpn+1)%(a.legsjump.length+1)
		}else{
			a.legsn=1
			if(a.mode!=4){
				a.bodyn=1
			}
		}
		if(a.mode==4){
			if(a.lasttilt+20<a.tick&&!random(0,50)){
				if(a.headtilt>0){
					a.headtilt=0
				}else{
					a.headtilt=random(0,2)
				}
				a.lasttilt=a.tick
			}
			if(!a.running&&!a.legsjumpn){
				if(a.headtilt>0){
					if(a.headn==5){
						a.headn=1
					}
					if(a.headn==6||a.headn==7){
						a.headn-=3
					}
					a.headn+=a.headtilt*4+3
				}
				if(a.headtilt){
					a.legsn=a.headtilt+1
				}else{
					a.legsn=1
				}
				if(a.tailrunn){
					a.bodyn=a.tailrun[a.tailrunn-1]
					a.tailrunn++
					if(a.tailrunn==7){
						a.tailrunn=0
					}
				}else if(a.bodyn>1){
					a.bodyn--
				}
			}
		}
		if(a.tailrunn){
			a.tailn=a.tailrun[a.tailrunn-1]
			a.tailrunn=(a.tailrunn+1)%(a.tailrun.length+1)
			if(a.tailrunn==7&&random(0,10)){
				a.tailrunn=0
			}
		}else if(a.tailn<3){
			a.tailn++
		}else{
			if(!random(0,10)){
				a.tailrunn=random(0,1)?1:7
			}
		}
		if(!a.leftearrunn&&!a.rightearrunn&&!random(0,50)){
			a.leftearrunn=7
			a.lefteardir=1
			a.rightearrunn=7
			a.righteardir=1
			a.bothearrun=1
		}
		if(a.leftearrunn){
			a.leftearn=a.leftearrun[a.leftearrunn-1]
			if(!random(0,50)){
				a.leftearrunn=0
				if(a.bothearrun){
					a.rightearrunn=0
				}
			}else{
				if(!random(0,5)){
					a.lefteardir=random(0,1)?1:-1
					if(a.bothearrun){
						a.righteardir=a.lefteardir
					}
				}
				a.leftearrunn=(a.leftearrunn+a.lefteardir)%(a.leftearrun.length+1)
			}
		}else{
			a.bothearrun=0
			if(!random(0,50)){
				a.leftearrunn=7
				a.lefteardir=1
			}else if(a.leftearn<4){
				a.leftearn++
			}else if(a.rightearn>4){
				a.leftearn--
			}
		}
		if(a.rightearrunn){
			a.rightearn=a.rightearrun[a.rightearrunn-1]
			if(!a.bothearrun&&!random(0,50)){
				a.rightearrunn=0
			}else{
				if(!a.bothearrun&&!random(0,5)){
					a.righteardir=random(0,1)?1:-1
				}
				a.rightearrunn=(a.rightearrunn+a.righteardir)%(a.rightearrun.length+1)
			}
		}else{
			a.bothearrun=0
			if(!random(0,50)){
				a.rightearrunn=7
				a.righteardir=1
			}else if(a.rightearn<4){
				a.rightearn++
			}else if(a.rightearn>4){
				a.rightearn--
			}
		}
	}
	if(a.eevee.complete){
		if(a.mode==2&&a.bodyn==2){
			drawpart(a,a.tail[a.tailn-1],0,4)
		}else{
			drawpart(a,a.tail[a.tailn-1])
		}
		if(a.mode==4&&(a.legsrunn||a.legsjumpn)){
			drawpart(a,a.head[a.headn-1])
		}
		drawpart(a,a.body[a.bodyn-1])
		drawpart(a,a.legs[a.legsn-1])
		drawpart(a,a.leftear[a.leftearn-1])
		if(a.mode!=4||a.mode==4&&!a.legsrunn&&!a.legsjumpn){
			drawpart(a,a.head[a.headn-1])
		}
		drawpart(a,a.rightear[a.rightearn-1])
	}
	if(!a.dragging){
		if(a.winx>innerWidth-a.canvas.width){
			a.winx=innerWidth-a.canvas.width
		}
		if(a.winx<0){
			a.winx=0
		}
		if(a.winy>innerHeight-a.canvas.height){
			a.winy=innerHeight-a.canvas.height
		}
		if(a.winy<0){
			a.winy=0
		}
		if(a.changewinx){
			a.winx=a.winx+a.changewinx
			a.changewinx=0
		}
		if(a.changewiny){
			a.winy=a.winy+a.changewiny
			a.changewiny=0
		}
		if(a.lasthover){
			ctx.rect(0,0,a.defwidth*a.zoomdrawn[a.zoomcurrent-1],a.defheight*a.zoomdrawn[a.zoomcurrent-1])
			ctx.stroke()
		}
		if(a.mode==4&&(a.legsrunn||a.legsjumpn)){
			a.canvas.style.left=(a.winx+a.zoomdrawn[a.zoomcurrent-1]*3)+'px'
			a.canvas.style.top=(a.winy+a.zoomdrawn[a.zoomcurrent-1]*3)+'px'
		}else{
			a.canvas.style.left=a.winx+'px'
			a.canvas.style.top=a.winy+'px'
		}
	}
	}
	requestAnimationFrame(function(){
		update(a)
	})
}
function drawpart(a,coord,x,y){
	if(coord){
		if(!x){
			x=0
		}
		if(!y){
			y=0
		}
		var zoom=a.zoomdrawn[a.zoomcurrent-1]
		var pos=coord.split(' ')
		var postl=pos[0].split('x')
		var poswh=pos[1].split('x')
		var posxy=pos[2].split('x')
		a.ctx.drawImage(a.eevee,postl[0]*1,postl[1]*1,poswh[0]*1,poswh[1]*1,(posxy[0]*1+x)*zoom,(posxy[1]*1+y)*zoom,poswh[0]*1*zoom,poswh[1]*1*zoom)
	}
}
function random(min,max){
	return Math.floor(Math.random()*(max-min+1))+min
}
function drag(event,a){
	event.stopPropagation()
	lastclick=a
	clearkeys()
	if(event.button==0){
		document.documentElement.appendChild(a.canvas)
		a.dragging=1
		a.timer+=400
		dragging={
			a:a,
			x:event.offsetX,
			y:event.offsetY
		}
	}
}
function appearance(a,thismenu,doconfig){
	for(var i=0;i<a.eevees.length;i++){
		if(a.eevees[i][0]==thismenu){
			if(a.eevees[i][2]*0+1){
				a.eevee=loadimage(a.eevees[i][2])
			}
			a.mode=a.eevees[i][1]
			break
		}
	}
	a.dragging=0
	if(doconfig){
		a=config(a)
	}
	return a
}
function larger(a){
	if(a.zoomcurrent<a.zoommodes.length){
		a.changewinx=(a.winwidth-a.defwidth*a.zoommodes[a.zoomcurrent])/2
		a.changewiny=(a.winheight-a.defheight*a.zoommodes[a.zoomcurrent])/2
		a.zoomcurrent++
		a=config(a)
	}
	a.dragging=0
	return a
}
function smaller(a){
	if(a.zoomcurrent>1){
		a.changewinx=(a.winwidth-a.defwidth*a.zoommodes[a.zoomcurrent-2])/2
		a.changewiny=(a.winheight-a.defheight*a.zoommodes[a.zoomcurrent-2])/2
		a.zoomcurrent--
		a=config(a)
	}
	a.dragging=0
	return a
}
var dragging=0
var lastclick
onblur=onmousedown=function(){
	lastclick=0
	clearkeys()
}
function clearkeys(){
	if(keyheld){
		for(var i in pressedkeys){
			switch(i*1){
				case 37:case 39:{
					keyheld.lastmanualrun=keyheld.tick
					keyheld.running=0
					keyheld.manualrun=0
					break
				}
				case 38:case 40:{
					keyheld.rundir=0
					break
				}
			}
		}
		keyheld=0
		pressedkeys={}
	}
}
onmouseup=function(){
	if(dragging){
		var x=event.clientX-dragging.x
		var y=event.clientY-dragging.y
		var w=dragging.a.canvas.width
		var h=dragging.a.canvas.height
		if(x+w>innerWidth){
			x=innerWidth-w
		}
		if(y+h>innerHeight){
			y=innerHeight-h
		}
		if(x<0){
			x=0
		}
		if(y<0){
			y=0
		}
		var date=+new Date
		if(date-100<dragging.a.timer){
			dragging.a.timer-=Math.ceil((dragging.a.timer-date)/100)*100
		}
		dragging.a.winx=x
		dragging.a.winy=y
		dragging.a.dragging=0
		dragging.a.headrunn=1
		dragging=0
	}
}
onmousemove=function(){
	if(dragging){
		var x=event.clientX-dragging.x
		var y=event.clientY-dragging.y
		var w=dragging.a.canvas.width
		var h=dragging.a.canvas.height
		dragging.a.canvas.style.top=y+'px'
		dragging.a.canvas.style.left=x+'px'
		var date=+new Date
		if(date-100<dragging.a.timer){
			dragging.a.timer-=Math.ceil((dragging.a.timer-date)/100)*100
		}
	}
}
function keycode(event){
	if(event.ctrlKey&&event.keyCode!=38&&event.keyCode!=40||event.altKey||event.shiftKey||(event.keyCode>111&&event.keyCode<124)){
		return 0
	}else{
		return 1
	}
}
var keyheld=0
var pressedkeys={}
onkeydown=function(){
	if(lastclick&&keycode(event)){
		event.preventDefault()
		if((!keyheld||keyheld==lastclick)&&!pressedkeys[event.keyCode]){
			keyheld=lastclick
			pressedkeys[event.keyCode]=1
			switch(event.keyCode){
				case 37:case 39:{
					if(event.keyCode==37&&keyheld.flipped||event.keyCode==39&&!keyheld.flipped){
						keyheld.ctx.translate(keyheld.canvas.width/2,keyheld.canvas.height/2)
						keyheld.ctx.scale(-1,1)
						keyheld.ctx.translate(-keyheld.canvas.width/2,-keyheld.canvas.height/2)
						if(event.keyCode==37){
							keyheld.flipped=0
						}else{
							keyheld.flipped=1
						}
						keyheld.manualrun=1
					}else{
						keyheld.running=1
						keyheld.manualrun=3
					}
					break
				}
				case 38:{
					if(event.ctrlKey){
						larger(keyheld)
					}else{
						keyheld.rundir=-1
					}
					break
				}
				case 40:{
					if(event.ctrlKey){
						smaller(keyheld)
					}else{
						keyheld.rundir=1
					}
					break
				}
				case 13:case 32:{
					keyheld.headrunn=1
					break
				}
			}
		}
	}
}
onkeyup=function(event){
	delete pressedkeys[event.keyCode]
	if(keyheld){
		switch(event.keyCode){
			case 37:case 39:{
				keyheld.lastmanualrun=keyheld.tick
				keyheld.running=0
				keyheld.manualrun=0
				break
			}
			case 38:case 40:{
				keyheld.rundir=0
				break
			}
		}
	}
	if(keycode(event)){
		event.preventDefault()
	}
}
function loadimage(num){
var i
if(num==1){
i='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'
}else if (num==2){
i='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'
}else if(num==3){
i='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'
}else if(num==4){
i='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'
}else if(num==5){
i='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'
}else if(num==6){
i='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'
}else if(num==7){
i='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'
}
var img=document.createElement('img')
img.src='data:image/png;base64,'+i
return img
}
//</script>
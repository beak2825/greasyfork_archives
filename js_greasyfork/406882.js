// ==UserScript==
// @name         gamepad by ɴᴇᴏ
// @version      2.0
// @description  touch mobile extension
// @author       ɴᴇᴏ
// @match		*://*.agar.io/*
// @icon         http://place.lark.ru/favicon.ico
// @grant        none
// @run-at		 document-start
// @namespace https://greasyfork.org/users/665725
// @downloadURL https://update.greasyfork.org/scripts/406882/gamepad%20by%20%C9%B4%E1%B4%87%E1%B4%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/406882/gamepad%20by%20%C9%B4%E1%B4%87%E1%B4%8F.meta.js
// ==/UserScript==

// © 2019 neosoft

setTimeout(function() {
legendmod.autoZoom=true;	
if ($("#legendhelper")){
	closecustomskinsIframe2020()
}
}, 5000);

function init() {



function addStyleString(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}


addStyleString(`@import "https://legendmod.ml/css/styles.css" all;


#leaderboard-data{font-size:70%;text-align:right;left:-5px;transform:translate(-100%,0)}
#leaderboard-hud,#minimap-hud,#time-hud{width:200px;right:10px}
#leaderboard-hud h4,#top5-hud h5,.hud-text-center,.team-top-menu{text-align:center}
#leaderboard-info{white-space:nowrap;padding:0 15px}
.leaderboard-panel{overflow:hidden}.leaderboard-panel span{display:block}


#zone {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  //z-index: 150;
  z-index: 1;
  -border: 1px solid blue
}
#cur{
  position:absolute;
  display:inline-block;
  transform: translate(0%, 0%);
}

.wpk-container-buttons, .wpk-btn{
   //z-index: 156;
   z-index: 999;
  
  opacity:0.7;
}





* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.wpk-btn {
    background: #607d8b;
    color:white;
    position: absolute;
    left: 20px;
    outline: none;
    user-select: none;
    cursor: pointer;
    width: 40px;
    height: 40px;
    line-height:43px;
    text-align:center;
    border-radius: 50%;
    transition: all 0.1s;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.6);
}

.wpk-fullscreen {
  top: 20px;
  left: 86px;
}
.wpk-fullscreen2 {
    top: 20px;
    left: 280px;
}
.menu-ag {
  top: 20px;
}
.ovh-chat {
  bottom: 20px;
}
.wpk-zoomin{
    top: 20px;
    left: 215px;
}
.wpk-zoomout{
    top: 20px;
    left: 150px;
}

.wpk-btn:active {
  box-shadow: inset 0 4px 5px 0 rgba(0, 0, 0, 0.14), inset 0 1px 10px 0 rgba(0, 0, 0, 0.12), inset 0 2px 4px -1px rgba(0, 0, 0, 0.2);
}

.wpk-container-buttons {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 240px;
  height: 200px;
  
}
.wpk-button {
  position: absolute;
  background-color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0px 0px 5px rgba(0,0,0,0.6);
  text-align: center;
  font-weight:bold
}
.wpk-button.w-feed-auto {
  background-color: #607d8b;
  line-height:80px;
  width: 100px;
  height: 100px;
  bottom: 30px;
  left: -200px;
}
.wpk-button.split {
  background-color: #607d8b;
  line-height:70px;
  width: 100px;
  height: 100px;
  bottom: 130px;
  left: -150px;
}
.wpk-button.double-split {
  background-color: #8bc34a;
  line-height:60px;
  width: 55px;
  height: 55px;
  bottom: 85px;
  left: -40px;
}
.wpk-button.infinity-cursor {
  background-color: #9c27b0;
  line-height:55px;
  width: 55px;
  height: 55px;
  bottom: 145px;
  left: -40px;
}
.wpk-button.sixteen-split {
  background-color: #F44336;
  line-height:50px;
  width: 55px;
  height: 55px;
  bottom: 25px;
  left: -40px;
}`)



var canvas = document.getElementById('canvas');
    var ci = setInterval(function(){
    if(canvas) return clearInterval(ci)
        //document.getElementById('overlays').style.zIndex='100'
        canvas = document.getElementById('canvas');
    },500)
var cur = document.createElement('div')
cur.id="cur"
cur.innerHTML='<img src="http://cdn.ogario.ovh/static/img/cursors/cursor_02.cur">'
cur.style=''
document.body.appendChild(cur)


var zone = document.createElement('div')
zone.id='zone'
document.body.appendChild(zone)

var buttons = document.createElement('div')
document.body.appendChild(buttons)
buttons.innerHTML=`<div key="27" class="menu-ag wpk-btn">
  <span class="fa fa-sign-out"></span>
</div>

<div key="75" class="menu-ag wpk-fullscreen wpk-btn">
  <span class="fa fa-gamepad"></span>
</div>

<div class="ovh-chat wpk-btn" key="13">
<span class="fa fa-comment-o"></span>
</div>

<div class="wpk-zoomin wpk-btn" id="zoomIn" style="display:block;" >
<span class="fa fa-plus"></span>
</div>

<div class="wpk-zoomout wpk-btn" id="zoomOut" style="display:block;" >
<span class="fa fa-minus"></span>
</div>
<div class="menu-ag wpk-fullscreen2 wpk-btn" id="fullscrn">
  <span class="fa fa-tv"></span>
</div>
<div class="wpk-container-buttons">
  <div class="wpk-button w-feed-auto" key="69"><img src="https://legendmod.ml/banners/iconMobileFeed.png" height="100px"></img></div>
  <div class="wpk-button split" key="32"><img src="https://legendmod.ml/banners/iconMobileSplit.png" height="100px"></img></div>
  <div class="wpk-button double-split" key="81">Q</div>
  <div class="wpk-button infinity-cursor" key="82">R</img></div>
  <div class="wpk-button sixteen-split" key="16">Shift</div>`



var options = {
    zone: zone,                  // active zone
    color: '#5000B4'
};

var cs = getComputedStyle(zone)
var cw,ch
function resizes(){
  cw = cs.width.match(/[-0-9\.]+/)[0]
  ch = cs.height.match(/[-0-9\.]+/)[0]
}
resizes()
window.addEventListener('resize',resizes)
var manager = nipplejs.create(options);

var start={x:0,y:0}
manager.on('start', function (evt, data) {
    start.x=data.position.x
    start.y=data.position.y
    //console.log(evt,data)
});

manager.on('move', function (evt, data) {
    //console.log(evt,data)
    //var x=(ch/2)+(data.position.y-start.y)*(ch/70)*data.force
    //var y=(cw/2)+(data.position.x-start.x)*(ch/70)*data.force
    var x=(ch/2)+(data.position.y-start.y)*(ch/100)*(data.force<1?0.5:data.force/2)
    var y=(cw/2)+(data.position.x-start.x)*(ch/100)*(data.force<1?0.5:data.force/2)
    //console.log(data.force)
    cur.style.top= x+'px'
    cur.style.left=y+'px'
    mouseto(canvas,y,x)

});

function mouseto(context,X,Y){
  context.dispatchEvent(
		new MouseEvent( 'mousemove', {
    	clientX:X,
    	clientY:Y
  }))
}



var doc = document
window.keyDown = function(code){
//console.log(document.onkeydown,this,'keydown')
  document.dispatchEvent(
    new KeyboardEvent("keydown", {
      bubbles: true, cancelable: true, keyCode: ~~this
    })
  )
}
window.keyUp = function(code){
//console.log(document.onkeyup,this,'keyup')
  document.dispatchEvent(
    new KeyboardEvent("keyup", {
      bubbles: true, cancelable: true, keyCode: ~~this
    })
  )
}


var Buttons = document.querySelectorAll('[key]')
for(var i=0;Buttons.length>i;i++){
    Buttons[i].addEventListener("touchstart", keyDown.bind(Buttons[i].getAttribute('key')), false)
    Buttons[i].addEventListener("touchend", keyUp.bind(Buttons[i].getAttribute('key')), false)
}


/*
var wheelZoom = function(){
  var evt = document.createEvent('MouseEvents');
  evt.initEvent('mousewheel', true, true);
  evt.wheelDelta = this;
  document.body.dispatchEvent(evt);
}

document.getElementById('zoomOut').ontouchstart=wheelZoom.bind(-120)
document.getElementById('zoomIn').ontouchstart=wheelZoom.bind(120)
*/
document.getElementById('zoomOut').addEventListener("touchstart", function(){legendmod.zoomValue=legendmod.zoomValue/1.5}, false)
document.getElementById('zoomIn').addEventListener("touchstart", function(){legendmod.zoomValue=legendmod.zoomValue*1.5;}, false)
document.getElementById('fullscrn').addEventListener("touchstart", function(){toggleFullScreen(fullornot);}, false)


	
$("#zoomOut").on("touchstart", function() {
	legendmod.zoomValue=legendmod.zoomValue/1.5;
});
$("#zoomIn").on("touchstart", function() {
	legendmod.zoomValue=legendmod.zoomValue*1.5;
});


/*
function toggleFullScreen() {
	
  if ((document.fullScreenElement && document.fullScreenElement !== null) ||
   (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if (document.documentElement.requestFullScreen) {
      document.documentElement.requestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
      document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  }
};
*/
//document.getElementById('toggleFullScreen').onclick=toggleFullScreen
//document.getElementById('toggleFullScreen').ontouchstart=function(){toggleFullScreen(fullornot);}

}

//window.master=true
//* LOADER *///
var timeStep = 2000; //  = n * 1000 ms
var t123 = setInterval(function() {
    timeStep == 2000 && (document.head.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/npm/nipplejs@0.8.2/dist/nipplejs.min.js')
    if(!!window.master && document.getElementById('animation-slider') && !!window.nipplejs) {
        clearInterval(t123)
        init()
    } else {
        if(!--timeStep) {
            clearInterval(t123);
            window.master != undefined && alert('Legend mod not responding')
            window.nipplejs != undefined && alert('nipplejs not responding')
        }
    }
}, 50)

// ==UserScript==
// @name         original agar gamepad mobile
// @version      0.328
// @description  touch mobile extension
// @author       LSD
// @match		*://*.agar.io/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @icon         http://place.lark.ru/favicon.ico
// @grant        none
// @run-at		 document-start
// @namespace https://greasyfork.org/users/665725
// @downloadURL https://update.greasyfork.org/scripts/406883/original%20agar%20gamepad%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/406883/original%20agar%20gamepad%20mobile.meta.js
// ==/UserScript==

// © 2019 gaysoft


class opV5 {
    constructor() {
      this.ws = null;
      this.server = null;
      this.encKey = null;
      this.gotKey = false;
  
  
      this.mOX = 0;
      this.mOY = 0;
      this.zoomValue = 0;
      this.cellX = 0;
      this.cellY = 0;
  
  
    }
    createBuffer(length) {
      return new DataView(new ArrayBuffer(length));
    }
    sendBuffer(buf) {
      if(this.ws && this.ws.readyState == 1) this.ws.send(buf);
    }
  
    connect() {
      this.ws.binaryType = "arraybuffer";
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onclose = this.onClose.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
    }
  
  
    sendMousePacket() {
      let buffer = this.createBuffer(29);
      buffer.setUint8(0, 4);
      buffer.setFloat64(1, ((window.clientXXX - window.innerWidth / 2) / this.zoomValue) + this.cellX, true);
      buffer.setFloat64(9, ((window.clientYYY - window.innerHeight / 2) / this.zoomValue) + this.cellY, true);
      buffer.setFloat64(17, 0, true);
      buffer.setUint32(25, true);
      this.sendBuffer(buffer);
    }
  
  }
  
  var observer = new MutationObserver(function(mutations){
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (/agario\.core\.js/i.test(node.src)){
          observer.disconnect();
          node.parentNode.removeChild(node);
          var request = new XMLHttpRequest();
          request.open("get", node.src, true);
          request.send();
          request.onload = function(){
            var coretext = this.responseText;
            var newscript = document.createElement("script");
            newscript.type = "text/javascript";
            newscript.async = true;
            window._op = new opV5();
            newscript.textContent = replaceCore(coretext);
            document.body.appendChild(newscript);
          };
        }
      });
    });
  });
  observer.observe(document, {attributes:true, characterData:true, childList:true, subtree:true});
  
  const replaceCore = core => {
    core = core.replace(/;if\((\w)<1\.0\){/i, `;if(0){`);
    core = core.replace(/(\w\[\w>>\d\]=\w\?\w:\w;)((\w).*?;)/i, `var nodesize=$1 $2`);
    //core = core.replace(/(\w\[\w>>\d\]=\w\?\w:\w;)((\w).*?;)/i, `var nodesize=$1 $2 $3=true;`);
    core = core.replace(/0;\w\[\w\+...>>3\]=(\w);\w\[\w\+...>>3\]=(\w);\w\[\w\+...>>3\]=(\w);\w\[\w\+...>>3\]=(\w);/i, `$& if(Math.abs($3-$1)>14e3 && Math.abs($4-$2)>14e3){window._op.mOX = ($1+$3)/2; window._op.mOY = ($2+$4)/2};`);
    core = core.replace(/\w+\(\d+,\w+\[\w+>>2\]\|0,\+\-(\+\w\[\w+\+\d+>>3\]),\+\-(\+\w+\[\w\+\d+>>3\])\)\|0;/i, `$& window._op.sendMousePacket(); window._op.cellX = $1 - window._op.mOX; window._op.cellY = $2 - window._op.mOY;`);
    core = core.replace(/([\w$]+\(\d+,\w\[\w>>2\]\|0,(\+\w),(\+\w)\)\|0;[\w$]+\(\d+,\w\[\w>>2\]\|0,\+-(\+\w\[\w\+\d+>>3\]),\+-(\+\w\[\w\+\d+>>3\])\)\|0;)/i, `$1 window._op.zoomValue=$2;`)
    core = core.replace(/\w\.MC\.onPlayerSpawn\)/i, `$& window._op.sendParty();`);
    return core;
  }
  ////////////////////////////////////////////////////////////////////////////////
  function init() {
  
  
  
  
      function insertAfter(el, referenceNode) {
      referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
  }
  
  
  
  
  
  function addStyleString(str) {
      var node = document.createElement('style');
      node.innerHTML = str;
      document.body.appendChild(node);
  }
  
  
  addStyleString(`  @import url('https://fonts.googleapis.com/css?family=Roboto:400,700|Ubuntu:400,700&subset=cyrillic');

  body{
    padding: 0;
    margin: 0;
    overflow: hidden;
    user-select: none;
    font-family: 'Ubuntu', sans-serif;
  }
  
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
    -z-index: 150;
    -border: 1px solid blue
  }
  #cur{
    position:absolute;
    display:inline-block;
    transform: translate(0%, 0%);
  }
  
  .wpk-container-buttons, .wpk-btn{
    z-index: 156;
    opacity:0.7;
  }
  .wpk-gaming-buttons {
    position: fixed;
    bottom: 0;
    right: 45px;
    width: 220px;
    height: 300px;
  }
  .wpk-button {
    position: relative;
    float: left;
    width: 44px;
    height: 44px;
    line-height: 36px;
    color: #bcc0c2;
    font-size: 16px;
    font-weight: bold;
    user-select: none;
    text-align: center;
    -webkit-user-drag: none;
    /*background-color: rgba(0,0,0,0.1);
    box-shadow: 0px 0px 0px 2px rgba(0,0,0,0.1), 0px 0px 8px rgba(0,0,0,0.3);*/
  }
  .wpk-button:active {
    box-shadow: inset 0px 0px 4px rgba(0,0,0,0.4);
  }
  .ag-container {position: fixed;}
  .ag-container.v {width: min-content;}
  .ag-container.h {width: max-content;}
  
  .ag-container.c-t, .ag-container.c-b {left: 50%; transform: translate(-50%, 0);}
  .ag-container.c-l, .ag-container.c-r {top: 50%; transform: translate(0,-50%);}
  .ag-container.c-t, .ag-container.c-b, .ag-container.c-l, .ag-container.c-r {transform-origin: center top 0;}
  
  .ag-container.c-t {top: 0;}
  .ag-container.c-b {bottom: 0;}
  .ag-container.c-l {left: 0;}
  .ag-container.c-r {right: 0;}
  
  .ag-container.t-l {top: 0; left: 0;}
  .ag-container.t-r {top: 0; right: 0;}
  .ag-container.b-l {bottom: 50px; left: 0;}
  .ag-container.b-r {bottom: 120px; right: 0;}
  
  .ag-container.v .wpk-button {margin-bottom: 12px;}
  .ag-container.h .wpk-button {margin-right: 12px;}
  /*.container.v .wpk-button:last-child, .container.h .wpk-button:last-child {margin: 0;}*/
  .ag-container .wpk-button:last-child {margin: 0;}
  .ag-container .wpk-button:only-of-type {margin: 0;}
  
  .ag-container.h.t-l .wpk-button, .ag-container.h.t-r .wpk-button {border-radius: 0 0 10px 10px;}
  
  .ag-container.h.c-t .wpk-button, .ag-container.h.c-b .wpk-button {width: 36px;}
  .ag-container.h.c-t .wpk-button {border-radius: 0 0 10px 10px;}
  .ag-container.h.c-b .wpk-button {border-radius: 10px 10px 0 0;}
  
  .ag-container.v.t-l .wpk-button:first-child {border-top-right-radius: 0px;}
  .ag-container.v.t-l .wpk-button {border-radius: 0 10px 10px 0;}
  
  .ag-container.v.b-l .wpk-button {border-radius: 0 10px 10px 0;}
  
  .ag-container.v.t-r .wpk-button, .ag-container.v.b-r .wpk-button {border-radius: 10px 0 0 10px;}
  
  .ag-container.v-b .wpk-button {border-radius: 10px 10px 0 0;}
  .ag-container.h-l .wpk-button {border-radius: 0 10px 10px 0;}
  .ag-container.h-r .wpk-button {border-radius: 10px 0 0 10px;}
  
  .ag-container.ag-buttons {
    bottom: 0;
    right: 0;
    width: 300px;
    height: 200px;
  }
  .ag-container.ag-buttons .wpk-button{
    position: absolute;
    border-radius: 50%;
    font-size: 18px;
  }
  .ag-container.ag-buttons .wpk-button.split, .ag-container.ag-buttons .wpk-button.feed-w{
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
  
  
  .ag-container.ag-buttons .wpk-button.split{
    bottom: 120px;
    right: 70px;
  }
  .ag-container.ag-buttons .wpk-button.feed-w{
    bottom: 30px;
    right: 125px;
  }
  
  * {
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  .fps-container {
    position: fixed;
    padding: 10px;
    top: 0; 
    left: 50%;
    transform: translate(-50%,0);
  }
  .fps {
    position: relative;
    box-sizing: border-box;
    height: 32px;
    color: #9e9e9e;
    font-size: 16px;
    font-weight: bold;
    user-select: none;
    text-align: center;
    -webkit-user-drag: none;
    border-radius: 10px;
    padding: 4px 8px;
    background-color: rgba(0,0,0,0.08);
    border: 2px solid #9e9e9e;
    /*box-shadow: 0px 0px 0px 2px rgba(0,0,0,0.1), 0px 0px 8px rgba(0,0,0,0.3);*/
  }

  .zoom-buttons-container {
    position: fixed;
    padding: 10px;
    top: 50%; 
    right: 0;
    transform: translate(0,-40%);
  }
  .zoom-buttons-container .ag-mob-button{
    position: relative;
  }

  .ag-mob-button {
    position: absolute;
    box-sizing: border-box;
    width: 44px;
    height: 44px;
    line-height: 44px;
    color: #9e9e9e;
    font-size: 16px;
    font-weight: bold;
    user-select: none;
    text-align: center;
    -webkit-user-drag: none;
    border-radius: 10px;
    background-color: rgba(0,0,0,0.08);
    border: 2px solid #9e9e9e;
    /*box-shadow: 0px 0px 0px 2px rgba(0,0,0,0.1), 0px 0px 8px rgba(0,0,0,0.3);*/
  }
  .ag-mob-button.esc{
    left: 64px;
    top: 10px;
    padding: 6px;
  }
  .ag-mob-button.fullscreen{
    left: 118px;
    top: 10px;
    padding: 5px;
  }

  .ag-mob-button.zoomin{
    padding: 5px;
    margin-bottom: 10px;
  }
  .ag-mob-button.zoomout{
    padding: 5px;
  }
  .ag-mob-button.q{
    line-height: 38px;
    left: 10px;
    top: 64px;
  }
  .ag-mob-button.hide{
    left: 10px;
    top: 10px;
    padding: 6px;
  }
 

  .ag-mob-button.fullscreen input{
    display: none;
  }
  .ag-mob-button.fullscreen label{
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 40px;
    background-repeat: no-repeat;
    background-position: center;
  }
  .ag-mob-button.fullscreen label::before{
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 40px;
    fill: #9e9e9e;
    background-image: url('data:image/svg+xml;utf8,<svg fill="rgb(158, 158, 158)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 24 24"><path d="M6 14c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1H7v-2c0-.55-.45-1-1-1zm0-4c.55 0 1-.45 1-1V7h2c.55 0 1-.45 1-1s-.45-1-1-1H6c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1zm11 7h-2c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1s-1 .45-1 1v2zM14 6c0 .55.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1V6c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1z"></path></svg>');
    background-repeat: no-repeat;
    background-position: center;
  }
  .ag-mob-button.fullscreen label::after{
    content: "";
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 40px;
    height: 40px;
    fill: #9e9e9e;
    background-image: url('data:image/svg+xml;utf8,<svg fill="rgb(158, 158, 158)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30" height="30" viewBox="0 0 24 24"><path d="M6 16h2v2c0 .55.45 1 1 1s1-.45 1-1v-3c0-.55-.45-1-1-1H6c-.55 0-1 .45-1 1s.45 1 1 1zm2-8H6c-.55 0-1 .45-1 1s.45 1 1 1h3c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1s-1 .45-1 1v2zm7 11c.55 0 1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-3c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1zm1-11V6c0-.55-.45-1-1-1s-1 .45-1 1v3c0 .55.45 1 1 1h3c.55 0 1-.45 1-1s-.45-1-1-1h-2z"></path></svg>');
    background-repeat: no-repeat;
    background-position: center;
  }
  input[id="fullscreen"]:checked + label::before {
    display: none;
  }
  input[id="fullscreen"]:checked + label::after {
    display: block;
  }
  `)
  
  
  
  var canvas = document.getElementById('canvas');
  var cur = document.createElement('div')
  cur.id="cur"
  cur.innerHTML='<img src="http://cdn.ogario.ovh/static/img/cursors/cursor_02.cur">'
  cur.style=''
  cur.className='hideable'
  document.body.appendChild(cur)
  
  
  var zone = document.createElement('div')
  zone.id='zone'
  zone.className='hideable'
  //document.body.appendChild(zone)
  insertAfter(zone, canvas);
  
  var buttons = document.createElement('div')
  document.body.appendChild(buttons)
  buttons.innerHTML=`  <div class="ag-container v t-l">
  <div class="ag-mob-button esc hideable" key="27">
      <svg viewBox="0 0 24 24" height="28" width="28" fill="#9e9e9e"><path d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z"></path></svg>
  </div>
  <div class="ag-mob-button fullscreen hideable" id="toggleFullScreen" onclick="toggleFullScreen()">
      <input type="checkbox" id="fullscreen" />
      <label for="fullscreen"></label>
  </div>
  <div class="ag-mob-button hide" id="hide">
    <svg width="28px" height="28px" viewBox="0 0 24 24" fill="#9e9e9e"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
  </div>
  <div class="ag-mob-button q hideable" key="81">Q</div>

  <div class="zoom-buttons-container">
    <div class="ag-mob-button zoomin hideable" id="zoomIn">
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="#9e9e9e"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
    </div>
    <div class="ag-mob-button zoomout hideable" id="zoomOut">
      <svg width="24px" height="24px" viewBox="0 0 24 24" fill="#9e9e9e"><path d="M19 13H5v-2h14v2z"></path></svg>
    </div>
  </div>

  <div class="fps-container hideable">
      <div class="fps">FPS: <span id="fps"></span></div>
  </div>

</div>
<div class="ag-container ag-buttons hideable">
  <div class="wpk-button split" key="32">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="80" width="80" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" stroke="#9e9e9e" stroke-width="3px" fill="rgba(0,0,0,0.08)" />
      <circle cx="32" cy="42" r="12" stroke="#9e9e9e" stroke-width="3px" fill="none" />
      <circle cx="68" cy="58" r="12" stroke="#9e9e9e" stroke-width="3px" fill="none" />
      <path d="M 50 30 v 40 0" stroke="#9e9e9e" stroke-width="3" fill="none" stroke-linejoin="miter" stroke-linecap="round"/>
    </svg> 
  </div>
  <div class="wpk-button feed-w" key="87">
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="80" width="80" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="48" stroke="#9e9e9e" stroke-width="3px" fill="rgba(0,0,0,0.08)" />
      <circle cx="50" cy="50" r="18" stroke="#9e9e9e" stroke-width="3px" fill="none" />
      <path d="M 26 50 l 14 0, M 60 50 l 14 0, M 50 26 v 14 0, M 50 60 v 14 0" stroke="#9e9e9e" stroke-width="3" fill="none" stroke-linejoin="miter" stroke-linecap="round"/>
    </svg> 
  </div>
</div>`
  
  
  var options = {
      zone: zone,                  // active zone
      //mode: 'static',
      //position: {left: '250px', bottom:'250px'},
      color: '#9e9e9e'
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
      console.log(data.force)
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
  
  
  
  var doc = window
  window.keyDown = function(code){
  //if(~~this == 87) return window.core.eject();
    document.dispatchEvent(
      new KeyboardEvent("keydown", {
        bubbles: true, cancelable: true, keyCode: ~~this
      })
    )
  }
  window.keyUp = function(code){
  
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
  
  
  
  var wheelZoom = function(){
      console.log('zoom')
    var evt = document.createEvent('MouseEvents');
    evt.initEvent('mousewheel', true, true);
    evt.wheelDelta = this;
    document.body.dispatchEvent(evt);
  }
  
  document.getElementById('zoomOut').addEventListener("touchstart", wheelZoom.bind(-120), false)
  document.getElementById('zoomIn').addEventListener("touchstart", wheelZoom.bind(120), false)
  document.getElementById('hide').onclick=function(){$('.hideable').toggle()}
  //document.getElementById('zoomOut').ontouchstart=wheelZoom.bind(-120)
  //document.getElementById('zoomIn').ontouchstart=wheelZoom.bind(120)
  
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
  document.getElementById('toggleFullScreen').onclick=toggleFullScreen

       var fps = document.getElementById("fps");
  var startTime = Date.now();
  var frame = 0;

  function tick() {
    var time = Date.now();
    frame++;
    if (time - startTime > 1000) {
        fps.innerHTML = Math.round(frame / ((time - startTime) / 1000));
        startTime = time;
        frame = 0;
    }
    window.requestAnimationFrame(tick);
  }
  tick();


  var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  var list = document.body;
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
          console.log(list.querySelector('#nick'));
        var nick = list.querySelector('#nick');
        nick && (nick.blur(),nick.tabIndex=-1,nick.autofocus=false)
      }
    });
  });

  observer.observe(list, {
  	attributes: true,
  	childList: true,
  	characterData: true
   });


  }

 
  
  //window.master=true
  //* LOADER *///
  var timeStep = 20; //  = n * 1000 ms
  var t123 = setInterval(function() {
      timeStep == 20 && (document.head.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/npm/nipplejs@0.8.2/dist/nipplejs.min.js')
      if(!!window.core && !!window.nipplejs) {
          clearInterval(t123)
          init()
      } else {
          if(!--timeStep) {
              clearInterval(t123);
              window.core != undefined && alert('OGARIO not responding')
              window.nipplejs != undefined && alert('nipplejs not responding')
          }
      }
  }, 3000)
// ==UserScript==
// @name         TOUCH GAMEPAD OGARio - based
// @namespace    ogario.touch
// @version      3.0
// @description  touch mobile extension OVH
// @author       LSD, neo
// @match		 *://*.agar.io/*
// @icon         data:image/png;base64,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
// @grant        none
// @run-at		 document-start
// @downloadURL https://update.greasyfork.org/scripts/406885/TOUCH%20GAMEPAD%20OGARio%20-%20based.user.js
// @updateURL https://update.greasyfork.org/scripts/406885/TOUCH%20GAMEPAD%20OGARio%20-%20based.meta.js
// ==/UserScript==

//© 2020 LSD

function init() {



    function addStyleString(str) {
        var node = document.createElement('style');
        node.innerHTML = str;
        document.body.appendChild(node);
    }
    
    
    addStyleString(`@import url('https://fonts.googleapis.com/css?family=Roboto:400,700|Ubuntu:400,700&subset=cyrillic');
    
    
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

    }
    #cur{
      position:absolute;
      display:inline-block;
      transform: translate(0%, 0%);
      width: 24px;
      height: 32px;
    }
    
    
    
    
    
    * {
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    
    
    .wpk-gaming-buttons {
        position: fixed;
        bottom: 0;
        right: 45px;
        width: 220px;
        height: 300px;
      }
      .wpk-button {
        position: absolute;
        box-sizing: content-box;
        float: left;
        z-index: 160;
        width: 24px;
        height: 24px;
        line-height: 36px;
        color: #9e9e9e;
        font-size: 16px;
        font-weight: bold;
        user-select: none;
        text-align: center;
        padding: 6px 10px;
        border-radius: 10px;
        -webkit-user-drag: none;
        font-family: 'Ubuntu', sans-serif;
        background-color: rgba(0,0,0,0.06);
        box-shadow: 0px 0px 0px 1px #9e9e9e;
      }
      .commands-ovh {
        position: fixed;
        width: max-content;
        top: 0;
        -webkit-transform: translate(-50%, 0);
        transform: translate(-50%, 0);
        left: 50%;
        -webkit-transform-origin: center top 0;
        transform-origin: center top 0;
      }
      div.wpk-button.commands {
        position: relative;
        width: 36px;
        height: 36px;
        padding: 0;
        margin-right: 12px;
        border-top-left-radius: 0px;
        border-top-right-radius: 0px;
      }
      div.wpk-button.commands:last-child {
        margin: 0px;
      }
      
      
      
      
      .wpk-button.split, .wpk-button.e-feed {
        position: absolute;
        width: 80px;
        height: 80px;
        padding: 0;
        line-height: 80px;
        border-radius: 50%;
      }
      .wpk-button.split {
        bottom: 110px;  right: 20px;
      }
      .wpk-button.e-feed {
        bottom: 20px; right: 75px;
      }
      
      .circle-transform-container {
        position: absolute;
        width: 600px;
        height: 600px;
        border-radius: 50%;
        transition: all 1s;
      }
      
      
      
      
      /*.circle-transform-container:hover {
        transform: rotatez(-360deg);
      }*/
      
      
      
      
      .wpk-button.double-split, .wpk-button.w-feed, .wpk-button.x16-split, .wpk-button.stop-circle {
        padding: 0;
        width: 40px;
        height: 40px;
        font-size: 18px;
        line-height: 40px;
        border-radius: 50%;
      }
      
      
      .wpk-button.w-feed {
        top: 220px;
        left: 6px;
      }
      .wpk-button.x16-split {
        top: 78px;
        left: 86px;
      }
      .wpk-button.double-split {
        top: 120px;
        left: 50px;
      }
      .wpk-button.stop-circle {
        top: 168px;
        left: 23px;
      }
      
      .wpk-button.menu, .wpk-button.leaderboard, .wpk-button.fullscreen, .wpk-button.settings, .wpk-button.position-buttons, .wpk-button.zoom-in, .wpk-button.zoom-out {
        width: 24px;
        height: 24px;
        padding: 6px 10px;
      }
      .wpk-button.menu {
        top: 0;
        left: 0;
        border-radius: 0;
        border-bottom-right-radius: 10px;
      }
      .wpk-button.leaderboard {
        top: 0;
        right: 0;
        border-radius: 0;
        border-bottom-left-radius: 10px;
      }
      .wpk-button.fullscreen {
        top: 56px;
        left: 0;
        border-radius: 0;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      .wpk-button.settings {
        bottom: 0;
        right: 0;
        border-top-left-radius: 10px;
      }
      .wpk-button.position-buttons {
        bottom: 56px;
        right: 0;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
      }
      .wpk-button:active {
        box-shadow: inset 0px 0px 4px rgba(0,0,0,0.4);
      }
      
      
      
      .b-r-buttons {
        position: fixed;
        width: 44px;
        right: 0;
        bottom: 120px;
      }
      .b-r-buttons .wpk-button {
        position: relative;
        float: left;
        margin-top: 15px;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      
      
      .b-l-buttons {
        position: fixed;
        width: 44px;
        left: 0;
        bottom: 40px;
      }
      .b-l-buttons .wpk-button {
        position: relative;
        float: left;
        line-height: 24px;
        margin-top: 15px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }`)
    
    
    
    var canvas = document.getElementById('canvas');
        var ci = setInterval(function(){
        if(canvas) return clearInterval(ci)
            document.getElementById('overlays').style.zIndex='200'
            canvas = document.getElementById('canvas');
        },500)
    var cur = document.createElement('div')
    cur.id="cur"
    cur.innerHTML='<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAgBAMAAAD6cKULAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAGFBMVEUAAACpfNWqfNWxgt+pfNYAAABxxdP///8QUlG/AAAABXRSTlMAyMi2yMkORBwAAAABYktHRAcWYYjrAAAACXBIWXMAAADIAAAAyABj+uetAAAAB3RJTUUH5AUfFTg12loizgAAABBjYU52AAAAIAAAACAAAAABAAAAAF/Zx0oAAABxSURBVBjTTdBLEYAwDADRaEABgwUcgAKGIoFIoPZpPm03t513SSKLYK4V8ZKUpCQl6QfSCtIK0gpqManFJItBFoM8Onl0ikiKSMoIygjq4eQb+DSy3SIa2dZPzO33nHuMXVq2HPvBge8UfAcgBCEI4QdKU0qovgr47gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMC0wNS0zMVQyMTo1Njo1MiswMDowMFAq/z0AAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjAtMDUtMzFUMjE6NTY6NTIrMDA6MDAhd0eBAAAAAElFTkSuQmCC">'
    cur.style=''
    document.body.appendChild(cur)
    
    
    var zone = document.createElement('div')
    zone.id='zone'
    document.body.appendChild(zone)
    
    var buttons = document.createElement('div')
    document.body.appendChild(buttons)
    buttons.innerHTML=`<svg class="wpk-button menu" key="27" viewBox="0 0 48 48">
    <path fill="#9e9e9e" d="M6 36h36v-4H6v4zm0-10h36v-4H6v4zm0-14v4h36v-4H6z" />
  </svg>
  
  <svg class="wpk-button fullscreen" id="toggleFullScreen">
    <path fill="#9e9e9e" d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>
  
  <!--svg class="wpk-button leaderboard">
    <path fill="#9e9e9e" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
  </svg-->
  
  
  <div class="b-l-buttons">
    <div class="wpk-button hidden-ovh-chat" key="72">H</div>
  
    <div class="wpk-button show-ovh-chat" key="67">C</div>
  
    <svg class="wpk-button" key="13">
      <path fill="#9e9e9e" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
    </svg>
  </div>
  
  
  <div class="commands-ovh">
    <div class="wpk-button commands" key="49">1</div>
    <div class="wpk-button commands" key="50">2</div>
    <div class="wpk-button commands" key="51">3</div>
    <div class="wpk-button commands" key="52">4</div>
    <div class="wpk-button commands" key="53">5</div>
    <div class="wpk-button commands" key="54">6</div>
    <div class="wpk-button commands" key="55">7</div>
    <div class="wpk-button commands" key="56">8</div>
    <div class="wpk-button commands" key="57">9</div>
    <div class="wpk-button commands" key="58">0</div>
    <!--div class="wpk-button commands" key="38">↑</div>
    <div class="wpk-button commands" key="40">↓</div>
    <div class="wpk-button commands" key="37">←</div>
    <div class="wpk-button commands" key="39">→</div-->
  </div>
  
  <div class="wpk-gaming-buttons">
    <div class="circle-transform-container">
      <div class="wpk-button double-split" key="81">Q</div>
      <div class="wpk-button x16-split" key="16">16</div>
      <div class="wpk-button stop-circle" key="82">R</div>
      <div class="wpk-button w-feed" key="87">W</div>
    </div>
  
  
      <div class="wpk-button split" key="32">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="80" width="80" viewBox="0 0 100 100">
          <!--circle cx="50" cy="50" r="48" stroke="#9e9e9e" stroke-width="3px" fill="rgba(0,0,0,0.08)" /-->
          <circle cx="35" cy="45" r="10" stroke="#9e9e9e" stroke-width="3px" fill="none" />
          <circle cx="65" cy="55" r="10" stroke="#9e9e9e" stroke-width="3px" fill="none" />
          <path d="M 50 35 v 30 0" stroke="#9e9e9e" stroke-width="3" fill="none" stroke-linejoin="miter" stroke-linecap="round"/>
        </svg> 
      </div>
      <div class="wpk-button e-feed" key="69">
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="80" width="80" viewBox="0 0 100 100">
          <!--circle cx="50" cy="50" r="48" stroke="#9e9e9e" stroke-width="3px" fill="rgba(0,0,0,0.08)" /-->
          <circle cx="50" cy="50" r="18" stroke="#9e9e9e" stroke-width="3px" fill="none" />
          <path d="M 26 50 l 14 0, M 60 50 l 14 0, M 50 26 v 14 0, M 50 60 v 14 0" stroke="#9e9e9e" stroke-width="3" fill="none" stroke-linejoin="miter" stroke-linecap="round"/>
        </svg> 
      </div>
  
  <div class="b-r-buttons">
    <svg class="wpk-button" id="zoomIn">
      <path fill="#9e9e9e" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    </svg>
    <svg class="wpk-button" id="zoomOut">
      <path fill="#9e9e9e" d="M19 13H5v-2h14v2z"/>
    </svg>
  
    <!--svg class="wpk-button">
      <path fill="#9e9e9e" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
    </svg>
  
    <svg class="wpk-button">
      <path fill="#9e9e9e" d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.1-1.65c.2-.15.25-.42.13-.64l-2-3.46c-.12-.22-.4-.3-.6-.22l-2.5 1c-.52-.4-1.08-.73-1.7-.98l-.37-2.65c-.06-.24-.27-.42-.5-.42h-4c-.27 0-.48.18-.5.42l-.4 2.65c-.6.25-1.17.6-1.7.98l-2.48-1c-.23-.1-.5 0-.6.22l-2 3.46c-.14.22-.08.5.1.64l2.12 1.65c-.04.32-.07.65-.07.98s.02.66.06.98l-2.1 1.65c-.2.15-.25.42-.13.64l2 3.46c.12.22.4.3.6.22l2.5-1c.52.4 1.08.73 1.7.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.6-.25 1.17-.6 1.7-.98l2.48 1c.23.1.5 0 .6-.22l2-3.46c.13-.22.08-.5-.1-.64l-2.12-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
    </svg-->
  </div>`
    
    
    
    var options = {
        zone: zone,                  // active zone
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
    
    
    
    var wheelZoom = function(){
      var evt = document.createEvent('MouseEvents');
      evt.initEvent('mousewheel', true, true);
      evt.wheelDelta = this;
      document.body.dispatchEvent(evt);
    }
    
    document.getElementById('zoomOut').ontouchstart=wheelZoom.bind(-120)
    document.getElementById('zoomIn').ontouchstart=wheelZoom.bind(120)
    
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
    
    
    }
    
    //window.master=true
    //* LOADER *///
    var timeStep = 2000; //  = n * 1000 ms
    var t123 = setInterval(function() {
        timeStep == 2000 && (document.head.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/npm/nipplejs@0.8.2/dist/nipplejs.min.js')
        if(document.getElementById('canvas') && document.getElementById('canvas').onmousemove && !!window.nipplejs) {
            clearInterval(t123)
            init()
        } else {
            if(!--timeStep) {
                clearInterval(t123);
                window.master != undefined && alert('OGARIO not responding')
                window.nipplejs != undefined && alert('nipplejs not responding')
            }
        }
    }, 50)
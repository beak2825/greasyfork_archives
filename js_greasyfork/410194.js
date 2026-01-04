  // ==UserScript==
  // @name         Vanis.io MOD
  // @namespace    Vez's Vanis.io mod
  // @version      3.9.9
  // @description  Vez's auto respawn and skin changer
  // @author       vez
  // @contact      Discord: Vez#2777
  // @match        https://vanis.io/
  // @grant        none
  // @connect      https://raw.githubusercontent.com
  // @resource     https://raw.githubusercontent.com/taufik-nurrohman/color-picker/master/color-picker.min.css
  // @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/410194/Vanisio%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/410194/Vanisio%20MOD.meta.js
  // ==/UserScript==

  const VEX = `
  <style>

  .vex {

    width : 350px;
    height: 800px;

    position: fixed;
    top: calc(50% - 400px);
    right: -325px;

    display: flex;
    flex-wrap : wrap;
    justify-content: center;

    background: rgba(30, 30, 30, .75);
    border: 1px solid blue;

    box-shadow: 0 0 4px 2px #000;

    font-family : Monospace;

    z-index: 9999;
  }

  .vex-button {

    background: rgba(30, 30, 30, .75);

    margin-left: 5px;

    box-shadow: 0 0 1px 1px #000;
    border: 0.5px solid blue;
    outline: none;

    color: #ffffff;
  }

  .vex-button:hover {

    color: #4affff;
  }

  .vex > .vex-hud {

    width: 90%;

    display : flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .vex > .vex-hud > p {

    width: 100%;
    text-align: center;

    color : white;
  }
  .vex > .vex-hud > input {

    width: 100%;

    background : rgba(30, 30, 30, .65);
    border: 1px solid rgba(30, 30, 30, 1);

    text-align: center;
    color: #ffffff;

    outline : 0;
    box-shadow: none;
  }

  .vex > .vex-skins {

    width: 90%;

    display : flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .vex > .vex-skins > .vex-skins-item {

    width: 100%;
  }
  .vex > .vex-skins > .vex-skins-item > p {

    width: 100%;
    text-align: center;

    color : white;
  }

  .vex > .vex-skins > .vex-skins-item > input {

    width: 100%;

    background : rgba(30, 30, 30, .65);
    border: 1px solid rgba(30, 30, 30, 1);

    text-align: center;
    color: #ffffff;

    outline : 0;
    box-shadow: none;
  }

  .vex > .vex-controls {

    width: 90%;

    display : flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .vex > .vex-controls > p {

    width: 100%;
    text-align: center;

    color : white;
  }

  .vex > .vex-controls > button {

    width: 50%;

    background : rgba(30, 30, 30, .65);
    border: 1px solid rgba(30, 30, 30, 1);

    text-align: center;
    color: #ffffff;

    outline : 0;
    box-shadow: none;
  }

  #vex-r-start {}
  #vex-r-start.active {

    color: lime;
  }
  #vex-r-start:hover {

    color: lime;
  }

  #vex-r-stop {}
  #vex-r-stop.active {

    color: tomato;
  }
  #vex-r-stop:hover {

    color: tomato;
  }

  .vex > .vex-extras {

    width: 90%;

    display : flex;
    flex-wrap: wrap;
    justify-content: center;

    text-align: center;
    color: white;
  }
  .vex > .vex-extras > .vex-extras-item {

    width: 100%;
    height: 20px;

    display: inline-flex;

    overflow: hidden;
  }
  .vex > .vex-extras > .vex-extras-item > p {

    width: 80%;

    margin: 0px;
    text-aligasd
    color : white;
  }

  .vex > .vex-extras > .vex-extras-item > input {

    margin-left: 10px;

    background : rgba(30, 30, 30, .65);
    border: 1px solid rgba(30, 30, 30, 1);

    text-align: center;
    color: #ffffff;

    outline : 0;
    box-shadow: none;
  }

  .vex > .vex-binds {

    width: 90%;

    display : flex;
    flex-wrap: wrap;
    justify-content: center;

    text-align: center;
    color: white;
  }
  .vex > .vex-binds > .vex-binds-item {

    width: 100%;
    height: 20px;

    display: inline-flex;

    overflow: hidden;
  }

  .vex > .vex-binds > .vex-binds-item > p {

    width: 80%;

    margin: 0px;
    text-align: center;

    color : white;
  }

  .vex > .vex-binds > .vex-binds-item > input {

    background : rgba(30, 30, 30, .65);
    border: 1px solid rgba(30, 30, 30, 1);

    text-align: center;
    color: #ffffff;

    outline : 0;
    box-shadow: none;
  }
  </style>

  <div class="vex">
    <div class="vex-hud">
      <p>HUD COLOR</p>
      <input id="vex-hc" type="text" placeholder="HEX code | Example: #101011">
      <p>𝘉𝘶𝘨𝘴 𝘸𝘪𝘭𝘭 𝘣𝘦 𝘧𝘪𝘹𝘦𝘥 𝘴𝘰𝘰𝘯.<p>
    </div>

    <div class="vex-skins">

    <p>SKIN CHANGER</p>


      <div class="vex-skins-item">
        <p>SKIN_1</p>
        <input id="vex-s1" type="text" placeholder="SKIN_URL">
      </div>

          <div class="vex-skins-item">
        <p>SKIN_2</p>
        <input id="vex-s2" type="text" placeholder="SKIN_URL">
      </div>
          <div class="vex-skins-item">
        <p>SKIN_3</p>
        <input id="vex-s3" type="text" placeholder="SKIN_URL">
      </div>

          <div class="vex-skins-item">
        <p>SKIN_4</p>
        <input id="vex-s4" type="text" placeholder="SKIN_URL">
      </div>
    </div>

    <div class="vex-controls">

      <p>SKIN ROTATOR</p>
      <button id="vex-r-start">START</button>
      <button id="vex-r-stop">STOP</button>
    </div>

    <div class="vex-extras">
      <p>EXTRAS</p>
      <div class="vex-extras-item">
        <p>AUTO_RESPAWN</p>
        <input id="vex-e-ar" type="checkbox">
      </div>

      <div class="vex-extras-item">
        <p>SKIP_STATS</p>
        <input id="vex-e-ss" type="checkbox">
      </div>

    </div>


      
      
      <button onclick="window.location.href='https://www.youtube.com/channel/UC97sNelrYyPT7OYi8kdb8bg';">Youtube</button>

    <div class="credits">

      <p>Owner</p>
        <p>Coded by Vez#3994</p>
      </div>
    
      <button onclick="window.location.href='https://discord.gg/8gffmkjDNp';">
      Discord
    </button>
    
      </div>
    </div>
  </div>


  </div>


  </div>
  `;

  const VEX_BTN = `

  <button onclick="window.VEX_OVERLAY_TOGGLE()" class="vex-button"><i class="fa fa-gear"></i>Menu</button>
  `;

  document.querySelectorAll("#vanis-io_300x250")[0].innerHTML += VEX;
  document.querySelectorAll(".social-container")[0].innerHTML += VEX_BTN;

  setTimeout(()=>{

  window._$ = selector => {

      const nodes = document.querySelectorAll(selector);

      return nodes.length == 1 ? nodes[0] : nodes;
  }

  window.VEX_PLAYER_SOCKET = null;
  window.VEX_PLAYER_X = 0;
  window.VEX_PLAYER_Y = 0;

  window.VEX_PLAYER_PACKET_SPAWN = [];

  window.VEX_PLAYER_SPAWN = () => {

    window.VEX_PLAYER_SOCKET._send(window.VEX_PLAYER_PACKET_SPAWN);
  };

  window.VEX_PLAYER_MOVETO_X = 0;
  window.VEX_PLAYER_MOVETO_Y = 0;

  window.VEX_PLAYER_MOVE_STOP = false;
  window.VEX_PLAYER_MOVE_TO = false;

  window.VEX_PLAYER_MOVETO = (x,y) => {

    const packet = new DataView(new ArrayBuffer(9));
          packet.setUint8(0, 16);
          packet.setInt32(1, x, true);
          packet.setInt32(5, y, true);

    window.VEX_PLAYER_SOCKET._send(packet);
  }

  window.VEX_PLAYER_SPLIT = () => {

    const packet = new DataView(new ArrayBuffer(2));
          packet.setUint8(0, 17);
          packet.setUint8(1, window.VEX_PLAYER_X);

    window.VEX_PLAYER_SOCKET._send(packet);
  }

  window.VEX_OVERLAY_TOGGLE = () => {

    const state = (VEX_DOM_OVERLAY.style.right == "-325px") ? false : true;

    if(state){

      VEX_OVERLAY_HIDE();
      return;
    }

    VEX_OVERLAY_SHOW();
  };

  let VEX_HUD_COLOR = "";

  let VEX_SKIN1 = "";
  let VEX_SKIN2 = "";
  let VEX_SKIN3 = "";
  let VEX_SKIN4 = "";

  let VEX_ROTATOR_STATE = false;
  const VEX_ROTATOR_DELAY = 1000;

  let VEX_EXTRAS_AR = false;
  let VEX_EXTRAS_AR_INTERVAL = null;

  let VEX_EXTRAS_SS = false;
  let VEX_EXTRAS_SS_INTERVAL = null;

  const VEX_DOM_OVERLAY = _$(".vex");

  const VEX_DOM_HC = _$("#vex-hc");

  const VEX_DOM_SKIN_INPUT = _$("#skinurl");
  const VEX_DOM_SKIN1 = _$("#vex-s1");
  const VEX_DOM_SKIN2 = _$("#vex-s2");
  const VEX_DOM_SKIN3 = _$("#vex-s3");
  const VEX_DOM_SKIN4 = _$("#vex-s4");

  const VEX_DOM_ROTATOR_START = _$("#vex-r-start");
  const VEX_DOM_ROTATOR_STOP = _$("#vex-r-stop");

  const VEX_DOM_EXTRAS_AR = _$("#vex-e-ar");
  const VEX_DOM_EXTRAS_SS = _$("#vex-e-ss");

  const VEX_HUD_COLOR_FUNC = () => {

    for(const element of _$(".fade"))
      element.style.background = VEX_HUD_COLOR;

    _$("#overlay").style.background = "radial-gradient("+VEX_HUD_COLOR+" 300px,"+VEX_HUD_COLOR+")";
    _$(".vex").style.background = VEX_HUD_COLOR;

    if(_$(".discord").length !== 0)
      _$(".discord").style.background = VEX_HUD_COLOR;

    //_$(".vex").style.boxShadow = "0 0 4px 2px " + VEX_HUD_COLOR;
    _$(".vex-button").style.background = VEX_HUD_COLOR;

    if(_$(".progress-bar").length !== 0)
      _$(".progress-bar").style.background = `repeating-linear-gradient(-45deg,${VEX_HUD_COLOR},${VEX_HUD_COLOR} 40px,#1e1e1e 0,#1e1e1e 80px)`

    if(_$(".fade-box")[0])
      _$(".fade-box")[0].style.background = VEX_HUD_COLOR;

    if(_$(".fade-box")[1])
      _$(".fade-box")[1].style.background = VEX_HUD_COLOR;
  };

  let VEX_ROTATOR_INTERVAL = null;
  let VEX_ROTATOR_CURRENT = 1;

  const VEX_ROTATOR_FUNC_NEXT = () => {

    if(VEX_ROTATOR_CURRENT < 5)
      VEX_ROTATOR_CURRENT += 1;

    if(VEX_ROTATOR_CURRENT == 5)
      VEX_ROTATOR_CURRENT = 1;

    VEX_DOM_SKIN_INPUT.value = localStorage.getItem("vex-s"+VEX_ROTATOR_CURRENT);
  };

  const VEX_ROTATOR_FUNC_PREV = () => {

    if(VEX_ROTATOR_CURRENT < 5)
      VEX_ROTATOR_CURRENT -= 1;

    if(VEX_ROTATOR_CURRENT == 0)
      VEX_ROTATOR_CURRENT = 1;

    VEX_DOM_SKIN_INPUT.value = localStorage.getItem("vex-s"+VEX_ROTATOR_CURRENT);
  };

  const VEX_OVERLAY_SHOW = () => {

    VEX_DOM_OVERLAY.style.right = "0px";
  };

  const VEX_OVERLAY_HIDE = () => {

    VEX_DOM_OVERLAY.style.right = "-325px";
  };

  // VEX_DOM_OVERLAY.addEventListener('mouseenter', event => {

  //   VEX_OVERLAY_SHOW();
  // }, false);

  // VEX_DOM_OVERLAY.addEventListener('mouseleave', event => {

  //   VEX_OVERLAY_HIDE();
  // }, false);

  VEX_DOM_HC.addEventListener("change", event => {

    if(event.target.value == localStorage.getItem("vex-hc"))
      return;

    localStorage.setItem("vex-hc", event.target.value);

    VEX_HUD_COLOR = localStorage.getItem("vex-hc");

    VEX_HUD_COLOR_FUNC();
  }, false)

  VEX_DOM_SKIN1.addEventListener("change", event => {

    if(event.target.value == localStorage.getItem("vex-s1"))
      return;

    localStorage.setItem("vex-s1", event.target.value);

    VEX_SKIN1 = localStorage.getItem("vex-s1");
  }, false)

  VEX_DOM_SKIN2.addEventListener("change", event => {

    if(event.target.value == localStorage.getItem("vex-s1"))
      return;

    localStorage.setItem("vex-s2", event.target.value);

    VEX_SKIN2 = localStorage.getItem("vex-s2");
  }, false)

  VEX_DOM_SKIN3.addEventListener("change", event => {

    if(event.target.value == localStorage.getItem("vex-s1"))
      return;

    localStorage.setItem("vex-s3", event.target.value);

    VEX_SKIN3 = localStorage.getItem("vex-s3");
  }, false)

  VEX_DOM_SKIN4.addEventListener("change", event => {

    if(event.target.value == localStorage.getItem("vex-s1"))
      return;

    localStorage.setItem("vex-s4", event.target.value);

    VEX_SKIN4 = localStorage.getItem("vex-s4");
  }, false)

  VEX_DOM_ROTATOR_START.addEventListener('click', event => {

    VEX_ROTATOR_STATE = true;

    VEX_DOM_ROTATOR_STOP.className = "";
    event.target.className += " active";

    VEX_ROTATOR_CURRENT = 1;
    VEX_ROTATOR_INTERVAL = setInterval(VEX_ROTATOR_FUNC_NEXT, VEX_ROTATOR_DELAY);
  }, false);

  VEX_DOM_ROTATOR_STOP.addEventListener('click', event => {

    VEX_ROTATOR_STATE = false;

    VEX_DOM_ROTATOR_START.className = "";
    event.target.className += " active";

    VEX_ROTATOR_CURRENT = 1;
    clearInterval(VEX_ROTATOR_INTERVAL);
  }, false);


  VEX_DOM_EXTRAS_AR.addEventListener('change', event => {

    const state = event.target.checked;

    if(state == true){

      if(VEX_DOM_EXTRAS_SS.checked == true)
        VEX_DOM_EXTRAS_SS.click();

        VEX_EXTRAS_AR_INTERVAL = setInterval(()=>{

          if(_$(".container")[2].style.display != "none"){

            if(_$("button.continue").length === undefined && _$("button.continue").length !== 0){

              _$("button.continue").click();
              _$("#overlay").style.display = "none";

              _$("#overlay").dispatchEvent(new KeyboardEvent("keydown",{

                altKey: false,
                bubbles: true,
                cancelBubble: false,
                cancelable: true,
                charCode: 0,
                code: "Escape",
                composed: true,
                ctrlKey: false,
                currentTarget: null,
                defaultPrevented: false,
                detail: 0,
                eventPhase: 0,
                isComposing: false,
                isTrusted: true,
                key: "Escape",
                keyCode: 27,
                location: 0,
                metaKey: false,
                path: [document.body, document, document, window],
                repeat: false,
                returnValue: true,
                shiftKey: false,
                sourceCapabilities: new InputDeviceCapabilities({firesTouchEvents: false}),
                srcElement: document.body,
                target: document.body,
                type: "keydown",
                view: window,
                which: 27
              }));
              _$("canvas#canvas").dispatchEvent(new KeyboardEvent("keydown",{

                altKey: false,
                bubbles: true,
                cancelBubble: false,
                cancelable: true,
                charCode: 0,
                code: "Escape",
                composed: true,
                ctrlKey: false,
                currentTarget: null,
                defaultPrevented: false,
                detail: 0,
                eventPhase: 0,
                isComposing: false,
                isTrusted: true,
                key: "Escape",
                keyCode: 27,
                location: 0,
                metaKey: false,
                path: [document.body, document, document, window],
                repeat: false,
                returnValue: true,
                shiftKey: false,
                sourceCapabilities: new InputDeviceCapabilities({firesTouchEvents: false}),
                srcElement: document.body,
                target: document.body,
                type: "keydown",
                view: window,
                which: 27
              }))

              _$("#overlay").dispatchEvent(new KeyboardEvent("keyup",{

                altKey: false,
                bubbles: true,
                cancelBubble: false,
                cancelable: true,
                charCode: 0,
                code: "Escape",
                composed: true,
                ctrlKey: false,
                currentTarget: null,
                defaultPrevented: false,
                detail: 0,
                eventPhase: 0,
                isComposing: false,
                isTrusted: true,
                key: "Escape",
                keyCode: 27,
                location: 0,
                metaKey: false,
                path: [document.body, document, document, window],
                repeat: false,
                returnValue: true,
                shiftKey: false,
                sourceCapabilities: new InputDeviceCapabilities({firesTouchEvents: false}),
                srcElement: document.body,
                target: document.body,
                type: "keydown",
                view: window,
                which: 27
              }));
              _$("canvas#canvas").dispatchEvent(new KeyboardEvent("keyup",{

                altKey: false,
                bubbles: true,
                cancelBubble: false,
                cancelable: true,
                charCode: 0,
                code: "Escape",
                composed: true,
                ctrlKey: false,
                currentTarget: null,
                defaultPrevented: false,
                detail: 0,
                eventPhase: 0,
                isComposing: false,
                isTrusted: true,
                key: "Escape",
                keyCode: 27,
                location: 0,
                metaKey: false,
                path: [document.body, document, document, window],
                repeat: false,
                returnValue: true,
                shiftKey: false,
                sourceCapabilities: new InputDeviceCapabilities({firesTouchEvents: false}),
                srcElement: document.body,
                target: document.body,
                type: "keydown",
                view: window,
                which: 27
              }))

              window.VEX_PLAYER_SPAWN();
            }
          }
        }, 500);

        return;
      }

    clearInterval(VEX_EXTRAS_AR_INTERVAL);
    VEX_EXTRAS_AR_INTERVAL = null;
  }, false);

  VEX_DOM_EXTRAS_SS.addEventListener('change', event => {

    const state = event.target.checked;

    if(state == true){

      VEX_EXTRAS_SS_INTERVAL = setInterval(()=>{

        if(_$(".container")[2].style.display != "none"){

          if(_$("button.continue").length === undefined && _$("button.continue").length !== 0)
            _$("button.continue").click();
        }
      }, 500);

      return;
    }

    clearInterval(VEX_EXTRAS_SS_INTERVAL);
    VEX_EXTRAS_SS_INTERVAL = null;
  }, false);

  const init = () => {

    VEX_DOM_HC.value = localStorage.getItem("vex-hc") || "";
    VEX_HUD_COLOR = VEX_DOM_HC.value;
    VEX_HUD_COLOR_FUNC();

    VEX_DOM_SKIN1.value = localStorage.getItem("vex-s1") || "";
    VEX_DOM_SKIN2.value = localStorage.getItem("vex-s2") || "";
    VEX_DOM_SKIN3.value = localStorage.getItem("vex-s3") || "";
    VEX_DOM_SKIN4.value = localStorage.getItem("vex-s4") || "";

    VEX_DOM_ROTATOR_STOP.click();

    VEX_DOM_EXTRAS_AR.checked = localStorage.getItem("vex-e-ar") || false;
    VEX_DOM_EXTRAS_SS.checked = localStorage.getItem("vex-e-ss") || false;
  };


  WebSocket.prototype._send = WebSocket.prototype.send
  WebSocket.prototype.send = function(data) {

    if(data.byteLength > 9 && data[0] == 1)
      VEX_PLAYER_PACKET_SPAWN = data;

    window.VEX_PLAYER_SOCKET = this;

    if(data.byteLength == 9){

      if(data.getUint8() == 16){

        window.VEX_PLAYER_X =  data.getInt32(1, true);
        window.VEX_PLAYER_Y =  data.getInt32(5, true);

        if(window.VEX_PLAYER_MOVE_STOP && window.VEX_PLAYER_MOVE_TO){

          window.VEX_PLAYER_MOVETO(window.VEX_PLAYER_MOVETO_X, window.VEX_PLAYER_MOVETO_Y);
          return;
        }

        if(window.VEX_PLAYER_MOVE_STOP)
          return;
      }
    }

    this._send(data);
  };


  document.addEventListener('click', event => {

    console.log(event)
  }, false)

  setInterval(()=>{

    VEX_HUD_COLOR_FUNC();
  }, 200);
  init();

  }, 25);
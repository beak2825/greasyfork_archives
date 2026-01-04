// ==UserScript==
// @name         Box3++复活版
// @version      0.7.1
// @description  别喷，就是想复活旧版本
// @namespace    http://tampermonkey.net/
// @author       创作喵
// @license      MIT
// @match        https://box3.fun/*
// @match        https://box3.codemao.cn/*
// @match        https://static.box3.codemao.cn/block/*
// @icon         https://box3.fun/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @require      https://cdn.jsdelivr.net/npm/three@0.142.0/examples/js/libs/stats.min.js
// @require      https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      static.box3.codemao.cn
// @downloadURL https://update.greasyfork.org/scripts/462023/Box3%2B%2B%E5%A4%8D%E6%B4%BB%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/462023/Box3%2B%2B%E5%A4%8D%E6%B4%BB%E7%89%88.meta.js
// ==/UserScript==
let link = document.createElement("link");
link.rel = "stylesheet";
link.type = "text/css";
link.href = "https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css";
document.head.appendChild(link);
function prettierUI() {
  requestAnimationFrame(prettierUI);
  mdui.$(".a-F8dFt2hg1W-lIbThLbO").css("backdrop-filter", "blur(3px)");
  [
    "a",
    ".cursor-pointer",
    "._15lJaNwokhrvBITYpCdZBg, ._28PX7t6sYZjpgdkp56cQY_, .gHO6bo4JP-z80tTWRgOld",
    "._1lO8S3Fo0FZ4CNWHI0vDlY",
    "._210V1pgtcsKM0CS3q9Mzoq, ._2IYl3aDKtjEN6yelK6ZQJB,._2VsAXkoKr_drDxi4aXIhgr",
    ".wEySfY7uVCnTptMngztm4 div",
  ].map((s) => mdui.$(s).addClass("mdui-ripple"));
  [
    "button",
    "._1fXgmyCy8qEkTugSc5XVFf ._2byugNOjsV5_rSPJmXvyDO",
    "._1xZbWt8b7cKJ8PPcK2Ho81.-y0as17U00f3yUjy_bm6K",
    "_31l4xpmllyrTDCG_n-rOf6",
  ].map((s) => mdui.$(s).addClass("mdui-ripple mdui-btn mdui-btn-rasied"));
  [
    "._1Bk3sWdrdhP8JPXYytQ240",
    "._2sJ_JP3UNnDIbP2h46Jgsz>*",
    "._1ReegQnUK6jKlZOvd0KIgZ",
    ".KUzAqHalGLCvvU9mhNy2u, ._8iMJ9PRMtIpTQPsCqB-C_",
    "._2K6VILBkECu3h5ocjWmmb5",
  ].map((s) => mdui.$(s).addClass("mdui-ripple mdui-menu-item"));
  [
    "._1U-H613uST925WwgUSVsPx._31uKzmO2fxXo6KwO_-RETK",
    "._3OZUDfwlADkB_meRCgyvWm ._31_zQUYv2JwOcKqu2yk0Vv",
  ].map((s) => mdui.$(s).addClass("mdui-ripple mdui-btn mdui-btn-icon"));
  [].map((s) => mdui.$(s).addClass("mdui-slider"));
  ["._2kWmDVfvQZvUKLSQONkaIr"].map((s) =>
    mdui.$(s).addClass("mdui-color-orange")
  );
}
prettierUI();
var dialogzindex = 99999;
const setv=((html,name,value)=>{html.setAttribute(name,value)});
        const setn=((html,value)=>{html.setAttribute(value,"")});
        const seth=((html,html5)=>{html.innerHTML=html5});
        const sett=((html,text)=>{html.innerText=text});
        const addhtml=((position,localName,data,html)=>{var newHtml=document.createElement(localName);for(var name in data){newHtml.setAttribute(name,data[name])};newHtml.innerHTML=html;var newElement=position.appendChild(newHtml);return(newElement)})
const addwindow=(name,content,width,img=null,closeyes=true,position=document.body)=>{
    var dialog = addhtml(position,"div",{class:"box3editmessagediv box3messagedialog dongtai kaishizhuangtai",show:"true",oncontextmenu:"return false;",style:`top:10px;left:10px;width:${width}px;z-index:${dialogzindex}}`},"");
    var dialogdb = addhtml(dialog,"div",{class:"db"},"");
    setTimeout(()=>{dialog.classList.remove("kaishizhuangtai")},10)
    setTimeout(()=>{dialog.classList.remove("dongtai")},260);
    if(img){
        addhtml(dialogdb,"img",{width:"100",height:"100%",src:img,style:"margin-right: 10px;"},``)
    }
    var dialogydtzd = addhtml(dialog,"div",{class:"ydtzd",title:"拖动"},"");
    var a = addhtml(dialogdb,"div",{style:"display: flex;flex-direction: column;"},`<span style='font-weight: bold;font-size:20px'>${name}</span><font style='font-size:12px;color:#aaa;display: flex;flex-direction: row;'></font>`)
    sett(a.getElementsByTagName("font")[0],content)
    var dialogclose = addhtml(dialogdb,"button",{title:"关闭",zdy:"",jy:!closeyes},"×");
    if(closeyes){
        dialogclose.onclick=()=>{setTimeout(()=>{dialog.classList.add("dongtai","kaishizhuangtai");},10);setTimeout(()=>{dialog.remove();},260)}
    }
    dialog.onmousedown=()=>{dialogzindex+=1;dialog.style.zIndex=dialogzindex}
    dialogydtzd.onmousedown=(en)=>{
        setv(dialogydtzd,"ox",en.offsetX)
        setv(dialogydtzd,"oy",en.offsetY)
        document.onmousemove=(e)=>{
            dialog.style.top=(e.clientY-en.offsetY)+"px"
            dialog.style.left=(e.clientX-en.offsetX)+"px"
        }
    }
            dialogydtzd.onmouseup=()=>{document.onmousemove=null;}
            return({close:()=>{dialog.remove()},dialog})
        }
var box3messageboxsettings = {
                width:245,
                showmonitor:true,
                monitorposition:0,
                monitortm:90,
            }
addhtml(document.body,"style",{type:"text/css"},`

.box3editmessagediv {
    position: fixed;
    background: #383838;
    color: #fff;
    padding: 20px;
    right: 0px;
    bottom: 0px;
    box-shadow: 0px 0px 30px -10px #000;
    margin: 8px 20px;
    z-index:999999;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
}
.box3editmessagediv .div{
    display: flex;
    align-items: center;
    align-content: center;
    flex-direction: row;
    margin-top: 5px;
}
.box3editmessagediv[show=false] {
    display: none
}
.box3editmessagedivycxx {
    position: fixed;
    right: 0px;
    bottom: -16.75px;
    box-shadow: 0px 0px 30px -10px #000;
    z-index:999999;
    transition: .5s;
}
.box3editmessagedivycxx:hover {
    bottom: 0px;
}
.box3editmessagedivycxx[show=false] {
    display: none
}
.box3editmessagediv .db{
    color: #fff;
    margin-bottom: 10px;
    width: 100%;
    display: flex;
    align-items: center;
    align-content: center;
    flex-direction: row;
}
.box3editmessagediv .db div{
    margin-right: 20px;
}
.box3editmessagediv .div button{margin-right: 5px;}
.box3editmessagediv button[zdy]{background:#0000;color:#fff;position: absolute;top: 0;right: 0;z-index:99999999999999999999999999999999999999999999999999999999999999999}
.box3editmessagediv .ahref{color:currentColor}
.box3editmessagediv .ahref:hover{text-decoration: underline;color:#fff}
.box3editmessagediv .ahref:active{color:#f44747}
.box3editmessagediv .db button{
    font-size:30px;
    padding: 0px 10px;
    border-top-right-radius: 10px;
    transition: .1s;
}
.box3editmessagediv .db button:hover{
    background:#a00a
}
.box3messagedialog {
    top: inherit;
    left: inherit;
    bottom: inherit;
    right: inherit;
    margin: 0;
}
.box3messagedialog .db button[jy=true] {
    opacity: .5;
}
.box3messagedialog .ydtzd {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 40px;
    cursor: all-scroll;
}
.box3editmessagediv .db div font{
    max-height: 100px;
    overflow: auto;
    padding:5px 5px 0px 0px
}
.box3editmessagediv .db div font::-webkit-scrollbar {
    height: 5px;
    width: 5px;
}
.box3editmessagediv .db div font::-webkit-scrollbar-thumb {
    background: #aaa5;
    border-radius: 50px
}
.box3editmessagediv .db div font::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}
.box3editmessagediv .db div font::-webkit-scrollbar-thumb:active {
    background: #aaa3;
}
.box3editmessagediv .db div font::-webkit-scrollbar-track {
    background: #0000;
    border-radius: 50px
}

.box3editmessagediv .div textarea::-webkit-scrollbar {
    height: 5px;
    width: 5px;
}
.box3editmessagediv .div textarea::-webkit-scrollbar-thumb {
    background: #aaa5;
    border-radius: 50px
}
.box3editmessagediv .div textarea::-webkit-scrollbar-thumb:hover {
    background: #aaa;
}
.box3editmessagediv .div textarea::-webkit-scrollbar-thumb:active {
    background: #aaa3;
}
.box3editmessagediv .div textarea::-webkit-scrollbar-track {
    background: #0000;
    border-radius: 50px
}

.box3messagedialog.dongtai{
    transition: .25s cubic-bezier(0, 0, 0, 0.9);
}
.box3messagedialog.kaishizhuangtai{
    transform: scale(0.75);
    opacity: 0;
}


`);
const VOXEL_NAME_TO_ID = {
  A: 37,
  B: 39,
  C: 41,
  D: 43,
  E: 45,
  F: 47,
  G: 49,
  H: 51,
  I: 53,
  J: 55,
  K: 57,
  L: 59,
  M: 61,
  N: 63,
  O: 65,
  P: 67,
  Q: 69,
  R: 71,
  S: 73,
  T: 75,
  U: 77,
  V: 79,
  W: 81,
  X: 83,
  Y: 85,
  Z: 87,
  acacia: 133,
  add: 3,
  air: 0,
  air_duct: 585,
  ampersand: 485,
  asterisk: 487,
  at: 489,
  backslash: 491,
  bamboo: 574,
  bat_window: 546,
  bear_footprint: 553,
  biscuit: 341,
  black: 175,
  black_glass: 302,
  blue: 363,
  blue_decorative_light: 566,
  blue_gift: 557,
  blue_glass: 276,
  blue_light: 291,
  blue_surface_01: 349,
  blue_surface_02: 351,
  blueberry_juice: 416,
  board0: 433,
  board1: 435,
  board10: 453,
  board11: 455,
  board12: 457,
  board13: 459,
  board14: 461,
  board15: 463,
  board2: 437,
  board3: 439,
  board4: 441,
  board5: 443,
  board6: 445,
  board7: 447,
  board8: 449,
  board9: 451,
  board_01: 181,
  board_02: 183,
  board_03: 309,
  board_04: 311,
  board_05: 313,
  board_06: 315,
  board_07: 635,
  bookshelf: 483,
  bounce_pad: 631,
  bracket_close: 493,
  bracket_open: 495,
  brick_01: 637,
  brick_02: 639,
  brick_red: 109,
  button: 587,
  cadet_blue: 89,
  candy: 551,
  caret: 497,
  carpet_01: 195,
  carpet_02: 197,
  carpet_03: 199,
  carpet_04: 201,
  carpet_05: 203,
  carpet_06: 205,
  carpet_07: 207,
  carpet_08: 235,
  carpet_09: 237,
  carpet_10: 239,
  carpet_11: 241,
  carpet_12: 243,
  carpet_13: 245,
  coffee: 428,
  coffee_gray: 379,
  colon: 499,
  color_glass: 172,
  comma: 501,
  conveyor: 471,
  crane_lantern: 405,
  crane_roof_01: 401,
  crane_roof_02: 403,
  cross_window: 162,
  dark_brick_00: 329,
  dark_brick_01: 331,
  dark_brick_02: 333,
  dark_grass: 317,
  dark_gray: 95,
  dark_orchid: 369,
  dark_red: 107,
  dark_salmon: 383,
  dark_slate_blue: 113,
  dark_stone: 327,
  dark_surface: 357,
  dirt: 125,
  divide: 9,
  dollar: 503,
  eight: 33,
  equal: 11,
  exclamation_mark: 13,
  express_box: 479,
  fan: 589,
  firecracker: 582,
  five: 27,
  four: 25,
  fu: 577,
  geometric_window_01: 164,
  geometric_window_02: 166,
  glass: 170,
  gold_trim_brick: 151,
  grape_juice: 420,
  grass: 127,
  greater_than: 505,
  green_decorative_light: 568,
  green_glass: 278,
  green_leaf: 131,
  green_light: 287,
  greenbelt_L: 319,
  greenbelt_L1: 321,
  grey_stone_brick: 149,
  honeycomb_01: 535,
  honeycomb_02: 537,
  ice: 398,
  ice_brick: 145,
  ice_wall: 249,
  indigo_light: 289,
  lab_lamp_01: 591,
  lab_lamp_02: 593,
  lab_lamp_03: 595,
  lab_material_01: 597,
  lab_material_02: 599,
  lab_material_03: 601,
  lab_material_04: 603,
  lab_material_05: 605,
  lab_material_06: 607,
  lab_material_07: 609,
  lab_material_08: 611,
  lab_material_09: 613,
  lab_material_10: 615,
  lab_material_11: 617,
  lab_material_12: 619,
  lab_material_13: 621,
  lab_material_14: 622,
  lab_material_15: 624,
  lab_screen: 627,
  lab_wire: 629,
  lantern_01: 157,
  lantern_02: 159,
  lava01: 465,
  lava02: 467,
  leaf_01: 251,
  leaf_02: 253,
  leaf_03: 529,
  leaf_04: 531,
  leaf_05: 533,
  leaf_06: 633,
  ledfloor01: 473,
  ledfloor02: 475,
  lemon: 121,
  lemon_juice: 418,
  less_than: 507,
  light_gray: 97,
  light_grey_stone_brick: 147,
  lime_juice: 414,
  macaroon: 339,
  maroon: 377,
  medium_gray: 111,
  medium_green: 391,
  medium_orchid: 371,
  medium_purple: 373,
  medium_spring_green: 397,
  medium_violet_red: 375,
  medium_yellow: 389,
  milk: 424,
  mint_green: 395,
  mint_green_light: 297,
  multiply: 7,
  navajo_white: 385,
  nine: 35,
  olive_green: 99,
  one: 19,
  orange: 119,
  orange_juice: 422,
  orange_light: 283,
  orange_red: 387,
  palace_carving: 264,
  palace_cloud: 361,
  palace_eaves_01: 209,
  palace_eaves_02: 211,
  palace_eaves_03: 213,
  palace_eaves_04: 215,
  palace_eaves_05: 217,
  palace_eaves_06: 219,
  palace_eaves_07: 221,
  palace_eaves_08: 223,
  palace_floor: 263,
  palace_lamp: 307,
  palace_roof: 255,
  palace_window: 408,
  pale_green: 103,
  palm: 541,
  paren_close: 511,
  paren_open: 509,
  peach_juice: 430,
  percent: 513,
  period: 515,
  peru: 381,
  pink: 115,
  pink_cake: 337,
  pink_light: 295,
  plank_01: 137,
  plank_02: 139,
  plank_03: 141,
  plank_04: 143,
  plank_05: 641,
  plank_06: 643,
  plank_07: 645,
  polar_ice: 347,
  polar_region: 345,
  pound: 517,
  powder_blue: 93,
  pumpkin: 543,
  pumpkin_lantern: 549,
  purple: 293,
  purple_surface_01: 353,
  purple_surface_02: 355,
  quartz_brick: 155,
  question_mark: 15,
  quotation_mark: 519,
  rainbow_cube: 581,
  red: 105,
  red_brick: 153,
  red_brick_floor: 259,
  red_brick_wall: 261,
  red_decorative_light: 570,
  red_gift: 555,
  red_glass: 304,
  red_light: 281,
  rock: 359,
  roof_blue_04: 231,
  roof_green: 229,
  roof_grey: 407,
  roof_purple: 227,
  roof_red: 225,
  roof_yellow: 233,
  sakura_pink: 117,
  sand: 135,
  semicolon: 521,
  seven: 31,
  sienna: 393,
  six: 29,
  sky_blue: 91,
  slash: 523,
  snow: 169,
  snowflake_lamp: 565,
  snowland: 343,
  snowman_body: 561,
  snowman_head: 559,
  soy_sauce: 426,
  spiderweb: 544,
  stained_glass: 123,
  stainless_steel: 247,
  star_lamp: 562,
  stone: 129,
  stone_brick_01: 323,
  stone_brick_02: 325,
  stone_pillar_03: 267,
  stone_pillar_04: 269,
  stone_pillar_05: 271,
  stone_pillar_06: 273,
  stone_wall: 275,
  stone_wall_01: 335,
  strawberry_juice: 412,
  stripe_01: 185,
  stripe_02: 187,
  stripe_03: 189,
  stripe_04: 191,
  stripe_05: 193,
  subtract: 5,
  television: 481,
  three: 23,
  tilde: 525,
  toolbox: 647,
  traditional_window: 578,
  treasure_chest: 649,
  turquoise: 367,
  two: 21,
  warm_yellow_light: 301,
  water: 364,
  white: 177,
  white_grass: 539,
  white_light: 299,
  window: 160,
  windygrass: 469,
  winter_leaf: 527,
  wood: 257,
  wooden_box: 179,
  woodstone_12: 411,
  yellow_decorative_light: 572,
  yellow_grass: 477,
  yellow_green: 101,
  yellow_light: 285,
  zero: 17,
};
(async function () {
  "use strict";
  let mode, lastUrl;
  const stats = new Stats();
  document.body.append(stats.domElement);
  function log(...m) {
    GM_log("[Box3++]", m.join(" "));
  }
  function checkMode() {
    let url = location.href;
    mode = null;
    const matches = {
      "^https://box3.+/maas": "maas",
      "^https://box3.+/e/.+": "editor",
      "^https://box3.+/p/.+": "play",
      "^https://box3.+/me/content": "map-create",
      "^https://box3.+/g/.+": "game-view",
      "^https://box3.+/p/.+": "game-play",
    };
    for (let e of Object.keys(matches)) {
      if (new RegExp(e).test(url)) mode = matches[e];
    }
    log("ModeChecked", mode || "<NONE " + url + ">");
  }
  function getWebsiteCore() {
    return document.querySelector(".desktop")._reactRootContainer._internalRoot
      .current.updateQueue.baseState.element.props.children.props.website;
  }
  function getGameplayCore() {
    return document.querySelector(".desktop")._reactRootContainer._internalRoot
      .current.updateQueue.baseState.element.props.children.props.children
      .props;
  }
  function getEditorCore() {
    return document.querySelector(".desktop")._reactRootContainer._internalRoot
      .current.updateQueue.baseState.element.props.children.props.children
      .props;
  }
  async function waitElement(selector) {
    let el;
    while (!el) {
      el = document.querySelector(selector);
      await new Promise(requestAnimationFrame);
    }
    return el;
  }
  Object.assign(document, { getWebsiteCore, getGameplayCore, getEditorCore });
  let gui;
  async function setupGameMode() {
    gui.title("   Box3++ 工具箱 (GameplayMode)");
    let loadingLabel = gui.add({ a() {} }, "a").disable();
    function setLoading(s) {
      if (!!s) loadingLabel.name("⏳ " + s + "...");
      else loadingLabel.name("✅ GameplayMode 准备就绪");
    }

    setLoading("正在进入地图");
    document.func = document.querySelector('.desktop')._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props.state;
    const state = getGameplayCore().state;
      const core= getGameplayCore()
    Object.assign(document, { state });
    await new Promise(requestAnimationFrame);
    await getGameplayCore().start();
      state.brpc.skin.api
          .getAll()
          .then(
          (a) => (state.box3.state.secret.availableSkin = a.map((o) => o.name))
     );
    while (state.appState !== 3) {
      await new Promise(requestAnimationFrame);
    }
      while (true) {
        if (document.func.box3.loading.appLoaded) break;
        await sleep(100);
    };
    confirm('本次启动用时' + document.func.box3.loading.pending + 'ms');
    var box3plus = {
        flying: false,
        // saveblocks: [],
        playerIndex: 0,
        cameraFovY: 0.25,
        scale: 0.5,
        "t":()=>{box3plus.scale=10;},
        "e":()=>{box3plus.scale=1;}
    };
      console.log(state.box3.state);
    setInterval(() => {
        state.box3.client.destory();
        state.box3.state.replica.players.forEach((param, index) => {
           //if(param.scale>=1)param.scale = box3plus.scale;
            param.runSpeed=10;
            param.runAcceleration=10;
            param.crouchSpeed=10;
        });
    }, 0.5);
    setLoading(null);
  const options = {
    transparentSkin() {
      core.setSkin({
        head: "none",
        hips: "none",
        leftFoot: "none",
        leftHand: "none",
        leftLowerArm: "none",
        leftLowerLeg: "none",
        leftShoulder: "none",
        leftUpperArm: "none",
        leftUpperLeg: "none",
        neck: "none",
        rightFoot: "none",
        rightHand: "none",
        rightLowerArm: "none",
        rightLowerLeg: "none",
        rightShoulder: "none",
        rightUpperArm: "none",
        rightUpperLeg: "none",
        torso: "none",
      });
        Object.keys(state.box3.uiState.playerSkin).forEach((x)=>{state.box3.uiState.playerSkin[x]=""});
        state.box3.uiState.isFlying=true;
         state.box3.user.displayname=true;
    },
    cameraMode: state.box3.state.secret.replica.camera.mode,

  };
      const skinFolder = gui.addFolder("皮肤");
      skinFolder.add(options, "transparentSkin").name("切换为透明皮肤");
    const cameraFolder = gui.addFolder("   摄像机视角");
    cameraFolder
      .add(state.box3.state.secret.replica.camera, "mode", {
        第三人称: 0,
        "固定(FIXED)": 1,
        第一人称: 2,
        固定方向: 3,
        锁定: 4,
      })
      .name("视角模式")
      .onChange((value) =>
        value === 0
          ? cameraDistanceSlider.enable()
          : cameraDistanceSlider.disable()
      );
    cameraFolder
      .add(state.box3.state.secret.replica.camera, "fovY", 0, 1, 0.01)
      .name("视场角(FOV)");
    const cameraDistanceSlider = cameraFolder
      .add(state.box3.state.secret.replica.camera, "distance", 0.1, 100)
      .name("摄像机距离");
    const videoEffectsFolder = gui.addFolder("   显示");
    videoEffectsFolder
      .add(state.box3.state.secret.replica, "enableCursor")
      .name("启用3D光标");

    videoEffectsFolder.add(state.box3.state, "hideUI").name("  隐藏界面");
    const networkFolder = gui.addFolder("   网络");
    networkFolder.add(state.box3.state.secret, "netPaused").name("网络暂停");
    const settingsFolder = gui.addFolder("⚙ 画质&音频 设置").close();
    const voxelEditorObj = {
      sx: 0,
      sy: 0,
      sz: 0,
      ex: 128,
      ey: 128,
      ez: 128,
      v: 364,
      replaceMode: false,
      replaceTarget: 0,
      d: 2048,
      blockFillAbort: false,
      async fill() {
        fillButton.disable().name("⌛ 正在填充...");
        if (this.ex < this.sx || this.ey < this.sy || this.ez < this.sz) {
          alert("输入信息错误 (结束坐标不能大于起始坐标)");
          fillButton.enable().name("开始填充");
          abortFillButton.disable();
          return;
        }
        let total =
          (this.ex + 1 - this.sx) *
          (this.ey + 1 - this.sy) *
          (this.ez + 1 - this.sz);
        let c = 0;
        for (let x = this.sx; x <= this.ex; x++) {
          for (let y = this.sy; y <= this.ey; y++) {
            for (let z = this.sz; z <= this.ez; z++) {
              if (this.blockFillAbort) break;
              try {
                if (this.replaceMode) {
                  if (state.box3.voxel.getVoxel(x, y, z) === this.replaceTarget){
                    state.box3.voxel._setVoxel(x, y, z, this.v);}
                } else if (state.box3.voxel.getVoxel(x, y, z) !== this.v) {
                  state.box3.voxel._setVoxel(x, y, z, this.v);
                }
              } catch (e) {
                console.log("Fill block error", e);
              }

              c++;
              if (this.d > 0 && c % this.d === 0) {
                fillButton.name(
                  `⌛ 正在填充 ${((c / total) * 100).toFixed(2)}%`
                );
                await new Promise(requestAnimationFrame);
              }
            }
          }
        }
        this.blockFillAbort = false;
        fillButton.enable().name("开始填充");
        abortFillButton.disable();
      },
      start() {
        abortFillButton.enable();
        this.fill();
      },
      abort() {
        this.blockFillAbort = true;
      },
      swithBlocks() {
        const temp = Number(this.v);
        this.v = Number(this.replaceTarget);
        this.replaceTarget = temp;
        voxelsFolder.controllers.forEach((i) => i.updateDisplay());
      },
    };
     var datas = {
         "清空聊天框":()=>{state.box3.state.chat.log=[];},
         "发送长消息":()=>{
             var dialogs = addwindow("发送长消息","可绕过禁言，在下方输入消息，回车换行，Shift+回车发送。\n另外，发送的内容请自行打开“聊天区”查看",500);
             var div1 = addhtml(dialogs.dialog,"div",{class:"div"},"");
             var div2 = addhtml(dialogs.dialog,"div",{class:"div"},"");
             var input = addhtml(div2,"textarea",{style:"width:100%;height:250px;background:#0000;color:#fff;outline: none;resize: none;padding:10px;margin-top:10px"},"")
             var fjcg=()=>{var a = addhtml(dialogs.dialog,"div",{class:"div"},"发送成功！");setTimeout(()=>{a.remove()},2000)}
             var send = ()=>{
                 state.box3.chat.sendMessage(input.value);
                 setTimeout(()=>{input.value=""},100);fjcg()
             }
             addhtml(div1,"button",{},"粘贴文本").onclick=async()=>{input.value=await navigator.clipboard.readText();}
             addhtml(div1,"button",{},"一键发送").onclick=send
             input.onkeydown=(e)=>{if(e.key=="Enter"&&e.shiftKey){send()}}
         },
     }
     var p25 = gui.addFolder('聊天框设置');
      p25.add(datas, '清空聊天框').name('清空聊天框');
      p25.add(datas, '发送长消息').name('发送长消息');
    const voxelsFolder = gui.addFolder("   客户端世界编辑").close();

    voxelsFolder.add(voxelEditorObj, "sx", 0, 256, 1).name("起始X");
    voxelsFolder.add(voxelEditorObj, "sy", 0, 256, 1).name("起始Y");
    voxelsFolder.add(voxelEditorObj, "sz", 0, 704, 1).name("起始Z");
    voxelsFolder.add(voxelEditorObj, "ex", 0, 256, 1).name("结束X");
    voxelsFolder.add(voxelEditorObj, "ey", 0, 256, 1).name("结束Y");
    voxelsFolder.add(voxelEditorObj, "ez", 0, 704, 1).name("结束Z");
    voxelsFolder.add(voxelEditorObj, "v", VOXEL_NAME_TO_ID).name("方块");
    voxelsFolder
      .add(voxelEditorObj, "replaceMode")
      .name("替换模式")
      .onChange((v) =>
        v ? replaceTargetSelect.enable() : replaceTargetSelect.disable()
      );
    const replaceTargetSelect = voxelsFolder
      .add(voxelEditorObj, "replaceTarget", VOXEL_NAME_TO_ID)
      .name("替换目标方块")
      .disable();
    voxelsFolder
      .add(voxelEditorObj, "d", {
        "最快(易卡顿)": -1,
        极快: 16384,
        较快: 8192,
        快: 4096,
        中: 2048,
        慢: 1024,
        较慢: 512,
        最慢: 256,
        极慢: 128,
        最慢: 1,
      })
      .name("运行速度");
    voxelsFolder
      .add(voxelEditorObj, "swithBlocks")
      .name("   互换填充方块和替换目标方块");
    const fillButton = voxelsFolder
      .add(voxelEditorObj, "start")
      .name("开始填充");
    const abortFillButton = voxelsFolder
      .add(voxelEditorObj, "abort")
      .name("❌ 中止")
      .disable();
    const pvpButton = voxelsFolder
      .add(box3plus, "t")
      .name("开始获取所有玩家位置");
   const xianButton = voxelsFolder
      .add(box3plus, "e")
      .name("结束获取所有玩家位置");
      console.log(state.restartServer);
      console.log(state);
   const projectFolder = gui.addFolder("项目");
      projectFolder.add(state, "restartServer").name("重启");
    function finishSettings() {
      getGameplayCore().setGameSettings(document.state.uiState.settings);
    }
    [
      settingsFolder
        .add(document.state.uiState.settings, "animationQuality", {
          无: 0,
          最低: 1,
          极低: 2,
          低: 4,
          中: 20,
          高: 100,
          极高: 200,
        })
        .name("动画质量"),
      settingsFolder
        .add(document.state.uiState.settings, "bloom")
        .name("Bloom (荧光效果)"),
      settingsFolder
        .add(
          document.state.uiState.settings,
          "cameraSensitivity",
          0.01,
          3,
          0.01
        )
        .name("视角灵敏度"),
      settingsFolder
        .add(document.state.uiState.settings, "drawDistance", 1, 1024, 1)
        .name("渲染距离(能见距离)"),
      settingsFolder
        .add(document.state.uiState.settings, "effectsMute")
        .name("音效静音"),
      settingsFolder
        .add(document.state.uiState.settings, "effectsVolume", 0, 1)
        .name("音效音量"),
      settingsFolder
        .add(document.state.uiState.settings, "fxaa")
        .name("FXAA抗锯齿"),
      settingsFolder
        .add(document.state.uiState.settings, "gamma", 0, 2)
        .name("伽马"),
      settingsFolder
        .add(document.state.uiState.settings, "hdSky")
        .name("高清天空"),
      settingsFolder
        .add(document.state.uiState.settings, "lowQualityTextures")
        .name("低质量贴图"),
      settingsFolder
        .add(document.state.uiState.settings, "masterMute")
        .name("主音量静音"),
      settingsFolder
        .add(document.state.uiState.settings, "masterVolume", 0, 1, 0.01)
        .name("主音量大小"),
      settingsFolder
        .add(document.state.uiState.settings, "maxParticleGroups", 0, 1024, 1)
        .name("最大粒子组数量"),
      settingsFolder
        .add(document.state.uiState.settings, "maxParticles", 0, 65526 * 2, 1)
        .name("最大粒子特效数量"),
      settingsFolder
        .add(document.state.uiState.settings, "maxSoundEffects", 0, 32, 1)
        .name("最大音效数量"),
      settingsFolder
        .add(document.state.uiState.settings, "musicMute")
        .name("音乐静音"),
      settingsFolder
        .add(document.state.uiState.settings, "musicVolume", 0, 1, 0.01)
        .name("音乐音量"),
      settingsFolder
        .add(document.state.uiState.settings, "parallaxMap")
        .name("视差贴图"),
      settingsFolder
        .add(document.state.uiState.settings, "parallaxDistance", 1, 128, 1)
        .name("视差距离"),
      settingsFolder
        .add(document.state.uiState.settings, "postprocess")
        .name("后期处理特效"),
      settingsFolder
         .add(document.state.uiState.settings, "reflections")
        .name("反射"),
      settingsFolder
        .add(document.state.uiState.settings, "resolutionScale", 0.1, 2, 0.1)
        .name("画面解析度(清晰度)"),
      settingsFolder.add(location, "reload").name("刷新以应用清晰度设置"),
      settingsFolder
        .add(document.state.uiState.settings, "safeShaders")
        .name("使用安全光影"),
      settingsFolder
        .add(document.state.uiState.settings, "shadowResolution", {
          关闭: 0,
          极低: 128,
          较低: 256,
          低: 512,
          中: 1024,
          高: 2048,
          较高: 4096,
          极高: 8192,
          超高: 16384,
        })
        .name("阴影质量"),
      settingsFolder
        .add(document.state.uiState.settings, "uiMute")
        .name("界面音效静音"),
      settingsFolder
        .add(document.state.uiState.settings, "uiVolume", 0, 1, 0.01)
        .name("界面音效音量"),
      settingsFolder
        .add(document.state.uiState.settings, "depthOfField", 0, 100, 1)
        .name("景深强度"),
      settingsFolder
        .add(document.state.uiState.settings, "volumetricScattering")
        .name("体积散射"),
    ].forEach((i) => i.onChange(finishSettings));
    needUpdateFolders.push(
      cameraFolder,
      videoEffectsFolder,
      settingsFolder,
      networkFolder
    );
  }
  async function setupEditorMode() {
    function sleep(ms){
        return new Promise(function (resolve, reject) {
            setTimeout(() => {
                resolve()
            }, ms);
        });
    };
    gui.title("   Box3++ 工具箱 (EditorMode)");
    let loadingLabel = gui.add({ a() {} }, "a").disable();
    document.func = document.querySelector(".desktop")._reactRootContainer._internalRoot.current.updateQueue.baseState.element.props.children.props.children.props;
    function setLoading(s) {
      if (!!s) loadingLabel.name("⏳ " + s + "...");
      else loadingLabel.name("✅ EditorMode 准备就绪");
    }

    setLoading("正在进入地图");
    await new Promise(requestAnimationFrame);
    const nstate = getEditorCore();
    await getEditorCore().onStart();
    while (!getGameplayCore().state) {
      await new Promise(requestAnimationFrame);
    }
    const state = getGameplayCore().state;
    Object.assign(document, { state });
    setLoading(null);
      const box3CoreElement = document.querySelector("#edit-react");
  const reactNodeName = Object.keys(box3CoreElement).filter((v) =>
    v.includes("reactContain")
  )[0];
  const core =
    box3CoreElement[reactNodeName].updateQueue.baseState.element.props.children
      .props.children.props;
    const cameraFolder = gui.addFolder("   摄像机视角");
    // cameraFolder
    //   .add(state.box3.state.camera, "mode", {
    //     第三人称: 0,
    //     "固定(FIXED)": 1,
    //     第一人称: 2,
    //     固定方向: 3,
    //     锁定: 4,
    //   })
    //   .name("视角模式");
    cameraFolder
      .add(state.box3.state.camera, "fovY", 0, 1, 0.01)
      .name("视场角(FOV)");
    cameraFolder
      .add(state.box3.state.camera, "distance", 0.1, 100)
      .name("摄像机距离");
    let getCode = gui.addFolder('爬取代码');
    let permission = gui.addFolder('修改权限');
    var GUI = {
        'str':'',
        'chat':()=>{
            if(!GUI.str)return;
            nstate.client.state.box3.chat.sendGlobalNotice(GUI.str,'发送信息来自' + state.box3.state.secret.userName);
        },
        'getOwner':()=>{
            nstate.client.state.replica.localOwner=true;
            window.all=true
            confirm('获取成功!');
        },
    };
    let msg =gui.addFolder('信息发送');
    msg.add(GUI,'str').name("输入信息文本");
    msg.add(GUI, 'chat').name('发送顶部横幅信息');
    let dict = nstate.client.state.codeEditor.fileDict;
    do{
        dict =nstate.client.state.codeEditor.fileDict;
        await sleep(100);
    }while(JSON.stringify(dict)==='{}');
    let options = [];
    for(let x in dict){
        options[dict[x].name]=()=>{
            navigator.clipboard.writeText(dict[x].text);
            confirm('复制代码成功!');
        };
        getCode.add(options,dict[x].name).name(dict[x].name);
    };
      window.all=false
    var permissionList=nstate.client.state.replica.localPermissions;console.log(permissionList);
      var gug={
          'getOwner':()=>{
            try{
                getEditorCore().debugEnd();
            }catch(e){
               confirm('服务器拒绝了访问')
               return;
           }
            confirm('关闭成功!');
        },
      }
      var gup={
          'getOwner':()=>{
             try{
                getEditorCore().debugStart();
            }catch(e){
               confirm('服务器拒绝了访问')
               return;
           }
            confirm('开启成功!');
        },
      }
      var gupi={
          'getOwner':()=>{
             navigator.clipboard.writeText(document.func.client.state.replica.project.prevHash);
             console.log({'hash':document.func.client.state.replica.project.prevHash})
            confirm('已在控制台输出并复制hash!hash为: '+ document.func.client.state.replica.project.prevHash);
        },
      }
    permission.add(GUI,'getOwner').name("爬取所有权限");
    permission.add(gug,'getOwner').name("结束运行程序");
       permission.add(gup,'getOwner').name("开始运行程序");
    permission.add(gupi,'getOwner').name("在控制台输出地图hash并复制");
      console.log(state.box3.state.config)
      permission.add(state.box3.state.config, "admin").name("管理员标志");
      permission.add(state.box3.state.config, "development").name("开发模式标志");
    setInterval(function(){
        nstate.client.state.replica.localOwner=true;
        Object.keys(permissionList).forEach((listitem) => {
            if(permissionList[listitem]==false && window.all){
                permissionList[listitem]=true;
            }
        })
    },100);
    var datas = {
         "清空聊天框":()=>{state.box3.state.chat.log=[];},
         "发送长消息":()=>{
             var dialogs = addwindow("发送长消息","可绕过被禁言，在下方输入消息，回车换行，Shift+回车发送。\n另外，发送的内容请自行打开“聊天区”查看",500);
             var div1 = addhtml(dialogs.dialog,"div",{class:"div"},"");
             var div2 = addhtml(dialogs.dialog,"div",{class:"div"},"");
             var input = addhtml(div2,"textarea",{style:"width:100%;height:250px;background:#0000;color:#fff;outline: none;resize: none;padding:10px;margin-top:10px"},"")
             var fjcg=()=>{var a = addhtml(dialogs.dialog,"div",{class:"div"},"发送成功！");setTimeout(()=>{a.remove()},2000)}
             var send = ()=>{
                 state.box3.chat.sendMessage(input.value);
                 setTimeout(()=>{input.value=""},100);fjcg()
             }
             addhtml(div1,"button",{},"粘贴文本").onclick=async()=>{input.value=await navigator.clipboard.readText();}
             addhtml(div1,"button",{},"一键发送").onclick=send
             input.onkeydown=(e)=>{if(e.key=="Enter"&&e.shiftKey){send()}}
         },
     }
     var p25 = gui.addFolder('聊天框设置');
      p25.add(datas, '清空聊天框').name('清空聊天框');
      p25.add(datas, '发送长消息').name('发送长消息');
    const videoEffectsFolder = gui.addFolder("   显示");

    videoEffectsFolder.add(state.box3.state, "hideUI").name("  隐藏界面");
    const networkFolder = gui.addFolder("   网络");
    networkFolder.add(state.box3.state.secret, "netPaused").name("网络暂停");
    needUpdateFolders.push(networkFolder, videoEffectsFolder, cameraFolder);
    gui
      .add(
        {
          clear() {
            state.debugger.log = [];
          },
        },
        "clear"
      )
      .name("清空控制台");
      const projectFolder = gui.addFolder("项目");
      projectFolder.add(core, "restartServer").name("重启");
  }


  async function setupHashBlockTools() {
    const folder = gui.addFolder("   HashBlock 工具").close();
    folder
      .add(
        {
          help() {
            alert(
              "在Box3中,许多数据都是由hash存储的, 任何资源都可以用hash表示(比如一个地图,图片,版本信息等),如果要知道某个hash表示的内容,就可以通过 https://static.box3.codemao.cn/block/xxxxx 得到"
            );
          },
        },
        "help"
      )
      .name("❔ 什么是HashBlock");

    const obj = {
      upload() {
        const input = document.createElement("input");
        input.type = "file";
        input.style.display = "none";
        input.addEventListener("change", () => {
          uploadButton.disable();
          let reader = new FileReader();
          reader.addEventListener("load", () => {
            GM_xmlhttpRequest({
              method: "post",
              url: "https://static.box3.codemao.cn/block",
              data: reader.result,
              binary: true,
              onload({ response }) {
                const { Key, Size } = JSON.parse(response);
                alert(
                  "上传成功! (如果上传了图片,可通过图片工具查看,hash已自动填入)\n\nHash: " +
                    Key +
                    "\n\n Size:" +
                    Size
                );
                imageToolsObj.hash = Key;
                uploadButton.enable();
                input.remove();
              },
            });
          });
          reader.readAsBinaryString(input.files[0]);
        });

        input.click();
      },
      openByHash() {},
    };
    const uploadButton = folder.add(obj, "upload").name("上传文件");
    const imageFolder = folder.addFolder("   图片工具");
    const imageToolsObj = {
      width: 0,
      height: 0,
      hash: "",
      type: ".png",
      open() {
        open(
          `https://static.box3.codemao.cn/block/${this.hash}_cover_${this.width}_${this.height}${this.type}`
        );
      },
    };
    needUpdateFolders.push(imageFolder);
    imageFolder.add(imageToolsObj, "width").name("宽度");
    imageFolder.add(imageToolsObj, "height").name("高度");
    imageFolder.add(imageToolsObj, "hash").name("HASH");
    imageFolder
      .add(imageToolsObj, "type", [
        ".png",
        ".jpg",
        ".jpeg",
        ".webm",
        ".gif",
        ".gmp",
        ".tga",
        ".dds",
        ".eps",
        ".hdr",
        ".raw",
      ])
      .name("图片格式");
    imageFolder.add(imageToolsObj, "open").name("打开图片");
  }
  async function setup() {
    if (gui) gui.destroy();

    gui = new lil.GUI({ title: "   Box3++ 工具箱" });
    gui.domElement.style.top = "unset";
    gui.domElement.style.bottom = "0";
    gui.domElement.style.userSelect = "none";

    const statsFolder = gui.addFolder("   性能监视器").close();
    statsFolder
      .add({ opacity: 0.9 }, "opacity", 0, 1)
      .name("透明度")
      .onChange((v) => {
        stats.domElement.style.opacity = v.toString();
        stats.domElement.style.display = v > 0 ? "block" : "none";
      });
    statsFolder
      .add({ zoom: 1 }, "zoom", 0.1, 5)
      .name("缩放")
      .onChange((v) => {
        stats.domElement.style.zoom = v.toString();
      });
    statsFolder
      .add(stats.domElement.style, "top", {
        上: "0px",
        下: "calc(100vh - 48px)",
      })
      .name("垂直位置");
    statsFolder
      .add(stats.domElement.style, "left", {
        左: "0px",
        右: "calc(100vw - 80px)",
      })
      .name("水平位置");

    function setUIWidth(v) {
      gui.domElement.style.width = v + "vw";
    }
    setUIWidth(GM_getValue("uiWidth", 20));
    gui
      .add({ width: GM_getValue("uiWidth", 20) }, "width", 10, 80)
      .name("工具箱界面宽度")
      .onFinishChange((v) => {
        GM_setValue("uiWidth", v);
        setUIWidth(v);
      });
    setupHashBlockTools();
    if (mode === "maas") {
      const folder = gui.addFolder("   Maas (商业版首页)");
      folder
        .add(
          {
            go() {
              location.href = "https://box3.codemao.cn";
            },
          },
          "go"
        )
        .name("切换到原版首页");
    } else if (mode === "map-create") {
      const folder = gui.addFolder("✨ 创建地图");
      const obj = {
        createNormal() {
          document
            .querySelector(
              "#main > main > div._3IbS6Ew1CROpnsaTbrniXH.pHRRH-pJlcoCY3qP0gcFI > div > div > div._1xZbWt8b7cKJ8PPcK2Ho81.-y0as17U00f3yUjy_bm6K"
            )
            .click();
        },
        async createLarge() {
          if (confirm("确认创建？")) {
            var themaphash = prompt('请输入地图hash(0为704巨大地图,hash可以在创作端获取,把hash复制过来可以复制地图(不会复制合作者)):');
            if(!themaphash){confirm("请输入hash!");return;}
              if (!/^[A-Za-z0-9]+$/.test(themaphash)){confirm(themaphash+'不是有效的hash!');return;}
             if(themaphash=='0'){
                 themaphash="QmTuELNrZixUHYytsqJAUCw8R22868ePtkNCQ4DMUd8wCg";
             }
              createLargeMapButton.name("创建中...").disable();
            await getWebsiteCore().rpc.container.api.createGameEdit({
              createNow: true,
              describe: "未激活的 空白超大地图, 进入地图即可自动激活",
              image: "Qmd3todt2XFprijAdxYyia5DQGinvgWGgGnfxByyn8rsp4",
              name: "空白超大地图 (未激活)",
              hash: themaphash,
            });
            for (let i = 0; i < 3; i++) {
              document
                .querySelector(
                  "#main > main > div.bg-white.mb-24.p-24-0.cKMigh6PpW3tleaZK6J1R > div > div.hAB8LjZSi73-MLk-0ZUWg.tab-bar > button._3AspHqpBNnv2Z9vUyC6Fnx.vbojj-sJcBnYnXKqRwxoU._12b-ZtA2Hl4-wYcKqK83AR._1SS6wc-FMtveQU1rUrkRW.Lz4uEvJd_qOzG39N7jnOg._1KXyfkOCOG7H7xR_ULs_R7._3mGcht4WhuRtvCwPGKNEvg"
                )
                .click();
              await new Promise((r) => setTimeout(r, 100));
            }
            location.reload();
              confirm('操作成功!(若界面无法打开,则表明hash不正确)')
          }
        },
      };
      folder.add(obj, "createNormal").name("创建普通地图");
      const createLargeMapButton = folder
        .add(obj, "createLarge")
        .name("创建 特殊 地图");
    } else if (mode === "game-view") {
      const folder = gui.addFolder("   信息爬取");
      const obj = {
        'getData':async()=> {
          return await getWebsiteCore().rpc.content.api.get({
            type: "id",
            data: {
              contentId: Number(/\/g\/(\w+)/.exec(location.href)[1]),
              type: 1,
              isPublic: true,
            },
          });
        },
        async openHash() {
          open(
            "https://static.box3.codemao.cn/block/" + (await obj.getData()).hash
          );
        },
        async logData() {
          console.dir(await obj.getData());
        },
        async viewImage() {
          open(
            `https://static.box3.codemao.cn/block/${
              (await obj.getData()).image
            }_cover_1024_1024.png`
          );
        },
           async openEdit() {
      await getWebsiteCore().rpc.content.api
        .get({
          type: "id",
          data: {
            contentId: Number(location.pathname.replace("/g/", "")),
            isPublic: true,
            meshHash: false,
            type: 1,
            userId: 0,
          },
        })
        .then((d) => {
          open(
            `https://box3.codemao.cn/e/${d.edit_container_name.replace("edit-", "")}`
          );
        });
    },
      };
      //folder.add(obj, "openHash").name("查看地图hash数据");
      folder.add(obj, "logData").name("在控制台输出content数据");
      folder.add(obj, "viewImage").name("查看高清地图封面(1024*1024)");
        folder.add(obj, "openEdit").name("进入此地图的编辑器");
    } else if (mode === "game-play") {
      const startButton = gui
        .add(
          { setupGameMode: () => setupGameMode() && startButton.destroy() },
          "setupGameMode"
        )
        .name("   进入地图并启动GameplayMode");
      (
        await waitElement(
          "#react-container > div > div.O66fmAuhyYLyfNI6acu4f > div._2CGySt2UC265XvYttBgcIv"
        )
      ).addEventListener("click", () => {
        startButton.disable().name("   已手动进入地图");
      });
    } else if (mode === "editor") {
      const startButton = gui
        .add(
          { setupEditorMode: () => setupEditorMode() && startButton.destroy() },
          "setupEditorMode"
        )
        .name("   进入编辑器并启动EditorMode");
      (
        await waitElement(
          "#edit-react > div > div._5nY6rqz-36T32MKojdWKN > div._2ts7vbxFxGrpFZ13IL0EJl > button"
        )
      ).addEventListener("click", () => {
        startButton.disable().name("   已手动进入编辑器");
      });
    } else {
      gui.addFolder("❌ 此界面没有增强工具可用").close();
    }
  }
  await waitElement(".desktop");

  const needUpdateFolders = [gui];

  function update() {
    requestAnimationFrame(update);
    stats.update();
    if (location.href !== lastUrl) {
      lastUrl = location.href.toString();
      checkMode();
      setup();
    }
    needUpdateFolders.forEach((i) => {
      if (i) i.controllers.forEach((j) => j.updateDisplay());
      else needUpdateFolders.splice(needUpdateFolders.indexOf(i), 1);
    });
  }
  update();
})();

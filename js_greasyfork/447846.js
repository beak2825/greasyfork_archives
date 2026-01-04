// ==UserScript==
// @name         bbox
// @version      0.1.1
// @description  boxbox
// @namespace    http://tampermonkey.net/
// @author       ATXDXDQY
// @license      MIT
// @match        https://box3.fun/*
// @match        https://box3.codemao.cn/*
// @icon         https://box3.fun/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.16
// @require      https://cdn.jsdelivr.net/npm/three@0.142.0/examples/js/libs/stats.min.js
// @require      https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      static.box3.codemao.cn
// @downloadURL https://update.greasyfork.org/scripts/447846/bbox.user.js
// @updateURL https://update.greasyfork.org/scripts/447846/bbox.meta.js
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
    gui.title("🧰 Box3++ 工具箱 (GameplayMode)");
    let loadingLabel = gui.add({ a() {} }, "a").disable();
    function setLoading(s) {
      if (!!s) loadingLabel.name("⏳ " + s + "...");
      else loadingLabel.name("✅ GameplayMode 准备就绪");
    }

    setLoading("正在进入地图");
    const state = getGameplayCore().state;
    Object.assign(document, { state });
    await new Promise(requestAnimationFrame);
    await getGameplayCore().start();
    while (state.appState !== 3) {
      await new Promise(requestAnimationFrame);
    }
    setLoading(null);
    const cameraFolder = gui.addFolder("📷 摄像机视角");
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
    const videoEffectsFolder = gui.addFolder("💻 显示");
    videoEffectsFolder
      .add(state.box3.state.secret.replica, "enableCursor")
      .name("启用3D光标");

    videoEffectsFolder.add(state.box3.state, "hideUI").name("👁隐藏界面");
    const networkFolder = gui.addFolder("🌐 网络");
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
                  if (state.box3.voxel.getVoxel(x, y, z) === this.replaceTarget)
                    state.box3.voxel._setVoxel(x, y, z, this.v);
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
    const voxelsFolder = gui.addFolder("🪐 客户端世界编辑").close();

    voxelsFolder.add(voxelEditorObj, "sx", 0, 256, 1).name("起始X");
    voxelsFolder.add(voxelEditorObj, "sy", 0, 256, 1).name("起始Y");
    voxelsFolder.add(voxelEditorObj, "sz", 0, 704, 1).name("起始Z");
    voxelsFolder.add(voxelEditorObj, "ex", 0, 256, 1).name("结束Z");
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
      .name("🔀 互换填充方块和替换目标方块");
    const fillButton = voxelsFolder
      .add(voxelEditorObj, "start")
      .name("开始填充");
    const abortFillButton = voxelsFolder
      .add(voxelEditorObj, "abort")
      .name("❌ 中止")
      .disable();

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
      // settingsFolder
      //   .add(document.state.uiState.settings, "reflections")
      //   .name("反射"),
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
    gui.title("🧰 Box3++ 工具箱 (EditorMode)");
    let loadingLabel = gui.add({ a() {} }, "a").disable();
    function setLoading(s) {
      if (!!s) loadingLabel.name("⏳ " + s + "...");
      else loadingLabel.name("✅ EditorMode 准备就绪");
    }

    setLoading("正在进入地图");
    await new Promise(requestAnimationFrame);
    await getEditorCore().onStart();
    while (!getGameplayCore().state) {
      await new Promise(requestAnimationFrame);
    }
    const state = getGameplayCore().state;
    Object.assign(document, { state });

    setLoading(null);
    const cameraFolder = gui.addFolder("📷 摄像机视角");
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
    const videoEffectsFolder = gui.addFolder("💻 显示");

    videoEffectsFolder.add(state.box3.state, "hideUI").name("👁隐藏界面");
    const networkFolder = gui.addFolder("🌐 网络");
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
      //gui
        //.add(
          //{
          //},
          //"copy"
       // )
       // .name("复制建筑");
      
  }
  async function setupHashBlockTools() {
    const folder = gui.addFolder("💾 HashBlock 工具").close();
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
    const imageFolder = folder.addFolder("🎴 图片工具");
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

    gui = new lil.GUI({ title: "🧰 Box3++ 工具箱" });
    gui.domElement.style.top = "unset";
    gui.domElement.style.bottom = "0";
    gui.domElement.style.userSelect = "none";

    const statsFolder = gui.addFolder("📊 性能监视器").close();
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
      const folder = gui.addFolder("🎫 Maas (商业版首页)");
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
            createLargeMapButton.name("创建中...").disable();
            await getWebsiteCore().rpc.container.api.createGameEdit({
              createNow: true,
              describe: "未激活的 空白超大地图, 进入地图即可自动激活",
              image: "Qmd3todt2XFprijAdxYyia5DQGinvgWGgGnfxByyn8rsp4",
              name: "空白超大地图 (未激活)",
              hash: "QmTuELNrZixUHYytsqJAUCw8R22868ePtkNCQ4DMUd8wCg",
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
          }
        },
        async createother() {
          if (confirm("确认复制？")) {
            var word = prompt("请输入复制地图的hash","");
            if(word){
                alert("正在复制hash为"+word+"的地图");
            }
            createotherMapButton.name("正在复制中...").disable();
            await getWebsiteCore().rpc.container.api.createGameEdit({
              createNow: true,
              describe: "",
              image: "Qmd3todt2XFprijAdxYyia5DQGinvgWGgGnfxByyn8rsp4",
              name: "复制的地图",
              hash: word,
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
          }
        },
        async copybulid() {
          if (confirm("确认复制？")) {
            var X1 = prompt("请输入建筑的x起始点","");
            if(X1){
                alert("X1="+X1);
            }
            var X2 = prompt("请输入建筑的x起终点","");
            if(X2){
                alert("X2="+X2);
            }
            var Y1 = prompt("请输入建筑的y起始点","");
            if(Y1){
                alert("X1="+X1);
            }
            var Y2 = prompt("请输入建筑的y起终点","");
            if(Y2){
                alert("Y2="+Y2);
            }
            var Z1 = prompt("请输入建筑的z起始点","");
            if(Z1){
                alert("Z1="+Z1);
            }
            var Z2 = prompt("请输入建筑的z起终点","");
            if(Z2){
                alert("Z2="+Z2);
            }
            confirm("正在处理中");
            function copyUrl2(){
              var Url2=document.getElementById("biao1");
              Url2.select(); // 选择对象
              document.execCommand("Copy"); // 执行浏览器复制命令
              alert("已复制好，可贴粘。");
            }
            //<textarea cols="20" rows="10" id="biao1">用户定义的代码区域</textarea>
            //<input type="button" onClick="copyUrl2()" value="点击复制代码" />
        }
      }
      }
      folder.add(obj, "createNormal").name("创建普通地图")
      const createLargeMapButton = folder
        .add(obj, "createLarge")
        .name("创建 256x256x704 巨大地图");
      const createotherMapButton = folder
        .add(obj, "createother")
        .name("复制地图");
      //const createotherMapButton = folder
        //.add(obj, "copybuild")
        //.name("复制建筑");
      
      
    } else if (mode === "game-view") {
      const folder = gui.addFolder("🐞 信息爬取");
      const obj = {
        async getData() {
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
        async openHeadHash() {
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
      };
      folder.add(obj, "openHash").name("查看地图hash数据");
      //folder.add(obj, "openHeadHash").name("查看地图Headhash数据");
      folder.add(obj, "logData").name("在控制台输出content数据");
      folder.add(obj, "viewImage").name("查看高清地图封面(1024*1024)");
    } else if (mode === "game-play") {
      const startButton = gui
        .add(
          { setupGameMode: () => setupGameMode() && startButton.destroy() },
          "setupGameMode"
        )
        .name("🎮 进入地图并启动GameplayMode");
      (
        await waitElement(
          "#react-container > div > div.O66fmAuhyYLyfNI6acu4f > div._2CGySt2UC265XvYttBgcIv"
        )
      ).addEventListener("click", () => {
        startButton.disable().name("💡 已手动进入地图");
      });
    } else if (mode === "editor") {
      const startButton = gui
        .add(
          { setupEditorMode: () => setupEditorMode() && startButton.destroy() },
          "setupEditorMode"
        )
        .name("🧩 进入编辑器并启动EditorMode");
      (
        await waitElement(
          "#edit-react > div > div._5nY6rqz-36T32MKojdWKN > div._2ts7vbxFxGrpFZ13IL0EJl > button"
        )
      ).addEventListener("click", () => {
        startButton.disable().name("💡 已手动进入编辑器");
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

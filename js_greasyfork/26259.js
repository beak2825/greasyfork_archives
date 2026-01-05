// ==UserScript==
// @name        NWP helper in GuangDong
// @description 广东省气象业务网数值预报页面增强
// @namespace   minhill.com
// @match     http://10.148.8.228/to_fore_homepage.action*
// @match     http://10.148.8.18/ywwhome/vision/multiDataApply/gisloader.html*
// @version     1.9.4
// @require     https://lib.baomitu.com/echarts/4.6.0/echarts.min.js
// @require     https://lib.baomitu.com/moment.js/2.24.0/moment.min.js
// @require     https://lib.baomitu.com/d3/5.15.0/d3.min.js
// @grant       GM_addStyle
// @grant       unsafeWindow
// @grant       GM_openInTab
// @grant       GM_xmlhttpRequest
// @grant       GM_notification
// @license     The MIT License (MIT); http://opensource.org/licenses/MIT
// @connect     172.22.1.175
// @connect     127.0.0.1:5000
// @connect     api.map.baidu.com
// @connect     trident.gdmo.gq
// @connect     research.gdmo.gq
// @compatible  firefox
// @compatible  chrome
// @compatible  edge
// @note        2018/01/08 增加时效转换按钮
// @note        2018/01/15 增加经纬度功能
// @supportURL  https://greasyfork.org/scripts/26259
// @author      Hanchy Hill
// @downloadURL https://update.greasyfork.org/scripts/26259/NWP%20helper%20in%20GuangDong.user.js
// @updateURL https://update.greasyfork.org/scripts/26259/NWP%20helper%20in%20GuangDong.meta.js
// ==/UserScript==
// TODO 数据格式错误时显示提示
// TODO require resData
// TODO 风向tooltip改进
// TODO 增加气压
// TODO 增加集合预报-32天预报
// TODO 单站停止经纬度捕捉
// TODO 分钟降水时时效切换错误
// TODO 显示单击的点
// TODO 垂直剖面NCL测试
// TODO 垂直探空曲线
// TODO 降水量, 风力分级
// TODO 多图模式时次选择
const modelMeta = [
  {
    "model": "grapes1km",
    "rule": "/{yyyymmdd}/{HH}/grapes1km_{range}_{name}_m{hhh}_{yyyy}{mm}{dd}{HH}{mi}.png",
    "modelName": "Grapes_gz_R_1km"
  },
  {
    "model": "grapesmeso_b",
    "rule": "grapesmeso_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes_Meso"
  },
  {
    "model": "grapescma_b",
    "rule": "grapescma_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes_全球"
  },
  {
    "model": "SCMOC",
    "rule": "SCMOC_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "客观短时预报"
  },
  {
    "model": "ecmwffine_b",
    "rule": "ecmwffine_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "ECMWF_细网格"
  },
  {
    "model": "ecmwfs2d_b",
    "rule": "ecmwfs2d_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "ECMWF_细网格(S2D)"
  },
  {
    "model": "ecmwfs2s",
    "rule": "ecmwfs2s_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "ECMWF细网格(S2S)"
  },
  {
    "model": "ecmwfc3e_b",
    "rule": "ecmwfc3e_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "ECMWF_集合"
  },
  {
    "model": "ecmwfs4f",
    "rule": "ecmwfs4f_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "ECMWF_32天"
  },
  {
    "model": "ecmwfEnsExt",
    "rule": "ecmwfEnsExt_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "ECMWF_46天"
  },
  {
    "model": "ecmwfc3y",
    "rule": "ecmwfc3y_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "ECMWF_C3Y"
  },
  {
    "model": "ncepgfs0p5",
    "rule": "ncepgfs0p5_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "NCEP"
  },
  {
    "model": "chaf",
    "rule": "chaf_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes_gz_R_3km"
  },
  {
    "model": "GTRAMS3KMEC_b",
    "rule": "GTRAMS3KMEC_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes_gz_3km"
  },
  {
    "model": "GTRAMS3KMNCEP_b",
    "rule": "GTRAMS3KMEC_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes_gz_3km(N)"
  },
  {
    "model": "Gtrams3kmCNEC",
    "rule": "Gtrams3kmCN_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes_gz_3km(CN)"
  },
  {
    "model": "Gtrams3kmCNGraGFS",
    "rule": "Gtrams3kmCN_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes_gz_3km(G)"
  },
  {
    "model": "grapes9ec",
    "rule": "grapes9_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes_gz_9km"
  },
  {
    "model": "grapes9",
    "rule": "grapes9_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes_gz_9km(N)"
  },
  {
    "model": "grapes18kmec_b",
    "rule": "grapes18_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes_gz_18km"
  },
  {
    "model": "grapes18km_b",
    "rule": "grapes18_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes_gz_18km(N)"
  },
  {
    "model": "wavepng_b",
    "rule": "wave_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes-海洋"
  },
  {
    "model": "seafog_b",
    "rule": "{name}{yyyy}{mm}{dd}{HH}result.gif",
    "modelName": "Grapes-海雾"
  },
  {
    "model": "graces_b",
    "rule": "graces_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "Grapes-环境"
  },
  {
    "model": "environment_b",
    "rule": "environment_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "CMA环境"
  },
  {
    "model": "fax_b",
    "modelName": "FAX传真图",
    "rule": ""
  },
  {
    "model": "obor_b",
    "rule": "ecmwfs2d_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "一带一路"
  },
  {
    "model": "clean_plot",
    "rule": "gz3km{yyyy}{mm}{dd}{HH}_{hhh}_{name}.png",
    "modelName": "Grapes_3km(CN)"
  },
  {
    "model": "cldas",
    "rule": "cldas_hn_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "国家局实况融合"
  },
  {
    "model": "OCEN_CODAS",
    "rule": "OCEN_CODAS_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "国家局海洋融合"
  },
  {
    "model": "SWMA",
    "rule": "swma_{range}_{name}_{hhh}_{yyyy}{mm}{dd}{HH}.png",
    "modelName": "热带所海面风融合"
  }
];

let multiModelRule = [
  {
    rule: [
      ['ecmwffine_b', ['oy', 'cn', 'hn', 'gd',], null],
      ['ncepgfs0p5', ['oy', 'cn', 'hn', 'gd',], null],
      ['grapescma_b', ['oy', 'cn', 'hn', 'gd',], null],
      ['grapes9ec', ['oy', 'cn', 'hn', 'gd',], null],
    ],
    name: 'EC/NCEP/G全球/G9kmEC',
    description: 'ECMWF, NCEP, Grapes全球, 南海台风模式9km',
    opt: { stritFit: true }
  },
  {
    rule: [
      ['ecmwffine_b', ['oy', 'cn', 'hn', 'gd',], null],
      ['ncepgfs0p5', ['oy', 'cn', 'hn', 'gd',], null],
      ['grapes9ec', ['cn', 'hn', 'gd',], null],
      ['grapesmeso_b', ['cn', 'hn', 'gd',], null],
    ],
    name: 'EC/NCEP/G9kmEC/G-meso',
    description: 'ECMWF, NCEP, 南海台风模式9km, Grapes-Meso',
    opt: { stritFit: true }
  },
  {
    rule: [
      ['ecmwffine_b', ['oy', 'cn', 'hn', 'gd',], null],
      ['ncepgfs0p5', ['oy', 'cn', 'hn', 'gd',], null],
      ['grapes9ec', ['cn', 'hn', 'gd',], null],
      ['GTRAMS3KMEC_b', ['hn', 'gd',], null],
    ],
    name: 'EC/NCEP/G9kmEC/G-meso',
    description: 'ECMWF, NCEP, 南海台风模式9km, Grapes-Meso',
    opt: { stritFit: true }
  },
]

let mvPatternList = [
  [{
    "elem": "t2mm",
    "elemCN": "2m气温",
    "region": "cn",
    "model": "ecmwffine_b",
    "modelFileName": "ecmwffine"
  },
  {
    "elem": "t2mm24",
    "elemCN": "2m气温24h变温",
    "region": "cn",
    "model": "ecmwffine_b",
    "modelFileName": "ecmwffine"
  },
  {
    "elem": "wind10m",
    "elemCN": "10m风",
    "region": "cn",
    "model": "ecmwffine_b",
    "modelFileName": "ecmwffine"
  },
  {
    "elem": "10gust3",
    "elemCN": "10m阵风(过去3h)",
    "region": "cn",
    "model": "ecmwffine_b",
    "modelFileName": "ecmwffine"
  }]
]

let userConfig = { // 用户设置
  alterDate: false, // 默认不修改时次
  timelineMove: false,//是否启用滑动时间触发
  debug: false,
  mvMode:undefined,
};

let $ = unsafeWindow.$;

const elemsConfig = {
  latLonInput: undefined,

  $doc: () => unsafeWindow.$doc,
  $settings: () => unsafeWindow.$settings,
  $home: unsafeWindow.$home,
  fixPoint: undefined,
  pointerPoint: { lat: 0, lon: 0 },// 地图锚点位置
  point01: undefined,
  point02: undefined,
  state: 'timeseries',//'vertical','skewT'
  compareImgDOM: { img: [], info: [] },//前后预报时次对比DOM引用
  mvImgDOM: {//四分图DOM引用
    img: [],
    info: [],
    mode: 'multiElem',//multiTime, multiModel, multiElem,multiInitime
    matchedSrcList: [],
    matchPattens: [{
      "elem": "t2mm",
      "elemCN": "2m气温",
      "region": "cn",
      "model": "ecmwffine_b",
      "modelFileName": "ecmwffine"
    },
    {
      "elem": "t2mm24",
      "elemCN": "2m气温24h变温",
      "region": "cn",
      "model": "ecmwffine_b",
      "modelFileName": "ecmwffine"
    },
    {
      "elem": "wind10m",
      "elemCN": "10m风",
      "region": "cn",
      "model": "ecmwffine_b",
      "modelFileName": "ecmwffine"
    },
    {
      "elem": "10gust3",
      "elemCN": "10m阵风(过去3h)",
      "region": "cn",
      "model": "ecmwffine_b",
      "modelFileName": "ecmwffine"
    },],
  },
};

let proxyConfig = new Proxy({
  showTcMode: false,
  showDetTcMode: true,
  showEnsTcMode: true,
  tcShowLock: false,
  preTime: '',
  preRegion: '',
  domTarget: {
    showTcMode: '#tc-mode-btn',
    showDetTcMode: '#tc-det-btn',
    showEnsTcMode: '#tc-ens-btn',
  },
  svgTarget: {
    showTcMode: '#wrap-draw-tc > svg',
    showDetTcMode: '#wrap-draw-tc > svg .svg-tc-det',
    showEnsTcMode: '#wrap-draw-tc > svg .svg-tc-ens',
  }
}, {
  set: function (obj, prop, value, receiver) {
    if (prop === 'tcShowLock') return;
    const tcShowDom = document.querySelector(obj.domTarget.showTcMode);
    obj[prop] = value;
    // console.error(obj.showDetTcMode);
    // console.error(obj.showEnsTcMode);
    if (prop === 'showTcMode') {

      let detDom = document.querySelector(obj.domTarget['showDetTcMode']);
      let ensDom = document.querySelector(obj.domTarget['showEnsTcMode']);
      if (value === true) {
        tcShowDom.classList.add('active-button');
        detDom.classList.remove('display-none');
        ensDom.classList.remove('display-none');
        if (obj.showDetTcMode || obj.showEnsTcMode) showSvgTC();
        // 如果全为false则不执行showSvgTC();

        // TODO 显示SVG
        // 重绘SVG
      } else {
        tcShowDom.classList.remove('active-button');
        detDom.classList.add('display-none');
        ensDom.classList.add('display-none');
        let svgTC = document.querySelector('#wrap-draw-tc');
        if (svgTC) svgTC.classList.add('display-none');
      }

    } else if (prop == 'showDetTcMode' || prop == 'showEnsTcMode') {

      let targetDom = document.querySelector(obj.domTarget[prop]);
      if (value === true) {
        targetDom.classList.add('active-button');
        showSvgTC();
      } else {
        targetDom.classList.remove('active-button');
        let targetSvgGroup = document.querySelector(obj.svgTarget[prop]);
        if (targetSvgGroup) targetSvgGroup.classList.add('display-none');

        if (!obj.showDetTcMode && !obj.showEnsTcMode) {// 全为flase则取消台风选择
          receiver.showTcMode = false;
        }
        // svg-tc-ens
        // TODO 隐藏对应的<g>元素
      }
    }
  }
})

const helperConfig = {
  region: {
    hn: {//华南
      isMap: true,// 是否是等经纬地图
      projection: 'Equidistant',// 投影
      latLon: {
        xRight: 636.98, xLeft: 172.56,
        yTop: 56.516, yBottom: 547.576,
        lon0: 105.0, lon1: 120.0,
        lat0: 15.0, lat1: 30.0,
      },
    },
    cn: {//中国
      isMap: true,// 是否是等经纬地图
      projection: 'Lambert',
      latLon: {
        refLon0: 110.25, refLat0: 20,
        m0: 342.98333, n0: 382.51666,
        // refLon0:110,refLat0:20,
        // m0:338.98,n0:382.51,
        refLat1: 1.001, refLat2: 25.0,
        lonr: 80, latr: 40,
        mr: 94.983, nr: 167.51,
      },

    },
    oy: {//欧亚
      isMap: true,// 是否是等经纬地图
      projection: 'Mercator',
      latLon: {
        xRight: 692.9833, xLeft: 156.9833,
        yTop: 54.51666, yBottom: 533.51666,
        lon0: 60.0, lon1: 160.0,
        lat0: 10.0, lat1: 70.0,
      },
    },
    gd: {//广东
      isMap: true,// 是否是等经纬地图
      projection: 'Equidistant',// 投影
      latLon: {
        xRight: 589.98334, xLeft: 124.98334,
        yTop: 104.51666, yBottom: 437.51666,
        lon0: 110, lon1: 116,
        lat0: 21.0, lat1: 25.0,
      },
    },
    hy: {//海洋
      isMap: true,// 是否是等经纬地图
      projection: 'Lambert',// 投影
      latLon: {
        refLon0: 110, refLat0: 0,
        m0: 274.983, n0: 490.51666,
        refLat1: 1.001, refLat2: 25.0,
        lonr: 100, latr: 20,
        mr: 171.983, nr: 270.51666,
      },
    },
    '86st': {//单站
      isMap: false,
    },
    rainnest: {//雨涡
      isMap: false,
    },
    '5pro': {//雨涡
      isMap: false,
    },

  },
  currentRegion: 'hn',
  matchImgXY: () => { },// 根据经纬度获取图像位置
  matchLoc: () => { },// 获取经纬度的函数
  matchParam: '',// 调用上式的第二参数
};


//
/**
 * unsafeWindow函数
 * selectProItem
 */

const utils = {
  log(arg) {
    userConfig.debug ? console.log(arg) : '';
  },
  changeRegion(region) {
    helperConfig.currentRegion = region;
    return helperConfig.region[region].isMap;// 返回是否是地图
  },
  getJSON(url) {// 获取json数据
    return new Promise(function (resolve, reject) {
      GM_xmlhttpRequest({ //获取时间序列
        method: 'GET',
        synchronous: false,
        url: url,
        onload: function (reDetails) {
          if (reDetails.status !== 200 && reDetails.status !== 304) {
            console.error('获取URL错误');
            // showNotification('数据中心数据获取异常');
            let errorNotice = GM_notification({ text: '数据获取异常' + url, image: 'http://10.148.8.228/images/logo.png', title: '接口异常', timeout: 3000 });
            if (errorNotice) setTimeout(() => errorNotice.remove(), 3000);
            reject(new Error('数据获取异常' + url));
          }
          const data = JSON.parse(reDetails.responseText);
          //console.log(data.DATA);
          resolve(data);
        }
      });
    })
  },
  projection: {
    Mercator: {// 墨卡托投影
      calBasicInfo(lat1 = 0, lat2 = 0, n1 = 0, n2 = 0) {
        /*参数lat 纬度, n坐标数值
        n0 赤道，d0放大系数
        */
        const y1 = Math.log(Math.tan(lat1) + 1 / Math.cos(lat1));
        const y2 = Math.log(Math.tan(lat2) + 1 / Math.cos(lat2));
        const n0 = (n1 - (y1 / y2) * n2) / (1.0 - y1 / y2);
        const d0 = y1 / (n0 - n1);
        return { n0, d0 };
      },
      calLatLon(mouseXY, dims) {
        // console.log(dims);
        const n0 = dims.n0;
        const d0 = dims.d0;
        // console.log(Math.sinh((n0-mouseXY.y)*d0));
        const lat = Math.atan(Math.sinh((n0 - mouseXY.y) * d0));
        ///---------------//
        const r = dims.xLeft;
        const o = dims.xRight;
        const s = (dims.lon1 - dims.lon0) / (o - r);
        const u = dims.lon0 + (mouseXY.x - r) * s;
        return { lat: lat * 180 / Math.PI, lon: u };
      },
      calImgLoc(latlon, dims = { xLeft, xRight, lon1, lon0, n0, d0 }) {
        const n0 = dims.n0;
        const d0 = dims.d0;
        const sec = (x = 0) => 1 / Math.cos(x);// 正割

        const lon = latlon.lon;
        const r = dims.xLeft;
        const o = dims.xRight;
        const s = (dims.lon1 - dims.lon0) / (o - r);
        const x = (lon - dims.lon0) / s + r;

        const phi = latlon.lat / 180 * Math.PI;
        const y = n0 - Math.log(Math.tan(phi) + sec(phi)) / d0;
        const mouseXY = { x, y };
        return mouseXY;
      },
    },
    Equidistant: {//等经纬度
      calBasicInfo() {
        return helperConfig.region[helperConfig.currentRegion].latLon
      },
      calLatLon(mouseXY, dims) {
        // console.log(dims);
        const r = dims.xLeft;
        const o = dims.xRight;
        const i = dims.yTop;
        const l = dims.yBottom;
        const s = (dims.lon1 - dims.lon0) / (o - r); // o - r 内框宽度 -> s = lon/height
        const d = (dims.lat1 - dims.lat0) / (i - l);// i - l 内框高度  -> d = lat/width
        const u = dims.lon0 + (mouseXY.x - r) * s;
        const m = dims.lat1 + (mouseXY.y - i) * d;
        return { lat: m, lon: u };
      },
      calImgLoc(latlon = { lat, lon }, dims) {
        const r = dims.xLeft;
        const o = dims.xRight;
        const i = dims.yTop;
        const l = dims.yBottom;
        const s = (dims.lon1 - dims.lon0) / (o - r); // o - r 内框宽度 -> s = lon/height
        const d = (dims.lat1 - dims.lat0) / (i - l);// i - l 内框高度  -> d = lat/width
        const lat = latlon.lat;
        const lon = latlon.lon;
        const x = (lon - dims.lon0) / s + r;
        const y = (lat - dims.lat1) / d + i;
        const mouseXY = { x, y };
        return mouseXY;
      },

    },
    Lambert: {// 兰伯特投影
      calBasicInfo({ refLon0, refLat0, m0, n0, refLat1, refLat2, lonr, latr, mr, nr }) {
        /*
        refLat0,refLon0，m0,n0 参考纬度、经度，屏幕X坐标，Y坐标；
        屏幕坐标与实际坐标映射：
          x = (m-m0)*dx // dx为x方向比例系数
          y = (n0-n)*dy // dy为y方向比例系数，y方向屏幕坐标反向，所以取反
        refLat1,refLat2  2个平行纬度
        latr,lonr,mr,nr 选取的另外一个点的经纬度和屏幕坐标

        phi 纬度,lambda经度

         */
        const ang2rad = (x = 0) => Math.PI * x / 180.0;
        const [phi0, phi1, phi2] = [ang2rad(refLat0), ang2rad(refLat1), ang2rad(refLat2)];
        //console.log(phi0,phi1,phi2);
        const lambda0 = ang2rad(refLon0);
        const [tan, cos, sin, pow, PI, ln] = [Math.tan, Math.cos, Math.sin, Math.pow, Math.PI, Math.log];
        const cot = (x = 0) => Math.cos(x) / Math.sin(x);// 余切
        const sec = (x = 0) => 1 / Math.cos(x);// 正割

        const n = ln(cos(phi1) * sec(phi2)) / ln(tan(0.25 * PI + 0.5 * phi2) * cot(0.25 * PI + 0.5 * phi1));
        const F = (cos(phi1) * pow(tan(0.25 * PI + 0.5 * phi1), n)) / n;
        // n,F常量参数
        let rho = (phi = 0) => F * pow(cot(0.25 * PI + 0.5 * phi), n); // rho变量
        let rho0 = rho(phi0);
        let fx = (phi, lambda) => rho(phi) * sin(n * (lambda - lambda0));
        let fy = (phi, lambda) => rho0 - rho(phi) * cos(n * (lambda - lambda0));
        const dx = fx(ang2rad(latr), ang2rad(lonr)) / (mr - m0);
        const dy = fy(ang2rad(latr), ang2rad(lonr)) / (n0 - nr);
        // console.log(dx,dy);
        return { dx, dy, F, n, rho, rho0, lambda0, m0, n0 };
      },
      calLatLon(mouseXY, { dx, dy, F, n, rho0, lambda0, m0, n0 }) {
        const x = (mouseXY.x - m0) * dx;
        const y = (n0 - mouseXY.y) * dy;

        let rho = (x, y) => Math.sign(n) * Math.sqrt(Math.pow(x, 2) + Math.pow((rho0 - y), 2));

        let theta = (x, y) => Math.atan(x / (rho0 - y));
        let phi = (rho) => 2 * Math.atan(Math.pow(F / rho, 1 / n)) - 0.5 * Math.PI;
        let lambda = (theta) => lambda0 + theta / n;
        const lat = phi(rho(x, y)) * 180 / Math.PI;
        const lon = lambda(theta(x, y)) * 180 / Math.PI;
        // console.log(mouseXY.x-m0,n0-mouseXY.y);
        //console.log(mouseXY.x - m0,n0-mouseXY.y);
        return { lat, lon };
      },
      calImgLoc(latlon, { dx, dy, rho = () => { }, rho0, m0, n0, lambda0, n }) {
        const [cos, sin, PI] = [Math.cos, Math.sin, Math.PI];
        const phi = latlon.lat * PI / 180;
        const lambda = latlon.lon * PI / 180;
        const originX = (phi, lambda) => rho(phi) * sin(n * (lambda - lambda0));
        const originY = (phi, lambda) => rho0 - rho(phi) * cos(n * (lambda - lambda0));
        let mouseXY = { x: 0, y: 0 };
        mouseXY.x = originX(phi, lambda) / dx + m0;
        mouseXY.y = n0 - originY(phi, lambda) / dy;
        return mouseXY;
      }
    }

  },
  debounce: (fn, delay, scope) => {
    let timer = null;
    // 返回函数对debounce作用域形成闭包
    return function () {
      // setTimeout()中用到函数环境总是window,故需要当前环境的副本；
      let context = scope || this, args = arguments;
      // 如果事件被触发，清除timer并重新开始计时
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  },
  throttle(fn, threshold, scope) {
    let timer;
    let prev = Date.now();
    return function () {
      let context = scope || this, args = arguments;
      let now = Date.now();
      if (now - prev > threshold) {
        prev = now;
        fn.apply(context, args);
      }
    }
  },
  showSkewT(point = { lat: 21, lon: 120 }, runtime = '2019012018', fcHour = '18') {
    const latRange = [point.lat - 0.125 * 2, point.lat + 0.125 * 2];
    const lonRange = [point.lon - 0.125 * 2, point.lon + 0.125 * 2];
    let fcTime = utils.getFcTime();
    const initTime = moment(fcTime.date + fcTime.hr, 'YYYY-MM-DDHH');
    runtime = initTime.format('YYYYMMDDHH');
    fcHour = fcTime.fcHour;
    GM_openInTab(`https://www.tropicaltidbits.com/analysis/models/sounding/?model=gfs&runtime=${runtime}&fh=${fcHour}&domain=${lonRange[0].toFixed(2)},${lonRange[1].toFixed(2)},${latRange[0].toFixed(2)},${latRange[1].toFixed(2)}&stationID=&tc=&mode=regular`);
    //            https://www.tropicaltidbits.com/analysis/models/sounding/?model=gfs&runtime=2018122418&fh=18&domain=120,122.5,20,22.5&stationID=&tc=&mode=regular
  },
  showVertical(p0 = { lat: 21, lon: 120 }, p1 = { lat: 23, lon: 130 }, runtime = '2019012018', fcHour = '18') {
    let fcTime = utils.getFcTime();
    const initTime = moment(fcTime.date + fcTime.hr, 'YYYY-MM-DDHH');
    runtime = initTime.format('YYYYMMDDHH');
    fcHour = fcTime.fcHour;
    let type = 'RH_and_Omega';//[FGEN,_%CE%B8%E2%82%91,_Omega,RH_and_Omega,Normal_Wind,In-Plane_Wind]
    GM_openInTab(`https://www.tropicaltidbits.com/analysis/models/xsection/?model=gfs&runtime=${runtime}&fh=${fcHour}&p0=${p0.lat.toFixed(2)},${p0.lon.toFixed(2)}&p1=${p1.lat.toFixed(2)},${p1.lon.toFixed(2)}&type=${type}&tc=`);
    //  https://www.tropicaltidbits.com/analysis/models/xsection/?model=gfs&runtime=2018122500&fh=6&p0=31.23,-113.14&p1=39.72,-95.24&type=FGEN,_%CE%B8%E2%82%91,_Omega&tc=
  },
  showCross(p0 = { lat: 21, lon: 120 }, p1 = { lat: 23, lon: 130 }, runtime = '2020112812', fcHour = '18') {
    let fcTime = utils.getFcTime();
    const initTime = moment(fcTime.date + fcTime.hr, 'YYYY-MM-DDHH');
    runtime = initTime.format('YYYYMMDDHH');
    fcHour = fcTime.fcHour;
    // let type = 'RH_and_Omega';//[FGEN,_%CE%B8%E2%82%91,_Omega,RH_and_Omega,Normal_Wind,In-Plane_Wind]
    // GM_openInTab(`https://www.tropicaltidbits.com/analysis/models/xsection/?model=gfs&runtime=${runtime}&fh=${fcHour}&p0=${p0.lat.toFixed(2)},${p0.lon.toFixed(2)}&p1=${p1.lat.toFixed(2)},${p1.lon.toFixed(2)}&type=${type}&tc=`);
    GM_openInTab(`https://research.gdmo.gq/cross?source=ecmwf&method=cross&latA=${p0.lat.toFixed(2)}&lonA=${p0.lon.toFixed(2)}&latB=${p1.lat.toFixed(2)}&lonB=${p1.lon.toFixed(2)}&elems=rhum,uv&level=1000,200&initTime=${runtime}&fc=${fcHour}`);
  },
  showTimeSeries(point = { lat: 21, lon: 120 }) {
    utils.log(point);
    // showSvgTC()
    //   .catch(err=>{
    //     console.error(err);
    //   });
    if (point.mouseXY) {
      const elem = document.getElementById('map-pointer');
      elem.style.marginLeft = point.mouseXY.x + 29.31 + 'px';
      elem.style.marginTop = point.mouseXY.y - 33.066 + 'px';
    }
    const fcTime = utils.getFcTime();
    const initTime = moment(fcTime.date + fcTime.hr, 'YYYY-MM-DDHH');
    const sT = initTime.format('YYYY-MM-DD%20HH:mm:ss');
    const eT = moment(initTime).add(10 * 24, 'hours').format('YYYY-MM-DD%20HH:mm:ss');
    point.lat = utils.fix2Grid(point.lat);
    point.lon = utils.fix2Grid(point.lon);//取格点位置
    getTimeSeries(model = 'ecmwfthin',
      sT, eT,
      lon = point.lon, lat = point.lat,
      eles = ['t2mm', 'mn2t', 'mx2t', 'u10m', 'v10m', 'tcco', 'lcco', 'tppm']);
  },
  fix2Grid(number, interval = 0.125) {
    let fixNum = Math.round(number / interval) * interval;
    return fixNum;
  },
  getFcTime() {
    const fcHour = typeof (unsafeWindow.forecastHour) === 'string' ? unsafeWindow.forecastHour : unsafeWindow.forecastHour[0];
    let idate = unsafeWindow.$settings.date;
    if (!idate.length) throw new Error('日期为空错误');
    if (idate[6] == '-') idate = idate.slice(0, 5) + '0' + idate.slice(5);
    if (idate.length === 9) idate = idate.slice(0, 8) + '0' + idate.slice(8);
    const hr = unsafeWindow.$settings.HH;
    return { date: idate, hr, fcHour };//format->date:'2019-01-22;, hr:'12';fcHour:'000'
  },
  getTimeSeries(point = { lat: 21, lon: 115 }, model = 'giftdaily', eles = [t2mm, tmax, tmin], start = '2014-11-22%2000:00:00') {

    //http://172.22.1.175/di/grid.action?userId=sqxt&pwd=shengqxt123&interfaceId=intGetMultElesDataTimeSerial&dataFormat=xml2&modelid=giftdaily&element=t2mm%20tmax%20tmin&level=1000&starttime=2014-11-22%2000:00:00&endtime=2014-11-25%2000:00:00&lon=113.5&lat=24.5
  },
  calWind(u10, v10) {
    const iSpeed = Math.sqrt(Math.pow(u10, 2) + Math.pow(v10, 2));//风速
    const iR = Math.sign(v10) * Math.acos(u10 / iSpeed);//标准坐标系弧度
    const arrowR = iR - Math.PI / 2;//矢量箭头偏移弧度
    let northDir = -(iR + Math.PI - Math.PI / 2);//与北向的角度差
    if (northDir < 0) {
      northDir = northDir + Math.PI * 2;
    }
    const dir = northDir / Math.PI * 180;
    if (dir > 360) dir = dir - 360;
    return { speed: iSpeed, rotation: arrowR, northDir: northDir };
  },
  renderArrow(param, api) {
    let arrowSize = 10;
    var point = api.coord([
      api.value(2),//dims.timeIndex
      api.value(0)//5//api.value(dims.windSpeed)
    ]);

    return {
      type: 'path',
      shape: {
        //pathData: 'M31 16l-15-15v9h-26v12h26v9z',
        pathData: 'M250 0 L140 350 L250 250 L360 350 Z',
        x: -arrowSize / 2,
        y: -arrowSize / 2,
        width: arrowSize,
        height: arrowSize
      },
      rotation: api.value(1),//api.value(dims.R),//Math.PI / 8 * index;
      position: point,
      style: api.style({
        stroke: '#555',
        lineWidth: 1,
        fill: 'green',
      })
    };
  },
  createElement(type = 'div', props = {}) {
    let newEle = document.createElement(type);
    for (let attr in props) {
      newEle.setAttribute(attr, props[attr]);
    }
    return newEle;
  },
  getImgNow(imgSrc) {
    // TODO 改进匹配规则
    let fcTime = utils.getFcTime();
    //const initTime = moment(fcTime.date+fcTime.hr,'YYYY-MM-DDHH');
    // runtime = initTime.format('YYYYMMDDHH');
    fcHour = fcTime.fcHour;
    let url = imgSrc || unsafeWindow.imgSrc[fcHour];
    if (!url) throw new Error('无法获取初始图像');

    // url = 'http://10.148.8.228/files_home/znwp/ecmwffine_b/hn/20190128/ecmwffine_hn_mslp_000_2019012800.png';
    const reg = /(http:.*?\/)(\d{8})(.*?_)(\d+)_(\d+)(.*?$)/;
    const matchUrl = url.match(reg);
    /*0: "http://10.148.8.228/files_home/znwp/ecmwffine_b/hn/20190128/ecmwffine_hn_mslp_030_2019012800.png"
1: "http://10.148.8.228/files_home/znwp/ecmwffine_b/hn/"
2: "20190128"
3: "/ecmwffine_hn_mslp_"
4: "030"
5: "2019012800"
6: ".png"
index: 0
input: "http://10.148.8.228/files_home/znwp/ecmwffine_b/hn/20190128/ecmwffine_hn_mslp_030_2019012800.png"
length: 7 */

    const base = [matchUrl[1], matchUrl[3], matchUrl[6]];
    const model = base[0].match(/znwp\/(.*?)\//)[1];
    // console.log(base[1]);
    const eleName = base[1].match(/_.*?_(.+?)_$/)[1];
    const date = matchUrl[2];
    const hour = matchUrl[4];
    const initDate = matchUrl[5];

    const imgInfo = {
      url,
      date,
      base,
      hour,
      initDate,
      model,
      eleName,
      getUrl(date = date, hour = hour, initDate = initDate) {
        return base[0] + date + base[1] + hour + '_' + initDate + base[2];
      }
    }
    return imgInfo;
  },
  matchImgPattern(pat = { elem: "t2mm", elemCN: "2m气温", region: "cn", model: "ecmwffine_b", modelFileName: "ecmwffine" }) {
    let base0 = `http://10.148.8.228/files_home/znwp/${pat.model}/${pat.region}/`;
    let base1 = `/${pat.modelFileName}_${pat.region}_${pat.elem}_`;
    return {
      // base:['http://10.148.8.228/files_home/znwp/ecmwffine_b/hn/','/ecmwffine_hn_mslp_','.png'],
      base: [base0, base1, '.png'],
    };
  },
  getImgUrl(base, date, hour, initDate) {
    return base[0] + date + base[1] + hour + '_' + initDate + base[2];
  },
  paddingInt(num, length = 3) {
    //这里用slice和substr均可
    return (Array(length).join("0") + num).slice(-length);
  },
  getElemRelPos(e, t, n) {// e.target, e.clientX, e.clientY
    var a = e.getBoundingClientRect(),
      r = getComputedStyle(e);
    return {
      x: t - (a.left + parseFloat(r.paddingLeft) + parseFloat(r.borderLeftWidth)),
      y: n - (a.top + parseFloat(r.paddingTop) + parseFloat(r.borderTopWidth))
    };
  },
};


var NWP_init = function () {
  var fcHour = document.getElementById('forecast_hour');
  var iniTime = document.getElementById('create_day');
  var infoBar = document.getElementById('pic_info');
  var referNode = document.getElementById('to_contrast');
  var divTime = document.createElement('span');
  divTime.textContent = 'hello world';
  divTime.setAttribute('class', 'lcTime');
  divTime.style.position = 'relative';
  divTime.style.float = 'right';
  divTime.style.right = '120px';
  infoBar.insertBefore(divTime, referNode);
  // document.querySelector("#forecast_hours div").textContent = "日期";

  // create an observer instance
  var UTC8 = new MutationObserver(function (mutations) {
    // TODO 对分钟变化变量的修正
    var dateString = iniTime.textContent.match(/(\d+).*?(\d+).*?(\d+).*?(\d+)/);
    var fcDate = [];
    fcDate[0] = Number(dateString[1]);
    fcDate[1] = Number(dateString[2]);
    fcDate[2] = Number(dateString[3]);
    fcDate[3] = Number(dateString[4]);
    fcDate[4] = Number(fcHour.textContent.match(/\d+/));
    fcDate[5] = new Date(fcDate[0], fcDate[1] - 1, fcDate[2], fcDate[3] + fcDate[4] + 8);
    var localTime = String(fcDate[5].getMonth() + 1) + '月' + fcDate[5].getDate() +
      '日' + fcDate[5].getHours() + '时 GMT+8';
    divTime.textContent = localTime;
  });
  // configuration of the observer:
  var config = {
    attributes: true,
    childList: true,
    characterData: true
  };
  UTC8.observe(fcHour, config);
  // later, you can stop observing
  //observer.disconnect();
  //
  //
  /////////////////////////////////////////////////////////////


  //
  ///
  ////////////////////修改时效列/////////////////////////////////////////
  var alterTimelist = function (mutations) {
    //alert(timeBar.length);
    // console.log('修改时效');
    if (userConfig.timelineMove) {
      timeMoveOver();//是否启用滑动时间触发
    }
    if (!userConfig.alterDate) return; // 不修改则直接返回
    var dateString = iniTime.textContent.match(/(\d+).*?(\d+).*?(\d+).*?(\d+)/);
    var fcDate = [];
    fcDate[0] = Number(dateString[1]);
    fcDate[1] = Number(dateString[2]);
    fcDate[2] = Number(dateString[3]);
    fcDate[3] = Number(dateString[4]);
    for (let i = 0; i < timeBar.length; i++) {
      let oValue = timeBar[i].value;
      fcDate[4] = Number(timeBar[i].value);

      fcDate[5] = new Date(fcDate[0], fcDate[1] - 1, fcDate[2], fcDate[3] + fcDate[4] + 8);

      let iday = String(fcDate[5].getDate());
      iday = Array(2 > iday.length ? 2 - iday.length + 1 || 0 : 0).join(0) + iday;

      let ihour = String(fcDate[5].getHours());
      ihour = Array(2 > ihour.length ? 2 - ihour.length + 1 || 0 : 0).join(0) + ihour;

      let localTime = iday + ' ' + ihour + '     ;';
      let styleText = '#' + timeBar[i].getAttribute("id") + ':before{white-space:pre;content: "  ' + localTime + '  "}';
      GM_addStyle(styleText);

      switch (fcDate[5].getHours()) {
        // case 5:
        //   timeBar[i].style.cssText = "border-left:2px solid #9B30FF";
        //   break;
        // case 14:
        //   timeBar[i].style.cssText = "border-left:2px solid #EE3B3B";
        //   break;
        case 20:
          timeBar[i].style.cssText = "border-bottom:1px dotted #8E8E8E;border-left:2px solid #ffffff;";
          break;
        default:
          timeBar[i].style.cssText = "border-left:2px solid #ffffff;";
      }
    }
  };
  /////////////////////////////////////////////////////////////
  ///
  var selectObserver = new MutationObserver(alterTimelist);
  // configuration of the observer:
  var timeBar = document.querySelector("#forecast_hours select");
  var config2 = {
    attributes: false,
    childList: true,
    characterData: false,
  };
  selectObserver.observe(timeBar, config2);
  GM_addStyle("#forecast_hours option{width: 50px!important; overflow: hidden!important;}");

  //-----------------------------------------------------------------------------//
  //-- 添加多模式、多要素按钮mvBtnObesrver, initMvMode---//
  let imgObserver = new MutationObserver(fitImgLoc);
  imgObserver.observe(timeBar, config2);
  //-----------------------------------绑定坐标-----------------------------------//
  function fitImgLoc() { // 绑定img包含的div元素
    const isMap = utils.changeRegion(unsafeWindow._region); // 改变地图;
    // console.log(isMap);
    if (!isMap) {
      proxyConfig.showTcMode = false;
      return; // TODO 不是地图需要去除掉经纬度计算
    } else {
      if (proxyConfig.showTcMode) {
        let currentFcTime = utils.getFcTime();
        let currentTime = currentFcTime.date + currentFcTime.hr;
        let currentRegion = unsafeWindow._region;
        console.log(currentTime, proxyConfig.preTime);
        console.log(currentRegion, proxyConfig.preRegion);
        if (currentTime != proxyConfig.preTime || currentRegion != proxyConfig.preRegion) {
          showSvgTC(); // 绘制台风
        } else {
          '';
        }
      }
      /////TODO 判断地图逻辑分离, 不是地图应该取消掉交互模式和latlon显示功能
      const currMap = helperConfig.region[helperConfig.currentRegion];
      const currProjection = currMap.projection;
      //let matchLoc = ({});
      //let param = ({});
      switch (currProjection) {
        case 'Mercator': {
          const dims = currMap.latLon;
          const lat1 = Math.PI / 180.0 * dims.lat0;
          const lat2 = Math.PI / 180.0 * dims.lat1;
          const n1 = dims.yBottom;
          const n2 = dims.yTop;
          // console.log(dims);
          const param1 = utils.projection.Mercator.calBasicInfo(
            lat1, lat2, n1, n2
          );
          helperConfig.matchParam = {
            ...param1,
            xRight: dims.xRight,
            xLeft: dims.xLeft,
            lon0: dims.lon0,
            lon1: dims.lon1,
          };
          // console.log(helperConfig.matchParam);
          helperConfig.matchLoc = utils.projection.Mercator.calLatLon;
          helperConfig.matchImgXY = utils.projection.Mercator.calImgLoc;
          break;
        }
        case 'Lambert': {
          const LamDim = currMap.latLon;
          /*           const LamParam1 =
                          [ LamDim.refLon0, LamDim.refLat0, LamDim.m0, LamDim.n0,
                            LamDim.refLat1, LamDim.refLat2,
                            LamDim.lonr, LamDim.latr, LamDim.mr, LamDim.nr]; */
          const LamParam2 = utils.projection.Lambert.calBasicInfo(LamDim);
          // console.log(LamParam2);
          helperConfig.matchParam = LamParam2;
          helperConfig.matchLoc = utils.projection.Lambert.calLatLon;
          helperConfig.matchImgXY = utils.projection.Lambert.calImgLoc;
          break;
        }
        default:
          helperConfig.matchParam = currMap.latLon;
          helperConfig.matchLoc = utils.projection.Equidistant.calLatLon;
          helperConfig.matchImgXY = utils.projection.Equidistant.calImgLoc;
          break;
      }

      //let wrapDiv = document.querySelector('#pic_frame div');
      let wrapDiv = document.querySelector('#pic_frame');
      // document.addEventListener('keyup', console.log(elemsConfig.fixPoint));
      if (wrapDiv) {
        wrapDiv.addEventListener('mousemove', utils.debounce(getMouseLatLon, 100));
        // wrapDiv.addEventListener('mousemove', getMouseLatLon);
        // console.log(wrapDiv.clientWidth);// offsetWidth , clientWidth, scrollWidth
      }
    }
  }

  function getElemRelPos(e, t, n) {// e.target, e.clientX, e.clientY
    var a = e.getBoundingClientRect(),
      r = getComputedStyle(e);
    /**
     * e.getBoundingClientRect()
     * bottom: 916.1999969482422
        height: 716          ​
        left: 686.9000244140625          ​
        right: 1565.1333618164062          ​
        top: 200.1999969482422          ​
        width: 878.2333374023438          ​
        x: 686.9000244140625          ​
        y: 200.1999969482422
        borderLeftWidth: "1px"
        borderTopWidth: "1px"
        paddingLeft: "0px"
        paddingTop: "0px"
     */
    return {
      x: t - (a.left + parseFloat(r.paddingLeft) + parseFloat(r.borderLeftWidth)),
      y: n - (a.top + parseFloat(r.paddingTop) + parseFloat(r.borderTopWidth))
    };
  }

  function getMouseLatLon(event) {
    // console.log(event);
    // console.log(event.target);
    // let target = event.target;//
    let target = document.querySelector('#pic_frame img[style~="inline;"]');//
    // console.log(target);
    const mouseXY = getElemRelPos(target, event.clientX, event.clientY); // 相对图像的像素位置{x,y}
    const loc = helperConfig.matchLoc(mouseXY, helperConfig.matchParam);
    elemsConfig.latLonInput.lat.innerHTML = loc.lat; // mouseXY.y
    elemsConfig.latLonInput.lon.innerHTML = loc.lon; // mouseXY.x
    // elemsConfig.latLonInput.lat.innerHTML = mouseXY.y
    // elemsConfig.latLonInput.lon.innerHTML = mouseXY.x
    elemsConfig.fixPoint = { lat: loc.lat, lon: loc.lon, mouseXY };
    return { lat: loc.lat, lon: loc.lon, mouseXY };
  }
  //------------------------------24小时跳跃-------------------------------------//
  const timeJump = function () {
    //var hourBar = document.getElementById('from_hour');float-l
    var jumpParent = document.querySelector('.float-l');
    var pre24 = document.createElement('button');
    pre24.addEventListener("click", function () { timeTrigger(-24); });
    pre24.textContent = "-24";
    jumpParent.appendChild(pre24);

    var next24 = document.createElement('button');
    next24.addEventListener("click", function () { timeTrigger(24); });
    next24.textContent = "+24";
    jumpParent.appendChild(next24);

    var timeTrigger = function (timer) {
      let selectedVal = timeBar[timeBar.selectedIndex].getAttribute("data-hour");
      let nextVal = String(Number(selectedVal) + timer);
      var posi = 3;
      nextVal = Array(posi > nextVal.length ? posi - nextVal.length + 1 || 0 : 0).join(0) + nextVal;
      let nextopt = timeBar.querySelector("#option_" + nextVal);
      //alert(nextopt);
      if (!nextopt) return;
      timeBar[timeBar.selectedIndex].selected = false;
      nextopt.selected = true;

      // var changeEvt = document.createEvent('HTMLEvents');
      // changeEvt.initEvent('change',true,true);
      // timeBar.dispatchEvent(changeEvt);
      var changeEvt = new Event('change', { 'bubbles': true });
      timeBar.dispatchEvent(changeEvt);
    };
  };

  timeJump();
  /////切换时效

  function switchDate() {
    userConfig.alterDate = !userConfig.alterDate;
    if (userConfig.alterDate) {
      switchDateBtn.textContent = "切换成时效";
      alterTimelist();
    }
    else {
      switchDateBtn.textContent = "切换成日期";
      for (let ele of timeBar) {
        ele.style.cssText = '';
        let styleText = '#' + ele.getAttribute("id") + ':before{white-space:pre;content: ""}';
        GM_addStyle(styleText);
      }
    }
  }

  var switchParent = document.querySelector('.float-l');
  let switchDateBtn = document.createElement('button');
  switchDateBtn.addEventListener("click", switchDate);
  switchDateBtn.textContent = "切换成日期";
  switchParent.appendChild(switchDateBtn);
  /////end 切换时效 /////

  //设置鼠标事件//
  document.onkeydown = function (evt) {
    if (evt.key == 'x' && !evt.ctrlKey) {
      console.log(utils.showSkewT(elemsConfig.fixPoint));
    }
    else if (evt.key == 'x' && evt.ctrlKey) {
      if (!elemsConfig.point01) {
        elemsConfig.point01 = Object.assign({}, elemsConfig.fixPoint);
      }
      else {
        elemsConfig.point02 = Object.assign({}, elemsConfig.fixPoint);
        console.log(elemsConfig.point01, elemsConfig.point02);
        utils.showVertical(elemsConfig.point01, elemsConfig.point02);
        elemsConfig.point01 = null;
        elemsConfig.point02 = null;
      }
    }
    if (evt.key == 'c' && !evt.ctrlKey && !evt.altKey) {
      utils.showTimeSeries(elemsConfig.fixPoint);
    }
  }
  //设置鼠标事件//

  /**
   * 时间鼠标滑过
   */
  function timeMoveOver() {
    // var changeEvent = document.createEvent('HTMLEvents');
    // changeEvent.initEvent("change", true, true);
    var changeEvent = new Event('change', { 'bubbles': true });

    var clickOpt = (evt) => {
      console.log(evt.target);
      timeBar[timeBar.selectedIndex].selected = false;
      evt.target.selected = true;
      timeBar.dispatchEvent(changeEvent);
    }
    var timeBar = document.querySelector("#forecast_hours select");
    var opts = document.querySelectorAll('#forecast_hours option');
    opts.forEach(item => {
      item.addEventListener('mouseover', clickOpt);
    });
  }
};


function toggleSelectMode() {
  let mapPointer = document.getElementById('map-pointer');
  let bodyDOM = document.getElementsByTagName('body')[0];
  let linePanel = document.getElementById('line_panel');
  let selectModePanel = document.getElementById('select-mode-panel');
  if (bodyDOM.classList.contains("full-screen-mode")) {
    bodyDOM.classList.remove("full-screen-mode");
    linePanel.style.display = 'none';
    selectModePanel.style.display = 'none';
    mapPointer.classList.add("display-none");
    let crossCanvas = document.getElementById('cv-draw-line');
    crossCanvas.classList.add('display-none');
    let activeBtn = document.getElementById('edit-helper-panel');
    activeBtn.classList.remove('active-button');
    let crossBtn = document.getElementById('helper_cross');
    crossBtn ? crossBtn.classList.remove('active-button') : '';
    return;
  } else {
    bodyDOM.classList.add("full-screen-mode");
    let contentWidth = window.innerWidth - document.body.clientWidth - 40;
    if (contentWidth < 200) {
      linePanel.style.width = '220px';
    } else {
      linePanel.style.width = contentWidth + 'px';
    }
    linePanel.style.display = 'block';
    selectModePanel.style.display = 'block';
    mapPointer.classList.add("display-none");
    mapPointer.classList.remove("display-none");
    let activeBtn = document.getElementById('edit-helper-panel');
    activeBtn.classList.add('active-button');
    // let crossBtn = document.getElementById('helper_cross');
    // activeBtn.classList.add('active-button');
  }
  const imgXY = latlon2XY({ lon: 113.375, lat: 23.125 });

  utils.showTimeSeries({ lon: '113.375', lat: '23.125', mouseXY: imgXY });
}

/**
 * 切换垂直剖面
 */
function toggleCrossSection() {
  let crossCanvas = document.getElementById('cv-draw-line');
  let activeBtn = document.getElementById('helper_cross');
  crossCanvas.classList.toggle('display-none');
  if (crossCanvas.classList.contains('display-none')) {
    activeBtn.classList.remove('active-button');
  } else {
    activeBtn.classList.add('active-button');
  }

}

// http://172.22.1.175/di/grid.action?userId=idc&pwd=U3cuYV&interfaceId=intGetMultElesDataTimeSerial&dataFormat=xml2&modelid=giftdaily&element=t2mm%20tmax%20tmin&level=1000&starttime=2014-11-22%2000:00:00&endtime=2014-11-25%2000:00:00&lon=113.5&lat=24.5
function getTimeSeries(model = 'ecmwfthin', sT = '2019-01-22%2012:00:00', eT = '2019-02-01%2012:00:00', lon = '113.0', lat = '23.5', eles = ['t2mm', 'mn2t', 'mx2t', 'u10m', 'v10m', 'tcco', 'lcco', 'tppm']) {

  const url = `http://research.gdmo.gq/api/di/grid.action?dataFormat=json&interfaceId=intGetMultElesDataTimeSerial&modelid=${model}&element=${eles.join('%20')}&level=0&starttime=${sT}&endtime=${eT}&lon=${lon}&lat=${lat}`;
  utils.log('获取数据');
  // showNotification('正在从数据中心获取数据');
  let notification = GM_notification({ text: '正在从数据中心获取数据!', image: 'http://10.148.8.228/images/logo.png', title: '提示', timeout: 3000 });
  // console.log(notification);
  if (notification) setTimeout(() => notification.remove(), 3000);
  // console.log(url);
  GM_xmlhttpRequest({ //获取时间序列
    method: 'GET',
    synchronous: false,
    url: url,
    onload: function (reDetails) {
      if (reDetails.status !== 200 && reDetails.status !== 304) {
        console.error('获取URL错误');
        // showNotification('数据中心数据获取异常');
        let errorNotice = GM_notification({ text: '数据中心数据获取异常', image: 'http://10.148.8.228/images/logo.png', title: '接口异常', timeout: 3000 });
        if (errorNotice) setTimeout(() => errorNotice.remove(), 3000);
        return;
      }
      getLocation(lat, lon);
      const data = JSON.parse(reDetails.responseText);
      //console.log(data.DATA);
      if (data.DATA.length == 0) {
        console.error('此时次数据为空,请等待更新');
        // showNotification('此时次数据为空,请等待更新');
        let errorNotice = GM_notification({ text: '此时次数据为空,请等待更新', image: 'http://10.148.8.228/images/logo.png', title: '接口异常', timeout: 3000 });
        if (errorNotice) setTimeout(() => errorNotice.remove(), 3000);
        return;
      }
      let series = decodeSeries(data.DATA, 241);
      series[1] = mixUndefined(series[0].map(v => v[1]), series[1]);
      series[2] = mixUndefined(series[0].map(v => v[1]), series[2]);
      //console.log(series[1]);
      drawLine(series);
    }
  });
}

/**
 * 从百度接口获取地址
 * @param {Number} lat 纬度
 * @param {Number} lon 经度
 */
function getLocation(lat, lon) {
  let ak = 'kMW5fXfhhsMat6Ud9jYPqnxCRQGbl2eV';
  let url = `http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=${lat},${lon}&output=json&pois=1&ak=${ak}`;
  let latlonSpan = document.querySelectorAll('#line_info > span');
  latlonSpan[0].innerHTML = lat;
  latlonSpan[1].innerHTML = lon;
  latlonSpan[2].innerHTML = '';
  // console.log(url);
  GM_xmlhttpRequest({ //获取时间序列
    method: 'GET',
    synchronous: false,
    url: url,
    onload: function (reDetails) {
      if (reDetails.status !== 200 && reDetails.status !== 304) {
        console.error('获取百度地址异常');
        //showNotification('数据中心数据获取异常');
        return;
      }
      let raw = reDetails.responseText.replace('renderReverse&&renderReverse(', '').slice(0, -1);
      const addreJSON = JSON.parse(raw);
      if (addreJSON.result.formatted_address == '') {
        return;
      } else {
        latlonSpan[2].innerHTML = '&nbsp; 地址: ' + addreJSON.result.formatted_address;
      }
      //console.log(data);
    }
  });
}

function mixUndefined(index, data) {
  let newData = [];
  for (let i of index) {
    let value = data.find(v => v[1] == i);
    if (value === undefined) {
      newData.push([undefined, i]);
    } else {
      newData.push([value[0], i]);
    }
  }
  return newData
}

/**解析数据 */
function decodeSeries(data = [], len = 241) {
  if (!data.length) return [];
  let splitData = [];
  let eles = data.length / len;//元素个数
  for (let ie = 0; ie < eles; ie++) {//看有几个要素
    splitData.push(data.slice(ie * len, (ie + 1) * len));
  }
  splitData = splitData.map(data => data.map((v, i) => [Number(v), i]).filter(v => v[0] > -999));//分离出[数值,时效]//-999.900024
  // console.log(splitData);
  return splitData;
}

function drawLine(series = []) {
  // getTimeSeries();
  utils.log('绘图');
  if (series.length == 0) return console.log('空数据');
  const tempChart = echarts.init(document.getElementById('show-temp'));
  let fcTime = utils.getFcTime();
  let initTime = moment(fcTime.date + fcTime.hr, 'YYYY-MM-DDHH').add(8, 'hours');//北京时
  let temp = series[0].map(v => (v[0] - 273.15).toFixed(2));
  let mn2t = series[1].map(v => {
    if (v[0] === undefined) {
      return undefined;
    } else {
      return (v[0] - 273.15).toFixed(2);
    }
  });
  let mx2t = series[2].map(v => {
    if (v[0] === undefined) {
      return undefined;
    } else {
      return (v[0] - 273.15).toFixed(2);
    }
  });
  let xTime = series[0].map(v => {
    const hour = v[1];
    return moment(initTime).add(hour, 'hours').format('DD-HH');
  });
  // console.log(mn2t);
  // 指定图表的配置项和数据
  const OptionTemp = {
    /* title: {
      text: 'Temp.',
      // left: 'center'
    }, */
    tooltip: {
      trigger: 'axis',
    },
    toolbox: {
      // y: '30px',
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        //saveAsImage: {}
      }
    },
    grid: { top: 10, bottom: 45, right: 11, left: 25 },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 80,
        // handleSize: '50%',
        height: '20',
        bottom: '0',
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 80,
      }
    ],
    legend: {
      y: '-5',
      data: ['Temp', 'Pre6min', 'Pre6max']
    },
    xAxis: {
      type: 'category',
      data: xTime,
      // boundaryGap : false,
      //splitArea : {show : true},
      splitLine: { show: true },
      axisLine: { onZero: true },

    },
    yAxis: [{
      name: '℃',
      type: 'value',
      scale: true,
      axisLabel: {
        formatter: '{value}'
      },
    },
    ],
    series: [
      {
        name: 'Temp',
        smooth: true,
        //symbol: 'triangle',
        //symbolSize: 5,
        lineStyle: { normal: { color: 'green', width: 2, } },//type: 'dashed'
        //itemStyle: {normal: {borderWidth: 1,borderColor: 'green',color: 'green'}},
        type: 'line',
        data: temp,
      },
      {
        name: 'Pre6min',
        smooth: true,
        connectNulls: true,
        symbolSize: 0,
        lineStyle: { normal: { color: 'blue', width: 1, type: 'dashed' } },//type: 'dashed'
        type: 'line',
        data: mn2t,
      },
      {
        name: 'Pre6max',
        smooth: true,
        connectNulls: true,
        symbolSize: 0,
        lineStyle: { normal: { color: 'red', width: 1, type: 'dashed' } },//type: 'dashed'
        type: 'line',
        data: mx2t,
      },
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  tempChart.setOption(OptionTemp);
  /**
   * 风
   */
  const windChart = echarts.init(document.getElementById('show-wind'));
  let wind = series[3].map((v, i) => utils.calWind(v[0], series[4][i][0]));
  let speed = wind.map(v => v.speed);
  let rotation = wind.map(v => v.rotation);
  let windData = speed.map((v, i) => [v, rotation[i], i]);
  let dims = {
    speed: 0,
    rotation: 1,
    timeIndex: 2,
  }
  const optionWind = {
    /* title: {
      text: 'Wind',
    }, */
    tooltip: {
      trigger: 'axis',
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        // restore: {},
        //saveAsImage: {}
      }
    },
    grid: { show: true, top: 10, bottom: 45, right: 11, left: 25 },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 80,
        // handleSize: '50%',
        height: '20',
        bottom: '0',
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 80,
      }
    ],
    legend: {
      y: '-5',
      data: ['w10m'],
    },
    xAxis: {
      type: 'category',
      data: xTime,
      splitLine: { show: true },
      axisLine: { onZero: true },
    },
    yAxis: {
      name: 'm/s',
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      },
    },
    series: [
      {
        name: 'w10m',
        type: 'line',
        smooth: true,
        lineStyle: { normal: { width: 2, } },//type: 'dashed'
        itemStyle: { normal: { borderWidth: 1, borderColor: 'black', color: 'black' } },
        data: speed.map(v => v.toFixed(1)),
      },
      {
        type: 'custom',
        name: 'dir',
        renderItem: utils.renderArrow,
        encode: {
          x: dims.timeIndex,
          y: dims.speed,
        },
        data: windData,
        z: 10
      },
    ]
  };
  windChart.setOption(optionWind);
  /**
   * 云
   */
  const cloudChart = echarts.init(document.getElementById('show-cloud'));
  let totalCloud = series[5].map(v => v[0] * 100);
  let lowCloud = series[6].map(v => v[0] * 100);
  const optionCloud = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        // restore: {},//saveAsImage: {}
      }
    },
    grid: { show: true, top: 10, bottom: 45, right: 11, left: 30 },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 80,
        height: '20',
        bottom: '0',
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 80,
      }
    ],
    legend: {
      y: '-5',
      data: ['中高云', '低云'],
    },
    xAxis: {
      type: 'category',
      data: xTime,
      splitLine: { show: true },
      axisLine: { onZero: true },
    },
    yAxis: {
      name: '%',
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      },
    },
    series: [
      {
        name: '低云',
        type: 'bar',
        stack: '云量',
        data: lowCloud.map(v => v.toFixed(1)),
      },
      {
        name: '中高云',
        type: 'bar',
        stack: '云量',
        data: totalCloud.map((v, i) => (v - lowCloud[i]).toFixed(1)),
      },
    ]
  };
  cloudChart.setOption(optionCloud);
  /**
   * 降水
   */
  const preChart = echarts.init(document.getElementById('show-pre'));
  let preSeri = series[7];
  let precipitaion = preSeri.map((v, i) => {
    let pre = i === 0 ? v[0] : v[0] - preSeri[i - 1][0]; //(v[0]*1000).toFixed(1)
    return (pre * 1000).toFixed(1);
  }
  );
  //let lowCloud = series[6].map(v=>v[0]);
  const optionPre = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
      }
    },
    grid: { show: true, top: 10, bottom: 45, right: 11, left: 30 },
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 80,
        height: '20',
        bottom: '0',
      },
      {
        type: 'inside',
        realtime: true,
        start: 0,
        end: 80,
      }
    ],
    legend: {
      y: '-5',
      data: ['Precipitaion'],
    },
    xAxis: {
      type: 'category',
      data: xTime,
      splitLine: { show: true },
      axisLine: { onZero: true },
    },
    yAxis: {
      name: 'mm',
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      },
    },
    series: [
      {
        name: 'Precipitaion',
        type: 'bar',
        stack: 'Rain',
        data: precipitaion,
      },
    ]
  };
  preChart.setOption(optionPre);
}

function createPanel() {
  //-创建面板-//
  const panelWrap = document.createElement("div");

  panelWrap.setAttribute("id", "helper_panel");
  panelWrap.setAttribute("class", "top_panel show_panel");
  panelWrap.innerHTML = '多图模式: ';
  /* 设置添加对比模式*/
  const compareMode = utils.createElement('div', { class: 'single-btn' });
  compareMode.innerHTML = `<span class="panel-button" id="open-compare">多起报</span>`;
  panelWrap.appendChild(compareMode);

  /* 设置添加多时效模式*/
  const mvTime = utils.createElement('div', { class: 'single-btn' });
  mvTime.innerHTML = `<span class="panel-button" id="open-mvTime">多时效</span>`;
  panelWrap.appendChild(mvTime);

  /* 添加多模式 */
  const mvModelBtn = utils.createElement('div', { class: 'dropdown mv-model-panel' });
  mvModelBtn.innerHTML =
    `<button class="dropbtn"><div class="tooltip">多模式<span class="tooltiptext">ECMWF, NCEP, Grapes全球, 南海台风模式9km</span></div></button>
    <div class="dropdown-content">
      <a href="#" class="tooltip">
        EC/NCEP/G全球/G9km
        <span class="tooltiptext">ECMWF, NCEP, Grapes全球, Grages9kmEC</span>
      </a>
      <a href="#" class="tooltip">
        EC/NCEP/G9km/G-meso
        <span class="tooltiptext">ECMWF, NCEP, Grages9kmEC, Grapes-Meso</span>
      </a>
      <a href="#" class="tooltip">
      EC/NCEP/G9km/GZ-3km
      <span class="tooltiptext">ECMWF, NCEP, Grages9kmEC, 华南3km高分辨率</span>
      </a>
    </div>
  `;
  panelWrap.appendChild(mvModelBtn);

  /* 设置添加多图模式
  const mvElem = document.createElement('div');
  mvElem.innerHTML = `<span class="panel-button" id="open-mv">多要素</span>`;
  panelWrap.appendChild(mvElem);*/

  /* 设置添加点选模式*/
  const panelWrap2 = utils.createElement('div', { id: 'edit-helper-panel', class: 'top_panel show_panel' });
  const pointMode = utils.createElement('div', { class: 'single-btn' });
  pointMode.innerHTML = `<span class="panel-button">交互模式</span>`;
  panelWrap2.appendChild(pointMode);
  pointMode.addEventListener('click', () => { toggleSelectMode() });

  /* 设置Lat lon面板*/

  //-------//
  //-注册到全局变量-//
  elemsConfig.latLonInput = {
    lat: document.getElementById('helper_lat'),
    lon: document.getElementById('helper_lon'),
  };

  /* 设置添加增强显示*/
  const panelWrap3 = utils.createElement('div', { id: 'enhanced-helper-panel', class: 'top_panel show_panel' });
  const tcModeBtn = utils.createElement('div', { class: 'single-btn', id: 'tc-mode-btn' });
  tcModeBtn.innerHTML = `<span class="panel-button">台风路径</span>`;
  panelWrap3.appendChild(tcModeBtn);
  tcModeBtn.addEventListener('click', () => { toggleTCMode('tcShow') });

  const detTCbtn = utils.createElement('div', { class: 'single-btn display-none active-button', id: 'tc-det-btn' });
  detTCbtn.innerHTML = `<span class="panel-button">EC确定性预报</span>`;
  panelWrap3.appendChild(detTCbtn);
  detTCbtn.addEventListener('click', () => { toggleTCMode('detShow') });
  const ensTCbtn = utils.createElement('div', { class: 'single-btn display-none active-button', id: 'tc-ens-btn' });
  ensTCbtn.innerHTML = `<span class="panel-button">EC集合预报</span>`;
  panelWrap3.appendChild(ensTCbtn);
  ensTCbtn.addEventListener('click', () => { toggleTCMode('ensShow') });

  /* 注册到body*/
  const ibody = document.getElementsByTagName("body")[0];
  ibody.appendChild(panelWrap);
  ibody.appendChild(panelWrap2);
  ibody.appendChild(panelWrap3);
}


// 添加面板样式
function createTlinePanel() {
  //-创建面板-//
  const fragment = document.createDocumentFragment();
  const panelWrap = document.createElement("div");

  panelWrap.setAttribute("id", "line_panel");
  panelWrap.setAttribute("class", "show_panel");
  panelWrap.style.display = 'none';

  const infoWrap = document.createElement('div');
  infoWrap.setAttribute("id", "line_info");
  infoWrap.innerHTML = 'EC模式预报<br>纬度:<span></span> 经度:<span></span><span></span>';
  panelWrap.appendChild(infoWrap);
  /* 设置添加temp*/
  const tempWrap = document.createElement('div');
  tempWrap.innerHTML = `温度<div id="show-temp"></div>`;
  panelWrap.appendChild(tempWrap);

  const windWrap = document.createElement('div');
  windWrap.innerHTML = `风MSLP<div id="show-wind"></div>`;
  panelWrap.appendChild(windWrap);

  const preWrap = document.createElement('div');
  preWrap.innerHTML = `降水<div id="show-pre"></div>`;
  panelWrap.appendChild(preWrap);

  const cloudWrap = document.createElement('div');
  cloudWrap.innerHTML = `云量<div id="show-cloud"></div>`;
  panelWrap.appendChild(cloudWrap);

  fragment.appendChild(panelWrap);
  const ibody = document.getElementsByTagName("body")[0];
  ibody.appendChild(fragment);
  //-------//
}

function createSelectModePanel() {
  //-创建面板-//
  const fragment = document.createDocumentFragment();
  const panelWrap = document.createElement("div");

  panelWrap.setAttribute("id", "select-mode-panel");
  panelWrap.setAttribute("class", "show_panel");
  panelWrap.style.display = 'none';
  panelWrap.innerHTML = `快捷键[C] -> 单点时间序列`;
  /*<br>
  [X] -> 垂直探空; 两次[Ctrl+X] -> 垂直剖面
   */

  fragment.appendChild(panelWrap);
  const ibody = document.getElementsByTagName("body")[0];
  ibody.appendChild(fragment);
  /* 设置Lat lon面板*/
  const latLonWarp = document.createElement("div");
  latLonWarp.setAttribute("id", "helper_latLon");
  latLonWarp.setAttribute("class", "show_latLon");
  latLonWarp.innerHTML = '<span>Lat <span class="fixLoc" id="helper_lat"></span> Lon <span class="fixLoc" id="helper_lon"></span></span>';
  panelWrap.appendChild(latLonWarp);
  /* 设置垂直剖面面板*/
  const crossWrap = utils.createElement('div', { id: 'helper_cross', class: 'top_panel' })
  crossWrap.innerHTML = `<div class="panel-button single-btn">垂直剖面</div>`;
  panelWrap.appendChild(crossWrap);
  crossWrap.addEventListener('click', () => { toggleCrossSection() });

  //-------//
}


//console.log(compareMode.imgDOM);
// compareMode.forward();




/**绑定多模式 */
function bindingMvModel() {
  let dropList = document.querySelectorAll('.mv-model-panel .dropdown-content>a');
  for (let elem of dropList) {
    elem.addEventListener('click', clickDrop);
  }
  let dropBtn = document.querySelector('.dropbtn');
  dropBtn.addEventListener('click', clickDrop);
  function clickDrop(evt) {
    const current = evt.currentTarget;
    let index;
    // console.log(current.classList);
    if (current.classList.contains('dropbtn')) {
      index = 0;
    } else {
      // console.log(current);
      const parent = current.parentElement;
      index = Array.from(parent.children).indexOf(current);
      // parent.style.display='none';
    }

    let currentImgInfo = utils.getImgNow();
    matchedRule = multiModelRule[index];
    let srcList = getMVSrcListFromRule(currentImgInfo.url, matchedRule);
    // console.log(srcList);
    elemsConfig.mvImgDOM.matchedSrcList = srcList;
    elemsConfig.mvImgDOM.mode = 'multiModel';
    // elemsConfig.mvImgDOM.mode = 'multiModel';
    userConfig.mvMode.openCompare();
  }
}


//创建对比框
function createComparePanel() {
  const panel = document.createDocumentFragment();
  const mainWrapper = utils.createElement('div', { id: 'compare-main', class: 'display-none' });
  const controlWrapper = utils.createElement('div', { class: 'compare-warpper' });
  controlWrapper.innerHTML = `<div id="compare-backward" class="my-button">step -6</div><div class="my-button" id="compare-foreward">step +6</div>`;
  controlWrapper.innerHTML += `<select id="compare-interval"><option value="48">起报间隔48小时</option>
  <option value="24">起报间隔24小时</option>
  <option selected="selected" value="12">起报间隔12小时</option></select>
  <div id="close-compare" class="my-button">关闭对比</div>
  <span class="info"></span>`;

  const imgWrapper = utils.createElement('div', { class: 'compare-img-main' });
  imgWrapper.innerHTML =
    `<div class="compare-img-wrapper"><img class="compare-img" src=""><div class="compare-img-info">init Time</div></div>
  <div class="compare-img-wrapper"><img class="compare-img" src=""><div class="compare-img-info">init Time</div></div>
  <div class="compare-img-wrapper"><img class="compare-img" src=""><div class="compare-img-info">init Time</div></div>
  <div class="compare-img-wrapper"><img class="compare-img" src=""><div class="compare-img-info">init Time</div></div>`;
  panel.append(mainWrapper);
  mainWrapper.append(controlWrapper, imgWrapper);
  //mainWrapper.append(forewardBut,backwardBut,intervalInput);

  document.body.append(panel);
}

function createCompareMode() {
  const compareHandler = {
    set(obj, prop, value, receiver) {
      if (prop === 'interval') {
        obj.interval = value;
        receiver.firstImg = obj.firstImg;
        //obj.img[1] = obj.img[0] + value;
        //obj.img[2] = obj.img[0] + value*2;
        //obj.img[3] = obj.img[0] + value*3;
      } else if (prop === 'firstHr') {
        // console.log(obj.imgInfo.toSource());
        // const initURL = obj.imgInfo.url;
        const date = obj.imgInfo.date;
        const initDate = obj.imgInfo.initDate;
        const hour = utils.paddingInt(value, 3);
        const url = obj.imgInfo.getUrl(date, hour, initDate)
        receiver.firstImg = url;
        //receiver.interval = obj.interval;
      } else if (prop === 'imgInfo') {

        console.log('设置初始图像为:' + value.url);
      } else if (prop === 'firstImg') {
        const imgList = obj.fit2sameday(value);
        // console.log(imgList);
        obj.showInfo(value);
        imgList.forEach((imgSrc, i) => {
          receiver.img[i] = imgSrc;
        })
        //obj.img[0] = imgList;
        // obj.img[1] = ;
      }
      Reflect.set(obj, prop, value);
    },
  };

  const imgHandler = {
    set(obj, prop, value, receiver) {
      utils.log(`第${Number(prop) + 1}个图像地址为${value}`);
      elemsConfig.compareImgDOM.img[prop].src = value;
      iImgInfo = utils.getImgNow(value);
      const initTime = moment(iImgInfo.initDate, 'YYYYMMDDHH');
      const nowTime = moment(initTime).add(Number.parseInt(iImgInfo.hour) + 8, 'hours');
      elemsConfig.compareImgDOM.info[prop].innerHTML =
        `起报: ${initTime.format('MM-DD HH')} UTC, 【北京时${nowTime.format('MM月DD日HH时')}(${iImgInfo.hour}h)】${iImgInfo.model}, ${iImgInfo.eleName}`;
      //console.log(value);
      //let imgDom = document.querySelectorAll('.compare .imgSrc');
      //imgDom[prop].src = value;
      Reflect.set(obj, prop, value);
    },
  };
  let imgSrc = new Proxy([1, 2, 3, 4], imgHandler);
  const modeProto = {
    img: imgSrc,
    firstImg: '',
    interval: 12,
    foreward(step = 6) {
      this.firstHr = this.firstHr + step;
      // console.log('步进');
    },
    backward(step = 6) {
      if (this.firstHr - step >= 0) {
        this.firstHr = this.firstHr - step;
      } else {
        alert('不能再退了');
      }
    },
    firstHr: 1,
    urlMode(base = 'http://10.148') {
      let url = base;
      return url;
    },
    initIMG() {// TODO addEventListener('error',(evt)=>{evt.srcElement.src})
      let DOMs = document.querySelectorAll('#compare-main .compare-img');
      let imgDOM = [];
      for (let img of DOMs) {
        img.addEventListener('error', (evt) => { let ele = evt.target; ele.onerror = null; ele.src = '/images/weather/nopic_800_600.jpg'; });
        imgDOM.push(img);
      };
      elemsConfig.compareImgDOM.img = imgDOM;

      let infoDOMs = document.querySelectorAll('#compare-main .compare-img-info');
      let infoList = [];
      for (let ele of infoDOMs) {
        infoList.push(ele);
      };
      elemsConfig.compareImgDOM.info = infoList;
      //return imgDOM;
    },
    imgInfo: {},
    openCompare() {
      const wrapper = document.getElementById('compare-main');
      //if(wrapper.classList.contains('display-none')) wrapper.classList.remove('display-none')
      wrapper.classList.remove('display-none');
      try {
        this.imgInfo = utils.getImgNow();
        this.firstHr = Number.parseInt(this.imgInfo.hour);
      } catch (err) {
        alert(err.message);
        console.error(err);
      }
    },
    closeCompare() {
      const wrapper = document.getElementById('compare-main');
      //if(wrapper.classList.contains('display-none')) wrapper.classList.remove('display-none')
      wrapper.classList.add('display-none');
      // this.imgInfo = utils.getImgNow();
    },
    fit2sameday(firstImg) {
      const interval = this.interval;
      const firstInfo = utils.getImgNow(firstImg);
      // console.log(firstImg);
      // console.log(firstInfo);
      const imgList = [firstImg];
      const iniTime = moment(firstInfo.initDate, 'YYYYMMDDHH');
      for (let i = 1; i < 4; i++) {
        const fitTime = moment(iniTime).add(-1 * interval * i, 'hours');
        const iDate = moment(fitTime).format('YYYYMMDD');
        const iInit = moment(fitTime).format('YYYYMMDDHH');
        const hour = Number.parseInt(firstInfo.hour) + interval * i;
        // console.log('预报时效'+hour);
        const iHour = utils.paddingInt(hour, 3);
        const url = firstInfo.getUrl(iDate, iHour, iInit);
        imgList.push(url);
      }
      return imgList;
    },
    changeInterval(evt) {
      this.interval = Number.parseInt(evt.target.value);
      // console.log(evt);
    },
    showInfo(img) {
      const controlInfo = document.querySelector('#compare-main .compare-warpper .info');
      const imgInfo = utils.getImgNow(img);
      const nowTime = moment(imgInfo.initDate, 'YYYYMMDDHH').add(Number.parseInt(imgInfo.hour) + 8, 'hours');
      controlInfo.innerHTML = ' UTC+8 ' + nowTime.format('YYYY年MM月DD日HH时');
      controlInfo.innerHTML += ' | GMT' + nowTime.add(-8, 'hours').format('YYYY-MM-DD HH:00');
    },
  };

  const compareMode = new Proxy(modeProto, compareHandler);
  return compareMode;
}


//compareMode.imgInfo = utils.getImgNow();





//创建多视窗对比框
function createMVPanel() {
  const panel = document.createDocumentFragment();
  const mainWrapper = utils.createElement('div', { id: 'multiviews-main', class: 'display-none' });
  const controlWrapper = utils.createElement('div', { class: 'compare-warpper' });
  controlWrapper.innerHTML = `<div id="mv-backward" class="my-button">step -6</div><div class="my-button" id="mv-foreward">step +6</div>`;
  controlWrapper.innerHTML += `<select id="mv-interval"><option selected="selected" value="6">间隔6小时</option>
  <option value="12">间隔12小时</option>
  <option value="24">间隔24小时</option></select>
  <div id="close-mv" class="my-button">关闭多图模式</div>
  <span class="info"></span>`;

  const imgWrapper = utils.createElement('div', { class: 'compare-img-main' });
  imgWrapper.innerHTML =
    `<div class="compare-img-wrapper"><img class="compare-img" src=""><div class="compare-img-info">init Time</div></div>
  <div class="compare-img-wrapper"><img class="compare-img" src=""><div class="compare-img-info">init Time</div></div>
  <div class="compare-img-wrapper"><img class="compare-img" src=""><div class="compare-img-info">init Time</div></div>
  <div class="compare-img-wrapper"><img class="compare-img" src=""><div class="compare-img-info">init Time</div></div>`;
  panel.append(mainWrapper);
  mainWrapper.append(controlWrapper, imgWrapper);
  //mainWrapper.append(forewardBut,backwardBut,intervalInput);

  document.body.append(panel);
}

function createMultiviewsMode() {
  const compareHandler = {
    set(obj, prop, value, receiver) {
      if (prop === 'interval') {
        obj.interval = value;
        // receiver.firstImg = obj.firstImg;
        receiver.step = value * obj.imgArr.length;
        const firstImg = obj.imgArr[0];
        let imgInfo = utils.getImgNow(firstImg);
        let iHour = Number.parseInt(imgInfo.hour);
        for (let i = 0; i < obj.imgArr.length; i++) {
          let currentHour = iHour + i * value;
          const hourString = utils.paddingInt(currentHour);
          obj.imgArr[i] = utils.getImgUrl(imgInfo.base, imgInfo.date, hourString, imgInfo.initDate);
        }
      } else if (prop === 'firstHr') {
        const date = obj.imgInfo.date;
        const initDate = obj.imgInfo.initDate;
        const hour = utils.paddingInt(value, 3);
        const url = obj.imgInfo.getUrl(date, hour, initDate)
        receiver.firstImg = url;
      } else if (prop === 'step') {
        // console.log('step');
        // obj.step = value;
        document.getElementById('mv-foreward').innerText = 'step +' + value;
        document.getElementById('mv-backward').innerText = 'step -' + value;
      } else if (prop === 'imgInfo') {
        console.log('设置初始图像为:' + value.url);
      } else if (prop === 'firstImg') {
        const imgList = obj.fit2sameday(value);
        // console.log(imgList);
        obj.showInfo(value);
        imgList.forEach((imgSrc, i) => {
          receiver.imgArr[i] = imgSrc;
        })
        //obj.img[0] = imgList;
        // obj.img[1] = ;
      }
      Reflect.set(obj, prop, value);
    },
  };

  const imgHandler = {
    set(obj, prop, value) {
      utils.log(`第${Number(prop) + 1}个图像地址为${value}`);
      elemsConfig.mvImgDOM.img[prop].src = value;
      iImgInfo = utils.getImgNow(value);
      const initTime = moment(iImgInfo.initDate, 'YYYYMMDDHH');
      const nowTime = moment(initTime).add(Number.parseInt(iImgInfo.hour) + 8, 'hours');
      // controlInfo.innerHTML = ' UTC+8 '+ nowTime.format('YYYY年MM月DD日HH时');
      elemsConfig.mvImgDOM.info[prop].innerHTML =
        `【北京时${nowTime.format('MM月DD日HH时')}(${iImgInfo.hour}h)】${iImgInfo.model}, ${iImgInfo.eleName}, 起报: ${initTime.format('MM-DD HH')} UTC`;
      Reflect.set(obj, prop, value);
    },
  };
  let imgSrc = new Proxy([1, 2, 3, 4], imgHandler);
  const modeProto = {
    imgArr: imgSrc,
    firstImg: '',
    interval: 6,
    step: 6,
    foreward(step = 6) {
      // this.firstHr = this.firstHr + step;
      // console.log(this);
      this.changeHour(this.step);
      // console.log('步进');
    },
    backward(step = -6) {
      let imgInfo = utils.getImgNow(this.imgArr[0]);
      // console.dir(imgInfo);
      // console.log(Number.parseInt(imgInfo.hour) - this.step>=0)
      if (Number.parseInt(imgInfo.hour) - this.step >= 0) {
        this.changeHour(-1 * this.step);
        // console.log('步退');
      } else {
        alert('不能再退了');
      }
    },
    changeHour(hr = 6) {

      let hour = parseInt(hr);
      for (let i = 0; i < this.imgArr.length; i++) {
        let iInfo = utils.getImgNow(this.imgArr[i]);
        let newHour = parseInt(iInfo.hour) + hour;
        // console.log(newHour);
        this.imgArr[i] = iInfo.getUrl(iInfo.date, utils.paddingInt(newHour), iInfo.initDate);
      }
    },
    firstHr: 1,
    urlMode(base = 'http://10.148') {
      let url = base;
      return url;
    },
    initIMG() {// TODO addEventListener('error',(evt)=>{evt.srcElement.src})
      let DOMs = document.querySelectorAll('#multiviews-main .compare-img');
      let imgDOM = [];
      for (let img of DOMs) {
        img.addEventListener('error', (evt) => { let ele = evt.target; ele.onerror = null; ele.src = '/images/weather/nopic_800_600.jpg'; });
        imgDOM.push(img);
      };
      elemsConfig.mvImgDOM.img = imgDOM;

      let infoDOMs = document.querySelectorAll('#multiviews-main .compare-img-info');
      let infoList = [];
      for (let ele of infoDOMs) {
        infoList.push(ele);
      };
      elemsConfig.mvImgDOM.info = infoList;
      //return imgDOM;
    },
    imgInfo: {},
    openCompare() {
      const wrapper = document.getElementById('multiviews-main');
      //if(wrapper.classList.contains('display-none')) wrapper.classList.remove('display-none')
      wrapper.classList.remove('display-none');
      document.getElementById('mv-interval').classList.remove('display-none');
      try {
        let imgInfo = utils.getImgNow();
        if (elemsConfig.mvImgDOM.mode === 'multiElem') {
          for (let i = 0; i < this.imgArr.length; i++) {
            const iPatt = elemsConfig.mvImgDOM.matchPattens[i];
            // console.log(iPatt);
            const iMatch = utils.matchImgPattern(iPatt);
            console.log(iMatch);
            this.imgArr[i] = utils.getImgUrl(iMatch.base, imgInfo.date, imgInfo.hour, imgInfo.initDate);
          }
        } else if (elemsConfig.mvImgDOM.mode === 'multiTime') {
          this.step = this.interval * this.imgArr.length;
          let iHour = Number.parseInt(imgInfo.hour);
          for (let i = 0; i < this.imgArr.length; i++) {
            let currentHour = iHour + i * this.interval;
            const hourString = utils.paddingInt(currentHour);
            this.imgArr[i] = utils.getImgUrl(imgInfo.base, imgInfo.date, hourString, imgInfo.initDate);
          }
        } if (elemsConfig.mvImgDOM.mode === 'multiModel' || elemsConfig.mvImgDOM.mode === 'multiElems') {
          for (let i = 0; i < elemsConfig.mvImgDOM.matchedSrcList.length; i++) {
            this.imgArr[i] = elemsConfig.mvImgDOM.matchedSrcList[i];
          }
          document.getElementById('mv-interval').classList.add('display-none');
          this.step = 6;
        }

      } catch (err) {
        alert(err.message);
        console.error(err);
      }
    },
    closeCompare() {
      const wrapper = document.getElementById('multiviews-main');
      //if(wrapper.classList.contains('display-none')) wrapper.classList.remove('display-none')
      wrapper.classList.add('display-none');
      // this.imgInfo = utils.getImgNow();
    },
    fit2sameday(firstImg) {
      const interval = this.interval;
      const firstInfo = utils.getImgNow(firstImg);
      // console.log(firstImg);
      // console.log(firstInfo);
      const imgList = [firstImg];
      const iniTime = moment(firstInfo.initDate, 'YYYYMMDDHH');
      for (let i = 1; i < 4; i++) {
        const fitTime = moment(iniTime).add(-1 * interval * i, 'hours');
        const iDate = moment(fitTime).format('YYYYMMDD');
        const iInit = moment(fitTime).format('YYYYMMDDHH');
        const hour = Number.parseInt(firstInfo.hour) + interval * i;
        // console.log('预报时效'+hour);
        const iHour = utils.paddingInt(hour, 3);
        const url = firstInfo.getUrl(iDate, iHour, iInit);
        imgList.push(url);
      }
      return imgList;
    },
    changeInterval(evt) {
      if (elemsConfig.mvImgDOM.mode === 'multiModel' || elemsConfig.mvImgDOM.mode === 'multiElems') {
        return confirm('多模式下不支持调整间隔');
      }
      this.interval = Number.parseInt(evt.target.value);
      // console.log(evt);
    },
    showInfo(img) {
      const controlInfo = document.querySelector('#multiviews-main .compare-warpper .info');
      const imgInfo = utils.getImgNow(img);
      const nowTime = moment(imgInfo.initDate, 'YYYYMMDDHH').add(Number.parseInt(imgInfo.hour) + 8, 'hours');
      controlInfo.innerHTML = ' UTC+8 ' + nowTime.format('YYYY年MM月DD日HH时');
      controlInfo.innerHTML += ' | GMT' + nowTime.add(-8, 'hours').format('YYYY-MM-DD HH:00');
    },
  };

  const compareMode = new Proxy(modeProto, compareHandler);
  return compareMode;
}

if (location.href.includes('to_fore_homepage.action')) {
  if (window.frames.length != parent.frames.length) {
　　return;
  }
  createSelectModePanel();
  createPanel();
  NWP_init();
  createTlinePanel();
  bindingMvModel();
  createComparePanel();
  const compareMode = createCompareMode();//创建对比DOM框架
  compareMode.hook = function (selector = '', listener = '', callback = () => { }, bindObj = compareMode) {
    var targetEle = document.querySelector(selector);
    targetEle.addEventListener(listener, () => callback.call(bindObj), false);
  };
  compareMode.hook('#compare-backward', 'click', compareMode.backward, compareMode);
  compareMode.hook('#compare-foreward', 'click', compareMode.foreward, compareMode);
  compareMode.hook('#open-compare', 'click', compareMode.openCompare, compareMode);
  compareMode.hook('#close-compare', 'click', compareMode.closeCompare, compareMode);
  //compareMode.hook('#compare-interval','change',(evt)=>compareMode.changeInterval(evt),compareMode);
  document.getElementById('compare-interval').addEventListener('change', (evt) => compareMode.changeInterval(evt));
  compareMode.initIMG();

  createMVPanel();//创建对比DOM框架
  const mvMode = createMultiviewsMode();
  mvMode.hook = function (selector = '', listener = '', callback = () => { }, bindObj = mvMode) {
    var targetEle = document.querySelector(selector);
    targetEle.addEventListener(listener, () => callback.call(bindObj), false);
  };
  mvMode.hook('#mv-backward', 'click', mvMode.backward, mvMode);
  mvMode.hook('#mv-foreward', 'click', mvMode.foreward, mvMode);
  mvMode.hook('#close-mv', 'click', mvMode.closeCompare, mvMode);
  //compareMode.hook('#compare-interval','change',(evt)=>compareMode.changeInterval(evt),compareMode);
  document.getElementById('mv-interval').addEventListener('change', (evt) => mvMode.changeInterval(evt));

  mvMode.initIMG();
  userConfig.mvMode = mvMode;
  let openMvTime = document.getElementById('open-mvTime');
  // console.log(openMvTime)
  openMvTime.addEventListener('click', () => {
    elemsConfig.mvImgDOM.mode = 'multiTime';
    mvMode.openCompare();
  });
  createMapIndicator();
}

if (location.href.includes('to_fore_homepage.action')) {
  GM_addStyle(`
/* Style The Dropdown Button */
/*background-color: #4CAF50;*/
.dropbtn {
  background-color: rgb(45,53,63);
  color: white;
  font-size: 16px;
  cursor: pointer;
  border: none;
  padding: 5px;
  border: 1px solid white;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
  margin-left:5px;
  margin-right:5px;

}

.dropbtn .tooltiptext{
  width: intrinsic;
  width: -webkit-max-content;
  width:-moz-max-content;
  width: max-content;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  left: 0px;
  top: 30px;
  background-color: #f9f9f9;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  width: intrinsic;
  width: -webkit-max-content;
  width:-moz-max-content;
  width: max-content;
}

/* Links inside the dropdown */
.dropdown-content>a {
  color: black;
  padding: 6px 8px;
  text-decoration: none;
  display: block;
  border-bottom: 1px dashed #4CAF50;

}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {
  background-color: rgb(150, 185, 125);
  font-weight: bold;
  color: rgb(255, 255, 255);
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: inline-block;
}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {
  background-color: #3e8e41;
  font-weight: bold;
}

.tooltip {
  position: relative;
  display: inline-block;
  /*border-bottom: 1px dotted black;*/
}

.tooltip .tooltiptext {
  visibility: hidden;
  min-width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: 2;
  top: -5px;
  left: 110%;
  opacity: 0.8;
  word-break: keep-all;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 100%;
  margin-top: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: transparent black transparent transparent;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
`);

  GM_addStyle(`
  .show_panel{
    z-index:11;
    font-size: 18px;
  }
  .top_panel{
    background-color: rgb(45,53,63);
    border-bottom: 0px solid rgb(20,20,20); padding:5px;
    border-bottom: 0px solid rgb(20,20,20);border-radius: 4px;border: 1px solid rgb(22,25,28);
    box-shadow:0 1px 0 rgba(162,184,204,0.25) inset,0 0 4px hsla(0,0%,0%,0.95);
    color: white;
  }
  #helper_panel{
    position:absolute;
    top:5px;
    left:740px;
    display: flex;
    align-items: center;
  }
  #edit-helper-panel{
    position:absolute;
    top:50px;
    left:740px;
  }
  #enhanced-helper-panel{
    position:absolute;
    top:50px;
    left:848px;
  }
  .panel-button{
    cursor:pointer;
  }
  #select-mode-panel{
    position:absolute; top:5px;left:370px;
    background-color: rgb(45,53,63);
    border-bottom: 0px solid rgb(20,20,20); padding:5px;
    border-bottom: 0px solid rgb(20,20,20);border-radius: 4px;border: 1px solid rgb(22,25,28);
    box-shadow:0 1px 0 rgba(162,184,204,0.25) inset,0 0 4px hsla(0,0%,0%,0.95);
    color: white;}
    `);
  /**暂时隐藏按钮 */
  GM_addStyle(`#helper_latLon .fixLoc{display:inline-block;width:55px;height:15px;overflow:hidden;}`);
  //GM_addStyle(`#helper_latLon{display:none;}`);
  /**重要添加十字鼠标 */
  // GM_addStyle('#pic_frame div{border:1px solid !important;cursor:crosshair !important;}');
  GM_addStyle(`
  #line_panel {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #f5f5f5;
    border-bottom: 0px solid rgb(20, 20, 20);
    padding: 5px;
    border-radius: 4px;
    border: 1px solid rgb(22, 25, 28);
    box-shadow: 0 1px 0 rgba(162, 184, 204, 0.25) inset, 0 0 4px hsla(0, 0%, 0%, 0.95);
    color: black;
    width: 0px;
  }
  #show-temp,#show-wind,#show-pre,#show-cloud{
    width: 100%;
    height:210px;
  }
  #show-pre{
    display:block;
  }
  .full-screen-mode{
    float:left;
    padding-left:10px;
  }
  .full-screen-mode #float_icons{
    display:none!important;
  }
  .full-screen-mode #pic_frame div{
    border:1px solid;
    cursor:crosshair !important;
  }
  .top_panel .single-btn{
    display:inline-block;
    margin-left:5px;
    margin-right:5px;
    padding:5px;
    border: 1px solid white;
    /*background-color: #4CAF50;*/
  }
  .top_panel .single-btn:hover{
    background-color:#47CB89;
  }

  .active-button > div, .active-button.single-btn{
    background-color:green;
  }

  #compare-main, #multiviews-main{
    z-index: 12;
    position: absolute;
    top: 0px;
    right: 1%;
    bottom: 1%;
    left: 1%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #float_icons{
    display:none!important;
  }
  .compare-warpper {
    display: flex;
    justify-content: center;
    min-width: 1000px;
    background: white;
    font-size: 18px;
    align-items: center;
  }
  .compare-img-main {
    border: 1px dotted red;
    max-width: 1520px;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    background-color: white;
  }
  .compare-img-main .compare-img-wrapper {
    border: 2px solid blue;
    overflow: hidden;
    position:relative;
  }
  .compare-img-main .compare-img {
    position: relative;
    top: -50px;
    height: 120%;
  }
  .my-button{
    cursor:pointer;
    margin-left:2px;
    margin-right:2px;
    padding:1px;
    background-color: rgb(45,53,63);
    border-bottom: 0px solid rgb(20,20,20); padding:5px;
    border-bottom: 0px solid rgb(20,20,20);border-radius: 4px;border: 1px solid rgb(22,25,28);
    box-shadow:0 1px 0 rgba(162,184,204,0.25) inset,0 0 4px hsla(0,0%,0%,0.95);
    color: white;
  }
  .my-button:hover{
    background-color:orange;
  }
  .display-none{
    display:none!important;
  }
  .compare-img-info {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 121, 13, 0.6);
    color: white;
    padding:2px;
    font-size:20px;
    font-family:"Arial","Microsoft YaHei","黑体","STXihei","华文细黑";
  }
  `);
  GM_addStyle(`
  .water-dot {
    position: relative;
    display: inline-block;
    height: 26px;
    width: 16px;
  }

  .water-dot:before,
  .water-dot:after {
    content: '';
    position: absolute;
    display: inline-block;
  }

  .water-dot:before {
    left: 0;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-image: repeating-radial-gradient(8px 8px at 50% 8px, transparent 0%, transparent 3px, #dd1010 3px, #dd1010 100%);
  }

  .water-dot:after {
    bottom: 0;
    left: 50%;
    border: 14px solid #dd1010;
    border-bottom-width: 0;
    border-right-width: 7px;
    border-left-width: 7px;
    transform: translate(-50%,0);
    border-bottom-color: transparent;
    border-right-color: transparent;
    border-left-color: transparent;
  }
  .water-dot.scale-lg{
    transform: scale(1.5);
  }
  `);

  GM_addStyle(`.show_panel{z-index:11;}
#pic_frame,#main_frame{
  position:relative;
}
#map-pointer {
  position: absolute;
  top: 22px;
  left: 0px;
  /*background-color: rgba(0, 152, 50, 0.7);*/
  color: white;
  /*width:15px;*/
  /*height:15px;*/
  display:inline-block;
  padding:2px;
  z-index:10;
  cursor:pointer;
}
#cv-draw-line{
  position: absolute;
  z-index:9;
  left:0px;
  cursor:crosshair;
}
#wrap-draw-tc{
  display: inline-block;
  position: absolute !important;
  z-index: 1;
  border:none !important;
  margin-left: 37px;
  pointer-events:none;
  left: 0;
  top: 0 !important;
}
`);

}

// let openMv = document.getElementById('open-mv');
// openMv.addEventListener('click',()=>{
//   elemsConfig.mvImgDOM.mode = 'multiElem';
// });
/**
 * 地图单点标志
 */
function createMapIndicator() {
  let wrapDiv = document.querySelector('#main_frame');
  let pointer = utils.createElement('div', { id: 'map-pointer', draggable: 'true', class: 'display-none' });
  pointer.innerHTML = '<span class="water-dot scale-lg"></span>'
  wrapDiv.insertAdjacentElement('afterbegin', pointer);
  //保存位置的状态值
  var pos = {
    // parent_top:0,
    // parent_left:0,
    // cur_top:0,
    // cur_left:0,
    x_diff: 0,// 鼠标相对目标物的位置
    y_diff: 0,
  }

  function allowDrop(ev) {    //ev是事件对象
    ev.preventDefault();   //取消事件已经关联的默认活动
  }

  function drag(ev) {
    //dataTransfer是一个媒介，将目标对象放入媒介
    //dataTransfer对象用来保存被拖动的数据，仅在拖动事件有效
    //这里将被拖动元素的id保存为名为Text的键值对中

    ev.dataTransfer.setData("Pointer", ev.target.id);

    //获取被拖动对象相对于上层元素顶边和左边位置
    let mouseXY = utils.getElemRelPos(ev.currentTarget, ev.clientX, ev.clientY);
    // let eStyle = getComputedStyle(ev.target);
    pos.x_diff = mouseXY.x;
    pos.y_diff = mouseXY.y;
    // console.log('current');
    // console.log(ev.currentTarget);
    // console.log(ev.target);
    // pos.parent_top=ev.target.offsetTop;
    // pos.parent_left=ev.target.offsetLeft;
    // pos.cur_top=ev.screenY;
    // pos.cur_left=ev.screenX;
    // console.log(mouseXY);
    // console.log(eStyle.marginLeft);
    // console.log(ev);
  }

  function drop(ev) {
    var new_top, new_left;
    ev.preventDefault();
    // alert(2);
    var data = ev.dataTransfer.getData("Pointer");  //从媒介中获取目标对象
    var elem = document.getElementById(data);

    //这里不能这样使用，因为offset*的值是只读的，不能改变
    //   elem.offsetLeft=v.parent_left+ev.screenX-v.cur_left+"px";
    //   elem.offsetTop=v.parent_top+ev.screenY-v.cur_top+"px";
    let target = document.querySelector('#pic_frame img[style~="inline;"]');
    let mouseXY = utils.getElemRelPos(target, ev.clientX, ev.clientY);
    // let mouseXY = utils.getElemRelPos(ev.target,ev.clientX, ev.clientY);
    // console.log(ev.target);
    // let eStyle = getComputedStyle(elem);
    // console.log(mouseXY);
    // console.log(mouseXY.x+eStyle.width);
    // 此处有微小的位移
    elem.style.marginLeft = mouseXY.x - pos.x_diff + 35.8 + "px";
    elem.style.marginTop = mouseXY.y - pos.y_diff + "px";
    // console.log([parseFloat(elem.style.marginTop)+23.2 + 12.3,parseFloat(elem.style.marginLeft)+10]);
    let newMouseXY = {
      x: parseFloat(elem.style.marginLeft) - 29.31,
      // x:parseFloat(elem.style.marginLeft) + 5.0,
      y: parseFloat(elem.style.marginTop) + 33.066,
    };
    const loc = helperConfig.matchLoc(newMouseXY, helperConfig.matchParam);
    elemsConfig.latLonInput.lat.innerHTML = loc.lat; // mouseXY.y
    elemsConfig.latLonInput.lon.innerHTML = loc.lon; // mouseXY.x
    elemsConfig.fixPoint = { lat: loc.lat, lon: loc.lon };
    // console.log(elemsConfig.fixPoint);
    utils.showTimeSeries(elemsConfig.fixPoint);

    // elem.style.marginLeft=pos.parent_left+ev.screenX-pos.cur_left-1+"px";
    // elem.style.marginTop=pos.parent_top+ev.screenY-pos.cur_top-23.2+"px";
    /* TODO
      const imgXY = {
        x: elem.style.marginLeft;
        y: elem.style.marginTop;
      }
      const loc = helperConfig.matchLoc(imgXY, helperConfig.matchParam);
      elemsConfig.pointerPoint.lat = loc.lat;
      elemsConfig.pointerPoint.lon = loc.lon;
      utils.showTimeSeries(elemsConfig.pointerPoint);
    */

  }
  pointer.addEventListener('dragstart', drag);
  wrapDiv.addEventListener('dragover', allowDrop);
  wrapDiv.addEventListener('drop', drop);
}



/**
 * 经纬度到图像位置
 */
function latlon2XY(loc = { lat: 10, lon: 120 }) {
  const imgXY = helperConfig.matchImgXY(loc, helperConfig.matchParam);
  return imgXY;
}

function createCrossSectionCanvas() {
  // let wrapDiv = document.querySelector('#main_frame');
  let wrapDiv = document.querySelector('#pic_frame');
  const cv = utils.createElement('canvas', { id: 'cv-draw-line', class: 'display-none', width: "800", height: "600", style: "border:1px solid #d3d3d3;" });
  wrapDiv.insertAdjacentElement('afterbegin', cv);
  const ctx = cv.getContext('2d');
  const line = { start: [0, 0], end: [0, 0], init: false };
  const cvMsMove = function (ev) {
    // console.log('test2');
    ctx.clearRect(0, 0, 800, 600);
    ctx.beginPath();
    ctx.lineWidth = 3;
    let mouseXY = utils.getElemRelPos(ev.target, ev.clientX, ev.clientY);
    line.end = [mouseXY.x, mouseXY.y];
    ctx.moveTo(...line.start);
    ctx.lineTo(...line.end);
    ctx.strokeStyle = "green";
    ctx.stroke();
    // console.log(line);
  }

  const cvMsClick = function (ev) {
    // console.log('test');
    if (line.init) {
      cv.removeEventListener('mousemove', cvMsMove, false);

      // console.log(elemsConfig.latLonInput.lon.innerText,elemsConfig.latLonInput.lat.innerText);
      const deltaX = 37.11666870117187;
      line.startLatlon = {
        x: line.start[0] - deltaX,
        y: line.start[1],
      }
      line.endLatlon = {
        x: line.end[0] - deltaX,
        y: line.end[1],
      }
      line.startLatlon.loc = helperConfig.matchLoc(line.startLatlon, helperConfig.matchParam);
      line.endLatlon.loc = helperConfig.matchLoc(line.endLatlon, helperConfig.matchParam);
      console.log(line);
      utils.showCross(line.startLatlon.loc, line.endLatlon.loc)
      line.init = false;
    } else {
      // ctx.beginPath();
      // ctx.lineWidth=10;
      // ctx.moveTo(0,0);
      // ctx.lineTo(50,50);
      // ctx.strokeStyle="green";
      // ctx.stroke();
      let mouseXY = utils.getElemRelPos(ev.target, ev.clientX, ev.clientY);
      line.start = [mouseXY.x, mouseXY.y];
      cv.addEventListener('mousemove', cvMsMove, false);
      line.init = true;
    }

  }
  cv.addEventListener('click', cvMsClick, false);
  ctx.fillStyle = 'rgba(255,255,255,0)';
}
setTimeout(() => { createCrossSectionCanvas() }, 5000);

/*
绘制台风部分
*/
function createSvgTC() {
  let wrapDiv = document.querySelector('#pic_frame');
  const svgTc = utils.createElement('span', { id: 'wrap-draw-tc', class: 'display-none', width: "800", height: "600" });
  wrapDiv.insertAdjacentElement('afterbegin', svgTc);
  // console.log('getTime');
}

// setTimeout(()=>{createSvgTC()},5000);

async function showSvgTC() {
  // if(proxyConfig.tcShowLock) return;
  // proxyConfig.tcShowLock = true;
  let svgTC = document.querySelector('#wrap-draw-tc');
  if (!svgTC) {
    createSvgTC();
    svgTC = document.querySelector('#wrap-draw-tc');
  }
  svgTC.classList.remove('display-none');
  const fcTime = utils.getFcTime();

  proxyConfig.preRegion = unsafeWindow._region;
  proxyConfig.preTime = fcTime.date + fcTime.hr;

  const initTime = moment(fcTime.date + fcTime.hr, 'YYYY-MM-DDHH');
  const sT = moment(initTime).add(7, 'hours').format('YYYY-MM-DD%20HH:mm');
  const eT = moment(initTime).add(9, 'hours').format('YYYY-MM-DD%20HH:mm');
  // demoUrl = 'https://trident.gdmo.gq/api?interface=tc-ens&gt=2020-07-29%2007:00&lt=2020-07-29%2009:00&dateFormat=YYYY-MM-DD%20HH:mm&ins=ecmwf&basin=WPAC&spe=all';
  // 接口为北京时
  const url = `https://trident.gdmo.gq/api?interface=tc-ens&gt=${sT}&lt=${eT}&dateFormat=YYYY-MM-DD%20HH:mm&ins=ecmwf&basin=WPAC&spe=all`;
  let jsonRaw = await utils.getJSON(url)
    .catch(err => {
      // proxyConfig.tcShowLock = false;
      throw err;
    });
  // proxyConfig.tcShowLock = false;
  let tcArr = jsonRaw.data;
  if (tcArr.length) {
    let allTC = tcUtil.catTC(tcArr);

    let cyclonesWrap = allTC[0].ins[0];
    if (!cyclonesWrap) return console.error('没数据');
    // console.log(cyclonesWrap);
    drawTCMap(cyclonesWrap.tc);
  } else {
    let errorNotice = GM_notification({ text: '当前没有台风数据', image: 'http://10.148.8.228/images/logo.png', title: '数据缺失', timeout: 3000 });
    if (errorNotice) setTimeout(() => errorNotice.remove(), 3000);
    d3.select("#wrap-draw-tc > svg").remove();
  }
}

function toggleTCMode(whichBtn) {
  if (whichBtn === 'tcShow') {
    proxyConfig.showTcMode = !proxyConfig.showTcMode;
  } else if (whichBtn === 'detShow') {
    proxyConfig.showDetTcMode = !proxyConfig.showDetTcMode;
  } else if (whichBtn === 'ensShow') {
    proxyConfig.showEnsTcMode = !proxyConfig.showEnsTcMode;
  } else {
    console.error('不正确的参数 in toggleTCMode')
  }
}

function drawTCMap(multiTC) {
  // console.log(multiTC);
  // TODO 缺少 projection 和 path 函数
  let timeInterval = tcUtil.model[multiTC[0].ins].interval;
  function path(geoData = { type: "LineString", coordinates: [111.5, 23.5] }) {
    if (geoData.type === "LineString") {
      let loc0 = { lon: geoData.coordinates[0][0], lat: geoData.coordinates[0][1] };
      let iXY0 = latlon2XY(loc0);// {x,y}
      let loc1 = { lon: geoData.coordinates[1][0], lat: geoData.coordinates[1][1] };
      let iXY1 = latlon2XY(loc1);// {x,y}
      let svgDstring = `M${iXY0.x},${iXY0.y} L${iXY1.x},${iXY1.y}`;
      return svgDstring;
    } else {
      let loc = { lon: geoData.coordinates[0][0], lat: geoData.coordinates[0][1] };
      let iXY = latlon2XY(loc);
      return iXY;
    }
  }

  let allLineArr = new Array();
  for (let iTc = 0; iTc < multiTC.length; iTc++) {
    let tcRaw = multiTC[iTc];
    let catArr = tcRaw.tracks
      .map(member => member.track)
      .map(track => {
        let twoPointLineArr = [];
        for (let i = 0; i < track.length - 1; i++) {
          let point0 = track[i][1];
          let point1 = track[i + 1][1];
          let nextWind = track[i + 1][3];
          let nextCat = tcUtil.wind2cat(nextWind);
          let nextColor = tcUtil.tcColor[nextCat];
          let time0 = track[i][0];
          let time1 = track[i + 1][0];
          if (time1 - time0 > timeInterval * 2) continue;
          const distance = Math.sqrt(Math.pow(point1[0] - point0[0], 2) + Math.pow(point1[1] - point0[1], 2));
          if (distance > 9) continue; // 如果大于9个经纬度则断线
          twoPointLineArr.push({
            line: { type: "LineString", coordinates: [point0, point1] },
            nextCat,
            nextColor,
            curCat: tcUtil.wind2cat(track[i][3])
          });
        }
        return twoPointLineArr;
      })
      .reduce((acc, val) => acc.concat(val), []);

    allLineArr.push(catArr);
  }
  allLineArr = allLineArr.reduce((acc, val) => acc.concat(val), []);

  d3.select("#wrap-draw-tc > svg").remove();
  let baseMap = d3
    .select('#wrap-draw-tc')
    .append("svg")
    .attr("width", 800)
    .attr("height", 600)
    .attr("class", "map-svg");

  let tcEnsSvgG = baseMap.append("g").attr("class", "svg-tc-ens");
  if (proxyConfig.showEnsTcMode) {
    tcEnsSvgG
      .selectAll("path")
      .data(allLineArr)
      .enter()
      .append("path")
      .attr("d", d => path(d.line))
      .attr("class", d => `track-line ${d.nextCat}`)
      .style("stroke", d => 'rgb(74, 80, 87)')
      .attr("opacity", 0.6);
    // .style("stroke", d => d.nextColor)

    let allPointArr = new Array();
    for (let iTc = 0; iTc < multiTC.length; iTc++) {
      let tcRaw = multiTC[iTc];
      let pointArr = tcRaw.tracks
        .map(member => member.track)
        .map(track =>
          track.map(point => {
            let cat = tcUtil.wind2cat(point[3]);
            return {
              pointXY: path({ type: "Point", coordinates: [point[1]] }),
              // project: projection(point[1]),
              color: tcUtil.tcColor[cat],
              cat
            };
          })
        )
        .reduce((acc, val) => acc.concat(val), []);
      // console.log(pointArr);
      allPointArr = allPointArr.concat(pointArr);
    }
    // console.log(allPointArr);


    let pointSvg = tcEnsSvgG.append("g");
    pointSvg.attr("class", "point-g");
    pointSvg
      .selectAll("circle")
      .data(allPointArr)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", d => d.pointXY.x)
      .attr("cy", d => d.pointXY.y)
      .attr("r", 3)
      .attr("opacity", 0.8)
      .style("stroke", d => d.color)
      .style("stroke-width", 1.0)
      .style("fill", 'none');

  }

  if (proxyConfig.showDetTcMode) {
    /* 确定性预报 */
    let allDetCatArr = new Array();
    for (let iTc = 0; iTc < multiTC.length; iTc++) {
      let tcRaw = multiTC[iTc];
      if (!tcRaw.detTrack || !tcRaw.detTrack.track) continue;//不存在退出
      let detArr = (() => {
        let track = tcRaw.detTrack.track
        let twoPointLineArr = [];
        for (let i = 0; i < track.length - 1; i++) {
          let point0 = track[i][1];
          let point1 = track[i + 1][1];
          let nextWind = track[i + 1][3];
          let nextCat = tcUtil.wind2cat(nextWind);
          let nextColor = tcUtil.tcColor[nextCat];
          let time0 = track[i][0];
          let time1 = track[i + 1][0];
          if (time1 - time0 > timeInterval * 2) continue;// 大于时间间隔跳过连线
          const distance = Math.sqrt(Math.pow(point1[0] - point0[0], 2) + Math.pow(point1[1] - point0[1], 2));
          if (distance > 9) continue; // 如果大于9个经纬度则断线
          twoPointLineArr.push({
            line: { type: "LineString", coordinates: [point0, point1] },
            nextCat,
            nextColor,
            curCat: tcUtil.wind2cat(track[i][3])
          });
        }
        return twoPointLineArr;
      })();
      allDetCatArr.push(detArr);
    }
    allDetCatArr = allDetCatArr.reduce((acc, val) => acc.concat(val), []);

    let allDetPointArr = new Array();
    for (let iTc = 0; iTc < multiTC.length; iTc++) {
      let tcRaw = multiTC[iTc];
      if (!tcRaw.detTrack || !tcRaw.detTrack.track) continue;//不存在退出
      const detPoints = tcRaw.detTrack.track
        .map(point => {
          let cat = tcUtil.wind2cat(point[3]);
          return {
            pointXY: path({ type: "Point", coordinates: [point[1]] }),
            color: tcUtil.tcColor[cat],
            cat
          };
        });
      allDetPointArr = allDetPointArr.concat(detPoints);
    }

    const detTrackSvg = baseMap.append("g").attr("class", "svg-tc-det");
    detTrackSvg
      .selectAll("path")
      .data(allDetCatArr)
      .enter()
      .append("path")
      .attr("d", d => path(d.line))
      .attr("class", d => `track-line-det ${d.nextCat}`)
      .style("stroke", d => d.nextColor)
      .style("stroke-width", 3);

    const detPointSvg = detTrackSvg.append("g");
    detPointSvg.attr("class", "point-g");
    detPointSvg
      .selectAll("circle")
      .data(allDetPointArr)
      .enter()
      .append("circle")
      .attr("class", "point")
      .attr("cx", d => d.pointXY.x)
      .attr("cy", d => d.pointXY.y)
      .attr("r", 3.5)
      .style("fill", d => d.color)
      .style("stroke", d => d.color)
      .style("stroke-width", 1.0)
  }
}

let tcUtil = {
  worldGeo: null,
  geoMap: [],
  tcColor: {
    SuperTY: "rgb(128,0,255)",
    STY: "rgb(153,20,8)",
    TY: "rgb(255,0,0)",
    STS: "rgb(255,128,0)",
    TS: "rgb(0,0,255)",
    TD: "rgb(105,163,74)",
    LOW: "rgb(85,85,79)"
  },

  wind2cat(wind) {
    if (wind >= 10.8 && wind < 17.2) {
      return "TD";
    } else if (wind >= 17.2 && wind < 24.5) {
      return "TS";
    } else if (wind >= 24.5 && wind < 32.7) {
      return "STS";
    } else if (wind >= 32.7 && wind < 41.5) {
      return "TY";
    } else if (wind >= 41.5 && wind < 51.0) {
      return "STY";
    } else if (wind >= 51.0) {
      return "SuperTY";
    } else {
      return "LOW";
    }
  },
  timeColor: [
    { name: "H24", color: "rgb(0,0,0)" },
    { name: "H48", color: "rgb(255,0,0)" },
    { name: "H72", color: "rgb(0,140,48)" },
    { name: "H96", color: "rgb(255,128,0)" },
    { name: "H120", color: "rgb(0,0,102)" },
    { name: "H144", color: "rgb(0,255,0)" },
    { name: "H168", color: "rgb(153,20,8)" },
    { name: "H192", color: "rgb(0,255,255)" },
    { name: "H216", color: "rgb(255,0,255)" },
    { name: "H240", color: "rgb(178,178,178)" }
  ],
  matchTimeColor(time = 24) {
    let count = Math.ceil(time / 24) - 1;
    if (count === -1) count = 0; // 颜色下边界
    let colorLen = tcUtil.timeColor.length;
    if (count > colorLen - 1) count = colorLen - 1; //超过颜色上界
    return tcUtil.timeColor[count].color;
  },
  model: {
    ecmwf: {
      enNumber: 51,
      interval: 6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      }
    },
    NCEP: {
      enNumber: 21,
      interval: 6,
      timeRange() {
        return Array.from(new Array(40), (val, index) => index * 6);
      }
    },
    "ncep-R": {
      enNumber: 21,
      interval: 12,
      timeRange() {
        return Array.from(new Array(30), (val, index) => index * 12);
      }
    },
    "ukmo-R": {
      enNumber: 35,
      interval: 12,
      timeRange() {
        return Array.from(new Array(30), (val, index) => index * 12);
      }
    },
    "ecmwf-R": {
      enNumber: 35,
      interval: 12,
      timeRange() {
        return Array.from(new Array(30), (val, index) => index * 12);
      }
    },
    UKMO: {}
  },
  catTC(tcArr = []) {
    let timeSet = new Set(tcArr.map(tc => tc.initTime)); //选出日期并去重
    let insSet = new Set(tcArr.map(tc => tc.ins));
    let tcAll = []
    for (let iTime of timeSet) {
      let timeWrap = { time: iTime, ins: [] };
      let sameTime = tcArr.filter(tc => tc.initTime == iTime);
      for (let iIns of insSet) {
        let insWrap = { ins: iIns, tc: [] }
        let sameIns = sameTime.filter(tc => tc.ins == iIns);
        insWrap.tc = sameIns;
        timeWrap.ins.push(insWrap);
      }
      tcAll.push(timeWrap);
    }
    // [ { time: '2020-05-15T00:00:00.000Z', ins: [ {} ] } ]
    return tcAll;
  },
};

/** 多模式部分代码 */
function GetURLFromRule({ year = '2020', month = '02', day = '25', hour = '12', fc = '000', minute = '', region, eleName, modelFileName, model }) {
  let imgUrl = this.rule.replace(/{yyyy}/g, year)
    .replace(/{mm}/g, month)
    .replace(/{dd}/g, day)
    .replace(/{HH}/g, hour)
    .replace(/{hhh}/g, fc)
    .replace(/{mi}/g, minute)
    .replace(/{yyyymmdd}/g, year + month + day)
    .replace(/{date}/g, year + month + day)
  return imgUrl;
}

function GetTimeInfo() {
  let timeInfo = {
    year: this.year,
    month: this.month,
    day: this.day,
    hour: this.hour,
    fc: this.fc,
    minute: this.minute ? this.minute : undefined,
  }
  return timeInfo;
}

function getImgInfoFromURL(url = 'http://10.148.8.228/files_home/znwp/ecmwffine_b/hn/20200225/ecmwffine_hn_mslp_000_2020022512.png') {
  let model, region, date, modelFileName, eleName, fc, year, month, day, hour, minute;
  let regPatten;
  let reg = /http:.*?\/znwp\/(.*?)\/(.*?)\/(\d{8})\/(.*?)_(.*?)_(.*?)_(\d{3})_(\d{4})(\d{2})(\d{2})(\d{2})(.*?$)/;
  let matchUrl = url.match(reg);
  if (matchUrl) {
    regPatten = 0;
    model = matchUrl[1];
    region = matchUrl[2];
    date = matchUrl[3];
    modelFileName = matchUrl[4];
    eleName = matchUrl[6];
    fc = matchUrl[7];
    year = matchUrl[8];
    month = matchUrl[9];
    day = matchUrl[10];
    hour = matchUrl[11];
  }
  else {
    let reg2 = /http:.*?\/znwp\/(.*?)\/(.*?)\/+(\d{8})\/(\d{2})\/(.*?)_(.*?)_(.*?)_m(\d{3})_(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(.*?$)/;
    matchUrl = url.match(reg2);
    if (matchUrl) {
      regPatten = 1;
      model = matchUrl[1];
      region = matchUrl[2];
      date = matchUrl[3];
      modelFileName = matchUrl[5];
      eleName = matchUrl[7];
      fc = matchUrl[8];
      year = matchUrl[9];
      month = matchUrl[10];
      day = matchUrl[11];
      hour = matchUrl[12];
      minute = matchUrl[12];
    } else {
      throw new Error('无法匹配的图像地址:' + url)
    }
  }

  // ["http://10.148.8.228/files_home/znwp/ecmwffine_b/hn/20200225/ecmwffine_hn_mslp_000_2020022512.png", "ecmwffine_b", "hn", "20200225", "ecmwffine", "hn", "mslp", "000", "2020", "02", "25", "12", ".png"]



  let info = { regPatten, model, region, date, modelFileName, eleName, fc, year, month, day, hour, minute };
  info.getTimeInfo = GetTimeInfo;
  return info;
}

function matchModel2Rule(model = '', region, eleName) {
  let matchModel = modelMeta.find(v => v.model === model);
  if (!matchModel) throw new new ReferenceError('未找到匹配的模式');
  const rule = matchModel.rule;
  //TODO: 有些特殊模式需要特殊判断
  let newRule = `http://10.148.8.228/files_home/znwp/${model}/{range}/{yyyy}{mm}{dd}/` + rule;
  if (model === 'grapes1km') newRule = `http://10.148.8.228/files_home/znwp/${model}/{range}/` + rule;
  newRule = newRule.replace(/{range}/g, region)
    .replace(/{name}/g, eleName);

  const newInfo = {
    model,
    region,
    eleName,
    modelName: matchModel.modelName,
    modelFileName: matchModel.modelName,
  };
  newInfo.getUrl = GetURLFromRule;
  newInfo.rule = newRule;
  return newInfo;
}

// testMain();

function matchMVRule(url = 'http://10.148.8.228/files_home/znwp/ecmwffine_b/hn/20200225/ecmwffine_hn_mslp_000_2020022512.png', mvRule) {
  const imgInfo = getImgInfoFromURL(url);
  const infoList = [imgInfo.model, imgInfo.region, imgInfo.eleName];
  let matchedRules = [];

  function isMatchCondition(iInfo, rule) {
    let condition = false;
    if (Array.isArray(rule)) {
      condition = rule.includes(iInfo);
    } else if (typeof (rule) === 'string') {
      condition = rule === iInfo;
    } else if (!Boolean(rule)) {// rule === null
      condition = true;
    } else {
      throw new TypeError('无法识别的规则类型：' + item);
    }
    return condition;
  }

  for (let item of mvRule) {
    // console.log(mvRule);
    const fitIndex = item.rule.findIndex(list => {// 查找四个规则中是哪个匹配
      let isMatch = list.every((rule, i) => {
        const iInfo = infoList[i];
        return isMatchCondition(iInfo, rule);
      });
      return isMatch;
    })
    if (fitIndex === -1) {
      continue;
    } else {
      let copyItem = Object.assign({}, item);
      copyItem.fitIndex = fitIndex;
      matchedRules.push(copyItem);
    }
  }
  return matchedRules;
}

function getMVSrcListFromRule(url, ruleItem = { rule: [] }) {
  let imgList = [0, 0, 0, 0];
  const imgInfo = getImgInfoFromURL(url);
  const infoList = [imgInfo.model, imgInfo.region, imgInfo.eleName];
  const rule = ruleItem.rule;
  for (let i = 0; i < rule.length; i++) {// rule.length = 4;
    if (i === ruleItem.fitIndex) {
      imgList[i] = url;
    } else {

      let iRule = rule[i];// ['ncep',['oy','cn','hn','gd',],null],
      let iBaseInfo = iRule.map((ele, j) => {
        if (Array.isArray(ele)) {
          return infoList[j];
        } else if (typeof (ele) === 'string') {
          return ele;
        } else if (!Boolean(ele)) {// rule === null
          return infoList[j];
        } else {
          throw new TypeError('无法识别的规则类型：' + iRule);
        }
      })
      const iImgRule = matchModel2Rule(iBaseInfo[0], iBaseInfo[1], iBaseInfo[2]);
      imgList[i] = iImgRule.getUrl(imgInfo.getTimeInfo());
    }
  }
  return imgList;
}

if(location.href.includes('gisloader')){
  GM_addStyle(`
  .maps-more-image .maps-more-header {
    position: absolute !important;
    font-size: 22px !important;
    z-index: 20;
    background-color: #ededed6e !important;
    color: #1400ff !important;
    text-shadow: #FC0 1px 0 10px;
    left: 5%;
}
#mapMain .maps-more-image .maps-header-info {
    font-size: 20px !important;
}
#mapMain .maps-more-image .map-img {
    top: 49%!important;
    left: 47%!important;
    height: 123%!important;
}
.group-mode-instruction {
    height: auto;
}
.group-mode[data-drop-index="0"] {
    z-index: 10!important;
}
.group-mode[data-drop-index="1"] {
    z-index: 9!important;
}
.group-mode[data-drop-index="2"] {
    z-index: 8;
}
.group-mode[data-drop-index="3"] {
    z-index: 7;
}
.group-mode[data-drop-index="4"] {
    z-index: 6;
}
.group-mode[data-drop-index="5"] {
    z-index: 5;
}
.group-mode[data-drop-index="6"] {
    z-index: 4;
}
.group-mode[data-drop-index="7"] {
    z-index: 3;
}
.group-mode[data-drop-index="8"] {
    z-index: 2;
}
#mapMain .maps-more-image .maps-more-body {
    overflow: hidden;
    height: 100%!important;
}
  `);
}
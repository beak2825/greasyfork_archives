// ==UserScript==
// @name            Arca base64 autodecoder
// @name:ko         아카라이브 Base64 자동 디코더
// @version         1.224
// @author          Laria
// @match           https://arca.live/b/*/*
// @description     auto decode Base64 encoded link in Arca.live
// @description:ko  아카라이브 내 Base64로 인코딩된 링크를 자동으로 복호화합니다.
// @icon            https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @require         https://cdn.jsdelivr.net/npm/sweetalert2@11
// @license         MIT
// @encoding        utf-8
// @run-at          document-end
// @supportURL      https://greasyfork.org/ko/scripts/482577
// @namespace       https://greasyfork.org/users/1235854
// @grant           GM.getValue
// @grant           GM.setValue
// @grant           GM.deleteValue
// @grant           GM.registerMenuCommand
// @grant           GM.unregisterMenuCommand
// @grant           GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/482577/Arca%20base64%20autodecoder.user.js
// @updateURL https://update.greasyfork.org/scripts/482577/Arca%20base64%20autodecoder.meta.js
// ==/UserScript==
/*
 * == Change log ==
 * 1.0 - Release
 * 1.1 - Invalid character update (replace -> replaceAll)
 * 1.11 - Improved show multiple links
 * 1.12 - Show Single links Bugfix
 * 1.13 - Bugfix 1.12
 * 1.14 - Base64 add padding func
 * 1.15 - Add annotation, display improvements
 * 1.16 - Display improved - CSS applied
 * 1.17 - var safe, max_iter defined (~7, def:3)
 * 1.18 - auto update check, log system
 * 1.20 - add menu(base64 depth, user-drag auto decoding, hide encoded link, update notify)
 * 1.201 - base64 depth extends - 11, temporary disable - drag auto decoding
 * 1.202 - improve encoded link click callback, feature block in edit mode, enable drag auto decoding
 * 1.203 - add menu(restore defaults)
 * 1.204 - set update check interval -> 1day(86400), seperate localparameter
 * 1.205 - url chk add(write), code stabilization
 * 1.206 - add menu(expand menu), newline, encoded link copy function, show url hostname
 * 1.207 - show total decoded count on article top, update link fix/improve redirection, update chk interval modify(86400 -> 21600)
 * 1.21 - window alert/confirm -> swal2 gui
 * 1.211 - version fix
 * 1.212 - remove unavailble function
 * 1.213 - show total decoded hostname, improve swal2 ui
 * 1.220 - notice when script updated, improve internal db, improve show encoded link, add show decode summary(and detected site hostname), encoded link show feature discontinued
 * 1.221 - scroll decoded link highlight, code optimization
 * 1.222 - minor bug fix
 * 1.223 - temporary disable update check, notice (update server change)
 * 1.224 - regex pattern update (apply hypen)
*/

/*
 * == TODO ==
 * auto decoding newline/space
 * detect channel => specific decoding
 * show warning message(redirection)
 * // @changelogURL    https://arca.live/
*/

//base64 encoded(http:/*, https:/*) string prefix
const regexEncodedPrefixDef = [
    /(aHR0cDovL|aHR0cHM6Ly)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //encoding 1 time
    /(YUhSMGNEb3ZM|YUhSMGNITTZMe)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //encoding 2 time
    /(WVVoU01HTkViM1pN|WVVoU01HTklUVFpNZ)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //encoding 3 time
    /(V1ZWb1UwMUhUa1ZpTTFwT|V1ZWb1UwMUhUa2xVVkZwTl)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //encoding 4 time
    /(VjFaV2IxVXdNVWhVYTFacFRURndU|VjFaV2IxVXdNVWhVYTJ4VlZrWndUb)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //encoding 5 time
    /(VmpGYVYySXhWWGROVldoVllURmFjRlJVUm5kV|VmpGYVYySXhWWGROVldoVllUSjRWbFpyV25kVW)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //encoding 6 time
    /(Vm1wR1lWWXlTWGhXV0dST1ZsZG9WbGxVUm1GalJsSlZVbTVrV|Vm1wR1lWWXlTWGhXV0dST1ZsZG9WbGxVU2pSV2JGcHlWMjVrVl)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //encoding 7 time
    /(Vm0xd1IxbFdXWGxUV0doWFYwZFNUMVpzWkc5V2JHeFZVbTFHYWxKc1NsWlZiVFZyV|Vm0xd1IxbFdXWGxUV0doWFYwZFNUMVpzWkc5V2JHeFZVMnBTVjJKR2NIbFdNalZyVm)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //encoding 8 time
    /(Vm0weGQxSXhiRmRYV0d4VVYwZG9XRll3WkZOVU1WcHpXa2M1VjJKSGVGWlZiVEZIWVd4S2MxTnNXbFppVkZaeV|Vm0weGQxSXhiRmRYV0d4VVYwZG9XRll3WkZOVU1WcHpXa2M1VjJKSGVGWlZNbkJUVmpKS1IyTkliRmROYWxaeVZt)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //encoding 9 time
    /(Vm0wd2VHUXhTWGhpUm1SWVYwZDRWVll3Wkc5WFJsbDNXa1pPVlUxV2NIcFhhMk0xVmpKS1NHVkdXbFppVkVaSVdWZDRTMk14VG5OWGJGcHBWa1phZ|Vm0wd2VHUXhTWGhpUm1SWVYwZDRWVll3Wkc5WFJsbDNXa1pPVlUxV2NIcFhhMk0xVmpKS1NHVkdXbFpOYmtKVVZtcEtTMUl5VGtsaVJtUk9ZV3hhZVZad)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //encoding 10 time
    /(Vm0wd2QyVkhVWGhUV0docFVtMVNXVll3WkRSV1ZsbDNXa2M1V0ZKc2JETlhhMXBQVmxVeFYyTkljRmhoTWsweFZtcEtTMU5IVmtkWGJGcHBWa1ZhU1ZkV1pEUlRNazE0Vkc1T1dHSkdjSEJXYTFwaF|Vm0wd2QyVkhVWGhUV0docFVtMVNXVll3WkRSV1ZsbDNXa2M1V0ZKc2JETlhhMXBQVmxVeFYyTkljRmhoTWsweFZtcEtTMU5IVmtkWGJGcE9ZbXRLVlZadGNFdFRNVWw1Vkd0c2FWSnRVazlaVjNoaFpWWmFk)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //encoding 11 time
];

//TODO
const regexEncodedPrefixNewline1 = [
    /(Cmh0dHA6L|Cmh0dHBzOi8)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 newline, encoding 1 time
    /(Q21oMGRIQTZM|Q21oMGRIQnpPaT)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 newline, encoding 2 time
    /(UTIxb01HUklRVFpN|aaaa)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 newline, encoding 3 time
    /(VVRJeGIwMUhVa2xSVkZwT|aaaa)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 newline, encoding 4 time
    /(VlZSSmVHSXdNVWhWYTJ4U1ZrWndU|aaaa)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 newline, encoding 5 time
    /(VmxaU1NtVkhTWGROVldoV1lUSjRVMVpyV25kV|aaaa)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 newline, encoding 6 time
    /(Vm14YVUxTnRWa2hUV0dST1ZsZG9WMWxVU2pSVk1WcHlWMjVrV|aaaa)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 newline, encoding 7 time
    /(Vm0xNFlWVXhUblJXYTJoVVYwZFNUMVpzWkc5V01XeFZVMnBTVmsxV2NIbFdNalZyV|aaaa)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 newline, encoding 8 time
    /(Vm0weE5GbFdWWGhVYmxKWFlUSm9WVll3WkZOVU1WcHpXa2M1VjAxWGVGWlZNbkJUVm1zeFYyTkliRmROYWxaeV|aaaa)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 newline, encoding 9 time
    /(Vm0wd2VFNUdiRmRXV0doVllteEtXRmxVU205V1ZsbDNXa1pPVlUxV2NIcFhhMk0xVmpBeFdHVkdXbFpOYmtKVVZtMXplRll5VGtsaVJtUk9ZV3hhZV|aaaa)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 newline, encoding 10 time
    /(Vm0wd2QyVkZOVWRpUm1SWFYwZG9WbGx0ZUV0WFJteFZVMjA1VjFac2JETlhhMXBQVmxVeFYyTkljRmhoTWsweFZtcEJlRmRIVmtkWGJGcE9ZbXRLVlZadE1YcGxSbGw1Vkd0c2FWSnRVazlaVjNoaFpW|aaaa)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 newline, encoding 11 time
];

//TODO
const regexEncodedPrefixNewline2 = [
    /(CgpodHRwOi8|CgpodHRwczov)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 newline, encoding 1 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 newline, encoding 2 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 newline, encoding 3 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 newline, encoding 4 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 newline, encoding 5 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 newline, encoding 6 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 newline, encoding 7 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 newline, encoding 8 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 newline, encoding 9 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 newline, encoding 10 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 newline, encoding 11 time
];

//TODO
const regexEncodedPrefixSpace1 = [
    /(IGh0dHA6L|IGh0dHBzOi8)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 space, encoding 1 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 space, encoding 2 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 space, encoding 3 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 space, encoding 4 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 space, encoding 5 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 space, encoding 6 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 space, encoding 7 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 space, encoding 8 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 space, encoding 9 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 space, encoding 10 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 1 space, encoding 11 time
];

//TODO
const regexEncodedPrefixSpace2 = [
    /(ICBodHRwOi8|ICBodHRwczov)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 space, encoding 1 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 space, encoding 2 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 space, encoding 3 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 space, encoding 4 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 space, encoding 5 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 space, encoding 6 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 space, encoding 7 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 space, encoding 8 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 space, encoding 9 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 space, encoding 10 time
    /(|)(\w|\-|=|\+|\/)*(?=[^\+=\w\/])/g, //with 2 space, encoding 11 time
];


//internal db v2
let abadInternalDB = {
  prototype01: {
    encodedLink: {
      abad_123456:{
        type: 'article',
        raw: 'aHR0cHM6Ly...',
        isEnabled: false, //click to true
      },
    },
    decodedLink: {
      abad_456789: {
        no: 1,
        type: 'article', //article, comment
        hostname: 'arca.live',
        title: 'first link',
        href: 'https://base64decode.org',
        srcid: 'abad_123456', //encoded
      },
    },
  },
  encodedLink: {},
  decodedLink: {},
  decodedList: [], //stack, increment

  hostnameSetRaw: new Set(), //decoded link domain hostname set (non duplicate), raw data, type:set
  hostnameSet: [], //decoded link domain hostname set (non duplicate), sorted
  internalDB: {
    //auto decoding maximum
    autoDecodingMaximum:Math.min(regexEncodedPrefixDef.length, regexEncodedPrefixNewline1.length, regexEncodedPrefixNewline2.length, regexEncodedPrefixSpace1.length, regexEncodedPrefixSpace2.length),
    //total decode count
    totlaDecodedCount:0,//TODO
    //auto drag decoding enabled
    dragDecodingEnable:false,
    //SWAL2 enabled
    swal2Enable:false,
  },
  externalDB: { //GM
    decodeDeniedChannel:[],//proto

  },
};

const abadConstDB = {
  regInvalid: /[^\w\+\/=]/, //regex prefix - drag
  updateInterval: 21600, //update check interval (sec, def:1 day(86400))

  //logging prefix
  logPrompt: {
    default: '['+GM.info.script.name+']',
    decodeManager: '['+GM.info.script.name+'-DEC]',
    updateManager: '['+GM.info.script.name+'-UPD]',
    paramManager: '['+GM.info.script.name+'-PAR]',
  },
  SWAL2Title: `<span style="font-size: 82.5%;">${('name:ko' in GM.info.script)?GM.info.script['name:ko']:GM.info.script.name}</span><i style="font-size: 40%;"> V ${GM.info.script.version} ${(GM.info.script.buildmode != undefined && GM.info.script.buildmode != '')?GM.info.script.buildmode:''}</i>`,
};
//`

//update chk, fail->false
let updateAvailble = true;

//total decode count
let hindex = 0;

//drag function comparison
let lastSelected = document;
let lastSelectedTime = Date.now();

//script local parameter
let localParameter = {
  'prevversion': {
    'param_name': 'prevversion',
    'value': -1.0,
    'def_value': -1.0,
  },
  'lastupdate': {
    'param_name': 'lastupdate',
    'value': 0,
    'def_value': 0,
  },
  'basedepth': {
    'param_name': 'basedepth',
    'value': 3,
    'def_value': 3,
  },
  'enclinkhide': { //func discontinued, reset default
    'param_name': 'enclinkhide',
    'value': false,
    'def_value': false,
  },
  'draggable': {
    'param_name': 'draggable',
    'value': false,
    'def_value': false,
  },
  'updatechk': {
    'param_name': 'chkupd',
    'value': true,
    'def_value': true,
  },
  'updatenoti': {
    'param_name': 'updatenoti',
    'value': true,
    'def_value': false, //temporary TODO
  },
  'extlinkwarn': {
    'param_name': 'extlinkwarn',
    'value': true,
    'def_value': true,
  },
  'deniedchannel': {
    'param_name': 'deniedchannel',
    'value': [],
    'def_value': [],
  },
  'expandmenu': {
    'param_name': 'expandmenu',
    'value': true,
    'def_value': true,
  },
};

//script menu structure
let menuStructure = {
  'basedepth': {
    'param_name': localParameter.basedepth,
    'name': '🎛 base64 깊이 조절하기 - 현재 값 : 알수없음',
    'desc': '자동 base64 디코딩 깊이를 조절할 수 있습니다.',
    'id': -1,
    'func': menuFunctionBasedepth,
    'visible': true,
  },
  'enclinkhide': {
    'param_name': localParameter.enclinkhide,
    'name': '🔗 인코딩된 링크 [보이기/숨기기]',
    'desc': '자동 base64 디코딩 전 인코딩된 링크를 항상 보이게 할지 설정할 수 있습니다.',
    'id': -1,
    'func': menuFunctionEnchide,
    'visible': false, //discontinued since 1.220
  },
  'extlinkwarn': {
    'param_name': localParameter.extlinkwarn,
    'name': '❔ TODO:❗️ 외부 링크 경고 [보이기/숨기기]',
    'desc': '디코딩된 링크 클릭 시 외부링크에 대한 경고 메시지 표시 여부를 설정할 수 있습니다.',
    'id': -1,
    'func': menuFunctionNotAvailable,
    'visible': false, //TODO
  },
  'draggable': {
    'param_name': localParameter.draggable,
    'name': '🖱 드래그 시 자동 디코딩 [켜기/끄기]',
    'desc': '드래그 시 자동으로 드래그한 부분을 base64로 디코딩할지 설정할 수 있습니다.',
    'id': -1,
    'func': menuFunctionDraggable,
    'visible': true,
  },
  'deniedchannel': {
    'param_name': localParameter.deniedchannel,
    'name': '❔ TODO:🏷 이 채널에서 자동 디코딩 [끄기/켜기]',
    'desc': '현재 보고있는 채널에서 자동 디코딩 기능 여부를 설정할 수 있습니다.',
    'id': -1,
    'func': menuFunctionNotAvailable,
    'visible': false, //TODO
  },
  'updatechk': {
    'param_name': localParameter.updatechk,
    'name': '🔄 업데이트 알림 [켜기/끄기]',
    'desc': '새 버전이 나올 시 업데이트 확인 알림을 띄울지 여부를 설정할 수 있습니다.',
    'id': -1,
    'func': menuFunctionUpdateCheck,
    'visible': false,
  },
  'updatenoti': {
    'param_name': localParameter.updatenoti,
    'name': '✅ 업데이트 완료 알림 [켜기/끄기]',
    'desc': '업데이트 완료되었을 때 알림을 띄울지 여부를 설정할 수 있습니다.',
    'id': -1,
    'func': menuFunctionUpdateNotice,
    'visible': false,
  },
  'checkupd': {
    'param_name': null,
    'name': '❔ TODO:🔃 업데이트 확인',
    'desc': '본 스크립트의 업데이트를 확인합니다.',
    'id': -1,
    'func': menuFunctionCheckUpdate,
    'visible': false, //TODO
  },
  'resetdefaults': {
    'param_name': null,
    'name': '🛠 스크립트 기본값 초기화',
    'desc': '스크립트의 사용자 설정을 초기화하고 설치 상태로 되돌립니다.',
    'id': -1,
    'func': menuFunctionRstDefaults,
    'visible': true,
  },

  //proto
  'prototype': {
    'param_name': null, //if visible is false -> parameter use deafults
    'name': '🔤 확장패널 메뉴 제목', //extension menu pannel elem button title
    'desc': '확장패널 설명 내용.', //description
    'id': -1, //managed by extension
    'func': menuFunctionNotAvailable, //click event function
    'visible': false, //extension menu pannel visible
  },
  //default
  'expandmenu': {
    'param_name': localParameter.expandmenu,
    'name': '⚙️ 스크립트 메뉴 [축소/확장]',
    'desc': '스크립트 설정 메뉴를 확장하거나 축소할 수 있습니다.',
    'id': -1,
    'func': menuFunctionChangeExpandMode,
    'visible': true,
  },
};


/*
 * https://stackoverflow.com/questions/4386300
 * addListener(div, 'click', eventReturner(), false)
 * // and later
 * removeAllListeners(div, 'click')
*/

let _eventHandlers = {}; // somewhere global

const addListener = (node, event, handler, capture = false) => {
  if (!(event in _eventHandlers)) {
   _eventHandlers[event] = [];
  }
  // here we track the events and their nodes (note that we cannot
  // use node as Object keys, as they'd get coerced into a string
  _eventHandlers[event].push({ node: node, handler: handler, capture: capture });
  node.addEventListener(event, handler, capture);
};

const removeAllListeners = (targetNode, event) => {
  // remove listeners from the matching nodes
  _eventHandlers[event]
    .filter(({ node }) => node === targetNode)
    .forEach(({ node, handler, capture }) => node.removeEventListener(event, handler, capture));

  // update _eventHandlers global
  _eventHandlers[event] = _eventHandlers[event].filter(
    ({ node }) => node !== targetNode,
  );
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function getLocation(href) {
  var match = href.toString().match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
  return match && {
    href: href,
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7]
  };
}

//element id - random uuid
function createElemID() {
  return 'abad_'+self.crypto.randomUUID();
}

//auto add padding - add '=' padding in base64 encoded string
function base64AddPadding(str) {
    return str + Array((4 - str.length % 4) % 4 + 1).join('=');
}

//base64 decode
const Base64 = {
  _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  decode : function (input) {
    let output = "";
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      enc1 = this._keyStr.indexOf(input.charAt(i++));
      enc2 = this._keyStr.indexOf(input.charAt(i++));
      enc3 = this._keyStr.indexOf(input.charAt(i++));
      enc4 = this._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      //last bits
      output = output + String.fromCharCode(chr1);
      if (enc3 != 64) { //=
        output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) { //==
        output = output + String.fromCharCode(chr3);
      }
    }

    output = Base64._utf8_decode(output);
    return output;
  },
  // private method for UTF-8 decoding
  _utf8_decode : function (utftext) {
    let string = "";
    let i = 0;
    let c = 0;
    let c1 = 0;
    let c2 = 0;
    let c3 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);
      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      }
      else if ((c > 191) && (c < 224)) {
        c2 = utftext.charCodeAt(i+1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      }
      else {
        c2 = utftext.charCodeAt(i+1);
        c3 = utftext.charCodeAt(i+2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }
    return string;
  }
};

//scroll(vertical) to elem(id)
const scrollToTarget = function(id_tmp, target) {
  window.console.log(abadConstDB.logPrompt.default,'scroll to -', id_tmp);
  const targetElem = document.getElementById(id_tmp);
  if (abadInternalDB.internalDB.swal2Enable) {
    Swal.close();
    Swal.fire({
      icon: 'success',
      title: abadConstDB.SWAL2Title,
      html: `<b style="font-size: 82.5%;">${(target==undefined)?'해당':target} 위치로 이동했습니다.</b>`,
      footer: `<i style="font-size: 76.5%;">해당 요소가 보이지 않는다면 접기 되어있는 부분을 펼쳐주세요.</i>`,
      toast: true,
      position: 'top-end',
      timer: 3500,
      timerProgressBar: true,
      confirmButtonText: '확인',
    });
  } else {
    window.alert(abadConstDB.logPrompt.default+'\n해당 위치로 이동했습니다.\n(해당 요소가 보이지 않는다면 접기 되어있는 부분을 펼쳐주세요.)');
  }

  //highlight color
  targetElem.style.background = '#06ff004f';
  //scroll to elem, viewport center
  window.scrollTo({top:window.pageYOffset + targetElem.getBoundingClientRect().top - (window.innerHeight / 2), behavior:'smooth'});

  //restore style
  sleep(2750).then(() => {
    targetElem.style.background = null;
    targetElem.style.transition = "all 1s";
    sleep(750).then(() => {
      targetElem.style.transition = null;
    });
  });
};

function copyToClipboard(target, cont) {
  let msgHeader = '';
  if (cont != undefined) msgHeader = `${cont}이(가) `;
  if (target == undefined) {
    window.console.warn(abadConstDB.logPrompt.default, 'Error, copy target is not exist');
    if (abadInternalDB.internalDB.swal2Enable) {
      Swal.fire({
        title: abadConstDB.SWAL2Title,
        html: `<b>경고! 복사 대상이 존재하지 않습니다.</b><br><br><i>브라우저 로그를 확인해주세요..</i>`,
        icon: 'error',
        confirmButtonText: '확인',
      });
    } else {
      window.alert(abadConstDB.logPrompt.default+'\n경고! 복사 대상이 존재하지 않습니다.');
    }
  } else {
    try {
      GM.setClipboard(target);
      if (abadInternalDB.internalDB.swal2Enable) {
        window.console.log(abadConstDB.logPrompt.default,'show copy modal');
        let timerInterval;
        Swal.fire({
          title: abadConstDB.SWAL2Title,
          html: `<b>${msgHeader}클립보드로 복사되었습니다.</b><br><div style="margin-top: 15; text-align:left; font-size:72.5%">또는 아래 코드를 복사:<div style="overflow-y:auto; overflow-wrap: anywhere; margin: 5 0 5; width:100%; height:150px; background-color: #e6e6e6;">${target}</div></div>`,
          confirmButtonText: '확인',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
          footer: `<span id="footer" style="font-size: 82.5%;">&nbsp;</span>`,
          didOpen: (modal) => {
            let autoClose = true;
            modal.onmouseenter = (event) => {
              autoClose = false;
              Swal.stopTimer();
              modal.querySelector("#footer").innerHTML = `<i style="font-size: 82.5%;">창에서 마우스를 떼면 일정시간 후 자동으로 닫힙니다.</i>`;
            };
            modal.onmouseleave = (event) => {
              autoClose = true;
              Swal.resumeTimer();
            };
            timerInterval = setInterval(() => {
              if(autoClose) {
                modal.querySelector("#footer").innerHTML = `<i style="font-size: 82.5%;">약 ${(isNaN(Math.floor(Swal.getTimerLeft()/1000))?'0':Math.floor(Swal.getTimerLeft()/1000))}초 후 창이 자동으로 닫힙니다.</i>`;
              }
            }, 100);
          },
          willClose: (modal) => {
            clearInterval(timerInterval);
            window.console.log(abadConstDB.logPrompt.default,'close copy modal');
          },
        });
      } else {
        window.alert(abadConstDB.logPrompt.default+'\n'+msgHeader+'클립보드로 복사되었습니다.');
      }
    } catch (e) {
      window.console.warn(abadConstDB.logPrompt.decodeManager, 'error occured link copy:', e);
      if (abadInternalDB.internalDB.swal2Enable) {
        Swal.fire({
          title: abadConstDB.SWAL2Title,
          html: `<b>${cont} 복사 실패</b><br><br><i>수동으로 복사해주세요..</i>`,
          icon: 'error',
          confirmButtonText: '확인',
        });
      } else {
        window.alert(abadConstDB.logPrompt.default+'\n'+cont+' 복사 실패.');
      }
    }
  }
}

//encoded link click callback
function showEncodedLink(event) {
  const self = event.currentTarget;
  //check exist
  if (abadInternalDB.encodedLink.hasOwnProperty(self.id)) {
    const rawLink = abadInternalDB.encodedLink[self.id].raw;
    if (!abadInternalDB.encodedLink[self.id].isEnabled) {
      window.console.log(abadConstDB.logPrompt.decodeManager, 'show encoded link -', abadInternalDB.encodedLink[self.id].raw);
      self.innerHTML = rawLink;
      self.style.color = '#4758bc';
      self.title = '디코딩 전 인코딩된 링크입니다, 클릭 시 내용이 복사됩니다.';
      abadInternalDB.encodedLink[self.id].isEnabled = true;
    } else {
      window.console.log(abadConstDB.logPrompt.default, 'copy link to clipboard -', rawLink);
      copyToClipboard(rawLink, '인코딩된 코드');
    }
  } else {
    window.console.warn(abadConstDB.logPrompt.decodeManager, 'cannot find property(enc_link) :', self.id);
    if (abadInternalDB.internalDB.swal2Enable) {
      Swal.fire({
        title: abadConstDB.SWAL2Title,
        html: `<b>원본 링크를 찾을 수 없습니다..</b>`,
        footer: `<span style="font-size: 77.5%;">ID: ${self.id}</span>`,
        icon: 'error',
        timer: 2000,
        timerProgressBar: true,
        confirmButtonText: '확인',
      });
    } else {
      window.alert(abadConstDB.logPrompt.default+'\n원본 링크를 찾을 수 없습니다..');
    }
  }
  return;
}

//show decoding summary (click callback)
function showDecodeSummary(event) {
  if (abadInternalDB.internalDB.swal2Enable) {
    //event callback list
    let eventCallbackList = [];
    //decoded list wrapper
    const decodedLinkListWrapper = createElemID();

    //remove decoded list event
    const removeEvent = function() {
      while (eventCallbackList.length > 0) {
        try {
          removeAllListeners(document.querySelector('#'+eventCallbackList.pop()), 'click');
        } catch (_) {}
      }
    };
    //show detected site list modal
    const openDetectedSiteList = function(event) {
      removeEvent();
      window.console.log(abadConstDB.logPrompt.default,'open detected site list modal');
      this.removeEventListener('click', openDetectedSiteList);
      Swal.fire({
        title: abadConstDB.SWAL2Title,
        html: `<div style="text-align:left;"><strong>== 현재 페이지에서 감지된 사이트 목록 ==</strong><div id="dsList" style="margin: 15 0 10; overflow:auto; width:100%; height:250px; background-color: #e6e6e6;">불러오는중...</div></div><div id="dsCount" style="font-size: 60%; text-align:right;">로딩이 끝나지 않는다면 브라우저 로그를 확인해주세요.</div>`,
        confirmButtonText: '닫기',
        didOpen: (modal) => {
          Swal.showLoading();
          sleep(50).then(() => {
            modal.querySelector('#dsList').innerHTML = '';
            abadInternalDB.hostnameSet.forEach(function(tar) {
              const dsCont = document.createElement("p");
              dsCont.style.margin = 0;
              dsCont.innerText = '- ';
              dsCont.style.whiteSpace = 'nowrap';
              const dsLink = document.createElement("a");
              //dsLink.href = tar; //TODO: add protocol(https)
              //dsLink.title = tar.concat(' (새 창으로 열기)');
              dsLink.rel = "external nofollow noopener noreferrer";
              dsLink.target = "_blank";
              dsLink.innerText = tar;
              dsCont.appendChild(dsLink);
              modal.querySelector('#dsList').appendChild(dsCont);
            });
            modal.querySelector('#dsCount').innerHTML = `<i>총 ${abadInternalDB.hostnameSet.length}개</i>&nbsp;`;
            Swal.hideLoading();
          });
        },
      });
    };

    //show modal
    Swal.fire({
      title: abadConstDB.SWAL2Title, //<a id="${eventCaller}">aaa</a>
      html: `<b>이 페이지에서 디코딩된 링크 <span id="sdsdectype" style="font-size: 72.5%;">( 로드중.. )</span></b><br><div style="margin-top: 15; text-align:left; font-size:72.5%"><b>디코딩된 링크 목록:</b><div id="${decodedLinkListWrapper}" style="overflow: auto; margin: 10 0 10; width:100%; height:250px; background-color: #e6e6e6;">불러오는중...</div></div><div style="font-size: 60%; text-align:right;"><i>각 링크 클릭 시 새로운 창에 열립니다.</i>&nbsp;</div>`,
      confirmButtonText: '닫기',
      footer: `<b id="footer">로딩중..</b>`,
      didOpen: (modal) => {
        window.console.log(abadConstDB.logPrompt.default,'open declink list modal');
        Swal.showLoading();
        let elemArticleCnt = 0;
        let elemCommentCnt = 0;

        sleep(100).then(() => {
          //remove all
          modal.querySelector('#'+decodedLinkListWrapper).innerHTML = '';
          let contWrapper = document.createElement("span");
          Object.keys(abadInternalDB.decodedLink).forEach(function(targetRaw) {
            //target elem
            const target = abadInternalDB.decodedLink[targetRaw];
            //each elem
            let cont = document.createElement("p");
            cont.style.marginBottom = '0.3rem';
            cont.style.whiteSpace = 'nowrap';
            //cont.style.marginBottom = '0.5rem';
            //scroll to elem
            const elemGotoLocation = document.createElement("a");
            elemGotoLocation.id = createElemID();
            elemGotoLocation.innerHTML = `[<u>클릭 시 해당 위치로 이동</u>]`;
            elemGotoLocation.title = "클릭 시 이 페이지에서 해당 링크가 있는 위치로 이동합니다.";
            elemGotoLocation.href = "javascript:void(0);";

            //get type
            let elemType = {'show':'❔', 'desc':'알수없음'};
            if (target.type == 'article') {
              elemArticleCnt++;
              elemType = {'show':'📑', 'desc':'게시글'};
            } else if (target.type == 'comment') {
              elemCommentCnt++;
              elemType = {'show':'💬', 'desc':'댓글'};
            }

            //cont with loc
            const contLink = document.createElement("a");
            contLink.href = target.href;
            contLink.title = target.title+' ('+elemType.desc+') (새 창으로 열기)';
            contLink.rel = "external nofollow noopener noreferrer";
            contLink.target = "_blank";
            contLink.innerHTML = `&gt; ${target.no}번째 링크(${elemType.show}) (${target.hostname})`;

            //append link elem
            cont.appendChild(contLink);
            cont.appendChild(document.createTextNode(" - "));
            //append scroll elem
            cont.appendChild(elemGotoLocation);
            //append decoded list wrapper
            modal.querySelector('#'+decodedLinkListWrapper).appendChild(cont);

            const seprator = document.createElement("div");
            seprator.style.marginTop = '0.1rem';
            seprator.style.marginBottom = '0.1rem';
            seprator.style.borderTop = '2px solid #b8b8b885';
            modal.querySelector('#'+decodedLinkListWrapper).appendChild(seprator);

            //register event id
            eventCallbackList.push(elemGotoLocation.id);
            const eventWrapper = function(event) {
              //remove all
              removeEvent();
              //goto element
              scrollToTarget(target.id, `${target.no}번째 링크(${elemType.show})`);
            };
            //attach event - scroll to each elem
            addListener(elemGotoLocation, 'click', eventWrapper);
          });
          modal.querySelector('#sdsdectype').innerText = '( '+((elemArticleCnt>0)?('게시글'+((elemCommentCnt>0)?' 또는 ':'')):'')+((elemCommentCnt>0)?'댓글':'')+' )';

          //attach event - get detected site list
          const modalFooter = modal.querySelector('#footer');
          modalFooter.innerHTML = `<a style="font-size: 97.5%;" href="javascript:void(0);" title="클릭 시 현재 페이지에서 감지된 사이트 목록을 표시합니다.">감지된 사이트 목록 표시 (클릭)</a>`;
          modalFooter.addEventListener('click', openDetectedSiteList);
          //load finish
          Swal.hideLoading();
        });
      },
      willClose: (modal) => {
        //dettach all event
        modal.querySelector('#footer').removeEventListener('click', openDetectedSiteList);
        removeEvent();
        window.console.log(abadConstDB.logPrompt.default,'close declink list modal');
      },
    });
  } else {
    window.alert(abadConstDB.logPrompt.default+'\n(SWAL2가 비활성화 되어있어 감지된 사이트 목록만 표시합니다.)\n== 감지된 사이트 목록 ('+abadInternalDB.hostnameSet.length+'개)\n- '+abadInternalDB.hostnameSet.join('\n- '));
  }
}

//link area
function createEncodedLink(src) {
  return `<span style="font-size: 87.5%;color: #47bc73 !important;">[ ${src.toString()} ]</span>`;
}

//encoded link element
function createMaskEncodedLink(src, genMode, uuid) {
  abadInternalDB.encodedLink[uuid] = {
    type: genMode,
    raw: src,
    isShown: false,
  };
  return `<a id="${uuid}" title="클릭 시 디코딩 전 인코딩된 링크를 표시합니다." href="javascript:void(0);">클릭 시 인코딩된 코드 보기</a>`;
}

//link creation
function createLink(src, index, url, depth, genMode, uuid, parentuuid, hidelink = false) {
  //n번째 링크 (base64 깊이: 0) [ ABCDEF= / 클릭시 원본~ ]
  abadInternalDB.hostnameSetRaw.add(url.hostname);
  return `<a id="${uuid}" href="${url.href}" title="${url.href} (새 창으로 열기)" target="_blank" rel="external nofollow noopener noreferrer">${index.toString()}번째 링크 (base64 깊이: ${depth.toString()}) <span style="font-size: 77.5%;">(${url.hostname})</span></a> ${(hidelink?createEncodedLink(createMaskEncodedLink(src, genMode, parentuuid)):createEncodedLink(src))}`;
}

//decode & generate
function replacerGen(numIter, genMode) {
  return function(source) {
    try {
      let rstring = ""; //return msg
      window.console.log('\n'+abadConstDB.logPrompt.decodeManager,'No.',(hindex+1),'encoded link:\n', source.toString()); //source

      //decode
      let converted = Base64.decode(base64AddPadding(source));
      //attempt to decode nested base64 encoded string
      for (let i=0; i<numIter; i++) {
          converted = Base64.decode(base64AddPadding(converted));
      }
      hindex++;

      //remove invalid string - �
      converted = decodeURI(encodeURI(converted).replaceAll('%00', ''));
      window.console.log(abadConstDB.logPrompt.decodeManager,'No.',hindex,'decode completed (depth:',numIter+1,'):\n',converted.toString()); //converted

      //trim
      converted = converted.trim();

      //split by new line
      converted = converted.split(/\r?\n/);

      const registerDecodedLink = function(_target, _uuid, _parentuuid) {
        abadInternalDB.decodedLink[_uuid] = {
          id: _uuid,
          no: hindex,
          type: genMode,
          hostname: _target.hostname,
          title: _target.href+' (base 깊이: '+(numIter+1).toString()+')',
          href: _target.href,
          srcid: _parentuuid,
        };
        abadInternalDB.decodedList.push(_uuid);
      };

      if (converted.length == 2 && converted[converted.length-1] == '') {
        //single component
        const uuid = createElemID();
        const parentuuid = createElemID();
        const url_t = getLocation(converted[0]);
        registerDecodedLink(url_t, uuid, parentuuid);
        rstring += createLink(source, hindex, url_t, numIter+1, genMode, uuid, parentuuid, !localParameter.enclinkhide.value);
      } else if (converted.length > 1) {
        //multiple component
        const parentuuid = createElemID();
        rstring += createEncodedLink(localParameter.enclinkhide.value?source.toString():createMaskEncodedLink(source.toString(), genMode, parentuuid));

        let nindex = 1;
        const hindexPrev = hindex;
        converted.forEach(function(i) {
          if (i != '') {
            const uuid = createElemID();
            const url_t = getLocation(i);
            registerDecodedLink(url_t, uuid, parentuuid);
            rstring += `<br><span style="margin-left:2px;">└ </span>${createLink(`<span style="color: #47bc73;" title="자동으로 분할된 ${nindex.toString()}번째 링크입니다.">링크 자동 분할 : ${nindex.toString()}번째</span>`, hindex, url_t, numIter+1, genMode, uuid, parentuuid)}`;
            hindex++;
            nindex++;
          }
        });
        //apply last components
        hindex--;
        nindex--;

        window.console.log(abadConstDB.logPrompt.decodeManager,'No.',hindexPrev,'- splitted total :', nindex);
        rstring = `<span style="color: #e83e8c;"><b><i>분할된 링크 총 ${nindex.toString()}개</i></b></span> ${rstring}`;
      } else {
        const uuid = createElemID();
        const parentuuid = createElemID();
        const url_t = getLocation(converted);
        registerDecodedLink(url_t, uuid, parentuuid);
        rstring += createLink(source, hindex, url_t, numIter+1, genMode, uuid, parentuuid, !localParameter.enclinkhide.value);
      }
      return rstring;
    } catch(e) {
      window.console.warn('\n'+abadConstDB.logPrompt.decodeManager,'error occured during decoding:', e);
      window.console.warn(abadConstDB.logPrompt.decodeManager,'base64 decode fail:', source);
    }
    return `<span style="color: #ff0000;" title="base64 디코딩 중 오류가 발생했습니다. 자세한 내용은 브라우저 로그를 확인해주세요..">[ base64 변환 실패: ${source.toString()}]</span>`;
  };
}

//user drag event
function selClicked(event) {
  const sel = document.getSelection().toString();
  if (!sel.match(abadConstDB.regInvalid) && sel.length >= 10 && lastSelectedTime + 200 < Date.now()) {
    try {
      window.console.log(abadConstDB.logPrompt.decodeManager,'live match -',sel.toString());
      let converted = decodeURI(encodeURI(Base64.decode(base64AddPadding(sel))).replaceAll('%00', ''));
      window.console.log(abadConstDB.logPrompt.decodeManager,'converted -',converted.toString());
      this.innerHTML = `<span style="color: green;" title="드래그 하여 디코딩 된 결과입니다.">${this.innerHTML.replace(sel, converted)}</span>`;
    } catch (e) {
      return;
    } finally {
      this.removeEventListener('click', selClicked);
    }
  }
}

//user drag activate
function activateDragDecoding() {
  if (abadInternalDB.internalDB.dragDecodingEnable) {
    window.console.log(abadConstDB.logPrompt.default,'USR-Drag already enabled.');
    return;
  }
  abadInternalDB.internalDB.dragDecodingEnable = true;
  window.console.log(abadConstDB.logPrompt.default,'USR-Drag enabled.');
  document.addEventListener('selectionchange', function() {
    let sel = document.getSelection().anchorNode;
    if (sel) {
      sel = sel.parentElement;
      if (sel != lastSelected) {
        lastSelected.removeEventListener('click', selClicked);
        sel.addEventListener('click', selClicked);
        lastSelected = sel;
        lastSelectedTime = Date.now();
      }
    }
  });
}

//use only swal2
function showSWAL2ErrorLog(reason, err) {
  if (abadInternalDB.internalDB.swal2Enable) {
    Swal.fire({
      title: abadConstDB.SWAL2Title,
      didOpen: () => {
        Swal.hideLoading();
      },
      html: `<b>경고! ${reason} 도중<br>문제가 발생했습니다.</b><br><br><i>아래 로그를 참고해주세요..</i>`,
      footer: `<div style="text-align:left;">브라우저 에러 로그:</div><div style="text-align:left; margin: 5 0 5; overflow:auto; width:100%; height:150px; background-color: #e6e6e6;">${err}</div>`,
      icon: 'error',
      confirmButtonText: '닫기',
    });
  } else {
    window.alert(abadConstDB.logPrompt.default+'\n경고! SWAL2가 활성화되지 않았습니다..\ntype:err');
  }
}

//update check
function checkForUpdate() {
  const cur_version = parseFloat(GM.info.script.version);
  const prev_version = parseFloat(localParameter.prevversion.value);

  //new version detect
  if (cur_version > prev_version) {
    if (prev_version == -1) {
      //previous version is lost
      window.console.warn(abadConstDB.logPrompt.updateManager,'previous version not detected.');
      window.console.log(abadConstDB.logPrompt.paramManager,'save script version:', cur_version);
      try {
        GM.setValue(localParameter.prevversion.param_name, cur_version);
      } catch(e) {
        window.console.error(abadConstDB.logPrompt.paramManager,'previous script verson saving failed -', e);
      }
    } else {
      window.console.log(abadConstDB.logPrompt.updateManager,'script update detected', prev_version, '->', cur_version);
      try {
        GM.setValue(localParameter.prevversion.param_name, cur_version);
      } catch(e) {
        window.console.error(abadConstDB.logPrompt.paramManager,'previous script verson saving failed -', e);
      }
      if (localParameter.updatenoti.value) {
        if (abadInternalDB.internalDB.swal2Enable) {
          Swal.fire({
            title: abadConstDB.SWAL2Title,
            html: `<b>스크립트가 업데이트 되었습니다.</b><br><br><i style="font-size: 82.5%;">이전버전 : V ${prev_version}<br>현재버전 : V ${cur_version}</i><br><br><strong><span style="font-size: 92.5%;">체인지로그: ${(GM.info.script.changelogURL != undefined && GM.info.script.changelogURL!='')?'<a style="color: #e83e8c;" href="'+GM.info.script.changelogURL+'" title="클릭 시 체인지로그 게시글로 이동합니다." target="_blank" rel="external nofollow noopener noreferrer">(클릭)</a>':'<i title="게시글 링크가 준비되지 않았습니다..">(게시글 준비중)</i>'}</span></strong>`,
            icon: 'success',
            toast: true,
            confirmButtonText: '확인',
            position: "top-end",
            input: "checkbox",
            inputValue: 0,
            inputPlaceholder: `<span style="font-size: 92.5%;">업데이트 알림 다시보지 않기</span>`,
            timer: 10000,
            timerProgressBar: true,
            didOpen: (modal) => {
              modal.onmouseenter = Swal.stopTimer;
              modal.onmouseleave = Swal.resumeTimer;
            },
          }).then((result) => {
            if (result.value == 1) {
              window.console.log(abadConstDB.logPrompt.paramManager,'updatenoti change',true.toString(),'to',false.toString());
              try {
                GM.setValue(localParameter.updatenoti.param_name, false);
                localParameter.updatenoti.value = false;
                window.console.log(abadConstDB.logPrompt.paramManager,"updatenoti change successful");
                menuStructureUpdate();
                Swal.fire({
                  title: abadConstDB.SWAL2Title,
                  html: `<b style="font-size: 82.5%;">앞으로 업데이트 알림을 띄우지 않습니다.</b><br><br><i style="font-size: 77.5%;">※ <u>설정</u>에서 변경할 수 있습니다.</i>`,
                  icon: 'success',
                  toast: true,
                  confirmButtonText: '확인',
                  position: "top-end",
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: (modal) => {
                    modal.onmouseenter = Swal.stopTimer;
                    modal.onmouseleave = Swal.resumeTimer;
                  },
                });
              } catch(e) {
                localParameter.updatenoti.value = true;
                window.console.error(abadConstDB.logPrompt.paramManager,"updatenoti change fail -", e);
                showSWAL2ErrorLog('파라미터 변경', e);
              }
            }
          });
        } else {
          //TODO:window alert
        }
      }
    }
  }

  if (!updateAvailble || !localParameter.updatechk.value) {
    window.console.log(abadConstDB.logPrompt.updateManager,'updchk skipped.');
    return;
  }
  const currentTime = Math.floor(new Date().getTime() / 1000);
  if (currentTime - localParameter.lastupdate.value < abadConstDB.updateInterval) {
    window.console.log(abadConstDB.logPrompt.updateManager,'updchk already done in '+abadConstDB.updateInterval+' sec.. skip updchk');
    return;
  }
  try {
    GM.setValue(localParameter.lastupdate.param_name, currentTime);
  } catch(e) {
    window.console.error(abadConstDB.logPrompt.updateManager,'last upd time write fail -', e);
    return;
  }

  window.console.log(abadConstDB.logPrompt.updateManager,'checking for update...');

  const svrMetadataLink = (GM.info.script.updateURL != undefined)?GM.info.script.updateURL:'https://update.greasyfork.org/scripts/482577/Arca%20base64%20autodecoder.meta.js';
  const scriptLink = (GM.info.script.downloadURL != undefined)?GM.info.script.downloadURL:'https://greasyfork.org/ko/scripts/482577';
  fetch(svrMetadataLink)
  .then(response => response.text())
  .then(data => {
    //extract version from greaskyfork script
    const match = data.match(/@version\s+(\d+\.\d+)/);
    if (match) {
      const tar_version = parseFloat(match[1]);

      const openUpdateLink = () => {
        window.console.log(abadConstDB.logPrompt.updateManager,'opening source url..');
        if(window.open(scriptLink) == null) {
          window.console.log(abadConstDB.logPrompt.updateManager,'popup block detected..');
          if (abadInternalDB.internalDB.swal2Enable) {
            Swal.fire({
              title: abadConstDB.SWAL2Title,
              html: `<b>팝업 차단</b>이 설정된 것으로 보입니다.<br>차단을 해제해주세요..`,
              icon: 'warning',
              timer: 15000,
              timerProgressBar: true,
              toast: true,
              confirmButtonText: '확인',
            });
          } else {
            window.alert(abadConstDB.logPrompt.default+'\n팝업 차단이 설정된 것으로 보입니다, 차단을 해제해주세요..');
          }
        } else {
          if (abadInternalDB.internalDB.swal2Enable) {
            Swal.fire({
              title: abadConstDB.SWAL2Title,
              html: `<i style="font-size: 82.5%;">업데이트 후 새로고침해야 적용됩니다.</i>`,
              icon: 'info',
              timer: 15000,
              timerProgressBar: true,
              toast: true,
              confirmButtonText: '확인',
            });
          } else {
            window.alert(abadConstDB.logPrompt.default+'\n업데이트 후 새로고침해야 적용됩니다.');
          }
        }
      };

      //new version detected
      if (tar_version > cur_version) {
        window.console.log(abadConstDB.logPrompt.updateManager,'new version available. ('+cur_version+' -> '+tar_version+')');
        let timerInterval;
        if (abadInternalDB.internalDB.swal2Enable) {
            //y/n dialog
            Swal.fire({
              title: abadConstDB.SWAL2Title,
              html: `<strong>새로운 버전이 감지되었습니다. 업데이트를 권장합니다.</strong><br>( 기존버전 : ${cur_version}, 새로운 버전 : ${tar_version} )<br>(변경사항은 아카라이브 게시글을 참고해주세요.)<br><br><i style="font-size: 82.5%;">"알림 끄기"를 누르면 앞으로 업데이트 알림을 띄우지 않습니다.</i>`,
              icon: 'info',
              showDenyButton: true,
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              denyButtonColor: '#d33',
              confirmButtonText: '업데이트',
              denyButtonText: '알림 끄기',
              cancelButtonText: '이번엔 건너뛰기',
              timer: 20000,
              timerProgressBar: true,
              footer: '<span id="footer" style="font-size: 82.5%;">&nbsp;</span>',
              didOpen: (modal) => {
                modal.onmouseenter = Swal.stopTimer;
                modal.onmouseleave = Swal.resumeTimer;
                timerInterval = setInterval(() => {
                  modal.querySelector("#footer").innerHTML = `<i style="font-size: 82.5%;">약 ${(isNaN(Math.floor(Swal.getTimerLeft()/1000))?'0':Math.floor(Swal.getTimerLeft()/1000))}초 후 창이 자동으로 닫힙니다.</i>`;
                }, 100);
              },
              willClose: () => {
                clearInterval(timerInterval);
              },
            }).then((result) => {
              if (result.isConfirmed) {
                //get extension env
                if (!GM.info.scriptWillUpdate) {
                  window.console.log(abadConstDB.logPrompt.updateManager,'extension not allowed auto update..');
                  Swal.fire({
                    title: abadConstDB.SWAL2Title,
                    html: `<b>주의!</b><br><br><span style="font-size: 97.5%;">스크립트 내용 변경 등으로 인해<br>확장프로그램 내 <b>자동 업데이트</b>가 꺼져있는 것 같습니다.</span><br><br><span style="font-size: 72.5%;">업데이트 시 기존 스크립트에 덮어쓰게 되어 <u>기존 내용이 <b>손실</b>될 수 있습니다.</u></span><br><br>이 점 확인 후 업데이트 바랍니다.<br><br><i style="font-size: 82.5%;">(계속하려면 확인, 취소하려면 취소를 눌러주세요.)</i>`,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '확인',
                    cancelButtonText: '취소',
                    timer: 20000,
                    timerProgressBar: true,
                    footer: '<span id="footer" style="font-size: 82.5%;">&nbsp;</span>',
                    didOpen: (modal) => {
                      modal.onmouseenter = Swal.stopTimer;
                      modal.onmouseleave = Swal.resumeTimer;
                      timerInterval = setInterval(() => {
                        modal.querySelector("#footer").innerHTML = `<i style="font-size: 82.5%;">약 ${(isNaN(Math.floor(Swal.getTimerLeft()/1000))?'0':Math.floor(Swal.getTimerLeft()/1000))}초 후 자동으로 취소됩니다.</i>`;
                      }, 100);
                    },
                    willClose: () => {
                      clearInterval(timerInterval);
                    },
                  }).then((result) => {
                    if (result.isConfirmed) {
                      openUpdateLink();
                     } else {
                      window.console.log(abadConstDB.logPrompt.updateManager,"user canceled.");
                    }
                  });
                } else {
                  openUpdateLink();
                }
              } else if (result.isDenied){
                window.console.log(abadConstDB.logPrompt.paramManager,'updatechk change',true.toString(),'to',false.toString());
                try {
                  GM.setValue(localParameter.updatechk.param_name, false);
                  localParameter.updatechk.value = false;
                  window.console.log(abadConstDB.logPrompt.paramManager,"updatechk change successful");
                  menuStructureUpdate();
                  Swal.fire({
                    icon: 'success',
                    title: abadConstDB.SWAL2Title,
                    html: `<b style="font-size: 82.5%;">앞으로 업데이트 알림을 띄우지 않습니다.</b><br><i style="font-size: 77.5%;">※ <u>설정</u>에서 변경하실 수 있습니다.</i>`,
                    toast: true,
                    position: 'top-end',
                    timer: 3000,
                    timerProgressBar: true,
                    confirmButtonText: '확인',
                  });
                } catch(e) {
                  localParameter.updatechk.value = true;
                  window.console.error(abadConstDB.logPrompt.paramManager,"updatechk change fail -", e);
                  showSWAL2ErrorLog('파라미터 변경', e);
                }
              } else if (result.isDismissed){
                if (result.dismiss == "timeout") {
                  window.console.log(abadConstDB.logPrompt.updateManager,"canceled (timeout)");
                } else if (["cancel", "backdrop"].includes(result.dismiss)) {
                  window.console.log(abadConstDB.logPrompt.updateManager,"canceled (user cancel)");
                } else {
                  window.console.log(abadConstDB.logPrompt.updateManager,'unknown dismiss -',result.dismiss);
                }
              } else {
                window.console.log(abadConstDB.logPrompt.updateManager,"upd-modal unknown state");
              }
            });
        } else {
          //y/n dialog
          if (window.confirm(abadConstDB.logPrompt.default+'\n새로운 버전이 감지되었습니다. 업데이트를 권장합니다.\n( 기존버전 : '+cur_version+', 새로운 버전 : '+tar_version+' )\n(변경사항은 아카라이브 게시글을 참고해주세요.)\n\n취소를 누르면 앞으로 업데이트 알림을 띄우지 않습니다.')) {
            //get extension env
            if (!GM.info.scriptWillUpdate) {
              window.console.log(abadConstDB.logPrompt.updateManager,'extension not allowed auto update..');
              if (window.confirm(abadConstDB.logPrompt.default+'\n주의! 스크립트 내용 변경 등으로 인해 확장프로그램 내 자동 업데이트가 꺼져있는 것 같습니다.\n업데이트 시 기존 스크립트에 덮어쓰게 되어 기존 내용이 손실될 수 있습니다.\n이 점 확인 후 업데이트 바랍니다.\n\n(계속하려면 확인, 취소하려면 취소를 눌러주세요.)')) {
                openUpdateLink();
              } else {
                window.console.log(abadConstDB.logPrompt.updateManager,"user canceled.");
              }
            } else {
              openUpdateLink();
            }
          } else {
            window.console.log(abadConstDB.logPrompt.paramManager,'updatechk change',true.toString(),'to',false.toString());
            try {
              GM.setValue(localParameter.updatechk.param_name, false);
              localParameter.updatechk.value = false;
              window.console.log(abadConstDB.logPrompt.paramManager,"updatechk change successful");
              menuStructureUpdate();
              window.alert(abadConstDB.logPrompt.default+'\n앞으로 업데이트 알림을 띄우지 않습니다.');
            } catch(e) {
              localParameter.updatechk.value = true;
              window.console.error(abadConstDB.logPrompt.paramManager,"updatechk change fail -", e);
              window.alert(abadConstDB.logPrompt.default+'\n파라미터 변경 중 문제 발생, 브라우저 로그를 확인해주세요..');
            }
          }
        }
      } else {
        window.console.log(abadConstDB.logPrompt.updateManager,'latest version', cur_version, 'detected. (eth:',tar_version,')');
      }
    } else {
      window.console.error(abadConstDB.logPrompt.updateManager,'unable to extract version..');
    }
  })
  .catch(error => {
    updateAvailble = false;
    window.console.error(abadConstDB.logPrompt.updateManager,'link unreachable.. -', error);
    //fetch err -> next retry (CORS)
    try {
      GM.setValue(localParameter.updatechk.param_name, true);
      GM.setValue(localParameter.lastupdate.param_name, currentTime - abadConstDB.updateInterval + 60);
    } catch (_) {}
  });
  updateAvailble = false;
}

//menu update
function menuStructureUpdate(fistRun = false) {
  //pre process
  localParameter.basedepth.value = localParameter.basedepth.value > abadInternalDB.internalDB.autoDecodingMaximum ? abadInternalDB.internalDB.autoDecodingMaximum : localParameter.basedepth.value;

  //update menu name
  menuStructure.basedepth.name = '🎛 base64 깊이 조절하기 - 현재 값 : '+localParameter.basedepth.value+'회';
  menuStructure.enclinkhide.name = '🔗 인코딩된 링크 '+(localParameter.enclinkhide.value?'숨기기':'보이기');
  menuStructure.draggable.name = '🖱 드래그 시 자동 디코딩 '+(localParameter.draggable.value?'끄기':'켜기');
  menuStructure.updatechk.name = '🔄 업데이트 알림 '+(localParameter.updatechk.value?'끄기':'켜기');
  menuStructure.updatenoti.name = '✅ 업데이트 완료 알림 '+(localParameter.updatenoti.value?'끄기':'켜기');

  menuStructure.extlinkwarn.name = '❗️ 외부 링크 경고 '+(localParameter.extlinkwarn.value?'숨기기':'보이기');
  menuStructure.deniedchannel.name = '🏷 이 채널에서 자동 디코딩 [끄기/켜기]';

  menuStructure.expandmenu.name = '⚙️ 스크립트 메뉴 '+(localParameter.expandmenu.value?'축소':'확장');

  //remove exist menu cmd
  if (!fistRun) {
    Object.keys(menuStructure).forEach(function(i) {
      try {
        GM.unregisterMenuCommand(menuStructure[i].id);
      } catch(_) {}
    });
  }
  //monkey menu cmd register
  try {
    //all menu expanded
    if(localParameter.expandmenu.value) {
      Object.keys(menuStructure).forEach(function(i) {
        if (menuStructure[i].visible) {
          menuStructure[i].id = GM.registerMenuCommand(menuStructure[i].name, menuStructure[i].func, {title:menuStructure[i].desc});
        } else {
          //if invisible -> use default parameter
          if (localParameter.hasOwnProperty(i)) {
            localParameter[i].value = localParameter[i].def_value;
          }
        }
      });
    //simple menu
    } else {
      menuStructure.expandmenu.id = GM.registerMenuCommand(menuStructure.expandmenu.name, menuStructure.expandmenu.func, {title:menuStructure.expandmenu.desc});
    }
    window.console.log(abadConstDB.logPrompt.paramManager,'ext opt pannel',(fistRun?'registered':'reloaded'));
  } catch(e) {
    window.console.error(abadConstDB.logPrompt.paramManager,'err - ext opt pannel',(fistRun?'register':'reload'),'- ', e);
    Object.keys(menuStructure).forEach(function(i) {
      try {
        GM.unregisterMenuCommand(menuStructure[i].id);
      } catch(_) {}
    });
    try { GM.registerMenuCommand('ⓘ 메뉴 추가 실패, 브라우저 로그 참고', () => {
      if (abadInternalDB.internalDB.swal2Enable) {
        Swal.fire({
          title: abadConstDB.SWAL2Title,
          html: `메뉴 추가 도중 문제가 발생했습니다.<br><i>브라우저 로그를 확인해주세요..</i>`,
          icon: 'error',
          timer: 5000,
          timerProgressBar: true,
          confirmButtonText: '확인',
        });
      } else {
        window.alert(abadConstDB.logPrompt.default+'\n메뉴 추가 도중 문제가 발생했습니다, 브라우저 로그를 확인해주세요..');
      }
    }); } catch(_) {}
  }
}

function menuFuncSubPageReload(showmsg) {
  if (abadInternalDB.internalDB.swal2Enable) {
    Swal.fire({
      title: abadConstDB.SWAL2Title,
      html: `${((showmsg==undefined)?'':('<b>'+showmsg+'</b><br><br>'))}<i>> 반영을 위해 사이트 새로고침이 필요합니다.<br>사이트를 새로고침할까요?</i>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '새로고침',
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        window.console.log(abadConstDB.logPrompt.default, 'page reloading..');
        window.location.reload(true);
      } else {
        window.console.log(abadConstDB.logPrompt.default, 'page reload canceled');
      }
    });
  } else {
    if(window.confirm(abadConstDB.logPrompt.default+'\n'+((showmsg==undefined)?'':(showmsg+'\n\n'))+'> 반영을 위해 사이트 새로고침이 필요합니다, 사이트를 새로고침할까요?')) {
      window.console.log(abadConstDB.logPrompt.default, 'page reloading..');
      window.location.reload(true);
    } else {
      window.console.log(abadConstDB.logPrompt.default, 'page reload canceled');
    }
  }
}

function menuFunctionBasedepth() {
  menuStructureUpdate();
  const previousValue = localParameter.basedepth.value;
  const str_common_1 = ' ( 지정 가능한 범위: 1~'+abadInternalDB.internalDB.autoDecodingMaximum.toString()+' )';

  if (abadInternalDB.internalDB.swal2Enable) {
    const slideHandler = function(event) {
      const target = Swal.getPopup().querySelector("#footer");
      if (event.target.value > 7) {
        target.style.display = 'block';
        target.innerHTML = `<i>(값을 너무 크게 지정하면 브라우저 성능에 영향을 줄 수 있습니다.)</i>`;
      } else {
        target.style.display = 'none';
      }
    };
    Swal.fire({
      title: abadConstDB.SWAL2Title,
      icon: "question",
      input: "range",
      html: `<b>Base64 자동 디코딩 중첩 횟수를 얼마로 지정할까요?</b><div style = "font-size: 75%; margin: 1em auto 1em"><i>(인코딩을 인코딩한 것을 여러번 반복한 것을 자동으로 풀어냅니다.)</i></div><span style = "font-size: 87.5%;">현재 값: ${previousValue.toString()}회,${(previousValue == 3 ? '' : ' 기본값: 3회,')}${str_common_1}`,
      inputAttributes: {
        min: "1",
        max: abadInternalDB.internalDB.autoDecodingMaximum.toString(),
        step: "1"
      },
      footer: `<i id="footer">${(previousValue > 7)?'(값을 너무 크게 지정하면 브라우저 성능에 영향을 줄 수 있습니다.)':''}</i>`,
      inputValue: previousValue,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: '변경',
      cancelButtonText: '취소',
      inputValidator: (value) => {
        return new Promise((resolve) => {
          if (value == previousValue) {
            resolve(`기존값과 동일합니다, 현재 값: ${previousValue}회`);
          } else {
            resolve();
          }
        });
      },
      didOpen: (modal) => {
        modal.querySelector(".swal2-range").firstChild.addEventListener('input', slideHandler, false);
      },
      willClose: (modal) => {
        modal.querySelector(".swal2-range").firstChild.removeEventListener('input', slideHandler);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const targetValue = parseInt(result.value);
        window.console.log(abadConstDB.logPrompt.paramManager,'basedepth change',previousValue.toString(),'to',targetValue.toString());
        localParameter.basedepth.value = targetValue;
        try {
          GM.setValue(localParameter.basedepth.param_name, targetValue);
          window.console.log(abadConstDB.logPrompt.paramManager,"basedepth change successful");
          menuFuncSubPageReload('자동 디코딩 중첩 횟수가 '+previousValue.toString()+'에서 '+targetValue.toString()+'(으)로<br>변경이 완료되었습니다.');
        } catch(e) {
          localParameter.basedepth.value = previousValue;
          window.console.error(abadConstDB.logPrompt.paramManager,"basedepth change fail -", e);
          showSWAL2ErrorLog('파라미터 변경', e);
        } finally {
          menuStructureUpdate();
        }
      } else {
        window.console.log(abadConstDB.logPrompt.default,'basedepth change canceled.');
      }
    });
  } else {
    while (true) {
      const input = window.prompt(abadConstDB.logPrompt.default+'\nBase64 자동 디코딩 중첩 횟수를 얼마로 지정할까요?\n(인코딩을 인코딩한 것을 여러번 반복한 것을 자동으로 풀어냅니다.)\n현재 값: '+previousValue.toString()+'회,'+(previousValue == 3 ? '' : ' 기본값: 3회,')+str_common_1+'\n\n(값을 너무 크게 지정하면 브라우저 성능에 영향을 줄 수 있습니다.)', previousValue);
      if (input == null) {
        window.console.log(abadConstDB.logPrompt.default,'basedepth change canceled.');
        break;
      }
      if (!isNaN(input)) {
        const targetValue = parseInt(input);
        if (targetValue == previousValue) {
          window.alert(abadConstDB.logPrompt.default+'\n동일한 값을 입력했습니다, 현재 값: '+previousValue+'회');
        } else if (targetValue >= 1 && targetValue <= abadInternalDB.internalDB.autoDecodingMaximum) {
          window.console.log(abadConstDB.logPrompt.paramManager,'basedepth change',previousValue.toString(),'to',targetValue.toString());
          localParameter.basedepth.value = targetValue;
          try {
            GM.setValue(localParameter.basedepth.param_name, targetValue);
            window.console.log(abadConstDB.logPrompt.paramManager,"basedepth change successful");
            menuFuncSubPageReload('값이 '+previousValue.toString()+'에서 '+targetValue.toString()+'으로 변경이 완료되었습니다.');
          } catch(e) {
            localParameter.basedepth.value = previousValue;
            window.console.error(abadConstDB.logPrompt.paramManager,"basedepth change fail -", e);
            window.alert(abadConstDB.logPrompt.default+'\n파라미터 변경 중 문제 발생, 브라우저 로그를 확인해주세요..');
          } finally {
            menuStructureUpdate();
            break;
          }
        } else {
          window.alert(abadConstDB.logPrompt.default+'\n'+targetValue+'(으)로 설정할 수 없습니다.\n범위를 초과하였습니다..'+str_common_1);
        }
      } else {
        window.alert(abadConstDB.logPrompt.default+'\n'+input+'은(는)숫자가 아닙니다.\n숫자만 입력해주세요..'+str_common_1);
      }
    }
  }
}

function menuFunctionEnchide() {
  menuStructureUpdate();
  const currentState = localParameter.enclinkhide.value;
  if (abadInternalDB.internalDB.swal2Enable) {
    Swal.fire({
      title: abadConstDB.SWAL2Title,
      html: `<b>디코딩 시 인코딩된 링크를 ${(currentState?'숨기시':'표시하')}겠습니까?</b><br><br><i>(앞으로 디코딩 전 인코딩된 링크를<br>"${(currentState?'클릭 시 기존링크 보기':'aHR0cHM6Ly9hcmNhLmx..')}"와 같은 형태로<br>보여줍니다.)</i>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: (currentState?'숨기기':'표시하기'),
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        const targetState = !currentState;
        window.console.log(abadConstDB.logPrompt.paramManager,'enchide change',currentState.toString(),'to',targetState.toString());
        localParameter.enclinkhide.value = targetState;
        try {
          GM.setValue(localParameter.enclinkhide.param_name, targetState);
          window.console.log(abadConstDB.logPrompt.paramManager,"enchide change successful");
          menuFuncSubPageReload('앞으로 인코딩된 링크를 '+(targetState?'표시합':'숨깁')+'니다.');
        } catch(e) {
          localParameter.enclinkhide.value = currentState;
          window.console.error(abadConstDB.logPrompt.paramManager,"enchide change fail -", e);
          showSWAL2ErrorLog('파라미터 변경', e);
        } finally {
          menuStructureUpdate();
        }
      } else {
        window.console.log(abadConstDB.logPrompt.default,'enchide change canceled.');
      }
    });
  } else {
    if (window.confirm(abadConstDB.logPrompt.default+'\n디코딩 시 인코딩된 링크를 '+(currentState?'숨기시':'표시하')+'겠습니까?\n\n(앞으로 디코딩 전 인코딩된 링크를\n"'+(currentState?'클릭 시 기존링크 보기':'aHR0cHM6Ly9hcmNhLmx..')+'"와 같은 형태로 보여줍니다.)')) {
      const targetState = !currentState;
      window.console.log(abadConstDB.logPrompt.paramManager,'enchide change',currentState.toString(),'to',targetState.toString());
      localParameter.enclinkhide.value = targetState;
      try {
        GM.setValue(localParameter.enclinkhide.param_name, targetState);
        window.console.log(abadConstDB.logPrompt.paramManager,"enchide change successful");
        menuFuncSubPageReload('앞으로 인코딩된 링크를 '+(targetState?'표시합':'숨깁')+'니다.');
      } catch(e) {
        localParameter.enclinkhide.value = currentState;
        window.console.error(abadConstDB.logPrompt.paramManager,"enchide change fail -", e);
        window.alert(abadConstDB.logPrompt.default+'\n파라미터 변경 중 문제 발생, 브라우저 로그를 확인해주세요..');
      } finally {
        menuStructureUpdate();
      }
    } else {
      window.console.log(abadConstDB.logPrompt.default,'enchide change canceled.');
    }
  }
}

function menuFunctionDraggable() {
  menuStructureUpdate();
  const currentState = localParameter.draggable.value;
  if (abadInternalDB.internalDB.swal2Enable) {
    Swal.fire({
      title: abadConstDB.SWAL2Title,
      html: `<b>드래그 시 자동 디코딩을 ${(currentState?'비':'')}활성화 하시겠습니까?</b><br><br><i>(앞으로 인코딩된 부분을 드래그${(currentState?'해도<br>자동으로 디코딩되지 않습':' 시 Base64로 인코딩된<br>것으로 판단 되면 자동으로 디코딩을 시도합')}니다.)</i>${(currentState?'':'<br><br><i>(이 기능은 작동이 불안정할 수 있습니다.)</i>')}`,
      icon: 'question',
      showDenyButton: true,
      showCancelButton: !currentState,
      confirmButtonColor: '#3085d6',
      confirmButtonText: (currentState?'비활성화':'활성화'),
      denyButtonText: '취소',
      cancelButtonText: '이번에만 활성화',
    }).then((result) => {
      if (result.isConfirmed) {
        const targetState = !currentState;
        window.console.log(abadConstDB.logPrompt.paramManager,'draggable change',currentState.toString(),'to',targetState.toString());
        localParameter.draggable.value = targetState;
        try {
          GM.setValue(localParameter.draggable.param_name, targetState);
          window.console.log(abadConstDB.logPrompt.paramManager,"draggable change successful");
          if (targetState) {
            try {
              activateDragDecoding();
              Swal.fire({
                icon: 'success',
                title: abadConstDB.SWAL2Title,
                html: `<b style="font-size: 77.5%">앞으로 드래그 시 자동 디코딩을 진행합니다.</b>`,
                toast: true,
                position: 'center',
                timer: 2000,
                timerProgressBar: true,
                confirmButtonText: '확인',
              });
            } catch(e) {
              window.console.error(abadConstDB.logPrompt.default,"draggable activate fail -", e);
              showSWAL2ErrorLog('드래그 시 자동 디코딩 활성화', e);
            }
          } else {
            menuFuncSubPageReload('앞으로 드래그 해도 반응하지 않습니다.');
          }
        } catch(e) {
          localParameter.draggable.value = currentState;
          window.console.error(abadConstDB.logPrompt.paramManager,"draggable change fail -", e);
          showSWAL2ErrorLog('파라미터 변경', e);
        } finally {
          menuStructureUpdate();
        }
      } else if (result.isDismissed) {
        try {
          activateDragDecoding();
          Swal.fire({
            icon: 'success',
            title: abadConstDB.SWAL2Title,
            html: `<b style="font-size: 77.5%">드래그 시 자동 디코딩이 활성화되었습니다.</b><br><i style="font-size: 67.5%">새로고침 시 자동으로 비활성화됩니다.</i>`,
            toast: true,
            position: 'center',
            timer: 2000,
            timerProgressBar: true,
            confirmButtonText: '확인',
          });
        } catch(e) {
          window.console.error(abadConstDB.logPrompt.default,"draggable activate fail -", e);
          showSWAL2ErrorLog('드래그 시 자동 디코딩 활성화(일회성)', e);
        }
      }else {
        window.console.log(abadConstDB.logPrompt.default,'draggable change canceled.');
      }
    });
  } else {
    if (window.confirm(abadConstDB.logPrompt.default+'\n드래그 시 자동 디코딩을 '+(currentState?'비':'')+'활성화 하시겠습니까?\n\n(앞으로 인코딩된 부분을 드래그'+(currentState?'해도 자동으로 디코딩되지 않습':' 시 Base64로 인코딩된것으로\n판단 되면 자동으로 디코딩을 시도합')+'니다.)'+(currentState?'':'\n\n(이 기능은 작동이 불안정할 수 있습니다.)'))) {
      const targetState = !currentState;
      window.console.log(abadConstDB.logPrompt.paramManager,'draggable change',currentState.toString(),'to',targetState.toString());
      localParameter.draggable.value = targetState;
      try {
        GM.setValue(localParameter.draggable.param_name, targetState);
        window.console.log(abadConstDB.logPrompt.paramManager,"draggable change successful");
        if (targetState) {
          try {
            activateDragDecoding();
            window.alert(abadConstDB.logPrompt.default+'\n앞으로 드래그 시 자동 디코딩을 진행합니다.');
          } catch(e) {
            window.console.error(abadConstDB.logPrompt.default,"draggable activate fail -", e);
            window.alert(abadConstDB.logPrompt.default+'\n드래그 시 자동 디코딩 활성화 중 문제가 발생했습니다, 브라우저 로그를 확인해주세요..\n새로고침이 필요합니다..');
          }
        } else {
          menuFuncSubPageReload('앞으로 드래그 해도 반응하지 않습니다.');
        }
      } catch(e) {
        localParameter.draggable.value = currentState;
        window.console.error(abadConstDB.logPrompt.paramManager,"draggable change fail -", e);
        window.alert(abadConstDB.logPrompt.default+'\n파라미터 변경 중 문제 발생, 브라우저 로그를 확인해주세요..');
      } finally {
        menuStructureUpdate();
      }
    } else {
      window.console.log(abadConstDB.logPrompt.default,'draggable change canceled.');
    }
  }
}

//TODO
function menuFunctionCheckUpdate() {
  let timerInterval;
  Swal.fire({
    title: abadConstDB.SWAL2Title,
    html: `스크립트 업데이트 확인중..<br><br>[DEMO:TODO]<br>left <b></b> ms.`,
    timer: 2000,
    timerProgressBar: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    didOpen: () => {
      Swal.showLoading();
      const timer = Swal.getPopup().querySelector("b");
      timerInterval = setInterval(() => {
        timer.textContent = `${Swal.getTimerLeft()}`;
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    },
  }).then((result) => {
    Swal.fire({
      icon: 'success',
      title: abadConstDB.SWAL2Title,
      html: `스크립트가 최신버전입니다<br><i>${GM.info.script.name} V ${GM.info.script.version}</i>`,
      toast: true,
      position: 'center',
      timer: 2000,
      timerProgressBar: true,
      confirmButtonText: '확인',
    });

    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log("TMOUT");
    }
  });
}

function menuFunctionUpdateCheck() {
  menuStructureUpdate();
  const currentState = localParameter.updatechk.value;
  if (abadInternalDB.internalDB.swal2Enable) {
    Swal.fire({
      title: abadConstDB.SWAL2Title,
      html: `<b>업데이트 알림을 ${(currentState?'끄':'켜')}시겠습니까?</b><br><br><i>(앞으로 업데이트가 있${(currentState?'어도 알려주지 않습':'으면 자동으로 알려줍')}니다.)</i>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: (currentState?'끄기':'켜기'),
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        const targetState = !currentState;
        window.console.log(abadConstDB.logPrompt.paramManager,'updatechk change',currentState.toString(),'to',targetState.toString());
        localParameter.updatechk.value = targetState;
        try {
          GM.setValue(localParameter.updatechk.param_name, targetState);
          window.console.log(abadConstDB.logPrompt.paramManager,"updatechk change successful");
          Swal.fire({
            icon: 'success',
            title: abadConstDB.SWAL2Title,
            html: `<b style="font-size: ${(targetState?'75':'77.5')}%">앞으로 업데이트${(targetState?'가 존재하면':'')} 알림을 띄${(targetState?'웁':'우지 않습')}니다.</b>`,
            toast: true,
            position: 'center',
            timer: 2000,
            timerProgressBar: true,
            confirmButtonText: '확인',
          });
        } catch(e) {
          localParameter.updatechk.value = currentState;
          window.console.error(abadConstDB.logPrompt.paramManager,"updatechk change fail -", e);
          showSWAL2ErrorLog('파라미터 변경', e);
        } finally {
          menuStructureUpdate();
        }
      } else {
        window.console.log(abadConstDB.logPrompt.default,'updatechk change canceled.');
      }
    });
  } else {
    if (window.confirm(abadConstDB.logPrompt.default+'\n업데이트 알림을 '+(currentState?'끄':'켜')+'시겠습니까?\n\n(앞으로 업데이트가 있'+(currentState?'어도 알려주지 않습':'으면 자동으로 알려줍')+'니다.)')) {
      const targetState = !currentState;
      window.console.log(abadConstDB.logPrompt.paramManager,'updatechk change',currentState.toString(),'to',targetState.toString());
      localParameter.updatechk.value = targetState;
      try {
        GM.setValue(localParameter.updatechk.param_name, targetState);
        window.console.log(abadConstDB.logPrompt.paramManager,"updatechk change successful");
        window.alert(abadConstDB.logPrompt.default+'\n앞으로 업데이트'+(targetState?'가 존재하면':'')+' 알림을 띄'+(targetState?'웁':'우지 않습')+'니다.');
      } catch(e) {
        localParameter.updatechk.value = currentState;
        window.console.error(abadConstDB.logPrompt.paramManager,"updatechk change fail -", e);
        window.alert(abadConstDB.logPrompt.default+'\n파라미터 변경 중 문제 발생, 브라우저 로그를 확인해주세요..');
      } finally {
        menuStructureUpdate();
      }
    } else {
      window.console.log(abadConstDB.logPrompt.default,'updatechk change canceled.');
    }
  }
}


function menuFunctionUpdateNotice() {
  menuStructureUpdate();
  const currentState = localParameter.updatenoti.value;
  if (abadInternalDB.internalDB.swal2Enable) {
    Swal.fire({
      title: abadConstDB.SWAL2Title,
      html: `<b>업데이트 완료 알림을 ${(currentState?'끄':'켜')}시겠습니까?</b><br><br><i>(앞으로 업데이트 완료 시 ${(currentState?'알려주지 않습':'자동으로 알려줍')}니다.)</i>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: (currentState?'끄기':'켜기'),
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        const targetState = !currentState;
        window.console.log(abadConstDB.logPrompt.paramManager,'updatenoti change',currentState.toString(),'to',targetState.toString());
        localParameter.updatenoti.value = targetState;
        try {
          GM.setValue(localParameter.updatenoti.param_name, targetState);
          window.console.log(abadConstDB.logPrompt.paramManager,"updatenoti change successful");
          Swal.fire({
            icon: 'success',
            title: abadConstDB.SWAL2Title,
            html: `<b style="font-size: ${(targetState?'77.5':'70')}%">앞으로 업데이트 완료 시 알림을 띄${(targetState?'웁':'우지 않습')}니다.</b>`,
            toast: true,
            position: 'center',
            timer: 2000,
            timerProgressBar: true,
            confirmButtonText: '확인',
          });
        } catch(e) {
          localParameter.updatenoti.value = currentState;
          window.console.error(abadConstDB.logPrompt.paramManager,"updatenoti change fail -", e);
          showSWAL2ErrorLog('파라미터 변경', e);
        } finally {
          menuStructureUpdate();
        }
      } else {
        window.console.log(abadConstDB.logPrompt.default,'updatenoti change canceled.');
      }
    });
  } else {
    if (window.confirm(abadConstDB.logPrompt.default+'\n업데이트 완료 알림을 '+(currentState?'끄':'켜')+'시겠습니까?</b><br><br><i>(앞으로 업데이트 완료 시 '+(currentState?'알려주지 않습':'자동으로 알려줍')+'니다.)')) {
      const targetState = !currentState;
      window.console.log(abadConstDB.logPrompt.paramManager,'updatenoti change',currentState.toString(),'to',targetState.toString());
      localParameter.updatenoti.value = targetState;
      try {
        GM.setValue(localParameter.updatenoti.param_name, targetState);
        window.console.log(abadConstDB.logPrompt.paramManager,"updatenoti change successful");
        window.alert(abadConstDB.logPrompt.default+'\n앞으로 업데이트 완료 시 알림을 띄'+(targetState?'웁':'우지 않습')+'니다.');
      } catch(e) {
        localParameter.updatenoti.value = currentState;
        window.console.error(abadConstDB.logPrompt.paramManager,"updatenoti change fail -", e);
        window.alert(abadConstDB.logPrompt.default+'\n파라미터 변경 중 문제 발생, 브라우저 로그를 확인해주세요..');
      } finally {
        menuStructureUpdate();
      }
    } else {
      window.console.log(abadConstDB.logPrompt.default,'updatenoti change canceled.');
    }
  }
}

function menuFunctionChangeExpandMode() {
  menuStructureUpdate();
  const currentState = localParameter.expandmenu.value;
  if (abadInternalDB.internalDB.swal2Enable) {
    Swal.fire({
      title: abadConstDB.SWAL2Title,
      html: `<b>메뉴에 나타나는 항목을 ${(currentState?'줄일':'늘릴')}까요?</b><br><br><i>(앞으로 세부설정 메뉴가 ${(currentState?'숨겨':'보여')}집니다.)</i>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: (currentState?'줄이기':'표시하기'),
      cancelButtonText: '취소',
    }).then((result) => {
      if (result.isConfirmed) {
        const targetState = !currentState;
        window.console.log(abadConstDB.logPrompt.paramManager,'menuexpand change',currentState.toString(),'to',targetState.toString());
        localParameter.expandmenu.value = targetState;
        try {
          GM.setValue(localParameter.expandmenu.param_name, targetState);
          window.console.log(abadConstDB.logPrompt.paramManager,"menuexpand change successful");
          Swal.fire({
            icon: 'success',
            title: abadConstDB.SWAL2Title,
            html: `<b style="font-size: 87.5%">앞으로 세부설정 메뉴가 ${(targetState?'보여':'숨겨')}집니다.</b>`,
            toast: true,
            position: 'center',
            timer: 2000,
            timerProgressBar: true,
            confirmButtonText: '확인',
          });
        } catch(e) {
          localParameter.expandmenu.value = currentState;
          window.console.error(abadConstDB.logPrompt.paramManager,"menuexpand change fail -", e);
          showSWAL2ErrorLog('파라미터 변경', e);
        } finally {
          menuStructureUpdate();
        }
      } else {
        window.console.log(abadConstDB.logPrompt.default,'menuexpand change canceled.');
      }
    });
  } else {
    if (window.confirm(abadConstDB.logPrompt.default+'\n메뉴에 나타나는 항목을 '+(currentState?'줄일':'늘릴')+'까요?\n\n(앞으로 세부설정 메뉴가 '+(currentState?'숨겨':'보여')+'집니다.)')) {
      const targetState = !currentState;
      window.console.log(abadConstDB.logPrompt.paramManager,'menuexpand change',currentState.toString(),'to',targetState.toString());
      localParameter.expandmenu.value = targetState;
      try {
        GM.setValue(localParameter.expandmenu.param_name, targetState);
        window.console.log(abadConstDB.logPrompt.paramManager,"menuexpand change successful");
        window.alert(abadConstDB.logPrompt.default+'\n앞으로 세부설정 메뉴가 '+(targetState?'보여':'숨겨')+'집니다.');
      } catch(e) {
        localParameter.expandmenu.value = currentState;
        window.console.error(abadConstDB.logPrompt.paramManager,"menuexpand change fail -", e);
        window.alert(abadConstDB.logPrompt.default+'\n파라미터 변경 중 문제 발생, 브라우저 로그를 확인해주세요..');
      } finally {
        menuStructureUpdate();
      }
    } else {
      window.console.log(abadConstDB.logPrompt.default,'menuexpand change canceled.');
    }
  }
}

function menuFunctionRstDefaults() {
  menuStructureUpdate();
  if (abadInternalDB.internalDB.swal2Enable) {
    Swal.fire({
      title: abadConstDB.SWAL2Title,
      html: `<b>정말 스크립트 설정을 기본값으로 초기화하시겠습니까?</b><br><br><i>(초기화 완료 후 자동으로 새로고침됩니다.)</i>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      focusCancel: true,
      confirmButtonText: '초기화 진행',
      cancelButtonText: '취소',
      showLoaderOnConfirm: true,
      timer: 10000,
      timerProgressBar: true,
      didOpen: (modal) => {
        modal.onmouseenter = Swal.stopTimer;
        modal.onmouseleave = Swal.resumeTimer;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.console.log(abadConstDB.logPrompt.paramManager, 'remove all settings..');
        Swal.fire({
          title: abadConstDB.SWAL2Title,
          html: `<b>설정값을 제거중입니다, 잠시만 기다려주세요..</b>`,
          footer: `<i>1분 이내로 이 창이 사라지지 않으면 수동으로 새로고침해주세요.</i>`,
          didOpen: () => {
            Swal.showLoading();
          },
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
        });
        try {
          Object.keys(menuStructure).forEach(function(i) {
            try {
              GM.unregisterMenuCommand(menuStructure[i].id);
            } catch(_) {}
          });
          for (const i of Object.keys(localParameter)) {
            console.log(abadConstDB.logPrompt.paramManager, 'try to remove -', localParameter[i].param_name);
            GM.deleteValue(localParameter[i].param_name);
          }
          sleep(250).then(() => {
            window.console.log(abadConstDB.logPrompt.paramManager, 'all parameter removed.');
            Swal.fire({
              title: abadConstDB.SWAL2Title,
              html: `<b>설정값이 모두 제거되었습니다.</b><br><br><i>(확인 후 현재 창이 자동으로 새로고침됩니다.)</i>`,
              footer: `<i style="font-size: 82.5%;">비정상적으로 동작 시 스크립트를 재설치해주세요.</i>`,
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: '확인',
              didOpen: () => {
                Swal.hideLoading();
              },
            }).then(() => {
              window.location.reload(true);
            });
          });
        } catch(e) {
          window.console.error(abadConstDB.logPrompt.paramManager,'err - get sc parameter - ', e);
          Swal.close();
          showSWAL2ErrorLog('파라미터 초기화', e);
        }
      } else {
        window.console.log(abadConstDB.logPrompt.default,'settings restore canceled.');
      }
    });
  } else {
    if (window.confirm(abadConstDB.logPrompt.default+'\n정말 스크립트 설정을 기본값으로 초기화하시겠습니까?\n\n(초기화 완료 후 자동으로 새로고침됩니다.)')) {
      try {
        window.console.log(abadConstDB.logPrompt.paramManager, 'remove all settings..');
        for (const i of Object.keys(localParameter)) {
          console.log(abadConstDB.logPrompt.paramManager, 'try to remove -', localParameter[i].param_name);
          GM.deleteValue(localParameter[i].param_name);
        }
        Object.keys(menuStructure).forEach(function(i) {
          try {
            GM.unregisterMenuCommand(menuStructure[i].id);
          } catch(_) {}
        });
        window.console.log(abadConstDB.logPrompt.paramManager, 'all parameter removed.');
        window.alert(abadConstDB.logPrompt.default+'\n설정값이 모두 제거되었습니다.\n\n(확인 후 현재 창이 자동으로 새로고침됩니다.)');
        window.location.reload(true);
      } catch(e) {
        window.console.error(abadConstDB.logPrompt.paramManager,'err - get sc parameter - ', e);
        window.alert(abadConstDB.logPrompt.default+'\n경고! 파라미터 초기화 도중 문제가 발생했습니다. 브라우저 로그를 참고해주세요..');
      }
    } else {
      window.console.log(abadConstDB.logPrompt.default,'settings restore canceled.');
    }
  }
}

function menuFunctionNotAvailable() {
  window.console.log(abadConstDB.logPrompt.default,'unavailable function clicked');
  if (abadInternalDB.internalDB.swal2Enable) {
      Swal.fire({
        title: abadConstDB.SWAL2Title,
        html: `현재 사용할 수 없는 기능입니다..<br><br><i>(구현되지 않았거나 버그로 인해 일시적으로<br>현재버전에서 비활성화된 기능입니다.)</i>`,
        icon: 'error',
        timer: 5000,
        timerProgressBar: true,
        confirmButtonText: '확인',
      });
  } else {
    window.alert(abadConstDB.logPrompt.default+'\n현재 사용할 수 없는 기능입니다..');
  }
}

//main
(async () => {
  'use strict';

  //chk browser env
  if (((window.navigator.language || window.navigator.userLanguage) != 'ko-KR')) {
    window.console.warn('Warning! this script support only korean language..');
  }

  window.console.log(abadConstDB.logPrompt.default,'V',GM.info.script.version,'pre processing..');

  //Sweet Alert2 chk
  if (window.Swal != undefined) {
    const styleSA2 = document.createElement('style');
    styleSA2.textContent = '.swal2-container { z-index: 2400; }';
    document.head.appendChild(styleSA2);
    abadInternalDB.internalDB.swal2Enable = true;
    window.console.log(abadConstDB.logPrompt.default,'SA2 loaded');
  }

  //check edit mode
  if (window.location.pathname.match(/\/b\/.*?\/(write|edit)/)) {
    window.console.log(abadConstDB.logPrompt.default,'write/edit mode detected, function disabled.');
    try {
      GM.registerMenuCommand("작성/수정 모드에서는 동작하지 않음", ()=>{
        if (abadInternalDB.internalDB.swal2Enable) {
          Swal.fire({
            title: abadConstDB.SWAL2Title,
            html: `작성 또는 수정모드에서는 동작하지 않습니다..`,
            icon: 'error',
            timer: 5000,
            timerProgressBar: true,
            confirmButtonText: '확인',
          });
        } else {
          window.alert(abadConstDB.logPrompt.default+'\n작성 또는 수정모드에서는 동작하지 않습니다..');
        }
      }, {title:'작성 또는 수정모드에서는 동작하지 않습니다.'});
    } catch(_) {}
    return;
  }

  window.console.log(abadConstDB.logPrompt.default,'abad enabled');

  //load parameter
  try {
    for (const i of Object.keys(localParameter)) {
      localParameter[i].value = await GM.getValue(localParameter[i].param_name, localParameter[i].def_value);
    }
    window.console.log(abadConstDB.logPrompt.paramManager, 'sc parameter load completed.');
  } catch(e) {
    window.console.error(abadConstDB.logPrompt.paramManager,'err - get sc parameter - ', e);
  }

  //apply parameter and register monkey menu command
  menuStructureUpdate(true);

  //chk update
  await checkForUpdate();

  //drag auto decoding
  if (localParameter.draggable.value) {
    activateDragDecoding();
  }

  window.console.log(abadConstDB.logPrompt.default,'script ready');
  //main procedure

  //article
  let article = document.getElementsByClassName("article-content")[0];
  if (article != undefined) {
    for (let i=0; i<localParameter.basedepth.value; i++) {
      article.innerHTML = article.innerHTML.replaceAll(regexEncodedPrefixDef[i], replacerGen(i, 'article'));
    }
  } else window.console.warn(abadConstDB.logPrompt.default,'article not found.');
  const decoded_article = hindex;

  //comment
  let comments = document.getElementsByClassName("list-area");
  if (article != undefined) {
    if (comments.length != 0) {
      for (let i=0; i<localParameter.basedepth.value; i++) {
        comments[0].innerHTML = comments[0].innerHTML.replaceAll(regexEncodedPrefixDef[i], replacerGen(i, 'comment'));
      }
    }
  } else window.console.warn(abadConstDB.logPrompt.default,'comments not found.');
  const decoded_comment = hindex - decoded_article;

  window.console.log(abadConstDB.logPrompt.decodeManager,'total',hindex,'link decode task finished. (article:', decoded_article, ', comment:', decoded_comment, ')');

  //sorting detected hostname
  abadInternalDB.hostnameSet = Array.from(abadInternalDB.hostnameSetRaw).sort();

  //show result on article top
  if (decoded_article+decoded_comment>0) {
    let result = document.createElement("div");
    result.id = createElemID();
    result.class = 'btn';
    result.style.marginTop = '10px';
    result.style.marginBottom = '10px';
    result.style.paddingTop = '7px';

    let result_box = document.createElement("span");
    //result_box.style.border = '1.5px solid #68b3ff';
    //result_box.style.padding = '7px 15px';

    let result_in = '<div style="color: #e83e8c; border: 1.5px solid #68b3ff; padding: 7px 15px;">';
    if (decoded_article+decoded_comment>0) {
      result_box.title = '클릭 시 디코딩된 링크를 한번에 볼 수 있습니다.';
      result_in += `총 ${(decoded_article+decoded_comment)}개의 링크가 자동 디코딩되었습니다.<br><span style="font-size: 75%;">( ${((decoded_article>0)?('게시글: '+decoded_article+'개'+((decoded_comment>0)?' / ':'')):'')}${((decoded_comment>0)?('댓글: '+decoded_comment+'개'):'')} ) / ( 사이트 종류: ${abadInternalDB.hostnameSet.length}개 )</span>`;
      result_in += `<p><i>(클릭하여 자세히 보기)</i></p>`;
    } else {//not use
      result_box.title = '이 게시글 또는 댓글에서 Base64로 인코딩 된 링크가 감지되지 않았습니다..';
      result_in += '<span style="font-size: 75%;"><i>이 게시글 또는 댓글에서 Base64로 인코딩 된 링크가 감지되지 않았습니다..</i></span>';
    }
    result_in += '</div>';
    result_box.innerHTML = result_in;
    result_box.addEventListener('click', showDecodeSummary);
    result.appendChild(result_box);
    result.appendChild(document.createElement("hr"));
    article.parentNode.prepend(result);
  }

  //add event listner - click, show original encoded link
  if (!localParameter.enclinkhide.value) {
    Object.keys(abadInternalDB.encodedLink).forEach(function(i) {
      document.getElementById(i).addEventListener('click', showEncodedLink); //, { once : true }
    });
  }

})();

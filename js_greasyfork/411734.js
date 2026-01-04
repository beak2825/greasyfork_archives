// ==UserScript==
// @name            Arca Refresher
// @namespace       LeKAKiD
// @description     Arca Live Extension
// @homepageURL     https://github.com/lekakid/ArcaRefresher
// @supportURL      https://arca.live/b/namurefresher
// @match           https://*.arca.live/*
// @match           https://arca.live/*
// @exclude-match   https://st*.arca.live/*
// @noframes
// @run-at          document-start
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_listValues
// @grant           GM_xmlhttpRequest
// @version         2.6.8
// @author          LeKAKiD
// @require         https://unpkg.com/file-saver@2.0.2/dist/FileSaver.min.js
// @require         https://unpkg.com/jszip@3.1.5/dist/jszip.min.js
// @require         https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom,npm/@violentmonkey/ui
// @downloadURL https://update.greasyfork.org/scripts/411734/Arca%20Refresher.user.js
// @updateURL https://update.greasyfork.org/scripts/411734/Arca%20Refresher.meta.js
// ==/UserScript==

(function () {
'use strict';

function getContrastYIQ(hexcolor) {
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'black' : 'white';
}
function getRandomColor() {
  return `00000${Math.floor(Math.random() * 0xFFFFFF).toString(16).toUpperCase()}`.slice(-6);
}

var css_248z = "#refresherSetting {\r\n    margin: 0 auto;\r\n    max-width: 1300px;\r\n    border: 1px solid #bbb;\r\n    background-color: #fff;\r\n    padding: 1rem;\r\n}\r\n\r\n#refresherSetting select,\r\n#refresherSetting textarea,\r\n#refresherSetting input[type=\"text\"] {\r\n    display: block;\r\n    width: 100%;\r\n    padding: .5rem .75rem;\r\n    color: #55595c;\r\n    background-color: #fff;\r\n    border: 1px solid #bbb;\r\n}\r\n\r\n#refresherSetting input[disabled] {\r\n    background-color: #eee;\r\n}\r\n\r\n#refresherSetting select {\r\n    overflow: scroll;\r\n}\r\n\r\n#refresherSetting label {\r\n    display: inline;\r\n}\r\n\r\n@media (prefers-color-scheme:dark) {\r\n    #refresherSetting {\r\n        border: 1px solid #43494c;\r\n        background-color: #181a1b;\r\n    }\r\n    \r\n    #refresherSetting select,\r\n    #refresherSetting textarea,\r\n    #refresherSetting input[type=\"text\"] {\r\n        color: #55595c;\r\n        background-color: #fff;\r\n        border: 1px solid #bbb;\r\n    }\r\n    \r\n    #refresherSetting input[disabled] {\r\n        background-color: #999;\r\n    }\r\n}";

const defaultConfig = {
  refreshTime: 5,
  hideRefresher: false,
  useShortcut: false,
  hideNotice: true,
  hideAvatar: false,
  hideMedia: false,
  hideModified: false,
  hideSideMenu: false,
  myImage: '',
  blockRatedown: false,
  blockKeyword: [],
  blockUser: [],
  blockEmoticon: {},
  userMemo: {},
  useAutoRemoverTest: true,
  autoRemoveUser: [],
  autoRemoveKeyword: [],
  category: {},
  imageDownloaderFileName: '%title%'
};
function importConfig(JSONString) {
  const data = JSON.parse(JSONString);

  for (const key of Object.keys(data)) {
    if ({}.hasOwnProperty.call(defaultConfig, key)) {
      GM_setValue(key, data[key]);
    }
  }
}

function exportConfig() {
  const keys = GM_listValues();
  const config = {};

  for (const key of keys) {
    config[key] = GM_getValue(key);
  }

  const result = JSON.stringify(config);
  return result;
}

function reset() {
  const keys = GM_listValues();

  for (const key of keys) {
    GM_deleteValue(key);
  }
}

function setup() {
  // 설정 CSS 등록
  document.head.append(VM.createElement("style", null, css_248z)); // 스크립트 설정 버튼 엘리먼트

  const showSettingBtn = VM.createElement("li", {
    class: "nav-item dropdown",
    id: "showSetting"
  }, VM.createElement("a", {
    "aria-expanded": "false",
    class: "nav-link",
    href: "#"
  }, VM.createElement("span", {
    class: "d-none d-sm-block"
  }, "\uC2A4\uD06C\uB9BD\uD2B8 \uC124\uC815"), VM.createElement("span", {
    class: "d-block d-sm-none"
  }, VM.createElement("span", {
    class: "ion-gear-a"
  })))); // 설정 뷰

  const settingWrapper = VM.createElement("div", {
    class: "hidden clearfix",
    id: "refresherSetting"
  }, VM.createElement("div", {
    class: "row"
  }, VM.createElement("div", {
    class: "col-sm-0 col-md-2"
  }), VM.createElement("div", {
    class: "col-sm-12 col-md-8"
  }, VM.createElement("div", {
    class: "dialog card"
  }, VM.createElement("div", {
    class: "card-block"
  }, VM.createElement("h4", {
    class: "card-title"
  }, "\uC544\uCE74 \uB9AC\uD504\uB808\uC154(Arca Refresher) \uC124\uC815"), VM.createElement("hr", null), VM.createElement("h5", {
    class: "card-title"
  }, "\uC720\uD2F8\uB9AC\uD2F0"), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uC790\uB3D9 \uC0C8\uB85C\uACE0\uCE68"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("select", {
    id: "refreshTime",
    "data-type": "number"
  }, VM.createElement("option", {
    value: "0"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "3"
  }, "3\uCD08"), VM.createElement("option", {
    value: "5"
  }, "5\uCD08"), VM.createElement("option", {
    value: "10"
  }, "10\uCD08")), VM.createElement("p", null, "\uC77C\uC815 \uC2DC\uAC04\uB9C8\uB2E4 \uAC8C\uC2DC\uBB3C \uBAA9\uB85D\uC744 \uAC31\uC2E0\uD569\uB2C8\uB2E4."))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uC0C8\uB85C\uACE0\uCE68 \uC560\uB2C8\uBA54\uC774\uC158 \uC228\uAE40"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("select", {
    id: "hideRefresher",
    "data-type": "bool"
  }, VM.createElement("option", {
    value: "false"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "true"
  }, "\uC0AC\uC6A9")), VM.createElement("p", null))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uB2E8\uCD95\uD0A4 \uC0AC\uC6A9"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("select", {
    id: "useShortcut",
    "data-type": "bool"
  }, VM.createElement("option", {
    value: "false"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "true"
  }, "\uC0AC\uC6A9")), VM.createElement("p", null, VM.createElement("a", {
    href: "https://github.com/lekakid/ArcaRefresher/wiki/Feature#%EB%8B%A8%EC%B6%95%ED%82%A4%EB%A1%9C-%EB%B9%A0%EB%A5%B8-%EC%9D%B4%EB%8F%99",
    target: "_blank",
    rel: "noreferrer"
  }, "\uB2E8\uCD95\uD0A4 \uC548\uB0B4 \uBC14\uB85C\uAC00\uAE30")))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uBE44\uCD94\uCC9C \uC7AC\uD655\uC778 \uCC3D"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("select", {
    id: "blockRatedown",
    "data-type": "bool"
  }, VM.createElement("option", {
    value: "false"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "true"
  }, "\uC0AC\uC6A9")), VM.createElement("p", null))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uC790\uC9E4 \uAD00\uB9AC"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("button", {
    id: "removeMyImage",
    class: "btn btn-success"
  }, "\uC0AD\uC81C"), VM.createElement("p", null, "\uAC8C\uC2DC\uBB3C \uC870\uD68C \uC2DC \uC774\uBBF8\uC9C0 \uC624\uB978\uCABD \uD074\uB9AD \uBA54\uB274\uC5D0\uC11C \uAD00\uB9AC\uD569\uB2C8\uB2E4."))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uB2E4\uC6B4\uB85C\uB354 \uC774\uB984 \uD3EC\uB9F7"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("input", {
    type: "text",
    id: "imageDownloaderFileName"
  }), VM.createElement("p", null, "\uC774\uBBF8\uC9C0 \uC77C\uAD04 \uB2E4\uC6B4\uB85C\uB4DC \uC0AC\uC6A9 \uC2DC \uC800\uC7A5\uD560 \uD30C\uC77C \uC774\uB984\uC785\uB2C8\uB2E4.", VM.createElement("br", null), "%title% : \uAC8C\uC2DC\uBB3C \uC81C\uBAA9", VM.createElement("br", null), "%category% : \uAC8C\uC2DC\uBB3C \uCE74\uD14C\uACE0\uB9AC", VM.createElement("br", null), "%author% : \uAC8C\uC2DC\uBB3C \uC791\uC131\uC790", VM.createElement("br", null), "%channel% : \uCC44\uB110 \uC774\uB984", VM.createElement("br", null)))), VM.createElement("hr", null), VM.createElement("h5", {
    class: "card-title"
  }, "\uC694\uC18C \uC228\uAE40"), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uC6B0\uCE21 \uC0AC\uC774\uB4DC \uBA54\uB274"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("select", {
    id: "hideSideMenu",
    "data-type": "bool"
  }, VM.createElement("option", {
    value: "false"
  }, "\uBCF4\uC784"), VM.createElement("option", {
    value: "true"
  }, "\uC228\uAE40")), VM.createElement("p", null, "\uBCA0\uC2A4\uD2B8 \uB77C\uC774\uBE0C, \uD5E4\uB4DC\uB77C\uC778 \uB4F1 \uC6B0\uCE21 \uC0AC\uC774\uB4DC \uBA54\uB274\uB97C \uC228\uAE41\uB2C8\uB2E4."))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uD504\uB85C\uD544 \uC544\uBC14\uD0C0"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("select", {
    id: "hideAvatar",
    "data-type": "bool"
  }, VM.createElement("option", {
    value: "false"
  }, "\uBCF4\uC784"), VM.createElement("option", {
    value: "true"
  }, "\uC228\uAE40")), VM.createElement("p", null, "\uAC8C\uC2DC\uBB3C \uC870\uD68C \uC2DC \uD504\uB85C\uD544 \uC544\uBC14\uD0C0\uB97C \uC228\uAE41\uB2C8\uB2E4."))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uBCF8\uBB38 \uC774\uBBF8\uC9C0, \uB3D9\uC601\uC0C1"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("select", {
    id: "hideMedia",
    "data-type": "bool"
  }, VM.createElement("option", {
    value: "false"
  }, "\uBCF4\uC784"), VM.createElement("option", {
    value: "true"
  }, "\uC228\uAE40")), VM.createElement("p", null, "\uAC8C\uC2DC\uBB3C \uC870\uD68C \uC2DC \uBCF8\uBB38\uC5D0 \uB098\uC624\uB294 \uC774\uBBF8\uC9C0\uC640 \uB3D9\uC601\uC0C1\uC744 \uC228\uAE41\uB2C8\uB2E4."))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uB313\uAE00 *\uC218\uC815\uB428"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("select", {
    id: "hideModified",
    "data-type": "bool"
  }, VM.createElement("option", {
    value: "false"
  }, "\uBCF4\uC784"), VM.createElement("option", {
    value: "true"
  }, "\uC228\uAE40")), VM.createElement("p", null, "\uC218\uC815\uB41C \uB313\uAE00\uC758 \uC218\uC815\uB428 \uD45C\uAE30\uB97C \uC228\uAE41\uB2C8\uB2E4.", VM.createElement("br", null), "\uC8FC\uC758) \uB313\uAE00 \uC0AD\uC81C \uAD8C\uD55C \uBCF4\uC720 \uC2DC \uC0AD\uC81C\uB428 \uD45C\uAE30\uB3C4 \uAC19\uC774 \uC228\uACA8\uC9D1\uB2C8\uB2E4."))), VM.createElement("hr", null), VM.createElement("h5", {
    class: "card-title"
  }, "\uBA54\uBAA8 \uAE30\uB2A5"), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uBA54\uBAA8\uB41C \uC774\uC6A9\uC790"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("select", {
    id: "userMemo",
    size: "6",
    multiple: "",
    "data-text-format": "%key% - %value%"
  }), VM.createElement("p", null, "\uBA54\uBAA8\uB294 \uAC8C\uC2DC\uBB3C \uC791\uC131\uC790, \uB313\uAE00 \uC791\uC131\uC790 \uC544\uC774\uCF58(IP)\uC744 \uD074\uB9AD\uD574 \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.", VM.createElement("br", null), "Ctrl, Shift, \uB9C8\uC6B0\uC2A4 \uB4DC\uB798\uADF8\uB97C \uC774\uC6A9\uD574\uC11C \uC5EC\uB7EC\uAC1C\uB97C \uB3D9\uC2DC\uC5D0 \uC120\uD0DD \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."))), VM.createElement("hr", null), VM.createElement("h5", {
    class: "card-title"
  }, "\uCC44\uB110 \uC124\uC815"), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uCE74\uD14C\uACE0\uB9AC \uC124\uC815"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("table", {
    class: "table align-middle",
    id: "categorySetting"
  }, VM.createElement("colgroup", null, VM.createElement("col", {
    width: "20%"
  }), VM.createElement("col", {
    width: "20%"
  }), VM.createElement("col", {
    width: "60%"
  })), VM.createElement("thead", null, VM.createElement("th", null, "\uCE74\uD14C\uACE0\uB9AC"), VM.createElement("th", null, "\uC0C9\uC0C1"), VM.createElement("th", null, "\uC124\uC815")), VM.createElement("tbody", null)), VM.createElement("p", null, "\uC0C9\uC0C1: \uCE74\uD14C\uACE0\uB9AC\uB97C \uD45C\uC2DC\uD558\uB294 \uC0C9\uC0C1\uC744 \uBCC0\uACBD\uD569\uB2C8\uB2E4. \uB354\uBE14 \uD074\uB9AD \uC2DC \uBB34\uC791\uC704 \uC0C9\uC0C1\uC774 \uC9C0\uC815\uB429\uB2C8\uB2E4.", VM.createElement("br", null), "\uBBF8\uB9AC\uBCF4\uAE30 \uC228\uAE40: \uB9C8\uC6B0\uC2A4 \uC624\uBC84 \uC2DC \uBCF4\uC5EC\uC8FC\uB294 \uBBF8\uB9AC\uBCF4\uAE30\uB97C \uC81C\uAC70\uD569\uB2C8\uB2E4.", VM.createElement("br", null), "\uAC8C\uC2DC\uBB3C \uBBA4\uD2B8: \uD574\uB2F9 \uCE74\uD14C\uACE0\uB9AC\uAC00 \uD3EC\uD568\uB41C \uAC8C\uC2DC\uBB3C\uC744 \uC228\uAE41\uB2C8\uB2E4."))), VM.createElement("hr", null), VM.createElement("h5", {
    class: "card-title"
  }, "\uBBA4\uD2B8 \uAE30\uB2A5"), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uC0AC\uC6A9\uC790 \uBBA4\uD2B8"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("textarea", {
    id: "blockUser",
    rows: "6",
    placeholder: "\uBBA4\uD2B8\uD560 \uC774\uC6A9\uC790\uC758 \uB2C9\uB124\uC784\uC744 \uC785\uB825, \uC904\uBC14\uAFC8\uC73C\uB85C \uAD6C\uBCC4\uD569\uB2C8\uB2E4."
  }), VM.createElement("p", null, "\uC9C0\uC815\uD55C \uC720\uC800\uC758 \uAC8C\uC2DC\uBB3C\uACFC \uB313\uAE00\uC744 \uC228\uAE41\uB2C8\uB2E4."))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uD0A4\uC6CC\uB4DC \uBBA4\uD2B8"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("textarea", {
    id: "blockKeyword",
    rows: "6",
    placeholder: "\uBBA4\uD2B8\uD560 \uD0A4\uC6CC\uB4DC\uB97C \uC785\uB825, \uC904\uBC14\uAFC8\uC73C\uB85C \uAD6C\uBCC4\uD569\uB2C8\uB2E4."
  }), VM.createElement("p", null, "\uC9C0\uC815\uD55C \uD0A4\uC6CC\uB4DC\uAC00 \uD3EC\uD568\uB41C \uC81C\uBAA9\uC744 \uAC00\uC9C4 \uAC8C\uC2DC\uBB3C\uACFC \uB313\uAE00\uC744 \uC228\uAE41\uB2C8\uB2E4."))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uBBA4\uD2B8\uB41C \uC544\uCE74\uCF58"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("select", {
    id: "blockEmoticon",
    size: "6",
    multiple: "",
    "data-text-format": "%name%"
  }), VM.createElement("p", null, "\uC544\uCE74\uCF58 \uBBA4\uD2B8\uB294 \uB313\uAE00\uC5D0\uC11C \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.", VM.createElement("br", null), "Ctrl, Shift, \uB9C8\uC6B0\uC2A4 \uB4DC\uB798\uADF8\uB97C \uC774\uC6A9\uD574\uC11C \uC5EC\uB7EC\uAC1C\uB97C \uB3D9\uC2DC\uC5D0 \uC120\uD0DD \uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."))), VM.createElement("hr", null), VM.createElement("h5", {
    class: "card-title"
  }, "\uCC44\uB110 \uAD00\uB9AC\uC790 \uC804\uC6A9"), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uC0AD\uC81C \uD14C\uC2A4\uD2B8 \uBAA8\uB4DC"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("select", {
    id: "useAutoRemoverTest",
    "data-type": "bool"
  }, VM.createElement("option", {
    value: "false"
  }, "\uC0AC\uC6A9 \uC548 \uD568"), VM.createElement("option", {
    value: "true"
  }, "\uC0AC\uC6A9")), VM.createElement("p", null, "\uAC8C\uC2DC\uBB3C\uC744 \uC0AD\uC81C\uD558\uC9C0 \uC54A\uACE0 \uC5B4\uB5A4 \uAC8C\uC2DC\uBB3C\uC774 \uC120\uD0DD\uB418\uB294\uC9C0 \uBD89\uC740 \uC0C9\uC73C\uB85C \uBCF4\uC5EC\uC90D\uB2C8\uB2E4."))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uC720\uC800 \uAC8C\uC2DC\uBB3C \uC0AD\uC81C"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("textarea", {
    id: "autoRemoveUser",
    rows: "6",
    placeholder: "\uB300\uC0C1 \uC774\uC6A9\uC790\uB97C \uC904\uBC14\uAFC8\uC73C\uB85C \uAD6C\uBCC4\uD558\uC5EC \uC785\uB825\uD569\uB2C8\uB2E4."
  }), VM.createElement("p", null, "\uC9C0\uC815\uD55C \uC720\uC800\uC758 \uAC8C\uC2DC\uBB3C\uC744 \uC790\uB3D9\uC73C\uB85C \uC0AD\uC81C\uD569\uB2C8\uB2E4."))), VM.createElement("div", {
    class: "row"
  }, VM.createElement("label", {
    class: "col-md-3"
  }, "\uD0A4\uC6CC\uB4DC \uD3EC\uD568 \uAC8C\uC2DC\uBB3C \uC0AD\uC81C"), VM.createElement("div", {
    class: "col-md-9"
  }, VM.createElement("textarea", {
    id: "autoRemoveKeyword",
    rows: "6",
    placeholder: "\uC0AD\uC81C\uD560 \uD0A4\uC6CC\uB4DC\uB97C \uC785\uB825, \uC904\uBC14\uAFC8\uC73C\uB85C \uAD6C\uBCC4\uD569\uB2C8\uB2E4."
  }), VM.createElement("p", null, "\uC9C0\uC815\uD55C \uD0A4\uC6CC\uB4DC\uAC00 \uD3EC\uD568\uB41C \uC81C\uBAA9\uC744 \uAC00\uC9C4 \uAC8C\uC2DC\uBB3C\uC744 \uC0AD\uC81C\uD569\uB2C8\uB2E4."))), VM.createElement("div", {
    class: "row btns"
  }, VM.createElement("div", {
    class: "col-12"
  }, VM.createElement("a", {
    href: "#",
    id: "exportConfig",
    class: "btn btn-primary"
  }, "\uC124\uC815 \uB0B4\uBCF4\uB0B4\uAE30"), VM.createElement("a", {
    href: "#",
    id: "importConfig",
    class: "btn btn-secondary"
  }, "\uC124\uC815 \uAC00\uC838\uC624\uAE30"), VM.createElement("a", {
    href: "#",
    id: "resetConfig",
    class: "btn btn-danger"
  }, "\uC124\uC815 \uCD08\uAE30\uD654"))), VM.createElement("div", {
    class: "row btns"
  }, VM.createElement("div", {
    class: "col-12"
  }, VM.createElement("a", {
    href: "#",
    id: "saveAndClose",
    class: "btn btn-primary"
  }, "\uC800\uC7A5"), VM.createElement("a", {
    href: "#",
    id: "closeSetting",
    class: "btn btn-success"
  }, "\uB2EB\uAE30"))))))));
  const contentWrapper = document.querySelector('.content-wrapper'); // 설정 버튼 클릭 이벤트

  showSettingBtn.addEventListener('click', () => {
    if (settingWrapper.classList.contains('hidden')) {
      loadConfig();
      contentWrapper.classList.add('disappear');
    } else {
      settingWrapper.classList.add('disappear');
    }
  }); // 애니메이션 처리

  contentWrapper.addEventListener('animationend', () => {
    if (contentWrapper.classList.contains('disappear')) {
      contentWrapper.classList.add('hidden');
      contentWrapper.classList.remove('disappear');
      settingWrapper.classList.add('appear');
      settingWrapper.classList.remove('hidden');
    } else if (contentWrapper.classList.contains('appear')) {
      contentWrapper.classList.remove('appear');
    }
  });
  settingWrapper.addEventListener('animationend', () => {
    if (settingWrapper.classList.contains('disappear')) {
      settingWrapper.classList.add('hidden');
      settingWrapper.classList.remove('disappear');
      contentWrapper.classList.add('appear');
      contentWrapper.classList.remove('hidden');
    } else if (settingWrapper.classList.contains('appear')) {
      settingWrapper.classList.remove('appear');
    }
  }); // 헤더에 버튼 부착

  document.querySelector('ul.navbar-nav').append(showSettingBtn);
  contentWrapper.insertAdjacentElement('afterend', settingWrapper);
  const comboElements = settingWrapper.querySelectorAll('select:not([multiple])');
  const textareaElements = settingWrapper.querySelectorAll('textarea');
  const textElements = settingWrapper.querySelectorAll('input[type="text"]');
  const listElements = settingWrapper.querySelectorAll('select[multiple]');

  for (const element of listElements) {
    const btnElement = VM.createElement("button", {
      href: "#",
      class: "btn btn-success"
    }, "\uC0AD\uC81C");
    btnElement.addEventListener('click', event => {
      event.target.disabled = true;
      const removeElements = element.selectedOptions;

      while (removeElements.length > 0) removeElements[0].remove();

      event.target.disabled = false;
    });
    element.insertAdjacentElement('afterend', btnElement);
  } // 이벤트 핸들러


  settingWrapper.querySelector('#removeMyImage').addEventListener('click', event => {
    event.target.disabled = true;

    if (confirm('등록한 자짤을 삭제하시겠습니까?')) {
      GM_setValue('myImage', '');
      alert('삭제되었습니다.');
    }

    event.target.disabled = false;
  });
  settingWrapper.querySelector('#exportConfig').addEventListener('click', event => {
    event.preventDefault();
    const data = btoa(encodeURIComponent(exportConfig()));
    navigator.clipboard.writeText(data);
    alert('클립보드에 설정이 복사되었습니다.');
  });
  settingWrapper.querySelector('#importConfig').addEventListener('click', event => {
    event.preventDefault();
    let data = prompt('가져올 설정 데이터를 입력해주세요');
    if (data == null) return;

    try {
      if (data == '') throw '[Setting/importConfig] 공백 값을 입력했습니다.';
      data = decodeURIComponent(atob(data));
      const config = JSON.parse(data);

      for (const key in config) {
        if ({}.hasOwnProperty.call(config, key)) {
          GM_setValue(key, config[key]);
        }
      }

      location.reload();
    } catch (error) {
      alert('올바르지 않은 데이터입니다.');
      console.error(error);
    }
  });
  settingWrapper.querySelector('#resetConfig').addEventListener('click', event => {
    event.preventDefault();
    if (!confirm('모든 설정이 초기화 됩니다. 계속하시겠습니까?')) return;
    reset();
    location.reload();
  });
  settingWrapper.querySelector('#saveAndClose').addEventListener('click', event => {
    event.preventDefault();

    for (const element of comboElements) {
      let value;

      switch (element.dataset.type) {
        case 'number':
          value = Number(element.value);
          break;

        case 'bool':
          value = element.value == 'true';
          break;

        default:
          value = null;
          break;
      }

      GM_setValue(element.id, value);
    }

    for (const element of textElements) {
      GM_setValue(element.id, element.value);
    }

    for (const element of textareaElements) {
      let value;

      if (element.value != '') {
        value = element.value.split('\n');
        value = value.filter(item => {
          return item != '';
        });
      } else {
        value = [];
      }

      GM_setValue(element.id, value);
    }

    for (const element of listElements) {
      const data = GM_getValue(element.id, defaultConfig[element.id]);
      const options = element.querySelectorAll('option');
      const keys = Array.from(options, o => o.value);

      for (const key in data) {
        if (keys.indexOf(key) == -1) delete data[key];
      }

      GM_setValue(element.id, data);
    }

    if (settingWrapper.querySelector('#categorySetting tbody').childElementCount == 0) {
      location.reload();
    }
  });
  settingWrapper.querySelector('#closeSetting').addEventListener('click', () => {
    settingWrapper.classList.add('disappear');
  });
}

function loadConfig() {
  const settingWrapper = document.querySelector('#refresherSetting'); // 설정 값 불러오기

  const comboElements = settingWrapper.querySelectorAll('select:not([multiple])');

  for (const element of comboElements) {
    element.value = GM_getValue(element.id, defaultConfig[element.id]);
  }

  const textareaElements = settingWrapper.querySelectorAll('textarea');

  for (const element of textareaElements) {
    element.value = GM_getValue(element.id, defaultConfig[element.id]).join('\n');
  }

  const textElements = settingWrapper.querySelectorAll('input[id][type="text"]');

  for (const element of textElements) {
    element.value = GM_getValue(element.id, defaultConfig[element.id]);
  }

  const listElements = settingWrapper.querySelectorAll('select[multiple]');

  for (const element of listElements) {
    if (element.childElementCount) {
      while (element.childElementCount) element.removeChild(element.firstChild);
    }

    const data = GM_getValue(element.id, defaultConfig[element.id]);

    for (const key of Object.keys(data)) {
      const option = VM.createElement("option", null);
      option.value = key;
      const reservedWord = element.dataset.textFormat.match(/%\w*%/g);
      let text = element.dataset.textFormat;

      if (text != '') {
        for (const word of reservedWord) {
          switch (word) {
            case '%key%':
              text = text.replace(word, key);
              break;

            case '%value%':
              text = text.replace(word, data[key]);
              break;

            default:
              text = text.replace(word, data[key][word.replace(/%/g, '')]);
              break;
          }
        }
      } else {
        text = key;
      }

      option.textContent = text;
      element.append(option);
    }
  }
}

function setupCategory(channel) {
  const settingWrapper = document.querySelector('#refresherSetting');
  const showSettingBtn = document.getElementById('showSetting');
  const categoryTable = settingWrapper.querySelector('#categorySetting tbody'); // 설정 버튼 클릭 이벤트

  showSettingBtn.addEventListener('click', () => {
    if (settingWrapper.classList.contains('hidden')) {
      loadCategoryConfig(channel);
    }
  }); // 카테고리 목록 등록

  const boardCategoryElements = document.querySelectorAll('.board-category a');

  for (const element of boardCategoryElements) {
    const name = element.textContent == '전체' ? '일반' : element.textContent;
    const tableCategoryElement = VM.createElement("tr", {
      id: name
    }, VM.createElement("td", null, name), name == '일반' && VM.createElement("td", null, VM.createElement("input", {
      type: "text",
      name: "color",
      placeholder: "000000",
      disabled: ""
    })), name != '일반' && VM.createElement("td", null, VM.createElement("input", {
      type: "text",
      name: "color",
      placeholder: "000000",
      maxlength: "6"
    })), VM.createElement("td", null, VM.createElement("label", null, VM.createElement("input", {
      type: "checkbox",
      name: "blockPreview"
    }), VM.createElement("span", null, " \uBBF8\uB9AC\uBCF4\uAE30 \uC228\uAE40 ")), VM.createElement("label", null, VM.createElement("input", {
      type: "checkbox",
      name: "blockArticle"
    }), VM.createElement("span", null, " \uAC8C\uC2DC\uBB3C \uBBA4\uD2B8 "))));
    categoryTable.append(tableCategoryElement);
  } // 이벤트 핸들러


  categoryTable.addEventListener('keypress', event => {
    const regex = /[0-9a-fA-F]/;
    if (!regex.test(event.key)) event.preventDefault();
  });
  categoryTable.addEventListener('dblclick', event => {
    if (event.target.name != 'color') return;
    if (event.target.disabled) return;
    const color = getRandomColor();
    event.target.value = color;
    event.target.style.backgroundColor = `#${color}`;
    event.target.style.color = getContrastYIQ(color);
  });
  categoryTable.addEventListener('input', event => {
    if (event.target.value.length == 6 || event.target.value.length == 3) {
      const color = event.target.value;
      const textColor = getContrastYIQ(color);
      event.target.style.backgroundColor = `#${color}`;
      event.target.style.color = textColor;
    } else {
      event.target.style.backgroundColor = '';
      event.target.style.color = '';
    }
  });
  settingWrapper.querySelector('#saveAndClose').addEventListener('click', event => {
    event.preventDefault();
    const categoryConfig = GM_getValue('category', defaultConfig.category);
    const rows = settingWrapper.querySelectorAll('#categorySetting tr');

    if (categoryConfig[channel] == undefined) {
      categoryConfig[channel] = {};
    }

    for (const row of rows) {
      if (categoryConfig[channel][row.id] == undefined) {
        categoryConfig[channel][row.id] = {};
      }

      categoryConfig[channel][row.id].color = row.querySelector('[name="color"]').value.toUpperCase();
      categoryConfig[channel][row.id].blockPreview = row.querySelector('[name="blockPreview"]').checked;
      categoryConfig[channel][row.id].blockArticle = row.querySelector('[name="blockArticle"]').checked;
    }

    GM_setValue('category', categoryConfig);
    location.reload();
  });
}

function loadCategoryConfig(channel) {
  // 카테고리 설정 불러오기
  const categoryConfig = GM_getValue('category', defaultConfig.category);

  if (categoryConfig[channel] == undefined) {
    categoryConfig[channel] = {};
  }

  for (const key of Object.keys(categoryConfig[channel])) {
    const row = document.getElementById(key);

    if (row) {
      const colorInput = row.querySelector('[name="color"]');
      colorInput.value = categoryConfig[channel][key].color;

      if (categoryConfig[channel][key].color == '') {
        colorInput.style.backgroundColor = '';
        colorInput.style.color = '';
      } else {
        colorInput.style.backgroundColor = `#${categoryConfig[channel][key].color}`;
        colorInput.style.color = getContrastYIQ(categoryConfig[channel][key].color);
      }

      row.querySelector('[name="blockPreview"]').checked = categoryConfig[channel][key].blockPreview;
      row.querySelector('[name="blockArticle"]').checked = categoryConfig[channel][key].blockArticle;
    }
  }
}

function apply() {
  const hideAvatar = GM_getValue('hideAvatar', defaultConfig.hideAvatar);
  const hideMedia = GM_getValue('hideMedia', defaultConfig.hideMedia);
  const hideModified = GM_getValue('hideModified', defaultConfig.hideModified);
  const hideSideMenu = GM_getValue('hideSideMenu', defaultConfig.hideSideMenu);
  const contentWrapper = document.querySelector('.content-wrapper');
  if (hideAvatar) contentWrapper.classList.add('hide-avatar');
  if (hideMedia) contentWrapper.classList.add('hide-media');
  if (hideModified) contentWrapper.classList.add('hide-modified');
  if (hideSideMenu) contentWrapper.classList.add('hide-sidemenu');
}

function filter(articles, channel) {
  const categoryConfig = GM_getValue('category', defaultConfig.category);
  articles.forEach(article => {
    const badge = article.querySelector('.badge');
    if (badge == null) return;
    let category = badge.textContent;
    category = category == '' ? '일반' : category;
    const preview = article.querySelector('.vrow-preview');

    if (categoryConfig[channel] && categoryConfig[channel][category]) {
      const filtered = categoryConfig[channel][category].blockPreview || false;
      if (filtered && preview != null) preview.remove();
    }
  });
}

var css_248z$1 = "#imageList {\r\n    margin: 1rem 0;\r\n}\r\n\r\n#imageList img {\r\n    width: 50px;\r\n}\r\n\r\n#imageList .video-placeholder {\r\n    display: flex;\r\n    height: 50px;\r\n    align-items: center;\r\n    justify-content: center;\r\n}\r\n\r\n#imageList tbody a {\r\n    word-break: break-all;\r\n    color: #000;\r\n}\r\n\r\n#imageList tfoot td {\r\n    padding: 0;\r\n}\r\n\r\n#imageList button {\r\n    width: 100%;\r\n    margin: 0;\r\n}\r\n\r\n@media (prefers-color-scheme:dark) {\r\n    #imageList tbody a {\r\n        color: #e2e2e2;\r\n    }\r\n}";

function apply$1() {
  const data = parse();
  if (data.length == 0) return;
  document.head.append(VM.createElement("style", null, css_248z$1));
  const table = VM.createElement("div", {
    class: "article-image hidden"
  }, VM.createElement("table", {
    class: "table align-middle",
    id: "imageList"
  }, VM.createElement("colgroup", null, VM.createElement("col", {
    width: "5%"
  }), VM.createElement("col", {
    width: "10%"
  }), VM.createElement("col", {
    width: "85%"
  })), VM.createElement("thead", null, VM.createElement("th", null, VM.createElement("input", {
    type: "checkbox",
    name: "selectAll"
  })), VM.createElement("th", null, "\uC378\uB124\uC77C"), VM.createElement("th", null, "\uD30C\uC77C\uBA85")), VM.createElement("tbody", null), VM.createElement("tfoot", null, VM.createElement("td", {
    colspan: "3"
  }, VM.createElement("button", {
    class: "btn btn-success"
  }, "\uC77C\uAD04 \uB2E4\uC6B4\uB85C\uB4DC")))));
  const enableBtn = VM.createElement("a", {
    href: "#",
    class: "btn btn-success"
  }, VM.createElement("span", {
    class: "ion-ios-download-outline"
  }), " \uC774\uBBF8\uC9C0 \uB2E4\uC6B4\uB85C\uB4DC \uBAA9\uB85D \uBCF4\uC774\uAE30");
  enableBtn.addEventListener('click', event => {
    event.preventDefault();

    if (table.classList.contains('hidden')) {
      table.classList.remove('hidden');
    } else {
      table.classList.add('hidden');
    }
  });
  document.querySelector('.article-body').insertAdjacentElement('afterend', enableBtn).insertAdjacentElement('afterend', table);
  const list = table.querySelector('tbody');

  for (const d of data) {
    const itemElement = VM.createElement("tr", null, VM.createElement("td", null, VM.createElement("input", {
      type: "checkbox",
      name: "select"
    })), VM.createElement("td", null, d.type == 'image' && VM.createElement("img", {
      src: d.thumb
    }), d.type != 'image' && VM.createElement("div", {
      class: "video-placeholder"
    }, VM.createElement("span", {
      class: "ion-ios-videocam"
    }, " \uB3D9\uC601\uC0C1"))), VM.createElement("td", null, VM.createElement("a", {
      href: "#",
      "data-url": d.url
    }, d.image)));
    list.append(itemElement);
  }

  table.addEventListener('click', async event => {
    if (event.target.tagName == 'A') {
      event.preventDefault();
      const url = event.target.dataset.url;

      if (url != '') {
        event.target.dataset.url = '';
        const filename = event.target.textContent;
        const file = await download(url, event.target, '다운로드 중...[percent]%', filename);
        window.saveAs(file, filename);
        event.target.dataset.url = url;
      }
    } else if (event.target.name == 'selectAll') {
      const inputElements = table.querySelectorAll('input[type="checkbox"]');

      for (const i of inputElements) {
        i.checked = event.target.checked;
      }
    }
  });
  const downloadBtn = table.querySelector('tfoot button');
  downloadBtn.addEventListener('click', async event => {
    event.preventDefault();
    downloadBtn.disabled = true;
    const checkboxElements = list.querySelectorAll('input[type="checkbox"]');
    const urlElements = list.querySelectorAll('a');
    const originalText = downloadBtn.textContent;
    const downloadList = [];
    const nameList = [];

    for (let i = 0; i < urlElements.length; i += 1) {
      if (checkboxElements[i].checked) {
        downloadList.push(urlElements[i].dataset.url);
        nameList.push(urlElements[i].textContent);
      }
    }

    if (downloadList.length == 0) {
      alert('선택된 파일이 없습니다.');
      downloadBtn.disabled = false;
      return;
    }

    const zip = new JSZip();
    const total = downloadList.length;

    for (let i = 0; i < total; i += 1) {
      const file = await download(downloadList[i], downloadBtn, `다운로드 중...[percent]% (${i}/${total})`);
      zip.file(`${`${i}`.padStart(3, '0')}_${nameList[i]}`, file);
    }

    downloadBtn.textContent = originalText;
    const title = document.querySelector('.article-head .title');
    const category = document.querySelector('.article-head .badge');
    const author = document.querySelector('.article-head .user-info');
    const channel = document.querySelector('.board-title a:not([class])');
    let filename = GM_getValue('imageDownloaderFileName', defaultConfig.imageDownloaderFileName);
    const reservedWord = filename.match(/%\w*%/g);

    for (const word of reservedWord) {
      try {
        switch (word) {
          case '%title%':
            filename = filename.replace(word, title.textContent.trim());
            break;

          case '%category%':
            filename = filename.replace(word, category.textContent.trim());
            break;

          case '%author%':
            filename = filename.replace(word, author.innerText.trim());
            break;

          case '%channel%':
            filename = filename.replace(word, channel.textContent.trim());
            break;

          default:
            break;
        }
      } catch (error) {
        console.warn(error);
        filename = filename.replace(word, '');
      }
    }

    const zipblob = await zip.generateAsync({
      type: 'blob'
    });
    window.saveAs(zipblob, `${filename}.zip`);
    downloadBtn.disabled = false;
  });
}

function parse() {
  const images = document.querySelectorAll('.article-body img, .article-body video');
  const result = [];
  images.forEach(element => {
    let src = element.src;

    if (element.getAttribute('data-orig') != null) {
      src += `.${element.getAttribute('data-orig')}`;
    }

    const item = {};
    item.thumb = `${src}?type=list`;
    item.url = `${src}?type=orig`;
    item.image = src.replace(/.*\.arca\.live\/.*\//, '').replace(/\..*\./, '.');
    item.type = ['gif', 'png', 'jpg', 'jpeg', 'wepb'].indexOf(item.image.split('.')[1]) > -1 ? 'image' : 'video';
    result.push(item);
  });
  return result;
}

function download(url, element, progressString, loadString) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'blob',
      onprogress: event => {
        let text = null;

        if (progressString) {
          text = progressString.replace('[percent]', Math.round(event.loaded / event.total * 100));
        } else {
          text = `${Math.round(event.loaded / event.total * 100)}%`;
        }

        if (element) element.textContent = text;
      },
      onload: response => {
        if (loadString) element.textContent = loadString;
        resolve(response.response);
      },
      onerror: reject
    });
  });
}

var styles = {"wrapper":"ArticleContextMenu-module_wrapper__HgPxK","menu":"ArticleContextMenu-module_menu__156PJ","devider":"ArticleContextMenu-module_devider__28LCE","item":"ArticleContextMenu-module_item__18yvS"};
var stylesheet=".ArticleContextMenu-module_wrapper__HgPxK {\r\n    position: fixed;\r\n    display:flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    top: 0;\r\n    left: 0;\r\n    background-color: rgba(0, 0, 0, 0);\r\n    width: 100%;\r\n    height: 100%;\r\n    pointer-events: none;\r\n}\r\n\r\n.ArticleContextMenu-module_menu__156PJ {\r\n    position: absolute;\r\n    width: 300px;\r\n    padding: .5rem;\r\n    border: 1px solid #bbb;\r\n    background-color: #fff;\r\n    z-index: 20;\r\n    pointer-events: auto;\r\n}\r\n\r\n.ArticleContextMenu-module_menu__156PJ .ArticleContextMenu-module_devider__28LCE {\r\n    height: 1px;\r\n    margin: .5rem 0;\r\n    overflow: hidden;\r\n    background-color: #e5e5e5;\r\n}\r\n\r\n.ArticleContextMenu-module_menu__156PJ .ArticleContextMenu-module_item__18yvS {\r\n    display: block;\r\n    width: 100%;\r\n    padding: 3px 20px;\r\n    clear: both;\r\n    font-weight: 400;\r\n    color: #373a3c;\r\n    white-space: nowrap;\r\n    border: 0;\r\n}\r\n\r\n.ArticleContextMenu-module_menu__156PJ .ArticleContextMenu-module_item__18yvS:hover,\r\n.ArticleContextMenu-module_menu__156PJ .ArticleContextMenu-module_item__18yvS:focus {\r\n    color: #2b2d2f;\r\n    background-color: #f5f5f5;\r\n    text-decoration: none;\r\n}";

function apply$2() {
  const articleBody = document.querySelector('article .article-body');
  if (articleBody == null) return;
  document.head.append(VM.createElement("style", null, stylesheet));
  const wrapper = VM.createElement("div", {
    class: `${styles.wrapper} hidden`
  }, VM.createElement("div", {
    class: styles.menu,
    id: "context-menu",
    "data-url": "",
    "data-html": "",
    "data-orig": ""
  }, VM.createElement("a", {
    href: "#",
    class: styles.item,
    id: "copy-clipboard"
  }, "\uC774\uBBF8\uC9C0\uB97C \uD074\uB9BD\uBCF4\uB4DC\uC5D0 \uBCF5\uC0AC"), VM.createElement("a", {
    href: "#",
    class: styles.item,
    id: "save"
  }, "SAVE_SOMETHING"), VM.createElement("a", {
    href: "#",
    class: styles.item,
    id: "copy-url"
  }, "\uC6D0\uBCF8 \uC8FC\uC18C \uBCF5\uC0AC"), VM.createElement("a", {
    href: "#",
    class: styles.item,
    id: "apply-myimage"
  }, "\uC790\uC9E4\uB85C \uB4F1\uB85D"), VM.createElement("div", {
    id: "search-wrapper"
  }, VM.createElement("div", {
    class: styles.devider
  }), VM.createElement("a", {
    href: "",
    class: styles.item,
    id: "search-google",
    target: "_blank",
    rel: "noreferrer"
  }, "Google \uAC80\uC0C9"), VM.createElement("a", {
    href: "",
    class: styles.item,
    id: "search-yandex",
    target: "_blank",
    rel: "noreferrer",
    title: "\uB7EC\uC2DC\uC544 \uAC80\uC0C9\uC5D4\uC9C4\uC785\uB2C8\uB2E4."
  }, "Yandex \uAC80\uC0C9"), VM.createElement("a", {
    href: "#",
    class: styles.item,
    id: "search-saucenao",
    target: "_blank",
    title: "\uB9DD\uAC00, \uD53D\uC2DC\uBE0C \uC0AC\uC774\uD2B8 \uAC80\uC0C9\uC744 \uC9C0\uC6D0\uD569\uB2C8\uB2E4."
  }, "SauceNao \uAC80\uC0C9"), VM.createElement("a", {
    href: "#",
    class: styles.item,
    id: "search-twigaten",
    target: "_blank",
    title: "\uD2B8\uC704\uD130 \uC774\uBBF8\uC9C0 \uAC80\uC0C9\uC744 \uC9C0\uC6D0\uD569\uB2C8\uB2E4."
  }, "TwiGaTen \uAC80\uC0C9"), VM.createElement("a", {
    href: "#",
    class: styles.item,
    id: "search-ascii2d",
    target: "_blank",
    title: "\uD2B8\uC704\uD130, \uD53D\uC2DC\uBE0C \uC0AC\uC774\uD2B8 \uAC80\uC0C9\uC744 \uC9C0\uC6D0\uD569\uB2C8\uB2E4."
  }, "Ascii2D \uAC80\uC0C9"))));
  wrapper.addEventListener('contextmenu', event => {
    event.preventDefault();
  });
  wrapper.addEventListener('click', onClickContextMenu);
  document.querySelector('.root-container').append(wrapper);
  const context = wrapper.querySelector('#context-menu');

  function closeContext() {
    if (!wrapper.classList.contains('hidden')) wrapper.classList.add('hidden');
  }

  function onAnimationEnd() {
    if (wrapper.classList.contains('appear')) {
      wrapper.classList.remove('appear');
    }
  }

  wrapper.addEventListener('animationend', onAnimationEnd);
  document.addEventListener('click', closeContext);
  document.addEventListener('contextmenu', closeContext);
  document.addEventListener('scroll', closeContext);
  articleBody.addEventListener('contextmenu', event => {
    if (event.target.tagName != 'IMG' && event.target.tagName != 'VIDEO') return;

    if (!wrapper.classList.contains(styles.mobile)) {
      context.setAttribute('style', `left: ${event.clientX + 2}px; top: ${event.clientY + 2}px`);
    }

    if (!wrapper.classList.contains('hidden')) {
      wrapper.classList.add('hidden');
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    wrapper.classList.remove('hidden');
    let url = event.target.src;
    let type;

    if (event.target.getAttribute('data-orig')) {
      url = `${url}.${event.target.getAttribute('data-orig')}?type=orig`;
      type = event.target.getAttribute('data-orig');
    } else {
      url = `${url}?type=orig`;
      type = event.target.src.replace(/.*\.arca\.live\/.*\/.*\./, '');
    }

    context.setAttribute('data-url', url);
    context.setAttribute('data-html', event.target.outerHTML);
    context.querySelector('#search-google').href = `https://www.google.com/searchbyimage?safe=off&image_url=${url}`;
    context.querySelector('#search-yandex').href = `https://yandex.com/images/search?rpt=imageview&url=${url}`;

    if (['gif', 'png', 'jpg', 'jpeg', 'wepb'].indexOf(type) > -1) {
      context.querySelector('#copy-clipboard').removeAttribute('style');
      context.querySelector('#save').innerText = '원본 이미지 저장';
      context.querySelector('#search-wrapper').removeAttribute('style');
    } else {
      context.querySelector('#copy-clipboard').setAttribute('style', 'display:none');
      context.querySelector('#save').innerText = '원본 비디오 저장';
      context.querySelector('#search-wrapper').setAttribute('style', 'display:none');
    }
  });
}

async function onClickContextMenu(event) {
  const context = document.querySelector('#context-menu');
  const originalText = event.target.textContent;

  if (event.target.id == 'copy-clipboard') {
    event.preventDefault();
    event.stopPropagation();
    const url = context.getAttribute('data-url');
    GM_xmlhttpRequest({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
      onprogress: e => {
        event.target.textContent = `${Math.round(e.loaded / e.total * 100)}%`;
      },
      onload: response => {
        const buffer = response.response;
        const blob = new Blob([buffer], {
          type: 'image/png'
        });
        const item = new ClipboardItem({
          [blob.type]: blob
        });
        navigator.clipboard.write([item]);
        context.parentNode.classList.add('hidden');
        event.target.textContent = originalText;
      }
    });
    return;
  }

  if (event.target.id == 'save') {
    event.preventDefault();
    event.stopPropagation();
    const url = context.getAttribute('data-url');
    const imgBlob = await download(url, event.target, '[percent]%', event.target.textContent);
    window.saveAs(imgBlob, `image.${imgBlob.type.split('/')[1]}`);
    context.parentNode.classList.add('hidden');
  }

  if (event.target.id == 'copy-url') {
    event.preventDefault();
    const url = context.getAttribute('data-url');
    navigator.clipboard.writeText(url);
  }

  if (event.target.id == 'apply-myimage') {
    event.preventDefault();
    const html = context.getAttribute('data-html');
    GM_setValue('myImage', html);
    alert('선택한 짤이 등록되었습니다.\n새 게시물 작성 시 최상단에 자동으로 첨부됩니다.');
  }

  if (event.target.id.indexOf('search') > -1) {
    if (event.target.id == 'search-google') return;
    if (event.target.id == 'search-yandex') return;
    event.preventDefault();
    event.stopPropagation();
    const img = context.getAttribute('data-url');
    const db = event.target.id.split('-')[1];

    try {
      const imgBlob = await download(img, event.target);
      event.target.textContent = '업로드 중...';
      let url = '';
      const formdata = new FormData();
      formdata.append('file', imgBlob, `image.${imgBlob.type.split('/')[1]}`);

      if (db == 'saucenao') {
        formdata.append('frame', 1);
        formdata.append('database', 999);
        url = 'https://saucenao.com/search.php';
      } else if (db == 'ascii2d') {
        const tokenDocument = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://ascii2d.net',
            responseType: 'document',
            data: formdata,
            onload: resolve,
            onerror: () => {
              reject(new Error('Access Rejected'));
            }
          });
        });
        const token = tokenDocument.response.querySelector('input[name="authenticity_token"]').value;
        formdata.append('utf8', '✓');
        formdata.append('authenticity_token', token);
        url = 'https://ascii2d.net/search/file';
      } else if (db == 'twigaten') {
        url = 'https://twigaten.204504byse.info/search/media';
      }

      const result = await new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url,
          responseType: 'document',
          data: formdata,
          onload: resolve,
          onerror: () => {
            reject(new Error('Access Rejected'));
          }
        });
      });

      if (db == 'saucenao') {
        const replaceURL = result.response.querySelector('#yourimage a').href.split('image=')[1];
        window.open(`https://saucenao.com/search.php?db=999&url=https://saucenao.com/userdata/tmp/${replaceURL}`);
      } else if (db == 'ascii2d') {
        window.open(result.finalUrl);
      } else if (db == 'twigaten') {
        window.open(result.finalUrl);
      }
    } catch (error) {
      alert('업로드 중 발생했습니다.\n개발자 도구(F12)의 콘솔(Console) 탭을 캡처해서 문의바랍니다.');
      console.error(error);
    } finally {
      context.parentNode.classList.add('hidden');
      event.target.textContent = originalText;
    }
  }
}

function getTimeStr(datetime) {
  const date = new Date(datetime);
  let hh = date.getHours();
  let mm = date.getMinutes();

  if (hh.toString().length == 1) {
    hh = `0${hh}`;
  }

  if (mm.toString().length == 1) {
    mm = `0${mm}`;
  }

  return `${hh}:${mm}`;
}
function getDateStr(datetime) {
  const date = new Date(datetime);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hh = date.getHours();
  let mm = date.getMinutes();
  let ss = date.getSeconds();

  if (month.toString().length == 1) {
    month = `0${month}`;
  }

  if (day.toString().length == 1) {
    day = `0${day}`;
  }

  if (hh.toString().length == 1) {
    hh = `0${hh}`;
  }

  if (mm.toString().length == 1) {
    mm = `0${mm}`;
  }

  if (ss.toString().length == 1) {
    ss = `0${ss}`;
  }

  return `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
}
function in24(datetime) {
  const target = new Date(datetime);
  const criteria = new Date();
  criteria.setHours(criteria.getHours() - 24);
  if (target > criteria) return true;
  return false;
}

function blockArticle(board, articles, channel) {
  if (document.readyState != 'complete') {
    window.addEventListener('load', () => {
      blockArticle(board, articles, channel);
    }, {
      once: true
    });
    return;
  }

  const count = {
    keyword: 0,
    user: 0,
    category: 0,
    notice: 0,
    all: 0
  };
  let userlist = GM_getValue('blockUser', defaultConfig.blockUser);
  let keywordlist = GM_getValue('blockKeyword', defaultConfig.blockKeyword);
  const categoryConfig = GM_getValue('category', defaultConfig.category);

  if ((unsafeWindow.LiveConfig || undefined) && unsafeWindow.LiveConfig.mute != undefined) {
    userlist.push(...unsafeWindow.LiveConfig.mute.users);
    keywordlist.push(...unsafeWindow.LiveConfig.mute.keywords);
    userlist = Array.from(new Set(userlist));
    keywordlist = Array.from(new Set(keywordlist));
  }

  articles.forEach(item => {
    const title = item.querySelector('.col-title');
    const author = item.querySelector('.col-author');
    const categoryElement = item.querySelector('.badge');
    let category;

    if (categoryElement == null || categoryElement.textContent == '') {
      category = '일반';
    } else {
      category = categoryElement.textContent;
    }

    const authorAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(author.innerText);
    const titleAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(title.innerText);
    let categoryAllow = false;

    if (categoryConfig[channel] && categoryConfig[channel][category]) {
      categoryAllow = categoryConfig[channel][category].blockArticle;
    }

    if (titleAllow) {
      item.classList.add('filtered');
      item.classList.add('filtered-keyword');
      count.keyword += 1;
    }

    if (authorAllow) {
      item.classList.add('filtered');
      item.classList.add('filtered-user');
      count.user += 1;
    }

    if (categoryAllow) {
      item.classList.add('filtered');
      item.classList.add('filtered-category');
      count.category += 1;
    }

    if (item.classList.contains('notice-board') && item.nextElementSibling.classList.contains('notice-board')) {
      item.classList.add('filtered');
      item.classList.add('filtered-notice');
      count.notice += 1;
    }

    if (item.classList.contains('filtered')) count.all += 1;
  });
  let toggleHeader = board.querySelector('.frontend-header');
  if (toggleHeader) toggleHeader.remove();
  toggleHeader = VM.createElement("div", {
    class: "frontend-header"
  }, VM.createElement("span", {
    class: "filter-title"
  }, "\uD544\uD130\uB41C \uAC8C\uC2DC\uBB3C"), VM.createElement("span", {
    class: "filter-count-container"
  }));
  const container = toggleHeader.querySelector('.filter-count-container');

  if (count.all > 0) {
    board.prepend(toggleHeader);

    for (const key of Object.keys(count)) {
      if (count[key] > 0) {
        let className = `show-filtered-${key}`;
        if (key == 'all') className = 'show-filtered';
        let text;

        switch (key) {
          case 'all':
            text = '전체';
            break;

          case 'keyword':
            text = '키워드';
            break;

          case 'user':
            text = '사용자';
            break;

          case 'category':
            text = '카테고리';
            break;

          case 'notice':
            text = '공지';
            break;
        }

        const btn = VM.createElement("span", {
          class: `filter-count filter-count-${key}`
        }, text, " (", count[key], ")");
        container.append(btn);
        btn.addEventListener('click', () => {
          if (board.classList.contains(className)) {
            board.classList.remove(className);
          } else {
            board.classList.add(className);
          }
        });

        if (key == 'notice') {
          // eslint-disable-next-line no-loop-func
          btn.addEventListener('click', () => {
            if (board.classList.contains(className)) {
              GM_setValue('hideNotice', false);
            } else {
              GM_setValue('hideNotice', true);
            }
          });
        }
      }
    }
  }

  const noticeConfig = GM_getValue('hideNotice', defaultConfig.hideNotice);
  if (!noticeConfig) board.classList.add('show-filtered-notice');
}
function blockComment(comments) {
  if (document.readyState != 'complete') {
    window.addEventListener('load', () => {
      blockComment(comments);
    }, {
      once: true
    });
    return;
  }

  const count = {
    keyword: 0,
    user: 0,
    all: 0
  };
  comments.forEach(item => {
    const author = item.querySelector('.user-info');
    const message = item.querySelector('.message');
    let userlist = GM_getValue('blockUser', defaultConfig.blockUser);
    let keywordlist = GM_getValue('blockKeyword', defaultConfig.blockKeyword);

    if ((unsafeWindow.LiveConfig || undefined) && unsafeWindow.LiveConfig.mute != undefined) {
      userlist.push(...unsafeWindow.LiveConfig.mute.users);
      keywordlist.push(...unsafeWindow.LiveConfig.mute.keywords);
      userlist = Array.from(new Set(userlist));
      keywordlist = Array.from(new Set(keywordlist));
    }

    const authorAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(author.innerText);
    const textAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(message.innerText);

    if (textAllow) {
      item.classList.add('filtered');
      item.classList.add('filtered-keyword');
      count.keyword += 1;
    }

    if (authorAllow) {
      item.classList.add('filtered');
      item.classList.add('filtered-user');
      count.user += 1;
    }

    if (item.classList.contains('deleted')) {
      item.classList.add('filtered');
      item.classList.add('filtered-deleted');
    }

    if (item.classList.contains('filtered')) count.all += 1;
  });
  let toggleHeader = document.querySelector('#comment .frontend-header');
  if (toggleHeader) toggleHeader.remove();
  toggleHeader = VM.createElement("div", {
    class: "frontend-header"
  }, VM.createElement("span", {
    class: "filter-title"
  }, "\uD544\uD130\uB41C \uAC8C\uC2DC\uBB3C"), VM.createElement("span", {
    class: "filter-count-container"
  }));
  const container = toggleHeader.querySelector('.filter-count-container');

  if (count.all > 0) {
    document.querySelector('#comment .title').insertAdjacentElement('afterend', toggleHeader);

    for (const key of Object.keys(count)) {
      if (count[key] > 0) {
        let className = `show-filtered-${key}`;
        if (key == 'all') className = 'show-filtered';
        let text;

        switch (key) {
          case 'all':
            text = '전체';
            break;

          case 'keyword':
            text = '키워드';
            break;

          case 'user':
            text = '사용자';
            break;

          case 'deleted':
            text = '삭제됨';
            break;
        }

        const btn = VM.createElement("span", {
          class: `filter-count filter-count-${key}`
        }, text, " (", count[key], ")");
        container.append(btn);
        btn.addEventListener('click', () => {
          const list = document.querySelector('#comment .list-area');

          if (list.classList.contains(className)) {
            list.classList.remove(className);
            toggleHeader.classList.remove(className);
          } else {
            list.classList.add(className);
            toggleHeader.classList.add(className);
          }
        });
      }
    }
  }

  for (const key of Object.keys(count)) {
    const btn = container.querySelector(`.filter-count-${key}`);
    if (btn) container.append(btn);
  }
}
function blockEmoticon(comments) {
  const blockEmoticons = GM_getValue('blockEmoticon', defaultConfig.blockEmoticon);
  let list = [];

  for (const key in blockEmoticons) {
    if ({}.hasOwnProperty.call(blockEmoticons, key)) {
      list = list.concat(blockEmoticons[key].bundle);
    }
  }

  comments.forEach(item => {
    const emoticon = item.querySelector('.emoticon');

    if (emoticon) {
      const id = emoticon.dataset.id;

      if (list.indexOf(id) > -1) {
        emoticon.closest('.message').innerText = '[아카콘 뮤트됨]';
      }
    }
  });
}
function blockRatedown() {
  if (!GM_getValue('blockRatedown', defaultConfig.blockRatedown)) return;
  const ratedown = document.querySelector('#rateDown');
  if (ratedown == null) return;
  ratedown.addEventListener('click', e => {
    if (!confirm('비추천을 눌렀습니다.\n계속하시겠습니까?')) {
      e.preventDefault();
    }
  });
}

var styles$1 = {"green":"IPScouter-module_green__K9yWK","red":"IPScouter-module_red__3yMjL","blue":"IPScouter-module_blue__YSAPo"};
var stylesheet$1=".vcol.col-author {\r\n    width: 7.5rem !important;\r\n}\r\n\r\n.IPScouter-module_green__K9yWK {\r\n    color: rgb(37, 141, 37)\r\n}\r\n\r\n.IPScouter-module_red__3yMjL {\r\n    color: rgb(236, 69, 69)\r\n}\r\n\r\n.IPScouter-module_blue__YSAPo {\r\n    color: rgb(56, 174, 252)\r\n}";

const db = {
  KT: ['1.96', '1.97', '1.98', '1.99', '1.100', '1.101', '1.102', '1.103', '1.104', '1.105', '1.106', '1.107', '1.108', '1.109', '1.110', '1.111', '39.4', '39.5', '39.6', '39.7', '49.16', '49.17', '49.18', '49.19', '49.20', '49.21', '49.22', '49.23', '49.24', '49.25', '49.26', '49.27', '49.28', '49.29', '49.30', '49.31', '49.56', '49.57', '49.58', '49.59', '49.60', '49.61', '49.62', '49.63', '110.68', '110.69', '110.70', '110.71', '116.200', '116.201', '118.234', '118.235', '119.194', '163.213', '163.222', '163.229', '163.255', '175.216', '175.217', '175.218', '175.219', '175.220', '175.221', '175.222', '175.223'],
  SK: ['27.160', '27.161', '27.162', '27.163', '27.164', '27.165', '27.166', '27.167', '27.168', '27.169', '27.170', '27.171', '27.172', '27.173', '27.174', '27.175', '27.176', '27.177', '27.178', '27.179', '27.180', '27.181', '27.182', '27.183', '42.16', '42.17', '42.18', '42.19', '42.20', '42.21', '42.22', '42.23', '42.24', '42.25', '42.26', '42.27', '42.28', '42.29', '42.30', '42.31', '42.32', '42.33', '42.34', '42.35', '42.36', '42.37', '42.38', '42.39', '42.40', '42.41', '42.42', '42.43', '42.44', '42.45', '42.46', '42.47', '58.102', '58.103', '111.218', '111.219', '113.216', '113.217', '114.52', '114.53', '123.228', '123.229', '124.0', '124.1', '124.2', '124.3', '124.136', '124.137', '124.138', '124.139', '180.132', '180.133', '180.134', '180.135', '219.252', '219.253', '220.103', '223.32', '223.33', '223.34', '223.35', '223.36', '223.37', '223.38', '223.39', '223.40', '223.41', '223.42', '223.43', '223.44', '223.45', '223.46', '223.47', '223.48', '223.49', '223.50', '223.51', '223.52', '223.53', '223.54', '223.55', '223.56', '223.57', '223.58', '223.59', '223.60', '223.61', '223.62', '223.63'],
  LG: ['106.96', '109.97', '109.98', '109.99', '106.100', '106.101', '106.102', '106.103', '117.110', '117.111', '211.36', '223.168', '223.169', '223.170', '223.171', '223.172', '223.173', '223.174', '223.175'],
  proxy: ['5.79', '5.254', '31.3', '37.58', '37.221', '46.28', '46.183', '50.7', '62.210', '66.249', '89.238', '89.238', '91.221', '94.242', '95.141', '103.10', '103.254', '107.167', '109.200', '176.123', '178.162', '178.255', '179.43', '185.9', '185.82', '185.104', '192.71', '192.99', '193.182', '207.244', '209.58'],
  tor: ['1.161', '103.28', '103.16', '103.125', '103.194', '103.208', '103.214', '103.234', '103.236', '103.75', '104.40', '104.194', '104.196', '104.200', '104.218', '104.244', '107.155', '109.69', '109.70', '109.169', '109.194', '109.201', '109.248', '114.32', '111.90', '114.158', '115.73', '118.163', '119.237', '122.147', '123.30', '124.109', '125.212', '126.75', '128.14', '128.199', '128.31', '130.149', '137.74', '138.197', '139.162', '139.28', '139.99', '142.44', '142.58', '142.93', '143.202', '144.217', '145.239', '149.202', '151.53', '151.73', '151.77', '153.229', '154.127', '156.54', '157.157', '157.161', '157.230', '158.174', '158.69', '159.89', '160.119', '160.202', '162.213', '162.244', '162.247', '163.172', '164.132', '164.77', '166.70', '167.114', '167.86', '167.99', '169.197', '171.22', '171.244', '171.25', '172.96', '172.98', '173.14', '173.199', '173.212', '173.244', '173.255', '176.10', '176.126', '176.152', '176.214', '176.31', '176.53', '177.205', '178.128', '178.165', '178.17', '178.175', '178.20', '178.239', '178.254', '178.32', '178.9', '179.43', '179.48', '18.18', '18.85', '180.149', '180.150', '184.75', '185.10', '185.100', '185.103', '185.104', '185.107', '185.112', '185.113', '185.117', '185.121', '185.125', '185.127', '185.129', '185.14', '185.147', '185.158', '185.162', '185.165', '185.169', '185.175', '185.177', '185.193', '185.195', '185.203', '185.220', '185.222', '185.227', '185.233', '185.234', '185.242', '185.244', '185.248', '185.255', '185.4', '185.56', '185.61', '185.65', '185.66', '185.72', '185.86', '185.9', '186.214', '187.178', '188.166', '188.214', '188.65', '189.84', '190.10', '190.164', '190.210', '190.216', '191.114', '191.243', '191.32', '192.160', '192.195', '192.227', '192.34', '192.42', '192.68', '193.110', '193.150', '193.169', '193.201', '193.36', '193.56', '193.9', '193.90', '194.71', '194.99', '195.123', '195.176', '195.206', '195.228', '195.254', '196.41', '197.231', '198.167', '198.211', '198.46', '198.50', '198.96', '198.98', '199.127', '199.195', '199.249', '199.87', '200.52', '200.86', '200.98', '201.80', '203.78', '204.11', '204.17', '204.194', '204.8', '204.85', '205.168', '205.185', '206.248', '206.55', '207.244', '208.12', '209.126', '209.141', '209.95', '210.140', '210.160', '212.16', '212.21', '212.47', '212.75', '212.81', '213.108', '213.136', '213.160', '213.202', '213.252', '213.61', '213.95', '216.218', '216.239', '217.115', '217.12', '217.170', '220.135', '223.26', '23.129', '23.239', '24.20', '24.3', '27.122', '31.131', '31.185', '31.220', '31.31', '35.0', '37.128', '37.139', '37.187', '37.220', '37.228', '37.28', '37.48', '40.124', '41.215', '41.77', '45.114', '45.125', '45.32', '45.33', '45.35', '45.56', '45.76', '45.79', '46.101', '46.165', '46.166', '46.173', '46.182', '46.194', '46.23', '46.246', '46.29', '46.38', '46.98', '5.135', '5.150', '5.189', '5.196', '5.199', '5.2', '5.252', '5.3', '5.34', '5.39', '5.79', '50.247', '51.15', '51.254', '51.255', '51.38', '51.68', '51.75', '51.77', '52.167', '54.36', '54.37', '54.39', '58.153', '58.96', '59.127', '62.102', '62.210', '62.212', '62.219', '62.98', '64.113', '64.27', '65.181', '65.19', '66.110', '66.146', '66.155', '66.175', '66.42', '66.70', '67.163', '67.215', '69.162', '69.164', '70.168', '71.19', '72.14', '72.210', '72.221', '72.83', '73.15', '74.82', '77.141', '77.247', '77.55', '77.73', '77.81', '78.109', '78.142', '78.46', '79.117', '79.134', '79.141', '79.172', '80.127', '80.241', '80.67', '80.68', '80.79', '81.17', '82.118', '82.151', '82.221', '82.223', '82.228', '82.94', '84.19', '84.200', '84.209', '85.214', '85.235', '85.248', '86.123', '86.124', '86.127', '86.148', '87.101', '87.118', '87.120', '87.123', '87.247', '88.130', '88.76', '89.234', '89.236', '89.247', '89.31', '91.132', '91.146', '91.203', '91.207', '91.213', '91.219', '91.231', '92.116', '92.222', '92.63', '93.174', '93.55', '94.100', '94.102', '94.140', '94.168', '94.230', '94.242', '94.32', '95.128', '95.130', '95.142', '95.143', '95.168', '95.179', '95.211', '95.216', '96.66', '96.70', '97.74', '98.174'],
  hola: ['103.18', '104.131', '106.185', '106.186', '106.187', '107.161', '107.170', '107.181', '107.190', '107.191', '107.22', '108.61', '109.74', '14.136', '149.154', '149.62', '151.236', '158.255', '162.217', '162.218', '162.221', '162.243', '167.88', '168.235', '176.58', '176.9', '177.67', '178.209', '178.79', '192.110', '192.121', '192.184', '192.211', '192.241', '192.30', '192.40', '192.73', '192.81', '192.99', '198.147', '198.58', '199.241', '208.68', '209.222', '213.229', '217.78', '23.227', '23.249', '23.29', '31.193', '37.235', '41.223', '46.17', '46.19', '46.4', '5.9', '50.116', '54.225', '54.243', '66.85', '77.237', '81.4', '85.234', '88.150', '91.186', '92.48', '94.76', '95.215', '96.126']
};
function applyArticles(articles) {
  articles.forEach(article => {
    const ipElement = article.querySelector('small');
    if (ipElement) appendInfo(ipElement);
  });
}
function applyAuthor() {
  const ipElement = document.querySelector('.article-head .user-info small');
  if (ipElement) appendInfo(ipElement);
}
function applyComments(comments) {
  comments.forEach(comment => {
    const ipElement = comment.querySelector('small');
    if (ipElement) appendInfo(ipElement);
  });
}

function appendInfo(ipElement) {
  const ip = ipElement.textContent.replace(/\(|\)/g, '');
  const [result, color] = checkIP(ip);
  ipElement.parentNode.append(VM.createElement("span", {
    class: color
  }, ` - ${result}`));
}

function checkIP(ip) {
  let result = '고정';
  let color = styles$1.green;

  if (db.KT.indexOf(ip) > -1) {
    result = 'KT';
    color = styles$1.blue;
  } else if (db.SK.indexOf(ip) > -1) {
    result = 'SK';
    color = styles$1.blue;
  } else if (db.LG.indexOf(ip) > -1) {
    result = 'LG';
    color = styles$1.blue;
  } else if (db.proxy.indexOf(ip) > -1) {
    result = '젠메이트';
    color = styles$1.red;
  } else if (db.tor.indexOf(ip) > -1) {
    result = '토르';
    color = styles$1.red;
  } else if (db.hola.indexOf(ip) > -1) {
    result = '홀라';
    color = styles$1.red;
  }

  return [result, color];
}

function apply$3(target) {
  const users = document.querySelectorAll('.content-wrapper .user-info');
  const memos = GM_getValue('userMemo', defaultConfig.userMemo);
  users.forEach(user => {
    let id = user.dataset.id;

    if (id == undefined) {
      id = user.innerText.trim();
      const subid = user.querySelector('a[title], span[title]');

      if (subid && subid.title.indexOf('#') > -1) {
        id = subid.title.substring(subid.title.indexOf('#'));
      }

      user.dataset.id = id;
    }

    if (target && id != target) return;
    let slot = user.querySelector('.memo');

    if (memos[id]) {
      if (slot == null) {
        slot = VM.createElement("span", {
          class: "memo"
        });
        user.append(slot);
      }

      slot.textContent = ` - ${memos[id]}`;
      user.title = memos[id];
    } else if (slot) {
      slot.remove();
      user.title = '';
    }
  });
}
function applyHandler() {
  const memos = GM_getValue('userMemo', defaultConfig.userMemo);
  const wrapper = document.querySelector('article .article-wrapper');
  if (wrapper == null) return;
  wrapper.addEventListener('click', event => {
    if (event.target.tagName != 'SPAN' && event.target.tagName != 'SMALL') return;
    const user = event.target.closest('.user-info');
    if (user == null) return;
    const id = user.getAttribute('data-id');
    let memo = memos[id];
    memo = prompt('이용자 메모를 설정합니다.\n', memo || '');
    if (memo == null) return;
    let slot = user.querySelector('.memo');

    if (slot == null) {
      slot = VM.createElement("span", {
        class: "memo"
      });
      user.append(slot);
    }

    if (memo) {
      slot.textContent = ` - ${memo}`;
      memos[id] = memo;
    } else {
      slot.remove();
      delete memos[id];
    }

    GM_setValue('userMemo', memos);
    apply$3(id);
  });
}

function applyRefreshBtn(commentArea) {
  if (commentArea.querySelector('.alert')) {
    // 댓글 작성 권한 없음
    return;
  }

  const btn = VM.createElement("button", {
    class: "btn btn-success",
    style: "margin-left: 1rem"
  }, VM.createElement("span", {
    class: "icon ion-android-refresh"
  }), VM.createElement("span", null, " \uC0C8\uB85C\uACE0\uCE68"));
  const clonebtn = btn.cloneNode(true);
  commentArea.querySelector('.title a').insertAdjacentElement('beforebegin', btn);
  commentArea.querySelector('.subtitle').append(clonebtn);

  async function onClick(event) {
    event.preventDefault();
    btn.disabled = true;
    clonebtn.disabled = true;
    const response = await getRefreshData();
    const newComments = response.querySelector('.article-comment .list-area');

    try {
      commentArea.querySelector('.list-area').remove();
    } // eslint-disable-next-line no-empty
    catch (_unused) {}

    if (newComments) {
      newComments.querySelectorAll('time').forEach(time => {
        time.textContent = getDateStr(time.dateTime);
      });
      commentArea.querySelector('.title').insertAdjacentElement('afterend', newComments);
      const items = newComments.querySelectorAll('.comment-item');
      apply$3();
      applyComments(items);
      blockComment(items);
      blockEmoticon(items);
      applyEmoticonBlockBtn(commentArea);
    }

    btn.disabled = false;
    clonebtn.disabled = false;
  }

  btn.addEventListener('click', onClick);
  clonebtn.addEventListener('click', onClick);
}

function getRefreshData() {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', window.location.href);
    req.responseType = 'document';
    req.addEventListener('load', () => {
      resolve(req.response);
    });
    req.send();
  });
}

function applyEmoticonBlockBtn(commentArea) {
  const emoticons = commentArea.querySelectorAll('.emoticon');
  emoticons.forEach(item => {
    const btn = VM.createElement("span", null, '\n | ', VM.createElement("a", {
      href: "#",
      class: "block-emoticon",
      "data-id": item.dataset.id
    }, VM.createElement("span", {
      class: "ion-ios-close"
    }), ' 아카콘 뮤트'));
    const timeElement = item.closest('.content').querySelector('.right > time');
    timeElement.insertAdjacentElement('afterend', btn);
  });
  commentArea.addEventListener('click', async event => {
    if (event.target.tagName != 'A') return;
    if (!event.target.classList.contains('block-emoticon')) return;
    event.preventDefault();
    event.target.textContent = '뮤트 처리 중...';
    event.target.classList.remove('block-emoticon');
    const id = event.target.getAttribute('data-id');
    const [name, bundleID] = await getEmoticonInfo(id);
    const bundle = await getEmoticonBundle(bundleID);
    const blockEmoticon = GM_getValue('blockEmoticon', defaultConfig.blockEmoticon);
    blockEmoticon[bundleID] = {
      name,
      bundle
    };
    GM_setValue('blockEmoticon', blockEmoticon);
    location.reload();
  });
}

function getEmoticonInfo(id) {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', `/api/emoticon/shop/${id}`);
    req.responseType = 'document';
    req.addEventListener('load', () => {
      const name = req.response.querySelector('.article-head .title').innerText;
      const bundleID = req.response.URL.split('/e/')[1];
      resolve([name, bundleID]);
    });
    req.send();
  });
}

function getEmoticonBundle(bundleID) {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', `/api/emoticon/${bundleID}`);
    req.responseType = 'json';
    req.addEventListener('load', () => {
      const bundle = Object.keys(req.response);
      resolve(bundle);
    });
    req.send();
  });
}

function applyFullAreaRereply(commentArea) {
  commentArea.addEventListener('click', event => {
    const checkWriteForm = event.target.closest('form');
    if (checkWriteForm) return;
    const element = event.target.closest('a, .emoticon, .btn-more, .message');
    if (element == null) return;
    if (!element.classList.contains('message')) return;
    event.preventDefault();
    element.parentNode.querySelector('.reply-link').click();
  });
}

var styles$2 = {"loader":"Refresher-module_loader__2EBKq","target":"Refresher-module_target__hOVDj","light":"Refresher-module_light__2hVGO","loaderspin":"Refresher-module_loaderspin__3kEgT"};
var stylesheet$2="@keyframes Refresher-module_light__2hVGO{\r\n    0% {\r\n        background-color: rgb(246, 247, 239);\r\n    }\r\n    100% {\r\n        background-color: rgba(255, 255, 255, 0);\r\n    }\r\n\r\n}\r\n\r\n@keyframes Refresher-module_loaderspin__3kEgT {\r\n    0% { transform: rotate(0deg);\r\n        box-shadow: 0 0 15px #3d414d;\r\n    }\r\n    5% {\r\n        box-shadow: 0 0 -10px #3d414d;\r\n    }\r\n    15%{\r\n        box-shadow: 0 0 0px #3d414d;\r\n    }\r\n    100% { transform: rotate(360deg);\r\n        box-shadow: 0 0 0px #3d414d;\r\n    }\r\n}\r\n\r\n.Refresher-module_loader__2EBKq {\r\n    border: 6px solid #d3d3d3;\r\n    border-top: 6px solid #3d414d;\r\n    border-radius: 50%;\r\n    position: fixed;\r\n    bottom: 30px;\r\n    left: 10px;\r\n    width: 40px;\r\n    height: 40px;\r\n    z-index: 20;\r\n}\r\n\r\n.Refresher-module_target__hOVDj {\r\n    background-color: #e6aaaa;\r\n}\r\n\r\n.badge {\r\n    transition: none;\r\n}";

function removeArticle(articles) {
  const form = document.querySelector('.batch-delete-form');
  if (form == null) return false;
  const userlist = GM_getValue('autoRemoveUser', defaultConfig.autoRemoveUser);
  const keywordlist = GM_getValue('autoRemoveKeyword', defaultConfig.autoRemoveKeyword);
  const testMode = GM_getValue('useAutoRemoverTest', defaultConfig.useAutoRemoverTest);
  const articleid = [];
  articles.forEach(item => {
    const title = item.querySelector('.col-title');
    const author = item.querySelector('.col-author');
    const checkbox = item.querySelector('.batch-check');
    const authorAllow = userlist.length == 0 ? false : new RegExp(userlist.join('|')).test(author.innerText);
    const titleAllow = keywordlist.length == 0 ? false : new RegExp(keywordlist.join('|')).test(title.innerText);

    if (titleAllow || authorAllow) {
      if (testMode) {
        item.classList.add(styles$2.target);
      } else {
        articleid.push(checkbox.getAttribute('data-id'));
      }
    }
  });

  if (articleid.length > 0 && !testMode) {
    form.querySelector('input[name="articleIds"]').value = articleid.join(',');
    form.submit();
    return true;
  }

  return false;
}

function applyArticles$1(articles, channel) {
  const categoryConfig = GM_getValue('category', defaultConfig.category);
  articles.forEach(article => {
    const category = article.querySelector('.badge');
    if (category == null) return;
    let color = '';

    if (categoryConfig[channel] && categoryConfig[channel][category.textContent]) {
      color = categoryConfig[channel][category.textContent].color;
    }

    const textColor = getContrastYIQ(color);

    if (color != '') {
      category.style.backgroundColor = `#${color}`;
      category.style.color = textColor;
    }
  });
}

function initLoader() {
  document.head.append(VM.createElement("style", null, stylesheet$2));
  const loader = VM.createElement("div", {
    id: "article_loader",
    class: styles$2.loader
  });
  document.body.append(loader);
  return loader;
}

function playLoader(loader, time) {
  if (loader) {
    loader.removeAttribute('style');
    setTimeout(() => {
      loader.setAttribute('style', `animation: ${styles$2.loaderspin} ${time}s ease-in-out`);
    }, 50);
  }
}

function getNewArticles() {
  return new Promise(resolve => {
    const req = new XMLHttpRequest();
    req.open('GET', window.location.href);
    req.responseType = 'document';
    req.addEventListener('load', () => {
      const articles = req.response.querySelectorAll('a.vrow');
      resolve(articles);
    });
    req.send();
  });
}

function swapNewArticle(newArticles) {
  const board = document.querySelector('.board-article-list .list-table, .included-article-list .list-table');
  const oldArticles = board.querySelectorAll('a.vrow');
  const oldnums = [];

  for (const o of oldArticles) {
    oldnums.push(o.pathname.split('/')[3]);
    o.remove();
  }

  for (const n of newArticles) {
    if (oldnums.indexOf(n.pathname.split('/')[3]) == -1) {
      n.setAttribute('style', `animation: ${styles$2.light} 0.5s`);
    }

    const lazywrapper = n.querySelector('noscript');
    if (lazywrapper) lazywrapper.outerHTML = lazywrapper.innerHTML;
    const time = n.querySelector('time');

    if (time && in24(time.dateTime)) {
      time.innerText = getTimeStr(time.dateTime);
    }
  }

  board.append(...newArticles);
}

function run(board, channel) {
  const refreshTime = GM_getValue('refreshTime', defaultConfig.refreshTime);
  if (refreshTime == 0) return;
  let loader = null;

  if (!GM_getValue('hideRefresher', defaultConfig.hideRefresher)) {
    loader = initLoader();
  }

  playLoader(loader, refreshTime);
  let loadLoop = null;

  async function routine() {
    playLoader(loader, refreshTime);
    const articles = await getNewArticles();
    swapNewArticle(articles);
    apply$3();
    applyArticles$1(articles, channel);
    filter(articles, channel);
    applyArticles(articles);
    blockArticle(board, articles, channel);

    if (removeArticle(articles)) {
      clearInterval(loadLoop);
      loadLoop = null;
    }
  }

  loadLoop = setInterval(routine, refreshTime * 1000);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(loadLoop);
      loadLoop = null;
    } else {
      if (loadLoop == null) {
        playLoader(loader, refreshTime);
        loadLoop = setInterval(routine, refreshTime * 1000);
      }
    }
  });
  board.addEventListener('click', event => {
    if (event.target.tagName != 'INPUT') return;

    if (event.target.classList.contains('batch-check-all')) {
      if (event.target.checked) {
        clearInterval(loadLoop);
        loadLoop = null;
      } else {
        playLoader(loader, refreshTime);
        loadLoop = setInterval(routine, refreshTime * 1000);
      }
    } else {
      const btns = document.querySelectorAll('.batch-check');

      for (const btn of btns) {
        if (btn.checked) {
          clearInterval(loadLoop);
          loadLoop = null;
          return;
        }
      }

      playLoader(loader, refreshTime);
      loadLoop = setInterval(routine, refreshTime * 1000);
    }
  });
}

function applyMyImage(editor) {
  if (editor.core.isEmpty()) {
    const img = GM_getValue('myImage', defaultConfig.myImage);
    editor.html.set(img);
    editor.html.insert('<p></p>');
    editor.selection.setAtEnd(editor.$el.get(0));
  }
}
function applyClipboardUpload(editor) {
  editor.events.on('paste.before', event => {
    const files = event.clipboardData.files;
    if (files.length == 0) return true;
    editor.image.upload(files);
    return false;
  }, true);
}

function apply$4(view) {
  if (!GM_getValue('useShortcut', defaultConfig.useShortcut)) return;

  if (view == 'article') {
    document.addEventListener('keydown', onArticle);
  } else if (view == 'board') {
    document.addEventListener('keydown', onBoard);
  }
}

function onArticle(event) {
  // A 목록 바로가기
  // R 댓글 목록보기
  // W 댓글 입력 포커스
  if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;

  switch (event.code) {
    case 'KeyA':
      event.preventDefault();
      location.pathname = location.pathname.replace(/\/[0-9]+/, '');
      break;

    case 'KeyR':
      {
        event.preventDefault();
        const commentForm = document.querySelector('.article-comment');
        window.scrollTo({
          top: commentForm.offsetTop - 50,
          behavior: 'smooth'
        });
        break;
      }

    case 'KeyW':
      {
        event.preventDefault();
        const inputForm = document.querySelector('.article-comment .subtitle');
        const input = document.querySelector('.article-comment .input textarea');
        const top = window.pageYOffset + inputForm.getBoundingClientRect().top;
        window.scrollTo({
          top: top - 50,
          behavior: 'smooth'
        });
        input.focus({
          preventScroll: true
        });
        break;
      }
  }
}

function onBoard(event) {
  // W 게시물 쓰기
  // E 헤드라인
  // D 이전 페이지
  // F 다음 페이지
  if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;

  switch (event.code) {
    case 'KeyW':
      {
        event.preventDefault();
        const path = location.pathname.split('/');
        let writePath = '';

        if (path[path.length - 1] == '') {
          path[path.length - 1] = 'write';
        } else {
          path.push('write');
        }

        writePath = path.join('/');
        location.pathname = writePath;
        break;
      }

    case 'KeyE':
      {
        event.preventDefault();

        if (location.search.indexOf('mode=best') > -1) {
          location.search = '';
        } else {
          location.search = '?mode=best';
        }

        break;
      }

    case 'KeyD':
      {
        event.preventDefault();
        const active = document.querySelector('.pagination .active');

        if (active.previousElementSibling) {
          active.previousElementSibling.firstChild.click();
        }

        break;
      }

    case 'KeyF':
      {
        event.preventDefault();
        const active = document.querySelector('.pagination .active');

        if (active.nextElementSibling) {
          active.nextElementSibling.firstChild.click();
        }

        break;
      }
  }
}

async function waitForElement(selector) {
  let targetElement = document.querySelector(selector);
  if (targetElement) return Promise.resolve(targetElement);
  return new Promise(resolve => {
    const observer = new MutationObserver(() => {
      targetElement = document.querySelector(selector);

      if (targetElement) {
        observer.disconnect();
        resolve(targetElement);
      }
    });
    observer.observe(document, {
      childList: true,
      subtree: true
    });
  });
}

var css_248z$2 = ".body .root-container {\r\n    padding-top: 42px;\r\n}\r\n.body .navbar-wrapper {\r\n    top: 0px;\r\n    position: fixed !important;\r\n    width: 100%;\r\n    z-index: 20;\r\n}";

var css_248z$3 = ".hidden {\r\n    display: none !important;\r\n}\r\n\r\n.appear {\r\n    animation: fadein 0.25s;\r\n    animation-fill-mode: forwards;\r\n}\r\n\r\n.disappear {\r\n    animation: fadeout 0.25s;\r\n    animation-fill-mode: forwards;\r\n}\r\n\r\n@keyframes fadein {\r\n    from {\r\n        opacity: 0;\r\n    }\r\n    to {\r\n        opacity: 1;\r\n    }\r\n}\r\n\r\n@keyframes fadeout {\r\n    from {\r\n        opacity: 1;\r\n    }\r\n    to {\r\n        opacity: 0;\r\n    }\r\n}";

var css_248z$4 = ".content-wrapper.hide-avatar .avatar {\r\n    display: none !important;\r\n}\r\n.content-wrapper.hide-avatar .input-wrapper > .input {\r\n    width: calc(100% - 4.5rem - .5rem) !important;\r\n}\r\n\r\n.list-table.hide-notice a.notice {\r\n    display: none !important;\r\n}\r\n\r\n.content-wrapper.hide-media .article-body img, \r\n.content-wrapper.hide-media .article-body video {\r\n    display: none;\r\n}\r\n\r\n.content-wrapper.hide-modified b.modified {\r\n    display: none !important;\r\n}\r\n\r\n.content-wrapper.hide-sidemenu .right-sidebar {\r\n    display: none;\r\n}\r\n\r\n@media screen and (min-width: 991px) {\r\n    .content-wrapper.hide-sidemenu .board-article {\r\n        padding: 1rem;\r\n        margin: 0;\r\n    }\r\n}";

var css_248z$5 = ".body .board-article .article-list .list-table.show-filtered-category .vrow.filtered-category {\r\n    display: flex;\r\n}";

(async function () {
  document.head.append(VM.createElement("style", null, css_248z$2));
  document.head.append(VM.createElement("style", null, css_248z$3));
  document.head.append(VM.createElement("style", null, css_248z$4));
  document.head.append(VM.createElement("style", null, css_248z$5));
  document.head.append(VM.createElement("style", null, stylesheet$1));
  const path = location.pathname.split('/');
  const channel = path[2] || '';
  await waitForElement('.content-wrapper');
  const oldData = GM_getValue('Setting');

  if (oldData != undefined) {
    importConfig(oldData);
    GM_deleteValue('Setting');
  }

  setup();
  apply();
  await waitForElement('footer');
  let targetElement = document.querySelector('article > .article-view, article > div.board-article-list .list-table, article > .article-write');
  if (targetElement == null) return;
  apply$3();
  let type = '';
  if (targetElement.classList.contains('article-view')) type = 'article';
  if (targetElement.classList.contains('list-table')) type = 'board';
  if (targetElement.classList.contains('article-write')) type = 'write';

  if (type == 'article') {
    try {
      applyHandler();
      applyAuthor();
      apply$2();
      blockRatedown();
      apply$1();
    } catch (error) {
      console.warn('게시물 처리 중 오류 발생');
      console.error(error);
    }

    try {
      const commentArea = targetElement.querySelector('#comment');

      if (commentArea) {
        const comments = commentArea.querySelectorAll('.comment-item');
        applyComments(comments);
        blockComment(comments);
        blockEmoticon(comments);
        applyRefreshBtn(commentArea);
        applyEmoticonBlockBtn(commentArea);
        applyFullAreaRereply(commentArea);
      }
    } catch (error) {
      console.warn('댓글 처리 중 오류 발생');
      console.error(error);
    }

    apply$4('article');
    targetElement = targetElement.querySelector('.included-article-list .list-table');
    if (targetElement) type = 'board-included';
  }

  if (type.indexOf('board') > -1) {
    setupCategory(channel);
    const articles = targetElement.querySelectorAll('a.vrow');
    applyArticles$1(articles, channel);
    filter(articles, channel);
    applyArticles(articles);
    blockArticle(targetElement, articles, channel);

    if (type != 'board-included') {
      run(targetElement, channel);
      apply$4('board');
    }
  }

  if (type == 'write') {
    await waitForElement('.fr-box');
    const editor = unsafeWindow.FroalaEditor('#content');
    applyClipboardUpload(editor);
    applyMyImage(editor);
  }
})();

}());

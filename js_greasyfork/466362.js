// ==UserScript==
// @name         PoExport
// @namespace    https://github.com/cn-poe-community/cn-poe-export-monkey
// @version      0.1.8
// @description  Export CN POE data.
// @author       me1ting
// @match        https://poe.game.qq.com/my-account
// @match        https://poe.game.qq.com/account/view-profile/*
// @match        https://poe.game.qq.com/forum
// @icon         https://poecdn.game.qq.com/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NvdXRpbmdSZXBvcnQiLCJ3IjoxLCJoIjoxLCJzY2FsZSI6MX1d/584635f3c8/ScoutingReport.png
// @require      https://unpkg.com/cn-poe-translator@0.4.1/dist/translator.global.js
// @require      https://unpkg.com/cn-poe-export-db@0.4.0/dist/db.global.js
// @require      https://unpkg.com/pob-building-creator@0.3.0/dist/creator.global.js
// @require      https://unpkg.com/pako@2.1.0/dist/pako_deflate.min.js
// @require      https://unpkg.com/axios@1.6.3/dist/axios.min.js
// @require      https://unpkg.com/vue@3.3.2/dist/vue.global.prod.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466362/PoExport.user.js
// @updateURL https://update.greasyfork.org/scripts/466362/PoExport.meta.js
// ==/UserScript==

(function(){
const { defineComponent, ref, reactive, computed, onMounted, openBlock, createElementBlock, Fragment, createElementVNode, withDirectives, vModelText, renderList, toDisplayString, vModelSelect, createCommentVNode, pushScopeId, popScopeId, createBlock, createApp } = Vue;

(function() {
  "use strict";
  try {
    if (typeof document != "undefined") {
      var elementStyle = document.createElement("style");
      elementStyle.appendChild(document.createTextNode("#exportContainer {\n  position: fixed;\n  bottom: 20px;\n  left: 10px;\n  z-index: 99999;\n}\n\n.line-container[data-v-f270e9a2] {\n  display: flex;\n  margin: 3px 0;\n  min-height: 25px;\n}\n.line-container select[data-v-f270e9a2] {\n  min-height: 25px;\n  margin-right: 4px;\n  min-width: 100px;\n}\n.line-container input[data-v-f270e9a2] {\n  margin-right: 4px;\n}"));
      document.head.appendChild(elementStyle);
    }
  } catch (e) {
    console.error("vite-plugin-css-injected-by-js", e);
  }
})();
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const PROFILE_URL = "api/profile";
const GET_CHARACTERS_URL = "/character-window/get-characters";
const GET_ITEMS_URL = "/character-window/get-items";
const GET_PASSIVE_SKILLS_URL = "/character-window/get-passive-skills";
async function profile() {
  try {
    const { data } = await axios.get(PROFILE_URL);
    return data;
  } catch (e) {
    throw requestError(e);
  }
}
async function getCharacters(accountName, realm2) {
  const form = new URLSearchParams();
  form.append("accountName", accountName);
  form.append("realm", realm2);
  try {
    const { data } = await axios.post(GET_CHARACTERS_URL, form);
    return data;
  } catch (e) {
    throw requestError(e);
  }
}
async function getItems(accountName, character, realm2) {
  const form = new URLSearchParams();
  form.append("accountName", accountName);
  form.append("character", character);
  form.append("realm", realm2);
  try {
    const { data } = await axios.post(GET_ITEMS_URL, form);
    return data;
  } catch (e) {
    throw requestError(e);
  }
}
async function getPassiveSkills(accountName, character, realm2) {
  const form = new URLSearchParams();
  form.append("accountName", accountName);
  form.append("character", character);
  form.append("realm", realm2);
  try {
    const { data } = await axios.post(GET_PASSIVE_SKILLS_URL, form);
    return data;
  } catch (e) {
    throw requestError(e);
  }
}
function requestError(err) {
  if (err instanceof axios.AxiosError) {
    if (err.response) {
      const status = err.response.status;
      if (status === 401) {
        const rtnErr = new Error("未登陆");
        rtnErr.stack = String(err);
        return rtnErr;
      } else if (status === 403) {
        const rtnErr = new Error("账户不存在或已隐藏");
        rtnErr.stack = String(err);
        return rtnErr;
      } else if (status === 429) {
        const headers = err.response.headers;
        if (headers) {
          const limit = rateLimit(headers);
          if (limit.length > 0) {
            const rtnErr2 = new Error(`请求过于频繁，请等待 ${limit} 后再试`);
            rtnErr2.stack = String(err);
            return rtnErr2;
          }
        }
        const rtnErr = new Error("请求过于频繁，请稍后再试");
        rtnErr.stack = String(err);
        return rtnErr;
      }
    }
  } else if (err instanceof Error) {
    return err;
  }
  return new Error(String(err));
}
function rateLimit(headers) {
  let max = 0;
  for (const [key, value] of Object.entries(headers)) {
    if (/^x-rate-limit-.+-state$/.test(key)) {
      const states = value.split(",");
      const limits = states.map((s) => {
        const pieces = s.split(":");
        return Number(pieces[pieces.length - 1]);
      });
      for (let i = 0; i < limits.length; i++) {
        if (limits[i] > max) {
          max = limits[i];
        }
      }
    }
  }
  if (max > 3600) {
    const h = Math.floor(max / 3600);
    const m = Math.floor(max % 3600 / 60);
    const s = max % 60;
    return `${h}小时${m}分钟${s}秒`;
  }
  if (max > 60) {
    const m = Math.floor(max % 3600 / 60);
    const s = max % 60;
    return `${m}分钟${s}秒`;
  }
  if (max > 0) {
    return `${max}秒`;
  }
  return "";
}
const poeapi = {
  profile,
  getCharacters,
  getItems,
  getPassiveSkills
};
const _withScopeId = (n) => (pushScopeId("data-v-f270e9a2"), n = n(), popScopeId(), n);
const _hoisted_1 = { class: "line-container" };
const _hoisted_2 = ["disabled"];
const _hoisted_3 = { class: "line-container" };
const _hoisted_4 = { key: 0 };
const _hoisted_5 = ["value"];
const _hoisted_6 = ["value"];
const _hoisted_7 = ["disabled"];
const _hoisted_8 = { key: 1 };
const _hoisted_9 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("select", { disabled: "" }, null, -1));
const _hoisted_10 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("select", { disabled: "" }, null, -1));
const _hoisted_11 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createElementVNode("button", { disabled: "" }, "导出", -1));
const _hoisted_12 = [
  _hoisted_9,
  _hoisted_10,
  _hoisted_11
];
const _hoisted_13 = { class: "line-container" };
const _hoisted_14 = ["value"];
const _hoisted_15 = ["disabled"];
const realm = "pc";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Exporter",
  props: ["createBuilding", "startup"],
  setup(__props) {
    const props = __props;
    const accountName = ref("");
    const characters = ref([]);
    const leagues = ref([]);
    const leagueMap = ref(/* @__PURE__ */ new Map());
    const currLeague = ref("");
    const currCharacters = ref([]);
    const currCharacter = ref("");
    const buildingCode = ref("");
    const state = reactive({
      accountName,
      realm,
      characters,
      leagues,
      leagueMap,
      currLeague,
      currCharacters,
      currCharacter,
      buildingCode
    });
    const getCharactersReady = computed(() => {
      return state.accountName.length > 0;
    });
    const selectReady = computed(() => {
      return state.characters.length > 0;
    });
    const exportReady = computed(() => {
      return state.characters.length > 0 && Boolean(state.currCharacter);
    });
    function handleLeageSelect() {
      state.currCharacters = state.leagueMap.get(state.currLeague);
      state.currCharacter = state.currCharacters[0].name;
    }
    async function handleCharactersQuery() {
      state.characters = [];
      state.leagues = [];
      const realm2 = state.realm;
      const accountName2 = state.accountName;
      var data = null;
      try {
        data = await poeapi.getCharacters(accountName2, realm2);
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert(e);
        }
        return;
      }
      const characters2 = data;
      state.characters = characters2;
      let leagueMap2 = /* @__PURE__ */ new Map();
      for (const character of characters2) {
        const leagueName = character.league;
        let list = leagueMap2.get(leagueName);
        if (list === void 0) {
          list = [];
          leagueMap2.set(leagueName, list);
        }
        list.push(character);
      }
      state.leagueMap = leagueMap2;
      const leagues2 = Array.from(leagueMap2.keys());
      state.leagues = leagues2;
      if (leagues2.length > 0) {
        state.currLeague = leagues2[0];
        handleLeageSelect();
      }
    }
    async function handleExport() {
      state.buildingCode = "";
      const accountName2 = state.accountName;
      const character = state.currCharacter;
      const realm2 = state.realm;
      let items = null;
      let passiveSkills = null;
      try {
        items = await poeapi.getItems(accountName2, character, realm2);
        passiveSkills = await poeapi.getPassiveSkills(accountName2, character, realm2);
        state.buildingCode = await props.createBuilding(items, passiveSkills);
      } catch (e) {
        if (e instanceof Error) {
          alert(e.message);
        } else {
          alert(e);
        }
        return;
      }
    }
    function handleCopy() {
      navigator.clipboard.writeText(state.buildingCode);
    }
    function getInitialAccountName() {
      let accountName2 = getAccountNameFromProfileLink(window.location.href);
      if (accountName2 !== null) {
        return accountName2;
      }
      const profileLinkNode = document.querySelector("#statusBar .profile-link a");
      if (profileLinkNode !== null) {
        accountName2 = getAccountNameFromProfileLink(profileLinkNode.href);
        if (accountName2 !== null) {
          return accountName2;
        }
      }
      return "";
    }
    const pattern = new RegExp("/account/view-profile/([^/?]+)");
    function getAccountNameFromProfileLink(link) {
      const match = pattern.exec(link);
      if (match) {
        return decodeURI(match[1]);
      }
      return null;
    }
    onMounted(() => {
      state.accountName = getInitialAccountName();
      if (props.startup) {
        props.startup();
      }
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createElementVNode("span", _hoisted_1, [
          withDirectives(createElementVNode("input", {
            type: "text",
            placeholder: "输入论坛账户名",
            maxlength: "50",
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => state.accountName = $event)
          }, null, 512), [
            [
              vModelText,
              state.accountName,
              void 0,
              { trim: true }
            ]
          ]),
          createElementVNode("button", {
            onClick: handleCharactersQuery,
            disabled: !getCharactersReady.value
          }, "开始", 8, _hoisted_2)
        ]),
        createElementVNode("span", _hoisted_3, [
          selectReady.value ? (openBlock(), createElementBlock("div", _hoisted_4, [
            selectReady.value ? withDirectives((openBlock(), createElementBlock("select", {
              key: 0,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => state.currLeague = $event),
              onChange: handleLeageSelect
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(leagues.value, (item) => {
                return openBlock(), createElementBlock("option", {
                  key: item,
                  value: item
                }, toDisplayString(item), 9, _hoisted_5);
              }), 128))
            ], 544)), [
              [vModelSelect, state.currLeague]
            ]) : createCommentVNode("", true),
            selectReady.value ? withDirectives((openBlock(), createElementBlock("select", {
              key: 1,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => state.currCharacter = $event)
            }, [
              (openBlock(true), createElementBlock(Fragment, null, renderList(state.currCharacters, (item) => {
                return openBlock(), createElementBlock("option", {
                  key: item.name,
                  value: item.name
                }, toDisplayString(item.name) + "," + toDisplayString(item.level) + "," + toDisplayString(item.class), 9, _hoisted_6);
              }), 128))
            ], 512)), [
              [vModelSelect, state.currCharacter]
            ]) : createCommentVNode("", true),
            selectReady.value ? (openBlock(), createElementBlock("button", {
              key: 2,
              disabled: !exportReady.value,
              onClick: handleExport
            }, "导出", 8, _hoisted_7)) : createCommentVNode("", true)
          ])) : (openBlock(), createElementBlock("div", _hoisted_8, _hoisted_12))
        ]),
        createElementVNode("span", _hoisted_13, [
          createElementVNode("input", {
            disabled: "",
            maxlength: "50",
            value: state.buildingCode
          }, null, 8, _hoisted_14),
          createElementVNode("button", {
            onClick: handleCopy,
            disabled: state.buildingCode.length === 0
          }, "复制", 8, _hoisted_15)
        ])
      ], 64);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const Exporter = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-f270e9a2"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Monkey",
  setup(__props) {
    const factory = new CnPoeTranslator.BasicTranslatorFactory(CnPoeExportDb);
    const jsonTranslator = factory.getJsonTranslator();
    async function createBuilding(items, passiveSkills) {
      jsonTranslator.translateItems(items);
      jsonTranslator.translatePassiveSkills(passiveSkills);
      const building = BuildingCreator.transform(items, passiveSkills);
      const compressed = window.pako.deflate(building.toString());
      const code = btoa(String.fromCharCode(...compressed)).replaceAll("+", "-").replaceAll("/", "_");
      return code;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(Exporter, { "create-building": createBuilding });
    };
  }
});
const container = document.createElement("div");
container.id = "exportContainer";
document.body.appendChild(container);
createApp(_sfc_main).mount("#exportContainer");

})();
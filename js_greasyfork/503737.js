// ==UserScript==
// @name         Better SteamPY
// @namespace    https://space.bilibili.com/93654843
// @version      20241208
// @description  提供Steampy界面美化，功能增强，如库中已有游戏标记(支持家庭库及愿望单)、标记资料受限游戏等功能
// @author       FiNNiER
// @match        *://steampy.com/*
// @icon         https://steampy.com/img/logo.63413a4f.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      gitee.com
// @connect      api.steampowered.com
// @connect      store.steampowered.com
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/503737/Better%20SteamPY.user.js
// @updateURL https://update.greasyfork.org/scripts/503737/Better%20SteamPY.meta.js
// ==/UserScript==
var Saves = {
  wishlist: [],
  ownedApps: [],
  familygameList: [],
  lastupdatetime: 0,
};
var limitedApps = [];
var noGameList = [];
var noDlc = false;
var noownedGames = false;
var noRestrictedGames = false;


(function () {
  'use strict';
  load();
  observePageChanges();
})();

//读取个人库存及愿望单并储存
function getOwnAndWish() {
  return new Promise((resolve, reject) => {
    var wishlist = [];
    var ownedApps = [];
    GM_xmlhttpRequest({
      method: 'GET',
      url:
        'https://store.steampowered.com/dynamicstore/userdata/?t=' +
        Math.trunc(Date.now() / 1000),
      responseType: 'json',
      onload: function (response) {
        let data = JSON.parse(response.responseText);
        wishlist = data.rgWishlist;
        ownedApps = data.rgOwnedApps;
        let previousSaves = GM_getValue('Saves');
        let newSave = {
          wishlist: wishlist,
          ownedApps: ownedApps,
          familygameList: previousSaves.familygameList,
          lastupdatetime: new Date().getTime(),
        };
        GM_setValue('Saves', newSave);
        Saves = newSave;
        iview.Notice.success({
          title: `Better Steampy`,
          desc: `已加载 ${ownedApps.length} 个库存游戏及DLC，${wishlist.length} 个愿望单游戏`,
        });
        resolve(newSave);
      },
    });
  });
}

//读取家庭库并储存
function getFamilyGame() {
  return new Promise((resolve, reject) => {
    var access_token;
    var family_groupid;
    var familygameList = [];
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://store.steampowered.com/pointssummary/ajaxgetasyncconfig',
      responseType: 'json',
      onload: function (response) {
        let data = JSON.parse(response.responseText);
        access_token = data.data.webapi_token; // access_token
        GM_xmlhttpRequest({
          method: 'GET',
          url: `https://api.steampowered.com/IFamilyGroupsService/GetFamilyGroupForUser/v1/?access_token=${access_token}`,
          responseType: 'json',
          onload: function (response) {
            let data = JSON.parse(response.responseText);
            family_groupid = data.response.family_groupid; // family_groupid
            GM_xmlhttpRequest({
              method: 'GET',
              url: `https://api.steampowered.com/IFamilyGroupsService/GetSharedLibraryApps/v1/?access_token=${access_token}&family_groupid=${family_groupid}&include_own=true`,
              responseType: 'json',
              onload: function (response) {
                let data = JSON.parse(response.responseText);
                data.response.apps.forEach((app) => {
                  if (app.exclude_reason == 0) {
                    familygameList.push(app.appid);
                  }
                });
                let previousSaves = GM_getValue('Saves');
                let newSave = {
                  wishlist: previousSaves.wishlist,
                  ownedApps: previousSaves.ownedApps,
                  familygameList: familygameList,
                  lastupdatetime: new Date().getTime(),
                };
                GM_setValue('Saves', newSave);
                Saves = newSave;
                iview.Notice.success({
                  title: `Better Steampy`,
                  desc: `已加载 ${familygameList.length} 个家庭库游戏`,
                });
                resolve(familygameList);
              },
            });
          },
        });
      },
    });
  });
}

//获取受限游戏列表
function getLimitedGamesList() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://gitee.com/Finnier/getSteamRestrictedGameLIst/raw/main/data/normalist.json',
      responseType: 'json',
      onload: function (response) {
        var data = JSON.parse(response.responseText);
        var limitedGames = data;
        GM_setValue('limitedApps', limitedGames);
        iview.Notice.success({
          title: `Better Steampy`,
          desc: `已加载 ${limitedGames.length} 个非受限游戏`,
        });
        resolve(limitedGames);
      },
    });
  });
}

//获取非游戏列表
function getNogameList() {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: 'GET',
      url: 'https://gitee.com/Finnier/getSteamAppListWithType/raw/main/data/Listwithnogame.json',
      responseType: 'json',
      onload: function (response) {
        var data = JSON.parse(response.responseText);
        var nogamelistdata = Object.keys(data).map(Number);
        GM_setValue('NoGameList', nogamelistdata);
        noGameList = nogamelistdata;
        iview.Notice.success({
          title: `Better Steampy`,
          desc: `已加载 ${nogamelistdata.length} 个DLC及原声带`,
        });
        resolve(nogamelistdata);
      },
    });
  });
}

//初始化脚本配置菜单
function init() {
  const settings = document.createElement('div');
  settings.innerHTML = `
      <div id="settings" class="ml-20-rem">
      <div class="withdraw" @click="modal=true, updateValues()">脚本设置</div>
        <Modal v-model="modal">
          <br />
          <Card>
            <template #title><h2>拥有状态标记</h2></template>
            <Alert type="warning" show-icon>暂时不支持捆绑包标记</Alert>
            <p>
              上次更新于
              <i-time :time="lastUpdateTime" :interval="1"></i-time>
              (每24小时执行一次自动更新)
            </p>
            <p>已加载 {{ownedApps}} 个库存游戏及DLC</p>
            <p>已加载 {{wishlist}} 个愿望单游戏</p>
            <p>已加载 {{familygameList}} 个家庭库游戏</p>
            <div>
              是否加入了家庭组：<i-Switch
                v-model="isInFamilyGroup"
                @on-change="isInFamilyGroup_change"
              />
            </div>
            <br />
            <button-group size="large" shape="circle">
              <i-Button @click="reloadSaves" :loading="refershSaves_loading"
                >重载存档</i-Button
              >
              <i-Button @click="clearSaves">清除存档</i-Button>
            </button-group>
          </Card>
          <Card>
            <template #title><h2>个人资料功能受限标记</h2></template>
            <Alert show-icon
              >数据来源于https://github.com/F1NN1ER/getSteamRestrictedGameLIst</Alert
            >
            <Alert show-icon>数据每日更新，可能尚有部分未及时标记</Alert>
            <div>
              是否启用受限游戏标注：<i-Switch
                v-model="checkIsProfileFeatureLimited"
                @on-change="checkIsProfileFeatureLimited_change"
              />
            </div>
            <p>目前共加载{{limitedApps}}个非受限游戏(跟随拥有状态自动更新)</p>
            <i-Button
              @click="reloadLimitedSaves"
              :loading="reloadLimitedSaves_loading"
              >刷新</i-Button
            >
          </Card>
          <Card>
            <template #title><h2>标记颜色设置</h2></template>
            <div>
              已拥有
              <Color-Picker
                v-model="ownedAppsColor"
                size="small"
                :colors="defaultcolors"
                @on-change="ownedAppsColor_change"
              />
            </div>
            <div>
              在愿望单中
              <Color-Picker
                v-model="wishlistColor"
                size="small"
                :colors="defaultcolors"
                @on-change="wishlistColor_change"
              />
            </div>
            <div>
              在家庭库中
              <Color-Picker
                v-model="familygameColor"
                size="small"
                :colors="defaultcolors"
                @on-change="familygameColor_change"
              />
            </div>
            <div>
              未拥有
              <Color-Picker
                v-model="unownedColor"
                size="small"
                :colors="defaultcolors"
                @on-change="unownedColor_change"
              />
            </div>
          </Card>
          <Card>
            <template #title><h2>网页优化</h2></template>
            <div>
              是否关闭网页右下方推广侧栏：<i-Switch
                v-model="isSuspensionOff"
                @on-change="isSuspensionOff_change"
              />
            </div>
          </Card>
        </Modal>
      </div>
  `;
  const filter = document.createElement('div');
  filter.innerHTML = `
  <div id="filter" class="ml-20-rem">
  <Space direction="vertical" size="large">
        <div id="filter">
          <Checkbox-Group v-model="filter"  @on-change="filterChange">
            <Checkbox label="noOwnedGames" border>不显示已拥有游戏</Checkbox>
            <Checkbox label="noRestrictedGames" border >不显示资料受限游戏</Checkbox>
            <Checkbox label="noDlc" border>不显示DLC及原声带</Checkbox>
          </Checkbox-Group>
    </Space>
      `;
  const targetElement = document.querySelector('.balanceTitle > div');
  targetElement.appendChild(settings);
  targetElement.appendChild(filter);
  new Vue({
    el: '#settings',
    data() {
      return {
        reloadLimitedSaves_loading: false,
        refershSaves_loading: false,
        modal: false,
        lastUpdateTime: Saves.lastupdatetime,
        ownedApps: Saves.ownedApps.length,
        wishlist: Saves.wishlist.length,
        familygameList: Saves.familygameList.length,
        limitedApps: limitedApps.length,
        isInFamilyGroup: JSON.parse(localStorage.getItem('isInfamily')),
        checkIsProfileFeatureLimited: JSON.parse(
          localStorage.getItem('IsProfileFeatureLimited')
        ),
        isSuspensionOff: JSON.parse(localStorage.getItem('isSuspensionOff')),
        ownedAppsColor: localStorage.getItem('ownedColor'),
        wishlistColor: localStorage.getItem('wishlistColor'),
        familygameColor: localStorage.getItem('familygameColor'),
        unownedColor: localStorage.getItem('unownedColor'),
        defaultcolors: ['#0c8918', '#177cb0', '#ff8936', '#ff2e63'],
      };
    },
    methods: {
      updateValues() {
        this.ownedApps = Saves.ownedApps.length;
        this.wishlist = Saves.wishlist.length;
        this.familygameList = Saves.familygameList.length;
        this.limitedApps = limitedApps.length;
        this.lastUpdateTime = Saves.lastupdatetime;
      },
      isInFamilyGroup_change(status) {
        if (status) {
          localStorage.setItem('isInfamily', JSON.stringify(true));
        } else {
          localStorage.removeItem('isInfamily');
        }
      },
      checkIsProfileFeatureLimited_change(status) {
        if (status) {
          localStorage.setItem('IsProfileFeatureLimited', JSON.stringify(true));
          Saves = GM_getValue('Saves');
          const elements = document.querySelectorAll('.cdkGameIcon');
          elements.forEach((element) => {
            cdkeyGameChecker(element);
          });
        } else {
          localStorage.removeItem('IsProfileFeatureLimited');
          const elements = document.querySelectorAll('.ProfileFeaturesLimited');
          elements.forEach((element) => {
            element.parentNode.removeChild(element);
          });
        }
      },
      isSuspensionOff_change(status) {
        if (status) {
          localStorage.setItem('isSuspensionOff', JSON.stringify(true));
          GM_addStyle('.suspension{display:none}');
        } else {
          GM_addStyle('.suspension{display:block}');
          localStorage.removeItem('isSuspensionOff');
        }
      },
      ownedAppsColor_change(color) {
        ownedColor = color;
        localStorage.setItem('ownedColor', color);
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
      },
      wishlistColor_change(color) {
        wishlistColor = color;
        localStorage.setItem('wishlistColor', color);
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
      },
      familygameColor_change(color) {
        familygameColor = color;
        localStorage.setItem('familygameColor', color);
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
      },
      unownedColor_change(color) {
        unownedColor = color;
        localStorage.setItem('unownedColor', color);
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
      },
      async reloadSaves() {
        this.$Notice.info({
          title: '正在重载存档',
        });
        this.refershSaves_loading = true;
        await Promise.all([
          getOwnAndWish(),
          this.isInFamilyGroup ? getFamilyGame() : Promise.resolve(),
        ]);
        Saves = GM_getValue('Saves');
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
        this.updateValues();
        this.refershSaves_loading = false;
        this.$Notice.success({
          title: '重载完毕',
        });
      },
      async reloadLimitedSaves() {
        this.$Notice.info({
          title: '正在加载受限游戏列表',
        });
        this.reloadLimitedSaves_loading = true;
        await getLimitedGamesList();
        await getNogameList();
        limitedApps = GM_getValue('limitedApps');
        this.updateValues();
        this.reloadLimitedSaves_loading = false;
        this.$Notice.success({
          title: '加载完毕',
        });
      },
      clearSaves() {
        this.$Notice.info({
          title: '存档已清除',
        });
        let nullSaves = {
          wishlist: [],
          ownedApps: [],
          familygameList: [],
          lastupdatetime: 0,
        };
        Saves = nullSaves;
        GM_setValue('Saves', nullSaves);
        this.updateValues();
      },
    },
  });
  new Vue({
    el: '#filter',
    data() {
      return {
        filter: [],
      };
    },
    methods: {
      filterChange() {
        noownedGames = this.filter.includes('noOwnedGames');
        noRestrictedGames = this.filter.includes('noRestrictedGames');
        noDlc = this.filter.includes('noDlc');
        const elements = document.querySelectorAll('.cdkGameIcon');
        elements.forEach((element) => {
          cdkeyGameChecker(element);
        });
      },
    },
  });
  if (localStorage.getItem('isSuspensionOff') === 'true') {
    GM_addStyle('.suspension{display:none}');
  }
}

//游戏状态标记-CDKEY
function cdkeyGameChecker(element) {
  const isAppOwned = (appId) => Saves.ownedApps.includes(appId);
  const isAppinwishlist = (appId) => Saves.wishlist.includes(appId);
  const isAppShared = (appId) => Saves.familygameList.includes(appId);
  const isNotLimited = (appId) => !limitedApps.includes(appId);
  const isDLC = (appId) => noGameList.includes(appId);
  const getAppId = (url) => (url.match(/\/apps\/(\d+)\//) || [])[1] || null;
  const getBundleId = (url) =>(url.match(/\/bundles\/(\d+)\//) || [])[1] || null;
  const appId = Number(getAppId(element.getAttribute('data-src')));
  const gameNameElement = element
    .closest('.gameblock')
    .querySelector('.gameName');

  if (appId != 0) {
    element.parentElement.parentElement.style.display = 'block';
    if (noDlc) {
      if (isDLC(appId)) {
        element.parentElement.parentElement.style.display = 'none';
      }
    }
    if (isAppOwned(appId)) {
      if (noownedGames) {
        element.parentElement.parentElement.style.display = 'none';
      } else {
        gameNameElement.style.color = ownedColor;
      }
    } else if (isAppShared(appId)) {
      gameNameElement.style.color = familygameColor;
    } else if (isAppinwishlist(appId)) {
      gameNameElement.style.color = wishlistColor;
    } else {
      gameNameElement.style.color = unownedColor;
    }
    if (localStorage.getItem('IsProfileFeatureLimited')) {
      const existingDiscountDiv = element.parentElement.querySelector(
        '.ProfileFeaturesLimited'
      );
      if (existingDiscountDiv) {
        existingDiscountDiv.remove();
      }
      if (isNotLimited(appId)) {
        if (noRestrictedGames) {
          element.parentElement.parentElement.style.display = 'none';
        } else {
          const discountDiv = document.createElement('div');
          discountDiv.className = 'ProfileFeaturesLimited';
          discountDiv.textContent = '资料受限';
          element.parentElement.appendChild(discountDiv);
        }
      }
    }

  }
}

//加载存档
function load() {
  var previousSave = GM_getValue('Saves');
  if (previousSave !== undefined) {
    Saves = GM_getValue('Saves');
  } else {
    GM_setValue('Saves', Saves);
  }
  var previousLimitedApps = GM_getValue('limitedApps');
  if (previousLimitedApps !== undefined) {
    limitedApps = GM_getValue('limitedApps');
  } else {
    getLimitedGamesList();
  }
  var previousNoGameList = GM_getValue('NoGameList');
  if (previousNoGameList !== undefined) {
    noGameList = GM_getValue('NoGameList');
  } else {
    getNogameList();
  }
  //自动更新
  if (new Date().getTime() - Saves.lastupdatetime > 86400000) {
    iview.Notice.info({
      title: '存档自动更新中',
    });
    getOwnAndWish();
    if (JSON.parse(localStorage.getItem('isInfamily'))) {
      getFamilyGame();
    }
    getLimitedGamesList();
    getNogameList();
  }
}

//监听页面变化
function observePageChanges() {
  const config = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-src'],
  };
  let hasExecuted = false;
  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (
        mutation.type === 'attributes' &&
        mutation.attributeName === 'data-src'
      ) {
        const targetElement = mutation.target;
        if (targetElement.classList.contains('cdkGameIcon')) {
          cdkeyGameChecker(targetElement);
        }
      }

      if (!hasExecuted && mutation.type === 'childList') {
        const balanceTitleElement = document.querySelector(
          '.balanceTitle > div'
        );
        if (balanceTitleElement) {
          init();
          hasExecuted = true;
        }
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(document.body, config);
}
//CSS样式
const style = document.createElement('style');
style.innerHTML = `
    .ProfileFeaturesLimited {
    width: .65rem;
    height: .3rem;
    background: #ed4014;
    position: absolute;
    top: 0;
    color: #fff;
    text-align: center;
    line-height: .3rem;
    font-size: .12rem;
}
`;
document.head.appendChild(style);

//默认颜色
if (!localStorage.getItem('ownedColor')) {
  localStorage.setItem('ownedColor', '#0c8918');
  localStorage.setItem('wishlistColor', '#177cb0');
  localStorage.setItem('familygameColor', '#ff8936');
  localStorage.setItem('unownedColor', '#ff2e63');
}
var ownedColor = localStorage.getItem('ownedColor');
var wishlistColor = localStorage.getItem('wishlistColor');
var familygameColor = localStorage.getItem('familygameColor');
var unownedColor = localStorage.getItem('unownedColor');

//Todo list:
//夜间模式
//侧栏收放
//中键快捷控制标签页
//左右翻页

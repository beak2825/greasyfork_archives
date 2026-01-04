// ==UserScript==
// @name         Bilibili直播SC过滤
// @namespace    https://github.com/journey-ad
// @version      0.3.2
// @description  通过UID、关键词或正则表达式过滤哔站直播间的SC
// @author       journey-ad
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://cdn.jsdelivr.net/npm/vue@2
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @require      https://greasyfork.org/scripts/417560-bliveproxy/code/bliveproxy.js?version=984333
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/437580/Bilibili%E7%9B%B4%E6%92%ADSC%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/437580/Bilibili%E7%9B%B4%E6%92%ADSC%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const __SCRIPT_VERSION = '0.3.2';

  let store = null,
    blockUser = [], // 屏蔽用户列表
    uidList = [], // 屏蔽用户UID列表
    blockContent = [], // 屏蔽内容列表
    pattern = null // 最终生成的正则表达式

  function initApp() {
    store = new MyStorage('__SC_BLOCK_DATA') // 初始化存储池

    blockUser = store.get('blockUser', blockUser)
    blockContent = store.get('blockContent', blockContent)

    updateBlockList() // 更新屏蔽列表

    // hook初始化接口，过滤sc数据
    ah.proxy({
      onRequest: (config, handler) => {
        // Ajax-hook库的bug
        // 什么都不做也要加上onRequest方法，不然会丢掉header导致csrf校验失败
        handler.next(config);
      },
      onResponse: (response, handler) => {
        if (response.config.url.includes('/xlive/web-room/v1/index/getInfoByRoom')) {
          // console.log('======HOOK=======', response)
          const _resp = JSON.parse(response.response)

          // 过滤初始化数据的sc
          if (_resp?.data?.super_chat_info?.message_list) {
            _resp.data.super_chat_info.message_list = scFilter(_resp.data.super_chat_info.message_list)
          }

          response.response = JSON.stringify(_resp)
        }

        handler.next(response);
      },
      onError: (error, handler) => {
        // 触发b站自己的xhr请求错误处理逻辑，避免一些未预期的行为 如无法显示大航海列表
        handler?.xhrProxy?.onerror?.()
        handler.next(error)
      }
    })

    if (window?.__SSR_INITIAL_STATE__?.baseInfoRoom?.super_chat_info?.message_list) {
      window.__SSR_INITIAL_STATE__.baseInfoRoom.super_chat_info.message_list = scFilter(window.__SSR_INITIAL_STATE__.baseInfoRoom.super_chat_info.message_list)
    }

    if (window?.__NEPTUNE_IS_MY_WAIFU__?.roomInfoRes?.data?.super_chat_info?.message_list) {
      window.__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.super_chat_info.message_list = scFilter(window.__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.super_chat_info.message_list)
    }

    function scFilter(list) {
      return list.filter(item => {
        return !check({ type: 'SC', uid: item.uid, name: item.user_info.uname, msg: item.message })
      })
    }

    // 通过sc右上角菜单屏蔽
    $(document).on('click', '#pay-note-panel-vm .card-list .card-item-box', function (e) {
      // 等一会详情dom加载，应该有更好的方法
      setTimeout(() => {
        $('#pay-note-panel-vm .detail-info .card-detail').on('click', '.more', function (e) {
          // 已经添加过屏蔽按钮
          if ($('#pay-note-panel-vm .card-detail .danmaku-menu .add-blocklist').length > 0) return

          const cardEl = $(this).closest('.card-detail')[0]
          const cardVM = cardEl.__vue__
          const scData = cardVM?.currentCardData || null // 从挂载的vue实例拿到sc数据

          if (!scData) return

          const { uid, userInfo, message } = scData
          const { uname } = userInfo
          const roomid = window.BilibiliLive.ROOMID // 从全局变量拿到直播间号

          const menuEl = $(cardEl).find('.danmaku-menu')
          const menuItem = $(`<div class="none-select"><a class="clickable bili-link pointer add-blocklist"><span>添加UID到黑名单</span></a></div>`)
          menuItem.find('.add-blocklist').data('scData', { uid, uname, message, roomid })

          // 插入菜单项
          menuEl.append(menuItem)

          $('#pay-note-panel-vm .card-detail .danmaku-menu').one('click', '.add-blocklist', function (e) {
            cardVM.showInfo = false

            const scData = $(this).data('scData')

            // 添加屏蔽
            addBlock('user', scData)

            // 隐藏这个uid所有sc
            hideSC(uid)
          })
        })

      }, 200);
    })
  }

  function initSettingPanel() {

    const cssText = `.sc-block-setting {
      display: none;
      position: absolute;
      right: 3%;
      bottom: 32px;
      width: 94%;
      background: #fff;
      border-radius: 6px;
      padding: 6px 6px;
      box-sizing: border-box;
      color: #444;
      font-size: 12px;
      border: 1px solid #e7e7e7;
      box-shadow: 0px 1px 10px #e9e9e9;
      z-index: 100;
    }
    .sc-block-setting * {
      box-sizing: border-box;
    }
    .sc-block-setting ::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }
    .sc-block-setting ::-webkit-scrollbar-button {
      width: 0;
      height: 0;
    }
    .sc-block-setting ::-webkit-scrollbar-thumb {
      background: #e1e1e1 !important;
      border-radius: 4px;
    }
    .sc-block-setting fieldset {
      margin: 0;
      padding: 0 4px;
      border: 1px solid #efefef;
    }
    .sc-block-setting fieldset legend {
      padding: 0 4px;
      margin-bottom: 2px;
    }
    .sc-block-setting input[type="text"] {
      display: block;
      appearance: none;
      width: 100%;
      height: 22px;
      line-height: 22px;
      padding: 0 6px;
      border: 1px solid #999;
      border-radius: 2px;
      outline: 0;
    }
    .sc-block-setting input[type="text"]::-webkit-input-placeholder {
      color: #ccc;
    }
    .sc-block-setting input[type="text"]:focus {
      border-color: #4caf50;
    }
    .sc-block-setting button {
      display: flex;
      justify-content: center;
      align-items: center;
      appearance: none;
      margin-left: 5px;
      height: 22px;
      padding: 0 7px;
      font-size: 12px;
      color: #137cbd;
      background: #fff;
      border: 1px solid #23ade5;
      border-radius: 3px;
      line-height: 1;
      user-select: none;
      cursor: pointer;
      transition: all 0.12s ease-in-out;
    }
    .sc-block-setting button:hover {
      color: #fff;
      background: #23ade5;
    }
    .sc-block-setting .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      padding: 0 0 6px;
      border-bottom: 1px solid #efefef;
    }
    .sc-block-setting .header-bar h4 {
      font-size: 14px;
      margin: 0;
    }
    .sc-block-setting .header-bar .btn {
      cursor: pointer;
      user-select: none;
      font-size: 0;
      margin-right: 2px;
    }
    .sc-block-setting .header-bar .btn.setting-btn svg {
      fill: #222;
    }
    .sc-block-setting .header-bar .btn svg {
      fill: #444;
    }
    .sc-block-setting .header-bar .setting-btn {
      margin-left: auto;
      margin-right: 8px;
    }
    .sc-block-setting .setting-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      overflow: hidden;
    }
    .sc-block-setting .setting-content .setting-item,
    .sc-block-setting .setting-content .func-item {
      float: left;
      display: flex;
      align-items: center;
      height: 24px;
      margin-top: 4px;
    }
    .sc-block-setting .setting-content .setting-item {
      margin: 0 5px;
    }
    .sc-block-setting .setting-content .setting-item input[type="checkbox"] {
      cursor: pointer;
    }
    .sc-block-setting .setting-content .setting-item label {
      margin-left: 2px;
      cursor: pointer;
      user-select: none;
    }
    .sc-block-setting .section {
      margin-top: 10px;
    }
    .sc-block-setting .section .empty {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      color: #5e5e5e;
    }
    .sc-block-setting .keyword-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sc-block-setting .keyword-wrap .add-keyword,
    .sc-block-setting .keyword-wrap .add-uid {
      flex: none;
    }
    .sc-block-setting .block-list {
      min-height: 50px;
      max-height: 122px;
      margin-top: 8px;
      overflow-y: auto;
    }
    .sc-block-setting .block-list.list-content .block-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 250px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .sc-block-setting .block-list.list-content .block-item.is-regex {
      color: #ff9800;
      background: #fff9c5;
    }
    .sc-block-setting .block-list.list-content .block-item.is-regex::after {
      content: "[正则]";
      position: absolute;
      top: 50%;
      right: 28px;
      transform: translateY(-50%);
      color: #ccc;
    }
    .sc-block-setting .block-list.list-content .block-item.is-regex span {
      width: 190px;
    }
    .sc-block-setting .block-list.list-content .block-item span {
      width: 210px;
    }
    .sc-block-setting .block-list.list-content .block-item button {
      margin-right: 6px;
    }
    .sc-block-setting .block-list.list-user .block-item button {
      position: absolute;
      right: 6px;
      top: 12px;
    }
    .sc-block-setting .block-list .block-item {
      position: relative;
      padding: 2px 6px;
      padding-right: 0;
    }
    .sc-block-setting .block-list .block-item:nth-of-type(odd) {
      background-color: #f9f9f9;
      border-top: 1px solid #FAFAFA;
    }
    .sc-block-setting .block-list .block-item:hover button {
      opacity: 1;
    }
    .sc-block-setting .block-list .block-item a {
      color: #23ade5;
      cursor: pointer;
    }
    .sc-block-setting .block-list .block-item span {
      margin-right: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sc-block-setting .block-list .block-item button {
      flex: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      font-size: 10px;
      margin-left: 4px;
      opacity: 0;
      transition: 0.2s opacity ease-in-out;
    }
    .sc-block-setting .block-list .block-item .user-info,
    .sc-block-setting .block-list .block-item .meta-info {
      display: flex;
      justify-content: flex-start;
      max-width: 220px;
      line-height: 16px;
    }
    .sc-block-setting .block-list .block-item .meta-info {
      font-size: 11px;
      color: #9f9f9f;
    }
    .sc-block-setting .block-list .block-item .meta-info a {
      color: #9f9f9f;
    }
    .sc-block-setting .block-list .block-item .uid {
      flex: none;
    }
    .sc-block-setting .block-list .block-item .message {
      height: 24px;
      line-height: 24px;
      width: 235px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }`;

    const template = `
    <div id="sc-block-setting-vm" class="sc-block-setting">
      <div class="header-bar">
        <h4>SC屏蔽助手 v${__SCRIPT_VERSION}</h4>
        <div class="btn setting-btn" @click="toggleSetingPanel"><svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M633.6 938.667c-8.533 0-17.067-6.4-21.333-14.934-14.934-44.8-55.467-72.533-102.4-72.533s-87.467 29.867-102.4 72.533c-4.267 10.667-14.934 17.067-25.6 14.934-74.667-21.334-140.8-61.867-194.134-117.334-8.533-8.533-8.533-21.333 0-27.733 17.067-19.2 25.6-42.667 25.6-68.267 0-57.6-46.933-104.533-106.666-104.533H96c-10.667 2.133-21.333-6.4-23.467-17.067C66.133 573.867 64 544 64 514.133c0-44.8 6.4-89.6 21.333-132.266 2.134-8.534 10.667-14.934 21.334-14.934 59.733 0 108.8-46.933 108.8-104.533 0-17.067-4.267-32-10.667-46.933-6.4-10.667-4.267-21.334 2.133-27.734 53.334-49.066 117.334-83.2 185.6-102.4 10.667-2.133 19.2 2.134 25.6 10.667 19.2 36.267 55.467 57.6 96 57.6s76.8-21.333 96-57.6c4.267-8.533 14.934-12.8 25.6-10.667 68.267 19.2 132.267 53.334 185.6 102.4 6.4 6.4 8.534 17.067 4.267 25.6-6.4 14.934-10.667 29.867-10.667 46.934 0 57.6 46.934 104.533 106.667 104.533 8.533 0 19.2 6.4 21.333 14.933C955.733 422.4 964.267 467.2 964.267 512c0 29.867-2.134 59.733-8.534 89.6-2.133 10.667-12.8 19.2-23.466 17.067H921.6c-59.733 0-106.667 46.933-106.667 104.533 0 25.6 8.534 49.067 25.6 68.267 6.4 8.533 6.4 21.333 0 27.733C780.8 874.667 714.667 915.2 640 938.667h-6.4zM512 808.533c57.6 0 108.8 32 134.4 83.2 53.333-19.2 102.4-49.066 145.067-87.466C776.533 780.8 768 753.067 768 725.333c0-78.933 64-145.066 145.067-147.2 4.266-21.333 4.266-42.666 4.266-64 0-36.266-4.266-72.533-14.933-106.666-74.667-6.4-134.4-70.4-134.4-147.2 0-17.067 2.133-34.134 8.533-49.067-40.533-34.133-89.6-61.867-140.8-78.933C608 172.8 563.2 198.4 512 198.4s-96-25.6-123.733-66.133c-51.2 17.066-100.267 42.666-140.8 78.933 6.4 14.933 8.533 32 8.533 49.067 0 76.8-59.733 140.8-134.4 147.2-8.533 34.133-14.933 70.4-14.933 106.666 0 21.334 2.133 42.667 4.266 64C192 578.133 256 644.267 256 723.2c0 27.733-8.533 55.467-23.467 78.933 40.534 38.4 91.734 68.267 145.067 87.467 25.6-49.067 76.8-81.067 134.4-81.067z"/><path d="M512 682.667c-93.867 0-170.667-76.8-170.667-170.667S418.133 341.333 512 341.333 682.667 418.133 682.667 512 605.867 682.667 512 682.667zM512 384c-70.4 0-128 57.6-128 128s57.6 128 128 128 128-57.6 128-128-57.6-128-128-128z"/></svg></div>
        <div class="btn close-btn" @click="closeSetting"><svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"/></svg></div>
      </div>
      <div class="setting-content" v-if="showSetting">
        <div class="setting-item">
          <input type="checkbox" v-model="setting.showRef" id="sc-block-show-ref" />
          <label for="sc-block-show-ref">显示来源</label>
        </div>
        <div class="setting-item">
          <input type="checkbox" v-model="setting.danmaku" id="sc-block-danmaku" />
          <label for="sc-block-danmaku">过滤弹幕</label>
        </div>
        <div class="setting-item">
          <input type="checkbox" v-model="setting.syncSite" id="sc-block-sync-site" />
          <label for="sc-block-sync-site">同时添加到网站</label>
        </div>
        <div class="func-item">
          <button class="btn clear-btn" @click="reset">清空记录</button>
          <button class="btn sync-btn" @click="handleSyncSiteShield">从网站同步</button>
        </div>
      </div>
      <fieldset class="section">
        <legend>关键词屏蔽</legend>
        <div class="keyword-wrap">
          <input type="text" class="sc-block-keyword" v-model.trim="keyword" placeholder="输入要屏蔽的关键词 支持正则" tabindex="1">
          <button class="add-keyword" @click="handleAdd('content')" tabindex="2">添加</button>
        </div>
        <div class="block-list list-content" v-if="blockContent.length">
          <div class="block-item" :class="{ 'is-regex': isVaildRegex(item) }" v-for="(item, index) in blockContent">
            <span :title="item">{{ item }}</span>
            <button @click="handleRemove('content', index)">X</button>
          </div>
        </div>
        <div class="empty" v-else>暂无内容</div>
      </fieldset>
      <fieldset class="section">
        <legend>UID屏蔽</legend>
        <div class="keyword-wrap">
          <input type="text" class="sc-block-uid" v-model.trim="uid" placeholder="输入要屏蔽的UID" tabindex="3">
          <button class="add-uid" @click="handleAdd('uid')" tabindex="4">添加</button>
        </div>
        <div class="block-list list-user" v-if="blockUser.length">
          <div class="block-item" v-for="(item, index) in blockUser">
            <button @click="handleRemove('user', index)">X</button>
            <div class="user-info">
              <span class="name"><a :href="'https://space.bilibili.com/'+item.uid" target="_blank" :title="item.uname">{{ item.uname }}</a></span>
              <span class="uid">UID: {{ item.uid }}</span>
            </div>
            <div class="meta-info">
              <span class="room"><a :href="'https://live.bilibili.com/'+item.roomid" target="_blank">直播间 {{ item.roomid }}</a></span>
              <span class="date">{{ item.ts | dateFmt('yyyy-MM-dd hh:mm:ss') }}</span>
            </div>
            <div class="message" :title="item.ref" v-if="setting.showRef">{{ item.ref }}</div>
          </div>
        </div>
        <div class="empty" v-else>暂无内容</div>
      </fieldset>
    </div>`;

    const appConf = {
      data: {
        uid: '', // 屏蔽UID
        keyword: '', // 屏蔽关键词
        blockUser, // 屏蔽用户列表
        blockContent, // 屏蔽内容列表
        roomid: window.BilibiliLive.ROOMID, // 直播间号
        token: '', // CSRF Token
        showSetting: false, // 是否显示扩展设置
        // 设置项
        setting: {
          showRef: false, // 显示屏蔽来源
          danmaku: true, // 同时过滤弹幕
          syncSite: false, // 同时添加到网站
        },
      },
      watch: {
        setting: {
          handler() {
            this.saveSetting();
          },
          deep: true,
        }
      },
      created() {
        this.setting = store.get('setting', this.setting);

        this.handleBroadcast();

        const token = document.cookie.match(/bili_jct=([0-9a-fA-F]{32})/);
        if (token) {
          this.token = token[1]
        } else {
          return this.toast('找不到令牌', 'error');
        }
      },
      methods: {
        closeSetting() {
          $('#sc-block-setting-vm').fadeOut(200);

          this.saveSetting();
        },
        toggleSetingPanel() {
          this.showSetting = !this.showSetting;
        },
        saveSetting() {
          store.set('setting', this.setting);
        },
        handleAdd(type) {
          if (type === 'content') {
            if (this.keyword === '') {
              return;
            }

            if (this.setting.syncSite) {
              this.addSiteShield('content', this.keyword);
            }

            addBlock('content', this.keyword);
            this.keyword = '';

          } else if (type === 'uid') {
            if (this.uid === '') {
              return;
            }

            if (this.setting.syncSite) {
              this.addSiteShield('uid', this.uid);
            }

            this.fetchUserInfo(this.uid)
              .then(({ name }) => {

                addBlock('user', {
                  uid: this.uid,
                  uname: name,
                  roomid: this.roomid,
                  message: '[通过UID手动屏蔽]'
                })

                this.uid = '';
              })
              .catch(err => {
                this.toast(err.message, 'error');
              })
          }
        },
        handleRemove(type, index) {
          if (type === 'content') {
            removeBlock('content', index);
          } else if (type === 'user') {
            removeBlock('user', index);
          }
        },
        // 同步屏蔽列表
        handleSyncSiteShield() {
          this.fetchSiteShield(this.roomid)
            .then(({ users, keywords }) => {
              const newBlockUser = users.map(user => {
                return {
                  uid: user.uid,
                  uname: user.uname,
                  roomid: this.roomid,
                  message: '[同步自网站屏蔽列表]'
                }
              })

              addBlock('user', newBlockUser);
              addBlock('content', keywords);

              this.toast('同步完成', 'info');
            })
            .catch(err => {
              this.toast(err.message, 'error');
            })
        },
        // 重置屏蔽列表
        reset() {
          blockUser = [];
          blockContent = [];

          this.blockUser = blockUser;
          this.blockContent = blockContent;

          updateBlockList();
          this.toast('记录已清空', 'info');
        },
        // 获取用户信息
        fetchUserInfo(uid) {
          return new Promise((resolve, reject) => {
            fetch('https://api.bilibili.com/x/space/acc/info?mid=' + uid, {
              method: "GET",
              mode: "cors",
              credentials: "include"
            })
              .then(res => res.json())
              .then(resp => {
                // console.log(resp)
                if (resp.code === 0) {
                  const { mid, name } = resp.data;
                  resolve({ mid, name })
                } else {
                  reject(new Error(resp.message))
                }
              })
              .catch(err => {
                reject(err)
              })
          })
        },
        // 获取网站屏蔽列表
        fetchSiteShield(roomid) {
          return new Promise((resolve, reject) => {
            fetch('https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=' + roomid, {
              method: "GET",
              mode: "cors",
              credentials: "include"
            })
              .then(res => res.json())
              .then(resp => {
                if (resp.code === 0) {
                  const { shield_user_list: users, keyword_list: keywords } = resp.data.shield_info;
                  resolve({ users, keywords })
                } else {
                  reject(new Error(resp.message))
                }
              })
              .catch(err => {
                reject(err)
              })
          })
        },
        // 添加至网站屏蔽
        addSiteShield(type = 'uid', data) {
          let api = '', body = ''

          if (type === 'uid') {
            api = 'https://api.live.bilibili.com/liveact/shield_user';

            body = new URLSearchParams({
              roomid: this.roomid,
              uid: data,
              type: 1,
              csrf_token: this.token,
              csrf: this.token,
              visit_id: ''
            })

          } else if (type === 'content') {
            api = 'https://api.live.bilibili.com/xlive/web-ucenter/v1/banned/AddShieldKeyword';

            const formData = new FormData();
            formData.append('keyword', data);
            formData.append('csrf', this.token);
            formData.append('csrf_token', this.token);

            body = formData;
          }

          fetch(api, {
            body,
            method: "POST",
            mode: "cors",
            credentials: "include"
          })
            .then(res => res.json())
            .then(resp => {
              console.log(resp)
            })
            .catch(err => {
              console.error(err)
            })
        },
        // 处理广播过滤
        handleBroadcast() {
          // 弹幕
          bliveproxy.addCommandHandler('DANMU_MSG', command => {
            // 设置里不处理弹幕
            if (!this.setting.danmaku) return;

            let info = command.info

            const msg = info[1]
            const [uid, name] = info[2]

            if (check({ type: '弹幕', uid, name, msg })) {
              command.cmd = "NULL"
            }
          })

          // SC
          bliveproxy.addCommandHandler('SUPER_CHAT_MESSAGE', command => {
            const { roomid, data } = command
            const { uid, message: msg, user_info } = data
            const name = user_info.uname

            if (check({ type: 'SC', uid, name, msg })) {
              command.cmd = "NULL"
            }
          })
        },
        ...Utils
      },
      filters: {
        dateFmt(ts, format) {
          const dateData = new Date(ts * 1000);
          const date = {
            "M+": dateData.getMonth() + 1,
            "d+": dateData.getDate(),
            "h+": dateData.getHours(),
            "m+": dateData.getMinutes(),
            "s+": dateData.getSeconds(),
            "q+": Math.floor((dateData.getMonth() + 3) / 3),
            "S+": dateData.getMilliseconds()
          };
          if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, String(dateData.getFullYear()).substr(4 - RegExp.$1.length));
          }
          for (let k in date) {
            if (new RegExp('(' + k + ')').test(format)) {
              format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                date[k] : ("00" + date[k]).substr(String(date[k]).length));
            }
          }
          return format;
        }
      }
    }

    Utils.addStyle(cssText);
    const $settingPanel = new Vue(appConf)

    const $btn = $('<span class="btn-sc-block live-skin-main-text">SC屏蔽助手</span>')
    $btn.css({ fontSize: '12px', margin: '0 5px', cursor: 'pointer', lineHeight: '24px', userSelect: 'none' })
    $btn.on('click', function () {
      $('#sc-block-setting-vm').toggle(200)
    })

    new MutationObserver((mutations, observer) => {
      if (Utils.get('.icon-right-part')) {
        observer.disconnect();
        $('#control-panel-ctnr-box .icon-right-part').prepend($btn)
        $('#control-panel-ctnr-box .control-panel-icon-row').append(template)
        $settingPanel.$mount('#sc-block-setting-vm')
      }
    })
      .observe(Utils.get('#control-panel-ctnr-box') || document.body, { childList: true, subtree: true });
  }

  // 检查是否在屏蔽名单内
  function check({ type = '弹幕', uid, name, msg }) {
    const content = `[${type}]${name}: ${msg}`

    // 检查uid
    if (uidList.includes(uid)) {
      console.warn('UID blocked', uid, content)
      return true
    }

    // 检查名字和内容
    if (pattern) {
      const match = content.match(pattern)
      if (match) {
        console.warn('Content blocked', uid, content, `======> ${match[0]}`)
        return true
      } else {
        return false
      }
    }
  }

  // 隐藏指定uid发送的sc
  function hideSC(uids) {
    if (Utils.typeOf(uids) !== 'array') uids = [uids]

    $('.card-list .card-item-box').each((_, item) => {
      const uid = item.__vue__.itemData.uid

      if (uids.includes(uid)) {
        item.__vue__.itemData.show = false
      }
    })

    // 关闭已打开的sc详情
    //     详情窗口打开时会监听window对象的click事件，并调用closeMask方法来关闭详情窗口
    //     这里直接给body派发一个click事件触发它
    $('body').trigger('click')
  }

  // 添加屏蔽
  function addBlock(type, data) {
    if (!Array.isArray(data)) {
      data = [data]
    }

    data.forEach(item => {
      const ts = Date.now() / 1000 | 0

      switch (type) {
        case 'user':
          const { uid, uname, message, roomid } = item

          if (!uidList.includes(parseInt(uid))) {
            blockUser.unshift({
              uid: parseInt(uid), // uid
              uname, // 名字
              roomid, // 直播间号
              ts, // 时间戳
              ref: message // sc内容
            })
          } else {
            if (data.length === 1) {
              Utils.toast('已在屏蔽名单中', 'warn')
            }
          }
          break;

        case 'content':
          if (!blockContent.includes(item)) {
            blockContent.unshift(item)
          } else {
            if (data.length === 1) {
              Utils.toast('已在屏蔽名单中', 'warn')
            }
          }
          break;

        default:
          break;
      }
    })

    if (data.length === 1) Utils.toast('添加屏蔽成功', 'success');

    updateBlockList()
  }

  // 移除屏蔽项
  function removeBlock(type, index) {
    switch (type) {
      case 'user':
        blockUser.splice(index, 1)
        break;

      case 'content':
        blockContent.splice(index, 1)
        pattern = Utils.generatePattern(blockContent)
        break;

      default:
        break;
    }

    Utils.toast('移除屏蔽成功', 'info', 1000);

    updateBlockList()
  }

  // 更新屏蔽列表
  function updateBlockList() {
    // 屏蔽用户uid列表
    uidList = blockUser.map(item => parseInt(item.uid))
    // 生成过滤正则
    pattern = Utils.generatePattern(blockContent)

    store.set('blockUser', blockUser)
    store.set('blockContent', blockContent)
  }

  // ====================== 工具 ======================

  // 存储池管理
  class MyStorage {
    constructor(key) {
      if (!key) throw new Error('cache key is required')

      this.key = key
      this.data = {}

      try {
        const _cached = JSON.parse(localStorage.getItem(this.key)) || {}
        this.data = _cached || {}
      } catch (e) {
        this.data = {}
      }
    }

    get(key, defaultValue) {
      return this.data[key] || defaultValue
    }

    set(key, data) {
      this.data[key] = data
      this.save()
    }

    remove(key) {
      delete this.data[key]
      this.save()
    }

    clear() {
      this.data = {}
      this.save()
    }

    has(key) {
      return this.data[key] !== undefined
    }

    save() {
      localStorage.setItem(this.key, JSON.stringify(this.data))
    }
  }

  // 封装一些工具
  const Utils = {
    create(nodeType, config, appendTo) {
      const element = document.createElement(nodeType);
      config && this.set(element, config);
      if (appendTo) appendTo.appendChild(element);
      return element;
    },
    set(element, config, appendTo) {
      if (config) {
        for (const [key, value] of Object.entries(config)) {
          element[key] = value;
        }
      }
      if (appendTo) appendTo.appendChild(element);
      return element;
    },
    get(selector) {
      if (selector instanceof Array) {
        return selector.map(item => this.get(item));
      }
      return document.body.querySelector(selector);
    },
    toast(msg, type = 'success', duration = 3000) {
      const classMap = {
        success: 'success',
        warn: 'caution',
        error: 'error',
        info: 'info'
      }
      let toast = this.create('div', {
        innerHTML: `<div class="link-toast absolute ${classMap[type]}" style="left: 50%;top: 60%;"><span class="toast-text">${msg}</span></div>`
      });
      document.querySelector('#aside-area-vm').appendChild(toast);
      toast.firstChild.style.marginLeft = -toast.firstChild.offsetWidth / 2 + 'px';
      setTimeout(() => document.querySelector('#aside-area-vm').removeChild(toast), duration);
    },
    // 检测是否处于iframe内嵌环境
    inIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    },
    typeOf(val) {
      const typed = Object.prototype.toString.call(val)

      switch (typed) {
        case '[object Object]':
          return 'object'
        case '[object Array]':
          return 'array'
        case '[object String]':
          return 'string'
        case '[object Number]':
          return 'number'
        case '[object Boolean]':
          return 'boolean'
        case '[object Function]':
          return 'function'
        case '[object RegExp]':
          return 'regex'
        case '[object Null]':
          return 'null'
        case '[object Undefined]':
          return 'undefined'
        default:
          if (val instanceof Element) {
            return 'element'
          }

          return 'unknown'
      }
    },
    // 根据传入关键词列表生成正则表达式
    generatePattern(list) {
      if (!list || !list.length) return null

      const keys = list.map(item => {
        if (this.isVaildRegex(item)) {
          // 如果字符串为有效的正则表达式则将其内容作为关键词
          return this.getRegex(item).source
        } else {
          // 作为普通字符串，为避免生成最终正则时产生歧义，先将其转义
          return this.escapeRegex(item)
        }
      })

      let pattern = null

      try {
        // 生成正则表达式
        pattern = new RegExp(keys.join('|'), 'i');
        console.log('pattern', pattern);
      } catch (e) {
        console.error(e)
      }

      return pattern
    },
    // 检测字符串是否为有效的正则表达式 eg: /^\d+$/
    isVaildRegex(str) {
      // 非字符串直接返回false
      if (this.typeOf(str) !== 'string') return false
      // 字符串长度小于3不可能是正则
      if (str.length < 3) return false

      // 如果字符串以/开头，且以/结尾，则可能是正则
      if (/^\/.+\/[gimuy]*$/.test(str)) {
        try {
          return new RegExp(str)
        } catch (e) {
          return false
        }
      }

      return false
    },
    // 根据传入字符串获取正则表达式对象
    getRegex(regex) {
      try {
        regex = regex.trim();
        let parts = regex.split('/');
        if (regex[0] !== '/' || parts.length < 3) {
          regex = regex.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); //escap common string
          return new RegExp(regex);
        }

        const option = parts[parts.length - 1];
        const lastIndex = regex.lastIndexOf('/');
        regex = regex.substring(1, lastIndex);
        return new RegExp(regex, option);
      } catch (e) {
        return null
      }
    },
    // 转义正则表达式中的特殊字符
    escapeRegex(string) {
      return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    },
    // 加载js或css，返回函数包裹的promise实例，用于顺序加载队列
    loadSource(src) {
      return () => {
        return new Promise(function (resolve, reject) {
          const TYPE = src.split('.').pop()
          let s = null;
          let r = false;
          if (TYPE === 'js') {
            s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = src;
            s.async = true;

          } else if (TYPE === 'css') {
            s = document.createElement('link');
            s.rel = 'stylesheet';
            s.type = 'text/css';
            s.href = src;

          }
          s.onerror = function (err) {
            reject(err, s);
          };
          s.onload = s.onreadystatechange = function () {
            // console.log(this.readyState); // uncomment this line to see which ready states are called.
            if (!r && (!this.readyState || this.readyState == 'complete')) {
              r = true;
              console.log(src)
              resolve();
            }
          };
          const t = document.getElementsByTagName('script')[0];
          t.parentElement.insertBefore(s, t);
        });
      }
    },
    // 添加css
    addStyle(css) {
      if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
      } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
      } else {
        const node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        const heads = document.getElementsByTagName("head");

        if (heads.length > 0) {
          heads[0].appendChild(node);
        } else {
          // no head yet, stick it whereever
          document.documentElement.appendChild(node);
        }
      }
    }
  }

  // ====================== 初始化 ======================

  initApp() // 初始化插件
  initSettingPanel() // 初始化设置面板
})();

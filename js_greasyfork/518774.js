// ==UserScript==
// @name        按最近更新顺序排列 apifox 接口列表
// @namespace   Violentmonkey Scripts
// @match       *://app.apifox.com/*
// @require     https://unpkg.com/vue@3/dist/vue.global.prod.js
// @require     https://unpkg.com/dayjs@1.11.11/dayjs.min.js
// @grant       none
// @version     1.0.1
// @license     GPL
// @author      -
// @description 2024/11/25 11:09:18
// @downloadURL https://update.greasyfork.org/scripts/518774/%E6%8C%89%E6%9C%80%E8%BF%91%E6%9B%B4%E6%96%B0%E9%A1%BA%E5%BA%8F%E6%8E%92%E5%88%97%20apifox%20%E6%8E%A5%E5%8F%A3%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/518774/%E6%8C%89%E6%9C%80%E8%BF%91%E6%9B%B4%E6%96%B0%E9%A1%BA%E5%BA%8F%E6%8E%92%E5%88%97%20apifox%20%E6%8E%A5%E5%8F%A3%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==
window.Vue = Vue
const { createApp, ref, reactive, computed, watchEffect } = Vue
const styleStr = `
    .sort-trigger {
        width: 30px;
        height: 30px;
        background-color: var(--app-bg-200);
        border-radius: 50%;
        position: fixed;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        border: 1px solid #e0e0e0;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
    .sort-content {
        position: fixed;
        right: 10px;
        width: 360px;
        overflow: hidden;
        background: var(--app-bg-200);
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: flex;
        flex-direction: column;
    }
    .sort-input {
        padding: 10px 15px;
        display: flex;
        gap: 10px;
    }
    .sort-input input {
        background: var(--app-bg-200);
        width: 100%;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        padding: 5px 10px;
        outline: none;
    }
    .sort-list {
        flex: 1;
        overflow: auto;
    }
    .sort-item {
        padding: 5px 15px;
        cursor: pointer;
    }
    .sort-close {
        padding: 5px 15px;
        cursor: pointer;
        text-align: center;
        border: 1px solid #e0e0e0;
        color: #666;
        border-radius: 5px;
        background: var(--app-bg-400);
        white-space: nowrap;
    }
    .sort-item-split {
        height: 1px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        gap: 10px;
        opacity: 0.5;
    }
    .sort-item-split::before, .sort-item-split::after {
        content: '';
        width: 100%;
        height: 1px;
        background: #e0e0e0;
    }
`
const enums = {
  urls: {
    apiDetails: /api\/v1\/api-details/,
    folders: /api\/v1\/projects\/[^/]*\/api-detail-folders/
  },
  doms: {
    container: document.createElement('div'),
    searchInput: ".ui-input.ui-input-variant-default",
    contentHolder: ".ui-tabs-content-holder"
  }
}
const globalState = reactive({
  sortList: [],
  folders: []
})

// 保存原始的fetch函数
let originalFetch = fetch;

// 自定义的fetch函数
async function customFetch(url, options) {
  // 发送原始的fetch请求，并等待响应
  let response = await originalFetch(url, options);
  setTimeout(() => {
    interceptResponse(response)
  }, 1000)
  return response;
}

// 自定义的拦截响应数据的方法
async function interceptResponse(response) {
  // 这里假设响应数据是JSON格式，先进行解析
  const list = [
    [enums.urls.apiDetails, resolveApiDetails],
    [enums.urls.folders, resolveFolders]
  ]
  list.forEach(([url, action]) => {
    const link = new URL(response.url);
    if (link.pathname.match(url)) {
      action(response);
    }
  })
}

async function resolveApiDetails(response) {
  const { data } = await response.json();
  globalState.sortList = data.map(item => {
    return {
      name: item.name,
      id: item.id,
      path: item.path,
      method: item.method,
      folderId: item.folderId,
      updatedAt: dayjs(item.updatedAt).unix()
    }
  }).sort((a, b) => b.updatedAt - a.updatedAt)
}
async function resolveFolders(response) {
  const { data } = await response.json();
  globalState.folders = data
}

function init() {
  document.body.appendChild(enums.doms.container);
  initStyle()
  createApp({
    name: 'apifox-sort',
    setup() {
      syncContentHolder()
      const state = reactive({
        visible: false,
        search: '',
        contentHolderBounds: {
          left: 0,
          top: 0,
          height: 0
        },
        getFolderName(folderId) {
          return globalState.folders.find(folder => folder.id === folderId)?.name
        },
        getItemClass(item) {
          if (item.method === 'post') {
            return 'pui-g-ui-kit-request-method-icon-index-container text-orange-6 text-left block'
          }
          if (item.method === 'get') {
            return 'pui-g-ui-kit-request-method-icon-index-container text-green-6 text-left block'
          }
          return 'pui-g-ui-kit-request-method-icon-index-container text-orange-6 text-left block'
        },
        renderList: computed(() => {
          if (!state.search) return globalState.sortList
          return globalState.sortList.filter(item => {
            const nameFilter = item.name.includes(state.search)
            const pathFilter = item.path.includes(state.search)
            return nameFilter || pathFilter
          })
        }),
        splitIndex: computed(() => {
          const list = {
            sevenDays: 0,
            oneMonth: 0,
          }
          state.renderList.forEach((item, index) => {
            const isRecentSevenDays = dayjs().diff(dayjs(item.updatedAt * 1000), 'day') <= 7;
            if (isRecentSevenDays) {
              list.sevenDays = index + 1;
            }
            const isRecentOneMonth = dayjs().diff(dayjs(item.updatedAt * 1000), 'month') <= 1;
            if (isRecentOneMonth) {
              list.oneMonth = index + 1;
            }
          });
          return list
        }),
        handleItemClick(item) {
          navigator.clipboard.writeText(item.path)
          const input = document.querySelector(enums.doms.searchInput)
          input.focus()
        },
        getTime(t) {
          return dayjs(t * 1000).format('YYYY-MM-DD HH:mm:ss')
        }
      })
      watchEffect(() => {
        console.log(state.splitIndex)
      })
      const toggleSort = () => {
        state.visible = !state.visible
      }
      async function syncContentHolder() {
        const contentHolder = await domFinder(enums.doms.contentHolder)
        const bounds = contentHolder.getBoundingClientRect()
        state.contentHolderBounds = {
          top: bounds.top + 'px',
          height: bounds.height + 'px'
        }
      }
      return {
        state,
        toggleSort,
        globalState
      }
    },
    template: `
      <div class="sort-container">
        <div class="sort-trigger" v-if="!state.visible" @click="toggleSort">O</div>
        <div class="sort-content" :style="state.contentHolderBounds" v-else>
            <div class="sort-input">
                <input type="text" v-model="state.search" placeholder="搜索接口" />
                <div class="sort-close" @click="toggleSort">关闭</div>
            </div>
            <div class="sort-list">
                <div class="sort-item"
                  :title="state.getTime(item.updatedAt)"
                  v-for="item in state.renderList.slice(0, state.splitIndex.sevenDays)"
                  :key="item.id" @click="state.handleItemClick(item)"
                >
                    <span :class="state.getItemClass(item)">{{ item.method.toUpperCase() }}</span>
                    <span v-if="state.getFolderName(item.folderId)">{{ state.getFolderName(item.folderId) }}-</span>
                    <span>{{ item.name }}</span>
                </div>
                <div class="sort-item-split">七天内</div>
                <div class="sort-item"
                  :title="state.getTime(item.updatedAt)"
                  v-for="item in state.renderList.slice(state.splitIndex.sevenDays, state.splitIndex.oneMonth)"
                  :key="item.id" @click="state.handleItemClick(item)"
                >
                    <span :class="state.getItemClass(item)">{{ item.method.toUpperCase() }}</span>
                    <span v-if="state.getFolderName(item.folderId)">{{ state.getFolderName(item.folderId) }}-</span>
                    <span>{{ item.name }}</span>
                </div>
                <div class="sort-item-split">一个月内</div>
                <div class="sort-item"
                  :title="state.getTime(item.updatedAt)"
                  v-for="item in state.renderList.slice(state.splitIndex.oneMonth)"
                  :key="item.id" @click="state.handleItemClick(item)"
                >
                    <span :class="state.getItemClass(item)">{{ item.method.toUpperCase() }}</span>
                    <span v-if="state.getFolderName(item.folderId)">{{ state.getFolderName(item.folderId) }}-</span>
                    <span>{{ item.name }}</span>
                </div>
            </div>
        </div>
      </div>
      `
  }).mount(enums.doms.container)
}

function initStyle() {
  const style = document.createElement('style')
  style.innerHTML = styleStr
  document.head.appendChild(style)
}

async function domFinder(selector) {
  const res = document.querySelector(selector)
  if (!res) {
    await sleep(100)
    return domFinder(selector)
  }
  return res
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

init()
// 覆盖原生的fetch函数为自定义的函数
fetch = customFetch;
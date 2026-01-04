// ==UserScript==
// @name         blivemedal
// @namespace    http://tampermonkey.net/
// @version      0.10.3
// @description  拯救B站直播换牌子的用户体验
// @author       xfgryujk
// @include      /https?:\/\/live\.bilibili\.com\/?\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @require      https://s4.zstatic.net/ajax/libs/vue/2.6.14/vue.js
// @require      https://s4.zstatic.net/ajax/libs/vuex/3.6.2/vuex.js
// @require      https://s4.zstatic.net/ajax/libs/axios/0.26.0/axios.js
// @require      https://s4.zstatic.net/ajax/libs/element-ui/2.15.7/index.js
// @resource     element-ui-css https://s4.zstatic.net/ajax/libs/element-ui/2.15.7/theme-chalk/index.css
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/418957/blivemedal.user.js
// @updateURL https://update.greasyfork.org/scripts/418957/blivemedal.meta.js
// ==/UserScript==

// grant不能是none，为了和网页的全局变量隔离。直播间网页全局变量有Vue，会导致element-ui出错

(function () {
  async function main() {
    initLib()
    initCss()
    await waitForLoaded()
    initUi()
  }

  function initLib() {
    let css = GM_getResourceText('element-ui-css')
    // 不是通过URL引用的，要修复相对URL
    css = css.replace(/url\(fonts\//g, 'url(https://s4.zstatic.net/ajax/libs/element-ui/2.15.7/theme-chalk/fonts/')
    let styleElement = unsafeWindow.document.createElement('style')
    styleElement.innerText = css
    unsafeWindow.document.head.appendChild(styleElement)
  }

  function initCss() {
    let css = `
      /* 屏蔽原来的牌子按钮 */
      .medal-section {
        display: none !important;
      }

      /* 屏蔽选牌子对话框，防止刷新时闪烁 */
      .dialog-ctnr.medal {
        display: none !important;
      }
    `
    let styleElement = unsafeWindow.document.createElement('style')
    styleElement.innerText = css
    unsafeWindow.document.head.appendChild(styleElement)
  }

  async function waitForLoaded(timeout = 10 * 1000) {
    return new Promise((resolve, reject) => {
      let startTime = new Date()
      function poll() {
        if (isLoaded()) {
          resolve()
          return
        }
        if (new Date() - startTime > timeout) {
          reject(new Error(`[blivemedal] 等待加载超时，page=${unsafeWindow.location.href}`))
          return
        }
        setTimeout(poll, 1000)
      }
      poll()
    })
  }

  function isLoaded() {
    if (document.querySelector('#control-panel-ctnr-box') === null) {
      return false
    }
    return true
  }

  function loadConfig() {
    let config
    try {
      config = JSON.parse(unsafeWindow.localStorage.blivemedalConfig || '{}')
    } catch {
      config = {}
    }

    if (config.autoWearMedal === undefined) {
      config.autoWearMedal = false
    }
    if (config.autoWearDefaultMedal === undefined) {
      config.autoWearDefaultMedal = false
    }
    if (config.defaultMedalId === undefined) {
      config.defaultMedalId = ''
    }
    return config
  }

  function saveConfig(config) {
    unsafeWindow.localStorage.blivemedalConfig = JSON.stringify(config)
  }

  let store = new Vuex.Store({
    state: {
      config: loadConfig(),

      medals: [],
      curMedal: null
    },
    mutations: {
      setMedals(state, medals) {
        state.medals = medals
      },
      setCurMedal(state, curMedal) {
        state.curMedal = curMedal
      },
      setConfigItems(state, config) {
        for (let name in config) {
          state.config[name] = config[name]
        }
        saveConfig(state.config)
      }
    },
    actions: {
      async updateMedals({ commit }) {
        commit('setMedals', getMedalsAsync())
      },
      async updateCurMedal({ commit }) {
        commit('setCurMedal', await getCurMedal())
      }
    }
  })

  function initUi() {
    let panelElement = unsafeWindow.document.querySelector('#control-panel-ctnr-box')
    let myMedalButtonElement = unsafeWindow.document.createElement('div')
    panelElement.appendChild(myMedalButtonElement)

    new Vue({
      el: myMedalButtonElement,
      store: store,
      components: {
        MedalDialog
      },
      template: `
        <div>
          <el-button type="primary" style="font-size: 12px; min-width: 80px; height: 24px; padding: 6px 12px;"
            @click="showMedalDialog"
          >
            {{ curMedal === null ? '勋章' : curMedal.medal_name }}
          </el-button>
          <medal-dialog ref="medalDialog"></medal-dialog>
        </div>
      `,
      computed: {
        ...Vuex.mapState({
          config: state => state.config,
          curMedal: state => state.curMedal
        })
      },
      async created() {
        await this.tryAutoWearMedal()
        this.updateCurMedal()
      },
      methods: {
        ...Vuex.mapActions([
          'updateCurMedal'
        ]),
        async tryAutoWearMedal() {
          if (!this.config.autoWearMedal) {
            return
          }

          try {
            let medalInfo = unsafeWindow.__NEPTUNE_IS_MY_WAIFU__.roomInfoRes.data.anchor_info.medal_info
            if (medalInfo !== null) {
              await wearMedal(medalInfo.medal_id)
              return
            }
          } catch {
          }

          try {
            if (this.config.autoWearDefaultMedal && this.config.defaultMedalId !== '') {
              await sleep(1000)
              await wearMedal(this.config.defaultMedalId)
            }
          } catch {
          }
        },
        showMedalDialog() {
          this.$refs.medalDialog.showDialog()
        }
      }
    })
  }

  let MedalDialog = {
    name: 'MedalDialog',
    template: `
      <el-dialog :visible.sync="dialogVisible" title="我的粉丝勋章" top="60px" width="850px" :modal="false" append-to-body>
        <div style="line-height: 40px">
          <el-checkbox label="进入直播间时自动佩戴勋章" :value="config.autoWearMedal"
            @change="value => setConfigItems({ autoWearMedal: value })"
          ></el-checkbox>
          <el-checkbox v-show="config.autoWearMedal" label="没有对应勋章时佩戴" :value="config.autoWearDefaultMedal"
            @change="value => setConfigItems({ autoWearDefaultMedal: value })"
          ></el-checkbox>
          <el-select v-show="config.autoWearMedal" style="margin-left: 16px; width: 240px"
            filterable :value="config.defaultMedalId" @change="value => setConfigItems({ defaultMedalId: value })"
          >
            <el-option v-for="item in sortedMedals" :key="item.medal.medal_id"
              :label="item.anchor_info.nick_name + ' / ' + item.medal.medal_name" :value="item.medal.medal_id"
            >
              <span>{{ item.anchor_info.nick_name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.medal.medal_name }}</span>
            </el-option>
          </el-select>
        </div>
        <div>
          <el-button icon="el-icon-refresh" @click="refreshMedals">刷新勋章</el-button>
          <el-input type="primary" v-model="query" placeholder="搜索" clearable style="margin-left: 70px; width: 180px"></el-input>
        </div>

        <el-table :data="medalsTableData" stripe height="80vh">
          <el-table-column label="勋章" prop="medal.medal_name" width="100" sortable
            :sort-method="(a, b) => a.medal.medal_name.localeCompare(b.medal.medal_name)"
          >
            <template slot-scope="scope">
              <el-tag :type="scope.row.medal.is_lighted ? '' : 'info'">{{ scope.row.medal.medal_name }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="等级" prop="medal.level" width="80" sortable></el-table-column>
          <el-table-column label="主播昵称" prop="anchor_info.nick_name" width="200" sortable
            :sort-method="(a, b) => a.anchor_info.nick_name.localeCompare(b.anchor_info.nick_name)"
          >
            <template slot-scope="scope">
              <el-link type="primary" :underline="false" target="_blank" :href="'https://live.bilibili.com/' + scope.row.room_info.room_id">
                {{ scope.row.anchor_info.nick_name }}
              </el-link>
              <el-badge v-if="scope.row.room_info.living_status" is-dot></el-badge>
            </template>
          </el-table-column>
          <el-table-column label="亲密度/原力值" prop="medal.intimacy" width="140" sortable>
            <template slot-scope="scope">
              {{ scope.row.medal.intimacy }} / {{ scope.row.medal.next_intimacy }}
            </template>
          </el-table-column>
          <el-table-column label="本日亲密度/原力值" prop="medal.today_feed" width="160" sortable>
            <template slot-scope="scope">
              {{ scope.row.medal.today_feed }} / {{ scope.row.medal.day_limit }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button v-if="curMedal !== null && scope.row.medal.medal_id === curMedal.medal_id"
                type="info" size="mini" @click="takeOffMedal"
              >取消佩戴</el-button>
              <el-button v-else type="primary" size="mini" @click="wearMedal(scope.row)">佩戴</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    `,
    data() {
      return {
        dialogVisible: false,
        query: ''
      }
    },
    computed: {
      ...Vuex.mapState({
        config: state => state.config,
        medals: state => state.medals,
        curMedal: state => state.curMedal
      }),
      medalsTableData() {
        if (this.query === '') {
          return this.sortedMedals
        }

        let query = this.query.toLowerCase()
        let res = []
        for (let medal of this.sortedMedals) {
          if (medal.medal.medal_name.toLowerCase().indexOf(query) !== -1
              || medal.anchor_info.nick_name.toLowerCase().indexOf(query) !== -1
          ) {
            res.push(medal)
          }
        }
        return res
      },
      sortedMedals() {
        let curRoomId
        try {
          curRoomId = unsafeWindow.BilibiliLive.ROOMID
        } catch {
          curRoomId = 0
        }

        let curMedal = []
        let curRoomMedal = []
        let medals = []
        for (let medal of this.medals) {
          if (this.curMedal !== null && medal.medal.medal_id === this.curMedal.medal_id) {
            curMedal.push(medal)
          } else if (medal.room_info.room_id === curRoomId) {
            curRoomMedal.push(medal)
          } else {
            medals.push(medal)
          }
        }

        // 不是当前牌子或当前房间牌子的按 (等级降序, 亲密度降序, 牌子ID升序) 排序
        medals.sort((a, b) => {
          let aKey = [-a.medal.level, -a.medal.intimacy, a.medal.medal_id]
          let bKey = [-b.medal.level, -b.medal.intimacy, b.medal.medal_id]
          for (let i = 0; i < aKey.length; i++) {
            let diff = aKey[i] - bKey[i]
            if (diff !== 0) {
              return diff
            }
          }
          return 0
        })

        return [...curMedal, ...curRoomMedal, ...medals]
      }
    },
    methods: {
      ...Vuex.mapMutations([
        'setConfigItems'
      ]),
      ...Vuex.mapActions({
        doUpdateMedals: 'updateMedals',
        doUpdateCurMedal: 'updateCurMedal'
      }),
      showDialog() {
        // 只自动加载一次
        if (this.medals.length === 0) {
          this.updateMedals()
        }
        this.updateCurMedal()
        this.dialogVisible = true
      },
      refreshMedals() {
        this.updateMedals()
        this.updateCurMedal()
        refreshBilibiliCurMedalCache()
      },
      async updateMedals() {
        try {
          await this.doUpdateMedals()
        } catch (e) {
          this.$message.error(e)
        }
      },
      async updateCurMedal() {
        try {
          await this.doUpdateCurMedal()
        } catch (e) {
          this.$message.error(e)
        }
      },
      async wearMedal(medal) {
        try {
          await wearMedal(medal.medal.medal_id)
        } catch (e) {
          this.$message.error(e)
          return
        }
        this.updateCurMedal()
      },
      async takeOffMedal() {
        try {
          await takeOffMedal()
        } catch (e) {
          this.$message.error(e)
          return
        }
        this.updateCurMedal()
      }
    }
  }

  let apiClient = axios.create({
    baseURL: 'https://api.live.bilibili.com',
    withCredentials: true
  })

  function getMedalsAsync() {
    let res = []
    let addedMedalIds = new Set()

    async function doGetMedalsAsync() {
      // 获取第一页和总页数
      let rsp
      try {
        rsp = await getPage(1)
      } catch (e) {
        console.error('获取勋章列表第 1 页失败：', e)
        return
      }
      pushResFromRsp(rsp)

      // 并发获取剩下的页
      if (rsp.page_info.total_page <= 1) {
        return
      }
      let pageQueue = []
      for (let page = 2; page <= rsp.page_info.total_page; page++) {
        pageQueue.push(page)
      }
      const WORKER_NUM = 8
      let workerPromises = []
      for (let i = 0; i < WORKER_NUM; i++) {
        workerPromises.push(worker(pageQueue))
      }
      await Promise.all(workerPromises)
    }

    async function worker(pageQueue) {
      while (true) {
        let page = pageQueue.shift()
        if (page === undefined) {
          break
        }

        let rsp
        try {
          rsp = await getPage(page)
        } catch (e) {
          console.error(`获取勋章列表第 ${page} 页失败：`, e)
          continue
        }
        pushResFromRsp(rsp)
      }
    }

    function pushResFromRsp(rsp) {
      for (let medals of [rsp.special_list, rsp.list]) {
        for (let medal of medals) {
          if (addedMedalIds.has(medal.medal.medal_id)) {
            continue
          }
          addedMedalIds.add(medal.medal.medal_id)
          res.push(medal)
        }
      }
    }

    async function getPage(page) {
      let rsp = (await apiClient.get('/xlive/app-ucenter/v1/fansMedal/panel', {
        params: {
          page_size: 10, // 目前没有发现这个接口有尺寸限制，为了防止以后被背刺，还是一次请求10个
          page: page
        }
      })).data
      if (rsp.code !== 0) {
        throw new Error(rsp.message)
      }
      return rsp.data
    }

    doGetMedalsAsync()
    return res
  }

  async function getCurMedal() {
    let csrfToken = getCsrfToken()
    let data = new FormData()
    data.append('source', 1)
    data.append('uid', unsafeWindow.BilibiliLive.UID)
    data.append('target_id', unsafeWindow.BilibiliLive.ANCHOR_UID)
    data.append('csrf_token', csrfToken)
    data.append('csrf', csrfToken)
    let rsp = (await apiClient.post('/live_user/v1/UserInfo/get_weared_medal', data)).data
    if (rsp.code !== 0) {
      throw new Error(rsp.message)
    }
    let curMedal = rsp.data
    if (curMedal.medal_id === undefined) {
      // 没佩戴牌子
      curMedal = null
    }
    return curMedal
  }

  async function wearMedal(medalId) {
    let csrfToken = getCsrfToken()
    let data = new FormData()
    data.append('medal_id', medalId)
    data.append('csrf_token', csrfToken)
    data.append('csrf', csrfToken)
    let rsp = (await apiClient.post('/xlive/web-room/v1/fansMedal/wear', data)).data
    if (rsp.code !== 0) {
      throw new Error(rsp.message)
    }
    refreshBilibiliCurMedalCache()
  }

  async function takeOffMedal() {
    let csrfToken = getCsrfToken()
    let data = new FormData()
    data.append('csrf_token', csrfToken)
    data.append('csrf', csrfToken)
    let rsp = (await apiClient.post('/xlive/web-room/v1/fansMedal/take_off', data)).data
    if (rsp.code !== 0) {
      throw new Error(rsp.message)
    }
    refreshBilibiliCurMedalCache()
  }

  function getCsrfToken() {
    let match = unsafeWindow.document.cookie.match(/\bbili_jct=(.+?)(?:;|$)/)
    if (match === null) {
      return ''
    }
    return match[1]
  }

  function refreshBilibiliCurMedalCache() {
    let originalMedalButton = unsafeWindow.document.querySelector('.medal-section .fans-medal-item')
    if (originalMedalButton === null) {
      return
    }
    originalMedalButton.click()
    setTimeout(() => originalMedalButton.click(), 0)
  }

  async function sleep(time) {
    return new Promise(resolve => window.setTimeout(resolve, time))
  }

  main()
})();

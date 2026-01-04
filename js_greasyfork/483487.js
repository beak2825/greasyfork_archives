// ==UserScript==
// @name         bilibili直播间显示更多信息
// @description  bilibili直播间显示开播时间,直播时长,粉丝数,人气,收益,在线人数,封面,其他关注直播,pk等信息
// @version      3.25
// @author       killall
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @license      MIT
// @namespace https://greasyfork.org/users/1060750
// @downloadURL https://update.greasyfork.org/scripts/483487/bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E6%98%BE%E7%A4%BA%E6%9B%B4%E5%A4%9A%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/483487/bilibili%E7%9B%B4%E6%92%AD%E9%97%B4%E6%98%BE%E7%A4%BA%E6%9B%B4%E5%A4%9A%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

; (function () {
let Config = {
  livetime: {
    enable: true,           // 显示直播开始时间,持续时间
  },
  fans: {
    enable: true,           // 显示粉丝,人气,收益
    maxWidth: 450,          // 显示最大宽度(显示有问题才需要考虑改)
    updateInterval: 5000,   // 更新频率(ms)
  },
  rank: {
    //(目前b站官方已经显示在线人数了 2024-05-05)
    //(现在改成显示在聊天框下面 2024-12-13)
    enable: true,           // 显示高能榜(同接)
    updateInterval: 5000,   // 更新频率(ms)
  },
  cover: {
    enable: true,           // 显示直播封面
    location: 'afterbegin', // 封面显示位置(afterbegin,beforeend)
  },
  pk: {
    enable: true,           // 显示pk相关信息
    updateInterval: 5000,   // 更新频率(ms)
  },
  otherLive: {
    enable: true,           // 显示其他关注的直播
    showTime: true,         // 是否在头像下面显示直播时长
    location: 'right',      // 显示位置(left,right)
    opacity: 1.0,           // 透明度
    maxHeight: 550,         // 最大显示高度(px)
    maxCount: 24,           // 最多显示数量
    imgSize: 40,            // 头像大小
    showMode: 1,            // 1始终显示 2鼠标移动到边缘显示 3快捷键切换
    togglekey: '0',         // 切换显示快捷键(仅在showMode=3时有效)
    offset: '90%',          // 显示偏移(仅在showMode=2时有效,数值越大靠边)
    updateInterval: 60000,  // 更新频率(ms)
  },
  debug: {
    enable: false,          // 输出调试信息
  }
}

const $ = jQuery.noConflict(true);
async function main() {
  let initSucceed = await G.init()
  if (!initSucceed) return
  INFO(`G.init done`)
  initSucceed = await Dao.init()
  INFO(`Dao.init done`)
  let tasklist = []
  tasklist.push(Dao.run())
  Config.livetime.enable && tasklist.push(LiveTimeModule.run())
  Config.fans.enable && tasklist.push(FansModule.run())
  Config.rank.enable && tasklist.push(RankModule.run())
  Config.cover.enable && tasklist.push(CoverModule.run())
  Config.otherLive.enable && tasklist.push(otherLiveModule.run())

  await ut.sleep(200) //等数据初始化完成
  await Promise.all(tasklist)
}


let G = {
  roomId_short: 0, // 直播房间号(short,从当前url获取)
  roomId: 0, // 直播房间号
  uid: 0, // 主播uid
  async init() {
    this.roomId_short = api.getRoomID()
    if (!this.roomId_short) return false
    liveInfo = await api.getLiveInfo(this.roomId_short)
    this.uid = liveInfo.data.uid
    this.roomId = liveInfo.data.room_id

    INFO(`roomId(short_id): ${this.roomId_short} `)
    INFO(`roomId: ${this.roomId} `)
    INFO(`uid: ${this.uid}`)
    return true
  },
}

let Dao = {
  liveInfo: null,
  liveStartTimeStamp: null, // 开播时间时间戳
  lastLiveTimeStamp: null, // 上次直播时间戳
  income: 0, // 高能榜收入 初始化从api统计 之后从hook_wrapper统计收入
  // rankCount: 0, // 非零在线人数 从api获取
  guardCount: 0, // 舰长数
  rank1: 0, // hook_wrapper获取
  rank2: 0, // hook_wrapper获取
  aliveList: null, // 其他关注直播
  inpk: false,
  pk: {
    pkInfo: null,
    roomId: null,
    uid: null,
    uname: null,
    liveInfo: null,
    rankCount: 0,
    income: 0,
    guardCount: 0,
  },

  async init() {
    this.liveInfo = await api.getLiveInfo(G.roomId)
    // INFO('liveInfo', this.liveInfo)
    this.liveStartTimeStamp = await api.getLiveTimeStamp(G.roomId)
    if (this.liveStartTimeStamp < 0) this.lastLiveTimeStamp = await api.getLastLive(G.roomId)
    // INFO('lastLiveTimeStamp:', this.lastLiveTimeStamp)
    Config.otherLive.enable && (this.aliveList = await api.getAliveList())
    Config.rank.enable && ut.hook_wrapper()
    this.income = (await api.getGongxian(G.roomId, G.uid)) / 10
  },

  updateData() {
    const update_liveInfo = async () => {
      this.liveInfo = await api.getLiveInfo(G.roomId)
    }
    const update_rankCount = async () => {
      // this.rankCount = await api.getOnlinePeople(G.roomId, G.uid)
      this.guardCount = await api.getGuardCount(G.roomId, G.uid)
    }
    const update_aliveList = async () => {
      this.aliveList = await api.getAliveList()
    }
    const update_pkInfo = async () => {
      const pkInfo = await api.getPkInfo(G.roomId)

      if (!pkInfo.data.pk_id) {
        this.inpk = false
        this.pk.pkInfo = null
        this.pk.roomId = null
        this.pk.uid = null
        this.pk.liveInfo = null
        this.pk.rankCount = 0
        this.pk.income = 0
        this.pk.guardCount = 0
        return
      }
      newpk = !this.inpk
      this.inpk = true
      this.pk.pkInfo =
        pkInfo.data.init_info.room_id == G.roomId ? pkInfo.data.match_info : pkInfo.data.init_info
      this.pk.roomId = this.pk.pkInfo.room_id
      this.pk.uid = this.pk.pkInfo.uid
      this.pk.uname = this.pk.pkInfo.uname
      this.pk.liveInfo = await api.getLiveInfo(this.pk.roomId)
      this.pk.rankCount = await api.getOnlinePeople(this.pk.roomId, this.pk.uid)
      this.pk.income = (await api.getGongxian(this.pk.roomId, this.pk.uid)) / 10
      this.pk.guardCount = await api.getGuardCount(this.pk.roomId, this.pk.uid)
      if (newpk) {
        INFO(`pk开始(${this.pk.roomId}) ${this.pk.uname} : ${this.pk.liveInfo.data.title}`)
      }
    }
    Config.fans.enable && (update_liveInfo(), setInterval(update_liveInfo, Config.fans.updateInterval))
    Config.rank.enable && (update_rankCount(), setInterval(update_rankCount, Config.rank.updateInterval))
    Config.otherLive.enable && (update_aliveList(), setInterval(update_aliveList, Config.otherLive.updateInterval))
    Config.pk.enable && (update_pkInfo(), setInterval(update_pkInfo, Config.pk.updateInterval))
  },

  async run() {
    // 定时更新数据
    this.updateData()
  },
}

// 直播时间,开播时长
let LiveTimeModule = {
  html: `
   <div class="live-skin-normal-a-text livetimeContainer" >
       <div id="liveStartTime">0000-00-00 00:00:00</div>
       <div id="liveDuration">0小时0分钟0秒</div>
   </div> `,
  css: `
   .livetimeContainer {
       display: flex;
       margin-left: 10px;
       user-select: text;
       flex-direction: column;
       opacity: 1;
   }
   `,
  dom: {
    liveStartTime: null, // 开播时间
    liveDuration: null, // 直播持续时间
  },
  initialized: false,
  prefix: ['', ''],
  // perfix: ['开播时间:', '直播时长:'],
  async initUI() {
    ut.addCSS(this.css)
    let container = await ut.waitForElement('#head-info-vm > div > div.upper-row > div.left-ctnr.left-header-area')
    if (container) {
      $(container).append(this.html);
      this.dom.liveStartTime = $('#liveStartTime')
      this.dom.liveDuration = $('#liveDuration')
      this.initialized = true
    }
    this.dom.liveStartTime.text(`${this.prefix[0]}${Dao.liveInfo.data.live_time}`)
    Dao.lastLiveTimeStamp && this.dom.liveDuration.text(`上次直播：${ut.timestamp2Date(Dao.lastLiveTimeStamp)}`)
    this.initialized ? INFO(`LiveTimeModule.initUI done`) : ERR(`LiveTimeModule.initUI failed`)
  },
  updateUI() {
    if (Dao.liveInfo.data.live_status == 0) {
      this.dom.liveStartTime.text(`当前状态：未开播`)
      return
    }
    if (Dao.liveInfo.data.live_status == 2) {
      this.dom.liveStartTime.text(`当前状态：轮播中`)
      // liveStatus = liveInfo.data.live_status (0:未开播 1:直播中 2:轮播中)`);
      return
    }
    let timeText = ut.timeFrom(Dao.liveStartTimeStamp, '{h}小时 {mm}分钟 {ss}秒')
    this.dom.liveDuration.text(`${this.prefix[1]}${timeText}`)
  },
  async run() {
    await this.initUI()
    this.updateUI(), setInterval(() => this.updateUI(), 1000)
  },
}

// 粉丝,人气,收益
let FansModule = {
  html: `
     <div id="fans" class="right-text live-skin-normal-a-text v-middle preserve-space" 
     title="收益的计算方法为先初始化为高能榜的和，之后有礼物、sc、上舰等事件加入统计"
     >
     `,
  css: `
     #fans{
         display: flex;
         opacity: 1;
         margin-bottom: 2px;
         padding-left: 15px;
         justify-content: flex-end;
     }
     .preserve-space{
         white-space: pre;
     }
     .fansContainer{
         display: flex;
         flex-direction: row;
         flex-wrap: wrap-reverse;
         align-content: center;
         justify-content: right;
         align-items: center;
         max-width: ${Config.fans.maxWidth}px;
     }
     `,
  dom: {
    fans: null,
  },
  initialized: false,
  prefix: ['粉丝：', '人气：', '收益：'],
  async initUI() {
    ut.addCSS(this.css)
    let container = await ut.waitForElement('#head-info-vm > div > div.upper-row > div.right-ctnr')
    // document.querySelector("#head-info-vm > div > div.upper-row > div.right-ctnr")
    // document.querySelector("#head-info-vm > div > div > div.upper-row > div.right-ctnr")
    // #head-info-vm > div > div > div.upper-row > div.right-ctnr
    //  document.querySelector("#head-info-vm > div > div > div.upper-row > div.right-ctnr")
    // INFO("container", container);

    if (container) {
      $(container).append(this.html)
      $(container).addClass('fansContainer')
      this.dom.fans = $('#fans')
      this.initialized = true
    }
    this.initialized ? INFO(`FansModule.initUI done`) : ERR(`FansModule.initUI failed`)
  },
  updateUI() {
    let fensi = `${this.prefix[0]}${Dao.liveInfo.data.attention}`
    let renqi = `${this.prefix[1]}${Dao.liveInfo.data.online}`
    let gongxian = `${this.prefix[2]}${Dao.income.toFixed(1)}`
    if (Dao.inpk) {
      fensi += `/ ${Dao.pk.liveInfo.data.attention}`
      renqi += `/ ${Dao.pk.liveInfo.data.online}`
      gongxian += `/ ${Dao.pk.income.toFixed(1)}`
    }
    $('#fans').text(`${fensi}  ${renqi}  ${gongxian}`)
    // INFO("`${fensi}  ${renqi}  ${gongxian}`", `${fensi}  ${renqi}  ${gongxian}`);
  },
  async run() {
    await this.initUI()
    this.updateUI(), setInterval(() => this.updateUI(), 1000)
  },
}

let RankModule = {
  html: `
    <div
     style="width: 50%; position: relative; color: #666666"
     id="rank_gurad_div"
     title="同接/高能(0/0) = 0.00%">
      <div id="rank_num" style="width: 100%; margin-bottom: 5px">同接：0</div>
      <div id="guard_num">舰长：0</div>
    </div>
   `,
  dom: {
    rank_guard_card: null,
    rank: null,
    guard: null,
  },
  initialized: false,
  prefix: ['同接：', '舰长：'],
  dirtyfix: false,
  async initUI() {
    let container = await ut.waitForElement("#control-panel-ctnr-box")
    // container.insertAdjacentHTML('beforeend', this.html)
    $(container).append(this.html)
    if (container) {
      this.dom.rank_guard_card = $('#rank_gurad_div')
      this.dom.rank = this.dom.rank_guard_card.children().first();
      this.dom.guard = this.dom.rank_guard_card.children().last();
      this.initialized = true
    }
    this.initialized ? INFO(`RankModule.initUI done`) : ERR(`RankModule.initUI failed`)
  },
  updateUI() {
    this.dom.rank.text(this.prefix[0] + (!Dao.inpk ? `${Dao.rank1}/${Dao.rank2}` : `${Dao.rank1}/${Dao.pk.rankCount}`))
    this.dom.guard.text(this.prefix[1] + (!Dao.inpk ? `${Dao.guardCount}` : `${Dao.guardCount}/${Dao.pk.guardCount}`))
    this.dom.rank_guard_card.attr('title', `同接/高能(${Dao.rank1}/${Dao.rank2}) = ${(Dao.rank1 * 100 / Dao.rank2).toFixed(2)}%`);
  },
  async run() {
    await this.initUI()
    this.updateUI(), setInterval(() => this.updateUI(), 1000)
  },
}

// 直播封面
let CoverModule = {
  html: `
     <div data-v-03a54292 class="announcement-cntr" >
         <div data-v-03a54292 class="header"> 
           <p data-v-03a54292 style="color:#ff6699">直播封面 
             <span id="coverTitle" data-v-03a54292>2020-9-24 点击刷新</span>
           </p>
         </div>
         <div data-v-03a54292 class="content">
             <img alt="直播封面" id="cover" style="width: 100%; height: auto;">
         </div>
     </div>
     `,
  dom: {
    coverTitle: null,
    cover: null,
  },
  initialized: false,
  async initUI() {
    let CoverContainer = await ut.waitForElement('#sections-vm > div.right-container')
    // document.querySelector("#sections-vm > div.right-container")
    // document.querySelector("#sections-vm > div.right-container > div > div > ul")
    if (CoverContainer) {
      // CoverContainer.insertAdjacentHTML("beforeend", this.html)
      // CoverContainer.insertAdjacentHTML(Config.cover.location, this.html)
      Config.cover.location == "beforeend" ?
        $(CoverContainer).append(this.html) :
        $(CoverContainer).prepend(this.html)
      this.dom.cover = $('#cover')
      this.dom.coverTitle = $('#coverTitle')
      this.dom.cover.on('click', () => this.updateUI());

      this.initialized = true
    }
    this.initialized ? INFO(`CoverModule.initUI done`) : ERR(`CoverModule.initUI failed`)
  },
  updateUI() {
    const timestr = ut.formatDate(new Date(), 'YYYY-MM-DD hh:mm:ss')
    this.dom.coverTitle.text(`${timestr}更新 点击刷新`)
    this.dom.cover.src = Dao.liveInfo.data.user_cover
    this.dom.cover.attr('src', Dao.liveInfo.data.user_cover)
  },
  async run() {
    await this.initUI()
    this.updateUI(), setInterval(() => this.updateUI(), 60 * 1000)
  },
}

// 其他关注直播
let otherLiveModule = {
  html: {
    roomCardContainer: `
         <div id = "roomCardContainer"></div> 
         `,
    roomCard: `
         <div class="roomCard">
             <a href="{room.link}" target="_blank">
                 <img class="roomAvatar"
                 src="{room.face}"
                 alt="{room.title}"
                 title="{room.uname} : {room.title}">
             </a>
             {roomText}
         </div> `,
    pkRoomCard: `
         <div class="roomCard">
             <a href="{room.link}" target="_blank">
                 <img id="pkAvatar" 
                 src="{room.face}"
                 alt="{room.title}"
                 title="{room.uname} : {room.title}">
             </a>
             {roomText}
         </div> `,
  },
  css: `
     #roomCardContainer {
         position: fixed;
         z-index: 9999;
         display: flex;
         flex-direction: column;
         flex-wrap: ${Config.otherLive.location == 'right' ? 'wrap-reverse' : 'wrap'};
         opacity:${Config.otherLive.opacity};
         align-content: center;
         justify-content: flex-start;
         align-items: center;
         max-height: ${Config.otherLive.maxHeight}px;
         ${Config.otherLive.location}: 5px;
         top: calc(50% + 32px);
         transform: translateY(-50%) translateX(0);
     }
     #roomCardContainer.hide-left {
       transform: translateY(-50%) translateX(-${Config.otherLive.offset});
     }
     #roomCardContainer.hide-right {
       transform: translateY(-50%) translateX(${Config.otherLive.offset});
     }
     #roomCardContainer.show {
       transform: translateY(-50%) translateX(0);
     }
     #roomCardContainer .roomCard{
         padding-bottom: 5px;
         padding-left: 5px;
         display: flex;
         justify-content: center;
         align-items: center;
         flex-direction: column;
         align-content: center
     }
     
     #roomCardContainer .roomCard .roomText{
         /*
         border-radius: 20%;
         border: 1px solid #0095ff;
         */
         min-width: -webkit-fill-available;
         text-align: center;
         background-color: rgba(255, 255, 255, 0.5);
     }
     
     #roomCardContainer .roomCard .roomAvatar {
         /* 头像O */
         border: 2px solid #0095ff;
         border-radius: 50%;
         opacity: 1;
         width: ${Config.otherLive.imgSize}px;
         height: ${Config.otherLive.imgSize}px;
     }
     #roomCardContainer .roomCard #pkAvatar {
         /* 头像O */
         border: 2px solid #ff0000;
         border-radius: 50%;
         opacity: 1;
         width: ${Config.otherLive.imgSize}px;
         height: ${Config.otherLive.imgSize}px;
         }
     `,
  dom: {
    aliveList: null,
  },
  initialized: false,
  async initUI() {
    ut.addCSS(this.css)
    $('body').append(this.html.roomCardContainer);
    this.initialized = true
    this.initialized ? INFO(`otherLiveModule.initUI done`) : ERR(`otherLiveModule.initUI failed`)


    const right = Config.otherLive.location == 'right';
    const translateX = right ? `${Config.otherLive.offset}` : `-${Config.otherLive.offset}`;

    // 添加鼠标监听
    const $room = $('#roomCardContainer');
    if (Config.otherLive.showMode == 2) {
      $('#roomCardContainer').addClass(right ? 'hide-right' : 'hide-left');
      $(window).on('mousemove', function (e) {
        const nearEdge = (!right && e.clientX <= 10) || (right && e.clientX >= window.innerWidth - 10);
        $room.toggleClass('show', nearEdge);
      });
    }
    if (Config.otherLive.showMode == 3 && Config.otherLive.togglekey) {
      ut.mapKey(Config.otherLive.togglekey, () => $('#roomCardContainer').toggle())
    }
  },
  updateUI() {
    this.dom.aliveList = $('#roomCardContainer')
    this.dom.aliveList.html('');
    let cnt = 0

    if (Dao.inpk) {
      let pk_roomLiveTime = ut.timeFrom(Dao.pk.liveInfo.data.live_time, '{h}h{mm}m')
      let pk_roomText = Config.otherLive.showTime
        ? `<div class="roomText"> ${pk_roomLiveTime} </div> `
        : ''
      const pkRoomCard = this.html.pkRoomCard
        .replace('{room.link}', `https://live.bilibili.com/${Dao.pk.roomId}`)
        .replace(/{room.title}/g, Dao.pk.liveInfo.data.title)
        .replace('{room.face}', Dao.pk.pkInfo.face)
        .replace('{room.uname}', Dao.pk.uname)
        .replace('{roomText}', pk_roomText)
      this.dom.aliveList.append(pkRoomCard)
      cnt++
    }

    for (const [index, room] of Dao.aliveList.entries()) {
      if (room.room_id == G.roomId) continue
      let roomLiveTime = ut.formatSeconds(room.live_time, '{h}h{mm}m')
      let roomText = Config.otherLive.showTime
        ? `<div class="roomText"> ${roomLiveTime} </div> `
        : ''

      const roomCard = this.html.roomCard
        .replace('{room.link}', room.link)
        .replace('{room.face}', room.face)
        .replace(/{room.title}/g, room.title)
        .replace('{room.uname}', room.uname)
        .replace('{roomText}', roomText)

      this.dom.aliveList.append(roomCard)
      if (++cnt >= Config.otherLive.maxCount) break
    }
  },
  async run() {
    await this.initUI()
    this.updateUI(), setInterval(() => this.updateUI(), 5000)
  },
}


const api = {
  // ============================== api ==============================
  // liveInfo = get https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}
  // 开播时间 = liveInfo.data.live_time
  // 主播uid = liveInfo.data.uid
  // 真roomId = liveInfo.data.room_id
  // liveStatus = liveInfo.data.live_status (0:未开播 1:直播中 2:轮播中)`);
  // 粉丝数 = liveInfo.data.attention
  // 人气 = liveInfo.data.online
  // 分区 = liveInfo.data.area_name
  // 父分区 = liveInfo.data.parent_area_name

  // pk信息 `https://api.live.bilibili.com/xlive/general-interface/v1/battle/getInfoById?room_id=${roomId}&pk_version=6`;

  // getOnlineGoldRank = https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=${uid}&roomId=${roomId}&page=1&pageSize=1
  // 在线人数 = getOnlineGoldRank.data.onlineNum

  // room_init = `https://api.live.bilibili.com/room/v1/Room/room_init?id=${roomId}`;
  // 开播时间戳 = room_init.data.live_time

  // alive = `https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/GetWebList?page=1`;
  // 其他关注直播间 = alive.data.rooms

  // 上次直播时间 (获取关注up的情况)
  // https://api.live.bilibili.com/xlive/web-ucenter/user/following?ignoreRecord=1&hit_ab=true&page=1

  // =================================================================

  // 获取直播间id
  getRoomID() {
    try {
      const urlpathname = window.location.pathname
      // const W = typeof unsafeWindow === 'undefined' ? window : unsafeWindow
      // const urlpathname = W.location.pathname
      INFO(`urlpathname: ${urlpathname} `)
      return urlpathname.match(/\d{3,}/)[0]
    } catch (error) {
      ERR(`getRoomID error`)
      return null
    }
  },
  // 获取直播开始时间时间戳
  async getLiveTimeStamp(roomId) {
    // https://api.live.bilibili.com/room/v1/Room/room_init?id=60989
    const url = `https://api.live.bilibili.com/room/v1/Room/room_init?id=${roomId}`
    return (await ut.fetchURL(url)).data.live_time
  },
  // 获取直播信息数据
  async getLiveInfo(roomId) {
    const url = `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${roomId}`
    return await ut.fetchURL(url)
  },
  // 获取在线人数
  async getOnlinePeople(roomId, uid) {
    // 计算规则 https://ngabbs.com/read.php?tid=29562585
    // https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=2978046&roomId=60989&page=1&pageSize=1
    const url = `https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=${uid}&roomId=${roomId}&page=1&pageSize=1`
    return (await ut.fetchURL(url)).data.onlineNum
  },
  // 获取高能榜贡献值
  async getGongxian(roomId, uid) {
    let res = 0
    let page = 1
    while (true) {
      // 大概每页需要100ms
      const url = `https://api.live.bilibili.com/xlive/general-interface/v1/rank/getOnlineGoldRank?ruid=${uid}&roomId=${roomId}&page=${page}&pageSize=50`
      const onlineRankItem = (await ut.fetchURL(url)).data.OnlineRankItem
      page++
      const len = onlineRankItem.length
      // len > 0 && (res += onlineRankItem.reduce((total, item) => total + item.score, 0))
      // 小于20的不算在内
      if (len > 0) {
        res += onlineRankItem.reduce((total, item) => total + (item.score <= 20 ? 0 : item.score), 0)
        if (onlineRankItem[0].score < 20)
          break
      }
      if (len < 50) break
    }
    return res
  },
  // 获取舰长数量
  async getGuardCount(roomId, uid) {
    const url = `https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topList?roomid=${roomId}&page=1&ruid=${uid}&page_size=0`
    return (await ut.fetchURL(url)).data.info.num
  },
  // 获取关注直播列表
  async getAliveList() {
    let roomlist = []
    const url = `https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/GetWebList?page=1`
    let res = (await ut.fetchURL(url, true)).data
    roomlist = [].concat(res.rooms)
    if (res.count > 10) {
      for (let page = 2; page <= Math.ceil(res.count / 10); page++) {
        const nextPageUrl = `https://api.live.bilibili.com/xlive/web-ucenter/v1/xfetter/GetWebList?page=${page}`
        const nextPageRes = (await ut.fetchURL(nextPageUrl, true)).data
        roomlist = roomlist.concat(nextPageRes.rooms)
      }
    }
    roomlist.sort((a, b) => a.live_time - b.live_time)
    return roomlist
  },
  // 获取上次直播时间
  async getLastLive(roomid) {
    let uplist = []
    const url = `https://api.live.bilibili.com/xlive/web-ucenter/user/following?ignoreRecord=1&hit_ab=true`
    let res = (await ut.fetchURL(url + '&page=1&page_size=10', true)).data
    uplist = [].concat(res.list)
    let target = uplist.find(item => item.roomid === roomid);
    if (target) return target.record_live_time

    if (res.count > 10) {
      for (let page = 2; page <= Math.ceil(res.count / 10); page++) {
        const nextPageUrl = `${url}&page=${page}&page_size=10`
        const nextPageRes = (await ut.fetchURL(nextPageUrl, true)).data
        target = nextPageRes.list.find(item => item.roomid === roomid);
        if (target) return target.record_live_time
        uplist = uplist.concat(nextPageRes.list)
      }
    }
    INFO('uplist:', uplist)
    return null;
  },
  // 获取pk信息
  async getPkInfo(roomId) {
    const url = `https://api.live.bilibili.com/xlive/general-interface/v1/battle/getInfoById?room_id=${roomId}&pk_version=6`
    return await ut.fetchURL(url)
  },
}

const ut = {
  async fetchURL(url, useCookie = false) {
    try {
      const response = await fetch(url, {
        credentials: useCookie ? 'include' : 'same-origin',
      })
      if (!response.ok) throw new Error(`请求${url}错误 response.status : ${response.status}`)
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error(`请求${url}错误 error.message: ${error.message}`)
    }
  },

  // 添加CSS
  addCSS(css) {
    let myStyle = document.createElement('style')
    myStyle.textContent = css
    let doc = document.head || document.documentElement
    doc.appendChild(myStyle)
  },

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },

  timeFrom(startTime, format, Ltrip0 = true) {
    if (typeof startTime === 'number') {
      startTime = startTime > 9999999999
        ? startTime
        : startTime * 1000
    }
    const elapsedSeconds = Math.floor((new Date() - new Date(startTime)) / 1000)
    return ut.formatSeconds(elapsedSeconds, format, Ltrip0)
  },

  timestamp2Date(timestamp) {
    // 把秒级时间戳转成毫秒
    const date = new Date(timestamp * 1000);
    const Y = date.getFullYear();
    const M = String(date.getMonth() + 1).padStart(2, '0');
    const D = String(date.getDate()).padStart(2, '0');
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${Y}-${M}-${D} ${h}:${m}:${s}`;
  },

  formatSeconds(seconds, format, Ltrip0 = true) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    Ltrip0 && hours == 0 && (format = format.replace(/.*\{mm\}/, '{mm}').replace(/.*\{m\}/, '{m}'))
    let formattedTime = format
      .replace('{hh}', hours.toString().padStart(2, '0'))
      .replace('{mm}', minutes.toString().padStart(2, '0'))
      .replace('{ss}', remainingSeconds.toString().padStart(2, '0'))
      .replace('{h}', hours)
      .replace('{m}', minutes)
      .replace('{s}', remainingSeconds)
    return formattedTime
  },

  getFirstNumber(text) {
    // 使用正则表达式匹配第一个数字
    const match = text.match(/\d+/)
    // 如果找到匹配的数字，则返回第一个匹配结果
    if (match) {
      return parseInt(match[0], 10) // 将匹配的字符串转换为整数并返回
    }
    // 如果未找到数字，则返回 null 或其他指定的默认值
    return 0
  },

  formatDate(date, format) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1 // 月份是从 0 开始的
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const formattedDate = format
      .replace('YYYY', year)
      .replace('YY', year % 100)
      .replace('MM', (month < 10 ? '0' : '') + month)
      .replace('DD', (day < 10 ? '0' : '') + day)
      .replace('hh', (hours < 10 ? '0' : '') + hours)
      .replace('mm', (minutes < 10 ? '0' : '') + minutes)
      .replace('ss', (seconds < 10 ? '0' : '') + seconds)

    return formattedDate
  },
  waitForElement(selector, interval = 200, timeout = 300000) {
    // INFO("waitForElement selector", selector);
    return new Promise((resolve) => {
      const checkExist = setInterval(() => {
        // const element = document.querySelector(selector)
        // if (element) {
        const element = $(selector)
        if (element.length) {
          // INFO("find element", element);
          clearInterval(checkExist)
          clearTimeout(timeoutTimer)
          resolve(element)
        }
      }, interval)

      const timeoutTimer = setTimeout(() => {
        clearInterval(checkExist)
        resolve(null)
      }, timeout)
    })
  },
  toggleShow(dom, display) {
    dom.style.display = dom.style.display == 'none' ? display : 'none'
  },
  changeOpacity(dom, dif) {
    let currentOpacity = dom.style.opacity === '' ? 1 : parseFloat(dom.style.opacity)
    dom.style.opacity = Math.max(0, Math.min(parseFloat(currentOpacity) + dif, 1))
    INFO('dom.style.opacity', dom.style.opacity)
  },

  hook_wrapper() {

    const cb_map = {
      ONLINE_RANK_COUNT: function (obj) {
        Dao.rank1 = obj.data.count;
        Dao.rank2 = obj.data.online_count;
      },
      GUARD_BUY: function (obj) {
        // INFO("GUARD_BUY\n", obj);
        const d = obj.data
        // INFO(`GUARD_BUY: ${d.username} 开通 ${d.gift_name} (￥${d.price / 1000})`)
        Dao.income += d.price / 1000 / 2
        // INFO("Dao.income += ", d.price / 1000);

      },
      SUPER_CHAT_MESSAGE: function (obj) {
        const d = obj.data
        // INFO(`SUPER_CHAT_MESSAGE: (￥${d.price}) ${d.uinfo.base.name}: ${d.message}`)
        Dao.income += d.price / 2
        // INFO("Dao.income += ", d.price);
      },
      COMBO_SEND: function (obj) {
        const d = obj.data
        // INFO(`COMBO_SEND: ${d.uname} ${d.action} ${d.combo_num}个 $(gift_name} (共￥${d.combo_total_coin / 1000})`)
        // Dao.income += d.combo_total_coin / 1000 / 2
        // return obj.data.coin_type === 'gold' ? (obj.data.total_coin / 1000).toFixed(2) : '0.00';
        // INFO("Dao.income += ", d.combo_total_coin / 1000);
      },
      SEND_GIFT: function (obj) {
        // INFO("SEND_GIFT:", obj);
        const d = obj.data
        const price = d.coin_type == 'gold' ? d.total_coin / 1000 : 0
        // INFO(`SEND_GIFT: ${d.uname} ${d.action} ${d.num}个 ${d.giftName} (共￥${d.total_coin / 1000})`)
        Dao.income += price / 2
        // INFO("Dao.income += ", price);
      },
    }
    const cmdTracker = new Map();
    Array.prototype.push = new Proxy(Array.prototype.push, {
      apply(target, thisArg, argArray) {
        try {
          if (argArray && argArray.length > 0) {
            for (let i = 0; i < argArray.length; i++) {
              if (argArray[i] && argArray[i].cmd) {
                !cmdTracker.has(argArray[i].cmd) && cmdTracker.set(argArray[i].cmd, argArray[i])
                if (cb_map[argArray[i].cmd]) {
                  cb_map[argArray[i].cmd](argArray[i])
                }
              } else {
                break
              }
            }
          }
        } catch (e) {
          console.error(e)
        }
        return Reflect.apply(target, thisArg, argArray)
      },
    })
    // this.mapKey('0', () => { INFO(cmdTracker); })
  },

  mapKey(key, func) {
    document.addEventListener('keydown', function (event) {
      if (event.key === key) {
        func()
      }
    })
  },
}
// await Utils.sleep(3000)
// if (W.location.pathname != '/p/html/live-web-mng/index.html') main()

function DEBUG(...args) {
  if (Config.debug.enable) {
    console.log("INFO:", ...args);
  }
}
function ERR(...args) {
  console.log("%cERR:", "color: red;", ...args);
}
function INFO(...args) {
  console.log("%cINFO:", "color: blue;", ...args);
}


$(document).ready(function () {
  INFO("ready document.URL:", document.URL);
  if (/^https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/.test(document.URL)) {
    // if (/^\/\d+$/.test(window.location.pathname))
    main()
  }
});
})()
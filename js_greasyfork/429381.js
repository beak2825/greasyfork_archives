// ==UserScript==
// @name         收收味
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  B站直播弹幕清理，旨在提高弹幕的信息密度
// @author       xfgryujk
// @include      /https?:\/\/live\.bilibili\.com\/?\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/gh/google/brotli@5692e422da6af1e991f9182345d58df87866bc5e/js/decode.js
// @require      https://greasyfork.org/scripts/417560-bliveproxy/code/bliveproxy.js?version=984333
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429381/%E6%94%B6%E6%94%B6%E5%91%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/429381/%E6%94%B6%E6%94%B6%E5%91%B3.meta.js
// ==/UserScript==

(function() {
  let filterers = []

  function main() {
    filterers = [
      trim,
      shink1CharLeft,
      shink1CharRight,
      shink2CharLeft,
      shink3CharLeft,

      hideRecentRepeat,
      hideRepeater,
    ]
    bliveproxy.addCommandHandler('DANMU_MSG', danmakuHandler)
  }

  function danmakuHandler(command) {
    let ctx = new DanmakuFilterContext(command)
    for (let filterer of filterers) {
      filterer(ctx)
      if (!ctx.showDanmaku && !ctx.showComment) {
        break
      }
    }

    let info = command.info

    if (info[1] != ctx.msg) {
      // console.log(`${info[1]} -> ${ctx.msg}`)
      info[1] = ctx.msg
    }

    let hideFlag = 0
    if (!ctx.showComment) {
      hideFlag |= 1
    }
    if (!ctx.showDanmaku) {
      hideFlag |= 2
    }
    if (hideFlag != 0) {
      // console.log(`hide: ${ctx.msg}`)
      let params = command.cmd.split(':')
      while (params.length < 5) {
        params.push('0')
      }
      params[4] = hideFlag.toString()
      command.cmd = params.join(':')
    }
  }

  class DanmakuFilterContext {
    constructor(command) {
      let info = command.info
      this.msg = info[1]
      this.uid = info[2][0]
      this.username = info[2][1]

      this._showDanmaku = true
      this._showComment = true
    }

    get showDanmaku() {
      return this._showDanmaku
    }

    hideDanmaku() {
      this._showDanmaku = false
    }

    get showComment() {
      return this._showComment
    }

    hideComment() {
      this._showComment = false
    }
  }

  function trim(ctx) {
    ctx.msg = ctx.msg.trim()
  }

  function shink1CharLeft(ctx) {
    // 以至少4个相同字符开头，尾部可跟最多4个任意字符，例：888888888
    const REG = /^(.)\1{3,}.{0,4}?$/
    let match = REG.exec(ctx.msg)
    if (match !== null) {
      // 保留3个字符
      ctx.msg = [match[1], match[1], match[1]].join('')
    }
  }

  function shink1CharRight(ctx) {
    // 以最多4个任意字符开头，尾部至少4个相同字符，例：ohhhhhhhh
    const REG = /^(.{0,4}?)(.)\2{3,}$/
    let match = REG.exec(ctx.msg)
    if (match !== null) {
      // 保留头部+尾部3个字符
      ctx.msg = [match[1], match[2], match[2], match[2]].join('')
    }
  }

  function shink2CharLeft(ctx) {
    // 以2个字符至少重复3次开头，例：欧啦欧啦欧啦欧啦
    const REG = /^(..)\1\1/
    let match = REG.exec(ctx.msg)
    if (match !== null) {
      // 保留2次重复
      ctx.msg = match[1] + match[1]
    }
  }

  function shink3CharLeft(ctx) {
    // 以至少3个字符至少重复2次开头，例：awslawslawslawsl
    const REG = /^(.{3,}?)\1/
    let match = REG.exec(ctx.msg)
    if (match !== null) {
      // 保留1次重复
      ctx.msg = match[1]
    }
  }

  // msg -> {time: 上次显示弹幕时间}
  let recentRepeatInfoMap = new Map()
  const MIN_REPEAT_INTERVAL = 10 * 1000
  // 隐藏最近重复的弹幕
  function hideRecentRepeat(ctx) {
    let curTime = new Date()
    let key = ctx.msg.toLowerCase()
    let repeatInfo = recentRepeatInfoMap.get(key)

    if (repeatInfo === undefined) {
      repeatInfo = {time: curTime}
      recentRepeatInfoMap.set(key, repeatInfo)

      // 清理
      if (recentRepeatInfoMap.size >= 1024) {
        let keysToDel = []
        for (let [key, repeatInfo] of recentRepeatInfoMap.entries()) {
          if (curTime - repeatInfo >= MIN_REPEAT_INTERVAL) {
            keysToDel.push(key)
          }
        }
        for (let key of keysToDel) {
          recentRepeatInfoMap.delete(key)
        }
      }
      return
    }
    if (curTime - repeatInfo.time >= MIN_REPEAT_INTERVAL) {
      repeatInfo.time = curTime
      return
    }
    ctx.hideDanmaku()
  }

  // uid -> {msg: 重复弹幕内容, startTime: 重复开始时间, repeatNum: 重复次数}
  let uidRepeatInfoMap = new Map()
  let uidBlacklistForRepeat = new Set()
  const REPEAT_PERIOD_PER_USER = 30 * 1000
  const REPEAT_NUM_FOR_ADD_BLACK = 3
  // 屏蔽复读机用户
  function hideRepeater(ctx) {
    if (uidBlacklistForRepeat.has(ctx.uid)) {
      ctx.hideDanmaku()
      ctx.hideComment()
      return
    }

    let curTime = new Date()
    let repeatInfo = uidRepeatInfoMap.get(ctx.uid)

    if (repeatInfo !== undefined) {
      // 清理
      if (curTime - repeatInfo.startTime > REPEAT_PERIOD_PER_USER || repeatInfo.msg != ctx.msg) {
        repeatInfo = undefined
      }
    }

    if (repeatInfo === undefined) {
      // 第一次重复计数
      repeatInfo = {
        msg: ctx.msg,
        startTime: curTime,
        repeatNum: 1
      }
      uidRepeatInfoMap.set(ctx.uid, repeatInfo)
      return
    }

    if (++repeatInfo.repeatNum >= REPEAT_NUM_FOR_ADD_BLACK) {
      console.log(`拉黑【${ctx.username}】，uid=${ctx.uid}，复读内容：${repeatInfo.msg}`)
      ctx.msg = '【此用户已屏蔽】' + ctx.msg
      uidBlacklistForRepeat.add(ctx.uid)
      ctx.hideDanmaku()
    }
  }

  main()
})();

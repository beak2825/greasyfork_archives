// ==UserScript==
// @name         CSDN刷浏览量
// @namespace    https://xyw.baklib.com/
// @version      0.0.7
// @description  先点击获取,先点击获取,先点击获取!!,开自己的CSDN主页会自动刷(blog开头的地址)
// @author       Silencer
// @match        *://blog.csdn.net/*
// @icon         https://blog.csdn.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/406068/CSDN%E5%88%B7%E6%B5%8F%E8%A7%88%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/406068/CSDN%E5%88%B7%E6%B5%8F%E8%A7%88%E9%87%8F.meta.js
// ==/UserScript==

(function () {
  const config = {
    // 每个请求的间隔时间,过快会失败,单位:秒(不建议设置0.2以下,实测不行)
    time: 0.2,
    // 总请求的时间间隔,过快不计入,单位:秒(不知道怎么算的,就60秒一次吧)
    interval: 60,
    // 切割用的字符串
    str: '|'
  }

  function getUrl() {
    !localStorage.urlList && (localStorage.urlList = '')
    document.querySelectorAll('.csdn-tracking-statistics p a')
      .forEach(i => {
        i.href && (localStorage.urlList += i.href + config.str)
      })
    localStorage.urlList =
      [...new Set(localStorage.urlList
        .split(config.str)
      )]
        // .filter(i => i)
        .join(config.str)
        .trim()
    console.log('获取成功啦,要啥提示啊扑街')
    // + config.str
  }
  function request() {
    localStorage.urlList
      .split(config.str)
      // .sort(() => Math.random() - 0.5)
      .forEach((item, index) => {
        setTimeout(
          () => {
            fetch(item)
          },
          index * config.time * 1000
        )
      })
  }
  function init() {
    $(".opt-box").prepend(`<a class="btn btn-sm" id="getUrl" href="javascript:;">获取该页链接</a >`)
    // $(".opt-box").prepend(`<a class="btn btn-sm" id="clearUrl" href="javascript:;">清除链接</a >`)
    $('#getUrl').click(getUrl)
    // $('#clearUrl').click(() => { localStorage.urlList = '' })

    !localStorage.urlList && getUrl()
  }

  (function main() {
    init()
    request()
    setInterval(
      request,
      config.interval * 1000
    )
  })()
})()

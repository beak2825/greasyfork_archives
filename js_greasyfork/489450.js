// ==UserScript==
// @name         autoGiveLike
// @namespace    http://tampermonkey.net/
// @version      2024-10-28.1
// @description  始皇别封我号,用来给linux.do帖子自动点赞的
// @author       Kubbo
// @match        https://linux.do/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489450/autoGiveLike.user.js
// @updateURL https://update.greasyfork.org/scripts/489450/autoGiveLike.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log("始皇你好~")

  //@XODI @Hua 借用你们的防邀设置,做清清白白的人~
  const redirectIfNeeded = () => {
    if (window.location.href.includes("https://linux.do/invites/")) {
      window.location.replace("https://linux.do");
    }

    document.querySelectorAll("div .regular .contents").forEach((el) => {
      el.querySelectorAll("a").forEach((a) => {
        if (a.href.includes("https://linux.do/invites/")) {
          a.href = "https://linux.do";
        }
      });
    });
  };

  document.addEventListener('DOMContentLoaded', redirectIfNeeded);

  const observer = new MutationObserver(redirectIfNeeded);
  observer.observe(document.body, {childList: true, subtree: true});

  const getTopics = id => fetch(`/t/${id}.json?track_visit=true&forceLoad=true`).then(res => res.json()).then(res => {
    const topics = res?.post_stream?.stream || []
    console.log("本次查询一共有%s个帖子", topics.length)
    return topics
  })
  const initBtn = () => {
    setInterval(() => {
      const autoBtn = document.querySelector("#autoGiveLike")
      if (/\/t\/topic/.test(location.pathname)) {
        if (!autoBtn) {
          const btn = document.createElement("button")
          let status = 0 // 脚本执行状态: 0:未开始 1:正在执行中
          btn.id = "autoGiveLike"
          btn.innerText = "开始自动点赞"
          btn.style.position = "fixed"
          btn.style.top = "10px"
          btn.style.right = "20px"
          btn.style.padding = "8px 16px"
          btn.style.background = "#409EFF"
          btn.style.color = "#fff"
          btn.style.border = "none"
          btn.style.borderRadius = "16px"
          btn.style.zIndex = "202403101044"
          btn.addEventListener("click", () => {
            if (status === 0) {
              status = 1
              btn.innerText = "停止自动点赞"
              btn.style.background = "#F56C6C"
              const topicId = location.pathname.match(/\/topic\/([^/]+)/)?.[1]
              topicId && getTopics(topicId).then(ids => {
                let i = 0
                const token = document.querySelector('meta[name="csrf-token"]').content
                const loop = () => {
                  if (status === 1) {
                    const id = ids[i]
                    fetch(`/discourse-reactions/posts/${id}/custom-reactions/heart/toggle.json`, {
                      method: "PUT",
                      headers: {"X-Csrf-Token": token}
                    }).finally(() => {
                      i++
                      if (i <= 50 && i <= ids.length) { //设置50的阈值,防止始皇封我号
                        setTimeout(loop, 50);
                      }
                    })
                  }
                }
                loop()
              })
            } else if (status === 1) {
              status = 0
              btn.innerText = "开始自动点赞"
              btn.style.background = "#409EFF"
            }
          })
          document.body.appendChild(btn)
        }
      } else if (autoBtn) {
        autoBtn.remove()
      }
    }, 500)
  }
  initBtn()

  function showHotKeys() {
    const hotKeys = [
      {name: '描述', keys: '快捷键'},
      {name: '最新', keys: 'G+L'},
      {name: '新', keys: 'G+N'},
      {name: '未读', keys: 'G+U'},
      {name: '类别', keys: 'G+C'},
      {name: '热门', keys: 'G+T'},
      {name: '书签', keys: 'G+B'},
      {name: '个人资料', keys: 'G+P'},
      {name: '消息', keys: 'G+M'},
      {name: '草稿', keys: 'G+D'},
    ]
    const table = document.createElement('table')
    table.style.position = 'fixed'
    table.style.top = '50%'
    table.style.transform = 'translateY(-50%)'
    table.style.right = '10px'
    table.style.zIndex = '202403101044'
    table.style.fontSize = '14px'
    table.style.color = '#fff'
    table.style.borderRadius = '4px'
    hotKeys.forEach(key => {
      const tr = document.createElement('tr')
      const td1 = document.createElement('td')
      const td2 = document.createElement('td')
      td1.style.padding = '4px 10px'
      td1.innerText = key.name
      td2.innerText = key.keys
      tr.appendChild(td1)
      tr.appendChild(td2)
      table.appendChild(tr)
    })
    document.body.appendChild(table)
  }

  showHotKeys()
})();


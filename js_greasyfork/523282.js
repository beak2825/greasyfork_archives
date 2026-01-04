// ==UserScript==
// @name         M26开发者浏览增强
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  https://km.sankuai.com/collabpage/2598022833
// @author       wangzexi02
// @match        https://*.sankuai.com/*
// @match        https://*.meituan.com/*
// @match        http://localhost/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523282/M26%E5%BC%80%E5%8F%91%E8%80%85%E6%B5%8F%E8%A7%88%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/523282/M26%E5%BC%80%E5%8F%91%E8%80%85%E6%B5%8F%E8%A7%88%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** 数据上报 */
  async function report(name, value) {
    try {
      await fetch("https://umami.zexi.love/api/send", {
        method: "POST",
        body: JSON.stringify({
          type: "event",
          payload: {
            website: "469d99c1-365a-4bae-bf96-75312a443bc1",
            name,
            data: {
              value
            }
          }
        })
      });
    } catch (error) { }
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function waitSelector(selector) {
    let start = Date.now()
    while (Date.now() - start < 10000) {
      const el = document.querySelector(selector)
      if (el) return el
      await delay(100)
    }

    throw new Error(`waitSelector ${selector} timeout`)
  }

  async function toast(text) {
    const toast = document.createElement('div')
    toast.innerText = text
    toast.style.zIndex = 10000
    toast.style.position = 'fixed'
    toast.style.top = '50%'
    toast.style.left = '50%'
    toast.style.transform = 'translate(-50%, -50%)'
    toast.style.padding = '8px 16px'
    toast.style.color = 'white'
    toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    toast.style.borderRadius = '4px'
    document.body.appendChild(toast)
    await delay(1000)
    document.body.removeChild(toast)
  }

  /** Code 添加快捷评论按钮 */
  async function codeCommentShortcuts() {
    if (!/dev.sankuai.com\/code/.test(window.location.href)) return;

    async function comment(text) {
      const url = new URL(window.location.href);
      const parts = url.pathname.split('/')
      const group = parts[3]
      const repoId = parts[4]
      const pr = parts[6]

      const res = await fetch(`https://dev.sankuai.com/rest/api/5.0/projects/${group}/repos/${repoId}/pull-requests/${pr}/comments`, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/json",
          "devtools-host": "dev.sankuai.com",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "stash-area": "mcode",
          "web-type": "devtools",
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": `https://dev.sankuai.com/code/repo-detail/${group}/${repoId}/pr/${pr}/overview`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": JSON.stringify({ text, isTrusted: true }),
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
      });
      return res.json();
    }

    async function addCommentShortcuts(text) {
      const prButton = document.createElement('button')
      prButton.id = `comment-${text}`
      prButton.classList.add('mtd-btn', 'mtd-btn-ghost')
      prButton.style.marginRight = '10px'
      prButton.innerText = `快评 ${text}`

      prButton.addEventListener('click', async () => {
        report('点击代码快评', 1)

        try {
          await comment(text)
          toast(`✅ 快评成功: ${text}`)
        } catch (error) {
          toast(`❌ 快评失败: ${error.message}`)
        }
      })

      const prButtonContainer = await waitSelector('.pr-button-container')
      if (document.querySelector(`#comment-${text}`)) return
      prButtonContainer.insertBefore(prButton, prButtonContainer.firstChild)
    }

    addCommentShortcuts('Ship')
    addCommentShortcuts('Reviewed')
  }

  /** 移除水印 */
  async function removeWatermark() {
    if (/km.sankuai.com/.test(window.location.href)) {
      const watermark = await waitSelector('#brant-watermark-visible')
      watermark?.remove()

      const watermarkPrint = await waitSelector('#brant-watermark-print')
      watermarkPrint?.remove()

      const container = await waitSelector('.brant-watermark-dark')
      container.classList.remove('brant-watermark-dark')
      container.style.backgroundImage = 'none'

      const container10 = await waitSelector('div[owl-ignore]')
      container10.remove()
    }

    if (/mlive.sankuai.com/.test(window.location.href)) {
      const watermark1 = await waitSelector('body > div:nth-child(1)')
      const watermark2 = await waitSelector('body > div:nth-child(2)')
      watermark1?.remove()
      watermark2?.remove()
    }

    if (/x.sankuai.com/.test(window.location.href)) {
      const watermark1 = await waitSelector('#main > div > div.global-watermark')
      const watermark2 = await waitSelector('div[owl-ignore]')
      watermark1?.remove()
      watermark2?.remove()
    }
  }

  /** 移除学城的 ai 快速预览 */
  async function removeKmAiQuickView() {
    if (/km.sankuai.com/.test(window.location.href)) {
      const element = await waitSelector('.ai-quick-view-container')
      element?.remove()
    }
  }

  /** 直播助手 Web 环境指示器 */
  async function liveEnvIndicator() {
    const envs = [
      {
        type: "Local",
        color: "rgba(246, 135, 66, 0.9)",
        origin: "https://localhost.test.meituan.com:8080",
      },
      {
        type: "Test",
        color: "rgba(22, 111, 247, 0.9)",
        origin: "https://live.test.meituan.com",
      },
      {
        type: "Prod",
        color: "rgba(255, 31, 31, 0.9)",
        origin: "https://live.meituan.com",
      },
    ];

    const currentEnv = envs.find((env) => {
      const url = new URL(window.location.href);
      if (url.origin !== env.origin) return false;
      return true;
    });

    if (!currentEnv) return;

    // 测试环境提示特殊样式
    (async () => {
      try {
        const testTip = await waitSelector('.live-header .content')
        testTip.style.marginLeft = '12px'
      } catch (error) { }
    })()

    // 创建容器
    const div = document.createElement("div");
    div.id = "live-env-indicator"
    div.style.marginLeft = '12px'
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "4px";

    if (document.querySelector('#live-env-indicator')) return;
    const baseElement = await waitSelector('.header-txt')
    baseElement.insertAdjacentElement('afterend', div)

    for (const env of envs) {
      const btn = document.createElement("button");
      btn.innerText = env.type;
      btn.style.backgroundColor =
        currentEnv.type === env.type ? env.color : "rgba(13,13,13,0.2)";
      btn.style.display = "block";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.padding = "0 8px 0 8px";
      btn.style.borderRadius = "6px";
      btn.style.cursor = "pointer";
      btn.style.height = "24px";

      btn.addEventListener("click", async () => {
        await report('点击直播助手环境指示器', 1)

        const url = new URL(env.origin);
        url.search = window.location.search;
        url.pathname = window.location.pathname;
        url.hash = window.location.hash;
        window.location.href = url.toString();
      });

      div.appendChild(btn);
    }
  }

  /** 墨斗环境指示器 */
  async function mdEnvIndicator() {
    const envs = [
      {
        type: "Local",
        color: "rgba(246, 135, 66, 0.9)",
        origin: "http://localhost:3000",
      },
      {
        type: "Test",
        color: "rgba(22, 111, 247, 0.9)",
        origin: "https://mlive.dzu.test.sankuai.com",
      },
      {
        type: "Prod",
        color: "rgba(255, 31, 31, 0.9)",
        origin: "https://mlive.sankuai.com",
      },
    ];

    const currentEnv = envs.find((env) => {
      const url = new URL(window.location.href);
      if (url.origin !== env.origin) return false;
      return true;
    });

    if (!currentEnv) return;

    // 创建容器
    const div = document.createElement("div");
    div.id = "md-env-indicator"
    div.style.position = "absolute";
    div.style.zIndex = "100";
    div.style.top = "10px";
    div.style.left = "325px";
    div.style.height = "32px"
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.gap = "4px";

    const logoElement = await waitSelector('.logo-title')
    if (logoElement.innerText !== '墨斗') return;

    if (document.querySelector('#md-env-indicator')) return;
    document.body.appendChild(div);

    for (const env of envs) {
      const btn = document.createElement("button");
      btn.innerText = env.type;
      btn.style.backgroundColor =
        currentEnv.type === env.type ? env.color : "rgba(13,13,13,0.2)";
      btn.style.display = "block";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.padding = "0 8px 0 8px";
      btn.style.borderRadius = "6px";
      btn.style.cursor = "pointer";
      btn.style.height = "24px";

      btn.addEventListener("click", async () => {
        await report('点击墨斗环境指示器', 1)

        const url = new URL(env.origin);
        url.search = window.location.search;
        url.pathname = window.location.pathname;
        url.hash = window.location.hash;
        window.location.href = url.toString();
      });

      div.appendChild(btn);
    }
  }


  function CustomMain() {
    codeCommentShortcuts().catch(console.log)
    // removeWatermark().catch(console.log)
    // removeKmAiQuickView().catch(console.log)
    liveEnvIndicator().catch(console.log)
    mdEnvIndicator().catch(console.log)
  }

  CustomMain()
  window.addEventListener('popstate', CustomMain)
})();

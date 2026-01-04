// ==UserScript==
// @name         QQ Group Nominate Meme Generator
// @namespace    http://tampermonkey.net/
// @license      AGPL3
// @version      2024-02-10.5
// @description  https://github.com/Dituon/nominate-meme-generator
// @author       Dituon
// @match        https://qun.qq.com/member.html
// @icon         https://qinfo.clt.qq.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/487003/QQ%20Group%20Nominate%20Meme%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/487003/QQ%20Group%20Nominate%20Meme%20Generator.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const IFRAME_SRC = 'https://nominate.d2n.moe'

  let skey = initSkey()

  if (!skey) {
    alert('请登录后使用本脚本')
  }

  let loop_res
  const hook = new Promise(res => loop_res = res)
  const interval = setInterval(() => {
    if (document.querySelectorAll('.my-group-list>li').length) {
      loop_res()
    }
  }, 500)
  await hook
  clearInterval(interval)
  skey = initSkey()

  // 腾讯加密逆向
  let _t = 5381
  for (let _e = skey, _n = 0, _o = _e.length; _n < _o; ++_n)
    _t += (_t << 5) + _e.charAt(_n).charCodeAt()
  let bkn = 2147483647 & _t

  const cltIframe = document.createElement('iframe')
  cltIframe.style.cssText = 'width: 0; height: 0; position: absolute; left: 0;'

  async function fetchGroup(id) {
    cltIframe.src = 'https://qinfo.clt.qq.com/qinfo_v3/member.html?groupuin=' + id
    await new Promise(res => cltIframe.onload = res)
    const {members} = await gmXmlHttpRequest(`https://qinfo.clt.qq.com/cgi-bin/qun_info/get_members_info_v1?gc=${id}&bkn=${bkn}`)
    return Object.keys(members).sort((a, b) => members[a].lst - members[b].lst).reverse()
  }

  const groups = [...document.querySelectorAll('.my-group-list>li')].map(ele => ({
    name: ele.title, id: ele.getAttribute('data-id')
  }))
  console.log(groups)
  // iframe
  const iframe = document.createElement('iframe')

  window.addEventListener('message', async e => {
    const {type, id} = e.data
    switch (type) {
      case 'groups':
        iframe.contentWindow.postMessage({type, data: groups}, '*')
        break
      case 'members':
        iframe.contentWindow.postMessage({type, data: await fetchGroup(id)}, '*')
        break
    }
  })

  iframe.src = IFRAME_SRC
  iframe.style.cssText = 'width: 100%; height: 100%; border: none;'
  document.body.innerHTML = ''
  document.body.appendChild(cltIframe)
  document.body.appendChild(iframe)

  function gmXmlHttpRequest(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        headers: {
          'Referer': 'https://qinfo.clt.qq.com/qinfo_v3/member.html?groupuin=',
        },
        onload: function (response) {
          if (response.status === 200) {
            try {
              const data = JSON.parse(response.responseText);
              resolve(data);
            } catch (error) {
              reject("Error parsing JSON");
            }
          } else {
            reject(`Request failed with status: ${response.status}`);
          }
        },
        onerror: function (error) {
          reject("GM_xmlhttpRequest failed");
        },
      })
    })
  }

  function initSkey() {
    return document.cookie.match(/skey=([^;]+)/)?.[1]
  }
})()

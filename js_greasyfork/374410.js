// ==UserScript==
// @name         Nyaa以图搜种
// @description  通过官方图床搜索下载地址
// @version      1.44
// @author       psrx
// @namespace    https://github.com/psrx
// @run-at       document-start
// @match        https://hentai-covers.site/*
// @grant        GM_xmlhttpRequest
// @grant	     GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374410/Nyaa%E4%BB%A5%E5%9B%BE%E6%90%9C%E7%A7%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/374410/Nyaa%E4%BB%A5%E5%9B%BE%E6%90%9C%E7%A7%8D.meta.js
// ==/UserScript==

//考虑到不是每个用户都有屏蔽广告的扩展帮你们解决下广告和多余元素
GM_addStyle(
  `#explore_after_top_nsfw, #listing_before_pagination_nsfw, #listing_after_pagination_nsfw>.dmm_ranking, #listing_after_pagination_nsfw{display: none;}
  .list-item-desc {
    display: block !important;
  }
  `
)

document.addEventListener('DOMContentLoaded', () => {
  const tip = '请求中请稍后...'
  const errorTip = '请求出错,稍后重试'
  const waitingTime = 6000
  const xhrQueue = []
  const maxLength = 3

  const _removeFn = (fn) => {
    const index = xhrQueue.indexOf(fn)
    const nextFn = xhrQueue[maxLength]
    xhrQueue.splice(index, 1)
    nextFn && setTimeout(nextFn, 1000)
  }

  const setuBox = document.querySelector(
    '.content-width #list-most-recent .pad-content-listing'
  )

  const getSetu = (a, msgBox) => {
    const title = encodeURIComponent(a.textContent)

    const queueFn = () => {
      msgBox.textContent = tip


      const xhr = GM_xmlhttpRequest({
        method: 'GET',
        url: `https://sukebei.nyaa.si/?f=0&c=0_0&q="${title}"`,
        onload(res) {
          const nyaaDom = new DOMParser().parseFromString(
            res.responseText,
            'text/html'
          )


          // 保证只抓取绿色资源(受信任的发布者) 大概不会出什么BUG
          const aDom = nyaaDom.querySelector(
            '.success td:nth-child(3)>a:nth-child(2)'
          )

          if (aDom) {
            a.href = aDom.href
            a.style.color = 'rgb(57, 241, 0)'
            msgBox.style.color = 'rgb(57, 241, 0)'
            msgBox.textContent = '搜索完毕,请点击标题下载'
          } else {
            // 双层保障,如果还是意外的触发了nyaa的拦截就暴力重试
            const errorBox = nyaaDom.querySelector('center')
            if (errorBox) {
              msgBox.textContent = errorTip
              return
            }

            a.href = `https://e-hentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=${title}&f_apply=Apply+Filter`
            a.target = '_blank'
            msgBox.style.color = a.style.color = 'rgb(230, 247, 0)'
            msgBox.textContent = '没找到,去隔壁瞅瞅?'
          }

          _removeFn(queueFn)
        },
        onerror(err){
          console.log(err)
        }
      })


      setTimeout(() => {
        const msg = msgBox.textContent
        if (msg === tip || msg === errorTip) {
          xhr.abort()
          queueFn()
        }
      }, waitingTime)
    }

    xhrQueue.push(queueFn)
    if (xhrQueue.length <= maxLength) {
      queueFn()
    } else {
      msgBox.textContent = '排队中...'
    }
  }

  setuBox.addEventListener('mouseover', ({ target }) => {
    if (target.localName !== 'a' || target._ok) return
    target._ok = true
    let msgBox = target.nextElementSibling
    getSetu(target, msgBox)
  })

  // 拦截右键事件
  setuBox.addEventListener(
    'contextmenu',
    (e) => {
      e.stopPropagation()
    },
    true
  )
})

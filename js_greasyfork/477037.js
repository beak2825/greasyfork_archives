// ==UserScript==
// @name        dedu
// @license     MIT
// @namespace   github.com/ojer
// @match       https://www.baidu.com/s
// @match       https://fanyi.baidu.com/*
// @grant       GM_addElement
// @runat       document-end
// @version     1.35
// @author      ojer
// @description 去除百度搜索结果重定向,热榜,部分百度系推广, 翻译页广告弹出层
// @downloadURL https://update.greasyfork.org/scripts/477037/dedu.user.js
// @updateURL https://update.greasyfork.org/scripts/477037/dedu.meta.js
// ==/UserScript==
const dataId = 'vm-ojer-dedu'
const addStyle = () => {
  let content = `
		#content_right{
			display: none !important;
		}

   	#content_left > div:not([id]) {
			display: none !important;
		}

		#content_left > div[tpl="short_video"],div[tpl="news-realtime"],div[tpl="bjh_addressing"],div[tpl="recommend_list"] {
			display: none !important;
		}

		#content_left > div[mu^="https://baijiahao.baidu.com/s"] {
			display: none !important;
		}

	`
  if (window.location.host === 'fanyi.baidu.com') {
    // display: block;
    content += `
    div[style*="background-color: rgba(0, 0, 0, 0.6);"] {
      display: none !important;
    }

    div[style*="background: rgba(0, 0, 0, 0.6);"] {
      display: none !important;
    }

    body > div:not(#root) {
			display: none !important;
		}

    `
  }

  const ele = GM_addElement(document.head, 'style', content)
  ele.setAttribute('data-id', dataId)
}

const main = (s) => {
  setTimeout(() => {
    const left = document.getElementById('content_left')
    if (left) {
      const childrenElements = left.children
      for (var i = childrenElements.length - 1; i > -1; i--) {
        const fc = childrenElements[i]
        if (fc.querySelector('a.m.c-gap-left')) {
          fc.remove()
          continue
        }
        try {
          const href = fc.getAttribute('mu')
          if (href) {
            fc.querySelectorAll('a').forEach((a) => a.setAttribute('href', href))
          }
        } catch (ignore) {}
      }
    }
    s += 500
    if (s <= 3000) {
      main(s)
    }
  }, s)
}

new MutationObserver((mutationsList, observer) => {
  if (!document.querySelector('style[data-id="' + dataId + '"]')) {
    setTimeout(addStyle())
    main(500)
  }
}).observe(document.body, {
  childList: true
})

// ==UserScript==
// @name         便捷查询
// @namespace    https://greasyfork.org/zh-CN/users/764555
// @version      1.0.5
// @description  鼠标移动到头像可以便捷查看违规记录
// @author       冰冻大西瓜
// @license      GPLv3
// @match        https://www.52pojie.cn/thread-*
// @match        https://www.52pojie.cn/forum.php?mod=viewthread&tid=*
// @match        https://www.52pojie.cn/forum.php?mod=modcp&action=moderate&op=threads
// @grant        GM_addStyle
// @note         让程序更加健壮
// @note         修复了一些问题
// @note         更新 license 和 namespace
// @note         调整了显示层级,防止被其他元素遮挡
// @note         鼠标移动到头像可以便捷查看违规记录
// @downloadURL https://update.greasyfork.org/scripts/463211/%E4%BE%BF%E6%8D%B7%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/463211/%E4%BE%BF%E6%8D%B7%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
GM_addStyle(`
.p_pop.blk.bui {  width: 600px !important;
  height: unset !important;
  background-color:#fdfdfd8f !important;
  z-index:99999 !important;
}`)

console.log('便捷查询载入')

const imgs = document.querySelectorAll('.avatar>a>img') || []

// 添加鼠标移入事件
if (imgs) {
  imgs.forEach(img => {
    img.addEventListener('mouseenter', e => {
      const uid = e.target.parentNode.href.match(/uid=(\d+)/)[1]
      if (uid) {
        let userInfoUrl = `https://www.52pojie.cn/home.php?mod=space&uid=${uid}&do=profile&from=space`
        fetch(userInfoUrl)
          .then(res => res.blob())
          .then(data => {
            // 核心 对数据重新编码 否则网页会乱码
            const reader = new FileReader()
            reader.readAsText(data, 'gbk')
            reader.onload = () => {
              const parser = new DOMParser()
              const pageHtml = parser.parseFromString(reader.result.toString(), 'text/html')
              showInfo(img, pageHtml.querySelector('#pcr'))
            }
          })
      } else {
        console.error('未匹配到uid')
      }
    })
  })
}

/**
 * @description 显示违规信息
 * @param {*} dom 当前图像节点
 * @param {*} info 当前用户违规信息
 */
const showInfo = (dom, info) => {
  const card = dom.closest('.pls.cl.favatar').querySelector('.p_pop.blk.bui')
  if (!card.querySelector('table')) {
    if (info) {
      card.appendChild(info)
    } else {
      const div = document.createElement('div')
      div.innerText = '没有违规记录'
      card.appendChild(div)
    }
  } else {
    if (info) {
      card.querySelector('table').replaceWith(info)
    } else {
      const div = document.createElement('div')
      div.innerText = '没有违规记录'
      card.appendChild(div)
    }
  }
}

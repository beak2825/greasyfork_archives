// ==UserScript==
// @name         悬赏贴原生楼层显示
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      1.2.1
// @description  显示已结帖的原生楼层，方便管理悬赏贴，提高管理效率，适用于吾爱破解论坛悬赏贴
// @author       冰冻大西瓜
// @license      MIT
// @match        https://www.52pojie.cn/thread-*.html
// @match        https://www.52pojie.cn/forum.php?mod=viewthread*
// @note         2023年12月22日 修复了悬赏页存在置顶回复楼层显示的BUG
// @note         2023年12月22日 修正了10楼显示原楼层的BUG
// @downloadURL https://update.greasyfork.org/scripts/482825/%E6%82%AC%E8%B5%8F%E8%B4%B4%E5%8E%9F%E7%94%9F%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/482825/%E6%82%AC%E8%B5%8F%E8%B4%B4%E5%8E%9F%E7%94%9F%E6%A5%BC%E5%B1%82%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

/**
 * @description 判断当前页面是否为已结帖状态,返回真为结贴,返回假为未结贴/非悬赏贴
 * @returns {boolean} 悬赏贴是否已结贴
 */
const isReward = () => {
  return document.querySelector('.rsld.z') ? true : false
}

/**
 * @description 获取当前页所有pidDom
 * @returns {array} 返回一个对象数组,包含dom和id两个属性
 */
const getAllPidDom = () => {
  const allDom = [...document.querySelectorAll('#postlist .plhin:not(.res-postfirst)')]
  const allId = allDom.map(pidDom => {
    return Number(pidDom.id.match(/pid(\d+)/)[1]) || null
  })
  // 返回两个数组组合成的对象数组
  return allId.map((item, index) => {
    return {
      id: item,
      dom: allDom[index],
    }
  })
}

/**
 * @description 设置悬赏回帖的原生楼层
 * @param {index:Number,dom: HTMLElement,} dom对象和原生楼层
 */
const setNativeFloor = (index, dom) => {
  const textAnswer = dom.querySelector('.pi strong a')
  const createAnswerDom = document.createElement('span')
  createAnswerDom.innerHTML = `原楼层: ${index} 楼 `
  if (index === 10) {
    const ansText = dom.querySelector('.plc a span')?.textContent || null
    if (ansText === '最佳答案') {
      createAnswerDom.innerHTML += `也可能在第一页以后 `
    }
  } else if (index > 10) {
    createAnswerDom.innerHTML = `原楼层大于10楼,不在第一页`
  }
  createAnswerDom.style.color = 'green'
  createAnswerDom.style.fontWeight = 'bold'
  textAnswer.insertBefore(createAnswerDom, textAnswer.firstChild)
}

// 执行入口
;(() => {
  // 非悬赏贴直接结束脚本
  if (!isReward()) return
  // 获取当前页所有pidDom
  const pidListDom = getAllPidDom()
  // 重新排序pidListDom
  const pidListDomSort = pidListDom.sort((a, b) => a.id - b.id)
  pidListDomSort.forEach((item, index) => {
    // +2 是因为主题帖占1L 最佳答案占2L
    setNativeFloor(index + 2, item.dom)
  })
})()

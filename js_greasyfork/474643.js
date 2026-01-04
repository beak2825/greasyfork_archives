// ==UserScript==
// @name         快捷回复短语
// @namespace    https://greasyfork.org/zh-CN/users/764555
// @version      1.6.3
// @description  快捷回复短语,提高管理效率
// @author       冰冻大西瓜
// @license      GPLv3
// @match        https://www.52pojie.cn/forum.php?mod=modcp&action=report*
// @grant        GM_addStyle
// @note         更新 license 和 namespace
// @note         设置默认选中项
// @note         新增短语
// @note         分类到去举报区的提示添加原举报链接
// @downloadURL https://update.greasyfork.org/scripts/474643/%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E7%9F%AD%E8%AF%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/474643/%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E7%9F%AD%E8%AF%AD.meta.js
// ==/UserScript==

// 修正内容表格宽度
// eslint-disable-next-line no-undef
GM_addStyle(`
@media screen and (max-width: 768px)
{#list_modcp_logs tbody tr td:nth-child(2) {width:300px}}
@media screen and (min-width: 768px) and(max-width:1100px)
{#list_modcp_logs tbody tr td:nth-child(2) {width:500px}}
@media screen and (min-width: 1100px)
{#list_modcp_logs tbody tr td:nth-child(2) {width:600px}}
#cause option {
  max-width: 200px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}
`)

// 获取所有的input
const inputs = document.querySelectorAll('#list_modcp_logs tbody tr td:nth-child(4) input')

// options配置项
const options = [
  {
    value: '-1',
    title: '请在投诉举报区发贴截图证据，有效举报会有额外的热心值奖励',
    text: '去举报区',
  },
  { value: '0', title: '', selected: 'selected', text: '自定义' },
  {
    value: '1',
    title: '已经处理，感谢您对吾爱破解论坛的支持！',
    text: '已经处理!',
  },
  {
    value: '2',
    title: '暂无法认定违规,如坚持举报,请到投诉举报区发帖详述',
    text: '暂无法认定违规!',
  },
  {
    value: '3',
    title: '投诉举报只接受最近3个月的违规贴投诉举报(病毒，木马帖除外)和一个月内的复议申诉咨询',
    text: '投诉举报只受理三个月内发帖',
  },
  {
    value: '4',
    title:
      '举报木马病毒请将原文件上传微步、魔盾或者哈勃，再把对应诊断出的地址贴上来，并且把原始文件上传网盘提供地址，方便我们快速确认是否有问题。单纯反映某某杀毒报毒等，如既不能补充实质证据又无样本行为诊断地址，将不予受理并删帖。',
    text: '举报木马病毒...',
  },
  {
    value: '5',
    title: '已敦促楼主整改',
    text: '已敦促楼主',
  },
  {
    value: '6',
    title: '【通告】关于『lanzous.com』跳转到非法网站问题的说明\nhttps://www.52pojie.cn/thread-1646967-1-1.html',
    text: '蓝奏盘跳转问题',
  },
]

// 创建下拉框
const cause = document.createElement('select')
cause.setAttribute('id', 'cause')
/**
 * @description  创建select的option
 * @param {Array<object>} opts - option的配置项
 * @return {string} 返回一个option的html字符串
 */
const optionHtml = opts => {
  let html = ''
  opts.forEach(item => {
    html += `<option value="${item.value}" title="${item.title}" ${item.selected ?? ''}>${item.text}</option>`
  })
  return html
}
cause.innerHTML = optionHtml(options)
// 设置下拉框的样式
cause.style = 'width:20px;'

// 为所有<select>元素添加change事件监听器
document.addEventListener('change', event => {
  // 判断事件目标是否为<select>元素
  if (event.target.id === 'cause') {
    // 获取当前<select>元素的选中项
    const selectedOption = event.target.options[event.target.selectedIndex]
    const reportUrl = event.target.closest('tr').querySelector('td a').href
    // 获取当前<select>元素对应的<input>元素
    const input = event.target.parentNode.querySelector('input')
    // 将选中项的值同步到<input>元素中
    if (selectedOption.textContent === '去举报区') {
      input.value = `举报地址: ${reportUrl} ` + selectedOption.title
    } else {
      input.value = selectedOption.title
    }
  }
})

// 插入下拉框
inputs.forEach(item => {
  const causeClone = cause.cloneNode(true)
  item.parentNode.appendChild(causeClone)
})

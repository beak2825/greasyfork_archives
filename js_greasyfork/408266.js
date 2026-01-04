// ==UserScript==
// @name        自动展开全文（永久 beta+ 版）
// @namespace   Expand the article for vip.
// @match       *://*/*
// @grant       GM_info
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @run-at      document-end
// @version     1.4.0
// @supportURL  https://docs.qq.com/form/page/DYVFEd3ZaQm5pZ1ZR
// @homepageURL https://script.izyx.xyz/expand-the-article/
// @icon        https://i.v2ex.co/b39y298il.png
// @require     https://greasyfork.org/scripts/408776-dms-userscripts-toolkit/code/DMS-UserScripts-Toolkit.js?version=840920
// @inject-into content
// @noframes
// @author      稻米鼠
// @created     2020-07-24 07:04:35
// @updated     2020-09-05 09:30:51
// @description 自动展开全文的 beta 版，大概永远不会正式。使用前请务必认真阅读发布页说明，安装即表示知悉、理解并同意说明中全部内容。默认不开启任何功能，请在脚本菜单中切换功能（设置只针对当前网站）。
// @downloadURL https://update.greasyfork.org/scripts/408266/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%EF%BC%88%E6%B0%B8%E4%B9%85%20beta%2B%20%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/408266/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%EF%BC%88%E6%B0%B8%E4%B9%85%20beta%2B%20%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

const expand_article_main_function = function(){
// 闭包 Start
/* ====== 初始设定 ====== */
/* ------ 弹出提示 ------ */
if(!GM_getValue('notice_mark') || GM_getValue('notice_mark')!== '0.1.0'){
  if(confirm(`【自动展开全文 beta+】三个小提示：
1、请不要将脚本地址告诉他人，谢谢~
2、请先阅读发布页的说明，因为此脚本需要一丢丢操作~
3、有问题请反馈给作者，他有很努力的~`)){
    GM_setValue('notice_mark', '0.1.0')
  }
}
/* ------ 引入工具库 ------ */
const DMSTookit = new DMS_UserScripts.Toolkit({
  GM_info,                  // 脚本信息，用来控制台输出相关信息，以及通过当前版本好判断是否弹出更新提示
  GM_addStyle,              // 向页面注入样式，脚本功能重要依赖
  GM_getValue,              // 获取存储数据，用于读取脚本设置
  GM_setValue,              // 写入存储数据，用于存储脚本设置
  GM_deleteValue,           // 删除存储数据，用于清理脚本设置
  GM_registerMenuCommand,   // 注册脚本菜单
  GM_unregisterMenuCommand, // 反注册脚本菜单
  GM_openInTab,             // 打开标签页
})
/* ------ Debug 相关 ------ */
const is_debug = DMSTookit.is_debug
/* ------ 读取规则 ------ */
/**
 * Tag: 【Data】获取网站对应选项
 */
const ruleName = 'rule_'+window.location.hostname
const options = DMSTookit.proxyDataAuto(ruleName, {
  expand_article: false,
  super_expand  : false,
  remove_pop    : false,
  include_home  : false,
})
/* ------ 菜单注册 ------ */
// Tag: 菜单注册
// 【Menu】基础展开
DMSTookit.menuToggle(options, 'expand_article', '1、🍏自动展开启用中（仅本站）', '1、🍎自动展开禁用中（仅本站）', false, state=>{
  if(state && window.location.pathname === '/' ){
    options.include_home = true
  }
  window.location.reload(1)
})
// 【Menu】超级展开菜单注册
DMSTookit.menuToggle(options, 'super_expand', '2、🍏超级展开启用中（仅本站）', '2、🍎超级展开禁用中（仅本站）')
// 【Menu】去除遮盖
DMSTookit.menuToggle(options, 'remove_pop', '3、🍏去除遮挡开启中（仅本站）', '3、🍎去除遮挡禁用中（仅本站）')
// 【Menu】自定义规则
GM_registerMenuCommand(
  options.custom
    ? '4、🍏自定义规则启用中（进阶）'
    : '4、🍎无自定义规则（进阶）',
  () => {
    const customRule = prompt('请输入自定义规则，帮助文档请见脚本发布页面', options.custom ? options.custom : '')
    options.custom = /^\s*$/.test(customRule) ? undefined : customRule
    window.location.reload(1)
  }
);
// 【Menu】导入导出规则
GM_registerMenuCommand(
  '5、📓导入/导出（进阶）',
  () => {
    const keys = GM_listValues()
    const rules = {}
    for(const key of keys.filter(key=>/^rule_/.test(key))){
      rules[key] = GM_getValue(key, {})
    }
    DMSTookit.dblog('导入导出', JSON.stringify(rules))
    GM_setClipboard(JSON.stringify(rules), 'text/plain')
    const inputRules = prompt('导出规则已复制到剪切板\n如需导入，请在输入框内粘贴导入规则\n输入 CLEAR 可以清空脚本设置\n无需导入则点击取消', '')
    if(inputRules){
      // 清除设置
      if(inputRules === 'CLEAR'){
        if(confirm('确认清除数据？')){
          for(const key of keys){
            GM_deleteValue(key)
          }
          window.location.reload(1)
        }
      }else{
      // 导入设置
        try {
          Object.assign(rules, JSON.parse(inputRules))
          for(const key in rules){
            GM_setValue(key, rules[key])
          }
          alert('规则导入成功~')
          window.location.reload(1)
        } catch (error) {
          alert('规则有误，无法正确导入。')
          DMSTookit.dblog('Import rules', error)
        }
      }
    }
  }
);
// 更多脚本
DMSTookit.menuLink('6、🐹更多脚本', 'https://script.izyx.xyz/')
/* ------ 执行判断 ------ */
// 如果有自定义规则，则执行相应规则
if(options.custom){
  try {
    const setRule = (ruleName, rule)=>{
      const style = (rule.expand ? rule.expand.replace(/,\s+/g, ',\n')+` {
          max-height: none !important;
          height: auto !important;
        }\n` : '') +
        (rule.remove ? rule.remove.replace(/,\s+/g, ',\n')+` { display: none !important; }\n` : '') +
        (rule.show ? rule.show.replace(/,\s+/g, ',\n')+` { display: block !important; }\n` : '')
      DMSTookit.info('自动展开全文', '当前启用自定义规则：'+ruleName)
      DMSTookit.dblog('Custom rule', rule)
      DMSTookit.addStyle(style)
    }
    const rules = JSON.parse(options.custom)
    for(const key in rules){
      if(key==='default') continue
      const rule = rules[key]
      const reg = new RegExp(rule.reg, 'ig')
      DMSTookit.dblog('Custom rule\'s reg', reg)
      if(reg.test()){
        setRule(key, rule)
        return
      }
    }
    if(rules.default){
      setRule('Default', rules.default)
      return
    }
  } catch (error) {
    DMSTookit.info('自动展开全文', '自定义规则执行出错。'+error)
  }
  DMSTookit.info('自动展开全文', '自定义规则未适配当前网址。')
}
// 如果所有选项都为否，则不执行任何内容
if (!options.expand_article && !options.super_expand && !options.remove_pop && !options.custom) {
  // 如果存储中有此站规则，删除此规则
  if (GM_getValue(ruleName)){
    GM_deleteValue(ruleName)
  }else if(window.localStorage.getItem(ruleName)){
    window.localStorage.removeItem(ruleName)
  }
  return
}
// 排除网站首页，一般都不需要展开，而且布局区别很大
if(window.location.pathname === '/' && !options.include_home) return
/* ------ 阙值设定 ------ */
/**
 * Tag: 【Data】正文判定，特定子元素数量
 * 设定控制阈值，当元素的子元素是特定元素的数量超过此值，当作正文处理
 */
const passagesMinCount = 3
/**
 * Tag: 【Data】正文判定，字符阈值
 * 设定控制阈值，当元素内文字字数超过此值，当作正文处理
 */
const contentMinCount = 80
/**
 * Tag: 【Data】展开文章按钮子元素阙值
 * 展开按钮元素包含的子元素应该不超过这个数值
 */
const expandButtonMaxChildren = 10
/* ------ 样式注入 ------ */
/**
 * Tag: 添加样式
 * 加入基础样式信息，后面通过为元素添加相应类来实现展开
 */
DMSTookit.addStyle(`
  .expand-the-article-no-limit {
    max-height: none !important;
    height: auto !important;
  }
  .expand-the-article-display-none { display: none !important; }
  .expand-the-article-display-block { display: block !important; }
  .expand-the-article-no-linear-gradient { -webkit-mask: none !important; }
`)
/* ====== 功能函数 ====== */
/**
 * Tag: 【Debug】元素标记
 *
 * @param {*} by 来源
 * @param {*} el 元素对象
 * @param {*} ret 结果
 */
const addDebugMark = (el, log)=>{
  if(is_debug && el && el.dataset){
    const marks = el.dataset.mark ? el.dataset.mark.split('|') : []
    if(marks.indexOf(log)!==-1) return
    marks.push(log)
    el.dataset.mark = marks.join('|')
  }
}
/**
 * Tag: 【Func】元素过滤器
 * 对每个元素进行分析，是否为（疑似）正文元素
 * @param {*} el 待判断元素
 * @param {*} is_rollback 是否为回退判断，默认为 false
 * @returns
 * 是类正文元素返回  true
 * 无需处理元素返回  false
 * 非类正文元素返回  0
 */
const elFilter = (el, is_rollback=false)=>{
  try {
    // 非元素，无需处理
    if(!el) return false
    // 特定标签，无需处理
    const excludeTags = [
      'abbr',
      'applet',
      'area',
      'audio',
      'b',
      'base',
      'bdi',
      'bdo',
      'body',
      'br',
      'canvas',
      'caption',
      'cite',
      'code',
      'col',
      'colgroup',
      'data',
      'datalist',
      'del',
      'details',
      'dfn',
      'dialog',
      'em',
      'embed',
      'fieldset',
      'form',
      'g',
      'head',
      'html',
      'i',
      'img',
      'input',
      'ins',
      'kbd',
      'label',
      'legend',
      'link',
      'map',
      'mark',
      'marquee',
      'menu',
      'menuitem',
      'meta',
      'meter',
      'noscript',
      'optgroup',
      'option',
      'output',
      'param',
      'picture',
      'pre',
      'progress',
      'q',
      'rb',
      'rp',
      'rt',
      'rtc',
      'ruby',
      's',
      'samp',
      'script',
      'select',
      'small',
      'source',
      'span',
      'strong',
      'style',
      'sub',
      'summary',
      'sup',
      'svg',
      'table',
      'tbody',
      'td',
      'textarea',
      'tfoot',
      'th',
      'thead',
      'time',
      'title',
      'tr',
      'track',
      'tt',
      'u',
      'var',
      'video',
      'wbr',
    ];
    if(excludeTags.indexOf(el.tagName.toLowerCase()) !== -1){
      addDebugMark(el,'elFilter-false-tag')
      return false
    }
    // 统计元素中特定子元素的个数，判断是否属于正文
    if(is_rollback){
      // 如果是回退情况，直接计算所有后代元素
      if (
        el.querySelectorAll('p, br, h1, h2, h3, h4, h5, h6').length >=
        passagesMinCount
      ){
        addDebugMark(el,'elFilter-rollback-true')
        return true;
      }
    }else{
      // 如果不是回退判断
      let passages = 0
      const children = el.children
      for(let i=0; i<children.length; i++){
        if(/^(p|br|h1|h2|h3|h4|h5|h6)$/i.test(children[i].tagName)){
          passages++
        }
      }
      if(passages >= passagesMinCount){
        addDebugMark(el,'elFilter-true-passages')
        return true
      }
    }
    // 如果有文字内容，并且字数大于阈值
    if(el.innerText && el.innerText.length >= contentMinCount){
      addDebugMark(el,'elFilter-true-words')
      return true
    }
  } catch (error) {}
  addDebugMark(el,'elFilter-0')
  return 0
}
/**
 * Tag: 移除渐变遮罩
 * @param {*} el 
 */
const removeMask = el=>{
  if(elFilter(el) !== false){
    const elStyle = window.getComputedStyle(el)
    addDebugMark(el,'removeMask-'+/linear-gradient/i.test(elStyle.webkitMaskImage))
    if(/linear-gradient/i.test(elStyle.webkitMaskImage)){
      el.classList.add('expand-the-article-no-linear-gradient')
    }
  }
}
/**
 * Tag: 【Func】移除[阅读更多]按钮
 * 移除可能的 阅读更多 按钮
 * @param {*} el 待处理元素
 * @param {*} index 当前处理层级，超出一定深度则跳出
 */
const removeReadMoreButton = (el)=>{
  for(const e of el.children){
    const eStyle = window.getComputedStyle(e)
    if (
      // 绝对定位元素或者上方外部为负，则隐藏
      (/^(absolute)$/i.test(eStyle.position) || /^-\d/i.test(eStyle.marginTop)) &&
      e.innerText.length < 100 &&  // 文字数量小于 100
      e.querySelectorAll('*').length < expandButtonMaxChildren && // 后代元素数量小于设定值
      e.querySelectorAll( // 后代中不包含如下元素
        'html, head, meta, link, body, article, aside, footer, header, main, nav, section, audio, video, track, embed, iframe, style, script, input, textarea'
      ).length === 0
    ) {
      e.classList.add('expand-the-article-display-none');
    } else {
      // 如果元素不需要隐藏，则去除渐变遮罩
      removeMask(e);
    }
  }
}
/**
 * Tag: 【Func】移除高度限定
 * 移除元素高度限制，会尝试处理正文元素的所有祖先元素
 * @param {*} el 待处理元素
 */
const removeHeightLimit = el=>{
  // 如果包含特定类名（表示已处理过），则返回
  if(el.classList.contains('expand-the-article-no-limit')) return
  // 获取元素样式
  const elStyle = window.getComputedStyle(el)
  // 如果存在高度限制，或者隐藏内容，则去除
  if (
    elStyle.maxHeight !== 'none' ||
    (elStyle.height !== 'auto' && elStyle.overflowY === 'hidden')
  ) {
    addDebugMark(el,'removeHeightLimit-height')
    el.classList.add('expand-the-article-no-limit');
    if(elStyle.display === '-webkit-box') el.classList.add('expand-the-article-display-block');
  }
  // 被隐藏元素判断
  const childrenEls = el.children
  const childrenP = []
  const childrenDIV = []
  for(const cEl of childrenEls){
    if(/^p$/i.test(cEl.tagName)){
      childrenP.push(cEl)
      continue
    }
    if(/^div$/i.test(cEl.tagName)){
      childrenDIV.push(cEl)
      continue
    }
  }
  // Todo: 隐藏元素显示条件的进一步推敲
  // 此判断避免和 Clearly 扩展冲突
  if(!/^chrome-clearly-/.test(el.id)){
    // 如果元素被隐藏，则显示出来
    addDebugMark(el,'removeHeightLimit-hiddenEl-'+/^none/i.test(elStyle.display)+'-'+childrenP.length+'-'+childrenDIV.length)
    if (
      /^none/i.test(elStyle.display) &&
      (childrenP.length >= 6 || childrenDIV.length >= 6)
    ) {
      el.classList.add('expand-the-article-display-block');
    }
    // 如果子元素中有多个 div 或者段落被隐藏，则显示出来
    // Todo: 这部分还有待仔细打磨
    const childrenPHidden = childrenP.filter(e=>{
      return /^none/i.test((window.getComputedStyle(e)).display)
    })
    const childrenDIVHidden = childrenDIV.filter(e=>{
      return /^none/i.test((window.getComputedStyle(e)).display)
    })
    addDebugMark(el,'removeHeightLimit-hiddenEls-'+childrenPHidden.length+'-'+childrenDIVHidden.length)
    if(childrenPHidden>=6){
      childrenPHidden.forEach(e=>{
        e.classList.add('expand-the-article-display-block')
      })
    }
    if(childrenDIVHidden>=6){
      childrenDIVHidden.forEach(e=>{
        e.classList.add('expand-the-article-display-block')
      })
    }
  }
  // 寻找并移除 阅读更多 按钮
  removeReadMoreButton(el)
  // 移除渐变遮罩
  removeMask(el)  }
/**
 * Tag: 【Func】去除宽幅浮动元素
 * 如果元素定位为 fixed ，并且宽度大于等于窗口宽度的 96%，则去除
 * @param {*} el
 */
const hiddenPop = ()=>{
  document.querySelectorAll('*').forEach(el=>{
    // Todo: 能否更细致的判断
    if(elFilter(el) !== false && !el.querySelectorAll('nav').length) {
      const elStyle = window.getComputedStyle(el)
      addDebugMark(el,'hiddenPop-'+/^fixed$/i.test(elStyle.position)+'-'+el.offsetWidth)
      if (
        /^fixed$/i.test(elStyle.position) &&
        el.offsetWidth >= 0.96 * window.innerWidth
      ) {
        el.classList.add('expand-the-article-display-none');
      }
    }
  })
}
/**
 * Tag: 【Func】元素回退函数
 * 如果元素内不太可能包含正文，并且具有移除高度限定的类，则去除此类
 * @param {*} el 待处理元素
 */
const rollbackEl = el=>{
  // 如果元素标签是 html 或 body 则返回
  if(!el || !el.tagName || /^(html|body)$/i.test(el.tagName)) return
  if(elFilter(el) === 0){
    if (el.classList && el.classList.contains('expand-the-article-no-limit')) {
      el.classList.remove('expand-the-article-no-limit');
    }
    // 非类正文元素，则取消它后代元素中所有的隐藏
    el.querySelectorAll('.expand-the-article-display-none').forEach(e=>{
      e.classList.remove('expand-the-article-display-none')
    })
    rollbackEl(el.parentElement)
  }
}
/**
 * 对页面中所有元素进行展开判断
 * 对页面的一次完整处理
 */
const expandAllEl = ()=>{
  document.querySelectorAll('*').forEach((el)=>{
    if(elFilter(el)) removeHeightLimit(el)
  })
}
/**
 * Tag: 【Func】元素变化处理
 * @param {*} records 元素变化记录
 */
const whenChange = async records => {
  for await (const rec of records){
    // if(rec.type === 'attributes' || rec.type === 'characterData'){
    //   if(elFilter(rec.el)){ removeHeightLimit(rec.el) }
    //   continue
    // }
    // if(rec.type === 'childListAdd'){
    //   if(elFilter(rec.el)){
    //     removeHeightLimit(rec.el)
    //     rec.el.querySelectorAll('*').forEach((e)=>{
    //       if(elFilter(e)) removeHeightLimit(e)
    //     })
    //   }
    //   continue
    // }
    if(rec.type === 'childListRemove'){
      rollbackEl(rec.el)
      continue
    }
  }
  expandAllEl()
  // 如果需要去除浮动
  if(options.remove_pop){
    hiddenPop()
  }
}
const observer = DMSTookit.pageObserverInit(document.body, (records)=>{
  whenChange( DMSTookit.recordsPreProcessing(records) )
})
/* ====== 全局处理 ====== */
// Tag: 开始全局处理
if(options.expand_article){
  expandAllEl()
  window.addEventListener('load', function(){
    expandAllEl()
  })
  if(options.super_expand){
    observer.start()
  }
}else if(options.super_expand){
  options.super_expand = false
}
if(options.remove_pop){
  hiddenPop()
  window.addEventListener('load', function(){
    hiddenPop()
  })
}
// 闭包 End
}
expand_article_main_function()
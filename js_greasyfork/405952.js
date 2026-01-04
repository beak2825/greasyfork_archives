// ==UserScript==
// @name        我帮你加上空格嗷~
// @namespace   Maybe you forgot a space.
// @match       *://*/*
// @grant       none
// @author      稻米鼠
// @version     0.0.5
// @author      -
// @description 在英文和其他文字之间，添加一个空格，让排版变得更舒适，也更利于阅读，
// @downloadURL https://update.greasyfork.org/scripts/405952/%E6%88%91%E5%B8%AE%E4%BD%A0%E5%8A%A0%E4%B8%8A%E7%A9%BA%E6%A0%BC%E5%97%B7~.user.js
// @updateURL https://update.greasyfork.org/scripts/405952/%E6%88%91%E5%B8%AE%E4%BD%A0%E5%8A%A0%E4%B8%8A%E7%A9%BA%E6%A0%BC%E5%97%B7~.meta.js
// ==/UserScript==

window.addEventListener('load', async function(){
  /**
   * observer 配置
   * @property { boolean } childList - 观察目标子节点的变化，比如添加或者删除目标子节点，不包括修改子节点以及子节点后代的变化
   * @property { boolean } subtree - 目标以及目标的后代改变都会观察
   * @property { boolean } attributes - 观察目标属性的改变
   * @property { boolean } characterData - 观察目标数据的改变
   * @property { boolean } attributeOldValue - 默认为 true，表示需要记录改变前的目标属性值，设置了 attributeOldValue 可以省略 attributes 设置
   * @property { boolean } characterDataOldValue - 默认为 true，表示需要记录改变前的目标数据值，设置了 characterDataOldValue 可以省略 characterData 设置
   * @property { array } attributeFilter - 如果不是所有的属性改变都需要被观察，并且 attributes 设置为 true 或者被忽略，那么设置一个需要观察的属性本地名称（不需要命名空间）的列表
   */
  const config = {
    attributeOldValue: false,
    characterData: true,
    childList: true,
    subtree: true,
  };
  /**
   * 遍历元素的全部祖先元素，判断是否应该对此元素进行进一步处理
   * @param {*} el 要测试段元素
   */
  const nodeTester = el=>{
    if(/^body$/i.test(el.tagName)){
      return true
    }else if(
      /^(style|script|pre|code)$/i.test(el.tagName)
      || /^true$/i.test(el.contentEditable)
    ){
      return false
    }else{
      return nodeTester(el.parentNode)
    }
  }
  /**
   * 递归处理元素和子元素
   *
   * @param { object } el 页面元素
   * @returns
   */
  const addSpace = async el=>{
    // 如果 这是一个文本节点，则对内容进行替换
    // [英文 和 标点]与其他内容之间，加上空格
    if( el.nodeType === Node.TEXT_NODE ){
      el.textContent = el.textContent
        .replace(/([^\s\w\p{P}])([\w\p{P}]+)/gu, (match, p1, p2) =>
          /[a-zA-Z0-9]/.test(p2) ? p1 + ' ' + p2 : match
        )
        .replace(/([\w\p{P}]+)([^\s\w\p{P}])/gu, (match, p1, p2) =>
          /[a-zA-Z0-9]/.test(p1) ? p1 + ' ' + p2 : match
        );
    }else if(
      el.nodeType === Node.ELEMENT_NODE
      && nodeTester(el)
      ){
      // 如果这是一个元素节点，并且不是特殊元素，则对它的子元素进行遍历
      for await (e of el.childNodes){
        await addSpace(e)
      }
    }
    return Promise.resolve()
  }
  // 页面加载完成后处理整个页面
  await addSpace(document.body)
  // 声明用以监控页面的 observer 对象
  let observer
  /**
   * 当页面发生变化时，处理记录元素变化的数组
   *
   * @param { array } record MutationRecord
   * @returns
   */
  const pageChangeWatcher = async record =>{
    // 先停止对页面变化的监控，避免陷入死循环
    observer.disconnect()
    // 发生变化的元素合集
    const els = record
      // 改变的类型为 characterData，并且不是 body 元素的话
      .filter(
        (e) =>
          /^characterData$/i.test(e.type) && !/^body$/i.test(e.target.tagName)
      )
      .map((e) => e.target) // 把发生改变的元素放入合集
      // 改变的类型为 childList，则把新增的元素放入合集
      record.filter( e=>/^childList$/i.test(e.type)).forEach(e=>{
        e.addedNodes.forEach(node=>els.push(node))
      })
      // 遍历合集中所有元素
      for await (e of els){
        if(nodeTester(e)) await addSpace(e)
      }
      // 页面处理完成之后重新监控页面变化
      if(observer) observer.observe(document.body, config);
  }
  // 监控页面变化
  observer = new MutationObserver(pageChangeWatcher);
  observer.observe(document.body, config);
})
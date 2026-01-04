// ==UserScript==
// @name         Better video size.
// @namespace    Better_vide_size
// @version      0.6
// @description  Make videos display in a more comfortable size and position
// @author       稻米鼠
// @match        *://*/*
// @icon         https://i.v2ex.co/rj49czSYs.png
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/435716/Better%20video%20size.user.js
// @updateURL https://update.greasyfork.org/scripts/435716/Better%20video%20size.meta.js
// ==/UserScript==

(function() {
  'use strict';
  let video /** 用于储存视频元素的变量 */
  let mainInterval = null /** 用于储存计时器标记的变量 */

  /**
   * 视频元素查找器
   *
   * @param {string} selector 视频元素的选择器，默认选择所有 video 标签。然后返回其中面积最大的元素
   * @return {HTMLVideoElement|null} 
   */
  const videoFinder = (selector)=>{
    let area = 0
    let videoEl = null
    selector = selector ? selector : 'video'
    const parent=document.body
    parent.querySelectorAll(selector).forEach(video=>{
      const videoArea = video.offsetWidth * video.offsetHeight
      if(area<videoArea){
        area = videoArea
        videoEl = video
      }
    })
    return videoEl
  }

  /**
   * @type {object} 默认规则，在自定义规则中也可能引用默认规则中的条目
   * domain: 匹配的域名
   * videoSelector: 视频元素选择器（可省略）
   * mode: 各个模式的规则
   *      0: 竖屏嵌套横屏视频的放大
   *      1: 视频靠左
   *      2: 视频靠右
   * reset: 会影响到的属性，用以进行恢复操作
   */
  const defaultRule = { /** Default */
    mode: [
      /** 竖屏放大 */
      { transform: size=>'scale(3)' },
      /** 居左 */
      {
        width: ()=>'auto',
        marginLeft: ()=>'0',
        marginRight: ()=>'0',
      },
      /** 居右 */
      {
        marginLeft: size=>((size.vW-size.vH*size.vP)/2).toFixed()+'px',
        marginRight: size=>(-(size.vW-size.vH*size.vP)/2).toFixed()+'px'
      },
    ],
    reset: ['marginLeft', 'marginRight', 'transform', 'width']
  }
  /** @type {array} 针对各个网站制定的自定义规则 */
  const rules = [
    { /** Youtube */
      domain: 'youtube.com',
      mode: [
        defaultRule.mode[0],
        { marginLeft: (size, video)=>'-'+video.style.left },
        { marginLeft: (size, video)=>video.style.left },
      ],
      reset: ['transform', 'marginLeft']
    },
    { /** Bilibili */
      domain: 'bilibili.com',
      videoSelector: 'video, bwp-video',
      mode: defaultRule.mode,
      reset: defaultRule.reset
    },
  ]
  /**
   * 根据当前网址获取对应的规则
   * 如果自定义规则中没有匹配，则返回默认规则
   * @return {object} 
   */
  const getRule = ()=>{
    /** 通过 . 来切分域名，并从后向前逐项目比对 */
    const thisDomain = window.location.hostname.split(/\./g).reverse()
    for(const r of rules){
      const rDomain = r.domain.split(/\./g).reverse()
      let isit = true
      for(let i=0; i<rDomain.length; i++){
        if(rDomain[i]!==thisDomain[i]){
          isit = false
          break
        }
      }
      if(isit) return r
    }
    return defaultRule
  }
  const rule = getRule()

  /**
   * 如果有正在运行的定时器，那么清空定时器
   * 如果存在已选定的视频元素，重置所有可能影响到的样式并释放视频元素
   */
  const reset = ()=>{
    if(mainInterval){
      window.clearInterval(mainInterval)
      mainInterval = null
    }
    if(video){
      rule.reset.forEach(key=>setStyle(key, ''))
      video = null
    }
  }
  /**
   * 设置视频元素的样式
   * 如果样式未发生改变，则不进行任何操作
   * @param {string} key 样式的名称
   * @param {string} val 样式的值
   */
  const setStyle = (key, val)=>{
    if(video.style[key] === val) return
    video.style[key] = val
  }
  /**
   * 重新定位视频元素
   *
   * @param {number} [modeIndex=0] 定位模式
   * @param {number} [vPMin=4/3] 被嵌套的小视频的宽高比，默认 4:3，这样比较容易让内部的小视频完整显示
   */
  const rePosition = (modeIndex=0,vPMin=4/3)=>{
    /** 获取视频元素的宽度和高度 */
    const vW = video.offsetWidth
    const vH = video.offsetHeight
    /** 如果宽高为 0，则视频元素未被显示，则重置脚本 */
    if(!vW || !vH){
      reset()
      return
    }
    /** 读取写在元素中的视频宽高比 */
    let vP = video.getAttribute('data-video-proportion')
    /** 如果元素中没有对应的属性，那么应该是第1次操作这个视频元素 */
    if(!vP){
      /** 如果行内样式没有设定宽度，或者设定的宽度是 100%，则需要先记录原有的属性，然后再计算宽高比 */
      const fullWidth = !video.style.width || video.style.width==='100%'
      const oldWidthSet = video.style.width
      const oldHeightSet = video.style.height
      if(fullWidth){  /** 设置为自动之后，视频表现为原始的宽高比（不会有补充的黑边影响） */
        video.style.width = 'auto'
        video.style.height = 'auto'
      }
      /** 计算宽高比，并写入元素属性 */
      vP = video.offsetWidth / video.offsetHeight
      video.setAttribute('data-video-proportion', vP)
      /** 恢复原来的样式设定 */
      if(fullWidth){
        video.style.width = oldWidthSet
        video.style.height = oldHeightSet
      }
    }
    /** 将需要用到的一些尺寸存入对象，作为参数以供后续调用 */
    const size = {
      vW, vH, vP, vPMin,
      // pW: video.parentElement.offsetWidth,
      // pH: video.parentElement.offsetHeight,
    }
    /**
     * 根据模式逐一设定对应的样式
     * 方法是遍历所有受影响的样式
     * 如果在模式设定中有对应的值，则设定
     * 否则设置为空（消除可能存在的，以前这个脚本对他的设定）
     */
    const rMode = rule.mode[modeIndex]
    for(const key of rule.reset){
      if(rMode[key]){
        video.style[key] = rMode[key](size, video)
        continue
      }
      video.style[key] = ''
    }
  }
  /**
   * 启动对应的模式
   *
   * @param {number} modeIndex 模式的编号
   */
  const startMode = modeIndex=>{
    reset()
    video = videoFinder(rule.videoSelector)
    mainInterval = window.setInterval(()=>{
      rePosition(modeIndex)
    }, 500)
  }
  GM_registerMenuCommand('视频靠左', ()=>{
    startMode(1)
  })
  GM_registerMenuCommand('视频靠右', ()=>{
    startMode(2)
  })
  GM_registerMenuCommand('竖屏套横屏放大', ()=>{
    startMode(0)
  })
  GM_registerMenuCommand('恢复原状（不起作用就刷新页面）', ()=>{
    reset()
  })
})();
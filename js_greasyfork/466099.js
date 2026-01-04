// ==UserScript==
// @name         鼠标跟随特效
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  简单鼠标跟随特效，无广告和收益
// @author       asdiver
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466099/%E9%BC%A0%E6%A0%87%E8%B7%9F%E9%9A%8F%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/466099/%E9%BC%A0%E6%A0%87%E8%B7%9F%E9%9A%8F%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
       // 复用池
    class Pool{
      constructor(creatItem){
        this.creatItem = creatItem
      }
      creatItem = null
      total = 0
      save = []
      // 有剩余 则返回 ，没剩余 新增 并返回
      get(){
        //有剩余
        if(this.save.length){
          return {dom:this.save.shift(), create:false} 
        }else{
          this.total++
          return {dom:this.creatItem(), create:true}
        }
      }
      recovery(item){
        this.save.push(item)
      }
    }
    
    // 随机数
    function getRandomIntInclusive(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
    }

    // 事件侦听函数复用
    let last = null
    function tranEnd(){
      if(last === this){
        return
      }
      last = this
      this.style.display = "none"
      pool.recovery(this)
    }

    //生成一个小圆球
    const offsetX = 35
    const offsetY = 35
    const diameter = [10,30]
    const spendTime = [0.5, 2]
    function createRotundity(){
      const rotundity = document.createElement("div")
      rotundity.style.borderRadius = "100px";
      rotundity.style.position = "fixed";
      rotundity.style.zIndex = "9999"
      rotundity.style.pointerEvents = " none"
      // rotundity.classList.add("run")
      // 随机大小
      rotundity.style.height = rotundity.style.width = getRandomIntInclusive(diameter[0],diameter[1]) + "px"
      // 随机颜色
      rotundity.style.backgroundColor = `rgb(${getRandomIntInclusive(0,255)},${getRandomIntInclusive(0,255)},${getRandomIntInclusive(0,255)})`
      // 随机速度
      rotundity.style.transition = `all ${getRandomIntInclusive(spendTime[0], spendTime[1])}s`
      // 添加侦听器
      rotundity.addEventListener("transitionend", tranEnd)
      return rotundity
    }

    const pool = new Pool(createRotundity)
    
    // 事件监听
    let data = Date.now()
    const interval = 50
    let run = true
    document.addEventListener("mousemove",function(e){
      if(!run){
        return
      }
      const now = Date.now()
      if(now - data > interval){
        const {dom, create} = pool.get()
        const startX = e.clientX
        const startY = e.clientY
        // 初始
        dom.style.opacity = 1
        dom.style.display = "block"
        dom.style.left = startX+"px"
        dom.style.top = startY+"px"

        if(create){
          document.body.appendChild(dom)
        }
        
        requestAnimationFrame(()=>{
          setTimeout(()=>{
          // 变化
          dom.style.opacity = 0
          dom.style.left = (getRandomIntInclusive(offsetX,-offsetX)+startX)+"px"
          dom.style.top = (getRandomIntInclusive(offsetY,-offsetY)+startY)+"px"
          })
        })

        data = now
      }
    })
    document.addEventListener("mousedown",function(){
      run = false
    })
    document.addEventListener("mouseup",function(){
      run = true
    })
})();
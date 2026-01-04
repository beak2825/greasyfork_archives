// ==UserScript==
// @name        演示用
// @namespace   Violentmonkey Scripts
// @include        *
// @grant       none
// @version     1.0
// @author      chenhonzhou
// @description 8/15/2020, 5:44:02 PM
// @downloadURL https://update.greasyfork.org/scripts/408782/%E6%BC%94%E7%A4%BA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/408782/%E6%BC%94%E7%A4%BA%E7%94%A8.meta.js
// ==/UserScript==

/*
** 参考: http://caibaojian.com/pointer-events.html
** 事件参考: https://www.cnblogs.com/lyr1213/p/7122363.html
*/

const isObject = x => {
  return typeof x === 'object' && x !== null
}

// 设置 style
const setEleStyle = (ele, obj) => {
  if (isObject(obj)) {
    try {
      Object.keys(obj).forEach(item => {
        const isStyle = ele.style.hasOwnProperty(item)
        if (isStyle) {
          const val = obj[item]
          ele.style[item] = val
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }
}

const Eid = 'clickEle'

const getClickEle = ()=>{
  return document.getElementById(Eid)
}

const setStyle = obj=> {
  const ele = getClickEle()
  if (ele) setEleStyle(ele, obj)
  else {
    console.warn('设置style失败, 请在vm.$nextTick中设置')
  }
}

let clearFlag = null
let canMove = false

const runtime = options=> {
  if (!isObject(options)) options = {}
  if (!options.hasOwnProperty('opacity')) options.opacity = .0233
  if (!options.hasOwnProperty('style')) options.style = {}
  let { opacity, style } = options
  let _opacity = Number(opacity)
  if (Number.isNaN(_opacity) || (_opacity > 1 || _opacity < .1)) _opacity = 1
  if (!isObject(style)) style = {}
  return {
    inserted() {
      try {
        let ele = document.body
        if (getClickEle()) return
        const Ele = document.createElement('div')
        Ele.id = Eid
        const beau = {
          position: 'fixed',
          top: 0,
          left: 0,
          pointerEvents: `none`,
          position: `fixed`,
          width: `42px`,
          height: `42px`,
          zIndex: 9999,
          border: `2px solid rgb(147, 145, 145, .6)`,
          borderRadius: `50%`,
          opacity: 0,
          userSelect: 'none',
          transition: 'opacity .3s'
        }
        Object.assign(beau, style)

        setEleStyle(Ele, beau)
  
        const getPosition = ()=> {
          const rect = Ele.getBoundingClientRect()
          const border = 2
          const w = rect.width / 2 - border, h = rect.height / 2 - border
          const top = `calc(${ event.clientY }px - ${ w }px)`
          const left = `calc(${ event.clientX }px - ${ h }px)`
          return { top, left }
        }
  
        const display = (flag = true) => {
          setEleStyle(Ele, {
            opacity: flag ? _opacity : 0
          })
        }
  
        ele.addEventListener('mousedown', event=> {
          const { top, left } = getPosition()
          setEleStyle(Ele, { top, left })
          display()
          canMove = true
        })
        ele.addEventListener('mousemove', event=> {
          if (canMove) {
            const { top, left } = getPosition()
            let crd = { top, left }
            setEleStyle(Ele, crd)
            display()
          }
        })
        ele.addEventListener('mouseup', ()=> {
          clearFlag = setTimeout(()=> {
            display(false)
          }, 200)
          canMove = false
        })
        ele.append(Ele)
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}

const ctx = runtime({
  'border-color': 'red'
})
ctx.inserted()
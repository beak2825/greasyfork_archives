// ==UserScript==
// @name        小蝌蚪滑动特效
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  点击空白处一下,移动鼠标即可看到效果,如果想关闭效果,在此点击空白处即可关闭
// @author       wuyupei
// @match         *://*/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431524/%E5%B0%8F%E8%9D%8C%E8%9A%AA%E6%BB%91%E5%8A%A8%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/431524/%E5%B0%8F%E8%9D%8C%E8%9A%AA%E6%BB%91%E5%8A%A8%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
const mydiv = document.createElement('div')
mydiv.style.width = 100 + "vw"
mydiv.style.height = 100 + "vh"
mydiv.style.position = "fixed"
mydiv.style.top = 0 + 'px'
mydiv.style.left = 0 + 'px'
mydiv.style.right = 0 + 'px'
mydiv.style.bottom = 0 + 'px'
mydiv.style.pointerEvents = "none"
mydiv.style.zIndex = "1000"
document.body.appendChild(mydiv)

const canvas = document.createElement('canvas')
canvas.className = "canvas"
canvas.setAttribute("width", document.body.clientWidth)
canvas.setAttribute("height", 720)
canvas.style.position = "absolute"
canvas.style.top = 0 + 'px'
canvas.style.left = 0 + 'px'
canvas.style.right = 0 + 'px'
canvas.style.bottom = 0 + 'px'
canvas.style.zIndex = "2000"    
// 在canvas中把鼠标事件设为none  通过事件冒泡的方式把事件代理到document上   (防止点击页面中的超链接,选择文字功能失效) 
canvas.style.pointerEvents = "none"

mydiv.appendChild(canvas)

var arr = []
// 拿到2d笔
const ctx = canvas.getContext('2d')

var myCount = 1

document.addEventListener('click', (e) => {
    myCount++
    const timer = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }, 20);
    if (myCount % 2 === 0) {
        arr = []
        for (var i = 1; i < 11; i++) {
            new dot(e.clientX + sub(i), e.clientY, i / 2, 0, 0, i)
        }
        document.addEventListener('mousemove', begindrow)
    } else {
        document.removeEventListener('mousemove', begindrow)
        clearInterval(timer)
    }
})

// 绘制
function begindrow(e) {
    for (var i = 0; i < arr.length; i++) {
        arr[i].update(e.clientX, e.clientY)
    }
    for (var i = 0; i < arr.length; i++) {
        arr[i].render()
    }
}

// 随机颜色函数
function getColor() {
    var colorarr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f']
    var color = "#"
    for (var i = 0; i < 6; i++) {
        color += colorarr[Math.floor(Math.random() * colorarr.length)]
    }
    return "#000000"
}

// 2.彩色点的类
class dot {
    constructor(x, y, r, dx, dy, index) {
        this.x = x
        this.y = y
        this.r = r
        this.dx = dx
        this.dy = dy
        this._x = x
        this._y = y
        this.index = index
        this.color = getColor()
        arr.push(this)
    }
}

dot.prototype.render = function () {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
    ctx.fillStyle = this.color
    ctx.fill()
}

dot.prototype.update = function (clienX, clienY) {
    if (this.index >= 9) {
        this.x = clienX
        this.y = clienY
    } else {
        this.x = arr[this.index + 1].x
        this.y = arr[this.index + 1].y
    }
}

function sub(i) {
    var sum = 0
    for (let j = 0; j < i; j++) {
        sum += j
    }
    return sum
}
})(document);
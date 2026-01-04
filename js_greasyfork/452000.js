// ==UserScript==
// @name         炫酷鼠标粒子
// @author       wushangheng
// @namespace    http://tampermonkey.net/
// @version      0.0.0
// @description  按住鼠标滑动,即可看到特效
// @match         *://*/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452000/%E7%82%AB%E9%85%B7%E9%BC%A0%E6%A0%87%E7%B2%92%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/452000/%E7%82%AB%E9%85%B7%E9%BC%A0%E6%A0%87%E7%B2%92%E5%AD%90.meta.js
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
canvas.style.pointerEvents = "none"
mydiv.appendChild(canvas)
var arr = []
var mode;
const ctx = canvas.getContext('2d')
let mn = 0
document.addEventListener('mousedown', () => {
    let url = location.href;
    const matches = {
      "^https://florr.io": "florr",
      "^https://digdig.io": "digdig",
      "^https://.+.luogu.com.cn/problem/.+": "luogu",
      "^https://box3.+": "box3",
    };
    for (let e of Object.keys(matches)) {
      if (new RegExp(e).test(url)) mode = matches[e];
    }
    if(mode=="florr") return ;
    if(mode=="digdig") return ;
    if(mode=="luogu") return ;
    if(mode=="box3") return ;
    arr = []
    mn = 0;
    const startTimer = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (var i = mn; i < arr.length; i++) {
            arr[i].render()
            arr[i].update()
            arr[i].remove(i)
        }
    }, 20);
    document.addEventListener('mousemove', begindrow)
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', begindrow)
        clearInterval(startTimer)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    })
})

function begindrow(e) {
    new dot(e.clientX, e.clientY, Math.random()*(Math.random()*(Math.random()*(Math.random()*(Math.random()*10))))+1, Math.random()*2-1, Math.random()*2-1)
    new dot(e.clientX, e.clientY, Math.random()*(Math.random()*(Math.random()*(Math.random()*(Math.random()*10))))+1, Math.random()*2-1, Math.random()*2-1)
    new dot(e.clientX, e.clientY, Math.random()*(Math.random()*(Math.random()*(Math.random()*(Math.random()*20))))+1, Math.random()*2-1, Math.random()*2-1)
}

function getColor() {
    var colorarr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
    var color = "#"
    for (var i = 0; i < 6; i++) {
        color += colorarr[Math.floor(Math.random() * colorarr.length)]
    }
    return color
}

class dot {
    constructor(x, y, r, dx, dy) {
        this.x = x
        this.y = y
        this.r = r
        this.dx = dx
        this.dy = dy
        this._x = x
        this._y = y
        this.color = getColor()
        arr.push(this)
    }
}
dot.prototype.render = function () {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI * this.r, false)
    ctx.fillStyle = this.color
    ctx.fill()
}

dot.prototype.update = function () {
    this.x += this.dx
    this.y += this.dy
}

dot.prototype.remove = function (x) {
    if (this.x - this._x >= 100 || this.x - this.x <= -100 || this.y - this._y >= 100 || this.y - this._y <= -100) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        mn = x;
    }
}
})(document);
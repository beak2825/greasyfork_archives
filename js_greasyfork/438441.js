// ==UserScript==
// @name         鼠标拖尾~~~
// @license 弗莱克斯
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自用
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438441/%E9%BC%A0%E6%A0%87%E6%8B%96%E5%B0%BE~~~.user.js
// @updateURL https://update.greasyfork.org/scripts/438441/%E9%BC%A0%E6%A0%87%E6%8B%96%E5%B0%BE~~~.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let canvas=document.createElement("canvas");
    canvas.setAttribute('id','canvas');
    let w=window.innerWidth
    let h=window.innerHeight
    canvas.style.cssText=`
        width: ${w}px;
        height: ${h}px;
        position:fixed;
        top:0;
        left:0;
        z-index:-10;
    `;
    document.body.appendChild(canvas);
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    let arr = [];
    let flag = 0;
    let time;

 //页面改变时样式
    window.onresize=function(){
        ctx.clearRect(0, 0, w, h)
        w=window.innerWidth
        h=window.innerHeight
        canvas.style.cssText=`
        width: ${w}px;
        height: ${h}px;
        position:fixed;
        top:0;
        left:0;
        z-index:-10;
    `;
        canvas.width = w;
        canvas.height = h;
    }
//创建的粒子类
    class points {
        constructor(x, y) {
            this.x = Math.random() * 40 - 20 + x
            this.y = Math.random() * 40 - 20 + y
            this.r = Math.random() * 4 + 2
            this.opacity = 1
            this.color = randomColor()
            this.movex = Math.sin(Math.random() * 2 * Math.PI) * 0.3
            this.movey = Math.sin(Math.random() * 2 * Math.PI) * 0.3
            this.style = Math.floor(Math.random()*2)
        }
        disappear() {
            this.opacity -= 0.02
            this.opacity <= 0 ? this.opacity = 0 : 0
            this.x += this.movex
            this.y += this.movey
        }

        draw() {
            this.disappear()
            switch (this.style) {
                case 0:
                    this.rec()
                    break;
                case 1:
                    this.arc()
                    break;
            }

        }
        rec() {
            ctx.beginPath()
            ctx.fillStyle = `rgba(${this.color},${this.opacity})`
            ctx.fillRect(this.x, this.y, this.r, this.r)
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 3 * this.r;
            ctx.fill()
        }
        arc() {
            ctx.beginPath()
            ctx.fillStyle = `rgba(${this.color},${this.opacity})`
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
            ctx.shadowColor = '#fff';
            ctx.shadowBlur = 3 * this.r;
            ctx.fill()
        }

    }

    window.addEventListener("mousemove", (e) => {
            arr.push(new points(e.clientX, e.clientY))
    })

    function randomColor() {
        let u = `${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)}`
        return u
    }
//动画
    function animate() {
        ctx.clearRect(0, 0, w, h)
        arr.forEach((item, index) => {
            if (item.opacity == 0) {
                arr.splice(index, 1)
            }
            item.draw()
        })
        window.requestAnimationFrame(animate)
    }
    animate()

})();
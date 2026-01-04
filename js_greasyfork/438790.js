// ==UserScript==
// @license     弗莱克斯
// @name         snow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏保
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438790/snow.user.js
// @updateURL https://update.greasyfork.org/scripts/438790/snow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //创建canvas标签
    let snow=document.createElement("canvas");
    snow.setAttribute('id','snow');
    let maxh = window.innerHeight;
    let maxw = window.innerWidth;
    //获取图片
    //     let nimg=new Image()
    //     nimg.src='http://img.netbian.com/file/2021/0304/24f1b123ff78de994241c8822fef48f3.jpg'
    //判断动画执行
    let flag=1;
    snow.style.cssText=`
        width: ${maxw}px;
        height: ${maxh}px;
        position:fixed;
        top:0;
        left:0;
        opacity:1;
       background:rgba(19, 15, 64,0.6);
        transition:all .5s;
        z-index:99999;
    `;
    const PI = Math.PI
    const num = 100;
    snow.height = maxh
    snow.width = maxw
    let ctx = snow.getContext('2d');
    //粒子集合
    let arr = [];

    //页面改变时样式
    window.onresize=function(){
        ctx.clearRect(0, 0, maxw, maxh)
        maxw=window.innerWidth;
        maxh=window.innerHeight;
        snow.style.cssText=`
        width: ${maxw}px;
        height: ${maxh}px;
        position:fixed;
        top:0;
        left:0;
        opacity:1;
        transition:all .3s;
       background:rgba(19, 15, 64,0.6);
        z-index:99999;
    `;
        snow.width = maxw;
        snow.height = maxh;

    }
    //粒子类
    class snow_point {
        constructor(x, y, r) {
            this.x = x;
            this.y = y;
            this.r = r;
            this.offset = randomOffset();
            this.speed = getRandom(0.4, 0.7);
            this.opacity=0.5+Math.random()*0.5;
            this.offspeed = getRandom(0.025, 0.1);
        }
        //绘制
        draw() {
            this.change()
            ctx.save()
            ctx.beginPath()
            ctx.arc(this.x, this.y, this.r, 0, 2 * PI)
            ctx.fillStyle = `rgba(245, 246, 250,${this.opacity})`;
            ctx.shadowColor = 'rgba(255, 190, 118,1.0)';
            ctx.shadowBlur = 20;
            ctx.fill();
            ctx.restore();

        }
        //变化
        change() {
            this.x += this.offset * this.offspeed
            this.y += this.speed
            this.r-=0.0005
            this.opacity-=0.0005;
            this.opacity<0?this.opacity=0:0;
            this.r<0?this.r=0:0;
            if (this.y > maxh) {
                this.y = -20
            }
        }

    }
    //横向偏移
    function randomOffset() {
        let a = Math.sin(Math.random() * PI * 2)
        return a
    }
    //获取两个值直接的随机数
    function getRandom(min, max) {
        return Math.random() * (max - min) + min
    }
    //创建粒子
    function create() {
        for (let i = 0; i < num; i++) {
            let a = new snow_point(getRandom(0, maxw), getRandom(-maxh,maxh), getRandom(1.5, 4.5))
            arr.push(a)
        }
    }

    //动画
    function animate() {
        ctx.clearRect(0,0,maxw,maxh)
        arr.forEach((item,index,arr) => {
            if(item.opacity == 0 || item.r == 0){
                arr.splice(index,1);
                if(arr.length<200){ //限制最多同屏200个
                    let a = new snow_point(getRandom(0, maxw), getRandom(-maxh, 0), getRandom(1.5, 4.5))
                    arr.push(a)
                }
            }
        })
        arr.forEach((item,index) => {
            item.draw()
        })
        flag?window.requestAnimationFrame(animate):0
    }
    create()
    animate()
    function fn(){
        snow.removeEventListener('click',fn)
        //透明
        snow.style.opacity=0
        setTimeout(()=>{
            document.body.removeChild(snow)

        },300)

        flag=0;

    }

    //再次执行动画
    function doAgain(){
        if(!flag){
            flag=1
            //显示
            snow.style.opacity=1
            animate()
        }

    }
    //切换页面出现
    document.onvisibilitychange = function() {
        if (document.visibilityState === 'hidden') {
            document.body.appendChild(snow)
            doAgain()
        }else{
            if(document.getElementById('snow')){
                snow.addEventListener('click',fn)
            }
        }
    }
})();
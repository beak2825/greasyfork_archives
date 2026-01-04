// ==UserScript==
// @name         404 Game
// @namespace    http://oj.bashu.com.cn/
// @version      1.0.0.1
// @description  game
// @author       123asdf123
// @match        *://*/*
// @icon         https://cdn.luogu.com.cn/upload/usericon/576074.png
// @license      SATA
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496425/404%20Game.user.js
// @updateURL https://update.greasyfork.org/scripts/496425/404%20Game.meta.js
// ==/UserScript==
(function() {
    'use strict';
while(document.body.children.length){
	document.body.children[0].remove();
}
window.document.body.appendChild(document.createElement("div"))
var hp=404,t=1,tt=500;
var canvas = document.createElement("canvas")
var ctx = canvas.getContext("2d")
window.document.body.appendChild(canvas)
canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.setAttribute('style', 'position:fixed;left:0;top:0;pointer-events:none;filter:blur(2px);')
var clicks = []
var points = [] //定义粒子数组
var srolls = [] //定义粒子数组
var live = 50 //存活50个周期
var colors = [ //备选粒子颜色数组
    "236, 204, 104",
    "255, 71, 87",
    "112, 161, 255",
    "123, 237, 159"
]
var mx=innerWidth/2,my=innerHeight/2,mox=0,moy=0;
var rx=innerWidth/2,ry=innerHeight/2
window.addEventListener("mousemove", function (evt) { //监听点击事件
    mox=evt.x;
    moy=evt.y;
})
var mv=1,cl=1,sr=1,cnt=0;
function drawpoints() { //绘制粒子
    document.body.children[0].innerHTML="<center><h1>"+hp+" Not Found</h1></center>";
    if(hp<=0){
    	return
	}
    mx+=(mox-mx)/20; //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
    my+=(moy-my)/20;
    for (let i = 0; i < points.length; i++){
        let point=points[i]
        if(point.life2<3&&Math.pow((mx-(point.sx+point.size/2)),2)+Math.pow((my-(point.sy+point.size/2)),2)<=Math.pow(point.size+5,2)){
            hp--;
//            points.splice(i, 1);
        }
    }
    for (let i = 0; i < srolls.length; i++){
        let point=srolls[i]
        if(point.life2<3&&Math.pow((mx-(point.sx+point.size/2)),2)+Math.pow((my-(point.sy+point.size/2)),2)<=Math.pow(point.size+5,2)){
            hp--;
//            points.splice(i, 1);
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height) //清屏
    ctx.beginPath()
    ctx.arc(mx, my, 5, Math.PI * 2, false) //根据粒子属性画圆
    ctx.fillStyle = "rgba(0,0,0,1)" //根据粒子属性设置填充颜色及透明度
    ctx.fill() //填充颜色
    ctx.beginPath()
    ctx.arc(rx, ry, 5, Math.PI * 2, false) //根据粒子属性画圆
    ctx.fillStyle = "rgba(255,0,0,1)" //根据粒子属性设置填充颜色及透明度
    ctx.fill() //填充颜色
     for (let i = 0; i < points.length; i++){
        let point=points[i]
        if(point.sx<=0){
            point.vx=-point.vx;
        }
        if(point.sx>=innerWidth){
            point.vx=-point.vx;
        }
        if(point.sy<=0){
            point.vy=-point.vy;
        }
        if(point.sy>=innerHeight){
            point.vy=-point.vy;
        }
    }
    for (let i = 0; i < srolls.length; i++){
        let point=srolls[i]
        if(point.sx<=0){
            point.vx=-point.vx;
        }
        if(point.sx>=innerWidth){
            point.vx=-point.vx;
        }
        if(point.sy<=0){
            point.vy=-point.vy;
        }
        if(point.sy>=innerHeight){
            point.vy=-point.vy;
        }
    }
    for (let i = 0; i < clicks.length; i++){
        let point=clicks[i]
        if(point.sx<=0){
            point.vx=-point.vx;
        }
        if(point.sx>=innerWidth){
            point.vx=-point.vx;
        }
        if(point.sy<=0){
            point.vy=-point.vy;
        }
        if(point.sy>=innerHeight){
            point.vy=-point.vy;
        }
    }
    if(mv){
    for (let i = 0; i < points.length; i++) { //遍历粒子
        let point = points[i] //定义单个粒子
        ctx.beginPath()
        ctx.arc(point.sx, point.sy, point.size, Math.PI * 2, false) //根据粒子属性画圆
        ctx.fillStyle = "rgba(" + point.color + "," + 255 + ")" //根据粒子属性设置填充颜色及透明度
        ctx.fill() //填充颜色
        point.life-- //生命值减1
        if (point.life <= 0) { //生命值为0则从粒子数组中删除
        if(point.life2){
        for (let i = 0; i < 5; i++) { //添加15个粒子
        points.push({
            sx: point.sx, //鼠标当前坐标作为粒子坐标
            sy: point.sy,
            vx:(point.life2)*(0.5 - Math.random()), //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
            vy: (point.life2)*(0.5 - Math.random()),
            life: live, //存活周期
            life2:point.life2-1,
            color: colors[parseInt(Math.random() * colors.length)], //随机选择颜色
            size:point.life2*2+2, //随机粒子尺寸，取值范围为0~5
            rt:0 //随机粒子尺寸，取值范围为0~5
        })
    }
		}
            points.splice(i, 1)
        }
        point.sx += point.vx * 3 //根据向量值改变粒子位置
        point.sy += point.vy * 3
        point.rt++;
    }
    }
    if(sr){
    for (let i = 0; i < srolls.length; i++) { //绘制点击效果
        if(i>1000){
            srolls.splice(i, 1);
            continue;
        }
        let sroll = srolls[i]
        ctx.beginPath()
        ctx.arc(sroll.sx, sroll.sy, sroll.size, Math.PI * 2, false) //根据粒子属性画圆
        ctx.fillStyle = "rgba(" + sroll.color + "," + (sroll.life+50) / live + ")" //根据粒子属性设置填充颜色及透明度
        ctx.fill() //填充颜色
        sroll.sx += sroll.vx * 10
        sroll.sy += sroll.vy * 10
        sroll.life--
        if (sroll.life <= 0) {
            if(sroll.life2==2){
                srolls.push({
                    sx: sroll.sx,
                    sy: sroll.sy,
                    vx:-sroll.vx*5, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
                    vy:-sroll.vy*5,
//                    vx: (mx-sroll.sx)/200, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
//                    vy: (my-sroll.sy)/200,
                    life: live*2/5,
                    life2:1,
                    color:sroll.color,
                    size:5,
                    rt:0
                })
            }
            if(sroll.life2==1){
                if(Math.random()>0.5){
        points.push({
            sx: sroll.sx, //鼠标当前坐标作为粒子坐标
            sy: sroll.sy,
            vx: 5, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
            vy: 0,
            life: live, //存活周期
            life2:1,
            color: colors[parseInt(Math.random() * colors.length)], //随机选择颜色
            size: 7, //随机粒子尺寸，取值范围为0~5
            rt:0 //随机粒子尺寸，取值范围为0~5
        })
        points.push({
            sx: sroll.sx, //鼠标当前坐标作为粒子坐标
            sy: sroll.sy,
            vx: -5, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
            vy: 0,
            life: live, //存活周期
            life2:1,
            color: colors[parseInt(Math.random() * colors.length)], //随机选择颜色
            size: 7, //随机粒子尺寸，取值范围为0~5
            rt:0 //随机粒子尺寸，取值范围为0~5
        })
        points.push({
            sx: sroll.sx, //鼠标当前坐标作为粒子坐标
            sy: sroll.sy,
            vx:0, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
            vy: 5,
            life: live, //存活周期
            life2:1,
            color: colors[parseInt(Math.random() * colors.length)], //随机选择颜色
            size: 7, //随机粒子尺寸，取值范围为0~5
            rt:0 //随机粒子尺寸，取值范围为0~5
        })
        points.push({
            sx: sroll.sx, //鼠标当前坐标作为粒子坐标
            sy: sroll.sy,
            vx: 0, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
            vy:-5,
            life: live, //存活周期
            life2:1,
            color: colors[parseInt(Math.random() * colors.length)], //随机选择颜色
            size: 7, //随机粒子尺寸，取值范围为0~5
            rt:0 //随机粒子尺寸，取值范围为0~5
        })
                }
                else{
        points.push({
            sx: sroll.sx, //鼠标当前坐标作为粒子坐标
            sy: sroll.sy,
            vx: 5, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
            vy: 5,
            life: live, //存活周期
            life2:1,
            color: colors[parseInt(Math.random() * colors.length)], //随机选择颜色
            size: 7, //随机粒子尺寸，取值范围为0~5
            rt:0 //随机粒子尺寸，取值范围为0~5
        })
        points.push({
            sx: sroll.sx, //鼠标当前坐标作为粒子坐标
            sy: sroll.sy,
            vx: -5, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
            vy: 5,
            life: live, //存活周期
            life2:1,
            color: colors[parseInt(Math.random() * colors.length)], //随机选择颜色
            size: 7, //随机粒子尺寸，取值范围为0~5
            rt:0 //随机粒子尺寸，取值范围为0~5
        })
        points.push({
            sx: sroll.sx, //鼠标当前坐标作为粒子坐标
            sy: sroll.sy,
            vx:5, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
            vy: -5,
            life: live, //存活周期
            life2:1,
            color: colors[parseInt(Math.random() * colors.length)], //随机选择颜色
            size: 7, //随机粒子尺寸，取值范围为0~5
            rt:0 //随机粒子尺寸，取值范围为0~5
        })
        points.push({
            sx: sroll.sx, //鼠标当前坐标作为粒子坐标
            sy: sroll.sy,
            vx: -5, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
            vy:-5,
            life: live, //存活周期
            life2:1,
            color: colors[parseInt(Math.random() * colors.length)], //随机选择颜色
            size: 7, //随机粒子尺寸，取值范围为0~5
            rt:0 //随机粒子尺寸，取值范围为0~5
        })
                }
            }
            srolls.splice(i, 1)
        }
    }
    }
    cnt++;
    if(cnt%50<t){
        srolls.push({
                    sx: rx,
                    sy: ry,
                    vx: (mx-rx)/200, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
                    vy: (my-ry)/200,
                    life: live*2/5,
                    life2:1,
                    color:colors[parseInt(Math.random() * colors.length)],
                    size:10
                })
    }
    if(cnt==tt){
        t++;
        tt-=50;
        if(tt==0){
            tt=100;
        }
        cnt=0;
        for (var i = 0; i < 15; i++) { //添加15个粒子
        points.push({
            sx: mx, //鼠标当前坐标作为粒子坐标
            sy:my,
            vx: 1.5 - Math.random()*3, //x轴及y轴的移动向量，取值范围为-0.5 ~ 0.5
            vy: 1.5 - Math.random()*3,
            life: live, //存活周期
            life2:3,
            color: colors[parseInt(Math.random() * colors.length)], //随机选择颜色
            size:8, //随机粒子尺寸，取值范围为0~5
            rt:0
        })
    }
    }
}
setInterval(drawpoints, 20) //20毫秒绘制一次
    // Your code here...
})();
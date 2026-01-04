// ==UserScript==
// @name        全屏蛛网特效
// @namespace   Violentmonkey Scripts
// @match       *://*/**
// @icon        https://images.icon-icons.com/4241/PNG/96/cardano_ada_crypto_icon_264359.png
// @grant       none
// @version     1.0
// @author      Gallcha
// @license     MIT
// @description 2025/4/21 16:51:42
// @downloadURL https://update.greasyfork.org/scripts/533571/%E5%85%A8%E5%B1%8F%E8%9B%9B%E7%BD%91%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/533571/%E5%85%A8%E5%B1%8F%E8%9B%9B%E7%BD%91%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==
(function () {
    //创建canvas元素，并设置canvas元素的id
    var canvas = document.createElement("canvas"),
    attr = getAttr(),
    canva_id = "c_n" + attr.length,
    context = canvas.getContext("2d"),
    // r, n, m = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (i) {
    //     window.setTimeout(i, 1000 / 45)
    // },
    //各个浏览器支持的requestAnimationFrame有所不同，兼容各个浏览器
    animation = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (i) {
        window.setTimeout(i, 1000 / 45)
    },
    random = Math.random,
    mouse = {
        x: null,
        y: null,
        max: 20000
    },
    circles = [];//存放小方块

    //设置创建的canvas的相关属性
    canvas.id = canva_id;
    canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + attr.z + ";opacity:" + attr.opacity;
    //将canvas元素添加到body元素中
    document.getElementsByTagName("body")[0].appendChild(canvas);
    //该函数设置了canvas元素的width属性和height属性
    getWindowWH();
    //onresize 事件会在窗口或框架被调整大小时发生
    //此处即为当窗口大小改变时，重新获取窗口的宽高和设置canvas元素的宽高
    window.onresize = getWindowWH;

    // //返回元素的属性值，若不存在返回i
    // function mygetAttribute(element, property, init) {
    //     //getAttribute() 方法返回指定属性名的属性值
    //     return element.getAttribute(property) || init;
    // }

    //返回包含所有i标签元素的数组
    // function j(tag) {
    //     return document.getElementsByTagName(tag);
    // }

    //该函数会得到引用了本文件的script元素，
    //因为本文件中在赋值时执行了一次getScript函数，html文件引用本文件时，本文件之后的script标签还没有被浏览器解释，
    //所以得到的script数组中，引用了本文的script元素在该数组的末尾
    //该函数的用意为使开发者能直接修改在html中引入该文件的script元素的属性来修改画布的一些属性，画布z-index，透明度和小方块数量，颜色
    //与前面往body元素添加canvas元素的代码配合，当开发者想要使用该特效作为背景时，只需在html文件中添加script元素并引用本文件即可
    function getAttr() {
        var i = document.getElementsByTagName("script"),
            w = i.length,
            v = i[w - 1];//v为最后一个script元素，即引用了本文件的script元素
        // return {
        //     l: w,
        //     z: mygetAttribute(v, "zIndex", -1),
        //     o: mygetAttribute(v, "opacity", 9),
        //     c: mygetAttribute(v, "color", "200,200,200"),
        //     count: mygetAttribute(v, "count", 150)
        // }
        return {
            length: w,
            z: v.getAttribute("zIndex") || -1,
            opacity: v.getAttribute("opacity") || 9,
            color: v.getAttribute("color") || "200,200,200",
            count: v.getAttribute("count") || 150
        }
    }

    function getWindowWH() {
        W = canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        H = canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }

    function draw() {
        context.clearRect(0, 0, W, H);
        var w = [mouse].concat(circles);//连接(合并)鼠标小方块数组和其他小方块数组
        var x, v, A, B, z, y;


        //circle属性表：x，y，xa，ya，max
        circles.forEach(function (i) {
            i.x += i.xa;
            i.y += i.ya;

            // 控制小方块移动方向
            // 当小方块达到窗口边界时，反向移动
            // i.xa *= i.x > W || i.x < 0 ? -1 : 1;
            // i.ya *= i.y > H || i.y < 0 ? -1 : 1;
            i.xa = i.xa * (i.x > W || i.x < 0 ? -1 : 1);
            i.ya = i.ya * (i.y > H || i.y < 0 ? -1 : 1);

            //前两个参数为矩形左上角的x，y坐标，后两个分别为宽度和高度
            //绘制小方块
            context.fillRect(i.x - 0.5, i.y - 0.5, 1, 1);

            //遍历w中所有元素
            for (v = 0; v < w.length; v++) {
                //以下代码利用x小方块来限制i小方块
                x = w[v];
                //如果x与i不是同一个对象实例且x的xy坐标存在
                if (i !== x && null !== x.x && null !== x.y) {
                    B = i.x - x.x;//i和x的x坐标差
                    z = i.y - x.y;//i和x的y坐标差
                    y = B * B + z * z;//斜边平方
                    // y < x.max && (
                    //     x === f && y >= x.max / 2 && (i.x -= 0.03 * B, i.y -= 0.03 * z),
                    //     A = (x.max - y) / x.max,
                    //     context.beginPath(),
                    //     context.lineWidth = A / 2,
                    //     context.strokeStyle = "rgba(" + s.c + "," + (A + 0.2) + ")",
                    //     context.moveTo(i.x, i.y),
                    //     context.lineTo(x.x, x.y),
                    //     context.stroke()
                    // )
                    if(y < x.max){
                        //使i小方块受鼠标小方块束缚，即如果i小方块与鼠标小方块距离过大，i小方块会被鼠标小方块束缚
//此处的数量关系有点研究
                        if(x === mouse && y > x.max/2){
                            i.x -= 0.03 * B;
                            i.y -= 0.03 * z;
                        }
                       // x === f && y >= x.max / 2 && (i.x -= 0.03 * B, i.y -= 0.03 * z),
                        A = (x.max - y) / x.max;
                        context.beginPath();
                        //设置画笔的画线的粗细与两个小方块的距离相关，范围0-0.5，两个小方块距离越远画线越细，达到max时画线消失
                        context.lineWidth = A / 2;
                        //设置画笔的画线颜色为s.c即画布颜色，透明度为(A+0.2)即两个小方块距离越远画线越淡
                        context.strokeStyle = "rgba(" + attr.color + "," + (A + 0.2) + ")";
                        //设置画笔的笔触为i小方块
                        context.moveTo(i.x, i.y);
                        //使画笔的笔触移动到x小方块
                        context.lineTo(x.x, x.y);
                        //完成画线的绘制，即绘制连接小方块的线
                        context.stroke();
                    }
                }
            }
            //把i小方块从w数组中去掉
            //防止两个小方块重复连线
            w.splice(w.indexOf(i), 1);
        });

        //window.requestAnimationFrame与setTimeout相似，形成递归调用，不过window.requestAnimationFrame采用系统时间间隔，保持最佳绘制效率,提供了更好地优化，使动画更流畅
        //经过浏览器优化，动画更流畅；
        //窗口没激活时，动画将停止，省计算资源;
        animation(draw);
        // setTimeout(function () {
        //     b()
        // }, 30)

    }



    // var canvas = document.createElement("canvas"),
    //     s = acanva(),
    //     canva_id = "c_n" + s.l,
    //     context = canvas.getContext("2d"),
    //     // r, n, m = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (i) {
    //     //     window.setTimeout(i, 1000 / 45)
    //     // },
    //     animation = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (i) {
    //         window.setTimeout(i, 1000 / 45)
    //     },
    //     random = Math.random,
    //     mouse = {
    //         x: null,
    //         y: null,
    //         max: 20000
    //     };


    // canvas.id = canva_id;
    // canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + script.z + ";opacity:" + script.opacity;
    // document.getElementsByTagName("body")[0].appendChild(canvas);
    // getWindowWH();
    // window.onresize = getWindowWH;

    //获取鼠标所在坐标
    window.onmousemove = function (i) {
        //i为W3C DOM，window.event 为 IE DOM，以实现兼容IE
        //不过目前似乎IE已经支持W3C DOM，我用的是IE11，我注释掉下一句代码也能实现鼠标交互效果，
        //网上说7/8/9是不支持的，本人没有试验，
        //当然加上是没有错的
        i = i || window.event;
        mouse.x = i.clientX;
        mouse.y = i.clientY;
    }

    window.onmouseout = function () {
        mouse.x = null;
        mouse.y = null;
    }

    for(let p = 0; p < attr.count; p ++){
    // for (var circles = [], p = 0; p < s.count; p++) {
        var circle_x = random() * W,//横坐标
            circle_y = random() * H,//纵坐标
            circle_xa = 2 * random() - 1,//x轴位移
            circle_ya = 2 * random() - 1;//y轴位移
        circles.push({
            x: circle_x,
            y: circle_y,
            xa: circle_xa,
            ya: circle_ya,
            max: 6000
        })
    }

    //此处是等待0.1秒后，执行一次b()，真正的动画效果是用window.requestAnimationFrame实现的
    setTimeout(function () {
        draw();
    }, 100)

}());
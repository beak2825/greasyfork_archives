// ==UserScript==
// @name         新年烟花背景（掘金适配）
// @version      1.1.3
// @description  修改页面的背景，使用 canvas 播放动画
// @match        https://juejin.cn/**
// @run-at       document-end
// @icon         https://img2.baidu.com/it/u=4226010475,2406859093&fm=26&fmt=auto
// @namespace    https://greasyfork.org/users/8239221
// @downloadURL https://update.greasyfork.org/scripts/438337/%E6%96%B0%E5%B9%B4%E7%83%9F%E8%8A%B1%E8%83%8C%E6%99%AF%EF%BC%88%E6%8E%98%E9%87%91%E9%80%82%E9%85%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/438337/%E6%96%B0%E5%B9%B4%E7%83%9F%E8%8A%B1%E8%83%8C%E6%99%AF%EF%BC%88%E6%8E%98%E9%87%91%E9%80%82%E9%85%8D%EF%BC%89.meta.js
// ==/UserScript==
{
    let canvas = document.createElement('canvas');
    canvas.id = 'jj-fire-canvas';
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    canvas.style.cssText = `background: #0001;
         left: 0;
         top: 0;
         position: fixed;
         z-index: -1;`
    document.body.appendChild(canvas)
    // 抓取页面元素，确定烟花可用区域
    let bodyW =  960;//document.getElementById('juejin').getElementsByTagName('div')[0].offsetWidth;
    let browerW = window.innerWidth;
    
    function ramdonX(browerW, bodyW) {
        let diff = parseInt((browerW - bodyW) / 2);
        let x = Math.floor(Math.random() * diff);
        return Math.random() > 0.5 ? x : (browerW - x);
    }
    let rgb = function() {
        let str = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
        return {
            ramdon() {
                let color = '#';
                for (let i = 0; i < 6; i++) {
                    color += str[parseInt(Math.floor(Math.random() * 16))]
                }
                return color;
            }
        }
    }();
    let cx = document.getElementById('jj-fire-canvas').getContext('2d')
    cx.strokeStyle = '#fff'
    cx.fillStyle = '#fff'
    cx.lineWidth = 10;
    let hz = 1000 / 75;
    let max = 8;
    // cx.fillRect(100,100,100,100)
    // drawLine(cx, 10, 10, 100, 20)
    // drawArc(100, 100, 20)
    // 等待一下dom 加载
        setTimeout(init,500);
        // init();
    
    function init() {
        setTimeout(() => {
            init();
        }, Math.random() * 2500 + 500);
        fireUp(4);
    }
    // fireUp(3)
    let cleanT = setInterval(() => clean(), hz * 1.2);
    
    function fireUp(r) {
            if (max <= 0) return;
            let ys = Math.random() * 6 + 2;
            let color = rgb.ramdon();
            max--;
            let x = ramdonX(browerW, bodyW)
            let y = window.innerHeight;
            ramdomTop = parseInt(Math.random() * 500) + 100;
            let time = setInterval(() => {
                if (y < ramdomTop) {
                    clearInterval(time);
                    drawFiresInRound(x, y);
                    fireUp(r);
                }
                y -= ys;
                // drawArc(x, y, r)
                drawPoint(new Point(x, y, r, color))
            }, hz);

            function drawFiresInRound(x, y) {
                // 根据三角函数计算 x，y

                let arrs = caculatePoints(x, y);
                let time = setInterval(() => {
                    if (arrs.length <= 0) {
                        clearInterval(time);
                        max++;
                        return;
                    }
                    let p = arrs.shift();
                    p.forEach(n => drawPoint(n))
                }, hz);
            }
        }
        // 计算四周的点位数据
        function caculatePoints(px, py) {
            let maxR = parseInt(Math.random() * 40) + 20; // 扩散的半径
            /**
             * [p1-x]
             * [p2-x]
             */
            step = Math.floor(Math.random() * 5) + 10;
            let arrs = [];
            for (let i = step; i <= 360; i += step) {
                arrs.push(new Point(Math.cos(Math.PI / 180 * i).toFixed(4),
                    Math.sin(Math.PI / 180 * i).toFixed(4),
                    2,
                    rgb.ramdon()));
            }
            let randomR = arrs.map(n => Number(Math.random() * 0.4 + 0.8).toFixed(2)).map(n => n ** 3)
            let arrs2 = [];
            for (let i = 1; i < maxR; i++) {
                let j = 0;
                arrs2.push(arrs.map(n => new Point(n.x * i * 1.8 + px,
                    n.y * i * 1.5 + py + parseInt(randomR[j++]) * (i ** 1.05),
                    n.r, n.color)));
            }
            return arrs2;
        }
    
    function Point(x, y, r = 2, color = '#fff') {
        return {
            x: x,
            y: y,
            r: r,
            color: color
        }
    }
    
    function clean() {
        let max = 5000;
        let defaultFillStyle = cx.fillStyle;
        cx.fillStyle = '#0002'
        cx.beginPath();
        cx.fillRect(-max, -max, 2 * max, 2 * max);
        cx.fillStyle = defaultFillStyle;
    }
    
    function drawPoint(p) {
        let oldColor = cx.fillStyle;
        cx.fillStyle = p.color;
        cx.beginPath();
        cx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        cx.fill();
        cx.fillStyle = oldColor;
    }
    
    function drawArc(x, y, r) {
        cx.beginPath();
        cx.arc(x, y, r, 0, 2 * Math.PI);
        cx.fill();
    }
    
    function drawLine(startX, startY, endX, endY) {
        cx.beginPath();
        cx.moveTo(startX, startY);
        cx.lineTo(endX, endY);
        cx.stroke();
        cx.closePath()
    }
}

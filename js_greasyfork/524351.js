// ==UserScript==
// @name         click beatiful
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  会在你点击鼠标时生成特效，并且会持续生成流星雨特效，美观又时尚(如果出现bug，请打开开发人员模式)
// @author       BarkFlorr
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524351/click%20beatiful.user.js
// @updateURL https://update.greasyfork.org/scripts/524351/click%20beatiful.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 从 localStorage 中读取之前保存的值，如果没有则使用初始值
    let sz1 = localStorage.getItem('sz1') || 32;
    let sz2 = localStorage.getItem('sz2') || 10;
    let sz3 = localStorage.getItem('sz3') || 15;
    let sz4 = localStorage.getItem('sz4') || 1;

    function clickEffect() {
        let balls = [];
        let longPressed = false;
        let longPress;
        let multiplier = 0;
        let width, height;
        let origin;
        let normal;
        let ctx;
        const colours = ["#F73859", "#14FFEC", "#00E0FF", "#FF99FE", "#FAF15D", "#FFF00", "#00FFFF"];
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        canvas.setAttribute("style", "width: 100%; height: 100%; top: 0; left: 0; z-index: 99999; position: fixed; pointer-events: none;");
        const pointer = document.createElement("span");
        pointer.classList.add("pointer");
        pointer.style.position = 'fixed';
        pointer.style.width = '20px';
        pointer.style.height = '20px';
        pointer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        pointer.style.borderRadius = '50%';
        pointer.style.pointerEvents = 'none';
        document.body.appendChild(pointer);

        if (canvas.getContext && window.addEventListener) {
            ctx = canvas.getContext("2d");
            updateSize();
            window.addEventListener('resize', updateSize, false);
            loop();
            addEventListeners();
        } else {
            console.log("canvas or addEventListener is unsupported!");
            showError('canvas或addEventListener不支持');
        }

        function addEventListeners() {
            window.addEventListener("mousedown", function(e) {
                pushBalls(randBetween(sz2, sz3), e.clientX, e.clientY);
                document.body.classList.add("is-pressed");
                longPress = setTimeout(function(){
                    document.body.classList.add("is-longpress");
                    longPressed = true;
                }, 500);
            }, false);
            window.addEventListener("mouseup", function(e) {
                clearInterval(longPress);
                if (longPressed == true) {
                    document.body.classList.remove("is-longpress");
                    pushBalls(randBetween(50 + Math.ceil(multiplier), 100 + Math.ceil(multiplier)), e.clientX, e.clientY);
                    longPressed = false;
                }
                document.body.classList.remove("is-pressed");
            }, false);
        }

        function updateSize() {
            canvas.width = window.innerWidth * 2;
            canvas.height = window.innerHeight * 2;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.scale(2, 2);
            width = (canvas.width = window.innerWidth);
            height = (canvas.height = window.innerHeight);
            origin = {
                x: width / 2,
                y: height / 2
            };
            normal = {
                x: width / 2,
                y: height / 2
            };
        }

        class Ball {
            constructor(x = origin.x, y = origin.y) {
                this.x = x;
                this.y = y;
                this.angle = Math.random() * 2 * Math.PI;
                if (longPressed == true) {
                    this.multiplier = randBetween(14 + multiplier, 15 + multiplier);
                } else {
                    this.multiplier = randBetween(6, 12);
                }
                this.vx = ((this.multiplier + Math.random()) * Math.cos(this.angle))*sz4;
                this.vy = ((this.multiplier + Math.random()) * Math.sin(this.angle))*sz4;
                this.r = randBetween(4, 0);
                this.color = colours[Math.floor(Math.random() * colours.length)];
            }

            update() {
                this.x += this.vx - normal.x;
                this.y += this.vy - normal.y;
                normal.x = -2 / window.innerWidth * Math.sin(this.angle);
                normal.y = -2 / window.innerHeight * Math.cos(this.angle);
                this.vx *= 1;
                this.vy *= 1;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
                ctx.fill();
            }
        }

        function pushBalls(count = 1, x = origin.x, y = origin.y) {
            for (let i = 0; i < count; i++) {
                balls.push(new Ball(x, y));
            }
        }

        function randBetween(min, max) {
            return Math.floor(Math.random() * max) + min;
        }

        function loop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < balls.length; i++) {
                let b = balls[i];
                if (b.r < 0) continue;
                b.draw();
                b.update();
            }
            if (longPressed == true) {
                multiplier += 0.2;
            } else if (!longPressed && multiplier >= 0) {
                multiplier -= 0.4;
            }
            removeBall();
            requestAnimationFrame(loop);
        }

        function removeBall() {
            for (let i = 0; i < balls.length; i++) {
                let b = balls[i];
                if (b.x + b.r < 0 || b.x - b.r > width || b.y + b.r < 0 || b.y - b.r > height || b.r < 0) {
                    balls.splice(i, 1);
                }
            }
        }

        function pushBallsFromTopLeft() {
            let x = randBetween(0, width);
            let y = randBetween(0, height);
            let xxx = randBetween(0, 2);
            if(xxx==0) x=0;
            else y=0;
            let angle = Math.atan2(height, width);
            let ball = new Ball(x, y);
            ball.vx = ((ball.multiplier + Math.random()) * Math.cos(angle))*sz4;
            ball.vy = ((ball.multiplier + Math.random()) * Math.sin(angle))*sz4;
            balls.push(ball);
        }

        let meteorInterval;
        function startMeteorEffect() {
            meteorInterval = setInterval(() => {
                requestAnimationFrame(pushBallsFromTopLeft);
            }, sz1);
        }

        startMeteorEffect();

        function showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.style.position = 'fixed';
            errorDiv.style.top = '10px';
            errorDiv.style.left = '10px';
            errorDiv.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
            errorDiv.style.color = 'white';
            errorDiv.style.padding = '10px';
            errorDiv.style.zIndex = '100000';
            errorDiv.textContent = message;
            document.body.appendChild(errorDiv);
        }

        // 创建并添加设置按钮
        const settingsButton = document.createElement('button');
        settingsButton.textContent = 'click beautiful设置';
        settingsButton.style.position = 'fixed';
        settingsButton.style.top = '10px';
        settingsButton.style.left = '10px';
        settingsButton.style.zIndex = '100000';
        document.body.appendChild(settingsButton);

        // 为设置按钮添加点击事件
        settingsButton.addEventListener('click', function() {
            // 使用 prompt 对话框让用户输入新的值
            const newSz1 = prompt('请输入流星雨生成间隔（单位：毫秒）', sz1);
            const newSz2 = prompt('请输入点击时小球生成的数量下限', sz2);
            const newSz3 = prompt('请输入点击时小球生成的数量上限', sz3);
            const newSz4 = prompt('请输入小球移动速度', sz4);
            if (newSz1!== null) {
                sz1 = parseFloat(newSz1);
                localStorage.setItem('sz1', sz1);
            }
            if (newSz2!== null) {
                sz2 = parseFloat(newSz2);
                localStorage.setItem('sz2', sz2);
            }
            if (newSz3!== null) {
                sz3 = parseFloat(newSz3);
                localStorage.setItem('sz3', sz3);
            }
            if (newSz4!== null) {
                sz4 = parseFloat(newSz4);
                localStorage.setItem('sz4', sz4);
            }
            // 重启流星雨特效
            clearInterval(meteorInterval);
            startMeteorEffect();
        });
    }

    clickEffect();
})();
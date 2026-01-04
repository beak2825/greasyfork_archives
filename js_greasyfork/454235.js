// ==UserScript==
// @name         手电筒
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  模拟手电筒
// @author       伟大大
// @match        *
// @match        */*
// @match        */*/*
// @icon         https://s1.ax1x.com/2022/11/07/xj7TVf.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454235/%E6%89%8B%E7%94%B5%E7%AD%92.user.js
// @updateURL https://update.greasyfork.org/scripts/454235/%E6%89%8B%E7%94%B5%E7%AD%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 手电筒开启状态
    let falg = false;

    // 添加按钮
    let Container = document.createElement('div');
    Container.id = "sp-ac-container";
    Container.style.position="fixed"
    Container.style.top="40px"
    Container.style['z-index']="999999"
    Container.innerHTML =`<svg t="1667792255654" width="50" height="50" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1741" width="200" height="200"><path d="M440.3 260.7c38.8-38.8 101.8-38.8 140.6 0" fill="#FFEB99" p-id="1742"></path><path d="M580.8 265.7c-1.3 0-2.6-0.5-3.5-1.5-17.8-17.8-41.5-27.7-66.8-27.7-25.2 0-48.9 9.8-66.8 27.7-2 2-5.1 2-7.1 0s-2-5.1 0-7.1c19.7-19.7 45.9-30.6 73.8-30.6s54.1 10.9 73.8 30.6c2 2 2 5.1 0 7.1-0.8 1-2.1 1.5-3.4 1.5z" fill="#5553AA" p-id="1743"></path><path d="M565.7 826.4H455.4c-19.1 0-34.5-15.4-34.5-34.5v-41.4h179.4v41.4c-0.1 19-15.5 34.5-34.6 34.5z" fill="#B5DDFF" p-id="1744"></path><path d="M565.7 831.4H455.4c-21.8 0-39.5-17.7-39.5-39.5v-41.4c0-2.8 2.2-5 5-5h179.4c2.8 0 5 2.2 5 5v41.4c-0.1 21.8-17.8 39.5-39.6 39.5z m-139.8-75.9v36.4c0 16.3 13.2 29.5 29.5 29.5h110.4c16.3 0 29.5-13.2 29.5-29.5v-36.4H425.9z" fill="#5553AA" p-id="1745"></path><path d="M620.1 455H401c-27.6 0-50-22.4-50-50V285c0-13.4 10.9-24.3 24.3-24.3h270.4c13.4 0 24.3 10.9 24.3 24.3v120c0.1 27.6-22.3 50-49.9 50z" fill="#FFEB99" p-id="1746"></path><path d="M620.1 460H401c-30.3 0-55-24.7-55-55V285c0-16.2 13.2-29.3 29.3-29.3h270.4c16.2 0 29.3 13.2 29.3 29.3v120c0.1 30.3-24.6 55-54.9 55zM375.3 265.7c-10.7 0-19.3 8.7-19.3 19.3v120c0 24.8 20.2 45 45 45h219.1c24.8 0 45-20.2 45-45V285c0-10.7-8.7-19.3-19.3-19.3H375.3z" fill="#5553AA" p-id="1747"></path><path d="M620.1 455H401c-27.6 0-50-22.4-50-50v-5.2h319.1v5.2c0 27.6-22.4 50-50 50z" fill="#B5DDFF" p-id="1748"></path><path d="M620.1 460H401c-30.3 0-55-24.7-55-55v-5.2c0-2.8 2.2-5 5-5h319.1c2.8 0 5 2.2 5 5v5.2c0 30.3-24.7 55-55 55zM356 404.8v0.2c0 24.8 20.2 45 45 45h219.1c24.8 0 45-20.2 45-45v-0.2H356z" fill="#5553AA" p-id="1749"></path><path d="M420.9 455h179.4v305.9H420.9z" fill="#B5DDFF" p-id="1750"></path><path d="M600.2 765.9H420.9c-2.8 0-5-2.2-5-5V455c0-2.8 2.2-5 5-5h179.4c2.8 0 5 2.2 5 5v305.9c-0.1 2.7-2.3 5-5.1 5z m-174.3-10h169.4V460H425.9v295.9z" fill="#5553AA" p-id="1751"></path><path d="M533.3 530.9V549c0 11.6-9.5 21-21 21h-3.5c-11.6 0-21-9.5-21-21v-18.1c0-11.6 9.5-21 21-21h3.5c11.6 0 21 9.4 21 21z" fill="#FFFFFD" p-id="1752"></path><path d="M512.3 575.1h-3.5c-14.4 0-26-11.7-26-26V531c0-14.4 11.7-26 26-26h3.5c14.4 0 26 11.7 26 26v18c0 14.4-11.6 26.1-26 26.1z m-3.5-60.2c-8.8 0-16 7.2-16 16V549c0 8.8 7.2 16 16 16h3.5c8.8 0 16-7.2 16-16v-18.1c0-8.8-7.2-16-16-16h-3.5z" fill="#5553AA" p-id="1753"></path><path d="M533.3 506.2v18.1c0 11.6-9.5 21-21 21h-3.5c-11.6 0-21-9.5-21-21v-18.1c0-11.6 9.5-21 21-21h3.5c11.6-0.1 21 9.4 21 21z" fill="#FFEB99" p-id="1754"></path><path d="M512.3 550.3h-3.5c-14.4 0-26-11.7-26-26v-18.1c0-14.4 11.7-26 26-26h3.5c14.4 0 26 11.7 26 26v18.1c0 14.4-11.6 26-26 26z m-3.5-60.2c-8.8 0-16 7.2-16 16v18.1c0 8.8 7.2 16 16 16h3.5c8.8 0 16-7.2 16-16v-18.1c0-8.8-7.2-16-16-16h-3.5z" fill="#5553AA" p-id="1755"></path><path d="M495.3 720.5c-2.8 0-5-2.2-5-5V608.1c0-2.8 2.2-5 5-5s5 2.2 5 5v107.4c0 2.8-2.2 5-5 5zM525.8 720.5c-2.8 0-5-2.2-5-5V608.1c0-2.8 2.2-5 5-5s5 2.2 5 5v107.4c0 2.8-2.3 5-5 5z" fill="#5553AA" p-id="1756"></path><path d="M556.4 792.8h-91.8c-2.8 0-5-2.2-5-5s2.2-5 5-5h91.8c2.8 0 5 2.2 5 5s-2.2 5-5 5zM614.1 245.5c-1.3 0-2.6-0.5-3.5-1.5-55.2-55.2-144.9-55.2-200.1 0-2 2-5.1 2-7.1 0s-2-5.1 0-7.1c28.6-28.6 66.6-44.4 107.1-44.4s78.5 15.8 107.1 44.4c2 2 2 5.1 0 7.1-0.9 1-2.2 1.5-3.5 1.5z" fill="#5553AA" p-id="1757"></path></svg>`

    //绑定按键点击功能
	Container.onclick = function (){
		main.entrance();
		return;
	};

    // 追加
    document.body.appendChild(Container);

    let main = {
        entrance(){
            if (falg) {
                this.close();
                falg = false;
            } else {
                this.open();
                falg = true;
            }
        },
        open(){
            document.body.appendChild(document.createElement('style'))
            document.querySelector('style').append(`canvas {position: fixed;left:0;top: 0;z-index: 9999;pointer-events: none;}`)
            document.body.appendChild(document.createElement('canvas'))
            const cvs = document.querySelector('canvas')
            const ctx = cvs.getContext('2d')
            cvs.width = document.documentElement.clientWidth
            cvs.height = document.documentElement.clientHeight
            const p = {
                x: 0,
                y: 0,
                r: 80
            }
            document.onmousemove = e => {
                p.x = e.clientX
                p.y = e.clientY
                render()
            }
            const render = () => {
                ctx.beginPath()
                ctx.clearRect(0, 0, cvs.width, cvs.height)
                var radial = ctx.createRadialGradient(p.x,p.y,p.r,p.x,p.y,p.r * 3);
                radial.addColorStop(0,'rgba(255, 255, 255, 0)');
                radial.addColorStop(1,'rgba(0, 0, 0, 0.5)');
                ctx.fillStyle = radial;
                ctx.fillRect(0,0,cvs.width, cvs.height);
            }
            render()
            window.onresize = () => {
                cvs.width = document.documentElement.clientWidth
                cvs.height = document.documentElement.clientHeight
                render()
            }
        },
        close(){
          document.querySelector('canvas').remove()
          document.querySelector('style').remove('canvas')
        }
    };

})();
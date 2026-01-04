// ==UserScript==
// @name        Bilibili视频变速
// @namespace   Violentmonkey Scripts
// @match       *://www.bilibili.com/video/*
// @grant       none
// @version     1.0
// @author      MaskZ
// @description 1/20/2022, 4:50:37 PM
// @downloadURL https://update.greasyfork.org/scripts/438902/Bilibili%E8%A7%86%E9%A2%91%E5%8F%98%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/438902/Bilibili%E8%A7%86%E9%A2%91%E5%8F%98%E9%80%9F.meta.js
// ==/UserScript==
var box = document.createElement('div');
        box.id = 'C_box';
        box.style.width = '60px';
        box.style.height = '390px';
        box.style.backgroundColor = '#ccc';
        box.style.position = 'fixed';
        box.style.top = '200px';
        box.style.left = '10px';
        document.body.appendChild(box);
        // console.log(box);
        for (var i = 0; i < 6; i++) {
            var tmp = document.createElement('div');
            tmp.className = 'unit';
            tmp.style.width = '60px';
            tmp.style.height = '60px';
            tmp.style.backgroundColor = 'white';
            tmp.style.boxSizing = 'border-box'
            tmp.style.border = '2px solid #00b8f6';
            tmp.style.borderBottom = '0px';
            tmp.style.fontSize = '15px'
            tmp.style.fontFamily = '微软雅黑';
            tmp.style.paddingTop = '18px'
            switch (i) {
                case 0:
                    tmp.innerText = '2.5倍速';
                    tmp.onclick = function () {
                        clean_color();
                        this.style.color = 'white';
                        this.style.backgroundColor = '#00b8f6';
                        document.querySelector('video').playbackRate = 2.5;
                    }
                    break;
                case 1:
                    tmp.innerText = '2.8倍速';
                    tmp.onclick = function () {
                        clean_color();
                        this.style.color = 'white';
                        this.style.backgroundColor = '#00b8f6';
                        document.querySelector('video').playbackRate = 2.8;
                    }
                    break;
                case 2:
                    tmp.innerText = '3.0倍速';
                    tmp.onclick = function () {
                        clean_color();
                        this.style.color = 'white';
                        this.style.backgroundColor = '#00b8f6';
                        document.querySelector('video').playbackRate = 3.0;
                    }
                    break;
                case 3:
                    tmp.innerText = '3.2倍速';
                    tmp.onclick = function () {
                        clean_color();
                        this.style.color = 'white';
                        this.style.backgroundColor = '#00b8f6';
                        document.querySelector('video').playbackRate = 3.2;
                    }
                    break;
                case 4:
                    tmp.innerText = '3.5倍速';
                    tmp.onclick = function () {
                        clean_color();
                        this.style.color = 'white';
                        this.style.backgroundColor = '#00b8f6';
                        document.querySelector('video').playbackRate = 3.5;
                    }
                    break;
                case 5:
                    tmp.innerText = '4.0倍速';
                    tmp.style.borderBottom = '2px solid #00b8f6';
                    tmp.onclick = function () {
                        clean_color();
                        this.style.color = 'white';
                        this.style.backgroundColor = '#00b8f6';
                        document.querySelector('video').playbackRate = 4.0;
                    }
                    break;
            }
            box.appendChild(tmp);
        }
        var unit_list = document.getElementsByClassName('unit');
        // console.log(unit_list);
        for (var i = 0; i < unit_list.length; i++) {
            unit_list[i].onmouseover = function () {
                this.style.color = '#fc8bab';
            }
            unit_list[i].onmouseout = function () {
                if (this.style.color != 'white') {
                    this.style.color = 'black';
                }
            }
        }
        function clean_color() {
            var unit_list = document.getElementsByClassName('unit');
            for (var i = 0; i < unit_list.length; i++) {
                unit_list[i].style.color = 'black';
                unit_list[i].style.backgroundColor = 'white';
            }
        }

        var screen = document.createElement('div');
        screen.id = 'screen';
        screen.style.width = '60px';
        screen.style.height = '30px';
        // screen.innerText='倍速:1.0';
        console.log(screen);
        box.appendChild(screen);
        
        
         var timer = self.setInterval(function () {
            var state = document.querySelector('video').playbackRate;
            screen.innerText='倍速:'+state;
            clean_color();
            switch(state){
                case 2.5:
                unit_list[0].style.color = 'white';
                unit_list[0].style.backgroundColor = '#00b8f6';
                break;
                case 2.8:
                unit_list[1].style.color = 'white';
                unit_list[1].style.backgroundColor = '#00b8f6';
                break;
                case 3.0:
                unit_list[2].style.color = 'white';
                unit_list[2].style.backgroundColor = '#00b8f6';
                break;
                case 3.2:
                unit_list[3].style.color = 'white';
                unit_list[3].style.backgroundColor = '#00b8f6';
                break;
                case 3.5:
                unit_list[4].style.color = 'white';
                unit_list[4].style.backgroundColor = '#00b8f6';
                break;
                case 4.0:
                unit_list[5].style.color = 'white';
                unit_list[5].style.backgroundColor = '#00b8f6';
                break;
            }
        }
        , 500);
// ==UserScript==
// @name         冒险家pc按键辅助
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  pc按键辅助
// @author       RuoChen丶5251
// @match        *://www.seagame.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484186/%E5%86%92%E9%99%A9%E5%AE%B6pc%E6%8C%89%E9%94%AE%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/484186/%E5%86%92%E9%99%A9%E5%AE%B6pc%E6%8C%89%E9%94%AE%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个新的 div 元素
    let newDiv = document.createElement('div');
    newDiv.id = 'focus';
    newDiv.setAttribute('tabindex', '-1');
    document.body.appendChild(newDiv);
    // window.resizeTo(330, 600);window.moveTo(0, 900);
    // location.reload();
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // 阻止默认右键菜单
    });
    //按键辅助
    document.addEventListener('keypress', function(event){

        var status = getStatus();

        if(status==="mx"){
            if(event.key==='a'){
                var auto = document.querySelector("#game > div:nth-child(26) > span")
                auto.click();
                return;
            }
            if(event.key==='s'){
                eval('hero.useskill();');
                return;
            }
            if(event.key==='d'){
                var release = document.querySelector("#game > div:nth-child(27) > span")
                release.click();
                return;
            }

            //升级选择
            if(event.key==='r'){
                eval('hero.upgrade_select(1);');
                return;
            }
            if(event.key==='f'){
                eval('hero.upgrade_select(2);');
                return;
            }
            if(event.key==='v'){
                eval('hero.upgrade_select(3);');
                return;
            }

            //使用物品
            if(event.key==='q'){
                eval('items.useitem(1)');
                return;
            }
            if(event.key==='w'){
                eval('items.useitem(2)');
                return;
            }
            if(event.key==='e'){
                eval('items.useitem(3)');
                return;
            }
            if(event.key==='z'){
                eval('items.useitem(4)');
                return;
            }
            if(event.key==='x'){
                eval('items.useitem(5)');
                return;
            }
            if(event.key==='c'){
                eval('items.useitem(6)');
                return;
            }
        }

        if(status==="jjc"){
            //竞技场投票

            if(event.key==='q'){
                eval('pk.buy0(1,10)');
                return;
            }
            if(event.key==='w'){
                eval('pk.buy0(1,100)');
                return;
            }
            if(event.key==='e'){
                eval('pk.buy0(1,300)');
                return;
            }
            if(event.key==='1'){
                eval('pk.buy0(2,10)');
                return;
            }
            if(event.key==='2'){
                eval('pk.buy0(2,100)');
                return;
            }
            if(event.key==='3'){
                eval('pk.buy0(2,300)');
                return;
            }
        }

    }, true);
    document.addEventListener('mousedown', function(event){

        var status = getStatus();

        if(status==="mx"){
            setTimeout(function() {
                var buttons = document.querySelectorAll('button');

                if(event.button === 1){
                    buttons.forEach(function(button) {
                        if (button.textContent.trim().includes("攻击力")||button.textContent.trim().includes("反伤")) {
                            var count=0;
                            var wi50 = setInterval(function() {
                                count++;

                                button.click();
                                if (count >= 250) {
                                    clearInterval(wi50); // 停止循环
                                }
                            }, 100); // 100 毫秒间隔
                            return; // 结束循环
                        }

                    });
                }
                else if(event.button === 0){
                    buttons.forEach(function(button) {
                        if (button.textContent.trim() === "移动"||button.textContent.trim() === "献血"||button.textContent.trim() === "魔法券买宝物") {
                            button.click();
                            return; // 结束循环
                        }

                    });
                }
                else if(event.button === 2){
                    buttons.forEach(function(button) {
                        if (button.textContent.trim() === "卖掉") {
                            button.click();
                            return; // 结束循环
                        }

                    });
                }
            }, 1000);

        }


    }, true);
    setInterval(function() {
        var status = getStatus();
        console.log(status);
        if(status==="lt"||status==="zb"){
            return;
        }
        document.getElementById('focus').focus();
    }, 1000); // 时间间隔为 1000 毫秒，即 1 秒
    function getStatus(){

        var lt = document.querySelector("#chatbox");
        var inputField = document.querySelector('input[type="text"], input[type="password"]');
        var inputbox = document.querySelector('.inputbox');
        if (lt !== null||inputField!==null||inputbox!==null) return "lt";

        var zb = document.querySelector("body > div:nth-child(85) > div:nth-child(1) > div > table > tbody > tr > td > table > tbody > tr > td > p:nth-child(2) > select")
        if(zb!==null) return "zb";

        var skill = document.querySelector("#game > div:nth-child(25) > span");
        if(skill!==null) return "mx";

        var bx = document.querySelector("#game > div:nth-child(11) > button");
        if(bx!==null) return "jjc";

    }
    // Your code here...
})();
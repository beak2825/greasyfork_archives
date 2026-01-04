// ==UserScript==
// @name         枝江拖拉机 独轮车
// @namespace    http://tampermonkey.net/
// @version      3.0.2
// @description  用于B站直播的弹幕重复发送,弹幕发送间隔时间建议为六秒及以上(不然容易发送过快)/与 枝江说书人 脚本冲突,用哪个就关闭另一个
// @author       你失散已久的父亲向晚
// @match        https://live.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444826/%E6%9E%9D%E6%B1%9F%E6%8B%96%E6%8B%89%E6%9C%BA%20%E7%8B%AC%E8%BD%AE%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/444826/%E6%9E%9D%E6%B1%9F%E6%8B%96%E6%8B%89%E6%9C%BA%20%E7%8B%AC%E8%BD%AE%E8%BD%A6.meta.js
// ==/UserScript==
//想想自己到底要不要用这个再作决定！！！🙁

(function () {
    'use strict';

    var check = setInterval(function () {
        let point1 = document.getElementsByClassName("bottom-actions p-relative")[0];
        let point2 = document.getElementsByClassName('chat-history-panel')[0];
        if (point1 !== undefined && point2 !== undefined) {
            let panelBtn = 0;//面板开关的数值，开为1，关为0
            let tractorBtn = 0;//拖拉机开关数值，开为1，关为0
            var tractorValue = '';//拖拉机内容
            var mudTruckValue = '';//泥头车内容
            var tractor;//拖拉机定时器
            var value;//快速发送内容
            var time = '';//弹幕发送间隔
            var index = 0;

            //创建控制面板开关按钮
            let btn = document.createElement('div');
            btn.className = 'p-absolute';
            btn.style.left = '0';
            btn.style.top = '0';
            btn.innerHTML = '<button style="position: relative; box-sizing: border-box; line-height: 1; margin: 0; padding: 6px 12px; border: 0; cursor: pointer; outline: 0; overflow: hidden; display: inline-flex; justify-content: center; align-items: center; min-width: 80px; height: 24px; font-size: 12px; background-color: #23ade5; color: #fff; border-radius: 4px; "><span class="txt" style="position: relative; ">拖拉机面板</span></button>';
            point1.appendChild(btn);

            //创建拖拉机关闭按钮
            let btn1 = document.createElement('div');
            btn1.className = 'p-absolute';
            btn1.style.left = '90px';
            btn1.style.top = '0';
            btn1.innerHTML = '<button id="closeBtn" style="display: none; position: relative; box-sizing: border-box; line-height: 1; margin: 0; padding: 6px 12px; border: 0; cursor: pointer; outline: 0; overflow: hidden; display: inline-flex; justify-content: center; align-items: center; min-width: 80px; height: 24px; font-size: 12px; background-color: #23ade5; color: #fff; border-radius: 4px; "><span class="txt" style="position: relative; ">关闭拖拉机</span></button>';
            btn1.style.display = 'none';
            point1.appendChild(btn1);

            //创建控制面板
            let panel = document.createElement('div');
            panel.style.position = 'absolute';
            panel.style.bottom = '145px';
            panel.style.left = '0';
            panel.style.width = '100%';
            panel.style.zIndex = 50;
            panel.style.backgroundColor = '#fff';
            panel.style.display = 'flex';
            panel.style.justifyContent = 'center';
            panel.style.alignItems = 'center';
            panel.innerHTML = '<img src="https://i0.hdslb.com/bfs/album/4a16728a4eba1ade791ab8f0d19afcab73d1bc59.jpg@518w.webp" width="100%"> <div id="partition" style="display: none; position: absolute; top: 0; left: 0; z-index: 52; width: 100%; height: 100%; margin: 0; padding: 0; font-size: 20px; font-weight: 700; background-color: rgba(255, 255, 255, 0.7); align-items: center; justify-content: center;"><div>嘀哩啪啦吧啦啪啦boom</div></div> <div style="position: absolute; top: 0; left: 0; z-index: 51; width: 100%; height: 100%; margin: 0; padding: 0; font-weight: 700;"> <div id="myHead" style="width: 100%; height: 10%; margin: 0; padding: 0; display: flex; justify-content: space-around;"> <div id="dulunche" data-index="0" style="margin: 0; padding: 0; width: 33%; height: 100%; text-align: center; cursor: pointer;">独轮车 </div> <div id="loop" data-index="1" style="margin: 0; padding: 0; width: 33%; height: 100%; border-left: 1px solid #e1e1e1; text-align: center; cursor: pointer;"> 循环发送</div> <div id="random" data-index="2" style="margin: 0; padding: 0; width: 33%; height: 100%; border-left: 1px solid #e1e1e1; text-align: center; cursor: pointer;"> 随机发送</div> </div> <div id="myBody" style="width:100%; height: 90%; margin: 0; padding: 0;"> <div id="dulunchePanel" style="display: flex; flex-direction: column; justify-content: space-around; align-items: center; width: 100%; height: 100%; margin: 0; padding: 0;"> <input type="text" id="duluncheInput" placeholder="字数不能超过20个字" style="outline: medium; display: block; margin-bottom: 10px; width: 80%;" maxlength="20"> <div id="settime">发送间隔为<button id="sub">-</button><input type="text" id="time" style="text-align: center; width: 1.5rem;"><button id="add">+</button>秒</div> <button id="ruin" style="width:28%">开启拖拉机</button> </div> <div id="loopPanel" style="display: none; width: 100%; height: 100%; margin: 0; padding: 0;"> <textarea id="loopInput" cols="21" placeholder="循环模式用 | 分隔不同条弹幕" style="width: 45%; height: 90%; margin: 0; padding: 0; resize: none;"></textarea> <div style="margin: 0; padding: 0; display: flex; flex-direction: column; justify-content: space-around; align-items: center;"> <div id="settime">发送间隔为<button id="sub">-</button><input type="text" id="time" style="text-align: center; width: 1.5rem;"><button id="add">+</button>秒 </div> <button id="ruin" style="width:55%">开启拖拉机</button> </div> </div> <div id="randomPanel" style="display: none; width: 100%; height: 100%; margin: 0; padding: 0;"> <textarea id="randomInput" cols="21" placeholder="随机模式用 | 分隔不同条弹幕" style="width: 45%; height: 90%; margin: 0; padding: 0; resize: none;"></textarea> <div style="margin: 0; padding: 0; display: flex; flex-direction: column; justify-content: space-around; align-items: center;"> <div id="settime">发送间隔为<button id="sub">-</button><input type="text" id="time" style="text-align: center; width: 1.5rem;"><button id="add">+</button>秒</div> <button id="ruin" style="width:55%">开启拖拉机</button> </div> </div> </div> </div>';
            panel.style.display = 'none';
            point2.appendChild(panel);
            for (var i = 0; i < panel.querySelectorAll('#time').length; i++) {
                panel.querySelectorAll('#time')[i].value = GM_getValue('time', '6');
            }

            //为按钮绑定点击事件，点击打开或关闭面板
            btn.addEventListener('click', function () {
                if (!panelBtn) {
                    panel.style.display = 'flex';
                    panelBtn = 1;
                }
                else {
                    panel.style.display = 'none';
                    panelBtn = 0;
                }
            });

            //为控制面板切换绑定事件
            for (var i = 0; i < panel.querySelector('#myHead').children.length; i++) {
                panel.querySelector('#myHead').children[i].addEventListener('click', function () {
                    for (var j = 0; j < panel.querySelector('#myBody').children.length; j++) {
                        panel.querySelector('#myBody').children[j].style.display = 'none';
                    }
                    panel.querySelector('#myBody').children[this.getAttribute('data-index')].style.display = 'flex';
                });
            }

            //为加减时间按钮绑定事件
            for (var i = 0; i < panel.querySelectorAll('#sub').length; i++) {
                panel.querySelectorAll('#sub')[i].addEventListener('click', function () {
                    let timeClone = panel.querySelector('#time').value;
                    if (timeClone * 1 > 1) {
                        timeClone = --timeClone + '';
                        GM_setValue('time', timeClone);
                        for (var j = 0; j < panel.querySelectorAll('#sub').length; j++) {
                            panel.querySelectorAll('#time')[j].value = timeClone;
                        }
                    }
                });
            }
            for (var i = 0; i < panel.querySelectorAll('#add').length; i++) {
                panel.querySelectorAll('#add')[i].addEventListener('click', function () {
                    let timeClone = panel.querySelector('#time').value;
                    timeClone = timeClone * 1;
                    timeClone = ++timeClone + '';
                    GM_setValue('time', timeClone);
                    for (var j = 0; j < panel.querySelectorAll('#add').length; j++) {
                        panel.querySelectorAll('#time')[j].value = timeClone;
                    }
                });
            }

            //为间隔时间输入框绑定输入事件
            for (var i = 0; i < panel.querySelectorAll('#time').length; i++) {
                panel.querySelectorAll('#time')[i].addEventListener('input', function () {
                    this.value = this.value.replace(/[^\d]/g, '');
                    GM_setValue('time', this.value);
                    for (var j = 0; j < panel.querySelectorAll('#time').length; j++) {
                        panel.querySelectorAll('#time')[j].value = this.value;
                    }
                });
            }

            //拖拉机开关闭
            //为独轮车开关绑定事件
            panel.querySelector('#dulunchePanel').querySelector('#ruin').addEventListener('click', function () {
                //开启独轮车
                if (!tractorBtn) {
                    tractorValue = panel.querySelector('#duluncheInput').value;
                    time = panel.querySelector('#dulunchePanel').querySelector('#time').value;
                    if (tractorValue != '' && time != '') {
                        btn.getElementsByTagName('button')[0].getElementsByTagName('span')[0].innerText = '拖拉机启动';
                        btn.getElementsByTagName('button')[0].style.backgroundColor = '#d93f4b';
                        go();
                        tractor = setInterval(go, time * 1000);//弹幕发送间隔时间
                        panel.querySelector('#partition').style.display = 'flex';
                        btn1.style.display = 'block';
                        tractorBtn = 1;
                    }
                    else if (tractorValue == '' && time != '') {
                        alert('未设置弹幕');
                    }
                    else if (tractorValue != '' && time == '') {
                        alert('未设置弹幕发送间隔时间');
                    }
                    else {
                        alert('未设置弹幕及弹幕发送间隔时间');
                    }
                }
            });

            //为循环模式开关绑定事件
            panel.querySelector('#loopPanel').querySelector('#ruin').addEventListener('click', function () {
                if (!tractorBtn) {
                    mudTruckValue = panel.querySelector('#loopInput').value;
                    time = panel.querySelector('#loopPanel').querySelector('#time').value;
                    if (mudTruckValue != '' && time != '') {
                        var valueArray = mudTruckValue.split('|');
                        if (valueArray.length > 1) {
                            tractorValue = valueArray[index];
                            index++;
                            go();
                            tractor = setInterval(function () {
                                tractorValue = valueArray[index];
                                if (index < valueArray.length - 1) {
                                    index++;
                                }
                                else if (index == valueArray.length - 1) {
                                    index = 0;
                                }
                                go();
                            }, time * 1000);
                            btn.getElementsByTagName('button')[0].getElementsByTagName('span')[0].innerText = '拖拉机启动';
                            btn.getElementsByTagName('button')[0].style.backgroundColor = '#d93f4b';
                            panel.querySelector('#partition').style.display = 'flex';
                            btn1.style.display = 'block';
                            tractorBtn = 1;
                        }
                        else {
                            alert('请设置大于1条弹幕');
                        }
                    }
                    else if (mudTruckValue == '' && time != '') {
                        alert('未设置弹幕');
                    }
                    else if (mudTruckValue != '' && time == '') {
                        alert('未设置弹幕发送间隔时间');
                    }
                    else {
                        alert('未设置弹幕及弹幕发送间隔时间');
                    }
                }
            });

            //为随机模式开关绑定事件
            panel.querySelector('#randomPanel').querySelector('#ruin').addEventListener('click', function () {
                if (!tractorBtn) {
                    mudTruckValue = panel.querySelector('#randomInput').value;
                    time = panel.querySelector('#randomPanel').querySelector('#time').value;
                    if (mudTruckValue != '' && time != '') {
                        var randomArray = mudTruckValue.split('|');
                        if (randomArray.length > 1) {
                            tractorValue = randomArray[Math.round(Math.random() * (randomArray.length - 1))];
                            go();
                            tractor = setInterval(function () {
                                tractorValue = randomArray[Math.round(Math.random() * (randomArray.length - 1))];
                                go();
                            }, time * 1000);
                            btn.getElementsByTagName('button')[0].getElementsByTagName('span')[0].innerText = '拖拉机启动';
                            btn.getElementsByTagName('button')[0].style.backgroundColor = '#d93f4b';
                            panel.querySelector('#partition').style.display = 'flex';
                            btn1.style.display = 'block';
                            tractorBtn = 1;
                        }
                        else {
                            alert('请设置大于1条弹幕');
                        }
                    }
                    else if (mudTruckValue == '' && time != '') {
                        alert('未设置弹幕');
                    }
                    else if (mudTruckValue != '' && time == '') {
                        alert('未设置弹幕发送间隔时间');
                    }
                    else {
                        alert('未设置弹幕及弹幕发送间隔时间');
                    }
                }
            });

            //为关闭拖拉机按钮绑定事件
            btn1.querySelector('#closeBtn').addEventListener('click', function () {
                if (tractorBtn) {
                    tractorBtn = 0;
                    btn.getElementsByTagName('button')[0].getElementsByTagName('span')[0].innerText = '拖拉机面板';
                    btn.getElementsByTagName('button')[0].style.backgroundColor = '#23ade5';
                    panel.querySelector('#partition').style.display = 'none';
                    btn1.style.display = 'none';
                    mudTruckValue = '';
                    index = 0;
                    clearInterval(tractor);
                }
            });

            //发送弹幕函数
            function go() {
                let text = document.getElementsByClassName('chat-input')[1];
                let evt = document.createEvent('HTMLEvents');
                evt.initEvent('input', true, true);
                text.value = text._value = tractorValue;
                text.dispatchEvent(evt);
                document.querySelector('.live-skin-highlight-button-bg').click();
            }
            clearInterval(check);
        }
    }, 100);
})();
// ==UserScript==
// @name         枝江说书人 独轮车
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  用于B站直播的弹幕说书,选择好txt文件(txt文件自备,建议把回车缩进掉),设定好时间建议六秒以上(不然容易发送过快),点击发送弹幕即可/与 枝江拖拉机 脚本冲突,用哪个就关闭另一个
// @author       你失散已久的父亲向晚
// @match        https://live.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444827/%E6%9E%9D%E6%B1%9F%E8%AF%B4%E4%B9%A6%E4%BA%BA%20%E7%8B%AC%E8%BD%AE%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/444827/%E6%9E%9D%E6%B1%9F%E8%AF%B4%E4%B9%A6%E4%BA%BA%20%E7%8B%AC%E8%BD%AE%E8%BD%A6.meta.js
// ==/UserScript==
//好好想想你到底要不要用这个！！！网暴不可取！！！🙁

(function () {
    'use strict';

    var check = setInterval(function () {
        let point1 = document.getElementsByClassName("bottom-actions p-relative")[0];
        let point2 = document.getElementsByClassName('chat-history-panel')[0];
        if (point1 !== undefined && point2 !== undefined) {
            let panelBtn = 0;//面板开关的数值，开为1，关为0
            let tractorBtn = 0;//拖拉机开关数值，开为1，关为0
            var readBookMan = '';
            var wenBen = '';
            var tractor;//拖拉机定时器
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
            panel.innerHTML = '<img src="https://i0.hdslb.com/bfs/album/4a16728a4eba1ade791ab8f0d19afcab73d1bc59.jpg@518w.webp" width="100%"><div id="partition" style="display: none; position: absolute; top: 0; left: 0; z-index: 52; width: 100%; height: 100%; margin: 0; padding: 0; font-size: 20px; font-weight: 700; background-color: rgba(255, 255, 255, 0.7); align-items: center; justify-content: center;"><div>嘀哩啪啦吧啦啪啦boom</div></div><div style="position: absolute; left: 0; top: 0; display: flex; flex-direction: column; justify-content: center; align-items: center;"> <input id="inputFile" accept=".txt*" type="file"> <div id="settime">发送间隔为<button id="sub">-</button><input type="text" id="time" style="text-align: center; width: 1.5rem;"><button id="add">+</button>秒</div> <button id="ruin" style="width:28%">开启拖拉机</button></div>';
            panel.style.display = 'none';
            point2.appendChild(panel);

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


            //为加减时间按钮绑定事件
            panel.querySelector('#sub').addEventListener('click', function () {
                let timeClone = panel.querySelector('#time').value;
                if (timeClone * 1 > 1) {
                    timeClone = --timeClone + '';
                    panel.querySelector('#time').value = timeClone;
                }
            });

            panel.querySelector('#add').addEventListener('click', function () {
                let timeClone = panel.querySelector('#time').value;
                timeClone = timeClone * 1;
                timeClone = ++timeClone + '';
                panel.querySelector('#time').value = timeClone;
            });


            //为间隔时间输入框绑定输入事件
            panel.querySelector('#time').addEventListener('input', function () {
                this.value = this.value.replace(/[^\d]/g, '');
                panel.querySelector('#time').value = this.value;
            });

            //选文本
            const input = panel.querySelector('#inputFile');
            input.addEventListener('change', () => {
                const reader = new FileReader();
                reader.readAsText(input.files[0], 'utf8'); // input.files[0]为第一个文件
                reader.onload = () => {
                    readBookMan += reader.result; // reader.result为获取结果
                    // console.log(readBookMan);
                }
            }, false)

            //拖拉机开关闭

            //为循环模式开关绑定事件
            panel.querySelector('#ruin').addEventListener('click', function () {
                if (!tractorBtn) {
                    time = panel.querySelector('#time').value;
                    if (readBookMan != '' && time != '') {
                        for (var i = 0; i < 20; i++) {
                            wenBen = wenBen + readBookMan[index + i];
                        }
                        index += 20;
                        go();
                        wenBen = '';
                        tractor = setInterval(function () {
                            if (index < readBookMan.length - 20) {
                                for (var i = 0; i < 20; i++) {
                                    wenBen = wenBen + readBookMan[index + i];
                                }
                                index += 20;
                                go();
                                wenBen = '';
                            }
                            else {
                                for (var i = 0; i < readBookMan.length - index; i++) {
                                    wenBen = wenBen + readBookMan[index + i];
                                }
                                go();
                                wenBen = '';
                                close();
                            }
                        }, time * 1000);
                        btn.getElementsByTagName('button')[0].getElementsByTagName('span')[0].innerText = '拖拉机启动';
                        btn.getElementsByTagName('button')[0].style.backgroundColor = '#d93f4b';
                        panel.querySelector('#partition').style.display = 'flex';
                        btn1.style.display = 'block';
                        tractorBtn = 1;
                    }
                    else if (readBookMan == '' && time != '') {
                        alert('未设置弹幕');
                    }
                    else if (readBookMan != '' && time == '') {
                        alert('未设置弹幕发送间隔时间');
                    }
                    else {
                        alert('未设置弹幕及弹幕发送间隔时间');
                    }
                }
            });

            //为关闭拖拉机按钮绑定事件
            btn1.querySelector('#closeBtn').addEventListener('click', function(){
                close();
            });

            //发送弹幕函数
            function go() {
                let text = document.getElementsByClassName('chat-input')[1];
                let evt = document.createEvent('HTMLEvents');
                evt.initEvent('input', true, true);
                text.value = text._value = wenBen;
                text.dispatchEvent(evt);
                document.querySelector('.live-skin-highlight-button-bg').click();
            }

            //关闭独轮车函数
            function close() {
                if (tractorBtn) {
                    tractorBtn = 0;
                    btn.getElementsByTagName('button')[0].getElementsByTagName('span')[0].innerText = '拖拉机面板';
                    btn.getElementsByTagName('button')[0].style.backgroundColor = '#23ade5';
                    panel.querySelector('#partition').style.display = 'none';
                    btn1.style.display = 'none';
                    readBookMan = '';
                    index = 0;
                    clearInterval(tractor);
                }
            }
            clearInterval(check);
        }
    }, 100);
})();
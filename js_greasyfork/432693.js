// ==UserScript==
// @name         人生重开模拟器辅助工具
// @namespace    http://liferestart.syaro.io/view/
// @version      0.2
// @description  自定义锁定天赋、天赋再次刷新、多级速度播放
// @author       mo
// @match        http://liferestart.syaro.io/view/
// @icon         https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimgres.1666.com%2F1666%2F71%2F352004-20210911153006613c5afe8cb99.jpg&refer=http%3A%2F%2Fimgres.1666.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1634655319&t=fcd90561c4f0a9599de0eceb0a24e05c
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432693/%E4%BA%BA%E7%94%9F%E9%87%8D%E5%BC%80%E6%A8%A1%E6%8B%9F%E5%99%A8%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/432693/%E4%BA%BA%E7%94%9F%E9%87%8D%E5%BC%80%E6%A8%A1%E6%8B%9F%E5%99%A8%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (typeof(mo_props) == 'undefined') {
        var mo_props = {
            addTalentLockElement: null,
            addRandomAgainElement: null,
            addAutoSelectElement: null,

            mainElement: null,
            restartElement: null,
            talentLockElement: null,
            lockTalentSelectElement: null,
            randomAgainElement: null,
            nextElement: null,
            lifeTrajectoryElement: null,
            btnAreaElement: null,
            summaryElement: null,
            autoElement: null,
            autoSelectElement: null,
            optionElement: null,

            // 所有天赋数据
            talents: null,
            // 锁定天赋下拉框数据
            lockTalents: ['1048' ,'1135', '1023', '1064', '1141', '1131', '1128', '1010', '1014'],
            // 当前锁定天赋
            lockTalent: 0,
            // 自动播放下拉框数值（每秒播放多少条数据）
            times: [0, 1, 5, 10, 50, 100, 500],
            // 点击器
            clickInterval: null,

            index: 0
        };
    }

    // 获取所有天赋数据
    if (mo_props.talents == null) {
        fetch('http://liferestart.syaro.io/data/talents.json').then(function(response) {
            response.json().then(function(data) {

                // 保存所有天赋数据
                mo_props.talents = data;

                // 页面点击更改监听
                document.body.addEventListener('click', function() {

                    // 添加“锁定天赋”下拉框
                    mo_props.addTalentLockElement();

                    // 添加“再抽一次”按钮
                    mo_props.addRandomAgainElement();

                    // 添加“自动播放”下拉框
                    mo_props.addAutoSelectElement();

                });

                // 初始添加“锁定天赋”下拉框
                mo_props.addTalentLockElement();
            });
        });
    }


    /* ******************** 添加“锁定天赋”下拉框 ******************** */


    mo_props.addTalentLockElement = function() {

        mo_props.restartElement = document.getElementById('restart');

        if (mo_props.restartElement != null && mo_props.talentLockElement == null) {

            // 获取上一个“锁定天赋”下拉框容器并删除
            mo_props.talentLockElement = document.getElementById('talentLock');
            if (mo_props.talentLockElement != null) {
                mo_props.talentLockElement.remove();
                mo_props.talentLockElement = null;
            }

            // 创建容器
            mo_props.talentLockElement = document.createElement('div');
            mo_props.talentLockElement.id = 'talentLock';
            mo_props.talentLockElement.style.cssText = 'font-size: 20px; color: #EEEEEE; position: fixed; top: 58%; left: 51%; transform: translate(-50%, -50%);';

            // 创建一个“锁定天赋”下拉框
            mo_props.lockTalentSelectElement = document.createElement('select');
            mo_props.lockTalentSelectElement.id = 'lockTalent';
            mo_props.lockTalentSelectElement.style.cssText = 'font-size: 18px; height: 30px; border-radius: 5px; background-color: rgb(57, 62, 70); color: rgb(238, 238, 238); width: 177px; border: 1px solid #EEEEEE; padding-left: 10px;';
            // 不锁定
            mo_props.optionElement = document.createElement('option');
            mo_props.optionElement.setAttribute('value', '0');
            mo_props.optionElement.appendChild(document.createTextNode('不锁定'));
            mo_props.lockTalentSelectElement.appendChild(mo_props.optionElement);
            // 当前锁定天赋
            mo_props.lockTalent = window.localStorage.extendTalent;
            if (mo_props.lockTalents.indexOf(mo_props.lockTalent) == -1 && mo_props.lockTalent != '0') {
                mo_props.optionElement = document.createElement('option');
                mo_props.optionElement.setAttribute('value', mo_props.lockTalent);
                mo_props.optionElement.setAttribute('selected', 'selected');
                mo_props.optionElement.appendChild(document.createTextNode(mo_props.talents[mo_props.lockTalent].name));
                mo_props.lockTalentSelectElement.appendChild(mo_props.optionElement);
            }
            // 下拉框其他元素
            for (mo_props.index = 0; mo_props.index < mo_props.lockTalents.length; ++mo_props.index) {
                mo_props.optionElement = document.createElement('option');
                mo_props.optionElement.setAttribute('value', mo_props.lockTalents[mo_props.index]);
                if (mo_props.lockTalent == mo_props.lockTalents[mo_props.index]) {
                    mo_props.optionElement.setAttribute('selected', 'selected');
                }
                mo_props.optionElement.appendChild(document.createTextNode(mo_props.talents[mo_props.lockTalents[mo_props.index]].name));
                mo_props.lockTalentSelectElement.appendChild(mo_props.optionElement);
            }

            // 添加显示
            mo_props.talentLockElement.appendChild(document.createTextNode('锁定天赋：'));
            mo_props.talentLockElement.appendChild(mo_props.lockTalentSelectElement);
            document.getElementById('main').appendChild(mo_props.talentLockElement);

            // 监听锁定天赋更改
            mo_props.lockTalentSelectElement.addEventListener('change', function() {
                window.localStorage.extendTalent = mo_props.lockTalentSelectElement.value;
            });
        }

        if (mo_props.restartElement == null) {
            mo_props.talentLockElement = null;
        }
    }


    /* ******************** 添加“再抽一次”按钮 ******************** */


    mo_props.addRandomAgainElement = function() {

        mo_props.nextElement = document.getElementById('next');

        if (mo_props.nextElement != null) {

            mo_props.random = document.getElementById('random');

            if (mo_props.random.style.display != 'none') {
                // 获取上一个“再抽一次”按钮并删除
                mo_props.randomAgainElement = document.getElementById('randomAgain');
                if (mo_props.randomAgainElement != null) {
                    mo_props.randomAgainElement.remove();
                    mo_props.randomAgainElement = null;
                }
            } else if (mo_props.randomAgainElement == null) {

                // 克隆一个“再抽一次”按钮
                mo_props.randomAgainElement = mo_props.nextElement.cloneNode(false);
                mo_props.randomAgainElement.id = 'randomAgain';
                mo_props.randomAgainElement.style.cssText = 'position: relative; bottom: 200px;';
                mo_props.randomAgainElement.innerHTML = '再抽一次';

                // 将按钮添加显示
                mo_props.mainElement = document.getElementById('main');
                mo_props.mainElement.appendChild(mo_props.randomAgainElement);

                // 监听“再抽一次”按钮
                mo_props.randomAgainElement.addEventListener('click', function() {
                    document.getElementById('talents').innerHTML = '';
                    document.getElementById('random').click();
                });
            }
        }
    }


    /* ******************** 添加“自动播放”下拉框 ******************** */


    mo_props.addAutoSelectElement = function() {

        mo_props.summaryElement = document.getElementById('summary');
        mo_props.autoElement = document.getElementById('auto');

        if (mo_props.summaryElement != null && mo_props.autoElement.style.display != 'none') {

            // 创建一个“自动播放”下拉框
            mo_props.autoSelectElement = document.createElement("select");
            mo_props.autoSelectElement.id = "autoSelect";
            mo_props.autoSelectElement.setAttribute('class','mainbtn');
            // 下拉框元素
            for (mo_props.index = 0; mo_props.index < mo_props.times.length; ++mo_props.index) {
                mo_props.optionElement = document.createElement("option");
                mo_props.optionElement.setAttribute("value", mo_props.times[mo_props.index]);
                mo_props.optionElement.appendChild(document.createTextNode('自动播放（播放' + mo_props.times[mo_props.index] + '条/秒）'));
                mo_props.autoSelectElement.appendChild(mo_props.optionElement);
            }

            // 隐藏“自动播放”按钮
            mo_props.autoElement.style.display = 'none';
            document.getElementById('auto2x').style.display = 'none';

            // 将下拉框添加显示
            mo_props.btnAreaElement = document.getElementsByClassName('btn-area')[0];
            mo_props.btnAreaElement.appendChild(mo_props.autoSelectElement);

            // 监听“自动播放”下拉框
            mo_props.lifeTrajectoryElement = document.getElementById('lifeTrajectory');
            mo_props.autoSelectElement.addEventListener('change', function() {

                // 删除原点击器
                if (mo_props.clickInterval != null) {
                    clearInterval(mo_props.clickInterval);
                    mo_props.clickInterval = null;
                }

                // 设置新点击器
                if (mo_props.autoSelectElement.value != '0') {
                    mo_props.clickInterval = setInterval(function() {
                        if (mo_props.summaryElement.style.display == 'none') {
                            mo_props.lifeTrajectoryElement.click();
                        } else {
                            // 停止点击器
                            clearInterval(mo_props.clickInterval);
                        }
                    }, 1000 / mo_props.autoSelectElement.value);
                }
            });
        }
        if (mo_props.summaryElement != null && mo_props.summaryElement.style.display != 'none') {
             // 删除“自动播放”下拉框
            mo_props.autoSelectElement = document.getElementById('autoSelect');
            if (mo_props.autoSelectElement != null) {
                mo_props.autoSelectElement.remove();
                mo_props.autoSelectElement = null;
            }
        }
    }

})();
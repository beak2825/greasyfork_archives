// ==UserScript==
// @name         视频网站清爽模式
// @namespace    http://tampermonkey.net/
// @version      0.3942
// @description  为腾讯、优酷、爱奇艺增加修改样式、视频播放便利、跳转解析网站播放视频的功能，对解析网站进行增强改造，以及避免一些不必要的误触。
// @author       果心豆腐酱
// @match        https://v.qq.com/*
// @match        https://m.v.qq.com/*
// @match        https://youku.com/*
// @match        https://v.youku.com/*
// @match        https://www.youku.com/*
// @match        https://m.youku.com/*
// @match        https://jx.xmflv.com/*
// @match        https://jx.xmflv.cc/*
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://*v.qq.com/*
// @match        https://jx.xmflv.com/*
// @match        https://jx.xmflv.cc/*
// @grant        GM_xmlhttpRequest
// @icon         https://v.qq.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/481654/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E6%B8%85%E7%88%BD%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/481654/%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99%E6%B8%85%E7%88%BD%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
//全局变量配置
// 创建按钮元素
// var button = document.createElement('button');
// button.innerHTML = '按钮';

// // 设置按钮样式
// button.style.position = 'fixed';
// button.style.top = '0';
// button.style.left = '0';
// button.style.zIndex = '9999';
// button.addEventListener('click',function(event){
//     console.log(unsafewindow.__INITIAL_STATE__)
// })
// 将按钮添加到页面的body元素中
// document.body.appendChild(button);
console.log('页面加载完成');
var 解析字体颜色 = 'green';
if (!location.href.includes('.xmflv.')) {
    var 主题色;
    var 深主题色;
    var 浅主题色;
    var VIP主题色;
    var 备案字体颜色;
    var 浅色字体;
    var 亮色字体;
    var 深色字体;
    var 音量;
    //var 主题 = "青色"
    //初始化组件

    创建主设置组件();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        // 是手机设备
        函数存放("窄版页面样式修改");
    } else {
        // 不是手机设备
        函数存放("页面样式修改");
    }
    侧边栏按钮创建();
    判断视频网站视频组件加载();
    去广告判断();


    window.addEventListener('load', function () {
        // 页面加载完成后执行的操作
        console.log('页面加载完成2');


        // 定时检测视频进度并执行操作
        if (localStorage.getItem('advertisement') === "true") {
            函数存放("去除游戏栏目");
            函数存放("轮播栏广告播放");
        }
        函数存放("去除游戏栏目");
        函数存放("加载时可删除广告");
        函数存放("轮播栏广告小图");
        函数存放("去除app提示");
        元素样式创建();
        监测全屏状态();
        监测激活状态();
        监测页面元素();
        监测去除腾讯广告();
    });
    function 创建解析按钮() {
        let 图标 = 'https://community.image.video.qpic.cn/v_station_video_web_comment_fbd86c-1_1647929910_1703449373405659?imageView2/2/w/2000';
        //手机浏览器下载按钮旁
        let 优酷剧集按钮 = document.querySelector('[class="brief-btm"]')
        if (优酷剧集按钮) {
            let html = `
            <div class="解析视频" >
            <img src="${图标}" style="left: 0px;width: 37px;height: 40px;margin: 0px 15px;position: relative;top: -2px;align-content: space-around;">
            <span class="解析span" style="left: 22px;top: -5px;position: relative;font-size: 5px;font-weight: 600;">解析</span>
            </div>
            `;
            解析字体颜色 = '#999999';
            优酷剧集按钮.innerHTML += html
        }
        //PC版弹幕栏
        优酷剧集按钮 = document.querySelector('[class="switch-img_12hDa setconfig_Ojkob"]');
        if (优酷剧集按钮) {
            let html = `<div class="解析视频" style="display: inline-block;left: -5px;margin: 0px 15px; position: relative;top: 2px;align-content: space-around;">
              <img src="${图标}" style="width: 28px;height: 31px;">
              <span class="解析span" style="/* font-size: 10px; */left: 2px;top: 23px;position: absolute;font-size: 11px;font-weight: 600;height:20px;line-height: 20px;">解析</span>
            </div>`;
            if (优酷剧集按钮) {
                优酷剧集按钮.insertAdjacentHTML("afterend", html);
            } else {
                优酷剧集按钮.insertAdjacentHTML("afterend", html);
            }
        }
        
        //全部 按钮
        let 腾讯顶栏上的按钮 = document.querySelector('[id="nav-all"]');
        if (腾讯顶栏上的按钮) {
            let html = `
            <div class="解析视频" >
            <img src="${图标}" class="解析视频 解析图片" style="; width: 30px; margin: 0px 15px; height: 30px;">
            </div>
            `;
            腾讯顶栏上的按钮.insertAdjacentHTML("afterend", html);

        }
        //追剧 按钮旁边，手机浏览器
        let 腾讯追剧边按钮 = document.querySelector('[class="open-app video-desc__chase"]');
        if (腾讯追剧边按钮) {

            let html = `
            <div class="解析视频" style="background: white;border-radius: 20px;padding: 0px 10px 0px 10px;margin: 0px 10px 0px 10px;">
            <img src="${图标}" style="height: 32px;width: 40px;border-radius: 20px;">
            <span style="top: 2px;position: relative;font-size: 15px;font-weight: 600;width: 30px;margin: 0px 5px 0px 10px;height: 30px;">解析</span>
            </div>`;
            腾讯追剧边按钮.insertAdjacentHTML("afterend", html);
        }
       let 爱奇艺追剧边按钮 = document.querySelector('[class="fun"]');
        if (爱奇艺追剧边按钮) {
            let html = `
            <div class="解析视频" style="position: relative;">
            <img src="${图标}" style="width: 28px;margin: 0px 15px 0px 10px;height: 37px;top: -2px;position: relative;">
            <span class="解析span" style="height: 20px;;left: -14px;top: 9px;position: relative;font-size: 5px;font-weight: 600;">解析</span>
            </div>
            <div class="border"></div>
            `;
            解析字体颜色 = '#8ba9c1';
            爱奇艺追剧边按钮.insertAdjacentHTML("beforeend", html);
        }
        let 爱奇艺追剧边按钮手机浏览器 = document.querySelector('[class="m-videoPlay-toolBar"]');
        if (爱奇艺追剧边按钮手机浏览器) {
            let html = `
            <div class="解析视频">
            <img src="${图标}" style="width: 28px;margin: 0px 20px 0px 20px;height: 30px;top: -2px;position: relative;">
            <span style="left: -49px;top: 24px;position: relative;font-size: 5px;font-weight: 600;">解析</span>
            </div>
            `;
            爱奇艺追剧边按钮手机浏览器.insertAdjacentHTML("beforeend", html);
        }
        let 解析按钮 = document.querySelector('.解析视频');
        if (解析按钮) {
            解析按钮.addEventListener('click', function (event) {
                新窗口();
            })
        }


    }

    function 元素样式创建() {
        let css = `
            .解析视频{
                user-select: none;
                cursor: pointer;
                color: ${解析字体颜色};
                transition: transform 0.3s ease; 
                transition: transform .3s ease;
            }
            .解析视频:hover {
                color: #f5c000 !important;
                transform: scale(1.2);
            }
            #saveButton{
                color: #333333 ;
                width: 40px;
                height: 20px;
                border-radius: 10px;
                background: white;
            }
            #saveButton:hover{
                color: green ;
            }
            #saveButton:active{
                color: #610110 ;
            }
            .main_button:hover {
                color: green ;
            }
        `
        if (document.querySelector('.解析样式')) {
            document.querySelector('.解析样式').remove()
        }
        var style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        style.className = "解析样式";
        document.head.appendChild(style);
    }
    function 创建主设置组件() {
        'use strict';
        // 创建设置按钮
        var settingButton = document.createElement('div');
        settingButton.className = 'main_button';
        settingButton.style.top = '50%';
        settingButton.innerHTML = '设置';
        settingButton.style.color = '#376339';
        settingButton.style.borderRadius = '2px';
        settingButton.style.background = "linear-gradient(to right, #DCF0B0, rgba(252, 247, 224, 0.5))";
        settingButton.style.cursor = 'pointer';
        settingButton.style.zIndex = '9999';
        settingButton.addEventListener('mousedown', function (e) {
            dragMenu(settingButton, e);
        });
        settingButton.style.position = 'fixed';
        settingButton.style.width = '15px';
        settingButton.style.height = '50px';
        settingButton.style.lineHeight = '25px';
        settingButton.style.display = 'flex';
        settingButton.style.justifyContent = 'center';
        // 将按钮添加到页面的 body 元素中
        document.body.appendChild(settingButton);
        // setTimeout(function () {
        //     // 获取按钮元素透明
        //     selectButton.style.opacity = "0.1";
        //     settingButton.style.opacity = "0.1";
        // }, 10000); // 10秒后执行
        // 创建设置界面
        var settingPanel = document.createElement('div');
        settingPanel.style.position = 'fixed';
        settingPanel.style.top = '47%';
        settingPanel.style.left = '20px';
        settingPanel.style.padding = '10px';
        settingPanel.style.color = '#376339';
        settingPanel.style.background = "linear-gradient(to right, #DCF0B0, #FCF7E0)";
        settingPanel.style.border = '1px solid #000';
        settingPanel.style.zIndex = '9999';
        settingPanel.style.display = 'none';
        settingPanel.innerHTML = `
                <input type="checkbox" class="percentage 选择 a"  name="progressType" value="percentage"  style="    -webkit-appearance: button;cursor:pointer;border:0px">
                <label for="percentage">使用百分比</label>
                <input type="number" id="percentageThreshold" value="85" style="width: 50px;border:0px">
                <br>
                <input type="checkbox" class="percentage 选择 b" name="progressType" value="time" style="    -webkit-appearance: button;cursor:pointer;border:0px">
                <label for="time">使用分秒时间</label>
                <input type="text" id="timeThreshold" placeholder="12:20" style="width: 50px;border:0px">
                <br>
                <input type="checkbox" id="removewatermark" style="    -webkit-appearance: button;cursor:pointer;border:0px">
                <label for="percentage">去除视频水印</label>
                <br>
                <input type="checkbox" class="closesidebar" style="    -webkit-appearance: button;cursor:pointer;border:0px">
                <label for="percentage">首次关闭侧边栏</label>
                <br>
                <input type="checkbox" class="advertisement" style="    -webkit-appearance: button;cursor:pointer;border:0px">
                <label for="percentage">屏蔽广告</label>
                <br>
                <input type="checkbox" id="htmlbackground" style="    -webkit-appearance: button;cursor:pointer;border:0px">
                <label for="percentage">替换背景</label>
                <form action="/submit-form" method="post">
                    <select id="cars" name="cars">
                    <option value="月光色">月光色</option>
                    <option value="青色">青色</option>
                    <option value="神秘森林">神秘森林</option>
                    <option value="辣红色">辣红色</option>
                    <option value="芒果色">芒果色</option>
                    <option value="金黄色">金黄色</option>
                    <option value="金色">金色</option>
                    </select>
                </form>
                <br>
                <button id="saveButton" class="button" style="font-weight: bold;cursor:pointer;position: absolute;right: 10px;bottom: 10px;border:0px">保存</button>
            `;

        // <br>
        // <div style="width: 100%;  height: 1px;background-color: #5c6e32;    margin-bottom: 2px;"></div>
        // <label for="percentage" style="    position: relative;top: 10px;">cookie:</label>
        // <textarea class="cookie_textrea"  placeholder="填写你需要加载到浏览器的cookie。" style="width: 110px;resize: none; height: 60px;"></textarea>
        // <br>
        // <button id="tiquButton" class="button" style="font-weight: bold; color: #333333;cursor:pointer;position: relative;left: 95px;">提取</button>
        // <button id="jiazaiButton" class="button" style="font-weight: bold; color: #333333;cursor:pointer;position: relative;left: 100px;">加载</button>
        document.body.appendChild(settingPanel);
        document.querySelector('.选择.a').addEventListener('click', function (event) {
            if (document.querySelector('.选择.a').checked === true) {
                document.querySelector('.选择.b').checked = false;
            }

        })
        document.querySelector('.选择.b').addEventListener('click', function (event) {
            if (document.querySelector('.选择.b').checked === true) {
                document.querySelector('.选择.a').checked = false;
            }
        })
        // settingPanel.addEventListener('mousedown', function (e) {
        //     dragMenu(settingPanel, e);
        // });
        // 定义一个变量用于保存计时器的 ID
        var timerId;
        // 给设置按钮绑定鼠标移入事件
        settingButton.addEventListener('mouseenter', function () {
            // 显示设置面板
            settingPanel.style.display = 'block';
            // 清除计时器
            clearTimeout(timerId);
        });
        // 给设置面板绑定鼠标移入事件，避免鼠标移出设置按钮后立即隐藏设置面板
        settingPanel.addEventListener('mouseenter', function () {
            // 清除计时器
            clearTimeout(timerId);
        });
        // 给设置按钮绑定鼠标移出事件
        settingButton.addEventListener('mouseleave', function () {
            // 开始计时，500 毫秒后隐藏设置面板
            timerId = setTimeout(function () {
                settingPanel.style.display = 'none';
            }, 500);
        });
        // 给设置面板绑定鼠标移出事件，避免鼠标移入设置面板后立即隐藏设置面板
        settingPanel.addEventListener('mouseleave', function () {
            // 开始计时，500 毫秒后隐藏设置面板
            timerId = setTimeout(function () {
                settingPanel.style.display = 'none';
            }, 500);
        });
        // 显示/隐藏设置界面
        settingButton.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            if (settingPanel.style.display === 'none') {
                settingPanel.style.display = 'block';
                console.log('开始设置');
                const 进度选择Input = document.querySelectorAll('.选择');
                if (进度选择Input.length === 2) {
                    for (let index = 0; index < 进度选择Input.length; index++) {
                        进度选择Input[index].style.cssText = 'width: 20px !important; cursor: pointer;';
                    }
                }
            } else {
                settingPanel.style.display = 'none';
            }
        });
        var tiquButton = document.querySelector('#tiquButton');
        if (tiquButton) {
            tiquButton.addEventListener("click", function () {
                var cookieStr = document.querySelector('.cookie_textrea')
                if (cookieStr) {
                    cookieStr.value = document.cookie
                }
            })
        }
        var jiazaiButton = document.querySelector('#jiazaiButton');
        if (jiazaiButton) {
            jiazaiButton.addEventListener("click", function () {
                加载QQcookie();
            })
        }
        function 加载QQcookie() {
            var cookieDomain = ".qq.com"
            // 设置cookie字符串
            var cookieStr = document.querySelector('.cookie_textrea')
            if (cookieStr) {
                // 分割cookie字符串
                if (cookieStr.value != "") {
                    var cookies = cookieStr.value.split(";");
                    if (cookies.length != 0) {
                        // 遍历每个cookie，并设置为对应的键值对
                        cookies.forEach(function (cookie) {
                            var keyValue = cookie.trim().split("=");
                            var key = keyValue[0];
                            var value = keyValue[1];
                            // 设置cookie
                            document.cookie = key + "=" + encodeURIComponent(value) + "; domain=" + cookieDomain + "; path=/;";
                        });
                    } else (showToast("请不包含有cookie信息。"))

                } else (showToast("请填写cookie信息。"))

            } else (showToast("编辑框元素丢失了。"))
        }

        //取进度百分比的编辑框元素
        var percentageThresholdInput = document.getElementById('percentageThreshold');
        // 读取缓存percentageThreshold的值
        var savedPercentageThreshold = localStorage.getItem('percentageThreshold');
        //如果缓存没有内容就使用默认的数值
        if (savedPercentageThreshold) {
            percentageThresholdInput.value = savedPercentageThreshold;
        } else {
            percentageThresholdInput.value = '85'; // 默认值
        }
        // 读取缓存的timeThreshold的值
        var timeThresholdInput = document.getElementById('timeThreshold');
        var savedTimeThreshold = localStorage.getItem('timeThreshold');
        if (savedTimeThreshold) {
            timeThresholdInput.value = savedTimeThreshold;
        } else {
            timeThresholdInput.placeholder = '12:20'; // 默认值
        }
        var percentageValue = parseInt(localStorage.getItem('percentage'));
        if (isNaN(percentageValue) || percentageValue < 0) {
            document.querySelectorAll(".percentage")[0].checked = true
        } else {
            document.querySelectorAll(".percentage")[percentageValue].checked = true
        }
        var removewatermarkchecked = localStorage.getItem('removewatermark');
        if (removewatermarkchecked === "false") {
            document.querySelector("#removewatermark").checked = false;
        } else {
            document.querySelector("#removewatermark").checked = true;
            localStorage.setItem('removewatermark', true);
        }
        var closesidebarchecked = localStorage.getItem('closesidebar');
        if (closesidebarchecked === "false") {
            document.querySelector(".closesidebar").checked = false
        } else {
            document.querySelector(".closesidebar").checked = true
            localStorage.setItem('closesidebar', true);
        }
        if (closesidebarchecked === "false") {
            document.querySelector(".advertisement").checked = false
        } else {
            document.querySelector(".advertisement").checked = true
            localStorage.setItem('advertisement', true);
        }
        var htmlbackground = localStorage.getItem('htmlbackground');
        if (htmlbackground === "true") {
            document.querySelector("#htmlbackground").checked = true;
            var cars = localStorage.getItem('cars');
            document.querySelector("#cars").selectedIndex = cars;
        } else {
            document.querySelector("#htmlbackground").checked = false;
            localStorage.setItem('htmlbackground', false);
        }


        // 监听保存按钮的点击事件
        var saveButton = document.getElementById('saveButton');
        saveButton.addEventListener('click', function () {
            // 保存percentageThreshold的值到localStorage
            var percentageThresholdValue = percentageThresholdInput.value;
            localStorage.setItem('percentageThreshold', percentageThresholdValue);
            // 保存timeThreshold的值到localStorage
            var timeThresholdValue = timeThresholdInput.value;
            localStorage.setItem('timeThreshold', timeThresholdValue);
            //保存去水印设置
            localStorage.setItem('removewatermark', document.querySelector("#removewatermark")?.checked);
            //保存屏蔽广告设置
            localStorage.setItem('advertisement', document.querySelector(".advertisement")?.checked);
            //保存侧边栏设置
            localStorage.setItem('closesidebar', document.querySelector(".closesidebar")?.checked);
            //主题替换功能
            localStorage.setItem('htmlbackground', document.querySelector("#htmlbackground")?.checked);
            //主题配色选择
            localStorage.setItem('cars', document.querySelector("#cars")?.selectedIndex);
            // // 判断是否所有的percentage都被选中
            var percentageInputs = document.querySelectorAll(".percentage");
            for (var i = 0; i < percentageInputs.length; i++) {
                if (percentageInputs[i].checked) {
                    localStorage.setItem('percentage', i);
                }
            }
        });
        //需要直接执行的代码
        // 使用正则表达式检测 userAgent

    }

    // 检测视频进度达到阈值时执行点击下一个视频
    function checkAndClickNext() {
        var jindu = document.querySelector(".txp_time_current");
        var changdu = document.querySelector(".txp_time_duration");
        // 解析进度和长度的分钟和秒钟
        if (jindu && changdu) {
            var progressParts = jindu.textContent.split(":");
            var durationParts = changdu.textContent.split(":");
            var progressMinutes = parseInt(progressParts[0]);
            var progressSeconds = parseInt(progressParts[1]);
            var durationMinutes = parseInt(durationParts[0]);
            var durationSeconds = parseInt(durationParts[1]);
            // 将分钟和秒钟转换为总秒数
            var progressTotalSeconds = progressMinutes * 60 + progressSeconds;
            var durationTotalSeconds = durationMinutes * 60 + durationSeconds;
            // 获取进度类型选择
            var progressType = parseInt(localStorage.getItem('percentage'));
            var nextButton = document.querySelector('.txp_btn.txp_btn_next_u');
            // 根据进度类型执行相应的进度判断
            if (progressType === 0) {
                // 获取百分比阈值
                var percentageThreshold = localStorage.getItem('percentageThreshold');
                // 计算百分比
                var percent = (progressTotalSeconds / durationTotalSeconds) * 100;
                //txp_tooltip txp_none
                // 如果进度达到阈值，则执行点击下一个视频的操作
                if (percent >= percentageThreshold) {
                    if (nextButton) {
                        nextButton.click();
                    }
                }
            } else if (progressType === 1) {
                // 获取分秒时间阈值
                var timeThresholdParts = localStorage.getItem('timeThreshold');
                var timeParts = timeThresholdParts.split(":");
                var timeThresholdSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
                // 如果进度达到阈值时间，则执行点击下一个视频的操作
                if (progressTotalSeconds >= timeThresholdSeconds) {
                    if (nextButton) {
                        nextButton.click();
                    }
                }
            }
        }
        //clearInterval(intervalId);
    }
    function 判断视频网站视频组件加载() {
        var intervalId = setInterval(function () {

            let video = document.querySelectorAll('video')
            if (video) {
                clearInterval(intervalId);

                音量 = video.volume
                创建解析按钮();
                监测播放状态();
                去广告判断();
            }
            for (let index = 0; index < video.length; index++) {
                if (video[index].src != '') {

                    设置辅助功能(video[index]);
                }
            }
        }, 1000);
    }
    function 设置辅助功能(video) {
        let i = 1;
        let intervalId = setInterval(() => {
            let 腾讯PC = document.querySelector('.plugin_ctrl_txp_bottom');
            if (腾讯PC) {
                腾讯PC.appendChild(添加辅助功能());
                绑定热键();
                clearInterval(intervalId);
            } else {
                let 爱奇艺PC = document.querySelectorAll('[class="iqp-contrl"]');
                if (爱奇艺PC.length === 2) {
                    爱奇艺PC[0].parentElement?.querySelector('[data-player-hook="plgcontainer"]')?.remove()
                    爱奇艺PC[1].appendChild(添加辅助功能());
                    绑定热键();
                    clearInterval(intervalId);
                } else {
                    if (爱奇艺PC === 1) {
                        爱奇艺PC.appendChild(添加辅助功能());
                        绑定热键();
                        clearInterval(intervalId);
                    } else {
                        let 优酷PC = document.querySelector('[class="kui-dashboard-rear-ctn"]');
                        if (优酷PC) {
                            优酷PC.appendChild(添加辅助功能());
                            绑定热键();
                            clearInterval(intervalId);
                        }
                    }
                }
            }
            i++;
            if (i === 10) {
                clearInterval(intervalId);
            }
        }, 1000);
    }
    //视频网站的
    function 监测播放状态() {
        let video = document.querySelector('video')
        if (video) {
            video.addEventListener("timeupdate", function () {
                var currentTime = Math.floor(video.currentTime); // 获取当前播放时间（秒）
                var duration = Math.floor(video.duration); // 获取视频总长度（秒）
                var progressType = parseInt(localStorage.getItem('percentage'));
                if (progressType === 0) {
                    var percentageThreshold = localStorage.getItem('percentageThreshold');
                    var percent = (currentTime / duration) * 100;
                    if (percent >= percentageThreshold) {
                        setTimeout(function () {
                            点击下一集(video);
                        }, 1000);
                    }
                } else if (progressType === 1) {
                    var timeThresholdParts = localStorage.getItem('timeThreshold');
                    var timeParts = timeThresholdParts.split(":");
                    var timeThresholdSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
                    if (currentTime >= timeThresholdSeconds) {
                        setTimeout(function () {
                            点击下一集(video);
                        }, 1000);
                    }
                }
            });
        }
    }
    function 点击上一集() {
        window.history.back();
    }
    function 点击下一集() {
        if (location.hostname.includes('v.qq.')) {
            document.querySelector('.txp_btn.txp_btn_next_u')?.click();
        } else {
            if (location.hostname.includes('.youku.')) {
                document.querySelector('[class="  kui-next-icon-0"]')?.click();
            } else {
                if (location.hostname.includes('.iqiyi.')) {
                    document.querySelector('[class="iqp-btn iqp-btn-next"]').click();
                }
            }
        }
    }

    //监测页面元素
    function 监测页面元素() {
        var oldURL = document.URL;
        // 创建 Mutation Observer 实例
        var observer = new MutationObserver(function (mutationsList) {
            // console.log("蜀黍");
            for (var mutation of mutationsList) {
                // 遍历每个被添加的节点
                for (var addedNode of mutation.addedNodes) {
                    // 判断是否为元素节点
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        去广告判断()

                        let 当前剧集按钮 = document.querySelector('[class="c-album-item selected"]');
                        if (当前剧集按钮) {
                            if (!当前剧集按钮.querySelector('.覆盖按钮')) {
                                覆盖按钮(当前剧集按钮)
                            }
                        }
                    }
                }
            }
        });
        // 监测整个文档树的变动
        observer.observe(document, { childList: true, subtree: true });
    }
    // if (addedNode) {
    //     let 播放页面广告 = addedNode.querySelector('video[preload="auto"]')
    //     if (播放页面广告.parentElement?.parentElement ){
    //         播放页面广告.parentElement?.parentElement?.remove()
    //         //会员原播放界面
    //         let 缩小视频 = document.querySelector('[class="iqp-player-videolayer"]')
    //         缩小视频.style.height = '100%';
    //         缩小视频.style.width = '100%';
    //         缩小视频.style.top = '0';
    //         缩小视频.style.left = '0';

    //         html=`<div class="cupid-pause-max-play-btn" ><span class="play-btn"></span>继续播放</div>`
    //         缩小视频.querySelector('[data-cupid="container"]')?.insertAdjacentHTML("afterend", html);

    //         css=`.cupid-pause-max-play-btn {
    //             left: calc(50% - 128px);
    //             top: calc(50% - 44px);
    //             position: absolute;
    //             width: 128px;
    //             height: 44px;
    //             font-size: 16px;
    //             border-radius: 22.41px;
    //           }`
    //           if (document.querySelector('.继续播放')) {
    //             document.querySelector('.继续播放').remove()
    //         }
    //         var style = document.createElement('style');
    //         style.type = 'text/css';
    //         style.textContent = css;
    //         style.className = "继续播放";
    //         document.head.appendChild(style);
    //     }


    // }
    function 去广告判断() {
        if (localStorage.getItem('advertisement') === "true") {
            if (document.location.hostname.includes('v.qq.com')) {
                监测去除腾讯广告();
            } else {
                if (document.location.hostname.includes('.iqiyi')) {
                    //console.log('警察蜀黍',addedNode)
                    爱奇艺去广告()
                } else {
                    if (document.location.hostname.includes('.youku.')) {
                        优酷去广告()
                    }
                }
            }
        }
    }

    var cartoonlistload;
    // 调用函数并打印

    function 监测去除腾讯广告() {
        if (localStorage.getItem('advertisement') === "true") {
            //暂停视频的弹窗广告
            var video_material = document.querySelector('.txp_zt_video_material');
            if (video_material) {
                video_material.parentNode.removeChild(video_material);
                console.log("删除暂停视频的弹窗广告");
            } else {
                // 暂停视频的弹窗广告
                var pauseBanner = document.querySelector('.txp_zt_content.txp_ad_active_normal');
                if (pauseBanner) {
                    pauseBanner.remove();
                    console.log("删除暂停视频的弹窗广告");
                } else {
                    // 推荐视频里的广告
                    var pauseVideos = document.querySelectorAll(".video-card-module > div.card-wrap");
                    if (pauseVideos.length > 0) {
                        pauseVideos.forEach(function (video) {
                            video.remove();
                        });
                        console.log("删除推荐视频里的广告");
                    } else {
                        // 推荐视频里的广告关闭按钮
                        var close_btn = document.querySelectorAll(".close-btn SPAN");
                        if (close_btn.length > 0) {
                            close_btn.forEach(function (button) {
                                if (button.textContent === "广告") {
                                    button.parentNode.parentNode.remove();
                                }
                            });
                            console.log("删除推荐视频里的广告");
                        } else {
                            // 暂停视频的弹窗广告
                            var pauselayer = document.querySelector('.creative-player-pause-layer');
                            if (pauselayer) {
                                pauselayer.remove();
                                console.log("删除暂停视频的弹窗广告");
                            } else {
                                var 侧边栏广告 = document.querySelector(".game_switch_page_next_wrapper.game-switch-ad")
                                if (侧边栏广告) {
                                    侧边栏广告.remove();
                                    console.log("删除侧边栏广告");
                                } else {
                                    var 挂件 = document.querySelector(".game_close_btn.svelte-a683jp")
                                    if (挂件) {
                                        挂件.click();
                                        console.log("移除了挂件广告。");
                                    } else {
                                        var cartoonlist = document.querySelector(".card.vertical")
                                        if (cartoonlist) {
                                            // 在这里添加对应的删除操作
                                        } else {
                                            pauselayer = document.querySelector('[data-role="creative-player-full-screen-pause-layer"]')
                                            if (pauselayer) {
                                                pauselayer.remove();
                                                console.log("删除暂停视频的弹窗广告");
                                            } else {
                                                //内嵌的商品广告
                                                var data05e6c233 = document.querySelector('iframe[data-v-05e6c233]')
                                                if (data05e6c233) {
                                                    data05e6c233.remove();
                                                    console.log("删除内嵌的商品广告");
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        var 悬浮播放器 = document.querySelector('[class="vue-portal-target"]');
        if (悬浮播放器) {
            悬浮播放器.remove();
            console.log("删除悬浮播放器");
        }
        var desc__download = document.querySelector('[class="open-app video-desc__download"]');
        if (desc__download) {
            desc__download.remove();
            console.log("删除手机浏览器下载app按钮");
        }
        var 侧边广告 = document.querySelector('.player-side-ads__left');
        if (侧边广告) {
            侧边广告.parentNode.removeChild(interactiframe);
            console.log("删除播放器左侧栏广告", "interactiframe");
        }
        var interactiframe = document.querySelector('.interact_entry.player__interact-iframe');
        if (interactiframe) {
            interactiframe.parentNode.removeChild(interactiframe);
            console.log("删除未知广告", "interactiframe");
        }
        var txpzt = document.querySelector('.txp_zt');
        if (txpzt) {
            txpzt.remove();
            console.log("删除未知广告", "txpzt");
        }
        // 去app查看
        var appBanner = document.querySelector('.at-app-banner__open-method.at-app-banner--button');
        if (appBanner) {
            appBanner.remove();
        }

        // 去app查看2
        var appButton = document.querySelector('[dt-eid="open_app_bottom"]');
        if (appButton) {
            appButton.remove();
        }

        // 播放器悬浮广告
        appButton = document.querySelector('[class="txp_ad_detail txp_ad_active_normal');
        if (appButton) {
            appButton.remove();
        }

    }
    // 调用函数并打印
    function 爱奇艺去广告() {
        if (localStorage.getItem('advertisement') === "true") {
            //播放器右栏广告
            let 播放器右栏广告 = document.querySelector('[class="qy-plist-ad type-3 roll"]')
            if (播放器右栏广告) {
                播放器右栏广告.remove();
                console.log("移除播放广告按钮");
            }
            //播放广告
            let 播放广告 = document.querySelector('[class="cupid-pause-max-close-btn"]');
            if (播放广告) {
                if (播放广告.parentElement.style.display != 'none') {
                    播放广告.click();

                }
            }
            //播放广告2
            播放广告 = document.querySelector('[class="skippable-after"]')
            if (播放广告) {
                if (播放广告.parentElement.style.display != 'none') {
                    播放广告.click();

                }
            }
            //下载应用按钮
            const 下载应用按钮 = document.querySelector('[class="item tiicke-down"]');
            if (下载应用按钮) {
                下载应用按钮.remove();
                console.log("移除下载应用按钮");
            }
            //手机浏览器下载应用按钮
            const 手机浏览器下载应用按钮 = document.querySelector('[class="c-videoPlayPage-icon c-videoPlayPage-down"]');
            if (手机浏览器下载应用按钮) {
                手机浏览器下载应用按钮.parentElement?.parentElement?.parentElement?.remove();
                console.log("移除手机浏览器下载应用按钮");
            }
            //页面遮罩
            const 页面遮罩 = document.querySelector('[class="qy-popup-mask"]');
            if (页面遮罩) {
                页面遮罩.remove();
                console.log("移除页面遮罩");
            }
            //打开app悬浮窗
            const guide = document.querySelector('.m-iqyGuide-layer');
            if (guide) {
                guide.remove();
                console.log("移除悬浮窗广告");
            }
            //打开app底部框
            const banner = document.querySelector('.ChannelHomeBanner_hbd_eiF93');
            if (banner) {
                banner.remove();
                console.log("移除底部框广告");
            }
            //应用推荐
            const recList = document.querySelector('[name="m-recList"]');
            if (recList) {
                recList.remove();
                console.log("移除应用推荐广告");
            }
            //播放页面打开app
            const boxItems = document.querySelector('[id="player_bottom"]');
            if (boxItems) {
                boxItems.parentElement?.parentElement?.parentElement?.remove();
                console.log("移除播放页面打开app广告");
            }
            //视频介绍
            const videoInfo = document.querySelector('[name="m-videoInfo"]');
            if (videoInfo) {
                if (videoInfo.style.paddingTop !== '15px') {
                    videoInfo.style.paddingTop = '15px';
                    console.log("修改视频介绍样式");
                }
            }
            //播放页面悬浮推荐
            const hotWords = document.querySelector('[class="m-hotWords-bottom"]');
            if (hotWords && hotWords.parentElement) {
                hotWords.parentElement.remove();
                console.log("移除播放页面悬浮推荐广告");
            }
            //播放页面视频详情下广告
            const qy_plist_ad = document.querySelector('[class="qy-plist-ad type-1 image"]');
            if (qy_plist_ad) {
                qy_plist_ad.remove();
                console.log("移除播放页面视频详情下广告");
            }
            //播放页面视频详情下广告
            const 试看提示 = document.querySelector('[id="cc_minimalism_popup"]');
            if (试看提示) {
                试看提示.remove();
                console.log("移除播放页面试看提示广告");
            }
            //播放页面视频详情下广告
            const 登陆提示 = document.querySelector('[data-block-v2="bottom_denglu"]');
            if (登陆提示) {
                登陆提示.remove();
                console.log("移除登陆提示");
            }
            //首页广告条
            const adtl = document.querySelectorAll('[class="ad-tl"]');
            for (let index = 0; index < adtl.length; index++) {
                adtl[index].remove();
                console.log("移除首页广告条提示");
            }
            //开通会员提示
            let bTest = document.querySelector('[class="header__promotion__popup bTest"]')
            if (bTest) {
                bTest.remove();
                console.log('爱奇艺开通会员提示广告去除执行完成')
            }
            //视频列表广告
            let adseed = document.querySelector('[class="ad-seed"]')
            if (adseed) {
                adseed.remove();
                console.log('爱奇艺视频列表广告去除执行完成')
            }
            //视频列表广告
            let adef = document.querySelector('[class="ad-ef"]')
            if (adef) {
                adef.remove();
                console.log('爱奇艺首页视频栏广告去除执行完成')
            }
            //播放页面广告
            let 播放页面广告 = document.querySelector('[class="cupid-pause-max-close-btn"]')
            if (播放页面广告) {
                播放页面广告.click();
                console.log('爱奇艺播放页面广告去除执行完成')
            }
            //顶栏右侧游戏按钮
            let 顶栏右侧游戏按钮 = document.querySelector('[class="T-icon-game"]')
            if (顶栏右侧游戏按钮) {
                顶栏右侧游戏按钮.remove();
                console.log('爱奇艺顶栏右侧游戏按钮游戏广告去除执行完成')
            }
            let 顶栏栏目选择 = document.querySelectorAll('[class="nav-link nav-index J-nav-channel"')
            for (let index = 0; index < 顶栏栏目选择.length; index++) {
                if (顶栏栏目选择[index].textContent === '游戏') {
                    顶栏栏目选择[index].remove();
                    console.log('爱奇艺顶栏顶栏栏目选择按钮游戏广告去除执行完成')
                }
            }
            //轮播栏广告
            let 轮播栏广告 = document.querySelectorAll('[class="panel-item"][data-v-e765da72]')
            for (let index = 0; index < 轮播栏广告.length; index++) {
                let href = 轮播栏广告[index].querySelector('[href]')
                if (href) {
                    href = href.getAttribute('href');
                    // 提取域名
                    const regex = /\/\/(.+)\//;
                    // 匹配 URL 字符串中的域名
                    const match = href.match(regex);
                    // 提取匹配结果中的域名
                    const domain = match && match[1];
                    if (domain) {
                        if (!domain.includes('.iqiyi') || domain.includes('game')) {
                            轮播栏广告[index].remove()
                            console.log('爱奇艺轮播栏广告广告去除执行完成')
                        }
                    }
                }
            }
            let 轮播栏广告2 = document.querySelector('[class="qy20-h-carousel_con-gray"][data-v-e765da72]')?.querySelectorAll('a')
            for (let index = 0; index < 轮播栏广告.length; index++) {
                let href2 = 轮播栏广告2[index].getAttribute('href');
                if (href2) {
                    // 提取域名
                    const regex = /\/\/(.+)\//;
                    // 匹配 URL 字符串中的域名
                    const match = href2.match(regex);
                    // 提取匹配结果中的域名
                    const domain = match && match[1];
                    if (domain) {
                        if (!domain.includes('.iqiyi.') || domain.includes('game')) {
                            轮播栏广告2[index].setAttribute('href', '')
                            console.log('爱奇艺轮播栏广告href去除执行完成')
                        }
                    }

                }

            }
            //轮播栏广告按钮
            let 轮播栏广告按钮 = document.querySelector('[class="qy20-h-carousel__ad"]')
            if (轮播栏广告按钮) {
                轮播栏广告按钮.style.display = 'none';
                //console.log('爱奇艺轮播栏广告按钮去除执行完成',轮播栏广告按钮)
            }
            //console.log('爱奇艺广告去除执行完成')
        }
    }

    function 优酷去广告() {
        if (localStorage.getItem('advertisement') === "true") {

            //底部打开app提示
            let 底部打开app提示 = document.querySelector('[sourcetype="Sbanner_circle_0"]')
            if (底部打开app提示) {
                底部打开app提示.remove();
                console.log('优酷底部打开app提示去除执行完成')
            }
            //继续使用浏览器
            let pause = document.querySelector('[id="youku-pause-container"]')
            if (pause) {
                pause.remove();
                console.log('优酷继播放暂停广告去除执行完成')
            }
            //继续使用浏览器
            let callEnd_box = document.querySelector('[class="callEnd_box "]')
            if (callEnd_box) {
                callEnd_box.remove();
                console.log('优酷继续使用浏览器广告去除执行完成')
            }
            //下载app按钮
            let download_clipboard = document.querySelector('[class="download clipboard"]')
            if (download_clipboard) {
                download_clipboard.parentElement.remove();
                console.log('优酷下载app按钮去除执行完成')
            }
            //下载客户端按钮
            let download = document.querySelector('[name="download"]')
            if (download) {
                download.remove();
                console.log('优酷下载客户端去除执行完成')
            }
            //下载app
            let downloadApp = document.querySelector('[class="icon downloadApp"]')
            if (downloadApp) {
                downloadApp.remove();
                console.log('优酷下载app广告去除执行完成')
            }
            //领取会员
            let guide = document.querySelector('[class="clipboard h5-detail-vip-guide"]')
            if (guide) {
                guide.remove();
                console.log('优酷领取会员广告去除执行完成')
            }
            //继续使用浏览器
            let promotelogin_infobottom = document.querySelector('[class="promotelogin_infobottom"]')
            if (promotelogin_infobottom) {
                promotelogin_infobottom.remove();
                console.log('优酷继续使用浏览器2广告去除执行完成')
            }
            let 轮播栏广告 = document.querySelectorAll('[class=" newswiper_img_box"]')
            for (let index = 0; index < 轮播栏广告.length; index++) {
                let href = 轮播栏广告[index].getAttribute('href');
                if (href) {
                    // 提取域名
                    //console.log(href)
                    const regex = /\/\/(.+)\//;
                    // 匹配 URL 字符串中的域名
                    const match = href.match(regex);
                    // 提取匹配结果中的域名
                    const domain = match && match[1];
                    if (domain) {
                        if (!domain.includes('.youku.') || domain.includes('game')) {
                            轮播栏广告[index].parentElement.remove()
                            // console.log(轮播栏广告[index].parentElement)
                        }
                    }

                }
            }
            //动画轮播
            let 轮播栏广告2 = document.querySelectorAll('[class=" slideBox"][data-href]')
            for (let index = 0; index < 轮播栏广告2.length; index++) {
                let href = 轮播栏广告2[index].getAttribute('data-href');
                if (href) {
                    // 提取域名
                    //console.log(href)
                    const regex = /\/\/(.+)\//;
                    // 匹配 URL 字符串中的域名
                    const match = href.match(regex);
                    // 提取匹配结果中的域名
                    const domain = match && match[1];
                    if (domain) {
                        if (!domain.includes('.youku.') || domain.includes('game')) {
                            轮播栏广告2[index].parentElement.remove()
                        }
                    }
                }
            }
            console.log('优酷广告去除执行完成')
        }
    }
    //监测全屏状态
    function 监测全屏状态() {
        var targetNode = document.querySelector("body"); // 要监测的目标元素
        // console.log("蜀黍", targetNode);
        var observer = new MutationObserver(function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    // 如果发现目标元素的属性变化
                    if (mutation.attributeName === 'class') {
                        console.log('类名发生了变化:', targetNode.className);
                        const main_button = document.querySelector(".main_button");
                        const toggle_button = document.querySelector(".toggle_button");
                        if (targetNode.className === "tvplayer-fake-fullscreeen plugin_ctrl_fake_fullscreen") {
                            main_button.style.opacity = "0";
                            toggle_button.style.opacity = "0";
                        } else {
                            main_button.style.opacity = "1";
                            toggle_button.style.opacity = "1";
                        }
                    }
                }
            }
        });
        var config = { attributes: true, attributeFilter: ['class', 'dt-params'] };
        observer.observe(targetNode, config);
    }

    function 侧边栏按钮创建() {
        // 创建侧边栏开关按钮元素
        if (!location.hostname.includes('v.qq.')) {
            return;
        }
        const selectButton = document.createElement('div');
        selectButton.className = 'toggle_button';
        selectButton.textContent = '<';
        // 设置按钮样式
        selectButton.style.top = '40%';
        selectButton.style.color = 'rgb(55, 99, 57)';
        selectButton.style.background = 'linear-gradient(to right, rgb(220, 240, 176), rgba(252, 247, 224, 0.5))';
        selectButton.style.cursor = 'pointer';
        selectButton.style.zIndex = '9999';
        selectButton.style.position = 'fixed';
        selectButton.style.width = '15px';
        selectButton.style.height = '50px';
        selectButton.style.borderRadius = '2px';
        selectButton.style.lineHeight = '50px';
        selectButton.style.display = 'flex';
        selectButton.style.justifyContent = 'center'
        document.body.appendChild(selectButton);
        侧边栏调整()
    }
    //手动调整侧边剧集栏，初次打开网页，会自动收起侧边剧集栏
    function 侧边栏调整() {
        // 封装函数来处理侧边栏的显示和隐藏

        function toggleSidebar(selectButton) {
            var 展开侧边栏;
            //新版侧边栏，没有自带按钮
            const 自带收缩按钮 = document.querySelector('.player__wide-btn');
            const sidebar = document.querySelector('.page-content__right');
            if (自带收缩按钮) {
                dinglan = document.querySelector('.site_head.dd.site_head_channel');
                let 播放器 = document.querySelector('#player-container');
                var episode = document.querySelectorAll(".container-episode").length
                //判断自带的关闭侧边栏按钮
                var wideBtn = 自带收缩按钮;
                if (episode) {
                    if (wideBtn) {
                        wideBtn.click();
                        展开侧边栏 = false;
                    }
                } else {
                    if (wideBtn) {
                        wideBtn.click();
                        展开侧边栏 = true;
                    }
                }
                return;
            } else {
                let 播放器 = document.querySelector('#player-container');
                if (!播放器) {
                    return;
                }

                if (sidebar.style.display === 'none') {
                    // 恢复侧边栏
                    sidebar.style.display = '';
                    展开侧边栏 = true;
                } else {
                    // 关闭侧边栏
                    sidebar.style.display = 'none';
                    展开侧边栏 = false;
                }
            }
            //收缩展开侧边栏，并重新调整播放器大小
            if (展开侧边栏 === true) {
                selectButton.textContent = '<';
                var 播放器框架 = document.querySelector(".container-main__left")
                // 从元素中获取原始宽度和高度
                const originalWidth = 播放器.style.width;
                const originalHeight = 播放器.style.height;
                //新的高度site_head dd site_head_channel top-nav-wrap head_inner
                var dinglan = document.querySelector('.top-nav-wrap.head_inner');
                var newVideoHeight = window.innerHeight - dinglan.offsetHeight - 30;
                // 计算新的宽度
                //const newWidth = (parseInt(originalWidth) / parseInt(originalHeight)) * newVideoHeight;
                // 设置元素 player-container 的宽度
                //播放器.style.width = `${newWidth}px`;

                播放器.style.height = `${newVideoHeight}px`;
                console.log("新的播放器宽度", newVideoHeight)
                // 将修改后的宽度和高度保存在浏览器缓存中
                //localStorage.setItem('modifiedWidth', `${newWidth}px`);
                localStorage.setItem('modifiedHeight', `${newVideoHeight}px`);
            } else {
                selectButton.textContent = '>';
                // 从缓存中获取修改后的宽度和高度
                //const cachedWidth = localStorage.getItem('modifiedWidth');
                const cachedHeight = localStorage.getItem('modifiedHeight');
                // 设置元素 player-container 的宽度和高度
                //播放器.style.width = cachedWidth;
                播放器.style.height = cachedHeight;
            }
        }
        //侧边栏按钮点击
        const selectButton = document.querySelector('.toggle_button')
        selectButton.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            toggleSidebar(selectButton);
        });
        //绑定按钮元素移动
        selectButton.addEventListener('mousedown', function (e) {
            //dragMenu(selectButton, e);
        });
        if (localStorage.getItem('closesidebar') === "true") {
            toggleSidebar(selectButton);

        }
    }
    //元素移动函数

    //提示弹幕
    function showToast(message, isError) {
        // 创建新的提示框
        const toastContainer = document.createElement('div');
        // 设置样式属性
        toastContainer.style.position = 'fixed';
        toastContainer.style.justifyContent = 'center';
        toastContainer.style.top = '30%';
        toastContainer.style.left = '50%';
        toastContainer.style.width = '65vw';
        toastContainer.style.transform = 'translate(-50%, -50%)';
        toastContainer.style.display = 'flex';
        toastContainer.style.padding = '5px';
        toastContainer.style.fontSize = '20px';
        toastContainer.style.background = '#e7f4ff';
        toastContainer.style.zIndex = '999';
        toastContainer.style.borderRadius = '15px';
        toastContainer.classList.add('PopupMessage'); // 设置 class 名称为 PopupMessage
        // 根据是否为错误提示框添加不同的样式
        if (isError) {
            toastContainer.classList.add('success');
            toastContainer.style.color = '#3fc91d';
        } else {
            toastContainer.classList.add('error');
            toastContainer.style.color = '#CC5500';
        }
        // 将提示框添加到页面中
        document.body.appendChild(toastContainer);
        // 获取页面高度的 20vh
        const windowHeight = window.innerHeight;
        //设置最低的高度。
        const height = windowHeight * 0.2;
        // 设置当前提示框的位置
        toastContainer.style.top = `${height}px`;
        // 在页面中插入新的信息
        const toast = document.createElement('div');
        // 使用 <br> 实现换行
        toast.innerHTML = message.replace(/\n/g, '<br>');
        toastContainer.appendChild(toast);
        // 获取所有的弹出信息元素，包括新添加的元素
        const popupMessages = document.querySelectorAll('.PopupMessage');
        // 调整所有提示框的位置
        let offset = 0;
        popupMessages.forEach(popup => {
            if (popup !== toastContainer) {
                popup.style.top = `${parseInt(popup.style.top) - toast.offsetHeight - 5}px`;
            }
            offset += popup.offsetHeight;
        });
        // 在 3 秒后隐藏提示框
        setTimeout(() => {
            toastContainer.classList.add('hide');
            // 过渡动画结束后移除提示框
            setTimeout(() => {
                toastContainer.parentNode.removeChild(toastContainer);
            }, 300);
        }, 3000);
    }

    //监测激活状态
    function 监测激活状态() {
        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "visible") {
                // 浏览器窗口处于激活状态
                console.log("浏览器已激活");
                document.querySelector("body").click();
            } else {
                // 浏览器窗口处于非激活状态
                console.log("浏览器已非激活");
            }
        });

    }

    function 函数存放(函数) {
        // txp_videos_container
        if (函数 === "轮播栏广告小图") {
            if (localStorage.getItem('removewatermark') === "true") {
                var elements = document.querySelectorAll(".focus-item");
                elements.forEach(function (element) {
                    if (element.tagName === "A") {
                        // console.log("蜀黍", element.href);
                        if (element.href === "javascript:;") {
                            var 关闭广告 = document.querySelector(".close-creative");
                            if (关闭广告) {
                                if (关闭广告.title === "关闭广告") {
                                    关闭广告.click();
                                    console.log("移除轮播栏的广告成功")
                                    return;
                                } else {
                                    console.log("删除轮播栏的广告成功")
                                    element.remove();
                                    关闭广告 = document.querySelector(".close-creative");
                                    if (关闭广告.title === "关闭广告") {
                                        关闭广告.click();
                                        console.log("移除轮播栏的广告成功2")
                                        return;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
        if (函数 === "轮播栏广告播放") {
            if (localStorage.getItem('removewatermark') === "true") {
                var 轮播广告栏 = document.querySelectorAll('.focus-wrap.large-focus')
                if (轮播广告栏) {
                    var targetNode = document.querySelector(".close-creative");
                    if (targetNode) {
                        var adobserver = new MutationObserver(function (mutationsList, observer) {
                            for (var mutation of mutationsList) {
                                if (mutation.type === 'attributes' && mutation.attributeName === 'title') {
                                    if (mutation.target.title === "关闭广告") {
                                        mutation.target.click();
                                    }
                                }
                            }
                        });
                        var config = { attributes: true };
                        adobserver.observe(targetNode, config);
                    }
                }
            }
        }
        if (函数 === "去除视频水印") {
            if (localStorage.getItem('removewatermark') === "true") {
                if (document.querySelector("#player > txpdiv")) {
                    document.querySelector("#player > txpdiv").remove();
                    console.log("视频水印已去除1")
                }
                var watermarkElement = document.querySelector('.txp-watermark');
                if (watermarkElement) {
                    // 移除水印元素
                    watermarkElement.parentNode.removeChild(watermarkElement);
                    console.log("视频水印已去除2")
                }
            }
        }
        if (函数 === "页面样式修改") {
            if (localStorage.getItem('htmlbackground') === "true") {
                var 主题选择 = document.querySelector('#cars');
                if (主题选择) {
                    主题色选择(主题选择.value);
                } else {
                    let 主题 = "月光色";
                    主题色选择(主题);
                }
                if (location.hostname.includes('v.qq.')) {
                    var css = `
                    /*预约按钮*/
                    .video-subscribe-btn.order-normal-button {
                        background: rgb(251 128 2 / 75%)  !important;
                    }
                    body {
                        background: ${主题色} url(//vm.gtimg.cn/z/static/vplay/child-bg.png) !important;
                        --background: ${主题色} !important;
                    }
                    /*视频列表*/
                    .list-page-wrap{
                        background: ${主题色} !important;
                    }
                    /*视频列表-返回*/
                    .list-page-wrap .kinds-list-wrap{
                        background: ${主题色} !important;
                    }
                    ._footer-wrap_yjuq2_1 {
                        background: ${主题色} !important;
                    }
                    /*顶栏设置*/
                    .top-nav-wrap.top-nav-wrap-black {
                        /*background: linear-gradient(to bottom,${深主题色} ,${主题色});*/
                        background: ${主题色};
                    }
                    /*播放界面顶栏设置*/
                    #ssi-header{
                        --background: rgb(12 76 125 / 80%) !important;
                    }
                    // .top-nav-wrap[data-v-063bf321]{
                    //     background: ${主题色} ;
                    // }
                    .left-nav-wrap .logo-wrap{
                        /*background: linear-gradient(to bottom,${深主题色} ,${主题色});*/
                        background-image: linear-gradient(-90deg,rgba(20,20,20,0) 1%,rgba(20,20,20,0) 99%);
                    }
                    /*左侧菜单列表*/
                    .left-nav-wrap.let-nav-wrap-black{
                        background: ${主题色} !important;
                    }
                    // /*左侧菜单列表*/
                    // .left-nav-wrap .nav-wrap{
                    //     background: ${主题色} ;
                    // }
                    .sub-nav-group{
                        background-color:${深主题色}d9  !important;            
                    }
                    .video-card-wrap{
                        background: linear-gradient(to bottom, rgb(43, 43, 43), ${主题色}) !important;
                    }
                    /*视频图标变大*/
        
                      .video-card-wrap .video-card {
                        position: relative;
                      }
                      
                      .video-card-wrap .video-card::before {
                        content: "";
                        border-radius: 16px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: ${主题色}4d; /* 设置遮罩层的颜色和透明度 */
                        z-index: 1; /* 确保遮罩层位于元素之上 */
                        opacity: 0; /* 初始时遮罩层透明 */
                        transition: opacity 0.3s ease; /* 添加过渡效果 */
                        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3); /* 添加内阴影效果 */
                      }
                      
                      .video-card-wrap .video-card:hover::before {
                        opacity: 1; /* 鼠标悬停时遮罩层完全显示 */
                      }
                    .content.fixed{
                        background: ${主题色}d9 !important;
                    }
                    /*客户端下载*/
                    .pop_info_content.pop_client_wrap{
                        background: ${主题色}d9 !important;            
                    }
                    /*视频分类详情列表*/
                    .list-base-wrap[data-v-b9f874bd]{
                        background: ${主题色} ;
                    }
                    /*返回*/
                    .list-page-wrap .back-btn-wrap[data-v-fda3d7da]{
                        background: ${主题色} ;
                    }
                    .list-base-wrap .kinds-list-wrap .kinds-list-content .abbreviat-filters[data-v-b9f874bd]{
                        background: ${主题色} ;
                    }
                    /*置顶按钮*/
                    .list-base-wrap .goToTop[data-v-b9f874bd]{
                        background: ${深主题色}cc ;
                    }
                    .list-base-wrap .goToTop[data-v-b9f874bd]:hover{
                        background: ${深主题色}e6 ;
                    }
            /*播放页面*/
                    /*VIP提示*/
                    .vip-button__main-title--v2 {
                        color: ${VIP主题色} !important;
                    }
        
                    .playlist-side-fuild__container{
                        background: ${主题色}d9 !important;
                    }
                    .general-banner-adapt.filter-labels-wrap{
                        background: ${主题色}d9 !important;
                    }
                    .focus-wrap.large-focus {
                        box-shadow: 0px 0px 20px 21px rgb(3 21 26) !important;
                    }
                    /*分享列表*/
                    .playlist-intro__btns{
                        background: ${主题色} !important;
                    }
                    /*全集列表*/
                    .playlist-overlay{
                        background: ${主题色} !important;
                    }
                    /*历史记录*/
                    .quick_pop_tabs{
                        background: ${浅主题色} !important;
                    }
                    .mod_quick_videolist.mod_quick_videolist_history{
                        background: ${主题色} !important;
                    }
                    .quick_pop_footer{
                        background: ${浅主题色} !important;            
                    }
                    /*旧播放界面背景*/
                    .container-main__wrapper[data-v-e54bf460] {
                        background: ${浅主题色} ;    
                    }
                    /*提示框*/
                    .toast-wrap{
                        background: ${深主题色}d9 !important;   
                    }
                    /*反馈按钮*/
                    .x_fixed_tool{
                        background: ${主题色}d9 !important;
                    }
                    /*备案字体颜色*/
                    ._footer-wrap_yjuq2_1 * {
                        color: ${备案字体颜色} !important;
                    }
            /*旧播放器页面*/
                    /*评论背景*/
                    .container-bottom{
                        background: ${主题色} !important;
                    }
                    /*顶栏*/
                    .new_vs_header{
                        background: ${深主题色}d9 !important;   
                    }
                    /*顶栏字体*/
                    .site_channel .channel_nav {
                        color: ${亮色字体} ;
                    }
                    /*顶栏右边图标*/
                    .mod_quick .quick_link{
                        color: ${亮色字体} ;
                    }
        
                    .site_channel .channel_more{
                        color: ${亮色字体} !important; 
                    }
                    .site_head.dd.site_head_simple {
                        background: ${深主题色}d9 !important;   
                    }
                    /*备案栏*/
                    ._footer-wrap_momhz_1{
                        background: ${主题色} !important;
                    }
                    ._footer-wrap_momhz_1 * {
                        color: ${备案字体颜色} !important;
                    }
                    /*长文本按钮*/
                    .at-feed-stream-tab {
                        color: ${浅色字体} !important;
                    }
                    /*评论颜色*/
                    .at-feed__date{
                        color: ${浅色字体} !important;
                    }
                    /*未选择颜色*/
                    .at-feed-stream-tab__nav-item{
                        color: ${浅色字体} !important;
                    }
                    /*登陆颜色*/
                    .at-feed-stream-post__login{
                        color: ${浅色字体} !important;
                    }
                    .t-feed__date{
                                        color: ${备案字体颜色} !important;
                    }
                    /*无评论颜色*/
                    .at-feed-stream-tab .at-net-error__title{
                        color: ${浅色字体} !important;
                    }
                    /*长文本编写框*/
                    .mod-page__editor{
                        background: ${浅主题色} !important;
                     }
                     /*正文*/
                     .ql-container.ql-snow *{
                        background: ${浅主题色}  !important;
                     }
                     /**/
                     .mod-page__action{
                        background: ${浅主题色}00  !important;
                     }
                     .mod-card{
                        background: ${浅主题色}00  !important;
                     }
                     .mod-button.disabled {
                        background: ${深主题色}  !important;
                    }
                /*备案栏配置*/
                    .contentinfo_title{
                        color: ${深色字体} !important;
                    }
                    .mod_footer_contentinfo .foot_link{
                    color: ${浅色字体} !important;
                    }   
                    .mod_footer_contentinfo .dl_list .item{
                    color: ${浅色字体} !important; 
                    }
                    .mod_footer *{
                        color: ${浅色字体} !important; 
                    }
                    .cookie_textrea {
                        width: 0px;
                        /* 设置滚动条宽度 */
                    }
                
                    .cookie_textrea::-webkit-scrollbar {
                        width: 0px;
                        /* 设置滚动条宽度 */
                    }
                
                    .button:hover::after {
                        border-radius: 5px;
                        background-color: rgba(255, 255, 255, 0.3) !important;
                    }
                
                    .button:hover {
                        border-radius: 5px;
                        background-color: #70B9E8;
                    }
                
                    .button:active {
                        border-radius: 5px;
                        background: #2db628;
                        /* position: fixed; */
                        /* margin-bottom: 9px; */
                        text-shadow: none;
                        box-shadow: 10px 10px 10px rgba(0, 0, 0, .3) inset;
                    }
        
                    /*视频图标变大*/
                    .card.vertical {
                        transition: transform 0.3s ease; /* 添加过渡效果 */
                      }
                      
                      .card.vertical:hover {
                        transform: scale(1.2); /* 鼠标悬停时放大1.2倍 */
                      }
                    `;
                }

                //优酷主题
                if (location.hostname.includes('.youku.')) {
                    let css = `
                    
                #app{
                  background-color: ${主题色} ;
                }
                body {
                    background: ${主题色};
                }
                /*顶栏*/
                .topheader_top_header_box{
                    background-color:${深主题色}ab !important;
                }
                /*轮播栏阴影*/
                .focussidebarswiper_focus_wrap{
                    box-shadow: 0px 0px 20px 21px rgb(3 21 26) !important;
                }
                [data-theme=dark] .right-wrap{
                  background-color: ${主题色} ;
                }
                [class="preview_preview_wrap"]{
                    background-color:#deb406 ;
                }
                .preview_preview_wrap .preview_preview_pos .preview_preview_desc, .preview_preview_wrap_focus .preview_preview_pos .preview_preview_desc, .preview_preview_wrap_focus_out .preview_preview_pos .preview_preview_desc, .preview_preview_wrap_out .preview_preview_pos .preview_preview_desc{
                    color: #ffffff;
                }
                [data-theme=dark] .module-playbox-new .playbox-new .play-paction-wrap-new .nav-mamu-new{
                  background-color: ${深主题色}e0 ;
                }
                /*播放器左侧*/
                .play-top-container-new{
                  background-color: ${主题色} ;
                }
                #app{
                  background-color: ${主题色} ;
                }
                /*播放页面视频介绍*/
                [data-theme=dark] .bottom-area-wrap-new{
                  background-color: ${主题色} ;
                }
                /*主页顶栏*/
                .topheader_topheaderwrap{
                    background-color:${深主题色}cf !important;
                }
                .modulelist_s_body{
                    background-color: ${主题色} ;
                }
                .g-box{
                    border-radius: 10px;
                    background: linear-gradient(to bottom, ${深主题色} , ${主题色}61);
                }
                .pack_yk_pack_focus .pack_info_list{
                    background-color: ${深主题色};
                }
                .newswiper_swiper_wrap{
                    box-shadow: 0px 0px 20px 21px rgb(3 21 26) !important;
                }
                .preview_preview_wrap_focus{
                    background-color: ${深主题色};
                }
                .preview_preview_wrap.preview_posright{
                    background-color: ${深主题色};
                }
                .pack_yk_pack_v .pack_pack_cover, .pack_yk_pack_v .pack_vip_cover{
                    background-color: ${深主题色};
                }
                /*轮播栏*/
                .module_mod{
                    top: 70px;
                }
                /*轮播栏下选择按钮*/
                .channelcommon_container{
                    top: 50px;
                }
              `

                }
                //爱奇艺主题
                if (location.hostname.includes('.iqiyi.')) {
                    let css = `
                .qy-header.home2020.qy-header-fixed.qy-header--bg .header-wrap{
                    background-color: ${深主题色}cc;
                }
                .content-wrap[data-v-5baba7d6]{
                    background: linear-gradient(180deg,transparent,${主题色} 150px);
                }
                .qy20-h-carousel-wrap[data-v-e765da72], .qy20-h-carousel[data-v-e765da72]{
                    background: ${主题色} !important;
                }
                .ch-res[data-v-bc0d88da]{
                    
                    min-width: 100%;
                }
                .qy20-h-carousel__maskl{
                    background-image: linear-gradient(270deg, ${主题色} 0%, transparent) !important;
                }
                /*顶栏*/
                .qy-header.home2020.qy-header--absolute .header-wrap{
                    background: linear-gradient(180deg,${主题色}c9,#ff000000 150px);
                }
                .qy20-h-carousel__maskr{
                    background-image: linear-gradient(270deg, ${主题色} 0%, transparent) !important;
                }
                .tl-layout[data-v-5ed27594] {
                    width: 94%;
                    left: 2%;
                }
                /**/
                .qy-mod-list .qy-mod-li[data-v-5643dd65]{
                    border-radius: 10px;
                    background: linear-gradient(180deg,#e9182600,${深主题色}  150px);
                }
                .card-hover-animation{
                    background-color: ${深主题色}  !important;
                }
                .qy-header.home2020 .header-wrap{
                    background-color: ${深主题色};
                }
                .abs[data-v-3da728c4], .side-cont[data-v-3da728c4]{
                    background-color: ${主题色} ;
                }
  
                .qy-footer[data-v-48b3cf8e]{
                    background-color:${主题色} ;
                }
                .qy-dark{
                    background:${主题色} ;
                }
                    `
                }

                let style = document.createElement('style');
                style.type = 'text/css';
                style.textContent = css;
                document.head.appendChild(style);
            }
            // // 主页第一个列表栏
            // const parentElement = document.querySelector('[class="tl-layout"]');
            // if (parentElement) {
            //     // 创建要添加的元素
            //     const newElement = document.createElement("div");
            //     // 设置新元素的样式
            //     newElement.style.position = "relative";
            //     newElement.style.margin = "0 auto";
            //     newElement.style.width = "994px";
            //     newElement.style.height = "20px";
            //     newElement.style.minWidth = "100vw";
            //     newElement.style.background = `linear-gradient(to bottom, #151515, ${主题色} )`;
            //     newElement.style.overflow = "hidden";
            //     newElement.style.pointerEvents = "auto";
            //     // 将新元素添加到父元素的后面
            //     parentElement.insertAdjacentElement('beforebegin', newElement);
            // }
        }
        if (函数 === "窄版页面样式修改") {
            if (localStorage.getItem('htmlbackground') === "true") {
                let 主题选择 = document.querySelector('#cars');
                if (主题选择) {
                    主题色选择(主题选择.value);
                } else {
                    let 主题 = "月光色";
                    主题色选择(主题);
                }

                let css = `
                        /*视频展示背景图片框*/
                        .item_content {
                            border-radius: 9px;
                        }
                        `;
                // css2=`            /*顶栏背景*/
                // .mod_channel .site_header {
                //   background: ${主题色};
                // }
                // /*视频预览区*/
                // .mod_channel .container {
                //   background: ${主题色};
                // }
                // /*轮播栏背景*/
                // .mod_channel .swiper {
                //   background: ${主题色};
                // }
                // /*轮播栏页面数提示*/
                // .mod_channel .swiper-container .swiper_count {
                //   background: ${主题色};
                // }`
                var style = document.createElement('style');
                style.type = 'text/css';
                style.textContent = css;
                document.head.appendChild(style);
            }
        }
        if (函数 === "加载时可删除广告") {
            // 顶栏的游戏广告关闭按钮
            if (localStorage.getItem('removewatermark') === "true") {
                var quick_games = document.querySelector('.quick_item.quick_games');
                if (quick_games) {
                    quick_games.remove();
                }
                爱奇艺去广告();
            }
        }
        if (函数 === "去除游戏栏目") {
            if (localStorage.getItem('removewatermark') === "true") {
                removeElements();
                function removeElements() {
                    var pauseVideos = document.querySelectorAll("._nav-item_ugz17_31");
                    if (pauseVideos.length > 0) {
                        pauseVideos.forEach(function (video) {
                            var span = video.querySelector('span').textContent.trim();
                            console.log(span);
                            if (span === "游戏" || span === "传奇游戏库" || span === "棋牌游戏库" || span === "游戏中心") {
                                video.remove();
                                // console.log(2, span);
                            }
                        });
                    }
                }
                var elementsWithDtCmd = document.querySelectorAll('[dt-cmd]');
                // 遍历所有匹配的元素
                elementsWithDtCmd.forEach(function (element) {
                    // 在这里对每个元素执行您的操作
                    var text = element.textContent.trim();
                    if (text === "游戏" || text === "传奇游戏库" || text === "棋牌游戏库" || text === "游戏中心") {
                        element.parentNode.remove();
                        // console.log(element);
                    }
                });
                // 顶栏的全部视频里的
                var sub_nav_item = document.querySelectorAll(".sub-nav-item");
                // 遍历所有匹配的元素
                sub_nav_item.forEach(function (element) {
                    // 在这里对每个元素执行您的操作
                    var text = element.textContent.trim();
                    if (text === "游戏" || text === "传奇游戏库" || text === "棋牌游戏库" || text === "游戏中心") {
                        element.remove();
                        // console.log(element);
                    }
                });
                //顶栏上的
                var nav_all_text = document.querySelectorAll(".nav-all-text");
                // 遍历所有匹配的元素
                nav_all_text.forEach(function (element) {
                    // 在这里对每个元素执行您的操作
                    var text = element.textContent.trim();
                    if (text === "游戏" || text === "传奇游戏库" || text === "棋牌游戏库" || text === "游戏中心") {
                        element.textContent = "体育"
                        console.log(element);
                    }
                });
            }
        }
        if (函数 === "轮播栏广告播放") {

        }
        if (函数 === "轮播栏广告播放") {

        }
        if (函数 === "轮播栏广告播放") {

        }
        if (函数 === "去除app提示") {
            const open_app_bottom2 = document.querySelector('[dt-eid="open_app_bottom"]');
            if (open_app_bottom2) {
                open_app_bottom2.style.display = 'none'
                console.log('警察蜀黍11')
            }
            //打开app
            const openapp = document.querySelector('.site-top__open-app');
            if (openapp) {
                openapp.style.display = 'none'
                console.log('警察蜀黍22')
            }
            //继续使用浏览器
            const textbutton = document.querySelector('.at-app-banner--textbutton');
            if (textbutton) {
                textbutton.style.display = 'none'
                console.log('警察蜀黍33')
            }
            var 花絮资讯 = document.querySelectorAll('.title')
            for (let index = 0; index < 花絮资讯.length; index++) {
                if (花絮资讯[index].textContent = '花絮资讯') {
                    花絮资讯[index].remove()
                }
            }

            var 相关视频 = document.querySelector('.bottom-wrapper')?.remove();
            //var 预告视频=document.querySelector('.playlist.playlist--trival')?.remove()
            var 打开看完整版 = document.querySelector('.open-app.old-open')?.remove();
            //打开app播放

            var banner = document.querySelector('.at-app-banner');
            if (banner) {
                banner.style.display = "none";
            }

        }
    }
    function 主题色选择(主题) {
        if (主题 === "青色") {
            主题色 = "#083e4f";
            深主题色 = "#052935";
            浅主题色 = "#104353";
            VIP主题色 = "#ffb300";
            备案字体颜色 = '#5c96a9';
            浅色字体 = '#5a8b9b';
            亮色字体 = "#006f93";
            深色字体 = "#002835";
        } else {
            if (主题 === "金色") {
                主题色 = "#9d5901";
                深主题色 = "#673b01";
                浅主题色 = "#673b01";
                VIP主题色 = "#ffb300";
                备案字体颜色 = '#5c96a9';
                浅色字体 = '#5a8b9b';
                亮色字体 = "#22e56e";
                深色字体 = "#00210d";
            } else {
                if (主题 === "金黄色") {
                    主题色 = "#ffa500";
                    深主题色 = "#e59503";
                    浅主题色 = "#e59503";
                    VIP主题色 = "#ffb300";
                    备案字体颜色 = '#5c96a9';
                    浅色字体 = '#5a8b9b';
                    亮色字体 = "#22e56e";
                    深色字体 = "#00210d";
                } else {
                    if (主题 === "芒果色") {
                        主题色 = "#F5CBA3";
                        深主题色 = "#EB8F3B";
                        浅主题色 = "#F8D8BA";
                        VIP主题色 = "#ffb300";
                        备案字体颜色 = '#5c96a9';
                        浅色字体 = '#5a8b9b';
                        亮色字体 = "#22e56e";
                        深色字体 = "#00210d";
                    } else {
                        if (主题 === "神秘森林") {
                            主题色 = "#0F612F";
                            深主题色 = "#0A3E1E";
                            浅主题色 = "#5F9675";
                            VIP主题色 = "#ffb300";
                            备案字体颜色 = "#8bc1a0";
                            浅色字体 = '#5a8b9b';
                            亮色字体 = "#1ed163";
                            深色字体 = "#00210d";
                        } else {
                            if (主题 === "辣红色") {
                                主题色 = "#A91721";
                                深主题色 = "#6F0F15";
                                浅主题色 = "#B17D81";
                                VIP主题色 = "#ffb300";
                                备案字体颜色 = "#8bc1a0";
                                浅色字体 = '#5a8b9b';
                                亮色字体 = "#1ed163";
                                深色字体 = "#00210d";
                            } else {
                                if (主题 === "月光色") {
                                    主题色 = "#0C4C7D";
                                    深主题色 = "#072B47";
                                    浅主题色 = "#98B3C8";
                                    VIP主题色 = "#ffb300";
                                    备案字体颜色 = "#769dbb";
                                    浅色字体 = '#909ea9';
                                    亮色字体 = "#1ed163";
                                    深色字体 = "#00210d";
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    function 新窗口() {
        var 页面链接 = window.location.href;
        const iframeSrc = "https://jx.xmflv.com/?url=" + decodeURIComponent(页面链接);
        document.querySelector('[class="video-item-episode video-item-episode--active video-item-episode--num playlist__item"]')?.textContent

        window.open(iframeSrc);
        console.log('播放器框架2');
        let 播放器 = document.querySelectorAll('video')
        for (let index = 0; index < 播放器.length; index++) {
            播放器[index].pause();
            播放器[index].remove();

        }

    }

    function 覆盖按钮(需覆盖按钮) {
        // 找到body下第一个span元素
        //var firstSpan = document.querySelector('[class="c-album-item selected"]');
        var firstSpan = 需覆盖按钮
        // 创建一个透明的覆盖层
        var overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.className = '覆盖按钮';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'transparent';
        overlay.style.zIndex = '9999';
        新窗口()
        // 绑定点击事件到覆盖层
        overlay.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            // 在这里可以添加您希望执行的代码

        });

        // 将覆盖层添加到第一个span元素上面
        firstSpan.style.position = 'relative';
        firstSpan.style.zIndex = '9999';
        firstSpan.appendChild(overlay);
    }
    function 更新页面URL(url) {
        window.history.pushState(null, null, url);

    }
}

if (location.href.includes('.xmflv.')) {
    var cid;
    var 当前VID;
    var 当前标题 = '酷炫解析';
    样式创建();
    if (window.location.hostname.includes('xmflv.com')) {
        var 解析域名 = 'https://jx.xmflv.com/?url='
    } else {
        解析域名 = 'https://jx.xmflv.cc/?url='
    }
    判断是否是手机设备();
    页面关闭监测();
    解析网站广告();
    let 播放按钮 = document.querySelector('[class="art-icon art-icon-play"]')
    if (播放按钮) {
        if (播放按钮.style.display === 'none') {
            if (document.querySelector('[class="art-icon art-icon-pause"]')) {
            } document.querySelector('[class="art-icon art-icon-pause"]').click()
        }
    }
    创建视频列表主程序();
    判断视频组件加载();
    解析网站广告();
    监测解析网站全屏状态();
    function 判断视频组件加载() {
        var intervalId = setInterval(function () {
            if (document.querySelector('video')) {
                clearInterval(intervalId);
                监测播放状态();
                解析站创建主设置组件()
                判断历史记录();
                //创建下一集按钮();
                document.querySelector('[class="art-controls"]').appendChild(添加辅助功能());
                弹幕按钮状态();
                绑定热键();
                创建隐藏工具条按钮();
            }
        }, 1000);
    }
    function 创建视频列表主程序() {
        (function () {
            'use strict';
            var 解析地址 = decodeURIComponent(window.location.search);
            var cid;
            var vid;
            // 使用正则表达式匹配cid=之后的字母数字部分
            if (解析地址.includes('v.qq.')) {
                let match = 解析地址.match(/cid=([\w]+)&vid=([\w]+)/);
                if (match ? match[2] : '') {
                    cid = match[1];
                    vid = match[2];
                    取腾讯视频列表(cid, vid);
                } else {
                    match = 解析地址.match(/cover\/([\w]+)\/([\w]+)/);
                    if (match ? match[2] : '') {
                        cid = match[1];
                        vid = match[2];
                        取腾讯视频列表(cid, vid);
                    }
                }
            } else {
                if (解析地址.includes('.iqiyi.')) {
                    let match = 解析地址.match(/com\/([\w]+)/);
                    if (match ? match[1] : '') {
                        vid = match[1];
                        取爱奇艺视频主页JSON_GM(match[1]);
                    } else {
                        match = 解析地址.match(/cover\/([\w]+)/);
                        if (match) {
                            vid = match[1];
                            取爱奇艺视频主页JSON_GM(vid);
                        }
                    }
                } else {
                    if (解析地址.includes('.youku.')) {
                        let match = 解析地址.match(/id_(.*?)\.html/);
                        if (match ? match[1] : '') {
                            vid = match[1];
                            取优酷视频列表_GM(match[1]);
                        }
                    }
                }
            }

            function 取腾讯视频列表(cid, vid) {
                let 缓存剧集JSON = JSON.parse(localStorage.getItem('腾讯剧集JSON'))
                if (缓存剧集JSON) {
                    if (缓存剧集JSON.cid === cid && 缓存剧集JSON.获取时间 === 取当日时间戳()) {
                        缓存剧集JSON.vid = vid;
                        创建视频列表(缓存剧集JSON)
                        return;
                    }
                }
                var page_context;
                var 页数 = 0;
                var 总页数;
                var jsondata = {
                    "page_params": {
                        "req_from": "web_vsite",
                        "page_id": "vsite_episode_list",
                        "page_type": "detail_operation",
                        "id_type": "1",
                        "page_size": "",
                        "cid": "",
                        "vid": "",
                        "lid": "",
                        "page_num": "",
                        "page_context": "",
                        "detail_page_type": "1"
                    },
                    "has_cache": 1
                };
                jsondata.page_params.cid = cid;
                jsondata.page_params.vid = vid;
                var 剧集JSON = {};
                剧集JSON.列表 = [];
                剧集JSON.vid = vid;
                function 发送请求() {
                    console.log('JSON数据', JSON.stringify(jsondata))
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=3000010&vplatform=2&vversion_name=8.2.96',
                        data: JSON.stringify(jsondata),
                        headers: {
                            'Content-Type': 'application/json',
                            'accept': 'application/json, text/plain, */*',
                            'accept-language': 'zh-CN,zh;q=0.9',
                            'origin': 'https://v.qq.com',
                            'referer': 'https://v.qq.com/',
                            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102"',
                            'sec-ch-ua-mobile': '?0',
                            'sec-ch-ua-platform': '"Windows"',
                            'sec-fetch-dest': 'empty',
                            'sec-fetch-mode': 'cors',
                            'sec-fetch-site': 'same-site',
                            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36'
                        },
                        onload: function (response) {
                            // 处理响应
                            let 返回文本 = JSON.parse(response.responseText);
                            let post页数列表 = 返回文本.data.module_list_datas[0].module_datas[0].module_params.tabs;
                            let 视频列表 = 返回文本.data.module_list_datas[0].module_datas[0].item_data_lists.item_datas
                            for (let index = 0; index < 视频列表.length; index++) {
                                if (视频列表[index].item_params.union_title != '' && 视频列表[index].item_params.is_trailer === '0') {
                                    let json = {
                                        集数: index + 1,
                                        cid: cid,
                                        vid: 视频列表[index].item_params.vid,
                                        play_title: 视频列表[index].item_params.play_title,
                                        url: 解析域名 + 'https://m.v.qq.com/x/m/play?cid=' + cid + '&vid=' + 视频列表[index].item_params.vid
                                    }
                                    剧集JSON.列表.push(json)
                                }
                            }
                            if (post页数列表) {
                                总页数 = JSON.parse(post页数列表);
                            } else {
                                总页数 = []
                            }

                            页数++;
                            if (页数 < 总页数.length) {
                                //page_context = URL参数转POST(总页数[页数].page_context);
                                page_context = 总页数[页数].page_context;
                                jsondata.page_params.cid = cid;
                                jsondata.page_params.page_context = page_context;
                                console.log(页数, page_context, jsondata);
                                // 继续发送请求
                                发送请求();
                            } else {
                                // 所有页数都已获取，退出循环
                                console.log(剧集JSON)
                                console.log('所有页数已获取');
                                剧集JSON.cid = cid;
                                创建视频列表(剧集JSON)
                                剧集JSON.获取时间 = 取当日时间戳();
                                localStorage.setItem('腾讯剧集JSON', JSON.stringify(剧集JSON))
                            }

                        },
                        onerror: function (error) {
                            alert(error);
                        }
                    });
                }


                // 开始第一次请求
                发送请求();
            }
            function 取爱奇艺视频列表_GM(cid, vid) {
                let 缓存剧集JSON = JSON.parse(localStorage.getItem('爱奇艺剧集JSON'))
                if (缓存剧集JSON) {
                    if (缓存剧集JSON.cid === cid && 缓存剧集JSON.获取时间 === 取当日时间戳()) {
                        缓存剧集JSON.vid = vid
                        创建视频列表(缓存剧集JSON)

                        return;
                    }
                }
                var 剧集JSON = {}
                剧集JSON.列表 = [];
                剧集JSON.页数 = 1;
                剧集JSON.cid = cid;
                剧集JSON.vid = vid;
                function 发送请求() {
                    console.log('发送请求');
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://pub.m.iqiyi.com/h5/main/videoList/album/?albumId=${cid}&size=50&page=${剧集JSON.页数}&needPrevue=true&needVipPrevue=true`,
                        headers: {
                            'authority': 'pub.m.iqiyi.com',
                            'accept': '*/*',
                            'accept-language': 'zh-CN,zh;q=0.9',
                            'sec-ch-ua': '"Not A;Brand";v="99", "Chromium";v="102"',
                            'sec-ch-ua-mobile': '?0',
                            'sec-ch-ua-platform': '"Windows"',
                            'sec-fetch-dest': 'empty',
                            'sec-fetch-mode': 'cors',
                            'sec-fetch-site': 'same-site',
                            'user-agent': 'jdapp;android;8.3.5;9.3.7;;network/wifi;model/Mi Note 2;osVer/26;appBuild/71043;psn/|7;psq/1;uid/;adk/;ads/;pap/JA2015_311210|8.4.2|ANDROID 8.0.0;osv/8.0.0;pv/2.23;jdv/;ref/com.jingdong.app.mall.WebActivity;partner/huawei;apprpd/Home_Main;Mozilla/5.0 (Linux; Android 8.0.0; Mi Note 2 Build/OPR1.170623.032; wv)) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.99 Mobile Safari/537.36'
                        },
                        onload: function (response) {
                            // 处理响应
                            if (爱奇艺视频列表数据处理(cid, JSON.parse(response.responseText), 剧集JSON)) {
                                发送请求()
                            }
                        },
                        onerror: function (error) {
                            console.error(error);
                        }
                    });
                }

                // 开始第一次请求
                发送请求();
            }
            function 取优酷视频列表_GM(cid) {
                let 缓存剧集JSON = JSON.parse(localStorage.getItem('优酷剧集JSON'))
                if (缓存剧集JSON) {
                    if (缓存剧集JSON.cid === cid && 缓存剧集JSON.获取时间 === 取当日时间戳()) {
                        缓存剧集JSON.vid = vid
                        创建视频列表(缓存剧集JSON)
                        return;
                    }
                }
                加载腾讯cookie()
                var 剧集JSON = {}
                剧集JSON.列表 = [];
                剧集JSON.页数 = 1;
                剧集JSON.cid = cid;
                剧集JSON.vid = vid;
                function 发送请求() {
                    console.log('发送请求');
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://m.youku.com/video/id_${剧集JSON.cid}.html`,
                        headers: {
                            'user-agent': ' Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Mobile Safari/537.36'
                        },
                        onloadstart: function (response) {
                            console.log('请求开始', response);
                        },
                        onload: function (response) {
                            // 处理响应
                            let 响应json = response.responseText.match(/window.__INITIAL_DATA__ =(.+?);window.__PLATOCONFIG__ =/)[1];
                            if (响应json) {
                                console.dir(JSON.parse(响应json))

                            }
                            if (优酷视频数据处理(剧集JSON.cid, response.responseText, 剧集JSON)) {
                                发送请求()
                            }

                        },
                        onerror: function (error) {
                            console.error(error);
                        }
                    });
                }

                // 开始第一次请求
                发送请求();
            }
            function 加载腾讯cookie() {
                var cookieDomain = "xmflv.com";
                // 设置cookie字符串
                var cookieStr = 'x5sec=7b22617365727665722d686579693b32223a226663383030616662316364303762656165313337636439383361323663633366434b4b7679617747454b2f4c375a37382f2f2f2f2f774577676f48777a766a2f2f2f2f2f41513d3d222c22733b32223a2261343236396338303436613431336364227d;';
                if (cookieStr) {
                    // 分割cookie字符串
                    if (cookieStr.trim() !== "") {
                        var cookies = cookieStr.split(";");
                        if (cookies.length > 0) {
                            // 遍历每个cookie，并设置为对应的键值对
                            cookies.forEach(function (cookie) {
                                var keyValue = cookie.trim().split("=");
                                var key = keyValue[0];
                                var value = keyValue[1];
                                // 设置cookie
                                document.cookie = key + "=" + encodeURIComponent(value) + "; domain=" + cookieDomain + "; path=/;";
                            });
                        } else {
                            showToast("请不包含有cookie信息。");
                        }
                    } else {
                        showToast("请填写cookie信息。");
                    }
                } else {
                    showToast("编辑框元素丢失了。");
                }

            }
            function 优酷视频数据处理(vid, data, 剧集JSON) {
                let 返回JSON = data.match(/window.__INITIAL_DATA__ =(.+?);window.__PLATOCONFIG__ =/)[1];
                if (返回JSON !== null) {
                    返回JSON = JSON.parse(返回JSON);
                    let 视频列表路径;
                    for (let index = 0; index < 返回JSON.componentList.length; index++) {
                        if (返回JSON.componentList[index].componentName === '播放页选集') {
                            视频列表路径 = 返回JSON.componentList[index].dataNode;
                        } else {
                        }
                    }
                    // if(parseInt(视频列表路径[0].data.stage)!=1){
                    //     剧集JSON.cid = 视频列表路径[0].data.action.value;
                    //     return true;
                    // }
                    for (let index = 0; index < 视频列表路径.length; index++) {
                        let 片子类型 = 视频列表路径[index].data.videoType
                        if (片子类型 === '正片') {
                            var isExist = 剧集JSON.列表.find(function (item) {
                                return item.vid === 视频列表路径[index].data.action.value;
                            });
                            // 如果不存在相同的cid和vid，则进行插入操作
                            if (!isExist) {
                                var json = {
                                    集数: 视频列表路径[index].data.stage,
                                    cid: vid,
                                    stage: 视频列表路径[index].data.stage,
                                    vid: 视频列表路径[index].data.action.value,
                                    play_title: `${返回JSON.videoMap.showName}_${视频列表路径[index].data.stage}_${视频列表路径[index].data.title}`,
                                    url: 解析域名 + `https://v.youku.com/v_show/id_${视频列表路径[index].data.action.value}.html`
                                };
                                剧集JSON.列表.push(json);
                            }
                        }
                    }

                    let 最后一集 = 返回JSON.videoMap.episodeLast;
                    if (parseInt(json.stage) === parseInt(最后一集)) {
                        console.dir('所有页数已获取', 剧集JSON)
                        剧集JSON.cid = cid;
                        剧集JSON.获取时间 = 取当日时间戳();
                        localStorage.setItem('优酷剧集JSON', JSON.stringify(剧集JSON))
                        创建视频列表(剧集JSON)
                        return false;
                    } else {
                        剧集JSON.cid = json.vid;
                        return true;
                    }
                }
            }
            function 爱奇艺视频列表数据处理(cid, data, 剧集JSON) {
                if (data.data?.videos) {
                    var 返回文本 = data;
                    let 视频列表 = 返回文本.data?.videos
                    console.log(返回文本, 视频列表)
                    for (let index = 0; index < 视频列表.length; index++) {
                        if (视频列表[index].type === 1) {
                            let json = {
                                集数: index + 1,
                                cid: cid,
                                vid: 视频列表[index].pageUrl.match(/com\/([\w]+)/)[1],
                                play_title: 视频列表[index].shortTitle,
                                url: 解析域名 + 视频列表[index].pageUrl
                            }
                            剧集JSON.列表.push(json)
                        }
                    }
                    剧集JSON.页数++;
                    return true;
                } else {
                    // 所有页数都已获取，退出循环
                    console.log(剧集JSON)
                    console.log('所有页数已获取');
                    创建视频列表(剧集JSON)
                    剧集JSON.获取时间 = 取当日时间戳();
                    localStorage.setItem('爱奇艺剧集JSON', JSON.stringify(剧集JSON))
                    return false;
                }
            }
            function 创建视频列表(剧集JSON) {
                创建剧集选择按钮();
                let 剧集盒子 = 剧集盒子创建();
                let 当前页数 = 1;
                let 每页数量 = 110;
                let 总页数 = Math.ceil(剧集JSON.列表.length / 每页数量);
                let 页数 = document.createElement('div');
                页数.className = '页数';
                页数.style.height = '50px';
                页数.style.width = '100%';
                页数.style.display = 'flex';
                页数.style.zIndex = '999';
                页数.style.borderRadius = '12px 12px 0px 0px';
                页数.style.background = 'rgb(0 0 0 / 18%)';
                剧集盒子.appendChild(页数);
                let 当前集数 = 0;
                let 添加数 = 0;
                for (let i = 0; i < 总页数; i++) {
                    let 视频剧集列表 = 视频剧集列表创建(剧集盒子);
                    for (let j = i * 每页数量; j < Math.min((i + 1) * 每页数量, 剧集JSON.列表.length); j++) {
                        let 视频剧集 = document.createElement('div');
                        视频剧集.className = '视频剧集';
                        视频剧集.textContent = 剧集JSON.列表[j].集数;
                        视频剧集.setAttribute('剧集名', 剧集JSON.列表[j].play_title);
                        视频剧集.setAttribute('vid', 剧集JSON.列表[j].vid);
                        视频剧集.setAttribute('cid', 剧集JSON.cid);
                        视频剧集.setAttribute('url', 剧集JSON.列表[j].url);
                        视频剧集.style.height = '30px';
                        视频剧集.style.width = '30px';
                        视频剧集.style.lineHeight = '30px';
                        视频剧集.style.borderRadius = '12px';
                        视频剧集.style.display = 'flex';
                        视频剧集.style.justifyContent = 'center';
                        //视频剧集.style.background = '#ff6c00';
                        视频剧集.style.margin = '3px';
                        视频剧集列表.appendChild(视频剧集);
                        添加数++;
                        视频剧集.addEventListener('click', function () {
                            location.href = 视频剧集.getAttribute('url');
                            剧集盒子.style.display = 'none';
                        })
                    }

                    let 页数子元素 = document.createElement('div');
                    console.log(i,)
                    页数子元素.className = '页数子元素';
                    页数子元素.textContent = (当前集数 + 1) + '-' + 添加数
                    当前集数 = Math.min((i + 1) * 每页数量);
                    页数子元素.style.height = '30px';
                    页数子元素.style.width = '70px';
                    页数子元素.style.lineHeight = '30px';
                    页数子元素.style.display = 'flex';
                    页数子元素.style.justifyContent = 'center';
                    页数子元素.style.borderRadius = '12px';
                    页数子元素.style.margin = '0px 3px 0px 3px';
                    页数子元素.addEventListener('click', function () {
                        切换视频剧集列表(i + 1);
                    });
                    页数.appendChild(页数子元素);
                }

                // 默认显示第一页的视频剧集列表
                切换视频剧集列表(当前页数);
                创建下一集按钮();
                当前剧集(剧集JSON.vid);
            }

            function 取腾讯视频列表_废弃(cid, vid) {
                let 缓存剧集JSON = JSON.parse(localStorage.getItem('腾讯剧集JSON'))
                if (缓存剧集JSON) {
                    if (缓存剧集JSON.cid === cid && 缓存剧集JSON.获取时间 === 取当日时间戳()) {
                        缓存剧集JSON.vid = vid;
                        创建视频列表(缓存剧集JSON)
                        return;
                    }
                }
                var page_context;
                var 页数 = 0;
                var 总页数;
                var jsondata = { "page_params": { "req_from": "web_mobile", "page_id": "vsite_episode_list", "page_type": "detail_operation", "id_type": "1", "cid": "omcczahf3t2sye4", "vid": "y0019zkakfv", "lid": "", "page_size": "50" }, "has_cache": 1 };
                jsondata.page_params.cid = cid;
                jsondata.page_params.vid = vid;
                var 剧集JSON = {};
                剧集JSON.列表 = [];
                剧集JSON.vid = vid;
                function 发送请求() {
                    console.log('JSON数据', JSON.stringify(jsondata))
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://pbaccess.video.qq.com/trpc.universal_backend_service.page_server_rpc.PageServer/GetPageData?video_appid=1200029&vplatform=2',
                        data: JSON.stringify(jsondata),
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                            'Accept-Encoding': 'gzip, deflate, br',
                            'Accept-Language': 'zh-CN,zh;q=0.9',
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Cookie': 'pgv_pvid=99f2863be9515d54; video_omgid=e05169a47f71dc12a87a4ec66d385f9e; vversion_name=8.5.50; _qimei_uuid42=17c1907091b1002cb915a0513ccfc4d871a0a846d1; video_platform=2',
                            'Origin': 'https://m.v.qq.com',
                            'Referer': 'https://m.v.qq.com/',
                            'Sec-Fetch-Dest': 'empty',
                            'Sec-Fetch-Mode': 'cors',
                            'Sec-Fetch-Site': 'same-site',
                            'User-Agent': 'jdapp;android;8.3.5;9.3.7;;network/wifi;model/Mi Note 2;osVer/26;appBuild/71043;psn/|7;psq/1;uid/;adk/;ads/;pap/JA2015_311210|8.4.2|ANDROID 8.0.0;osv/8.0.0;pv/2.23;jdv/;ref/com.jingdong.app.mall.WebActivity;partner/huawei;apprpd/Home_Main;Mozilla/5.0 (Linux; Android 8.0.0; Mi Note 2 Build/OPR1.170623.032; wv)) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.99 Mobile Safari/537.36'
                        },
                        onload: function (response) {
                            // 处理响应
                            let 返回文本 = JSON.parse(response.responseText);
                            let post页数列表 = 返回文本.data.module_list_datas[0].module_datas[0].module_params.tabs;
                            let 视频列表 = 返回文本.data.module_list_datas[0].module_datas[0].item_data_lists.item_datas
                            for (let index = 0; index < 视频列表.length; index++) {
                                if (视频列表[index].item_params.union_title != '' && 视频列表[index].item_params.is_trailer === '0') {
                                    let json = {
                                        cid: cid,
                                        vid: 视频列表[index].item_params.vid,
                                        play_title: 视频列表[index].item_params.play_title,
                                        url: 解析域名 + 'https://m.v.qq.com/x/m/play?cid=' + cid + '&vid=' + 视频列表[index].item_params.vid
                                    }
                                    剧集JSON.列表.push(json)
                                }
                            }
                            总页数 = JSON.parse(post页数列表);
                            页数++;
                            if (页数 < 总页数.length) {
                                //page_context = URL参数转POST(总页数[页数].page_context);
                                page_context = 总页数[页数].page_context;
                                jsondata.page_params.cid = cid;
                                jsondata.page_params.page_context = page_context;
                                console.log(页数, page_context, jsondata);
                                // 继续发送请求
                                发送请求();
                            } else {
                                // 所有页数都已获取，退出循环
                                console.log(剧集JSON)
                                console.log('所有页数已获取');
                                剧集JSON.cid = cid;
                                创建视频列表(剧集JSON)
                                剧集JSON.获取时间 = 取当日时间戳();
                                localStorage.setItem('腾讯剧集JSON', JSON.stringify(剧集JSON))
                            }

                        },
                        onerror: function (error) {
                            console.error(error);
                        }
                    });
                }


                // 开始第一次请求
                发送请求();
            }
            //创建爱奇艺视频列表(JS)

            function 取爱奇艺视频主页JSON_GM(vid) {
                var page_context;
                var 页数 = 0;
                var 总页数;

                function 发送请求() {
                    console.log('发送请求');
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://www.iqiyi.com/${vid}.html`,
                        headers: {
                            'authority': ' m.iqiyi.com',
                            'accept': ' text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                            'accept-language': 'zh-CN,zh;q=0.9',
                            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102"',
                            'sec-ch-ua-mobile': '?0',
                            'sec-ch-ua-platform': '"Windows"',
                            'sec-fetch-dest': 'empty',
                            'sec-fetch-mode': 'cors',
                            'sec-fetch-site': 'same-site',
                            'user-agent': 'jdapp;android;8.3.5;9.3.7;;network/wifi;model/Mi Note 2;osVer/26;appBuild/71043;psn/|7;psq/1;uid/;adk/;ads/;pap/JA2015_311210|8.4.2|ANDROID 8.0.0;osv/8.0.0;pv/2.23;jdv/;ref/com.jingdong.app.mall.WebActivity;partner/huawei;apprpd/Home_Main;Mozilla/5.0 (Linux; Android 8.0.0; Mi Note 2 Build/OPR1.170623.032; wv)) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.99 Mobile Safari/537.36'
                        },
                        onload: function (response) {
                            // 处理响应 ;
                            var match = response.responseText.match(/albumId":(\d+)/);
                            if (match ? match[1] : '') {
                                取爱奇艺视频列表_GM(match[1], vid);
                            }
                        },
                        onerror: function (error) {
                            console.error(error);
                        }
                    });
                }

                // 开始第一次请求
                发送请求();
            }
        })();
    }
    function 设置元素置顶位置(元素){
        var viewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
        var calculatedValue = -1 * viewportHeight + 50;
        元素.style.top = calculatedValue + 'px'
    }
    function 创建隐藏工具条按钮() {
        var 隐藏 = document.createElement('div')
        隐藏.className = '隐藏'
        隐藏.textContent = '隐藏'
        设置元素置顶位置(隐藏);
        隐藏.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            if (document.querySelector("#xmflv > div")) {
                document.querySelector("#xmflv > div").className = 'art-video-player art-subtitle-show art-layer-show art-backdrop art-mobile art-hide-cursor';
            }

        })
        document.querySelector('[class="art-controls"]').appendChild(隐藏)

        let css = `
                .隐藏{
                        display: flex;
                        line-height: 20px;
                        color: black;
                        position: absolute;
                        right: 10px;
                        background: blanchedalmond;
                        width: 40px;
                        height: 20px;
                        z-index: 999;
                        justify-content: center;
                    }
                    .隐藏:hover{
                        background: #00aeec;
                    }
                    .隐藏:active{
                        background: #ff8100;
                    }
                `
        let css样式 = document.createElement('style')
        css样式.textContent = css
        css样式.type = "text/css"
        document.head.appendChild(css样式)
    }
    function 弹幕按钮状态() {
        let 弹幕开关 = document.querySelector('[class="art-icon art-icon-danmu-on"]');
        if (弹幕开关) {
            if (localStorage.getItem('弹幕开关') === 'true') {
                if (弹幕开关.style.display === 'none') {
                    弹幕开关.click();
                }
            } else {
                if (弹幕开关.style.display != 'none') {
                    弹幕开关.click();
                }
            }
        }
    }
    function 判断历史记录() {
        let 未登录 = document.querySelector('[class="record__unlogin __web-inspector-hide-shortcut__"]')
        if (未登录) {
            未登录.remove()
            let 历史记录 = localStorage.getItem('历史记录')
            if (!历史记录) {
                历史记录 = [];
            }
            let js = {
                标题: document.title,
                url: location.href,
                日期: 取当前时间()
            }
            历史记录.push(js)

        }
    }


    function 创建下一集按钮() {
        // 创建 div 元素
        if (document.querySelector('[class="art-control art-control-btn-next hint--rounded hint--top"]')) {
            return;
        }
        var div = document.createElement('div');
        // 添加 class 属性
        div.className = 'art-control art-control-btn-next hint--rounded hint--top';
        // 添加 data-index 和 aria-label 属性
        div.setAttribute('data-index', '25');
        div.setAttribute('aria-label', '下一集');
        // 创建 svg 元素
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('t', '1683908412710');
        svg.setAttribute('class', 'icon');
        svg.setAttribute('viewBox', '0 0 1024 1024');
        svg.setAttribute('version', '1.1');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('p-id', '1649');
        svg.setAttribute('width', '32');
        svg.setAttribute('height', '32');
        // 创建 path 元素
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M665.47 417.65l-345.03-244.3c-69.8-49.42-166.29 0.49-166.29 86.01v502.27c0 85.52 96.49 135.43 166.29 86.01l345.03-244.31c64.02-45.34 64.02-140.34 0-185.68zM811.82 868.52c-30.38 0-55-24.62-55-55V207.46c0-30.38 24.62-55 55-55s55 24.62 55 55v606.07c0 30.37-24.62 54.99-55 54.99z');
        path.setAttribute('p-id', '1650');
        path.setAttribute('fill', '#ffffff');
        // 将 path 元素添加到 svg 元素中
        svg.appendChild(path);
        // 将 svg 元素添加到 div 元素中
        div.appendChild(svg);
        div.addEventListener('click', function (event) {
            event.stopPropagation(); // 阻止事件冒泡
            event.preventDefault(); // 阻止默认行为
            点击下一集(document.querySelector('video'))
        })
        // 将创建的 div 元素添加到音量按钮后面
        var count = 0;
        var timeoutId = setTimeout(function checkVolumeControl() {
            var volumeControl = document.querySelector('[class="art-control art-control-volume"]');
            if (volumeControl) {
                // 添加元素的逻辑
                volumeControl.insertAdjacentElement('afterend', div);
                clearTimeout(timeoutId); // 满足条件后停止 setTimeout
            } else {
                count++;
                if (count < 5) {
                    setTimeout(checkVolumeControl, 1000);
                }
            }
        }, 0);

    }

    document.title = 当前标题;
    console.log("页面已经激活");
    // 在这里执行你需要的操作
    let intervalId = setInterval(function () {
        document.title = 当前标题;
    }, 1000); // 每秒更改一次标题


    function 当前剧集(VID) {
        当前VID = VID;
        let 剧集列表 = document.querySelectorAll('.视频剧集列表')
        for (let i = 0; i < 剧集列表.length; i++) {
            let 剧集 = 剧集列表[i].querySelectorAll('.视频剧集')
            for (let index = 0; index < 剧集.length; index++) {
                if (剧集[index].getAttribute('VID') === VID) {
                    切换视频剧集列表(i + 1)
                    剧集[index].style.background = 'green';
                    剧集列表[i].scrollTop = 剧集[index].offsetTop - 剧集[index].offsetHeight - 30
                    当前标题 = 剧集[index].getAttribute('剧集名');
                    document.title = 当前标题
                    break;
                }
            }

        }
    }
    function 剧集盒子创建() {
        document.querySelector('.剧集盒子')?.remove()
        let 剧集盒子 = document.createElement('div');
        剧集盒子.className = '剧集盒子';
        剧集盒子.style.borderRadius = '12px';
        剧集盒子.style.background = 'rgb(0 0 0 / 50%)';
        if (判断是否是手机设备()) {
            剧集盒子.style.left = '10px';
        } else {
            剧集盒子.style.left = 'calc(100vw - 295px)';
        }
        剧集盒子.style.position = 'absolute';
        剧集盒子.style.height = '310px';
        剧集盒子.style.width = '290px';
        剧集盒子.style.bottom = '70px';
        剧集盒子.style.zIndex = '999';
        剧集盒子.style.display = 'none';
        //document.body.appendChild(剧集盒子);
        document.querySelector('[class="art-controls"]').appendChild(剧集盒子);
        剧集盒子点击判断(剧集盒子);
        return 剧集盒子;
    }
    function 视频剧集列表创建(剧集盒子, 集数) {
        let 视频剧集列表 = document.createElement('div');
        视频剧集列表.className = '视频剧集列表';
        视频剧集列表.style.width = '100%';
        视频剧集列表.style.height = 'calc(100% - 60px)';
        视频剧集列表.style.display = 'flex';
        视频剧集列表.style.flexWrap = 'wrap';
        视频剧集列表.style.overflowY = 'auto';
        视频剧集列表.style.borderRadius = '0px 0px 12px 12px';
        视频剧集列表.style.alignContent = 'flex-start';
        视频剧集列表.setAttribute('集数', 集数)
        剧集盒子.appendChild(视频剧集列表);
        return 视频剧集列表;
    }
    function 样式创建() {
        let css = `
            ..art-bottom .art-progress .art-control-progress{
                height: 25px !important;
            }
            .art-control.art-control-progress{
                height: 25px !important;
            }
            .视频剧集列表::-webkit-scrollbar {
            width: 0px;
            }
            .剧集选择 {
                color:  rgba(0, 0, 0, 0.5);
            }
            @media (hover: none) and (max-width: 768px) {
                .剧集选择 {
                    color:#ffc107;
                    /* 在移动设备上添加其他样式 */
                }
                .art-control.art-control-time{
                    top: -60px;
                    left: 0px;
                    position: absolute;
                }
                .art-video-player .art-layer-auto-playback{
                    bottom: 90px;
                }
            }
            .剧集选择:hover {
                user-select: none;
                cursor: pointer;
                border-radius: 25px;
                color: green ;
            }
            .页数 {
            overflow-x: scroll;
            white-space: nowrap;
            }
            .页数::-webkit-scrollbar {
            width: 0px;
            }
            .页数子元素 {
            user-select: none;
            background: green ;
            padding: 0px 4px 0px 4px;
            width: 60px;
            height: 30px;
            }

            .页数子元素:hover {
                cursor: pointer;
                user-select: none;
                border-radius: 5px;
                background: #70B9E8 ;
            }

            .页数子元素:hover::after {
                border-radius: 5px;
                background: rgba(255, 255, 255, 0.3) ;
            }
            .视频剧集:active {
                background: #b1a125;/* 点击时的颜色 */
            }
            .视频剧集{
            user-select: none;
            background: rgb(203 103 0);

            }
            .视频剧集:hover::after {
                border-radius: 25px;
                background: rgba(255, 255, 255, 0.3) ;
            }

            .视频剧集:hover {
                user-select: none;
                cursor: pointer;
                border-radius: 25px;
                background: #70B9E8 ;
            }
            .视频剧集:active {
                background: #b1a125;/* 点击时的颜色 */
            }
            .main_button{
                color: rgb(104 107 104) ;
                background: white;
            }
            .设置面板:hover {
                user-select: none;
                cursor: pointer;
                border-radius: 25px;
                color: green ;
            }
            #saveButton{
                color: #333333 ;
            }
            #saveButton:hover{
                color: green ;
            }
            #saveButton:active{
                color: #00b4f8 ;
            }
            .main_button:hover {
                color: green ;
            }
            `;

        if (document.querySelector('.custom')) {
            document.querySelector('.custom').remove()
        }
        var style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        style.className = "custom";
        document.head.appendChild(style);
    }

    function 创建剧集选择按钮() {
        document.querySelector('.剧集选择')?.remove()
        var interval = setInterval(function () {
            var 工具条 = document.querySelector(".art-controls");
            if (工具条) {
                clearInterval(interval); // 停止循环
                var selectButton = document.createElement('button');
                selectButton.className = '剧集选择';
                selectButton.style.width = '40px';
                selectButton.style.height = '29px';
                selectButton.style.borderRadius = '10px';
                selectButton.textContent = 'V';
                selectButton.style.border = '0';
                var thirdChild = 工具条.children[2];
                工具条.insertBefore(selectButton, thirdChild);

                selectButton.addEventListener('click', function () {
                    let 视频列表盒子 = document.querySelector('.剧集盒子')
                    if (视频列表盒子) {
                        if (视频列表盒子.style.display === 'none') {
                            视频列表盒子.style.display = 'block';
                            当前剧集(vid);
                        } else {
                            视频列表盒子.style.display = 'none';
                        }
                    }
                });
            }
        }, 1000);
    }
    function 取爱奇艺视频主页JSON(cid) {
        var page_context;
        var 页数 = 0;
        var 总页数;
        function 发送请求() {
            console.log('发送请求');
            fetch(`https://www.iqiyi.com/${cid}.html`, {
                method: 'GET',
                headers: {
                    'authority': ' m.iqiyi.com',
                    'accept': ' text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'jdapp;android;8.3.5;9.3.7;;network/wifi;model/Mi Note 2;osVer/26;appBuild/71043;psn/|7;psq/1;uid/;adk/;ads/;pap/JA2015_311210|8.4.2|ANDROID 8.0.0;osv/8.0.0;pv/2.23;jdv/;ref/com.jingdong.app.mall.WebActivity;partner/huawei;apprpd/Home_Main;Mozilla/5.0 (Linux; Android 8.0.0; Mi Note 2 Build/OPR1.170623.032; wv)) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.99 Mobile Safari/537.36'
                }
            })
                .then(response => response.text())
                .then(data => {
                    // 处理响应

                    let domObject = 元素转DOM对象(data);
                    //document.body.appendChild(domObject.documentElement);
                    let script = domObject.querySelectorAll('script')
                    for (let index = 0; index < script.length; index++) {

                        if (script[index].innerHTML.includes("window.__INITIAL_STATE__")) {

                            var script2 = document.createElement('script');
                            script2.innerHTML = script[index].innerHTML;
                            document.head.appendChild(script2);
                            if (window.__INITIAL_STATE__) {
                                //console.log("脚本内容包含 window.__INITIAL_STATE__", JSON.stringify(window.__INITIAL_STATE__));
                                取爱奇艺视频列表_GM(window.__INITIAL_STATE__.play.videoInfo.aid)
                            }
                            script2.remove();
                        } else {
                            console.log("脚本内容不包含 window.__INITIAL_STATE__");
                        }
                    }


                })
                .catch(error => {
                    console.error(error);
                });
        }

        // 开始第一次请求
        发送请求();
    }
    function 源码script处理(源码) {
        let domObject = 元素转DOM对象(源码);
        //document.body.appendChild(domObject.documentElement);
        let script = domObject.querySelectorAll('script')
        for (let index = 0; index < script.length; index++) {

            if (script[index].innerHTML.includes("window.__INITIAL_STATE__")) {

                var script2 = document.createElement('script');
                script2.className = '临时加载'
                script2.innerHTML = script[index].innerHTML;
                //document.head.appendChild(script2);
                unsafeWindow.document.head.appendChild(script2);
                if (window.__INITIAL_STATE__) {
                    //console.log("脚本内容包含 window.__INITIAL_STATE__", JSON.stringify(window.__INITIAL_STATE__));
                    取爱奇艺视频列表_GM(window.__INITIAL_STATE__.play.videoInfo.aid)
                }
                script2.remove();
            } else {
                console.log("脚本内容不包含 window.__INITIAL_STATE__");
            }
        }
    }
    function 取爱奇艺视频列表2(cid) {
        var 页数 = 1;
        var 总页数;
        var js = {
            剧集JSON: [],
            页数: 1
        }
        function 发送请求() {
            console.log('发起第一次请求')
            fetch(`https://pub.m.iqiyi.com/h5/main/videoList/album/?albumId=${cid}&size=50&page=${页数}&needPrevue=true&needVipPrevue=true`, {
                method: 'GET',
                headers: {
                    'authority': ' pub.m.iqiyi.com',
                    'accept': ' */*',
                    'accept-language': 'zh-CN,zh;q=0.9',
                    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'user-agent': 'jdapp;android;8.3.5;9.3.7;;network/wifi;model/Mi Note 2;osVer/26;appBuild/71043;psn/|7;psq/1;uid/;adk/;ads/;pap/JA2015_311210|8.4.2|ANDROID 8.0.0;osv/8.0.0;pv/2.23;jdv/;ref/com.jingdong.app.mall.WebActivity;partner/huawei;apprpd/Home_Main;Mozilla/5.0 (Linux; Android 8.0.0; Mi Note 2 Build/OPR1.170623.032; wv)) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.99 Mobile Safari/537.36'
                }
            })
                .then(response => response.json())
                .then(data => {
                    爱奇艺视频列表数据处理(data, js)
                })
                .catch(error => {
                    console.error(error);
                });
        }

        // 开始第一次请求
        发送请求();
    }
    function 解析网站广告() {
        function 解析网站广告子程序() {
            var 解析暂停广告 = document.getElementById('adv_wrap_hh');
            if (解析暂停广告) {
                解析暂停广告.remove();
                console.log("删除解析网站暂停广告", "interactiframe");
            } else {
                clearInterval(定时器);
            }
        }
        var 定时器 = setInterval(解析网站广告子程序, 1000);
    }
    function 取当日时间戳() {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // 将时间部分设置为0，只保留日期部分
        const timestamp = currentDate.getTime() / 1000; // 获取时间戳（秒）
        return timestamp;
    }
    function 解析站创建主设置组件() {
        'use strict';
        // 创建设置按钮
        var settingButton = document.createElement('button');
        settingButton.className = 'main_button';
        settingButton.style.top = '50%';
        settingButton.innerHTML = '设置';

        //settingButton.style.color = '#376339';
        //settingButton.style.background = "linear-gradient(to right, #DCF0B0, rgba(252, 247, 224, 0.5))";
        settingButton.style.cursor = 'pointer';
        settingButton.style.zIndex = '9999';
        settingButton.style.margin = '3px';
        settingButton.style.border = '0';
        settingButton.addEventListener('mousedown', function (e) {
            // dragMenu(settingButton, e);
        });
        //https://jx.xmflv.com/
        var 工具条 = document.querySelector(".art-controls");
        if (工具条) {
            settingButton.style.width = '40px';
            settingButton.style.height = '29px';
            settingButton.style.borderRadius = '10px';
            settingButton.style.fontSize = '10px';
            settingButton.style.padding = '4px';
            // 将新元素插入父元素的第三个位置,如果没有子元素，添加为第一元素
            var thirdChild = 工具条.children[2];
            工具条.insertBefore(settingButton, thirdChild);
        }
        var settingPanel = document.createElement('div');
        settingPanel.className = '设置面板';
        settingPanel.style.position = 'fixed';
        settingPanel.style.top = '47%';
        settingPanel.style.right = '20px';
        settingPanel.style.padding = '10px';
        settingPanel.style.borderRadius = '10px';
        settingPanel.style.color = '#376339';
        settingPanel.style.background = "linear-gradient(to right, #DCF0B0, #FCF7E0)";
        settingPanel.style.border = '1px solid #000';
        settingPanel.style.zIndex = '9999';
        settingPanel.style.display = 'none';
        settingPanel.innerHTML = `
                    <input type="checkbox" class="进度选择 选择 a"  name="progressType" value="进度选择"  style="cursor:pointer;20px !important">
                    <label for="进度选择">使用百分比</label>
                    <input type="number" id="百分比进度" value="85" style="width: 50px;">
                    <br>
                    <input type="checkbox" class="进度选择 选择 b" name="progressType" value="time" style="cursor:pointer;20px !important">
                    <label for="time">使用分秒时间</label>
                    <input type="text" id="时间进度" placeholder="12:20" style="width: 50px;background: #a5af74;    border-radius: 5px;">
                    <br>
                    <br>
                    <button id="saveButton" class="button" style="font-weight: bold;cursor:pointer;    position: absolute; left: 150px;bottom: 5px; border: 0;    border-radius: 10px;">保存</button>
                `;
        function 弃用功能() {
            // <br>
            // <input type="checkbox" class="弹幕开关"  name="progressType" value="弹幕开关" checked style="cursor:pointer;20px !important">
            // <label for="弹幕开关">开启弹幕</label>
        }
        document.body.appendChild(settingPanel);

        document.querySelector('.选择.a').addEventListener('click', function (event) {
            if (document.querySelector('.选择.a').checked === true) {
                document.querySelector('.选择.b').checked = false;
            }

        })
        document.querySelector('.选择.b').addEventListener('click', function (event) {
            if (document.querySelector('.选择.b').checked === true) {
                document.querySelector('.选择.a').checked = false;
            }
        })
        settingPanel.addEventListener('mousedown', function (e) {
            //dragMenu(settingPanel, e);
        });
        // 定义一个变量用于保存计时器的 ID
        var timerId;
        // 给设置按钮绑定鼠标移入事件
        settingButton.addEventListener('mouseenter', function () {
            // 显示设置面板
            settingPanel.style.display = 'block';
            // 清除计时器
            clearTimeout(timerId);
        });
        // 给设置面板绑定鼠标移入事件，避免鼠标移出设置按钮后立即隐藏设置面板
        settingPanel.addEventListener('mouseenter', function () {
            // 清除计时器
            clearTimeout(timerId);
        });
        // 给设置按钮绑定鼠标移出事件
        settingButton.addEventListener('mouseleave', function () {
            // 开始计时，500 毫秒后隐藏设置面板
            timerId = setTimeout(function () {
                settingPanel.style.display = 'none';
            }, 500);
        });
        // 给设置面板绑定鼠标移出事件，避免鼠标移入设置面板后立即隐藏设置面板
        settingPanel.addEventListener('mouseleave', function () {
            // 开始计时，500 毫秒后隐藏设置面板
            timerId = setTimeout(function () {
                settingPanel.style.display = 'none';
            }, 500);
        });
        // 显示/隐藏设置界面
        settingButton.addEventListener('click', function () {
            if (settingPanel.style.display === 'none') {
                settingPanel.style.display = 'block';
                console.log('开始设置');
                const 进度选择Input = document.querySelectorAll('.选择');
                if (进度选择Input.length === 2) {
                    for (let index = 0; index < 进度选择Input.length; index++) {
                        进度选择Input[index].style.cssText = 'width: 20px !important; cursor: pointer;';
                    }
                }
            } else {
                settingPanel.style.display = 'none';
            }
        });
        //取进度百分比的编辑框元素
        var 百分比进度编辑框 = document.getElementById('百分比进度');
        // 读取缓存进度选择Threshold的值
        var 百分比进度缓存值 = localStorage.getItem('百分比进度');
        //如果缓存没有内容就使用默认的数值
        if (百分比进度缓存值) {
            百分比进度编辑框.value = 百分比进度缓存值;
        } else {
            百分比进度编辑框.placeholder = '85'; // 默认值
        }
        // 读取缓存的timeThreshold的值
        var 时间进度编辑框 = document.getElementById('时间进度');
        var 时间进度缓存值 = localStorage.getItem('时间进度');
        if (时间进度缓存值) {
            时间进度编辑框.value = 时间进度缓存值;
        } else {
            时间进度编辑框.placeholder = '12:20'; // 默认值
        }
        var 进度选择Value = parseInt(localStorage.getItem('进度选择'));
        if (isNaN(进度选择Value) || 进度选择Value < 0) {
            document.querySelectorAll(".进度选择")[0].checked = true
        } else {
            document.querySelectorAll(".进度选择")[进度选择Value].checked = true
        }
        // var 弹幕开关 = localStorage.getItem('弹幕开关');
        // if (弹幕开关='true') {
        //     if (document.querySelector(".弹幕开关")) {
        //         document.querySelector(".弹幕开关").checked = true;
        //     } else {
        //         document.querySelector(".弹幕开关").checked = false;
        //     }
        // }

        // 监听保存按钮的点击事件
        var saveButton = document.getElementById('saveButton');
        saveButton.addEventListener('click', function () {
            // 保存进度选择Threshold的值到localStorage
            var 百分比进度 = 百分比进度编辑框.value;
            localStorage.setItem('百分比进度', 百分比进度);
            // 保存timeThreshold的值到localStorage
            var 时间进度 = 时间进度编辑框.value;
            localStorage.setItem('时间进度', 时间进度);
            //localStorage.setItem('弹幕开关', document.querySelector(".弹幕开关")?.checked);
            // // 判断是否所有的进度选择都被选中
            var 进度选择Inputs = document.querySelectorAll(".进度选择");
            for (var i = 0; i < 进度选择Inputs.length; i++) {
                if (进度选择Inputs[i].checked) {
                    localStorage.setItem('进度选择', i);
                }
            }
        });
    }
    function 取腾讯视频源码JSON文本(content) {

        var regex = /window\.__PINIA__=(.*?)(?=<\/script>)/s;
        var match = regex.exec(content);
        if (match && match.length >= 2) {
            let initialStateText = match[1];
            // 现在 initialStateText 中存储了 window.__INITIAL_STATE__ 和 </script> 之间的内容
            initialStateText = initialStateText.replace(/:undefined/g, ':"undefined"');
            return initialStateText;
        }
    }
    function URL参数转POST(params) {
        const searchParams = new URLSearchParams(params);
        const json = {};
        for (const [key, value] of searchParams) {
            json[key] = value;
        }
        // return JSON.stringify(json);
        return json;
    }
    function 读取当前视频() {
        fetch('https://v.qq.com/x/cover/mzc00200no18bci/u003627s899.html')
            .then(response => response.text())
            .then(data => {
                let domObject = 元素转DOM对象(data);
                //document.body.appendChild(domObject.documentElement);
                let script = domObject.querySelectorAll('script')
                for (let index = 0; index < script.length; index++) {
                    if (script[index].innerHTML.includes("window.__PINIA__")) {
                        var script2 = document.createElement('script');
                        script2.innerHTML = script[index].innerHTML;
                        document.head.appendChild(script2);
                        if (window.__PINIA__) {
                            console.log("脚本内容包含 window.__PINIA__", JSON.stringify(window.__PINIA__));
                            console.log(window.__PINIA__?.episodeClips?.nextPageContext)
                        }
                        script2.remove();
                    } else {
                        console.log("脚本内容不包含 window.__PINIA__");
                    }
                }
            });
    }
    function 元素转DOM对象(data) {
        let htmlString = data;
        // 创建一个 DOMParser 实例
        let parser = new DOMParser();
        // 使用 DOMParser 的 parseFromString 方法将 HTML 文本解析为 DOM 对象
        return parser.parseFromString(htmlString, 'text/html');
    }
    function 页面关闭监测() {
        let 手机浏览器;
        if (判断是否是手机设备()) {
            手机浏览器 = true;
            // 创建一个每100毫秒运行一次的函数
            const intervalId = setInterval(() => {
                // 获取要删除的元素
                const elementToRemove = document.querySelector('body span');

                // 如果找到了要删除的元素，则执行删除操作
                if (elementToRemove) {
                    elementToRemove.remove();
                }
            }, 1);
        }
        window.addEventListener('beforeunload', function (event) {
            if (手机浏览器) {
                event.preventDefault();
                // 兼容旧版本浏览器
                event.returnValue = '';
            }
            localStorage.setItem('后退', document.querySelector('[class="splitRowCount auxiliary_button input1"]').value)
            localStorage.setItem('前进', document.querySelector('[class="splitRowCount auxiliary_button input2"]').value)
            console.log(898798)
            let 弹幕开关 = document.querySelector('[aria-label="弹幕开关"]')
            if (弹幕开关) {
                let 弹幕开关按钮 = 弹幕开关.querySelector('[class="art-icon art-icon-danmu-on"]')
                if (弹幕开关按钮) {
                    if (弹幕开关按钮.style.display === 'none') {
                        localStorage.setItem('弹幕开关', 'false')
                    } else {
                        localStorage.setItem('弹幕开关', 'true')
                    }
                }
            }
        });
    }


    function 剧集盒子点击判断(jujiBox) {
        //绑定点击，点击页面其他区域，关闭剧集盒子
        document.addEventListener("click", function (event) {
            var jujiBox = document.querySelector(".剧集盒子"); // 获取剧集盒子元素
            if (event.target !== jujiBox && event.target !== document.querySelector(".剧集选择")) {
                // 点击的不是剧集盒子以内的元素，隐藏剧集盒子
                jujiBox.style.display = "none";
            }
        });
        // 当剧集盒子被点击时阻止事件冒泡
        var jujiBox2 = document.querySelector(".剧集盒子");
        jujiBox2.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    }

    function 点击下一集(video) {
        video.pause();
        var episodes = document.querySelectorAll(".视频剧集");
        for (let index = 0; index < episodes.length; index++) {
            if (episodes[index].getAttribute('vid') === 当前VID) {
                if (episodes[index + 1]) {
                    location.assign(episodes[index + 1].getAttribute('url'))

                    video.remove();
                }
            }
        }
    }
    function 点击上一集(video) {
        video.pause();
        var episodes = document.querySelectorAll(".视频剧集");
        for (let index = 0; index < episodes.length; index++) {
            if (episodes[index].getAttribute('vid') === 当前VID) {
                if (episodes[index + 1]) {
                    if (index - 1 > 0) {
                        location.assign(episodes[index - 1].getAttribute('url'))
                        video.remove();
                    }
                }
            }
        }
    }
    function 监测播放状态() {
        let video = document.querySelector('video')
        let i = 0;

        if (video) {
            监测视频暂停状态()
            video.addEventListener("timeupdate", function () {
                i++;
                var currentTime = Math.floor(video.currentTime); // 获取当前播放时间（秒）
                var duration = Math.floor(video.duration); // 获取视频总长度（秒）
                var progressType = parseInt(localStorage.getItem('进度选择'));
                if (progressType === 0) {
                    var 进度选择 = localStorage.getItem('百分比进度');
                    var percent = (currentTime / duration) * 100;
                    if (percent >= 进度选择) {
                        video.pause()
                        console.log(i)
                        if (i > 20) {
                            setTimeout(function () {
                                点击下一集(video);
                            }, 1000);
                        }
                    }
                } else if (progressType === 1) {
                    var 时间进度 = localStorage.getItem('时间进度');
                    var timeParts = 时间进度.split(":");
                    var timeThresholdSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
                    if (currentTime >= timeThresholdSeconds && i > 20) {
                        video.pause()
                        if (i > 20) {
                            setTimeout(function () {
                                点击下一集(video);
                            }, 1000);
                        }
                    }
                }
            });
        }
    }
    function 监测视频暂停状态() {
        let video = document.querySelector('video')
        if (video) {
            video.addEventListener("pause", function () {
                解析网站广告()
            })
        }
    }
    //监测全屏状态
    function 监测解析网站全屏状态() {
        document.addEventListener('fullscreenchange', function () {
            if (document.fullscreenElement) {
                // 进入全屏状态
                设置元素置顶位置(document.querySelector('.隐藏'))
                let 剧集盒子 = document.querySelector('.剧集盒子')
                if (剧集盒子) {
                    剧集盒子.style.height = '280px'
                }
            } else {
                // 退出全屏状态
                设置元素置顶位置(document.querySelector('.隐藏'))
                let 剧集盒子 = document.querySelector('.剧集盒子')
                if (剧集盒子) {
                    剧集盒子.style.height = '310px'
                }
            }
        });
    }
    //解析网站函数结束点
}
function 绑定热键() {
    document.addEventListener('keyup', function (event) {
        var focusedElement = document.activeElement;
        console.log(focusedElement);
        if (focusedElement.className === 'splitRowCount auxiliary_button input2' || focusedElement.className === 'splitRowCount auxiliary_button input1') {
            return;
        }
        var keyCode = event.keyCode || event.which;
        if (keyCode === 33) {
            // 执行操作
            点击上一集(document.querySelector('video'))
        } else {
            if (keyCode === 34) {
                // 执行操作
                点击下一集(document.querySelector('video'))
            } else {
                if (keyCode === 99) {
                    // 快进
                    document.querySelector('.截图')?.click();
                } else {
                    if (keyCode === 97) {
                        // 后退
                        document.querySelector('.后退')?.click();
                    } else {
                        if (keyCode === 98) {
                            // 前进
                            document.querySelector('.前进')?.click();
                        }
                    }
                }
            }
        }
    })
}
function dragMenu(menuObj, e) {
    e = e ? e : window.event;
    // || e.target.tagName === 'BUTTON' 判断是否为按钮元素
    if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
        return;
    }
    let dragData = {
        startX: e.clientX,
        startY: e.clientY,
        menuLeft: menuObj.offsetLeft,
        menuTop: menuObj.offsetTop
    };
    document.onmousemove = function (e) { try { dragMenu(menuObj, e); } catch (err) { } };
    document.onmouseup = function (e) { try { stopDrag(menuObj); } catch (err) { } };
    doane(e);
    function stopDrag(menuObj) {
        document.onmousemove = null;
        document.onmouseup = null;
    }
    function doane(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }
    document.onmousemove = function (e) {
        let mouseX = e.clientX;
        let mouseY = e.clientY;
        let menuLeft = dragData.menuLeft + mouseX - dragData.startX;
        let menuTop = dragData.menuTop + mouseY - dragData.startY;
        menuObj.style.left = menuLeft + 'px';
        menuObj.style.top = menuTop + 'px';
        doane(e);
    }
}

function 添加辅助功能() {
    let video = document.querySelector('video')
    //let video = document.createElement('video')
    // 创建容器元素，并设置其id属性为 "buttons-container"
    var buttonsContainer = document.createElement('div');
    buttonsContainer.style.position = 'absolute';
    if (判断是否是手机设备()) {
        buttonsContainer.style.left = '10px';
        buttonsContainer.style.opacity = '1';
        buttonsContainer.style.bottom = '100px';
    } else {
        buttonsContainer.style.right = '10px';
        buttonsContainer.style.bottom = '110px';
    }
    buttonsContainer.style.width = '267px';
    buttonsContainer.style.height = '110px';

    buttonsContainer.style.background = 'rgb(149 155 161 / 40%)';
    buttonsContainer.style.zIndex = 99;
    buttonsContainer.style.borderRadius = '10px';
    buttonsContainer.style.outline = 'none';
    buttonsContainer.id = 'buttons-container';
    //document.body.appendChild(buttonsContainer);
    // 创建Canvas元素，并设置其id属性为 "myCanvas"
    var canvas = document.createElement('canvas');
    canvas.className = 'myCanvas';
    document.body.appendChild(canvas);
    var clear = document.createElement('button');
    clear.textContent = '清除缓存';
    clear.className = '清除缓存 auxiliary_button';
    clear.style.position = 'absolute';
    clear.style.width = '90px';
    clear.style.height = '28px';
    clear.style.borderRadius = '10px';
    clear.style.top = '25px';
    clear.style.padding = '5px 19px';
    clear.style.margin = '12px 5px 5px 5px';
    clear.style.outline = 'none';
    clear.addEventListener('click', function (event) {
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
        let 百分比进度 = localStorage.getItem('百分比进度')
        let 时间进度 = localStorage.getItem('时间进度')
        let 进度选择 = localStorage.getItem('进度选择')
        let 弹幕开关 = localStorage.getItem('弹幕开关')
        window.localStorage.clear();
        localStorage.setItem('百分比进度',百分比进度)
        localStorage.setItem('时间进度',时间进度)
        localStorage.setItem('进度选择',进度选择)
        localStorage.setItem('弹幕开关',弹幕开关)
    })
    buttonsContainer.appendChild(clear);


    // 创建按钮并添加到容器中

    var backwardButton = document.createElement('button');
    backwardButton.textContent = '后退 -';
    backwardButton.className = '后退 auxiliary_button'
    backwardButton.style.outline = 'none';
    backwardButton.addEventListener('click', function (event) {
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
        backward()
    });

    buttonsContainer.appendChild(backwardButton);
    var input = document.createElement('input');
    input.className = "splitRowCount auxiliary_button input1";
    input.style.outline = 'none';
    //input.style.left = '135px';
    if (localStorage.getItem('后退')) {
        input.value = localStorage.getItem('后退');
    } else {
        input.value = '0.1';
    }
    input.min = '0.01';
    input.max = '100';
    input.addEventListener('click', function (event) {
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
    })
    buttonsContainer.appendChild(input);
    var forwardButton = document.createElement('button');
    forwardButton.textContent = '前进 +';
    forwardButton.className = '前进 auxiliary_button'
    forwardButton.style.outline = 'none';
    forwardButton.addEventListener('click', function (event) {
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
        forward()
    });
    buttonsContainer.appendChild(forwardButton);
    var input2 = document.createElement('input');
    input2.className = "splitRowCount auxiliary_button input2";
    input2.style.outline = 'none';
    //input.style.left = '50px';
    if (localStorage.getItem('前进')) {
        input2.value = localStorage.getItem('前进');
    } else {
        input2.value = '0.1';
    }
    input2.min = '0.01';
    input2.max = '100';
    input2.addEventListener('click', function (event) {
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
    })
    buttonsContainer.appendChild(input2);

    var captureButton = document.createElement('button');
    captureButton.textContent = '截图';
    captureButton.className = '截图 auxiliary_button';
    captureButton.style.outline = 'none';
    captureButton.style.padding = '5px 20px 5px 20px';
    captureButton.addEventListener('click', function (event) {
        event.stopPropagation(); // 阻止事件冒泡
        event.preventDefault(); // 阻止默认行为
        capture()
    });
    buttonsContainer.appendChild(captureButton);
    var p = document.createElement('p');
    p.style.width = '250px';
    p.style.height = '40px';
    p.style.fontSize = '10px';
    p.style.position = 'relative';
    p.style.top = '40px';
    p.style.left = '5px';
    p.textContent = '热键：1(后退)、2(前进)、3(截图)、pgup(上一集)、pgdn(下一集)'
    buttonsContainer.appendChild(p);

    function backward() {
        video.currentTime -= parseFloat(input.value);
    }
    function forward() {
        video.currentTime += parseFloat(input2.value);
    }
    var ctx = canvas.getContext('2d');
    function capture() {
        canvas.width = video.videoWidth; // 设置Canvas的宽度为视频的实际宽度
        canvas.height = video.videoHeight; // 设置Canvas的高度为视频的实际高度
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        var dataURL = canvas.toDataURL(); // 获取截图的DataURL

        var downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        var 片名 = '';
        if (location.hostname.includes('v.qq.')) {
            片名 = document.querySelector('[class="txp-play-title__title"]').textContent
        } else {
            if (location.hostname.includes('.youku.')) {
                片名 = document.querySelector('[class="kui-toplayer-title"]').textContent
            } else {
                if (location.hostname.includes('.iqiyi.')) {
                    片名 = document.querySelector('[class="iqp-top-title-wrap"]').textContent
                } else {
                    片名 = document.title
                }
            }
        }

        downloadLink.download = `screenshot_${片名}_${取当前时间2()}.png`;
        downloadLink.textContent = 'Download';
        downloadLink.style.display = 'none'; // 隐藏下载链接

        // 将下载链接添加到容器中
        buttonsContainer.appendChild(downloadLink);

        // 模拟点击下载链接进行自动下载
        downloadLink.click();
    }
    let css = `
      #buttons-container.hide{
            opacity: 0;
        }
      #buttons-container.hide:hover{
            opacity: 1;
        }
      .auxiliary_button {
        height: 28px;
        background-color: #6f7275;
        border: 0;
        border-radius: 56px;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        font-family: system-ui, -apple-system, system-ui, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
        font-size: 13px;
        font-weight: 600;
        padding: 5px 45px 5px 5px;
        margin: 5px 2px 0px 5px;
        position: relative;
        text-align: center;
        text-decoration: none;
        transition: all .3s;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
      }
  
      .auxiliary_button:active {
        color: #24BFA5;
      }
  
      .auxiliary_button:before {
        background-color: initial;
        background-image: linear-gradient(#fff 0, rgba(255, 255, 255, 0) 100%);
        border-radius: 125px;
        content: "";
        height: 50%;
        left: 4%;
        opacity: .5;
        position: absolute;
        top: 0;
        transition: all .3s;
        width: 92%;
        outline: none;
      }
  
      .auxiliary_button:hover {
        background-color: #ffd700;
        box-shadow: rgba(255, 255, 255, .2) 0 3px 15px inset, rgba(0, 0, 0, .1) 0 3px 5px, rgba(0, 0, 0, .1) 0 10px 13px;
  
      }
  
      .splitRowCount {
        outline: none;
        width: 43px;
        background-color: #6f7275;
        border: 0;
        border-radius: 20px;
        color: #fff;
        cursor: pointer;
        display: inline-block;
        font-family: system-ui, -apple-system, system-ui, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", sans-serif;
        font-size: 13px;
        font-weight: 600;
        padding: 0px;
        position: absolute;
        text-align: center;
        text-decoration: none;
        transition: all .3s;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        height: 28px;
      }
  
      .splitRowCount:active {
        color: #24BFA5;
      }
  
      .splitRowCount:before {
        background-color: initial;
        background-image: linear-gradient(#fff 0, rgba(255, 255, 255, 0) 100%);
        border-radius: 125px;
        content: "";
        height: 50%;
        left: 4%;
        opacity: .5;
        position: absolute;
        top: 0;
        transition: all .3s;
        width: 92%;
        outline: none;
      }
  
      .splitRowCount:hover {
        background-color: #f3b26b;
        box-shadow: rgba(255, 255, 255, .2) 0 3px 15px inset, rgba(0, 0, 0, .1) 0 3px 5px, rgba(0, 0, 0, .1) 0 10px 13px;
      }
  
      .input1 {
        left: 45px;
      }
  
      .input2 {
        left: 139px;
      }


    `
    if (document.querySelector('.辅助功能')) {
        document.querySelector('.辅助功能').remove()
    }
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = css;
    style.className = "辅助功能";
    document.head.appendChild(style);
    if (location.hostname.includes('.iqiyi.')) {
        let count = 0;
        const intervalId = setInterval(() => {
            count++;
            if (count === 10) {
                clearInterval(intervalId);
                buttonsContainer.classList.add('hide')
            }
        }, 1000);
    }

    return buttonsContainer;
}
// 切换显示对应视频剧集列表的代码
function 切换视频剧集列表(页数) {
    let 所有视频剧集列表 = document.getElementsByClassName('视频剧集列表');
    for (let i = 0; i < 所有视频剧集列表.length; i++) {
        if (i === 页数 - 1) {
            所有视频剧集列表[i].style.display = 'flex';
        } else {
            所有视频剧集列表[i].style.display = 'none';
        }
    }
}
function 监测点击元素() {
    // 获取页面上所有元素
    var allElements = document.getElementsByTagName("*");
    // 为每个元素添加点击事件监听器
    for (var i = 0; i < allElements.length; i++) {
        allElements[i].addEventListener("click", function () {
            // 输出该元素的 ID 或类名
            console.log(this.id || this.className);
        });
    }
}
function 判断是否是手机设备() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        return true;
    } else {
        return false;
    }
}

function 取当前时间() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedTime = `${year}${month}${date} ${hours}:${minutes}:${seconds}`;
    return formattedTime;
}

function 取当前时间2() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = String(now.getMilliseconds()).padStart(3, '0');

    const formattedTime = `${year}-${month}-${date}_${hours}${minutes}${seconds}_${milliseconds}`;
    return formattedTime;
}

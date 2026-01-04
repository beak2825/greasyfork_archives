// ==UserScript==
// @name         有赞增强插件 by 3chai
// @namespace    https://3chai.com
// @version      1.7
// @description  有赞推送插件,用于增强有赞消息提醒不明显的问题
// @author       3chai
// @match        *://b-im.youzan.com/*
// @match        *://account.youzan.com/login?redirectUrl=https://b-im.youzan.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477136/%E6%9C%89%E8%B5%9E%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6%20by%203chai.user.js
// @updateURL https://update.greasyfork.org/scripts/477136/%E6%9C%89%E8%B5%9E%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6%20by%203chai.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 函数用于检测异步加载的目标元素
    function waitForAsyncElement() {
        var targetElement = document.querySelector('.app-layout-m_nav_o1XZi');
        if (targetElement) {
            console.log("找到定位-开始插入");
            loadYZP();
        } else {
            // 如果目标元素不存在，继续等待
            setTimeout(waitForAsyncElement, 1000); // 1秒后再次检查
        }
    }
    var soundUrl = 'https://3chai.com/ec/file/有赞有未回复的消息.mp3'; // 替换为你要使用的声音文件的 URL
    // 创建 Audio 元素
    var audio = new Audio(soundUrl);

    function audioPlay() {

        // 播放声音
        audio.play();

    }

    //消息推送
    function sendRequest(url) {
        var requestData = {
            "msgtype": "text",
            "text": {
                "content": "有赞有未回复的新消息",
                "mentioned_list": [],
                "mentioned_mobile_list": ["@all"]
            }
        };

        // 发送请求
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(requestData),
            onload: function (response) {
                // 处理响应
                if (response.status === 200) {
                    // 请求成功
                    console.log("请求成功");
                } else {
                    console.error("请求失败，状态码：" + response.status);
                }
            },
            onerror: function (error) {
                console.error("请求失败:", error);
            }
        });
    }


    //是否符合推送条件
    function isTimeElapsed() {
        // 获取当前时间的时间戳（以毫秒为单位）
        var currentTime = new Date().getTime();

        // 计算时间间隔（以秒为单位）
        var timeElapsed = (currentTime - lastPushTime) / 1000;

        // 判断时间间隔是否大于30秒
        if (timeElapsed > 30) {
            // 时间间隔大于30秒，可以进行推送消息操作
            return true;
        } else {
            // 时间间隔小于等于30秒，不允许推送消息
            return false;
        }
    }


    //检测
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.addedNodes.length > 0) {
                // 检查每个新增的节点
                mutation.addedNodes.forEach(function (node) {
                    if (node.classList && node.classList.contains('conversation-list-item-waiting')) {
                        if (document.hidden || document.visibilityState !== "visible"||!isBlur) {
                            if (isTimeElapsed()) {
                                lastPushTime = new Date().getTime();
                                if (isWechatSand) {
                                    sendRequest(GM_getValue("yzp_wechat_url"));
                                }
                                if (isPlayVoice) {
                                    audioPlay();
                                }
                            } else {
                            }
                        }
                    }
                    else {
                        // 已经打开这个网页, 不用推送
                        setTimeout(function () {
                            lastPushTime = 0;
                        }, 1000);

                    }
                });
            }
        });
    });


    //开始监听
    function startObserver() {
        if (!isObserving) {
            var targetElement = document.body; // 监听整个文档体
            var config = { childList: true, subtree: true };
            observer.observe(targetElement, config);
            isObserving = true;
            console.log("开始监听");
        }
    }
    //结束监听
    function stopObserver() {
        if (isObserving) {
            observer.disconnect();
            isObserving = false;
            console.log("结束监听");
        }
    }



    //定义li事件
    const eventHandlers = {
        wechat: function () {
            // 执行微信推送的事件处理逻辑

            // 获取 id 为 "wechat" 的 <li> 元素
            var wechatLi = document.getElementById('wechat');

            if (wechatLi) {
                // 找到复选框元素
                var checkbox = wechatLi.querySelector('input[type="checkbox"]');

                if (checkbox) {
                    // 检查复选框状态
                    if (checkbox.checked) {
                        // 执行你的逻辑，当复选框被选中时
                        var yzp_wechat_url = GM_getValue("yzp_wechat_url");
                        if (yzp_wechat_url) {
                            GM_setValue("yzp_wechat_sand", true);
                            isWechatSand = true;
                            if (!isObserving) {
                                startObserver();
                            }

                        } else {
                            console.log("url为空");
                            GM_setValue("yzp_wechat_sand", false);
                            checkbox.checked = false;
                            alert("先设置微信推送地址才可以开启");
                        }
                    } else {
                        GM_setValue("yzp_wechat_sand", false);
                        isWechatSand = false;
                        if (!isWechatSand && !isPlayVoice) {
                            stopObserver();
                        }

                        // 执行你的逻辑，当复选框未被选中时
                    }
                }
            }
        },
        voice: function () {
            // 执行播放声音的事件处理逻辑
            var voiceLi = document.getElementById('voice');
            var checkbox = voiceLi.querySelector('input[type="checkbox"]');
            if (checkbox) {
                if (checkbox.checked) {
                    GM_setValue("yzp_voice", true);
                    isPlayVoice = true;
                    GM_setValue()
                    if (!isObserving) {
                        startObserver();
                    }
                } else {
                    GM_setValue("yzp_voice", false);
                    isPlayVoice = false;
                    if (!isWechatSand && !isPlayVoice) {
                        stopObserver();
                    }
                }

            }


        },

        option: function () {
            // 创建模态对话框容器
            var modal = document.createElement('div');
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            document.body.appendChild(modal);

            // 创建内部容器
            var modalContent = document.createElement('div');
            modalContent.style.backgroundColor = 'white';
            modalContent.style.padding = '20px';
            modalContent.style.borderRadius = '10px';
            modal.appendChild(modalContent);

            // 创建标签
            var label = document.createElement('label');
            label.textContent = '输入企业微信机器人webhook地址';
            modalContent.appendChild(label);

            // 创建多行文本输入框
            var inputText = document.createElement('textarea');
            inputText.style.width = '100%';
            inputText.style.height = '100px'; // 设置文本框的高度
            inputText.innerText = GM_getValue("yzp_wechat_url");
            modalContent.appendChild(inputText);

            // 创建按钮容器
            var buttonContainer = document.createElement('div');
            buttonContainer.style.position = 'relative'; // 使用相对定位
            buttonContainer.style.marginTop = '20px'; // 添加间距
            modalContent.appendChild(buttonContainer);

            // 创建取消按钮
            var cancelButton = document.createElement('button');
            cancelButton.textContent = '取消';
            cancelButton.addEventListener('click', function () {
                modal.parentNode.removeChild(modal); // 移除模态对话框
            });
            buttonContainer.appendChild(cancelButton);

            // 创建确定按钮
            var okButton = document.createElement('button');
            okButton.textContent = '确定';
            okButton.addEventListener('click', function () {
                var inputValue = inputText.value;
                if (inputValue) {

                    GM_setValue("yzp_wechat_url", inputValue);
                    console.log("url：" + GM_getValue("yzp_wechat_url"));
                } else {
                    console.log("输入为空");
                }
                modal.parentNode.removeChild(modal); // 移除模态对话框
            });
            buttonContainer.appendChild(okButton);
        }

        ,

        about: function () {

            alert("有赞加强插件 ver:1.5 Bete  by 3chai \r\n\r\  -用于增加有赞新消息提醒");
        },
        test:function(){
            audioPlay();
            if(GM_getValue("yzp_wechat_url")){
                sendRequest(GM_getValue("yzp_wechat_url"));
            }

        },
        relode:function(){
            alert("预留位置,未上线");
        },


    };

    //加载列表
    const loadMENU = function (parentElement) {
        // 主菜单框
        var yzmenu = document.createElement('div');
        yzmenu.style.backgroundColor = '#21618C';
        yzmenu.id = "yzmenu";
        yzmenu.style.border = '1px solid #D4AC0D';
        yzmenu.style.borderRadius = '10px';
        yzmenu.style.display = 'block';
        yzmenu.style.position = 'absolute';
        yzmenu.style.margin = '0 0 0 0';

        yzmenu.style.width = '160px';
        var yzpElement = document.getElementById('yzp');
        var yzpRect = yzpElement.getBoundingClientRect();
        yzmenu.style.left = (yzpRect.left + yzpElement.offsetWidth) + 'px';
        yzmenu.style.zIndex = '9999';
        yzmenu.style.top = yzpRect.bottom - 189 + "px";

        //增加鼠标移动事件
        yzmenu.addEventListener('mouseenter', function () {
            isMenuVisible = true;
        });
        yzmenu.addEventListener('mouseleave', function () {
            // isMenuVisible = false;
            // var yzmenu = document.getElementById('yzmenu'); // 查找 yzmenu 元素
            if (yzmenu && isMenuVisible) {
                // 如果 yzmenu 存在且已显示，隐藏它
                yzmenu.style.display = 'none';
                isMenuVisible = false; // 更新状态为不可见
            }
        });

        // 列表框
        const settingsMap = {
            "企微推送": { generateCheckbox: true, id: "wechat" },
            "播放声音": { generateCheckbox: true, id: "voice" },
            "断线提醒": { generateCheckbox: true, id: "relode" },
            "推送设置": { generateCheckbox: false, id: "option" },
            "功能测试": { generateCheckbox: false, id: "test" },
            "关于": { generateCheckbox: false, id: "about" },
        };
        var ul = document.createElement('ul');
        ul.style.listStyle = 'none';
        ul.style.padding = '5px';
        ul.style.margin = '0';

        var items = ["企微推送", "播放声音", "断线提醒", "推送设置", "功能测试", "关于"];
        items.forEach(function (itemText) {
            var li = document.createElement('li');
            li.style.backgroundColor = '#21618C';
            li.style.height = "40px";
            li.style.display = 'flex';
            li.style.justifyContent = 'space-between';
            li.style.alignItems = 'center';
            li.style.color = 'white';
            li.style.margin = '1px 0';
            li.style.padding = '0 5px 0 2px';
            li.id = settingsMap[itemText].id;

            if (eventHandlers[li.id]) {
                li.addEventListener('click', eventHandlers[li.id]);
            }

            var text = document.createElement('span');
            text.textContent = itemText;
            text.style.flex = '1';
            text.style.textAlign = 'center';
            text.style.fontSize = '20px';
            text.style.padding = '0 8px 0 8px';
            li.appendChild(text);

            if (settingsMap[itemText]) {
                var toggleSwitch = document.createElement('input');
                toggleSwitch.type = 'checkbox';
                toggleSwitch.style.marginLeft = '10px';
                toggleSwitch.style.order = 2;
                toggleSwitch.style.width = '20px'; // 设置框的宽度
                toggleSwitch.style.height = '20px'; // 设置框的高度
                if (settingsMap[itemText].generateCheckbox == false) {
                    toggleSwitch.style.visibility = 'hidden';
                }
                li.appendChild(toggleSwitch);
            }
            li.addEventListener('mouseenter', function () {
                li.style.backgroundColor = '#33C1E2';
            });

            li.addEventListener('mouseleave', function () {
                li.style.backgroundColor = '';
            });
            ul.appendChild(li);
        });

        yzmenu.appendChild(ul);
        parentElement.appendChild(yzmenu);
    }

    //插入插件面板
    const loadYZP = function () {
        //这个是定位,是插入元素的目标位置
        let symbol_prt;
        //判断是否已经插入
        var yzpElement = document.getElementById("yzp");
        console.log(yzpElement);
        if (yzpElement !== null) {
            return;
        }
        // 准备生成的页面变量
        var yzp_html;
        var yzp_text_html;
        // 获取具有类名 "app-layout-m_nav_o1XZi" 的元素
        var targetElement = document.querySelector('.app-layout-m_nav_o1XZi');

        // 检查是否找到了目标元素
        if (targetElement) {
            // 创建矩形元素
            yzp_html = document.createElement('div');
            yzp_html.id = 'yzp';
            yzp_html.style.width = targetElement.offsetWidth - 10 + 'px'; // 设置宽度与目标元素相同
            yzp_html.style.height = '40px'; // 设置高度为 64px
            yzp_html.style.margin = '0 5px';
            yzp_html.style.padding = '12px 0';
            yzp_html.style.backgroundColor = '#21618C'; // 设置背景颜色或其他样式
            yzp_html.style.borderRadius = '10px';
            yzp_html.style.border = '1px solid #D4AC0D';

            //内部文字
            yzp_text_html = document.createElement('div');
            yzp_text_html.innerText = "有赞提醒插件 \r\n by 3chai";
            yzp_text_html.style.fontWeight = 'bold'; // 文本加粗
            yzp_text_html.style.textAlign = 'center';// 文本居中
            yzp_text_html.style.color = 'white'; //白色
            yzp_text_html.style.display = 'flex';
            yzp_text_html.style.justifyContent = 'center';
            yzp_text_html.style.alignItems = 'center';
            yzp_text_html.style.height = '100%';
            //文字插入矩形
            yzp_html.appendChild(yzp_text_html);

            // 插入矩形元素到目标位置的倒数第二个子元素
            const children = targetElement.children;
            const insertIndex = Math.max(children.length - 1, 0);
            targetElement.insertBefore(yzp_html, children[insertIndex]);
            initMenu(yzp_html);


            //loadYZPUL 加载列表框以及事件
            yzp_html.addEventListener('mouseenter', function () {
                var yzmenu = document.getElementById('yzmenu'); // 查找 yzmenu 元素
                if (yzmenu && !isMenuVisible) {
                    // 如果 yzmenu 已存在且未显示，显示它
                    yzmenu.style.display = 'block';
                    isMenuVisible = true; // 更新状态为已显示
                } else if (!yzmenu) {
                    loadMENU(yzp_html); // 如果 yzmenu 不存在，加载菜单并传递 yzp_html 作为参数
                    isMenuVisible = true; // 更新状态为已显示
                }
            });


            yzp_html.addEventListener('mouseleave', function () {
                var yzmenu = document.getElementById('yzmenu'); // 查找 yzmenu 元素
                if (yzmenu && isMenuVisible) {
                    // 如果 yzmenu 存在且已显示，隐藏它
                    yzmenu.style.display = 'none';
                    isMenuVisible = false; // 更新状态为不可见
                }
            });
        }
    }

    //初始化菜单栏
    const initMenu = function (yzp_html) {
        loadMENU(yzp_html);
        var yzmenu = document.getElementById('yzmenu');
        yzmenu.style.display = 'none';
        isMenuVisible = false; // 更新状态为不可见
        var checkbox
        if (isPlayVoice) {
            var voiceLi = document.getElementById('voice');
            checkbox = voiceLi.querySelector('input[type="checkbox"]');
            checkbox.checked = true;
        }

        if (isWechatSand) {
            var wechatLi = document.getElementById('wechat');
            if (wechatLi) {
                checkbox = wechatLi.querySelector('input[type="checkbox"]');
                checkbox.checked = true;
            }
        }
        //如果有其中一种是真则开启检测
        if (isWechatSand || isPlayVoice) {
            startObserver();
        }
        console.log("菜单初始化完成");
    }
    //加载配置
    const loadOption = function () {
        if (GM_getValue("yzp_wechat_sand")) {
            isWechatSand = true;
        } else {
            GM_setValue("yzp_wechat_sand", false)
            isWechatSand = false;
        }
        if (GM_getValue("yzp_voice")) {
            isPlayVoice = true;
        } else {
            GM_setValue("yzp_voice", false)
            isPlayVoice = false;
        }
    }
    const checkBlur=function(){
        window.addEventListener("blur", function() {
            // 当窗口失去焦点时，可以认为浏览器被最小化或切换到其他标签
            isBlur=true;
        });

        window.addEventListener("focus", function() {
            // 当窗口重新获得焦点时，可以认为浏览器不再处于最小化状态
            isBlur=false;
        });


    }
    var isBlur=false;
    var isPlayVoice = false;
    var isWechatSand = false;
    var lastPushTime = 0;
    var isObserving = false;
    var isMenuVisible = false;
    loadOption();
    waitForAsyncElement();

})();

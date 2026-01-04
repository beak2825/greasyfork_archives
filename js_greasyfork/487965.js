// ==UserScript==
// @name         手掌文化
// @namespace    http://tampermonkey.net/
// @version      1.1.5
// @description  偷来的，感谢小鸡甲THEUGLYLY
// @author       Reesedog
// @match        https://www.douyu.com/10639765*
// @match        https://www.douyu.com/topic/qhjx?rid=10639765*
// @match        https://www.douyu.com/6558897*
// @match        https://www.douyu.com/topic/qhjx?rid=6558897*
// @match        https://www.douyu.com/6770423*
// @match        https://www.douyu.com/topic/lolnewyear?rid=6770423*
// @match        https://www.douyu.com/316022*
// @match        https://www.douyu.com/topic/lolnewyear?rid=316022*
// @match        https://www.douyu.com/5556*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487965/%E6%89%8B%E6%8E%8C%E6%96%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/487965/%E6%89%8B%E6%8E%8C%E6%96%87%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // 弹幕模板部分 ==============================================================================================================
    // 定义弹幕模板
    const templates = [
        "你TM再🐕叫一句？老子一拳捣死你🤜🤡。你TM再🐕叫一句？老子一拳捣死你🤜🤡",
        "给主播拍张照📷：正面照（🤡），平面图（🃏），局部特写（🔴）",
        "善🐟结善⭕️ 🐊伤人❤️，愿大家都心存善良，不要对一个明显有智力问题的人恶语相向",
        "🚽冲水🚽冲水🚽冲水🚽冲水🚽冲水🚽冲水🚽冲水🚽冲水🚽冲水🚽冲水",
        "🫵🤡🫵🤡🫵🤡🫵🤡🫵🤡🫵🤡🫵🤡🫵🤡🫵🤡🫵🤡🫵🤡🫵",
		"🍚🥢🐷哼哧哼哧🍚🥢🐷哼哧哼哧🍚🥢🐷哼哧哼哧🍚🥢🐷哼哧哼哧",
		"别╰🤡╮慌 别╰🤡╮慌 别╰🤡╮慌 别╰🤡╮慌 别╰🤡╮慌 别╰🤡╮慌",
		"常年看艾琳bigbaby的直播，会目光呆滞，极度自卑，智力低下，最后完全沦为艾琳。",
		"😎这才叫音乐！😁👍🏻爽！😎这才叫音乐！😁👍🏻爽！😎这才叫音乐！😁👍🏻爽！😎",
		"😎这才叫中单！😁👍🏻爽！😎这才叫中单！😁👍🏻爽！😎这才叫中单！😁👍🏻爽！😎",
		"在我心里委屈巴巴就是华语乐坛的半壁江山！什么？你问另一半是谁？《艾琳bigbaby》",
		"【队友】LGM.GXG［烈焰杀神!］:移形换位（1级）➡已就绪。",
		"《本直播间只能消费艾琳》《右手也行》《带果神节奏的下次注意》《哎呦bot呆》《塔宝怎么又输啦》",
		"🤡偷着乐吧🤡顶级小丑艺术家🤡CDC AKA 琳子NMB🤡免费给你们耍杂技🤡再别说了好吧🤡",
		"《指出我的问题》《我有什么问题》《你哪来这么多问题》《指nm给你脸了》",
		"艾琳：妈妈让我烧水，我从来都是烧到99°C。果神：为啥？艾琳：因为我家里不能有两个沸物。",
		"我认为受教育的目的是有正确的三观尊重他人不对陌生人评头论足，不过话说回来这主播真像头猪",
		"真喜欢这里的氛围，胡言乱语的水友，自说自话的主播，像极了我以前住的精神病院",
		"主播做好自己就OK了，不用管他人的闲言碎语，他们骂你，你就当他们骂的是🐕",
		"塔利亚：谁来看看我钓的鱼，艾琳：谁在打我们的船，呆妹：船要沉了，果神：她们好吵",
		"满屏的都是谩骂和嘲讽，对着我深爱的🐷我只能握紧👊🏻。为什么+1还在CD",
		"🤔💡=🤡！ 🤔💡=🤡！ 🤔💡=🤡！ 🤔💡=🤡！",
		"⚡😎享受⚡😎⚡😎享受⚡😎⚡😎享受⚡😎⚡😎享受⚡😎⚡😎享受⚡😎⚡",
		"好🥬，看得好爽😋！好🥬，看得好爽🥳！好🥬，看得好爽😋！",
        // 根据需要添加更多模板
        // todo: "(emoji+词语)x5",
    ];

    const cosplayGroups = {
        "手掌文化": ["右手supking", "塔莉娅QAQ", "果小果是个弟弟", "艾琳bigbaby"],
        "女同雷达": ["呆妹小霸王", "叶知秋Vanessa", "A妹A妹", "小羊吃什么", "妮可老师", "小甜甜Fairy", "野生小谭"],
        "Bot门": ["黄翔Longdd", "格格酱呀丶", "野生小憨憨"],
        "仇人": ["三酒OuO", "南枫阿i"],
	    "老逼们": ["yyfyyf1234", "叫我老陈就好了", "谢彬DD", "zhou陈尧"],
    };


    // 创建浮动窗口
    let floatWindow = document.createElement("div");
    floatWindow.style.display = "flex";
    floatWindow.style.position = "fixed";
    floatWindow.style.top = "30%";
    floatWindow.style.right = "0";
    floatWindow.style.transform = "translateY(-50%)";
    floatWindow.style.backgroundColor = "white";
    floatWindow.style.border = "1px solid black";
    floatWindow.style.padding = "10px";
    floatWindow.style.zIndex = "10000";
    floatWindow.style.flexDirection = "column"; // 添加这一行来使元素竖向排列

    document.body.appendChild(floatWindow);

    // 创建模板下拉菜单
    let templateMenu = document.createElement("select");
    templateMenu.style.width = "323px";

    // 添加模板占位符选项
    let placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "弹幕模板";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    templateMenu.appendChild(placeholderOption);

    // 添加模板选项
    templates.forEach((template) => {
        let option = document.createElement("option");
        option.value = template;
        option.textContent = template;
        templateMenu.appendChild(option);
    });

    // 创建cosplay下拉菜单
    let cosplay = document.createElement("select");
    cosplay.style.width = "323px";

    // 添加cosplay占位符选项
    let cosplayPlaceHolder = document.createElement("option");
    cosplayPlaceHolder.value = "";
    cosplayPlaceHolder.textContent = "cosplay";
    cosplayPlaceHolder.disabled = true;
    cosplayPlaceHolder.selected = true;
    cosplay.appendChild(cosplayPlaceHolder);

    // 添加分组和选项
    for (let group in cosplayGroups) {
        let optgroup = document.createElement("optgroup");
        optgroup.label = group;
        cosplayGroups[group].forEach((username) => {
            let option = document.createElement("option");
            option.value = username;
            option.textContent = username;
            optgroup.appendChild(option);
        });
        cosplay.appendChild(optgroup);
    }
    // contentContainer.appendChild(cosplay);
    // contentContainer.appendChild(templateMenu);


    // 创建输入框
    let inputField = document.createElement("textarea");
    inputField.rows = 4;
    inputField.cols = 70;

    inputField.style.width = "200px";
    // inputField.style.marginLeft = "10px";
    // contentContainer.appendChild(inputField);

    // 创建发送按钮
    let sendButton = document.createElement("button");
    sendButton.textContent = "发送";
    sendButton.style.marginLeft = "10px";
    sendButton.style.paddingLeft = "10px";
    sendButton.style.paddingRight = "10px";
    sendButton.style.border = "1px solid black";
    // contentContainer.appendChild(sendButton);

    // 创建折叠/展开按钮
    let toggleButton = document.createElement("button");
    toggleButton.textContent = "🤡";
    toggleButton.style.backgroundColor = "orange";
    toggleButton.style.border = "none";
    toggleButton.style.color = "white";
    toggleButton.style.fontSize = "16px";
    toggleButton.style.padding = "0px 10px 5px 10px";
    toggleButton.style.cursor = "pointer";
    toggleButton.style.marginLeft = "10px";
    floatWindow.appendChild(toggleButton);

    // 定义发送弹幕的函数
    function sendDanmu(content) {
        let textarea = document.querySelector("textarea.ChatSend-txt");
        if (textarea) {
            textarea.value = content;
            textarea.focus();
            let sendButton = document.querySelector(".ChatSend-button");
            if (sendButton) {
                sendButton.click(); // 点击发送按钮提交弹幕
            }
        }
    }

    // 发送按钮点击事件
    sendButton.onclick = function () {
        if(cosplay.value!=""){
            sendDanmu("@" + cosplay.value + "：" + inputField.value);
        }else{
            sendDanmu(inputField.value);
        }
    };

    sendButton.addEventListener("click", function() {
        window.scrollTo(0, 0); // 滚动到页面顶部
    });

    // 下拉菜单变更事件
    templateMenu.onchange = function () {
        inputField.value = templateMenu.value;
    };

    // 折叠/展开按钮点击事件
    toggleButton.onclick = function () {
        if (contentContainer.style.display === "none") {
            contentContainer.style.display = "block";
            toggleButton.textContent = "×";
        } else {
            contentContainer.style.display = "none";
            toggleButton.textContent = "🤡";
        }
    };

    // 创建浮窗容器
    let contentContainer = document.createElement("div");
    contentContainer.style.paddingTop = "5px";
    contentContainer.style.display = "none";
    floatWindow.appendChild(contentContainer);

    // 创建表格
    let table = document.createElement("table");
    contentContainer.appendChild(table);

    // 创建第一行：Cosplay下拉菜单
    let row1 = document.createElement("tr");
    let cell1_1 = document.createElement("td");
    cell1_1.textContent = "Cosplay：";
    row1.appendChild(cell1_1);

    let cell1_2 = document.createElement("td");
    cell1_2.appendChild(cosplay);
    row1.appendChild(cell1_2);

    table.appendChild(row1);

    // 创建第二行：弹幕模板下拉菜单
    let row2 = document.createElement("tr");
    let cell2_1 = document.createElement("td");
    cell2_1.textContent = "弹幕模板：";
    row2.appendChild(cell2_1);

    let cell2_2 = document.createElement("td");
    cell2_2.appendChild(templateMenu);
    row2.appendChild(cell2_2);

    table.appendChild(row2);


    // 创建第三行：输入框和发送按钮
    let row3 = document.createElement("tr");

    let cell3_1 = document.createElement("td");
    cell3_1.textContent = "输入弹幕：";
    row3.appendChild(cell3_1);

    let cell3_2 = document.createElement("td");
    cell3_2.style.display = "flex";
    cell3_2.appendChild(inputField);

    inputField.style.marginRight = "10px";
    cell3_2.appendChild(sendButton);

    row3.appendChild(cell3_2);
    table.appendChild(row3);

    // 拖动逻辑
    let isDragging = false;
    let mouseDownX, mouseDownY, initX, initY;
    let mouse_throttle_flag = false;
    let mouse_throttle;

    floatWindow.onmousedown = function (e) {
        if (contentContainer.style.display === "none") {
            // 如果窗口是折叠状态，允许拖动
            isDragging = true;
            mouseDownX = e.pageX;
            mouseDownY = e.pageY;
            initX = floatWindow.offsetLeft;
            initY = floatWindow.offsetTop;

            // 禁止文本选择
            document.body.style.userSelect = "none";

            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        }
    };

    function onMouseMove(e) {
        if (isDragging) {
            if (!mouse_throttle_flag) {
                mouse_throttle_flag = true;
                mouse_throttle = setTimeout(() => {
                    mouse_throttle_flag = false;
                    let mouseMoveX = e.pageX,
                        mouseMoveY = e.pageY;
                    floatWindow.style.right =
                        window.innerWidth - mouseMoveX + mouseDownX - initX - 70 + "px";
                    floatWindow.style.top = mouseMoveY - mouseDownY + initY + "px";
                    floatWindow.style.transform = "none";
                }, 5);
            }
        }
    }

    function onMouseUp() {
        isDragging = false;

        // 恢复文本选择
        document.body.style.userSelect = "";

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }

    // +1 部分 ==============================================================================================================
    function addButtonToContainer() {
        // 查找按钮容器
        let container = document.querySelector(".btnscontainer-4e2ed0");
        if (!container) return;

        // 检查容器中是否已经存在 +1 按钮
        if (container.querySelector(".plus-one-button")) return;

        // 创建一个分隔符
        let separator = document.createElement("p");
        separator.className = "sugun-e3fbf6";
        separator.textContent = "|";
        container.appendChild(separator);

        // 以与现有按钮相同的样式创建 +1 按钮
        let button = document.createElement("div");
        button.className = "labelfisrt-407af4 plus-one-button"; // 为 +1 按钮添加一个特定的类名
        button.textContent = "+1";
        container.appendChild(button);

        // 为 +1 按钮设置点击事件
        button.onclick = function () {
            let textContent =
                hoveredElement.querySelector(".text-edf4e7").textContent;
            sendDanmu(textContent);
        };

        button.addEventListener("click", function() {
            window.scrollTo(0, 0); // 滚动到页面顶部
        });
    }

    let hoveredElement = null;

    // 当鼠标悬停在具有特定类的元素上时，显示 +1 按钮
    document.addEventListener("mouseover", function (event) {
        // 检查容器中是否已经存在 +1 按钮，防止hoverElement不一致
        let container = document.querySelector(".btnscontainer-4e2ed0");
        if (!container) return;
        if (container.querySelector(".plus-one-button")) return;

        if (event.target.classList.contains("danmuItem-f8e204")) {
            hoveredElement = event.target;
            addButtonToContainer();
        }
    });    
})();
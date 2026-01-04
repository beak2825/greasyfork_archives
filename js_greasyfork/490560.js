// ==UserScript==
// @name         NodeSeek 表情包增强-Pepsi自用
// @namespace    https://www.nodeseek.com/
// @version      0.0.5
// @description  为 NodeSeek 添加更多表情包
// @author       原作者：TomyJan  修改自用：Pepsi
// @match        *://www.nodeseek.com/*
// @icon         https://www.nodeseek.com/static/image/favicon/android-chrome-192x192.png
// @grant        none
// @license      MPL-2.0 License
// @supportURL   https://www.nodeseek.com/post-68803-1
// @homepageURL  https://www.nodeseek.com/post-68803-1
// @downloadURL https://update.greasyfork.org/scripts/490560/NodeSeek%20%E8%A1%A8%E6%83%85%E5%8C%85%E5%A2%9E%E5%BC%BA-Pepsi%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/490560/NodeSeek%20%E8%A1%A8%E6%83%85%E5%8C%85%E5%A2%9E%E5%BC%BA-Pepsi%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 自定义表情包数据
    // 添加其它自定义表情包请参照以下格式
    const customEmotionList = {
        "小电视": {"name": "小电视", "type": "gif", "icon": "icon", "items": ["tvgif-白眼", "tvgif-doge", "tvgif-坏笑", "tvgif-难过", "tvgif-生气", "tvgif-委屈", "tvgif-斜眼笑", "tvgif-呆", "tvgif-发怒", "tvgif-惊吓", "tvgif-呕吐", "tvgif-思考", "tvgif-微笑", "tvgif-疑问", "tvgif-大哭", "tvgif-鼓掌", "tvgif-抠鼻", "tvgif-亲亲", "tvgif-调皮", "tvgif-笑哭", "tvgif-晕", "tvgif-点赞", "tvgif-害羞", "tvgif-睡着", "tvgif-色", "tvgif-吐血", "tvgif-无奈", "tvgif-再见", "tvgif-流汗", "tvgif-偷笑", "tvgif-抓狂", "tvgif-黑人问号", "tvgif-困", "tvgif-打脸", "tvgif-闭嘴", "tvgif-鄙视", "tvgif-腼腆", "tvgif-馋", "tvgif-可爱", "tvgif-发财", "tvgif-生病", "tvgif-流鼻血", "tvgif-尴尬", "tvgif-大佬"], "baseUrl": "https://emoji.shojo.cn/bili/src/tv_小电视_动图/" },
        // 贴吧表情包来自 https://github.com/microlong666/Tieba_mobile_emotions
        "贴吧": {"name": "贴吧", "type": "png", "items": ["image_emoticon", "image_emoticon2", "image_emoticon3", "image_emoticon4", "image_emoticon5", "image_emoticon6", "image_emoticon7", "image_emoticon8", "image_emoticon9", "image_emoticon10", "image_emoticon11", "image_emoticon12", "image_emoticon13", "image_emoticon14", "image_emoticon15", "image_emoticon16", "image_emoticon17", "image_emoticon18", "image_emoticon19", "image_emoticon20", "image_emoticon21", "image_emoticon22", "image_emoticon23", "image_emoticon24", "image_emoticon25", "image_emoticon26", "image_emoticon27", "image_emoticon28", "image_emoticon29", "image_emoticon30", "image_emoticon31", "image_emoticon32", "image_emoticon33", "image_emoticon34", "image_emoticon35", "image_emoticon36", "image_emoticon37", "image_emoticon38", "image_emoticon39", "image_emoticon40", "image_emoticon41", "image_emoticon42", "image_emoticon43", "image_emoticon44", "image_emoticon45", "image_emoticon46", "image_emoticon47", "image_emoticon48", "image_emoticon49", "image_emoticon50", "image_emoticon62", "image_emoticon63", "image_emoticon64", "image_emoticon65", "image_emoticon66", "image_emoticon67", "image_emoticon68", "image_emoticon69", "image_emoticon70", "image_emoticon71", "image_emoticon72", "image_emoticon73", "image_emoticon74", "image_emoticon75", "image_emoticon76", "image_emoticon77", "image_emoticon78", "image_emoticon79", "image_emoticon80", "image_emoticon81", "image_emoticon82", "image_emoticon83", "image_emoticon84", "image_emoticon85", "image_emoticon86", "image_emoticon87", "image_emoticon88", "image_emoticon89", "image_emoticon90", "image_emoticon91", "image_emoticon92", "image_emoticon93", "image_emoticon94", "image_emoticon95", "image_emoticon96", "image_emoticon97", "image_emoticon98", "image_emoticon99", "image_emoticon100", "image_emoticon101", "image_emoticon102", "image_emoticon103", "image_emoticon104", "image_emoticon105", "image_emoticon106", "image_emoticon107", "image_emoticon108", "image_emoticon109", "image_emoticon110", "image_emoticon111", "image_emoticon112", "image_emoticon113", "image_emoticon114", "image_emoticon115", "image_emoticon116", "image_emoticon117", "image_emoticon118", "image_emoticon119", "image_emoticon120", "image_emoticon121", "image_emoticon122", "image_emoticon123", "image_emoticon124"], "baseUrl": "https://cdn.jsdelivr.net/gh/microlong666/tieba_mobile_emotions/" },
        "自用gif": {"name": "自用gif", "type": "gif", "items": ["丁真1", "三色图"], "baseUrl": "https://cdn.jsdelivr.net/gh/9f2wMKS/biaoqingbao@c537cf5a146b41574128d3a4f41b3556b4d338f5/gif/"},
       "自用表情包": {"name": "自用表情包", "type": "jpg", "items": ["祖国人1", "祖国人2", "祖国人3","祖国人4", "祖国人5", "祖国人6", "祖国人7", "惊讶", "疑惑", "哪里买", "朋友", "专业", "3g", "50可以解决", "兄弟这不要钱", "北京申奥成功", "波波", "极端表现", "好他妈厉害", "好兄弟的肯定", "忽悠人还是你在行", "滑稽1", "划水", "惊讶2", "开开眼界", "拍头1", "认清形势放弃幻想", "三色图", "偷瞄", "问题不大", "我是公安", "熊猫1", "学到许多", "张三点赞", "真有你的喔", "主要是没钱", "AWS", "debian", "gcp", "oracle"], "baseUrl": "https://cdn.jsdelivr.net/gh/9f2wMKS/biaoqingbao@c537cf5a146b41574128d3a4f41b3556b4d338f5/jpg/"}
  };

    // 页面加载完毕后初始化自定义表情包
    window.addEventListener('load', initCustomEmotions, false);

    function initCustomEmotions() {
        setupEmotionTitles();
        setupEmotionTitlesClickHandler();
        monitorExpContainerChanges();
    }

    // 设置自定义表情包标题
    function setupEmotionTitles() {
        const emotionTitleDiv = document.querySelector('.expression');
        Object.keys(customEmotionList).forEach(key => {
            const newDiv = createEmotionTitle(key);
            emotionTitleDiv.appendChild(newDiv);
        });
    }

    // 创建表情包标题元素
    function createEmotionTitle(key) {
        const newDiv = document.createElement('div');
        newDiv.id = `custom-emotion-${key}`;
        newDiv.classList.add('custom-emotion');
        newDiv.innerHTML = `&nbsp;${customEmotionList[key].name}&nbsp;`;
        newDiv.style.cursor = 'pointer';
        addHoverEffect(newDiv);
        return newDiv;
    }

    // 添加标题鼠标悬浮效果
    function addHoverEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.1)';
            element.style.transition = 'transform 0.3s ease';
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
    }

    // 设置自定义表情包标题的点击事件处理
    function setupEmotionTitlesClickHandler() {
        document.querySelectorAll('.expression .custom-emotion').forEach(item => {
            item.addEventListener('click', () => {
                handleCustomEmotionClick(item);
            });
        });
    }

    // 处理点击自定义表情包标题事件
    function handleCustomEmotionClick(clickedItem) {
        const containerDiv = document.querySelector('.exp-container');

        // // 判断 containerDiv 的内容里面是不是包含 <!----> , 如果不包含就说明官方表情包打开了
        const isOfficial = containerDiv.innerHTML.indexOf('<!---->') === -1;


        const isCurrent = clickedItem.classList.contains('current-group');
        const isOpen = containerDiv.classList.contains('open');




        // 如果容器未打开或当前选中的不是点击的标题或者打开了官方表情包，则更新显示
        if (!isOpen || !isCurrent || isOfficial) {
            if (isOfficial) { // 打开了官方表情包
                document.querySelector('.exp-item.current-group').click();
                setTimeout(() => {
                    if (containerDiv.classList.contains('open')) { // 判断官方表情包是否已经关闭
                        return; // 关不掉就别干了吧
                        // TODO: 一个更好的方法避免这俩共存
                    }
                    updateEmotionDisplay(clickedItem, containerDiv);
                }, 600);
            } else
                updateEmotionDisplay(clickedItem, containerDiv);
        } else { // 否则，清除并关闭
            // console.log('clear and close');
            containerDiv.classList.remove('open');
            clearEmotions();
        }
    }

    // 更新表情包显示
    function updateEmotionDisplay(clickedItem, containerDiv) {
        clearEmotions(); // 清除当前显示的表情包
        document.querySelectorAll('.expression .custom-emotion').forEach(item => {
            item.classList.remove('current-group');
        });

        clickedItem.classList.add('current-group');
        addEmotionsToContainer(clickedItem.id.replace('custom-emotion-', ''), containerDiv);
        containerDiv.classList.add('open');
    }

    // 清除表情包显示容器中的内容
    function clearEmotions() {
        const tempContainer = document.getElementById('temporary-container');
        tempContainer?.remove(); // 如果临时容器存在，则移除
    }

    // 向显示容器中添加表情包
    function addEmotionsToContainer(packKey, containerDiv) {
        const pack = customEmotionList[packKey];
        const container = document.createElement('div');
        container.id = 'temporary-container';

        pack.items.forEach(item => {
            const img = document.createElement('img');
            img.src = `${pack.baseUrl}/${item}.${pack.type}`;
            img.alt = item;
            img.className = "sticker";
            img.style.maxWidth = "90px";
            container.appendChild(img);
        });

        // 给表情包图片添加点击事件
        container.addEventListener('click', (e) => {
            insertToEditor(e.target.alt, e.target.src);
        });

        containerDiv.appendChild(container);
    }

    // 向编辑器中插入图片链接
    function insertToEditor(imgName, imgLink) {
        const codeMirrorElement = document.querySelector('.CodeMirror');
        if (codeMirrorElement) {
            const codeMirrorInstance = codeMirrorElement.CodeMirror;
            if (codeMirrorInstance) {
                const cursor = codeMirrorInstance.getCursor();
                codeMirrorInstance.replaceRange(`  ![表情包-${imgName}](${imgLink})  `, cursor);
            }
        }
    }

    // 监视表情包显示容器的变化, 防止同时打开官方和自定义
    function monitorExpContainerChanges() {
        // 选择要观察变动的节点
        const targetNode = document.querySelector('.exp-container');

        // 创建一个回调函数来接收变动通知
        const callback = function (mutationsList, observer) {
            // 检查.exp-container的innerHTML是否不包含'<!---->'即打开了官方表情包
            if (!targetNode.innerHTML.includes('<!---->')) {
                clearEmotions(); // 防止官方和自定义同时存在
                // 遍历所有.expression .custom-emotion类的元素并禁用
                // const customEmotions = document.querySelectorAll('.expression .custom-emotion');
                // customEmotions.forEach(element => {
                //     element.disabled = true; // 这里假设这些元素是可以被禁用的，比如按钮
                //     // 如果元素不能直接被禁用，可能需要添加逻辑来处理（比如添加一个类或属性来表示禁用状态）
                // });
            }
        };

        // 创建MutationObserver实例并传入回调函数
        const observer = new MutationObserver(callback);

        // 使用配置对象指定要观察的变动类型
        const config = { childList: true, subtree: true, characterData: true };

        // 开始观察目标节点
        observer.observe(targetNode, config);

        // 注意：在某个时刻，你可能需要停止观察
        // observer.disconnect();
    }

})();

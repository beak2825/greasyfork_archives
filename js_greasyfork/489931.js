// ==UserScript==
// @name         🔥全能AI博主🔥向任何你喜欢的博主询问他的帖子，支持小红书、知乎、微博等主流媒体
// @namespace    http://ai.xyde.net.cn
// @version      1.0
// @description  为大多数主流媒体增加AI询问功能，AI化身博主解答你的疑问
// @author       JiGuang
// @match        *://*.zhihu.com/*
// @match        *://*.xiaohongshu.com/*
// @match        *://mp.weixin.qq.com/*
// @match        *://weibo.com/*
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @license GPL v3
// @downloadURL https://update.greasyfork.org/scripts/489931/%F0%9F%94%A5%E5%85%A8%E8%83%BDAI%E5%8D%9A%E4%B8%BB%F0%9F%94%A5%E5%90%91%E4%BB%BB%E4%BD%95%E4%BD%A0%E5%96%9C%E6%AC%A2%E7%9A%84%E5%8D%9A%E4%B8%BB%E8%AF%A2%E9%97%AE%E4%BB%96%E7%9A%84%E5%B8%96%E5%AD%90%EF%BC%8C%E6%94%AF%E6%8C%81%E5%B0%8F%E7%BA%A2%E4%B9%A6%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E5%BE%AE%E5%8D%9A%E7%AD%89%E4%B8%BB%E6%B5%81%E5%AA%92%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/489931/%F0%9F%94%A5%E5%85%A8%E8%83%BDAI%E5%8D%9A%E4%B8%BB%F0%9F%94%A5%E5%90%91%E4%BB%BB%E4%BD%95%E4%BD%A0%E5%96%9C%E6%AC%A2%E7%9A%84%E5%8D%9A%E4%B8%BB%E8%AF%A2%E9%97%AE%E4%BB%96%E7%9A%84%E5%B8%96%E5%AD%90%EF%BC%8C%E6%94%AF%E6%8C%81%E5%B0%8F%E7%BA%A2%E4%B9%A6%E3%80%81%E7%9F%A5%E4%B9%8E%E3%80%81%E5%BE%AE%E5%8D%9A%E7%AD%89%E4%B8%BB%E6%B5%81%E5%AA%92%E4%BD%93.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 获取元素的css选择器路径
    function getCssSelectorPath(el) {
    if (!el) {
        return;
    }
    const paths = [];
    while (el.nodeType === Node.ELEMENT_NODE) {
        let selector = el.nodeName.toLowerCase();
        if (el.id) {
            selector += '#' + el.id;
            paths.unshift(selector);
            break;
        } else {
            let sib = el, nth = 1;
            while (sib = sib.previousElementSibling) {
                if (sib.nodeName.toLowerCase() == selector)
                   nth++;
            }
            if (nth != 1)
                selector += ":nth-of-type("+nth+")";
        }
        paths.unshift(selector);
        el = el.parentNode;
    }
    return paths.join(" > ");
}
    // 内置函数：axios/fetch风格的跨域请求
    async function request(url,data = '',method = 'GET'){
        //console.log('请求url1：',url)
        return new Promise((resolve,reject) => {
          GM_xmlhttpRequest({
              method,
              url,
              data,
              onload:(res) => {
                //console.log('response',res.response)
                resolve(JSON.parse(res.response))
              },
              onerror:(err) => {
                  reject(err)
              }
          })
      })
    }
    // 通过微信获取AI回复
    async function getAIReply(apikey = '',system_content = '',content = '',model = 'gpt-3.5-turbo'){

        return new Promise((resolve,reject)=>{
            if(apikey == '' || !apikey.startsWith('sk-')){
                reject('apikey不正确')
            }
            if(content == ''){
                reject('未输入内容')
            }
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://app-api.51coolplay.com/v1/chat/completions",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + apikey
                },
                data: JSON.stringify({
                    'model': model,
                    'messages': [{
                        'role': 'system',
                        'content': system_content
                    },{
                        'role': 'user',
                        'content': content
                    }],
                    'temperature': 0.7
                }),
                onload: (response)=>{

                    const obj = JSON.parse(response.responseText)
                    //console.log('ai :'+obj.choices[0].message.content)
                    resolve(obj.choices[0].message.content)
                },
                onerror: (err)=>{
                    reject(err)
                }
            });
        })
    }

    // 页面初始化事件
    window.addEventListener('load', function () {
        const rule = getMatchedRule()
        try{
            if(rule && rule.multi){
                setInterval(()=>{
                    let rule_all = getMultiRules(rule)
                for(let rule_single of rule_all){
                    try{
                        loadChatWindow(getPageChatInfo(rule_single));
                    }catch(err){
                        console.warn('加载按钮窗口失败' ,err);
                    }
                }
                },2000)
            }else{
                setInterval(()=>{
                    loadChatWindow(getPageChatInfo(rule));
                },2000)
            }

        }catch(err){
            console.warn('规则加载失败');
        }

    });

    // 提取多规则的规则
    function getMultiRules(rule){
        // 为每个按钮和窗口生成对应代码逻辑
        const buttons = document.querySelectorAll(rule.buttonSelector);
        const names = document.querySelectorAll(rule.robotNameSelector);
        const avatars = document.querySelectorAll(rule.robotAvatarSelector);
        const contents = document.querySelectorAll(rule.contentSelector);
        let rules = [];

        for(let index = 0; index < buttons.length; index++){
            try{
                let singleRule = {
                    keyword:rule.keyword,
                    buttonSelector: getCssSelectorPath(buttons.item(index)),
                    robotNameSelector: getCssSelectorPath(names.item(index)),
                    robotAvatarSelector:getCssSelectorPath(avatars.item(index)),
                    contentSelector:getCssSelectorPath(contents.item(index)),
                    buttonText: rule.buttonText,
                    buttonPosStyle: rule.buttonPosStyle
                };
                rules.push(singleRule);
             }catch(err){
                        console.warn(`规则解析失败:${JSON.stringify(rule)},错误原因:${err}`)
                    }
         }
        return rules;
    }

    // 从规则库里匹配规则
    function getMatchedRule() {
        // 规则数组
        const rules = [
            {
                name: '微博列表页1.0', // 规则名字
                model: '', // 使用的gpt模型
                keyword: 'weibo.com', // 页面URL必须包含的关键词
                buttonSelector: '#scroller > div.vue-recycle-scroller__item-wrapper > div > div > article > div > header > div.woo-box-flex > button', // 按钮插入位置的CSS选择器
                robotNameSelector: 'article > div > header > div.woo-box-item-flex.head_main_3DRDm > div > div.woo-box-flex.woo-box-alignCenter.head_nick_1yix2 > a > span', // 机器人名字的CSS选择器
                robotAvatarSelector: '#scroller > div.vue-recycle-scroller__item-wrapper > div > div > article > div > header > a > div > img',
                contentSelector: '#scroller > div.vue-recycle-scroller__item-wrapper > div > div > article  > div', //博主内容的选择器
                buttonText: '✨向AI博主提问', // 提问按钮的文本
                buttonPosStyle: true, // 是否采用页面同款按钮样式
                multi: true, // 是否使用批量处理器实现（支持下拉刷新同步按钮）
            },
            {
                name: '知乎问题页1.3', // 规则名字
                model: '', // 使用的gpt模型
                keyword: 'www.zhihu.com/question', // 页面URL必须包含的关键词
                buttonSelector: 'div.ContentItem-actions > button:nth-child(5)', // 按钮插入位置的CSS选择器
                robotNameSelector: 'div.AuthorInfo-head > span > div > a', // 机器人名字的CSS选择器
                robotAvatarSelector: 'div.AuthorInfo > span > div > a > img',
                contentSelector: 'div.RichContent.RichContent--unescapable > span:nth-child(1) > div', //博主内容的选择器
                buttonText: '✨向AI博主提问', // 提问按钮的文本
                buttonPosStyle: true, // 是否采用页面同款按钮样式
                multi: true, // 是否使用批量处理器实现（支持下拉刷新同步按钮）
            },{
                name: '知乎文章页面1.1', // 规则名字
                model: '', // 使用的gpt模型
                keyword: 'zhuanlan.zhihu.com/p/', // 页面URL必须包含的关键词
                robotNameSelector: '#root > div > main > div > article > header > div.Post-Author > div > div > div > div.AuthorInfo-head > span > div > a', // 机器人名字的CSS选择器
                robotAvatarSelector: '#root > div > main > div > article > header > div.Post-Author > div > div > span > div > a > img', // 机器人头像的CSS选择器（指定img标签）
                contentSelector: '#root > div > main > div > article > div.Post-RichTextContainer > div > div > div', //博主内容的选择器
                buttonText: '✨向AI博主提问', // 提问按钮的文本
                buttonPosStyle: false, // 是否采用页面同款按钮样式
                async_keyword: '' //动态加载的关键词，异步加载的页面，异步处理流程：当页面变化到存在'async_keyword'的时候，加载一次聊天提问
            },{
                name: '微信公众号文章页面1.1', // 规则名字
                model: '', // 使用的gpt模型
                keyword: 'mp.weixin.qq.com/s', // 页面URL必须包含的关键词
                robotNameSelector: '#js_name', // 机器人名字的CSS选择器
                contentSelector: '#page-content > div', //博主内容的选择器
                buttonText: '✨向AI博主提问', // 提问按钮的文本
                buttonPosStyle: false, // 是否采用页面同款按钮样式
            }, {
                name:'小红书探索笔记1.0',
                keyword: 'www.xiaohongshu.com', // 页面URL必须包含的关键词
                buttonSelector: '#noteContainer > div.interaction-container > div.author-container > div > div.note-detail-follow-btn > button', // 按钮插入位置的CSS选择器
                robotNameSelector: '#noteContainer > div.interaction-container > div.author-container > div > div.info > a.name > span', // 机器人名字的CSS选择器
                robotAvatarSelector: '#noteContainer > div.interaction-container > div.author-container > div > div.info > a:nth-child(1) > img', // 机器人头像的CSS选择器（指定img标签）
                contentSelector: '#detail-desc', //博主内容的选择器
                buttonText: '✨向AI博主提问', // 提问按钮的文本
                buttonPosStyle: true,
            }
        ];

        // 获取当前页面URL
        const currentPageUrl = window.location.href;

        // 尝试匹配规则
        let matchedRule = null;
        for (let rule of rules) {
            if (currentPageUrl.includes(rule.keyword)) {
                matchedRule = rule;
            }
        }
        return matchedRule;
    }

    // 获取页面的匹配聊天信息
    function getPageChatInfo(rule) {
        let systemPrompt = '';
        const id = Math.floor(Math.random() * (999999 - 1 + 1)) + 1;
        // 默认机器人头像是个灰色圆形头像
        const defaultRobotAvatar = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'48\' height=\'48\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%239E9E9E\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\' class=\'feather feather-user\'%3E%3Cpath d=\'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2\'/%3E%3Ccircle cx=\'12\' cy=\'7\' r=\'4\'/%3E%3C/svg%3E';
        // 默认用户头像
        const userAvatar = "data:image/svg+xml,%3Csvg t='1710514645931' class='icon' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg' p-id='4241' width='200' height='200'%3E%3Cpath d='M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667zM288 810.666667c0-123.733333 100.266667-224 224-224S736 686.933333 736 810.666667c-61.866667 46.933333-140.8 74.666667-224 74.666666s-162.133333-27.733333-224-74.666666z m128-384c0-53.333333 42.666667-96 96-96s96 42.666667 96 96-42.666667 96-96 96-96-42.666667-96-96z m377.6 328.533333c-19.2-96-85.333333-174.933333-174.933333-211.2 32-29.866667 51.2-70.4 51.2-117.333333 0-87.466667-72.533333-160-160-160s-160 72.533333-160 160c0 46.933333 19.2 87.466667 51.2 117.333333-89.6 36.266667-155.733333 115.2-174.933334 211.2-55.466667-66.133333-91.733333-149.333333-91.733333-243.2 0-204.8 168.533333-373.333333 373.333333-373.333333S885.333333 307.2 885.333333 512c0 93.866667-34.133333 177.066667-91.733333 243.2z' fill='%23666666' p-id='4242'%3E%3C/path%3E%3C/svg%3E";
        // 机器人默认名字和头像
        let robotName = 'AI助手';
        let robotAvatar = defaultRobotAvatar;
        let buttonText = '💬AI聊天';
        let buttonPosStyle = false;
        let buttonSelector = 'body';
        let content = '';
        // 尝试获取机器人名字和头像
        try {
            if (rule) {
                const nameElement = document.querySelector(rule.robotNameSelector);
                if (nameElement) robotName = nameElement.innerText;
                const contentElement = document.querySelector(rule.contentSelector);
                if (contentElement) {
                    // 获取元素的文本内容
                    const fullContent = contentElement.innerText;
                    // 如果内容长度超过1500个字符，则截取前1500个字符；否则，使用全部内容
                    content = fullContent.length > 1500 ? fullContent.substring(0, 1500) : fullContent;
                }
                const avatarElement = document.querySelector(rule.robotAvatarSelector);
                if (avatarElement) robotAvatar = avatarElement.src;

                if (rule.buttonText) buttonText = rule.buttonText;
                if (rule.buttonPosStyle) buttonPosStyle = rule.buttonPosStyle;
                if (rule.buttonSelector) buttonSelector = rule.buttonSelector;
                systemPrompt = `你要扮演一个博主，你的名字是「${robotName}」，你要根据以下你写的帖子的内容进行模仿回复，请你直接回复我你要回复的内容，注意你的回复要根据你的帖子内容和说话语气进行回复，你要以这个博主的第一人称视角回复。现在请你开始和我对话。你的帖子内容是「${content}」。`
            }
        } catch (error) {
            console.error('无法设置机器人名字和头像，使用默认值。', error);
        }

        return {
            id,
            buttonSelector,
            robotName,
            robotAvatar,
            systemPrompt,
            userAvatar,
            buttonText,
            buttonPosStyle
        }
    }

    // 加载聊天窗口、聊天按钮、点击事件
    async function loadChatWindow(chatInfo) {
        //console.log(chatInfo.robotAvatar);
        if(window[chatInfo.robotAvatar]){
            //console.log('重复元素不渲染',chatInfo);
            return;
        }
        window[chatInfo.robotAvatar] = true;
        // 创建提问按钮
        const questionButton = document.createElement('button');
        questionButton.textContent = chatInfo.buttonText;

        // 根据规则插入按钮或使用默认位置
        if (chatInfo.buttonPosStyle && document.querySelector(chatInfo.buttonSelector)) {
            const targetElement = document.querySelector(chatInfo.buttonSelector);
            targetElement.after(questionButton);
            // 应用目标元素的样式和类
            questionButton.className = targetElement.className;
            questionButton.style = targetElement.style;
        } else {
            // 默认按钮样式
            questionButton.style.padding = '10px 20px';
            questionButton.style.border = 'none';
            questionButton.style.borderRadius = '5px';
            questionButton.style.backgroundColor = '#007bff';
            questionButton.style.color = 'white';
            questionButton.style.cursor = 'pointer';
            questionButton.style.position = 'fixed';
            questionButton.style.bottom = '20px';
            questionButton.style.right = '20px';
            questionButton.style.zIndex = '10000';
            document.body.appendChild(questionButton);
        }
        // 检索用户信息。是否需要扫码登录
        let wx_id = GM_getValue('aibozhu_wx_id',null);
        let username = GM_getValue('aibozhu_username',null);
        let apikey = GM_getValue('aibozhu_apikey',null);
        let need_login = false;
        let login_content = `<div style="margin: 5px 0; display: flex; align-items: center; background-color: rgba(128, 128, 128, 0.5); border-radius: 10px; padding: 10px;">
            <div id="wx-login-${chatInfo.id}" style="width: 100%;"><img id="qr-${chatInfo.id}" style="width:200px" src=""></img><br>请您用微信扫码后再开始聊天（新用户赠送5万字对话额度）</div></div>`;
        if(wx_id == null || apikey == null){
            need_login = true;
        }
        if(need_login){
            const url = 'https://51coolplay.com/api/weixin/create_qr_code.php?scene_id=128';
            let res = await request(url);
            let qr_info = res;
            setTimeout(()=>{
            document.querySelector(`#qr-${chatInfo.id}`).src = 'https://51coolplay.com/api/weixin/get_qr_img.php?ticket=' + qr_info.ticket;
            },1000);
            setInterval(async ()=>{
                if(sessionStorage.getItem(`qr-${chatInfo.id}`) == 'finish'){
                    return;
                }
                if(document.querySelector(`#chatWindow-${chatInfo.id}`).style.display === 'none'){
                    return;
                }
                let td = await request(`https://51coolplay.com/api/weixin/temp_data/${qr_info.ticket}.json`);
                let scan_data = td;
                if(scan_data.step == 1){
                    wx_id = scan_data.user.openid;
                    GM_setValue('aibozhu_wx_id',wx_id);
                    let res5985 = await request('https://env-00jxgan8r9o9.dev-hz.cloudbasefunction.cn/wx_app_login?wxid=' + wx_id);
                    apikey = res5985.data.apikey;
                    GM_setValue('aibozhu_apikey',apikey);
                    username = res5985.data.username;
                    GM_setValue('aibozhu_username',username);
                    sessionStorage.setItem(`qr-${chatInfo.id}`,'finish');
                    document.querySelector(`#wx-login-${chatInfo.id}`).innerHTML = `欢迎您，<a href="https://app.51coolplay.com" target="_blank">${username}>></a>`;
                }
            },2000);

        }else{
            setTimeout(()=>{
            document.querySelector(`#wx-login-${chatInfo.id}`).innerHTML = `欢迎您，<a href="https://app.51coolplay.com" target="_blank">${username}</a>，<a style="cursor:pointer;" id="exit-${chatInfo.id}">退出登录>></a>`;},1000);
        }
        setTimeout(()=>{
            document.querySelector(`#exit-${chatInfo.id}`).onclick=()=>{
                GM_setValue('aibozhu_wx_id',null);
                GM_setValue('aibozhu_username',null);
                GM_setValue('aibozhu_apikey',null);
                document.querySelector(`#wx-login-${chatInfo.id}`).innerHTML = `退出登录成功，刷新页面后生效`;
            }},2000);

        // 创建对话窗口HTML结构
        const chatHtml = `
        <div id="chatWindow-${chatInfo.id}" style="display:none; position: fixed; bottom: 60px; right: 20px; width: 380px; height: 500px; background-color: #f3f3f3; border-radius: 15px; box-shadow: 0 0 10px rgba(0,0,0,0.5); overflow: hidden; z-index: 10001;">
    <div id="chatTitle-${chatInfo.id}" style="cursor: crosshair; padding: 10px; background-color: gray; color: white; border-top-left-radius: 15px; border-top-right-radius: 15px;">
        与 ${chatInfo.robotName} 对话中
        <button id="closeButton-${chatInfo.id}" style="float: right; border: none; background-color: transparent; color: white; cursor: pointer;">X</button>
    </div>
    <div style="padding: 15px;">
    <div id="chatContent-${chatInfo.id}" style="height: 380px; overflow-y: auto; padding: 10px;">
        <div style="margin: 5px 0; display: flex; align-items: center; background-color: rgba(128, 128, 128, 0.5); border-radius: 10px; padding: 10px;">
            <div style="width: 100%;"><b>系统提示：</b>注意，您正在聊天的对象是基于文本内容生成的AI，仅用作AI情景搭配，不代表其真人，聊天对象所说的话也由AI生成，不代表任何人的观点。同时，使用即代表您认为本次对话仅用作学习交流，不会他用。若不同意请您关闭会话。</div>
        </div>
        ${login_content}
        <div style="margin: 5px 0; display: flex; align-items: center; background-color: rgba(128, 128, 128, 0.5); border-radius: 10px; padding: 10px;">
            <img src="${chatInfo.robotAvatar}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 5px;">
            <div><b>${chatInfo.robotName}：</b>你对我发表的内容想了解什么呢？</div>
        </div>
        <!-- 添加的两个问题按钮 -->
        <div style="margin: 5px 0; display: flex; justify-content: space-around;">
            <button id="sendButton-${chatInfo.id}-1" style="border: none; background-color: rgba(128, 128, 128, 0.5); color: white; border-radius: 5px; cursor: pointer;padding: 5px;">总结一下你发表的内容</button>
            <button id="sendButton-${chatInfo.id}-2" style="margin-left:2px;border: none; background-color: rgba(128, 128, 128, 0.5); color: white; border-radius: 5px; cursor: pointer;padding: 5px;">你怎么看你发表的内容</button>
        </div>
    </div>
    <div style="display: flex; padding: 5px;">
        <input placeholder="请输入你想说的话...." type="text" id="chatInput-${chatInfo.id}" style="flex-grow: 1; height: 30px; border: none; border-radius: 15px; padding-left: 10px;">
        <button id="sendButton-${chatInfo.id}" style="margin-left: 5px; border: none; background-color: #007bff; color: white; border-radius: 5px; cursor: pointer;padding:3px">发送</button>
    </div>
    </div>
</div>

    `;
        document.body.insertAdjacentHTML('beforeend', chatHtml);

        const chatWindow = document.querySelector(`#chatWindow-${chatInfo.id}`);
        const chatTitle = document.querySelector(`#chatTitle-${chatInfo.id}`);
        // 初始化变量用于拖拽
        let isDragging = false;
        let dragOffsetX = 0;
        let dragOffsetY = 0;

        // 当鼠标按下时开始拖拽
        chatTitle.addEventListener('mousedown', function (e) {
            isDragging = true;
            dragOffsetX = e.clientX - chatWindow.offsetLeft;
            dragOffsetY = e.clientY - chatWindow.offsetTop;
        });

        // 当鼠标移动时更新窗口位置
        document.addEventListener('mousemove', function (e) {
            if (isDragging) {
                chatWindow.style.left = e.clientX - dragOffsetX + 'px';
                chatWindow.style.top = e.clientY - dragOffsetY + 'px';
            }
        });

        // 当鼠标松开时停止拖拽
        document.addEventListener('mouseup', function () {
            isDragging = false;
        });

        // 防止拖动时选中文本
        chatTitle.addEventListener('selectstart', function (e) {
            if (isDragging) {
                e.preventDefault();
            }
        });

        // 显示或隐藏对话窗口
        questionButton.addEventListener('click', function () {
            const chatWindow = document.getElementById(`chatWindow-${chatInfo.id}`);
            chatWindow.style.display = chatWindow.style.display === 'none' ? 'block' : 'none';
        });

        // 关闭按钮事件
        const closeButton = document.getElementById(`closeButton-${chatInfo.id}`);
        closeButton.addEventListener('click', function () {
            const chatWindow = document.getElementById(`chatWindow-${chatInfo.id}`);
            chatWindow.style.display = 'none';
        });
        const sendMsg = async function () {

            const chatInput = document.getElementById(`chatInput-${chatInfo.id}`);
            const chatContent = document.getElementById(`chatContent-${chatInfo.id}`);
            if (chatInput.value.trim() !== '') {
                let question = chatInput.value;
                const userMessage = document.createElement('div');
                userMessage.innerHTML = `<div style="margin: 5px 0; display: flex; align-items: center; background-color: rgba(0, 128, 0, 0.5); border-radius: 10px; padding: 10px;">
            <img src="${chatInfo.userAvatar}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 5px;">
            <div style="width:90%;"><b>我：</b>${chatInput.value}</div>
        </div>`;
                chatContent.appendChild(userMessage);
                chatInput.value = ''; // 清空输入框
                chatContent.scrollTop = chatContent.scrollHeight; // 滚动到最新消息

                // 机器人正在输入...
                const typingMessage = document.createElement('div');
                typingMessage.innerHTML = `<div style="margin: 5px 0; display: flex; align-items: center; background-color: rgba(128, 128, 128, 0.5); border-radius: 10px; padding: 10px;">
            <img src="${chatInfo.robotAvatar}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 5px;">
            <div><b>${chatInfo.robotName}：</b>正在输入...</div></div>`;
                chatContent.appendChild(typingMessage);
                chatContent.scrollTop = chatContent.scrollHeight;
                // 获取ai回复
                let reply = '';
                try{
                    reply = await getAIReply(apikey,chatInfo.systemPrompt,question);
                }catch(err){
                    reply = '您尚未扫码登录用户或用户额度不足（<a href="https://app.51coolplay.com" target="_blank">点此查看AI系统</a>）';
                }
                //  发起回复
                chatContent.removeChild(typingMessage);
                const robotReply = document.createElement('div');
                robotReply.innerHTML = `<div style="margin: 5px 0; display: flex; align-items: center; background-color: rgba(128, 128, 128, 0.5); border-radius: 10px; padding: 10px;">
            <img src="${chatInfo.robotAvatar}" style="width: 30px; height: 30px; border-radius: 50%; margin-right: 5px;">
            <div style="width:90%;"><b>${chatInfo.robotName}：</b>${ reply }</div>
        </div>`;
                chatContent.appendChild(robotReply);
                chatContent.scrollTop = chatContent.scrollHeight;
            }
        }

        // 处理发送按钮点击事件
        const sendButton = document.getElementById(`sendButton-${chatInfo.id}`);
        sendButton.addEventListener('click', sendMsg);
        const sendButton1 = document.getElementById(`sendButton-${chatInfo.id}-1`);
        sendButton1.addEventListener('click', ()=>{
            document.getElementById(`chatInput-${chatInfo.id}`).value = '总结一下你发表的内容';
            sendMsg();
        });
        const sendButton2 = document.getElementById(`sendButton-${chatInfo.id}-2`);
        sendButton2.addEventListener('click', ()=>{
            document.getElementById(`chatInput-${chatInfo.id}`).value = '你怎么看你发表的内容';
            sendMsg();
        });
    }

})();

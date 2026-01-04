// ==UserScript==
// @name         Bilibili【哔哩哔哩】 内容屏蔽
// @namespace    lemonades
// @version      1.3
// @author       Lyzoris
// @description  使用正则和黑名单屏蔽 Bilibili 用户评论、动态、视频等内容 
// @match        https://www.bilibili.com
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @match        https://www.bilibili.com/opus/*
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://www.bilibili.com/read/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-end
// @require      https://greasyfork.org/scripts/448895-elementgetter%E5%BA%93/code/ElementGetter%E5%BA%93.js?version=1106656
// @downloadURL https://update.greasyfork.org/scripts/457913/Bilibili%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%20%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/457913/Bilibili%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%20%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
(function () {
    "use surict";
    const isNew = document.querySelectorAll('.item.goback').length != 0;
    const elmGetter = new ElementGetter();
    const ScriptStyleStr = `
    <style>
    .script-hide{position:fixed;right:10px;bottom:10px;width:20px;height:20px;font-size:15px;line-height:20px;text-align:center;color:#009688;background-color:#e2e1e2b3;border-radius:5px;box-shadow:2px 0px 4px 0px #0000002b}.script-hide svg{width:100%;height:100%}.script-hide:hover{background-color:#76cb9dc9;box-shadow:2px 0px 4px 0px #76cb9d91}.script-hide:hover svg path{fill:#ffffff}.script-main{display:none;width:320px;height:400px;position:fixed;padding:10px;right:60px;bottom:20px;font-size:15px;line-height:20px;text-align:center;color:#929292;background-color:#ffffff;border-radius:5px;box-shadow:0 0 4px 0px #0000002b;box-sizing:border-box;z-index:999}
    .tagbar-active{background-color:#ab85d1c9;box-shadow:2px 0px 4px 0px #c893e291}.tagbar-active svg path{fill:#ffffff}#reg-ruler{float:left;line-height:20px}.label-userInfo{float:left;line-height:20px;width:66px;text-align:left}#reg-ruler:hover{color:#81afc5}#reg-ruler:active{color:#cc6d89}#input-reg,#input-userName,#input-userID{margin-bottom:4px;width:67%;height:20px;left:20%;border-radius:4px;border:solid 1px #b0b0b0}#input-userName,#input-userID{width:76%}#input-reg:focus,#input-userName:focus,#input-userID:focus{outline:none;background-color:#d5d5d559}
    .tagbar-btn{background-color:#ffffff;color:#929292;height:20px;margin:5px 0px 5px 0;padding:0 4px 0 4px;border:none;border-radius:4px;font-weight:bold;transform-origin:center;transform:scale(0.9) translate(-10%,-10%);font-size:13px;text-align:center;box-shadow:#b1b1b13d 0px 0px 3px 2px}.tagbar-btn:hover{color:#37a279ab}.tagbar-btn:active{color:#b4b6ee}#blockUser{font-size:14px;font-weight:bold;text-align:center;width:100%;margin:4px 0 8px 0;cursor:default}#blockUser-input{display:none}#blockUser-label::before{display:block;content:'';width:16px;height:16px;border-radius:50%;background:white;position:absolute;left:0px;top:50%;transform:translateY(-50%);transition:all .3s}
    #blockUser-label{display:inline-block;width:50px;height:16px;border-radius:16px;background:#929292;cursor:pointer;position:relative;overflow:hidden;margin:0 8px 0 8px;vertical-align:text-bottom}#blockUser-label::after{display:block;content:'';width:0;height:100%;background:#4fb153;transition:all .3s;border-radius:10px}#blockUser-input:checked ~ #blockUser-label::before{left:34px}#blockUser-input:checked ~ #blockUser-label::after{width:100%}#blockUser-input:checked ~ #blockUser-manual{color:#4fb153}.regBar,.blockBar{margin-top:5px;width:100%;flex:1;bottom:0px;border-radius:4px;background-color:rgb(243,238,233);overflow-y:auto;padding:4px;box-sizing:border-box}
    .regBar::-webkit-scrollbar,.blockBar::-webkit-scrollbar{width:4px;height:4px}.regBar::-webkit-scrollbar-thumb,.blockBar::-webkit-scrollbar-thumb{border-radius:5px;box-shadow:inset 0 0 5px rgba(0,0,0,0.2);background:rgba(0,0,0,0.2)}.regBar::-webkit-scrollbar-track,.blockBar::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0,0,0,0.2);border-radius:0px;background:rgba(0,0,0,0.1)}.tags{float:left;width:40px;height:20px;font-size:12px;border-radius:5px;color:#49414b;text-align:center;transform-origin:center;transform:scale(0.9) translate(-10%,-10%);line-height:20px;background-color:#ededed;margin-left:5px;margin-top:5px;cursor:pointer;box-shadow:0px 1px 5px 0 #00000033}
    .tags:hover{background-color:#ced1d2c4}.delete-tag{position:relative;top:-3px;right:0;width:20px;height:20px;border-radius:50%;transform-origin:center;transform:scale(0.6) translate(-50%,-50%);font-size:20px;color:#ffffff00;line-height:18px;background-color:#ffffff00}.delete-tag:hover{color:white!important;background-color:crimson!important}.tags:hover > .delete-tag{color:#434343fa;background-color:#bbb5b54d}.tag-info{position:relative;margin-top:-20px;font-weight:bold}.topnav{top:8px;width:93%;height:20px;line-height:20px;position:absolute;color:#8e8e8e;background-color:#ddddd98c;border-radius:4px;cursor:default}
    .topnav-active{color:#dd7a7a;background-color:#ffffff;border-radius:4px;height:16px;line-height:16px;box-shadow:0 0 3px 1px #3f3d3d80}.topnav-option{display:inline-block;font-size:12px;font-weight:bold;padding:0 5px 0 5px}.topnav-option:nth-child(2){margin:0 38px 0 38px}.scriptBar{margin-top:30px;height:92%;display:flex;flex-direction:column}.block-btn{margin:0 20px 0 20px;cursor:pointer}.block-btn:hover{color:#00aeec}
    </style>`;
    const ScriptBodyStr = `
    <div id="scriptBody">
        <div class='script-hide'>
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16">
                <path d="M593.949942 770.425747c2.908236-4.233418 4.614088-9.380648 4.614088-14.892175s-1.705851-10.658757-4.614088-14.922874L431.084621 577.00041c-10.32209-10.324136-10.32209-27.042913 0-37.381375l158.601204-159.117974c5.376451-4.843308 8.771781-11.818163 8.771781-19.61371 0-14.602579-11.83249-26.433022-26.434046-26.433022-5.953595 0-11.420097 1.979074-15.835663 5.298679l-5.300726 5.299703L375.020744 520.936533c-20.650319 20.647249-20.650319 54.114478 0 74.763774l177.556928 177.590698 1.811252 1.794879c4.690836 4.264117 10.903328 6.884804 17.740036 6.884804C581.18829 781.968641 589.183382 777.399579 593.949942 770.425747z" fill="#009688"></path>
            </svg>
        </div>
        <div class='script-main'>
            <div class="topnav">
                <div class="topnav-option topnav-active" index=0 id="tag-btn">正则屏蔽</div>
                <div class="topnav-option" id="comment-btn" index=1>用户屏蔽</div>
                <div class="topnav-option" id="setting-btn" index=2>脚本设置</div>
            </div>
            <div class="scriptBar reg-bar">
                <div class="inputBar">
                    <label class="tagbar-label" for="input-reg" id="reg-ruler" title="评论关键词屏蔽规则，使用正则匹配&#10;不了解正则表达式？按Alt点击跳转学习">屏蔽规则</label><input type="text" id="input-reg" autocomplete="off">
                    <input type="button" class="tagbar-btn" id="add-reg" style="float:right; height:23px; margin:2px 0 5px 0; width:20px;" value="+">
                </div>
                <div class="regBar"></div>
            </div>
            <div class="scriptBar block-bar">
                <div class="inputBar">
                    <label class="tagbar-label label-userInfo" for="input-userName" title="用户屏蔽规则，输入用户名称">用户名称</label><input type="text" id="input-userName" autocomplete="off">
                    <label class="tagbar-label label-userInfo" for="input-userID" title="用户屏蔽规则，输入用户 ID&#10;点进用户主页后该网址尾部的数字即为用户ID">用户 ID</label><input type="text" id="input-userID" autocomplete="off">
                    <input type="button" class="tagbar-btn" id="add-user" style="float:right; height:20px; margin:4px 0 5px 0; width:45px;" value="+">
                    <div id="blockUser">
                        <input type="checkbox" id="blockUser-input">
                        <span id="blockUser-manual" title="在【回复】后 添加【屏蔽】按键以手动屏蔽用户&#10;同时添加用户id到黑名单">手动屏蔽用户</span>
                        <label for="blockUser-input" id="blockUser-label"></label>
                    </div>
                </div>
                <div class="blockBar"></div>
            </div>
            <div class="scriptBar setting-bar">
            </div>
        </div>
    </div>
    `;
    const Head = document.head || document.querySelector('head');
    const Body = document.body || document.querySelector('body');
    const ScriptStyle = elmGetter.create(ScriptStyleStr);
    const ScriptBody = elmGetter.create(ScriptBodyStr);
    Head.appendChild(ScriptStyle);
    Body.appendChild(ScriptBody);
    const scriptHide = ScriptBody.querySelector('.script-hide');
    const scriptMain = ScriptBody.querySelector('.script-main');
    const topNav = ScriptBody.querySelectorAll('.topnav-option');
    const scriptBar = ScriptBody.querySelectorAll('.scriptBar');
    let input_reg = ScriptBody.querySelector('#input-reg');
    let add_reg = ScriptBody.querySelector('#add-reg');
    let regBar = ScriptBody.querySelector('.regBar');
    let blockBar = ScriptBody.querySelector('.blockBar');
    let reg_ruler = ScriptBody.querySelector('#reg-ruler');
    let input_userName = ScriptBody.querySelector('#input-userName');
    let input_userID = ScriptBody.querySelector('#input-userID');
    let add_user = ScriptBody.querySelector('#add-user');
    let block_user = ScriptBody.querySelector('#blockUser-input');
    scriptHide.onclick = () => {
        if (scriptMain.style.display === 'block') {
            scriptMain.style.display = 'none';
            scriptHide.classList.remove('tagbar-active');
        } else {
            scriptMain.style.display = 'block';
            scriptHide.classList.add('tagbar-active');
        }
    };
    topNav.forEach(btn => {
        btn.onclick = function () {
            topNav.forEach(i => { i.classList.remove('topnav-active'); });
            this.classList.add('topnav-active');
            scriptBar.forEach(i => { i.style.display = 'none'; });
            scriptBar[Number(this.getAttribute('index'))].style.display = 'flex';
        };
    });
    input_userName.onkeyup = (event)=>{
        if(event.key=='Enter' || event.key=='ArrowDown'){
            input_userID.focus()
        }
    }
    input_userID.onkeyup = (event)=>{
        if(event.key=='Enter' && (input_userName.value||input_userID.value)){
            addBlackList({"userID":input_userID.value,"userName":input_userName.value})
            input_userName.value = ''
            input_userID.value = ''
        }
    }
    reg_ruler.onclick = (event) =>{
        event.altKey && window.open('https://gitee.com/thinkyoung/learn_regex');
    }
    input_reg.onkeyup = (event)=>{
        if(event.key=='Enter' && input_reg.value){
            addKeyWord(input_reg.value)
            input_reg.value = ''
        }
    }
    add_reg.onclick = () => {
        if (input_reg.value) {
            addKeyWord(input_reg.value);
            input_reg.value = '';
        }
    };
    add_user.onclick = () => {
        if (input_userName.value || input_userID.value) {
            addBlackList({ "userID": input_userID.value, "userName": input_userName.value });
            input_userName.value = '';
            input_userID.value = '';
        }
    };
    block_user.onclick = () => {
        BLOCK = block_user.checked;
        GM_setValue('BlockUser', BLOCK);
    };
    function addKeyWord(reg_text) {
        if (!keyword.includes(reg_text)) {
            let new_tag = insertTag(regBar, reg_text);
            let keyword_index = Object.keys(comment_keyword).length;
            comment_keyword[keyword_index] = reg_text;
            keyword.push(reg_text);
            GM_setValue('Keyword', keyword);
            let deleteTag = () => {
                regBar.removeChild(new_tag);
                delete comment_keyword[keyword_index];
                keyword = [];
                Object.keys(comment_keyword).map((key) => keyword.push(comment_keyword[key]));
                GM_setValue('Keyword', keyword);
            };
            new_tag.children[0].onclick = deleteTag;
            new_tag.children[1].ondblclick = () => {
                input_reg.value = reg_text;
                deleteTag();
            };
        }
    }
    function addBlackList(userInfo) {
        let new_blockUser = insertTag(blockBar, userInfo);
        let blackList_index = Object.keys(gm_blackList).length;
        gm_blackList[blackList_index] = userInfo;
        userInfo.userID !== '' && blackList.add(userInfo.userID);
        userInfo.userName !== '' && blackList.add(userInfo.userName);
        GM_setValue('BlackList', gm_blackList);
        let deleteTag = () => {
            blockBar.removeChild(new_blockUser);
            blackList.has(userInfo.userID) && blackList.delete(userInfo.userID);
            blackList.has(userInfo.userName) && blackList.delete(userInfo.userName);
            delete gm_blackList[blackList_index];
            gm_blackList = {};
            Object.values({ ...gm_blackList }).forEach((value, i) => { gm_blackList[i] = value; });
            GM_setValue('BlackList', gm_blackList);
        };
        new_blockUser.children[0].onclick = deleteTag;
        new_blockUser.children[1].ondblclick = () => {
            input_userName.value = userInfo.userName;
            input_userID.value = userInfo.userID;
            deleteTag();
        };
    }
    function insertTag(parentNode, tagInfo) {
        let title = '';
        let color = '#000';
        let border = 'none';
        let text = tagInfo;
        if (typeof (tagInfo) === 'object') {
            title = `用户名称：${tagInfo.userName}&#10;用户ID：${tagInfo.userID}`;
            text = tagInfo.userName !== '' ? tagInfo.userName : tagInfo.userID;
        }
        let new_tag = elmGetter.create(`<div class="tags" style="color:${color}; width:${measureTextWidth("12px", text) + 8}px; border:${border}">
        <div class="delete-tag">x</div><p class="tag-info" title="${title}">${text}</p></div>`);
        parentNode.appendChild(new_tag);
        return new_tag;
    }
    function measureTextWidth(fontSize, text) {
        let fontFamily = 'PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif';
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = `${fontSize} ${fontFamily}`;
        let result = context.measureText(text);
        return result.width > 18 ? Math.ceil(result.width) : 18;
    }
    function mainPageBlock() {
        if (keyword.length === 0) {
            return;
        }
        elmGetter.each('.bili-video-card.is-rcmd', document, (reply) => {
            let author = reply?.querySelector('.bili-video-card__info--owner');
            let authorName = author.innerText;
            let authorHref = author?.href?.match(/(?<=https:\/\/space.bilibili.com\/)\d+$/);
            let authorID = authorHref ? authorHref[0] : '';
            let title = (reply?.querySelector('.bili-video-card__info--tit')).title;
            for (let reg of keyword) {
                if (RegExp(reg).test(title)) {
                    reply?.parentNode?.removeChild(reply);
                    console.log(`已屏蔽视频 %c${title}  %c关键词：%c${reg}`, 'color: #67d0ff;', 'color: #30aa35;', 'color: #f44336; font-weight: bolder');
                    return;
                }
            }
            if (blackList.has(authorID) || blackList.has(authorName)) {
                reply?.parentNode?.removeChild(reply);
                console.log(`已屏蔽视频 %c${title}  %c作者ID: %c${authorID}`, 'color: #67d0ff;', 'color: #30aa35;', 'color: #f44336; font-weight: bolder');
            }
        });
    }
    function dynamicPageBlock() {
        elmGetter.each('.bili-dyn-list__item', document, (reply) => {
            let content = reply?.querySelector('.bili-rich-text__content')?.innerText || '';
            let title = reply?.querySelector('.bili-dyn-card-video__title.bili-ellipsis')?.innerText || '';
            let desc = reply?.querySelector('.bili-dyn-card-video__desc.bili-ellipsis')?.innerText || '';
            let all_content = content + title + desc;
            for (let reg of keyword) {
                if (RegExp(reg).test(all_content)) {
                    reply?.parentNode?.removeChild(reply);
                    console.log(`已屏蔽动态 %c${content}  %c关键词：%c${reg}`, 'color: #67d0ff;', 'color: #30aa35;', 'color: #f44336; font-weight: bolder');
                    return;
                }
            }
        });
    }
    function videoPageBlock() {
        elmGetter.each('.content-warp,.sub-reply-item,.list-item.reply-wrap,.reply-item.reply-wrap', document, (reply) => {
            let comment = reply?.querySelector('span.reply-content,p.text,span.text-con')?.innerText || '';
            for (let reg of keyword) {
                if (RegExp(reg).test(comment)) {
                    removeUserComment(reply);
                    console.log(`已屏蔽评论 %c${comment}  %c关键词：%c${reg}`, 'color: #67d0ff;', 'color: #30aa35;', 'color: #f44336; font-weight: bolder');
                    return;
                }
            }
            let { userID, userName } = getUserInfo(reply);
            if (blackList.has(userID) || blackList.has(userName)) {
                removeUserComment(reply);
                console.log(`已屏蔽评论 %c${comment}  %c用户ID: %c${userID}`, 'color: #67d0ff;', 'color: #30aa35;', 'color: #f44336; font-weight: bolder');
                return;
            }
            if (BLOCK) {
                let blockBtn = elmGetter.create('<span class="block-btn btn-hover">屏蔽</span>');
                let replyInfo = reply?.querySelector('.reply-info,.sub-reply-info,.info');
                blockBtn.onclick = () => {
                    addBlackList({ "userID": userID, "userName": userName });
                    console.log(`已屏蔽用户： %c${userName}  %cID： %c${userID}`, 'color: #f44336; font-weight: bolder', 'color:#000;', 'color: #f44336; font-weight: bolder');
                    replyInfo.removeChild(blockBtn);
                    removeUserComment(reply);
                };
                replyInfo.insertBefore(blockBtn, replyInfo.childNodes[replyInfo.childNodes.length - 1]);
            }
        });
    }
    function removeUserComment(reply) {
        if (reply.getAttribute('class') === 'content-warp') {
            reply.parentNode?.parentNode?.parentNode?.removeChild(reply.parentNode?.parentNode);
        } else {
            reply.parentNode?.removeChild(reply);
        }
    }
    function getUserInfo(user) {
        let userID = '';
        let userName = '';
        if (isNew) {
            userID = user?.querySelector('.user-name,.sub-user-name')?.dataset?.userId || user?.querySelector('.name')?.dataset?.usercardMid;
            userName = user?.querySelector('.user-name,.sub-user-name').innerText || '';
        } else {
            userID = user?.querySelector('.name')?.dataset?.usercardMid || user.children[0].href.replace(/[^\d]/g, "");
            userName = user?.querySelector('.name').innerText || '';
        }
        return { userID: userID, userName: userName };
    }
    const comment_keyword = {};
    let keyword = [];
    let blackList = new Set();
    let gm_blackList = {};
    let BLOCK = false;
    BLOCK = GM_getValue('BlockUser', false);
    block_user.checked = BLOCK;
    GM_getValue('Keyword', []).map((key) => addKeyWord(key));
    Object.values(GM_getValue('BlackList', {})).map((i) => addBlackList(i));
    const webType = [/^https:\/\/www.bilibili.com[\/]$/, /https:\/\/(t|space).bilibili.com/, /https:\/\/www.bilibili.com\/video/];
    let local_href = location.href;
    console.log('%c自定义屏蔽脚本已加载', 'color: #43bb88; font-size: 12px; font-weight: bolder');
    console.log(`web url: ${local_href}`);
    if (webType[0].test(local_href)) {
        console.log('当前页面：主页面');
        mainPageBlock();
    } else if (webType[1].test(local_href)) {
        console.log('当前页面：动态页面');
        dynamicPageBlock();
        videoPageBlock();
    } else if (webType[2].test(local_href)) {
        console.log('当前页面：视频页面');
        videoPageBlock();
    } else {
        console.log('当前页面：番剧、电影界面');
        videoPageBlock();
    }
})();
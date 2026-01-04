// ==UserScript==
// @name         爱上ASMR - Plus
// @namespace    https://www.asasmr.top/
// @version      6.1
// @description  视频评论黑名单屏蔽词、收藏夹备注、音视频下载、评论区时间跳转、显示评分投票、标题封面完整显示、禁用动态头像、
// @author       真是一坨大的根本看不懂<( _ _ )>
// @include      /https?\:\/\/.*\.asasmr\d\.com\/.*/
// @match        http*://*.asasmr0.com/*
// @match        http*://*.aisasmr.com/*
// @icon         https://asmrscj.com/assets/images/logos/as111.png
// @run-at       document-body
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472465/%E7%88%B1%E4%B8%8AASMR%20-%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/472465/%E7%88%B1%E4%B8%8AASMR%20-%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

  // jquery
    const jqUrl = "https://code.jquery.com/jquery-3.7.1.min.js"
    function loadScript(url){
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.body.appendChild(script);
    }
    //loadScript(jqUrl)
  // 初始化
    let notes = GM_getValue('notes', {});
    let hmdList = GM_getValue('hmdList', []);
    let regexList = GM_getValue('regexList', [
        '(?<![^\\s])第[一二三四五六七八九十](?![^\\s])'
    ]);
    // 储存屏蔽词列表
    function sethmdList(list) {
        GM_setValue('hmdList', list);
    }
    // 储存屏蔽词列表
    function setRegexList(list) {
        GM_setValue('regexList', list);
    }
    // 储存备注
    function setNotes(id, value) {
        notes[id] = value.split('\n');
        GM_setValue('notes', notes);
    }
    // 渲染备注
    function getNotes(id) {
        if (!notes[id]) {
            notes[id] = [];
        }
        return notes[id].join('\n');
    }
    GM_addStyle(`
  /* 用户菜单 */
  .user-dashboard-dropdown,.user-dashboard-dropdown.show {transition: all 0.2s ease-out;box-shadow: -2px 4px 12px 0 rgb(0 0 0 / 20%);;}
  .user-dashboard-dropdown ul {display: flex;flex-direction: column;align-items: center;justify-content: space-between;}
  .user-dashboard-dropdown ul li:first-child {height: 60px;}
  .user-dashboard-dropdown ul li:last-child {box-shadow: none;}
  .user-dashboard-dropdown ul li {
  width: 100%;height: 50px;display: flex;align-items: center;justify-content: center;position: relative;align-self: stretch;}
  .user-dashboard-dropdown a.top-my-home {background: 0;}
  .user-dashboard-dropdown a {border: 0 !important;align-items: center;display: flex;justify-content: center;}
  .user-dashboard-dropdown a i.asmr {position: absolute;left: 20px;}
  .user-dashboard-dropdown p span.top-user-link-des {display: none !important;}
  .iconk-tongzhi:before {zoom: 1.3;}
  .iconk-tongzhi {left: 15px !important;}
  /* 分割线 */
  .separator {height: 1px;align-self: stretch;margin: 5px 15px;background: rgba(0, 0, 0, 0.1);}
  /* 左侧栏 */
  .cban {text-align: center;position: fixed;top: 45%;left: 0;transform: translateY(-95%);font-family: asmr;z-index: 99999;}
  .cban i:before {
    content: "\u{e678}";
    cursor: pointer;
    display: flex;
    width: 40px;
    height: 40px;
    background-color: #66666666;
    box-shadow: 0px 0px 12px 0px #66666699;
    position: absolute;
    border-radius: 6px;
    transition: all 0.2s;
    flex-direction: column;
    justify-content: center;
    transform: translateX(-65%);
  }
  .cban i {position: fixed;top: 45%;z-index: 1002;}
  .cban i:hover::before {transform: translateX(0%);transition: transform 0.3s ease-out, opacity 0.3s ease-out;}
  .mobile-nav.active {box-shadow: 2px 0px 12px 0px rgb(0 0 0 / 30%);}
  .mobile-nav .genres {display: none;}
  /* 备注 */
  .hmd-save-notes-button {float: right;margin-top: 20px;}
  .hmd-notes-area {width: 100%;padding: 8px;max-width: 75%;height: 60px;border: 1px solid rgb(204, 204, 204);font-size: 14px;color: rgb(51, 51, 51);}
  .archive-excerpt > p {height: 48px;}
    /* 黑名单 */
  .hmd-add-to-blacklist {font-size: 11px !important;padding: 5px !important;border-radius: 4px !important;float: right !important;
    margin-left: 5px !important;
    color: #eeeeeeee !important;
  }
  /* 屏蔽词 */
  #regex-input:focus {box-shadow: 0 0 0 1px #00a0d8, 0 0 0 3px #00a0d833;}
  #regex-input {padding: 4px 6px;margin: 0 0 10px 0;border-radius: 4px;outline: none !important;color: black;
    border: 1px solid rgba(136, 136, 136, 0.2666666667);
  }
  .pbcan {border: 1px solid #00000022;padding: 4px 10px;border-radius: 3px;font-size: 12px;margin: 0 5px 0;}
  /* 自定sidemenu列表 */
  #hmd-list > li,
  #regex-list > li {
    background-color: #eee;
    margin: 0 0 5px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 4px;
    font-size: 12px;
    border: 1px solid rgba(136, 136, 136, 0.2666666667);
  }
  #hmd-list > li > span,
  #regex-list > li > span {padding: 0 6px;color: #000;text-overflow: ellipsis;white-space: nowrap;
    overflow: hidden;
    width: 150px;
  }
  #hmd-list > li > span {color: #0693e3;text-decoration: underline;cursor: pointer;}
  /* 顶栏 */
  .responsive .form-control:focus {border-color: #66afe9;box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgba(102,175,233,.6);}
  .responsive .form-control {border-radius: 20px 0 0 20px;border-right: 0 !important;border: 1px solid #ccc;padding: 6px 12px;width: 40vw;}
  .responsive > #advc-menu > form > button {
  border-radius: 0 20px 20px 0;
  border: 1px solid #ccc;
  border-left: 1px solid #ddd;
  padding: 8px 12px 8px 8px;
  background-color: #fff;
  }
  .responsive .search a.search-resp:before {content: "\ue633"  !important;font-family: 'asmr' !important;}
  .responsive .search {padding: 14px 13px 11px 13px;}
  #form-search-resp {display:none !important;}
  .responsive .logo {display:none !important;}
  /* 底栏 */
  .touchy-search-button.touchy-toggle-search {display: none !important;}
  .touchy-by-bonfire-wrapper.mobile-show.touchy-menu-active {display: none !important;}
  /* 音视频下载 */
  .button-container {
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	gap: 10px;
	padding: 20px;
	margin: auto;
	width: fit-content;
  }
  .button-container > button{
    padding: 4px 6px;
    border-radius: 4px;
    /*
    padding:10px 20px;
	border:2px solid transparent;
	border-radius:20px;
	background:#f8f9fa;
	color:#343a40;
	font-size:16px;
	font-family:'Arial',sans-serif;cursor:pointer;
	transition:background-color .3s,transform .3s;
	box-shadow:0 2px 4px rgba(0,0,0,.1)
    */
  }
  .button:hover{background:#e9ecef;transform:translateY(-2px);box-shadow:0 4px 8px rgba(0,0,0,.2)}
  .button:active{background:#dee2e6;transform:translateY(0);box-shadow:0 2px 4px rgba(0,0,0,.1)}
  #copy-video-link{border-color:#dc3545;color:#dc3545}
  #copy-video-linkb{border-color:#6c757d;color:#6c757d}
  #copy-audio-link{border-color:#17a2b8;color:#17a2b8}
  #download-video-with-1dm{border-color:#ffc107;color:#ffc107}
  #download-video-with-1dmb{border-color:#e83e8c;color:#e83e8c}
  #download-audio-with-1dm{border-color:#28a745;color:#28a745}
  #copy-video-link:hover{color:#dc3545}
  #copy-video-linkb:hover{color:#6c757d}
  #copy-audio-link:hover{color:#17a2b8}
  #download-video-with-1dmb:hover{color:#e83e8c}
  #download-video-with-1dm:hover{color:#ffc107}
  #download-audio-with-1dm:hover{color:#28a745}
  .button:hover,
  #copy-video-link:hover,
  #copy-video-linkb:hover,
  #copy-audio-link:hover,
  #download-video-with-1dm:hover,
  #download-video-with-1dmb:hover,
  #download-audio-with-1dm:hover {
	background:#fff
  }
  /* 音视频页面 */
  /* 简介区 */
  /* 评论区 */
  #wpcomm .wc-comment-footer .wc-footer-left {float: left !important;}
  #wpcomm .wc-comment-footer .wc-footer-right {float: right !important;}
  .daoyan.blcss,#breadcrumbs {display: none !important;}
  #section > li:nth-child(2) {display: none !important;}
  #single > div.content > div.sheader > div.data > div.sgeneros {display: none !important;}
  #aplload {background: #666;border: solid 2px #444;border-radius: 22px;color: #fff;padding: 2px 22px;font-weight: bold;}
  #aplload:hover {background: #888888;}
  .testBtn-a {background: #666;}
  .timeauto {padding: 20px 10px;margin-bottom: 10px;}
  .starstruck-wrap {display: block;}
  #single > .content > .sheader > .data {margin: 0;width: auto;}
  #single > .content > .sheader > .poster {width: auto;padding-bottom: 8px;background: 0;}
  #single > .content > .sheader > .poster > img {max-width: 100%;width: auto;}
  #single > .content > .sheader {display: flex;flex-direction: column;}
  #info > .wp-content > a {padding-right: 8px;}
  /* 等级颜色 */
  .level-0,.level-1 {background: #C0C0C0;}
  .level-2 {background: #8BD29B;}
  .level-3 {background: #7BCDEF;}
  .level-4 {background: #FEBB8B;}
  .level-5 {background: #EE672A;}
  .level-6 {background: #F04C49;}
  .level-7 {background: #821CF9;}
  .level-8 {background: #dddddd;color: #000;}
  .level-admin {background: #FF1111;}
  .level {opacity: .8 !important;}
  /* 深色模式 */
  .dark .single_menu.sidblock {background: #232627;}
  .dark .sidemenu h1 a {color:#fff;}
  .dark .sidemenu .td-link-element-after .td-element-after,.dark .sidemenu .td-link-element-after {color:#fff !important;}
  .dark .hmd-blacklist {background: #222;}
  .dark .hmdclosebutton {background: #111;}
  .dark .hmd-notes-area {color: #bbb;background: #333;}
  body.dark::before {content: "";position: fixed;inset: 0;;background-color: rgba(0, 0, 0, 0.3);z-index: 9999;pointer-events: none;}
  .dark p#breadcrumbsmove {background: #292b2c;color: #bbb;display: block !important;border-bottom: 1px solid #666;}
  .dark p#breadcrumbsmove a {color: #888;}
  .dark .hmd-popup-content {background: #292b2c;color: #bbb;}
  .dark .cban i:before {background-color: #333;border: solid 1px #3f3f3f;}
  .dark .responsive > #advc-menu > form > button {background-color: #232627;border-color: #666;color: #aaa;}
  .dark .responsive .form-control {border-color: #666;color: #ccc !important;}
  .dark input::placeholder {color: #ccc !important;}
  /* 其他 */
  input::-webkit-outer-spin-button,input::-webkit-inner-spin-button {-webkit-appearance: none !important;margin: 0;}
  input[type="number"] {-moz-appearance: textfield;}
  /* 媒体卡片 */
  .iconk-play:before {content: "";}
  .iconk-yinpin3:before {content: "";}
  .poster:hover i.iconk-play:before {content: "\ue604";}
  .poster:hover i.iconk-yinpin3:before {content: "\ue60c";}
  .poster a.thumb-link:hover {background-color: #00000022;}
  body .module .content .items .item .poster .rating,body .fittobox .item .poster .rating {
    background: linear-gradient(180deg,transparent,rgba(0,0,0,.5) 99.32%) !important;
    height: 40px!important;position: absolute!important;padding-top: 18px!important;inset: auto 0 0 0!important;
  }
  body .item-in .rating span {color: #fff!important;}
  .vidtime {bottom: 5px;top: auto;background: 0 !important;}
  .quality {inset: 0 0 auto auto !important;border-radius: 0 0 0 5px !important;}
  .yz-project-text {display: flex;flex-direction: column;align-items: center;}
`)
    // 简介
    function 简介() {
        // 简介封面
        const $dateSpan = $('#single > .content > .sheader > .data > .extra > .date');
        $dateSpan.after('<br><br>');
        // 完整封面
        const ogImageMeta = $('meta[property="og:image"]').attr('content') || '';
        const $dplayerVideo = $('#single > .content > .sheader > .poster > img');
        if ($dplayerVideo.length && ogImageMeta) {
            $dplayerVideo.attr('src', ogImageMeta);
        }
      // youtube超链接
        const paragraphs = document.querySelectorAll('.wp-content p');
        paragraphs.forEach((p) => {
            if (p.textContent.includes('油管：')) {
                // 匹配"油管："后面的所有视频ID
                const regex = /油管：([\w-]+(?:\s+[\w-]+)*)/g;
                const newContent = p.textContent.replace(regex, (match, videoIds) => {
                    const ids = videoIds.split(/\s+/).filter(id => id.trim() !== '');
                    const replacements = ids.map(videoId => `油管：
                    <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">${videoId}</a>`);
                    return replacements.join(' ').trim();
                });
                p.innerHTML = newContent;
            }
        });

    }
  // 视频功能
    // 评论区时间跳转
    function 时间跳转() {
        const paragraphs = document.querySelectorAll('.wc-comment-right > .wc-comment-text > p');
        paragraphs.forEach((p) => {
            const regex = /([0-9]|[1-9][0-9])[：:;；.。分]([0-5][0-9])/g;

            p.innerHTML = p.innerHTML.replace(regex, (match) => {
                const [hours, minutes] = match.split(/[：:;；.。分]/);
                const totalSeconds = parseInt(hours) * 60 + parseInt(minutes);
                return `<a href="javascript:dp.seek(${totalSeconds});">${match}</a>`;
            });
        });
        // 将视图定位到 播放器
        const linkElements = document.querySelectorAll('.wc-comment-right > .wc-comment-text > p > a');
        linkElements.forEach((linkElement) => {
            linkElement.addEventListener('click', () => {
                const dplayerElement = document.querySelector('#dplayer');

                window.scrollTo({
                    top: dplayerElement.offsetTop,
                    behavior: 'smooth' // 可以选择平滑滚动效果
                });
            });
        });
    }
    function 替换动态头像() {
        const images = document.querySelectorAll('#wcThreadWrapper img');
            images.forEach(image => {
                if (image.src.includes('.gif')) {
                    const fileName = image.src.split('/').pop();
                    const letters = 'abcdefghijklmnopqrstuvwxyz';
                    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
                    const newSrc = window.location.origin + `/wp-content/plugins/wp-first-letter-avatar/images/default/96/latin_${randomLetter}.png`;
                    image.src = newSrc;
                }
            });
    }
    // 创建列表
    function createRegexListItem(item, index) {
        const listItem = document.createElement('li');
        const span = document.createElement('span');
        const button = document.createElement('button');
        let removeFunction;
        if (typeof item === 'object' && item !== null) {
            span.textContent = item.name;
            span.addEventListener('click', function () {
                var url = `/author/${item.id}`;
                window.open(url, '_blank');
            });
            removeFunction = removehmd;
        } else {
            span.textContent = item;
            span.title = item;
            removeFunction = removeRegex;
        }
        button.className = 'pbcan';
        button.textContent = '删除';
        button.addEventListener('click', function () {
            listItem.style.display = 'none';
            removeFunction(index);
        });
        listItem.appendChild(span);
        listItem.appendChild(button);
        return listItem;
    }
    function getDirectTextContent(element) {
        return Array.from(element.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.nodeValue.trim())
            .join('');
    }
  // 评论区
// 黑名单
    function 加入黑名单按钮() {
        const commentHeaders = document.querySelectorAll('.wc-comment-header');
        commentHeaders.forEach((header) => {
            const addToBlacklistButton = header.querySelector('.hmd-add-to-blacklist');
            if (addToBlacklistButton) return;
            const commentLink = header.querySelector('.wc-comment-link');
            const authorLink = header.querySelector('.wc-comment-author > a');
            const button = document.createElement('button');
            button.textContent = '黑';
            button.classList.add('hmd-add-to-blacklist');
            commentLink.appendChild(button);
            button.addEventListener('click', () => {
                const authorName = getDirectTextContent(authorLink);
                const authorIdMatch = authorLink.href.match(/\/author\/(\d+)/);
                const authorId = authorIdMatch ? authorIdMatch[1] : null;
                if (authorId) {
                    Swal.fire({
                        title: '确定要添加吗?',
                        html: `Name：${authorName}<br>ID：${authorId}`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: '确定',
                        cancelButtonText: '取消'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            header.parentElement.parentElement.style.display = 'none';
                            const hmdStr = {name: authorName, id: authorId}
                            hmdList.push(hmdStr);
                            const regexListElement = document.getElementById('hmd-list');
                            const lastIndex = regexList.length - 1;
                            const listItem = createRegexListItem(hmdStr, lastIndex);
                            regexListElement.appendChild(listItem);
                            GM_setValue('hmdList', hmdList);
/*                             Swal.fire({
                                title: '成功添加 ' + authorName + ' 加入黑名单',
                                text: '1秒后自动关闭',
                                timer: 1500,
                                timerProgressBar: true,
                            }) */
                        }
                    });
                }
            });
        });
    }
    // 删除指定的黑名单用户
    function removehmd(index) {
        hmdList.splice(index, 1);
        sethmdList([...hmdList]);
    }
    function 屏蔽黑名单用户的评论() {
        const comments = document.querySelectorAll('.wc-comment .wc-comment-author > a');
        comments.forEach(authorLink => {
            const authorid = authorLink.href.match(/\/author\/(\d+)/)[1];
            const hmdListItem = hmdList.find(item => item.id === authorid);
            if (hmdListItem) {
                authorLink.closest('.wc-comment').style.display = 'none';
            }
        });
    }
// 屏蔽词
    // 添加新的屏蔽词到列表
    function addRegex(regexStr) {
        try {
            new RegExp(regexStr);
            if (!regexList.includes(regexStr)) {
                regexList.push(regexStr);
                setRegexList([...regexList]);
                const regexListElement = document.getElementById('regex-list');
                const lastIndex = regexList.length - 1;
                const listItem = createRegexListItem(regexStr, lastIndex);
                regexListElement.appendChild(listItem);
            }
        } catch (error) {
            console.error("Invalid regular expression: ", regexStr);
            Swal.fire({
                title: "请输入有效的正则表达式",
                timer: 10000,
                timerProgressBar: true,
            })
        }
    }
    // 删除指定的屏蔽词
    function removeRegex(index) {
        regexList.splice(index, 1);
        setRegexList([...regexList]);
    }
    // 检查文本是否应该被屏蔽
    function isBlocked(text) {
        return regexList.some(regexStr => {
            try {
                const pattern = new RegExp(regexStr.replace(/^\/|\/g?i?m?$/, ''), 'gi');
                return pattern.test(text);
            } catch (error) {
                console.error(`Invalid regular expression: ${regexStr}`, error);
                return false;
            }
        });
    }
    function 屏蔽词屏蔽评论() {
        const commentTexts = document.querySelectorAll('.wc-comment-text > p');
        commentTexts.forEach(commentText => {
            //console.log(commentText.textContent); // 输出每个评论的文本内容
            const parentElement = commentText.parentElement.parentElement.parentElement;
            if (isBlocked(commentText.textContent)) {
                // 输出被屏蔽的评论内容
                console.log('%cBlocking:', 'color: #f33;', commentText.textContent);
                parentElement.style.display = 'none';
            }
        });
    }
// 加载更多评论后执行相关函数
    function 加载更多评论相关函数() {
        const threadWrapper = document.getElementById('wcThreadWrapper');
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    替换动态头像();
                    时间跳转();
                    加入黑名单按钮();
                    屏蔽黑名单用户的评论();
                    屏蔽词屏蔽评论();
                }
            });
        });
        if (threadWrapper instanceof Node) {
            observer.observe(threadWrapper, { childList: true });
            console.log('%c可以执行评论相关函数', 'color: white; background-color: #4CAF50; padding: 10px; font-size: 16px;');
        } else {
            console.log('%c评论相关函数不可执行', 'color: white; background-color: #f33; padding: 10px; font-size: 16px;');
        }
    }
    function 签到(element) {
        // 签到页面
        const apiUrl = window.location.origin + '/mission'

        document.querySelectorAll('.asmr.iconk-qiandao').forEach(function(element) {
            element.parentElement.addEventListener('click', function(event) {
                event.preventDefault();
            });
        });
        document.querySelector(element).addEventListener('click', () => {
            const currentDate = new Date().toISOString().slice(0, 10);
            let lastSignInDate = localStorage.getItem('lastSignInDate') || '1970-01-01';
            if (currentDate === lastSignInDate) {
                Swal.fire({
                    title: '今日已签到',
                    text: '是否前往签到页面？',
                    showCancelButton: true,
                    confirmButtonText: '是',
                    cancelButtonText: '否'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.open(apiUrl, '_blank');
                    }
                });
            } else {
                Swal.fire({
                    title: '是否签到？',
                    showCancelButton: true,
                    confirmButtonText: '是',
                    cancelButtonText: '否'
                }).then((result) => {
                    if (result.isConfirmed) {
                        请求签到(apiUrl);
                        localStorage.setItem('lastSignInDate', currentDate);
                    }
                });
            }
        });
    }
    async function 请求签到(apiUrl) {
        try {
            const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('未能从服务器获取数据');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const elements = doc.querySelector('#dt_reset_api-js-extra');
        if (!elements) throw new Error('未能找到目标元素');
            const wpnonceMatch = elements.textContent.match(/"wp_rest":"([a-zA-Z0-9]+)"/);
            const wpnonce = wpnonceMatch ? wpnonceMatch[1] : null;
            if (!wpnonce) throw new Error('未能获取_wpnonce');
            const missionResponse = await fetch(`/wp-json/as/v1/userMission?_wpnonce=${wpnonce}`, {
                headers: {
                    accept: "application/json, text/javascript, */*; q=0.01",
            },
                referrer: apiUrl,
                method: "POST",
            });
            if (!missionResponse.ok) throw new Error('签到请求失败');
            const data = await missionResponse.json();
            console.log(data);
            Swal.fire({
                title: '签到成功',
                icon: 'success'
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: '签到失败',
                text: error.message,
                icon: 'error'
            });
        }
    }
    // 设置移动设备侧栏开关状态
    function toggleActiveClass() {
        // 移动设备侧栏开关
        var mobileNav = document.querySelector('.mobile-nav');
        var mobileoverlay = document.querySelector('.mobile-overlay');
        mobileNav.classList.toggle('active');
        mobileoverlay.classList.toggle('active');
    }
    function mobileMain() {
        GM_addStyle(`
        #regex-list > li > span {white-space: normal !important;}
        `)
      // 用户菜单
        $('.responsive .iconk-bianji').eq(1).removeClass('iconk-bianji').addClass('iconk-dingyue');
      // 顶栏
        var $qiandaolement = $('.responsive > .search > .search-resp');
        const head = document.querySelector('.top-my-home').href;
        $qiandaolement.attr('href', head + '?tab=SC');
        var $divElement = $('<div>').attr('id', 'advc-menu').addClass('searchs')
        .css({
            'float': 'left',
            'padding': '10px 0px 8px 5px'
        });
        // 搜索框
        var $formElement = $('<form>', {id: 'searchform',action: window.location.origin,method: 'get'}).css('display', 'flex');
        var $inputElement = $('<input>', {type: 'text',class: 'form-control',placeholder: '搜索...',name: 's',id: 's'}).val('');
        // 搜索按钮
        var $buttonElement = $('<button>').attr('type', 'submit');
        var $spanElement = $('<span>').addClass('olam').text('\uE73B').css('font-family', "'olam' !important");
        $buttonElement.append($spanElement);
        $formElement.append($inputElement);
        $formElement.append($buttonElement);
        $divElement.append($formElement);
        $('.responsive').append($divElement);
      // 底栏
        // 底部"首页"
        var $homedibu = $('<a>', {href: window.location.origin,class: 'touchy-home-button'});
        var $homedibuspan = $('<span>', {class: 'touchy-call-text-label-offset'});
        var $homedibuicon = $('<i>', {class: 'fa fa-home'});
        var $homedibub = $('<b>').text('首页');
        $homedibuspan.append($homedibuicon);
        $homedibu.append($homedibuspan);
        $homedibu.append($homedibub);
        $('.touchy-search-button').after($homedibu);
        // 底部"菜单"
        var touchymenu = document.querySelector('.touchy-menu-button.touchy-toggle-menu');
        var newElement = touchymenu.cloneNode(true);
        touchymenu.parentNode.replaceChild(newElement, touchymenu);
        newElement.addEventListener('click', toggleActiveClass);
    }
    function main() {
      // 引入
        // 通知功能
        let sw2css = document.createElement('link');
        sw2css.rel = 'stylesheet';
        sw2css.href = 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/limonte-sweetalert2/10.15.2/sweetalert2.min.css?ver=6.1.7';
        document.head.appendChild(sw2css);
        let sw2js = document.createElement('script');
        sw2js.src = 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/limonte-sweetalert2/10.15.2/sweetalert2.min.js?ver=9.17.0';
        document.head.appendChild(sw2js);
      // 左侧栏
        // 默认打开周热门
        $('#menu-item-22769 > a').attr('href', '/rmen?timeframe=week');
        var $srementargetElement = $('#arch-menu > div > div:nth-child(2) > ul > li:nth-child(4) > a');
        if ($srementargetElement.length) {
            $srementargetElement.attr('href', '/rmen?timeframe=week');
        }
        // 检查是否是电脑
        var $header = $('#header');
        var headerDisplay = $header.css('display')
        if (headerDisplay === 'block') {
            // 悬浮按钮使用移动设备侧栏
            $('<div class="cban"><i></i></div>').prependTo('body')
                .on('click', toggleActiveClass);
            签到('.headitemss .dt_user > div > ul > li:nth-child(4)')
        }else {
            签到('.responsive .dt_user > div > ul > li:nth-child(4)')
            mobileMain();
        }
        const $sidemenu = $('.mobile-nav > .sidemenu:last');
        // 创建添加屏蔽词区
        const $container = $('<div>', { id: 'blocker-controls', class: 'sidemenu' });
        const $label = $('<h2>', { for: 'regex-input', text: '屏蔽词' });
        const $input = $('<input>', { type: 'text', id: 'regex-input', placeholder: '支持正则表达式' });
        const $addButton = $('<button>', { id: 'add-regex', text: '添加', class: 'pbcan' });
        const $regexList = $('<ul>', { id: 'regex-list' });
        $container.append($label, $input, $addButton, $regexList);
        $addButton.on('click', function () {
            const regexStr = $input.val().trim();
            if (regexStr) {
                addRegex(regexStr);
                $input.val('');
            }
        });
        $sidemenu.after($container);
        // 创建屏蔽词列表
        const regexListElement = document.getElementById('regex-list');
        regexList.forEach((regexStr, index) => {
            const listItem = createRegexListItem(regexStr, index);
            regexListElement.appendChild(listItem);
        });
        // 创建黑名单列表
        const $hmdcontainer = $('<div>', { id: 'hmd-controls', class: 'sidemenu' });
        const $hmdlabel = $('<h2>', { text: '黑名单' });
        const $hmdList = $('<ul>', { id: 'hmd-list' });
        $hmdcontainer.append($hmdlabel, $hmdList);
        $sidemenu.after($hmdcontainer);
        const hmdListElement = document.getElementById('hmd-list');
        hmdList.forEach((hmdStr, index) => {
            const listItem = createRegexListItem(hmdStr, index);
            hmdListElement.appendChild(listItem);
        });
      // 用户菜单
        // 分割线
        const firstListItems = document.querySelectorAll('.user-dashboard-dropdown ul li:first-child');
        firstListItems.forEach((firstListItem) => {
            const separator = document.createElement('div');
            separator.classList.add('separator');
            firstListItem.insertAdjacentElement('afterend', separator);
        });
    }
    // 音频链接复制
    function copyAudioLink(url) {
        if (!ap || ap.audio.length === 0) {
            Swal.fire({
                title: '无音频链接',
                text: '当前页面没有找到任何音频链接。',
                icon: 'info',
                confirmButtonText: '好的'
            });
            return;
        }
        if (ap.audio.length === 1) {
            var element = document.getElementById('copy-audio-link');
            navigator.clipboard.writeText(url).then(() => {
                element.textContent = '音频链接已复制';
            }).catch(err => {
                element.textContent = '无法复制音频链接';console.error('复制音频链接失败:', err);
            });
            return;
        }
        else if (ap.audio.length >= 2) {
            let audioLinksMessage = '请选择要复制的链接:\n点击复制\n';
            let urls = ap.audio.map(audio => audio.url).join('\n');
            let urlsHtml = ap.audio.map(audio => {
                let encodedUrl = audio.url;
                let decodedUrl = decodeURIComponent(encodedUrl);
                return `<a href="https:${encodedUrl}">${decodedUrl}</a><br>`;
            }).join('\n');
            audioLinksMessage += urlsHtml;
            Swal.fire({
                title: '当前页面有多个音频',
                html: `<pre style="white-space: pre-wrap; word-wrap: break-word; height: 80vh; overflow-y: scroll;">${audioLinksMessage}</pre>`,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: '复制全部链接',
                cancelButtonText: '取消'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigator.clipboard.writeText(urls).then(() => {
                        Swal.fire('已复制!', '所有音频链接已复制到剪贴板。', 'success');
                    }).catch(err => {
                        Swal.fire('错误', '无法复制链接到剪贴板。', 'error');
                    });
                }
            });
        }
    }
    function 音视频下载() {
        var activityBtn = document.querySelector('.activity-btn');
        if (activityBtn) {
            var title = encodeURIComponent(document.querySelector('.data > h1').textContent || document.title);
            if (window.location.href.includes("video")) {
                var video_urla = line[0];
                var video_urlb = line[1];
                console.log("视频页");
            } else {
                console.log("音频页");
            }
            var audio_url = ap.audio[0]?.url;
            var buttonContainer = document.createElement('div');
            buttonContainer.className = 'button-container';

            [
                {id: 'copy-video-link', text: '点击复制视频链接1'},
                {id: 'copy-video-linkb', text: '点击复制视频链接2'},
                {id: 'download-video-with-1dm', text: '使用1dm+下载视频1'},
                {id: 'download-video-with-1dmb', text: '使用1dm+下载视频2'},
                {id: 'copy-audio-link', text: '点击复制音频链接'},
                {id: 'download-audio-with-1dm', text: '使用1dm+下载音频'}
            ].forEach(function(buttonInfo) {
                var button = document.createElement('button');
                button.id = buttonInfo.id;
                button.textContent = buttonInfo.text;

                button.addEventListener('click', function () {
                    let url, intentUrl;
                    switch (buttonInfo.id) {
                        case 'copy-video-link':
                            url = video_urla;
                            navigator.clipboard.writeText(url).then(() => {this.textContent = '视频链接1已复制';})
                                .catch((err) => {this.textContent = '无法复制视频链接1';console.error('复制视频链接1失败:', err);});
                            break;
                        case 'copy-video-linkb':
                            url = video_urlb;
                            navigator.clipboard.writeText(url).then(() => {this.textContent = '视频链接1已复制';})
                                .catch((err) => {this.textContent = '无法复制视频链接1';console.error('复制视频链接1失败:', err);});
                            break;
                        case 'download-video-with-1dm':
                            if (video_urla) {
                                intentUrl = `intent:${video_urla}#Intent;package=idm.internet.download.manager.plus;scheme=idmdownload;S.title=${title}.mp4;end`;
                                window.open(intentUrl, '_blank');
                            } else {
                                this.textContent = "没有找到视频";
                            }
                            break;
                        case 'download-video-with-1dmb':
                            if (video_urlb) {
                                intentUrl = `intent:${video_urlb}#Intent;package=idm.internet.download.manager.plus;scheme=idmdownload;S.title=${title}.mp4;end`;
                                window.open(intentUrl, '_blank');
                            } else {
                                this.textContent = "没有找到视频";
                            }
                            break;
                        case 'copy-audio-link':
                            url = audio_url;
                            copyAudioLink(url);
                            break;
                        case 'download-audio-with-1dm':
                            if (audio_url) {
                                intentUrl = `intent:${audio_url}#Intent;package=idm.internet.download.manager.plus;scheme=idmdownload;S.title=${title}.mp3;end`;
                                window.open(intentUrl, '_blank');
                            } else {
                                this.textContent = "没有找到音频";
                            }
                            break;
                    }
                });

                buttonContainer.appendChild(button);
            });

            activityBtn.parentNode.insertBefore(buttonContainer, activityBtn);
        }
    }
    function 备注() {
        console.log('收藏页执行一切正常!');
      // 添加备注区域
        const archiveContainers = document.querySelectorAll('#author-page .archive');
        archiveContainers.forEach(container => {
            const articleLink = container.querySelector('article > a');
            const noteid = articleLink.href.match(/\/(video|sound)\/([\w-]+\.html)/)[0];// 提取ID
            const notesArea = document.createElement('textarea');
            notesArea.classList.add('hmd-notes-area');
            notesArea.placeholder = '添加备注';
            notesArea.value = getNotes(noteid) || '';
            const saveNotesButton = document.createElement('button');
            saveNotesButton.textContent = '保存备注';
            saveNotesButton.classList.add('hmd-save-notes-button');
            saveNotesButton.addEventListener('click', () => {
                setNotes(noteid, notesArea.value);
                Swal.fire({
                    title: "备注已保存",
                    timer: 10000,
                    timerProgressBar: true,
                })
            });
            container.appendChild(notesArea);
            container.appendChild(saveNotesButton);
        });
    }
    // 页面加载完毕时执行一次
    window.onload = function() {
        main();
      // 媒体页
        if (window.location.href.match(/https:\/\/.*\/(video|sound)\/(\d+)\.html.*/)) {
            简介();
            替换动态头像();
            时间跳转();
            加载更多评论相关函数();
            音视频下载();
            加入黑名单按钮();
            屏蔽黑名单用户的评论();
            屏蔽词屏蔽评论();
            if (window.location.href.includes("sound")) {
                if (ap.audio.length >= 2) {
                    var yc = document.getElementById('download-audio-with-1dm');
                    yc.style.display = 'none';
                }
                const styleElement = document.createElement('style');
                styleElement.textContent = `
                #copy-video-link,
                #copy-video-linkb,
                #download-video-with-1dm,
                #download-video-with-1dmb {
                    display: none;
                }
                `;
                document.head.appendChild(styleElement);
            }
            setTimeout(function() {
                console.log('%c媒体页执行一切正常!', 'color: white; background-color: #4CAF50; padding: 10px; font-size: 16px;');
            }, 1000);
        }
      // 收藏页
        if (window.location.href.match(/^https:\/\/.*\/author\//) && window.location.href.match(/\?tab=collect.*/)) {
            备注();
        }
      // 空间
        // 查成分
        if (window.location.href.match(/^https:\/\/.*\/author\/.*/)) {
            var elements = document.querySelectorAll('.um-widget');
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                if (element.classList.contains('follow-widget')) {
                    element.classList.remove('follow-widget');
                }
            }
        }
      // 收藏页
        // 播放列表
        if (window.location.href.match(/^https:\/\/.*\/author\//) && window.location.href.match(/\?tab=SC/)) {
            let apcss = document.createElement('link');
            apcss.rel = 'stylesheet';
            apcss.href = '/wp-content/plugins/Hermit-X-master/assets/css/APlayer.min.css?ver=2.8.0';
            document.head.appendChild(apcss);
            let apjs = document.createElement('script');
            apjs.src = '/wp-content/plugins/Hermit-X-master/assets/js/APlayer.min.js?ver=2.8.0';
            document.head.appendChild(apjs);
            GM_addStyle(`
            #cover,
            #ai {display: none !important;}
            #tab-bar li {margin-right: 0 !important;}
            #tab-bar li a {padding: 0 6px;}
            `)
        }

    }
})();
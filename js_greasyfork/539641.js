// ==UserScript==
// @name         斗鱼直播间一键聊天室（新版）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license MIT
// @description  ds整的，不考虑性能，需要等播放器加载完成后使用，不然不能暂停正在播放的视频。
// @author       ds&yeshiqiu
// @match           *://*.douyu.com/0*
// @match           *://*.douyu.com/1*
// @match           *://*.douyu.com/2*
// @match           *://*.douyu.com/3*
// @match           *://*.douyu.com/4*
// @match           *://*.douyu.com/5*
// @match           *://*.douyu.com/6*
// @match           *://*.douyu.com/7*
// @match           *://*.douyu.com/8*
// @match           *://*.douyu.com/9*
// @match           *://*.douyu.com/beta/*
// @match           *://*.douyu.com/topic/*
// @icon         data:image/png;base64,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


// @downloadURL https://update.greasyfork.org/scripts/539641/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E4%B8%80%E9%94%AE%E8%81%8A%E5%A4%A9%E5%AE%A4%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539641/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E9%97%B4%E4%B8%80%E9%94%AE%E8%81%8A%E5%A4%A9%E5%AE%A4%EF%BC%88%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    // 斗鱼聊天模式
    window.onload = function(){
        setTimeout(function() {
            const style=document.createElement('style');
            style.textContent=`.Barrage-userEnter{display:none !important;}.comment-dzjy-container>div{display:flex;}#btn_chatMode{position:fixed;z-index:99999;right:0;top:0;display:flex;align-items:center;align-content:center;font-size:12px;color:#333;margin:3px 10px;padding:0 12px;height:54px;line-height:1;background-color:#fff;border:1px solid #e5e4e4;border-radius:4px;cursor:pointer;}.Header-right{padding-right:40px;}.__chatMode body{overfow:hidden;}.is-fullScreenPage #btn_chatMode{height:24px;}.__chatMode #js-header{z-index:99998 !important;}.ChatRank-rankWraper:hover .ChatTabContainer-conWraper{display:block !important;}.__chatMode .Header{align-items:center;}.__chatMode .DiamondsFansRankContainer-skinbg{background-image:none !important;height:100% !important;}.__chatMode .ChatRank{height:auto !important;}.__chatMode .ChatTabContainer-conWraper,.__chatMode .ChatToolBar-DanmakuTail{display:none !important;}.__chatMode .FansRankAll-close:before,.__chatMode .RankAllMain-close:before{float:right;margin-right:8px;content:'关闭';font-size:14px;white-space:nowrap;color:#000;}.__chatMode .FansRankAll-header,.__chatMode .RankAllMain-header,.__chatMode .RankAllMain-monthHeader{height:0 !important;}.__chatMode{--chatH:140px;}.__chatMode .ChatBarrageCollectPop-barrageContent{display:grid;align-content:stretch;align-items:stretch;padding-bottom:15px;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:10px;padding-bottom:15px;}.__chatMode .ChatBarrageCollect .TagItem{height:auto !important;width:auto !important;max-width:100% !important;margin:0 !important;line-height:20px;}.__chatMode .ChatBarrageCollect .TagItem .TagItem-txt{padding:8px 12px;}.__chatMode .WebViewFrame{z-index:99999 !important;}.__chatMode .ChatRank,.__chatMode .layout-Player-rank{height:auto !important;}.__chatMode #js-barrage-list-parent{width:100%;}.TagItem,.ChatBarrageCollectPop-oper-txt,.ChatSend-txt{font-size:14px !important;line-height:1.5 !important;}.Barrage-listItem{font-size:14px;line-height:1.5 !important;margin:4px 0 !important;}.Barrage-listItem>div{padding:6px 10px !important;}.Barrage-listItem:hover>div{padding:6px 90px 6px 10px !important;}.HighEnergyV2Barrage .HighEnergyV2BarrageHead{margin-right:-80px !important;}.Barrage-listItem:hover{background:#eee;}.barrage-HuiFu-btn,.barrage-ChaDanMu-btn,.barrage-JiaYi-btn{position:absolute;top:50%;margin-top:-10px;width:20px;height:20px;line-height:20px;background:#ff4e4e;text-align:center;color:white;border-radius:4px;font-size:12px;cursor:pointer;}.barrage-HuiFu-btn{right:35px;}.barrage-JiaYi-btn{right:10px;}.barrage-ChaDanMu-btn{right:60px;}.barrage-HuiFu-btn:hover,.barrage-ChaDanMu-btn:hover,.barrage-JiaYi-btn:hover{background:#ff2d2d;}.__chatMode #js-player-main + div{position: fixed !important; width: 100% !important; z-index: 9999 !important; right: 0 !important; bottom: 0 !important; top: 60px !important;}.__chatMode .layout-Player-chat{height:var(--chatH);}.__chatMode .Chat{height:calc(var(--chatH) - 7px);}.__chatMode .ChatSend-scroll{max-height:unset;}.__chatMode .ChatSend-txt{height:calc(var(--chatH) - 100px);max-height:unset;padding:15px;background:#eee;}.__chatMode .ChatSend-button{height:calc(var(--chatH) - 68px);line-height:calc(var(--chatH) - 68px);border-radius:6px;}.__chatMode .FansMedalPanel-container{height:calc(var(--chatH) - 45px);}.__chatMode .ChatBarrageCollectPop-dialog{bottom:28px;}.__chatMode .real-audience{padding-right:120px;}.__chatMode .layout-Player-aside{position:fixed;max-width:100%;width:100%;right:0;top:0;bottom:0;height:auto;z-index:99999;}.__chatMode,.__chatMode body,.__chatMode #root,.__chatMode .layout-Main{width:100%!important;max-width:100vw!important;min-width:100vw!important;overflow:hidden;}.ChatBarrageCollectPop,.__chatMode .DiamondsFansRankList,.__chatMode .OnlineVipList,.__chatMode .ChatRankDayWeekList-listContent,.__chatMode .ChatRankWeek-listContent{width:auto!important;}.__chatMode .OnlineRankAll>*,.__chatMode .ChatRankDayWeekList,.__chatMode .ChatRankDayWeekList-headerContent,.__chatMode .ChatRank-rankWraper{width:100%!important;box-sizing:border-box!important;}`;
            document.head.appendChild(style);
            const body = document.querySelector('body');
            const button = document.createElement('a');
            button.id = 'btn_chatMode';
            button.textContent = '开聊';document.querySelector('.Header-right').appendChild(button);
            button.onclick = function() {
                document.documentElement.classList.toggle('__chatMode');
                if(document.documentElement.classList.contains('__chatMode')){
                    button.textContent = '不聊';
                    //暂停播放
                    document.querySelector('#js-player-controlbar').querySelectorAll('i')[0]?.click();
                    //关闭弹幕
                    document.querySelector('#js-player-controlbar').querySelectorAll('i')[6]?.click();
                    // document.querySelectorAll('[class*="showdanmuWrap-"]')[0].querySelectorAll('i')[0]?.click();
                }else{
                    button.textContent = '开聊';
                    //播放
                    // document.querySelector('#js-player-controlbar').querySelectorAll('i')[0]?.click();
                    //恢复弹幕
                    document.querySelector('#js-player-controlbar').querySelectorAll('i')[7]?.click();
                }
            };
            button.onmouseover = function() {
                document.querySelector('.extool').style.display = 'none';
            };
            body.appendChild(button);
            // 2. 设置按钮功能
            function setupPlusOneButton(item) {
                // 确保每个元素只绑定一次事件
                if (item.dataset.plusOneBound) return;
                item.dataset.plusOneBound = 'true';
                function reply_addOne(e,type){
                    e.stopPropagation();
                    var _text = '';
                    if(type == 'jiayi') {
                        // 获取弹幕文本
                        const barrageText = item.querySelector('.Barrage-content')?.textContent?.trim() || item.textContent.trim();
                        _text = barrageText;
                    }else if(type == 'huifu') {
                        // 获取弹幕文本
                        const barrageNickName = item.querySelector('.Barrage-nickName')?.textContent?.trim() || item.textContent.trim();
                        const barrageText = item.querySelector('.Barrage-content')?.textContent?.trim() || item.textContent.trim();
                        _text = '@'+barrageNickName+'：'+barrageText;
                    }
                    // 找到聊天输入框
                    const chatInput = document.querySelector('.ChatSend-txt');
                    if (chatInput) {
                        chatInput.innerHTML = _text;
                        // 触发输入事件确保响应
                        const event = new Event('input', { bubbles: true });
                        chatInput.dispatchEvent(event);
                        // 聚焦输入框
                        chatInput.focus();
                    }
                    if(type == 'huifu') chatInput.setSelectionRange(0, 0);
                    if(type == 'jiayi') document.querySelector('.ChatSend-button')?.click();
                }
                // 鼠标移入时显示按钮
                item.addEventListener('mouseenter', () => {
                    // 如果按钮已存在则不再添加
                    if (!item.querySelector('.barrage-JiaYi-btn')) {
                        const plusOneBtn = document.createElement('span');
                        plusOneBtn.className = 'barrage-JiaYi-btn';
                        plusOneBtn.textContent = '+';

                        // 点击 "+1" 时复制文本到输入框
                        plusOneBtn.addEventListener('click', (e) => {
                            reply_addOne(e,'jiayi');
                        });

                        item.appendChild(plusOneBtn);
                    }
                    if (!item.querySelector('.barrage-HuiFu-btn')) {
                        const replyBtn = document.createElement('span');
                        replyBtn.className = 'barrage-HuiFu-btn';
                        replyBtn.textContent = '回';

                        // 点击 "+1" 时复制文本到输入框
                        replyBtn.addEventListener('click', (e) => {
                            reply_addOne(e,'huifu');
                        });

                        item.appendChild(replyBtn);
                    }
                    if (!item.querySelector('.barrage-ChaDanMu-btn')) {
                        const ChaDanMuBtn = document.createElement('span');
                        ChaDanMuBtn.className = 'barrage-ChaDanMu-btn';
                        ChaDanMuBtn.textContent = '查';

                        ChaDanMuBtn.addEventListener('click', (e) => {
                            window.open('https://www.doseeing.com/search?type=fan&nickname='+item.querySelector('.Barrage-nickName').textContent.trim(),"_blank");
                        });

                        item.appendChild(ChaDanMuBtn);
                    }
                });

                // 鼠标移出时移除 "+1" 按钮
                item.addEventListener('mouseleave', () => {
                    item.querySelector('.barrage-JiaYi-btn')?.remove();
                    item.querySelector('.barrage-HuiFu-btn')?.remove();
                    item.querySelector('.barrage-ChaDanMu-btn')?.remove();
                });
            }

            // 3. 初始化现有元素
            document.querySelectorAll('.Barrage-listItem').forEach(setupPlusOneButton);

            // 4. 动态监听新增弹幕元素
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        // 检查是否是元素节点且包含目标类名
                        if (node.nodeType === 1) {
                            // 检查节点本身
                            if (node.classList.contains('Barrage-listItem')) {
                                setupPlusOneButton(node);
                            }
                            // 检查子节点
                            const items = node.querySelectorAll('.Barrage-listItem');
                            items.forEach(setupPlusOneButton);
                        }
                    });
                });
            });

            // 5. 开始观察弹幕容器
            const barrageContainer = document.querySelector('.Barrage-list') || document.body;
            observer.observe(barrageContainer, {
                childList: true,
                subtree: true
            });

            // 6. 防抖处理，避免短时间内大量触发
            let debounceTimer;
            function debounce(callback, delay = 100) {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(callback, delay);
            }

            // 7. 添加全局鼠标移动监听，优化性能
            document.addEventListener('mousemove', (e) => {
                debounce(() => {
                    // 检查鼠标是否在弹幕项上
                    const hoveredItem = e.target.closest('.Barrage-listItem');
                    if (hoveredItem && !hoveredItem.querySelector('.barrage-JiaYi-btn')) {
                        // 模拟 mouseenter 事件
                        const event = new MouseEvent('mouseenter', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        hoveredItem.dispatchEvent(event);
                    }

                });
            });

        }, 1000);
    };
})();

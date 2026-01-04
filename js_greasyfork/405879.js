// ==UserScript==
// @name         虎牙重复弹幕过滤
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  虎牙重复弹幕过滤, 过滤视频弹幕, 过滤聊天弹幕, 过滤表情弹幕, 放过自己弹幕
// @author       Mindfulness
// @match        https://www.huya.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/405879/%E8%99%8E%E7%89%99%E9%87%8D%E5%A4%8D%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/405879/%E8%99%8E%E7%89%99%E9%87%8D%E5%A4%8D%E5%BC%B9%E5%B9%95%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const HuyaFilter = {
        selfUserName: '',
        filterCount: 0,
        filterTopList: [],
        recordDanmuList: [],
        _options: {},
        getOptions: function(optionKey, defaultValue)
        {
            if(this._options[optionKey] == undefined)
            {
                this._options[optionKey] = GM_getValue('_huya_filter_' + optionKey, defaultValue);
            }
            return this._options[optionKey];
        },
        setOptions: function(optionKey, optionValue)
        {
            GM_setValue('_huya_filter_' + optionKey, optionValue);
            this._options[optionKey] = optionValue;
        },
        createUI: function()
        {
            let icon = document.createElement('i');
            icon.id = 'J-room-chat-filter';
            icon.className = 'room-chat-tool';
            icon.style = 'display: inline-block;width: 35px;height: 22px;cursor:pointer;text-align:center;margin-top: 1px;border: 1px solid #ff8a00;border-radius: 5px;background-color: #ff8a00;color: #fff;font-weight: bold;user-select:none;';
            icon.innerText = '过滤';

            let toolsPannel = document.querySelector('#tipsOrchat .chat-room__ft .chat-room__ft__pannel .room-chat-tools');
            toolsPannel.appendChild(icon);

            let tipsOrchatRect = document.querySelector('#tipsOrchat').getBoundingClientRect();
            let mainCol = document.querySelector('#main_col');
            let mainColRect = mainCol.getBoundingClientRect();
            let popup = document.createElement('div');
            popup.id = 'J-room-chat-filter-pannel';
            let popTop = tipsOrchatRect.top - mainColRect.top - 300 - 2;
            let popLeft = tipsOrchatRect.left - mainColRect.left;
            popup.style='border:1px solid #333;width:336px;height:300px;background-color:#eee;cursor:default;position:absolute;top:' + popTop + 'px;left:' + popLeft + 'px;z-index:100;display:none;';

            let popupHeader = document.createElement('div');
            popupHeader.style='padding:10px;border-bottom:1px solid #888;';

            let filterCounter = document.createElement('span');
            filterCounter.id = 'J-room-chat-filter-counter';
            filterCounter.style = 'color:#008;';
            filterCounter.innerText = '已过滤: 0';
            popupHeader.appendChild(filterCounter);

            let lastFilterDanmu = document.createElement('span');
            lastFilterDanmu.id = 'J-room-chat-filter-last';
            lastFilterDanmu.style = 'margin-left:10px;padding:0 2px;display:inline-flex;overflow:hidden;max-width:200px;height:18px;color:#aaa;background-color:#ff8;';
            lastFilterDanmu.title = '最后过滤弹幕内容';
            popupHeader.appendChild(lastFilterDanmu);

            let popupClose = document.createElement('a');
            popupClose.innerText = '关闭';
            popupClose.style='cursor:pointer;color:#800;padding-right:10px;position:absolute;right:0;';
            popupClose.addEventListener('click', () => {popup.style.display = 'none'});
            popupHeader.appendChild(popupClose);
            popup.appendChild(popupHeader);

            let popupOptions = document.createElement('div');
            popupOptions.style='padding:10px;border-bottom:1px solid #888;';
            popup.appendChild(popupOptions);

            let popupFilterTopList = document.createElement('div');
            popupFilterTopList.style='padding:10px;';

            let topListElement = document.createElement('ul');
            topListElement.id = 'J-room-chat-filter-topList';
            topListElement.style = 'padding:0;margin:0;';
            popupFilterTopList.appendChild(topListElement);

            let resetElement = document.createElement('a');
            resetElement.innerText = '重置统计';
            resetElement.style = 'cursor:pointer;color:#800;padding-right:10px;position:absolute;right:0;bottom:10px;';
            resetElement.addEventListener('click', function()
            {
                this.filterCount = 0;
                this.filterTopList = [];
                this.recordDanmuList = [];
                this.showFilterCountInfo();
            }.bind(this));
            popupFilterTopList.appendChild(resetElement);

            popup.appendChild(popupFilterTopList);

            mainCol.appendChild(popup);

            icon.addEventListener('click', (e) => {popup.style.display = popup.style.display == 'block' ? 'none' : 'block'});

            this.showCheckboxOptions(popupOptions, 'filter_video_danmu', '过滤视频弹幕');
            this.showCheckboxOptions(popupOptions, 'filter_chat_danmu', '过滤聊天弹幕');
            this.showCheckboxOptions(popupOptions, 'filter_icon_danmu', '过滤表情弹幕');
            this.showCheckboxOptions(popupOptions, 'filter_skip_me', '放过自己发的弹幕');
        },

        showCheckboxOptions: function(contriner, optionKey, optionText)
        {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = this.getOptions(optionKey, 1) == 1;

            checkbox.addEventListener('change', function(e)
            {
                this.setOptions(optionKey, checkbox.checked ? 1 : 0);
                console.log(optionText + ': ' + (checkbox.checked ? '已开启' : '已关闭'));
            }.bind(this));

            let span = document.createElement('span');
            span.innerText = optionText;
            span.style='padding-left:10px;';

            let label = document.createElement('label');
            label.style = 'display: inline-block;width:45%;';
            label.appendChild(checkbox);
            label.appendChild(span);
            contriner.appendChild(label);
        },

        showFilterCountInfo: function()
        {
            document.querySelector('#J-room-chat-filter-counter').innerHTML = '已过滤: ' + this.filterCount;

            let topListElement = document.querySelector('#J-room-chat-filter-topList');
            topListElement.innerHTML = '';

            for(let i = 0; i < 10; i++)
            {
                let itemElement = document.createElement('li');
                let showIndex = i + 1;
                let itemHtml = '<span style="font-weight:bold;">' + showIndex + '.</span>';
                if(i < this.filterTopList.length) itemHtml += ' (' + this.filterTopList[i].count + ') ' + this.filterTopList[i].danmu;
                itemElement.innerHTML = itemHtml;
                itemElement.style = 'padding:0;margin:0;list-style:none;display:block;width:316px;overflow:hidden;height:18px;line-height:18px;';
                topListElement.appendChild(itemElement);
            }
        },

        start: function()
        {
            let videoDanmuDiv = document.querySelector('#danmudiv');
            let chatDanmuDiv = document.querySelector('#chat-room__list');

            if(!videoDanmuDiv || !chatDanmuDiv) return setTimeout(this.start.bind(this), 1000);

            this.selfUserName = document.querySelector('#login-username').innerText;

            let videoDanmuFilterObserver = new MutationObserver((recordList, observer) => {
                if(this.getOptions('filter_video_danmu', 1) != 1) return;

                let hasNewfilterDanmu = false;
                recordList.forEach((record) => {
                    if(record.type !== 'childList') return;
                    for(let i = 0; i < record.addedNodes.length; i++)
                    {
                        let danmuElement = record.addedNodes[i];
                        if(parseFloat(danmuElement.style.borderWidth) > 0 && this.getOptions('filter_skip_me', 1) == 1) continue;

                        let danmuText = danmuElement.innerText.trim();
                        if(danmuText.length == 0)
                        {
                            if(this.getOptions('filter_icon_danmu', 1) != 1) continue;
                            danmuText = '<表情>';
                        }
                        let filterDanmuText = danmuText;

                        let repeatMatches = danmuText.match(/^(.+?)\1+$/);
                        if(repeatMatches) filterDanmuText = repeatMatches[1] + ' ...';
                        if(!this.recordDanmuList[filterDanmuText]) this.recordDanmuList[filterDanmuText] = 0;
                        let repeatCount = ++this.recordDanmuList[filterDanmuText];
                        if(repeatCount == 1) continue;

                        danmuElement.remove();

                        // 统计新增
                        this.filterCount++;
                        hasNewfilterDanmu = true;

                        // 更新最后过滤弹幕文本
                        document.querySelector('#J-room-chat-filter-last').innerHTML = '(' + repeatCount + ') ' + danmuText;

                        // 追加
                        let alreadyExist = false;
                        for(let i = 0; i < this.filterTopList.length; i++)
                        {
                            if(filterDanmuText === this.filterTopList[i].danmu)
                            {
                                this.filterTopList[i].count = repeatCount;
                                alreadyExist = true;
                                break;
                            }
                        }
                        if(!alreadyExist) this.filterTopList.push({danmu: filterDanmuText, count: repeatCount});
                    }
                });

                if(hasNewfilterDanmu)
                {
                    // 从多到少排序
                    this.filterTopList.sort((a, b) => b.count - a.count);

                    // 删除多余
                    while(this.filterTopList.length > 10) this.filterTopList.pop();

                    // 更新统计信息显示
                    this.showFilterCountInfo();
                }
            });

            videoDanmuFilterObserver.observe(videoDanmuDiv, {childList: true});

            let chatDanmuFilterObserver = new MutationObserver((recordList, observer) => {
                if(this.getOptions('filter_chat_danmu', 1) != 1) return;
                recordList.forEach((record) => {
                    if(record.type !== 'childList') return;
                    for(let i = 0; i < record.addedNodes.length; i++)
                    {
                        let danmuElement = record.addedNodes[i];
                        let danmuUserNameElement = danmuElement.querySelector('.name');
                        // 不是用户发言
                        if(!danmuUserNameElement) continue;

                        let danmuUserName = danmuUserNameElement.innerText;
                        if(danmuUserName == this.selfUserName && this.getOptions('filter_skip_me', 1) == 1) continue;

                        let danmuText = danmuElement.querySelector('.msg').innerText.trim();
                        if(danmuText.length == 0)
                        {
                            if(this.getOptions('filter_icon_danmu', 1) != 1) continue;
                            danmuText = '<表情>';
                        }
                        let filterDanmuText = danmuText;

                        let repeatMatches = danmuText.match(/^(.+?)\1+$/);
                        if(repeatMatches) filterDanmuText = repeatMatches[1] + ' ...';

                        if(!this.recordDanmuList[filterDanmuText]) continue;
                        let repeatCount = this.recordDanmuList[filterDanmuText];
                        if(repeatCount <= 1) continue;

                        danmuElement.remove();
                    }
                });
            });

            chatDanmuFilterObserver.observe(chatDanmuDiv, {childList: true});
        }
    };

    HuyaFilter.start();
    HuyaFilter.createUI();
})();

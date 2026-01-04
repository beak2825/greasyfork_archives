// ==UserScript==
// @version     1.7.2
// ==/UserScript==




(function () {
    const blobURL = URL.createObjectURL(
        new Blob(
            [
                '(',
                function () {
                    const ids = {};
                    // 监听message 开始执行定时器或者销毁
                    self.onmessage = (e) => {
                        switch (e.data.command) {
                            case 'interval:start': // 开启定时器
                                const intervalId = setInterval(() => postMessage({ message: 'interval:tick', id: e.data.id }), e.data.interval);
                                // postMessage({ message: 'interval:started', id: e.data.id });
                                ids[e.data.id] = intervalId;
                                break;
                            case 'interval:clear': // 销毁
                                clearInterval(ids[e.data.id]);
                                postMessage({ message: 'interval:cleared', id: e.data.id });
                                delete ids[e.data.id];
                                break;
                            case 'timeout:start':
                                const timeoutId = setTimeout(() => postMessage({ message: 'timeout:tick', id: e.data.id }), e.data.timeout);
                                // postMessage({ message: 'timeout:started', id: e.data.id });
                                ids[e.data.id] = timeoutId;
                                break;
                            case 'timeout:clear':
                                clearTimeout(ids[e.data.id]);
                                postMessage({ message: 'timeout:cleared', id: e.data.id });
                                delete ids[e.data.id];
                                break;
                        }
                    };
                }.toString(),
                ')()',
            ],
            { type: 'application/javascript' },
        ),
    );
    const worker = new Worker(blobURL);
    URL.revokeObjectURL(blobURL); //用完释放URL对象
    const workerTimer = {
        id: 0,
        callbacks: {},
        setInterval: (cb, interval, context) => {
            const id = ++workerTimer.id;
            workerTimer.callbacks[id] = { fn: cb, context: context };
            worker.postMessage({ command: 'interval:start', interval: interval, id: id });
            return id;
        },
        setTimeout: (cb, timeout, context) => {
            const id = ++workerTimer.id;
            workerTimer.callbacks[id] = { fn: cb, context: context };
            worker.postMessage({ command: 'timeout:start', timeout: timeout, id: id });
            return id;
        },

        // 监听worker 里面的定时器发送的message 然后执行回调函数
        onMessage: (e) => {
            switch (e.data.message) {
                case 'interval:tick':
                case 'timeout:tick':
                    const callbackItem = workerTimer.callbacks[e.data.id];
                    if (callbackItem && callbackItem.fn) {
                        callbackItem.fn.apply(callbackItem.context);
                    }

                    break;
                case 'interval:cleared':
                case 'timeout:cleared':
                    delete workerTimer.callbacks[e.data.id];
                    break;
            }
        },

        // 往worker里面发送销毁指令
        clearInterval: (id) => worker.postMessage({ command: 'interval:clear', id: id }),
        clearTimeout: (id) => worker.postMessage({ command: 'timeout:clear', id: id }),
    };
    worker.onmessage = workerTimer.onMessage.bind(workerTimer);

    let source = {
        version: 6,
        usePublic: false,
        signInText: '打卡',
        sendMsgRandom: true,
        sendMsgInterval: 600,
        data1: { available: true, values: ['[惊喜]', '[流汗]'] },
        data2: { available: true, values: [] },
        data3: { available: true, values: [] },
        data4: { available: true, values: ['[爱]'] },
        data5: { available: true, values: [] },
        like: { likeRandom: false, likeInterval: false, clickLikeInterval: 6},
        lottery: { lottery: false, hesitationInterval: false, hesitationIntervalExpiry: 100, hesitationRandom: false, hesitationRandomExpiry: 100 }
    },
        baseInfo = {}, config = {}, waiters = [], data = [],
        signInCheckbox, hideLoginGuideCheckbox, hideHarunaCheckbox, hideShopCheckbox, noSleepCheckbox, hideGiftControlCheckbox, 
        hideRoomFeedCheckbox, hideRoomInfoCheckbox, hideNoticeCheckbox, hideFooterCheckbox, lotteryCheckbox, closeLotteryCheckbox,
        hesitationRandomCheckbox, hesitationIntervalCheckbox, hidePrivacyCheckbox, hideRoomStatusCheckbox, setPublicCheckbox, 
        hideBusinessCheckbox, hideRankListCheckbox, showLiveAreaCheckbox,
        group1Checkbox, group2Checkbox, group3Checkbox, group4Checkbox, group5Checkbox,
        rdCheckbox, usePublicCheckbox, autoLikeCheckbox, clickLikeRandomCheckbox, clickLikeIntervalCheckbox,
        dmInput, divSetting, dataText1, dataText2, dataText3, dataText4, dataText5, signInput, intervalClickLikeInput, 
        hesitationRandomInput, hesitationIntervalInput, 
        dmButtonSend, beforeSpan, afterSpan, spanApplyMsg, divUpdateInfo, btnStartText, 
        sendTimer = null, signInTimer = null, miniCloseTimer, noSleepTimer, noSleepTimeouter, 
        divSendBtnTimer, autoLikeTimer, clickLikeBtnTimer,
        count = 0, waitCount = 200, arrayIndex = 0, default_timeout = 600, 
        closeLotteryChecked = 'close_lottery_checked', txtStartTask = '开始定时发送任务', lotteryPrefix = 'lottery_', 
        gmNotice = obj => { alert(''); },
        getGmValue = (key, defaultValue) => { return null; },
        setGmValue = (key, obj) => { console.warn('===> No implementation setGmValue method.'); },
        delGmValue = key => { console.warn('===> No implementation delGmValue method.'); };

    const version = '1.7.2', upodateInfo = '优化自动参与天选时刻功能，修复一些Bug', noticeTimeout = 10e3,
        icoUrl = 'https://www.bilibili.com/favicon.ico',
        roomId = window.location.pathname.replace(/^\/(\S+\/)*/g, ''),
        setGmGetValue = callback => getGmValue = callback,
        setGmSetValue = callback => setGmValue = callback,
        setGmDelValue = callback => delGmValue = callback,
        setGmNotice = callback => gmNotice = callback,
        setBaseInfo = obj => baseInfo = obj,
        arrayInfo = () => console.info(data),
        isNull = str => {
            if (!str || str == '') {
                return true;
            }

            let regu = "^[ ]+$";
            let re = new RegExp(regu);
            return re.test(str);
        },
        compareVersion = (ver1, ver2) => {
            if (isNull(ver1)) return -1;
            if (isNull(ver2)) return 1;

            const arr1 = ver1.split('.').map(x => x * 1),
                arr2 = ver2.split('.').map(x => x * 1),
                len = Math.max(arr1.length, arr2.length);
            for (let i = 0; i < len; i++) {
                if ((arr1[i] || 0) > (arr2[i] || 0)) return 1;
                if ((arr1[i] || 0) < (arr2[i] || 0)) return -1;
            }

            return 0;
        },
        initCss = () => {
            let linkElement = document.createElement('link');
            linkElement.rel = 'stylesheet';
            linkElement.href = 'https://unpkg.zhimg.com/element-ui/lib/theme-chalk/index.css';
            document.head.appendChild(linkElement);

            // 图标库 https://ionic.io/ionicons
            // let scriptElement = document.createElement('script');
            // scriptElement.src = 'https://unpkg.com/ionicons@5.5.2/dist/ionicons.js';
            // document.head.appendChild(scriptElement);

            let customerStyle = document.createElement('style');
            customerStyle.setAttribute('type', 'text/css');
            customerStyle.innerHTML = '.danmu-group-title{font-size:14px;padding-left:2px;color:rgb(18,56,141);display:inline;margin-right:60%;vertical-align:middle;}.danmu-group-textarea{width:98%;min-height:100px;height:16%;margin:1px 0px 4px;border:0px;resize:none;}.el-button{display:inline-block;line-height:1;white-space:nowrap;cursor:pointer;background:#FFF;border:1px solid #DCDFE6;color:#606266;-webkit-appearance:none;text-align:center;-webkit-box-sizing:border-box;box-sizing:border-box;outline:0;margin:0;-webkit-transition:.1s;transition:.1s;font-weight:500;padding:12px 20px;font-size:14px;border-radius:4px}.el-button.is-circle{border-radius:50%;padding:12px}.el-button--mini.is-circle{padding:3px;}.el-button:focus,.el-button:hover{color:#409EFF;border-color:#c6e2ff;background-color:#ecf5ff}.el-icon-close.is-circle{padding:5px;color:#ff0000;border:1px solid #ff0000;margin-left:20px;}.el-icon-check.is-circle{padding:5px;color:#0000ff;border:1px solid #0000ff;margin-left:20px;}input[type="checkbox"]{display:none;}.switch-check{display:inline-block;margin:0 5px;vertical-align:middle;}.switch-check-label{display:inline-block;vertical-align:middle;border:1px solid #bdc3c7;border-radius:60px;width:40px;height:18px;position:relative;transition:all .3s;cursor:pointer;}.switch-check-label:before{width:14px;height:14px;content:"";display:inline-block;background-color:#bdc3c7;border-radius:100%;position:absolute;top:2px;left:4px;transition:all .3s;}.switch-check :checked ~ label{background-color:#26b22b;border-color:#26b22b;}.switch-check :checked ~ label:before{left:22px;background-color:#fff;}.switch-check-group{margin-top:5px;width:95%;}.danmu-random-setting-panel{background-color:#e7f1fb;border-radius:10px;width:100%;height:100%;overflow-y:auto;position:absolute;left:0px;top:0px;z-index:999;display:none;}.danmu-random-setting-panel::-webkit-scrollbar{width:4px;height:4px;}.danmu-random-setting-panel::-webkit-scrollbar-thumb{border-radius:5px;-webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.2);background:rgba(0,0,0,0.2);}.danmu-random-setting-panel::-webkit-scrollbar-track{-webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.2);border-radius:0;background:rgba(0,0,0,0.1);}.danmu-random-setting-title{text-align:center;font-size:16px;font-weight:700;color:#1c5adc;line-height:30px;}.danmu-random-setting-title-sub{display:inline-block;color:#ee8b8b;height:24px;vertical-align:sub;-webkit-transform:scale(0.7);}.danmu-random-setting-tips{color:#0b81cc;text-align:center;font-style:italic;}.module-update-info{color:#0b81cc;text-indent:2em;font-size:13px;font-weight:700;margin:8px 0;padding:2px 0;background-color:#ffffff;}.update-info-text{color:#f00;vertical-align:-webkit-baseline-middle;}.danmu-random-setting-bottom{width:100%;line-height:35px;}.danmu-random-switch-button-title{font-size:14px;vertical-align:middle;margin-left:5px;color:#095ca2;cursor:help;}.danmu-random-setting-success-tips{text-align:center;display:inline-block;vertical-align:middle;width:40%;}.danmu-random-setting-success-text{font-size:16px;color:#128712;display:none;}.danmu-random-set-button-container{display:inline-block;vertical-align:middle;}.global-setting-tip{padding-left:10px;color:red;font-size:14px;font-weight:700;cursor:help;}.disabled{color:#ababab;cursor:not-allowed;}.clean-cache-btn{min-width:70px;font-size:14px;border-radius:4px;color:#fff;background:#d99d1b;border:0px;cursor:pointer;vertical-align:middle;line-height:30px;}.clean-cache-btn:hover{background:rgba(217,157,27,0.8);color:#000}.danmu-btn{min-width:65px;height:24px;font-size:12px;border-radius:4px;color:rgb(255,255,255);background:rgb(217,157,27);border:0px;cursor:pointer;line-height:1;display:inline-flex;justify-content:center;align-items:center;}.danmu-btn:hover{background:var(--color)!important;}.danmu-text-span{color:#095ca2;font-size:20px;vertical-align:middle;font-weight:700}.danmu-second-input{width:70px;height:20px;margin:0px 3px;border:0px;border-radius:3px;font-size:18px}.not-display{display:none !important;}';
            document.head.appendChild(customerStyle);
        },
        // initScript = () => {
        //     let script = document.createElement('script');
        //     script.type = 'text/javascript';
        //     script.src = 'https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.js';
        //     document.head.appendChild(script);
        // },
        getCurrentTimestamp = () => new Date().getTime(),
        send = (msg, index) => {
            let dmTextArea = document.getElementById(baseInfo.dmInputArea || 'chat-control-panel-vm').querySelector('textarea');
            if (!dmTextArea) {
                alert('找不到输入弹幕文本框，请尝试刷新页面');
                return;
            }
            if (!isNull(dmTextArea.value)) {
                console.log(`===> 有内容正在编辑，跳过该次发送任务`);
                return;
            }

            let btnSend = document.getElementsByClassName(baseInfo.sendButtonArea || 'right-action')[0].querySelector('button');
            if (!btnSend) {
                alert('找不到发送按钮，请尝试刷新页面');
                return;
            }
            
            dmTextArea.value = msg;
            dmTextArea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
            btnSend.click();
            // ++count;
            // console.log('===> ' + new Date().toLocaleString() + ' 弹幕发送成功 ' + count + ' 次，第【' + index + '】条数据 === ' + msg);
        },
        randomSort = arr => {
            for (let i = 0; i < arr.length; i++) {
                const rdIndex = Math.floor(Math.random() * arr.length);
                const temp = arr[i];
                arr[i] = arr[rdIndex];
                arr[rdIndex] = temp;
            }

            return arr;
        },
        clearWaiters = () => {
            for (let i = 0; i < waiters.length; i++) {
                workerTimer.clearInterval(waiters[i]);
                waiters[i] = null;
            }

            waiters = [];
        },
        signInFunc = () => {
            if (signInCheckbox.checked) {
                signInput.setAttribute('disabled', 'disabled');
                signInput.classList.add('disabled');
                if (!signInTimer) {
                    let timestamp = new Date(new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()).getTime() - getCurrentTimestamp();
                    console.log('===> 设置凌晨打卡定时器【' + timestamp + '】');
                    signInTimer = workerTimer.setTimeout(() => {
                        let defaultText = isNull(source.signInText) ? '打卡' : source.signInText;
                        send(isNull(signInput.value) ? defaultText : signInput.value, 0);
                        console.log('===> 设置下一次打卡');
                        workerTimer.clearTimeout(signInTimer);
                        signInTimer = null;
                        signInFunc();
                    }, timestamp);
                }
            } 
            else {
                signInput.removeAttribute('disabled');
                signInput.classList.remove('disabled');
                if (signInTimer) {
                    console.log('===> 关闭自动打卡功能');
                    workerTimer.clearTimeout(signInTimer);
                    signInTimer = null;
                }
            }
        },
        setDmSourceInput = obj => {
            dataText1.value = obj.data1.values.length ? obj.data1.values.join('|') : [];
            dataText2.value = obj.data2.values.length ? obj.data2.values.join('|') : [];
            dataText3.value = obj.data3.values.length ? obj.data3.values.join('|') : [];
            dataText4.value = obj.data4.values.length ? obj.data4.values.join('|') : [];
            dataText5.value = obj.data5.values.length ? obj.data5.values.join('|') : [];
        },
        runCheckbox = () => {
            usePublicFunc();
            hideFooterFunc();
            hideGiftControlFunc();
            hideLoginGuideFunc();
            hideHarunaFunc();
            hideShopFunc();
            hidePrivacyFunc();
            hideRoomStatusFunc();
            hideBusinessFunc();
            hideRankListFunc();
            noSleepFunc();
            signInFunc();
            lotteryFunc();
            hesitationIntervalFunc();
            hesitationRandomFunc();
            closeLotteryFunc();
            autoLikeFunc();
            // autoPlay();
            hideRoomFeedFunc();
            hideRoomInfoFunc();
            hideNoticeFunc();
            showLiveAreaFunc();
            let hideTimeout = workerTimer.setTimeout(() => {
                workerTimer.clearTimeout(hideTimeout);
                hideRoomFeedFunc();
                hideRoomInfoFunc();
                hideNoticeFunc();
                showLiveAreaFunc();
            }, 1e3);
        },
        setOperationSetting = () => {
            autoLikeCheckbox.checked = true;
            setPublicCheckbox.checked = false;
            rdCheckbox.checked = source.sendMsgRandom;
            usePublicCheckbox.checked = source.usePublic;
            group1Checkbox.checked = source.data1.available;
            group2Checkbox.checked = source.data2.available;
            group3Checkbox.checked = source.data3.available;
            group4Checkbox.checked = source.data4.available;
            group5Checkbox.checked = source.data5.available;
            clickLikeRandomCheckbox.checked = source.like.likeRandom;
            clickLikeIntervalCheckbox.checked = source.like.likeInterval;
            intervalClickLikeInput.value = source.like.clickLikeInterval;
            !source.like.likeRandom && !source.like.likeInterval && (autoLikeCheckbox.checked = false);
            dmInput.value = source.sendMsgInterval || default_timeout;
            signInput.value = isNull(source.signInText) ? '' : source.signInText;
            lotteryCheckbox.checked = source.lottery.lottery;
            hesitationIntervalCheckbox.checked = source.lottery.hesitationInterval;
            hesitationIntervalInput.value = isNull(source.lottery.hesitationIntervalExpiry) ? 100 : source.lottery.hesitationIntervalExpiry;
            hesitationRandomCheckbox.checked = source.lottery.hesitationRandom;
            hesitationRandomInput.value = isNull(source.lottery.hesitationRandomExpiry) ? 100 : source.lottery.hesitationRandomExpiry;
            setLottery(source.lottery);

            signInCheckbox.checked = config.autoSignIn;
            noSleepCheckbox.checked = config.noSleep;
            hideLoginGuideCheckbox.checked = config.hideLoginGuide;
            hideHarunaCheckbox.checked = config.hideHaruna;
            hideShopCheckbox.checked = config.hideShop;
            hideGiftControlCheckbox.checked = config.hideGift;
            hideRoomFeedCheckbox.checked = config.hideRoomFeed;
            hideRoomInfoCheckbox.checked = config.hideRoomInfo;
            hideNoticeCheckbox.checked = config.hideNotice;
            hideFooterCheckbox.checked = config.hideFooter;
            hidePrivacyCheckbox.checked = config.noPrivacy;
            hideRoomStatusCheckbox.checked = config.hideWatermark;
            hideBusinessCheckbox.checked = config.hideBusiness;
            hideRankListCheckbox.checked = config.hideRankList;
            showLiveAreaCheckbox.checked = config.showLiveArea;
            closeLotteryCheckbox.checked = config.closeLottery;
            window.localStorage.setItem(closeLotteryChecked, closeLotteryCheckbox.checked);
            runCheckbox();
        },
        openSetting = () => divSetting.style.display = 'block',
        closeSetting = () => {
            setOperationSetting();
            divSetting.style.display = 'none';
        },
        initData = () => {
            if (source.data1.values.length <= 0
                && source.data2.values.length <= 0
                && source.data3.values.length <= 0
                && source.data4.values.length <= 0
                && source.data5.values.length <= 0) {
                return data ? data : [];
            }

            let result = [];
            result = source.data1.available ? result.concat(source.data1.values) : result;
            result = source.data2.available ? result.concat(source.data2.values) : result;
            result = source.data3.available ? result.concat(source.data3.values) : result;
            result = source.data4.available ? result.concat(source.data4.values) : result;
            result = source.data5.available ? result.concat(source.data5.values) : result;
            data = result;
            rdCheckbox.checked ? data = randomSort(result) : arrayIndex = 0;
        },
        flashMsg = (txt, back, color) => {
            spanApplyMsg.textContent = txt;
            spanApplyMsg.style.display = 'block';
            if (color) {
                spanApplyMsg.style.color = color;
            } 
            else {
                spanApplyMsg.style.color = '#128712';
            }

            let hideTipTimer = workerTimer.setTimeout(() => {
                workerTimer.clearTimeout(hideTipTimer);
                spanApplyMsg.style.display = 'none';
                spanApplyMsg.textContent = '';
                if (back) { 
                    divSetting.style.display = 'none';
                }
            }, 1.5e3);
        },
        save = () => {
            if (!baseInfo || isNull(baseInfo.default) || isNull(baseInfo.config)) {
                flashMsg('保存失败', false, 'red');
                return;
            }
            if (baseInfo.config) {
                config.autoSignIn = signInCheckbox.checked;
                config.noSleep = noSleepCheckbox.checked;
                config.hideLoginGuide = hideLoginGuideCheckbox.checked;
                config.hideHaruna = hideHarunaCheckbox.checked;
                config.hideShop = hideShopCheckbox.checked;
                config.hideGift = hideGiftControlCheckbox.checked;
                config.hideRoomFeed = hideRoomFeedCheckbox.checked;
                config.hideRoomInfo = hideRoomInfoCheckbox.checked;
                config.hideNotice = hideNoticeCheckbox.checked;
                config.hideFooter = hideFooterCheckbox.checked;
                config.closeLottery = closeLotteryCheckbox.checked;
                window.localStorage.setItem(closeLotteryChecked, config.closeLottery);
                config.noPrivacy = hidePrivacyCheckbox.checked;
                config.hideWatermark = hideRoomStatusCheckbox.checked;
                config.hideBusiness = hideBusinessCheckbox.checked;
                config.hideRankList = hideRankListCheckbox.checked;
                config.showLiveArea = showLiveAreaCheckbox.checked;
                setGmValue(baseInfo.config, config);
            }

            let v1 = isNull(dataText1.value) ? [] : dataText1.value.split('|'),
                v2 = isNull(dataText2.value) ? [] : dataText2.value.split('|'),
                v3 = isNull(dataText3.value) ? [] : dataText3.value.split('|'),
                v4 = isNull(dataText4.value) ? [] : dataText4.value.split('|'),
                v5 = isNull(dataText5.value) ? [] : dataText5.value.split('|');
            source.signInText = signInput.value;
            source.sendMsgRandom = rdCheckbox.checked;
            source.sendMsgInterval = dmInput.value || default_timeout;
            source.data1.available = group1Checkbox.checked;
            source.data2.available = group2Checkbox.checked;
            source.data3.available = group3Checkbox.checked;
            source.data4.available = group4Checkbox.checked;
            source.data5.available = group5Checkbox.checked;
            source.like.likeRandom = clickLikeRandomCheckbox.checked;
            source.like.likeInterval = clickLikeIntervalCheckbox.checked;
            source.like.clickLikeInterval = intervalClickLikeInput.value || 6;
            source.lottery.lottery = lotteryCheckbox.checked;
            source.lottery.hesitationInterval = hesitationIntervalCheckbox.checked;
            source.lottery.hesitationIntervalExpiry = hesitationIntervalInput.value;
            source.lottery.hesitationRandom = hesitationRandomCheckbox.checked;
            source.lottery.hesitationRandomExpiry = hesitationRandomInput.value;
            source.usePublic = usePublicCheckbox.checked;
            if (!usePublicCheckbox.checked) {
                source.data1.values = v1;
                source.data2.values = v2;
                source.data3.values = v3;
                source.data4.values = v4;
                source.data5.values = v5;
            }
            
            setLottery(source.lottery);
            setGmValue(roomId, source);
            if (setPublicCheckbox.checked) {
                let ps = {data1:{},data2:{},data3:{},data4:{},data5:{}};
                ps.data1.values = v1;
                ps.data2.values = v2;
                ps.data3.values = v3;
                ps.data4.values = v4;
                ps.data5.values = v5;
                setGmValue(baseInfo.default, ps);
            }
            if (usePublicCheckbox.checked) {
                source.data1.values = v1;
                source.data2.values = v2;
                source.data3.values = v3;
                source.data4.values = v4;
                source.data5.values = v5;
            }
            
            initData();
            flashMsg('设置成功', true);
        },
        cleanCache = () => {
            if (baseInfo.config && config) {
                config.script = '';
                config.moduleVersion = '0.0.0';
                config.lastUpdate = '清除脚本缓存';
                setGmValue(baseInfo.config, config);
                flashMsg('清除成功');
            } else {
                console.warn('元数据丢失');
                flashMsg('操作失败', false, 'red');
            }
        },
        danmu = () => {
            if (data.length < 1) {
                // gmNotice({
                //     text: '请任意在一个分组里输入一条弹幕',
                //     title: '没有弹幕数据，请先设置',
                //     image: icoUrl,
                //     highlight: true,
                //     timeout: noticeTimeout
                // });
                alert('请先设置弹幕');
                return false;
            }
            if (rdCheckbox.checked) {
                arrayIndex = Math.floor((Math.random() * data.length));
            }

            send(data[arrayIndex], arrayIndex);
            ++arrayIndex;
            if (arrayIndex >= data.length) {
                arrayIndex = 0;
            }

            return true;
        },
        offOrOn = () => {
            let timeout = 0;
            if (sendTimer) {
                workerTimer.clearInterval(sendTimer);
                sendTimer = null;
                dmButtonSend.title = txtStartTask;
                dmInput.removeAttribute('disabled');
                dmInput.classList.remove('disabled');
                if (btnStartText) {
                    dmButtonSend.style.removeProperty('background');
                    dmButtonSend.style.removeProperty('--color');
                    btnStartText.textContent = '开始';
                }
                else {
                    dmButtonSend.style.removeProperty('color');
                }
            } else {
                timeout = (dmInput.value || default_timeout) * 1e3;
                if (!danmu()) {
                    return;
                }

                sendTimer = workerTimer.setInterval(danmu, timeout);
                dmButtonSend.title = '停止定时发送任务';
                dmInput.setAttribute('disabled', 'disabled');
                dmInput.classList.add('disabled');
                if (btnStartText) {
                    dmButtonSend.style.background = 'rgba(255,0,0,1)';
                    dmButtonSend.style.setProperty('--color', 'rgba(255,0,0,0.8)');
                    btnStartText.textContent = '停止';
                }
                else {
                    dmButtonSend.style.color = 'rgb(255 102 153)';
                }
            }
        },
        createIntervalInput = () => {
            let input = document.createElement('input');
            input.style.border = '0';
            input.style.width = '55px';
            input.setAttribute('placeholder', '单位：秒');
            input.setAttribute('oninput', "this.value = this.value.replace(/[^0-9]/g, '')");
            return input;
        },
        createSwitch = (id, txt, title, func, container, indent, width, hidden, rear, disabled) => {
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.checked = false;
            if (func && !disabled) {
                checkbox.addEventListener('click', func);
            }

            let lblCheckbox = document.createElement('label');
            lblCheckbox.setAttribute('for', id);
            lblCheckbox.classList.add('switch-check-label');

            let descSpan = document.createElement('span');
            descSpan.textContent = txt;
            descSpan.title = title;
            descSpan.classList.add('danmu-random-switch-button-title');
            if (disabled) {
                checkbox.disabled = true;
                checkbox.classList.add('disabled');
                lblCheckbox.classList.add('disabled');
                descSpan.classList.add('disabled');
            }

            let divCheckbox = document.createElement('div');
            divCheckbox.id = id + 'Div';
            divCheckbox.classList.add('switch-check');
            divCheckbox.classList.add('switch-check-group');
            divCheckbox.appendChild(checkbox);
            divCheckbox.appendChild(lblCheckbox);
            divCheckbox.appendChild(descSpan);
            if (!isNull(indent)) {
                divCheckbox.style.marginLeft = indent;
            }
            if (!isNull(width)) {
                divCheckbox.style.width = width;
            }
            if (hidden) {
                divCheckbox.style.setProperty('display', 'none');
            }
            if (rear) {
                divCheckbox.appendChild(rear);
                if (disabled) {
                    rear.disabled = true;
                    rear.classList.add('disabled');
                }
            }

            container.appendChild(divCheckbox);
            return checkbox;
        },
        buildPanel = () => {
            /* ----------------------------------------- head ----------------------------------------- */
            let divSettingTitle = document.createElement('div');
            divSettingTitle.textContent = '弹幕设置';
            divSettingTitle.classList.add('danmu-random-setting-title');

            let divSub = document.createElement('div');
            divSub.textContent = version;
            divSub.classList.add('danmu-random-setting-title-sub');
            divSettingTitle.appendChild(divSub);

            let divTip = document.createElement('div');
            divTip.classList.add('danmu-random-setting-tips');
            divTip.innerHTML = '任一分组内输入弹幕即可，多条用<span style="color:#dc6b07;margin:0 2px 0 4px;font-weight:700;font-style:normal;">竖线</span>分隔';

            divUpdateInfo = document.createElement('div');
            divUpdateInfo.classList.add('module-update-info');
            divUpdateInfo.innerHTML = `<span class="update-info-text">消息提示：</span><span class="update-info-text" style="color:#0f6ba6;">${baseInfo.msg || upodateInfo}</span>`;
            /* ----------------------------------------- head ----------------------------------------- */

            /* ----------------------------------------- textarea 1 ----------------------------------------- */
            let divText1 = document.createElement('div');
            divText1.textContent = '分组 1 ：';
            divText1.classList.add('danmu-group-title');

            group1Checkbox = document.createElement('input');
            group1Checkbox.type = 'checkbox';
            group1Checkbox.id = 'group1Checkbox';
            group1Checkbox.checked = true;

            let lblGroup1Checkbox = document.createElement('label');
            lblGroup1Checkbox.setAttribute('for', 'group1Checkbox');
            lblGroup1Checkbox.classList.add('switch-check-label');

            let divGroup1Checkbox = document.createElement('div');
            divGroup1Checkbox.classList.add('switch-check');
            divGroup1Checkbox.appendChild(group1Checkbox);
            divGroup1Checkbox.appendChild(lblGroup1Checkbox);

            dataText1 = document.createElement('textarea');
            dataText1.classList.add('danmu-group-textarea');
            dataText1.setAttribute('placeholder', '请输入弹幕，多条弹幕请用“|”分隔');
            /* ----------------------------------------- textarea 1 ----------------------------------------- */

            /* ----------------------------------------- textarea 2 ----------------------------------------- */
            let divText2 = document.createElement('div');
            divText2.textContent = '分组 2 ：';
            divText2.classList.add('danmu-group-title');

            group2Checkbox = document.createElement('input');
            group2Checkbox.type = 'checkbox';
            group2Checkbox.id = 'group2Checkbox';
            group2Checkbox.checked = true;

            let lblGroup2Checkbox = document.createElement('label');
            lblGroup2Checkbox.setAttribute('for', 'group2Checkbox');
            lblGroup2Checkbox.classList.add('switch-check-label');

            let divGroup2Checkbox = document.createElement('div');
            divGroup2Checkbox.classList.add('switch-check');
            divGroup2Checkbox.appendChild(group2Checkbox);
            divGroup2Checkbox.appendChild(lblGroup2Checkbox);

            dataText2 = document.createElement('textarea');
            dataText2.classList.add('danmu-group-textarea');
            dataText2.setAttribute('placeholder', '请输入弹幕，多条弹幕请用“|”分隔');
            /* ----------------------------------------- textarea 2 ----------------------------------------- */

            /* ----------------------------------------- textarea 3 ----------------------------------------- */
            let divText3 = document.createElement('div');
            divText3.textContent = '分组 3 ：';
            divText3.classList.add('danmu-group-title');

            group3Checkbox = document.createElement('input');
            group3Checkbox.type = 'checkbox';
            group3Checkbox.id = 'group3Checkbox';
            group3Checkbox.checked = true;

            let lblGroup3Checkbox = document.createElement('label');
            lblGroup3Checkbox.setAttribute('for', 'group3Checkbox');
            lblGroup3Checkbox.classList.add('switch-check-label');

            let divGroup3Checkbox = document.createElement('div');
            divGroup3Checkbox.classList.add('switch-check');
            divGroup3Checkbox.appendChild(group3Checkbox);
            divGroup3Checkbox.appendChild(lblGroup3Checkbox);

            dataText3 = document.createElement('textarea');
            dataText3.classList.add('danmu-group-textarea');
            dataText3.setAttribute('placeholder', '请输入弹幕，多条弹幕请用“|”分隔');
            /* ----------------------------------------- textarea 3 ----------------------------------------- */

            /* ----------------------------------------- textarea 4 ----------------------------------------- */
            let divText4 = document.createElement('div');
            divText4.textContent = '分组 4 ：';
            divText4.classList.add('danmu-group-title');

            group4Checkbox = document.createElement('input');
            group4Checkbox.type = 'checkbox';
            group4Checkbox.id = 'group4Checkbox';
            group4Checkbox.checked = true;

            let lblGroup4Checkbox = document.createElement('label');
            lblGroup4Checkbox.setAttribute('for', 'group4Checkbox');
            lblGroup4Checkbox.classList.add('switch-check-label');

            let divGroup4Checkbox = document.createElement('div');
            divGroup4Checkbox.classList.add('switch-check');
            divGroup4Checkbox.appendChild(group4Checkbox);
            divGroup4Checkbox.appendChild(lblGroup4Checkbox);

            dataText4 = document.createElement('textarea');
            dataText4.classList.add('danmu-group-textarea');
            dataText4.setAttribute('placeholder', '请输入弹幕，多条弹幕请用“|”分隔');
            /* ----------------------------------------- textarea 4 ----------------------------------------- */

            /* ----------------------------------------- textarea 5 ----------------------------------------- */
            let divText5 = document.createElement('div');
            divText5.textContent = '分组 5 ：';
            divText5.classList.add('danmu-group-title');

            group5Checkbox = document.createElement('input');
            group5Checkbox.type = 'checkbox';
            group5Checkbox.id = 'group5Checkbox';
            group5Checkbox.checked = true;

            let lblGroup5Checkbox = document.createElement('label');
            lblGroup5Checkbox.setAttribute('for', 'group5Checkbox');
            lblGroup5Checkbox.classList.add('switch-check-label');

            let divGroup5Checkbox = document.createElement('div');
            divGroup5Checkbox.classList.add('switch-check');
            divGroup5Checkbox.appendChild(group5Checkbox);
            divGroup5Checkbox.appendChild(lblGroup5Checkbox);

            dataText5 = document.createElement('textarea');
            dataText5.classList.add('danmu-group-textarea');
            dataText5.setAttribute('placeholder', '请输入弹幕，多条弹幕请用“|”分隔');
            /* ----------------------------------------- textarea 5 ----------------------------------------- */


            /* ----------------------------------------- send interval ----------------------------------------- */
            beforeSpan = document.createElement('span');
            beforeSpan.textContent = '设置弹幕每';
            beforeSpan.classList.add('danmu-text-span');
            beforeSpan.style.marginLeft = '4px';

            dmInput = document.createElement('input');
            dmInput.value = default_timeout;
            dmInput.classList.add('danmu-second-input');
            dmInput.setAttribute('oninput', "this.value = this.value.replace(/[^0-9]/g, '')");

            afterSpan = document.createElement('span');
            afterSpan.textContent = '秒发送一次';
            afterSpan.classList.add('danmu-text-span');
            afterSpan.style.marginRight = '4px';

            let divSendInterval = document.createElement('div');
            divSendInterval.appendChild(beforeSpan);
            divSendInterval.appendChild(dmInput);
            divSendInterval.appendChild(afterSpan);

            let divSendNote = document.createElement('div');
            divSendNote.textContent = '▲ 执行任务时会占用输入框，如果输入框有内容则跳过任务，直到清空输入框为止';
            /* ----------------------------------------- send interval ----------------------------------------- */


            /* ----------------------------------------- different room setting ----------------------------------------- */
            signInput = document.createElement('input');
            signInput.id = 'signInputText';
            signInput.style.border = '0';
            signInput.style.width = '90px';
            signInput.setAttribute('placeholder', '输入打卡的文字');
            
            hesitationIntervalInput = createIntervalInput();
            hesitationRandomInput = createIntervalInput();
            intervalClickLikeInput = createIntervalInput();

            let divRoomSetting = document.createElement('div');
            divRoomSetting.appendChild(divText1);
            divRoomSetting.appendChild(divGroup1Checkbox);
            divRoomSetting.appendChild(dataText1);
            divRoomSetting.appendChild(divText2);
            divRoomSetting.appendChild(divGroup2Checkbox);
            divRoomSetting.appendChild(dataText2);
            divRoomSetting.appendChild(divText3);
            divRoomSetting.appendChild(divGroup3Checkbox);
            divRoomSetting.appendChild(dataText3);
            divRoomSetting.appendChild(divText4);
            divRoomSetting.appendChild(divGroup4Checkbox);
            divRoomSetting.appendChild(dataText4);
            divRoomSetting.appendChild(divText5);
            divRoomSetting.appendChild(divGroup5Checkbox);
            divRoomSetting.appendChild(dataText5);
            divRoomSetting.appendChild(divSendInterval);
            divRoomSetting.appendChild(divSendNote);
            rdCheckbox = createSwitch('rdCheckbox', '随机从上面的弹幕中选出一条发送', '将合并所有分组数据，从中随机选出一条发送', null, divRoomSetting);
            usePublicCheckbox = createSwitch('usePublicCheckbox', '使用共用弹幕源', '使用设置为共用弹幕作为弹幕源', usePublicFunc, divRoomSetting);
            signInCheckbox = createSwitch('signInCheckbox', '打卡弹幕：', '每日零点自动发送一条打卡弹幕', signInFunc, divRoomSetting, null, null, false, signInput);
            autoLikeCheckbox = createSwitch('autoLikeCheckbox', '自动点赞该直播间', '分成固定间隔的定时点赞和随机某个时间点点赞功能', autoLikeFunc, divRoomSetting, null, null, null, null, null);
            clickLikeIntervalCheckbox = createSwitch('clickLikeIntervalCheckbox', '定时点赞：', '大于3秒的时间间隔任意设置（时间单位：秒，最小间隔3秒，免得被滥用惹恼了阿B加上人机校验）', intervalClickLikeFunc, divRoomSetting, '23px', '90%', true, intervalClickLikeInput, false);
            clickLikeRandomCheckbox = createSwitch('clickLikeRandomCheckbox', '随机时间点点赞', '每15秒内随机一个时间点点赞一次直播间（点赞1000次大概需要4小时）', randomClickLikeFunc, divRoomSetting, '23px', '90%', true, null, false);
            lotteryCheckbox = createSwitch('lotteryCheckbox', '自动参与天选时刻抽奖（需登录）', '自动点击参与按钮，请确保已经登录了阿B账号', lotteryFunc, divRoomSetting);
            hesitationIntervalCheckbox = createSwitch('hesitationIntervalCheckbox', '犹豫期：', '不立刻参与天选时刻，这期间可以手动处理，免得自动参加后后悔（时间单位：秒）', hesitationIntervalFunc, divRoomSetting, '23px', '90%', true, hesitationIntervalInput, false);
            hesitationRandomCheckbox = createSwitch('hesitationRandomCheckbox', '随机犹豫期：', '尝试应对人机校验，不一定有效，随机的范围：(0, 填的数字]（时间单位：秒）', hesitationRandomFunc, divRoomSetting, '23px', '90%', true, hesitationRandomInput, false);

            let operationDescription =  document.createElement('div');
            operationDescription.textContent = '以上设置对应各个直播间独立保存，无需刷新';
            operationDescription.title = '请点击设置面板底下的“✓”进行保存';
            operationDescription.classList.add('global-setting-tip');
            operationDescription.classList.add('switch-check-group');
            divRoomSetting.appendChild(operationDescription);
            /* ----------------------------------------- different room setting ----------------------------------------- */

            /* ----------------------------------------- global setting ----------------------------------------- */
            let divGlobalSetting = document.createElement('div');
            divGlobalSetting.style.margin = '20px 0 10px';

            operationDescription =  document.createElement('div');
            operationDescription.textContent = '以下设置，需刷新其它直播间才能适用';
            operationDescription.title = '请点击设置面板底下的“✓”进行保存';
            operationDescription.classList.add('global-setting-tip');
            operationDescription.classList.add('switch-check-group');
            divGlobalSetting.appendChild(operationDescription);

            setPublicCheckbox = createSwitch('setPublicCheckbox', '设为共用弹幕源', '把这个直播间的弹幕共享给其它直播间使用，先后设置时，后面的会覆盖前面的设置', setPublicFunc, divGlobalSetting);
            closeLotteryCheckbox = createSwitch('closeLotteryCheckbox', '关闭天选时刻', '关闭天选时刻弹窗', closeLotteryFunc, divGlobalSetting);
            hideGiftControlCheckbox = createSwitch('hideGiftControlCheckbox', '隐藏礼物栏', '隐藏播放器底部的礼物栏', hideGiftControlFunc, divGlobalSetting);
            noSleepCheckbox = createSwitch('noSleepCheckbox', '防止直播间休眠', '防止直播间页面一段时间没操作之后进入休眠', noSleepFunc, divGlobalSetting, null, null, false);
            hideLoginGuideCheckbox = createSwitch('hideLoginGuideCheckbox', '隐藏播放器底部登录提示', '隐藏未登录时播放器底部显示的登录提示', hideLoginGuideFunc, divGlobalSetting);
            hideHarunaCheckbox = createSwitch('hideHarunaCheckbox', '隐藏看板娘立绘', '隐藏直播间Haruna立绘', hideHarunaFunc, divGlobalSetting);
            hideShopCheckbox = createSwitch('hideShopCheckbox', '隐藏购物提示', '隐藏播放器左上角的商店购物提示', hideShopFunc, divGlobalSetting);
            hideRoomFeedCheckbox = createSwitch('hideRoomFeedCheckbox', '隐藏主播动态', '隐藏播放器底下主播的动态栏', hideRoomFeedFunc, divGlobalSetting);
            hideRoomInfoCheckbox = createSwitch('hideRoomInfoCheckbox', '隐藏简介、荣誉，或直播间推荐列表', '隐藏播放器底下直播间推荐列表，不登录账号显示为主播的荣耀和简介', hideRoomInfoFunc, divGlobalSetting);
            hideNoticeCheckbox = createSwitch('hideNoticeCheckbox', '隐藏主播公告', '隐藏弹幕列表底下主播的公告', hideNoticeFunc, divGlobalSetting);
            hideFooterCheckbox = createSwitch('hideFooterCheckbox', '隐藏直播间页脚', '隐藏直播间底部的网页页脚', hideFooterFunc, divGlobalSetting);
            hidePrivacyCheckbox = createSwitch('hidePrivacyCheckbox', '隐藏隐私提示对话框', '隐藏隐私提示登录的对话框，被打码的昵称不保证变回正常', hidePrivacyFunc, divGlobalSetting);
            hideRoomStatusCheckbox = createSwitch('hideRoomStatusCheckbox', '隐藏直播水印', '隐藏播放器左上角的直播水印', hideRoomStatusFunc, divGlobalSetting);
            hideBusinessCheckbox = createSwitch('hideBusinessCheckbox', '隐藏商业性互动', '隐藏全站广播、PK、连MIC、连视频等', hideBusinessFunc, divGlobalSetting);
            hideRankListCheckbox = createSwitch('hideRankListCheckbox', '隐藏滚动排行榜', '隐藏顶部的人气榜、航海榜、礼物星球等', hideRankListFunc, divGlobalSetting);
            showLiveAreaCheckbox = createSwitch('showLiveArea', '显示直播分区', '显示直播间所属的直播分区', showLiveAreaFunc, divGlobalSetting);
            
            /* ----------------------------------------- global setting ----------------------------------------- */

            /* ----------------------------------------- operation msg ----------------------------------------- */
            spanApplyMsg = document.createElement('span');
            spanApplyMsg.classList.add('danmu-random-setting-success-text');

            let divApplyMsg = document.createElement('div');
            divApplyMsg.classList.add('danmu-random-setting-success-tips');
            divApplyMsg.appendChild(spanApplyMsg);
            /* ----------------------------------------- operation msg ----------------------------------------- */
            
            /* ----------------------------------------- clean cache ----------------------------------------- */
            let cleanCacheBtn = document.createElement('button');
            cleanCacheBtn.style.setProperty('display', 'none');
            cleanCacheBtn.textContent = '清除缓存';
            cleanCacheBtn.classList.add('clean-cache-btn');
            cleanCacheBtn.addEventListener('click', cleanCache);
            /* ----------------------------------------- clean cache ----------------------------------------- */

            /* ----------------------------------------- save and close button ----------------------------------------- */
            let btnSave = document.createElement('i');
            btnSave.setAttribute('title', '保存');
            btnSave.style.padding = '5px';
            btnSave.classList.add('el-button');
            btnSave.classList.add('el-icon-check');
            btnSave.classList.add('is-circle');
            btnSave.addEventListener('click', save);

            let btnClose = document.createElement('i');
            btnClose.setAttribute('title', '关闭');
            btnClose.style.padding = '5px';
            btnClose.classList.add('el-button');
            btnClose.classList.add('el-icon-close');
            btnClose.classList.add('is-circle');
            btnClose.addEventListener('click', closeSetting);

            let divBtnSetting = document.createElement('div');
            divBtnSetting.classList.add('danmu-random-set-button-container');
            divBtnSetting.appendChild(cleanCacheBtn);
            divBtnSetting.appendChild(btnSave);
            divBtnSetting.appendChild(btnClose);
            /* ----------------------------------------- save and close button ----------------------------------------- */

            /* ----------------------------------------- container ----------------------------------------- */
            let divBottomContainer = document.createElement('div');
            divBottomContainer.classList.add('danmu-random-setting-bottom');
            divBottomContainer.appendChild(divApplyMsg);
            divBottomContainer.appendChild(divBtnSetting);

            let divOtherContainer = document.createElement('div');
            divOtherContainer.id = 'otherContainer';

            let divContainer = document.createElement('div');
            divContainer.style.height = 'calc(98% - 30px - 25px)';
            divContainer.appendChild(divRoomSetting);
            divContainer.appendChild(divGlobalSetting);
            divContainer.appendChild(divOtherContainer);
            divContainer.appendChild(divBottomContainer);
            /* ----------------------------------------- container ----------------------------------------- */

            divSetting = document.createElement('div');
            divSetting.id = 'danmu-setting-panel';
            divSetting.classList.add('danmu-random-setting-panel');
            divSetting.appendChild(divSettingTitle);
            divSetting.appendChild(divUpdateInfo);
            divSetting.appendChild(divTip);
            divSetting.appendChild(divContainer);

            let asideAreaVm = document.getElementById('aside-area-vm');
            asideAreaVm.appendChild(divSetting);

        },
        btnStart = btn => {
            btnStartText = document.createElement('span');
            btnStartText.textContent = '开始';
            btnStartText.title = txtStartTask;
            btnStartText.classList.add('txt');

            dmButtonSend = document.createElement('button');
            dmButtonSend.title = txtStartTask;
            //dmButtonSend.onclick = function() { alert('Hello world');}
            dmButtonSend.addEventListener('click', offOrOn);
            dmButtonSend.appendChild(btnStartText);
            if (btn) {
                copyAttributes(btn, dmButtonSend);
                const span = btn.querySelector('span');
                if (span) {
                    copyAttributes(span, btnStartText);
                }
            }
            else {
                dmButtonSend.classList.add('danmu-btn');
                dmButtonSend.style.setProperty('--color', 'rgba(217,157,27,0.8)');
            }
        },
        btnStartLogin = () => {
            let iElement = document.createElement('i');
            iElement.classList.add('el-icon-s-promotion');

            dmButtonSend = document.createElement('button');
            dmButtonSend.title = txtStartTask;
            dmButtonSend.classList.add('el-button');
            dmButtonSend.classList.add('el-button--mini');
            dmButtonSend.classList.add('is-circle');
            dmButtonSend.style.background = 'none';
            dmButtonSend.style.fontSize = '20px';
            dmButtonSend.style.border = '0';
            dmButtonSend.addEventListener('click', offOrOn);
            dmButtonSend.appendChild(iElement);

            let div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.right = '5px';
            div.style.alignSelf = 'flex-end';
            div.style.marginBottom = '-2px';
            div.appendChild(dmButtonSend);
            return div;
        },
        btnSetting = () => {
            const divEmo = document.getElementsByClassName('emoticons-panel border-box')[0]; // 表情包
            let iElement = document.createElement('i');
            iElement.classList.add('el-icon-setting');

            let btn = document.createElement('button');
            btn.title = '定时设置';
            btn.classList.add('el-button');
            btn.classList.add('el-button--mini');
            btn.classList.add('is-circle');
            btn.style.border = '0';
            btn.addEventListener('click', openSetting);
            btn.appendChild(iElement);
            if (divEmo) {
                btn.style.background = 'none';
                btn.style.fontSize = '19px';
                let div = document.createElement('div');
                copyAttributes(divEmo, div);
                div.style.backgroundImage = 'none';
                div.style.alignSelf = 'flex-end';
                div.style.marginBottom = '5px';
                div.style.position = 'absolute';
                div.style.right = '33px';
                div.appendChild(btn);

                divEmo.style.alignSelf = 'flex-start';
                divEmo.style.marginTop = '1px';
                return div;
            }
            else {
                btn.style.fontSize = '15px';
                btn.style.margin = '0 5px';
                return btn;
            }
        },
        copyAttributes = (oldNode, newNode) => {
            Array.prototype.forEach.call(oldNode.attributes, (item, index) => newNode.setAttribute(item.name, item.value));
        },
        setDisplay = (dom, property, important) => {
            if (important) {
                dom.style.setProperty('display', property, 'important');
            }
            else {
                dom.style.setProperty('display', property);
            }
        },
        blockDisplay = (dom, shwon) => {
            if (shwon) {
                setDisplay(dom, 'block', true);
            }
            else {
                dom.style.removeProperty('display');
            }
        },
        noneDisplay = (dom, hidden) => {
            if (hidden) {
                setDisplay(dom, 'none', true);
            }
            else {
                dom.style.removeProperty('display');
            }
        },
        removeAttributeFromChildren = (dom, attr) => {
            dom.removeAttribute(attr);
            if (0 < dom.children.length) {
                for (let i = 0; i < dom.children.length; i++) {
                    removeAttributeFromChildren(dom.children[i], attr);
                }
            }
        },
        setAttributeToChildren = (dom, attr, val) => {
            dom.setAttribute(attr, val);
            if (0 < dom.children.length) {
                for (let i = 0; i < dom.children.length; i++) {
                    setAttributeToChildren(dom.children[i], attr, val);
                }
            }
        },
        removeClassFromChildren = (dom, classes) => {
            dom.classList.remove(classes);
            if (0 < dom.children.length) {
                for (let i = 0; i < dom.children.length; i++) {
                    removeClassFromChildren(dom.children[i], classes);
                }
            }
        },
        addClassToChildren = (dom, classes) => {
            dom.classList.add(classes);
            if (0 < dom.children.length) {
                for (let i = 0; i < dom.children.length; i++) {
                    addClassToChildren(dom.children[i], classes);
                }
            }
        },
        hideLoginGuideFunc = () => {
            let dom = document.getElementById('switch-login-guide-vm');
            if (dom) {
                noneDisplay(dom, hideLoginGuideCheckbox.checked);
            }
        },
        hideHarunaFunc = () => {
            let dom = document.getElementById('my-dear-haruna-vm');
            if (dom) {
                noneDisplay(dom, hideHarunaCheckbox.checked);
            }
        },
        hideShopFunc = () => {
            let dom = document.getElementById('shop-popover-vm');
            if (dom) {
                noneDisplay(dom, hideShopCheckbox.checked);
            }
        },
        hideGiftControlFunc = () => {
            let dom = document.getElementsByClassName('gift-control-section')[0];
            if (dom) {
                noneDisplay(dom, hideGiftControlCheckbox.checked);
            }

            dom = document.getElementById('web-player__bottom-bar__container');
            if (dom) {
                noneDisplay(dom, hideGiftControlCheckbox.checked);
            }

            dom = document.getElementsByTagName('video'); 
            for (let i = 0; i < dom.length; i++) {
                if (!dom[i]) {
                    return;
                }
                if (hideGiftControlCheckbox.checked) {
                    dom[i].style.setProperty('height', '100%');
                }
                else if (document.body.classList.contains('player-full-win') || document.body.classList.contains('fullscreen-fix')) {
                    dom[i].style.setProperty('height', 'calc(100% - 114px)');
                }
            }
        },
        hideRoomFeedFunc = () => {
            let dom = document.getElementsByClassName('room-feed')[0];
            if (dom) {
                noneDisplay(dom, hideRoomFeedCheckbox.checked);
            }
            
            dom = document.getElementsByClassName('flip-view p-relative')[0];
            if (dom) {
                noneDisplay(dom, hideRoomFeedCheckbox.checked);
            }
        },
        hideRoomInfoFunc = () => {
            let dom = document.getElementsByClassName('room-info-ctnr')[0];
            if (dom) {
                noneDisplay(dom, hideRoomInfoCheckbox.checked);
            }
        },
        hideNoticeFunc = () => {
            let dom = document.getElementsByClassName('right-container')[0];
            if (dom) {
                dom.style.setProperty('min-height', 'auto');
                noneDisplay(dom, hideNoticeCheckbox.checked);
            }
        },
        hideFooterFunc = () => {
            let dom = document.getElementById('link-footer-vm');
            if (dom) {
                noneDisplay(dom, hideFooterCheckbox.checked);
            }
        },
        hidePrivacyFunc = () => {
            if (hidePrivacyCheckbox.checked) {
                let dom = document.createElement('style');
                dom.id = 'hidePrivacyDialog';
                dom.setAttribute('type', 'text/css');
                dom.innerHTML = '.privacy-dialog{display:none !important;}';
                document.head.appendChild(dom);
            }
            else {
                let dom = document.getElementById('hidePrivacyDialog');
                if (dom) {
                    dom.remove();
                }
            }
        },
        hideRoomStatusFunc = () => {
            let dom = document.getElementsByClassName('web-player-icon-roomStatus')[0];
            if (dom) {
                noneDisplay(dom, hideRoomStatusCheckbox.checked);
            }
        },
        hideBusinessFunc = () => {
            let dom = document.getElementById('businessContainerElement');
            if (dom) {
                noneDisplay(dom, hideBusinessCheckbox.checked);
            }
        },
        // 适配Bilibili直播自动追帧样式
        adaptBililiveSeeker = () => {
            let dom = document.getElementById('playback-rate-title');
            if (dom) {
                noneDisplay(dom, true);
                dom.parentElement.style.removeProperty('padding-bottom');
            }

            dom = document.getElementById('playback-rate-username');
            if (dom) {
                dom.style.removeProperty('display');
            }
        },
        hideRankListFunc = () => {
            let lower = document.getElementsByClassName('lower-row')[0];
            if (!lower) {
                return;
            }

            let dom = lower.getElementsByClassName('right-ctnr')[0]
            if (dom) {
                noneDisplay(dom, hideRankListCheckbox.checked);
                let t = workerTimer.setTimeout(() => {
                    workerTimer.clearTimeout(t);
                    t = null;
                    adaptBililiveSeeker();
                }, 100);
            }
        },
        showLiveAreaFunc = () => {
            let dom = document.getElementsByClassName('live-area')[0];
            if (dom) {
                blockDisplay(dom, showLiveAreaCheckbox.checked);
                adaptBililiveSeeker();
            }
        },
        getLottery = () => {
            let v = window.localStorage.getItem(lotteryPrefix + roomId);
            if (!v) {
                return source.lottery;
            }
            if ('string' === typeof v) {
                try {
                    v = JSON.parse(v);
                } catch (e) {
                    console.error('===> Parsing error:', e);
                    v = source.lottery;
                }
            }

            return v;
        },
        setLottery = obj => {
            window.localStorage.setItem(lotteryPrefix + roomId, obj);
        },
        lotteryFunc = () => {
            let obj = getLottery();
            obj.lottery = lotteryCheckbox.checked;
            setLottery(obj);
            let domI = document.getElementById('hesitationIntervalCheckboxDiv');
            if (domI) {
                noneDisplay(domI, !lotteryCheckbox.checked)
            }

            let domR = document.getElementById('hesitationRandomCheckboxDiv');
            if (domR) {
                noneDisplay(domR, !lotteryCheckbox.checked)
            }
        },
        closeLotteryFunc = () => {
            window.localStorage.setItem(closeLotteryChecked, closeLotteryCheckbox.checked);
        },
        hesitationIntervalFunc = () => {
            let dom = document.getElementById('hesitationRandomCheckboxDiv');
            if (hesitationIntervalCheckbox.checked) {
                hesitationIntervalInput.disabled = true;
                if (dom) {
                    hesitationRandomInput.disabled = true;
                    hesitationRandomCheckbox.checked = false;
                    hesitationRandomCheckbox.disabled = true;
                    addClassToChildren(dom, 'disabled');
                }
            }
            else {
                hesitationIntervalInput.disabled = false;
                if (dom) {
                    hesitationRandomInput.disabled = false;
                    hesitationRandomCheckbox.disabled = false;
                    removeClassFromChildren(dom, 'disabled');
                }
            }

            let obj = getLottery();
            obj.hesitationInterval = hesitationIntervalCheckbox.checked;
            obj.hesitationIntervalExpiry = hesitationIntervalInput.value;
            setLottery(obj);
        },
        hesitationRandomFunc = () => {
            let dom = document.getElementById('hesitationIntervalCheckboxDiv');
            if (hesitationRandomCheckbox.checked) {
                hesitationRandomInput.disabled = true;
                if (dom) {
                    hesitationIntervalInput.disabled = true;
                    hesitationIntervalCheckbox.checked = false;
                    hesitationIntervalCheckbox.disabled = true;
                    addClassToChildren(dom, 'disabled');
                }
            }
            else {
                hesitationRandomInput.disabled = false;
                if (dom) {
                    hesitationIntervalInput.disabled = false;
                    hesitationIntervalCheckbox.disabled = false;
                    removeClassFromChildren(dom, 'disabled');
                }
            }

            let obj = getLottery();
            obj.hesitationRandom = hesitationRandomCheckbox.checked;
            obj.hesitationRandomExpiry = hesitationRandomInput.value;
            setLottery(obj);
        },
        setPublicFunc = () => {},
        usePublicFunc = () => {
            let obj = null;
            if (usePublicCheckbox.checked) {
                obj = getGmValue(baseInfo.default, null);
            }
            else {
                obj = source;
            }
            if (obj) {
                setDmSourceInput(obj);
            }
        },
        clickLikeBtn = () => {
            let dom = document.getElementsByClassName('like-btn')[0];
            if (dom) {
                dom.click();
                // console.log(`===> 【${new Date().toLocaleString()}】点击一次点赞按钮`);
            }
        },
        clearClickLikeTimer = () => {
            if (autoLikeTimer) {
                workerTimer.clearInterval(autoLikeTimer);
                autoLikeTimer = null;
                // console.log(`===> 关闭自动点赞功能`);
            }
            if (clickLikeBtnTimer) {
                workerTimer.clearTimeout(clickLikeBtnTimer);
                clickLikeBtnTimer = null;
                // console.log(`===> 关闭超时点击点赞按钮功能`);
            }
        },
        autoLikeFunc = () => {
            let domI = document.getElementById('clickLikeIntervalCheckboxDiv');
            if (domI) {
                noneDisplay(domI, !autoLikeCheckbox.checked);
            }

            let domR = document.getElementById('clickLikeRandomCheckboxDiv');
            if (domR) {
                noneDisplay(domR, !autoLikeCheckbox.checked);
            }
            if (autoLikeCheckbox.checked) {
                clickLikeRandomCheckbox.checked && randomClickLikeFunc();
                clickLikeIntervalCheckbox.checked && intervalClickLikeFunc();
            }
            else {
                clearClickLikeTimer();
                if (domI) {
                    intervalClickLikeInput.disabled = false;
                    clickLikeIntervalCheckbox.disabled = false;
                    removeClassFromChildren(domI, 'disabled');
                }
                if (domR) {
                    clickLikeRandomCheckbox.disabled = false;
                    removeClassFromChildren(domR, 'disabled');
                }
            }
        },
        intervalClickLikeFunc = () => {
            let dom = document.getElementById('clickLikeRandomCheckboxDiv');
            if (clickLikeIntervalCheckbox.checked) {
                intervalClickLikeInput.disabled = true;
                if (dom) {
                    clickLikeRandomCheckbox.checked = false;
                    clickLikeRandomCheckbox.disabled = true;
                    addClassToChildren(dom, 'disabled');
                }
                if (autoLikeTimer) {
                    return;
                }

                // console.log(`===> 开启定时自动点赞功能【${new Date().toLocaleString()}】`);
                clickLikeBtn();
                let clickLikeInterval = 3e3;
                !isNull(intervalClickLikeInput.value) && 3 < intervalClickLikeInput.value && (clickLikeInterval = intervalClickLikeInput.value * 1e3)
                // console.log(`===> 【${new Date().toLocaleString()}】设置【${clickLikeInterval}】毫秒后点击点赞按钮`);
                autoLikeTimer = workerTimer.setInterval(() => clickLikeBtn(), clickLikeInterval);
            }
            else {
                clearClickLikeTimer();
                intervalClickLikeInput.disabled = false;
                if (dom) {
                    clickLikeRandomCheckbox.disabled = false;
                    removeClassFromChildren(dom, 'disabled');
                }
            }
        },
        randomClickLikeFunc = () => {
            let dom = document.getElementById('clickLikeIntervalCheckboxDiv');
            if (clickLikeRandomCheckbox.checked) {
                if (dom) {
                    intervalClickLikeInput.disabled = true;
                    clickLikeIntervalCheckbox.disabled = true;
                    clickLikeIntervalCheckbox.checked = false;
                    addClassToChildren(dom, 'disabled');
                }
                if (autoLikeTimer) {
                    return;
                }

                clickLikeBtn();
                // console.log(`===> 开启随机时间点点赞功能【${new Date().toLocaleString()}】`);
                autoLikeTimer = workerTimer.setInterval(() => {
                    let rdTimeout = Math.floor(Math.random() * 15000);
                    if (1000 > rdTimeout) {
                        // console.log(`===> 【${new Date().toLocaleString()}】立刻点击点赞按钮`);
                        clickLikeBtn();
                    }
                    else {
                        // console.log(`===> 【${new Date().toLocaleString()}】设置【${rdTimeout}】毫秒后点击点赞按钮`);
                        clickLikeBtnTimer = workerTimer.setTimeout(() => {
                            workerTimer.clearTimeout(clickLikeBtnTimer);
                            clickLikeBtnTimer = null;
                            clickLikeBtn();
                        }, rdTimeout);
                    }
                }, 15e3);
            }
            else {
                clearClickLikeTimer();
                if (dom) {
                    intervalClickLikeInput.disabled = false;
                    clickLikeIntervalCheckbox.disabled = false;
                    removeClassFromChildren(dom, 'disabled');
                }
            }
        },
        clickPlay = () => {
            // let dom = document.getElementsByClassName('_tip-btn_6f52f')[0];
            // if (dom) {
            //     dom.click();
            // }

            // dom = document.getElementsByClassName('_tip-text_6f52f')[0];
            // if (dom) {
            //     dom.click();
            // }
        },
        autoPlay = () => {
            let t = workerTimer.setTimeout(() => {
                workerTimer.clearTimeout(t);
                clickPlay();
                t = workerTimer.setTimeout(() => {
                    workerTimer.clearTimeout(t);
                    t = null;
                    clickPlay();
                }, 2e3);
            }, 3e3);
        },
        noSleepFunc = () => {
            if (noSleepCheckbox.checked) {
                if (!noSleepTimer) {
                    console.log('===> 开启防休眠功能');
                    noSleepTimer = workerTimer.setInterval(() => {
                        noSleepTimeouter = workerTimer.setTimeout(() => {
                            workerTimer.clearTimeout(noSleepTimeouter);
                            document.body.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
                        }, Math.random() * 3e3);
                    }, 17e3);
                }
            } else {
                console.log('===> 关闭防休眠功能');
                if (noSleepTimer) {
                    workerTimer.clearInterval(noSleepTimer);
                    noSleepTimer = null;
                }
                if (noSleepTimeouter) {
                    workerTimer.clearTimeout(noSleepTimeouter);
                    noSleepTimeouter = null;
                }
            }
        },
        biliMiniClose = () => {
            if (!miniCloseTimer) {
                let miniCloseCount = 3;
                miniCloseTimer = workerTimer.setInterval(() => {
                    let mini_close = document.getElementsByClassName('bili-mini-close')[0];
                    if (!mini_close) {
                        if (0 >= --miniCloseCount) {
                            workerTimer.clearInterval(miniCloseTimer);
                            miniCloseTimer = null;
                        }

                        return;
                    }

                    mini_close.click();
                    workerTimer.clearInterval(miniCloseTimer);
                    miniCloseTimer = null;
                }, 10e3);
            }
        },
        closeLottery = delay => {
            let btnClose = document.getElementsByClassName('close-btn bg-contain')[0];
            if (btnClose) {
                if (isNull(delay)) {
                    btnClose.click();
                } else {
                    let closeLotteryTimer = workerTimer.setTimeout(() => {
                        workerTimer.clearTimeout(closeLotteryTimer);
                        btnClose.click();
                    }, delay * 1000);
                }
            }
        },
        clickLotteryBtn = (btn, expiry) => {
            // console.log(`===> 【${new Date().toLocaleString()}】随机时间【${expiry}】`);
            let lotteryTimer = workerTimer.setTimeout(() => {
                workerTimer.clearTimeout(lotteryTimer);
                console.log(`===> 【${new Date().toLocaleString()}】犹豫期过后自动参加抽奖`);
                btn.click();
                if ('true' === window.localStorage.getItem(closeLotteryChecked)) {
                    console.log('===> 参加成功，延迟关闭弹窗');
                    closeLottery(3);
                }
            }, expiry);
        },
        lottery = btn => {
            if (!btn) {
                console.warn('===> 没有抽奖按钮DOM');
                return;
            }

            let obj = getLottery();
            if (!obj.lottery) {
                if ('true' === window.localStorage.getItem(closeLotteryChecked)) {
                    console.log('===> 不参与天选时刻抽奖，关闭弹窗');
                    closeLottery();
                }

                return;
            }
            if (obj.hesitationInterval) {
                let expiry = isNull(obj.hesitationIntervalExpiry) || 0 >= obj.hesitationIntervalExpiry ? 100e3 : obj.hesitationIntervalExpiry * 1e3;
                clickLotteryBtn(btn, expiry);
            }
            else if (obj.hesitationRandom) {
                let expiry = isNull(obj.hesitationRandomExpiry) || 0 >= obj.hesitationRandomExpiry ? 100e3 : obj.hesitationRandomExpiry * 1e3;
                expiry = Math.ceil(Math.random() * expiry);
                clickLotteryBtn(btn, expiry);
            } 
            else {
                console.log('===> 立刻自动参加抽奖');
                btn.click();
                if ('true' === window.localStorage.getItem(closeLotteryChecked)) {
                    console.log('===> 参加成功，延迟关闭弹窗');
                    closeLottery(3);
                }
            }
        },
        listPlus = nodes => {
            if (!nodes || 0 >= nodes.length) return;
            Array.prototype.forEach.call(nodes, y => {
                let aNode = y.firstChild;
                if (!aNode) return;
                let a_d2 = aNode.children[1];
                if (!a_d2) return;
                let a_d2_d2 = a_d2.children[1];
                if (!a_d2_d2) return;
                let a_d2_d2_d2 = a_d2_d2.children[1];
                if (!a_d2_d2_d2) return;
                let a_d2_d2_d2_d1 = a_d2_d2_d2.children[0];
                if (!a_d2_d2_d2_d1) return;
                aNode.title = a_d2_d2_d2_d1.textContent;
                let a_d2_d1 = a_d2.children[0];
                if (a_d2_d1) {
                    let a_d2_d1_last = a_d2_d1.lastChild;
                    if (a_d2_d1_last && a_d2_d1_last.style.display && 'none' == a_d2_d1_last.style.display) {
                        a_d2_d1_last.remove();
                    }
                }
            });
        },
        getConfig = () => {
            let c = {};
            if (baseInfo.config) {
                c = getGmValue(baseInfo.config, {});
                !isNull(c.lottery) && delete c.lottery;
                !isNull(c.signInText) && delete c.signInText;
                !isNull(c.hesitation) && delete c.hesitation;
                !isNull(c.hesitationExpiry) && delete c.hesitationExpiry;
                isNull(c.closeLottery) && (c.closeLottery = false);
            }

            return c;
        },
        checkVersion = () => {
            config = getConfig();
            if (!config || !config.moduleVersion || !divUpdateInfo) {
                return;
            }
            if (0 < compareVersion(config.moduleVersion, version)) {
                divUpdateInfo.innerHTML = `<span class="update-info-text">有新版本，刷新网页进行更新</span>`;
                let dom = document.getElementById('otherContainer');
                if (dom) {
                    dom.style.fontSize = '18px';
                    dom.style.textAlign = 'center';
                    dom.appendChild(divUpdateInfo.cloneNode(true));
                }
            }
        },
        loadData = () => {
            let obj = getGmValue(roomId, null),
                key = roomId;
            if (obj) {
                if (obj.usePublic && baseInfo.default) {
                    let ps = getGmValue(baseInfo.default, null);
                    if (ps) {
                        obj.data1.values = ps.data1 ? ps.data1.values : obj.data1.values;
                        obj.data2.values = ps.data2 ? ps.data2.values : obj.data2.values;
                        obj.data3.values = ps.data3 ? ps.data3.values : obj.data3.values;
                        obj.data4.values = ps.data4 ? ps.data4.values : obj.data4.values;
                        obj.data5.values = ps.data5 ? ps.data5.values : obj.data5.values;
                    }
                }
                if (source.version === obj.version) {
                    source = {...source, ...obj};
                }
                else if (obj.version === 2) {
                    source.data1 = obj.data1;
                    source.data2 = obj.data2;
                    source.data3 = obj.data3;
                    source.data4 = obj.data4;
                    source.data5 = obj.data5;
                    setGmValue(key, source);
                }
                else if (obj.version === 4) {
                    source = {...source, ...obj};
                    source.version = 5;
                    source.like && (delete source.like);
                    if (obj.interval) {
                        source.sendMsgInterval = obj.interval;
                        delete source.interval;
                    }
                    if (obj.random) {
                        source.sendMsgRandom = obj.random;
                        delete source.random;
                    }

                    setGmValue(key, source);
                }
                else if (obj.version === 5) {
                    source = {...source, ...obj};
                    source.version = 6;
                    if (obj.likeRandom) {
                        source.like.likeRandom = obj.likeRandom;
                        delete source.likeRandom;
                    }
                    if (obj.likeInterval) {
                        source.like.likeInterval = obj.likeInterval;
                        delete source.likeInterval;
                    }
                    if (obj.clickLikeInterval) {
                        source.like.clickLikeInterval = obj.clickLikeInterval;
                        delete source.clickLikeInterval;
                    }

                    setGmValue(key, source);
                }
                else {
                    source.data1.values = obj.data1 ? obj.data1.values : source.data1.values;
                    source.data2.values = obj.data2 ? obj.data2.values : source.data2.values;
                    source.data3.values = obj.data3 ? obj.data3.values : source.data3.values;
                    source.data4.values = obj.data4 ? obj.data4.values : source.data4.values;
                    source.data5.values = obj.data5 ? obj.data5.values : source.data5.values;
                    setGmValue(key, source);
                }
            }
            
            config = getConfig();
            setDmSourceInput(source);
            setOperationSetting();
            initData();
        },
        initSettingPanel = (div, isLogin) => {
            let settingPanel = document.getElementById('danmu-setting-panel');
            if (div && !settingPanel) {
                // console.log('===> 进行面板初始化');
                buildPanel();
                if (isLogin) {
                    let divBtn = document.getElementsByClassName('right-actions border-box')[0]; // 登录的发送按钮
                    if (divBtn) {
                        divBtn.style.alignSelf = 'flex-start';
                        divBtn.style.marginTop = '0px';
                        div.appendChild(btnStartLogin());
                        div.insertBefore(btnSetting(), divBtn);
                    }
                }
                else {
                    let btnSend = document.getElementsByClassName('bl-button--primary bl-button--small')[0];
                    if (btnSend) {
                        btnStart(btnSend);
                        let funcDiv = document.createElement('div');
                        funcDiv.style.position = 'absolute';
                        funcDiv.appendChild(dmButtonSend);
                        funcDiv.appendChild(btnSetting());
                        div.appendChild(funcDiv);
                        // bgcolor = window.getComputedStyle(btnSend).getPropertyValue('background-color');
                        // dmButtonSend.style.setProperty('background', bgcolor);
                        // dmButtonSend.style.setProperty('--color', bgcolor.replace(')', ', 0.8)'));
                    } else {
                        console.warn('===> 发送按钮丢失');
                        return false;
                    }
                }
                
                loadData();
                // console.log('===> 面板初始化完成');
            }

            return true;
        },
        main = (div, isLogin) => {
            waiters[waiters.length] = workerTimer.setInterval(() => {
                if (initSettingPanel(div, isLogin)) {
                    clearWaiters();
                } else {
                    --waitCount;
                    if (0 >= waitCount) {
                        clearWaiters();
                        console.log('===> 创建面板失败，停止初始化');
                    }
                }
            }, 1.5e3);
        },
        PluginBtn = (clazz, isLogin) => {
            let div = document.getElementsByClassName(clazz)[0];
            if (div) {
                main(div, isLogin);
            } else {
                let count = 0;
                divSendBtnTimer = workerTimer.setInterval(() => {
                    div = document.getElementsByClassName(clazz)[0];
                    if (div) {
                        workerTimer.clearInterval(divSendBtnTimer);
                        main(div, isLogin);
                    } else if (count++ >= 10) {
                        workerTimer.clearInterval(divSendBtnTimer);
                        // console.log(`===> 页面【${window.location.href}】没有定位位置`);
                    }
                }, 1e3);
            }
        },
        PluginLogout = () => PluginBtn('bottom-actions p-relative', false),
        PluginLogin = () => PluginBtn('chat-input-ctnr-new p-relative default-height', true),
        PluginLottery = () => {
            let btn = document.getElementsByClassName('particitation-btn')[0];
            if (btn) {
                lottery(btn);
            } else {
                let btnLotteryTimer = workerTimer.setTimeout(() => {
                    workerTimer.clearTimeout(btnLotteryTimer);
                    btn = document.getElementsByClassName('particitation-btn')[0];
                    if (btn) {
                        lottery(btn);
                    }
                }, 2e3);
            }
        },
        PluginListPlus = () => {
            let listTimer = workerTimer.setTimeout(() => {
                workerTimer.clearTimeout(listTimer);
                let obsConfig = {childList: true},
                    tags = ['all__card-list-ctnr', 'all__special-area-recommend-list-ctnr'];
                tags.forEach(x => {
                    let dom = document.getElementsByClassName(x)[0];
                    if (!dom) return;
                    Array.prototype.forEach.call(dom.children, y => {
                        if (/^index_/i.test(y.className)) {
                            listPlus(y.children);
                            let obs = new MutationObserver(mrs => {
                                if (!mrs || 0 >= mrs.length) return;
                                Array.prototype.forEach.call(mrs, z => listPlus(z.addedNodes));
                            });
                            obs.observe(y, obsConfig);
                        }
                    });
                });
            }, 0.5e3);
        },
        debug = () => {debugger;},
        runStart = () => {
            PluginLottery();
            PluginListPlus();
            PluginLogout();
            PluginLogin();
        };

    initCss();
    // initScript();
    window.debug = debug;
    window.runStart = runStart;
    window.arrayInfo = arrayInfo;
    window.setGmNotice = setGmNotice;
    window.setGmGetValue = setGmGetValue;
    window.setGmSetValue = setGmSetValue;
    window.setGmDelValue = setGmDelValue;
    window.setBaseInfo = setBaseInfo;
    window.checkVersion = checkVersion;
})();
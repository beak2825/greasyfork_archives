// ==UserScript==
// @name         AcFun - 爱咔号查询
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  修改0.0伪爱咔号的爱咔剪辑页面样式，添加爱咔号查询功能
// @author       dareomaewa
// @match        https://onvideo.kuaishou.com/vangogh/editor/0.0?source=ac
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acfun.cn
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.0/jquery-1.8.0.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.5/dayjs.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450753/AcFun%20-%20%E7%88%B1%E5%92%94%E5%8F%B7%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/450753/AcFun%20-%20%E7%88%B1%E5%92%94%E5%8F%B7%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var findCanceled = false;

    function waitElement(selector, times, interval, flag=true){
        var _times = times || -1,
            _interval = interval || 1,
            _selector = selector,
            _iIntervalID,
            _flag = flag;
        return new Promise(function(resolve, reject){
            _iIntervalID = setInterval(function() {
                if(!_times) {
                    clearInterval(_iIntervalID);
                    reject();
                }
                _times <= 0 || _times--;
                var _self = $(_selector);
                if( (_flag && _self.length) || (!_flag && !_self.length) ) {
                    clearInterval(_iIntervalID);
                    resolve(_iIntervalID);
                }
            }, _interval);
        });
    }

    function addChild(fatherNode, childNode, innerHtmlStr, type) {
        childNode.innerHTML = innerHtmlStr;
        if (type) {
            if (type === 'prepend') {
                fatherNode.prepend(childNode);
            }
            else {
                fatherNode.appendChild(childNode);
            }
        }else {
            fatherNode.appendChild(childNode.childNodes[0]);
        }
    }

    function replaceText(selector, newText) {
        waitElement(selector).then(function() {document.querySelector(selector).innerText = newText;});
    }

    function removeNode(selector) {
        waitElement(selector).then(function() {document.querySelector(selector).remove();});
    }

    function wait(ms) {
        return new Promise(resolve =>setTimeout(() => resolve(), ms));
    };

    function findAikaTime(btnSelector) {
        const btn = document.querySelector(btnSelector);

        const tips = document.querySelector(btnSelector + '_tips');
        tips.innerText = '';

        var aikaValue = document.querySelector(btnSelector +'_text').value;
        aikaValue = aikaValue.trim();
        if (!(/^\d+$/.test(aikaValue))) {
            tips.innerText = '请输入有效爱咔号，规则：纯数字';
            return;
        }
        $.ajax({
            url: 'https://onvideoapi.kuaishou.com/api/live/get_channel/' + aikaValue + '?source=ac',
            type: 'get',
            xhrFields: {
                withCredentials: true
            },
            success: function (res, status, xhr) {
                console.log(res);
                if (res.code === 200) {
                    tips.innerText = dayjs(res.data.startTime).format("YYYY-MM-DD HH:mm:ss");
                }
                else {
                    tips.innerText = res.code + ': ' + res.msg;
                }
            },
            error: function (res, status, xhr) {
                tips.innerText = xhr.status + ': ' + status;
            },
            beforeSend: function() {
                btn.disabled = true;
                btn.style['background-color'] = 'rgb(0 0 0 / 45%)';
                btn.innerText = '查询中…';
            },
            complete: function() {
                btn.disabled = false;
                btn.style['background-color'] = '#fd4c5d';
                btn.innerText = '查询时间';
            }
        });
    }

    window.findm3u8Url = async function findm3u8Url(aikaValue, reCount) {
        const btn = document.querySelector(`#m3u8Url_${aikaValue}`);

        btn.innerHTML = '请稍等......';
        await wait(200);

        reCount++;
        if(reCount > 10) {
            btn.innerHTML = '找不到资源';
            return;
        }
        if (!(/^\d+$/.test(aikaValue))) {
            btn.innerHTML = '请输入有效爱咔号，规则：纯数字';
            return;
        }
        $.ajax({
            url: 'https://onvideoapi.kuaishou.com/api/live/get_channel/' + aikaValue + '?source=ac',
            type: 'get',
            xhrFields: {
                withCredentials: true
            },
            success: function (res, status, xhr) {
                console.log(res);
                if (res.code === 200) {
                    btn.innerHTML = res.data.streamUrls ? res.data.streamUrls[0] : `<a onclick="window.findm3u8Url(${aikaValue}, ${reCount});">暂找不到资源，点击此处重试</a>`;
                }
                else {
                    btn.innerHTML = `<a onclick="window.findm3u8Url(${aikaValue}, ${reCount});">暂找不到资源，点击此处重试</a>`;
                }
            },
            error: function (res, status, xhr) {
                btn.innerHTML = `<a onclick="window.findm3u8Url(${aikaValue}, ${reCount});">暂找不到资源，点击此处重试</a>`;
            }
        });
    }

    window.checkStartTime = function checkStartTime() {
        findAikaTime('#check_start_time');
    }

    window.checkEndTime = function checkEndTime() {
        findAikaTime('#check_end_time');
    }

    window.aikaCut = async function aikaCut(aikaNo) {
        const btn = document.querySelector('#aikaCut_' + aikaNo);
        btn.disabled = true;
        btn.style['background-color'] = 'rgb(0 0 0 / 45%)';
        btn.innerText = '跳转中…';
        await wait(100);

        const aikaA = document.createElement('a');
                aikaA.href = 'https://onvideo.kuaishou.com/vangogh/editor/' + aikaNo + '?source=ac';
                aikaA.target = '_blank';
                aikaA.click();
                aikaA.remove();

        btn.disabled = false;
        btn.style['background-color'] = '#fd4c5d';
        btn.innerText = '爱咔剪辑';
    }

    window.cancelfindAika = async function cancelfindAika() {
        console.log('取消查询');
        if(confirm(`确定要取消查询吗？`)) {
            findCanceled = true;
        }
    }

    window.findAika = async function findAika() {
        findCanceled = false;
        const tips = document.querySelector('#find_aika_tips');
        tips.innerText = '';
        await wait(100);
        var startAikaValue = document.querySelector('#check_start_time_text').value;
        startAikaValue = startAikaValue.trim();
        if (!(/^\d+$/.test(startAikaValue))) {
            tips.innerText = '请在“开始爱咔号”中输入有效爱咔号，规则：纯数字';
            return;
        }

        var endAikaValue = document.querySelector('#check_end_time_text').value;
        endAikaValue = endAikaValue.trim();
        const hasEndAika = endAikaValue && endAikaValue.length > 0;
        if(hasEndAika) {
            if (!(/^\d+$/.test(endAikaValue))) {
                tips.innerText = '请在“结束爱咔号”中输入有效爱咔号，规则：纯数字。或者清空';
                return;
            }
            if (startAikaValue > endAikaValue) {
                tips.innerText = '“开始爱咔号”不能大于“结束爱咔号”';
                return;
            }
            if (parseInt(endAikaValue) - parseInt(startAikaValue) > 200) {
                tips.innerText = ' 开始~结束 区间不能大于200';
                return;
            }
            endAikaValue = parseInt(endAikaValue);
        }
        else {
            const range = document.querySelector('#range').value;
            endAikaValue = parseInt(startAikaValue) + parseInt(range) - 1;
        }

        var uidTextValue = document.querySelector('#uid_text').value;
        uidTextValue = uidTextValue.trim();
        const onlyOneUid = /^\d+$/.test(uidTextValue);
        const filterUids = [];
        if (onlyOneUid) {
            filterUids.push(uidTextValue);
        }
        else if(uidTextValue && uidTextValue.length > 0) {
            uidTextValue = uidTextValue.replaceAll("，", ",").replaceAll(" ", ",");
            const uids = uidTextValue.split(',');
            uids.forEach(uid => {
                uid = uid.trim();
                if (/^\d+$/.test(uid) && !filterUids.some((fuid) => fuid == uid)) {
                    filterUids.push(uid);
                }
            });
        }
        console.log(filterUids);
        console.log(`startAikaValue: ${startAikaValue}, endAikaValue: ${endAikaValue}`);

        const onlyOneAikaNo = endAikaValue == startAikaValue;
        const hasFilterUids = filterUids.length > 0;
        if(!hasFilterUids) {
            tips.innerText = '查找中… (本次查找无过滤uid，原因：uid为空或者不符合规则)';
        }
        else {
            tips.innerText = '查找中…';
        }

        const findResults =document.querySelector('#findResults');
        findResults.innerText = '';
        const findAikaBtn =document.querySelector('#findAika');
        findAikaBtn.style['background-color'] = '#e6e6e6';
        findAikaBtn.style.color = '#666666';
        findAikaBtn.onclick = window.cancelfindAika;
        findAikaBtn.innerText = '取消查询'

        for (var i = startAikaValue,count = 1; i <= endAikaValue; i++,count++) {
            if (findCanceled) {
                tips.innerText = '查询已取消';
                findAikaBtn.style['background-color'] = '#fd4c5d';
                findAikaBtn.style.color = '#fff';
                findAikaBtn.onclick = window.findAika;
                findAikaBtn.innerText = '确认查询'
                break;
            }
            await wait(100);
            $.ajax({
                async:false,
                url: 'https://onvideoapi.kuaishou.com/api/live/get_channel/' + i + '?source=ac',
                type: 'get',
                xhrFields: {
                    withCredentials: true
                },
                success: function (res, status, xhr) {
                    console.log(res);
                    if (res.code === 200) {
                        if (hasFilterUids) {
                            if (!filterUids.some((fuid) => fuid == res.data.ksUserId)) {
                                return;
                            }
                        }
                        const findResult = `
                        <div style="padding: 5px;font-size: 12px;border: 1px solid #e5e5e5;line-height: 20px;vertical-align: top;color: #999;box-sizing: border-box;margin-top: 5px;position: relative;">
                            <p>状态：${res.code + ' - ' + res.msg}</p>
                            <p>爱咔号：${res.data.streamId}</p>
                            <p>uid：${res.data.ksUserId}</p>
                            <p>主播：${res.data.nickname}</p>
                            <p>开播时间：${dayjs(res.data.startTime).format("YYYY-MM-DD HH:mm:ss")}</p>
                            <p>结束时间：${res.data.endTime ? dayjs(res.data.endTime).format("YYYY-MM-DD HH:mm:ss") : '直播中'}</p>
                            <p>标题：${res.data.name}</p>
                            <p><span style="color: rgb(38, 185, 99);">m3u8地址</span>：<br/><span style="color: cornflowerblue;" id="m3u8Url_${res.data.streamId}">${res.data.streamUrls ? res.data.streamUrls[0] : `<a onclick="window.findm3u8Url(${res.data.streamId}, 0);">暂找不到资源，点击此处重试</a>`}</span></p>
                            <span style="
                                position: absolute;
                                top: 0px;
                                right: 0px;
                                padding: 0 10px;
                                color: rgb(38, 185, 99);">${count}</span>
                            <div style="bottom: 0px;padding: 10px 5px;">
                                <button id="aikaCut_${res.data.streamId}" onclick="window.aikaCut(${res.data.streamId});" style="
                                    display: inline-block;
                                    background-color: #fd4c5d;
                                    width: 74px;
                                    height: 26px;
                                    text-indent: 4px;
                                    text-align: left;
                                    text-indent: 10px;
                                    color: #fff;
                                    font-size: 14px;
                                    line-height: 26px;
                                    border-radius: 4px;">爱咔剪辑
                                </button>
                            </div>
                        </div>`;
                        addChild(findResults, document.createElement("div"), findResult, 'prepend');
                    }
                    else {
                        if(onlyOneAikaNo) {
                            const findResult = `
                            <div style="padding: 5px;font-size: 12px;border: 1px solid #e5e5e5;line-height: 20px;vertical-align: top;color: #999;box-sizing: border-box;margin-top: 5px;position: relative;">
                                <p>状态：${res.code + ' - ' + res.msg}</p>
                                <p>爱咔号：${i}</p>
                            </div>`;
                            addChild(findResults, document.createElement("div"), findResult, 'prepend');
                        }
                    }
                }
            });
            if (i == endAikaValue) {
                tips.innerText = '查找结束';
                findAikaBtn.style['background-color'] = '#fd4c5d';
                findAikaBtn.style.color = '#fff';
                findAikaBtn.onclick = window.findAika;
                findAikaBtn.innerText = '确认查询'
            }
        }
    }

    replaceText('title', '爱咔号查询');
    removeNode('.ant-message');

    waitElement('#root').then(function() {
        document.querySelector('#root').remove();
        waitElement('body').then(function() {
            const htmlStr = `
<div style="
        position: absolute;
        z-index: 9999;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
        width: 50%;
        height: 85%;
        background-color: white;
        padding: 20px 0 40px 0;
        overflow: auto;
        ">
    <div style="
        position: relative;
        z-index: 9999;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        ">
        <h1 style="font-size: 20px;">爱咔号查询</h1>
    </div>
    <div style="
        position: relative;
        z-index: 9999;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        padding: 10px 0 0 0;
        ">
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <span style="
                padding: 10px 0 0 0;">
                开始爱咔号
                <span style="
                    padding: 0 0 0 5px;
                    color: red;">
                    *
                </span>
            </span>
        </div>
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <div style="padding: 5px 0 0 0;">
                <input type="text" placeholder="开始爱咔号" value="" autocomplete="off" id="check_start_time_text" style="
                    width: 100%;
                    padding: 8px 30px 8px 10px;
                    height: 36px;
                    font-size: 12px;
                    border: 1px solid #e5e5e5;
                    line-height: 14px;
                    vertical-align: top;
                    color: #999;
                    box-sizing: border-box;">
            </div>
        </div>
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <div>
                <div style="padding: 10px 0 0 0;position: relative;">
                    <button id="check_start_time" onclick="window.checkStartTime();" style="
                        display: inline-block;
                        background-color: #fd4c5d;
                        width: 74px;
                        height: 26px;
                        text-indent: 4px;
                        text-align: left;
                        text-indent: 10px;
                        color: #fff;
                        font-size: 14px;
                        line-height: 26px;
                        border-radius: 4px;">查询时间
                    </button>
                    <span id="check_start_time_tips" style="
                        padding-left: 10px;
                        color: rgb(38, 185, 99);">
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div style="
        position: relative;
        z-index: 9999;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        padding: 10px 0 0 0;
        ">
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <span style="
                padding: 10px 0 0 0;">
                结束爱咔号 - 开始~结束 不能超过最大查询范围200
            </span>
        </div>
        <div style="
        position: relative;
        z-index: 9999;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        width: 80%;
        ">
            <div style="padding: 5px 0 0 0;">
                <input type="text" placeholder="结束爱咔号" value="" autocomplete="off" id="check_end_time_text" style="
                width: 100%;
                padding: 8px 30px 8px 10px;
                height: 36px;
                font-size: 12px;
                border: 1px solid #e5e5e5;
                line-height: 14px;
                vertical-align: top;
                color: #999;
                box-sizing: border-box;">
            </div>
        </div>
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <div>
                <div style="padding: 10px 0 0 0;position: relative;">
                    <button id="check_end_time" onclick="window.checkEndTime();" style="
                        display: inline-block;
                        background-color: #fd4c5d;
                        width: 74px;
                        height: 26px;
                        text-indent: 4px;
                        text-align: left;
                        text-indent: 10px;
                        color: #fff;
                        font-size: 14px;
                        line-height: 26px;
                        border-radius: 4px;">查询时间
                    </button>
                    <span id="check_end_time_tips" style="
                        padding-left: 10px;
                        color: rgb(38, 185, 99);">
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div style="
        position: relative;
        z-index: 9999;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        padding: 10px 0 0 0;
        ">
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <span style="
            padding: 10px 0 0 0;">
                查询范围 - 1~200。如果有填“结束爱咔号”，那么查询范围为 开始~结束 的区间
            </span>
        </div>
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <div style="padding: 5px 0 0 0;">
                <input type="number" placeholder="查询范围大小，默认200，最大200" value="200" autocomplete="off" id="range" style="
                    width: 100%;
                    padding: 8px 30px 8px 10px;
                    height: 36px;
                    font-size: 12px;
                    border: 1px solid #e5e5e5;
                    line-height: 14px;
                    vertical-align: top;
                    color: #999;
                    box-sizing: border-box;" oninput="if(value>200)value=200;if(value.length>3)value=value.slice(0,3);if(value<1)value=1">
            </div>
        </div>
    </div>
    <div style="
        position: relative;
        z-index: 9999;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        padding: 10px 0 0 0;
        ">
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <span style="
            padding: 10px 0 0 0;">
                查询uid - 可以查询单个或多个，多个uid通过“,”(英文逗号) 或者 “ ”(空格) 来分隔
            </span>
        </div>
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <div style="padding: 5px 0 0 0;">
                <input type="text" placeholder="123 或者 123,456,789" value="" autocomplete="off" id="uid_text" style="
                    width: 100%;
                    padding: 8px 30px 8px 10px;
                    height: 36px;
                    font-size: 12px;
                    border: 1px solid #e5e5e5;
                    line-height: 14px;
                    vertical-align: top;
                    color: #999;
                    box-sizing: border-box;">
            </div>
        </div>
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <div>
                <div style="padding: 10px 0 0 0;position: relative;">
                    <button id="findAika" onclick="window.findAika();" style="
                        display: inline-block;
                        background-color: #fd4c5d;
                        width: 74px;
                        height: 26px;
                        text-indent: 4px;
                        text-align: left;
                        text-indent: 10px;
                        color: #fff;
                        font-size: 14px;
                        line-height: 26px;
                        border-radius: 4px;">确认查询</button>
                    <span id="find_aika_tips" style="
                        padding-left: 10px;
                        color: rgb(38, 185, 99);">
                    </span>
                </div>
            </div>
        </div>
    </div>
    <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            transform: translateX(-50%);
            width: 80%;
            padding: 10px 0 0 0;
        ">
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <span style="
        padding: 10px 0 5px 0;">
                查询结果
            </span>
        </div>
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <span style="
        padding: 10px 0 5px 0;font-size: 12px;color: rgb(253, 76, 93);">
                提示：
            </span>
        </div>
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <span style="
        padding: 10px 0 5px 0;font-size: 12px;">
                <a href="https://github.com/nilaoda/N_m3u8DL-CLI/releases" target="_blank"><span style="color: rgb(38, 185, 99);">【N_m3u8DL-CLI】</span>视频下载工具地址</a>
            </span>
        </div>
        <div style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <span style="
        padding: 10px 0 5px 0;font-size: 12px;">
                <a href="https://nilaoda.github.io/N_m3u8DL-CLI/SimpleGUI" target="_blank"><span style="color: rgb(38, 185, 99);">【N_m3u8DL-CLI】</span>视频下载工具使用说明（直播中时不要使用，会导致视频不完整）</a>
            </span>
        </div>
        <div  id="findResults" style="
            position: relative;
            z-index: 9999;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            width: 80%;
            ">
            <div style="padding: 5px;font-size: 12px;border: 1px solid #e5e5e5;line-height: 20px;vertical-align: top;color: #999;box-sizing: border-box;margin-top: 5px;">
                <p>状态：</p>
                <p>爱咔号：</p>
                <p>uid：</p>
                <p>主播：</p>
                <p>开播时间：</p>
                <p>结束时间：</p>
                <p>标题：</p>
                <p>m3u8地址：</p>
            </div>
        </div>
    </div>
</div>
        `;
            const body =document.querySelector('body');
            body.style=`
                background: linear-gradient(0deg,#fff 0,hsla(0,0%,100%,0) 200px,hsla(0,0%,100%,0) 200.1px,hsla(0,0%,100%,0)),url(//static.yximgs.com/udata/pkg/acfun-fe/bg.png);
                background-position: 50%;
                background-size: cover;`
            addChild(body, document.createElement("div"), htmlStr, 'div');
        });
    });

})();
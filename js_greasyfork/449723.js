// ==UserScript==
// @name         AcFun - 我的关注直播间
// @namespace    http://tampermonkey.net/
// @version      1.2.5
// @description  修改uid: 0.0伪用户的直播间页面样式，只展示所关注的直播间列表
// @author       dareomaewa
// @match        https://live.acfun.cn/live/0.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acfun.cn
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.0/jquery-1.8.0.min.js
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449723/AcFun%20-%20%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8%E7%9B%B4%E6%92%AD%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/449723/AcFun%20-%20%E6%88%91%E7%9A%84%E5%85%B3%E6%B3%A8%E7%9B%B4%E6%92%AD%E9%97%B4.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var hasPlayer,hasRecmdLive;
    new MutationObserver(function(mutations) {
        // console.log(mutations);

        if (document.querySelector('.player-outer-wrapper') && !hasPlayer) {
            hasPlayer = true;
            document.querySelector('.player-outer-wrapper').style.display = 'none';
        }

        if (document.querySelector('.recmd-live-container') && !hasRecmdLive) {
            hasRecmdLive = true;
            document.querySelector('.recmd-live-container').style.display = 'none';
            if (document.querySelector('.main')) {
                const main =document.querySelector('.main');
                const loading = document.createElement("div");
                loading.innerHTML = '<div class="loading" style="background-color: white;position: absolute;top: 0%;width: 100%;height: 100%;z-index: 9999;"><div style="position: relative;width: 10%;top: 10%;left: 45%;"><marquee behavior="scroll" scrollamount="15" onmouseover="this.stop()" onmouseout="this.start()" style="color:#ef8a56;white-space:nowrap;width: 100%;"><img src="https://cdn.aixifan.com/acfun-pc/2.8.97/img/page/articlechannel/loading.gif"></marquee><p style="text-align: center;">Loading...</p><br><p style="text-align: center;">如果加载太久，请刷新页面</p></div></div>';
                main.appendChild(loading.childNodes[0]);
            }
        }


    }).observe(document, {childList: true, subtree: true});

})();

window.onload = function() {
    console.log('window.onload=');

    const config = {
        maxLoveUpsSize: 50,
        maxLiveSize: 1001,
        love: {
            // true: 打开love样式 false: 关闭
            open: true,
            ups: [],
        },
        egg: {
            // 彩蛋开关 true: 打开 false: 关闭
            open: true,
            type: 0,
            upsInfo: {
                416752: {
                    uid: 416752,
                    coverUrls: [
                        'https://imgs.aixifan.com/newUpload/776907_30a99a69987d4995b43df39320491711.jpg',
                    ],
                },
                36626547: {
                    uid: 36626547,
                    coverUrls: [
                        'https://imgs.aixifan.com/newUpload/776907_3151ca8705334d88ba6cdc4834573ec1.jpg',
                    ],
                },
                23682490: {
                    uid: 23682490,
                    coverUrls: [
                        'https://imgs.aixifan.com/newUpload/776907_b8fbdbdd47be447895464b5555225679.jpg',
                    ],
                },
                1345673: {
                    uid: 1345673,
                    coverUrls: [
                        'https://imgs.aixifan.com/newUpload/776907_5d8820b3b8ca42d38f17240c48102752.jpg',
                    ],
                },
                179922: {
                    uid: 179922,
                    coverUrls: [
                        'https://imgs.aixifan.com/newUpload/776907_75e7e36b3e6445baa02f1c8618b4359c.jpg',
                    ],
                },
                30561040: {
                    uid: 30561040,
                    coverUrls: [
                        'https://imgs.aixifan.com/newUpload/776907_61f0f008b94c4d579f789c06e5d2ee4f.jpg',
                    ],
                },
                40740702: {
                    uid: 40740702,
                    coverUrls: [
                        'https://imgs.aixifan.com/newUpload/776907_25a67815bb984f5ea853395af9c8c237.jpg',
                    ],
                },
                12553939: {
                    uid: 12553939,
                    coverUrls: [
                        'https://imgs.aixifan.com/newUpload/776907_b8ac4f947626494cbb96356794d39e3c.jpg',
                    ],
                },
            },
        },
    };

    var lsLoveUps = window.localStorage.getItem('ls_love_ups');
    if (!lsLoveUps) {
        window.localStorage.setItem('ls_love_ups', JSON.stringify({}));
        lsLoveUps = window.localStorage.getItem('ls_love_ups');
    }
    if (typeof(lsLoveUps) === 'string') {
        lsLoveUps = JSON.parse(lsLoveUps);
    }
    config.love.ups = lsLoveUps;
    console.log(`lsLoveUps: ${lsLoveUps}`);
    var loveUpsUids = Object.keys(lsLoveUps) ?? [];
    console.log(`loveUpsUids: ${loveUpsUids}`);

    var lsLoveOpen = window.localStorage.getItem('ls_love_open');
    if (typeof(lsLoveOpen) !== 'boolean' && !lsLoveOpen) {
        console.log(`lsLoveOpen0: ${lsLoveOpen}`);
        window.localStorage.setItem('ls_love_open', config.love.open);
        lsLoveOpen = window.localStorage.getItem('ls_love_open');
    }
    lsLoveOpen = String(lsLoveOpen)
    lsLoveOpen = /^true$/.test(lsLoveOpen)
    console.log(`lsLoveOpen: ${lsLoveOpen}`);

    function StringBuffer() {
        this.__strings__ = [];
    };
    StringBuffer.prototype.Append = function (str) {
        this.__strings__.push(str);
        return this;
    };
    StringBuffer.prototype.ToString = function () {
        return this.__strings__.join('');
    };

    function createLiveListItemHtmlStr(data) {
        var htmlStr = new StringBuffer();
        htmlStr.Append('<div class="live-list-item list-item item">');
        htmlStr.Append(' <span style="position: relative;">');
        htmlStr.Append(' <div class="live-check-cover">');
        htmlStr.Append(' <div class="live-check-cover-desc"><a href="' + data.coverUrls[1]+ '" target="_blank" title="查看封面" style="color: #f3fdff">查看封面</a></div>');
        htmlStr.Append('</div>');
        htmlStr.Append(' <a href="/live/' + data.href + '" target="_blank" class="list-content-top">');
        htmlStr.Append(' <div class="list-content-data">');
        htmlStr.Append(' <span class="likeCount icon-like icon-ks">' + data.likeCount+ '');
        htmlStr.Append('</span>');
        htmlStr.Append(' <span class="onlineCount icon-view">' + data.onlineCount+ '');
        htmlStr.Append('</span>');
        htmlStr.Append('</div>');

        if (config.egg.open && Object.keys(config.egg.upsInfo).some(e => e === data.user.id)) {
            const eggCoverUrl = config.egg.upsInfo[data.user.id].coverUrls[config.egg.type];
            htmlStr.Append(' <div class="list-content-cover">');
            htmlStr.Append(' <img id="cover_' + data.user.id + '" data-src="' + data.coverUrls[0]+ '" src="' + data.coverUrls[0] + '" lazy="loaded"  />');
            htmlStr.Append(' <img id="cover_' + data.user.id + '_love" data-src="' + eggCoverUrl + '" src="' + eggCoverUrl + '" lazy="loaded" style="display: none;"  />');
            htmlStr.Append('</div>');
            htmlStr.Append(' <div class="danmaku-mask" style="background: rgb(0 0 0 / 0%);" onmouseover="danmakuMaskTrigger(\'#cover_' + data.user.id + '_love\', \'#cover_' + data.user.id + '\');" onmouseout="danmakuMaskTrigger(\'#cover_' + data.user.id + '\', \'#cover_' + data.user.id + '_love\');">');
        }else {
            htmlStr.Append(' <div class="list-content-cover">');
            htmlStr.Append(' <img id="cover_' + data.user.id + '" data-src="' + data.coverUrls[0]+ '" src="' + data.coverUrls[0] + '" lazy="loaded"  />');
            htmlStr.Append('</div>');
            htmlStr.Append(' <div class="danmaku-mask" style="background: rgb(0 0 0 / 28%);">');
        }

        htmlStr.Append(' <div class="space-danmaku"></div>');
        htmlStr.Append(' <span class="video-time"></span>');
        htmlStr.Append('</div>');
        htmlStr.Append(' <div class="live-status">');
        htmlStr.Append(' <div class="live-status-desc">直播中</div>');
        htmlStr.Append(' <div class="living-icon">');
        htmlStr.Append(' <div class="live-animate" style="width: 12px; height: 12px;">');
        htmlStr.Append(' <img width="100%" height="100%" src="//ali-imgs.acfun.cn/kos/nlav10360/static/img/liveing.54ae1410.gif" />');
        htmlStr.Append('</div>');
        htmlStr.Append('</div>');
        htmlStr.Append('</div>');
        htmlStr.Append('</a>');
        htmlStr.Append('</span>');
        htmlStr.Append(' <div class="up-info">');
        htmlStr.Append(' <a href="/live/' + data.href + '" target="_blank" class="up-info-left">');
        htmlStr.Append(' <img class="up-avatar" data-src="' + data.user.headUrl + '" src="' + data.user.headUrl + '" lazy="loaded" />');
        htmlStr.Append('</a>');
        htmlStr.Append(' <div class="up-info-right">');
        htmlStr.Append(' <h1 class="list-content-title">');
        htmlStr.Append(' <a href="/live/' + data.href + '" target="_blank" title="' + data.title + '">' + data.title + '</a>');
        htmlStr.Append('</h1>');
        htmlStr.Append(' <a href="//www.acfun.cn/u/' + data.user.id + '" target="_blank" title="' + data.user.name + '" data-uid="' + data.user.id + '" class="list-content-uplink">UP: ' + data.user.name + '</a>');
        htmlStr.Append('</div>');
        htmlStr.Append('</div>');
        htmlStr.Append('</div>');
        return htmlStr.ToString();
    }

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

    function addNode(forwardNode, afterendNode, innerHtmlStr, type) {
        afterendNode.innerHTML = innerHtmlStr;
        if (type) {
            forwardNode.insertAdjacentElement("afterend", afterendNode);
        }else {
            forwardNode.insertAdjacentElement("afterend", afterendNode.childNodes[0]);
        }
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

    function addChildDiv(fatherNode, innerHtmlStr) {
        addChild(fatherNode, document.createElement("div"), innerHtmlStr);
    }

    function addChildScript(fatherNode, scriptStr) {
        addChild(fatherNode, document.createElement("script"), scriptStr, 'script');
    }

    function addChildStyle(fatherNode, styleStr) {
        addChild(fatherNode, document.createElement("style"), styleStr, 'style');
    }

    function initLiveContainer(liveContainerSelector, liveList) {
        waitElement(liveContainerSelector).then(function() {
            var othersLiveContainer = document.querySelector(liveContainerSelector);
            //console.log(liveList);
            liveList.forEach(data => {
                addChildDiv(othersLiveContainer, createLiveListItemHtmlStr(data));
            });
        });
    }

    function replaceText(selector, newText) {
        waitElement(selector).then(function() {document.querySelector(selector).innerText = newText;});
    }

    function removeNode(selector) {
        waitElement(selector).then(function() {document.querySelector(selector).style.display = 'none';});
    }

    function confirmMoreLive(selector) {
        const msg = '确定跳转AC直播大屏幕吗？你将可能进入未曾关注过的直播间。';
        waitElement(selector).then(function() {
            const moreLiveNodes = document.querySelectorAll(selector);
            moreLiveNodes.forEach(node => {
                node.setAttribute('href', 'javascript:if(confirm("' + msg + '")) window.open("/");');
                node.removeAttribute('target');
            });
        });
    }

    replaceText('title', '我的关注直播间');
    //replaceText('.recmd-live-title', '我的关注直播间');

    //removeNode('.player-outer-wrapper');
    //removeNode('.recmd-live-container');

    confirmMoreLive('.more-live');
    confirmMoreLive('.live-page-title');
    confirmMoreLive('a[href="/"].live');

    $.ajax({
        url: '/api/channel/list?count=' + config.maxLiveSize + '&pcursor=&filters=[%7B%22filterType%22:3,+%22filterId%22:0%7D]',
        type: 'get',
        success: function (res) {
            //console.log(res);

            const liveList = res.liveList;

            replaceText('.recmd-live-title', '我的关注直播间 (' + liveList.length + ')');

            let loveUps = Object.keys(config.love.ups) ?? [];

            waitElement('.recommend-live-wrapper').then(function() {
                const recommendLiveWrapperNode =document.querySelector('.recommend-live-wrapper');
                addChildDiv(recommendLiveWrapperNode,
                         '<div id="loveLiveContainer" class="recmd-live-container" style="box-sizing: border-box;box-shadow: 0px 2px 0px 0px rgb(254 166 174);"></div>');

                addChildDiv(recommendLiveWrapperNode,
                         '<div id="othersLiveContainer" class="recmd-live-container" style="padding-top: 10px;"></div>');
            });

            waitElement('head').then(function() {
                const headNode = document.querySelector('head');
                addChildStyle(headNode,
                              '.live-check-cover {color: #fff;position: absolute;right: 4px;bottom: 5px;border-radius: 3px;text-align: center;width: auto;height: 19px;z-index: 996;} .live-check-cover-desc {font-size: 12px;line-height: 17px;height: 18px;display: inline-block;vertical-align: top;width: 58px;}');

                if (lsLoveOpen) {
                    addChildStyle(headNode,
                                  '#loveLiveContainer .live-list-item .list-content-top .list-content-data {background: linear-gradient(180deg,transparent,rgb(254 129 141 / 83%));} .list-container {min-height: 500px;}');
                }

                if (config.egg.open) {
                    addChildScript(headNode,
                                   'function danmakuMaskTrigger(selector0, selector1){document.querySelector(selector0).setAttribute("style", "display: block;");document.querySelector(selector1).setAttribute("style", "display: none;");}');
                }
            });

            if (!lsLoveOpen || loveUps.length ===0) {
                initLiveContainer('#othersLiveContainer', liveList);
            }else {
                const loveLiveList = liveList.filter((e) => loveUps.some((uid) => uid == e.authorId));
                initLiveContainer('#loveLiveContainer', loveLiveList);

                const othersLiveList = liveList.filter((e) => !loveUps.some((uid) => uid == e.authorId));
                initLiveContainer('#othersLiveContainer', othersLiveList);
            }

            removeNode('.loading');

// var _interval = 200;
// var _times = 50;
// var _iIntervalID;
// _iIntervalID = setInterval(function() {
//     if(!_times) {
//         clearInterval(_iIntervalID);
//     }
//     removeNode('.loading');
//     _times <= 0 || _times--;
// }, _interval);
        }
    });

    window.aikaCut = function aikaCut() {
        const btn = document.querySelector('#aika-cut');
        $.ajax({
            url: 'https://id.app.acfun.cn/rest/web/token/get',
            type: 'post',
            data: {'sid': 'acfun.midground.api'},
            xhrFields: {
                withCredentials: true
            },
            success: function (res) {
                //console.log(res);
                const aikaText = document.getElementById('aika-text');
                const aikaTestValue = aikaText.value.trim();
                var aikaCutUrl;
                if (/https:\/\/onvideo.kuaishou.com\/vangogh\/editor\/(\d+)\?source=ac/g.test(aikaTestValue)) {
                    aikaCutUrl = 'https://onvideoapi.kuaishou.com/rest/infra/sts?sid=acfun.midground.api&authToken=' + res['acfun.midground.api.at'] + '&followUrl=' + encodeURI(aikaTestValue);
                }
                else if (/^\d+$/.test(aikaTestValue)) {
                    aikaCutUrl = 'https://onvideoapi.kuaishou.com/rest/infra/sts?sid=acfun.midground.api&authToken=' + res['acfun.midground.api.at'] + '&followUrl=' + encodeURI('https://onvideo.kuaishou.com/vangogh/editor/' + aikaTestValue + '?source=ac');
                }
                else {
                    aikaCutUrl = '#';
                }
                console.log(aikaCutUrl);

                const aikaA = document.createElement('a');
                aikaA.href = aikaCutUrl;
                aikaA.target = '_blank';
                aikaA.click();
                aikaA.remove();
            },
            beforeSend: function() {
                btn.disabled = true;
                btn.style['background-color'] = 'rgb(0 0 0 / 45%)';
                btn.innerText = '跳转中…';
            },
            complete: function() {
                btn.disabled = false;
                btn.style['background-color'] = '#fd4c5d';
                btn.innerText = '爱咔剪辑';
            }
        });
    }

    window.checkAika = function checkAika() {
        const btn = document.querySelector('#aika-find');
        $.ajax({
            url: 'https://id.app.acfun.cn/rest/web/token/get',
            type: 'post',
            data: {'sid': 'acfun.midground.api'},
            xhrFields: {
                withCredentials: true
            },
            success: function (res) {
                const aikaA = document.createElement('a');
                aikaA.href = 'https://onvideoapi.kuaishou.com/rest/infra/sts?sid=acfun.midground.api&authToken=' + res['acfun.midground.api.at'] + '&followUrl=' + encodeURI('https://onvideo.kuaishou.com/vangogh/editor/0.0?source=ac');
                aikaA.target = '_blank';
                aikaA.click();
                aikaA.remove();
            },
            beforeSend: function() {
                btn.disabled = true;
                btn.innerText = '跳转中…';
            },
            complete: function() {
                btn.disabled = false;
                btn.innerText = '爱咔号查询>';
            }
        });
    }

    window.triggerLove = function triggerLove() {
        const loveStyle = document.querySelector('#loveStyle');
        const loveStyleChecked = loveStyle.checked;
        if(confirm(`即将刷新页面，确定${loveStyleChecked ? '打开' : '关闭'}喜爱模式吗？`)) {
            window.localStorage.setItem('ls_love_open', loveStyleChecked);;
            window.location.reload();
        }else {
            loveStyle.checked = !loveStyleChecked;
        }
    }

    window.configTrigger = function configTrigger() {
        const configContainerNode = document.querySelector('#configContainer');
        const configTriggerNode = document.querySelector('#configTrigger');
        if(configContainerNode.style.display === 'none') {
            configContainerNode.style.display = 'block';
            configTriggerNode.innerText = '收起配置';

            const loveUpshtmlStringBuffer = new StringBuffer();
            const copyAllUidTextStringBuffer = new StringBuffer();
            if (loveUpsUids.length > 0) {
                loveUpsUids.forEach(uid => {
                    loveUpshtmlStringBuffer.Append(`<a href="//www.acfun.cn/u/${uid}" target="_blank" title="${uid}" class="list-content-uplink" style="text-decoration: underline;" >${lsLoveUps[uid]}</a>&nbsp;&nbsp;`)
                    copyAllUidTextStringBuffer.Append(`${uid},`);
                });
            }
            else {
                loveUpshtmlStringBuffer.Append('当前暂无喜爱主播的信息，请进行添加');
            }

            const loveUpsContainer =document.querySelector('#love_ups_container');
            const currentLoveUpsHtmlStr = `
            <div id="current_love_ups" style="position: relative;">
                <div
                    onmouseover="(function(){document.querySelector('#copyAllUids').style.display = 'inline-block';})()"
                    onmouseout="(function(){document.querySelector('#copyAllUids').style.display = 'none';})()"
                    style="display: inline-block;cursor: default;position: relative;padding: 5px;color: #fd4c5d !important;font-family: 'Font Awesome 5 Regular';font-size: 14px;">
                        当前喜爱主播 (${loveUpsUids.length})
                        <span id="copyAllUids" style="display: none;" >
                            <button onclick="(function(){
                                var text = document.createElement('textarea');
                                text.style.opacity = '0';
                                text.value = '${copyAllUidTextStringBuffer.ToString()}';
                                document.body.appendChild(text);
                                text.select();
                                document.execCommand('copy');
                                document.body.removeChild(text);
                                alert('复制成功');
                            })()"
                            style="font-size: 12px;line-height: 12px;color: #409bef;border-width: 0px;background-color: rgb(255 255 255 / 0%);text-decoration: underline;cursor: pointer;">复制全部uid</button>
                        <span>
                </div>
                <marquee behavior="scroll" scrollamount="5" onmouseover="this.stop()" onmouseout="this.start()"  style="color:#ef8a56;white-space:nowrap;width: 100%;">
                    ${loveUpshtmlStringBuffer.ToString()}
                </marquee>
            </div>`;
            addChild(loveUpsContainer, document.createElement("div"), currentLoveUpsHtmlStr, 'div');

        }else {
            configContainerNode.style.display = 'none';
            configTriggerNode.innerText = '展开配置';

            const currentLoveUps =document.querySelector('#current_love_ups');
            currentLoveUps.parentNode.remove();
        }
    }

    function wait(ms) {
        return new Promise(resolve =>setTimeout(() => resolve(), ms));
    };

    window.addLoveUps = async function addLoveUps() {
        const tips = document.querySelector('#add_uid_tips');
        tips.innerText = '进行中…';
        const delTips = document.querySelector('#del_uid_tips');
        delTips.innerText = '';

        const btn = document.querySelector('#loveUid-add');
        btn.disabled = true;
        btn.style['background-color'] = 'rgb(0 0 0 / 45%)';
        await wait(100);

        if (loveUpsUids.length < config.maxLoveUpsSize) {
            var upUids = document.querySelector('#up_uids').value;
            upUids = upUids.trim();
            const onlyOneUid = /^\d+$/.test(upUids);
            if (onlyOneUid && !loveUpsUids.some((fuid) => fuid == upUids)) {
                $.ajax({
                    async:false,
                    url: 'https://live.acfun.cn/rest/pc-direct/user/userInfo?userId=' + upUids,
                    type: 'get',
                    xhrFields: {
                        withCredentials: true
                    },
                    success: function (res) {
                        if (res.result === 0 && res.profile && res.profile.name) {
                            lsLoveUps[Number(upUids)] = res.profile.name;
                            console.log(lsLoveUps);
                            window.localStorage.setItem('ls_love_ups', JSON.stringify(lsLoveUps));
                            loveUpsUids = Object.keys(lsLoveUps) ?? [];
                            tips.innerText = '添加成功，刷新页面生效';
                        }
                        else {
                            tips.innerText = '添加失败，获取信息失败';
                        }
                    },
                    error: function() {
                        tips.innerText = '添加失败，获取信息失败';
                    }
                });
            }
            else if(upUids && upUids.length > 0) {
                upUids = upUids.replaceAll("，", ",").replaceAll(" ", ",");
                const uids = upUids.split(',');
                if ((uids.length + loveUpsUids.length) <= config.maxLoveUpsSize) {
                    uids.forEach(uid => {
                        uid = uid.trim();
                        if (/^\d+$/.test(uid) && !loveUpsUids.some((fuid) => fuid == uid)) {
                            $.ajax({
                                async:false,
                                url: 'https://live.acfun.cn/rest/pc-direct/user/userInfo?userId=' + uid,
                                type: 'get',
                                xhrFields: {
                                    withCredentials: true
                                },
                                success: function (res) {
                                    if (res.result === 0 && res.profile && res.profile.name) {
                                        lsLoveUps[Number(uid)] = res.profile.name;
                                    }
                                }
                            });
                        }
                    });
                    console.log(lsLoveUps);
                    window.localStorage.setItem('ls_love_ups', JSON.stringify(lsLoveUps));
                    loveUpsUids = Object.keys(lsLoveUps) ?? [];
                    tips.innerText = '添加成功，刷新页面生效';
                }
                else {
                    tips.innerText = '添加失败，超出最大值50';
                }
            }
            else {
                tips.innerText = '添加失败，无效uid';
            }
        }else {
            tips.innerText = '添加失败，超出最大值50';
        }


        btn.disabled = false;
        btn.style['background-color'] = '#fd4c5d';
    }

    window.delLoveUps = async function delLoveUps() {
        const tips = document.querySelector('#del_uid_tips');
        tips.innerText = '';
        const addTips = document.querySelector('#add_uid_tips');
        addTips.innerText = '';

        const btn = document.querySelector('#loveUid-del');
        btn.disabled = true;
        btn.style['background-color'] = 'rgb(0 0 0 / 45%)';
        await wait(100);

        var upUids = document.querySelector('#up_uids').value;
        upUids = upUids.trim();
        const onlyOneUid = /^\d+$/.test(upUids);
        if (onlyOneUid && loveUpsUids.some((fuid) => fuid == upUids)) {
            delete lsLoveUps[upUids];
            console.log(lsLoveUps);
            window.localStorage.setItem('ls_love_ups', JSON.stringify(lsLoveUps));
            tips.innerText = '删除成功，刷新页面生效';
        }
        else if(upUids && upUids.length > 0) {
            upUids = upUids.replaceAll("，", ",").replaceAll(" ", ",");
            const uids = upUids.split(',');
            uids.forEach(uid => {
                uid = uid.trim();
                if (/^\d+$/.test(uid) && loveUpsUids.some((fuid) => fuid == uid)) {
                    delete lsLoveUps[uid];
                }
            });
            console.log(lsLoveUps);
            window.localStorage.setItem('ls_love_ups', JSON.stringify(lsLoveUps));
            tips.innerText = '删除成功，刷新页面生效';
        }
        else {
            tips.innerText = '删除失败，无效uid';
        }

        btn.disabled = false;
        btn.style['background-color'] = '#e6e6e6';
    }

    window.clearConfig = function clearConfig() {
        if(confirm(`即将刷新页面，确定初始化配置吗？`)) {
            window.localStorage.removeItem('ls_love_ups');
            window.localStorage.removeItem('ls_love_open');
            window.location.reload();
        }
     }

    waitElement('.logo').then(function() {
        var logoElement = document.querySelector('.logo');
        addNode(logoElement, document.createElement("a"), `<a href="https://www.acfun.cn/v/0.0" class="live-page-title" target="_blank" title="此功能需额外安装脚本">m3u8链接</a>`, 'a');
        addNode(logoElement, document.createElement("a"), `<a href="javascript:window.checkAika();" class="live-page-title" title="此功能需额外安装脚本">爱咔号查询</a>`, 'a');
    });

    const aikaHtmlStr = `
<div style="padding: 5px;font-size: 12px;border: 1px solid #e5e5e5;line-height: 20px;vertical-align: top;color: #999;box-sizing: border-box;margin-top: 5px;position: relative;">
    <p style="
        color: #333333;
        height: 20px;
        font-size: 17px;
        text-align: center;
        padding-bottom: 5px;">
        爱咔
    </p>
    <div>
        <div style="/* padding-top: 20px; */">
            <input type="text" placeholder="爱咔号 或者 爱咔地址" value="" autocomplete="off" id="aika-text" style="
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
    <div style="padding: 10px 0 0 0;position: relative;">
        <button id="aika-cut" onclick="window.aikaCut();" style="
            display: inline-block;
            background-color: #fd4c5d;
            width: 74px;
            color: #fff;
            font-size: 14px;
            line-height: 26px;
            border-radius: 4px;
            border-width: 0px;
            cursor: pointer;">
            爱咔剪辑
        </button>
        <button id="aika-find" onclick="window.checkAika();" style="
            position: absolute;
            font-size: 12px;
            line-height: 12px;
            color: #fd4c5d;
            bottom: 0;
            right: 0;
            border-width: 0px;
            background-color: rgb(255 255 255 / 0%);
            cursor: pointer;" title="此功能需额外安装脚本">爱咔号查询&gt;</button>
    </div>
</div>
    `;
    const configHtmlStr = `
<div id="configContainer" style="display: none;padding: 5px;font-size: 12px;border: 1px solid #e5e5e5;line-height: 20px;vertical-align: top;color: #999;box-sizing: border-box;margin-top: 5px;position: relative;">
    <p style="
        color: #333333;
        height: 20px;
        font-size: 17px;
        text-align: center;
        padding-bottom: 5px;">
        配置
    </p>
    <div style="position: relative;padding-left: 5px;">
        <span onclick="(function(){document.querySelector('#loveStyle').click()})()" style="color: #fd4c5d !important;font-family: 'Font Awesome 5 Regular';font-size: 14px;cursor: pointer;">喜爱模式</span>
        <div style="position: relative;display: inline;">
            <input id="loveStyle" type="checkbox" ${lsLoveOpen ? 'checked=checked' : ''} onclick="window.triggerLove();" style="box-sizing: border-box;padding: 0;position: absolute;bottom: -3px;z-index: 1;cursor: pointer;">
        </div>
        <button onclick="window.clearConfig();" style="position: absolute;font-size: 12px;line-height: 12px;color: #fd4c5d;bottom: 0;right: 0;border-width: 0px;background-color: rgb(255 255 255 / 0%);text-decoration: underline;cursor: pointer;">配置初始化</button>
    </div>
    <div id="love_ups_container" style="display: ${lsLoveOpen ? 'block' : 'none'};">
        <div style="padding: 5px;">
            <span>操作一个或多个喜爱uid，多个uid通过 “ ” (空格) 或者 “,” (英文逗号) 来分隔</span>
            <input type="text" placeholder="123 或者 123,456,789 或者 123 456" value="" autocomplete="off" id="up_uids" style="
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
        <div style="padding: 10px 0 0 0;position: relative;">
            <div style="display: inline;">
                <button id="loveUid-add" onclick="window.addLoveUps();" style="display: inline-block; background-color: rgb(253, 76, 93); width: 74px; color: rgb(255, 255, 255); font-size: 14px; line-height: 26px; border-radius: 4px; border-width: 0px;cursor: pointer;">添加uid</button>
                <span id="add_uid_tips" style="padding-left: 0px;color: rgb(38, 185, 99);"></span>
            </div>
            <div style="display: inline;bottom: 0;right: 0;position: absolute;">
                <span id="del_uid_tips" style="padding-left: 0px;color: rgb(38, 185, 99);"></span>
                <button id="loveUid-del" onclick="window.delLoveUps();" style="display: inline-block;background-color: #e6e6e6;width: 74px;color: #666666;font-size: 14px;line-height: 26px;border-radius: 4px;border-width: 0px;cursor: pointer;">删除uid</button>
            </div>
        </div>
    </div>
</div>
<div style="position: relative;">
    <button id="configTrigger" onclick="window.configTrigger();" style="
            text-decoration: underline;
            padding-top: 10px;
            position: absolute;
            font-size: 12px;
            line-height: 12px;
            color: #409bef;
            top: 0px;
            left: 50%;
            transform: translateX(-50%);
            border-width: 0px;
            background-color: rgb(255 255 255 / 0%);
            cursor: pointer;
            ">展开配置</button>
</div>`;

    waitElement('.list-right').then(function() {
        const listRightNode = document.querySelector('.list-right');
        addChild(listRightNode, document.createElement("div"), aikaHtmlStr, 'div');
        addChild(listRightNode, document.createElement("div"), configHtmlStr, 'div');
    });


}
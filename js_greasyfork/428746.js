// ==UserScript==
// @name         解锁b站vip视频+弹幕字幕移植
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACS0lEQVRYR8WXz2oTURTGv3MnpqhNKy1UWmxRTGdaiLSQRKkKIoK4FVrRPoHu7BMYn0B3+gQquuiuiC6kaFVsAhGEZkKqG/+Vrtp0YWsyR27KlEwz0xnnT3LgwjB37vl+97tzz9whdDiow/pwBCjofN0AJohwKQgkMxYF8Dmt0bxdnhaAQoWTXMczENJBhFvGMgqk4GY6SZXmPgvAmy/cnYijGqrwvmTVHSQup2jLvG0ByJf5EYDbUQIAeJxR6U4LQHGV1VodesTijfQxBdrkaSrL6z0Hlst8i4An7QBgYDar0lMrgM45ItxrCwDjflajnC+AtR8Gvn8zGpz9xwVOjor/Zma/ANt/GIsLNWxt8p7o4IiAmlLQP+C9pvkG+FoyUPxYs52xhFDPKIh3uRviG2ClWIdsTpHoJYymFNdliQzABBsaEZg4p+DwUftliRxAggwOC0xdidma1RaAI92Ea9OHOgcwPqlANruI1AElhsa2dBKXQJEBnDglGlvxWN/BNcE3gKyCS69b64AUlMISwEv4BpDJ3778i/Xfu5XQtFtaLq+9RiCA6gZj/dcuQN8Audod6kvodYZuz9k7UOK7JPDAbXAY/WxgLjtGDy2f408VPi8MLIUh4JbDELhwNknvLQDyQNoTh87AkFuCIP0E/NzcgWYeTC0bdrkNp6Lm9bc4YM4qr/NzEGaCzNJxLONFRqMbzf22JSu/wlcphhwzpsIAIcIHriGXGadX+/MdWDPflTjRxcH+kLYJhYtj5Piz4/0gF4YVNjk6DvAPDb0aMEr8/nEAAAAASUVORK5CYII=    
// @version      1.13.4.1
// @description  解除B站大会员观影限制，理论支持番剧和放映厅，不支持的视频请反馈留地址让我修复，或自行在代码搜索‘大会员’并添加识别div与语句。
// @author       p7
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @match        https://www.bilibili.com/bangumi/*
// @match        https://vip.parwix.com:4433/*
// @match        https://z1.m1907.cn/*
// @match        https://showxi.xyz/*
// @match        https://www.mtosz.com/*
// @match        https://www.akkdm.com/*
// @match        https://jx.aidouer.net/*
// @match        https://titan.mgtv.com.okjx.cc:3389/*
// @match        https://www.nxflv.com/*
// @match        https://jx.kingtail.xyz/*
// @match        https://*.1dior.cn/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/users/789132
// @downloadURL https://update.greasyfork.org/scripts/428746/%E8%A7%A3%E9%94%81b%E7%AB%99vip%E8%A7%86%E9%A2%91%2B%E5%BC%B9%E5%B9%95%E5%AD%97%E5%B9%95%E7%A7%BB%E6%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/428746/%E8%A7%A3%E9%94%81b%E7%AB%99vip%E8%A7%86%E9%A2%91%2B%E5%BC%B9%E5%B9%95%E5%AD%97%E5%B9%95%E7%A7%BB%E6%A4%8D.meta.js
// ==/UserScript==
(function () {
    /*1.11.6 mod区域 1.13.2.3更新*/
    let originalInterfaceList = [
        {
            "name": "迪奥[AKK]",
            "category": "1",
            "url": "https://www.akkdm.com/b/?url="
        },
        {
            "name": "迪奥[公共]",
            "category": "1",
            "url": "https://123.1dior.cn/?url="
        },
        {
            "name": "cha",
            "category": "1",
            "url": "https://jx.aidouer.net/?url="
        },
        {
            "name": "Mao播放器",
            "category": "1",
            "url": "https://www.mtosz.com/m3u8.php?url="
        },
        {
            "name": "Parwix",
            "category": "1",
            "url": "https://vip.parwix.com:4433/player/?url="
        },
        {
            "name": "m1907",
            "category": "1",
            "url": "https://z1.m1907.cn/?jx="
        },
        {
            "name": "芒果",
            "category": "1",
            "url": "https://titan.mgtv.com.okjx.cc:3389/ok.php?url=",
        },
        {
            "name": "诺讯",
            "category": "1",
            "url": "https://www.nxflv.com/?url=",
            "special": "放映厅"
        },
        {
            "name": "showxi",
            "category": "1",
            "url": "https://showxi.xyz/mov/s/?sv=3&url=",
            "special": "多线"
        },
        {
            "name": "kingtail",
            "category": "1",
            "url": "https://jx.kingtail.xyz/?url=",
            "special": "多线"
        }
    ];


    /*mod区域结束*/
    var CHANNEL_COUNT = 0
    var MAX_DM_COUNT = 10
    var player, playerRect
    var minpool = [];
    var domPool = [];
    var domtopdownPool = [];
    var listobj
    let distance = 25;
    let xmlhtml;
    //1.11.6修复弹幕重复问题
    let minpoolout = [];
    let lastvideotime = 0;
    //1.11.7全屏问题 1.13.0继续优化
    let fullscreen;
    let minpoolnout = [];
    //1.13.1
    let cid, aid;
    let subtitlepool = [];
    let Subtitle = [];
    let Subtitleout = [];
    let zimufontSize = '24';
    //1.13.2
    let biliplayerH
    //1.13.3
    let usualWidth
    //1.13.3重复利用数据
    let peopleNumber
    let listjson
    let subtitleArray
    //1.13.4
    let combineDanmu = 0
    let bigsmallDanmu = 0

    //1.12.1 set
    let dmblock_scroll, dmblock_top, dmblock_bottom, dmblock_color, dmblock_special;
    let buiSwitch = 'true';
    let repeatSlider = false;
    let repeatP = 0; //去重概率[0-100]
    let opacitySlider = false;
    let opacityNum = 1;
    let fontSize = 25;
    let fontSizeSlider = false;
    let dmspeed = 1; //0.5-1.5
    let dmspeedSlider = false;
    let dmArea = 1;
    let dmAreaSlider = false;
    let dmTextshadow, dmTextType, dmfontWeight;


    //1.12.2修补设置图标
    function xmlToJson(xml) {

        var obj = {};

        if (xml.nodeType == 1) {
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType == 3) {
            obj = xml.nodeValue;
        }

        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof (obj[nodeName]) == "undefined") {
                    obj[nodeName] = xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) == "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    };
    //1.11.7 稳定发送
    function postdownmessage(obj) {
        for (var posta = 0; posta <= 3; posta++) {
            try {
                window.frames[posta].postMessage(obj, '*');
            } catch { }
            for (var postb = 0; postb <= 3; postb++) {
                try {
                    window.frames[posta].frames[postb].postMessage(obj, '*');
                } catch { }
                for (var postc = 0; postc <= 3; postc++) {
                    try {
                        window.frames[posta].frames[postb].frames[postc].postMessage(obj, '*');
                    } catch { }
                }
            }
        }
    }

    async function getBV() {
        //let bv = $("a.av-link[target='_blank']")[0]
        //13.1字幕部分参考 greasyfork.org/zh-CN/scripts/428741
        cid = unsafeWindow.cid
        if (cid == undefined) {
            cid = unsafeWindow.__INITIAL_STATE__.epInfo.cid
        }
        console.log('cid=' + cid)
        aid = unsafeWindow.aid
        if (aid == undefined) {
            aid = unsafeWindow.__INITIAL_STATE__.epInfo.aid
        }
        console.log('aid=' + aid)

        xmlhtml = `https://api.bilibili.com/x/v1/dm/list.so?oid=${cid}`
        $.ajax({
            url: xmlhtml,
            dataType: "xml",
            async: false, //1.13.3
            success: function (xml) {
                listjson = xmlToJson(xml)
                //console.log('listjson1',listjson)
            }

        })
        //12.6.3在线人数
        //console.log(`https://api.bilibili.com/x/player.so?id=cid:${result.data[0].cid}&bvid=${bv.innerText}`);
        $.ajax({
            url: `https://api.bilibili.com/x/player.so?id=cid:${cid}&aid=${aid}`,
            dataType: "text",
            async: false, //1.13.3
            success: function (chars) {
                peopleNumber = chars.substring(chars.indexOf('<online_count>') + 14, chars.indexOf('</online_count>'));
            }

        })

        //13.1 字幕查询
        let subtitleApi = 'https://api.bilibili.com/x/player/v2?'
        let season_id = document.querySelector("meta[property='og:url']").content.match(/ss(\d+)/g)[0].replace('ss', '')
        let params = ['aid=' + aid, 'cid=' + cid, 'season_id=' + season_id]
        $.ajax({
            url: subtitleApi + params.join('&'),
            dataType: "json",
            async: false, //1.13.3
            success: function (res) {
                if (!res['data']['subtitle']['subtitles'].length) {
                    //console.log('未发现字幕');
                } else {
                    //console.log(res)
                    let index = (res['data']['subtitle']['subtitles'][0]['lan_doc'].search('简体') !== -1) ? 0 : 1
                    let url = 'https:' + res['data']['subtitle']['subtitles'][index]['subtitle_url']
                    let subtitleUrl = url
                    console.log(`发现字幕 [${res['data']['subtitle']['subtitles'][index]['lan_doc']}]- ` + url)
                    $.ajax({
                        url: subtitleUrl,
                        dataType: "json",
                        success: function (res) {
                            subtitleArray = res
                        }
                    })
                }
            }

        })
        window.top.postMessage({
            str: 'hasplayer',
            fromweb: window.location.href
        },
            '*');
    }

    function receiveInfoFromAnotherDomain() {
        window.addEventListener("message",
            function (ev) {
                switch (window.location.host) {
                    case 'www.bilibili.com':
                        //console.log(ev.origin, ' message to', window.location.href, ev.data);
                        switch (ev.data.str) {
                            case 'hasplayer':
                                //1.13.3 感谢幽隐恋梦的优化思路
                                //console.log('hasplayer', cid, subtitleArray, peopleNumber, listjson)
                                if (cid) {
                                    $('.bilibili-player-video-info-people-number').text(peopleNumber)
                                    $('.bilibili-player-video-info-danmaku-number').text(listjson.i.d.length)
                                    postdownmessage({
                                        obj: listjson,
                                        str: 'xmllist'
                                    })
                                    if (subtitleArray != undefined) {
                                        postdownmessage({
                                            obj: subtitleArray,
                                            str: 'subtitleArray'
                                        })
                                    }
                                } else {
                                    getBV()
                                    //console.log('listjson2',listjson)
                                }
                                break;
                            case 'iframe监听初始化':
                                //1.13.2.1
                                biliplayerH = $('#player_module').height() - 46
                                postdownmessage({
                                    str: 'biliplayerH',
                                    p: biliplayerH
                                })
                                break;
                            case '刷新iframe':
                                //1.13.3.1
                                console.log('刷新iframe')
                                $('#iframe-player').attr('src', $('#iframe-player').attr('src'));
                                //let iframeweb = $('iframe').attr('src')
                                //$('iframe').attr('src', 'about:blank');
                                //$('#iframe').attr('src', iframeweb);
                                break;
                        }
                        //}
                        break
                    default:
                        window.top.postMessage({
                            fromweb: window.location.href,
                            obj: ev.data,
                            str: '来自iframe:',
                            from: ev.origin
                        },
                            '*');
                        switch (ev.data.str) {
                            case 'xmllist':
                                listobj = ev.data.obj;
                                break;
                            case 'checktrue':
                                buiSwitch = 'true';
                                refreshDomscreen();
                                break;
                            case 'checkfalse':
                                buiSwitch = 'false';
                                refreshDomscreen();
                                break;
                            case 'scrollon':
                                dmblock_scroll = 'on';
                                //1.12.2点击隐藏滚动弹幕
                                for (let i = 0; i < CHANNEL_COUNT; i++) {
                                    for (let j = 0; j < domPool[i].length; j++) {
                                        $(domPool[i][j]).show();
                                    }
                                }
                                break;
                            case 'scrolloff':
                                dmblock_scroll = 'off';
                                //1.12.2点击隐藏滚动弹幕
                                for (let i = 0; i < CHANNEL_COUNT; i++) {
                                    for (let j = 0; j < domPool[i].length; j++) {
                                        $(domPool[i][j]).hide();
                                    }
                                }
                                break;
                            case 'topon':
                                dmblock_top = 'on';
                                break;
                            case 'topoff':
                                dmblock_top = 'off';
                                break;
                            case 'bottomon':
                                dmblock_bottom = 'on';
                                break;
                            case 'bottomoff':
                                dmblock_bottom = 'off';
                                break;
                            case 'coloron':
                                dmblock_color = 'on';
                                break;
                            case 'coloroff':
                                dmblock_color = 'off';
                                break;
                            case 'repeatP':
                                repeatP = ev.data.p;
                                break;
                            case 'opacityNum':
                                opacityNum = ev.data.p;
                                setdomOpacity();
                                break;
                            case 'fontSize':
                                fontSize = ev.data.p;
                                setdomFontsize();
                                break;
                            case 'dmspeed':
                                dmspeed = ev.data.p;
                                break;
                            case 'dmArea':
                                dmArea = ev.data.p;
                                break;
                            case 'dmTextshadow': //1.12.6.1
                                dmTextshadow = ev.data.p;
                                setdomTextshadow();
                                break;
                            case 'dmTextType': //1.12.6.3
                                dmTextType = ev.data.p;
                                setdomTextType();
                                break;
                            case 'dmfontWeight': //1.12.6.5
                                dmfontWeight = ev.data.p;
                                setdomfontWeight()
                                break;
                            case 'subtitleArray': //1.13.1
                                Subtitle = ev.data.obj.body;
                                //console.log('subtitleArray',Subtitle,Subtitle[0].content,Subtitle[0].from)
                                break;
                            case 'biliplayerH': //1.13.2
                                biliplayerH = ev.data.p;
                                break;
                            case 'playerHchange': //1.13.2.2
                                refreshDom()
                                break;
                            case 'combineDanmu0': //1.13.4
                                combineDanmu = 0
                                break;
                            case 'combineDanmu1': //1.13.4
                                combineDanmu = 1
                                break;
                            case 'bigsmallDanmu0': //1.13.4                                
                                bigsmallDanmu = 0

                                break;
                            case 'bigsmallDanmu1': //1.13.4
                                bigsmallDanmu = 1
                                break;
                        }
                }
            })
        window.top.postMessage({
            fromweb: window.location.href,
            str: 'iframe监听初始化',
        },
            '*');
    }

    function detecH5Player(findplayertime) {

        player = document.querySelector('video');
        if (player) {
            window.top.postMessage({
                str: 'hasplayer',
                fromweb: window.location.href
            },
                '*');
            playerRect = player.getBoundingClientRect();
            initcss();

            //let createdElement = document.createElement('div');
            //createdElement.className = 'topdown';
            //createdElement.name = 'testlong'

            player.addEventListener('pause',
                function () {
                    $('.left').each(function (index, element) {
                        element.style.willChange = 'auto'
                        let domRect = element.getBoundingClientRect();
                        let domLeft = domRect.left - playerRect.left;
                        $(element).css('transform', `translateX(${domLeft}px)`);
                        $(element).css('transition', `transform 0s linear`);

                    })
                });
            //1.11.7
            document.addEventListener("fullscreenchange", function (e) {
                refreshDom()
                if (document.fullscreenElement) {
                    fullscreen = true
                } else {
                    fullscreen = false
                }
            })
            player.addEventListener('playing',
                function () {
                    playtime = (new Date()).getTime()
                    $('.left').each(function (index, element) {
                        let domRect = element.getBoundingClientRect()
                        let domLeft = domRect.left - playerRect.left
                        let oldS = element.clientWidth + player.clientWidth
                        let newS = element.clientWidth + domLeft
                        let oldT = 0.0074 * (element.clientWidth + player.clientWidth) / dmspeed
                        let newT = newS / oldS * oldT
                        $(element).css('transition', `transform ${newT}s linear`);
                        $(element).addClass('left');

                        element.style.willChange = 'transform'
                        element.style.transform = `translateX(${-element.clientWidth}px)`;

                    })
                });
            player.addEventListener('timeupdate',
                function () {
                    //1.11.6 修复弹幕重复、前进后退清屏、后退重载弹幕
                    let lastlen = parseInt(lastvideotime / 60)
                    let startlen = parseInt(player.currentTime / 60)
                    if (lastvideotime > player.currentTime) {
                        for (var c = startlen; c <= lastlen; c++) {
                            if (minpoolout[c].length != 0) {
                                minpool[c] = minpool[c].concat(minpoolout[c])
                                minpoolout[c].length = 0
                            }
                        }
                        Subtitle = Subtitle.concat(Subtitleout)
                        refreshDomscreen()
                    } else if (lastvideotime + 2 < player.currentTime) {
                        refreshDomscreen()
                    }
                    lastvideotime = player.currentTime

                    if (minpool.length == 0 && listobj && player.duration) { //1.13.2防止错误
                        minpool = new Array(parseInt(player.duration / 60));
                        let minlen = minpool.length
                        for (var a = 0; a <= minlen; a++) {
                            minpool[a] = []
                        }
                        minpoolout = new Array(minlen);
                        for (var b = 0; b <= minlen; b++) {
                            minpoolout[b] = []
                        }
                        let len = listobj.i.d.length
                        for (var j = 0; j < len; j++) {
                            let strp = listobj.i.d[j]['@attributes'].p
                            let arrp = strp.split(',');
                            let arrpJson = {
                                "time": arrp[0],
                                "type": arrp[1],
                                "size": arrp[2],
                                "rgb": arrp[3],
                                "pool": arrp[5],
                                "text": listobj.i.d[j]['#text']
                            };
                            try {
                                minpool[parseInt(arrp[0] / 60)].push(arrpJson);
                            } catch { }
                        }
                    }

                    $('.topdown').each(function (index, element) {
                        if (element.innerText != '') {
                            let nowtime = (new Date()).getTime();
                            let lasttime = parseInt(nowtime) - parseInt($(element).prop("name"))
                            if (lasttime >= 4500) {
                                element.innerText = ''
                                element.name = ''
                            }
                        }
                    });
                    $('.zimu').each(function (index, element) {
                        if (element.innerText != '') {
                            let nowT = player.currentTime
                            let endT = $(element).prop("name")
                            if (nowT >= endT) {
                                element.innerText = ''
                                element.name = ''
                            }
                        }
                    });
                    if (minpool.length != 0 && domPool.length != 0 && buiSwitch == 'true') {
                        let channel;
                        let nowlen = parseInt(player.currentTime / 60);
                        if (!$(player).paused) {
                            for (let j = minpool[nowlen].length - 1; j > -1; j--) {
                                label122: {
                                    let nowtext = minpool[nowlen][j].text //12.6.4
                                    if (minpool[nowlen][j].time >= player.currentTime && minpool[nowlen][j].time <= player.currentTime + 0.5 && minpool[nowlen][j].type == '1' && dmblock_scroll != 'off') {
                                        if (minpool[nowlen][j].rgb != '16777215' && dmblock_color == 'off') {
                                            break label122;
                                        }

                                        //1.12.3 重复判断 1.12.6.4 修复 1.13.4                                   
                                        if (repeatP > Math.floor(Math.random() * 100) && combineDanmu == 0) {
                                            for (let i = 0; i < CHANNEL_COUNT; i++) {
                                                for (let j = 0; j < domPool[i].length; j++) {
                                                    if ($(domPool[i][j]).text() == nowtext) {
                                                        break label122;
                                                    }
                                                }
                                            }
                                        }

                                        channel = getChannel()
                                        if (channel != -1) {
                                            let arrpJson = minpool[nowlen][j]
                                            let dom = domPool[channel].shift() //把数组的第一个元素从其中删除
                                            domPool[channel].push(dom); //向数组的末尾添加一个或多个元素                                                                

                                            minpoolout[nowlen].push(minpool[nowlen][j])
                                            minpool[nowlen].splice(j, 1);
                                            //1.13.4 合并重复
                                            let cishu = 1
                                            if (combineDanmu == 1) {
                                                let TfontSize = arrpJson.size * fontSize / 25 / 2;
                                                let Tnowtextlong = nowtext.replace(/[\u0391-\uFFE5]/g, "aa").length
                                                let combinetime = 0.0074 * (TfontSize * Tnowtextlong + player.clientWidth) / dmspeed
                                                for (let j2 = minpool[nowlen].length - 1; j2 > -1; j2--) {
                                                    //alert(nowtext+','+j2+','+minpool[nowlen][j2].text)
                                                    if (minpool[nowlen][j2].time >= player.currentTime && minpool[nowlen][j2].time <= player.currentTime + combinetime && minpool[nowlen][j2].text == nowtext) {
                                                        cishu = cishu + 1
                                                        minpoolout[nowlen].push(minpool[nowlen][j2])
                                                        minpool[nowlen].splice(j2, 1);
                                                    }
                                                }
                                                if (cishu > 1) {
                                                    arrpJson.text = nowtext + '[' + cishu + ']'
                                                }
                                            }
                                            shootDanmu(dom, arrpJson, channel, cishu);
                                        } else {
                                            minpoolnout.push(minpool[nowlen][j])
                                        }
                                    } else if (minpool[nowlen][j].time >= player.currentTime && minpool[nowlen][j].time <= player.currentTime + 0.5 && minpool[nowlen][j].type != '1') {
                                        if (minpool[nowlen][j].type == '4' && dmblock_bottom == 'off') {
                                            break label122;
                                        }
                                        if (minpool[nowlen][j].type == '5' && dmblock_top == 'off') {
                                            break label122;
                                        }
                                        if (minpool[nowlen][j].rgb != '16777215' && dmblock_color == 'off') {
                                            break label122;
                                        }

                                        //1.12.3 重复判断 1.12.6.4 修复 1.13.4
                                        if (repeatP > Math.floor(Math.random() * 100 && combineDanmu == 0)) {
                                            for (let i2 = 0; i2 < CHANNEL_COUNT; i2++) {
                                                if ($(domtopdownPool[i2]).text() == nowtext) {
                                                    break label122;
                                                }
                                            }
                                        }

                                        channel = gettopdownChannel(minpool[nowlen][j].type);
                                        if (channel != -1) {
                                            let arrpJson = minpool[nowlen][j]
                                            let dom = domtopdownPool[channel];
                                            shoottopdownDanmu(dom, arrpJson, channel);
                                            minpoolout[nowlen].push(minpool[nowlen][j])
                                            minpool[nowlen].splice(j, 1);
                                        } else {
                                            minpoolnout.push(minpool[nowlen][j])
                                        }
                                    }
                                }
                            }
                            for (let n = 0; n < minpoolnout.length; n++) {
                                if (minpoolnout[n].time + 5 >= player.currentTime) {
                                    minpoolnout.splice(n, 1);
                                } else {
                                    let channel2
                                    if (minpoolnout[n].type == '1') {
                                        channel2 = getChannel()
                                        if (channel2 != -1) {
                                            let arrpJson = minpoolnout[n]
                                            let dom = domPool[channel2].shift() //把数组的第一个元素从其中删除
                                            domPool[channel2].push(dom); //向数组的末尾添加一个或多个元素                    
                                            shootDanmu(dom, arrpJson, channel2);
                                            minpoolnout.splice(n, 1);
                                        }
                                    } else {
                                        channel2 = gettopdownChannel(minpoolnout[n].type);
                                        if (channel2 != -1) {
                                            let arrpJson = minpoolnout[n]
                                            let dom = domtopdownPool[channel2];
                                            shoottopdownDanmu(dom, arrpJson, channel2);
                                            minpoolnout.splice(n, 1);
                                        }
                                    }

                                }
                            }
                        }
                    }
                    //1.13.1
                    if (Subtitle.length != 0) {
                        if (player.currentTime <= 2) {
                            shootZimu({
                                "from": 1,
                                "to": 3,
                                "location": 1,
                                "content": "字幕加载成功[简体中文]，感谢Muise Destiny的技术支持"
                            })
                        }
                        for (let i = 0; i < Subtitle.length; i++) {
                            if (Subtitle[i].from > player.currentTime && Subtitle[i].from <= player.currentTime + 0.5) {
                                shootZimu(Subtitle[i])
                                Subtitleout.push(Subtitle[i])
                                Subtitle.splice(i, 1);
                            }

                        }
                    }
                })
        } else {
            setTimeout(function () {
                if (new Date().getTime() - findplayertime <= 5000) {
                    detecH5Player(findplayertime)
                }
            },
                500)
        }
    }

    function refreshDomscreen() {
        //1.11.6 清除在场弹幕
        $('.left').each(function (index, element) {
            $(element).css('transition', `transform 0s linear`);
            $(element).removeClass('left'); //1.12.6补充
            $(element).addClass('right');
            element.style.left = 0
            element.style.willChange = 'transform'
            element.style.transition = null;
            element.style.willChange = 'auto'
            element.style.transform = `translateX(${player.clientWidth}px)`
            element.innerText = ''
            element.className = 'right';

        })
        for (let i = 0; i < CHANNEL_COUNT; i++) {
            try {
                domtopdownPool[i].innerText = ''
            } catch { }
        }

        $('.right').each(function (index, element) {
            element.style.left = 0
            element.style.transform = `translateX(${player.clientWidth}px)`
        })
    }


    let scroll_on = `
    <span class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <path
            d="M23 3H5a4 4 0 00-4 4v14a4 4 0 004 4h18a4 4 0 004-4V7a4 4 0 00-4-4zM11 9h6a1 1 0 010 2h-6a1 1 0 010-2zm-3 2H6V9h2v2zm4 4h-2v-2h2v2zm9 0h-6a1 1 0 010-2h6a1 1 0 010 2z">
        </path>
    </svg></span>`
    let scroll_off = `
    <span class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <path
            d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 00-4-4H5a4 4 0 00-4 4v14a4 4 0 004 4h11.674A7 7 0 0123 15zM11 9h6a1 1 0 010 2h-6a1 1 0 010-2zm-3 2H6V9h2v2zm4 4h-2v-2h2v2zm2-1a1 1 0 011-1h1a1 1 0 010 2h-1a1 1 0 01-1-1z">
        </path>
        <path
            d="M26.536 18.464a5 5 0 00-7.071 0 5 5 0 000 7.071 5 5 0 107.071-7.071zm-5.657 5.657a3 3 0 01-.586-3.415l4.001 4.001a3 3 0 01-3.415-.586zm4.829-.827l-4.001-4.001a3.002 3.002 0 014.001 4.001z">
        </path>
    </svg></span>`

    let top_on = `
    <span class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <path
            d="M23 3H5a4 4 0 00-4 4v14a4 4 0 004 4h18a4 4 0 004-4V7a4 4 0 00-4-4zM9 9H7V7h2v2zm4 0h-2V7h2v2zm4 0h-2V7h2v2zm4 0h-2V7h2v2z">
        </path>
    </svg></span>`
    let top_off = `
    <span class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <path
            d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 00-4-4H5a4 4 0 00-4 4v14a4 4 0 004 4h11.674A7 7 0 0123 15zm-4-8h2v2h-2V7zM9 9H7V7h2v2zm4 0h-2V7h2v2zm2-2h2v2h-2V7z">
        </path>
        <path
            d="M26.536 18.464a5 5 0 00-7.071 0 5 5 0 000 7.071 5 5 0 107.071-7.071zm-5.657 5.657a3 3 0 01-.586-3.415l4.001 4.001a3 3 0 01-3.415-.586zm4.829-.827l-4.001-4.001a3.002 3.002 0 014.001 4.001z">
        </path>
    </svg></span>`

    let bottom_on = `
    <span class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <path
            d="M23 3H5a4 4 0 00-4 4v14a4 4 0 004 4h18a4 4 0 004-4V7a4 4 0 00-4-4zM9 21H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z">
        </path>
    </svg></span>`
    let bottom_off = `
    <span class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <path
            d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 00-4-4H5a4 4 0 00-4 4v14a4 4 0 004 4h11.674A7 7 0 0123 15zM9 21H7v-2h2v2zm4 0h-2v-2h2v2z">
        </path>
        <path
            d="M26.536 18.464a5 5 0 00-7.071 0 5 5 0 000 7.071 5 5 0 107.071-7.071zm-5.657 5.657a3 3 0 01-.586-3.415l4.001 4.001a3 3 0 01-3.415-.586zm4.829-.827l-4.001-4.001a3.002 3.002 0 014.001 4.001z">
        </path>
    </svg></span>`

    let color_on = `
    <span class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <path
            d="M17.365 11.118c0-.612-.535-1.147-1.147-1.147s-1.147.535-1.147 1.147c0 .611.535 1.147 1.147 1.147s1.147-.536 1.147-1.147zM12.93 9.665c-.764 0-1.376.611-1.376 1.3 0 .689.612 1.301 1.376 1.301s1.376-.612 1.376-1.301-.612-1.3-1.376-1.3zM9.794 11.883c-.764 0-1.376.612-1.376 1.3 0 .689.612 1.3 1.376 1.3s1.376-.611 1.376-1.3c.001-.688-.611-1.3-1.376-1.3zM10.023 15.171c-.612 0-1.147.536-1.147 1.148 0 .611.535 1.146 1.147 1.146s1.147-.535 1.147-1.146c.001-.612-.535-1.148-1.147-1.148zM17.823 12.953c-.611 0-1.147.535-1.147 1.147s.536 1.147 1.147 1.147c.612 0 1.148-.535 1.148-1.147s-.536-1.147-1.148-1.147z">
        </path>
        <path
            d="M23.177 3H4.824C2.683 3 1 4.833 1 7.167v13.665C1 23.167 2.683 25 4.824 25h18.353C25.318 25 27 23.167 27 20.833V7.167C27 4.833 25.318 3 23.177 3zm-3.442 13.624c-1.987.612-4.129-.154-5.046.764-.918.918 1.529 1.606 0 2.219-1.988.84-7.341-.535-8.182-4.053-.841-3.441 2.905-6.5 5.888-7.035 2.906-.535 6.041.841 8.181 2.982 2.065 2.141.765 4.74-.841 5.123z">
        </path>
    </svg></span>`
    let color_off = `
    <span class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <path
            d="M17.823 15.247c.612 0 1.148-.535 1.148-1.147s-.536-1.147-1.148-1.147c-.611 0-1.147.535-1.147 1.147s.536 1.147 1.147 1.147zM17.365 11.118c0-.612-.535-1.147-1.147-1.147s-1.147.535-1.147 1.147c0 .611.535 1.147 1.147 1.147s1.147-.536 1.147-1.147z">
        </path>
        <path
            d="M18.235 16.872c-1.483.086-2.859-.172-3.546.516-.918.918 1.529 1.606 0 2.219-1.988.84-7.341-.535-8.182-4.053-.841-3.441 2.905-6.5 5.888-7.035 2.906-.535 6.041.841 8.181 2.982 1.208 1.253 1.265 2.663.782 3.694A6.938 6.938 0 0123 15c1.487 0 2.866.464 4 1.255V7.167C27 4.833 25.318 3 23.177 3H4.824C2.683 3 1 4.833 1 7.167v13.665C1 23.167 2.683 25 4.824 25h11.85A6.97 6.97 0 0116 22c0-2.025.86-3.85 2.235-5.128z">
        </path>
        <path
            d="M8.876 16.319c0 .611.535 1.146 1.147 1.146s1.147-.535 1.147-1.146c0-.612-.535-1.148-1.147-1.148s-1.147.536-1.147 1.148zM9.794 11.883c-.764 0-1.376.612-1.376 1.3 0 .689.612 1.3 1.376 1.3s1.376-.611 1.376-1.3c.001-.688-.611-1.3-1.376-1.3zM11.553 10.965c0 .689.612 1.301 1.376 1.301s1.376-.612 1.376-1.301-.612-1.3-1.376-1.3-1.376.611-1.376 1.3zM26.536 18.464a5 5 0 00-7.071 0 5 5 0 000 7.071 5 5 0 107.071-7.071zm-5.657 5.657a3 3 0 01-.586-3.415l4.001 4.001a3 3 0 01-3.415-.586zm4.829-.827l-4.001-4.001a3.002 3.002 0 014.001 4.001z">
        </path>
    </svg></span>
    `

    let special_on = `
    <span class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <path
            d="M23 3H5a4 4 0 00-4 4v14a4 4 0 004 4h18a4 4 0 004-4V7a4 4 0 00-4-4zM7.849 11.669l.447-.828.492.782.894.184-.536.736.134.966-.85-.321-.804.414.045-.967L7 11.946l.849-.277zm3.352 7.101l-1.43-.506L8.43 19v-1.565L7.357 16.33l1.43-.506.67-1.381.894 1.289 1.475.23-.894 1.289.269 1.519zm7.95-3.9l-2.816-.69-2.458 1.565-.223-2.946-2.145-1.933 2.637-1.151L15.263 7l1.877 2.255 2.86.23-1.52 2.531.671 2.854z">
        </path>
    </svg></span>`
    let special_off = `
    <span class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28">
        <path
            d="M23 15c1.487 0 2.866.464 4 1.255V7a4 4 0 00-4-4H5a4 4 0 00-4 4v14a4 4 0 004 4h11.674A7 7 0 0123 15zM7.849 11.669l.447-.828.492.782.894.184-.536.736.134.966-.85-.321-.804.414.045-.967L7 11.946l.849-.277zm3.352 7.101l-1.43-.506L8.43 19v-1.565L7.357 16.33l1.43-.506.67-1.381.894 1.289 1.475.23-.894 1.289.269 1.519zm2.453-5.971l-2.145-1.933 2.637-1.151L15.263 7l1.877 2.255 2.86.23-1.52 2.531.67 2.854-2.816-.69-2.458 1.565-.222-2.946z">
        </path>
        <path
            d="M26.536 18.464a5 5 0 00-7.071 0 5 5 0 000 7.071 5 5 0 107.071-7.071zm-5.657 5.657a3 3 0 01-.586-3.415l4.001 4.001a3 3 0 01-3.415-.586zm4.829-.827l-4.001-4.001a3.002 3.002 0 014.001 4.001z">
        </path>
    </svg></span>
    `

    function initcss() {
        let css = `.right {
              position: absolute;
              visibility: hidden;
              white - space: nowrap;
              /*left: 700px;
        transform: translateX(700px);*/
          }.left {
              position: absolute;
              white - space: nowrap;
              user - select: none;
              /* transition: transform 7s linear; 时间相同 越长的弹幕滑动距离越长 所以越快~ */
          }.topdown {
              position: absolute;
              white - space: nowrap;
              user - select: none;
  
          }`
        GM_addStyle(css);
        refreshDom();

        //13.1 字幕
        for (let j = 0; j < 2; j++) {
            let dom2 = document.createElement('div');
            dom2.style.fontSize = zimufontSize + 'px';
            dom2.style.color = 'rgb(255,255,255)';

            dom2.style.opacity = '1'
            dom2.style.fontWeight = '400'
            dom2.style.top = '10px'

            dom2.style.background = 'rgba(0,0,0,0.4)';
            dom2.style.padding = '0 8px';
            dom2.style.lineHeight = 'normal';
            dom2.style.fontFamily = 'none';
            dom2.style.userSelect = 'none';
            dom2.style.position = 'absolute';
            dom2.className = 'zimu';
            if (j != 0) {
                //console.log(j,'dom2zm')
                dom2.style.top = `${player.clientHeight - zimufontSize - 45}px`;
                $(dom2).addClass("zimubottom")
            }
            player.parentNode.appendChild(dom2);
            subtitlepool.push(dom2);
        }
        //shootZimu({},subtitlepool[1]) 
    }

    async function refreshDom() {
        if (fullscreen) {
            await sleep(400);
        }

        try {

            let nowCHANNEL_COUNT = Math.floor((player.clientHeight / fontSize - 1) * dmArea);
            /*window.top.postMessage({
                obj: {
                    a: 'refreshDom',
                    b: nowCHANNEL_COUNT - CHANNEL_COUNT,
                    c: fontSize
                },
                str: '来自iframe:',
                from: window.location.href
            }, '*');*/
            if (nowCHANNEL_COUNT > CHANNEL_COUNT) {
                // 先new一些span 重复利用这些DOM
                if (domPool.length < nowCHANNEL_COUNT) {
                    for (let j = CHANNEL_COUNT; j < nowCHANNEL_COUNT; j++) {
                        let doms = [];
                        for (let i = 0; i < MAX_DM_COUNT; i++) {
                            // 要全部放进player
                            let dom = document.createElement('div');
                            dom.style.zIndex = '1';
                            dom.style.color = 'rgb(255,255,255)';
                            dom.style.fontFamily = dmTextType //'SimHei, "Microsoft JhengHei", Arial, Helvetica, sans-serif'
                            dom.style.fontWeight = dmfontWeight.toString() //'bold'
                            dom.style.opacity = opacityNum //'1' //不透明度
                            dom.style.textShadow = dmTextshadow //'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px';
                            //dom.style.transform = `translateX(${player.clientWidth}px)`
                            dom.style.willChange = 'auto'
                            // 初始化dom的位置 通过设置className
                            dom.className = 'right';
                            // DOM的通道是固定的 所以设置好top就不需要再改变了
                            //dom.style.top = j * fontSize + 'px';
                            player.parentNode.appendChild(dom);
                            // 放入改通道的DOM池
                            doms.push(dom);
                            // 每次到transition结束的时候 就是弹幕划出屏幕了 将DOM位置重置 再放回DOM池
                            dom.addEventListener('transitionend', () => {
                                dom.style.transition = null;
                                dom.style.willChange = 'auto'
                                //dom.style.transform = `translateX(${player.clientWidth}px)`
                                dom.innerText = ''
                                dom.className = 'right';
                                dom.style.zIndex = '1';
                                dom.style.opacity = opacityNum
                            });
                        }
                        domPool.push(doms);
                        let dom2 = document.createElement('div');
                        dom2.style.fontSize = fontSize + 'px';
                        dom2.style.color = 'rgb(255,255,255)';
                        dom2.style.fontFamily = dmTextType
                        dom2.style.fontWeight = dmfontWeight.toString()
                        dom2.style.opacity = opacityNum
                        dom2.style.textShadow = dmTextshadow
                        dom2.style.willChange = 'auto'
                        //dom2.style.top = j * fontSize + 'px';
                        //dom2.style.left = `${(player.clientWidth - dom2.clientWidth) / 2}px`;
                        dom2.className = 'topdown';
                        dom2.style.zIndex = '1002';

                        player.parentNode.appendChild(dom2);
                        domtopdownPool.push(dom2);
                        //console.log(domtopdownPool.length,nowCHANNEL_COUNT)
                    }
                }

            }
            CHANNEL_COUNT = nowCHANNEL_COUNT
            //console.log(domPool.length, nowCHANNEL_COUNT)
            //topdownmid() //13.0

            $('.topdown').each(function (index, element) {
                //console.log($(element).text(),$('.topdown').eq(index).text(),$('.topdown').text())
                if ($(element).text() != '') {
                    element.style.left = `${(player.clientWidth - element.clientWidth) / 2}px`;
                    //console.log($(element).text(),element.style.left,(player.clientWidth - element.clientWidth) / 2)
                }
            })

            $('.zimu').each(function (index, element) {
                if ($(element).text() != '') {
                    element.style.left = `${(player.clientWidth - element.clientWidth) / 2}px`;
                }
                if ($(element).attr('class').indexOf('zimubottom') != -1) {
                    element.style.top = `${player.clientHeight - zimufontSize - 45}px`;
                }
            })

            let refreshDom_time = parseInt(player.currentTime / 60)
            if (minpool.length != 0) {
                minpool[refreshDom_time] = minpool[refreshDom_time].concat(minpoolout[refreshDom_time])
                minpoolout[refreshDom_time].length = 0
            }
        } catch { }

    }

    function getChannel() {
        for (let i = 0; i < CHANNEL_COUNT; i++) {
            let lastNumPos = domPool[i].length - 1
            let lastDom = domPool[i][lastNumPos];
            distance = 17 + Math.floor(Math.random() * 10) //1.13.0 随机间距
            if (lastDom) {
                if (lastDom.className == 'right') {
                    return i
                }
                let lastDomPos = lastDom.getBoundingClientRect();
                if (lastDomPos.right > playerRect.right) {
                    continue
                }

                let occupyS = lastDomPos.right - playerRect.left
                // 追及问题
                if (player.clientWidth - occupyS < distance) {
                    continue
                }
                for (let j = 0; j < domPool[i].length; j++) {
                    if (domPool[i][j].className == 'right') {
                        return i
                    }
                }

            }
        }
        return -1;
    }

    function gettopdownChannel(type) {
        for (let i = 0; i < CHANNEL_COUNT; i++) {
            if (type == 4) {
                let lastNumPos = domtopdownPool.length - i - 1
                let downDom = domtopdownPool[lastNumPos];
                if (downDom.innerText == '') {
                    return i
                }
            } else if (type == 5) {
                let lastNumPos2 = i
                let topDom = domtopdownPool[lastNumPos2];
                if (topDom.innerText == '') {
                    return i
                }
            }
        }
        return -1;
    }

    /**
     * 根据DOM和弹幕信息 发射弹幕
     */
    function shootZimu(arrpJson) {
        let dom
        if (arrpJson.location == '2') {
            dom = subtitlepool[1]
        } else {
            dom = subtitlepool[0]
        }
        dom.innerText = arrpJson.content;
        dom.name = arrpJson.to
        dom.style.left = `${(player.clientWidth - dom.clientWidth) / 2}px`;
        //console.log(arrpJson.from+'-'+dom.name+'biu~'+dom.innerText)
    }

    function shootDanmu(dom, arrpJson, channel, cishu) {

        dom.innerText = arrpJson.text;
        let num16 = parseInt(arrpJson.rgb).toString(16);
        dom.style.color = '#' + (Array(6).join(0) + num16).slice(-6);
        if (bigsmallDanmu == 1) {
            if (cishu != undefined) {
                let bilv = (1 + parseInt(cishu / 10) / 5 > 3) ? 3 : 1 + parseInt(cishu / 10) / 5
                if (bilv != 1) {
                    dom.style.fontSize = (arrpJson.size * fontSize / 25) * bilv + 'px';
                    dom.style.zIndex = '1001';
                    dom.style.opacity = opacityNum * 0.8
                } else {
                    dom.style.fontSize = arrpJson.size * fontSize / 25 + 'px';
                }

            }

        } else {
            dom.style.fontSize = arrpJson.size * fontSize / 25 + 'px';
        }


        dom.style.transform = `translateX(${player.clientWidth}px)`; //1.13.0优化全屏后左右弹幕
        dom.style.top = channel * fontSize + 'px'; //1.13.1优化上下弹幕位置

        // 如果为每个弹幕设置 transition 可以保证每个弹幕的速度相同 这里没有保证速度相同
        dom.style.transition = `transform ${0.0074 * (dom.clientWidth + player.clientWidth) / dmspeed}s linear`;

        // 设置弹幕的位置信息 性能优化 left -> transform
        //dom.style.transform = `translateX(${-dom.clientWidth - player.clientWidth}px)`;
        dom.style.transform = `translateX(${-dom.clientWidth}px)`;
        dom.style.willChange = 'transform';
        dom.className = 'left';
    }

    function shoottopdownDanmu(dom, arrpJson, channel) { //1.11.5 格式化居然把这function丢失了
        dom.innerText = arrpJson.text;
        dom.name = new Date().getTime();
        let num16 = parseInt(arrpJson.rgb).toString(16);
        dom.style.fontSize = arrpJson.size * fontSize / 25 + 'px';
        dom.style.color = '#' + (Array(6).join(0) + num16).slice(-6);

        dom.style.left = `${(player.clientWidth - dom.clientWidth) / 2}px`;
        dom.style.top = channel * fontSize + 'px'; //1.13.1优化上下弹幕位置
    }

    var $ = $ || window.$;

    function commonFunction() {
        this.GMgetValue = function (name, value) { //得到存在本地的数据
            return GM_getValue(name, value);
        };
        this.GMsetValue = function (name, value) { //设置存在本地的数据
            return GM_setValue(name, value);
        };
        this.addScript = function (url) { //添加脚本
            var s = document.createElement('script');
            s.setAttribute('src', url);
            document.body.appendChild(s);
        };
    }

    //全局统一变量
    const commonFunctionObject = new commonFunction();

    /**
     * 超级解析助手
     * @param {Object} originalInterfaceList
     * @param {Object} playerNodes
     */
    function superVideoHelper() {
        this.originalInterfaceList = originalInterfaceList;
        this.node = "#player_module";


        this.innerParse = function (url) { //内嵌解析
            $("#iframe-player").attr("src", url);
        };

        this.operatOther = function () {
            switch (window.location.host) {
                case 'www.bilibili.com':
                    /*if($('.up-name').text()=='哔哩哔哩番剧'){
                        for(let i=0;i<originalInterfaceList.length;i++){
                            if(originalInterfaceList[i].special=='放映厅'){
                                originalInterfaceList.splice(i,1);
                            }
                        }                       
                    }*/
                    receiveInfoFromAnotherDomain();
                    let findviptime = new Date().getTime();
                    let waitlimit = setInterval(() => {
                        let viptextArr = [$('.mask-info').text(), $(".video-float-hint-btn").text(), $(".bpx-player-toast-confirm").text(), $(".twp-title").text(), $(".video-float-hint-btn.hint-red").text(), $('.new-twp-btn.right.vip.blue').children('.current').text()];
                        let vipmatchArr = ['成为大会员', '付费观看', '成为大会员抢先看', '开通大会员观看', "非常抱歉，根据版权方要求您所在的地区无法观看本片"];
                        let intersection = viptextArr.filter(item => new Set(vipmatchArr).has(item))
                        if (intersection.length != 0) {
                            //console.log("是vip视频");
                            this.videoreplace();
                            clearInterval(waitlimit);
                        }
                        if (new Date().getTime() - findviptime >= 5000) {
                            clearInterval(waitlimit)
                        }
                    },
                        250);
                    //1.12.1 预防不能解锁vip视频的情况
                    this.addHtmlElements()
                    break
                default:
                    try {
                        receiveInfoFromAnotherDomain();
                        //1.13.3.1
                        if (window.location.host == 'titan.mgtv.com.okjx.cc:3389' || window.location.host == 'vip.parwix.com:4433' || window.location.host == 'www.mtosz.com') {
                            let decideloadT = new Date().getTime();
                            let decideloadlimit = setInterval(() => {
                                let panduan = false
                                if ($('h2').text().indexOf('缺少视频地址') != -1) {
                                    panduan = true
                                } else if ($('h1').text().indexOf('请填入视频URL地址') != -1 || $('h1').text().indexOf('解析失败') != -1) {
                                    panduan = true
                                }

                                if (panduan == true) {
                                    clearInterval(decideloadlimit);
                                    //console.log('刷新iframe')
                                    //location.reload();
                                    //this.videoreplace();
                                    window.top.postMessage({
                                        str: '刷新iframe',
                                        from: window.location.href
                                    }, '*');
                                }
                                if (new Date().getTime() - decideloadT >= 11000) {
                                    clearInterval(decideloadlimit)
                                }
                            },
                                500);
                        }

                        detecH5Player(new Date().getTime())
                        this.setvipcss();
                    } catch (err) {
                        console.log('h5接口:' + err)
                    }
                    break
            }
        }

        this.setvipcss = function () {
            //console.log(window.location.host)
            switch (window.location.host) {
                case 'showxi.xyz':
                    //1.12.5 修改showxi的css
                    let starcss = new Date()
                    let starcssInterval = setInterval(function () {
                        if (new Date() - starcss >= 3000) {
                            clearInterval(starcssInterval);
                        } else {
                            $('.jconfirm-open').hide();
                            $('.player-url-tips').hide();
                            $(".play-box").children('div').eq(0).hide()
                            $(".play-box").children('div').eq(1).hide()

                            $('.play-box').css('width', '100%');
                            $('.play-box').css('top', '0px');

                            //console.log(biliplayerH)
                            if (biliplayerH != undefined) {
                                $('.play-box').css('height', biliplayerH);
                                $('iframe').css('height', biliplayerH - 60);
                                clearInterval(starcssInterval);
                            }

                            $('.operation').children('div').each(function (indexx, item) {
                                if ($(item).attr("class") == undefined) {
                                    //console.log($(item).attr("class"))
                                    $(item).css('display', 'none')
                                    item.style.display = 'none'
                                }
                            })
                            $('.operation').css('display', 'block')
                        }
                    }, 250);
                    break;
                case 'vip.parwix.com:4433':
                    //13.2.1
                    let starcss2 = new Date()
                    let starcssInterval2 = setInterval(function () {
                        if (new Date() - starcss2 >= 3000) {
                            clearInterval(starcssInterval2);
                        } else {
                            if ($('.yzmplayer-comment-box') != 0) {
                                $('.yzmplayer-comment-box').hide();
                                $('.yzmplayer-list-icon').hide();
                                $('.yzmplayer-setting-icon').hide();
                                //$('.yzmplayer-played').css('background','#00a1d6 !important');
                                let parwixblue = `
                                .yzmplayer-bar .yzmplayer-played {
                                    background:#00a1d6 !important;
                                }
                                .yzmplayer-volume-bar .yzmplayer-volume-bar-inner{
                                    background:#00a1d6 !important;
                                }
                                .yzmplayer-volume-bar .yzmplayer-volume-bar-inner .yzmplayer-thumb{
                                    background:#00a1d6 !important;
                                }                                
                                .yzmplayer-setting .yzmplayer-setting-speeds:hover .title{
                                    background:#00a1d6 !important;
                                }
                                .yzmplayer-setting .yzmplayer-setting-speeds:hover .speed-stting{
                                    transform: scale(1);
                                }
                                .yzmplayer-setting-speed-panel.speed-stting {
                                    bottom: 35px;
                                    margin-left: -10px;
                                }
                                `
                                GM_addStyle(parwixblue)
                                $(".yzmplayer-setting-speeds").removeAttr("data-balloon");
                                $(".yzmplayer-setting-speeds").removeAttr("data-balloon-pos");
                                clearInterval(starcssInterval2);
                            }
                        }
                    }, 250);
                    break;
                case 'www.mtosz.com':
                    //13.2.1
                    let starcss3 = new Date()
                    let starcssInterval3 = setInterval(function () {
                        if (new Date() - starcss3 >= 3000) {
                            clearInterval(starcssInterval3);
                        } else {
                            if ($('.leleplayer-comment-box')) {
                                $('.leleplayer-comment-box').hide();
                                $('.leleplayer-list-icon').hide();
                                $('.leleplayer-setting-icon').hide();
                                let maoblue = `
                                    .leleplayer-bar .leleplayer-played {
                                        background:#00a1d6 !important;
                                    }
                                    .leleplayer-volume-bar .leleplayer-volume-bar-inner{
                                        background:#00a1d6 !important;
                                    }
                                    .leleplayer-volume-bar .leleplayer-volume-bar-inner .leleplayer-thumb{
                                        background:#00a1d6 !important;
                                    }                                
                                    .leleplayer-setting .leleplayer-setting-speeds:hover .title{
                                        background:#00a1d6 !important;
                                    }
                                    .leleplayer-setting .leleplayer-setting-speeds:hover .speed-stting{
                                        transform: scale(1);
                                    }
                                    .leleplayer-setting-speed-panel.speed-stting {
                                        bottom: 35px;
                                        margin-left: -10px;
                                    }
                                    `
                                GM_addStyle(maoblue)
                                $(".leleplayer-setting-speeds").removeAttr("data-balloon");
                                $(".leleplayer-setting-speeds").removeAttr("data-balloon-pos");
                                clearInterval(starcssInterval3);
                            }
                        }
                    }, 250);
                    break;
            }
        }

        this.videoreplace = function () {
            //1.11.6 修复m1907存在滚动条(才发现是滚动条) 修复基础不扎实且手贱导致的全屏问题 1.12.7修复zindex问题
            let videoPlayer = $(`<div id='iframe-play-div' style='width:100%;height:` + ($('#player_module').height() - 46) + `px;z-index:2;position:relative;'><iframe id='iframe-player' allowfullscreen='true' frameborder='0' width='100%' height='100%' scrolling='no'></iframe></div>`);
            let index = commonFunctionObject.GMgetValue("index");
            //1.12.1 修复接口记忆
            if (index == null) {
                index = '0'
                commonFunctionObject.GMsetValue("index", '0');
            }

            let url2 = this.originalInterfaceList[index].url + window.location.href;
            if (document.getElementById("iframe-player") == null) {
                //1.11.5 尝试修复多重视频声音 www.cnblogs.com/dzyany/p/14187782.html
                let playerb = document.querySelector('video');
                if (playerb) {
                    playerb.pause();
                    playerb.addEventListener('timeupdate', function () {
                        playerb.pause();
                    })
                    playerb.removeAttribute('src');
                    playerb.currentSrc = '';
                    playerb.innerHTML = '';
                }

                let playera = $(this.node);
                playera.empty();
                playera.append(videoPlayer);

                /*$('#iframe-play-div').resize(function(){
                    $('#iframe-play-div').css('height', ($('#player_module').height()-46)+`px`)
                })*/
                //13.2.2
                var targetNode = document.querySelector("#player_module");
                var observer = new MutationObserver(function (mutations, observer) {
                    //console.log('视频高度变化');
                    if ($('#iframe-play-div').height() != $('#player_module').height() - 46) {
                        $('#iframe-play-div').css('height', $('#player_module').height() - 46 + 'px')
                        //refreshDom()
                        postdownmessage({
                            str: 'playerHchange',
                        })
                    }
                });
                observer.observe(targetNode, {
                    attributes: true
                });

                //console.log('biliplayerH',playera.height())
                //1.11.5添加底部区域 1.11.8修复底栏层次问题
                this.bottomArea()
            }
            this.innerParse(url2);
            //1.11.5 修复移除vip提示bug
            let removetime = new Date().getTime();
            let waitlimit = setInterval(() => {
                $(".player-limit-mask").remove();
                $(".player-limit-mask pay").remove();
                $(".twp-container").remove();
                $(".twp-mask.twp-float").remove();
                if (new Date().getTime() - removetime >= 5000) {
                    clearInterval(waitlimit)
                }
            },
                250);
            /*//1.13.2.2
            console.log('biliplayerH',biliplayerH)
            if(biliplayerH!=undefined){
                $('#iframe-play-div').css('height',biliplayerH+'px')
            }*/

        }

        this.addHtmlElements = function () {
            var vipVideoImageBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC9klEQVRoQ+2ZPWgVQRDH/7/CWqOIYOFHFbRSjJhGMGDpByoIago70cqvUtQgdipWFqawMWghGIidhcHKQAJqEURBRfED1CCCjc3IPu4em31775J7d3m8cAtX3O7szP7nPzszx6EeH/T4+VUD6DaDTQbMbE+3D7MY+8Ckkw8BPFuMki7KDtUAuuh9Z3oZMtBljxY2X9eBwq4raWPNQEmOLKxm+TBgZqsknQ1dAVzNco+ZhWsm6ZakHZLC1mQyrZ5OX2RvzMxnSa8lzQJ/YwLzGDCze5JOeoI/gbVtAMxJ6vPW7wKnkr4qbEuaxccDcGWBsfNV0mjMmSGAg5LGA6XbgFehITPbLel5MN84ZAUAUjMPgWO+zZY7YGbvJW0OvRoB8EjSEW9+BhhIvOvCp0wGfPPbgZfpRAzATUnn56GEmJyLd39cBNxeF99FADTa42BskuQef4wDh9oB2CXpRbDpMPA4nTOz05LuBDLrgW+dAACGIkxfkHTDm/8DrMwEkBxgOskkqdwEcMAD4GLf3YF0PACOe+uFGMgA4Bj4EAAbAGbcXLQOmNklSdeCTRuBT2bWL+lNsLYfeFIRgH2SJgJ7GwCXYjMBrJb0K9jUiHEzG5F02VubA9b4skXvQMiAmW2VdFSSn24/As0kk1mJzeyppL3ewaaBnWY2K2mLNz8S5ueCAMLwz3q/DZxreweSe3BC0v1Ai7tkYXrsB96WwMBCAfQBv3MBJCD+SVrhaXaZ54z3PgUMhpYrZKCF7bbNnJk5BhwT6fghyW8thoGxigE4my6tXwemQlt5AGI1oamDSIFLmCuURiW5BOGPL8C7drGV206b2XdJ6yJKxoDhmPKCIeS61ZZClncxFgLAtcyxrnEwRmknDFQFIFYTWnJ/CVmoGgYSj7Z81OR86Lg7sOgPmnY6s0IpN4TyYrDb6zWAmoEOPVCHUIcO7Hh7/YemYxcWU7AMf3BkNGDF/FP9rkwGqjddkoWWv5Ql6V1yNXUdWHKXBwZ7noH/dP+HQNqheToAAAAASUVORK5CYII=`;
            var category_1_html = "";
            this.originalInterfaceList.forEach((item, index) => {
                if (item.category === "1") {
                    category_1_html += "<li title='" + item.name + "' data-index='" + index + "'>" + item.name + "</li>";
                }
            });

            //获得自定义位置
            var left = 0;
            var top = 100;
            var cssMould = `#vip_movie_box {cursor:pointer; position:fixed; top:` + top + `px; left:` + left + `px; width:0px; z-index:2147483647; font-size:16px; text-align:left;}
                                  #vip_movie_box .item_text {}
                                  #vip_movie_box .item_text .img_box{width:26px; height:35px;line-height:35px;text-align:center;background-color:#E5212E;}
                                  #vip_movie_box .item_text .img_box >img {width:20px; display:inline-block; vertical-align:middle;}
                                  #vip_movie_box .vip_mod_box_action {display:none; position:absolute; left:26px; top:0; text-align:center; background-color:#272930; border:1px solid gray;}
                                  #vip_movie_box .vip_mod_box_action li{border-radius:2px; font-size:12px; color:#DCDCDC; text-align:center; width:60px; line-height:21px; float:left; border:1px solid gray; padding:0 4px; margin:4px 2px;overflow:hidden;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow:ellipsis;}
                                  #vip_movie_box .vip_mod_box_action li:hover{color:#E5212E; border:1px solid #E5212E;}
                                  
                                  #vip_movie_box li.selected{color:#E5212E; border:1px solid #E5212E;}
                                  
                                  
                                  #vip_movie_box .selected_text {margin-top:5px;}
                                  #vip_movie_box .selected_text .img_box{width:26px; height:35px;line-height:35px;text-align:center;background-color:#E5212E;}
                                  #vip_movie_box .selected_text .img_box >img {width:20px; height:20px;display:inline-block; vertical-align:middle;}
                                  #vip_movie_box .vip_mod_box_selected {display:none;position:absolute; left:26px; top:0; text-align:center; background-color:#F5F6CE; border:1px solid gray;}
                                  #vip_movie_box .vip_mod_box_selected ul{overflow-y: auto;}
                                  #vip_movie_box .vip_mod_box_selected li{border-radius:2px; font-size:12px; color:#393AE6; text-align:center; width:95px; line-height:27px; float:left; border:1px dashed gray; padding:0 4px; margin:4px 2px;display:block;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
                                  #vip_movie_box .vip_mod_box_selected li:hover{color:#E5212E; border:1px solid #E5212E;}
                                                              
                                  #vip_movie_box .default-scrollbar-55678::-webkit-scrollbar{width:5px; height:1px;}
                                  #vip_movie_box .default-scrollbar-55678::-webkit-scrollbar-thumb{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#A8A8A8;}
                                  #vip_movie_box .default-scrollbar-55678::-webkit-scrollbar-track{box-shadow:inset 0 0 5px rgba(0, 0, 0, 0.2); background:#F1F1F1;}
                                  `;
            GM_addStyle(cssMould);

            var htmlMould = `<div id='vip_movie_box'>
                  <div class='item_text'>
                      <div class="img_box" id="img_box_6667897iio"><img src='` + vipVideoImageBase64 + `' title='点击跳转到综合解析页面，线路随意选！'/></div>
                          <div class='vip_mod_box_action' >
                              <div style='display:flex;'>
                                  <div style='padding:10px 0px; width:380px; max-height:400px; overflow-y:auto;'  class="default-scrollbar-55678">
                                      <div style='font-size:16px; text-align:center; color:#E5212E; padding:5px 0px;'><b>线路</b></div>
                                      <ul>` + category_1_html + `<div style='clear:both;'></div></ul>
                                  </div>
                              </div>
                          </div>	
                      </div>
                  </div>`;
            $("body").append(htmlMould);
            $(".item_text").on("mouseover", () => {
                $(".vip_mod_box_action").show();
            });
            $(".item_text").on("mouseout", () => {
                $(".vip_mod_box_action").hide();
            });
            $(".vip_mod_box_action li").each((liIndex, item) => {
                item.addEventListener("click", () => {
                    //1.11.5同一操作
                    var index = parseInt($(item).attr("data-index"));
                    commonFunctionObject.GMsetValue("index", index);
                    this.videoreplace();
                });
            });
        };

        this.bottomArea = function () {
            $('#vip_movie_box').remove();
            let playera = $(this.node);
            //1.11.5添加bottomArea
            let bottomcss = `     
            /*底部背景阴影*/
        .bilibili-player-video-bottom-area {
            width: 100%;
            height: 46px;
            background-color: #fff;
            -webkit-box-shadow: 0 0 8px #e5e9ef;
            box-shadow: 0 0 8px #e5e9ef;
            -ms-flex-negative: 0;
            flex-shrink: 0;
            position: relative;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
        }
  
        /*1.11.8修复偏移*/
        .bilibili-player-video-bottom-area::before {
          content: none
        }
    
        /*弹幕字体*/
        .bilibili-player-video-info-people-number {
            height: 14px;
            line-height: 14px;
            font-size: 14px;
            font-weight: 600;
        }
    
        /*视频信息文本格式*/
        .bilibili-player-video-info {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-flex: 0;
            -ms-flex: none;
            flex: none;
            -ms-flex-negative: 1;
            flex-shrink: 1;
            font-size: 12px;
            height: 16px;
            line-height: 14px;
            color: #505050;
            -webkit-box-pack: start;
            -ms-flex-pack: start;
            justify-content: flex-start;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            margin-right: 12px;
            width: 208px;
            white-space: nowrap;
            -webkit-box-align: end;
            -ms-flex-align: end;
            align-items: flex-end;
            overflow: hidden;
            padding: 0 12px 0 20px;
            user-select:none;
        }
    
        /*弹幕按钮本体*/
        .bui-switch .bui-switch-input {
            position: absolute;
            width: 30px;
            height: 20px;
            border-radius: 10px;
            opacity: 0;
            margin: 0;
            cursor: pointer;
            z-index: 1;
        }
    
        /*弹幕按钮主体*/
        .bui-switch .bui-switch-body {
            display: inline-block;
            width: 30px;
            height: 20px;
            outline: none;
            border-radius: 10px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            background: #757575;
            margin-right: 11px;
        }
    
        .bui-switch .bui-switch-input:checked+.bui-switch-label .bui-switch-body {
            background: #00a1d6;
        }
    
        /*弹幕按钮dot*/
        .bui-switch .bui-switch-dot {
            top: 2px;
            left: 2px;
            border-radius: 100%;
            width: 16px;
            height: 16px;
            background-color: #fff;
            color: #757575;
            fill: #757575;
            line-height: 16px;
            text-align: center;
            -webkit-box-shadow: 0 3px 1px 0 rgba(0, 0, 0, .05), 0 2px 2px 0 rgba(0, 0, 0, .1), 0 3px 3px 0 rgba(0, 0, 0, .05);
            box-shadow: 0 3px 1px 0 rgba(0, 0, 0, .05), 0 2px 2px 0 rgba(0, 0, 0, .1), 0 3px 3px 0 rgba(0, 0, 0, .05);
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
        }
    
        .bui-switch .bui-switch-body,
        .bui-switch .bui-switch-dot {
            position: relative;
            -webkit-transition: all .3s;
            -o-transition: all .3s;
            transition: all .3s;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
    
        .bui-switch .bui-switch-input:checked+.bui-switch-label .bui-switch-body .bui-switch-dot {
            left: 100%;
            margin-left: -18px;
            color: #00a1d6;
            fill: #00a1d6;
        }
    
        /*弹幕按钮图片*/
        .bui-switch .bui-switch-dot span {
            display: inline-block;
            width: 10px;
            height: 10px;
            font-size: 0;
        }
    
    
    
        /*弹幕设置*/
        /*bui*/
        .bui-panel.bui-dark {
            border: none;
            background: rgba(0, 0, 0, .67);
        }
    
        .bui-panel {
            -webkit-box-pack: start;
            -ms-flex-pack: start;
            justify-content: flex-start;
            border-radius: 4px 4px 0 0;
            border: 1px solid #e2e2e2;
            background: #fff;
            overflow: hidden;
        }
    
        .bui {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            vertical-align: middle;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
        }
    
        .bui-panel-wrap {
            position: relative;
            -webkit-transition: all .25s;
            -o-transition: all .25s;
            transition: all .25s;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
    
        .bui-panel-move {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: end;
            -ms-flex-align: end;
            align-items: flex-end;
            height: 100%;
            -webkit-transform: translateX(0);
            transform: translateX(0);
            -webkit-transition: -webkit-transform .25s;
            transition: -webkit-transform .25s;
            -o-transition: transform .25s;
            transition: transform .25s;
            transition: transform .25s, -webkit-transform .25s;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
    
        /*滑动条*/
        .bui-slider {
            height: 12px;
            cursor: pointer;
        }
    
        .bui-slider .bui-track {
            position: relative;
            width: 100%;
            height: 2px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
        }
    
        .bui-slider.bui-dark .bui-track .bui-bar-wrap,
        .bui-slider.bui-dark .bui-track .bui-step .bui-step-item .bui-step-dot {
            background: #505050;
        }
    
        .bui-slider .bui-track .bui-bar-wrap {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 1.5px;
            overflow: hidden;
            background: #e7e7e7;
        }
    
        .bui-slider .bui-track .bui-bar-wrap .bui-bar,
        .bui-slider .bui-track.bui-track-vertical .bui-bar-wrap .bui-bar {
            background: #00a1d6;
            background: var(--bpx-primary-color, #00a1d6);
        }
    
        .bui-slider .bui-track .bui-bar-wrap .bui-bar {
            position: absolute;
            -webkit-transform-origin: 0 0;
            transform-origin: 0 0;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: #00a1d6;
            will-change: transform;
        }
    
        .bui-slider .bui-track .bui-thumb {
            pointer-events: none;
            cursor: pointer;
        }
    
        .bui-slider .bui-track .bui-step {
            pointer-events: none;
        }
    
        .bui-slider .bui-track .bui-step .bui-step-item {
            position: absolute;
            width: 0;
        }
    
        .bui-slider .bui-track .bui-step .bui-step-item .bui-step-dot {
            height: 4px;
            width: 2px;
            background: #e5e9ef;
            border-radius: 1px;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
        }
    
    
        .bui-slider.bui-dark .bui-track .bui-bar-wrap,
        .bui-slider.bui-dark .bui-track .bui-step .bui-step-item .bui-step-dot {
            background: #505050;
        }
    
        .bui-slider .bui-track .bui-step .bui-step-item.bui-step-item-0 .bui-step-dot {
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
        }
    
        .bui-slider .bui-track .bui-step .bui-step-item.bui-step-item-100 .bui-step-dot {
            -webkit-transform: translate(-100%, -50%);
            transform: translate(-100%, -50%);
        }
    
        .bui-slider .bui-track .bui-step .bui-step-item .bui-step-text {
            position: absolute;
            bottom: 6px;
            left: 50%;
            width: 100px;
            text-align: center;
            font-size: 12px;
            color: #999;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            line-height: 12px;
        }
    
        .bui-slider.bui-dark .bui-track .bui-step .bui-step-item .bui-step-text {
            color: hsla(0, 0%, 100%, .8);
        }
    
        .bui-slider .bui-track .bui-step .bui-step-item.bui-step-item-0 .bui-step-text {
            text-align: left;
            -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
        }
    
        .bui-slider .bui-track .bui-step .bui-step-item.bui-step-item-100 .bui-step-text {
            -webkit-transform: translate(-100%, -50%);
            transform: translate(-100%, -50%);
            text-align: right;
        }
    
        .bui-slider .bui-track .bui-thumb .bui-thumb-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #00a1d6;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            vertical-align: middle;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
        }
    
        .bui-slider .bui-track .bui-thumb .bui-thumb-tooltip {
            position: absolute;
            top: -21px;
            left: 50%;
            -webkit-transform: translateX(-50%);
            transform: translateX(-50%);
            padding: 0 7px;
            line-height: 18px;
            height: 18px;
            font-size: 12px;
            background: rgba(21, 21, 21, .8);
            border-radius: 4px;
            color: #fff;
            opacity: 0;
            -webkit-transition: opacity .2s ease-in-out;
            -o-transition: opacity .2s ease-in-out;
            transition: opacity .2s ease-in-out;
            pointer-events: none;
        }
    
        /*选择框*/
        .bui-checkbox {
            display: -webkit-inline-box;
            display: -ms-inline-flexbox;
            display: inline-flex;
            position: relative;
            cursor: pointer;
            -webkit-box-pack: start;
            -ms-flex-pack: start;
            justify-content: flex-start;
        }
    
        .bilibili-player .bui-checkbox .bui-checkbox-input:checked+.bui-checkbox-label .bui-checkbox-icon svg,
        .bilibili-player .bui-checkbox:hover .bui-checkbox-icon svg {
            fill: #00a1d6;
            fill: var(--bpx-primary-color, #00a1d6)
        }
    
        .bui-checkbox .bui-checkbox-input {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            opacity: 0;
            margin: 0;
            cursor: pointer;
            z-index: 1;
        }
    
        .bui-checkbox .bui-checkbox-label {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            vertical-align: middle;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
        }
    
        .bui-checkbox .bui-checkbox-icon {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 4px;
            vertical-align: middle;
        }
    
        .bui-checkbox .bui-checkbox-icon svg {
            vertical-align: top;
            fill: #ccd0d7;
            -webkit-transition: all .2s;
            -o-transition: all .2s;
            transition: all .2s;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            width: 16px;
            height: 16px;
        }
    
        .bui-checkbox.bui-dark .bui-checkbox-icon svg {
            fill: #fff;
        }
    
        .bui-checkbox .bui-checkbox-input:checked+.bui-checkbox-label .bui-checkbox-icon svg,
        .bui-checkbox:hover .bui-checkbox-icon svg {
            fill: #00a1d6;
            fill: var(--bpx-primary-color, #00a1d6);
        }
    
        .bui-checkbox .bui-checkbox-input:checked+.bui-checkbox-label .bui-checkbox-icon svg {
            fill: #00a1d6;
        }
    
        .bui-checkbox .bui-checkbox-input:checked+.bui-checkbox-label .bui-checkbox-icon-default {
            display: none;
        }
    
        .bui-checkbox .bui-checkbox-input:checked+.bui-checkbox-label .bui-checkbox-icon-selected {
            display: inline-block;
        }
    
        .bui-checkbox .bui-checkbox-icon-selected {
            display: none;
        }
    
        .bui-checkbox .bui-checkbox-name {
            vertical-align: middle;
            font-size: 12px;
            line-height: 12px;
            color: #222;
            -webkit-transition: all .2s;
            -o-transition: all .2s;
            transition: all .2s;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            position: relative;
        }
    
        .bui-checkbox.bui-dark .bui-checkbox-name {
            color: #fff;
        }
    
        .bui-checkbox:hover .bui-checkbox-name {
            color: #00a1d6;
            color: var(--bpx-primary-color, #00a1d6)
        }
           
        /*设置主体1.12.2修复位置*/
        .bilibili-player-video-danmaku-setting {
            fill: #757575;
            font-size: 0;
            height: 46px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: relative;
            width: 30px;
            height: 30px;
            line-height: 30px;
            margin-right: 11px;
            cursor: pointer;
            user-select: none;
        }
    
        /*设置图标1.12.2修复位置*/
        .bilibili-player-video-danmaku-setting .bp-svgicon {
            height: 24px;
        }

        .bilibili-player-video-danmaku-setting .bp-svgicon span {
            display: inline-block;
            width: 24px;
            font-size: 0;
            position: absolute;
            cursor: pointer;
            z-index: 1;
            margin: middle;
        }
    
        .bilibili-player-video-danmaku-setting:hover .bp-svgicon span {
            color: #00a1d6;
            fill: #00a1d6;
        }
    
        /*设置显示提示*/
        .bilibili-player-video-danmaku-setting:hover .bilibili-player-video-danmaku-setting-wrap {
            display: inline-block;
        }
    
        .bilibili-player-video-danmaku-setting-wrap {
            display: none;
            cursor: default;
            background: none;
            border: none;
            border-radius: 4px 4px 0 0;
            text-align: left;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 298px;
            height: 366px;
            font-size: 12px;
            z-index: 1001;
    
            /* 定位 */
            position: absolute;
            bottom: 5px;
            /* 46px */
            right: -149px;
            /*-149px */
            /*margin-left: 0px;*/
        }
    
        .bilibili-player-video-danmaku-setting-box {
            position: absolute;
            right: 0;
            bottom: 35px;
        }
    
        .bilibili-player-video-danmaku-setting-box {
            background: rgba(21, 21, 21, .9) !important;
            border-radius: 2px !important;
        }
    
        .bilibili-player-video-danmaku-setting-left {
            width: 100%;
            height: 100%;
            padding: 12px 20px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
        }
    
        /*选项大致*/
        .bilibili-player-video-danmaku-setting-left-area,
        .bilibili-player-video-danmaku-setting-left-fontsize,
        .bilibili-player-video-danmaku-setting-left-opacity,
        .bilibili-player-video-danmaku-setting-left-speedplus {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            width: 100%;
            height: 16px;
            line-height: 16px;
            margin-bottom: 24px;
        }
    
        .bilibili-player-video-danmaku-setting-left-area-title,
        .bilibili-player-video-danmaku-setting-left-block-title,
        .bilibili-player-video-danmaku-setting-left-fontsize-title,
        .bilibili-player-video-danmaku-setting-left-opacity-title,
        .bilibili-player-video-danmaku-setting-left-speedplus-title {
            text-align: left;
            height: 16px;
            line-height: 16px;
            margin-bottom: 4px;
            color: #fff;
        }
    
        .bilibili-player-video-danmaku-setting-left-area-content,
        .bilibili-player-video-danmaku-setting-left-fontsize-content,
        .bilibili-player-video-danmaku-setting-left-opacity-content,
        .bilibili-player-video-danmaku-setting-left-speedplus-content {
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            width: 200px;
            height: 12px;
            margin-left: 10px;
        }
    
        /*选择框细节*/
        .bilibili-player-video-danmaku-setting-left-danmaku-density,
        .bilibili-player-video-danmaku-setting-left-bigsmall,
        .bilibili-player-video-danmaku-setting-left-preventshade {
            margin-bottom: 12px;
            height: 16px;
            line-height: 16px;
            float: left;
            color: #212121;
        }
    
        .bilibili-player-video-danmaku-setting-left-danmaku-density,
        .bilibili-player-video-danmaku-setting-left-bigsmall {
            margin-left: 10px;
        }
    
        .bilibili-player-video-danmaku-setting-left-danmaku-density label:hover,
        .bilibili-player-video-danmaku-setting-left-danmaku-density label:hover .bpui-icon-checkbox.icon-12checkbox,
        .bilibili-player-video-danmaku-setting-left-bigsmall label:hover,
        .bilibili-player-video-danmaku-setting-left-bigsmall label:hover .bpui-icon-checkbox.icon-12checkbox,
        .bilibili-player-video-danmaku-setting-left-preventshade label:hover,
        .bilibili-player-video-danmaku-setting-left-preventshade label:hover .bpui-icon-checkbox.icon-12checkbox {
            -webkit-box-shadow: none !important;
            box-shadow: none !important
        }
    
        .bilibili-player-video-danmaku-setting-left-danmaku-density:hover .bpui-checkbox-text,
        .bilibili-player-video-danmaku-setting-left-bigsmall:hover .bpui-checkbox-text,
        .bilibili-player-video-danmaku-setting-left-preventshade:hover .bpui-checkbox-text {
            color: #00a1d6
        }
    
        .bilibili-player-video-danmaku-setting-left-danmaku-density:hover .bpui-icon-checkbox.icon-12checkbox,
        .bilibili-player-video-danmaku-setting-left-bigsmall:hover .bpui-icon-checkbox.icon-12checkbox,
        .bilibili-player-video-danmaku-setting-left-preventshade:hover .bpui-icon-checkbox.icon-12checkbox {
            -webkit-box-shadow: none;
            box-shadow: none;
            border: 1px solid #00a1d6
        }
    
        /*block*/
        .bilibili-player-video-danmaku-setting-left-block {
            overflow: hidden;
            margin-bottom: 12px;
        }
    
        /*第一行打横*/
        .bilibili-player-video-danmaku-setting-left-block-content {
            position: relative;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            height: 42px;
            overflow: hidden;
            cursor: pointer;
        }
    
        /*第一行图标行距*/
        .bilibili-player-video-danmaku-setting-left-block-content .bilibili-player-block-filter-type {
            position: relative;
            width: 28px;
            height: 100%;
            margin: 0 22px 16px 0;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            color: hsla(0, 0%, 100%, .8);
            -webkit-transition: all .2s ease-in-out;
            transition: all .2s ease-in-out;
            cursor: pointer;
        }
    
        /*第一行图标字体上色*/
        .bilibili-player-video-danmaku-setting-left-block-content .bilibili-player-block-filter-type .bilibili-player-block-filter-image {
            /*position: relative;*/
            display: inline-block;
            font-size: 0;
            width: 28px;
            height: 28px;
            line-height: 28px;
            top: -5px;
            color: hsla(0, 0%, 100%, .8);
            fill: hsla(0, 0%, 100%, .8);
        }

        /*ban弹幕图标字体*/
        .bilibili-player-block-filter-type.bpx-player-active .bilibili-player-block-filter-label {
            color: #00a1d6!important;
            color: var(--bpx-fn-color,#00a1d6)!important;
        }
        
        /*ban弹幕图标上色*/
        .bilibili-player-block-filter-type.bpx-player-active .bilibili-player-block-filter-image {
            color: #00a1d6!important;
            color: var(--bpx-fn-color,#00a1d6)!important;
            fill: #00a1d6!important;
            fill: var(--bpx-fn-color,#00a1d6)!important;
        }
    
    
        .bilibili-player-video-danmaku-setting-left-block-content .bilibili-player-block-filter-type .bilibili-player-block-filter-label {
            position: absolute;
            left: 0;
            bottom: -2px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 100%;
            height: 16px;
            padding: 0;
            margin: 0;
            text-align: center;
            line-height: 16px;
            color: hsla(0, 0%, 100%, .8);
            font-size: 12px;
            -webkit-transition: none;
            transition: none;
        }
    
        .bilibili-player-video-danmaku-setting-left-block-content .bilibili-player-block-filter-type:hover .bilibili-player-block-filter-image {
            color: #fff;
            fill: #fff
        }
    
        .bilibili-player-video-danmaku-setting-left-block-content .bilibili-player-block-filter-type:hover .bilibili-player-block-filter-label {
            color: #fff
        }
    
        .bilibili-player-video-danmaku-setting-left-block-content .bilibili-player-block-filter-type.disabled .bilibili-player-block-filter-image {
            color: #00a1d6 !important;
            fill: #00a1d6 !important
        }
    
        .bilibili-player-video-danmaku-setting-left-block-content .bilibili-player-block-filter-type.disabled .bilibili-player-block-filter-label {
            color: #00a1d6 !important
        }
    
        /*flag*/
        .bilibili-player-video-danmaku-setting-left-flag {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            margin-bottom: 12px;
            font-size: 12px;
            line-height: 16px;
        }
    
        .bilibili-player-video-danmaku-setting-left-flag-title {
            -webkit-box-flex: 0;
            -ms-flex: none;
            flex: none;
            color: white;
        }
    
        .bilibili-player-video-danmaku-setting-left-flag-content {
            width: 100%;
            margin-left: 10px;
            padding-top: 2px;
            opacity: 1
        }
    
        .bilibili-player-video-danmaku-setting-left-flag-content .bui-step {
            display: none
        }
    
        .bilibili-player-video-danmaku-setting-left-flag.bilibili-player-unchecked .bilibili-player-video-danmaku-setting-left-flag-content {
            position: relative
        }
    
        .bilibili-player-video-danmaku-setting-left-flag.bilibili-player-unchecked .bilibili-player-video-danmaku-setting-left-flag-content .bilibili-player-setting-flag {
            opacity: 0
        }
    
        .bilibili-player-video-danmaku-setting-left-flag.bilibili-player-unchecked .bilibili-player-video-danmaku-setting-left-flag-content:after {
            display: inline-block;
            content: "全站视频将按等级屏蔽弹幕";
            position: absolute;
            top: 0;
            left: 0;
            color: #999
        }
    
        /*fontsize*/
        .bilibili-player-video-danmaku-setting-left-fontsize {
            margin-bottom: 12px;
        }
    
        /*preventshade*/
        .bilibili-player-video-danmaku-setting-left-preventshade {
            clear: left;
            margin-bottom: 14px;
        }
    
        /*block-word按钮*/
        .bilibili-player-video-danmaku-setting-left-block-word {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            width: 100%;
            line-height: 24px;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            margin-bottom: 14px;
            text-align: center;
            cursor: pointer;
        }
    
        .bilibili-player-video-danmaku-setting-left-block-word .bilibili-player-video-danmaku-setting-left-block-add,
        .bilibili-player-video-danmaku-setting-left-block-word .bilibili-player-video-danmaku-setting-left-block-sync {
            width: 126px;
            border-radius: 2px;
            background: hsla(0, 0%, 100%, .3);
            cursor: pointer;
            color: white;
        }
    
        .bilibili-player-video-danmaku-setting-left-block-word .bilibili-player-video-danmaku-setting-left-block-add:hover,
        .bilibili-player-video-danmaku-setting-left-block-word .bilibili-player-video-danmaku-setting-left-block-sync:hover {
            background: hsla(0, 0%, 100%, .4);
        }
    
        /*更多设置*/
        .bilibili-player-video-danmaku-setting-left .bilibili-player-video-danmaku-setting-left-more {
            clear: left;
            color: #fff;
            fill: #fff;
            line-height: 16px;
            height: 16px;
            text-align: left;
            cursor: pointer;
            position: relative;
            top: 4px;
        }
    
        .bilibili-player-video-danmaku-setting-left-more:hover,
        .bilibili-player-video-danmaku-setting-left-more:hover .bp-svgicon {
            color: #00a1d6;
            fill: #00a1d6;
        }
    
        /*箭头*/
        .bilibili-player-video-danmaku-setting-left-more .bp-svgicon {
            position: absolute;
            right: 0;
            height: 16px;
            width: 16px;
            vertical-align: middle;
            margin-right: -3px;
        }
    
        .bilibili-player-video-danmaku-setting-left-more-text {
            vertical-align: middle;
            display: inline-block;
            -webkit-transition: color .3s;
            transition: color .3s;
        }
    
    
        /*线路整体*/
        .bilibili-player-video-btn.bilibili-player-video-btn-quality {
    
            fill: #757575;
            font-size: 0;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            position: relative;
            width: auto;
            height: 64px;
            line-height: 30px;
            margin-right: 11px;
            color: #fff;
            /*top: 5px;*/
            user-select: none;
        }
    
        /*hover*/
        .bilibili-player-video-btn-quality:hover .bui-select.bui-select-quality-menu .bui-select-list {
            opacity: 1;
            display: block;
            visibility: visible;
        }
    
        /*.bilibili-player-video-btn-quality:hover .bui-select.bui-select-quality-menu .bui-select-result {
            background: #00a1d6;
        }*/
    
        .bui-select .bui-select-item:hover {
            background: #e7e7e7;
        }
    
        .bui-select.bui-dark .bui-select-item:hover {
            background: hsla(0, 0%, 100%, .1);
        }
    
        /*list*/
        .bui-select.bui-select-quality-menu .bui-select-list {
            font-size: 12px;
            width: 169px;
            height: auto !important;
            text-align: left;
            background: rgba(21, 21, 21, .9);
            border-radius: 2px;
            padding: 0;
    
            -webkit-transition: all .2s;
            -o-transition: all .2s;
            transition: all .2s;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
    
            position: absolute;
            /* 定位 */
            z-index: 1;
            bottom: 35px;
            /* left: 50%;13.2.2*/
            margin-left:-100px; /* -84.5px;13.2.2*/
  
            opacity: 0;
            display: none;
            z-index: 1001; /*13.0*/ 
        }
    
        /*表面*/
        .bui-select.bui-select-quality-menu .bui-select-result {
            /*background: #757575;*/
            background-color: rgb(251, 114, 153);
            border-radius: 5px;
            /* font-weight: 600; */
            width: 100%;
            user-select: none;
            cursor: pointer;
            display: block;
            padding: 0 2px;
            text-align: center;
            color: #fff;
            font-size: 12px;
            height: 16px;
            line-height: 16px;
        }
    
        /*选项格式*/
        .bilibili-player-video-quality-menu.bui-select.bui-dark .bui-select-list .bui-select-item {
            padding: 0 12px;
            height: 36px;
            line-height: 36px;
            white-space: nowrap;
            color: #fff;
            cursor: pointer
        }
   
        .bilibili-player-video-subtitle-setting-color .bui-select-item>span,
        .bilibili-player-video-subtitle-setting-color .bui-select-result>span {
            vertical-align: middle
        }
    
        .bilibili-player-video-subtitle-setting-color .bui-select-item>span:first-child,
        .bilibili-player-video-subtitle-setting-color .bui-select-result>span:first-child {
            width: 12px;
            height: 12px;
            display: inline-block;
            border-radius: 2px;
            margin-right: 8px
        }
    
        .bui-select-item.bui-select-item-active .bilibili-player-video-quality-text {
            color: #00a1d6;
        }
    
        .bilibili-player-video-btn .bilibili-player-video-quality-menu .bilibili-player-bigvip {
            position: relative;
            color: #fff;
            background-color: #f25d8e;
            margin-left: 27px;
            padding: 0 5px;
            border-radius: 8px;
            height: 16px;
            line-height: 16px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            user-select: none;
            float: right;
            top: 28%;
        }
    
        /*文本*/
        .bilibili-player-video-quality-text {
            user-select: none;
        }

        /*moreset*/
        .bilibili-player-video-danmaku-setting-right {
            width: 100%;
            height: 100%;
            padding: 0 20px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box
        }
    
        .bilibili-player-video-danmaku-setting-right .bui-select {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex
        }
    
        .bilibili-player-video-danmaku-setting-right-more {
            color: #fff;
            fill: #fff;
            line-height: 1;
            text-align: left;
            cursor: pointer;
            height: 32px;
            line-height: 32px
        }
    
        .bilibili-player-video-danmaku-setting-right-more-text {
            vertical-align: middle;
            display: inline-block;
            -webkit-transition: color .3s;
            transition: color .3s
        }
    
        .bilibili-player-video-danmaku-setting-right-more .bp-svgicon {
            width: 20px;
            /*height: 30px; 12.6.4*/
            vertical-align: middle;
            display: inline-block;
            cursor: pointer;
            margin-left: -3px
        }
    
        .bilibili-player-video-danmaku-setting-right-more:hover,
        .bilibili-player-video-danmaku-setting-right-more:hover .bp-svgicon {
            color: #00a1d6;
            fill: #00a1d6
        }
    
        .bilibili-player-video-danmaku-setting-right-separator {
            width: 305px;
            border-bottom: 1px solid rgba(229, 233, 239, .1);
            position: relative;
            right: 20px
        }
    
        .bilibili-player-video-danmaku-setting-right-fullscreensync,
        .bilibili-player-video-danmaku-setting-right-speedsync {
            height: 16px;
            line-height: 16px;
            right: 2px
        }
    
        .bilibili-player-video-danmaku-setting-right-fullscreensync {
            margin-top: 12px;
            margin-bottom: 6px
        }
    
        .bilibili-player-video-danmaku-setting-right-font,
        .bilibili-player-video-danmaku-setting-right-speedsync {
            margin-bottom: 12px
        }
    
        .bilibili-player-video-danmaku-setting-right-font-content {
            float: left;
            margin-bottom: 12px
        }
       
        .bilibili-player-video-danmaku-setting-right-font-content .bpui-selectmenu {
            border-radius: 0
        }
    
        .bilibili-player-video-danmaku-setting-right-font-content .bpui-selectmenu-list li {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 100%;
            height: 22px;
            line-height: 22px
        }
    
        .bilibili-player-video-danmaku-setting-right-font-content .bpui-selectmenu-list li:hover {
            background: #e7e7e7
        }
    
        .bilibili-player-video-danmaku-setting-right-font-bold {
            color: #212121;
            float: left;
            height: 16px;
            line-height: 16px;
            position: relative;
            top: 4px;
            left: 14px
        }
    
        .bilibili-player-video-danmaku-setting-right-font-bold label:hover,
        .bilibili-player-video-danmaku-setting-right-font-bold label:hover .bpui-icon-checkbox.icon-12checkbox {
            -webkit-box-shadow: none !important;
            box-shadow: none !important
        }
    
        .bilibili-player-video-danmaku-setting-right-font-bold:hover .bpui-checkbox-text {
            color: #00a1d6
        }
    
        .bilibili-player-video-danmaku-setting-right-font-bold:hover .bpui-icon-checkbox.icon-12checkbox {
            -webkit-box-shadow: none;
            box-shadow: none;
            border: 1px solid #00a1d6
        }
    
        .bilibili-player-video-danmaku-setting-right-fontborder {
            clear: left;
            margin-bottom: 12px
        }
    
        .bilibili-player-video-danmaku-setting-right-fontborder-content.bpui-tab-list-type-button {
            width: 100%
        }
    
        .bilibili-player-video-danmaku-setting-right-fontborder-content .bpui-tab-list {
            width: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between
        }
    
        .bilibili-player-video-danmaku-setting-right-fontborder-content .bpui-tab-list .bpui-tab-list-row {
            width: 70px;
            height: 24px;
            line-height: 24px;
            cursor: pointer;
            color: #fff;
            background: #999;
            border-radius: 2px;
            padding: 0;
            margin: 0
        }
    
        .bilibili-player-video-danmaku-setting-right-fontborder-content .bpui-tab-list .bpui-tab-list-row:hover {
            color: #fff;
            background: #757575
        }
    
        .bilibili-player-video-danmaku-setting-right-fontborder-content .bpui-tab-list .bpui-tab-list-row.bpui-state-selected {
            color: #fff;
            padding: 0;
            margin: 0;
            background: #00a1d6
        }
    
        .bilibili-player-video-danmaku-setting-right-type {
            margin-bottom: 12px
        }
    
        .bilibili-player-video-danmaku-setting-right-type .bpui-selectmenu {
            border-radius: 0
        }
    
        .bilibili-player-video-danmaku-setting-right-type .bpui-selectmenu-list li {
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 100%;
            height: 22px;
            line-height: 22px
        }
    
        .bilibili-player-video-danmaku-setting-right-type .bpui-selectmenu-list li:hover {
            background: #e7e7e7
        }
    
        .bilibili-player-video-danmaku-setting-right-type-content {
            width: 166px;
            height: 24px;
            line-height: 24px
        }
    
        .bilibili-player-video-danmaku-setting-right-font-title,
        .bilibili-player-video-danmaku-setting-right-fontborder-title,
        .bilibili-player-video-danmaku-setting-right-type-title {
            clear: left;
            text-align: left;
            height: 16px;
            line-height: 16px;
            margin-bottom: 4px;
            color: #fff
        }
    
        /*选项与更多设置*/
        .bui-panel-item.bui-panel-item-active {
            opacity: 1;
            pointer-events: auto;
        }
    
        .bui-panel-item {
            opacity: 0;
            pointer-events: none;
            -webkit-transition: opacity .1s;
            -o-transition: opacity .1s;
            transition: opacity .1s;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
        .bui-panel-move {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: end;
            -ms-flex-align: end;
            align-items: flex-end;
            height: 100%;
            -webkit-transform: translateX(0);
            transform: translateX(0);
            -webkit-transition: -webkit-transform .25s;
            transition: -webkit-transform .25s;
            -o-transition: transform .25s;
            transition: transform .25s;
            transition: transform .25s,-webkit-transform .25s;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }

        /*恢复默认*/
        .bilibili-player-video-danmaku-setting-right-reset.bui-button {
            width: 116px;
            height: 22px;
            line-height: 22px;
            margin-top: 9px;
            color: #fff;
            border: 1px solid hsla(0,0%,100%,.2);
            vertical-align: middle;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
        }        

        .bilibili-player-video-danmaku-setting-right-reset:hover {
            color: #00a1d6;
            color: var(--bpx-fn-color,#00a1d6);
            border-color: #00a1d6;
            border-color: var(--bpx-fn-color,#00a1d6);
        }

        .bilibili-player-video-danmaku-setting-right-reset {
            min-width: 68px;
            font-size: 12px;
            font-size: var(--bpx-ui-font-size,12px);
            border-radius: 2px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            -webkit-transition: all .2s;
            -o-transition: all .2s;
            transition: all .2s;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            background: none;
            padding: 3px;
            outline: none;
            color: inherit;
            text-align: inherit;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
        }
        .bilibili-player-video-danmaku-setting-right-reset {
            width: 100%;
            height: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            vertical-align: middle;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: start;
            -ms-flex-pack: start;
            justify-content: flex-start;
            line-height: normal;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
        /*下拉选择框*/
        /*表面*/
        .bui-select.bui-dark .bui-select-border {
            border: 1px solid hsla(0,0%,100%,.2);
        }
        .bui-select .bui-select-border {
            border-radius: 2px;
            width: 100%;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            font-size: 12px;
            font-size: var(--bpx-ui-font-size,12px);
            border: 1px solid silver;
        }
        .bilibili-player-video-danmaku-setting-right-font-content-fontfamily {
            width: 164px
        }
    
        .bilibili-player-video-danmaku-setting-right-font-content-fontfamilycustom {
            display: block;
            width: 166px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            height: 22px;
            line-height: 24px;
            margin-top: 10px
        }
        /*下拉表面*/
        .bui-select-bscroll .bui-select-unfold .bui-select-list-wrap {
            height: auto!important;
        }
        .bui-select-bscroll .bui-select-list-wrap {
            height: 0;
            position: relative;
            overflow: hidden;
            color:white;/*附加*/
        }

        .bui-select-bscroll .bui-select-list-wrap {
            height: 0;
            position: relative;
            overflow: hidden;
            display:none;
        }
        .bui-select.bui-dark .bui-select-header {
            height: 20px;
            line-height: 20px;
            color:white;/*附加*/
        }
        .bui-select .bui-select-header {
            position: relative;
            padding: 0 22px 0 7px;
            height: 22px;
            line-height: 22px;
        }

        /*.bui-select-wrap:hover .bui-select-list-wrap{
            display:block;  
        }*/

        .bui-select.bui-dark .bui-select-header, .bui-select.bui-dark .bui-select-item {
            height: 20px;
            line-height: 20px;
        }
        .bui-select .bui-select-item {
            padding: 0 22px 0 7px;
            height: 22px;
            line-height: 22px;
            -webkit-transition: background .3s;
            -o-transition: background .3s;
            transition: background .3s;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
        }
        /*描边类型*/
        .bui-radio .bui-radio-button .bui-radio-item {
            -webkit-box-flex: 1;
            -ms-flex: 1;
            flex: 1;
            text-align: center;
            /*12.6.4*/
            color: white;
            white-space:nowrap;
            height:22px;
            width:70px;

        }
        .bui-radio .bui-radio-item {
            position: relative;
            display: inline-block;
        }

        .bui-radio .bui-radio-button .bui-radio-group {/*12.6.4整体*/
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
            -ms-flex-pack: justify;
            justify-content: space-between;
            height: 100%;
        }

        .bui-radio .bui-radio-input {/*12.6.4选择框本体*/
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            opacity: 0;
            margin: 0;
            cursor: pointer;
        }

        .bui-radio.bui-dark .bui-radio-button .bui-radio-input:checked+.bui-radio-label {
            background: #00a1d6;
            background: var(--bpx-fn-color, #00a1d6);
        }
    
        .bui-radio.bui-dark .bui-radio-button .bui-radio-item:hover .bui-radio-label {
            background-color: hsla(0, 0%, 100%, .4);
        }
    
        .bui-radio .bui-radio-button .bui-radio-input:checked+.bui-radio-label {
            background: #00a1d6;
            background: var(--bpx-fn-color, #00a1d6);
        }
    
        .bui-radio .bui-radio-button .bui-radio-item:hover .bui-radio-label {
            background-color: #757575;
        }
    
        .bui-radio.bui-dark .bui-radio-button .bui-radio-label {
            background-color: hsla(0, 0%, 100%, .3);
        }
    
        .bui-radio .bui-radio-button .bui-radio-label {
            background-color: #999;
            -webkit-transition: all .2s;
            -o-transition: all .2s;
            transition: all .2s;
            border-radius: 2px;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            padding: 0px 0;/*12.6.4 2px 0*/
        }
    
        .bui-radio .bui-radio-label {
            font-size: 12px;
            font-size: var(--bpx-ui-font-size, 12px);
            width: 100%;
            height: 100%;
            pointer-events: none;
            display: inline-block;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            line-height: normal;/*.bui .bui-area*/
        }
        /*返回*/
        .bpx-player-dm-setting-right-more .bpx-common-svg-icon {
            width: 20px;
            height: 30px;
            vertical-align: middle;
            display: inline-block;
            cursor: pointer;
            margin-left: -3px;
        }
        /*宽屏*/
        .squirtle-block-wrap {
            font-style: normal;
            font-size: 12px;
            line-height: 1;
            -webkit-box-direction: normal;
            color: hsla(0, 0%, 100%, .9);
            font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif;
            appearance: none;
            margin: 0;
            padding: 0;
            height: 22px;
            width: 36px;
            cursor: pointer;
            margin-left:auto;
            z-index:1002;
        }

        .squirtle-widescreen-inactive {
            font-style: normal;
            font-size: 12px;
            line-height: 1;
            -webkit-box-direction: normal;
            color: hsla(0, 0%, 100%, .9);
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif;
            appearance: none;
            margin: 0;
            padding: 0;
            display: block;
        }

        .squirtle-widescreen-active {
            font-style: normal;
            font-size: 12px;
            line-height: 1;
            -webkit-box-direction: normal;
            color: hsla(0, 0%, 100%, .9);
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif;
            appearance: none;
            margin: 0;
            padding: 0;
            display: none;
        }

        .squirtle-svg-icon {
            font-style: normal;
            font-size: 12px;
            line-height: 1;
            -webkit-box-direction: normal;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica, Arial, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif;
            appearance: none;
            margin: 0;
            padding: 0;
            width: 100%;
            height: 22px;
            fill: #757575;
        } 
        
        @keyframes widescreenAn
        {
            0%   {transform: scaleX(1);}
            19%  {transform: scaleX(0.8);}
            31%  {transform: scaleX(0.8);}
            50%  {transform: scaleX(1.2);}
            69%  {transform: scaleX(0.8);}
            81%  {transform: scaleX(0.8);}
            100% {transform: scaleX(1);}
        }

        .squirtle-video-widescreen:hover .squirtle-widescreen-inactive{
            animation: widescreenAn 0.6s linear;
            /* Safari 与 Chrome: */
            -webkit-animation: widescreenAn 0.6s linear;
        }

        `

            GM_addStyle(bottomcss);

            //1.11.8 接口
            let category_1_html = "";
            originalInterfaceList.forEach((item, index) => {
                if (item.category == "1" && item.special) {
                    category_1_html += `<li class="bui-select-item" data-index=` + index + `><span class="bilibili-player-video-quality-text">` + item.name + `</span><span class="bilibili-player-bigvip">` + item.special + `</span></li>`;
                } else {
                    category_1_html += `<li class="bui-select-item" data-index=` + index + `><span class="bilibili-player-video-quality-text">` + item.name + `</span></li>`;
                }
            });


            let bottomdiv = `
            <div class="bilibili-player-video-bottom-area style='z-index:1;position:relative;/*12.7修复z-index*/'">
            <div class="bilibili-player-video-info bilibili-player-ogv-hide" title="">
                <div class="bilibili-player-video-info-people-number">0</div>
                <div class="bilibili-player-video-info-people-text">人正在看</div>
                <div class="bilibili-player-video-info-danmaku">
                    <span class="bilibili-player-video-info-danmaku-dot">,</span>
                    <span class="bilibili-player-video-info-danmaku-number">0</span>
                    <span class="bilibili-player-video-info-danmaku-text">条弹幕</span>
                </div>
                <div class="bilibili-player-video-info-tips"><span class="bp-svgicon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.422 9.261v-.066c0-.365.2-.705.53-.902C9.63 7.886 10 7.407 10 6.856 10 5.83 9.105 5 8 5s-2 .83-2 1.856c0 .216.188.391.422.391.232 0 .42-.174.42-.391 0-.594.52-1.075 1.16-1.075.64 0 1.157.481 1.157 1.075 0 .243-.2.503-.662.78-.57.342-.916.929-.916 1.559v.066c0 .216.188.391.42.391.231 0 .42-.175.42-.391v0zm-.889 1.31c0 .238.21.429.467.429.258 0 .467-.193.467-.428 0-.237-.209-.429-.467-.43-.258 0-.467.193-.467.43v0z" fill="#505050" stroke="#505050" stroke-width=".2"></path><circle cx="8" cy="8" r="5.5" stroke="#505050"></circle></svg></span></div>
            </div>
            <div class="bui-switch" aria-label="弹幕显示隐藏">
                <input class="bui-switch-input" type="checkbox" checked="">
                <label class="bui-switch-label">
                    <span class="bui-switch-name"></span>
                    <span class="bui-switch-body">
                        <span class="bui-switch-dot">
                            <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
                                    <path
                                        d="M1.311 3.759l-.153 1.438h2.186c0 1.832-.066 3.056-.175 3.674-.131.618-.688.959-1.683 1.023-.284 0-.568-.021-.874-.043L.317 8.818c.284.032.59.053.896.053.546 0 .852-.17.929-.511.077-.341.12-1.076.12-2.204H0l.306-3.344h1.847V1.427H.098V.479h3.18v3.28H1.311zM4 1.747h1.311A8.095 8.095 0 004.492.426L5.53.085c.306.426.579.873.809 1.363l-.689.299h1.508c.306-.544.569-1.129.809-1.747l1.082.373c-.219.511-.47.969-.743 1.374h1.268V6.23H7.322v.82H10v1.044H7.322V10H6.208V8.094H3.607V7.05h2.601v-.82H4V1.747zm4.568 3.557v-.831H7.322v.831h1.246zm-2.36 0v-.831H5.016v.831h1.192zM5.016 3.557h1.191v-.873H5.016v.873zm2.306-.873v.873h1.246v-.873H7.322z">
                                    </path>
                                </svg></span>
                        </span>
                    </span>
                </label>
            </div>
            <div class="bilibili-player-video-danmaku-setting">
                <span class="bp-svgicon">
                    <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                            <path
                                d="M16.5 8c1.289 0 2.49.375 3.5 1.022V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h7.022A6.5 6.5 0 0116.5 8zM7 13H5a1 1 0 010-2h2a1 1 0 010 2zm2-4H5a1 1 0 010-2h4a1 1 0 010 2z">
                            </path>
                            <path
                                d="M20.587 13.696l-.787-.131a3.503 3.503 0 00-.593-1.051l.301-.804a.46.46 0 00-.21-.56l-1.005-.581a.52.52 0 00-.656.113l-.499.607a3.53 3.53 0 00-1.276 0l-.499-.607a.52.52 0 00-.656-.113l-1.005.581a.46.46 0 00-.21.56l.301.804c-.254.31-.456.665-.593 1.051l-.787.131a.48.48 0 00-.413.465v1.209a.48.48 0 00.413.465l.811.135c.144.382.353.733.614 1.038l-.292.78a.46.46 0 00.21.56l1.005.581a.52.52 0 00.656-.113l.515-.626a3.549 3.549 0 001.136 0l.515.626a.52.52 0 00.656.113l1.005-.581a.46.46 0 00.21-.56l-.292-.78c.261-.305.47-.656.614-1.038l.811-.135A.48.48 0 0021 15.37v-1.209a.48.48 0 00-.413-.465zM16.5 16.057a1.29 1.29 0 11.002-2.582 1.29 1.29 0 01-.002 2.582z">
                            </path>
                        </svg></span>
                </span>
                <div class="bilibili-player-video-danmaku-setting-wrap">
                    <div class="bilibili-player-video-danmaku-setting-box bui bui-panel bui-dark">
                        <div class="bui-panel-wrap" style="width: 298px; height: 366px;">
                            <div class="bui-panel-move" style="width: 564px; transform: translateX(0px);">
    
                                <div class="bui-panel-item bui-panel-item-active" style="width: 298px; height: 366px;">
                                    <div class="bilibili-player-video-danmaku-setting-left">
                                        <div class="bilibili-player-video-danmaku-setting-left-block">
                                            <div class="bilibili-player-video-danmaku-setting-left-block-title">按类型屏蔽</div>
                                            <div class="bilibili-player-video-danmaku-setting-left-block-content">
                                                <div class="bilibili-player-block-filter-type "
                                                    data-name="ctlbar_danmuku_scroll_on" ftype="scroll"><span
                                                        class="bilibili-player-block-filter-image"><span
                                                            class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 28 28">
                                                                <path
                                                                    d="M23 3H5a4 4 0 00-4 4v14a4 4 0 004 4h18a4 4 0 004-4V7a4 4 0 00-4-4zM11 9h6a1 1 0 010 2h-6a1 1 0 010-2zm-3 2H6V9h2v2zm4 4h-2v-2h2v2zm9 0h-6a1 1 0 010-2h6a1 1 0 010 2z">
                                                                </path>
                                                            </svg></span></span>
                                                    <div class="bilibili-player-block-filter-label">滚动</div>
                                                </div>
                                                <div class="bilibili-player-block-filter-type "
                                                    data-name="ctlbar_danmuku_top_on" ftype="top"><span
                                                        class="bilibili-player-block-filter-image"><span
                                                            class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 28 28">
                                                                <path
                                                                    d="M23 3H5a4 4 0 00-4 4v14a4 4 0 004 4h18a4 4 0 004-4V7a4 4 0 00-4-4zM9 9H7V7h2v2zm4 0h-2V7h2v2zm4 0h-2V7h2v2zm4 0h-2V7h2v2z">
                                                                </path>
                                                            </svg></span></span>
                                                    <div class="bilibili-player-block-filter-label">顶部</div>
                                                </div>
                                                <div class="bilibili-player-block-filter-type "
                                                    data-name="ctlbar_danmuku_bottom_on" ftype="bottom"><span
                                                        class="bilibili-player-block-filter-image"><span
                                                            class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 28 28">
                                                                <path
                                                                    d="M23 3H5a4 4 0 00-4 4v14a4 4 0 004 4h18a4 4 0 004-4V7a4 4 0 00-4-4zM9 21H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z">
                                                                </path>
                                                            </svg></span></span>
                                                    <div class="bilibili-player-block-filter-label">底部</div>
                                                </div>
                                                <div class="bilibili-player-block-filter-type "
                                                    data-name="ctlbar_danmuku_color_on" ftype="color"><span
                                                        class="bilibili-player-block-filter-image"><span
                                                            class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 28 28">
                                                                <path
                                                                    d="M17.365 11.118c0-.612-.535-1.147-1.147-1.147s-1.147.535-1.147 1.147c0 .611.535 1.147 1.147 1.147s1.147-.536 1.147-1.147zM12.93 9.665c-.764 0-1.376.611-1.376 1.3 0 .689.612 1.301 1.376 1.301s1.376-.612 1.376-1.301-.612-1.3-1.376-1.3zM9.794 11.883c-.764 0-1.376.612-1.376 1.3 0 .689.612 1.3 1.376 1.3s1.376-.611 1.376-1.3c.001-.688-.611-1.3-1.376-1.3zM10.023 15.171c-.612 0-1.147.536-1.147 1.148 0 .611.535 1.146 1.147 1.146s1.147-.535 1.147-1.146c.001-.612-.535-1.148-1.147-1.148zM17.823 12.953c-.611 0-1.147.535-1.147 1.147s.536 1.147 1.147 1.147c.612 0 1.148-.535 1.148-1.147s-.536-1.147-1.148-1.147z">
                                                                </path>
                                                                <path
                                                                    d="M23.177 3H4.824C2.683 3 1 4.833 1 7.167v13.665C1 23.167 2.683 25 4.824 25h18.353C25.318 25 27 23.167 27 20.833V7.167C27 4.833 25.318 3 23.177 3zm-3.442 13.624c-1.987.612-4.129-.154-5.046.764-.918.918 1.529 1.606 0 2.219-1.988.84-7.341-.535-8.182-4.053-.841-3.441 2.905-6.5 5.888-7.035 2.906-.535 6.041.841 8.181 2.982 2.065 2.141.765 4.74-.841 5.123z">
                                                                </path>
                                                            </svg></span></span>
                                                    <div class="bilibili-player-block-filter-label">彩色</div>
                                                </div>
                                                <div class="bilibili-player-block-filter-type "
                                                    data-name="ctlbar_danmuku_special_on" ftype="special"><span
                                                        class="bilibili-player-block-filter-image"><span
                                                            class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 28 28">
                                                                <path
                                                                    d="M23 3H5a4 4 0 00-4 4v14a4 4 0 004 4h18a4 4 0 004-4V7a4 4 0 00-4-4zM7.849 11.669l.447-.828.492.782.894.184-.536.736.134.966-.85-.321-.804.414.045-.967L7 11.946l.849-.277zm3.352 7.101l-1.43-.506L8.43 19v-1.565L7.357 16.33l1.43-.506.67-1.381.894 1.289 1.475.23-.894 1.289.269 1.519zm7.95-3.9l-2.816-.69-2.458 1.565-.223-2.946-2.145-1.933 2.637-1.151L15.263 7l1.877 2.255 2.86.23-1.52 2.531.671 2.854z">
                                                                </path>
                                                            </svg></span></span>
                                                    <div class="bilibili-player-block-filter-label">高级</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-left-flag">
                                            <div class="bilibili-player-video-danmaku-setting-left-flag-title">去重概率</div>
                                            <div class="bilibili-player-video-danmaku-setting-left-flag-content">
                                                <div class="bilibili-player-setting-flag bui bui-slider bui-dark">
                                                    <div class="bui-track">
                                                        <div class="bui-bar-wrap">
    
    
                                                            <div class="bui-bar bui-bar-normal" role="progressbar"
                                                                style="transform: scaleX(0);"></div>
    
                                                        </div>
    
    
                                                        <div class="bui-step">
    
                                                            <div class="bui-step-item bui-step-item-0" style="left:0%">
                                                                <div class="bui-step-dot"></div>
                                                                <div class="bui-step-text"></div>
                                                            </div>
    
                                                            <div class="bui-step-item bui-step-item-100" style="left:100%">
                                                                <div class="bui-step-dot"></div>
                                                                <div class="bui-step-text"></div>
                                                            </div>
    
                                                        </div>
    
                                                        <div class="bui-thumb" style="transform: translateX(0px);">
    
                                                            <div class="bui-thumb-tooltip">0%</div>
    
    
                                                            <div class="bui-thumb-dot"></div>
    
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-left-preventshade">
                                            <span
                                                class="bilibili-player-video-danmaku-setting-left-preventshade-box bui bui-checkbox bui-dark player-tooltips-trigger"
                                                data-tooltip="2" data-text="视频底部15%部分为空白保留区" data-position="top-left"
                                                data-change-mode="1"><input class="bui-checkbox-input" type="checkbox"
                                                    aria-label="弹幕合并">
                                                <label class="bui-checkbox-label">
                                                    <span class="bui-checkbox-icon bui-checkbox-icon-default"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            viewBox="0 0 32 32">
                                                            <path
                                                                d="M8 6a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2H8zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z">
                                                            </path>
                                                        </svg></span>
                                                    <span class="bui-checkbox-icon bui-checkbox-icon-selected"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            viewBox="0 0 32 32">
                                                            <path
                                                                d="M13 18.25l-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0l-7.8 7.8zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z">
                                                            </path>
                                                        </svg></span>
                                                    <span class="bui-checkbox-name">弹幕合并</span>
                                                </label></span>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-left-bigsmall">
                                            <span class="bilibili-player-video-danmaku-setting-left-bigsmall-box bui bui-checkbox bui-dark player-tooltips-trigger">
                                            <input class="bui-checkbox-input" type="checkbox">
                                                <label class="bui-checkbox-label">
                                                    <span class="bui-checkbox-icon bui-checkbox-icon-default"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            viewBox="0 0 32 32">
                                                            <path
                                                                d="M8 6a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2H8zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z">
                                                            </path>
                                                        </svg></span>
                                                    <span class="bui-checkbox-icon bui-checkbox-icon-selected"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            viewBox="0 0 32 32">
                                                            <path
                                                                d="M13 18.25l-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0l-7.8 7.8zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z">
                                                            </path>
                                                        </svg></span>
                                                    <span class="bui-checkbox-name">自动调整合并弹幕大小</span>
                                                </label></span>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-left-opacity">
                                            <div class="bilibili-player-video-danmaku-setting-left-opacity-title">不透明度</div>
                                            <div class="bilibili-player-video-danmaku-setting-left-opacity-content">
                                                <div class="bilibili-player-setting-opacity bui bui-slider bui-dark">
                                                    <div class="bui-track">
    
                                                        <div class="bui-bar-wrap">
    
    
                                                            <div class="bui-bar bui-bar-normal" role="progressbar"
                                                                style="transform: scaleX(1);"></div>
                                                        </div>
                                                        <div class="bui-thumb" style="transform: translateX(186px);">
                                                            <div class="bui-thumb-tooltip">100%</div>
                                                            <div class="bui-thumb-dot"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-left-area">
                                            <div class="bilibili-player-video-danmaku-setting-left-area-title">显示区域</div>
                                            <div class="bilibili-player-video-danmaku-setting-left-area-content">
                                                <div class="bilibili-player-setting-area bui bui-slider bui-dark">
                                                    <div class="bui-track">
                                                        <div class="bui-bar-wrap">
                                                        </div>
                                                        <div class="bui-step">
    
                                                            <div class="bui-step-item bui-step-item-0" style="left:0%">
                                                                <div class="bui-step-dot"></div>
                                                                <div class="bui-step-text">1/4屏</div>
                                                            </div>
    
                                                            <div class="bui-step-item" style="left:33%">
                                                                <div class="bui-step-dot"></div>
                                                                <div class="bui-step-text">半屏</div>
                                                            </div>
    
                                                            <div class="bui-step-item" style="left:66%">
                                                                <div class="bui-step-dot"></div>
                                                                <div class="bui-step-text">防挡字幕</div>
                                                            </div>
    
                                                            <div class="bui-step-item bui-step-item-100" style="left:100%">
                                                                <div class="bui-step-dot"></div>
                                                                <div class="bui-step-text">不限</div>
                                                            </div>
    
                                                        </div>
    
                                                        <div class="bui-thumb" style="transform: translateX(186px);">
                                                            <div class="bui-thumb-dot"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-left-speedplus">
                                            <div class="bilibili-player-video-danmaku-setting-left-speedplus-title">弹幕速度
                                            </div>
                                            <div class="bilibili-player-video-danmaku-setting-left-speedplus-content">
                                                <div class="bilibili-player-setting-speedplus bui bui-slider bui-dark">
                                                    <div class="bui-track">
                                                        <div class="bui-bar-wrap">
                                                            <div class="bui-bar bui-bar-normal" role="progressbar"
                                                                style="transform: scaleX(0.5);"></div>
                                                        </div>
                                                        <div class="bui-step">
                                                            <div class="bui-step-item bui-step-item-0" style="left:0%">
                                                                <div class="bui-step-dot"></div>
                                                                <div class="bui-step-text">慢</div>
                                                            </div>
    
                                                            <div class="bui-step-item bui-step-item-100" style="left:100%">
                                                                <div class="bui-step-dot"></div>
                                                                <div class="bui-step-text">快</div>
                                                            </div>
    
                                                        </div>
    
                                                        <div class="bui-thumb" style="transform: translateX(96.5px);">
    
                                                            <div class="bui-thumb-tooltip">100%</div>
                                                            <div class="bui-thumb-dot"></div>
    
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-left-fontsize">
                                            <div class="bilibili-player-video-danmaku-setting-left-fontsize-title">字体大小
                                            </div>
                                            <div class="bilibili-player-video-danmaku-setting-left-fontsize-content">
                                                <div class="bilibili-player-setting-fontsize bui bui-slider bui-dark">
                                                    <div class="bui-track">
                                                        <div class="bui-bar-wrap">
                                                            <div class="bui-bar bui-bar-normal" role="progressbar"
                                                                style="transform: scaleX(0.5);"></div>
    
                                                        </div>
                                                        <div class="bui-step">
    
                                                            <div class="bui-step-item bui-step-item-0" style="left:0%">
                                                                <div class="bui-step-dot"></div>
                                                                <div class="bui-step-text">小</div>
                                                            </div>
    
                                                            <div class="bui-step-item bui-step-item-100" style="left:100%">
                                                                <div class="bui-step-dot"></div>
                                                                <div class="bui-step-text">大</div>
                                                            </div>
    
                                                        </div>
    
                                                        <div class="bui-thumb" style="transform: translateX(96.5px);">
                                                            <div class="bui-thumb-tooltip">100%</div>
                                                            <div class="bui-thumb-dot"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-left-block-word">
                                            <div class="bilibili-player-video-danmaku-setting-left-block-add">浏览XML弹幕</div>
                                            <div class="bilibili-player-video-danmaku-setting-left-block-sync">提取视频地址</div>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-left-more"><span
                                                class="bilibili-player-video-danmaku-setting-left-more-text">更多弹幕设置</span><span
                                                class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 16 16">
                                                    <path
                                                        d="M9.188 7.999l-3.359 3.359a.75.75 0 101.061 1.061l3.889-3.889a.75.75 0 000-1.061L6.89 3.58a.75.75 0 10-1.061 1.061l3.359 3.358z">
                                                    </path>
                                                </svg></span></div>
                                    </div>
                                </div>
    
                                <div class="bui-panel-item" style="width: 266px; height: 250px;">
                                    <div class="bilibili-player-video-danmaku-setting-right">
                                        <div class="bilibili-player-video-danmaku-setting-right-more"><span
                                                class="bp-svgicon"><svg xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 16 16">
                                                    <path
                                                        d="M6.811 8.001l3.359-3.359a.75.75 0 10-1.061-1.061L5.22 7.471a.75.75 0 000 1.061l3.889 3.888a.75.75 0 101.061-1.061L6.811 8.001z">
                                                    </path>
                                                </svg></span><span
                                                class="bilibili-player-video-danmaku-setting-right-more-text">更多弹幕设置</span>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-right-separator"></div>
                                        <div class="bilibili-player-video-danmaku-setting-right-fullscreensync">
                                            <span
                                                class="bilibili-player-video-danmaku-setting-right-fullscreensync-box bui bui-checkbox bui-dark"><input
                                                    class="bui-checkbox-input" type="checkbox" aria-label="弹幕大小跟随屏幕等比缩放">
                                                <label class="bui-checkbox-label">
                                                    <span class="bui-checkbox-icon bui-checkbox-icon-default"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            viewBox="0 0 32 32">
                                                            <path
                                                                d="M8 6a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2H8zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z">
                                                            </path>
                                                        </svg></span>
                                                    <span class="bui-checkbox-icon bui-checkbox-icon-selected"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            viewBox="0 0 32 32">
                                                            <path
                                                                d="M13 18.25l-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0l-7.8 7.8zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z">
                                                            </path>
                                                        </svg></span>
                                                    <span class="bui-checkbox-name">弹幕大小跟随屏幕等比缩放[无效]</span>
                                                </label></span>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-right-speedsync">
                                            <span
                                                class="bilibili-player-video-danmaku-setting-right-speedsync-box bui bui-checkbox bui-dark"><input
                                                    class="bui-checkbox-input" type="checkbox" aria-label="弹幕速度同步播放倍数">
                                                <label class="bui-checkbox-label">
                                                    <span class="bui-checkbox-icon bui-checkbox-icon-default"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            viewBox="0 0 32 32">
                                                            <path
                                                                d="M8 6a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2H8zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z">
                                                            </path>
                                                        </svg></span>
                                                    <span class="bui-checkbox-icon bui-checkbox-icon-selected"><svg
                                                            xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                            viewBox="0 0 32 32">
                                                            <path
                                                                d="M13 18.25l-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0l-7.8 7.8zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z">
                                                            </path>
                                                        </svg></span>
                                                    <span class="bui-checkbox-name">弹幕速度同步播放倍数[无效]</span>
                                                </label></span>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-right-font">
                                            <div class="bilibili-player-video-danmaku-setting-right-font-title">弹幕字体</div>
                                            <div class="bilibili-player-video-danmaku-setting-right-font-content">
                                                <div
                                                    class="bilibili-player-video-danmaku-setting-right-font-content-fontfamily bui bui-select bui-dark">
                                                    <div class="bui-area bui-select-bscroll" style="width: 100%;">
                                                        <div class="bui-select-wrap bui-select-unfold">
                                                            <div class="bui-select-border">
                                                                <div class="bui-select-header">
                                                                    <span class="bui-select-result">黑体</span>
                                                                    <span class="bui-select-arrow">
                                                                        <span class="bui-select-arrow-down"></span>
                                                                    </span>
                                                                </div>
                                                                <div class="bui-select-list-wrap"
                                                                    style="max-height: 100px; touch-action: pan-x; user-select: none; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);">
                                                                    <ul class="bui-select-list"
                                                                        style="transition-timing-function: cubic-bezier(0.165, 0.84, 0.44, 1); transition-duration: 0ms; transform: translate(0px, 0px) scale(1) translateZ(0px); height: 100px;">
                                                                        <li class="bui-select-item bui-select-item-active"
                                                                            data-value="SimHei, 'Microsoft JhengHei'">黑体
                                                                        </li>
                                                                        <li class="bui-select-item" data-value="SimSun">宋体
                                                                        </li>
                                                                        <li class="bui-select-item" data-value="NSimSun">新宋体
                                                                        </li>
                                                                        <li class="bui-select-item" data-value="FangSong">仿宋
                                                                        </li>
                                                                        <li class="bui-select-item"
                                                                            data-value="'Microsoft YaHei'">微软雅黑</li>
                                                                        <li class="bui-select-item"
                                                                            data-value="'Microsoft Yahei UI Light'">微软雅黑
                                                                            Light</li>
                                                                        <li class="bui-select-item"
                                                                            data-value="'Noto Sans CJK SC DemiLight'">Noto
                                                                            Sans
                                                                            DemiLight</li>
                                                                        <li class="bui-select-item"
                                                                            data-value="'Noto Sans CJK SC Regular'">Noto
                                                                            Sans Regular
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="bilibili-player-video-danmaku-setting-right-font-bold">
                                                <span
                                                    class="bilibili-player-video-danmaku-setting-right-font-bold-box bui bui-checkbox bui-dark"><input
                                                        class="bui-checkbox-input" type="checkbox" aria-label="粗体">
                                                    <label class="bui-checkbox-label">
                                                        <span class="bui-checkbox-icon bui-checkbox-icon-default"><svg
                                                                xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                                viewBox="0 0 32 32">
                                                                <path
                                                                    d="M8 6a2 2 0 00-2 2v16a2 2 0 002 2h16a2 2 0 002-2V8a2 2 0 00-2-2H8zm0-2h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z">
                                                                </path>
                                                            </svg></span>
                                                        <span class="bui-checkbox-icon bui-checkbox-icon-selected"><svg
                                                                xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                                                                viewBox="0 0 32 32">
                                                                <path
                                                                    d="M13 18.25l-1.8-1.8c-.6-.6-1.65-.6-2.25 0s-.6 1.5 0 2.25l2.85 2.85c.318.318.762.468 1.2.448.438.02.882-.13 1.2-.448l8.85-8.85c.6-.6.6-1.65 0-2.25s-1.65-.6-2.25 0l-7.8 7.8zM8 4h16c2.21 0 4 1.79 4 4v16c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4V8c0-2.21 1.79-4 4-4z">
                                                                </path>
                                                            </svg></span>
                                                        <span class="bui-checkbox-name">粗体</span>
                                                    </label></span>
                                            </div>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-right-fontborder">
                                            <div class="bilibili-player-video-danmaku-setting-right-fontborder-title">描边类型
                                            </div>
                                            <div
                                                class="bilibili-player-video-danmaku-setting-right-fontborder-content bui bui-radio bui-dark">
                                                <div class="bui-radio-wrap bui-radio-button">
                                                    <div class="bui-radio-group" style="margin: 0 -4px;">
    
                                                        <label class="bui-radio-item" style="margin: 0 4px;">
                                                            <input type="radio" class="bui-radio-input" value="0"
                                                                name="bui-radio4">
                                                            <span class="bui-radio-label">
    
                                                                <span class="bui-radio-text">重墨</span>
                                                            </span>
                                                        </label>
    
                                                        <label class="bui-radio-item" style="margin: 0 4px;">
                                                            <input type="radio" class="bui-radio-input" value="1"
                                                                name="bui-radio4">
                                                            <span class="bui-radio-label">
    
                                                                <span class="bui-radio-text">描边</span>
                                                            </span>
                                                        </label>
    
                                                        <label class="bui-radio-item" style="margin: 0 4px;">
                                                            <input type="radio" class="bui-radio-input" value="2"
                                                                name="bui-radio4">
                                                            <span class="bui-radio-label">
    
                                                                <span class="bui-radio-text">45°投影</span>
                                                            </span>
                                                        </label>
    
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="bilibili-player-video-danmaku-setting-right-separator"></div>
                                        <div class="bilibili-player-video-danmaku-setting-right-reset bui bui-button bui-button-transparent"
                                            tabindex="0" role="button">恢复默认设置</div>
                                    </div>
                                </div>
    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bilibili-player-video-btn bilibili-player-video-btn-quality bilibili-player-video-btn-quality-mod">
                <div class="bilibili-player-video-quality-menu bui bui-select bui-dark bui-select-quality-menu">
                    <div class="bui-select-wrap">
                        <div class="bui-select-border">
                            <div class="bui-select--header">
                                <span class="bui-select-result">
                                    <span class="bilibili-player-video-quality-text">&nbsp大会员&nbsp</span>
                                </span>
                            </div>
                            <div class="bui-select-list-wrap" style="display: none;">
                                <ul class="bui-select-list">
    
                                    ` + category_1_html + `
    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="squirtle-widescreen-wrap squirtle-block-wrap">
                <div class="squirtle-video-widescreen squirtle-video-item">
                <div class="squirtle-widescreen-inactive">
                    <svg class="squirtle-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                        <path
                            d="M18 4H4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-9.404 8.773a.5.5 0 010 .707l-.707.707a.5.5 0 01-.707 0l-2.828-2.828a.5.5 0 010-.707l2.828-2.828a.5.5 0 01.707 0l.707.707a.5.5 0 010 .707l-1.768 1.768 1.768 1.767zm9.05-1.414l-2.828 2.828a.5.5 0 01-.707 0l-.707-.707a.5.5 0 010-.707l1.768-1.768-1.768-1.768a.5.5 0 010-.707l.707-.707a.5.5 0 01.707 0l2.828 2.828a.502.502 0 010 .708z">
                        </path>
                    </svg>
                </div>
                <div class="squirtle-widescreen-active">
                    <svg class="squirtle-svg-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                        <path
                            d="M18 4H4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-8.404 7.359l-2.828 2.828a.5.5 0 01-.707 0l-.707-.707a.5.5 0 010-.707l1.768-1.768-1.768-1.767a.5.5 0 010-.707l.707-.707a.5.5 0 01.707 0l2.828 2.828a.5.5 0 010 .707zm7.05 1.414a.5.5 0 010 .707l-.707.707a.5.5 0 01-.707 0l-2.828-2.828a.5.5 0 010-.707l2.828-2.828a.5.5 0 01.707 0l.707.707a.5.5 0 010 .707l-1.768 1.768 1.768 1.767z">
                        </path>
                    </svg>
                </div>
                </div>
            </div>            
        </div>
  `;
            playera.append(bottomdiv);

            //1.11.5修复移除关键div导致脚本失效
            let playerPlaceholder = document.createElement('div');
            playerPlaceholder.id = 'player_placeholder';
            playera.append(playerPlaceholder);
            //console.log($(".bui-switch-input").prop("checked"),document.querySelector("#player_module > div.bilibili-player-video-bottom-area > div.bui-switch > input").checked)


            this.mouseEvent()
            this.setbili()
        }

        this.setbili = function () {
            if (window.location.host != 'www.bilibili.com') {
                return
            }
            //1.12.1 记忆功能
            $(".bilibili-player-block-filter-type").each((liIndex, item) => {
                let blockdmname = $(item).attr("data-name")
                switch (blockdmname) {
                    case 'ctlbar_danmuku_scroll_on':
                        if (dmblock_scroll == 'off') {
                            $(item).attr("data-name", 'ctlbar_danmuku_scroll_off')
                            $(item).addClass("bpx-player-active")
                            //$(item).find('use').attr("xlink:href", '#bpx-svg-sprite-dantype-scroll-disabled')
                            this.setdamuicon('ctlbar_danmuku_scroll_off', scroll_off)
                            for (let i = 0; i < CHANNEL_COUNT; i++) {
                                try {
                                    domtopdownPool[i].innerText = ''
                                } catch { }
                            }
                        }
                        break;
                    case 'ctlbar_danmuku_top_on':
                        if (dmblock_top == 'off') {
                            $(item).attr("data-name", 'ctlbar_danmuku_top_off')
                            $(item).addClass("bpx-player-active")
                            // $(item).find('use').attr("xlink:href", '#bpx-svg-sprite-dantype-top-disabled')
                            this.setdamuicon('ctlbar_danmuku_top_off', top_off)
                        }
                        break;
                    case 'ctlbar_danmuku_bottom_on':
                        if (dmblock_bottom == 'off') {
                            $(item).attr("data-name", 'ctlbar_danmuku_bottom_off')
                            $(item).addClass("bpx-player-active")
                            //$(item).find('use').attr("xlink:href", '#bpx-svg-sprite-dantype-bottom-disabled')
                            this.setdamuicon('ctlbar_danmuku_bottom_off', bottom_off)
                        }
                        break;
                    case 'ctlbar_danmuku_color_on':
                        if (dmblock_color == 'off') {
                            $(item).attr("data-name", 'ctlbar_danmuku_color_off')
                            $(item).addClass("bpx-player-active")
                            //$(item).find('use').attr("xlink:href", '#bpx-svg-sprite-dantype-color-disabled')
                            this.setdamuicon('ctlbar_danmuku_color_off', color_off)
                        }
                        break;
                    case 'ctlbar_danmuku_special_on':
                        if (dmblock_special == 'off') {
                            $(item).attr("data-name", 'ctlbar_danmuku_special_off')
                            $(item).addClass("bpx-player-active")
                            //$(item).find('use').attr("xlink:href", '#bpx-svg-sprite-dantype-advanced-disabled')
                            this.setdamuicon('ctlbar_danmuku_special_off', special_off)
                        }
                        break;
                    default:
                        break;
                }
            })
            //console.log(buiSwitch)
            if (buiSwitch == 'false') {
                $(".bui-switch-input").attr("checked", false);
            }

            //1.12.1接口记忆修复
            let index = commonFunctionObject.GMgetValue("index");
            $(".bilibili-player-video-btn-quality-mod").find('.bui-select-item').removeClass("bui-select-item-active");
            $(".bilibili-player-video-btn-quality-mod").find('.bui-select-item').each(function (lindex, item) {
                if ($(item).attr("data-index") == index) {
                    $(item).addClass("bui-select-item-active");
                }
            })

            //1.12.2去重 透明 设置
            $(".bilibili-player-setting-flag").each((lindex, item) => {
                let sliderwidth = $(item).width()
                //console.log('repeatPrepeatPrepeatP',sliderwidth)
                if (sliderwidth == 0) {
                    sliderwidth = 192
                }
                //console.log('repeatPrepeatPrepeatP2',sliderwidth)
                $(item).find(".bui-bar-normal").css('transform',
                    `scaleX(${parseInt(repeatP) / 100})`)
                $(item).find(".bui-thumb").css('transform',
                    `translateX(${parseInt(repeatP) / 100 * sliderwidth}px)`)
                $(item).find(".bui-thumb-tooltip").text(`${parseInt(repeatP)}%`)
            })

            $(".bilibili-player-setting-opacity").each((lindex, item) => {
                let sliderwidth = $(item).width()
                //console.log('opacityopacityopacity',sliderwidth)
                if (sliderwidth == 0) {
                    sliderwidth = 192
                }
                $(item).find(".bui-bar-normal").css('transform',
                    `scaleX(${parseFloat(opacityNum)})`)
                $(item).find(".bui-thumb").css('transform',
                    `translateX(${parseFloat(opacityNum) * sliderwidth}px)`)

                $(item).find(".bui-thumb-tooltip").text(`${parseInt(parseFloat(opacityNum) * 100)}%`)

                //setdomOpacity();
            })

            //1.12.3 字体大小 速度 区域
            $(".bilibili-player-setting-speedplus").each((lindex, item) => {
                let sliderwidth = $(item).width()
                //console.log('repeatPrepeatPrepeatP',sliderwidth)
                if (sliderwidth == 0) {
                    sliderwidth = 192
                }
                //console.log('repeatPrepeatPrepeatP2',sliderwidth)
                $(item).find(".bui-bar-normal").css('transform',
                    `scaleX(${dmspeed - 0.5})`)
                $(item).find(".bui-thumb").css('transform',
                    `translateX(${(dmspeed - 0.5) * sliderwidth}px)`)
                $(item).find(".bui-thumb-tooltip").text(`${parseInt(dmspeed * 100)}%`)
                //setdomFontsize();
            })
            //1.12.4修复显示问题
            $(".bilibili-player-setting-fontsize").each((lindex, item) => {
                let sliderwidth = $(item).width()
                //console.log('opacityopacityopacity',sliderwidth)
                if (sliderwidth == 0) {
                    sliderwidth = 192
                }
                $(item).find(".bui-bar-normal").css('transform',
                    `scaleX(${parseFloat(fontSize / 25) - 0.5})`)
                $(item).find(".bui-thumb").css('transform',
                    `translateX(${(parseFloat(fontSize / 25) - 0.5) * sliderwidth}px)`)

                $(item).find(".bui-thumb-tooltip").text(`${parseInt((fontSize / 25 - 0.5) * 100 - 50)}%`)
            })

            $(".bilibili-player-setting-area").each((lindex, item) => {
                let sliderwidth = $(item).width()
                let sliderpct = 0
                //console.log('opacityopacityopacity',sliderwidth)
                if (sliderwidth == 0) {
                    sliderwidth = 192
                }
                if (dmArea == 1) {
                    sliderpct = 1
                } else if (dmArea == 0.85) {
                    sliderpct = 0.65
                } else if (dmArea == 0.5) {
                    sliderpct = 0.31
                } else {
                    sliderpct = 0
                }
                $(item).find(".bui-thumb").css('transform',
                    `translateX(${sliderpct * sliderwidth}px)`)
            })

            //1.12.6.2描边记忆
            $(".bui-radio-input").each((lindex, item) => {
                if (dmTextshadow != null) {
                    if ($(item).attr('value') == 0 && dmTextshadow == 'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px') {
                        $(item).attr("checked", "checked");
                    } else if ($(item).attr('value') == 1 && dmTextshadow == 'rgb(0, 0, 0) 0px 0px 1px, rgb(0, 0, 0) 0px 0px 1px, rgb(0, 0, 0) 0px 0px 1px') {
                        $(item).attr("checked", "checked");
                    } else if ($(item).attr('value') == 2 && dmTextshadow == 'rgb(0, 0, 0) 1px 1px 2px, rgb(0, 0, 0) 0px 0px 1px') {
                        $(item).attr("checked", "checked");
                    }
                    //setdomTextshadow()
                } else {
                    if ($(item).attr('value') == 0) {
                        $(item).attr("checked", "checked");
                    }
                }
            })

            //1.12.6.3字体类型
            $(".bui-select-bscroll").find('.bui-select-item').each((lindex, item) => {
                let textTypeval = $(item).attr('data-value')
                //console.log('textTypeval', textTypeval, dmTextType, dmTextType.indexOf(textTypeval))
                if (dmTextType != null && dmTextType.indexOf(textTypeval) != -1) {
                    $(".bui-select-bscroll").find('.bui-select-result').text($(item).text())
                    //setdomTextType()
                }
            })

            //1.12.6.5 粗体记忆
            if (dmfontWeight > 600) {
                $('.bilibili-player-video-danmaku-setting-right-font-bold-box').children('.bui-checkbox-input').attr("checked", "checked");
            }

            //1.13.4合并记忆
            if (combineDanmu == 1) {
                $('.bilibili-player-video-danmaku-setting-left-preventshade-box').children('input').attr("checked", "checked");
                $('.bilibili-player-video-danmaku-setting-left-flag-content').find('.bui-thumb-dot').css('backgroundColor', '#808080')
                $('.bilibili-player-video-danmaku-setting-left-flag-content').find('.bui-bar').css('backgroundColor', '#808080')
                $('.bilibili-player-video-danmaku-setting-left-flag-content').find('.bilibili-player-setting-flag').css('cursor', 'default')
            }

            if (bigsmallDanmu == 1) {
                $('.bilibili-player-video-danmaku-setting-left-bigsmall-box').children('input').attr("checked", "checked");
            }

        }

        this.getset = function () {
            //1.12.1 记忆功能
            dmblock_scroll = commonFunctionObject.GMgetValue("scroll");
            if (dmblock_scroll == null) {
                dmblock_scroll = 'on'
                commonFunctionObject.GMsetValue("scroll", dmblock_scroll);
            }

            dmblock_top = commonFunctionObject.GMgetValue("top");
            if (dmblock_top == null) {
                dmblock_top = 'on'
                commonFunctionObject.GMsetValue("top", dmblock_top);
            }

            dmblock_bottom = commonFunctionObject.GMgetValue("bottom");
            if (dmblock_bottom == null) {
                dmblock_bottom = 'on'
                commonFunctionObject.GMsetValue("bottom", dmblock_bottom);
            }

            dmblock_color = commonFunctionObject.GMgetValue("color");
            if (dmblock_color == null) {
                dmblock_color = 'on'
                commonFunctionObject.GMsetValue("color", dmblock_color);
            }

            dmblock_special = commonFunctionObject.GMgetValue("special");
            if (dmblock_special == null) {
                dmblock_special = 'on'
                commonFunctionObject.GMsetValue("special", dmblock_special);
            }

            buiSwitch = commonFunctionObject.GMgetValue("buiSwitch");
            if (buiSwitch == null) {
                buiSwitch = 'true'
                commonFunctionObject.GMsetValue("buiSwitch", buiSwitch);
            }


            repeatP = commonFunctionObject.GMgetValue('repeatP');
            if (repeatP == null) {
                repeatP = '0'
                commonFunctionObject.GMsetValue("repeatP", repeatP);
            }
            opacityNum = commonFunctionObject.GMgetValue('opacityNum');
            if (opacityNum == null) {
                opacityNum = '1'
                commonFunctionObject.GMsetValue("opacityNum", opacityNum);
            }


            fontSize = commonFunctionObject.GMgetValue('fontSize');
            if (fontSize == null) {
                fontSize = '25'
                commonFunctionObject.GMsetValue("fontSize", fontSize);
            }
            dmspeed = commonFunctionObject.GMgetValue('dmspeed');
            if (dmspeed == null) {
                dmspeed = 1
                commonFunctionObject.GMsetValue("dmspeed", dmspeed);
            }

            dmArea = commonFunctionObject.GMgetValue('dmArea');
            if (dmArea == null) {
                dmArea = 1
                commonFunctionObject.GMsetValue("dmArea", dmArea);
            }
            //1.12.6.2 描边类型记忆
            dmTextshadow = commonFunctionObject.GMgetValue('dmTextshadow');
            if (dmTextshadow != null && window.location.host != 'www.bilibili.com') {
                setdomTextshadow()
            }
            //1.12.6.3 字体记忆
            dmTextType = commonFunctionObject.GMgetValue('dmTextType');
            if (dmTextshadow != null && window.location.host != 'www.bilibili.com') {
                setdomTextType()
            }
            //1.12.6.5 粗体记忆
            dmfontWeight = commonFunctionObject.GMgetValue('dmfontWeight');
            if (dmfontWeight == null) {
                dmfontWeight = '700'
                commonFunctionObject.GMsetValue("dmfontWeight", dmfontWeight);
            }
            //1.13.4合并记忆
            combineDanmu = commonFunctionObject.GMgetValue('combineDanmu');
            if (combineDanmu == null) {
                combineDanmu = 0
                commonFunctionObject.GMsetValue("combineDanmu", combineDanmu);
            }

            bigsmallDanmu = commonFunctionObject.GMgetValue('bigsmallDanmu');
            if (bigsmallDanmu == null) {
                bigsmallDanmu = 0
                commonFunctionObject.GMsetValue("bigsmallDanmu", bigsmallDanmu);
            }
        }



        this.mouseEvent = function () {
            //1.11.5 弹幕开关
            let buiSwitchbtn = $(".bui-switch-input");
            buiSwitchbtn.click(function () {
                if ($(".bui-switch-input").prop("checked")) {
                    postdownmessage({
                        str: 'checktrue'
                    })
                    commonFunctionObject.GMsetValue('buiSwitch', 'true');
                } else {
                    postdownmessage({
                        str: 'checkfalse'
                    })
                    commonFunctionObject.GMsetValue('buiSwitch', 'false');

                }

            });

            //1.11.8 滑块
            $(".bui-slider").each(function () {
                $(this).mousedown(
                    function (e) {
                        let el = $(this)
                        let sliderclass = el.attr('class')
                        if (sliderclass.indexOf('bilibili-player-setting-flag') != -1 && combineDanmu == 0) {
                            repeatSlider = true;
                        } else if (sliderclass.indexOf('bilibili-player-setting-opacity') != -1) {
                            opacitySlider = true;
                        } else if (sliderclass.indexOf('bilibili-player-setting-fontsize') != -1) {
                            fontSizeSlider = true;
                        } else if (sliderclass.indexOf('bilibili-player-setting-speedplus') != -1) {
                            dmspeedSlider = true;
                        } else if (sliderclass.indexOf('bilibili-player-setting-area') != -1) {
                            dmAreaSlider = true;
                        }
                    }
                )

            })

            //1.12.4 滑块优化2
            $('.bilibili-player-video-danmaku-setting-wrap').mousedown(
                function (e) {
                    $(this).on('mousemove.drag', function (e) {
                        let el
                        let os
                        let mouseX
                        let itemlong
                        if (repeatSlider == true) {
                            el = $('.bilibili-player-setting-flag')
                        } else if (opacitySlider == true) {
                            el = $('.bilibili-player-setting-opacity')
                        } else if (fontSizeSlider == true) {
                            el = $('.bilibili-player-setting-fontsize')
                        } else if (dmspeedSlider == true) {
                            el = $('.bilibili-player-setting-speedplus')
                        } else if (dmAreaSlider == true) {
                            el = $('.bilibili-player-setting-area')
                        } else {
                            return
                        }
                        os = el.offset();
                        mouseX = e.pageX - os.left;
                        itemlong = el.width() - 6;
                        if (mouseX <= itemlong && mouseX >= -0.5) {
                            let sliderpct = Math.ceil(mouseX / itemlong * 100)
                            let sliderclass = el.attr('class')
                            if (sliderclass.indexOf('bilibili-player-setting-area') != -1) {
                                if (sliderpct > 83) {
                                    el.find(".bui-thumb").css('transform',
                                        `translateX(${itemlong}px)`)
                                    dmArea = 1
                                } else if (sliderpct > 49) {
                                    el.find(".bui-thumb").css('transform',
                                        `translateX(${itemlong * 0.65}px)`
                                    )
                                    dmArea = 0.85
                                } else if (sliderpct > 16) {
                                    el.find(".bui-thumb").css('transform',
                                        `translateX(${itemlong * 0.31}px)`
                                    )
                                    dmArea = 0.5
                                } else {
                                    el.find(".bui-thumb").css('transform',
                                        `translateX(${0}px)`)
                                    dmArea = 0.25
                                }

                            } else {
                                el.find(".bui-thumb").css('transform',
                                    `translateX(${mouseX}px)`)
                            }
                            el.find(".bui-bar-normal").css('transform',
                                `scaleX(${sliderpct / 100})`)
                            el.find(".bui-thumb-tooltip").css('opacity', `1`)


                            if (sliderclass.indexOf('bilibili-player-setting-fontsize') != -1 || sliderclass.indexOf('bilibili-player-setting-speedplus') != -1) {
                                el.find(".bui-thumb-tooltip").text(`${50 + sliderpct}%`)
                            } else {
                                el.find(".bui-thumb-tooltip").text(`${sliderpct}%`)
                            }
                        }
                    })
                })
            //1.12.3滑块优化1
            $('.bilibili-player-video-danmaku-setting-wrap').mouseup(function (e) {
                let slideron = true
                //1.12.2 去重和透明
                if (repeatSlider == true) {
                    repeatP = parseInt($(".bilibili-player-setting-flag").find('.bui-thumb-tooltip').text().replace("%", "")).toString()
                    commonFunctionObject.GMsetValue('repeatP', repeatP);
                    postdownmessage({
                        str: 'repeatP',
                        p: repeatP
                    })

                } else if (opacitySlider == true) {
                    opacityNum = (parseInt($(".bilibili-player-setting-opacity").find('.bui-thumb-tooltip').text().replace("%", "")) / 100).toString()
                    commonFunctionObject.GMsetValue('opacityNum', opacityNum);
                    postdownmessage({
                        str: 'opacityNum',
                        p: opacityNum
                    })

                } else if (fontSizeSlider == true) {
                    fontSize = (Math.round($(".bilibili-player-setting-fontsize").find('.bui-thumb-tooltip').text().replace("%", "") / 100 * 25)).toString()
                    commonFunctionObject.GMsetValue('fontSize', fontSize);
                    postdownmessage({
                        str: 'fontSize',
                        p: fontSize
                    })

                } else if (dmspeedSlider == true) {
                    dmspeed = $(".bilibili-player-setting-speedplus").find('.bui-thumb-tooltip').text().replace("%", "") / 100
                    commonFunctionObject.GMsetValue('dmspeed', dmspeed);
                    postdownmessage({
                        str: 'dmspeed',
                        p: dmspeed
                    })
                } else if (dmAreaSlider == true) {
                    commonFunctionObject.GMsetValue('dmArea', dmArea);
                    postdownmessage({
                        str: 'dmArea',
                        p: dmArea
                    })
                } else {
                    slideron = false
                }

                if (slideron == true) {
                    repeatSlider = false;
                    opacitySlider = false;
                    fontSizeSlider = false;
                    dmspeedSlider = false;
                    dmAreaSlider == false;
                    $('.bilibili-player-video-danmaku-setting-wrap').off('mousemove.drag');
                    $(".bui-slider").find(".bui-thumb-tooltip").css('opacity', `0`)
                }
            })

            //1.11.8 接口按钮 1.12.6 缩小范围           
            $(".bilibili-player-video-quality-menu").find(".bui-select-item").each((liIndex, item) => {
                item.addEventListener("click", () => {
                    $(".bui-select-item").removeClass("bui-select-item-active");
                    $(item).addClass("bui-select-item-active")

                    let index2 = parseInt($(item).attr("data-index"));
                    commonFunctionObject.GMsetValue('index', index2);
                    this.videoreplace();
                });
            });


            //1.12.1 设置按钮
            //浏览XML弹幕
            $('.bilibili-player-video-danmaku-setting-left-block-add').click(function () {
                if (xmlhtml != null) {
                    window.open(xmlhtml)
                } else {
                    let bv = $("a.av-link[target='_blank']")[0]
                    if (bv) {
                        $.getJSON("https://api.bilibili.com/x/player/pagelist?bvid=" + bv.innerText,
                            function (result) {
                                xmlhtml = `https://api.bilibili.com/x/v1/dm/list.so?oid=${result.data[0].cid}`
                            })
                    }
                    window.open(xmlhtml)
                }

            })

            $('.bilibili-player-video-danmaku-setting-left-block-sync').click(function () {
                window.open("https://xbeibeix.com/api/bilibili/?monkey=" + window.location.href)
            })

            //1.12.6 更多设置显示
            $(".bilibili-player-video-danmaku-setting-left-more").click(function () {
                $(".bui-panel-item").each(function () {
                    if ($(this).attr('class').indexOf('bui-panel-item-active') != -1) {
                        $(this).removeClass('bui-panel-item-active')
                    } else {
                        $(this).addClass('bui-panel-item-active')

                    }
                });
                $(".bui-panel-move").css('transform', 'translateX(-298px)')
                $(".bui-panel-wrap").css('width', '266px')
                $(".bui-panel-wrap").css('height', '250px')
            })

            $(".bilibili-player-video-danmaku-setting-right-more").click(function () {
                $(".bui-panel-item").each(function () {
                    if ($(this).attr('class').indexOf('bui-panel-item-active') != -1) {
                        $(this).removeClass('bui-panel-item-active')
                    } else {
                        $(this).addClass('bui-panel-item-active')

                    }
                });
                $(".bui-panel-move").css('transform', 'translateX(0px)')
                $(".bui-panel-wrap").css('width', '298px')
                $(".bui-panel-wrap").css('height', '366px')
            })
            //1.12.6.1字体描边按键
            $(".bui-radio-item").click(function () {
                let radioval = $(this).children('.bui-radio-input').attr('value')
                if (radioval == 0) {
                    dmTextshadow = 'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px'
                } else if (radioval == 1) {
                    dmTextshadow = 'rgb(0, 0, 0) 0px 0px 1px, rgb(0, 0, 0) 0px 0px 1px, rgb(0, 0, 0) 0px 0px 1px'
                } else if (radioval == 2) {
                    dmTextshadow = 'rgb(0, 0, 0) 1px 1px 2px, rgb(0, 0, 0) 0px 0px 1px'
                }
                commonFunctionObject.GMsetValue('dmTextshadow', dmTextshadow);
                postdownmessage({
                    str: 'dmTextshadow',
                    p: dmTextshadow
                })


            })

            //1.12.6.3弹幕字体
            $(".bui-select-bscroll").find('.bui-select-item').click(function () {
                let dmTextType = $(this).attr('data-value') + ', Arial, Helvetica, sans-serif'
                let bscrolltext = $(this).text()
                $(".bui-select-bscroll").find('.bui-select-result').text(bscrolltext)
                $(".bui-select-bscroll").find('.bui-select-list-wrap')[0].style.display = 'none'
                commonFunctionObject.GMsetValue('dmTextType', dmTextType);
                postdownmessage({
                    str: 'dmTextType',
                    p: dmTextType
                })
            })
            //12.6.4 12.6.5修复
            $('.bilibili-player-video-btn-quality').hover(function () {
                $(this).find('.bui-select-list-wrap').css("display", "block");
            }, function () {
                $(this).find('.bui-select-list-wrap').css("display", "none");
            })

            //12.6.5粗体

            $('.bilibili-player-video-danmaku-setting-right-font-bold-box').children('.bui-checkbox-input').click(function () {
                if ($(this).prop("checked")) {
                    commonFunctionObject.GMsetValue('dmfontWeight', 700);
                    dmfontWeight = 700
                    postdownmessage({
                        str: 'dmfontWeight',
                        p: dmfontWeight
                    })
                } else {
                    commonFunctionObject.GMsetValue('dmfontWeight', 400);
                    dmfontWeight = 400
                    postdownmessage({
                        str: 'dmfontWeight',
                        p: dmfontWeight
                    })
                }
            })

            //12.6.4恢复默认
            $(".bilibili-player-video-danmaku-setting-right-reset").click(function () {
                //alert()
                //屏蔽弹幕类型
                commonFunctionObject.GMsetValue('scroll', 'on');
                commonFunctionObject.GMsetValue('top', 'on');
                commonFunctionObject.GMsetValue('bottom', 'on');
                commonFunctionObject.GMsetValue('color', 'on');
                commonFunctionObject.GMsetValue('special', 'on');

                dmblock_scroll = 'on';
                dmblock_top = 'on';
                dmblock_bottom = 'on';
                dmblock_color = 'on';
                dmblock_special = 'on';

                $('.bilibili-player-block-filter-type').each((liIndex, item) => {
                    let blockdmname = $(item).attr("data-name")
                    if (blockdmname == 'ctlbar_danmuku_special_on') {
                        $(item).find('.bilibili-player-block-filter-image').empty()
                        $(item).find('.bilibili-player-block-filter-image').append(special_on)
                    }
                    if (blockdmname == 'ctlbar_danmuku_color_on') {
                        $(item).find('.bilibili-player-block-filter-image').empty()
                        $(item).find('.bilibili-player-block-filter-image').append(color_on)
                    }
                    if (blockdmname == 'ctlbar_danmuku_bottom_on') {
                        $(item).find('.bilibili-player-block-filter-image').empty()
                        $(item).find('.bilibili-player-block-filter-image').append(bottom_on)
                    }
                    if (blockdmname == 'ctlbar_danmuku_top_on') {
                        $(item).find('.bilibili-player-block-filter-image').empty()
                        $(item).find('.bilibili-player-block-filter-image').append(top_on)
                    }
                    if (blockdmname == 'ctlbar_danmuku_scroll_on') {
                        $(item).find('.bilibili-player-block-filter-image').empty()
                        $(item).find('.bilibili-player-block-filter-image').append(scroll_on)
                    }
                })

                postdownmessage({
                    str: 'scrollon'
                })
                postdownmessage({
                    str: 'topon'
                })
                postdownmessage({
                    str: 'bottomon'
                })
                postdownmessage({
                    str: 'coloron'
                })
                //字体
                dmTextType = `SimHei, 'Microsoft JhengHei'`
                commonFunctionObject.GMsetValue('dmTextType', dmTextType);
                postdownmessage({
                    str: 'dmTextType',
                    p: dmTextType
                })
                $(".bui-select-bscroll").find('.bui-select-item').each((lindex, item) => {
                    let textTypeval = $(item).attr('data-value')
                    if (dmTextType != null && dmTextType.indexOf(textTypeval) != -1) {
                        $(".bui-select-bscroll").find('.bui-select-result').text($(item).text())
                    }
                })

                //描边
                dmTextshadow = 'rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px, rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px'
                commonFunctionObject.GMsetValue('dmTextshadow', dmTextshadow);
                postdownmessage({
                    str: 'dmTextshadow',
                    p: dmTextshadow
                })
                $(".bui-radio-input").each((lindex, item) => {
                    if ($(item).attr('value') == 0) {
                        $(item).attr("checked", "checked");
                    }
                })

                repeatP = '0'
                commonFunctionObject.GMsetValue('repeatP', repeatP);
                postdownmessage({
                    str: 'repeatP',
                    p: repeatP
                })
                $(".bilibili-player-setting-flag").find(".bui-bar-normal").css('transform',
                    `scaleX(${0})`)
                $(".bilibili-player-setting-flag").find(".bui-thumb").css('transform',
                    `translateX(${0}px)`)
                $(".bilibili-player-setting-flag").find(".bui-thumb-tooltip").text(`${0}%`)

                opacityNum = '1'
                commonFunctionObject.GMsetValue('opacityNum', opacityNum);
                postdownmessage({
                    str: 'opacityNum',
                    p: opacityNum
                })
                $(".bilibili-player-setting-opacity").find(".bui-bar-normal").css('transform',
                    `scaleX(${1})`)
                $(".bilibili-player-setting-opacity").find(".bui-thumb").css('transform',
                    `translateX(${192.5}px)`)

                $(".bilibili-player-setting-opacity").find(".bui-thumb-tooltip").text(`${100}%`)


                fontSize = '25'
                commonFunctionObject.GMsetValue('fontSize', fontSize);
                postdownmessage({
                    str: 'fontSize',
                    p: fontSize
                })
                $(".bilibili-player-setting-fontsize").find(".bui-bar-normal").css('transform',
                    `scaleX(${0.5})`)
                $(".bilibili-player-setting-fontsize").find(".bui-thumb").css('transform',
                    `translateX(${96.5}px)`)

                $(".bilibili-player-setting-fontsize").find(".bui-thumb-tooltip").text(`${100}%`)

                dmspeed = 1
                commonFunctionObject.GMsetValue('dmspeed', dmspeed);
                postdownmessage({
                    str: 'dmspeed',
                    p: dmspeed
                })
                $(".bilibili-player-setting-speedplus").find(".bui-bar-normal").css('transform',
                    `scaleX(${0.5})`)
                $(".bilibili-player-setting-speedplus").find(".bui-thumb").css('transform',
                    `translateX(${96.5}px)`)
                $(".bilibili-player-setting-speedplus").find(".bui-thumb-tooltip").text(`${100}%`)

                dmArea = 1
                commonFunctionObject.GMsetValue('dmArea', dmArea);
                postdownmessage({
                    str: 'dmArea',
                    p: dmArea
                })
                $(".bilibili-player-setting-area").find(".bui-thumb").css('transform',
                    `translateX(${192.5}px)`)
            })

            //1.13.3 新逻辑 13.3.1补充
            $('.bilibili-player-video-btn-quality').hover(function () {
                let bottomAreaTop = $('.bilibili-player-video-bottom-area').offset().top
                let selectListBottom = $('.bui-select.bui-select-quality-menu .bui-select-list').offset().top + originalInterfaceList.length * 36
                //console.log('接口框位置', bottomAreaTop, selectListBottom)
                if (Math.abs(bottomAreaTop - selectListBottom) > 2) {
                    if (bottomAreaTop > selectListBottom) {
                        $('.bui-select-quality-menu .bui-select-list').css('bottom', `${35 - selectListBottom + bottomAreaTop}px`)
                    } else {
                        $('.bui-select-quality-menu .bui-select-list').css('bottom', `${35 + selectListBottom - bottomAreaTop}px`)
                    }

                }
            }, function () { })

            //1.13.3 宽屏 1.13.3.4 修复
            $('.squirtle-widescreen-wrap').click(function () {
                if ($('.squirtle-video-item').children('div').eq(0).attr("class") == 'squirtle-widescreen-inactive') {
                    $('.squirtle-video-item').children('div').eq(0).attr("class", 'squirtle-widescreen-active')
                    $('.squirtle-video-item').children('div').eq(1).attr("class", 'squirtle-widescreen-inactive')

                    usualWidth = $('#player_module').width()
                    let widescreenW = $('.plp-r').offset().left - $('#player_module').offset().left + $('.plp-r').width()
                    let widescreenH = parseFloat((parseFloat(widescreenW) * 9 / 16).toFixed(2)) + 46
                    let plpRtop = parseFloat(widescreenH) + 20
                    let iframeH = parseFloat(widescreenH) - 46

                    console.log('plpRtop', plpRtop, 'widescreenH', widescreenH)

                    $('.plp-r').css('paddingTop', plpRtop + 'px')
                    $('#player_module').css('height', widescreenH + 'px')
                    $('#player_module').css('width', widescreenW + 'px')
                    $('#iframe-play-div').css('height', iframeH + 'px')
                    //console.log($('#player_module').width(), $('#player_module').height(), window.innerWidth, widescreenW)

                } else {
                    $('.squirtle-video-item').children('div').eq(1).attr("class", 'squirtle-widescreen-active')
                    $('.squirtle-video-item').children('div').eq(0).attr("class", 'squirtle-widescreen-inactive')

                    $('.plp-r').css('paddingTop', '0px')
                    $('#player_module').css('width', usualWidth + 'px')
                }
                //refreshDom()
                postdownmessage({
                    str: 'playerHchange',
                })
            })

            //1.13.4 合并
            $('.bilibili-player-video-danmaku-setting-left-preventshade-box').children('.bui-checkbox-input').click(function () {
                //console.log($(this).prop("checked"))
                if ($(this).prop("checked")) {
                    combineDanmu = 1
                    $('.bilibili-player-video-danmaku-setting-left-flag-content').find('.bui-thumb-dot').css('backgroundColor', '#808080')
                    $('.bilibili-player-video-danmaku-setting-left-flag-content').find('.bui-bar').css('backgroundColor', '#808080')
                    $('.bilibili-player-video-danmaku-setting-left-flag-content').find('.bilibili-player-setting-flag').css('cursor', 'default')
                } else {
                    combineDanmu = 0
                    $('.bilibili-player-video-danmaku-setting-left-flag-content').find('.bui-thumb-dot').css('backgroundColor', '#00a1d6')
                    $('.bilibili-player-video-danmaku-setting-left-flag-content').find('.bui-bar').css('backgroundColor', '#00a1d6')
                    $('.bilibili-player-video-danmaku-setting-left-flag-content').find('.bilibili-player-setting-flag').css('cursor', 'pointer')
                }
                commonFunctionObject.GMsetValue('combineDanmu', combineDanmu);
                postdownmessage({
                    str: 'combineDanmu' + combineDanmu
                })
            })

            $('.bilibili-player-video-danmaku-setting-left-bigsmall-box').children('.bui-checkbox-input').click(function () {
                //console.log($(this).prop("checked"))
                if ($(this).prop("checked")) {
                    bigsmallDanmu = 1
                } else {
                    bigsmallDanmu = 0
                }
                commonFunctionObject.GMsetValue('bigsmallDanmu', bigsmallDanmu);
                postdownmessage({
                    str: 'bigsmallDanmu' + bigsmallDanmu
                })
            })



            //屏蔽弹幕类型 
            $(".bilibili-player-block-filter-type").each((liIndex, item) => {
                item.addEventListener("click", () => {
                    let blockdmname = $(item).attr("data-name")
                    let blockdmtype = $(item).attr("ftype")
                    switch (blockdmname) {
                        case 'ctlbar_danmuku_scroll_on':
                            $(item).attr("data-name", 'ctlbar_danmuku_scroll_off')
                            $(item).addClass("bpx-player-active")

                            commonFunctionObject.GMsetValue(blockdmtype, 'off');
                            postdownmessage({
                                str: blockdmtype + 'off'
                            })
                            //1.12.2 修复分类屏蔽图标
                            this.setdamuicon('ctlbar_danmuku_scroll_off', scroll_off)
                            break;
                        case 'ctlbar_danmuku_scroll_off':
                            $(item).attr("data-name", 'ctlbar_danmuku_scroll_on')
                            $(item).removeClass("bpx-player-active")

                            commonFunctionObject.GMsetValue(blockdmtype, 'on');
                            postdownmessage({
                                str: blockdmtype + 'on'
                            })
                            //1.12.2 修复分类屏蔽图标
                            this.setdamuicon('ctlbar_danmuku_scroll_on', scroll_on)

                            break;
                        case 'ctlbar_danmuku_top_on':
                            $(item).attr("data-name", 'ctlbar_danmuku_top_off')
                            $(item).addClass("bpx-player-active")

                            commonFunctionObject.GMsetValue(blockdmtype, 'off');
                            this.setdamuicon('ctlbar_danmuku_top_off', top_off)
                            postdownmessage({
                                str: blockdmtype + 'off'
                            })
                            break;
                        case 'ctlbar_danmuku_top_off':
                            $(item).attr("data-name", 'ctlbar_danmuku_top_on')
                            $(item).removeClass("bpx-player-active")

                            this.setdamuicon('ctlbar_danmuku_top_on', top_on)
                            commonFunctionObject.GMsetValue(blockdmtype, 'on');
                            postdownmessage({
                                str: blockdmtype + 'on'
                            })
                            break;
                        case 'ctlbar_danmuku_bottom_on':
                            $(item).attr("data-name", 'ctlbar_danmuku_bottom_off')
                            $(item).addClass("bpx-player-active")

                            this.setdamuicon('ctlbar_danmuku_bottom_off', bottom_off)
                            commonFunctionObject.GMsetValue(blockdmtype, 'off');
                            postdownmessage({
                                str: blockdmtype + 'off'
                            })
                            break;
                        case 'ctlbar_danmuku_bottom_off':
                            $(item).attr("data-name", 'ctlbar_danmuku_bottom_on')
                            $(item).removeClass("bpx-player-active")

                            this.setdamuicon('ctlbar_danmuku_bottom_on', bottom_on)
                            commonFunctionObject.GMsetValue(blockdmtype, 'on');
                            postdownmessage({
                                str: blockdmtype + 'on'
                            })
                            break;
                        case 'ctlbar_danmuku_color_on':
                            $(item).attr("data-name", 'ctlbar_danmuku_color_off')
                            $(item).addClass("bpx-player-active")

                            commonFunctionObject.GMsetValue(blockdmtype, 'off');
                            this.setdamuicon('ctlbar_danmuku_color_off', color_off)
                            postdownmessage({
                                str: blockdmtype + 'off'
                            })
                            break;
                        case 'ctlbar_danmuku_color_off':
                            $(item).attr("data-name", 'ctlbar_danmuku_color_on')
                            $(item).removeClass("bpx-player-active")

                            this.setdamuicon('ctlbar_danmuku_color_on', color_on)
                            commonFunctionObject.GMsetValue(blockdmtype, 'on');
                            postdownmessage({
                                str: blockdmtype + 'on'
                            })
                            break;
                        case 'ctlbar_danmuku_special_on':
                            $(item).attr("data-name", 'ctlbar_danmuku_special_off')
                            $(item).addClass("bpx-player-active")

                            this.setdamuicon('ctlbar_danmuku_special_off', special_off)
                            commonFunctionObject.GMsetValue(blockdmtype, 'off');
                            postdownmessage({
                                str: blockdmtype + 'off'
                            })
                            break;
                        case 'ctlbar_danmuku_special_off':
                            $(item).attr("data-name", 'ctlbar_danmuku_special_on')
                            $(item).removeClass("bpx-player-active")

                            this.setdamuicon('ctlbar_danmuku_special_on', special_on)
                            commonFunctionObject.GMsetValue(blockdmtype, 'on');
                            postdownmessage({
                                str: blockdmtype + 'on'
                            })
                            break;

                        default:
                            break;
                    }

                })
            })
        }


        this.start = function () {
            this.operatOther();
            this.getset();
        }

        this.setdamuicon = function (blockname, iconspan) {
            $('.bilibili-player-block-filter-type').each((liIndex, item) => {
                let blockdmname = $(item).attr("data-name")

                if (blockdmname == blockname) {
                    $(item).find('.bilibili-player-block-filter-image').empty()
                    $(item).find('.bilibili-player-block-filter-image').append(iconspan)
                }
            })
        }
    }

    //1.12.2调节透明
    function setdomOpacity() {
        for (let i = 0; i < CHANNEL_COUNT; i++) {
            for (let j = 0; j < domPool[i].length; j++) {
                $(domPool[i][j]).css('opacity', parseFloat(opacityNum));
            }
        }
        for (let i2 = 0; i2 < CHANNEL_COUNT; i2++) {
            $(domtopdownPool[i2]).css('opacity', parseFloat(opacityNum));
        }
    }
    //1.12.3调节字体大小
    function setdomFontsize() {
        for (let i = 0; i < CHANNEL_COUNT; i++) {
            for (let j = 0; j < domPool[i].length; j++) {
                $(domPool[i][j]).css('fontSize', fontSize);
                $(domPool[i][j]).css('top', fontSize * i + 'px');
            }
        }
        for (let i2 = 0; i2 < CHANNEL_COUNT; i2++) {
            $(domtopdownPool[i2]).css('fontSize', fontSize);
            $(domtopdownPool[i2]).css('top', fontSize * i2 + 'px');
        }
    }

    //1.12.6.1 描边类型
    function setdomTextshadow() {
        for (let i = 0; i < CHANNEL_COUNT; i++) {
            for (let j = 0; j < domPool[i].length; j++) {
                domPool[i][j].style.textShadow = dmTextshadow
            }
        }

        for (let i2 = 0; i2 < CHANNEL_COUNT; i2++) {
            domtopdownPool[i2].style.textShadow = dmTextshadow
        }
    }
    //1.12.6.3 字体类型
    function setdomTextType() {
        for (let i = 0; i < CHANNEL_COUNT; i++) {
            for (let j = 0; j < domPool[i].length; j++) {
                domPool[i][j].style.fontFamily = dmTextType
            }
        }

        for (let i2 = 0; i2 < CHANNEL_COUNT; i2++) {
            domtopdownPool[i2].style.fontFamily = dmTextType
        }
    }
    //1.12.6.5粗体
    function setdomfontWeight() {
        for (let i = 0; i < CHANNEL_COUNT; i++) {
            for (let j = 0; j < domPool[i].length; j++) {
                domPool[i][j].style.fontWeight = dmfontWeight
            }
        }

        for (let i2 = 0; i2 < CHANNEL_COUNT; i2++) {
            domtopdownPool[i2].style.fontWeight = dmfontWeight
        }
    }

    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    (new superVideoHelper()).start();
})()
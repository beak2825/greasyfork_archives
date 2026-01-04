// ==UserScript==
// @name         facebook_spider
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  facebook collection Tool
// @author       You
// @match        m.facebook.com/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/451754/facebook_spider.user.js
// @updateURL https://update.greasyfork.org/scripts/451754/facebook_spider.meta.js
// ==/UserScript==
window.devicePixelRatio = 3
$(function () {
    // let baseUrl = 'http://62.8001.frpsz.daxiong.fun/v1_0';
    // let baseUrl = 'http://192.168.211.194:8001/v1_0';
    let baseUrl = 'https://app.tigercv.cc/v1_0';
    let userId = localStorage.getItem('_cs_viewer') ? localStorage.getItem('_cs_viewer') : localStorage.getItem('m_page_voice');
    let windowHref = window.location.href;
    console.log('facebook_spider');
    
    if (windowHref.indexOf('m.facebook.com/groups_browse/your_groups') == -1 && windowHref.indexOf('m.facebook.com/groups') == -1) {
        window.location.href = 'https://m.facebook.com/groups_browse/your_groups';
        return
    }
    
    // 群组列表
    if (windowHref.indexOf('m.facebook.com/groups_browse/your_groups')  !== -1) {
        setTimeout(() => {
            $(document).scrollTop($('body').height());
            setTimeout(() => {
                $(document).scrollTop($('body').height());
                setTimeout(() => {
                    initGroupList()
                }, 1000);
            }, 1000);
        }, 1000);
    }

    // 确保在群组内执行
    if (windowHref.indexOf('m.facebook.com/groups/')  !== -1) {
        initGroup()
    }

    // 群组列表任务队列
    function initGroupList() {
        let groupList= [];
        // 发送当前用户的群组
        getGourpsList(function(groupData) {
            groupList = groupData;
            let jsonData = {
                userId: userId,
                groups: groupList.map(function(item){ return { groupId: item.groupId, groupName: item.groupName}})
            }
             // 创建在线任务
            GM_xmlhttpRequest({
                method: "post",
                url: baseUrl + '/tool/task/start',
                data: JSON.stringify(jsonData),
                headers:  {
                    "Content-Type": "application/json"
                },
                onload: function(res){
                    if (res.status == 200 ){
                        let resData = JSON.parse(res.response);
                        // 设置定时任务 抓取指定群组内容
                        window.setGrabTimer = setInterval(() => {
                            setGrabFn()
                        }, 300000);
                        setGrabFn()
                    }
                }
            });
        })
        
        // 抓取任务定时器
        function setGrabFn() {
            let jsonData = {
                userId: userId,
                status: 1
            }
            GM_xmlhttpRequest({
                method: "post",
                url: baseUrl + '/tool/task/status',
                data: JSON.stringify(jsonData),
                headers:  {
                    "Content-Type": "application/json"
                },
                onload: function(res){
                    if (res.status == 200 ){
                        let resData = JSON.parse(res.response);
                        console.log('在线成功---', resData)
                        if (resData.code == 200) {
                            // 休息中
                            if (resData.data.is_execute == 0) {
                                return
                            }
                            let index = groupList.findIndex(function(item) { return item.groupId == resData.data.group_id});
                            if (index !== -1) {
                                // 存当前需要执行的群组
                                clearInterval(window.setGrabTimer)
                                window.location.href = groupList[index].href;
                                localStorage.setItem('TASK_ID', resData.data.id);
                            }
                        }
                    }
                }
            });
        }

        // 获取当前用户群组
        function getGourpsList (cb) {
            let groupData = [];
            $('#rootcontainer').find('a').each(function(index, item) {
                if ($(item).attr('href').indexOf('/groups/') !== -1 && $(item).attr('href').indexOf('ref=group_browse') != -1) {
                    let dataList = $(item).attr('href').split('/');
                    let groupsIndex  = dataList.findIndex(function(item) { return item == 'groups'});
                    if (groupsIndex !== -1) {
                        groupData.push({
                            groupId: dataList[groupsIndex+1],
                            href: $(item).attr('href'),
                            groupName: $($(item).find('img[alt="group image link"]').next().find('div')[0]).text()
                        })
                    }
                }
            })
            if (cb) {
                cb(groupData)
            }
        }
    }

    // 群组执行内容
    function initGroup() {
        // 5分钟刷新一下页面 抓取最新数据
        setTimeout(function() {
            window.location.reload()
        }, 300000)
        var TITLE = document.title.split('|')[0].trim();
        let maxheight = 0;
        var down = false; // 定义一个标志，当滚轮向下滚时，执行一些操作
        var downScrollTop = 0;
        let groups = '';
        // 获取小组id
        let hrefList = windowHref.split('?')[0].split('/');
        
        // 判断滚动加载
        window.onscroll = function() {
            //为了保证兼容性，这里取两个值，哪个有值取哪一个
            //scrollTop就是触发滚轮事件时滚轮的高度
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop)
            if (downScrollTop < scrollTop) {
                down = true
            } else {
                down = false
            }
            downScrollTop = scrollTop
            if ((maxheight-3000) < scrollTop) {
                clearInterval(window.setGroupsItem)
                window.setGroupsItem = setInterval(() => {
                    if ($('#m_group_stories_container').height() !== maxheight) {
                        clearInterval(window.setGroupsItem)
                        onMouseWheel()
                    }
                }, 1000);
            }
        }
        // 执行加载
        onMouseWheel()
        var nextItemId = '';

        // 滚动事件
        function onMouseWheel(ev) {
            /*当鼠标滚轮事件发生时，执行一些操作*/ var ev = ev || window.event;
            // var down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
            // down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;
            // var dom = document.querySelector('div[role="feed"]');
            var dom = $('#m_group_stories_container')
            let itemList = [];
            if (down) {
                itemList = getGroupsItems()
            } else {
                console.log("鼠标滚轮向上++++++++++");
            }
            if (ev.preventDefault) {
                /*FF 和 Chrome*/
                ev.preventDefault(); // 阻止默认事件
            }
            // 抓取数据 保证列表刷新成功 每10秒抓取
            clearTimeout(window.scrollTimer)
            window.scrollTimer = setTimeout(() => {
                // 数据全部清理成功
                sendXml(itemList, function() {
                    // 执行队列完毕触发
                    setTimeout(function() {
                        $(document).scrollTop($('body').height()); 
                    }, 15000)
                })
            }, 1000);
            return false;
        }

        function getGroupsItems() {
            $('#MChromeHeader #MBackNavBar').find('a').each(function(index, item){
                if (!groups && $(item).attr('data-sigil') == 'MBackNavBarClick'){
                    groups = $(item).text()
                }
            })
            let groupsBox = $('#m_group_stories_container section');
            maxheight = $('#m_group_stories_container').height();
            let groupsItems = groupsBox.find('article');
            let listData = []
            if (groupsItems && groupsItems.length > 0) {
                groupsItems.each(function(i,e) {
                    let username = '', permalinkid = '', updatetime = '' , groupsId = '';
                    let header = $($(e).find('header')[0]);
                    let links = header.find('a');
                    username = $(links[1]).text();

                    // groups = $('#MChromeHeader #header').find('a').attr('data-sigil')
                    // groups = $(links[2]).text();

                    let footerLinks = $($(e).find('footer')[0]).find('a');
                    let permalink = $(footerLinks[0]).attr('href');
                    permalink = permalink? permalink.split('/') : [];
                    let index = permalink.findIndex(function(item) {
                        return item  == 'permalink';
                    })

                    if (index !== -1) {
                        permalinkid = permalink[index+1];
                        let dataList = window.location.href.split('/');
                        let groupsIndex  = dataList.findIndex(function(item) { return item == 'groups'});
                        if (groupsIndex !== -1) { 
                            groupsId = dataList[groupsIndex+1]
                        }
                    }

                    // 获取更新时间
                    header.find('div').each(function(index, item) {
                        if ($(item).attr('data-sigil') == 'm-feed-voice-subtitle') {
                            updatetime = $(item).find('abbr').html();
                            return
                        }
                    })
                    // 设置唯一标识 方便查询
                    header.parent().attr('id', 'tagercv_'+permalinkid);
                    
                    // $(newButtion).attr('tager_cv_username', username);
                    // $(newButtion).attr('tager_cv_groups', groups);
                    // $(newButtion).attr('tager_cv_permalinkid', permalinkid);
                    // $(newButtion).attr('tager_cv_groupsId', groupsId);
                    // $(newButtion).attr('tager_cv_updatetime', updatetime)
                    let imgHtml = '<div>';
                    let imglist = [];
                    header.nextAll().each(function(index, item) {
                        if ($(item).find('i[role=img]').length > 0) {
                            let imgs = $(item).find('i[role=img]');
                            imgs.each(function(i, img) {
                                let backgroundImage = $(img).css('background-image')
                                let width = $(img).parent().css('max-width')
                                let height = $(img).parent().css('max-height')
                                // newButtion.style.width = 'auto';
                                if (backgroundImage.indexOf('static.xx.fbcdn') == -1) {
                                    // let imgUrl = backgroundImage.substring(backgroundImage.indexOf('http'), backgroundImage.length-1)
                                    // imglist.push({
                                    //     url: imgUrl,
                                    //     width: width,
                                    //     height: height
                                    // });
                                    imgHtml += `<div style='display: inline-block;min-height: 50px;background-image: `+backgroundImage+`;width: `+width+`;height: `+height+`;'></div>`
                                }
                            })
                        }
                    })
                    imgHtml += '</div>';
                    listData.push({
                        publisher: username,
                        groupsName: groups,
                        permalinkId: permalinkid,
                        updateTime: updatetime,
                        groupsId: groupsId,
                        content: header.next().text(),
                        describe: header.next().html() + '<span class="tiger_cv_img_split"></span>'+imgHtml, //+ imgHtml,//.parent().html(),
                        userId: userId
                    })
                })
            }
            return listData
        }

        // 发送数据后台 执行抓取队列
        function sendXml(list, cb) {
            let maxLengt = list.length;
            let num = 0; 
            // 查询已经添加的数据
            GM_xmlhttpRequest({
                method: "get",
                url: baseUrl + '/tool/facebook/getIds?groupsName='+TITLE,
                onload: function(res){
                    if (res.status == 200 ){
                        let resData = JSON.parse(res.response);
                        // console.log(resData.data)
                        // 循环所有防止遗漏
                        list.forEach(function(item) {
                            let index = resData.data.findIndex(function(o){ return item.permalinkId == o});
                            if (index !== -1) {
                                num++
                            } else {
                                // 每500毫秒发送一次请求
                                setTimeout(function() {
                                    GM_xmlhttpRequest({
                                        method: "POST",
                                        url: baseUrl + '/tool/facebook/save',
                                        data: JSON.stringify(item),
                                        headers:  {
                                            "Content-Type": "application/json"
                                        },
                                        // responseType:'arraybuffer',
                                        onload: function(res2){
                                            num++
                                        }
                                    });
                                }, 200)
                            }
                        })
                    }
                }
            });

            // 接口事件调用成功 执行一下次抓取 每秒判断一次是否执行完毕
            clearInterval(window.xnmload)
            window.xnmload = setInterval(() => {
                // 所有数据调用接口成功
                console.log('调用成功当前队列执行完毕---'+num+'----总队列',maxLengt)
                if (num == maxLengt) {
                    clearInterval(window.xnmload)
                    // 执行100条以上 结束任务
                    if(num >= 100) {
                        let jsonData = {
                            userId: userId,
                            taskId: localStorage.getItem('TASK_ID'),
                            status: 2
                        }
                        GM_xmlhttpRequest({
                            method: "post",
                            url: baseUrl + '/tool/task/status',
                            data: JSON.stringify(jsonData),
                            headers:  {
                                "Content-Type": "application/json"
                            },
                            onload: function(res){
                                if (res.status == 200 ){
                                    let resData = JSON.parse(res.response);
                                    console.log('over---', resData)
                                    window.location.href = 'https://m.facebook.com/bookmarks'
                                }
                            }
                        });
                    }
                    cb()
                }
            }, 1000);
        }
    }
    
    function addEvent(obj, xEvent, fn) {
        if (obj.attachEvent) {
            obj.attachEvent("on" + xEvent, fn);
        } else {
            obj.addEventListener(xEvent, fn, false);
        }
    }

    function getOldSha1(){
        var sha1 = localStorage.getItem('jobs')
        if(sha1 === null){
            return [];
        }
        return JSON.parse(sha1);
    }

    function strFilter(str){
        let pattern = new RegExp("[`~%!@#^=''?~《》！@#￥……&——‘”“'？*()（），,。.、·<>]"); 
        let rs = "";
        for(let i = 0; i < str.length; i++){
            rs += str.substr(i, 1).replace(pattern, '');
        }
        return rs.replace(/\s*/g,"");
    }

    function encodeUTF8(s) {
        var i, r = [], c, x;
        for (i = 0; i < s.length; i++)
            if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
            else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
            else {
                if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
                    c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
                        r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
                else r.push(0xE0 + (c >> 12 & 0xF));
                r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
            };
        return r;
    }

    // 字符串加密成 hex 字符串
    function sha1(s) {
        var data = new Uint8Array(encodeUTF8(s))
        var i, j, t;
        var l = ((data.length + 8) >>> 6 << 4) + 16, s = new Uint8Array(l << 2);
        s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
        for (t = new DataView(s.buffer), i = 0; i < l; i++)s[i] = t.getUint32(i << 2);
        s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
        s[l - 1] = data.length << 3;
        var w = [], f = [
                function () { return m[1] & m[2] | ~m[1] & m[3]; },
                function () { return m[1] ^ m[2] ^ m[3]; },
                function () { return m[1] & m[2] | m[1] & m[3] | m[2] & m[3]; },
                function () { return m[1] ^ m[2] ^ m[3]; }
            ], rol = function (n, c) { return n << c | n >>> (32 - c); },
            k = [1518500249, 1859775393, -1894007588, -899497514],
            m = [1732584193, -271733879, null, null, -1009589776];
        m[2] = ~m[0], m[3] = ~m[1];
        for (i = 0; i < s.length; i += 16) {
            var o = m.slice(0);
            for (j = 0; j < 80; j++)
                w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
                    t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
                    m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
            for (j = 0; j < 5; j++)m[j] = m[j] + o[j] | 0;
        };
        t = new DataView(new Uint32Array(m).buffer);
        for (var i = 0; i < 5; i++)m[i] = t.getUint32(i << 2);

        var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function (e) {
            return (e < 16 ? "0" : "") + e.toString(16);
        }).join("");
        return hex;
    }
});

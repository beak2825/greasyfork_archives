// ==UserScript==
// @name         facebook_spider_m_v4
// @namespace    http://tampermonkey.net/
// @version      0.04.062517
// @description  facebook collection Tool
// @author       You
// @match        m.facebook.com/*
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @downloadURL https://update.greasyfork.org/scripts/468998/facebook_spider_m_v4.user.js
// @updateURL https://update.greasyfork.org/scripts/468998/facebook_spider_m_v4.meta.js
// ==/UserScript==
window.devicePixelRatio = 3
$(function () {
    // let baseUrl = 'http://62.8001.frpsz.daxiong.fun/v1_0';
    // let baseUrl = 'http://192.168.211.194:8001/v1_0';
    let pixelRatio = 3;
    let baseUrl = 'https://app.tigercv.cc/v1_0';
    let targetUrl = 'm.facebook.com';
    // let userId = localStorage.getItem('c_user') ? localStorage.getItem('c_user') : localStorage.getItem('m_page_voice');
    let userId = getCookie('c_user') ? getCookie('c_user') : getCookie('m_page_voice');
    let windowHref = window.location.href;
    console.log('[facebook_spider] userId-------', userId);

    /*
    if (windowHref.indexOf(targetUrl+'/graphsearch/str/') == -1) {
        window.location.href = 'https://'+targetUrl+'/home.php?soft=search';
        return
    }
    */

    // 群组列表
    // mobile.fb
    if (windowHref.indexOf(targetUrl+'/graphsearch/str/') !== -1 && windowHref.indexOf('keywords_search?f=') !== -1) {
        console.log('/graphsearch/str/***/keywords_search?f==================>')
        // 模拟群组列表
        initGroupList()
        /*
        setTimeout(() => {
            $(document).scrollTop($('body').height());
            setTimeout(() => {
                $(document).scrollTop($('body').height());
                setTimeout(() => {
                    initGroupList()
                }, 1000);
            }, 1000);
        }, 1000);
        */
    }

    // mobile.fb
    if (windowHref.indexOf(targetUrl+'/search/top/?q=') !== -1) {
        console.log('/search/top/?q==================>')
        // 模拟群组列表
        initGroupList()
        /*
        setTimeout(() => {
            $(document).scrollTop($('body').height());
            setTimeout(() => {
                $(document).scrollTop($('body').height());
                setTimeout(() => {
                    initGroupList()
                }, 1000);
            }, 1000);
        }, 1000);
        */
    }

    // mobile.fb
    if (windowHref.indexOf(targetUrl+'/search/posts?q=') !== -1) {
        console.log('/search/posts/?q==================>')
        // 模拟群组列表
        initGroupList()
        /*
        setTimeout(() => {
            $(document).scrollTop($('body').height());
            setTimeout(() => {
                $(document).scrollTop($('body').height());
                setTimeout(() => {
                    initGroupList()
                }, 1000);
            }, 1000);
        }, 1000);
        */
    }

    // 确保在群组内执行
    if (windowHref.indexOf(targetUrl+'/groups/') !== -1) {
        initGroup()
    }

    function getCookie(name){
        var arrstr = document.cookie.split("; ");
        for(var i = 0;i < arrstr.length;i ++){
            var temp = arrstr[i].split("=");
            if(temp[0] == name) return unescape(temp[1]);
        }
    }

    function setCookie(name,value) {
        var Days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "=" + escape (value) + ";expires=" + exp.toGMTString();
    }

    function setConfig() {
        window.devicePixelRatio = pixelRatio;
        setCookie('dpr', pixelRatio);
        $("span:contains('展开')").trigger('click');
        $("span:contains('More')").trigger('click');
        $("span:contains('Altro...')").trigger('click');
        $("span:contains('See more')").trigger('click');
        $("span:contains('Ver más')").trigger('click');
        $("span:contains('Afficher la suite')").trigger('click');
        $("span:contains('Mehr ansehen')").trigger('click');

        console.log('window.devicePixelRatio==========>', window.devicePixelRatio);
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
            console.log('群组列表任务队列[Save group List Task Queue] Post->data-------', jsonData)
             // 创建在线任务
            GM_xmlhttpRequest({
                method: "post",
                url: baseUrl + '/tool/task/start',
                data: JSON.stringify(jsonData),
                headers:  {
                    "Content-Type": "application/json"
                },
                onload: function(res){
                    console.log('群组列表任务队列[Save group List Task Queue] Response->res=======', res)
                    if (res.status == 200 ){
                        initGroup()
                        /*
                        let resData = JSON.parse(res.response);
                        // 设置定时任务 抓取指定群组内容
                        window.setGrabTimer = setInterval(() => {
                            setGrabFn()
                        }, 300000);
                        setGrabFn()
                        */
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
            console.log('设置抓取任务定时器[Set fetch task timer] Post->data-------', jsonData)
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
                        console.log('设置抓取任务定时器[Set fetch task timer] Response->res=======', resData)
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
            setConfig();
            let groupData = [];
            let jobName = '';
            let TITLE = document.title.split(' - ');
            jobName = TITLE[0]
            let date = new Date(),
                year = date.getFullYear(),
                month = date.getMonth() + 1,
                strDate = date.getDate(),
                hour = date.getHours()

            if (strDate < 10) strDate = `0${strDate}`
            let dateId = `${year}${month}${strDate}${hour}`

            groupData.push({
                            groupId: escape(jobName) + dateId,
                            href: windowHref,
                            groupName: jobName + dateId
                        })
            console.log(groupData)

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
                    if ($('#BrowseResultsContainer').height() !== maxheight) {
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
            /*当鼠标滚轮事件发生时，执行一些操作*/
            ev = ev || window.event;
            // var down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
            // down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;
            // var dom = document.querySelector('div[role="feed"]');
            let itemList = [];
            if (down) {
                setTimeout(function() {
                       itemList = getGroupsItems()
                    }, 1000)
            } else {
                console.log("鼠标滚轮向上[mouse wheel up]++++++++++");
            }
            if (ev.preventDefault) {
                /*FF 和 Chrome*/
                ev.preventDefault(); // 阻止默认事件
            }
            // 抓取数据 保证列表刷新成功 每10秒抓取
            clearTimeout(window.scrollTimer)
            window.scrollTimer = setTimeout(() => {
                // 数据全部清理成功
                console.log("保存群组发帖数据[Save group posting data] Post->data-------", itemList);
                sendXml(itemList, function() {
                    // 执行队列完毕触发
                    setTimeout(function() {
                        $(document).scrollTop($('body').height());
                        setConfig();
                    }, 15000)
                })
            }, 1000);
            return false;
        }

        function getGroupsItems() {
            /*
            // 群组连接标签
            $('#MChromeHeader #MBackNavBar').find('a').each(function(index, item){
                // 读取群组名称
                if (!groups && $(item).attr('data-sigil') == 'MBackNavBarClick'){
                    groups = $(item).text()
                }
            })
            */
            let groupsBox = $('#BrowseResultsContainer');
            maxheight = $('#BrowseResultsContainer').height();
            let groupsItems = groupsBox.find("[data-store$='}']");
            //console.log(groupsItems)
            let listData = []
            if (groupsItems && groupsItems.length > 0) {
                groupsItems.each(function(i,e) {
                    let username = '', publisher_id = '', permalinkid = '', updatetime = '' , groupsId = '', groupsName = '', publishtime = '', source_url='', publisher_profpic='';
                    if ($(e).attr('data-ft')) {
                        let ft = $.parseJSON($(e).attr('data-ft'))
                        //console.log("---====data-ft===---", ft);
                        if (ft) {
                            groupsId = ft.page_id
                            console.log('groupsId===========>', groupsId)
                            permalinkid = ft.top_level_post_id
                            publisher_id = ft.content_owner_id_new

                            if (Object.hasOwn(ft, 'page_insights')) {
                                $.each(ft.page_insights, function(i,item){
                                    console.log(i+'item===========>', item)
                                    if(groupsId==i && item.post_context) {
                                        console.log('groupsId_item.post_context================>', item.post_context)
                                        publishtime = item.post_context.publish_time
                                    }

                                    if(publisher_id==i && item.post_context) {
                                        console.log('publisher_id_item.post_context================>', item.post_context)
                                        publishtime = item.post_context.publish_time
                                    }
                                })
                            } else {
                                return true
                            }
                            
                            username = $($(e).find('strong')[0]).find('a').text()
                            groupsName = $($(e).find('strong')[1]).find('a').text()
                            let children = $(e).children()
                            console.log('children=======>', children)
                            //let eg = $(children[1]).children()
                            updatetime = $($(e).find('abbr')[0]).text()

                            if ($($(e).find('abbr')[0]).parent().attr('href')) {
                                if ($($(e).find('abbr')[0]).parent().attr('href').indexOf(targetUrl) !== -1) {
                                    source_url = $($(e).find('abbr')[0]).parent().attr('href');
                                } else {
                                    source_url = 'https://' + targetUrl + $($(e).find('abbr')[0]).parent().attr('href');
                                }
                            }

                            let content = $($($(children[0]).children())[1])
                            content.find('[class="text_exposed_hide"]').remove()

                            let imglist = [];
                            let imgSrc = $(children[0]).children()
                            imgSrc = $(imgSrc[2])
                            let imgs = imgSrc.find('[role="img"]')
                            if (imgs.length > 0) {
                                    imgs.each(function(i, img) {
                                        let strStyle = $(img).attr('style')
                                        if (strStyle) {
                                            strStyle=strStyle.split('url(\'')[1];
                                            strStyle=strStyle.split('\')')[0];

                                            let imgUrl = strStyle.replace(/\\3a\s/gi,":");
                                            imgUrl = imgUrl.replace(/\\3d\s/gi,"=");
                                            imgUrl = imgUrl.replace(/\\26\s/gi,"&");

                                            console.log('imgUrl============>', imgUrl);

                                            imglist.push({
                                                url: imgUrl,
                                                width: '100%',
                                                height: '100%'
                                            });
                                        }
                                    })
                            }

                            console.log({
                                publisher: username,
                                publisher_id: publisher_id,
                                groupsName: groupsName,
                                permalinkId: permalinkid,
                                updateTime: updatetime,
                                source_url: source_url,
                                publishTime: publishtime,
                                groupsId: groupsId,
                                content: content.text(),
                                describe: content.html(),
                                attachment: JSON.stringify(imglist),
                                userId: userId
                            })

                            listData.push({
                                publisher: username,
                                publisher_id: publisher_id,
                                groupsName: groupsName,
                                permalinkId: permalinkid,
                                updateTime: updatetime,
                                source_url: source_url,
                                publishTime: publishtime,
                                groupsId: groupsId,
                                content: content.text(),
                                describe: content.html(),
                                attachment: JSON.stringify(imglist),
                                userId: userId
                            })
                        }
                    }
                })
            }
            return listData
        }

        // 发送数据后台 执行抓取队列
        function sendXml(list, cb) {
            let maxLengt = list.length;
            let num = 0;

            // 循环所有防止遗漏
            list.forEach(function(item) {
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
                            console.log('sendxml res2 ===》', JSON.parse(res2.response))
                            num++
                        }
                    });
                }, 200)
            })
            /*
            // 不校验群组信息
            // 查询已经添加的数据
            GM_xmlhttpRequest({
                method: "get",
                url: baseUrl + '/tool/facebook/getIds?groupsName='+TITLE,
                onload: function(res){
                    if (res.status == 200 ){
                        let resData = JSON.parse(res.response);
                        //console.log(resData.data, '---====TITLE===---' + TITLE)
                        
                    }
                }
            });
            */

            // 接口事件调用成功 执行一下次抓取 每秒判断一次是否执行完毕
            clearInterval(window.xnmload)
            window.xnmload = setInterval(() => {
                // 所有数据调用接口成功
                console.log('调用成功当前分页[The number of successful tasks on the current page]-------',maxLengt+'/'+num)
                if (num == maxLengt) {
                    // 记录总条数
                    let task_num = localStorage.getItem('TASK_NUM') ? parseInt(localStorage.getItem('TASK_NUM'))+num : num
                    localStorage.setItem('TASK_NUM', task_num);

                    // 执行翻页
                    //if(num > 0) $("span:contains('更多帖子')").trigger('click')
                    //if(num > 0) $("span:contains('See More Posts')").trigger('click')

                    clearInterval(window.xnmload)
                    console.log('当前队列执行完毕[The number of successful tasks in the current queue]-------','100'+'/'+localStorage.getItem('TASK_NUM'))
                    // 执行100条以上 结束任务
                    if(localStorage.getItem('TASK_NUM') >= 200) {
                        localStorage.setItem('TASK_NUM', 0);
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
                                    console.log('任务结束[End of current queue] Response->res=======', resData)
                                    //window.location.href = 'https://'+targetUrl+'/bookmarks'
                                    let jsonData = {
                                        search_url: windowHref
                                    }
                                    console.log(jsonData)
                                    GM_xmlhttpRequest({
                                        method: "post",
                                        url: baseUrl + '/tool/Facebook/updateSearchCron',
                                        data: JSON.stringify(jsonData),
                                        headers:  {
                                            "Content-Type": "application/json"
                                        },
                                        onload: function(res){
                                            console.log(res)
                                            if (res.status == 200 ){
                                                let resData = JSON.parse(res.response);
                                                if (resData.data)
                                                    window.location.href = resData.data[0].search_url
                                                else
                                                    window.location.href = 'https://'+targetUrl+'/bookmarks'
                                            }
                                        }
                                    });
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

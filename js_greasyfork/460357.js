// ==UserScript==
// @name         （已废弃）B站观看内容统计-我的时间不见了
// @version      0.1.2
// @description  方便查过去浏览记录
// @author       strangeZombies
// @namespace    https://www.github.com/strangeZombies
// @match        *://*.bilibili.com/*
// @require      https://static.hdslb.com/js/jquery.min.js
// @icon         https://static.hdslb.com/images/favicon.ico
// @run-at       document-end

// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @grant        GM_addElement

// @downloadURL https://update.greasyfork.org/scripts/460357/%EF%BC%88%E5%B7%B2%E5%BA%9F%E5%BC%83%EF%BC%89B%E7%AB%99%E8%A7%82%E7%9C%8B%E5%86%85%E5%AE%B9%E7%BB%9F%E8%AE%A1-%E6%88%91%E7%9A%84%E6%97%B6%E9%97%B4%E4%B8%8D%E8%A7%81%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/460357/%EF%BC%88%E5%B7%B2%E5%BA%9F%E5%BC%83%EF%BC%89B%E7%AB%99%E8%A7%82%E7%9C%8B%E5%86%85%E5%AE%B9%E7%BB%9F%E8%AE%A1-%E6%88%91%E7%9A%84%E6%97%B6%E9%97%B4%E4%B8%8D%E8%A7%81%E4%BA%86.meta.js
// ==/UserScript==
/* globals $ */
/* jshint esversion: 11 */

// (废弃中) 不要使用该脚本在积累了大量数据后会导致浏览器卡死

// 最早基于 判官喵的B站观看内容统计-我的时间都去哪了
// 最新基于 人工智能生成的代码
// 未完成的 搜索功能模块
// 建议加装 ClearURLs 扩展插件
// 即使在编写本脚本的过程中大量使用智能，仍不能保证脚本的出厂质量
// 由于会累计大量数据，已知存在性能问题，可能致使页面卡顿
(function () {
    'use strict';
    // 引入 GM_addElement 和 GM_addEvent 函数
    function GM_addElement(tag, options) {
        var node = document.createElement(tag);
        if (options && typeof options === "object") {
            for (var prop in options) {
                var value = options[prop];
                if (prop === "style" && typeof value === "object") {
                    for (var styleProp in value) {
                        node.style[styleProp] = value[styleProp];
                    }
                } else if (prop === "text") {
                    node.textContent = value;
                } else if (prop === "className") {
                    node.className = value;
                } else {
                    node[prop] = value;
                }
            }
        }
        return node;
    }
    function GM_addEvent(element, event, handler) {
        if (element.addEventListener) {
            element.addEventListener(event, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + event, handler);
        }
    }
    //下载 ajax get请求携带cookie Json
    async function getOneAjax(addr) {
        try {
            let res = await $.ajax({
                type: "get",
                url: addr,
                dataType: "json",
                async: true,
                // 允许请求携带cookie
                xhrFields: {
                    withCredentials: true
                }
            }).then(json => { return json; })
            return res;
        } catch (err) {
            return err;
        }
    }
    //读取缓存模块 返回string->json格式化缓存内容
    // "lishijilulist"
    function GMgetStrToJson(cacheName) {
        // 初始字符
        let cacheJson, cacheStr;
        // 获取缓存
        cacheStr = GM_getValue(cacheName);
        // 如果存在缓存则格式化为Json并返回
        if (cacheStr == undefined) {
            cacheJson = cacheStr; // 如果不存在则为 undifined
        } else {
            cacheJson = JSON.parse(cacheStr);
        }
        return cacheJson;
    }
    //存储缓存列表模块 Json
    function GMsetJson(cacheName, cacheValue) {
        let cacheValueTemp = JSON.stringify(cacheValue);
        GM_setValue(cacheName, cacheValueTemp);
    }

    // 计数统计
    const samer = {
        same: 0,
        page: 0,
        inSame() {
            this.same++;
        },
        getSame() {
            return this.same;
        },
        reSame() {
            this.same = 0;
        },
        inPage() {
            this.page++;
        },
        getPage() {
            return this.page;
        }
    };
    //获取进度 (未完成)
    const preEC = {
        // 进度条
        preE: 0,
        setPreE(preE) {
            this.preE = preE;
            return this.preE;
        },
        getPreE() {
            return this.preE;
        }
    }

    //设置标头存储模块
    function headerCache(firstCache, preJson, cacheBucket, nextCache) {
        let getId, getViewAt, PerJsonBucketLen;
        //如果没登录就跳出循环
        if (preJson.code === -101) {
            preEC.setPreE(-101);
            nextCache = -101;
        } else {
            PerJsonBucketLen = preJson.data.list.length;
            if (PerJsonBucketLen != 0) {
                //提取最后观看数据项oid和观看时间
                getId = preJson.data.list[0].history.oid;
                getViewAt = preJson.data.list[0].view_at;
            }
            //判断是否为首次缓存
            if (firstCache == 1) {
                if (cacheBucket.length == 0) {
                    console.log("首次获取数据时间较长请耐心等待！")
                    //是首次缓存则 添加标头项首次缓存标记，最后观看oid和时间数据，返回存储列表
                    cacheBucket[0] = ({ first_cache: firstCache, last_oid: getId, last_view_at: getViewAt, thisCache_len: 0 })
                }
                return cacheBucket;
            } else {
                //非首次缓存存储最后观看数据项
                //是则 把此页最后观看数据添加到标头项备用栏，返回存储列表
                cacheBucket[0].beiyong_last_oid = getId;
                cacheBucket[0].beiyong_last_view_at = getViewAt;
                cacheBucket[0].bencicunchu_len = 0;
                return cacheBucket;
            }
        }
    }
    //prejson数据添加到存储列表模块
    function preJsonToCacheBucket(preJson, i, cacheBucket) {
        //每个视频bvid 每个视频时长 每个视频观看时长 每个视频观看时间
        let every_oid, //视频是av号，专栏是cv号，直播是直播间号
            every_author_mid, //up主uid
            every_author_name, //up主名字
            every_badge, //此条记录的类型
            every_title, //标题
            every_duration, //视频时长
            every_progress, //观看时长
            every_view_at; //观看时间
        //可能增加的数据
        //every_cover,
        //every_author_face;

        //开始赋值
        every_oid = preJson.data.list[i].history.oid;
        every_author_mid = preJson.data.list[i].author_mid;
        every_author_name = preJson.data.list[i].author_name;
        every_badge = preJson.data.list[i].badge;
        every_title = preJson.data.list[i].title;
        every_duration = preJson.data.list[i].duration;
        every_progress = preJson.data.list[i].progress;
        every_view_at = preJson.data.list[i].view_at;
        //可能增加的数据
        //every_cover = preJson.data.list[i].cover;
        //every_author_face = preJson.data.list[i].author_face;

        //判断是否有重复内容
        //寻找相同观看时间内容
        let sameViewAt = cacheBucket.find(item => item.view_at === every_view_at);

        if (sameViewAt == undefined) {
            // 视频观看时间不存在于缓存中，检查是否已经存在相同的 oid。
            let sameOid = cacheBucket.find(item => item.oid === every_oid && item.view_at !== every_view_at);
            if (sameOid == undefined) {
                // 视频 bvid 也不存在于缓存中，将数据添加到缓存列表中
                cacheBucket.push({
                    oid: every_oid, author_mid: every_author_mid,
                    author_name: every_author_name, badge: every_badge, title: every_title,
                    duration: every_duration, progress: every_progress, view_at: every_view_at
                });
                cacheBucket[0].bencicunchu_len += 1;
            } else {
                samer.inSame();
                //console.log('有找到',samer.getSame());
                // 视频 bvid 已经存在于缓存中，但是观看时间不同，忽略该条记录
            }
        } else {
            samer.inSame();
            //console.log('有找到',samer.getSame());
            // 视频观看时间已经存在于缓存中，忽略该条记录
        }

        return cacheBucket;
    }

    //处理json数据加入存储列表模块  调用preJsonToCacheBucket
    function jsonToCacheBucket(preJson, cacheBucket) {
        //提取首次存储标记
        let firstCache = cacheBucket[0].first_cache;
        //提取json数据列表长度
        let preJsonListLen = preJson.data.list.length;
        //提取记录的最后一个观看时间
        let lastViewAt = cacheBucket[0].last_view_at;
        let lastOid = cacheBucket[0].last_oid;
        //提取记录的备用最后一个观看时间
        let backupLastViewAt = cacheBucket[0].beiyong_last_view_at
        let backupLastOid = cacheBucket[0].beiyong_last_oid;
        //列表执行计数
        let i;
        //获取时间戳
        let tistime = Date.now();
        //判断数据长度是否为0
        if (preJsonListLen == 0) {
            //如果没有数据则是提取到最后一页，将首次存储状态改为0无效，并存储 返回下页状态为0
            cacheBucket[0].first_cache = 0;
            cacheBucket[0].last_jiancha_time = tistime;
            GMsetJson('lishijilulist', cacheBucket);
            //console.log("最早一条");
            return 0;
            //返回状态0不再进行下个页面获取
        } else {
            //有数据则判断是否为首次缓存
            if (firstCache == 1) {
                //首次缓存直接循环执行 api页面json数据添加到存储列表模块
                for (i = 0; i < preJsonListLen; i++) {
                    cacheBucket = preJsonToCacheBucket(preJson, i, cacheBucket);
                }
                GMsetJson('lishijilulist', cacheBucket);
                //返回状态1继续进行下个页面获取
                return 1;
            } else {
                //非首次缓存则，判断缓存最后一个观看时间与记录列表时间（包括 oid 和 view_at）大小
                for (i = 0; i < preJsonListLen; i++) {
                    let currentViewAt = preJson.data.list[i].view_at;
                    let currentOid = preJson.data.list[i].history.oid;
                    // 如果当前记录的时间和 oid 都等于缓存最后一条记录，则停止获取
                    if (lastViewAt === currentViewAt && lastOid === currentOid) {
                        //将备用最后时间添加到存储列表的最后时间，直接存储已有列表
                        cacheBucket[0].last_view_at = backupLastViewAt;
                        cacheBucket[0].last_oid = backupLastOid;
                        cacheBucket[0].last_jiancha_time = tistime;
                        GMsetJson('lishijilulist', cacheBucket);
                        return 0;
                        //返回状态0不再进行下个页面获取
                    } else {
                        //否则，将记录添加到缓存列表中
                        cacheBucket = preJsonToCacheBucket(preJson, i, cacheBucket);
                        lastViewAt = cacheBucket[0].last_view_at;
                        lastOid = cacheBucket[0].last_oid;
                    }
                }
                //整页获取完后存储，返回状态1继续进行下个页面获取
                GMsetJson('lishijilulist', cacheBucket);
                return 1;
            }
        }
    }

    //获取一组数据
    async function ajaxOneHistory(maxId, viewAt, businessId) {
        let url = `https://api.bilibili.com/x/web-interface/history/cursor?max=${maxId}&view_at=${viewAt}&business=${businessId}`;
        //console.log('正在获取', url);
        await new Promise(resolve => setTimeout(resolve, 100));
        let data = await getOneAjax(url);
        return data;
    }
    // MAIN FETCH
    async function ajaxHistory() {
        //首次缓存标记，1有效，0无效 | 读取列表  | 存入列表 | 获取列表
        let originCacheBucket, cacheBucket = [], preJson, firstCache;
        //读取缓存
        originCacheBucket = GMgetStrToJson('lishijilulist');
        cacheBucket = originCacheBucket; // 如果没有则此处为undifined;

        //判断缓存是否存在
        if (originCacheBucket == undefined) {
            //不存在则执行以下
            //是首次缓存
            firstCache = 1;
            cacheBucket = [];
        } else {
            firstCache = 0; //007 006
        }
        preEC.setPreE(0);
        let nextCache = 1;
        let maxId = 0, viewAtId = 0, businessId = '';

        while (nextCache === 1) {
            preJson = await ajaxOneHistory(maxId, viewAtId, businessId).then(preJson => { return preJson });
            preEC.setPreE(10);
            cacheBucket = headerCache(firstCache, preJson, cacheBucket);
            if (preEC.getPreE() === -101) {
                echo.log(echo.asWarning("我的时间不见了"), echo.asAlert("请先登录!"));
                break;
            }
            nextCache = jsonToCacheBucket(preJson, cacheBucket);
            maxId = preJson.data.cursor.max;
            viewAtId = preJson.data.cursor.view_at;
            businessId = preJson.data.cursor.business;

            //
            if (samer.getSame() === 20) {
                samer.inPage();
            }
            samer.reSame();
            if (samer.getPage() === 2) {
                //  console.log('Enough');
                nextCache = 0;
            }
        }
        if (preEC.getPreE() != -101) { preEC.setPreE(20); }
    }

    //数量时长计算模块
    function pharseResult(cacheBucket) {
        //获取时间戳
        const nowtime = new Date(),
            //获取年份
            thisyear = nowtime.getFullYear(),
            //获取当月的月份
            thismonth = nowtime.getMonth() + 1,
            lastmonth = nowtime.getMonth(),
            //获取当前日期
            today = nowtime.getDate(),
            //当天0点时间戳
            todaytime = (new Date(thisyear + "-" + thismonth + "-" + today) / 1000),
            //前一天0点时间戳
            yesterdaytime = (new Date(thisyear + "-" + thismonth + "-" + today) / 1000) - 24 * 60 * 60,
            //6天前的时间戳
            weektime = (new Date(thisyear + "-" + thismonth + "-" + today) / 1000) - 24 * 60 * 60 * 6,
            //本月1号的时间戳
            thismonthtime = (new Date(thisyear + "-" + thismonth + "-" + 1) / 1000),
            //上月1号的时间戳
            lastmonthtime = (new Date(thisyear + "-" + lastmonth + "-" + 1) / 1000);
        //计算结果
        let pharseResult = [],
            judgeTime, //判断时间状态，5统计所有，4统计上月，3统计本月，2统计7天，1统计昨天，0统计今天
            every_badge, //此条记录的类型
            every_duration, //视频时长
            every_progress, //观看时长
            every_view_at, //观看时间
            //获取数据长度
            cacheBucketLen = cacheBucket.length,
            //计数用
            ntjs;
        //逐个统计计算
        for (ntjs = 1; ntjs < cacheBucketLen; ntjs++) {
            //逐个获取数据
            every_badge = cacheBucket[ntjs].badge;
            every_duration = cacheBucket[ntjs].duration;
            every_progress = cacheBucket[ntjs].progress;
            every_view_at = cacheBucket[ntjs].view_at;
            //计入统计所有
            judgeTime = 5;
            //执行集中统计模块 返回统计结果
            pharseResult = pharseAll(every_badge, every_duration, every_progress, judgeTime, pharseResult);
            if (lastmonthtime < every_view_at && every_view_at < thismonthtime) {
                //判断时间是否在上月范围内
                judgeTime = 4;
                //是则执行集中统计模块 返回统计结果
                pharseResult = pharseAll(every_badge, every_duration, every_progress, judgeTime, pharseResult);
            }
            if (thismonthtime < every_view_at) {
                //判断时间是否在本月范围内
                judgeTime = 3;
                //是则执行集中统计模块 返回统计结果
                pharseResult = pharseAll(every_badge, every_duration, every_progress, judgeTime, pharseResult);
            }
            if (weektime < every_view_at) {
                //判断时间是否在7天范围内
                judgeTime = 2;
                //是则执行集中统计模块 返回统计结果
                pharseResult = pharseAll(every_badge, every_duration, every_progress, judgeTime, pharseResult);
            }
            if (yesterdaytime < every_view_at && every_view_at < todaytime) {
                //判断时间是否在昨天范围内
                judgeTime = 1;
                //是则执行集中统计模块 返回统计结果
                pharseResult = pharseAll(every_badge, every_duration, every_progress, judgeTime, pharseResult);
            }
            if (todaytime < every_view_at) {
                //判断时间是否在今天范围内
                judgeTime = 0;
                //是则执行集中统计模块 返回统计结果
                pharseResult = pharseAll(every_badge, every_duration, every_progress, judgeTime, pharseResult);
            }
        }
        return pharseResult;
    }
    //集中统计模块
    function pharseAll(every_badge, every_duration, every_progress, judgeTime, pharseResult) {
        //判断是否属于视频
        if (every_badge == "" || every_badge == "综艺" || every_badge == "电影" || every_badge == "番剧" || every_badge == "纪录片" || every_badge == "电视剧" || every_badge == "国创") {
            if (pharseResult.length == 0) {
                //赋值初始内容
                for (let j = 0; j < 6; j++) {
                    pharseResult[j] = ({ av: 0, cv: 0, live: 0, avtime: 0, gktime: 0 });
                }
            }
            //属于视频则添加计数，并加总视频时长和观看时长
            pharseResult[judgeTime].av = pharseResult[judgeTime].av + 1;
            pharseResult[judgeTime].avtime = pharseResult[judgeTime].avtime + every_duration;
            //如果every_duration是-1值，则说明看完了此视频
            if (every_progress == -1) {
                every_progress = every_duration;
            }
            pharseResult[judgeTime].gktime = pharseResult[judgeTime].gktime + every_progress;
        } else if (every_badge == "专栏" || every_badge == "笔记") {
            //判断是否属于专栏
            pharseResult[judgeTime].cv = pharseResult[judgeTime].cv + 1;
        } else if (every_badge == "未开播" || every_badge == "直播中") {
            //判断是否属于直播
            pharseResult[judgeTime].live = pharseResult[judgeTime].live + 1;
        }
        //返回统计结果
        return pharseResult;
    }
    //根据数据特性判断是否要补全视频描述信息
    function videoTag(cacheBucket) {
        let cacheLen = cacheBucket.length;
        let disc = cacheBucket[cacheLen - 1].hasOwnProperty('tag_name');
        //从最早的数据开始处理
        //最早数据有视频描述
        if (cacheBucket[1].hasOwnProperty('tag_name')) {
            //最新数据有 最早也有
            if (disc) {
                cacheBucket[0].repair = cacheBucket[cacheLen - 1].view_at;
                cacheBucket[0].first_cache = 8 //完全不需要处理
                preEC.setPreE(40);
            } else { //最新没有 最早有
                cacheBucket[0].first_cache = 7; //完全处理过但需更新
                //console.log("需更新");
                if (cacheBucket[0].hasOwnProperty('repair')) {
                    // 遍历数组，找到第一个属性prop等于value的元素
                    const foundElement = cacheBucket.find(e => e.view_at === cacheBucket[0].repair);
                    // 如果找到了元素，返回它在数组中的下标；否则返回-1
                    const index = foundElement ? cacheBucket.indexOf(foundElement) : -1;
                    videoDisc(index, cacheBucket);
                }
            }
        } else {
            //第一次直接完全处理
            //最早没有 最新也没有
            if (!disc) {
                //由于是第一次则直接获取全部数组
                cacheBucket[0].first_cache = 7;
                videoDisc(1, cacheBucket);
            } else { //最早没有 最新有
                //不会出现的情况
            }
        }
    }

    //给数据添加视频描述
    async function videoDisc(iii, cacheBucket) {
        const cacheLen = cacheBucket.length;
        //从什么位置开始
        let tag, repair;
        for (let i = iii; i < cacheLen; i++) {
            tag = await getOneAjax(`https://api.bilibili.com/x/web-interface/view/detail/tag?aid=${cacheBucket[i].oid}`);
            if (tag.code === 0) {
                let tag_data = tag.data;
                //视频标签循环获取及拼接
                //设置无描述计数
                let tag_name = '';
                for (let k = 0; k < tag_data.length; k++) {
                    //设置 tag_name
                    if (tag_name == '') {
                        tag_name = '' + tag_data[k].tag_name;
                    } else {
                        tag_name = tag_name + ';' + tag_data[k].tag_name;
                    }
                    cacheBucket[i].tag_name = tag_name;
                }
                repair = cacheBucket[i].view_at;
            }
            //是否到最后的位置
            if (cacheBucket[cacheLen - 1].view_at === repair) {
                cacheBucket[0].first_cache = 8;
            }
            cacheBucket[0].repair = repair;
            GMsetJson('lishijilulist', cacheBucket);
        }
        GMsetJson('lishijilulist', cacheBucket);
    }

    
    //备份数据
    function BackupData(opts) {
        let oldCacheBucket, backupCacheBucket;
        if (opts == 1) {
            //备份旧数据 1
            oldCacheBucket = GMgetStrToJson("lishijilulist");
            backupCacheBucket = oldCacheBucket;
            GMsetJson('backupCacheBucket', oldCacheBucket);
            backupCacheBucket = GMsetJson("backupCacheBucket", backupCacheBucket)
            console.log(GMgetStrToJson('backupCacheBucket'), GM_listValues());
        } else if (opts == 2) {
            // 用备份还原数据 2
            backupCacheBucket = GMgetStrToJson('backupCacheBucket');
            if (backupCacheBucket == undefined | backupCacheBucket == '') {
                console.log('没有备份数据');
            } else {
                GMsetJson('lishijilulist', backupCacheBucket);
            }
        } else if (opts == 3) {
            // 删除旧有数据仅保留备份 3
            GM_deleteValue("lishijilulist");
        }
    }

    
    checkPageUrl();

    // function searchArrayObject(arr, propName, searchStr) {
    //     // 如果搜索字符串包含空格，则将其拆分为多个关键词
    //     const keywords = searchStr.split(' ');

    //     let matchingIndexes = [];

    //     for (let i = 0; i < arr.length; i++) {
    //         let isMatched = true;
    //         const val = arr[i][propName];
    //         if (val) {
    //             // 对于每个关键词，判断当前元素中的指定属性是否包含该关键词
    //             for (let j = 0; j < keywords.length; j++) {
    //                 if (!val.includes(keywords[j])) {
    //                     isMatched = false;
    //                     break;
    //                 }
    //             }
    //             if (isMatched) {
    //                 matchingIndexes.push(i);
    //             }
    //         }
    //     }

    //     console.log("Matching indexes:", matchingIndexes);
    //     return matchingIndexes;
    // }

    // 点击tipsBox下载按钮时执行的函数
    
    function checkPreE() {
        const updateTipsBox = (text) => {
            const tipsBox = document.getElementById("tipsBox");
            if (tipsBox) {
                tipsBox.innerText = text;
                tipsBox.onclick = () => {
                    const preECData = GMgetStrToJson('lishijilulist');
                    if (preECData) {
                        preECData.shift();
                        const csvContent = preECData.map(row => Object.values(row).join(",")).join("\n");
                        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        link.download = 'PreEC Data.csv';
                        link.href = window.URL.createObjectURL(blob);
                        link.click();
                    }
                };
                tipsBox.title = text; // 添加 title 属性
            }
        };

        let currentStep = 0;

        const timer = setInterval(() => {
            const result = preEC.getPreE();
            switch (result) {
                case 0:
                    updateTipsBox('界面未启用');
                    break;
                case 10:
                    updateTipsBox('过往追溯中');
                    break;
                case 20:
                    updateTipsBox('过往已溯源');
                    preEC.setPreE(30);
                    currentStep = 30;
                    break;
                case -101:
                    updateTipsBox('请登录帐号');
                    clearInterval(timer);
                    break;
                case 30:
                    updateTipsBox('分析过往中');
                    currentStep = 30;
                    videoTag(GMgetStrToJson('lishijilulist'));
                    break;
                case 40:
                    updateTipsBox('过往已在线');
                    preEC.setPreE(50);
                    currentStep = 50;
                    break;
                case 50:
                    updateTipsBox('点击读入过往');
                    console.log('观看数据', GMgetStrToJson('lishijilulist'));
                    clearInterval(timer);
                    break;
            }
        }, 1000);
    }

    // 页面地址变化时执行的逻辑
    function checkPageUrl() {
        if (window.location.href.includes("bilibili.com")) {
            if (window.location.pathname === "/index.html" || window.location.pathname === "/" || window.location.pathname === "" || window.location.pathname === "index" || window.location.pathname.startsWith("?")) {
                ajaxHistory();
                checkPreE();
                // 调用函数并将返回值赋值给变量
                const maskBox = createMask();
                const popupBox = createPopupBox(maskBox);
                popup(maskBox, popupBox);
            }
            else if (window.location.href.includes("www.bilibili.com/correspond/") || window.location.href.includes("message.bilibili.com/pages/")) {
                // do nothing
            }
        }
    }

    function createMask() {
        // 创建遮罩层元素
        var mask = GM_addElement("div", {
            style: {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: "99",
                display: "none"
            },
        });
        // 将遮罩层添加到 body 中
        document.body.appendChild(mask);
        return mask;
    }

    function createPopupBox(mask) {
        // 创建弹窗元素
        // 创建弹窗元素
        var popup = GM_addElement("div", {
            id: "popupDiv",
            className: "popup",
        });

        // 创建提示区元素
        var tipsBox = GM_addElement("span", {
            id: "tipsBox",
            textContent: "这里是提示区",
        });

        // 创建标题元素
        var title = GM_addElement("h4", {
            textContent: "🐻你生命在哪里展开，哪里就是历史的界面🐻",
        });

        // 创建关闭按钮元素
        var closeBtn = GM_addElement("span", {
            id: "closeBtn",
            textContent: "❌",
        });

        // 将创建的子元素添加到弹窗元素中
        popup.appendChild(tipsBox);
        popup.appendChild(title);
        popup.appendChild(closeBtn);

        // 将弹窗元素添加到 body 中
        document.body.appendChild(popup);

        // 给关闭按钮添加 mouseover 和 mouseout 事件
        GM_addEvent(
            closeBtn,
            "mouseover",
            function () {
                this.style.color = "black";
            }
        );
        GM_addEvent(
            closeBtn,
            "mouseout",
            function () {
                this.style.color = "red";
            }
        );

        // 防止多次点击弹窗按钮
        var clicked = false;

        // 给关闭按钮添加 click 事件
        GM_addEvent(closeBtn, "click", function () {
            mask.style.display = 'none';
            popup.style.display = 'none';
            clicked = false;
            document.querySelector("#popupBtn").classList.remove("disabled");
        });

        // 防止点击弹窗时关闭弹窗
        GM_addEvent(popup, "click", function (event) {
            event.stopPropagation();
        });

        // 点击遮罩层关闭弹窗
        GM_addEvent(mask, "click", function () {
            if (!clicked) {
                mask.style.display = 'none';
                popup.style.display = 'none';
                clicked = false;
                document.querySelector("#popupBtn").classList.remove("disabled");
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                if (!clicked) {
                    mask.style.display = 'none';
                    popup.style.display = 'none';
                    clicked = false;
                    document.querySelector("#popupBtn").classList.remove("disabled");
                }
            }
        });
        return popup;
    }

    function popup(mask, popup) {
        // 创建按钮元素并添加点击事件
        var isFirstClick = true; // 设置为第一次点击按钮
        var btn = GM_addElement("div", {
            id: "popupBtn",
            text: "🐻历史",
            onclick: function () {
                if (!this.classList.contains("disabled")) {
                    this.classList.add("disabled");
                    // 如果是第一次点击，继续加载内容
                    if (isFirstClick) {
                        const lishi = GMgetStrToJson('lishijilulist'); 
                        delete lishi[0];
                        addMessInfo(popup, lishi);
                        //addSearchBox(popup, lishi);
                        addTagBox(popup, lishi);
                        addCardBox(popup, lishi);
                        
                        isFirstClick = false; // 标记为不是第一次点击
                    }
                    mask.style.display = 'block';
                    popup.style.display = 'block';
                }
            },
            style: {
                transition: "transform 0.2s, width 0.2s",
                transformOrigin: "center center",
                cursor: "pointer",
                display: "inline-block" // 添加 display 样式
            }
        });

        // 添加按钮缩放效果
        GM_addEvent(btn, "mouseover", function () {
            this.style.transform = "scale(1.01)"; 
            this.style.width = "10rem";
            this.textContent = "🐻我的时间不见了";
        });
        GM_addEvent(btn, "mouseout", function () {
            this.style.transform = "scale(1)"; 
            this.style.width = "auto";
            this.textContent = "🐻历史";
        });

        document.body.appendChild(btn);
    }

    function addMessInfo(container, lishi) {
        let his = pharseResult(lishi);
        var messInfoBox = GM_addElement("div", {
            style:
                "display: flex; margin: 0 auto; justify-content: center; padding: .2rem; font-size: 1.1rem;",
        });

        var loadingDiv = GM_addElement("div", {
            style: "text-align:center; font-weight:bold;",
            text: "正在获取中...",
        });

        container.appendChild(messInfoBox);
        messInfoBox.appendChild(loadingDiv);

        const info = ["◎    今日", "◎   昨日", "◎   本周", "◎   本月", "◎   上月", "◎   以往"];

        setTimeout(() => {
            loadingDiv.style.display = "none";

            for (let i = 0; i < info.length; i++) {
                var infoDiv = GM_addElement("div", {
                    style: "border:1px solid #000;margin: 0 .5rem;padding:.1rem .2rem;",
                });
                messInfoBox.appendChild(infoDiv);
                infoDiv.append(GM_addElement("div", { text: info[i] }));
                infoDiv.append(GM_addElement("div", { text: his[i].av }));
                infoDiv.append(GM_addElement("div", { text: "00:00:00" }));
            }
        }, 2000);
    }


    function addSearchBox(container,lishi) {
        // 添加搜索框和按钮元素的容器
        var searchDiv = GM_addElement("div", {
            id: "searchDiv"
        });
        // 添加搜索框和按钮元素
        var searchInputKeyword = GM_addElement("input", {
            type: "text",
            className: "searchInput",
            required: true,
            placeholder: "你的记忆中的关键词"
        });
        var searchInputTag = GM_addElement("input", {
            type: "text",
            className: "searchInput",
            placeholder: "你觉得视频应属的标签"
        });
        // 获取当前日期
        const today = new Date().toISOString().split('T')[0];
        var searchInputDateF = GM_addElement("input", {
            type: "date",
            className: "searchDate",
            max: today,
            value: today,
            required: true
        });
        var searchInputDateE = GM_addElement("input", {
            type: "date",
            className: "searchDate",
            max: today,
            value: today,
            required: true
        });
        var searchButton = GM_addElement("span", {
            className: "searchButton",
            textContent: "►"
        });

     
        // 添加搜索框和按钮元素
        var searchTextA = GM_addElement("span", {
            text: "从",
            className: "searchText"
        });
        var searchTextB = GM_addElement("span", {
            text: "到",
            className: "searchText"
        });

        // 将搜索框添加到指定的容器元素中
        container.appendChild(searchDiv);
        searchDiv.appendChild(searchInputKeyword);
        searchDiv.appendChild(searchInputTag);
        searchDiv.appendChild(searchTextA);
        searchDiv.appendChild(searchInputDateF);
        searchDiv.appendChild(searchTextB);
        searchDiv.appendChild(searchInputDateE);
        searchDiv.appendChild(searchButton);
        // 添加点击事件处理程序
        searchButton.addEventListener("click", function (event) {
            event.preventDefault();
            searchButton.classList.add('clicked'); // 添加点击效果的 CSS 类名

            var results;
            //results="功能完成中";
            if (searchInputKeyword.value === ""){
                alert("请输入内容")
            }else if(searchInputDateE>searchInputDateF){
                alert("开始日期不应小于结束日期")
            }else{
                if (searchInputTag === "") {
                    results = searchPosts(lishi, { title: searchInputKeyword.value, startDate: searchInputDateF.value, endDate: searchInputDateE.value})
                }else{
                    results = searchPosts(lishi, { title: searchInputKeyword.value, startDate: searchInputDateF.value, endDate: searchInputDateE.value, tags: searchInputTag.value })
                }
            }
            console.log(results);

            setTimeout(() => {
                searchButton.classList.remove('clicked');
            }, 200); // 移除点击效果的 CSS 类名
        });
        // searchButton.addEventListener('click', function (event) {
        //     event.preventDefault();
        //     searchButton.classList.add('clicked'); // 添加点击效果的 CSS 类名
        //     setTimeout(() => {
        //         searchButton.classList.remove('clicked');
        //     }, 200); // 移除点击效果的 CSS 类名
        // });
    }

    function searchPosts(lishi,query) {
        const { author, title, startDate, endDate, tags } = query;
        var data = lishi;
        return data.filter(post => {
            // 检查作者名称匹配
            if (author && post.author_name.toLowerCase().indexOf(author.toLowerCase()) === -1) {
                return false;
            }

            // 检查标题匹配
            if (title && post.title.toLowerCase().indexOf(title.toLowerCase()) === -1) {
                return false;
            }

            // 检查日期范围匹配
            if (startDate && endDate && (post.date < startDate || post.date > endDate)) {
                return false;
            }

            if (tags && Array.isArray(tags) && tags.length > 0) {
                const postTags = post.tag_name.split(';');
                // 检查是否有不存在的标签
                if (tags.some(tag => !postTags.includes(tag))) {
                    return false;
                }
                const matches = tags.filter(tag => postTags.includes(tag));
                if (matches.length !== tags.length) {
                    return false;
                }
            }


            return true;
        });
    }


    function addCardBox(container, lishio) {
        const cardDiv = document.createElement("div");
        cardDiv.style.display = "flex";
        cardDiv.style.padding = ".2rem";
        cardDiv.style.fontSize = "1.1rem";
        cardDiv.style.overflowX = "auto";
        cardDiv.style.maxWidth = "1000px";

        container.appendChild(cardDiv);

        let lishi = lishio.sort((a, b) => b.view_at - a.view_at); // Sort in descending order

        const batchSize = 10; // Generate cards in batches of 10

        function generateCards(startIndex) {
            for (let i = startIndex; i < startIndex + batchSize; i++) {
                if (i >= lishi.length) return; // Stop generating cards after the last card
                oneCardInfo(cardDiv, lishi, i);
            }
        }

        // Show "Loading..." message while generating the first batch of cards
        cardDiv.innerHTML = "<p>Loading...</p>";

        setTimeout(function () {
            generateCards(0);
            cardDiv.removeChild(cardDiv.firstChild); // Remove the "Loading..." message
        }, 500); // Wait for half a second before generating cards

        // Use requestAnimationFrame for smooth scrolling
        let requestId;
        let delta = 0;

        function scrollDiv() {
            if (!requestId) requestId = window.requestAnimationFrame(updateScrollPosition);
        }

        function updateScrollPosition() {
            cardDiv.scrollLeft += Math.max(-1, Math.min(1, delta)) * 70; // Use the delta value from the wheel event
            delta = 0; // Reset the delta value
            requestId = null;
        }

        // Add wheel event listener to the div
        cardDiv.addEventListener("wheel", function (event) {
            event.preventDefault();
            delta += event.deltaY || -event.detail;
            scrollDiv();
        });

        // Show more cards when scrolling to the end of the container
        cardDiv.addEventListener("scroll", function () {
            if (cardDiv.scrollLeft + cardDiv.offsetWidth >= cardDiv.scrollWidth) {
                const startIndex = cardDiv.children.length;
                generateCards(startIndex);
            }
        });
    }

    async function addTagBox(popup, lishi) {
        const sortedTags = await tagStatsSorted(lishi);
        const tagContainer = document.createDocumentFragment();
        const loadingElement = document.createElement("div");

        // Show the loading spinner before the tags are populated
        loadingElement.innerText = "Loading...";
        loadingElement.setAttribute("style", `
    display: block;
    margin-bottom: 0.5rem;
    text-align: center;
  `);
        tagContainer.appendChild(loadingElement);

        for (let i = 0; i < Math.min(sortedTags.length, sortedTags.length - 1); i++) {
            const tag = sortedTags[i];
            const tagElement = document.createElement("div");
            tagElement.innerText = `${tag.name}: ${tag.count}`;
            tagElement.style.backgroundColor = `hsl(${i * 36}, 75%, 87.5%)`;
            tagElement.classList.add("tags");
            tagContainer.appendChild(tagElement);
        }

        const tagBox = document.createElement("div");
        tagBox.appendChild(tagContainer);
        tagBox.setAttribute("style", `
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
    padding: 12px;
    font-size: 14px;
    overflow-y: scroll;
    max-height: 10rem;
    display: flex;
    flex-wrap: wrap;
    ${popup.getAttribute("style")}
  `);

        // Hide the loading spinner once the tags are loaded
        loadingElement.style.display = "none";
        popup.appendChild(tagBox);
    }

    //根据下标生成信息卡片
    async function oneCardInfo(cardDiv, lishi, i) {
        const singleData = lishi[i];
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");

        const authorElementDiv = document.createElement("div");
        const authorElement = document.createElement("a");
        authorElement.href = `https://space.bilibili.com/${singleData.author_mid}`;
        authorElement.target = "_blank";
        authorElement.title = singleData.author_name;
        authorElement.textContent = singleData.author_name;

        const titleElement = document.createElement("a");
        if (singleData.badge === "专栏") { 
            //alert("请复制标题后自行搜索");
            //titleElement.href = `https://www.bilibili.com/read/cv${singleData.oid}`;
        }else if(singleData.badge === ""){
            titleElement.href = `https://www.bilibili.com/av${singleData.oid}`;
        }else{

        }
        titleElement.target = "_blank";
        titleElement.title = singleData.title;
        titleElement.textContent = singleData.title;

        cardDiv.appendChild(cardElement);
        cardElement.appendChild(titleElement);
        cardElement.appendChild(authorElementDiv);
        authorElementDiv.appendChild(authorElement);

        let html = "";
        const tags = await tagStats([singleData]);
        for (let i = 0; i < Math.min(tags.names.length, tags.names.length - 1); i++) {
            const tag = tags.names[i];
            const hue = Math.floor(Math.random() * 360);
            const saturation = Math.floor(Math.random() * 25) + 75;
            const lightness = Math.floor(Math.random() * 15) + 80;
            const bgColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            html += `<li class='tag' style="background-color: ${bgColor};">${tag}</li>`;
        }

        const tagsElement = document.createElement("ul");
        tagsElement.innerHTML = html;
        tagsElement.title = tags.names;
        tagsElement.classList.add("tags");

        cardElement.appendChild(tagsElement);
    }

    async function tagStatsSorted(lishi, start = 0, end = lishi.length - 1) {
        // 使用 tagStats 函数来获取标签计数数据
        const tagData = await tagStats(lishi, start, end);
        // 使用 sortTagsByFrequency 函数来对标签进行排序，并且返回名称和计数的标签数据对象数组
        const sortedTags = sortTagsByFrequency(tagData);
        // 返回排序后的标签数据对象数组
        return sortedTags;
    }

    function sortTagsByFrequency(tagData) {
        const sortedNames = tagData.names.sort((a, b) => {
            const countDiff = tagData.counts[b] - tagData.counts[a];
            if (countDiff !== 0) {
                return countDiff; // 相同频率的标签按照出现次数排序
            } else {
                return a.localeCompare(b); // 字母顺序排列
            }
        });

        return sortedNames.map(name => ({ name, count: tagData.counts[name] }));
    }

    async function tagStats(lishi, start = 0, end = lishi.length - 1) {
        var tagCounts = {};
        var tagNames = {};

        for (let i = start; i <= end; i++) {
            var tagName = lishi[i]?.tag_name?.trim() || '无数据';

            if (tagName === '无数据') {
                continue;
            }

            var singleTagNames = tagName.split(';');

            singleTagNames.forEach((singleTagName) => {
                singleTagName = singleTagName.trim();
                if (singleTagName === '') return;
                var tagCount = tagCounts[singleTagName] || 0;
                tagCounts[singleTagName] = tagCount + 1;
                tagNames[singleTagName] = true;
            });
        }

        return {
            counts: tagCounts,
            names: Object.keys(tagNames),
        };
    }
  
    //     // 绑定按钮点击事件
    //     searchButton.addEventListener("click", function () {
    //         var query = searchInput.value;
    //         var result = findIndex(query);

    //         // 处理搜索结果
    //         if (result) {
    //             alert(result);
    //         } else {
    //             alert("没有匹配项");
    //         }
    //     });


    // 添加样式
    GM_addStyle(`

.tags {
    display: inline-block;
}
            
.clicked {
  background-color: #e6e6e6;
  box-shadow: inset 0 2px 3px rgba(0,0,0,.2);
}

/* 卡片展示视频信息 */
.card {
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0,0,0,0.2);
  margin: .5rem;
  padding: .5rem;
}

.card a {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 19rem;
    display:inline-block;
}

.card .tags {
    list-style: none;
    text-align: left;
    white-space: nowrap; /* 文本不换行 */
    overflow: hidden; /* 隐藏多余文本 */
    text-overflow: ellipsis; /* 使用省略号表示被截断的文本 */
    max-width: 20rem;
}
.card .tags .tag {
    display: inline-block;
    margin-left: .3rem;
    border: 1px solid #000;
}



/* 搜索框 */
#searchDiv {
    text-align:left;
}
#searchDiv .searchInput {
  padding: 8px;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  width: 270px;
}
#searchDiv .searchText {
  padding: 8px;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 16px;
}
#searchDiv .searchDate  {
  padding: 8px;
  border: none;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  width: 130px;
}

/* 搜索按钮 */
#searchDiv  .searchButton{
  background-color:  #FFFFFF;
  color:  #666666;
  border: none;
  border-radius: 5px;
  padding: 8px;
  margin-left: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  user-select: none;
  font-size: 1.2rem;
}

#searchDiv  .searchButton:hover {
    background-color: #F5F5F5;
    color: #333333;
    font-size: 1.3rem;
}

#searchDiv  .searchButton:focus {
    outline: none;
}

.popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: .2rem;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
  font-family: Arial, sans-serif;
  font-size: 16px;
  color: #333;
  text-align: center;
  aspect-ratio: 16 / 9;
  display: none;
  max-width: 1000px;
  margin-top:4rem;
}

.popup h4 {
  font-size: 1.2rem;
  padding: .3rem;
  margin-right: 1.1rem;
  user-select: none;
  display:inline-block;
  border: 1px solid #000;
}

#tipsBox {
  float: left;
  border: 1px solid #000;
  top: .3rem;
  right: .3rem;
  cursor: pointer;
  font-size: 1.2rem;
  font-family: Arial, sans-serif;
  user-select: none;
}

#closeBtn{
  position: absolute;
  top: .3rem;
  right: .3rem;
  cursor: pointer;
  font-size: 1.3rem;
  width: 1.2rem;
  height: 1.2rem;
  font-family: Arial, sans-serif;
  user-select: none;
}

#popupBtn{
  position: fixed;
  top: 50%;
  left: 0;
  background-color: #428bca;
  border: none;
  color: #fff;
  padding: 8px 0;
  font-size: 18px;
  cursor: pointer;
  z-index: 101;
  transform: translateY(-50%);
  width: 4rem;
  text-align: center;
  user-select: none;
  border-radius: .5rem;
}

#popupBtn:hover {
  background-color: #3071a9;
}

#popupBtn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media only screen and (max-width: 480px) {
  #popupBtn{
    width: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
`);

})();
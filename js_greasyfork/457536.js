// ==UserScript==
// @name         qB Torrents Auto Delete
// @namespace    -
// @version      1.0
// @description  qBittorrent Torrents Auto Delete
// @author       Dreamray
// @match        http*://*/api/v2/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457536/qB%20Torrents%20Auto%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/457536/qB%20Torrents%20Auto%20Delete.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 思路非常简单：只考虑种子活动时间内的平均上传速度，达不到设定值且当前上传速度也达不到设定值，就删，不考虑什么黑车、慢车，只看上传速度，适合家宽使用
     * 只删除上次活动时间距现在最久的种子：磁盘空间不足时只根据这一条件删种，其它条件太复杂也用不着，这一条就够了
     * 有辅种处理逻辑：删除做种状态的种子时检测有无同名或同大小种子，有则只删除种子不删除文件，无则文件也删
     * 只支持qb：抱歉本人只用qb，只在qb 4.4.3.1版本中测试过
     * 默认打开testMode，运行一段时间，确定不会出现误删种子后再关闭
     */

    //设置部分：
    const
        testMode                 = 1,   //测试模式用暂停代替删种，防止误删。测试无误后可修改值为0关闭
        cycle                    = 2,   //删种周期，也是向qb发起检查请求的周期，单位分钟，建议1分钟以上，太短了浏览嚣可能卡死
        averageUpSpeedScale      = 350, //平均上传速度标尺，单位KB，小于此值，且当前下载速度小于设定值，且是正在下载的种子，会被删
        timeActiveScale          = 5,   //最小活动时间标尺，单位分钟，种子活动时间高于此值才计算活动时间内的平均上传速度
        upSpeedScale             = 320, //上传速度标尺，单位KB，本次检查的上传速度小于此值，且活动时间内的平均上传速度小于设定值，会被删
        stalledDLTimeScale       = 20,  //种子未开始下载或下载中断后的等待时间标尺，超过此值的种子会被删，单位分钟
        queuedDLTimeScale        = 10,  //种子由于队列设置未开始下载的等待时间标尺，超过此值的种子会被删，单位分钟（刷流工具有时会一次添加多个种子，而由于qb的最大活动下载数设置导致有排队下载的情况适用）
        minFreeSpace             = 5,   //最小磁盘剩余空间，单位GB，小于此数值时会删除上次活动时间距现在最久的种子，建设设置为删种周期内最大下载数据量的2倍或更多倍
        // hrTrackerHour = {  //有HR站点的 tracker地址域名部分：HR时长
        //     'pt.btschool.club':20,
        //     '52pt.site':24,
        //     'tracker.torrentleech.org':240,
        //     'tracker.tleechreload.org':240
        // },
        hrTrackerHourRatio = {  //有HR站点的 tracker地址域名部分：{HR时长,分享率}
            'pt.btschool.club':{hour:20,ratio:1}, //HR时长 和 分享率 通常为或关系，即一个达到要求即可
            'www.nicept.net':{hour:120,ratio:2},
            '52pt.site':{hour:24,ratio:-1}, //-1表示无分享率选项（无视分享率，只考察HR时长）
            'tracker.torrentleech.org':{hour:240,ratio:-1},
            'tracker.tleechreload.org':{hour:240,ratio:-1}
        },
        shuaPathList = [ //只删除以下目录内的种子（不包括子目录，如果种子存放在以下目录的子目录中，子目录也必须加到此列表），建议刷流种子统一放此目录中
            'E:\\PT-Shua'
        ],
        keepCategoryList = [ //不删除以下分类的种子
            'Movie',
            'TV',
            'H',
            'Music',
            'Exam'
        ]
        // ,
        // freeTimeTrackerHour = { //免费时间短的站点tracker：最短免费时间，防止限免到期了还没下完，限免到期前删除(一般情况下用不着，像hh，8小时肯定出种了，不用担心下不完，暂时不实现这个功能了)
        //     'hhanclub.top':7
        // }
    ;
    let
        nowDate,
        maindata,
        torrents,
        torrentsSorted,
        timeNow,
        // hrTrackers = Object.keys(hrTrackerHour),
        // hrHours = Object.values(hrTrackerHour),
        hrTrackers = Object.keys(hrTrackerHourRatio),
        hrHourRatio = Object.values(hrTrackerHourRatio),
        // freeTimeTrackers = Object.keys(freeTimeTrackerHour),
        // freeTimeHours = Object.values(freeTimeTrackerHour),
        method,
        delete_files,
        diskFreeSpace,
        torrentsSortedNames,
        torrentsSortedSizes,
        willDelTorrentsSum,
        deletedTorrentIndex,
        progress1Sum,
        resumeSuccessSum,
        countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0),
        //setTimeout setInterval
        task = setInterval(check, cycle * 60000)
    ;
    // function isFreeTimeTracker(tracker){
    //     let domain = tracker.split('/');
    //     domain = domain[2];
    //     if(freeTimeTrackers.indexOf(domain) !== -1){
    //         return true;
    //     }else{
    //         return false
    //     }
    // }
    // function isFreeTimeHourExpireSoon(tracker,addedOn){
    //     let domain = tracker.split('/');
    //     domain = domain[2];
    //     let domainIndex = freeTimeTrackers.indexOf(domain);
    //     timeNow = Math.floor(Date.now() / 1000);
    //     if(timeNow - addedOn > freeTimeHours[domainIndex] * 3600){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // }
    function isHrTracker(tracker){
        let domain = tracker.split('/');
        domain = domain[2];
        if(hrTrackers.indexOf(domain) !== -1){
            return true;
        }else{
            return false
        }
    };
    // function isHrHourFinished(tracker,seedingTime){
    //     let domain = tracker.split('/');
    //     domain = domain[2];
    //     let domainIndex = hrTrackers.indexOf(domain);
    //     if(seedingTime > hrHours[domainIndex] * 3600 + 600){ //比站点规定的HR时间多10分钟，不确定这10分钟有没有必要
    //         return true;
    //     }else{
    //         return false;
    //     }
    // };
    function isHrFinished(tracker,seedingTime,torrentRatio){
        let domain = tracker.split('/');
        domain = domain[2];
        let domainIndex = hrTrackers.indexOf(domain);
        if(hrHourRatio[domainIndex].ratio > 0){
            if(
                seedingTime > hrHourRatio[domainIndex].hour * 3600 + 600 || //做种时间达标了(保险起见比站点规定的HR时间多10分钟，不确定这10分钟有没有必要)
                torrentRatio > hrHourRatio[domainIndex].ratio //或者分享率达标了
            ){
                return true;
            }else{
                return false;
            }
        }else{
            if(
                seedingTime > hrHourRatio[domainIndex].hour * 3600 + 600 //做种时间达标了(保险起见比站点规定的HR时间多10分钟，不确定这10分钟有没有必要)
            ){
                return true;
            }else{
                return false;
            }
        }
    };
    function isShuaFolder(savePath){
        if(shuaPathList.indexOf(savePath) !== -1){
            return true;
        }else{
            return false;
        }
    };
    function isKeepCategory(category){
        if(keepCategoryList.indexOf(category) !== -1){
            return true;
        }else{
            return false;
        }
    };
    function deleteTorrent(hash,name,reason,deleteFiles,callback){
        method = testMode ? 'pause' : 'delete';
        delete_files = testMode ? '' : '&deleteFiles=' + deleteFiles;
        let xhrDelete = new XMLHttpRequest();
        xhrDelete.open('GET', '/api/v2/torrents/' + method + '?hashes=' + hash + delete_files, true);
        xhrDelete.send();
        xhrDelete.onreadystatechange = function () {
            if (xhrDelete.readyState == 4 && ((xhrDelete.status >= 200 && xhrDelete.status < 300) || xhrDelete.status == 304)) {
                deletedTorrentIndex += 1;
                nowDate = new Date();
                console.log(nowDate.toLocaleTimeString() + '：成功删除第 ' + deletedTorrentIndex + ' 个 -> ' + name + ' 原因：' + reason);
                callback();
            }
        }
    };
    function check(){
        willDelTorrentsSum = 0;
        deletedTorrentIndex = 0;
        timeNow = Math.floor(Date.now() / 1000); //现在时间,unix格式
        let xhrMaindata = new XMLHttpRequest();
        xhrMaindata.open('GET', '/api/v2/sync/maindata', true);
        xhrMaindata.send();
        xhrMaindata.onreadystatechange = function () {
            if (xhrMaindata.readyState == 4 && ((xhrMaindata.status >= 200 && xhrMaindata.status < 300) || xhrMaindata.status == 304)) {
                maindata = JSON.parse(xhrMaindata.responseText);
                diskFreeSpace = maindata.server_state.free_space_on_disk;
                // console.log('磁盘剩余空间：');
                // console.log(diskFreeSpace / 1024 / 1024 / 1024 + 'G');
                let xhrTorrents = new XMLHttpRequest();
                xhrTorrents.open('GET', '/api/v2/torrents/info', true);
                xhrTorrents.send();
                xhrTorrents.onreadystatechange = function () {
                    if (xhrTorrents.readyState == 4 && ((xhrTorrents.status >= 200 && xhrTorrents.status < 300) || xhrTorrents.status == 304)) {
                        torrents = JSON.parse(xhrTorrents.responseText);
                        // console.log('原始种子列表：');
                        // console.log(torrents);
                        torrentsSorted = torrents.sort((obj1, obj2) => (obj1.last_activity > obj2.last_activity) ? 1 : (obj1.last_activity < obj2.last_activity) ? -1 : 0);
                        // console.log('排序后的种子列表：');
                        // console.log(torrentsSorted);
                        torrentsSortedNames = torrentsSorted.map(item =>{
                            return item.name
                        });
                        // console.log('排序后的种子列表摘出names：');
                        // console.log(torrentsSortedNames);
                        torrentsSortedSizes = torrentsSorted.map(item =>{
                            return item.size
                        });
                        // console.log('排序后的种子列表摘出size：');
                        // console.log(torrentsSortedSizes);
                        for(let i=0;i<torrentsSorted.length;i++){
                            if(
                                isShuaFolder(torrentsSorted[i].save_path) && //路径是刷流专放路径
                                !isKeepCategory(torrentsSorted[i].category) //非 保留的分类
                            ){
                                if(
                                    torrentsSorted[i].state == 'downloading' && //正在下载的种子
                                    torrentsSorted[i].time_active > timeActiveScale * 60 && //活动时间大于设定值
                                    torrentsSorted[i].uploaded / torrentsSorted[i].time_active < averageUpSpeedScale * 1024 && //活动时间内平均速度小于设定值
                                    torrentsSorted[i].upspeed < upSpeedScale * 1024 //并且本次检查时的上传速度小于设定值
                                ){
                                    if(
                                        torrentsSorted[i].progress < 0.5 //进度小于50%，无需考虑hr
                                    ){
                                        willDelTorrentsSum += 1;
                                        deleteTorrent(torrentsSorted[i].hash,torrentsSorted[i].name,'平均速度小于设定值',true,function(){ //删除文件
                                            console.log('文件已删除，停止继续删种，等待下一次检查');
                                        });
                                        break;
                                    };
                                    if(
                                        torrentsSorted[i].progress > 0.5 && //进度大于50%，需要考虑hr
                                        !isHrTracker(torrentsSorted[i].tracker) //非 有hr
                                    ){
                                        willDelTorrentsSum += 1;
                                        deleteTorrent(torrentsSorted[i].hash,torrentsSorted[i].name,'平均速度小于设定值',true,function(){ //删除文件
                                            console.log('文件已删除，停止继续删种，等待下一次检查');
                                        });
                                        break;
                                    }
                                };
                                if(
                                    torrentsSorted[i].state == 'stalledDL' && //未开始下载或下载中断的种子
                                    timeNow - torrentsSorted[i].added_on > stalledDLTimeScale * 60 //等待下载时间超过设定值
                                ){
                                    if(
                                        torrentsSorted[i].progress < 0.5 //进度小于50%，无需考虑hr
                                    ){
                                        willDelTorrentsSum += 1;
                                        deleteTorrent(torrentsSorted[i].hash,torrentsSorted[i].name,'等待下载时间大于设定值',true,function(){ //删除文件
                                            console.log('文件已删除，停止继续删种，等待下一次检查');
                                        });
                                        break;
                                    };
                                    if(
                                        torrentsSorted[i].progress > 0.5 && //进度大于50%，需要考虑hr
                                        !isHrTracker(torrentsSorted[i].tracker) //非 有hr
                                    ){
                                        willDelTorrentsSum += 1;
                                        deleteTorrent(torrentsSorted[i].hash,torrentsSorted[i].name,'等待下载时间大于设定值',true,function(){ //删除文件
                                            console.log('文件已删除，停止继续删种，等待下一次检查');
                                        });
                                        break;
                                    }
                                };
                                if(
                                    torrentsSorted[i].state == 'queuedDL' && //排队下载的种子
                                    timeNow - torrentsSorted[i].added_on > queuedDLTimeScale * 60 //排队等待下载时间超过设定值
                                ){
                                    willDelTorrentsSum += 1;
                                    deleteTorrent(torrentsSorted[i].hash,torrentsSorted[i].name,'队列下载时间大于设定值',true,function(){ //删除文件
                                        console.log('种子已删除，继续处理其它种子');
                                    })
                                };
                                if(
                                    diskFreeSpace < minFreeSpace * 1024 * 1024 * 1024 && //磁盘空间小于设定值
                                    torrentsSorted[i].state == 'stalledUP' //做种但没在上传的种子
                                ){
                                    if(
                                        !isHrTracker(torrentsSorted[i].tracker) //非 有hr
                                    ){
                                        if(
                                            (countOccurrences(torrentsSortedNames,torrentsSorted[i].name) > 1 || countOccurrences(torrentsSortedSizes,torrentsSorted[i].size) > 1) //有辅种
                                        ){
                                            willDelTorrentsSum += 1;
                                            deleteTorrent(torrentsSorted[i].hash,torrentsSorted[i].name,'磁盘空间不足，删除上次活动时间距现在最久的种子（有辅种，保留文件）',false,function(){ //不删除文件
                                                console.log('文件未删除，磁盘空间仍不足，继续删种');
                                            })
                                        };
                                        if(
                                            (countOccurrences(torrentsSortedNames,torrentsSorted[i].name) <= 1 && countOccurrences(torrentsSortedSizes,torrentsSorted[i].size) <= 1) //无辅种
                                        ){
                                            willDelTorrentsSum += 1;
                                            setTimeout(function(){
                                                deleteTorrent(torrentsSorted[i].hash,torrentsSorted[i].name,'磁盘空间不足，删除上次活动时间距现在最久的种子和文件',true,function(){ //删除文件
                                                    console.log('文件已删除，停止继续删种，等待下一次检查磁盘剩余空间');
                                                });
                                            },1000)
                                            break;
                                        }
                                    };
                                    if(
                                        isHrTracker(torrentsSorted[i].tracker) && //有hr
                                        (torrentsSorted[i].downloaded == 0 || isHrFinished(torrentsSorted[i].tracker,torrentsSorted[i].seeding_time,torrentsSorted[i].ratio)) //下载数据量为0不考虑hr或hr达标了
                                    ){
                                        if(
                                            (countOccurrences(torrentsSortedNames,torrentsSorted[i].name) > 1 || countOccurrences(torrentsSortedSizes,torrentsSorted[i].size) > 1) //有辅种
                                        ){
                                            willDelTorrentsSum += 1;
                                            deleteTorrent(torrentsSorted[i].hash,torrentsSorted[i].name,'磁盘空间不足，删除上次活动时间距现在最久的种子（有辅种，保留文件）',false,function(){ //不删除文件
                                                console.log('文件未删除，磁盘空间仍不足，继续删种');
                                            })
                                        };
                                        if(
                                            (countOccurrences(torrentsSortedNames,torrentsSorted[i].name) <= 1 && countOccurrences(torrentsSortedSizes,torrentsSorted[i].size) <= 1) //无辅种
                                        ){
                                            willDelTorrentsSum += 1;
                                            setTimeout(function(){
                                                deleteTorrent(torrentsSorted[i].hash,torrentsSorted[i].name,'磁盘空间不足，删除上次活动时间距现在最久的种子和文件',true,function(){ //删除文件
                                                    console.log('文件已删除，停止继续删种，等待下一次检查磁盘剩余空间');
                                                });
                                            },1000)
                                            break;
                                        }
                                    }
                                }
                            }
                        };
                        if(willDelTorrentsSum >0){
                            nowDate = new Date();
                            console.log(nowDate.toLocaleTimeString() + '：本次检查共有 ' + willDelTorrentsSum + ' 个符合删除条件的种子');
                        }
                    }
                }
            }
        }
    }
})();
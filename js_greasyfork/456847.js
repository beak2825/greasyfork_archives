// ==UserScript==
// @name         bilibiliGetExp
// @namespace    https://iconquestion.github.io
// @version      1.29
// @description  (Original version) Automatically finish DAU task at bilibili to get experience point.
// @author       ICONQUESTION
// @match        https://t.bilibili.com
// @icon         https://bilibili.com/favicon.ico
// @grant        none
// @require      https://cdn.bootcss.com/blueimp-md5/2.10.0/js/md5.js
// @downloadURL https://update.greasyfork.org/scripts/456847/bilibiliGetExp.user.js
// @updateURL https://update.greasyfork.org/scripts/456847/bilibiliGetExp.meta.js
// ==/UserScript==

var urlList = {
    checkTasks: 'https://api.bilibili.com/x/member/web/exp/reward',
    watchVideo: 'https://api.bilibili.com/x/click-interface/web/heartbeat',
    shareVideo: 'https://api.biliapi.net/x/share/finish',
    dynamic: 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all?timezone_offset=-480&type=video&page=1',
    videoProperty: 'https://api.bilibili.com/x/player/pagelist',
    getAccess_key: 'https://passport.bilibili.com/login/app/third?appkey=1d8b6e7d45233436&api=http://link.acg.tv/forum.php&sign=5f9c0a5c2360c80b858d546a23a4a9dd',
}

//将document.cookie中的'; '替换为'&'，从而满足生成URL对象的条件，再利用URL对象的searchParam功能完成cookie检索
var cookies = new URL('http://hello.world/test?' + document.cookie.replaceAll('; ', '&'))
var shareVideoDone = cookies.searchParams.get('shareVideoDone'), watchVideoDone = cookies.searchParams.get('watchVideoDone')
var csrftoken = cookies.searchParams.get('bili_jct')
var mid = cookies.searchParams.get('DedeUserID')
var access_key = cookies.searchParams.get('access_key')

//date用来设置记录性cookies过期时间为第二天0:0:0
var date = new Date()
var currentTime = parseInt((date.getTime()) / 1000);
date.setTime(date.getTime() + 3600 * 24 * 1000)
date.setHours(0, 0, 0, 0)

//调试性开关
/*
var debugMode = {
    'true': '无论返回数据显示任务是否完成，都再执行一次',
    'false': '根据返回数据情况，有选择地执行'
}
*/
var debugMode = false

/*
var cookieRecordComesFirst={
    'true':'以cookies中的任务完成记录为准',
    'false':'以fetch请求返回的数据为准'
}
*/
var cookieRecordComesFirst = true


//从这里开始执行
window.onload = function () {
    //1.检查登录态
    if (!csrftoken || !mid) {
        console.log('csrf或mid不存在，请登录。如果您已经登录，请尝试清空cookies后重新登录。')
        return;
    }

    new Promise(function (resolve, reject) {
        //2.检查可完成的任务，resolve=成功，reject=出现错误
        if (cookieRecordComesFirst) {
            console.log('当前模式：cookies记录优先')
            var status = { 'share': shareVideoDone, 'watch': watchVideoDone }
            console.log(status)
            resolve(status)
        } else {
            console.log('当前模式：fetch请求优先')
            checkTasks(resolve, reject)
        }
    }).then(function (data) {
        //在未开启调试模式状态下，如果返回数据表明任务已经全部完成，则程序退出，减少资源占用
        if (!debugMode && data.share && data.watch) {
            console.log('所有任务已经完成！')
            return
        }

        new Promise(function (resolve, reject) {
            //3.从动态列表拉取视频，resolve=成功，reject=无视频或出现错误
            grabVideo(resolve, reject)
        }).then(function (videoProp) {
            //4.1 完成观看视频任务
            if (!data.share || debugMode) {
                watchVideo(videoProp)
            } else {
                console.log('观看视频任务已经完成！')
            }

            //4.2 完成分享视频任务
            if (!data.watch || debugMode) {
                if (!access_key) {
                    //4.2.1 获取access_key
                    new Promise(function (resolve, reject) {
                        //resolve=用户输入access_key，reject=用户取消操作
                        getAccessKey(resolve, reject)
                    }).then(function () {
                        //4.2.2 分享视频
                        shareVideo(videoProp)
                    }, function (msg) {
                        console.log(msg)
                        return
                    })
                } else {
                    //4.2.1 分享视频
                    shareVideo(videoProp)
                }
            } else {
                console.log('分享视频任务已经完成！')
                return
            }

        }, function (msg) {
            console.log(msg)
            return
        })
    }, function (msg) {
        console.log(msg)
        return
    })
}


//检查可获得经验值的任务
function checkTasks(resolve, reject) {
    console.log('正在检查任务列表')

    fetch(urlList.checkTasks, {
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'zh-CN,zh;q=0.9',
        },
    }).then(function (res) {
        return res.headers.get('Content-Type').search('application/json') != -1 ? res.json() : undefined
    }).then(function (data) {
        //console.log(data)
        if (!data || !data.data) {
            reject('fetch(urlList.checkTasks) 返回数据异常。')
        } else {
            //传回最内层data（对象）
            resolve(data.data)
        }
    })
}


//抓取视频
function grabVideo(resolve, reject) {
    console.log('正在抓取视频')

    fetch(urlList.dynamic, {
        credentials: 'include',
    }).then(function (res) {
        return res.headers.get('Content-Type').search('application/json') != -1 ? res.json() : undefined
    }).then(function (data) {
        //console.log(data)
        if (!data || !data.data || !data.data.items) {
            reject('fetch(urlList.dynamic) 返回数据类型异常，或返回列表为空。')
            return
        }

        var aid = data.data.items[0].basic.comment_id_str
        // console.log(typeof (aid))
        var bvid = data.data.items[0].modules.module_dynamic.major.archive.bvid
        // console.log(typeof (bvid))

        fetch(urlList.videoProperty + '?bvid=' + bvid + '&jsonp=jsonp', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'zh-CN,zh;q=0.9',
            },
        }).then(function (res) {
            return res.headers.get('Content-Type').search('application/json') != -1 ? res.json() : undefined
        }).then(function (data) {
            //console.log(data)
            if (!data || !data.data || !data.data[0].cid) {
                reject('fetch(urlList.videoProperty) 返回数据类型异常')
                return
            }

            var cid = data.data[0].cid
            //console.log(typeof (cid))

            console.log('获取到以下视频数据: aid=' + aid + ', bvid=' + bvid + ', cid=' + cid)
            aid && bvid && cid ? resolve([aid, bvid, cid]) : reject('aid/bvid/cid数据异常')
        })

    })
}

//获取access_key
function getAccessKey(resolve, reject) {
    fetch(urlList.getAccess_key, {
        credentials: 'include',
    }).then(function (res) {
        return res.headers.get('Content-Type').search('application/json') != -1 ? res.json() : undefined
    }).then(function (data) {
        //console.log(data)
        if (!data || !data.data || !data.data.confirm_uri) {
            reject('fetch(urlList.getAccess_key) 返回数据异常')
            return
        }

        console.log('请右键以下链接，点击"在新标签页中打开"，然后复制查询字符串中的access_key字段，粘贴到对话框中')
        console.log(data.data.confirm_uri)

        if (prompt('请打开浏览器控制台，右键最下方的链接，点击"在新标签页中打开"，然后复制查询字符串中的access_key字段，粘贴到这里')) {
            document.cookie = 'access_key=' + access_key + '; max-age=15552000; domain=.bilibili.com'
            resolve()
        } else {
            reject('用户已取消操作。')
        }
    })
}

//这个...不用解释了吧
function shareVideo(videoProp) {
    var aid = videoProp[0], bvid = videoProp[1], cid = videoProp[2]

    //share_session_id生成方式和作用未知，欢迎补充！
    var body = 'access_key=' + access_key + '&appkey=1d8b6e7d45233436&build=6800300&c_locale=zh_CN&channel=bili&disable_rcmd=0&from_spmid=dt.dt.video.0&mobi_app=android&oid=' + aid + '&panel_type=1&platform=android&s_locale=zh_CN&share_channel=biliDynamic&share_id=main.ugc-video-detail.0.0.pv&share_origin=vinfo_share&share_session_id=' + '6609bb15-ac05-4118-8f12-cb' + currentTime + '&sid=' + cid + '&spm_id=main.ugc-video-detail.0.0&statistics=%7B%22appId%22%3A1%2C%22platform%22%3A3%2C%22version%22%3A%226.80.0%22%2C%22abtest%22%3A%22%22%7D&success=true&ts=' + currentTime + '&sign='
    body = body + md5(body + '560c52ccd288fed045859ed18bffd973')

    console.log('正在分享视频, aid=' + aid)

    fetch(urlList.shareVideo, {
        method: 'post',
        mode: 'cors',
        //referrer: "no-referrer",
        headers: {
            //'Buvid': 'XXAF685A25ED66209F45C4248C26054E197A8',
            //'Fp_local': '9ca222f943ae8680669b6cdf2da959e120220715131357006bc66326e8302881',
            //'Fp_remote': '9ca222f943ae8680669b6cdf2da959e1202207131056235c836389e254a11b4e',
            //'Session_id': '831ec2b1',//暂时不知道如何处理
            //'Env': 'prod',
            //'App-Key': 'android',
            //'User-Agent': 'Mozilla/5.0 BiliDroid/6.80.0 (bbcallen@gmail.com) os/android model/SM-G9730 mobi_app/android build/6800300 channel/bili innerVer/6800300 osVer/7.1.2 network/2',
            //'X-Bili-Trace-Id': '390743e355a59747842729ca1962d222:8427c9ca1962d222:0:0',//暂时不知道如何处理
            //'X-Bili-Aurora-Eid': 'UlYITlUAD1ID',
            //'X-Bili-Mid': mid,
            //'X-Bili-Aurora-Zone': '',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            //'Accept-Encoding': 'gzip',
        },
        body: body,
    }).then(function (res) {
        return res.headers.get('Content-Type').search('application/json') != -1 ? res.json() : undefined
    }).then(function (data) {
        //console.log(data)
        if (!data) {
            console.log('fetch(urlList.shareVideo) 返回数据异常')
            return
        }

        //每天第一次分享，返回的toast不为空，之后的分享toast为空
        console.log(data.data.toast ? data.data.toast : '分享视频任务成功完成')
        document.cookie = 'shareVideoDone=true; expires=' + date.toGMTString()
    })
}


//观看视频
function watchVideo(videoProp) {
    var aid = videoProp[0], bvid = videoProp[1], cid = videoProp[2]
    console.log('正在观看视频, aid=' + aid + ', bvid=' + bvid + ', cid=' + cid)
    fetch(urlList.watchVideo, {
        method: 'post',
        credentials: 'include',
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:
            'aid=' + aid + '&cid=' + cid + '&bvid=' + bvid + '&mid=' + mid + '&csrf=' + csrftoken + '&played_time=11&real_played_time=12&realtime=11&start_ts=' + currentTime + '&type=3&dt=2&play_type=2&from_spmid=444.41.list.card_archive.click&spmid=333.788.0.0&auto_continued_play=0&refer_url=https%3A%2F%2Ft.bilibili.com%2F%3Ftab%3Dvideo&bsource='
    }).then(function (res) {
        return res.headers.get('Content-Type').search('application/json') != -1 ? res.json() : undefined
    }).then(function (data) {
        //console.log(data)
        if (!data) {
            console.log('fetch(urlList.watchVideo) 返回数据异常')
            return
        }

        //正常情况返回string'0'，否则返回具体信息
        console.log(data.message == '0' ? '观看视频任务成功完成' : data.message)
        document.cookie = 'watchVideoDone=true; expires=' + date.toGMTString()
    })
}
// ==UserScript==
// @name         云端课堂回放下载
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.3
// @description  云端课堂所有回放解析,一次性下载所有大班课回放
// @author       You
// @match        https://e62580258.at.baijiayun.com/web/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baijiayun.com
// @grant        none
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/axios/1.5.0/axios.min.js
// @require      https://unpkg.com/layui@2.9.7/dist/layui.js
// @require      https://cdn.bootcdn.net/ajax/libs/vue/2.7.9/vue.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/qs/6.11.2/qs.min.js
// @downloadURL https://update.greasyfork.org/scripts/470235/%E4%BA%91%E7%AB%AF%E8%AF%BE%E5%A0%82%E5%9B%9E%E6%94%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/470235/%E4%BA%91%E7%AB%AF%E8%AF%BE%E5%A0%82%E5%9B%9E%E6%94%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
var i = function (e, t) {
    var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var n = r.indexOf(e.charAt(t));
    if (-1 === n) throw "Cannot decode base64";
    return n
};
// 解密视频地址
var decryptVideo = function(e) {
    if ("" === e || 0 !== e.indexOf("bjcloudvod://"))
        return "";
    var t = (e = e.slice("bjcloudvod://".length, e.length).replace(/-/g, "+").replace(/_/g, "/")).length % 4;
    2 === t ? e += "==" : 3 === t && (e += "=");
    var n = (e = bb(e)).charCodeAt(0) % 8;
    e = e.slice(1, e.length);
    for (var i, a = [], s = 0; i = e[s]; s++) {
        var o = s % 4 * n + s % 3 + 1;
        a.push(String.fromCharCode(i.charCodeAt(0) - o))
    }
    return a.join("").replace("https:", "").replace("http:", "")
};
// 解密编码
var bb = function (e) {
    var t, n, r = 0,
        a = e.length,
        s = [];
    if (e = String(e), 0 === a) return e;
    if (a % 4 != 0) throw "Cannot decode base64";
    for ("=" === e.charAt(a - 1) && (r = 1, "=" === e.charAt(a - 2) && (r = 2), a -= 4), t = 0; t <
         a; t += 4) n = i(e, t) << 18 | i(e, t + 1) << 12 | i(e, t + 2) << 6 | i(e, t + 3), s.push(
        String.fromCharCode(n >> 16, n >> 8 & 255, 255 & n));
    switch (r) {
        case 1:
            n = i(e, t) << 18 | i(e, t + 1) << 12 | i(e, t + 2) << 6, s.push(String.fromCharCode(
                n >> 16, n >> 8 & 255));
            break;
        case 2:
            n = i(e, t) << 18 | i(e, t + 1) << 12, s.push(String.fromCharCode(n >> 16))
    }
    return s.join("")
};

// 下载服务器的MP4文件
function downloadMp4(filePath,fileName){
  fetch(filePath).then(res => res.blob()).then(blob => {
    const a = document.createElement('a');
    a.style.display = 'none'
    // 使用获取到的blob对象创建的url
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    // 指定下载的文件名
    a.download = fileName;
    a.click();
    // 移除blob对象的url
    window.URL.revokeObjectURL(url);
  });
}
// 创建一个vue对象，用于保存一些数据
var vueApp = new Vue({
    el: '#vueApp',
    data: {
        // 科目数量
        kemuCountList:[],
        // 科目信息
        kemuInfoList: [],
        // 科目里的课程信息,根据title区分
        kechengInfoMap:{},
        // 最终结果,根据科目分组视频地址
        resultList:{}
    }
});
top.vueApp = vueApp;
(function() {
    console.log("云端课堂脚本3.0开始===========================");
    // 引入第三方CSS,使用文档参考
    var link = document.createElement('link');
    link.id='layuiCss';
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/layui@2.9.7/dist/css/layui.css'; // 替换为你要引入的CSS文件的URL
    document.head.appendChild(link);

    async function 获取大班科目信息(){
        var config = {
            method: 'post',
            url: '/org/class_playback/getLongTermRoomList?page=1&page_size=60'
        };
        await axios(config).then(function (response) {
            vueApp.kemuInfoList = response.data?.data?.list||[];
            console.log('1. 获取大班科目信息')
            // 遍历所有大班课信息
            for(var i=0;i<vueApp.kemuInfoList.length;i++){
                console.log(`2.遍历大班科目信息，获取课程---------------当前进度${i+1}/${vueApp.kemuInfoList.length}`);
                var kemuInfo = vueApp.kemuInfoList[i];
                某科目回放(kemuInfo.playback_count,kemuInfo.room_id,kemuInfo.title)
            }
            console.log('2.课程获取完毕')
        }).catch(function (error) {
            console.log(error);
        });
    }
    /**
    * pageSize 页大小
    * roomId 教室id
    */
    async function 某科目回放(pageSize,roomId,title){
        var config = {
            method: 'post',
            url: '/org/class_playback/getLongTermList',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data : {
                'page': 1,
                'page_size': pageSize,
                'room_id': roomId
            }
        };
        await axios(config).then(function (response) {
            vueApp.kechengInfoMap[title] = response.data?.data?.list||[];
        }).catch(function (error) {
            console.log(error);
        });
    }
    function 获取视频地址(title,room_id,player_token,session_id,jindu){
        if(!room_id){
            return false;
        }
        var config = {
            method: 'get',
            url: `/web/playback/getPlayInfo?room_id=${room_id}&token=${player_token}&session_id=${session_id}&user_name=default&user_number=0&use_encrypt=1&render=jsonp&skip_encrypt=0`,
        };
        axios(config).then(function (response) {
            vueApp.resultList[title] = vueApp.resultList[title] || [];
            var responseBody = response.data;
            // 都获取到链接了还等啥，直接下载吧
            // 默认获取画质最高的
            var play_info = responseBody.data['play_info'];
            console.log(play_info);
            var videoUrl = play_info['superHD'] || play_info['high'] || play_info['720p'] || play_info['low'];
            videoUrl = videoUrl.cdn_list[0].enc_url;
            console.log(videoUrl);
            videoUrl = "http:" + decryptVideo(videoUrl);
            // 视频名称
            var fileName = `${responseBody.data.video_info.title}.${responseBody.data.format}`;
            vueApp.resultList[title].push({"fileName":fileName,"videoUrl":videoUrl});
            console.log(`进度：${jindu} 开始收集视频-视频名称${fileName},视频地址解析后${videoUrl}`);
        }).catch(function (error) {
            console.log(error);
        });
    }
    // 初始化方法
    function initFunction() {
        console.log('页面加载完成，开始执行脚本');
        // 1.添加我的菜单到左侧菜单树
        var myMenu = `<div class="bjy-tab-item" id="myMenu" onclick="downloadAllFile()"><i class="bjy-icon bjy-video"></i>专迪下载</div>`;
        $(".bjy-tab").append(myMenu);
        console.log("1.添加我的菜单到左侧菜单树");
        获取大班科目信息();
        console.log('某科目回放 收集完毕')
        console.log(vueApp.kechengInfoMap);
        // 我认为10s后，所有的科目都收集齐了，这时候就该下载了，不要轻易刷新该网页
        layer.msg("倒计时10s，后再点击【下载】");
        let countdown = 10;
        const timerId = setInterval(() => {
            console.log(countdown);
            countdown--;
            if (countdown === 0) {
                clearInterval(timerId);
                console.log('Countdown finished!');
                return false;
            }
            layer.msg(countdown);
        }, 1000);
        setTimeout(function(){
            console.log(`3.获取视频地址`);
            for(var title in vueApp.kechengInfoMap){
                // 获取视频地址
                var kechengInfoList = vueApp.kechengInfoMap[title];
                for(var i=0;i<kechengInfoList.length;i++){
                    获取视频地址(title,kechengInfoList[i].room_id,kechengInfoList[i].player_token,kechengInfoList[i].session_id,`${i+1}/${kechengInfoList.length}`);
                }
            }
        },10*1000)
    }

    window.addEventListener('load', initFunction);

    // 下载所有文件
    top.window['downloadAllFile'] = function(){
        // 开始校验数据是否已完全被下载
        var allFileUrlFlag = true;
        for(var title in vueApp.kechengInfoMap){
            // 获取视频地址
            if(vueApp.kechengInfoMap[title].length!=vueApp.resultList[title].length){
                allFileUrlFlag = false;
                break
            }
        }
        if(!allFileUrlFlag){
            layer.msg("数据还没收集完毕，稍等下再来试试吧");
            return false;
        }
        layer.msg("准备开始下载，坐稳了，要出发了");
        for(var title in vueApp.resultList){
            // 获取视频地址
            for(var i=0;i<vueApp.resultList[title].length;i++){
                var videoInfo = vueApp.resultList[title][i];
                console.log(`下载视频-title:${title},进度：${i+1}/${vueApp.resultList[title].length}`)
                downloadMp4(videoInfo.videoUrl,videoInfo.fileName);
            }
        }
    }
})();
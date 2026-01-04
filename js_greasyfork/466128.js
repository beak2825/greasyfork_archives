// ==UserScript==
// @name         NOC自动播放视频
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  视频自动播放，不用一直观察是不是被系统暂停了。
// @author       张瓜皮
// @match        http://ccp.noc.net.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=noc.net.cn
// @license      End-User License Agreement
// @downloadURL https://update.greasyfork.org/scripts/466128/NOC%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/466128/NOC%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    // 创建一个日志框
    var logdiv = document.createElement('div');
    logdiv.id = 'logdiv';
    logdiv.style.position = 'fixed';
    logdiv.style.backgroundColor = '#FFC8C8';
    logdiv.style.width = '500px';
    logdiv.style.height = '100px';
    logdiv.style.left = '20px';
    logdiv.style.bottom = '20px';
    logdiv.style.overflowY = 'scroll';
    document.body.appendChild(logdiv);

    //暂停了几次
    var num = 0;
    // 获取播放按钮
    var btn = document.getElementById('btnPlay')
    // 获取视频
    var v = document.querySelector('video');

    try {
        // 侦测视频播放状态
        v.addEventListener('ended', function () {
            setLog("播放结束");
            var li = document.getElementsByClassName('videoLi');
            for (let index = 0; index < li.length; index++) {
                if (li[index].querySelector("a > div > div:nth-child(2) > div > div").style.width !== '100%') {
                    li[index].getElementsByTagName('a')[0].click();
                    setLog("开始播放第" + (index + 1) + "个视频");
                    break;
                }
            }
        }, false);
        // 侦测视频暂停了几次
        v.addEventListener('pause', function () {
            setLog("视频暂停了");
            btn.click()
        });
        //获取视频的总长度
        v.addEventListener('loadedmetadata', function () {
            setLog("当前视频的长度为：" + v.duration + "秒");
            setLog("等待1秒后自动播放");
            setTimeout(() => {
                btn.click();
                setLog("开始播放");
            }, 1000);
        });
    }
    catch (e) {
        setLog("当前页面暂无视频");
    }
})();

function setLog(info) {
    let span = document.createElement('span');
    span.innerHTML = getDate() + " - " + info;
    logdiv.appendChild(span);
    let br = document.createElement('br');
    logdiv.appendChild(br);
}

function getDate() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var date = myDate.getDate();
    var h = myDate.getHours();
    var m = myDate.getMinutes();
    var s = myDate.getSeconds();
    var now = year + '年' + month + "月" + date + "日" + h + ':' + m + ":" + s;
    return now;
}
// ==UserScript==
// @name        总局学习辅助工具
// @namespace   a18zhziao
// @match       https://www.samrela.com/portal/play.do
// @grant       none
// @version     1.0
// @author      ccms
// @description 2020/12/3 上午11:01:15
// @license MIT
// @grant       GM_notification
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/486540/%E6%80%BB%E5%B1%80%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/486540/%E6%80%BB%E5%B1%80%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Notification.requestPermission()
    var jbData = {
        kechengList: [12468944,12468945,12468936,12468935,12468933,12468934,12468932],
        nowPlay: 11334036
    }

    function Showlog() {
        var iframe = document.createElement('iframe')
        document.body.appendChild(iframe)
        window.console = iframe.contentWindow.console
    }

    function Initdata() {
        if (!GM_getValue("_jbdata")) {
            GM_setValue("_jbdata", jbData)
        }
    }

    function Notice(str) {
        new Notification('通知消息', {
            body: str
        })
    }

    //浏览器通知
    function GM_notice(text, title, callback) {
        if (!GM_notification) return;
        GM_notification({
            text: text,
            title: title || "",
            image: "",
            onclick: function () {
                if (callback) callback();
            }
        });
    };

    function Setdata(jbData) {
        localStorage.setItem("jbdata", jbData)
    }

    function Getdata() {
        return localStorage.getItem("jbdata")
    }

    function Opentab(id) {
        open("/portal/play.do?id=" + id, "player")
    }

    function Startlean() {
        $("#mask").remove()
        $(".continue").remove()
        player.continuePlay()
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }

    function TempClick() {
        //获取当前章节的播放信息
        var nowTime = $.getNowDate();
        var playIndex = curr - 1;
        if (playIndex <= 0) {
            playIndex = 0;
        }
        var playObj = {
            "sco_id": videoIndex[playIndex].ref,
            "lesson_location": player.getPosition(),
            "session_time": player.player_time,
            "last_learn_time": nowTime
        };
        getLearnScoInfo(playObj);
        player.player_time = 0;

        //flowplayer
        if ($('video').length <= 0) {
            getVideo(i);
            player.init(i);
        } else {
            player.play(i);
        }

        player.setPosition(0);
        player.otherClips = false;
    }

    function Addbut() {
        var button = document.createElement("button"); //创建一个input对象（提示框按钮）
        // button.id = "id001";
        button.textContent = "添加课程";
        button.style.width = "100px";
        button.style.height = "40px";
        button.style.align = "center";
        //绑定按键点击功能
        button.onclick = function (){
            console.log('点击了按键');
            //为所欲为 功能实现处
            alert("你好");
            return;
        };

        var x = document.getElementsByClassName('rt btn_group')[0];
        //在浏览器控制台可以查看所有函数，ctrl+shift+I 调出控制台，在Console窗口进行实验测试
        x.appendChild(button);

        //var y = document.getElementById('s_btn_wr');
        //y.appendChild(button);
    }
    function Liucheng(stata) {
        var now = new Date().toLocaleTimeString() //获取当前时间
        switch (stata) {
            case -1:
                log("-1")
                // debugger
                Startlean()
                log(now + "开启播放！【" + getQueryVariable("id") + "】的第" + curr + "章")
                GM_notice(now + "开启播放！", "通知消息")
                break
            case 4:
                //停止播放
                var tmpJbdata = GM_getValue("_jbdata") || jbData
                if (tmpJbdata.kechengList.length == 0) {
                    log(now + "全部课程播放完毕！")
                    GM_notice("全部课程播放完毕！", "通知消息")
                    debugger
                    clearInterval(fuc)
                } else {
                    log(now + "此课程播放完毕！")
                    GM_notice("此课程播放完毕！", "通知消息")
                    var tmpId = tmpJbdata.kechengList.shift()
                    tmpJbdata.nowPlay = tmpId
                    GM_setValue("_jbdata", tmpJbdata)
                    Opentab(tmpId)
                }
                break
            case 3:
                //正常播放
                if (videoIndex.length > 1) {
                    player.setPosition(0)
                }
                log(now + "正常播放【" + getQueryVariable("id") + "】的第" + curr + "章中的"+ player.getPosition())
                break
            default:
                log(now + "未知状态码" + stata)
        }
    }

    Showlog()
    // Initdata()
    const log = console.log.bind(window.console, '状态:')
    var fuc = setInterval(function () {
            Liucheng(player.getState())
        },
        5000)
})();
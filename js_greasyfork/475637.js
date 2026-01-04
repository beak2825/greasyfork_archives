// ==UserScript==
// @name         可可英语听写 flash 播放器替换
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可可英语听写 flash 播放器替换，还原了原有的快捷键方式。
// @author       xp
// @match        http://ting.kekenet.com/tx/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475637/%E5%8F%AF%E5%8F%AF%E8%8B%B1%E8%AF%AD%E5%90%AC%E5%86%99%20flash%20%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/475637/%E5%8F%AF%E5%8F%AF%E8%8B%B1%E8%AF%AD%E5%90%AC%E5%86%99%20flash%20%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/jplayer/2.9.2/add-on/jquery.jplayer.inspector.min.js";
document.documentElement.appendChild(script);
let script1 = document.createElement('script');
script1.setAttribute('type', 'text/javascript');
script1.src = "https://cdn.bootcdn.net/ajax/libs/jplayer/2.9.2/jplayer/jquery.jplayer.min.js";
document.documentElement.appendChild(script1);
(function() {

    var newHTML = `
        <div id="jPlayer"></div>
        <div id="jp_container">
          <button id="jp_previous">上一句</button>
          <button id="play-btn">播放/暂停</button>
          <button id="jp_next">下一句</button>
          <button id="jp_repeat">重复此句</button>
        </div>
      `;
     // 词汇数据
        var words = [];
        var INDEX = 0;
    $(function(){
        var playerEle = document.querySelector("#player");
        console.log('playerEle',playerEle)
        playerEle.insertAdjacentHTML("afterend", newHTML);
        // 匹配mp3链接
        var mp3Url = playerEle.innerHTML.match(/_file=([^&]*\.mp3)/)[1];
        // 匹配lrc链接
        var lrcUrl = playerEle.innerHTML.match(/_enlrc=([^"]*)\.lrc/)[1] + '.lrc';
        console.log('mp3Url',mp3Url)
        console.log('lrcUrl',lrcUrl)


        function loadWords() {
            $.get(
                lrcUrl,
                function (res) {
                    // 解析词汇文件,添加到 words 中
                    var lines = res.split("\n");
                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i];
                        var match = line.match(/\[(\d+):(\d+)\.(\d+)\](.*)/);
                        if (match) {
                            var time =
                                parseInt(match[1]) * 60 +
                                parseInt(match[2]) +
                                parseInt(match[3]) / 100;
                            var text = match[4];
                            words.push({ time: time, text: text });
                        }
                    }
                    console.log(words);
                }
            );
        }
        loadWords();


        var myPlayer = $("#jPlayer").jPlayer({
            ready: function (event) {
                $(this).jPlayer("setMedia", {
                    title: "C267.mp3",
                    mp3: mp3Url,
                });
            },
            swfPath: "http://www.jplayer.org/latest/dist/jplayer",
            supplied: "mp3",
            wmode: "window",
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true,
        });
        console.log("myPlayer", myPlayer);
        $("#play-btn").on("click", function () {
            console.log(myPlayer)
            if (myPlayer.data().jPlayer.status.paused) {
                myPlayer.jPlayer("play"); // 播放
            } else {
                myPlayer.jPlayer("pause"); // 暂停
            }
        });
        // 上一句
        $("#jp_previous").on("click", function () {
            var currentTime = myPlayer.data().jPlayer.status.currentTime;
            var currentIndex = findLyricIndexByTime(currentTime);
            if (currentIndex === 0) {
                alert("已经是第一句了");
                return;
            }
            var prevTime = words[currentIndex - 1].time;

            myPlayer.jPlayer("play", prevTime);
        });
        // 下一句
        $("#jp_next").on("click", function () {
            var currentTime = myPlayer.data().jPlayer.status.currentTime;
            console.log("currentTime", currentTime);
            var currentIndex = findLyricIndexByTime(currentTime);
            if (currentIndex === words.length) {
                alert("已经是最后一句了");
                return;
            }
            var nextTime = words[currentIndex + 1].time;
            myPlayer.jPlayer("play", nextTime);
        });
        // 重复此句
        $("#jp_repeat").on("click", function () {
            var currentTime = myPlayer.data().jPlayer.status.currentTime;
            var currentIndex = findLyricIndexByTime(currentTime);

            var repeatTime = words[currentIndex].time;
            myPlayer.jPlayer("play", repeatTime);
        });
    });
    // 根据时间找歌词索引
    function findLyricIndexByTime(time) {
        // 实现索引查找逻辑
        var index = 0;
        for (var i = 0; i < words.length; i++) {
            var lyric = words[i];
            if (time >= lyric.time) {
                index = i;
            }
        }
        return index;
    }
    // 其他代码
})();
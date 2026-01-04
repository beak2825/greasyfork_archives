// ==UserScript==
// @name          可可英语听写 flash 播放器替换
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  可可英语听写 flash 播放器替换，还原了原有的快捷键方式。
// @author       hxp
// @match        http://ting.kekenet.com/tx/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475902/%E5%8F%AF%E5%8F%AF%E8%8B%B1%E8%AF%AD%E5%90%AC%E5%86%99%20flash%20%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/475902/%E5%8F%AF%E5%8F%AF%E8%8B%B1%E8%AF%AD%E5%90%AC%E5%86%99%20flash%20%E6%92%AD%E6%94%BE%E5%99%A8%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==
(function() {
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/jplayer/2.9.2/add-on/jquery.jplayer.inspector.min.js";
document.documentElement.appendChild(script);
let script1 = document.createElement('script');
script1.setAttribute('type', 'text/javascript');
script1.src = "https://cdn.bootcdn.net/ajax/libs/jplayer/2.9.2/jplayer/jquery.jplayer.min.js";
document.documentElement.appendChild(script1);
let style = document.createElement('link');
style.setAttribute('rel', 'stylesheet');
style.setAttribute('type', 'text/css');
style.href = "https://cdn.bootcdn.net/ajax/libs/jplayer/2.9.2/skin/pink.flag/css/jplayer.pink.flag.min.css";
document.documentElement.appendChild(style);



    $(function(){
    var newHTML = `
        <div id="jPlayer"></div>
        <div id="jp_container">
         <div
            id="jp_container_1"
            class="jp-audio"
            role="application"
            aria-label="media player"
          >
            <div class="jp-type-single">
              <div class="jp-gui jp-interface">
                <div class="jp-volume-controls">
                  <button class="jp-mute" role="button" tabindex="0">
                    mute
                  </button>
                  <button class="jp-volume-max" role="button" tabindex="0">
                    max volume
                  </button>
                  <div class="jp-volume-bar">
                    <div class="jp-volume-bar-value"></div>
                  </div>
                </div>
                <div class="jp-controls-holder">
                  <div class="jp-controls">
                    <button class="jp-play" role="button" tabindex="0">
                      play
                    </button>
                    <button class="jp-stop" role="button" tabindex="0">
                      stop
                    </button>
                  </div>
                  <div class="jp-progress">
                    <div class="jp-seek-bar">
                      <div class="jp-play-bar"></div>
                    </div>
                  </div>
                  <div class="jp-current-time" role="timer" aria-label="time">
                    &nbsp;
                  </div>
                  <div class="jp-duration" role="timer" aria-label="duration">
                    &nbsp;
                  </div>

                </div>
              </div>
              <div class="jp-details">
                <div class="jp-title" aria-label="title">&nbsp;</div>
              </div>
              <div class="jp-no-solution">
                <span>Update Required</span>
                To play the media you will need to either update your browser to
                a recent version or update your
                <a href="http://get.adobe.com/flashplayer/" target="_blank"
                  >Flash plugin</a
                >.
              </div>
            </div>
          </div>
          <a id="jp_previous">上一句  <font color="red">ctrl +《</font></a>
          <a id="play-btn">播放/暂停 <font color="red">F8</font></a>
          <a id="jp_next">下一句  <font color="red">ctrl + 》</font></a>
          <a id="jp_repeat">重复此句  <font color="red">F9</font></a>
        </div>
      `;
    // 词汇数据
    var words = [];


        document.getElementById("player").style.display = "none";
        document.querySelector(".dic_tool").style.display = "none";
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
         var myPlayer = null
        setTimeout(()=>{
             myPlayer = $("#jPlayer").jPlayer({
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
            cssSelectorAncestor: "#jp_container_1",
            cssSelector: {
                videoPlay: ".jp-video-play",
                play: ".jp-play",
                pause: ".jp-pause",
                stop: ".jp-stop",
                seekBar: ".jp-seek-bar",
                playBar: ".jp-play-bar",
                mute: ".jp-mute",
                unmute: ".jp-unmute",
                volumeBar: ".jp-volume-bar",
                volumeBarValue: ".jp-volume-bar-value",
                volumeMax: ".jp-volume-max",
                playbackRateBar: ".jp-playback-rate-bar",
                playbackRateBarValue: ".jp-playback-rate-bar-value",
                currentTime: ".jp-current-time",
                duration: ".jp-duration",
                title: ".jp-title",
                fullScreen: ".jp-full-screen",
                restoreScreen: ".jp-restore-screen",
                repeat: ".jp-repeat",
                repeatOff: ".jp-repeat-off",
                gui: ".jp-gui",
                noSolution: ".jp-no-solution",
            },
        });
        },1000)
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

         // 其他代码
        document.addEventListener("keydown", (e) => {
            if (e.key === "F9") {
                var currentTime = myPlayer.data().jPlayer.status.currentTime;
                var currentIndex = findLyricIndexByTime(currentTime);
                var repeatTime = words[currentIndex].time;
                myPlayer.jPlayer("play", repeatTime);
            }
            if (e.key === "F8") {

                if (myPlayer.data().jPlayer.status.paused) {
                    myPlayer.jPlayer("play"); // 播放
                } else {
                    myPlayer.jPlayer("pause"); // 暂停
                }
            }
        });

        document.addEventListener("keydown", (e) => {
             var currentTime = myPlayer.data().jPlayer.status.currentTime;
             var currentIndex = findLyricIndexByTime(currentTime);
            if ( e.key === ".") {
                // 执行ALT+X相关逻辑
                if (currentIndex === words.length) {
                    alert("已经是最后一句了");
                    return;
                }
                var nextTime = words[currentIndex + 1].time;
                myPlayer.jPlayer("play", nextTime);
            }
            if ( e.key === ",") {
                if (currentIndex === 0) {
                    alert("已经是第一句了");
                    return;
                }
                var prevTime = words[currentIndex - 1].time;
                myPlayer.jPlayer("play", prevTime);
            }
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

});
})();
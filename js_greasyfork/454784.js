// ==UserScript==
// @name         B站笔记快捷键←↓→
// @namespace    https://space.bilibili.com/1208812226
// @version      2.12.1
// @description  在B站笔记中：打开笔记快捷键：Ctrl+Shift+↑，关闭笔记快捷键：Ctrl+Shift+↓，笔记窗口切换到视频窗口：Ctrl+Shift+←，视频窗口切换到笔记窗口：Ctrl+Shift+→，截图+时间戳快捷键：Ctrl+↓，时间戳+截图快捷键：Ctrl+↑，时间戳快捷键：Ctrl+←，截图快捷键：Ctrl+→，下载视频笔记Ctrl+Shift+S，将字幕装载进笔记Ctrl+Shift+V
// @author       大王鹅鹅鹅
// @match        http*://www.bilibili.com/video/*
// @match        https://www.bilibili.com/medialist/*
// @match        https://www.bilibili.com/list/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/454784/B%E7%AB%99%E7%AC%94%E8%AE%B0%E5%BF%AB%E6%8D%B7%E9%94%AE%E2%86%90%E2%86%93%E2%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/454784/B%E7%AB%99%E7%AC%94%E8%AE%B0%E5%BF%AB%E6%8D%B7%E9%94%AE%E2%86%90%E2%86%93%E2%86%92.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // JS监听键盘快捷键事件
    document.addEventListener("keydown", function (event) {
        if (event.shiftKey && event.keyCode == 38) {//打开笔记——快捷键：Ctrl+Shift+↑
            if (event.ctrlKey) {
                document.querySelector(".video-note-info").click();
                setTimeout( function(){document.querySelector(".operation-desc").click();},0);
                var count = 2;
                var timeId = setInterval(function () {
                    count--;
                    if (count <= 0) {
                        clearInterval(timeId);
                    }
                    initFocusDown();
                    setTimeout( function(){editTime();},10);

                }, 600);

                //固定笔记
                var myresize = document.querySelector(".resizable-component");
                if(myresize){
                    myresize.style.position = 'fixed';
                  //  myresize.style.setProperty('position', 'fixed', 'important');
                }



            }
        }

        if (event.shiftKey && event.keyCode == 40) {//关闭笔记——快捷键：Ctrl+Shift+↓
            if (event.ctrlKey) {
                document.querySelector(".close-note").click();
            }
        }

        if (event.shiftKey && event.keyCode == 37) {//回到视频——快捷键：Ctrl+Shift+←
            if (event.ctrlKey) {
                var pNodel = document.querySelector(
                    "div.editor-innter.ql-container.ql-snow > div.ql-editor"
                );
               // pNodel.blur();
                event.preventDefault();

                let videos = document.getElementsByTagName('video');
                videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;

                let video = videos[0];
                if(toggle()){
                    video.pause();
                }else{
                    video.play();
                }

            }
        }
        if (event.shiftKey && event.keyCode == 39) {//回到笔记——快捷键：Ctrl+Shift+→
            if (event.ctrlKey) {
                initFocusDown();
            }
        }

        if (event.ctrlKey && event.keyCode == 37) {//时间戳——快捷键：Ctrl+←
            if (!event.shiftKey) {
                document.querySelector("i.bili-note-iconfont.iconicon_flag_L").click();
                setTimeout(function () {
                    document.querySelector("div.dialog-btn.tag-dialog__btn--confirm:nth-child(2)").click();
                    setTimeout( function(){editTime();},10);
                }, 0);

            }
        }


        if (event.ctrlKey && event.keyCode == 38) {//时间戳+截图——快捷键：Ctrl+↑
            if (!event.shiftKey) {
                imageAfterTime();


            }
        }

        if (event.ctrlKey && event.keyCode == 39) {//截图——快捷键：Ctrl+→
            if (!event.shiftKey) {
                document.querySelector("i.bili-note-iconfont.iconcapture-app").click();
                setTimeout(function () {
                    var parentNode = document.querySelector(
                        "div.editor-innter.ql-container.ql-snow > div.ql-editor"
                    );
                    var scrollHeight = parentNode.scrollHeight;
                    parentNode.scrollTo(0, scrollHeight);
                    parentNode.focus();
                }, 500);

            }
        }

        if (event.ctrlKey && event.keyCode == 40) {//截图+时间戳——快捷键：Ctrl+↓
            if (!event.shiftKey) {
                timeAfterImage();

            }
        }

        if (event.shiftKey && event.keyCode == 83) {//下载笔记为markdown格式——快捷键：Ctrl+Shift+S
            if (event.ctrlKey) {
                isLogSqe=false;
                openNote();
            }
        }

        if (event.altKey && event.keyCode == 83) {//下载笔记为markdown格式——快捷键：Ctrl+Alt+S
            if (event.ctrlKey) {
                isLogSqe=false;
                openNote();
            }
        }



        if (event.shiftKey && event.keyCode == 90) {//弹幕一键存入笔记——快捷键：Ctrl+Shift+Z
            if (event.ctrlKey) {
                getDanMu();
            }
        }


         if (event.altKey && event.keyCode == 90) {//纯弹幕一键存入笔记——快捷键：Ctrl+Alt+Z
            if (event.ctrlKey) {
                getOnlyDanMus();
            }
        }


        if (event.shiftKey && event.keyCode == 85) {//快捷键：Ctrl+Shift+U
            navigator.clipboard.readText().then(function(text) {
                alert('Clipboard text: ', text);
            }, function(err) {
                alert('Failed to read text from clipboard: ', err);
            });

        }


        if (event.shiftKey && event.keyCode == 86) {//字幕一键存入笔记——快捷键：Ctrl+Shift+V
            if (event.ctrlKey) {
                event.preventDefault();
                //下载所有弹幕
                //getDanMuDownload();

                //下载所有截图no
                // getPicDownload();

                //下载字幕
                getZiMu();




            }
        }

         if (event.altKey && event.keyCode == 86) {//纯字幕一键存入笔记——快捷键：Ctrl+Alt+V
            if (event.ctrlKey) {
                getOnlyZiMus();

            }
        }






        if (event.shiftKey && event.keyCode == 51) {//视频播放倍速——快捷键：Shift+3
            let videos = document.getElementsByTagName('video');
            videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
            let video = videos[0];
            if(video.playbackRate<4){
                video.playbackRate += 0.25;
            }
        }


        if (event.shiftKey && event.keyCode == 52) {//视频播放倍速——快捷键：Shift+4
            let videos = document.getElementsByTagName('video');
            videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
            let video = videos[0];
            if(video.playbackRate>0.25){
                video.playbackRate -= 0.25;
            }
        }

document.addEventListener("keydown", function (event) {
         if (event.altKey && event.keyCode == 75) {//弹出所有快捷键功能面板——快捷键：Ctrl+Alt+K
            if (event.ctrlKey) {
               document.querySelector("#shortCutInfo").style.display="";
            }
        }
});




        if (event.altKey && event.keyCode == 67) {//获取视频当前精确播放位置链接到剪贴板——快捷键：Alt+C
            copyCurrentURL2ClipBoard();
        }



         if (event.altKey && event.keyCode == 78) {//下载笔记为markdown格式——快捷键：Ctrl+Alt+N
            if (event.ctrlKey) {
                openNoteOnlyText();
            }
        }

        if (event.keyCode == 39) {//快进10秒——快捷键：shift+→
            if (event.shiftKey) {
                 if (!event.ctrlKey) {
                var videos = document.getElementsByTagName('video');
                videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
                var video = videos[0];
                video.currentTime = video.currentTime+10;
                video.play();
                 }
            }
        }

         if (event.keyCode == 37) {//后退10秒——快捷键：shift+←
            if (event.shiftKey) {
                  if (!event.ctrlKey) {
                var videos1 = document.getElementsByTagName('video');
                videos1 = videos1.length==0 ? document.getElementsByTagName('bwp-video'):videos1;
                var video1 = videos1[0];
                video1.currentTime = video1.currentTime-10;
                video1.play();
                  }
            }
        }

        if (event.keyCode == 84) {//下载封面——快捷键：Alt+T
            if (event.altKey) {
                let bvid = state.videoData.bvid;
                let title = state.videoData.title;
                let img_url = 'https://api.bilibili.com/x/web-interface/view?bvid='+bvid;
                downloadOnlyImages(img_url,title);
            }
        }

         if (event.keyCode == 86) {//下载视频——快捷键：Alt+V
            if (event.altKey && !event.ctrlKey) {
               downloadVideo();
            }
        }





        if (event.keyCode == 67) {//下载音频——快捷键：Alt+C
            if (event.altKey) {
              downloadAudio();
            }
        }
    });


    document.addEventListener("copy", function (e) {
        var copyNode = e.target;
        if(copyNode.parentNode.classList.contains("bpx-player-container")){
            var ql_editor = document.querySelector(".ql-editor")? document.querySelector(".ql-editor"): null;
            if(ql_editor){
                ql_editor.append(copyNode.value);

                toEnd(ql_editor);

                }else{
                alert("请先打开视频笔记，快捷键：Ctrl+Shift+↑");
            }

        }
   });




  })();

function downloadAudio(){
    var audio = window.__playinfo__.data.dash.audio;
    var audioURL = audio[1].baseUrl;
    downloadOnlyAudio(audioURL);
}


async function downloadOnlyAudio(src) {
    let a = document.createElement('a');
    a.setAttribute("href", src);
  //  a.setAttribute("target", "_blank");
    a.setAttribute("download", "bilibili_video.mp3")
    a.click();
}

function downloadVideo(){
    let state = window.__INITIAL_STATE__;
    let p = state.p || 1;
    let cid = state.videoData.pages[p - 1].cid;
    let aid = state.videoData.aid;
    let bvid = state.videoData.bvid;

    //let url = `https://api.bilibili.com/x/player/playurl?avid=${aid}&cid=${cid}&otype=json&fourk=1&qn=16`;
    let url = `https://api.bilibili.com/x/player/playurl?avid=${aid}&bvid=${bvid}&cid=${cid}&qn=80&fnver=0&fnval=0&fourk=1&ep_id=&type=mp4&otype=json&platform=html5&high_quality=1`;
    downloadOnlyVideo(url);
}

async function downloadOnlyVideo(src) {
    let res = await fetch(src);
    let data = await res.json();

    if (!data.data){
      alert("无法下载");
    }

    let videoUrl = data.data.durl[0].url;

   let a = document.createElement('a');
    a.setAttribute("href", videoUrl);
    a.setAttribute("target", "_blank");
    a.setAttribute("download", "bilibili_video.mp4")
    a.click();
}

async function downloadOnlyImages(src,title) {
    let res = await fetch(src);
    let data = await res.json();
    if(data && data.code == 0) {
        let url = data.data.pic.replace('http://','https://');
        let response = await fetch(url);
        let blob = await response.blob();
        let imgUrl = window.URL.createObjectURL(blob)
        let a = document.createElement('a');

        a.download = title+'.jpg';
        a.href = imgUrl;
       // document.body.appendChild(a);
       // a.click();
       // document.body.removeChild(a);
        // 模拟点击下载链接
            const clickEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });

            // 触发下载
            a.dispatchEvent(clickEvent);

            // 下载完成后释放 URL
            setTimeout(() => {
                URL.revokeObjectURL(a);
            }, 1000);
    }
}

function getZiMu() {
        let p = state.p || 1;
        let cid = state.videoData.pages[p - 1].cid;
        let aid = state.videoData.aid;
        let bvid = state.videoData.bvid;
        let src="https://api.bilibili.com/x/v2/dm/view?oid="+cid+"&aid="+aid+"&bvid="+bvid+"&type=1"
        return fetch(src, {
            method: "get",
            dataType: "text/xml",
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            if(result.data.subtitle.subtitles!=null){
                let subtitle_url= result.data.subtitle.subtitles[0].subtitle_url.replace(/https?:\/\//,'//');
                getRealZiMU(subtitle_url);
            }else{
                alert("本视频暂未字幕！");
            }
        });
    }

function getOnlyZiMus() {
        let p = state.p || 1;
        let cid = state.videoData.pages[p - 1].cid;
        let aid = state.videoData.aid;
        let bvid = state.videoData.bvid;
        let src="https://api.bilibili.com/x/v2/dm/view?oid="+cid+"&aid="+aid+"&bvid="+bvid+"&type=1"
        return fetch(src, {
            method: "get",
            dataType: "text/xml",
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            if(result.data.subtitle.subtitles!=null){
                let subtitle_url= result.data.subtitle.subtitles[0].subtitle_url.replace(/https?:\/\//,'//');
                getOnlyRealZiMU(subtitle_url);
            }else{
                alert("本视频暂未字幕！");
            }
        });
    }

  function getZiMu_time() {
        let p = state.p || 1;
        let cid = state.videoData.pages[p - 1].cid;
        let aid = state.videoData.aid;
        let bvid = state.videoData.bvid;
        let src="https://api.bilibili.com/x/v2/dm/view?oid="+cid+"&aid="+aid+"&bvid="+bvid+"&type=1"
        return fetch(src, {
            method: "get",
            dataType: "text/xml",
            credentials: 'include',
        }).then(function (response) {
            return response.json();
        }).then(function (result) {
            if(result.data.subtitle.subtitles!=null){
                let subtitle_url= result.data.subtitle.subtitles[0].subtitle_url.replace(/https?:\/\//,'//');
                getRealZiMU_time(subtitle_url);
            }else{
                alert("本视频暂未字幕！");
            }
        });
    }



    async function getRealZiMU(subtitle_url){
        if(!subtitle_url) throw('找不到字幕');

        return fetch("https:"+subtitle_url, {
            method: "get",
            dataType: "text/html",
            // credentials: 'include',
        }).then(function (response) {

            return response.json();
        }).then(function (result) {
            // 获取视频播放器和字幕元素
            var videos = document.getElementsByTagName('video');
            videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
            var video = videos[0];
            const subtitles = result.body;
            var p = state.p || 1;
            var cid = state.videoData.pages[p - 1].cid;
            var title = state.videoData.title;

            var ql_editor = document.querySelector(".ql-editor")? document.querySelector(".ql-editor"): null;
            if(ql_editor){
                for (var i = 0; i < subtitles.length; i++) {
                    let subtitle = subtitles[i];
                    let pnew = document.createElement('p');
                    pnew.setAttribute("id", "zimu"+subtitle.sid);
                    let dataSeconds=subtitle.from;
                    pnew.append(getZiMuTimeStamp(dataSeconds,subtitle.content,cid,p,title));

                    pnew.addEventListener('click',function(e) {
                        video.currentTime = dataSeconds;
                        video.play();
                        setTimeout(function () {
                            document.querySelector(".iconcapture-app").click();
                        }, 770);

                   });
                    ql_editor.append(pnew);

                }

                ql_editor.scrollTo(0,0);
                ql_editor.focus();

                let currentSubtitle1 = null;
                let sctoll=0;
                video.addEventListener("timeupdate", () => {
                    let currentTime = video.currentTime;

                    var nextSubtitle = subtitles.find(subtitle => {
                        return currentTime >= subtitle.from && currentTime < subtitle.to;
                    });

                    if (nextSubtitle && nextSubtitle !== currentSubtitle1) {
                        if (currentSubtitle1) {
                            document.getElementById("zimu"+currentSubtitle1.sid).querySelector(".time-tag-item").style.backgroundColor = "#f6f7f8";
                        }
                        currentSubtitle1 = nextSubtitle;

                        let zimu=document.getElementById("zimu"+currentSubtitle1.sid);
                        zimu.querySelector(".time-tag-item").style.backgroundColor = "yellow";
                        ql_editor.scrollTo(0,zimu.offsetTop-100);

                        ql_editor.focus();
                    }else if (!nextSubtitle && currentSubtitle1){
                        document.getElementById("zimu"+currentSubtitle1.sid).querySelector(".time-tag-item").style.backgroundColor = "#f6f7f8";
                        currentSubtitle1 = null;
                    }
                });

            }else{
                alert("请先打开视频笔记，快捷键：Ctrl+Shift+↑");
            }

        });

    }

 async function getRealZiMU_time(subtitle_url){
        if(!subtitle_url) throw('找不到字幕');

        return fetch("https:"+subtitle_url, {
            method: "get",
            dataType: "text/html",
            // credentials: 'include',
        }).then(function (response) {

            return response.json();
        }).then(function (result) {
            // 获取视频播放器和字幕元素
            var videos = document.getElementsByTagName('video');
            videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
            var video = videos[0];
            const subtitles = result.body;
            var ql_editor = document.querySelector(".ql-editor")? document.querySelector(".ql-editor"): null;
            if(ql_editor){
                for (var i = 0; i < subtitles.length; i++) {
                    let subtitle = subtitles[i];
                    let pnew = document.createElement('p');
                    pnew.setAttribute("id", "zimu"+subtitle.sid);
                    let dataSeconds=subtitle.from;
                    pnew.append(subtitle.content);

                    pnew.addEventListener('click',function(e) {
                        video.currentTime = dataSeconds;
                        //video.play();
                        video.pause();

                   });
                    ql_editor.append(pnew);

                }

                ql_editor.scrollTo(0,0);
                ql_editor.focus();

                let currentSubtitle1 = null;
                let sctoll=0;
                video.addEventListener("timeupdate", () => {
                    let currentTime = video.currentTime;

                    var nextSubtitle = subtitles.find(subtitle => {
                        return currentTime >= subtitle.from && currentTime < subtitle.to;
                    });

                    if (nextSubtitle && nextSubtitle !== currentSubtitle1) {
                        if (currentSubtitle1) {
                            document.getElementById("zimu"+currentSubtitle1.sid).style.color = "black";
                            document.getElementById("zimu"+currentSubtitle1.sid).style.fontSize = "17px";
                        }
                        currentSubtitle1 = nextSubtitle;

                        let zimu=document.getElementById("zimu"+currentSubtitle1.sid);
                        zimu.style.color = "red";
                        zimu.style.fontSize = "20px";
                        ql_editor.scrollTo(0,zimu.offsetTop-100);

                        ql_editor.focus();
                    }else if (!nextSubtitle && currentSubtitle1){
                        document.getElementById("zimu"+currentSubtitle1.sid).style.color = "black";
                        document.getElementById("zimu"+currentSubtitle1.sid).style.fontSize = "17px";
                        currentSubtitle1 = null;
                    }
                });

            }else{
                alert("请先打开视频笔记，快捷键：Ctrl+Shift+↑");
            }

        });

    }



    async function getOnlyRealZiMU(subtitle_url){
        if(!subtitle_url) throw('找不到字幕');

        return fetch("https:"+subtitle_url, {
            method: "get",
            dataType: "text/html",
            // credentials: 'include',
        }).then(function (response) {

            return response.json();
        }).then(function (result) {
            const subtitles = result.body;
            var ql_editor = document.querySelector(".ql-editor")? document.querySelector(".ql-editor"): null;
            if(ql_editor){
                var zimuText="";
                for (var i = 0; i < subtitles.length; i++) {
                    let subtitle = subtitles[i];
                    zimuText+=subtitle.content+"\n";
                }
                ql_editor.append(zimuText);
                ql_editor.scrollTo(0,0);
                ql_editor.focus();

              }else{
                alert("请先打开视频笔记，快捷键：Ctrl+Shift+↑");
            }

        });

    }

function getZiMuTimeStamp(time,text,cid,p,title){
        let div1 = document.createElement('p');
        div1.setAttribute("class", "ql-tag-blot");
        div1.setAttribute("data-oid_type", "0");
        div1.setAttribute("data-cid", cid);
        div1.setAttribute("data-epid", 0);
        div1.setAttribute("data-status", "0");
        div1.setAttribute("data-index", p);
        div1.setAttribute("data-seconds", time);
        div1.setAttribute("data-cid-count", "1");
        div1.setAttribute("data-key", new Date().getTime());
        div1.setAttribute("data-title", title);
        div1.setAttribute("data-desc", text);
        // let span2 = document.createElement('span');
        //  span2.setAttribute("contenteditable", "false");
        let div2 = document.createElement('div');
        div2.setAttribute("class", "time-tag-item");
        div2.setAttribute("contenteditable", "false");

        let i3 = document.createElement('i');
       // i3.setAttribute("class", "bili-note-iconfont iconicon_flag_s");

        let span4 = document.createElement('span');
        span4.setAttribute("class", "time-tag-item__text");

        let desc5 = document.createElement('desc');
        desc5.setAttribute("class", "time-tag-item__desc");
        desc5.setAttribute("title", text);
        desc5.append(text);

        div1.append(div2);
        div2.append(i3);
        div2.append(span4);
        span4.append(secondsToMinutes(parseInt(time)));
        span4.append(desc5);
        return div1;
    }



    var mystate = false;
    function toggle() {
        mystate = !mystate;
        return mystate;
    }

    function initFocusDown() {
        var el = document.querySelector(
            "div.editor-innter.ql-container.ql-snow > div.ql-editor"
          );
        if(el!=null){
            var scrollHeight = el.scrollHeight;
            el.scrollTo(0, scrollHeight);
            el.focus();
            if (
                typeof window.getSelection != "undefined" &&
                typeof document.createRange != "undefined"
            ) {
                var range = document.createRange();
                range.selectNodeContents(el);
                range.collapse(false);
                var sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            } else if (typeof document.body.createTextRange != "undefined") {
                var textRange = document.body.createTextRange();
                textRange.moveToElementText(el);
                textRange.collapse(false);
                textRange.select();
            }
        }
    }

     function openNoteOnlyText() {

      const editor = document.querySelector(".ql-editor")
        ? document.querySelector(".ql-editor")
        : null;
        if(!editor){alert("请先打开视频笔记，快捷键：Ctrl+Shift+↑");return;}
      const isBlank = editor && !editor.classList.contains("ql-blank");

         if (isBlank) {
             const noteContent = getNoteContent(editor);
             console.log(noteContent)
             var allContent=copyMdContent(noteContent);
             navigator.clipboard.writeText(allContent).then(function() {
                 console.log("已复制笔记内容");
                 var m1ydiv=document.querySelector("#m1ydiv");
                 m1ydiv.style.display = '';
                 setTimeout( function(){ m1ydiv.style.display = 'none';},1000);
             }, function(err) {
                 console.error('Failed to copy text: ', err);
             });

         } else {
             alert("笔记为空，无法下载");
         }
     }

function copyMdContent(notes){
    var allContent =getInfo();
    let bid = window.location.href.match(
        /(?<=bilibili.com\/video\/)(BV|av)[a-zA-Z0-9]+(?=[\/\?])?/g
    );

    for (var i = 0; i < notes.length; i++) {
        if (notes[i] != "") {
            let images_id = notes[i].match(
                /(?<=api.bilibili.com\/x\/note\/image\?image_id=)\d{6}/g
            );
            let ishdslb= notes[i].match(/hdslb.com\/bfs\/note/gi);
            if (images_id) {
                allContent +="!["+notes[i]+"](" +notes[i]+ ")\n";
            }else if(ishdslb){
                allContent +="![](" +notes[i]+ ")\n";
            } else {
                allContent += notes[i] + "\n";
            }
        } else {
            allContent += "\n";
        }
    }
    return allContent;

}




function openNote() {

      const editor = document.querySelector(".ql-editor")
        ? document.querySelector(".ql-editor")
        : null;
        if(!editor){alert("请先打开视频笔记，快捷键：Ctrl+Shift+↑");return;}
      const isBlank = editor && !editor.classList.contains("ql-blank");

      if (isBlank) {
        const noteContent = getNoteContent(editor);
        downloadMD(noteContent);
      } else {
        alert("笔记为空，无法下载");
      }
    }

    function getNoteContent(editor) {
      if (
        editor.nodeType === 1 &&
        editor.childNodes &&
        editor.childNodes.length > 0
      ) {
        return getNodes2Array(editor.childNodes);
      }
      return "";
    }

    function getNodes2Array(nodes) {
      const contents = [];
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.nodeType == 1) {
          if (node.nodeName == "P") {
              if (node.querySelector('div') || node.querySelector('span') || node.querySelector('strong') || node.querySelector('u') || node.querySelector('s')) {
                   contents.push(node2string(node));
              }else{
                   contents.push(node.innerHTML.replace(/src="(?!https:)(.*?)"/g, 'src="https:$1"').replace(/<br\s*\/?>/gi, "\n"));
              }

          } else if (node.nodeName == "OL" || node.nodeName == "UL") {
            contents.push(getLiContent(node));
          } else if (node.nodeName == "DIV") {
            contents.push(divImgContent(node));
          } else {
            contents.push(node.textContent);
          }
        }
      }
      return contents;
    }

    function getLiContent(node) {
      let allLiContent = "";
      let nodeName = node.nodeName;
      let liNodes = node.childNodes;
      let indentLevels = {};

      if (liNodes && liNodes.length > 0) {
        for (let li of liNodes) {
          let liclass = li.getAttribute("class");
          let indentLevel = 0;
          if (liclass) {
            let match = liclass.match(/ql-indent-(\d+)/);
            if (match) {
              indentLevel = parseInt(match[1]);
            }
          }

          indentLevels[indentLevel] = (indentLevels[indentLevel] || 0) + 1;

          let indent = "";
          for (let i = 0; i < indentLevel; i++) {
            indent += "\t";
          }

          allLiContent +=
            indent +
            (nodeName == "OL" ? indentLevels[indentLevel] + ". " : "- ") +
            node2string(li) +
            "\n";
        }
      }

      return allLiContent;
    }

    function divImgContent(node) {
      if (!node.classList || !node.classList.contains("ql-image-preview")) {
        return;
      }

      let img = node.querySelector("img");
      let src = img ? "https:" + img.getAttribute("src") : "";
      if (!src.includes("http")) {
        return;
      }

      let content = src ? src : "";
     // if (!content.match(/api.bilibili.com\/x\/note\/image/g)) {
     //   content = "![](" + content + ")";
   //   }
      return content;
    }

    function node2string(node) {
      let nodes = node.childNodes;
      if (!nodes || nodes.length <= 0) return "";
      let line = "";

      for (let i = 0; i < nodes.length; i++) {
        let child = nodes[i];
        let tag = child.nodeName;
        let myContents = "";

        if (
          (child.classList && child.classList.contains("ql-tag-blot")) ||
          tag === "DIV"
        ) {
          //时间戳
          let timeText = child.querySelector(".time-tag-item__text");
          let desc = child.querySelector(".time-tag-item__desc");
          let p = child.getAttribute("data-index");
          let second = child.getAttribute("data-seconds");
          let pUrl = window.location.href;
          let match = pUrl.match(
            /(https\:\/\/www.bilibili.com\/video\/)(BV|av)[a-zA-Z0-9]+(?=[\/\?])?/g
          );
          pUrl = match ? match[0] : pUrl;

          let title =
            "🚩" +
            timeText.firstChild.textContent +
            (desc ? "" + desc.textContent.replace(/~/g, '') : "");
          let time = `${pUrl}?p=${p}&t=${second}`;

          myContents += `[${title}](${time})`;
        } else {
          if (!child.children || child.children.length == 0) {
              myContents += child.textContent;
          } else {
            myContents += node2string(child);
          }

          //针对文字ql-bg
          let className = "";
          if (child.classList) {
            let myClassList = child.classList;
            for (let a = 0; a < myClassList.length; a++) {
              if (myClassList[a].match(/ql-bg/)) {
                className += "background-color:" + myClassList[a].slice(-7) + ";";
              }
              if (myClassList[a].match(/ql-color/)) {
                className += "color:" + myClassList[a].slice(-7) + ";";
              }
              if (myClassList[a].match(/ql-size/)) {
                className +=
                  "font-size:" +
                  myClassList[a].slice(8, myClassList[a].length) +
                  ";";
              }
            }
          }

         if (child.children && child.querySelector('.ql-tag-blot')==null) {

          let font1 = className != "" ? "<font style='" + className + "'>" : "";
          let font2 = className != "" ? "</font>" : "";
          myContents = font1 + myContents + font2;


          if (tag == "U" || tag == "S" || tag == "STRONG") {
            myContents =
              "<" +
              tag.toLowerCase() +
              ">" +
              myContents +
              "</" +
              tag.toLowerCase() +
              ">";
          } else if (tag == "BR") {
              myContents += "\n";
          } else {
              myContents += "";
          }
         }
        }
        line += myContents;
      }
      return line;
    }
      function getNowTime(){
          var now = new Date();
          var year = now.getFullYear();
          var month = now.getMonth() + 1;
          var date = now.getDate();
          var hours = now.getHours();
          var minutes = now.getMinutes();
          var seconds = now.getSeconds();
          hours = hours < 10 ? '0' + hours : hours;
          minutes = minutes < 10 ? '0' + minutes : minutes;
          seconds = seconds < 10 ? '0' + seconds : seconds;

          var dateString = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
          return dateString;
      }

   function getInfo(){
          let allContent ="";
          try{
              const username = document.querySelector(".username").firstChild.textContent.trim();
              const pudate_text = document.querySelector(".pudate-text").firstChild.textContent.trim();
              const views = document.querySelector("span.view.item").getAttribute("title");
              let pUrl = window.location.href;
              let match = pUrl.match(/(https\:\/\/www.bilibili.com\/video\/)(BV|av)[a-zA-Z0-9]+(?=[\/\?])?/g);
              pUrl = match ? match[0] : pUrl;
              allContent = "---\ntags: bilibili_note\nurl: "+pUrl+"\nup: "+username+"\nup_date: "+pudate_text+"\ndown_time: "+getNowTime()+"\nviews: "+views+"\n---\n\n";
          }catch(e){
              let pUrl = window.location.href;
              let match = pUrl.match(/(https\:\/\/www.bilibili.com\/video\/)(BV|av)[a-zA-Z0-9]+(?=[\/\?])?/g);
              pUrl = match ? match[0] : pUrl;
              allContent = "---\ntags: bilibili_note\nurl: "+pUrl+"\ndown_time: "+getNowTime()+"\n---\n\n";
          }
      return allContent;
      }

    async function getVideoInfo(src) {
        return await fetch(src, {
            method: 'get',
            credentials:  src.includes("bilibili.com") ? "include" : "omit",
        }).then(function(res) {
            return res.text();
        }).then(function(data) {
            return data;
        });

    }


function downloadMD(notes) {

    let zip = new JSZip();
    let allContent ="";
    if(!isLogSqe){
        allContent =getInfo();
    }
    let isOnlyMD=false;
    let bid = window.location.href.match(
        /(?<=bilibili.com\/video\/)(BV|av)[a-zA-Z0-9]+(?=[\/\?])?/g
    );

    for (var i = 0; i < notes.length; i++) {
        if (notes[i] != "") {
            let images_id = notes[i].match(
                /(?<=api.bilibili.com\/x\/note\/image\?image_id=)\d{6}/g
            );
            let ishdslb= notes[i].match(/hdslb.com\/bfs\/note/gi);
            let fileName = "";
            fileName = '' + (parseInt(Math.random()*1000000)+1000000);
            fileName = fileName.substring(1, 7);
            if (images_id) {
                //fileName = notes[i].slice(-6);

                let img_bolb= downloadImages(notes[i]);
                if(isLogSqe){
                    allContent +="![](" + bid[0] + "_" + fileName + ".jpg)\n";
                    zip.file(bid[0] + "_" + fileName + ".jpg", img_bolb);
                }else{
                   // allContent +="![](assets/" + bid[0] + "_" + fileName + ".jpg)\n";
                     allContent +="![](" + bid[0] + "_" + fileName + ".jpg)\n";
                    zip.folder("assets").file(bid[0] + "_" + fileName + ".jpg", img_bolb);

                }
                isOnlyMD=true;
            }else if(ishdslb){
               // fileName = notes[i].slice(-10,-4);
                let img_bolb= downloadImages(notes[i]);
                if(isLogSqe){
                    allContent +="![](" + bid[0] + "_" + fileName + ".jpg)\n";
                    zip.file(bid[0] + "_" + fileName + ".jpg", img_bolb);
                }else{
                   // allContent +="![](assets/" + bid[0] + "_" + fileName + ".jpg)\n";
                    allContent +="![](" + bid[0] + "_" + fileName + ".jpg)\n";
                    zip.folder("assets").file(bid[0] + "_" + fileName + ".jpg", img_bolb);

                }
                isOnlyMD=true;

            } else {
                allContent += notes[i] + "\n";
            }
        } else {
            allContent += "\n";
        }
    }

    let video_title = document.querySelector(".video-title");
    let v_title = video_title ? video_title.textContent : new Date().getTime();
    if(isOnlyMD){
        zip.file("bilibili_" + v_title + ".md", allContent);
        zip.generateAsync({
            type: 'blob',
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        }).then(function(c) {
            let filename = v_title+'.zip';
            let a = document.createElement('a');
            a.download = filename;
            a.style.display = 'none';
            a.href = URL.createObjectURL(c);
           // document.body.appendChild(a);


            // 模拟点击下载链接
            const clickEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });

            // 触发下载
            a.dispatchEvent(clickEvent);

            // 下载完成后释放 URL
            setTimeout(() => {
                URL.revokeObjectURL(a);
            }, 1000);


           // a.click();
           // URL.revokeObjectURL(c);
         //   document.body.removeChild(a);
        });
    }else{
        let blob = new Blob([allContent]);
        let a = document.createElement('a');
        a.download = "bilibili_" + v_title + ".md";
        a.href = URL.createObjectURL(blob);


            // 模拟点击下载链接
            const clickEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });

            // 触发下载
            a.dispatchEvent(clickEvent);

            // 下载完成后释放 URL
            setTimeout(() => {
                URL.revokeObjectURL(a);
            }, 1000);

       // document.body.appendChild(a);
       // a.click();
       // URL.revokeObjectURL(blob);
       // document.body.removeChild(a);

    }
}

    async function downloadImages(src) {
      let res = await fetch(src, {
        method: "get",
        credentials: src.includes("bilibili.com") ? "include" : "omit",
      });
      if (!res.ok) return;
      let blob = await res.blob();

      return blob;

    }


     function imageAfterTime_old() {//时间戳+截图 ↑
          setTimeout( function(){
            document.querySelector('i.bili-note-iconfont.iconicon_flag_L').click();
            setTimeout( function(){
                document.querySelector('div.dialog-btn.tag-dialog__btn--confirm:nth-child(2)').click();
                setTimeout( function(){
                    document.querySelector('i.bili-note-iconfont.iconcapture-app').click();
                    setTimeout( function(){
                        var qlEditor=document.querySelector('.ql-editor');
                        var lastp = qlEditor.lastElementChild;
                        //console.log(lastp.previousSibling)
                        if(lastp!=null && lastp.previousSibling.previousSibling !=null && lastp.previousSibling.previousSibling.firstElementChild.nodeName=="BR"){
                            lastp.previousSibling.previousSibling.remove();
                        }
                        var scrollHeight = qlEditor.scrollHeight;
                        qlEditor.scrollTo(0, scrollHeight);
                        qlEditor.lastElementChild.focus();
                    },333);
                },0);
            },0);
        },0);
      }

      function imageAfterTime() {//时间戳+截图 ↑
        new Promise((resolve,reject)=>{
                document.querySelector('i.bili-note-iconfont.iconicon_flag_L').click();
                return resolve();
            }).then(()=>{
                setTimeout( function(){
                    document.querySelector('div.dialog-btn.tag-dialog__btn--confirm:nth-child(2)').click();
                },500);
            });

            new Promise((resolve,reject)=>{
                 setTimeout( function(){
                    document.querySelector('i.bili-note-iconfont.iconcapture-app').click();
                },1000);
                return resolve();
            }).then(()=>{

                setTimeout( function(){
                 editTime();
                 var parentNode=document.querySelector('div.editor-innter.ql-container.ql-snow > div.ql-editor');
                 var childN=parentNode.childNodes;
                 var scrollHeight =parentNode.scrollHeight;
                 parentNode.scrollTo(0,scrollHeight);
                 parentNode.focus();
                    for(var i=1;childN.length-1;i++){
                            if(childN[i].innerHTML=="<br>" && childN[i].previousSibling.innerHTML!="<br>" && childN[i].nextSibling!=null && childN[i].previousSibling!=null && childN[i].previousSibling.nodeName == "P" && childN[i].nextSibling.nodeName == "DIV"){
                                childN[i].remove();
                            }

                    }

              },1100);
            });

    }



    function timeAfterImage_old(){//截图+时间 ↓
        document.querySelector('i.bili-note-iconfont.iconcapture-app').click();
        new Promise((resolve,reject)=>{
            document.querySelector('i.bili-note-iconfont.iconicon_flag_L').click();
            return resolve();
        }).then(()=>{
            setTimeout( function(){
                document.querySelector('div.dialog-btn.tag-dialog__btn--confirm:nth-child(2)').click();
                setTimeout( function(){
                    var qlEditor=document.querySelector('.ql-editor');
                    var lastp = qlEditor.lastElementChild;
                    if(lastp!=null && lastp.previousSibling.previousSibling !=null && lastp.previousSibling.previousSibling.firstElementChild.nodeName=="BR"){
                        lastp.previousSibling.previousSibling.remove();
                    }
                },330);
            },330);
        });

    }

    function timeAfterImage(){//截图+时间 ↓
          document.querySelector('i.bili-note-iconfont.iconcapture-app').click();
            new Promise((resolve,reject)=>{
                document.querySelector('i.bili-note-iconfont.iconicon_flag_L').click();
                return resolve();
            }).then(()=>{
                setTimeout( function(){
                    document.querySelector('div.dialog-btn.tag-dialog__btn--confirm:nth-child(2)').click();
                     editTime();
                    var parentNode=document.querySelector('div.editor-innter.ql-container.ql-snow > div.ql-editor');
                    var childN=parentNode.childNodes;
                    for(var i=0;childN.length;i++){
                        if(childN[i].innerHTML=="<br>" && childN[i].nextSibling.innerHTML!="<br>" && childN[i].nextSibling!=null && childN[i].previousSibling!=null && childN[i].nextSibling.nodeName == "P" && childN[i].previousSibling.nodeName == "DIV"){
                           childN[i].remove();
                        }
                    }
                },1500);
            });

    }

  function bind(obj,eventStr,callback){
    if(obj.addEventListener){
        obj.addEventListener(eventStr,callback,false);
    }else{
        obj.attchEvent("on"+eventStr,function(){
            callback.call(obj);
        });
    }
 }

function editTime(){

    var timestamp = document.querySelectorAll(".ql-tag-blot");
    for(let i=0;i<timestamp.length;i++){
        if(timestamp[i].onmousewheel==null){
            let nowTime= parseInt(timestamp[i].getAttribute("data-seconds"));
           let shiftPressed = false;

            timestamp[i].addEventListener('mousewheel', function(e) {
                 if (shiftPressed) {
                        nowTime=nowTime>0?nowTime:0;
                        var ev = ev || window.event;
                        var down = true;
                        down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;

                        if (down) {
                            //console.log('鼠标滚轮向下---------'+nowTime)
                            nowTime--;
                            timestamp[i].setAttribute("data-seconds",nowTime);
                        } else {
                            //console.log('鼠标滚轮向上++++++++++'+nowTime)
                            nowTime++;
                            timestamp[i].setAttribute("data-seconds",nowTime);

                        }

                        let timeContent=timestamp[i].querySelector(".time-tag-item__text").textContent.replace(/\b\d{2}:\d{2}\b/g, secondsToMinutes(nowTime)+"");
                        timestamp[i].querySelector(".time-tag-item__text").textContent=timeContent;

                        if (ev.preventDefault) {
                            ev.preventDefault();
                        }
                        bind(timestamp[i],"DOMMouseScroll",timestamp[i].onmousewheel);
                 }

            });
            timestamp[i].addEventListener('click', function(e) {
                var videos = document.getElementsByTagName('video');
                videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
                var video = videos[0];
                video.currentTime=nowTime;
            });

            document.addEventListener('keydown', function(event) {
                if (event.shiftKey) {
                    shiftPressed = true;
                }
            });

            document.addEventListener('keyup', function(event) {
                if (!event.shiftKey) {
                    shiftPressed = false;
                }
            });

        }
    }

}


       function toEnd(el) {
           var scrollHeight = el.scrollHeight;
           el.scrollTo(0, scrollHeight);
           el.lastElementChild.focus();

           if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
               var range = document.createRange();
               range.selectNodeContents(el);
               range.collapse(false);
               var sel = window.getSelection();
               sel.removeAllRanges();
               sel.addRange(range);
           } else if (typeof document.body.createTextRange != "undefined") {
               var textRange = document.body.createTextRange();
               textRange.moveToElementText(el);
               textRange.collapse(false);
               textRange.select();
           }
       }

    function getDanMu() {
        let state = window.__INITIAL_STATE__;
        let p = state.p || 1;
        let cid = state.videoData.pages[p - 1].cid;
        let src = "https://api.bilibili.com/x/v1/dm/list.so?oid=" + cid;

        return fetch(src, {
            method: "get",
            dataType: "text/xml",
            credentials: 'include',
        }).then(function (response) {

            return response.text();
        }).then(function (result) {

            const editor = document.querySelector(".ql-editor")? document.querySelector(".ql-editor"): null;
            if(editor){
                parseDanMu(result,state,editor);
                const timestamps = document.querySelectorAll('.ql-tag-blot');
                timestamps.forEach(function(timestamp) {
                    timestamp.addEventListener('click', function(e) {
                        let dataSeconds=timestamp.getAttribute("data-seconds");
                        let videos = document.getElementsByTagName('video');
                        videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
                        let video = videos[0];

                        video.currentTime = dataSeconds;
                        video.play();
                        setTimeout(function () {
                             document.querySelector("i.bili-note-iconfont.iconcapture-app").click();
                        }, 200);

                    });

                });
                  editor.scrollTo(0,0);
                  editor.focus();

            }else{
                alert("请先打开视频笔记，快捷键：Ctrl+Shift+↑");
            }

        });
    }

function getOnlyDanMus() {
        let state = window.__INITIAL_STATE__;
        let p = state.p || 1;
        let cid = state.videoData.pages[p - 1].cid;
        let src = "https://api.bilibili.com/x/v1/dm/list.so?oid=" + cid;

        return fetch(src, {
            method: "get",
            dataType: "text/xml",
            credentials: 'include',
        }).then(function (response) {

            return response.text();
        }).then(function (result) {

            const editor = document.querySelector(".ql-editor")? document.querySelector(".ql-editor"): null;
            if(editor){
                parseDanMu2Text(result,editor);

            }else{
                alert("请先打开视频笔记，快捷键：Ctrl+Shift+↑");
            }

        });
    }


      function getDanMuDownload() {
        let state = window.__INITIAL_STATE__;
        let p = state.p || 1;
        let cid = state.videoData.pages[p - 1].cid;
        let src = "https://api.bilibili.com/x/v1/dm/list.so?oid=" + cid;

        return fetch(src, {
            method: "get",
            dataType: "text/xml",
            credentials: 'include',
        }).then(function (response) {

            return response.text();
        }).then(function (xmlString) {

            let myContents =getInfo();
            let p = state.p || 1;
            let cid = state.videoData.pages[p - 1].cid;
            let title = state.videoData.title;
            let pUrl = window.location.href;
            let match = pUrl.match(/(https\:\/\/www.bilibili.com\/video\/)(BV|av)[a-zA-Z0-9]+(?=[\/\?])?/g);
            pUrl = match ? match[0] : pUrl;

            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(xmlString, "text/xml");
            let danMuElements=sortDNode(xmlDoc)
            for (let i = 0; i < danMuElements.length; i++) {
                let element = danMuElements[i];
                let pnode = element.getAttribute("p");
                let text = element.textContent;
                let pArr=pnode.split(",");
                let second= parseInt(pArr[0]);
                let title ="🚩" +secondsToMinutes(second) +text.replace(/~/g, '').replace(/\*/g, '');
                let time = `${pUrl}?p=${p}&t=${second}`;
                myContents += `[${title}](${time})`;
                myContents += "\n";
            }

            let video_title = document.querySelector(".video-title");
            let v_title = video_title ? video_title.textContent : new Date().getTime();
            let blob = new Blob([myContents]);
            let a = document.createElement('a');
            a.download = "bilibili_" + v_title + ".md";
            a.href = URL.createObjectURL(blob);
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(blob);
            document.body.removeChild(a);

        });
      }

    function getPicDownload(){
        let videos = document.getElementsByTagName('video');
        videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
        let video = videos[0];
        let duration = video.duration;

        video.currentTime = duration;
        video.play();

        const blobArr = [];

        video.onseeked = function() {


            let canvas = document.createElement('canvas');
            canvas.setAttribute('width',video.videoWidth);
            canvas.setAttribute('height',video.videoHeight);
            let ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            let dataURL = canvas.toDataURL('image/jpeg');
            let dataBlob=dataURItoBlob(dataURL);

            blobArr.push(dataBlob);
            downloadPicMD(blobArr);
        };

    }

    async function captureVideoFrames(video, duration) {
        const blobArr = [];

        for (let i = 0; i < duration; i++) {
            (function(i) {
                video.currentTime = i;
                video.pause();

                const canvas = document.createElement('canvas');
                canvas.setAttribute('width', video.videoWidth);
                canvas.setAttribute('height', video.videoHeight);

                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataURL = canvas.toDataURL('image/jpeg');
                const dataBlob = dataURItoBlob(dataURL);

                blobArr.push(dataBlob);
                canvas.remove();
            })(i);
        }

        return blobArr;
    }



    function downloadPicMD(blobArr) {
        let zip = new JSZip();
        let allContent =getInfo();
        let bid = window.location.href.match(
            /(?<=bilibili.com\/video\/)(BV|av)[a-zA-Z0-9]+(?=[\/\?])?/g
        );

        for (let i = 0; i < blobArr.length; i++) {
            if (blobArr[i] != "") {
                //allContent += "![](assets/" + bid[0] +i + ".jpg)\n";
                allContent += "![](" + bid[0] +i + ".jpg)\n";
                zip.folder("assets").file(bid[0] +i + ".jpg", blobArr[i]);
            } else {
                allContent += "\n";
            }
        }
        let video_title = document.querySelector(".video-title");
        let v_title = video_title ? video_title.textContent : new Date().getTime();
        zip.file("bilibili_" + v_title + ".md", allContent);
        zip.generateAsync({
            type: 'blob',
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        }).then(function(c) {
            let filename = v_title+'.zip';
            let a = document.createElement('a');
            a.download = filename;
            a.style.display = 'none';
            a.href = URL.createObjectURL(c);
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(c);
            document.body.removeChild(a);
        });
    }

    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var blob = new Blob([ab], {type: mimeString});
        return blob;
    }


    function sortDNode(xmlDoc){
        const dNodes = xmlDoc.querySelectorAll('d');
        const sortedDNodes = [...dNodes].sort((a, b) => {
            const p1 = a.getAttribute('p');
            const p2 = b.getAttribute('p');
            let p1Arr=p1.split(",");
            let p2Arr=p2.split(",");
            let p1Int=parseInt(p1Arr[0]);
            let p2Int=parseInt(p2Arr[0]);
            if (p1Int < p2Int) {
                return -1;
            } else if (p1Int > p2Int) {
                return 1;
            } else {
                return 0;
            }
        });
        return sortedDNodes;
    }



    function parseDanMu(xmlString,state,editor) {
        let p = state.p || 1;
        let cid = state.videoData.pages[p - 1].cid;
        let title = state.videoData.title;


        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlString, "text/xml");
        let danMuElements=sortDNode(xmlDoc)
       //let danMuElements = sortedXmlDoc.getElementsByTagName("d");
        for (let i = 0; i < danMuElements.length; i++) {
            let pnew = document.createElement('p');
            let element = danMuElements[i];
            let pnode = element.getAttribute("p");
            let text = element.textContent;
            let pArr=pnode.split(",");
            pnew.append(BHtmlParser(parseInt(pArr[0]),text,cid,p,title,pArr[7].slice(-13)));
            editor.append(pnew);
        }
        var scrollHeight = editor.scrollHeight;
        editor.scrollTo(0, scrollHeight);
    }

    function parseDanMu2Text(xmlString,editor) {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlString, "text/xml");
        let danMuElements=sortDNode(xmlDoc)
        var danmuText="";
        for (let i = 0; i < danMuElements.length; i++) {
            let element = danMuElements[i];
            let text = element.textContent;
            danmuText+=text+"\n";
        }
        editor.append(danmuText);
        var scrollHeight = editor.scrollHeight;
        editor.scrollTo(0, scrollHeight);
    }



    function BHtmlParser(time,text,cid,p,title,datakey){
        let div1 = document.createElement('div');
        div1.setAttribute("class", "ql-tag-blot");
        div1.setAttribute("data-oid_type", "0");
        div1.setAttribute("data-cid", cid);
        div1.setAttribute("data-epid", 0);
        div1.setAttribute("data-status", "0");
        div1.setAttribute("data-index", p);
        div1.setAttribute("data-seconds", time);
        div1.setAttribute("data-cid-count", "1");
        div1.setAttribute("data-key", datakey);
        div1.setAttribute("data-title", title);
        div1.setAttribute("data-desc", text);
        // let span2 = document.createElement('span');
        //  span2.setAttribute("contenteditable", "false");
        let div2 = document.createElement('div');
        div2.setAttribute("class", "time-tag-item");
        div2.setAttribute("contenteditable", "false");

        let i3 = document.createElement('i');
        i3.setAttribute("class", "bili-note-iconfont iconicon_flag_s");

        let span4 = document.createElement('span');
        span4.setAttribute("class", "time-tag-item__text");

        let desc5 = document.createElement('desc');
        desc5.setAttribute("class", "time-tag-item__desc");
        desc5.setAttribute("title", text);
        desc5.append(text);

        div1.append(div2);
        div2.append(i3);
        div2.append(span4);
        span4.append(secondsToMinutes(time));
        span4.append(desc5);
        return div1;
    }

function secondsToMinutes(seconds) {
    if(seconds>0){
        var minutes = Math.floor(seconds / 60);
        var formattedMinutes = ("0" + minutes).slice(-2);
        var formattedSeconds = ("0" + (seconds % 60)).slice(-2);
        return formattedMinutes + ":" + formattedSeconds;
    }else{
       return "00:00";
    }
}

    const state = window.__INITIAL_STATE__;

    function getTimestamp(){
        const editor = document.querySelector(".ql-editor")? document.querySelector(".ql-editor"): null;
        let p = state.p || 1;
        let cid = state.videoData.pages[p - 1].cid;
        let title = state.videoData.title;

        let videos = document.getElementsByTagName('video');
        videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
        let video = videos[0];
        let currentTime=video.currentTime;

        let pnew = document.createElement('p');
        var t = (new Date).getTime();

        var timeDom= BHtmlParser(parseInt(currentTime),'',cid,p,title,t);

        timeDom.addEventListener('click', function() {
            let videos1 = document.getElementsByTagName('video');
            videos1 = videos1.length==0 ? document.getElementsByTagName('bwp-video'):videos1;
            let video1 = videos1[0];
            video1.currentTime = currentTime;
            video1.play();
        });
        editor.append(timeDom);
        let brnew = document.createElement('br');
        editor.append(brnew);

        toEnd(editor);
        editor.addEventListener('keydown', event => {
            if (event.keyCode === 37) {
                event.preventDefault();
            }
        });

        video.play();
    }



function copyCurrentURL2ClipBoard(){
    let videos = document.getElementsByTagName('video');
    videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
    let video = videos[0];
    let pUrl = window.location.href;
    let match = pUrl.match(/(https\:\/\/www.bilibili.com\/video\/)(BV|av)[a-zA-Z0-9]+(?=[\/\?])?/g);
    let r= new RegExp(`[?&]p=([^&]*)`);
    let regex = new RegExp(`[?&]p=([^&]*)`);
    if(regex.test(pUrl)){

        let results = r.exec(pUrl);
        let p = results ? results[1] : null;
        pUrl = match ? match[0] +"?p="+p+"&t="+video.currentTime: pUrl;
    }else{
        pUrl = match ? match[0] +"?t="+video.currentTime: pUrl;

    }

    navigator.clipboard.writeText(pUrl).then(function() {
        console.log('Copied text to clipboard');
    }, function(err) {
        console.error('Failed to copy text: ', err);
    });
}

var isLogSqe=false;



window.onload=function(){
    let newDiv = document.createElement('div');
    newDiv.style.position="absolute";
    newDiv.style.zIndex=99999999999999999999;
    newDiv.style.cursor="pointer";
    newDiv.setAttribute("id", "my_icon");
    newDiv.setAttribute("class", "copy_option")
    newDiv.style.height="40px";
    newDiv.style.width="40px";
    newDiv.style.backgroundColor="#fff";
    newDiv.style.boxShadow="0 0 0 1px rgb(0 0 0 / 5%), 0 2px 3px 0 rgb(0 0 0 / 10%)";
    newDiv.style.borderRadius="50%";
    newDiv.style.display="none";
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('id', 'mu');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
    svg.setAttribute('x', '0px');
    svg.setAttribute('y', '0px');
    svg.setAttribute('width', '60px');
    svg.setAttribute('height', '60px');
    svg.setAttribute('fill', '#00aeec');

    svg.style.paddingTop="8px";
    svg.style.paddingLeft="7px";
    svg.setAttribute('viewBox', '0 0 40 40');
    svg.setAttribute('enable-background', 'new 0 0 40 40');
    svg.setAttribute('xml:space', 'preserve');
    svg.innerHTML='<path fill-rule="evenodd" d="M12.75,7H16L12,4V6.25A.75.75,0,0,0,12.75,7ZM10,7.5V4H7.5A1.5,1.5,0,0,0,6,5.5v9A1.5,1.5,0,0,0,7.5,16h7A1.5,1.5,0,0,0,16,14.5V9H11.5A1.5,1.5,0,0,1,10,7.5ZM10,2V1.5A1.5,1.5,0,0,0,8.5,0h-7A1.5,1.5,0,0,0,0,1.5v9A1.5,1.5,0,0,0,1.5,12H4V5.5A3.5,3.5,0,0,1,7.5,2Z"></path>';
    newDiv.appendChild(svg);

    document.body.after(newDiv);

    function parserString2HTML(htmlString){
        const parser = new DOMParser();
        const htmlDoc = parser.parseFromString(htmlString, "text/html");
        return htmlDoc;

    }


//

    var isOpne=true;
    var htmlStr='<div class="note-container1"><div class="note-content1"><div style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span><a  style="font-size:18px;" href="https://space.bilibili.com/1208812226" target="_blank">快捷键所有功能<i style="color:blue;font-size:8px;padding-left:8px;">反馈建议@大王鹅鹅鹅<i></a></span><a href="javascript:void(0);" class="svg-icon1" id="myclose" style="padding-top:4px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.46967 4.46967C4.17678 4.76256 4.17678 5.23744 4.46967 5.53033L10.0104 11.0711L4.46967 16.6118C4.17678 16.9047 4.17678 17.3796 4.46967 17.6725C4.76256 17.9654 5.23744 17.9654 5.53033 17.6725L11.0711 12.1317L16.6118 17.6725C16.9047 17.9654 17.3796 17.9654 17.6725 17.6725C17.9654 17.3796 17.9654 16.9047 17.6725 16.6118L12.1317 11.0711L17.6725 5.53033C17.9654 5.23744 17.9654 4.76256 17.6725 4.46967C17.3796 4.17678 16.9047 4.17678 16.6118 4.46967L11.0711 10.0104L5.53033 4.46967C5.23744 4.17678 4.76256 4.17678 4.46967 4.46967Z" fill="#18191C"></path></svg></a></div><a href="javascript:void(0);" class="sub-item1" id="openNoteID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>打开笔记</span><span>Ctrl+Shift+↑</span></span></a><a href="javascript:void(0);" class="sub-item1" id="zimuOnlyNoteID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>纯字幕笔记</span><span>Ctrl+Alt+V</span></span></a><a href="javascript:void(0);" class="sub-item1" id="addEditZimuID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>图文联动</span><span></span></span></a><a href="javascript:void(0);" class="sub-item1" id="downloadNoteID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>下载笔记</span><span>Ctrl+Shift+S</span></span></a><a href="javascript:void(0);" class="sub-item1" id="picTimeID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>截图+时间戳</span><span>Ctrl+↓</span></span></a><a href="javascript:void(0);" class="sub-item1" id="timePicID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>时间戳+截图</span><span>Ctrl+↑</span></span></a><a href="javascript:void(0);" class="sub-item1" id="timeID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>时间戳</span><span>Ctrl+←</span></span></a><a href="javascript:void(0);" class="sub-item1" id="picID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>截图</span><span>Ctrl+→</span></span></a><a href="javascript:void(0);" class="sub-item1" id="getVideoID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>下载视频</span><span>Alt+V</span></span></a><a href="javascript:void(0);" class="sub-item1" id="note2videoID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>笔记窗口切换到视频窗口</span><span>Ctrl+Shift+←</span></span></a><a href="javascript:void(0);" class="sub-item1" id="video2noteID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>视频窗口切换到笔记窗口</span><span>Ctrl+Shift+→</span></span></a><a href="javascript:void(0);" class="sub-item1" id="firstPicID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>下载视频封面</span><span>Alt+T</span></span></a><a href="javascript:void(0);" class="sub-item1" id="openNoteOnlyTextID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>复制笔记内容</span><span id="copystate">Ctrl+Alt+N</span></span></a><a href="javascript:void(0);" class="sub-item1" id="zimuNoteID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>字幕图文笔记</span><span>Ctrl+Shift+V</span></span></a><a href="javascript:void(0);" class="sub-item1" id="danmuNoteID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>弹幕图文笔记</span><span>Ctrl+Shift+Z</span></span></a><a href="javascript:void(0);" class="sub-item1" id="danmuOnlyNoteID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>纯弹幕笔记</span><span>Ctrl+Alt+Z</span></span></a><a href="https://www.bilibili.com/video/BV1mM4y1D7tM/" class="sub-item1" target="_blank"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>实时弹幕笔记</span><span style="padding-top:10px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.67735 4.2798C5.98983 4.1725 7.85812 4.0625 10 4.0625C12.1421 4.0625 14.0105 4.17252 15.323 4.27983C16.2216 4.3533 16.9184 5.04049 16.9989 5.9318C17.0962 7.00837 17.1875 8.43614 17.1875 10C17.1875 11.5639 17.0962 12.9916 16.9989 14.0682C16.9184 14.9595 16.2216 15.6467 15.323 15.7202C14.0105 15.8275 12.1421 15.9375 10 15.9375C7.85812 15.9375 5.98983 15.8275 4.67735 15.7202C3.77861 15.6467 3.08174 14.9593 3.00119 14.0678C2.90388 12.9908 2.8125 11.5627 2.8125 10C2.8125 8.43727 2.90388 7.00924 3.00119 5.93221C3.08174 5.04067 3.77861 4.35327 4.67735 4.2798ZM10 2.8125C7.81674 2.8125 5.9136 2.92456 4.5755 3.03395C3.07738 3.15643 1.8921 4.31616 1.75626 5.81973C1.65651 6.92379 1.5625 8.39058 1.5625 10C1.5625 11.6094 1.65651 13.0762 1.75626 14.1803C1.8921 15.6838 3.07738 16.8436 4.5755 16.966C5.9136 17.0754 7.81674 17.1875 10 17.1875C12.1835 17.1875 14.0868 17.0754 15.4249 16.966C16.9228 16.8436 18.108 15.6841 18.2438 14.1807C18.3435 13.077 18.4375 11.6105 18.4375 10C18.4375 8.38948 18.3435 6.92296 18.2438 5.81931C18.108 4.31588 16.9228 3.15645 15.4249 3.03398C14.0868 2.92458 12.1835 2.8125 10 2.8125ZM12.1876 10.722C12.7431 10.4013 12.7431 9.59941 12.1876 9.27866L9.06133 7.47373C8.50577 7.15298 7.81133 7.55392 7.81133 8.19542V11.8053C7.81133 12.4468 8.50577 12.8477 9.06133 12.527L12.1876 10.722Z" fill="#9499A0"/></svg></span></span></a><a href="https://www.bilibili.com/video/BV183411D7mP/" target="_blank" class="sub-item1" id="commmentNoteID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>评论区做笔记教程</span><span style="padding-top:10px;"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.67735 4.2798C5.98983 4.1725 7.85812 4.0625 10 4.0625C12.1421 4.0625 14.0105 4.17252 15.323 4.27983C16.2216 4.3533 16.9184 5.04049 16.9989 5.9318C17.0962 7.00837 17.1875 8.43614 17.1875 10C17.1875 11.5639 17.0962 12.9916 16.9989 14.0682C16.9184 14.9595 16.2216 15.6467 15.323 15.7202C14.0105 15.8275 12.1421 15.9375 10 15.9375C7.85812 15.9375 5.98983 15.8275 4.67735 15.7202C3.77861 15.6467 3.08174 14.9593 3.00119 14.0678C2.90388 12.9908 2.8125 11.5627 2.8125 10C2.8125 8.43727 2.90388 7.00924 3.00119 5.93221C3.08174 5.04067 3.77861 4.35327 4.67735 4.2798ZM10 2.8125C7.81674 2.8125 5.9136 2.92456 4.5755 3.03395C3.07738 3.15643 1.8921 4.31616 1.75626 5.81973C1.65651 6.92379 1.5625 8.39058 1.5625 10C1.5625 11.6094 1.65651 13.0762 1.75626 14.1803C1.8921 15.6838 3.07738 16.8436 4.5755 16.966C5.9136 17.0754 7.81674 17.1875 10 17.1875C12.1835 17.1875 14.0868 17.0754 15.4249 16.966C16.9228 16.8436 18.108 15.6841 18.2438 14.1807C18.3435 13.077 18.4375 11.6105 18.4375 10C18.4375 8.38948 18.3435 6.92296 18.2438 5.81931C18.108 4.31588 16.9228 3.15645 15.4249 3.03398C14.0868 2.92458 12.1835 2.8125 10 2.8125ZM12.1876 10.722C12.7431 10.4013 12.7431 9.59941 12.1876 9.27866L9.06133 7.47373C8.50577 7.15298 7.81133 7.55392 7.81133 8.19542V11.8053C7.81133 12.4468 8.50577 12.8477 9.06133 12.527L12.1876 10.722Z" fill="#9499A0"/></svg></span></span></a><a href="javascript:void(0);" class="sub-item1" id="rateAddVideoID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>倍速+</span><span>Shift+3</span></span></a><a href="javascript:void(0);" class="sub-item1" id="rateSubVideoID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>倍速-</span><span>Shift+4</span></span></a><a href="javascript:void(0);" class="sub-item1" id="videoURLID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>复制当前帧视频地址到剪切板</span><span>Alt+C</span></span></a><a href="javascript:void(0);" class="sub-item1" id="downloadLogSeqNoteID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>下载笔记（for Logseq）</span><span></span></span></a><a href="javascript:void(0);" class="sub-item1" id="add10SecondsVideoID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>视频快进10秒</span><span>Shift+→</span></span></a><a href="javascript:void(0);" class="sub-item1" id="sub10SecondsVideoID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>视频后退10秒</span><span>Shift+←</span></span></a>    <a href="javascript:void(0);" class="sub-item1" id="closeNoteID"><span style="display: flex;align-items: center;height: 32px;justify-content: space-between;"><span>关闭笔记</span><span>Ctrl+Shift+↓</span></span></a></div></div><style>.note-pc1.resizable-component1 {border-radius: 8px;}.resizable-component1 {display: -ms-flexbox;display: flex;-ms-flex-direction: column;flex-direction: column;position: absolute!important;box-shadow: 0 3px 25px 0 rgb(0 0 0 / 30%);border-radius: 4px;background: #ededf2;}.note-pc1 .note-container1 {box-sizing: content-box;display: -ms-flexbox;display: flex;-ms-flex-direction: column;flex-direction: column;width: 100%;height: 100%;border: 1px solid #e3e5e7;border-radius: 8px;background: #ffffff;box-shadow: 0 0 30px rgb(0 0 0 / 10%);}.note-pc1 * {box-sizing: border-box;}.note-pc1 .note-container1 .note-content1 {position: relative;height: calc(100% - 62px);transform: translateZ(0);padding:10px;}.note-pc1 * {box-sizing: border-box;}.sub-item1 {display: flex;flex-direction: column;flex-wrap: nowrap;margin-right: 8px;max-height: 148px;} .note-content1 a{display: block;padding: 0 6px;height: 32px;border-radius: 4px;color: #18191c;text-align: left;white-space: nowrap;font-size: 13px;line-height: 32px;cursor: pointer;-webkit-transition:background-color .3s;transition:background-color .3s;} .note-content1 a:hover {background-color: #e3e5e7;}.svg-icon1 {display: inline-flex;justify-content: center;align-items: center;}</style>';

    let div1 = document.createElement('div');
    div1.style.position="absolute";
    div1.style.cursor="move";

    div1.innerHTML=htmlStr;
    div1.style.display="none";
    div1.style.width="305px";
    div1.style.height="900px";
    div1.style.left="550px";
    div1.style.top="170px";
    div1.style.zIndex="10002";
    div1.style.userSelect="none";
    div1.setAttribute('id', "shortCutInfo");
    div1.classList.add('resizable-component1', 'note-pc1');

    document.body.append(div1);

    var distX=0;
    var distY=0;
    let isDragging = false;
    div1.onmousedown=function(ev){
        ev.preventDefault();
        var oEvent=ev||event;
        distX=oEvent.clientX-div1.offsetLeft;
        distY=oEvent.clientY-div1.offsetTop;
        document.onmousemove=function(ev){
            if(isDragging){
                var oEvent=ev||event;
                var x=oEvent.clientX-distX;
                var y=oEvent.clientY-distY;
                if(x<0){
                    x=0;
                }
                if(y<0){
                    y=0;
                }
                if(x>(document.documentElement.clientWidth-div1.offsetWidth))
                {
                    x=document.documentElement.clientWidth-div1.offsetWidth;
                }
                div1.style.left=x+'px';
                div1.style.top=y+'px';
            }
            document.onmouseup=function(){

                document.onmousemove=null;
                document.onmouseup=null;
                isDragging = false;

            }
        }
    }

    div1.addEventListener("mousedown", function (e) {
       // e.preventDefault();
        isDragging = true;
    });
    div1.addEventListener("mouseup", function (e) {
       // e.preventDefault();
        isDragging = false;
    });







    document.querySelector("#myclose").onclick=function(){
        document.querySelector("#shortCutInfo").style.display="none";
        isOpne=true;
    };



    document.querySelector("#openNoteID").onclick=function(){
        document.querySelector(".video-note-info").click();
                setTimeout( function(){document.querySelector(".operation-desc").click();},0);
                var count = 2;
                var timeId = setInterval(function () {
                    count--;
                    if (count <= 0) {
                        clearInterval(timeId);
                    }
                    initFocusDown();
                    setTimeout( function(){editTime();},10);

                }, 600);

                //固定笔记
        var myresize = document.querySelector(".resizable-component");
        if(myresize){
            myresize.style.position = 'fixed';
           // myresize.style.setProperty('position', 'fixed', 'important');
        }
    };



    document.querySelector("#closeNoteID").onclick=function(){
         document.querySelector(".close-note").click();
    };



    document.querySelector("#note2videoID").onclick=function(){
         //笔记窗口切换到视频窗口
         var pNodel = document.querySelector(
                    "div.editor-innter.ql-container.ql-snow > div.ql-editor"
                );
                pNodel.blur();

                let videos = document.getElementsByTagName('video');
                videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
                let video = videos[0];
                if(toggle()){
                    video.pause();
                }else{
                    video.play();
                }
    };

    document.querySelector("#video2noteID").onclick=function(){
        //视频窗口切换到笔记窗口
        initFocusDown();
    };

    document.querySelector("#picTimeID").onclick=function(){
        //截图+时间戳
        timeAfterImage();
    };

    document.querySelector("#timePicID").onclick=function(){
        //时间戳+截图
        imageAfterTime();
    };

    document.querySelector("#timeID").onclick=function(){
        //时间戳
         document.querySelector("i.bili-note-iconfont.iconicon_flag_L").click();
                setTimeout(function () {
                    document
                        .querySelector(
                        "div.dialog-btn.tag-dialog__btn--confirm:nth-child(2)"
                    )
                        .click();
                }, 0);
    };

    document.querySelector("#picID").onclick=function(){
        //截图
            document.querySelector("i.bili-note-iconfont.iconcapture-app").click();
                setTimeout(function () {
                    var parentNode = document.querySelector(
                        "div.editor-innter.ql-container.ql-snow > div.ql-editor"
                    );
                    var scrollHeight = parentNode.scrollHeight;
                    parentNode.scrollTo(0, scrollHeight);
                    parentNode.focus();
                }, 500);
    };

    document.querySelector("#downloadNoteID").onclick=function(){
       //下载笔记
        isLogSqe=false;
         openNote();
    };


    document.querySelector("#danmuNoteID").onclick=function(){
       //弹幕图文笔记
         getDanMu();
    };

    document.querySelector("#danmuOnlyNoteID").onclick=function(){
       //纯弹幕笔记
        getOnlyDanMus();
    };


    document.querySelector("#zimuNoteID").onclick=function(){
        //字幕图文笔记
         getZiMu();
    };
    document.querySelector("#zimuOnlyNoteID").onclick=function(){
       //纯字幕笔记
        getOnlyZiMus();
    };

    document.querySelector("#rateAddVideoID").onclick=function(){
       //倍速1.25倍
          let videos = document.getElementsByTagName('video');
          videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
            let video = videos[0];
            if(video.playbackRate<4){
                video.playbackRate += 0.25;
            }

    };
    document.querySelector("#rateSubVideoID").onclick=function(){
        //倍速1.25倍
        let videos = document.getElementsByTagName('video');
        videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
        let video = videos[0];
        if(video.playbackRate>0.25){
            video.playbackRate -= 0.25;
        }
    };

    document.querySelector("#videoURLID").onclick=function(){
       //复制当前帧视频地址到剪切板
        copyCurrentURL2ClipBoard();
    };

     document.querySelector("#downloadLogSeqNoteID").onclick=function(){
      isLogSqe=true;
      openNote();
    };

     document.querySelector("#addEditZimuID").onclick=function(){
      getZiMu_time();
    };

    document.querySelector("#openNoteOnlyTextID").onclick=function(){
      openNoteOnlyText();
         document.querySelector("#copystate").innerHTML="复制成功！";
         setTimeout( function(){document.querySelector("#copystate").innerHTML="Ctrl+Alt+N";},1000);
    };

    document.querySelector("#add10SecondsVideoID").onclick=function(){
        var videos = document.getElementsByTagName('video');
        videos = videos.length==0 ? document.getElementsByTagName('bwp-video'):videos;
        var video = videos[0];
        video.currentTime = video.currentTime+10;
        video.play();
    };


    document.querySelector("#sub10SecondsVideoID").onclick=function(){
        var videos2 = document.getElementsByTagName('video');
        videos2 = videos2.length==0 ? document.getElementsByTagName('bwp-video'):videos2;
        var video2 = videos2[0];
        video2.currentTime = video2.currentTime-10;
        video2.play();
    };

    document.querySelector("#firstPicID").onclick=function(){
        let bvid = state.videoData.bvid;
        let title = state.videoData.title;
        let img_url = 'https://api.bilibili.com/x/web-interface/view?bvid='+bvid;
        downloadOnlyImages(img_url,title);
    };

     document.querySelector("#getVideoID").onclick=function(){
       downloadVideo();
    };





 function offset(curEle){
      var totalLeft = null,totalTop = null,par = curEle.offsetParent;
      totalLeft+=curEle.offsetLeft;
      totalTop+=curEle.offsetTop
      while(par){
        if(navigator.userAgent.indexOf("MSIE 8.0")===-1){
          totalLeft+=par.clientLeft;
          totalTop+=par.clientTop
        }
        totalLeft+=par.offsetLeft;
        totalTop+=par.offsetTop
        par = par.offsetParent;
      }

      return{
        left:totalLeft,
        top:totalTop
      }
    }

    var div22 = document.createElement('div');
    div22.onclick=function(){
        if(isOpne){
            var isShowCommontinit = localStorage.getItem('isShowCommont');
            document.querySelector("#shortCutInfo").style.display="";
            isOpne=false;
        }else{
            document.querySelector("#shortCutInfo").style.display="none";
            isOpne=true;
        }
    };

    var btnPanel=document.querySelector(".upinfo-btn-panel");
    btnPanel= btnPanel?btnPanel:document.querySelector(".membersinfo-normal")
    var x = offset(btnPanel).top;
    var y = offset(btnPanel).left;


    div22.setAttribute('class', "my-btn");
    div22.setAttribute('id', "myShortCutbtn");
    div22.style.position="absolute";
    div22.style.top=x+"px";
    div22.style.left=(parseInt(y)-60)+"px";
    div22.style.zIndex="1001";
    div22.style.cursor="pointer";
    var htmlDiv22='<span style="user-select:none;">快捷键</span><style>.my-btn {box-sizing: border-box;padding: 0;line-height: 30px;height: 30px;border-radius: 6px;font-size: 10px;display: flex;align-items: center;justify-content: center;cursor: pointer;background: #C9CCD0;position: relative;margin-right: 12px;flex-shrink: 0;width: 50px;transition: 0.3s all;border: 1px solid #00AEEC;background: #FFFFFF;color: #00AEEC;}.my-btn:hover {background-color:#ffecf1;}</style>';
    div22.innerHTML=htmlDiv22;
    document.body.append(div22);


    let m1ydiv = document.createElement('div');
    var htmlm1ydiv='<span class="my-btn1">已复制笔记内容</span><style>.my-btn1 {box-sizing: border-box;line-height: 30px;height: 30px;font-size: 18px;outline: none;background: #000;color: #ddd;box-shadow: 0 10px 20px rgb(134 140 150 / 65%);background-color: #fff;border-radius: 4px;color: #00AEEC;}</style>';

    m1ydiv.innerHTML=htmlm1ydiv;
    m1ydiv.setAttribute('id', "m1ydiv");
    m1ydiv.style.zIndex="1001111111111111111";
    m1ydiv.style.display = 'none';
    m1ydiv.style.position="absolute";
    m1ydiv.style.right="50%";
    m1ydiv.style.top="10%";
    document.body.before(m1ydiv);


    var playWide=document.querySelector("div.bpx-player-ctrl-btn.bpx-player-ctrl-wide");
    if(playWide){
    playWide.addEventListener("click", function (e) {
        setTimeout(function () {
            var btnPanel_temp=document.querySelector(".upinfo-btn-panel");
            var y_temp = offset(btnPanel_temp).left;
            div22.style.left=(parseInt(y_temp)-60)+"px";
        }, 110);

    });
}

};



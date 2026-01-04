// ==UserScript==
// @name         蔡蔡学习专用脚本
// @namespace    sb脚本1.0
// @version      1.1
// @description  学习公社自动看视频、自动刷新,自动跳过防疲劳
// @author       LZJ
// @match        *study.enaea.edu.cn/viewerforccvideo*
// @match        *study.enaea.edu.cn/circleIndexRedirect*
// @grant        none
// @license		 MIT
// @downloadURL https://update.greasyfork.org/scripts/493598/%E8%94%A1%E8%94%A1%E5%AD%A6%E4%B9%A0%E4%B8%93%E7%94%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/493598/%E8%94%A1%E8%94%A1%E5%AD%A6%E4%B9%A0%E4%B8%93%E7%94%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

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

(function() {
    var url = window.location.pathname

    //视频播放页
    if (url == '/viewerforccvideo.do') {
        //清理localStorage，以防不给加进度。
        localStorage.clear();
        localStorage.setItem('videoIsDone',false)

        // 防疲劳
        setTimeout(() => {
            let video = document.getElementsByTagName('video')[0];
            console.log(video)
            //pause：暂停监听
            video.addEventListener('pause', function(e) {
                console.log('暂停播放')
                //继续播放
                videoPlay()
                //删除弹窗
                let dialog = document.getElementById('rest_tip');
                if (dialog){
                    dialog.remove()
                }
            })
        }, 5000)


        //五秒后关闭声音
        function Music_No() {
            setTimeout(function() {
                document.getElementsByClassName("xgplayer-icon-muted")[0].click()
            }, 5000)
        }

        //点击未完成的视频进行播放
        function rePlay() {
            setTimeout(function() {
                if (document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")[0].innerHTML == '100%') {
                    for (var i = 1; i < document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")
                        .length; i++) {
                        if (document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")[i].innerHTML !=
                            '100%') {
                            document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")[i].click()
                            break
                        }
                    }
                }
            }, 2000)
        }

        //隔五秒循环执行
        setInterval(function() {

            //最后一个视频的index
            index = document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress").length - 1

            //查看当前课前是否完成
            if (document.getElementsByClassName('current')[1].children[0].childNodes[1].innerText ==
                '100%') {

                //如果最后一个视频完成了就代表全部视频都完成了
                if (document.getElementsByClassName("cvtb-MCK-CsCt-studyProgress")[index].innerHTML ==
                    '100%') {
                    //关闭网站
                    localStorage.setItem('videoIsDone',true)
                    window.close()
                } else {
                    //否则播放下一个未完成的视频
                    rePlay()
                }

            } else {
                console.log("正在观看：" + document.getElementsByClassName('current')[1].children[0]
                    .getElementsByClassName("cvtb-text-ellipsis")[0].innerHTML)
            }


            //如果出现异常就刷新网页
            if (document.getElementsByClassName("dialog-content")[0] != undefined) {
                if (document.getElementsByClassName("dialog-content")[0].innerText == '学时记录出现异常请检查网络') {
                    location.reload()
                }
            }

        }, 5000)


        setInterval(function() {
            //播放视频
            videoPlay()
        }, 1000)

        rePlay()
        Music_No()
    }

    //课程学习页
    if (url == '/circleIndexRedirect.do') {

        function playVideo_2() {
            //切换到未完成的课程tab
            document.getElementsByClassName('customcur-tab-text')[1].click()

            //检测是否完成视频
            if(localStorage.getItem('videoIsDone') == 'true'){
                location.reload()
            }else{
                console.log("观看视频：", document.getElementsByClassName('course-title')[0].innerText)
            }

        }

        //首次进入，只执行一次
        function playVideo_1() {
            //切换到未完成的课程tab
            document.getElementsByClassName('customcur-tab-text')[1].click()

            //检测是否完成视频
            if(localStorage.getItem('videoIsDone') == null){
                alert('切换到课程学习页自动刷视频，请确保视频可以正常播放后在挂机，点击确定开始运行')
            }

            //循环
            setTimeout(function() {
                //点击第一个开始学习
                document.getElementsByClassName('golearn')[0].click()
            }, 1000)
        }

        //判断是否为试卷页面
        if (getQueryVariable('type') == 'exam') {
            var formDdata = {
                "circleId": cid,
                "syllabusId": sid,
            };
            $.ajax({
                type: "GET",
                url: 'circleIndex.do?action=getMyClass',
                data: formDdata,
                async: true,
                beforeSend: function() {
                    console.log('请等待...');
                },
                complete: function(XMLHttpRequest, status, errorThrown) {
                    console.log('获取完成...');
                },
                success: function(data) {
                    console.log('获取成功...');
                    console.log(data)
                    var dataJson = eval('(' + data + ')');
                    console.log(dataJson.result['list'][0].id)
                    setTimeout(function() {
                        var styleMap = {
                            "width": "100px",
                            display: "inline-block",
                            "background-color": "red",
                            cursor: "pointer",
                            "user-select": "none",
                            "border-radius": "4px",
                            color: "#fff",
                            "font-size": "10px",
                            "line-height": "30px",
                            "margin": "0px 30px",
                        };
                        var btn = document.createElement("a");
                        btn.innerHTML = "提前查看试卷";
                        for (let i in styleMap) {
                            btn.style[i] = styleMap[i];
                        }
                        btn.href =
                            '/myExamAndTestRedirect.do?action=toSeeExamResult&ct=&examId=' +
                            dataJson.result['list'][0].id
                        var toolbox = document.getElementsByClassName("item-title")[0]
                        toolbox.appendChild(btn);
                        alert('请点击试卷标题旁的按钮查看试卷')
                    }, 100)
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log('获取失败...');
                }
            });
        } else {



            setTimeout(function() {
                playVideo_1()
            }, 2000)

            setInterval(function() {
                playVideo_2()
            }, 5000)

            setTimeout(function() {
                localStorage.setItem('videoIsDone',false)
                location.reload()
            }, 1000 * 60 * 10)

        }

    }



})();

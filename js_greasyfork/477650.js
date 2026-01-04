// ==UserScript==
// @name        信趣邦助手-章节点击新版重构 - hxdi.cn
// @namespace   Violentmonkey Scripts
// @match       https://study.cp.hxdi.cn/*
// @grant       unsafeWindow
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @connect     api.jfbym.com
// @require     https://unpkg.com/axios/dist/axios.min.js
// @version     0.1.6
// @author      Hamburger
// @run-at       document-start
// @license MIT
// @description 信趣帮助手
// @downloadURL https://update.greasyfork.org/scripts/477650/%E4%BF%A1%E8%B6%A3%E9%82%A6%E5%8A%A9%E6%89%8B-%E7%AB%A0%E8%8A%82%E7%82%B9%E5%87%BB%E6%96%B0%E7%89%88%E9%87%8D%E6%9E%84%20-%20hxdicn.user.js
// @updateURL https://update.greasyfork.org/scripts/477650/%E4%BF%A1%E8%B6%A3%E9%82%A6%E5%8A%A9%E6%89%8B-%E7%AB%A0%E8%8A%82%E7%82%B9%E5%87%BB%E6%96%B0%E7%89%88%E9%87%8D%E6%9E%84%20-%20hxdicn.meta.js
// ==/UserScript==
class watcher {
    constructor(opts) {
        this.$data = this.getBaseType(opts.data) === 'Object' ? opts.data : {};
        this.$watch = this.getBaseType(opts.watch) === 'Object' ? opts.watch : {};
        for (let key in opts.data) {
            this.setData(key)
        }
    }
    getBaseType(target) {
        const typeStr = Object.prototype.toString.apply(target);

        return typeStr.slice(8, -1);
    }
    setData(_key) {
        Object.defineProperty(this, _key, {
            get: function() {
                return this.$data[_key];
            },
            set: function(val) {
                const oldVal = this.$data[_key];
                if (oldVal === val) return val;
                this.$data[_key] = val;
                this.$watch[_key] && typeof this.$watch[_key] === 'function' && (
                    this.$watch[_key].call(this, val, oldVal)
                );
                return val;
            },
        });
    }
}

//EventTarget.prototype.addEventListener=function (){console.log('我被劫持了')}
// let oldadd=EventTarget.prototype.addEventListener
// EventTarget.prototype.addEventListener=function (...args){
//     console.log('addEventListener',...args)
//     oldadd.call(this,...args)
// }

window.addEventListener("load", function() {
    console.log('信趣邦章节助手启动')
    let ty = 0
    var hrefList = window.location.href.split('/')
        // console.log(hrefList)
    if (hrefList[5] === "login") {
        if (GM_getValue("user_info") !== undefined) {
            console.log('有密码')
            let num_input1 = document.querySelectorAll(".el-input__inner")[2]
                // 给input元素赋值
            num_input1.value = GM_getValue("user_info").id

            let num_input2 = document.querySelectorAll(".el-input__inner")[3]
                // 给input元素赋值
            num_input2.value = GM_getValue("user_info").pwd
                // 创造事件
            var event1 = document.createEvent('HTMLEvents');
            event1.initEvent("input", true, true);
            event1.eventType = 'message';
            // 调度事件
            num_input1.dispatchEvent(event1);
            num_input2.dispatchEvent(event1);
        }
        var toTopBtn = document.createElement('button')
        toTopBtn.innerHTML = "记住密码"
        toTopBtn.className = "a-b-c-d-toTop"
        toTopBtn.onclick = function(e) {
            console.log('记住')
            let id = document.querySelectorAll(".el-input__inner")[2].value
            let pwd = document.querySelectorAll(".el-input__inner")[3].value
            GM_setValue("user_info", { "id": id, "pwd": pwd })
        }
        var body = document.body
        var style = document.createElement('style')
        style.id = "a-b-c-d-style"
        var css = `.a-b-c-d-toTop{
          position: fixed;
        bottom: 10%;
        right: 5%;
        width: 70px;
        height: 70px;
        border-radius: 50%;
        font-size: 10px;
        z-index: 999;
        cursor: pointer;
        font-size: 10px;
        overflow: hidden;
        }`
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        body.appendChild(toTopBtn)
        body.appendChild(style)
        console.log('填写验证码')
            // console.log(token)
        ty = -1
            // console.log(document.querySelector("canvas").toDataURL("image/png"))
        let base64 = document.querySelector("canvas").toDataURL("image/png").split(',')[1]
            // let data = {"ImageBase64":base64}
            // console.log(data.ImageBase64)
        GM_xmlhttpRequest({
            url: "http://36.134.86.146:6688/api.Common_VerificationCode",
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            data: JSON.stringify({ "ImageBase64": base64 }),
            onload: function(xhr) {
                // console.log(JSON.parse(xhr.responseText).result);
                // 首先获取input元素
                let num_input = document.querySelectorAll(".el-input__inner")[4]
                    // 给input元素赋值
                num_input.value = JSON.parse(xhr.responseText).result
                    // 创造事件
                var event = document.createEvent('HTMLEvents');
                event.initEvent("input", true, true);
                event.eventType = 'message';
                // 调度事件
                num_input.dispatchEvent(event);
            }
        });
    }
    if (hrefList[5] === "study" && hrefList.length === 6) {
        let test = {
            "target": {
                "value": "1",
                "tagName": "fake",
                "textContent": "1",
                "className": "number"
            }
        }
        var toTopBtn = document.createElement('button')
        var gotoPage = document.createElement('input')
        toTopBtn.innerHTML = "去往页面"
        toTopBtn.className = "a-b-c-d-toTop"
        gotoPage.className = "a-b-c-d-toTop1"
        toTopBtn.onclick = function(e) {
            console.log('去往')
            let input_num = document.querySelector('.a-b-c-d-toTop1').value
            console.log(Number(input_num))
            test.target.textContent = input_num
            document.querySelector('.number.active').parentElement.__vue__.onPagerClick(test)
        }
        var body = document.body
        var style = document.createElement('style')
        style.id = "a-b-c-d-style"
        var css = `.a-b-c-d-toTop{
        position: fixed;
        bottom: 7%;
        right: 13%;
        width: 55px;
        height: 55px;
        border-radius: 50%;
        font-size: 15px;
        z-index: 999;
        cursor: pointer;
        font-size: 15px;
        overflow: hidden;
        }
        .a-b-c-d-toTop1{
          position: fixed;
        bottom: 15%;
        right: 13%;
        width: 55px;
        height: 30px;
        border-radius: 5%;
        text-align:center;
        font-size: 18px;
        z-index: 999;
        font-size: 18px;
        overflow: hidden;
        background-color: #D3D3D3;
        color:white;
        }
        `
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        body.appendChild(gotoPage)
        body.appendChild(toTopBtn)
        body.appendChild(style)
    }
    // let token = -1
    // GM_xmlhttpRequest({
    //     url:"https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=kdmXiGtBYNLK2Uo0pFvzqRON&client_secret=YwRp8aOYvhkIELqYiAn6gCIF4VyEUS06",
    //     method :"POST",
    //     onload:function(xhr){
    //       // console.log(JSON.parse(xhr.responseText).access_token);
    //       token = JSON.parse(xhr.responseText).access_token
    //     }
    // });
    setInterval(function() {
        var hrefList = window.location.href.split('/')
            // console.log(hrefList)
        if (hrefList[5] === "login") {
            console.log('登录界面')
                // console.log(token)
            ty = -1
                // console.log(document.querySelector("canvas").toDataURL("image/png"))
            let base64 = document.querySelector("canvas").toDataURL("image/png").split(',')[1]
                // let data = {"ImageBase64":base64}
                // console.log(data.ImageBase64)
            GM_xmlhttpRequest({
                url: "http://36.134.86.146:6688/api.Common_VerificationCode",
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                data: JSON.stringify({ "ImageBase64": base64 }),
                onload: function(xhr) {
                    // console.log(JSON.parse(xhr.responseText).result);
                    // 首先获取input元素
                    let num_input = document.querySelectorAll(".el-input__inner")[4]
                        // 给input元素赋值
                    num_input.value = JSON.parse(xhr.responseText).result
                        // 创造事件
                    var event = document.createEvent('HTMLEvents');
                    event.initEvent("input", true, true);
                    event.eventType = 'message';
                    // 调度事件
                    num_input.dispatchEvent(event);
                }
            });
        }
        if (hrefList.length <= 6 & hrefList[5] !== "login") {
            console.log('学习界面')
            ty = 0
            wm.b = ty

        }
        // console.log(window.location.href.split('/')[6].split('?')[1].split('&'))
        if (hrefList[6].split('?')[0] === 'detail' & window.location.href.split('/')[6].split('?')[1].split('&').length < 2) {
            if (hrefList[5] === 'study') {
                console.log('课程页面')
                ty = 1
                wm.b = ty
                wm.c = window.location.href
            }
            if (hrefList[5] === 'study_map') {
                ty = 3
                wm.b = ty
                wm.c = window.location.href
            }
        }
        if (hrefList[6].split('?')[0] === 'detail' & window.location.href.split('/')[6].split('?')[1].split('&').length >= 2) {
            console.log('播放页面')
                // console.log(this.document.querySelector("video").parentNode.parentNode.parentNode.parentNode.parentNode.__vue__.PlayTimes)
            ty = 2
            wm.b = ty
            wm.c = window.location.href
            let playList = document.querySelectorAll(".pad20.radius5")
            let now_play = -1
            for (i = 0; i < playList.length; i++) {
                // console.log(playList[i].childNodes[2].textContent)
                if (playList[i].childNodes[2].textContent === '学习中') {
                    now_play = i
                }
            }
            // console.log('现在播放：'+ now_play)
            if (playList[now_play].childNodes[1].textContent === '100%') {
                console.log(now_play + '号播放完毕')
                let next_play = now_play + 1
                console.log(playList.length)
                if (next_play < playList.length) {
                    console.log('即将播放' + next_play)
                    playList[next_play].childNodes[2].click()
                } else {
                    window.alert('播放完毕')
                }
            }
        }
    }, 5000);
    // 快速检查
    // setInterval(function(){console.log()},1000)

    // 监控器
    let wm = new watcher({
        data: {
            b: ty,
            c: window.location.href
        },
        watch: {
            b(newVal, oldVal) {
                console.log("old ty = ", oldVal, ",new ty = ", newVal);
                if (ty === 1) {
                    if (document.querySelector(".el-progress-bar__innerText") !== null) {
                        // console.log('??？')
                        if (document.querySelector(".el-progress-bar__innerText").textContent !== '100%') {
                            document.querySelectorAll("button.width140px.el-button--primary")[0].click()
                        }
                    } else {
                        if (document.querySelector("button.el-button.width145px.size16.height48px.el-button--primary") !== null) {
                            document.querySelector("button.el-button.width145px.size16.height48px.el-button--primary").click()
                        } else {
                            document.querySelectorAll("button.width140px.el-button--primary")[0].click()
                        }
                    }

                }
                if (ty === 3) {
                    let page_ty = 0
                    let chapter_list = document.querySelectorAll('.flex.between.Conhover')
                    if (chapter_list.length === 0) {
                        page_ty = 1
                        chapter_list = document.querySelectorAll('.flex.Conhover')
                    }
                  console.log(page_ty)
                    if (page_ty === 0) {
                        // 遍历章节列表，获取章节列表中，完成进度不为100%的章节，点击进入
                        for (i = 0; i < chapter_list.length; i++) {
                            if (chapter_list[i].childNodes[2].textContent !== '100') {
                                chapter_list[i].childNodes[2].click()
                                    //进度为 0 的点击开始学习
                                if (chapter_list[i].childNodes[2].textContent === '0') {
                                    // 等待 0.5 秒，等待页面加载完成，然后点击开始学习
                                    setTimeout(function() {
                                        document.querySelectorAll('.el-button.el-button--primary')[1].click()
                                    }, 500)
                                } else {
                                    // 进度不为 0 的，点击继续学习
                                    // 等待 0.5 秒，等待页面加载完成，然后点击继续学习
                                    setTimeout(function() {
                                        document.querySelectorAll('.el-button.el-button--primary')[2].click()
                                    }, 500)
                                }
                            }
                        }
                    } else {
                        // 遍历章节列表，获取章节列表中，完成进度不为100%的章节，点击进入
                        // console.log(chapter_list)
                        for (i = 0; i < chapter_list.length; i++) {
                            if (chapter_list[i].childNodes[3].textContent !== '100%') {
                                chapter_list[i].childNodes[3].click()
                                    //进度为 0 的点击开始学习
                                if (chapter_list[i].childNodes[3].textContent === '0%') {
                                    // 等待 0.5 秒，等待页面加载完成，然后点击开始学习
                                    setTimeout(function() {
                                        document.querySelectorAll('.el-button.el-button--primary')[1].click()
                                    }, 500)
                                } else {
                                    // console.log(chapter_list[i].childNodes[3].textContent)
                                    // 进度不为 0 的，点击继续学习
                                    // 等待 0.5 秒，等待页面加载完成，然后点击继续学习
                                    setTimeout(function() {
                                        document.querySelectorAll('.el-button.el-button--primary')[2].click()
                                    }, 500)
                                }
                            }
                        }
                    }



                }
                if (ty === 2) {
                    console.log("加速")
                    document.querySelector("video").muted = true
                    document.querySelectorAll(".playbackrate")[0].textContent = '8 倍'
                    document.querySelector("video").play()
                    document.querySelector("video").playbackRate = 8
                        // 快速检查
                    setInterval(function() {
                        // 写一段代码，每隔一秒钟检查一下播放时间表里面是否有断点进行补全，先获取播放时间表
                        let timeList = this.document.querySelector("video").parentNode.parentNode.parentNode.parentNode.parentNode.__vue__.PlayTimes
                            // 检查上面获取的时间 list 中的时间数据是否为连续的秒数，如果不连续，就补全中间缺失的秒数
                        for (i = 0; i < timeList.length - 1; i++) {
                            if (timeList[i + 1] - timeList[i] > 1) {
                                // console.log("有缺失"+timeList)
                                for (j = 1; j < timeList[i + 1] - timeList[i]; j++) {
                                    // console.log(timeList[i] + j)
                                    timeList.splice(i + j, 0, timeList[i] + j)
                                }
                                // console.log("补全后"+timeList)
                            }
                        }
                        this.document.querySelector("video").parentNode.parentNode.parentNode.parentNode.parentNode.__vue__.PlayTimes = timeList

                    }, 1000)
                    setInterval(function() {
                        // 获取完整时间列表
                        let totalPlayTimes = this.document.querySelector("video").parentNode.parentNode.parentNode.parentNode.parentNode.__vue__.totalPlayTimes
                            // 用一个变量列表，存储缺失的时间段秒数
                        let lostTime = []
                            // 遍历完整时间列表，检查 ST 和 ET，上一单位的 ET 和下一单位的 ST 应当相差 1 ，如果不是，则把差的部分加入 lostTime 列表
                        for (i = 0; i < totalPlayTimes.length - 1; i++) {
                            if (totalPlayTimes[i + 1].ST - totalPlayTimes[i].ET > 1) {
                                // console.log("有缺失"+timeList)
                                for (j = 1; j < totalPlayTimes[i + 1].ST - totalPlayTimes[i].ET; j++) {
                                    // console.log(timeList[i] + j)
                                    lostTime.push(totalPlayTimes[i].ET + j)
                                }
                                // console.log("补全后"+timeList)
                            }
                        }
                        // 将 lostTime 列表中的时间段，添加到 PlayTimes 列表中
                        this.document.querySelector("video").parentNode.parentNode.parentNode.parentNode.parentNode.__vue__.PlayTimes = this.document.querySelector("video").parentNode.parentNode.parentNode.parentNode.parentNode.__vue__.PlayTimes.concat(lostTime)
                            // console.log('补完计划')

                    }, 10000)
                }
            },
            c(newVal, oldVal) {
                console.log("old url = ", oldVal, ",new url = ", newVal);
                if (ty === 1) {
                    if (document.querySelector(".el-progress-bar__innerText") !== null) {
                        // console.log('??？')
                        if (document.querySelector(".el-progress-bar__innerText").textContent !== '100%') {
                            document.querySelectorAll("button.width140px.el-button--primary")[0].click()
                        }
                    } else {
                        document.querySelectorAll("button.width140px.el-button--primary")[0].click()
                    }
                }
                if (ty === 2) {
                    console.log("加速")
                    document.querySelector("video").muted = true
                    document.querySelectorAll(".playbackrate")[0].textContent = '8 倍'
                    document.querySelector("video").play()
                    document.querySelector("video").playbackRate = 8
                        // 快速检查
                    setInterval(function() {
                            // 写一段代码，每隔一秒钟检查一下播放时间表里面是否有断点进行补全，先获取播放时间表
                            let timeList = this.document.querySelector("video").parentNode.parentNode.parentNode.parentNode.parentNode.__vue__.PlayTimes
                                // 检查上面获取的时间 list 中的时间数据是否为连续的秒数，如果不连续，就补全中间缺失的秒数
                            for (i = 0; i < timeList.length - 1; i++) {
                                if (timeList[i + 1] - timeList[i] > 1) {
                                    // console.log("有缺失"+timeList)
                                    for (j = 1; j < timeList[i + 1] - timeList[i]; j++) {
                                        // console.log(timeList[i] + j)
                                        timeList.splice(i + j, 0, timeList[i] + j)
                                    }
                                    // console.log("补全后"+timeList)
                                }
                            }
                            this.document.querySelector("video").parentNode.parentNode.parentNode.parentNode.parentNode.__vue__.PlayTimes = timeList

                        }, 1000)
                        // 慢速检查，检查 totalPlayTimes列表，里面的列表的 ST 和 ET，上一单位的 ET 和下一单位的 ST 应当相差 1 ，如果不是，则把差的部分，调用接口补全，接口调用方式类似：
                        //            this.$ajax.post("Study/Course_StudyTimeRecord", {
                        //             ...this.$route.query,
                        //             PlayTimes: this.PlayTimes.join(","),
                        //             isEnd: this.isEnd,
                        //             LastDuration: t,
                        //             StudyTime: this.StudyTime
                        //     }).then(() => {
                        //     this.list = this.chapterList.map((t, e) => ({
                        //             ...t,
                        //             open: t.Chapters.find(t => t.ID == this.$route.query.ZJID)
                        //         })),
                        //         this.StudyTime = 0
                        // })
                    setInterval(function() {
                        // 获取完整时间列表
                        let totalPlayTimes = this.document.querySelector("video").parentNode.parentNode.parentNode.parentNode.parentNode.__vue__.totalPlayTimes
                            // 用一个变量列表，存储缺失的时间段秒数
                        let lostTime = []
                            // 遍历完整时间列表，检查 ST 和 ET，上一单位的 ET 和下一单位的 ST 应当相差 1 ，如果不是，则把差的部分加入 lostTime 列表
                        for (i = 0; i < totalPlayTimes.length - 1; i++) {
                            if (totalPlayTimes[i + 1].ST - totalPlayTimes[i].ET > 1) {
                                // console.log("有缺失"+timeList)
                                for (j = 1; j < totalPlayTimes[i + 1].ST - totalPlayTimes[i].ET; j++) {
                                    // console.log(timeList[i] + j)
                                    lostTime.push(totalPlayTimes[i].ET + j)
                                }
                                // console.log("补全后"+timeList)
                            }
                        }
                        // 将 lostTime 列表中的时间段，添加到 PlayTimes 列表中
                        this.document.querySelector("video").parentNode.parentNode.parentNode.parentNode.parentNode.__vue__.PlayTimes = this.document.querySelector("video").parentNode.parentNode.parentNode.parentNode.parentNode.__vue__.PlayTimes.concat(lostTime)
                            // console.log('补完计划')

                    }, 10000)
                }
            }
        }
    })

}, false);
// ==UserScript==
// @name         2025年暑期教师研修|国家智慧教育公共服务平台|国家中小学智慧教育平台|自动刷视频
// @namespace    http://tampermonkey.net/
// @version      2025.07.20
// @description  国家智慧教育公共服务平台（国家中小学智慧教育平台）自动刷视频！！！
// @author       yygdz1921
// @match        https://www.smartedu.cn/*
// @match        https://basic.smartedu.cn/*
// @match        https://smartedu.gdtextbook.com/education/*
// @match        https://teacher.ykt.eduyun.cn/pdfjs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.4/dist/sweetalert2.all.min.js
// @resource     css https://fastly.jsdelivr.net/npm/sweetalert2@11.12.4/dist/sweetalert2.min.css
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       window-load
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470207/2025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/470207/2025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    // 引入第三方库https://github.com/sweetalert2/sweetalert2/
    GM_addStyle(GM_getResourceText("css"));
    // 弹窗函数
    function msg(txt, ms = 3000) {
        Swal.fire({
            html: txt,
            position: "center",
            icon: "success",
            showConfirmButton: false,
            timer: ms,
            timerProgressBar: true,
        })
    }
    var log = console.log;
    // 课程
    var course_name = "2025年暑期教师研修";
    var home = "https://basic.smartedu.cn/training/2025sqpx";
    var course_url = [
        // 大力弘扬教育家精神
        "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=cb134d8b-ebe5-4953-8c2c-10d27b45b8dc&tag=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
        // 数字素养提升
        "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0bc83fd8-4ee9-4bb2-bf9d-f858ee13ed8f&tag=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
        // 科学素养提升
        "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=d21a7e80-cbb4-492a-9625-d8ea8f844515&tag=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
        // 心理健康教育能力提升
        "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=e6a702f8-552d-49f6-89e7-b40ce5e445af&tag=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
        // 学前教育专题培训
        "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=895caa6f-6c42-411d-ab7c-2b43facebd9f&tag=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
        // 实验室安全管理
        "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=e3b6492d-bc7c-4440-ab5e-8d02debd8ceb&tag=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
        // 科创劳动教育的实践路径
        "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=1034859d-512f-4696-999d-e736456a75af&tag=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
        // 特教教师课堂教学专题培训
        "https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=c5d0f0a7-9047-496e-bb03-e37ea5e65dd7&tag=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2025%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
    ]
    // 上述配置的课程，分别学习多少课时（看多少个视频），因为认定学时有限，每个课程不用刷完！！！
    // 配置-1为学完当前课程的所有视频
    var lessons = [10, 7, 2, 5, 17, 1, 1, 1];

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 刷课代码
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let g_headers = {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "sdp-app-id": null,
        "Authorization": null
    }
    let g_user_id = null;
    let g_fulls_json = null;
    // 保存原始的 XMLHttpRequest
    const originalXMLHttpRequest = unsafeWindow.XMLHttpRequest;
    // 重写 XMLHttpRequest
    unsafeWindow.XMLHttpRequest = function () {
        const xhr = new originalXMLHttpRequest();

        // 保存原始的 open、send 和 setRequestHeader 方法
        const originalOpen = xhr.open;
        const originalSend = xhr.send;
        const originalSetRequestHeader = xhr.setRequestHeader;

        // 重写 open 方法
        xhr.open = function (method, url, async, user, password) {
            this._method = method;
            this._url = url;

            return originalOpen.apply(this, arguments);
        };

        // 重写 setRequestHeader 方法
        xhr.setRequestHeader = function (header, value) {
            // 保存headers
            this._headers = this._headers || {};
            this._headers[header] = value;
            // 保存token
            if (header in ["sdp-app-id", "Authorization"]) {
                g_headers[header] = value;
            }

            return originalSetRequestHeader.apply(this, arguments);
        };

        // 重写 send 方法
        xhr.send = function (data) {
            // 监听 readyState 的变化
            this.addEventListener('readystatechange', function () {
                if (this.readyState === 4) { // 请求完成
                    // 处理响应数据
                    if (this._url && this._url.includes('fulls.json')) { // 根据需要修改 URL 条件
                        try {
                            g_fulls_json = JSON.parse(this.responseText);

                        } catch (e) {
                            console.warn('fulls.json获取失败：', e);
                        }
                    }
                }
            });

            return originalSend.apply(this, arguments);
        };

        return xhr;
    };

    function get_user_id() {
        if (g_user_id) {
            return g_user_id;
        }

        let user = JSON.parse(localStorage.getItem("X-EDU-WEB-USER"));
        g_user_id = user.user_id;
        return g_user_id;
    }

    function get_fulls_json() {
        return g_fulls_json;
    }

    function processNode(node) {
        if (node.child_nodes && node.child_nodes.length > 0) {
            // 如果有子节点，递归处理
            for (const cnode of node.child_nodes) {
                processNode(cnode);
            }
        } else {
            let fulls_json = get_fulls_json();
            // 最深层节点，进行请求操作
            let vid = node.relations.activity.activity_resources[0].resource_id;
            let position = node.relations.activity.study_time;
            console.log(`【${fulls_json.activity_set_name}】【${node.node_name}】【${node.node_name}】【${vid}】`);
            try {
                let method = "PUT";
                let url = "https://x-study-record-api.ykt.eduyun.cn/v1/resource_learning_positions/"
                + vid + "/" + get_user_id();
                // 创建xhr请求
                const xhr = new originalXMLHttpRequest();
                xhr.open(method, url, true);
                // 设置headers
                for (const key in g_headers) {
                    xhr.setRequestHeader(key, g_headers[key]);
                }
                xhr.onload = function () {
                    if (xhr.status === 200 || xhr.status === 201) {
                        console.log('响应成功:', xhr.responseText);
                    } else {
                        console.error('请求失败:', xhr.status);
                    }
                };
                // 篡改视频进度
                xhr.send(JSON.stringify({"position": position - 5}));
            } catch (e) {
                console.log("秒过失败：", e);
            }
        }
    }

    function fake_xhr() {
        let fulls_json = get_fulls_json();
        console.log("fake_xhr", fulls_json);
        for (const node of fulls_json.nodes) {
            processNode(node);
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 挂机代码
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    function next() {
        var href = window.location.href;
        var index = course_url.indexOf(href);
        if (index > -1) {
            if (index + 1 < course_url.length) {
                window.location.href = course_url[index + 1];
            } else {
                window.location.href = home;
            }
        } else {
            window.location.href = course_url[0];
        }
    }

    function click(auto_next = true) {
        // 判读是否满足学时要求
        if (lessons) {
            var href = window.location.href;
            var index = course_url.indexOf(href);
            var lesson = lessons[index];
            if (lesson != undefined && lesson != -1) {
                let headers = document.getElementsByClassName("fish-collapse-header");
                for (let i = 0; i < headers.length; i++) {
                    let header = headers[i];
                    header.click();
                }
                let finish = document.getElementsByClassName("iconfont icon_checkbox_fill");
                log(`当前页面已经学完【${finish.length}】个视频，学时要求为【${lesson}】个视频，是否达标：${finish.length >= lesson}`);
                if (finish.length >= lesson) {
                    next();
                }
            }
        }
        var icon = null;
        function find_icon() {
            // 进行中
            icon = document.getElementsByClassName("iconfont icon_processing_fill")[0];
            // 未开始
            if (!icon) {
                icon = document.getElementsByClassName("iconfont icon_checkbox_linear")[0];
            }
        }
        // 查找默认列表
        find_icon();
        // 展开其他列表
        if (!icon) {
            let headers = document.getElementsByClassName("fish-collapse-header");
            for (let i = 0; i < headers.length; i++) {
                let header = headers[i];
                header.click();
                find_icon();
                if (icon) {
                    break;
                }
            }
        }
        // 有没学完的
        if (icon) {
            icon.click();
        } else {
            if (auto_next) {
                next();
            } else {
                Swal.fire("当前页面所有视频已经播放完！", "", "success");
            }
        }
    }


    function play(v = null) {
        if (!v) {
            v = document.getElementsByTagName("video")[0];
        }
        if (v) {
            //v.dispatchEvent(new Event("ended"));
            v.muted = true;
            //v.playbackRate = 2;
            v.play();
            //v.currentTime = v.duration;
        }
        log(`play: v==>${v}`);
        // 关闭提示（必须完整看完整个视频才可以获得该视频的学时。）
        let btn = document.getElementsByClassName("fish-btn fish-btn-primary")[0];
        if (btn && btn.innerText.includes("知道了")) {
            btn.click();
            log(`关闭提示: btn==>${btn}`);
        }
    }

    var pageNumber = null;
    var pageCount = null;
    function read() {
        log(`PDF文档阅读: pageNumber==>${pageNumber}, pageCount==>${pageCount}`);
        let btn = document.getElementById("next");
        if (btn) {
            btn.click();
        } else {
            log("PDF文档翻页按钮为空！");
        }
        if (pageCount) {
            var pc = pageCount;
            // 最后一页
            log("PDF文档跳到最后一页:", pc);
            window.postMessage({
                type: "pdfPlayerPageChangeing",
                data: {
                    pageNumber: pc,
                    pageCount: pc,
                }
            }, "*");
            // 第一页
            setTimeout(function () {
                log("PDF文档跳到第一页...");
                window.postMessage({
                    type: "pdfPlayerPageChangeing",
                    data: {
                        pageNumber: 1,
                        pageCount: pc,
                    }
                }, "*");
            }, 1000);
            // 重置
            pageCount = null;
        }
    }

    // 答题
    function answer() {
        let count = 0;
        const intervalId = setInterval(() => {
            log("自动答题检测...");
            // 选A
            var a = document.getElementsByClassName("nqti-check")[0];
            if (a) {
                a.click();
                // 下一题、确定
                for (let i = 0; i < 2; i++) {
                    var btn = document.querySelector("div.index-module_footer_3r1Yy > button");
                    if (btn) {
                        btn.click();
                    }
                }
            }
            count++;
            if (count === 3) {
                clearInterval(intervalId);
            }
        }, 1000);
    }


    // 广东特色
    function gd_class() {
        let ms = 10000;
        msg("欢迎进入“2024年广东暑期教师研修”专题。", ms = ms);
        let tid = setInterval(function() {
            let all_finish = true;
            let flags = document.getElementsByClassName("flag");
            for(let i = 0; i < flags.length; i++){
                let flag = flags[i];
                let display = flag.getElementsByClassName("icon-finish inline-block")[0].style.display
                if (display === "none"){
                    all_finish = false;
                    let v = document.getElementsByTagName("video")[0];
                    if (v) {
                        flag.click();
                        setTimeout(function(){
                            v = document.getElementsByTagName("video")[0];
                            if (v){
                                //v.playbackRate = 16;
                                //v.play();
                                v.currentTime = v.duration;
                            }
                        }, 3000);
                    }
                    break;
                }
            }
            if(all_finish){
                clearInterval(tid);
                msg("“2024年广东暑期教师研修”专题已学习完毕！", ms = ms * 10);
            }
            else {
                let p = document.getElementsByClassName("el-progress__text")[0].innerText;
                msg(`挂机中，当前进度【${p}】`, ms = ms);
            }
        }, ms);
    }

    function main() {
        log("main...");
        // 等待页面加载，延时开始
        var delay = 1000 * 10;
        var href = window.location.href;
        // 刷视频
        var tick = 0;
        var watch = function(){
            var f = function(){
                console.log(`tick[${String(++tick).padStart(9, "0")}]`);
                click();
                play();
                read();
                answer();
            };
            const tid = setInterval(f, delay);
            Swal.fire({
                title: '准备开始',
                text: `等待网页资源加载, 约【${delay / 1000}】秒后开始自动播放视频`,
                timer: delay,
                timerProgressBar: true, // 显示倒计时进度条
                showConfirmButton: true,
                confirmButtonText: '马上开始',
                confirmButtonColor: "green",
                showCancelButton: true,
                cancelButtonText: '直接退出',
                showDenyButton: false,
                denyButtonText: '【不要点我】！！！',
                allowOutsideClick: () => !Swal.isLoading() // 点击外部是否关闭提示框
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    console.log("确定==========================================>");
                    f();
                } else if (result.isDenied) {
                    console.log("拒绝==========================================>");
                    fake_xhr();
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    clearInterval(tid);
                }
            });
        }
        // 菜单
        if (course_url.includes(href)) {
            log("刷课处理");
            watch();
        } else if (href.includes(`https://smartedu.gdtextbook.com/education/`)) {
            log(`“2024年广东暑期教师研修”专题iframe的跨域处理`);
        } else if (href.includes(`https://teacher.ykt.eduyun.cn/pdfjs/`)){
            log(`PDF处理`);
            setInterval(read, delay);
        }
        else {
            Swal.fire({
                //background: "#url(https://baotangguo.cn:8081/)",
                icon: "warning",
                title: "开始刷视频？",
                //text: "好好学习，天天向上！",
                /*
                html: `<button id="myButton1" class="swal2-confirm swal2-styled" style="width: 450px;">国家中小学智慧教育平台应用专项培训<br>(“2024年广东暑期教师研修”专题)<br>进入视频播放页后按键盘【G】</button>`,
                willOpen: () => {
                    // 添加事件监听器
                    const button1 = Swal.getHtmlContainer().querySelector('#myButton1');
                    button1.addEventListener("click", () => {
                        Swal.fire(`进入视频播放页后按键盘【G】`);
                    });
                },
                */
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonColor: "green",
                confirmButtonText: `<div style="width: 450px;">刷脚本配置的课程，当前为：<br><b>${course_name}</b></div>`,
                denyButtonColor: "blue",
                denyButtonText: '<div style="width: 450px;">只刷当前页的视频</div>',
                cancelButtonColor: "red",
                cancelButtonText: '<div style="width: 450px;">退出</div>',
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    msg("走你~");
                    next();
                } else if (result.isDenied) {
                    watch();
                }
            })
        }
    }


    if (document.readyState === "complete") {
        // DOM 已经加载完成
        main();
    } else {
        // DOM 还未加载完成
        window.addEventListener("load", main);
    }
    document.addEventListener("keydown", function (event) {
        log("keydown", event.code);
        if (event.code === "KeyG") {
            //gd_class();
            msg(`<div style="color:red; font-weight:bold;">不要按这个键！！！<br>不要按这个键！！！<br>不要按这个键！！！</div>`, 6 * 1000);
            fake_xhr();
        } else if (event.code === "KeyT") {
            msg("测试");
        }
    });
    window.addEventListener("message", function (event) {
        log("message", event);
        var data = event.data;
        log("data.type==>", data.type);
        if (data.type === "pdfPlayerInitPage") {
            pageNumber = data.data.pageNumber;
            pageCount = data.data.pageCount;
            log(`PDF文档初始化: pageNumber==>${pageNumber}, pageCount==>${pageCount}`);
        }
    });
})();

// ==UserScript==
// @name         🥇【好医生小助手】无人值守|自动静音|视频助手|考试助手|解禁调试
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  ❌倍速播放✅屏蔽广告✅解禁调试✅视频助手✅考试助手(遍历试错)✅双模选择：只看不考、全看遂考🚑如果你想对脚本表示肯定或意见，可以通过赞赏码备注；如果要与我反复交流，则需移步到下载本脚本的页面，在“反馈”区留下意见或直接私信我。
// @author       境界程序员
// @license      AGPL License
// @match        https://www.cmechina.net/cme/*
// @match        https://www.cmechina.net/cme/exam.jsp*
// @match        https://www.cmechina.net/cme/examQuizFail*
// @match        https://www.cmechina.net/cme/examQuizPass*
// @match        https://www.cmechina.net/cme/course.jsp?course_id*
// @match        https://www.cmechina.net/pub/tongzhi.jsp*
// @match        https://www.cmechina.net/webcam/ewmface2.jsp*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @grant        unsafeWindow
// @antifeature  Donate听说含捐赠功能需要添加此代码（无任何作用）
// @downloadURL https://update.greasyfork.org/scripts/500010/%F0%9F%A5%87%E3%80%90%E5%A5%BD%E5%8C%BB%E7%94%9F%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%91%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%7C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%7C%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%7C%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%7C%E8%A7%A3%E7%A6%81%E8%B0%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/500010/%F0%9F%A5%87%E3%80%90%E5%A5%BD%E5%8C%BB%E7%94%9F%E5%B0%8F%E5%8A%A9%E6%89%8B%E3%80%91%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%7C%E8%87%AA%E5%8A%A8%E9%9D%99%E9%9F%B3%7C%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%7C%E8%80%83%E8%AF%95%E5%8A%A9%E6%89%8B%7C%E8%A7%A3%E7%A6%81%E8%B0%83%E8%AF%95.meta.js
// ==/UserScript==

var newupdate = "2024.9.19屏蔽签到。也许有人好奇怎么没更新了，在忙工作忙论文……(꒦_꒦) )自动考试功能暂时取消";

//更新历史
//■2024.9.19去掉了签到的定时器
//■2024.7.23修改答题逻辑并增加多选题
//■2024.7.8放大人脸识别二维码，方便用户扫描，并提示二维码过期
//■2024.5.31根据平台要求修改答题逻辑
//■2023.12.1创建脚本，支持视频学习及自动考试


(function () {

    var url = window.location.href;
    advis();//广告和操作平台
    if (url.indexOf("https://www.cmechina.net/cme/polyv") != -1 || url.indexOf("https://www.cmechina.net/cme/study2.jsp") != -1) {
        console.log("进入好医生课程");

        window.onload = function () {
            // 移除右键菜单禁用
            document.oncontextmenu = null;

            // 移除F12禁用
            document.onkeydown = null;
            document.onkeyup = null;
            document.onkeypress = null;
            var infoold = console.info;//保存以前的console.info以防万一
            console.info = function () { };//禁止提示错误信息
            console.clear = function () { };//禁止清空控制台


            try {
                var kecheng = document.querySelector("ul[id='s_r_ml']").querySelectorAll("li");
            } catch (e) {
                var kecheng = document.querySelector("ul[id='s_r_ml']").querySelectorAll("li");
            };

            let i = 0;
            while (i < kecheng.length) {
                if (kecheng[i].outerText.includes("未学习") == true && kecheng[i].className != "active") {
                    console.log(kecheng[i].outerText.replace("未学习", ""));
                    window.s2j_onPlayerInitOver = function () {//PV视频加载完毕
                        setTimeout(function () {
                            try {
                                //document.querySelector("video").muted = true;
                                cc_js_Player.play();
                                cc_js_Player.setVolume(0);
                                console.log("运行了这个事件");
                            } catch (error) {
                                document.querySelector("video").play();//传统意义找播放器播放视频
                                document.querySelector("video").muted = true;
                            };
                        }, 1000);//延迟1秒操作，为网页留点时间
                    };

                    setTimeout(function () {
                        setInterval(function () {
                            counttime();
                        }, 10000);
                        kecheng[i].querySelector("a").click();//点击第一个没有播放的视频
                    }, 4000);//延迟4秒，避免网页还没打开
                    break;
                } else if (kecheng[i].outerText.includes("未学习") == true && kecheng[i].className == "active") {
                    console.log(kecheng[i].outerText.replace("未学习", ""));
                    //document.querySelector("video[class='pv-video']").play();//播放视频
                    //document.querySelector("video").play();//播放视频
                    cc_js_Player.play();
                    setTimeout(function () {
                        cc_js_Player.setVolume(0);
                        // document.querySelector("video").muted = true;
                        // document.querySelector("video").volume = 0;
                    }, 300);
                    setInterval(function () {
                        counttime();
                    }, 10000);
                    break;
                };
                //clearInterval(intervalid);
                if (i == kecheng.length - 1) {

                    if (localStorage.getItem("mode") == "2") {
                        setTimeout(function () {
                            document.querySelector("a[class='cur']").click();
                        }, 2000);
                    } else {
                        alert("已经完成全部学习，请自行考试");
                    };

                };
                i++;
            };

            function counttime() {
                clearInterval(intervalPause);//第一招：去掉签到定时器
                pauseSecond = -1;//第二招：去掉签到定时器
                function openPause() { };//第三招：清空弹出签到的功能
                var currenttime = parseInt(cc_js_Player.getPosition());
                var duration = parseInt(cc_js_Player.getDuration());
                var percent = ((currenttime / duration) * 100).toFixed(2) + "%";
                if (currenttime == duration) {
                    console.log("已播放" + percent);
                    location.reload();
                } else {
                    console.log("已播放" + percent);
                    cc_js_Player.play();
                    cc_js_Player.setVolume(0);
                    document.title = "【" + percent + "】" + $("a[class='active']").text();
                    // document.querySelector("video").play();//播放视频
                    // document.querySelector("video").muted = true;
                    // document.querySelector("video").volume = 0;
                };
            };
        };
    } else if (url.indexOf("https://www.cmechina.net/cme/exam.jsp不允许考试") != -1) {
        //这里是考试页面
        let timu = document.querySelectorAll("li");//获取全部考题和选项
        var cishu = localStorage.getItem("cishu");
        var answer = localStorage.getItem("Answer");
        console.log("提取的答案" + answer);
        console.log("次数：" + cishu)

        var i = 0;//用于遍历题号
        var j = 0;//用于遍历选项

        while (i < timu.length) {
            if (answer === null) {
                if (document.querySelectorAll("li")[i].innerText.indexOf("多选") != -1) {//如果是多选题，则全选（虽然不完美）
                    document.querySelectorAll("li")[i].querySelectorAll("input[type='checkbox']").forEach(function (checkbox) { checkbox.checked = true; });
                } else {
                    document.querySelectorAll("li")[i].querySelectorAll("input[type='radio']")[0].click();//如果是空的，那么全部选A
                    localStorage.setItem("cishu", 1);//恢复第一次作答
                };
            } else {
                answer = answer.toString().split(",");
                if (document.querySelectorAll("li")[i].innerText.indexOf("多选") != -1) {//如果是多选题，则全选（虽然不完美）
                    document.querySelectorAll("li")[i].querySelectorAll("input[type='checkbox']").forEach(function (checkbox) { checkbox.checked = true; });
                } else {
                    try {
                        document.querySelectorAll("li")[i].querySelectorAll("input[type='radio']")[thxx(answer[j])].click();//如果不是多选
                    } catch (error) {
                        document.querySelectorAll("li")[i].querySelectorAll("input[type='radio']")[0].click();//如果答案没有E，会出现错误，错误的话重新选A
                    };
                };
                localStorage.setItem("cishu", parseInt(cishu) + 1);//恢复第一次作答
            };
            i++;
            j++;
            if (cishu > 5) {
                cleanKeyStorage();//次数大于说明题目乱了，要重新从A开始选择
                localStorage.setItem("cishu", 1);//恢复第一次作答
            };
        };

        setTimeout(function () {
            document.querySelector("a[id='tjkj']").click();//提交答案按钮
        }, 500);


    } else if (url.indexOf("https://www.cmechina.net/cme/examQuizFail不允许考试") != -1) {
        //答题失败了

        const extractedList = url.match(/error_order=([0-9,]+)/)[1].split(",");//错题列表
        console.log("错题题号" + extractedList); // 输出: ["1", "2", "4", "5"]
        const ansList = url.match(/ansList=([^&]+)/)[1].split(",");//答案列表
        console.log("原本的答案" + ansList)//输出["A","B","C","D","E"]全部题目答案
        var i = 0;
        while (i < extractedList.length) {
            ansList[parseInt(extractedList[i]) - 1] = fthxx(parseInt(thxx(ansList[parseInt(extractedList[i]) - 1])) + 1);//将错题A转换为数字1，代表待会儿选B
            i++;
        };
        localStorage.setItem("Answer", ansList);//存储答案
        console.log("存储的答案" + ansList);

        setTimeout(function () {
            document.querySelector("a[id='cxdt']").click();//重新答题
        }, 500);

    } else if (url.indexOf("https://www.cmechina.net/cme/examQuizPass") != -1) {
        //答题成功
        cleanKeyStorage();
        setTimeout(function () {
            document.querySelector("div[class='show_exam_btns']").querySelector("a").click();//调到下一个章节的考试
        }, 2000);
    } else if (url.indexOf("https://www.cmechina.net/cme/course.jsp?course_id") != -1) {

        try {
            document.querySelector("i[class='fa fa-circle-o']").click()//课程页面点击未学习的进入
        } catch (error) {
            if (localStorage.getItem("mode") == "2") {
                document.querySelector("i[class='fa fa-adjust']").click();//课程页面点击要考试的进入
            };

        };

    } else if (url.indexOf("https://www.cmechina.net/pub/tongzhi.jsp") != -1) {
        //网站的广告通知，直接给他点掉。
        setTimeout(function () {
            try {
                document.querySelector("a[class='newBtn']").click();
            } catch (error) {
                console.log("没有找到推广通知");
            };
        }, 1000);
    } else if (url.indexOf("https://www.cmechina.net/cme/index.jsp") != -1) {
        setTimeout(function () {
            try {
                document.querySelector("div[class='close2']").click();
            } catch (error) {
                console.log("没有找到首页广告");
            };
        }, 1000);
    } else if (url.indexOf("https://www.cmechina.net/webcam/ewmface2.jsp") != -1) {
        console.log("二维码页面");
        var code = setInterval(function () {
            document.querySelector("div[id='wx_pay_ewm']").querySelector("canvas").style = "position:relative;left:-60px;top:-100px;height:300px;width:300px";
            if (document.querySelector("div[id='wx_pay_ewm']").querySelector("canvas").style["height"] == "300px") {
                clearInterval(code);
            };
        }, 100);
        setTimeout(function () {
            let nihao = document.createElement("div");
            nihao.innerText = "二维码已失效，点此刷新";
            nihao.style = "position:relative;top:-270px;left:-35px;width:250px;font-size:22px;text-align:left;color: #ff0000;font-weight: bold;background-color: #FFFFFF"
            document.querySelector("div[id='wx_pay_ewm']").querySelector("canvas").parentNode.append(nihao);
            nihao.onclick = function () {
                location.reload();
            };
        }, 60000);
    };

    //---------------------------------全局函数区------------------------------//

    function thxx(xx) {
        switch (xx) {
            case "A":
                xx = 0;
                break;
            case "B":
                xx = 1;
                break;
            case "C":
                xx = 2;
                break;
            case "D":
                xx = 3;
                break;
            case "E":
                xx = 4;
                break;
        };
        return xx;
    };

    function fthxx(xx) {
        switch (xx) {
            case 0:
                xx = "A";
                break;
            case 1:
                xx = "B";
                break;
            case 2:
                xx = "C";
                break;
            case 3:
                xx = "D";
                break;
            case 4:
                xx = "E";
                break;
        };
        return xx;
    };

    function cleanKeyStorage() {//缓存清理
        localStorage.removeItem("cishu");
        localStorage.removeItem("Answer");
    };

    function advis() {
        let div1 = document.createElement("div");
        let div2 = document.createElement("div");
        div1.innerHTML = `
    <div id='Div1' style="max-width:220px;text-align:left;padding: 10px 10px;font-size: 20px;float: left;position:fixed;top:180px;left: 10px;z-index: 99999; background-color: rgba(184, 247, 255, 0.7); overflow-x: auto;">
    <span id='clo' style="float: right;position: absolute;top:14px;right:5px;cursor:pointer;font-size:16px">❎</span>
    <div style="font-size:22px;font-weight:bold;color:red;">好医生小助手`+ GM_info['script']['version'] + `</div> 
    <hr style="margin-top: 10px;margin-bottom: 10px;">
    <a id='Autocourse' class="btn btn-default">★只看不考</a><br>
    <a id='Joincourse' class="btn btn-default">★全看遂考</a><br><br>
    
    <span style="font-size:18px;font-weight:bold;color:black;">其他脚本</span><br>
    <a id='Share1' class="btn btn-default" style="font-size:16px;font-weight:bold;color:red;">👉&nbsp华医网小助手</a><br>
    <a id='Share2' class="btn btn-default" style="font-size:16px;font-weight:bold;color:red;">👉&nbsp成都继教医学教育平台</a><br>
    <a class='spe' style="font-size:16px;font-weight:normal;color:black;white-space:pre-wrap;">😁</a>
    <a id='update' class='spe' style="font-size:14px;font-weight:normal;color:black;white-space:pre-wrap;">最近更新:<br>`+ newupdate + `</a><br>
    </div> `;

        div2.innerHTML = `
    <div id='Div2' style = "padding: 10px 10px;font-size: 20px;float: left;position:fixed;top:180px;left: 240px;z-index: 99999; background-color: rgba(184, 247, 255, 0.7); overflow-x: auto;" >
    <img id="Pic" style = "width:auto;height:200px;object-fit: contain;" src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAE4CAMAAACaIvF3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDkuMC1jMDAwIDc5LjE3MWMyN2ZhYiwgMjAyMi8wOC8xNi0yMjozNTo0MSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDI0LjAgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc0RDAxMzcwMkQ5MTExRUY5RUJCQzhENDNFRDIwOTVBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjc0RDAxMzcxMkQ5MTExRUY5RUJCQzhENDNFRDIwOTVBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzREMDEzNkUyRDkxMTFFRjlFQkJDOEQ0M0VEMjA5NUEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzREMDEzNkYyRDkxMTFFRjlFQkJDOEQ0M0VEMjA5NUEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz412vnuAAADAFBMVEXp09zM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';>
    
    </div> `;
        //<input type="text" id="token" style="width: 130px;" value="`+ GM_getValue("tikutoken") + `"></input>
        // <a id='Getlicense' class="btn btn-default">★获取授权</a>
        document.body.append(div1, div2);
        document.getElementById("Pic").style.height = document.querySelector("div[id='Div1']").offsetHeight - 20 + "px";//因为虚化上下各10px
        let mode1 = document.querySelector("a[id='Autocourse']");
        let mode2 = document.querySelector("a[id='Joincourse']");
        let share1 = document.querySelector("a[id='Share1']");
        let share2 = document.querySelector("a[id='Share2']");
        if (localStorage.getItem("mode") == "" || localStorage.getItem("mode") == "1") {
            mode1.innerHTML = "★只看不考 ✅";

        } else {
            mode2.innerHTML = "★全看遂考 ✅";

        };
        mode1.onclick = function () {
            if (mode1.innerHTML === "★只看不考") {
                mode1.innerHTML = "★只看不考 ✅";
                mode2.innerHTML = "★全看遂考";
                localStorage.setItem("mode", "1");
            };
        };
        mode2.onclick = function () {
            if (mode2.innerHTML === "★全看遂考") {
                mode1.innerHTML = "★只看不考";
                mode2.innerHTML = "★全看遂考 ✅";
                localStorage.setItem("mode", "2");
            };
        };
        share1.onclick = function () {
            window.open("https://greasyfork.org/zh-CN/scripts/483418", "_blank")
        };
        share2.onclick = function () {
            window.open("https://greasyfork.org/zh-CN/scripts/494635", "_blank")
        };
        clo.onclick = function () {
            document.querySelector("div[id='Div1']").style.display = "none";
            document.querySelector("div[id='Div2']").style.display = "none";
        };


    };
    //---------------------------------全局函数区end------------------------------//

})();
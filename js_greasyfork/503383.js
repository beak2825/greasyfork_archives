// ==UserScript==
// @name         学习（测试）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  辅助学习
// @author       
// @license MIT
// @match        https://gbpx.gd.gov.cn/*
// @match        https://*.shawcoder.xyz/*
// @grant        unsafeWindow
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/503383/%E5%AD%A6%E4%B9%A0%EF%BC%88%E6%B5%8B%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/503383/%E5%AD%A6%E4%B9%A0%EF%BC%88%E6%B5%8B%E8%AF%95%EF%BC%89.meta.js
// ==/UserScript==


const AUTO_REFRESH_TIME = 200;
var new_window;

'use strict';

//取消alert弹窗
//测试无效。学习页面的alert弹窗为页面自带，无法通过脚本跳过
unsafeWindow.alert = function(){return false};
window.alert = function(){return false};
Window.prototype.alert = function(){return false};

//列表页一级页面
if(window.location.pathname == '/gdceportal/Study/StudyCenter.aspx'){

    let selector_imgAndMessage = "#aspnetForm > div:nth-child(13) > div.imgAndMessage"
    wait_element(selector_imgAndMessage,function(){
        document.querySelector(selector_imgAndMessage).remove()
    })

    let selector_header = "#aspnetForm > div.signup_header2"
    wait_element(selector_header,function(){
        document.querySelector(selector_header).remove()
    })

}

//课程列表页面
if(window.location.pathname == '/gdceportal/Study/LearningCourse.aspx'){
    //console.log('检测到课程列表页面...')
    var selector_course = '#gvList_ctl02_HyperLink2'      //第一个课程的标题

    wait_element(selector_course,function(){
        setTimeout(do_study(selector_course),3000)
    })


    //处理主页面等待刷新时间
    wait_element("#gvList > tbody > tr:nth-child(2)",function(){
        let course_percent = parseFloat(document.querySelector("#gvList > tbody > tr:nth-child(2) > td:nth-child(5) > div > div:nth-child(2)").textContent)*0.01
        let study_time_hour = parseFloat(document.querySelector("#gvList > tbody > tr:nth-child(2) > td:nth-child(2)").textContent)

        //一个学时对应大概42-45min
        let study_time_second = parseInt(study_time_hour/60*45*60*60*(1-course_percent))+1
        let refresh_time_second = AUTO_REFRESH_TIME

        console.log('当前课程剩余：'+study_time_second+'s  当前进度：'+course_percent*100+'%')


        //页面显示刷新倒计时
        let last_time = refresh_time_second
        setInterval(function(){
            document.querySelector("#gvList_ctl02_HyperLink1").innerText = '?? '+last_time+'s';
            last_time += -1;
        },1000);

        sleep(refresh_time_second*1000).then(() => {

            new_window.close();
            //console.log('移除iframe')
            //document.querySelector('iframe#auto_gbpx').remove()

            /*
            if(is_almost_done = true){
                selector_course = "#gvList_ctl03_HyperLink2";
                wait_element(selector_course,function(){
                    setTimeout(do_study(selector_course),3000)
                })
            };
            */

            location.reload(true);
        })
    })

}

//打开后课程页面

if(window.location.pathname == '/gdceportal/Study/CourseDetail.aspx'){
    //console.log('准备播放视频...')
    var selector_start_button = '#btnStudy'
    wait_element(selector_start_button,function(){
        document.querySelector(selector_start_button).click()
    })
}


//视频播放页面
if(window.location.host == 'wcs1.shawcoder.xyz' & window.location.pathname == '/gdcecw/play_pc/playmp4_pc.html'){
    window.onload=function(){
        console.log('自动播放视频')
        let is_muted = false;
        const k = 20;
        let j = 0;
        while (!is_muted && j < k) {
            sleep(200)
            j = j + 1
            //console.log(j)
            if (document.querySelector('video')) {
                document.querySelector('video').muted = true;
                is_muted = true;
            }
        };
        wait_element("#my-video > button",function () {
            setTimeout(function(){
                document.querySelector("#my-video_html5_api").play()
            },3000)
        })
    }
}

function do_study(selector){

    let course_link = document.querySelector(selector)
    //第一个课程变色
    document.querySelector("#gvList > tbody > tr:nth-child(2)").style.backgroundColor = "yellow"
    document.querySelector("#gvList > tbody > tr:nth-child(2)").style.color = "red"
    //document.querySelector("#gvList_ctl02_HyperLink1").innerText = '**学习中**'

    //拼接课程视频页面url

    let course_url = 'https://gbpx.gd.gov.cn/gdceportal/Study/'+ course_link.href.slice(14,67)
    //console.log('已打开页面-> '+course_url)

    //拼接跳转后的地址
    //let cid = course_link.href.slice(14+21,67)
    //let course_url = 'https://wcs1.shawcoder.xyz/gdcecw/play_pc/playverif_pc.html?t=2f4fd72bdf4a421f8e83d72060c414f5&courseLabel=wlxy&courseId='+cid

    /*
    //方式1：嵌入iframe
    var body = document.getElementsByTagName("body");
    var div = document.createElement("div");
    div.innerHTML = '<iframe id="auto_gbpx" name="auto_gbpx" src="'+course_url+'" height = "0" width = "0" frameborder="0" scrolling="auto" style = "display:none;visibility:hidden" ></iframe>';
    document.body.appendChild(div);
    */

    //方式2：GM自带方法打开新页面，不被浏览器alert阻塞，可通过close关闭页面
    new_window = GM_openInTab(course_url,'insert')


}


function sleep (time_ms) {
    return new Promise((resolve) => setTimeout(resolve, time_ms));
}

/*
    功能:等待dom加载后执行函数
    dom_selector :选择器参数  待加载的dom = document.querySelector(dom_selector)
    func:待执行函数体，用匿名函数传参
    */
function wait_element(dom_selector, func) {
    let is_DomExist = false;
    let interval = 100;//时间间隔
    var int_checkDom = setInterval(() => {
        if (document.querySelector(dom_selector)) {
            is_DomExist = true;
            func();
        };
        if (is_DomExist) {
            clearInterval(int_checkDom);
        }
    }, interval);
};




//视频变速器代码/////
(function () {
    'use strict';
    //感谢https://github.com/xxxily/h5player 提供的hack视频信息
    /**
     * 某些网页用了attachShadow closed mode，需要open才能获取video标签，例如百度云盘
     * 解决参考：
     * https://developers.google.com/web/fundamentals/web-components/shadowdom?hl=zh-cn#closed
     * https://stackoverflow.com/questions/54954383/override-element-prototype-attachshadow-using-chrome-extension
     */
    function hackAttachShadow () {
        if (window._hasHackAttachShadow_) return
        try {
            window._shadowDomList_ = [];
            window.Element.prototype._attachShadow = window.Element.prototype.attachShadow;
            window.Element.prototype.attachShadow = function () {
                const arg = arguments;
                if (arg[0] && arg[0].mode) {
                    // 强制使用 open mode
                    arg[0].mode = 'open';
                }
                const shadowRoot = this._attachShadow.apply(this, arg);
                // 存一份shadowDomList
                window._shadowDomList_.push(shadowRoot);

                // 在document下面添加 addShadowRoot 自定义事件
                const shadowEvent = new window.CustomEvent('addShadowRoot', {
                    shadowRoot,
                    detail: {
                        shadowRoot,
                        message: 'addShadowRoot',
                        time: new Date()
                    },
                    bubbles: true,
                    cancelable: true
                });
                document.dispatchEvent(shadowEvent);
                return shadowRoot
            };
            window._hasHackAttachShadow_ = true;
        } catch (e) {
            console.error('hackAttachShadow error by h5player plug-in');
        }
    }
    hackAttachShadow ();


    //利用Object.assign 改变css
    let setStylesOnElement = function (styles, ...elements
        ) {
            for (var i = 0; i < elements.length; i++) {
                Object.assign(elements[i].style, styles);
            }
        }
    ;

//创建窗体
    var appDiv = document.createElement("div");
    appDiv.id = "appDiv";
    setStylesOnElement({
        left: "0px",
        top: "100px",
        position: "fixed",
        border: "1px solid red",
        background: "rgba(255,255,255,0.5)",
        zIndex: "1000"
    }, appDiv);
//

//创建头部
    var headerDiv = document.createElement("div");
    var title = document.createElement("span");
    title.id = "title";
    title.innerText = "视频变速器";


    var toggleBtn = document.createElement("span");
    var currentValueShow = document.createElement("span");
    currentValueShow.innerText = 'x'; //顶部显示当前速度
    toggleBtn.innerText = "隐藏";
    setStylesOnElement({
        border: "1px solid red",
        float: "right",
        cursor:'pointer',
    }, toggleBtn,currentValueShow);

    toggleBtn.onclick = toogleWindow;


    function toogleWindow() {
        var t = toggleBtn.innerText;
        console.log(t);
        if (t == "隐藏") {
            toggleBtn.innerText = "显示";
            setStylesOnElement({
                display: "none",
            }, title, sliderContainer)
        } else {
            toggleBtn.innerText = "隐藏";
            setStylesOnElement({
                display: "inline-block",
            }, title, sliderContainer)
        }
    }

    headerDiv.appendChild(title);
    headerDiv.appendChild(toggleBtn);
    headerDiv.appendChild(currentValueShow);

    var infoEle = document.createElement("div");

    setStylesOnElement({
        fontWeight: "bold",
        margin: 0,
        padding: 0
    }, title, infoEle);

//显示速度
    function changeShowValue(v) {
        slider.value = v;
        currentValueShow.innerText = v;
        infoEle.innerText = "','视频减速0.25 \n" +
            "'.' 视频加速0.25 \n" +
            "'数字键'变速为(数字*0.5) \n" +
            "'h' 彻底隐藏窗口\n" +
            "当前速度" + v;
    }

    var sliderContainer = document.createElement("div");

//创建slider
    var slider = document.createElement("input");
    slider.id = "slider";
    slider.min = 0.25;
    slider.max = 10;
    slider.step = 0.25;
    slider.type = "range";
    slider.value = globalRate;
    slider.oninput = function (ev) {
        //防止事件被父元素捕捉
        ev.stopPropagation();
        speedChange(this.value);
    }


    var btnGroup = document.createElement("div");
    btnGroup.appendChild(getBtn(0.75));
    btnGroup.appendChild(getBtn(1));
    btnGroup.appendChild(getBtn(1.25));
    btnGroup.appendChild(getBtn(2));
    btnGroup.appendChild(getBtn(2.25));
    btnGroup.appendChild(getBtn(2.5));


//创建按钮组同时给按钮添加监听
    function getBtn(value) {
        var v1 = document.createElement("button");
        v1.innerText = value;
        v1.style.fontSize = "1.5em";
        v1.style.width = "50%";
        v1.onclick = function (ev) {

            speedChange(value);
            //当按钮点击，重新激活interval
            loopWatch();
            ev.stopPropagation();
        }
        return v1;
    }


    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(btnGroup);
    sliderContainer.appendChild(infoEle);


//添加文本和按钮到窗体
    appDiv.appendChild(headerDiv);
    appDiv.appendChild(sliderContainer);


    /**
     * 更改速度
     * @param rate
     */
    function speedChange(rate) {
        rate = Number(rate);
        if (rate < 0.25) {
            rate = 0.25;
        }
        if (rate > 10) {
            rate = 10;
        }
        //更改全局速度
        globalRate = rate;

        var videos = getVideoEleFromDocument();

        for (let i = 0; i < videos.length; i++) {
            let video = videos[i];
            if (video.playbackRate !== rate) {
                video.playbackRate = rate;
                changeShowValue(rate);
            }
        }
    }

    /**
     * 从当前document中获取video元素， 如果没有则抛出异常
     */
    function getVideoEleFromDocument() {
        //拿到htmlCollection
        var videos = document.getElementsByTagName("video");
        if (videos.length === 0 || typeof (videos[0]) === "undefined") {
            throw "没有检测到视频哦~";
        }
        // if (video.length > 1) {
        //     throw "视频数量过多，无法指定";
        // }

        return videos;
    }

//设置全局速度
    var DEFAULT_RATE = 10;
    var globalRate = DEFAULT_RATE;


    /**
     * app的隐藏和显示来回切换
     */
    function toogleApp() {
        var d = (appDiv.style.display || "block");
        var result = d === "block" ? "none" : "block";
        appDiv.style.display = result;
    }

//加速重试次数
    var retryTime = 0;


    /**
     * 加载窗口
     */
    function loadApp() {
        console.log("加载App")

        //检测按键行为
        var targArea = document;
        //targArea.addEventListener('keydown', reportKeyEvent);
        targArea.onkeydown=reportKeyEvent;

        /**
         * 根据按键响应不同的行为
         */
        function reportKeyEvent(zEvent) {
            //--- Was a Ctrl-Alt- combo pressed?
            //if (zEvent.ctrlKey && zEvent.altKey) {  // case sensitive
                switch (zEvent.key) {
                    case ",":
                        speedChange(globalRate - 0.25)
                        break;
                    case ".":
                        speedChange(globalRate + 0.25)
                        break;
                    case "/":
                        speedChange(DEFAULT_RATE);
                        break;
                    case "`":
                        speedChange(2.5);
                        break;
                    case "h":
                        toogleApp();
                }
                for (var i = 1; i <= 9; i++) {
                    if (String(i) === zEvent.key) {
                        speedChange(i*0.5);
                    }
                }
            //}

            //zEvent.stopPropagation ();
            //zEvent.preventDefault ()
        }

        document.body.appendChild(appDiv);
    }

    /**
     * 设置整个appDiv是否显示
     * @param b
     */
    function setAppIsShow(b) {
        if (b) {
            appDiv.style.display = "block";
        } else {
            appDiv.style.display = "none";
        }
    }

    /**
     * 循环监听视频速度
     */
    function loopWatch() {
        clearInterval(document.watchSpeedTask);
        document.watchSpeedTask = setInterval(function () {
            try {
                speedChange(globalRate);
            } catch (e) {
                retryTime++;
                console.error("出错1：", e, "正在重试第" + retryTime + "次");
                if (retryTime >= 10) {
                    clearInterval(document.watchSpeedTask);
                    console.error("加速失败，请刷新页面")
                    retryTime = 0;
                }
            }
        }, 1000);
    }




    /**
     * 程序入口
     */
    function main() {
        setAppIsShow(true); //显示窗口
        toogleWindow(); //隐藏详细内容
        loadApp();
        loopWatch();
    }

    window.addEventListener('load', function () {
        console.log("加载文档完毕");
        try {
            var h = hackAttachShadow();
            console.log(h);
            //如果没有video则会抛异常
            getVideoEleFromDocument();

            main();
            // console.log("成功:", "对应的文档", document)
        } catch (e) {
            console.error("出错:" , e, "对应文档", document);
        }

    },1000);


    /* 检测shadow dom 下面的video */
    document.addEventListener('addShadowRoot', function (e) {
      const shadowRoot = e.detail.shadowRoot;
      console.log(shadowRoot);
    });
})();

// ==UserScript==
// @name         成都文理学院刷课助手|自动刷课|考试自动答题
// @version      2.1.6
// @description  成都文理学院刷课助手，（虽不止成文理，但仅在成文理做了测试）🚀目前已支持平台：【数字化实习实训平台、公益课程、在线学堂、英华学堂、鲁泽科技平台】。😀目前已具有功能包括：视频自动播放、自动识别填充验证码、考试自动答题等功能。如有bug请留言。🐧QQ交流群：878643471
// @author       iFulling
// @match        *://zxshixun.cdcas.com/*
// @match        *://*.zjxkeji.com/*
// @match        *://mooc.cdcas.com/*
// @match        *://*.rurenkj.com/*
// @match        *://*.luzkeji.com/*
// @match        *://*/*
// @icon         data:image/png;base64,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
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @license    	 MIT
// @namespace  	 https://github.com/iFulling/cdcasSK
// @connect      119.8.102.43
// @connect      ark.cn-beijing.volces.com
// @downloadURL https://update.greasyfork.org/scripts/539560/%E6%88%90%E9%83%BD%E6%96%87%E7%90%86%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%7C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%7C%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/539560/%E6%88%90%E9%83%BD%E6%96%87%E7%90%86%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%7C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%7C%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

let videoElement = null;
let checkCaptchaTimer = null;
let containerTextElement = null;
let examTextElement = null;
let sponsorElement = null;
let statementElement = null;
let layuiLayerContent = null;
let links = null;
let current = 0;
let timerCnt = 0;
let version = "2.1.6"
let endpoint_id = "";
let apikey = "";
let useTermDb = false;
let examCurrent = 0;
let startFlag = false;
let videoTimer = null;

// 获取当前课程
function getCurrent() {
    links = $('a[target="_self"]');
    links.each((index, item) => {
        if ($(item).hasClass("on")) {
            return current = index
        }
    });
}
// 下一个视频
async function playNext() {
    clearInterval(checkCaptchaTimer);
    clearInterval(videoTimer);
    if (current === links.length - 1) {
        addText("最后一个已看完！")
    } else {
        addText("准备播放下一个视频...")
        await pause(3)
        links[current + 1].click();
    }
}

// 输入验证码
async function inputCaptcha() {
    if (layuiLayerContent.length && layuiLayerContent.is(':visible')) {
        addText("验证码弹窗出现，准备填写验证码...");
        await pause(2, 5)

        // 获取图片
        let imgs = layuiLayerContent.find("img")
        let img = imgs[0].style.opacity === '0' ? imgs[1] : imgs[0]

        // 图片转base64
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        let code = canvas.toDataURL("image/png").split("base64,")[1];

        // 调用接口，识别验证码
        let ans = await getCode(code)

        // 获取input，填入验证码
        let inputs = layuiLayerContent.find("input")
        let input = inputs[0].style.display === 'none' ? inputs[1] : inputs[0]
        $(input).mousedown()
        input.value = ans

        // 点击开始播放按钮
        await pause(2, 5)
        const playButton = $('.layui-layer-btn0');
        if (playButton.length) {
            playButton.click();
            checkCaptchaTimer = setInterval(playVideo, 1000);
            addText("已自动点击开始播放按钮！");
        } else {
            addText("未找到开始播放按钮，尝试刷新页面....");
            location.reload();  // 刷新当前页面
        }
    }
}

async function test(){
    await pause(2)
    let img = $("#codeImg")[0]
    // 图片转base64
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0, img.width, img.height);
    let code = canvas.toDataURL("image/png").split("base64,")[1];
    // 调用接口，识别验证码
    let ans = await getCode(code)
    console.log(ans)
}

function getCode(code) {
    return new Promise((resolve, reject) => {
        const datas = {
            "ImageBase64": String(code),
        }
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://119.8.102.43:5000/get_captcha",
            data: JSON.stringify(datas),
            headers: {
                "Content-Type": "application/json",
            },
            responseType: "json",
            timeout: 10000,
            ontimeout: async function (e) {
                addText("验证码获取超时，刷新页面...");
                await pause(3)
                location.reload();  // 刷新当前页面
            },
            onload: function (response) {
                if (response.status == 200) {
                    let result = response.response["message"];
                    addText("识别结果：" + result);
                    return resolve(result);
                } else {
                    let result = JSON.parse(response.response)["message"];
                    addText(result);
                    addText("识别失败，请勿开启代理，或联系管理员。🐧群：878643471");
                }
            },
            onerror: function (error) {
                addText(`${error.statusText} ${error.status} - 出错了`)
            },
        });
    });
}

// 播放视频，同时检测验证码
async function playVideo() {
    timerCnt++;
    if (timerCnt % 5 === 0) {
        addText("等待加载，已加载：" + timerCnt + "秒")
    }
    if (timerCnt > 20) {
        addText("刷新页面")
        location.reload();
        return
    }
    if (!videoElement) {
        if (links[current].title && current === links.length - 1) {
            addText("课程已看完，自动停止！")
            clearInterval(checkCaptchaTimer)
        }else if (links[current].title && /考试|章节作业|自学教材/.test(links[current].title)){
            addText("没有视频，准备跳过...")
            clearInterval(checkCaptchaTimer)
            await playNext();
        }else {
            videoElement = document.querySelector("video");
            setVideoElement();
        }
        return
    }
    // 验证码弹窗
    layuiLayerContent = $('.layui-layer-content');
    if (layuiLayerContent.length > 0) {
        clearInterval(checkCaptchaTimer);
        await inputCaptcha()
        return;
    }

    // 检测视频是否加载成功且暂停
    // if (!videoElement) return;
    if (videoElement.paused) {
        videoElement.play();
        if (videoElement.readyState === 4) {
            const message = containerTextElement.text().includes("视频加载完成")
                ? "请将浏览器置于前台运行。（若学时会增加可忽略）" : "视频加载完成，准备播放";
            addText(message);
        }
    } else {
        timerCnt = 0;
    }
}

// 获取视频元素
const setVideoElement = () => {
    videoElement.muted = true;
    videoElement.playbackRate = 1.0;
    videoElement.volume = 0;
    videoElement.onended = async function () {
        await playNext();
    };
}


// 添加交互显示
const addContainer = () => {
    const mini = $("<div class='mini'>刷课<br>助手</div>")
    const container = $('<container></container>')
    container.addClass('popup');

    const header = $("<div></div>")
    header.addClass('container-header')
    header.text("成都文理学院刷课助手 " + version)
    container.append(header)

    const btnGroup = $("<div></div>")
    const classTab = $("<button class='classTabBtn'>刷课配置</button>")
    const examTab = $("<button class='examTabBtn examTab1'>搜题配置</button>")
    const statementTab = $("<button class='examTabBtn'>使用说明</button>")
    const sponsorTab = $("<button class='examTabBtn'>捐赠</button>")
    const minimize = $("<button class='examTabBtn minimize'>缩小窗口</button>")
    btnGroup.append(classTab)
    btnGroup.append(examTab)
    btnGroup.append(statementTab)
    btnGroup.append(sponsorTab)
    btnGroup.append(minimize)
    header.append(btnGroup)

    classTab.on("click", () => {
        containerTextElement.show()
        examTextElement.hide()
        statementElement.hide()
        sponsorElement.hide()
    })
    examTab.on("click", ()=>{
        containerTextElement.hide()
        examTextElement.show()
        statementElement.hide()
        sponsorElement.hide()
    })
    statementTab.on("click", () => {
        containerTextElement.hide()
        examTextElement.hide()
        statementElement.show()
        sponsorElement.hide()
    })
    sponsorTab.on("click", () => {
        containerTextElement.hide()
        examTextElement.hide()
        statementElement.hide()
        sponsorElement.show()
    })
    classTab.on("mousedown", e=>{
        e.stopPropagation()
    })
    examTab.on("mousedown", e=>{
        e.stopPropagation()
    })
    statementTab.on("mousedown", e=>{
        e.stopPropagation()
    })
    sponsorTab.on("mousedown", e=>{
        e.stopPropagation()
    })
    minimize.on("click", ()=>{
        container.hide()
        mini.css("display", "flex")
    })
    let moveFlag = false;
    mini.on("mouseup", ()=>{
        if (moveFlag) return;
        container.show()
        mini.hide()
    })


    // 添加移动事件
    header.on("mousedown", function (event) {
        event.stopPropagation();
        event.preventDefault()
        document.body.style.userSelect = 'none';
        // 获取鼠标相对盒子的偏移量
        let shiftX = event.clientX - header.offset().left;
        let shiftY = event.clientY - header.offset().top;
        // 当鼠标移动时
        function onMouseMove(event) {
            event.stopPropagation();
            event.preventDefault()
            container.css({
                left: event.pageX - shiftX + 'px',
                top: event.pageY - shiftY + 'px'
            })
        }
        // 鼠标提起来
        function onMouseUp() {
            document.body.style.userSelect = 'auto';
            $(document).off('mousemove', onMouseMove);
            $(document).off('mouseup', onMouseUp);
        }
        $(document).on('mousemove', onMouseMove);
        $(document).on('mouseup', onMouseUp);
    })
    mini.on("mousedown", function (event) {
        event.stopPropagation();
        event.preventDefault()
        document.body.style.userSelect = 'none';
        // 获取鼠标相对盒子的偏移量
        let shiftX = event.clientX - mini.offset().left;
        let shiftY = event.clientY - mini.offset().top;
        // 当鼠标移动时
        function onMouseMove(event) {
            event.stopPropagation();
            event.preventDefault()
            moveFlag = true;
            mini.css({
                left: event.pageX - shiftX + 'px',
                top: event.pageY - shiftY + 'px'
            })
        }
        // 鼠标提起来
        function onMouseUp() {
            document.body.style.userSelect = 'auto';
            moveFlag = false;
            $(document).off('mousemove', onMouseMove);
            $(document).off('mouseup', onMouseUp);
        }
        $(document).on('mousemove', onMouseMove);
        $(document).on('mouseup', onMouseUp);
    })

    const hr = $("<hr>")
    container.append(hr)
    $("body").append(container)
    $("body").append(mini)
}
const showSponsor = () => {
    sponsorElement = $("<div></div>")
    sponsorElement.addClass('container-sponsor')
    $(".popup").append(sponsorElement)

    sponsorElement.append("<br><b>二维码是自愿捐赠！插件完全免费，但是依然需要一台服务器来处理数据。</b><br>")
    sponsorElement.append("如果您觉得它对您有所帮助，您可以选择自愿捐赠支持它。<br><br>")
    sponsorElement.append("PS: 所有捐赠将用于维护免费插件运行<br>")
    sponsorElement.append("<img alt='zfb' width='35%' src='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDACQZGyAbFyQgHiApJyQrNls7NjIyNm9PVEJbhHSKiIF0f32Ro9GxkZrFnX1/tve4xdje6uzqja////7j/9Hl6uH/2wBDAScpKTYwNms7O2vhln+W4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eH/wgARCAIcAWgDASIAAhEBAxEB/8QAGQABAAMBAQAAAAAAAAAAAAAAAAIDBAEF/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//aAAwDAQACEAMQAAAB3AAAAAAOUpeoWXqBe52aAAAAAAAAAAAAAAAAAAApya8vXny7tsY2ijc0X57OW7Mfc+demyWkNHnay/NLKb648IX8qNUqbgAAAAAAAAAAACnPoo6Ykq0Wdy6Jyw0QsxrHprxyy21aTztWfcZqdmM2V6OHnas2osnCYAAAAAAAAAAABVl3V6zRXqazka1clZ3lum3paloz6ArheK4XjN3QITAAAAAAAAAAAAAAAAAAAAAAAAAAAAADCg78ZoCaAmgJoCaAmgJoCaAmgJoCaAmgJoCaAmgJoCaAmgJoCaAmgJoAKAEiLvSKUQ70i70idOOjjvAl2IJiCUaO9Iu8BIiAlEHTjvAAAAACevDt5652PM6nn0ZrL5GdQsr7ZTbVosrs4zVN0aRkssz6KpbM2nJqaJ1WZvOIlOrNp1K3KrNmbRjzdcSVKIqqOvMKAAAnswbOekedzqWfTls255xl7bBLmvqt3jso243XVGG8aK7K5b8+jOaMW3HZponploXZCOvJr1KownV+PZjjRPPbLOHUZh1wAAABK2hLbKhF9cFXRrGmmCF1Ky6EC38pRdVxZfGpLfCsXVxVZZnQvoUtqJfXBLpZhpZhOBqAAAAAHeAB0cdHHRx0cdHHRx0cdHHRx0cdHHRx0cdHAAAAAAC2LJ2uPWpaKlgrWCtYK1grWCtYK1grWCtYK1grWCtYK1grWCjN6GXeaR0wAAAAvovzdQ49ec84ei84ej3yNxpYKz0+ZMZ67yLj0u+doNHPOqPXZKzd3xLj1uZ7CffN1lzybT0XnD0u+X6gy6sus0DtzAAAAX0X5uocevmbMekzWYri/RntLI+ZvMT1MZDT59hKXdRnll0Fleqgh3LtPP8AVw7jHrhcZJRrO7PK9Izen5npjLqy6zQO3MAAABfRfm6hx6+ZuyVmieQW249xi0wrN3c3TL6OOZo8n0YmPXVectqFNN2knPNQT05NRRfikaL8A76fneiMurLrNA7cwAAAF9F+bqHHqef0uvhkNFsMhrz2ZChMenn2YCd+TcZ8/oZDHszeief6WDYUu1le/Nedz0Xlrz5G3XVaMurLrNA7cwAAAF9F+bqHHr5mmzzyyWS8nTOk2afM9Eclw5m50RsxF+nBrE54D06pYi/LpsJ6fL2l+Luo8yyVR6fcG8ZdWXWaB25gAAAL6L83UOPXFT6fjnsZsuc9KWTcefGzMen53o1E6kyeXbiJU+llKtlmApup1lUrrzLdTcZ9/keidcxmy/y/UGXVl1mgduYAAAC+i/N1Dj1V55FtPLDFX6FJDT5nTdfykh3Xww6dUY7m0ZqtSwnoURvPH9XDqLpQzEdNcTXVPzjff5fqDLqy6zQO3MAAABfRfm6hx6+ZdSK9FW4752iJj9LzdRu7Dpisz6DVXPkThZGWNOiNlWvDtqvmTeebql5xr7m4ejkiOep5fqDLqy6zQO3MAAABfRfm6hx609p849Pnmiy6Ow7gumZt+DUUbcw1ZqpxVfzlaIxgWaI5RVoHL6bxDJ0nDbQX286MurLrNA7cwAAAF9F+bqHHqz6MwrzaCvXDGR9Kiwo7TaU8q1GiqjQZ9MeGiGnxS706JCqHSG7JlPRso0GKr1fMPRli2jLqy6zQO3MAAABfRfm6hx6sGmQzRiXmQ0WxoL7slJs5CRg2UbyNOnCba8Xrnn6bfGNXeUHp+ZbIh6NMi/zY+gT75npjLqy6zQO3MAAABfRfm6hx6555rzPq86RoZ5F2jPI552vcV5bsZLf58iy5Ao021mnJnid1V7SWOGc9fHnrNl9GU3aPN9IZdWXWaB25gAAAL6L83UOPXLVXsM67pRpyayMJdMuieQ0asG0yRzaDbOAoq5I5dTrPPt2ecc20XDLtwnWjhLVzoy6sus0DtzAAAAX0X5uocevmac2k826q4uvo0FMOVFPp03DLr8wslqznauekZq7KjPtq9Ajh31FWLbeYOeliNPatBb3DuGXVl1mgduYAAAC+i/N1Dj18y+2JFIZN0LzJTukV07aDnXTJz0JGLNvkQ7ZMxLrjBolI8fbd0w3bKimj0qjR3nRl1ZdZoHbmAAAAvovzdQ49SFZeriXKZFiiRapkWKelqrhcrgXq4lyuwAFZYrFiiRarsGXVl1mgduYAAAC+i/N1Dj1pru4cp0cK5ykZ5ykZ7ZCmUxVzRwrjdw53vCztUySHSVN0BywZO29OWwmMurLrNA7cwAAAF9FubsHHqAAAAAAAAAAAAAAAy6sms0u87cwAAAANM8fcXWxl2MY2MY2MY2MY2MY2MY2MY2MY2MY2MY2MY2MY2MY2MY05jUCwAAAAAAATIJogsLX3sypMkFnCCwtfZSKlnEgKLEtazhAWAAAAAAAAAALK5yxnEWK2by2qdjseE4diXxizUodpKA6r7qWx4zZw7wgN5AAAAAAAAAAAAAAAAAAAAAAAAAAAA//EAC0QAAICAgEDBAIBBAMBAQAAAAECAAMREhMQMTMhIjAyBBQjIEBBUEJEYENw/9oACAEBAAEFAv8AdcgnIJyCcgnIIPX/AE9n16Bcr0q6ZnKds9Hs1I7RLCzFgs5FgtOeRYDkf3Fn1nugPt90JzKo4XH8U/z/ABRdVUH3MPXX0T1a3EVkUbpGKNK/r/cWfUCYSccPtSVdCxVvTHkfUauMPaMpUfbV92OJvEOG3gOR/cWfUjIxANJyTCtFXXpYVxg4rK4lnkgULKvv0r+7vqVOR/cP9QcTkaZz1ryQy7QVqOhrUxV1jV7NGGYtepZdpxziE4sxV1H9zoJxicYmizRf/bbNNmmzTZps02abNNmmzTZps02abNNmmzTZps02abNNmmzTZps02abNNmmzTZps02abNNmmzTZps02abNNmmzTZps02abNNmmzf+gwemDnGOneEY6YPTEPpB6zt0AzNTNWmrTU9cZnbqAeuD/R2+MDJx6Kus19xG0ICsCuWIE2WEgByDK+24gIMJALkEV9i+CDleQxvogBmqRQBCFzqkPf6pxzjmPTHvJAnIs5FgIMf7fD/AMKzkae5hsCNWAWEieyeyPrF+qQNklvdZ2r7HTI7YSN9VGTxxV1hTJNeIuMv9VGQSYfpNRNFmizVfiUZP+FxMNs2SMe6BsTfoxya/qpi4hK5dgZX2KHK+i6NG+kAyDsIgJljdG+lfewe4/SccVNSyZPH8f8Awq7e7Zs4Oc1/XfEVswvgs2ZX9V7woZgiV9i5yvqu7RvpFDA4zDnGp6N9AcFjtD9JlpXnLfZgQPhBwTZ6K2s5JyRjmK+oBw3JGOTFfUbzY55Iz7BX1B9SHwFbEL5CtrOQwkmByJydC+RFbEL5CnB5JyTknJGOT/8AiIrmizRZos0WaLNFmizRZos0WaLNFmizRZos0WaLNFmizRZos0WaLNFmizRZos0WaLNFmiw1/JX9v9DZ3+Krv1zMzMz1z0zMzMz0zM9czPXPTMzMzMz1t7/FV36X+ThecDzgeMhWf9f8fvb5XPKGUqVUseB4qFDzpHQmKhaK4rFtgZZW2r86RxsnA8xilULTgecDzgeU+Tpb3+Krv0v8jtqnO0S1mf8AI7oM1IgSNUrRWKlm2NHktsKE2swqQPNvc/8ADFQWC2sKtVYZbKlVYTirnaZzT+P3stZW52lbFlp8vS3v8VXfpf5LvFKvJ+R3/wCvmV2KEYqodeQ9oEZoqFW5UjnL0epNiqXPICCpdg68TxgTVShWP9Px+93klHjp8vS3v8VXfpf5GXZf11i0hT+R3/69SbngEdNwi6BF2dE0FvjijLEcMCcsSoIb/uramp9w51X9hpnNP4/dqgx4FiLoKfL0t7/FV36XKxfFsxbMWwpYZg8NXsLv/Ja41qcaoNXs2Ysc10pP/v8Akdq2Arq32v8AJYnsq9gDfyXaxfAEsExbMWzFsqRg/S3v8VXf+iyzQj1FlmkU7LYm84OrLsmeCa6yuzeNXhrLNwO/7Edt2dtVxzz9eWV6Srx2PoP2JXbu1lujJbs3S3v8VXfpc7B62bbCvFc8h0aBjy3sVG1hmrTVoO35H2TbK6zKmXqFCqclEEsX3W+tdPtCueS73Rc8J3aIq6AkT3PAijrb3+Krv0v8l3iqsCDhLTgafRz/ADRBqiWBy9oUraGP5H2NoNdThIDm78jsloVS3NK10XnWEc0C5apCnWyosz1FBXaEXrb3+Krv0ZFYs7NMTkectkOSVZliHKBFWFEY0+T8j7FF4oPQoeSGtMAlZU2yVgF3PGSoC8rwMeGlyxPZCbDaurVuxfpb3+Krv0srZmp8s5lB50jHNVThC52stUurKVIuWOOUv6U1OEhrZyyFIlZMtUsrKVPA84Hi1lC/80xin8f7RbFYtYqlbVY9Le/xVd+obVudofU1IHmo1tQIB3tYqqqLRZUqr+P9bfHUgeH2In80A0XnaMxY12szW2FDjZX/AIZnNKOViHdFrCm/yU+Tpb3+Krv1OqhSrRyrDishyDUwB5ElSMGLqpUFWcbnieUqU6WrtEGqKyMcS70SLYpjMqzI1uZWFPjZgo5a4HQnpb3+Krv0stKtd4vx/qKgHts0hTZIO9j6KF5Yy7KiaDq4Yn/H4/3stKsy7ramhSoCOm82weATfjLruLF0anydLe/xVd+l/ktdTWu+Kw+7ax290qUaNrhcYR/5LNmP/EN7ug73e1aRskbSP9MWxSoFz+lbJryJLRu1Pk6W9/iq79L/ACPVqtdmgLYTzxqcLEt1DpuEXRVXZ88MPqo6dz/l03G3D0/I+y/WyzSMdmrTcsur2VaKlui0+Tpb3+Krv0YJklCNapYV41LCAuSErMs9HDuZVnWnysEMyJY2JsTA4RUPpY3trXZciXgls2SsbTjSYVI2hlezNanuCKOtvf4qu/SyrdutdmkY7U/j93q2at9D+wJrxwjmjFc1oDMjaxAsrQEa8MRt104p+wJ+wJ+wJt7LLNxXVsHbQfsD+i3v8VXfrxJOOuPWgSpAY2BWrMkrOyWooWpFKs7GK7KAiMLP4ouTZ+R6inx3/RXZQRsOJI9aBKkBmBrwpMaqhNhtUK4629/iq79b/GlZcJUVa1C8UYt/I7VeGt9GZeUyqwIA2LG/mhcKn4/dvrKPGtoY/kfauohvyIpw3OsVthL/AL11FW6W9/iq79Q3KyKEC2E2WuUiIDPyO1Xi4FirqOFZwLG9G/HhqUl/4Yh3TgWM3EVrVT+R9q7WLOgeOMNUgcquol/k629/iq79GsVSSFDZtKoyNzJNv5eZIys5UGs2ts1aMGtRmNflZlSH3JwvMFX6ZlTqo+z8VkWptrULBQRXU+rKQ4q8nS3v8VXfo9Qcsuyk8MxunAs4FnAsVdR+R9I7apztKzm5694bChqsLm3y12F2nAstTQpUB05TyR7CH4FiLqFqCt0t7/FV36Wh97M6FLDNbZi2LuGsO0VtUp9zarLCGXjeaOJi2a/xUKVJ0zYvtxbDyAVMuMgC55q5mLZ67WuNRyGVE8nS3v8AFV36Pbo37E/Yn7E/Ynkrrr0j1bH8f7vboyVatDfg/sRTssevLfsT9iXeOuvcb7SxNIhxTXZubfLZVoqW6BKtW6W9/iq79L/JomMVTWuXqFlfju2wjewcYlw2estsDmN96lEGANljueS5FVagmvtaAARPN+REK8Y4xLPLcdlqQa9be/xVd+l/ku8Uq8n5HdTir9gQpydKPHf467NAGxZY+85f40TecOJZbus04oj7hPN+R0RNyy6tXVoz26Hrb3+Krv0v8lvixKvJ+R3QZquQKFsYS1FVaPHd48Ra01uVVijLKqrLHbapctYuGIDBVCRkChP5JxJFVVlvkqdmZkUmt2L9Le/xVd+l/k51nOs51lrh5X4/yOyVFhYmyhuILaGL2BDxFpwNNva9ZSU+O1dlDcQrqKt+R9n8MVwUespEsAQLxGxt2629/iq79GrVjwJOBJwJOBIBgMgeKNRGrDFalUtWHIGBONdmQPFGojVqxjVh4VyvAkFKgsgecKxlDDgT+i3v8VXf/Q29/iq79C2IX9QcgPAxM2gc4ZsDYwH27wNMnOxxn27xTmFiJk/05gYEBgZvAx2B9elvf4qu/Ru+cT/iuMr6TGWx7LIYPrBnLd/8n1QxJZ9P6U7AATGoAi9//p0t7/FV36FcnQQLgBYFAmJoIRmBcQLiazT1x6kZmvprAuJpNZj1xB6CAYPTSFckD16W9/iq7/6G3v8AFX9v9DZ3+MWTdZus3WbrN1m6zdZus3WbrN1m6zdZus3WbrN1m6zdZus3WbrN1m6zdZus3WbrN1m6zdYbP/WKMnEIAgAmFx/kLMQCBTkj1wM4g7KuZgQjHVRk4mPQ4x/bJ3Mf7DGBjXo0/wCH+T3HcwfVcY9saZWZWLjb2w40P0/tlIEGIxyc+mfQYm2J6TPoMT/IIByuARgYAysY56rgTIhI1JGP/S//xAAhEQABBAMBAQEBAQEAAAAAAAAAAQIRMRIgQBAhQTBQYP/aAAgBAwEBPwHeUJTldYieNrkWyyxORUIUxX/lm+O9S/FPw+jr9Q+Dj6fdmn4O9S/FVT8FgcWKNPwcJB82klSSSZKJJXySSSV8okyUyXuhPIIIIIIIIIIIIIIHJs2+F1bNvhdWzb4XVs2+F1bNvhdWzb4XVs2+F1bNvhdWzb4XVs2+F1bNvhdWzb4XVs2+F1bNvhdWzb4XVs2+F1bNvhdWyXwurfJTIyMjIyMjIyMjIyMjIyMiZ/nGkcKfxn/A/8QAJREAAgICAgICAgMBAAAAAAAAAAECERIxIEAQITBBMlBCUXGB/9oACAECAQE/AeVGLMX1YaHITJb6kdD9C9bH7fUjIyiZr9NRSKRSKRSKRSKRSKRSKRSKRSKRSKRSKRSKXC/N8LLXzTPsiffh/j4Wz7FRHQ/9P+kt0e/7Ino9C9cZn2R8v8RiSPd+hWQ0XTF7dkvo/kQHdHvlSZijFGKFFIaspGKKMUYopIxRVmzFGCMF3X6LZbLZbLZbLZbLZbLZbLZbLZbIy+uUtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGO+UtdGG+eCMEYIwRgjBGCMEYIwRgjBGCMEYIwQlXxWWWWWWWX4sv5HrxQ/CK8fZX6D//EAC4QAAIBAwEHBAEEAwEAAAAAAAABERAhMRICICIwMkFhQEJRgXETUGCRcKHB4f/aAAgBAQAGPwL+UzV70IvSC5kvgyW9XlGVJ2ozip4pKJZ1wdbPgUuCJpkt6qXSzq6cWCe1I7FqNUxJ0OnQ/Vp0l7tzwedy24jBPr7mdzJM0zBJk6mZZlkf4UyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZM/yDHoMGDBjlY9BFJoixely3IkwMvS27kyQRz/qk7l62o/yMjedM1yXpkzXNc8xweCwtVGY3GWPPIy6SRu/VM1zy/qngsX33zLGNzB9U71y+XimDFZMbud2N/FI3cGDBj/CdzBgwYMGDBgwYMGDBgwYMGDBgwYMGDBgwYMGDBb+Nr0Vz6HSNkhkKmp4VHtrBY07WS1JdLUjwW31z5VEhCRYbLEuliByfp+3BOz3NW1klEslUnxSfAyFSXuL0KEfVEmy5OxilidpWMjaGQRs5IZp2cmCB6kP8DHvLnwZZMiPoZlkEEUdEiVeTUyaTRswifAyZMsjcXOsj3HuPcXTI7wPVYs7HCzidydqyODHg0+4epH2IibnFNLK49Vi7sLSfRZM9x7j3F1VegxRWE6dVYIyfqf6HYe3PkxTpJJJxB1CuKnSRBEERVc6zOLB8kTYvBCdhQdzDMOiFq6ThIFCFYwjhVvFHqsZsLTc8wXk4slicmKr0Mzkyj8HD2IIIIEaRk+REGlEGGSuxpHWSSNxc65G5LLFyUS6InvXjpKLlyNg1LqpPeBzSNvBYh1XOlbrfgckosQ6Ts0cmpYZcTLEOup4Rw9iPA6QiGQqrnyquTT2FFLGraySh/kY5LdiNrsWpLIYoLnD3J8Fi5Koqrnyyw9lZMED1U4iGatrBwUc0WnJctuJSXJ7CgRelqrnRR/k1SI196yamRv/AEQRRbU0/T7YMmhEECqufCZwyKZg4oHDtRWOI4Tidjgx4pil7UtYvenFBwnuFq6haWcUSdROzdbi58yYNR8QNzRKCCCCM0nvuQac0QhWG6aSZIjcXO4oIbR2GkzhOKYLJDgyzipxRSxk+WKXc4HfwTtq5kVjuPXf8nSfBNpI28HCrGKrnTO47DfgY3JJg1kqxeZLM0/8JbNRqdyTUYMGDUKwtqSTG4ufijgeoaRYucJcgsS8i0WkTfyIR9liHRwPUR2MFiNvBbcXoLCYoEvIqXNSpc1HD2NHcY6wITEJncmn0TVc/TtYLGnsKBbfcQqQqsZJOz3L007JIhIuNDkhby50MknYNW1ik9ppOzgnbwWJeCwi5bvRLc4ix/6JsWkuXJW4udJBCufkyzLMsismEJ00rsOkUy6LappppMsgmq53DMFsl0zue4T2pgWh/wBEbTuXuYRGzdnSYZ7jF4HKLxJwK/g9xeTj/wBk9haWTDPccRwstJmq50QdJ0nSdJ+TI3J9EQapo1B0idNUnSdNMn6YrifgxSZIgmarn4R2OwoQhaTidy0FrnFijHrX9ngyiE7FkcUSQWPsQk2WilrnEr7i9ChCfgwa9zBqEaYpMkRTVmn2KukmSI3F6FCEhQQW3EKBfBYaWDiLEFh7SycZgtS5ch1XP7nc7igQhMhGnaILk/J2P0++C4iEaWSI+qaO5c0mraJW4udL3YLkKkslF66u5chUl0uRSS9Ie6v21ehx3FbJ0s6XRxBIzDIR2/skSVOkxuv4W5A1Vc7ZJ+GfLF5Nkd2TLEfYz+j7H8ngViIseB7z/NLIuKcn1VegYr7zpkbPimYGZZlkjq9yR1X7av3m/wCwW/ltzJkzR3RlDMUuzIxmd27JkT9RajyPNOFZoxU9p7RjO5s/BgxTuWF6i9IQy5ajrhncYzAtzBAkv5N//8QALBAAAgEDBAEDBAMBAQEBAAAAAAERITFhEEFRcZEwgaEgsfDxQFDBYNFw4f/aAAgBAQABPyH+6csXMTMTMTMTGSSn/T3dUym/pIcllCuQ50dCJkobjYQIIjpFMPKo8tMiZqfyfvCcMTDuAJOrljaDErEfm5T3j3EhbKFU1LxtLYm5IFhUvJCP9kEmp7H5wRNkYESVNK5/k/eExLCMrKlSZZr6CHovYTtg5oIbkiERWUPZDqBZKOvofhRAuG8I/CisQ13/ACtyC0CZuiYtJairqqGzgSzrfSjP4NmmF4KmWn+Y4aJZpBZ020z1XSQfL+SstA1qM6Bs1XqzDYdBJkt4NonvS8qOh7Otrh6pNjD9BVQ2UFS6PxsSnKBpc4RAf8ptdjCYTEYiIX/a5BkGQZBkGQZBkGQZBkGQZBkGQZBkGQZBkGQZBkGQZBkGQZBkGQZBkGQZBkGQZBkGQZBkGQZBkGR/0G9YJNuiktIqNrlGiUqDLlBvQalVRomdlIjaqEdikalVaMsU/RpGlak1ikalVatKiN9N6zVJt0Q02qo9OnSfCK6pC5UWik4gHoQnogipUkvg4gESK1vkTW5U+xOQvgjDXwJEJ+C/2NYosRAxD4gwYzfJJFqp17M3yJWkMq1omJKluFtUYGYGT8Iv+j1oMq7HJ3KZJCJuhdJIsWR7dFBUkWkWESVAiEWIEiW+y/2IzS1JCMWMq86aHWkuVbi3ORCNsOk2sQbj70QbTYarolzMslSlvJ+Umb5IE4byd+ihKZCp2FTgLmbhajBKKrSSjTdRSd5NKlZiC92JUG9y6zc2oChJMv8AY67SQkCMS8l7oqnQTOvISIbYyk3BsffS90PUiBsl0K60phyVKdLf066TRi4daNR61DPvEaIYh3RoVE0KVQmXuzi73EoVCS3cdwoL/Yq6T+BoGflBe6EpsmUwo7Gly0lpvovdEWymhqF0dGYMzy37juKlxgmS9IiWSMhGdGXiYlqgqCGLY6I8irRoqCGKKcIugnV0RFGKgaY0j5EpgLVyicSRMdB7SgujNynsXPQlsNFq6C2JK4meCPIjyI8iPITPH/xHoVH9BgAAAAAAAAAAAAAACoFU6+mk9P6Jac+nd61lckOUQ5RDlEOUbEzuQ50hyiHKIcohzpDkhytYcohzrDlGxDlEOUQ5RDlEOfWF3rX7RS28nR5OjyRfMQfHL/sJVfVam8g3GHR5E+PAdngZ3Go7fEQ5oCspX0UiwdngY9bjo8kntdB2+J0eTo8nR5LfrC71r9ocu5Q6fA4EQ9Kp5uhs+Q4bMj0w8yz0KqhVDy0QxdUoSWYEgsKoh3nAjSXKvJkc5J0dEukOkk9rsfHGGCDp8DmFj39YXetftH+P0eoJcsrICQKl7DoaRVhTKSL0RLiT/wDgUwbl7rTckhwLW+bixgkZOiRiqwUAad8fXXuyx7+sLvWv2hK2caAgq1NKgTMcQVwQlnAmE5JN3yKYk5nnX5oZFwlRKTQ3siAm2fbHLRDGNpKCFNtAc7mPjj2zaQlqOSx7+sLvWsqY1Bi1SXACteAWZf5HSn6MeS7OwlzW4+OyMdJu3uCayYW3IV7GSEqUPnlOl1BUaxG5a6EN4+iGSzzb3J+V3GaxmBG0SuKgh9EkUWxL1hd6+mHVUoaF8k25JTC5DSmIGsP/ABrFSg4tdSlXkQbEHEKwhlRA0I+D8JISEFjyfBj8IOaSfDI5xMn4SbAG4BDUvWF3rWBMSgg5vsOuaQUmpsppv7iSX2yJIwQruj9UfqiwfGGZEu9hUmj2HIdquxRqqMVDUiaqNHCtiSk7o3H1m8dU4IEiQjKL+xYyvuPZaBzUPIcppE/WF3rX7R/iNKadXsNpxbtIVOayHilRkNU2w0ImSMmRMnJ8YpA5iBLJOpB8h88X2TFJDDVajpT0iaqNlRsJ1Kqarq3o0SE0TAnc29YXetZYtexA3colwxLSSdsGT4JBFx4zHN6scwQbwOxGreT4wtGrBJvYZqauia00pWE2p8j+wNY3qRu0imQmdnxn+C4QRzzCLpetcJhWkC8ynXrC71rTZB/to2ic0wdngUssw4J1E7AxYXI3kCaV/AxVlUqLKnshdVqOcOxIuVFSHYiRKXI3GHR5OjyI/thY96ST2uh8UbhNsroK6BBkn1hd6+hj7h0+BpHyLqlD2pBXhUsCU+R1MUHOSdc66pQqeCg0n4Qlq2HT4N9goxQKqFUOj3Ise9JVtdhi+Q+W5lfEn2vXwu9fQ8AUdCFuL9iEv2kFvkSjNyifHko0a8DA0pG5OiNHNynarxQl28ssjXRiJD4DkK9EIg30Q4QibCgbbuxQmoiCjUpd9NIHgfJ8Cmnr16wu9axMkf5aZADSMpJORbHdSmNLA5CISs8O1BclimJOZ0TkmrROFfA4UJLogdIVIYhCTbkeKYXGXEE6PIZxJaJXLEynAuA9vXwu9a/aKgDoKzWMHyTDq17EjIMXjR1zSeh0sRkZ7EYHKpuuxkm7e4S1N3gngnS5NnQTbsfYl/6ESWsp2ESLKd9HRq5kk33bQfkZPRQvNxL5msEDLtMQZFULot+sLvWv2jc4llVJbW1iLiTtHGuqLlBfEk3KLnHrqeQIm0yo0VHBtoRMoK1PKdPiHwDmklMYknlMQXx7m4BvgWff1hd61b3GSQAuzB5kaHQqdXsLqyZRcAKlkiBtRgz3pnc/1HCuZHYlFHNdm6YhyZ2AkOhUkE1hkJ7hIRgzpsU6fEdSuFhiCrklISap2KEN5ESy0bDhNIn6wu9asoSGoeqklKSiFx8cfAiZZSZIp5uVwS9pSoxtFHG47bdTlDgzczAZJqvCExG8SJnkqpQsiBM83MbIyTJMkU6e0i0FCBiBLltSZJt6wu9fQ/3jEvI4Fr2K4BYItQkLJHJbXEJpWSVrWRI3dBwX2iwiq9Sp2A+4VxY610DylRHHp0LhKGP5HAteylgtl2H4GRelsVrO4UEkKBlCr6wu9fRe7GxshtGoQ0kVBjzYfPLHuKY+A20q1TcZUjuLlTEyWbMhodUKD458DT7xF6cnxCSajTwAzGFLTS2Fd2o9YXevod8EGhCWoqY+oVJEvqfP0nb5FGV9/J2+RIHDLfaPbTLEgsKo+XcdvkZsl6iSsyfEGDiCG4EeWQoNghdjS30Ky9YXetZEOSe1QVB1FTgSrS5Lz4I3WUvPga7+xMrheRMruIF/5AovjyI0p8kLZPCGn4qEvHkll7rRpcEpuxoqmRJwb3TSJqFE8kAEOavqIkdxBdh2O4159YXetZCbFyWT99Wo4KdIfRERFo7FjvRi1XGkTBuxTKW1A1KTVFRANJQPDviB4ZK2sIQk3UeKbnRopqJjRwioekJjMiFv1hd61Z4DYV7/AEGFR2ULHF5CUgryPWU2rhdAZjNqeEbn6oe3LgRmCeoWLyK6vuiWpUHp+8HwoSGLyKlCuxh5JvYXFAl8mBRFZkxeQ4LVOR7ezsQZZ12Pom3rC71rvkS/Yl+xL9iX7C6IEtuqdNVwb4ERoO2Tkl+xTG+kptVgl+xL9i+Tzog4UbSc8kwQJZUQLLrmDcA3kICt6wu9a/aI1bDEU10RZUx8UZKj2KRZkk2WX3GSLCNhdZNZiLGmK2tLcgwlwIGB+6N4KLCC4KjPMbjaK08C2Fgt9tOMC1ibWvuMnNOlBELppsh7mt/XF3rX7R/j9HtLLDJGzRxO2n3i72LemzksneSfBRAk6USPdpOIJ2tKiEJCuiZ5ujZE04iC3213uScQVUxlAYiWzNvWF3rX7Rb9iXDFao6VTCzRFmJECV0FlrufeLxLhjbGlMcjTlIw1Uxm6VORVz4CHQpApcaElQxFFEiu6KyX5zFin/6G7e/JeaIy1IJtf2KzKdesLvWv2hISoMQxhpBY+KfPERagcrkF3p3oRcmJiR14G81aioziC8tsIk2vpGq5BV7d6CK7UHxC/wBNElE5KBEmyrwKkXLHXhWoLSCsvWF3rWuiTs8nZ5OzydnkUtLIULiJTY0r4kqMkVHIgFxpzVUihcRKbGlVk6Ok5UESbHZ5ERJpkULiJbV/Omjs8+uLvX9aLvWqozuJhE+B8sOUMbhtsQwoRkSkHFn2BKm6TyTOCC5ZK0LEoo4hDHEg5qFTll1BOlCrsh1QW9yG6RAibdCyJ7Ux9/pVbg9NbC1tbFqiHUgGS9mVJtb1hd61m4nFxsiZzIizp0rqRJFHg7FxzQo8ERZigqeQk4KlbmXKY4PuzeVE2SOm2sHQsVwgpCFZ8iwav8Es7UWVyVVspDvoFZfSlJ8hI0kQYUCSelZH9wmfXhd61RI+Ig8ey4Kgct7kNTOCMpVbkJb5FAprBEVRSc8iewa1hxb4EiRyo5qJVzCNCeVBo0UunDL1DQUUNwbkatQ/KflZymKNzqJAtJAnfWE1rgQj8MhZN/WF3r+tDRDn+ieVx6lI5jMZjMZjMZjMZjMZjMZjMZjMZjMZjMZjMZjMZjMZjMZjMZhUFzNf+rjKU3IK+Gb4kbTqpgrHKmCJaq9xHQIwEybghpoIYxEugl0JFuiiqRqYIDR0csX0LhDmdeuIpukxqopVEhFE/wAdFGvsQn/WhbVZUsqDiaKmSYstCNEkp3glRJWN1N12JT7JNJ8CUP7D7MWQ3tVHUQ2WGX5MvyLUmOEXOg2Kk7nyX/HYS5kyPYkGh0fcEkXJUu9jipIbdWaYkie5G03MrgmZMRGvIWkeRAHNeBrhLoUP/YhIKI1ZkuZFDWfuNQJqpwI5/wCm/9oADAMBAAIAAwAAABAAAAAAA8MMAAAAAAAAAAAAAAAAAAADJNRVBSTRAAgAAAAAAAAAAABRjxCDCDRRigAAAAAAAAAAAA7/AMzwAgwwwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPPPPPPPPPPPPPPPPPPPPPPP8AvrPdANPPNM//ACDRz6zzz77775kX2amqfp1lw6qxXL7p/wC+++Nu2F69Ab+pTPCUI8IB8++++Y/EgGrMPdOKsOs/6xxd+++++2+yyyyyyyyyyyyyy++++++3gw888888888888888+++++qAQw8I0wIc4gQwwwIV+++++qAA0Eo8gw4EsU0QgAV+++++qAIsY0sgAQc8M4c8IV+++++qAIIEEAsAoUMYY0woV+++++qAEIskcUsskM4gUgoV+++++qAAYUs8E0UUsUAEMAV+++++qAM4gE4gC0EgkgoogV+++++qAEEgUsAtC3kYos4IV+++++qAEwsEw8TuU0g0wooV+++++qAQssM0YQ4gcU4o0IV+++++qAAcc80Q0YYswMAAAV+++++qAY40wocg400QUA0AV+++++qAQ80wsEQIEw4okgIV+++++qAEcQ4A00UQkoowYgV+++++qAYQwoE44cAcMAgYIV+++++qAIAAIAAAEMAAAMAIV+++++qA4EkMMg8cYIMUwcIV+++++vAAAAAAAAAAAAAAAAV2+++++LMMMMMMMMMMMMMMMc++++++++l98k714o1+w0+++++++++++8kO9dXeaO4Ke+++++++++++++++++++++++++++++//xAAhEQADAAICAgMBAQAAAAAAAAAAARExUSFAEEEgMGFQcf/aAAgBAwEBPxD5NpZP2P260j2NTrAtkNLBiRTqMbqG/wB+JKL+LXsr2V7K9leyvZXsr2V7K9leyvZXsr2V7K9leyvZXsr2V7K9le/hPjPEZHon2xyLCiP8HMK/zwr1TBnMRjwjMAk7gaejFs4KwZcH4P0N1/FsmU8G8PAnxW/CjkKDkU4FTNEjRSURgy2T0GrhDXLj5J1wS4G7yXwN8hP0LOKDbahZdo3YkexNoTDZu+QbvcSrgkeiLRGiNEaI0RojRGiNEaI0RojRGiNCEqvlg65g65g65g65g65g65g65g+p/aYOuYOuYOuYOuYOuYOuYOuYOuYOuYuwILLLLLLLLLLLLLLLG+X0pUhYk2QjLJSPxHkn2ZnoomXkeC8ZF6Lx43gfe//EACIRAAICAgIDAAMBAAAAAAAAAAABETEgYSFAEDBBUFFxof/aAAgBAgEBPxDJM6NJp6w74Sl/U+BKjGdQ6kXUQlDQkUvA3Ln8LH9Go1Go1Go1Go1Go1Go1Go1Go1Go1Go1Go1eZSIFkqiBRKvxBfTcJp0THhuPCadeiXA5lLP7OKDSn6P8DjmEcUOJypORyi8ZR9CaFDCm4QVtPkXHmR/rIkI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'/>&nbsp;")
    sponsorElement.append("<img alt='wx' width='35%' src='data:image/jpeg;base64,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'/>")
    sponsorElement.scrollTop(sponsorElement[0].scrollHeight)
}
const showStatement = () => {
    statementElement = $("<div></div>")
    statementElement.addClass('container-text')
    $(".popup").append(statementElement)

    statementElement.append("<h4 style='width: 100%; text-align: center;'>成都文理学院刷课助手 使用说明</h4><br><br>")
    statementElement.append("1. 您使用本插件，即表示您同意本使用条款；如果您不同意，请勿使用本插件。<br>")
    statementElement.append("2. 此脚本仅用于学习研究，您必须在下载后24小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。<br>")
    statementElement.append("3. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。<br>")
    statementElement.append("4. 本人对此脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害（如封禁、限制等）。<br>")
    statementElement.append("5. 若有信息功能侵犯到您的权益，请及时联系作者。<br>")
    statementElement.append("6. 任何以任何方式查看此脚本的人或直接或间接使用此脚本的使用者都应仔细阅读此条款。<br>")
    statementElement.append("7. 本人保留随时更改或补充此条款的权利，一旦您使用或复制或修改了此脚本，即视为您已接受此免责条款。<br>")
    statementElement.scrollTop(statementElement[0].scrollHeight)
}
const showClassOption = () => {
    containerTextElement = $("<div></div>")
    containerTextElement.addClass('container-text')
    $(".popup").append(containerTextElement)
    addText("<h4>提示1</h4>：如果开启了系统代理，要先关闭！")
    addText("<h4>提示2</h4>：本脚本仅支持PC端，如果不起作用，点油猴图标看是否有提示 \"<b>Please enable developer mode...</b>\"，若有，点击查看 <a target='_blank' href='https://www.baidu.com/s?wd=%E6%B2%B9%E7%8C%B4%20Please%20enable%20developer'>油猴插件不能使用</a>")
    addText("<h4>提示3</h4>：安装过老版本的需要把老版本删除或者禁用。")
    addText("<h4>提示4</h4>：因不同浏览器的优化策略问题，如果发现<b>学时没变</b>，看视频时请<b>将浏览器置于前台运行</b>。<br>")
    addText("启动成功...")
}
const showExamOption = () => {
    examTextElement = $("<div></div>")
    examTextElement.addClass('container-exam')
    $(".popup").append(examTextElement)
    examTextElement.append("<h4>提示1</h4>：如果开启了系统代理，要先关闭！<br>")
    examTextElement.append("<h4>提示2</h4>：本脚本仅支持PC端，如果不起作用，点油猴图标看是否有提示 \"<b>Please enable developer mode...</b>\"，若有，点击查看 <a target='_blank' href='https://www.baidu.com/s?wd=%E6%B2%B9%E7%8C%B4%20Please%20enable%20developer'>油猴插件不能使用</a><br>")
    examTextElement.append("<h4>提示3</h4>：安装过老版本的需要把老版本删除或者禁用。<br>")
    examTextElement.append("<h4>提示4</h4>：对接的是抖音豆包，因为是AI，<b>所以不能保证完全正确，分数高低与作者无关</b>，如果有所担心可在搜完后再自己手动搜一遍<br>")
    examTextElement.append("启动成功...<br><br>")

    endpoint_id = GM_getValue("endpoint_id", "")
    apikey = GM_getValue("apikey", "")
    useTermDb = GM_getValue("useTermDb", false)
    let termSwitch = $("<input type='checkbox' style='width: auto;'>")
    termSwitch.prop('checked', useTermDb)
    examTextElement.append("开启题库搜题：")
    examTextElement.append(termSwitch)
    examTextElement.append("（目前题量较少）")
    termSwitch.change(function() {
        if ($(this).prop('checked')) {
            GM_setValue("useTermDb", true)
        } else {
            GM_setValue("useTermDb", false)
        }
    });
    examTextElement.append("<br>搜题配置：点击链接 👉 <a target='_blank' href='https://pan.baidu.com/s/1YMk6Fqv6Bmr1jU0FlQXqNQ?pwd=6666'>视频教程</a> | <a target='_blank' href='https://kdocs.cn/l/clJtV1RU8GDe'>获取搜题接入点ID和API Key</a><br>")
    let endpointDiv = $("<div></div>")
    endpointDiv.append("<span>接入点ID：</span>")
    let endpointInput = $("<input type='text' value='"+endpoint_id+"'/>")
    endpointInput.on("keyup", e=>{
        endpoint_id = e.target.value
        GM_setValue("endpoint_id", endpoint_id)
    })
    endpointDiv.append(endpointInput)

    let apikeyDiv = $("<div></div>")
    apikeyDiv.append("<span>API Key： </span>")
    let apikeyInput = $("<input type='text' value='"+apikey+"'/>")
    apikeyInput.on("keyup", e=>{
        apikey = e.target.value
        GM_setValue("apikey", apikey)
    })
    apikeyDiv.append(apikeyInput)

    examTextElement.append(endpointDiv)
    examTextElement.append(apikeyDiv)

    let startBtn = $("<button>开始搜题</button>")
    let stopBtn = $("<button>停止搜题</button>")
    let saveBtn = $("<button>保存配置</button>")
    examTextElement.append(saveBtn)
    examTextElement.append(startBtn)
    examTextElement.append(stopBtn)
    examCurrent = parseInt($(".topic-head.on").text()) - 1
    examTextElement.append("<div style='margin: 0;' id='examStatus'></div>")
    setExamStatus("已停止。搜题将从当前题开始");
    if ($("#startArea").length == 1){
        setExamStatus("等待答题...");
    }
    if ($(".courseexam-list").find(".time").text().includes("已交卷")) {
        setExamStatus("已交卷,不可继续答题");
    }
    saveBtn.on("click", ()=>{
        endpointInput[0].value = endpointInput[0].value.trim()
        apikeyInput[0].value = apikeyInput[0].value.trim()
        GM_setValue("endpoint_id", endpointInput[0].value)
        GM_setValue("apikey", apikeyInput[0].value)
        setExamStatus("保存成功！");
    })
    startBtn.on("click",async ()=>{
        if (startFlag) return;
        startFlag = true;
        examCurrent = parseInt($(".topic-head.on").text()) - 1
        let n = $(".courseexamcon-intro").find("ul").children("li").length;
        useTermDb = GM_getValue("useTermDb", false)
        for (; examCurrent < n; examCurrent++) {
            if (!startFlag) break;
            let tab = $("#topic-tab-" + examCurrent)
            setExamStatus("进行中...正在搜索第 " + ( examCurrent + 1 ) + " 题")
            await pause(1)
            // 1 单选 2 多选 3 判断
            let type = parseInt(tab.find(".courseexamcon-main").data("type"))
            if ([1, 2, 3].includes(type)){
                if (type === 2){
                    tab.find("label").each(function(index, element){
                        $(element).find("input").prop("checked", false)
                    })
                }
                if (useTermDb) {
                    let question = tab.find(".courseexamcon-main .name").text().trim()
                    try{
                        let answer = await useTermDbGetAnswer(question)
                        if (answer) {
                            setExamStatus("题库搜题 第 " + (examCurrent + 1) + " 题答案：" + answer.answer)
                            let answerList = answer.answer.replaceAll(",", "，").split("，")
                            let flag = false
                            tab.find("label").each(function(index, element){
                                if (answerList.some(item => element.innerText.includes(item))){
                                    flag = true
                                    $(element).find("input").prop("checked", true)
                                }
                            })
                            if (flag) {
                                await pause(3)
                                let btn = tab.find("input[value='保存修改']")
                                if (btn.css("display") == "none"){
                                    tab.find("input[value='继续下一题']").click()
                                }else{
                                    btn.click()
                                    $(".courseexamcon-intro").find("ul").children("li")[examCurrent + 1].querySelector("a").click()
                                }
                                continue
                            }
                        }
                    }catch(e){
                        setExamStatus(e)
                    }
                }
                try {
                    let question = tab.find(".courseexamcon-main")[0].innerText.replaceAll("\n.\n", ".");
                    let answer = await getAnswer(question);
                    answer = answer.match(/[a-zA-Z]+/)[0];
                    setExamStatus("AI搜题 第 " + (examCurrent + 1) + " 题答案：" + answer);
                    let answerList = answer.split("")
                    console.log(answerList)
                    tab.find("label").each(function(index, element){
                        if (answerList.some(item => element.innerText.includes(item))){
                            flag = true
                            $(element).find("input").prop("checked", true)
                        }
                    })
                } catch (e){
                    startFlag = false
                    setExamStatus("出错已停止 - " + e);
                    return
                }
            }else{
                setExamStatus("未添加该题型，跳过...")
            }
            await pause(3)
            let btn = tab.find("input[value='保存修改']")
            if (btn.css("display") == "none"){
                tab.find("input[value='继续下一题']").click()
            }else{
                btn.click()
                $(".courseexamcon-intro").find("ul").children("li")[examCurrent + 1].querySelector("a").click()
            }
        }
        startFlag = false
        setExamStatus("已停止。下次搜题将从当前题开始");
    })

    stopBtn.on("click", ()=>{
        startFlag = false
        setExamStatus("程序将在 3 秒内停止。下次搜题将从当前题开始")
    })
}
const setExamStatus = text => {
    $("#examStatus").text("当前状态："+text)
}
// 添加样式
const addStyle = () => {
    const style = $("<style></style>")
    style.prop('type', 'text/css')
    style.html(
        `
.mini {
    position: fixed;
    top: 50px;
    left: 150px;
    width: 50px;
    height: 50px;
    display: none;
    z-index: 99999999999999999;
    background: #bb241d;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 8px 2px;
}
.popup {
    position: fixed;
    top: 50px;
    left: 150px;
    width: 540px;
    font: 14px Menlo, Monaco, Consolas, "Courier New", monospace;
    z-index: 9999999999999999999999;
    background-color: #fff;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, .3);
    padding: 10px;
    border-radius: 5px;
}
.popup h4{
    display: inline-block;
}
.popup b{
    color: red;
}
.popup a{
    color: blue;
}

.container-header {
    height: 30px;
    cursor: move;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
}
.container-header button{
    margin-left: 10px;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 1px solid;
}
.container-header button:hover{
    color: red;
}

.container-text, .container-exam {
    margin-top: 10px;
    max-height: 250px;
    min-height: 30px;
    overflow: auto;
}
.container-exam {
    max-height: 330px;
}

.container-sponsor {
    max-height: 400px;
}

.container-exam div{
    margin: 10px 0;
}

.container-exam input{
    border: 1px solid #000000;
    width: 400px;
    padding: 3px;
    padding-left: 5px;
    border-radius: 3px;
}
.container-exam button{
    color: red;
    padding: 3px 10px;
    background: #ba251e;
    color: white;
    border-radius: 3px;
    cursor: pointer;
    margin: 10px 10px 10px 0;
    border: none;
}
.container-exam button:hover{
    background: pink;
}
        `
    )
    $('body').append(style);
}


// 添加交互文本
const addText = text => {
    containerTextElement.append(text + "<br>")
    containerTextElement.scrollTop(containerTextElement[0].scrollHeight)
}

// 暂停函数
function pause(start, end = undefined) {
    let delay = start;
    if (end) {
        delay = Math.floor(Math.random() * (end - start)) + start;
        addText(`等待 ${delay} 秒后继续...`);
    }
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, delay * 1000); // 将秒转换为毫秒
    });
}

const getAnswer = (question) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
            data: JSON.stringify({
                "model": endpoint_id,
                "messages": [
                    {
                        "role": "user",
                        "content": "只说选项号，不要说理由。\n" + question
                    }
                ]
            }),
            headers: {
                "Authorization": "Bearer " + apikey,
                "Content-Type": "application/json",
            },
            responseType: "json",
            onload: function (response) {
                if (response.status == 401) {
                    return reject("AI 接口错误！401")
                } else if (response.status == 200) {
                    try {
                        var answer = response.response["choices"][0].message.content;
                        return resolve(answer);
                    } catch (e) {
                        return reject("异常捕获：AI 接口错误！")
                    }
                } else {
                    return reject("AI 接口错误！")
                }
            }
        });
    })
}

const useTermDbGetAnswer = (question) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "http://119.8.102.43:5000/search_term?keyword=" + question || "",
            responseType: "json",
            timeout: 10000,
            ontimeout: async function (e) {
                return reject("题目获取超时，下一题...");
            },
            onload: function (response) {
                switch (response.status) {
                    case 200:
                        return resolve(response.response.data.terms[0]);
                    case 400:
                        return reject(response.response.message);
                    case 404:
                        return reject("页面不存在");
                    default:
                        return reject(`${response.statusText} ${response.status} - response 出错了`);
                }
            },
            onerror: function (error) {
                return reject(`${error.statusText} ${error.status} - error 出错了`);
            },
        });
    })
}

function addVideoTimer() {
    let count = 0
    videoTimer = setInterval(() => {
        videoElement = document.querySelector("video");
        layuiLayerContent = $('.layui-layer-content');
        if (videoElement && layuiLayerContent.length === 0) {
            setVideoElement();
            if (videoElement.paused) {
                count++
                if (count > 60) {
                    location.reload();  // 刷新当前页面
                }
                videoElement.play();
                if (videoElement.readyState === 4) {
                    const message = containerTextElement.text().includes("视频加载完成")
                        ? "请将浏览器置于前台运行。（若学时会增加可忽略）" : "视频加载完成，准备播放";
                    addText(message);
                }
            }
        }
    }, 1000)
}
// 初始化程序
const init = async () => {
    addContainer()
    addStyle()
    showClassOption()
    showExamOption()
    showStatement()
    showSponsor()
}

function FirstUse(){
    var fisrtUse = GM_getValue("fisrtUse", true);
    if (fisrtUse) {
        var mzsm = prompt("成都文理学院刷课助手|自动刷课|考试自动答题\n若要使用，请阅读并同意以下免责条款。\n\n \
1. 此脚本仅用于学习研究，您必须在下载后24小时内将所有内容从您的计算机或手机或任何存储设备中完全删除，若违反规定引起任何事件本人对此均不负责。\n \
2. 请勿将此脚本用于任何商业或非法目的，若违反规定请自行对此负责。\n \
3. 本人对此脚本引发的问题概不负责，包括但不限于由脚本错误引起的任何损失和损害（如封禁、限制等）。\n \
4. 若有信息功能侵犯到您的权益，请及时联系作者。\n \
5. 任何以任何方式查看此脚本的人或直接或间接使用此脚本的使用者都应仔细阅读此条款。\n \
6. 本人保留随时更改或补充此条款的权利，一旦您使用或复制或修改了此脚本，即视为您已接受此免责条款。\n\n \
若您同意以上内容，请输入“我已阅读并同意以上内容” 然后开始使用。", "");
        if (mzsm == "我已阅读并同意以上内容") {
            GM_setValue("fisrtUse", false);
            return false;
        }
        else {
            alert("免责条款未同意，脚本停止运行。\n若不想使用，请自行禁用脚本，以免每个页面都弹出该提示。");
            return true;
        }
    }
}

function matchIcon() {
    let iconLink = document.querySelector("link[rel='shortcut icon']");
    return iconLink && /yinghua|canghui|gyxy|ruren|zjxkeji|yuncanjykeji|luzkeji/.test(iconLink.getAttribute("href"));
}

// 运行程序
(function () {
    'use strict';

    if (!matchIcon()) return;
    if (FirstUse()) return;

    window.addEventListener("load", async function (){
        await init()
        // await test()
        if (window.location.href.includes("/node")) {
            $(".classTabBtn").click()
            addText("初始化完成，可以解放双手了；为了更像人为点击，将会延时一段时间再播放<br>")
            await pause(5, 10)
            addVideoTimer();
            getCurrent()
            checkCaptchaTimer = setInterval(playVideo, 1000);
        }else if (window.location.href.includes("/exam")){
            $(".examTab1").click()
            $(".minimize").click()
        }else{
            $(".classTabBtn").click()
            addText("请点进课程内容，进行学习...<br>")
        }
    });
})();

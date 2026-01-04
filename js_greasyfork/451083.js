// ==UserScript==
// @name         [wnssedu]东莞理工学院就业学习平台
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  就业学习平台刷课!我不确定其他学校能不能用，没测试过。
// @author       Chi
// @match        https://*.wnssedu.com/course/newcourse/watch.htm*
// @icon         data:image/jpeg;base64,/9j/4QlQaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/90ABAAI/+4ADkFkb2JlAGTAAAAAAf/AABEIAD8APwMAEQABEQECEQH/xABsAAABBAMBAQAAAAAAAAAAAAAHAAUGCgMECAECAQEAAAAAAAAAAAAAAAAAAAAAEAABBQAABgICAQIHAAAAAAAEAQIDBQYABxESExQVISIxFiNRJCUmM0Fi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
// @grant        unsafeWindow
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451083/%5Bwnssedu%5D%E4%B8%9C%E8%8E%9E%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E5%B0%B1%E4%B8%9A%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/451083/%5Bwnssedu%5D%E4%B8%9C%E8%8E%9E%E7%90%86%E5%B7%A5%E5%AD%A6%E9%99%A2%E5%B0%B1%E4%B8%9A%E5%AD%A6%E4%B9%A0%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function () {
    "use strict";
    let workList
    var cbl = document.createElement("div");
    var b1 = document.createElement("button");
    let run = true
    $(unsafeWindow.document).ready(function () {
        setTimeout(() => {
            getWorkList()
            render()
        }, 1000);
    })


    function render() {
        cbl.setAttribute("style", "width: 60px;height: 74px;overflow: hidden;position: fixed;right: 10px;bottom: 10%;padding: 4px;background-color: #0093E9;z-index: 9999;border: 1px solid rgb(233, 234, 236);border-radius: 4px;justify-content: center;align-items: center;display: flex;");
        cbl.setAttribute("id", "set-auto");
        document.querySelector('body').appendChild(cbl);
        b1.innerText = "开始"
        b1.onclick = play
        cbl.append(b1)
    }

    function getWorkList() {
        let courseId = getUrlParams("courseId");
        $.ajax({
            type: "get",
            url: "/course/rest/v1/newcourse/getNewCourseVideoList",
            data: {
                lNewCourseId: courseId
            },
            dataType: "json",
            success: (res) => {
                let chapter_list = $(".chapter_list")[0].childNodes;
                workList = res.response.cdoList;

                for (let index = 0; index < chapter_list.length; index++) {
                    const element = chapter_list[index];
                    const item = workList[index];
                    let percentage = parseInt(
                        (item.nViewTimeLength / item.nTimeLength) * 100
                    );
                    element.childNodes[0].childNodes[1].innerHTML =
                        "<span style='color: red;'>【" +
                        percentage +
                        "%】</span>" + item.nOrder + "." +
                        item.strVideoName;
                }
            },
        });
    }

    function play() {
        if (b1.innerText == "开始") {
            b1.innerText = "停止"
            run = true
            let chapter_list = $(".chapter_list")[0].childNodes;
            let cur = 0;
            for (let index = 0; index < chapter_list.length; index++) {
                const element = chapter_list[index];
                if (element.classList[0] == "active") cur = index;
            }
            work(cur)
        } else {
            b1.innerText = "开始"
            run = false
        }

    }

    function work(cur) {
        let chapter_list = $(".chapter_list")[0].childNodes;
        const element = chapter_list[cur];
        let item = workList[cur]
        let num = item.nViewTimeLength
        let t = setInterval(() => {
            if (!run) {
                clearInterval(t)
                return
            }
            if ($(".pv-ask-skip ")[0]) {
                $(".pv-ask-skip ")[0].click()
            } else if (num >= item.nTimeLength) {
                clearInterval(t)
                if (cur + 1 < chapter_list.length) {
                    if ($(".next_btn_section")[0]) {
                        $(".next_btn_section")[0].click()
                        setTimeout(_ => {
                            work(cur + 1)
                        }, 1000)
                    }
                } else {
                    run = false
                    b1.innerText = "开始"
                    window.history.back();
                }
            } else if (num < item.nTimeLength) {
                num = num + 1
                item.nViewTimeLength=num
                let percentage = parseInt(
                    (item.nViewTimeLength / item.nTimeLength) * 100
                );
                element.childNodes[0].childNodes[1].innerHTML =
                    "<span style='color: red;'>【" +
                    percentage +
                    "%】</span>" + item.nOrder + "." +
                    item.strVideoName;
                // nPlayerState = 0
                // sendRecordTime()
                record()
            }
        }, 1000)
    }

    function record() {
        var dataurl = getSendUrl();
        try { // 调用计时函数
            jQuery.ajax({
                type: "post",
                url: '/course/Servlet/recordStudy.svl' + "?" + dataurl,
                dataType: "html",
                cache: false,
                success: function (data) {

                },
                error: function (errorcode) {
                    console.log(errorcode);
                    run = false
                    b1.innerText = "开始"
                }
            });
        } catch (e) { // 调用出错啦
            console.log("计时异常：" + e);
        }
    }

    function getUrlParams(key) {
        let search = window.location.search.substring(1).split("&");
        for (let index = 0; index < search.length; index++) {
            let t = search[index].split("=");
            if (t[0] === key) return t[1];
        }
    }
})();
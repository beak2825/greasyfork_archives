// ==UserScript==
// @name         喵绅士(nyahentai)
// @namespace    https://github.com/dffxd-suntra/nyahentai-plus
// @version      3.0
// @description  正式可用,让新版喵绅士有长条预览功能
// @homepageURL  https://github.com/dffxd-suntra/nyahentai-plus
// @supportURL   https://github.com/dffxd-suntra/nyahentai-plus
// @match        *://nyahentai.red/*
// @match        *://nhentai.xxx/*
// @match        *://nhentai.net/*
// @icon         https://nyahentai.red/front/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js
// @require      https://cdn.jsdelivr.net/npm/axios@1.4.0/dist/axios.min.js
// @require      https://cdn.jsdelivr.net/npm/keyboardjs@2.7.0/dist/keyboard.min.js
// @author       Suntra
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449215/%E5%96%B5%E7%BB%85%E5%A3%AB%28nyahentai%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449215/%E5%96%B5%E7%BB%85%E5%A3%AB%28nyahentai%29.meta.js
// ==/UserScript==

(function () {
    let loadingImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE7WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA1LTMwVDIyOjMzOjE0KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTA1LTMwVDIyOjMzOjE0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNS0zMFQyMjozMzoxNCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTlmYWFhY2MtZGQ5Zi0yMDRlLTk5MGQtMWZiNzFiYjhhYThhIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5ZmFhYWNjLWRkOWYtMjA0ZS05OTBkLTFmYjcxYmI4YWE4YSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjE5ZmFhYWNjLWRkOWYtMjA0ZS05OTBkLTFmYjcxYmI4YWE4YSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTlmYWFhY2MtZGQ5Zi0yMDRlLTk5MGQtMWZiNzFiYjhhYThhIiBzdEV2dDp3aGVuPSIyMDIzLTA1LTMwVDIyOjMzOjE0KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ejvILQAAAApJREFUCJljKAcAAHkAeO/tISkAAAAASUVORK5CYII=";
    let imgWidth = GM_getValue("imgWidth", 60);
    let scrolling = false;
    let preUrl = null;
    // 讲htmlStr加载为document
    async function loadHtml(url) {
        const response = await axios(url);
        if (response.data == "" || response.status != 200) {
            console.error(response);
            throw new Error("网页获取错误");
        }
        return new window.DOMParser().parseFromString(response.data, "text/html");
    }
    // 根据图片阅览页面获取链接,这是备用方法,图片加载错误触发
    async function getPicByPage(url) {
        let detailDocument = await loadHtml(url);
        return $("#image-container > a > img", detailDocument).attr("src");
    }
    // 开始阅览
    async function startView(url) {
        if (preUrl != url) {
            $("#nyap-read-page-img").html("");
        }
        if (!url.endsWith("/")) {
            url += "/";
        }
        preUrl = url;
        let detailDocument = await loadHtml(url);
        let pages = parseInt($("#tags", detailDocument).children(":contains('Pages')").find(".tag").text());
        let tempUrl = $("#cover > a > img", detailDocument).attr("src").split("/").slice(0, -1).join("/") + "/";
        // 根据封面的图片后缀预测正文后缀
        let picSuffix = $("#cover > a > img", detailDocument).attr("src").split(".").pop();
        console.log(`pages: ${pages}\ntempUrl: ${tempUrl}\npicSuffix: ${picSuffix}`);

        // 一下都添加,但是有lazysize, 懒加载让页面不卡
        for (let i = 1; i <= pages; i++) {
            $("#nyap-read-page-img").append(
                $("<span>")
                    .text(`${i}/${pages} page`)
                    .css({
                        color: "gray",
                        position: "absolute",
                        left: 0
                    }),
                $("<img>")
                    .attr("src", loadingImg)
                    .attr("data-src", `${tempUrl + i}.${picSuffix}`)
                    .addClass("lazyload")
                    .css({
                        width: "100%",
                        padding: 0,
                        margin: 0,
                        display: "block"
                    })
                    // 出错是图片后缀出问题了,将图片浏览页面打开获取链接
                    .on("error", async function (event) {
                        $(this).attr("src", loadingImg);
                        $(this).attr("src", await getPicByPage(`${url}${i}/`));
                    })
            );
        }
    }
    // 记忆化改变宽度
    function changeWidth(x) {
        imgWidth = Math.max(1, imgWidth + x);
        GM_setValue("imgWidth", imgWidth);
        // 以屏幕中线缩放,避免改变阅览进度
        let readProgress = ($("#nyap-read-page").scrollTop() + $(window).height() / 2) / $("#nyap-read-page").prop("scrollHeight");
        $("#nyap-read-page-img").css("width", imgWidth + "%");
        $("#showWidth").text(imgWidth + "%");
        $("#nyap-read-page").scrollTop(readProgress * $("#nyap-read-page").prop("scrollHeight") - $(window).height() / 2);
    }
    // 滚动函数,用 requestAnimationFrame, 不会卡顿
    // 因为 requestAnimationFrame 一般是一帧运行一次
    function startScroll(ms) {
        scrolling = true;
        let previousTimeStamp;
        let sum = 0;
        function step(time) {
            if (previousTimeStamp != undefined) {
                sum += ($(window).height() / ms) * (time - previousTimeStamp);
                $("#nyap-read-page").scrollTop($("#nyap-read-page").scrollTop() + sum);
                // 页面的滚动是以像素为单位(int),所以小于1像素要等下一次一起滚动
                sum %= 1;
            }
            if (scrolling) {
                previousTimeStamp = time;
                // 进行下一次的滚动
                window.requestAnimationFrame(step);
            }
        }
        window.requestAnimationFrame(step);
        $("#nyap-read-page-scroll").text("结束");
    }
    function endScroll() {
        scrolling = false;
        $("#nyap-read-page-scroll").text("滚动");
    }
    // 页面样式
    $("body").prepend(`
    <div style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 114514;display: none;background: rgba(0, 0, 0, 95%);overflow: auto;-webkit-user-select: none;user-select: none;" id="nyap-read-page">
        <div style="position: fixed;bottom: 10px;right: 10px;">
            <h1 id="showWidth" style="text-shadow: 0px 0px 4px black;">${imgWidth}%</h1>
            <div id="nyap-read-page-img-change-width">
                <button type="button" class="btn btn-primary">+1</button><br>
                <button type="button" class="btn btn-primary">+5</button><br>
                <button type="button" class="btn btn-primary">+10</button><br>
                <button type="button" class="btn btn-primary">-10</button><br>
                <button type="button" class="btn btn-primary">-5</button><br>
                <button type="button" class="btn btn-primary">-1</button><br>
            </div>
            <input type="text" id="nyap-read-page-scroll-speed" class="btn btn-secondary" title="几毫秒滚完一个屏幕" style="width: 5em;" /><br>
            <button type="button" id="nyap-read-page-scroll"  class="btn btn-primary">滚动</button><br>
            <button type="button" id="nyap-read-page-hide"  class="btn btn-primary">关闭</button><br>
            <button type="button" id="nyap-read-page-toTop" class="btn btn-primary">顶部</button>
        </div>
        <center>
            <div id="nyap-read-page-img" style="width: ${imgWidth}%"></div>
        </center>
    </div>
    `);
    // 检测详情界面
    if (/^\/g\/.+\/?$/.test(location.pathname)) {
        $("#info > div").prepend($(`<button class="btn btn-primary" id="nyap-read-page-show">垂直阅读</button>`).data("page-link", location.href));
    }
    // 添加快捷阅读标志
    $(".gallery > .cover").each(function (index, node) {
        $(node).append(
            $(`<a id="nyap-read-page-show" style="position: absolute;right: 0;bottom: 0;"><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16"><path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"/></svg></a>`).data("page-link", $(node).attr("href"))
        );
    });
    // 记忆化
    $("#nyap-read-page-scroll-speed").val(GM_getValue("scrollSpeed", 8000));
    // 切换开,关
    $("*#nyap-read-page-show").click(function (event) {
        event.preventDefault();
        keyboardJS.setContext("view");
        $("#nyap-read-page").scrollTop(0);
        $("body").css("overflow", "hidden");
        $("#nyap-read-page").show();
        startView($(this).data("page-link"));
    });
    $("#nyap-read-page-hide").click(function () {
        keyboardJS.setContext("index");
        $("body").css("overflow", "");
        $("#nyap-read-page").hide();
        endScroll();
    });
    // totop
    $("#nyap-read-page-toTop").click(function () {
        $("#nyap-read-page").scrollTop(0);
    });
    // 切换宽度
    $("#nyap-read-page-img-change-width").click(function ({ target }) {
        if ($(target).attr("id") == "nyap-read-page-img-change-width") {
            return;
        }
        changeWidth(parseInt($(target).text()));
    });
    // 设置滚动
    $("#nyap-read-page-scroll").click(function () {
        if (scrolling) {
            endScroll();
        } else {
            let ms = parseInt($("#nyap-read-page-scroll-speed").val());
            if (!ms) {
                return;
            }
            startScroll(ms);
        }
    });
    $("#nyap-read-page-scroll-speed").on("input", function () {
        GM_setValue("scrollSpeed", $(this).val());
    });
    // 快捷键
    keyboardJS.withContext("index", function () {
        keyboardJS.bind("left", function (e) {
            let url = new URL(location.href);
            let page = Math.max(parseInt(url.searchParams.get("page")), 1) || 1;
            if (page == 1) {
                return;
            }
            page--;
            url.searchParams.set("page", page);
            location.href = url.href;
        });
        keyboardJS.bind("right", function (e) {
            let url = new URL(location.href);
            let page = Math.max(parseInt(url.searchParams.get("page")), 1) || 1;
            page++;
            url.searchParams.set("page", page);
            location.href = url.href;
        });
    });
    keyboardJS.withContext("view", function () {
        keyboardJS.bind("esc", function (e) {
            if (scrolling) {
                endScroll();
                return;
            }
            $("#nyap-read-page-hide").click();
        });
    });
    keyboardJS.setContext("index");
})();

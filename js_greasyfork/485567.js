// ==UserScript==
// @name         抖音用户视频照片打包下载（随机小姐姐）
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  半自动获取抖音某用户全部视频与照片，配套网站随机获取资源
// @author       N0ts
// @match        https://www.douyin.com/user/*
// @downloadURL https://update.greasyfork.org/scripts/485567/%E6%8A%96%E9%9F%B3%E7%94%A8%E6%88%B7%E8%A7%86%E9%A2%91%E7%85%A7%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%EF%BC%88%E9%9A%8F%E6%9C%BA%E5%B0%8F%E5%A7%90%E5%A7%90%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/485567/%E6%8A%96%E9%9F%B3%E7%94%A8%E6%88%B7%E8%A7%86%E9%A2%91%E7%85%A7%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD%EF%BC%88%E9%9A%8F%E6%9C%BA%E5%B0%8F%E5%A7%90%E5%A7%90%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    // 数据操作密码
    const apiPassword = "";
    // API 地址
    const apiServer = "";

    // 视频列表
    const videos = [];
    // 图片（图文封面）列表
    const imgs = [];
    // 昵称
    const nickname = document.querySelector("div[data-e2e=user-info]").children[0].children[0].innerText;
    // 主页地址
    const userUrl = window.location.origin + window.location.pathname;
    // 已经爬过的数据 ID
    let successId = [];

    // 全部视频 li 标签
    let li = null;

    // 一条龙（扒数据，下载，上传）
    let ok = false;

    /**
     * 修改颜色为完成
     * @param {HTMLElement} dom dom
     */
    function changeColor(dom) {
        dom.style.backgroundColor = "#00a32b";
        scrollToTop(dom.offsetTop + dom.clientHeight / 2);
    }

    /**
     * 图文获取事件
     * @param {*} event li
     */
    function liHandle(event) {
        // 如果是图文的话
        if (
            event.target.querySelector(".user-video-stats-tag") &&
            (event.target.querySelectorAll(".user-video-tag").length == 2 ||
                event.target.querySelector(".user-video-stats-tag").innerText.includes("图文"))
        ) {
            // 获取图片链接
            const url = event.target.querySelector("img").getAttribute("src");
            // 存到图片列表
            arrPush(
                {
                    url,
                    img: url,
                    desc: event.target.querySelector("p").innerText,
                    suffix: "jpg"
                },
                imgs
            );
            // 渲染到视图
            addScreen(imgDom, imgs);
            // 改颜色
            changeColor(event.target);
            console.log(`已获取 视频：${videos.length}，图片：${imgs.length}，共：${videos.length + imgs.length}`);
            start();
        }
    }

    /**
     * li 标签数据处理
     */
    function liInit() {
        li = Array.from(document.querySelectorAll("div[data-e2e=user-post-list] li"));
        console.log(`插件启动，已检测到 ${li.length} 条数据`);

        li.forEach((li) => {
            // 遍历给上颜色
            li.style.backgroundColor = "#ff4444";

            // 鼠标进入事件指定
            li.addEventListener("mouseenter", liHandle);
        });
    }

    /**
     * 获取图片数据
     */
    function getImgs(eventDom) {
        function cb() {
            return setTimeout(() => {
                getImgs(eventDom);
            }, 100);
        }

        let infoImgs = document.querySelectorAll(".slider-video .focusPanel > div");

        // 如果没读到则元素没加载完成
        if (!infoImgs[0]) {
            return cb();
        }

        // 获取当前屏幕中的图片元素
        for (let dom of infoImgs) {
            if (dom.getBoundingClientRect().top == 0) {
                infoImgs = dom.children;
                break;
            }
        }

        // 图片链接
        let cache = [];
        for (let dom of infoImgs) {
            const imgs = dom.querySelectorAll("img");
            // 第二张为高清图片
            const src = imgs[1].getAttribute("src");
            // 是否为 dy 临时图片，临时图片则代表没加载完成
            if (src.substring(0, 2) == "//") {
                return cb();
            }
            if (!cache.includes(src)) {
                cache.push(src);
            }
        }

        // 可能出现因为太没拿到图片，再次检测数量是否符合
        if (cache.length != infoImgs.length) {
            return cb();
        }

        let end = false;
        // 存到图片列表
        cache.forEach((img) => {
            // 获取图片唯一标识
            const cache1 = img.split("/");
            const key = cache1[cache1.length - 1].split("~")[0];

            if (successId.includes(key)) {
                end = true;
                return;
            }
            arrPush(
                {
                    url: img,
                    img: img,
                    desc: eventDom.querySelector("p").innerText,
                    suffix: "jpg",
                    key
                },
                imgs
            );
        });

        // 关闭详情
        document.querySelector(".isDark").click();
        // 改颜色
        changeColor(eventDom);

        if (end) {
            handleIndex = li.length;
            console.log("往期视频已经获取过，无需重复获取，程序结束");
            return start();
        }

        // 渲染到视图
        addScreen(imgDom, imgs);
        console.log(`已获取 视频：${videos.length}，图片：${imgs.length}，共：${videos.length + imgs.length}`);

        setTimeout(() => {
            start();
        }, 100);
    }

    /**
     * 获取视频数据
     * @param {HTMLElement} dom li
     */
    function getVideo(dom) {
        dom.querySelector("a > div").dispatchEvent(new Event("mouseenter"));

        if (dom.innerText.includes("购买后可看")) {
            return start();
        }

        // 第三个 source 是真实地址
        const videoSource = dom.querySelectorAll("video source")[2];
        if (!videoSource) {
            return setTimeout(() => {
                getVideo(dom);
            }, 300);
        }

        // 获取视频 id，真实地址
        const regex = /video_id=([^&]+)/;
        const match = videoSource.getAttribute("src").match(regex);

        if (successId.includes(match[1])) {
            handleIndex = li.length;
            console.log("往期视频已经获取过，无需重复获取，程序结束");
            return start();
        }

        // 存到视频列表
        arrPush(
            {
                url: "//www.douyin.com/aweme/v1/play/?" + match[0],
                img: dom.querySelector("img").getAttribute("src"),
                desc: dom.querySelector("p").innerText,
                suffix: "mp4",
                key: match[1]
            },
            videos
        );
        // 改颜色
        changeColor(dom);
        // 渲染到视图
        addScreen(videoDom, videos);
        console.log(`已获取 视频：${videos.length}，图片：${imgs.length}，共：${videos.length + imgs.length}`);
        start();
    }

    // 处理索引
    let handleIndex = 0;

    /**
     * 程序开始
     */
    function start() {
        // 是否已经全部获取完成
        if (li.length == handleIndex) {
            loadBarChange(false);
            // 删除全部事件
            li.forEach((li) => {
                li.removeEventListener("mouseenter", liHandle);
            });
            console.log(
                `获取完成！其中视频：${videos.length}，图片：${imgs.length}，共：${videos.length + imgs.length}`
            );
            // 打印上传数据
            console.log("上传数据", {
                pwd: apiPassword,
                userUrl,
                nickname,
                download: false,
                list: [...videos, ...imgs]
            });

            if (ok) {
                uploadAll([...videos, ...imgs]);
                return downloadAll([...videos, ...imgs]);
            }

            // 延迟一下，不然最后个视频无法改背景色
            return setTimeout(() => {
                alert(`获取完成！其中视频：${videos.length}，图片：${imgs.length}，共：${videos.length + imgs.length}`);
            }, 500);
        }

        // 取出单个元素
        let oneLi = li[handleIndex];
        handleIndex++;

        loadBarChange(true, ((handleIndex + 1) / li.length) * 100);

        // 是否为图文
        if (
            oneLi.querySelector(".user-video-stats-tag") &&
            (oneLi.querySelectorAll(".user-video-tag").length == 2 ||
                oneLi.querySelector(".user-video-stats-tag").innerText.includes("图文"))
        ) {
            oneLi.querySelector("div > a").click();
            getImgs(oneLi);
        } else {
            getVideo(oneLi);
        }
    }

    /**
     * push 到数组并用 url 防止重复
     * @param {*} obj 需 push 对象
     * @param {*} arr 原数组
     */
    function arrPush(obj, arr) {
        for (const item of arr) {
            if (obj.url == item.url) {
                return;
            }
        }
        arr.push(obj);
    }

    /**
     * 渲染到对应视图
     * @param {*} dom 视图 dom
     * @param {*} arr 视图数据
     */
    function addScreen(dom, arr) {
        let cache = "";
        for (let i = 0; i < arr.length; i++) {
            cache =
                `<div><a href='${arr[i].url}' target='_blank'><img src='${arr[i].img}' /></a><p>${arr[i].desc}</p></div> ` +
                cache;
        }
        dom.innerHTML = cache;
    }

    /**
     * 下载全部
     * @param {*} arr 需下载数据
     * @param {*} list 结果合集
     */
    function downloadAll(arr, list = []) {
        console.log(`已下载 ${list.length}，还剩 ${arr.length}`);
        if (arr.length == 0) {
            alert(`${list.length} 完成下载`);
            return;
        }
        let item = arr.splice(0, 1);
        item = item[0];

        function fetchDownload() {
            fetch(item.url)
                .then((res) =>
                    res.blob().then((blob) => {
                        const a = document.createElement("a");
                        const url = window.URL.createObjectURL(blob);
                        const filename = `${item.key}.${item.suffix}`;
                        a.href = url;
                        a.download = filename;
                        a.click();
                        window.URL.revokeObjectURL(url);
                        a.remove();

                        list.push({
                            url: filename,
                            desc: item.desc,
                            suffix: item.suffix,
                            key: item.key
                        });

                        setTimeout(() => {
                            downloadAll(arr, list);
                        }, 100);
                    })
                )
                .catch((err) => {
                    console.log(`下载 ${list.length} 报错！尝试重新下载`, err.message);
                    setTimeout(() => {
                        fetchDownload();
                    }, 1000);
                });
        }

        fetchDownload();
    }

    /**
     * 滚动网页
     * @param {*} top 滚动高度
     */
    function scrollToTop(top) {
        document.querySelector("html").scrollTo({
            top,
            behavior: "smooth"
        });
    }

    /**
     * 进度条操作
     * @param {boolean} state 开启 Or 停止
     * @param {number} num 百分比进度
     */
    function loadBarChange(state, num = 0) {
        if (state) {
            banDom.style.visibility = "visible";
            loadBar.style.width = num + "%";
            loadBar.innerText = `${num.toFixed(0)}%`;
        } else {
            banDom.style.visibility = "hidden";
            loadBar.style.width = "0%";
            loadBar.innerText = "";
        }
    }

    /**
     * 滚动到最底部，没数据后开始
     */
    function scrollStart() {
        scrollToTop(document.body.scrollHeight);
        setTimeout(() => {
            if (document.querySelector("div[data-e2e=user-post-list]>div").innerText != "暂时没有更多了") {
                scrollStart();
            } else {
                scrollToTop(0);
                setTimeout(() => {
                    liInit();
                    start();
                }, 1000);
            }
        }, 1000);
    }

    /**
     * 上传全部
     * @param {*} arr 数据
     */
    function uploadAll(arr) {
        fetch(apiServer + "/save", {
            method: "post",
            body: JSON.stringify({
                pwd: apiPassword,
                userUrl,
                nickname,
                download: !ok,
                list: arr
            }),
            headers: {
                "content-type": "application/json"
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                ok = false;
                alert(res.msg);
            });
    }

    /**
     * 获取用户已经扒过的视频 id
     */
    async function getUserKeys() {
        if (!apiServer) return;
        const res = await fetch(apiServer + "/user/key?url=" + userUrl);
        const { data } = await res.json();
        successId = data;
    }

    // 主体操作区域
    const mainDom = document.createElement("div");
    mainDom.id = "n0ts";

    // 预览区域
    const viewDom = document.createElement("div");
    viewDom.className = "viewDom viewDomHidden";
    // 视频预览
    const videoDom = document.createElement("div");
    // 图片预览
    const imgDom = document.createElement("div");
    viewDom.appendChild(videoDom);
    viewDom.appendChild(imgDom);

    // 按钮们
    const btnDom = document.createElement("div");
    btnDom.classList.add("btns");

    const btn1 = document.createElement("button");
    btn1.innerText = "下载全部";
    btn1.addEventListener("click", () => {
        downloadAll([...videos, ...imgs]);
    });

    const btn2 = document.createElement("button");
    btn2.innerText = "开始扒取";
    btn2.addEventListener("click", async () => {
        banDom.style.visibility = "visible";
        await getUserKeys();
        scrollStart();
    });

    const btn3 = document.createElement("button");
    btn3.innerText = "预览结果";
    btn3.addEventListener("click", () => {
        if (viewDom.classList.contains("viewDomHidden")) {
            viewDom.classList.remove("viewDomHidden");
        } else {
            viewDom.classList.add("viewDomHidden");
        }
    });

    const btn4 = document.createElement("button");
    btn4.innerText = "上传全部";
    btn4.addEventListener("click", () => {
        uploadAll([...videos, ...imgs]);
    });

    const btn5 = document.createElement("button");
    btn5.innerText = "扒&下载&上传";
    btn5.addEventListener("click", async () => {
        ok = true;
        banDom.style.visibility = "visible";
        await getUserKeys();
        scrollStart();
    });

    btnDom.appendChild(btn2);
    btnDom.appendChild(btn1);
    btnDom.appendChild(btn4);
    btnDom.appendChild(btn3);
    btnDom.appendChild(btn5);

    // 遮挡遮罩，过程中不允许鼠标干涉
    const banDom = document.createElement("div");
    const loadBar = document.createElement("div");
    banDom.appendChild(loadBar);
    banDom.id = "banDom";

    // 元素插入
    mainDom.appendChild(viewDom);
    mainDom.appendChild(btnDom);
    document.body.appendChild(mainDom);
    document.body.appendChild(banDom);

    // css
    const css = document.createElement("style");
    css.innerText = `
        #n0ts {
            position: fixed;
            z-index: 9999;
            bottom: 0;
            left: 0;
        }

        #n0ts img {
            width: 100%;
        }

        #n0ts .btns {
            width: 105px;
            height: 140px;
            position: absolute;
            bottom: 0;
            left: 5px;
        }

        #n0ts .btns button {
            width: 100%;
            margin-bottom: 5px;
        }

        .viewDom {
            position: fixed;
            left: 50%;
            top: 50%;
            width: 75%;
            height: 90%;
            background: #e1e1e1;
            transform: translate(-50%, -50%);
            display: flex;
            justify-content: space-between;
        }

        .viewDomHidden {
            visibility: hidden;
        }

        .viewDom div {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
            overflow-y: auto;
        }

        .viewDom div > div {
            width: 48%;
        }

        #banDom {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9998;
            width: 100%;
            height: 100%;
            background: rgb(0 0 0 / 20%);
            visibility: hidden;
        }

        #banDom>div {
            position: absolute;
            top: 0;
            left: 0;
            width: 0%;
            height: 30px;
            background: #00c0ff;
            text-align: center;
            color: white;
            line-height: 30px;
            transition: all 0.2s;
        }
        `;
    document.head.appendChild(css);
})();

// ==UserScript==
// @license       MIT
// @name          简单的青柠起始页优化
// @namespace     https://bbs.tampermonkey.net.cn/
// @version       0.4.0
// @description   默认去掉青柠起始页的页脚，使用 alt + t 控制搜索框的显示隐藏 使用alt + g切换时钟显示隐藏，变量全局存储，不需要每次打开都关闭或者显示了 alt+b 显示隐藏 B站热搜 
// @author        Hei
// @match         *://limestart.cn/*
// @grant         GM_setClipboard
// @grant         unsafeWindow
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @grant         GM_getResourceURL
// @connect       api.bilibili.com
// @connect       at.alicdn.com
// @connect       i0.hdslb.com
// @connect       *
// @require       https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @resource css https://at.alicdn.com/t/c/font_4423350_7t2u8i9k77r.css
// @downloadURL https://update.greasyfork.org/scripts/488956/%E7%AE%80%E5%8D%95%E7%9A%84%E9%9D%92%E6%9F%A0%E8%B5%B7%E5%A7%8B%E9%A1%B5%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/488956/%E7%AE%80%E5%8D%95%E7%9A%84%E9%9D%92%E6%9F%A0%E8%B5%B7%E5%A7%8B%E9%A1%B5%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
(function () {
    'use strict';

    const indexDBREQ = window.indexedDB.open("limestart", 1)  // 数据库名称，版本号
    const storeName = 'wallpaper' // 表名
    let local_db = null;

    indexDBREQ.onupgradeneeded = (event) => {
        local_db = event.target.result // 数据库对象
        if (local_db.objectStoreNames.includes(storeName)) {
            local_db.deleteObjectStore(storeName)
            local_db.createObjectStore(storeName)
        }
        console.log('upgrad-连接到本地limestart数据库')
    }

    indexDBREQ.onsuccess = (event) => { // 监听数据库创建成功事件
        local_db = event.target.result // 数据库对象
        console.log('连接到本地limestart数据库')
    }


    const indexedAction = {
        get(storeName, key) {
            return new Promise((res) => {
                const transaction = local_db.transaction([storeName], "readwrite");
                const store = transaction.objectStore(storeName);
                const r = store.get(key)
                r.onsuccess = (e) => {
                    res(e.target.result)
                }
                r.onerror = (e) => {
                    res(null)
                }
            })
        },

        put(val, key) {
            return new Promise((res) => {
                const transaction = local_db.transaction([storeName], "readwrite");
                const store = transaction.objectStore(storeName);
                const r = store.put(val, key)
                r.onsuccess = (e) => {
                    res(true)
                }
                r.onerror = (e) => {
                    res(false)
                }
            })
        },

        delete(key) {
            return new Promise((res) => {
                const transaction = local_db.transaction([storeName], "readwrite");
                const store = transaction.objectStore(storeName);
                const r = store.delete(key)
                r.onsuccess = (e) => {
                    res(true)
                }
                r.onerror = (e) => {
                    res(false)
                }
            })
        }
    }

    // 基础依赖
    const _mainKey = 'easy_limestart'
    const ls = {
        set(key, val) {
            let easy_limestart_obj = window.localStorage.getItem(_mainKey);
            if (!easy_limestart_obj) {
                easy_limestart_obj = {}
            } else {
                easy_limestart_obj = JSON.parse(easy_limestart_obj)
            }
            easy_limestart_obj[key] = val;
            window.localStorage.setItem(_mainKey, JSON.stringify(easy_limestart_obj))
        },
        get(key, defaultVal = null) {
            let easy_limestart_obj = window.localStorage.getItem(_mainKey);
            if (!easy_limestart_obj) {
                easy_limestart_obj = {}
                return defaultVal
            } else {
                easy_limestart_obj = JSON.parse(easy_limestart_obj)
            }
            const val = easy_limestart_obj[key];
            if (val !== undefined) {
                try {
                    return JSON.parse(val)
                } catch (err) {
                    return defaultVal || val
                }
            }
            return defaultVal
        }
    }
    //消息弹窗
    const Message = {
        info(msg) {
            const delay = 2000; //多少毫秒后隐藏
            const greetingContainer = document.createElement("div")
            greetingContainer.id = "greetingContainer"
            const greetingBox = document.createElement("div")
            greetingBox.id = "greetingBox"
            greetingBox.textContent = msg
            greetingContainer.append(greetingBox)
            document.body.append(greetingContainer)
            greetingContainer.offsetLeft; // reflow
            greetingBox.style.opacity = 1
            greetingBox.style.transform = `translateY(0)`
            setTimeout(() => {
                greetingBox.style.opacity = 0;
                greetingBox.style.transform = `translateY(-100%)`;
                greetingBox.addEventListener("transitionend", () => {
                    greetingContainer.remove();
                })
                greetingBox.addEventListener("webkitTransitionEnd", () => {
                    greetingContainer.remove();
                })
            }, delay)
        }
    }

    // 加载B站热搜


    // 去除脚标
    const timer = setInterval(() => {
        const footer = document.querySelector("footer");
        if (footer) {
            footer.style.display = 'none'
            clearInterval(timer)
        }
    }, 500);

    /**
     * 显示/隐藏搜索框
     */
    function showSearchCb() {
        const searchSuggestionContainer = document.getElementById("searchSuggestionContainer");
        const menuSearchEng = document.getElementById("menuSearchEng");
        const searchEl = document.getElementById("searchBar");
        if (searchEl) {
            searchEl.style.display = showSearch ? 'block' : 'none';
        }
        if (searchSuggestionContainer) {
            searchSuggestionContainer.style.display = showSearch ? 'block' : 'none';
        }

        if (menuSearchEng) {
            menuSearchEng.style.display = showSearch ? 'block' : 'none';
        }

    }

    let showSearch = ls.get("showSearch");
    showSearchCb();
    // 如果隐藏输入框，那就失去焦点 + 不要cover
    if (!showSearch) {
        document.getElementById("inputSearch").blur()
        document.getElementById("cover").click()
    }



    // 显示/隐藏时间框
    let showTimer = ls.get("showTimer", true)
    function showTimerCb() {
        const timeContainer = document.getElementById("timeContainer");
        if (timeContainer) {
            timeContainer.style.display = showTimer ? 'block' : 'none';
        }
    }
    showTimerCb()

    let showBilibili = false;
    let isBliLoading = false;
    //B站热搜请求
    function requestBiApi() {
        const getRow = async (show_name, keyword, icon) => {
            const src = await (new Promise((res) => {
                if (icon) {
                    GM_xmlhttpRequest({
                        url: icon,
                        method: 'get',
                        responseType: 'blob',
                        onload: (data) => {
                            var blob = new Blob([data.response], { type: 'image/png' });
                            const fileReader = new FileReader()
                            fileReader.onload = (e) => {
                                res(e.target.result)
                            }
                            // readAsDataURL
                            fileReader.readAsDataURL(blob)
                        }
                    })
                } else {
                    res(null)
                }
            }))
            const img_html = src ? `<img class="bilibili-trending-img" src="${src}" />` : ''
            return `<div class="setOptBox">
                    <span class="setOptCaption" style="margin-left: -6px;">
                        <a href="https://search.bilibili.com/all?keyword=${keyword}" class="link" target="_blank"><i class="icon iconfont icon-bilibili" style="padding-right: 5px;"></i>${show_name}${img_html}</a>
                    </span>
                </div>`
        }
        if (isBliLoading) return;
        isBliLoading = true;
        $(".cover2.easy-limestart .pContent").html(`<div class="setGroup">
                        <div class="setOptBox">
                            <span class="setOptCaption" style="margin-left: -6px;">
                                <a href="javascript:void(0)" class="link" target="_blank">加载中...</a>
                            </span>
                        </div>
                    </div>`)
        GM_xmlhttpRequest({
            url: "https://api.bilibili.com/x/web-interface/wbi/search/square?limit=15&platform=web",
            method: "get",
            onload: async (data) => {
                const { data: { trending: { list, title, top_list } }, code, message } = JSON.parse(data.response);
                // console.log(code, message)
                if (code != 0) {
                    Message.info(message)
                } else {
                    $(".cover2.easy-limestart .pCaptionBar").html(`<span class="btnRectangle3" style="left: 5px; right: auto; top: 6px;" id="btnRefreshBli" role="button" tabindex="0">刷新</span>${title}`)
                    // console.log(list, title, top_list)
                    $("#btnRefreshBli").click(() => {
                        requestBiApi()
                    })
                    const rowList = []
                    for (const idx in list) {
                        const { show_name, keyword, icon } = list[idx];
                        const row = await getRow(show_name, keyword, icon)
                        rowList.push(row)
                    }
                    $(".cover2.easy-limestart .pContent .setGroup").html(rowList.join(""))
                    isBliLoading = false;
                }
            },
            onabort: () => {
                isBliLoading = false;
            },
            onerror: () => {
                isBliLoading = false;
            }
        })
        $(".cover2.easy-limestart").css({
            display: "block",
            opacity: 1
        })
        $(".cover2.easy-limestart .popUp").css({
            display: "block",
            opacity: 0,
            transform: 'rotate3d(1, 1, 0, 50deg)'
        }).offset();
        $(".cover2.easy-limestart .popUp").css({
            display: "block",
            opacity: 1,
            transform: 'none'
        })
    }
    //B站热搜显示
    function showBlibiliTrending(init = false) {
        // style="display: block; opacity: 1;"
        // style="display: block; opacity: 1; transform: none;"
        const dialog = `<div class="cover2 easy-limestart">
            <div class="popUp" id="bilibiliTrending" style="display: block; opacity: 1; transform: none;">
                <span class="btnClose" role="button" tabindex="0" title="关闭"><span class="btnCloseInner"></span></span>
                <div class="pCaptionBar scrolled"></div>
                <div class="pContent" id="contentGSet">
                    <div class="setGroup">
                        <div class="setOptBox">
                            <span class="setOptCaption" style="margin-left: -6px;">
                                <a href="javascript:void(0)" class="link" target="_blank">加载中...</a>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        if (init) {
            GM_addStyle(`.cover2 {
                z-index: 100;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,.35);
                display: none;
                opacity: 0;
                transition: .25s;
                perspective: 1000px;
            } .icon-bilibili {
                color: #00AFE0; 
            } .bilibili-trending-img {
                height: 16px;
                margin-left: 5px;
                vertical-align: -2px;
            }
            #btnRefreshBli:hover {
                color: #fff;
                background-color: var(--err-color);
            }`)
            GM_addStyle(GM_getResourceText("css"))
            $(document.body).append(dialog);
            $(".cover2.easy-limestart .btnClose").hover(() => {
                $(".cover2.easy-limestart .popUp").css({
                    display: "block",
                    opacity: 1,
                    transform: 'rotate3d(1, 1, 0, 5deg)'
                })
            }, () => {
                $(".cover2.easy-limestart .popUp").css({
                    display: "block",
                    opacity: 1,
                    transform: 'none'
                })
            })
            $(".cover2.easy-limestart .btnClose").click(() => {
                showBilibili = false;
                $(".cover2.easy-limestart").fadeOut(100)
            })
        } else {
            showBilibili = !showBilibili;
            if (showBilibili) {
                requestBiApi()
            } else {
                $(".cover2.easy-limestart").fadeOut(100)
            }
        }
    }
    showBlibiliTrending(true);


    // 增加键盘事件
    document.body.addEventListener("keydown", (e) => {
        if (e.altKey && e.key.toLowerCase() === 't') {
            showSearch = !showSearch;
            showSearchCb()
            Message.info(showSearch ? "显示搜索框" : '隐藏搜索框')
            ls.set("showSearch", showSearch)
        }
        if (e.altKey && e.key.toLowerCase() === 'g') {
            showTimer = !showTimer;
            showTimerCb()
            Message.info(showTimer ? "显示时间" : '隐藏时间')
            ls.set("showTimer", showTimer)
        }

        if (e.altKey && e.key.toLowerCase() === 'b') {
            showBlibiliTrending()
        }
    });

    //自定义外部链接背景图
    GM_addStyle(`.easy_input {
        width: calc(100% - 55px);
        color: var(--b-alpha-60);
        background-color: transparent;
        border: none;
        transition: .25s;
    } button#btnBrowse:disabled {
        background-color: gray!important;
    }`)

    const readUrlImg = (url) => {
        return new Promise((res) => {
            GM_xmlhttpRequest({
                url,
                method: "get",
                responseType: 'blob',
                onload: async (data) => {
                    var blob = new Blob([data.response], { type: 'image/png' });
                    const fileReader = new FileReader()
                    fileReader.onload = (e) => {
                        const img_url = URL.createObjectURL(blob)
                        res([null, img_url, [data.response]])
                    }
                    // readAsDataURL
                    fileReader.readAsDataURL(blob)
                },
                onerror: (err) => {
                    if (err === 'permission not allowed') {
                        Message.info('授权被拒绝')
                    } else {
                        Message.info(err)
                    }
                    res([err, null, null])
                }
            })
        })
    }

    $("#contentBg .bgGroup").eq(0).after(`
        <div style="position: relative; height:26px; align-items:end;" class='bgGroup'>
            <input id="outsideImgUrlInput" placeholder="请输入外部图片链接" class="easy_input" /> 
            <label class="switch">
                <input type="checkbox" id="chkOutsideImgUrlBar">
                <div class="slider" id="chkOutsideImgUrlBarInner"></div>
            </label>
        </div>
    `);

    $("#outsideImgUrlInput").on("input", async () => {
        const isChecked = $("#chkOutsideImgUrlBar").prop("checked")
        console.log(isChecked)
        if(!isChecked) return
        const key = `custom`
        const oldKey = 'oldCustom'
        const videoPosterKey = "customVideoPoster"
        $("#chkOutsideImgUrlBar").prop("checked", false);
        const pageFile = await indexedAction.get(storeName, oldKey); //老的视频或者图片
        await indexedAction.put(pageFile, key)
        await indexedAction.delete(oldKey)
        if (!pageFile) {
            await indexedAction.delete(key)
            $("#bgPreBoxInnerCustom").addClass("unset").removeAttr("style");
            // const gs = JSON.parse(localStorage.getItem("generalSettings") || {});
            // gs['bgPreference'] = 'Default1'
            // localStorage.setItem("generalSettings", JSON.stringify(gs))
            $("#bgPreBoxInnerDefault1").click();
            ls.set("easy_custom_out_url_checked", false)
            return
        }
        const img_url = URL.createObjectURL(pageFile)
        if (pageFile.type.startsWith("video/")) {
            let videoPosterImg = await indexedAction.get(storeName, videoPosterKey); //是否能获取到视频封面
            $("#liveBgBox").css({
                display: 'block',
                opacity: 1,
                transform: "scale(1.1)"
            }).attr("src", img_url)
            $("#bgBox").css({ opacity: 0 });
            if (videoPosterImg) {
                $("#bgPreBoxInnerCustom").css({ "background-image": `url(${videoPosterImg})` })

            }
        } else {
            $("#liveBgBox").css({
                display: 'none',
                opacity: 1,
                transform: 'scale(1.1)'
            })
            $("#bgBox").css({
                opacity: 1,
                transform: "scale(1.1)",
                display: "block"
            });
            $("#bgPreBoxInnerCustom").css({ "background-image": `url(${img_url})` })
            $("#bgBox").attr("src", img_url)
        }

        $("#bgPreBoxInnerCustom, #bgPreviewBoxCustom").off("click")
        $("#bgPreBoxInnerCustom, #bgPreviewBoxCustom").click(async () => {
            const pageFile = await indexedAction.get(storeName, key)
            const img_url = URL.createObjectURL(pageFile)
            if (pageFile.type.startsWith("video/")) {
                $("#liveBgBox").attr("src", img_url)
            } else {
                $("#bgBox").attr("src", img_url)
            }
        })
        ls.set("easy_custom_out_url_checked", false)
        $("#btnBrowse").attr("disabled", false)
    })

    // https://img0.baidu.com/it/u=68017732,1315184908&fm=253&fmt=auto&app=138&f=JPEG?w=642&h=243
    $("#chkOutsideImgUrlBar").change(async (e) => {
        const { checked } = e.target
        const url = $("#outsideImgUrlInput").val()
        const key = `custom`
        const oldKey = 'oldCustom'
        const videoPosterKey = "customVideoPoster"
        if (checked && local_db && url) {
            const [error, img_url, bolb] = await readUrlImg($("#outsideImgUrlInput").val());
            const file = new File(bolb, 'outside_url_img.png', { type: "image/png" }); //外部链接生成的图片
            const oldFile = await indexedAction.get(storeName, key) //拿到当前正在使用的图片或者video
            await indexedAction.put(oldFile, oldKey) //拿到当前正在使用的图片或者video
            await indexedAction.put(file, key) //外部链接生成的图片 入住 custom
            //当前只支持图片，只要存储完成，如果以前用的是视频文件，那就需要隐藏，这里默认隐藏一次
            $("#liveBgBox").css({
                display: "none",
                opacity: 1,
                transform: 'scale(1.1)'
            })
            $("#btnBrowse").attr("disabled", true)
            ls.set("easy_custom_out_url", url)
            $("#bgPreBoxInnerCustom").removeClass("unset").css({ "background-image": `url(${img_url})` }).click()
            $("#bgBox").attr("src", img_url)
            $("#bgPreBoxInnerCustom, #bgPreviewBoxCustom").off("click")
            $("#bgPreBoxInnerCustom, #bgPreviewBoxCustom").click(async () => {
                $("#bgBox").attr("src", img_url)
            })
        } else {
            $("#btnBrowse").attr("disabled", false)
            if (!checked) {
                const pageFile = await indexedAction.get(storeName, oldKey); //老的视频或者图片
                await indexedAction.put(pageFile, key)
                await indexedAction.delete(oldKey)
                if (!pageFile) {
                    await indexedAction.delete(key)
                    $("#bgPreBoxInnerCustom").addClass("unset").removeAttr("style");
                    // const gs = JSON.parse(localStorage.getItem("generalSettings") || {});
                    // gs['bgPreference'] = 'Default1'
                    // localStorage.setItem("generalSettings", JSON.stringify(gs))
                    $("#bgPreBoxInnerDefault1").click();
                    ls.set("easy_custom_out_url_checked", false)
                    return
                }
                const img_url = URL.createObjectURL(pageFile)
                if (pageFile.type.startsWith("video/")) {
                    let videoPosterImg = await indexedAction.get(storeName, videoPosterKey); //是否能获取到视频封面
                    $("#liveBgBox").css({
                        display: 'block',
                        opacity: 1,
                        transform: "scale(1.1)"
                    }).attr("src", img_url)
                    $("#bgBox").css({ opacity: 0 });
                    if (videoPosterImg) {
                        $("#bgPreBoxInnerCustom").css({ "background-image": `url(${videoPosterImg})` })

                    }
                } else {
                    $("#liveBgBox").css({
                        display: 'none',
                        opacity: 1,
                        transform: 'scale(1.1)'
                    })
                    $("#bgBox").css({
                        opacity: 1,
                        transform: "scale(1.1)",
                        display: "block"
                    });
                    $("#bgPreBoxInnerCustom").css({ "background-image": `url(${img_url})` })
                    $("#bgBox").attr("src", img_url)
                }

                $("#bgPreBoxInnerCustom, #bgPreviewBoxCustom").off("click")
                $("#bgPreBoxInnerCustom, #bgPreviewBoxCustom").click(async () => {
                    const pageFile = await indexedAction.get(storeName, key)
                    const img_url = URL.createObjectURL(pageFile)
                    if (pageFile.type.startsWith("video/")) {
                        $("#liveBgBox").attr("src", img_url)
                    } else {
                        $("#bgBox").attr("src", img_url)
                    }
                })
            } else {
                if (!local_db) {
                    Message.info('本地数据库查询失败')
                }
                if (!url) {
                    Message.info('无效的链接')
                }
            }
            e.target.checked = false;
        }
        ls.set("easy_custom_out_url_checked", e.target.checked)
    })

    function initCustomOutSideUrl() {
        const checked = ls.get("easy_custom_out_url_checked")
        const url = ls.get("easy_custom_out_url")
        if (checked) {
            $("#outsideImgUrlInput").val(url)
            $("#chkOutsideImgUrlBar").prop("checked", checked)
        }
        $("#btnBrowse").attr("disabled", checked)
    }
    initCustomOutSideUrl()

    console.log('start')
})();
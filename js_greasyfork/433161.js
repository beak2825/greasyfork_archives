// ==UserScript==
// @name            Soul++
// @namespace       SoulPlusPlus
// @version         1.0.2
// @description     提升你的魂+使用体验
// @run-at          document-start
// @author          镜花水中捞月
// @homepage        https://github.com/FetchTheMoon
// @icon64          https://cdn.jsdelivr.net/gh/FetchTheMoon/UserScript/LOGO.png
// @supportURL      https://github.com/FetchTheMoon/UserScript/issues
// ----------------COPY START---------------------
// @match           https://*.spring-plus.net/*
// @match           https://*.summer-plus.net/*
// @match           https://*.soul-plus.net/*
// @match           https://*.south-plus.net/*
// @match           https://*.north-plus.net/*
// @match           https://*.snow-plus.net/*
// @match           https://*.level-plus.net/*
// @match           https://*.white-plus.net/*
// @match           https://*.imoutolove.me/*
// @match           https://*.south-plus.org/*
// @match           https://*.east-plus.net/*
// --------------------------------------------
// @match           https://spring-plus.net/*
// @match           https://summer-plus.net/*
// @match           https://soul-plus.net/*
// @match           https://south-plus.net/*
// @match           https://north-plus.net/*
// @match           https://snow-plus.net/*
// @match           https://level-plus.net/*
// @match           https://white-plus.net/*
// @match           https://imoutolove.me/*
// @match           https://south-plus.org/*
// @match           https://east-plus.net/*
// --------------------------------------------
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_listValues
// @grant           GM_addValueChangeListener
// @grant           GM_removeValueChangeListener
// @grant           GM_notification
// @grant           GM_deleteValue
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @grant           unsafeWindow
// --------------------------------------------
// @require         https://cdn.jsdelivr.net/npm/toastify-js@1.11.2/src/toastify.min.js
// @resource        TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js@1.11.2/src/toastify.css
// ----------------COPY END---------------------
// @license         GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/433161/Soul%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/433161/Soul%2B%2B.meta.js
// ==/UserScript==

'use strict';

const PageType = Object.freeze({
    THREADS_PAGE: Symbol("普通主题列表"),
    PIC_WALL_PAGE: Symbol("图墙区主题列表"),
    POSTS_PAGE: Symbol("帖子列表"),
    SEARCH_RESULT: Symbol("搜索结果")
});

const ToastType = Object.freeze({
    INFO: Symbol("信息"),
    SUCCESS: Symbol("成功"),
    DANGER: Symbol("危险，失败"),
    WARNING: Symbol("警告")
});

const FETCH_CONFIG = {
    credentials: 'include',
    mode: "no-cors"
};

function getElementByXpath(from, xpath) {
    return from.evaluate(xpath, from, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function waitForImageToLoad(imageElement) {
    return new Promise(resolve => {
        imageElement.onload = resolve
    })
}

function toast(info, toastType, time = 3000, close = true) {
    let t;
    switch (toastType) {
        case ToastType.INFO:
            t = "linear-gradient(109deg, #3da1e0, #004dc1)";
            break;
        case ToastType.SUCCESS:
            t = "linear-gradient(213deg, #5daa16, #05bb1b)";
            break;
        case ToastType.DANGER:
            t = "linear-gradient(18deg, #cb3131, #ac1415)";
            break;
        case ToastType.WARNING:
            t = "linear-gradient(180deg, #e98202, #fe5e00)";
            break;
        default:
            t = "linear-gradient(109deg, #3da1e0, #004dc1)";
    }
    Toastify({
        text: info,
        duration: time,
        close: close,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: t,
        },
        onClick: function () {
        } // Callback after click
    }).showToast();

}

function getTimeStamp() {
    return new Date().getTime();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchRetry(url, options, n = 1) {
    try {
        return await fetch(url, options)
    } catch (err) {
        if (n <= 1) throw err;
        return await fetchRetry(url, options, n - 1);
    }
}

async function getPage(url, dummy = false, retry = 3, toastPop = false) {
    return await fetchRetry(url, FETCH_CONFIG, retry)
        .then(resp => resp.text())
        .then(html => {
            if (dummy) {
                let dummy = document.createElement("html");
                dummy.insertAdjacentHTML('afterbegin', html);
                return dummy
            } else {
                return html
            }
        }).catch(e => {
                if (toastPop) {
                    toast(`访问 ${url} 失败\n${e}`, ToastType.WARNING);
                } else {
                    console.error(`访问 ${url} 失败\n${e}`);
                }
            }
        );
}

class GMK {

    static addStyle(css) {
        return GM_addStyle(css);
    }

    static setValue(key, value) {
        return GM_setValue(key, value)
    }

    static getValue(key) {
        return GM_getValue(key)
    }

    static getResourceText(key) {
        return GM_getResourceText(key);
    }

    static listValues() {
        return GM_listValues();
    }

    static deleteValue(_name) {
        return GM_deleteValue(_name);
    }

    // listener_id = GM_addValueChangeListener(name, function(name, old_value, new_value, remote) {})
    static addValueChangeListener(_name, callback) {
        return GM_addValueChangeListener(_name, callback);
    }

    static removeValueChangeListener(listener_id) {
        return GM_removeValueChangeListener(listener_id);
    }
}

class MppManager {
    static TASK_KEY = "Soul++:MppThreadsStatus";

    constructor() {
    }

    static isThreadExist(_tid) {
        return this.getMarkList().hasOwnProperty(_tid);
    }

    static getMarkList() {
        return GMK.getValue(this.TASK_KEY) || {}
    }

    static addMarkThread(_tid) {
        GMK.setValue(this.TASK_KEY, { ...this.getMarkList(), ...{ [_tid]: {} } })
    }

    static deleteMarkedThread(_tid) {
        let markList = this.getMarkList();
        delete markList[_tid];
        GMK.setValue(this.TASK_KEY, markList)
    }

    static isMarked(_tid) {
        return this.getMarkList().hasOwnProperty(_tid)
    }

    static getAllThreadStatus() {
        return this.getMarkList();
    }

    static setThreadStatus(_tid, threadStatus) {
        GMK.setValue(this.TASK_KEY, {
            ...this.getMarkList(),
            [_tid]: threadStatus
        });
    }

    static getLastFetchTime(_tid) {
        let res = Object.entries(GMK.getValue(this.TASK_KEY)).filter(e => e[0] === _tid);
        return res[0][1]["lastFetchTime"];
    };

    static isAllChecked() {
        let res = Object.entries(GMK.getValue(this.TASK_KEY)).filter(e => !e[1]["allPagesChecked"]);
        return res.length === 0;
    };
}

//##############################################################
// 功能
//##############################################################

function buyRefresh_free(target = document) {
    let buyButtons = target.querySelectorAll(".quote.jumbotron>.btn.btn-danger")
    buyButtons.forEach(button => {
        // 获取GET购买地址
        const urlRegex = /location\.href='(.+)'/
        const buyUrl = button.getAttribute("onclick");
        if (buyUrl === null) return;
        let m = buyUrl.match(urlRegex);
        if (m === null) return;
        let url = m[1];
        // 避免点击按钮的时候跳转，删掉这个属性
        button.setAttribute("onclick", "null");
        // 拿到帖子ID
        let postContainer = button.closest(".tpc_content .f14")
        let post_id = postContainer.getAttribute("id");
        // 添加点击事件，用fetch发送请求，然后读取页面再直接修改当前页面
        let customPurchase = (e => {
            e.stopPropagation();
            let btn = e.target;
            btn.setAttribute("value", "正在购买……请稍等………");
            try {
                fetch(url, FETCH_CONFIG)
                    .then(resp => resp.text())
                    .then(text => {
                        if (!text.includes("操作完成")) {
                            toast("购买失败！", ToastType.DANGER);
                            return;
                        }
                        let threadID = postContainer.getAttribute("tid");
                        let pg = postContainer.getAttribute("page");
                        let resultURL = `./read.php?tid=${threadID}&page=${pg}`;
                        fetch(resultURL, FETCH_CONFIG).then(resp => resp.text())
                            .then(html => {
                                let dummy = document.createElement("html");
                                dummy.innerHTML = html;
                                if (GMK.getValue("hidePostImage")) {
                                    hidePostImage(dummy);
                                }
                                let purchased = dummy.querySelector("#" + post_id);
                                let notPurchased = document.querySelector("#" + post_id);
                                notPurchased.parentNode.replaceChild(purchased, notPurchased);

                            });

                        btn.style.display = "none";

                    });

            } catch (error) {
                toast(`发送请求出错，购买失败！\n${error}`, ToastType.DANGER);
                console.log('Request Failed', error);
            }
        })

        button.addEventListener("click", customPurchase);
    });
}

function hideImg(img) {
    // 避免折叠论坛表情
    const emojiPathReg = /images\/post\/smile\//;
    if (img.getAttribute("src").match(emojiPathReg)) {
        return
    }
    // 避免折叠论坛自带的文件图标
    const fileIconPathReg = /images\/colorImagination\/file\//;
    if (img.getAttribute("src").match(fileIconPathReg)) {
        return
    }

    // 避免重复处理
    let p = img.parentNode;
    if (p.getAttribute("class") === "spp-img-mask") return;

    // 如果开启了按需加载
    if (GMK.getValue("loadImageOnDemand")) {
        img.dataset.src = img.getAttribute("src");
        img.setAttribute("src", "")
    }

    // 如果图片的父元素是A标签，去掉它
    if (img.parentNode.tagName === "A") img.parentNode.replaceWith(img);
    // 创建包裹元素
    let wrapper = document.createElement('div');
    wrapper.setAttribute("class", "spp-img-mask");
    wrapper.style.display = "grid";
    wrapper.style.gridTemplateRows = "auto auto";
    wrapper.style.justifyItems = "center";

    // 将父元素下的图片元素替换成包裹元素
    img.parentNode.replaceChild(wrapper, img);

    // 将图片元素当成子元素放入包裹元素
    wrapper.appendChild(img);

    img.style.width = "100%";

    // 添加类名
    img.setAttribute("class", "spp-thread-imgs spp-hide");

    // 包裹元素样式
    wrapper.style.borderStyle = "dashed";
    wrapper.style.width = "auto";
    wrapper.style.height = "20";
    wrapper.style.textAlign = "center";
    wrapper.style.verticalAlign = "center";
    wrapper.style.cursor = "pointer";

    // 创建遮罩小人儿表情
    let icon_hide = document.createElement("img");
    icon_hide.setAttribute("src", "images/post/smile/smallface/face106.gif");

    let icon_show = document.createElement("img");
    icon_show.setAttribute("src", "images/post/smile/smallface/face109.gif");


    // 创建遮罩文本
    let tip = document.createElement("span");
    let tip_text = document.createElement("span");
    tip_text.innerText = "看看是啥";

    // 凑一堆儿来
    tip.appendChild(icon_hide);
    tip.appendChild(icon_show);
    tip.appendChild(tip_text);

    // 添加类名
    icon_hide.setAttribute("class", "spp-img-mask-icon-hide");
    icon_show.setAttribute("class", "spp-img-mask-icon-show spp-hide");
    tip.setAttribute("class", "ssp-img-mask-text");

    // 插入元素
    wrapper.insertBefore(tip, img);
    // 防止点击图片打开新窗口
    document.querySelector(".spp-thread-imgs").addEventListener("click", e => e.preventDefault());
    // 事件监听
    wrapper.addEventListener("click", (e) => {
        e.stopPropagation();
        // console.log(e.target);
        // console.log(e.currentTarget);
        let img = e.currentTarget.querySelector(".spp-thread-imgs");
        img.classList.toggle("spp-hide");
        // 按需加载
        if (GMK.getValue("loadImageOnDemand") && !img.classList.contains("spp-hide")) {
            let loading = document.createElement("div");
            loading.innerHTML = `<div class="spp-loading-animation">
                <div class="dot1"></div>
                <div class="dot2"></div>
                <div class="dot3"></div>
            </div>`;
            loading = loading.firstChild;
            img.parentNode.append(loading);
            img.setAttribute("src", img.dataset.src);
            waitForImageToLoad(img).then(() => {
                loading.parentNode.removeChild(loading);
            });
        }
        e.currentTarget.querySelector(".spp-img-mask-icon-hide").classList.toggle("spp-hide");
        e.currentTarget.querySelector(".spp-img-mask-icon-show").classList.toggle("spp-hide");
    });

}

function hideAvatar(avatar) {
    let src = avatar.getAttribute("src");
    if (src === "images/face/none.gif") return;

    // 如果开启了按需加载
    if (GMK.getValue("loadImageOnDemand")) {
        avatar.dataset.src = avatar.getAttribute("src");
        avatar.setAttribute("src", "")
    }

    // 创建包裹元素
    let wrapper = document.createElement('div');
    wrapper.setAttribute("class", "spp-avatar-mask");
    wrapper.style.minWidth = "162px";
    wrapper.style.minHeight = "162px";
    wrapper.style.display = "grid";
    wrapper.style.justifyItems = "center";
    wrapper.style.alignItems = "center";

    // 创建一个假头像
    let fakeAvatarElement = document.createElement("img");
    fakeAvatarElement.setAttribute("src", "images/face/none.gif");
    fakeAvatarElement.style.borderStyle = "dashed";
    fakeAvatarElement.style.borderRadius = "3";
    fakeAvatarElement.style.borderWidth = "3px";
    fakeAvatarElement.style.borderColor = "Orange";

    // 替换包裹元素
    avatar.parentNode.replaceChild(wrapper, avatar);

    // 将假头像和真头像插到包裹元素中
    wrapper.appendChild(avatar);
    wrapper.appendChild(fakeAvatarElement);

    // 隐藏真头像
    avatar.classList.add("spp-hide");

    // 设置类名
    avatar.classList.add("spp-avatar-real");
    fakeAvatarElement.classList.add("spp-avatar-fake");

    // 事件监听
    wrapper.addEventListener("mouseenter", (e) => {
        e.stopPropagation();
        e.currentTarget.querySelector(".spp-avatar-fake").classList.add("spp-hide");
        e.currentTarget.querySelector(".spp-avatar-real").classList.remove("spp-hide");
        // 按需加载
        if (GMK.getValue("loadImageOnDemand") && !avatar.classList.contains("spp-hide")) {
            let loading = document.createElement("div");
            loading.innerHTML = `<div class="spp-loading-animation">
                <div class="dot1"></div>
                <div class="dot2"></div>
                <div class="dot3"></div>
            </div>`;
            loading = loading.firstChild;
            e.currentTarget.append(loading);
            avatar.setAttribute("src", avatar.dataset.src);
            waitForImageToLoad(avatar).then(() => {
                loading.parentNode.removeChild(loading);
            });
        }
    });

    wrapper.addEventListener("mouseleave", (e) => {
        e.stopPropagation();
        e.currentTarget.querySelector(".spp-avatar-fake").classList.remove("spp-hide");
        e.currentTarget.querySelector(".spp-avatar-real").classList.add("spp-hide");
        e.currentTarget.querySelectorAll(".spp-loading-animation").forEach(ele => ele.parentNode.removeChild(ele));
    });


}

function hidePostImage(target = document) {
    let thread_user_post_images = target.querySelectorAll(".t5.t2 .r_one img");

    thread_user_post_images.forEach(hideImg);
}

function hideUserAvatar(target = document) {
    let user_avatars = target.querySelectorAll(".user-pic img");
    user_avatars.forEach(hideAvatar);
}

function dynamicLoadingNextPage(pageType) {

    class NextPageLoader {

        constructor() {
            this.isFetching = false;
            this.nextPageDummy = null;
        }

        GetURLDummy(url) {
            this.nextPageDummy = document.createElement("html");
            this.isFetching = true;
            return fetch(url, FETCH_CONFIG)
                .then(response => response.text())

        }

        AppendNextPageItems(itemSelector, divider) {

            let postsFragment = document.createDocumentFragment();
            this.nextPageDummy.querySelectorAll(itemSelector).forEach(ele => postsFragment.appendChild(ele));
            // 追加下一页的所有子项追加到分割线下面
            divider.parentNode.appendChild(postsFragment);
        }

        UpdatePageList() {
            // 主动更新帖子列表上下方的当前页码数
            let pagesOld = document.querySelectorAll(".pages");
            let pagesNew = this.nextPageDummy.querySelectorAll(".pages");
            for (let i = 0; i < pagesOld.length; i++) {
                pagesOld[i].parentNode.replaceChild(pagesNew[i], pagesOld[i]);
            }
        }

    }


    function getNextPageUrl() {
        let pageSeq = document.querySelector(".pages b");
        if (!pageSeq) return null;
        let pageNum = pageSeq.parentNode;
        let url = pageNum.nextSibling.firstChild.getAttribute("href");
        if (pageNum.nextSibling.nextSibling.classList.contains("pagesone")) return null;
        if (document.URL.includes(url)) return null;
        return url;
    }


    function makeDivider(itemsSelector, dividerMaker) {
        let divider = dividerMaker();
        let allItem = document.querySelectorAll(itemsSelector);
        let lastItem = allItem[allItem.length - 1];
        lastItem.parentNode.appendChild(divider);
        return divider;
    }

    let nextPageLoader;
    let nextPageURL;
    nextPageLoader = nextPageLoader || new NextPageLoader()
    // 处理搜索结果页面
    if (pageType === PageType.SEARCH_RESULT) {
        document.addEventListener('wheel', (e) => {
            e.stopPropagation();
            const itemListSelector = ".tr3.tac";
            if (e.deltaY < 0 || nextPageLoader.isFetching) return;
            if (!nextPageLoader.nextPageDummy) {
                nextPageURL = getNextPageUrl();
                if (!nextPageURL) return;
                let divider = makeDivider(itemListSelector, () => {
                    let divider = document.createElement("tr");
                    let dividerContent = document.createElement("td");
                    divider.setAttribute("class", "tr2 spp-next-page-loader-divider")
                    divider.appendChild(dividerContent);
                    dividerContent.colSpan = 7;
                    dividerContent.style.textAlign = "center";
                    dividerContent.style.fontWeight = "bold";
                    dividerContent.innerText = "...";
                    return divider;
                });
                divider.firstChild.innerText = "正在获取下一页的帖子......";
                let p = nextPageLoader.GetURLDummy(nextPageURL);
                p
                    .then(html => {
                        nextPageLoader.nextPageDummy.innerHTML = html
                        if (GMK.getValue("blockAdforumSearchResult")) blockAdforumSearchResult(nextPageLoader.nextPageDummy);
                    })
                    .catch(err => {
                        console.error(err);
                        divider.firstChild.innerText = "获取下一页的帖子出错，请手动刷新";
                    })
                    .finally(() => {
                        nextPageLoader.isFetching = false;
                        divider.firstChild.innerText = "滚动条到底后继续向下滚动将会加载下一页的帖子";
                    });

            }
            // 否则判断一下是否到底了，到底了就追加下一页的内容
            else if (Math.abs(document.documentElement.scrollHeight - (window.pageYOffset + window.innerHeight)) < 20) {
                let divider = getElementByXpath(document, "//tr[@class='tr2 spp-next-page-loader-divider'][last()]");
                nextPageLoader.AppendNextPageItems(itemListSelector, divider);
                nextPageLoader.UpdatePageList();

                divider.firstChild.innerText = `以下是第${nextPageURL.match(/page-(\d+)/)[1]}页`;
                window.history.pushState({}, 0, nextPageURL); // 将地址栏也改变了
                nextPageLoader.nextPageDummy = null;
            }

        })
    }
    // 处理主题列表页面
    if (pageType === PageType.THREADS_PAGE) {
        document.addEventListener('wheel', (e) => {
            e.stopPropagation();
            const itemListSelector = ".tr3.t_one";
            if (e.deltaY < 0 || nextPageLoader.isFetching) return;
            if (!nextPageLoader.nextPageDummy) {
                nextPageURL = getNextPageUrl();
                if (!nextPageURL) return;
                let divider = makeDivider(itemListSelector, () => {
                    let divider = document.createElement("tr");
                    let dividerContent = document.createElement("td");
                    divider.setAttribute("class", "tr2 spp-next-page-loader-divider")
                    divider.appendChild(dividerContent);
                    dividerContent.colSpan = 5;
                    dividerContent.style.textAlign = "center";
                    dividerContent.style.fontWeight = "bold";
                    dividerContent.innerText = "...";
                    return divider;
                });
                divider.firstChild.innerText = "正在获取下一页的帖子......";
                let p = nextPageLoader.GetURLDummy(nextPageURL);
                p
                    .then(html => {
                        nextPageLoader.nextPageDummy.innerHTML = html;
                        threadAddAnchorAttribute(nextPageLoader.nextPageDummy, page + 1, fid);
                        if (GMK.getValue("highlightViewedThread")) highlightViewedThread(nextPageLoader.nextPageDummy);
                    })
                    .catch(err => {
                        console.error(err);
                        divider.firstChild.innerText = "获取下一页的帖子出错，请手动刷新";
                    })
                    .finally(() => {
                        nextPageLoader.isFetching = false;
                        divider.firstChild.innerText = "滚动条到底后继续向下滚动将会加载下一页的帖子";
                    });

            }
            // 否则判断一下是否到底了，到底了就追加下一页的内容
            else if (Math.abs(document.documentElement.scrollHeight - (window.pageYOffset + window.innerHeight)) < 20) {
                let divider = getElementByXpath(document, "//tr[@class='tr2 spp-next-page-loader-divider'][last()]");
                nextPageLoader.AppendNextPageItems(itemListSelector, divider);
                nextPageLoader.UpdatePageList();
                divider.firstChild.innerText = `以下是第${page + 1}页`;
                window.history.pushState({}, 0, nextPageURL); // 将地址栏也改变了
                page += 1;
                nextPageLoader.nextPageDummy = null;
            }

        })
    }
    // 处理楼层列表页面
    if (pageType === PageType.POSTS_PAGE) {
        document.addEventListener('wheel', (e) => {
            e.stopPropagation();
            const itemListSelector = ".t5.t2";
            if (e.deltaY < 0 || nextPageLoader.isFetching) return;
            if (!nextPageLoader.nextPageDummy) {
                nextPageURL = getNextPageUrl();
                if (!nextPageURL) return;
                let divider = makeDivider(itemListSelector, () => {
                    let divider = document.createElement("div");
                    let dividerContent = document.createElement("span");
                    divider.setAttribute("class", "t5 t2 spp-next-page-loader-divider")
                    divider.appendChild(dividerContent);
                    divider.style.textAlign = "center";
                    divider.style.fontWeight = "bold";
                    divider.style.fontSize = "14px";
                    divider.innerText = "...";
                    return divider;
                });
                divider.innerText = "加载中..";
                nextPageLoader.GetURLDummy(nextPageURL)
                    .then(html => {
                        nextPageLoader.nextPageDummy.innerHTML = html
                        postAddAnchorAttribute(nextPageLoader.nextPageDummy, page + 1, tid);
                        if (GMK.getValue("buyRefresh_free")) buyRefresh_free(nextPageLoader.nextPageDummy);
                        if (GMK.getValue("hidePostImage")) hidePostImage(nextPageLoader.nextPageDummy);
                        if (GMK.getValue("hideUserAvatar")) hideUserAvatar(nextPageLoader.nextPageDummy);
                        if (GMK.getValue("hoistingResourcePost")) hoistingResourcePost(nextPageLoader.nextPageDummy);
                    })
                    .catch(err => {
                        console.error(err);
                        divider.innerText = "获取下一页的帖子出错，请手动刷新";
                    })
                    .finally(() => {
                        nextPageLoader.isFetching = false;
                        divider.innerText = "滚动条到底后继续向下滚动将会加载下一页的帖子";
                    });

            }
            // 否则判断一下是否到底了，到底了就追加下一页的内容
            else if (Math.abs(document.documentElement.scrollHeight - (window.pageYOffset + window.innerHeight)) < 20) {
                let divider = getElementByXpath(document, "//div[@class='t5 t2 spp-next-page-loader-divider'][last()]");
                nextPageLoader.AppendNextPageItems(itemListSelector, divider);
                nextPageLoader.UpdatePageList();
                divider.innerText = `以下是第${page + 1}页`;
                // window.history.pushState({}, 0, nextPageURL); // 将地址栏也改变了
                page += 1;
                nextPageLoader.nextPageDummy = null;
            }

        })
    }
    // 处理图墙区主题列表页面
    if (pageType === PageType.PIC_WALL_PAGE) {
        document.addEventListener('wheel', (e) => {
            e.stopPropagation();
            const itemListSelector = ".dcsns-li.dcsns-rss.dcsns-feed-0";
            if (e.deltaY < 0 || nextPageLoader.isFetching) return;
            if (!nextPageLoader.nextPageDummy) {
                nextPageURL = getNextPageUrl();
                if (!nextPageURL) return;
                let divider = makeDivider(itemListSelector, () => {
                    let divider = document.createElement("tr");
                    let dividerContent = document.createElement("td");
                    divider.setAttribute("class", "tr2 spp-next-page-loader-divider")
                    divider.appendChild(dividerContent);
                    dividerContent.colSpan = 5;
                    dividerContent.style.textAlign = "center";
                    dividerContent.style.fontWeight = "bold";
                    dividerContent.innerText = "...";
                    return divider;
                });
                divider.firstChild.innerText = "正在获取下一页的帖子......";
                let p = nextPageLoader.GetURLDummy(nextPageURL);
                p
                    .then(html => {
                        nextPageLoader.nextPageDummy.innerHTML = html;
                        nextPageLoader.nextPageDummy.querySelectorAll(".dcsns-li.dcsns-rss.dcsns-feed-0 .lazy").forEach(ele => {
                            ele.setAttribute("loading", "lazy");
                            ele.setAttribute("class", "");
                            ele.setAttribute("src", ele.getAttribute("data-original"));
                            ele.setAttribute("data-original", "");
                            ele.style.display = "inline";
                        });

                    })
                    .catch(err => {
                        console.error(err);
                        divider.firstChild.innerText = "获取下一页的帖子出错，请手动刷新";
                    })
                    .finally(() => {
                        nextPageLoader.isFetching = false;
                        divider.firstChild.innerText = "滚动条到底后继续向下滚动将会加载下一页的帖子";
                    });

            }
            // 否则判断一下是否到底了，到底了就追加下一页的内容
            else if (Math.abs(document.documentElement.scrollHeight - (window.pageYOffset + window.innerHeight)) < 20) {
                let divider = getElementByXpath(document, "//tr[@class='tr2 spp-next-page-loader-divider'][last()]");
                nextPageLoader.AppendNextPageItems(itemListSelector, divider);
                nextPageLoader.UpdatePageList();
                divider.firstChild.innerText = `以下是第${page + 1}页`;
                window.history.pushState({}, 0, nextPageURL); // 将地址栏也改变了
                page += 1;
                nextPageLoader.nextPageDummy = null;
            }

        })
    }
}

async function automaticTaskCollection() {

    function setUIDsValue(uid, value) {
        let tmp = GMK.getValue("LastAutomaticTaskCollectionDate") || {};
        tmp[uid] = value;
        GMK.setValue("LastAutomaticTaskCollectionDate", tmp);
    }

    if (document.querySelector("#login_0")) {
        console.log(`尚未登录，不接任务`);
        return
    }

    let uid = document.querySelector("#menu_profile .ul2").innerHTML.match(/u\.php\?action-show-uid-(\d+)\.html/)[1];
    let uname = document.querySelector("#user-login a").innerText;

    console.log(GMK.getValue("LastAutomaticTaskCollectionDate"));
    let lastTime = GMK.getValue("LastAutomaticTaskCollectionDate") ?
        (parseInt(GMK.getValue("LastAutomaticTaskCollectionDate")[uid]) || 0) : 0;
    console.log(`${uname}[${uid}] 上次：${new Date(lastTime).toLocaleDateString()} ${new Date(lastTime).toLocaleTimeString()}`);


    if (new Date().getTime() - lastTime < (3600 * 1000)) {
        console.log("再等等……");
        return;
    }


    async function forumTask(pageURL, selector, jobType) {
        let dummy = await fetch(
            pageURL,
            FETCH_CONFIG)
            .then(response => response.text())
            .then(html => {
                let dummy = document.createElement("html");
                dummy.innerHTML = html;
                return dummy
            })
            .catch(err => console.error(err));

        async function t(task) {
            let job = task.getAttribute("onclick");
            let r = job.match(/startjob\('(\d+)'\);/);
            let jobID = r[1];
            let taskURL = `/plugin.php?H_name=tasks&action=ajax&actions=${jobType}&cid=${jobID}&nowtime=${new Date().getTime()}&verify=${verifyhash}`;


            await fetch(taskURL, FETCH_CONFIG)
                .then(response => response.text())
                .then(html => {
                        console.log(html);
                        if (html.includes("success\t")) toast(html.match(/!\[CDATA\[success\t(.+)]]>/)[1], ToastType.SUCCESS);
                    }
                )
                .catch(err => console.error(err));
        }

        await dummy.querySelectorAll(selector).forEach(t);

        console.log(`${pageURL} done, ${new Date().getTime()}`)
    }

    for (let i = 0; i < 2; i++) {
        forumTask(
            "/plugin.php?H_name-tasks.html",
            "a[title=按这申请此任务]",
            "job"
        ).catch(err => console.error(err));
        await sleep(3000);
        forumTask(
            "/plugin.php?H_name-tasks-actions-newtasks.html.html",
            "a[title=领取此奖励]",
            "job2"
        ).catch(err => console.error(err));
    }
    console.log(`${uname}[${uid}], 本次领取时间:${new Date().getTime()}`);
    setUIDsValue(uid, new Date().getTime());

}

function blockAdforumSearchResult(target = document) {
    target.querySelectorAll(".tr3.tac").forEach(ele => {
        let forum = ele.childNodes[2];
        if (forum.firstChild.getAttribute("href").match(/fid-17[1-4]/)) {
            ele.style.display = "none";
        }
    });
}

function createFloatDraggableButton(text, GMKey, style) {
    let btn = document.createElement("button");
    let main = document.getElementById("main");
    main.appendChild(btn);

    btn.innerText = text;
    btn.setAttribute("id", "spp-float-draggable-button");
    btn.setAttribute("draggable", "true");
    btn.style.display = "block";
    btn.style.position = "fixed";
    btn.style.background = "#efefef";
    btn.style.zIndex = "99";
    btn.style.width = "30px";
    btn.style.padding = "10";
    btn.style.borderRadius = "1px";

    if (style) {
        for (const k in style) {
            btn.style[k] = style[k];
        }
    }

    let GM_style;
    if (GMKey) GM_style = GMK.getValue(GMKey);
    if (GM_style) {
        for (const k in GM_style) {
            btn.style[k] = GM_style[k];
        }
    }

    return btn;

}

function mark() {
    if (document.location.href.includes("/read.php")) {

        const GREY = "linear-gradient(to top, rgb(184 184 184), rgb(188 188 188))";
        const BLACK = "linear-gradient(to top, #313131,#000000)";
        const GMKey = "Style_markPlusPlus";

        let markButton = createFloatDraggableButton(
            MppManager.isMarked(tid) ? "MARKED" : "MARK",
            GMKey,
            {
                left: "calc(50vw + 470px)",
                top: "234px",
                background: MppManager.isMarked(tid) ? GREY : BLACK,
                color: "white",
                fontWeight: "bold",
                outline: "none",
                border: "none",
                borderRadius: "3px",
                width: "30px",
                opacity: MppManager.isMarked(tid) ? "0.4" : "0.8",
                cursor: "pointer",
            },
        );

        let dragStart = {};
        let dragEnd = {};
        // 防止拖到视口以外了
        AddIntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                // console.log('LEAVE');
                markButton.style.left = dragStart['saved']['left'];
                markButton.style.top = dragStart['saved']['top'];
            }
        }, markButton)

        markButton.addEventListener("click", async evt => {
            evt.stopPropagation();

            if (MppManager.isMarked(tid)) {
                MppManager.deleteMarkedThread(tid);
                evt.target.style.background = BLACK;
                evt.target.innerText = "MARK";
                evt.target.style.opacity = "0.8";
            } else {
                MppManager.addMarkThread(tid);
                evt.target.style.background = GREY;
                evt.target.innerText = "MARKED";
                evt.target.style.opacity = "0.4";
                // 第一次mark就先把基本内容给收录了
                let threadStatus = {};

                threadStatus['page'] = 1;
                threadStatus['lastFetchTime'] = 0;
                threadStatus['maxPage'] = totalpage;
                threadStatus['title'] = document.querySelector('.crumbs-item.current strong>a').textContent;
                threadStatus["markTime"] = new Date().toLocaleDateString();
                MppManager.setThreadStatus(tid, threadStatus);
                console.log(MppManager.getMarkList());
            }


        });

        markButton.addEventListener("contextmenu", openStatus);

        markButton.addEventListener("dragstart", (e) => {
            e.stopPropagation();
            dragStart = {
                clientX: e.clientX,
                clientY: e.clientY,
                saved: {
                    left: e.target.style.left,
                    top: e.target.style.top,
                }
            }
        });

        markButton.addEventListener("dragend", (e) => {
            e.stopPropagation();
            // 获得丅的交叉点坐标
            let startX = window.innerWidth / 2;
            let startY = 0;
            dragEnd = {
                clientX: e.clientX,
                clientY: e.clientY,
            }
            let newLeft = parseFloat(e.target.style.left.match(/(-?\d+)px/)[1]) + (dragEnd.clientX - dragStart.clientX)
            let newTop = parseFloat(e.target.style.top.match(/(-?\d+)px/)[1]) + (dragEnd.clientY - dragStart.clientY);


            e.target.style.left = `calc(50vw + ${newLeft}px)`;
            e.target.style.top = `${newTop}px`;

            let tmp = {
                ...GMK.getValue(GMKey),
                ...{
                    left: `calc(50vw + ${newLeft}px)`,
                    top: `${newTop}px`,
                }
            };
            GMK.setValue(GMKey, tmp);
        });
    }
    let menuButton = document.createElement("li");
    let a = document.createElement("a");
    a.innerText = "我的MARK";
    a.style.cursor = "pointer";
    a.classList.add("mpp-status");
    menuButton.appendChild(a);
    document.querySelector("#main").insertAdjacentHTML("afterbegin", `
   <style>
        .mpp{
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: white;
            z-index: 2000000;
        }
        .mpp-mask{
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: black;
            opacity: 0.5;
            user-select: none;
            z-index: 1000000;
        }
        .mpp-container{
            background: #eeeeee;
            display:grid;
            grid-template-areas:
            "title"
            "main";
            grid-template-rows: 28px auto;
            grid-gap: 10px;
            min-height: 80vh;
            max-height: 80vh;
            width: 900px;
            overflow-y: hidden;
        }
        .mpp-title{
            grid-area: title;
            background: #111111;
            border-left: black;
            border-right: black;
            text-align: center;
            font-weight: bold;
            height: 100%;
            color: white;
            padding-top: 5px;
            margin: 0;
        }

        .mpp-main{
            grid-area: main;
            height: 75vh;
            overflow-y: scroll;
            overflow-x: hidden;

        }


        .spp-hide{
            display: none;
        }

        .mpp-accordion{
            width: 100%; 
            border: none;
            outline: none;
            background-color: whitesmoke;
            text-align: left;
            padding: 10px 10px;
            font-size: 12px;
            /*font-weight: bold;*/
            color: #444;
            cursor: pointer;
            transition: background-color 0.2s linear;
            display: inline-grid;
            grid-template-columns:1fr 4fr 1fr 1fr 1fr 1fr 1fr;
            align-items: center;
            justify-items: center;
            margin-bottom: 4px;
            box-shadow: 1px 2px 2px #AAAAAA;
            
        }
        .mpp-header{
            width: 100%;
            display: inline-grid;
            grid-template-columns:1fr 4fr 1fr 1fr 1fr 1fr 1fr; 
            padding: 10px 10px;
            font-size: 12px;
            align-items: center;
            justify-items: left;
        }

        /*.mpp-accordion-plus{ */
        /*    font-size: 14px;*/
        /*    float: right;*/
        /*}*/

        button.mpp-accordion:before{
            content: '无';
            font-size: 10px;
            color: gray;
        }
        button.mpp-accordion.have-content:before{
            content: '+';
            font-size: 14px;
            font-weight: bold;
            color: black;
        }
        button.mpp-accordion.have-content.mpp-accordion-is-open:before{
            content: '-';
            font-size: 14px;
            font-weight: bold;
            color: black;
        }
        button.mpp-accordion:hover, button.mpp-accordion.mpp-accordion-is-open{
            background-color: #ddd;
        }

        .mpp-accordion-content{
            background: #eeeeee;
            border-left: 1px solid whitesmoke;
            border-right: 1px solid whitesmoke;
            padding: 0 20px;
            margin-bottom: 1px;
            max-height: 0;
            overflow: hidden;
            font-size: 10px;
        }

        .mpp-accordion-content.mpp-accordion-is-open{
            max-height: fit-content;
        }

        .mpp-sticky{
            position: sticky;
            top: 0;
        }

        .mpp-accordion-op{
            display: flex;

            justify-content: end;
            align-content: center;
        }
        .mpp-accordion-op a{
            padding: 5px;
            margin-left: 20px;
            font-size: 12px;
            cursor: pointer;
        }
        a.mpp-delete{
            text-align: right;
            color: brown;
        }
        
        a.mpp-sell{
            color: blueviolet;
            font-weight: bold;
        }
        
        a.mpp-hyperlink{
            color: blue;
        }
        a.mpp-hash{
            color: forestgreen;
        }
        
        .mpp-content-cell.mpp-content-title,
        .mpp-content-cell.mpp-content-last-fetch-time{
            justify-self: left; 
        }
        .mpp-content-cell.mpp-content-last-fetch-time{
            padding-left: 1em;
        }
        a.mpp-status{
            /*font-weight: bold;*/
            color: dodgerblue;
            cursor:pointer;
        }
        span.mpp-content-result{
            justify-self: center;
        }

    </style> 
    <div class="mpp-mask spp-hide"></div> 
    <div class="mpp spp-hide">
            <div class="mpp-container">
                <p class="mpp-title">我的Mark（保持此窗口开启才会运行）</p>
                <div class="mpp-main">
                    <div class="mpp-accordion-op mpp-sticky">
                        <a class="mpp-accordion-expand-all">全部展开</a>
                        <a class="mpp-accordion-collapse-all">全部折叠</a>  
                    </div>
                    <div class="mpp-header" >
                        <span class="mpp-header-cell mpp-content-result"></span> 
                        <span class="mpp-header-cell mpp-content-title" >帖子标题</span> 
                        <span class="mpp-header-cell">页数</span> 
                        <span class="mpp-header-cell mpp-content-last-fetch-time">检查时间</span> 
                        <span class="mpp-header-cell">悬赏状态</span> 
                        <span class="mpp-header-cell">MARK时间</span> 
                        <a class="mpp-delete mpp-content-cell" data-tid="1274464"></a>
                    </div>
                    <div class="mpp-content-container">
                        
                    </div>
                </div> 
            </div> 
        </div>
    
`);
    document.querySelector("#guide").prepend(menuButton);
    // document.querySelector('.fl>.gray2>.fl:first-child').insertAdjacentText("beforeend",
    //     `, `);
    // document.querySelector('.fl>.gray2>.fl:first-child').insertAdjacentHTML("beforeend",
    //     `<a class="mpp-status">我的MARK</a>`);
    document.querySelector(".mpp-accordion-expand-all").addEventListener("click", evt => {

        document.querySelectorAll(".mpp-accordion").forEach(ele => {
            if (!ele.nextElementSibling.querySelectorAll("p>a").length) return;
            if (!ele.classList.contains(" mpp-accordion-is-open")) ele.classList.add("mpp-accordion-is-open");
        });
        document.querySelectorAll(".mpp-accordion-content").forEach(ele => {
            if (!ele.querySelectorAll("p>a").length) return;
            if (!ele.classList.contains("mpp-accordion-is-open")) ele.classList.add("mpp-accordion-is-open");
            ele.style.maxHeight = ele.scrollHeight + 'px';
        });
    });
    document.querySelector(".mpp-accordion-collapse-all").addEventListener("click", evt => {
        document.querySelectorAll(".mpp-accordion").forEach(ele => {
            if (ele.classList.contains("mpp-accordion-is-open")) ele.classList.remove("mpp-accordion-is-open")
        });
        document.querySelectorAll(".mpp-accordion-content").forEach(ele => {
            if (ele.classList.contains("mpp-accordion-is-open")) ele.classList.remove("mpp-accordion-is-open")
            ele.style.maxHeight = null;
        });
    });

    // 用于tab之间广播通讯，只允许一个tab运行mark++
    const bc = new BroadcastChannel("Soul++:MppTaskStart");


    let refreshID;


    // 自己不会接到
    bc.onmessage = async msg => {
        console.log('BroadcastChannel:', msg.data);
        if (msg.data.includes("mppTaskStart")) {
            closeMenu(null);
            // toast("由于你在别的标签打开了“我的MARK”，此标签的“我的MARK”被关闭了",ToastType.WARNING, 99999 * 1000);
        }
    };


    function insertDataHTML() {
        let container = document.querySelector(".mpp-content-container");
        let threadsStatus = MppManager.getAllThreadStatus()
        let insertHTML = ``;
        for (const [_tid, status] of Object.entries(threadsStatus)) {
            let posts = "";
            if (status['sell']) status["sell"].forEach(ele => posts += `<p><a class="mpp-sell" href="${ele}" target="_blank">[出售]${ele}</a></p>`);
            if (status['hyperlink']) status["hyperlink"].forEach(ele => posts += `<p><a class="mpp-hyperlink" href="${ele}" target="_blank">[超链]${ele}</a></p>`);
            if (status["magnetOrMiaochuan"]) status["magnetOrMiaochuan"].forEach(ele => posts += `<p><a class="mpp-hash" href="${ele}" target="_blank">[磁力或秒传]${ele}</a></p>`);
            let button = container.querySelector(`button.mpp-accordion[data-tid="${_tid}"`);
            if (button) button.classList.remove("have-content");
            let content = container.querySelector(`div.mpp-accordion-content[data-tid="${_tid}"`);
            // console.log(button ? button.classList.toString() : "mpp-accordion");
            // console.log(content ? content.classList.toString() : "mpp-accordion-content");
            // <span class="mpp-content-cell mpp-accordion-plus">${posts === "" ? "" : button.classList.contains("") ? "-" : "+"}</span>
            insertHTML += `
            <button type="button" class="${button ? button.classList.toString() : "mpp-accordion"} ${posts ? "have-content" : ""}" data-tid="${_tid}">
                <a 
                class="mpp-content-cell mpp-content-title"  
                href="/read.php?tid=${_tid}" 
                target="_blank"
                >${status["title"].slice(0, 20)}${status["title"].length > 20 ? "..." : ""}</a> 
                <span class="mpp-content-cell">${status["page"] || 0} / ${status["maxPage"]}</span> 
                <span class="mpp-content-cell mpp-content-last-fetch-time">${status["lastFetchTime"] ? `${Math.round((getTimeStamp() - parseInt(status["lastFetchTime"])) / 1000 / 60)} 分钟之前` : '尚未检查'}</span> 
                <span class="mpp-content-cell">${status["offerState"]}</span> 
                <span class="mpp-content-cell">${status["markTime"]}</span> 
                <a class="mpp-delete mpp-content-cell" data-tid="${_tid}">删除</a>
            </button>

            <div class="${content ? content.classList.toString() : "mpp-accordion-content"}" data-tid="${_tid}">
                ` + posts + `
            </div>
            `;

        }
        container.innerHTML = insertHTML;
        document.querySelectorAll("button.mpp-accordion").forEach(ele => {
            ele.addEventListener("click", evt => {
                evt.stopPropagation();
                if (!evt.currentTarget.nextElementSibling.querySelectorAll("p>a").length) return;
                let btn = evt.currentTarget;
                let content = btn.nextElementSibling;
                btn.classList.toggle("mpp-accordion-is-open");
                content.classList.toggle("mpp-accordion-is-open");
                content.style.maxHeight = content.classList.contains("mpp-accordion-is-open") ? content.scrollHeight + 'px' : null;
                // evt.currentTarget.querySelector(".mpp-accordion-plus").textContent = content.classList.contains("mpp-accordion-is-open") ? "-" : "+";
            });

        });
        document.querySelectorAll(".mpp-delete.mpp-content-cell").forEach(ele => {
            ele.addEventListener("click", evt => {
                evt.stopPropagation();
                evt.preventDefault();
                if (!confirm("删除后无法撤销，确定删除？")) return;
                const parentButton = evt.currentTarget.closest("button")
                const content = parentButton.nextElementSibling;
                parentButton.remove();
                content.remove();
                MppManager.deleteMarkedThread(evt.currentTarget.dataset.tid);

            })
        });
    }

    function openStatus(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        // 显示数据
        insertDataHTML();

        // 显示菜单
        let sppMenu = document.querySelector(".mpp");
        sppMenu.classList.remove("spp-hide");
        // 显示遮罩
        let sppMenuMask = document.querySelector(".mpp-mask");
        sppMenuMask.classList.remove("spp-hide");
        // 防止滚动到菜单后面的页面
        document.body.style.overflow = "hidden";

        bc.postMessage('mppTaskStart');
        setTimeout(mppTask, 5000);
        sessionStorage.setItem("Soul++:MppTaskID", 'start');
        refreshID = setInterval(insertDataHTML, 1000);
    }

    function closeMenu(evt) {
        if (evt) evt.stopPropagation();
        document.body.style.overflow = null;
        let sppMenu = document.querySelector(".mpp");
        sppMenu.classList.add("spp-hide");
        let sppMenuMask = document.querySelector(".mpp-mask");
        sppMenuMask.classList.add("spp-hide");
        // clearInterval(parseInt(sessionStorage.getItem("Soul++:MppTaskID")));
        sessionStorage.setItem("Soul++:MppTaskID", 'stop');
        clearInterval(refreshID);
    }

    document.querySelector("a.mpp-status").addEventListener("click", openStatus)

    document.querySelector(".mpp-mask").addEventListener("click", closeMenu);


}

function backToTop() {

    const GMKey = "Style_backToTop";
    let backToTopButton = createFloatDraggableButton(
        "回到顶部",
        GMKey,
        {
            left: "calc(50vw + 470px)",
            bottom: "40px",
            background: "linear-gradient(to top, #eeeeee,#ffffff)",
            color: "black",
            fontWeight: "bold",
            outline: "none",
            border: "none",
            borderRadius: "3px",
            width: "30px",
            opacity: "80%",
            cursor: "pointer",
        }
    );

    let dragStart = {};
    let dragEnd = {};

    // 防止拖到视口以外了
    AddIntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) {
            console.log('LEAVE');
            backToTopButton.style.left = dragStart.saved.left;
            backToTopButton.style.bottom = dragStart.saved.bottom;
        }
    }, backToTopButton)

    backToTopButton.addEventListener("click", (e) => {
        e.stopPropagation();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    backToTopButton.addEventListener("dragstart", (e) => {
        e.stopPropagation();

        dragStart = {
            clientX: e.clientX,
            clientY: e.clientY,
            saved: {
                left: e.target.style.left,
                bottom: e.target.style.bottom,
            }
        }
    });

    backToTopButton.addEventListener("dragend", (e) => {
        e.stopPropagation();
        // 获得丅的交叉点坐标
        dragEnd = {
            clientX: e.clientX,
            clientY: e.clientY,
        }
        let newLeft = parseFloat(e.target.style.left.match(/(-?\d+)px/)[1]) + (dragEnd.clientX - dragStart.clientX);
        // bottom从下往上算的，所以要减
        let newBottom = parseFloat(e.target.style.bottom.match(/(-?\d+)px/)[1]) - (dragEnd.clientY - dragStart.clientY);


        e.target.style.left = `calc(50vw + ${newLeft}px)`;
        e.target.style.bottom = `${newBottom}px`;

        let tmp = {
            ...GMK.getValue(GMKey),
            ...{
                left: `calc(50vw + ${newLeft}px)`,
                bottom: `${newBottom}px`,
            }
        };
        GMK.setValue(GMKey, tmp);


    });

}

function postAddAnchorAttribute(target, pg, threadID) {
    target.querySelectorAll(".tpc_content .f14").forEach(ele => {
        ele.setAttribute("page", pg);
        ele.setAttribute("tid", threadID);
        let pid = ele.previousElementSibling.getAttribute("name");
        ele.setAttribute("pid", pid);

    });
}

function threadAddAnchorAttribute(target, pg, forumID) {
    target.querySelectorAll(".tr3.t_one").forEach(ele => {
        ele.setAttribute("page", pg);
        ele.setAttribute("fid", forumID);
        let tid_m = ele.querySelector("a").getAttribute("href").match(/tid-(\d+)/);
        if (!tid_m) return;
        let tid = tid_m[1];
        ele.setAttribute("tid", tid);

    });
}

function highlightViewedThread() {

    function removeCurrent() {
        let prev = document.querySelector(".spp-last-viewed-thread");
        if (prev) prev.classList.remove("spp-last-viewed-thread");
    }

    function setLastViewed() {
        let tmp = GMK.getValue("Soul++:lastViewedThread") || {};
        tmp[fid] = tid;
        GMK.setValue("Soul++:lastViewedThread", tmp);
    }

    function setViewed() {
        let tmp = GMK.getValue("Soul++:viewedThreads") || {};
        tmp[fid] = tmp[fid] || [];
        if (!tmp[fid].includes(tid)) tmp[fid].push(tid);
        GMK.setValue("Soul++:viewedThreads", tmp);
    }

    // 帖子阅读页面处理
    if ((document.location.href.includes("/read.php"))) {
        // 直接打开页面的话不会触发visibilitychange事件
        if (!document.hidden) setViewed();
        // 当visibilitychange触发时，hidden代表用户关闭或者离开了当前页面
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                setLastViewed();
            } else {
                setViewed();
            }
        });
    }
    // 帖子列表页面处理
    else if ((document.location.href.includes("/thread.php") || document.location.href.includes("/thread_new.php"))) {
        // 在帖子列表页面会主动滚动到最后浏览的帖子的位置
        document.addEventListener('readystatechange', (event) => {
            if (document.readyState === "complete") {
                history.scrollRestoration = "manual";
                let ele = document.querySelector(".spp-last-viewed-thread");
                if (!ele) return;
                ele.scrollIntoView({ behavior: "auto", block: "center" });
            }
        });

        // 主动更新帖子列表页
        // GM_addValueChangeListener(name, function(name, old_value, new_value, remote) {})
        GMK.addValueChangeListener("Soul++:viewedThreads", (_name, oldVal, newVal, remote) => {
            console.log(`本版块已阅帖：${newVal[fid]}`);
            document.querySelectorAll(".tr3.t_one").forEach(ele => {
                if (newVal[fid].includes(ele.getAttribute("tid"))) {
                    ele.querySelector("h3 a").classList.add("spp-viewed-thread");
                }
            });
        })
        GMK.addValueChangeListener("Soul++:lastViewedThread", (_name, oldVal, newVal, remote) => {
            // 新记录中当前fid下正在阅读的tid和DOM树中一致的话则返回
            if (document.querySelector(".spp-last-viewed-thread").getAttribute("tid") === newVal[fid]) return;
            console.log(`正在本版块阅读新帖：${newVal[fid]}`);
            removeCurrent();
            document.querySelectorAll(".tr3.t_one").forEach(ele => {
                if (ele.getAttribute("tid") === newVal[fid]) {
                    ele.classList.add("spp-last-viewed-thread");
                    ele.scrollIntoView({ behavior: "auto", block: "center" });
                }
            });
        })

        // 将已经阅读过的帖子改成灰色
        let readedThreads = GMK.getValue("Soul++:viewedThreads") || {};
        let thisForumReadedThreads = readedThreads[fid] || [];
        // console.log(`当前版块已读帖子：${thisForumReadedThreads}`);
        document.querySelectorAll("h3 a").forEach(ele => {
            let container = ele.closest(".tr3.t_one");
            if (!container) return;

            if (thisForumReadedThreads.includes(container.getAttribute("tid"))) {
                console.log(`${container.getAttribute("tid")} 已读`);
                ele.classList.add("spp-viewed-thread");
            }
            if (ele.getAttribute("id") === `a_ajax_${GMK.getValue("Soul++:lastViewedThread")[fid]}`) {
                container.classList.add("spp-last-viewed-thread");
            }
            ele.addEventListener("click", e => {
                e.stopPropagation();
                removeCurrent();
                e.target.closest(".tr3.t_one").classList.add("spp-last-viewed-thread");
            });
        });
    }
}

function createSettingMenu() {
    let menuBox = document.createElement("div");
    document.querySelector("#main").prepend(menuBox);

    let menuButton = document.createElement("li");
    let a = document.createElement("a");
    a.innerText = "Soul++";
    a.style.cursor = "pointer";
    menuButton.appendChild(a);
    a.addEventListener("click", e => {
        e.stopPropagation();
        // 读取数据更显选项显示
        document.querySelectorAll(".spp-accordion-content").forEach(ele => {
            ele.querySelectorAll(".spp-menu-checkbox").forEach(ele => {
                let checkbox = ele.querySelector("input");
                if (checkbox) {
                    let key = checkbox.dataset.funckey;
                    checkbox.checked = GMK.getValue(key);
                }
            })
        });

        // 显示菜单
        let sppMenu = document.querySelector(".spp-menu");
        sppMenu.classList.remove("spp-hide");
        // 显示遮罩
        let sppMenuMask = document.querySelector(".spp-menu-mask");
        sppMenuMask.classList.remove("spp-hide");
        // 防止滚动到菜单后面的页面
        document.body.style.overflow = "hidden";

    });
    document.querySelector("#guide").prepend(menuButton);

    menuBox.outerHTML = `
<div class="spp-menu-mask spp-hide"></div>
<div class="spp-menu spp-hide">
    <div class="spp-menu-container">
        <p class="spp-menu-title">Soul++ 设置</p>
        <div class="spp-menu-main">
            <div class="spp-menu-accordion-op spp-sticky">
                <a class="spp-menu-accordion-support-me" style="grid-column-start: 1">支持作者</a>
                <a class="spp-menu-accordion-expand-all" style="grid-column-start: 4">全部展开</a>
                <a class="spp-menu-accordion-collapse-all" style="grid-column-start: 5">全部折叠</a>
            </div>
            <button type="button" class="spp-accordion spp-accordion-is-open">🔄 免刷新</button>
            <div class="spp-accordion-content spp-accordion-is-open">
                <div class="spp-menu-checkbox"><label><input data-funcKey="buyRefresh_free" type="checkbox" id="buy-refresh-free">购买免刷新</label></div>
            </div>


            <button type="button" class="spp-accordion spp-accordion-is-open">♾️ 无缝加载</button>
            <div class="spp-accordion-content spp-accordion-is-open">
                <div class="spp-menu-checkbox"><label><input data-funcKey="dynamicLoadingThreads" type="checkbox" id="dynamic-load-posts">无缝加载板块帖子列表</label></div>
                <div class="spp-menu-checkbox"><label><input data-funcKey="dynamicLoadingPosts" type="checkbox" id="dynamic-load-threads">无缝加载贴内楼层列表</label></div>
                <div class="spp-menu-checkbox"><label><input data-funcKey="dynamicLoadingSearchResult" type="checkbox" id="dynamic-load-search-result">无缝加载搜索页结果</label></div>
                <div class="spp-menu-checkbox"><label><input data-funcKey="dynamicLoadingPicWall" type="checkbox" id="dynamic-load-pic-wall">无缝加载图墙模式帖子</label></div>
            </div>

            <button type="button" class="spp-accordion spp-accordion-is-open">🛑 屏蔽</button>
            <div class="spp-accordion-content spp-accordion-is-open">
                <div class="spp-menu-checkbox"><label><input data-funcKey="blockAdforumSearchResult" type="checkbox" id="block-adforum-search-result">屏蔽网赚区搜索结果</label></div>
            </div>

            <button type="button" class="spp-accordion spp-accordion-is-open">🔞 SFW安全模式</button>
            <div class="spp-accordion-content spp-accordion-is-open">
                <div class="spp-menu-checkbox"><label><input data-funcKey="hidePostImage" type="checkbox" id="hide-post-image">折叠贴内图片（点击虚线框 展开/折叠 图片）</label></div>
                <div class="spp-menu-checkbox spp-menu-sub-item"><label><input data-funcKey="loadImageOnDemand" type="checkbox" id="load-image-on-demand">按需加载头像、图片（展开后才开始加载）</label></div>
                <div class="spp-menu-checkbox"><label><input data-funcKey="hideForumRules" type="checkbox" id="hide-chaguan-poster">折叠板块公告（其实板块公告右边有个小箭头，我只是帮你们点了一下）</label></div>
                <div class="spp-menu-checkbox"><label><input data-funcKey="hideUserAvatar" type="checkbox" id="hide-user-avatar">替换用户头像为默认（鼠标滑入查看）</label></div>
            </div>
            <button type="button" class="spp-accordion spp-accordion-is-open">🔖 mark++</button>
            <div class="spp-accordion-content spp-accordion-is-open">
                <div class="spp-menu-checkbox"><label><input data-funcKey="markPlusPlus" type="checkbox" id="mark-plus-plus">开启MARK++</label></div>
                <div class="spp-menu-checkbox"><label class="spp-menu-description">- 打开后查看帖子页面右边会出现MARK按钮（可拖到任意位置）</label></div>
                <div class="spp-menu-checkbox"><label class="spp-menu-description">- 点击MARK之后，当前帖子会加入到“我的MARK”列表里</label></div>
                <div class="spp-menu-checkbox"><label class="spp-menu-description">- 在导航栏可以找到“我的MARK”入口，右键点击MARK按钮也可以打开“我的MARK”</label></div>
                <div class="spp-menu-checkbox"><label class="spp-menu-description" style="color: brown">- 保持打开“我的MARK”窗口，脚本会以5秒/帖的频率检查MARK列表</label></div>
                <div class="spp-menu-checkbox"><label class="spp-menu-description" style="color: brown">- 同一时间只允许一个浏览器标签打开“我的MARK”</label></div>
            </div>
            <button type="button" class="spp-accordion spp-accordion-is-open">💠 其它</button>
            <div class="spp-accordion-content spp-accordion-is-open">
                <div class="spp-menu-checkbox"><label><input data-funcKey="automaticTaskCollection" type="checkbox" id="automatic-task-collection">自动领取和完成论坛任务</label></div>
                <div class="spp-menu-checkbox"><label><input data-funcKey="hoistingResourcePost" type="checkbox" id="hoisting-resource-post">将当前页包含[购买/秒传/磁力链/超链]的楼层提升到前面</label></div>
                <div class="spp-menu-checkbox"><label><input data-funcKey="replaceAllDomainToTheSame" type="checkbox" id="replace-all-plus-to-the-same">统一替换所有plus链接为当前正在使用的域名</label></div>
                <div class="spp-menu-checkbox"><label><input data-funcKey="highlightViewedThread" type="checkbox" id="highlight-viewed-threads">标记已阅读过的帖子</label></div>
                <div class="spp-menu-checkbox"><label><input data-funcKey="linkToReplyAndQuote" type="checkbox" id="link-to-reply-and-quote">给[回复第X楼/引用第X楼]增加跳转到该楼层的链接</label></div>
            </div>
            <button type="button" class="spp-accordion spp-danger">❗</button>
            <div class="spp-accordion-content spp-danger-content">
                <button class="spp-btn-danger" data-funcKey="resetAll" id="spp-reset-all">清空所有设置</button>
            </div>

        </div>
        <div class="spp-menu-op-zone">
            <button id="spp-menu-close"><img alt="" src="images/post/smile/smallface/face099.jpg"/> 我好了</button>
        </div>
    </div>
</div>
 
`;

    (function () {
        function closeMenu(evt, saveAndRefresh) {
            evt.stopPropagation();
            document.body.style.overflow = null;
            let sppMenu = document.querySelector(".spp-menu");
            sppMenu.classList.add("spp-hide");
            let sppMenuMask = document.querySelector(".spp-menu-mask");
            sppMenuMask.classList.add("spp-hide");
            if (saveAndRefresh) {
                changes.forEach(e => GMK.setValue(e[0], e[1]))
                document.location.reload();
            }
            changes = [];

        }

        window.addEventListener("keydown", evt => {
            if (evt.key === "Escape") closeMenu(evt, false);
        });
        let changes = [];
        document.querySelectorAll(".spp-menu-checkbox input").forEach(ele => {
            ele.addEventListener("change", evt => {
                changes.push([evt.currentTarget.dataset.funckey, evt.currentTarget.checked]);
            });
        });

        document.querySelector("#spp-menu-close").addEventListener("click", evt => closeMenu(evt, true));
        document.querySelector(".spp-menu-mask").addEventListener("click", evt => closeMenu(evt, false));
        document.querySelector("#spp-reset-all").addEventListener("click", evt => {
            evt.stopPropagation();

            if (confirm(
                `
                【警告】
                这将会清空你在所有的数据和设置，包括：
                - 已读的帖子
                - 可拖放按钮的位置
                - 已经MARK过的帖子
                
                你确定要这样做？`
            )) {
                GMK.listValues().forEach(vName => {
                    console.log(vName);
                    GMK.deleteValue(vName);
                });
                console.log(GMK.listValues());
                document.location.reload();
            }
        });
        document.querySelector(".spp-menu-accordion-support-me").addEventListener("click", evt => {
            evt.stopPropagation();
            let toastTip = Toastify({
                text: "点我或者点击图片即可关闭",
                duration: 15000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {},
                onClick: function () {
                    toastTip.hideToast();
                    toastRedEnvelop.hideToast();
                }
            })
            toastTip.showToast();
            let img = document.createElement("img");
            img.style.background = "none";
            img.style.boxShadow = "none";
            img.style.borderRadius = "10px";
            img.style.width = "300px";
            img.style.height = "435px";
            img.src = 'https://cdn.jsdelivr.net/gh/FetchTheMoon/UserScript/images/RedEnvelope.jpg';
            let toastRedEnvelop = Toastify({
                node: img,
                duration: 9999999,
                close: false,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "none",
                    boxShadow: "none",
                },
                onClick: function () {
                    toastTip.hideToast();
                    toastRedEnvelop.hideToast();
                }
            });
            toastRedEnvelop.showToast();
        });
        document.querySelector(".spp-menu-accordion-expand-all").addEventListener("click", evt => {

            document.querySelectorAll(".spp-accordion").forEach(ele => {
                if (ele.classList.contains("spp-danger")) return;
                if (!ele.classList.contains(" spp-accordion-is-open")) ele.classList.add("spp-accordion-is-open");
            });
            document.querySelectorAll(".spp-accordion-content").forEach(ele => {
                if (ele.classList.contains("spp-danger-content")) return;
                if (!ele.classList.contains("spp-accordion-is-open")) ele.classList.add("spp-accordion-is-open");
                ele.style.maxHeight = ele.scrollHeight + 'px';
            });
        });
        document.querySelector(".spp-menu-accordion-collapse-all").addEventListener("click", evt => {
            document.querySelectorAll(".spp-accordion").forEach(ele => {
                if (ele.classList.contains("spp-accordion-is-open")) ele.classList.remove("spp-accordion-is-open")
            });
            document.querySelectorAll(".spp-accordion-content").forEach(ele => {
                if (ele.classList.contains("spp-accordion-is-open")) ele.classList.remove("spp-accordion-is-open")
                ele.style.maxHeight = null;
            });
        });
        document.querySelectorAll("button.spp-accordion").forEach(ele => {
            ele.addEventListener("click", evt => {
                evt.stopPropagation();
                let btn = evt.target;
                let content = btn.nextElementSibling;
                btn.classList.toggle("spp-accordion-is-open");
                content.classList.toggle("spp-accordion-is-open");
                content.style.maxHeight = content.classList.contains("spp-accordion-is-open") ? content.scrollHeight + 'px' : null;
            });

        });
    }());
}

function replaceAllDomainToTheSame() {


    const arr = [...document.querySelectorAll("a")];
    const domains = [
        "spring-plus.net",
        "summer-plus.net",
        "soul-plus.net",
        "south-plus.net",
        "north-plus.net",
        "snow-plus.net",
        "level-plus.net",
        "white-plus.net",
        "imoutolove.me",
        "south-plus.org",
    ];
    const checker = value => domains.some(element => value.href.includes(element));

    arr.filter(checker).filter(ele => !ele.href.includes(window.location.hostname)).forEach(ele => {
        console.log("替换链接:", ele);
        let newURL = new URL(ele.href);
        newURL.hostname = window.location.hostname;
        ele.href = newURL.href;
    });


}

function MutationObserverProcess() {
    function callback(mutationList, observer) {
        mutationList.forEach((mutation) => {
            mutation.addedNodes.forEach(ele => {

                if (ele.tagName === "IMG") {
                    if (ele.classList.contains("spp-mutation-processed")) return

                    function hide(confirmSelector, handler) {
                        const postContainer = ele.closest(confirmSelector);
                        if (!postContainer) return
                        handler(ele);
                        ele.classList.add("spp-mutation-processed");
                    }

                    if (document.location.href.includes("/read.php")) {
                        ele.setAttribute("loading", "lazy");
                        if (GMK.getValue("hideUserAvatar")) hide(".user-pic", hideAvatar)
                        if (GMK.getValue("hidePostImage")) hide(".t5.t2 .r_one", hideImg)
                    }
                }
                if (document.location.href.includes("/read.php") && GMK.getValue("linkToReplyAndQuote")) {
                    if (ele.title === "复制此楼地址") {
                        ele.insertAdjacentHTML("beforebegin", `<a name="SPP-${ele.innerText}" id="SPP-${ele.innerText}"></a>`);
                    }
                }
            });
        });


    }

    let observerOptions = {
        childList: true,  // 观察目标子节点的变化，是否有添加或者删除
        attributes: true, // 观察属性变动
        subtree: true     // 观察后代节点，默认为 false
    }

    let observer = new MutationObserver(callback);
    observer.observe(document.documentElement, observerOptions);
}

async function mppTask() {
    let taskInterval = 5000;
    await (async function () {

        // 先查询页数没到最后一页的
        let markedList = Object.entries(MppManager.getMarkList()).filter(e => {
            return e[1]['maxPage'] - e[1]['page'] > 0
        });
        // 如果都到最后一页了，就按上次查询时间距今最远的来
        if (!markedList.length) {
            markedList = Object.entries(MppManager.getMarkList())
                .sort((f, s) => {
                    return f[1]['lastFetchTime'] - s[1]['lastFetchTime']
                });
        }
        console.log(markedList);
        if (!markedList.length) return;
        if (MppManager.isAllChecked()) taskInterval = 10 * 1000;
        let [_tid, threadStatus] = markedList[0];
        let maxPage = threadStatus['maxPage'] || 1;
        let currentPage = threadStatus["page"] || 1;
        const dummy = await getPage(`/read.php?tid=${_tid}&page=${currentPage}`, true);
        const m = dummy.innerHTML.match(/var totalpage = parseInt\('(\d+)'\)/);
        if (m) maxPage = parseInt(m[1]);
        const allPosts = [...dummy.querySelectorAll(".t5.t2")];

        function getOfferState(dummy) {
            const ele = dummy.querySelector(".tips .s3");
            if (!ele) {
                console.log("没找到悬赏状态", ele, dummy);
                return;
            }
            const state = ele.textContent;
            if (state.includes("剩余时间:已结束")) {
                return "悬赏超时";
            } else if (state.includes("悬赏结束")) {
                return `<a class="mpp-sell" href='/read.php?tid=${_tid}' target="_blank" style="color: #73a5ff">有答案了</a>`;
            } else if (state.includes("悬赏中")) {
                return `剩余${state.match(/(\d+)小时/)[1]}小时`;
            }
        }

        if (currentPage === 1) {
            threadStatus["offerState"] = getOfferState(dummy);
            allPosts.shift();
        }
        // 在第一页获取一下帖子的状态,看看到底有没有结贴
        if (threadStatus["allPagesChecked"]) {
            await sleep(5000); // 否则会遇到提示刷新小于1秒;
            const page1dummy = await getPage(`/read.php?tid=${_tid}&page=1`, true);
            threadStatus["offerState"] = getOfferState(page1dummy);
        }
        threadStatus["sell"] = threadStatus["sell"] || [];
        threadStatus["hyperlink"] = threadStatus["hyperlink"] || [];
        threadStatus["magnetOrMiaochuan"] = threadStatus["magnetOrMiaochuan"] || [];
        threadStatus['title'] = dummy.querySelector('.crumbs-item.current strong>a').textContent;
        threadStatus['lastFetchTime'] = getTimeStamp();
        threadStatus['maxPage'] = maxPage;
        threadStatus["page"] += currentPage < maxPage ? 1 : 0;
        const getPid = (post) => {
            return post.previousSibling.getAttribute("name");
        }
        allPosts.forEach(post => {

            let u = `/read.php?tid=${_tid}&page=${currentPage}#${getPid(post)}`;
            if (post.querySelector(".quote.jumbotron")) {
                if (!threadStatus["sell"].includes(u)) threadStatus["sell"].push(u)
            } else if (post.querySelector(".tpc_content a")) {
                if (!threadStatus["hyperlink"].includes(u)) threadStatus["hyperlink"].push(u);
            } else if (post.querySelector(".tpc_content").textContent.match(/^[0-9a-fA-F]{20,}/mg)) {
                if (!threadStatus["magnetOrMiaochuan"].includes(u)) threadStatus["magnetOrMiaochuan"].push(u);
            }
        });


        threadStatus["allPagesChecked"] = currentPage === maxPage;
        if (MppManager.isThreadExist(_tid)) MppManager.setThreadStatus(_tid, threadStatus);
        console.log(threadStatus);

    })();
    if (sessionStorage.getItem("Soul++:MppTaskID") === 'start') setTimeout(mppTask, taskInterval);

}

function linkToReplyAndQuote(target = document) {
    if (window.location.hash.includes("#SPP-")) {
        const ele = document.querySelector(window.location.hash);
        if (ele) ele.scrollIntoView();
    }

    let allPosts = [...target.querySelectorAll(".t5.t2")];
    allPosts.forEach(ele => {
        const quote = ele.querySelector("h6.quote2+div");
        if (quote) {
            const floor = parseInt(quote.firstChild.textContent.match(/引用第(\d+)楼/)[1]);
            const page = Math.ceil(floor / 30);
            const text = quote.firstChild.textContent.replace(/引用(第\d+楼)(.+)/, `引用<a style="color: dodgerblue" href="/read.php?tid=${tid}&page=${page}#SPP-B${floor}F">$1</a>$2`);
            quote.removeChild(quote.firstChild);
            quote.insertAdjacentHTML("afterbegin", text);

        }
        const reply = ele.querySelector(".h1.fl>.fl");
        if (reply) {
            const m = reply.firstChild.textContent.match(/回 (\d+)楼/);
            if(!m) return
            const floor = parseInt(m[1]);
            const page = Math.ceil(floor / 30);
            const text = reply.innerText.replace(/回 (\d+)楼(.+)/, `回 <a style="color: dodgerblue" href="/read.php?tid=${tid}&page=${page}#SPP-B${floor}F">$1楼</a>$2`);
            reply.innerText = "";
            reply.insertAdjacentHTML("afterbegin", text);

        }
    });
}

function hoistingResourcePost(target = document) {
    if (document.location.href.includes("#")) return;
    let allPosts = [...target.querySelectorAll(".t5.t2")];

    // 是否拿出顶楼
    const insertPosition = page === 1 ? allPosts.shift() : target.querySelector("input[name=tid]");
    const resourcePosts = allPosts.filter(post =>
        post.querySelector(".quote.jumbotron")
        || post.querySelector(".tpc_content a")
        || post.querySelector(".tpc_content").textContent.match(/^[0-9a-fA-F]{20,}/mg)
    ).reverse();
    resourcePosts.forEach(ele => insertPosition.after(ele));

}

function AddIntersectionObserver(callback, element) {
    const obs = new window.IntersectionObserver(callback, {
        root: null,
        threshold: 0.5,
    })
    obs.observe(element);
}

//##############################################################
// 执行入口
//##############################################################
(function () {

    GMK.addStyle(`<style>
    .spp-last-viewed-thread{
        background: #deeeff;
    }
    .spp-viewed-thread{
        color: #bbbbbb;
    }
    .spp-hide{
        display: none;
    }
    
    
        
    .spp-menu{
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: white; 
        z-index: 2000000; 
    }
    .spp-menu-mask{
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.5;
        user-select: none;
        z-index: 1000000; 
    }
    .spp-menu-container{
        background: #eeeeee;
        display:grid;
        grid-template-areas:
            "title"
            "main"
            "op";
        grid-template-rows: 28px auto 40px;
        grid-gap: 10px;
        min-height: 80vh;
        max-height: 80vh;
        width: 600px; 
    }
    .spp-menu-title{
        grid-area: title;
        background: url(images/colorImagination/bg_topnav.gif) repeat-x #000000;
        border-left: black;
        border-right: black;
        text-align: center;
        font-weight: bold;
        height: 100%;
        color: white;
        padding-top: 5px;
        margin: 0;
    }
    
    .spp-menu-main{
        grid-area: main;
        height: 70vh;
        overflow-y: scroll;
    }
    
    /*.spp-menu-op-zone{*/
    /*    grid-area: op;*/
    /*    display: grid;*/
    /*    grid-template-columns: 50% 50%;*/
    /*}*/
    
    .spp-hide{
        display: none;
    }
    
    button.spp-accordion{
        width: 100%;
        border: none;
        outline: none;
        background-color: whitesmoke;
        text-align: left;
        padding: 10px 10px;
        font-size: 14px;
        font-weight: bold;
        color: #444;
        cursor: pointer;
        transition: background-color 0.2s linear;
    }
    
    button.spp-accordion:after{
        content:'+';
        font-size: 14px;
        float: right;
    }
    
    button.spp-accordion.spp-accordion-is-open:after{
        content: '-';
    }
    
    button.spp-accordion:hover, button.spp-accordion.spp-accordion-is-open{
        background-color: #ddd;
    }
    
    .spp-accordion-content{
        background: #eeeeee;
        border-left: 1px solid whitesmoke;
        border-right: 1px solid whitesmoke;
        padding: 0 20px;
        margin-bottom: 3px;
        max-height: 0;
        overflow: hidden;
        /*transition: all 0.2s ease-in-out;*/
        font-size: 14px;
    }
    
    .spp-accordion-content.spp-accordion-is-open{
        max-height: fit-content;
        /*transition: all 0.2s ease-in-out;*/
    }
    
    .spp-sticky{
        position: sticky;
        top: 0;
    }
    
    .spp-menu-accordion-op{
        display: grid;
        grid-template-columns: repeat(5,1fr);
        justify-content: end;
        align-content: center;
    }
    .spp-menu-accordion-op a{
        padding: 5px;
        margin-left: 20px;
        font-size: 12px;
        cursor: pointer;
    }
    
    .spp-menu-checkbox{
        margin: 10px;
    }
    .spp-menu-checkbox input[type="checkbox"]{
        margin-bottom: 5px;
    }
    /*.spp-menu-op-zone{*/
    
    /*    display: flex;*/
    /*    justify-content: space-around;*/
    /*    align-content: center;*/
    /*}*/
    
    .spp-menu-op-zone button{
        display: block;
        width: 100%;
        height: 100%;
        background: black;
        color: white;
        border: 1px solid black;
        font-size: 16px;
        font-family: 宋体,"sans-serif";
        font-weight: bold;
        cursor: pointer;
        
    }
    
    #spp-menu-close{
       background:linear-gradient(to bottom, #3a3a3a,#000000);
    }
     
    .spp-menu-description{
        padding-left: 20px;
        font-size: 12px;
    }
    
    .spp-danger-content{
        padding: 0;
    }
    
    .spp-btn-danger{
        display: block;
        background: crimson;
        color: whitesmoke;
        width: 100%;
        height: 40px;
        border: none;
        outline: none;
        cursor: pointer;
    }
    .spp-menu-sub-item{
        padding-left: 20px;
    }
        .spp-loading-animation{
            width:150px;
            margin:50px auto;
            text-align: center;
        }
        .spp-loading-animation >div{
            width: 18px;
            height: 18px;
            border-radius: 100%;
            display:inline-block;
            background-color: #af0909;
            -webkit-animation: dot 1.4s infinite ease-in-out;
            animation: dot 1.4s infinite ease-in-out;
            -webkit-animation-fill-mode: both;
            animation-fill-mode: both;
        }
        .spp-loading-animation .dot1{
            -webkit-animation-delay: -0.30s;
            animation-delay: -0.30s;
        }
        .spp-loading-animation .dot2{
            -webkit-animation-delay: -0.15s;
            animation-delay: -0.15s;
        }
        @-webkit-keyframes dot {
            0%, 80%, 100% {-webkit-transform: scale(0.0) }
            40% { -webkit-transform: scale(1.0) }
        }
        @keyframes dot {
            0%, 80%, 100% {-webkit-transform: scale(0.0) }
            40% { -webkit-transform: scale(1.0) }
        }
    </style>`.replace(/<\/?style>/gm, ""));
    GMK.addStyle(GMK.getResourceText("TOASTIFY_CSS"));

    console.log(`=======================================
            Soul++ 已经启动
=======================================`);
    // 给所有图片增加懒加载，以及处理图片隐藏
    MutationObserverProcess();

    // toast("Soul++ 已启动，可以在论坛导航栏进行设置", ToastType.WARNING, 5000);
    // toast("Soul++ 已启动，可以在论坛导航栏进行设置", ToastType.INFO, 5000);
    // toast("Soul++ 已启动，可以在论坛导航栏进行设置", ToastType.SUCCESS, 5000);
    // toast("Soul++ 已启动，可以在论坛导航栏进行设置", ToastType.DANGER, 5000);

    document.addEventListener("readystatechange", evt => {
        if (!(document.readyState === "interactive")) return;
        createSettingMenu();
        backToTop();

        if (document.location.href.includes("/read.php")) {
            postAddAnchorAttribute(document, page, tid);
            if (GMK.getValue("hoistingResourcePost")) {
                hoistingResourcePost();
            }
            if (GMK.getValue("linkToReplyAndQuote")) {
                linkToReplyAndQuote();
            }
        }
        if (document.location.href.includes("/thread.php")) {
            threadAddAnchorAttribute(document, page, fid);
            if (GMK.getValue("hideForumRules")) {
                document.cookie = "deploy=%09thread%09%0A;"
                document.querySelector("#cate_thread").style.display = "none";
            } else {
                document.cookie = "deploy=;"
                document.querySelector("#cate_thread").style.display = null;
            }
        }

        if (GMK.getValue("buyRefresh_free") && document.location.href.includes("/read.php")) {
            buyRefresh_free();
        }
        if (GMK.getValue("dynamicLoadingThreads") && (document.location.href.includes("/thread.php"))) {
            dynamicLoadingNextPage(PageType.THREADS_PAGE);
        }
        if (GMK.getValue("dynamicLoadingPicWall") && document.location.href.includes("/thread_new.php")) {
            dynamicLoadingNextPage(PageType.PIC_WALL_PAGE);
        }
        if (GMK.getValue("dynamicLoadingPosts") && document.location.href.includes("/read.php")) {
            dynamicLoadingNextPage(PageType.POSTS_PAGE);
        }
        if (GMK.getValue("dynamicLoadingSearchResult") && document.location.href.includes("/search.php")) {
            dynamicLoadingNextPage(PageType.SEARCH_RESULT);
        }
        if (GMK.getValue("blockAdforumSearchResult") && document.location.href.includes("/search.php")) {
            blockAdforumSearchResult();
        }
        if (GMK.getValue("automaticTaskCollection")) {
            automaticTaskCollection();
        }
        if (GMK.getValue("highlightViewedThread")) {
            highlightViewedThread();
        }
        if (GMK.getValue("replaceAllDomainToTheSame")) {
            replaceAllDomainToTheSame();
        }
        if (GMK.getValue("markPlusPlus")) {
            mark();
        }

    });


})();




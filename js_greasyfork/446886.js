// ==UserScript==
// @name         哪里看
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  在豆瓣网页检索哪里可以看对应电影，电视剧
// @author       no name
// @match        https://movie.douban.com/subject/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      yysub.net
// @connect      88hd.com
// @connect      so.iqiyi.com
// @connect      v.qq.com
// @connect      so.youku.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446886/%E5%93%AA%E9%87%8C%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446886/%E5%93%AA%E9%87%8C%E7%9C%8B.meta.js
// ==/UserScript==

// 获取对应网站信息
function getMovieFromWebSite() {
    // 获取豆瓣页面电影名字
    let movieName = getMovieNameFromDouBan()
    //获取 YYeTs
    const YYeTs = new Promise(function (resolve, reject) {
        let getMovieIdUrl = `https://www.yysub.net/search/index?keyword=${movieName}&search_type=`
        getMovieId(getMovieIdUrl, resolve, reject)
    }).then(function (val) {
        createLi(val[1], "人人字幕组", val[0])
        createCss()
    })
    //获取 88 影视
    // const _88hub = new Promise(function (resolve, reject) {
    //     let getMovieIdUrl = `https://www.88hd.com/search/`
    //     getMovieIdFrom88hub(getMovieIdUrl, resolve, reject)
    // }).then(function (val) {
    //     createLi(val[1], "人人字幕组", val[0])
    //     createCss()
    // })
    // 获取爱奇艺影视
    const aiqiyi = new Promise(function (resolve, reject) {
        let getMovieIdUrl = `https://so.iqiyi.com/so/q_${movieName}`
        getMovieIdFromAiQiYi(getMovieIdUrl, resolve, reject)
    }).then(function (val) {
        createLi(val[1], "爱奇艺", val[0])
        createCss()
    })
    // 获取腾讯视频
    const tengxun = new Promise(function (resolve, reject) {
        let getMovieIdUrl = `https://v.qq.com/x/search/?q=${movieName}`
        getMovieIdFromTengXun(getMovieIdUrl, resolve, reject)
    }).then(function (val) {
        createLi(val[1], "腾讯视频", val[0])
        createCss()
    })
    // 获取优酷视频
    const youku = new Promise(function (resolve, reject) {
        let getMovieIdUrl = `https://so.youku.com/search_video/q_${movieName}`
        getMovieIdFromYouKu(getMovieIdUrl, resolve, reject)
    }).then(function (val) {
        createLi(val[1], "优酷视频", val[0])
        createCss()
    })
}

// 获取人人影视电影的 Id, 通过是否有 Id 来判断是否有资源 
function getMovieId(getMovieIdUrl, resolve, reject) {
    GM_xmlhttpRequest({
        method: "GET",
        url: getMovieIdUrl,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: "",
        onload: function (response) {
            const regexpResourceId = /\/resource\/[0-9]+/
            let resourceMovieId = response.responseText.match(regexpResourceId)
            let info = new Array();
            if (resourceMovieId === null) {
                info = [0, ""]
            } else {
                console.log("resourceMovieId", resourceMovieId[0])
                // 提取电影 id
                const regexpMovieId = /[0-9]{5,5}/
                // 将数组元素 resourceMovieId 转换成字符串
                movieId = resourceMovieId.toString().match(regexpMovieId)
                console.log("movieId", movieId[0].toString())
                // 传递的数组
                info = [1, "https://www.yysub.net/resource/list/" + movieId]
            }
            resolve(info)
        },
        onerror: function (response) {
            let info = [-1, ""]
            reject(info)
        }
    });
}

// 获取 88 影视的 Id, 通过是否有 Id 来判断是否有资源 
// function getMovieIdFrom88hub(getMovieIdUrl, resolve, reject) {
//     GM_xmlhttpRequest({
//         method: "POST",
//         url: getMovieIdUrl,
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded"
//         },
//         data: "wd=%E6%A2%A6%E5%8D%8E%E5%BD%95&submit=",
//         onload: function (response) {
//             console.log("请求成功")
//             console.log(response.responseText)
//             resolve(1)
//         },
//         onerror: function (response) {
//             console.log("请求失败", response);
//             reject(0)
//         }
//     });
// }

// 获取爱奇艺影视的资源
function getMovieIdFromAiQiYi(getMovieIdUrl, resolve, reject) {
    GM_xmlhttpRequest({
        method: "GET",
        url: getMovieIdUrl,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: "",
        onload: function (response) {
            let info = new Array();

            const resourceScore = `title-score`
            let isMatch = response.responseText.match(resourceScore)

            if (isMatch != null) {
                info[0] = 1
                info[1] = getMovieIdUrl
            } else {
                info[0] = 0
                info[1] = ""
            }
            resolve(info)

        },
        onerror: function (response) {
            let info = [-1, ""]
            reject(info)
        }
    });
}

// 获取腾讯视频的资源
function getMovieIdFromTengXun(getMovieIdUrl, resolve, reject) {
    GM_xmlhttpRequest({
        method: "GET",
        url: getMovieIdUrl,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: "",
        onload: function (response) {
            let info = new Array();

            const resourceScore = `result_score`
            let isMatch = response.responseText.match(resourceScore)

            if (isMatch != null) {
                info[0] = 1
                info[1] = getMovieIdUrl
            } else {
                info[0] = 0
                info[1] = ""
            }
            resolve(info)
        },
        onerror: function (response) {
            let info = [-1, ""]
            reject(info)
        }
    });
}

// 获取优酷资源
function getMovieIdFromYouKu(getMovieIdUrl, resolve, reject) {
    GM_xmlhttpRequest({
        method: "GET",
        url: getMovieIdUrl,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        data: "",
        onload: function (response) {
            let info = new Array();
            console.log(response.responseText)

            const resourceScore = `data-spm="PhoneSokuProgram_1"`
            let isMatch = response.responseText.match(resourceScore)

            const playSource = `播放源`
            let isExitPlaySource = response.responseText.match(playSource)

            if (isMatch != null && isExitPlaySource == null) {
                info[0] = 1
                info[1] = getMovieIdUrl
            } else {
                info[0] = 0
                info[1] = ""
            }
            resolve(info)
        },
        onerror: function (response) {
            let info = [-1, ""]
            reject(info)
        }
    });
}

/* 
    以下是工具方法
*/

// 公共 HTML
function createHTML() {
    // 获取豆瓣右侧栏节点
    let aside = document.querySelector(".aside")
    // 获取豆瓣片单推荐
    let subject_doulist = document.querySelector("#subject-doulist")
    // 创建自己的插件展示根节点
    let wrap = document.createElement("div")
    // 为该根节点添加类名
    wrap.classList.add("subject-wheretowatch")
    wrap.innerHTML = `<h2>
                        <i>哪里看</i>
                        · · · · · ·
                        <span class="p1">
                        (
                        <a href="https://github.com/Eternaldeath/whereToWatch/issues">纠错与建议</a>
                        )
                        </span>
                      </h2>
                      <ul class="ulInfo"></ul>
                      <p class="note">全网搜索，仅显示最终播放源</P>
                      `

    aside.insertBefore(wrap, subject_doulist)
}

// 生成 li
function createLi(url, siteName, res) {
    let ulInfo = document.querySelector(".subject-wheretowatch .ulInfo")
    let li = document.createElement("li")
    if (res === 1) {
        li.innerHTML = `
            <span>${siteName}</span>
            <span>
                <a href=${url}>资源链接</a>
            </span>
        `
    } else if (res === 0) {
        li.innerHTML = `
            <span>${siteName}</span>
            <span style="color: red">暂无资源</span>
        `
    } else if (res === -1) {
        li.innerHTML = `
                <span>${siteName}</span>
                <span style="color: red">请求失败</span>
        `
    }

    ulInfo.appendChild(li)
}

// 生成基本 css 样式
function createCss() {
    const css = `.subject-wheretowatch{
        margin-bottom: 40px;
        word-wrap: break-word;
    }
    
    .subject-wheretowatch ul{
        border-top: 1px dashed #DDD;
        list-style: none;
    }
    
    .subject-wheretowatch li{
        padding: 4.5px 0;
        border-bottom: 1px dashed #DDD;
    }
    
    .subject-wheretowatch .p1{
        font: 13px Arial, Helvetica, sans-serif;
        line-height: 150%;
        color: #666666;
    }

    .subject-wheretowatch a:link{
        color: #37a;
        text-decoration: none;
    }

    .subject-wheretowatch a{
        cursor: pointer;
    }

    .subject-wheretowatch .none{
        display: none;
    }

    .subject-wheretowatch .note{
        color: #999AAA;
        font-size: 6px;
        font-weight: bold;
    }
    `

    GM_addStyle(css)
}

/* 
    根据返回值隐藏模块
*/
// function displayNoneByRes(res) {
//     let span = document.querySelectorAll(".subject-wheretowatch ul span")

//     if (res === 1) {
//         // 隐藏“暂无资源”
//         span[2].style.cssText = 'display: none'
//         // 隐藏请求失败模块
//         ulError.style.cssText = 'display: none'
//     } else if (res === 0) {
//         // 隐藏“资源链接”
//         span[1].style.cssText = 'display: none'
//         span[2].style.cssText = 'color: #FF0000; font-weight: bold'
//         // 隐藏请求失败模块
//         ulError.style.cssText = 'display: none'
//     } else if (res === -1) {
//         ulInfo.style.cssText = 'display: none'
//     }
// }

// 获取豆瓣页面电影资源标题
function getMovieNameFromDouBan() {
    let movieFullName = document.querySelector("#content > h1 > span").innerHTML
    let movieName = movieFullName.split(' ')[0]
    return movieName
}

(function () {
    getMovieFromWebSite()
    createHTML()

})();
// ==UserScript==
// @name        套图岛
// @namespace   Violentmonkey Scripts
// @match       *://www.xmkef.com/*.html
// @match       *://umei.net/tupian/*.html
// @match       *://www.meitule.com/photo/*.html
// @match       *://www.xgmn*.cc/*/*.html
// @match       *://meijuntu.com/*/*.html
// @match       *://www.xr*.vip/*/*.html
// @match       *://www.q4091o.com/*/*/*/
// @match       *://inewgirl.com/*/*
// @match       *://www.95mm.vip/*.html*
// @match       *://*.wuxiants*.com/index.php/*/*.html
// @match       *://www.·/view/*/*.html
// @match       *://www.19c84.com/view/*/*.html
// @match       *://www.6evu.com/*.html
// @match       *://www.3pxa.com/*.html
// @match       *://www.tuiimg.com/*/*
// @match       *://www.jpflt.com/*/*.html
// @match       *://www.mtmeinv.com/*/*.html
// @match       *://www.hentaiclub.net/r18/*.html
// @match       *://momotk10.uno/*.html
// @match       *://ga1-2.xofulitu7vv777.xyz/art/pic/id/*/
// @match       *://caomei.bond/*/showcontent/*
// @grant       none
// @license MIT
// @version     1.1
// @author      -
// @description 2023/12/29 20:52:24
// @downloadURL https://update.greasyfork.org/scripts/483344/%E5%A5%97%E5%9B%BE%E5%B2%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/483344/%E5%A5%97%E5%9B%BE%E5%B2%9B.meta.js
// ==/UserScript==

// 网页高度
let imgRow = 4;

function allImg(imgSelector) {
    let listOf = document.querySelectorAll(imgSelector);
    let map = [...listOf].map(img => img.getAttribute("data-src") || img.getAttribute("data-original") || img.getAttribute("src"));
    openTab(map)
}

/**
 * 特殊情况
 * @param pageSelector
 * @returns {Promise<void>}
 */
async function pageImgNum(pageSelector) {
    const imageUrls = [];
    let page = document.querySelector(pageSelector)?.outerText;
    if (!page) {
        setTimeout(() => {
            pageImgNum(pageSelector)
        }, 1000)
        return
    }
    for (let i = 1; i < Number(page); i++) {
        if (i === 1) {
            imageUrls.push(window.location.href)
        } else {
            imageUrls.push(window.location.href + "/" + i)
        }
    }
    let contents = await getContents(imageUrls);
    setTimeout(() => {
        let bodies = contents.map(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let element = /photoList:\[(.*)\],like/.exec(doc.getElementsByTagName('script')[0].textContent)[1];
            let parse = JSON.parse("[" + element.replaceAll("\\u002F", "/").replaceAll("photourl", "\"photourl\"") + "]");
            let map = parse.map(img => img['photourl']);
            return [...map]
        });
        openTab(bodies.flat())
    }, 1000)

}

async function pageImgNumTongyong(pageSelector, imgSelector) {
    const imageUrls = [];
    let page = document.querySelector(pageSelector)?.outerText;
    for (let i = 1; i < Number(page); i++) {
        if (i === 1) {
            imageUrls.push(window.location.href)
        } else {
            imageUrls.push(window.location.href + "/" + i)
        }
    }
    let contents = await getContents(imageUrls);
    setTimeout(() => {
        let bodies = contents.map(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let imgs = doc.querySelectorAll(imgSelector);
            let map = [...imgs].map(img => img.getAttribute("src"));
            return [...map]
        });
        openTab(bodies.flat())
    }, 1000)

}

async function zhankai(pageSelector, imgSelector) {
    const imageUrls = [];
    let page = document.querySelector("#allbtn").textContent.match(/\/\d+/)[0].replaceAll("/", "");
    let src = document.querySelector("#nowimg").src;

    const dynamicPart = src.substring(src.lastIndexOf("/") + 1);

    for (let i = 1; i <= Number(page); i++) {
        let replace = dynamicPart.replace(/\d+/, i);
        imageUrls.push(src.replaceAll(dynamicPart, replace))
    }
    openTab(imageUrls)

}

async function pageImgClick(pageSelector, imgSelector) {
    const imageUrls = [];
    let page = /\/(\d+)/.exec(document.querySelector(pageSelector).textContent)[1];

    for (let i = 1; i <= Number(page); i++) {
        if (i === 1) {
            imageUrls.push(window.location.href)
        } else {
            let url = window.location.href.replace(/(\d+)(\.html)$/, function (match, number, extension) {
                var newNumber = BigInt(number);
                return newNumber.toString() + "/" + i + extension;
            });
            imageUrls.push(url)
        }
    }

    let contents = await getContents(imageUrls);
    setTimeout(() => {
        let bodies = contents.map(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');

            let imgs = doc.querySelectorAll(imgSelector);
            let map = [...imgs].map(img => img.getAttribute("src"));
            return [...map]
        });
        openTab(bodies.flat())
    }, 1000)

}

async function getContents(urls) {
    let promises = urls.map(url => fetch(url).then(res => res.text()));
    return await Promise.all(promises);
}

async function pageImgHasHtml(pageSelector, imgSelector) {
    const imageUrls = [];
    // 获取当前页面地址
    let url = document.querySelector(pageSelector)?.href;
    if (!url) {
        pageImgHasHtml("body > div.page > div.pagelist a:nth-last-child(2)", imgSelector)
        return
    }
    let exec = /\d+_\d+\.html/.exec(url);
    let num, prefix, suffix
    if (exec) {
        num = url.match(/\d+_\d+\.html/)[0]
        prefix = num.split('_')[0];
        suffix = Number(num.split('_')[1].replace(".html", ""));
    } else {
        num = url.match(/\/(\w+)-(\d+)\.html/)[0]
        prefix = num.split('-')[0];
        suffix = Number(num.split('-')[1].replace(".html", ""));
    }

    for (let i = 1; i <= suffix; i++) {
        let items;
        if (exec) {
            if (i === 1) {
                items = url.replace(/\d+_\d+/, `${prefix}`);
            } else {
                items = url.replace(/\d+_\d+/, `${prefix}_${i}`);
            }
        } else {
            if (i === 1) {
                items = url.replace(/\/(\w+)\.html/, `${prefix}.html`);
            } else {
                items = url.replace(/\/(\w+)-(\d+)\.html/, `${prefix}-${i}.html`);
            }
        }
        imageUrls.push(items);
    }
    let contents = await getContents(imageUrls);
    setTimeout(() => {
        let bodies = contents.map(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');

            let imgs = doc.querySelectorAll(imgSelector);
            let map = [...imgs].map(img => img.getAttribute("src"));
            return [...map]
        });
        openTab(bodies.flat())
    }, 1000)
}

function getImgHeight() {
    return (window.innerHeight / imgRow) - (40);
}
function showBigImage(url){
    let xsImg = document.getElementById("xs");
    xsImg.innerHTML = ""
    let bigImg = document.createElement("img");
    bigImg.src = url;
    xsImg.append(bigImg)
}
function openTab(imageUrls) {
    if (imageUrls.length === 0) {
        alert("没有图片")
        return
    }
    var currIdx = 0;
    // 创建图片弹窗层
    var tanchuangDiv = `
        <div id="tc" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.5);z-index: 9999;">
            <div id="xs" style="width: 40%;height: 100%;background: rgba(0,0,0,0.5);overflow: scroll;float: left"></div>
            <div id="zz" style="width: 60%;height: 100%;background: rgba(0,0,0,0.5);overflow-y: auto"></div>
        </div>
    `
    document.body.insertAdjacentHTML("beforeend", tanchuangDiv);

    let zz = document.getElementById("zz");
    imageUrls.forEach((url,index) => {
        let img = document.createElement("img");
        img.src = url;
        img.style.margin = "20px"
        img.style.height = getImgHeight() + "px";
        // 添加鼠标经过事件
        img.addEventListener("mouseover", function (e) {
            showBigImage(url)
            currIdx = index
        })
        // // 添加鼠标离开事件
        // img.addEventListener("mouseout", function (e) {
        //     let xs = document.getElementById("xs");
        //     xs.innerHTML = ""
        // })
        zz.appendChild(img);
    })

    document.addEventListener('keydown', function (event) {
        event.stopPropagation();
        // 大图翻页
        if (event.key === "w") {
            currIdx = Number(currIdx) - 1;
        } else if (event.key === "s") {
            currIdx = Number(currIdx) + 1;
        }
        showBigImage(imageUrls[currIdx])
        if (!isNaN(Number(event.key))) {
            imgRow = Number(event.key)
            for (let i = 0; i < document.querySelectorAll("#zz img").length; i++) {
                document.querySelectorAll("#zz img")[i].style.height = getImgHeight() + "px";
            }
        }

    });
    // window.addEventListener('wheel', function (event) {
    //     if (!flag) {
    //         event.stopPropagation();
    //         var delta = event.deltaY;
    //         window.scrollBy(0, delta <= 0 ? -getImgHeight() : getImgHeight());
    //     }
    // });
}

function tujidao() {
    var num = /\[(\d+)\+\dP\]/.exec(document.querySelector("h1.article-title").innerText)[1] || 1
    var baseUrl = document.querySelector("body > section > div.content-wrap > div > article > p:nth-child(2) > img").src;
    var imageUrls = [];

    for (var i = 0; i < Number(num) + 1; i++) {
        var imageUrl = baseUrl.replace(/(\d+)(\.jpg)$/, function (match, number, extension) {
            var newNumber = BigInt(number) + BigInt(i);
            return newNumber.toString() + extension;
        });
        imageUrls.push(imageUrl);
    }
    openTab(imageUrls)
}

const WEB_SITE = (() => {
    const websites = {
        'umei.net': () => {// https://umei.net/
            pageImgHasHtml("div.image_div > div > ul > li:nth-child(8) > a", "div.image_div > p > a > img")
                .catch(err => console.error(err));
        },
        'xmkef.com': () => {// https://www.xmkef.com/
            var num = /\[(\d+)\+\dP\]/.exec(document.querySelector("h1.article-title").innerText)[1] || 1
            var baseUrl = document.querySelector("body > section > div.content-wrap > div > article > p:nth-child(2) > img").src;
            var imageUrls = [];

            for (var i = 0; i < Number(num) + 1; i++) {
                var imageUrl = baseUrl.replace(/(\d+)(\.jpg)$/, function (match, number, extension) {
                    var newNumber = BigInt(number) + BigInt(i);
                    return newNumber.toString() + extension;
                });
                imageUrls.push(imageUrl);
            }
            openTab(imageUrls)
        },
        'meitule.com': () => {// https://www.meitule.com/
            pageImgHasHtml("body > ul > li:nth-child(8) > a", "div.content > a > img")
                .catch(err => console.error(err));
        },
        'xgmn01.cc': () => {// https://www.xgmn01.cc/
            pageImgHasHtml("body > section > div > div > article > div:nth-child(1) > ul > a:nth-last-child(2)", "section > div > div > article > p > img")
                .catch(err => console.error(err));
        },
        'meijuntu.com': () => {// https://meijuntu.com
            pageImgHasHtml("#pages > a:nth-last-child(2)", "div.pictures > img")
                .catch(err => console.error(err));
        },
        'xr09.vip': () => {// https://www.xr09.vip
            pageImgHasHtml("body > div.main > div > div > div:nth-child(7) > div > div > a:nth-last-child(2)", "body > div.main > div > div > div:nth-child(6) > p > img")
                .catch(err => console.error(err));
        },
        'q4091o.com': () => {// https://www.q4091o.com/
            allImg("#tpl-img-content img")
        },
        'inewgirl.com': () => {// https://inewgirl.com/
            pageImgNum("#main-container > div.v-sheet.theme--light > div > div.v-sheet.theme--light.main-article > div > div:nth-child(1) > div:nth-child(5) > div > div > div:nth-child(4) > div > div > div > div > nav > ul > li:nth-last-child(2) > button")
        },
        '95mm.vip': () => { //https://www.95mm.vip
            pageImgClick("body > main > div > div.row.no-gutters > div > h1", "body > main > div > div.row.no-gutters > div > div.post-content > div.post > div > p > a > img")
                .catch(err => console.error(err));
        },
        'wuxiants': () => {// https://wuxiants.com
            allImg("#wznr > div > div > p > img")
        },
        '96c74.com': () => {// https://www.96c74.com
            allImg("body > div:nth-child(6) > div > div.pic > img")
        },
        '19c84.com': () => {// https://www.19c84.com/
            allImg("body > div:nth-child(6) > div > div.pic > img")
        },
        '6evu.com': () => { // https://www.6evu.com/
            pageImgNumTongyong("#content > div:nth-child(1) > div.context > div.pagelist > a:nth-last-child(1)", "#post_content img")
        },
        '3pxa.com': () => { // https://www.3pxa.com/
            pageImgNumTongyong("body > section > div > div > div.article-paging > a:nth-last-child(1) > span", "body > section > div > div > article > p:nth-child(6) > a > img")
        },
        'tuiimg.com': () => {// https://tuiimg.com/meinv/
            zhankai("#content > div:nth-child(1) > div.context > div.pagelist > a:nth-last-child(1)", "#post_content img")
        },
        'jpflt.com': () => {// http://www.jpflt.com
            pageImgHasHtml("#imgc > div > div.pagelist > a:nth-last-child(2)", "#picg img")
        },
        'mtmeinv.com': () => {// http://www.jpflt.com
            pageImgHasHtml("#imgc > div > div.pagelist > a:nth-last-child(2)", "#picg img")
        },
        'hentaiclub': () => {// https://www.hentaiclub.net/
            allImg("#masonry img")
        },
        'momotk': () => {// https://momotk10.uno
            const imgs = []
            const num = document.querySelector("div.tab-contents").textContent.match(/(\d+) 张图/)[1]
            const imgBaseUrl = document.querySelector("#ngg-image-0 > div > a > img").src
            for (let i = 0; i < Number(num); i++) {
                const imageUrl = imgBaseUrl.replace(/(\d+)(\.jpg)$/, function (match, number, extension) {
                    const newNumber = BigInt(number) + BigInt(i);
                    return newNumber.toString().padStart(4, '0') + extension;
                });
                imgs.push(imageUrl)
            }
            openTab(imgs)
        },
        'xofulitu': () => {// https://ga1-2.xofulitu7vv777.xyz/
            allImg("div.picture-item img")
        },
        'caomei': () => {// https://caomei.bond/
            allImg("#adarea img")
        },
    };

    return {
        getSite: function (site) {
            Object.entries(websites).forEach(([host, handler]) => {
                if (site.includes(host)) {
                    handler();
                }
            });
        },
    };
})();

setTimeout(function () {
    WEB_SITE.getSite(window.location.host)
}, 1000)
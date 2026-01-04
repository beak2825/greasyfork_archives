// ==UserScript==
// @name        看图能手 图集多页\分页 合并展示
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @license     MIT
// @version     2.0
// @author      youngyy
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @description 分页图片合并展示，支持打包下载
// @downloadURL https://update.greasyfork.org/scripts/488771/%E7%9C%8B%E5%9B%BE%E8%83%BD%E6%89%8B%20%E5%9B%BE%E9%9B%86%E5%A4%9A%E9%A1%B5%5C%E5%88%86%E9%A1%B5%20%E5%90%88%E5%B9%B6%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/488771/%E7%9C%8B%E5%9B%BE%E8%83%BD%E6%89%8B%20%E5%9B%BE%E9%9B%86%E5%A4%9A%E9%A1%B5%5C%E5%88%86%E9%A1%B5%20%E5%90%88%E5%B9%B6%E5%B1%95%E7%A4%BA.meta.js
// ==/UserScript==

// 网页高度
let imgRow = 2;
let pageNum = 1, imgPage = [], imgList = [];
let currHref = window.location.href;

function initObj(label, speeds, type, home, hostRe, imgHandler) {
    return {
        label: label,
        home: home,
        hostRe: hostRe,
        speeds: speeds,
        type: type,
        imgHandler: imgHandler
    }
}

function initAllImg(label, home, hostRe, speeds, type, imgSelector, logo) {
    return {
        label: label,
        logo: logo,
        home: home,
        hostRe: hostRe,
        speeds: speeds,
        type: type,
        imgHandler: () => {
            allImg(imgSelector)
        }
    }
}

function allImg(imgSelector) {
    let listOf = document.querySelectorAll(imgSelector);
    let map = [...listOf].map(img => img.getAttribute("data-src") || img.getAttribute("data-original") || img.getAttribute("src"));
    openTab(map)
}

async function getContents(urls) {
    let promises = urls.map(url => fetch(url).then(res => res.text()));
    return await Promise.all(promises);
}

function getImgHeight() {
    return (window.innerHeight / imgRow);
}

function showBigImage(url) {
    let xsImg = document.getElementById("xs");
    xsImg.innerHTML = ""
    xsImg.style.display = "flex"
    let bigImg = document.createElement("img");
    bigImg.src = url;
    xsImg.append(bigImg)
}

function createDialog(len) {
    var tanchuangDiv = `
        <div id="tc" style="position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.9);z-index: 9998">
            <div style="position: fixed;display: flex;justify-content: flex-end;bottom: 2%;color: #23af49;font-size: xx-large;margin: 0 auto">
                <p style="background-color: rgba(0,0,0,0.5);margin-top: auto;">${len}/${pageNum}&nbsp;<strong>${document.title}</strong></p>
            </div>
            <div id="xs" style="justify-content:center;align-items: flex-start;display: none;position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0,0,0,0.5);z-index: 9999;text-align: center;overflow:scroll" onclick="this.style.display='none';"></div>
            <div id="zz" style="width: 100%;height: 100%;background: rgba(0,0,0,0.5);overflow-y: auto;display: flex;flex-wrap: wrap;align-content: flex-start;"></div>
        </div>
    `
    document.body.insertAdjacentHTML("beforeend", tanchuangDiv);

    let zz = document.getElementById("zz");
    zz.addEventListener("click", function (e) {
        if (e.target.tagName === "DIV") {
            document.getElementById("tc").style.display = "none";
        }
    })
    zz.addEventListener('wheel', function (event) {
        // debugger
        event.preventDefault();
        event.stopPropagation();
        let y = event.deltaY <= 0 ? -getImgHeight() : getImgHeight();
        zz.scrollTo(0, zz.scrollTop + y);
    });
    document.addEventListener('keydown', function (event) {
        event.stopPropagation();
        if (event.key === "w") {
            zz.scrollTo(0, zz.scrollTop - getImgHeight());
        } else if (event.key === "s") {
            zz.scrollTo(0, zz.scrollTop + getImgHeight());
        }
        if (!isNaN(Number(event.key))) {
            imgRow = Number(event.key)
            for (let i = 0; i < document.querySelectorAll("#zz img").length; i++) {
                document.querySelectorAll("#zz img")[i].style.height = getImgHeight() + "px";
            }
        }
    });
}

function openTab(imageUrls) {
    if (imageUrls.length === 0) {
        return
    }
    imgList = imageUrls;
    var btn = `
    <div style="z-index: 9999;position: fixed;right: 1.5rem;bottom: 10px;">
        <button id="showPicBtn" style="background: #000;color: #fff;border: 1px solid #fff;border-radius: 5px;padding: 5px 10px;cursor: pointer;">显示</button>
        <br>
        <button id="downPicBtn" style="background: #000;color: #fff;border: 1px solid #fff;border-radius: 5px;padding: 5px 10px;cursor: pointer;">下载</button>
    </div>
`
    document.body.insertAdjacentHTML("beforeend", btn)

    var currIdx = 0;
    // 创建图片弹窗层
    createDialog(imageUrls.length)

    let zz = document.getElementById("zz");
    imageUrls.forEach((url, index) => {
        let img = document.createElement("img");
        img.src = url;
        img.title = `第${index + 1} / ${imageUrls.length}张`;
        img.style.height = getImgHeight() + "px";
        img.style.objectFit = 'contain';
        // 添加鼠标经过事件
        img.addEventListener("click", () => {
            showBigImage(url)
            currIdx = index
        })
        zz.appendChild(img);
    })

    let showPicBtn = document.getElementById("showPicBtn");
    showPicBtn.addEventListener("click", () => {
        document.getElementById("tc").style.display = "block";
    })
    let downPicBtn = document.getElementById("downPicBtn");
    downPicBtn.addEventListener("click", () => {
        const images = getQueryAll('#zz img');
        const urls = [];
        images.forEach(img => {
            urls.push(img.src);
        });
        const zip = new JSZip();
        urls.forEach((url, index) => {
            const fileName = `${document.title}_${index}${url.substring(url.lastIndexOf('.'))}`;
            zip.file(fileName, fetch(url).then(response => response.blob()), {binary: true});
        });
        zip.generateAsync({type: "blob"}).then(content => {
            // 创建一个链接来下载ZIP文件
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = `${document.title}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    })

}

async function openImgPage(imgPageUrls, imgSelector) {
    let contents = await getContents(imgPageUrls);
    let bodies = contents.map(html => {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        let imgs = doc.querySelectorAll(imgSelector);
        let map = [...imgs].map(img => img.getAttribute("data-src") || img.getAttribute("data-original") || img.getAttribute("lazysrc") || img.getAttribute("src"));
        return [...map]
    });
    openTab(bodies.flat())
}

var siteJsonNoPage = [
    initAllImg("SEX5性屋娱乐", ["https://www.c2526q.com/"], [/https:\/\/www.c2526q.com\/art\/.*\/\d+/], 1300, "色站", "#tpl-img-content img", "data:image/png;base64,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"),
    initAllImg("4hu", ["https://www.c86a8.com/", "https://www.x7hkv.com/",], [/https:\/\/www.c86a8.com\/view\/.*\/.*.html/, /https:\/\/www.x7hkv.com\/view\/.*\/.*.html/,], 600, "色站", "div.pic img", undefined),
    initAllImg("湿女吧", ["https://shinv.link/"], [/https:\/\/shinv.link\/posts\/.*/], 1000, "露点", "div.p-1.col-span-12 > div > img", undefined),
    {
        label: "4色",
        home: ["https://www.f6f9y.com/",],
        hostRe: [/https:\/\/www.f6f9y.com\/.*.html/,],
        speeds: 1000,
        type: "色站",
        imgHandler: () => {
            // 页面滚动到最底部
            for (let i = 0; i < 100; i++) {
                document.documentElement.scrollTop += document.documentElement.scrollHeight;
                document.body.scrollTop += document.body.scrollHeight;
            }
            allImg("div.tupian-detail-content img")
        }
    },
    {
        label: "吾色",
        home: [
            "https://i4q4j.com/"
        ],
        hostRe: [
            /https?:\/\/i4q4j.com\/pc\/image\/.*/
        ],
        speeds: 1000,
        type: "色站", imgHandler: () => {
            setTimeout(() => {
                allImg("ul.slick-dots.slick-thumb img")
            }, 3000)
        }
    },
    {
        label: "主播视频",
        home: [
            "https://www.65j8.com/"
        ],
        hostRe: [
            /https:\/\/www.65j8.com\/web\/.*/
        ],
        speeds: 1000,
        type: "色站", imgHandler: () => {
            setTimeout(() => {
                allImg("#imglist img")
            }, 2000)
        }
    },
    {
        label: "91分享",
        home: [
            "https://91share.net/"
        ],
        hostRe: [
            /https:\/\/91share.net\/.*\/\d+/
        ],
        speeds: 3000,
        type: "img",
        waterMark: "部分有",

        imgHandler: () => {
            allImg(".wp-block-image img")
        }
    },
    {
        label: "草莓图库",
        home: [
            "https://caomei.bond/"
        ],
        hostRe: [
            /https:\/\/caomei.bond\/.*\/showcontent\/.*/,
        ],
        speeds: 1500,
        type: "露点",
        waterMark: "部分有",

        imgHandler: () => {
            allImg("#adarea img")
        }
    },
    {
        label: "好视觉",
        home: [
            "https://www.lianjiajr.net/"
        ],
        hostRe: [
            /https:\/\/www.lianjiajr.net\/.*.html/,
        ],
        logo: "https://sucai.zxmx.net/lianjiajr/default/images/logo.png",
        speeds: 4800,
        type: "露点", imgHandler: () => {
            allImg(".text img")
        }
    },
    {
        label: "91图录",
        home: [
            "https://www.91tulu.com/"
        ],
        hostRe: [
            /https?:\/\/www.91tulu.com\/.*.html/,
        ],
        speeds: 1000,
        type: "露点", imgHandler: () => {
            allImg(".theme-box.wp-posts-content img")
        }
    },
    {
        label: "色情圖片網",
        home: [
            "https://www.photos18.com/"
        ],
        hostRe: [
            /https?:\/\/www.photos18.com\/v\/.*/,
        ],
        speeds: 3000,
        type: "露点", imgHandler: () => {
            allImg("#content img")
        }
    },
    {
        label: "魅影画廊",
        home: [
            "https://www.jb9.es/guanyu",
            "https://myhl9.uno/"
        ],
        hostRe: [
            /https?:\/\/www.jb9.es\/.*.html/,
            /https?:\/\/myhl9.uno\/.*.html/,
        ],
        speeds: 2600,
        type: "img", imgHandler: () => {
            allImg("#gallery-2 img")
        }
    },
    {
        label: "我自拍",
        home: [
            "https://5zipai.com/"
        ],
        hostRe: [
            /https?:\/\/5zipai.com\/selfies\/.*\/.*.html/,
        ],
        speeds: 1100,
        type: "露点", imgHandler: () => {
            setTimeout(() => {
                // debugger
                allImg("#showCon img")
            }, 5000)
        }
    },
    {
        label: "图片屋",
        home: [
            "https://www.tupianwu.com/"
        ],
        hostRe: [
            /https?:\/\/www.tupianwu.com\/post\/.*/,
        ],
        speeds: 2600,
        type: "img", imgHandler: () => {
            allImg(".umBody.umHight img")
        }
    },
    {
        label: "图库库",
        home: [
            "https://tukuku.cc/"
        ],
        hostRe: [
            /https?:\/\/tukuku.cc\/.*/,
        ],
        speeds: 2600,
        type: "img", imgHandler: () => {
            allImg(".entry-content.gridbit-clearfix img")
        }
    },
    {
        label: "美图收集网",
        home: [
            "https://sifang.app/"
        ],
        hostRe: [
            /https?:\/\/sifang.app\/node\/.*/,
        ],
        speeds: 2600,
        type: "img", imgHandler: () => {
            allImg(".field__item img")
        }
    },
    {
        label: "中国街拍",
        home: [
            "https://www.cnjiepai.xyz/"
        ],
        hostRe: [
            /https?:\/\/www.cnjiepai.xyz\/.*\/.*.html/,
        ],
        speeds: 2600,
        type: "img", imgHandler: () => {
            allImg(".forum_content.clearfix article p a img")
        }
    },
    {
        label: "sexav",
        home: [
            "https://kb12.sexav5bb214.xyz/"
        ],
        hostRe: [
            /https?:\/\/kb12.sexav5bb214.xyz\/artdetail-.*/,
        ],
        speeds: 2600,
        type: "色站", imgHandler: () => {
            allImg(".info .content p img")
        }
    },
    {
        label: "xo福利图",
        home: [
            "https://kb12.xofulitu5bb214.xyz/",
        ],
        hostRe: [
            /https?:\/\/.*.xofulitu.*.xyz\/art\/pic\/id\/.*/,
        ],
        logo: "https://kb12.xofulitu5bb214.xyz/upload/site/20230424-1/df71d5a55b9888cf6b0f445ab8a8fe80.png",
        speeds: 2600,
        type: "露点", imgHandler: () => {
            allImg(".picture-item a img")
        }
    },
    {
        label: "微密猫",
        home: [
            "https://weme.su/"
        ],
        hostRe: [
            /https?:\/\/weme.su\/archives\/.*/,
        ],
        speeds: 3100,
        type: "露点", imgHandler: () => {
            allImg(".wp-block-image img")
        }
    },
    {
        label: "复刻书林",
        home: [
            "https://reprint-kh.com/"
        ],
        logo: "https://reprint-kh.com/wp-content/uploads/2021/01/logo3.png",
        hostRe: [
            /https?:\/\/reprint-kh.com\/archives\/\d+/,
        ],
        speeds: 2100,
        type: "露点", imgHandler: () => {
            allImg(".tiled-gallery.type-rectangular img")
        }
    },
    {
        label: "美女写真",
        home: [
            "https://girlygirlpic.com/",
            "https://girlgirlgo.org/"
        ],
        logo: "https://res.girlygirlpic.com/girlygirlpic/images/logo-light.png?v=20240304030927",
        hostRe: [
            /https?:\/\/girlygirlpic.com\/a\/.*/,
            /https?:\/\/girlgirlgo.org\/a\/.*/,
        ],
        speeds: 6100,
        type: "露点",
        imgHandler: () => {
            setTimeout(() => {
                allImg(".figure-link-w picture img")
            }, 2000)
        }
    },
    {
        label: "An Girlz -- 待完善",
        home: [
            "https://cn.angirlz.com/album/zam0olwq3d",
        ],
        logo: "https://cn.angirlz.com/css/images/logo_320x320.png",
        hostRe: [
            /https?:\/\/cn.angirlz.com\/album\/.*/,
        ],
        speeds: 6100,
        type: "露点",
        imgHandler: () => {
            setTimeout(() => {
                allImg("#img_3_47")
            }, 8000)
        }
    },
    {
        label: "legskr",
        home: [
            "https://legskr.com/",
        ],
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAAzCAIAAACL5sgzAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAAMZSURBVGiB7ZpPSJNhHMc/hlM2Rg7eF9zEgY7hi22Q4B9wUMYEoTAIhEV5sIMsOtShjp27dOiQJ8GLEEFCRDQQOoz0oKAeDGewQSJMnMIGm47J3KQOKu/8g7S5vS6e93Pafs/z/Ph+39/ze95nsJpx/x/E49pVC7gadNsiodsWCd22SOi2RUK3LRK6bZHQbYuEblskdNsiUXv5FG3PuNNBco6pycsn04gyVLvu1KMbwT+Ob+TyiStIGaodGiN0+SzaImhvC2q7DJucEfweNj8RCP7T9PZROl2YTADZFNEAwVl11NzFrfvYrNQCObbn2FVwWgk/ZeZwwm0GBrE0HEnPhPgwVrTkctguBvdLPArZOOur5A00unAOU59jeh4AF/eeYDGQDBPfofY6tj6kXMH6Xh4MY8oQXSQLJjtNcikytLXtpVMhG+bzO9KHERePXmDvh3mAPh8Ww4mNY/Yy9FBV2d6LCTa/MX08QWouRYimvd3TTT3EAseegVW24yDhBiQarRDlR0GzpINE4+rX5A6A1IF0HElslKJE02obTQAtr/CfGZKAmxhhN1HwUAA4yKufY1+ItmJXGBonGeZXgFCkFCVa9zY5NpfJnAnHCiZcRILp19i89PTTqOBRuFHS7VBT2/s5MLA/S/DcEuUBjNLpcP0ZjbEgX4OYuxgYRvbQF2AmUZwSTXt7ZQ3ANoj53OFZkjlqHXhdakzy0VxwVpub1bXpJSJRAFNr0UoqVe06K97RE5GNCSIfCSsoCr63xCJkASOyHVaPNurCInc9OJ9hCZPco96KzUo6haXhKEmLD4+dzQiZHBixKxBnZaloeZWybXLgdJyIHEwQgZn37D+mTcHeDUCOzJaqOzbJ9z08vchuZMimWJ/ioF+1ndggY6ep42jt7hoLE5RwltdU/584vG9wyuotrSxU/Z1cwiJDqpSSXkC123aPIEMmyu+yptX8vX0h7ud0WklusbsHBuRWLA3kUywX/2PjYqrLdmKbfQeSm0YA8hniy/ycKnOp+S+OtEpQ7b1dIXTbIqHbFgndtkjotkVCUNt/AZ9P1/3hgVM0AAAAAElFTkSuQmCC",
        hostRe: [
            /https?:\/\/legskr.com\/album\/detail\/.*.html/,
        ],
        speeds: 6100,
        type: "露点",
        imgHandler: () => {
            allImg(".card img")
        }
    },
    {
        label: "Imgasd",
        home: [
            "https://imgasd.com/",
        ],
        logo: "https://imgasd.com/img/favicon.png",
        hostRe: [
            /https?:\/\/imgasd.com\/article\/.*/,
        ],
        speeds: 2200,
        type: "露点",
        imgHandler: () => {
            allImg(".imgs img")
        }
    },
    {
        label: "ilovexs",
        home: [
            "https://ilovexs.com/",
        ],
        logo: "https://ilovexs.com/images/logo.png",
        hostRe: [
            /https?:\/\/ilovexs.com\/post_id\/.*/,
        ],
        speeds: 2600,
        type: "露点",
        imgHandler: () => {
            allImg(".separator a img")
        }
    },
    {
        label: "新美图录",
        home: [
            "https://www.xinmeitulu.com/",
        ],
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAAAoCAIAAAB/+jPjAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAAS2SURBVGiB7ZmvlqtGHMd/t6cPgLt1KMAFlfAEGdRdlfAGwQQcUa1s1eKYGHgDNmqvYvIEJGrWASqudSN7qyoCAcKQQJbuntPD50QkwPwYvvP7x+TL3z/+gZGB+OmzJ/C/YlRzSEY1h2RUc0hGNYdkVHNIRjWHZFRzSEY1h2RUc0geVJP6kuLTR29KA3lNGPcUI5YUPGz4s/n5sWGiiMD2ibFFQus1LFprNgHYhKmp1k6IokPsmeS8ZKvaCaD+1CabEF+bor5kuD2n6OyS+m0/gAfVFHTTgcVrzJB+kZMRa2qT8pq5d0zSLQBjDKAquiAg8+i9Te2lBKWg+XDnpUUDhGNc3gyoryzhep2qM6keoL6yfO70YO9bg15q0kBe1FzEnir5t02YGgCNZwYAEASO/woI7xzrz2U589OJwNw7rjo9Cw2Wz+Bg8Wqd2lDNJDXvXdRYg/70UlNdpUfR+hV+rwQ49ZVAjLEuACO3xl577hlXrv8ul+cM8g7NZMKItXABwLW0Rvg3s8dH0jvSv07AmPlFiNFg+Qxoc2LAc8AqAsJZwjvBorVmqy0xy4H6U5s0Q/IcN5sZ30ojqtqYdJtEC33VFFTzD+9tGkQG1oFYC5cT2v8dZwffhKl2kBeWeCzunEvZviTqKs1WXYy/b3491KwVVnIJSUuTAQDm3u6pl4UaxJCbVaIR5jS0SS6ZesDWbKogHK9O2vKZ0zl8Bl+G+yeDnxkBuKWpMqxDpFNfMt4aRi6V+to+I9bUnuwSUy26tP48VNwf7JCARdbMUpspv3iwvtmwD2USdF6ylcqINS3i43gluKBvk7TFCneF3sejarYx+YU/uTsdHzfSAeoCHXzJdgFgE6bVgnapb4xYU8Xm5BwWrbWTyfE18npgejWZsGitfX96WOI+ajYU2S+lIg0W/WYbnTq+O8zMLMltlFmlIndF1u/1kZrpfV8ocjO3EjukF5XPad3xzA4tCp8+alYV4UT67X6zFRatNRt4feUNyn6L+pIiQ0tnWlwtqAhnoS8ZMr2+zF0EWrZS8+zxzna1Z6SzyJq9Ph22qPhNymb+dCIw/ya2jLzT8dkziXu88XgXryyKe+mwd1DNLBbXWsUZAeHw26uRR9it9ehIPzVpaO0B1bMSsX+LYqwLNHYBeVrbdPgdH/Ulw0VzRPaTjjW08ErqK3JlAbqVYEHfJkX98SYAAKK+DR3JcAeQEvrtyLEocMF5qd5VQHjnEOuFAo2fAT3N+kyIRWvDBedli/HOcRdWxN+k46OaSZoVn6P3tlBk6Y4F6iuypMhSIB4TrH8tLWWxB/bsPXuMOT18k8Wve2eHrz1AXXpIi33HhXm7ZzaNFTtG50BWV+mRWFPFfqwJb31tBchT/B4AEI7TjDtDQd8mKQ3kheJy2qzu9FDzHCY5p9MeQC2Oh75kIBx3mkSRQJ1dUlsZAeEsYZElS3vgRS7JX7q6MgEoS1yGG1snf71dHTnnorzN+pjuvVJMEM7301gUuMg73NSy7K6uusU6go7TDABYtFZkAlB5qh4bAuUb91X3Xn814s75ppvfY8A3y5HxX7ZBGdUcklHNIRnVHJJRzSEZ1RySUc0hGdUcklHNIfkXwhx9EjgPGOQAAAAASUVORK5CYII=",
        hostRe: [
            /https?:\/\/www.xinmeitulu.com\/photo\/.*/,
        ],
        speeds: 2600,
        type: "img",
        imgHandler: () => {
            allImg(".figure img")
        }
    },
    {
        label: "六色美图",
        home: [
            "https://www.06se.com/",
        ],
        logo: "https://developer-forum-online.cdn.bcebos.com/85270ff3-948c-485f-b467-6e20d09e0ed4.png",
        hostRe: [
            /https?:\/\/www.06se.com\/.*.html/,
        ],
        speeds: 2600,
        type: "img",
        imgHandler: () => {
            allImg(".article-content div img")
        }
    },
    {
        label: "kvs demo",
        home: [
            "https://dev.avjb.com/",
        ],
        logo: "https://dev.avjb.com/static/images/logo-light.svg",
        hostRe: [
            /https?:\/\/dev.avjb.com\/albums\/.*\/.*/,
        ],
        speeds: 4600,
        type: "露点",
        imgHandler: () => {
            var a = getQueryAll(".album-inner.images a")
            for (let i = 0; i < a.length; i++) {
                imgList.push(a[i].href)
            }
            openTab(imgList)
        }
    },
]
/**
 * @param {string} label 网页名称
 * @param {string} logo 网页图标
 * @param {string} home  地址
 * @param {string} hostRe  地址
 * @param {number} speeds 速度 kb/s
 * @param {string} type 正规图片、露点图片、色站
 * @param {string} imgHandler  图片处理器
 */
var siteJson = [
    {
        label: "美图乐",
        logo: "https://www.meitule.com/static/images/mlogo.png",
        home: [
            "https://www.meitule.com/",
            "https://www.meitule.net/",
            "https://www.meitulu.cc/"
        ],
        hostRe: [
            /https:\/\/www.meitule.com\/photo\/.*.html/,
            /https:\/\/www.meitule.net\/photo\/.*.html/,
            /https:\/\/www.meitulu.cc\/photo\/.*.html/,
        ],
        speeds: 4000,
        type: "img",
        imgHandler: () => {
            let href = getQuery(".page li:last-child a").href;
            pageNum = parseInt(href.match(/_(\d+)\.html/)[1]);
            for (let i = 0; i < pageNum; i++) {
                // url组装
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    let s1 = currHref.replace(/(\d+)\.html/, `$1_${i + 1}.html`);
                    imgPage.push(s1);
                }
            }
            openImgPage(imgPage, ".content a img")
        },
    },
    {
        label: "极品性感美女",
        home: [
            "https://www.xgmn01.cc/"
        ],
        hostRe: [
            /https:\/\/www.xgmn01.cc\/.*\/.*\.html/
        ],
        logo: "https://www.12356781.xyz/img/logo.gif",
        speeds: 3000,
        type: "img",
        imgHandler: () => {
            let pageStr = getQuery("div.pagination > ul > a:nth-last-child(2)").text;
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                // url组装
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    let s1 = currHref.replace(/(\d+)\.html/, `$1_${i}.html`);
                    imgPage.push(s1);
                }
            }
            openImgPage(imgPage, ".article-content > p > img")
        },
    },
    {
        label: "俊美图",
        home: [
            "https://meijuntu.com/"
        ],
        hostRe: [
            /https:\/\/meijuntu.com\/.*\/.*\.html/
        ],
        logo: "https://meijuntu.com/statics/images/logo.png",
        speeds: 1000,
        type: "img",
        imgHandler: () => {
            let pageStr = getQuery("div#pages a:nth-last-child(2)").text;
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                // url组装
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    let s1 = currHref.replace(/\.html/, `-${i + 1}.html`);
                    imgPage.push(s1);
                }
            }
            openImgPage(imgPage, ".pictures img")
        },
    },
    {
        label: "秀人集",
        home: [
            "https://www.xr08.vip/",
            "https://www.xr05.vip/",
        ],
        hostRe: [
            /https:\/\/www.xr0*.vip\/.*\/.*\.html/
        ],
        logo: "https://www.xr05.vip/template/images/logo.png",
        speeds: 6300,
        type: "img",
        imgHandler: () => {
            let pageStr = getQuery("div.page a:nth-last-child(2)").text;
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                // url组装
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    let s1 = currHref.replace(/\.html/, `_${i}.html`);
                    imgPage.push(s1);
                }
            }
            openImgPage(imgPage, ".content img")
        },
    },

    {
        label: "女神社",
        home: [
            "https://inewgirl.com/"
        ],
        speeds: 300,
        type: "露点",
        hostRe: [
            /https:\/\/inewgirl.com\/.*\/.*/
        ],
        logo: "https://inewgirl.com/_nuxt/img/logo.e9c01f9.png",
        imgHandler: async () => {
            let pageStr = getQuery("div.container ul li:nth-last-child(2) button").textContent;
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                imgPage.push(currHref + `/${i + 1}`)
            }
            let contents = await getContents(imgPage);
            setTimeout(() => {
                let bodies = contents.map(html => {
                    let match = html.match(/photoList:\[(.*)\],like/)[1];
                    let parse = JSON.parse("[" + match.replaceAll("\\u002F", "/").replaceAll("photourl", "\"photourl\"") + "]");
                    let map = parse.map(img => img['photourl']);
                    return [...map]
                });
                openTab(bodies.flat())
            }, 1000)
        },
    },
    {
        label: "MM范",
        home: [
            "https://www.95mm.vip/"
        ],
        speeds: 3000,
        type: "img",
        hostRe: [
            /https:\/\/www.95mm.vip\/.*.html/
        ],
        logo: "https://cdn.zzdaye.com:8443/web/logo.png",
        imgHandler: async () => {
            debugger
            let pageStr = /\/(\d+)/.exec(getQuery("div.row.no-gutters > div > h1").textContent)[1];
            pageNum = parseInt(pageStr)
            for (let i = 1; i <= pageNum; i++) {
                if (i === 1) {
                    imgPage.push(window.location.href)
                } else {
                    let url = window.location.href.replace(/(\d+)(\.html)$/, function (match, number, extension) {
                        const newNumber = BigInt(number);
                        return newNumber.toString() + "/" + i + extension;
                    });
                    imgPage.push(url)
                }
            }
            openImgPage(imgPage, "div.post-content > div.post > div > p > a > img").catch(err => console.error(err))
        },
    },
    {
        label: "豆花视频",
        home: [
            "https://www.ne66b.com/"
        ],
        hostRe: [
            /https?:\/\/www.ne66b.com\/pc\/#\/photos\/info/
        ],
        logo: "https://micac.scoylz.top/static/dist/img/logo.png",
        speeds: 3000,
        type: "色站", imgHandler: () => {
            setTimeout(() => {
                let queryAll = getQueryAll(".swiper-slide-item");
                for (let i = 0; i < queryAll.length; i++) {
                    // 获取元素
                    var computedStyle = window.getComputedStyle(queryAll[i]);
                    var backgroundImage = computedStyle.getPropertyValue('background-image');
                    var url = backgroundImage.match("(https:\/\/.*?)\"")[1];
                    imgList.push(url)
                }
                openTab(imgList)
            }, 2000)
        }
    },
    {
        label: "遛无写真",
        home: [
            "https://www.6evu.com/"
        ],
        hostRe: [
            /https:\/\/www.6evu.com\/.*.html/,
            /https:\/\/www.09kt.com\/.*.html/,
            /https:\/\/www.1plq.com\/.*.html/,
        ],
        logo: "https://www.6evu.com/wp-content/themes/Loostrive/images/logo.png",
        speeds: 3000,
        type: "img",
        waterMark: "有",
        imgHandler: () => {
            let page = document.querySelector("#content > div:nth-child(1) > div.context > div.pagelist > a:nth-last-child(1)")?.outerText;
            for (let i = 1; i < Number(page); i++) {
                if (i === 1) {
                    imgPage.push(window.location.href)
                } else {
                    imgPage.push(window.location.href + "/" + i)
                }
            }
            openImgPage(imgPage, "#post_content img")
        }
    },
    {
        label: "秀色女神",
        home: [
            "https://www.xsnvshen.co/"
        ],
        hostRe: [
            /https:\/\/www.xsnvshen.co\/album\/.*/,
        ],
        logo: "https://res.xsnvshen.co/images/logo_girl.png",
        speeds: 2200,
        type: "img", imgHandler: () => {
            let pageStr = getQuery("#time").textContent.match(/共 (\d+) 张/)[1];
            pageNum = parseInt(pageStr);
            let src = getQuery("#bigImg").src;
            for (let i = 0; i < pageNum; i++) {
                let replace = src.replace(/(\d+).jpg/, (match, p1) => {
                    return ((Number(p1) + i) + "").padStart(3, '0') + ".jpg"
                });
                imgList.push(replace)
            }
            openTab(imgList)
        }
    },
    {
        label: "微图坊",
        home: [
            "https://www.v2ph.ru/"
        ],
        hostRe: [
            /https:\/\/www.v2ph.ru\/album\/.*.html/,
        ],
        speeds: 300,
        logo: "https://www.v2ph.ru/img/logo-ja.svg",
        type: "img", imgHandler: () => {
            let href = getQuery(".pagination li:last-child a").href;
            let pageStr = href.match(/\?page=(\d+)/)[1];
            pageNum = parseInt(pageStr);
            // TODO 登录
            for (let i = 0; i < pageNum; i++) {
                let replace = href.replace(/(\?page=)\d+/, (a, b) => {
                    return b + (i + 1);
                });
                imgPage.push(replace)
            }
            openImgPage(imgPage, ".photos-list.text-center img")
        }
    },
    {
        label: "美图131",
        home: [
            "https://www.meitu131.com/"
        ],
        hostRe: [
            /https:\/\/www.meitu131.com\/meinv\/.*/,
        ],
        logo: "https://www.meitu131.com/statics/images/logo.png",
        speeds: 3000,
        type: "img", imgHandler: () => {
            let pageStr = getQuery("#pages a:last-child").href.match(/_(\d+).html/)[1];
            debugger
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref + "index.html")
                } else {
                    imgPage.push(currHref + `index_${i + 1}.html`)
                }
            }
            openImgPage(imgPage, ".uk-article-bd.uk-margin-remove p a img")
        }
    },
    {
        label: "高清美女图",
        home: [
            "https://www.sfjpg.net/",
            "http://www.jpflt.com/"
        ],
        hostRe: [
            /https?:\/\/www.sfjpg.net\/mm\/.*.html/,
            /https?:\/\/www.jpflt.com\/rentihtml\/zhaopian\/.*\/.*.html/,
        ],
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAH4AAAAtCAIAAADnW0iGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAASwSURBVHic7Zo9bCJHGIYfcnYso5wEupNsWYpCpChgh8KSG4sGu6dwRQs0K3e4TUcXpcMtKcAtlSO5B4rj3JzkgotBiRQnUjgTxWIlX+yzfdam2IXdWX68kLOnYJ5uh92Zb9795v1m0Pr+Ov8bhQx8hmHIjmFG+Ux2ALPL3GDT5fVtraXfXH2YM+6fPqDZwW04v13cvnrb+fGPl+/u5vWPQ16M4lMhiHt5ffv6l066+aWsaGYKwetf/6r/cPZSViizhiD9+/cf3t3Nywpl1hCkf2bcK39/MtTmUhrT53g2Qd6Pr2y3FJPsXBE8ctyw8nA/ett+ZALiGCH2Dth3xvNCaBm8ByBKd4Ocq3FMD0vCHCspthassA/9bHZYrdmNJqUCGQ8zmF76/SN2NboJS7hsgjT4joQbXNOrpFg+Y7U29ZiOrkI0z4T+d1eo1sURa5SWyCXY9/Zq948gQT4FB+xDMUl6kb0D923VOochcpDpYITI1gCaLWtep5rXKQj7+p9f/b7z9uvxD3jMZXQhWQCidGMcesuIBxhIxqFLMB3oXdxQvWYrwCDmmjvViDw0pnlnJQVvLOnNB8/rsDFN1k8s/SCnGsejBxs/q2qd7cakA1oT3m7Y76Afw6BpuGxwjOHYDHUqQDScfp/O1TxeDSdTGo5L0IhG2nHpEnSUvt7XppNsguU2qw2A0zClAsUktMgAUXIu24mTXmSvPKoz+zYj7G7La+T7F45FbBmOn65GAEqFaWbB//H6UctqjKCDtjAxccvuDA2g2SITxwhAwNJObztec5RumGqd9SSVDuth+pbTl9WaRQ1fTRhlVNbbXBEs25ONhO2Xd+xtKtNLnxYz3cn51J0+SF+jOMaStcbNFtNqck5jiRGArVivBtag7xjOUjQs5XFlPcOql4Nmm2U/wTLZBPkkGQ/p9aRZD+hXUw/oIEo3JO49ouRWKBUcFr/GSR024Iz1MMWaVQk4Qw9xApVob324Up4hZdzJVowt0Nti6yXBSwwNve11WT9p1u+uQHvEb5NwGuOwwH4cI0y1zjZ0Y5y3yPSKULXOdhmgsgEXBE07jpOD4AXdEIdldjWKDatCmOvDhSHmkFlXlxfszaXAEgb4Whghsox1qh6PnvWrvSpUSRHRKfkxNLhh78D+aSIqKSJmYdfxFayWAATCGGFKBVaHPWWXmWgvsBaGBgUyDYLOXUAcI0xTh87AESTKMhw3ICQ0ri8QuLaS3QddbyeJp8h60171tnXgygBxDI285y2wk+2BM85gi5u4teMUqLH3nHyKE0c5NReNGVUxaRmIvTF9QUAnA1kAikkiEFmzMqDfbdDbRB4x6/uHmmodn2tzadprlK7GZmuC861wUBqDqyQOujnQP287yqxz0WTKVnmwnEenukj1ore5arMDvoL1hsaNPoJPcKRSTIf651IaSnppCNLf+54F5j7KCmXWEKT/4vniyud3skKZNQTpY98Evv/qH1mhzBpi1i/Ob64t/fTtn9/5r4LKeR6ZId9c/nt9V2l11ddnj4363FUaanMpDSW9NJT00lDSS0NJLw0lvTSU9NJQ0ktDSS8NJb00lPTSUNJLQ0kvDSW9NP4DcTzz/ffRUmMAAAAASUVORK5CYII=",
        speeds: 2000,
        type: "露点", imgHandler: () => {
            try {
                let pageStr = getQuery("div.pagelist a:nth-last-child(2)").href.match(/_(\d+).html/)[1];
                pageNum = parseInt(pageStr);
            } catch (e) {
                let pageStr = getQuery("div.pagelist p a:last-child").href.match(/_(\d+).html/)[1];
                pageNum = parseInt(pageStr);
            }
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref.replace(/\.html/, `_${i + 1}.html`))
                }
            }
            openImgPage(imgPage, "#picg img")
        }
    },
    {
        label: "PAX番号库",
        home: [
            "https://www.3pxa.com/category/mntp"
        ],
        hostRe: [
            /https?:\/\/www.3pxa.com\/.*.html/,
        ],
        logo: "http://www.3pxa.com/wp-content/themes/dux/img/logo.png",
        speeds: 1000,
        type: "img", imgHandler: () => {
            let pageStr = getQuery("div.article-paging > a:last-child > span").textContent
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref + `/${i + 1}`)
                }
            }
            openImgPage(imgPage, "article > p > a img")
        }
    },
    {
        label: "尤物丧志",
        home: [
            "https://youwu.asia/",
            "https://youwu.pics/",
        ],
        hostRe: [
            /https?:\/\/youwu.asia\/albums\/.*/,
            /https?:\/\/youwu.pics\/albums\/.*/,
        ],
        logo: "data:image/png;base64,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",
        speeds: 3000,
        type: "img", imgHandler: () => {
            let pageStr = getQuery("#main > nav > div > span > a:nth-last-child(2)").href.match(/page=(\d+)/)[1]
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                imgPage.push(currHref + `?page=${i + 1}`)
            }
            openImgPage(imgPage, "#main > div > img")
        }
    },
    {
        label: "色图",
        home: ["https://setu.pics/"],
        hostRe: [/https?:\/\/setu.pics\/albums\/.*/],
        speeds: 6500,
        type: "露点",
        logo: "data:image/png;base64,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",
        imgHandler: () => {
            let pageStr = getQuery("#main > nav > div > span a:nth-last-child(2)").href.match(/page=(\d+)/)[1]
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                imgPage.push(currHref + `?page=${i + 1}`)
            }
            openImgPage(imgPage, "div.my-2 img.block.my-1")
        }
    },
    {
        label: "福利姬美图",
        home: ["https://fuligirl.top/"],
        hostRe: [/https?:\/\/fuligirl.top\/albums\/.*/,],
        speeds: 6500,
        type: "露点",
        logo: "data:image/png;base64,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",
        imgHandler: () => {
            let pageStr = getQuery("#main > nav > div > span a:nth-last-child(2)").href.match(/page=(\d+)/)[1]
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                imgPage.push(currHref + `?page=${i + 1}`)
            }
            openImgPage(imgPage, "div.my-1 img")
        }
    },
    {
        label: "亚色图库",
        home: ["https://yase.pics/"],
        hostRe: [/https?:\/\/yase.pics\/albums\/.*/,],
        speeds: 6500,
        type: "露点",
        logo: "data:image/png;base64,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",
        imgHandler: () => {
            debugger
            let pageStr = getQuery("#main > nav > div > span > a:nth-last-child(2)").href.match(/page=(\d+)/)[1]
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                imgPage.push(currHref + `?page=${i + 1}`)
            }
            openImgPage(imgPage, "#main > div > img")
        }
    },
    {
        label: "爱看美女",
        home: [
            "https://www.ikmn05.cc/"
        ],
        hostRe: [
            /https?:\/\/www.ikmn05.cc\/XiuRen\/.*.html/,
        ],
        logo: "https://www.ikmn05.cc/img/logo.png",
        speeds: 1000,
        type: "img", imgHandler: () => {
            let pageStr = getQuery("div.main.wide > div:nth-child(2) > div > div > div.info-con.pd20 > div:nth-child(1) a:nth-last-child(2)").href.match(/_(\d+).html/)[1]
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref.replace(/(\d+).html/, `$1_${i + 1}.html`))
                }
            }
            openImgPage(imgPage, ".info-imtg-box img")
        }
    },
    {
        label: "美人图",
        home: [
            "https://meirentu.top/"
        ],
        hostRe: [
            /https?:\/\/meirentu.top\/pic\/.*.html/,
        ],
        logo: "https://meirentu.top/static/img/logo.png",
        speeds: 2600,
        type: "img", imgHandler: () => {
            let pageStr = getQuery(".page > a:nth-last-child(2)").textContent
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref.replace(/(\d+).html/, `$1-${i + 1}.html`))
                }
            }
            openImgPage(imgPage, ".content_left img")
        }
    },
    {
        label: "套图吧",
        home: [
            "https://www.taotu8.cc/"
        ],
        hostRe: [
            /https?:\/\/www.taotu8.cc\/mm\/.*.html/,
        ],
        logo: "https://www.taotu8.cc/wp-content/themes/xiuren/v/l1.png",
        speeds: 2600,
        type: "img", imgHandler: () => {
            let pageStr = getQuery(".page_navi span a:nth-last-child(1)").href.match(/_(\d+)\.html/)[1]
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref.replace(/\.html/, `_${i + 2}.html`))
                }
            }
            openImgPage(imgPage, ".sg_img img")
        }
    },
    {
        label: "RMM吧",
        home: [
            "https://www.rmm8.com/"
        ],
        hostRe: [
            /https?:\/\/www.rmm8.com\/tu\/.*.html/,
        ],
        logo: "https://www.rmm8.com/common/static/xiuwo/style/img/logo.jpg",
        speeds: 2600,
        type: "img", imgHandler: () => {
            let pageStr = getQuery("div.c_l > p:nth-child(3)").textContent.match(/(\d+)/)[0]
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref.replace(/\.html/, `_${i + 1}.html`))
                }
            }
            openImgPage(imgPage, "#showimg img")
        }
    },
    {
        label: "baobua",
        home: ["https://baobua.com/", "https://thismore.fun/"],
        hostRe: [/https?:\/\/baobua.com\/post\/.*.html/, /https?:\/\/thismore.fun\/view\/.*.php/],
        speeds: 6500,
        type: "露点",
        logo: "https://baobua.com/privid2/logo2.png",
        imgHandler: () => {
            let pageStr = getQuery("div.c-denomination.s-denomination h2").textContent.match(/Page \d+\/(\d+)/)[1]
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref + `?page=${i + 1}`)
                }
            }
            openImgPage(imgPage, ".contentme img")
        }
    },
    {
        label: "depday",
        home: ["https://depday.info/"],
        hostRe: [/https?:\/\/depday.info\/v2\/.*.html/],
        speeds: 3500,
        type: "露点",
        logo: "https://depday.info/privid1/logo2.png",
        imgHandler: () => {
            let pageStr = getQuery("div.c-denomination.s-denomination h2").textContent.match(/Page \d+\/(\d+)/)[1]
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref + `?page=${i + 1}`)
                }
            }
            openImgPage(imgPage, ".contentme2 img")
        }
    },
    {
        label: "coszip",
        home: ["https://www.coszip.com/"],
        hostRe: [/https?:\/\/www.coszip.com\/.*.html/,],
        speeds: 2200,
        type: "露点",
        logo: "https://coszip.com/media/2023/10/logo-1.png",
        imgHandler: () => {
            let pageStr = getQuery("div.nav_link a:nth-last-child(2)")?.textContent
            if (!pageStr){
                allImg(".content-inner img")
                return
            }
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref + `/${i + 1}`)
                }
            }
            openImgPage(imgPage, "div.content-inner img")
        }
    },
    {
        label: "misskon",
        home: ["https://misskon.com/"],
        hostRe: [/https?:\/\/misskon.com\/.*/,],
        speeds: 5200,
        type: "露点",
        logo: "https://misskon.com/media/2023/12/logo-v120923.jpg",
        imgHandler: () => {
            let pageStr = getQuery("div.page-link > a:last-child").textContent
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref + `/${i + 1}`)
                }
            }
            openImgPage(imgPage, "div#fukie2 img")
        }
    },
    {
        label: "buondua",
        home: ["https://buondua.us/"],
        hostRe: [/https?:\/\/buondua.us\/.*/,],
        speeds: 3900,
        type: "露点",
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHUAAAAsCAIAAADU52DUAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAATPSURBVGiB7ZpvTFtVFMBPV+jrSqkwurcJdGWQQWFjm5R0sIXpB7NlkuCSGTU64YvaaDQqmsifBDIjoslqXFgkpC5xyxjRzGRiChkhZgsOBFsw4FjjBnbsjUEplD1aaKtt/XDh0ZS1tI9eTZb7+9Ted+/p6e+de3rbVOC/BQR8bPq/E3jMIX7xQvzihfjFC/GLF+IXL8QvXohfvBC/eCF+8UL84oX4xQvxixfiFy/EL1426ndyRvLAJgEAvx+G72y5wzwRi6weH+I2svhnY9qZ7/MB4L0XRwpyZqqbi7anOM/VXA8132SW1+k1QYOfvDGgVtk2kkZUnL28u7NP+Z/lwLN+fT6B/sdcXdu+vJ323Ay7rm3fNz/l8gtVp9e092TwWxsr6vQa7ReH7awo5pH51K9jMe7Tb9UjYyknnhkryLEBQLZi/odrWREulyV4GrT9mWkL4/cTa1sOsE7RxHQCjzQ2QqHKWl0+JKa8Lrew8cJTRjPNWKWtXbveeeFmbF8oar+WB4mnzqkfOqnaCpNlSlbbogGAV4/erqkw6dr2z7HiW5ak3Iz5SELZFyjWKQKA4j3TANDek9FyJS+ddnz+1q/JMg9qJtzNAAA7K6pqLmKsUrT8WPFdpIMb1x4fBYCWK3kQYDB8DmLKW10+hBSPjKWgEuailZVYuBuAXo6rCbScyzZU/Oj6w8Ao/cGZg/FxvgZtv6FX2Xp1F4AAQNB6NbujV9mg7d+atFT1ddGN4W1hgrBO0btflpR++FydXpNOOy7Wd0fS+0xm+clTz3JyAaCzT1mvL3S5hdzItcEnkVwAMJrprgFFJG9KTHlRAqxTZF+gwk/magLBWKVVzUVhGkt09Wu4sUOdM1N6aKLxQsHsQ3Hgpd9vy5mZhMqXh9t/UXb/pji0dzqSgIxV+vbpw1yFhsLlFqIezVUlqm6jmb75V3JmKoumOV3xF+u7YaUATWb5Ec29dUs4KtQqm0HXgR6jWmas0vFJmVr26BKJzm9NxSAl8r3e+HSQXIRtfvPZy3v01dfdnnDbgtvy3L4+35FTXT4UZsmSWzg1JwEAtcqGfGWmsum0g7FK789IOb+lByfQVs3Pmg2s9BgS1KPWJbr+QIl8AOD3Lz9VbHMYdB0GXUfaVgca8flXp61LssyTnzULAFNzkqWAbb6WoF0ZW+ysyNC7AwCyFfOp8sUwM11u4Vff7WWsUlmCp6myp6myR5YQsvMi+J3PBCsPlk1v4hXGzopGxlKCBrkm2PfHahNPlS9mK+YBwGSWo4Y7PilDRcTdWn4E1iO3ORDoVDNpk/x5LwmNoG20uv8iuOt8zmfCTctaBatj/pVL6y9Hn2+BI2hfI1NrrwKAmPKWlViMZtpopk/UHOXGC1XW3Tvt4Wv/kQTFAYBjxXfLSiwAsJnybt+yyFilnX3Ktd9EQmUYCj5+q14bdCzFA4BE/A8a+eiV4UWXEAASJX9HG4377qRW2bTHR7nT1ZEDzGfnC7hpapWtqbIn8GyEzk8AwMNvIEFnLDHlff+lYa6oayoGu/rTjWYaAJJlno9PDqEc0mnHm8+Pnr60P3wJC8j/z7BCfj/DC/GLF+IXL8QvXohfvBC/eCF+8UL84oX4xQvxixfiFy/EL16IX7wQv3ghfvHyL+gxEegA4p1cAAAAAElFTkSuQmCC",
        imgHandler: () => {
            let pageStr = getQuery(".pagination-list span:last-child a").href.match(/page=(\d+)/)[1]
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref + `?page=${i + 1}`)
                }
            }
            openImgPage(imgPage, "div.article-fulltext p img")
        }
    },
    {
        label: "青年美图",
        home: ["https://jrants.com/"],
        hostRe: [/https?:\/\/jrants.com\/.*.html/,],
        speeds: 3600,
        type: "露点",
        logo: "data:image/png;base64,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",
        imgHandler: () => {
            let pageStr = getQuery(".pgntn-page-pagination-block a:nth-last-child(2)")?.textContent
            if(!pageStr){
                allImg(".bialty-container img")
            }else{
                pageNum = parseInt(pageStr);
                for (let i = 0; i < pageNum; i++) {
                    if (i === 0) {
                        imgPage.push(currHref)
                    } else {
                        imgPage.push(currHref + `/${i + 1}`)
                    }
                }
                openImgPage(imgPage, "div.bialty-container img")
            }
        }
    },
    {
        label: "美女图片",
        home: ["https://www.taotucd.com/"],
        hostRe: [/https?:\/\/www.taotucd.com\/.*.html/,],
        speeds: 6400,
        type: "露点",
        logo: "https://www.taotucd.com/logo.png",
        imgHandler: () => {
            let pageStr = getQuery("div.pagelist > a:last-child").textContent
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref + `/${i + 1}`)
                }
            }
            openImgPage(imgPage, "div#post_content img")
        }
    },
    {
        label: "尼克成人網",
        home: ["https://nick20.com/"],
        hostRe: [/https?:\/\/nick20.com\/pic\/pic\d+.html/,],
        speeds: 8500,
        type: "露点",
        logo: "https://nick20.com/images/logo.gif",
        imgHandler: () => {
            openTab(Large_cgurl)
        }
    },
    {
        label: "4khd",
        home: ["https://www.4khd.com/"],
        hostRe: [/https?:\/\/www.4khd.com\/.*\/.*.html/,],
        speeds: 8500,
        type: "露点",
        logo: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGkAAAAqCAIAAAA/LOKvAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAANDSURBVGiB7ZovWNtAFMDfu5T+AQQuSOTmcHQKpobr3IIaEolbcXN0akOiwLVzRfHh6paqzW2yc1QNUUgoyb0Jxmh6d2lybRP4vvt9VZfL5eXXd/cuaZHOLTBowfIO4Blj3Olj3Olj3Olj3Olj3Olj3Olj3Olj3Omj784f8uogxJFPK4x0uPQjR3EQ4oC748OQeyN2C3EQVm/oipKPAwDUEAZpDOPjES46CPc83gkoiQFdd5zqQ+pqnvxIz6e3XNK+gaxVwRWc+gIp6QIch/Ta52vX/JcssFG03BG1PH6kc2aEns+dgPpCu43YWsS1zMWN8pvo5Q3vhHF9NNyR6/GdREkdhz/kTiDJXBvRXWT5inuAHJ/31Hea2p1qlqUj4LuyKf+UxAEA9Ikat0p56dzdJ4s4y9LBqeHTV6HZRuxUMhaH35YtWrZoif0psxMEW+hxHFBPcXIad9FksRE/aNwnUcvjB0KzDdiusBd5bZkQVwq4u8TakgDIVax6haSjE7VuR5MF2xXseamXvY7HDyQnYXuRVVOIo1eD2GVcE6yWsObRWbTVDcixJGmSMN6x+oDn5VS3+jjOgWKtLD+RNc7CLaFNVS4SCYjWB2yW2XbifE0G1f2pK/eMWBW+xTPF9z3Z3Vh9OCyiM2NxAAAXIbXnMQvnySR30frwrsDqxTnNLtrz6Wo+Q8+JWHfRzcQGY6czW5bwvTBSn3hjmHDmPuwtIh92OIvIxMWjppAU6y6g0c1El/NK9IF87OlixwtxEOI1v5wQHjbL7LSEb4QDn4b0Y/qN9zRw+CG0rSr6Zr+hwpMSOgWAAtZlm6m6eh+fAb2h5Dm9KtugQPbuDou4u3AfCm6VsCZ0uAh5K8g4KAAAn5PrcUdyaVxfkJ8yh5IZB26NlhoL64zEHcD+LW0XcCWLeCbvsWsFXFccyve9MVZlqdcn/jHXmfsfG/FLSVkeY90VmVDLInWtGR22Wfn3XK1aXCVY0lUPju7IzbdoAABgO/bdRO6/V8hTD4D2c029TcSfkx6xc3enTL1uyE/vMg3EBthE/Gyx72XWWZr8UgfNf8i0eQJ592wx7vQx7vQx7vQx7vQx7vQx7vQx7vQx7vQx7vT5CxCKnubFrVZ/AAAAAElFTkSuQmCC",
        imgHandler: () => {
            let pageStr = getQuery("li.numpages:last-child a").textContent
            pageNum = parseInt(pageStr);
            for (let i = 0; i < pageNum; i++) {
                if (i === 0) {
                    imgPage.push(currHref)
                } else {
                    imgPage.push(currHref + `/${i + 1}`)
                }
            }
            openImgPage(imgPage, ".imageLink img")
        }
    },

]


function getQuery(selector) {
    return document.querySelector(selector);
}

function getQueryAll(selector) {
    return document.querySelectorAll(selector);
}

setTimeout(function () {
    siteJson.forEach(site => {
        let regExp = site.hostRe.find(item => item.test(currHref));
        regExp ? site.imgHandler() : undefined
    })
    siteJsonNoPage.forEach(site => {
        let regExp = site.hostRe.find(item => item.test(currHref));
        regExp ? site.imgHandler() : undefined
    })
    // 添加按键监听
    document.addEventListener("keydown", function (e) {
        if (e.key === 'e' && e.altKey) {
            var htmlStr = '<table border="1"><thead>' +
                '<tr><th>序号</th><th>图标</th><th>名称</th><th>首页</th><th>速度</th><th>类型</th></tr></thead>' +
                '<tbody>'
            siteJson.forEach((that, idx) => {
                // 生成表格tr
                htmlStr += `<tr><td>${idx + 1}</td> <td><img src="${that.logo}"  alt="${that.label}" width="100"/></td><td>${that.label}</td> <td>`
                for (let i = 0; i < that.home.length; i++) {
                    htmlStr += `<a href="${that.home[i]}" target="_blank">${that.home[i]}</a><br>`
                }
                htmlStr += ` </td> <td>${that.speeds}</td> <td>${that.type}</td> </tr>`
            })
            siteJsonNoPage.forEach((that, idx) => {
                // 生成表格tr
                htmlStr += `<tr><td>${siteJson.length + idx + 1}</td> <td><img src="${that.logo}"  alt="${that.label}" width="100" /></td><td>${that.label}</td> <td>`
                for (let i = 0; i < that.home.length; i++) {
                    htmlStr += `<a href="${that.home[i]}" target="_blank">${that.home[i]}</a><br>`
                }
                htmlStr += ` </td> <td>${that.speeds}</td> <td>${that.type}</td> </tr>`
            })
            htmlStr += '</tbody></table>';
            // 打开新的窗口
            const newWindow = window.open();
            let document1 = newWindow.document;
            document1.body.innerHTML = htmlStr;
        }
    });
}, 100)
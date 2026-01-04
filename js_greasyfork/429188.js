// ==UserScript==
// @author      xm superman
// @name        jav_preview_new
// @version     0.0.6
// @include     http*://*javbus.com/*
// @include     *://www.*bus*/*
// @include     *://www.*dmm*/*

// @include     http*://*javlibrary.com/*/?v=*
// @include     *://*/movie/*
// @include     *://*/cn*
// @include     *://*/tw*
// @include     *://*/ja*
// @include     *://*/en*

// @description  添加jav官方预览影片  基于作者：BigDiao jav_preview作品Version 0.1.1 修改前版本地址 https://greasyfork.org/zh-CN/scripts/389271-jav-preview
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/zh-CN/scripts/429188-jav-preview-new
// @downloadURL https://update.greasyfork.org/scripts/429188/jav_preview_new.user.js
// @updateURL https://update.greasyfork.org/scripts/429188/jav_preview_new.meta.js
// ==/UserScript==
// 根据网站域名判断视频插入位置
const domain = document.domain
var javbus_domains = ["www.javbus.com",
    "www.javbus.icu",
    "www.dmmsee.icu",
    "www.busjav.icu",
]
var javlibrary_domains = ["www.javlibrary.com",
    "m34z.com",
]

var $position
var $adtablePostiton
var $imgTab

if (javbus_domains.indexOf(domain) != -1) {
    //$position = document.querySelector('#mag-submit-show')
    $position = document.querySelector('#sample-waterfall')
    $adtablePostiton = document.querySelector('#mag-submit-show')
    $imgTab = document.querySelector('.bigImage').href
} else if (javlibrary_domains.indexOf(domain) != -1) {
    $position = document.querySelector('#video_favorite_edit')
}

if (!$position&&!$adtablePostiton) return

// add meta
function addmeta() {
    var oMeta = document.createElement('meta');
    oMeta.setAttribute("http-equiv", "Content-Security-Policy")
    oMeta.setAttribute("content", "upgrade-insecure-requests")
    document.getElementsByTagName('head')[0].appendChild(oMeta);
}

// request with customer headers
function request(url) {
    return new Promise(resolve => {
        GM_xmlhttpRequest({
            url,
            method: 'GET',
            headers: {
                "Cache-Control": "no-cache",
                "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Mobile Safari/537.36",
            },
            timeout: 30000,
            onload: response => { //console.log(url + " reqTime:" + (new Date() - time1));
                resolve(response);
            },
            onabort: (e) => {
                console.log(url + " abort");
                resolve("wrong");
            },
            onerror: (e) => {
                console.log(url + " error");
                console.log(e);
                resolve("wrong");
            },
            ontimeout: (e) => {
                console.log(url + " timeout");
                resolve("wrong");
            },
        });
    });
}

// GM_xmlhttpRequest promise wrapper
const gmFetch = url =>
    new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: url,
            method: 'GET',
            onload: resolve,
            onerror: reject
        })
    })
const parseHTML = str => {
    const tmp = document.implementation.createHTMLDocument()
    tmp.body.innerHTML = str
    return tmp
}
const avid = document.title.replace(/([^-]+)-([^ ]+) .*/, '$1-$2')
const preview = async () => {
    const srcs = src =>
        ['dmb', 'dm', 'sm']
            .map(i => src.replace(/_(dmb|dm|sm)_/, `_${i}_`))
            .map(i => `<source src=${i}></source>`)
            .join('')

    const xrmoo = async () => {
        let tmpAvid = avid.replace('-',' ');
        const res = await gmFetch(
            `http://dmm.xrmoo.com/sindex.php?searchstr=${tmpAvid}`
        )
        try {
            const video_tag = parseHTML(res.responseText).querySelector('a.link.viewVideo')
            console.log(video_tag)
            const src = video_tag.getAttribute('data-link')
            //const video_tag = parseHTML(res.responseText).querySelector('div.card-footer').querySelector("a:nth-child(3)")
            //const src = video_tag.getAttribute('href')
            console.log('xrmoo', src)
            return src
        } catch (err) {
            console.log("获取xrmoo视频地址出现错误", err)
            const src = ""
            return src
        }

    }

    const r18 = async () => {
        const res = await gmFetch(
            `https://www.r18.com/common/search/order=match/searchword=${avid}`
        )
        try {
            const video_tag = parseHTML(res.responseText).querySelector('.js-view-sample')
            const src = ['low', 'med', 'high']
                .map(i => video_tag.getAttribute('data-video-' + i))
                .find(i => i)
            console.log('r18', src)
            return src
        } catch (err) {
            console.log("获取r18视频地址出现错误", err)
            const src = ""
            return src
        }

    }
    const dmm = async () => {
        const res = await request(
            `https://www.dmm.co.jp/search/=/searchstr=${avid}`
        )
        if (res.finalUrl == "http://www.dmm.co.jp/top/-/error/area/") {
            const src = ""
            return src
        }
        try {
            const video_tag = parseHTML(res.responseText).querySelector('.play-btn')
            const src = video_tag.getAttribute('href')
            console.log('dmm', src)
            return src
        } catch (err) {
            console.log('获取dmm视频出现错误:', err)
            const src = ""
            return src
        }
    }
    // erovi.jp
    const GoogleUrl = `https://www.google.com/search?num=6&q=allintitle:${avid} site:https://erovi.jp&safe=images&pws=0&lr=lang_ja`
    const erovi = async () => {
        const res = await gmFetch(GoogleUrl)
        const doc = parseHTML(res.responseText)
        if (doc.querySelector('#topstuff > div')) {
            let src = ""
            return src
        }
        const url = [...doc.querySelectorAll('.g .r a')].map(i => i.href)
        const regex = /https:\/\/erovi\.jp\/item\/.*\.html/gm;
        let m;
        let eroviLinks = []
        // filter match urls
        for (let i in url) {
            while ((m = regex.exec(url[i])) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                m.forEach((match, groupIndex) => {
                    // console.log(`Found match, group ${groupIndex}: ${match}`);
                    eroviLinks.push(match)
                });
            }
        }
        // request for video
        if (eroviLinks.length != 0) {
            try {
                const res2 = await gmFetch(eroviLinks[0])
                const src = parseHTML(res2.responseText).querySelector('video').src
                console.log('erovi.jp', src)
                return src
            } catch (err) {
                console.log("获取erovi.jp视频地址出现错误", err)
                const src = ""
                return src
            }
        }
    }
    let src
    var getVideo = false
    if (getVideo == false) {
        let r18src = await r18()
        if (r18src != "") {
            console.log("r18预览视频获取成功")
            src = srcs(r18src)
            getVideo = true
        } else {
            console.log("r18预览视频获取失败，尝试使用erovi.jp源，请确保代理能够访问该网站")
        }
    }
    if (getVideo == false) {
        let dmmsrc = await dmm()
        if (dmmsrc != "") {
            console.log("dmm预览视频获取成功")
            src = srcs(dmmsrc)
            getVideo = true
        } else {
            console.log("dmm预览视频获取失败，请检查IP是否为日本并确保番号正确")
        }
    }

    if (getVideo == false) {
        let xrmoosrc = await xrmoo()
        if (xrmoosrc != "") {
            console.log("从 xrmoo 获取预览视频获取成功")
            src = srcs(xrmoosrc)
            getVideo = true
        } else {
            console.log("从 xrmoo 获取预览视频获取失败，尝试使用r18源，请确保代理能够访问该网站")
        }
    }
    if (getVideo == false) {
        let erovisrc = await erovi()
        if (erovisrc != "") {
            console.log("erovi.jp预览视频获取成功")
            src = srcs(erovisrc)
            getVideo = true
        } else {
            console.log("erovi.jp预览视频获取失败，请检查IP是否可访问该网站并确保番号正确")
            console.log("尝试使用dmm源，请切换为日本IP")
        }
    }
	
    const html = src
        ? `<video id=jav_preview style='postiton:absolute;z-order:1;display:none;width:85%' controls preload=true defaultMuted=false>${src}</video>`
        : '<div id=jav_preview class=header style="text-align:center;padding-top:1rem;">preview not found</div>'
    //$position.insertAdjacentHTML('afterBegin', html)
    if (javbus_domains.indexOf(domain) != -1) {
        //let thtml = `<a class="sample-box" href="${$imgTab}"><div class="photo-frame">${html}</div></a>`;
        //let thtml = `<a class="sample-box openVideo" href="#jav_preview"><div class="photo-frame"><img src="${$imgTab}" title=""></div></a>`;
        //$position.insertAdjacentHTML('afterBegin', thtml);
        $adtablePostiton.insertAdjacentHTML('beforeBegin',html);

        let tmpA = document.querySelector('.bigImage');
        tmpA.insertAdjacentHTML('beforeBegin',`<a id='playBtnA' href='#jav_preview'><button id='playBtn' sytle="" ></button></a>`);
        tmpA.classList.add('openVideo');
        tmpA.href="#jav_preview";

        document.querySelector('#playBtn').setAttribute("style","position: relative;background: rgba(0, 0, 0, .0);border: none;outline: none;height: 2em;width: 2em;font-size: 2em;cursor: pointer;content: '';position: absolute;top: 45%;left: 48%;height: 0;border-style: solid; border-width: 1em 0 1em 2em; border-color: transparent transparent transparent #e52d27; transition: 0.218s ease;");

        $('.openVideo').magnificPopup({
            type: 'inline',
            callbacks: {
                open: function() {
                    $('html').css('margin-right', 0);
                    // Play video on open:
                    let video = document.querySelector('#jav_preview');
                    video.style.display = 'inline';
                    video.play();
                    let mfpContent = document.querySelector('.mfp-content');
                    mfpContent.style.textAlign='center';
                },
                close: function() {
                    // Reset video on close:
                    let video = document.querySelector('#jav_preview');
                    video.style.display = 'inline';
                    video.pause();
                }
            }
        });

        $('#playBtnA').magnificPopup({
            type: 'inline',
            callbacks: {
                open: function() {
                    $('html').css('margin-right', 0);
                    // Play video on open:
                    let video = document.querySelector('#jav_preview');
                    video.style.display = 'inline';
                    video.play();
                    let mfpContent = document.querySelector('.mfp-content');
                    mfpContent.style.textAlign='center';
                },
                close: function() {
                    // Reset video on close:
                    let video = document.querySelector('#jav_preview');
                    video.style.display = 'inline';
                    video.pause();
                }
            }
        });
    }else{
        $position.insertAdjacentHTML('afterEnd', html)
    }
    //$position.innerHTML=html
}
addmeta()
preview()

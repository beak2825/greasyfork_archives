// ==UserScript==
// @name         抖音网页版无水印一键下载
// @namespace    http://tampermonkey.net/
// @version      3.0.3
// @description  下载无水印的抖音视频，支持按钮点击与[Q]键下载
// @author       adamaliba - 潘帅
// @match        *://*.douyin.com/*
// @include      *://*.douyin.com/*
// @include      *://douyin.com
// @include      *://douyin.com/*
// @match        https://www.douyin.com/search/
// @include      https://www.douyin.com/*
// @include      https://douyin.com/*
// @include      http://www.douyin.com/*
// @include      http://douyin.com/*
// @include      *://*.douyin.com/*
// @include      *://*.iesdouyin.com/*
// @exclude      *://lf-zt.douyin.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_info
// @connect      *
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @license      MIT License
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/444720/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/444720/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(window.onload = function () {

    // let download = () => {
    //     let videoSrc = document.getElementsByTagName("video")[0].currentSrc
    //     let a = document.createElement('a')
    //     document.body.appendChild(a)
    //     a.style.display = "none"
    //     a.href = videoSrc
    //     a.download = videoSrc.split('=').reverse()[0] + '.mp4'
    //     a.target = '_blank'
    //     a.click()
    //     document.body.removeChild(a)
    // }

    function replaceIllegal(str) {
        return str.replace(/“/g, '').replace(/\?/g, '').replace(/、/g, '').replace(/╲/g, '').replace(/\//g, '')
            .replace(/\*/g, '').replace(/”/g, '').replace(/</g, '').replace(/>/g, '').replace(/\|/g, '')
    }

    let download = (div) => {
        if (div)
            div.style.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA9NJREFUaEPtmE2olWUUhZ81a9I0gwZNsh8MhRwUDUopCiEIhBSKpEEpSH+KjoR+hEZdslICLQiKiBKCIIKiSB0EDiyKIjUHOii0aRNnK9bh/eLr697z/d2rHjgbDpzDeX/22mvv9e73FTNumnH/mQO42gzOGZgzMDIC8xSaFkDb3+d/SfeODPSS01eMAdsbgO/KzhslHVsJEKMA2E5kjwA/SNpWd7ANgO0PgLuA7ZImTA2xsQBeAV4uG2+RdLRyYhoA248Bn5axr0rKOoNsLIC1wEngOuCEpPs7AjgO3AdcBu6W9PMg71NfQyfWHH0d2FN+PyPpvXxfigHbTwPvlvELkvaO8WE0gOLsRWAVkEgmopcXA2A7TIWxMHdJ0o1jnJ8oXNcFikNRls+alNt+Dni7rLVX0sISAMJUGIs9L+lgo/ADbDPwp6SIQ6v1AfA7cEvJ20NN6m2fBm4DLoQF4I66jAK/lejfDJyRdHvD+QB7ttRTzo5OvnUaVNIksvdkbdNLwGtVFG0HXEDGdiSCtg9PaJZ22N4OTH4DqyWdK+uGvX0lBavlP5b0eGv4+6RQ2SzylyhFQSo7AzwSh4o87gReWCTNkh5vAe9EbgvgLwpr1VongLD7rxy3gejMQIPuKEkiF6cq+885MG3jxjmQoSn+g5WCtTld/38QgMJGFCVs5JO8PiZpY5fNbafFiCCkXg6VqOdM6G2DAVQ72Y58PgqcknSqiwe21wP5fC4ptTTYOgEokrjkJkMbtbZ1IwqS/piGrhWA7fQsKd5pdiRK0yeMRaGiTNPsV0l3jgXwJbCpZaMDknb3BPAGsKtlzklJ94wCUAo2BXc1Uui8pPOjAUxboBTxQ8BPXbtK25HfdcDXV6SIFwNQGrPZlNHSEjcPss4XE9v1i1Dic2UOsnKCNluJ3HW3SvqrOJZLzZ7mmVC0fwE4nhuY7RuAT8qBVpG8cq3EInJ6Ftgp6dtS6HGoOpS2SfrQdpQmzdxu22kE0xDGVgVwmfdA+iPg1lqqHpW0pYuqtZ4D1SK2fwHWAH8DL0l6s75Boz1oa6f/13bYfhHYD1wPtOp/tXcfAHmBiNp8JKlqmyfr2E4UvymLdr3QPFixVwvSauCJok6dXio6A2iR0rTUSYE+V8qzknIBGmWjARTqDxQv+l7qdzVTsS+aUQBsh/J0oMnbIc8qqaf1zZTsA2IsgJl/2EqPlDeeH5uy1+Fp8X3gKWDUu+koBloK+9p/3G0BcBPwVRnzcNvFpE/e18euGANDHeo7bw6gb8SWe/ycgeWOaN/15gz0jdhyj595Bv4Bp43MQJcVEzMAAAAASUVORK5CYII=")'
        Array.from(document.getElementsByTagName("video")).forEach(video => {
            if (video.autoplay) {
                let account = ''
                if (video.parentNode.parentNode.getElementsByClassName('account-name')[0]) {
                    account = replaceIllegal(video.parentNode.parentNode.getElementsByClassName('account-name')[0].innerText)
                } else {
                    account = document.getElementsByClassName('playerControlHeight')[0].childNodes[1].innerText.split('\n\n')[0]
                }
                let title = ''
                if (video.parentNode.parentNode.getElementsByClassName('title')[0]) {
                    title = replaceIllegal(video.parentNode.parentNode.getElementsByClassName('title')[0].innerText)
                } else {
                    title = replaceIllegal(document.getElementsByTagName('h1')[0].innerText)
                }
                if (title.length === 0) {
                    title = "无标题"
                }
                let interval = setInterval(() => {
                    if (title.length) {
                        fetch(video.currentSrc, {
                            mode: "cors",
                            headers: {
                                "Accept": "*/*",
                                "Accept-Encoding": "identity;q=1, *;q=0",
                                "Accept-Language": "zh-CN,zh;q=0.9",
                                "Connection": "keep-alive",
                                "Host": "v3-web.douyinvod.com",
                                "Origin": "https://www.douyin.com",
                                "Range": "bytes=0-",
                                "Referer": "https://www.douyin.com/",
                                "Sec-Fetch-Dest": "video",
                                "Sec-Fetch-Mode": "cors",
                                "Sec-Fetch-Site": "cross-site",
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
                                "sec-ch-ua": '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "Windows"
                            }
                        }).then(res => {
                            if (title.length === 0) {
                                clearInterval(interval)
                            }
                            res.blob().then(blob => {
                                let blobUrl = window.URL.createObjectURL(blob)
                                let a = document.createElement('a')
                                document.body.appendChild(a)
                                a.style.display = "none"
                                a.href = blobUrl
                                a.download = `${title}_${account}_${Date.now()}.mp4`
                                a.target = '_blank'
                                if (title.length != 0) {
                                    clearInterval(interval)
                                    a.click()
                                    if (div)
                                        div.style.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAqVJREFUaEPtmT1rFUEUhp+DlY2NVoJgo4gKEm20UkHs1EZTRIQUQcTOSsvYWPgDDBYiiBBQQUkEsVJBbbSw0BQiau8PsHxlYG7cbGZ2Z/bOknthp9ydPed95pz5OLPGlDebcv0MAKEISroPXK29u21mi6Uj3ksEJCkk1MyK+ytu0AkfADLybIhAZBIPcyA1i4YUmqoUknQJuAt8AO6Y2VoJAEkXgVvAT2AxZje4t6Tmmhf/pNL/GzAbcpazD0g6BzwHtnnbUbudAQLiR7aCzlIBJJ0FXgDba+KSIZImsaSvwKFItDY5SwGQdBJYAXZE7C6b2VxbhqQCPAYuNxjbANEGIOk4sArsarCZdPhLBTgIuPyPRcHpWIdoApA0A7wEdjeIf2pms22j794nAfgDWjKEhwn5P+zF7y0hPgvAQxwAniVEIhap78D+UuKzATzEHuBVC0RK9Ot9ktOm+mFyClU/krQTeFcQopP4ThEYgUhya/enAhCdxY8FUAFp2iPaUmks8UUA/LzoAjG2+GIAHSCKiC8KkAFRTPwmgBL3OZK+AEciyZ8lXtJDYL5i6w9wr3q/tGEZbTvDtM3IysT+CJyo9c8Vfwp4E/D51sxOj573AuDTyR0AzwB/3ZHZzG6kDoD/fmsBcsSG+koaANYHpo87zbYIFY0AsM/MfrQ5Lfle0jVgqcgkBpKqo8IArtx0BX+95a9C3oJbRdxq8ruk0LotSa5wcr4WIn4aAX4BTdVSn9pTba+a2fnYPvAIuJJqaYv6LZnZ9RiA+y3kfg9Ncpszs+UggN8BPwPHJpTgppm5q83/S3xkF3wNuFuzSWorZnahLihaE0tyfxSP+mg03eH0CenumlzZ+t7MHoQcdSrq+1Sca3sAyB2x0v2HCJQe0Vx7Ux+Bf62bO0D1hp22AAAAAElFTkSuQmCC")'
                                }
                                document.body.removeChild(a)
                                title = ''
                                window.URL.revokeObjectURL(blobUrl);
                            })
                        })
                    } else {
                        clearInterval(interval)
                    }
                }, 1500);
            }
        })
    }

    let downloadInSearch = (div) => {
        if (div)
            div.style.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA9NJREFUaEPtmE2olWUUhZ81a9I0gwZNsh8MhRwUDUopCiEIhBSKpEEpSH+KjoR+hEZdslICLQiKiBKCIIKiSB0EDiyKIjUHOii0aRNnK9bh/eLr697z/d2rHjgbDpzDeX/22mvv9e73FTNumnH/mQO42gzOGZgzMDIC8xSaFkDb3+d/SfeODPSS01eMAdsbgO/KzhslHVsJEKMA2E5kjwA/SNpWd7ANgO0PgLuA7ZImTA2xsQBeAV4uG2+RdLRyYhoA248Bn5axr0rKOoNsLIC1wEngOuCEpPs7AjgO3AdcBu6W9PMg71NfQyfWHH0d2FN+PyPpvXxfigHbTwPvlvELkvaO8WE0gOLsRWAVkEgmopcXA2A7TIWxMHdJ0o1jnJ8oXNcFikNRls+alNt+Dni7rLVX0sISAMJUGIs9L+lgo/ADbDPwp6SIQ6v1AfA7cEvJ20NN6m2fBm4DLoQF4I66jAK/lejfDJyRdHvD+QB7ttRTzo5OvnUaVNIksvdkbdNLwGtVFG0HXEDGdiSCtg9PaJZ22N4OTH4DqyWdK+uGvX0lBavlP5b0eGv4+6RQ2SzylyhFQSo7AzwSh4o87gReWCTNkh5vAe9EbgvgLwpr1VongLD7rxy3gejMQIPuKEkiF6cq+885MG3jxjmQoSn+g5WCtTld/38QgMJGFCVs5JO8PiZpY5fNbafFiCCkXg6VqOdM6G2DAVQ72Y58PgqcknSqiwe21wP5fC4ptTTYOgEokrjkJkMbtbZ1IwqS/piGrhWA7fQsKd5pdiRK0yeMRaGiTNPsV0l3jgXwJbCpZaMDknb3BPAGsKtlzklJ94wCUAo2BXc1Uui8pPOjAUxboBTxQ8BPXbtK25HfdcDXV6SIFwNQGrPZlNHSEjcPss4XE9v1i1Dic2UOsnKCNluJ3HW3SvqrOJZLzZ7mmVC0fwE4nhuY7RuAT8qBVpG8cq3EInJ6Ftgp6dtS6HGoOpS2SfrQdpQmzdxu22kE0xDGVgVwmfdA+iPg1lqqHpW0pYuqtZ4D1SK2fwHWAH8DL0l6s75Boz1oa6f/13bYfhHYD1wPtOp/tXcfAHmBiNp8JKlqmyfr2E4UvymLdr3QPFixVwvSauCJok6dXio6A2iR0rTUSYE+V8qzknIBGmWjARTqDxQv+l7qdzVTsS+aUQBsh/J0oMnbIc8qqaf1zZTsA2IsgJl/2EqPlDeeH5uy1+Fp8X3gKWDUu+koBloK+9p/3G0BcBPwVRnzcNvFpE/e18euGANDHeo7bw6gb8SWe/ycgeWOaN/15gz0jdhyj595Bv4Bp43MQJcVEzMAAAAASUVORK5CYII=")'
        Array.from(document.getElementsByTagName("video")).forEach(video => {
            if (video.autoplay) {
                let parent = document.getElementsByTagName("video")[0].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                let account = parent.getElementsByTagName('a')[1].innerText
                let title = replaceIllegal(parent.getElementsByClassName('KxCuain0')[0].innerText.split('\n')[1])
                if (title.length === 0) {
                    title = "无标题"
                }
                let interval = setInterval(() => {
                    if (title.length) {
                        fetch(video.currentSrc, {
                            mode: "cors",
                            headers: {
                                "Accept": "*/*",
                                "Accept-Encoding": "identity;q=1, *;q=0",
                                "Accept-Language": "zh-CN,zh;q=0.9",
                                "Connection": "keep-alive",
                                "Host": "v3-web.douyinvod.com",
                                "Origin": "https://www.douyin.com",
                                "Range": "bytes=0-",
                                "Referer": "https://www.douyin.com/",
                                "Sec-Fetch-Dest": "video",
                                "Sec-Fetch-Mode": "cors",
                                "Sec-Fetch-Site": "cross-site",
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
                                "sec-ch-ua": '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
                                "sec-ch-ua-mobile": "?0",
                                "sec-ch-ua-platform": "Windows"
                            }
                        }).then(res => {
                            if (title.length === 0) {
                                clearInterval(interval)
                            }
                            res.blob().then(blob => {
                                let blobUrl = window.URL.createObjectURL(blob)
                                let a = document.createElement('a')
                                document.body.appendChild(a)
                                a.style.display = "none"
                                a.href = blobUrl
                                a.download = `${title}_${account}_${Date.now()}.mp4`
                                a.target = '_blank'
                                if (title.length != 0) {
                                    clearInterval(interval)
                                    a.click()
                                    if (div)
                                        div.style.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAqVJREFUaEPtmT1rFUEUhp+DlY2NVoJgo4gKEm20UkHs1EZTRIQUQcTOSsvYWPgDDBYiiBBQQUkEsVJBbbSw0BQiau8PsHxlYG7cbGZ2Z/bOknthp9ydPed95pz5OLPGlDebcv0MAKEISroPXK29u21mi6Uj3ksEJCkk1MyK+ytu0AkfADLybIhAZBIPcyA1i4YUmqoUknQJuAt8AO6Y2VoJAEkXgVvAT2AxZje4t6Tmmhf/pNL/GzAbcpazD0g6BzwHtnnbUbudAQLiR7aCzlIBJJ0FXgDba+KSIZImsaSvwKFItDY5SwGQdBJYAXZE7C6b2VxbhqQCPAYuNxjbANEGIOk4sArsarCZdPhLBTgIuPyPRcHpWIdoApA0A7wEdjeIf2pms22j794nAfgDWjKEhwn5P+zF7y0hPgvAQxwAniVEIhap78D+UuKzATzEHuBVC0RK9Ot9ktOm+mFyClU/krQTeFcQopP4ThEYgUhya/enAhCdxY8FUAFp2iPaUmks8UUA/LzoAjG2+GIAHSCKiC8KkAFRTPwmgBL3OZK+AEciyZ8lXtJDYL5i6w9wr3q/tGEZbTvDtM3IysT+CJyo9c8Vfwp4E/D51sxOj573AuDTyR0AzwB/3ZHZzG6kDoD/fmsBcsSG+koaANYHpo87zbYIFY0AsM/MfrQ5Lfle0jVgqcgkBpKqo8IArtx0BX+95a9C3oJbRdxq8ruk0LotSa5wcr4WIn4aAX4BTdVSn9pTba+a2fnYPvAIuJJqaYv6LZnZ9RiA+y3kfg9Ncpszs+UggN8BPwPHJpTgppm5q83/S3xkF3wNuFuzSWorZnahLihaE0tyfxSP+mg03eH0CenumlzZ+t7MHoQcdSrq+1Sca3sAyB2x0v2HCJQe0Vx7Ux+Bf62bO0D1hp22AAAAAElFTkSuQmCC")'
                                }
                                document.body.removeChild(a)
                                title = ''
                                window.URL.revokeObjectURL(blobUrl);
                            })
                        })
                    } else {
                        clearInterval(interval)
                    }
                }, 1500);

            }
        })
    }

    let createBtn = () => {
        let div = document.createElement('div')
        div.style.width = '60%'
        div.style.height = '40px'
        div.style.marginTop = '10px'
        div.style.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAqVJREFUaEPtmT1rFUEUhp+DlY2NVoJgo4gKEm20UkHs1EZTRIQUQcTOSsvYWPgDDBYiiBBQQUkEsVJBbbSw0BQiau8PsHxlYG7cbGZ2Z/bOknthp9ydPed95pz5OLPGlDebcv0MAKEISroPXK29u21mi6Uj3ksEJCkk1MyK+ytu0AkfADLybIhAZBIPcyA1i4YUmqoUknQJuAt8AO6Y2VoJAEkXgVvAT2AxZje4t6Tmmhf/pNL/GzAbcpazD0g6BzwHtnnbUbudAQLiR7aCzlIBJJ0FXgDba+KSIZImsaSvwKFItDY5SwGQdBJYAXZE7C6b2VxbhqQCPAYuNxjbANEGIOk4sArsarCZdPhLBTgIuPyPRcHpWIdoApA0A7wEdjeIf2pms22j794nAfgDWjKEhwn5P+zF7y0hPgvAQxwAniVEIhap78D+UuKzATzEHuBVC0RK9Ot9ktOm+mFyClU/krQTeFcQopP4ThEYgUhya/enAhCdxY8FUAFp2iPaUmks8UUA/LzoAjG2+GIAHSCKiC8KkAFRTPwmgBL3OZK+AEciyZ8lXtJDYL5i6w9wr3q/tGEZbTvDtM3IysT+CJyo9c8Vfwp4E/D51sxOj573AuDTyR0AzwB/3ZHZzG6kDoD/fmsBcsSG+koaANYHpo87zbYIFY0AsM/MfrQ5Lfle0jVgqcgkBpKqo8IArtx0BX+95a9C3oJbRdxq8ruk0LotSa5wcr4WIn4aAX4BTdVSn9pTba+a2fnYPvAIuJJqaYv6LZnZ9RiA+y3kfg9Ncpszs+UggN8BPwPHJpTgppm5q83/S3xkF3wNuFuzSWorZnahLihaE0tyfxSP+mg03eH0CenumlzZ+t7MHoQcdSrq+1Sca3sAyB2x0v2HCJQe0Vx7Ux+Bf62bO0D1hp22AAAAAElFTkSuQmCC")'
        div.style.backgroundSize = 'contain'
        div.style.backgroundRepeat = 'no-repeat'
        div.id = 'adamaliba'
        // Array.from(document.getElementsByClassName('xgplayer-playswitch')).forEach(xgplayer => {
        //     let child = xgplayer.parentNode.childNodes[1]
        //     if (child && child.lastChild && child.lastChild.id != 'adamaliba') {
        //         xgplayer.parentNode.childNodes[1].appendChild(div)
        //     }
        // })
        let doms = document.getElementsByClassName("immersive-player-switch-on-hide-interaction-area")
        Array.from(doms).forEach(dom => {
            if (dom && dom.lastChild && dom.lastChild.id != 'adamaliba') {
                dom.appendChild(div)
                div.onclick = () => {
                download(div)
            }
            }
        })

    }

    let createBtnInSearch = () => {
        let xgplayer = document.getElementsByClassName('xgplayer-controls-initshow')[0].parentNode.childNodes[1].childNodes[0]
        if (xgplayer.lastChild.id != 'adamaliba') {
            let div = document.createElement('div')
            div.style.width = '60%'
            div.style.height = '40px'
            div.style.marginTop = '10px'
            div.style.backgroundImage = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAqVJREFUaEPtmT1rFUEUhp+DlY2NVoJgo4gKEm20UkHs1EZTRIQUQcTOSsvYWPgDDBYiiBBQQUkEsVJBbbSw0BQiau8PsHxlYG7cbGZ2Z/bOknthp9ydPed95pz5OLPGlDebcv0MAKEISroPXK29u21mi6Uj3ksEJCkk1MyK+ytu0AkfADLybIhAZBIPcyA1i4YUmqoUknQJuAt8AO6Y2VoJAEkXgVvAT2AxZje4t6Tmmhf/pNL/GzAbcpazD0g6BzwHtnnbUbudAQLiR7aCzlIBJJ0FXgDba+KSIZImsaSvwKFItDY5SwGQdBJYAXZE7C6b2VxbhqQCPAYuNxjbANEGIOk4sArsarCZdPhLBTgIuPyPRcHpWIdoApA0A7wEdjeIf2pms22j794nAfgDWjKEhwn5P+zF7y0hPgvAQxwAniVEIhap78D+UuKzATzEHuBVC0RK9Ot9ktOm+mFyClU/krQTeFcQopP4ThEYgUhya/enAhCdxY8FUAFp2iPaUmks8UUA/LzoAjG2+GIAHSCKiC8KkAFRTPwmgBL3OZK+AEciyZ8lXtJDYL5i6w9wr3q/tGEZbTvDtM3IysT+CJyo9c8Vfwp4E/D51sxOj573AuDTyR0AzwB/3ZHZzG6kDoD/fmsBcsSG+koaANYHpo87zbYIFY0AsM/MfrQ5Lfle0jVgqcgkBpKqo8IArtx0BX+95a9C3oJbRdxq8ruk0LotSa5wcr4WIn4aAX4BTdVSn9pTba+a2fnYPvAIuJJqaYv6LZnZ9RiA+y3kfg9Ncpszs+UggN8BPwPHJpTgppm5q83/S3xkF3wNuFuzSWorZnahLihaE0tyfxSP+mg03eH0CenumlzZ+t7MHoQcdSrq+1Sca3sAyB2x0v2HCJQe0Vx7Ux+Bf62bO0D1hp22AAAAAElFTkSuQmCC")'
            div.style.backgroundSize = 'contain'
            div.style.backgroundRepeat = 'no-repeat'
            div.id = 'adamaliba'
            xgplayer.appendChild(div)
            div.onclick = () => {
                downloadInSearch(div)
            }
        }

    }
    let Timer = setInterval(() => {
            location.href.indexOf('search') === -1 ? createBtn() : createBtnInSearch()
        }, 200);

    

    document.addEventListener('keydown', function (e) {
        if (e.keyCode === 81) {
            let div = document.getElementById('adamaliba')
            location.href.indexOf('search') === -1 ? download(div) : downloadInSearch(div)
        }
    })

    console.log('抖音网页版无水印一键下载已开启！觉得不好用？来这里吐槽！ https://greasyfork.org/zh-CN/scripts/444720 ')

})()
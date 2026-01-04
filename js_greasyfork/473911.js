// ==UserScript==
// @name 抖音网页版
// @description 抖音网页版推荐、直播优化，网页全屏，全黑，自动按浏览器窗口调整大小
// @namespace https://space.bilibili.com/482343
// @author 古海沉舟
// @license 古海沉舟
// @version 1.9.2
// @match https://www.douyin.com/*
// @include https://www.douyin.com/recommend
// @include https://www.douyin.com/*
// @include https://www.douyin.com/?*
// @include https://www.douyin.com/follow
// @include https://live.douyin.com/*
// @require https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_addValueChangeListener
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/473911/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/473911/%E6%8A%96%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88.meta.js
// ==/UserScript==

var lastindex=0,livecount=0,livewidth=0,onelinecount,livelinecount,hovercount;

function keydown(event) {
    //console.log(event.keyCode);
    if(event.keyCode == 109 || event.keyCode == 189){ // 按-或者小键盘-
        pagefullscreen();
    }
}
document.addEventListener('keydown', keydown, false);

var haspagefullscreen=0;
if (location.href.indexOf("https://www.douyin.com/follow")>-1){
    haspagefullscreen=1;

    let livestyle = document.createElement('style');
    livestyle.classList.add("live");
    livestyle.innerHTML = `
        .NQ38Bc0h .nvzm0QdP .X5RsU67Q { display: flex; flex-wrap: wrap; flex: 1 1 auto; overflow-y: scroll; }
div.X5RsU67Q { width: 100%; overflow: auto; margin: auto; }
div.X5RsU67Q { left: 0 !important; right: 0 !important; bottom: 0 !important; top: 0 !important; position: absolute !important; margin: auto !important; transform: none !important; }
.NQ38Bc0h{height:100%}
.JTIGfG2P.aSKksRfh { display: flex; flex-wrap: wrap; flex: 6 1 auto; overflow-y: scroll; height: auto !important; max-height: 550px !important; }
.YwClj8rK:hover{
    flex: 12 1;
}
.YwClj8rK { min-height: 20px !important; }
.NQ38Bc0h .nvzm0QdP .X5RsU67Q .o3pEYU7M { height: 80px !important; margin-left: 5px !important; margin-right: 5px !important; }
.Jt6LO5RK .qOwBZHet .trexWhDY { border-radius: 0%; height: 48px; width: 48px; }
.Jt6LO5RK .qOwBZHet .trexWhDY { animation: none; }
.Jt6LO5RK .qOwBZHet { margin-top: 13px; margin-bottom: 2px; }
.Jt6LO5RK .qOwBZHet .y5X4PaKT, .Jt6LO5RK .qOwBZHet .o4w20gFP, div.XcEg0PrM,div.Lo8QPz5R{ display: none !important }

.lXuWkeYW, .lXuWkeYW .oJArD0aS {
    height: 60px !important;
}

div[data-e2e="recommend-guide-mask"]{display: none!important}
`
    document.body.appendChild(livestyle);
    var liveheight=setInterval(function(){
         //直播个数
        livecount=$(`#douyin-right-container > div.JTIGfG2P.aSKksRfh > div > div.nvzm0QdP > div.X5RsU67Q > a`).length;
        console.log("直播个数",livecount);
        //宽度
        livewidth=$(`#douyin-right-container > div.JTIGfG2P.aSKksRfh > div > div.nvzm0QdP > div.X5RsU67Q`).width();
        console.log("宽度",livewidth);
        //每行多少列
        onelinecount=Math.trunc(livewidth/90);
        console.log("每行多少列",onelinecount);
        //多少行
        livelinecount=Math.ceil(livecount/onelinecount);
        console.log("多少行",livelinecount);
        //显示部分多高
        livecount=$(`#douyin-right-container`).height()-60;
        console.log("显示部分多高",livecount);
        //最大比例
        livewidth=Math.trunc(livecount/80)-1;
        console.log("最大比例",livewidth);
        //当前数量比例
        onelinecount=(livelinecount*80)/(livecount-(livelinecount*80))
        console.log("全部显示比例",onelinecount);
        //应该显示比例
        if( onelinecount<0) {
            livelinecount=livewidth;
        }else{
        livelinecount=Math.min(livewidth,onelinecount);
        }
        console.log("应该显示比例",livelinecount);
        //悬停显示比例
        hovercount=(livecount/80-1)*livelinecount;
        console.log("悬停显示比例",hovercount);

    if (isNaN(livelinecount) || livelinecount==null){
        return
    }
        clearInterval(liveheight);
        let livestyle2 = document.createElement('style');
        livestyle2.classList.add("live2");
        livestyle2.innerHTML = `
.JTIGfG2P.aSKksRfh { display: flex; flex-wrap: wrap; flex: `+livelinecount+` 1 auto; overflow-y: scroll; height: auto !important; max-height: 550px !important; }
.YwClj8rK:hover{ flex: `+hovercount +` 1;
}
`
    document.body.appendChild(livestyle2);
    },500);

}
function pagefullscreen(){
    var is=0;
    //$(`#slidelist > div > div.swiper-wrapper > div.swiper-slide-active xg-icon.xgplayer-page-full-screen > div.xgplayer-icon`).click();
    $(`#sliderVideo xg-icon.xgplayer-page-full-screen > div.xgplayer-icon`).each(function(){
        haspagefullscreen=1;
        $(this).click();
        is=1;
        if (is){return}
        console.log("非推荐");
        $(`xg-controls xg-icon>div > div:nth-child(2)`).each(function(){
            if ($(this).parent().text().indexOf("网页全屏")<0)return;
            console.log("判断：",$(this).text(),"  ",$(this)[0]);
            haspagefullscreen=1;
            $(this).click();
        })
    })
    if (is){return}
    $(`div[data-e2e="living-container"] xg-icon>div>div`).each(function(){
        if ($(this).parent().text().indexOf("网页全屏")<0)return;
        console.log("判断：",$(this).text(),"  ",$(this)[0]);
        haspagefullscreen=1;
        $(this).click();
    })

}
var firstfullscreen=setInterval(function(){
    if (haspagefullscreen){
        clearInterval(firstfullscreen);
        return;
    }
    pagefullscreen();
},1000);

setInterval(function(){
    filtergift();
},1000);

function filtergift(){ //过滤直播礼物
    $(`div.webcast-chatroom___item span.Q7mln_nz`).each(function(){
        if ($(this).text().indexOf("送出了")>-1){
            console.log($(this).parent().parent().parent().parent().text().replace(/\n/g, " ").replace(/\s\s/g, " "));
            $(this).parent().parent().parent().parent().hide();
        }
    })
}
function addCSS(){
    let wdstyle = document.createElement('style');
    wdstyle.classList.add("optimize");
    wdstyle.innerHTML = `
div.gNyVUu_s, .OaNxZqFU img, .iRX47Q8q img { display: none!important }
.qdcce5kG .VFMR0HAe { background: #0000 !important }
.vLt8mbfQ .y8iJbHin .mMOxHVzv, .vLt8mbfQ .y8iJbHin .rrKCA47Q, div.webcast-chatroom, .BasEuG5Q ._QjzkgP3, .OaNxZqFU,.basicPlayer.xgplayer{ background: #000 !important }
.Npz7CPXj, div.webcast-chatroom .webcast-chatroom___input-container .webcast-chatroom___textarea, .CgAB9miy, .JTIGfG2P, .NQ38Bc0h .XcEg0PrM, .N_HNXA04:not(.dUiu6B8O) .iViO9oMI, .UKFpY5tW, .SxCiQ8ip .EDvjMGPs,.SxCiQ8ip .A0ewbQCI,.fpRIB_wC,div.tgMCqIjJ, div.tgMCqIjJ.isDark,.sELpHy0M.metro .lgs6xhy7 .slot-item:hover,.sELpHy0M.metro .B9p3ney8:hover,.sELpHy0M.metro .UjStUCgW ._BSUxMOF:hover{ background: #111 !important }
.N_HNXA04:not(.dUiu6B8O) .kQ2JnIMK .n9PPTk22, .N_HNXA04 .kQ2JnIMK, .iwzpXgQ3 .oJArD0aS, .xWPMYXKp .gOSlkVoB, .Exz5X5r1,.R5ITbXfy .k5cuEeRD,.sELpHy0M.metro .lgs6xhy7 .slot-item,.sELpHy0M.metro .B9p3ney8,.sELpHy0M.metro .UjStUCgW ._BSUxMOF{ background: #222 !important }
div.JwGiJkkI, div.xgplayer-dynamic-bg, div.umOY7cDY, div.ruqvqPsH { display: none !important }
.L8o4Hyg1,.L8o4Hyg1 .LFbb1oon,.L8o4Hyg1 .R6NHkCAw .i4vdvOF5{ box-shadow: none !important; border-bottom: none !important; border-right: none !important; }

.pgQgzInF.hqONwptG .Jf1GlewW.Ox89VrU5, .ckEyweZa.AmXnh1GR .QICHGW7r.RosH2lNv, .SxCiQ8ip.V6Va18Np .EDvjMGPs.FKQqfehj { height: 100% !important; }
div.immersive-player-switch-on-hide-interaction-area, #video-info-wrap, xg-inner-controls.xg-inner-controls { opacity: 0.6 !important }
.xgplayer-playswitch .xgplayer-playswitch-tab { opacity: 0 !important }
div.xgplayer-playswitch-tab:hover, div.immersive-player-switch-on-hide-interaction-area:hover, #video-info-wrap:hover, xg-inner-controls.xg-inner-controls:hover { opacity: 1 !important }
`
    document.body.appendChild(wdstyle);
}
addCSS();


//  下载
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
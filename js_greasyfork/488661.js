// ==UserScript==
// @name         编程猫岛3优化
// @namespace    box3_optimization
// @version      1.0
// @description  优化编程猫岛3
// @author       银河本尊
// @run-at       document-start
// @match        https://box3.codemao.cn/*
// @license      MIT
// @grant        none
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/488661/%E7%BC%96%E7%A8%8B%E7%8C%AB%E5%B2%9B3%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/488661/%E7%BC%96%E7%A8%8B%E7%8C%AB%E5%B2%9B3%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

if(window.location.href.startsWith('https://box3.codemao.cn/p')||
window.location.href.startsWith('https://box3.codemao.cn/e')){
    ;(async function(){
        while($('._1DiYtkLpiTK0Yv0T0Y4856').length==0){
            await sleep(100)
        }
        l_text = $(`._1DiYtkLpiTK0Yv0T0Y4856`)
        while($('._1DiYtkLpiTK0Yv0T0Y4856').length==1){
            await sleep(1)
            if(l_text.html()=='正在启动容器...'){
                l_text.html('正在等待服务器启动...')
            }
        }
    })()

    var sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    var l =[]
    ;(async function(){
        while($('._1DiYtkLpiTK0Yv0T0Y4856').length==0){
            await sleep(1)
            //console.log('w')
        }
        l_text = $(`._1DiYtkLpiTK0Yv0T0Y4856`)
        while($('._1DiYtkLpiTK0Yv0T0Y4856').length==1){
            await sleep(1)
            console.log(l_text.html())
        }
    })()
}

if(window.location.href.startsWith('https://box3.codemao.cn/e')){
    ;(async function(){
        
    })()
}

if(window.location.href.startsWith('https://box3.codemao.cn/p/build-world')||
window.location.href.startsWith('https://box3.codemao.cn/e/6f0f60e422d7bbc167e8')){
    ;(async function(){
        while(1){
            if(
                $('._2-mboOGAzqlenTwPvWi0Bq').length==1&&
                $('._2-mboOGAzqlenTwPvWi0Bq').html().startsWith(`[红包]`)&&
                $('._2-mboOGAzqlenTwPvWi0Bq').html().includes('发了一个')
            ){
                
                var psw=$('._2-mboOGAzqlenTwPvWi0Bq').html().split(`领取口令为 `)[1]
                console.log(psw, $('._2-mboOGAzqlenTwPvWi0Bq').html(), $('._2-mboOGAzqlenTwPvWi0Bq').html().split(`领取口令为 `))
                console.log($('._2-mboOGAzqlenTwPvWi0Bq').html())
                while($("._2_ceziauqr6sRTjRrTxDYW").length==0){
                    await sleep(1)
                    //console.log('wfv')
                }
                $("._2_ceziauqr6sRTjRrTxDYW").val(psw)
            }else{
                //console.log('no-red_paket')
            }
            await sleep(1)
        }
    })()
}

create_css()

function create_css() {
$("head").append(`
<style>
/*操作角色按钮*/
/*键fu*/
._3hDFOfcDQfwtxrSCphpCD5, 
._1850wHLYAcMHi81puF3kOs, 
._3opizDdGAC-n6slXyZYSj2, 
._1Dutt_UIxDt4x5kv0rZXU8, 
._18A97iZ2fiOjqWSaCVUSMk{
    border: 0 !important;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
    background-color: rgba(0, 0, 0, 0) !important;
    background-image: none !important;
}
/*键img*/
.ZMmoGNk_rHrTRL9ZLgf9i, 
._1850wHLYAcMHi81puF3kOs div, 
._3opizDdGAC-n6slXyZYSj2 div, 
._1rduR1S8XBX29FV5tExF2g, 
._1_L2XUIwtdbpB67ppPZMoG{
    background-position-x: 0px !important;
    background-position-y: 0px !important;
    background-size: cover !important;
    width: 40px !important;
    height: 40px !important;
    font-size: 0px !important;
    image-rendering: pixelated;
    opacity: 0.5;
}

/*下键*/
._3hDFOfcDQfwtxrSCphpCD5{
    left: 0 !important;
    top: 55px !important;
}

.ZMmoGNk_rHrTRL9ZLgf9i{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDc4MDAyNDAzMjhfYjIzZTljMTE.png) !important;
}

.ZMmoGNk_rHrTRL9ZLgf9i:active{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDc4MDE1MjkzODdfNzYyYjM4NjE.png) !important;
}
/*左键*/
._1850wHLYAcMHi81puF3kOs{
    left: -55px !important;
    top: 77.5px !important;
}

._1850wHLYAcMHi81puF3kOs div{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDc4MDM3NDU0NzFfNjY4ZDM4OTk.png) !important;
}

._1850wHLYAcMHi81puF3kOs div:active{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDc4MDM3NTQxODNfNmZkMDgzZTQ.png) !important;
}
/*右键*/
._3opizDdGAC-n6slXyZYSj2{
    left: 0 !important;
    top: 110px !important;
}

._3opizDdGAC-n6slXyZYSj2 div{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDc4MDM5OTA5NTRfYWY4OTUyNDY.png) !important;
}

._3opizDdGAC-n6slXyZYSj2 div:active{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDc4MDQxMzkwMjZfOGRiN2ExNTE.png) !important;
}
/*上键*/
._1rduR1S8XBX29FV5tExF2g{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDgxNjM4MDI3OTNfYWVmZWI4MzQ.png) !important;
    transform: none !important;
}

._1rduR1S8XBX29FV5tExF2g:active{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDgxNjgyMTUyMDZfYjdjNzYyOWY.png) !important;
}
/*飞行*/
._34W7x_pQ_wiKMlRVV0K7Po{
    left: -55px;
    top: 22.5px;
}

._34W7x_pQ_wiKMlRVV0K7Po *{
    transition: all 0.3s !important;
}

._34W7x_pQ_wiKMlRVV0K7Po ._3kOxWCiDpQBpheGjybD4OJ._18A97iZ2fiOjqWSaCVUSMk{
    left: 55px !important;
    top: 0px !important;
    position: relative;
}

._34W7x_pQ_wiKMlRVV0K7Po ._18A97iZ2fiOjqWSaCVUSMk{
    left: 0px !important;
    top: 0px !important;
    position: relative;
}

._1_L2XUIwtdbpB67ppPZMoG{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDgxNzE1MzE4ODZfODZmZTI2ZGU.png) !important;
}

._3kOxWCiDpQBpheGjybD4OJ ._1_L2XUIwtdbpB67ppPZMoG{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDgxODAyMDgwNjVfNzNkNjg0YWI.png) !important;
}
/*飞行滑杆bg*/
._3hZRsCVozsc2DvHPOtZvqE{
    border: rgba(0, 0, 0, 0.5) 2px solid !important;
    border-radius: 5px !important;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
    background-color: rgba(0, 0, 0, 0);
    background-image: none !important;
    left: 0px;
    width: 40px !important;
    position: relative;
    animation-name: fbg_ani; 
    /*animation-delay: -0.3s;*/
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
}

@keyframes fbg_ani {
    from {
        left: 0px;
        top: 0px;
        opacity: 0;
        height: 40px;
        background-color: rgba(0, 0, 0, 0);
    }

    to {
        left: 55px;
        top: -24px;
        opacity: 1;
        height: 88px;
        background-color: rgba(127, 127, 127, 0.5);
    }
}
/*摇杆*/
@keyframes joystick_in {
    from {
        left: -100px;
        opacity: 0;
    }

    to {
        left: 0px;
        opacity: 0.5;
    }
}

.Xq5HedDIx7vTvqO0A8rwu{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDc4MDYzNDgxNjJfZTVlYzI5MTk.png) !important;
    background-size: cover;
    image-rendering: pixelated;
    opacity: 0.5;
    animation-name: joystick_in; 
    /*animation-delay: -0.3s;*/
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
}

._1Tn2VdGoieEBwZNdxq1iH0{
    border: 0 !important;
    border-radius: 5px !important;
    box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
    background-color: rgba(0, 0, 0, 0) !important;
    background-image: none !important;
    opacity: 1;
}

._1se2B0ySDNrHjcXe0hAH3o, 
._2RStXlszHPu24gFvU_U-TR, 
._3j2J0ZBUrmhS_Sq0D6SrEC, 
.K6UBMdC5ifCBUiiUeIYUm, 

.qO5JqQAJhbq5hHTEy16Uh, 

._1hKRR66KMfnbO6l4LWefHA, 
._3FzmFEHzvwUYxmwen6-0j4, 
._1v0b7uHgzzpalXsHTDUzaV, 
._3pgrWH2b4g4RL_u2D4pwZm{
    display: none !important;
}

._1BNA3p3s-goilfUF95ykfw{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDc4MDg5MTA1NTNfNGExZGVmMDU.png) !important;
    width: 44px !important;
    height: 44px !important;
    border-radius: 0px !important;
    background-size: cover;
    image-rendering: pixelated;
    background-color: rgba(0, 0, 0, 0) !important;
}
/*键fu元素*/
@keyframes btnf_in {
    from {
        right: -76px;
        opacity: 0;
    }

    to {
        /*right: 24px;*/
        opacity: 1;
    }
}

._1rn38KzoPdF8GoVkfXY0_R{
    width: 40px !important;
    height: 40px !important;
    bottom: 175px !important;
    box-sizing: content-box !important;
    animation-name: btnf_in; 
    /*animation-delay: -0.3s;*/
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
}
/**/
._2mVxdrXf67jd963Jxtey4w{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDg2MjA0OTU4MDhfOWYxOWY4YjY.png) !important;
    image-rendering: pixelated;
    /*left: 0;*/
}

._250ZNuick55IjqqTAxc_ec{
    width: 100%;
    text-align: left;
}

._2lji4shaA4KlBkAd9V4t5J, 
.ZogkIoEUraxHo6Ymp6K4G{
    margin-left: 23px;
    margin-top: 23px;
    color: white;
    font-size: 15px;
}

.ZogkIoEUraxHo6Ymp6K4G{
    margin-top: 3px;
}
/*顶部菜单按钮*/

@keyframes top_in {
    from {
        top: -30px;
        opacity: 0;
    }

    to {
        top: 0px;
        opacity: 1;
    }
}

._2rhooeY_7SteIhKwgzHRgZ{
    left: 0;
    top: 0;
    width: 100%;
    height: 30px;
    padding: 0;
    /*align-items: center;*/
    text-align: center;
    overflow: none;
    flex-direction: row-reverse !important;
    filter: none !important;
    animation-name: top_in; 
    /*animation-delay: -0.3s;*/
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
}

.dkbAKJ3qGMfS0q4oe95d{
    display: inline-block !important; 
    top: 0px !important;
    width: 30px !important;
    height: 30px !important;
    padding: 0px !important;
    align-items: stretch !important;
    justify-content: flex-start !important;
    margin: 0 1px;
}

._2T4sqVgB0AGE44khsia1Vi .lOtpU2V5cVDw98vwQE7rZ{
    width: 30px !important;
    height: 30px !important;
}

.lOtpU2V5cVDw98vwQE7rZ, 
._3BPD9NEd8RUsJL95evO6Jx, 
._25wEApkScl_QiBNJm5ChUp, 
._2hKtLFYTNyKOX2rRxeDsa3{
    background-position-x: 0px !important;
    background-position-y: 0px !important;
    background-size: cover !important;
    width: 30px !important;
    height: 30px !important;
    font-size: 0px !important;
    image-rendering: pixelated;
    opacity: 0.5;
    box-shadow: none !important;
}

.lOtpU2V5cVDw98vwQE7rZ{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDgzMTEzMzA4MjBfODkzOTA4Zjk.png) !important;
}

._3BPD9NEd8RUsJL95evO6Jx{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDgzMTI4Mzk3NDdfMWY5NzkzMjc.png) !important;
}

._25wEApkScl_QiBNJm5ChUp{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDgzMTMwOTI1MTFfY2ExYWVmMWU.png) !important;
}

._2hKtLFYTNyKOX2rRxeDsa3{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDgzMTM3MzgyNjdfNDUyYzIxNGE.png) !important;
}
/*弹窗动画*/
@keyframes bottom_in {
    from {
        bottom: -100px;
        opacity: 0;
    }

    to {
        bottom: 0px;
        opacity: 1;
    }
}

@keyframes right_in {
    from {
        right: -100px;
        opacity: 0;
    }

    to {
        right: 0px;
        opacity: 1;
    }
}

._3SMUPpGhBHERVHLc5mExFw, 
._209Z3bqc__KXJWWHaKXzmj{
    animation-name: bottom_in; 
    /*animation-delay: -0.3s;*/
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
}

._2NzSQOKMmbrU0U018BofTp, 
._1L2R-gywKC4BCLDdJgy1Nb{
    animation-name: right_in; 
    /*animation-delay: -0.3s;*/
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
}

._3SMUPpGhBHERVHLc5mExFw, 
._2NzSQOKMmbrU0U018BofTp, 
._1L2R-gywKC4BCLDdJgy1Nb, 

._17OkAMOsdetKo2usAMdhlH, 
._2NjQXTjEdLohnvh_VMEc2a, 

._1LaTmMw1tOmNrYSeq64O-9, 
._37Fbxce5cuQ_P-21LyOV_w{
    border-radius: 0px !important;
} 

._2x0RglLpha6lx9vdRMkP5r{
    user-select: text !important;
}
/*进入地图UI*/
._3qoatovj5wx7u_YsGoA3A7 picture{
    margin-top: 20px;
}

._2CGySt2UC265XvYttBgcIv{
    margin: 0 auto;
    width: 320px;
    height: 48px;
}

._2mVxdrXf67jd963Jxtey4w{
    display: block !important;
}

/*dialog*/
/*框*/
._1gtnho78cGtBHL1GDfJnrV{
    padding-top: 18px;
    margin: 0px;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    /*background-color: #2e2e2e !important;
    color: #ffffff !important;*/
}
/*叉*/
._1KQJcUeCDm3z8tPu82JszH{
    top: 0px;
    margin: 5px;
    border-radius: 2px;
    filter: brightness(1);
    transition: 0.3s;
}

._1KQJcUeCDm3z8tPu82JszH:active{
    background: #c4c4c4 !important;
}
/*内框*/
._39St8_fsYwVRwyFSvytro0{
    transition: 0.3s;
}

._39St8_fsYwVRwyFSvytro0::-webkit-scrollbar{
    width: 10px;
}
/*选项*/
.lrZBw-mfP6yZMkDwegfob, 
.nCDZF5H3CNEtMlS9XVDAK{
    border-radius: 5px;
    /*background-color: #434343 !important;
    color: #ffffff !important;*/
    transition: 0.3s;
}

.lrZBw-mfP6yZMkDwegfob:active, 
.nCDZF5H3CNEtMlS9XVDAK:active{
    /*background-color: #585858 !important;
    color: #ffffff !important;*/
}
/*标题*/
._2vZg8nyg9WKvLPt_LzK3vp{
    top: 0px !important;
    height: 34px !important;
    border-radius: 10px 0 0 0!important;
}

@keyframes bottom_in48 {
    from {
        bottom: -52px;
        opacity: 0;
    }

    to {
        bottom: 48px;
        opacity: 1;
    }
}

._3BtLXshOjY2OeQtIDvoQJu{
    animation-name: bottom_in48; 
    /*animation-delay: -0.3s;*/
    animation-duration: 0.3s;
    animation-fill-mode: forwards;
}

._3aGw3-pqar_Yp8KbvKxykm, 
._1v6M2D1HEb9Aw-w4opEy1U{
    background-color: var(--color-primary) !important;
}
/*加载_进度*/
._3k7OIcfvhBh9V98DmtGgrs{
    border-radius: 0px !important;
}

._26Qfu88HkC1tYcTTXVUqlg, 
._2Z88Di2LSYaHa4mS8zcix1{
    border-radius: 0px !important;
    background-color: #18cc08 !important;
    transition: 0.5s linear !important;
}

._26Qfu88HkC1tYcTTXVUqlg::before, 
._2Z88Di2LSYaHa4mS8zcix1::before{
    display: none;
}
/*加载动画*/
@keyframes loader_ani {
    from{
        background-position-x: 0;
    }
    to{
        background-position-x: -112px;
    }
}

.loading-img{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDg0ODAzNzQ0MDBfNjUyNTI0M2M.png) !important;
    width: 7px;
    height: 7px;
    transform: scale(5);
    image-rendering: pixelated;
    animation: loader_ani 1s steps(16) infinite;
    background-repeat-x: no-repeat;
    background-repeat-y: no-repeat;
}

/*白色文本*/
._1lrQtT48s_Z_w2NRSkJpNs{
    color: white !important;
}

._3Uol_dJkTI_vubQFgbBKL8, 
.O0YDcucL8Ijk8GL6K78eF, 
._3IIyD_Ok1c1p-X1x337wFk, 
.AttI4RBUX92i5RBBp4Su_, 
._1Og5PcefkRlX9K3AaR7AgN, 
._2SJwAKM8WkZvb36NGSdr3Q, 
._6ujMJzbspvvPKRIDyAm2U, 
._11nuo-1KHrc1vlC_zqicba, 
._3gJsMyv512Nc09Aj8ZCQOT{
    background-color: rgba(0, 0, 0, 0);
    filter: invert(1);
}

._2Mbr-5aH7czpRZSELXj_Qp picture{
    display: none;
}

._2Mbr-5aH7czpRZSELXj_Qp, 
._2CvFjBZMv4Js_aCR9f5Rey, 
._3vyMsvmx8YON_6yC7L-jVz{
    background-image: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDg1OTgyMjk3OThfN2ZhMmQ3MmI.png) !important;
    background-size: 75px 75px !important;
    background-position: center !important;
    filter: brightness(0.5) !important;
    image-rendering: pixelated !important;
    background-repeat: repeat;
}

._4efbnCoQ5_lstHXtwBvMW{
    background-color: rgba(255, 255, 255, 0.1);
}
/*分享二维码*/

._2WdIlI83j95Xpzysb7_71a img{
    image-rendering: pixelated !important;
}

/*控制台位置*/

@media screen and (max-width:500px) and (orientation:portrait){
    ._1o6A4oxCiteMSPmZj5sbs, 
    ._3SAxvJth0CFUwzvW2G9hoh{
        bottom: 57px !important;
        z-index: 100000000 !important;
    }
}
/*输入输出*/
/*控制台图层*/

._104MoaVGcd8pu81_Y33UNi{
    z-index: 2;
}

/*log*/
._327xAA0MaP8ekMUPlEq08p, 
/*bg*/
._3EbU_M4F6lXojGeh_XJfFl{
    color: #a5a5a5 !important;
    background-color: #242424 !important;
    border-bottom: #3d3d3d 1px solid;
}

._327xAA0MaP8ekMUPlEq08p{
    padding-left: 30px !important;
}

._327xAA0MaP8ekMUPlEq08p i{
    display: inline-block;
    content: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfMTEyMzcxMjNfMF8xNzA5MDI4MDYyOTk1X2M4OTE1ZmY3.png);
    position: absolute;
    left: 10px;
    transform: scale(0.8);
    image-rendering: pixelated !important;
}
/*warn*/
._3dRJrGRjpvMBe4rm0YfnC_{
    color: #ffcb6c !important;
    background-color: #332a00 !important;
    border-bottom: #655500 1px solid;
    padding-left: 30px !important;
    min-height: 22px;
}

._3dRJrGRjpvMBe4rm0YfnC_::before{
    display: inline-block;
    content: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDg3OTA2MzA3MjNfYWMwOWVlNzA.png);
    position: absolute;
    left: 10px;
    transform: scale(0.8);
    image-rendering: pixelated !important;
}
/*err*/
._1SMglTGe_j4bIsKHdVPdqo{
    color: #fe8081 !important;
    background-color: #280000 !important;
    border-bottom: #5d0100 1px solid;
    padding-left: 30px !important;
    min-height: 22px;
}

._1SMglTGe_j4bIsKHdVPdqo::before{
    display: inline-block;
    content: url(https://cdn-community.codemao.cn/47/community/d2ViXzMwMDFfODgwODU4MF8wXzE3MDg3OTIyMTQ0MTNfOTkyMzUyNzY.png);
    position: absolute;
    left: 10px;
    transform: scale(0.8);
    image-rendering: pixelated !important;
}
/*not_log*/
._3dRJrGRjpvMBe4rm0YfnC_ i, 
._1SMglTGe_j4bIsKHdVPdqo i{
    display: none !important;
}

/*all*/
._327xAA0MaP8ekMUPlEq08p, 
._3dRJrGRjpvMBe4rm0YfnC_, 
._1SMglTGe_j4bIsKHdVPdqo{
    padding: 3px 0 3px 10px;
    font-family: Menlo,Monaco,Consolas,"Andale Mono","lucida console","Courier New",monospace;
    font-size: 13px;
    text-shadow: none !important;
    position: relative;
    max-width: 100vw;
    overflow: scroll;
}

._327xAA0MaP8ekMUPlEq08p:hover, 
._3dRJrGRjpvMBe4rm0YfnC_:hover, 
._1SMglTGe_j4bIsKHdVPdqo:hover{
    background-color: #081a30 !important;
}
/*log_f*/
._104MoaVGcd8pu81_Y33UNi{
    height: calc((100% - 44px) - 76px) !important;
}

.ewiWP7xeQi2lL41Slo6EY{
    padding: 0px !important;
}

@font-face{font-family:Minecraft;src:url("https://minecraft.fandom.com/media/hydra/fonts/minecraft.eot?#iefix") format('embedded-opentype'),url(https://minecraft.fandom.com/media/hydra/fonts/minecraft.woff) format('woff'),url(https://minecraft.fandom.com/media/hydra/fonts/minecraft.ttf) format('truetype')}

._21KdDmk5Y0xmfwti1iAuvl{
    font-family: minecraft;
}

:root{
    --color-primary: #297eff;
    --color-primary-hover: #297eff;
    --color-primary-press: #1b70f2;
}

</style>
`)
}

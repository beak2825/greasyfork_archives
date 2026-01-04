// ==UserScript==
// @name         LIHKG - CSS Style for old mobile browser 
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  LIHKG CSS Style for old mobile browser 
// @match        https://lihkg.com/*
// @match        https://*.lihkg.com/*
// @icon         https://cdn.lihkg.com/favicon.ico
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/427597/LIHKG%20-%20CSS%20Style%20for%20old%20mobile%20browser.user.js
// @updateURL https://update.greasyfork.org/scripts/427597/LIHKG%20-%20CSS%20Style%20for%20old%20mobile%20browser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(
        `
        @import "https://fonts.googleapis.com/css?family=Ubuntu+Mono";
._208tAU6LsyjP5LKTdcPXD0{
    color:#fbc308
}
.A0jheqYUBHNW93KykXKEH{
    color:#2574a9
}
[data-app-dm] .A0jheqYUBHNW93KykXKEH{
    color:#34aadc
}
.jj_3ZDzjtPixL1b2KTcpS{
    color:#cf000f
}
[data-app-dm] .jj_3ZDzjtPixL1b2KTcpS{
    color:#c0392b
}
._34dVbr5A8khk2N65H9Nl-j{
    align-items:center;
    background:rgba(160,160,160,.5);
    bottom:0;
    display:flex;
    justify-content:center;
    left:0;
    position:fixed;
    right:0;
    -webkit-tap-highlight-color:transparent;
    top:0;
    will-change:opacity;
    z-index:99
}
[data-app-dm] ._34dVbr5A8khk2N65H9Nl-j{
    background:rgba(0,0,0,.5)
}
._27su4Zj_qATokwVdWIbEWB{
    background:#f6f6f6;
    border-radius:4px;
    box-shadow:0 4px 8px rgba(0,0,0,.2);
    display:flex;
    flex-flow:column nowrap;
    margin:0 1rem;
    max-height:80vh;
    overflow:hidden;
    position:relative;
    z-index:2
}
._2nEMQ1Y1BLDUV5OxbX64Pn ._27su4Zj_qATokwVdWIbEWB{
    overflow:auto
}
._27su4Zj_qATokwVdWIbEWB._3ILH1xi7iQLtGrFgUVVWTq{
    border-radius:0;
    height:100%;
    max-height:100%
}
@media(max-width:767px){
    ._27su4Zj_qATokwVdWIbEWB._3ILH1xi7iQLtGrFgUVVWTq{
        height:100%;
        margin:0;
        max-height:none;
        width:100vw
    }
}
[data-app-dm] ._27su4Zj_qATokwVdWIbEWB{
    background:#292827
}
._1nqRVNQ2PyO3vnAwZIISAJ{
    background:#fff;
    border-bottom:1px solid #e0e0e0;
    color:#000;
    display:flex;
    flex-shrink:0;
    height:3rem;
    line-height:3rem;
    overflow:hidden;
    padding:0 1rem;
    position:relative
}
[data-app-dm] ._1nqRVNQ2PyO3vnAwZIISAJ{
    background:#222;
    border-color:#444443;
    color:#fff
}
._2b5VMoBy8yIXlX-wC8v57F{
    flex-grow:1;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
}
._10tWW0o-L-5oSH8lCBl9ai{
    background:inherit;
    box-sizing:content-box;
    cursor:pointer;
    font-size:1rem;
    height:100%;
    line-height:inherit;
    margin-right:-1rem;
    padding:inherit;
    text-align:center;
    width:auto
}
._10tWW0o-L-5oSH8lCBl9ai:hover{
    background:rgba(128,128,128,.1)
}
._27SmIe4FGDNnK7apcCB3W7{
    flex-grow:1;
    -webkit-overflow-scrolling:touch;
    overflow-y:auto
}
._3dbMg7zkkTIVJ5VZ3ygu4-{
    display:flex;
    flex-grow:1;
    overflow:auto;
    padding:1rem
}
[data-app-mb] ._3dbMg7zkkTIVJ5VZ3ygu4-{
    justify-content:center
}
._3dbMg7zkkTIVJ5VZ3ygu4->iframe{
    border:0;
    height:100%;
    width:100%
}
._2c5AwJ_0ePFIYub8OFE97J{
    background:#fff;
    border:0 solid #e0e0e0;
    color:#000;
    display:flex;
    flex-shrink:0;
    height:3rem;
    line-height:3rem;
    position:relative;
    text-decoration:none
}
._2c5AwJ_0ePFIYub8OFE97J a{
    color:inherit;
    cursor:pointer
}
._2c5AwJ_0ePFIYub8OFE97J a:hover{
    text-decoration:none
}
._2c5AwJ_0ePFIYub8OFE97J>*{
    cursor:pointer;
    flex:1 1;
    position:relative;
    text-align:center;
    transition:all .1s ease
}
._2c5AwJ_0ePFIYub8OFE97J>:hover{
    background:rgba(128,128,128,.1)
}
[data-app-dm] ._2c5AwJ_0ePFIYub8OFE97J>:hover{
    background:#3f3f3f
}
._2c5AwJ_0ePFIYub8OFE97J>:before{
    border-left:1px solid #e0e0e0;
    bottom:.75rem;
    content:"";
    left:0;
    position:absolute;
    top:.75rem
}
._2c5AwJ_0ePFIYub8OFE97J>:first-child:before{
    border:0
}
[data-app-dm] ._2c5AwJ_0ePFIYub8OFE97J{
    background:#222;
    border-color:#444443;
    color:#fff
}
[data-app-dm] ._2c5AwJ_0ePFIYub8OFE97J>:before{
    border-color:#444443
}
._2c5AwJ_0ePFIYub8OFE97J._2wLMjV-njYI4BZSNKFJAhk{
    border-bottom-width:1px
}
._2c5AwJ_0ePFIYub8OFE97J._2F7zIQl_1y5nHpDllTwX17{
    border-top-width:1px
}
._3ILH1xi7iQLtGrFgUVVWTq ._2c5AwJ_0ePFIYub8OFE97J._2F7zIQl_1y5nHpDllTwX17{
    box-sizing:content-box;
    padding-bottom:0px;
    padding-bottom:env(safe-area-inset-bottom);
}
@media(max-width:767px){
    ._1nqRVNQ2PyO3vnAwZIISAJ{
        padding:0 1rem
    }
    ._3dbMg7zkkTIVJ5VZ3ygu4-{
        padding:1rem
    }
    ._3ILH1xi7iQLtGrFgUVVWTq ._3dbMg7zkkTIVJ5VZ3ygu4-{
        padding-bottom:calc(1rem + 0px);
        padding-bottom:calc(1rem + env(safe-area-inset-bottom));
    }
    ._2VLKXB6njIWTgXKYQNLOGb{
        height:2.5rem;
        line-height:2.5rem
    }
}
.iuBr2XdzmXPAk4Kf-M6hy{
    display:flex;
    flex-direction:column;
    max-width:480px;
    width:80vw
}
.iuBr2XdzmXPAk4Kf-M6hy textarea{
    resize:none
}
._3K55SP6hi6tAFsbqv-pOO6{
    display:flex;
    flex-direction:row;
    overflow:auto;
    padding:.5rem .8rem
}
._19hDkdhSXmnPJz0bt8qzvP{
    border-radius:50%;
    color:#fff;
    flex-shrink:0;
    font-size:1.5rem;
    height:3rem;
    line-height:3rem;
    margin:0 .65rem 0 0;
    text-align:center;
    width:3rem
}
._19hDkdhSXmnPJz0bt8qzvP:hover{
    text-decoration:none
}
._19hDkdhSXmnPJz0bt8qzvP._3z0HGW1g2WdmyzPxoDhcac{
    background:#7a7a7a
}
._19hDkdhSXmnPJz0bt8qzvP._3OjKH0P9y1a72FRWKYBROz{
    background:#08c
}
._19hDkdhSXmnPJz0bt8qzvP.k4d-Ps1X7nt48pPc0hvow{
    background:#009688
}
._19hDkdhSXmnPJz0bt8qzvP.WUN0Nv11PmQ2xt56UOt_p{
    background:#4761a6
}
._19hDkdhSXmnPJz0bt8qzvP._2-J01Smj_SYqtZj82RpN5S{
    background:#00aceb
}
._20ESiZXbmijY8ypNeIoOm_{
    background:#fff;
    border-bottom:.5px solid #d9d9d9;
    flex-shrink:0;
    font-size:1rem;
    height:3rem;
    line-height:3rem;
    max-width:100%;
    position:relative
}
[data-app-dm] ._20ESiZXbmijY8ypNeIoOm_{
    background:#222;
    border-color:#3b3a39
}
[data-app-of] ._20ESiZXbmijY8ypNeIoOm_{
    background:0 0;
    border:0;
    height:1.6rem;
    left:3rem;
    line-height:1.6rem;
    margin:0;
    position:fixed;
    top:calc(1.4rem + 1px);
    transform:translateZ(0);
    z-index:6
}
[data-app-of][data-app-tv] ._20ESiZXbmijY8ypNeIoOm_{
    display:none
}
.zxtkeyW7l_nNi-JgkAUIv{
    display:flex;
    flex-wrap:nowrap;
    list-style:none;
    margin:0;
    padding:0;
    white-space:nowrap
}
._12O_FXWNvoGcibQa6yqkPA{
    display:inline-block;
    flex-grow:1;
    flex-shrink:0
}
[data-app-of] ._12O_FXWNvoGcibQa6yqkPA{
    border:0;
    flex-basis:auto;
    font-size:.85rem;
    margin-right:1rem
}
[data-app-of] ._12O_FXWNvoGcibQa6yqkPA a{
    color:#ececec;
    height:inherit;
    line-height:inherit
}
[data-app-of] ._12O_FXWNvoGcibQa6yqkPA a:hover{
    color:#fff
}
[data-app-of] ._12O_FXWNvoGcibQa6yqkPA._1PdImYJBCsN8lH0MB4tnqV a{
    background:#f7f7f7;
    color:#217347
}
._12O_FXWNvoGcibQa6yqkPA._1PdImYJBCsN8lH0MB4tnqV a{
    color:#000
}
[data-app-dm] ._12O_FXWNvoGcibQa6yqkPA._1PdImYJBCsN8lH0MB4tnqV a{
    color:#fbc308
}
._12O_FXWNvoGcibQa6yqkPA._1PdImYJBCsN8lH0MB4tnqV a:after{
    background:#fbc308;
    border-radius:2px;
    bottom:-.5px;
    content:"";
    height:1.5px;
    left:0;
    position:absolute;
    transform:scaleX(.8);
    width:100%;
    z-index:1
}
[data-app-of] ._12O_FXWNvoGcibQa6yqkPA._1PdImYJBCsN8lH0MB4tnqV a:after{
    display:none
}
._12O_FXWNvoGcibQa6yqkPA a{
    color:#aaa;
    display:block;
    height:3rem;
    line-height:3rem;
    padding:0 .8rem;
    position:relative;
    text-align:center
}
._12O_FXWNvoGcibQa6yqkPA a:hover{
    text-decoration:none
}
[data-app-ho]:not([data-app-of]) ._12O_FXWNvoGcibQa6yqkPA a:hover{
    color:#000
}
[data-app-ho][data-app-dm] ._12O_FXWNvoGcibQa6yqkPA a:hover{
    color:#fbc308
}
._12O_FXWNvoGcibQa6yqkPA select{
    -webkit-appearance:none;
    -moz-appearance:none;
    appearance:none;
    border:0;
    bottom:0;
    cursor:pointer;
    height:100%!important;
    left:0;
    opacity:0;
    position:absolute;
    right:0;
    top:0;
    width:100%!important
}
._2Qyf3csfcRSvVsB1PcR5f6{
    background:#fff;
    content:"";
    height:1px;
    left:0;
    margin-top:-1px;
    position:fixed;
    top:3rem;
    z-index:5
}
body:not([data-app-sm]):not([data-app-mb]) ._2Qyf3csfcRSvVsB1PcR5f6{
    display:none
}
[data-app-sm]:not([data-app-mb]) ._2Qyf3csfcRSvVsB1PcR5f6{
    max-width:479px;
    min-width:299px;
    width:calc(30% - 1px)
}
@media(min-width:1280px){
    [data-app-cx] ._2Qyf3csfcRSvVsB1PcR5f6{
        left:calc(50vw - 640px);
        max-width:none!important;
        min-width:auto!important;
        width:383px!important
    }
}
[data-app-mb] ._2Qyf3csfcRSvVsB1PcR5f6{
    width:100%
}
[data-app-dm] ._2Qyf3csfcRSvVsB1PcR5f6{
    background:#222
}
._2SVsmVSmKfAWFlZGk_5_L8{
    background:#fff;
    border:1px solid #d9d9d9;
    border-radius:4px;
    color:inherit;
    font:inherit;
    height:2.25rem;
    margin:.4rem;
    min-width:15rem;
    padding:.4em;
    position:relative
}
._2SVsmVSmKfAWFlZGk_5_L8:focus{
    outline:1px solid #fbc308
}
[data-app-dm] ._2SVsmVSmKfAWFlZGk_5_L8{
    background:#151515!important;
    border-color:#3b3a39!important
}
[data-app-dm] ._2SVsmVSmKfAWFlZGk_5_L8:focus{
    outline:1px solid rgba(251,195,8,.6)
}
._2SVsmVSmKfAWFlZGk_5_L8:disabled{
    cursor:not-allowed;
    opacity:.5
}
._3M-vKUeUliNoZiNHa9Eb5F{
    -webkit-overflow-scrolling:touch;
    -ms-overflow-style:-ms-autohiding-scrollbar;
    overflow-x:hidden;
    resize:vertical;
    vertical-align:top
}
._2UIqN91bw4EYCS4TGFz19R{
    cursor:pointer;
    display:flex
}
._2UIqN91bw4EYCS4TGFz19R>select{
    -webkit-appearance:none;
    -moz-appearance:none;
    appearance:none;
    border:0;
    bottom:0;
    cursor:pointer;
    height:100%!important;
    left:0;
    opacity:0;
    position:absolute;
    right:0;
    top:0;
    width:100%!important
}
._2drZNBHt6Bl5RefoNQnRuQ{
    background:rgba(128,128,128,.2);
    border-radius:1rem;
    cursor:pointer;
    display:inline-block;
    height:1.5rem;
    margin-left:1rem;
    position:relative;
    transition:all .2s ease-out;
    width:3rem
}
._2drZNBHt6Bl5RefoNQnRuQ._31jibBLy2jbrUM_9tsuJLF{
    background:#fbc308
}
._2drZNBHt6Bl5RefoNQnRuQ>._1vjVW2rbZdfog0-OiZiY_B{
    background:#fff;
    border-radius:1rem;
    box-shadow:1px 2px 6px -1px rgba(0,0,0,.3);
    height:1.3rem;
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    width:1.3rem
}
._2drZNBHt6Bl5RefoNQnRuQ>._1vjVW2rbZdfog0-OiZiY_B._31jibBLy2jbrUM_9tsuJLF{
    box-shadow:-3px 2px 6px -1px rgba(0,0,0,.3)
}
._2drZNBHt6Bl5RefoNQnRuQ._1gja7VDiu2-gBZwXAb6XVN{
    height:.6rem;
    margin:0;
    width:1.2rem
}
._2drZNBHt6Bl5RefoNQnRuQ._1gja7VDiu2-gBZwXAb6XVN>._1vjVW2rbZdfog0-OiZiY_B{
    height:.5rem;
    width:.5rem
}
input[type=range]{
    -webkit-appearance:none;
    background:0 0;
    margin:0;
    width:100%
}
input[type=range]:focus{
    outline:0
}
input[type=range]::-webkit-slider-thumb{
    -webkit-appearance:none;
    background:#fbc308;
    border:0;
    border-radius:50%;
    box-shadow:1px 2px 6px -1px rgba(0,0,0,.3);
    cursor:pointer;
    height:18px;
    margin-top:-8px;
    width:18px
}
input[type=range]::-moz-range-thumb{
    background:#fbc308;
    border:0;
    border-radius:50%;
    box-shadow:1px 2px 6px -1px rgba(0,0,0,.3);
    cursor:pointer;
    height:18px;
    width:18px
}
input[type=range]::-ms-thumb{
    background:#fbc308;
    border:0;
    border-radius:50%;
    box-shadow:1px 2px 6px -1px rgba(0,0,0,.3);
    cursor:pointer;
    height:18px;
    width:18px
}
input[type=range]::-webkit-slider-runnable-track{
    background:rgba(128,128,128,.5);
    border:0;
    border-radius:3px;
    cursor:pointer;
    height:2px;
    width:100%
}
input[type=range]::-moz-range-track{
    background:rgba(128,128,128,.5);
    border:0;
    border-radius:3px;
    cursor:pointer;
    height:2px;
    width:100%
}
input[type=range]::-ms-track{
    background:0 0;
    border-color:transparent;
    border-width:9px 0;
    color:transparent;
    cursor:pointer;
    height:2px;
    width:100%
}
input[type=range]::-ms-fill-lower,input[type=range]::-ms-fill-upper{
    background:rgba(128,128,128,.5);
    border:0;
    border-radius:3
}
._3hHXxEPS5rgGuknJVH34XS{
    cursor:pointer;
    display:flex;
    font-size:.9em
}
._3hHXxEPS5rgGuknJVH34XS>div{
    align-items:center;
    background:#fff;
    border:1px solid #e0e0e0;
    color:#888;
    display:flex;
    flex-grow:1;
    justify-content:center;
    margin-right:-1px;
    padding:3px 5px;
    position:relative;
    text-align:center
}
[data-app-dm] ._3hHXxEPS5rgGuknJVH34XS>div{
    background:#222;
    border-color:#444443
}
._3hHXxEPS5rgGuknJVH34XS>div:hover{
    background:#eee
}
[data-app-dm] ._3hHXxEPS5rgGuknJVH34XS>div:hover{
    background:#343332
}
._3hHXxEPS5rgGuknJVH34XS>div:first-child{
    border-bottom-left-radius:4px;
    border-top-left-radius:4px
}
._3hHXxEPS5rgGuknJVH34XS>div:last-child{
    border-bottom-right-radius:4px;
    border-top-right-radius:4px;
    margin-right:0
}
._3hHXxEPS5rgGuknJVH34XS>div._36MywmoDUXjg0XNpoKMYEL{
    background:#fbc308!important;
    color:#000;
    z-index:1
}
[data-app-dm] ._3hHXxEPS5rgGuknJVH34XS>div._36MywmoDUXjg0XNpoKMYEL{
    border-color:#fbc308
}
._3qnrLtM0rpBibDRMjEwUVJ{
    cursor:not-allowed;
    opacity:.35
}
._39HZdiaaYG298Upj1zG7uD{
    list-style:none;
    margin:1rem 0 0;
    min-width:300px;
    padding:0;
    width:100%
}
._39HZdiaaYG298Upj1zG7uD:last-child{
    margin-bottom:1rem
}
@-webkit-keyframes J-dfl7KtO8XXGZaIt6_I_{
    0%{
        background:#f6ebc5
    }
    to{
        background:0 0
    }
}
@keyframes J-dfl7KtO8XXGZaIt6_I_{
    0%{
        background:#f6ebc5
    }
    to{
        background:0 0
    }
}
@-webkit-keyframes _2qgnXKSu2IWmXM3B5QunIp{
    0%{
        background:#000
    }
    to{
        background:0 0
    }
}
@keyframes _2qgnXKSu2IWmXM3B5QunIp{
    0%{
        background:#000
    }
    to{
        background:0 0
    }
}
._1RL1LDMdfBS-OSJAqzcNQ9{
    display:block;
    padding:.8rem 1rem
}
._1RL1LDMdfBS-OSJAqzcNQ9+._39HZdiaaYG298Upj1zG7uD{
    margin-top:0
}
._1RL1LDMdfBS-OSJAqzcNQ9[data-highlight]{
    -webkit-animation:J-dfl7KtO8XXGZaIt6_I_ 1s ease;
    animation:J-dfl7KtO8XXGZaIt6_I_ 1s ease
}
[data-app-dm] ._1RL1LDMdfBS-OSJAqzcNQ9[data-highlight]{
    -webkit-animation:_2qgnXKSu2IWmXM3B5QunIp 1s ease;
    animation:_2qgnXKSu2IWmXM3B5QunIp 1s ease
}
._2NVUL5Ow1xg006Qaf5T5u-,._2SqBoIdr5sJFLnuXp8xsqy a{
    align-items:center;
    background:#fff;
    color:#333;
    display:flex;
    justify-content:space-between;
    padding:.8rem 1rem;
    position:relative
}
[data-app-dm] ._2NVUL5Ow1xg006Qaf5T5u-,[data-app-dm] ._2SqBoIdr5sJFLnuXp8xsqy a{
    background:#343332;
    color:#fff
}
._2NVUL5Ow1xg006Qaf5T5u-,._2SqBoIdr5sJFLnuXp8xsqy{
    border-bottom:1px solid #e0e0e0
}
[data-app-dm] ._2NVUL5Ow1xg006Qaf5T5u-,[data-app-dm] ._2SqBoIdr5sJFLnuXp8xsqy{
    border-bottom:1px solid #444443
}
._2NVUL5Ow1xg006Qaf5T5u-:first-child,._2SqBoIdr5sJFLnuXp8xsqy:first-child{
    border-top:1px solid #e0e0e0
}
[data-app-dm] ._2NVUL5Ow1xg006Qaf5T5u-:first-child,[data-app-dm] ._2SqBoIdr5sJFLnuXp8xsqy:first-child{
    border-top:1px solid #444443
}
._2SqBoIdr5sJFLnuXp8xsqy a{
    cursor:pointer
}
._2SqBoIdr5sJFLnuXp8xsqy a:hover{
    background:#fafafa;
    text-decoration:none
}
[data-app-dm] ._2SqBoIdr5sJFLnuXp8xsqy a:hover{
    background:#3f3f3f
}
._2SqBoIdr5sJFLnuXp8xsqy a>[class^=i-]{
    color:#aaa;
    font-size:1.5em;
    margin-left:.5rem
}
._2SqBoIdr5sJFLnuXp8xsqy a._36MywmoDUXjg0XNpoKMYEL{
    color:#fbc308
}
._2fdMG3X65eVu6DlRI2GScw{
    align-items:center;
    display:flex;
    justify-content:center;
    width:3rem
}
._1YudnAJBnPkIZlHeuyoK15{
    -webkit-animation:yA-80L-n1zmPQkc2QXZgG 1.2s steps(12) infinite;
    animation:yA-80L-n1zmPQkc2QXZgG 1.2s steps(12) infinite;
    background-image:url(https://cdn.lihkg.com/static/2105289671-86ixn/media/loader.png);
    background-size:cover;
    height:1.5rem;
    width:1.5rem
}
@-webkit-keyframes yA-80L-n1zmPQkc2QXZgG{
    0%{
        transform:rotate(0)
    }
    to{
        transform:rotate(1turn)
    }
}
@keyframes yA-80L-n1zmPQkc2QXZgG{
    0%{
        transform:rotate(0)
    }
    to{
        transform:rotate(1turn)
    }
}
._3p0b8h9rJohRoLITXI53ig{
    bottom:0;
    box-shadow:0 -5px 54px 5px rgba(0,0,0,.2);
    margin:0;
    padding-bottom:0px;
    padding-bottom:env(safe-area-inset-bottom);
    position:absolute;
    width:100vw
}
._3p0b8h9rJohRoLITXI53ig ._2Yw48okxLfQC-6AeEAgXbe{
    align-items:center;
    display:flex;
    flex-direction:column;
    width:90vw
}
._3p0b8h9rJohRoLITXI53ig ._2Yw48okxLfQC-6AeEAgXbe ._2fiVD8ts5YYoFjzsmDZr0S{
    align-items:center;
    display:flex;
    flex-direction:column;
    margin-bottom:1rem;
    width:100%
}
._3p0b8h9rJohRoLITXI53ig ._2Yw48okxLfQC-6AeEAgXbe ._2fiVD8ts5YYoFjzsmDZr0S .nH71HR2P_-Xd5lB5LeL48{
    display:flex;
    justify-content:space-between;
    margin:1rem 0;
    width:100%
}
._3p0b8h9rJohRoLITXI53ig ._2Yw48okxLfQC-6AeEAgXbe ._2fiVD8ts5YYoFjzsmDZr0S .nH71HR2P_-Xd5lB5LeL48 span{
    text-align:center;
    width:15%
}
._3p0b8h9rJohRoLITXI53ig ._2Yw48okxLfQC-6AeEAgXbe ._1PcXqYmAGv0h1EQjWf5ipH{
    display:flex;
    flex-direction:row;
    padding:.5rem 1rem;
    width:100%
}
._3p0b8h9rJohRoLITXI53ig ._2Yw48okxLfQC-6AeEAgXbe ._1PcXqYmAGv0h1EQjWf5ipH button{
    background:#e8e8e8;
    border-radius:7px;
    font-size:1rem;
    height:2.5rem;
    width:100%
}
[data-app-dm] ._3p0b8h9rJohRoLITXI53ig ._2Yw48okxLfQC-6AeEAgXbe ._1PcXqYmAGv0h1EQjWf5ipH button{
    background:#3f3f3f
}
._2qcU_9jr5qDReJELIVUwtX{
    padding:.8rem 1rem
}
._2NN6My4jKn3uId__keqMVj{
    color:#fbc308;
    text-decoration:none
}
._33Yx__Bk0A7yb-XTKkkJdI{
    display:flex;
    flex-grow:1;
    justify-content:space-between
}
._3sq0j2DArzJOA9tbFVLoby{
    flex:1 1;
    margin-left:2rem
}
.fXcWXcYtSH1vUM7RyKBF7{
    height:1rem;
    margin:0 .3125rem;
    position:relative
}
._19yYYxIoUx74oFZqDvuHQS,._2d6ab_GyKEfTGvq60i87Oe,._12YjS6ZkZ-2rDG9jxmBg49,.e3wQg2xi1GUkblD6yU_kI,._1uBNonsPAFC6Gt0xibN3XG{
    font-size:.8rem;
    position:absolute;
    top:0;
    transform:translateX(-50%);
    white-space:nowrap
}
._12YjS6ZkZ-2rDG9jxmBg49{
    left:25%
}
._2d6ab_GyKEfTGvq60i87Oe{
    left:50%
}
._19yYYxIoUx74oFZqDvuHQS{
    left:75%
}
.e3wQg2xi1GUkblD6yU_kI{
    left:100%
}
._PaHRmQfdNbVla13Qt8Ch{
    color:#999;
    font-size:.8rem;
    text-align:center;
    width:100%
}
@media(max-width:767px){
    ._2xap9O6o5icT3NpwDHx3rW{
        display:none!important
    }
}
._33r1FGqGJZF-fM1VZm7mhN{
    color:#fbc308;
    display:block;
    margin:0 auto;
    padding:1em 0;
    text-align:center
}
._15Y0ebHstpjSjX2xCZCZ8U{
    align-items:center;
    display:flex;
    flex-direction:column;
    justify-content:center;
    position:fixed;
    z-index:9
}
._15Y0ebHstpjSjX2xCZCZ8U,._15Y0ebHstpjSjX2xCZCZ8U ._3ENsL6YTH5utnKciHKGFd_{
    bottom:0;
    left:0;
    right:0;
    top:0
}
._15Y0ebHstpjSjX2xCZCZ8U ._3ENsL6YTH5utnKciHKGFd_{
    background:rgba(0,0,0,.5);
    position:absolute;
    z-index:-1
}
._15Y0ebHstpjSjX2xCZCZ8U ._3ENsL6YTH5utnKciHKGFd_>i{
    display:none
}
[data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._3ENsL6YTH5utnKciHKGFd_{
    background:rgba(0,0,0,.7)
}
._15Y0ebHstpjSjX2xCZCZ8U ._34nVMRZFMW1GWWAbT9EIza{
    background:#fff;
    border-bottom:1px solid #f2f2f2;
    box-sizing:content-box;
    display:flex;
    justify-content:flex-end
}
[data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._34nVMRZFMW1GWWAbT9EIza{
    background:#222;
    border-bottom:1px solid #3b3a39
}
._15Y0ebHstpjSjX2xCZCZ8U ._34nVMRZFMW1GWWAbT9EIza,._15Y0ebHstpjSjX2xCZCZ8U ._34nVMRZFMW1GWWAbT9EIza .zcEinSkC-o0d0G7_NVOA8,._15Y0ebHstpjSjX2xCZCZ8U ._34nVMRZFMW1GWWAbT9EIza .zcEinSkC-o0d0G7_NVOA8>*{
    align-items:center;
    display:flex;
    height:3rem
}
._15Y0ebHstpjSjX2xCZCZ8U ._34nVMRZFMW1GWWAbT9EIza>.zcEinSkC-o0d0G7_NVOA8>div{
    cursor:pointer;
    font-size:1.2rem;
    justify-content:center;
    width:3rem
}
._15Y0ebHstpjSjX2xCZCZ8U ._34nVMRZFMW1GWWAbT9EIza>.zcEinSkC-o0d0G7_NVOA8>div:hover{
    background:#f2f2f2
}
[data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._34nVMRZFMW1GWWAbT9EIza>.zcEinSkC-o0d0G7_NVOA8>div:hover{
    background:#333
}
._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj,._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT{
    width:100%
}
._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj{
    height:100%;
    left:50%;
    max-width:800px;
    pointer-events:none;
    position:absolute;
    top:0;
    transform:translateX(-50%)
}
._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B{
    cursor:pointer;
    display:flex;
    flex-direction:column;
    height:100%;
    justify-content:center;
    pointer-events:all;
    position:absolute;
    width:4rem
}
._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B:first-child{
    left:0
}
._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B:first-child:hover>span[class*=i-]:before{
    background-position-y:top;
    transition:all .6s cubic-bezier(0,0,.23,1)
}
._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B:last-child{
    right:0
}
._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B:last-child:hover>span[class*=i-]:before{
    background-position-y:top;
    transition:all .6s cubic-bezier(0,0,.23,1)
}
._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B>span{
    align-items:center;
    display:flex;
    font-size:4rem;
    height:4rem;
    justify-content:center;
    pointer-events:all;
    text-align:center;
    width:4rem
}
._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B>span[class*=i-]:before{
    -webkit-background-clip:text;
    background-clip:text;
    background-image:linear-gradient(0deg,#c2c2c2,#c2c2c2 50%,#fff 0);
    background-position:bottom;
    background-size:100% 200%;
    cursor:pointer;
    -webkit-text-fill-color:transparent
}
._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT{
    height:100%;
    max-width:calc(800px - 8rem);
    padding:0
}
._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT._1gZ8LwWAe_mzEgEwWvXVx5{
    height:auto
}
._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT._1gZ8LwWAe_mzEgEwWvXVx5 ._3cD6jss2DikeGo9amwpiZm{
    background:0 0;
    color:#ddd
}
._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._3cD6jss2DikeGo9amwpiZm{
    background:#f6f6f6;
    height:100%;
    max-height:calc(100vh - 3rem);
    -webkit-overflow-scrolling:touch;
    overflow-x:hidden;
    position:relative
}
._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._3cD6jss2DikeGo9amwpiZm::-webkit-scrollbar-thumb{
    background-color:#e0e0e0
}
[data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._3cD6jss2DikeGo9amwpiZm::-webkit-scrollbar-thumb{
    background-color:#454545
}
[data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._3cD6jss2DikeGo9amwpiZm{
    background:#151515
}
._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._3cD6jss2DikeGo9amwpiZm>div+div{
    margin-top:.5rem
}
._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._3cD6jss2DikeGo9amwpiZm ._3_tW300rfj7ee2yy3jN3oy{
    align-items:center;
    display:flex;
    height:2rem;
    justify-content:center;
    margin:.5rem 0
}
._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._3cD6jss2DikeGo9amwpiZm ._3_tW300rfj7ee2yy3jN3oy ._2q1rGXUQo9KcexNpzzaPst{
    align-items:center;
    cursor:pointer;
    display:flex
}
[data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._3cD6jss2DikeGo9amwpiZm ._3_tW300rfj7ee2yy3jN3oy{
    color:#fbc308
}
._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._2iG85uplmSJc9xq0vCekn{
    max-height:200px;
    overflow:hidden;
    position:relative
}
._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._2iG85uplmSJc9xq0vCekn:after{
    background:linear-gradient(180deg,rgba(255,255,255,0) 0,rgba(255,255,255,.1) 1%,rgba(255,255,255,.7) 50%,rgba(255,255,255,.95) 80%,#fff);
    bottom:0;
    content:"";
    height:100%;
    position:absolute;
    width:100%
}
[data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._2iG85uplmSJc9xq0vCekn:after{
    background:linear-gradient(180deg,rgba(34,34,34,0) 0,rgba(34,34,34,.1) 1%,rgba(34,34,34,.7) 50%,rgba(34,34,34,.95) 80%,#222)
}
.KPI_1lbFROODRAQytoPRW{
    align-items:center;
    cursor:pointer;
    display:flex;
    flex-direction:column;
    font-size:.8rem;
    font-weight:700;
    height:200px;
    justify-content:flex-end;
    left:0;
    line-height:.9rem;
    padding:1rem 0;
    position:absolute;
    top:0;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    width:100%;
    z-index:10
}
.KPI_1lbFROODRAQytoPRW>i{
    font-size:1.2rem
}
[data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B>span[class*=i-]:before{
    -webkit-background-clip:text;
    background-clip:text;
    background-image:linear-gradient(0deg,#999,#999 50%,#fbc308 0);
    background-position-y:100%;
    background-size:100% 200%;
    cursor:pointer;
    -webkit-text-fill-color:transparent
}
[data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT._1gZ8LwWAe_mzEgEwWvXVx5{
    height:auto
}
[data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT._1gZ8LwWAe_mzEgEwWvXVx5 ._3cD6jss2DikeGo9amwpiZm{
    background:0 0
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U{
    -webkit-backdrop-filter:blur(2px);
    backdrop-filter:blur(2px);
    background:rgba(0,0,0,.5)
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._3ENsL6YTH5utnKciHKGFd_{
    background:#fff;
    border-bottom:1px solid #f2f2f2;
    display:inline-block;
    height:100%;
    opacity:.1;
    z-index:-9
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._3ENsL6YTH5utnKciHKGFd_>i{
    align-items:center;
    color:#000;
    display:flex;
    font-size:1.5rem;
    height:3rem;
    justify-content:center;
    position:absolute;
    right:0;
    top:0;
    width:3rem
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT{
    max-width:100%;
    padding:0
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._3cD6jss2DikeGo9amwpiZm{
    padding-bottom:calc(3.5rem + 1px)
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT ._34nVMRZFMW1GWWAbT9EIza{
    display:flex;
    justify-content:flex-end
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT._1gZ8LwWAe_mzEgEwWvXVx5{
    height:auto
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._2lZuKUyyBIXiZ1Ynp5M1YT._1gZ8LwWAe_mzEgEwWvXVx5 ._34nVMRZFMW1GWWAbT9EIza{
    display:none
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj{
    background:#fff;
    border-top:1px solid #f2f2f2;
    bottom:0;
    color:#000;
    height:3rem;
    height:calc(3rem + env(safe-area-inset-bottom));
    height:calc(3rem + constant(safe-area-inset-bottom));
    left:0;
    pointer-events:all;
    top:auto;
    transform:none;
    z-index:5
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B{
    flex-direction:row;
    padding-bottom:0px;
    padding-bottom:env(safe-area-inset-bottom);
    width:50%
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B:first-child{
    left:0
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B:last-child{
    right:0
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B>span[class*=i-]{
    font-size:2.5rem;
    height:100%;
    transform:none;
    width:100%
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B>span[class*=i-]:before{
    background:0 0;
    color:#000;
    -webkit-text-fill-color:#000;
    transform:rotate(-90deg)
}
[data-app-mb] ._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B>span[class*=i-]:active{
    background:#ddd
}
._2UifokvIV_bTB-DkiX5YvY{
    align-items:center;
    display:flex;
    height:4rem;
    justify-content:center;
    margin:0
}
[data-app-mb][data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._3ENsL6YTH5utnKciHKGFd_{
    background:#222;
    border-bottom:1px solid #3b3a39
}
[data-app-mb][data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._3ENsL6YTH5utnKciHKGFd_>i{
    color:#fff
}
[data-app-mb][data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._3ENsL6YTH5utnKciHKGFd_>i:hover{
    background:#3b3a39
}
[data-app-mb][data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj{
    background:#000;
    border-top:1px solid #3b3a39
}
[data-app-mb][data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B>span[class*=i-]:before{
    background:0 0;
    box-shadow:0 0 0 1px #424242;
    box-shadow:0 0;
    color:#fff;
    -webkit-text-fill-color:#fff
}
[data-app-mb][data-app-dm] ._15Y0ebHstpjSjX2xCZCZ8U ._3JZS5NYIoxLyf_0hUKuQjj ._10gzFABm8AANm1DFN_JC6B>span[class*=i-]:active{
    background:0 0
}
.jTa0SojOCOVaCTwTFXLKB{
    margin-top:.5rem;
    position:relative;
    text-align:center
}
.jTa0SojOCOVaCTwTFXLKB>iframe{
    background-color:#e7e7e7;
    border:0;
    left:0;
    position:relative;
    top:0;
    width:100%
}
[data-app-dm] .jTa0SojOCOVaCTwTFXLKB{
    opacity:.8
}
[data-app-dm] .jTa0SojOCOVaCTwTFXLKB>iframe{
    background-color:#000
}
._3ML0zNI6K-Zjs8g8PWcKCg{
    align-items:center;
    display:flex;
    flex:1 1;
    overflow:hidden
}
._3tR6NDkValpMjeKjOCjD0Q{
    border-radius:50%;
    margin-right:1em;
    width:3em
}
._3v5NUT-KlcrOx2CQ4vs6bp{
    flex:1 1;
    overflow:hidden
}
._3NnbV76wh8rShVScMo-RVe{
    align-items:center;
    display:flex
}
._3Ow5DfSNT-Mp87SIhvmhoG{
    overflow:hidden;
    text-overflow:ellipsis
}
._3Ow5DfSNT-Mp87SIhvmhoG,._1_fTAwDn_d02sdRYxgdfuw{
    display:inline-block;
    vertical-align:middle
}
._1_fTAwDn_d02sdRYxgdfuw{
    background:#fbc308;
    border-radius:4px;
    color:#333;
    font-size:.5rem;
    letter-spacing:2px;
    margin-left:.4rem;
    padding:3px 5px
}
._2Hs39XbjHYdfby9bJiuD2T{
    color:#fbc308;
    margin-left:.3rem
}
.h9O2_k8EZbTygW2Ofq7HE{
    color:#c0392b!important
}
[data-app-dm] .h9O2_k8EZbTygW2Ofq7HE{
    color:#f66!important
}
._1yAXfO3dZkH0uCuEvbkFcz{
    align-items:center;
    display:flex
}
._1yAXfO3dZkH0uCuEvbkFcz,._21a_QlkB3ws7yQL1WnoMBy{
    height:20px;
    margin:3px 0
}
._21a_QlkB3ws7yQL1WnoMBy{
    background:#ddd;
    border-radius:4px;
    cursor:pointer;
    padding:2px 6px;
    position:relative;
    z-index:2
}
._21a_QlkB3ws7yQL1WnoMBy:hover{
    background:#ccc
}
[data-app-dm] ._21a_QlkB3ws7yQL1WnoMBy{
    background:#666
}
[data-app-dm] ._21a_QlkB3ws7yQL1WnoMBy:hover{
    background:#777
}
._2RNDMMnowJO8uot3K7jacH{
    margin:1rem 0
}
._1cL40C4OgkO-PXipfD9-M_{
    display:flex
}
._1cL40C4OgkO-PXipfD9-M_>span{
    color:#888
}
._2PPIut8-dmhoE9cLNQLkQK{
    color:#c0392b!important;
    justify-content:center!important
}
._2qRn88KexjMSvs7TsuvbH2{
    border-radius:6px;
    color:#c0392b;
    cursor:pointer;
    padding:6px 10px;
    transition:background-color .1s ease-out
}
._2qRn88KexjMSvs7TsuvbH2:hover{
    background:rgba(231,76,60,.1)
}
._3glMo7S10UkzBbsKQHisP7{
    color:#999;
    font-size:.8rem
}
._68D0cdt7DvJyIu5nLAk31{
    min-width:300px;
    padding:.8rem 1rem
}
._1C3ySCD8OChrsY__dc6xGp{
    height:60vh;
    overflow-y:hidden;
    position:relative;
    width:23rem
}
[data-app-mb] ._1C3ySCD8OChrsY__dc6xGp{
    height:calc(100vh - 3rem);
    width:100vw
}
._3Cd76gyNJ-FQa0VIv9iBeC{
    align-items:center;
    background:#fff;
    border-bottom:1px solid #e0e0e0;
    border-top:1px solid #e0e0e0;
    display:flex;
    height:3rem;
    margin:.5rem 0;
    padding:.3rem 1rem .3rem 0
}
._3Cd76gyNJ-FQa0VIv9iBeC input{
    border:none;
    flex-grow:1;
    font-size:1rem;
    padding:0 1rem
}
._3Cd76gyNJ-FQa0VIv9iBeC input i{
    font-size:1.1rem
}
._3Cd76gyNJ-FQa0VIv9iBeC input:focus{
    outline:none
}
._3Cd76gyNJ-FQa0VIv9iBeC button{
    background:rgba(128,128,128,.2);
    border-radius:1rem;
    cursor:pointer;
    font-size:1.4rem;
    height:1.8rem;
    line-height:1.8rem;
    transition:all .1s ease-in;
    width:1.8rem
}
._3Cd76gyNJ-FQa0VIv9iBeC button:hover{
    background:#fbc308
}
[data-app-dm] ._3Cd76gyNJ-FQa0VIv9iBeC{
    background:#222;
    border-bottom:1px solid #444443;
    border-top:1px solid #444443
}
[data-app-dm] ._3Cd76gyNJ-FQa0VIv9iBeC input{
    background:#222;
    color:#fff
}
[data-app-dm] ._3Cd76gyNJ-FQa0VIv9iBeC button{
    background:#fbc308;
    color:#222
}
._2IUy1jWM51ht5tTW6Wq0jB{
    display:flex;
    flex-direction:column;
    height:60vh;
    overflow-y:hidden;
    position:relative;
    width:30rem
}
[data-app-mb] ._2IUy1jWM51ht5tTW6Wq0jB{
    height:calc(100vh - 3rem);
    width:100vw
}
._2IUy1jWM51ht5tTW6Wq0jB ul li{
    cursor:pointer
}
._2w3TfmbQhP_SyddonMiDPm{
    display:flex;
    flex-direction:column;
    max-height:70vh;
    overflow-y:auto;
    position:relative;
    width:24rem
}
[data-app-mb] ._2w3TfmbQhP_SyddonMiDPm{
    height:calc(100vh - 3rem - 1px)!important;
    max-height:calc(100vh - 3rem - 1px)!important;
    width:100vw
}
._2w3TfmbQhP_SyddonMiDPm ._1iO7k7NlnU02ILKdtuMU8d{
    color:#888;
    font-size:1rem;
    margin:1rem 0 2.5rem;
    text-align:center
}
._2w3TfmbQhP_SyddonMiDPm ._2IWQhjA5p8oV52XogtrjSR{
    border-bottom:1px solid #e0e0e0
}
[data-app-dm] ._2w3TfmbQhP_SyddonMiDPm ._2IWQhjA5p8oV52XogtrjSR{
    border-bottom:1px solid #444443
}
._3GR-a0AGWJhEkNvWUle3ky{
    align-items:center;
    background:#fff;
    border-bottom:1px solid #e0e0e0;
    border-top:1px solid #e0e0e0;
    display:flex;
    height:3rem;
    margin:.5rem 0 0;
    padding:.3rem 1rem .3rem 0
}
._3GR-a0AGWJhEkNvWUle3ky ._20V6q9Cvpesrb9nAN-sdWJ{
    color:#aaa;
    margin-left:1rem
}
._3GR-a0AGWJhEkNvWUle3ky ._20V6q9Cvpesrb9nAN-sdWJ i{
    font-size:1.3rem
}
._3GR-a0AGWJhEkNvWUle3ky input{
    border:none;
    flex-grow:1;
    font-size:1rem;
    padding:0 1rem
}
._3GR-a0AGWJhEkNvWUle3ky input:focus{
    outline:none
}
._3GR-a0AGWJhEkNvWUle3ky button{
    background:rgba(128,128,128,.2);
    border-radius:1rem;
    cursor:pointer;
    font-size:.9rem!important;
    height:1.6rem;
    line-height:1.1rem;
    transition:all .1s ease-in;
    width:1.6rem
}
._3GR-a0AGWJhEkNvWUle3ky button:hover{
    background:rgba(128,128,128,.3)
}
[data-app-dm] ._3GR-a0AGWJhEkNvWUle3ky{
    background:#222;
    border-bottom:1px solid #444443;
    border-top:1px solid #444443
}
[data-app-dm] ._3GR-a0AGWJhEkNvWUle3ky input{
    background:#222;
    color:#fff
}
._2N56PwACWaBvNbz7BVVRZx{
    display:flex;
    flex-grow:1;
    max-height:calc(100% - 5rem - 6px);
    -webkit-overflow-scrolling:touch;
    -ms-overflow-style:-ms-autohiding-scrollbar;
    overflow-y:auto
}
._2N56PwACWaBvNbz7BVVRZx ._16PvqlcSUWWQKVA-SJgd-M{
    align-self:center;
    color:#999;
    text-align:center;
    width:100%
}
._2N56PwACWaBvNbz7BVVRZx li:hover{
    background:#fafafa
}
[data-app-dm] ._2N56PwACWaBvNbz7BVVRZx li:hover{
    background:rgba(128,128,128,.05)
}
._8ILSS0-9s7k3w3gEE9qU6{
    align-items:center;
    display:flex
}
.ZdzHNzquqiAkEtnxxdIPO.ZdzHNzquqiAkEtnxxdIPO{
    background:#f6f6f6;
    border:0;
    border-radius:0;
    flex-shrink:1;
    height:auto;
    margin:0;
    padding-left:1rem
}
[data-app-dm] .ZdzHNzquqiAkEtnxxdIPO.ZdzHNzquqiAkEtnxxdIPO{
    background:#2a2827!important
}
._3tkPTK4IBspRWXdf2einpr{
    align-items:center;
    color:#999;
    display:flex;
    justify-content:space-between
}
._3tkPTK4IBspRWXdf2einpr>span{
    display:flex
}
._35SjbJjXD2ehVA0-1D2Xum{
    font-size:.8rem;
    margin-left:8px
}
.DjYjKsb9vBEinQLvJ2pfN{
    color:#999;
    flex-grow:1;
    font-size:.8rem;
    list-style:none;
    margin:0 .4rem 0 0;
    padding:0;
    text-align:right;
    width:100%
}
.DjYjKsb9vBEinQLvJ2pfN li{
    border-radius:10px;
    cursor:pointer;
    display:inline-block;
    margin-left:4px;
    padding:2px 7px;
    transition:all .1s ease
}
.DjYjKsb9vBEinQLvJ2pfN li._16118JNSFKY7A7g5CQ_YUB{
    background:#aaa;
    color:#fff
}
.DjYjKsb9vBEinQLvJ2pfN li:hover:not(._16118JNSFKY7A7g5CQ_YUB){
    background:rgb(216,216,216,.4)
}
[data-app-dm] .DjYjKsb9vBEinQLvJ2pfN li._16118JNSFKY7A7g5CQ_YUB{
    background:#4a4a4a;
    color:#fff
}
[data-app-dm] .DjYjKsb9vBEinQLvJ2pfN li:hover:not(._16118JNSFKY7A7g5CQ_YUB){
    background:rgb(74,74,74,.4)
}
._4Bl9QBWfPZJuzleQL0pGr{
    align-self:flex-end;
    display:flex;
    flex-direction:row;
    justify-content:space-between;
    width:100%
}
._4Bl9QBWfPZJuzleQL0pGr ._2Gu4tOpvwdR0Z9K3DBQFJm{
    align-items:center;
    display:flex;
    justify-content:center;
    margin-right:1rem;
    width:3rem
}
._4Bl9QBWfPZJuzleQL0pGr ._2Gu4tOpvwdR0Z9K3DBQFJm ._3k7G9mcDYmhsYs7EMhEmqQ{
    background-position:50%;
    background-repeat:no-repeat;
    background-size:contain;
    height:50px;
    width:50px
}
._4Bl9QBWfPZJuzleQL0pGr ._3v5NUT-KlcrOx2CQ4vs6bp{
    display:flex;
    flex-direction:column;
    justify-content:center;
    width:calc(100% - 120px)
}
._4Bl9QBWfPZJuzleQL0pGr ._3v5NUT-KlcrOx2CQ4vs6bp ._3u3A-axDEeIjfmgxoV4x0s{
    align-items:center;
    display:flex
}
._4Bl9QBWfPZJuzleQL0pGr ._3v5NUT-KlcrOx2CQ4vs6bp ._3u3A-axDEeIjfmgxoV4x0s .fBzbxSighWZJrM7Q0vyF2{
    font-size:.9rem
}
._4Bl9QBWfPZJuzleQL0pGr ._3v5NUT-KlcrOx2CQ4vs6bp ._3u3A-axDEeIjfmgxoV4x0s ._2lq_sYT2ewXoGIsigR00cs{
    color:#aaa;
    font-size:1rem;
    margin:0 .4rem
}
._4Bl9QBWfPZJuzleQL0pGr ._3v5NUT-KlcrOx2CQ4vs6bp ._3u3A-axDEeIjfmgxoV4x0s ._2lq_sYT2ewXoGIsigR00cs i{
    line-height:1.4
}
._4Bl9QBWfPZJuzleQL0pGr ._3v5NUT-KlcrOx2CQ4vs6bp ._3u3A-axDEeIjfmgxoV4x0s ._1KHuX8BJ6csI8FJ8aNMJ8_{
    color:#aaa;
    font-size:.8rem
}
._4Bl9QBWfPZJuzleQL0pGr ._3v5NUT-KlcrOx2CQ4vs6bp ._3YLDm-Dw1gqJgl2yhN22lq{
    color:#999;
    display:flex;
    flex-direction:column;
    font-size:.9rem;
    margin-top:5px
}
._4Bl9QBWfPZJuzleQL0pGr ._1UK7oU3d4hDTsPFU9gAfwQ{
    align-items:flex-end;
    display:flex;
    flex-direction:column;
    justify-content:center;
    margin-left:.5rem
}
._4Bl9QBWfPZJuzleQL0pGr ._1UK7oU3d4hDTsPFU9gAfwQ ._39GMSOelbx47k9ky2d6K7a{
    background-color:#f6f6f6;
    border-radius:5px;
    color:#666;
    cursor:pointer;
    font-size:.9rem;
    opacity:.8;
    padding:3px 6px;
    transition:all .2s ease-out
}
._4Bl9QBWfPZJuzleQL0pGr ._1UK7oU3d4hDTsPFU9gAfwQ ._39GMSOelbx47k9ky2d6K7a:hover{
    background-color:#fbc308;
    color:#fff
}
[data-app-dm] ._4Bl9QBWfPZJuzleQL0pGr ._1UK7oU3d4hDTsPFU9gAfwQ ._39GMSOelbx47k9ky2d6K7a{
    background-color:#3f3f3f;
    color:#888
}
[data-app-dm] ._4Bl9QBWfPZJuzleQL0pGr ._1UK7oU3d4hDTsPFU9gAfwQ ._39GMSOelbx47k9ky2d6K7a:hover{
    background-color:#fbc308;
    color:#3f3f3f
}
.pM5tLzo6RlXE_IQA9Rg67{
    height:580px;
    max-width:520px;
    width:90vw
}
._29DnBboCTa9a6If5XeCRxe{
    -webkit-animation-duration:1s;
    animation-duration:1s;
    -webkit-animation-fill-mode:forwards;
    animation-fill-mode:forwards;
    -webkit-animation-iteration-count:infinite;
    animation-iteration-count:infinite;
    -webkit-animation-name:_31hTBqeb_tG_pe4VTR61iX;
    animation-name:_31hTBqeb_tG_pe4VTR61iX;
    -webkit-animation-timing-function:linear;
    animation-timing-function:linear;
    background:#f6f7f8;
    background:linear-gradient(90deg,#fafafa 0,#eee 50%,#fafafa);
    background-size:945px 104px;
    border-radius:3px;
    height:21px;
    position:relative
}
._29DnBboCTa9a6If5XeCRxe+._29DnBboCTa9a6If5XeCRxe{
    margin-top:15px
}
._29DnBboCTa9a6If5XeCRxe._2VjGiISkcUVKyJ39LTNNr0{
    height:15px;
    max-width:150px
}
._29DnBboCTa9a6If5XeCRxe.tlxRBnp_b_ueCtWm4scB4{
    border-radius:25px;
    height:50px;
    width:50px
}
._29DnBboCTa9a6If5XeCRxe._3u3A-axDEeIjfmgxoV4x0s{
    width:80%
}
._29DnBboCTa9a6If5XeCRxe._3YLDm-Dw1gqJgl2yhN22lq{
    width:40%
}
[data-app-dm] ._29DnBboCTa9a6If5XeCRxe{
    background:#1d1d1d;
    background:linear-gradient(90deg,#222 0,#333 50%,#222);
    background-size:945px 104px
}
@-webkit-keyframes _31hTBqeb_tG_pe4VTR61iX{
    0%{
        background-position:-468px 0
    }
    to{
        background-position:468px 0
    }
}
@keyframes _31hTBqeb_tG_pe4VTR61iX{
    0%{
        background-position:-468px 0
    }
    to{
        background-position:468px 0
    }
}
.qoAmEqNpZRLf2KVKZ8DsC{
    margin-bottom:4rem
}
@-webkit-keyframes _1FTFUjpWW16FIS-gztp0iY{
    0%{
        background-position:-468px 0
    }
    to{
        background-position:468px 0
    }
}
@keyframes _1FTFUjpWW16FIS-gztp0iY{
    0%{
        background-position:-468px 0
    }
    to{
        background-position:468px 0
    }
}
._212G-qwSJqMq6DTu4OUIus{
    border-bottom:.5px solid rgba(128,128,128,.25);
    margin-left:2rem;
    padding:15px 25px 14px 0
}
.nBJyqYwElkS3hPkZd8HyH{
    -webkit-animation-duration:1s;
    animation-duration:1s;
    -webkit-animation-fill-mode:forwards;
    animation-fill-mode:forwards;
    -webkit-animation-iteration-count:infinite;
    animation-iteration-count:infinite;
    -webkit-animation-name:_1FTFUjpWW16FIS-gztp0iY;
    animation-name:_1FTFUjpWW16FIS-gztp0iY;
    -webkit-animation-timing-function:linear;
    animation-timing-function:linear;
    background:#f6f7f8;
    background:linear-gradient(90deg,#fafafa 0,#eee 50%,#fafafa);
    background-size:945px 104px;
    border-radius:3px;
    height:21px;
    position:relative
}
.nBJyqYwElkS3hPkZd8HyH+.nBJyqYwElkS3hPkZd8HyH{
    margin-top:15px
}
.nBJyqYwElkS3hPkZd8HyH._31wxj4a25PmxhtxesQ09xs{
    height:15px;
    max-width:150px
}
[data-app-dm] .nBJyqYwElkS3hPkZd8HyH{
    background:#1d1d1d;
    background:linear-gradient(90deg,#222 0,#333 50%,#222);
    background-size:945px 104px
}
.w1oMJMGYymLooZzCLcLtw{
    border-collapse:collapse;
    width:100%
}
.w1oMJMGYymLooZzCLcLtw td,.w1oMJMGYymLooZzCLcLtw th{
    cursor:default;
    outline:0;
    padding:4px 8px;
    position:relative;
    text-align:center
}
.w1oMJMGYymLooZzCLcLtw td:focus,.w1oMJMGYymLooZzCLcLtw th:focus{
    box-shadow:inset 0 0 0 2px #217346;
    cursor:auto
}
.w1oMJMGYymLooZzCLcLtw td:focus:first-child,.w1oMJMGYymLooZzCLcLtw th:focus:first-child{
    box-shadow:inset 52px 0 #217346,inset 0 0 0 2px #217346
}
.w1oMJMGYymLooZzCLcLtw td:focus:after,.w1oMJMGYymLooZzCLcLtw th:focus:after{
    background:#217346;
    border:1px solid #fff;
    bottom:-2px;
    content:"";
    height:6px;
    position:absolute;
    right:-2px;
    width:6px;
    z-index:2
}
.w1oMJMGYymLooZzCLcLtw td{
    box-shadow:inset 1px 0 #d0d0d0,inset 0 -1px #d0d0d0
}
.w1oMJMGYymLooZzCLcLtw th{
    box-shadow:inset 1px 0 #aaa
}
.w1oMJMGYymLooZzCLcLtw th:first-child{
    box-shadow:inset 49px 0 #e6e6e6,inset 50px 0 #aaa,inset 1px 0 #aaa
}
.w1oMJMGYymLooZzCLcLtw th:first-child:after{
    border-color:transparent #aaa #aaa transparent;
    border-style:solid;
    border-width:8px;
    bottom:6px;
    content:"";
    left:28px;
    position:absolute
}
.w1oMJMGYymLooZzCLcLtw>thead{
    background:#e6e6e6;
    color:#000
}
.w1oMJMGYymLooZzCLcLtw>tbody{
    background:#fff
}
.w1oMJMGYymLooZzCLcLtw>tbody tr:first-child>td{
    box-shadow:inset 0 1px #aaa,inset 1px 0 #d0d0d0,inset 0 -1px #d0d0d0
}
.w1oMJMGYymLooZzCLcLtw>tbody tr:first-child>td:first-child:before{
    box-shadow:inset 0 1px #aaa,inset 0 -1px #aaa,inset -1px 0 #aaa
}
._1gRvIW4M6nYrwu2OWOs_ii{
    padding:15px;
    text-align:center
}
._2UUSB8ygtNWml6Hgg6gNcC{
    width:50%
}
._9MCK2Ps1TijR5AHnwA4XJ{
    text-align:left!important
}
._2MDACDy3mQLdAcOzMY-Mv7{
    overflow:hidden;
    text-align:center
}
.wQ4Ran7ySbKd8PdMeHZZR{
    display:flex;
    flex-wrap:wrap;
    min-height:80px;
    position:relative;
    transition:background .1s ease-in;
    will-change:background
}
.wQ4Ran7ySbKd8PdMeHZZR._2dLZW6mNGVYkcKMiMC0Ijn,[data-app-ho] .wQ4Ran7ySbKd8PdMeHZZR:hover{
    background:rgba(128,128,128,.05)
}
[data-app-dm] .wQ4Ran7ySbKd8PdMeHZZR._2dLZW6mNGVYkcKMiMC0Ijn,[data-app-ho] [data-app-dm] .wQ4Ran7ySbKd8PdMeHZZR:hover{
    background:rgba(128,128,128,.1)
}
._21IQKhlBjN2jlHS_TVgI3l{
    color:inherit;
    cursor:pointer;
    display:flex;
    flex-direction:column;
    overflow:hidden;
    padding:12px 10px;
    position:relative;
    text-decoration:none;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    width:100%
}
._21IQKhlBjN2jlHS_TVgI3l .vv9keWAXpwoonDah6rSIU,._21IQKhlBjN2jlHS_TVgI3l .vv9keWAXpwoonDah6rSIU ._3D2lzCKDMcdgEkexZrTSUh{
    align-items:center;
    display:flex
}
._21IQKhlBjN2jlHS_TVgI3l .vv9keWAXpwoonDah6rSIU ._3D2lzCKDMcdgEkexZrTSUh{
    flex-shrink:0;
    height:24px;
    justify-content:center;
    margin-right:.1rem;
    width:20px
}
._21IQKhlBjN2jlHS_TVgI3l .vv9keWAXpwoonDah6rSIU .zBQrhafI5njrmUUaJqKA4{
    align-items:center;
    display:flex;
    flex-grow:1;
    height:24px;
    line-height:24px
}
._21IQKhlBjN2jlHS_TVgI3l .vv9keWAXpwoonDah6rSIU .zBQrhafI5njrmUUaJqKA4 ._37XwjAqVHtjzqzEtybpHrU{
    color:#aaa;
    display:flex;
    flex-shrink:0;
    font-size:12px;
    margin-left:10px;
    vertical-align:text-bottom
}
._21IQKhlBjN2jlHS_TVgI3l .vv9keWAXpwoonDah6rSIU .zBQrhafI5njrmUUaJqKA4 ._37XwjAqVHtjzqzEtybpHrU i{
    margin-right:2px
}
[data-app-dm] ._21IQKhlBjN2jlHS_TVgI3l .vv9keWAXpwoonDah6rSIU .zBQrhafI5njrmUUaJqKA4 ._37XwjAqVHtjzqzEtybpHrU{
    color:#848482
}
._21IQKhlBjN2jlHS_TVgI3l .vv9keWAXpwoonDah6rSIU._1KV65JcPoDUFZ4o3OEqn4R{
    align-items:start;
    margin-top:8px
}
._21IQKhlBjN2jlHS_TVgI3l:hover{
    text-decoration:none
}
._21IQKhlBjN2jlHS_TVgI3l:after{
    border-bottom:.5px solid rgba(128,128,128,.25);
    bottom:0;
    content:"";
    height:1px;
    left:1.8rem;
    position:absolute;
    width:100%
}
[data-app-dm] ._21IQKhlBjN2jlHS_TVgI3l:after{
    border-bottom-color:#3b3a39
}
.CxY4XDSSItTeLVg0cKCN0{
    display:block;
    float:left;
    font-size:.9rem;
    max-width:50%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
}
._21MoJBchZfr8UULlsDtTeh{
    align-items:center;
    background:#ddd;
    border-radius:5px;
    display:flex;
    height:18px;
    justify-content:center;
    margin-left:5px;
    width:18px
}
._21MoJBchZfr8UULlsDtTeh i{
    color:#ff453a;
    font-size:14px
}
._2a-Q4qmomvJlBb0DHw8j9x,._3UBjMz2Bst3UPQWA7kXm8m{
    color:#fbc308
}
._2k6oe02_e-mIlwTpxga41U{
    color:#34aadc
}
._3-exuX3T7_fUJinbY7Y33X,._1t2QIlJNP-zhqLqtFipWJG{
    background:#ccc;
    border-radius:50%;
    height:10px;
    width:10px
}
[data-app-dm] ._3-exuX3T7_fUJinbY7Y33X,[data-app-dm] ._1t2QIlJNP-zhqLqtFipWJG{
    background:#aaa
}
._3-exuX3T7_fUJinbY7Y33X,[data-app-dm] ._3-exuX3T7_fUJinbY7Y33X{
    background:#e74c3c
}
.kGiK4C_ybRRz_Njs98aFv{
    border-radius:50%;
    color:#ccc;
    display:block;
    height:20px;
    line-height:20px;
    text-align:center;
    transition:all .2s ease-out;
    width:20px;
    z-index:2
}
[data-app-dm] .kGiK4C_ybRRz_Njs98aFv{
    color:#aaa
}
.kGiK4C_ybRRz_Njs98aFv:hover{
    color:#000;
    text-decoration:none
}
[data-app-dm] .kGiK4C_ybRRz_Njs98aFv:hover{
    background:rgba(128,128,128,.5);
    color:#fff
}
.xe-_Nk0qhTfnxWCfoDpev{
    display:inline;
    margin-left:.5rem;
    position:relative;
    z-index:2
}
.pB7PWn6W6SHBnbS1vnfRz{
    color:#848482;
    font-size:.75em;
    margin-right:.1rem;
    padding:.2rem .4rem;
    vertical-align:top
}
.pB7PWn6W6SHBnbS1vnfRz:hover{
    background-color:#eee;
    border-radius:3px;
    color:#000;
    text-decoration:none
}
[data-app-dm] .pB7PWn6W6SHBnbS1vnfRz:hover{
    background:#333;
    color:#aaa
}
._3o2_SFYkCNlQJbu5MgG_iB{
    position:relative
}
._2A_7bGY9QAXcGu1neEYDJB{
    bottom:0;
    left:0;
    position:absolute;
    right:0;
    top:0;
    z-index:0
}
._26oEXjfUS_iHzbxYcZE6bD{
    color:#aaa;
    font-size:.8rem;
    height:24px;
    line-height:21px;
    padding:0;
    position:relative;
    z-index:2
}
[data-app-dm] ._26oEXjfUS_iHzbxYcZE6bD{
    color:#848482
}
._26oEXjfUS_iHzbxYcZE6bD:hover{
    color:#333
}
[data-app-dm] ._26oEXjfUS_iHzbxYcZE6bD:hover{
    color:#ccc6c0
}
._14BnVEj9rQ5VQKmrIqn9Qj{
    color:#333;
    flex:1 1;
    line-height:24px;
    min-height:24px;
    overflow:hidden;
    padding-right:10px;
    word-break:break-word
}
[data-app-dm] ._14BnVEj9rQ5VQKmrIqn9Qj{
    color:#ccc6c0
}
._20jopXBFHNQ9FUbcGHLcHH{
    display:inline-block
}
._3JcPiw9IkmUqSs9uMOwPa2{
    color:#333;
    margin-right:.3rem
}
[data-app-dm] ._3JcPiw9IkmUqSs9uMOwPa2{
    color:#ccc6c0
}
._3VRxq3mC-jm2fhdX4exwPU{
    background:#eee;
    border-radius:.69rem;
    color:#aaa;
    flex:none;
    font-size:12px;
    height:1.38rem;
    line-height:1.38rem;
    margin-top:.05rem;
    padding:0 .5rem;
    z-index:2
}
._3VRxq3mC-jm2fhdX4exwPU:hover{
    background:#aaa;
    color:#fff;
    text-decoration:none
}
[data-app-dm] ._3VRxq3mC-jm2fhdX4exwPU{
    background:#333;
    color:#aaa
}
[data-app-dm] ._3VRxq3mC-jm2fhdX4exwPU:hover{
    background:#555;
    color:#ccc
}
._3VRxq3mC-jm2fhdX4exwPU._1TMG8rqGf1tv2Qc253m8eP{
    background:0 0;
    border:1px solid #000;
    color:#000
}
._3VRxq3mC-jm2fhdX4exwPU._1TMG8rqGf1tv2Qc253m8eP:hover{
    background:#aaa;
    border-color:transparent;
    color:#fff;
    text-decoration:none
}
[data-app-dm] ._3VRxq3mC-jm2fhdX4exwPU._1TMG8rqGf1tv2Qc253m8eP{
    border:1px solid #fbc308;
    color:#fbc308
}
[data-app-dm] ._3VRxq3mC-jm2fhdX4exwPU._1TMG8rqGf1tv2Qc253m8eP:hover{
    background:#fbc308;
    color:#000
}
._1ZYGTZppu1l96DtsFgxb4W{
    background:#f6f6f6;
    border-bottom:1px solid rgba(128,128,128,.25);
    text-align:center;
    width:100%
}
[data-app-dm] ._1ZYGTZppu1l96DtsFgxb4W{
    background:#151515;
    border-bottom:1px solid #3b3a39
}
._1xHZzSfhE_GUgST14GF2XT{
    align-items:center;
    color:#fbc308;
    cursor:pointer;
    display:flex;
    font-size:25px;
    left:3px;
    position:absolute;
    top:12px
}
._1xHZzSfhE_GUgST14GF2XT:hover{
    background:rgba(128,128,128,.15)
}
._2J2_UjcE1ZbvAcc-8bx9g5{
    bottom:0;
    cursor:pointer;
    left:0;
    position:absolute;
    right:0;
    top:0;
    z-index:3
}
[data-app-fs=xs] .wQ4Ran7ySbKd8PdMeHZZR{
    min-height:64px
}
[data-app-fs=xs] ._21IQKhlBjN2jlHS_TVgI3l{
    padding:8px 10px
}
[data-app-fs=xs] ._14BnVEj9rQ5VQKmrIqn9Qj{
    font-size:.9rem
}
[data-app-fs=xs] .vv9keWAXpwoonDah6rSIU._1KV65JcPoDUFZ4o3OEqn4R{
    margin-top:0
}
[data-app-fs=s] .wQ4Ran7ySbKd8PdMeHZZR{
    min-height:68px
}
[data-app-fs=s] ._21IQKhlBjN2jlHS_TVgI3l{
    padding:9px 11px
}
[data-app-fs=s] ._14BnVEj9rQ5VQKmrIqn9Qj{
    font-size:1rem
}
[data-app-fs=s] .vv9keWAXpwoonDah6rSIU._1KV65JcPoDUFZ4o3OEqn4R{
    margin-top:2px
}
[data-app-fs=m] ._14BnVEj9rQ5VQKmrIqn9Qj{
    font-size:1.1rem
}
[data-app-fs=l] ._14BnVEj9rQ5VQKmrIqn9Qj{
    font-size:1.2rem
}
[data-app-fs=xl] ._14BnVEj9rQ5VQKmrIqn9Qj{
    font-size:1.3rem
}
._1oGpy7WzlmuyyBsdnwmvxp._1oGpy7WzlmuyyBsdnwmvxp{
    background:#f9f9f9;
    border:0;
    border-bottom:.5px solid #e0e0e0;
    border-radius:0;
    height:auto;
    margin:0;
    padding:.8rem .5rem
}
.PM9T6vCzWCHHADvZdXaaf{
    align-items:center;
    color:#999;
    display:flex;
    justify-content:space-between
}
.PM9T6vCzWCHHADvZdXaaf>span{
    display:flex
}
.tYIkfZ7qo08M34yFuH2XJ{
    font-size:.8rem;
    margin-left:8px
}
._1oAZ-dSJQlxsXi9LmOBolw{
    display:flex;
    flex-wrap:wrap;
    margin:1rem 0
}
._3omJTNzI7U7MErH1Cfr3gE{
    align-items:center;
    display:flex;
    flex:1 1;
    float:left;
    height:3rem;
    justify-content:center;
    margin:0
}
._3omJTNzI7U7MErH1Cfr3gE>._1H7LRkyaZfWThykmNIYwpH{
    cursor:pointer;
    font-size:1.125em;
    position:relative
}
._3omJTNzI7U7MErH1Cfr3gE>._1H7LRkyaZfWThykmNIYwpH>select{
    cursor:pointer;
    height:100%;
    left:0;
    opacity:0;
    position:absolute;
    top:0;
    width:100%
}
._3omJTNzI7U7MErH1Cfr3gE a,._3omJTNzI7U7MErH1Cfr3gE a:hover{
    border-radius:10px;
    color:#000;
    padding:8px 10px;
    text-decoration:none;
    transition:all .1s ease
}
._3omJTNzI7U7MErH1Cfr3gE a:hover{
    background:#e1e1e1
}
[data-app-dm] ._3omJTNzI7U7MErH1Cfr3gE a:hover{
    background:#222
}
[data-app-dm] ._3omJTNzI7U7MErH1Cfr3gE a,[data-app-dm] ._1H7LRkyaZfWThykmNIYwpH{
    color:#fbc308
}
._1_dTvjmOtdapzJl7PDWuPJ{
    max-height:200px;
    overflow:hidden
}
._3vdrhTaWJyZ7pYkFWJM1_n{
    border:1px solid #bdc3c7;
    border-radius:4px;
    color:#888;
    cursor:pointer;
    display:inline-block;
    float:left;
    font-size:.9rem;
    height:2rem;
    line-height:2rem;
    margin:.5rem 0;
    padding:0 .6rem;
    text-indent:0;
    transition:background .2s;
    will-change:background
}
[data-app-dm] ._3vdrhTaWJyZ7pYkFWJM1_n{
    border-color:#666
}
._3vdrhTaWJyZ7pYkFWJM1_n:hover{
    background:rgba(128,128,128,.2)
}
.GsWOYqIgCihyKUG73_Li2{
    display:inline-block;
    max-width:540px;
    position:relative
}
.GsWOYqIgCihyKUG73_Li2 img{
    display:block;
    transition:max-width .15s,max-height .15s;
    will-change:max-width,max-height
}
._1IRb72usJbuU0mijiA1s1X{
    background:rgba(0,0,0,.6);
    border-radius:4px;
    bottom:.2rem;
    color:#fff;
    cursor:pointer;
    font-size:1.2rem;
    height:2rem;
    position:absolute;
    right:.2rem;
    text-align:center;
    width:2rem
}
@media(max-width:767px){
    ._1IRb72usJbuU0mijiA1s1X{
        height:1.8rem;
        width:1.8rem
    }
    ._1IRb72usJbuU0mijiA1s1X svg{
        width:16px
    }
}
._1IRb72usJbuU0mijiA1s1X svg{
    fill:#fff;
    left:50%;
    position:absolute;
    top:50%;
    transform:translate(-50%,-50%);
    width:20px
}
._2EtXyWJjJbx8EcCgZjWIOd{
    align-items:center;
    cursor:pointer;
    display:flex;
    height:80px;
    justify-content:center;
    width:80px
}
._2EtXyWJjJbx8EcCgZjWIOd>ins{
    background:url(https://cdn.lihkg.com/static/2105289671-86ixn/media/image-placeholder.png) no-repeat 50%;
    background-size:cover;
    height:64px;
    width:64px
}
._31B9lsqlMMdzv-FSYUkXeV{
    color:#6a6a6a;
    display:inline-block;
    font-size:inherit;
    margin:0 0 1rem;
    padding-left:1rem;
    position:relative;
    vertical-align:top;
    width:100%
}
[data-app-dm] ._31B9lsqlMMdzv-FSYUkXeV{
    color:#aca9a9
}
._31B9lsqlMMdzv-FSYUkXeV>._3pnUeDm8-bRxLH84eNhuV_{
    height:100%;
    left:0;
    position:absolute;
    -webkit-tap-highlight-color:transparent;
    width:.925rem
}
._31B9lsqlMMdzv-FSYUkXeV>._3pnUeDm8-bRxLH84eNhuV_:after{
    background:#d6dadd;
    border-radius:4px;
    content:"";
    height:100%;
    left:0;
    position:absolute;
    transition:background .2s ease-out;
    width:2px
}
[data-app-dm] ._31B9lsqlMMdzv-FSYUkXeV>._3pnUeDm8-bRxLH84eNhuV_:after{
    background:#646462
}
._31B9lsqlMMdzv-FSYUkXeV>._3pnUeDm8-bRxLH84eNhuV_._2a77EyqZUCKZHeOe3NmCFV:after{
    width:1px
}
._31B9lsqlMMdzv-FSYUkXeV>._3pnUeDm8-bRxLH84eNhuV_._1NFaREhSpXY6nG0I0yp7ih{
    cursor:pointer
}
._31B9lsqlMMdzv-FSYUkXeV>._3pnUeDm8-bRxLH84eNhuV_._1NFaREhSpXY6nG0I0yp7ih:hover:after{
    background:#000
}
[data-app-dm] ._31B9lsqlMMdzv-FSYUkXeV>._3pnUeDm8-bRxLH84eNhuV_._1NFaREhSpXY6nG0I0yp7ih:hover:after{
    background:#fbc308
}
._31B9lsqlMMdzv-FSYUkXeV>._3EB1X9aV0up3uah4d4nmzg{
    cursor:auto;
    display:inline-block
}
._31B9lsqlMMdzv-FSYUkXeV .XeDEQWUu8iTlukox6EThr{
    max-height:20rem;
    overflow:hidden;
    position:relative
}
._31B9lsqlMMdzv-FSYUkXeV .XeDEQWUu8iTlukox6EThr ._3B2t5a61If5NLpu3N7C87v{
    background:#fff;
    display:flex;
    height:2rem;
    left:0;
    pointer-events:none;
    position:absolute;
    right:0;
    top:18rem
}
._31B9lsqlMMdzv-FSYUkXeV .XeDEQWUu8iTlukox6EThr ._3B2t5a61If5NLpu3N7C87v span{
    align-items:center;
    color:#000;
    cursor:pointer;
    display:flex;
    font-size:.85rem;
    font-weight:700;
    height:2rem;
    pointer-events:all;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
}
._2yeBKooY3VAK8NLhM4Esov{
    border:2px dotted #888;
    border-radius:5px;
    color:inherit;
    display:inline-block;
    font-size:inherit;
    margin:5px;
    padding:10px;
    vertical-align:inherit
}
@media screen and (-webkit-min-device-pixel-ratio:0) and (min-resolution:.001dpcm){
    [data-app-mb] ._2yeBKooY3VAK8NLhM4Esov{
        border-radius:0
    }
}
.D6kLi9J7MXlmcJt-_fNbE,._3aNF3eYAHk0cDzSuiP-rFg{
    image-rendering:auto;
    padding:0 1px
}
@media(-webkit-device-pixel-ratio:1),(-webkit-device-pixel-ratio:2),(-webkit-device-pixel-ratio:3),(-webkit-device-pixel-ratio:4){
    .D6kLi9J7MXlmcJt-_fNbE{
        -ms-interpolation-mode:nearest-neighbor;
        image-rendering:-moz-crisp-edges;
        image-rendering:pixelated
    }
}
._2MnB0Palim0uwFKFsnjMmO{
    color:#f33
}
._3QD4Y6QTwYpXDlr-_NARDa{
    color:#f90
}
.vFF4JyL0_7B2TLPEXjEri,._2Rx3-NhweAzwHgs9s7Mzvu{
    color:#ffd500
}
._1ZqEZMkGt-F2S-zoYsDD19{
    color:#2c5
}
._3PYGKQmt1luCdBG8i1ANFd{
    color:#00d9c9
}
._3VBzxY54Ucaj6Gf_5bSPiR{
    color:#0073ff
}
._15zbcEk_FLuJcwNmY3CZwz{
    color:#5757dd
}
._16-JDmHpuBk_jS_ovbtyYU{
    color:#fcd
}
._2P_HQPhXepmdOupSaOAP0C{
    color:#ff2d99
}
._2aoIer7T4KNxa3TweP_KnX{
    color:rgba(29,33,41,.2)
}
[data-app-dm] ._2MnB0Palim0uwFKFsnjMmO{
    color:#f33
}
[data-app-dm] ._3QD4Y6QTwYpXDlr-_NARDa{
    color:#ffa900
}
[data-app-dm] .vFF4JyL0_7B2TLPEXjEri,[data-app-dm] ._2Rx3-NhweAzwHgs9s7Mzvu{
    color:#fd0
}
[data-app-dm] ._1ZqEZMkGt-F2S-zoYsDD19{
    color:#29d64a
}
[data-app-dm] ._3PYGKQmt1luCdBG8i1ANFd{
    color:#00e0cc
}
[data-app-dm] ._3VBzxY54Ucaj6Gf_5bSPiR{
    color:#007bff
}
[data-app-dm] ._15zbcEk_FLuJcwNmY3CZwz{
    color:#b6d
}
[data-app-dm] ._16-JDmHpuBk_jS_ovbtyYU{
    color:#ffd6e6
}
[data-app-dm] ._2P_HQPhXepmdOupSaOAP0C{
    color:#ff4ca4
}
[data-app-dm] ._2aoIer7T4KNxa3TweP_KnX{
    color:rgba(204,198,192,.3)
}
._336sYg-3-bn4ROJkXpLA0Z{
    color:violet
}
._2A68WwuJVL5tTSFq4_DWQc{
    color:brown
}
._15ImTS_wgUHWKxbW3tEaD{
    color:maroon
}
._1uGrjKcZ1-PDyPvjbfccH3{
    color:teal
}
._23VGqEXUjt7a0xKP9eMw65{
    color:navy
}
._22S7gZAjN1DehLoRGErf_o{
    color:#32cd32
}
._3HVcQJuJ7eArl2MAnLPdFp{
    font-size:xx-large
}
._112cdz-QZ_t3WzsCmLftk2{
    font-size:x-large
}
._1q9IhdOUZUQrMwUZTGNa0-{
    font-size:large
}
._3PO__6tTTnGivEMA9dx9sR{
    font-size:medium
}
.pds0u1Eb7Z5GNZTeymaOv{
    font-size:small
}
.CmbLaI73Mf1agvp030K8u{
    font-size:x-small
}
.hzNt6veJvpFQmkLR_LAAk{
    margin:0
}
.sV5uC6PSnxBfn0KGukUAB{
    text-align:center
}
._3rLwkluSi1heK8l-0eKggN{
    text-align:left
}
.-W09yTkn-EGrqgJ46kl3p{
    text-align:right
}
._7XYLecKnsFNIW4Up8z7_k{
    background:#f8f8f8;
    border-radius:4px;
    padding:.2rem .4rem
}
[data-app-dm] ._7XYLecKnsFNIW4Up8z7_k{
    background:#333
}
[data-app-fs=xs] ._7XYLecKnsFNIW4Up8z7_k{
    font-size:.8rem!important
}
[data-app-fs=s] ._7XYLecKnsFNIW4Up8z7_k{
    font-size:.9rem!important
}
[data-app-fs=m] ._7XYLecKnsFNIW4Up8z7_k{
    font-size:1rem!important
}
[data-app-fs=l] ._7XYLecKnsFNIW4Up8z7_k{
    font-size:1.1rem!important
}
[data-app-fs=xl] ._7XYLecKnsFNIW4Up8z7_k{
    font-size:1.2rem!important
}
pre+br{
    display:none
}
._2JVZ6EM-Wt8lJCp6QYqtQg{
    font-size:0;
    line-height:0
}
.WDka9YT44tS0VU7kMyzlu{
    border:0;
    height:0;
    max-width:480px;
    width:100%
}
[data-app-dm] .WDka9YT44tS0VU7kMyzlu{
    opacity:.8
}
._2QjBg5uviqAOf08FTnUQJf{
    display:inline-block;
    height:64px;
    position:relative;
    width:64px
}
._2QjBg5uviqAOf08FTnUQJf:before{
    -webkit-animation:_190CdzUikhTZ2YFbICTiNG 1s ease-in-out infinite;
    animation:_190CdzUikhTZ2YFbICTiNG 1s ease-in-out infinite;
    border-radius:50%;
    border-top:1px solid #3b3a39;
    content:"";
    height:48px;
    left:50%;
    margin:-24px;
    position:absolute;
    top:50%;
    visibility:visible;
    width:48px
}
[data-app-dm] ._2QjBg5uviqAOf08FTnUQJf:before{
    border-top:1px solid #ccc
}
@-webkit-keyframes _3Q5y0MhVaN8EYCN8G5nX9k{
    to{
        transform:rotate(359deg)
    }
}
@keyframes _3Q5y0MhVaN8EYCN8G5nX9k{
    to{
        transform:rotate(359deg)
    }
}
@-webkit-keyframes _190CdzUikhTZ2YFbICTiNG{
    0%{
        transform:rotate(0deg)
    }
    to{
        transform:rotate(359deg)
    }
}
@keyframes _190CdzUikhTZ2YFbICTiNG{
    0%{
        transform:rotate(0deg)
    }
    to{
        transform:rotate(359deg)
    }
}
._2AYqIZE-4Q0a1XZ6QsZyAv{
    -webkit-animation:_3Q5y0MhVaN8EYCN8G5nX9k 1s ease infinite;
    animation:_3Q5y0MhVaN8EYCN8G5nX9k 1s ease infinite;
    border-radius:50%;
    border-top:1px solid #888;
    height:2rem;
    width:2rem
}
[data-app-fs=xs] ._31B9lsqlMMdzv-FSYUkXeV{
    line-height:1.6;
    margin:0 0 10px
}
[data-app-fs=s] ._31B9lsqlMMdzv-FSYUkXeV{
    line-height:1.7;
    margin:0 0 12px
}
._2bokd4pLvU5_-Lc97NVqzn{
    background:#fff;
    border:1px solid #d9d9d9;
    border-radius:4px;
    max-height:auto;
    overflow:hidden;
    padding:1rem 1.5rem;
    transition:max-height .15s ease-out;
    word-break:break-word;
    word-wrap:break-word
}
._2bokd4pLvU5_-Lc97NVqzn img{
    max-width:100%;
    -webkit-tap-highlight-color:transparent
}
[data-app-of] ._2bokd4pLvU5_-Lc97NVqzn{
    border:0;
    border-radius:0;
    border-top:1px solid silver;
    padding:1rem 1.5rem
}
[data-app-dm] ._2bokd4pLvU5_-Lc97NVqzn{
    background:#222;
    border-color:#3b3a39
}
._2bokd4pLvU5_-Lc97NVqzn._20q6NML4ErQq8usNV-npj5{
    border:0;
    border-radius:0
}
._2_dSowN84IcEeHtmNoQ1pc{
    align-items:center;
    display:flex;
    opacity:.6
}
._2_dSowN84IcEeHtmNoQ1pc i{
    margin-right:4px
}
._1bzx9aiZMAUBeD_i_gRY4a{
    color:#999;
    cursor:pointer;
    display:flex;
    font:1rem Ubuntu Mono,monospace;
    height:1rem;
    line-height:1rem
}
._1bzx9aiZMAUBeD_i_gRY4a>span:first-child{
    opacity:.6
}
._1bzx9aiZMAUBeD_i_gRY4a .g5vpgu7zPjhOI1RdFbO-D{
    color:inherit;
    margin-left:auto;
    position:relative
}
._1bzx9aiZMAUBeD_i_gRY4a .g5vpgu7zPjhOI1RdFbO-D:after{
    border-radius:6px;
    content:"";
    height:32px;
    left:-7px;
    opacity:.1;
    position:absolute;
    right:0;
    top:-9px;
    transition:all .2s ease;
    width:78px
}
._1bzx9aiZMAUBeD_i_gRY4a .g5vpgu7zPjhOI1RdFbO-D:hover:after{
    background:#e74c3c
}
._1bzx9aiZMAUBeD_i_gRY4a+._1Hi94Pa6lplJ436NQaMbEt{
    margin-top:1em
}
._1bzx9aiZMAUBeD_i_gRY4a img{
    height:auto;
    max-width:100%
}
._1bzx9aiZMAUBeD_i_gRY4a+[data-ast-root]{
    margin-top:.6rem
}
._2bokd4pLvU5_-Lc97NVqzn img[data-src],._2bokd4pLvU5_-Lc97NVqzn img[data-src]~button,._2bokd4pLvU5_-Lc97NVqzn img~ins{
    display:inline-block;
    height:0;
    visibility:hidden;
    width:0
}
._2bokd4pLvU5_-Lc97NVqzn img~ins[data-error]{
    border:1px solid #bbb;
    display:inline-block;
    height:1rem;
    margin-top:.5rem;
    visibility:visible;
    width:1rem
}
[data-app-dm] ._2bokd4pLvU5_-Lc97NVqzn img~ins[data-error]{
    border-color:#555
}
._2bokd4pLvU5_-Lc97NVqzn img~ins[data-error]+button{
    display:none
}
._2bokd4pLvU5_-Lc97NVqzn img[data-src]~ins{
    display:inline-block;
    height:64px;
    position:relative;
    width:64px
}
@-webkit-keyframes _2XS8xuiLYKO1PfIz4hq8lM{
    0%{
        transform:rotate(0deg)
    }
    to{
        transform:rotate(359deg)
    }
}
@keyframes _2XS8xuiLYKO1PfIz4hq8lM{
    0%{
        transform:rotate(0deg)
    }
    to{
        transform:rotate(359deg)
    }
}
._2bokd4pLvU5_-Lc97NVqzn img[data-src]~ins:before{
    -webkit-animation:_2XS8xuiLYKO1PfIz4hq8lM 1.1s linear infinite;
    animation:_2XS8xuiLYKO1PfIz4hq8lM 1.1s linear infinite;
    border-radius:50%;
    border:2px solid rgba(0,0,0,.15);
    border-left-color:#333;
    content:"";
    height:48px;
    left:50%;
    margin:-24px;
    position:absolute;
    top:50%;
    visibility:visible;
    width:48px
}
[data-app-dm] ._2bokd4pLvU5_-Lc97NVqzn img[data-src]~ins:before{
    border:2px solid rgba(255,255,255,.2);
    border-left-color:#fff
}
._1VcuFUmnOEK51TsshmrnJM{
    align-items:center;
    clear:both;
    color:#aaa;
    display:flex
}
._1VcuFUmnOEK51TsshmrnJM>span{
    display:inline-block;
    flex-shrink:0;
    line-height:1.5rem;
    vertical-align:middle
}
._1VcuFUmnOEK51TsshmrnJM>a{
    color:inherit
}
._1VcuFUmnOEK51TsshmrnJM .ZZtOrmcIRcvdpnW09DzFk{
    flex-shrink:0;
    font-size:1rem;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
}
._1VcuFUmnOEK51TsshmrnJM ._10ZVxePYNpBeLjzkQ88wtj,._1VcuFUmnOEK51TsshmrnJM ._5eCj_p0JCv_U-96TvvWUh{
    align-items:center;
    display:flex;
    height:18px;
    justify-content:center;
    margin-left:5px;
    width:18px
}
._1VcuFUmnOEK51TsshmrnJM ._10ZVxePYNpBeLjzkQ88wtj{
    background:#ddd;
    border-radius:5px
}
._1VcuFUmnOEK51TsshmrnJM ._10ZVxePYNpBeLjzkQ88wtj i{
    color:#ff453a;
    font-size:14px
}
._1VcuFUmnOEK51TsshmrnJM ._5eCj_p0JCv_U-96TvvWUh{
    cursor:pointer
}
._1VcuFUmnOEK51TsshmrnJM ._5eCj_p0JCv_U-96TvvWUh i{
    color:#fbc308;
    font-size:14px
}
._1VcuFUmnOEK51TsshmrnJM ._1d3Z5jQRq3WnuIm0hnMh0c{
    align-items:center;
    color:#1d2129;
    cursor:pointer;
    display:flex;
    flex-grow:1;
    font-size:1rem;
    overflow:hidden
}
._1VcuFUmnOEK51TsshmrnJM ._1d3Z5jQRq3WnuIm0hnMh0c ._2aoK5X3DroSiz5lhKN4ksu{
    border:1px solid #aaa;
    border-radius:5px;
    color:#aaa;
    flex-shrink:0;
    font-size:.8rem;
    margin-right:8px;
    padding:2px 4px
}
._1VcuFUmnOEK51TsshmrnJM ._1d3Z5jQRq3WnuIm0hnMh0c .oStuGCWyiP2IrBDndu1cY{
    flex-shrink:0
}
[data-app-dm] ._1VcuFUmnOEK51TsshmrnJM ._1d3Z5jQRq3WnuIm0hnMh0c{
    color:#ccc6c0
}
._3SqN3KZ8m8vCsD9FNcxcki{
    margin-right:.4rem
}
.UM_uefRXp7fgzd4Cl8y2A{
    color:#aaa;
    font-size:1rem;
    margin:0 .4rem
}
.UM_uefRXp7fgzd4Cl8y2A i{
    line-height:1.4
}
.Ahi80YgykKo22njTSCzs_{
    margin-right:.5rem
}
.RShOJL_DxoIHgMmNd0nlJ{
    align-items:center;
    cursor:pointer;
    display:flex;
    font-size:1.2rem;
    padding:0 .5rem
}
.RShOJL_DxoIHgMmNd0nlJ:hover{
    color:#000
}
[data-app-dm] .RShOJL_DxoIHgMmNd0nlJ:hover{
    color:#fff
}
.RShOJL_DxoIHgMmNd0nlJ:last-child{
    padding-right:0
}
._25mzO4j1ijChWVxjkzoulM{
    display:flex;
    flex-shrink:0;
    margin-left:auto
}
._2f6jkt56WH7nOUVzbYUJO5{
    font-size:1rem
}
._2f6jkt56WH7nOUVzbYUJO5>span{
    font-size:.8rem;
    margin-left:.5rem
}
.GAagiRXJU88Nul1M7Ai0H{
    color:#1d2129;
    font-size:1.1rem;
    line-height:2rem;
    margin-top:1rem;
    overflow-x:auto;
    overflow-y:hidden;
    position:relative;
    word-wrap:break-word
}
.GAagiRXJU88Nul1M7Ai0H ._2NvIxtxX24tD_bmgtEqQTR{
    max-height:10rem;
    overflow:hidden;
    position:relative
}
.GAagiRXJU88Nul1M7Ai0H ._2cNsJna0_hV8tdMj3X6_gJ{
    padding-left:2px
}
.GAagiRXJU88Nul1M7Ai0H._2Augmn24AqpowQThP1sSib{
    max-height:10rem;
    overflow:auto;
    -webkit-overflow-scrolling:touch
}
.GAagiRXJU88Nul1M7Ai0H ._3THLmIjkTAbx-GTMqvpg2g{
    align-items:flex-end;
    border-radius:4px;
    color:#000;
    display:flex;
    height:2rem;
    left:2px;
    pointer-events:none;
    position:absolute;
    right:0;
    top:8rem
}
.GAagiRXJU88Nul1M7Ai0H ._3THLmIjkTAbx-GTMqvpg2g ._2pq7jyTbK5EiNYJxSPq_lr{
    background:rgba(255,255,255,.8);
    bottom:0;
    height:2rem;
    left:0;
    position:absolute;
    right:0
}
.GAagiRXJU88Nul1M7Ai0H ._3THLmIjkTAbx-GTMqvpg2g span{
    align-items:center;
    border-radius:4px;
    color:#000;
    cursor:pointer;
    display:flex;
    font-size:.85rem;
    font-weight:700;
    height:2rem;
    justify-content:center;
    margin:0 .5rem;
    padding:0 .5rem;
    pointer-events:all;
    position:relative;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    width:100%;
    z-index:4
}
.GAagiRXJU88Nul1M7Ai0H ._3THLmIjkTAbx-GTMqvpg2g span:active{
    background:#f0f0f0
}
.GAagiRXJU88Nul1M7Ai0H a{
    color:#2574a9
}
.GAagiRXJU88Nul1M7Ai0H [data-ast-root]{
    display:block
}
[data-app-dm] .GAagiRXJU88Nul1M7Ai0H{
    color:#ccc6c0
}
[data-app-dm] .GAagiRXJU88Nul1M7Ai0H a{
    color:#3498db
}
._18flz-xF1_9chWzYV0tGRk{
    display:flex;
    flex-direction:column;
    margin-top:1rem
}
._3ExaynSI6tUp5h1U50MHtI{
    justify-content:space-between;
    width:100%
}
._3ExaynSI6tUp5h1U50MHtI,._3ExaynSI6tUp5h1U50MHtI .T69kXMHY3_dR6eDsb5jld{
    align-items:center;
    display:flex;
    flex-direction:row
}
._3ExaynSI6tUp5h1U50MHtI .T69kXMHY3_dR6eDsb5jld{
    flex-grow:1
}
._3ExaynSI6tUp5h1U50MHtI .GKBb8H3C1rQXr8OpTp-hm{
    color:#aaa;
    font-size:1.1rem;
    margin-left:.8rem;
    transition:color .1s ease
}
._3ExaynSI6tUp5h1U50MHtI .GKBb8H3C1rQXr8OpTp-hm._1-XSSFhyp_IqsNtkxu_izq{
    cursor:pointer
}
._3ExaynSI6tUp5h1U50MHtI .GKBb8H3C1rQXr8OpTp-hm._1-XSSFhyp_IqsNtkxu_izq:hover,._3ExaynSI6tUp5h1U50MHtI .GKBb8H3C1rQXr8OpTp-hm.RvwcCeEUQp3tSrTu3gTlh{
    color:#fbc308
}
._3ExaynSI6tUp5h1U50MHtI .FV7ERXXidvVujmAqBHlC7{
    align-items:center;
    color:#aaa;
    cursor:pointer;
    display:flex;
    float:right;
    font-size:.9rem;
    height:1.6rem;
    margin-left:.8rem
}
._3ExaynSI6tUp5h1U50MHtI .FV7ERXXidvVujmAqBHlC7>i{
    font-size:1rem;
    padding-right:.2rem
}
._3ExaynSI6tUp5h1U50MHtI ._3imUf8qB9LmLpk_t5PjDm4{
    align-items:center;
    background:#f6f6f6;
    border-radius:4px;
    color:#aaa;
    display:flex;
    height:2rem;
    vertical-align:bottom
}
._3ExaynSI6tUp5h1U50MHtI ._3imUf8qB9LmLpk_t5PjDm4.wlg9HJM1bKIm99Vut98bQ:hover i{
    color:#000!important
}
[data-app-dm] ._3ExaynSI6tUp5h1U50MHtI ._3imUf8qB9LmLpk_t5PjDm4.wlg9HJM1bKIm99Vut98bQ:hover i{
    color:#fff!important
}
._3ExaynSI6tUp5h1U50MHtI ._3imUf8qB9LmLpk_t5PjDm4._2G_rdc24SRvFsluRYwsU1d{
    pointer-events:none
}
._3ExaynSI6tUp5h1U50MHtI ._3imUf8qB9LmLpk_t5PjDm4 label._1FvthqQq8XgsYw15uyyFr1{
    color:#fbc308
}
._3ExaynSI6tUp5h1U50MHtI ._3imUf8qB9LmLpk_t5PjDm4 label._6mI6KpemwayQCPrAXTce8{
    color:#cf000f
}
._3ExaynSI6tUp5h1U50MHtI ._3imUf8qB9LmLpk_t5PjDm4+._3imUf8qB9LmLpk_t5PjDm4{
    margin-left:.5rem
}
._3ExaynSI6tUp5h1U50MHtI ._3imUf8qB9LmLpk_t5PjDm4._2uOfnWiCM-5WPpmwUkowlF>div:not(:first-child){
    margin-left:-6px
}
._1S6ADqrpTbKVp7YiZID0vB{
    background:#f6f6f6;
    border-radius:4px;
    color:#1d2129;
    margin-top:1rem;
    padding:.8rem
}
[data-app-dm] ._1S6ADqrpTbKVp7YiZID0vB{
    color:#ccc6c0
}
._1S6ADqrpTbKVp7YiZID0vB a{
    color:#2574a9
}
[data-app-dm] ._1S6ADqrpTbKVp7YiZID0vB a{
    color:#3498db
}
[data-app-dm] ._3imUf8qB9LmLpk_t5PjDm4{
    background:#333
}
[data-app-dm] .rBpBkc4uTvfskasqoALQM ._3imUf8qB9LmLpk_t5PjDm4{
    background:#3a3a3a;
    border-color:#5a5a5a
}
[data-app-dm] ._18flz-xF1_9chWzYV0tGRk ._1S6ADqrpTbKVp7YiZID0vB{
    background:#333
}
[data-app-fs=xs] .GAagiRXJU88Nul1M7Ai0H{
    font-size:.9rem;
    margin-top:10px
}
[data-app-fs=xs] ._2bokd4pLvU5_-Lc97NVqzn{
    padding:12px
}
[data-app-fs=xs] ._18flz-xF1_9chWzYV0tGRk{
    margin-top:10px
}
[data-app-fs=xs] ._2cNsJna0_hV8tdMj3X6_gJ{
    line-height:1.6
}
[data-app-fs=s] .GAagiRXJU88Nul1M7Ai0H{
    font-size:1rem;
    margin-top:12px
}
[data-app-fs=s] ._2bokd4pLvU5_-Lc97NVqzn{
    padding:14px
}
[data-app-fs=s] ._18flz-xF1_9chWzYV0tGRk{
    margin-top:12px
}
[data-app-fs=s] ._2cNsJna0_hV8tdMj3X6_gJ{
    line-height:1.7
}
[data-app-fs=l] .GAagiRXJU88Nul1M7Ai0H{
    font-size:1.2rem
}
[data-app-fs=xl] .GAagiRXJU88Nul1M7Ai0H{
    font-size:1.3rem
}
.XZN7Rar7vDnysHx0CPHip{
    color:#aaa;
    font-size:.9rem;
    margin-top:0
}
[data-app-dm] .XZN7Rar7vDnysHx0CPHip{
    color:#aaa6a0
}
._3Z0AAjMcrjawYdjj--TbyW{
    display:none
}
.rBpBkc4uTvfskasqoALQM{
    background:#ffffe5
}
[data-app-of] .rBpBkc4uTvfskasqoALQM{
    border:0 solid #e0e0c3;
    border-width:1px 0!important
}
[data-app-dm] .rBpBkc4uTvfskasqoALQM{
    background:#343332
}
@media(max-width:767px){
    ._2bokd4pLvU5_-Lc97NVqzn{
        padding:1rem
    }
    .GAagiRXJU88Nul1M7Ai0H img{
        max-height:auto;
        max-width:100%
    }
    ._2PMwePWhQ_2LBTTaXyanzO{
        margin-left:auto
    }
}
._36ZEkSvpdj_igmog0nluzh+._36ZEkSvpdj_igmog0nluzh{
    margin-top:.5rem
}
[data-app-of] ._36ZEkSvpdj_igmog0nluzh+._36ZEkSvpdj_igmog0nluzh{
    margin:0
}
._1gqh4Vef81jiEXa4TfGM0d{
    background:#fff;
    margin:1rem 0;
    padding:.5rem;
    text-align:center
}
[data-app-dm] ._1gqh4Vef81jiEXa4TfGM0d{
    background:#1d1d1d;
    color:#fbc308
}
._3t1IIUwX87Q7giYt9CBgsT{
    margin-top:.5rem;
    position:relative;
    text-align:center
}
._3t1IIUwX87Q7giYt9CBgsT>iframe{
    background-color:#e7e7e7;
    border:0;
    left:0;
    position:relative;
    top:0;
    width:100%
}
[data-app-dm] ._3t1IIUwX87Q7giYt9CBgsT{
    opacity:.8
}
[data-app-dm] ._3t1IIUwX87Q7giYt9CBgsT>iframe{
    background-color:#000
}
._1PNOfvkMOqN_SB5oqyF3ff{
    display:inline-block;
    height:1.6rem;
    line-height:1.6rem;
    text-align:center;
    vertical-align:middle;
    width:2rem
}
._1PNOfvkMOqN_SB5oqyF3ff._1jvTHwVJobs9nsM0JDYqKB{
    color:#fbc308
}
._1PNOfvkMOqN_SB5oqyF3ff._2_VFV1QOZok8YhOTGa_3h9{
    color:#cf000f
}
[data-app-dm] ._1PNOfvkMOqN_SB5oqyF3ff._2_VFV1QOZok8YhOTGa_3h9{
    color:#c0392b
}
span+._1PNOfvkMOqN_SB5oqyF3ff{
    margin-left:-.4em
}
._1PNOfvkMOqN_SB5oqyF3ff input{
    display:none
}
._1PNOfvkMOqN_SB5oqyF3ff input[disabled]:checked+label{
    -webkit-animation:none;
    animation:none;
    color:inherit!important
}
._1PNOfvkMOqN_SB5oqyF3ff input:not([disabled]):checked+label{
    -webkit-animation:_1Kzi7RAWZmI8xOJGzsQLjT .5s cubic-bezier(.17,.89,.32,1.49)!important;
    animation:_1Kzi7RAWZmI8xOJGzsQLjT .5s cubic-bezier(.17,.89,.32,1.49)!important;
    color:inherit!important;
    filter:none;
    position:relative
}
._1PNOfvkMOqN_SB5oqyF3ff input:not([disabled]):checked+label:after,._1PNOfvkMOqN_SB5oqyF3ff input:not([disabled]):checked+label:before{
    -webkit-animation:inherit;
    animation:inherit;
    -webkit-animation-timing-function:ease-out;
    animation-timing-function:ease-out;
    display:block
}
._1PNOfvkMOqN_SB5oqyF3ff input:not([disabled]):checked+label:before{
    -webkit-animation-name:_23Yy57Xn01WS2BKF4CCbcx;
    animation-name:_23Yy57Xn01WS2BKF4CCbcx
}
._1PNOfvkMOqN_SB5oqyF3ff input:not([disabled]):checked+label:after{
    -webkit-animation-name:GLhRTJyP8ixe6-6U68QIC;
    animation-name:GLhRTJyP8ixe6-6U68QIC
}
._1PNOfvkMOqN_SB5oqyF3ff label{
    color:#aaa;
    cursor:pointer;
    display:block;
    font-size:1.1rem;
    height:100%;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    width:100%;
    z-index:1
}
._1PNOfvkMOqN_SB5oqyF3ff label:after,._1PNOfvkMOqN_SB5oqyF3ff label:before{
    border-radius:50%;
    content:"";
    display:none;
    height:0;
    left:50%;
    position:absolute;
    top:50%;
    width:0;
    z-index:-1
}
._1PNOfvkMOqN_SB5oqyF3ff label:before{
    border:1px solid;
    box-sizing:border-box;
    transform:translate(-50%,-50%)
}
._1PNOfvkMOqN_SB5oqyF3ff label:after{
    box-shadow:.17321rem -1.6rem 0 -.1rem,-.17321rem -1.4rem 0 -.1rem,1.35892rem -.86217rem 0 -.1rem,.98657rem -1.0083rem 0 -.1rem,1.52134rem .5249rem 0 -.1rem,1.40344rem .14267rem 0 -.1rem,.53816rem 1.5167rem 0 -.1rem,.76349rem 1.18621rem 0 -.1rem,-.85027rem 1.3664rem 0 -.1rem,-.45138rem 1.33651rem 0 -.1rem,-1.59843rem .18717rem 0 -.1rem,-1.32636rem .48039rem 0 -.1rem,-1.14294rem -1.133rem 0 -.1rem,-1.20256rem -.73747rem 0 -.1rem;
    height:.2rem;
    margin:-.1rem;
    opacity:0;
    width:.2rem
}
._1PNOfvkMOqN_SB5oqyF3ff label:hover{
    color:#000
}
._1PNOfvkMOqN_SB5oqyF3ff label [class*=i-thumb-]{
    font-size:.85rem
}
._1yxPOd27pAzF9olhItRDej{
    border-radius:5px;
    display:inline-block;
    font-size:.7rem;
    height:1.6rem;
    line-height:1.6rem;
    min-width:1rem;
    padding:0 1em 0 .2em;
    text-align:center;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    vertical-align:middle
}
._1yxPOd27pAzF9olhItRDej._2iRKJuMIV77zdwLRreUgLK{
    margin-left:-.6em;
    margin-right:0
}
._1yxPOd27pAzF9olhItRDej.fwz7EAJf0xH1roth-lpPA{
    margin-left:-.4rem
}
._1yxPOd27pAzF9olhItRDej._1jvTHwVJobs9nsM0JDYqKB{
    color:#fbc308
}
._1yxPOd27pAzF9olhItRDej._2_VFV1QOZok8YhOTGa_3h9{
    color:#cf000f
}
[data-app-dm] ._1yxPOd27pAzF9olhItRDej._2_VFV1QOZok8YhOTGa_3h9{
    color:#c0392b
}
._1yxPOd27pAzF9olhItRDej._2jCi-nhFFNpr_0FsRWzNzK{
    cursor:pointer
}
[data-app-dm] ._1PNOfvkMOqN_SB5oqyF3ff label:hover{
    color:#fff
}
@-webkit-keyframes _1Kzi7RAWZmI8xOJGzsQLjT{
    0%,17.5%{
        font-size:0
    }
}
@keyframes _1Kzi7RAWZmI8xOJGzsQLjT{
    0%,17.5%{
        font-size:0
    }
}
@-webkit-keyframes GLhRTJyP8ixe6-6U68QIC{
    0%,20%{
        opacity:0
    }
    25%{
        box-shadow:.17321rem -1.35rem 0 0,-.17321rem -1.15rem 0 0,1.16346rem -.70629rem 0 0,.79111rem -.85243rem 0 0,1.27761rem .46927rem 0 0,1.15971rem .08704rem 0 0,.42969rem 1.29146rem 0 0,.65502rem .96096rem 0 0,-.7418rem 1.14116rem 0 0,-.34291rem 1.11127rem 0 0,-1.35469rem .13154rem 0 0,-1.08263rem .42476rem 0 0,-.94748rem -.97713rem 0 0,-1.0071rem -.5816rem 0 0;
        opacity:1
    }
}
@keyframes GLhRTJyP8ixe6-6U68QIC{
    0%,20%{
        opacity:0
    }
    25%{
        box-shadow:.17321rem -1.35rem 0 0,-.17321rem -1.15rem 0 0,1.16346rem -.70629rem 0 0,.79111rem -.85243rem 0 0,1.27761rem .46927rem 0 0,1.15971rem .08704rem 0 0,.42969rem 1.29146rem 0 0,.65502rem .96096rem 0 0,-.7418rem 1.14116rem 0 0,-.34291rem 1.11127rem 0 0,-1.35469rem .13154rem 0 0,-1.08263rem .42476rem 0 0,-.94748rem -.97713rem 0 0,-1.0071rem -.5816rem 0 0;
        opacity:1
    }
}
@-webkit-keyframes _23Yy57Xn01WS2BKF4CCbcx{
    0%{
        height:0;
        width:0
    }
    0%,10%{
        background:#888;
        border:0 solid #888
    }
    20%{
        background:0 0;
        border:2px solid #fbc308
    }
    30%{
        border-width:2px;
        height:2.5rem;
        opacity:.5;
        width:2.5rem
    }
    75%{
        border-width:0
    }
    to{
        height:2.5rem;
        opacity:0;
        width:2.5rem
    }
}
@keyframes _23Yy57Xn01WS2BKF4CCbcx{
    0%{
        height:0;
        width:0
    }
    0%,10%{
        background:#888;
        border:0 solid #888
    }
    20%{
        background:0 0;
        border:2px solid #fbc308
    }
    30%{
        border-width:2px;
        height:2.5rem;
        opacity:.5;
        width:2.5rem
    }
    75%{
        border-width:0
    }
    to{
        height:2.5rem;
        opacity:0;
        width:2.5rem
    }
}
._2QLPqUPPLd8fXI2JwZuY7A{
    background:#fff;
    border-bottom:.5px solid #d9d9d9;
    color:#222;
    display:flex;
    flex-shrink:0;
    font-size:1.1rem;
    height:3rem;
    line-height:3rem;
    position:relative;
    width:100%;
    z-index:4
}
._2QLPqUPPLd8fXI2JwZuY7A._2koljBf8hd8vd_z0C5s8BV{
    background:#217347;
    color:#fff
}
[data-app-tv] ._2QLPqUPPLd8fXI2JwZuY7A._2koljBf8hd8vd_z0C5s8BV{
    background:#2b579b
}
[data-app-dm] ._2QLPqUPPLd8fXI2JwZuY7A{
    background:#222;
    border-bottom:.5px solid #3b3a39;
    color:#fbc308
}
[data-app-dm][data-app-mb] ._2QLPqUPPLd8fXI2JwZuY7A{
    color:#fff
}
._1gUiNP0DXim6f5CvBTx7T7>span,._2k_IfadJWjcLJlSKkz_R2-{
    font-size:1.2rem;
    overflow:hidden;
    padding:0 .7rem;
    text-overflow:ellipsis;
    white-space:nowrap
}
._1gUiNP0DXim6f5CvBTx7T7>span i,._2k_IfadJWjcLJlSKkz_R2- i{
    font-size:1.2rem
}
._2k_IfadJWjcLJlSKkz_R2-{
    display:flex;
    flex-grow:1
}
._2k_IfadJWjcLJlSKkz_R2->*{
    float:left
}
._2k_IfadJWjcLJlSKkz_R2->span{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
}
[data-app-of] ._2k_IfadJWjcLJlSKkz_R2->span{
    font-size:.9rem;
    left:50%;
    position:absolute;
    transform:translateX(-50%)
}
[data-app-mb] ._2k_IfadJWjcLJlSKkz_R2->span{
    font-size:1.1rem;
    text-align:center;
    width:100%
}
.Po8iCa0b9ZUovZ9Ofa_Gk{
    margin-left:-.58em;
    margin-right:.4rem;
    padding:0 .8rem
}
._1gUiNP0DXim6f5CvBTx7T7>span,.eaWAxpidGy5I-mbexmmZy{
    cursor:pointer;
    transition:background .1s ease-in-out;
    will-change:background
}
._1gUiNP0DXim6f5CvBTx7T7>span:hover,.Po8iCa0b9ZUovZ9Ofa_Gk:hover,.eaWAxpidGy5I-mbexmmZy:hover{
    background:rgba(128,128,128,.25)
}
.eaWAxpidGy5I-mbexmmZy{
    align-items:center;
    display:flex;
    justify-content:center;
    z-index:2
}
.eaWAxpidGy5I-mbexmmZy>i{
    font-size:1.2rem;
    position:relative
}
.eaWAxpidGy5I-mbexmmZy>i._1zPDlith27IMG4J3B4sHcc:after{
    background:#fbc308;
    border-radius:50%;
    box-shadow:0 0 6px rgba(251,195,8,.5);
    content:"";
    height:8px;
    margin:-9px -1px;
    position:absolute;
    right:0;
    top:50%;
    width:8px
}
.eaWAxpidGy5I-mbexmmZy:not(._2j_hVc9GC_fDjpydwjMxnW){
    width:3.5rem
}
.eaWAxpidGy5I-mbexmmZy:not(._2j_hVc9GC_fDjpydwjMxnW)>i{
    margin-left:-1rem;
    padding-right:.25rem
}
.eaWAxpidGy5I-mbexmmZy:not(._2j_hVc9GC_fDjpydwjMxnW)>i._1zPDlith27IMG4J3B4sHcc:after{
    margin:-9px 3px
}
.eaWAxpidGy5I-mbexmmZy._2j_hVc9GC_fDjpydwjMxnW{
    padding:0 .6rem
}
.eaWAxpidGy5I-mbexmmZy._1Az77FZNlF30Cf0Tta1SJl{
    margin-left:-.75rem;
    margin-right:1rem
}
._1LG9rEYF-ZGy3DZIlht7wo{
    display:flex;
    flex-grow:1;
    padding:0
}
._1LG9rEYF-ZGy3DZIlht7wo>._3V1lN0nDwZVDoc14rz7D8w{
    height:100%;
    left:0;
    position:absolute;
    text-align:center;
    width:100%;
    z-index:-1
}
[data-app-of] ._1LG9rEYF-ZGy3DZIlht7wo>._3V1lN0nDwZVDoc14rz7D8w{
    color:#a6cbb7;
    font-size:.75rem;
    line-height:1.8rem
}
._1gUiNP0DXim6f5CvBTx7T7,._1gUiNP0DXim6f5CvBTx7T7>span{
    display:flex;
    z-index:2
}
._1gUiNP0DXim6f5CvBTx7T7>span:last-child{
    padding-right:.7rem
}
._3UWhC8w0s5w1-V4_sdp4Yd{
    color:#000
}
[data-app-dm] ._3UWhC8w0s5w1-V4_sdp4Yd,[data-app-of] ._3UWhC8w0s5w1-V4_sdp4Yd{
    color:#fff
}
@media(max-width:767px){
    [data-app-dm] ._3UWhC8w0s5w1-V4_sdp4Yd{
        color:#fbc308
    }
}
._3UWhC8w0s5w1-V4_sdp4Yd:hover{
    text-decoration:none
}
.ozrBNVWlaHP7dx-mUf7p2,.CrheYfsiQFY-vLMnO378W{
    display:flex;
    justify-content:space-between;
    position:relative
}
[data-app-dm] .ozrBNVWlaHP7dx-mUf7p2,[data-app-dm] .CrheYfsiQFY-vLMnO378W{
    margin-top:0
}
.ozrBNVWlaHP7dx-mUf7p2{
    border-right:1px solid #e0e0e0;
    flex-basis:30%;
    flex-shrink:0;
    max-width:480px;
    min-width:300px
}
[data-app-dm] .ozrBNVWlaHP7dx-mUf7p2{
    border-color:#3b3a39
}
.CrheYfsiQFY-vLMnO378W{
    flex-grow:1;
    overflow:hidden
}
.CrheYfsiQFY-vLMnO378W span{
    position:relative
}
.CrheYfsiQFY-vLMnO378W span select{
    -webkit-appearance:none;
    -moz-appearance:none;
    appearance:none;
    bottom:0;
    cursor:pointer;
    left:0;
    opacity:0;
    position:absolute;
    right:0;
    top:0;
    width:100%
}
body:not([data-app-tv]):not([data-app-sm]) .ozrBNVWlaHP7dx-mUf7p2{
    border:0;
    flex-basis:100%;
    max-width:none
}
body:not([data-app-tv]):not([data-app-sm]) .CrheYfsiQFY-vLMnO378W,body[data-app-tv]:not([data-app-sm]) .ozrBNVWlaHP7dx-mUf7p2{
    display:none
}
@media(max-width:767px){
    ._1LG9rEYF-ZGy3DZIlht7wo>._3V1lN0nDwZVDoc14rz7D8w{
        padding-left:0;
        text-align:center
    }
    .ozrBNVWlaHP7dx-mUf7p2,.CrheYfsiQFY-vLMnO378W{
        flex-basis:100%;
        margin-top:0;
        max-width:none;
        position:relative;
        width:100%
    }
    .ozrBNVWlaHP7dx-mUf7p2{
        border:0
    }
    .ozrBNVWlaHP7dx-mUf7p2 ._1gUiNP0DXim6f5CvBTx7T7,[data-app-tv] .ozrBNVWlaHP7dx-mUf7p2{
        display:none
    }
    ._2QLPqUPPLd8fXI2JwZuY7A{
        left:0;
        position:fixed;
        top:0;
        transition:transform .3s ease;
        width:100%;
        will-change:transform
    }
    ._2QLPqUPPLd8fXI2JwZuY7A._2TGjRqy4HZOetvEnAViFOg{
        transform:none
    }
    ._2QLPqUPPLd8fXI2JwZuY7A._2I64HtzXifGnzVwEZLvbxW{
        transform:translateY(calc(-100% - 1px))
    }
}
._1H_MPAqZWxI0DjGT6LORkT{
    bottom:0;
    height:100vh;
    left:0;
    pointer-events:none;
    position:absolute;
    right:0;
    -webkit-tap-highlight-color:transparent;
    top:0;
    z-index:20
}
@media screen and (device-aspect-ratio:40/71){
    ._1H_MPAqZWxI0DjGT6LORkT{
        height:100%
    }
}
._1H_MPAqZWxI0DjGT6LORkT.XzWAVmlsvxWg6FocSvGT1{
    pointer-events:auto
}
._3DGiuOeHzi-9xAeU4GPqcb{
    background:rgba(160,160,160,.5);
    height:100%;
    left:0;
    opacity:0;
    position:absolute;
    top:0;
    width:100%;
    will-change:opacity;
    z-index:40
}
[data-app-dm] ._3DGiuOeHzi-9xAeU4GPqcb{
    background:rgba(0,0,0,.5)
}
._2avg7BNCZG5kjB9vMIsfGj{
    -webkit-backdrop-filter:blur(5px);
    backdrop-filter:blur(5px);
    background:rgba(255,255,255,.8);
    display:flex;
    height:100%;
    left:-280px;
    padding:0;
    position:absolute;
    top:0;
    width:280px;
    will-change:left;
    z-index:41
}
[data-app-dm] ._2avg7BNCZG5kjB9vMIsfGj{
    background:rgba(34,34,34,.8)
}
._3X90D_ML0WVNyHciRfxUvy{
    cursor:pointer;
    transition:all .4s cubic-bezier(.2,.6,.2,1)
}
._3X90D_ML0WVNyHciRfxUvy:hover{
    transform:scale(1.2)
}
._3X90D_ML0WVNyHciRfxUvy:not(:hover){
    -webkit-animation:_3z0DD7Sli3q69Ok24SBTi9 2s 1s infinite;
    animation:_3z0DD7Sli3q69Ok24SBTi9 2s 1s infinite
}
._3X90D_ML0WVNyHciRfxUvy:active{
    opacity:.6
}
@-webkit-keyframes _3z0DD7Sli3q69Ok24SBTi9{
    0%{
        opacity:1
    }
    10%{
        opacity:.1
    }
    20%{
        opacity:1
    }
    30%{
        opacity:.1
    }
    40%{
        opacity:1
    }
    to{
        opacity:1
    }
}
@keyframes _3z0DD7Sli3q69Ok24SBTi9{
    0%{
        opacity:1
    }
    10%{
        opacity:.1
    }
    20%{
        opacity:1
    }
    30%{
        opacity:.1
    }
    40%{
        opacity:1
    }
    to{
        opacity:1
    }
}
._3dwGLtjqTgI2gc9wpc7FuT{
    align-items:center;
    background:#ececec;
    display:flex;
    flex-direction:column;
    padding:1rem .6rem calc(1rem + 0px) calc(.7rem + 0px);
    padding:1rem .6rem calc(1rem + env(safe-area-inset-bottom)) calc(.7rem + env(safe-area-inset-left));
}
[data-app-dm] ._3dwGLtjqTgI2gc9wpc7FuT{
    background:#151515
}
._38cETpC7CvdV4cuqQyi0WL{
    display:flex;
    flex:1 1;
    flex-direction:column;
    justify-content:space-between;
    margin-bottom:-.75rem;
    margin-top:.75rem
}
[data-app-mb] ._38cETpC7CvdV4cuqQyi0WL{
    justify-content:flex-end
}
._3chEw1COjDsJDNGekjbxKP{
    display:flex;
    flex-direction:column
}
.N2cYkiBvgSpE7_vkSHaC3{
    color:#999;
    cursor:pointer;
    font-size:1.6rem;
    padding:.75rem 0;
    position:relative
}
.N2cYkiBvgSpE7_vkSHaC3.OsTE-x7Nw9xldcaMmAieq:after{
    background:#e74c3c;
    border-radius:50%;
    box-shadow:0 0 6px rgba(251,195,8,.5);
    content:"";
    height:8px;
    margin:-9px -1px;
    position:absolute;
    right:0;
    top:50%;
    width:8px
}
[data-app-ho] .N2cYkiBvgSpE7_vkSHaC3:hover{
    color:#222
}
[data-app-ho][data-app-dm] .N2cYkiBvgSpE7_vkSHaC3:hover{
    color:#fff
}
._2GMtzY88ddbLM34UUx7bzP{
    position:relative
}
._2GMtzY88ddbLM34UUx7bzP>i{
    font-size:1.5rem;
    left:.5rem;
    position:absolute;
    top:50%;
    transform:translateY(-50%);
    z-index:1
}
input._1T-sxyP9sVSHKzn4lJ6SVL{
    background:#ececec;
    border:0;
    margin:0;
    min-width:0;
    padding-left:3.1rem;
    padding-right:1.5rem;
    width:100%
}
._6cl3rzSaYjXj86SGm9szW{
    cursor:pointer;
    font-size:.8rem;
    height:100%;
    padding:0 .5rem;
    position:absolute;
    right:0;
    top:0
}
._1pKm96NYq9lg2cskII3lri{
    display:flex;
    flex:1 1;
    flex-direction:column
}
._2QoIxw-80BRX_K23u1GtQW{
    padding:.4rem 0
}
._2AXCdyGktboKS8qRqewk1z{
    display:flex;
    flex:1 1;
    -webkit-mask-image:linear-gradient(180deg,transparent 0,black 20px);
    mask-image:linear-gradient(180deg,transparent 0,black 20px);
    overflow:auto;
    -webkit-overflow-scrolling:touch;
    -ms-overflow-style:-ms-autohiding-scrollbar;
    position:relative
}
._2AXCdyGktboKS8qRqewk1z:after,._2AXCdyGktboKS8qRqewk1z:before{
    content:"";
    height:20px;
    left:0;
    position:absolute;
    right:0;
    z-index:1
}
._2AXCdyGktboKS8qRqewk1z:before{
    background:linear-gradient(0deg,rgba(245,245,245,1) 10%,rgba(245,245,245,0));
    bottom:0
}
[data-app-dm] ._2AXCdyGktboKS8qRqewk1z:before{
    background:linear-gradient(0deg,rgba(29,29,29,1) 10%,rgba(29,29,29,0))
}
._2AXCdyGktboKS8qRqewk1z>div{
    overflow:auto
}
._2AXCdyGktboKS8qRqewk1z>div>div{
    padding:.4rem 0 calc(.5rem + 0px);
    padding:.4rem 0 calc(.5rem + env(safe-area-inset-bottom));
}
._7xyMOINeY7m0TnLbn4Bt-{
    color:#222;
    cursor:pointer;
    display:inline-block;
    font-size:1rem;
    padding:.8rem 1.2rem;
    text-align:left;
    transition:color .1s ease-in;
    width:100%;
    will-change:color
}
._7xyMOINeY7m0TnLbn4Bt-.p0E5HQkRpPjAR5PdUhD80{
    margin-top:1rem;
    width:100%!important
}
._2QoIxw-80BRX_K23u1GtQW ._7xyMOINeY7m0TnLbn4Bt-{
    align-items:center;
    display:flex;
    padding:.4rem 0 .4rem 12%
}
._2AXCdyGktboKS8qRqewk1z ._7xyMOINeY7m0TnLbn4Bt-{
    display:inline-block;
    padding:.5rem 0 .5rem 12%;
    width:50%
}
._7xyMOINeY7m0TnLbn4Bt-:hover{
    text-decoration:none
}
._7xyMOINeY7m0TnLbn4Bt-._3r1IHxQmPXBvEnsjt8HDDe,[data-app-ho] ._7xyMOINeY7m0TnLbn4Bt-:hover{
    color:#fbc308!important
}
[data-app-dm] ._7xyMOINeY7m0TnLbn4Bt-{
    color:#ddd
}
._7xyMOINeY7m0TnLbn4Bt->*{
    pointer-events:none
}
._7xyMOINeY7m0TnLbn4Bt- i{
    display:inline-block;
    font-size:1.5rem;
    margin-left:-2px;
    margin-right:.4rem;
    position:relative;
    vertical-align:middle;
    width:2.3rem
}
.b9LMPQuL_4lPd5PxnJQHI{
    background:#e74c3c;
    border-radius:8px;
    color:#fff;
    display:flex;
    font-family:Helvetica Neue,Helvetica,Arial,Microsoft JhengHei,sans-serif;
    font-size:.7rem;
    font-style:normal;
    height:16px;
    justify-content:center;
    left:50%;
    line-height:16px;
    margin:-16px 0;
    min-width:16px;
    padding:0 3px;
    position:absolute;
    top:50%
}
.b9LMPQuL_4lPd5PxnJQHI:after{
    content:attr(data-count)
}
._2iPo6CoRyHD43Uga-XjKsq{
    color:#aaa;
    font-size:.8rem;
    padding:.6rem 0 .2rem 12%
}
[data-app-dm] ._2iPo6CoRyHD43Uga-XjKsq{
    color:#666
}
@media(max-width:767px){
    ._2avg7BNCZG5kjB9vMIsfGj,._3DGiuOeHzi-9xAeU4GPqcb{
        position:fixed
    }
    .f632hziSwgAWWoYF1ojts{
        display:none
    }
}
@media(-ms-high-contrast:none),screen and (-ms-high-contrast:active){
    ._2avg7BNCZG5kjB9vMIsfGj{
        background:#fff
    }
    [data-app-dm] ._2avg7BNCZG5kjB9vMIsfGj{
        background:#222
    }
    ._3dwGLtjqTgI2gc9wpc7FuT,input._1T-sxyP9sVSHKzn4lJ6SVL{
        background:#f5f5f5
    }
    ._2AXCdyGktboKS8qRqewk1z:before{
        background:linear-gradient(180deg,#fff,rgba(255,255,255,0));
        top:0
    }
    [data-app-dm] ._2AXCdyGktboKS8qRqewk1z:before{
        background:linear-gradient(180deg,#222,rgba(34,34,34,0))
    }
    ._2AXCdyGktboKS8qRqewk1z:after{
        background:linear-gradient(0deg,#fff,rgba(255,255,255,0));
        bottom:0
    }
    [data-app-dm] ._2AXCdyGktboKS8qRqewk1z:after{
        background:linear-gradient(0deg,#222,rgba(34,34,34,0))
    }
}
@supports not ((-webkit-backdrop-filter:blur(5px)) or (backdrop-filter:blur(5px))){
    ._2avg7BNCZG5kjB9vMIsfGj{
        background:#fff
    }
    [data-app-dm] ._2avg7BNCZG5kjB9vMIsfGj{
        background:#222
    }
    ._3dwGLtjqTgI2gc9wpc7FuT,input._1T-sxyP9sVSHKzn4lJ6SVL{
        background:#f5f5f5
    }
    ._2AXCdyGktboKS8qRqewk1z:before{
        background:linear-gradient(180deg,#fff,rgba(255,255,255,0));
        top:0
    }
    [data-app-dm] ._2AXCdyGktboKS8qRqewk1z:before{
        background:linear-gradient(180deg,#222,rgba(34,34,34,0))
    }
    ._2AXCdyGktboKS8qRqewk1z:after{
        background:linear-gradient(0deg,#fff,rgba(255,255,255,0));
        bottom:0
    }
    [data-app-dm] ._2AXCdyGktboKS8qRqewk1z:after{
        background:linear-gradient(0deg,#222,rgba(34,34,34,0))
    }
}
._1DZ_Nn0pmLuOkdbW3sB_4B{
    -webkit-backdrop-filter:blur(5px);
    backdrop-filter:blur(5px);
    background:rgba(251,195,8,.8);
    bottom:0;
    box-sizing:content-box;
    display:flex;
    font-size:1.1rem;
    height:3rem;
    left:0;
    line-height:3rem;
    margin-left:0px;
    margin-right:0px;
    padding-bottom:0px;
    margin-left:env(safe-area-inset-left);
    margin-right:env(safe-area-inset-right);
    padding-bottom:env(safe-area-inset-bottom);
    position:fixed;
    text-shadow:0 1px rgba(255,255,255,.25);
    width:calc(100vw - 0px - 0px);
    width:calc(100vw - env(safe-area-inset-right) - env(safe-area-inset-left));
    width:calc(100vw - constant(safe-area-inset-right) - constant(safe-area-inset-left));
    z-index:4
}
[data-app-dm] ._1DZ_Nn0pmLuOkdbW3sB_4B{
    background:rgba(0,0,0,.8)
}
._1DZ_Nn0pmLuOkdbW3sB_4B span{
    cursor:pointer;
    display:flex;
    flex-grow:1;
    font-size:1.5rem;
    height:100%;
    justify-content:center;
    position:relative
}
[data-app-ho] ._1DZ_Nn0pmLuOkdbW3sB_4B span:hover{
    background:rgba(128,128,128,.25)
}
._1DZ_Nn0pmLuOkdbW3sB_4B span select{
    -webkit-appearance:none;
    -moz-appearance:none;
    appearance:none;
    bottom:0;
    left:0;
    opacity:0;
    position:absolute;
    right:0;
    top:0;
    width:100%
}
._1DZ_Nn0pmLuOkdbW3sB_4B .i-book-open-page-variant{
    margin-top:2px
}
._1DZ_Nn0pmLuOkdbW3sB_4B ._21ResV-QUuYbUy_kuOILz-{
    align-items:center;
    background:#e74c3c;
    border-radius:50%;
    display:flex;
    font-size:.75rem;
    height:10px;
    justify-content:center;
    left:50%;
    margin:-10px 3px;
    position:absolute;
    top:50%;
    width:10px
}
[data-app-dm] ._1DZ_Nn0pmLuOkdbW3sB_4B ._21ResV-QUuYbUy_kuOILz-{
    background:#fbc308
}
@media(-ms-high-contrast:none),screen and (-ms-high-contrast:active){
    ._1DZ_Nn0pmLuOkdbW3sB_4B{
        background:#fbc308
    }
    [data-app-dm] ._1DZ_Nn0pmLuOkdbW3sB_4B{
        background:#000
    }
}
@supports not ((-webkit-backdrop-filter:blur(5px)) or (backdrop-filter:blur(5px))){
    ._1DZ_Nn0pmLuOkdbW3sB_4B{
        background:#fbc308
    }
    [data-app-dm] ._1DZ_Nn0pmLuOkdbW3sB_4B{
        background:#000
    }
}
._2DLdp-7b_R-zIetW0YAyy_{
    color:#999!important;
    display:block;
    font-size:.8rem;
    line-height:1.5rem;
    margin:1.5rem;
    text-align:center
}
._2DLdp-7b_R-zIetW0YAyy_ a{
    color:inherit
}
._2DLdp-7b_R-zIetW0YAyy_ a:hover{
    color:#666;
    text-decoration:none
}
._2DLdp-7b_R-zIetW0YAyy_>.J534MEK4xEQSBHgGW-m0q>a{
    border-left:1px solid rgba(128,128,128,.4);
    margin-left:.5rem;
    padding-left:.5rem
}
._2DLdp-7b_R-zIetW0YAyy_>.J534MEK4xEQSBHgGW-m0q>a:first-child{
    border:0;
    margin:0
}
._1pRFqZrVyCblbDwkwMq-1y{
    display:flex;
    flex-direction:column;
    overflow:hidden;
    padding:1rem;
    pointer-events:none;
    position:fixed;
    right:calc(50vw - 568px);
    top:3rem;
    z-index:1000
}
[data-app-of] ._1pRFqZrVyCblbDwkwMq-1y,[data-app-sm] ._1pRFqZrVyCblbDwkwMq-1y{
    right:0
}
@media(max-width:1135px){
    ._1pRFqZrVyCblbDwkwMq-1y{
        right:0
    }
}
[data-app-mb] ._1pRFqZrVyCblbDwkwMq-1y{
    padding:0;
    top:0;
    width:100%
}
._1s_wk0eHOJolKwsEu0aBML{
    background:rgba(0,0,0,.9);
    border-radius:8px;
    box-shadow:0 2px 6px 0 rgba(0,0,0,.3);
    color:#fff;
    cursor:pointer;
    display:flex;
    flex-direction:column;
    overflow:hidden;
    pointer-events:auto;
    width:300px;
    will-change:transform,opacity;
    z-index:1
}
._1s_wk0eHOJolKwsEu0aBML:hover{
    text-decoration:none
}
._1s_wk0eHOJolKwsEu0aBML+._1s_wk0eHOJolKwsEu0aBML{
    margin-top:1rem
}
[data-app-dm] ._1s_wk0eHOJolKwsEu0aBML{
    background:#444
}
[data-app-of] ._1s_wk0eHOJolKwsEu0aBML{
    background:#efebde;
    border-radius:6px 6px 0 0;
    border:3px solid #0654e8;
    border-top:1px solid #0654e8;
    color:#000
}
[data-app-mb] ._1s_wk0eHOJolKwsEu0aBML{
    border-radius:0;
    left:0;
    margin:0;
    top:0;
    width:100%
}
._1QZVEJH5ZMCgIKr1rNe65I{
    background:#000;
    color:#aaa;
    display:flex;
    padding:.5rem 1rem
}
[data-app-dm] ._1QZVEJH5ZMCgIKr1rNe65I{
    background:#333
}
[data-app-of] ._1QZVEJH5ZMCgIKr1rNe65I{
    background:linear-gradient(180deg,#3391ff 0,#0462ef 20%,#0455e5 50%,#056afe 90%,#0344d3);
    color:#fff;
    padding:.2rem .2rem .2rem .4rem
}
[data-app-of] ._1QZVEJH5ZMCgIKr1rNe65I ._3QJtIkQzHTOWTyegTB1Sj3{
    font-size:.9rem;
    text-shadow:0 1px 2px #000
}
[data-app-of] ._1QZVEJH5ZMCgIKr1rNe65I ._3QJtIkQzHTOWTyegTB1Sj3>i{
    display:none
}
._1QZVEJH5ZMCgIKr1rNe65I ._1HiNwHt51CBWi4MCucAeGo{
    cursor:pointer;
    display:flex;
    font-size:1rem;
    margin-left:.5rem
}
._1QZVEJH5ZMCgIKr1rNe65I ._1HiNwHt51CBWi4MCucAeGo:hover{
    color:#fff
}
[data-app-of] ._1QZVEJH5ZMCgIKr1rNe65I ._1HiNwHt51CBWi4MCucAeGo:last-child{
    background:linear-gradient(135deg,#eb8870,#d93808);
    border:1px solid #fff;
    border-radius:4px;
    font-size:1.4rem
}
[data-app-of] ._1QZVEJH5ZMCgIKr1rNe65I ._1HiNwHt51CBWi4MCucAeGo:last-child:active{
    background:#be3911
}
._3QJtIkQzHTOWTyegTB1Sj3{
    align-items:center;
    display:flex;
    font-size:12px;
    margin-right:auto
}
._3QJtIkQzHTOWTyegTB1Sj3 ._2rbBevr2AdWu9upMt2vzot{
    font-size:1rem;
    margin-bottom:1px;
    margin-right:.5rem
}
.UDqEJW3RKxpgeOTWrPQIe{
    overflow:hidden;
    padding:.5rem 1rem 1rem;
    word-break:break-word
}
.UDqEJW3RKxpgeOTWrPQIe:last-child{
    padding-top:1rem
}
[data-app-of] .UDqEJW3RKxpgeOTWrPQIe{
    font-size:.9rem;
    text-align:center
}
._6roQLI2DErBXxEx1zxTjM{
    display:flex;
    padding:0 1rem 1rem
}
._6roQLI2DErBXxEx1zxTjM ._1HiNwHt51CBWi4MCucAeGo,[data-app-of] ._6roQLI2DErBXxEx1zxTjM{
    justify-content:center
}
._6roQLI2DErBXxEx1zxTjM ._1HiNwHt51CBWi4MCucAeGo{
    align-items:center;
    background:#555;
    border:0;
    border-radius:4px;
    cursor:pointer;
    display:flex;
    flex:1 1;
    font-size:1rem;
    min-height:1.5rem;
    padding:0 1.2rem
}
[data-app-dm] ._6roQLI2DErBXxEx1zxTjM ._1HiNwHt51CBWi4MCucAeGo{
    background:#666
}
[data-app-of] ._6roQLI2DErBXxEx1zxTjM ._1HiNwHt51CBWi4MCucAeGo{
    background:#f8f4f1;
    border:1px dotted #777;
    border-radius:2px;
    box-shadow:0 0 0 1px #75abdf,0 0 0 2px #000;
    flex-grow:0;
    min-height:1rem;
    white-space:nowrap
}
[data-app-of] ._6roQLI2DErBXxEx1zxTjM ._1HiNwHt51CBWi4MCucAeGo:active{
    background:#e3e1df
}
._6roQLI2DErBXxEx1zxTjM ._1HiNwHt51CBWi4MCucAeGo:active{
    background:#444
}
[data-app-dm] ._6roQLI2DErBXxEx1zxTjM ._1HiNwHt51CBWi4MCucAeGo:active{
    background:#555
}
._6roQLI2DErBXxEx1zxTjM ._1HiNwHt51CBWi4MCucAeGo:nth-child(n+2){
    margin-left:1rem
}
.WAy0Ey7yZXz96vkCPtKCd{
    height:122px;
    overflow:hidden;
    width:100%
}
._1hMjP5GDoGpKeAmzOcde13{
    display:flex;
    margin:0 auto;
    max-width:100%;
    overflow:hidden
}
.qS4Iosr432bIbXcjtpG0p{
    background:#000;
    display:flex;
    flex-direction:column;
    height:100%;
    left:0;
    position:fixed;
    top:0;
    width:100%;
    will-change:opacity transform;
    z-index:1001
}
.kuYE8juwPfVTS-qncq1Cp{
    align-items:center;
    display:flex;
    flex:1 1;
    flex-direction:column;
    overflow:auto;
    -webkit-overflow-scrolling:touch
}
.kuYE8juwPfVTS-qncq1Cp>*{
    flex-shrink:0
}
._2zfZ2V6-sh6_jIbIrQ5vOJ{
    background:rgba(0,0,0,.1);
    display:inline-block;
    height:100%;
    position:relative
}
._2hxZqJYY6uRliNkPorCiY5{
    background:#333 50% no-repeat;
    background-size:cover;
    cursor:pointer;
    opacity:.8;
    position:absolute;
    transition:opacity .1s linear;
    will-change:opacity
}
._2hxZqJYY6uRliNkPorCiY5:hover{
    opacity:1
}
header{
    align-items:center;
    background:#000;
    color:#fff;
    display:flex;
    font-size:1.2rem;
    height:4rem;
    position:relative
}
header>span{
    flex:1 1;
    margin-left:1rem
}
header ._2YCabwxvUZPeykcb0Nxi9B{
    align-items:center;
    display:flex
}
header .tO9gGlAQHY1MsMw4jZpmN{
    display:inline-block;
    margin-left:5px;
    margin-right:15px;
    position:relative
}
header>button{
    cursor:pointer;
    float:right;
    font-size:2rem;
    height:3rem;
    margin-left:auto;
    width:3rem
}
header:before,header>button i{
    pointer-events:none
}
header:before{
    background:linear-gradient(180deg,#000 20%,transparent);
    content:"";
    height:20px;
    left:0;
    opacity:0;
    position:absolute;
    top:calc(100% - 1px);
    transition:opacity .2s ease-out;
    width:100%;
    will-change:opacity;
    z-index:2
}
header._3f7yQ0ypy0jgbPeZDhBhkn:before{
    opacity:1
}
[data-app-mb] header{
    font-size:1.1rem;
    height:3rem
}
._1lU_viuVmq-opXtAJiRuBY{
    left:50%;
    position:absolute;
    top:50%;
    transform:translate(-50%,-50%);
    width:64px
}
._32NDPFy_2eAcnGrd40_6My{
    position:relative;
    z-index:2
}
._32NDPFy_2eAcnGrd40_6My a{
    bottom:0;
    left:0;
    position:absolute;
    right:0;
    top:0;
    z-index:2
}
._32NDPFy_2eAcnGrd40_6My img{
    max-height:calc(100vh - 104px);
    max-width:100vw;
    z-index:1
}
._32GlhP3aBOnbBWGfqoTDYz{
    left:50%;
    position:absolute;
    top:50%;
    transform:translate(-50%,-50%)
}
._1bpev7gqyQF1jMxbIhHw8L{
    max-height:calc(100vh - 104px);
    position:relative;
    text-align:center;
    width:100%;
    z-index:2
}
@media(min-width:768px){
    ._1bpev7gqyQF1jMxbIhHw8L{
        max-width:1280px
    }
}
._1AEEI1goagMu9r5fVYt-Y4{
    bottom:0;
    left:0;
    overflow:hidden;
    position:fixed;
    right:0;
    top:0;
    touch-action:none;
    will-change:opacity;
    z-index:1002
}
._1fEx42oSb0uVYu_3Dhqm95,._2pT4m3gI98nLJzkHFDbn4K,._2u76_uYtdYWhYvghnZLcZA{
    color:#fff;
    cursor:pointer;
    font-size:2rem;
    opacity:.5;
    position:absolute;
    width:3rem;
    z-index:3
}
[data-app-ho] ._1fEx42oSb0uVYu_3Dhqm95:hover,[data-app-ho] ._2pT4m3gI98nLJzkHFDbn4K:hover,[data-app-ho] ._2u76_uYtdYWhYvghnZLcZA:hover{
    opacity:1
}
._1fEx42oSb0uVYu_3Dhqm95{
    height:3rem;
    right:10px;
    top:10px
}
._1uoGou7Kg7a75R2--DdF6B{
    color:#fff;
    left:1rem;
    position:absolute;
    top:1rem;
    z-index:3
}
._2pT4m3gI98nLJzkHFDbn4K,._2u76_uYtdYWhYvghnZLcZA{
    top:50%;
    transform:translateY(-50%)
}
._2pT4m3gI98nLJzkHFDbn4K._2CoXv969JWhD-TcmOsG5SY,._2u76_uYtdYWhYvghnZLcZA._2CoXv969JWhD-TcmOsG5SY{
    bottom:52px;
    top:52px;
    transform:none
}
._2pT4m3gI98nLJzkHFDbn4K i,._2u76_uYtdYWhYvghnZLcZA i{
    padding:.5rem
}
._2u76_uYtdYWhYvghnZLcZA{
    left:0;
    text-align:left
}
._2pT4m3gI98nLJzkHFDbn4K{
    right:0;
    text-align:right
}
._1vdXrgHEM7oz3MtqrJ_Gfo{
    background:#000;
    bottom:0;
    left:0;
    position:absolute;
    right:0;
    top:0;
    will-change:opacity;
    z-index:-1
}
._2WLO0ib6M-zRT5wfHtkMBw{
    position:relative;
    will-change:transform;
    z-index:2
}
._1JZcpXvPA2a7iMMZBCyedH,._2WLO0ib6M-zRT5wfHtkMBw{
    display:flex;
    height:100%;
    width:100%
}
._1JZcpXvPA2a7iMMZBCyedH{
    align-items:center;
    color:#fff;
    justify-content:center;
    position:absolute;
    -webkit-tap-highlight-color:transparent;
    touch-action:none;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
}
._1JZcpXvPA2a7iMMZBCyedH .T1aknDSneV_Pvm2nQkyYk{
    z-index:1
}
.Fjkeu8rp1XE7mqA3uW1tY,._1JZcpXvPA2a7iMMZBCyedH .T1aknDSneV_Pvm2nQkyYk{
    bottom:0;
    left:0;
    position:absolute;
    right:0;
    top:0
}
.Fjkeu8rp1XE7mqA3uW1tY{
    pointer-events:none;
    will-change:opacity;
    z-index:10
}
.Fjkeu8rp1XE7mqA3uW1tY>*{
    pointer-events:auto
}
._349Ptw9omkqXsld1ftflT_{
    background:#1d1d1d;
    bottom:0;
    color:#fff;
    left:50%;
    padding:0 10px 0px;
    padding:0 10px env(safe-area-inset-bottom);
    position:absolute;
    transform:translateX(-50%);
    width:100%;
    z-index:4
}
._349Ptw9omkqXsld1ftflT_ .N3m1XizHSgISFChFpsykP{
    align-items:center;
    display:flex;
    justify-content:space-between;
    margin:0 auto;
    max-width:1136px
}
._349Ptw9omkqXsld1ftflT_ .N3m1XizHSgISFChFpsykP div:first-child{
    flex-grow:1
}
._2mbI9Cy-nXtD0hacDlqLok,._2mbI9Cy-nXtD0hacDlqLok a{
    align-items:center;
    display:flex
}
._2mbI9Cy-nXtD0hacDlqLok a{
    color:#fbc308;
    flex-direction:row;
    padding:10px;
    transition:all .1s ease
}
._2mbI9Cy-nXtD0hacDlqLok a i{
    font-size:1.5rem
}
._2mbI9Cy-nXtD0hacDlqLok a span{
    padding-left:.5rem
}
._2mbI9Cy-nXtD0hacDlqLok a:active,._2mbI9Cy-nXtD0hacDlqLok a:hover{
    background:#4e4e4e;
    text-decoration:none
}
.dbugUlKsINwmpqK65ilAn,.dbugUlKsINwmpqK65ilAn:after{
    border-radius:50%;
    height:54px;
    margin:10px;
    width:54px
}
.dbugUlKsINwmpqK65ilAn{
    -webkit-animation:_3MGF-Z0U563qeBcbuCzs0d 1.1s linear infinite;
    animation:_3MGF-Z0U563qeBcbuCzs0d 1.1s linear infinite;
    border:2px solid rgba(0,0,0,.15);
    border-left-color:#333;
    font-size:10px;
    position:relative;
    text-indent:-9999em;
    transform:translateZ(0)
}
[data-app-dm] .dbugUlKsINwmpqK65ilAn{
    border:2px solid rgba(255,255,255,.2);
    border-left-color:#fff
}
.dbugUlKsINwmpqK65ilAn._3BIHpPf9u7GeiH-9ZjeZgc{
    border-width:4px
}
@-webkit-keyframes _3MGF-Z0U563qeBcbuCzs0d{
    0%{
        transform:rotate(0deg)
    }
    to{
        transform:rotate(1turn)
    }
}
@keyframes _3MGF-Z0U563qeBcbuCzs0d{
    0%{
        transform:rotate(0deg)
    }
    to{
        transform:rotate(1turn)
    }
}
.K8RRn4bHyCRrG1IjoFbTr{
    align-items:center;
    -webkit-backdrop-filter:blur(4px);
    backdrop-filter:blur(4px);
    background:rgba(0,0,0,.7);
    border:1px solid rgba(255,255,255,.1);
    border-radius:25px;
    bottom:72px;
    bottom:calc(72px + constant(safe-area-inset-bottom));
    bottom:calc(72px + env(safe-area-inset-bottom));
    color:#fff;
    display:flex;
    left:50%;
    padding:7px;
    position:fixed;
    transform:translateX(-50%);
    z-index:8
}
.K8RRn4bHyCRrG1IjoFbTr .EoCxkOVejki1ifhJbAFr-{
    align-items:center;
    cursor:pointer;
    display:flex
}
.K8RRn4bHyCRrG1IjoFbTr ._2AcO55IVhu-Zpe9WBQw1-_{
    font-size:.8rem;
    margin:0 .5rem 0 .5em;
    white-space:nowrap
}
.K8RRn4bHyCRrG1IjoFbTr ._31ZS-3fiW3wUKu9i-LCkDo{
    align-items:center;
    border-left:.5px solid rgba(255,255,255,.5);
    cursor:pointer;
    display:flex;
    padding:0 5px 0 7px
}
._3pH-74ozTGn7w6yTdVW3k0{
    bottom:0;
    left:0;
    position:fixed;
    right:0;
    top:0;
    z-index:101
}
._3pH-74ozTGn7w6yTdVW3k0._3rwdL7cMosiUcnKagsi5c6>._3uvECwNznYK2eO-8QED9zL{
    background:0 0
}
._3pH-74ozTGn7w6yTdVW3k0 ._2eKUtQa1PruM3dVcF58Bn0{
    background:#fff;
    border-radius:0 0 2px 0;
    box-shadow:0 0 0 1px #d9d9d9;
    clip:rect(2px,22px,22px,2px);
    height:16px;
    margin:9px;
    pointer-events:none;
    position:absolute;
    transform:rotate(225deg);
    width:16px;
    z-index:2
}
[data-app-dm] ._3pH-74ozTGn7w6yTdVW3k0 ._2eKUtQa1PruM3dVcF58Bn0{
    background:#333;
    box-shadow:0 0 0 1px #3b3a39
}
._3pH-74ozTGn7w6yTdVW3k0._3rwdL7cMosiUcnKagsi5c6>._20XyjyFaWPxNtEGsUVrSqm{
    box-shadow:0 0 0 1px #d9d9d9;
    left:auto;
    margin-top:1rem;
    transform:none;
    width:auto
}
[data-app-dm] ._3pH-74ozTGn7w6yTdVW3k0._3rwdL7cMosiUcnKagsi5c6>._20XyjyFaWPxNtEGsUVrSqm{
    box-shadow:0 0 0 1px #3b3a39
}
._3pH-74ozTGn7w6yTdVW3k0._3rwdL7cMosiUcnKagsi5c6>._20XyjyFaWPxNtEGsUVrSqm i{
    margin-right:1rem
}
._3pH-74ozTGn7w6yTdVW3k0._3rwdL7cMosiUcnKagsi5c6>._20XyjyFaWPxNtEGsUVrSqm button{
    font-size:1rem;
    padding:.5rem 1rem
}
._3uvECwNznYK2eO-8QED9zL{
    background:rgba(0,0,0,.6);
    bottom:0;
    left:0;
    right:0;
    -webkit-tap-highlight-color:transparent;
    top:0;
    transition:opacity .45s cubic-bezier(.36,.66,.04,1);
    will-change:opacity
}
._20XyjyFaWPxNtEGsUVrSqm,._3uvECwNznYK2eO-8QED9zL{
    position:absolute
}
._20XyjyFaWPxNtEGsUVrSqm{
    background:#fff;
    border-radius:4px;
    left:50%;
    list-style:none;
    margin:0;
    padding:.5rem 0;
    top:50%;
    transform:translate(-50%,-50%);
    width:320px;
    z-index:1
}
[data-app-dm] ._20XyjyFaWPxNtEGsUVrSqm{
    background:#333
}
._20XyjyFaWPxNtEGsUVrSqm button{
    align-items:center;
    color:inherit;
    cursor:pointer;
    display:flex;
    font-size:1.1rem;
    padding:1rem 1.5rem;
    text-align:left;
    transition:background-color .1s ease-out;
    width:100%
}
[data-app-ho] ._20XyjyFaWPxNtEGsUVrSqm button:hover{
    background:#f5f5f5
}
[data-app-ho][data-app-dm] ._20XyjyFaWPxNtEGsUVrSqm button:hover{
    background:#282828
}
._20XyjyFaWPxNtEGsUVrSqm i,._20XyjyFaWPxNtEGsUVrSqm svg{
    display:inline-block;
    font-size:1.2rem;
    margin-right:2rem;
    vertical-align:middle;
    width:20px
}
[data-app-mb] ._20XyjyFaWPxNtEGsUVrSqm{
    border-radius:0;
    bottom:0;
    left:0;
    padding-bottom:calc(.5rem + 0px);
    padding-bottom:calc(.5rem + env(safe-area-inset-bottom));
    right:0;
    top:auto;
    transform:none;
    transition:transform .45s cubic-bezier(.36,.66,.04,1);
    width:auto;
    will-change:transform
}
._2Q_JBTFIr6WYvuyEVQsMIt{
    background:#000;
    border-radius:4px;
    left:0;
    position:fixed;
    top:0;
    transform:translateZ(0);
    width:100%;
    will-change:transform;
    z-index:1002
}
._2Q_JBTFIr6WYvuyEVQsMIt ._9Ps0iOv_-_c2ntpBRojMi{
    border-radius:4px;
    box-shadow:0 6px 32px rgba(0,0,0,.4)
}
._2OhaYlUZEyJSgE2zIrr5TG{
    align-items:center;
    bottom:0;
    display:flex;
    justify-content:center;
    left:0;
    position:fixed;
    right:0;
    top:0;
    z-index:1003
}
._2OhaYlUZEyJSgE2zIrr5TG ._1Kfq7CGDgVhQLpwWpy0lxl{
    background:rgba(0,0,0,.8);
    bottom:0;
    left:0;
    position:absolute;
    right:0;
    top:0;
    z-index:1
}
._2OhaYlUZEyJSgE2zIrr5TG ._9Ps0iOv_-_c2ntpBRojMi{
    z-index:2
}
.Gb9WpP__0-2PQ3SffUthc{
    display:block;
    margin:1rem 0;
    position:relative;
    -webkit-tap-highlight-color:transparent
}
._9Ps0iOv_-_c2ntpBRojMi{
    cursor:pointer;
    display:inline-block;
    position:relative;
    vertical-align:top;
    width:100%;
    z-index:2
}
._9Ps0iOv_-_c2ntpBRojMi._2kO2u2Y6hcN3BrqBk_Ar2n{
    cursor:auto
}
._9Ps0iOv_-_c2ntpBRojMi>*{
    vertical-align:top
}
[data-x] ._9Ps0iOv_-_c2ntpBRojMi{
    border:12px solid #000;
    border-radius:24px
}
[data-x] ._9Ps0iOv_-_c2ntpBRojMi:after,[data-x] ._9Ps0iOv_-_c2ntpBRojMi:before{
    content:"";
    pointer-events:none;
    position:absolute;
    top:50%;
    z-index:1
}
[data-x] ._9Ps0iOv_-_c2ntpBRojMi:before{
    background:url(data:image/svg+xml;
    base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMyAxOTEuOSI+PHBhdGggZD0iTTIuOSA0LjRDLjMgNC40IDAgMSAwIDB2MTkxLjljMC0xIC4zLTQuNCAyLjktNC40czIwLjEtLjYgMjAuMS0xOC45VjcwLjl2LTEuNC00Ni4zQzIzIDUgNS41IDQuNCAyLjkgNC40eiIvPjwvc3ZnPg==) 50% no-repeat;
    height:80%;
    left:0;
    padding-right:5.1%;
    transform:translateY(-50%)
}
[data-x] ._9Ps0iOv_-_c2ntpBRojMi:after{
    background:rgba(255,255,255,.4);
    border-radius:8px;
    height:60%;
    right:6px;
    transform:translateY(-50%);
    width:6px
}
.H7qih9uW0wEg3NxBpFz10{
    background:#000 50% no-repeat;
    background-size:110%;
    display:inline-block;
    padding-bottom:56.25%;
    pointer-events:none;
    position:relative;
    width:100%;
    z-index:1
}
.H7qih9uW0wEg3NxBpFz10:after{
    background:url(https://cdn.lihkg.com/static/2105289671-86ixn/media/youtube-play.png) 50% no-repeat;
    background-size:contain;
    content:"";
    height:5rem;
    left:50%;
    margin:-2.5rem;
    position:absolute;
    top:50%;
    width:5rem;
    z-index:1
}
[data-x] .H7qih9uW0wEg3NxBpFz10{
    border:5px solid transparent;
    border-radius:24px
}
._36O5rGsuYKvelr3mUR2-EJ{
    z-index:2
}
._36O5rGsuYKvelr3mUR2-EJ>nav:not(._21-3bCgWynfuDRp1CewxL_){
    background:#eee;
    color:#7e7e7e;
    display:flex;
    top:0;
    width:100%;
    z-index:2
}
._36O5rGsuYKvelr3mUR2-EJ>nav:not(._21-3bCgWynfuDRp1CewxL_)>*{
    height:32px;
    line-height:32px
}
._36O5rGsuYKvelr3mUR2-EJ>nav:not(._21-3bCgWynfuDRp1CewxL_)>span{
    align-items:center;
    display:flex;
    flex:1 1;
    font-size:.9rem;
    left:0;
    overflow:hidden;
    padding:0 .5rem;
    text-align:left;
    text-overflow:ellipsis;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
}
._36O5rGsuYKvelr3mUR2-EJ>nav:not(._21-3bCgWynfuDRp1CewxL_)>span>i{
    font-size:1.2rem;
    margin-right:.5rem
}
._36O5rGsuYKvelr3mUR2-EJ>nav:not(._21-3bCgWynfuDRp1CewxL_)>i{
    cursor:pointer;
    flex:0 0 40px;
    font-size:1.2rem;
    text-align:center
}
._36O5rGsuYKvelr3mUR2-EJ>nav:not(._21-3bCgWynfuDRp1CewxL_)>i:last-child{
    font-size:1.3rem
}
[data-app-dm] ._36O5rGsuYKvelr3mUR2-EJ>nav:not(._21-3bCgWynfuDRp1CewxL_){
    background:#333;
    color:#cecece
}
._36O5rGsuYKvelr3mUR2-EJ:hover>nav{
    opacity:1
}
._36O5rGsuYKvelr3mUR2-EJ>._3PS6X050PE1Azz2VkFLrJI{
    height:0;
    max-width:100%;
    overflow:hidden;
    padding-bottom:56.25%;
    position:relative;
    z-index:1
}
._36O5rGsuYKvelr3mUR2-EJ>._3PS6X050PE1Azz2VkFLrJI>iframe{
    height:100%;
    left:0;
    position:absolute;
    top:0;
    width:100%
}
[data-x] ._36O5rGsuYKvelr3mUR2-EJ>._3PS6X050PE1Azz2VkFLrJI{
    border-radius:12px
}
._21-3bCgWynfuDRp1CewxL_{
    align-items:center;
    background:#555;
    border-radius:50%;
    color:#fff;
    display:flex;
    font-size:1.4rem;
    height:2rem;
    justify-content:center;
    opacity:0;
    position:absolute;
    right:-.5rem;
    top:-.5rem;
    transition:opacity .15s;
    width:2rem;
    z-index:2
}
.ZTeFvPwYujtV3UWWWPRFL{
    display:block;
    margin:1rem 0;
    -webkit-tap-highlight-color:transparent
}
.XhJtZRSQZpzl9QSNKyIQH{
    background:#000;
    display:inline-block;
    padding-bottom:56.25%;
    position:relative;
    vertical-align:top;
    width:100%
}
.XhJtZRSQZpzl9QSNKyIQH>nav:not(._1JGmZAyvP42-jFVs-irtAX){
    background:#eee;
    color:#7e7e7e;
    display:flex;
    top:0;
    width:100%;
    z-index:2
}
.XhJtZRSQZpzl9QSNKyIQH>nav:not(._1JGmZAyvP42-jFVs-irtAX)>*{
    height:32px;
    line-height:32px
}
.XhJtZRSQZpzl9QSNKyIQH>nav:not(._1JGmZAyvP42-jFVs-irtAX)>span{
    align-items:center;
    display:flex;
    flex:1 1;
    font-size:.9rem;
    left:0;
    overflow:hidden;
    padding:0 .5rem;
    text-align:left;
    text-overflow:ellipsis;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
}
.XhJtZRSQZpzl9QSNKyIQH>nav:not(._1JGmZAyvP42-jFVs-irtAX)>span>i{
    font-size:1.2rem;
    margin-right:.5rem
}
.XhJtZRSQZpzl9QSNKyIQH>nav:not(._1JGmZAyvP42-jFVs-irtAX)>i{
    cursor:pointer;
    flex:0 0 40px;
    font-size:1.2rem;
    text-align:center
}
.XhJtZRSQZpzl9QSNKyIQH>nav:not(._1JGmZAyvP42-jFVs-irtAX)>i:last-child{
    font-size:1.3rem
}
[data-app-dm] .XhJtZRSQZpzl9QSNKyIQH>nav:not(._1JGmZAyvP42-jFVs-irtAX){
    background:#333;
    color:#cecece
}
.XhJtZRSQZpzl9QSNKyIQH:hover>nav{
    opacity:1
}
.XhJtZRSQZpzl9QSNKyIQH ._1MhgCkVBOBazKlfPhJ24Ko{
    background:rgba(0,0,0,.4);
    bottom:32px;
    left:0;
    position:absolute;
    right:0;
    top:0;
    z-index:2
}
._398tt6kc00po2IikGjeZmG{
    height:100%!important;
    position:absolute!important;
    width:100%!important
}
._1O-0Y-H8b8Q2JBB0W3VFgP{
    background-position:50%;
    background-repeat:no-repeat;
    background-size:contain;
    height:100%;
    position:absolute;
    width:100%
}
._1O-0Y-H8b8Q2JBB0W3VFgP:after{
    background:url(https://cdn.lihkg.com/static/2105289671-86ixn/media/facebook-play.png) 50% no-repeat;
    background-size:5rem;
    bottom:0;
    content:"";
    cursor:pointer;
    left:0;
    position:absolute;
    right:0;
    top:0;
    z-index:1
}
._1HndApTj--wZxdT7fxD5l6{
    background:#000;
    bottom:1rem;
    box-shadow:0 6px 32px rgba(0,0,0,.4);
    position:fixed;
    right:2rem;
    width:540px;
    z-index:1002
}
._1JGmZAyvP42-jFVs-irtAX{
    align-items:center;
    background:#555;
    border-radius:50%;
    color:#fff;
    cursor:pointer;
    display:flex;
    font-size:1.4rem;
    height:2rem;
    justify-content:center;
    opacity:0;
    position:absolute;
    right:-.5rem;
    top:-.5rem;
    transition:opacity .15s;
    width:2rem;
    z-index:2
}
.akWdlj33IhAuI_SItSR3H{
    background:rgba(0,0,0,.8);
    bottom:0;
    left:0;
    position:fixed;
    right:0;
    top:0;
    z-index:1002
}
.akWdlj33IhAuI_SItSR3H ._2H6sNYSkQWifjnfuG2juAB{
    background:#000;
    left:50%;
    max-width:1280px;
    position:absolute;
    top:50%;
    transform:translate(-50%,-50%);
    width:80vw
}
.b0BZoI6NEqwWU614eJblf{
    display:block;
    margin:1rem 0;
    -webkit-tap-highlight-color:transparent
}
@-webkit-keyframes _39DqqSskffNJKyeHxZxhLe{
    0%{
        transform:translateX(-100%)
    }
    40%{
        transform:translateX(0)
    }
    60%{
        transform:translateX(0)
    }
    to{
        transform:translateX(100%)
    }
}
@keyframes _39DqqSskffNJKyeHxZxhLe{
    0%{
        transform:translateX(-100%)
    }
    40%{
        transform:translateX(0)
    }
    60%{
        transform:translateX(0)
    }
    to{
        transform:translateX(100%)
    }
}
.IAg63CVMqY-mUiw2MafaS{
    -webkit-animation:_39DqqSskffNJKyeHxZxhLe 1s ease-in-out infinite;
    animation:_39DqqSskffNJKyeHxZxhLe 1s ease-in-out infinite;
    background:#fbc308;
    height:.2rem;
    left:0;
    position:fixed;
    top:0;
    width:100%;
    will-change:opacity,transform;
    z-index:1000
}
._3N7MXL_26Dhhcccm_q8AKa{
    -webkit-appearance:none;
    -moz-appearance:none;
    appearance:none;
    border:0;
    bottom:0;
    cursor:pointer;
    height:100%!important;
    left:0;
    opacity:0;
    position:absolute;
    right:0;
    top:0;
    width:100%!important
}
._3zVUlPjndVG8k6x7Pmqkoc._1-YpSKANnWRaz3Nsy2A1n-{
    opacity:.01
}
._3zVUlPjndVG8k6x7Pmqkoc._1-YpSKANnWRaz3Nsy2A1n-._2S_sr_c64T0XDyi1imPPKD{
    opacity:1;
    transition:opacity .2s ease
}
._3zVUlPjndVG8k6x7Pmqkoc._2br5N0fj2k3WE3XWmnfqZg{
    opacity:1
}
._3zVUlPjndVG8k6x7Pmqkoc._2br5N0fj2k3WE3XWmnfqZg._2iN6kDSchhrE7Hle0CMwX4{
    opacity:.01;
    transition:opacity .2s ease
}
._2xkDJhTkrSZqJ3g9_e4wvk._1-YpSKANnWRaz3Nsy2A1n-{
    transform:translateY(-150%)
}
._2xkDJhTkrSZqJ3g9_e4wvk._1-YpSKANnWRaz3Nsy2A1n-._2S_sr_c64T0XDyi1imPPKD{
    transform:none;
    transition:transform .2s ease
}
._2xkDJhTkrSZqJ3g9_e4wvk._2br5N0fj2k3WE3XWmnfqZg{
    transform:none
}
._2xkDJhTkrSZqJ3g9_e4wvk._2br5N0fj2k3WE3XWmnfqZg._2iN6kDSchhrE7Hle0CMwX4{
    transform:translateY(-150%);
    transition:transform .2s ease
}
._25yBMfPhcgwlC1iFy1qp33._1-YpSKANnWRaz3Nsy2A1n-{
    transform:translateX(30%)
}
._25yBMfPhcgwlC1iFy1qp33._1-YpSKANnWRaz3Nsy2A1n-._2S_sr_c64T0XDyi1imPPKD{
    transform:none;
    transition:transform .2s ease-out
}
._25yBMfPhcgwlC1iFy1qp33._2br5N0fj2k3WE3XWmnfqZg{
    transform:none
}
._25yBMfPhcgwlC1iFy1qp33._2br5N0fj2k3WE3XWmnfqZg._2iN6kDSchhrE7Hle0CMwX4{
    transform:translateX(30%);
    transition:transform .2s ease-out
}
._1OF3crHWVPjWJCOIm7xfIZ._1-YpSKANnWRaz3Nsy2A1n-{
    opacity:.01;
    transform:scale(1.025) translateY(-5%)
}
._1OF3crHWVPjWJCOIm7xfIZ._1-YpSKANnWRaz3Nsy2A1n-._2S_sr_c64T0XDyi1imPPKD{
    opacity:1;
    transform:none;
    transition:all .2s ease
}
._1OF3crHWVPjWJCOIm7xfIZ._2br5N0fj2k3WE3XWmnfqZg{
    opacity:1;
    transform:none
}
._1OF3crHWVPjWJCOIm7xfIZ._2br5N0fj2k3WE3XWmnfqZg._2iN6kDSchhrE7Hle0CMwX4{
    opacity:.01;
    transform:scale(1.025) translateY(-5%);
    transition:all .2s ease
}
._2V_W0kETT7a0Ak1QxGZbdN._1-YpSKANnWRaz3Nsy2A1n-{
    opacity:.01;
    transform:translateX(-100%)
}
._2V_W0kETT7a0Ak1QxGZbdN._1-YpSKANnWRaz3Nsy2A1n-._2S_sr_c64T0XDyi1imPPKD{
    opacity:1;
    transform:none;
    transition:all .2s ease
}
._2V_W0kETT7a0Ak1QxGZbdN._2br5N0fj2k3WE3XWmnfqZg{
    opacity:1;
    transform:none
}
._2V_W0kETT7a0Ak1QxGZbdN._2br5N0fj2k3WE3XWmnfqZg._2iN6kDSchhrE7Hle0CMwX4{
    opacity:.01;
    transform:translateX(-100%);
    transition:all .2s ease
}
._1oK_lBjtQU4NH-0wFZMqem._1-YpSKANnWRaz3Nsy2A1n-{
    opacity:.01;
    transform:translateY(50%)
}
._1oK_lBjtQU4NH-0wFZMqem._1-YpSKANnWRaz3Nsy2A1n-._2S_sr_c64T0XDyi1imPPKD{
    opacity:1;
    transform:none;
    transition:all .2s ease
}
._1oK_lBjtQU4NH-0wFZMqem._2br5N0fj2k3WE3XWmnfqZg{
    opacity:1;
    transform:none
}
._1oK_lBjtQU4NH-0wFZMqem._2br5N0fj2k3WE3XWmnfqZg._2iN6kDSchhrE7Hle0CMwX4{
    opacity:.01;
    transform:translateY(50%);
    transition:all .2s ease
}
._2e3zpH8Ar8_4tHXTFZa9jb._1-YpSKANnWRaz3Nsy2A1n- [data-overlay]{
    opacity:.01
}
._2e3zpH8Ar8_4tHXTFZa9jb._1-YpSKANnWRaz3Nsy2A1n- [data-list]{
    transform:translateY(100%)
}
._2e3zpH8Ar8_4tHXTFZa9jb._1-YpSKANnWRaz3Nsy2A1n-._2S_sr_c64T0XDyi1imPPKD [data-overlay]{
    opacity:1
}
._2e3zpH8Ar8_4tHXTFZa9jb._1-YpSKANnWRaz3Nsy2A1n-._2S_sr_c64T0XDyi1imPPKD [data-list]{
    transform:none
}
._2e3zpH8Ar8_4tHXTFZa9jb._2br5N0fj2k3WE3XWmnfqZg [data-overlay]{
    opacity:1
}
._2e3zpH8Ar8_4tHXTFZa9jb._2br5N0fj2k3WE3XWmnfqZg [data-list]{
    transform:none
}
._2e3zpH8Ar8_4tHXTFZa9jb._2br5N0fj2k3WE3XWmnfqZg._2iN6kDSchhrE7Hle0CMwX4 [data-overlay]{
    opacity:.01
}
._2e3zpH8Ar8_4tHXTFZa9jb._2br5N0fj2k3WE3XWmnfqZg._2iN6kDSchhrE7Hle0CMwX4 [data-list]{
    transform:translateY(100%)
}
._7q3XJSQtcQnnnr3oT6by1._1-YpSKANnWRaz3Nsy2A1n-{
    opacity:.01;
    transform:translate3d(100%,0,0)
}
@media(max-width:767px){
    ._7q3XJSQtcQnnnr3oT6by1._1-YpSKANnWRaz3Nsy2A1n-{
        opacity:1;
        transform:translate3d(0,-100%,0)
    }
}
._7q3XJSQtcQnnnr3oT6by1._1-YpSKANnWRaz3Nsy2A1n-._2S_sr_c64T0XDyi1imPPKD{
    opacity:1;
    transform:translateZ(0);
    transition:all .3s ease
}
._7q3XJSQtcQnnnr3oT6by1._2br5N0fj2k3WE3XWmnfqZg{
    opacity:1;
    transform:translateZ(0)
}
._7q3XJSQtcQnnnr3oT6by1._2br5N0fj2k3WE3XWmnfqZg._2iN6kDSchhrE7Hle0CMwX4{
    opacity:.01;
    transform:translate3d(100%,0,0);
    transition:all .3s ease
}
@media(max-width:767px){
    ._7q3XJSQtcQnnnr3oT6by1._2br5N0fj2k3WE3XWmnfqZg._2iN6kDSchhrE7Hle0CMwX4{
        opacity:1;
        transform:translate3d(0,-100%,0)
    }
}
.Vo7qCfQ1zcxviGmeMySZl{
    background:#fff;
    border-radius:6px 6px 0 0;
    bottom:0;
    box-shadow:0 3px 24px 1px rgba(0,0,0,.2);
    display:block;
    overflow:hidden;
    position:fixed;
    right:calc(50vw - 568px + 4rem);
    width:20rem;
    z-index:10
}
.Vo7qCfQ1zcxviGmeMySZl._2GqETuCmp5bDDgJPTevkJA{
    height:620px;
    max-height:100vh;
    width:35rem
}
@media(min-height:800px){
    .Vo7qCfQ1zcxviGmeMySZl._2GqETuCmp5bDDgJPTevkJA{
        height:720px
    }
}
.Vo7qCfQ1zcxviGmeMySZl._1WN6XZt4B58ajv4rs6VCkw{
    border-radius:0;
    box-shadow:none;
    display:flex;
    flex-direction:column;
    height:100%;
    left:50%;
    max-width:60vw;
    top:0;
    transform:translateX(-50%);
    width:720px;
    z-index:13
}
.Vo7qCfQ1zcxviGmeMySZl:not(._1WN6XZt4B58ajv4rs6VCkw) ._3rEWfQ3U63bl18JSaUvRX7{
    height:calc(100% - 3rem)
}
[data-app-sm] .Vo7qCfQ1zcxviGmeMySZl{
    right:2rem
}
[data-app-cx] .Vo7qCfQ1zcxviGmeMySZl{
    right:calc(50vw - 640px + 2rem)
}
@media(max-width:1280px){
    [data-app-cx] .Vo7qCfQ1zcxviGmeMySZl{
        right:2rem
    }
}
[data-app-dm] .Vo7qCfQ1zcxviGmeMySZl{
    background:#222;
    box-shadow:0 3px 24px 1px rgba(0,0,0,.4),0 0 0 1px #2e2e2e
}
.Vo7qCfQ1zcxviGmeMySZl ._2cNd3O-P9Yue3um_ff_-1o{
    border-bottom:1px solid #f2f2f2;
    height:3rem
}
.Vo7qCfQ1zcxviGmeMySZl ._2cNd3O-P9Yue3um_ff_-1o,.Vo7qCfQ1zcxviGmeMySZl ._2cNd3O-P9Yue3um_ff_-1o .SkJdqEHEFaZRB4u1Madp_,.Vo7qCfQ1zcxviGmeMySZl ._2cNd3O-P9Yue3um_ff_-1o .SkJdqEHEFaZRB4u1Madp_>*{
    align-items:center;
    display:flex;
    height:3rem
}
.Vo7qCfQ1zcxviGmeMySZl ._2cNd3O-P9Yue3um_ff_-1o>span{
    align-items:center;
    display:flex;
    flex:1 1;
    font-weight:700;
    height:100%;
    overflow:hidden;
    padding:0 1rem;
    text-overflow:ellipsis;
    white-space:nowrap
}
.Vo7qCfQ1zcxviGmeMySZl ._2cNd3O-P9Yue3um_ff_-1o>.SkJdqEHEFaZRB4u1Madp_>div{
    cursor:pointer;
    font-size:1.2rem;
    justify-content:center;
    width:3rem
}
.Vo7qCfQ1zcxviGmeMySZl ._2cNd3O-P9Yue3um_ff_-1o>.SkJdqEHEFaZRB4u1Madp_>div:hover{
    background:#f2f2f2
}
[data-app-dm] .Vo7qCfQ1zcxviGmeMySZl ._2cNd3O-P9Yue3um_ff_-1o>.SkJdqEHEFaZRB4u1Madp_>div:hover{
    background:#333
}
[data-app-dm] .Vo7qCfQ1zcxviGmeMySZl ._2cNd3O-P9Yue3um_ff_-1o{
    border-bottom:1px solid #3b3a39
}
.Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn{
    align-items:center;
    border-bottom:1px solid #f2f2f2;
    display:flex;
    flex-direction:row;
    height:3rem;
    position:relative
}
.Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn .d-4uChbxb6_j-54wvkbpn{
    display:flex;
    flex-direction:column;
    font-size:1.2rem;
    height:3rem;
    justify-content:center;
    left:50%;
    line-height:1.4rem;
    position:absolute;
    top:50%;
    transform:translate(-50%,-50%)
}
.Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn .d-4uChbxb6_j-54wvkbpn i{
    background:0 0;
    font-size:1rem;
    margin:0 0 0 -5px!important
}
.Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn .d-4uChbxb6_j-54wvkbpn>:first-child{
    flex-shrink:0;
    margin-left:0;
    min-width:0
}
.Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn .d-4uChbxb6_j-54wvkbpn ._1lw-BEKu0NUP1euD-tTcNG{
    background:0 0;
    border:0
}
[data-app-dm] .Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn .d-4uChbxb6_j-54wvkbpn ._1lw-BEKu0NUP1euD-tTcNG{
    background:0 0
}
.Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn ._2jMQkSZEbuijLehSl2ZiU6{
    font-size:1.5rem
}
[data-app-dm] .Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn{
    border-bottom:1px solid #3b3a39
}
.Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn>a{
    align-self:flex-start;
    color:#000;
    display:inline-block;
    flex-shrink:1;
    height:3rem;
    line-height:3rem;
    text-align:center;
    text-decoration:none
}
[data-app-dm] .Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn>a{
    color:#fff
}
.Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn ._3LUvOTfUM8Askc3KtmfRF9{
    flex-grow:1
}
.Vo7qCfQ1zcxviGmeMySZl .W15ZoWi7Cvr8G_0483Wfn i{
    border-radius:8px;
    cursor:pointer;
    font-size:1.3rem;
    margin:0 3px;
    padding:.4rem
}
.Vo7qCfQ1zcxviGmeMySZl ._1kTypRZg5GQGDbhmj3Walt{
    display:flex
}
.Vo7qCfQ1zcxviGmeMySZl ._1kTypRZg5GQGDbhmj3Walt a{
    cursor:pointer
}
.Vo7qCfQ1zcxviGmeMySZl ._3rEWfQ3U63bl18JSaUvRX7{
    flex:1 1;
    height:calc(100% - 3rem);
    position:relative
}
.Vo7qCfQ1zcxviGmeMySZl ._3rEWfQ3U63bl18JSaUvRX7 ._2ME7dqW8n0YSe687nDnGvI{
    display:flex;
    flex-direction:column;
    height:100%;
    width:100%
}
.Vo7qCfQ1zcxviGmeMySZl ._3rEWfQ3U63bl18JSaUvRX7 ._2ME7dqW8n0YSe687nDnGvI>*{
    width:100%
}
.Vo7qCfQ1zcxviGmeMySZl:not(._1WN6XZt4B58ajv4rs6VCkw) ._3rEWfQ3U63bl18JSaUvRX7 ._2ME7dqW8n0YSe687nDnGvI{
    height:100%
}
[data-app-mb] .Vo7qCfQ1zcxviGmeMySZl{
    display:flex;
    flex-direction:column;
    height:100%;
    max-width:none;
    right:0;
    width:100%
}
[data-app-mb] .Vo7qCfQ1zcxviGmeMySZl:not(._1WN6XZt4B58ajv4rs6VCkw) ._3rEWfQ3U63bl18JSaUvRX7{
    bottom:0;
    height:calc(100% - 3rem);
    position:relative;
    top:0
}
[data-app-mb] .Vo7qCfQ1zcxviGmeMySZl:not(._1WN6XZt4B58ajv4rs6VCkw) ._3rEWfQ3U63bl18JSaUvRX7 ._2ME7dqW8n0YSe687nDnGvI{
    height:100%
}
.Vo7qCfQ1zcxviGmeMySZl ._1TdM0E7HcWQwmxXpfa6yJg,.Vo7qCfQ1zcxviGmeMySZl ._1J3LS7g8OaCFy3YXKe--_a,body:not([data-app-mb]) .Vo7qCfQ1zcxviGmeMySZl:not(._1WN6XZt4B58ajv4rs6VCkw) ._1TdM0E7HcWQwmxXpfa6yJg,body:not([data-app-mb]) .Vo7qCfQ1zcxviGmeMySZl:not(._1WN6XZt4B58ajv4rs6VCkw) ._1J3LS7g8OaCFy3YXKe--_a{
    height:calc(100% - 3.5rem)
}
.mAJS_BUkjnVJCUA0CkKB6{
    background:rgba(160,160,160,.5);
    bottom:0;
    left:0;
    position:fixed;
    right:0;
    top:0;
    z-index:11
}
[data-app-dm] .mAJS_BUkjnVJCUA0CkKB6{
    background:rgba(0,0,0,.5)
}
.gUFrHHuQkbki-R3zhwVXJ{
    border:solid #f2f2f2;
    border-width:0 0 1px
}
[data-app-dm] .gUFrHHuQkbki-R3zhwVXJ{
    border-color:#3b3a39
}
._1J3LS7g8OaCFy3YXKe--_a{
    background:#f6f6f6;
    box-shadow:inset 0 -1px #f2f2f2;
    position:absolute;
    width:100%;
    z-index:4
}
[data-app-dm] ._1J3LS7g8OaCFy3YXKe--_a{
    background:#151515;
    box-shadow:inset 0 -1px #3b3a39
}
._1TdM0E7HcWQwmxXpfa6yJg{
    background:#fff;
    -webkit-overflow-scrolling:touch;
    -ms-overflow-style:-ms-autohiding-scrollbar;
    overflow-x:hidden;
    position:absolute;
    width:100%;
    z-index:4
}
[data-app-dm] ._1TdM0E7HcWQwmxXpfa6yJg{
    background:#222
}
[data-app-mb] ._1TdM0E7HcWQwmxXpfa6yJg{
    height:100%
}
._1TdM0E7HcWQwmxXpfa6yJg._3vHBL4Pkmko8fW7AqkXz0m{
    left:50%;
    transform:translateX(-50%);
    width:360px
}
._3cttzNJoFU02EY4a2DDXjW{
    align-items:center;
    background:#aaa;
    border-radius:100%;
    cursor:pointer;
    display:flex;
    flex-direction:row;
    height:2.5rem;
    justify-content:center;
    overflow:hidden;
    position:absolute;
    right:1rem;
    top:.5rem;
    transition:all .4s ease;
    width:2.5rem;
    z-index:5
}
._3cttzNJoFU02EY4a2DDXjW._3Ip3ChGUREFZWL8cf6evQz,._3cttzNJoFU02EY4a2DDXjW:hover{
    background:#fbc308
}
._3cttzNJoFU02EY4a2DDXjW i{
    color:#fff;
    font-size:2rem;
    padding:0 2px
}
._3cttzNJoFU02EY4a2DDXjW ._1L6KAVPjFzzWjPfiR34opn{
    display:flex;
    left:95%;
    position:absolute;
    top:50%;
    transform:translate(-50%,-50%);
    transition:all .3s ease;
    width:4.54rem
}
._3cttzNJoFU02EY4a2DDXjW ._1L6KAVPjFzzWjPfiR34opn._1Y-SbpnGscxhxGgfDH4s3r{
    left:5%
}
[data-app-dm] ._3cttzNJoFU02EY4a2DDXjW{
    background:#333
}
[data-app-dm] ._3cttzNJoFU02EY4a2DDXjW:hover{
    background:#fbc308
}
.ImvuTNPB8Llr0GkQJmKuK{
    clear:both;
    display:flex;
    font:inherit;
    -webkit-overflow-scrolling:touch;
    overflow-x:auto;
    overflow-y:hidden
}
.ImvuTNPB8Llr0GkQJmKuK>span{
    cursor:pointer;
    display:block;
    flex-shrink:0;
    float:left;
    font-size:1.4rem;
    height:2.4rem;
    line-height:2.4rem;
    text-align:center;
    transition:color .25s ease;
    width:2.2rem
}
.ImvuTNPB8Llr0GkQJmKuK>span._19Ywgg4d5i4DQW6utjqGCk,.ImvuTNPB8Llr0GkQJmKuK>span:hover{
    color:#fbc308
}
[data-app-dm] .ImvuTNPB8Llr0GkQJmKuK{
    background:#222;
    border-color:#3b3a39
}
._3ILx6bqxXMKzVd1P5DRS9F{
    display:flex;
    flex:1 1;
    flex-direction:column;
    height:calc(100% - 6rem);
    overflow:hidden;
    padding:0 10px;
    position:relative
}
[data-app-mb] ._3ILx6bqxXMKzVd1P5DRS9F{
    height:calc(100vh - 8.5rem);
    margin:0;
    padding:0 5px 5px
}
._1qBlcPSazVT2jCqgUdKJfD{
    display:flex;
    flex-direction:column;
    max-height:50%
}
.EGBBkGyEbfIEpHMLTW84H{
    align-items:center;
    background:rgba(255,255,255,.8);
    border:2px dotted;
    border-radius:4px;
    display:flex;
    height:100%;
    justify-content:center;
    position:absolute;
    width:calc(100% - 20px);
    z-index:9999
}
[data-app-dm] .EGBBkGyEbfIEpHMLTW84H{
    background:rgba(51,51,51,.8)
}
.iRtozsTC0T1TiPyXX26bX{
    margin:0 .4rem .4rem
}
._2PWs2HPwawYhSrT60wjDGf{
    align-items:center;
    display:flex;
    flex-direction:row;
    height:56px;
    padding:10px 10px 0
}
._2PWs2HPwawYhSrT60wjDGf>:first-child{
    flex-shrink:0;
    margin-left:0;
    margin-right:10px;
    min-width:0
}
._2PWs2HPwawYhSrT60wjDGf>:last-child{
    flex:1 1;
    margin:0;
    min-width:0
}
._2PWs2HPwawYhSrT60wjDGf ._2TOedvq2nwilgim_HiHz76,._2PWs2HPwawYhSrT60wjDGf ._1lw-BEKu0NUP1euD-tTcNG{
    background:#f2f2f2;
    border:0
}
._2PWs2HPwawYhSrT60wjDGf ._2TOedvq2nwilgim_HiHz76{
    margin:0;
    width:100%
}
[data-app-dm] ._2PWs2HPwawYhSrT60wjDGf ._2TOedvq2nwilgim_HiHz76,[data-app-dm] ._2PWs2HPwawYhSrT60wjDGf ._1lw-BEKu0NUP1euD-tTcNG{
    background:#191919
}
[data-app-mb] ._2PWs2HPwawYhSrT60wjDGf{
    padding:10px 5px 0
}
@media(max-width:767px){
    ._2PWs2HPwawYhSrT60wjDGf>*{
        margin-top:0!important
    }
}
._3EqD0eErOLiv0LUZuSZFfg{
    position:relative;
    width:100%;
    z-index:7
}
._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4{
    -webkit-backdrop-filter:blur(10px);
    backdrop-filter:blur(10px);
    background:rgba(255,255,255,.9);
    border-radius:4px;
    box-shadow:0 12px 42px -2px rgba(0,0,0,.35);
    display:flex;
    flex-direction:column;
    margin-top:5px;
    max-height:30vh;
    overflow-y:auto;
    position:absolute;
    width:100%
}
._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4>span{
    background:rgba(172,172,172,.1);
    color:#8c8c8c;
    font-size:.8rem;
    padding:.5rem 1rem
}
[data-app-dm] ._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4>span{
    background:rgba(0,0,0,.2);
    color:#aaa
}
._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4 ._26lCbVKooPj0XFj_VAlatj{
    list-style-type:none;
    margin:0;
    padding:0
}
._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4 ._26lCbVKooPj0XFj_VAlatj ._36UKo8oeoDKd44MeWg4y3N{
    align-items:stretch;
    cursor:pointer;
    display:flex;
    justify-content:space-between;
    transition:all 50ms ease-out
}
._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4 ._26lCbVKooPj0XFj_VAlatj ._36UKo8oeoDKd44MeWg4y3N:hover{
    background:#e8e8e8
}
[data-app-dm] ._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4 ._26lCbVKooPj0XFj_VAlatj ._36UKo8oeoDKd44MeWg4y3N:hover{
    background:#424242
}
._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4 ._26lCbVKooPj0XFj_VAlatj ._36UKo8oeoDKd44MeWg4y3N ._3f_Iq9xty5Ij2cuebPOAm1{
    align-items:center;
    color:inherit;
    display:flex;
    flex-grow:1;
    overflow:hidden;
    padding:1rem 0 1rem 1rem;
    text-decoration:none
}
._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4 ._26lCbVKooPj0XFj_VAlatj ._36UKo8oeoDKd44MeWg4y3N ._2eo2mZLI0qEOkmUz74nJkX{
    align-self:center;
    color:inherit;
    cursor:pointer;
    display:flex;
    font-size:1.5rem;
    justify-content:center;
    margin:0 1rem
}
._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4 ._26lCbVKooPj0XFj_VAlatj ._36UKo8oeoDKd44MeWg4y3N ._2eo2mZLI0qEOkmUz74nJkX:hover{
    color:#fbc308
}
[data-app-dm] ._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4{
    background:rgba(64,64,64,.7)
}
@media(max-width:767px){
    ._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4{
        max-height:50vh
    }
}
[data-app-mb] ._3EqD0eErOLiv0LUZuSZFfg ._1xH5We-DC78h7Wtq2nz1P4{
    box-shadow:none
}
._1xaNo-2jhq5KooKoBBRKwe{
    flex:1 1;
    height:0;
    -webkit-overflow-scrolling:touch;
    overflow-x:hidden;
    position:relative;
    z-index:1
}
._2bkS8mlPHwIWkfFdPg38rj ._1xaNo-2jhq5KooKoBBRKwe{
    max-height:60vh
}
._1xaNo-2jhq5KooKoBBRKwe.Inch6nCn9JOFUpvfjLTAO{
    height:calc(100% - 70px)
}
._1xaNo-2jhq5KooKoBBRKwe>div,._1xaNo-2jhq5KooKoBBRKwe>div>.ProseMirror{
    min-height:100%;
    position:absolute;
    width:100%
}
._1xaNo-2jhq5KooKoBBRKwe>div>.ProseMirror{
    background:#f2f2f2;
    border-radius:4px;
    font:inherit;
    padding:.5rem
}
[data-app-dm] ._1xaNo-2jhq5KooKoBBRKwe>div>.ProseMirror{
    background:#191919
}
._1xaNo-2jhq5KooKoBBRKwe>div>.ProseMirror p{
    line-height:2rem;
    margin:0
}
._1xaNo-2jhq5KooKoBBRKwe>div>.ProseMirror p [data-ic]{
    display:inline-block;
    line-height:1rem;
    outline:0;
    padding:0 1px;
    -webkit-user-select:text;
    -moz-user-select:text;
    -ms-user-select:text;
    user-select:text;
    vertical-align:baseline
}
._1xaNo-2jhq5KooKoBBRKwe>div>.ProseMirror p [data-ic]>img{
    image-rendering:auto;
    pointer-events:none
}
@media(-webkit-device-pixel-ratio:1),(-webkit-device-pixel-ratio:2),(-webkit-device-pixel-ratio:3),(-webkit-device-pixel-ratio:4){
    ._1xaNo-2jhq5KooKoBBRKwe>div>.ProseMirror p [data-ic]:not([data-ic-hd]) img{
        -ms-interpolation-mode:nearest-neighbor;
        image-rendering:-moz-crisp-edges;
        image-rendering:pixelated
    }
}
._2RymM0J-wm1bZXPTUSrz3e{
    align-items:center;
    color:#aaa;
    display:flex;
    font-size:.85rem;
    height:3.5rem;
    justify-content:space-between;
    padding:0 10px
}
._2RymM0J-wm1bZXPTUSrz3e ._1YL3lBfgR-_BcF8yitKCQc{
    flex-grow:1
}
._2RymM0J-wm1bZXPTUSrz3e ._3x6E3N9BAcOUflWRCSCTAU{
    align-items:center;
    display:flex;
    flex-direction:row;
    width:100%
}
._2RymM0J-wm1bZXPTUSrz3e ._3x6E3N9BAcOUflWRCSCTAU ._337HrkzqN4vkh_p53bjhoP{
    align-items:center;
    cursor:pointer;
    display:flex;
    height:2.3rem;
    margin-left:10px;
    margin-right:1rem
}
._2RymM0J-wm1bZXPTUSrz3e ._3x6E3N9BAcOUflWRCSCTAU ._337HrkzqN4vkh_p53bjhoP ._1FX6oDXifzvugcoCgdoMDF{
    color:#fbc308
}
._2RymM0J-wm1bZXPTUSrz3e ._3x6E3N9BAcOUflWRCSCTAU ._337HrkzqN4vkh_p53bjhoP span{
    margin:0 0 1px 10px
}
._2RymM0J-wm1bZXPTUSrz3e ._1kTypRZg5GQGDbhmj3Walt{
    align-items:center;
    display:flex
}
._2RymM0J-wm1bZXPTUSrz3e ._1kTypRZg5GQGDbhmj3Walt>a{
    border-radius:4px;
    color:#000;
    font-size:1rem;
    height:2.3rem;
    line-height:2.3rem;
    outline:0;
    padding:0 1.5rem;
    text-decoration:none;
    transition:all .25s
}
._2RymM0J-wm1bZXPTUSrz3e ._1kTypRZg5GQGDbhmj3Walt>a:not(:last-child),._2RymM0J-wm1bZXPTUSrz3e ._1kTypRZg5GQGDbhmj3Walt>a i{
    margin-right:.5rem
}
._2RymM0J-wm1bZXPTUSrz3e ._1kTypRZg5GQGDbhmj3Walt>a:hover{
    background:#f2f2f2;
    color:#000
}
._2RymM0J-wm1bZXPTUSrz3e ._1kTypRZg5GQGDbhmj3Walt>a:active{
    background:#e6e6e6
}
[data-app-dm] ._2RymM0J-wm1bZXPTUSrz3e ._1kTypRZg5GQGDbhmj3Walt>a{
    color:#fff
}
[data-app-dm] ._2RymM0J-wm1bZXPTUSrz3e ._1kTypRZg5GQGDbhmj3Walt>a:hover{
    background:#333;
    color:#fff
}
[data-app-dm] ._2RymM0J-wm1bZXPTUSrz3e ._1kTypRZg5GQGDbhmj3Walt>a:active{
    background:#363636
}
._32z1OrmBeylOpi4g4UV9vO{
    align-items:center;
    background:#fff;
    display:flex;
    height:4rem;
    padding:0 1rem
}
._32z1OrmBeylOpi4g4UV9vO ._25K8M4bz4RcD9DIDFKGBOl{
    background:#f1f1f1;
    border-radius:7px;
    cursor:pointer;
    padding:10px 0;
    text-align:center;
    transition:background-color .2s ease;
    width:100%
}
._32z1OrmBeylOpi4g4UV9vO ._25K8M4bz4RcD9DIDFKGBOl:first-child{
    margin-right:.5rem
}
._32z1OrmBeylOpi4g4UV9vO ._25K8M4bz4RcD9DIDFKGBOl:last-child{
    margin-left:.5rem
}
._32z1OrmBeylOpi4g4UV9vO ._25K8M4bz4RcD9DIDFKGBOl i{
    margin-right:4px
}
._32z1OrmBeylOpi4g4UV9vO ._25K8M4bz4RcD9DIDFKGBOl i:first-child{
    font-size:1rem
}
._32z1OrmBeylOpi4g4UV9vO ._25K8M4bz4RcD9DIDFKGBOl:hover{
    background:#fbc308
}
[data-app-dm] ._32z1OrmBeylOpi4g4UV9vO ._25K8M4bz4RcD9DIDFKGBOl{
    background:#3f3f3f;
    color:#fff
}
[data-app-dm] ._32z1OrmBeylOpi4g4UV9vO ._25K8M4bz4RcD9DIDFKGBOl:hover{
    background:#fbc308;
    color:#000
}
[data-app-dm] ._32z1OrmBeylOpi4g4UV9vO{
    background:#222
}
._2i-6UxcSV2w76gMi5e5EY9{
    overflow:hidden;
    position:relative
}
._2i-6UxcSV2w76gMi5e5EY9>input{
    cursor:pointer;
    height:100%;
    left:-100%;
    opacity:0;
    position:absolute;
    top:0;
    width:200%
}
._24QwwVkZYxCCSyOU0moUyg{
    background:#fff;
    bottom:1px;
    left:1px;
    list-style:none;
    margin:0;
    -webkit-overflow-scrolling:touch;
    -ms-overflow-style:-ms-autohiding-scrollbar;
    overflow-x:hidden;
    overflow-y:auto;
    padding:0;
    position:absolute;
    top:1px;
    width:160px;
    z-index:2
}
._24QwwVkZYxCCSyOU0moUyg>li{
    cursor:pointer;
    padding:.5rem 1rem;
    text-align:center
}
._24QwwVkZYxCCSyOU0moUyg>li:hover{
    background:#f2f2f2
}
@media(-webkit-device-pixel-ratio:1),(-webkit-device-pixel-ratio:2),(-webkit-device-pixel-ratio:3),(-webkit-device-pixel-ratio:4){
    ._24QwwVkZYxCCSyOU0moUyg>li img{
        -ms-interpolation-mode:nearest-neighbor;
        image-rendering:-moz-crisp-edges;
        image-rendering:pixelated
    }
}
._24QwwVkZYxCCSyOU0moUyg>li img._2-Si5lA7QQdqc7vwZA7Nr3{
    image-rendering:auto
}
[data-app-dm] ._24QwwVkZYxCCSyOU0moUyg{
    background:#222
}
[data-app-dm] ._24QwwVkZYxCCSyOU0moUyg>li:hover{
    background:#191919
}
._1m7EaebkdoQj6IdUElH2nl{
    bottom:-3px;
    display:none;
    flex:1 1;
    flex-direction:column;
    margin-top:4px;
    position:relative;
    z-index:6
}
._2bkS8mlPHwIWkfFdPg38rj ._1m7EaebkdoQj6IdUElH2nl{
    display:flex
}
._1m7EaebkdoQj6IdUElH2nl ._2tG3UoD9Ve4lFfCrubml-v{
    align-items:center;
    color:#999;
    display:flex;
    font-size:.8rem;
    height:2rem
}
._1m7EaebkdoQj6IdUElH2nl ._2tG3UoD9Ve4lFfCrubml-v>div{
    margin-left:10px
}
._1m7EaebkdoQj6IdUElH2nl ._2tG3UoD9Ve4lFfCrubml-v>span{
    cursor:pointer;
    margin-left:1rem;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
}
[data-app-mb] ._1m7EaebkdoQj6IdUElH2nl ._2tG3UoD9Ve4lFfCrubml-v{
    display:none
}
._1m7EaebkdoQj6IdUElH2nl ._1rRoFMWEk02kX7TiFrrpTy{
    border-radius:4px;
    flex:1 1;
    overflow:hidden;
    position:relative;
    width:100%
}
._12EVTJ_8syVitONt-ZmSlY{
    border-radius:0;
    height:auto;
    left:0;
    padding:0;
    width:68px;
    z-index:3
}
._12EVTJ_8syVitONt-ZmSlY:not(._1Ku9qL4qhkBDwAgVLYcQdi),._12EVTJ_8syVitONt-ZmSlY:not(._1Ku9qL4qhkBDwAgVLYcQdi)>li{
    transform:rotateY(180deg)
}
._12EVTJ_8syVitONt-ZmSlY li{
    padding:.5rem 0
}
._12EVTJ_8syVitONt-ZmSlY li._19Ywgg4d5i4DQW6utjqGCk{
    background:#f2f2f2
}
[data-app-dm] ._12EVTJ_8syVitONt-ZmSlY li._19Ywgg4d5i4DQW6utjqGCk{
    background:#191919
}
._12EVTJ_8syVitONt-ZmSlY img{
    height:auto;
    margin:0 auto;
    max-width:32px
}
._1Ku9qL4qhkBDwAgVLYcQdi{
    background:#f2f2f2;
    border:0;
    left:68px;
    overflow-y:scroll;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    width:calc(100% - 68px);
    z-index:1
}
._1Ku9qL4qhkBDwAgVLYcQdi li{
    display:inline-block;
    min-height:32px;
    vertical-align:middle;
    width:16.5%
}
._1Ku9qL4qhkBDwAgVLYcQdi li:hover{
    background:#d6d6d6
}
[data-app-dm] ._1Ku9qL4qhkBDwAgVLYcQdi li:hover{
    background:#363636
}
._1Ku9qL4qhkBDwAgVLYcQdi img{
    height:auto;
    max-width:100%;
    vertical-align:middle
}
[data-app-dm] ._1Ku9qL4qhkBDwAgVLYcQdi{
    background:#191919
}
a._3KTB0kq1UlJkvISz4FSpXM{
    color:#aaa;
    pointer-events:none
}
[data-app-dm] a._3KTB0kq1UlJkvISz4FSpXM{
    color:#888
}
._2fAkyyCydIfa0-URwLW0zn{
    font-size:.85rem;
    padding-left:10px
}
.llARQLFVvmMkA_4a7ZYKi{
    min-width:calc(300px - 2rem)
}
._34G_FCTR372GniuKI270sN{
    background:#fff;
    border:1px solid #e0e0e0;
    height:10rem;
    padding:1rem 1.5rem;
    position:relative
}
[data-app-dm] ._34G_FCTR372GniuKI270sN{
    background:#1d1d1d;
    border-color:#3b3a39
}
._3AQgjr0U3VLhWXPn2O7cgn{
    bottom:-3px;
    position:absolute;
    width:calc(100% - 20px);
    z-index:2
}
[data-app-mb] ._3AQgjr0U3VLhWXPn2O7cgn{
    bottom:0;
    width:calc(100% - 10px)
}
._2eWhvoQFAx-Dsi-4AKwEt_{
    border:0;
    height:64px;
    width:100%
}
[data-app-dm] ._2eWhvoQFAx-Dsi-4AKwEt_{
    opacity:.8
}
@media(max-width:1135px){
    .Vo7qCfQ1zcxviGmeMySZl{
        right:3.2em
    }
}
@media(max-width:767px){
    .Vo7qCfQ1zcxviGmeMySZl{
        border-radius:0;
        height:100%;
        min-height:350px;
        width:100%
    }
    .iRtozsTC0T1TiPyXX26bX{
        display:none
    }
    ._2PWs2HPwawYhSrT60wjDGf{
        margin-left:0;
        margin-right:0
    }
    ._2fAkyyCydIfa0-URwLW0zn{
        padding-right:.9rem
    }
    ._24QwwVkZYxCCSyOU0moUyg._1Ku9qL4qhkBDwAgVLYcQdi li{
        width:25%
    }
}
@supports not ((-webkit-backdrop-filter:blur(10px)) or (backdrop-filter:blur(10px))){
    ._1xH5We-DC78h7Wtq2nz1P4{
        background:#fff
    }
    [data-app-dm] ._1xH5We-DC78h7Wtq2nz1P4{
        background:#222
    }
}
._3d4f9eP367TtOhfXtoPmxP{
    background:#fff;
    border:1px solid #d9d9d9;
    border-radius:4px;
    color:inherit;
    font:inherit;
    height:2.25rem;
    min-width:15rem;
    padding:.4em;
    position:relative
}
[data-app-dm] ._3d4f9eP367TtOhfXtoPmxP{
    background:#151515;
    border-color:#3b3a39
}
._3d4f9eP367TtOhfXtoPmxP>select{
    border:0;
    height:100%;
    left:0;
    opacity:0;
    position:absolute;
    top:0;
    width:100%
}
._3asAf7hdcvSbueuIhWtjWT{
    background:#fff;
    border:2px dashed #bbb;
    border-radius:4px;
    font-size:16px;
    line-height:1.5;
    padding:8px;
    position:relative;
    text-align:center
}
[data-app-dm] ._3asAf7hdcvSbueuIhWtjWT{
    background:#202020;
    border:2px dashed #444
}
._3asAf7hdcvSbueuIhWtjWT.Vfz1DZr1ky_0tG87LvJ9P{
    border-color:#fbc308
}
._1yASmEJiG9bn8dNPkQls5Y{
    align-items:center;
    cursor:pointer;
    display:flex;
    flex-direction:column;
    justify-content:center;
    opacity:.5;
    padding:6rem 1rem
}
[data-app-mb] ._1yASmEJiG9bn8dNPkQls5Y{
    padding:3rem 1rem
}
._1yASmEJiG9bn8dNPkQls5Y:hover{
    opacity:1
}
._1yASmEJiG9bn8dNPkQls5Y span{
    align-items:center;
    display:flex
}
._1yASmEJiG9bn8dNPkQls5Y i{
    font-size:1.2rem;
    margin-right:.5rem
}
.cNnuXvCogzeuyT11A7SzY{
    display:none
}
._3fM7Rrz65iZcsvpGzxVZVP{
    display:flex;
    flex-wrap:wrap;
    margin-bottom:-5px;
    margin-left:-5px;
    position:relative
}
._1Fd0CQ_BnWR3U5OSmnUL5Y{
    margin-bottom:5px;
    padding-left:5px;
    position:relative;
    width:33.33%
}
._7T7EMX_Cd90dKte24LHxx>div{
    border-color:transparent;
    border-style:solid;
    height:0;
    position:absolute;
    width:0;
    z-index:3
}
._7T7EMX_Cd90dKte24LHxx ._3yS2My-FKosP-c4hH_usas{
    border-width:20px 20px 0 0;
    left:0;
    top:0
}
._7T7EMX_Cd90dKte24LHxx ._3yS2My-FKosP-c4hH_usas:hover{
    border-color:#daa800 transparent transparent
}
._7T7EMX_Cd90dKte24LHxx ._3yS2My-FKosP-c4hH_usas._3r1SkPBG_YTFpqeyUdesRF{
    border-color:#fbc308 transparent transparent
}
._7T7EMX_Cd90dKte24LHxx ._3yS2My-FKosP-c4hH_usas._25blIO5lNOI7700A6vOKkb{
    border-color:#e74c3c transparent transparent
}
._7T7EMX_Cd90dKte24LHxx ._3dLbqgyxSFWCj2Xom2HxKb{
    border-width:0 20px 20px 0;
    right:0;
    top:0
}
._7T7EMX_Cd90dKte24LHxx ._3dLbqgyxSFWCj2Xom2HxKb:hover{
    border-color:transparent #daa800 transparent transparent
}
._7T7EMX_Cd90dKte24LHxx ._3dLbqgyxSFWCj2Xom2HxKb._3r1SkPBG_YTFpqeyUdesRF{
    border-color:transparent #fbc308 transparent transparent
}
._7T7EMX_Cd90dKte24LHxx ._3dLbqgyxSFWCj2Xom2HxKb._25blIO5lNOI7700A6vOKkb{
    border-color:transparent #e74c3c transparent transparent
}
._7T7EMX_Cd90dKte24LHxx ._12SDLtaA3-2rNvBTfA680C{
    border-width:20px 0 0 20px;
    bottom:0;
    left:0
}
._7T7EMX_Cd90dKte24LHxx ._12SDLtaA3-2rNvBTfA680C:hover{
    border-color:transparent transparent transparent #daa800
}
._7T7EMX_Cd90dKte24LHxx ._12SDLtaA3-2rNvBTfA680C._3r1SkPBG_YTFpqeyUdesRF{
    border-color:transparent transparent transparent #fbc308
}
._7T7EMX_Cd90dKte24LHxx ._12SDLtaA3-2rNvBTfA680C._25blIO5lNOI7700A6vOKkb{
    border-color:transparent transparent transparent #e74c3c
}
._7T7EMX_Cd90dKte24LHxx ._2GKsXRx66VKI-2RMhfL6ld{
    border-width:0 0 20px 20px;
    bottom:0;
    right:0
}
._7T7EMX_Cd90dKte24LHxx ._2GKsXRx66VKI-2RMhfL6ld:hover{
    border-color:transparent transparent #daa800
}
._7T7EMX_Cd90dKte24LHxx ._2GKsXRx66VKI-2RMhfL6ld._3r1SkPBG_YTFpqeyUdesRF{
    border-color:transparent transparent #fbc308
}
._7T7EMX_Cd90dKte24LHxx ._2GKsXRx66VKI-2RMhfL6ld._25blIO5lNOI7700A6vOKkb{
    border-color:transparent transparent #e74c3c
}
._1GgIwK-A1m4niMOd5EAu8k{
    color:#666;
    font-size:.8rem;
    padding:.5rem
}
.eJQibmimmfe8z-fi6ZQ3D{
    background-position:50%;
    background-size:cover;
    border-radius:4px;
    cursor:pointer;
    height:100%;
    overflow:hidden;
    position:absolute;
    width:95.75%;
    z-index:1
}
.eJQibmimmfe8z-fi6ZQ3D:before{
    align-items:center;
    background:rgba(0,0,0,.2);
    bottom:0;
    color:#fff;
    content:"";
    display:flex;
    font-size:30px;
    justify-content:center;
    left:0;
    opacity:0;
    position:absolute;
    right:0;
    top:0
}
._27NidzDcsapXAsBWyW-vhy{
    background-color:#eee;
    background-position:50%;
    background-size:cover;
    border-radius:4px;
    cursor:pointer;
    overflow:hidden;
    padding-bottom:100%;
    position:relative
}
[data-app-dm] ._27NidzDcsapXAsBWyW-vhy{
    background-color:#333
}
._1G6-JnDHZMCtk19S_9darl{
    align-items:center;
    display:flex;
    height:100%;
    justify-content:space-around;
    left:50%;
    padding:0 10px;
    position:absolute;
    top:50%;
    transform:translate(-50%,-50%);
    width:100%;
    z-index:2
}
._1G6-JnDHZMCtk19S_9darl:hover:before{
    opacity:1
}
._1G6-JnDHZMCtk19S_9darl:hover i{
    color:#fff;
    visibility:visible
}
[data-app-mb] ._1G6-JnDHZMCtk19S_9darl:before{
    opacity:1
}
[data-app-mb] ._1G6-JnDHZMCtk19S_9darl i{
    font-size:1.7rem;
    visibility:visible
}
._1G6-JnDHZMCtk19S_9darl i{
    color:#eee;
    font-size:30px;
    font-weight:700;
    visibility:hidden
}
._1G6-JnDHZMCtk19S_9darl:before{
    align-items:center;
    background:rgba(0,0,0,.2);
    bottom:0;
    content:"";
    display:flex;
    font-size:30px;
    justify-content:center;
    left:0;
    opacity:0;
    position:absolute;
    right:0;
    top:0;
    transition:opacity .3s ease;
    z-index:-1
}
._2B9_YS6CZ8ZrnmbaovOkyo{
    z-index:100
}
._2B9_YS6CZ8ZrnmbaovOkyo .eJQibmimmfe8z-fi6ZQ3D{
    box-shadow:0 2px 14px 1px rgba(0,0,0,.5);
    transform:scale(1.05)
}
._3JrHHoa1O57wNfE3O-Xqr4{
    background-color:#eee;
    border-radius:4px;
    cursor:pointer;
    opacity:.5;
    position:relative
}
[data-app-dm] ._3JrHHoa1O57wNfE3O-Xqr4{
    background-color:#333
}
._3JrHHoa1O57wNfE3O-Xqr4:hover{
    opacity:1
}
._3JrHHoa1O57wNfE3O-Xqr4:before{
    content:"";
    display:block;
    padding-bottom:100%
}
._3JrHHoa1O57wNfE3O-Xqr4 i{
    font-size:2rem;
    left:50%;
    position:absolute;
    top:50%;
    transform:translate(-50%,-50%)
}
._13Z_L8fR2xa06u9vvjuHle{
    color:#666;
    margin:1rem 0 .2rem;
    position:relative;
    text-align:center
}
[data-app-mb] ._13Z_L8fR2xa06u9vvjuHle{
    margin:.5rem 0
}
._13Z_L8fR2xa06u9vvjuHle:before{
    background:currentColor;
    bottom:50%;
    content:"";
    height:1px;
    left:0;
    position:absolute;
    width:100%
}
._13Z_L8fR2xa06u9vvjuHle span{
    background:#f6f6f6;
    padding:0 1rem;
    position:relative;
    z-index:1
}
[data-app-dm] ._13Z_L8fR2xa06u9vvjuHle span{
    background:#292827
}
._23daqfZHlQP0XLvu5HgpYF{
    height:2rem;
    justify-content:flex-end;
    margin-bottom:.5rem;
    width:100%
}
._23daqfZHlQP0XLvu5HgpYF,._23daqfZHlQP0XLvu5HgpYF .t2i_iM_Y6lrgRFG31GSBC{
    align-items:center;
    display:flex
}
._23daqfZHlQP0XLvu5HgpYF .t2i_iM_Y6lrgRFG31GSBC{
    align-self:center;
    color:#666;
    flex-grow:1;
    font-size:12px
}
[data-app-dm] ._23daqfZHlQP0XLvu5HgpYF .t2i_iM_Y6lrgRFG31GSBC{
    color:#fbc308
}
._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv{
    display:flex;
    justify-content:flex-end
}
._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._1xgfVdWTsrNYKgKzrbe2X3{
    color:#666;
    cursor:pointer;
    font-size:22px;
    height:22px;
    width:22px
}
._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._1xgfVdWTsrNYKgKzrbe2X3 .HT4uN0RTrXj7X3e-EXqSv,._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._1xgfVdWTsrNYKgKzrbe2X3:active,._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._1xgfVdWTsrNYKgKzrbe2X3:hover{
    color:#333
}
[data-app-dm] ._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._1xgfVdWTsrNYKgKzrbe2X3{
    color:#999
}
[data-app-dm] ._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._1xgfVdWTsrNYKgKzrbe2X3:active,[data-app-dm] ._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._1xgfVdWTsrNYKgKzrbe2X3:hover{
    color:#fff
}
[data-app-dm] ._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._1xgfVdWTsrNYKgKzrbe2X3 .HT4uN0RTrXj7X3e-EXqSv{
    color:#fbc308
}
._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._3T81Tef__PfF0WigA7BIBl{
    border-radius:2px;
    display:flex;
    flex-flow:row wrap;
    margin-left:.5rem;
    width:22px
}
._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._3T81Tef__PfF0WigA7BIBl._39J3pUdY59eNYNPQAS8VRc{
    cursor:not-allowed;
    pointer-events:none
}
._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._3T81Tef__PfF0WigA7BIBl._39J3pUdY59eNYNPQAS8VRc>div{
    background-color:#e3e3e3!important
}
[data-app-dm] ._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._3T81Tef__PfF0WigA7BIBl._39J3pUdY59eNYNPQAS8VRc>div{
    background:#666!important
}
._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._3T81Tef__PfF0WigA7BIBl ._2aGEGYUtOKclnUBi8N0p9P{
    background-color:#d7d7d7;
    border-radius:2px;
    cursor:pointer;
    margin:.5px;
    width:10px
}
[data-app-dm] ._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._3T81Tef__PfF0WigA7BIBl ._2aGEGYUtOKclnUBi8N0p9P{
    background:#666
}
._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._3T81Tef__PfF0WigA7BIBl ._2aGEGYUtOKclnUBi8N0p9P:hover{
    background-color:#bbb
}
._23daqfZHlQP0XLvu5HgpYF ._31bIfMMVAMPfaMNxwg4Pwv ._3T81Tef__PfF0WigA7BIBl ._2aGEGYUtOKclnUBi8N0p9P._3r1SkPBG_YTFpqeyUdesRF{
    background-color:#fbc308
}
.Owl0IncflxRB7Lg2PiTz5{
    color:#666;
    display:block;
    font-size:.8rem;
    margin-top:.5rem;
    text-align:center
}
.Owl0IncflxRB7Lg2PiTz5 a{
    color:#fbc308
}
.I60u8jY18Jgql5JkMgVM4{
    margin:0;
    position:relative;
    z-index:2
}
.I60u8jY18Jgql5JkMgVM4 canvas{
    margin:0;
    z-index:1
}
.I60u8jY18Jgql5JkMgVM4 ._2_Urp67yPQdwe7j6JiJ6Zp{
    align-items:center;
    background:#e74c3c;
    border-radius:20px;
    bottom:0;
    cursor:pointer;
    display:flex;
    left:50%;
    margin-bottom:1rem;
    padding:.3rem 1.3rem;
    position:absolute;
    transform:translateX(-50%);
    transition:all .2s ease-out;
    z-index:2
}
.I60u8jY18Jgql5JkMgVM4 ._2_Urp67yPQdwe7j6JiJ6Zp i{
    font-size:1.2rem
}
.I60u8jY18Jgql5JkMgVM4 ._2_Urp67yPQdwe7j6JiJ6Zp span{
    font-size:1rem
}
.I60u8jY18Jgql5JkMgVM4 ._2_Urp67yPQdwe7j6JiJ6Zp:active,.I60u8jY18Jgql5JkMgVM4 ._2_Urp67yPQdwe7j6JiJ6Zp:hover{
    background:#cc3727
}
.D-BnFsqLQkzx9CsUayzKH{
    display:flex;
    height:370px;
    width:450px
}
[data-app-mb] .D-BnFsqLQkzx9CsUayzKH{
    height:88vh;
    margin-bottom:0;
    width:88vw
}
._2FtCgQOwR7FjN6Uqa2Pbbw{
    display:flex;
    flex-direction:column;
    flex-shrink:0;
    height:100%;
    -webkit-overflow-scrolling:touch;
    overflow-x:hidden;
    overflow-y:auto;
    width:65px
}
[data-app-mb] ._2FtCgQOwR7FjN6Uqa2Pbbw{
    margin:0;
    width:50px
}
._2FtCgQOwR7FjN6Uqa2Pbbw ._3U2tYUyGGRbDoHAqDiYkP1{
    background-origin:content-box;
    background-position:50%;
    background-repeat:no-repeat;
    background-size:contain;
    cursor:pointer;
    flex-shrink:0;
    height:48px;
    padding:10%;
    position:relative;
    width:48px
}
[data-app-mb] ._2FtCgQOwR7FjN6Uqa2Pbbw ._3U2tYUyGGRbDoHAqDiYkP1{
    height:50px;
    width:50px
}
._2FtCgQOwR7FjN6Uqa2Pbbw ._3U2tYUyGGRbDoHAqDiYkP1 i{
    color:#fff;
    font-size:2.1rem;
    left:50%;
    position:absolute;
    top:50%;
    transform:translate(-50%,-50%)
}
.Rq2U3zTqVk18dSSqibvdT{
    flex-grow:1;
    -webkit-overflow-scrolling:touch;
    -ms-overflow-style:none;
    overflow-x:hidden;
    overflow-y:auto;
    padding-left:8px;
    scrollbar-width:none
}
.Rq2U3zTqVk18dSSqibvdT::-webkit-scrollbar{
    display:none
}
[data-app-mb] .Rq2U3zTqVk18dSSqibvdT{
    padding-right:0
}
.rdz8W7Ua16SIRmTHsGsCI{
    align-content:flex-start;
    display:flex;
    flex-shrink:0;
    flex-wrap:wrap;
    height:100%
}
.rdz8W7Ua16SIRmTHsGsCI ._2-iv6vJ21-Z7t-e_0Oo2nh{
    background-color:#333;
    background-origin:content-box;
    background-position:50%;
    background-repeat:no-repeat;
    background-size:contain;
    border-radius:5px;
    cursor:pointer;
    height:71.4px;
    margin-bottom:4px;
    margin-left:4px;
    padding:2%;
    transition:all .1s ease-out;
    width:71.4px
}
[data-app-mb] .rdz8W7Ua16SIRmTHsGsCI ._2-iv6vJ21-Z7t-e_0Oo2nh{
    height:calc((88vw - 75px)/5);
    width:calc((88vw - 75px)/5)
}
.rdz8W7Ua16SIRmTHsGsCI ._2-iv6vJ21-Z7t-e_0Oo2nh:active,.rdz8W7Ua16SIRmTHsGsCI ._2-iv6vJ21-Z7t-e_0Oo2nh:hover{
    background-color:#888
}
.rdz8W7Ua16SIRmTHsGsCI ._2-iv6vJ21-Z7t-e_0Oo2nh .LtDTPnMluFSVIX-hz66WF{
    align-items:center;
    color:#fff;
    display:flex;
    flex-direction:column;
    height:100%;
    justify-content:center;
    width:100%
}
.rdz8W7Ua16SIRmTHsGsCI ._2-iv6vJ21-Z7t-e_0Oo2nh .LtDTPnMluFSVIX-hz66WF i{
    font-size:2.5rem
}
.rdz8W7Ua16SIRmTHsGsCI ._2-iv6vJ21-Z7t-e_0Oo2nh .LtDTPnMluFSVIX-hz66WF span{
    font-size:12px
}
[data-app-mb] .rdz8W7Ua16SIRmTHsGsCI ._2-iv6vJ21-Z7t-e_0Oo2nh .LtDTPnMluFSVIX-hz66WF span{
    font-size:9px
}
.TFHRIGj-h2SS3RlwT_VIq{
    align-content:space-between;
    border-radius:2px;
    display:flex;
    flex-flow:row wrap;
    height:calc(6rem + 4px);
    justify-content:space-between;
    width:calc(6rem + 4px)
}
.TFHRIGj-h2SS3RlwT_VIq .aC5RDXi9Z-UsRjF-7MorY{
    border:1px solid #fbc308;
    border-radius:5px;
    cursor:pointer;
    height:3rem;
    width:3rem
}
.TFHRIGj-h2SS3RlwT_VIq .aC5RDXi9Z-UsRjF-7MorY._2z1AH8S_qyWnqiSn2m4qba,.TFHRIGj-h2SS3RlwT_VIq .aC5RDXi9Z-UsRjF-7MorY:hover{
    background-color:#fbc308
}
._2uDz4ZGO3W9Zza0oFF8Apz{
    background:#e74c3c;
    border-radius:5px;
    color:#fff;
    cursor:pointer;
    margin-top:5px;
    padding:5px;
    text-align:center;
    transition:all .2s ease;
    width:100%
}
._2uDz4ZGO3W9Zza0oFF8Apz:active,._2uDz4ZGO3W9Zza0oFF8Apz:hover{
    background:#cc3727
}
.DRt5Lkb2i31av0E4u_ndl{
    align-items:center;
    display:flex;
    flex-direction:column;
    justify-content:flex-end;
    position:fixed;
    z-index:100
}
.DRt5Lkb2i31av0E4u_ndl,.DRt5Lkb2i31av0E4u_ndl .jEidg1iXYkV_jD5IwRo1A{
    bottom:0;
    left:0;
    right:0;
    top:0
}
.DRt5Lkb2i31av0E4u_ndl .jEidg1iXYkV_jD5IwRo1A{
    -webkit-backdrop-filter:blur(2px);
    backdrop-filter:blur(2px);
    background:rgba(0,0,0,.9);
    position:absolute;
    z-index:-1
}
.DRt5Lkb2i31av0E4u_ndl .jEidg1iXYkV_jD5IwRo1A>i{
    display:none
}
._3E7iyIbjSUEatI_fbMhncA{
    bottom:0;
    left:0;
    overflow:hidden;
    position:fixed;
    right:0;
    top:0;
    touch-action:none;
    will-change:opacity;
    z-index:1002
}
.DD9z6ae3KCoIp4agwY5aX,._3g6HK9N6BDGvX7GsnLump8,._1vgmTgEC6Ns2iRAZA_O8mB{
    color:#fff;
    cursor:pointer;
    font-size:2rem;
    opacity:.5;
    position:absolute;
    width:3rem;
    z-index:3
}
[data-app-ho] .DD9z6ae3KCoIp4agwY5aX:hover,[data-app-ho] ._3g6HK9N6BDGvX7GsnLump8:hover,[data-app-ho] ._1vgmTgEC6Ns2iRAZA_O8mB:hover{
    opacity:1
}
.DD9z6ae3KCoIp4agwY5aX{
    height:3.4rem;
    right:0;
    top:0
}
._3g6HK9N6BDGvX7GsnLump8,._1vgmTgEC6Ns2iRAZA_O8mB{
    top:50%;
    transform:translateY(-50%)
}
._3g6HK9N6BDGvX7GsnLump8._1N1W3kFe_jxccN7dSMTWbH,._1vgmTgEC6Ns2iRAZA_O8mB._1N1W3kFe_jxccN7dSMTWbH{
    bottom:52px;
    top:52px;
    transform:none
}
._3g6HK9N6BDGvX7GsnLump8 i,._1vgmTgEC6Ns2iRAZA_O8mB i{
    padding:.5rem
}
._1vgmTgEC6Ns2iRAZA_O8mB{
    left:0;
    text-align:left
}
._3g6HK9N6BDGvX7GsnLump8{
    right:0;
    text-align:right
}
._2x5OvtR5-ARzelV_jdk3nn{
    background:#000;
    bottom:0;
    left:0;
    position:absolute;
    right:0;
    top:0;
    will-change:opacity;
    z-index:-1
}
._1EqKrYDjNM0Om_JRMG-LcV{
    position:relative;
    will-change:transform;
    z-index:2
}
._12HUl9BA0IUDaSkxgSTYSv,._1EqKrYDjNM0Om_JRMG-LcV{
    display:flex;
    height:100%;
    width:100%
}
._12HUl9BA0IUDaSkxgSTYSv{
    align-items:center;
    color:#fff;
    justify-content:center;
    position:absolute;
    -webkit-tap-highlight-color:transparent;
    touch-action:none;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
}
._12HUl9BA0IUDaSkxgSTYSv .jEidg1iXYkV_jD5IwRo1A{
    z-index:1
}
._2lZeHY513WpJ0IyjKiRGM0,._12HUl9BA0IUDaSkxgSTYSv .jEidg1iXYkV_jD5IwRo1A{
    bottom:0;
    left:0;
    position:absolute;
    right:0;
    top:0
}
._2lZeHY513WpJ0IyjKiRGM0{
    pointer-events:none;
    will-change:opacity;
    z-index:10
}
._2lZeHY513WpJ0IyjKiRGM0>*{
    pointer-events:auto
}
._3sbi4QhPHbCX7IgMJjnGeg{
    background:#1d1d1d;
    bottom:0;
    color:#fff;
    left:50%;
    padding:15px 15px calc(15px + 0px);
    padding:15px 15px calc(15px + env(safe-area-inset-bottom));
    position:absolute;
    transform:translateX(-50%);
    width:100%;
    z-index:4
}
._3sbi4QhPHbCX7IgMJjnGeg ._2CZ3qjK7OTIWX2Vxr3xIzW{
    align-items:center;
    display:flex;
    justify-content:space-between;
    margin:0 auto;
    max-width:1136px
}
.RDwoN9xkEcVC8osnQ3vT a{
    color:#fbc308;
    display:inline-block;
    padding:0 15px
}
._1w2bf841Hp94FxAT2-43SA{
    background-image:linear-gradient(rgba(0,0,0,1),rgba(0,0,0,0));
    top:0
}
._1wN9GFC9nstf-Ef5vUxUZC,._1w2bf841Hp94FxAT2-43SA{
    height:50px;
    left:0;
    position:fixed;
    right:0;
    z-index:3
}
._1wN9GFC9nstf-Ef5vUxUZC{
    background-image:linear-gradient(0deg,rgba(0,0,0,1),rgba(0,0,0,0));
    bottom:0
}
._3npjFYN6Ktl3GjZYo5MMOk{
    align-items:center;
    display:flex;
    justify-content:center;
    left:0;
    margin:.5rem auto 0;
    position:absolute;
    right:0;
    top:0;
    width:50vw;
    z-index:1003
}
.-Neh0ycb-N74Avio5e70D{
    display:flex;
    flex-grow:1;
    justify-content:space-between
}
.-Neh0ycb-N74Avio5e70D._2v9-GwBZ9XvCPKvB_S1tzf{
    bottom:-5rem
}
[data-app-mb] .-Neh0ycb-N74Avio5e70D{
    margin-bottom:0;
    width:80vw
}
._2JXiEvLQnkSDbWOH7ukLgB{
    color:#fff;
    cursor:pointer;
    font-size:1.9rem;
    margin:0 10px
}
._2JXiEvLQnkSDbWOH7ukLgB._2Rx3fAYIu0M5ecNlQg7vAg,._2JXiEvLQnkSDbWOH7ukLgB:active,._2JXiEvLQnkSDbWOH7ukLgB:hover{
    color:#fbc308
}
._2JXiEvLQnkSDbWOH7ukLgB.ac1cOv7MizCeLxcdie7zs{
    opacity:.5;
    pointer-events:none
}
._3uxDVT-vKW4_wuKCYHhRvU{
    max-width:100vw;
    z-index:1003
}
.Kr7KL2cbb5H-CbM_6qGmW{
    display:flex;
    flex-wrap:nowrap;
    -webkit-overflow-scrolling:touch;
    overflow-x:auto;
    overflow-y:hidden
}
.Kr7KL2cbb5H-CbM_6qGmW::-webkit-scrollbar{
    height:none
}
.Kr7KL2cbb5H-CbM_6qGmW .oiY9L1Jg3bhmBjmi34p-C{
    background-position:50%;
    background-size:cover;
    cursor:pointer;
    display:inline-block;
    flex:0 0 auto;
    height:3rem;
    margin:0 2px;
    transition:all .1s ease;
    width:3rem
}
.Kr7KL2cbb5H-CbM_6qGmW .oiY9L1Jg3bhmBjmi34p-C._2Rx3fAYIu0M5ecNlQg7vAg{
    box-shadow:inset 0 0 0 2px #fbc308
}
._1_nqSLw902U24lGOqmd9fO{
    align-items:center;
    display:flex;
    flex-direction:column;
    font-size:.85rem;
    height:160px;
    justify-content:center;
    left:0;
    margin:-80px 0;
    position:absolute;
    text-align:center;
    top:50%;
    width:100%
}
._1_nqSLw902U24lGOqmd9fO>h1,._1_nqSLw902U24lGOqmd9fO h2{
    font-family:HelveticaNeue-Light,Helvetica Neue,Lantinghei TC,Segoe UI Light,Segoe UI,å¾®è»Ÿæ­£é»‘é«”,Microsoft JhengHei UI,WenQuanYi Zen Hei,Helvetica,Arial,sans-serif;
    font-weight:100
}
._1_nqSLw902U24lGOqmd9fO a{
    color:#fbc308
}
@media(max-width:767px){
    ._2WCHpfTZB6AUMqGKQ-Alvm{
        padding:.6rem
    }
}
._1ND4IvZZQRokGesVd9vq9W{
    align-items:center;
    background:#f5f5f5;
    box-shadow:inset 0 1px #e0e0e0,inset 0 -1px #e0e0e0;
    color:#222;
    cursor:pointer;
    display:flex;
    flex-shrink:0;
    height:4rem
}
[data-app-dm] ._1ND4IvZZQRokGesVd9vq9W{
    background:#000;
    box-shadow:none;
    color:#f6f6f6
}
._1ND4IvZZQRokGesVd9vq9W ._3u5x6Yhk7GW6YjbzL_BPLN{
    flex:1 1;
    font-size:.9rem;
    font-weight:700;
    line-height:1.4rem
}
._1ND4IvZZQRokGesVd9vq9W ._3u5x6Yhk7GW6YjbzL_BPLN .AUfRBgOiUMW2sxou1GucL{
    color:#fbc308;
    cursor:pointer;
    display:inline;
    font-size:.85rem
}
._1ND4IvZZQRokGesVd9vq9W ._1jUr0ujizRaBV5K_VB6-ML{
    font-size:1.6rem;
    text-align:center;
    width:4rem
}
._1ND4IvZZQRokGesVd9vq9W ._2bCya4n1VFoSjqPCfwbQ0N{
    cursor:pointer;
    font-size:1.4rem;
    text-align:center;
    width:3rem
}
._104Xz-AMZKOPR1qS6fu7Xn{
    background:#f6f6f6;
    height:calc(100vh - 3rem);
    margin-bottom:0px;
    margin-bottom:env(safe-area-inset-bottom);
    -webkit-overflow-scrolling:touch;
    -ms-overflow-style:-ms-autohiding-scrollbar;
    overflow-y:scroll;
    padding-bottom:1.5rem;
    position:relative;
    width:100%
}
._104Xz-AMZKOPR1qS6fu7Xn>div{
    flex-grow:1
}
[data-app-of] ._104Xz-AMZKOPR1qS6fu7Xn{
    background:#eee;
    height:calc(100vh - 3rem - 70px)
}
[data-app-dm] ._104Xz-AMZKOPR1qS6fu7Xn{
    background:#151515
}
._3jxQCFWg9LDtkSkIVLzQ8L,._4SkbmyWbShmINbRPY-Jps{
    max-width:100%
}
._1ByCoA3XapNi7uIVAh-3uY{
    align-items:flex-end;
    -webkit-backdrop-filter:saturate(180%) blur(5px);
    backdrop-filter:saturate(180%) blur(5px);
    background:rgba(246,246,246,.8);
    color:#888;
    cursor:pointer;
    display:flex;
    height:3rem;
    position:-webkit-sticky;
    position:sticky;
    transition:all .3s ease;
    transition-property:margin,background-color;
    z-index:3
}
._1ByCoA3XapNi7uIVAh-3uY:hover{
    background:#eee
}
._1ByCoA3XapNi7uIVAh-3uY ._3IN5-WbppwUe2EeMjlVoHz{
    align-items:center;
    display:flex;
    flex-grow:1;
    width:calc(100% - 2.6rem)
}
._1ByCoA3XapNi7uIVAh-3uY ._20xS8Ub6gDnd9tG1ryp8te{
    align-items:center;
    color:#848482;
    display:flex;
    font-size:1.4rem;
    height:3rem;
    justify-content:center;
    width:3rem
}
[data-app-of] ._1ByCoA3XapNi7uIVAh-3uY ._20xS8Ub6gDnd9tG1ryp8te{
    background:url(https://cdn.lihkg.com/static/2105289671-86ixn/media/office-mode-info-icon.png) no-repeat 50%;
    background-size:contain;
    height:1.3rem
}
._1ByCoA3XapNi7uIVAh-3uY ._2U_hm3Etdirsq4ULjAd5r_{
    flex-grow:1;
    padding-right:1rem;
    width:calc(100% - 3rem)
}
._1ByCoA3XapNi7uIVAh-3uY ._2U_hm3Etdirsq4ULjAd5r_ .HHp27NcLOTxhyKMDMQugN{
    align-items:flex-end;
    color:#fbc308;
    display:flex;
    flex:1 1;
    font-size:.7rem;
    justify-content:flex-start
}
._1ByCoA3XapNi7uIVAh-3uY ._2U_hm3Etdirsq4ULjAd5r_ .aKfN1ekIW_zW8OEq8z_Mp{
    color:#000;
    flex:1 1;
    font-size:.9rem;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
}
._1ByCoA3XapNi7uIVAh-3uY ._2U_hm3Etdirsq4ULjAd5r_ .aKfN1ekIW_zW8OEq8z_Mp div{
    align-items:center;
    display:flex
}
._1ByCoA3XapNi7uIVAh-3uY ._2U_hm3Etdirsq4ULjAd5r_ .aKfN1ekIW_zW8OEq8z_Mp img{
    height:.8rem;
    margin:0 4px;
    width:.8rem
}
[data-app-dm] ._1ByCoA3XapNi7uIVAh-3uY ._2U_hm3Etdirsq4ULjAd5r_ .aKfN1ekIW_zW8OEq8z_Mp{
    color:#ccc6c0
}
._1ByCoA3XapNi7uIVAh-3uY ._1s2WEFOjDQOmGb-8AwcMv_{
    align-items:center;
    display:flex;
    height:3rem;
    justify-content:center;
    width:2.6rem
}
._1ByCoA3XapNi7uIVAh-3uY ._1s2WEFOjDQOmGb-8AwcMv_ i{
    padding:5px;
    transition:color .2s ease-out
}
._1ByCoA3XapNi7uIVAh-3uY ._1s2WEFOjDQOmGb-8AwcMv_ i:hover{
    color:#222
}
[data-app-dm] ._1ByCoA3XapNi7uIVAh-3uY ._1s2WEFOjDQOmGb-8AwcMv_ i{
    color:#ccc6c0
}
[data-app-dm] ._1ByCoA3XapNi7uIVAh-3uY ._1s2WEFOjDQOmGb-8AwcMv_ i:hover{
    color:#fff
}
[data-app-dm] ._1ByCoA3XapNi7uIVAh-3uY{
    background:rgba(21,21,21,.8);
    color:#aaa
}
[data-app-of] ._1ByCoA3XapNi7uIVAh-3uY{
    background:#faf8be;
    border-bottom:1px solid #e5e5a3;
    color:#50504c;
    opacity:1
}
[data-app-of] ._1ByCoA3XapNi7uIVAh-3uY ._1s2WEFOjDQOmGb-8AwcMv_ i{
    color:#999;
    font-weight:700
}
[data-app-of] ._1ByCoA3XapNi7uIVAh-3uY ._1s2WEFOjDQOmGb-8AwcMv_ i:hover{
    color:#666
}
[data-app-of] ._4SkbmyWbShmINbRPY-Jps{
    margin:0 auto;
    max-width:1136px
}
[data-app-of] ._3jxQCFWg9LDtkSkIVLzQ8L{
    background:#fff;
    border:1px solid silver;
    margin-top:3rem;
    padding:1rem 0
}
._2IwB8kkjKSl2V_V2NRILCS{
    display:none
}
._8_NT40G-QNQzcSSTrRXAD{
    align-items:center;
    flex-direction:column;
    justify-content:center;
    line-height:1;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
}
._8_NT40G-QNQzcSSTrRXAD>i{
    font-size:1.3rem
}
._8_NT40G-QNQzcSSTrRXAD:after,._8_NT40G-QNQzcSSTrRXAD>b{
    content:attr(data-score);
    font-size:.6rem;
    font-weight:400;
    margin-top:.3rem
}
._8_NT40G-QNQzcSSTrRXAD>b{
    margin-top:.2rem
}
._30xvw6AN_1FuaXpPgLHbVf{
    margin-bottom:.5rem
}
._1cFMedP3MEBVdy1v0OVIax{
    display:flex;
    height:48px;
    justify-content:center;
    margin:2rem;
    perspective:200px;
    position:relative
}
._1PhR8JHkMcET5QT2PtCA3T{
    background-image:url(https://cdn.lihkg.com/static/2105289671-86ixn/media/f5-sprite.png);
    background-size:cover;
    cursor:pointer;
    display:inline-block;
    height:50px;
    -webkit-tap-highlight-color:transparent;
    width:50px
}
._1PhR8JHkMcET5QT2PtCA3T:active{
    background-position-x:50%
}
@-webkit-keyframes _2-IV75RwmVnY_l9Emg342c{
    to{
        opacity:1
    }
}
@keyframes _2-IV75RwmVnY_l9Emg342c{
    to{
        opacity:1
    }
}
@-webkit-keyframes _2EfR_LScj4XaGuT-Rz3RVq{
    0%{
        background-position:0
    }
    to{
        background-position:-1056px
    }
}
@keyframes _2EfR_LScj4XaGuT-Rz3RVq{
    0%{
        background-position:0
    }
    to{
        background-position:-1056px
    }
}
._1CehIdSm5osAL3gvutVtS2{
    -webkit-animation:_2-IV75RwmVnY_l9Emg342c .5s linear .5s forwards,_2EfR_LScj4XaGuT-Rz3RVq .8s steps(8) infinite;
    animation:_2-IV75RwmVnY_l9Emg342c .5s linear .5s forwards,_2EfR_LScj4XaGuT-Rz3RVq .8s steps(8) infinite;
    background:url(https://cdn.lihkg.com/static/2105289671-86ixn/media/f5bouncer.png) 50% no-repeat;
    bottom:-2px;
    height:266px;
    left:50%;
    margin-left:-28px;
    opacity:0;
    position:absolute;
    transform:scale(.42481203);
    transform-origin:0 100%;
    width:132px;
    z-index:2
}
._2jbljXLy-2QysQ9emPjtQx{
    background:rgba(128,128,128,.25)!important
}
[data-app-dm] ._2jbljXLy-2QysQ9emPjtQx{
    background:#222!important;
    color:#f1c40f!important
}
@media(max-width:767px){
    ._104Xz-AMZKOPR1qS6fu7Xn{
        height:auto;
        overflow-y:hidden;
        padding:0
    }
    ._1fIqx-rTy_kEf9wNWCzZDW{
        flex-basis:100%;
        flex-direction:column;
        max-width:none;
        position:relative;
        width:100%
    }
    ._2Gv3q2x6tLUMsrdcaO7i0j{
        display:none
    }
    .PmcQfXhFNh-qv6-8HmYRx+.PmcQfXhFNh-qv6-8HmYRx{
        margin-top:.5rem
    }
    ._2jbljXLy-2QysQ9emPjtQx{
        background:rgba(128,128,128,.4)!important;
        color:#222!important
    }
    [data-app-dm] ._2jbljXLy-2QysQ9emPjtQx{
        background:#222!important;
        color:#f1c40f!important
    }
}
@media(-ms-high-contrast:none),screen and (-ms-high-contrast:active){
    ._1ByCoA3XapNi7uIVAh-3uY{
        background:rgba(246,246,246,.9)
    }
    [data-app-dm] ._1ByCoA3XapNi7uIVAh-3uY{
        background:rgba(21,21,21,.9)
    }
}
@supports not ((-webkit-backdrop-filter:blur(5px)) or (backdrop-filter:blur(5px))){
    ._1ByCoA3XapNi7uIVAh-3uY{
        background:rgba(246,246,246,.9)
    }
    [data-app-dm] ._1ByCoA3XapNi7uIVAh-3uY{
        background:rgba(21,21,21,.9)
    }
}
._2JnkV7flhQCKN2EsmonRcN{
    display:flex;
    flex-grow:1;
    height:calc(100vh - 3rem)
}
._2JnkV7flhQCKN2EsmonRcN._2UfIV4UL6jVvX97bbrW791{
    flex-direction:column;
    padding-top:70px
}
._2JnkV7flhQCKN2EsmonRcN._2UfIV4UL6jVvX97bbrW791:before{
    background:url(https://cdn.lihkg.com/static/2105289671-86ixn/media/office-mode-placeholder.jpg) 0 0 no-repeat;
    border-bottom:1px solid #d0d0d0;
    content:"";
    height:70px;
    -ms-interpolation-mode:nearest-neighbor;
    image-rendering:-moz-crisp-edges;
    image-rendering:pixelated;
    left:0;
    position:absolute;
    top:3rem;
    width:100%
}
._2JnkV7flhQCKN2EsmonRcN._2UfIV4UL6jVvX97bbrW791:after{
    background:linear-gradient(270deg,#f6f6f6 20%,rgba(246,246,246,0));
    content:"";
    height:69px;
    position:absolute;
    right:0;
    top:0;
    width:40px;
    z-index:2
}
.C_300Fi04lLpFu_ZznJqq{
    background:#fff;
    border-right:1px solid #e0e0e0;
    flex-basis:30%;
    flex-direction:column;
    flex-shrink:0;
    height:calc(100vh - 3rem);
    max-width:480px;
    min-width:300px;
    -webkit-overflow-scrolling:touch;
    -ms-overflow-style:-ms-autohiding-scrollbar;
    overflow-y:scroll;
    padding-bottom:1px;
    position:relative
}
[data-app-dm] .C_300Fi04lLpFu_ZznJqq{
    background:#1d1d1d;
    border-color:#3b3a39
}
.eslltWt3HgKnG_miBwvfx{
    display:flex;
    flex-grow:1;
    overflow:hidden
}
body:not([data-app-tv]):not([data-app-sm]) .C_300Fi04lLpFu_ZznJqq{
    border:0;
    display:flex;
    flex:1 1;
    max-width:none;
    min-width:0
}
body:not([data-app-tv]):not([data-app-sm]) .eslltWt3HgKnG_miBwvfx,body[data-app-tv]:not([data-app-sm]) .O4s3-RmwMD9N5cXhKS_DB,body[data-app-tv]:not([data-app-sm]) .C_300Fi04lLpFu_ZznJqq{
    display:none
}
.D0MIrDaQVCROYmrlpFNJp{
    border:0;
    flex-grow:1;
    height:100%
}
body:not([data-app-dm]) .D0MIrDaQVCROYmrlpFNJp{
    background:#f6f6f6
}
@media(max-width:767px){
    ._2JnkV7flhQCKN2EsmonRcN{
        margin-bottom:3rem;
        min-height:calc(100vh - 6rem);
        top:0
    }
    ._2JnkV7flhQCKN2EsmonRcN,.C_300Fi04lLpFu_ZznJqq{
        height:auto;
        position:relative
    }
    .C_300Fi04lLpFu_ZznJqq{
        border:0;
        flex-basis:100%;
        max-width:none;
        overflow-y:hidden
    }
    [data-app-tv] .C_300Fi04lLpFu_ZznJqq{
        display:none
    }
    [data-app-tv] ._2JnkV7flhQCKN2EsmonRcN{
        top:0
    }
    .D0MIrDaQVCROYmrlpFNJp{
        display:none
    }
}
@media(min-width:768px){
    [data-app-dm] ._3sjOjTTxthJrK9YARhzXiD{
        background:#151515
    }
}
*,:after,:before{
    box-sizing:border-box
}
::-moz-selection{
    background:#fbc308;
    color:#000
}
::selection{
    background:#fbc308;
    color:#000
}
::-moz-selection{
    background:#fbc308;
    color:#000
}
a{
    text-decoration:none
}
a:hover{
    text-decoration:underline
}
button{
    background:0 0;
    border:0;
    color:inherit;
    outline:0;
    padding:0
}
body{
    background:#fff;
    box-sizing:border-box;
    color:#000;
    font-family:Helvetica Neue,Helvetica,Arial,Microsoft JhengHei,sans-serif;
    font-size:16px;
    margin:0;
    padding:0 0px 0 0px;
    padding:0 env(safe-area-inset-right) 0 env(safe-area-inset-left);
    -webkit-text-size-adjust:100%;
    -moz-text-size-adjust:100%;
    text-size-adjust:100%
}
body[data-app-mb][data-app-tv]:not([data-app-dm]){
    background:#f6f6f6
}
body[data-app-dm]{
    background:#151515;
    color:#fff
}
body:not([data-app-sm]),body[data-app-cx]{
    background:#e5e5e5
}
body[data-app-dm]:not([data-app-sm]),body[data-app-dm][data-app-cx]{
    background:#000
}
body:not([data-app-sm]) #app{
    max-width:1136px
}
body:not([data-app-sm]) #app,body[data-app-cx] #app{
    background:#f6f6f6;
    height:100vh;
    margin:0 auto;
    overflow-x:hidden;
    position:relative
}
body[data-app-cx] #app{
    max-width:1280px
}
body:not([data-app-sm]):not([data-app-of]) #app{
    box-shadow:0 0 0 1px rgba(128,128,128,.15)
}
@media(max-width:1135px){
    body:not([data-app-sm]):not([data-app-of]) #app{
        border:0
    }
}
body[data-app-of] #app{
    max-width:100%!important
}
body[data-app-dm] #app{
    background:#151515
}
body:not([data-app-mb]) #app{
    display:flex;
    flex-direction:column;
    height:100vh
}
body:not([data-app-mb]) ::-webkit-scrollbar{
    width:.8rem
}
body:not([data-app-mb]) ::-webkit-scrollbar-thumb{
    background-clip:padding-box;
    background-color:rgba(128,128,128,.4);
    border:2px solid transparent;
    border-radius:.8rem;
    box-shadow:inset -1px -1px 0 rgba(0,0,0,.05),inset 1px 1px 0 rgba(0,0,0,.05)
}
body:not([data-app-mb]) ::-webkit-scrollbar-thumb:hover{
    background-color:rgba(128,128,128,.8)
}
body[data-app-dm]:not([data-app-mb]){
    -ms-overflow-style:-ms-autohiding-scrollbar;
    scrollbar-arrow-color:#a6a6a6;
    scrollbar-base-color:#666;
    scrollbar-color:#404040 #151515;
    scrollbar-dark-shadow-color:#222;
    scrollbar-highlight-color:#a6a6a6;
    scrollbar-shadow-color:#222;
    scrollbar-track-color:#151515
}
@media(max-width:767px){
    blockquote{
        font-size:.95rem
    }
    body:not([data-app-sm]) #app{
        height:100%
    }
    body{
        padding-top:48px
    }
}
[data-emoji-container]{
    cursor:text;
    display:inline-block
}
[data-ic=emoji]{
    height:1.2em;
    pointer-events:none;
    vertical-align:text-bottom;
    width:1.2em
}
.hideEl{
    display:none
}
.__react_component_tooltip{
    line-height:1;
    z-index:999999
}
[data-app-dm] .__react_component_tooltip{
    background-color:#fff!important;
    color:#222!important
}
[data-app-dm] .__react_component_tooltip.place-bottom:after{
    border-bottom-color:#fff!important
}
[data-app-dm] .__react_component_tooltip.type-dark.place-top:after{
    border-top-color:#fff!important
}
[data-app-dm] .__react_component_tooltip.type-dark.place-left:after{
    border-left-color:#fff!important
}
[data-app-dm] .__react_component_tooltip.type-dark.place-right:after{
    border-right-color:#fff!important
}
pre{
    border-radius:4px;
    display:block;
    overflow-x:auto;
    padding:1rem;
    text-align:left;
    word-break:normal;
    word-wrap:normal
}
code{
    display:inline-block;
    font-family:Ubuntu Mono,monospace;
    font-size:1rem!important;
    font-style:normal;
    font-weight:400;
    line-height:1.1rem;
    text-decoration:none
}
[data-app-fs=xs] code{
    font-size:.8rem!important
}
[data-app-fs=s] code{
    font-size:.9rem!important
}
[data-app-fs=m] code{
    font-size:1rem!important
}
[data-app-fs=l] code{
    font-size:1.1rem!important
}
[data-app-fs=xl] code{
    font-size:1.2rem!important
}
[data-app-dm] pre{
    background:#2a2a2a
}
[data-app-dm] code{
    color:#abb2bf
}
[data-app-dm] .hljs-comment,[data-app-dm] .hljs-quote{
    color:#5c6370;
    font-style:italic
}
[data-app-dm] .hljs-doctag,[data-app-dm] .hljs-formula,[data-app-dm] .hljs-keyword{
    color:#c678dd
}
[data-app-dm] .hljs-deletion,[data-app-dm] .hljs-name,[data-app-dm] .hljs-section,[data-app-dm] .hljs-selector-tag,[data-app-dm] .hljs-subst{
    color:#e06c75
}
[data-app-dm] .hljs-literal{
    color:#56b6c2
}
[data-app-dm] .hljs-addition,[data-app-dm] .hljs-attribute,[data-app-dm] .hljs-meta-string,[data-app-dm] .hljs-regexp,[data-app-dm] .hljs-string{
    color:#98c379
}
[data-app-dm] .hljs-built_in,[data-app-dm] .hljs-class .hljs-title{
    color:#e6c07b
}
[data-app-dm] .hljs-attr,[data-app-dm] .hljs-number,[data-app-dm] .hljs-selector-attr,[data-app-dm] .hljs-selector-class,[data-app-dm] .hljs-selector-pseudo,[data-app-dm] .hljs-template-variable,[data-app-dm] .hljs-type,[data-app-dm] .hljs-variable{
    color:#d19a66
}
[data-app-dm] .hljs-bullet,[data-app-dm] .hljs-link,[data-app-dm] .hljs-meta,[data-app-dm] .hljs-selector-id,[data-app-dm] .hljs-symbol,[data-app-dm] .hljs-title{
    color:#61aeee
}
[data-app-dm] .hljs-emphasis{
    font-style:italic
}
[data-app-dm] .hljs-strong{
    font-weight:700
}
[data-app-dm] .hljs-link{
    text-decoration:underline
}
body:not([data-app-dm]) pre{
    background:#f8f8f8
}
body:not([data-app-dm]) code{
    color:#333
}
body:not([data-app-dm]) .hljs-comment,body:not([data-app-dm]) .hljs-quote{
    color:#998;
    font-style:italic
}
body:not([data-app-dm]) .hljs-keyword,body:not([data-app-dm]) .hljs-selector-tag,body:not([data-app-dm]) .hljs-subst{
    color:#333;
    font-weight:700
}
body:not([data-app-dm]) .hljs-literal,body:not([data-app-dm]) .hljs-number,body:not([data-app-dm]) .hljs-tag .hljs-attr,body:not([data-app-dm]) .hljs-template-variable,body:not([data-app-dm]) .hljs-variable{
    color:teal
}
body:not([data-app-dm]) .hljs-doctag,body:not([data-app-dm]) .hljs-string{
    color:#d14
}
body:not([data-app-dm]) .hljs-section,body:not([data-app-dm]) .hljs-selector-id,body:not([data-app-dm]) .hljs-title{
    color:#900;
    font-weight:700
}
body:not([data-app-dm]) .hljs-subst{
    font-weight:400
}
body:not([data-app-dm]) .hljs-class .hljs-title,body:not([data-app-dm]) .hljs-type{
    color:#458;
    font-weight:700
}
body:not([data-app-dm]) .hljs-attribute,body:not([data-app-dm]) .hljs-name,body:not([data-app-dm]) .hljs-tag{
    color:navy;
    font-weight:400
}
body:not([data-app-dm]) .hljs-link,body:not([data-app-dm]) .hljs-regexp{
    color:#009926
}
body:not([data-app-dm]) .hljs-bullet,body:not([data-app-dm]) .hljs-symbol{
    color:#990073
}
body:not([data-app-dm]) .hljs-built_in,body:not([data-app-dm]) .hljs-builtin-name{
    color:#0086b3
}
body:not([data-app-dm]) .hljs-meta{
    color:#999;
    font-weight:700
}
body:not([data-app-dm]) .hljs-deletion{
    background:#fdd
}
body:not([data-app-dm]) .hljs-addition{
    background:#dfd
}
body:not([data-app-dm]) .hljs-emphasis{
    font-style:italic
}
body:not([data-app-dm]) .hljs-strong{
    font-weight:700
}
._2Fi5r-r5neCNzgXW_5QUTE{
    bottom:0;
    left:0;
    position:absolute;
    right:0;
    top:3rem;
    width:100%
}
._2Fi5r-r5neCNzgXW_5QUTE,._2JCwTEns2GTA3h_-GD7p5W{
    align-items:center;
    display:flex;
    justify-content:center
}
[data-app-mb] ._2JCwTEns2GTA3h_-GD7p5W{
    align-items:center;
    flex-direction:column
}
.qocimDAXZ7JaCKzNZ6Lx8{
    display:inline-block;
    position:relative;
    -webkit-tap-highlight-color:transparent
}
[data-app-mb] .qocimDAXZ7JaCKzNZ6Lx8{
    margin-bottom:2rem;
    margin-right:.5rem
}
@-webkit-keyframes _2T6qj7Wp1btknVzBAIpl6e{
    22.2%{
        transform:rotate(-22deg)
    }
    44.4%{
        transform:rotate(-28deg)
    }
    66.6%{
        transform:rotate(-20deg)
    }
    88.8%{
        transform:rotate(-30deg)
    }
}
@keyframes _2T6qj7Wp1btknVzBAIpl6e{
    22.2%{
        transform:rotate(-22deg)
    }
    44.4%{
        transform:rotate(-28deg)
    }
    66.6%{
        transform:rotate(-20deg)
    }
    88.8%{
        transform:rotate(-30deg)
    }
}
._2iqFCi25bMvgOIElPy6vm5{
    background:url(data:image/svg+xml;
    base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NzIgNjcyIj48ZGVmcz48c3R5bGU+LnN7c3Ryb2tlOiMwMDA7c3Ryb2tlLXdpZHRoOjQ0O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjEwfTwvc3R5bGU+PC9kZWZzPjxjaXJjbGUgY2xhc3M9InMiIGZpbGw9IiNhNWNmMDAiIGN4PSIzMzUuOCIgY3k9IjMzNS44IiByPSIzMTMuOCIvPjxwYXRoIGNsYXNzPSJzIiBkPSJNMTU2IDIwMS4zbDEzNSAxMzVNMjkxIDIwMS4zbC0xMzUgMTM1TTM4MC42IDIwMS4zbDEzNSAxMzVNNTE1LjYgMjAxLjNsLTEzNSAxMzUiLz48cGF0aCBmaWxsPSIjZmYxNTE1IiBkPSJNMjc5LjMgNDg4LjVzMzUuNCAxNDYuMyAxMTMuNSAxNTcuM2M0MC40IDUuNyAxMDAuOC0xNS45IDEyLjEtMTU3Ljd6Ii8+PHBhdGggY2xhc3M9InMiIGZpbGw9Im5vbmUiIGQ9Ik01MDUuOCA1MTUuMXMtMTcuMi00NC44LTczLjEtNDQuOEgyMzljLTU2IDAtNzMuMSA0NC44LTczLjEgNDQuOCIvPjwvc3ZnPg==) 50% no-repeat;
    height:8rem;
    transform:rotate(-25deg);
    width:8rem;
    z-index:2
}
._2iqFCi25bMvgOIElPy6vm5+.OrRYZWHvLhUzs9hPst55D{
    background:rgba(128,128,128,.25);
    border-radius:50%;
    bottom:.5rem;
    box-shadow:0 0 12px 16px rgba(128,128,128,.25);
    height:1rem;
    left:.5rem;
    position:absolute;
    width:8rem;
    z-index:1
}
._2iqFCi25bMvgOIElPy6vm5._2T6qj7Wp1btknVzBAIpl6e{
    -webkit-animation:_2T6qj7Wp1btknVzBAIpl6e .4s linear;
    animation:_2T6qj7Wp1btknVzBAIpl6e .4s linear
}
._39k15aWkg1wIl-C4G4Km_m{
    font-size:6.5rem;
    font-weight:400
}
[data-app-mb] ._39k15aWkg1wIl-C4G4Km_m{
    font-size:4rem;
    margin-left:0
}
.BHRnrRqOZcoYjFiI8k7Cm{
    margin:0 0 0 2.5rem
}
.BHRnrRqOZcoYjFiI8k7Cm strong{
    font-size:1.5rem;
    font-weight:500;
    line-height:3rem
}
[data-app-mb] .BHRnrRqOZcoYjFiI8k7Cm{
    margin-left:0
}
[data-app-mb] .BHRnrRqOZcoYjFiI8k7Cm strong{
    font-size:1.2rem;
    line-height:2.5rem
}
[data-app-dm] ._1Rz9UQcpcrR0Fn9P5B29Su{
    background-color:#1d1d1d
}
[data-app-dm] ._1Rz9UQcpcrR0Fn9P5B29Su:after{
    border-color:#1d1d1d transparent transparent #1d1d1d
}
._1Rb5hzxfh3kwe9QXjPVRZ0{
    align-items:center;
    background:#fff;
    border:1px solid #999;
    border-radius:4px;
    display:flex;
    justify-content:center;
    min-height:64px;
    min-width:64px;
    padding:4px;
    pointer-events:none;
    position:fixed;
    transform:translateX(-50%);
    z-index:100
}
[data-app-dm] ._1Rb5hzxfh3kwe9QXjPVRZ0{
    background:#222;
    border-color:#777
}
._1Rb5hzxfh3kwe9QXjPVRZ0:after,._1Rb5hzxfh3kwe9QXjPVRZ0:before{
    border:0 solid transparent;
    content:"";
    left:50%;
    position:absolute
}
._1Rb5hzxfh3kwe9QXjPVRZ0:before{
    border-width:9px;
    margin-left:-9px
}
._1Rb5hzxfh3kwe9QXjPVRZ0:after{
    border-width:8px;
    margin-left:-8px
}
._1Rb5hzxfh3kwe9QXjPVRZ0._1W0btuS97j7c_wx6BNgkBY:before{
    border-bottom-color:#999;
    top:-18px
}
[data-app-dm] ._1Rb5hzxfh3kwe9QXjPVRZ0._1W0btuS97j7c_wx6BNgkBY:before{
    border-bottom-color:#777
}
._1Rb5hzxfh3kwe9QXjPVRZ0._14l3aLYdyw0LREJ9XSRFhE:before{
    border-top-color:#999;
    bottom:-18px
}
[data-app-dm] ._1Rb5hzxfh3kwe9QXjPVRZ0._14l3aLYdyw0LREJ9XSRFhE:before{
    border-top-color:#777
}
._1Rb5hzxfh3kwe9QXjPVRZ0._1W0btuS97j7c_wx6BNgkBY:after{
    border-bottom-color:#fff;
    top:-16px
}
[data-app-dm] ._1Rb5hzxfh3kwe9QXjPVRZ0._1W0btuS97j7c_wx6BNgkBY:after{
    border-bottom-color:#222
}
._1Rb5hzxfh3kwe9QXjPVRZ0._14l3aLYdyw0LREJ9XSRFhE:after{
    border-top-color:#fff;
    bottom:-16px
}
[data-app-dm] ._1Rb5hzxfh3kwe9QXjPVRZ0._14l3aLYdyw0LREJ9XSRFhE:after{
    border-top-color:#222
}
._1Rb5hzxfh3kwe9QXjPVRZ0>._373upDx6Hxdx3UCdg6jDoi{
    overflow:hidden
}
._1Rb5hzxfh3kwe9QXjPVRZ0>._373upDx6Hxdx3UCdg6jDoi>img{
    vertical-align:bottom
}
._1Rb5hzxfh3kwe9QXjPVRZ0 .io7e5wpz4cP6PV-pfcgB7{
    align-items:center;
    background:rgba(0,0,0,.3);
    bottom:4px;
    color:#fff;
    display:flex;
    flex-direction:column;
    font-size:.8rem;
    font-weight:700;
    justify-content:center;
    left:4px;
    position:absolute;
    right:4px;
    text-shadow:0 1px 4px #000;
    top:4px
}
._1Rb5hzxfh3kwe9QXjPVRZ0 .io7e5wpz4cP6PV-pfcgB7>i{
    font-size:4.2rem;
    font-weight:100;
    height:3rem;
    line-height:3rem
}
.fZrQ-JOhcAqBseUp0k4BQ{
    background:url(https://cdn.lihkg.com/static/2105289671-86ixn/media/login-banner.png) 50% no-repeat;
    background-color:#dbdbdb;
    background-size:cover;
    border-bottom:1px solid rgba(128,128,128,.25);
    border-radius:4px 4px 0 0;
    height:144px;
    margin:-1rem 0 0 -1rem;
    width:calc(100% + 2rem)
}
[data-app-dm] .fZrQ-JOhcAqBseUp0k4BQ{
    background-color:#1d1d1d
}
@media(max-width:767px){
    .fZrQ-JOhcAqBseUp0k4BQ{
        margin:-1rem 0 0 -1rem;
        width:calc(100% + 2rem)
    }
}
.I5BdpSmReJquJjd1Y4AKs{
    align-items:center;
    display:flex;
    flex-direction:column;
    height:14rem;
    justify-content:flex-start;
    width:19rem
}
.VdIzUkVVdckQewTfEfpxo{
    flex:1 1;
    flex-basis:auto
}
.VdIzUkVVdckQewTfEfpxo input{
    width:97%
}
.VdIzUkVVdckQewTfEfpxo .keHNDx5YESfWA1bSODSxx{
    text-align:center
}
.VdIzUkVVdckQewTfEfpxo ._3LTxQEyMNwVI5DvjUW1VPt{
    display:flex;
    justify-content:space-between;
    width:97%
}
.VdIzUkVVdckQewTfEfpxo ._3LTxQEyMNwVI5DvjUW1VPt input{
    -webkit-appearance:none
}
.VdIzUkVVdckQewTfEfpxo ._3LTxQEyMNwVI5DvjUW1VPt input::-webkit-inner-spin-button,.VdIzUkVVdckQewTfEfpxo ._3LTxQEyMNwVI5DvjUW1VPt input::-webkit-outer-spin-button{
    -webkit-appearance:none;
    margin:0
}
.VdIzUkVVdckQewTfEfpxo ._3LTxQEyMNwVI5DvjUW1VPt input[type=number]{
    -moz-appearance:textfield
}
.VdIzUkVVdckQewTfEfpxo ._3LTxQEyMNwVI5DvjUW1VPt ._1byNyrattWhBR2ilqknTKv{
    font-size:1.5rem;
    height:3rem;
    margin:0;
    min-width:14%;
    text-align:center;
    width:14%
}
._1O_zro4frlyw2HXGJHVxLF{
    display:flex;
    justify-content:space-between;
    margin:1rem 0;
    width:100%
}
._1O_zro4frlyw2HXGJHVxLF a:hover{
    color:#666;
    cursor:pointer;
    text-decoration:none
}
[data-app-dm] ._1O_zro4frlyw2HXGJHVxLF a:hover{
    color:#fbc308
}
._1PHah_Mw_J9UhXHn698lT0,.MhD1YGecYBLwia2NEH-O4{
    color:#aaa;
    display:inline-block;
    font-size:.8rem;
    padding:0 .6rem
}
a._34cUtoG0T0YVrAhtYdrX-V{
    color:#aaa;
    cursor:default
}
a._34cUtoG0T0YVrAhtYdrX-V:hover{
    background:inherit
}
[data-app-dm] a._34cUtoG0T0YVrAhtYdrX-V{
    color:#888
}
[data-app-dm] a._34cUtoG0T0YVrAhtYdrX-V:hover{
    background:inherit
}
._3j8L6TtJuGio13H_PoXBy-{
    height:580px;
    max-width:520px;
    width:90vw
}
.yDdKNYj3TCV_cWXBpLYZy{
    flex-grow:1;
    overflow:hidden;
    width:400px
}
[data-app-mb] .yDdKNYj3TCV_cWXBpLYZy{
    width:100%
}
._3cnr_gYKomSaOFH65RE_hh{
    color:rgba(128,128,128,.5);
    font-size:1.2rem;
    padding:2rem 0;
    text-align:center
}
.Qi1D1nylKyvSuiiB7ck0w{
    min-height:100px;
    min-width:200px;
    position:relative
}
._2F-I9MMM6vCoLhJMcTwOZV{
    display:flex;
    justify-content:space-between
}
._2F-I9MMM6vCoLhJMcTwOZV a{
    border-radius:4px;
    color:inherit;
    padding:4px 6px;
    text-decoration:none;
    transition:background-color .1s ease-out
}
[data-app-dm] ._2F-I9MMM6vCoLhJMcTwOZV a{
    color:#fbc308
}
._2F-I9MMM6vCoLhJMcTwOZV a:hover{
    background:#e1e1e1
}
[data-app-dm] ._2F-I9MMM6vCoLhJMcTwOZV a:hover{
    background:#222
}
._21hMkW9qnRSpVJY1QlF_kV{
    list-style:none;
    margin:0;
    padding:0
}
._18_tUzwZfna4i5-VCnCpcJ{
    border-bottom:1px solid #e0e0e0;
    display:block;
    position:relative
}
[data-app-dm] ._18_tUzwZfna4i5-VCnCpcJ{
    border-bottom:1px solid #444
}
._18_tUzwZfna4i5-VCnCpcJ._14roExX-CJPUaMa-XgxEpH{
    color:#999
}
._18_tUzwZfna4i5-VCnCpcJ:first-child{
    border-top:1px solid #e0e0e0
}
[data-app-dm] ._18_tUzwZfna4i5-VCnCpcJ:first-child{
    border-top:1px solid #444
}
._18_tUzwZfna4i5-VCnCpcJ ._2N69pblSpcGR6UovEo-xiL,._18_tUzwZfna4i5-VCnCpcJ>a{
    background:#fff;
    color:inherit;
    cursor:pointer;
    display:flex;
    flex:1 1;
    justify-content:space-between;
    padding:.8rem 1rem;
    position:relative
}
._18_tUzwZfna4i5-VCnCpcJ ._2N69pblSpcGR6UovEo-xiL:hover,._18_tUzwZfna4i5-VCnCpcJ>a:hover{
    text-decoration:none
}
[data-app-ho] ._18_tUzwZfna4i5-VCnCpcJ ._2N69pblSpcGR6UovEo-xiL:hover,[data-app-ho] ._18_tUzwZfna4i5-VCnCpcJ>a:hover{
    background:#fafafa
}
[data-app-ho][data-app-dm] ._18_tUzwZfna4i5-VCnCpcJ ._2N69pblSpcGR6UovEo-xiL:hover,[data-app-ho][data-app-dm] ._18_tUzwZfna4i5-VCnCpcJ>a:hover{
    background:#3f3f3f
}
[data-app-dm] ._18_tUzwZfna4i5-VCnCpcJ ._2N69pblSpcGR6UovEo-xiL,[data-app-dm] ._18_tUzwZfna4i5-VCnCpcJ>a{
    background:#3b3a39
}
._18_tUzwZfna4i5-VCnCpcJ._1C_C5gP1gaee3wRt0KzvhR{
    color:#1d2129
}
[data-app-dm] ._18_tUzwZfna4i5-VCnCpcJ._1C_C5gP1gaee3wRt0KzvhR{
    color:#ccc6c0
}
._18_tUzwZfna4i5-VCnCpcJ._1C_C5gP1gaee3wRt0KzvhR:last-child{
    border-bottom:0
}
._18_tUzwZfna4i5-VCnCpcJ._1C_C5gP1gaee3wRt0KzvhR>a{
    background:#f3f3f3;
    border-left:5px solid #adadad
}
[data-app-dm] ._18_tUzwZfna4i5-VCnCpcJ._1C_C5gP1gaee3wRt0KzvhR>a{
    background:#2f2f2f;
    border-left-color:#1a1a1a
}
._2RbY3G_fRx8ihx2XkHJN8V{
    align-items:center;
    display:flex;
    overflow:hidden;
    width:100%
}
._1aORntxAPACIROGMDFJVQu{
    color:#000;
    font-size:1rem;
    margin-bottom:1px;
    margin-right:.25rem
}
[data-app-dm] ._1aORntxAPACIROGMDFJVQu{
    color:#fff
}
._14roExX-CJPUaMa-XgxEpH ._1aORntxAPACIROGMDFJVQu{
    color:#aaa
}
._1FzaZavwwtEn6BI4LPfaQ7{
    flex:1 1;
    overflow:hidden
}
._3QRcGTG5nGTIb3R-BdGBNn{
    color:#aaa;
    font-size:1.5em;
    margin-left:1rem
}
._2jw0EMRg46nEqPGxZ38ew6{
    display:block;
    font-size:18px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
}
._1rlZAFx8T4NzuuEGljbzNW{
    align-items:center;
    color:#999;
    display:flex;
    margin-bottom:.4rem
}
._3QnDBejsrp5gO9JYT9cqb2{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
}
.ANklOHC4mHEKsUDI-4xUh{
    color:inherit;
    padding:1em 0;
    text-align:center
}
[data-app-dm] .ANklOHC4mHEKsUDI-4xUh{
    border-color:#444443
}
._3MYkz6YKj8xzZ7tFq8BPzs{
    background:#f3f3f3;
    border:0;
    color:inherit;
    cursor:pointer;
    display:block;
    font-size:100%;
    margin:0;
    padding:1rem;
    text-align:center;
    width:100%
}
[data-app-dm] ._3MYkz6YKj8xzZ7tFq8BPzs{
    background:#292827;
    color:#fbc308
}
._3MYkz6YKj8xzZ7tFq8BPzs:hover{
    background:#fafafa
}
[data-app-dm] ._3MYkz6YKj8xzZ7tFq8BPzs:hover{
    background:#3e3e3e
}
.RXTWNZrfsdecZ1Q6APQJt{
    border-left:1px solid #bdc3c7;
    color:#999;
    font-size:.9rem;
    margin:0 0 .4rem;
    overflow:hidden;
    padding-bottom:.3rem;
    padding-left:.75rem;
    text-overflow:ellipsis;
    white-space:nowrap;
    width:100%
}
[data-app-dm] .RXTWNZrfsdecZ1Q6APQJt{
    border-left:1px solid #646462;
    color:#aca9a9
}
._33yDdi6ZY8sv7yEfVzWoXJ{
    display:inline-block;
    margin:0 .4em
}
._351Y6Jdf_Pq5xRt9VwnkjV{
    cursor:pointer;
    font-size:1.5rem;
    margin:-.8rem -1rem -.8rem 0;
    opacity:.5;
    padding:.8rem 1rem
}
._351Y6Jdf_Pq5xRt9VwnkjV:hover{
    opacity:1
}
@-webkit-keyframes _2_BEt0N3zK4FtRJh2E8DPd{
    0%{
        background-position:-468px 0
    }
    to{
        background-position:468px 0
    }
}
@keyframes _2_BEt0N3zK4FtRJh2E8DPd{
    0%{
        background-position:-468px 0
    }
    to{
        background-position:468px 0
    }
}
._2uPq1PSjy83CIzKeV_fVA6{
    background:#fff;
    border-top:1px solid #e0e0e0;
    padding:.8rem 1rem
}
[data-app-dm] ._2uPq1PSjy83CIzKeV_fVA6{
    background:#3b3a39;
    border-top:1px solid #444
}
.vtM5f6rzBDRQvjNZBvczM{
    -webkit-animation-duration:1s;
    animation-duration:1s;
    -webkit-animation-fill-mode:forwards;
    animation-fill-mode:forwards;
    -webkit-animation-iteration-count:infinite;
    animation-iteration-count:infinite;
    -webkit-animation-name:_2_BEt0N3zK4FtRJh2E8DPd;
    animation-name:_2_BEt0N3zK4FtRJh2E8DPd;
    -webkit-animation-timing-function:linear;
    animation-timing-function:linear;
    background:#f6f7f8;
    background:linear-gradient(90deg,#fafafa 0,#eee 50%,#fafafa);
    background-size:945px 104px;
    border-radius:3px;
    height:21px;
    position:relative
}
[data-app-dm] .vtM5f6rzBDRQvjNZBvczM{
    background:#1d1d1d;
    background:linear-gradient(90deg,#444 0,#555 50%,#444);
    background-size:945px 104px
}
.vtM5f6rzBDRQvjNZBvczM+.vtM5f6rzBDRQvjNZBvczM{
    margin-top:10px
}
.vtM5f6rzBDRQvjNZBvczM._1rlZAFx8T4NzuuEGljbzNW{
    height:15px;
    max-width:200px
}
.yUl0LO624itLQnNH5u_qP{
    display:flex;
    justify-content:space-between
}
.yUl0LO624itLQnNH5u_qP>a{
    color:inherit;
    text-decoration:none
}
[data-app-dm] .yUl0LO624itLQnNH5u_qP>a{
    color:#fbc308
}
.yUl0LO624itLQnNH5u_qP>a:hover{
    text-decoration:underline
}
._22EfxhYIziBQFmn9sVK_zw{
    padding-left:60px!important;
    text-align:left!important;
    width:50%
}
._22EfxhYIziBQFmn9sVK_zw:before{
    align-items:center;
    background:#e6e6e6;
    box-shadow:inset 0 -1px #aaa,inset -1px 0 #aaa;
    color:#000;
    content:attr(data-index);
    display:flex;
    font-weight:400;
    height:100%;
    justify-content:center;
    left:0;
    position:absolute;
    top:0;
    width:50px
}
._22EfxhYIziBQFmn9sVK_zw a{
    color:#00f;
    cursor:pointer;
    text-decoration:underline
}
._22EfxhYIziBQFmn9sVK_zw._4l8p1-0AbzQ3P5kYH1l7d a{
    color:purple
}
._3P_NzQJc0c2hYhKcUBuVtK a:after,.lnC_LBeTafhvBE0dx29HS a:after{
    border:0 solid transparent;
    border-width:0 10px 10px 0;
    content:"";
    height:0;
    position:absolute;
    right:0;
    top:0;
    width:0
}
._3P_NzQJc0c2hYhKcUBuVtK._3P_NzQJc0c2hYhKcUBuVtK a:after,.lnC_LBeTafhvBE0dx29HS._3P_NzQJc0c2hYhKcUBuVtK a:after{
    border-right-color:#fbc308
}
._3P_NzQJc0c2hYhKcUBuVtK.lnC_LBeTafhvBE0dx29HS a:after,.lnC_LBeTafhvBE0dx29HS.lnC_LBeTafhvBE0dx29HS a:after{
    border-right-color:red
}
._3P_NzQJc0c2hYhKcUBuVtK:focus a:after,.lnC_LBeTafhvBE0dx29HS:focus a:after{
    border-width:0 6px 6px 0;
    right:2px;
    top:2px
}
td._2Mlb2Y7rfOFbkmn2c1o12P{
    padding-right:30px
}
td._2Mlb2Y7rfOFbkmn2c1o12P ._14Bqlv7gpTwoaxXrKTGWMg{
    background:#e1e1e1;
    border:1px solid #bdbfc3;
    bottom:2px;
    position:absolute;
    right:1px;
    top:1px;
    width:20px
}
td._2Mlb2Y7rfOFbkmn2c1o12P ._361OW22LSkB2fgR1zVpWu8{
    border-color:#222 transparent transparent;
    border-style:solid;
    border-width:4px 4px 0;
    height:0;
    left:50%;
    position:absolute;
    top:50%;
    transform:translate(-50%,-50%);
    width:0
}
td._2Mlb2Y7rfOFbkmn2c1o12P:hover ._14Bqlv7gpTwoaxXrKTGWMg{
    border-color:#616769
}
._1OgZ_pFsM6P9kv0zVbrKzB{
    box-shadow:0 0 10px rgba(0,0,0,.5);
    list-style:none;
    z-index:100
}
._2jLfzoCuhq_8BLP8nrR9Lh{
    cursor:row-resize;
    margin:-.5rem .5rem -.5rem -.5rem;
    padding:.5rem
}
._2zlK71TSggqHPkKAln7xQK{
    color:#ccc;
    cursor:pointer;
    margin:-.5rem;
    padding:.5rem
}
._2zlK71TSggqHPkKAln7xQK._3xNRdHuhKhD5whtQkGHtk1{
    color:#fbc308
}
._3cELlUK8xPPleUCQRaYnyl{
    box-shadow:0 0 10px rgba(0,0,0,.5);
    list-style:none;
    z-index:100
}
._2m0C1bOZckahEtTuc5zMaL{
    cursor:row-resize;
    margin:-.5rem .5rem -.5rem -.5rem;
    padding:.5rem
}
.B78WXNDKRTJHgGk80HonA{
    bottom:calc(2rem + 50px);
    position:fixed;
    right:calc(50vw - 568px + 2rem);
    z-index:8
}
.B78WXNDKRTJHgGk80HonA._2HfqrmH29kEmTwnDkwX6xe .tCAGUZCZ27FkaFLvsakbR{
    opacity:1;
    transform:translateY(-45%)
}
.B78WXNDKRTJHgGk80HonA._2HfqrmH29kEmTwnDkwX6xe .gy6BfMus682a_iiOHGnRr{
    opacity:1;
    transform:translateY(45%)
}
.B78WXNDKRTJHgGk80HonA:hover:after{
    height:8rem
}
.B78WXNDKRTJHgGk80HonA:hover .gy6BfMus682a_iiOHGnRr .-GeIxbx7EdcJDrpe4LgDU,.B78WXNDKRTJHgGk80HonA:hover .tCAGUZCZ27FkaFLvsakbR .-GeIxbx7EdcJDrpe4LgDU{
    opacity:1
}
.B78WXNDKRTJHgGk80HonA:after{
    -webkit-backdrop-filter:saturate(180%) blur(5px);
    backdrop-filter:saturate(180%) blur(5px);
    background-color:rgba(59,58,57,.8);
    border-radius:1.8rem;
    content:"";
    height:3.6rem;
    left:50%;
    position:absolute;
    top:50%;
    transform:translate(-50%,-50%);
    transition:all .2s ease;
    width:3.6rem
}
[data-app-sm] .B78WXNDKRTJHgGk80HonA{
    right:2rem
}
[data-app-cx] .B78WXNDKRTJHgGk80HonA{
    right:calc(50vw - 640px + 2rem)
}
._3bB3QFPJD6udaIVawflVcF{
    -webkit-appearance:menulist-button;
    cursor:pointer;
    height:100%;
    left:0;
    opacity:0;
    position:absolute;
    top:0;
    width:100%
}
._2BqqxCbUsj-gGoV4jWcLvI{
    padding:0 1rem;
    position:relative;
    transition:all .1s ease-in-out;
    will-change:transform,opacity
}
.oHEjfwc7DnsDUcUvYn9be{
    z-index:2
}
.gy6BfMus682a_iiOHGnRr,.tCAGUZCZ27FkaFLvsakbR{
    margin-left:1rem;
    opacity:1;
    padding:0;
    position:absolute;
    width:4rem;
    z-index:1
}
.tCAGUZCZ27FkaFLvsakbR{
    padding-bottom:1.25rem;
    top:0
}
.gy6BfMus682a_iiOHGnRr{
    bottom:0;
    padding-top:1.25rem
}
[data-app-dm] .-GeIxbx7EdcJDrpe4LgDU:active,[data-app-dm] .-GeIxbx7EdcJDrpe4LgDU:hover{
    opacity:1
}
.-GeIxbx7EdcJDrpe4LgDU i{
    font-size:1.95rem
}
.-GeIxbx7EdcJDrpe4LgDU i:not(:hover){
    color:#bababa
}
[data-app-dm] .-GeIxbx7EdcJDrpe4LgDU i:hover{
    color:#fbc308
}
.oHEjfwc7DnsDUcUvYn9be .-GeIxbx7EdcJDrpe4LgDU,.gy6BfMus682a_iiOHGnRr .-GeIxbx7EdcJDrpe4LgDU,.tCAGUZCZ27FkaFLvsakbR .-GeIxbx7EdcJDrpe4LgDU{
    border-radius:50%;
    color:#fff;
    cursor:pointer;
    outline:0;
    padding:0;
    position:relative;
    text-align:center
}
.oHEjfwc7DnsDUcUvYn9be .-GeIxbx7EdcJDrpe4LgDU{
    font-size:1.3rem;
    height:4rem;
    line-height:4rem;
    width:4rem
}
.gy6BfMus682a_iiOHGnRr .-GeIxbx7EdcJDrpe4LgDU,.tCAGUZCZ27FkaFLvsakbR .-GeIxbx7EdcJDrpe4LgDU{
    height:4rem;
    line-height:4rem;
    opacity:0;
    width:4rem
}
._20X51LIggEHHtleO4Z9nbU{
    background:url(https://cdn.lihkg.com/static/2105289671-86ixn/media/clippy.png) 50% no-repeat;
    background-size:cover;
    bottom:2rem;
    cursor:help;
    height:82px;
    position:fixed;
    right:2rem;
    width:54px;
    z-index:9
}
._20X51LIggEHHtleO4Z9nbU ._1T4WCgWBgXmEqx5iXgLYuj{
    align-items:center;
    background:#ffffcd;
    border:1px solid #000;
    border-radius:6px;
    bottom:100%;
    cursor:default;
    display:flex;
    justify-content:space-between;
    padding:.5rem;
    position:absolute;
    right:100%;
    width:6rem
}
._20X51LIggEHHtleO4Z9nbU ._1T4WCgWBgXmEqx5iXgLYuj:after,._20X51LIggEHHtleO4Z9nbU ._1T4WCgWBgXmEqx5iXgLYuj:before{
    border-style:solid;
    content:"";
    height:0;
    position:absolute;
    top:100%;
    width:0
}
._20X51LIggEHHtleO4Z9nbU ._1T4WCgWBgXmEqx5iXgLYuj:before{
    border-color:transparent #ffffcd transparent transparent;
    border-width:0 10px 15px 0;
    right:calc(1rem + 1px);
    z-index:2
}
._20X51LIggEHHtleO4Z9nbU ._1T4WCgWBgXmEqx5iXgLYuj:after{
    border-color:transparent #000 transparent transparent;
    border-width:0 12px 17px 0;
    right:1rem;
    z-index:1
}
._20X51LIggEHHtleO4Z9nbU ._1T4WCgWBgXmEqx5iXgLYuj span{
    color:#000;
    cursor:pointer
}
._20X51LIggEHHtleO4Z9nbU ._1T4WCgWBgXmEqx5iXgLYuj span:hover{
    color:#00f
}
._20X51LIggEHHtleO4Z9nbU ._1T4WCgWBgXmEqx5iXgLYuj ._2aCn69IXU_uAzG-WWnsZnM{
    flex-grow:1;
    position:relative;
    text-align:center
}
@media(max-width:1280px){
    ._20X51LIggEHHtleO4Z9nbU,.B78WXNDKRTJHgGk80HonA{
        right:2.2em
    }
    [data-app-cx] .B78WXNDKRTJHgGk80HonA{
        right:2rem
    }
}
@media(max-width:767px){
    .B78WXNDKRTJHgGk80HonA{
        display:none
    }
    [data-app-sm] .B78WXNDKRTJHgGk80HonA{
        bottom:4.5rem;
        right:0;
        -webkit-user-select:none;
        -moz-user-select:none;
        -ms-user-select:none;
        user-select:none
    }
    button.-GeIxbx7EdcJDrpe4LgDU{
        line-height:38px
    }
    .-GeIxbx7EdcJDrpe4LgDU i{
        font-size:1.75rem
    }
}
@media(-ms-high-contrast:none),screen and (-ms-high-contrast:active){
    .B78WXNDKRTJHgGk80HonA:after{
        background-color:rgba(59,58,57,.9)
    }
}
@supports not ((-webkit-backdrop-filter:blur(5px)) or (backdrop-filter:blur(5px))){
    .B78WXNDKRTJHgGk80HonA:after{
        background-color:rgba(59,58,57,.9)
    }
}
._3SR4vL1tIjtIEneyciH07h{
    align-items:center;
    background:#f4f5f6;
    border-radius:4px;
    box-sizing:border-box;
    display:flex;
    flex-shrink:0;
    margin:.5rem 0 .5rem .5rem;
    position:relative;
    transition:all .2s ease
}
._3SR4vL1tIjtIEneyciH07h>i{
    cursor:pointer;
    font-size:1.4rem;
    height:2rem;
    line-height:2rem;
    position:absolute;
    right:.5rem;
    top:50%;
    transform:translateY(-50%)
}
[data-app-mb] ._3SR4vL1tIjtIEneyciH07h{
    margin:.8rem
}
[data-app-dm] ._3SR4vL1tIjtIEneyciH07h{
    background:#151515
}
._3SR4vL1tIjtIEneyciH07h input:focus{
    outline:none!important
}
.jpQxh054h1o7_hcTXz7Q1{
    border:0;
    flex:1 1;
    margin:0 0 0 .4rem;
    min-width:0
}
.jpQxh054h1o7_hcTXz7Q1,[data-app-dm] .jpQxh054h1o7_hcTXz7Q1{
    background:0 0
}
.jpQxh054h1o7_hcTXz7Q1:-ms-input-placeholder{
    font-size:.9rem
}
.jpQxh054h1o7_hcTXz7Q1::-moz-placeholder{
    font-size:.9rem
}
.jpQxh054h1o7_hcTXz7Q1::placeholder{
    font-size:.9rem
}
._2qyz9DkmymaM8uYJFYBI-c{
    align-items:center;
    align-self:stretch;
    background:#e0e0e0;
    border-radius:4px;
    cursor:pointer;
    display:flex;
    justify-content:center;
    margin:.4rem 0 .4rem .4rem;
    padding:.2rem .6rem;
    position:relative;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none
}
[data-app-dm] ._2qyz9DkmymaM8uYJFYBI-c{
    background:#333
}
[data-app-dm] ._2qyz9DkmymaM8uYJFYBI-c:hover{
    background:#333;
    color:#fbc308
}
[data-app-mb] ._2qyz9DkmymaM8uYJFYBI-c{
    margin:.5rem 0 .5rem .5rem
}
._2qyz9DkmymaM8uYJFYBI-c:hover{
    background:#dadada;
    cursor:pointer
}
._2qyz9DkmymaM8uYJFYBI-c ._19E3HAEjvhC4r9Jp76Btkx{
    font-size:.75rem
}
._2qyz9DkmymaM8uYJFYBI-c select{
    border:0;
    cursor:pointer;
    height:100%;
    left:0;
    opacity:0;
    position:absolute;
    top:0;
    width:100%
}
._3g7gf5c4jG-fP5MGKtR-ln{
    color:#aaa!important;
    cursor:default!important
}
._3g7gf5c4jG-fP5MGKtR-ln:hover{
    background:inherit
}
[data-app-dm] ._3g7gf5c4jG-fP5MGKtR-ln{
    color:#888!important
}
[data-app-dm] ._3g7gf5c4jG-fP5MGKtR-ln:hover{
    background:inherit
}
._3P-leClyYXuMZsqMgqrD6q{
    align-items:stretch;
    display:flex;
    flex-direction:column;
    width:100%
}
._3P-leClyYXuMZsqMgqrD6q .b0EA0M16aLPjsTMwV_pQ0{
    margin-bottom:.5rem;
    padding:0 .5rem
}
._3P-leClyYXuMZsqMgqrD6q .b0EA0M16aLPjsTMwV_pQ0 span{
    color:#e74c3c
}
._2eVyayS3z4X4gcNS8IrqoM{
    border-bottom:1px solid rgba(128,128,128,.25);
    color:inherit;
    display:block;
    font-size:1.15rem;
    padding:.9rem .6rem .9rem 1.7rem;
    position:relative;
    text-decoration:none;
    transition:background .1s ease;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    will-change:background
}
._2eVyayS3z4X4gcNS8IrqoM:hover{
    background:rgba(128,128,128,.15);
    text-decoration:none
}
[data-app-dm] ._2eVyayS3z4X4gcNS8IrqoM{
    border-bottom:1px solid #3b3a39
}
._2-nvBV_ymhtwgLIQYdXd1t{
    color:#333;
    flex:1 1;
    line-height:1.6rem;
    margin-bottom:5px;
    word-break:break-word
}
[data-app-dm] ._2-nvBV_ymhtwgLIQYdXd1t{
    color:#ccc6c0
}
._1nuh2kAJWl1Tau-0KqFenj{
    bottom:0;
    left:0;
    position:absolute;
    right:0;
    top:0;
    z-index:0
}
._1KjkLwdM1oLrCuofxwEWaP{
    border:1px solid #cf000f;
    border-radius:5px;
    color:#cf000f;
    font-size:.8rem;
    padding:3px 10px;
    position:relative;
    z-index:2
}
._1KjkLwdM1oLrCuofxwEWaP:hover{
    background:#cf000f;
    color:#fff;
    text-decoration:none
}
._3WoGlh7x52nyvlXUZ2qYQO{
    align-items:center;
    display:flex;
    flex-direction:column;
    justify-content:center;
    left:0;
    margin-left:.4rem;
    position:absolute;
    top:.8rem;
    width:1rem
}
._3WoGlh7x52nyvlXUZ2qYQO>._2CTClSOkytnceTczbERbIw{
    align-items:center;
    display:flex;
    height:1rem;
    margin:.4rem 0 .5rem
}
._14fPzZpaJpJBD3qR_dNoTv{
    bottom:2px;
    right:2px;
    top:2px;
    width:12px!important
}
._2UiCVWNDcb_sCs9PGlvg_9{
    background:#f6f6f6;
    border-right:1px solid rgba(128,128,128,.25);
    flex-basis:120px;
    height:calc(100vh - 3rem)
}
._2UiCVWNDcb_sCs9PGlvg_9:hover ._14fPzZpaJpJBD3qR_dNoTv{
    opacity:1!important
}
._2UiCVWNDcb_sCs9PGlvg_9 a{
    color:inherit;
    display:block;
    font-size:.9rem;
    opacity:.5;
    padding:.5em 0;
    text-align:center;
    transition:all .1s ease-in;
    will-change:background,opacity
}
._2UiCVWNDcb_sCs9PGlvg_9 a._13GueD__EU8nadqjaqY9Tw,._2UiCVWNDcb_sCs9PGlvg_9 a:hover{
    background:rgba(128,128,128,.2);
    opacity:1;
    text-decoration:none
}
[data-app-dm] ._2UiCVWNDcb_sCs9PGlvg_9{
    background:#151515
}
[data-app-dm] ._2UiCVWNDcb_sCs9PGlvg_9 a{
    color:#ccc6c0
}
[data-app-dm] ._2UiCVWNDcb_sCs9PGlvg_9 a._13GueD__EU8nadqjaqY9Tw,[data-app-dm] ._2UiCVWNDcb_sCs9PGlvg_9 a:hover{
    background:rgba(128,128,128,.15);
    color:#fbc308
}
._20SttOKdwwr7t6wCcIpA65{
    padding-bottom:1rem
}
._1Gin6wCDU5O1mJ0GxjCwns{
    background-clip:padding-box;
    background-color:rgba(128,128,128,.4);
    border:2px solid transparent;
    border-radius:8px;
    box-shadow:inset -1px -1px 0 rgba(0,0,0,.05),inset 1px 1px 0 rgba(0,0,0,.05)
}
 
 `
        );
    
    // Your code here...
})();
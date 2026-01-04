// ==UserScript==
// @name            Florr IO 手动切换服务器
// @name:zh         Florr IO 手动切换服务器
// @name:en         Florr IO Manual server switch
// @namespace       A florr.io userjs by Tinhone
// @description     不用再打开开发者工具了
// @description:zh  不用再打开开发者工具了
// @description:en  No need to open the dev tool again
// @version         0.2.1
// @author          Tinhone
// @license         GPL-3.0
// @match           *://*.florr.io/*
// @grant           unsafeWindow
// @grant           GM_addStyle
// @compatible      firefox V50+
// @compatible      edge V50+
// @compatible      chrome V50+
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB2lBMVEUAAADTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbSvEbTvUbSvUbTvUbSvEbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbTvUbSvEbTvUbSvEbUvkfWwEjYwUnVv0fex03p0lXy21r331754V/y2lrp0lTdx03UvkbgyU/y21v95WL/6GP/52P95WHgyU7XwUns1Vfs1VbXwUjZwkrYwkn03mLm0mH85WLm0mL03mHfyU7742HYzZHU0cLhz2z/6GLj0m7W08TUyY3742DVvkfp1WHe28r8/f/Yz5f85GD85F/Rx4/8/P/j4NDu2WX85WHTvUb/6mTNu1erqqX7/P7c1rT332D13l6Ykm/n6Oru7ejl02/o0lTSvEbAr1A0MzBoaGp+eFvz3F/03WBUTzJPT1FvbmvHtlfx2lrOu1UsKyQaGx1eWDL54mFgWTQbHB4qKCLNu1T2313q1V1GQy0bHCCMgUH/6WSjlUhcVjPbx1j75WL03mDo0VT+6WT65GL+5mPdxk21pEaqmkL03V/75GLCsEuQgjj34GDjzliEeDNuYyuGeTSLfjZ2ay5zaC3Pu1D/6GT85mPgy1fDsUy+rErSvlL34WDr1Fb////IkFdGAAAAH3RSTlMAAAEHDAo0api0wQ9buO7+/j35BmjnefVpPua37Zf+dLW/BwAAAAFiS0dEnQa78rEAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfkAQgDJRPX3t0LAAACLUlEQVQ4y4VTB3cSQRC+pYYWDSkkgeQOkuMOCLdrLmAUxULU2Mt59t4LllhIuVQ1lth7y491mV1CAH3Oe/fm7cx3U78RhFWCbHaHw25Dwt8EIafL3eTxej1NbpcToQa3zx9oXiNK0agkrm0O+H21EGRrCQRjff1yXFHiaiIZCwZaVmdCrW3tqYG0hjGhgvE6eTDV3taKqv6OkD6kgZcJ1jLZUEcFgVBnaH2a1Ik8HOpkdSDU1a2ncT0Ay9nuLkAgXzg1xGwcxXUmFfahcgB/cEAD+4aNubLObdoMiFw+6KchkDMcYwm2bN22vUBIYWTHzl3wgzoadlKAK9LHAuzes3fffkIOHDx0+Aj8YSQjLgpwH+2Hp3ns+ImTpwg5febsufMFqOLCRTcF9IgyA1y6fOXqNYyv37h567YJMYtiDxLsHikOcPPO3Xv3xwgZe/Dw0WMGKEkeu+DwRhXW3PjE5JRFiDU1OTHOGlV0r6MKIGR6ZrYMmJ2Z5gYArKQgZG6e6fk5PjBIQYtUK3PGNYoXSdtMNCyCywK06YokDW7QnpSh1tNn7GkswqDoqNkgiPX8xUvLfLX0+k0lA4yaLmtQY5a3795/+Pjp8xcegC0L1p1hpq/fvv/4+eu3xV7LbN1AmCxPQizT5G6iSpwwQLlhub4DdYVyjLTZTA1pjWWpSlpO+7xqANnoZxTzNbTnhzOaTBRLilIqLiyKdYdTOb1eUdJ1SextPL3/H++/z/8P7nmbVKvpGgUAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMTItMzFUMjA6MDg6NTMtMDg6MDCgb7H/AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIwLTAxLTA4VDExOjM3OjE5LTA4OjAwqEgKbQAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/459927/Florr%20IO%20%E6%89%8B%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9C%8D%E5%8A%A1%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/459927/Florr%20IO%20%E6%89%8B%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9C%8D%E5%8A%A1%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict'
    let cp6=unsafeWindow.cp6
    let onkeydownFunction=window.onkeydown?window.onkeydown:function(e){}
    function customServer(){
        let name=prompt("请输入需要切换的服务器名称 Please enter the server name to switch")
        if(name){cp6.forceServerID(name)}
    }
    window.onkeydown=(e)=>{
        onkeydownFunction(e) //当 window.onkeydown 已有其他代码需要执行时，先让其他代码执行
        switch(e.key){
            case "?": //ctrl+shift+/
                if(e.ctrlKey){customServer()}
                return
            default:
                return
        }
        e.preventDefault()
    }
})()
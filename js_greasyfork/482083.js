// ==UserScript==
// @name         PT Website Anti-touch
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  add confirm before submitting some important action in PT website
// @author       lorentz
// @license      GPL-3.0 License

// @match        *://byr.pt/*
// @match        *://zmpt.cc/*
// @match        *://ultrahd.net/*
// @match        *://kp.m-team.cc/*
// @match        *://xp.m-team.io/*
// @match        *://1ptba.com/*
// @match        *://pt.btschool.club/*
// @match        *://pt.0ff.cc/*
// @match        *://*.hdfans.org/*
// @match        *://hdmayi.com/*
// @match        *://*.hdtime.org/*
// @match        *://hdvideo.one/*
// @match        *://pt.soulvoice.club/*
// @match        *://ubits.club/*
// @match        *://ptchina.org/*
// @match        *://hdatmos.club/*
// @match        *://gainbound.net/*
// @match        *://1ptba.com/*
// @match        *://xingtan.one/*
// @match        *://*.hddolby.com/*
// @match        *://*.tjupt.org/*
// @match        *://club.hares.top/*
// @match        *://dajiao.cyou/*
// @match        *://hdzone.me/*
// @match        *://hdfun.me/*
// @match        *://srvfi.top/*
// @match        *://carpt.net/*
// @match        *://www.okpt.net/*
// @match        *://www.icc2022.com/*
// @match        *://www.beitai.pt/*
// @match        *://leaves.red/*
// @match        *://uploads.ltd/*
// @match        *://pt.upxin.net/*
// @match        *://pandapt.net/*
// @match        *://www.joyhd.net/*
// @match        *://kufei.org/*
// @match        *://*.pthome.net/*
// @match        *://shadowflow.org/*
// @match        *://star-space.net/*
// @match        *://discfan.net/*
// @match        *://pt.2xfree.org/*
// @match        *://52pt.site/*
// @match        *://www.hdarea.co/*
// @match        *://*.gamegamept.com/*
// @match        *://rousi.zip/*
// @match        *://*.haidan.video/*
// @match        *://www.htpt.cc/*
// @match        *://pt.itzmx.com/*
// @match        *://kamept.com/*
// @match        *://azusa.wiki/*
// @match        *://wukongwendao.top/*
// @match        *://piggo.me/*
// @match        *://share.ilolicon.com/*
// @match        *://*.oshen.win/*
// @match        *://pterclub.com/*
// @match        *://*.nicept.net/*
// @match        *://wintersakura.net/*
// @match        *://www.ptlsp.com/*
// @match        *://gamerapt.link/*
// @match        *://et8.org/*
// @match        *://ptcafe.club/*
// @match        *://hhanclub.top/*
// @match        *://pt.eastgame.org/*

// @match        *://u2.dmhy.org/*
// @match        *://www.pttime.org/*

// @match        *://hdcity.city/*

// @match        *://totheglory.im/*
// @match        *://ourbits.club/*
// @match        *://hdhome.org/*
// @match        *://hdsky.me/*
// @match        *://hdchina.org/*
// @match        *://audiences.me/*
// @match        *://ptchdbits.co/*
// @match        *://www.open.cd/*

// @match        *://pt.hd4fans.org/*
// @match        *://dicmusic.com/*
// @match        *://greatposterwall.com/*

// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/482083/PT%20Website%20Anti-touch.user.js
// @updateURL https://update.greasyfork.org/scripts/482083/PT%20Website%20Anti-touch.meta.js
// ==/UserScript==

function confirmBeforeLogout() {
    let a = document.querySelector('a[href*="logout.php"]')
    console.log(a)
    if (a) {
        a.href = 'javascript:if(confirm("是否退出登录？")){window.location.href="' + a.getAttribute('href') + '"};'
    }
}
function confirmBeforeSubmit() {
    let buttons = document.querySelectorAll('input[type="submit"]')
    buttons.forEach(button => {
        button.onclick = function (event) {
            const bonus = this.parentNode?.previousElementSibling?.innerText || '?'
            const info = this.parentNode?.previousElementSibling?.previousElementSibling?.firstElementChild?.innerText || '?'
            if (!confirm("你正在点击提交按钮，将花费：【" + bonus + "】，执行或兑换：【" + info + "】！是否提交？")) {
                return false
            }
            return true
        }
    })
    console.log(buttons)
}

(function() {
    confirmBeforeLogout()
    if (location.pathname.indexOf('mybonus') != -1) {
        confirmBeforeSubmit()
    }
})();

/* eslint-disable */
// ==UserScript==
// @name         sex8(杏吧自动签到)
// @namespace    https://sex8.cc
// @version      1.5
// @author       popsee
// @description  sex8 sign every day when you open your browser, script will auto run.
// @icon         https://www.cmmoon.com/favicon.ico
// @include      *://*
// @mail         popcat@foxmail.com
// @copyright    Tri-body
// @run-at       document-idle
// @license      GPL-3.0
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      *
// @compatible   chrome firefox opera safari edge
// @note         include*为打开任意网址，都执行，connect*为适配自动选用合适的域名地址进行签到
// @note         resetStatus=0，为默认开启签到服务，resetStatus=1为重置并关闭服务，
// @note         1.0脚本立项开始构建签到程序和相关功能子模块
// @note         1.1增加reset重置功能，方便调试，放到前台签到，避免后天失败，增加签到后自动关闭功能。
// @note         1.2修复某些情况下，签到后不关闭页面的情况。
// @note         1.3替换油猴打开页面为open打开，避免签到后不关闭页面的情况。
// @note         1.4修复打开新窗口时关闭原来的跳转页面。
// @note         1.5增加地址页查询，自动选用合适的域名
// @note         Chrome，Edge,Firefox等浏览器首次使用时需要点击一下总是允许此弹窗设置，并总是允许连接到所有网站(因为绅士网站可直连地址总动态变动)
// @note         首次使用请把代码中的UserName改为自己的用户名，把UserPass改成自己的用户密码即可
// @note         若想实现RDP远程桌面服务器每日定时自动化签到该网站，请配合使用win系统附带的任务计划程序，定时启动浏览器打开一个固定网站，并允许该网站跳转即可。
// @note         为了保证签到成功率，默认采用为前台标签页打开页面自动签到，结束后自动关闭，请自行打开签到网页进行查看是否执行成功。
// @note         由于签到会打开该绅士网站，为了不必要的影响，请不要在公共场所、工作场所等人多眼杂的地方使用，毕竟人设崩塌很难重建，当然人渣可以忽略这句话。
// @downloadURL https://update.greasyfork.org/scripts/466040/sex8%28%E6%9D%8F%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/466040/sex8%28%E6%9D%8F%E5%90%A7%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%29.meta.js
// ==/UserScript==
/* eslint-enable */

(function () {
    const UserName = '此处填账号';//eg:popcat
    const UserPass = '此处填密码';//eg:cat123456789
    // ==========================
    const resetStatus = 0;
    const addrPage = 'http://172.104.98.166/index.html';//http://174.138.30.238/byms.html
    var forumUrl = '';
    let dateStr = new Date().toLocaleDateString();
    console.debug('SbarStatus===>' + GM_getValue(dateStr, false));
    // console.info(new Date().getTime());
    judgeCurrentPage();
    function judgeCurrentPage() {
        if (resetStatus == 1) {
            GM_deleteValue(dateStr);
            console.debug('Renew SbarStatus===>' + GM_getValue(dateStr, false));
        } else if (GM_getValue(dateStr) != 'true') {//make sure perform script once every redirect
            // getLatestAddr();
            // function getLatestAddr() {
            // console.debug(GM_getValue(dateStr));
            GM_xmlhttpRequest({
                method: "GET",
                headers: {
                    "Cache-Control": "max-age=0",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36"
                },
                url: addrPage,
                onload: function (response) {
                    if (response.responseText != null) {
                        var resHtml = new DOMParser().parseFromString(response.responseText, "text/html");
                        forumUrl = resHtml.getElementById('adress1').innerText;
                        forumUrl = forumUrl.replace("https://", "").trim();
                        if (document.URL == 'https://' + forumUrl + '/forum.html') {
                            // console.debug(forumUrl);
                            loadLoginPage(0);
                        } else {
                            if (new Date().getTime() - Number(GM_getValue('beforeTime', 0)) > 20 * 1000) {//首次打开，防自己无限循环多开
                                GM_setValue('beforeTime', new Date().getTime().toString());
                                // console.debug('SbarStatus=============>jump');
                                // GM_openInTab(forumUrl);//后台打开
                                // GM_openInTab(forumUrl, { active: true });//前台打开
                                window.open('https://' + forumUrl + '/forum.html');//只open打开页面，才能window.close()关闭页面;
                            }
                        }                        
                        setInterval(() => {
                            if (Math.floor(performance.now()) >= 40 * 1000 && document.domain == forumUrl) {//避免关闭跳转页面，但也会误杀手工打开的页面，建议访问其他主站域名
                                closeTabPage();
                            }
                        }, 2000);
                    }
                },
                onerror: function (err) {
                    console.error(err);
                    closeTabPage();
                }
            });
            // }            
        }
    }

    function loadLoginPage(count) {
        if (document.getElementById('myprompt_check') != null) {//已登录
            loadSignModal(0);
        } else if (document.getElementById('ls_username') != null) {//未登录
            document.getElementById('ls_username').value = UserName;
            document.getElementById('ls_password').value = UserPass;
            document.getElementsByClassName('pn vm')[0].click();//登陆后自动刷新页面，这里不用跳转
        } else {//加载未完成，等待15s尝试登陆
            if (count < 15) {
                setTimeout(() => { loadLoginPage(++count) }, 1000);
            } else {
                closeTabPage();
            }
        }
    }
    function loadSignModal(num) {
        if (document.getElementById('myModal_index') != null) {
            // document.getElementById('myModal_index').style.display = 'none';
            setCookie('A8tI_2132_lt_ad_1', '1');
            document.getElementById('qd-sign').click();
            setTimeout(() => { checkInSbar(0) }, 800);
        } else {
            if (num < 15) {
                setTimeout(() => { loadSignModal(++num) }, 1000);
            } else {
                closeTabPage();
            }
        }
    }
    function checkInSbar(mount) {
        if (document.getElementsByClassName('qd-signin')[0] != undefined && document.getElementsByClassName('qd-signin')[0].innerText == '立即签到') {//未签到
            document.getElementsByClassName('qd-signin')[0].click();//点击签到
            GM_setValue(dateStr, 'true');
            closeTabPage();
        } else if (document.getElementsByClassName('qd-signin')[0].innerText == '今日已签') {//已经签到过
            GM_setValue(dateStr, 'true');
            closeTabPage();
        } else {
            if (mount < 15) {
                setTimeout(() => { checkInSbar(++mount) }, 1000);
            } else {
                closeTabPage();
            }
        }
    }
    function setCookie(name, value) {//remove ad modal
        var exp = new Date();
        exp.setTime(exp.getTime() + 365 * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + "; path=/; expires=" + exp.toGMTString();
    }
    function closeTabPage() {//close chrome 直接关闭非open打开的页面已经失效
        // location.href = 'https://www.limestart.cn';
        window.opener = null;
        window.open('', '_self');
        window.close();
    }
})();
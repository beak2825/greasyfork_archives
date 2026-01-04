// ==UserScript==
// @name         PT万能签到
// @namespace    shareit,smilenet
// @version      1.2.1
// @description  支持99.99%PT站点签到
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAgCAYAAACYTcH3AAAAAXNSR0IArs4c6QAAAbxJREFUWEftlz1IQlEUx/9Xn4hBRGNNBdXQh0a1RIsRfdDmUCQ0CAUt0ahCi0sNrrUEDm4NDQ8iomiwIWjRIKmlpaYc4xVU0vPduI8EET/O1ScOvTs+/uec3/ufc97lMRCPqhspgD8FFOcWMQSqXjgC2FBAccxSYhhFJDSqbnAA19TEfzEpAP6A4iDVIYn+L4w3oq05GHY4x3S1tsX2OvHyXEAy8UntLEKbHejrdyK2+1ErJsO5cZaNd8eYL6xtg+GgXoUWwpilGeOrzBfR0gAm2w3DOc8KGLEldY+wPPdawOV5vq62KFhcdqOn10luLRmGTNCE0IapZp7tjO3MxJQLd+kf8n61bGZWgh6MjCo4Vb/JQC2BKYI8Pug4Of5qnzONgpj3E/U6EJbPL7lxdZGHeONKpxkQKZiBQQXrIY/JIKwvB2oWRApGiIU7omg5kBUg0jCVgIbHXCak7LBWajN5ZkqDSx0Sz60AaciZIpQAmltwI5czpNa31p435Az5wyEptGHsW1tyZMB8Ue0GHDOygVbrGcMt84bfNxjjCauTy+bjQND88R+PvvkBx36t31vZ5BL6DDiS9/Guw1/5Ifek+Vvu+AAAAABJRU5ErkJggg==
// @author       shareit

// @match      https://ptfans.cc/*
// @match      https://www.hddolby.com/*
// @include    https://www.hddolby.com/*
// @match      https://t.tosky.club/*
// @include    https://crabpt.vip/*
// @include    https://qingwapt.com/*
// @match      https://qingwapt.com/*
// @match      https://www.yemapt.org/#/consumer/checkIn
// @match      https://www.yemapt.org/#/consumer/*
// @include    https://www.qingwapt.com/*
// @match      https://www.qingwapt.com/*
// @include    https://new.qingwa.pro/*
// @include    https://www.okpt.net/*
// @include    https://dajiao.cyou/*
// @include    https://www.woyushu.com/*
// @include    https://ultrahd.net/*
// @include    http://pt.tu88.men/*
// @include    https://srvfi.top/*
// @include    https://ptvicomo.net/*
// @include    https://www.ptlsp.com/*
// @include    https://pt.gtk.pw/*
// @include    https://share.ilolicon.com/*
// @include    https://hdvbits.com/*
// @include    https://pt.hdupt.com/*
// @include    https://pt.upxin.net/*
// @include    https://www.hdkyl.in/*
// @include    https://pt.hd4fans.org/*
// @include    https://discfan.net/*
// @include    https://www.agsvpt.com/*
// @include    https://azusa.wiki/*
// @include    https://star-space.net/*
// @include    https://ptsbao.club/*
// @include    https://hdpt.xyz/*
// @include    https://kufei.org/*
// @include    https://ptcafe.club/*
// @include    https://public.ecustpt.eu.org/*
// @include    https://pt.ecust.pp.ua/*
// @include    https://www.3wmg.com/*
// @include    https://oldtoons.world/*
// @include    https://xingtan.one/*
// @include    https://leaves.red/*
// @include    http://hdmayi.com/*
// @include    http://ihdbits.me/*
// @include    https://zhuque.in/*
// @include    https://1ptba.com/*
// @include    https://audiences.me/*
// @include    https://byr.pt/*
// @include    https://ccfbits.org/*
// @include    https://club.hares.top/*
// @include    https://cyanbug.net/*
// @include    https://discfan.net/*
// @include    https://et8.org/*
// @include    https://filelist.io/*
// @include    https://hdatmos.club/*
// @include    https://hdchina.org/*
// @include    https://hdcity.leniter.org/*
// @include    https://hdcity.city/*
// @include    https://hdfans.org/*
// @include    https://hdhome.org/*
// @include    https://hdmayi.com/*
// @include    https://hdsky.me/*
// @include    https://hdtime.org/*
// @include    https://hdvideo.one/*
// @include    https://hhanclub.top/*
// @include    https://hudbt.hust.edu.cn/*
// @include    https://iptorre*
// @include    https://kp.m-team.cc/*
// @include    https://lemonhd.org/*
// @include    https://nanyangpt.com/*
// @include    https://npupt.com/*
// @include    https://ourbits.club/*
// @include    https://piggo.me/*
// @include    https://pt.btschool.club/*
// @include    https://pt.eastgame.org/*
// @include    https://pt.hdbd.us/*
// @include    https://pt.keepfrds.com/*
// @include    https://ptchina.org/*
// @include    https://pterclub.com/*
// @include    https://pthome.net/*
// @include    https://totheglory.im/*
// @include    https://u2.dmhy.org/*
// @include    https://www.beitai.pt/*
// @include    https://www.carpet.net/*
// @include    https://www.haidan.video/*
// @include    https://www.hd.ai/*
// @include    https://www.hdarea.co/*
// @include    https://hdarea.club/*
// @include    https://www.hddolby.com/*
// @include    https://www.hdpt.xyz/*
// @include    https://www.htpt.cc/*
// @include    https://www.icc2022.com/*
// @include    https://www.nicept.net/*
// @include    https://www.oshen.win/*
// @include    https://www.pthome.net/*
// @include    https://www.tjupt.org/*
// @include    https://www.torrent*
// @include    https://zmpt.cc/*
// @include    https://carpt.net/*
// @include    https://wintersakura.net/*
// @include    https://sharkpt.net/*
// @include    https://gainbound.net/*
// @include    https://hdvideo.one/*
// @include    https://pt.2xfree.org/*
// @include    http://www.oshen.win/*
// @include    http://uploads.ltd/*
// @include    https://ubits.club/*
// @include    http://hdzone.me/*
// @include    https://pt.soulvoice.club/*
// @include    https://www.gamegamept.com/*
// @include    https://pt.itzmx.com/*
// @include    https://pt.0ff.cc/*
// @include    https://carpt.net/*
// @include    https://www.pttime.org/*
// @include    https://rousi.zip/*
// @include    https://pandapt.net/*
// @include    https://invites.fun/*
// @include    https://wukongwendao.top/*
// @include    https://hdfun.me/*
// @include    https://pt.cdfile.org/*
// @include    https://bitporn.eu/*
// @include https://kamept.com/*


// @grant        none
// @compatible   Chrome
// @compatible   Firefox
// @compatible   Edge
// @compatible   Safari
// @compatible   Opera
// @compatible   UC
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461176/PT%E4%B8%87%E8%83%BD%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/461176/PT%E4%B8%87%E8%83%BD%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

//// @include    https://springsunday.net/*
(function() {
    function xpath(query) {
        //console.log("document.evaluate(\""+query+"\", document, null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);");
        return document.evaluate(query, document, null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    }

    var host = window.location.host;
    var href = window.location.href;
    function formatDate(date) {
        const yyyy = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始
        const dd = String(date.getDate()).padStart(2, '0');

        return `${yyyy}-${MM}-${dd}`;
    }

    // 获取今天的日期，格式为 YYYY-MM-DD
    const today = formatDate(new Date());

    // 创建自定义提示框的方法
    function showAlert(message, duration, callback) {
        // 创建提示框元素
        const alertBox = document.createElement('div');
        alertBox.innerText = message;
        alertBox.style.fontSize = '16px';

        // 添加样式
        Object.assign(alertBox.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)', // 将元素移动到中心
            padding: '20px 30px',
            backgroundColor: '#DF4E0E',
            color: '#fff',
            borderRadius: '5px',
            zIndex: '10000',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
            transition: 'opacity 0.5s ease',
            textAlign: 'center' // 文本居中
        });

        // 将提示框添加到页面
        document.body.appendChild(alertBox);

        // 在指定时间后让提示框消失
        setTimeout(() => {
            alertBox.style.opacity = '0'; // 设置透明度为0，以便于淡出效果
            //setTimeout(() => {
            document.body.removeChild(alertBox); // 从DOM中移除提示框

            // 执行回调函数（如果提供）
            if (typeof callback === 'function') {
                callback();
            }
            //}, 500); // 等待过渡效果完成后再移除
        }, duration);
    }


    setTimeout(function() {

        var attendanceTexts = [
            "签到得魔力",
            "签 到",
            "签到得猫粮",
            "签到",
            "每日签到",
            "簽到得魔力",
            "每日打卡",
            "签到领魔力",
            "签到得莉莉",
            "Check in",
            "[Sign in]",
            "签到得鲸币",
            "签到得",
            "Attend get bonus",
            "[Attend get bonus]",
            "attend get bouns",
            "Attend get bouns",
        ];

        function signIn() {

            for (var index in attendanceTexts) {
                var text = attendanceTexts[index];
                var allElements = xpath("//*[contains(text(), '" + text + "')]");
                for (var i = 0; i < allElements.snapshotLength; i++) {
                    var ptSignElements = allElements.snapshotItem(i);
                    if (ptSignElements != null) {
                        console.log(ptSignElements.innerText);
                        if (ptSignElements.innerText.indexOf(text) != -1) {
                            try {
                                showAlert(window.location.host + "疑似未签到，签到中...", 1.5 * 1000, () => {
                                    console.log(ptSignElements);
                                    localStorage.setItem('signInDate', today)
                                    localStorage.setItem('originalUrl',window.location.href)
                                    ptSignElements.click();
                                    console.log("签到:" + window.location.host);

                                })

                            } catch (error) {
                                // do nothing
                                console.log(error);
                            }
                        }
                        return;
                    }
                }
            }
        }


        // 从 localStorage 获取签到状态
        const signInDate = localStorage.getItem('signInDate');

        if (signInDate !== today) {
            // 如果今天未签到，执行签到逻辑

            // 这里替换为你的签到代码，比如发送请求或点击按钮
            console.log("今天未签到，执行签到操作...");

            const regex = /签到.*(\d+).*天/;
            for (var index in attendanceTexts) {
                var text = attendanceTexts[index];
                var allElements = xpath("//*[contains(text(), '" + text + "')]");
                for (var i = 0; i < allElements.snapshotLength; i++) {
                    var ptSignElements = allElements.snapshotItem(i);
                    if (ptSignElements != null) {
                        console.log(ptSignElements.innerText);
                        if (ptSignElements.innerText.indexOf(text) != -1) {
                            if (ptSignElements.innerText.indexOf("已") != -1 ||
                                ptSignElements.innerText.indexOf("总") != -1 ||
                                ptSignElements.innerText.match(regex) ||
                                ptSignElements.innerText.indexOf("Attend got") != -1 ||
                                ptSignElements.innerText.indexOf("got today") != -1 ||
                                ptSignElements.innerText.indexOf("got today") != -1 ||
                                ptSignElements.innerText.indexOf("already attended") != -1

                            ) {
                                console.log("已签到:" + window.location.host)
                                localStorage.setItem('signInDate', today)
                                showAlert(window.location.host + "今日签到完成...", 2 * 1000, () => {
                                    const referrerUrl = document.referrer;

                                    // 检查是否有有效的上一页 URL
                                    if (referrerUrl) {
                                        // 跳转到上一页
                                        console.log("返回："+referrerUrl);
                                        window.location.href = referrerUrl;
                                    }

                                })
                                return;
                            }
                        }
                    }
                }
            }

            signIn();
        } else {
            // 今天已签到，跳过
            console.log("今天已签到，跳过签到操作。");
            const originalUrl =  localStorage.getItem('originalUrl');
            if(originalUrl && originalUrl != window.location.href){
                console.log("返回："+originalUrl);
                localStorage.removeItem('originalUrl')
                window.location.href = originalUrl;
            }
        }


    }, 500);



})();
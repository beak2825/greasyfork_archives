// ==UserScript==
// @name         视频倍速工具
// @namespace    http://tampermonkey.net/
// @version      0.3.12
// @description  除youtube以外按c加速，按x减速，按z复位，youtube按v加速。点击右上角油猴按钮可开关视频速度记忆功能。
// @author       call duck
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458526/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/458526/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

// 使用方法：除youtube以外按c加速，按x减速，按z复位，youtube按v加速。


var aab = 111;

(function () {
    "use strict";

    if (window.innerWidth < 100) {
        return;
    }



    const REMEMBER_KEY = `${location.hostname}_da4e1a5f0c5b46cdadadf70af3c19f37`;
    let isRememberSpeed = GM_getValue(REMEMBER_KEY, false);

    const SPEED_KEY = "2779054e81654c2990dd9d2bfe9202aa";
    const originSpeed = localStorage.getItem(SPEED_KEY);
    let speed;
    if (!originSpeed) {
        speed = 1;
        localStorage.setItem(SPEED_KEY, '1');
    } else if (isRememberSpeed) {
        speed = parseFloat(originSpeed);
    } else {
        speed = 1;
    }
    speed = parseFloat(speed.toFixed(2));
    let videos = getVideos()
    const step = 0.05;

    let rememberMenuId;




    function addMenus() {
        if (!isRememberSpeed) {
            addOpenRememberMenu();
        } else {
            addCloseRememberMenu();
        }

        GM_addValueChangeListener(
            REMEMBER_KEY,
            function name(key, oldValue, newValue) {
                GM_unregisterMenuCommand(rememberMenuId);
                if (newValue === true) {
                    addCloseRememberMenu();
                } else {
                    addOpenRememberMenu();
                }
            }
        );
    }
    addMenus();

    const blackSites = GM_getValue("blackSites", "").split(',')
    const site = window.location.hostname
    let blackSiteMenuId

    async function addBlackSiteMenu() {
        if (blackSiteMenuId) GM_unregisterMenuCommand(blackSiteMenuId);
        blackSiteMenuId = await GM.registerMenuCommand("添加当前网站到黑名单", async () => {
            if (blackSites.indexOf(site) === -1) {
                blackSites.push(site)
                GM_setValue("blackSites", blackSites.join(','))
                notify("当前网站已添加到黑名单");
                addRemoveBlackSiteMenu()
            }
        });
    }

    async function addRemoveBlackSiteMenu() {
        if (blackSiteMenuId) GM_unregisterMenuCommand(blackSiteMenuId);
        blackSiteMenuId = await GM.registerMenuCommand("当前网站从黑名单中移除", async () => {
            if (blackSites.indexOf(site) !== -1) {
                blackSites.splice(blackSites.indexOf(site), 1)
                GM_setValue("blackSites", blackSites.join(','))
                notify("当前网站已从黑名单中移除");
                addBlackSiteMenu()

            }
        });
    }

    if (blackSites.indexOf(site) !== -1) {
        addRemoveBlackSiteMenu()
        return
    } else {
        addBlackSiteMenu()
    }

    async function addOpenRememberMenu() {
        if (rememberMenuId) GM_unregisterMenuCommand(rememberMenuId);
        rememberMenuId = await GM.registerMenuCommand("打开视频速度记忆功能", async () => {
            GM_setValue(REMEMBER_KEY, true);
            videos.forEach((v) => {
                notify("视频播放速度记忆功能已打开", v);
            });
        });
    }

    async function addCloseRememberMenu() {
        if (rememberMenuId) GM_unregisterMenuCommand(rememberMenuId);
        rememberMenuId = await GM.registerMenuCommand("关闭视频速度记忆功能", async () => {
            GM_setValue(REMEMBER_KEY, false);

            videos.forEach((v) => {
                notify("视频播放速度记忆功能已关闭", v);
            });
        });
    }


    function getVideos() {
        let videoElements = Array.prototype.slice.call(
            document.getElementsByTagName("video")
        );
        const audioElements = Array.prototype.slice.call(
            document.getElementsByTagName('audio')
        )
        videoElements = videoElements.concat(audioElements)

        if (window.location.hostname === "www.bilibili.com") {
            const bPlayerCollection = document.getElementsByTagName("bwp-video");
            if (bPlayerCollection.length > 0) {
                videoElements.push(bPlayerCollection[0]);
            }
        }

        if (
            location.hostname === "www.reddit.com" &&
            window.location.pathname.match(/\/r\/\S+\/comments\/.+/)
        ) {
            const player = document.getElementsByTagName("shreddit-player");
            if (player.length > 0) {
                const v = player[0].shadowRoot.querySelector("video");
                videoElements.push(v);
            }
        }

        /*     if (location.hostname === "www.youtube.com") {
          if (v && v.className.indexOf("video-stream") === -1) {
            notify('视频正在初始化，请稍候')
            return null
          }
        } */
        console.log(videoElements)
        return videoElements;
    }

    new Promise((res) => {
        if (videos.length === 0) {
            let count = 0;
            const maxCount = 3;
            function _getVideo() {
                setTimeout(() => {
                    videos = getVideos();
                    count++;
                    if (videos.length === 0 && count < maxCount) {
                        _getVideo();
                    } else {
                        res(videos);
                    }
                }, 1000);
            }
            _getVideo();
        } else {
            res(videos);
        }
    }).then((v) => {
        videos = v;
        syncSpeedToVideo();
    });



    function formatSpeed(s) {
        s = parseFloat(s.toFixed(2));
        if (s > 10) {
            return 10;
        }
        if (s <= 0.1) {
            return 0.1;
        }
        return s;
    }

    window.addEventListener("keypress", function (e) {
        console.log(e.key.toLowerCase());
        const activeElement = this.document.activeElement;
        if (!activeElement) {
            return
        }
        if (
            activeElement.tagName.toLowerCase() === "input" ||
            activeElement.contentEditable === 'true' ||
            activeElement.tagName.toLowerCase() === "textarea"
        ) {
            return;
        }
        const keyList = ["z", "x", "c", "e", "q", "w"];
        const key = e.key.toLowerCase();
        if (keyList.indexOf(key) === -1) {
            return;
        }
        // 获取video元素
        videos = getVideos();
        if (videos.length === 0) {
            return;
        }
        // **



        if (this.location.hostname === "www.youtube.com") {
            if (e.key.toLowerCase() === "e") {
                speed = speed + step;
                changeSpeed(videos, formatSpeed(speed));
            }

            if (e.key.toLowerCase() === "w") {
                speed = speed - step;
                changeSpeed(videos, formatSpeed(speed));
            }
            if (e.key.toLowerCase() === "q") {
                speed = 1;
                changeSpeed(videos, formatSpeed(speed));
            }
        } else {
            if (e.key.toLowerCase() === "c") {
                speed = speed + step;
                changeSpeed(videos, formatSpeed(speed));
            }

            if (e.key.toLowerCase() === "x") {
                speed = speed - step;
                changeSpeed(videos, formatSpeed(speed));
            }
            if (e.key.toLowerCase() === "z") {
                speed = 1;
                changeSpeed(videos, formatSpeed(speed));
            }
        }

        // youtube单独处理。
        // if (
        //     this.location.hostname === "www.youtube.com" &&
        //     e.key.toLowerCase() === "e"
        // ) {
        //     speed = speed + step;
        //     changeSpeed(videos, formatSpeed(speed));
        // }

    });


    function changeSpeed(videos, speed) {
        console.log(videos, speed);
        videos.forEach((video) => {
            video.playbackRate = speed;
            localStorage.setItem(SPEED_KEY, speed.toString());

            video.removeEventListener("playing", syncSpeedToVideo);
            video.removeEventListener("play", syncSpeedToVideo);

            video.addEventListener("playing", syncSpeedToVideo);
            video.addEventListener("play", syncSpeedToVideo);

            notify(video.playbackRate.toString(), video);
        });
    }

    function syncSpeedToVideo() {
        videos.forEach((video) => {
            setTimeout(() => {
                video.playbackRate = formatSpeed(speed);
            }, 1);
        });
    }


    function notify(msg, video) {
        console.log('notify')
        if (video && video.offsetWidth < 200) {
            return
        }
        const className = "edbe85b469d47a8833b84e259864e33";
        const box = document.createElement("div");
        box.className = className;
        box.style.background = "#333";
        box.style.color = "#fff";
        box.style.padding = "8px 20px";
        box.style.position = "fixed";
        box.style.margin = "auto";
        box.style.left = "50%";
        box.style.top = "60px";
        box.style.transform = "translateX(-50%)";
        box.style.borderRadius = "5px";
        box.style.zIndex = "10000";
        box.style.fontSize = "16px";
        box.innerText = msg;
        // const oldBox = document.querySelectorAll("." + className);
        const oldBox = Array.from(document.getElementsByClassName(className));
        if (oldBox.length) {
            oldBox.forEach((b) => {
                b.remove();
            });
        }

        if (video && document.fullscreenElement) {
            video.parentElement.appendChild(box);
        } else {
            document.body.appendChild(box);
        }
        setTimeout(() => {
            box.remove();
        }, 2000);
    }
})();

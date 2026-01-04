// ==UserScript==
// @name         Boss-自动打招呼
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  1.boss直聘 自动打招呼 2.拉勾 自动投递简历 3.猎聘 自动打招呼
// @author       You
// @license      MIT
// @match        https://www.zhipin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454568/Boss-%E8%87%AA%E5%8A%A8%E6%89%93%E6%8B%9B%E5%91%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/454568/Boss-%E8%87%AA%E5%8A%A8%E6%89%93%E6%8B%9B%E5%91%BC.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // 拉勾平台列表  __NEXT_DATA__.props.pageProps.initData.content.positionResult.result
    // 猎聘平台 document.querySelector('.chat-btn-box .ant-btn').click()
    var retryCheck = function (
        checkFun,
        interval,
        nextFun,
        times,
        delay,
        startTime
    ) {
        if (!times) times = 1;
        else times += 1;
        if (!delay) delay = 0;
        if (!startTime) startTime = new Date().getTime();
        setTimeout(function () {
            if (checkFun(times)) {
                if (delay) {
                    var detal = delay - (new Date().getTime() - startTime);
                    if (detal > 0) setTimeout(nextFun, detal);
                    else nextFun();
                } else nextFun();
            } else retryCheck(checkFun, interval, nextFun, times, delay, startTime);
        }, interval);
    };

    var t;
    function killTime() {
      clearTimeout(t)
    }
    let checking = false;

    var bossHandle = function (e) {
        let el = document.querySelector(".tools-btn");
        console.log('checking', checking)
        let closeHandle = () => {
            el.innerText = "自动打招呼";
            el.style.background = "#67C23A";
            checking = false;
            killTime();
        }
        let openHandle = () => {
            checking = true;
            el.style.background = "#E6A23C";
            let ct = 1;
            let lst
            var getLst = () => {
              const lstTmp = document.querySelectorAll(".recommend-card-list .candidate-card-wrap");
              lst = Array.from(lstTmp).filter(item => item.querySelector('.expect-box')?.textContent?.includes('前端'))
            }

            getLst();
            el.innerText = "停止打招呼(" + ct + "/" + lst.length + ")";

            const delay = (ms) => new Promise(res => setTimeout(res, ms))
            async function callFn() {
                if (lst.length) {
                    if (!lst[ct - 1]) {
                      alert('已经到底啦')
                      closeHandle()
                      return
                    }
                    let sel = lst[ct - 1].querySelector(".btn.btn-greet");
                    el.innerText = "停止打招呼(" + ct + "/" + lst.length + ")";

                    if (!sel) {
                      t = setTimeout(() => {
                        callFn();
                      }, 1000)
                      ct++;
                      return
                    }
                    sel.click();
                    await delay(1000);

                    const after = lst[ct - 1].querySelector(".btn.btn-greet")
                    if (after && after.textContent.trim().startsWith('打招呼')) {
                      alert('打招呼达到上线，请择日再试')
                      closeHandle()
                      return
                    }

                    t = setTimeout(() => {
                      callFn();
                    }, 1000)
                    ct++;
                    if(ct > lst.length) {
                        document.scrollingElement.scrollTo(0, Number.MAX_SAFE_INTEGER)
                        await delay(2000);
                        getLst();
                    }
                } else {
                    console.log('列表为空');
                }
            }

            callFn();

        }
        if (checking) {
            closeHandle();
        } else {
            openHandle();
        }
    };
    ((_) => {
            console.log('jobs tools start ============================================');
            if(window.location.href.startsWith('https://www.zhipin.com/web/geek/chat')) {
                setTimeout(() => {
                    console.log('test setTimeout')
                    window.history.go(-1);
                }, 5000)
            }
            if(window.location.href.startsWith('https://www.lagou.com/wn/jobs')) {
                let reg = /https:\/\/www.lagou.com\/wn\/jobs\/\d+.+/
                if(reg.exec(window.location.href) !== null) {
                    setTimeout(() => {
                        // 发送简历
                        document.querySelector('.btn.fr.btn_apply').click()
                    }, 1000)
                    setTimeout(() => {
                        window.close();
                    }, 2000)
                }
            }
            let el = document.createElement("button");
            el.setAttribute(
                "style",
                "width:140px;height:30px;border:0;color:#fff;background-color:#67C23A;cursor:pointer;outline: none;position: fixed; top: 0; left: 0;z-index:99999;"
            );
            el.setAttribute(
                "class",
                "tools-btn"
            )
            el.innerText = "自动打招呼";
            if (window.location.host === "www.zhipin.com") {
                if (
                    window.location.href.startsWith(
                        "https://www.zhipin.com/"
                    )
                ) {
                    retryCheck(
                        (_) => {
                            let lst = document.querySelectorAll(".recommend-card-list  > li .card-inner");
                            return lst && lst.length > 0;
                        },
                        100,
                        (_) => {
                            document.querySelector("body").appendChild(el);
                            // closeHandle()
                            el.addEventListener(
                                "click",
                                bossHandle,
                                false
                            );
                        }
                    );
                }
            }

        }) ()
})();
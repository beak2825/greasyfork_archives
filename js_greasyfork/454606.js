// ==UserScript==
// @name         Boss-自动打招呼_3
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  1.boss直聘 自动打招呼 2.拉勾 自动投递简历 3.猎聘 自动打招呼
// @author       imcuttle
// @license      MIT
// @match        https://www.zhipin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454606/Boss-%E8%87%AA%E5%8A%A8%E6%89%93%E6%8B%9B%E5%91%BC_3.user.js
// @updateURL https://update.greasyfork.org/scripts/454606/Boss-%E8%87%AA%E5%8A%A8%E6%89%93%E6%8B%9B%E5%91%BC_3.meta.js
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

            var getLst = () => {
              const lstTmp = document.querySelectorAll(".recommend-card-list .candidate-card-wrap");
              const validList = Array.from(lstTmp).filter(item => {
                const joinText = item.querySelector('.col-2 .row.row-flex .content')?.textContent
                const baseInfo = item.querySelector('.col-2 .row.base-info.join-text-wrap')?.textContent
                const workBg = item.querySelector('.col-3 .timeline-wrap')?.textContent

                const tmps = baseInfo && baseInfo.match(/(\d+)岁/)
                if (baseInfo && baseInfo.includes('应届生')) {
                  return false
                }
                if (!tmps || !tmps[1] || Number(tmps[1]) > 32) {
                  return false
                }

                if (!joinText || !joinText?.includes('前端')) {
                  return false
                }

                if (!workBg || !['阿里', '腾讯', '百度', 'Facebook',
                                 'Google', 'Amazon', '亚马逊', '微软',
                                 '唯品会', '盒马', '京东', '快手', '滴滴',
                                 '小米', '网易', '猿辅导', '学而思', '字节',
                                 '虾皮', 'Shopee', '360', '蓝湖', '高德',
                                 // '',
                                 '嘀嘀', '美团', '三快'].some(k => new RegExp(k, 'i').test(workBg))) {
                  return false
                }

                console.log({
                  joinText,
                  baseInfo,
                  workBg,
                })
                return true
              })
              return {
                validList,
                list: lstTmp
              }
            }

            let ct = 1;
            let successedCount = 0;
            let current = getLst();

            const delay = (ms) => new Promise(res => setTimeout(res, ms))

            async function callFn() {
              let dom
              const goNext = async () => {
                if (!checking) {
                  return
                }
                let prevLen = current.list.length
                document.scrollingElement.scrollTo(0, Number.MAX_SAFE_INTEGER)
                await delay(2000);
                const tmp = getLst();
                if (tmp.list.length <= prevLen) {
                  alert('到底了！')
                  closeHandle()
                } else {
                  current = tmp
                  if (ct >= tmp.validList.length) {
                    await goNext()
                  } else {
                    dom = current.validList[ct-1]
                  }
                }
              }
              do {
                if (!checking) {
                  return
                }
                dom = current.validList[ct-1]
                el.innerText = "停止打招呼(" + ct + "/" + (current.validList.length) + ")";
                if (!dom) {
                  await goNext()
                }
                if (!checking) {
                  return
                }
                const hiBtn = dom.querySelector(".btn.btn-greet");
                if (!hiBtn) {
                  ct++;
                  continue
                }
                hiBtn.click();
                await delay(1000);
                ct++;
              } while (dom);
              closeHandle();
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
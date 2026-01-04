
// ==UserScript==
// @name         Boss-自动求简历
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  1.boss直聘
// @author       imcuttle
// @match        https://www.zhipin.com/web/boss/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452151/Boss-%E8%87%AA%E5%8A%A8%E6%B1%82%E7%AE%80%E5%8E%86.user.js
// @updateURL https://update.greasyfork.org/scripts/452151/Boss-%E8%87%AA%E5%8A%A8%E6%B1%82%E7%AE%80%E5%8E%86.meta.js
// ==/UserScript==

(async function () {
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

  var windowLoadedExecute = (fn) => {
    if (document.readyState === 'complete') {
      fn();
    } else {
      window.addEventListener('load', fn);
    }
  };

  var loadJs = (src) => {
    const script = document.createElement('script')
    script.src = src
    document.head.appendChild(script)
    return new Promise((resolve, reject) => {
      script.onload = resolve
      script.onerror = resolve
    })
  }

  // windowLoadedExecute(async () => {
    await loadJs('https://cdn.jsdelivr.net/npm/idb@7/build/umd.js')
    retryCheck(
      (_) => {
          let lst = document.querySelectorAll(".geek-list-container .geek-item");
          return lst && lst.length > 0;
      },
      100,
      async (_) => {
        const TABLE_NAME = 'resume-records'
        const { openDB } = idb;
        const db = await openDB('boss-tool', 1, {
          upgrade(db) {
            db.createObjectStore(TABLE_NAME);
          },
        });

        const div = document.createElement('div')
        Object.assign(div.style, {
          position: 'fixed',
          zIndex: 2000,
          top: 0,
          left: 0
        });

        const el = document.createElement('button')
        el.textContent = '自动获取简历(已关闭)'
        div.appendChild(el)

        const el1 = document.createElement('button')
        el1.textContent = '清除简历缓存(避免重复下载)'
        div.appendChild(el1)

        const delay = (ms) => new Promise(res => setTimeout(res, ms))
        let isStarted = false
        const start = async () => {
          isStarted = true
          el.textContent = '自动获取简历(已开启)'

          const hasResumeAndReturnDom = async () => {
            const wrapDom = document.querySelector('.bosschat-conversation-wrap')
            const list = wrapDom.querySelectorAll('.message.hyperLink .text')
            const lastOne = list[list.length - 1]
            if (lastOne && lastOne.textContent.includes('点击查看附件简历')) {
              const titleDom = lastOne.querySelector('.text > p > b')
              const key = titleDom.textContent.trim()
              const count = await db.get(TABLE_NAME, key);
              return {
                dom: lastOne,
                key,
                alreadyDownload: !!count
              }
            }
          }

          const hasSendResume = () => {
            const wrapDom = document.querySelector('.bosschat-conversation-wrap')
            const list = wrapDom.querySelectorAll('.message.item-system .text')
            if (list && Array.from(list).some(d => d.textContent.includes('简历请求已发送。'))) {
              return true
            }
          }

          const hasFriendSendMsg = () => {
            const wrapDom = document.querySelector('.bosschat-conversation-wrap')
            return !!wrapDom.querySelector('.message.item-friend .text')
          }

          const hasSelfSendMsg = () => {
            const wrapDom = document.querySelector('.bosschat-conversation-wrap')
            return !!wrapDom.querySelector('.message.item-myself .text')
          }


          let list = document.querySelectorAll(".geek-list-container .geek-item");

          let c = 0
          for (let i = 0; i < list.length; i++) {
            const item = list[i];
            if (!isStarted) {
              return
            }
            const name = item.querySelector('.name').textContent
            c++
            el.textContent = `自动获取简历(已开启 ${c}/${list.length})`
            const itemWrap = item.querySelector('.geek-item-warp');
            itemWrap.click()
            await delay(1200)
            itemWrap.scrollIntoView();

            const wrapDom = document.querySelector('.bosschat-conversation-wrap')
            const opWrap = wrapDom.querySelector('.dialog-resume-op-warp')

            if (opWrap) {
              const text = opWrap.querySelector('.text')
              if (text && text.textContent === '对方想发送附件简历给您，您是否同意') {
                // 同意
                opWrap.querySelector('.link-agree').click()
                await delay(1000)
                console.log(`正在处理 ${name} 接受对方的简历`)
              }
            }

            let rlt
            if (rlt = await hasResumeAndReturnDom()) {
              if (rlt.alreadyDownload) {
                console.log(`正在处理 ${name} 已下载简历`)
                continue;
              }

              rlt.dom.click()
              await delay(1000)

              const downloadDom = document.querySelector('.dialog-container[style=""] *[ka=resume_download]')
              downloadDom.click()
              console.log(`正在处理 ${name} 下载对方的简历`)
              await delay(2000)

              const closeDom = document.querySelector('.dialog-container[style=""] *[ka=resume_close]')
              closeDom.click()

              db.put(TABLE_NAME, 1, rlt.key);
            } else {
              if (!hasSendResume()) {
                // 要简历
                const getResumeDom = document.querySelector('.bosschat-toolbar-box .btn-exchange[ka^=get_resume]')
                if (!getResumeDom.classList.contains('disabled')) {
                  getResumeDom.click()
                  await delay(600)

                  const sure = document.querySelector('.dialog-wrap.resume *[ka=dialog_sure]')
                  if (sure) {
                    sure.click()
                  }
                  console.log(`正在处理 ${name} 索要对方的简历`)
                } else {
                  if (!hasSelfSendMsg() && hasFriendSendMsg()) {
                    const input = document.querySelector('.bosschat-chat-input.chat-message')
                    input.innerHTML = '方便发一份你的简历过来吗？';

                    const sendBtn = document.querySelector('[ka=conversation_send_text]');
                    sendBtn.click();
                    await delay(600);
                    console.log(`正在处理 ${name} 发送索要简历消息`)
                    // 重新走流程，索要简历
                    i--;
                  } else {
                    console.log(`正在处理 ${name} 无操作，不可点`)
                  }
                }
              } else {
                console.log(`正在处理 ${name} 无操作，已发送简历无响应`)
              }
            }

            if (i+1 === list.length) {
              // document.querySelector('.geek-list-scroll-wrap').scrollTop = Number.MAX_SAFE_INTEGER
              // await delay(2000)
              let prevLen = list.length
              list = document.querySelectorAll(".geek-list-container .geek-item");
              if (prevLen >= list.length) {
                alert('已经到底啦')
              }
            }
          }

          stop()
        }
        const stop = () => {
          isStarted = false
          el.textContent = '自动获取简历(已关闭)'
        }
          document.querySelector("body").appendChild(div);
          // ((_) => {
          //     bossHandle(_, true);
          // })()

          el1.addEventListener('click', () => {
            db.clear(TABLE_NAME)
          });
          el.addEventListener(
              "click",
              () => {
                if (isStarted) {
                  stop()
                } else {
                  start();
                }
              },
              false
          );
      }
    );
  // });
})();
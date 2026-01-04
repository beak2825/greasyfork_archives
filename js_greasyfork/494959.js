// ==UserScript==
// @name         冰楓論壇小工具
// @namespace    http://tampermonkey.net/
// @description  Wuchieh 製作 論壇小工具
// @author       Wuchieh
// @version      24052002
// @match        https://*.bingfong.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bingfong.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494959/%E5%86%B0%E6%A5%93%E8%AB%96%E5%A3%87%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/494959/%E5%86%B0%E6%A5%93%E8%AB%96%E5%A3%87%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function Fix_0516() {
        if (window.malicious) window.malicious = null
    }

    function checkIn() {
        const aTag = document.querySelector('#pper_a');

        if (!aTag) return;

        const img = aTag.querySelector('img');

        if (img && img.src && img.src.includes('dk.png') && typeof aTag.href === 'string') {
            fetch(aTag.href).then(() => {
                console.log('簽到成功')
            })
        } else {
            console.log('已簽到')
        }
    }

    function adError() {
        return new Promise((res) => {
            // setInterval(() => {
            //     const btn = document.querySelector('#fwin_dialog_submit');
            //     if (btn && btn.click) {
            //         btn.click();
            //         btn.remove();
            //         res(void 0);
            //     }
            // });
            // const showDialog = window[`showDialog`]
            window['showDialog'] = (v) => {
                console.log(v)
            }
            res(void 0);
        })
    }

    function unLockPage() {
        const aTags = [
            {query: '#Info', name: '繼續閱讀文章'},
            {query: '#messagetext > div:nth-child(2) > div > center > div:nth-child(3) > a', name: '繼續閱讀喔'},
            {query: '#data-ad', name: '繼續閱讀隱藏文'},
            {query: '#amd02 > div > center > a', name: 'Enter', over: true},
        ]

        const parser = new DOMParser();
        const aTagRef = {value: null}
        const domRef = {value: null}
        const unlockingRef = {value: false}
        const needBackRef = {value: false}

        return new Promise(async (resolve, reject) => {
            for (const aTag of aTags) {
                if (!domRef.value) {
                    domRef.value = document
                }

                function GetATag() {
                    if (aTag.query === '#Info') {
                        const lockedDiv = domRef.value.querySelector('.locked')
                        if (!lockedDiv) {
                            return void 0
                        }
                        for (const tagA of lockedDiv.querySelectorAll('a')) {
                            if (tagA['id']) {
                                return tagA
                            }
                        }
                    }else{
                        return domRef.value.querySelector(aTag.query);
                    }
                }

                // aTagRef.value = domRef.value.querySelector(aTag.query);
                aTagRef.value = GetATag();

                if (!aTagRef.value || typeof aTagRef.value.href !== 'string') {
                    if (domRef.value.querySelector(aTags[1].query)) {
                        needBackRef.value = true
                        continue
                    }

                    if (unlockingRef.value) {
                        reject(`${aTag.name} tag 解析錯誤`);
                        return;
                    }

                } else {
                    let page = ''

                    try {
                        page = await fetch(aTagRef.value).then(res => res.text().then((res) => res))
                    } catch (e) {
                        if (aTag.query === '#Info') {
                            if (aTagRef.value && aTagRef.value.click) {
                                aTagRef.value.click()
                            }
                            resolve(void 0)
                            return
                        }
                        reject(e)
                        return
                    }


                    if (aTag.over) {
                        resolve(needBackRef.value ? 'back' : 'success')
                        return
                    }

                    domRef.value = parser.parseFromString(page, "text/html");
                    unlockingRef.value = true
                }
            }

            resolve(void 0)
        })
    }

    function start() {
        Fix_0516();

        adError().then();

        unLockPage().then(res => {
            if (res === 'success') {
                location.reload()
            } else if (res === 'back') {
                history.back()
            }
        }).catch(err => {
            alert(`文章解鎖失敗, ${err}`)
        })

        checkIn();
    }

    window.addEventListener(`error`,(err)=>{console.log(err)});

    start()
})();

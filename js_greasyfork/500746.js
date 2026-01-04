// ==UserScript==
// @name         discord jump top
// @namespace    http://tampermonkey.net/
// @version      v0.0.15
// @description  discord爬楼辅助器
// @author       bincooo 折戟沉沙、丿
// @match        https://discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500746/discord%20jump%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/500746/discord%20jump%20top.meta.js
// ==/UserScript==

(function() {
    const css = `<style>
    div[class^=modal_] div[class^=loadingOverlay_] img.zoom-out {cursor:zoom-out}
    div[class^=modal_] div[class^=loadingOverlay_] img {cursor:zoom-in}
    </style>`;

    console.log("discord jump top")
    document.head.appendChild($(css)[0])
    const jumpBtm = $(`<a class='j-top' href='javascript:;' style='position: absolute; top: calc(100% - 20px); right: 30px; cursor: pointer'>jump top ⬆️</a>`)
    const cancelBtm = $(`<a class='j-cancel' hidden href='javascript:;' style='position: absolute; top: calc(100% - 20px); right: 30px; cursor: pointer'>cancel</a>`)

    function waitTimout(selector, millisecond) {
        let timer, count = millisecond / 1000;
        return new Promise(function(resolve, reject) {
            timer = setInterval(() => {
                const obj = $(selector);
                if (obj.length > 0) {
                    clearInterval(timer);
                    return resolve(obj);
                }

                if (count == 0) {
                    clearInterval(timer);
                    return reject();
                }

                count--;
            }, 1000)
        })
    }

    function rebin(selector, fun) {
        let retry = 10, timer;
        timer = setInterval(() => {
            if (retry <= 0) {
                clearInterval(timer);
                return
            }

            retry --
            if ($(selector).length > 0) {
                return
            }

            fun()
        }, 1000);
    }

    function jumpTop(selector, key = 'g') {
        const top = $(`#j${key}-top`); if (top.length > 0) {
            return
        }

        let retry = 30;
        const btm = jumpBtm.clone();
        const cancel = cancelBtm.clone();
        btm.attr("id", `j${key}-top`)

        rebin(`#j${key}-top`, () => {
            const barArea = $(selector)
            barArea.append(btm);
            barArea.append(cancel);
            btm.click(() => {
                if (btm.disabled === true) {
                    return
                }

                if (/https:\/\/discord.com\/channels\/\d+\/\d+$/.test(location.href)) {
                    location.href += '/1';
                    return;
                }

                btm.disabled = true;
                btm.attr("hidden", true);
                cancel.attr("hidden", false);
                const $jump = (resolve, reject) => {
                    if (retry <= 0) {
                        resolve()
                        retry = 30;
                        return
                    }

                    retry --;
                    const chat = $("div[id^=chat-messages-]");
                    $("div[class^=messagesWrapper] > div[class^=scroller_]").animate({scrollTop: 0}, 800);
                    setTimeout(() => {
                        (chat.length > 0) ? resolve() : $jump(resolve, reject);
                    }, 1000);
                }
                new Promise($jump).then(_ => {
                    btm.disabled = false;
                    btm.attr("hidden", false);
                    cancel.attr("hidden", true);
                    console.log("~ top over ~");
                    retry = 30;
                });
            });
            cancel.click(() => {
                retry = 0
                btm.attr("hidden", false);
                cancel.attr("hidden", true);
            });
            setTimeout(() => jumpTop(selector, key), 3000);
        });
    }

    function isImg(target) {
        if (target.nodeName == 'IMG') {
            return true;
        }

        const Do = () => {
            const img = $('div[class^=carouselModal_] div[class^=loadingOverlay_] img');
            if (img.length > 0) {
                const newI = img.clone();
                img.hide();
                newI[0].onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    max_min(e);
                    return false;
                }
                img.parent().append(newI);
                img.remove();
            }
        }

        setTimeout(()=> {
            Do();
            $('button[class^=prevButtonContainer_]').click(() => {
                setTimeout(Do, 500);
            });
            $('button[class^=nextButtonContainer_]').click(() => {
                setTimeout(Do, 500);
            });
        }, 500);
        return false;
    }

    function max_min(event) {
        const node = event.target.parentElement?.parentElement;
        const classList = node.classList;
        let matched = false;
        for (let clazz of classList) {
            if (clazz.startsWith('imageWrapper_')) {
                matched = true;
                break
            }
        }
        if (!matched) return;

        const img = $(event.target);
        const dataS = img.attr('data-s');
        if (dataS == '1') {
            img.attr('data-s', 0);
            img.addClass('zoom-out');
            $(node).attr('style', $(node).attr('data-style'));
        } else {
            img.attr('data-s', 1);
            img.removeClass('zoom-out');
            $(node).attr('data-style', $(node).attr('style'));
            $(node).attr('style', 'width:' + document.body.clientWidth * 0.90 + 'px;height:' +document.body.clientHeight * 0.90 + 'px;overflow-y:auto;');
        }

        img.attr('style', 'width:100%;object-fit:cover;');
        const optionsContainer = node.nextElementSibling;
        event.target.src = $(optionsContainer).find('a').attr('href');
        return false;
    }

    $(() => {
        waitTimout('#app-mount div[class^=appAsidePanelWrapper_]', 10000)?.then(dom => {
            dom.on('click', (e) => {
                console.log('appAsidePanelWrapper click ...', e)
                if (isImg(e.target)) {
                    return max_min(e);
                }
                setTimeout(() => jumpTop("div[class^=channelBottomBarArea_]", 'g'), 3000);
            });
            setTimeout(() => dom.trigger('click'), 3000);
        });
    });

})();
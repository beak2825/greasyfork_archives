// ==UserScript==
// @name            游戏社区(TapTap)列表页贴子预览
// @namespace       游戏社区(TapTap)列表页贴子预览
// @license         GPL-3.0 License
// @version         1.3.3
// @description     TapTap游戏社区列表页贴子卡片新增预览按钮，可在列表页直接预览贴子内容。
// @author          QIAN
// @match           *://www.taptap.cn/app/*/topic*
// @grant           GM_addStyle
// @grant           GM_info
// @require         https://scriptcat.org/lib/513/2.0.1/ElementGetter.js?#sha256=V0EUYIfbOrr63nT8+W7BP1xEmWcumTLWu2PXFJHh5dg=
// @supportURL      https://github.com/QIUZAIYOU/Taptap-PostPreview
// @homepageURL     https://github.com/QIUZAIYOU/Taptap-PostPreview
// @icon            https://assets.tapimg.com/cupid-apps/web-app/favicon.2.ico
// @downloadURL https://update.greasyfork.org/scripts/402945/%E6%B8%B8%E6%88%8F%E7%A4%BE%E5%8C%BA%28TapTap%29%E5%88%97%E8%A1%A8%E9%A1%B5%E8%B4%B4%E5%AD%90%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/402945/%E6%B8%B8%E6%88%8F%E7%A4%BE%E5%8C%BA%28TapTap%29%E5%88%97%E8%A1%A8%E9%A1%B5%E8%B4%B4%E5%AD%90%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==
// ?#sha256=V0EUYIfbOrr63nT8+W7BP1xEmWcumTLWu2PXFJHh5dg=
(function () {
    'use strict';
    const selector = {
        tap: '#__nuxt',
        momentCardFooter: '.moment-card__footer',
        previewWrapper: '#previewWrapper',
        previewIframe: '#previewIframe',
        previewIframeMask: '#previewIframeMask',
        previewContentHeader: 'header',
        previewContentMain: 'main',
        previewButton: '.previewButton',
        voteButton: '.vote-button.moment-card__footer-button',
    }
    const styles = {
        PreviewWrapperStyle: '#previewWrapper{position:fixed;top:50%;left:50%;overflow:hidden;box-sizing:border-box;width:600px;height:97vh;border:2px solid #00d9c5;border-radius:10px;background:#191919;transform:translate(-50%,-50%)}#previewWrapper::backdrop{backdrop-filter:blur(3px)}#previewIframe{width:100%;height:100%;border:none;background:#191919}#previewIframeMask{position:absolute;display:flex;background:#191919;inset:0;align-items:center;justify-content:center}.previewButton{cursor: pointer}',
        PreviewIframeStyle: 'body{background:#191919!important}header{display:none!important}main{margin-left:0!important}'
    }
    const utils = {
        /**
         * 休眠
         * @param {Number} 时长
         * @returns
         */
        sleep(times) {
            return new Promise(resolve => setTimeout(resolve, times))
        },
        logger: {
            info(content) {
                console.info('%cTapTap预览', 'color:white;background:#006aff;padding:2px;border-radius:2px', content);
            },
            warn(content) {
                console.warn('%cTapTap贴子预览', 'color:white;background:#ff6d00;padding:2px;border-radius:2px', content);
            },
            error(content) {
                console.error('%cTapTap贴子预览', 'color:white;background:#f33;padding:2px;border-radius:2px', content);
            },
            debug(content) {
                console.info('%cTapTap贴子预览(调试)', 'color:white;background:#cc00ff;padding:2px;border-radius:2px', content);
            },
        },
        createElementAndInsert(HtmlString, target, method) {
            const element = elmGetter.create(HtmlString, target)
            target[method](element)
            return element
        },
        insertStyleToDocument(id, css) {
            const styleElement = GM_addStyle(css)
            styleElement.id = id
        },
        htmlStringToDom(htmlString) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlString.trim();
            return tempDiv.firstChild;
        },
        isAsyncFunction(targetFunction) {
            return targetFunction.constructor.name === 'AsyncFunction'
        },
        reloadCurrentTab(...args) {
            if (args && args[0] === true) {
                location.reload()
            } else if (vals.auto_reload()) location.reload()
        },
        executeFunctionsSequentially(functionsArray) {
            if (functionsArray.length > 0) {
                const currentFunction = functionsArray.shift()
                if (utils.isAsyncFunction(currentFunction)) {
                    currentFunction().then(result => {
                        if (result) {
                            const { message, callback } = result
                            if (message) utils.logger.info(message)
                            if (callback && Array.isArray(callback)) utils.executeFunctionsSequentially(callback)
                        }
                        utils.executeFunctionsSequentially(functionsArray)
                    }).catch(error => {
                        utils.logger.error(error)
                        utils.reloadCurrentTab()
                    })
                } else {
                    const result = currentFunction()
                    if (result) {
                        const { message } = result
                        if (message) utils.logger.info(message)
                    }
                }
            }
        },
        checkElementExistence(elementsArray) {
            if (Array.isArray(elementsArray)) {
                return elementsArray.map(element => Boolean(element))
            } else {
                return [Boolean(elementsArray)]
            }
        },
        async getElementAndCheckExistence(selectors, ...args) {
            let delay = 7000, debug = false
            if (args.length === 1) {
                const type = typeof args[0]
                if (type === 'number') delay = args[0]
                if (type === 'boolean') debug = args[0]
            }
            if (args.length === 2) {
                delay = args[0]
                debug = args[1]
            }
            const result = await elmGetter.get(selectors, delay)
            if (debug) utils.logger.debug(utils.checkElementExistence(result))
            return result
        },
    }
    const modules = {
        async insertPreviewElementToDocument() {
            const existingPreviewWrapper = await utils.getElementAndCheckExistence(selector.previewWrapper);
            if (existingPreviewWrapper) existingPreviewWrapper.remove();

            const previewElementHtml = `
                <div id="previewWrapper" popover>
                    <div id="perViewFloat">
                        <div id="previewClose"></div>
                        <div id="previewEnterPost"><a href=""></a></div>
                    </div>
                    <div id="previewIframeMask">
                        <div class="loading-dots__wrapper" type="dots" loading="true">
                            <span class="loading-dots__dot" style="font-size: 6px;"></span>
                            <span class="loading-dots__dot" style="font-size: 6px;"></span>
                            <span class="loading-dots__dot" style="font-size: 6px;"></span>
                        </div>
                    </div>
                    <iframe id="previewIframe" title="previewIframe"></iframe>
                </div>
            `;
            const previewWrapper = utils.createElementAndInsert(previewElementHtml, document.body, 'append');
            const previewIframe = previewWrapper.querySelector(selector.previewIframe);
            const previewIframeMask = previewWrapper.querySelector(selector.previewIframeMask);
            const previewIframeWindow = previewIframe.contentWindow;

            previewWrapper.addEventListener('toggle', (event) => {
                if (event.newState === 'closed') {
                    previewIframe.src = '';
                    previewIframeMask.style.display = 'flex';
                    document.querySelector(selector.tap).style.pointerEvents = 'auto';
                }
            });

            previewIframe.addEventListener('load', () => {
                const previewContentHeader = previewIframeWindow.document.querySelector(selector.previewContentHeader);
                const previewContentMain = previewIframeWindow.document.querySelector(selector.previewContentMain);
                if (previewContentHeader && previewContentMain) {
                    previewContentHeader.style.display = 'none';
                    previewContentMain.style.marginLeft = '0';
                    previewIframeMask.style.display = 'none';
                }
            });
        },
        async insertPreviewButtonToMomentCard() {
            const previewButtonHtml = `
                <div class="moment-card__footer-button">
                    <span class="previewButton icon-button flex-center--y" data-booth-item="" data-track-prevent="click" data-booth-level="1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" class="icon" viewBox="0 0 1024 1024">
                            <path fill="#d6d6d6" d="M935.253 494.933C849.067 294.827 686.933 170.667 512 170.667S174.933 294.827 88.747 494.933a42.667 42.667 0 0 0 0 34.134C174.933 729.173 337.067 853.333 512 853.333s337.067-124.16 423.253-324.266a42.667 42.667 0 0 0 0-34.134zM512 768c-135.253 0-263.253-97.707-337.067-256C248.747 353.707 376.747 256 512 256s263.253 97.707 337.067 256C775.253 670.293 647.253 768 512 768zm0-426.667A170.667 170.667 0 1 0 682.667 512 170.667 170.667 0 0 0 512 341.333zm0 256A85.333 85.333 0 1 1 597.333 512 85.333 85.333 0 0 1 512 597.333z"/>
                        </svg>
                    </span>
                </div>
                `;

            const [previewWrapper, previewIframe, voteButton] = await utils.getElementAndCheckExistence([selector.previewWrapper, selector.previewIframe, selector.voteButton]);
            const versionData = voteButton.dataset;
            await elmGetter.each(selector.momentCardFooter, async (momentCardFooter) => {
                const existingPreviewButton = momentCardFooter.querySelector(selector.previewButton);
                if (existingPreviewButton) existingPreviewButton.remove();
                const previewButton = utils.createElementAndInsert(previewButtonHtml, momentCardFooter, 'append');
                for (let version in versionData) {
                    if (versionData.hasOwnProperty(version)) {
                        previewButton.setAttribute(`data-${version}`, versionData[version]);
                    }
                }
                const tapElement = document.querySelector(selector.tap);
                const momentId = momentCardFooter.parentElement.dataset.eventObjKey.split(":")[1]
                const momentLink = `https://www.taptap.cn/moment/${momentId}`;
                previewButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    previewWrapper.showPopover();
                    previewIframe.src = momentLink;
                    tapElement.style.pointerEvents = 'none';
                });
            });
        },
        thePrepFunction() {
            utils.insertStyleToDocument('PreviewWrapperStyle', styles.PreviewWrapperStyle)
        },
        theMainFunction() {
            modules.thePrepFunction()
            utils.logger.info(`脚本版本｜${GM_info.script.version}`)
            utils.logger.info('当前标签｜已激活｜开始应用配置')
            const functionsArray = [
                modules.insertPreviewElementToDocument,
                modules.insertPreviewButtonToMomentCard
            ]
            utils.executeFunctionsSequentially(functionsArray)
        }
    }
    modules.theMainFunction()
})();
// ==UserScript==
// @name         بىلنەپ ئۈندىدار سالون ياردەمچىسى 
// @namespace    https://bilnap.com/
// @version      1.0
// @description  bilnap公众号助手，方便编辑维吾尔文
// @match        *://mp.weixin.qq.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/514151/%D8%A8%D9%89%D9%84%D9%86%DB%95%D9%BE%20%D8%A6%DB%88%D9%86%D8%AF%D9%89%D8%AF%D8%A7%D8%B1%20%D8%B3%D8%A7%D9%84%D9%88%D9%86%20%D9%8A%D8%A7%D8%B1%D8%AF%DB%95%D9%85%DA%86%D9%89%D8%B3%D9%89.user.js
// @updateURL https://update.greasyfork.org/scripts/514151/%D8%A8%D9%89%D9%84%D9%86%DB%95%D9%BE%20%D8%A6%DB%88%D9%86%D8%AF%D9%89%D8%AF%D8%A7%D8%B1%20%D8%B3%D8%A7%D9%84%D9%88%D9%86%20%D9%8A%D8%A7%D8%B1%D8%AF%DB%95%D9%85%DA%86%D9%89%D8%B3%D9%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ساقلاش ۋە ئېلىش فۇنكسىيەلىرى
    const saveValue = (key, value) => GM_setValue(key, value);
    const getValue = (key, defaultValue) => GM_getValue(key, defaultValue);

    // خەت نۇسخىسى مەشغۇلاتلىرى
    const getFonts = () => getValue('fonts', ['UKIJ Ekran', 'UKIJ CJK', 'Alkatip']);
    const saveFont = (newFont) => {
        let fonts = getFonts();
        if (!fonts.includes(newFont)) {
            fonts.push(newFont);
            saveValue('fonts', fonts);
        }
    };

    // خەت نۇسخىسىنى ئۆزگەرتىش
    const changeFont = (element, fontFamily) => {
        if (element) {
            element.style.setProperty('font-family', `${fontFamily}, Arial, sans-serif`, 'important');
        }
    };

    const changeFonts = (fontFamily) => {
        const editorFrame = document.getElementById('ueditor_0');
        if (editorFrame && editorFrame.contentDocument) {
            changeFont(editorFrame.contentDocument.body, fontFamily);
            editorFrame.contentDocument.querySelectorAll('p, span, div').forEach(el => {
                changeFont(el, fontFamily);
            });
        }
        document.querySelectorAll('body, #js_title_main .js_article_title, .appmsg_preview_container .appmsg, .weui-desktop-publish__cover-item .weui-desktop-publish__cover__title, .bilnap-box, .bilnap-box .tab-button, p, span, div, h1, h2, h3, h4, h5, h6, a, button, input, textarea').forEach(el => {
            changeFont(el, fontFamily);
        });
    };

    // فونتنىڭ بار-يوقلۇقىنى تەكشۈرۈش فۇنكسىيەسى
    const isFontAvailable = (font) => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const testText = 'abcdefghijklmnopqrstuvwxyz0123456789';
        context.font = '12px monospace';
        const baselineWidth = context.measureText(testText).width;
        context.font = `12px ${font}, monospace`;
        return baselineWidth !== context.measureText(testText).width;
    };

    // مەۋجۇت فونتلارنى تەكشۈرۈش
    const checkAvailableFonts = () => {
        const commonUyghurFonts = ['UKIJ Ekran', 'UKIJ Tuz', 'UKIJ Basma', 'Alp Ekran', 'Alp Tuz', 'UKIJTor', 'UKIJ Kufi'];
        const availableFonts = commonUyghurFonts.filter(isFontAvailable);
        saveValue('availableFonts', availableFonts);
        return availableFonts;
    };

    // فونت تاللىغۇچنى يېڭىلاش
    const updateFontSelectors = () => {
        const selector = document.getElementById('fontSelector');
        const availableFonts = checkAvailableFonts();
        const customFonts = getFonts().filter(font => !availableFonts.includes(font));
        const allFonts = [...availableFonts, ...customFonts];

        selector.innerHTML = allFonts.map(font => `<option value="${font}">${font}</option>`).join('');
        selector.value = getValue('currentFont', 'UKIJ Ekran');
    };

    // كۆرۈنمە يۈزنى قۇرۇش
    const createUI = () => {
        const div = document.createElement('div');
        div.className = 'bilnap-box';
        div.style.direction = 'rtl';
        div.innerHTML = `
            <style>
                * {
                    font-family: ${getValue('currentFont', 'UKIJ Ekran')}, Arial, sans-serif !important;
                }
                .bilnap-box {
                    font-family: ${getValue('currentFont', 'UKIJ Ekran')}, Arial, sans-serif;
                }
                .bilnap-box #myWeChatUI {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 9999;
                    cursor: move;
                }
                .bilnap-box #myWeChatButton {
                    padding: 0;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background-color: #07C160;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }
                .bilnap-box #myWeChatButton:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
                }
                .bilnap-box #myWeChatButton img {
                    width: 88%;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .bilnap-box #myWeChatFrame {
                    display: none;
                    position: fixed;
                    top: 95px;
                    right: 20px;
                    background-color: white;
                    border: none;
                    border-radius: 15px;
                    padding: 25px;
                    z-index: 10000;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    width: 320px;
                }
                .bilnap-box #myWeChatFrame h3 {
                    color: #07C160;
                    margin-top: 0;
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 1.2em;
                }
                .bilnap-box #myWeChatOverlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.4);
                    z-index: 9998;
                    backdrop-filter: blur(1.3px);
                }
                .bilnap-box select, .bilnap-box input {
                    width: 100%;
                    padding: 10px;
                    margin: 5px 0 10px 0;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    font-size: 14px;
                }
                .bilnap-box button {
                    margin-top: 15px;
                    padding: 10px 15px;
                    background-color: #07C160;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: bold;
                }
                .bilnap-box button:hover {
                    background-color: #06AE56;
                }
                .bilnap-box p {
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                input#newFontInput {
                    width: 93%;
                }
                .bilnap-box .tab-buttons {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 20px;
                }
                .bilnap-box .tab-button {
                    padding: 8px 15px;
                    background-color: #f0f0f0;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: bold;
                }
                .bilnap-box .tab-button.active {
                    background-color: #07C160;
                    color: white;
                }
                .bilnap-box .tab-content {
                    display: none;
                }
                .bilnap-box .tab-content.active {
                    display: block;
                }
                .bilnap-box .instructions {
                    margin-top: 15px;
                    padding: 10px;
                    background-color: #f9f9f9;
                    border-radius: 5px;
                    font-size: 14px;
                    line-height: 1.5;
                }
                .bilnap-box .version {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888;
                }
            </style>
            <div id="myWeChatUI">
                <button id="myWeChatButton">
                    <img src="https://yurayli.izday.top/iUpload/sysAvatar/6684c540d5b4e.jpg" alt="باش سۈرەت">
                </button>
            </div>
            <div id="myWeChatFrame">
                <h3>بىلنەپ ئۈندىدار سالون ياردەمچىسى</h3>
                <div class="tab-buttons">
                    <button class="tab-button active" data-tab="font-settings">خەت نۇسخىسى</button>
                    <button class="tab-button" data-tab="other-settings">تەڭشەك</button>
                </div>
                <div class="tab-content active" id="font-settings">
                    <p>خەت نۇسخىسى:</p>
                    <select id="fontSelector"></select>
                    <p>يېڭى خەت نۇسخىسى قوشۇش:</p>
                    <input type="text" id="newFontInput" placeholder="يېڭى خەت نۇسخىسىنىڭ ئىسمىنى كىرگۈزۈڭ">
                    <button id="addNewFontButton">قوشۇش</button>
                </div>
                <div class="tab-content" id="other-settings">
                    <h4>ئىشلىتىش قوللانمىسى</h4>
                    <div class="instructions">
                        <p>1. خەت نۇسخىسىنى ئۆزگەرتىش ئۈچۈن، "خەت نۇسخىسى" تەبىدىكى تىزىملىكتىن خالىغان خەت نۇسخىسىنى تاللاڭ.</p>
                        <p>2. يېڭى خەت نۇسخىسى قوشۇش ئۈچۈن، خەت نۇسخىسىنىڭ ئىسمىنى كىرگۈزۈپ "قوشۇش" كۇنۇپكىسىنى بېسىڭ.</p>
                        <p>3. قىستۇرمىنى يۆتكەش ئۈچۈن، يۇمىلاق كۇنۇپكىنى تۇتۇپ سۆرەڭ.</p>
                        <p>4. قىستۇرمىنى يوشۇرۇش ئۈچۈن، قارا تەگلىككە چېكىڭ.</p>
                    </div>
                    <div class="version">نۇسخا نومۇرى: 1.0</div>
                </div>
            </div>
            <div id="myWeChatOverlay"></div>
        `;
        document.body.appendChild(div);
    };

    // كۇنۇپكا ۋە رامكا فۇنكسىيەسىنى قوشۇش
    const setupUIInteractions = () => {
        const button = document.getElementById('myWeChatButton');
        const frame = document.getElementById('myWeChatFrame');
        const overlay = document.getElementById('myWeChatOverlay');
        const weChatUI = document.getElementById('myWeChatUI');
        let isFrameVisible = false;
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const startDragging = (e) => {
            if (e.target === button || e.target === button.querySelector('img')) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = weChatUI.offsetLeft;
                startTop = weChatUI.offsetTop;
                weChatUI.style.transition = 'none';
                e.preventDefault();
            }
        };

        const drag = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            let newLeft = startLeft + e.clientX - startX;
            let newTop = startTop + e.clientY - startY;
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - weChatUI.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - weChatUI.offsetHeight));
            weChatUI.style.left = newLeft + 'px';
            weChatUI.style.top = newTop + 'px';
            weChatUI.style.right = 'auto';
        };

        const stopDragging = () => {
            if (isDragging) {
                isDragging = false;
                weChatUI.style.transition = 'all 0.3s ease';
            }
        };

        weChatUI.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        button.addEventListener('click', (e) => {
            if (!isDragging) {
                isFrameVisible = !isFrameVisible;
                frame.style.display = isFrameVisible ? 'block' : 'none';
                overlay.style.display = isFrameVisible ? 'block' : 'none';
                button.style.transform = isFrameVisible ? 'scale(1.2)' : 'scale(1)';
            }
            e.stopPropagation();
        });

        overlay.addEventListener('click', () => {
            frame.style.display = 'none';
            overlay.style.display = 'none';
            button.style.transform = 'scale(1)';
            isFrameVisible = false;
        });

        // تەب ئالماشتۇرۇش
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });

        // خەت نۇسخىسى تاللاش
        document.getElementById('fontSelector').addEventListener('change', function() {
            const selectedFont = this.value;
            saveValue('currentFont', selectedFont);
            changeFonts(selectedFont);
            updateCSS(selectedFont);
        });

        // يېڭى خەت نۇسخىسى قوشۇش
        document.getElementById('addNewFontButton').addEventListener('click', function() {
            const newFont = document.getElementById('newFontInput').value.trim();
            if (newFont) {
                saveFont(newFont);
                document.getElementById('newFontInput').value = '';
                updateFontSelectors();
            }
        });
    };

    // iframe نى كۈتۈش ۋە كود قوشۇش
    const waitForIframeAndInject = () => {
        const checkInterval = setInterval(() => {
            const editorFrame = document.getElementById('ueditor_0');
            if (editorFrame && editorFrame.contentDocument && editorFrame.contentDocument.body) {
                clearInterval(checkInterval);
                const savedFont = getValue('currentFont', 'UKIJ Ekran');
                if (savedFont) {
                    changeFonts(savedFont);
                }
            }
        }, 100);
    };

    // يۆنىلىشنى تەڭشەش
    const setDirection = (direction) => {
        const editorFrame = document.getElementById('ueditor_0');
        if (editorFrame) {
            editorFrame.contentWindow.postMessage({
                action: 'setDirection',
                direction: direction
            }, '*');
        }
    };

    // يۆنىلىش كۇنۇپكىلىرىنى قوشۇش
    const addDirectionButtons = () => {
        const toolbar = document.querySelector('.edui-toolbar-primary');
        if (toolbar && !document.querySelector('.direction-buttons')) {
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'direction-buttons edui7474 edui-box edui-combox js_toolbar_more edui-for-more toolbar_more edui-default';
            buttonContainer.style.display = 'inline-block';
            buttonContainer.style.marginLeft = '10px';

            const createButton = (text, direction) => {
                const button = document.createElement('button');
                button.textContent = text;
                button.className = 'edui-button-body';
                button.style.cssText = `
                    display: inline-block;
                    padding: 5px 10px;
                    margin: 0 2px;
                    border: 1px solid #ccc;
                    background-color: #f7f7f7;
                    color: #333;
                    cursor: pointer;
                    border-radius: 3px;
                    font-size: 12px;
                    transition: all 0.3s ease;
                `;
                button.addEventListener('click', () => {
                    setDirection(direction);
                    button.style.backgroundColor = '#e6e6e6';
                    button.style.boxShadow = 'inset 0 3px 5px rgba(0,0,0,.125)';
                    setTimeout(() => {
                        button.style.backgroundColor = '#f7f7f7';
                        button.style.boxShadow = 'none';
                    }, 200);
                });
                button.addEventListener('mouseover', () => {
                    button.style.backgroundColor = '#e6e6e6';
                });
                button.addEventListener('mouseout', () => {
                    button.style.backgroundColor = '#f7f7f7';
                });
                return button;
            };

            const ltrButton = createButton('LTR', 'ltr');
            const rtlButton = createButton('RTL', 'rtl');

            buttonContainer.appendChild(ltrButton);
            buttonContainer.appendChild(rtlButton);
            toolbar.appendChild(buttonContainer);
        }
    };

    // iframe غا كود قوشۇش
    const injectIframeScript = () => {
        const editorFrame = document.getElementById('ueditor_0');
        if (editorFrame && editorFrame.contentDocument) {
            const script = editorFrame.contentDocument.createElement('script');
            script.textContent = `
                window.addEventListener('message', function(event) {
                    if (event.data && event.data.action === 'setDirection') {
                        const direction = event.data.direction;
                        const textAlign = direction === 'rtl' ? 'right' : 'left';
                        
                        // بارلىق ئېلېمېنتلارغا يۆنىلىش ۋە تېكىست توغرىلاش خاسلىقىنى قوللىنىش
                        const applyDirectionToElement = (element) => {
                            element.style.direction = direction;
                            element.style.textAlign = textAlign;
                            Array.from(element.children).forEach(applyDirectionToElement);
                        };
                        
                        applyDirectionToElement(document.body);
                        
                        window.parent.postMessage({
                            action: 'directionSet',
                            direction: direction
                        }, '*');
                    }
                });
            `;
            editorFrame.contentDocument.head.appendChild(script);
        }
    };

    // قۇرال ئىستونىنى كۆزىتىش
    const observeToolbar = () => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    addDirectionButtons();
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // يېڭى فۇنكسىيە: خەت نۇسخىسىنى دائىم تەكشۈرۈش ۋە يېڭىلاش
    const checkAndUpdateFonts = () => {
        const currentFont = getValue('currentFont', 'UKIJ Ekran');
        changeFonts(currentFont);
    };

    // CSS نى يېڭىلاش
    const updateCSS = (fontFamily) => {
        let style = document.getElementById('bilnap-custom-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'bilnap-custom-style';
            document.head.appendChild(style);
        }
        style.textContent = `
            * {
                font-family: ${fontFamily}, Arial, sans-serif !important;
            }
        `;
    };

    // ئاساسىي فۇنكسىيە
    const init = () => {
        createUI();
        setupUIInteractions();
        updateFontSelectors();
        const currentFont = getValue('currentFont', 'UKIJ Ekran');
        changeFonts(currentFont);
        updateCSS(currentFont);
        waitForIframeAndInject();
        observeToolbar();
        injectIframeScript();
        
        // ھەر 1000 مىللىسېكۇنتتا بىر قېتىم خەت نۇسخىسىنى تەكشۈرۈش ۋە يېڭىلاش
        setInterval(() => {
            const currentFont = getValue('currentFont', 'UKIJ Ekran');
            changeFonts(currentFont);
            updateCSS(currentFont);
        }, 1000);
    };

    // بەت يۈكلەنگەندە باشلاش
    window.addEventListener('load', init);
})();

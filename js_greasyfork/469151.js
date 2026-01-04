// ==UserScript==
// @name         Twitter畅享自由浏览推特
// @name:zh-CN   Twitter畅享自由浏览推特
// @name:zh-TW   Twitter暢享自由瀏覽推特
// @name:en      Twitter Enjoy the freedom to browse Twitter
// @namespace    Twitter-Pass-Tools
// @version      1.0.3
// @description  Twitter畅享自由浏览推特 - 您可以轻松解决推特访问问题。无论您身在何处，这款工具能够帮助您快速、稳定地访问推特，畅享全球动态，与世界分享您的想法和见解。不再受到地理限制，您将能够与全球用户交流互动，获取最新的新闻、趋势和内容。无需担心网络封锁和限制，立即体验畅快的推特浏览，与全球连接，发现更多精彩。
// @description:zh-CN  Twitter畅享自由浏览推特 - 您可以轻松解决推特访问问题。无论您身在何处，这款工具能够帮助您快速、稳定地访问推特，畅享全球动态，与世界分享您的想法和见解。不再受到地理限制，您将能够与全球用户交流互动，获取最新的新闻、趋势和内容。无需担心网络封锁和限制，立即体验畅快的推特浏览，与全球连接，发现更多精彩。
// @description:zh-TW  Twitter暢享自由瀏覽推特 - 您可以輕鬆解決推特訪問問題。無論您身在何處，這款工具能夠幫助您快速、穩定地訪問推特，暢享全球動態，與世界分享您的想法和見解。不再受到地理限制，您將能夠與全球用戶交流互動，獲取最新的新聞、趨勢和內容。無需擔心網絡封鎖和限制，立即體驗暢快的推特瀏覽，與全球連接，發現更多精彩。
// @description:en  Twitter Enjoy Free Browsing on Twitter - You can easily solve Twitter access problems. No matter where you are, this tool can help you quickly and stably access Twitter, enjoy global updates, and share your thoughts and insights with the world. No longer restricted by geography, you'll be able to connect with users around the world and get the latest news, trends and content.
// @author       Twitter-Pass-Tools
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwElEQVR4nO2YT4hPURTHr3PmmYU/oSQWdiLlX5KFUogyIvmz8Cf5t8SGrGQWiixFGqWI/Oac22gkZkWyU6SRKAsiJZphfr93zhsy+T2950emZqb3e/e9N5v3qbt7797zPefce889xpSUlJSUlJQkxNbmI+kFZH2NJAGy1oDlObKcMbd19ki/eBVZbFzATt1o2kNwmqQ9hMhIJBlC1nDEQSpAejj+/k7fFCR/O7A+QtKL6Re2XyYjaTXymov9SHJlVMN5+ACSZ8jy848o+WRsdYbDwtr2n4cuGxtis3OAld1JjcfhEen3rC41t6rTsVPWpRIAVo4M8w7L3aY8EoYTkORt88bLELB2AetjJP3qWVmUTgDLsREm/4hW1if5v4WCFam8z3+HfEcbbDFpQQo2j5qrLN2my18wpgNIDzgI6Gshf5VxIj4NVMYIdR1I7kVCTU/YmiiCSTczyy6TBY1zO8mitUbenkAra01XbR6w7E0dgU5/WyYCzI1wErK+ccvlNAJ0g7PtQLIHSPd5FV0GLL1FCvDSnjyj5jDJYGECSOpR5J0FRBdJ4anD8SX2ymQFsDwpXoR0ZCbAs8Hyf7VJcRFoM1mCJDsLE0Hab2w40WRNVBYAy9P8Bcg5kwdIwVa0uglJriHJj5yMHzSVYE5OAvRSAZv3vMkN689E1s85ps4Hc7N/an4Con1QCVYi67ccPP8raYnuTlSkkT7MUgBYPW2KJrofgLQdWB84ps716OVWuIBoUWA9iKQDTsbb5t/ZbvSErWB1P7C+cDC8DqSncvW8R7okSpMW8lej9XcA6UlguY+kvmPKvEOSNSZ3ugemIcvZRgctg2NSq7HXsyiTm6Iis4DkOLC+THXCsPQCydHIIWbcsf5CsHoISa7GZXbU84k7d1KP7weS93E7kKUjbhPawbnjbXJJSUlJSUmJyZHfxnHsrRJKPnUAAAAASUVORK5CYII=
// @resource     logo data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAACwElEQVR4nO2YT4hPURTHr3PmmYU/oSQWdiLlX5KFUogyIvmz8Cf5t8SGrGQWiixFGqWI/Oac22gkZkWyU6SRKAsiJZphfr93zhsy+T2950emZqb3e/e9N5v3qbt7797zPefce889xpSUlJSUlJQkxNbmI+kFZH2NJAGy1oDlObKcMbd19ki/eBVZbFzATt1o2kNwmqQ9hMhIJBlC1nDEQSpAejj+/k7fFCR/O7A+QtKL6Re2XyYjaTXymov9SHJlVMN5+ACSZ8jy848o+WRsdYbDwtr2n4cuGxtis3OAld1JjcfhEen3rC41t6rTsVPWpRIAVo4M8w7L3aY8EoYTkORt88bLELB2AetjJP3qWVmUTgDLsREm/4hW1if5v4WCFam8z3+HfEcbbDFpQQo2j5qrLN2my18wpgNIDzgI6Gshf5VxIj4NVMYIdR1I7kVCTU/YmiiCSTczyy6TBY1zO8mitUbenkAra01XbR6w7E0dgU5/WyYCzI1wErK+ccvlNAJ0g7PtQLIHSPd5FV0GLL1FCvDSnjyj5jDJYGECSOpR5J0FRBdJ4anD8SX2ymQFsDwpXoR0ZCbAs8Hyf7VJcRFoM1mCJDsLE0Hab2w40WRNVBYAy9P8Bcg5kwdIwVa0uglJriHJj5yMHzSVYE5OAvRSAZv3vMkN689E1s85ps4Hc7N/an4Con1QCVYi67ccPP8raYnuTlSkkT7MUgBYPW2KJrofgLQdWB84ps716OVWuIBoUWA9iKQDTsbb5t/ZbvSErWB1P7C+cDC8DqSncvW8R7okSpMW8lej9XcA6UlguY+kvmPKvEOSNSZ3ugemIcvZRgctg2NSq7HXsyiTm6Iis4DkOLC+THXCsPQCydHIIWbcsf5CsHoISa7GZXbU84k7d1KP7weS93E7kKUjbhPawbnjbXJJSUlJSUmJyZHfxnHsrRJKPnUAAAAASUVORK5CYII=
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @supportURL   http://letsmain.com/twitter-access-master?utm_source=greasy-fork-origin
// @include      *://twitter.com/*
// @include      *://*.twitter.com/*
// @include      *://t.co/*
// @include      *://*.t.co/*
// @compatible	 Edge
// @compatible	 Chrome
// @compatible	 Firefox
// @compatible	 Safari
// @compatible	 Opera
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceURL
// @grant        GM_download
// @grant        GM_setClipboard
// @run-at       document-start
// @antifeature  payment
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/469151/Twitter%E7%95%85%E4%BA%AB%E8%87%AA%E7%94%B1%E6%B5%8F%E8%A7%88%E6%8E%A8%E7%89%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/469151/Twitter%E7%95%85%E4%BA%AB%E8%87%AA%E7%94%B1%E6%B5%8F%E8%A7%88%E6%8E%A8%E7%89%B9.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    function createAccessHelperButton() {
        const button = $('<a>', {
            target: '_blank',
            text: 'Twitter Enjoy Assistant',
            href: 'http://letsmain.com/twitter-access-master?utm_source=greasy-fork-originate-from'
        }).css({
            position: 'fixed',
            top: getRandomTopPosition(),
            left: '0',
            backgroundColor: getRandomColor(),
            padding: '10px',
            borderRadius: '5px',
            zIndex: '99999'
        });
        $('body').append(button);
    }

    function getRandomColor() {
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        return color;
    }

    function getRandomTopPosition() {
        const top = Math.floor(Math.random() * (260 - 180 + 1) + 180) + 'px';
        return top;
    }

    GM_addStyle(`

    `);

    $(document).ready(function() {
        createAccessHelperButton();
    });

    function removeLoginBanners() {
        const elements = document.querySelectorAll('#layers>div');

        elements.forEach(element => {
            if (element.style.display === 'none') return;
        if (element.querySelector('[aria-label="关闭"], [aria-label="Close"], [data-testid="app-bar-close"]')) return;

        if (element.querySelector('input, [data-testid="TopNavBar"]')) {
            const loginBanner = element.querySelector('[href="/login"]')?.closest('[data-testid="twitter-logged-out-nav"]>div');
            if (loginBanner && loginBanner.style.display !== 'none') {
                loginBanner.style.display = 'none';
                console.info('Navbar login banner:', element);
            }
            return;
        }

        if (element.querySelector('[href="/login"]')) {
            element.style.display = 'none';
            console.info('Bottom login banner:', element);
            return;
        }

        if (element.querySelector('[href="/signup"]')) {
            element.style.display = 'none';
            console.info('Cover login wall:', element);
            return;
        }

        const buttons = element.querySelectorAll('[role="button"]');

        for (const button of buttons) {
            if (['Log in', 'Sign up', '登录', '注册'].includes(button.innerText)) {
                element.style.display = 'none';
                console.info('Cover login wall:', element);
                return;
            }
        }
    });
}

new MutationObserver(removeLoginBanners).observe(document, { subtree: true, childList: true });

function DOMContentLoaded() {
    removeLoginBanners();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', DOMContentLoaded);
} else {
    DOMContentLoaded();
}

const style = document.createElement('style');
style.textContent = `/* Global style */
html { overflow-y: scroll !important; } /* Scroll fix */
#credential_picker_container { display: none !important; } /* Float Google login */
/* #layers */
[data-testid="BottomBar"] { display: none !important; } /* Bottom login banner */
[data-testid="twitter-logged-out-nav"] { height: auto !important; } /* NavBar fix */
`;

if (document.head) {
    document.head.append(style);
} else {
    new MutationObserver((mutationList, observer) => {
        if (document.head) {
            observer.disconnect();
            document.head.append(style);
        }
    }).observe(document, { subtree: true, childList: true });
}

let isDragToSwitchEnabled = GM_getValue('isDragToSwitchEnabled', false);
GM_registerMenuCommand('Enable Drag to Switch Images', () => {
    isDragToSwitchEnabled = confirm(`Do you want to enable drag to switch images?
    Current: ${isDragToSwitchEnabled ? 'Enabled' : 'Disabled'}

    Please refresh to take effect after modification.`);
    GM_setValue('isDragToSwitchEnabled', isDragToSwitchEnabled);
});

if (isDragToSwitchEnabled) {
    GM_addStyle('img{-webkit-user-drag:none}');
}

const buttonLabels = {};
try {
    const labelMappings = {
        af8fa2ad: 'close',
        af8fa2ae: 'close',
        c4d53ba2: 'prev',
        d70740d9: 'next',
        d70740da: 'next',
    };
    const i18nModule = webpackChunk_twitter_responsive_web.find(module => {
            const [[name]] = module;
    return name.startsWith('i18n');
});
Object.values(i18nModule[1]).forEach(fn => {
    if (fn.length < 3) return;
try {
    fn(undefined, undefined, () => ({
        _register: () => (key, value) => {
        if (key in labelMappings) buttonLabels[labelMappings[key]] = value;
},
}));
} catch (e) {}
});
} catch (error) {
    console.error(error);
}

const getButtonByLabel = label =>
document.querySelector(`div[aria-labelledby="modal-header"] div[aria-label="${label}"]`);
const clickButton = name => {
    const button = getButtonByLabel(buttonLabels[name]);
    if (button) {
        button.click();
        return true;
    }
    return false;
};

const closeImageView = () => clickButton('close');
const prevImage = () => clickButton('prev');
const nextImage = () => clickButton('next');

window.addEventListener('wheel', ({ deltaY, target: { tagName, baseURI } }) => {
    if (tagName === 'IMG' && /\/photo\//.test(baseURI)) {
    if (deltaY < 0) prevImage();
    else if (deltaY > 0) nextImage();
}
});

if (isDragToSwitchEnabled) {
    let startX = 0;
    let startY = 0;
    window.addEventListener('mousedown', ({ clientX, clientY }) => {
        startX = clientX;
    startY = clientY;
});
window.addEventListener('mouseup', ({ button, clientX, clientY, target: { tagName, baseURI } }) => {
    if (button !== 0 || !(tagName === 'IMG' && /\/photo\//.test(baseURI))) return;
const [diffX, diffY] = [clientX - startX, clientY - startY].map(Math.abs);
const moveX = clientX - startX;
if (diffX <= 10 && diffY <= 10) closeImageView();
if (diffY <= diffX) {
    if (moveX > 0) prevImage();
    else if (moveX < 0) nextImage();
}
});
} else {
    document.addEventListener(
        'click',
        e => {
        const {
            target: { tagName, baseURI },
            } = e;
    if (!(tagName === 'IMG' && /\/photo\//.test(baseURI))) return;
    closeImageView();
    e.stopPropagation();
},
{ capture: true }
);
}

})(window.jQuery);






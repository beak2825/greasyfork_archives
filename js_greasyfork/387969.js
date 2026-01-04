// ==UserScript==
// @name        Twitterᴾˡᵘˢ
// @name:zh-TW  Twitterᴾˡᵘˢ
// @name:zh-CN  Twitterᴾˡᵘˢ
// @name:ja     Twitterᴾˡᵘˢ
// @namespace   https://github.com/Pixmi/twitter-plus
// @version     0.4.8
// @description         Enhance the X(Twitter) user experience. View original quality images and customize the removal of spam tweets.
// @description:zh-TW   增強 X(Twitter) 使用體驗。讀取原始畫質圖片、自定義移除垃圾推文。
// @description:zh-CN   增强 X(Twitter) 使用体验。读取原始画质图片、自定义移除垃圾推文。
// @description:ja      X（Twitter）のユーザー体験を向上させる。オリジナル品質の画像を表示し、スパムツイートの削除をカスタマイズする。
// @author      Pixmi
// @homepage    https://github.com/Pixmi/twitter-plus
// @supportURL  https://github.com/Pixmi/twitter-plus/issues
// @icon        https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @match       https://x.com/*
// @match       https://twitter.com/*
// @match       https://mobile.twitter.com/*
// @match       https://pbs.twimg.com/media/*
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @license     MPL-2.0
// @noframes
// @compatible  Chrome
// @compatible  Firefox
// @downloadURL https://update.greasyfork.org/scripts/387969/Twitter%E1%B4%BE%CB%A1%E1%B5%98%CB%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/387969/Twitter%E1%B4%BE%CB%A1%E1%B5%98%CB%A2.meta.js
// ==/UserScript==

GM_addStyle(`
iframe#twitter_plus_setting {
    max-width: 300px !important;
    max-height: 300px !important;
}`);

(function () {
    'use strict';

    const getOriginUrl = (imgUrl) => {
        let match = imgUrl.match(/https:\/\/(pbs\.twimg\.com\/media\/[a-zA-Z0-9\-\_]+)(\?format=|.)(jpg|jpeg|png|webp)/);
        if (!match) return false;
        // webp change to jpg
        if (match[3] == 'webp') match[3] = 'jpg';
        // change it to obtain the original quality.
        if (match[2] == '?format=' || !/name=orig/.test(imgUrl)) {
            return `https://${match[1]}.${match[3]}?name=orig`
        } else {
            return false;
        }
    }
    const URL = window.location.href;
    // browsing an image URL
    if (URL.includes('twimg.com')) {
        let originUrl = getOriginUrl(URL);
        if (originUrl) window.location.replace(originUrl);
    }
    // if browsing tweets, activate the observer.
    if (URL.includes('twitter.com') || URL.includes('x.com')) {
        const rootmatch = document.evaluate('//div[@id="react-root"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const rootnode = rootmatch.singleNodeValue;
        if (!rootnode) return false;
        const MAX_HASHTAGS = GM_getValue('MAX_HASHTAGS', 20);
        const OUT_HASHTAGS = GM_getValue('OUT_HASHTAGS', '#tag1,#tag2').split(',');
        const checkElement = (ele) => {
            return [
                ele.dataset.testid == 'tweet',
                ele.dataset.testid == 'tweetPhoto',
                ele.className == 'css-175oi2r r-1pi2tsx r-u8s1d r-13qz1uu',
            ].some(item => item);
        };
        const callback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {
                const target = mutation.target;
                if (!checkElement(target)) continue;
                if (target.nodeName == 'ARTICLE') {
                    try {
                        const hashtags = Array.from(target.querySelectorAll('a[href^="/hashtag/"]'), tag => tag.textContent);
                        // exceeding the numbers of hashtags.
                        if (hashtags.length >= MAX_HASHTAGS) throw target;
                        // containing specified hashtags.
                        if (hashtags.some(tag => OUT_HASHTAGS.find(item => item == tag))) throw target;
                    } catch (e) {
                        if (e instanceof HTMLElement) e.closest('div[data-testid="cellInnerDiv"]').style.display = 'none';
                        continue;
                    }
                }
                // tweets image
                for (const image of target.querySelectorAll('img')) {
                    let originUrl = getOriginUrl(image.src);
                    if (originUrl) image.src = originUrl;
                }
            }
        };
        const observer = new MutationObserver(callback);
        // start observe
        observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    }
})();

GM_registerMenuCommand('Setting', () => config.open());

const config = new GM_config({
    'id': 'twitter_plus_setting',
    'css': `
        #twitter_plus_setting_wrapper {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        #twitter_plus_setting_section_0 {
            flex: 1;
        }
        #twitter_plus_setting_buttons_holder {
            text-align: center;
        }
        .config_var {
            display: flex;
            flex-direction: column;
            margin-bottom: 1rem !important;
        }
    `,
    'title': 'Remove Spam',
    'fields': {
        'MAX_HASHTAGS': {
            'label': 'When exceeding how many hashtags?',
            'type': 'number',
            'title': 'input 0 to disable',
            'min': 0,
            'max': 100,
            'default': 20,
        },
        'OUT_HASHTAGS': {
            'label': 'When containing which hashtags?',
            'type': 'textarea',
            'title': 'Must include # and separated by commas.',
            'default': '#tag1,#tag2',
        }
    },
    'events': {
        'init': () => {
            config.set('MAX_HASHTAGS', GM_getValue('MAX_HASHTAGS', 20));
            config.set('OUT_HASHTAGS', GM_getValue('OUT_HASHTAGS', '#tag1,#tag2'));
        },
        'save': () => {
            GM_setValue('OUT_HASHTAGS', config.get('OUT_HASHTAGS'));
            GM_setValue('MAX_HASHTAGS', config.get('MAX_HASHTAGS'));
            config.close();
        }
    }
});
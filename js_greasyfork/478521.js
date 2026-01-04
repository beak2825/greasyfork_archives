// ==UserScript==
// @name            Luogu Feed: Show hidden link
// @namespace       https://imken.link/lfshl
// @version         0.1.8.1
// @description     Luogu Feed hidden link display tool with keyword highlight.
// @author          Imken Luo
// @match           https://www.luogu.com.cn/
// @match           https://www.luogu.com.cn/?*
// @icon            https://www.luogu.com.cn/favicon.ico
// @license         GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/478521/Luogu%20Feed%3A%20Show%20hidden%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/478521/Luogu%20Feed%3A%20Show%20hidden%20link.meta.js
// ==/UserScript==

//// *请注意，更新之前请备份您自定义的关键词列表！！！* ////
//// *请注意，更新之前请备份您自定义的关键词列表！！！* ////
//// *请注意，更新之前请备份您自定义的关键词列表！！！* ////
const keywordMap = {
    'BV1GJ411x7h7': 'RickRoll',
    'BV1va411w7aM': 'RickRoll',
    'BV1BP4y1G78b': 'RickRoll',
    'BV1mu411U7GU': 'RickRoll',
    'BV1Px411w7FH': 'RickRoll',
    'BV1Ti4y1f7td': 'RickRoll',
    'av156766': 'RickRoll',
    'id=5221167': 'RickRoll', //  Netease Music
    'milime.top': 'RickRoll',
    'rrHrxMt': 'RickRoll',
    '192d9a98d782d9c74c96f09db9378d93.mp4': 'RickRoll',
};

// 将字符串转换为合法的类名
function toValidClassName(str) {
    str = str.replace(/[^a-zA-Z0-9_-]/g, '-');
    if (/^\d/.test(str)) {
        str = '-' + str;
    }
    return str;
}

// 生成需要的 CSS
function genCSS(keywordMap) {
    let res = ''
    res += `.ass-warn::after {
        background-color: yellow;
        font-family: monospace;
        color: red;
        margin-left: 0.25em;
    }`;
    res += `.ass-unmatch::after {
        content: '[Warn: 链接不匹配]';
    }`;
    for (let i in keywordMap) {
        res += `.${toValidClassName(`ass-${i}`)}::after {
            content: '[Warn: ${keywordMap[i]}]';
        }`;
    }
    return res;
}

// 将 CSS 注入到网页
function addCSS(css) {
    let style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
}

const linkTextRegex = /^(https?:\/\/)?([a-z0-9-]+\.){1,}[a-z]{2,}(\/.*)?$/i;

// 去除字符串末尾的斜杠
function removeTrailingSlash(str) {
    return str.replace(/\/$/, '');
}

// 判断字符串是否看起来像一个链接
function isLinkLike(str) {
    return linkTextRegex.test(str);
}


(function() {
    // 选择需要观察变动的节点
    const targetNode = document.getElementById('feed');
    if (targetNode) {

        addCSS(genCSS(keywordMap));

        // 观察器的配置（需要观察什么变动）
        const config = { attributes: false, childList: true, subtree: false };

        // 当观察到变动时执行的回调函数
        const callback = function(mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 选择所有犇犇下的文字
                    const urlElements = document.querySelectorAll('.feed-comment p');

                    // 遍历每一个元素
                    for (let i in urlElements) {
                        if (urlElements[i].innerHTML && !urlElements[i].getAttribute('vist')) {
                            urlElements[i].setAttribute('vist', '1');
                            // 正则表达式替换
                            urlElements[i].innerHTML = urlElements[i].innerHTML.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>(\s*|&nbsp;)<\/a>/g, function(match, href) {
                                // 替换为内容为 href 的 <span> 标签
                                return '<span style="background-color: black; color: white;">' + decodeURIComponent(href) + '</span>';
                            });
                        }
                    }

                    // 获取所有图片元素
                    const imgElements = document.querySelectorAll('.feed-comment img');

                    // 遍历每个图片元素
                    for (let i in imgElements) {
                        if (imgElements[i].getAttribute && !imgElements[i].getAttribute('vist')) {
                            let altText = imgElements[i].getAttribute('alt');
                            let src = imgElements[i].getAttribute('src');
                            let title = imgElements[i].getAttribute('title');
                            let newAltText = altText + ' | ' + src + (title ? ' | ' + title : '');
                            src = decodeURIComponent(src);
                            imgElements[i].setAttribute('alt', newAltText);
                            imgElements[i].setAttribute('style', 'background: gray; color: white;');
                            imgElements[i].setAttribute('vist', '1');
                        }
                    }

                    const linkElements = document.querySelectorAll('.feed-comment p a');
                    for (let i in linkElements) {
                        if (!linkElements[i].href) break;
                        if (linkElements[i].getAttribute('vist')) continue;
                        let link = linkElements[i].getAttribute('href');
                        let text = linkElements[i].innerText;
                        let isKeywordMatched = 0;
                        for (let keyword in keywordMap) {
                            if (link.includes(keyword)) {
                                linkElements[i].classList.add('ass-warn');
                                linkElements[i].classList.add(toValidClassName(`ass-${keyword}`));
                                linkElements[i].style['background-color'] = 'yellow';
                                isKeywordMatched = 1;
                                break;
                            }
                        }

                        // 去除链接文字和 href 末尾的斜杠
                        var cleanedText = removeTrailingSlash(text);
                        var cleanedHref = removeTrailingSlash(link);

                        // 检查链接文字和 href（去除末尾斜杠后）是否不同，并且链接文字看起来是一个链接
                        if (!isKeywordMatched && cleanedText !== cleanedHref && isLinkLike(cleanedText)) {
                            linkElements[i].classList.add("ass-warn");
                            linkElements[i].classList.add("ass-unmatch");
                            linkElements[i].style['background-color'] = 'yellow';
                        }
                        linkElements[i].setAttribute('vist', '1');
                    }
                }
            }
        };
        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(callback);

        // 以上述配置开始观察目标节点
        observer.observe(targetNode, config);
    }
})();

/// It's end. That's it.

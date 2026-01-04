// ==UserScript==
// @name         咱猫之全部变成小南娘Plus！
// @namespace    https://penyo.ru/
// @version      1.0.9.1
// @description  喵喵喵
// @author       xia
// @match        *://*/*
// @exclude      *://greasyfork.org/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/521636/%E5%92%B1%E7%8C%AB%E4%B9%8B%E5%85%A8%E9%83%A8%E5%8F%98%E6%88%90%E5%B0%8F%E5%8D%97%E5%A8%98Plus%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/521636/%E5%92%B1%E7%8C%AB%E4%B9%8B%E5%85%A8%E9%83%A8%E5%8F%98%E6%88%90%E5%B0%8F%E5%8D%97%E5%A8%98Plus%EF%BC%81.meta.js
// ==/UserScript==

/**
 * 是否影响输入框
 *
 * 警告！除非你知道改动此项会引发什么结果，否则不应改动！
 */
const affectInput = true;

(function () {
    "use strict";

    const blacklist = [
        'runjs.app',
    ];
    const currentHost = window.location.hostname;
    if (blacklist.includes(currentHost)) {
        return;
    }

    // ctm requestIdleCallback
    let deadlineTime;
    let callback = [];
    let channel = new MessageChannel();
    let port1 = channel.port1;
    let port2 = channel.port2;
    port2.onmessage = () => {
        const timeRemaining = () => deadlineTime - performance.now();
        const _timeRemain = timeRemaining();
        if (_timeRemain > 0 && callback.length) {
            const deadline = {
                timeRemaining,
                didTimeout: _timeRemain < 0
            };
            let callbackList = [...callback];
            callback = [];
            callbackList.forEach(cb => cb(deadline));
        }
        requestAnimationFrame(rafTime => {
            deadlineTime = rafTime + 16.667;
            port1.postMessage(null);
        });
    };
    function ctmRequestIdleCallback(cb) {
        requestAnimationFrame(rafTime => {
            deadlineTime = rafTime + 16.667;
            port1.postMessage(null);
        });
        callback.push(cb);
    }

    let replacementHistory = {};
    const elementToMatch = [
        "title",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "article",
        "section",
        "blockquote",
        "li",
        "a",
        "CC",
        "span.ProfileHeader-name",
        "span.AuthorInfo-name",
        "span.bili-rich-text-module.at",
        "span.bili-dyn-title__text",
        "span.u_username_title",
        "span.userinfo_username",
        "span.lzl_content_main",
        "div.bili-danmaku-x-dm",
        "div.CommentContent"
    ];

    /**
     * @param {Element} root
     */
    function replace(root) {
        const replacer = (str) => {
            let rep = str
                .replace(/我们/g, "咱喵和其它猫猫们")
                .replace(/他|同事/g, "其它猫猫")
                .replace(/大家/g, "各位猫猫们")
                .replace(/手指/g, "猫爪")
                .replace(/手/g, "爪")
                .replace(/他妈的/g, "他爹的")
                .replace(/哈哈/g, "嗯哼")
                .replace(/(爸爸|妈妈)([\u4e00-\u9fff_a-zA-Z])/g, (match, $1, $2) => {
                    if ($2 === '猫') return $1 + $2;
                    return $1 + '猫' + $2;
                })
                .replace(/^个人|\s个人|本人|我个人|(?<!自|本)我|(?<=[\u3002\uff1b\uff0c\u3001\uff1a\uff1f！?,.])个人|个人(?=[认感觉])/g, (match) => {
                    return Math.random() < 0.85 ? "咱喵" : "老娘";
                })
                .replace(/个/g, "只")
                .replace(/你们/g, "汝等")
                .replace(/你|您/g, "汝")
                .replace(/用户|(?<![每个只])人(?![类员民才口])/g, (match) => {
                    return Math.random() < 0.7 ? "猫猫" : "顺÷";
                })
                .replace(/孝子|xz|卫兵|小丑|资本|水军|困难|苦难|挫折|海军|二游|节奏/g, "杂鱼")
                .replace(/工作|编程|实习|面试|考研|拧螺丝|计算机|技术|恋爱|溜冰|爆改|白嫖|洗白|抄袭|借鉴|退坑|干活|好似/g, "援交")
                .replace(
                    /([也矣兮乎者焉哉]|[啊吗呢吧哇呀哦嘛喔咯呜捏])([ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~\u3000-\u303F\uFF00-\uFFEF]|$)/g,
                    (_, $1, $2) => `喵${orophilia()}${$2}`
                )
                .replace(
                    /([的了辣])([!"#$%&'()*+,-./:;/,=>?@[\]^_`{|}~\u3000-\u303F\uFF00-\uFFEF]|\s+(?!<|\w)|$)/g,
                    (_, $1, $2) => `${$1}喵${orophilia()}${$2}`
                )
                .replace(/([\u4e00-\u9fff_a-zA-Z])([\u4e00-\u9fff_a-zA-Z])([\uff0c,])/g, (match, $1, $2, $3) => {
                    const key = $1 + $2 + $3;
                    if (!replacementHistory[key]) {
                        replacementHistory[key] = Math.random();
                        const r = replacementHistory[key];
                        let res = $1 + $2;
                        if ($2 !== "喵" && $2 !== "す" && $2 !== "说" && $2 !== "哦" && $2 !== "w" && $2 !== "💗" && $2 !== "啊") {
                            res += r < 0.2 ? '喵' :
                                r < 0.3 ? '的说' :
                                    r < 0.45 ? '哦' :
                                        '';
                        } else {
                            return key;
                        }
                        res += r < 0.09 ? '💗' :
                            r < 0.18 ? '💗💗' :
                                r < 0.27 ? 'w' :
                                    r < 0.36 ? 'ww' :
                                        '';
                        return res + $3;
                    } else {
                        return key;
                    }
                })
                .replace(/([\u4e00-\u9fff_a-zA-Z])([\u4e00-\u9fff_a-zA-Z])([\u3002\uff1b\uff1f.?])$/g, (match, $1, $2, $3) => {
                    const key = $1 + $2 + $3;
                    if (!replacementHistory[key]) {
                        replacementHistory[key] = Math.random();
                    }
                    const r = replacementHistory[key];
                    let res = $1 + $2;
                    if ($2 !== "喵" && $2 !== "す") {
                        res += r < 0.75 ? '喵' : '';
                    }
                    res += r < 0.18 ? '💗' :
                        r < 0.27 ? '💗💗' :
                            r < 0.38 ? '~' :
                                r < 0.48 ? 'w' :
                                    r < 0.55 ? 'ww' :
                                        r < 0.62 ? '~~' :
                                            $3;
                    return res;
                })
                .replace(/([\u4e00-\u9fff_a-zA-Z])([\u4e00-\u9fff_a-zA-Z])([\u3002\uff1b\uff1f.?])([“”""])$/g, (match, $1, $2, $3, $4) => {
                    const key = match;
                    if (!replacementHistory[key]) {
                        replacementHistory[key] = Math.random();
                    }
                    const r = replacementHistory[key];
                    let res = $1 + $2;
                    if ($2 !== "喵" && $2 !== "す") {
                        res += r < 0.75 ? '喵' : '';
                    }
                    res += r < 0.18 ? '💗' :
                        r < 0.27 ? '💗💗' :
                            r < 0.38 ? '~' :
                                r < 0.48 ? 'w' :
                                    r < 0.55 ? 'ww' :
                                        r < 0.62 ? '~~' :
                                            $3;
                    res += $4;
                    return res;
                });
            if (str.length > 12) {
                rep = rep
                    .replace(/([\u4e00-\u9fa5])$/, (match) => {
                        if (match !== '喵' && match !== "す") {
                            const r = Math.random();
                            let res = match;
                            res += Math.random() < 0.8 ? '喵' : '';
                            res += r < 0.18 ? '💗' :
                                r < 0.27 ? '💗💗' :
                                    r < 0.38 ? '~' :
                                        r < 0.48 ? 'w' :
                                            r < 0.55 ? 'ww' :
                                                r < 0.62 ? '~~' :
                                                    '';
                            return res;
                        }
                        else {
                            return match;
                        }
                    })
                    .replace(/^[\u4e00-\u9fff_a-zA-Z]{2}/, (match) => {
                        if (match !== '咱喵' && !replacementHistory[match]) {
                            replacementHistory[match] = Math.random();
                            const r = replacementHistory[match];
                            return (r < 0.05 ? '咱喵就是说啊，' :
                                r < 0.1 ? '咱喵就是说，' :
                                    r < 0.15 ? '咱喵觉得' :
                                        '') + match;
                        } else {
                            return match;
                        }
                    })
            }

            return rep;
        };

        const orophilia = () => (Math.random() < 0.2 ? "です" : "");


        function insertEmojiImg(element, where, emoji, specialStyle = {}) {
            let emojiImg = document.createElement('img');
            emojiImg.src = `https://emojicdn.elk.sh/${emoji}?style=apple`;
            emojiImg.style.height = '1.2em';
            emojiImg.style.verticalAlign = 'sub';
            if (where === 'afterbegin') {
                emojiImg.style.marginRight = '1.5px';
            }
            if (where === 'beforeend') {
                emojiImg.style.marginLeft = '1.5px';
            }
            for (let style in specialStyle) {
                emojiImg.style[style] = specialStyle[style];
            }
            element.insertAdjacentElement(where, emojiImg);
        }

        let cb = () => {
            // 如果有选中的文本，则不进行替换
            if (window.getSelection().toString()) return;

            root
                .querySelectorAll(
                    elementToMatch
                        .concat(elementToMatch.map((name) => name + " *"))
                        .concat(affectInput ? ["input"] : [])
                        .join(",")
                )
                .forEach((candidate) => {
                    if (candidate.nodeName == "INPUT") {
                        candidate.value = replacer(candidate.value);
                    } else if (
                        candidate.textContent &&
                        candidate.textContent == candidate.innerHTML.trim()
                    ) {
                        candidate.textContent = replacer(candidate.textContent);
                    } else if (
                        Array.from(candidate.childNodes).filter((c) => c.nodeName == "BR")
                    ) {
                        Array.from(candidate.childNodes).forEach((maybeText) => {
                            if (maybeText.nodeType == Node.TEXT_NODE) {
                                maybeText.textContent = replacer(maybeText.textContent);
                            }
                        });
                    }
                });

            // 昵称添加emoji
            // 知乎
            root.querySelectorAll('span.ProfileHeader-name:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('a.css-10u695f:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('span.AuthorInfo-name > div > a.UserLink-link[data-za-detail-view-element_name="User"]:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });

            // bilibili
            root.querySelectorAll('div.opus-module-author__name:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('div#user-name > a:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('div.nickname:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('p#contents > a[data-user-profile-id]:not([name-modified])')
                .forEach((element) => {
                    let textNode = element.firstChild;
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.insertAdjacentText('afterbegin', '@');
                    textNode.nodeValue = textNode.nodeValue.replace('@', '');
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('a.bili-user-profile-view__info__uname:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬', { marginRight: '-1.5px' });
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞', { marginLeft: '-3px' });
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('span.bili-rich-text-module.at:not([name-modified])')
                .forEach((element) => {
                    let textNode = element.firstChild;
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞', { marginLeft: '0px' });
                    element.insertAdjacentText('afterbegin', '@');
                    textNode.nodeValue = textNode.nodeValue.replace('@', '');
                    if (textNode.nodeValue.endsWith('：')) {
                        element.insertAdjacentText('beforeend', '：');
                        textNode.nodeValue = textNode.nodeValue.replace('：', '');
                    }
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('a.nickname-item:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('span.bili-dyn-title__text:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬', { marginRight: '-3px' });
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞', { marginLeft: '-4.5px' });
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('a.up-name:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬', { marginRight: '-3px' });
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
            // 贴吧
            root.querySelectorAll('a.p_author_name:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('span.u_username_title:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('span.userinfo_username:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('div.lzl_cnt > a.j_user_card:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
            root.querySelectorAll('span.lzl_content_main > a.j_user_card:not([name-modified])')
                .forEach((element) => {
                    insertEmojiImg(element, 'afterbegin', '🍬');
                    insertEmojiImg(element, 'afterbegin', '🏳️‍⚧️');
                    insertEmojiImg(element, 'beforeend', '🥞');
                    element.setAttribute('name-modified', 'true');
                });
        };
        if (!window.requestIdleCallback) {
            ctmRequestIdleCallback(cb);
        } else {
            window.requestIdleCallback(cb);
        }
    }

    /**
     * @param {Element} root
     */
    async function afterDomLoaded(root) {
        if (!root) return;

        const fn = () => {
            replace(root);

            root.querySelectorAll("*").forEach(async (node) => {
                if (node.shadowRoot) {
                    await afterDomLoaded(node.shadowRoot);
                }
            });
        };

        while (document.readyState == "loading") {
            await new Promise((r) => setTimeout(r, 1000));
        }
        fn();
    }

    afterDomLoaded(document);
    setInterval(() => afterDomLoaded(document), 2500);
})();

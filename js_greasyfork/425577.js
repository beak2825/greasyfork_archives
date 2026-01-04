// ==UserScript==
// @name        ニコニコ大百科掲示板 あぼーん拡張
// @description ニコニコ大百科掲示板に NGID ボタンを追加します
// @namespace   https://gitlab.com/sigsign
// @version     0.2.3
// @author      Sigsign
// @license     MIT or Apache-2.0
// @include     https://dic.nicovideo.jp/a/*
// @include     https://dic.nicovideo.jp/b/a/*
// @include     https://dic.nicovideo.jp/t/a/*
// @include     https://dic.nicovideo.jp/t/b/a/*
// @include     /https:\/\/dic\.nicovideo\.jp(\/t)?(\/b)?\/[alviu]/
// @include     https://dic.nicovideo.jp/m/n/res/*
// @run-at      document-start
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/425577/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E6%8E%B2%E7%A4%BA%E6%9D%BF%20%E3%81%82%E3%81%BC%E3%83%BC%E3%82%93%E6%8B%A1%E5%BC%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/425577/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E6%8E%B2%E7%A4%BA%E6%9D%BF%20%E3%81%82%E3%81%BC%E3%83%BC%E3%82%93%E6%8B%A1%E5%BC%B5.meta.js
// ==/UserScript==
(function () {
'use strict';

const getDesktopComments = (body) => {
    return Array.from(body.querySelectorAll('.st-bbs-contents > dl > dt.st-bbs_reshead'));
};
const getDesktopCommentInfo = (comment) => {
    const info = comment.querySelector('.st-bbs_resInfo');
    if (!info) {
        return null;
    }
    const text = info.lastChild;
    if (!text || text.nodeType !== text.TEXT_NODE || !text.textContent) {
        return null;
    }
    return text.textContent.replace(/\s+/g, ' ').trim();
};

const getMobileComments = (body) => {
    return Array.from(body.querySelectorAll('ul.sw-Article_List > li'));
};
const getMobileCommentInfo = (comment) => {
    const info = comment.querySelector('.at-List_Date');
    return info ? info.textContent : null;
};

const getComments = (body) => {
    const fn = body.querySelector('ul.sw-Article_List')
        ? getMobileComments
        : getDesktopComments;
    return fn(body);
};
const getCommentInfo = (comment) => {
    const fn = comment.tagName.toLowerCase() === 'li'
        ? getMobileCommentInfo
        : getDesktopCommentInfo;
    return fn(comment);
};
const getCommentID = (comment) => {
    const info = getCommentInfo(comment);
    if (!info) {
        return null;
    }
    const re = / ID: ([^\s]+)$/;
    const match = re.exec(info);
    return match ? match[1] : null;
};

const addButton = (elm, list) => {
    const exists = elm.querySelector(".us-NGButton");
    if (exists) {
        return exists;
    }
    const button = document.createElement('span');
    button.classList.add("us-NGButton");
    const id = getCommentID(elm);
    if (!id) {
        return button;
    }
    button.addEventListener('click', () => {
        list.contains(id).then((exists) => {
            exists ? list.remove(id) : list.add(id);
        });
    });
    button.dispose = list.on((value) => {
        value.includes(id)
            ? elm.classList.add("us-NGID")
            : elm.classList.remove("us-NGID", "us-NGView");
    });
    list.contains(id).then((exists) => {
        if (exists) {
            requestAnimationFrame(() => {
                elm.classList.add("us-NGID");
            });
        }
    });
    setupTemporaryDisplay(elm);
    requestAnimationFrame(() => {
        elm.tagName.toLowerCase() === 'li'
            ? elm.insertBefore(button, elm.querySelector('.at-List_Text'))
            : elm.appendChild(button);
    });
    return button;
};
const addDesktopReloadButton = (body) => {
    const link = body.querySelector('.st-bbs-contents .st-pg_contents :last-child');
    if (!link || !link.classList.contains('current')) {
        return null;
    }
    const pager = body.querySelector('.st-bbs-contents > div:nth-last-child(3)');
    if (!pager) {
        return null;
    }
    const parent = pager.parentElement;
    if (!parent) {
        return null;
    }
    const button = document.createElement('div');
    button.classList.add("us-Reload");
    parent.insertBefore(button, pager);
    return button;
};
const addMobileReloadButton = (body) => {
    if (body.querySelector('.sw-Paging .sw-Paging_Next-nextbtn a')) {
        return null;
    }
    const board = body.querySelector('ul.sw-Article_List');
    if (!board) {
        return null;
    }
    const button = document.createElement('li');
    button.classList.add("us-Reload");
    board.appendChild(button);
    return button;
};
const setupTemporaryDisplay = (elm) => {
    const selector = elm.tagName.toLowerCase() === 'li' ? '.at-List_Name' : '.st-bbs_name';
    const name = elm.querySelector(selector);
    if (!name) {
        return;
    }
    name.addEventListener('click', () => {
        if (!elm.classList.contains("us-NGID")) {
            return;
        }
        elm.classList.contains("us-NGView")
            ? elm.classList.remove("us-NGView")
            : elm.classList.add("us-NGView");
    });
};

const normalizePathname = (pathname) => {
    const re = /^(\/t)?(\/b)?(\/[alcviu]\/[^/]+)/;
    const matches = re.exec(pathname);
    if (!matches) {
        return '';
    }
    return matches[3];
};

const lazyLoadContents = (body, options) => {
    const loadContents = (content) => {
        if (content.dataset.src) {
            content.setAttribute('src', content.dataset.src);
        }
    };
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                loadContents(entry.target);
            }
        }
    }, options);
    const contents = body.querySelectorAll('.lazy-contents');
    for (const content of contents) {
        if ('loading' in content) {
            content.loading = 'lazy';
            loadContents(content);
        }
        else {
            observer.observe(content);
        }
    }
};
const lazyLoadIframes = (body, options) => {
    const loadIframe = (iframe) => {
        if (iframe.contentWindow && iframe.dataset.src) {
            iframe.contentWindow.location.replace(iframe.dataset.src);
        }
    };
    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                loadIframe(entry.target);
            }
        }
    }, options);
    const iframes = body.querySelectorAll('.lazy-contents-iframe');
    for (const iframe of iframes) {
        observer.observe(iframe);
    }
};

const getBoard = (body) => {
    const selector = body.querySelector('.sw-Article_List')
        ? '.sw-Article_List'
        : '.st-bbs-contents';
    return body.querySelector(selector);
};
const getPagers = (body) => {
    if (!body.querySelector('.sw-Article_List')) {
        return [];
    }
    return Array.from(body.querySelectorAll('.sw-Paging'));
};
const getPagerLinks = (body) => {
    const selector = body.querySelector('.sw-Article_List')
        ? '.sw-Paging a'
        : '.st-bbs-contents .st-pg_contents a';
    return Array.from(body.querySelectorAll(selector));
};

const addReloadButton = (body, fn) => {
    const button = body.querySelector('.sw-Article_List')
        ? addMobileReloadButton(body)
        : addDesktopReloadButton(body);
    if (!button) {
        return;
    }
    button.textContent = '🔄更新';
    button.style.textAlign = 'center';
    button.addEventListener('click', (ev) => {
        ev.preventDefault();
        const board = getBoard(document.body);
        if (board) {
            board.style.filter = 'opacity(0.5)';
            board.style.transition = 'filter 0.1s ease-in';
        }
        const offset = window.scrollY;
        replaceBoard(location.href, true, 200, fn)
            .then(() => {
            document.addEventListener('pjax:complete', () => {
                window.scrollTo(0, offset);
            }, { once: true });
        })
            .catch((err) => {
            console.error(err);
            location.assign(location.href);
        });
    });
};
const ajaxBoard = (fn) => {
    if (location.origin !== 'https://dic.nicovideo.jp') {
        return;
    }
    if (!location.pathname.startsWith('/t/b/') &&
        !location.pathname.startsWith('/b/')) {
        return;
    }
    setupPagerLinks(document.body, fn);
    addReloadButton(document.body, fn);
    window.addEventListener('popstate', () => {
        const board = getBoard(document.body);
        if (board) {
            board.style.filter = 'opacity(0.5)';
            board.style.transition = 'filter 0.1s ease-in';
        }
        replaceBoard(location.href, false, 200, fn).catch((err) => {
            console.error(err);
            location.assign(location.href);
        });
    });
};
const fetchDocument = async (input, init) => {
    const response = await fetch(input, init);
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status} - ${input}`);
    }
    const parser = new DOMParser();
    return parser.parseFromString(await response.text(), 'text/html');
};
const replaceBoard = async (url, fresh, minTime, fn) => {
    const startAt = Date.now();
    const option = fresh
        ? { cache: 'no-cache' }
        : { cache: 'default' };
    const doc = await fetchDocument(url, option);
    setupPagerLinks(doc.body, fn);
    addReloadButton(doc.body, fn);
    lazyLoadContents(doc.body);
    lazyLoadIframes(doc.body);
    if (fn) {
        fn(doc.body);
    }
    const oldBoard = getBoard(document.body);
    const newBoard = getBoard(doc.body);
    const oldPagers = getPagers(document.body);
    const newPagers = getPagers(doc.body);
    const time = Date.now() - startAt;
    setTimeout(() => {
        replaceElement(oldBoard, newBoard);
        oldPagers.forEach((pager, i) => {
            replaceElement(pager, newPagers[i]);
        });
        document.dispatchEvent(new Event('pjax:complete'));
    }, minTime > time ? minTime - time : 0);
};
const replaceElement = (oldElement, newElement) => {
    if (oldElement) {
        const parent = oldElement.parentElement;
        if (parent && newElement) {
            parent.replaceChild(newElement, oldElement);
        }
    }
};
const scrollTop = (body, pathname) => {
    if (pathname.startsWith('/t/')) {
        const pagers = getPagers(body);
        if (pagers[0]) {
            pagers[0].scrollIntoView(true);
        }
    }
    else {
        const board = getBoard(body);
        if (board) {
            board.scrollIntoView(true);
        }
    }
};
const setupPagerLinks = (body, fn) => {
    for (const link of getPagerLinks(body)) {
        link.addEventListener('click', (ev) => {
            ev.preventDefault();
            const board = getBoard(document.body);
            if (board) {
                board.style.filter = 'opacity(0.5)';
                board.style.transition = 'filter 0.1s ease-in 0.2s';
            }
            const url = ev.target.href;
            replaceBoard(url, false, 0, fn)
                .then(() => {
                document.addEventListener('pjax:complete', () => {
                    scrollTop(document.body, location.pathname);
                }, { once: true });
                history.pushState({}, '', url);
            })
                .catch((err) => {
                console.error(err);
                location.assign(url);
            });
        });
    }
};

const delayFirstContentfulPaint = () => {
    if (document.readyState !== 'loading') {
        return;
    }
    document.documentElement.style.visibility = 'hidden';
    document.addEventListener('DOMContentLoaded', () => {
        requestAnimationFrame(() => {
            document.documentElement.style.visibility = '';
        });
    });
};

const decodeToArray = (str) => {
    return str
        .split('\t')
        .filter((str) => {
        return str !== '';
    })
        .map((str) => {
        return str.replace(/\\t/g, '\t');
    });
};
const encodeFromArray = (arr) => {
    return arr
        .map((str) => {
        return str.replace(/\t/g, '\\t');
    })
        .join('\t');
};
class ListStore {
    constructor(prefix, uniqueKey) {
        this.prefix = prefix;
        this.uniqueKey = uniqueKey;
        this.key = `${prefix}${uniqueKey}`;
    }
    async add(value) {
        const array = await this.get();
        if (!array.includes(value)) {
            await this.set([...array, value]);
        }
    }
    async contains(value) {
        const array = await this.get();
        return array.includes(value);
    }
    createEvent(key, value) {
        return new CustomEvent('liststore:changed', {
            detail: {
                key: key,
                value: value,
            },
        });
    }
    emit(key, value) {
        if (typeof document !== 'undefined') {
            const event = this.createEvent(key, value);
            document.dispatchEvent(event);
        }
    }
    async get() {
        try {
            return decodeToArray(localStorage.getItem(this.key) || '');
        }
        catch (e) {
            throw new Error('localStorage.getItem() is failed');
        }
    }
    on(listener) {
        const storageListener = (ev) => {
            if (ev.key && ev.key === this.key) {
                listener(decodeToArray(ev.newValue || ''));
            }
        };
        const changedListener = (ev) => {
            const { key, value } = ev.detail;
            if (key === this.key) {
                listener(value);
            }
        };
        const disposer = () => {
            window.removeEventListener('storage', storageListener);
            document.removeEventListener('liststore:changed', changedListener);
        };
        window.addEventListener('storage', storageListener, false);
        document.addEventListener('liststore:changed', changedListener, false);
        return disposer;
    }
    async remove(value) {
        const array = await this.get();
        await this.set(array.filter((str) => {
            return str !== value;
        }));
    }
    async set(array) {
        try {
            if (array.length === 0) {
                localStorage.removeItem(this.key);
            }
            else {
                localStorage.setItem(this.key, encodeFromArray(array));
            }
        }
        catch (e) {
            throw new Error('localStorage.setItem() is failed');
        }
        this.emit(this.key, array);
    }
}

var css_248z = ":-webkit-any(.st-bbs-contents,.sw-Article_List) .us-NGButton:before{content:\"[NG]\"}:is(.st-bbs-contents,.sw-Article_List) .us-NGButton:before{content:\"[NG]\"}:-webkit-any(.st-bbs-contents,.sw-Article_List) .us-NGID .us-NGButton:before{content:\"[解除]\"}:is(.st-bbs-contents,.sw-Article_List) .us-NGID .us-NGButton:before{content:\"[解除]\"}:-webkit-any(.st-bbs-contents,.sw-Article_List) .us-NGButton:hover{text-decoration:underline}:is(.st-bbs-contents,.sw-Article_List) .us-NGButton:hover{text-decoration:underline}.st-bbs-contents .us-NGButton{color:#9b9b9b;font-size:12px;margin-left:8px}.sw-Article_List .at-List_Date{float:left;padding-right:4px}.sw-Article_List .us-NGButton{color:#999;font-size:10px;vertical-align:text-top}.sw-Article_List .us-NGButton:after{clear:both;content:\"\";display:block}.sw-Article_List .at-List_Text{width:100%}.st-bbs-contents .us-NGID:not(.us-NGView) .st-bbs_name{height:14px;visibility:hidden;width:4em}.st-bbs-contents .us-NGID:not(.us-NGView) .st-bbs_name:before{content:\"あぼーん\";visibility:visible}.st-bbs-contents .us-NGID:not(.us-NGView) .st-bbs_resInfo .trip{display:none}.sw-Article_List .us-NGID:not(.us-NGView) .at-List_Name{height:18px;visibility:hidden}.sw-Article_List .us-NGID:not(.us-NGView) .at-List_Name .at-List_Num{visibility:visible}.sw-Article_List .us-NGID:not(.us-NGView) .at-List_Name .at-List_Num:after{color:#222;content:\"あぼーん\";font-size:12px;font-weight:400;margin-left:4px;visibility:visible}.st-bbs-contents .us-NGID:not(.us-NGView)+.st-bbs_resbody{height:16px;visibility:hidden}.st-bbs-contents .us-NGID:not(.us-NGView)+.st-bbs_resbody:before{border-bottom:1px solid #e6e6e6;content:\"あぼーん\";display:block;padding-bottom:16px;visibility:visible}.sw-Article_List .us-NGID:not(.us-NGView) .at-List_Text{height:18px;visibility:hidden}.sw-Article_List .us-NGID:not(.us-NGView) .at-List_Text:before{content:\"あぼーん\";display:block;visibility:visible}.sw-Article_List .us-NGID:not(.us-NGView) :-webkit-any(.at-List_Illust,.at-List_Piko,.at-List_Piko-title,.at-Piko_Btn){display:none}.sw-Article_List .us-NGID:not(.us-NGView) :is(.at-List_Illust,.at-List_Piko,.at-List_Piko-title,.at-Piko_Btn){display:none}";
const asyncInjectCSS = (css) => {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode(css));
    if (document.readyState !== 'loading') {
        document.head.appendChild(style);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            document.head.appendChild(style);
        });
    }
};
asyncInjectCSS(css_248z);

const exactRun = (fn) => {
    if (document.readyState !== 'loading') {
        fn();
    }
    document.addEventListener('DOMContentLoaded', fn);
};
const getLatestPosts = () => {
    const selector = '.st-pg_link-returnArticle a';
    return Array.from(document.querySelectorAll('.st-bbs-contents'))
        .filter((elm) => {
        return elm.querySelector(selector);
    })
        .map((elm) => {
        const link = elm.querySelector(selector);
        return { url: link.href, container: elm };
    });
};
const init = (url, elm) => {
    const u = new URL(url);
    if (u.origin !== 'https://dic.nicovideo.jp') {
        return;
    }
    const key = normalizePathname(u.pathname);
    const ngList = new ListStore('__BC__', key);
    getComments(elm).forEach((comment) => {
        addButton(comment, ngList);
    });
    return ngList;
};
if (location.pathname.startsWith('/b/') ||
    location.pathname.startsWith('/t/b/') ||
    location.pathname.startsWith('/m/n/res/')) {
    delayFirstContentfulPaint();
}
if (!location.pathname.startsWith('/m/n/res/')) {
    exactRun(() => {
        const list = init(location.href, document.documentElement);
        if (list) {
            ajaxBoard((elm) => {
                const buttons = document.querySelectorAll('.us-NGButton');
                buttons.forEach((button) => {
                    if (button.dispose) {
                        button.dispose();
                    }
                });
                getComments(elm).forEach((comment) => {
                    addButton(comment, list);
                });
            });
        }
    });
}
else {
    exactRun(() => {
        getLatestPosts().forEach((thread) => {
            init(thread.url, thread.container);
        });
    });
}
if (typeof completion === 'function') {
    completion();
}

}());

// ==UserScript==
// @name         DTF Enhancer
// @namespace    http://tampermonkey.net/
// @version      0.2.9
// @description  Выводит список подписок в сайдбаре и раскрывает список комментов
// @author       undfndusr
// @match        *://dtf.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dtf.ru
// @run-at       document-end
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489831/DTF%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/489831/DTF%20Enhancer.meta.js
// ==/UserScript==

(function() {
    const USE_WIDE_LAYOUT = 0; // Показывать страницу на всю ширину. 0 - выкл, 1 - вкл
    const CONTENT_WIDTH = '1400px'; // Ширина контентной области. Можно задать любое значение, например: 960px или 1200px
    const SHOW_SCROLL_UP_BUTTON = 1; // Показывать кнопку "вверх". 0 - выкл, 1 - вкл
    const ENABLE_AUTO_EXPAND_COMMENTS = 1; // Автоматически раскрывать общий список комментариев. 0 - выкл, 1 - вкл
    const ENABLE_STYLE_FIXES = 1; // Подгружать дополнительные стили, улучшающие внешний вид сайта
    const MY_USER_ID = ''; // Можно задать id вашего аккаунта, чтобы скрипт не получал его при каждой загрузке страницы (через попап профиля)

    const dict = {"(": "", ")": "", " ":"-","Ё":"YO","Й":"I","Ц":"TS","У":"U","К":"K","Е":"E","Н":"N","Г":"G","Ш":"SH","Щ":"SCH","З":"Z","Х":"H","Ъ":"'","ё":"yo","й":"i","ц":"ts","у":"u","к":"k","е":"e","н":"n","г":"g","ш":"sh","щ":"sch","з":"z","х":"h","ъ":"'","Ф":"F","Ы":"I","В":"V","А":"A","П":"P","Р":"R","О":"O","Л":"L","Д":"D","Ж":"ZH","Э":"E","ф":"f","ы":"i","в":"v","а":"a","п":"p","р":"r","о":"o","л":"l","д":"d","ж":"zh","э":"e","Я":"Ya","Ч":"CH","С":"S","М":"M","И":"I","Т":"T","Ь":"'","Б":"B","Ю":"YU","я":"ya","ч":"ch","с":"s","м":"m","и":"i","т":"t","ь":"'","б":"b","ю":"yu"};

    const transliterate = (word) => word.split('').map((char) => typeof dict[char] === 'undefined' ? char : dict[char]).join("");

    const cn = (tagName, attrs = {}, childrenList = [], parentNode = null) => {
        const node = document.createElement(tagName);

        if (typeof attrs === 'object') {
            for (const attrsKey in attrs) node.setAttribute(attrsKey, attrs[attrsKey]);
        }

        if (Array.isArray(childrenList)) {
            childrenList.forEach(child => {
                node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
            });
        }

        if (parentNode) {
            parentNode.appendChild(node);
        }

        return node;
    };

    const getDomElementAsync = (selector, timerLimit = 10000, debugMessage = '') => {
        return new Promise((resolve, reject) => {
            try {
                let timerId;

                setTimeout(() => {
                    if (timerId) {
                        console.debug(`Время ожидания DOM элемента ${selector} истекло (${timerLimit / 1000}s)`);
                        resolve(null);
                        clearTimeout(timerId);
                    }
                }, timerLimit);

                const tick = () => {
                    const element = document.querySelector(selector);

                    if (element) {
                        clearTimeout(timerId);
                        resolve(element);
                    } else {
                        timerId = setTimeout(tick, 100);
                    }
                };

                tick();
            } catch (e) {
                reject(e);
            }
        });
    };

    const debounce = (func, wait) => {
        let timeout;
        return function (...args) {
            return new Promise(resolve => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    timeout = null;
                    Promise.resolve(func.apply(this, [...args])).then(resolve);
                }, wait);
            });
        };
    };

    const observeUrlChange = async (onChange) => {
        await GM.setValue('currentUrl', window.location.href);

        const onChangeHandler = async () => {
            const oldHref = await GM.getValue('currentUrl');
            const newHref = window.location.href;

            if (oldHref !== newHref) {
                console.log('observeUrlChange');

                await GM.setValue('currentUrl', newHref);
                onChange?.();
            }
        };

        const debouncedOnChangeHandler = debounce(onChangeHandler, 500);

        const observer = new MutationObserver(debouncedOnChangeHandler);

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    };

    const injectStyles = () => {
        const mainStyles = `
          :root {
            ${USE_WIDE_LAYOUT ? '--layout-max-width: none;' : '--layout-max-width: ' + CONTENT_WIDTH}
          }

          /* родная кнопка "вверх" */
          .scroll-to-top {
            display: ${SHOW_SCROLL_UP_BUTTON ? 'none' : 'flex'} !important;
            width: 45px;
          }

          .sidebar__section._subs {
            margin: 24px 0;
            overflow: hidden;
          }

          .sidebar-item._sub img.icon {
            width: 28px;
            border-radius: 50%;
          }

          .sidebar-item._sub span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 1px;
          }

          /* перебиваем стили DTF */
          .layout,
          .header__layout {
            display: flex;
            gap: 24px;

            ${SHOW_SCROLL_UP_BUTTON ? 'padding: 0 40px;' : ''}
          }

          .header__left,
          .aside--left {
            width: 220px;
            flex-shrink: 0;
          }

          .header__right,
          .aside--right {
            /*width: 300px;*/
            flex-shrink: 0;
          }

          .header__right {
            justify-content: flex-end;
            margin-left: 0;
          }

          .sidebar__main {
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            min-width: 1px;
            overflow: auto;
          }

          .sidebar-item {
            flex-shrink: 0;
          }

          .sidebar-editor-button {
            margin-top: 24px;
          }

          .sidebar-editor-buttons {
            margin-top: auto;
            margin-bottom: 16px;
          }

          .account-menu {
            visibility: hidden;
          }

          body.dtf-subs-script-inited .account-menu {
            visibility: visible;
          }
        `;

        const styleFixes = `
            #app,
            .feed-page {
                display: flex;
                flex-direction: column;
            }
            .supbar,
            .rotator,
            .widget-popular-comments ~ div:not(.widget-item),
            .aside > [class*="sidebar"] + div {
                order: 1;
                pointer-events: none;
                background: var(--theme-color-background);
            }

            .widget-popular-comments ~ div:not(.widget-item) > *,
            .aside > [class*="sidebar"] + div  > *,
            .rotator > * {
                opacity: 0;
            }

            .entry,
            .comments-tree,
            .view {
                display: flex;
                flex-direction: column;
            }

            .ya-header-btn-wrapper {
                display: none;
            }

            .sticky-stack-sidebar__section:first-child > .sticky-stack-sidebar-section > div:first-child {
                order: 1;
            }
        `;

        GM.addStyle(mainStyles);

        if (ENABLE_STYLE_FIXES) {
            GM.addStyle(styleFixes);
        }
    };

    const fetchSubs = async (userId) => {
        const resp = await fetch(`https://api.dtf.ru/v2.5/subsite/subscriptions?subsiteId=${userId}`);
        const { result } = await resp.json();

        return result.items;
    }

    const getImageUrl = (uuid) => `https://leonardo.osnova.io/${uuid}/-/scale_crop/32x32/`;

    const createSidebarItem = (name, imageId, href) => {
        const imgEl = cn('img', { class: 'icon', src: getImageUrl(imageId) });
        const nameEl = cn('span', {}, [name]);
        const result = cn('a', { class: 'sidebar-item _sub', href: transliterate(href), alt: name }, [imgEl, nameEl]);

        return result;
    };

    const createSidebarList = (items) => {
        const title = cn('div', { class: 'sidebar__title' }, ['Подписки']);
        const sidebarItems = items.map((item) => createSidebarItem(item.name, item.avatar.data.uuid, item.uri || `/id${item.id}`));

        return cn('div', { class: 'sidebar__section _subs' }, [title, ...sidebarItems]);
    };

    const getProfileUrl = async () => {
        const userButton = await getDomElementAsync('.account-button__inner');
        userButton.click();

        const profileMenuItem = await getDomElementAsync('.user-card');
        userButton.click();

        return profileMenuItem.href;
    }

    const getUserId = async () => {
        const profileUrl = await getProfileUrl();
        const userId = profileUrl.split('/id')[1];

        return userId || null;
    };

    const injectSubscriptions = async () => {
        const userId = MY_USER_ID || await getUserId();

        document.body.classList.add('dtf-subs-script-inited');

        if (!userId) {
            return;
        }

        const subs = await fetchSubs(userId);
        const list = createSidebarList(subs);

        const firstSidebarSection = await getDomElementAsync('.sidebar__section');
        firstSidebarSection.after(list);
    };

    const runAutoExpandComments = () => {
        const expandComments = async () => {
            const isCommentsSlicePage = location.search.includes('comment=');

            if (isCommentsSlicePage) {
                // На странице со срезом комментариев не запускаем автораскрытие общего списка.
                // Кнопка expandCommentsButton вместо раскрытия открывает страницу самого поста.
                // Из-за чего страница среза не отображается, а сразу происходит редирект.
                return;
            }

            const expandCommentsButton = await getDomElementAsync('.comments-limit__expand');
            expandCommentsButton?.click();
        };

        observeUrlChange(expandComments);

        expandComments();
    };

    const injectScrollUp = () => {
        const styles = `
          .scroll-up-button {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            width: 45px;
            height: 100vh;
            padding-bottom: 24px;
            background-color: transparent;
            cursor: pointer;
            z-index: calc(var(--layout-z-index-header) - 2);
            opacity: 0;
            pointer-events: none;
            transition: background-color 200ms ease-out, opacity 200ms ease-out;
          }

          .scroll-up-button:hover {
            background-color: var(--theme-color-button-minimal-hover);
          }

          .scroll-up-button:before {
            content: '';
            width: 8px;
            height: 8px;
            border: 2px solid var(--theme-color-text-secondary-light);
            border-width: 2px 2px 0 0;
            transition: transform 200ms ease-out;
          }

          .scroll-up-button.up:before {
            transform: rotate(-45deg);
          }

          .scroll-up-button.down:before {
            transform: rotate(135deg);
          }

          .scroll-up-button.visible {
            opacity: 1;
            pointer-events: all;
          }
        `;

        GM.addStyle(styles);

        const scrollUpBtn = cn('div', { class: 'scroll-up-button' }, [], document.querySelector('body'));

        const setUpIcon = () => {
            scrollUpBtn.classList.remove('down');
            scrollUpBtn.classList.add('up');
        };

        const setDownIcon = () => {
            scrollUpBtn.classList.remove('up');
            scrollUpBtn.classList.add('down')
        };

        let prevScrollPosition = 0;

        window.addEventListener('scroll', debounce(() => {
            if (window.scrollY) {
                scrollUpBtn.classList.add('visible');

                setUpIcon();
            } else {
                setDownIcon();
            }
        }, 100));

        scrollUpBtn.addEventListener('click', () => {
            if (window.scrollY) {
                prevScrollPosition = window.scrollY;

                setDownIcon();

                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
            } else {
                setUpIcon();

                window.scrollTo({
                    top: prevScrollPosition,
                    left: 0,
                    behavior: "smooth",
                });
            }
        });
    };

    const start = async () => {
        console.debug('DTF Enhancer started');

        injectStyles();
        injectSubscriptions();

        if (ENABLE_AUTO_EXPAND_COMMENTS) {
            runAutoExpandComments();
        }

        if (SHOW_SCROLL_UP_BUTTON) {
            injectScrollUp();
        }
    };

    const init = async () => {
        if (document.visibilityState === 'visible') {
            start();
        } else {
            // Для вкладок открытых в фоне запускаем скрипт после перехода на вкладку
            addEventListener("visibilitychange", (event) => {
                if (document.visibilityState === 'visible') {
                    start();
                }
            }, { once: true });
        }
    };

    init();
})();
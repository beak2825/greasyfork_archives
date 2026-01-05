// ==UserScript==
// @name            rBlock
// @author          nonoroazoro
// @description     移除一些网站用于数据统计的链接跳转，加快网站访问速度。
// @description:en  Removes redirects of web sites.
// @homepageURL     https://github.com/nonoroazoro/firefox/tree/master/greasemonkey/rBlock
// @namespace       https://greasyfork.org/zh-CN/scripts/20568-rblock
// @grant           none
// @version         1.3.8
// @run-at          document-end
// @include         /^https?:\/\/(.+\.)?google\./
// @include         /^https?:\/\/(.+\.)?zhihu\./
// @include         https://forum.gamer.com.tw/*
// @downloadURL https://update.greasyfork.org/scripts/20568/rBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/20568/rBlock.meta.js
// ==/UserScript==

const rBlock = {

    _blockers: [],

    start()
    {
        this.init();
        for (const blocker of this._blockers)
        {
            blocker.start();
        }
    },

    init()
    {
        this._blockers = [];
        const _host = window.location.host;

        // 1. google
        if (/^(.+\.)?google\./.test(_host))
        {
            this._blockers.push({
                start()
                {
                    // 1. for static pages.
                    // when google instant predictions is disabled,
                    // this blocker will only be called once.
                    this._block();

                    // 2. for dynamic pages.
                    // when google instant predictions is enabled,
                    // this blocker will be call whenever the current page is updated.
                    _observe(this._block);
                },

                // block redirects of google
                _block()
                {
                    // 1. general
                    let elems = document.querySelectorAll(`a[href*="url="]`);
                    revealURL(elems, /.*url=(http[^&]+)/i);

                    // 2. images
                    elems = document.querySelectorAll(`a[jsaction][href]:not([href="javascript:void(0)"]):not(.rg_l)`);
                    _removeAttributes(elems, "jsaction");

                    // 3. all/videos/news/apps
                    elems = document.querySelectorAll(`a[onmousedown^="return rwt("]`);
                    _removeAttributes(elems, "onmousedown");

                    // 4. cached links
                    elems = document.querySelectorAll(`a[href^="http://webcache.googleusercontent."], a[href^="https://webcache.googleusercontent."]`);
                    const targets = document.querySelectorAll(`a.rblock-cached-link`);
                    if (elems.length !== targets.length * 2)
                    {
                        // prevent duplication
                        let menuLink;
                        let cacheLink;
                        for (const elem of elems)
                        {
                            elem.style.display = "inline";
                            menuLink = elem.closest("div.action-menu.ab_ctl");

                            cacheLink = document.createElement("a");
                            cacheLink.setAttribute("href", elem.getAttribute("href").replace(/^http:/, "https:"));
                            cacheLink.setAttribute("class", "rblock-cached-link");
                            cacheLink.target = "_blank";
                            cacheLink.innerText = " Cached ";

                            menuLink.parentNode.insertBefore(cacheLink, menuLink);
                        }
                    }
                }
            });
        }

        // 2. zhihu
        if (/^(.+\.)?zhihu\./.test(_host))
        {
            this._blockers.push({
                start()
                {
                    this._block();
                    _observe(this._block);
                },

                _block()
                {
                    // 1. general
                    revealURL(
                        document.querySelectorAll(`a[href*="?target="]`),
                        /.*target=(http[^&]+)/i
                    );

                    // 2. open in new tab
                    for (const elem of document.querySelectorAll(`a.internal`))
                    {
                        _openInNewTab(elem);
                    }
                }
            });
        }

        // 3. 巴哈姆特
        if (_host === "forum.gamer.com.tw")
        {
            this._blockers.push({
                start()
                {
                    this._block();
                    _observe(this._block);
                },

                _block()
                {
                    // 1. general
                    revealURL(
                        document.querySelectorAll(`a[href*="?url="]`),
                        /.*url=(http.+)/i
                    );
                }
            });
        }
    }
};

function _observe(p_callback)
{
    if (typeof p_callback === "function" && document.body)
    {
        (new window.MutationObserver(debounce(p_callback))).observe(document.body, { childList: true, subtree: true });
    }
}

function _removeAttributes(p_elements, p_attributes)
{
    if (p_elements && typeof p_attributes === "string")
    {
        const attributes = p_attributes.split(/\W+/) || [];
        for (const elem of p_elements)
        {
            for (const attr of attributes)
            {
                elem.removeAttribute(attr);
            }
        }
    }
}

/* eslint no-unused-vars: "off" */
function _removeListeners(p_element, p_events)
{
    if (p_element && typeof p_events === "string")
    {
        const events = p_events.split(/\W+/) || [];
        for (const event of events)
        {
            p_element.removeEventListener(event, _preventDefaultAction, true);
            p_element.addEventListener(event, _preventDefaultAction, true);
        }
    }
}

function _preventDefaultAction(e)
{
    e.stopPropagation();
}

function revealURL(p_elems, p_regex)
{
    if (p_elems && p_regex)
    {
        let groups;
        for (const elem of p_elems)
        {
            // reveal url & open in new tab
            groups = decodeURIComponent(elem.getAttribute("href")).match(p_regex);
            if (groups && groups[1])
            {
                elem.setAttribute("href", groups[1]);
                _openInNewTab(elem);
            }
        }
    }
}

function _openInNewTab(p_elem)
{
    if (p_elem)
    {
        p_elem.target = "_blank";
    }
}

function debounce(p_callback, p_delay = 500)
{
    let timer = null;
    return function _inner(...args)
    {
        const context = this;
        window.clearTimeout(timer);
        timer = window.setTimeout(() =>
        {
            p_callback.apply(context, args);
        }, p_delay);
    };
}

function throttle(p_callback, p_threshhold = 500, p_scope)
{
    let last;
    let timer;
    return function _inner(...args)
    {
        const now = +new Date();
        const context = p_scope || this;
        if (last && now < last + p_threshhold)
        {
            window.clearTimeout(timer);
            timer = window.setTimeout(() =>
            {
                last = now;
                p_callback.apply(context, args);
            }, p_threshhold);
        }
        else
        {
            last = now;
            p_callback.apply(context, args);
        }
    };
}

rBlock.start();

// ==UserScript==
// @name         zhi-hu
// @namespace    https://greasyfork.org/zh-CN/scripts/438709-zhi-hu
// @version      0.1.6
// @description  知知乎乎（收藏夹双列；隐藏视频回答；加宽；区分问题和视频；多图预警）
// @author       Song
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438709/zhi-hu.user.js
// @updateURL https://update.greasyfork.org/scripts/438709/zhi-hu.meta.js
// ==/UserScript==
(function () {

    function domesticate(text) {
        const doc = new DOMParser().parseFromString(text, 'text/html');
        return doc.body.firstChild;
    }

    function debounce(func, wait, immediate) {
        let timeout;
        let result;
        const later = () => setTimeout(() => {
            timeout = null;
            if (!immediate) result = func.apply(this, arguments);
        }, wait);
        return function (...args) {
            const context = this;
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = later();
            if (callNow) result = func.apply(context, args);
            return result;
        };
    }

    //region style

    function addStyleElement() {
        let el = document.createElement('style');
        el.setAttribute('name', 'zhi_zhi_hu_hu');
        document.head.appendChild(el);
    }

    /**
     *
     * @param {string} selector
     * @param {Partial<CSSStyleDeclaration>} style
     * @param {string[]}  [important]
     */
    function createRule(selector, style, important) {
        const s = document.createElement('div').style;
        Object.assign(s, style);
        const text = s.cssText;
        if (important && important.length > 0) {
            throw new Error('un supported important');
        }
        return selector + `{${text}}`;
    }

    /**
     * 插入样式表
     */
    function insertCSS() {
        let styleSheet = document.styleSheets[document.styleSheets.length - 1];

        /**
         *
         * @param {string} selector
         * @param {Partial<CSSStyleDeclaration>} style
         * @param {string[]}  [important]
         */
        function appendRule(selector, style, important) {
            styleSheet.insertRule(createRule(selector, style, important));
        }

        /*收藏栏的样式，变成双列*/
        styleSheet.insertRule('.Modal--large.FavlistsModal {width: 600px;}');
        styleSheet.insertRule('.Favlists-content .Favlists-item {width: 230px; float: left;}');
        styleSheet.insertRule(' .Favlists-content .Favlists-item:nth-child(even){margin-left: 60px;}');

        /*隐藏视频回答*/
        styleSheet.insertRule('.VideoAnswerPlayer, .VideoAnswerPlayer video, .VideoAnswerPlayer-video, .VideoAnswerPlayer-iframe {height: 2px;}');
        // styleSheet.insertRule('.ZVideoItem  {height: 2px;}');
        styleSheet.insertRule('.ContentItem.ZVideoItem  {height: 8px;}');
        styleSheet.insertRule('.ContentItem.EduSectionItem  {height: 8px;}');
        styleSheet.insertRule('.ZvideoItem .RichContent-cover{ height:8px; }');
        styleSheet.insertRule('.ZvideoItem .RichContent-cover-inner{height:4px; }');
        styleSheet.insertRule('.VideoAnswerPlayer video, nav.TopstoryTabs > a[aria-controls="Topstory-zvideo"]{height:4px; }');


        /*区分问题 和 视频*/
        let style = `font-weight: bold;font-size: 13px;padding: 1px 4px 0;border-radius: 2px;display: inline-block;vertical-align: top;margin: ${(location.pathname === '/search') ? '2' : '4'}px 4px 0 0;`
        let styles = [
            `.AnswerItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'回答';color: #f68b83;background-color: #f68b8333;${style}}`,
            `.TopstoryQuestionAskItem .ContentItem-title a:not(.zhihu_e_toQuestion)::before {content:'回答';color: #ff5a4e;background-color: #ff5a4e33;${style}}`,
            `.ZVideoItem .ContentItem-title a::before, .ZvideoItem .ContentItem-title a::before {content:'视频';color: #00BCD4;background-color: #00BCD433;${style}}`,
            `.ArticleItem .ContentItem-title a::before {content:'文章';color: #2196F3;background-color: #2196F333;${style}}`
        ];
        styles.forEach(s => styleSheet.insertRule(s));

        /*视频*/
        styleSheet.insertRule('.ZVideoItem .RichContent{opacity: 0.5; color: #666  !important; font-style:italic !important;}');

        /*调整列表中专栏文章的样式*/
        styleSheet.insertRule('.ContentItem[itemprop=article]{opacity: 0.5; color: #666;font-style:italic;}');
        styleSheet.insertRule('.ContentItem[itemprop=article] .ContentItem-title{color: #666; }');


        /* 隐藏 footer */
        styleSheet.insertRule('footer.Footer{display:none !important;}')

        /* 多图预警的样式 */
        appendRule('.cloakroom', {
            position: 'relative', overflow: 'hidden',
            width: '100%', height: '196px',
            background: 'rgba(128, 160, 160, 0.8)'
        });
        /*   appendRule('.cloak-image', {
               position: 'absolute', margin: '0.5rem',
               height: 'calc(100% - 1rem) !important', width: 'auto !important',
           });*/
        styleSheet.insertRule('.cloak-image { position: absolute; margin: 0.5rem !important; height: calc(100% - 1rem) !important; width: auto !important;}');
        appendRule('.cloak-info', {
            marginLeft: '20rem', fontSize: '14px',
            display: 'flex', flexDirection: 'column', gap: '1rem',
            alignItems: 'center', justifyContent: 'center',
            color: 'rgb(255, 255, 255)', height: '100%',
        });
        appendRule('.div-btn', {
            cursor: 'default', padding: '4px 1em',
            border: '1px solid rgba(255, 255, 255, 0.5)', borderRadius: '999px',
        });

        /* 多图预警 小图 */
        appendRule('.cloakroom.scarf', {height: '48px'});
        appendRule('.scarf .scarf-hidden, .scarf-show', {display: 'none'});
        appendRule('.scarf .scarf-show', {display: 'block'});
        appendRule('.scarf .cloak-info', {flexDirection: 'row'});

        /*隐藏回答列表中的小广告*/
        // appendRule('.Pc-word-new',{display:'none'});
        styleSheet.insertRule('.Pc-word-new {display:none !important;}');
    }

    /**
     * 增宽
     * @param {number} maxWidth
     */
    function widening(maxWidth) {
        const ww = window.innerWidth - 30;
        if (ww < 1000) return;

        let w = ww > maxWidth ? maxWidth : ww;
        let styleSheet = document.styleSheets[document.styleSheets.length - 1];
        styleSheet.insertRule('.Topstory-container, .QuestionHeader-main, .Question-main{min-width:' + w + 'px !important;}');
        styleSheet.insertRule('.Topstory-mainColumn, .Question-mainColumn{width:' + (w - 300) + 'px !important;}');
        styleSheet.insertRule('.QuestionHeader-content{padding-left:' + ((ww - w) / 2) + 'px !important;}');
        // document.querySelector('.Topstory-container').style.minWidth = w + 'px';
        // document.querySelector('.Topstory-mainColumn').style.width = (w - 300) + 'px';
        // 专栏文章 为关于作者预留 240px 的宽度。
        styleSheet.insertRule('.Post-Main .Post-RichTextContainer {min-width:' + (w - 240) + 'px !important;}');
        styleSheet.insertRule('.Post-Row-Content-left {min-width:' + (w - 240) + 'px !important;}');
    }

    //endregion

    //region 多图预警

    function createCloak(index, total) {
        const text = `
        <div tabindex="${index}" class="cloak-info" role="button">
            <div>多图预警（<span>${index + 1}</span>/<span>${total}</span>）</div>
            <div class="div-btn scarf-hidden" data-action="hide_me">隐藏此图</div>
            <div class="div-btn scarf-hidden" data-action="hide_all">隐藏所有</div>
            <div class="div-btn scarf-show" data-action="thumb_me">预览此图</div>
            <div class="div-btn scarf-show" data-action="thumb_all">预览所有</div>
            <div class="div-btn" data-action="collapse">收起</div>
        </div>
        </div>`
        return domesticate(text);
    }

    /**
     *
     * @param {HTMLDivElement} item
     */
    function handleContent(item) {
        function collapseOnce() {
            if (item.classList.contains('cloak-collapse')) {
                return
            }
            item.classList.add('cloak-collapse');
            const el = item.querySelector('.RichContent-collapsedText');
            el?.parentElement?.click();
        }

        /**
         *
         * @param {'hide_me'|'hide_all'|'thumb_me'|'thumb_all'|'collapse'} action
         * @param {HTMLDivElement} box
         */
        function execute(action, box) {
            switch (action) {
                case 'hide_me': {
                    box.classList.add('scarf');
                    break;
                }
                case 'hide_all': {
                    const elements = item.querySelectorAll('figure div.cloakroom');
                    for (let j = 0; j < elements.length; j++) {
                        elements[j].classList.add('scarf');
                    }
                    console.info('[zhi-hu]', 'hide all', elements.length);
                    break;
                }
                case 'thumb_me': {
                    box.classList.remove('scarf');
                    break;
                }
                case 'thumb_all': {
                    const elements = item.querySelectorAll('figure div.cloakroom');
                    for (let j = 0; j < elements.length; j++) {
                        elements[j].classList.remove('scarf');
                    }
                    console.info('[zhi-hu]', 'thumb all', elements.length);
                    break;
                }
                case 'collapse': {
                    const el = item.querySelector('.RichContent-collapsedText');
                    el?.parentElement?.click();
                }
            }
        }

        const processed = item.querySelectorAll('figure div.cloakroom').length > 0;
        const meta = item.querySelector('.ContentItem-meta');
        console.info('[zhi-hu]', '处理文章', processed, meta.textContent);
        if (processed) return;
        const rc = item.querySelector('.RichContent');
        const collapsed = rc.classList.contains('is-collapsed');
        const r = rc.querySelector('.RichContent-inner');
        const figures = r.querySelectorAll('figure');
        const len = figures.length;
        if (len < 3) {
            const images = r.querySelectorAll('figure img');
            let ratios = []
            for (let img of images) {
                if (img.height > 480 && img.height / img.width > 1.5) {
                    ratios.push(img.height / img.width);
                }
            }
            if (ratios.length < 1) return;
        }
        // item.classList.add('cloak-dagger');

        for (let i = 0; i < len; i++) {
            const figure = figures[i];
            if (figure.querySelectorAll('img').length > 1) {
                // 图片不适
                continue;
            }
            const d = figure.querySelector('div');
            const img = d.querySelector('img');
            if (img.height / img.width < 0.2) {
                // 跳过较矮的图片
                d.classList.add('cloak-skip');
                continue;
            }
            if (len > 4) {
                d.classList.add('cloakroom', 'scarf');
            } else {
                d.classList.add('cloakroom');
            }
            img.classList.add('cloak-image', 'scarf-hidden');
            const info = createCloak(i, len)
            d.appendChild(info);
            info.addEventListener('click', (e) => {
                if (!e.target.classList.contains('div-btn')) return;
                const action = e.target.dataset.action;
                execute(action, d);
            });
        }

        if (collapsed) {
            const p = r.querySelectorAll('p').length;
            const btn = rc.querySelector('.ContentItem-expandButton');
            btn.textContent = `多图预警（${p} 段 ${len} 图）`;
        } else {
            if (len > 8) collapseOnce();
        }
    }

    function handleList() {

        const process = debounce(() => {
            const list = document.querySelectorAll('.ContentItem');
            console.info('[zhi-hu]', 'Content items', list.length);
            for (let i = 0; i < list.length; i++) {
                handleContent(list[i]);
            }
        }, 800)

        // 在 main Column 监听 ，有可能失效。
        // const question = document.querySelector('.Question-mainColumn');

        const observer = new MutationObserver((mutations) => {
            console.info('[zhi-hu]', 'observer mutations', mutations.length);
            process();
        });
        observer.observe(document, {attributes: false, childList: true, subtree: true});

        process();
    }


    //endregion

    addStyleElement();
    widening(1200);
    insertCSS();
    handleList();
})();
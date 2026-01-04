// ==UserScript==
// @name               Xmanhua閱讀輔助
// @name:en            Xmanhua Read Helpr
// @name:zh-CN         Xmanhua阅读辅助
// @name:zh-TW         Xmanhuaz閱讀輔助
// @version            0.8
// @description        Xmanhua瀑布流閱讀連續載入圖片(自用)。
// @description:en     Xmanhua read infinite scroll
// @description:zh-CN  Xmanhua瀑布流阅读连续载入图片(自用)。
// @description:zh-TW  Xmanhua瀑布流閱讀連續載入圖片(自用)。
// @author             tony0809
// @match              *://www.xmanhua.com/m*/
// @match              *://xmanhua.com/m*/
// @icon               https://www.google.com/s2/favicons?sz=64&domain=www.xmanhua.com
// @grant              none
// @license            MIT
// @namespace          https://greasyfork.org/users/20361
// @downloadURL https://update.greasyfork.org/scripts/462533/Xmanhua%E9%96%B1%E8%AE%80%E8%BC%94%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/462533/Xmanhua%E9%96%B1%E8%AE%80%E8%BC%94%E5%8A%A9.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const options = { //true 開啟，false 關閉
        aH: true, //載入下一話時添加瀏覽器歷史紀錄。
        pln: true, //手機版預讀下一頁的圖片，減少等待加載圖片的時間。
        remove: [true, 3] //!!!不能小於2!!!閱讀載入超過n話時刪除前面話數的圖片。
    };
    const ge = (selector, doc) => (doc || document).querySelector(selector);
    const gae = (selector, doc) => (doc || document).querySelectorAll(selector);
    const gx = (xpath, doc) => (doc || document).evaluate(xpath, (doc || document), null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const mobile = () => {
        if (gx("//script[contains(text(),'newImgs')]")) {
            return true;
        }
        return false;
    };
    const runCode = code => new Function('return ' + code)();
    const addGlobalStyle = css => {
        let style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    };
    const PcCss = `
.reader-bottom-page {
    display: none !important
}
.container {
    width: auto !important
}
.reader-img-con {
    padding: 64px 0 50px !important;
}
.chapterLoading {
    font-size: 20px;
    color: #FFFFFF;
    height: 30px;
    line-height: 32px;
    text-align: center;
}
.chapterTitle {
    width: auto;
    height: 30px;
    font-size: 24px;
    font-family: Arial,sans-serif!important;
    line-height: 32px;
    text-align: center;
    margin: 10px 5px;
    border: 1px solid #e0e0e0;
    background-color: #f0f0f0;
    background: -webkit-gradient(linear, 0 0, 0 100%, from(#f9f9f9), to(#f0f0f0));
    background: -moz-linear-gradient(top, #f9f9f9, #f0f0f0);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
    border-radius: 5px;
}
    `;
    const mCss = `
.chapterLoading {
    font-size: 20px;
    height: 30px;
    line-height: 32px;
    text-align: center;
}
.chapterTitle {
    width: auto;
    height: 30px;
    font-size: 20px;
    font-family: Arial,sans-serif!important;
    line-height: 32px;
    text-align: center;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    margin: 10px 5px;
    border: 1px solid #e0e0e0;
    background-color: #f0f0f0;
    background: -webkit-gradient(linear, 0 0, 0 100%, from(#f9f9f9), to(#f0f0f0));
    background: -moz-linear-gradient(top, #f9f9f9, #f0f0f0);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
    border-radius: 5px;
}
    `;
    const css = `
#cp_img>img {
    width: auto !important;
    height: auto !important;
    max-width: 100% !important;
    display: block !important;
    margin: 0 auto !important
}
    `;
    const addHistory = (title, url) => {
        history.pushState(null, title, url);
        document.title = title;
    };
    const addLoad = () => {
        let cl = document.createElement('div');
        cl.className = 'chapterLoading';
        cl.innerText = 'Loading...';
        ge('#cp_img').appendChild(cl);
    };
    const removeLoad = () => {
        ge('.chapterLoading').remove();
    };
    const addTitle = title => {
        let t = document.createElement('div');
        t.className = 'chapterTitle';
        t.innerText = title;
        let load = ge('.chapterLoading');
        load.parentNode.insertBefore(t, load);
    };
    const parseHTML = str => {
        var doc = null;
        try {
            doc = new DOMParser().parseFromString(str, 'text/html');
        } catch (e) {}
        if (!doc) {
            doc = document.implementation.createHTMLDocument('');
            doc.documentElement.innerHTML = str;
        }
        return doc;
    };
    const mobilePreloadNext = () => {
        let next = gx("//a[text()='下一章']");
        if (next) {
            fetch(next.href).then(res => res.text()).then(res => {
                let doc = parseHTML(res);
                let title = gx("//p[@class='top-title']", doc).innerText.replace(/XManhua\?.+\?/, '');
                let imgs = runCode(runCode(Array.from(doc.scripts).find(s => s.innerHTML.search(/newImgs/) > -1).innerHTML.trim().slice(4)).replace('var', ''));
                let F = new DocumentFragment();
                imgs.forEach(e => {
                    let temp = new Image();
                    temp.src = e;
                    F.appendChild(temp);
                    temp.onload = () => {
                        temp = null;
                    };
                });
                console.log(`[${title}] 圖片預讀：\n`, F);
                doc = null;title = null;imgs = null;F = null;
            });
        }
    };
    const fetchData = url => {
        fetch(url).then(res => res.text()).then(res => {
            let doc = parseHTML(res);
            if (options.aH) {
                addHistory(doc.title, url);
            }
            var code = null;
            if (mobile()) {
                code = runCode(Array.from(doc.scripts).find(s => s.innerHTML.search(/newImgs/) > -1).innerHTML.trim().slice(4));
            } else {
                code = Array.from(doc.scripts).find(s => s.innerHTML.search(/XMANHUA_IMAGE_COUNT/) > -1).innerHTML;
            }
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.innerHTML = code;
            ge('#cp_img').appendChild(script);
            insertData(doc);
        }).catch(error => {
            console.error(error);
            ge('.chapterLoading').innerText = '連線出錯，請返回頂部重新載入。';
        });
    };
    const insertData = doc => {
        const pcData = async () => {
            if (!mkey) {
                var mkey = '';
            }
            for (let i = 1; i <= XMANHUA_IMAGE_COUNT; i++) {
                let apiUrl = location.origin + XMANHUA_CURL + 'chapterimage.ashx' + `?cid=${XMANHUA_CID}&page=${i}&key=${mkey}&_cid=${XMANHUA_CID}&_mid=${XMANHUA_MID}&_dt=${XMANHUA_VIEWSIGN_DT}&_sign=${XMANHUA_VIEWSIGN}`;
                let res = await fetch(apiUrl);
                let resText = await res.text();
                let imgSrc = await runCode(resText)[0];
                let img = new Image();
                img.src = imgSrc;
                ge('#cp_img').appendChild(img);
            }
            addNextObserver();
        };
        const mobileData = () => {
            let F = new DocumentFragment();
            newImgs.forEach(e => {
                let img = new Image();
                img.src = e;
                F.appendChild(img);
            });
            ge('#cp_img').appendChild(F);
            setTimeout(() => {
                addNextObserver();
            }, 1300);
        };
        let load = ge('.chapterLoading');
        if (load) {
            let title;
            if (mobile()) {
                let xpath = "//div[@class='bottom-bar-tool']";
                gx(xpath).outerHTML = gx(xpath, doc).outerHTML;
                title = gx("//p[@class='top-title']", doc).innerText.replace(/XManhua\?.+\?/, '');
            } else {
                let xpath = "//div[@class='reader-bottom-right']";
                gx(xpath).outerHTML = gx(xpath, doc).outerHTML;
                title = gx("//div[@class='reader-title']/a[last()]", doc).innerText.trim();
            }
            addTitle(title);
            if (options.remove[0] && options.remove[1] > 1) {
                removeOldChapter();
            }
            setTimeout(() => {
                removeLoad();
                if (mobile()) {
                    mobileData();
                } else {
                    pcData();
                }
            }, 300);
        } else {
            ge('#cp_img').innerHTML = '';
            if (mobile()) {
                mobileData();
            } else {
                document.body.style.overflow = 'scroll';
                pcData();
            }
        }
    };
    const nextObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target);
                let next;
                if (mobile()) {
                    next = gx("//a[text()='下一章']");
                } else {
                    next = gx("//a[img[contains(@src,'reader-bottom-right-2')]]");
                }
                if (next) {
                    let url = next.href;
                    console.log(`觸發載入下一話\n${url}`);
                    addLoad();
                    fetchData(url);
                }
            }
        });
    });
    const addNextObserver = () => {
        let lastImg = [...gae('#cp_img img')].pop();
        let loadImg = new Image();
        loadImg.src = lastImg.src;
        loadImg.onload = () => {
            nextObserver.observe(lastImg);
            if (mobile() && options.pln) {
                mobilePreloadNext();
            }
            loadImg = null;
        };
        loadImg.onerror = () => {
            nextObserver.observe(lastImg);
        };
    };
    const removeOldChapter = () => {
        let titles = gae('.chapterTitle');
        if (titles.length > options.remove[1]) {
            titles[0].remove();
            let removes = gae('#cp_img>*');
            for (let i in removes) {
                if (/chapterTitle/.test(removes[i].className)) {
                    break;
                }
                removes[i].remove();
            }
        }
    };
    if (ge('#showimage') && !ge('.bottom-bar')) {
        console.log('Xmanhua_PcMode');
        addGlobalStyle(PcCss);
        addGlobalStyle(css);
        insertData();
        let loop = setInterval(() => {
            let set = ge('#cp_image');
            if (set) {
                clearInterval(loop);
                set.remove();
            }
        }, 100);

        const showtoolbar = () => {
            let t = ge('.header.toolbar');
            if (t) {
                $('.header').removeClass('toolbar');
                $('.header').removeAttr('style');
            } else {
                $('.header').addClass('toolbar');
                $('.header').attr('style', 'top: -64px;');
            }
            let b = ge('.reader-bottom.toolbar');
            if (b) {
                $('.reader-bottom').removeClass('toolbar');
                $('.reader-bottom').removeAttr('style');
            } else {
                $('.reader-bottom').addClass('toolbar');
                $('.reader-bottom').attr('style', 'bottom: -50px;');
            }
        };
        document.addEventListener('click', showtoolbar);

        const hidetoolbar = () => {
            var e = e || window.event;
            if (e.wheelDelta < 0 || e.detail > 0) {
                $('.header').addClass('toolbar');
                $('.header').attr('style', 'top: -64px;');
                $('.reader-bottom').addClass('toolbar');
                $('.reader-bottom').attr('style', 'bottom: -50px;');
            } else {
                $('.header').removeClass('toolbar');
                $('.header').removeAttr('style');
                $('.reader-bottom').removeClass('toolbar');
                $('.reader-bottom').removeAttr('style');
            }
        };
        document.addEventListener('wheel', hidetoolbar);
        document.addEventListener('DOMMouseScroll', hidetoolbar);

        const keyhidetoolbar = (e) => {
            let key = window.event ? e.keyCode : e.which;
            if (key == '34' || key == '32' || key == '40') {
                $('.header').addClass('toolbar');
                $('.header').attr('style', 'top: -64px;');
                $('.reader-bottom').addClass('toolbar');
                $('.reader-bottom').attr('style', 'bottom: -50px;');
            } else {
                $('.header').removeClass('toolbar');
                $('.header').removeAttr('style');
                $('.reader-bottom').removeClass('toolbar');
                $('.reader-bottom').removeAttr('style');
            }
        };
        document.addEventListener('keydown', keyhidetoolbar);
    } else if (mobile()) {
        console.log('Xmanhua_Mobile');
        addGlobalStyle(mCss);
        addGlobalStyle(css);
        insertData();
    }

})();
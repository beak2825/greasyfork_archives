// ==UserScript==
// @name               DM5動漫屋_閱讀輔助
// @name:en            DM5 Read Helpr
// @name:zh-CN         DM5动漫屋_阅读辅助
// @name:zh-TW         DM5動漫屋_閱讀輔助
// @version            1.0.5
// @description        DM5動漫屋_瀑布流閱讀連續載入圖片(自用)。
// @description:en     DM5 read infinite scroll
// @description:zh-CN  DM5动漫屋_瀑布流阅读连续载入图片(自用)。
// @description:zh-TW  DM5動漫屋_瀑布流閱讀連續載入圖片(自用)。
// @author             tony0809
// @match              *://*.dm5.com/m*/
// @match              *://*.dm5.cn/m*/
// @match              *://*.1kkk.com/ch*/
// @match              *://*.1kkk.com/vol*/
// @match              *://*.1kkk.com/other*/
// @icon               https://www.google.com/s2/favicons?sz=64&domain=dm5.com
// @grant              none
// @license            MIT
// @namespace          https://greasyfork.org/users/20361
// @downloadURL https://update.greasyfork.org/scripts/462530/DM5%E5%8B%95%E6%BC%AB%E5%B1%8B_%E9%96%B1%E8%AE%80%E8%BC%94%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/462530/DM5%E5%8B%95%E6%BC%AB%E5%B1%8B_%E9%96%B1%E8%AE%80%E8%BC%94%E5%8A%A9.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const options = { //true 開啟，false 關閉
        aH: true, //載入下一話時添加瀏覽器歷史紀錄。
        pln: true, //PC條漫版和手機版預讀下一頁的圖片，減少等待加載圖片的時間。
        remove: [true, 3] //!!!不能小於2!!!閱讀載入超過n話時刪除前面話數的圖片。
    };
    const ge = (selector, doc) => (doc || document).querySelector(selector);
    const gae = (selector, doc) => (doc || document).querySelectorAll(selector);
    const gx = (xpath, doc) => (doc || document).evaluate(xpath, (doc || document), null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    const gax = (xpath, doc) => {
        let nodes = [];
        let results = (doc || document).evaluate(xpath, (doc || document), null, XPathResult.ANY_TYPE, null);
        let node;
        while (node = results.iterateNext()) {
            nodes.push(node);
        }
        return nodes;
    };
    const pcMode1 = () => {
        if (ge('#chapterpager')) {
            return true;
        }
        return false;
    };
    const pcMode2 = () => {
        if (ge('#barChapter')) {
            return true;
        }
        return false;
    };
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
    const pcCss = `
a[href^='j'],
.chapterpager,
#lb-win {
    display: none !important;
}
.view-comment {
    display: none ;
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
.view-fix-bottom-bar-item[onclick],
.guide {
    display: none !important;
}
.view-fix-bottom-bar-item {
    width: 25% !important;
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
#cp_img>img,#barChapter>img {
    width: auto !important;
    height: auto !important;
    max-width: 100% !important;
    display: block !important;
    margin: 0 auto !important
}
.chapterLoading {
    font-size: 20px;
    height: 30px;
    line-height: 32px;
    text-align: center;
}
    `;
    const showElement = () => {
        let ele = gx("//a[text()='下一章']");
        if (!ele) {
            ge('.view-comment').style.display = 'block';
        }
    };
    const editElement = () => {
        let end = gx("//ul[@class='view-bottom-bar']//a[contains(@href,'-end')]");
        if (end) {
            end.href = "/manhua-list-s2/";
            end.innerText = '最近更新';
        }
    };
    const addHistory = (title, url) => {
        history.pushState(null, title, url);
        document.title = title;
    };
    const addLoad = () => {
        let cl = document.createElement('div');
        cl.className = 'chapterLoading';
        cl.innerText = 'Loading...';
        ge('#cp_img,#barChapter').appendChild(cl);
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
        let next = gx("//ul[@class='view-bottom-bar']//a[text()='下一章' and not(contains(@href,'-end'))]");
        if (next) {
            let url = location.origin + next.href.split("'")[1];
            fetch(url).then(res => res.text()).then(res => {
                let doc = parseHTML(res);
                let title = gx("//title", doc).innerText.match(/_([^_]+)/)[1].replace(/,$/, '');
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
    const pcMode2PreloadNext = () => {
        let next = gx("//a[text()='下一章']");
        if (next) {
            fetch(next.href).then(res => res.text()).then(res => {
                let doc = parseHTML(res);
                let title = gx("//span[@class='active right-arrow']", doc).innerText.trim();
                let imgs = gae('#barChapter>img[data-src]', doc);
                let F = new DocumentFragment();
                imgs.forEach(e => {
                    let temp = new Image();
                    temp.src = e.dataset.src;
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
            if (!pcMode2()) {
                var code = null;
                if (mobile()) {
                    code = runCode(Array.from(doc.scripts).find(s => s.innerHTML.search(/newImgs/) > -1).innerHTML.trim().slice(4));
                } else {
                    code = Array.from(doc.scripts).find(s => s.innerHTML.search(/DM5_IMAGE_COUNT/) > -1).innerHTML;
                }
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.innerHTML = code;
                ge('#cp_img').appendChild(script);
            }
            insertData(doc);
        }).catch(error => {
            console.error(error);
            ge('.chapterLoading').innerText = '连接出错，可能下一章为付费章节。';
        });
    };
    const insertData = doc => {
        const pcData = async () => {
            if (!mkey) {
                var mkey = '';
            }
            for (let i = 1; i <= DM5_IMAGE_COUNT; i++) {
                let apiUrl = location.origin + DM5_CURL + 'chapterfun.ashx' + `?cid=${DM5_CID}&page=${i}&key=${mkey}&language=1>k=6&_cid=${DM5_CID}&_mid=${DM5_MID}&_dt=${DM5_VIEWSIGN_DT}&_sign=${DM5_VIEWSIGN}`;
                let res = await fetch(apiUrl);
                let resText = await res.text();
                let imgSrc = await runCode(resText)[0];
                let img = new Image();
                img.src = imgSrc;
                ge('#cp_img').appendChild(img);
            }
            addNextObserver();
        };
        const pc2Data = () => {
            let F = new DocumentFragment();
            let imgs = gae('#barChapter>img[data-src]', doc);
            imgs.forEach(e => {
                let img = new Image();
                img.src = e.dataset.src;
                F.appendChild(img);
            });
            ge('#barChapter').appendChild(F);
            imgs = null;
            setTimeout(() => {
                addNextObserver();
            }, 1700);
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
                ["//div[@class='view-fix-top-bar']", "//ul[@class='view-bottom-bar']", "//div[@class='view-fix-bottom-bar']"].forEach(e => {
                    gx(e).outerHTML = gx(e, doc).outerHTML;
                });
                title = gx("//title", doc).innerText.match(/_([^_]+)/)[1].replace(/,$/, '');
            } else {
                ["//div[@class='view-paging']", "//div[@class='rightToolBar']"].forEach(x => {
                    gax(x).forEach(e => {
                        e.outerHTML = gx(x, doc).outerHTML;
                    });
                });
                title = gx("//span[@class='active right-arrow']", doc).innerText.trim();
            }
            addTitle(title);
            if (options.remove[0] && options.remove[1] > 1) {
                removeOldChapter();
            }
            setTimeout(() => {
                removeLoad();
                if (mobile()) {
                    mobileData();
                    editElement();
                } else if (pcMode1()) {
                    pcData();
                    showElement();
                } else {
                    pc2Data();
                    showElement();
                }
            }, 300);
        } else {
            if (mobile()) {
                ge('#cp_img').innerHTML = '';
                mobileData();
                editElement();
            } else if (pcMode1()) {
                document.body.style.overflow = 'scroll';
                ge('#cp_img').innerHTML = '';
                pcData();
                showElement();
            } else {
                gae('#barChapter>img[data-src]').forEach(e => {
                    e.outerHTML = `<img src="${e.dataset.src}">`;
                });
                setTimeout(() => {
                    addNextObserver();
                }, 1300);
                showElement();
            }
        }
    };
    const nextObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                observer.unobserve(entry.target);
                let url, next;
                if (mobile()) {
                    next = gx("//ul[@class='view-bottom-bar']//a[text()='下一章' and not(contains(@href,'-end'))]");
                    if (next) url = location.origin + next.href.split("'")[1];
                } else {
                    next = gx("//a[text()='下一章']");
                    if (next) url = next.href;
                }
                if (next) {
                    console.log(`觸發載入下一話\n${url}`);
                    addLoad();
                    fetchData(url);
                }
            }
        });
    });
    const addNextObserver = () => {
        let lastImg = [...gae('#cp_img img,#barChapter img')].pop();
        let loadImg = new Image();
        loadImg.src = lastImg.src;
        loadImg.onload = () => {
            nextObserver.observe(lastImg);
            if (mobile() && options.pln) {
                mobilePreloadNext();
            } else if (pcMode2() && options.pln) {
                pcMode2PreloadNext();
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
            let removes = gae('#cp_img>*,#barChapter>*');
            for (let i in removes) {
                if (/chapterTitle/.test(removes[i].className)) {
                    break;
                }
                removes[i].remove();
            }
        }
    };

    if (pcMode1()) {
        console.log('DM5_PcMode1');
        addGlobalStyle(pcCss);
        addGlobalStyle(css);
        if (ge('#lb-win')) {
            ge('#lb-win').remove();
        }
        let loop = setInterval(() => {
            let set = ge('#cp_image');
            if (set) {
                clearInterval(loop);
                insertData();
                set.remove();
            }
        }, 100);
    } else if (pcMode2()) {
        console.log('DM5_PcMode2');
        addGlobalStyle(pcCss);
        addGlobalStyle(css);
        if (ge('#lb-win')) {
            ge('#lb-win').remove();
        }
        insertData();
    } else if (mobile()) {
        console.log('DM5_mobile');
        addGlobalStyle(mCss);
        addGlobalStyle(css);
        if (gae('.view-bottom-bar>li').length == 4) {
            addGlobalStyle(`.view-bottom-bar>li:nth-child(n+2):nth-child(-n+3){display:none !important}.view-bottom-bar li{width:50% !important}`);
        }
        insertData(document);
    }

})();
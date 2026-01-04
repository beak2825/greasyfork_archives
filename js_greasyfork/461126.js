// ==UserScript==
// @name               Manhuagui手機版閱讀輔助
// @name:en            Manhuagui Mobile Helpr
// @name:zh-CN         Manhuagui手机版阅读辅助
// @name:zh-TW         Manhuagui手機版閱讀輔助
// @version            1.5
// @description        Manhuagui 看漫畫手機版閱讀輔助,瀑布流閱讀連續載入圖片，自動點擊載入更多，在新分頁打開漫畫鏈接(自用)。
// @description:en     Manhuagui Mobile read infinite scroll,auto load more,manga link open in newtab
// @description:zh-CN  Manhuagui 看漫画手机版阅读辅助,瀑布流阅读连续载入图片，自动点击载入更多，在新分页打开漫画链接(自用)。
// @description:zh-TW  Manhuagui 看漫畫手機版閱讀輔助,瀑布流閱讀連續載入圖片，自動點擊載入更多，在新分頁打開漫畫鏈接(自用)。
// @author             tony0809
// @match              *://m.manhuagui.com/*
// @icon               https://www.google.com/s2/favicons?domain=m.manhuagui.com
// @grant              none
// @license            MIT
// @namespace          https://greasyfork.org/users/20361
// @downloadURL https://update.greasyfork.org/scripts/461126/Manhuagui%E6%89%8B%E6%A9%9F%E7%89%88%E9%96%B1%E8%AE%80%E8%BC%94%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/461126/Manhuagui%E6%89%8B%E6%A9%9F%E7%89%88%E9%96%B1%E8%AE%80%E8%BC%94%E5%8A%A9.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const options = { //true 開啟，false 關閉
        lM: true, //最近更新、漫畫大全、排行榜、書架，自動點擊載入更多。
        oint: true, //在新分頁打開漫畫鏈接。
        aH: true, //載入下一話時添加瀏覽器歷史紀錄。
        pln: true, //單線程預讀圖片，可減少等待加載圖片的時間，如果滾動、滑動的閱讀速度大於預讀速度還是需要待圖片載入。
        remove: [true, 4] //!!!不能小於2!!!閱讀載入超過n話時刪除前面話數的圖片。
    },
          ge = (selector, doc) => (doc || document).querySelector(selector),
          gae = (selector, doc) => (doc || document).querySelectorAll(selector),
          runCode = code => new Function('return ' + code)(),
          lp = location.pathname,
          update = /^\/update\/$/.test(lp),
          list = /^\/list\//.test(lp),
          rank = /^\/rank\/$/.test(lp),
          search = /^\/s\/[^.]+\.html$/.test(lp),
          read = /^\/comic\/\d+\/\d+\.html$/.test(lp),
          chapter = /^\/comic\/\d+\/$/.test(lp),
          user = /^\/user\/book\//.test(lp),
          loading_bak = 'data:image/png;base64,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',
          addGlobalStyle = css => {
              let style = document.createElement('style');
              style.type = 'text/css';
              style.innerHTML = css;
              document.head.appendChild(style);
          },
          css = `
.goback {
    background: url(/images/bg_main.png) -258px -80px no-repeat;
    position: fixed;
    left: 50%;
    margin-left: -20px;
    bottom: 0px;
    width: 40px;
    height: 40px;
}
.action-list li {
    width: 50% !important;
}
#action>ul>li:nth-child(n+2):nth-child(-n+3),
.manga-page,
.clickforceads {
    display: none !important;
}
.manga-box img {
    border-top: 0px !important;
    border-bottom: 0px !important;
}
.loading {
    font-size: 20px;
    font-family: Arial,sans-serif!important;
    height: 32px;
    line-height: 30px;
    border: none!important;
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
    `,
          openInNewTab = () => gae('#topSlider a:not([target=_blank]),.main-list a:not([target=_blank]),.cont-list a:not([target=_blank])').forEach(a => {
              a.setAttribute('target', '_blank');
          }),
          addGoBack = () => {
              let goback = document.createElement('div');
              goback.className = 'goback';
              goback.setAttribute('title', '返回頂部');
              goback.addEventListener('click', () => {
                  window.scrollTo({
                      top: 0,
                      behavior: "smooth"
                  });
              });
              document.body.appendChild(goback);
              const goBackOpacity = () => {
                  let dd = document.documentElement,
                      gb = ge('.goback'),
                      scrollTotal = dd.scrollHeight - dd.clientHeight;
                  if ((dd.scrollTop / scrollTotal) > 0.8) {
                      gb.style.opacity = 0.7;
                  } else {
                      gb.style.opacity = 0.2;
                  }
              };
              document.addEventListener('scroll', goBackOpacity);
          },
          autoLoadMore = () => {
              let loadMore = ge('#more:not([style*=none])>.more-go');
              new IntersectionObserver(entries => {
                  if (entries[0].isIntersecting) {
                      loadMore.click();
                  }
              }).observe(loadMore);
          },
          addHistory = (title, url) => {
              history.pushState(null, title, url);
              document.title = title;
          },
          addLoad = () => {
              let load = document.createElement('p');
              load.className = 'loading';
              load.innerText = 'Loading...';
              ge('#manga').appendChild(load);
          },
          removeLoad = () => {
              ge('.loading').remove();
          },
          addTitle = title => {
              let t = document.createElement('div');
              t.className = 'chapterTitle';
              t.innerText = title;
              let load = ge('.loading');
              load.parentNode.insertBefore(t, load);
          },
          parseHTML = str => {
              let doc;
              try {
                  doc = new DOMParser().parseFromString(str, 'text/html');
              } catch (e) {}
              if (!doc) {
                  doc = document.implementation.createHTMLDocument('');
                  doc.documentElement.innerHTML = str;
              }
              return doc;
          },
          loadImg = (src, str, i) => {
              return new Promise(resolve => {
                  let temp = new Image();
                  temp.src = src;
                  temp.onload = () => {
                      resolve(`${(str || '')}[Pic(${(i || 0) + 1})][Preload OK]\n${src}`);
                      temp = null;
                  };
                  temp.onerror = (e) => {
                      resolve(`${(str || '')}[Pic(${(i || 0) + 1})][Preload ERROR]\n${src}`);
                      setTimeout(() => {
                          console.log(`Preload重新載入圖片：\n${src}\n`, loadImg(src, str, i));
                      }, 500);
                      temp = null;
                  };
              });
          },
          picPreload = async (srcArray, str) => {
              for (let i = 0; i < srcArray.length; i++) {
                  let msg = await loadImg(srcArray[i], str, i);
                  console.log(msg);
                  msg = null;
              }
          },
          fetchData = url => {
              fetch(url).then(res => res.text()).then(res => {
                  let doc = parseHTML(res),
                      title = doc.title;
                  if (options.aH) {
                      addHistory(title, url);
                  }
                  insertData(doc);
              }).catch((error) => {
                  console.error('出錯鏈接:' + url + '\n', error);
                  ge('.loading').innerText = '連線出錯，請返回頂部重新載入。';
              });
          },
          imagesObserver = new IntersectionObserver((entries, observer) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      observer.unobserve(entry.target);
                      let realSrc = entry.target.dataset.src,
                          nE = entry.target.nextElementSibling;
                      if (realSrc) {
                          entry.target.src = realSrc;
                          entry.target.onerror = (error) => {
                              error.target.src = loading_bak;
                              setTimeout(() => {
                                  console.log(`Observer重新載入圖片：\n${realSrc}`);
                                  error.target.src = realSrc;
                                  console.log(error.target);
                              }, 500);
                          };
                      }
                      if (nE && nE.tagName == 'IMG' && nE.dataset.src) {
                          nE.src = nE.dataset.src;
                      }
                  }
              });
          }),
          nextObserver = new IntersectionObserver((entries, observer) => {
              entries.forEach(entry => {
                  if (entry.isIntersecting) {
                      observer.unobserve(entry.target);
                      let next = ge("a[data-action='chapter.next'][href$=html]");
                      if (next) {
                          let url = next.href;
                          console.log(`觸發載入下一話\n${url}`);
                          addLoad();
                          fetchData(url);
                      }
                  }
              });
          }),
          insertData = doc => {
              const code = Array.from(doc.scripts).find(s => s.innerHTML.search(/x6c/) > -1).innerHTML.trim().slice(26),
                    jsonData = JSON.parse(runCode(code).slice(11, -12)),
                    title = ge('#mangaTitle', doc).innerHTML.replace(/<.+>\s?/g, ''),
                    hostArray = ['i', 'eu', 'us'],
                    getRandom = max => Math.floor(Math.random() * Math.floor(max)),
                    randomHost = () => {
                        let choose = getRandom(hostArray.length);
                        let rValue = hostArray[choose];
                        return rValue;
                    },
                    srcArray = [],
                    F = new DocumentFragment();
              jsonData.images.forEach(e => {
                  let domain = location.protocol + "//" + randomHost() + ".hamreus.com",
                      src = `${domain+e}?e=${jsonData.sl.e}&m=${jsonData.sl.m}`,
                      img = new Image();
                  img.src = 'data:image/png;base64,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';
                  img.dataset.src = src;
                  srcArray.push(src);
                  imagesObserver.observe(img);
                  F.appendChild(img);
              });
              if (options.pln) {
                  picPreload(srcArray, `[${title}]`);
              }
              let load = ge('.loading');
              if (load) {
                  addTitle(title);
                  if (options.remove[0] && options.remove[1] > 1) {
                      removeOldChapter();
                  }
                  setTimeout(() => {
                      load.parentNode.insertBefore(F, load);
                      removeLoad();
                      addNextObserver();
                  }, 300);
              } else {
                  let E = ge('#manga');
                  E.innerHTML = '';
                  E.appendChild(F);
              }
              let curl = lp.replace(/\d+\.html$/, ''),
                  next = ge("a[data-action='chapter.next']"),
                  prev = ge("a[data-action='chapter.prev']");
              if (jsonData.nextId == 0) {
                  next.href = curl;
                  next.innerText = '返回目录';
              } else {
                  next.href = curl + jsonData.nextId + '.html';
              }
              if (jsonData.prevId > 0) {
                  prev.href = curl + jsonData.prevId + '.html';
              }
          },
          addNextObserver = () => {
              let lastImg = [...gae('#manga img')].pop();
              nextObserver.observe(lastImg);
          },
          removeOldChapter = () => {
              let titles = gae('.chapterTitle');
              if (titles.length > options.remove[1]) {
                  titles[0].remove();
                  let removes = gae('#manga>*');
                  for (let i in removes) {
                      if (/chapterTitle/.test(removes[i].className)) {
                          break;
                      }
                      removes[i].remove();
                  }
              }
          };

    if (read) {
        addGoBack();
        let loop = setInterval(() => {
            let set = ge('#manga img');
            if (set) {
                clearInterval(loop);
                insertData(document);
                addNextObserver();
            }
        }, 100);
    }

    if (options.oint && !read && !chapter) {
        openInNewTab();
        console.log('看漫画在新分頁打開漫畫鏈接');
        new MutationObserver(() => {
            openInNewTab();
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (options.lM && (update || user || list || rank || search)) {
        autoLoadMore();
    }

    addGlobalStyle(css);

})();
// ==UserScript==
// @name               包子漫畫閱讀輔助
// @name:en            Baozi Manga Read Helpr
// @name:zh-CN         包子漫画阅读辅助
// @name:zh-TW         包子漫畫閱讀輔助
// @version            2.5.10
// @description        包子漫畫閱讀輔助,瀑布流閱讀連續載入圖片，在新分頁打開漫畫鏈接(自用)。
// @description:en     read infinite scroll,manga link open in newtab
// @description:zh-CN  包子漫画阅读辅助,瀑布流阅读连续载入图片，在新分页打开漫画链接(自用)。
// @description:zh-TW  包子漫畫閱讀輔助,瀑布流閱讀連續載入圖片，在新分頁打開漫畫鏈接(自用)。
// @author             tony0809
// @match              *://cn.baozimh.com/*
// @match              *://cn.webmota.com/*
// @match              *://tw.baozimh.com/*
// @match              *://tw.webmota.com/*
// @match              *://www.baozimh.com/*
// @match              *://www.webmota.com/*
// @match              *://cn.kukuc.co/*
// @match              *://tw.kukuc.co/*
// @match              *://www.kukuc.co/*
// @match              *://tw.czmanga.com/*
// @match              *://cn.czmanga.com/*
// @match              *://www.czmanga.com/*
// @match              *://tw.dzmanga.com/*
// @match              *://cn.dzmanga.com/*
// @match              *://www.dzmanga.com/*
// @match              *://tw.dociy.net/*
// @match              *://cn.dociy.net/*
// @match              *://www.dociy.net/*
// @match              *://www.twmanga.com/*
// @match              *://tw.twmanga.com/*
// @match              *://cn.twmanga.com/*
// @match              *://www.tbmanga.com/*
// @match              *://tw.tbmanga.com/*
// @match              *://cn.tbmanga.com/*
// @match              *://www.hcmanga.com/*
// @match              *://tw.hcmanga.com/*
// @match              *://cn.hcmanga.com/*
// @icon               https://www.baozimh.com/favicon.ico
// @require            https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @license            MIT
// @namespace          https://greasyfork.org/users/20361
// @downloadURL https://update.greasyfork.org/scripts/461127/%E5%8C%85%E5%AD%90%E6%BC%AB%E7%95%AB%E9%96%B1%E8%AE%80%E8%BC%94%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/461127/%E5%8C%85%E5%AD%90%E6%BC%AB%E7%95%AB%E9%96%B1%E8%AE%80%E8%BC%94%E5%8A%A9.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const options = { //true 開啟，false 關閉
        oint: true, //在新分頁打開漫畫鏈接。
        aH: true, //載入下一話時添加瀏覽器歷史紀錄
        aO: true, //目錄頁自動展開全部章節。
        pln: true, //1頁1線程逐張預讀的圖片，可減少等待加載圖片的時間，如果滾動、滑動的閱讀速度大於預讀速度還是需要待圖片載入。
        topBtn: false, //添加返回頂部按鈕
        remove: [true, 4] //!!!不能小於2!!!閱讀載入超過n話時刪除前面話數的圖片。
    },
          ge = (selector, doc) => (doc || document).querySelector(selector),
          gae = (selector, doc) => (doc || document).querySelectorAll(selector),
          gx = (xpath, doc) => (doc || document).evaluate(xpath, (doc || document), null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
          lp = location.pathname,
          home = /^\/$/.test(lp),
          classify = /^\/classify/.test(lp),
          list = /^\/list\/new/.test(lp),
          search = /^\/search\?/.test(lp),
          comic = /^\/comic\/[^.]+$/.test(lp),
          read = /^\/comic\/chapter\/[^.]+\.html$/.test(lp),
          loading_bak = 'data:image/png;base64,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',
          openInNewTab = () => gae('.comics-card a:not([target=_blank]),.bookshelf-items a:not(.remove-img):not([target=_blank])').forEach(a => {
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
          },
          removeAd = () => {
              let loop = setInterval(() => {
                  let ad = ge('#interstitial_fade');
                  if (ad) {
                      clearInterval(loop);
                      ad.remove();
                  }
              }, 100);
              setTimeout(() => {
                  if (loop) clearInterval(loop);
              }, 1e4);
              gae('.mobadsq').forEach(e => {
                  e.remove();
              });
          },
          addHistory = (title, url) => {
              history.pushState(null, title, url);
              document.title = title;
          },
          showElement = () => {
              let end = gx("//div[@class='next_chapter']/span[text()='这是本作品最后一话了' or text()='這是本作品最後一話了']");
              if (end) {
                  ge('.next_chapter+.l-content').style.display = 'block';
                  const observer = new IntersectionObserver((entries, observer) => {
                      entries.forEach(entry => {
                          if (entry.isIntersecting) {
                              observer.unobserve(entry.target);
                              let e = entry.target;
                              setTimeout(() => {
                                  let noImg = e.querySelector('div.i-amphtml-svc');
                                  if (noImg) {
                                      noImg.remove();
                                      let img = new Image();
                                      img.setAttribute('decoding', 'async');
                                      img.setAttribute('alt', e.getAttribute('alt'));
                                      img.src = e.getAttribute('src');
                                      img.className = 'i-amphtml-svc i-amphtml-loading-container i-amphtml-fill-content';
                                      e.appendChild(img);
                                  }
                              }, 200);
                          }
                      });
                  });
                  gae('.l-box a>amp-img').forEach(amp => {
                      observer.observe(amp);
                  });
              }
          },
          addLoad = () => {
              let cl = document.createElement('div');
              cl.className = 'chapterLoading';
              let li = new Image();
              li.className = 'loadingImg';
              li.src = '/_nuxt/img/loading.12fdcc4.gif';
              li.style.width = '50px';
              cl.appendChild(li);
              let lt = document.createElement('div');
              lt.className = 'loadingText';
              lt.innerText = 'Loading...';
              cl.appendChild(lt);
              ge('.comic-contain').appendChild(cl);
          },
          removeLoad = () => {
              ge('.chapterLoading').remove();
          },
          addTitle = title => {
              let t = document.createElement('div');
              t.className = 'chapterTitle';
              t.innerText = title;
              let load = ge('.chapterLoading');
              load.parentNode.insertBefore(t, load);
          },
          parseHTML = str => {
              var doc = null;
              try {
                  doc = new DOMParser().parseFromString(str, 'text/html');
              } catch (e) {}
              if (!doc) {
                  doc = document.implementation.createHTMLDocument('');
                  doc.documentElement.innerHTML = str;
              }
              return doc;
          },
          getNextLink = () => {
              let nextlink = null;
              let next = ge('#next-chapter');
              if (next) {
                  nextlink = next.href;
                  //可能會遇到當前域名和下一頁鏈接的域名不同，導致發生跨域請求出錯的情況，需替換為當前域名。
                  const nh = next.host,
                        lh = location.host;
                  if (nh !== lh) {
                      nextlink = nextlink.replace(nh, lh);
                  }
              }
              return nextlink;
          },
          picPreload = async (imgsArray, index, str) => {
              const loadImg = src => {
                  return new Promise(resolve => {
                      let num = src.match(/(\d+)\.[a-z]{3,5}$/i)[1];
                      let temp = new Image();
                      temp.src = src;
                      temp.onload = () => {
                          resolve(`${(str || '')}[Pic(${num})][Preload OK]\n${src}`);
                          temp = null;
                      };
                      temp.onerror = (e) => {
                          resolve(`${(str || '')}[Pic(${num})][Preload ERROR]\n${src}`);
                          setTimeout(() => {
                              console.log(`Preload重新載入圖片：\n${src}\n`, loadImg(src));
                          }, 500);
                          temp = null;
                      };
                  });
              };
              for (let i = index; i < imgsArray.length; i++) {
                  let msg = await loadImg(imgsArray[i].getAttribute('src'));
                  console.log(msg);
                  msg = null;
              }
          },
          preloadNext = () => {
              let url = getNextLink();
              if (url !== null) {
                  fetch(url).then(res => res.text()).then(res => {
                      var doc = null;
                      doc = parseHTML(res);
                      let imgs = gae('.comic-contain amp-img', doc);
                      let title = ge('span.title', doc).innerText;
                      let firstImgSrcNum = imgs[0].getAttribute('src').match(/(\d+)\.[a-z]{3,5}$/i)[1];
                      const num = (n) => Math.round(n / 50 + 1);
                      picPreload(imgs, 0, `[${title} part${num(firstImgSrcNum)}]`);
                  });
              }
          },
          fetchData = url => {
              fetch(url).then(res => res.text()).then(res => {
                  let doc = parseHTML(res);
                  insertData(doc, url);
              }).catch(error => {
                  console.error(error);
                  ge('.loadingImg').style.display = 'none';
                  ge('.loadingText').innerText = '連線出錯，請返回頂部重新載入。';
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
                      let url = getNextLink();
                      if (url !== null) {
                          console.log(`觸發載入下一頁\n${url}`);
                          addLoad();
                          fetchData(url);
                      }
                  }
              });
          }),
          insertData = (doc, url) => {
              let imgs = gae('.comic-contain amp-img', doc);
              let F = new DocumentFragment();
              let n = 0;
              if (ge('.comic-contain>img')) {
                  let currentLastImgSrc = [...gae('.comic-contain>img')].pop().src;
                  let nextFirstImgSrc = imgs[0].dataset.src ? imgs[0].dataset.src : imgs[0].getAttribute('src');
                  //當目前最後一張圖片檔名是50的倍數和下一頁第一張圖片檔名尾數是7且尾數不是1時，則不插入下一頁的前4張圖，讓條漫整體圖片按正確順序銜接。
                  if (/\/(50|100|150|200|250|300)\.[a-z]{3,5}$/i.test(currentLastImgSrc) && /\/(\d+)?7\.[a-z]{3,5}$/i.test(nextFirstImgSrc) && !/\/(\d+)?1\.[a-z]{3,5}$/i.test(nextFirstImgSrc)) {
                      n = 4;
                  }
              }
              for (let i = n; i < imgs.length; i++) {
                  let img = new Image();
                  img.className = 'comic-contain__item';
                  img.src = loading_bak;
                  img.dataset.src = imgs[i].dataset.src ? imgs[i].dataset.src : imgs[i].getAttribute('src');
                  imagesObserver.observe(img);
                  F.appendChild(img);
              }
              let load = ge('.chapterLoading');
              if (load) {
                  ['.comic-chapter>.next_chapter', '.bottom-bar', 'span.title'].forEach(e => {
                      ge(e).outerHTML = ge(e, doc).outerHTML; //替換元素
                  });
                  showElement();
                  let title = ge('span.title', doc).innerText.replace(/\(\d\/\d+\)/, "");
                  if (!/\/\d+_\d+_\d+\.html$/.test(url)) { //是下一話才添加標題分隔條，下一頁則不添加。
                      let docTitle = doc.title;
                      if (options.aH) {
                          addHistory(docTitle, url);
                      }
                      addTitle(title);
                  }
                  if (options.remove[0] && options.remove[1] > 1) {
                      removeOldChapter();
                  }
                  setTimeout(() => {
                      load.parentNode.insertBefore(F, load);
                      removeLoad();
                      if (options.pln) {
                          preloadNext();
                      }
                      addNextObserver();
                  }, 300);
              } else {
                  showElement();
                  let E = ge('.comic-contain');
                  E.innerHTML = '';
                  E.appendChild(F);
              }
          },
          addNextObserver = () => {
              let lastImg = [...gae('.comic-contain img')].pop();
              nextObserver.observe(lastImg);
          },
          removeOldChapter = () => {
              let titles = gae('.chapterTitle');
              if (titles.length > options.remove[1]) {
                  titles[0].remove();
                  let removes = gae('.comic-contain>*');
                  for (let i in removes) {
                      if (/chapterTitle/.test(removes[i].className)) {
                          break;
                      }
                      removes[i].remove();
                  }
              }
          },
          addGlobalStyle = css => {
              let style = document.createElement('style');
              style.type = 'text/css';
              style.innerHTML = css;
              document.head.appendChild(style);
          },
          readCss = `
.goback {
    background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0IArs4c6QAAAgpJREFUSEvtlD2IE0EYht9vJBeRQxIU5AoPCwsFGwsRrAQRzztRRFeEa6LsfiyBgJ2FrYWdSDjITH4uhYK4Ih74g4qFjSAWFoJYWCgKIigbVCSYzYxsGCXJ5ZLlDq6QTDPs9/M+H+/MDmGdFq0TB2PQqp0eW0fMfAUAKaUuAjBJvUxsneM4G7LZbBnAOSu+GIahFwRBOwksESiXy21MpVI3iehEt6gxZqnVap2t1+vNUbCRoEKhsLnZbC4R0UEr9tvuE3Z/lk6njxeLxe/DYENBrutuE0I8BLDXivwEcIqIjDHmDoBJG3+ltT5aqVS+rARbEeT7/g6t9RMAO23zNwBzSqkX8Tcz7wdwH8AWm38nhDhcKpXeD4INBPm+v0dr/RjAlG36SEQzUso33SKu6+4WQjwCsN3GPwM4opR63Q9bBvI87wAR3QOQtcVv2+32TLVa/TBoUmaeBhDDdtl8aIw5Vi6Xn3fX94CYeQ7ALQCbbNFLALNKqa/DDpqZtwJ4AGCfrfsF4IxSKra2s/6BPM+bJ6JFACmbexpF0clarfZj1NWN8/l8fjKKorsADtn6FhGdl1Je7wEx81UAF+KgMeZ2o9GYD4Lg71VOwoLjOBOZTOYGEZ3uiBNdk1J2NPutuwRgOgzDfNI/vn8C+4IsENEnKeXlZdYlGnkNRSNfhjVo97SOQat28v+z7g/utJ8bMvScRQAAAABJRU5ErkJggg==) no-repeat;
    background-position:bottom 6px right 5px;
    opacity: 0.7;
    border-radius: 50%;
    position: fixed;
    z-index:999;
    bottom: 7px;
    left: 50%;
    margin-left: -16px;
    width: 36px;
    height: 36px;
}
.mobadsq {
    display: none !important
}
ul {
    margin-block-start: -2px !important;
    margin-block-end: 2px !important
}
.chapterLoading {
    font-size: 20px;
    height: 80px;
    line-height: 32px;
    text-align: center;
    margin-bottom: 20px;
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
.next_chapter + .l-content {
    display: none;
}
          `;
/*
    if (home) {
        addGlobalStyle(`amp-addthis[data-widget-type=floating]{display:none !important}`);
        ge('amp-addthis[data-widget-type=floating]').remove();
    }
*/
    if (read) {
        document['onkeydown'] = null;
        removeAd();
        addGlobalStyle(readCss);
        if (options.topBtn) addGoBack();
        let imgs = [...gae('.comic-contain amp-img')];
        let title = ge('span.title').innerText;
        if (imgs.length > 3 && options.pln) picPreload(imgs, 3, `[${title} part1]`);
        insertData(document);
        addNextObserver();
        if (options.pln) preloadNext();
/*
        const hidetoolbar = () => {
            var e = e || window.event;
            if (e.wheelDelta < 0 || e.detail > 0) {
                $('div.header').attr('style', 'top: -44px;');
                $('div.bottom-bar').attr('style', 'bottom: -50px;')
            } else {
                $('div.header').attr('style', 'transform: translateY(0%);');
                $('div.bottom-bar').attr('style', 'transform: translateY(0%);')
            }
        };
        $('body').on('wheel', hidetoolbar);
        $('body').on('DOMMouseScroll', hidetoolbar);

        const keyhidetoolbar = (e) => {
            let key = window.event ? e.keyCode : e.which;
            if (key == '34' || key == '32' || key == '40') {
                $('div.header').attr('style', 'top: -44px;');
                $('div.bottom-bar').attr('style', 'bottom: -50px;')
            } else {
                $('div.header').attr('style', 'transform: translateY(0%);');
                $('div.bottom-bar').attr('style', 'transform: translateY(0%);')
            }
        };
        $('body').on('keydown', keyhidetoolbar);

        if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)) {
            let startY, moveY, Y;
            $('body').on('touchstart', (e) => {
                startY = e.originalEvent.changedTouches[0].pageY;
            });
            $('body').on('touchmove', (e) => {
                moveY = e.originalEvent.changedTouches[0].pageY;
                Y = moveY - startY;
                if (Y < 0) {
                    $('div.header').attr('style', 'top: -44px;');
                    $('div.bottom-bar').attr('style', 'bottom: -50px;')
                } else if (Y > 0) {
                    $('div.header').attr('style', 'transform: translateY(0%);');
                    $('div.bottom-bar').attr('style', 'transform: translateY(0%);')
                }
            });
        }
*/
    }

    if (options.oint && !comic && !read) {
        openInNewTab();
        new MutationObserver(() => {
            openInNewTab();
        }).observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (options.aO && comic) {
        let button = ge('#button_show_all_chatper');
        new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                button.click();
            }
        }).observe(button);
    }

})();
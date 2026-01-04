// ==UserScript==
// @name           Search posts
// @name:ru        Поиск постов
// @description    Search for posts by user(-s) or(and) text in current topic
// @description:ru Найти посты по пользователю(-ям) и(или тексту в текущей теме
// @version        4.0.0
// @date           28.08.2018
// @author         Halibut
// @namespace      https://greasyfork.org/en/users/145947-halibut
// @homepageURL    https://greasyfork.org/en/scripts/36319-search-posts-by-user
// @supportURL     https://forum.ru-board.com/topic.cgi?forum=2&topic=5673&glp
// @license        HUG-WARE
// @include        http*://forum.ru-board.com/topic.cgi?forum=*&topic=*
// @noframes
// @run-at         document-start
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/36319/Search%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/36319/Search%20posts.meta.js
// ==/UserScript==

/******************************************************************************
 * "THE HUG-WARE LICENSE" (Revision 2): As long as you retain this notice you *
 * can do whatever you want with this stuff. If we meet some day, and you     *
 * think this stuff is worth it, you can give me/us a hug.                    *
******************************************************************************/

window.addEventListener("DOMContentLoaded", function f() {
    'use strict';
    this.removeEventListener("DOMContentLoaded", f);
    const body = document.body,
          style = document.head.appendChild(document.createElement("style")),
          dats = [...document.getElementsByClassName("tb")].map(el => el.getElementsByClassName("dats")[0]),
          listener = {
              options: {
                  // <--- ОПЦИИ СКРИПТА --->
                  showAlerts: false // Показывать алерты по окончании поиска
                  , scrollToSearchResults: true  // Автоматически прокручивать страницу к результатам поиска
                                                 // (если showAlerts == true, то, при подтверждении, все-равно прокрутит к результатам)
                  , hideSearchButton: false // Показывпть кнопку поиска только при наведении курсора на пост
                  , autoOpenSpoilerWithResult: false // Раскрывать спойлер с результатами поиска автоматически
                  , reversPostSorting: true // обратить сортировку по дате для найденных постов (от новых к старым)
                  , headToResult: false // Включать шапку темы (если она создана выбранным пользоватем или в ней найден текст) в результаты поиска
                  , srchInSigs: false // Искать ли, при по тексту, в подписях пользователей
                  , srchInQuotes: false //  Искать ли, при по тексту, в цитатах
                  , imgsToLinks: true // Заменять изображения в найденных постах ссылками на них
                  , createCnMenu: true // Добавить в контекстное меню пункт запускающий поиск (только для FF)
                  , searchOnProfileLinksByRMB: true // Поиск при клике по ссылкам ведущим на профиль пользователя
                                                    // (только если нет выделенного текста и не нажаты клавиши модификаторы)
                  , fillSearchFormWithNames: true // Заполнять в диалоговом окне поиска по тексту поле именем(-ами)
                  , nameToFillSrchForm: null // Впишите сюда имя (в кавычках) которым всегда будет заполняться поле имени в форма поиска по ПКМ
                  // Список имен которые можно будет выбрать из выпадающего меню в форме поиска --->
                  , namesToSearch: ['Name1', 'Name2', 'Name3', 'etc...']
                  , highlightMatches: false // Включает подсветку совпадений в тексте найденных постов.
                                           // Влияет на производительность и может поломать верстку постов
                                           // (если, например, часть найденной фразы находится внутри одного элемента, а часть - за его пределами).
                                           // Подсветит результат и в цитатах / подписях, даже при их исключении из поиска (только подсветит, на результаты не влияет)
                  , highlightColor: 'yellow' // Цвет подсветки (html color, rgb(a) / hsl(a) / hex, etc)
              }
              , names: []
              , xhrPool: []
              , txt: ''
              , dtStmp: null
              , ttlShow: '\u25BA Показать результаты поиска'
              , ttlHide: '\u25BC Скрыть результаты поиска'
              , ttlLdng: '\u23F3 Поиск... (Нажмите, чтобы прервать текущие незавершенные запросы)'
              , ttlNotFnd: '\u26A0 Постов не найдено!'
              , get name() {
                  return this.name = this.getName()
              }
              , set name(str) {
                  return this.setName(str)
              }
              , get text() {
                  const text = this.txt;
                  delete this.txt;
                  return text;
              }
              , set text(str) {
                  if (str)
                      return this.txt = str;
              }
              , get win() {
                  delete this.win;
                  return this.win = window.top
              }
              , get loc() {
                  delete this.loc;
                  return this.loc = this.win.location.href
              }
              , get actnBox() {
                  delete this.actnBox;
                  return this.actnBox = [...document.getElementsByTagName("table")].find(el => el.querySelector("a[href^='post.cgi?action=new']")
                                                                                         || !el.getElementsByTagName('td')[0].children.length)
              }
              , get isFF() {
                  delete this.isFF;
                  return this.isFF = this.win.navigator && this.win.navigator.userAgent && this.win.navigator.userAgent.toLowerCase().includes("firefox")
              }
              , get spHd() {
                  delete this.spHd;
                  return this.spHd = this.getSpHd()
              }
              , get spBd() {
                  delete this.spBd;
                  return this.spBd = this.getSpBd()
              }
              , get spTTl() {
                  delete this.spTTl;
                  return this.spTTl = this.spHd && this.spHd.getElementsByTagName('td')[0]
              }
              , get navBox() {
                  delete this.navBox;
                  return this.navBox = this.getNavBox()
              }
              , getSel() {
                  return this.win.getSelection && this.win.getSelection().toString() || ""
              }
              , abortXhrs() {
                  if (!this.xhrPool.length) return;
                  for (const xhr of this.xhrPool)
                      xhr && xhr.abort();
                  this.xhrPool.length = 0
              }
              , prepareSntc(str, cs, ww) {
                  const escStr = s => s.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&').replace(/\s+/g, '\\s+'),
                        rgxp = s => new RegExp(s, cs ? 'i' : ''),
                        wwrgxp = s => new RegExp('(?:[^а-яА-Яa-zA-Z0-9]|^)' + s + '(?:(?!(?=[а-яА-Яa-zA-Z0-9]))|$)', cs ? 'i' : '');
                  if (Array.isArray(str)) {
                      str = str.map(el => escStr(el));
                      return ww ? wwrgxp('(?:' + str.join('|') + ')') : rgxp(str.join('|'))
                  }
                  if (ww) {
                      return wwrgxp(escStr(str))
                  }
                  else {
                      return rgxp(escStr(str))
                  }
              }
              , getCrntPost(arr) {
                  const clst = this.isFF ? 0 : parseInt(this.win.innerHeight / 2);
                  return arr.reduce((prev, curr) => (Math.abs(curr - clst) < Math.abs(prev - clst) ? curr : prev))
              }
              , spawn(gen) {
                  const continuer = (verb, arg) => {
                            let result;
                            try {
                                result = generator[verb](arg);
                            } catch (err) {
                                return Promise.reject(err);
                            }
                            if (result.done) {
                                return result.value;
                            } else {
                                return Promise.resolve(result.value).then(onFulfilled, onRejected);
                            };
                        },
                        generator = gen(),
                        onFulfilled = continuer.bind(continuer, 'next'),
                        onRejected = continuer.bind(continuer, 'throw');
                  return onFulfilled();
              }
              , prompt(name, txt) {
                  return new Promise((res, rej) => {
                      body.appendChild(document.createElement('div')).outerHTML = html;
                      const mdlOverlay = document.getElementById('spu-modal'),
                            clsBtn = document.getElementById('spu-close'),
                            regChkbx = document.getElementById('spu-regexp'),
                            csChkbx = document.getElementById('spu-case'),
                            highlight = document.getElementById('spu-highlight'),
                            sig = document.getElementById('spu-sig'),
                            qt = document.getElementById('spu-qt'),
                            sntChkbx = document.getElementById('spu-sentence'),
                            wholeWord = document.getElementById('spu-whole'),
                            flgsFrm = document.getElementById('spu-flags'),
                            txtFrm = document.getElementById('spu-txtarea'),
                            nmsFrm = document.getElementById('spu-names'),
                            nmsBtn = document.getElementById('spu-names-list'),
                            srchBtn = document.getElementById('spu-srch-strt'),
                            fromOld= document.getElementById('spu-fromold'),
                            fromNew= document.getElementById('spu-fromnew'),
                            nmsMenu = document.getElementById('spu-nms-menu'),
                            hdToResult = document.getElementById('spu-head'),
                            imgs = document.getElementById('spu-imgs');
                      name && (nmsFrm.value = name); txt && (txtFrm.value = txt); txtFrm.focus();
                      for (const nm of this.options.namesToSearch) {
                          if (nm) {
                              const menuitem = nmsMenu.appendChild(document.createElement('li'));
                              menuitem.textContent = nm;
                              menuitem.onclick = () => nmsFrm.value += (nmsFrm.value ? ',' + nm : nm);
                          }
                      };
                      csChkbx.checked = true;
                      hdToResult.checked = this.options.headToResult;
                      hdToResult.onclick = () => {
                          this.options.headToResult = hdToResult.checked
                      }
                      imgs.checked = this.options.imgsToLinks;
                      imgs.onclick = () => {
                          this.options.imgsToLinks = imgs.checked
                      }
                      highlight.checked = this.options.highlightMatches;
                      highlight.onclick = () => {
                          this.options.highlightMatches = highlight.checked
                      }
                      sig.checked = this.options.srchInSigs;
                      sig.onclick = () => {
                          this.options.srchInSigs = sig.checked
                      }
                      qt.checked = this.options.srchInQuotes;
                      qt.onclick = () => {
                          this.options.srchInQuotes = qt.checked
                      }
                      txt && txt.startsWith('"') && txt.endsWith('"') && (sntChkbx.checked = true);
                      for (const el of [...mdlOverlay.getElementsByClassName('clear-form')])
                          el && (el.onclick = () => el.nextElementSibling.value = '');
                      clsBtn.onclick = () => {
                          mdlOverlay.remove(); body.onwheel = null; this.names.length = 0; res(null);
                      }
                      mdlOverlay.onclick = mdlOverlay.oncontextmenu = mdlOverlay.onwheel = e => {
                          if (e.target != mdlOverlay) return;
                          e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                      };
                      body.onwheel = e => {
                          e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                      };
                      nmsBtn.onclick = () => {
                          nmsMenu.hidden = !nmsMenu.hidden
                      };
                      sntChkbx.onclick = () => {
                          let quoted, val = txtFrm.value.trim(), indx = val.indexOf('NOT'), excl = indx != -1 ? ' ' + val.substring(indx) : '';
                          excl && (val = val.substring(0, indx).trimRight());
                          quoted = val && val.startsWith('"') && val.endsWith('"');
                          sntChkbx.checked
                              ? !quoted && (val = '"' + val + '"')
                              : quoted && (val = val.slice(val.indexOf('"') + 1, val.lastIndexOf('"')));
                          txtFrm.value = val + excl;
                      }
                      this.options.reversPostSorting ? (fromNew.checked = true) : (fromOld.checked = true)
                      fromNew.onclick = fromOld.onclick = () => {
                          this.options.reversPostSorting = fromNew.checked;
                      }
                      regChkbx.onclick = e => {
                          flgsFrm.disabled = flgsFrm.hidden = !regChkbx.checked;
                          sntChkbx.disabled = csChkbx.disabled = wholeWord.disabled = regChkbx.checked;
                          !regChkbx.checked && (flgsFrm.value = '');
                      }
                      srchBtn.onclick = () => {
                          const val = {n: nmsFrm.value, t: regChkbx.checked ? txtFrm.value : txtFrm.value.trim(), rgxp: regChkbx.checked, flags: flgsFrm.value, cs: csChkbx.checked, ww: wholeWord.checked};
                          body.onwheel = null; mdlOverlay.remove();
                          res(val);
                      }
                  })
              }
              , getPosts([url, page], name, txt, stmp) {
                  return new Promise((res, rej) => {
                      if (this.dtStmp === null) res(null);
                      else if (this.dtStmp !== stmp) rej([null, stmp]);
                      const rmv = itm => this.xhrPool.splice(this.xhrPool.indexOf(itm), 1);
                      let posts;
                      if (url == this.loc) {
                          posts = document.getElementsByClassName('tb');
                          if (posts && !!posts.length)
                              posts = this.filterPosts([...posts].map(el => el && el.cloneNode(true)), name, txt, page);
                          res(posts);
                      };
                      const xhr = new XMLHttpRequest();
                      xhr.open("GET", url, true);
                      xhr.onload = re => {
                          rmv(xhr);
                          if (this.dtStmp !== null && this.dtStmp !== stmp) rej([null, stmp]);
                          if (!(xhr.readyState == 4 && xhr.status == 200)) res(null);
                          posts = xhr.responseXML && xhr.responseXML.getElementsByClassName('tb');
                          if (posts && !!posts.length) {
                              posts = this.filterPosts([...posts], name, txt, page);
                              res(posts)
                          }
                          else
                              res(null)
                      }
                      xhr.onerror = xhr.ontimeout = xhr.onabort = () => {
                          rmv(xhr); res(null)
                      }
                      xhr.responseType = "document";
                      this.xhrPool.push(xhr);
                      xhr.send();
                  })
              }
              , procesPosts(posts, stmp) {
                  return new Promise((res, rej) => {
                      if (this.dtStmp !== null && this.dtStmp !== stmp) {
                          posts && (posts.length = 0);
                          rej([null, stmp])
                      }
                      posts = this.flatPosts(posts).filter(Boolean);
                      if (posts && !!posts.length) {
                          if (this.options.imgsToLinks)
                              posts = this.imgsToLinks(posts);
                          for (let post = 0; posts.length; post++)
                              this.spBd.appendChild(this.options.reversPostSorting ? posts.pop() : posts.shift());
                          this.spBd.appendChild(this.navBox);
                          res([null, stmp]);
                      }
                      else
                          rej(['not found', stmp]);
                  })
              }
              , filterPosts(posts, name, txt, page) {
                  return posts.filter(post => {
                      const isUser = name && name.includes(post.querySelector("td.dats b").textContent.toLowerCase().replace(/\s/g, '_')),
                            chkHead = this.options.headToResult && page == 1 || !post.querySelector('a.tpc[href$="&postno=1"]'),
                            isText = () => {
                                const pstEl = post.getElementsByClassName('post')[0],
                                      highligthMatches = () => {
                                          if (this.options.highlightMatches) {
                                              const rgxp = str => {
                                                  let source = str.source,
                                                      flags = str.toString().match(/[gimuy]*$/)[0];
                                                  source = source.replace(/\s+|\\s\+?/g, '(?:[<>&;\\w\\s]+)');
                                                  flags = flags.includes('g') ? flags : flags + 'g';
                                                  return new RegExp(source, flags);
                                              }
                                              if (Array.isArray(txt.val))
                                                  for (const sntnc of txt.val)
                                                      pstEl.innerHTML = pstEl.innerHTML.replace(rgxp(sntnc), '<spu-layer>$&</spu-layer>');
                                              else
                                                  pstEl.innerHTML = pstEl.innerHTML.replace(rgxp(txt.val), '<spu-layer>$&</spu-layer>');
                                          }
                                          return true;
                                      };
                                let pstTxt;
                                if (!this.options.srchInSigs || !this.options.srchInQuotes) {
                                    const cpEl = pstEl.cloneNode(true);
                                    if (!this.options.srchInSigs) {
                                        const lstChld = cpEl.lastElementChild;
                                        lstChld && lstChld.className == 'sing' && lstChld.remove();
                                    }
                                    if (!this.options.srchInQuotes) {
                                        const qtHdr = [...cpEl.getElementsByTagName('small')].filter(el => el.textContent == 'Цитата:'),
                                              qtBd = qtHdr.map(el => el.nextElementSibling).filter(el => el && el.localName == 'table');
                                        for (const qts of [...qtHdr, ...qtBd])
                                            qts && qts.remove();
                                    }
                                    pstTxt = cpEl.textContent;
                                }
                                else
                                    pstTxt = pstEl.textContent;
                                if (!(pstTxt && !!pstTxt.length)) return false;
                                if (txt.exclude) {
                                    const isCntsExcludes = Array.isArray(txt.exclude)
                                        ? txt.exclude.some(el => {
                                            if (Array.isArray(el)) {
                                                return el.every(sntnc => sntnc.test(pstTxt))
                                            }
                                            else {
                                                return el.test(pstTxt)
                                            }
                                        })
                                        : txt.exclude.test(pstTxt);
                                    if (isCntsExcludes) {
                                        return false;
                                    }
                                    else if (!txt.val) {
                                        return true
                                    }
                                }
                                switch (txt.type) {
                                    case 'all': {
                                        return txt.val.every(sntnc => sntnc.test(pstTxt)) && highligthMatches(pstEl)
                                    }; break;
                                    case 'rgxp':
                                    case 'snt': {
                                        return txt.val.test(pstTxt) && highligthMatches(pstEl)
                                    }; break;
                                    case 'some':
                                    case 'any': {
                                        return (Array.isArray(txt.val) ? txt.val.some(sntnc => sntnc.test(pstTxt)) : txt.val.test(pstTxt)) && highligthMatches(pstEl)
                                    }; break;
                                }
                            };
                      if (name && chkHead && isUser)
                          return txt ? isText() : true
                      else if (!name)
                          return chkHead && isText()
                  });
              }
              , flatPosts(posts) {
                  return posts.reduce((a, b) => a.concat(b), [])
              }
              , imgsToLinks(posts) {
                  return posts.map(post => {
                      const postEl = post.getElementsByClassName('post')[0],
                            imgs = [...postEl.getElementsByTagName('img')].filter(el => el && el.src && !el.src.includes('://forum.ru-board.com/board/s/'));
                      for (const img of imgs) {
                          const imgLink = img.closest('a[href]'),
                                link = document.createElement('a');
                          link.href = img.src; link.target = '_blank'; link.textContent = '[IMG][/IMG]';
                          img.parentNode.replaceChild(link, img);
                          if (imgLink) {
                              imgLink.parentNode.insertBefore(link, imgLink);
                              imgLink.textContent = '[URL][/URL]';
                          }
                      }
                      return post
                  })
              }
              , getName() {
                  const name = [...new Set(this.flatPosts(this.names))].join(',').replace(/(?:\s+)?,(?:\s+)?/g, ',').replace(/\s/g, "_").toLowerCase().split(',').filter(Boolean);
                  if (name && !!name.length)
                      return name
              }
              , setName(str) {
                  if (str)
                      return this.names.push(str);
              }
              , getSearchQuery(str, cs, ww) {
                  const query = {type: null, val: null, exclude: null, cs: cs, ww: ww};
                  if (Array.isArray(str)) {
                      query.type = 'rgxp'; try {query.val = new RegExp(str[0], str[1])} catch(err) {listener.names.length = 0; return this.win.alert(err)}
                      return query
                  }
                  const indx = str.indexOf('NOT');
                  if (indx != -1) {
                      const arr = str.slice(indx).split(/(?:\s+)?NOT(?:\s+)?/).filter(Boolean);
                      str = str.slice(0, indx).trimRight();
                      let any = [], every = [];
                      for (const el of arr) {
                          if (el.includes('AND'))
                              every.push(el.split(/(?:\s+)?AND(?:\s+)?/).filter(Boolean).map(el => this.prepareSntc(el, cs, ww)))
                          else
                              any.push(el)
                      }
                      any = any && !!any.length ? (any.length > 1 ? this.prepareSntc(any, cs, ww) : this.prepareSntc(any[0], cs, ww)) : null;
                      query.exclude = every && !!every.length ? [any, ...every].filter(Boolean) : any;
                  }
                  if (str.includes('OR')) {
                      query.type = 'some'; query.val = this.prepareSntc(str.split(/(?:\s+)?OR(?:\s+)?/).filter(Boolean), cs, ww);
                      return query
                  }
                  if (str.includes('AND')) {
                      query.type = 'all'; query.val = str.split(/(?:\s+)?AND(?:\s+)?/).filter(Boolean).map(el => this.prepareSntc(el, cs, ww));
                      return query
                  }
                  if (str.startsWith('"') && str.endsWith('"')) {
                      query.type = 'snt'; query.val = this.prepareSntc(str.slice(str.indexOf('"') + 1, str.lastIndexOf('"')), cs, ww);
                      return query
                  }
                  else {
                      str = str.split(/\s+/).filter(Boolean);
                      query.type = 'any'; str && !!str.length && (query.val = this.prepareSntc(str.length > 1 ? str : str[0], cs, ww));
                      return query
                  }
                  return null
              }
              , getPages() {
                  const paginator = [...document.getElementsByTagName("p")].find(el => el.textContent && el.textContent.startsWith("Страницы: "));
                  if (paginator)
                      return [...paginator.getElementsByTagName("td")[0].children].filter(el => !el.title).map((el, indx) => [el.href || this.loc, indx + 1]);
                  else
                      return [[this.loc, 1]];
              }
              , getSpHd() {
                  let spoilerHead = document.getElementById("spu-spoiler-head");
                  if (!spoilerHead) {
                      const dummyNode = this.actnBox.parentNode.insertBefore(document.createElement('div'), this.actnBox.nextElementSibling);
                      dummyNode.outerHTML = '<table id="spu-spoiler-head" width="95%" cellspacing="1" cellpadding="3" bgcolor="#999999" align="center" border="0"><tbody><tr><td valign="middle" bgcolor="#dddddd" align="left"></td></tr><td class="small" bgcolor="#dddddd" align="center">Найдено: <span id="spu-fndd"></span>   Ошибок: <span id="spu-errs"></span></td></tbody></table>';
                      spoilerHead = this.actnBox.nextElementSibling;
                      spoilerHead.id = "spu-spoiler-head";
                      spoilerHead.hidden = true;
                      const spTitle = spoilerHead.getElementsByTagName('td')[0];
                      spoilerHead.onclick = e => {
                          e.preventDefault(); e.stopPropagation();
                          const spoilerBody = this.spBd;
                          if (e.button != 0 || !spoilerBody) return;
                          if (spoilerHead.hasAttribute("notready")) {
                              this.dtStmp = null;
                              this.abortXhrs()
                          }
                          else {
                              spTitle.textContent = spoilerBody.hidden ? this.ttlHide : this.ttlShow;
                              spoilerBody.hidden = !spoilerBody.hidden;
                          }
                      }
                  }
                  return spoilerHead;
              }
              , getSpBd() {
                  let spoilerBody = document.getElementById("spu-spoiler-body");
                  if (!spoilerBody) {
                      const spoilerHead = this.spHd;
                      spoilerBody = spoilerHead.parentNode.insertBefore(document.createElement("table"), spoilerHead.nextElementSibling);
                      spoilerBody.id = "spu-spoiler-body";
                      spoilerBody.align = "center";
                      spoilerBody.width = "95%";
                      spoilerBody.hidden = true;
                  }
                  return spoilerBody;
              }
              , getNavBox() {
                  let navBox = document.getElementById("spu-nav");
                  if (!navBox) {
                      navBox = document.createElement('div');
                      const spoilerHead = this.spHd,
                            spoilerBody = this.spBd,
                            nodes = spoilerBody.children,
                            navBlock = navBox.appendChild(document.createElement('ul')),
                            navHome = navBlock.appendChild(document.createElement('li')),
                            navUp = navBlock.appendChild(document.createElement('li')),
                            navDown = navBlock.appendChild(document.createElement('li')),
                            navEnd = navBlock.appendChild(document.createElement('li')),
                            crntPst = () => {
                                const posts = [...nodes].slice(0, -1),
                                      possY = posts.map(el => el.getClientRects()[0].y);
                                return posts[possY.indexOf(this.getCrntPost(possY))]
                            },
                            scrollToPrev = () => {
                                const crnt = crntPst(),
                                      prvPost = crnt && crnt.previousElementSibling;
                                prvPost && prvPost.scrollIntoView({behavior:"smooth"});
                            },
                            scrollToNext = () => {
                                const crnt = crntPst(),
                                      nxtPst = crnt && crnt.nextElementSibling;
                                nxtPst && nxtPst != navBox && nxtPst.scrollIntoView({behavior:"smooth"});
                            };
                      navBox.id = 'spu-nav'; navUp.id = 'spu-nav-up'; navDown.id = 'spu-nav-down'; navEnd.id = 'spu-nav-end'; navHome.id = 'spu-nav-home';
                      navUp.className = navDown.className = navEnd.className = navHome.className = 'spu-nav-btn';
                      navUp.title = 'Предыдущий пост'; navDown.title = 'Следующий пост'; navEnd.title = 'В конец'; navHome.title = 'К началу';
                      navBox.onclick = e => {
                          if (!e.target.id) return;
                          switch (e.target.id) {
                              case 'spu-nav-home':
                                  spoilerHead.scrollIntoView({behavior:"smooth"});
                                  break;
                              case 'spu-nav-end':
                                  spoilerBody.lastElementChild.previousElementSibling.scrollIntoView({behavior:"smooth"});
                                  break;
                              case 'spu-nav-up':
                                  scrollToPrev();
                                  break;
                              case 'spu-nav-down':
                                  scrollToNext();
                                  break;
                              default: return
                          }
                      }
                  }
                  return navBox
              }
              , endNotify(fndd,errs) {
                  if (fndd) {
                      const spoilerHead = this.spHd,
                            spoilerBody = this.spBd,
                            confirm = this.win.confirm("Поиск окончен!\nНайдено: " + fndd + (errs ? "\nОшибок: " + errs : "") + "\nПерейти к резульататам?");
                      if (confirm) {
                          spoilerHead.scrollIntoView({behavior:"smooth"});
                          if (this.options.autoOpenSpoilerWithResult) {
                              this.spTTl.textContent = this.ttlHide;
                              spoilerBody.hidden = false;
                          }
                      }
                  }
                  else
                      this.win.alert("Постов не найдено!" + (errs ? "\nОшибок: " + errs : ""));
              }
              , handleEvent(e, name, prmpt) {
                  e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
                  this.dtStmp = new Date().getTime();
                  this.abortXhrs();
                  let cs, ww, txt, sel = listener.getSel();
                  // spawn function by Jake Archibald https://gist.github.com/jakearchibald/31b89cba627924972ad6
                  this.spawn(function*() {
                      if (sel && !prmpt && !e.ctrlKey) {
                          const confirm = listener.win.prompt('На странице был выделен текст.\nЗапустить поиск с именем пользователя из выделенного текста (нажать "Да"),\nили по тексту, с открытием диалога для редактирования (нажать "Отмена")?', sel);
                          confirm ? (name = confirm) : (prmpt = true);
                      }
                      if (name && !prmpt)  {
                          listener.name = name;
                          if (e.ctrlKey) return;
                      }
                      if (prmpt) {
                          listener.name = (e.button == 2 && listener.options.nameToFillSrchForm)
                              ? listener.options.nameToFillSrchForm
                              : name;
                          sel && (txt = sel);
                          const rVal = yield listener.prompt(listener.options.fillSearchFormWithNames && listener.name, txt);
                          listener.names.length = 0;
                          if (!rVal) return;
                          cs = rVal.cs; ww = rVal.ww;
                          listener.name = rVal.n;
                          listener.text = rVal.rgxp ? [rVal.t, rVal.flags] : rVal.t;
                      }
                      const nmsToSearch = listener.name,
                            txtToSearch = listener.text,
                            isNames = nmsToSearch && !!nmsToSearch.length,
                            isTexxt = txtToSearch && !!txtToSearch.length,
                            txtQuery = isTexxt && listener.getSearchQuery(txtToSearch, cs, ww);
                      if (!isNames && !isTexxt || isTexxt && !txtQuery) return;
                      const pageLinks = listener.getPages(),
                            spoilerHead = listener.spHd,
                            spoilerBody = listener.spBd,
                            spoilerTitle = listener.spTTl,
                            errsLbl = document.getElementById("spu-errs"),
                            findedLbl = document.getElementById("spu-fndd");
                      spoilerHead.hidden = false; spoilerTitle.textContent = listener.ttlLdng;
                      spoilerHead.setAttribute("notready", "true"); spoilerBody.hidden = true;
                      listener.options.scrollToSearchResults && !listener.options.showAlerts && spoilerHead.scrollIntoView({behavior:"smooth"});
                      let errorsCntr = 0, fnddCntr = 0;
                      errsLbl.textContent = findedLbl.textContent = 0;
                      if (spoilerBody.children && !!spoilerBody.children.length)
                          for (const node of [...spoilerBody.children])
                              node.remove();
                      Promise.all(pageLinks.map(link => {
                          const stmp = listener.dtStmp;
                          return listener.getPosts(link, isNames && nmsToSearch, isTexxt && txtQuery, stmp).then(posts => {
                              if (listener.dtStmp !== null && listener.dtStmp !== stmp) return;
                              if (posts && !!posts.length) {
                                  fnddCntr += posts.length; findedLbl.textContent = fnddCntr;
                              }
                              else if (posts == null) {
                                  errorsCntr += 1; errsLbl.textContent = errorsCntr;
                              }
                              return posts
                          }).catch(err => {
                              if (listener.dtStmp !== null && listener.dtStmp !== stmp) return;
                              errorsCntr += 1; errsLbl.textContent = errorsCntr;
                          })
                      }).concat(listener.dtStmp)).then(
                          posts => {
                              const stmp = posts.pop();
                              if (listener.dtStmp !== null && listener.dtStmp !== stmp) {
                                  posts && (posts.length = 0);
                                  return [null, stmp];
                              }
                              return listener.procesPosts(posts, stmp)
                          }
                      ).then(
                          ([founded, stmp]) => {
                              if (listener.dtStmp !== null && listener.dtStmp !== stmp) return;
                              spoilerTitle.textContent = listener.ttlShow;
                              spoilerHead.removeAttribute("notready");
                              if (listener.options.showAlerts)
                                  listener.endNotify(fnddCntr, errorsCntr);
                              else if (listener.options.autoOpenSpoilerWithResult) {
                                  spoilerBody.hidden = false;
                                  spoilerTitle.textContent = listener.ttlHide;
                              };
                          }
                      ).catch(err => {
                          if (Array.isArray(err)) {
                              if (listener.dtStmp !== null && listener.dtStmp !== err[1]) return;
                              err[0] == 'not found' && (spoilerTitle.textContent = listener.ttlNotFnd);
                          }
                          else {
                              errorsCntr += 1; errsLbl.textContent = errorsCntr
                          }
                          if (fnddCntr) {
                              spoilerHead.removeAttribute("notready");
                              spoilerTitle.textContent = listener.ttlShow;
                              if (listener.options.autoOpenSpoilerWithResult && !listener.options.showAlerts) {
                                  spoilerBody.hidden = false;
                                  spoilerTitle.textContent = listener.ttlHide;
                              };
                          }
                          listener.options.showAlerts && listener.endNotify(fnddCntr, errorsCntr);
                      });
                      listener.names.length = 0;
                  });
              }
          },
          prmptTxt = 'На странице был выделен текст.\nЗапустить поиск с именем пользователя из выделенного текста (нажать "Да"),\nили по тексту, с открытием диалога для редактирования (нажать "Отмена")?',
          hlpNms = 'Чтобы искать посты для всех пользователей, по тексту, - оставьте поле имени пустым.\nИмена в форму поиска вводить без учета регистра, разделяя запятой (без пробела).\nИмена с пробелами - ищутся и с пробелом и с _.',
          hlpTxt =
          [
              'Чтобы искать только посты по именам пользователей - оставьте поле текста пустым и наоборот. При поиске без регулярок все пробелы, переносы, табуляции - заменяются на единичный пробел, как в задании для поиска, так и в тексте постов. Слово &quot;поле&quot; - найдется и в &quot;Наполеон&quot; если не включен чекбокс &quot;Точное соответствие&quot;.',
              'Поиск без регулярок:',
              '\tраз два три - искать любую из разделенных пробелами частей',
              '\tраз два OR три OR пять - искать любую из фраз: &quot;раз два&quot;, &quot;три&quot;, &quot;пять&quot;',
              '\tраз два AND три AND пять - искать все фразы',
              '\t&quot;раз два три&quot; - (в двойных кавычках) искать фразу целиком',
              '\tОператор исключения NOT:',
              '\t\tИмеет приоритет над остальными. Ставить после текста (с любыми операторами, без них, фразой) для поиска',
              '\t\tОпции &quot;Точное соответствие&quot;, &quot;Без учета регистра&quot; - влияют и на слова исключения',
              '\t\tраз два OR три OR пять NOT шесть NOT семь восемь - найдет посты удовлетворяющие условиям поиска, за исключением тех, в которых есть &quot;шесть&quot; или &quot;семь восемь&quot;',
              '\t\tNOT шесть NOT семь - найдет любые посты без этих слов',
              '\t\tраз OR три NOT шесть NOT семь AND восемь - найдет посты удовлетворяющие условиям поиска, за исключением тех, в которых есть &quot;шесть&quot;, либо &quot;семь&quot; И(!) &quot;восемь&quot;',
              'Комбинировать операторы пока нельзя. За искличением NOT (см. выше).',
              'Регулярные выражения вводить включив чекбокс. Без начального и закрывающего слеша. Для ввода флагов - отдельное поле, Регулярки не проверяются на валидность.',
          ].join('\n'),
          highlightHlp = 'Включает подсветку совпадений в тексте найденных постов.\nВлияет на производительность и может поломать верстку (если, например, часть найденной фразы находится внутри одного элемента, а часть - за его пределами).\nПодсветит результат и в цитатах / подписях, даже при их исключении из поиска (только подсветит, на результаты не влияет).\nЦвет подсветки задается в опциях, в коде скрипта.',
          wholeHlp = 'Искать слово(-а) или фразу(-ы) только если предыдущий и последующий символы не являются буквенно-цифровыми',
          nmBtnHlp = 'Открыть меню для добавления имен из списка сохраненных.\nИмена задаются в опциях скрипта, в коде\n(при обновлении скрипта пользовательские изменения сбрасываются, делайте копию списка)',
          clsImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDoAABSCAABFVgAADqXAAAXb9daH5AAAAEhSURBVHja1FMxS8NgEH1XxCUuri24VKmLY6qDPyDoIF0k0Dmj4GBoQZBWBLEVOnaI0LEiXTIo/gAHO7sIOjm4SsEu4nfPJQGNIRk6iA/ecI/jeHePE5KYBQXMiL8fMJcUVja2VwG4ALrP45spACyvb1kAfACXT/fXj5kOSHVJBal+uepY5apjkepHmpu7wklj74JGEdGPCBrF6eF+kOyXlBjlKrwtNo7PvYKIAoCShbOjg2B3x3kFwEwHIsJefzBR84nv7PUHExFhroOltc34YGnovjzcTTMdqDG+GgM1Bp12M+i0m0FcqzG/B5P8wVrds4sVuzUchSWSQlKGo7BUrNitWt2zk/1pR5wHsADgLd6ZpABYBPAO4CMvhX/2C18DAHuyrpoNc5ujAAAAAElFTkSuQmCC',
          questionMark = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAn1BMVEUAAAAAbfMAbfEAbe8AbfAAbfAAbfEAbu8AcO8AAP8Abu8AbfAAbfAAbfEAgP8AbPAAbfAAbPIAa/IAbvAAbfAAbPEAbe0AcO8AbPAAbfAAceMAbfAAbfAAbfAAbPAAbfAAbfAAZv8AafAAbfEAavQAVf8AbPEAcfEAbf8AbfAAbfAAbe8Abe8AbfAAbfAAbfAAa/IAbfAAbfAAbfAAAADuFkhRAAAAM3RSTlMAKn606eKxgCABcvj0bgK19ztMl+1cDhA0+gnw4fnI09sFEcMYA6ASB77xcJOvzc4T8kSdjffTAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAAN1wAADdcBQiibeAAAAAd0SU1FB+IIDBMlMtO6eB4AAAChSURBVBjTTY/pDoMgEIQHAVHE2lNr7/uyt+//bl3Ypun8YL5dks0MQBKRVDo2CVipzdogl3f83Cnan4qUFjlB1/T6gyGBBRJHPkJZYUyQCRiyelJOXYUZYYSY3vli2a7Wm5pQQvO57W5/8K6geHE8nYNryOCX5sofMSKG253dQISYDzw5LMW3Hl7vJixyX+U/OpfJHY+ZTb99ExNrJSPh+QOxnx6dvxBTegAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wOC0xMlQxOTozNzo1MCswMjowMEnQ2mMAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDgtMTJUMTk6Mzc6NTArMDI6MDA4jWLfAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAABJRU5ErkJggg==',
          upArrow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAYnAAAGJwFNVNjHAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAGZQTFRFAJjmAJbmAJbnAJbmAJbmApfmCprnDZvnDpznE57oFp/oHqLpPa/sZsDwic/0ldP1tuH40Oz60+372/D74vP86fb96vb96/f97Pf97fj97/j97/n98fn98fn+9fv+9/z+/P7/////B9XeKgAAAAR0Uk5TNM/x8gg9m90AAACFSURBVCjPpdJJDoMwEETRts08JxDbmASo+1+SBSRiaEtI+du36y4iIdUlKYhEwCZI8iBJ8aBuQRzzEHVdxEI1jhUH+QC4nIFmBubmCoUDAFecIWwBAGjDE5SfFd7lERKLLZMcoJ6+MNV7yBx+9dkO0sdLa22MtbZ/pveP+C94X+sdg28+CxzeEOjnGCz7AAAAAElFTkSuQmCC',
          downArrow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAYnAAAGJwFNVNjHAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAGZQTFRFAJjmAJbmAJbnAJbmAJbmApfmCprnDZvnDpznE57oFp/oHqLpPa/sZsDwic/0ldP1tuH40Oz60+372/D74vP86fb96vb96/f97Pf97fj97/j97/n98fn98fn+9fv+9/z+/P7/////B9XeKgAAAAR0Uk5TNM/x8gg9m90AAACISURBVCjPrZLHEoAgDEQD2HsFrMj//6SODo4lnHSPeRM2WQJAKHuJEgDioCJAcUCB4YD9DsKqk1IKwTlvy/ACok6f6qPrU7kydZXfPAJhgAzu5ul41Kf0MZVbH6B2n+Mm/e6cvPcoFq2XAlkw3lqGGNs8m+cMjcRrGg/Pyve/pWv9Wusx2M5nBYeDEOi0fx6VAAAAAElFTkSuQmCC',
          homeArrow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAYnAAAGJwFNVNjHAAAAIGNIUk0AAHolAACAgwAA+f8AAIDoAABSCAABFVgAADqXAAAXb9daH5AAAAFCSURBVHja7NY9bsIwGAZgiwOwIDGys7NyAu6BOnGPHoDAgEBiYWSCmYoDpBJDByYWJ+RHiVGDTWP77QBqqZoIkhCpQy29kyU/8vfZsgkZ0hYxqEkMixGDHh4TixGDmmRIW+S8OEVJMclFKwmwGLls68dEc+bg6SXMlObMSUIOiUBn4SPr6Cz8PwQklai3ZrAiCZdL9NasWImS8my+I4o1uNQYvR3TFswHNKZ7BCf1VY5AKDSm+8cBy52A1N/1lhpY7sRjgPbcQyDUr6YGQqE994oBlQHFNoxTT842jFEZFAC6qxDspFMBdlLorsJ8QHVkwePq5vl3uUJ1ZGUH+psIXOqbAJca/U2UDahP7MTGpg1fKNQn9v1AbWzj1fvA/qjgXMXl53hX8YXCxo9RG9vFbnLO/AN3AeU/mSU/+iV/Wz4HAO0TO0w8lLnaAAAAAElFTkSuQmCC',
          endArrow = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAYnAAAGJwFNVNjHAAAAIGNIUk0AAHolAACAgwAA+f8AAIDoAABSCAABFVgAADqXAAAXb9daH5AAAAE/SURBVHja7JY9bsJAEIVXHIAGiZKenpYTcA+UintwAAwFAomGkgpqIg7gSC6poFj/YMtewNiOvX4pYglQIP7BK6XISK9aaT7NvBnNEjKiLSJRmUgqIxI9liOVEYnKZERb5Ds5hSDJJKEJAqiMJGWJquD4DygGqE00KFYIy+cwvasOiYzLVfqF48P8RG2iZQfUpxosnyNr2D5Hfarla9FAceFFcWpyL4oxUNz8HlTHKg5eehWmx1Edq8VM7q4dsOA5hAUxumun+BRVhhRbJ3wK2DohKsMXx7S9MGE/MNz2OdoLs5w9WO183PodxcBq55e3aI2ZfleFHXA0Znq5m9yXz3DDGG4Yoy+fX9vk5tzA27tzp96GYX+KsD9F6G3Yj/fm3MgO6Cwt5I3O0vpDgEctStMvLRJ/MgUffcHflq8BAGM1Oto/EMphAAAAAElFTkSuQmCC',
          html =
          [
              '<div id="spu-modal">',
              '    <div>',
              '        <button class="spu" id="spu-close" title="Отменить поиск">X</button><br>',
              '        <li>',
              '           <fieldset>',
              '               <legend>Сортировать найденное</legend>',
              '               <li>',
              '                  <label for="spu-fromnew">От новых к старым</label>',
              '                  <input id="spu-fromnew" name="sort" type="radio">',
              '                  <input id="spu-fromold" name="sort" type="radio">',
              '                  <label for="spu-fromold">От старых к новым</label>',
              '               </li>',
              '           </fieldset>',
              '           <fieldset>',
              '               <legend>Дополнительно</legend>',
              '               <li>',
              '                  <label for="spu-head">Шапку в результаты',
              '                      <img src="' + questionMark + '" title="Включать шапку темы в результат поиска, при удовлетворении условиям">',
              '                  </label>',
              '                  <input id="spu-head" type="checkbox">',
              '               </li>',
              '               <li>',
              '                  <label for="spu-imgs">Без картинок',
              '                      <img src="' + questionMark + '" title="Заменить картинки в найденных постах ссылками на них (исключая смайлы)">',
              '                  </label>',
              '                  <input id="spu-imgs" type="checkbox">',
              '               </li>',
              '           </fieldset>',
              '        </li>',
              '        <fieldset>',
              '            <legend>Введите имя(-ена)',
              '                <img src="' + questionMark + '" title="' + hlpNms + '">',
              '            </legend>',
              '            <li>',
              '                <button class="spu" id="spu-names-list" title="' + nmBtnHlp + '">Добавить имена',
              '                    <img src="' + questionMark + '">',
              '                </button>',
              '                <div>',
              '                    <ul id="spu-nms-menu" hidden="true">',
              '                    </ul>',
              '                </div>',
              '            </li>',
              '            <img class="spu clear-form" src="' + clsImg + '" title="Очистить форму">',
              '            <input id="spu-names">',
              '        </fieldset>',
              '        <fieldset id="spu-col">',
              '            <legend>Введите текст',
              '                <img src="' + questionMark + '" title="' + hlpTxt + '">',
              '            </legend>',
              '            <fieldset>',
              '                <legend>Опции поиска</legend> ',
              '               <li>',
              '                   <label for="spu-highlight">Подсветить найденное',
              '                       <img src="' + questionMark + '" title="' + highlightHlp + '">',
              '                   </label>',
              '                   <input id="spu-highlight" type="checkbox">',
              '               </li>',
              '               <li>',
              '                   <label for="spu-sig">В подписях</label>',
              '                   <input id="spu-sig" type="checkbox">',
              '               </li>',
              '               <li>',
              '                   <label for="spu-qt">В цитатах</label>',
              '                   <input id="spu-qt" type="checkbox">',
              '               </li>',
              '               <li>',
              '                   <label for="spu-sentence">Фразу</label>',
              '                   <input id="spu-sentence" type="checkbox">',
              '               </li>',
              '               <li>',
              '                   <label for="spu-whole">Точное соответствие',
              '                       <img src="' + questionMark + '" title="' + wholeHlp + '">',
              '                   </label>',
              '                   <input id="spu-whole" type="checkbox">',
              '               </li>',
              '               <li>',
              '                   <label for="spu-case">Без учета регистра</label>',
              '                   <input id="spu-case" type="checkbox">',
              '               </li>',
              '               <li>',
              '                   <label for="spu-regexp">RegExp</label>',
              '                   <input id="spu-regexp" type="checkbox">',
              '                   <input id="spu-flags" size="6" disabled="" hidden="" placeholder="Флаги" type="text">',
              '               </li>',
              '            </fieldset>',
              '            <div>',
              '                <img class="spu clear-form" src="' + clsImg + '" title="Очистить форму">',
              '                <textarea id="spu-txtarea"></textarea>',
              '            </div>',
              '        </fieldset><br>',
              '        <div></div>',
              '        <div id="spu-sticky">',
              '            <button id="spu-srch-strt" class="spu">Начать поиск</button>',
              '        </div>',
              '    </div>',
              '</div>'
          ].join('\n'),
          css =
          [
              '#spu-spoiler-head {',
              '    font-family: Segoe UI Emoji, bitstreamcyberbit, quivira, Verdana, Arial, Helvetica, sans-serif;',
              '    -moz-user-select: none !important;',
              '    -webkit-user-select: none !important;',
              '    -ms-user-select: none !important;',
              '    user-select: none !important;',
              '    cursor: pointer !important',
              '}',
              '#spu-spoiler-head[notready] {',
              '    cursor: not-allowed !important;',
              '}',
              '#spu-spoiler-body {',
              '    border: 1px solid black !important;',
              '    padding-top: 1em !important;',
              '}',
              '#spu-spoiler-body:not([hidden]) {',
              '    display: block !important;',
              '}',
              '#spu-spoiler-body {',
              '    border: 1px solid black !important;',
              '    padding: .5em 0 !important;',
              '    box-sizing: border-box !important;',
              '}',
              '#spu-spoiler-body button.spu' + (listener.options.hideSearchButton ? ', .tb:not(:hover) button.spu' : '') + '{',
              '    visibility: hidden !important;',
              '}',
              '#spu-spoiler-body > .tb:nth-child(odd) td[bgColor] {',
              '    background-color: #EEEEEE !important;',
              '}',
              '#spu-spoiler-body > .tb:nth-child(even) td[bgColor] {',
              '    background-color: #FFFFFF !important;',
              '}',
              '#spu-spoiler-body > .tb:last-of-type {',
              '    border-bottom-width: 1px !important;',
              '    margin-bottom: -100px !important;',
              '}',
              '#spu-spoiler-body > .tb spu-layer {',
              '    background-color: ' + listener.options.highlightColor + ' !important;',
              '}',
              '.spu {',
              '    padding: .05em .5em .1em !important;',
              '    background: rgb(251,251,251) !important;',
              '    color: rgb(51, 51, 51) !important;',
              '    border: 1px solid rgba(66,78,90,0.2) !important;',
              '    border-radius: 2px !important;',
              '    box-shadow: none !important;',
              '    font-size: 1em !important;',
              '}',
              '.spu:hover {',
              '    background: rgb(235,235,235) !important;',
              '}',
              '.spu:active {',
              '    background: rgb(225,225,225) !important;',
              '}',
              '#spu-nav {',
              '    position: -webkit-sticky !important;',
              '    position: sticky !important;',
              '    display: inline-block !important;',
              '    height: 0 !important;',
              '    top: 0 !important;',
              '    bottom: calc(50vh + 50px) !important;',
              '    left: 0 !important;',
              '    margin-bottom: 100px !important;',
              '}',
              '#spu-nav ul {',
              '    padding: 0 !important;',
              '    margin: 0 !important;',
              '}',
              '.spu-nav-btn {',
              '    list-style-position: inside !important;',
              '}',
              '#spu-nav-up {',
              '    list-style-image: url("' + upArrow + '") !important;',
              '}',
              '#spu-nav-down {',
              '    list-style-image: url("' + downArrow + '") !important;',
              '}',
              '#spu-nav-home {',
              '    list-style-image: url("' + homeArrow + '") !important;',
              '}',
              '#spu-nav-end {',
              '    list-style-image: url("' + endArrow + '") !important;',
              '}',
              '#spu-modal {',
              '    position: fixed !important;',
              '    top: 0 !important;',
              '    right: 0 !important;',
              '    bottom: 0 !important;',
              '    left: 0 !important;',
              '    background: rgba(0,0,0,0.8) !important;',
              '    z-index: 2147483646 !important;',
              '}',
              '#spu-modal > div {',
              '    position: relative !important;',
              '    width: 60vw;',
              '    max-width: 1200px;',
              '    max-height: 80vh !important;',
              '    display: flex !important;',
              '    flex-flow: column !important;',
              '    margin: 10vh auto !important;',
              '    padding: 20px !important;',
              '    border-radius: 3px !important;',
              '    background: rgb(251, 251, 251) !important;',
              '    resize: both !important;',
              '    overflow: auto !important;',
              '}',
              '#spu-modal > div > li > fieldset {',
              '    flex-grow: 1 !important;',
              '}',
              '#spu-modal fieldset,',
              '#spu-modal fieldset div {',
              '    display: flex !important;',
              '    position: relative !important;',
              '    flex-flow: column !important;',
              '    font-weight: 600 !important;',
              '}',
              '#spu-modal img:not([class]) {',
              '    cursor: help !important;',
              '    padding: 0 5px !important;',
              '    vertical-align: text-bottom !important;',
              '}',
              '#spu-modal .clear-form {',
              '    position: absolute !important;',
              '    padding: 0 !important;',
              '    border-radius: 100% !important;',
              '}',
              '#spu-modal fieldset > .clear-form {',
              '    top: -5px !important;',
              '    right: 0 !important;',
              '}',
              '#spu-modal div > .clear-form {',
              '    top: 0 !important;',
              '    right: -7px !important;',
              '}',
              '#spu-modal fieldset:not([id]) {',
              '    display: flex;',
              '    flex-flow: wrap !important;',
              '    align-items: center !important;',
              '    justify-content: space-evenly !important;',
              '}',
              '#spu-modal > div > li {',
              '    display: flex;',
              '    flex-flow: wrap !important;',
              '    align-items: stretch !important;',
              '    justify-content: space-between !important;',
              '}',
              '#spu-modal #spu-col,',
              '#spu-modal fieldset > div,',
              '#spu-modal input:not([type]) {',
              '    flex-grow: 1 !important;',
              '    flex-basis: auto !important;',
              '}',
              '#spu-modal #spu-names {',
              '    align-self: center !important;',
              '}',
              '#spu-modal label {',
              '    -moz-user-select: none !important;',
              '    -webkit-user-select: none !important;',
              '    user-select: none !important;',
              '    font-weight: 400 !important;',
              '}',
              '#spu-modal input:not([type]),',
              '#spu-modal #spu-names-list {',
              '    height: 2.5em !important;',
              '}',
              '#spu-modal textarea {',
              '    resize: none !important;',
              '    flex-basis: 30vh !important;',
              '    flex-grow: 1 !important;',
              '    margin: 10px 2px 0 !important;',
              '}',
              '#spu-modal button {',
              '    font-weight: 600 !important;',
              '}',
              '#spu-modal #spu-close {',
              '    position: fixed !important;',
              '    align-self: flex-end !important;',
              '    padding: 0 15px !important;',
              '    margin: -20px -20px 0 20px !important;',
              '    z-index: 2147483647 !important;',
              '}',
              '#spu-modal #spu-srch-strt {',
              '    padding: 5px 0 !important;',
              '    flex-grow: 1 !important;',
              '}',
              '#spu-modal div:empty {',
              '    min-height: 20px;',
              '}',
              '#spu-modal #spu-sticky {',
              '    display: flex !important;',
              '    position: -webkit-sticky !important;',
              '    position: sticky !important;',
              '    bottom: -20px;',
              '}',
              '#spu-modal fieldset > li {',
              '    display: inline-flex !important;',
              '    position: relative !important;',
              '}',
              '#spu-modal #spu-nms-menu li:not(:last-child) {',
              '    border-bottom: solid .5px lightgrey !important;',
              '}',
              '#spu-modal #spu-nms-menu li {',
              '    padding: .25em !important;',
              '    padding-left: 1em !important;',
              '    cursor: default !important;',
              '    text-align: start !important;',
              '    font-weight: 400 !important;',
              '}',
              '#spu-modal #spu-nms-menu li:hover {',
              '    color: #fff !important;',
              '    background: linear-gradient(to bottom, #6f81f5, #3f51f2) repeat-x !important;',
              '}',
              '#spu-modal li {',
              '    list-style-type: none !important;',
              '}',
              '#spu-modal li > div {',
              '    position: absolute !important;',
              '    top: 100% !important;',
              '    left: 0 !important;',
              '    right: 0 !important;',
              '    z-index: 999',
              '}',
              '#spu-modal #spu-nms-menu {',
              '    margin-top: 0 !important;',
              '    padding: 0 !important;',
              '    background: #fff !important;',
              '    border: 1px solid rgba(66,78,90,0.2) !important;',
              '}',
              '@media screen and (-webkit-min-device-pixel-ratio:0) {',
              '    #spu-modal fieldset:not([id]),',
              '    #spu-modal > div > li {',
              '        display: inline !important;',
              '        text-align: center !important;',
              '        vertical-align: middle !important;',
              '    }',
              '    #spu-modal > div > li > fieldset {',
              '        width: calc(50% - 28.5px) !important;',
              '    }',
              '    #spu-modal input:not([type]) {',
              '        width: calc(100% - 148px) !important;',
              '        min-width: 60% !important;',
              '    }',
              '    #spu-modal label {',
              '        vertical-align: middle !important;',
              '    }',
              '    #spu-modal fieldset > .clear-form {',
              '        top: 8px !important;',
              '        right: 2px !important;',
              '    }',
              '    #spu-modal #spu-sticky {',
              '        bottom: 0px !important;',
              '    }',
              '    #spu-modal div:empty {',
              '        min-height: 0 !important;',
              '    }',
              '    #spu-modal #spu-srch-strt {',
              '        height: max-content !important;',
              '    }',
              '    @supports not ((position: sticky) or (position: -webkit-sticky)) {',
              '        #spu-nav {',
              '            position: fixed !important;',
              '            bottom: 0 !important;',
              '            left: auto !important;',
              '        }',
              '        #spu-modal #spu-sticky {',
              '            bottom: 0px !important;',
              '            position: relative !important;',
              '        }',
              '    }',
              '}'
          ].join('\n');
    style.type = "text/css"; style.textContent = css;
    if (dats)
        for (const dat of dats) {
            const button = dat.appendChild(document.createElement("br")) && dat.appendChild(document.createElement("br"))
                               && dat.appendChild(document.createElement("button")),
                  name = dat.getElementsByTagName("b")[0].textContent;
            button.className = "spu";
            button.textContent = "Найти посты";
            button.title = "Ctrl + ЛКМ: Добавить этого пользователя в задание для поиска\nЛКМ:\n\tПоиск постов для пользователя(-ей)\n\tПри наличии выделенного текста - поиск по тексту и/или по имени\n\tс диалогом выбора и редактирования\nПКМ: Показать форму для поиска";
            button.onclick = button.oncontextmenu = e => listener.handleEvent(e, name, e.button == 2);
        }
    if (listener.options.searchOnProfileLinksByRMB)
        body.addEventListener("contextmenu", e => {
            const target = e.target.closest("a[href*='?action=show&member=']"),
                  name = target && target.search.split("&member=")[1];
            if (!target || !name || e.altKey || e.shiftKey || e.ctrlKey || e.metaKey
                || !!listener.getSel() || target.closest("#spu-spoiler-body")) return;
            listener.handleEvent(e, name)
        });
    if (listener.isFF && listener.options.createCnMenu) {
        const context = body.getAttribute("contextmenu"),
              menu = context
                        ? document.getElementById(context)
                        : body.appendChild(document.createElement("menu")),
              mitem = menu.appendChild(document.createElement("menuitem"));
        if (!context) {
            menu.id = "GM_page-actions";
            menu.type = "context";
            body.setAttribute("contextmenu", "GM_page-actions");
        };
        mitem.label = "Найти собщения пользователя(-ей)";
        mitem.onclick = e => listener.handleEvent(e, null, !listener.getSel());
    };
});
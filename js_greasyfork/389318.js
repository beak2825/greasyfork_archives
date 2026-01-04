// ==UserScript==
// @name     观察者网用户评论，风闻作者屏蔽
// @version  2.5.2
// @namespace     https://github.com/hefore/gczw
// @description   帮你屏蔽你不想看到的用户的评论和风闻作者。
// @author        hefore(hefore6@gmail.com)
// @match    *://www.guancha.cn/*
// @match    *://user.guancha.cn/*
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_setClipboard
// @grant       GM_download
// @run-at document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/389318/%E8%A7%82%E5%AF%9F%E8%80%85%E7%BD%91%E7%94%A8%E6%88%B7%E8%AF%84%E8%AE%BA%EF%BC%8C%E9%A3%8E%E9%97%BB%E4%BD%9C%E8%80%85%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/389318/%E8%A7%82%E5%AF%9F%E8%80%85%E7%BD%91%E7%94%A8%E6%88%B7%E8%AF%84%E8%AE%BA%EF%BC%8C%E9%A3%8E%E9%97%BB%E4%BD%9C%E8%80%85%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const DEBUG = false;
  const bindlog = console.log.bind(console, 'mt:');

  function applyLog() {
    bindlog.apply(this, arguments);
  }

  function blank() {}
  const log = DEBUG ? applyLog : blank;
  // eslint-disable-next-line no-unused-vars
  const hidecmd = '<span class="unfold">已被折叠，点击查看</span>';
  let myblacklist = [];
  let authorblacklist = [];
  let authorlist = [];
  let host = '';
  let path = '';

  const callback = function (mutationsList) {
    for (const mutation of mutationsList) {
      const type = mutation.type;
      switch (type) {
        case 'childList':
          log('A child node has been added or removed.');
          // debounce(queryComment, 1000, timerid);
          throttle(queryComment);
          break;
        case 'attributes':
          log(`The ${mutation.attributeName} attribute was modified.`);
          break;
        case 'subtree':
          log(`The subtree was modified.`);
          break;
        default:
          break;
      }
    }
  };
  const observer = new MutationObserver(callback);

  function handleLocalStorage(method, key, value) {
    switch (method) {
      case 'get': {
        const temp = window.localStorage.getItem(key);
        if (temp) {
          return temp;
        }
        return null;
      }
      case 'set': {
        window.localStorage.setItem(key, value);
        break;
      }
      case 'remove': {
        window.localStorage.removeItem(key);
        break;
      }
      default: {
        return null;
      }
    }
  }

  // eslint-disable-next-line no-unused-vars
  function addUserIntoBlacklist(ev) {
    if (myblacklist.indexOf(ev.target.dataset.uid) < 0) {
      myblacklist.push(ev.target.dataset.uid);
      handleLocalStorage('set', 'mylist', JSON.stringify(myblacklist));
    }
    log(myblacklist);
  }

  function toggleUserFromBlacklist(ev) {
    const index = myblacklist.indexOf(ev.target.dataset.uid);
    const cl = ev.target.closest('.comment-item');
    if (index >= 0) {
      myblacklist.splice(index, 1);
      handleLocalStorage('set', 'mylist', JSON.stringify(myblacklist));
      // eslint-disable-next-line new-cap,no-undef
      GM_setValue('mylist', JSON.stringify(myblacklist));
      ev.target.innerHTML = '屏蔽';
      ev.target.dataset.blflag = false;
      cl.classList.remove('blacklistedmember');
    } else {
      myblacklist.push(ev.target.dataset.uid);
      handleLocalStorage('set', 'mylist', JSON.stringify(myblacklist));
      // eslint-disable-next-line new-cap,no-undef
      GM_setValue('mylist', JSON.stringify(myblacklist));
      ev.target.innerHTML = '解除';
      ev.target.dataset.blflag = true;
      cl.classList.add('blacklistedmember');
    }
    log(myblacklist);
  }

  function queryComment() {
    // const userlist = [];
    const cl = document.getElementsByClassName('comment-item');
    observer.disconnect();
    Array.prototype.forEach.call(cl, v => {
      const user = v.querySelector('.user-avatar');
      // userlist.push(user.dataset.uid);

      if (
        myblacklist.indexOf(user.dataset.uid) >= 0 &&
        !user.classList.contains('blacklistedmember')
      ) {
        // console.log(user.nextElementSibling.innerText);
        // user.classList.add('blacklistedmember');
        // const texts = v.querySelectorAll('.comment-txt');
        // const text = texts[texts.length - 1];
        // const inner = text.innerHTML;
        // text.innerHTML = '';
        // const newnode = document.createElement('span');
        // newnode.innerHTML = inner;
        // newnode.style.cssText = 'display:none';
        // text.appendChild(newnode);
        // // newnode.insertAdjacentHTML('afterend', '<span class="unfold">点击显示</span>');
        // const anothernewnode = document.createElement('span');
        // anothernewnode.classList.add('unfold');
        // anothernewnode.innerHTML = '已被屏蔽，点击显示';
        // text.appendChild(anothernewnode);
        // text.classList.add('masked');
        v.classList.add('blacklistedmember');
      }
      if (user.classList.contains('addtoblacklist') === false) {
        const newnode = document.createElement('div');
        if (v.classList.contains('blacklistedmember')) {
          newnode.innerHTML = '解除';
        } else {
          newnode.innerHTML = '屏蔽';
        }
        newnode.addEventListener('click', toggleUserFromBlacklist);
        // newnode.style.cssText = elemtoinsert;
        newnode.dataset.uid = user.dataset.uid;
        newnode.dataset.blflag = true;
        newnode.classList.add('blbtn');
        user.appendChild(newnode);
        user.classList.add('addtoblacklist');
      }
    });

    const cim = document.getElementsByClassName('cmt-item-main');
    Array.prototype.forEach.call(cim, v => {
      const quotea = v.querySelector('span.quote a');
      const text = quotea.href;
      const regex = new RegExp('uid=(\\d+)$');
      const match = regex.exec(text)[1];
      if (
        myblacklist.indexOf(match) >= 0 &&
        !v.classList.contains('blacklistedmemberq')
      ) {
        v.classList.add('blacklistedmemberq');
      }
    });

    startObserber();
  }

  function throttle(method, scope) {
    clearTimeout(method.tId);
    method.tId = setTimeout(() => {
      method.call(scope);
    }, 277);
  }

  function startObserber() {
    // const container = document.getElementById('comments-container');
    const targetNode = document.querySelector(`#comments-container`);
    const config = {
      attributes: false,
      childList: true,
      subtree: true,
    };
    if (targetNode) {
      observer.observe(targetNode, config);
    }
    // log(container);
  }

  function initcss() {
    const style = document.createElement('style');
    style.innerHTML = `
      .blbtn {margin: 10px 0px;border: 2px solid;padding: 2px 5px;border-radius: 3px;
        font-size: 80%;cursor: pointer;background-color: ivory;}
      .blbtn:hover {background-color: MistyRose;}
      .blacklistedmember .blbtn {background-color: azure;}
      .blacklistedmember .blbtn:hover {background-color: burlywood;}
      .blacklistedmember .user-avatar > img {filter: blur(5px);}
      .blacklistedmember .user-avatar > img:hover {filter: blur(0);}
      .blacklistedmember .user-nick {filter: blur(5px);}
      .blacklistedmember .user-nick:hover {filter: blur(0);}
      .blacklistedmember .signature {filter: blur(5px);}
      .blacklistedmember .signature:hover {filter: blur(0);}
      .blacklistedmember .user-nick::after {content: '已拉黑';border: 2px solid red;margin-left: 5px;font-size: smaller;}
      .blacklistedmemberq span a {filter: blur(5px);}
      .blacklistedmemberq span a:hover {filter: blur(0);}
      .blacklistedmemberq .comment-txt {filter: blur(5px);}
      .blacklistedmemberq .comment-txt:hover {animation:appear 1s 2s forwards;}
      .blacklistedmemberq .quote a::after {content: '已拉黑';border: 2px solid red;margin-left: 5px;font-size: smaller;}
      @keyframes appear {from {filter: blur(5px);} to{filter: blur(0);}}
      .blacklistedmember > div:nth-last-of-type(2) {filter: blur(5px);}
      .blacklistedmember > div:nth-last-of-type(2):hover {animation:appear 1s 2s forwards;}
      .blockedauthor {filter: blur(5px);}
      .blockedauthor.article-txt-content::before {content: '注意：你已拉黑此作者';border: 2px solid red;margin-left: 5px;font-size: smaller;}
      .blockedauthor .user-main h4::before {content: '已拉黑';border: 2px solid red;margin-left: 5px;font-size: smaller;}
      .blockedauthor:hover {animation:appear 1s 2s forwards;}
      .aubtn {margin: 0px;border: 2px solid;padding: 2px 5px;border-radius: 3px;
        font-size: 80%;cursor: pointer;background-color: ivory;display: inline-block;
        bottom: 0px;line-height: 14px;position: absolute;right: 0px;}
      .aubtn:hover {background-color: MistyRose;}
      .fengwen-list .blockedauthor .fengwen-list-user::after {content: '已拉黑';border: 2px solid red;margin-left: 5px;font-size: smaller;}
      `;
    const head = document.head || document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }

  function maskArticle(flag) {
    const atc = document.getElementsByClassName('article-txt-content')[0];
    if (flag) {
      atc.classList.add('blockedauthor');
    } else {
      atc.classList.remove('blockedauthor');
    }
  }

  function addAuthorlist(ev) {
    ev.preventDefault();
    const index = authorblacklist.indexOf(ev.target.dataset.id);
    if (index >= 0) {
      authorblacklist.splice(index, 1);
      handleLocalStorage('set', 'authorlist', JSON.stringify(authorblacklist));
      // eslint-disable-next-line new-cap,no-undef
      GM_setValue('authorlist', JSON.stringify(authorblacklist));
      ev.target.innerHTML = '屏蔽此人';
      ev.target.dataset.blflag = false;
      maskArticle(false);
      // cl.classList.remove('blacklistedmember');
    } else {
      authorblacklist.push(ev.target.dataset.id);
      handleLocalStorage('set', 'authorlist', JSON.stringify(authorblacklist));
      // eslint-disable-next-line new-cap,no-undef
      GM_setValue('authorlist', JSON.stringify(authorblacklist));
      ev.target.innerHTML = '解除屏蔽';
      ev.target.dataset.blflag = true;
      maskArticle(true);
      // cl.classList.add('blacklistedmember');
    }
    console.log(authorblacklist);
    return false;
  }

  function initBlacklist() {
    const storagedata = JSON.parse(handleLocalStorage('get', 'mylist') || '[]');
    // myblacklist = JSON.parse(storagedata);
    // eslint-disable-next-line new-cap,no-undef
    let storagedatagm = JSON.parse(GM_getValue('mylist', '[]'));
    myblacklist = Array.from(new Set([...storagedata, ...storagedatagm]));
    console.log(myblacklist);
    const storagedataa = JSON.parse(handleLocalStorage('get', 'authorlist') || '[]');
    // authorblacklist = JSON.parse(storagedataa);
    // eslint-disable-next-line new-cap,no-undef
    storagedatagm = JSON.parse(GM_getValue('authorlist', '[]'));
    authorblacklist = Array.from(new Set([...storagedataa, ...storagedatagm]));
    console.log(authorblacklist);
    // eslint-disable-next-line new-cap,no-undef
    // GM_setValue('authorlist', JSON.stringify(storagedataa));
  }

  function fengWenInitBtn() {
    if (host !== 'user.guancha.cn') {
      log(' not a fengwen article!');
      return;
    }
    const abu = document.querySelector('.article-bottom-user');
    if (abu !== null) {
      const ua = abu.getElementsByClassName('attention')[0];
      const a = document.createElement('a');
      const index = authorblacklist.indexOf(ua.dataset.id);
      if (index < 0) {
        a.innerText = '屏蔽此人';
      } else {
        a.innerText = '解除屏蔽';
        maskArticle(true);
      }
      a.href = '#';
      a.addEventListener('click', addAuthorlist);
      a.classList.add('btn');
      a.style.right = '100px';
      a.dataset.id = ua.dataset.id;
      // const textnode = document.createTextNode('屏蔽此人');
      // a.appendChild(textnode);
      abu.appendChild(a);
    }
  }

  function fenwen24GetAuthorList() {
    // eslint-disable-next-line no-undef,new-cap
    GM_xmlhttpRequest({
      method: 'GET',
      headers: {
        'If-Modified-Since': 0,
      },
      url: 'https://user.guancha.cn/main/index-list?page=1&order=3',
      onload: response => {
        // console.log(response.responseText);
        if (response.responseText === '') {
          log('fenwen24GetAuthorList cached');
        } else {
          const d = document.createElement('div');
          d.innerHTML = response.responseText;
          const ilis = d.getElementsByClassName('index-list-item');
          if (ilis.length > 10) {
            const res = [];
            // log('index-list-item:' + ilis.length);
            for (let i = 0; i < ilis.length; i++) {
              const ili = ilis[i];
              const userId = ili
                .getElementsByClassName('user-avatar')[0]
                .getAttribute('user-id');
              const articleId = ili.getElementsByClassName('shared-box')[0]
                .dataset.id;
              res.push([articleId, userId]);
            }
            authorlist = res;
            handleLocalStorage(
              'set',
              'authorsOfArticles',
              JSON.stringify(authorlist)
            );
            // eslint-disable-next-line new-cap,no-undef
            // GM_setValue('authorsOfArticles', JSON.stringify(authorlist));
            console.log(res);
          }
        }
      },
    });
    const storagedata = handleLocalStorage('get', 'authorsOfArticles') || '[]';
    authorlist = JSON.parse(storagedata);
    // eslint-disable-next-line new-cap,no-undef
    // authorlist = JSON.parse(GM_getValue('authorsOfArticles', '[]'));
    console.log(authorlist);
  }

  const fwcallback = function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        console.log(mutation.addedNodes);
        fenwen24filterHandler(mutation.addedNodes);
      }
    }
  };
  const fwobserver = new MutationObserver(fwcallback);

  function add2Authorlist(ev) {
    const index = authorblacklist.indexOf(ev.target.dataset.uid);
    const cl = ev.target.closest('.fenwen24-box');
    if (index >= 0) {
      authorblacklist.splice(index, 1);
      handleLocalStorage('set', 'authorlist', JSON.stringify(authorblacklist));
      // eslint-disable-next-line new-cap,no-undef
      GM_setValue('authorlist', JSON.stringify(authorblacklist));
      ev.target.innerHTML = '屏蔽';
      ev.target.dataset.blflag = false;
      // maskArticle(false);
      cl.classList.remove('blockedauthor');
    } else {
      authorblacklist.push(ev.target.dataset.uid);
      handleLocalStorage('set', 'authorlist', JSON.stringify(authorblacklist));
      // eslint-disable-next-line new-cap,no-undef
      GM_setValue('authorlist', JSON.stringify(authorblacklist));
      ev.target.innerHTML = '解除';
      ev.target.dataset.blflag = true;
      // maskArticle(true);
      cl.classList.add('blockedauthor');
    }
    console.log(authorblacklist);
  }

  function fenwen24filterHandler(nl) {
    const l = [];
    fwobserver.disconnect();
    nl.forEach(dv => {
      const a = dv.getElementsByClassName('fenwen24-title')[0];
      const regex = new RegExp('id=(\\d+)');
      const match = regex.exec(a.href)[1];
      // console.log(match);
      l.push(match);
      const author = authorlist.find(v => {
        return v[0] === match;
      });
      log(author);
      let index = -1;
      let uid = -1;
      if (author !== undefined) {
        index = authorblacklist.indexOf(author[1]);
        uid = author[1];
      }
      let btntext = '屏蔽';
      if (index >= 0) {
        dv.classList.add('blockedauthor');
        btntext = '解除';
      }
      const bx = dv.getElementsByClassName('fenwen24-box-right')[0];
      const newnode = document.createElement('div');
      newnode.innerHTML = btntext;
      newnode.addEventListener('click', add2Authorlist);
      // newnode.style.cssText = elemtoinsert;
      newnode.dataset.uid = uid;
      newnode.dataset.blflag = true;
      newnode.classList.add('aubtn');
      newnode.title = '作者ID:' + uid;
      // log('author');
      bx.appendChild(newnode);
    });
    console.log(l);
  }

  function fenwen24Filter() {
    const fw24 = document.getElementsByClassName('fenwen24')[0];
    if (fw24) {
      log('fw24 exist');
      // fw24.addEventListener('DOMNodeInserted', fenwen24filterHandler);
      const config = {
        childList: true,
        subtree: true,
      };
      fwobserver.observe(fw24, config);
      fenwen24GetAuthorList();
    }
  }

  function fwIndexListItemHandler(lis) {
    for (const item of lis) {
      // log(item);
      const userId = item
        .getElementsByClassName('user-avatar')[0]
        .getAttribute('user-id');
      const index = authorblacklist.indexOf(userId);
      if (index >= 0) {
        item.classList.add('blockedauthor');
      }
    }
  }

  function fwNewIndexListItemHandler(nl) {
    for (const cv of nl) {
      if (cv.classList === undefined) {
        continue;
      }
      const userId = cv
        .getElementsByClassName('user-avatar')[0]
        .getAttribute('user-id');
      const index = authorblacklist.indexOf(userId);
      if (index >= 0) {
        cv.classList.add('blockedauthor');
      }
    }
  }

  const fwlcallback = function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // console.log(mutation.addedNodes);
        if (mutation.addedNodes.length > 0) {
          fwNewIndexListItemHandler(mutation.addedNodes);
        }
      }
    }
  };
  const fwlobserver = new MutationObserver(fwlcallback);

  function fengWenObserber() {
    if (host !== 'user.guancha.cn') {
      log('fengWenObserber: not a fengwen page!');
      return;
    }
    // const container = document.getElementById('comments-container');
    const targetNode = document.querySelector(`.index-list`);
    // const targetNode = document.querySelectorAll(`.article-list`);
    console.log('fwob');
    log(targetNode);
    const config = {
      attributes: false,
      childList: true,
      subtree: true,
    };
    if (targetNode) {
      fwlobserver.observe(targetNode, config);

      const items = targetNode.querySelectorAll('.index-list-item');
      if (items.length > 0) {
        log('index-list-item length:' + items.length);
        fwIndexListItemHandler(items);
      }
      const itemsli = targetNode.querySelectorAll('.article-list > li');
      if (itemsli.length > 0) {
        log('index-list-itemli length:' + itemsli.length);
        fwIndexListItemHandler(itemsli);
      }
    }
    // log(container);
  }

  function getFullAticle() {
    const mp = document.querySelector('#select_page .module-page');
    const pi = document.querySelector('.article-txt .pagination');
    if (mp !== null) {
      const lastbtn = mp.querySelectorAll('.last');
      if (lastbtn.length === 1) {
        log('lastbtn:true');
        const url = lastbtn[0].getAttribute('onclick');
        log(url);
        const re = url.match(/href='([^"]*)'/)[1];
        // log('http://www.guancha.cn' + re);
        const oinhl = document.querySelector('.content .all-txt');
        fetch('https://www.guancha.cn' + re, {
          credentials: 'same-origin'
        }).then(res => {
          return res.text();
        }).then(response => {
          const d = document.createElement('iflame');
          d.innerHTML = response;
          const inhl = d.querySelector('.content .all-txt');
          // console.log(inhl);
          oinhl.innerHTML = inhl.innerHTML;
          mp.style.display = 'none';
          const cm = document.createElement('div');
          cm.innerText = '已自动加载全文';
          mp.parentNode.appendChild(cm);
        }).catch(err => {
          log('fetch err:' + err);
        });
      }
    } else if (pi !== null) {
      const expandbtn = pi.querySelectorAll('.expand-all');
      if (expandbtn.length === 1) {
        log('expandbtn:true');
        const url = expandbtn[0].childNodes[0].getAttribute('href');
        const oinhl = document.querySelector('.article-txt-content');
        fetch('https://user.guancha.cn/' + url, {
          credentials: 'same-origin'
        }).then(res => {
          return res.text();
        }).then(response => {
          const d = document.createElement('iflame');
          d.innerHTML = response;
          const inhl = d.querySelector('.article-txt-content');
          // console.log(inhl);
          oinhl.innerHTML = inhl.innerHTML;
          const cm = document.createElement('div');
          cm.innerText = '已自动加载全文';
          oinhl.appendChild(cm);
        }).catch(err => {
          log('fetch err:' + err);
        });
      }
    }
  }

  function homePageFengWenFilter() {
    if (host !== 'www.guancha.cn') {
      return;
    }
    const bls = document.querySelectorAll('.three-coloum .fengwen-list li');
    // log('li count:' + bll.length);
    for (const bli of bls) {
      const quotea = bli.querySelector('.fengwen-list-user');
      const text = quotea.href;
      const regex = new RegExp('uid=(\\d+)$');
      let match = regex.exec(text);
      if (match === null) {
        continue;
      }
      match = match[1];
      log('uid match:' + match);
      if (
        authorblacklist.indexOf(match) >= 0
      ) {
        bli.classList.add('blockedauthor');
      }
    }
  }

  function blacklistsync() {
    const bll = document.querySelector('.black-list.article-list');
    const bls = bll.querySelectorAll('.interact-info-box');
    const bl = [];
    for (const bli of bls) {
      const avt = bli.querySelector('.user-avatar.popup-user');
      bl.push(avt.getAttribute('user-id'));
    }
    console.log(bl);
    myblacklist = Array.from(new Set([...myblacklist, ...bl]));
    // eslint-disable-next-line new-cap,no-undef
    GM_setValue('mylist', JSON.stringify(myblacklist));
    console.log(myblacklist);
    authorblacklist = Array.from(new Set([...authorblacklist, ...bl]));
    // eslint-disable-next-line new-cap,no-undef
    GM_setValue('authorlist', JSON.stringify(authorblacklist));
    console.log(authorblacklist);
    // eslint-disable-next-line no-alert
    alert('已下载' + bl.length + '个数据，如果数量偏少，请点击页面底部的“加载更多”以获取全部数据');
  }

  function addsyncbtn() {
    const settingmenu = document.querySelector('.user-setting .header-box');
    const am = document.querySelector('.btn-big.add-more');
    if (settingmenu) {
      const sp1 = document.createElement('div');
      sp1.style.float = 'right';
      settingmenu.appendChild(sp1);
      const btn = document.createElement('a');
      btn.classList.add('btn');
      btn.textContent = '下载黑名单';
      sp1.appendChild(btn);
      btn.addEventListener('click', () => {
        blacklistsync();
      });
    }
  }
  // 初始化
  function init() {
    host = window.location.host;
    path = window.location.pathname;
  }

  log('gancha script v2.0 running');
  init();
  // 从storage读取配置
  initBlacklist();
  // 初始化CSS
  initcss();
  // 开启评论翻页监控
  startObserber();
  // 主动运行一次评论过滤
  queryComment();
  // 风闻文章过滤
  fengWenInitBtn();
  // 首页风闻过滤
  homePageFengWenFilter();
  // fenwen24Filter();
  // fenwen24GetAuthorList();
  // 风闻主页过滤
  fengWenObserber();
  // 账号黑名单下载
  addsyncbtn();
  getFullAticle();
})();

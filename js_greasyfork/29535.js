// ==UserScript==
// @name         AniDub-CommentFinder
// @namespace    MaxLevs
// @version      3.3.2
// @description  Поисковик комментов по id. Ищет комменты из топа на странице с анимой или из списка последних комментов любого пользователя.
// @author       MaxLevs
// @match        *://online.anidub.com/*
// @grant        none
// @noframes
// @run-at document-idle
// @licenses     https://raw.githubusercontent.com/MaxLevs/AniDub-CommentFinder/master/LICENSE
// @supportURL   https://github.com/MaxLevs/AniDub-CommentFinder/issues
// @downloadURL https://update.greasyfork.org/scripts/29535/AniDub-CommentFinder.user.js
// @updateURL https://update.greasyfork.org/scripts/29535/AniDub-CommentFinder.meta.js
// ==/UserScript==


(function(w) {
  'use strict';
  const _PAGE_CACHE = [];
  const _NEWS_CACHE = [];
  const _COMMENT_LIST_CACHE = [];
  const min = 1;
  const nav = w.document.getElementsByClassName('navigation')[0];
  const max = nav ? +nav.lastElementChild.innerHTML : 1;
  let bestComm;
  let news_id;
  let onLoadEvent = new Event("ad_finderonload");

  function Indicate(text = "ИЩЕМ?", dur = 1000) {
    this.link = document.createElement('div');
    this.link.id = 'ad-bcom-finder';
    this.link.align = 'center';
    this.link.textContent = text;
    this.link.style.cssText = `width: 100px;height: 20px;line-height: 20px;background-color: #c73f4c;color: #fff;font-weight: 600;border-radius: 10px;user-select: none;transition-property: background-color;transition-duration: ${dur}ms;cursor: pointer;`;

    this.animToken = null;

    this.animate = () => {
      this.animToken = setInterval((()=>{
        let state = false;
        return ()=>{
          if (state) {
            this.link.style.backgroundColor = '#c73f4c';
          } else {
            this.link.style.backgroundColor = '#565656';
          }
          state = !state;
        };
      })(), dur+1);
      this.link.textContent = "ПОИСК";
    };

    this.stopAnimate = (state) => {
      clearInterval(this.animToken);
      switch (state) {
        case 1:
          this.link.style.backgroundColor = "#c73f4c";
          this.link.textContent = "ОШИБКА";
          break;

        case 0:
        default:
          this.link.style.backgroundColor = "#6fae18";
          this.link.textContent = "НАЙДЕНО";
          break;
      }
    };
  }

  var ad_getCommentsList = (cstart, news_id) => {
    return new Promise((responsed) => {
      if (!_COMMENT_LIST_CACHE[cstart]){
        $.get(dle_root+"engine/ajax/comments.php", {cstart:cstart,news_id:news_id,skin:dle_skin}, (data) => {
          _COMMENT_LIST_CACHE[cstart] = data;
          responsed(data);
        },"json");
      } else {
        responsed(_COMMENT_LIST_CACHE[cstart]);
      }
    });
  };

  function ad_showComment(cstart, news_id, comm_id) {
    ad_getCommentsList(cstart, news_id).then(
      function(data){
        if(!isNaN(cstart)&&!isNaN(news_id)){
          $('#dle-comm-link').unbind('click');
          $('#dle-comm-link').bind('click',function(){CommentsPage(cstart,news_id);return false;});
        }
        $("#dle-comments-list").html(data.comments);
        $(".dle-comments-navigation").html(data.navigation);
        if (comm_id && /comment-id-\d+/.test(comm_id)) {
          document.getElementById("dle-comments-list").querySelector(`#${comm_id}`).scrollIntoView();
        }
        w.dispatchEvent(new Event('ad_oncommentdraw'));
      }
    );
    return false;
  }

  var ad_binarySearch = (id, n1, n2) => {
    return (Promise.all([ad_getCommentsList(n1, news_id), ad_getCommentsList(n2, news_id), ad_getCommentsList(Math.ceil((n1+n2)/2), news_id)])
        .then((data) => {
      data = data.map(el => {return el.comments;});
      if (n1 > n2) {
        return -1;
      }

      if(~data[0].search(new RegExp(`${id}\\D`))){
        return n1;
      }

      if(~data[1].search(new RegExp(`${id}\\D`))){
        return n2;
      }

      if(~data[2].search(new RegExp(`${id}\\D`))){
        return Math.ceil((n1+n2)/2);
      }

      if(+id.match(/\d+/)[0] < +data[2].match(/comment-id-\d+/g)[0].match(/\d+/)[0]){
        return ad_binarySearch(id, n1+1, Math.ceil((n1+n2)/2));
      } else {
        return ad_binarySearch(id, Math.ceil((n1+n2)/2), n2-1);
      }
    }).catch((err) => {
      return Promise.reject(err);
    }));
  };

  var searchError = (err)=>{
    console.error(err);
  };

  var ad_searchManager = (userIdList = null) => {
    userIdList = typeof userIdList === "string" ? [userIdList] : userIdList;
    return Promise.all((() => {
      let resP = [];
      if (userIdList && userIdList.length) {
        for (let i = 0; i < userIdList.length; ++i) {
          resP[i] = ad_binarySearch(userIdList[i], min, max).then(
            (page) => {
              if(~page){
                ad_showComment(page, news_id, userIdList[i]);
                console.log(`Page: ${page}`);
              } else {
                alert("Комментарий не найден...");
              }
              return page;
            }, searchError);
        }
      } else {
        for (let i = 0; i < bestComm.length; ++i) {
          resP[i] = ad_binarySearch(bestComm[i].id, min, max).then(
            (page) => {
              if(~page){
                bestComm[i].children[0].onclick = ()=>{ad_showComment(page, news_id, bestComm[i].id); return false;};
                bestComm[i].children[0].style.cursor = "pointer";
                console.log(`Page: ${page}`);
              } else {
                alert(`Комментарий #${i+1} не найден...`);
              }
              return page;
            }, searchError);
        }
      }
      return resP;
    })());
  };

  var ad_uri = w.location.href;
  if ((new RegExp('/[^/]+/[^/]+/[^/]+$')).test(ad_uri)) {
    //Вставляем индикатор
    let indicator = new Indicate("ИЩЕМ?");
    indicator.link.style.float = 'right';
    let refPoint = document.getElementById('ad-refPoint');
    refPoint = document.getElementsByClassName('comm_best')[0].previousElementSibling.previousElementSibling.previousElementSibling;
    refPoint.style.width = '400px';
    refPoint.style.float = 'left';
    refPoint.id = 'ad-refPoint';
    refPoint.style.marginBottom = '14px';
    refPoint.parentNode.insertBefore(indicator.link, refPoint.nextSibling);

    //Получаем нужные данные
    bestComm = w.document.getElementsByClassName('comm_best')[0].children;
    news_id = w.location.pathname.match(/\d*-/)[0].match(/\d*/)[0];

    //Алгоритмы работы
    var activateIndicator = () => {
      indicator.link.style.cursor = "default";
      indicator.animate();
      ad_searchManager().then((resp)=>{
        let state = 0;
        if(resp && ~resp.indexOf(-1)){
          state = 1;
        }
        indicator.stopAnimate(state);
        return resp;
      });
      indicator.link.removeEventListener('click', activateIndicator);
    };
    indicator.link.addEventListener('click', activateIndicator);

    //API
    w.ad_searchManager = ad_searchManager;
    w.ad_showComment = ad_showComment;
  }
  else if ((new RegExp('/index.php?[^/]*do=lastcomments[^/]*$')).test(ad_uri)) {
    var mar = 12;
    var list = document.getElementById("dle-comments-list").children;

    for (var point of list) {
      if (!(/comment-id-\d+/.test(point.id))) continue;

      var indicatorBox = document.createElement("div");
      var indicatorMar = document.createElement("div");
      let indicator = new Indicate("НАЙТИ");
      {
        indicatorMar.id = 'ad_indicatorMar';
        indicatorMar.style.height = `${mar}px`;
      }
      {
        indicatorBox.style.height = `${mar + (+indicator.link.style.height.match(/\d*/)[0])}px`;
        indicatorBox.style.backgroundColor = "#fff";
      }

      point.querySelector('.commleft').align = 'center';
      point.querySelector('.commleft').appendChild(indicatorBox);
      indicatorBox.appendChild(indicatorMar);
      indicatorBox.appendChild(indicator.link);

      function goToSearch(event){
        let indicator = this.indicator;
        let point = this.point;
        let href = point.querySelector('.comm_title').children[1].href;
        let targetPage = null;

        if (!_NEWS_CACHE[href]){
          targetPage = w.open(href);
          _NEWS_CACHE[href] = targetPage;
          setTimeout(function(){
            targetPage.document.title = `[ПОИСК] ${targetPage.document.title}`;
          }, 500);
          targetPage.onbeforeunload = function(){
            _NEWS_CACHE[href] = null;
          };
        } else {
          targetPage = _NEWS_CACHE[href];
        }

        if (!_PAGE_CACHE[point.id]){
          indicator.animate();
          if(!targetPage.ad_loaded){
            targetPage.addEventListener("ad_finderonload", doEv);
          } else {
            doEv();
          }
          function doEv() {
            targetPage.ad_loaded = true;
            targetPage.ad_searchManager(point.id).then((resp) => {
              let state = 0;
              if(resp && ~resp.indexOf(-1)){
                state = 1;
              }
              indicator.stopAnimate(state);
              return resp;
            }).then((resp)=>{
              _PAGE_CACHE[point.id] = resp[0];
            });
            targetPage.removeEventListener("ad_finderonload", doEv);
          };
        } else {
          if(!targetPage.ad_loaded){
            targetPage.addEventListener("ad_finderonload", doEv);
          } else {
            doEv();
          }
          function doEv() {
            targetPage.ad_loaded = true;
            targetPage.ad_showComment(_PAGE_CACHE[point.id], targetPage.location.pathname.match(/\d*-/)[0].match(/\d*/)[0], point.id);
            targetPage.removeEventListener("ad_finderonload", doEv);
          };
        }
      }

      indicator.link.addEventListener('click', {handleEvent: goToSearch, indicator:indicator, point:point});
    }
  }

  //API
  w.ad_getCommentsList = ad_getCommentsList;
  w.dispatchEvent(onLoadEvent);
})(window);
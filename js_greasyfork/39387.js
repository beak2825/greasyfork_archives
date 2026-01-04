// ==UserScript==
// @name            Pixiv Arts Preview & Followed Atrists Coloring & Extended History
// @namespace       Pixiv
// @description     Enlarged preview of arts and manga on mouse hovering. Extended history for non-premium users. Auto-Pagination on Following and Users pages. Click on image preview to open original art in new tab, or MMB-click to open art illustration page, Alt+LMB-click to add art to bookmarks, Ctrl+LMB-click for saving originals of artworks. The names of the authors you are already subscribed to are highlighted with green. Settings can be changed in proper menu.
// @author          NightLancerX
// @version         4.15.1
// @match           https://www.pixiv.net/bookmark_new_illust*
// @match           https://www.pixiv.net/discovery*
// @match           https://www.pixiv.net/ranking.php*
// @match           https://www.pixiv.net/*artworks/*
// @match           https://www.pixiv.net/*users/*
// @match           https://www.pixiv.net/history.php*
// @match           https://www.pixiv.net/bookmark_detail.php?illust_id=*
// @match           https://www.pixiv.net/*tags/*
// @match           https://www.pixiv.net/*
// @connect         i.pximg.net
// @connect         i-f.pximg.net
// @connect         i-cf.pximg.net
// @connect         techorus-cdn.com
// @homepageURL     https://github.com/NightLancer/PixivPreview
// @supportURL      https://greasyfork.org/users/167506-nightlancerx
// @license         MIT
// @copyright       NightLancerX
// @grant           GM_xmlhttpRequest
// @grant           GM.xmlHttpRequest
// @grant           GM_setValue
// @grant           GM.setValue
// @grant           GM_getValue
// @grant           GM.getValue
// @grant           GM_addStyle
// @grant           GM.addStyle
// @require         https://code.jquery.com/jquery-3.3.1.min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @compatible      firefox >= 121
// @compatible      chrome >= 105
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/39387/Pixiv%20Arts%20Preview%20%20Followed%20Atrists%20Coloring%20%20Extended%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/39387/Pixiv%20Arts%20Preview%20%20Followed%20Atrists%20Coloring%20%20Extended%20History.meta.js
// ==/UserScript==
//=======================================================================================
(function ()
{
  'use strict';

  if (window.top == window.self && window.jQuery) jQuery(function($) //window.top check may be useless because of @noframes
  {
    console.log('MyPixivJS');

    //---------------------------***CUSTOM PREFERENCES***--------------------------------
    let propList = [
        {paramIndex:0, array:[false,true], name:"PREVIEW_ON_CLICK"},
        {paramIndex:2, array:[0, 100, 200, 300, 500, 1000, 1500], name:"DELAY_BEFORE_PREVIEW"},
        {paramIndex:0, array:["auto", 600, 1200], name:"PREVIEW_SIZE"},
        {paramIndex:1, array:[false,true], name:"ENABLE_AUTO_PAGINATION"},
        {paramIndex:0, array:[false,true], name:"DISABLE_MANGA_PREVIEW_SCROLLING_PROPAGATION"},
        {paramIndex:1, array:[false,true], name:"SCROLL_INTO_VIEW_FOR_SINGLE_IMAGE"},
        {paramIndex:0, array:[false,true], name:"DISABLE_SINGLE_PREVIEW_BACKGROUND_SCROLLING"},
        {paramIndex:0, array:[false,true], name:"HIDE_PEOPLE_WHO_BOOKMARKED_THIS"},
        {paramIndex:0, array:[false,true], name:"KEEP_OLD_DATE_OF_ALREADY_VIEWED_ARTWORKS"}
    ];
    //---------------------------------DEFAULT VALUES------------------------------------
    // ■ PREVIEW_ON_CLICK =
    // false : showing preview on mouseover (default)
    // true : showing preview after LMB-click
    //
    // ■ DELAY_BEFORE_PREVIEW =
    // 0 : no delay before preview
    // 100 : 0.1 second delay (1000 for 1 second, etc) (default)
    //
    // ■ PREVIEW_SIZE =
    // auto : automatically calculate preview size (1200 or 600) depending of current screen size (default)
    // 600 : up to 600px x 600px
    // 1200 : up to 1200px x 1200px
    //
    // ■ ENABLE_AUTO_PAGINATION =
    // false: disable auto pagination
    // true: enable auto-pagination on Following and Users pages (default)
    //
    // ■ DISABLE_MANGA_PREVIEW_SCROLLLING_PROPAGATION =
    // false : keeping page scrolling after end of manga preview scrolling (default)
    // true : disable page scrolling when viewing manga preview (move mouse out of preview to re-enable scrolling)
    //
    // ■ SCROLL_INTO_VIEW_FOR_SINGLE_IMAGE =
    // true : preview of single image will smoothly fit to vertical screen border after one scroll (default)
    // false : manually scrolling (may need in case of forced 1200px vertical preview with small user screen)
    //
    // ■ DISABLE_SINGLE_PREVIEW_BACKGROUND_SCROLLING =
    // false: standard behavior (default)
    // true : disable page scrolling when viewing single preview (works only if previous setting set to true)
    //
    // ■ HIDE_PEOPLE_WHO_BOOKMARKED_THIS =
    // false: don't change `bookmark_detail.php` page (default)
    // true: hide "People who bookmarked this" section
    //
    // ■ KEEP_OLD_DATE_OF_ALREADY_VIEWED_ARTWORKS =
    // false: update date every time artwork page opens (default)
    // true: don't renew date and keep first one (NOTE: art will not appear at the top of the history)

    let currentSettings = {};
    //-----------------------------------------------------------------------------------
    let hoverImg = document.createElement('img');
        hoverImg.style = 'display: block;'

    let imgContainer = document.createElement('div');
        imgContainer.id = 'imgPreview';
        imgContainer.style = 'position:absolute; display:block; visibility:visible; z-index:1000; background:#222; padding:5px; margin:-5px;';
        imgContainer.appendChild(hoverImg);

    let mangaContainer = document.createElement('div');
        mangaContainer.id = 'mangaContainer';
        mangaContainer.style = 'display:block; overflow-x:auto; white-space:nowrap; maxWidth:1200px; z-index:1500; background:#111; font-size: 0;';

    let mangaMiddleContainer = document.createElement('div');
        mangaMiddleContainer.style = 'display:block; visibility:inherit; z-index:1250;';
        mangaMiddleContainer.appendChild(mangaContainer);

    let mangaOuterContainer = document.createElement('div');
        mangaOuterContainer.id = 'mangaOuterContainer';
        mangaOuterContainer.style = 'position:absolute; display:block; visibility:hidden; left:0px; right:0px; width:max-content; margin: 0px auto; padding:5px; background:#111; z-index:1000;';
        mangaOuterContainer.appendChild(mangaMiddleContainer);

    let imgsArr = [], //for manga-style image packs...
        followedUsersId = {}, //storing followed users pixiv ID
        BOOKMARK_URL = 'https://www.pixiv.net/ajax/user/XXXXXXXX/following?limit=100&tag=&lang=en',//&offset=0&rest=show'
        USER_ID,
        totalHits = 0,
        lastImgId = -1,
        PREVIEWSIZE,
        siteImgMaxWidth = 184, //useless on "new" pages because of square previews [2,7,12,...]
        mangaWidth = 1200,
        maxRequestTime = 30000,
        bookmarkContainer,
        pageNumber,
        DELTASCALE = 4,
        previewEventType,
        PAGETYPE = checkPageType(),
        followedCheck = {
          id:0,                                                                          //backuping user id in case of cookie errors
          status:0,                                                                      //-1: error, 0:default, 1:in progress, 2:done
          date:0,                                                                        //date of last successful check
          saveState(){
            localStorage.setObj('followedCheck', this);
          },
          loadState(){
            this.id     = localStorage.getObj('followedCheck')?.id     || 0;
            this.status = localStorage.getObj('followedCheck')?.status || 0;
            this.date   = localStorage.getObj('followedCheck')?.date   || 0;
          }
        };

    var timerId, tInt, menuTimer, timerIds = [];
    //-----------------------------------------------------------------------------------
    Storage.prototype.setObj = function(key, obj){
      return this.setItem(key, JSON.stringify(obj))
    }
    Storage.prototype.getObj = function(key){
      return JSON.parse(this.getItem(key))
    }
    //-----------------------------------------------------------------------------------
    const GM_setV = (typeof(GM_setValue)==='function')?GM_setValue:GM.setValue;
    const GM_getV = (typeof(GM_getValue)==='function')?GM_getValue:GM.getValue;
    const GM_addS = (typeof(GM_addStyle)==='function')?GM_addStyle:GM.addStyle;
    //===================================================================================
    //************************************PageType***************************************
    //===================================================================================
    function checkPageType()
    {
      if (document.URL.match(/https:\/\/www.pixiv.net\/bookmark_new_illust(?:_r18)?.php/))                  return 0; //New illustrations - New +
      if (document.URL.match(/^https:\/\/www.pixiv.net\/discovery(?:\?mode=(safe|r18))?$/))                 return 1; //Discovery page(works) - New +
      if (document.URL.match('https://www.pixiv.net/bookmark_detail.php?'))                                 return 4; //Bookmark information - Old +
      if (document.URL.match('https://www.pixiv.net/ranking.php?'))                                         return 6; //Daily rankings - Old +
      if (document.URL.match(/https:\/\/www\.pixiv\.net\/(?:en\/)?users\/\d+\/bookmarks\/artworks/))        return 7; //Bookmarks page - New +
      if (document.URL.match(/https:\/\/www\.pixiv\.net\/(?:en\/)?users/))                                  return 2; //Artist works page - New +
      if (document.URL.match(/https:\/\/www\.pixiv\.net\/(?:en\/)?tags/))                                   return 8; //Search page - New +
      if (document.URL.match(/https:\/\/www\.pixiv\.net\/(?:en\/)?artworks/))                               return 12; //Illust page - New* +
      if (document.URL.match('https://www.pixiv.net/discovery/users?'))                                     return 13; //Discovery page(users) New +
      if (document.URL.match('https://www.pixiv.net/history.php'))                                          return 14; //History - Old +
      if (document.URL.match(/^https:\/\/www\.pixiv\.net\/(?:en\/)?$/))                                     return 10; //Home page - New +

      return -1;
    }
    console.log('PAGETYPE:',PAGETYPE);
    //-----------------------------------------------------------------------------------
    //Old:                4 6              14
    //New:          0 1 2     7 8 10 12 13
    //==============----------------------------
    //Coloring:     = 1 = 4 6 7 8 10 12 == ~~ //
    //Profile card: 0 1 = 4 6 7 8 10 12 == == //
    //On following: = 1 2 4 6 7 8 ?? 12 13 == //
    //===================================================================================
    function setCurrentSettings(){
      for (let i = 0; i < propList.length; i++){
        currentSettings[propList[i].name] = propList[i].array[propList[i].paramIndex]; //only for options checking, actual settings contains in propList[]
      }
      resetPreviewSize(); //needed because of "auto" feature
      resetPreviewEventType();
    }
    //-----------------------------------------------------------------------------------
    function saveSettings(){
      for (let i = 0; i < propList.length; i++){
        localStorage.setObj(propList[i].name, propList[i].paramIndex);
      }
      console.log("Settings saved");
    }
    //-----------------------------------------------------------------------------------
    function loadSavedSettings(){
      for (let i = 0; i < propList.length; i++){
        propList[i].paramIndex = localStorage.getObj(propList[i].name) ?? propList[i].paramIndex; //load saved setting value, or let default if not found

        if ((propList[i].paramIndex < 0) || (propList[i].paramIndex >= propList[i].array.length)){
          propList[i].paramIndex = 0; // "0" is not default for all settings...
          console.error(`localStorage error! Setting ${propList[i].name} has been reset to default value! [${propList[i].array[propList[i].paramIndex]}]`);
        }
      }
      console.log("Settings loaded");
    }
    //-----------------------------------------------------------------------------------
    loadSavedSettings();
    setCurrentSettings();
    //-----------------------------------------------------------------------------------
    function resetPreviewSize(){PREVIEWSIZE = (currentSettings["PREVIEW_SIZE"] > 0)?currentSettings["PREVIEW_SIZE"]:(window.innerHeight>1200 & document.body.clientWidth>1200)?1200:600}
    function resetPreviewEventType(){previewEventType = (currentSettings["PREVIEW_ON_CLICK"])?'click':'mouseenter'; console.log(previewEventType)}
    //===================================================================================
    //**********************************ColorFollowed************************************
    //===================================================================================
    function makeArgs(baseUrl, total){
      let arr = [];
      for(let i = 1; i < Math.ceil(total / 100); i++){                                   //from 1 - because we already have first 100 users
        arr.push(baseUrl + "&offset=" + i + "00");
      }
      return arr;
    }
    //-----------------------------------------------------------------------------------
    async function limitedParallel(urls, limit = 10){
      const results = [];
      let i = 0;

      async function next() {
        if (i >= urls.length) return;
        const idx = i++;
        try {
          results[idx] = await request(urls[idx]);
        } catch (e) {
          console.error("Fetch failed:", urls[idx], e);
          results[idx] = null;
        }
        return next();
      }

      await Promise.all(Array(limit).fill().map(next));
      return results;
    }
    //-----------------------------------------------------------------------------------
    async function getUserId(){
      USER_ID = USER_ID
      || followedCheck && followedCheck?.id
      || document.cookie.match(/user_id=\d+/)?.[0].split("=").pop()
      || Object.keys(localStorage).filter(e => e.match(/viewed_illust_ids_\d+/)).map(a => a.match(/\d+/))[0]
      || (await fetch('https://www.pixiv.net/bookmark.php')).url.match(/\d{3,}/)[0];

      if (!USER_ID) return Promise.reject('FATAL ERROR in obtaining user ID! Please report this on GitHub "Issues"');
    }
    //-----------------------------------------------------------------------------------
    async function checkFollowedArtists()
    {
      followedCheck.loadState();

      if (((Date.now()-23*60*60*1000) > followedCheck.date) || (followedCheck.status < 2) || !localStorage['followedUsersId']){
        console.log('*Followed check started*');

        followedCheck.status = 1;
        followedCheck.saveState();

        await getUserId().catch(e => followedCheckError(e));
        if (USER_ID>0){
          BOOKMARK_URL = BOOKMARK_URL.replace("XXXXXXXX", USER_ID);
        }
        else return -1;

        //make first request separately for obtaining count of followed users, both public/private
        let response0 = [];
        try{
          response0 = await Promise.all([request(BOOKMARK_URL+'&rest=show&offset=0'), request(BOOKMARK_URL+'&rest=hide&offset=0')]);
        }
        catch(error){
          console.error("Error with initial bookmark url!");
          followedCheckError(error);
          return -1;
        }
        for(const i of response0) i.body.users.forEach(user => followedUsersId[user.userId] = 1);

        let args = [];
        let len = response0.map(r => r.body.total);

        args =    makeArgs(BOOKMARK_URL+'&rest=show', len[0])   //public
          .concat(makeArgs(BOOKMARK_URL+'&rest=hide', len[1])); //private

        let responseArray = [];
        try{
          responseArray = await limitedParallel(args, 10); //limiting concurrent followed requests to 10 (effective 1000 follows at time)
        }
        catch(error){
          followedCheckError(error);
          return -1;
        }
        for(const r of responseArray) r.body.users.forEach(user => followedUsersId[user.userId] = 1);

        localStorage.setObj('followedUsersId', followedUsersId);
        followedCheck.id = USER_ID;
        followedCheck.status = 2;
        followedCheck.date = Date.now();
        followedCheck.saveState();
        console.log('*Followed check completed*');
        console.log('Obtained', Object.keys(followedUsersId).length, 'followed users');
      }
      else{
        followedUsersId = localStorage.getObj('followedUsersId');
        console.log(`followedCheck is up to date of %c${new Date(followedCheck.date).toLocaleString()}`, 'color:violet;');
      }
    }
    checkFollowedArtists();
    //-----------------------------------------------------------------------------------
    async function request(url, responseType)
    {
      return new Promise(function (resolve, reject){
        let xhr = new XMLHttpRequest();
        xhr.responseType = responseType || 'json';
        xhr.timeout = 10000;
        xhr.open('GET', url, true);
        xhr.onload = function (){
          resolve(this.response);
        };
        xhr.onerror = xhr.ontimeout = function(){
          reject(this);
        };
        xhr.send();
      });
    }
    //-----------------------------------------------------------------------------------
    function followedCheckError(error){
      console.error(error);
      followedCheck.status = -1;
      followedCheck.saveState();
    }
    //-----------------------------------------------------------------------------------
    async function colorFollowed(artsContainers, delay)
    {
      let c = 0, d = 0;
      while (!artsContainers || artsContainers.length === 0) //first call -> daily rankings, illust page
      {
        console.log('waiting for arts...');
        await sleep(delay ?? 2000);

        artsContainers = getAllArtsContainers();
        ++c;
        if (c>5) {console.error('Error while waiting for arts loading! [Timeout 10s]'); return}
      }

      let artsContainersLength = artsContainers.length;

      //wait until last XHR completed if it is not---------------------------------------
      followedCheck.loadState();

      if (followedCheck.status == 1){
        while (followedCheck.status !== 2){
          console.log("waiting for followed users..."); //this could happen in case of huge amount of followed users
          await sleep(2000);
          followedCheck.loadState();

          ++d;
          if (d*2000 > maxRequestTime || followedCheck.status == -1){
            console.error(`ERROR while EXPECTING for subscriptions list! [${d*2000/1000}s]`);
            break;
          }
        }
      }

      //load from localStorage on any errors
      if (followedCheck.status <= 0 || Object.keys(followedUsersId).length == 0){
        console.error(`There was some error during followed users check [Error Code: ${followedCheck.status}]`);
        console.log(`Trying to load cached followedUsersId by date of ${new Date(followedCheck.date).toLocaleString()} ...`);

        followedUsersId = localStorage.getObj('followedUsersId');
        if (followedUsersId && Object.keys(followedUsersId).length > 0){
          console.log("Loaded cached", Object.keys(followedUsersId).length, "followed users");
        }
        else{
          console.error('There is no locally stored followed users entries!');
          return -1;
        }
      }
      //---------------------------------------------------------------------------------
      if (PAGETYPE!==1) console.log('arts loaded:', artsContainersLength, 'Total:', getAllArtsContainers().length);

      let hitContainers = [];
      let currentHits = 0;

      if (PAGETYPE == 12){
        let authorId = +document.querySelector("aside").querySelector("[href*=users]").href.match(/\d+/)[0];
        [].filter.call(artsContainers, container => getAuthorIdFromContainer(container) == authorId) //color current authors arts among suggested
          .forEach(container => container.setAttribute("style", "background-color: deepskyblue; !important"));
      }

      hitContainers = [].filter.call(artsContainers, container => followedUsersId[getAuthorIdFromContainer(container)] == 1);
      hitContainers.forEach(container => container.setAttribute("style", "background-color: green; !important"));

      currentHits = hitContainers.length;
      totalHits += currentHits;

      if (PAGETYPE!==1) console.log('hits: '+currentHits + ' (Total: '+(totalHits)+')'); //containers are constantly being replaced on this page
    }
    //-----------------------------------------------------------------------------------
    function getAllArtsContainers()
    {
      switch (PAGETYPE){
        case 1:
        case 7:
        case 8:
        case 10: return [...document.querySelectorAll('li > div')].filter(e => (e.querySelector('a[href*="/artworks/"]')));

        case 4:
        case 6:  return document.querySelectorAll('.ui-profile-popup');

        case 12: return document.querySelectorAll('.gtm-illust-recommend-title');

        default:  console.error('Unprocessed PAGETYPE in getAllArtsContainers()!');
      }
      return null;
    }
    //-----------------------------------------------------------------------------------
    function getAuthorIdFromContainer(artContainer)
    {
      let authorId = -1;
      //console.log(artContainer);

      if (!artContainer){
        console.error('UNPROCESSED getAuthorIdFromContainer() call!');
      }
      else if (typeof artContainer.hasAttribute !== 'function'){
        console.log(artContainer, 'has been filtered out.');
      }
      else if ([1,7,10,12].includes(PAGETYPE)){
        authorId = searchNearestNode(artContainer,'[href*="/users/"]').getAttribute('href').split('/').pop();
      }
      else if (PAGETYPE===4 || PAGETYPE===6){
        authorId = artContainer.getAttribute('data-user_id') || artContainer.querySelector('.ui-profile-popup').getAttribute('data-user_id');
      }
      else if (PAGETYPE===8){
        let node = searchNearestNode(artContainer,'[href*="/users/"]');
        authorId = (node)? node.getAttribute('href').split('/').pop(): -8;
      }

      return +authorId;
    }
    //-----------------------------------------------------------------------------------
    function sleep(ms)
    {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    //-----------------------------------------------------------------------------------
    function getElementByXpath(path)
    {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
    //-----------------------------------------------------------------------------------
    function getArtSectionContainers()
    {
      switch(PAGETYPE)
      {
        case 0:
        case 2:
        case 7:  return document.querySelector('a[data-gtm-user-id][href*="/artworks/"]')?.closest('ul')
        case 1:
        case 4:  return $('.gtm-illust-recommend-zone')[0]
        case 6:  return $('.ranking-items')[0]
        case 8:  return $('body')[0] //$("section>div>ul")[0]
        case 10: return document.querySelector('div[style*=--columns]')   //fckng sick of this-_-
        case 12: return $('.gtm-illust-recommend-zone ul')[0]

        default: return 0;
      }
    }
    //-----------------------------------------------------------------------------------
    let observer = {
      mutationObserver: null,

      init(func){
        this.mutationObserver = new MutationObserver((mutations)=>{func(mutations)});
      },

      observe(mainDiv, options){
        this.mutationObserver.observe(mainDiv, options);
        console.log('Observer has been set');
      },

      disconnect(){
        this.mutationObserver.disconnect();
      }
    }
    //-----------------------------------------------------------------------------------
    let renewObserver = Object.assign({}, observer); //copy new instance of object
    //-----------------------------------------------------------------------------------
    function observerBody(mutations)
    {
      let arr = [];
      mutations.forEach(function(mutation)
      {
        mutation.addedNodes.forEach(function(node)
        {
          if (PAGETYPE == 10){
            if (node.nodeName == "IMG" && node.matches('img:not([class*=" "])')){    //todo: very unstable condition(>=2 img classes)
              arr.push(searchNearestNode(node, 'a[href*="/artworks/"]'));
            }
            else if (node.nodeName == "DIV"){
              node.querySelectorAll('a[href*="/artworks/"]:only-child').forEach((el)=>arr.push(el));
            }
          }
          else if (PAGETYPE == 12 && (!!node.querySelector('iframe'))){
            node.remove(); //filtering ads
          }
          else if (PAGETYPE == 1 || PAGETYPE == 7){
            node.querySelectorAll('li > div').forEach((el) => arr.push(el));
          }
          else if (PAGETYPE == 8){
            //console.log(node);
            if (node && typeof(node.nodeName)!=='undefined' && node.nodeName==='UL'){
              node.querySelectorAll('li > div').forEach((el) => arr.push(el));
            }
            if (node && typeof(node.nodeName)!=='undefined' && node.nodeName==='LI' && node.querySelector('div [href*="/users/"]')){
              arr.push(node);
            }
          }
          else{
            arr.push(node);
          }

        });
      });

      if (arr.length>0) colorFollowed(arr);
    }
    //-----------------------------------------------------------------------------------
    observer.init(observerBody);
    //-----------------------------------------------------------------------------------
    async function waitForArtSectionContainers()
    {
      let mainDiv = getArtSectionContainers();
      let count = 0;
      while(!mainDiv)
      {
        console.log('Waiting for arts container...');
        await sleep(1000);
        mainDiv = getArtSectionContainers();

        ++count;
        if (count>10) {console.error('Error while waiting for arts containers! [Timeout 10s]'); return -1}
      }
      console.log(mainDiv);

      return mainDiv;
    }
    //-----------------------------------------------------------------------------------
    async function initMutationObject(options)
    {
      observer.observe(await waitForArtSectionContainers(), options);
    }
    //-----------------------------------------------------------------------------------
    function searchNearestNode(el, selector)
    {
      let nearestNode = el.querySelector(selector);
      while ((!nearestNode) && (el != document.body)){
        el = el.parentNode;
        nearestNode = el.querySelector(selector);
      }
      return nearestNode;
    }
    //-----------------------------------------------------------------------------------
    function followage(thisObj, toFollow) //In case of followed check lasting too long, async queue may be a solution
    {
      console.log('toFollow: '+ toFollow);
      let userId = searchNearestNode(thisObj, '[href*="/users/"]').getAttribute('href').split('/').filter(el => el.match(/\d+/))[0];

      if (!(userId>0)) {console.error(`Wrong userId! ${userId}`); return}

      if (localStorage.getObj('followedCheck').status == 2)
      {
        if (Object.keys(followedUsersId).length == 0)
          followedUsersId = localStorage.getObj('followedUsersId');

        if (toFollow){
          followedUsersId[userId] = 1;
          if ([2,12].includes(PAGETYPE)){
            followagePreview();
          }
        }
        else
          delete followedUsersId[userId];

        localStorage.setObj('followedUsersId', followedUsersId);
        console.log('userId ' + userId + [(toFollow)?' added to':' deleted from'] + ' localStorage. Followed: '+ Object.keys(followedUsersId).length);
      }
      else console.info(`${userId} will not be highlighted — too quick subscription before followedCheck is completed. It will be updated in 24 hours, but if you want you can report this on GitHub`);
    }
    //-------------------------------------Followage-------------------------------------
    async function followagePreview()
    {
      let recommendationBlock;
      let c = 0;

      while(!recommendationBlock)
      {
        console.log('Waiting for FollowagePreview');
        await sleep(1000);
        recommendationBlock = getElementByXpath("//div[contains(., 'Recommended users')]");

        ++c;
        if (c>10) {console.error("Error while waiting for recommendationBlock! [Timeout 10s]"); return -1}
      }
      console.log('*FollowagePreview loaded*');

      //let recommendationObserver = Object.assign({}, observer);

      let scrollBackward = recommendationBlock.querySelector('div:nth-child(3) > div:nth-child(2) > button:nth-child(1)');
      let scrollForward  = recommendationBlock.querySelector('div:nth-child(3) > div:nth-child(2) > button:nth-child(2)');

      recommendationBlock.onwheel = function(e){
        e.preventDefault(); //no need
        if (e.deltaY > 0) scrollForward.click()
        else scrollBackward.click();
      };

      $(recommendationBlock).on(previewEventType, 'a:not([href*="/users/"]) img', function(e)
      {
        e.preventDefault();
        //let top = window.innerHeight - PREVIEWSIZE - 5 + window.scrollY + 'px';
        let top = window.scrollY + 5 + 'px';
        checkDelay(setHover, this, top);
      });
    }
    //---------------------------------------History-------------------------------------
    let illust_history = {
      ids: [],
      timestamps: {},

      load(){
        this.ids        = localStorage.getObj('viewed_illust_ids') || GM_getV("viewed_illust_ids") || localStorage.getObj('viewed_illust_ids_' + USER_ID)?.data || [];
        this.timestamps = localStorage.getObj('viewed_illust_timestamps') || GM_getV("viewed_illust_timestamps") || localStorage.getObj('viewed_illust_timestamp_' + USER_ID)?.data || {};
        if (!this.ids || !this.timestamps){
          console.error("Missing viewed_illust_ids or viewed_illust_timestamps in localStorage");
        }
      },

      save(){
        localStorage.setObj('viewed_illust_ids', this.ids);               //viewed_illust_ids
        localStorage.setObj('viewed_illust_timestamps', this.timestamps); //viewed_illust_timestamp
      },

      add_record(illust_id){
        this.load();

        if (this.ids.indexOf(illust_id.toString()) == -1){
          this.ids.push(illust_id.toString());
          this.timestamps[illust_id] = Date.now()/1000;
          console.log(+illust_id, "has been added to history");
        }
        else if (currentSettings["KEEP_OLD_DATE_OF_ALREADY_VIEWED_ARTWORKS"] == false){
          this.timestamps[illust_id] = Date.now()/1000;
          console.log(+illust_id, ": updated view date");
        }
        else console.log(`%c${illust_id}%c already in history (%c${new Date(this.timestamps[illust_id]*1000).toLocaleString()}%c)`, 'color:lime;', 'color:;', 'color:violet;', 'color:;');

        this.save();
      },

      delete_record(illust_id){
        this.load();

        let index = this.ids.indexOf(illust_id.toString());
        if (index > -1){
          this.ids.splice(index, 1);
        }
        delete this.timestamps[illust_id];

        this.save();
        console.log(+illust_id, "has been deleted from history");
      },

      async override() {
        this.load();
        localStorage.removeItem('viewed_illust_ids_' + USER_ID);
        localStorage.removeItem('viewed_illust_timestamp_' + USER_ID);
        this.save(); //force-reset history to use non-site variables only, saving 50% of space and not dealing with any arbitrary cases
        console.log(`History started loading [%c${this.ids.length}%c records]`, 'color:lime;', 'color:;');

        GM_addS(`
          .history-grid { display: flex; flex-wrap: wrap; gap: 0.5em; margin-top: 1em; }
          .history-grid ._history-item { display: block; width: 240px; height: auto; margin-bottom: 0; box-sizing: border-box; text-align: center; }
          .history-grid img { width: 100%; height: auto; max-height: 320px; object-fit: cover; display: block; margin: 0 auto; }
          ._history-items h1.date { width: 100%; margin: 1em 0 0.25em 0; padding: 0.25em 0; flex-basis: 100%; }
        `);

        let container = document.querySelector("._history-items");
        if (!container) {
          console.error("Container ._history-items not found"); //if happens add small wait
          return;
        }
        container.innerHTML = "";

        let ids = this.ids.map(String);
        let timestamps = this.timestamps;

        // Sort ids by timestamp DESCENDING
        ids.sort((a, b) => {
          let ta = parseFloat(timestamps[a] ?? 0);
          let tb = parseFloat(timestamps[b] ?? 0);
          return tb - ta;
        });

        const chunkSize = 100;
        const chunkQueue = [];

        for (let i = 0; i < ids.length; i += chunkSize) {
          chunkQueue.push(ids.slice(i, i + chunkSize));
        }

        let dateMap = {};
        let deleted = [];
        let totalImages = 0;

        const processChunk = async (chunk) => {
          const url = `https://www.pixiv.net/ajax/illust/detail?illust_ids=${encodeURIComponent(chunk.join(','))}`;
          try {
            const res = await fetch(url, { credentials: "include" });
            const json = await res.json();
            if (!json.body) return;

            container.parentNode?.removeAttribute('hidden');
            container.parentNode.classList?.remove('_hidden');

            for (let id of chunk) {
              const data = json.body[id];
              const thumb = data?.url?.["240mw"] || null;
              const pageCount = +data?.illust_page_count || 1;
              const date = timestamps[id] //site used inprecise dates for 'trial', so they should be equated to same format
                ? new Date(Math.floor(parseFloat(timestamps[id])) * 1000).toISOString().split("T")[0]
                : "0000-00-00";

              if (!thumb) {
                deleted.push(id);
                continue;
              }

              if (!dateMap[date]) dateMap[date] = [];
              dateMap[date].push({id, thumb, pageCount});
            }

          } catch (e) {
            console.error("Fetch error:", e);
          }
        };

        const renderEntries = () => {
          let sortedDates = Object.keys(dateMap).sort((a, b) => b.localeCompare(a)); // newest first
          for (let date of sortedDates) {
            const entries = dateMap[date];
            if (!entries || !entries.length) continue;

            const h1 = document.createElement("h1");
            h1.className = "date";
            h1.innerHTML = `${date}<span class="count">${entries.length}</span>`;
            container.appendChild(h1);

            const wrapper = document.createElement("div");
            wrapper.className = "history-grid";

            for (let { id, thumb, pageCount } of entries) {
              const link = document.createElement("a");
              link.className = "_history-item";
              link.href = `/artworks/${id}`;
              link.target = "_blank";
              link.rel = "noreferrer";

              const box = document.createElement("div");
              const img = document.createElement("img");
              img.src = thumb;
              box.appendChild(img);
              if (pageCount > 1) {
                const counter = document.createElement("div");
                counter.className = "page-count";
                counter.innerHTML = `<span>${pageCount}</span>`;
                box.appendChild(counter);
              }
              link.appendChild(box);
              wrapper.appendChild(link);
              totalImages++;
            }

            container.appendChild(h1);
            container.appendChild(wrapper);

            delete dateMap[date]; // prevent duplicate rendering
          }
          console.log(`History records loaded: %c${totalImages} %c| (missing: ${deleted.length})`, 'color:lime;', 'color:;');
        };

        let loading = false;
        const loadNextChunk = async () => {
          if (loading || chunkQueue.length === 0) return;
          loading = true;
          const nextChunk = chunkQueue.shift();
          await processChunk(nextChunk);
          renderEntries();
          loading = false;

          if (chunkQueue.length === 0) {
            window.removeEventListener("scroll", onScroll);
            console.log("✅ All history loaded.");
          }
        };

        const onScroll = () => {
          const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 300;
          if (nearBottom) loadNextChunk();
        };

        await loadNextChunk(); // load first chunk
        window.addEventListener("scroll", onScroll);
      },

      export(){
        this.load();
        if (this.ids.length !== Object.keys(this.timestamps).length){
          console.log(`!!! Length mismatch: ids = ${this.ids.length}, timestamps = ${Object.keys(this.timestamps).length}`);
        } //missing dates being discarded now, so not really important
        GM_setV("viewed_illust_ids", this.ids);
        GM_setV("viewed_illust_timestamps", this.timestamps);
        console.log(`History was exported to script manager storage [%c${this.ids.length}%c records]`, 'color:lime;', 'color:;');
      },

      check_space(){
        let spaceConsumed = +((new Blob([Object.values(localStorage), Object.keys(localStorage)]).size)/(5000*1024)).toFixed(3);
        if (spaceConsumed > 0.95){
          this.add_record = this.override = ()=>{};
          return Promise.reject(`Too much space consumed [${spaceConsumed*100}%] — history is disabled`); //~100.000 entries
        }
        else console.log('History initialized');
      }
    };
    getUserId().then(() => illust_history.check_space()).catch(e => console.error('History not initialized —', e));
    //===================================================================================
    if      (PAGETYPE===0)                  siteImgMaxWidth = 198;
    else if (PAGETYPE===4)                  siteImgMaxWidth = 150;
    else if (PAGETYPE===6 || PAGETYPE===14) siteImgMaxWidth = 240;
    //-----------------------------------------------------------------------------------
    $(document).ready(function ()
    {
      console.log('$(document).ready');
      mangaWidth = document.body.clientWidth - 60;
      mangaContainer.style.maxWidth = mangaWidth+'px';
      document.body.appendChild(imgContainer);
      document.body.appendChild(mangaOuterContainer);
      //--------------------------------------CSS----------------------------------------
      GM_addS(`
        .page-count { position: absolute; right: 1px; top: 1px; z-index: 1; display: flex; justify-content: center; align-items: center; min-width: 20px; font-weight: bold; background: rgba(0, 0, 0, 0.32); border-radius: 10px; font-size: 10px; line-height: 20px; color: #fff; }
        .page-count span { font-size: 10px; line-height: 20px; color: #fff; font-family: inherit; font-weight: bold; margin-top: -1px;}
      `);
      //---------------------------------Settings menu-----------------------------------
      let menu = document.createElement("div");
          menu.id = "menu";
      GM_addS(`
      #menu {
        position: absolute;
        display: block;
        visibility: hidden;
        top: 60px;
        left: 10px;
        padding: 10px 15px;
        border: 2px solid deepskyblue;
        background: rgba(255, 255, 255, 0.7);
        backdrop-filter: blur(8px);
        font-size: 14px;
        line-height: 20px;
        color: #000;
        border-radius: 15px;
        box-shadow: 0 0 10px rgba(0, 191, 255, 0.4);
        z-index: 999;
      }
      #menu li {
        list-style: none;
        font: inherit;
        margin-bottom: 4px;
      }
      #menu li:last-child {
        margin-bottom: 0;
      }
      #menu button {
        width: 50px;
        padding: 4px 6px;
        margin-right: 10px;
        color: black;
        background-color: rgba(255, 255, 255, 0.85);
        border: 1px solid #aaa;
        border-radius: 6px;
        cursor: pointer;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }
      `);

      //filling menu fields with values and property names
      for (let i = 0; i < propList.length; i++){
        menu.innerHTML += `<li><button>${propList[i].array[propList[i].paramIndex]}</button>${propList[i].name}</li>`
      }

      document.body.appendChild(menu);
      //---------------------------------------------------------------------------------
      function changeMenuValues(menuDiv){
        let index = Array.prototype.indexOf.call(menuDiv.parentNode.parentNode.children, menuDiv.parentNode);
        propList[index].paramIndex+=1;
        if (propList[index].paramIndex >= propList[index].array.length) propList[index].paramIndex = 0;
        menuDiv.textContent = propList[index].array[propList[index].paramIndex];

        //foolproof protection
        if (propList[0].paramIndex == 1){
          menu.childNodes[1].childNodes[0].disabled = true;
          propList[1].paramIndex = 0;
          menu.childNodes[1].childNodes[0].textContent = "0";
        }
        else{
          menu.childNodes[1].childNodes[0].disabled = false;
        }
      }

      $('#menu').on('click', 'button', function(){
        changeMenuValues(this);
      });
      //---------------------------------------------------------------------------------
      async function initMenu(){
        if ([-1,14].includes(PAGETYPE)) return;

        let menuButton; //put to global scope if (menuButton) is needed elsewhere
        let count = 0;
        while (!menuButton && count<5){
          menuButton = document.querySelector('button:has(pixiv-icon[name="24/Services"])');
          console.log(menuButton);
          await sleep(1000);
          ++count;
        }

        if (menuButton)
          menuButton.addEventListener("click", function(){
            menu.style.visibility = 'visible';
            clearTimeout(menuTimer);
            menuTimer = setTimeout(()=>{menu.style.visibility = 'hidden'}, 60*1000); //closing menu after 60s to prevent "hanging" it in one tab
          });
        else
          console.error("menuButton is undefined!");
      }
      //---------------------------------------------------------------------------------
      $(document).mouseup(function (e){
        if (!($(menu).has(e.target).length) && (menu.style.visibility == 'visible')){
          menu.style.visibility = 'hidden';
          saveSettings();
          if (currentSettings[propList[0].name] !== propList[0].array[propList[0].paramIndex]) setTimeout(()=>{initPreviewListeners(); initProfileCard()}, 0); //reset event listeners only after settings are applied
          setCurrentSettings();
          clearTimeout(menuTimer);
        }
      });
      //---------------------------------------------------------------------------------
      initMenu();
      //-------------------------------Follow onclick------------------------------------
      let toFollow, followSelector;
      //---------------------------------------------------------------------------------
      function initFollowagePreview()
      {
        if ([1,2,7,8,12].includes(PAGETYPE)){
          followSelector = 'button:contains("Follow")';
        }
        else if ([4,6,13].includes(PAGETYPE)){
          followSelector = '.follow-button';
        }
        else return 0;

        $('body').off('mouseup', followSelector); //clearing previous events

        if ([1,2,4,6,7,8,12,13].includes(PAGETYPE))
        {
          $('body').on('mouseup', followSelector, function(){
            toFollow = (this.textContent == 'Follow'); //~mustn't work on non-English locale| todo: add some locale-specific text condition?
            followage(this, toFollow);
          });
        }

        if ([2,7].includes(PAGETYPE)){
          $('body').off('mouseup', '.gtm-profilepage-dotmenu-recommendedusersitem');
          $('body').on('mouseup', '.gtm-profilepage-dotmenu-recommendedusersitem', followagePreview);
        }
      }
      //---------------------------------------------------------------------------------
      initFollowagePreview();
      //====================================PAGINATION===================================
      async function autoPagination(){
        $('section ul').off('click', 'button');
        window.onscroll = null;
        //-------------------------------------------------------------------------------
        if (!currentSettings['ENABLE_AUTO_PAGINATION'] || ![0,2,7].includes(PAGETYPE)) return -1;

        let pageCount = location.href.match(/(?<=[?|&]p=)\d+/)?.[0] || 1;
        let mode = location.href.match(/r18/)?.[0] || "All";
        let maxPageCount = 35; //limit for Following is 35 pages

        let authorId = location.href.match(/(?<=users\/)\d+/)?.[0];
        let artworks = !!location.href.match(/\d+\/artworks/)?.[0];
        let illusts = !!location.href.match(/illustrations/)?.[0];
        let manga = !!location.href.match(/manga/)?.[0];
        let rest = location.href.match(/rest=hide/)?.[0] && "hide" || "show";
        //let tags = location.href.match(/(?<=illustrations\/|manga\/|artworks\/)[^?]+/) || '';
        //-------------------------------------------------------------------------------
        let x_csrf_token = document.documentElement.innerHTML.match(/(?<=token\W+)\w+/)[0]; //for bookmarks
        if (!x_csrf_token) request('/en/', 'document').then(response => x_csrf_token = response.documentElement.innerHTML.match(/(?<=token\W+)\w+/));
        //-------------------------------------------------------------------------------
        let artsSection = await waitForArtSectionContainers();
        await sleep(2000);
        let art = $(artsSection.querySelector('a[href*="artworks"]')).parents('li')[0].cloneNode(true);
        let mangaCount = document.createElement('div');
            mangaCount.className = "page-count";
            mangaCount.innerHTML = `<span></span>`;
        if (!art.querySelector('span')) art.querySelector('[href]').appendChild(mangaCount);
        art.querySelectorAll('img').forEach(el => el.src='');
        art.classList.add("paginated");
        //-------------------------------------------------------------------------------
        pageNumber = pageNumber ?? mangaCount.cloneNode(true);
        pageNumber.className = "pageNumber";
        pageNumber.style = "position: fixed; right: 5px; bottom: 5px; height: 16px; min-width: 16px; width: max-content; padding: 0px 4px; z-index: 1; display: flex; justify-content: center; align-items: center; flex: 0 0 auto; box-sizing: border-box; font-weight: bold; background: rgba(0, 0, 0, 0.32) none repeat scroll 0% 0%; border-radius: 16px; font-size: 10px; line-height: 10px; color: rgb(255, 255, 255); opacity: 0%; transition: opacity 1s;";
        document.body.appendChild(pageNumber);
        //-------------------------------------------------------------------------------
        let running = false, urls = [];

        window.onscroll = async function(){
          if ((window.innerHeight*1.8 + window.scrollY) >= document.body.scrollHeight){
            if (running || pageCount>=maxPageCount) return;

            running = true;
            pageCount++;

            let url;
            let tags = location.href.match(/(?<=illustrations\/|manga\/|artworks\/)[^?]+/) || '';

            if (PAGETYPE == 0){
              url = `https:\/\/www\.pixiv\.net\/ajax\/follow_latest\/illust\?p=${pageCount}\&mode=${mode}\&lang=en`;
            }
            if (PAGETYPE == 2){
              if (!urls.length && !tags){
                urls = [];
                await fetch(`https://www.pixiv.net/ajax/user/${authorId}/profile/all?lang=en`).then(r => r.json()).then(response => {
                  let iArr = (illusts || artworks) && Object.keys(response.body.illusts) || [];
                  let mArr = (manga || artworks) && Object.keys(response.body.manga) || [];
                  let arr = iArr.concat(mArr).sort(function(a,b){return a-b}).reverse();
                  for(let i=(pageCount-1)*48; i<arr.length; i+=48){
                    urls.push(`https://www.pixiv.net/ajax/user/${authorId}/profile/illusts?ids[]=`
                      + arr.slice(i, i+48).join('&ids[]=')
                      + "&work_category=illustManga&is_first_page=0&lang=en"
                    );
                  }
                });
                if (!urls.length) return; //maybe check nav element before fetching instead
                maxPageCount = urls.length + 1;
              }

              if (tags){
                let illustManga = artworks && 'illustmanga' || illusts && 'illusts' || manga && 'manga';
                url = `https:\/\/www\.pixiv\.net\/ajax\/user\/${authorId}\/${illustManga}\/tag\?tag=${tags}\&offset=${(pageCount-1)*48}\&limit=48\&lang=en`;
              }
              else{
                url = urls.shift();
              }
            }
            if (PAGETYPE == 7){
              url = `https:\/\/www\.pixiv\.net\/ajax\/user\/${authorId}\/illusts\/bookmarks\?tag=${tags}\&offset=${(pageCount-1)*48}\&limit=48\&rest=${rest}\&lang=en`
            }

            console.log('Loading', pageCount, 'page...');

            fetch(url).then(r => r.json()).then(response => {
              let fragment = new DocumentFragment();
              Array.prototype.forEach.call(response.body?.thumbnails?.illust || Object.values(response.body.works).reverse(), (obj) => {
                let el = art.cloneNode(true);
                if (obj.pageCount > 1) [...(el.querySelectorAll('span'))].pop().textContent = obj.pageCount;
                else $(el.querySelector('span')).parents('a > div')[0].remove();
                //-----------------------------------------------------------------------
                let s = el.querySelector('[href]').href.match('/en/')?.[0] || '/';
                let hrefs = el.querySelectorAll('[href]');

                hrefs[0].setAttribute('data-gtm-value', obj.id);
                hrefs[0].href = s + "artworks/" + obj.id;

                hrefs[1].href = s + "artworks/" + obj.id;
                hrefs[1].textContent = obj.title;

                el.querySelector('img').src = obj.url;

                if (hrefs.length == 4){
                  hrefs[2].setAttribute('data-gtm-value', obj.userId);
                  hrefs[2].href = s + "users/" + obj.userId;

                  hrefs[3].setAttribute('data-gtm-value', obj.userId);
                  hrefs[3].href = s + "users/" + obj.userId;
                  hrefs[3].textContent = obj.userName;

                  el.querySelectorAll('img')[1].src = obj?.profileImageUrl || ''; //for deleted bookmarks
                }

                if (obj.bookmarkData) el.querySelectorAll('path:not(:only-child)').forEach(e => {
                  e.setAttribute("style", "fill: rgb(255, 64, 96); !important")
                });
                //-----------------------------------------------------------------------
                el.style.display = "list-item"; //needed - 'none' otherwise
                fragment.appendChild(el);
              });
              if (PAGETYPE==7 || tags) maxPageCount = Math.ceil(response.body.total/48);

              artsSection.appendChild(fragment);
              running = false;
            });

            if (pageCount>=maxPageCount){
              console.log('*All pages loaded*');
              [...document.querySelectorAll("nav")].pop().style.opacity = 0.3;

              pageNumber.querySelector('span').textContent = `All pages loaded [${pageCount}]`;
              pageNumber.style.opacity = "100%";
              setTimeout(()=>pageNumber.style.opacity = "0%", 3000);
            }
            else{
              pageNumber.querySelector('span').textContent = `${pageCount}/${maxPageCount}`;
              pageNumber.style.opacity = "100%";
              setTimeout(()=>pageNumber.style.opacity = "0%", 1500);
            }
          } //endif
        } //onscroll
        //-------------------------------------------------------------------------------
        $(artsSection).on('click', 'button', async function(event){
          event.preventDefault();
          event.stopPropagation();

          let illust_id = searchNearestNode(this,'[href*="/artworks/"]').href.match(/\d+/)[0];
          let r = await request('https://www.pixiv.net/ajax/illust/'+illust_id);
          let bookmark_id = +r.body.bookmarkData?.id; //already bookmarked -> click means unbookmark
          let b_mode, headers, body, style;

          if (bookmark_id > 0){
            b_mode = 'delete';
            headers = {
              'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
              'x-csrf-token': x_csrf_token};
            body = `bookmark_id=${encodeURIComponent(bookmark_id)}`;
            style = `fill: rgb(34, 34, 34);`;
          }
          else{
            b_mode = 'add';
            headers = {
              'Content-Type': 'application/json; charset=utf-8',
              'x-csrf-token': x_csrf_token};
            body = JSON.stringify({"illust_id":illust_id, "restrict":0, "comment":"", "tags":[]});
            style = `fill: rgb(255, 64, 96);`;
          }

          fetch('/ajax/illusts/bookmarks/'+b_mode, {
            method: 'POST',
            headers: headers,
            body: body
          })
          .then(() => this.querySelectorAll('path:not(:only-child)').forEach(e => e.setAttribute("style", style)))
          .catch(err => console.log(err));
        });
        //-------------------------------------------------------------------------------
        return 0;
      }
      //=================================================================================
      function initMutationObservers()
      {
        observer.disconnect();
        $('body').off('mouseup', 'a[href*="/discovery"]');
        $('body').off('mouseup', 'a[href*="bookmarks/artworks"]');
        $('body').off('mouseup', 'section>div>a[href*="/artworks"], a[href*="/illustrations"], a[href*="/manga"]');
        //-------------------------------------------------------------------------------
        if (PAGETYPE===0){
          autoPagination().then(v => {
            if (v === 0){
              $('body').on('mouseup', 'a[href*="/bookmark_new_illust"]', function(e){
                e.preventDefault();
                location.href = this.href;
              });
            }
          })
        }
        //-------------------------------------------------------------------------------
        if (PAGETYPE===1){
          colorFollowed();
          initMutationObject({'childList': true, 'subtree': true});

          let timeout_1;
          $('body').on('mouseup', 'a[href*="/discovery"]', function(){
            clearTimeout(timeout_1);
            timeout_1 = setTimeout(() => {
              if (PAGETYPE===1){
                colorFollowed();
                initMutationObject({'childList': true, 'subtree': true});
              }
            }, 2000);
          });
        }
        //---------------------------Bookmark detail page cleaning-----------------------
        if (PAGETYPE===4)
        {
          if (currentSettings["HIDE_PEOPLE_WHO_BOOKMARKED_THIS"])
            $('.bookmark-list-unit')[0].remove();

          initMutationObject({'childList': true});
        }
        //-----------------------------Daily rankings ad cleaning------------------------
        if (PAGETYPE===6)
        {
          colorFollowed();
          $('.ad-printservice').remove();

          initMutationObject({'childList': true});
        }
        //----------------------------------Artwork page---------------------------------
        if (PAGETYPE===12)
        {
          initMutationObject({'childList': true});
          illust_history.add_record(location.href.match(/\d+/)[0]);
        }
        //----------------------------------Search page----------------------------------
        if (PAGETYPE===8)
        {
          initMutationObject({'childList': true, 'subtree': true});
        }
        //----------------------------------Main page------------------------------------
        if (PAGETYPE===10)
        {
          colorFollowed();
          initMutationObject({'childList': true, 'subtree': true});
        }
        //-------------------------------Pixiv User pages--------------------------------
        if (PAGETYPE===2 || PAGETYPE===7)
        {
          let pagination = autoPagination(); //2,7

          $('body').on('mouseup', 'a[href*="bookmarks/artworks"]', function(){
            console.log('PAGETYPE: '+ PAGETYPE+' -> 7');
            PAGETYPE = 7;

            sleep(5000).then(() => {
              initMutationObject({'childList': true});
              autoPagination().then((v)=>{colorFollowed(null, v && 2000)}); //success(0) -> already waited 2+ secs; disabled(-1) -> need to wait
              initProfileCard();
            });
          });

          $('body').on('mouseup', 'section>div>a[href$="/artworks"], a[href$="/illustrations"], a[href$="/manga"]', function(){
            console.log('PAGETYPE: '+ PAGETYPE+' -> 2');
            PAGETYPE = 2;
            sleep(2500).then(autoPagination);
            observer.disconnect();
          });

          if (PAGETYPE===7){
            initMutationObject({'childList': true});
            pagination.then((v)=>{colorFollowed(null, v && 2000)}); //if pagination is enabled we need to wait before it completes*, but no more
            initProfileCard();
          }

          //clearing "cache" of autopaged arts
          $('body').on('mouseup', 'section>div>div>div>a[href*="/illustrations/"], section>div>div>div>a[href*="/artworks/"], section>div>div>div>a[href*="/manga/"]', function(){
            let artsSection = getArtSectionContainers();
            [...artsSection.querySelectorAll('.paginated')].forEach(el => el.remove());
          });
        }
        //------------------------------------History------------------------------------
        if (PAGETYPE===14){
          let trial = document.querySelector('span.trial'); //indicator of non-premium account
          if (trial){
            getUserId().then(() => illust_history.override());
            trial.textContent = "Extended Version";
            document.querySelector('.no-item')?.remove();
          }

          //export with Shift+E
          document.onkeyup = function(e){
            if (e.key.toUpperCase() == "E" && e.shiftKey){
              illust_history.export();
            }
          };
        }
        //-------------------------------------------------------------------------------
      }
      //---------------------------------------------------------------------------------
      initMutationObservers();
      //=================================================================================
      //***************************************HOVER*************************************
      //=================================================================================
      //------------------------------------Profile card--------------------------------- //4,6,9 [~0,1,~7,8,10,12]
      function initProfileCard()
      {
        $('body').off('mouseenter click', 'section._profile-popup a[href*="/artworks/"]');
        $('body').off("mouseenter", '.paginated a[href*="/users/"]');
        $('body').off("mouseleave", '.paginated a[href*="/users/"]');
        //-------------------------------------------------------------------------------
        if ([4,6].includes(PAGETYPE)) //rankings
        {
          $('body').on(previewEventType, 'section._profile-popup a[href*="/artworks/"]', function(e)
          {
            console.log('Profile card');
            e.preventDefault();
            checkDelay(setHover, this, getOffsetRect(this).top+200+'px', true);
          });
        }
        //-------------------------------------------------------------------------------
        if ([0,7].includes(PAGETYPE) && currentSettings['ENABLE_AUTO_PAGINATION']) //patch for profile preview with pagination
        {
          //creating profile card(for last 3 arts)
          GM_addS(`
            ._profile-popup {visibility: hidden; position: absolute; height: 128px; z-index: 999; padding: 0;}
            ._profile-images-container {overflow: hidden; height: 128px; border-radius: 5px; border: 1px solid #c7d2dc; padding: 0; background: #fff;}
            ._profile-images-container > a {display: inline-block !important; width: 128px; height: 128px; position: relative;}
            .page-count:has(span:empty) {visibility: hidden;}
          `);
          let profilePopup = document.createElement('section');
              profilePopup.className = '_profile-popup';
              profilePopup.onmouseleave = function(e){
                profilePopup.style.visibility = "hidden";
                if (e.relatedTarget?.id != 'imgPreview') imgContainer.style.visibility = "hidden";
              }
          let profileImagesDiv = document.createElement('div');
              profileImagesDiv.className = '_profile-images-container';
              profilePopup.appendChild(profileImagesDiv);

          for (let i=0; i<3; i++){
            let a = document.createElement('a');
                a.className = `item_${i}`;
                a.target = "_blank";
            let mangaCount = document.createElement('div');
                mangaCount.className = "page-count";
                mangaCount.innerHTML = `<span></span>`;
            a.appendChild(mangaCount);
            profileImagesDiv.appendChild(a);
          }
          document.body.appendChild(profilePopup);

          let profileCard_timeout, previous_id;
          //handler for showing paginated profile card
          $('body').on("mouseenter", '.paginated a[href*="/users/"]', function(e){
            e.preventDefault();
            let user_id = this.href.match(/\d+/)[0];
            if (user_id == 0) return;
            if (previous_id == user_id){
              profilePopup.style.top = getOffsetRect(this.parentNode).top - 128 + "px";
              profilePopup.style.left = getOffsetRect(this.parentNode).left - 128+24 + "px";
              profilePopup.style.visibility = "visible";
              return;
            }
            else{
              profilePopup.querySelectorAll('span').forEach(s => s.textContent = '');
            }
            clearTimeout(profileCard_timeout); //cancelling previous event
            profilePopup.firstChild.childNodes.forEach(el => el.style.backgroundImage = '');

            profileCard_timeout = setTimeout(fillProfileCard.bind(this, user_id), 500);
          });

          function fillProfileCard(user_id){
            if (!([].indexOf.call(document.querySelectorAll(':hover'), this) > -1)) return; //need to check whether mouse is still over user profile after 500ms

            profilePopup.style.top = getOffsetRect(this.parentNode).top - 128 + "px";
            profilePopup.style.left = getOffsetRect(this.parentNode).left - 128+24 + "px"; //-sq.preview +icon
            profilePopup.style.visibility = "visible";

            fetch(`https://www.pixiv.net/rpc/get_profile.php?user_ids=${user_id}&illust_num=3&novel_num=0`).then(r => r.json()).then(response => {
              response.body[0].illusts.forEach((el,i) => {
                const item = profilePopup.querySelector(`a.item_${i}`);
                item.style.backgroundImage = `url(${el.url["128x128"]})`;
                item.href = `/artworks/${el.illust_id}`;
                item.querySelector('.page-count span').textContent = el.illust_page_count > 1 ? el.illust_page_count : '';
              })
            });
            previous_id = user_id;
          }
          //actual art preview
          $('body').on(previewEventType, 'section._profile-popup a[href*="/artworks/"]', function(e){
            e.preventDefault();
            if (this.querySelector('span').textContent > "")
              checkDelay(setMangaHover, this, this.textContent, "auto");
            else
              checkDelay(setHover, this, getOffsetRect(this).top+128+5+'px', true);
          });

          $('body').on("mouseleave", `.paginated div[aria-haspopup]`, function(e){
            if (!e.relatedTarget?.closest('._profile-popup')) profilePopup.style.visibility = "hidden";
          });
        }
      }

      initProfileCard();
      //=================================================================================
      //*******************************Initialize Preview Listeners**********************
      //=================================================================================
      function initPreviewListeners()
      {
        //clearing-----------------------------------------------------------------------
        $('body').off('click mouseenter', 'a[href*="/artworks/"]');
        $('body').off('click mouseenter', 'a[href*="/artworks/"] img');
        $('body').off('click', '[role="presentation"] img');
        //document.removeEventListener('click'); //not worth bothering
        //-------------------------------------------------------------------------------
        if (previewEventType == 'click'){
          document.addEventListener('click', (e)=>{
            if (e.target.nodeName==="IMG") e.preventDefault();
          }, {capture: true}) //site uses event capturing now which jQuery can't cover
        }
        //-------------------------------------------------------------------------------
        //New illustrations, Discovery[Artworks], Artist pages, Bookmarks, Search, Home page, Artwork page //0,1,2,7,8,10,12
        if (PAGETYPE === 0 || PAGETYPE === 1 || PAGETYPE === 2 || PAGETYPE === 7 || PAGETYPE === 8 || PAGETYPE === 10 || PAGETYPE === 12)
        {
          console.info('new');
          $('body').on(previewEventType, 'a[href*="/artworks/"] img', function(e)
          {
            e.preventDefault();
            //---------------------------filtering preview card--------------------------
            if (getElementByXpath("//a[text()='View Profile']")){
              if (this.closest('a').querySelector('span'))
                checkDelay(setMangaHover, this, this.closest('a').textContent, "auto");
              else
                checkDelay(setHover, this, "auto", true);
            }
            //-------------------------filtering recommended users-----------------------
            else if (getElementByXpath("//div[text()='Recommended users']")){
              let top = window.scrollY + 5 + 'px';
              checkDelay(setHover, this, top);
            }
            //--------------------------------Normal case--------------------------------
            else{
              //console.log(this);
              //multiple
              if (this.closest('a').querySelector('span'))
                checkDelay(setMangaHover, this, this.closest('a').textContent.replace(/R-18(G)?/,""));
              //single
              else checkDelay(setHover, this);
            }
            //---------------------------------------------------------------------------
          });
          //-----------------------------------------------------------------------------
          if (PAGETYPE === 12) $('body').on('click', '[role="presentation"] img', function(event){
            if (event.ctrlKey){
              event.preventDefault();
              event.stopPropagation();
              let isManga = !!document.querySelector('.gtm-manga-viewer-preview-modal-open');
              onClickActions(this, event, isManga);
            }
          });
        }
        //----------------------DAILY RANKINGS & BOOKMARK INFORMATION PAGES-------------- //4,6
        else if (PAGETYPE === 4 || PAGETYPE === 6)
        {
          $('body').on(previewEventType, 'a[href*="/artworks/"]', function(e) //direct div selector works badly with "::before"
          {
            e.preventDefault();
            //console.log(this);
            //single
            if (this.childNodes.length == 1 && this.childNodes[0].nodeName=="DIV"){
              checkDelay(setHover, this.querySelector('img'));
            }
            //multiple
            else if (this.children[1] && this.children[1].className == 'page-count'){
              checkDelay(setMangaHover, this.querySelector('img'), this.querySelector('.page-count').textContent);
            }
          });
        }
        //----------------------------------DISCOVERY[USERS]----------------------------- //13
        else if (PAGETYPE === 13)
        {
          $('body').on(previewEventType, 'a[href*="/artworks/"]:has(img)', function(e){
            e.preventDefault();
            let count = +[...this.querySelectorAll('span')].filter(el => el.textContent>1)[0]?.textContent;
            if (count > 1)
              checkDelay(setMangaHover, this.querySelector('img'), count); //manga
            else
              checkDelay(setHover, this.querySelector('img')); //single art
          });
        }
        //-------------------------------------History----------------------------------- //14
        else if (PAGETYPE === 14)
        {
          $('body').on(previewEventType, '._history-item', function(e){
            e.preventDefault();
            if (this.querySelector('.page-count'))
              checkDelay(setMangaHover, this.querySelector('img'), this.querySelector('.page-count').textContent, getOffsetRect(this).top + 'px')
            else
              checkDelay(setHover, this.querySelector('img'), getOffsetRect(this).top + 'px');
          });
        }
      }
      //---------------------------------------------------------------------------------
      initPreviewListeners();
      //=================================================================================
      if (currentSettings["DELAY_BEFORE_PREVIEW"]>0) $('body').on('mouseleave', 'a[href*="/artworks/"]', function()
      {
        clearTimeout(timerId);
        clearInterval(tInt);
      });
      //---------------------------------Async page change-------------------------------
      function renewAll()
      {
        if (PAGETYPE != checkPageType())
        {
          console.log('PAGETYPE:', PAGETYPE, '->', PAGETYPE = checkPageType());

          clearTimeout(timerId);
          clearInterval(tInt);

          if (PAGETYPE === -1) return;

          initPreviewListeners();
          initMutationObservers();
          initMenu();
          autoPagination();

          initFollowagePreview();
          initProfileCard();
        }
      }
      //---------------------------------------------------------------------------------
      renewObserver.init(renewAll);
      renewObserver.observe($('body')[0], {childList: true, subtree: true});
      //---------------------------------------------------------------------------------
    }); //end of document.ready
    //===================================================================================
    //-----------------------------------------------------------------------------------
    function checkDelay(func, ...args)
    {
      if (currentSettings["DELAY_BEFORE_PREVIEW"]>0){
        clearTimeout(timerId);
        timerId = setTimeout(()=>{
          if ([].indexOf.call(document.querySelectorAll(':hover'), (PAGETYPE!=6)? args[0] : args[0].parentNode.parentNode) > -1) func(...args)
        }, currentSettings["DELAY_BEFORE_PREVIEW"]);
      }
      else func(...args)
    }
    //-----------------------------------------------------------------------------------
    function setHover(thisObj, top, profileCard)
    {
      clearInterval(tInt);
      timerIds.forEach(id => clearTimeout(id));
      timerIds.length = 0;
      imgContainer.style.visibility = 'hidden';
      mangaOuterContainer.style.visibility = 'hidden';
      hoverImg.src=''; //just in case

      hoverImg.src = parseImgUrl(thisObj);
      imgContainer.style.top = calcPreviewTop(thisObj, top);

      //adjusting preview position considering expected image width
      //---------------------------------------------------------------------------------
      let l = ([4,6,14].includes(PAGETYPE))
          ?getOffsetRect(thisObj.parentNode.parentNode).left //more accurate on discovery users and history
          :getOffsetRect(thisObj).left;
      let dcw = document.body.clientWidth;
      let previewWidth = PREVIEWSIZE;

      if (hoverImg.naturalWidth>0){ //cached (previously viewed)
        adjustSinglePreview(dcw, l, hoverImg.naturalWidth, (PAGETYPE!=6)?thisObj:thisObj.parentNode.parentNode);
        //console.log("cached");
      }
      else{ //on old pages width can be pre-calculated
        if ([4,6,14].includes(PAGETYPE) && !profileCard){
          previewWidth = PREVIEWSIZE*(((PAGETYPE==6 || PAGETYPE==14)?thisObj.clientWidth:thisObj.parentNode.parentNode.clientWidth)/siteImgMaxWidth)+5;
          adjustSinglePreview(dcw, l, previewWidth, (PAGETYPE!=6)?thisObj:thisObj.parentNode.parentNode);
          //console.log("count");
        }
        else{ //if it is obvious that preview will fit on the screen then there is no need in setInterval(trying to use as minimun setInterval`s as possible)
          if (dcw - l - PREVIEWSIZE - 5 > 0){
            imgContainer.style.left = l+'px';
            imgContainer.style.visibility = 'visible';
            //console.log("excessive");
          }
          else{ //when on NEW layout - need to wait until image width is received
            let tLimit = 0;

            tInt = setInterval(function(){
              if (hoverImg.naturalWidth>0){
                clearInterval(tInt);
                adjustSinglePreview(dcw, l, hoverImg.naturalWidth, thisObj); //position mismatching due to old `thisObj` => clearing in hoverImg.mouseleave
              }
              ++tLimit;
              //console.log(tInt, tLimit);

              if (tLimit*40>5000){ //timeout 5s in case of loading errors
                clearInterval(tInt);
                hoverImg.src='';
                console.error('setInterval error');
                return;
              }
            }, 40);
          }
        }
      }
      //---------------------------------------------------------------------------------
      checkBookmark(thisObj, imgContainer);
    }
    //-----------------------------------------------------------------------------------
    function adjustSinglePreview(dcw, l, contentWidth)
    {
      if (l<0) l = 5; //followage preview
      let d = dcw - l - contentWidth - 5; //5 - padding - todo...
      imgContainer.style.left = (d>=0)?l+'px':l+d+'px';
      imgContainer.style.visibility = 'visible';
    }
    //-----------------------------------------------------------------------------------
    function calcPreviewTop(thisObj, top, extraHeight = 0){
      if (top === "auto" && PREVIEWSIZE>=1200) return document.documentElement.scrollTop + (window.innerHeight - (PREVIEWSIZE + extraHeight)) / 2 + "px";
      if (top) return top;
      return getOffsetRect(thisObj.parentNode.parentNode).top + "px";
    }
    //-----------------------------------------------------------------------------------
    function setMangaHover(thisObj, count, top)
    {
      clearInterval(tInt);
      imgContainer.style.visibility = 'hidden'; //just in case

      mangaOuterContainer.style.top = calcPreviewTop(thisObj, top, 27); //scrollbar (+borders?..)

      checkBookmark(thisObj, mangaOuterContainer);

      imgsArrInit(thisObj, +count);
    }
    //-----------------------------------------------------------------------------------
    function imgsArrInit(thisObj, count, batch = 3)
    {
      let primaryLink = parseImgUrl(thisObj);
      let currentImgId = getImgId(primaryLink);
      //---------------------------------------------------------------------------------
      function loadImg(i) {
        imgsArr[i].src = primaryLink.replace('p0', 'p'+i);
      }
      //---------------------------------------------------------------------------------
      if (currentImgId != lastImgId)
      {
        timerIds.forEach(id => clearTimeout(id));
        timerIds.length = 0;
        for(let j=0; j<imgsArr.length; j++){
          imgsArr[j].src = '';
        }

        lastImgId = currentImgId;

        for(let i=0; i<count; i++)
        {
          if (!(!!imgsArr[i])) //if [i] img element doesn't exist
          {
            imgsArr[i] = document.createElement('img');
            mangaContainer.appendChild(imgsArr[i]);
          }
          if (i <= batch) //priority-load {batch} arts
            loadImg(i)
          else{
            const timer = setTimeout(loadImg, batch*1500 + i*300, i);
            timerIds.push(timer); //if preview was hovered accidentally there's time to cancel following requests [without await/promise/fetch]
          }
        }
      }
      //---------------------------------------------------------------------------------
      mangaOuterContainer.style.visibility = 'visible';
    }
    //-----------------------------------------------------------------------------------
    function parseImgUrl(thisObj)
    {
      let url = (thisObj.src)? thisObj.src: thisObj.style.backgroundImage.slice(5,-2);
      url = url.replace(/\/...x..[0|8]/, '/'+PREVIEWSIZE+'x'+PREVIEWSIZE).
                replace('_square1200','_master1200').
                replace('_custom1200','_master1200').
                replace('custom-thumb','img-master').
                replace('_80_a2','').
                replace('_70','')
      ;
      return url;
    }
    //-----------------------------------------------------------------------------------
    function checkBookmark(thisContainer, previewContainer)
    {
      if ([0,1,2,7,8,10,12].includes(PAGETYPE))
        bookmarkContainer = searchNearestNode(thisContainer, 'button');
      else if ([4,6].includes(PAGETYPE))
        bookmarkContainer = searchNearestNode(thisContainer, "._one-click-bookmark")
      else return; //no favourite button

      if ($(bookmarkContainer).hasClass("on"))
        $(previewContainer).css("background", "rgb(255, 64, 96)"); //purple
      else
        $(previewContainer).css("background", "rgb(34, 34, 34)"); //grey
    }
    //-----------------------------------------------------------------------------------
    function getImgId(str)
    {
      return str.substring(str.lastIndexOf("/")+1, str.indexOf("_"));
    }
    //-----------------------------------------------------------------------------------
    function getOffsetRect(elem)
    {
      // (1)
      let box = elem.getBoundingClientRect();
      // (2)
      let body = document.body;
      let docElem = document.documentElement;
      // (3)
      let scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
      let scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;
      // (4)
      let clientTop = docElem.clientTop || body.clientTop || 0;
      let clientLeft = docElem.clientLeft || body.clientLeft || 0;
      // (5)
      let top  = box.top +  scrollTop - clientTop;
      let left = box.left + scrollLeft - clientLeft;

      return { top: Math.round(top), left: Math.round(left) };
    }
    //===================================================================================
    //**************************************Hide*****************************************
    //===================================================================================
    imgContainer.onmouseleave = function()
    {
      imgContainer.style.visibility = 'hidden';
      hoverImg.src='';
      clearTimeout(timerId);
      clearInterval(tInt);
    };
    //-----------------------------------------------------------------------------------
    mangaOuterContainer.onmouseleave = function()
    {
      mangaOuterContainer.style.visibility = 'hidden';
      clearTimeout(timerId);
    };
    //===================================================================================
    //***********************************Art Clicks**************************************
    //===================================================================================
    //-----------------------------Single arts onclick actions---------------------------
    hoverImg.onmouseup = function (event)
    {
      onClickActions(this, event, false);
    };
    //-----------------------------Manga arts onclick actions----------------------------
    $('body').on('mouseup', 'div#mangaContainer > img', function(event)
    {
      onClickActions(this, event, true);
    });
    //---------------------------------onClickActions------------------------------------
    async function onClickActions(imgContainerObj, event, isManga)
    {
      event.preventDefault();
      let illustId = getImgId(imgContainerObj.src);
      //----------------------------Middle Mouse Button click----------------------------
      if (event.button == 1)
      {
        let illustPageUrl = 'https://www.pixiv.net/artworks/' + illustId;
        window.open(illustPageUrl,'_blank'); //open illust page in new tab(in background — with FF pref "browser.tabs.loadDivertedInBackground" set to "true")
      }
      //----------------------------Left Mouse Button clicks...--------------------------
      else if (event.button == 0)
      {
        //----------------------------Single LMB-click-----------------------------------
        if (event.shiftKey){
          illust_history.delete_record(illustId); //Shift + LMB-click -> delete record from history
          document.querySelector(`[href*="/${illustId}"]`)?.style.setProperty('opacity', '0.25');
        }
        else if (!event.altKey) //need to be this way. Don't change.
        {
          let toSave = event.ctrlKey; //Ctrl + LMB-click -> saving image
          let pageNum = 0;

          //Single (general url)
          let ajaxIllustUrl = 'https://www.pixiv.net/ajax/illust/' + illustId;
          //https://www.pixiv.net/rpc/index.php?mode=get_illust_detail_by_ids&illust_ids=

          //Manga
          if (isManga)
          {
            let src = imgContainerObj.src;
            pageNum = src.match(/(?<=\/\d+_p)\d+(?=[_|.])/)[0];
          }

          getOriginalUrl(ajaxIllustUrl, pageNum, toSave);
        }
        //-----------------------------Alt + LMB-click-----------------------------------
        else if (event.altKey){
          $(bookmarkContainer).click();
          if (!isManga) $(imgContainerObj).parent().css("background", "rgb(255, 64, 96)");
          else $(mangaOuterContainer).css("background", "rgb(255, 64, 96)");
        }
        //-------------------------------------------------------------------------------
      }
      //---------------------------------------------------------------------------------
    }
    //---------------------------------getOriginalUrl------------------------------------
    async function getOriginalUrl(illustPageUrl, pageNum, toSave)
    {
      let xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.open("GET", illustPageUrl, true);
      xhr.onload = function ()
      {
        let originalArtUrl = this.response.body.urls.original; //this.response.body.url.big;
        if (pageNum>0) originalArtUrl = originalArtUrl.replace('p0','p'+pageNum);

        if (toSave)    saveImgByUrl(originalArtUrl);
        else           window.open(originalArtUrl, '_blank');
      };
      xhr.send();
    }
    //-----------------------------------------------------------------------------------
    async function saveImgByUrl(sourceUrl)
    {
      const filename = sourceUrl.split('/').pop();
      const illustId = filename.split('_')[0];
      const ext = filename.split('.').pop().toLowerCase();
      const GMR = (typeof(GM_xmlhttpRequest)==='function')?GM_xmlhttpRequest:GM.xmlHttpRequest;

      //Thanx to FlandreKawaii(c)
      GMR({
        method: 'GET',
        url: sourceUrl,
        responseType: 'arraybuffer', //TM
        binary: true, //GM
        headers: {
          Referer: `https://www.pixiv.net/en/artworks/${illustId}`,
        },
        onload: function(response)
        {
          if (ext === 'jpg' || ext === 'jpeg')
            saveAs(new File([response.response], filename, { type: 'image/jpeg' }));
          else if (ext === 'png')
            saveAs(new File([response.response], filename, { type: 'image/png' }));
        }
      });
    }
    //===================================================================================
    //**************************************Other****************************************
    //===================================================================================
    mangaContainer.onwheel = function(e)
    {
      if (e.deltaY<0 && (mangaOuterContainer.getBoundingClientRect().top < 0))
      {
        setTimeout(()=>mangaOuterContainer.scrollIntoView({block: "start", behavior: "smooth"}), 0); //aligning to top screen side on scrollUp if needed
      }
      else if (e.deltaY>0 && (mangaOuterContainer.getBoundingClientRect().bottom > document.documentElement.clientHeight))
      {
        setTimeout(()=>mangaOuterContainer.scrollIntoView({block: "end", behavior: "smooth"}), 0); //aligning to bottom screen side on scrollDown if needed
      }

      let scrlLft = mangaContainer.scrollLeft;
      if ((currentSettings["DISABLE_MANGA_PREVIEW_SCROLLING_PROPAGATION"]) || ((scrlLft>0 && e.deltaY<0) || ((scrlLft<(mangaContainer.scrollWidth-mangaContainer.clientWidth)) && e.deltaY>0)))
      {
        e.preventDefault();
        mangaContainer.scrollLeft += e.deltaY*DELTASCALE;
      }
    };
    //-----------------------------------------------------------------------------------
    if (currentSettings["SCROLL_INTO_VIEW_FOR_SINGLE_IMAGE"]) imgContainer.onwheel = function(e)
    {
      if (currentSettings["DISABLE_SINGLE_PREVIEW_BACKGROUND_SCROLLING"]) e.preventDefault();

      if (e.deltaY<0 && (imgContainer.getBoundingClientRect().top < 0))
      {
        imgContainer.scrollIntoView({block: "start", behavior: "smooth"}); //aligning to top screen side on scrollUp if needed
      }
      else if (e.deltaY>0 && (imgContainer.getBoundingClientRect().bottom > document.documentElement.clientHeight))
      {
        imgContainer.scrollIntoView({block: "end", behavior: "smooth"}); //aligning to bottom screen side on scrollDown if needed
      }
    };
    //-----------------------------------------------------------------------------------
    window.onresize = function()
    {
      mangaWidth = document.body.clientWidth - 60;
      mangaContainer.style.maxWidth = mangaWidth+'px';
      resetPreviewSize();
    };
    //-------------------------------fix for Chrome panoraming---------------------------
    if (navigator.userAgent.indexOf("Chrome") != -1){
      hoverImg.onmousedown = function(e){if (e.button == 2) e.preventDefault()};
      $('body').on('mousedown', 'div#mangaContainer > img', (e)=>{if (e.button == 2) e.preventDefault()});
    }
    //===================================================================================
    //***********************************************************************************
    //===================================================================================
  });
}) (); //function

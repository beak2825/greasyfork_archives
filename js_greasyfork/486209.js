// ==UserScript==
// @name        automission infoseek yomiuriNewsPaper
// @namespace   Violentmonkey Scripts
// @match       https://news.infoseek.co.jp/article/*
// @match       https://www.infoseek.co.jp/mission/list/
// @match       https://www.infoseek.co.jp/mission/point
// @match       https://www.infoseek.co.jp/mission/visit/
// @match       https://www.infoseek.co.jp/mission/rewards/*
// @match https://news.infoseek.co.jp/topics/backnumber/entertainment/
// @match https://news.infoseek.co.jp/topics/backnumber/poli-soci/
// @match https://news.infoseek.co.jp/topics/backnumber/sports/
// @match https://news.infoseek.co.jp/topics/backnumber/busi-econ/
// @match https://news.infoseek.co.jp/topics/backnumber/world/
// @match https://news.infoseek.co.jp/topics/backnumber/it/
// @match https://news.infoseek.co.jp/topics/backnumber/life/"
// @match https://news.infoseek.co.jp/video/*/
// @match https://news.infoseek.co.jp/video/*
// @match https://news.infoseek.co.jp/video/?p=*
// @match https://news.infoseek.co.jp/video/?*
// @match https://www.yomiuri.co.jp/web-search/?st=1&wo=%E7%B5%82%E5%80%A4&ac=srch&ar=1
// @match https://www.yomiuri.co.jp/*/*/
// @grant       none
// @version     1.0.14
// @author      ykhr
// @description 2022/6/29 21:06:56
// @downloadURL https://update.greasyfork.org/scripts/486209/automission%20infoseek%20yomiuriNewsPaper.user.js
// @updateURL https://update.greasyfork.org/scripts/486209/automission%20infoseek%20yomiuriNewsPaper.meta.js
// ==/UserScript==

const cntOpenPerDay = 18;
const cntOpenPerDayYomiuri = 6;
const cntOpenVideoPerDay = 5;
const missionListURL ='https://www.infoseek.co.jp/mission/list/';

function autoMissionClose(){
  let DOM;
  let obs = setInterval(()=>{
    // DOM = document.querySelector('.mission-status.js-mission-message');
    const DOM = document.querySelector('#mission-window-count:not([style*="none"])');
    const missionWindowError = document.querySelector('#mission-window-error:not([style*="none"])');

    if(DOM){
      window.close();
      clearInterval(obs);
    }else if(missionWindowError){
      location.reload();
    }

  },1000 / 2);
}

function autosroll(){
  let scwait = 3000 * 1;
  let scPos;
  let scTargetQStr = '.topic-detail__text';
  let scTarget;
                      // let targetLogo = publisherLogo.offset().top;
                      //    let scroll = $(window).scrollTop();
                      //    let windowHeight = $(window).height();
                      //    if (scroll > targetLogo - windowHeight) {

  // scTargetQStr = '.publisher-logo-container__right-column,.relational_link_block .publisher_logo';
  scTargetQStr = '.js-reaction-icon';
  scTarget= document.querySelector(scTargetQStr);
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if(scTarget){
   scPos = scTarget.getBoundingClientRect().bottom + scrollTop - (window.innerHeight) + 90 + 40;
   // scPos = scTarget.getBoundingClientRect().bottom + window.pageYOffset - (window.innerHeight / 2);
    // scPos = scTarget.getBoundingClientRect().bottom + window.pageYOffset - 0;
    if(scPos < 0 ) scPos = 0;
    setTimeout(()=>{window.scrollTo( 0, scPos)},scwait);
    console.log(`scTarget.length : ${scTarget.length}`,
`window.pageYOffset : ${window.pageYOffset}`,
`scrollTop : ${scrollTop}`,
`window.innerHeight : ${window.innerHeight}`,
`scTarget.getBoundingClientRect().top : ${scTarget.getBoundingClientRect().top}`,
`scTarget.getBoundingClientRect().bottom : ${scTarget.getBoundingClientRect().bottom}`);
  }
}

function jumpLastPage(){
  const articleLastPageIsReached = document.getElementById('mission-window-complete-mission-on-last-page-please') === null;

  if(!articleLastPageIsReached){
    const links = document.querySelectorAll('.pager [class*="_page"] a');
    const href = [...links].slice(-1)[0].href;
    location.replace(href);
  }
}
function autoClickReactionIcon(){
  const reactionIcons = document.querySelectorAll('.reaction-icon');
  const reactionNumbers = document.querySelectorAll('.reaction-icon [class*="number"]');
  const reactionNumberArray = reactionNumbers.length > 0 ? [...reactionNumbers].map(e=>Number(e.innerText.replace(/,/,''))) : [];
  const reactionNumberMax = Math.max(...reactionNumberArray);
  const favoritReactionIcons = [...reactionIcons].filter(e=> new RegExp('\^' + reactionNumberMax + '\n').test(e.innerText.replace(/,/,'')));
  const favoritReactionIcon = favoritReactionIcons.length > 0 ? favoritReactionIcons[0] : undefined;

  console.log(reactionNumberArray);
  console.log(reactionNumberArray.indexOf(Math.max(...reactionNumberArray)));
  console.log(favoritReactionIcons);
  console.log(favoritReactionIcon);
  favoritReactionIcon.click();
}

function chkIfNotFound(){
  const strNotfound = '指定されたページが見つかりません。｜Infoseekニュース';
  if(document.title == strNotfound){
    window.close();
  }else{
    // console.log("found");
  }

}
function main(){
  // const monthDayCnt = new Date(...new Date().toLocaleDateString().replace(/\/\d+$/,'/0').split('/').map(d=>Number(d))).getDate();
  // const missiongoalCnt = Math.floor(700 / monthDayCnt) + 1;
  // console.log(`missiongoalCnt: ${missiongoalCnt}`);

  const qStr= '.section-box__contents ul.backnumber-list li a';
  let DOM = document.querySelectorAll(qStr);

  if(DOM && DOM.length > 0){
    DOM.forEach(e=>{
      let href = e.href
      if(/topics/.test(href)){
        e.href = href.replace('/topics/','/article/');
      }
      e.target = '_blank';
    });
    if(DOM.length > 9){
      const LimitOpenCnt = Math.min(cntOpenPerDay,DOM.length);
      let cnt = 0;
      document.title = cnt + 1;
      let newWindowStatus = false;
      document.addEventListener("visibilitychange", () => {
        console.log(document.visibilityState);
        if (document.visibilityState === "visible") {
          if(newWindowStatus){
            newWindowStatus = false;
            cnt++;
            if(cnt < LimitOpenCnt){
              document.title = cnt + 1;
              DOM[cnt].click();
            }else if(cnt === LimitOpenCnt){
              window.open(missionListURL,"");
            }
          }
        } else if (document.visibilityState === "hidden"){
          if(!newWindowStatus){
            newWindowStatus = true;
          }
        }
      });
      console.log(DOM)
      DOM[cnt].click();
    }
  }
//   if(DOM && DOM.length > 30){
//     const linkList = [...DOM].map(e=>{return e.href.replace('/topics/','/article/')});
//     console.log(linkList.join('\n'))
//     let cnt = 0;
//     let windowObj;
//     let obs;
//     document.title = cnt + 1;
//     if(/Win/.test(navigator.userAgent)){
//     windowObj = window.open(linkList[cnt],"article");
//       obs = setInterval(()=>{
//         if(windowObj.closed){
//           cnt++;
//           if(cnt < LimitOpenCnt){
//             document.title = cnt + 1;
//             windowObj = window.open(linkList[cnt],"article");
//           }else{
//             clearInterval(obs);
//             windowObj = null;
//             window.open(missionListURL,"");
//           }
//         }
//       },1000 * 1 /30);
//     }else if(/Android/.test(navigator.userAgent)){
//       let newWindowStatus = false;
//       document.addEventListener("visibilitychange", () => {
//         console.log(document.visibilityState);
//         if (document.visibilityState === "visible") {
//           if(newWindowStatus){
//             newWindowStatus = false;
//             cnt++;
//             if(cnt < LimitOpenCnt){
//               document.title = cnt + 1;
//               window.open(linkList[cnt],"article");
//             }else if(cnt === LimitOpenCnt){
//               window.open(missionListURL,"");
//             }
//           }
//         } else if (document.visibilityState === "hidden"){
//           if(!newWindowStatus){
//             newWindowStatus = true;
//           }
//         }
//       });

//       window.open(linkList[cnt],"article");

//     }
//   }
}
function readYomipo(){
  // const main = ()=>{
  //   let obsCnt = 0;
  //   let scrollY = 0;
  //   let obs = setInterval(()=>{
  //     window.scrollTo( 0, obsCnt * (Math.floor(Math.random() * 20) + 200));
  //     console.log(scrollY);
  //     console.log(window.scrollY + "\n");
  //     if(scrollY != 0 && scrollY === window.scrollY){
  //       clearInterval(obs);
  //       setTimeout(()=>{window.close()},1000);
  //     }else{
  //       scrollY = window.scrollY;
  //       obsCnt++;
  //     }
  //   },1000);
  // }
  const checkTime = 5000;
  const kijiCount = Number(jQuery('#kiji_count').val());
  const checkfooter = document.querySelector('.yomipo-footer');
  const chkurlList = ()=>{

    const urlList = JSON.parse(localStorage.getItem('urlList'));
    const matchURL = (e)=>{
      return document.URL.includes(e);
    }
    // console.log(requestSuccess && urlList.length == cntOpenPerDayYomiuri,urlList.length < cntOpenPerDayYomiuri && urlList.some(matchURL))
    return isEarnedYomipoReadingMarathonPoint() && urlList.length == kijiCount || (urlList.length < kijiCount && urlList.some(matchURL));
  }
  const mkCheckFooter = ()=>{
    const targetElement = document.querySelector('.p-article-action-btn-2020__scrap');

    const newDiv = document.createElement('div');
    newDiv.classList.add('yomipo-footer');
    newDiv.style.position = 'fixed';
    newDiv.style.top = '-1px';
    newDiv.innerHTML = '';

    targetElement.parentNode.insertBefore(newDiv, targetElement.nextSibling);
  }
  const main = ()=>{
    console.log('readYomipo');
    let obs;
    setTimeout(()=>{
      obs = setInterval(()=>{
        window.dispatchEvent(new CustomEvent('scroll'));
        if(chkurlList()){
          clearInterval(obs);
          /////遅延させてみる20241012
          setTimeout(()=>{
            window.close();
          },1000);
        }
      },50);

    },checkTime + 100);
  }

  if(checkfooter){
    checkfooter.style.position = 'fixed';
    checkfooter.style.top = '-1px';
  }else{
    console.log('footer not found. mk footer.');
    mkCheckFooter();
  }

  window.addEventListener('load', main);
  // window.document.addEventListener('DOMContentLoaded', main);

}
function mainYomipo(){
  const qStr= '.search-article-list .p-list-item:not([class*="member-only"]) article h3 a';
  let DOM = document.querySelectorAll(qStr);
  if(DOM && DOM.length > 0){
    const linkList = [...DOM].map(e=>{return e.href});
    console.log(linkList.join('\n'));
    let cnt = 0;
    let windowObj;
    let obs;
    const LimitOpenCnt = linkList.length;
    document.title = cnt + 1;
    windowObj = window.open(linkList[cnt],"article");
    obs = setInterval(()=>{
      if(windowObj.closed){
        cnt++;
        if(cnt < LimitOpenCnt && !isEarnedYomipoReadingMarathonPoint()){
          document.title = cnt + 1;
          windowObj = window.open(linkList[cnt],"article");
        }else{
          clearInterval(obs);
          // windowObj = window.open('https://yomipo.yomiuri.co.jp/',"article");
          windowObj = null;
          location.replace('https://yomipo.yomiuri.co.jp/');
          // window.close();
        }
      }
    },1000 * 1 /30);
  }
}

function checkDeadline() {
  const deadlineDOM = document.querySelectorAll('.note-deadline');

  function parseJapaneseDate(dateStr) {
    const matches = dateStr.match(/(\d+)年(\d+)月(\d+)日/);
    if (!matches) return null;
    const [ , y, m, d ] = matches.map(Number);
    return new Date(y, m - 1, d);
  }

  function isToday(date) {
    if (!date) return false;
    const now = new Date();
    return date.toDateString() === now.toDateString();
  }

  if ([...deadlineDOM].some(e => isToday(parseJapaneseDate(e.textContent)))) {
    window.alert('本日までのミッションが残っていますよ。');
  }
}

function autoGetPoint(){
  //動画ミッション追加
  // const qStr = '.list-challenge #mission-task-name_1008 + div div > a, li.list-acquired a , .list-challenge #mission-task-name_1002 + div div > a';//data-ratid="MissionList_GetPoint_1003"
  //来訪ミッションポイントゲット追加
  const qStr = '.list-challenge #mission-task-name_1008 + div div > a, li.list-acquired a , .list-challenge #mission-task-name_1002 + div div > a, .point_get .get-button';//data-ratid="MissionList_GetPoint_1003"

  let DOM = document.querySelector(qStr);
  if(DOM){
    if(/mission\/visit/.test(DOM.href)){
      DOM.target = '_blank';
    }
    DOM.click();
  }
  checkDeadline();
}
function goMissionList(){
  const qStr = '.point a';
  const obsTarget = document.querySelector('.point');
  let mObs = new MutationObserver( ()=>{
    let DOM = document.querySelector(qStr);
    if(DOM){
      mObs.disconnect();
      DOM.click();
    }
  });
  mObs.observe( obsTarget, { attributes: true, childList: true, subtree: true});
}
function autoMissionVideo(){
  const closeWithComplete=()=>{
    $(document).ajaxSuccess(function(event, xhr, settings) {
      if(/\/mission\/progress\/ajax/.test(settings.url)){
        // console.log(xhr.responseText);
        // const missionResult = JSON.parse(xhr.responseText);
        // console.log(missionResult);
        window.close();
      }
    });
  }
  const clickPlayBtn =()=>{
    const playBtnQstr = '#myPlayerID .vjs-big-play-button';
    const videoQstr = '#myPlayerID video';
    const obsTarget = document.querySelector('section.main');
    let mObs = new MutationObserver( ()=>{
      const video = document.querySelector(videoQstr);
      if(video){
        mObs.disconnect();
        video.muted = true;
        video.addEventListener('playing',(event)=>{
          video.pause();
          closeWithComplete();
          console.log(event);
        },{once : true});
        console.log('click');
        // video.click();
        video.dispatchEvent(new Event("playing"));
      }
    });
    mObs.observe( obsTarget, { attributes: true, childList: true, subtree: true});
  }
  clickPlayBtn();
  // window.addEventListener('load', clickPlayBtn);
}
function openVideoArticle(){
  const videoList = document.querySelectorAll('.video-list__video');
  const sortedVideoList = [...videoList].map(e=>[e.querySelector('.time').innerText,e.querySelector('a').href]).sort();
  // console.log(sortedVideoList);
  console.log(sortedVideoList.map(e=>e.join()).join('\n'));
  if(videoList.length > 0){
    const LimitOpenCnt = cntOpenVideoPerDay;
    console.log();
    let cnt = 0;
    let linkList = sortedVideoList.map(e=>e[1]);
    let windowObj;
    windowObj = window.open(linkList[cnt],"article");
    let obs = setInterval(()=>{
      if(windowObj.closed){
        cnt++;
        if(cnt < LimitOpenCnt){
          document.title = cnt + 1;
          windowObj = window.open(linkList[cnt],"article");
        }else{
          clearInterval(obs);
          windowObj = null;
          setTimeout(()=>{
            window.open(missionListURL,"");
          },1000);
        }
      }
    },1000 * 1 /30);
  }
}
function callAutoPagerize(func){
  function test(){
    var a = document.documentElement;
    var y = a.scrollHeight - a.clientHeight;
    window.scroll(0, y);
  }
  let cnt = 0;
  let bootID;
  const timeArray = [];

  document.addEventListener('GM_AutoPagerizeNextPageLoaded', e => {
    timeArray.push(performance.now());
    if(timeArray.length > 1){
      console.log(timeArray.slice(-1)[0] - timeArray[0]);
      // console.log(timeArray.slice(-1)[0] - timeArray[0], e.target);

    }
    cnt++;
    clearTimeout(bootID);
    bootID = setTimeout(func,3000);
  });
  // document.addEventListener('AutoPagerize_DOMNodeInserted', e => {
  //   console.log(e.target);
  // })

  test();
}
function focusDrawBtn(){
  const qStr = '#rewardAdButton[style*="block"]';
  // const obsTarget = document.querySelector('.main > .reward_main');
  const obsTarget = document.querySelector('.reward_main');
  console.log(obsTarget)
  let mObs = new MutationObserver( ()=>{
    let DOM = document.querySelector(qStr);
    if(DOM){
      mObs.disconnect();
      setTimeout(()=>{
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let scPos = DOM.getBoundingClientRect().bottom + scrollTop - (window.innerHeight) + 100;
        if(scPos < 0 ) scPos = 0;
        window.scrollTo( 0, scPos);
        DOM.focus();
      },1000);
    }
  });
  mObs.observe(obsTarget, { attributes: true, childList: true, subtree: true });
}

function isEarnedYomipoReadingMarathonPoint(){
// function chkYomipoRequestSucess(){
  const todayAccessCheck = ()=>{
    const accessDate = localStorage.getItem('accessDate');
    const nowDate = (new Date()).toDateString();

    // 日付未定義、または日付を跨いだ場合はローカルストレージをリセット
    if (!accessDate || accessDate != nowDate) {
      // localStorage.setItem('accessDate', nowDate);
      // localStorage.removeItem('urlList');
      // localStorage.removeItem('requestTry');
      // localStorage.removeItem('requestSuccess');
      return false;
    }
    return true;
  }
  const requestSuccess = localStorage.getItem('requestSuccess');
  const requestTry = localStorage.getItem('requestTry');
  return todayAccessCheck() && requestTry;
  // return todayAccessCheck() && requestSuccess;
}

function ini(){
  const DOCURL = document.URL;

  switch(true){
    case /\/\/news\.infoseek\.co\.jp\/topics\/backnumber\//.test(DOCURL):
      main();
      break;
    // case /\/\/news\.infoseek\.co\.jp\/video\/(?:\?p=\d+)?$/.test(DOCURL):
    case /\/\/news\.infoseek\.co\.jp\/video\/(?:\?.+)?$/.test(DOCURL):
      callAutoPagerize(openVideoArticle);
      break;
    case /\/\/news\.infoseek\.co\.jp\/(?:article|video)\/.*/.test(DOCURL):
      // console.log("jido tenkai");
      chkIfNotFound();
      $(document).ajaxSuccess(function(event, xhr, settings) {
        if(/\/mission\/progress\/list\/ajax\//.test(settings.url)){
          console.log(xhr.responseText);
          const missionListResult = JSON.parse(xhr.responseText);
          console.log(missionListResult);
          if(missionListResult.progressPossibleMissionExists){//ミッション進行する可能性がある場合
            if(/\/video\//.test(document.URL)){
              autoMissionVideo();
            }else  if(/\/article\//.test(document.URL)){
              // pA=[performance.now()];setInterval(()=>{pA.push(performance.now());console.log(pA.slice(-1)[0]-pA.slice(-2)[0],document.getElementById('mission-stay_bar-item-id').style.width)},100);
              setTimeout(jumpLastPage,2000);
              autosroll();
              setTimeout(autoClickReactionIcon,7000);
              autoMissionClose();
            }
          }else{
            window.close();
          }
        }
      });
      break;
    case /\/\/www\.infoseek\.co\.jp\/mission\/list\//.test(DOCURL):
      autoGetPoint();
      break;
    case /\/\/www\.infoseek\.co\.jp\/mission\/visit\//.test(DOCURL):
      autoGetPoint();
      break;
    case /\/\/www\.infoseek\.co\.jp\/mission\/point/.test(DOCURL):
      goMissionList();
      break;
    case /\/\/www\.infoseek\.co\.jp\/mission\/rewards/.test(DOCURL):
      if(window.top === window.self){
        focusDrawBtn();
      }
      break;
    case /www\.yomiuri\.co\.jp\/web-search\/\?st=1&wo=%E7%B5%82%E5%80%A4&ac=srch&ar=1/.test(DOCURL):
      if(window.top === window.self && !isEarnedYomipoReadingMarathonPoint()){
        mainYomipo();
      }
      break;
    case /www\.yomiuri\.co\.jp\/[^/]*\/[^/]*\//.test(DOCURL):
      if(window.top === window.self){
        if(/ページが見つかりませんでした/.test(document.title)){
          window.close();
        }else if(!isEarnedYomipoReadingMarathonPoint()){
          console.log('boot readYomipo');
          readYomipo();
        }
      }

      break;

  }
}

if(window.top === window.self){
  ini();
}
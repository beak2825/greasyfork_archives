// ==UserScript==
// @name         노벨피아 애드온
// @version      1.2.5
// @namespace    https://greasyfork.org/users/815641
// @description  있으면 좋은 각종 기능 추가
// @match        https://novelpia.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM_download
// @grant        unsafeWindow
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.1/dist/js.cookie.min.js
// @require      https://unpkg.com/headroom.js@0.12.0/dist/headroom.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js
// @downloadURL https://update.greasyfork.org/scripts/432455/%EB%85%B8%EB%B2%A8%ED%94%BC%EC%95%84%20%EC%95%A0%EB%93%9C%EC%98%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/432455/%EB%85%B8%EB%B2%A8%ED%94%BC%EC%95%84%20%EC%95%A0%EB%93%9C%EC%98%A8.meta.js
// ==/UserScript==

'use strict';

const url = window.location.href;
const viewer = /(https?:\/\/)(novelpia.com)(\/)(viewer)(\/)[0-9]*/;
const novel = /(https?:\/\/)(novelpia.com)(\/)(novel)(\/)[0-9]*/;
const useredit = 'https://novelpia.com/page/useredit';

if (viewer.test(url) === false) {
  if (localStorage.IMP_UI === 'ON') {
    GM_addStyle(`
      /* fallback */
      @font-face {
        font-family: 'Material Icons';
        font-style: normal;
        font-weight: 400;
        src: url(https://fonts.gstatic.com/s/materialicons/v126/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format('woff2');
      }
      .material-icons {
        font-family: 'Material Icons';
        font-weight: normal;
        font-style: normal;
        font-size: 24px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        -webkit-font-smoothing: antialiased;
      }

      @media (min-width: 1210px){
        .mobile-nav{
          display: none;
        }
      }

      @media screen and (max-width: 1209px) {
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          will-change: transform;
          transform: translateZ(0);
          display: flex;
          height: 55px;
          box-shadow: 0px 0px 5px #33333333;
          background-color: #fff;
        }
        .mobile-nav__item {
          cursor: pointer;
          flex-grow: 1;
          text-align: center;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex-basis: 25%;
        }
        .mobile-nav__item--active {
          color: #7632ff;
        }
        .mobile-nav__item-content {
          display: flex;
          flex-direction: column;
        }
      }

      @media screen and (max-width: 1209px) {
        div.top-menu-margin{
            margin: 50px auto 0px auto !important;
        }
        div.am-header{
            height: 50px !important;
            box-shadow: 0px 0px 5px #33333333
        }
      }

      .header--fixed {
        top: 0 !important;
        width: 100% !important;
      }
      .header--fixed.top {
        transition: none !important;
        transform: translateY(0) !important;
      }
      .header--fixed.not-top {
        transform: translateY(-100%) !important;
      }
      .header--fixed.slideDown.not-top {
        transition: transform 0.3s ease-in-out !important;
        transform: translateY(0) !important;
      }
      .header--fixed.slideDown.top {
        transition: transform 0.3s ease-in-out !important;
      }
      .header--fixed.slideUp.not-top {
        transition: transform 0.3s ease-in-out !important;
        transform: translateY(-100%) !important;
      }
      .header--fixed.slideUp.top {
        transform: translateY(-100%) !important;
      }

      .nav--fixed {
        width: 100% !important;
        bottom: 0 !important;
      }
      .nav--fixed.navbottom {
        transition: none !important;
        transform: translateY(0) !important;
      }
      .nav--fixed.not-bottom {
        transform: translateY(0) !important;
      }
      .nav--fixed.navUp.not-bottom {
        transition: transform 0.3s ease-in-out !important;
        transform: translateY(0) !important;
      }
      .nav--fixed.navUp.navbottom {
        transition: transform 0.3s ease-in-out !important;
      }
      .nav--fixed.navDown.not-bottom {
        transition: transform 0.3s ease-in-out !important;
        transform: translateY(100%) !important;
      }
      .nav--fixed.navDown.navbottom {
        transition: transform 0.3s ease-in-out !important;
      }

      .menu_alarm_m {
        position: static !important;
      }
      
      body > div > div.am-header.mobile_show > div.d_inv,
      body > div > div.d_inv{
        display: none !important;
      }
      
      body > div > div.am-header > div:nth-child(1),
      body > div.am-header.mobile_show > div:nth-child(1){
        top: 10px !important;
      }

      div.dropdown.dropdown-profile{
        top: 5px !important;
      }

      div[style^="margin-top:15px;"],
      div[onclick^="location='/event/writer_sum';"],
      .swiper-container,
      .comic_bnr,
      .story_bnr,
      .plus_bg,
      .main-slide-wrapper,
      .am-pagetitle{
        display: none !important;
      }
      .s_dark{
        margin-top: 0px !important;
      }
      
      .contest_menu{
        position: initial !important;
      }
    `);

    const newNav = document.createElement('nav');
    newNav.setAttribute('class', 'mobile-nav');
    newNav.innerHTML = `
    <div class="mobile-nav__item" onclick="$('.loads').show();location='/';">
    <div class="mobile-nav__item-content">
      <i class="material-icons">home</i>
      홈
    </div>		
    </div>
    
    <div class="mobile-nav__item" onclick="$('.loads').show();location='/freestory';">		
    <div class="mobile-nav__item-content">
      <i class="material-icons">import_contacts</i>
      자유연재
    </div>
    </div>

    <div class="mobile-nav__item" onclick="$('.loads').show();location='/plus';">		
    <div class="mobile-nav__item-content">
      <i class="material-icons">menu_book</i>
      플러스
    </div>
    </div>
    
    <div class="mobile-nav__item" onclick="$('.loads').show();location='/top100/all/today/view/all/plus/';">
    <div class="mobile-nav__item-content">
      <i class="material-icons">leaderboard</i>
      랭킹
    </div>		
    </div>
    
    <div class="mobile-nav__item" onclick="$('.loads').show();location='/mybook';">
    <div class="mobile-nav__item-content">
      <i class="material-icons">bookmarks</i>
      서재
    </div>		
    </div>
    `;

    let navFlag = true;
    let headerFlag = true;
    const uiImp = new MutationObserver(() => {
      const body = document.querySelector('body');
      const nav = document.querySelector('.mobile-nav');

      if (!nav && navFlag && body) {
        const home = 'https://novelpia.com/';
        const freestory = 'https://novelpia.com/freestory';
        const plus = 'https://novelpia.com/plus';
        const top100 = 'https://novelpia.com/top100';
        const mybook = 'https://novelpia.com/mybook';

        navFlag = false;
        body.appendChild(newNav);

        if (url === home) {
          newNav.childNodes[1].classList.add('mobile-nav__item--active');
        } else if (!url.indexOf(freestory)) {
          newNav.childNodes[3].classList.add('mobile-nav__item--active');
        } else if (!url.indexOf(plus)) {
          newNav.childNodes[5].classList.add('mobile-nav__item--active');
        } else if (!url.indexOf(top100)) {
          newNav.childNodes[7].classList.add('mobile-nav__item--active');
        } else if (!url.indexOf(mybook)) {
          newNav.childNodes[9].classList.add('mobile-nav__item--active');
        }

        const nav2 = document.querySelector('.mobile-nav');
        const headroom = new Headroom(nav2, {
          offset: 30,
          tolerance: 5,
          classes: {
            initial: 'nav--fixed',
            pinned: 'navUp',
            unpinned: 'navDown',
            bottom: 'navbottom',
            notBottom: 'not-bottom',
          },
        });
        headroom.init();
      }

      const header = document.querySelectorAll('.am-header');
      if (header.length === 2 && headerFlag) {
        headerFlag = false;
        header.forEach(el => {
          const headroom = new Headroom(el, {
            offset: 30,
            tolerance: 5,
            classes: {
              initial: 'header--fixed',
              pinned: 'slideDown',
              unpinned: 'slideUp',
              top: 'top',
              notTop: 'not-top',
            },
          });
          headroom.init();
        });
      }
    });

    uiImp.observe(document, {childList: true, subtree: true});
  }
}

if (novel.test(url) === true) {
  if (localStorage.SHARE_HIDE === 'ON') {
    GM_addStyle(`
    .sns-go{
      display: none !important;
    }
  `);
  }
}

if (viewer.test(url) === true) {
  GM_addStyle(`
    @font-face {font-family: 'RIDIBatang';src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_twelve@1.0/RIDIBatang.woff');font-weight: normal;font-style: normal;}
    @font-face {font-family: 'Chosunilbo_myungjo';src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_one@1.0/Chosunilbo_myungjo.woff') format('woff');font-weight: normal;font-style: normal;}
    @font-face {font-family: 'MaruBuri';src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-10-21@1.0/MaruBuri-Regular.woff') format('woff');font-weight: normal;font-style: normal;}
    @font-face {font-family: 'ChosunGu';src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/ChosunGu.woff') format('woff');font-weight: normal;font-style: normal;}
    @font-face {font-family: 'WONDotum';src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_two@1.0/WONDotum.woff') format('woff');font-weight: normal;font-style: normal;}
  `);

  if (localStorage.IMP_NAV === 'ON') {
    GM_addStyle(`
      .rangeslider__handle:after{
        display: none !important;
      }
      .rangeslider__handle{
        top: -7px !important;
        width: 20px !important;
        height: 20px !important;
      }
      .rangeslider{
        height: 5px !important;
      }
      #footer_bar > table{
        height: 50px !important;
      }
      .rangeslider--horizontal::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 600%;
      }
    `);
  }
  if (localStorage.BG_THEME === 'ON') {
    document.documentElement.style.backgroundColor = localStorage.viewer_bg;
  }
}

function invertHex(hex) {
  return (Number(`0x1${hex}`) ^ 0xffffff).toString(16).substr(1).toUpperCase();
}

function themeChange() {
  try {
    let color = localStorage.viewer_bg;
    if (Cookies.get('DARKMODE') === '1') {
      switch (color) {
        case '1':
          color = '#000';
          break;
        case '2':
          color = '#4e4e4e';
          break;
        case '3':
          color = '#565314';
          break;
        case '4':
          color = '#225816';
          break;
        default:
          break;
      }
    } else {
      switch (color) {
        case '1':
          color = '#fff';
          break;
        case '2':
          color = '#e3e3e3';
          break;
        case '3':
          color = '#fffddb';
          break;
        case '4':
          color = '#c4ecbb';
          break;
        default:
          break;
      }
    }

    const footer = document.getElementById('footer_bar');
    const header = document.getElementById('header_bar');
    const comment = document.getElementById('comment_box');
    const theme = document.getElementById('theme_box');
    const load = document.querySelector('.loads');
    const noDrag = document.getElementById('viewer_no_drag');

    if (Cookies.get('DARKMODE') === '1') {
      comment.style.backgroundColor = `#${invertHex(color.replace('#', ''))}`;
    } else {
      comment.style.backgroundColor = color;
    }

    footer.style.backgroundColor = color;
    header.style.backgroundColor = color;
    theme.style.backgroundColor = color;
    load.style.backgroundColor = color;
    noDrag.style.backgroundColor = color;
    load.style.filter = 'opacity(0.9)';
  } catch (err) {
    console.error(`테마 변경: ${err}`);
  }
}

function addFont() {
  try {
    const fontPosition = document.querySelector(
      "td[style='text-align:center;font-size:14px;width:70%;display: -webkit-box;padding: 5px;']",
    );
    if (Cookies.get('DARKMODE') === '1') {
      fontPosition.insertAdjacentHTML(
        'afterend',
        `
        <td style="text-align:center;font-size:14px;width:70%;display: -webkit-box;padding: 5px;">
        <div style="font-size:12px;width:35px;height:35px;line-height:16px;border:1px solid #333;user-select: none;border-radius:5px;text-align:center;padding:0px;cursor:pointer;margin-right:5px;font-family:'RIDIBatang';" id="font_5_btn" onclick="font_5_btn();" class="font_btn">리디바탕</div>
        <div style="font-size:13px;width:35px;height:35px;line-height:16px;border:1px solid #333;user-select: none;border-radius:5px;text-align:center;padding:0px;cursor:pointer;margin-right:5px;font-family:'Chosunilbo_myungjo';" id="font_6_btn" onclick="font_6_btn();" class="font_btn">조선명조</div>
        <div style="font-size:12px;width:35px;height:35px;line-height:16px;border:1px solid #333;user-select: none;border-radius:5px;text-align:center;padding:0px;cursor:pointer;margin-right:5px;font-family:'MaruBuri';" id="font_7_btn" onclick="font_7_btn();" class="font_btn">마루부리</div>
        <div style="font-size:13px;width:35px;height:35px;line-height:16px;border:1px solid #333;user-select: none;border-radius:5px;text-align:center;padding:0px;cursor:pointer;margin-right:5px;font-family:'ChosunGu';" id="font_8_btn" onclick="font_8_btn();" class="font_btn">조선굴림</div>
        <div style="font-size:12px;width:35px;height:35px;line-height:16px;border:1px solid #333;user-select: none;border-radius:5px;text-align:center;padding:0px;cursor:pointer;margin-right:5px;font-family:'WONDotum';" id="font_9_btn" onclick="font_9_btn();" class="font_btn">한둥근돋움</div>
        </td>
      `,
      );
    } else {
      fontPosition.insertAdjacentHTML(
        'afterend',
        `
        <td style="text-align:center;font-size:14px;width:70%;display: -webkit-box;padding: 5px;">
        <div style="font-size:12px;width:35px;height:35px;line-height:16px;border:1px solid #ddd;user-select: none;border-radius:5px;text-align:center;padding:0px;cursor:pointer;margin-right:5px;font-family:'RIDIBatang';" id="font_5_btn" onclick="font_5_btn();" class="font_btn">리디바탕</div>
        <div style="font-size:13px;width:35px;height:35px;line-height:16px;border:1px solid #ddd;user-select: none;border-radius:5px;text-align:center;padding:0px;cursor:pointer;margin-right:5px;font-family:'Chosunilbo_myungjo';" id="font_6_btn" onclick="font_6_btn();" class="font_btn">조선명조</div>
        <div style="font-size:12px;width:35px;height:35px;line-height:16px;border:1px solid #ddd;user-select: none;border-radius:5px;text-align:center;padding:0px;cursor:pointer;margin-right:5px;font-family:'MaruBuri';" id="font_7_btn" onclick="font_7_btn();" class="font_btn">마루부리</div>
        <div style="font-size:13px;width:35px;height:35px;line-height:16px;border:1px solid #ddd;user-select: none;border-radius:5px;text-align:center;padding:0px;cursor:pointer;margin-right:5px;font-family:'ChosunGu';" id="font_8_btn" onclick="font_8_btn();" class="font_btn">조선굴림</div>
        <div style="font-size:12px;width:35px;height:35px;line-height:16px;border:1px solid #ddd;user-select: none;border-radius:5px;text-align:center;padding:0px;cursor:pointer;margin-right:5px;font-family:'WONDotum';" id="font_9_btn" onclick="font_9_btn();" class="font_btn">한둥근돋움</div>
        </td>
      `,
      );
    }
  } catch (err) {
    console.error(`폰트 추가: ${err}`);
  }
}

function fontBtnPick(crntFont) {
  switch (crntFont) {
    case '0':
      document.getElementById('font_0_btn').style.border = '1px solid #999';
      break;
    case '1':
      document.getElementById('font_1_btn').style.border = '1px solid #999';
      break;
    case '2':
      document.getElementById('font_2_btn').style.border = '1px solid #999';
      break;
    case '3':
      document.getElementById('font_3_btn').style.border = '1px solid #999';
      break;
    case '4':
      document.getElementById('font_4_btn').style.border = '1px solid #999';
      break;
    case '5':
      document.getElementById('font_5_btn').style.border = '1px solid #999';
      break;
    case '6':
      document.getElementById('font_6_btn').style.border = '1px solid #999';
      break;
    case '7':
      document.getElementById('font_7_btn').style.border = '1px solid #999';
      break;
    case '8':
      document.getElementById('font_8_btn').style.border = '1px solid #999';
      break;
    case '9':
      document.getElementById('font_9_btn').style.border = '1px solid #999';
      break;
    default:
      break;
  }
}

function fontChange() {
  const crntFont = localStorage.viewer_font;
  const novelBox = document.getElementById('novel_box');
  switch (crntFont) {
    case '5':
      novelBox.style.fontFamily = 'RIDIBatang,Noto Sans KR,Noto Sans JP';
      break;
    case '6':
      novelBox.style.fontFamily = 'Chosunilbo_myungjo,Noto Sans KR,Noto Sans JP';
      break;
    case '7':
      novelBox.style.fontFamily = 'MaruBuri,Noto Sans KR,Noto Sans JP';
      break;
    case '8':
      novelBox.style.fontFamily = 'ChosunGu,Noto Sans KR,Noto Sans JP';
      break;
    case '9':
      novelBox.style.fontFamily = 'WONDotum,Noto Sans KR,Noto Sans JP';
      break;
    default:
      break;
  }
}

function fontBtnChange() {
  try {
    const crntFont = localStorage.viewer_font;
    const fontBtn = document.getElementsByClassName('font_btn');
    if (Cookies.get('DARKMODE') === '1') {
      fontBtn.forEach(el => (el.style.border = '1px solid #333'));
      fontBtnPick(crntFont);
    } else {
      fontBtn.forEach(el => (el.style.border = '1px solid #ddd'));
      fontBtnPick(crntFont);
    }
  } catch (err) {
    console.error(`폰트 버튼: ${err}`);
  }
}

function impNav() {
  try {
    const nav = document.getElementById('navigation_group');
    const footer = document.getElementById('footer_bar');
    const commentBox = document.getElementById('comment_box');
    if (Cookies.get('NAVIGATION') === '1') {
      nav.style.position = 'relative';
      nav.style.top = '10px';
      nav.setAttribute('style', '');
      footer.insertBefore(nav, footer.firstChild);
      footer.style.height = '';
      commentBox.style.bottom = '50px';
      commentBox.style.height = 'calc(100% - 110px)';
    }
  } catch (err) {
    console.error(`네비바 수정: ${err}`);
  }
}

unsafeWindow.font_5_btn = () => {
  localStorage.viewer_font = '5';
  fontChange();
  fontBtnChange();
};
unsafeWindow.font_6_btn = () => {
  localStorage.viewer_font = '6';
  fontChange();
  fontBtnChange();
};
unsafeWindow.font_7_btn = () => {
  localStorage.viewer_font = '7';
  fontChange();
  fontBtnChange();
};
unsafeWindow.font_8_btn = () => {
  localStorage.viewer_font = '8';
  fontChange();
  fontBtnChange();
};
unsafeWindow.font_9_btn = () => {
  localStorage.viewer_font = '9';
  fontChange();
  fontBtnChange();
};

function userTag() {
  try {
    const usertag = document.querySelector('#user_tag_add > div > div > div.modal-body.pd-25 > div');
    if (usertag != null) {
      usertag.cloneNode(true);
      const usertagAdd = document.querySelector(
        "span[style='color:#2091ab;border: 2px solid #2091ab; border-radius: 20px; padding: 3px 10px; line-height: 20px; user-select: none;cursor:pointer;']",
      );
      usertagAdd.before(usertag);

      const mobileUsertagAdd = document.querySelector("span[style='color:#2091ab;user-select: none;cursor:pointer;']");
      const usertagSpan = document.createElement('span');
      usertagSpan.innerHTML = usertag.textContent;
      usertagSpan.style.color = '#5032df';
      mobileUsertagAdd.before(usertagSpan);

      const wrapper = document.querySelector("div[style='margin:10px 0px;']");
      wrapper.outerHTML = wrapper.innerHTML;
    }
  } catch (err) {
    console.error(`유저태그 표시: ${err}`);
  }
}

function hideComment() {
  const commentId = [];
  document.arrive('.comment_text', {onlyOnce: true, existing: true}, function () {
    try {
      if (this.innerText === '') {
        commentId.push(`re_${this.parentNode.parentNode.parentNode.dataset.idx}`);
        this.parentNode.parentNode.parentNode.style.display = 'none';
      } else {
        commentId.forEach(el => {
          if (this.parentNode.parentNode.parentNode.classList[2] === el) {
            this.parentNode.parentNode.parentNode.style.display = 'none';
          }
        });
      }
    } catch (err) {
      console.error(`이모티콘 댓글 제거: ${err}`);
    }
  });
}

function autoBookmark() {
  try {
    const contentNo = document.getElementById('content_no').value;
    window.addEventListener('beforeunload', () => {
      if (this_page < max_page - 2 && this_page > 1) {
        localStorage[`bookmark_${contentNo}`] = this_page;
        console.log('페이지 북마크');
      } else {
        localStorage.removeItem(`bookmark_${contentNo}`);
      }
    });
  } catch (err) {
    console.error(`자동 북마크: ${err}`);
  }
}

function autoVote() {
  try {
    const voteBtn = document.getElementById('btn_episode_vote');
    if (voteBtn.src !== 'https://novelpia.com/img/new/viewer/btn_vote_on2.png') {
      voteBtn.click();
    }
  } catch (err) {
    console.error(`자동 추천: ${err}`);
  }
}

function removeEffect() {
  try {
    const voteEffect0 = document.getElementsByClassName('like_btn');
    voteEffect0[0].style.display = 'none';
  } catch (err) {
    console.error(`추천 효과 숨김: ${err}`);
  }
}

function impUi() {
  try {
    const navItems = document.querySelectorAll('.mobile-nav__item');

    navItems.forEach(function (el) {
      el.addEventListener('click', function () {
        navItems.forEach(function (el2) {
          el2.classList.remove('mobile-nav__item--active');
        });
        this.classList.add('mobile-nav__item--active');
      });
    });
  } catch (err) {
    console.error(`UI 수정 오류: ${err}`);
  }
}

function imgDown() {
  try {
    const img = document.getElementsByClassName('venobox');
    const novelName = document.getElementsByClassName('cut_line_one')[0].innerText;
    img.forEach(el => {
      el.addEventListener('dblclick', () => {
        const imgSrc = el.src;
        let imgName = el.dataset.filename;
        if (imgName === '') {
          imgName = `${novelName}.jpg`;
        }
        GM_download(imgSrc, imgName);
      });
    });
  } catch (err) {
    console.error(`일러 다운: ${err}`);
  }
}

let firstHide = true;
let navFlag = true;
const viewerObserve = new MutationObserver(() => {
  if (viewer.test(url) === true) {
    if (localStorage.BG_THEME === 'ON') {
      if (
        document.getElementById('footer_bar') &&
        document.getElementById('header_bar') &&
        document.getElementById('comment_box') &&
        document.getElementById('theme_box') &&
        document.querySelector('.loads')
      ) {
        themeChange();
      }
    }

    if (localStorage.IMP_NAV === 'ON') {
      if (Cookies.get('NAVIGATION') === '1') {
        const nav = document.getElementById('navigation_group');
        const footer = document.getElementById('footer_bar');
        const commentBox = document.getElementById('comment_box');
        if (nav && footer && commentBox && navFlag) {
          navFlag = false;
          impNav();
        }
      }
    }

    if (localStorage.ADD_FONT === 'ON') {
      const novelBox = document.getElementById('novel_box');

      if (novelBox) {
        if (firstHide) {
          novelBox.style.display = 'none';
          firstHide = false;
        }
        fontChange();
      }
    }
  }
});

viewerObserve.observe(document, {childList: true, subtree: true});

if (localStorage.INDENT_REMOVE === 'ON') {
  document.arrive('#is_indent', {onlyOnce: true, existing: true}, () => {
    document.getElementById('is_indent').value = '1';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (viewer.test(url) === false) {
    if (localStorage.IMP_UI === 'ON') {
      impUi();
    }
  }

  // 뷰어
  if (viewer.test(url) === true) {
    if (localStorage.ADD_FONT === 'ON') {
      const novelBox = document.getElementById('novel_box');
      novelBox.style.display = '';
      addFont();
      fontBtnChange();
    }

    if (localStorage.EFFECT_REMOVE === 'ON') {
      removeEffect();
    }

    if (localStorage.COMMENT_HIDE === 'ON') {
      hideComment();
    }

    if (localStorage.AUTO_BOOKMARK === 'ON') {
      autoBookmark();
    }

    if (localStorage.IMG_DOWN === 'ON') {
      imgDown();
    }

    if (localStorage.AUTO_VOTE === 'ON') {
      autoVote();
    }

    document.getElementsByClassName('pcr-save')[0].addEventListener('click', () => {
      if (localStorage.BG_THEME === 'ON') {
        themeChange();
      }
    });
  }

  // 소설
  if (novel.test(url) === true) {
    if (localStorage.USER_TAG === 'ON') {
      userTag();
    }
  }

  // 설정
  if (useredit === url) {
    const config = [
      {id: 'USER_TAG', text: '유저 태그 표시'},
      {id: 'SHARE_HIDE', text: '공유버튼 제거'},
      {id: 'AUTO_VOTE', text: '자동 추천'},
      {id: 'COMMENT_HIDE', text: '이모티콘만 달린 댓글 제거'},
      {id: 'AUTO_BOOKMARK', text: '다 안 읽은 페이지 자동 북마크'},
      {id: 'ADD_FONT', text: '폰트 종류 추가'},
      {id: 'EFFECT_REMOVE', text: '추천 효과 제거'},
      {id: 'IMP_NAV', text: '네비바 디자인 수정'},
      {id: 'BG_THEME', text: '뷰어 배경색에 맞춰 테마 색상 변경'},
      {id: 'INDENT_REMOVE', text: '(실험)들여쓰기 제거'},
      {id: 'IMP_UI', text: '(실험)UI 수?정(사이트 다크모드 지원X)'},
      {id: 'IMG_DOWN', text: '(실험)더블클릭으로 일러 다?운'},
    ];

    config.forEach(e => {
      const lastSwitch = document.querySelector('div.card-body > br:last-of-type');
      if (localStorage[e.id] === 'ON') {
        lastSwitch.insertAdjacentHTML(
          'afterend',
          `<input class="form-check-input addon" type="checkbox" id=${e.id} checked>${e.text}<br><br>`,
        );
      } else {
        lastSwitch.insertAdjacentHTML(
          'afterend',
          `<input class="form-check-input addon" type="checkbox" id=${e.id}>${e.text}<br><br>`,
        );
      }
    });
    $.switcher('input[class="form-check-input addon"]');

    config.forEach(e => {
      document.getElementById(`${e.id}`).onclick = () => {
        if (localStorage[e.id] !== 'ON') {
          localStorage[e.id] = 'ON';
        } else {
          localStorage[e.id] = 'OFF';
        }
      };
    });
  }
});

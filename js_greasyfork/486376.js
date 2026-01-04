// ==UserScript==
// @name        PGR21 새 불판 감지기
// @namespace   https://github.com/nyqui/pgr21-fresh-grill-detector
// @match       https://pgr21.com/pb/bulpan.php*
// @match       https://pgr21.co.kr/pb/bulpan.php*
// @match       https://pgr21.net/pb/bulpan.php*
// @match       https://pgrer.net/pb/bulpan.php*
// @match       https://ppt21.com/pb/bulpan.php*
// @match       https://pgr21.com/bulpan/*
// @exclude     https://pgr21.com/bulpan/0*
// @version     0.3.0
// @author      nyqui
// @require     https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant       GM_addStyle

// @description PGR21에서 불판에 상주시 새 불판으로 자동 이동
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/486376/PGR21%20%EC%83%88%20%EB%B6%88%ED%8C%90%20%EA%B0%90%EC%A7%80%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/486376/PGR21%20%EC%83%88%20%EB%B6%88%ED%8C%90%20%EA%B0%90%EC%A7%80%EA%B8%B0.meta.js
// ==/UserScript==

const footerString = "v" + GM_info.script.version;
//redirect timer in ms
const redirectTimer = 3000;
//admin comment class name
const admCmtName = ".admCmt";
const cmtWrapName = ".cmtWrap";
const toastMix = Swal.mixin({
  toast: true,
  icon: "success",
  position: "top-end",
  showConfirmButton: false,
  timer: `${redirectTimer}`,
  timerProgressBar: true,
  title: `새 불판 확인`,
  text: `잠시 후 이동합니다...`
});


/*
if ((window.location.hostname).includes("pgr21.com") === false) {
  window.location.hostname = "pgr21.com";
}
*/

if ((window.location.pathname).includes(".php") === false) {
  var youtube = null;

  $(document).ready(function() {
    youtube = document.querySelector('iframe.youtu-embed')?.getAttribute("src");

    if (youtube) {
      GM_addStyle(`
        .btn_bulpan {
          margin-top: -50px !important;
          margin-right: 10px !important;
        }
      `);

      const docnumber = (window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1));
      youtube = (youtube.substring(youtube.lastIndexOf('/') + 1));

      //<a class="btn_bulpan" id="btn_bulpan" href="/pb/bulpan.php?no=31868" data-no="31868">불판창</a>
      $("a#btn_bulpan.btn_bulpan").after('<a class="btn_bulpan" id="btn_bulpan_youtube" href="/pb/bulpan_twitch.php?no=' + docnumber + '&player=youtube&ch=' + youtube + '" target="_blank" rel="noopener noreferrer">유튜브 불판창</a>');
    }

  });
} else {

  const bulpanTitle = (document.title).replace(/(-|\(|#)(.*)/, "");

  toastMix.fire({
    icon: "info",
    title: "새 불판 감지기 작동중",
    text: bulpanTitle,
    timer: 2000,
    footer: footerString
  });

  const observer = new MutationObserver(function(mutations, observer) {
    var admCmts = document.querySelectorAll(admCmtName);
    var lastadmCmt = admCmts[admCmts.length - 1];
    if ((lastadmCmt.innerText).includes(bulpanTitle)) {
      observer.disconnect();
      toastMix.fire({
        didDestroy: () => {
          window.location.href = (lastadmCmt.querySelector("a").getAttribute("href"));
        },
      });
    }
  });

  observer.observe(document.querySelector(cmtWrapName), {
    childList: true
  });
}

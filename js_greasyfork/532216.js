// ==UserScript==
// @name        cs.android.com 优化
// @namespace   Violentmonkey Scripts
// @match       https://cs.android.com/*
// @grant       none
// @run-at      document-idle
// @version     1.2
// @author      5ec1cff
// @description 用于 cs.android.com 的优化
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/532216/csandroidcom%20%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532216/csandroidcom%20%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

let buttonsRoot = null;

const observer = new MutationObserver(function(mutationsList, observe) {
  mutationsList.forEach(l => {
    l.addedNodes?.forEach(e => {
      if (e.nodeType != 1) return;
        if (e.tagName == 'BREADCRUMB') {
          buttonsRoot = e;
          installButtons(location.href);
        }
      })
    })
});
observer.observe(document.body, { 'childList': true, 'subtree': true });

const platformJumpList = {
  latest: "superproject/+/android-latest-release",
  16: "superproject/+/android-16.0.0_r2",
  a15qpr2: "superproject/+/android15-qpr2-release",
  U: "superproject/+/android-14.0.0_r2",
  T: "superproject/+/android-13.0.0_r3",
  Sv2: "superproject/+/android-12.1.0_r27",
  S: "superproject/+/android-12.0.0_r3",
  R: "superproject/+/android-11.0.0_r21",
  Main: "superproject/main/+/main",
  Master: "superproject/+/master",
  "Master-Main": "superproject/+/main",
  Q: "superproject/+/android-10.0.0_r47",
  P: "superproject/+/android-9.0.0_r61",
  O_MR1: "superproject/+/android-8.1.0_r81", // 8.1, 27
  O: "superproject/+/android-8.0.0_r36", // 8.0, 26
  N_MR1: "superproject/+/android-7.1.2_r39", // 7.1, 25
  N: "superproject/+/android-7.0.0_r7", // 7.0, 24
  M: "superproject/+/android-6.0.1_r9", // 6, 23
};

const kernelJumpList = {
  '12-5.10': 'superproject/+/common-android12-5.10',
  '13-5.10': 'superproject/+/common-android13-5.10',
  '13-5.15': 'superproject/+/common-android13-5.15',
  '14-5.15': 'superproject/+/common-android14-5.15',
  '14-6.1': 'superproject/+/common-android14-6.1',
  '15-6.6': 'superproject/+/common-android15-6.6',
  'main': 'superproject/+/common-android-mainline',
}

function getJump(url, to) {
  if (url.match(/android\/platform\/superproject$/)) url += '/+/android-latest-release:';
  else if (url.match(/android\/platform\/superproject\/main$/)) url += '/+/main:';
  else if (url.match(/android\/kernel\/superproject$/)) url += '/+/common-android-mainline:';
  return url.replace(/(?<=android\/)(.*)(?=:)/, to);
}

function installButtons(urlstr) {
  if (buttonsRoot == null) return;
  Array.from(buttonsRoot.querySelectorAll('.jumpbtn')).forEach(x=>x.remove());
  let url = new URL(urlstr);
  if (url.pathname.match(/^\/android\/platform\//)) {
    for (const item in platformJumpList) {
      const v = platformJumpList[item];
      let btn = document.createElement("a");
      btn.textContent = item;
      btn.href = getJump(urlstr, 'platform/' + v);
      btn.style = "margin-right: 1em;";
      btn.classList.add("jumpbtn");
      buttonsRoot.appendChild(btn);
    }
  } else if (url.pathname.match(/^\/android\/kernel\//)) {
    for (const item in kernelJumpList) {
      const v = kernelJumpList[item];
      let btn = document.createElement("a");
      btn.textContent = item;
      btn.href = getJump(urlstr, 'kernel/' + v);
      btn.style = "margin-right: 1em;";
      btn.classList.add("jumpbtn");
      buttonsRoot.appendChild(btn);
    }
  }
}

navigation.addEventListener('navigate', (e) => {
  console.log('orig', location.href);
  console.log('dest', e.destination.url);
  installButtons(e.destination.url);
})

// 2025-04-08：增加 diff 的提交+行号链接跳转

function installDiffLineLinkListener() {
  let last = null;
  let f = (e) => {
    if (last == e.srcElement) return;
    if (e.srcElement?.parentElement == last) return;
    if (
      e?.srcElement?.tagName == "DIV" &&
      e?.srcElement?.classList?.contains?.("CodeMirror-linenumber")
    ) {
      last = e.srcElement;
      try {
        let p = last.parentElement;
        let url = null,
          prefix,
          commit;
        let filepath = document.querySelector(
          "#skiplink-navigation-target"
        )?.textContent;
        let diffPage = false;
        if (filepath == null) {
          // in diff page
          let p = last.parentElement;
          while (p) {
            if (p?.classList?.contains("mat-expansion-panel-content-wrapper")) {
              filepath = p.previousSibling?.querySelector("a")?.innerText;
              diffPage = true;
              break;
            }
            p = p.parentElement;
          }
        }
        if (filepath == null) return;
        let line = last.textContent;
        while (p) {
          if (p?.classList?.contains("CodeMirror-merge-left")) {
            if (!diffPage) {
              url = document.querySelector(".left-diff a").href;
            } else {
              let pos = location.href.lastIndexOf("/");
              let prefix = location.href.substring(0, pos);
              let commits = location.href.substring(pos + 1);
              url = prefix + "/" + commits.split("...")[0];
            }
            break;
          } else if (
            p?.classList?.contains("CodeMirror-merge-pane-rightmost")
          ) {
            if (!diffPage) {
              url = document.querySelector(".right-diff a").href;
            } else {
              let pos = location.href.lastIndexOf("/");
              let prefix = location.href.substring(0, pos);
              let commits = location.href.substring(pos + 1);
              url = prefix + "/" + commits.split("...")[1];
            }
            break;
          }
          p = p?.parentElement;
        }
        let p1 = url.lastIndexOf("/");
        prefix = url.substring(0, p1);
        commit = url.substring(p1 + 1);
        url = `${prefix}/${commit}:${filepath};l=${line}`;
        // console.log(url);
        let a = document.createElement("a");
        a.href = url;
        // a.terget = "_blank";
        a.textContent = line;
        last.replaceChild(a, last.childNodes[0]);
      } catch (err) {
        console.error(last, err);
      }
    } else {
      try {
        if (last)
          last.replaceChild(new Text(last.textContent), last.childNodes[0]);
      } catch (err) {
        console.error(err);
      }
      last = null;
    }
  };
  addEventListener("mousemove", f);
}

installDiffLineLinkListener();

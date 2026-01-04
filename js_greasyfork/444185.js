// ==UserScript==
// @name         futaba reverse res search
// @namespace    https://github.com/himuro-majika
// @version      1.0.2
// @description  被引用レスをポップアップ表示・自分の書き込みへのレスを通知しちゃう
// @author       himuro_majika
// @license      MIT
// @match        *://*.2chan.net/*/res/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/444185/futaba%20reverse%20res%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/444185/futaba%20reverse%20res%20search.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ====オプション====
  const USE_NOTIFICATION = true; //自分の書き込みに新着レスが有ったときに通知を表示する(true/false)
  const NOTIFICATION_TIMEOUT = 5000; //通知の表示時間(ms)
  const MAX_COMMENT_HISTORY_THREAD = 100; //最大レス履歴保存数(スレ)
  const MARKER_CHAR = "★"; //自分の書き込みに付けるマーカーの文字(任意:絵文字も可)
  // ================

  const script_title = "GM_FRRS";
  let qtlist = [];
  let popupOpenTimer;
  let popupCloseTimer;
  let url;
  let isPosted = false;
  let commentHistoryList;
  const startTime = new Date().getTime(); //count parsing time
  init();

  function init() {
    url = getUrl();
    checkLoading();
    makeSelfCommentPicker();
    observeInserted();
    setOnSubmitEvent();
  }

  function initParse() {
    searchSelfComment();
    searchQuotedRes();
    addCounter();
    console.log(script_title + ' - Parsing: ' + ((new Date()).getTime() - startTime) + 'msec'); //log parsing time
  }

  function getUrl() {
    return location.href.match(/^.+:\/\/(.+)/)[1];
  }

  function checkLoading() {
    let loadingTimer = setInterval(() => {
      if (!document.getElementById("futakuro-loading")) {
        initParse();
        clearInterval(loadingTimer);
      }      
    }, 100)
  }

  function getThreImgSrc() {
    let threimg = document.querySelector("#master img");
    if (!threimg) threimg = document.querySelector(".thre > a > img");
    return threimg.src
  }

  function getQuotedRes() {
    return document.querySelectorAll(".thre td blockquote font[color='#789922']");
  }

  function searchQuotedRes(quote) {
    if (arguments.length == 0) {
      quote = getQuotedRes();
    }
    let bqs = document.querySelectorAll(".thre blockquote");
    quote.forEach(item => {
      let qtnum = getResNoFromTdChild(item.parentNode);
      let qtsrcnum = _searchQtSrc(item, qtnum, bqs);
      let qtitemindex = qtlist.findIndex(item => item.qtsrcnum == qtsrcnum);

      if (qtitemindex !== -1 && qtlist[qtitemindex].qtres.findIndex(item => item == qtnum) !== -1) return

      if (qtitemindex !== -1) {
        qtlist[qtitemindex].qtres.push(qtnum);
      } else {
        let qtres = [];
        qtres.push(qtnum);
        let objqt = {
          "qtsrcnum": qtsrcnum,
          "qtres": qtres
        }
        qtlist.push(objqt)
      }
      if (commentHistoryList && commentHistoryList.length > 0) {
        commentHistoryList.forEach(com => {
          if (com.resno == qtsrcnum) {
            highlightResponse(item);
            if (arguments.length > 0) {
              let text = "";
              item.parentNode.childNodes.forEach(node => {
                if (node.nodeName == "#text") {
                  text += node.textContent + "\n";
                }
              });
              showNotification(text);
            }
          }
        })
      }
    });
  }

  function _searchQtSrc(qt, qtnum, bqs) {
    let qtText = qt.innerText.substr(1).trim();
    let qtsrcnum = "0";

    // レスナンバー(No.)
    // /^ *(No)?\.?[0-9]+ *$/
    let matchResNo = qtText.match(/^\s*No\.(\d+)\s*$/);
    if (matchResNo && document.getElementById("delcheck" + matchResNo[1])) {
      qtsrcnum = matchResNo[1];
      return qtsrcnum;
    }

    // 画像ファイル名
    // /^[0-9]+\.(jpg|png|gif|webm|mp4|webp)$/
    let matchFileName = qtText.match(/^\s*(\d+\.(jpg|png|gif|webm|mp4|webp))\s*$/);
    if (matchFileName) {
      let matchFileEle = document.querySelector('.thre a[href$="' + matchFileName[1] + '"]');
      if (matchFileEle) {
        qtsrcnum = getResNoFromTdChild(matchFileEle);
        return qtsrcnum;
      }
    }

    // レス本文
    if (qtText.substr(0,1) == ">") return qtsrcnum;
    const qtresnum = parseInt(qt.parentNode.parentNode.querySelector(".rsc").textContent);
    for (let i = qtresnum - 1; i > 0; i--) {
      let t = "";
      bqs[i].childNodes.forEach(node => {
        if (node.nodeName == "#text") {
          t += node.textContent;
        }
      });
      if (t.indexOf(qtText) >= 0) {
        qtsrcnum = getResNoFromTdChild(bqs[i].parentNode);
        if (qtsrcnum == qtnum) qtsrcnum = "0";
        break;
      }
    }

    return qtsrcnum;
  }

  // 被引用数の表示
  function addCounter() {
    let existedCounter = document.querySelectorAll("." + script_title + "_Counter");
    existedCounter.forEach(item => {
      item.remove();
    })
    let cno = document.querySelectorAll(".cno");
    cno.forEach(no => {
      let num = no.textContent.match(/\d+$/);
      let qtindex = qtlist.findIndex(item => item.qtsrcnum == num);
      if (qtindex == -1) return;
      let qtcount = qtlist[qtindex].qtres.length;
      const counter = document.createElement("a");

      counter.innerText = qtcount + "レス";
      counter.classList.add(script_title + "_Counter");
      counter.style.color = "#117743";
      counter.style.marginLeft = "0.5em";
      counter.setAttribute(script_title + "_num", num);


      counter.addEventListener("mouseenter", popupQuoteRes);
      counter.addEventListener("mouseleave", removePopup);
      no.parentNode.insertBefore(counter, no);
    });
  }

  // 被引用レスのポップアップ
  function popupQuoteRes(e) {
    if (!this.closest("." + script_title + "_popup")) {
      removePopupAll();
    }
    clearTimeout(popupCloseTimer);
    clearTimeout(popupOpenTimer);
    popupOpenTimer = setTimeout(() => {
      let srcnum = this.getAttribute(script_title + "_num");
      let qtitem = qtlist.find(item => item.qtsrcnum == srcnum);
      let qtres = qtitem.qtres;
      let resListContainer = makePopupContainer();

      let xpos = this.getBoundingClientRect().left + window.scrollX - 20;
      let ypos = this.getBoundingClientRect().bottom + window.scrollY;
      resListContainer.style.top = ypos.toString() + "px";
      if (xpos + 500 > window.innerWidth) {
        resListContainer.style.right = "20px";
      } else {
        resListContainer.style.left = xpos.toString() + "px";
      }

      let resListTable = setPopupContent(qtres);

      resListContainer.appendChild(resListTable);
        document.querySelector("div.thre").appendChild(resListContainer);
    }, 200);
  }

  function setPopupContent(resnolist) {
    if (resnolist.length == 0) {
      let noEle = document.createElement("div");
      noEle.textContent = "該当レスがありません。";
      return noEle;
    }
    let resListTable = document.createElement("table");
    let resListTbody = document.createElement("tbody");

    resnolist.forEach(res => {
      let td = document.getElementById("delcheck" + res).parentNode.cloneNode(true);
      let rsc = td.querySelector(".rsc");
      rsc.classList.add("qtjmp");
      let jumpid = rsc.id;
      rsc.removeAttribute("id");
      rsc.addEventListener("click", () => {
        let jumptarget = document.getElementById(jumpid).parentNode;
        window.scroll(0, jumptarget.getBoundingClientRect().top + window.pageYOffset);
        removePopup();
      });

      const counter = td.querySelector("." + script_title + "_Counter");
      if (counter) {
        counter.addEventListener("mouseenter", popupQuoteRes);
        counter.addEventListener("mouseleave", removePopup);
      }

      const futakuro_resno = td.querySelector(".res_no");
      if (futakuro_resno) futakuro_resno.style.display = "none";

      if (checkAkahukuEnabled()) {
        // resListContainer.setAttribute("__akahuku_reply_popup_index", resno);
        let gtdiv = document.createElement("div");
        gtdiv.classList.add("akahuku_popup_content_blockquote");
        let bq = td.querySelector("blockquote");
        gtdiv.innerHTML = bq.innerHTML;
        bq.remove();
        td.appendChild(gtdiv);
      }
      let resListTr = document.createElement("tr");
      resListTr.appendChild(td);
      resListTbody.appendChild(resListTr);
    })
    resListTable.appendChild(resListTbody);

    return resListTable;
  }

  function makePopupContainer() {
    let container = document.createElement("div");
    container.classList.add(script_title + "_popup");
    if (checkAkahukuEnabled()) {
      container.classList.add("akahuku_reply_popup");
    } else {
      container.style.backgroundColor = "#F0E0D6";
      container.style.boxShadow = "1px 1px 3px 1px #777";
      container.style.borderRadius = "5px";
      container.style.fontSize = "0.85em";
    }
    container.style.position = "absolute";
    container.style.zIndex = 302;
    container.addEventListener("mouseenter", () => {
      clearTimeout(popupCloseTimer);
    });
    container.addEventListener("mouseleave", removePopup);
    return container;
  }

  function removePopup(souceEl) {
    clearTimeout(popupCloseTimer);
    clearTimeout(popupOpenTimer);
    if (!souceEl) return;
    if (!souceEl.relatedTarget) return;
    if (souceEl.srcElement.className == "GM_FRRS_Counter" && 
      souceEl.relatedTarget.closest(".GM_FRRS_popup")) return;
    if (souceEl.srcElement.classList.contains("GM_FRRS_popup") && 
      souceEl.relatedTarget.closest(".GM_FRRS_popup")) {
      removeForwardPopupSibling(souceEl.relatedTarget.closest(".GM_FRRS_popup"));
      return;
    }
    popupCloseTimer = setTimeout(() => {
      removePopupAll();
    }, 500);
  }

  function removePopupAll() {
    let popup = document.querySelectorAll("." + script_title + "_popup");
    if (!popup) return;
    popup.forEach(p => {
      p.remove();
    })
  }

  function removeForwardPopupSibling(ele) {
    if (!ele.nextElementSibling) return;
    let nextsibling = ele.nextElementSibling;
    if (nextsibling.classList.contains("GM_FRRS_popup")) {
      nextsibling.remove();
    } else {
      return;
    }
    removeForwardPopupSibling(ele);
  }

  // 続きを読むで挿入される要素を監視
  function observeInserted() {
    let target = document.querySelector(".thre");
    if (!target) return;
    let observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (!mutation.addedNodes.length) return;
        if (mutation.addedNodes[0].className == script_title + "_popup") return;
        if (mutation.addedNodes[0].querySelector(".rtd")) {
          refreshCounter(mutation.addedNodes);
        }
      });
      if (isPosted) {
        isPosted = false;
        selfComment(mutations);
      }
    });
    observer.observe(target, {
      childList: true
    });
  }

  function refreshCounter(nodes) {
    let qt = nodes[0].querySelectorAll(".thre td blockquote font[color='#789922']");
    if (!qt.length) return;
    searchQuotedRes(qt);
    addCounter();
  }

  // レス投稿時のイベント設定
  function setOnSubmitEvent() {
    let formEle = document.getElementById("fm");

    formEle.addEventListener("submit", () => {
      onCommentSend();
    });
    let button = formEle.querySelector("input[type='submit'");
    if (button) {
      button.addEventListener("click", () => {
        onCommentSend();
      });
    }
  }

  function onCommentSend() {
    if (isPosted) return;
    isPosted = true;
    let textbody = document.getElementById("ftxa").value.trim();
    storeCommentHistory(textbody);
  }

  // 書き込み履歴の保存
  function storeCommentHistory(commentText) {
    if (typeof(commentText) !== "string") return;

    commentHistoryList = getCommentHistory();

    let comment = {
      "comment": commentText,
      "resno": ""
    }
    if (!commentHistoryList) {
      commentHistoryList = [];
    }
    commentHistoryList.push(comment);
    
    setCommentHistory(commentHistoryList);
    console.log(commentHistoryList);
    setTimeout(() => {
      expireCommentHistory();
    }, 5000);
  }

  function getCommentHistory() {
    let commentHistory = getValue(url);
    return commentHistory;
  }

  function setCommentHistory(commenthistory) {
    setValue(url, commenthistory);
    return;
  }

  function searchSelfComment() {
    let listUpdatedFlag = false;
    commentHistoryList = getCommentHistory();
    if (!commentHistoryList) return;
    commentHistoryList.forEach(element => {
      let elresno = element.resno;
      if (elresno !== "") {
        let sd = document.getElementById("sd" + elresno);
        if (!sd) return;
        highlightOwnRes(sd);
      }
      let comment = element.comment;
      if (elresno == "" && comment) {
        console.log(comment);
        let bq = document.querySelectorAll(".thre .rtd blockquote");
        bq.forEach(item => {
          let bqtext = item.innerText;
          if (comment == bqtext) {
            let bqresno = getResNoFromTdChild(item);
            let itemsd = document.getElementById("sd" + bqresno);
            if (!itemsd) return;
            highlightOwnRes(itemsd);
            element.resno = bqresno;
            listUpdatedFlag = true;
            // console.log(bqresno);
          }
        })
      }
    });
    if (listUpdatedFlag) {
      setCommentHistory(commentHistoryList);
    }
    // console.log(qtlist);
  }

  function selfComment(mutations) {
    commentHistoryList = getCommentHistory();
    if (!commentHistoryList) return;
    if (commentHistoryList[commentHistoryList.length - 1].resno !== "") return;
    let latestStoredComment = commentHistoryList[commentHistoryList.length - 1].comment;
    let hitres;
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length && mutation.addedNodes[0].querySelector(".rtd")) {
        let table = mutation.addedNodes[0];
        let bq = table.querySelector("blockquote");
        if (!bq) return;
        let bqtext = bq.innerText;
        if (latestStoredComment === "") {
          if (bqtext !== "ｷﾀ━━━(ﾟ∀ﾟ)━━━!!" &&
              bqtext !== "ｷﾀ━━━━━━(ﾟ∀ﾟ)━━━━━━ !!!!!" &&
              bqtext !== "本文無し") {
            return;
          }
        } else if (bqtext !== latestStoredComment) {
          return;
        }
        commentHistoryList[commentHistoryList.length - 1].resno = getResNoFromTdChild(bq);
        hitres = table;
      }
    });
    if (!hitres) return;
    // console.log(hitres);
    setCommentHistory(commentHistoryList);
    let sd = hitres.querySelector(".sod");
    highlightOwnRes(sd);
    // console.log(commentHistoryList);
  }

  function highlightOwnRes(node) {
    if (node.parentNode.querySelector("." + script_title + "_own_res")) return;
    let marker = document.createElement("span");

    marker.innerText = MARKER_CHAR;
    marker.classList.add(script_title + "_own_res");
    // marker.style.fontWeight = "bold";
    marker.style.color = "#117743";
    marker.style.cursor = "pointer";
    marker.addEventListener("click", () => {
      let selfResList = document.querySelectorAll("." + script_title + "_own_res");
      popupSelfCommentList(selfResList);
    });
    let rsc = node.parentNode.querySelector(".rsc");
    let futakuroResNo = node.parentNode.querySelector(".res_no");
    if (futakuroResNo) {
      rsc = futakuroResNo;
    }
    rsc.style.color = "#1b54ff";
    rsc.style.fontWeight = "bold";
    rsc.style.fontSize = "smaller";
    rsc.style.cursor = "pointer";
    rsc.addEventListener("click", () => {
      let selfResList = document.querySelectorAll("." + script_title + "_own_res");
      popupSelfCommentList(selfResList);
    });
    node.parentNode.insertBefore(marker, node.previousSibling);
  }

  // 自分の書き込みへのレスをハイライト
  function highlightResponse(bq) {
    bq.parentNode.classList.add(script_title + "_response");
    let rsc = bq.parentNode.parentNode.querySelector(".rsc");
    let futakuroResNo = bq.parentNode.parentNode.querySelector(".res_no");
    if (futakuroResNo) {
      rsc = futakuroResNo;
    }
    rsc.style.color = "#ff0078";
    rsc.style.fontWeight = "bold";
    rsc.style.fontSize = "smaller";
    rsc.style.cursor = "pointer";
    rsc.addEventListener("click", () => {
      let selfResList = document.querySelectorAll("." + script_title + "_response");
      document.getElementById(script_title + "_new_comment").style.color = "#0040ee";
      popupSelfCommentList(selfResList);
    });
  }

  // 自分の書き込み一覧ポップアップ
  function makeSelfCommentPicker() {
    let commentPickerContainer = document.createElement("div");
    commentPickerContainer.id = script_title + "_comment_picker_container";
    commentPickerContainer.style.fontSize = "9pt";

    let commentPicker = document.createElement("a");
    commentPicker.id = script_title + "_self_comment_picker";
    commentPicker.textContent = "📑[自分の書き込み]";
    commentPicker.style.color = "#0040ee";
    commentPicker.style.cursor = "pointer";
    commentPicker.addEventListener("click", () => {
      let selfResList = document.querySelectorAll("." + script_title + "_own_res");
      popupSelfCommentList(selfResList);
    });
    let newComment = document.createElement("a");
    newComment.id = script_title + "_new_comment";
    newComment.textContent = "[書き込みへのレス]";
    newComment.style.cursor = "pointer";
    newComment.style.color = "#0040ee";
    newComment.addEventListener("click", () => {
      let selfResList = document.querySelectorAll("." + script_title + "_response");
      document.getElementById(script_title + "_new_comment").style.color = "#0040ee";
      popupSelfCommentList(selfResList);
    });
    commentPickerContainer.appendChild(commentPicker);
    commentPickerContainer.appendChild(newComment);

    let pwd = document.getElementById("usercounter");
    pwd.parentNode.insertBefore(commentPickerContainer, pwd);
  }

  function popupSelfCommentList(selfResList) {
    let popup = document.getElementById(script_title + "_own_res_popup");
    if (popup) {
      popup.remove();
      return;
    }
    let container = makeSelfCommentListContainer();
    let selfResNoList = [];
    selfResList.forEach(res => {
      selfResNoList.push(getResNoFromTdChild(res));
    });
    let qttable = setPopupContent(selfResNoList);
    container.appendChild(qttable);
    document.querySelector("html body").appendChild(container);
  }

  function makeSelfCommentListContainer() {
    let container = document.createElement("div");
    container.id = script_title + "_own_res_popup";
    if (checkAkahukuEnabled()) {
      container.classList.add("akahuku_reply_popup");
    } else {
      container.style.boxShadow = "1px 1px 3px 1px #777";
      container.style.borderRadius = "5px";
      container.style.fontSize = "0.85em";
    }
    container.style.position = "fixed";
    container.style.right = "10px";
    container.style.bottom = "400px";
    container.style.zIndex = "301";
    container.style.overflowY = "scroll";
    container.style.maxHeight = "65vh";
    container.style.maxWidth = "65em";

    return container;
  }

  function showNotification(text) {
    const newRes = document.getElementById(script_title + "_new_comment");
    newRes.style.display = "";
    newRes.style.color = "#F00";

    if (!USE_NOTIFICATION) return;

    GM_notification({
      title: "書き込みに新しいレスがあります",
      image: getThreImgSrc(),
      text: text,
      timeout: NOTIFICATION_TIMEOUT,
      onclick: () =>{
        // console.log("notification clicked");
      }
    });
  }

  function getResNoFromTdChild(ele) {
    let cno = ele.parentNode.querySelector(".cno");
    let resno = cno.textContent.replace("No.", "");
    return resno;
  }

  function checkAkahukuEnabled() {
    return document.getElementById("akahuku_postform") != null
  }

  function checkFutakuroEnabled() {
    return document.getElementById("postform") != null;
  }

  function expireCommentHistory() {
    const historyList = getListValues();
    // console.log(historyList);
    if (historyList.length > MAX_COMMENT_HISTORY_THREAD) {
      for (let i = 0; i < historyList.length - MAX_COMMENT_HISTORY_THREAD; i++) {
        deleteValue(historyList[i]);
        console.log(script_title + " expire comment history: " + historyList[i]);
      }
    }
  }

  function getValue(name) {
    if (!name) return;
    try {
      let val = GM_getValue(name);
      if (!val) return 0;
      // console.log(val);
      return val;
    } catch(e) {
      console.log(e);
      return 0;
    }
  }

  function setValue(name, val) {
    if (!name || !val) return;
    try {
      GM_setValue(name, val);
    } catch(e) {
      console.log(e);
      return;
    }
  }

  function getListValues() {
    try {
      const gmlistvalues = GM_listValues();
      if (!gmlistvalues) return;
      return gmlistvalues;
    } catch (e) {
      console.log(e);
      return;
    }
  }

  function deleteValue(name) {
    if (!name) return;
    try {
      GM_deleteValue(name);
      return;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }
})();
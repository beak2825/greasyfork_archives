// ==UserScript==
// @name         E-mail share link for gMail
// @description  Add buttons to get shareable links to 'More' menu of any e-mail conversation in gMail.
// @namespace    joh-tw
// @author       JOH
// @version      1.06
// @license      Copyleft (Ɔ) GPLv3
// @noframes
// @grant        none
// @match        https://mail.google.com/mail/*
// @downloadURL https://update.greasyfork.org/scripts/435445/E-mail%20share%20link%20for%20gMail.user.js
// @updateURL https://update.greasyfork.org/scripts/435445/E-mail%20share%20link%20for%20gMail.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function log(msg) {
    console.log(msg);
  }

  function existEl(selectorEl) {
    var el = document.querySelector(selectorEl);
    return (typeof(el) != 'undefined' && el != null);
  }

  function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    return div.firstChild; // Change this to div.childNodes to support multiple top-level nodes
  }

  function getEmailSource(permmsgid) {
      var ik = GM_ID_KEY,
          url = 'https://mail.google.com/mail/u/0/?ik='+ik+'&view=om&permmsgid='+permmsgid;

      var req = new XMLHttpRequest();
      req.open('GET', url, false);
      req.send(null);
      if(req.status == 200){
        return req.responseText;
      }
  }

  function extractStrFromText(inputText, strPrefix, strSurfix="") {
    var str = "";
    var regex = new RegExp("^"+strPrefix+".*$", "gmu");
    var match = inputText.match(regex);

    if (match)
      str = match[0].replace(strPrefix, "").replace(strSurfix, "");
    return str;
  }

  function getEmailData() {
    var menuEl = document.querySelector('[role="button"][data-tooltip="More"][aria-expanded="true"],[role="button"][data-tooltip="Další možnosti"][aria-expanded="true"],[role="button"][data-tooltip="Viac"][aria-expanded="true"]');
    var permmsgid = menuEl.closest('[data-message-id]').getAttribute("data-message-id").replace("#", "");

    var emailSource = getEmailSource(permmsgid);

    var msgIdStr   = extractStrFromText(emailSource, "Message-ID: &lt;", "&gt;");
    var subjectStr = extractStrFromText(emailSource, "Subject: ");

    var createStr  = extractStrFromText(emailSource, "Date: ");
    var createDate = new Date( Date.parse(createStr) );
    var createStrCz = createDate.toLocaleDateString("cs-CZ", { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replaceAll(". ", ".");

    return {
        "id": msgIdStr,
        "date": createStrCz,
        "subject": subjectStr,
    };
  }

  function createMenuBtn(btnElId, btnTitle, addAfterEl) {
    var btnEl =  document.getElementById( btnElId );
    if (typeof(btnEl) != 'undefined' && btnEl != null) {
      btnEl.remove();
    }

    var btnStr = '<div class="J-N" role="menuitem" aria-hidden="false" id="'+btnElId+'" style="user-select: none;">'+btnTitle+'</div>';
    var btn = createElementFromHTML(btnStr);
    btn.addEventListener("mouseover", function(e) { e.target.closest(".J-N").classList.add("J-N-JT");  }, false);
    btn.addEventListener("mouseleave",  function(e) { e.target.classList.remove("J-N-JT"); } , false);

    addAfterEl.parentNode.insertBefore(btn, addAfterEl.nextSibling);
    return btn;
  }

  function createLinkBtns(addAfterMenuItemEl) {
    var btnHtml = createMenuBtn("share-email-html-url", "E-mail link (HTML)", addAfterMenuItemEl);
      if (btnHtml)
          btnHtml.addEventListener("mousedown",  function(e) { outputToUser_htmlLinkToClipboard(); } , false);

    var btnText = createMenuBtn("share-email-text-url", "E-mail link", addAfterMenuItemEl);
      if (btnText)
          btnText.addEventListener("mousedown",  function(e) { outputToUser_textUrlToClipboard(); } , false);
  }

  function moreMenuItemsChanged(e) {
    var addAfterMenuItemElSelector = '[role="menuitem"]#r3';    // #r3 = Forward btn
    if ( existEl(addAfterMenuItemElSelector) ) {
      e.target.removeEventListener('DOMSubtreeModified', moreMenuItemsChanged);
      var addAfterMenuItemEl = document.querySelector(addAfterMenuItemElSelector);
      createLinkBtns(addAfterMenuItemEl);
    }
  }

  function getEmailUrl(msgId) {
    var url = "https://mail.google.com/mail/#search/rfc822msgid%3A"+encodeURIComponent(msgId);
    return url;
  }

  function closeModerMenu() {
      document.querySelector(".b7.J-M").style.display = "none";
  }

  function outputToUser_textUrlToClipboard() {
      var msgData = getEmailData(),
          url = getEmailUrl(msgData["id"]);
      copyToClip( url );
      closeModerMenu();
  }

  function outputToUser_htmlLinkToClipboard() {
      var msgData = getEmailData(),
          url = getEmailUrl(msgData["id"]),
          title = msgData["subject"]+" ("+msgData["date"]+")";
      copyToClip( '<a href="'+url+'" target="_blank">'+title+'</a>' );
      closeModerMenu();
  }

  function outputToUser_json() {
      var msgData = getEmailData(),
          jsonData = JSON.stringify(msgData);

      closeModerMenu();
  }

  function copyToClip(str) {
    function listener(e) {
      e.clipboardData.setData("text/html", str);
      e.clipboardData.setData("text/plain", str);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  };

  function handleMoreMenuButton() {
    var menuHolderElSelector = 'div[tabindex="-1"][role="menu"][class="b7 J-M"][aria-haspopup="true"]',
        menuHolderEl = document.querySelector(menuHolderElSelector);
    if (menuHolderEl !== null) {
      menuHolderEl.addEventListener('DOMSubtreeModified', moreMenuItemsChanged, false);
    }
  }

  var waitingForPage = 0;
  function waitPageReady() {
    var msgsListMoreMenuExist = existEl('[data-tooltip="Inbox section options"]');
    var msgMoreMenuExist = existEl(msgDetailMoreMenuElSelector);
    var searchQueryExist = existEl('[data-query]');

    if (msgsListMoreMenuExist || msgMoreMenuExist || searchQueryExist) {
      doOnPageReady();
      return;
    }

    if (waitingForPage < 60 ) { // wait for 15 ses (30*500ms) for page load
      waitingForPage++;
      setTimeout(waitPageReady, 500);
    }
  }


  function showFoundEmail() {
    // if search for specific mail by its ID
    // try to show it directly insted of list it
    var searchElSelector = "[data-query]";
    if ( existEl(searchElSelector) ) {
      var searchEl = document.querySelector(searchElSelector),
          searchQuery = searchEl.getAttribute('data-query');

      if ( searchQuery.includes("rfc822msgid") ){

        // if only one email then click to show it
          var listEl = document.querySelectorAll('.Cp')[0];
          var mailRows = listEl.querySelectorAll('table tbody tr');
          if (mailRows.length == 1) {
            mailRows[0].click();
          }
      }
    }
  }

  // global variables --------------------------------------------------------------------------
    var msgDetailMoreMenuElSelector = "[data-message-id] [role='button'][data-tooltip='More'],[data-message-id] [role='button'][data-tooltip='Další možnosti'],[data-message-id] [role='button'][data-tooltip='Viac']";
  // ----------------------------------------------------------------------------


  // Start the script
  function doOnPageReady() {
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
      window.trustedTypes.createPolicy('default', {
        createHTML: (string, sink) => string
      });
    }

    window.addEventListener('popstate', function (event) {
      handleMoreMenuButton();
    });
    showFoundEmail();
    handleMoreMenuButton();
  }
  waitPageReady();

})();

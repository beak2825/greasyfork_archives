// ==UserScript==
// @name         Copy jira info to add git
// @name:zh-CN   快速复制jira信息用于提交git
// @namespace    http://tampermonkey.net/
// @description  Add three button to copy the jira id and summary and link. Thanks to Andy ,this script is based on his script , https://greasyfork.org/zh-CN/scripts/432095-copy-motorola-jira-id-and-summary-and-link
// @description:zh-cn  添加按钮用于复制Jira summary到git commit label
// @author       zhouyan
// @version      0.5
// @include      https://jira.freewheel.tv/browse/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/442286/Copy%20jira%20info%20to%20add%20git.user.js
// @updateURL https://update.greasyfork.org/scripts/442286/Copy%20jira%20info%20to%20add%20git.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
      #snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  top: 50px;
  font-size: 17px;
}

#snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}

@-webkit-keyframes fadein {
  from {top: 0; opacity: 0;}
  to {top: 50px; opacity: 1;}
}

@keyframes fadein {
  from {top: 0; opacity: 0;}
  to {top: 50px; opacity: 1;}
}

@-webkit-keyframes fadeout {
  from {top: 50px; opacity: 1;}
  to {top: 0; opacity: 0;}
}

@keyframes fadeout {
  from {top: 50px; opacity: 1;}
  to {top: 0; opacity: 0;}
}
    `);
  var observeDOM = (function () {
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var eventListenerSupported = window.addEventListener;

    return function (obj, onAddCallback, onRemoveCallback) {
      if (MutationObserver) {
        // define a new observer
        var mutationObserver = new MutationObserver(function (mutations, observer) {
          if (mutations[0].addedNodes.length && onAddCallback != undefined) {
            onAddCallback();
          }
        });
        // have the observer observe foo for changes in children
        mutationObserver.observe(obj, {
          childList: true
        });
      } else if (eventListenerSupported) {
        obj.addEventListener('DOMNodeInserted', onAddCallback, false);
      }
    };
  })();


  var ff = function () {
    setTimeout(function () {
      if (document.getElementById('copy_id') == null) {
        addCopyBtn();
      }
    }, 0);
  };
  var target = document.getElementsByTagName('body')[0];
  observeDOM(target, /*onAdd*/ ff, /*onRemove*/ ff);

})();

function addCopyBtn() {
  const container = document.getElementById('stalker');
  const issueKey = document.getElementById('key-val');
  const issueName = document.getElementById('summary-val');

  if (!container) return;

  const divE = document.createElement('div');
  divE.id = 'snackbar';
  divE.innerHTML = 'Copied succesfully';
  container.appendChild(divE);

  const newElement = document.createElement('li');
  const idE = document.createElement('a');
  idE.innerHTML = 'Copy id';
  idE.className = 'aui-button aui-button-primary aui-style';
  idE.id = 'copy_id';
  idE.onclick = (e) => {
    var snackbar = document.getElementById('snackbar');
    snackbar.className = 'show';

    navigator.clipboard.writeText(issueKey.childNodes[0].data);
    //console.log("CopyId_"+ issueKey.childNodes[0].data);

    setTimeout(function () {
      snackbar.className = snackbar.className.replace('show', '');
    }, 1500);
  };
  newElement.appendChild(idE);
  issueKey.parentNode.parentNode.appendChild(newElement);

  const newElement2 = document.createElement('li');
  const summaryE = document.createElement('a');
  summaryE.className = 'aui-button aui-button-primary aui-style';
  summaryE.innerHTML = 'Copy summary';
  summaryE.id = 'copy_summary';
  summaryE.onclick = (e) => {
    var snackbar = document.getElementById('snackbar');
    snackbar.className = 'show';

    navigator.clipboard.writeText(issueName.childNodes[0].data);
    //console.log("CopySummary_"+ issueName.childNodes[0].data);

    setTimeout(function () {
      snackbar.className = snackbar.className.replace('show', '');
    }, 1500);
  };

  newElement2.appendChild(summaryE);
  issueKey.parentNode.parentNode.appendChild(newElement2);

  const newElement3 = document.createElement('li');
  const linkE = document.createElement('a');
  linkE.className = 'aui-button aui-button-primary aui-style';
  linkE.innerHTML = 'Copy link';
  linkE.id = 'copy_link';
  linkE.onclick = (e) => {
    var snackbar = document.getElementById('snackbar');
    snackbar.className = 'show';

    navigator.clipboard.writeText('https://jira.freewheel.tv/browse/' + issueKey.childNodes[0].data);
    //console.log("CopyLink_"+ "https://jira.freewheel.tv/browse/" + issueKey.childNodes[0].data);

    setTimeout(function () {
      snackbar.className = snackbar.className.replace('show', '');
    }, 1500);
  };

  newElement3.appendChild(linkE);
  issueKey.parentNode.parentNode.appendChild(newElement3);

  const newElement4 = document.createElement('li');
  const idSummaryE = document.createElement('a');
  idSummaryE.className = 'aui-button aui-button-primary aui-style';
  idSummaryE.innerHTML = 'Copy as git title';
  idSummaryE.id = 'copy_id_summary';
  idSummaryE.onclick = (e) => {
    var snackbar = document.getElementById('snackbar');
    snackbar.className = 'show';
    var re = issueKey.childNodes[0].data + ' ' + issueName.childNodes[0].data;
    // 替换空格为下划线，替换[]为_，以及将/替换为-
    var re2 = re.replace(/ /g, '_').replace(/\[/g, '_').replace(/\]/g, '_').replace(/\//g, '-');
    navigator.clipboard.writeText(re2);

    setTimeout(function () {
      snackbar.className = snackbar.className.replace('show', '');
    }, 1500);
  };


  newElement4.appendChild(idSummaryE);
  issueKey.parentNode.parentNode.appendChild(newElement4);

  const newElement5 = document.createElement('li');
  const TechDesignTitle = document.createElement('a');
  TechDesignTitle.className = 'aui-button aui-button-primary aui-style';
  TechDesignTitle.innerHTML = 'Copy as tech design title';
  TechDesignTitle.id = 'copy_tech_title';
  TechDesignTitle.onclick = (e) => {
    var snackbar = document.getElementById('snackbar');
    snackbar.className = 'show';
    var re = 'UI Tech Design ' + issueKey.childNodes[0].data + ' <' + issueName.childNodes[0].data + '>';
    navigator.clipboard.writeText(re);

    setTimeout(function () {
      snackbar.className = snackbar.className.replace('show', '');
    }, 1500);
  };

  newElement5.appendChild(TechDesignTitle);
  issueKey.parentNode.parentNode.appendChild(newElement5);
}

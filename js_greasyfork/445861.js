// ==UserScript==
// @name         vjudge dark theme
// @namespace    https://github.com/notwatermango/vjudge-dark-theme
// @version      0.1.3
// @description  with some github dark color scheme
// @author       notwatermango
// @match        https://vjudge.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vjudge.net
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/445861/vjudge%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/445861/vjudge%20dark%20theme.meta.js
// ==/UserScript==

(function () {
  'use strict';
  var colors = {
    background: '#0d1117',
    superblack: '#0A0908',
    navbar_background: '#161b22',
  };
  function overrideStyleAttribute(elm, prop, value) {
    elm.setAttribute("style", elm.getAttribute("style") + `; ${prop}: ${value} !important; `);
  }

  function applyFuncWhenElmLoaded(sel, func, delay = 100) {
    var elm = document.querySelectorAll(sel);
    if (!elm || elm.length == 0) return setTimeout(applyFuncWhenElmLoaded, delay, sel, func);
    for (let i = 0, len = elm.length; i < len; i++) func(elm[i]);
  }
  var body_elm = document.querySelectorAll('body')[0];
  overrideStyleAttribute(body_elm, "color", "white");
  overrideStyleAttribute(body_elm, "background", "none");
  overrideStyleAttribute(body_elm, "background-color", colors.background);
  applyFuncWhenElmLoaded(
    'body',
    function (elm) {
      overrideStyleAttribute(elm, "color", "white");
      overrideStyleAttribute(elm, "background", "none");
      overrideStyleAttribute(elm, "background-color", colors.background)
    }
  );
  applyFuncWhenElmLoaded(
    '.bg-inverse',
    function (elm) {
      overrideStyleAttribute(elm, "color", "white");
      overrideStyleAttribute(elm, "background", "none");
      overrideStyleAttribute(elm, "background-color", colors.navbar_background)
    }
  );


  function rank_functions() {
    applyFuncWhenElmLoaded(
      '#contest-rank-table tr.this td.meta',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", "#003540");
        overrideStyleAttribute(elm, "color", "#fff");
      }
    );
    applyFuncWhenElmLoaded(
      '.modal-content, .modal-body',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", "#003540");
        overrideStyleAttribute(elm, "color", "#fff");
      }, 1500
    );
    applyFuncWhenElmLoaded(
      '#solutionModal #info-panel td',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", "#121212");
        overrideStyleAttribute(elm, "color", "#fff");
      }, 1500
    )

    applyFuncWhenElmLoaded(
      '#contest-rank-table tr.this.myself td.meta',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", "#0a697d");
        overrideStyleAttribute(elm, "color", "#fff");
      }, 1500
    );
    applyFuncWhenElmLoaded(
      '#contest-rank-table td.failed',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", "#321010");
        overrideStyleAttribute(elm, "color", "#fff");
      }
    );
    applyFuncWhenElmLoaded(
      '#contest-rank-table td.accepted',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", "#366039");
        overrideStyleAttribute(elm, "color", "#fff");
      }
    );
    applyFuncWhenElmLoaded(
      '#contest-rank-table td.prob.fb',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", "#037603");
        overrideStyleAttribute(elm, "color", "#fff");
      }
    );
    applyFuncWhenElmLoaded( // needs delay
      '#contest-rank-table th',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", "#091122");
        overrideStyleAttribute(elm, "color", "#fff");
      },
      1500
    );
    applyFuncWhenElmLoaded( // needs delay
      '#contest-rank-table a ',
      function (elm) {
        overrideStyleAttribute(elm, "color", "#fff");
      },
      1500
    );
    applyFuncWhenElmLoaded(
      ' table.table thead',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", "#06162e");
      }
    );
    applyFuncWhenElmLoaded(
      ' #description-container dd, .preview, .form-control',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", "#101935");
        overrideStyleAttribute(elm, "color", "#F2FDFF");
        overrideStyleAttribute(elm, "box-shadow", "none");
      }
    );
    applyFuncWhenElmLoaded(
      'table.vjudge_sample tbody tr td',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", colors.superblack);
        overrideStyleAttribute(elm, "color", "white");
      }
    );
    applyFuncWhenElmLoaded(
      'table.vjudge_sample thead tr th, li.list-group-item',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", colors.superblack);
        overrideStyleAttribute(elm, "color", "white");
      }, 1000
    );
    //#description-container>dd


  }
  function list_update() {
    applyFuncWhenElmLoaded(
      'li.list-group-item',
      function (elm) {
        overrideStyleAttribute(elm, "background-color", colors.superblack);
        overrideStyleAttribute(elm, "color", "white");
      }, 1000
    );
  }


  applyFuncWhenElmLoaded(
    '.card-block, .list-group-item, .card, .btn, .my-sol',
    function (elm) {
      overrideStyleAttribute(elm, "color", "white");
      overrideStyleAttribute(elm, "background", "none");
      overrideStyleAttribute(elm, "background-color", "#121212")
    }
  );
  applyFuncWhenElmLoaded(
    '#prob-my-sols td',
    function (elm) {
      overrideStyleAttribute(elm, "background-color", "#121212")
    }
  );
  // 86c2f7

  rank_functions();
  let currentPage = location.href;

  const mutationObserver = new MutationObserver(function (mutations_list) {
    mutations_list.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (added_node) {
        console.log("observing...:");
        rank_functions();
        list_update();
      });
    });
  });

  function handleHashChange() {
    let urlParam = window.location.hash;
    if (urlParam == '#rank') {
      setTimeout(rank_functions);
      mutationObserver.observe(document.querySelector('#contest-rank-table'), { subtree: false, childList: true });
    } else if (urlParam[1] == 'p') {
      var li_elm = document.querySelector('#prob-descs');
      mutationObserver.observe(li_elm, { subtree: false, childList: true });
    }
  };

  handleHashChange();
  window.addEventListener('hashchange', handleHashChange);

  function onClassChange(elm, callback) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          callback(mutation.target);
        }
      });
    });
    observer.observe(elm, { attributes: true });
    return observer.disconnect;
  }

  onClassChange(body_elm, (node) => {
    node.classList.contains('active')
      ? ''
      : rank_functions();
  });

  mutationObserver.observe(body_elm, { subtree: false, childList: true });

  function parentHasClass(elm, classname, depth = 0) {
    if (depth == 2) return false;
    if (elm.className.split(' ').indexOf(classname) >= 0) return true;
    return elm.parentNode && parentHasClass(elm.parentNode, classname, depth + 1);
  }
  function fixLinkColor() {
    if (document.readyState != "complete") {
      return setTimeout(fixLinkColor, 100);
    }
    var elms = document.querySelectorAll("a");
    list_update();
    for (let i = 0, len = elms.length; i < len; i++) {
      if (!elms[i].classList.contains('btn') && !parentHasClass(elms[i], 'name')) {
        overrideStyleAttribute(elms[i], "color", "#86c2f7");
      }
    }
  };

  fixLinkColor();


})();

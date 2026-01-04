// ==UserScript==
// @name         Garoon show refrences
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Garoonで返信先表示
// @author       yhara
// @match        http://garoon.ybm.jp/scripts/cbgrn/grn.exe/space/*
// @match        http://garoon.ybm.jp/scripts/cbgrn/grn.exe/message/*
// @grant        window.jQuery
// @grant        window.grn
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/425265/Garoon%20show%20refrences.user.js
// @updateURL https://update.greasyfork.org/scripts/425265/Garoon%20show%20refrences.meta.js
// ==/UserScript==

jQuery(function ($) {
  const pageConfigs = {
    // スペース
    space: {
      // コメント全体を包むラッパー要素のID
      wrapperId: 'space_content',
      // パラメータのうちコメントNoのキー
      cmnoKey: 'cmno',
      // コメント読込時のURL
      fetchUrl: '/scripts/cbgrn/grn.exe/space/application/discussion/ajax/comment_list?',
      // コメント読込時のデータタイプ
      dataType: 'json',
      // URLから対象コメントのパラメータを取得
      getParamsByHref: function (href) {
        const matchResult = href.match(/spid=(\d+)#tid=(\d+)&cmno=(\d+)/);
        if (!matchResult) {
          return false;
        }

        return {
          spid: matchResult[1],
          tid: matchResult[2],
          cmno: matchResult[3],
        };
      },
      // 現在のページと同じコメントかどうか
      checkIsSamePage: function (reference) {
        const locationParams = location.href.match(/spid=(\d+)#tid=(\d+)/);
        if (!locationParams) {
          return false;
        }

        return reference.spid === locationParams[1] && reference.tid === locationParams[2];
      },
      // レスポンスデータをコメント一覧に変換する処理
      parseResponse: function (responseData) {
        return $(responseData.thread_comments);
      },
      // コメント要素取得後の処理
      afterGetCommentEl: function ($commentEl) {
      },
      // コメント要素に返信先表示ボタンを追加する処理
      addShowCommentRefButton: function ($commentEl, $div) {
        const $td = $('<td>');
        $td.append($div);
        $td.css({ width: '150px' });
        $commentEl.find('.space-thread-comment-footer-grn tr').append($td);
      },
    },
    // メッセージ
    message: {
      wrapperId: 'message_comments',
      fetchUrl: '/scripts/cbgrn/grn.exe/message/view?',
      cmnoKey: 'follow_id',
      dataType: 'html',
      getParamsByHref: function (href) {
        const matchResult = href.match(/cid=(\d+)&rid=(\d+)&mid=(\d+)&follow_id=(\d+)/);
        if (!matchResult) {
          return false;
        }

        return {
          cid: matchResult[1],
          rid: matchResult[2],
          mid: matchResult[3],
          follow_id: matchResult[4],
        };
      },
      checkIsSamePage: function (reference) {
        const locationParams = location.href.match(/cid=(\d+)/);
        if (!locationParams) {
          return false;
        }

        return reference.cid === locationParams[1];
      },
      parseResponse: function (responseData) {
        return $(responseData).find('.js_comment');
      },
      afterGetCommentEl: function ($commentEl) {
        // メッセージの返信先の削除ボタンは動作しないため削除
        $commentEl.find('.js_delete_link').remove();
      },
      addShowCommentRefButton: function ($commentEl, $div) {
        $commentEl.find('.thread_comment_footer_grn tr td.nowrap-grn').append($div);
      },
    },
  };

  // 該当ページを確認
  const pageKey = Object.keys(pageConfigs).find(function (key) {
    return $('#' + pageConfigs[key].wrapperId).length > 0;
  });
  // 該当ページじゃなければ何もしない
  if (!pageKey) {
    return;
  }
  const pageConfig = pageConfigs[pageKey];

  // 独自クラス
  const classes = {
    showRefButtonWrapper: 'show-ref-button-wrapper',
    initialized: 'reply-initialized',
    commentReference: 'comment-reference',
  };

  const cache = {};

  function findCommentEl(cmno) {
    return $('[data-comment-no="' + cmno + '"]');
  }

  function getCache(reference) {
    const key = Object.values(reference).join('_');
    const $commentEl = cache[key];
    if (!$commentEl) {
      return null;
    }

    const $commentElClone = $commentEl.clone();
    // idで隠しボタン表示切り替えしているため外す
    $commentElClone.prop('id', null);
    setReplyStyle($commentElClone);

    // 同じページ上に同じコメントのいいねボタンが複数あるとどっちかしかいいね表示されないため
    // 返信先のいいねボタンは削除する
    $commentElClone.find('.icon_reaction_sub_grn').parent().remove();

    // 同じページ以外のコメントに返信したらそのディスカッション内で返信したことになってしまう
    // 同じページ以外のコメントの返信ボタンは削除
    if (!pageConfig.checkIsSamePage(reference)) {
      $commentElClone.find('.js_reply_button').parent().remove();
      $commentElClone.find('.js_reply_all_button').parent().remove();
    }

    const commentId = $commentElClone.data('comment-id');
    // 同じコメントが画面上に複数あるときに「返信する」で名前が複数出ないようにする
    if ($('.js_comment[data-comment-id="' + commentId + '"]').length > 0) {
      $commentElClone.find('.username_grn').removeClass('username_grn');
    }

    pageConfig.afterGetCommentEl($commentElClone);

    return $commentElClone;
  }
  function setCache(reference, $commentEl) {
    const key = Object.values(reference).join('_');
    cache[key] = $commentEl.clone();

    cache[key].removeClass(classes.initialized);
    cache[key].find('.' + classes.showRefButtonWrapper).remove();
  }

  function getCommentEl(reference) {
    return new Promise(function (resolve, reject) {
      const cached = getCache(reference);
      if (cached) {
        resolve(cached);
        return;
      }
      const cmno = reference[pageConfig.cmnoKey];

      const $commentEl = findCommentEl(cmno);
      if ($commentEl.length > 0) {
        setCache(reference, $commentEl);
        resolve(getCache(reference));
        return;
      }

      const request = new grn.component.ajax.request({
        url: pageConfig.fetchUrl,
        method: "post",
        dataType: pageConfig.dataType,
        grnRedirectOnLoginError: true,
        data: Object.keys(reference).map(function (key) {
          return key + '=' + reference[key];
        }).join('&'),
      });

      request.on("beforeShowError", function(e, jqXHR) {
        alert('返信先の読込に失敗しました。');
        reject();
      });
      request.send().done(function(responseData) {
        const $commentEl = pageConfig.parseResponse(responseData).filter('[data-comment-no="' + cmno + '"]');

        setReplyStyle($commentEl);

        setCache(reference, $commentEl);

        resolve(getCache(reference));
      });
    });
  }

  function setReplyStyle($commentEl) {
    $commentEl.addClass(classes.commentReference);
    $commentEl.id = null;
  }

  function initComment($commentEl) {
    let commentReferenceActive = false;

    if ($commentEl.hasClass(classes.initialized)) {
      return;
    }
    $commentEl.addClass(classes.initialized);

    const level = $commentEl.data('ref-level') || 0;

    const references = [];

    $commentEl.find('a').each(function () {
      const reference = pageConfig.getParamsByHref(this.href);
      if (!reference) {
        return;
      }

      const exists = references.some(function (testsReference) {
        return Object.keys(testsReference).every(function (key) {
          return reference[key] === testsReference[key];
        });
      });
      if (exists) {
        return;
      }

      references.push(reference);
    });

    if (references.length === 0) {
      return;
    }

    // コメントNo降順ソート
    references.sort(function (refA, refB) {
      return refA[pageConfig.cmnoKey] - refB[pageConfig.cmnoKey];
    });

    const a = document.createElement('a');
    a.innerText = '+ 返信先を表示';
    a.style.cursor = 'pointer';

    a.addEventListener('click', toggleCommentReference);

    function showCommentReference() {
      a.disabled = true;
      a.innerHTML = '<img src="/cbgrn/grn/image/cybozu/spinner.gif?20190218.text">返信先読込中';
      Promise.all(references.map(function (reference) {
        return getCommentEl(reference);
      })).then(function (els) {
        els.forEach(function ($el) {
          $el.data('ref-level', level + 1);
          $el.css({ 'margin-left': 32 * (level + 1) + 'px' });
          $commentEl.after($el);
        })
        a.disabled = false;
        a.innerText = '- 返信先を非表示';
      }).catch(function () {
        a.disabled = false;
        a.innerText = '+ 返信先を表示';
        commentReferenceActive = false;
      });
    }

    function hideCommentReference() {
      let $nextCommentEl = $commentEl.next();
      while ($nextCommentEl.hasClass(classes.commentReference) && $nextCommentEl.data('ref-level') > level) {
        $nextCommentEl.remove();
        $nextCommentEl = $commentEl.next();
      }
    }

    function toggleCommentReference() {
      if (commentReferenceActive) {
        hideCommentReference();
        a.innerText = '+ 返信先を表示';
      } else {
        showCommentReference();
      }
      commentReferenceActive = !commentReferenceActive;
    }

    const $div = $('<div>');
    $div.addClass(classes.showRefButtonWrapper);
    $div.append($(a));
    pageConfig.addShowCommentRefButton($commentEl, $div);
  }

  function initComments() {
    $('#' + pageConfig.wrapperId).on('mouseenter', '.js_comment', function () {
      const $this = $(this);
      initComment($this);
    });
  }

  initComments();

  GM_addStyle(''
    + '.' + classes.commentReference + '{'
      + 'background-color: #f5f5f5;'
      + 'border-top: 1px solid #c9c9c9;'
      + 'padding: 8px;'
      + 'margin: 0;'
    + '}'
    + '.js_comment .' + classes.showRefButtonWrapper + '{'
      + 'transition: opacity .5s ease-in-out;'
      + 'opacity: 0;'
    + '}'
    // 返信先表示切替
    + '.js_comment:hover .' + classes.showRefButtonWrapper + '{'
      + 'opacity: 1;'
    + '}'
    // 返信先ホバー時に隠されているボタンが表示されるようにする
    + '.' + classes.commentReference + ':hover .js_permalink,'
    + '.' + classes.commentReference + ':hover .js_reply_all_button,'
    + '.' + classes.commentReference + ':hover .js_delete_link {'
      + 'opacity: 1 !important;'
    + '}'
  );
});

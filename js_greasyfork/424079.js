// ==UserScript==
// @name         AtCoder ResultsPage Tweaks
// @namespace    https://github.com/yukuse
// @version      1.0.4
// @description  AtCoderの提出結果一覧画面に自動検索機能などを追加します。
// @author       yukuse
// @include      https://atcoder.jp/contests/*/submissions
// @include      https://atcoder.jp/contests/*/submissions?*
// @include      https://atcoder.jp/contests/*/submissions/me
// @include      https://atcoder.jp/contests/*/submissions/me?*
// @grant        window.jQuery
// @grant        window.fixTime
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424079/AtCoder%20ResultsPage%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/424079/AtCoder%20ResultsPage%20Tweaks.meta.js
// ==/UserScript==

// jQueryカスタムイベントを監視/発火するためwindowのjQueryを使用しています。
jQuery(($) => {
  const options = {
    // 検索条件変更時に自動検索 on/off
    autoSearchOnChange: true,
    // 検索結果の動的読み込み(少し検索結果表示が早くなる) on/off
    // NOTE: trueのとき、他のスクリプトによる表示変更(AtCoder Difficulty Displayなど)が反映されないため注意!
    dynamicResult: false,
    // 検索条件変更時のフォーカス維持 on/off
    keepSelectFocus: true,
    // 画面表示時のフォーカス対象 '#select-task'|'#select-language'|'#select-status'|'#input-user'|null
    focusOnVisit: '#select-task',
    // 言語固定中の検索時に言語がリセットされないようにする
    keepLanguage: true,
  };

  const $container = $('#main-container');
  const $panelSubmission = $container.find('.panel-submission');

  const baseParams = {
    'f.Task': '',
    'f.Language': '',
    'f.LanguageName': '',
    'f.Status': '',
    'f.User': '',
    page: 1,
    orderBy: '',
    desc: '',
  };

  function parseSubmissionsUrl(url) {
    const params = { ...baseParams };
    if (url) {
      Object.keys(params).forEach((key) => {
        const regexp = new RegExp(`${key}=([^&]+)`);
        const result = url.match(regexp);
        if (result) {
          [, params[key]] = result;
        }
      });
    }

    return params;
  }

  /**
   * 現在のURLに応じて検索結果表示を更新
   * TODO: ジャッジ中表示対応
   */
  function updateSearchResult() {
    const { href } = location;
    const params = parseSubmissionsUrl(href);

    // 検索条件を遷移先の状態にする
    Object.keys(params).forEach((key) => {
      $panelSubmission.find(`[name="${key}"]`).val(params[key]).trigger('change');
    });

    const $tmp = $('<div>');
    $tmp.load(`${href} #main-container`, '', () => {
      const $newTable = $tmp.find('.table-responsive, .panel-body');
      // テーブル置換
      $panelSubmission.find('.table-responsive, .panel-body').replaceWith($newTable);
      // ページネーション置換
      if ($newTable.hasClass('table-responsive')) {
        $container.find('.pagination').replaceWith($tmp.find('.pagination:first'));
      } else {
        $container.find('.pagination').empty();
      }

      // 日付を表示
      fixTime();
    });
  }

  /**
   * 検索条件を元にURLを更新し、結果を表示する
   */
  function showSearchResult(params) {
    const paramsStr = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
    const url = `${location.pathname}?${paramsStr}`;

    if (options.dynamicResult) {
      history.pushState({}, '', url);

      updateSearchResult();
    } else {
      location.href = url;
    }
  }

  /**
   * フォームに設定されたパラメータを取得
   */
  function getFormParams() {
    const params = { ...baseParams };
    Object.keys(params).forEach((key) => {
      params[key] = $panelSubmission.find(`[name="${key}"]`).val();
      // 空のキーは外す
      if (!params[key]) {
        delete params[key];
      }
    });
    params.page = 1;

    return params;
  }

  /**
   * フォームの検索条件で検索
   */
  function search() {
    showSearchResult(getFormParams());
  }

  /**
   * 選択欄の調整
   * - 選択時に自動検索
   * - 画面表示時に選択欄自動フォーカス
   * - 選択時にフォーカスが飛ばないようにする
   */
  function initSelectTweaks() {
    // 選択欄自動フォーカス
    if (options.focusOnVisit) {
      $panelSubmission.find(options.focusOnVisit).focus();
    }

    $panelSubmission.find('#select-task, #select-language, #select-status').on('select2:select select2:unselect', (event) => {
      // unselectの場合は選択状態が遅れて反映されるため、実行を遅らせる
      setTimeout(() => {
        // 選択時に自動検索
        if (options.autoSearchOnChange) {
          search();
        }

        // 選択時にフォーカスが飛ばないようにする
        if (options.keepSelectFocus) {
          event.target.focus();
        }
      }, 0);
    });
  }

  const urlRegExp = new RegExp(`${location.pathname}[^/]*$`);
  /**
   * 検索結果のリンククリック時のページ遷移をなくし、表示を動的に更新する処理に置き換え
   */
  function initLinks() {
    $container.on('click', '.pagination a, .panel-submission a', (event) => {
      const { href } = event.target;
      if (!urlRegExp.test(href)) {
        return;
      }
      // 言語リンクは除外
      if (/f.Language=([^&]+)/.test(href)) {
        return;
      }

      event.preventDefault();

      showSearchResult(parseSubmissionsUrl(href));
    });
  }

  function init() {
    initSelectTweaks();
    if (options.dynamicResult) {
      window.addEventListener('popstate', updateSearchResult);
      initLinks();

      // フォームの検索押下時に検索結果を動的読み込み
      $panelSubmission.find('form').on('submit', (event) => {
        event.preventDefault();
        search();
      });
    }

    // 言語固定中の検索時に言語がリセットされないようにする
    if (options.keepLanguage) {
      const result = location.href.match(/f.Language=(\d+)/);
      if (result && result[1]) {
        const inputHidden = $(`<input type="hidden" name="f.Language" value="${result[1]}">`);
        $panelSubmission.find('form').append(inputHidden);
      }
    }
  }

  init();
});

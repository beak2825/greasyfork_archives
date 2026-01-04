// ==UserScript==
// @name        Twitter 关键词过滤器（旧UI）
// @description Twitter 关键词过滤器 适用于旧UI
// @version      1.0
// @namespace   https://space.bilibili.com/482343
// @author      超神越鬼
// @license     超神越鬼
// @match       https://twitter.com/*
// @exclude     https://twitter.com/i/*
// @exclude     https://twitter.com/intent/*
// run-at       document-idle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/403909/Twitter%20%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E6%97%A7UI%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/403909/Twitter%20%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%E5%99%A8%EF%BC%88%E6%97%A7UI%EF%BC%89.meta.js
// ==/UserScript==
(function() {
  'use strict';

  const SPLIT_WORD = ',/';

  const STRING_RESOURCES = {
    zh: {
      setTime: '时间设定',
      autoRefresh: '自动刷新',
      muteText: '过滤文字',
      muteLink: '过滤链接',
      muteTag: '过滤Tag',
      muteUserId: '过滤用户名',
      openCloseMute: '开关过滤栏',
      openCloseTweet: '开关tweet发送栏',
      tweetFormText: '通过单击左侧图标放大、缩小时间线',
      placeholder: '您可以通过用 ,/（逗号和斜杠）分隔字符串来保存多个字符',
      muteFromLabel: '请选择过滤类型',
      muteTextLabel: '文字',
      muteLinkLabel: '链接',
      muteTagLabel: 'Tag',
      muteUserIdLabel: '用户名',
      addText: '增加',
      delText: '删除',
      confText: '确定',
      duplicateErrText: '" 已设置',
      unmatchedErrText: '"未设置',
      emptyErrText: '找不到过滤词',
      ngWordErrText: '抱歉，您不能在过滤词中使用",/"'
    },
    en: {
      setTime: 'Set time',
      autoRefresh: 'Disable/Enable auto refresh',
      muteText: 'Disable/Enable muting texts in tweet',
      muteLink: 'Disable/Enable muting links in tweet',
      muteTag: 'Disable/Enable muting hashtags in tweet',
      muteUserId: 'Disable/Enable muting userIDs in tweet',
      openCloseMute: 'Open/Close mute input form',
      openCloseTweet: 'Open/Close tweet form',
      tweetFormText: 'By clicking the left icon, the timeline is expanded/contracted',
      placeholder: 'You can input plural words by dividing them by ,/(conmma & slash)',
      muteFromLabel: 'Please choose a type of muting',
      muteTextLabel: 'texts',
      muteLinkLabel: 'links',
      muteTagLabel: 'hashtags',
      muteUserIdLabel: 'userIDs',
      addText: 'Add',
      delText: 'Del',
      confText: 'Conf',
      duplicateErrText: '" is already set for mute word',
      unmatchedErrText: '" is not set for mute word',
      emptyErrText: 'The mute words are not found',
      ngWordErrText: 'Sorry, the mute words which contains the word ",/" can not be set'
    }
  };
     //console.log(navigator.language);
  const STRINGS = STRING_RESOURCES[navigator.language.indexOf('zh')>-1 ? 'zh' : 'en'];

  const OPEN_CLOSE_ID = 'mot_open_close';
  const OPEN_CLOSE_TWEET_ID = 'mot_open_close_tweet';
  const MUTE_DIV_ID = 'mot_mute_field';
  const FORM_CLASS = 'mot-form-btn';
  const TL_CLASS = 'mot-expand-tl';
  const VISIBILITY_CLASS = 'mot-visivility';
  const RADIO_BTN_CLASS = 'mot-radio-btn-color';

  const ADDED_TWEET_OBSERVER = new MutationObserver(mutations => {
          mutations.forEach(processAddedTweets);
        });
  const AUTO_REFRESH_OBSERVER = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
              g_autoRefreshFlag = true;
              g_screenHeight = window.pageYOffset;
              mutation.addedNodes[0].click();
            }
          });
        });

  const ADDED_MUTE_WORD_ARRAY = [];

  const MUTE_WORD_TYPE = 'mute_words';
  const MUTE_LINK_TYPE = 'mute_links';
  const MUTE_TAG_TYPE = 'mute_tags';
  const MUTE_ID_TYPE = 'mute_ids';

  const MUTE_WORDS_ARRAY = {
    [MUTE_WORD_TYPE]: [],
    [MUTE_LINK_TYPE]: [],
    [MUTE_TAG_TYPE]: [],
    [MUTE_ID_TYPE]: []
  };
  const FLAG_LIST = {
    mute_text_flag: true,
    mute_link_flag: true,
    mute_tag_flag: true,
    mute_userId_flag: true,
    form_flag: true,
    tweet_box_flag: true,
    time: '200'
  };
  const FORM_FLAG_LIST = {
    mute_text_flag: ['form_text'],
    mute_link_flag: ['form_link'],
    mute_tag_flag: ['form_tag'],
    mute_userId_flag: ['form_userId']
  };

  // 自分で作ったミュートフォーム
  let g_muteForm;
  let g_muteInputForm;
  // 各地で使うTwitter側のノード
  let g_pageContainer;
  let g_timeline;
  let g_streamItems;
  let g_notifyNewTweetBtn;
  // ツイート入力ボックス(ホーム限定)
  let g_tweetBox;
  // タイムラインの拡大/縮小に使う用のノード(ホーム限定)
  let g_topBar;
  let g_pageOuter;
  let g_rightDashBoard;

  let g_homeOrListFlag;
  // 追加モードかどうかのフラグ
  let g_addFlag = false;
  // 削除モードかどうかのフラグ
  let g_deleteFlag = false;
  // ラジオボタンから取得したミュートのタイプ
  let g_muteType;
  // 一時的にミュートの文字列配列を格納するための配列
  let g_muteArrayTemp;
  // 消す対象となるツイートの親ノード
  let g_tweetParentNode;
  // 自動的に追加されたかどうかを示すフラグ
  let g_autoRefreshFlag = false;
  let g_screenHeight;
  let g_timeoutId;
  // タイムラインが拡大か縮小かを示すフラグ
  let g_expandTlFlag = false;

  function defineStyles() {
    GM_addStyle(`
      .${FORM_CLASS} {
        color: black;
        margin-right: 10px;
      }
      .${TL_CLASS} {
        width: 100%;
        margin-left: 0px !important;
        margin-right: 0px !important;
      }
      .${VISIBILITY_CLASS} {
        display: none !important;
      }
      .${RADIO_BTN_CLASS} {
        font-weight: bold;
        color: #EE2C2C;
      }
    `);
  }

  function setupCommandMenu() {
    /**
     * フラグを切り替える（コマンドメニュー専用関数）
     *
     * @param {String} フラグ名
     */
    function toggleFlag(flagName) {
      const tempFlag = !GM_getValue(flagName);

      GM_setValue(flagName, tempFlag);

      if (flagName === 'autoRefresh_flag') {
        if (isTargetPage()) {
          if (tempFlag) {
            AUTO_REFRESH_OBSERVER.observe(g_notifyNewTweetBtn, { childList: true });
          } else {
            AUTO_REFRESH_OBSERVER.disconnect();
          }
        }
      } else {
        FLAG_LIST[flagName] = tempFlag;

        if (isTargetPage()) {
          FORM_FLAG_LIST[flagName][1].classList.toggle(RADIO_BTN_CLASS);
        }
      }
    }
    /**
     * 時間を入力させるダイアログを表示する（コマンドメニュー専用関数）
     */
    function displayTimeInputPrompt() {
      const inputTime = prompt('', FLAG_LIST.time);

      if (/\d+/g.test(inputTime)) {
        GM_setValue('time', inputTime);
        FLAG_LIST.time = inputTime;
      }
    }

    const commandMenuObj = {
      autoRefresh_flag: [STRINGS.autoRefresh, {}],
      mute_text_flag: [STRINGS.muteText, {}],
      mute_link_flag: [STRINGS.muteLink, {}],
      mute_tag_flag: [STRINGS.muteTag, {}],
      mute_userId_flag: [STRINGS.muteUserId, {}]
    };

    Object.keys(commandMenuObj).forEach(key => {
      if (typeof GM_getValue(key) === 'undefined') GM_setValue(key, true);

      GM_registerMenuCommand(
        commandMenuObj[key][0],
        toggleFlag.bind(commandMenuObj[key][1][key], key)
      );
    });

    GM_registerMenuCommand(STRINGS.setTime, displayTimeInputPrompt);
  }

  function initSettings() {
    Object.keys(MUTE_WORDS_ARRAY).forEach(key => {
      if (GM_getValue(key)) {
        MUTE_WORDS_ARRAY[key] = GM_getValue(key).split(SPLIT_WORD);
      }
    });

    if (typeof GM_getValue('form_flag') === 'undefined') {
      GM_setValue('form_flag', true);
    }

    if (typeof GM_getValue('tweet_box_flag') === 'undefined') {
      GM_setValue('tweet_box_flag', true);
    }

    if (typeof GM_getValue('time') === 'undefined') {
      GM_setValue('time', '200');
    }

    Object.keys(FLAG_LIST).forEach(key => {
      FLAG_LIST[key] = GM_getValue(key);
    });
  }

  function setHeaderAndButton() {
    const btnToOpenCloseMuteForm = document.createElement('div');
    const leftDashBoard = g_homeOrListFlag ?
      document.querySelector('[class="dashboard dashboard-left"]') :
      document.querySelector('.SidebarCommonModules');

    btnToOpenCloseMuteForm.setAttribute('id', OPEN_CLOSE_ID);
    btnToOpenCloseMuteForm.setAttribute('class', 'btn primary-btn tweet-btn');
    btnToOpenCloseMuteForm.style.marginBottom = '10px';
    btnToOpenCloseMuteForm.appendChild(
      document.createTextNode(STRINGS.openCloseMute)
    );

    leftDashBoard.insertBefore(btnToOpenCloseMuteForm, leftDashBoard.children[0]);

    // ホーム画面の場合
    if (location.href === 'https://twitter.com/') {
      const btnToOpenCloseTweet = document.createElement('div');

      btnToOpenCloseTweet.setAttribute('id', OPEN_CLOSE_TWEET_ID);
      btnToOpenCloseTweet.setAttribute('class', 'btn primary-btn tweet-btn');
      btnToOpenCloseTweet.style.marginBottom = '10px';
      btnToOpenCloseTweet.appendChild(
        document.createTextNode(STRINGS.openCloseTweet)
      );

      leftDashBoard.insertBefore(btnToOpenCloseTweet, leftDashBoard.children[0]);

      document.querySelector('[data-condensed-text]')
        .setAttribute('data-condensed-text', STRINGS.tweetFormText);
    }
    // リスト画面の場合は邪魔なスペースを非表示にする
    else if (/^https\:\/\/twitter\.com\/\w+\/lists\/.+$/.test(location.href)) {
      document.querySelector('.content-header').style.display = 'none';
    }

    g_muteForm = document.createElement('div');
    g_muteForm.setAttribute('id', MUTE_DIV_ID);
    g_muteForm.insertAdjacentHTML('afterbegin', `
      <form onsubmit="return false;">
        <input type="text" id="mLtrForm" class="${FORM_CLASS}" value="" placeholder="${STRINGS.placeholder}" style="width: 418px;">
        <input type="button" id="mLtrAdd" class="${FORM_CLASS}" value="${STRINGS.addText}">
        <input type="button" id="mLtrRmv" class="${FORM_CLASS}" value="${STRINGS.delText}">
        <input type="button" id="mLtrConf" value="${STRINGS.confText}">
      </form>
      <div style="background-color:white; margin-top:8px; font-size:12px; color:black; height:23px;">
        <span style="color:green; margin-left:5px;">
          ${STRINGS.muteFromLabel}：
        </span>
        <label id="form_text" style="margin-right: 17px;">
          <input type="radio" name="muteLetter" value="${MUTE_WORD_TYPE}" checked>
          ${STRINGS.muteTextLabel}
        </label>
        <label id="form_link" style="margin-right: 17px;">
          <input type="radio" name="muteLetter" value="${MUTE_LINK_TYPE}">
          ${STRINGS.muteLinkLabel}
        </label>
        <label id="form_tag" style="margin-right: 17px;">
          <input type="radio" name="muteLetter" value="${MUTE_TAG_TYPE}">
          ${STRINGS.muteTagLabel}
        </label>
        <label id="form_userId" style="margin-right: 17px;">
          <input type="radio" name="muteLetter" value="${MUTE_ID_TYPE}">
          ${STRINGS.muteUserIdLabel}
        </label>
      </div>
    `);
    g_muteForm.style.marginBottom = '10px';

    g_timeline.insertBefore(g_muteForm, g_timeline.children[0]);

    if (!FLAG_LIST.form_flag) g_muteForm.classList.add(VISIBILITY_CLASS);
  }

  function muteTweet(targetNode) {
    // データがスクリプトの場合、もしくは、データがユーザーの場合は以降の処理を中断する
    if (
      targetNode.nodeName === 'SCRIPT' ||
      targetNode.getAttribute('data-item-type') === 'user'
    ) {
      return;
    }

    // 邪魔なコンテンツの場合は非表示にして以降の処理を中断する
    if (isAnnoyingContent(targetNode)) {
      targetNode.style.display = 'none';
      return;
    }

    muteQuotedTweet(targetNode);

    // 通常のツイートの場合
    if (targetNode.children[0].nodeName === 'DIV') {
      g_tweetParentNode = targetNode;

      if (isNeededToMute()) {
        const tweetContextNode = targetNode.children[0].children[1];
        // 引用ツイートがある場合は位置がずれる
        const tweetTextNode = tweetContextNode.children[1].className === 'u-hiddenVisually' ?
          tweetContextNode.children[2].children[0] : tweetContextNode.children[1].children[0];

        checkIfTweetIsMuted(tweetTextNode);
      }
    }
    /**
      ホームのページの会話のツイートの場合
      <ol class="conversation-module stream-items js-navigable-stream" data-ancestors="687474228690419713">...</ol>
     */
    else if (g_homeOrListFlag) {
      Array.from(targetNode.children[0].children).slice(1).forEach(
        tweetNode => {
          if (tweetNode.className !== 'missing-tweets-bar') {
            g_tweetParentNode = tweetNode;
            execMuteProcess(tweetNode.children[0].children[1]);
          }
        }
      );
    }
    /**
      検索ページのメディアを持ってるツイートの場合
      <ol role="presentation" class="expanded-conversation expansion-container js-expansion-container js-navigable-stream">...</ol>
    */
    else {
      g_tweetParentNode = targetNode;
      execMuteProcess(targetNode.children[0].children[0].children[0].children[1]);
    }
  }
  /**
   * 引用されたツイートを探してミュート処理を実行する
   *
   * @param {Node} ツイートの親ノード
   */
  function muteQuotedTweet(targetNode) {
    [].forEach.call(targetNode.querySelectorAll('.QuoteTweet'), tweetNode => {
      g_tweetParentNode = tweetNode.querySelector('.tweet-content');

      if (isNeededToMute()) {
        // 画像を持っているかどうかで取得する位置が変わる
        const quotedTextNode = g_tweetParentNode.childElementCount > 1 ?
          g_tweetParentNode.children[1] : g_tweetParentNode.children[0];

        checkIfTweetIsMuted(quotedTextNode.children[1]);
      }
    });
  }
  /**
   * 対象のツイートが邪魔なコンテンツであるかどうかを確認する。
   *
   * @param {Node} ツイートの親ノード
   * @return {boolean} 邪魔なコンテンツの場合はtrue，そうでなければfalse
   */
  function isAnnoyingContent(targetNode) {
    // ツイート以外
    if (targetNode.getAttribute('data-item-type') !== 'tweet') {
      return true;
    }

    // プロモーションのツイート
    if (targetNode.children[0].getAttribute('data-promoted')) {
      return true;
    }

    // JSONデータを取得
    const suggestion = JSON.parse(targetNode.getAttribute('data-suggestion-json'));

    // JSONデータが存在する場合
    if (suggestion) {
      const suggestionType = suggestion.suggestion_details.suggestion_type;

      // タイプが通常ツイートではない場合
      // →他人がいいねしたツイートや過去のリツイート
      if (suggestionType && suggestionType !== 'RankedOrganicTweet' && suggestionType !== 'RankedTimelineTweet') {
        return true;
      }
    }

    // 上記以外は通常のツイートとする
    return false;
  }
  /**
   * ミュートする必要があるかどうかチェックする．以下の場合にその必要がない．
   * ・通常モード(追加モードでも削除モードでもない)ですでに非表示だった場合
   * ・追加モードでツイートがすでに非表示だった場合(チェックする意味がない)
   * ・削除モードでツイートが表示されていた場合(ミュート設定の削除なので新規にミュートチェックはしない)
   *
   * @return {boolean} ミュートする必要があればtrue，そうでなければfalse
   */
  function isNeededToMute() {
    return !(
      (!g_addFlag && !g_deleteFlag && g_tweetParentNode.classList.contains(VISIBILITY_CLASS)) ||
      (g_addFlag && g_tweetParentNode.classList.contains(VISIBILITY_CLASS)) ||
      (g_deleteFlag && !g_tweetParentNode.classList.contains(VISIBILITY_CLASS))
    );
  }
  /**
   * ツイート処理を実行する
   *
   * @param {Node} ツイートのコンテントのノード
   */
  function execMuteProcess(tweetContentNode) {
    if (isNeededToMute()) {
      if (tweetContentNode.children[1].nodeName === "P") {
        checkIfTweetIsMuted(tweetContentNode.children[2].children[0]);
      } else {
        checkIfTweetIsMuted(tweetContentNode.children[1].children[0]);
      }
    }
  }
  /**
   * ツイートがミュートされたかどうかチェックする．
   * ノードを装飾する処理は追加・削除モードでは行わない(すでに処理済みなため)
   *
   * @param {Node} ツイートの本文のノード(<p class="TweetTextSize  js-tweet-text tweet-text" lang="en" data-aria-label-part="0">...</p>)
   * @return {boolean} ミュートされていればtrue，そうでなければfalse
   */
  function checkIfTweetIsMuted(tweetTextNode) {
    let mutedFlag = false;

    [].forEach.call(tweetTextNode.childNodes, function(tweetElement) {
      // 标签
      if (tweetElement.nodeName === 'A') {
        // "pic.twitter.com"(图片链接)
        if (tweetElement.hasAttribute('data-pre-embedded')) {
          mutedFlag = checkIfTextHasMuteWord(MUTE_LINK_TYPE, tweetElement);
        }
        // not "pic.twitter.com"(网站连结)
        else if (tweetElement.hasAttribute('title')) {
          mutedFlag = checkIfTextHasMuteWord(MUTE_LINK_TYPE, tweetElement);

          if (!g_deleteFlag && !g_addFlag) {
            tweetElement.setAttribute('href', tweetElement.getAttribute('title'));
          }
        }
        // 标签
        else if (tweetElement.hasAttribute('data-query-source')) {
          mutedFlag = checkIfTextHasMuteWord(MUTE_TAG_TYPE, tweetElement);

          if (!g_deleteFlag && !g_addFlag) {
            tweetElement.setAttribute('target', '_blank');
          }
        }
        // 用户名
        else if (tweetElement.hasAttribute('data-mentioned-user-id')) {
          mutedFlag = checkIfTextHasMuteWord(MUTE_ID_TYPE, tweetElement);

          if (!g_deleteFlag && !g_addFlag) {
            tweetElement.setAttribute('target', '_blank');
          }
        }
      }
      // 除此之外
      else {
        // 文本节点或STRONG标记
        if (tweetElement.nodeName == '#text' || tweetElement.nodeName == 'STRONG') {
          mutedFlag = checkIfTextHasMuteWord(MUTE_WORD_TYPE, tweetElement);
        }
      }

      // 静音时
      if (mutedFlag) {
        // 如果尚未静音，则隐藏
        if (!g_tweetParentNode.classList.contains(VISIBILITY_CLASS)) {
          g_tweetParentNode.classList.add(VISIBILITY_CLASS);
        }
      }
      // 如果未静音且处于删除模式，则显示一条鸣叫
      else if (g_deleteFlag) {
        g_tweetParentNode.classList.remove(VISIBILITY_CLASS);
      }
    });

    return mutedFlag;
  }
  /**
   * 检查推文中是否包含静音字符
   *
   * @param {String} 指示静音类型的字符串
   * @param {Node} Tweet主体节点的子节点（文本，A标签等）
   * @return {boolean} 如果包含要静音的字符，则为true；否则为false
   */
  function checkIfTextHasMuteWord(muteType, tweetElement) {
    const muteArray = g_addFlag ? ADDED_MUTE_WORD_ARRAY : MUTE_WORDS_ARRAY[muteType];

    switch (muteType) {
      case MUTE_WORD_TYPE:
        if (!FLAG_LIST.mute_text_flag) return false;

        // 文字节点
        if (tweetElement.nodeName === '#text') {
          return muteArray.some(muteWord => tweetElement.nodeValue.includes(muteWord));
        }
        // STRONG标签
        else {
          let nodeText = '';
          let textNodeTemp = tweetElement.previousSibling;

          // 与上一个文本节点的文本串联
          if (textNodeTemp && textNodeTemp.nodeName === '#text') {
            nodeText = textNodeTemp.nodeValue;
          }

          // STRONG标签文本
          nodeText += tweetElement.textContent;
          textNodeTemp = tweetElement.nextSibling;

          // 与下一个文本节点的文本连接
          if (textNodeTemp && textNodeTemp.nodeName === '#text') {
            nodeText += textNodeTemp.nodeValue;
          }

          return muteArray.some(muteWord => nodeText.includes(muteWord));
        }
      case MUTE_LINK_TYPE:
        if (FLAG_LIST.mute_link_flag) {
          // "pic.twitter.com"(画像リンク)
          if (tweetElement.hasAttribute('data-pre-embedded')) {
            return muteArray.some(muteWord => tweetElement.textContent.includes(muteWord));
          }
          // not "pic.twitter.com"(サイトリンク)
          else {
            return muteArray.some(muteWord => tweetElement.getAttribute('title').includes(muteWord));
          }
        }

        return false;
      case MUTE_TAG_TYPE:
        return FLAG_LIST.mute_tag_flag && muteArray.some(muteWord => tweetElement.textContent.includes(muteWord));
      case MUTE_ID_TYPE:
        return FLAG_LIST.mute_userId_flag && muteArray.some(muteWord => tweetElement.textContent.includes(muteWord));
    }
  }

  function execAddingMute(targetWord) {
    if (!targetWord) return;

    // 当包含定界符或连续定界符时，将显示错误。
    if (
      targetWord.includes(SPLIT_WORD.repeat(2)) || targetWord === SPLIT_WORD
    ) {
      alert(STRINGS.ngWordErrText);
    } else {
      // 追加ミュート文字の配列の初期化
      ADDED_MUTE_WORD_ARRAY.length = 0;
      // 一時的に格納してアクセスしやすいようにする
      g_muteArrayTemp = [...MUTE_WORDS_ARRAY[g_muteType]];

      targetWord.split(SPLIT_WORD).forEach(addMuteWord);

      // 追加するべき文字がなければ何もしない
      if (!ADDED_MUTE_WORD_ARRAY.length) return;

      // 元のミュート配列と追加する文字配列を結合した配列を新しい配列とする
      MUTE_WORDS_ARRAY[g_muteType] = g_muteArrayTemp.concat(ADDED_MUTE_WORD_ARRAY);
      GM_setValue(g_muteType, MUTE_WORDS_ARRAY[g_muteType].join(SPLIT_WORD));

      // 追加したミュート文字配列のみで全ツイートをミュートチェックする
      g_addFlag = true;
      [].forEach.call(g_streamItems.children, muteTweet);
      g_addFlag = false;

      g_muteInputForm.value = '';
    }
  }
  function addMuteWord(targetWord) {
    if (targetWord) {
      // ミュートの設定にあるor追加済みだった場合
      if (
        g_muteArrayTemp.includes(targetWord) ||
        ADDED_MUTE_WORD_ARRAY.includes(targetWord)
      ) {
       // alert('"' + targetWord + STRINGS.duplicateErrText);
      }
      // どちらにも含まれていない場合
      else {
        ADDED_MUTE_WORD_ARRAY.push(targetWord);
      }
    }
  }

  function execDeletingMute(targetWord) {
    if (!targetWord) return;

    if (
      targetWord.includes(SPLIT_WORD.repeat(2)) || targetWord === SPLIT_WORD
    ) {
      alert(STRINGS.ngWordErrText);
    } else {
      g_muteArrayTemp = [...MUTE_WORDS_ARRAY[g_muteType]];

      // ミュート設定がある場合
      if (g_muteArrayTemp.length) {
        targetWord.split(SPLIT_WORD).forEach(deleteMuteWord);

        if (g_muteArrayTemp.length !== MUTE_WORDS_ARRAY[g_muteType].length) {
          MUTE_WORDS_ARRAY[g_muteType] = [...g_muteArrayTemp];
          GM_setValue(g_muteType, g_muteArrayTemp.join(SPLIT_WORD));

          // ミュート設定を削除したので，全ツイートをミュートチェックする
          g_deleteFlag = true;
          [].forEach.call(g_streamItems.children, muteTweet);
          g_deleteFlag = false;

          g_muteInputForm.value = '';
        }
      }
      // ミュート設定がなければエラー表示をする
      else {
        alert(STRINGS.emptyErrText);
      }
    }
  }
  function deleteMuteWord(targetWord) {
    if (targetWord) {
      if (g_muteArrayTemp.includes(targetWord)) {
        g_muteArrayTemp = g_muteArrayTemp.filter(muteWord =>
          muteWord !== targetWord
        );
      } else {
        alert('"' + targetWord + STRINGS.unmatchedErrText);
      }
    }
  }

  function displayMuteWords() {
    if (MUTE_WORDS_ARRAY[g_muteType].length) {
      alert(MUTE_WORDS_ARRAY[g_muteType].join(' ; '));
    } else {
      alert(STRINGS.emptyErrText);
    }
  }

  function processAddedTweets(mutation) {
    if (!mutation.addedNodes.length) return;

    // ミュート処理
    const nodesList = mutation.addedNodes;
    [].forEach.call(nodesList, muteTweet);

    // 自動読み込みによる追加ではなかった場合，処理を終わる
    if (!g_autoRefreshFlag) return;

    // フラグを下ろす
    g_autoRefreshFlag = false;

    // setTimeoutが待機中であればそれをキャンセルする
    if (g_timeoutId) clearTimeout(g_timeoutId);

    // 高さが0ならば処理を終わる
    if (!g_screenHeight) return;

    let nodeHeightSum = 0;

    [].forEach.call(nodesList, targetNode => {
      nodeHeightSum += targetNode.clientHeight;
    });

    g_screenHeight += (nodeHeightSum - 38);

    g_timeoutId = setTimeout(() => {
      window.scrollTo(0, g_screenHeight);
      g_timeoutId = null;
    }, parseInt(FLAG_LIST.time, 10));
  }

  /**
   * 現在のページが対象のページ(ホーム・検索・リスト)かどうかチェックする．
   * 対象のページではミュートフォームを作ったりミュート処理をしたりする．
   *
   * @return {boolean} 対象のページであればtrue，そうでなければfalse
   */
  function isTargetPage() {
   // return /^https\:\/\/twitter\.com\/(search\?.*?|\w+\/lists\/.+)?$/.test(location.href);
	return true;
  }

  function resetData() {
    Object.keys(FORM_FLAG_LIST).forEach(key => {
      if (FORM_FLAG_LIST[key].length > 1) FORM_FLAG_LIST[key].pop();
    });

    if (g_streamItems) {
      ADDED_TWEET_OBSERVER.disconnect();
    }

    if (g_notifyNewTweetBtn) {
      AUTO_REFRESH_OBSERVER.disconnect();
    }

    if (g_timeoutId) {
      clearTimeout(g_timeoutId);
      g_timeoutId = null;
    }

    const openCloseMute = document.getElementById(OPEN_CLOSE_ID);
    const openCloseTweet = document.getElementById(OPEN_CLOSE_TWEET_ID);
    const muteField = document.getElementById(MUTE_DIV_ID);

    if (openCloseMute) {
      openCloseMute.parentNode.removeChild(openCloseMute);
    }

    if (openCloseTweet) {
      openCloseTweet.parentNode.removeChild(openCloseTweet);
    }

    if (muteField) {
      muteField.parentNode.removeChild(muteField);
    }
  }

  /**
   * 使われなくなった設定を削除する。
   */
  function removeUnusedSetting() {
    if (typeof GM_getValue('background_image_url') !== 'undefined') {
      GM_deleteValue('background_image_url');
    }

    if (typeof GM_getValue('style_flag') !== 'undefined') {
      GM_deleteValue('style_flag');
    }
  }

  function main() {
    // Twitter側の各ノードを取得
    g_pageContainer = document.getElementById('page-container');
    g_timeline = document.getElementById('timeline') || document.querySelector('.GridTimeline');
    g_streamItems = document.getElementById('stream-items-id');
    g_notifyNewTweetBtn = document.querySelector('[class*="stream-item js-new-items-bar-container"]');

    g_homeOrListFlag =
      /^https\:\/\/twitter\.com\/(\w+\/lists\/.+)?$/.test(location.href);

    // ホームならばそれに必要なTwitter側の各ノードを取得
    if (location.href === 'https://twitter.com/') {
      g_tweetBox = document.querySelector('.timeline-tweet-box');
      if (!FLAG_LIST.tweet_box_flag) g_tweetBox.classList.add(VISIBILITY_CLASS);

      g_topBar = document.getElementById('doc').children[0];
      g_pageOuter = document.getElementById('page-outer');
      g_rightDashBoard = g_pageContainer.children[2];

      g_expandTlFlag = false;
    }

    setHeaderAndButton();
    g_muteInputForm = document.getElementById('mLtrForm');

    // フラグリストのそれに対応するノードのセット
    Object.keys(FORM_FLAG_LIST).forEach(key => {
      FORM_FLAG_LIST[key].push(document.getElementById(FORM_FLAG_LIST[key][0]));

      if (GM_getValue(key)) {
        FORM_FLAG_LIST[key][1].classList.add(RADIO_BTN_CLASS);
      }
    });

    ADDED_TWEET_OBSERVER.observe(g_streamItems, { childList: true });

    if (GM_getValue('autoRefresh_flag')) {
      AUTO_REFRESH_OBSERVER.observe(g_notifyNewTweetBtn, { childList: true });
    }

    // 最初は表示された全ツイートに対してミュート処理を行う
    [].forEach.call(g_streamItems.children, muteTweet);
  }

  removeUnusedSetting();

  defineStyles();
  setupCommandMenu();
  initSettings();

  // 対象ページだったらメイン処理を実行
  if (isTargetPage()) main();

  // ページ遷移オブザーバー ----------------------------------------------------
  new MutationObserver(mutations => {
    // 影響範囲を絞るため、MutationRecordが1つの場合のみ処理を行う
    if (mutations.length === 1) {
      // div#doc
      const mutation = mutations[0];

      // 影響範囲を絞るため、変更された属性のローカル名が一致する場合のみ処理を行う
      if (mutation.attributeName === 'aria-hidden') {
        // 属性が変更された要素が、変更された属性を持っている場合＝タイムラインが背面になりツイートなどが最前面になった場合
        if (mutation.target.hasAttribute('aria-hidden')) {
          // 念のため、当該要素の値がtrueの場合のみ処理を行うようにする
          if (mutation.target.getAttribute('aria-hidden')) {
            // 新しいツイートを読み込むための要素が存在している場合
            // (ユーザーページではこの要素が存在しないため場合分けが必要)
            if (g_notifyNewTweetBtn) {
              // 自動更新処理を中断する
              AUTO_REFRESH_OBSERVER.disconnect();
            }

            // ページ自体は遷移していないため、以降のメイン処理を行わないようにする
            return;
          }
        }
        // そうではない場合＝タイムラインが最前面になった場合
        else {
          // 新しいツイートを読み込むための要素が存在している場合
          // (ユーザーページではこの要素が存在しないため場合分けが必要)
          if (g_notifyNewTweetBtn) {
            // 当該要素の要素数が1の場合＝新着ツイートが存在する場合
            // (新着ツイートが存在する場合、当該要素にbutton要素が追加されるため、当該要素の要素数が1となる)
            if (g_notifyNewTweetBtn.childElementCount === 1) {
              g_autoRefreshFlag = true;
              g_screenHeight = window.pageYOffset;
              // 当該要素直下の要素(=button要素)を押下して、新着ツイートの読み込みを行う
            //  g_notifyNewTweetBtn.children[0].click();
            }

            // 自動更新処理を再開する
            AUTO_REFRESH_OBSERVER.observe(g_notifyNewTweetBtn, { childList: true });
          }

          // ページ自体は遷移していないため、以降のメイン処理を行わないようにする
          return;
        }
      }
    }

    if (isTargetPage()) {
      resetData();
      main();
    }
  }).observe(document.getElementById('doc'), { attributes: true });

  // クリックイベントリスナー --------------------------------------------------
  document.addEventListener('click', function(e) {
    const targetNode = e.target;

    switch (targetNode.id) {
      // ミュートフィールドの開閉
      case OPEN_CLOSE_ID:{
        g_muteForm.classList.toggle(VISIBILITY_CLASS);

        const tempFormFlag = !FLAG_LIST.form_flag;
        FLAG_LIST.form_flag = tempFormFlag;
        GM_setValue('form_flag', tempFormFlag);
        break;}
      // ツイート送信フォームの開閉
      case OPEN_CLOSE_TWEET_ID:{
        g_tweetBox.classList.toggle(VISIBILITY_CLASS);

        const tempTbFlag = !FLAG_LIST.tweet_box_flag;
        FLAG_LIST.tweet_box_flag = tempTbFlag;
        GM_setValue('tweet_box_flag', tempTbFlag);
        break;}
      // それぞれのミュート関連ボタン
      case 'mLtrAdd':{
        g_muteType = document.querySelector('[checked]').value;
        execAddingMute(g_muteInputForm.value);
        break;}
      case 'mLtrRmv':{
        g_muteType = document.querySelector('[checked]').value;
        execDeletingMute(g_muteInputForm.value);
        break;}
      case 'mLtrConf':{
        g_muteType = document.querySelector('[checked]').value;
        displayMuteWords();
        break;}
      // その他
      default:{
        // ミュートのラジオボタン
        if (targetNode.getAttribute('name') === 'muteLetter') {
          const checkedRadioButton = document.querySelector('[checked]');

          if (checkedRadioButton) checkedRadioButton.removeAttribute('checked');

          targetNode.setAttribute('checked', 'checked');
        }
        // タイムラインの拡大/縮小
        else if (targetNode.getAttribute('class') && targetNode.getAttribute('class').includes('top-timeline-tweet-box-user-image')) {
          g_timeline.classList.toggle(TL_CLASS);
          g_topBar.classList.toggle(VISIBILITY_CLASS);
          g_pageContainer.classList.toggle(VISIBILITY_CLASS);

          if (g_expandTlFlag) {
            g_pageContainer.insertBefore(g_timeline, g_rightDashBoard);

            if (FLAG_LIST.form_flag) {
              g_muteForm.classList.remove(VISIBILITY_CLASS);
            }
          } else {
            g_pageOuter.insertBefore(g_timeline, g_pageContainer);

            if (!g_muteForm.classList.contains(VISIBILITY_CLASS)) {
              g_muteForm.classList.add(VISIBILITY_CLASS);
            }
          }

          g_expandTlFlag = !g_expandTlFlag;
        }
        break;}
    }
  }, false);
})();

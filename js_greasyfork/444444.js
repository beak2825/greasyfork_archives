// ==UserScript==
// @name         Leetcode 助手
// @namespace    http://tampermonkey.net/
// @homepageURL   https://github.com/h-hg/leetcode-optimization
// @supportURL    https://github.com/h-hg/leetcode-optimization/issues
// @version      0.2.0
// @description  禁英文站跳中文站，增加中英站互跳按钮，删除中英站一些广告，复制题解与描述
// @author       Hunter Hwang
// @license      MIT
// @match        https://leetcode.com/*
// @match        https://leetcode.com/problems/*
// @match        https://leetcode.cn/problems/*
// @icon         https://assets.leetcode.com/static_assets/public/icons/favicon-192x192.png
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_webRequest
// @downloadURL https://update.greasyfork.org/scripts/444444/Leetcode%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/444444/Leetcode%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // function handleCopy(e) {
  //   e.stopPropagation();
  //   const copytext = window.getSelection();
  //   const clipdata = e.clipboardData || window.clipboardData;
  //   if (clipdata) {
  //     clipdata.setData("Text", copytext);
  //   }
  // }
  /**
   * @link https://stackoverflow.com/questions/22125865/wait-until-flag-true
   */
  function waitFor(condition, callback) {
    if (!condition()) {
      window.setTimeout(waitFor.bind(null, condition, callback), 1000);
    } else {
      callback();
    }
  }
  function isLoadFinish() {
    var tag = isCNSite() ? 'nav' : 'img';
    return document.querySelector(tag) != null;
  }
  function isCNSite() {
    return location.hostname === 'leetcode.cn'
  }
  function getProblemName() {
    var tmp = location.href.match(/problems\/([^\/]+)/);
    return (tmp != null && tmp[1] != 'all') ? tmp[1] : null;
  }
  function copyCnSolution(callback) {
    // example: https://leetcode.cn/problems/number-of-matching-subsequences/solutions/1973995/pi-pei-zi-xu-lie-de-dan-ci-shu-by-leetco-vki7/
    var match = location.href.match(/problems\/[^\/]+\/solutions\/[^\/]+\/([^\/]+)/);
    if (match == null)
      return;
    const data = JSON.stringify({
      "query": `query discussTopic($slug: String) {
      solutionArticle(slug: $slug, orderBy: DEFAULT) {
        ...solutionArticle
        content
        next {
          slug
          title
        }
        prev {
          slug
          title
        }
      }
    }

    fragment solutionArticle on SolutionArticleNode {
      ipRegion
      rewardEnabled
      canEditReward
      uuid
      title
      slug
      sunk
      chargeType
      status
      identifier
      canEdit
      canSee
      reactionType
      reactionsV2 {
        count
        reactionType
        }
      tags {
        name
        nameTranslated
        slug
        tagType
      }
      createdAt
      thumbnail
      author {
        username
        isDiscussAdmin
        isDiscussStaff
        profile {
          userAvatar
          userSlug
          realName
          reputation
        }
      }
      summary
      topic {
        id
        subscribed
        commentCount
        viewCount
        post {
          id
          status
          voteStatus
          isOwnPost
        }
      }
      byLeetcode
      isMyFavorite
      isMostPopular
      favoriteCount
      isEditorsPick
      hitCount
      videosInfo {
        videoId
        coverUrl
        duration
      }
    }`,
      "variables": {
        "slug": match[1],
      }
    });
    const response = fetch(
      'https://leetcode.cn/graphql/',
      {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      }
    );
    response.then(res => res.json()).then(d => {
      navigator.clipboard.writeText(d.data.solutionArticle.content)
    })
  }
  function copyEnsolution() {
    // example: https://leetcode.com/problems/median-of-two-sorted-arrays/discuss/2799909/Python-or-Easy-Solution
    var match = location.href.match(/problems\/[^\/]+\/discuss\/([^\/]+)\/[^\/]+/);
    if (match == null)
      return;
    const data = JSON.stringify({
    "operationName":"DiscussTopic",
    "variables":{
      "topicId": parseInt(match[1]),
    },
    "query":`query DiscussTopic($topicId: Int!) {
      topic(id: $topicId) {
        id
        viewCount
        topLevelCommentCount
        subscribed
        title
        pinned
        tags
        hideFromTrending
        post {
          ...DiscussPost
          __typename
        }
        __typename
      }
    }

    fragment DiscussPost on PostNode {
      id
      voteCount
      voteStatus
      content
      updationDate
      creationDate
      status
      isHidden
      coinRewards {
        ...CoinReward
        __typename
      }
      author {
        isDiscussAdmin
        isDiscussStaff
        username
        nameColor
        activeBadge {
          displayName
          icon
          __typename
        }
        profile {
          userAvatar
          reputation
          __typename
        }
        isActive
        __typename
      }
      authorIsModerator
      isOwnPost
      __typename
    }

    fragment CoinReward on ScoreNode {
      id
      score
      description
      date
      __typename
    }`});
    const response = fetch(
      'https://leetcode.com/graphql/',
      {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      }
    );
    response.then(res => res.json()).then(d => {
      navigator.clipboard.writeText(d.data.topic.post.content.replaceAll('\\n', '\n'))
    })
  }
  function copySolution() {
    if (isCNSite())
      copyCnSolution();
    else
      copyEnsolution();
  }
  function copyCnDescription() {
    // example: https://leetcode.cn/problems/number-of-matching-subsequences/description/
    var match = location.href.match(/problems\/([^\/]+)\//);
    if (match == null)
      return;
    const data = JSON.stringify({
      "query": `query questionTranslations($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        translatedTitle
        translatedContent
      }
    }`,
      "variables": {
        "titleSlug": "number-of-matching-subsequences"
      }
    });
    const response = fetch(
      'https://leetcode.cn/graphql/',
      {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      }
    );
    response.then(res => res.json()).then(d => {
      navigator.clipboard.writeText(d.data.question.translatedContent)
    })
  }
  function copyEnDescription() {
    var match = location.href.match(/problems\/([^\/]+)\//);
    if (match == null)
      return;
    const data = JSON.stringify({
      "operationName": "questionData",
      "variables": {
        "titleSlug": match[1],
      },
      "query": `query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
          questionId
          questionFrontendId
          boundTopicId
          title
          titleSlug
          content
          translatedTitle
          translatedContent
          isPaidOnly
          canSeeQuestion
          difficulty
          likes
          dislikes
          isLiked
          similarQuestions
          exampleTestcases
          categoryTitle
          contributors {
            username
            profileUrl
            avatarUrl
            __typename
          }
          topicTags {
            name
            slug
            translatedName
            __typename
          }
          companyTagStats
          codeSnippets {
            lang
            langSlug
            code
            __typename
          }
          stats
          hints
          solution {
            id
            canSeeDetail
            paidOnly
            hasVideoSolution
            paidOnlyVideo
            __typename
          }
          status
          sampleTestCase
          metaData
          judgerAvailable
          judgeType
          mysqlSchemas
          enableRunCode
          enableTestMode
          enableDebugger
          envInfo
          libraryUrl
          adminUrl
          challengeQuestion {
            id
            date
            incompleteChallengeCount
            streakCount
            type
            __typename
          }
          __typename
      }
      }`
    });
    const response = fetch(
      'https://leetcode.com/graphql/',
      {
        method: 'post',
        body: data,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length,
        },
      }
    );
    response.then(res => res.json()).then(d => {
      navigator.clipboard.writeText(d.data.question.content);
    })
  }
  function copyDescription() {
    if(isCNSite())
      copyCnDescription();
    else
      copyEnDescription();
  }
  function getOtherLangUrl() {
    var matchRes = location.href.match(/problems\/([^\/]+)\/?([a-z]+)?/);
    if (matchRes == null || matchRes[1] == 'all')
      return null;
    var problemName = matchRes[1], tab = matchRes[2];

    if (tab == 'discuss') {
      tab = 'comments';
    } else if (tab == 'comments') {
      tab = 'discuss';
    } else if (tab == 'submissions' || tab == 'solution') {
    } else {
      tab = '';
    }
    return `https://leetcode${isCNSite() ? '.com' : '.cn'}/problems/${problemName}/${tab}`
  }
  function banAutoJump2Cn() {
    GM_webRequest([
      { selector: 'https://assets.leetcode.cn/*', action: 'cancel' },
    ], function (info, message, details) {
      console.log(info, message, details);
    });
  }
  function html2elem(html) {
    let template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  }
  function createBall() {
    // add css
    GM_addStyle(`
      .leetcode-wrapper {
        position: fixed;
        top: 30%;
        left: 10px;
        z-index: 1;
      }
      .leetcode-wrapper .btn {
        cursor: move;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        border: 2px solid black;
        opacity: 0.1;
      }
      .leetcode-wrapper:hover .btn {
        background:url(https://leetcode.com/favicon-96x96.png) no-repeat;
        background-size:cover;
        opacity: 0.8;
      }
      .leetcode-wrapper .menu {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 100px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      }
      .leetcode-wrapper:hover .menu {
        display: block;
      }
      .leetcode-wrapper .menu a,
      .leetcode-wrapper .menu button {
        color: black;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        border: none;
        text-align: center;
        background-color: transparent;
        cursor: pointer;
        width: 100%;
      }
      .leetcode-wrapper .menu a:hover,
      .leetcode-wrapper .menu button:hover {
        background-color: #f1f1f1
      }
    `);

    // add html
    var wrapper = html2elem(`
      <div class="leetcode-wrapper">
      <button id="leetcode-btn" class="btn"></button>
        <div class="menu">
          <!-- <a href="", target="_blank"></a> -->
        </div>
      </div>
    `);
    var menu = wrapper.querySelector('.menu');
    waitFor(isLoadFinish, () => {
      // switch to other language
      var link = document.createElement('a');
      link.target = '_blank';
      link.appendChild(document.createTextNode(isCNSite() ? 'English' : '中文'));
      link.href = getOtherLangUrl();
      menu.appendChild(link);
      // copy solution
      var b1 = document.createElement('button')
      b1.textContent = isCNSite() ? '复制题解' : 'Copy discuss';
      b1.onclick = copySolution;
      menu.appendChild(b1)
      // copy problem description
      var b2 = document.createElement('button')
      b2.textContent = isCNSite() ? '复制描述' : 'Copy description';
      b2.onclick = copyDescription;
      menu.appendChild(b2)

      document.body.appendChild(wrapper);
      var btn = document.getElementById('leetcode-btn');
      btn.addEventListener('mouseenter', function (e) {
        menu.firstElementChild.href = getOtherLangUrl();
        // TODO
      })
    })
  }
  // prevent auto jump to leetcode.cn
  if (!isCNSite()) {
    banAutoJump2Cn();
  }

  // AD
  if (isCNSite()) {

  } else {
    GM_addStyle(`
      /* 顶部中文横幅 */
      #cn-banner {
        display: none!important;
      }';
      #region_switcher{
        display: none!important;
      }
      /* 顶部 LeetCode is hiring! Apply Now! */
      .feedback-anchor {
        display: none!important;
      };
    `);
  }

  // problems navigator
  let problemName = getProblemName();
  if (problemName != null) {
    createBall();
  }
  // document.addEventListener("copy", handleCopy, true);
})();

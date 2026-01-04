// ==UserScript==
// @name          Twitter: view more replies and remove useless sections
// @description   View more replies and remove useless sections from twitter
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://twitter.com/*
// @match         *://mobile.twitter.com/*
// @match         *://x.com/*
// @match         *://mobile.x.com/*
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWUlEQVRYhe2WTU4bQRCFv9c2CYso8Swj7HhuEG4QcwLMCWIvcMQOTgA+AexQ7Ej4COQEtk+QyQkyCSBlN4OUVbCnsgCD/xkTUBTJbzfVrXpfdfV0Nyy11D+WHitR/jgqkdW+YB3IYYSgzlU/qf/c8cLheb9WCeKqF08ArDWiCkbu4oN3tIj5m+blvmEHs8YtsbpBLKdNmcKz2qvqYGwEoNCITpE2k8T20kKsNaKKk07SzJURur5tXGXIXdS8AMCNkEpFAOd0mG9e7qdJ6pxSzRPECQT9FbWdwx+K3ynfjL/c9PCGiND6Vj3f8TrTkuaPo5KyaqcBuMtp1bOa17otYGywO4btK6t2vhm3X3+MyhO5MneVpFFPtjVsDpAd+VjhKOnx3iA3ykEp61QqNOPYjI6ZdZUQIFcESw3w/IpgPDYCEEP8EquDDmfkyEmUJZWv1y69OUC8SjwX4EWPIEHfJEJsseVN4z/494c1tgc4FZSewBwz+zotPgKQhdZjGw9pov8TAGHNC4TtPYW7zSjOjQd+bHtHmFUlwkczN+sOTr57AQBk5JLEPovJXfsQaU5rs9OCiSMQOlzsJ5shU+uslpsJMHUFzre9jrD633rLCDP9ZG6eue+BQiOqALtIbx8CYNjG+fb0eyQVwEB+I1pPpPb4ET3fffTSeRCA34jWe3KbwnZJaX597drWfZVPABQ+ReUkISfDl1wRZ4ufiGbdTJ9KOPQESw0Atz2vIL1b1NjEQdqqZwIM5J9EfvKbsokS4EsqDvoviM3sO0YgCNwzWuGUS2appf4b/QHXNfBk6YeX2wAAAABJRU5ErkJggg==
// @version       2.0.11
// @license       MIT
// @require       https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require       https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/429224/Twitter%3A%20view%20more%20replies%20and%20remove%20useless%20sections.user.js
// @updateURL https://update.greasyfork.org/scripts/429224/Twitter%3A%20view%20more%20replies%20and%20remove%20useless%20sections.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //WORKAROUND: TypeError: Failed to set the 'innerHTML' property on 'Element': This document requires 'TrustedHTML' assignment
  if (window.trustedTypes && trustedTypes.createPolicy) {
    if (!trustedTypes.defaultPolicy) {
      const passThroughFn = (x) => x;
      trustedTypes.createPolicy('default', {
        createHTML: passThroughFn,
        createScriptURL: passThroughFn,
        createScript: passThroughFn,
      });
    }
  }

  //Remove filter from sensitive content and secure scrollbars
  var css = `
  /*No filter for sensitive content*/
  .r-yfv4eo {
    filter: none !important;
  }

  /*Make scrollbars always visible*/
  html {
    overflow: auto !important;
  }

  /*Background for "you might like" tweets*/
  .might-like {
    opacity: 0.45 !important;
  }
  `;

  var gm_css = `
  #twitter_view_more_replies * {
    font-family: Roboto, Arial, sans-serif !important;
  }
  #twitter_view_more_replies .config_header {
    font-size: 20px !important;
    font-weight: bold !important;
  }
  #twitter_view_more_replies .field_label {
    font-size: 13px !important;
    font-weight: 400 !important;
  }
  #twitter_view_more_replies input[type="text"] {
    width: 50px !important;
    font-size: 12px !important;
    font-weight: bold !important;
    border-radius: 3px !important;
  }
  #twitter_view_more_replies button {
    font-size: 12px !important;
  }`;

  var gm_frameStyle = `border: 2px solid rgb(0, 0, 0); border-radius: 6px; height: 50%; width: 30%; margin: 0px; max-height: 500px; max-width: 95%; min-height: 300px; min-width: 500px; opacity: 1; overflow: auto; padding: 0px; position: fixed; z-index: 9999; display: block;`;

  GM_config.init({
    id: 'twitter_view_more_replies',
    title: 'Settings for "' + GM_info.script.name + '" script',
    css: gm_css,
    frameStyle: gm_frameStyle,
    fields: {
      'fldShowAddReplies': {
        'label': 'Automatically show additional replies, including those that may contain offensive content',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': true
      },
      'fldHideTabExplore': {
        'label': 'Hide "Explore" tab in left column',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': false
      },
      'fldHideTrends4You': {
        'label': 'Hide "Trends for you" section in timeline and tweet (right column)',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': true
      },
      'fldHideRelevantPeople': {
        'label': 'Hide the list of relevant people in tweet replies (right column)',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': false
      },
      'fldHideAnalytics': {
        'label': 'Hide tweet analytics in timeline and tweet replies (except the active tweet itself)',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': true
      },
      'fldHideSeeMore': {
        'label': 'Hide "see more tweets" dialog if you do not log in',
        'labelPos': 'above',
        'type': 'checkbox',
        'default': true
      },
      'fldYouMightLike': {
        'options': ['  Do nothing', '  Make less visible', '  Hide'],
        'label': '<br>"You might like" tweets in the timeline',
        'type': 'radio',
        'default': '  Make less visible'
      }
    }
  })

  GM_registerMenuCommand('Settings', () => {
    GM_config.open();
  })

  const rootCallback = function (mutationsList, observer) {
    //==== Hide inline promtps :: timeline
    $( "div[data-testid='cellInnerDiv'] > div > div > div > div[data-testid='inlinePrompt']" ).parent().parent().parent().parent().hide(); //any language

    //==== Hide sensitive content warning :: timeline and tweet - make language dependant in order not to hide "watch again"
    //$( "article div:not([role='button']) > div[role='button'][tabindex='0'][style^='backdrop-filter: blur']" ).parent().parent().hide(); //any language

    //==== Hide tweet analytics :: timeline and tweet replies (except the active tweet itself)
    if (GM_config.fields['fldHideAnalytics'].value) {
      //Full icon with number of views
      $( "div[data-testid='cellInnerDiv'] article:not([tabindex='-1']) a[href$='/analytics'][role='link']" ).parent().hide(); //any language
      //Grey svg icon under retweeted tweets
      $( "div[data-testid='cellInnerDiv'] article:not([tabindex='-1']) div[aria-label='View Tweet analytics'][role='button']" ).parent().hide(); //en
      $( "div[data-testid='cellInnerDiv'] article:not([tabindex='-1']) div[aria-label='Переглянути аналітику твіта'][role='button']" ).parent().hide(); //uk
      $( "div[data-testid='cellInnerDiv'] article:not([tabindex='-1']) div[aria-label='查看推文分析'][role='button']" ).parent().hide(); //zh
      //$( "div[data-testid='cellInnerDiv'] article:not([tabindex='-1']) div[aria-label='查看推文分析'][role='button']" ).parent().hide(); //zh - traditional - the same text as zh
      $( "div[data-testid='cellInnerDiv'] article:not([tabindex='-1']) div[aria-label='Ver estadísticas del Tweet'][role='button']" ).parent().hide(); //es
      $( "div[data-testid='cellInnerDiv'] article:not([tabindex='-1']) div[aria-label='Voir les statistiques des Tweets'][role='button']" ).parent().hide(); //fr
      $( "div[data-testid='cellInnerDiv'] article:not([tabindex='-1']) div[aria-label='ツイートアナリティクスを表示'][role='button']" ).parent().hide(); //ja
    }

    //==== Hide "see more tweets" dialog if you do not log in :: everywhere
    if (GM_config.fields['fldHideSeeMore'].value) {
      $( "div[data-testid='sheetDialog'] div > div > span > a[href='/signup']" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //any language
    }

    //==== Mark "You might like" tweets :: timeline only
    if (window.location.href.indexOf("twitter.com/home") > 0) {
      if (GM_config.fields['fldYouMightLike'].value == '  Make less visible') {
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('You might like')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().addClass("might-like"); //en
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('Вам може сподобатись')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().addClass("might-like"); //uk
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('你可能会喜欢')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().addClass("might-like"); //zh
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('你可能會喜歡')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().addClass("might-like"); //zh-traditional
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('Tal vez te guste')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().addClass("might-like"); //es
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('Vous pourriez aimer')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().addClass("might-like"); //fr
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('あなたへのおすすめ')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().addClass("might-like"); //ja

      } else if (GM_config.fields['fldYouMightLike'].value == '  Hide') {
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('You might like')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //en
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('Вам може сподобатись')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //uk
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('你可能会喜欢')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //zh
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('你可能會喜歡')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //zh-traditional
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('Tal vez te guste')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //es
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('Vous pourriez aimer')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //fr
        $( "div[data-testid='cellInnerDiv'] div[style='-webkit-line-clamp: 2;'][data-testid='socialContext'] > span > span:contains('あなたへのおすすめ')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //ja
      }
    }

    //==== Click "Show replies" button :: tweet
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > div > span:contains('Show replies')" ).click(); //en
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > div > span:contains('Показати відповіді')" ).click(); //uk
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > div > span:contains('显示回复')" ).click(); //zh
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > div > span:contains('顯示回覆')" ).click(); //zh-traditional
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > div > span:contains('Mostrar respuestas')" ).click(); //es
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > div > span:contains('Voir les réponses')" ).click(); //fr
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > div > span:contains('返信を表示')" ).click(); //ja
    //==== Click "Show replies" button :: tweet - v2
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > div > span:contains('Show replies')" ).click(); //en
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > div > span:contains('Показати відповіді')" ).click(); //uk
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > div > span:contains('显示回复')" ).click(); //zh
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > div > span:contains('顯示回覆')" ).click(); //zh-traditional
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > div > span:contains('Mostrar respuestas')" ).click(); //es
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > div > span:contains('Voir les réponses')" ).click(); //fr
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > div > span:contains('返信を表示')" ).click(); //ja

    //==== Click "Show more replies" button :: tweet
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > span:contains('Show more replies')" ).click(); //en
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > span:contains('Показати більше відповідей')" ).click(); //uk
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > span:contains('显示更多回复')" ).click(); //zh
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > span:contains('顯示更多回覆')" ).click(); //zh-traditional
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > span:contains('Mostrar más respuestas')" ).click(); //es
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > span:contains('Voir plus de réponses')" ).click(); //fr
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'] > div > div > span:contains('返信をさらに表示')" ).click(); //ja
    //==== Click "Show more replies" button :: tweet - v2
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > span:contains('Show more replies')" ).click(); //en
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > span:contains('Показати більше відповідей')" ).click(); //uk
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > span:contains('显示更多回复')" ).click(); //zh
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > span:contains('顯示更多回覆')" ).click(); //zh-traditional
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > span:contains('Mostrar más respuestas')" ).click(); //es
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > span:contains('Voir plus de réponses')" ).click(); //fr
    $( "div[data-testid='primaryColumn'] button[role='button'] > div > div > span:contains('返信をさらに表示')" ).click(); //ja

    if (GM_config.fields['fldShowAddReplies'].value) {
      //==== Click "Show additional replies, including those that may contain offensive content" button :: tweet
      $( "div[data-testid='primaryColumn'] article button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('Show')" ).click(); //en. "not blur" condition - to avoid click on "show sensitive content" button, as it hangs browser with Japanese interface; "not aria-label" - to avoid automatic redirection to communities in browser with Japanese interface
      $( "div[data-testid='primaryColumn'] article button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('Показати')" ).click(); //uk
      $( "div[data-testid='primaryColumn'] article button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('显示')" ).click(); //zh
      $( "div[data-testid='primaryColumn'] article button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('顯示')" ).click(); //zh-traditional
      $( "div[data-testid='primaryColumn'] article button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('Mostrar')" ).click(); //es
      $( "div[data-testid='primaryColumn'] article button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('Voir')" ).click(); //fr
      $( "div[data-testid='primaryColumn'] article button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('表示')" ).click(); //ja

      //==== Click "Show probable spam" button :: tweet
      $( "div[data-testid='primaryColumn'] section[role='region'] button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > div > span:contains('Show probable spam')" ).click(); //en. "not blur" condition - to avoid click on "show sensitive content" button, as it hangs browser with Japanese interface; "not aria-label" - to avoid automatic redirection to communities in browser with Japanese interface
      $( "div[data-testid='primaryColumn'] section[role='region'] button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > div > span:contains('Показати ймовірний спам')" ).click(); //uk
      $( "div[data-testid='primaryColumn'] section[role='region'] button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > div > span:contains('显示可能的垃圾信息')" ).click(); //zh
      $( "div[data-testid='primaryColumn'] section[role='region'] button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > div > span:contains('顯示可能的垃圾訊息')" ).click(); //zh-traditional
      $( "div[data-testid='primaryColumn'] section[role='region'] button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > div > span:contains('Mostrar instancia de probable spam')" ).click(); //es
      $( "div[data-testid='primaryColumn'] section[role='region'] button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > div > span:contains('Afficher un spam probable')" ).click(); //fr
      $( "div[data-testid='primaryColumn'] section[role='region'] button[role='button']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > div > span:contains('スパムの可能性がある返信を表示')" ).click(); //ja
    }

    //==== Click "The following media includes potentially sensitive content" button :: timeline and tweet
    //Disabled because it shows the tweets from blocked users too. Must be refined
//    $( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('View')" ).click(); //en. "not blur" condition - to avoid click on "show sensitive content" button, as it hangs browser with Japanese interface; "not aria-label" - to avoid automatic redirection to communities in browser with Japanese interface
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('Показати')" ).click(); //uk
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('显示')" ).click(); //zh
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('顯示')" ).click(); //zh-traditional
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('Mostrar')" ).click(); //es
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('Voir')" ).click(); //fr
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('表示')" ).click(); //ja

    //==== Click "Visibility limited: hateful conduct" :: replies
    //https://twitter.com/afinotakingsley/status/1665983992288477184
    $( "div[data-testid='primaryColumn'] article a[role='link'] > div > span > span:contains('View')" ).click(); //en

    //==== Click "Caution: This profile may include potentially sensitive content" button :: profile
    //https://twitter.com/Olliewildwings
    $( "div[data-testid='primaryColumn'] div[role='button'][tabindex='0'][data-testid='empty_state_button_text']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('Yes, view profile')" ).click(); //en. "not blur" condition - to avoid click on "show sensitive content" button, as it hangs browser with Japanese interface; "not aria-label" - to avoid automatic redirection to communities in browser with Japanese interface
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('Показати')" ).click(); //uk
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('显示')" ).click(); //zh
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('顯示')" ).click(); //zh-traditional
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('Mostrar')" ).click(); //es
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('Voir')" ).click(); //fr
    //$( "div[data-testid='primaryColumn'] article div[role='button'][tabindex='0']:not([style^='backdrop-filter: blur']):not([aria-label]) > div > span > span:contains('表示')" ).click(); //ja

    //==== Hide tab "# Explore" (left column)
    if (GM_config.fields['fldHideTabExplore'].value) {
      $( "header nav[role='navigation'] > a[href='/explore']" ).hide();
    }

    //==== Hide section "Who to follow" :: timeline (right column)
    $( "aside[aria-label='Who to follow']" ).parent().hide(); //en
    $( "aside[aria-label='Рекомендовані']" ).parent().hide(); //uk
    $( "aside[aria-label='推荐关注']" ).parent().hide(); //zh
    $( "aside[aria-label='跟隨誰']" ).parent().hide(); //zh-traditional
    $( "aside[aria-label='A quién seguir']" ).parent().hide(); //es
    $( "aside[aria-label='Suggestions']" ).parent().hide(); //fr
    $( "aside[aria-label='おすすめユーザー']" ).parent().hide(); //ja

    //==== Hide section "Who to follow" :: user profile
    $( "div > div > h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('Who to follow')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //en
    $( "div > div > h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('Рекомендації')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //uk
    $( "div > div > h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('推荐关注')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //zh
    $( "div > div > h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('跟隨誰')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //zh-traditional
    $( "div > div > h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('A quién seguir')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //es
    $( "div > div > h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('Qui suivre')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //fr
    $( "div > div > h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('おすすめユーザー')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //ja

    //==== Hide section "Relevant people" :: tweet (right column)
    if (GM_config.fields['fldHideRelevantPeople'].value) {
      $( "div > aside[aria-label='Relevant people']" ).parent().hide(); //en
      $( "div > aside[aria-label='Пов’язані люди']" ).parent().hide(); //uk
      $( "div > aside[aria-label='相关用户']" ).parent().hide(); //zh
      $( "div > aside[aria-label='相關人士']" ).parent().hide(); //zh-traditional
      $( "div > aside[aria-label='Personas relevantes']" ).parent().hide(); //es
      $( "div > aside[aria-label='Personnes pertinentes']" ).parent().hide(); //fr
      $( "div > aside[aria-label='関連性の高いアカウント']" ).parent().hide(); //ja
    }

    //==== Hide section "Trends for you" :: timeline and tweet (right column)
    if (GM_config.fields['fldHideTrends4You'].value) {
      $( "section[role='region'] > div[aria-label='Timeline: Trending now']" ).parent().parent().hide(); //en
      $( "section[role='region'] > div[aria-label='Стрічка: Актуальне зараз']" ).parent().parent().hide(); //uk
      $( "section[role='region'] > div[aria-label='时间线：当前趋势']" ).parent().parent().hide(); //zh
      $( "section[role='region'] > div[aria-label='時間軸：流行趨勢']" ).parent().parent().hide(); //zh-traditional
      $( "section[role='region'] > div[aria-label='Cronología: Tendencias del momento']" ).parent().parent().hide(); //es
      $( "section[role='region'] > div[aria-label='Fil d\'actualités : Tendance actuellement']" ).parent().parent().hide(); //fr
      $( "section[role='region'] > div[aria-label='タイムライン: トレンド']" ).parent().parent().hide(); //ja
    }

    //==== Hide section "What's happening" :: timeline (right column)
    $( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('What's happening')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //en
    //$( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //uk - not found
    //$( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //zh - not found
    //$( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //zh-traditional - not found
    $( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Qué está pasando')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //es
    //$( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //fr - not found
    $( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('いまどうしてる？')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //ja

    //==== Hide section "Discover more" :: tweet
    $( "div[data-testid='cellInnerDiv'] h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('Discover more')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide(); //en
    $( "div[data-testid='cellInnerDiv'] h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('Дізнавайтеся більше')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide(); //uk
    $( "div[data-testid='cellInnerDiv'] h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('发现更多')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide(); //zh
    $( "div[data-testid='cellInnerDiv'] h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('探索更多')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide(); //zh-traditional
    $( "div[data-testid='cellInnerDiv'] h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('Descubre más')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide(); //es
    $( "div[data-testid='cellInnerDiv'] h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('Découvrez plus')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide(); //fr
    $( "div[data-testid='cellInnerDiv'] h2 > div[style^='-webkit-line-clamp: 3;'] > span:contains('もっと見つける')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide(); //ja

    //==== Hide section "More tweets" :: tweet - when you do not log in. Seems twitter has only English interface in this case
    $( "div[data-testid='cellInnerDiv'] h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('More Tweets')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //en
    //$( "div[data-testid='cellInnerDiv'] h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Дізнавайтеся більше')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //uk
    //$( "div[data-testid='cellInnerDiv'] h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('发现更多')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //zh
    //$( "div[data-testid='cellInnerDiv'] h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('探索更多')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //zh-traditional
    //$( "div[data-testid='cellInnerDiv'] h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Descubre más')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //es
    //$( "div[data-testid='cellInnerDiv'] h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Découvrez plus')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //fr
    //$( "div[data-testid='cellInnerDiv'] h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('もっと見つける')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //ja

    //==== Hide section "Trends for you" :: explore
    $( "div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Trends for you')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //en
    $( "div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Тренди для вас')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //uk
    $( "div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('你的趋势')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //zh
    $( "div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('你的流行趨勢')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //zh-traditional
    $( "div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Tendencias para ti')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //es
    $( "div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Tendances pour vous')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //fr
    //$( "div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //ja - not found

    //==== Hide message "You seem to be in a new location" :: explore
    $( "div > div > div > div > div > h1 > span:contains('You seem to be in a new location')" ).parent().parent().parent().parent().parent().parent().hide(); //en
    $( "div > div > div > div > div > h1 > span:contains('Схоже, ви перебуваєте в новому місці')" ).parent().parent().parent().parent().parent().parent().hide(); //uk
    $( "div > div > div > div > div > h1 > span:contains('你似乎到了一个新位置')" ).parent().parent().parent().parent().parent().parent().hide(); //zh
    $( "div > div > div > div > div > h1 > span:contains('你似乎位於新的位置')" ).parent().parent().parent().parent().parent().parent().hide(); //zh-traditional
    $( "div > div > div > div > div > h1 > span:contains('Parece que estás en una nueva ubicación')" ).parent().parent().parent().parent().parent().parent().hide(); //es
    $( "div > div > div > div > div > h1 > span:contains('Vous semblez vous trouver dans un nouveau lieu')" ).parent().parent().parent().parent().parent().parent().hide(); //fr
    //$( "div > div > div > div > div > h1 > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide(); //ja - not found

    //==== Hide section "Topics to follow" :: user profile
    $( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Topic to follow')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //en
    //$( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //uk - not found
    $( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('要关注的话题')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //zh
    $( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('可跟隨的主題')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //zh-traditional
    $( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Temas para seguir')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //es
    $( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Sujets à suivre')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //fr
    $( "div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('おすすめトピック')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //ja

    //==== Hide section "Suggested topics" :: more -> topics
    $( "div[style='-webkit-line-clamp: 3;'] > span:contains('Suggested Topics')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //en
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //uk - not found
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //zh - not found
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //zh-traditional - not found
    $( "div[style='-webkit-line-clamp: 3;'] > span:contains('Temas sugeridos')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //es
    $( "div[style='-webkit-line-clamp: 3;'] > span:contains('Sujets suggérés')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //fr
    $( "div[style='-webkit-line-clamp: 3;'] > span:contains('おすすめトピック')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //ja

    //==== Hide section "Discover new Lists" :: lists
    $( "div[style='-webkit-line-clamp: 3;'] > span:contains('Discover new Lists')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //en
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //uk - not found
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //zh - not found
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //zh-traditional - not found
    $( "div[style='-webkit-line-clamp: 3;'] > span:contains('Descubre Listas nuevas')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //es
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //fr - not found
    $( "div[style='-webkit-line-clamp: 3;'] > span:contains('新しいリストを見つける')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //ja

    //==== Hide section "Expand your timeline with Topics" :: timeline
    $( "div[style='-webkit-line-clamp: 3;'] > span:contains('Expand your timeline with Topics')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //en
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //uk - not found
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //zh - not found
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //zh-traditional - not found
    $( "div[style='-webkit-line-clamp: 3;'] > span:contains('Amplía tu cronología con Temas')" ).parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide(); //es
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //fr - not found
    //$( "div[style='-webkit-line-clamp: 3;'] > span:contains('???')" ).parent().parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide(); //ja - not found

    //==== Hide message "Concerned about your digital security?" :: timeline
    $( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('Concerned about your digital security?')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //en
    $( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('Є сумніви щодо цифрової безпеки?')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //uk
    //$( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //zh - not found
    //$( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //zh-traditional - not found
    //$( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //es - not found
    //$( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //fr - not found
    //$( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //ja - not found

    //==== Hide button "Open app" :: tweet on mobile browser
    $( "div[aria-label='Open app']" ).parent().hide(); //en
    $( "div[aria-label='Відкрити додаток']" ).parent().hide(); //uk
    $( "div[aria-label='打开应用']" ).parent().hide(); //zh
    $( "div[aria-label='開啟應用程式']" ).parent().hide(); //zh-traditional
    $( "div[aria-label='Abrir aplicación']" ).parent().hide(); //es
    $( "div[aria-label='Ouvrir l\'application']" ).parent().hide(); //fr
    //$( "div[aria-label='???']" ).parent().hide(); //ja - not found

    //==== Hide button "Get the app" :: timeline on mobile browser
    $( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('Get the app')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //en
    //$( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //uk - not found
    //$( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //zh - not found
    //$( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //zh-traditional - not found
    //$( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('???')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //es - not found
    $( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('Ouvrir l\'application')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //fr
    $( "div[data-testid='inlinePrompt'] > h1[role='heading'] > span > span > span:contains('アプリを開く')" ).parent().parent().parent().parent().parent().parent().parent().hide().next().hide(); //ja

    //==== Hide button "Get the app" :: tweet on mobile browser
    $( "div > div > div[role='button'][aria-label='Get the app']" ).parent().parent().hide(); //en
    //$( "div > div > div[role='button'][aria-label='???']" ).parent().parent().hide(); //uk - not found
    //$( "div > div > div[role='button'][aria-label='???']" ).parent().parent().hide(); //zh - not found
    //$( "div > div > div[role='button'][aria-label='???']" ).parent().parent().hide(); //zh-traditional - not found
    //$( "div > div > div[role='button'][aria-label='???']" ).parent().parent().hide(); //es - not found
    $( "div > div > div[role='button'][aria-label='Ouvrir l\'application']" ).parent().parent().hide(); //fr
    $( "div > div > div[role='button'][aria-label='アプリを開く']" ).parent().parent().hide(); //ja

    //==== Hide tweet "Promoted" :: timeline
    $( "div[data-testid='placementTracking'] > div > article > div > div > div > div > div > div > div > div > div > span:contains('Promoted')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //en
    $( "div[data-testid='placementTracking'] > div > article > div > div > div > div > div > div > div > div > div > span:contains('Реклама')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //uk
    $( "div[data-testid='placementTracking'] > div > article > div > div > div > div > div > div > div > div > div > span:contains('推荐')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //zh
    $( "div[data-testid='placementTracking'] > div > article > div > div > div > div > div > div > div > div > div > span:contains('推廣')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //zh-traditional
    $( "div[data-testid='placementTracking'] > div > article > div > div > div > div > div > div > div > div > div > span:contains('Promocionado')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //es
    $( "div[data-testid='placementTracking'] > div > article > div > div > div > div > div > div > div > div > div > span:contains('Sponsorisé')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //fr - not found
    $( "div[data-testid='placementTracking'] > div > article > div > div > div > div > div > div > div > div > div > span:contains('プロモーション')" ).parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().parent().hide(); //ja - not found

    //==== Hide tweet "Promoted Tweet" :: user profile
    $( "div[data-testid='cellInnerDiv'] > div > div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Promoted Tweet')" ).parent().parent().parent().parent().parent().parent().hide(); //en
    $( "div[data-testid='cellInnerDiv'] > div > div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Рекламований твіт')" ).parent().parent().parent().parent().parent().parent().hide(); //uk
    $( "div[data-testid='cellInnerDiv'] > div > div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('推广推文')" ).parent().parent().parent().parent().parent().parent().hide(); //zh
    $( "div[data-testid='cellInnerDiv'] > div > div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('推廣推文')" ).parent().parent().parent().parent().parent().parent().hide(); //zh-traditional
    $( "div[data-testid='cellInnerDiv'] > div > div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Tweet promocionado')" ).parent().parent().parent().parent().parent().parent().hide(); //es
    $( "div[data-testid='cellInnerDiv'] > div > div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('Tweet sponsorisé')" ).parent().parent().parent().parent().parent().parent().hide(); //fr
    $( "div[data-testid='cellInnerDiv'] > div > div > div > h2 > div[style='-webkit-line-clamp: 3;'] > span:contains('プロモツイート')" ).parent().parent().parent().parent().parent().parent().hide(); //ja - not found

  };

  const rootNode = document.querySelector("#react-root");
  if (rootNode != null) {
    const rootObserver = new MutationObserver(rootCallback);
    rootObserver.observe(rootNode, {childList: true, subtree: true, attributes: false, characterData: false});
  }

  if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
  } else if (typeof addStyle != 'undefined') {
    addStyle(css);
  } else {
    var node = document.createElement('style');
    node.type = 'text/css';
    node.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(node);
  }

})();

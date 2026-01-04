// ==UserScript==
// @name            MiaouDTC - DansTonChat.com
// @name:fr         MiaouDTC - DansTonChat.com
// @namespace       jlgrall_UserScripts
// @version         1.8
// @description     Improves browsing of quotes and comments on DansTonChat.com (also known as DTC). Miaou... Miaou... MiaouDTC
// @description:fr  Améliore la navigation des quotes et des commentaires sur DansTonChat.com (DTC pour les intimes). Miaou... Miaou... MiaouDTC
// @homepage        https://greasyfork.org/en/scripts/369900-miaoudtc-danstonchat-com
// @supportURL      https://greasyfork.org/en/scripts/369900-miaoudtc-danstonchat-com/feedback
// @contributionURL https://www.tipeee.com/danstonchat
// @author          jlgrall
// @license         MIT License
// @match           https://danstonchat.com/*
// @exclude         https://danstonchat.com/user/login*
// @exclude         https://danstonchat.com/myaccount*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/369900/MiaouDTC%20-%20DansTonChatcom.user.js
// @updateURL https://update.greasyfork.org/scripts/369900/MiaouDTC%20-%20DansTonChatcom.meta.js
// ==/UserScript==

(function($, undefined) {
  'use strict';
  
  var $empty = $();
  
  var Miaou = window.Miaou = {
    // CSS rules:
    styleContent: [
      // GENERAL:
      'div.cls-cookie { display: none; }',
      '.contenu h1.miaouH1Search { cursor: pointer; }',
      '.item .item-content .decoration a.miaouPseudoLink { display: unset; max-width: unset; }',
      '.item .item-content .decoration a.miaouPseudoLink:hover { text-decoration: underline; }',
      
      // Pseudos:
      '.item .item-content .decoration.miaouPseudo-similarColor { margin-left: -4px; border-left: 4px solid red; }',
      
      // scoreRatio:
      'span.miaouScoreRatio { float: left; margin-left: -20px; }',
      
      // miaouComments Header:
      '.miaouComments-header { float: left; background: #ddd; }',
      '.miaouComments-header > span,',
      '.miaouComments-header > a { padding: 11px 10px 12px; font-size: 1.1em; _font-weight: bold; display: inline-block; color: #222; }',
      '.miaouComments-header > a:hover { background: #ccc; }',
      '@media (max-width: 530px) {',
      '  .miaouComments-header > a { text-indent: -9999px; line-height: 0; }', // Idea from: https://stackoverflow.com/questions/7896402/how-can-i-replace-text-with-css/22054588#22054588
      '  .miaouComments-header > a:after { content: "Comms"; text-indent: 0; line-height: initial; display: block; }',
      '}',
      '@media (max-width: 350px) {',
      '  .miaouComments-header > a { padding: 5px; }',
      '  .miaouComments-header > a:after { content: "C"; font-size: 1.4em; }',
      '}',
      
      // Toggle between buttons 'a.miaouComments-showComments' and 'a.miaouComments-hideComments':
      '.miaouItem:not(.miaouComments-hide) a.miaouComments-showComments,',
      '.miaouItem.miaouComments-hide a.miaouComments-hideComments { display: none; }',
      // Toggle text 'span.miaouComments-loadingComments':
      '.miaouItem.miaouComments-hide span.miaouComments-loadingComments { display: none; }',
      '.miaouItem:not(.miaouComments-hide):not(.miaouComments-loading) span.miaouComments-loadingComments { display: none; }',
      '.miaouItem.miaouComments-loading a.miaouComments-hideComments { display: none; }',
      
      // Highlight available Captain Obvious explanations:
      '.show_explanation { background: rgba(255, 255, 153, .6); }',
      '.miaouComments-body .explanation-text { background: rgba(255, 255, 153, .6); padding: 0 6px; }',
      '.miaouComments-body .explanation-text h2 { margin-top: 0; }',
      
      // miaouComments Wrapper and Body:
      '.miaouComments-wrapper { border-left: 10px solid #ddd; border-bottom: 10px solid #ddd; padding-left: 6px; }',
      '.miaouComments-body { max-height: 500px; overflow: auto; resize: vertical; padding-top: 6px; }',
      '.miaouComments-body:empty { display: none; }',
      '@media (max-height: 660px) { .miaouComments-body { max-height: 74vh; } }',
      '@media (max-height: 570px) { .miaouComments-body { max-height: 68vh; } }',
      '@media (max-height: 480px) { .miaouComments-body { max-height: 60vh; } }',
      '.miaouItem.miaouComments-hide .miaouComments-wrapper { display: none; }',
      
      // Linkified quotes:
      '.item-content a.miaou-linkifiedQuoteRef { display: unset; max-width: unset; color: #8cbd6a; }',
      '.item-content a.miaou-linkifiedQuoteRef:hover { color: #add095; }',
    ],
    
    // Comments loading states:
    COMMENTS_UNLOADED: 0,
    COMMENTS_LOADING: 1,
    COMMENTS_LOADED: 2,
    COMMENTS_ERROR: 3,
    getCommentsStateForItem: function($item) {
      var state = $item.data('data-miaou-commentsState');
      return state === undefined ? Miaou.COMMENTS_UNLOADED : state;
    },
    setCommentsStateForItem: function($item, state) {
      $item.data('data-miaou-commentsState', state);
    },
    
    rawPseudoToPseudo: {},
    pseudoToColor: {},
    pseudoToLink: {},
    
    itemsById: {},
    extractItemId: function($item) { // itemId is always a string (it should not be converted to a number)
      var item = $item[0];
      for (var i = 0; i < item.classList.length; i++) {
        var name = item.classList.item(i);
        if (name !== 'item') {
          var match = name.match(/^item(\d{1,9})$/);
          if (match) return match[1];
        }
      }
      return undefined;
    },
    initItem: function($item) {
      var itemId = Miaou.extractItemId($item);
      var itemURL = ($item.find('div.meta-infos span.comments > a').attr('href') || '').split('#')[0];
      var $score = $item.find('span.score');
      var scoreMatch = $score.text().match(/(\d{1,6})\s*\/\s*(\d{1,6})/);
      var scoreRatio = scoreMatch ? (scoreMatch[1] / scoreMatch[2]).toFixed(1) : NaN;
      var nbComments = parseInt($item.find('span.comments').text(), 10);
      
      Miaou.itemsById[itemId] = (Miaou.itemsById[itemId] || $empty).add($item);
      
      var $scoreRatio = $('<span class="miaouScoreRatio"> = ' + scoreRatio + '</span>');
      
      $item.data({
        'miaou-itemId': itemId,
        'miaou-itemURL': itemURL,
        'miaou-nbComments': nbComments,
        'miaou-$scoreRatio': $scoreRatio,
      });
      
      $item.addClass('miaouItem miaouItem' + itemId);
      
      Miaou._initItemPseudos($item);
      
      $scoreRatio.insertAfter($score);
      
      if (Miaou.pageHasItemsList) {
        Miaou._initItemComments($item);
      }
      else {
        $item.find('.item-content > a:not(.img)').replaceWith(function() {
          return this.childNodes;
        });
      }
      
      return $item;
    },
    _initItemPseudos: function($item) {
      var pseudoToItem$Els = {};
      $item.find('.item-content span.decoration').each(function(i, el) {
        var $el = $(el);
        var rawPseudo = $el.text();
        var pseudo = Miaou.rawPseudoToPseudo[rawPseudo];
        
        if (!(rawPseudo in Miaou.rawPseudoToPseudo)) {
          // Previous regex: replace(/^(?:\s|\*|\[[\d:h.]+\]|<[+@]?)+|(?:>|:|dit|\s)+$/g, '')
          pseudo = rawPseudo
            .replace(/^(?:\s|\*|\[[\d:h.]+\])+|(?::|dit|\s)+$/g, '')
            .replace(/^<[+@]?(.*)>$|^\[[+@]?(.*)\]$|^\((.*)\)$/g, '$1$2$3')
            .trim();
          if (pseudo === '') pseudo = undefined;
          Miaou.rawPseudoToPseudo[rawPseudo] = pseudo;
        }
        
        if (pseudo) {
          pseudoToItem$Els[pseudo] = (pseudoToItem$Els[pseudo] || $empty).add($el);
          
          if (!(pseudo in Miaou.pseudoToColor)) {
            var match = el.style.backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            var color = match ? [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)] : undefined;
            Miaou.pseudoToColor[pseudo] = color;
          }
          
          var link = Miaou.pseudoToLink[pseudo];
          if (!link) {
            var url = '/search.html?search=' + encodeURIComponent(pseudo);
            link = Miaou.pseudoToLink[pseudo] = $('<a href="' + url + '" target="_blank" class="miaouPseudoLink"></a>');
          }
          $el.wrapInner(link.clone(true));
        }
      });
      
      // Compare pseudos colors and group them by similarity:
      var setOfSimilarSets = new Set();
      var pseudos = Object.keys(pseudoToItem$Els);
      for (var i = 0; i < pseudos.length; i++) {
        var p1 = pseudos[i];
        var c1 = Miaou.pseudoToColor[p1];
        for (var j = i + 1; j < pseudos.length; j++) {
          var p2 = pseudos[j];
          var c2 = Miaou.pseudoToColor[p2];
          var dist = Miaou.colorDistance(c1, c2);
          if (Miaou.debugColors) {
            var _c1 = pseudoToItem$Els[p1][0].style.backgroundColor;
            var _c2 = pseudoToItem$Els[p2][0].style.backgroundColor;
            console.log(
              "Color distance: %c" + dist.toFixed(2) + "%c '%c" + p1 + "%c' '%c" + p2 + "%c'",
              dist < Miaou.minColorDistance ? "color: red" : "", "",
              "color: black; font-weight: bold; background-color: " + _c1, "",
              "color: black; font-weight: bold; background-color: " + _c2, ""
            );
          }
          if (dist < Miaou.minColorDistance) {
            var foundSet = undefined;
            for (var similarSet of setOfSimilarSets) {
              if (similarSet.has(p1) || similarSet.has(p2)) {
                if (!foundSet) {
                  foundSet = similarSet;
                }
                else {  // Merge set with previously found set:
                  setOfSimilarSets.delete(similarSet);
                  similarSet.forEach(v => foundSet.add(v));
                }
                similarSet.add(p1).add(p2);
              }
            }
            if (!foundSet) setOfSimilarSets.add(new Set([p1, p2]));
          }
        }
      }
      
      // Add additional distinct colors to each set of similar pseudos:
      setOfSimilarSets.forEach(function(similarSet) {
        // For pseudos, DTC uses: hsv(X, 15, 95) converted to rgb.
        // We will use the CSS available: hsl(...) (Note that h is an angle so it wraps around)
        var bg = Miaou.pseudoToColor[similarSet.values().next().value];
        var h = Miaou.rgbToHsl(bg)[0];
        var step = 360 / (similarSet.size + 1);
        for (var pseudo of similarSet) {
          h += step;
          pseudoToItem$Els[pseudo].addClass("miaouPseudo-similarColor")
            .css("border-left-color", "hsl(" + Math.round(h) + ", 75%, 66%)");
        }
      });
      
      return $item;
    },
    _initItemComments: function($item) {
      var $commentsHeader = $('<div class="miaouComments-header"></div>');
      var $commentsWrapper = $('<div class="miaouComments-wrapper"></div>');
      var $commentsBody = $('<div class="miaouComments-body"></div>');
      
      var itemId = $item.data('miaou-itemId');
      var nbComments = $item.data('miaou-nbComments');
      var hrefShowComments = 'javascript:Miaou.showCommentsForItemId(\'' + itemId + '\')';
      var hrefHideComments = 'javascript:Miaou.hideCommentsForItemId(\'' + itemId + '\')';
      var $showComments = $('<a href="' + hrefShowComments + '" class="miaouComments-showComments">Afficher les commentaires (<span class="miaouComments-nbComments">' +  nbComments + '</span>)</a>');
      var $hideComments = $('<a href="' + hrefHideComments + '" class="miaouComments-hideComments">Masquer les commentaires (<span class="miaouComments-nbComments">' +  nbComments + '</span>)</a>');
      var $loadingComments = $('<span class="miaouComments-loadingComments">Chargement des commentaires...</span>');
      
      // Preload comments on mousedown:
      $showComments.one('mousedown', function() {
        Miaou.loadCommentsForItemId(itemId);
      });
      
      $item.data({
        'miaou-$commentsHeader': $commentsHeader,
        'miaou-$commentsWrapper': $commentsWrapper,
        'miaou-$commentsBody': $commentsBody,
      });
      
      $item.addClass('miaouComments-hide'); // TODO: rename/change to 'miaouComments-show' instead ?
      $commentsHeader.append($showComments, $hideComments, $loadingComments);
      $commentsHeader.insertBefore($item.find('.meta-bar .vote-plus'));
      $commentsWrapper.append($commentsBody).insertAfter($item.find('div.item-meta'));
      
      $item.find('.show_explanation').attr('href', hrefShowComments);
      
      Miaou.setCommentsStateForItem($item, Miaou.COMMENTS_UNLOADED);
      
      return $item;
    },
    loadCommentsForItemId: function(itemId) {
      var $items = Miaou.itemsById[itemId] || $empty;
      if ($items.length === 0) return console.error('Could not find element item with id: ' + itemId);
      
      var itemURL = undefined;
      $items.each(function(i, item) {
        var $item = $(item);
        if (Miaou.getCommentsStateForItem($item) === Miaou.COMMENTS_LOADING) return;
        
        $item.addClass('miaouComments-loading');
        Miaou.setCommentsStateForItem($item, Miaou.COMMENTS_LOADING);
        
        itemURL = $item.data('miaou-itemURL');
      });
      if (!itemURL) return; // Probably already loading.
      
      $.get(itemURL, 'html').then(function(data) {
        var $page = $($.parseHTML(data)).remove('script, style, link');
        var $comments = $page.find('.comment-list');
        var nbComments = $comments.find('.comment').length;
        var $explanationText = $page.find('.explanation-text').prependTo($comments);
        if (nbComments > 0) {
          $comments = Miaou.linkifyQuoteRefs($comments);
          return {$comments: $comments, state: Miaou.COMMENTS_LOADED, nbComments: nbComments};
        }
        else if ($page.find('#comments-bloc').length > 0) {
          $comments = $page.find('#comments-bloc').children();
          return {$comments: $comments, state: Miaou.COMMENTS_LOADED, nbComments: 0};
        }
        else {
          $comments = $.parseHTML('<div class="comment-list">Erreur: commentaires non trouvés.</div>');
          return $.Deferred().reject({$comments: $comments, state: Miaou.COMMENTS_ERROR});
        }
      }, function(jqXHR) {
        var $comments = $.parseHTML('<div class="comment-list">Erreur: status = "' + jqXHR.statusText + '"</div>');
        return {$comments: $comments, state: Miaou.COMMENTS_ERROR};
      }).always(function(data) {
        // In case content of page was modified during xhr:
        var $items = Miaou.itemsById[itemId] || $empty;
        if ($items.length === 0) return;
        
        $items.each(function(i, item) {
          var $item = $(item);
          
          if ('nbComments' in data) {
            if ($item.data('miaou-nbComments') !== data.nbComments) {
              $item.data('miaou-nbComments', data.nbComments);
              $item.find('.miaouComments-nbComments').text(data.nbComments);
            }
          }
          
          var $commentsBody = $item.data('miaou-$commentsBody');
          $commentsBody.empty().append(data.$comments);
          
          $item.removeClass('miaouComments-loading');
          Miaou.setCommentsStateForItem($item, data.state);
        });
      });
    },
    showCommentsForItemId: function(itemId) {
      var $items = Miaou.itemsById[itemId] || $empty;
      $items.each(function(i, item) {
        var $item = $(item);
        var state = Miaou.getCommentsStateForItem($item);
        if (state === Miaou.COMMENTS_UNLOADED) Miaou.loadCommentsForItemId(itemId);
        $item.removeClass('miaouComments-hide');
      });
    },
    hideCommentsForItemId: function(itemId) {
      var $items = Miaou.itemsById[itemId] || $empty;
      $items.each(function(i, item) {
        var $item = $(item);
        $item.addClass('miaouComments-hide');
      });
    },
    toggleCommentsForItemId: function(itemId) {
      var $items = Miaou.itemsById[itemId] || $empty;
      if ($items.filter(':not(.miaouComments-hide)').length > 0) {
        Miaou.hideCommentsForItemId(itemId);
      }
      else {
        Miaou.showCommentsForItemId(itemId);
      }
    },
    showCommentsForAllItems: function() {
      for (var itemId in Miaou.itemsById) Miaou.showCommentsForItemId(itemId);
    },
    hideCommentsForAllItems: function() {
      for (var itemId in Miaou.itemsById) Miaou.hideCommentsForItemId(itemId);
    },
    toggleCommentsForAllItems: function() {
      for (var itemId in Miaou.itemsById) Miaou.toggleCommentsForItemId(itemId);
    },
    linkifyQuoteRefs: function(node) {
      if (node.each) { // node is a jQuery object
        node.each(function(i, node) {
          Miaou.linkifyQuoteRefs(node);
        });
      }
      else if (node.hasChildNodes()) {
        for (var i = 0; i < node.childNodes.length; i++){
           Miaou.linkifyQuoteRefs(node.childNodes[i]);
        }
      }
      else if (node.nodeType === Node.TEXT_NODE
            && node.textContent.indexOf('#') > -1 // Quick test speeds up the process.
            && !node.parentNode.classList.contains('miaou-linkifiedQuoteRef')) {
        // Regex to find a DTC quote reference: a '#' followed by up to 9 digits,
        // and the reference must be separated from other words.
        var newHTML = node.textContent.replace(/\B#(\d{1,9})\b/g, '<a href="/$1.html" class="miaou-linkifiedQuoteRef">$&</a>');
        if (newHTML !== node.textContent) $(node).replaceWith(newHTML);
      }
      return node;
    },
    colorDistance: function(c1, c2) {
      // From: http://www.compuphase.com/cmetric.htm (via: https://stackoverflow.com/questions/5392061/algorithm-to-check-similarity-of-colors/40950076#40950076)
      var rmean = (c1[0] + c2[0]) / 2;
      var r = c1[0] - c2[0];
      var g = c1[1] - c2[1];
      var b = c1[2] - c2[2];
      return Math.sqrt((((512+rmean)*r*r)>>8) + 4*g*g + (((767-rmean)*b*b)>>8));
    },
    // From: https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion/9493060#9493060
    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the set [0, 255] and
     * returns h, s, and l in the set [0, 1].
     *
     * @param   {number}  r       The red color value
     * @param   {number}  g       The green color value
     * @param   {number}  b       The blue color value
     * @return  {Array}           The HSL representation
     */
    _rgbToHsl: function(r, g, b){
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
    
        if(max == min){
            h = s = 0; // achromatic
        }else{
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
    
        return [h, s, l];
    },
    rgbToHsl: function(c) {
      var hsl = Miaou._rgbToHsl(c[0], c[1], c[2]);
      hsl[0] = Math.round(hsl[0] * 360);
      return hsl;
    },
  };
  
  
  
  
// MAIN:
  
  Miaou.pageHasItemsList = document.querySelector('div.items, div.item-listing, div.comment-listing') !== null;
  
  Miaou.$style = $('<style/>', {html: Miaou.styleContent.join('\n'), 'id': 'Miaou.$style'}).appendTo(document.head);
  
  if (window.location.pathname.startsWith('/search')) {
    $('.contenu h1').addClass('miaouH1Search').on('click', function() {
      $('.widget_search .icon-search').click();
    });
  }
  
  Miaou.minColorDistance = 30;
  //Miaou.debugColors = true;
  
  //Miaou.allowActionLoadAll = true;
  if (Miaou.pageHasItemsList && Miaou.allowActionLoadAll) {
    var $showAllComments = $('<a href="javascript:Miaou.showCommentsForAllItems()" class="miaouShowAllComments"><span>Afficher tous les commentaires</span></a>');
    $showAllComments.insertAfter('div.contenu a.submit.android');
    
    var $hideAllComments = $('<a href="javascript:Miaou.hideCommentsForAllItems()" class="miaouHideAllComments"><span>Masquer tous les commentaires</span></a>');
    $hideAllComments.insertAfter($showAllComments);
  }
  
  $('.item').each(function(i, item) {
  	Miaou.initItem($(item));
  });
  
  Miaou.linkifyQuoteRefs($('.item-content, .comment-content'));
  
  if (Miaou.pageHasItemsList) {
    // Remove original .show_explanation click events added in: https://danstonchat.com/themes/danstonchat2016/javascript/theme.js
    // Needs to be run after theme.js execution, so on document ready:
    $(function() {
      $('.show_explanation').off('click');
    });
  }
  
})(window.jQuery);
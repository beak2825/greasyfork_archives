// ==UserScript==
// @name          ao3 savior
// @description   Hide specified works on AO3
// @namespace     ao3
// @include       http*://archiveofourown.org/*
// @grant         none
// @version       1.16
// @downloadURL https://update.greasyfork.org/scripts/3579/ao3%20savior.user.js
// @updateURL https://update.greasyfork.org/scripts/3579/ao3%20savior.meta.js
// ==/UserScript==



(function () {
  'use strict';

  var STYLE = '\n  html body .ao3-savior-hidden.ao3-savior-hidden {\n    display: none;\n  }\n  \n  .ao3-savior-cut {\n    display: none;\n  }\n  \n  .ao3-savior-cut::after {\n    clear: both;\n    content: \'\';\n    display: block;\n  }\n  \n  .ao3-savior-reason {\n    margin-left: 5px;\n  }\n  \n  .ao3-savior-hide-reasons .ao3-savior-reason {\n    display: none;\n  }\n  \n  .ao3-savior-unhide .ao3-savior-cut {\n    display: block;\n  }\n  \n  .ao3-savior-fold {\n    align-items: center;\n    display: flex;\n    justify-content: flex-start;\n  }\n  \n  .ao3-savior-unhide .ao3-savior-fold {\n    border-bottom: 1px dashed;\n    margin-bottom: 15px;\n    padding-bottom: 5px;\n  }\n  \n  button.ao3-savior-toggle {\n    margin-left: auto;\n  }\n';

  function addStyle() {
    var style = document.createElement('style');
    style.innerHTML = STYLE;
    style.className = 'ao3-savior';

    document.head.appendChild(style);
  }

  var CSS_NAMESPACE = 'ao3-savior';

  var getCut = function getCut(work) {
    var cut = document.createElement('div');

    cut.className = CSS_NAMESPACE + '-cut';
    Array.from(work.childNodes).forEach(function (child) {
      return cut.appendChild(child);
    });

    return cut;
  };

  var getFold = function getFold(reason) {
    var fold = document.createElement('div');
    var note = document.createElement('span');

    fold.className = CSS_NAMESPACE + '-fold';
    note.className = CSS_NAMESPACE + '-note';

    note.innerHTML = 'This work is hidden!';

    fold.appendChild(note);
    fold.append(' ');
    fold.appendChild(getReasonSpan(reason));
    fold.appendChild(getToggleButton());

    return fold;
  };

  var getToggleButton = function getToggleButton() {
    var button = document.createElement('button');
    var unhideClassFragment = ' ' + CSS_NAMESPACE + '-unhide';

    button.innerHTML = 'Unhide';
    button.className = CSS_NAMESPACE + '-toggle';

    button.addEventListener('click', function (event) {
      var work = event.target.closest('.' + CSS_NAMESPACE + '-work');

      if (work.className.indexOf(unhideClassFragment) !== -1) {
        work.className = work.className.replace(unhideClassFragment, '');
        work.querySelector('.' + CSS_NAMESPACE + '-note').innerHTML = 'This work is hidden.';
        event.target.innerHTML = 'Unhide';
      } else {
        work.className += unhideClassFragment;
        work.querySelector('.' + CSS_NAMESPACE + '-note').innerHTML = 'ℹ️ This work was hidden.';
        event.target.innerHTML = 'Hide';
      }
    });

    return button;
  };

  var getReasonSpan = function getReasonSpan(reason) {
    var span = document.createElement('span');
    var tag = reason.tag,
        author = reason.author,
        title = reason.title,
        summary = reason.summary;

    var text = void 0;

    if (tag) {
      text = 'tags include <strong>' + tag + '</strong>';
    } else if (author) {
      text = 'authors include <strong>' + author + '</strong>';
    } else if (title) {
      text = 'title is <strong>' + title + '</strong>';
    } else if (summary) {
      text = 'summary includes <strong>' + summary + '</strong>';
    }

    if (text) {
      span.innerHTML = '(Reason: ' + text + '.)';
    }

    span.className = CSS_NAMESPACE + '-reason';

    return span;
  };

  function blockWork(work, reason, config) {
    if (!reason) return;

    var showReasons = config.showReasons,
        showPlaceholders = config.showPlaceholders;


    if (showPlaceholders) {
      var fold = getFold(reason);
      var cut = getCut(work);

      work.className += ' ' + CSS_NAMESPACE + '-work';
      work.innerHTML = '';
      work.appendChild(fold);
      work.appendChild(cut);

      if (!showReasons) {
        work.className += ' ' + CSS_NAMESPACE + '-hide-reasons';
      }
    } else {
      work.className += ' ' + CSS_NAMESPACE + '-hidden';
    }
  }

  function matchTermsWithWildCard(term0, pattern0) {
    var term = term0.toLowerCase();
    var pattern = pattern0.toLowerCase();

    if (term === pattern) return true;
    if (pattern.indexOf('*') === -1) return false;

    var lastMatchedIndex = pattern.split('*').filter(Boolean).reduce(function (prevIndex, chunk) {
      var matchedIndex = term.indexOf(chunk);
      return prevIndex >= 0 && prevIndex <= matchedIndex ? matchedIndex : -1;
    }, 0);

    return lastMatchedIndex >= 0;
  }

  var isItemWhitelisted = function isItemWhitelisted(items, whitelist) {
    var whitelistLookup = whitelist.reduce(function (lookup, item) {
      lookup[item] = true;
      return lookup;
    }, {});

    return items.some(function (item) {
      return !!whitelistLookup[item];
    });
  };

  var findBlacklistedItem = function findBlacklistedItem(list, blacklist, comparator) {
    var matchingEntry = void 0;

    list.some(function (item) {
      blacklist.some(function (entry) {
        var matched = comparator(item, entry);

        if (matched) matchingEntry = entry;

        return matched;
      });
    });

    return matchingEntry;
  };

  var equals = function equals(a, b) {
    return a === b;
  };
  var contains = function contains(a, b) {
    return a.indexOf(b) !== -1;
  };

  function getBlockReason(_ref, _ref2) {
    var _ref$authors = _ref.authors,
        authors = _ref$authors === undefined ? [] : _ref$authors,
        _ref$title = _ref.title,
        title = _ref$title === undefined ? '' : _ref$title,
        _ref$tags = _ref.tags,
        tags = _ref$tags === undefined ? [] : _ref$tags,
        _ref$summary = _ref.summary,
        summary = _ref$summary === undefined ? '' : _ref$summary;
    var _ref2$authorBlacklist = _ref2.authorBlacklist,
        authorBlacklist = _ref2$authorBlacklist === undefined ? [] : _ref2$authorBlacklist,
        _ref2$titleBlacklist = _ref2.titleBlacklist,
        titleBlacklist = _ref2$titleBlacklist === undefined ? [] : _ref2$titleBlacklist,
        _ref2$tagBlacklist = _ref2.tagBlacklist,
        tagBlacklist = _ref2$tagBlacklist === undefined ? [] : _ref2$tagBlacklist,
        _ref2$authorWhitelist = _ref2.authorWhitelist,
        authorWhitelist = _ref2$authorWhitelist === undefined ? [] : _ref2$authorWhitelist,
        _ref2$tagWhitelist = _ref2.tagWhitelist,
        tagWhitelist = _ref2$tagWhitelist === undefined ? [] : _ref2$tagWhitelist,
        _ref2$summaryBlacklis = _ref2.summaryBlacklist,
        summaryBlacklist = _ref2$summaryBlacklis === undefined ? [] : _ref2$summaryBlacklis;


    if (isItemWhitelisted(tags, tagWhitelist)) {
      return null;
    }

    if (isItemWhitelisted(authors, authorWhitelist)) {
      return null;
    }

    var blockedTag = findBlacklistedItem(tags, tagBlacklist, matchTermsWithWildCard);
    if (blockedTag) {
      return { tag: blockedTag };
    }

    var author = findBlacklistedItem(authors, authorBlacklist, equals);
    if (author) {
      return { author: author };
    }

    var blockedTitle = findBlacklistedItem([title], titleBlacklist, matchTermsWithWildCard);
    if (blockedTitle) {
      return { title: blockedTitle };
    }

    var summaryTerm = findBlacklistedItem([summary], summaryBlacklist, contains);
    if (summaryTerm) {
      return { summary: summaryTerm };
    }

    return null;
  }

  function isDebug(location) {
    return location.hostname === 'localhost' || /\ba3sv-debug\b/.test(location.search);
  }

  var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

  var getText = function getText(element) {
    return element.textContent.replace(/^\s*|\s*$/g, '');
  };
  var selectTextsIn = function selectTextsIn(root, selector) {
    return Array.from(root.querySelectorAll(selector)).map(getText);
  };

  function selectFromWork(container) {
    return _extends({}, selectFromBlurb(container), {
      title: selectTextsIn(container, '.title')[0],
      summary: selectTextsIn(container, '.summary .userstuff')[0]
    });
  }

  function selectFromBlurb(blurb) {
    return {
      authors: selectTextsIn(blurb, 'a[rel=author]'),
      tags: [].concat(selectTextsIn(blurb, 'a.tag'), selectTextsIn(blurb, '.required-tags .text')),
      title: selectTextsIn(blurb, '.header .heading a:first-child')[0],
      summary: selectTextsIn(blurb, 'blockquote.summary')[0]
    };
  }

  setTimeout(function () {
    var debugMode = isDebug(window.location);
    var config = window.ao3SaviorConfig;
    var workContainer = document.querySelector('#main.works-show') || document.querySelector('#main.chapters-show');
    var blocked = 0;
    var total = 0;

    if (debugMode) {
      console.groupCollapsed('AO3 SAVIOR');

      if (!config) {
        console.warn('Exiting due to missing config.');
        return;
      }
    }

    addStyle();

    Array.from(document.querySelectorAll('li.blurb')).forEach(function (blurb) {
      var blockables = selectFromBlurb(blurb);
      var reason = getBlockReason(blockables, config);

      total++;

      if (reason) {
        blockWork(blurb, reason, config);
        blocked++;

        if (debugMode) {
          console.groupCollapsed('- blocked ' + blurb.id);
          console.log(blurb, reason);
          console.groupEnd();
        }
      } else if (debugMode) {
        console.groupCollapsed('  skipped ' + blurb.id);
        console.log(blurb);
        console.groupEnd();
      }
    });

    if (config.alertOnVisit && workContainer && document.referrer.indexOf('//archiveofourown.org') === -1) {

      var blockables = selectFromWork(workContainer);
      var reason = getBlockReason(blockables, config);

      if (reason) {
        blocked++;
        blockWork(workContainer, reason, config);
      }
    }

    if (debugMode) {
      console.log('Blocked ' + blocked + ' out of ' + total + ' works');
      console.groupEnd();
    }
  }, 10);

}());

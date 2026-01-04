// ==UserScript==
// @name         Tweet Diff
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Diff checker on tweet edit history
// @author       Snazzah
// @license      MIT
// @match        https://x.com/*
// @icon         https://raw.githubusercontent.com/Snazzah/TweetDiff/v1.0.1/icons/icon128.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499004/Tweet%20Diff.user.js
// @updateURL https://update.greasyfork.org/scripts/499004/Tweet%20Diff.meta.js
// ==/UserScript==

(function() {'use strict';
// node_modules/diff/lib/index.mjs
var Diff = function() {
};
var buildValues = function(diff, lastComponent, newString, oldString, useLongestToken) {
  var components = [];
  var nextComponent;
  while (lastComponent) {
    components.push(lastComponent);
    nextComponent = lastComponent.previousComponent;
    delete lastComponent.previousComponent;
    lastComponent = nextComponent;
  }
  components.reverse();
  var componentPos = 0, componentLen = components.length, newPos = 0, oldPos = 0;
  for (;componentPos < componentLen; componentPos++) {
    var component = components[componentPos];
    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function(value2, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value2.length ? oldValue : value2;
        });
        component.value = diff.join(value);
      } else {
        component.value = diff.join(newString.slice(newPos, newPos + component.count));
      }
      newPos += component.count;
      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count;
      if (componentPos && components[componentPos - 1].added) {
        var tmp = components[componentPos - 1];
        components[componentPos - 1] = components[componentPos];
        components[componentPos] = tmp;
      }
    }
  }
  var finalComponent = components[componentLen - 1];
  if (componentLen > 1 && typeof finalComponent.value === "string" && (finalComponent.added || finalComponent.removed) && diff.equals("", finalComponent.value)) {
    components[componentLen - 2].value += finalComponent.value;
    components.pop();
  }
  return components;
};
var generateOptions = function(options, defaults) {
  if (typeof options === "function") {
    defaults.callback = options;
  } else if (options) {
    for (var name in options) {
      if (options.hasOwnProperty(name)) {
        defaults[name] = options[name];
      }
    }
  }
  return defaults;
};
var diffWords = function(oldStr, newStr, options) {
  options = generateOptions(options, {
    ignoreWhitespace: true
  });
  return wordDiff.diff(oldStr, newStr, options);
};
var _typeof = function(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
};
var canonicalize = function(obj, stack, replacementStack, replacer, key) {
  stack = stack || [];
  replacementStack = replacementStack || [];
  if (replacer) {
    obj = replacer(key, obj);
  }
  var i;
  for (i = 0;i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }
  var canonicalizedObj;
  if (objectPrototypeToString.call(obj) === "[object Array]") {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);
    for (i = 0;i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
    }
    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }
  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }
  if (_typeof(obj) === "object" && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);
    var sortedKeys = [], _key;
    for (_key in obj) {
      if (obj.hasOwnProperty(_key)) {
        sortedKeys.push(_key);
      }
    }
    sortedKeys.sort();
    for (i = 0;i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }
    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }
  return canonicalizedObj;
};
Diff.prototype = {
  diff: function diff(oldString, newString) {
    var _options$timeout;
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = options.callback;
    if (typeof options === "function") {
      callback = options;
      options = {};
    }
    this.options = options;
    var self = this;
    function done(value) {
      if (callback) {
        setTimeout(function() {
          callback(undefined, value);
        }, 0);
        return true;
      } else {
        return value;
      }
    }
    oldString = this.castInput(oldString);
    newString = this.castInput(newString);
    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));
    var newLen = newString.length, oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    if (options.maxEditLength) {
      maxEditLength = Math.min(maxEditLength, options.maxEditLength);
    }
    var maxExecutionTime = (_options$timeout = options.timeout) !== null && _options$timeout !== undefined ? _options$timeout : Infinity;
    var abortAfterTimestamp = Date.now() + maxExecutionTime;
    var bestPath = [{
      oldPos: -1,
      lastComponent: undefined
    }];
    var newPos = this.extractCommon(bestPath[0], newString, oldString, 0);
    if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
      return done([{
        value: this.join(newString),
        count: newString.length
      }]);
    }
    var minDiagonalToConsider = -Infinity, maxDiagonalToConsider = Infinity;
    function execEditLength() {
      for (var diagonalPath = Math.max(minDiagonalToConsider, -editLength);diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
        var basePath = undefined;
        var removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
        if (removePath) {
          bestPath[diagonalPath - 1] = undefined;
        }
        var canAdd = false;
        if (addPath) {
          var addPathNewPos = addPath.oldPos - diagonalPath;
          canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
        }
        var canRemove = removePath && removePath.oldPos + 1 < oldLen;
        if (!canAdd && !canRemove) {
          bestPath[diagonalPath] = undefined;
          continue;
        }
        if (!canRemove || canAdd && removePath.oldPos + 1 < addPath.oldPos) {
          basePath = self.addToPath(addPath, true, undefined, 0);
        } else {
          basePath = self.addToPath(removePath, undefined, true, 1);
        }
        newPos = self.extractCommon(basePath, newString, oldString, diagonalPath);
        if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
          return done(buildValues(self, basePath.lastComponent, newString, oldString, self.useLongestToken));
        } else {
          bestPath[diagonalPath] = basePath;
          if (basePath.oldPos + 1 >= oldLen) {
            maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
          }
          if (newPos + 1 >= newLen) {
            minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
          }
        }
      }
      editLength++;
    }
    if (callback) {
      (function exec() {
        setTimeout(function() {
          if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
            return callback();
          }
          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
        var ret = execEditLength();
        if (ret) {
          return ret;
        }
      }
    }
  },
  addToPath: function addToPath(path, added, removed, oldPosInc) {
    var last = path.lastComponent;
    if (last && last.added === added && last.removed === removed) {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: last.count + 1,
          added,
          removed,
          previousComponent: last.previousComponent
        }
      };
    } else {
      return {
        oldPos: path.oldPos + oldPosInc,
        lastComponent: {
          count: 1,
          added,
          removed,
          previousComponent: last
        }
      };
    }
  },
  extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length, oldLen = oldString.length, oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
    }
    if (commonCount) {
      basePath.lastComponent = {
        count: commonCount,
        previousComponent: basePath.lastComponent
      };
    }
    basePath.oldPos = oldPos;
    return newPos;
  },
  equals: function equals(left, right) {
    if (this.options.comparator) {
      return this.options.comparator(left, right);
    } else {
      return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  },
  removeEmpty: function removeEmpty(array) {
    var ret = [];
    for (var i = 0;i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }
    return ret;
  },
  castInput: function castInput(value) {
    return value;
  },
  tokenize: function tokenize(value) {
    return value.split("");
  },
  join: function join(chars) {
    return chars.join("");
  }
};
var characterDiff = new Diff;
var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var reWhitespace = /\S/;
var wordDiff = new Diff;
wordDiff.equals = function(left, right) {
  if (this.options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }
  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};
wordDiff.tokenize = function(value) {
  var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/);
  for (var i = 0;i < tokens.length - 1; i++) {
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }
  return tokens;
};
var lineDiff = new Diff;
lineDiff.tokenize = function(value) {
  if (this.options.stripTrailingCr) {
    value = value.replace(/\r\n/g, "\n");
  }
  var retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  }
  for (var i = 0;i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];
    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      }
      retLines.push(line);
    }
  }
  return retLines;
};
var sentenceDiff = new Diff;
sentenceDiff.tokenize = function(value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};
var cssDiff = new Diff;
cssDiff.tokenize = function(value) {
  return value.split(/([{}:;,]|\s+)/);
};
var objectPrototypeToString = Object.prototype.toString;
var jsonDiff = new Diff;
jsonDiff.useLongestToken = true;
jsonDiff.tokenize = lineDiff.tokenize;
jsonDiff.castInput = function(value) {
  var _this$options = this.options, undefinedReplacement = _this$options.undefinedReplacement, _this$options$stringi = _this$options.stringifyReplacer, stringifyReplacer = _this$options$stringi === undefined ? function(k, v) {
    return typeof v === "undefined" ? undefinedReplacement : v;
  } : _this$options$stringi;
  return typeof value === "string" ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, "  ");
};
jsonDiff.equals = function(left, right) {
  return Diff.prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, "$1"), right.replace(/,([\r\n])/g, "$1"));
};
var arrayDiff = new Diff;
arrayDiff.tokenize = function(value) {
  return value.slice();
};
arrayDiff.join = arrayDiff.removeEmpty = function(value) {
  return value;
};

// src/style.css
var style_default = "body {\n  --twdiff-background-color: 255, 255, 255;\n  --twdiff-text-color: rgb(0, 0, 0);\n}\nbody[style^=\"background-color: rgb(21, 32, 43);\"], body.body-dark {\n  --twdiff-background-color: 21, 32, 43;\n  --twdiff-text-color: rgb(255, 255, 255);\n}\nbody[style^=\"background-color: rgb(0, 0, 0);\"], body.body-pitch-black {\n  --twdiff-background-color: 0, 0, 0;\n  --twdiff-text-color: rgb(255, 255, 255);\n}\n\n.twdiff-button {\n  font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n  cursor: pointer;\n  border-radius: 8px;\n  border: 1px solid rgb(47, 51, 54);\n  background-color: transparent;\n  margin-top: 10px;\n  padding: 10px 15px;\n  display: flex;\n  font-size: 15px;\n  gap: 2px;\n  color: #d8dbde;\n  transition-duration: 0.2s;\n  transition-property: background-color;\n}\n\n.twdiff-button:hover {\n  background-color: rgb(255, 255, 255, 0.03);\n}\n\n.twdiff-add-preview {\n  color: #57ab5a;\n  font-weight: 700;\n}\n\n.twdiff-remove-preview {\n  color: #e5534b;\n  font-weight: 700;\n}\n\n.twdiff-modal {\n  position: fixed;\n  z-index: 100;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(91, 112, 131, 0.4);\n  color: var(--twdiff-text-color);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.twdiff-inner-modal {\n  position: relative;\n  background-color: rgb(var(--twdiff-background-color));\n  border-radius: 8px;\n  max-width: 600px;\n  max-height: 650px;\n  width: 100%;\n  margin: 10px;\n  overflow: auto;\n  font-family: TwitterChirp, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif;\n}\n\n.twdiff-header {\n  height: 50px;\n  position: sticky;\n  top: 0;\n  left: 0;\n  right: 0;\n  padding: 0 16px;\n  font-size: 20px;\n  align-content: center;\n  font-weight: 700;\n  backdrop-filter: blur(12px);\n  background-color: rgba(var(--twdiff-background-color), 0.65);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.twdiff-header h2 {\n  flex: 1;\n  margin: 0;\n  font-size: 20px;\n}\n\n.twdiff-header > .twdiff-remove-preview {\n  margin-left: 4px;\n}\n\n.twdiff-close-button {\n  color: rgb(239, 243, 244);\n  background-color: transparent;\n  border: none;\n  width: 36px;\n  height: 36px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  border-radius: 999px;\n  transition-duration: 0.2s;\n  margin-left: -8px;\n  margin-right: 20px;\n}\n\n.twdiff-close-button:hover {\n  background-color: rgba(239, 243, 244, 0.1);\n}\n\n.twdiff-close-button svg {\n  fill: currentColor;\n}\n\n.twdiff-close-button svg {\n  width: 20px;\n  height: 20px;\n}\n\n.twdiff-tweet {\n  padding: 12px 16px;\n  padding-bottom: 24px;\n  display: flex;\n  gap: 8px;\n}\n\n.twdiff-tweet-avy {\n  flex: none;\n  width: 40px;\n  height: 40px;\n  border-radius: 999px;\n\tuser-drag: none;\n\tuser-select: none;\n\t-moz-user-select: none;\n\t-webkit-user-drag: none;\n\t-webkit-user-select: none;\n\t-ms-user-select: none;\n}\n\n.twdiff-tweet-content {\n  display: flex;\n  flex-direction: column;\n  font-size: 15px;\n  gap: 2px;\n  flex: 1;\n  overflow: hidden;\n}\n\n.twdiff-tweet-user {\n  font-weight: 700;\n  display: flex;\n  gap: 2px;\n}\n\n.twdiff-user-verified {\n  color: rgb(29, 155, 240);\n  height: 1.25em;\n  fill: currentcolor;\n  max-width: 20px;\n  max-height: 20px;\n  height: 1.25em;\n  vertical-align: text-bottom;\n}\n\n.twdiff-tweet-handle {\n  color: rgb(113, 118, 123);\n  font-weight: 400;\n}\n\n.twdiff-tweet-text {\n  white-space: pre-wrap;\n  overflow-wrap: break-word;\n}\n\n.twdiff-add {\n  background-color: #0a04;\n}\n\n.twdiff-remove {\n  background-color: #a004;\n  text-decoration: line-through;\n}";

// src/index.ts
var getCsrf = function() {
  let csrf = document.cookie.match(/(?:^|;\s*)ct0=([0-9a-f]+)\s*(?:;|$)/);
  return csrf ? csrf[1] : "";
};
var fetchHistory = function(id) {
  const path = `https://${location.hostname}/i/api/graphql/1I20d3k4y_2gALXHj967Xg/TweetEditHistory?variables=%7B%22tweetId%22%3A%22${id}%22,%22withQuickPromoteEligibilityTweetFields%22%3Atrue%7D&features=%7B%22communities_web_enable_tweet_community_results_fetch%22%3Atrue,%22c9s_tweet_anatomy_moderator_badge_enabled%22%3Atrue,%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue,%22standardized_nudges_misinfo%22%3Atrue,%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue,%22tweetypie_unmention_optimization_enabled%22%3Atrue,%22responsive_web_edit_tweet_api_enabled%22%3Atrue,%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue,%22view_counts_everywhere_api_enabled%22%3Atrue,%22longform_notetweets_consumption_enabled%22%3Atrue,%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Atrue,%22tweet_awards_web_tipping_enabled%22%3Afalse,%22creator_subscriptions_quote_tweet_preview_enabled%22%3Afalse,%22longform_notetweets_rich_text_read_enabled%22%3Atrue,%22longform_notetweets_inline_media_enabled%22%3Atrue,%22articles_preview_enabled%22%3Atrue,%22rweb_video_timestamps_enabled%22%3Atrue,%22rweb_tipjar_consumption_enabled%22%3Atrue,%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue,%22verified_phone_label_enabled%22%3Afalse,%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue,%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue,%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse,%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
  return fetch(path, {
    headers: {
      authorization: publicToken,
      "x-csrf-token": getCsrf(),
      "x-twitter-auth-type": "OAuth2Session",
      "content-type": "application/json",
      "x-twitter-client-language": navigator.language ? navigator.language : "en"
    },
    credentials: "include"
  }).then((r) => r.json());
};
var createButton = function(diffOpts) {
  const diff2 = diffWords(diffOpts.oldText, diffOpts.newText);
  let addCount = 0;
  let removeCount = 0;
  diff2.forEach((p) => {
    if (p.added)
      addCount++;
    else if (p.removed)
      removeCount++;
  });
  function click() {
    const modal = document.createElement("div");
    modal.className = "twdiff-modal";
    modal.addEventListener("click", (e) => {
      if (e.target === modal)
        modal.remove();
    });
    const verifiedTick = '<svg viewBox="0 0 22 22" aria-label="Verified account" role="img" data-testid="icon-verified" class="twdiff-user-verified"><g><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"></path></g></svg>';
    modal.innerHTML = `
      <div class="twdiff-inner-modal">
        <div class="twdiff-header">
          <button class="twdiff-close-button">
            <svg viewBox="0 0 24 24" aria-hidden="true"><g><path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z"></path></g></svg>
          </button>
          <h2>Tweet Diff</h2>
          <div>
            <span class="twdiff-add-preview"></span>
            <span class="twdiff-remove-preview"></span>
          </div>
        </div>
        <div class="twdiff-tweet">
          <img class="twdiff-tweet-avy">
          <div class="twdiff-tweet-content">
            <div class="twdiff-tweet-user">
              <span class="twdiff-tweet-username"></span>
              ${diffOpts.user?.is_blue_verified ? verifiedTick : ""}
              <span class="twdiff-tweet-handle"></span>
            </div>
            <div class="twdiff-tweet-text"></div>
          </div>
        </div>
      </div>
    `;
    modal.querySelector(".twdiff-close-button").addEventListener("click", () => modal.remove());
    if (diffOpts.user) {
      modal.querySelector(".twdiff-tweet-handle").innerText = "@" + diffOpts.user.legacy.screen_name;
      modal.querySelector(".twdiff-tweet-username").innerText = diffOpts.user.legacy.name;
      modal.querySelector(".twdiff-tweet-avy").src = diffOpts.user.legacy.profile_image_url_https;
    }
    if (addCount !== 0)
      modal.querySelector(".twdiff-add-preview").innerText = "+" + addCount.toLocaleString();
    if (removeCount !== 0)
      modal.querySelector(".twdiff-remove-preview").innerText = "-" + removeCount.toLocaleString();
    const tweetText = modal.querySelector(".twdiff-tweet-text");
    for (const part of diff2) {
      const span = document.createElement("span");
      if (part.added)
        span.classList.add("twdiff-add");
      else if (part.removed)
        span.classList.add("twdiff-remove");
      span.innerText = part.value;
      tweetText.appendChild(span);
    }
    document.body.appendChild(modal);
  }
  const button = document.createElement("button");
  button.className = "twdiff-button";
  if (addCount === 0 && removeCount === 0) {
    button.innerText = "No difference found";
    button.disabled = true;
  } else {
    button.innerHTML = '<span class="twdiff-add-preview"></span><span class="twdiff-remove-preview"></span><span>\xB7 Show Diff</span>';
    if (addCount !== 0)
      button.querySelector(".twdiff-add-preview").innerText = "+" + addCount.toLocaleString();
    if (removeCount !== 0)
      button.querySelector(".twdiff-remove-preview").innerText = "-" + removeCount.toLocaleString();
    button.addEventListener("click", click);
  }
  return button;
};
var getTweetElements = function(username) {
  const tweets = Array.from(document.querySelectorAll('article[data-testid="tweet"]'));
  let sortedTweets = {};
  for (const tweet of tweets) {
    const link = tweet.querySelector(`a[href^="/${username}/status/"`);
    if (!link)
      continue;
    const tweetId = link.href.split("/").reverse()[0];
    if (/^\d+$/.test(tweetId))
      sortedTweets[tweetId] = tweet;
  }
  return sortedTweets;
};
async function hookIntoTweets() {
  const [_, username, __, tweetId] = location.pathname.split("/");
  console.log("Starting to hook into tweet", username, tweetId);
  const tweetElems = getTweetElements(username);
  const data = await fetchHistory(tweetId);
  const editHistory = data.data.tweet_result_by_rest_id.result.edit_history_timeline.timeline.instructions[1].entries;
  const user = editHistory[0].content.items[0].item.itemContent.tweet_results.result.core.user_results.result;
  const tweets = [
    editHistory[0].content.items[0].item.itemContent.tweet_results.result,
    ...editHistory[1].content.items.map((e) => e.item.itemContent.tweet_results.result.tweet)
  ].map((t, i) => ({ index: i, id: t.rest_id, text: t.note_tweet?.note_tweet_results?.result.text ?? t.legacy.full_text }));
  for (const tweet of tweets) {
    if (tweet.index >= tweets.length - 1)
      break;
    if (!tweetElems[tweet.id] || tweetElems[tweet.id].dataset.twdiff === "1")
      continue;
    const prevTweet = tweets[tweet.index + 1];
    const parentElem = tweetElems[tweet.id].querySelector('[data-testid="tweetText"]').parentElement;
    parentElem.appendChild(createButton({
      oldText: prevTweet.text,
      newText: tweet.text,
      user
    }));
    tweetElems[tweet.id].dataset.twdiff = "1";
  }
}
var onReady = function() {
  const style2 = document.createElement("style");
  const head = document.head || document.getElementsByTagName("head")[0];
  style2.innerHTML = style_default;
  head.appendChild(style2);
  let lastHistory = "";
  setInterval(() => {
    const [_, username, userType, tweetId, tweetType] = location.pathname.split("/");
    const isOnHistory = username !== "home" && username !== "i" && userType === "status" && tweetType === "history" && !!document.querySelector('section[aria-labelledby^="accessible-list-"] h2[aria-level="2"][role="heading"]');
    if (!isOnHistory)
      lastHistory = "";
    else if (lastHistory !== tweetId) {
      lastHistory = tweetId;
      try {
        hookIntoTweets();
      } catch (e) {
        console.log("Failed to hook tweetdiff", e);
      }
    }
  }, 1000);
};
var publicToken = "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";
document.addEventListener("readystatechange", () => {
  if (document.readyState === "complete")
    onReady();
});

})();
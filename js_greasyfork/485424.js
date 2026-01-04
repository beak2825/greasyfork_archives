// ==UserScript==
// @name         Mathway auto-get free answer steps
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.3
// @license      AGPL v3
// @author       jcunews
// @description  Context: https://www.reddit.com/r/GreaseMonkey/comments/19cai8u/requestcommission_looking_for_a_mathway_script/
// @match        https://www.mathway.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485424/Mathway%20auto-get%20free%20answer%20steps.user.js
// @updateURL https://update.greasyfork.org/scripts/485424/Mathway%20auto-get%20free%20answer%20steps.meta.js
// ==/UserScript==

((retryDelay, topicSelectDelay, defaultTopicId, jq, ja, exp, tid, busy) => {
  //===== CONFIG BEGIN (delays are in milliseconds. 1000ms = 1 second)
  retryDelay       = 200; //delay before retrying a query
  topicSelectDelay = 100; //delay before selecting a topic for answer
  defaultTopicId   = 395; //default topic ID if not prompted. 395 = Evaluate
  //===== CONFIG END

  function reset() {
    exp = null; tid = undefined; busy = false
  }
  function we(c, a, b) {
    if (a = document.querySelector('#topics-inner')) {
      if (b = a.querySelector(`.topics-single[data-id="${tid}"]`)) {
        return setTimeout(() => b.click(), topicSelectDelay)
      } else if (b = a.querySelector('.topics-more')) {
        return setTimeout(() => b.click(), topicSelectDelay)
      } else if (--c === 0) {
        reset();
        return alert("Topic is not found.")
      }
    }
    setTimeout(we, 100, c)
  }
  function inpExp(ei) {
    if (exp) {
      exp.click();
      setTimeout(() => document.querySelector('.editor-buttons>button.enabled:has(.mw-paper-airplane)').click(), 100)
    }
  }
  function wb(a) {
    if (a = document.querySelector('.ch-bubble-border.clickable:has(.ch-bubble-trial)')) return a.click();
    setTimeout(wb, 100)
  }
  function jad(f) {
    var q = this, f_ = f;
    f = function(r) {
      if (/^\/chat\/(editor|topics)/.test(q.url)) {
        if (r.topics) {
          if (busy) we(5)
        } else if (r.messages) {
          if (!exp) {
            exp = document.querySelectorAll('#chat-inner>.ch-solution-top .ch-problem');
            exp = exp[exp.length - 1]
          }
          if (tid === undefined) tid = defaultTopicId;
          if (r.messages[0]?.action) {
            if (r.messages[0].action.params?.freeTrialToken) {
              wb(busy = false)
            } else {
              busy = true;
              setTimeout(inpExp, retryDelay, 0)
            }
          } else reset()
        }
      }
      return f_.apply(this, arguments)
    };
    return this.done_.apply(this, arguments)
  }
  function jaf(f) {
    var f_ = f;
    f = function(e) {
      reset();
      return f_.apply(this, arguments)
    };
    return this.fail_.apply(this, arguments)
  }
  jq = window.jQuery || window.$; ja = jq.ajax;
  jq.ajax = function(uo) {
    var r;
    if (/^\/chat\/(editor|topics)/.test(uo.url)) {
      if (tid === undefined) tid = JSON.parse(uo.data).topicId;
      r = ja.apply(this, arguments);
      r.url = uo.url;
      if (!r.done_) {
        r.done_ = r.done;
        r.done = jad;
        r.fail_ = r.fail;
        r.fail = jaf
      }
      return r
    }
    return ja.apply(this, arguments)
  };
  reset()
})()

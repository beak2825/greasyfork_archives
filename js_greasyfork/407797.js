// ==UserScript==
// @name         知微日报填写
// @namespace    http://tkb.agilean.cn:9000/
// @version      0.7.0
// @description  如果你觉得每天要想昨天/上周做了啥很麻烦的话，不妨试试这个自动读取你上一个工作日的卡片操作记录, 并以点亮中的卡作为今日工作的卡
// @author       Ezio Lin
// @match        https://tkb.agilean.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/407797/%E7%9F%A5%E5%BE%AE%E6%97%A5%E6%8A%A5%E5%A1%AB%E5%86%99.user.js
// @updateURL https://update.greasyfork.org/scripts/407797/%E7%9F%A5%E5%BE%AE%E6%97%A5%E6%8A%A5%E5%A1%AB%E5%86%99.meta.js
// ==/UserScript==

(function (global, context) {
  'use strict';
  const resToJson = (res) => res.json();
  const R = {
    pipe: (...fn) => (arg) => {
      return fn.reduce((result, handler) => handler(result), arg);
    },
    path: (path) => (obj) => {
      return path.reduce((ret, key) => ret[key], obj);
    },
    defaultTo: (val) => (obj) => obj || val,
    filter: (pred) => (arr) => {
      return arr.filter(pred);
    },
    where: (predObj) => (obj) => {
      return Object.entries(predObj).every(([key, pred]) => pred(obj[key]));
    },
    /** 没精力搞深比较了 */
    whereEq: (pred) => (obj) => {
      return Object.entries(pred).every(([key, predVal]) => obj[key] == predVal);
    },
    map: (transform) => (arr) => {
      return arr.map(transform);
    },
    prop: (prop) => (obj) => obj[prop],
    chain: (transform) => (arr) => {
      return arr.flatMap(transform);
    },
    find: (pred) => (arr) => arr.find(pred),
    when: (pred, success) => (obj) => {
      return pred(obj) ? success(obj) : obj;
    },
    is: (ctor) => (val) => val != null && (val.constructor === ctor || val instanceof ctor),
    /** 没精力了 不搞递归的了 */
    applySpec: (spec) => (obj) => {
      return Object.entries(spec)
        .map(([key, transform]) => [key, transform(obj)])
        .reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {});
    },
    reject: (pred) => (arr) => arr.filter((c) => !pred(c)),
    uniqBy: (by) => (arr) => {
      const set = new Set();
      const result = [];
      const size = arr.length;
      let idx = 0;
      while (idx < size) {
        const item = arr[idx];
        const appliedItem = by(item);
        if (!set.has(appliedItem)) {
          set.add(appliedItem);
          result.push(item);
        }
        idx++;
      }
      return result;
    },
    join: (s) => (arr) => arr.join(s),
    test: (pattern) => (str) => pattern.test(str),
    replace: (pattern, val) => (str) => str.replace(pattern, val),
    tap: (fn) => (val) => {
      fn(val);
      return val;
    },
    equals: (a) => (b) => a == b,
    eqBy: fn => a => b => fn(a) == fn(b),
    add: n => d => d + n,
    converge: fn => (pFn) => (...args) => fn.apply(null, pFn.map(it => it(...args))),
    unapply: fn => (...args) => fn(args)
  };

  const showDone = () => console.log('congratulations auto daily robot works!');

  const pickUserEmail = R.path(['resultValue', 'email'])

  const pickUserMemberId = R.path(['resultValue', 'dashboard', 'memberId'])

  const pickOrgId = R.path(['resultValue', 'dashboard', 'orgId'])

  const padLeftZero = str => String.prototype.padStart.call(str, 2, '0')

  const formatDate = R.converge(
    R.unapply(R.join('-'))
  )([
    date => Date.prototype.getFullYear.call(date),
    R.pipe(date => Date.prototype.getMonth.call(date), R.add(1), String, padLeftZero),
    R.pipe(date => Date.prototype.getDate.call(date), String, padLeftZero)
  ])

  const isMonday = new Date().getDay() === 1

  const predictTodayWorks = ({ memberId }) => {
    const re = /^猜测你今天可能要进行工作的卡片[:：]\n/;

    const isPredictMessage = R.where({
      content: R.test(re),
      created: dateStr => R.eqBy(formatDate)(new Date())(new Date(dateStr))
    })

    const filterPredictMessage = R.filter(isPredictMessage)

    return fetch(
      `/api/v1/bot/messages?by=id&memberId=${memberId}&page=0&size=20`,
      {
        headers: { accept: 'application/json' },
        method: 'GET',
        mode: 'cors',
        credentials: 'include'
      }
    )
      .then(resToJson)
      .then(R.path(['resultValue', 'currentList']))
      .then(R.defaultTo([]))
      .then(filterPredictMessage)
      .then(R.map(R.prop('content')))
      .then(R.map(R.replace(re, '')))
      .then(R.join('\n'))
  }

  const makeTimer = (cb, interval = 1000) => {
    let id = null
    let counter = 0

    const run = () => {
      cb(counter++);
      id = setTimeout(run, interval)
    }

    const stop = () => {
      if (id !== null) {
        window.clearTimeout(id)
      }
      id = null
      counter = 0
    }

    const start = () => {
      stop()
      run()
    }

    return {
      start,
      stop
    }
  }


  const injectRobotIconInCommentToolbar = ($toolbar) => {

    const $robotIcon = document.createElement("div")
    $robotIcon.className = "icon-robot"
    $robotIcon.style.cssText = "color: var(--icon-pl);font-weight: bold;margin-right: 6px;font-size: 20px"

    let isLoading = false;

    const setLoading = (bool) => {
      if (bool) {
        isLoading = true
        $robotIcon.style.cursor = 'wait'
        timer.start()
      } else {
        $robotIcon.style.cursor = 'pointer'
        isLoading = false
        timer.stop()
      }
    }

    const timer = makeTimer((() => {
      const frame = ["🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"]
      const content = "日报努力生成中  "
      return (counter) => {
        const m = frame.length
        const dot = counter % m
        $textarea.innerHTML = `${content} ${frame[dot]}`
      }
    })(), 200)


    // main logic
    setLoading(false)

    const genDailyReport = async () => {

      if (isLoading) {
        return console.log("正在等待内容生成中，请稍后")
      } else {

        setLoading(true)

        try {
          const user = await fetch("/api/v1/users/auth")
            .then(resToJson)
            .then(R.applySpec({
              user: pickUserEmail,
              memberId: pickUserMemberId,
              orgId: pickOrgId
            }))

          const email = user.user;

          const prev = fetch(`https://bind-knot.79131497.xyz/api/dailyReporter.gen?input=${encodeURIComponent(JSON.stringify({ email }))}`,
            { headers: { "Accept": "application/json" } }
          )
            .then(resToJson)
            .then(it => it.result.data)
            .then(it => it.map((it, idx) => `${idx + 1}: ${it}`))
            .then(R.join("<br />"))

          const today = predictTodayWorks(user)

          const [done, pred] = await Promise.all([prev, today])

          const start = isMonday ? "上周/周末" : "昨天"

          return $textarea.innerHTML = `${start}:<br />${done}<br />今天:<br />${pred}<br />求助:<br />暂无`

        } finally {
          setLoading(false)
        }

      }

    }

    $robotIcon.addEventListener('click', genDailyReport)
    $toolbar.prepend($robotIcon)

    const $textarea = $toolbar.nextSibling.querySelector('[class^="Comments_textarea"]')
  }


  // 使用MutationObserver监听DOM变化，以便在模态框打开后执行代码
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes) {
        Array.from(mutation.addedNodes)
          .filter(it => it instanceof Element && it.className.match(/Comments_comment-area-wrap/))
          .forEach(areaWrap => {
            const $toolbar = areaWrap.querySelector('[class^="Comments_comment-operate"]')
            if ($toolbar) {
              injectRobotIconInCommentToolbar($toolbar)
            } else {
              console.log("评论区找不到工具栏组件")
            }
          });
      }
    });
  });

  // 配置observer，指定要监听的目标节点和选项
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });


})(window, this);

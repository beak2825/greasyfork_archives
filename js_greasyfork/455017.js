// ==UserScript==
// @name 清水河畔官方红包楼一键评分
// @description 一键执行清水河畔官方红包楼 水滴+50 威望+1 的评分操作。
// @namespace bbs.uestc.edu.cn
// @license MIT
// @author ____
// @version 0.2.2
// @match *://bbs.uestc.edu.cn/forum.php?mod=viewthread&tid=463952*
// @match *://bbs-uestc-edu-cn-s.vpn.uestc.edu.cn/forum.php?mod=viewthread&tid=463952*
// @downloadURL https://update.greasyfork.org/scripts/455017/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E5%AE%98%E6%96%B9%E7%BA%A2%E5%8C%85%E6%A5%BC%E4%B8%80%E9%94%AE%E8%AF%84%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/455017/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E5%AE%98%E6%96%B9%E7%BA%A2%E5%8C%85%E6%A5%BC%E4%B8%80%E9%94%AE%E8%AF%84%E5%88%86.meta.js
// ==/UserScript==

var Water = 50;
var Popularity = 1;
var Reason = '清水河畔官方红包楼奖励🧧';
var ThreadId = '463952';
var formhash = document.querySelector('input[name=formhash]').value;

function rate(water, popularity, reason, pid, tid, notify) {
  water = water || '0';
  popularity = popularity || '0';
  return fetch('/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `formhash=${formhash}&tid=${tid}&pid=${pid}&handlekey=rate&score1=${popularity}&score2=${water}&reason=${encodeURIComponent(reason)}&ratesubmit=true` +
    (notify ? '&sendreasonpm=on' : ''),
    credentials: 'include',
  }).then(x=>x.text()).then(x => {
    if (x.match(/感谢您的参与，现在将转入评分前页面/)) {
      let script = document.createElement('script');
      script.textContent = `ajaxget('forum.php?mod=viewthread&tid=${tid}&viewpid=${pid}', 'post_${pid}', 'post_${pid}');`;
      document.head.appendChild(script);
    } else {
      return Promise.reject((x.match(/<!\[CDATA\[([^<]+)/) || [])[1] || x)
    }
  });
}

if (formhash) {
  [].forEach.call(document.querySelectorAll('#postlist > div > table.plhin'),
      function(table) {
    var a = document.createElement('a');
    a.href = 'javascript:void(0)';
    a.className = 'cmmnt';
    a.appendChild(document.createTextNode('红包楼奖励'));
    a.addEventListener('click', (function(pid) {
      return function() {
        rate(Water, Popularity, Reason, pid, ThreadId, true).catch(e => alert(`评分失败：${e}`));
      };
    })(table.id.replace(/^pid/, '')), false);
    var em = table.querySelector('div.po.hin div.pob.cl em');
    em.insertBefore(a, em.children[1]);
  });
}

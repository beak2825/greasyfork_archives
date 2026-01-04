// ==UserScript==
// @name         百度统计实时访客增强优化 - GzNotes.com
// @namespace    https://www.gznotes.com/manual/helpDoc/bdTjLatestOpt.php
// @version      0.7
// @description  优化、增强百度统计页面表格的功能和用户体验，方便用户直观观察数据、统计和查询。
// @author       Daniel Ting
// @license      GPL-3.0-only
// @grant        none
// @match        https://tongji.baidu.com/main/overview/*/trend/*
// @create       2020-03-14
// @note         2020.07-01-V0.2 更新选择器，解决脚本失效问题。原因：百度更新了页面元素属性
// @note         2021.01-06-V0.3 更新ip地址查询链接，采用ip138 PC端，信息更全面
// @note         2021.01-14-V0.4 关键词查询改为“百谷歌度”，方便同时查看多个搜索引擎的搜索结果和排名情况（百度，谷歌，神马，360，bing等可以自己选择）
// @note         2022.06-03-V0.5 适配新版百度统计实时访客url;自动设置加载条目100;访问路径清除Host;若干优化和bug修复;
// @note         2022.06-12-V0.6 优化：支持仅查看IP/访客；修正无需翻页列表的支持
// @note         2022.06-20-V0.7 性能优化;访问路径显示无host完整地址;优化path-info内容排版
// @downloadURL https://update.greasyfork.org/scripts/398081/%E7%99%BE%E5%BA%A6%E7%BB%9F%E8%AE%A1%E5%AE%9E%E6%97%B6%E8%AE%BF%E5%AE%A2%E5%A2%9E%E5%BC%BA%E4%BC%98%E5%8C%96%20-%20GzNotescom.user.js
// @updateURL https://update.greasyfork.org/scripts/398081/%E7%99%BE%E5%BA%A6%E7%BB%9F%E8%AE%A1%E5%AE%9E%E6%97%B6%E8%AE%BF%E5%AE%A2%E5%A2%9E%E5%BC%BA%E4%BC%98%E5%8C%96%20-%20GzNotescom.meta.js
// ==/UserScript==

/*
标记说明

    背景色：
        1分钟，宽度100%
        小于1分钟，宽度按照比例伸展
        大于1分钟，不透明度按照时长加深

    边框：
        访问页面数大于2，开始标记
        访问页面数越大，边框越粗

快捷键：

    方向键右→   ：上一页
    方向键左←   ：下一页
    Ctrl - D   ：手动执行标记
    Backspace  ：查询返回

其他用户体验优化：
    1.搜索关键词点击后直接调用百度进行搜索（查看现有排名情况）
        注：来源处的链接是遵循访客当时的链接落地的，而不能反映当前的情况。
    2.ip图标、访客标识图标，点击后直接跳转
    3.ip点击后一键查询，解决百度ip未识别的记录
    4.入口页面右键单击，直接查询访问该链接的所有记录。
Todo
    无限加载
    表内节点驱动(这样就不用给各个操作按钮绑定事件或者使用手动标记了)
*/

(function () {
  'use strict';
  const
    gi = o => document.getElementById(o),
    qae = (s, c, base = null) => (base ? base : document).querySelectorAll(s).forEach(o => c(o)),
    qe = s => document.querySelector(s),
    ael = (e, c) => document.addEventListener(e, c),
    loopDelay = 400,
    clearHost = txt => {
      return txt.replace(/https?:\/\/[^\/]+\/?/, '').trim() || '/'
    }

  function optimize () {
    let tt = setTimeout(function loop () {
      ['.cpu-footer', '.page-bottom-hint'].forEach(s => {
        const o = qe(s);
        o && o.remove()
      });

      if (qe('.loading')) {
        tt = setTimeout(loop, loopDelay)
        return
      }

      let lines = document.getElementsByClassName('line');
      if (lines.length) {
        const pageSize = qe('li.cst-dp-item-selected')
        if (pageSize && pageSize.attributes.data.value !== '100') {
          const item = qe('a.cst-dp-item-label[title="100"]');
          item && item.click()
          tt = setTimeout(loop, loopDelay)
          return
        }
      }

      let swd = gi('searchword');
      if (lines.length && swd) {

        if (swd.classList.contains('GzNotes')) {
          clearTimeout(tt);
          return;
        }

        qae('.empty-col,.number-col', o => o.remove());
        let tbs = qe('#table table').style;
        tbs.width = '100%';
        tbs.position = 'relative';
        swd.style.width = '210px';
        gi('visitorId').style.width = '60px';
        gi('start_time').style.width = '85px';
        gi('area').style.maxWidth = '70px';//可4-5个汉字
        gi('source').style.width = '120px';
        gi('access_page').style.width = '220px';
        //gi('ip').style.width='120px';
        gi('visit_time').style.width = '70px';
        qae('.expand-col .td-content,.visitorId .operate-btn,.url a,.searchword span,.ip .td-content', o => {
          let _os = o.style;
          _os.position = 'relative';
          _os.zIndex = 10;
          _os.borderRadius = '5px';
        });
        qae('.start_time span', o => {
          o.innerText = o.innerText.replace(/^\d{4}\//, '')
        });
        qae('.source a', o => {
          o.innerText = o.innerText.replace(/https?:\/\//, '')
        });
        qae('.access_page a', o => {
          let ctn = o.innerText;
          o.innerText = clearHost(ctn);
          o.addEventListener('mousedown', e => {
            if (2 === e.button) {
              e.preventDefault();
              gi('landing-page-value').value = ctn;
              gi('query-visitor').click();
            }
          }, false);
        });
        qae('.searchword span', o => {
          if (o.title === '--') return;
          o.innerText = o.title;
          o.style.cursor = 'pointer';
          o.addEventListener('click', () => window.open('https://www.gobaidugle.com/search4?num=10&one=baidu&two=google&three=bing&four=so&rsv_enter=1&rsv_bp=1&keyword=' + encodeURI(o.innerText)));
        });
        qae('.visitorId span', o => {
          o.style.visibility = 'hidden';
          o.style.width = '30px'
        });

        // visit pages count
        qae('.visit_pages', o => {
          let num = parseInt(o.innerText);
          if (num > 1) {
            let ops = o.parentElement.style;
            ops.border = '0 solid #f00';
            ops.borderWidth = Math.min(Math.max(2, Math.ceil(num / 2)), 10) + 'px';
          }
        });

        // visit duration
        qae('.visit_time', o => {
          let t = o.innerText;
          if (/\d/.test(t)) {
            let [min, sec] = t.replace(`"`, '').split(`'`);
            if ('undefined' === typeof sec) {
              sec = min;
              min = 0;
            }
            let r = 100 * (60 * parseInt(min) + parseInt(sec)) / 60,
              w = Math.min(100, r),
              p = r > 100 ? Math.min(0.5, (r - 100) / 1000 + 0.15) : 0.15;
            let div = document.createElement('div'),
              op = o.parentElement;
            div.style = `position:absolute;height:40px;margin-bottom:-40px;background:#ff42c5;opacity:${p};width:${w}%`;
            op.parentElement.insertBefore(div, o.parentElement);
          }
        });

        qae('.operate-btn', o => {
          o.addEventListener('click', () => {
            qe('#OperationItems > li > a').click()
          });
        });

        qae('.ip span', o => {
          o.style.cursor = 'pointer';
          o.addEventListener('click', () => {
            window.open('https://www.ip138.com/iplookup.asp?action=2&ip=' + o.innerText)
          })
        });

        // now ok, change the sign
        swd.classList.add('GzNotes');

        clearTimeout(tt);
        tt = null;
        return;
      }
      tt = setTimeout(loop, loopDelay);
    }, loopDelay);
  }

  // run immediately to avoid being locked by other errors
  // which could cause marking failed at the first time
  optimize();

  ael('keydown', e => {
    if (e.ctrlKey && 'd' === e.key) {
      e.preventDefault();
      optimize();
    }
  });

  ael('keyup', e => {
    const s = { ArrowRight: 'a.next', ArrowLeft: 'a.previous', Backspace: '#cancel-visitor' }[e.key];
    if (s && qe(s)) {
      qe(s).click();
      optimize()
    }
  });

  document.body.addEventListener('click', e => {
    let o = e.target;
    if ('INPUT' === o.tagName) {
      return;
    }
    const cl = o.classList
    if (
      ~['query-visitor', 'cancel-visitor'].indexOf(o.id)
      || ['number', 'next', 'previous', 'onlyOneVisitor', 'onlyOneIp'].some(c => cl.contains(c))
      // || ('A' === o.tagName && e.path.find(a => a.id && 'paging' === a.id))
    ) {
      optimize();
    }
  });

  setTimeout(function replaceHost () {
    qae('.path-info:not(.gzn)', dom => {
      qae('a', o => {
        const text = o.title
        if (text.indexOf('http') === 0) {
          o.title = ''
          o.innerText = clearHost(text)
        }
      }, dom)
      qae('tr>td:first-child', o => o.remove(), dom)
      dom.classList.add('gzn')
    })
    setTimeout(replaceHost, loopDelay)
  }, loopDelay)
})();
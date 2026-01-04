// ==UserScript==
// @name         山海|安全微伴刷课脚本|考试脚本|大学生新生入学安全教育
// @namespace    https://greasyfork.org/zh-CN/scripts/475586
// @description  用于处理安全微伴学习平台的课程，脚本可以一键完成学习任务，查询考试题目答案。
// @version      2.2.2
// @license      GPL-3.0
// @author       山海不爱玩
// @match        https://weiban.mycourse.cn/*
// @match        https://mcwk.mycourse.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      117.72.179.172
// @downloadURL https://update.greasyfork.org/scripts/475586/%E5%B1%B1%E6%B5%B7%7C%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%7C%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC%7C%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%96%B0%E7%94%9F%E5%85%A5%E5%AD%A6%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/475586/%E5%B1%B1%E6%B5%B7%7C%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC%7C%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC%7C%E5%A4%A7%E5%AD%A6%E7%94%9F%E6%96%B0%E7%94%9F%E5%85%A5%E5%AD%A6%E5%AE%89%E5%85%A8%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function () {
  'use strict';
    function a(url, b = {}) {
        return new Promise((c, d) => {
            const e = {
                method: b.method || 'GET',
                url: url,
                headers: b.headers || {
                    'Content-Type': 'application/json'
                },
                onload: function(f) {
                    try {
                        const g = JSON.parse(f.responseText);
                        if (f.status >= 200 && f.status < 300) {
                            c(g);
                        } else {
                            const h = new Error(`API\u8bf7\u6c42\u5931\u8d25\uff0c\u72b6\u6001\u7801: ${f.status}`);
                            h.response = f;
                            d(h);
                        }
                    } catch (i) {
                        d(new Error('\u89e3\u6790\u54cd\u5e94\u6570\u636e\u5931\u8d25'));
                    }
                },
                onerror: d,
                ontimeout: () => d(new Error('\u8bf7\u6c42\u8d85\u65f6'))
            };

            if (b.data) {
                e.data = JSON.stringify(b.data);
            }

            GM_xmlhttpRequest(e);
        });
    }

    function j(k) {
        const l = document.createElement('div');
        l.id = k.barId;

        l.style.cssText = `
            position: relative;
            z-index: 1000;
            width: 100%;
            padding: 12px 20px;
            background-color: ${k.backgroundColor};
            color: ${k.textColor};
            text-align: center;
            font-size: 15px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            box-sizing: border-box;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `;

        const m = document.createElement('style');
        m.innerHTML = `
            #${k.barId} a {
                color: #ffeb3b;
                text-decoration: underline;
                margin-left: 5px;
            }
            #${k.barId} a:hover {
                color: #fff;
            }
        `;
        document.head.appendChild(m);

        return l;
    }

    async function n() {
        const o = {
            targetSelector: '.page-WH',
            apiUrl: 'http://117.72.179.172:5252/notc.php',
            defaultContent: '\u811a\u672c\u6b63\u5e38\u8fd0\u884c\u4e2d',
            backgroundColor: '#333',
            textColor: '#fff',
            barId: 'my-custom-announcement-bar',
            timeout: 5000
        };

        const p = document.querySelector(o.targetSelector);
        if (!p) {
            console.warn(`\u672a\u627e\u5230\u76ee\u6807\u5bb9\u5668: ${o.targetSelector}`);
            return;
        }

        const q = j(o);

        q.innerHTML = o.defaultContent;

        p.prepend(q);

        try {
            const r = await a(o.apiUrl, {
                timeout: o.timeout
            });

            if (r.code === 1 && r.msg) {
                q.innerHTML = r.msg;
            }
        } catch (s) {
            console.error('\u83b7\u53d6\u516c\u544a\u5185\u5bb9\u5931\u8d25:', s);
        }
    }

  function t() {
    if (window.location.href.includes('mcwk.mycourse.cn')) {
      u();
        n();
    } else {
      v();
    }
  }

  function v() {
    const w = x('\uD83D\uDD0D \u67e5\u8be2\u7b54\u6848', '#4285F4');
    const y = z();
    document.body.appendChild(w);
    document.body.appendChild(y);

    w.addEventListener('click', function () {
      const A = B();
      if (A) {
        C(A.questionType, A.questionText, y);
      } else {
        D('\u8bf7\u5728\u7b54\u9898\u9875\u9762\u4f7f\u7528\u6b64\u529f\u80fd', false, y);
      }
    });
  }

  function B() {
    const E = document.querySelector('.quest-category');
    const F = document.querySelector('.quest-stem');
    if (!E || !F) {
      console.error('\u627e\u4e0d\u5230\u95ee\u9898\u7c7b\u578b\u6216\u95ee\u9898\u5185\u5bb9\u7684\u5143\u7d20');
      return null;
    }

    const G = E.innerText;
    const H = F.innerText;
    return { questionType: G, questionText: H };
  }

  function C(I, J, K) {
    D('\u67e5\u8be2\u4e2d...', false, K);

    const L = `http://117.72.179.172:5252/query_answer.php?question=${encodeURIComponent(J)}`;

    GM_xmlhttpRequest({
      method: 'GET',
      url: L,
      onload: function(M) {
        N(M, I, K, J);
      },
      onerror: function(O) {
        P(O, K);
      },
    });
  }

  function N(Q, R, S, T) {
    try {
      const U = JSON.parse(Q.responseText);

      if (U.code === 1 && U.answer && U.answer.length > 0) {
        const V = U.answer;

        if (R === '\u591a\u9009\u9898' || R === '\u5355\u9009\u9898') {
          const W = document.querySelectorAll('.quest-option-top');
          let X = 0;

          for (const Y of V) {
            for (const Z of W) {
              const aa = Z.innerText.substring(2);
              if (aa === Y) {
                Z.click();
                X++;
                break;
              }
            }
          }

          let ab = '';
          if (X === V.length) {
            ab = '\u5df2\u81ea\u52a8\u586b\u5199\u6240\u6709\u7b54\u6848';
            const ac = document.getElementsByClassName('mint-button-text')[2];
            if (ac) {
              ac.click();
              ab += '\u5e76\u8df3\u8f6c';
            }
          } else {
            ab = `\u627e\u5230${X}\u4e2a\u7b54\u6848(\u5171${V.length}\u4e2a)`;
          }

          const ad = `\u9898\u76ee|${T}\n\u7b54\u6848|${V.join('\u3001')}\n\u72b6\u6001|${ab}`;
          D(ad, true, S);
        } else {
          const ae = `\u9898\u76ee|${T}\n\u7b54\u6848|${V.join('\n')}\n\u72b6\u6001|${U.msg}`;
          D(ae, true, S);
        }
      } else {
        const af = `\u9898\u76ee|${T}\n\u72b6\u6001|${U.msg || '\u672a\u67e5\u8be2\u5230\u7b54\u6848'}`;
        D(af, true, S);
      }
    } catch (ag) {
      P('\u670d\u52a1\u5668\u8fd4\u56de\u6570\u636e\u683c\u5f0f\u9519\u8bef', S);
    }
  }

function u() {
    const ah = document.createElement('button');
    ah.id = 'execute-finishWx-btn';
    ah.innerHTML = '\u4e00\u952e\u5b8c\u6210 (<span id="countdown-text">15</span>\u79d2)';
    ah.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999;
        width: auto;
        height: 36px;
        background-color: #cccccc;
        color: #666666;
        border: none;
        border-radius: 18px;
        cursor: not-allowed;
        font-size: 14px;
        font-weight: 500;
        outline: none;
        box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;
    `;

    ah.addEventListener('mouseover', function() {
        if (!this.disabled) {
            this.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)';
            this.style.transform = 'translateY(-1px)';
        }
    });
    ah.addEventListener('mouseout', function() {
        this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
        this.style.transform = 'none';
    });
    ah.addEventListener('mousedown', function() {
        if (!this.disabled) {
            this.style.transform = 'translateY(1px)';
            this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        }
    });

    let ai = 15;
    const aj = ah.querySelector('#countdown-text');
    const ak = setInterval(() => {
        ai--;
        aj.textContent = ai;

        if (ai <= 0) {
            clearInterval(ak);
            ah.disabled = false;
            ah.innerHTML = '\uD83D\uDE80 \u4e00\u952e\u5b8c\u6210';
            ah.style.backgroundColor = '#4285F4';
            ah.style.color = 'white';
            ah.style.cursor = 'pointer';
        }
    }, 1000);

    ah.addEventListener('click', al);
    document.body.appendChild(ah);
}

  function al() {
    try {
      if (typeof finishWxCourse === 'function') {
        console.log('\u627e\u5230finishWxCourse\u51fd\u6570\uff0c\u6b63\u5728\u6267\u884c...');
        finishWxCourse();
        console.log('finishWxCourse\u51fd\u6570\u6267\u884c\u5b8c\u6210');
      } else {
        console.error('\u5f53\u524d\u9875\u9762\u4e2d\u672a\u627e\u5230finishWxCourse\u51fd\u6570');
      }
    } catch (am) {
      console.error(`\u6267\u884cfinishWxCourse\u51fd\u6570\u65f6\u51fa\u9519: ${am.message}`, am);
    }
  }

  function x(an, ao) {
    const ap = document.createElement('button');
    ap.innerHTML = an;
    ap.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      width: auto;
      height: 36px;
      background-color: ${ao};
      color: ${ao === '#cccccc' ? '#666666' : 'white'};
      border: none;
      border-radius: 18px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      outline: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 16px;
    `;
    ap.onmouseover = function() {
      if (!this.disabled) {
        this.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)';
        this.style.transform = 'translateY(-1px)';
      }
    };
    ap.onmouseout = function() {
      this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
      this.style.transform = 'none';
    };
    ap.onmousedown = function() {
      if (!this.disabled) {
        this.style.transform = 'translateY(1px)';
        this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
      }
    };
    return ap;
  }

  function z() {
    const aq = document.createElement('div');
    aq.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      background-color: #fff;
      border: none;
      padding: 0;
      max-width: 320px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: none;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.5;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    `;

    const ar = document.createElement('div');
    ar.style.cssText = `
      background-color: #4285F4;
      color: white;
      padding: 12px 16px;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    ar.innerHTML = '<span>\u67e5\u8be2\u7ed3\u679c</span>';

    const as = document.createElement('span');
    as.innerHTML = '×';
    as.style.cssText = `
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      padding: 0 0 2px 10px;
    `;
    as.onclick = function() {
      aq.style.display = 'none';
    };

    ar.appendChild(as);
    aq.appendChild(ar);

    const at = document.createElement('div');
    at.style.cssText = `
      padding: 16px;
      background-color: #fff;
    `;
    at.id = 'notification-content';
    aq.appendChild(at);

    return aq;
  }

  function D(au, av, aw) {
    if (!aw) return;

    const ax = aw.querySelector('#notification-content');
    ax.innerHTML = '';

    if (av) {
      const ay = document.createElement('table');
      ay.style.cssText = `
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        margin: 0;
      `;

      const az = (ba, bb, bc = false) => {
        const bd = ay.insertRow();

        const be = bd.insertCell(0);
        be.textContent = ba;
        be.style.cssText = `
          padding: 8px 12px;
          font-weight: 500;
          color: #5F6368;
          white-space: nowrap;
          border-bottom: ${bc ? 'none' : '1px solid #e0e0e0'};
        `;

        const bf = bd.insertCell(1);
        bf.textContent = bb;
        bf.style.cssText = `
          padding: 8px 12px;
          color: #202124;
          word-break: break-word;
          border-bottom: ${bc ? 'none' : '1px solid #e0e0e0'};
        `;
      };

      const bg = au.split('\n');
      bg.forEach((bh, bi) => {
        const bj = bh.indexOf('|');
        if (bj > -1) {
          const bk = bh.substring(0, bj).trim();
          const bl = bh.substring(bj + 1).trim();
          az(bk, bl, bi === bg.length - 1);
        } else {
          const bm = ay.insertRow();
          const bn = bm.insertCell(0);
          bn.colSpan = 2;
          bn.textContent = bh;
          bn.style.cssText = `
            padding: 8px 12px;
            color: #5F6368;
            font-style: italic;
            text-align: center;
            border-bottom: ${bi === bg.length - 1 ? 'none' : '1px solid #e0e0e0'};
          `;
        }
      });

      ax.appendChild(ay);
    } else {
      const bo = document.createElement('div');
      bo.textContent = au;
      bo.style.cssText = `
        padding: 12px;
        color: #5F6368;
        text-align: center;
      `;
      ax.appendChild(bo);
    }

    aw.style.display = 'block';
  }

  function P(bp, bq) {
    console.error("API Error:", bp);
    const br = `\u9519\u8bef\u7c7b\u578b|\u8fde\u63a5\u5931\u8d25\n\u8be6\u7ec6\u4fe1\u606f|${bp}\n\u5efa\u8bae|\u8bf7\u68c0\u67e5\u672c\u5730\u670d\u52a1\u662f\u5426\u5f00\u542f`;
    D(br, true, bq);
  }

  if (document.readyState === 'complete') {
    t();
  } else {
    window.addEventListener('load', t);
  }
})();
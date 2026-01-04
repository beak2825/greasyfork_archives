// ==UserScript==
// @name         全自动山海|数字匹配与自动点击融合脚本
// @namespace    https://greasyfork.org/zh-CN/scripts/475586
// @description  融合了数字匹配检测与自动点击操作。当数字不匹配时，自动点击课程列表；当数字匹配时，自动点击下一个任务。同时保留原有的查询答案等功能。
// @version      3.0
// @license      GPL-3.0
// @author       山海不爱玩&MomoneChionoi (融合修改版)
// @match        https://weiban.mycourse.cn/*
// @match        https://mcwk.mycourse.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      117.72.179.172
// @downloadURL https://update.greasyfork.org/scripts/547424/%E5%85%A8%E8%87%AA%E5%8A%A8%E5%B1%B1%E6%B5%B7%7C%E6%95%B0%E5%AD%97%E5%8C%B9%E9%85%8D%E4%B8%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%9E%8D%E5%90%88%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/547424/%E5%85%A8%E8%87%AA%E5%8A%A8%E5%B1%B1%E6%B5%B7%7C%E6%95%B0%E5%AD%97%E5%8C%B9%E9%85%8D%E4%B8%8E%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E8%9E%8D%E5%90%88%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 从脚本2保留的辅助函数 ---
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
                            const h = new Error(`API请求失败，状态码: ${f.status}`);
                            h.response = f;
                            d(h);
                        }
                    } catch (i) {
                        d(new Error('解析响应数据失败'));
                    }
                },
                onerror: d,
                ontimeout: () => d(new Error('请求超时'))
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
            defaultContent: '脚本正常运行中',
            backgroundColor: '#333',
            textColor: '#fff',
            barId: 'my-custom-announcement-bar',
            timeout: 5000
        };

        const p = document.querySelector(o.targetSelector);
        if (!p) {
            console.warn(`未找到目标容器: ${o.targetSelector}`);
            return;
        }

        const q = j(o);
        q.innerHTML = o.defaultContent;
        p.prepend(q);

        try {
            const r = await a(o.apiUrl, { timeout: o.timeout });
            if (r.code === 1 && r.msg) {
                q.innerHTML = r.msg;
            }
        } catch (s) {
            console.error('获取公告内容失败:', s);
        }
    }

    function v() {
        const w = x('🔍 查询答案', '#4285F4');
        const y = z();
        document.body.appendChild(w);
        document.body.appendChild(y);

        w.addEventListener('click', function () {
            const A = B();
            if (A) {
                C(A.questionType, A.questionText, y);
            } else {
                D('请在答题页面使用此功能', false, y);
            }
        });
    }

    function B() {
        const E = document.querySelector('.quest-category');
        const F = document.querySelector('.quest-stem');
        if (!E || !F) {
            console.error('找不到问题类型或问题内容的元素');
            return null;
        }

        const G = E.innerText;
        const H = F.innerText;
        return { questionType: G, questionText: H };
    }

    function C(I, J, K) {
        D('查询中...', false, K);
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
                if (R === '多选题' || R === '单选题') {
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
                        ab = '已自动填写所有答案';
                        const ac = document.getElementsByClassName('mint-button-text')[2];
                        if (ac) {
                            ac.click();
                            ab += '并跳转';
                        }
                    } else {
                        ab = `找到${X}个答案(共${V.length}个)`;
                    }
                    const ad = `题目|${T}\n答案|${V.join('、')}\n状态|${ab}`;
                    D(ad, true, S);
                } else {
                    const ae = `题目|${T}\n答案|${V.join('\n')}\n状态|${U.msg}`;
                    D(ae, true, S);
                }
            } else {
                const af = `题目|${T}\n状态|${U.msg || '未查询到答案'}`;
                D(af, true, S);
            }
        } catch (ag) {
            P('服务器返回数据格式错误', S);
        }
    }

    function u() {
        const ah = document.createElement('button');
        ah.id = 'execute-finishWx-btn';
        ah.innerHTML = '一键完成 (<span id="countdown-text">18</span>秒)';
        ah.style.cssText = `
            position: fixed; bottom: 20px; left: 20px; z-index: 9999; width: auto; height: 36px;
            background-color: #cccccc; color: #666666; border: none; border-radius: 18px; cursor: not-allowed;
            font-size: 14px; font-weight: 500; outline: none; box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            transition: all 0.3s ease; display: flex; align-items: center; justify-content: center; padding: 0 16px;
        `;
        ah.addEventListener('mouseover', function() { if (!this.disabled) { this.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)'; this.style.transform = 'translateY(-1px)'; } });
        ah.addEventListener('mouseout', function() { this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)'; this.style.transform = 'none'; });
        ah.addEventListener('mousedown', function() { if (!this.disabled) { this.style.transform = 'translateY(1px)'; this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; } });

        let ai = 17;
        const aj = ah.querySelector('#countdown-text');
        const ak = setInterval(() => {
            ai--;
            aj.textContent = ai;
            if (ai <= 0) {
                clearInterval(ak);
                ah.disabled = false;
                ah.innerHTML = '🚀 一键完成';
                ah.style.backgroundColor = '#4285F4';
                ah.style.color = 'white';
                ah.style.cursor = 'pointer';
                ah.click();
                console.log("倒计时结束，自动点击'一键完成'按钮。");
            }
        }, 1000);

        ah.addEventListener('click', al);
        document.body.appendChild(ah);
    }

    function al() {
        try {
            if (typeof finishWxCourse === 'function') {
                console.log('找到finishWxCourse函数，正在执行...');
                finishWxCourse();
                console.log('finishWxCourse函数执行完成');
                setTimeout(() => {
                    const popupConfirmButton = document.querySelector('body > div.pop-jsv > div > div > a');
                    if (popupConfirmButton) {
                        popupConfirmButton.click();
                        console.log("600ms后点击了弹出框确认按钮。");
                    } else {
                        console.warn("执行finishWxCourse后未找到弹出框确认按钮。");
                    }
                }, 600);
            } else {
                console.error('当前页面中未找到finishWxCourse函数');
            }
        } catch (am) {
            console.error(`执行finishWxCourse函数时出错: ${am.message}`, am);
        }
    }

    function x(an, ao) {
        const ap = document.createElement('button');
        ap.innerHTML = an;
        ap.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; z-index: 9999; width: auto; height: 36px;
            background-color: ${ao}; color: ${ao === '#cccccc' ? '#666666' : 'white'}; border: none;
            border-radius: 18px; cursor: pointer; font-size: 14px; font-weight: 500; outline: none;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15); transition: all 0.3s ease; display: flex;
            align-items: center; justify-content: center; padding: 0 16px;
        `;
        ap.onmouseover = function() { if (!this.disabled) { this.style.boxShadow = '0 3px 8px rgba(0,0,0,0.2)'; this.style.transform = 'translateY(-1px)'; } };
        ap.onmouseout = function() { this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)'; this.style.transform = 'none'; };
        ap.onmousedown = function() { if (!this.disabled) { this.style.transform = 'translateY(1px)'; this.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; } };
        return ap;
    }

    function z() {
        const aq = document.createElement('div');
        aq.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 9999; background-color: #fff; border: none;
            padding: 0; max-width: 320px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); display: none;
            border-radius: 12px; font-size: 14px; line-height: 1.5; overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        `;
        const ar = document.createElement('div');
        ar.style.cssText = `
            background-color: #4285F4; color: white; padding: 12px 16px; font-weight: 500;
            display: flex; justify-content: space-between; align-items: center;
        `;
        ar.innerHTML = '<span>查询结果</span>';
        const as = document.createElement('span');
        as.innerHTML = '×';
        as.style.cssText = `cursor: pointer; font-size: 20px; line-height: 1; padding: 0 0 2px 10px;`;
        as.onclick = function() { aq.style.display = 'none'; };
        ar.appendChild(as);
        aq.appendChild(ar);
        const at = document.createElement('div');
        at.style.cssText = `padding: 16px; background-color: #fff;`;
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
            ay.style.cssText = `width: 100%; border-collapse: separate; border-spacing: 0; margin: 0;`;
            const az = (ba, bb, bc = false) => {
                const bd = ay.insertRow();
                const be = bd.insertCell(0);
                be.textContent = ba;
                be.style.cssText = `padding: 8px 12px; font-weight: 500; color: #5F6368; white-space: nowrap; border-bottom: ${bc ? 'none' : '1px solid #e0e0e0'};`;
                const bf = bd.insertCell(1);
                bf.textContent = bb;
                bf.style.cssText = `padding: 8px 12px; color: #202124; word-break: break-word; border-bottom: ${bc ? 'none' : '1px solid #e0e0e0'};`;
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
                    bn.style.cssText = `padding: 8px 12px; color: #5F6368; font-style: italic; text-align: center; border-bottom: ${bi === bg.length - 1 ? 'none' : '1px solid #e0e0e0'};`;
                }
            });
            ax.appendChild(ay);
        } else {
            const bo = document.createElement('div');
            bo.textContent = au;
            bo.style.cssText = `padding: 12px; color: #5F6368; text-align: center;`;
            ax.appendChild(bo);
        }
        aw.style.display = 'block';
    }

    function P(bp, bq) {
        console.error("API Error:", bp);
        const br = `错误类型|连接失败\n详细信息|${bp}\n建议|请检查本地服务是否开启`;
        D(br, true, bq);
    }

    // --- 融合后的核心逻辑 ---

    // 用于“数字不匹配”时点击的目标
    const mismatchClickTargets = [
        '#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(1) > div.van-collapse-item__wrapper > div > ul > li:nth-child(1)',
        '#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > div.van-collapse-item__wrapper > div > ul > li:nth-child(1)',
        '#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(3) > div.van-collapse-item__wrapper > div > ul > li:nth-child(1)',
        '#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(4) > div.van-collapse-item__wrapper > div > ul > li:nth-child(1)',
        '#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(5) > div.van-collapse-item__wrapper > div > ul > li:nth-child(1)'
    ];

    // 公用的点击函数
    function clickElement(selector, logPrefix = '已点击') {
        const el = document.querySelector(selector);
        if (el) {
            el.click();
            console.log(`%c${logPrefix}: ${selector}`, 'color: #FF9800; font-weight: bold');
        } else {
            console.log(`%c点击失败: 元素未找到 -> ${selector}`, 'color: #f44336; font-weight: bold');
        }
    }


    /**
     * 核心检测函数 (来自脚本1，并已修改)
     * 每秒执行一次，根据数字匹配结果执行不同操作
     */
    function performChecks() {
        try {
            const now = new Date().toLocaleTimeString();
            console.log(`\n%c[${now}] 开始检测...`, 'color: #2196F3; font-weight: bold');

            // 第一步：检测1-5中存在的元素并找到最大a值
            const existingElements = [];
            for (let a = 1; a <= 5; a++) {
                const existenceSelector = `#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(${a}) > div.van-collapse-item__wrapper > div > ul > li:nth-child(1)`;
                const element = document.querySelector(existenceSelector);
                if (element) {
                    existingElements.push(a);
                }
            }

            let maxA = null;
            if (existingElements.length > 0) {
                maxA = Math.max(...existingElements);
                console.log(`%c最大存在的a值: ${maxA}`, 'color: #9C27B0; font-weight: bold');
            } else {
                console.log(`%c检测结果: 1-5号元素均不存在`, 'color: #9E9E9E; font-weight: bold');
                return;
            }

            // 第二步：使用最大a值检测数字匹配
            const numberSelector = `#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(${maxA}) > div.van-cell.van-cell--clickable.van-collapse-item__title.van-collapse-item__title--expanded > div > div.count`;
            const targetElement = document.querySelector(numberSelector);

            if (!targetElement) {
                console.log(`%c数字检测: a=${maxA} 的目标元素未找到`, 'color: #999');
                return;
            }

            const text = targetElement.textContent.trim();
            const match = text.match(/(\d+)\s*\/\s*(\d+)/);

            if (match && match.length === 3) {
                const x = parseInt(match[1], 10);
                const y = parseInt(match[2], 10);
                console.log(`%c数字检测: 检测到数字: ${x} / ${y}`, 'color: #666');

                if (x === y) {
                    // **情况一：数字匹配** -> 点击 maxA + 1
                    console.log(`%c数字检测: ✅ 数字匹配!`, 'color: #0f9d58; font-weight: bold');
                    const clickA = maxA + 1;
                    console.log(`%c准备点击: a=${clickA} 位置的元素`, 'color: #FF5722; font-weight: bold');
                    const clickSelector = `#app > div > div.viewport > div.tabs-container > div:nth-child(2) > div:nth-child(3) > div:nth-child(${clickA}) > div > div > div.count`;
                    clickElement(clickSelector, `已点击 (a=${clickA})`);

                } else {
                    // **情况二：数字不匹配** -> 依次点击1-5号课程
                    console.log(`%c数字检测: ❌ 数字不匹配`, 'color: #db4437; font-weight: bold');
                    console.log('%c数字不匹配，触发课程列表自动点击序列...', 'color: #FFA500; font-weight: bold');
                    mismatchClickTargets.forEach((sel, idx) => {
                        // 使用延时确保点击操作之间有间隔
                        setTimeout(() => clickElement(sel, `不匹配-自动点击`), idx * 150);
                    });
                }
            } else {
                console.log(`%c数字检测: 未检测到符合格式的数字 (格式应为 x / y)`, 'color: #f4b400');
            }

        } catch (error) {
            console.error('%c检测过程中发生错误:', 'color: #db4437', error);
        }
    }


    // --- 主函数入口 ---
    function main() {
        if (window.location.href.includes('mcwk.mycourse.cn')) {
            // 课程播放页面
            u(); // 加载“一键完成”按钮
            n(); // 加载公告栏
        } else {
            // 主页面或考试页面
            v(); // 加载“查询答案”按钮和结果框
            // **启动核心检测循环，取代了原有的startTitleCheck**
            setInterval(performChecks, 1000);
        }
    }

    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }
})();
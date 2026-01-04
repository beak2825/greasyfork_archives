// ==UserScript==
// @name         新海天不帮你查课余量
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  适配新版教务系统的自动选课脚本（增强通知版）但不是人人都能用
// @author       上条当咩 & Claude
// @match        https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects/
// @icon         https://yaya.csoci.com:1314/files/spc_ico_sora_sd.jpg
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/521389/%E6%96%B0%E6%B5%B7%E5%A4%A9%E4%B8%8D%E5%B8%AE%E4%BD%A0%E6%9F%A5%E8%AF%BE%E4%BD%99%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/521389/%E6%96%B0%E6%B5%B7%E5%A4%A9%E4%B8%8D%E5%B8%AE%E4%BD%A0%E6%9F%A5%E8%AF%BE%E4%BD%99%E9%87%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 您的愿望单课程数组 - 只需填写课程号和序号，例如: ['M402001B 01', 'A121033B 01']
    var wishListCourses = [
        'M402005B 01',
        'M402005B 02',
    ];

    // 在这里填入密钥 - 防止扩散滥用
    const ak = ['请填入密钥'];  
    
    // 验证相关变量
    let vd = false;     // 验证状态
    let ni = {};        // 通知计时器
    let rn = {};        // 运行状态

    // 核心验证函数
    function cv() {
        const n = document.querySelector('strong.green');
        if (!n) return false;
        
        const un = n.textContent.trim();
        console.log('%c[课余量提醒] %c当前用户：%c' + un, 'color: #ff6b6b', 'color: #868e96', 'color: #51cf66');
        
        // 生成用户标识
        const ui = Array.from(new TextEncoder().encode(un)).map(b => b.toString(16)).join('');
        return ak.includes(ui);
    }

    // 通知相关函数
    function sn(c) {
        if (ni[c]) return;
        
        ni[c] = setInterval(() => {
            GM_notification({
                title: '课程余量提醒！',
                text: `课程 ${c} 有余量！点击停止提醒`,
                timeout: 0,
                onclick: () => en(c)
            });
        }, 500);
    }

    function en(c) {
        if (ni[c]) {
            clearInterval(ni[c]);
            delete ni[c];
            console.log(`已停止 ${c} 的通知`);
        }
    }

    function sa() {
        Object.keys(ni).forEach(c => en(c));
    }

    // 课程信息提取
    function gc(cell) {
        const e = cell.querySelector('.ellipsis');
        if (!e) return null;

        const d = e.getAttribute('title');
        if (!d) return null;

        const r = /([A-Z]\d{6}[A-Z]):.*?(\d{2})/;
        const m = d.match(r);

        if (m) {
            return {
                cc: m[1],
                sn: m[2],
                fc: `${m[1]} ${m[2]}`
            };
        }
        return null;
    }

    // UI操作函数
    function sb() {
        const b = document.getElementById('select-submit-btn');
        if (b) {
            b.click();
            console.log('提交按钮已点击');
            return true;
        }
        return false;
    }

    function hc() {
        const d = document.querySelector('.captcha-dialog:not(.hide)');
        if (d) {
            const i = d.querySelector('input[name="answer"]');
            if (i) {
                console.log('请输入验证码后按下回车');
                return true;
            }
        }
        return false;
    }

    function cb() {
        const b = document.querySelector('.btn-info[data-bb-handler="ok"]');
        if (b) {
            b.click();
            console.log('确认按钮已点击');
            sa();
            return true;
        }
        return false;
    }

    function cc(code) {
        const box = document.querySelector(`input[name="checkboxs"][kch="${code}"]`);
        if (box && !box.disabled) {
            box.click();
            console.log(`找到课程 ${code} 的复选框并点击`);

            setTimeout(() => {
                const hk = (e) => {
                    if (e.key === 'Enter') {
                        const u = document.querySelector('.btn[data-bb-handler="info"]');
                        if (u) {
                            u.click();
                            document.removeEventListener('keydown', hk);
                        }
                    }
                };

                document.addEventListener('keydown', hk);

                const u = document.querySelector('.btn[data-bb-handler="info"]');
                if (u) {
                    u.click();
                    document.removeEventListener('keydown', hk);
                }
            }, 500);
        }
    }

    // 提交函数
    function sm() {
        if (sb()) {
            vd = true;
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && hc()) {
                    cb();
                }
            });
        }
    }

    // 主循环
    function mn() {
        const t = document.querySelector('#current table');
        if (!t) return;

        const rows = t.querySelectorAll('tbody tr');
        let ac = 0;

        rows.forEach(r => {
            const cells = r.cells;
            if (cells.length >= 2) {
                const cc = cells[1];
                const sc = cells[0];

                const ci = gc(cc);
                if (ci && wishListCourses.includes(ci.fc)) {
                    const st = sc.textContent.trim();
                    console.log(`检查课程: ${ci.fc}, 状态: ${st}`);

                    if (!st.includes('无余量') && !st.includes('已选')) {
                        ac++;
                        if (!vd) cc(ci.cc);
                        sn(ci.fc);
                    }
                }
            }
        });

        if (ac > 0 && !vd) {
            sm();
        } else if (ac === 0) {
            setTimeout(() => location.reload(), 1000);
        }
    }

    // 启动函数
    function st() {
        console.log('%c[课余量提醒] %c脚本启动', 'color: #ff6b6b', 'color: #868e96');

        if (!cv()) {
            console.log('%c[课余量提醒] %c验证失败！请联系作者获取授权', 'color: #ff6b6b', 'color: #ff8787');
            GM_notification({
                title: '脚本验证失败',
                text: '为了防止太多人用脚本，我加了个密钥\n当前用户: ' + document.querySelector('strong.green').textContent.trim(),
                timeout: 0
            });
            return;
        }

        console.log('%c[课余量提醒] %c验证成功！开始运行', 'color: #ff6b6b', 'color: #51cf66');

        window.addEventListener('beforeunload', () => sa());

        mn();
    }

    // 防篡改保护
    Object.defineProperty(window, 'cv', {
        value: cv,
        writable: false,
        configurable: false
    });

    // 执行脚本
    st();
})();
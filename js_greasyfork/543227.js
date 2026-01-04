// ==UserScript==
// @name         明日方舟界园 - 掷出通宝成功概率计算器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @iconURL      https://torappu.prts.wiki/assets/roguelike_topic_itempic/rogue_5_copper_B_01.png
// @description  计算从花、衡、厉三种通宝中掷出n个时，某种特定通宝至少有m个的概率
// @author       幺幺幺幺吆
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543227/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E7%95%8C%E5%9B%AD%20-%20%E6%8E%B7%E5%87%BA%E9%80%9A%E5%AE%9D%E6%88%90%E5%8A%9F%E6%A6%82%E7%8E%87%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543227/%E6%98%8E%E6%97%A5%E6%96%B9%E8%88%9F%E7%95%8C%E5%9B%AD%20-%20%E6%8E%B7%E5%87%BA%E9%80%9A%E5%AE%9D%E6%88%90%E5%8A%9F%E6%A6%82%E7%8E%87%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建浮动按钮
    const floatBtn = document.createElement('button');
    floatBtn.title = '投钱'; // 保留文字提示作为鼠标悬停tooltip

    // 使用网络图片作为按钮背景
    floatBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        width: 80px;
        height: 80px;
        padding: 0;
        background: url('https://torappu.prts.wiki/assets/roguelike_topic_itempic/rogue_5_copper_B_01.png') no-repeat center/100%;
        background-color: none;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
    `;

    // 图片加载失败的回退方案
    floatBtn.innerHTML = `
        <span style="display:none; background-color: #60928B;">投钱</span>
    `;

    // 图片加载失败时显示文字
    floatBtn.onerror = function() {
        this.style.background = '#60928B';
        this.innerHTML = '投钱';
        this.style.fontWeight = 'bold';
        this.style.color = 'white';
        this.style.padding = '10px';
        this.style.borderRadius = '50px';
    };

    // 创建计算器界面
    const calculator = document.createElement('div');
    calculator.style.cssText = `
        transition: all 0.3s ease;
        opacity: 0;
        transform: translateY(20px);
        display: none;
        position: fixed;
        bottom: 70px;
        right: 20px;
        z-index: 9998;
        width: 300px;
        padding: 15px;
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
    `;
    
    calculator.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 15px; font-size: 18px; padding: 8px 0px; background-color: #d8ebe8; color: #19474d; text-align: center; font-weight: bold; border-radius: 5px;">
            掷出通宝成功概率计算器
        </h3>

        <h4 style="margin: 10px 0 5px 0; font-size: 14px; color: #555; text-align: center; font-weight: bold;">
            钱盒中通宝数量：
        </h4>
        
        <div style="display: flex; justify-content: center; margin-bottom: 15px; gap: 15px;">
            <div style="text-align: center;">
                <label style="display: block; color: #f06179; margin-bottom: 2px; font-size: 16px; font-weight: bold;">花</label>
                <input type="number" id="tm-a" min="0" max="20" value="1" style="width: 50px; text-align: center; border: 2px solid #f06179; border-radius: 5px;">
            </div>
            <div style="text-align: center;">
                <label style="display: block; color: #0da997; margin-bottom: 2px; font-size: 16px; font-weight: bold;">衡</label>
                <input type="number" id="tm-b" min="0" max="20" value="5" style="width: 50px; text-align: center; border: 2px solid #0da997; border-radius: 5px;">
            </div>
            <div style="text-align: center;">
                <label style="display: block; color: #941f33; margin-bottom: 2px; font-size: 16px; font-weight: bold;">厉</label>
                <input type="number" id="tm-c" min="0" max="20" value="4" style="width: 50px; text-align: center; border: 2px solid #941f33; border-radius: 5px;">
            </div>
        </div>

        <div style="border-top: 1px solid #60928B; margin: 15px 20px;"></div>

        <h4 style="margin: 15px 0 15px 0; font-size: 14px; color: #555; text-align: center; font-weight: bold;">
            掷出通宝：
        </h4>
        
        <div style="margin-bottom: 15px; display: flex; align-items: center;">
            <label style="width: 100px; text-align: right; font-size: 16px; color: #444; padding-right: 10px;">掷出数量：</label>
            <input type="number" id="tm-n" min="1" max="12" value="3" style="width: 50px; text-align: center; border: 2px solid #60928B; border-radius: 5px;">
        </div>

        <div style="margin-bottom: 15px; display: flex; align-items: center;">
            <span style="width: 100px; text-align: right; font-size: 16px; color: #444; padding-right: 10px;">掷出目标：</span>
            <div style="display: flex; gap: 15px;">
                <label style="display: flex; align-items: center;">
                    <input type="radio" name="target" value="a" style="margin-right: 5px; accent-color: #f06179;">
                    <span style="color: #f06179; font-size: 16px; font-weight: bold;">花</span>
                </label>
                <label style="display: flex; align-items: center;">
                    <input type="radio" name="target" value="b" style="margin-right: 5px; accent-color: #0da997;">
                    <span style="color: #0da997; font-size: 16px; font-weight: bold;">衡</span>
                </label>
                <label style="display: flex; align-items: center;">
                    <input type="radio" name="target" value="c" checked style="margin-right: 5px; accent-color: #941f33;">
                    <span style="color: #941f33; font-size: 16px; font-weight: bold;">厉</span>
                </label>
            </div>
        </div>

        <div style="margin-bottom: 15px; display: flex; align-items: center;">
            <label style="width: 100px; text-align: right; font-size: 16px; color: #444; padding-right: 10px;">至少数量：</label>
            <input type="number" id="tm-m" min="1" max="12" value="1" style="width: 50px; text-align: center; border: 2px solid #60928B; border-radius: 5px;">
        </div>

        <div style="text-align: center;">
            <button id="tm-calculate" style="padding: 8px 15px; background-color: #60928B; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                计算
            </button>
        </div>

        <div id="tm-result" style="margin-top: 15px; padding: 0px; font-size: 16px; background-color: #f8f8f8; color: #444; border-radius: 5px; border-left: 4px solid #60928B; text-align: center;"></div>
    `;
    
    document.body.appendChild(calculator);
    document.body.appendChild(floatBtn);

    // 显示/隐藏计算器
    floatBtn.addEventListener('click', () => {
        if (calculator.style.display === 'none') {
            calculator.style.display = 'block';
            // 使用requestAnimationFrame确保样式应用
            requestAnimationFrame(() => {
                calculator.style.opacity = '1';
                calculator.style.transform = 'translateY(0)';
            });
        } else {
            calculator.style.opacity = '0';
            calculator.style.transform = 'translateY(20px)';
            // 动画结束后隐藏元素
            setTimeout(() => {
                calculator.style.display = 'none';
            }, 300); // 与过渡时间一致
        }
    });

    // 计算概率
    document.getElementById('tm-calculate').addEventListener('click', () => {
        function combination(n, k) {
            if (k < 0 || k > n) return 0;
            if (k === 0 || k === n) return 1;
            k = Math.min(k, n - k);
            let res = 1;
            for (let i = 1; i <= k; i++) {
                res = res * (n - k + i) / i;
            }
            return res;
        }

        function hypergeometric(N, K, n, k) {
            return combination(K, k) * combination(N - K, n - k) / combination(N, n);
        }

        const a = parseInt(document.getElementById('tm-a').value) || 0;
        const b = parseInt(document.getElementById('tm-b').value) || 0;
        const c = parseInt(document.getElementById('tm-c').value) || 0;
        const n = parseInt(document.getElementById('tm-n').value) || 0;
        const target = document.querySelector('input[name="target"]:checked').value;
        const m = parseInt(document.getElementById('tm-m').value) || 0;

        const total = a + b + c;
        if (total > 20) {
            document.getElementById('tm-result').innerHTML = "<p style='color: #f44336; margin: 0; padding: 12px;'>错误：通宝总数量不能超过20</p>";
            return;
        }

        if (n > total) {
            document.getElementById('tm-result').innerHTML = "<p style='color: #f44336; margin: 0; padding: 12px;'>错误：掷出通宝数量不能超过通宝总数量</p>";
            return;
        }

        let K;
        let targetName;
        switch(target) {
            case 'a': 
                K = a; 
                targetName = "花"; 
                break;
            case 'b': 
                K = b; 
                targetName = "衡"; 
                break;
            case 'c': 
                K = c; 
                targetName = "厉"; 
                break;
            default: 
                K = 0; 
                targetName = "";
        }

        let prob = 0;
        for (let k = m; k <= Math.min(K, n); k++) {
            prob += hypergeometric(total, K, n, k);
        }

        const percentage = (prob * 100).toFixed(2);
        document.getElementById('tm-result').innerHTML = `
            <p style="padding: 12px;">
                <strong>结果：</strong> 从现有的 <strong>${total}</strong> 个通宝中掷出 <strong>${n}</strong> 个通宝，其中至少有 <strong>${m}</strong> 个
                <span style="color: ${target === 'a' ? '#f06179' : target === 'b' ? '#0da997' : '#941f33'}; font-weight: bold;">
                    ${targetName}
                </span>
                通宝的概率为 <span style="color: ${target === 'a' ? '#f06179' : target === 'b' ? '#0da997' : '#941f33'}; font-size: 18px; font-weight: bold;">${percentage}%</span>
            </p>
        `;
    });
})();
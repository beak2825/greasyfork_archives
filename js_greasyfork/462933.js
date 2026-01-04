// ==UserScript==
// @name            Hypothesis Button on Every Page / 每個頁面上的 Hypothesis 按鈕
// @namespace       iamfredchu
// @version         0.0.8
// @description     Add a button to enable Hypothesis on any webpage. The button will be removed after being clicked. / 在任意網頁上添加一個按鈕，以啟用 Hypothesis。點擊按鈕後，按鈕將被移除。
// @author          Fred Chu
// @match           https://*/*
// @inject-into     content
// @run-at          document-end
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/462933/Hypothesis%20Button%20on%20Every%20Page%20%20%E6%AF%8F%E5%80%8B%E9%A0%81%E9%9D%A2%E4%B8%8A%E7%9A%84%20Hypothesis%20%E6%8C%89%E9%88%95.user.js
// @updateURL https://update.greasyfork.org/scripts/462933/Hypothesis%20Button%20on%20Every%20Page%20%20%E6%AF%8F%E5%80%8B%E9%A0%81%E9%9D%A2%E4%B8%8A%E7%9A%84%20Hypothesis%20%E6%8C%89%E9%88%95.meta.js
// ==/UserScript==

(function() {
    function isHypothesisScriptAlreadyLoaded() {
        return !!document.querySelector('script[src="https://hypothes.is/embed.js"]');
    }

    function enableHypothesis(button) {
        const d = document;
        const s = document.createElement('script');
        s.setAttribute('src', 'https://hypothes.is/embed.js');
        d.body.appendChild(s);
        button.remove();
    }

    function createHypothesisButton() {
        const btn = document.createElement('button');
        btn.style.position = 'fixed';
        btn.style.bottom = '10px';
        btn.style.right = '10px';
        btn.style.zIndex = '9999';
        btn.style.backgroundColor = '#5A67D8';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '50%';
        btn.style.width = '40px';
        btn.style.height = '40px';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.fontSize = '18px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        btn.style.transition = 'background-color 0.3s';
        btn.textContent = 'H';

        const tooltip = document.createElement('span');
        tooltip.textContent = 'Enable Hypothesis';
        tooltip.style.position = 'absolute';
        tooltip.style.bottom = '100%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        tooltip.style.color = 'white';
        tooltip.style.borderRadius = '4px';
        tooltip.style.padding = '4px 8px';
        tooltip.style.fontSize = '12px';
        tooltip.style.whiteSpace = 'nowrap';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.3s';
        btn.appendChild(tooltip);

        btn.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
        });
        btn.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
        btn.addEventListener('click', () => enableHypothesis(btn));

        document.body.appendChild(btn);
        return btn;
    }

    if (!isHypothesisScriptAlreadyLoaded()) {
        const hypothesisButton = createHypothesisButton();
    }
})();

// ==UserScript==
// @name         语雀资源库添加复制链接按钮
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  语雀资源仓库添加复制链接按钮
// @author       You
// @match        https://www.yuque.com/melongz/assets*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415533/%E8%AF%AD%E9%9B%80%E8%B5%84%E6%BA%90%E5%BA%93%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/415533/%E8%AF%AD%E9%9B%80%E8%B5%84%E6%BA%90%E5%BA%93%E6%B7%BB%E5%8A%A0%E5%A4%8D%E5%88%B6%E9%93%BE%E6%8E%A5%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
  'use strict';

  window.onload = function () {

    const icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAEb0lEQVR4Xu2Zy4scVRTGv9MNwzBimoCBbBIjYoJLHws3ii4GNz4I+EAXgigTjXTXnUEGNMKkIVEYsOtcgq/WjYgQFfMHyIjPhQujS0kIRo2bGCG2MsLMoo/cUNVci+qZqr63qnvoKuhV3XvP9/3q3HMfTZjyh6bcPyoAVQZMOYFqCkx5AlRFsJoC1RQYIwGl1HFmPj5GCeOrAcY8gBVmHus0HEvw2Lz58lMHwDY/dQCS5qcKQJr5qQEwzHxU/f8CEP/O9fv9j2ZnZ9dWV1f/KWN1KLwIbmM+1aOIXCWi0wBOMfNPRYKYSACW4b8jCK8UBaFwAEb4KFmQMPwNM99TBIRSAGwFwewDlFIHABwgogdE5EEAB1PM/snMe3xDKA3AMAhpGyGl1AIA87sjYfgXZr7JJ4RSAaRB2GonqJT6GMCjCcOfMPNjviB4A5DnYJNnKzykfpxkZi+F0QuAlZWVmV6vdw7A+1lPd3kOQ0qpVwG8lFgd7vKxRHoBEATBM0T0XiTQHHHbWVI0Z9Z8n6gJbzHz0SxxtmrjBYBS6gsA91qB2lkzIauBqDC+E7cnot76+vqN3W63l3WMtHbOAIIgmCeiz+zBa7Xa/k6nc8lFWFrfIAh+JiJ7FXiKmT9wieMDQIuIdCxCRE5rrZ9wETWsr1LqXQDPWrE+1Vo/4hLLGYBS6m0ARywRLWY+5SJqCwBmmpnpdu0RkR+11re7xPIB4CsAg20qEd0fhuH/poSLQLvv0tLSwX6/b1ab+LnEzPtdxvcB4A8Agy2qiOzVWl92ETWs7/Ly8vWbm5vmgBQ//zLzdS6xfABYBzAXi5iZmdlV1Fm+2WzuqdfrBnj8XGbmveMG8BuAfbGIWq12qNPpnHcRlbUGAFhj5nmXWM4ZEATBD0R0myXiPmb+0kXUsL6Li4tHReQN6z0z86JLLGcASilzc/N4LIKIXg/D8EUXUcP6BkFwhogOx+9F5AWt9ZsusZwBtFqtw7Va7Ywl4jwzH3IRlda32WzeXK/XLyTezTPzmkssZwCmMm9sbPxKRLstIUeYuesiLNk35VT4LTPf7RrDGYARoJQyafi8JeYsM9+ZRVzOA9G1v9PMuCLynNZ6cDbIEiutjS8AtwL4DsAuK0imiwullADIfHiKMuHpRqNxS7vd3hzV+KBmuQ4Q91dKnQBwLDHetsYiAKbbtm2tWN7+VfaSAZawrwEk5+VrzPzyMNAWANMk812Crw/nFUBUD64AuCEh8CyAblphTAAoHYJ3ABGEi+aaO/mVROQiEX0O4EMi+j0MwwspAEqFUAiACELajW6ezC1lOhQGIIJgCmMzsTpMFIRCAUQQzBLZJKInRaSRx32elSHnuIPmhQOIIy0sLDTm5uYeEpGHicjUh91m9ygi9g7S9pF5WRzVvOlXGoCMy2DcrBTzkwqgNPOTCKBU85MGoHTzkwRgLOYnBYC3g80oq8HYV4FRRPvsUwHwSXMnjlVlwE78aj41Vxngk+ZOHKvKgJ341XxqnvoM+A+cPqlQ9EVWcgAAAABJRU5ErkJggg=='

    // 复制功能
    function copyToClip(content) {
      const aux = document.createElement("input");
      aux.setAttribute("value", content);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
    }

    function createLink () {
      const actionColList = Array.from(document.querySelectorAll('.ant-table-tbody tr td:last-child > div > div'));
      actionColList.forEach((item, index) => {
        const url = 'https://www.yuque.com' + item.querySelector('a:nth-child(2)').getAttribute('href');
        item.innerHTML += `<br><a id="copyBtn${index}" href="javascript:;" data-href="${url}">复制链接</a>`;
        document.querySelector(`#copyBtn${index}`).addEventListener('click', function () {
          copyToClip(url);
        })
      })
    }

    const wrap = document.querySelector('.ant-table-wrapper');
    const img = document.createElement('img');
    wrap.style.position = 'relative';
    img.src = icon;
    img.style.width = '25px';
    img.style.height = '25px';
    img.style.position = 'absolute';
    img.style.top = '10px';
    img.style.right = '10px';
    img.style.cursor = 'pointer';
    img.onclick = function () {
      createLink();
    }
    wrap.appendChild(img);
  }
})();

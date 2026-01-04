// ==UserScript==
// @name         选中文本快捷启动Quicker动作Translator
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在选中文本的右下角显示一个图标，点击图标启动Quicker动作
// @author       你的名字
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523662/%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E5%BF%AB%E6%8D%B7%E5%90%AF%E5%8A%A8Quicker%E5%8A%A8%E4%BD%9CTranslator.user.js
// @updateURL https://update.greasyfork.org/scripts/523662/%E9%80%89%E4%B8%AD%E6%96%87%E6%9C%AC%E5%BF%AB%E6%8D%B7%E5%90%AF%E5%8A%A8Quicker%E5%8A%A8%E4%BD%9CTranslator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建图标元素
    const icon = document.createElement('img');
    icon.src = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAl9SURBVHhe7VppU1RXGvZXzG+YSuU7H/IlSZU1U5nUVOXLfErFaE2mjXFUBIwoioogsqMsEkB2xVEimzIgyCaCbLIKSlRW2YSG3oBu4J33Od2XdDe36b5Ng9cJb/HU7b733HvP+7zrOfS+PWEJjs78xD8yXfNdYKTme1UiSuMfnqYJTcn9k23KvpUfzyccr3g2SF1DY9Q6qD50/zZOeQ+a6EBg1Ge2KftWvvMP13S9niLIqgoBKalrp/3fBvjZpuxbgZuBabxMZ1YfMK+i6mf01cHTewTYpuxb2SPAhwQs8zNWbNBb5McoxUdBAJRdWF6jV+OzNDAyLfDeaCaDD0j4KAgwrhFN65bpXEI2nQhLoROXUwQJ8AS58UrwURFw4VouBUTcoIArN2hwdOaPR8DF63kUeCWNAiPT/n8IWGQgueG6K0Aw9lJS/gYBw9ML4rzceAl8y6b3OQPjPigBJr7Q/3aSalr7qL5jQBaNzwfoUUuvyAGnrv4iUFLbRk1d8uOBx2391DYw7DZRfnAC2Lspr6yW/hkcQ8cuJbnE8bBk+jkqnU5HZwggEcqNk6AJiaeojLtk4hdsVTJVQUBBeT1pzsaRf3iq14BXSOQE8ecjoYkUe7NI/QSY14kqn3YLa13LK/EKyQVlIkHCQ0AEPsew8rcfNpCRX6xqAgADXzQxEbAWjkv4LH13AyTQhZVVSmISUCJPcKiUN7SLCoFnyL3PHqogQA+wlQAoBauh9EnntgL/UVP3EJ2JvUknI1KF9fuHp0QFwHPl3mcPVRAgAZ4wPm8QrtvUMyQsCCXlxgIgaY5b4rQ7FZwHUsifE2M+5xODZc2jNhkEQcrqWulv3x7+1DZl34qnBED5/uFJis64J5S5nFJAL/i7WPjIjAcxcP/Grpci9gPY+ucTc6j79YRHDRIIgreNzujp2u1a+uJQ/CG/g5l+28X+0+V+34RW/r695lEI8GRgzc6XoxQSl21tdxmRaXe4R5gSioIg+3uW+NzYrI5iMu8J1w/k9ji35PFGaNiPdQau84FaBmfpWHIzfR/XRj+m9GwbP93oo3+lDtBfg+4fsanvuQdgUrBIbfsLOhNzUygExcKSb4mGRiRFW1JDjlhcWaNb5XXC8ugMw5ILaGhizm3iw3vgIc2DM3Qi9RmduT1KiTUmSqhm4LgNpDRYKOTeDH35063DNvWV5wDj6rooi8GxmYIELHzOxWdTaV0bzfB6AN4AJSsanwvXD4r8hYK4PUan6C5nwO35QM0DUL6Fgm+NUGyVnqIrFnyChGojBRe+oy+PFmps6isjAEAogIhabmVDOaZPcpMTwBZGfU/KL6WOV6OizQ2JyxKWR6jkFNfQnMks7pV7JgDl+Y+VnyZ/trxQvtJ3ygM+IQAAAQiHdnZ9JMWTrCQIgMKw+s9R1m4viL8n5hbT2JyB2PgurS/FvHD7FMnyOlkltgOfEQBIsTo+r6M7FU/oLFv8lFDeCrS8OCIJ5pfWUtGjZi6Jlk3JUi7m43zo9vbYFgGYKCCsz+ZElkeyw1bY49b+jZUglJaqBOIfx6Pc94OQqcUlhzDY6Zh3hlcEYD8AyvJBTF67tEaTWiO9HJ+lquZuSsgpFl0eFERSPHU1neK4z4/NKqIL1/LE+eNhSRQck+lAwG7EvDO8IgD7Ab1vJjmrd1J5fTuXtnqxwIHLQ2HEPYAuLzQxl8rqO2jWsEzT+mV6/mpM7CMU1zyjksetGyGwWzHvDK8IYINt7AdgzQ9FrY2NVXG4+Fn2gJySGup7O2ldKzCgKDwH8Q1LA2JNwfAk5q8+XKDIB5uB885jPYVXBOB8wYN6OnwuXiiNOIc7h3DtxxL5PlsXixvtkkUoBuvKPQfwNOajWMmEqkW6Xr0Z8ZWL4rrzPZ7AKwJWOOFVtXQLt0c9v1vVJLa0BkZnaEa/IsaIhGiLbVfwNOahXGzlAr2ZtdCSeX0TOoZX6Eq5dtN9nsArAgAp88O9JReXsJXFJSiJ+fDyBfpPm4HM3HHKyRxPJr1exyRsvtcdvCYAgBIS5K67AsYrqfPhZVpqf4s75GWNeXnYbaLLpcq9YFsEeAOldR6unVqro+lFzMa1vJgwU+x/rUlR7jmusKsEeFPnw9iqZV1GWrfz/nmOswmtRbTSkhiX1ymrUUcRCnPBrhGgJOYloLzBqj1jju4Paxd1GMjECdBeHvWZ2AO0FCXzLFfYFQKUxrwEWDODk5uBrSsJPtUNLglXdw6LkferFMclUUkY7DgBSmNeAkofFKnsNQnlJDFyDc57qqdLHBqdw9hp+F1QJXKb9OohAJZHiWxhyyvt7eH+cVz7387yg+xkfH6Vojks4B33uDSu8fPtpeX1sqJyKEvAgYCIw91vpsUDQYK3gIzOm+nfSc0UfNt9zNsDVoQ1zRbHOH/6GyvI14Dr1TrSovGwkykOi3juGD1tj2UJOHYx+UjugyZerDwT++/eorS2hRILa+lAXJvYf5ObgCvAirCmvVhY1/xmq4sLBdkTno86JsgVDoOiDiNFcO8g91xnyBKAX2D+cC7Jb//B037454P3CPD74lDMIey+KiEAyqHvn16Q/MgqY+z+yA0ojWiOLhTPU2ELh4Gjk1DnyIoIEU+qgSwBvpQ//yPjU6UEQLlf2YorTu7/4p2Z8jkBIgnCE7Kf6Kik00gmLE7sZEa3Sml13BN4kAx3nAD840EpARHs/l1Orq1E4BHl3Dxd9iAMVEdABDcy6Q06eq93dH+l0ju+QjGcI9wlQ9URgAVNRY/JofX1RgzLa5TRoHfbGquKAKn2I9Z9IRXcRKFibJUMVUUArJXVqN+U1PTcCveOm0XJQ25wRufIMrfBvDhy8hpsoGAjZaswUA0BUutb0+/Y+kK6eTEUWqyliyVauiSD8/fnxZpBv+TYFKGKZD3ZujVWDQGYZDwvZCa0jslvlVN6RQ9n9C02O0AeMMxe4CxNQ0uiqXIVBqoioIBru8Vp22uBFxOo6VtZEYCS9S+xE+ko77TWMABBcvepioB+Xuc7y+sZs7jmSgEJGJPN7i4nxdwsYV9R7j5V5YD7PNGqPpMDsCBypzyAMdg8we6RwzM4p+RskQdUQwCAzs05wbmr4/ZAnGOd4PwMrBxjnMZKUBUBHwJ7BOwRsEfAzhOAn6IlN1jEy9SG5Hozhdyd3jkCPj9a+NkPKQPip2hgWm2A8v75k/SXk78et03Zt4JfYH4VXKEBw2oEG0jz9dlqzd+DH35im/IfWfbt+x+DobzmcTh3/AAAAABJRU5ErkJggg=='; // 使用Base64编码的图标
    icon.style.position = 'absolute';
    icon.style.width = '24px';
    icon.style.height = '24px';
    icon.style.cursor = 'pointer';
    icon.style.display = 'none'; // 初始隐藏
    icon.style.zIndex = '9999'; // 确保图标在最上层
    document.body.appendChild(icon);

    // 监听文本选中事件
    document.addEventListener('mouseup', function() {
        const selectedText = window.getSelection().toString().trim();

        if (selectedText) {
            // 获取选中文本的位置
            const range = window.getSelection().getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // 设置图标位置
            icon.style.left = `${rect.right + window.scrollX - 24}px`; // 向左偏移图标宽度
            icon.style.top = `${rect.bottom + window.scrollY}px`;
            icon.style.display = 'block';

            // 点击图标时启动Quicker动作：Translator
            icon.onclick = function() {
                const quickerActionUrl = `quicker:runaction:908ebcec-146d-4353-8222-06724aad1548`;
                window.location.href = quickerActionUrl; // 启动Quicker动作
            };
        } else {
            // 没有选中文本时隐藏图标
            icon.style.display = 'none';
        }
    });

    // 监听页面滚动和窗口大小变化，调整图标位置
    window.addEventListener('scroll', updateIconPosition);
    window.addEventListener('resize', updateIconPosition);

    function updateIconPosition() {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            const range = window.getSelection().getRangeAt(0);
            const rect = range.getBoundingClientRect();
            icon.style.left = `${rect.right + window.scrollX - 24}px`;
            icon.style.top = `${rect.bottom + window.scrollY }px`;
        }
    }
})();
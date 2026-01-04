// ==UserScript==
// @name         百度贴吧图片自动展开（改）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  百度贴吧的图片自动展开
// @author      coccvo
// @match        *://tieba.baidu.com/*
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABcxJREFUWEfFV2lMVFcU/t7sC0MZlhk2q3UBm7S1NbjEqrW0VIupWwMouNVqtdaFKBWrYN3TWpviEglWrWuLVUEaVFREsRj3GEPcuplWQARGGBhmn3ntvcPM+HgzGaM13n/vnXvP+e53vnvOvQwAsCwbD2AtgCQAKvLvGY42ACcBLGEY5g7TEfwCgJBnGNSX6xYAAwmAQwDGBQpeW2dH+WkTlEoBkocroJAznCXXq624dNWM7t3ESHxLDoZr9ue+iABoDUT75asWzJrXAJOZpY569ZBg/x4tZFJXlAPF7Vi+RgfWZUZSogIbvgkPtCdibyMAOpb5nu9wAKPT7uOvuzbOhOwFakzJUMFoYvHuyFq06J0ce966CLz3jjwgiIAArl23IGPaA56jIW/KUbAxAleuWTB5Ot8+bIgcW/Iinh7AkTIjPl/axHMU30uC4sJIHD1uRNYSvj2upwSH90c+PYCq82Z8MqeB52hAggw/FGhw7oIZMz7j2/snyLCzQPP0AEwmFonJtdC3cnM8f3YIZn4cDKORxeCkGpg7BOqO6NZIIAQ8DRQeNCD/ez0MBhYfjlGCOKqoNFGabTaXXqOjRDiwNxLqEAH9zt/Wik355Fi7BmFn62YNqm9YkLvqIWpq7Rg0QIaVuaGICBdyMHEAVFaZ8el8Lp0L5oZg+tRg/FNjx9kqEyRiBsOTFHgh2BXcPS5etuDGLSu6vijC20PlaDM48f6YOs7p6Pu6FHu3a/0D+GhWAy5eNnMmqEOEqCqPedzC4lm7Y3cb1m9o5mWgcFckXntF4vnPYWBQIjnPDt6iY4ej0bWLiPP/zu82/PGnDSqVAP36SiHvVBkzFzXhxCkjz9eKnFCkjA3yDSBhcA2MJq7YyMwjh6LxUjcXgCadA9m5Opy/6GUqOFiAJVlqjBqp9Diem9WEU6f5AJYuUiMjzdvvOAzMzmzEmV9NHNRKhQDnKmJo7tuNLNIm1/OqonvB16vC8EGyC8TmAj22bNVz880AxYVRiOsp9s0AoTR1Uj3MFm91npIRjOwFrka5KEeH0mPtPFrdP+QyBgf3RVG27tXaMXZ8PYxGL6OEepKCRwfvGN7+zYbdP7ZBr3dgQD8ZJo5XQSAADhQZ8OWah36Duw294yTYs00LpZIB9bWvFfpWFgP7S5GeqoKQewoRsBdQDZQZsThXB4eThSZCiF9+jkL1TavPCkjmJ/SVIT8vgoIINAIC2L6rDd9taoazIytarRCnj8bgerUFE6bym5A7YHychIKI1HbacidEfgFY/tPB8rXNKCk1eJaQVBCH5aVeAEFKAUQi0FJNGrtUyoBogbRpUqzy1oXjjT5Sv0T4BEAuHjPnNOLKNTNEIgYzpgYjPS0IYaHe3bgZ2LdDSwP0H1oDQ7sTk9NVWLxQTfVCdCORMBQEac++hk8AOSsfoqjEtXN3KSZN6e7fNioi0oofFwDxoVAIaOvuEsMtZsTGA0BqfvLYOjidgFTC4EJlLBx2YFTqfdTdt9MUVDyigUAMuHedMi4IK5Zyj6BPAAeL27FstY6uI52r8ngMbTIpE+vpvycF0CVWhOMl0bws8BggNeCrb11NhNBdVR4LpYLBrHmNOH/JDK2GywDpbqTLDR9dh3s1dp4G3BHDw4Q4eyImMICKMybMWdjomZieGoScbBd1djtLlS4WMx4NrF4WinGjg0Aurw4HS0ELhYxHhG5HfV6V4qed3FbsMwVEbMNG1NJ+7h5JiXJMSFFBoxFC0FFbbt2xYuEXOpqmrMwQkAoofkRjG/P1KDvpbUZZmWpMm8R/dPk8BUUl7chZ6dLB/zHiekmwf5eW1ojOw+/DpLTMiPV5zWho5N4PyMnoHS9Bj+5ieiWzWll65bp524YHDXaOf4GAwYgkBUgLdl/fOgGgDxO/TzOS15u3rfQOIJcLEKkRIjZWBJGf6trc4qRCbG5xUB28HCdBWBj36tYJAH2akZfx83ucEkTP83n+Ly1Sy1m1JTJ5AAAAAElFTkSuQmCC
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529046/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%EF%BC%88%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529046/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%EF%BC%88%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==



(function() {
    'use strict';

    function autoClick() {
        // 点击所有未处理的折叠图片
        document.querySelectorAll('div.replace_tip:not(.js-processed)').forEach(element => {
            element.click();
            element.classList.add('js-processed'); // 标记已处理
        });
    }

    // 初始执行
    autoClick();

    // 监听DOM变化
    const observer = new MutationObserver(function(mutations) {
        autoClick();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

})();

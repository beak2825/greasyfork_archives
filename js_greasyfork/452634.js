// ==UserScript==
// @name         Dcard 助手
// @namespace    pionxzh
// @version      1.1.1
// @author       pionxzh
// @description  完整去廣告、移除登入彈窗、隱藏下方登入 Banner
// @license      MIT
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAEYARgDASIAAhEBAxEB/8QAHAABAAEFAQEAAAAAAAAAAAAAAAgDBAUGBwEC/8QAQxAAAQMCAgMMBgkDBAMAAAAAAAECAwQFBhExNbIHEhYhQVFVYXORktETcXSBobEUFSIjQlJik8EyQ1MkM2PhcoLC/8QAGgEBAQADAQEAAAAAAAAAAAAAAAUCBAYDAf/EACkRAQACAQMDBAICAwEAAAAAAAABAgMEERIFMTITIVGRQVIUFSJCYYH/2gAMAwEAAhEDEQA/ANZAB0zkQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH1HG6WRsbE3z3qjWpzqpnOBGJeiZfE3zMXbdaUnbs2kJBGnqdRbDMbR3b+k0tM8TNp7OI8CMS9Ey+JvmOBGJeiZfE3zO3A1P5+T4hu/1uL5lxHgRiXomXxN8xwIxL0TL4m+Z24D+fk+IP63F8y4jwIxL0TL4m+Y4EYl6Jl8TfM7cB/PyfEH9bi+ZcR4EYl6Jl8TfMcCcS9Ey+JvmduA/n5PiD+txfMuEz4Wv9Omcloq8k5WxK75ZmMkikherJY3RvTS1yZKhIko1NHTVkfo6qninZ+WRiOT4mddfP+1WFum1/wBbI8g69ddzey1yOfSI+hlXQsa75nhX+FQ0G+4Lu9iR0ssP0imT+/DxoidaaU+XWbmPU48ntE+7Qy6PLi95jeP+NfABsNUAAAAAAAAAAAAAAAAAAAAAAAAAAF1bdaUnbs2kJBEfbbrSk7dm0hIIl6/vVY6Z42AATVYAAAAAAAAAAA8VEVMlTNFPQBo+Kdzumr2vrLO1lPU6Vh0Ryer8q/D5nL6inmpZ3wVETopY1ycx6ZKikiDWcYYQgxDSrPAjY7hGn3b9CPT8rv4XkKGn1c1/xv2TNVoovHPH3cZBUnhlpp3wTRujkjcrXscmSoqchTKyIAAAAAAAAAAAAAAAAAAAAAAAAurbrSk7dm0hIIj7bdaUnbs2kJBEvX96rHTPGwACarAAAAAAAAAAAAHNMf4xdLOtotc6tZE5FnmjdkquRf6UXqXT1+o9cWK2W3GHjmzVw05WdLBoeC8eLXvjtl3eiVC8UM68SSLzO6+vl9enfD5kx2x242fcWWuWvKrQt0fDCVNMt7pGffQplUNT8bPzetPl6jmBIp7GyMcx7Uc1yZKipxKhw3FNlWw3+ejRF9Cq+khXnYuju409xS0WblHCfwldQwcZ9Sv57sOACglgAAAAAAAAAAAAAAAAAAAAC6tutKTt2bSEgiPtt1pSduzaQkES9f3qsdM8bAAJqsAAAAAAAAA8OfYyx+2NJLbZZd89fsy1TV4m9TF5+vuPTFitkttV5Zc1MVeVlbHWNko2yWm1y51K/Znmav8AtJytT9Xy9ejl56qqqqqrmq6VU8LuHDXFXaHOZ89s1uUvUVUXNFyVDs+Br86+2Fqzv31VTL6OVV0u5ne9PiinFzcNzS5LSYlWkVfu6yNW5fqb9pF7kcnvPLV4+eOZ/MPfRZZpliPxPs64aLuo2tJ7TT3Jjft0z949f0O/7y7zejG4io0uGHq+lyzV8Dt6n6kTNPiiEjDfhkiy3np6mK1XBQAdC5cAAAAAAAAAAAAAAAAAAAAAXVt1pSduzaQkER9tutKTt2bSEgiXr+9VjpnjYABNVgAAAD4lljgjdLNI2NjUzc565InvA+y1uFyo7VSuqq6oZBE3lculeZE5V6kNSv26XQ0SOgtLErJk4vSrxRt/l3u4us5vdLvX3mqWor6l8z/wov8AS1OZE0IbuHR3v729oT8+upj9qe8tixVj2qvSPo6DfUtEvE7jyfKnXzJ1GoFejo57hWRUlMzfzTORrG9Z2DD2CLXZYGOmhZV1eWbppG5oi/pRdCfE375MemrtEJ2PHl1dptMuMAkRJTwTRLFLDHJGvErXNRU7jQsZYBpvoktys0XopIkV0lO3+lzU0q1OReo88etre21o2emXp96V5VndzQyWHahaXEdumRct7Usz9SuRF+CmNLm38VypV/5mfNDdtG9ZhoUna0SkGeKmaKi6FPQc06xHmri9BWTQ/wCORze5ciiXl311Xe0ybSlmdLX3iHJWjaZAAfXwAAAAAAAAAAAAAAAAAAF1bdaUnbs2kJBEfbbrSk7dm0hIIl6/vVY6Z42ADkd23QMQpX1NPDUxwMjlexvo4kzyRVTlzNPDhtlmYq38+ophiJt+XW9GkxNxxTY7VmlVcYUen9ti793cmeRxmtvd1uOf0y4VEyL+F0i73u0Fgb1NB+0p1+pfpX7dHuu6on2o7TQqvNLUL/8AKeZpF0v10vUm+r6ySZEXNGZ5Mb6mpxGPBuY8GPH4w0Mupy5fKQAHs8G6bl1LHNiKad6IroKdVZ1Kqomfdn3nWDiuB7zHZcRxSTuRsE7VhkcuhqLlkveifE7SioqZpxoRtdExl3le6faJw7R3enh6WtzuNPardNXVT0bFC3NeteRE61XiNOImZ2hvzMRG8uGX2mjo79X00SZRxVD2tTmRHLkhQt+sabtmfND5q6l9bWT1Uv8AXPI6R3rVcz6t+sabtmfNDo4iYrtLlZmJvvHykIADm3Vo/wB311Xe0ybSlmXl311Xe0ybSlmdLXxhyd/KQAH1iAAAAAAAAAAAAAAAAAAC6tutKTt2bSEgiPtt1pSduzaQkES9f3qsdM8bBH6664rfaJNpSQJH6664rfaJNpRoO9n3qfjVaAAqIwAAAAAG14f3QLlZYWUs7EraViZNa92T2JzI7m6lQ1QGF8dbxtaGePJfHO9J2dLk3WKZI/urTKr+Z0qInfkabiDFFyxFKi1b0ZCxc2QR8TW9fWvWpiqenmqqhlPTxullkdvWMamaqpkr5hm54ffGlbCm8kRFbIxc255cbc+dDyphw47e3dsXz58tJ37MSXFv1jTdsz5oW5c2/juVL2zPmh7z2ate8JBgA5p1qP8Ad9dV3tMm0pZl5d9dV3tMm0pZnS18YcnfykAB9YgAAAAAAAAAAAAAAAAAAurbrSk7dm0hIIj7bdaUnbs2kJBEvX96rHTPGwR+uuuK32iTaUkCR+uuuK32iTaUaDvZ96n41WgAKiMAAAAABUp6eaqqGU9PG6SWR29YxqZqqlMvLXdKqz3CKuo3o2WNeVM0VOVF6lPk77ez7XbeN+zrGDsHQ4ep0qalGyXCRv2naUjT8rf5U2OppoKynfT1MLJonpk5j25opg8NYxt+IYmxo5KesRPtQPXT1tXlT4mwnP5Zyc5m/d0+GMfpxGPs0O7bltHO9ZLXVupVVc/RSJv2+5dKfEp2bcwSkrYqqvuCSeiej2xwsyzVFzTNV5PcdABn/Ky8eO7z/iYeXLiHirkiquhD0xuIaz6vw9X1WeSsgdvV/UqZJ8VQ8KxvMQ2bTxiZlwurl9PWTTf5JHO71zKIB0sezkpnedwAAAAAAAAAAAAAAAAAAAABdW3WlJ27NpCQRH2260pO3ZtISCJev71WOmeNgj9ddcVvtEm0pIEj9ddcVvtEm0o0Hez71PxqtAAVEYAAAAAAAB9Nc5jkcxytc1c0VFyVFNts26Pd7c1sVYja+JP8i5PT/wBuX3opqAML46Xja0bvTHlvjnek7OvUO6XYKlqfSHT0juVJI1cne3M2xj2yMa9ue9ciKmaZcRyjAGFHXWtbdKyP/RU7s2Ncn+69P4Tl7uc6yRdTTHS/Gi/pMmXJTlk/8DRd1G6JBaae2sd9upfv3p+hv/eXcbw97Y2Oe9yNa1M1VV4kQ4bim9Lfr/PWIq+hRfRwpzMTR38a+8z0ePnk3/EMNdl4YuP5lhwAWnPgAAAAAAAAAAAAAAAAAAAAC6tutKTt2bSEgiPtt1pSduzaQkES9f3qsdM8bBH6664rfaJNpSQJH6664rfaJNpRoO9n3qfjVaAAqIwAAAAAAqRQy1D0ZDE+Vy6Gsaqr8DP2zAmILk5F+hrSxr+Op+x8NPwMbXrTynZnTHe87Vjdrht+EsC1N6eysr2up6BONM+J03q5k6+42+w7ndrtTmT1i/TqlvGm/blG1epvL7zbdCZITs+t9uOP7VNP0/aeWX6fFPTw0tOynp42xxRtRrGNTJEQqA1nGGL4MO0qwwK2S4SJ93HpRifmd/CcpPpS17bR3VL3rjryt2hiN0fE6U1MtkpH/fTJ/qHJ+Bn5fWvy9ZzAqTzy1M7555HSSyOVz3uXNVVSmXsOKMVOMOb1Gac1+UgAPV4AAAAAAAAAAAAAAAAAAAAAC6tutKTt2bSEgiPtt1pSduzaQkES9f3qsdM8bBaOtduc5XOoKZVVc1VYW5r8C7BOiZjsqzET3Wf1Tbej6X9lvkPqm29H0v7LfIvAfeU/L5xr8LP6ptvR9L+y3yH1Tbej6X9lvkXgHKfk41+Fn9U23o+l/Zb5HqWq3IuaW+lRexb5F2D5yn5ONfh8RxRxN3scbWJzNTI+wUamrpqOP0lVURQMT8Uj0anxHvL77QrHiqiJmq5IhqV13SLJQo5lIr66VNCRpkzP/wAl/jM0G+40u99R0Ukv0emX+xDmiKn6l0r8uo2sekyX7xtDUy63Fj7TvP8AxuuKd0OmoGvo7O5lRVaFm0xx+r8y/D5HL6iomq6h9RUSullkXNz3rmqqUgVcWGmKNqomfUXzTvYAB7PAAAAAAAAAAAAAAAAAAAAAAAAB9RyOikbIxd69io5q8yoZzhviXpaXwN8jAgxtStu8bsq3vXxnZnuG+JelpfA3yHDfEvS0vgb5GBBj6WP9Y+mfrZf2n7Z7hviXpaXwN8hw3xL0tL4G+RgQPSx/rH0etl/aftnuG+JelpfA3yHDfEvS0vgb5GBA9LH+sfR62X9p+2e4b4l6Wl8DfIcN8S9LS+BvkYED0sf6x9HrZf2n7ZafFV/qEyku9XkvI2RW/LIxksskz1klkdI9dLnqqr3nwDOK1r2hha9rd53AAfWIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/2Q==
// @match        https://www.dcard.tw/*
// @exclude      https://id.dcard.tw/oauth/*
// @exclude      https://www.dcard.tw/my/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/452634/Dcard%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/452634/Dcard%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(n=>{if(typeof GM_addStyle=="function"){GM_addStyle(n);return}const t=document.createElement("style");t.textContent=n,document.head.append(t)})(` body {
  overflow: unset !important;
}

.__portal > div:not(:has(div[data-testid])) {
  display: none;
}

aside > div[style*="min-height:"],
section div[data-key|=ad],
div[id^=div-gpt-ad] {
  display: none;
}

aside > div:last-child {
  position: absolute;
  bottom: 0;
} `);

(function () {
  'use strict';

  const authUrl = "https://www.dcard.tw/service/_auth/authorize";
  (() => {
    console.log("[Dcard 助手] is running...");
    loginModalRemover();
  })();
  function isLoggedIn() {
    const links = Array.from(document.querySelectorAll('div[role="navigation"] > a'));
    return !links.some((link) => link.href.startsWith(authUrl));
  }
  function loginModalRemover() {
    if (isLoggedIn())
      return;
    const portalEl = document.querySelector(".__portal");
    if (!portalEl) {
      console.log("[Dcard 助手] Failed to find portal element");
      return;
    }
    const observe = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            const el = node;
            const iframe = el.querySelector("iframe");
            if (iframe && iframe.src.startsWith(authUrl)) {
              el.style.display = "none";
            }
          });
        }
      });
    });
    observe.observe(portalEl, { childList: true });
  }

})();
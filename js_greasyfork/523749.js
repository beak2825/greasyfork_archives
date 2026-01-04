// ==UserScript==
// @name         海角天涯-解锁海角社区资源
// @namespace    tianya365.top
// @homepage     https://vip.tianya365.top
// @version      2.1.1
// @description  无限制解锁收费资源，包括钻石贴、金币贴，下载视频，复制视频链接，自动展开帖子
// @icon         data:image/vnd.microsoft.icon;base64,iVBORw0KGgoAAAANSUhEUgAAAEoAAABKCAYAAAAc0MJxAAAKSUlEQVR4Xu2cCZQU1RVA7x8G2VE2WWUbMSiCBDQqiAYVUAkIohIwyCaYnATZHAYwsgnICLLlIMQIRiISECTsgsMSRDGAsguMgkQWCWgiqzow/XPe/OlUdXdNdxXUBKH7nTMHqv5+6/3/33u/uhTRJFWnoGip4D4UtdBUUYoSUctcJolacwrFITSfaUUGAZYxVu3Lq/vKMSFVpyQlMULDLxUkXSZjv6huak22UswOBBjmBCwSVJp+XMHrCopeVMuXaWENZ3Q2nRinFtiHEApqgO6vYKxSOGvaZTp4r93WENABnmWsmhAsawEZoNsoxfx4mWqx4OXA0rTjJfU3yWtApeoUlcRWBcVjVRBP6RpO6SzqM0HtzwGVlKZnAR3jCYKHsc4MpKvOiv66mkpGiMXF7uYBUE5W2Q11FtcrUnXvpCQmeq0gnvIHAjyj1AC9VCkeiqeBex2r1ixSKk3vVlDba+F4yq9hj4A6oaBkPA3c61g1nFRJaVp7LRiP+ROgXD71BKgEKJcEXGZLaFQClEsCLrPlm0Yt6wqbDsGkD+DfZ1325kecLV9AtawNCzuDUnDie5i/A0athgP/+RGTiNE1T6DKFYM/PGwA2GXqBli737rzTid4uE5onknr4cU15l54+bz6KM0cPyOBoUsP2BOo6qVgX1pkp7vPgz9vNvd/Ug529oOkMJjZAbiQ8VZ7EY6eusxAVb0GvhgYHdSoFjCwqX8DqzQS/nXav/outCZPGpUXqKfmweuboVQRODAIil91od2JLFdxJBy70kB1vw1ebecfJKmpwgtmnbrU4ptG/eUTszbVKmsNSdzt9z6DwycjhylpTmtWuIvefwmczrrUmMATqNJFYVzL3E7bBirTLjkJMnqE7mgnv4ca6fDtd/4NtHAyjH7AtCNQZUfM+RdY8zm8m+lfW/aaPIGK1oVl3aDFDaE5vjsHe45HlnI6NAzfJRfshBGrIss+8VOY2T7yvgB7YDrsOgpnz0FWNpzLhuwL2WodBuoLqJQysKMvFEr272lO3wg934msb8Zj0Llh9HaCmiaQzgcMMAGXA++89f8+i2FNnm8bhLbhC6iyRWFia3isLiQX8AfW9E3Qc35oXTK9vxwE5X16TWTwu5C+1l1/PYESy7xvkzDSwNztsOUI3FoFpj8KN1dw13i0XDM2QY8wUM1qwfJu7i37WL148xPoPDdWLpPuCdSN15qdLVw6z4E3t5i7w5rB8/dZOUTtW0yHrPPWvZvKg/zN3ZbbCQVrn4aCNm10AjWyBQwKM2Z3HAXZcZ2kaEEYcn+klxDMu+4LaPrHfABVuxzs6u8NlKwLpYbC9+eh713Q43a4oaxxS6qMtuo6OzJ0jQsHJRtA5gCoWTq0/ZGrYOh7zoPteiu89qhz2spMENfriIPp4lTCk0aJH/dpDFBDm8GQMI0qNQxkB5zUGn7XyHRDdqkaY+DQCXMdC1SDSrCxV+i0kzrqvAyZXzvDmPsEtKsbmiaaPXqNWZvkIboVf0DNhfVfGAh3VoM7qlrNy67T8S3TqTZ1oMutVppEFP4uUQcFczqGTr09x2D1PliyG1ZkQu/GML5V6LAEcpOpzkMtUhA294KiNnfqTBaIASv1iYhWu4XlC6guc2HfN/D+b9w+H/f5hqyE0athax9/Ngl7y794HZbvddcXT6AqlYSJrYzrYXc1pmwACaPkFyjZnfY7RC3cDTHvXGnLYNw6d7V4AhWtykbV8g+UuEgyjfyyn4LjmPkxdH07H0F1rA/1KoIYhZ/lLqSyNq13mHqiebI2BCUvj0JCM06RT5l6EkaufS2s7gElCkORZCuvhGDsRuNd1aHtzVZ7AmPbV+a6ytWhduDGg3DnlHwE9d5TcO/1Zrp9cACmfWRCwdcWh1/fYf6CInZU+RfgbJQIgMA7OSLUPFi4C8RyPnbGOpxoUBnqV4KpbSwPQBb0mmOs9lrfBPM6Wdd9F8OUD8219O/gYAuylJWd102o2fPUK3YVHH4OShQKfRIjMmB4hjHwht4fCqr0MOOoRpNw8yDatPh2uNW+aKx95xKtvMpmuJ4Pc4wlLai5YrKUGQY/uDATPINqmgKiUfZpIk+k8SsgqhwNlGzZMm3vqQkNK0PdCdbT9ALq0GCo6MP7NwL55vHOEY7wh+oZ1Ctt4enbQ6uReNN1o43WiPsibox96pUZbtapEc3huXtNinRS4P7joLn2Amr3s8a690NkMRftjSWeQe3qZxZWu4hT3OEtcycclBicMvUE1OP1YLbtldrnVxgr2SuoTb1A1qugvL0dvrEdsjavBTXLWA9k1hYrSnpLRWMUB+XldTBgWSxMHp3i8sVNmCM8lCIeuNg6TqBkwZ+43qwjZYpCT5s2SsRBfC6R/nebKGlQtn8FUz+Cjw/B1iOhAbg1PeHumlbe5q/Bqs+ta4mApv3cAtVwsrXzhQf+5u2A9vJOdAzxpFGp98CYByNrrD3OMhPCNSpWB2KlyxQVbRF3ZudR4/IMvjc0mmqPXkh98jCmtrVqFm0XrRepVwG29LHSZOo3cmEieAK1qAvIcbld9h43jmnQPvIblBNIgWffTMT0sO9csrPJ7hwUe7qEnK8ubKWJv1d5VKzH5WHqSazoq9+bszu7vJABwzKsO/8PULGH5T6HLA3lRph3JKKJa41qdSMseDLSem7zBizebTUhGidGn12c3hINt9C73Ra6Rn3+NWw+DBJVrVjCmAMlC0GBfPjZQLM/mantCyg5pgoPA4tKy0mul3M3UXsnd2VvKshRVFBkp3pyTmjXBVSN0tCvCfyqgZW27QgsDzum6tIQKuTG1n84D+K4Bw3T+1Lgtuus8qlLYfz7PoHa0tv4d3ZZ+Ck8MtO9mkvOya3ht7nBu2glnUAF80vcS4KAQfnwADSZFlrbWx2g/S3mnrhR8rJHr8YgUdo65eGGclZ+2ZUlTuWLRontJNNPtldpTNas596FMS5PMYKd8AOUABAQQZEwc+mhoQu6PXYvU7/pq+aUyOkhSey+w2yfQAWrkV1D1L9TA/jrVnfmv70LfoASN0pOpe1SfyLIQUNQevwMpj1iXfdeZA4ZJoRFSSVHzgnSZJ9BeZtokbmDoGJ57LO3Rq5RwdpkcX/mLihW0JgBJQubNWbDP632ZHrJSyNBkeiGuFrPNI7sk7he4etheC7Xu97FArrcyydAuXyCCVAJUC4JuMyW0KgEKJcEXGZLaFQClEsCLrMlfirrAlTOT2VVmt6rIOztSxel4yiLhkwBtUJB8zgat+ehaliZ+ECEC2yBAH0UA3V1FWB/vH8KKS9eWqN1NjWCH7GZDnRzATces8wIpKvu5t34fvo6lcx2pbgmHknkqU1wQp+jLuPVQetHBGn6QQVLEl/9MdhyvvKjaEW6Wi7XkZ9uU7wU77Byv0bWl5fU/+KekT9LeVa3VQV4Q3FlfEbS61Ki4bSWj46lq8X2ss4f/UvTVZNglBSIF+3K/bzkrAA8T7r6MiIUHJW4fLA0iYeU5v4r+oOlsArN0mgfLP0vox/zX2L4nPIAAAAASUVORK5CYII=
// @author       tianya365.top
// @exclude      https://*.tianya365.top/*
// @include      https://*.*/*
// @connect      *
// @run-at       document-start
// @grant        none
// @antifeature  payment
// @charset      UTF-8
// @downloadURL https://update.greasyfork.org/scripts/509466/%E6%B5%B7%E8%A7%92%E5%A4%A9%E6%B6%AF-%E8%A7%A3%E9%94%81%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/509466/%E6%B5%B7%E8%A7%92%E5%A4%A9%E6%B6%AF-%E8%A7%A3%E9%94%81%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function () {
    'use strict';


    const CONFIG = {
        VERSION: '2.1.1',
        DEFAULT_SERVER: 'https://vip.tianya365.top',
        STORAGE_KEYS: {
            SERVER: 'hjty_server',
            USER_TOKEN: 'hjty_user_token',
            USER_NAME: 'hjty_user_name'
        },
        SELECTORS: {
            TOOLBAR_CONTAINER: '.hjty-toolbar-container',
            UNLOCK_BTN: '.hjty-unlock-btn',
            SETTINGS_BTN: '.hjty-settings-btn',
            USER_BTN: '.hjty-user-btn',
            TOGGLE_BTN: '.hjty-toggle-btn'
        },
        MODAL_IDS: {
            LOADING: 'hjty-loading-modal',
            LOGIN: 'hjty-login-modal',
            SERVER: 'hjty-server-modal',
            USER_INFO: 'hjty-user-info-modal',
            LOGOUT_CONFIRM: 'hjty-logout-confirm-modal',
            UPDATE_CONFIRM: 'hjty-update-confirm-modal'
        }
    };

    let topic = null;
    let newVersion = '';
    let m3u8_url = '';
    let play_url = '';
    let shortVideoUrl = '';
    let freeToken = window.localStorage.getItem('hjty_free_token');
    let video = null;
    let hasPic = false;
    let server = localStorage.getItem(CONFIG.STORAGE_KEYS.SERVER) || CONFIG.DEFAULT_SERVER;


    let toolbarCollapsed = localStorage.getItem('hjty_toolbar_collapsed') === 'true';


    if (!localStorage.getItem(CONFIG.STORAGE_KEYS.SERVER)) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.SERVER, server);
    }

    if (freeToken == null) {
        freeToken = '7a78a8bf4bd2432f93a301bec4a17cf7'
        window.localStorage.setItem('hjty_free_token', freeToken);
    }


    const Utils = {

        debounce(func, wait, immediate = false) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func.apply(this, args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(this, args);
            };
        },

        base64: {
            encode: function (str) {
                try {
                    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                        return String.fromCharCode(parseInt(p1, 16));
                    }));
                } catch (error) {
                    return '';
                }
            },

            decode: function (base64Str) {
                try {
                    return decodeURIComponent(Array.prototype.map.call(atob(base64Str), function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                } catch (error) {
                    return '';
                }
            }
        },


        getUserToken() {
            return localStorage.getItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
        },


        getCookieValue(name) {
            const match = document.cookie.match(new RegExp(name + '=([^;]+)'));
            return match ? match[1] : null;
        },


        checkLoginStatus() {
            return !!this.getUserToken();
        },


        getPid() {
            if (/\/post\/details.*pid=\d+/.test(location.href)) {
                const match = location.href.match(/\/post\/details.*pid=(\d+)/i);
                return match ? match[1] : null;
            }
            return null;
        },


        deleteCookie(name) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        },

        decrypt(data) {
            return JSON.parse(this.base64.decode(this.base64.decode(this.base64.decode(data))));
        },

        encrypt(data) {
            return this.base64.encode(this.base64.encode(this.base64.encode(JSON.stringify(data))))
        },


        async copyText(text) {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(text);
                    return true;
                } else {

                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    textArea.style.position = 'fixed';
                    textArea.style.opacity = '0';
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    const success = document.execCommand('copy');
                    document.body.removeChild(textArea);
                    return success;
                }
            } catch (error) {
                return false;
            }
        },


        smoothScrollTo(element, offset = 0) {
            if (!element) return;


            if (this.isMobile()) {
                this.mobileScrollTo(element, offset);
            } else {

                this.tryMultipleScrollMethods(element, offset);
            }
        },


        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                window.innerWidth <= 768;
        },


        mobileScrollTo(element, offset = 0) {
            try {

                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });


                if (offset !== 0) {
                    setTimeout(() => {
                        const currentPos = this.getScrollTop();
                        const targetPos = currentPos + offset;


                        window.scrollTo({
                            top: targetPos,
                            behavior: 'smooth'
                        });
                    }, 300);
                }
            } catch (error) {

                const targetPosition = element.getBoundingClientRect().top + this.getScrollTop() + offset;
                this.animateScrollTo(targetPosition);
            }
        },


        tryMultipleScrollMethods(element, offset = 0) {
            const targetPosition = element.getBoundingClientRect().top + this.getScrollTop() + offset;


            if (this.tryNativeScroll(targetPosition)) {
                return;
            }


            if (this.tryScrollContainer(targetPosition)) {
                return;
            }


            this.animateScrollTo(targetPosition);
        },


        getScrollTop() {
            return window.pageYOffset ||
                document.documentElement.scrollTop ||
                document.body.scrollTop || 0;
        },


        tryNativeScroll(targetPosition) {
            try {

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });


                return new Promise(resolve => {
                    const startPos = this.getScrollTop();
                    setTimeout(() => {
                        const currentPos = this.getScrollTop();
                        resolve(Math.abs(currentPos - startPos) > 5);
                    }, 100);
                });
            } catch (error) {
                return false;
            }
        },


        tryScrollContainer(targetPosition) {

            const containerSelectors = [
                'body',
                'html',
                '.app',
                '.main',
                '.container',
                '#app',
                '[data-scroll]',
                '.scroll-container'
            ];

            for (const selector of containerSelectors) {
                const container = document.querySelector(selector);
                if (container && this.tryScrollElement(container, targetPosition)) {
                    return true;
                }
            }
            return false;
        },


        tryScrollElement(element, targetPosition) {
            try {
                if (element.scrollTo) {
                    element.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    return true;
                } else if (element.scrollTop !== undefined) {

                    this.animateElementScroll(element, targetPosition);
                    return true;
                }
            } catch (error) {

            }
            return false;
        },


        animateElementScroll(element, targetPosition, duration = 500) {
            const startPosition = element.scrollTop || 0;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);


                const ease = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                element.scrollTop = startPosition + distance * ease;

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }

            requestAnimationFrame(animation);
        },


        animateScrollTo(targetPosition, duration = 500) {
            const startPosition = this.getScrollTop();
            const distance = targetPosition - startPosition;
            let startTime = null;

            const animation = (currentTime) => {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);


                const ease = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

                const currentPosition = startPosition + distance * ease;


                try {
                    window.scrollTo(0, currentPosition);
                } catch (e) {

                    document.documentElement.scrollTop = currentPosition;
                    document.body.scrollTop = currentPosition;
                }

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            };

            requestAnimationFrame(animation);
        },


        imageDecode(t) {
            const e = "ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890";
            let o, i, a, r, s, c, u, l = "", d = 0;

            function n(e) {
                let t, n = "", o = 0, i = 0, a = 0;
                while (o < e.length)
                    i = e.charCodeAt(o),
                        i < 128 ? (n += String.fromCharCode(i),
                            o++) : i > 191 && i < 224 ? (a = e.charCodeAt(o + 1),
                            n += String.fromCharCode((31 & i) << 6 | 63 & a),
                            o += 2) : (a = e.charCodeAt(o + 1),
                            t = e.charCodeAt(o + 2),
                            n += String.fromCharCode((15 & i) << 12 | (63 & a) << 6 | 63 & t),
                            o += 3);
                return n
            }

            t = t.replace(/[^A-Za-z0-9*#]/g, "");
            while (d < t.length)
                r = e.indexOf(t.charAt(d++)),
                    s = e.indexOf(t.charAt(d++)),
                    c = e.indexOf(t.charAt(d++)),
                    u = e.indexOf(t.charAt(d++)),
                    o = r << 2 | s >> 4,
                    i = (15 & s) << 4 | c >> 2,
                    a = (3 & c) << 6 | u,
                    l += String.fromCharCode(o),
                64 !== c && (l += String.fromCharCode(i)),
                64 !== u && (l += String.fromCharCode(a));

            let reg = new RegExp('', "g");
            l = l.replace(reg, '');
            return l = n(l),
                l
        }
    };


    const UI = {

        showToast(message, type = 'info') {

            const existingToast = document.getElementById('hjty-toast');
            if (existingToast) {
                existingToast.remove();
            }


            const icons = {
                success: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                </svg>`,
                error: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" stroke-width="2"/>
                    <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" stroke-width="2"/>
                </svg>`,
                warning: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
                </svg>`,
                info: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M12 8H12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>`
            };

            const toast = document.createElement('div');
            toast.id = 'hjty-toast';
            toast.className = `hjty-toast hjty-toast-${type}`;
            toast.innerHTML = `
                <div class="hjty-toast-icon">${icons[type] || icons.info}</div>
                <div class="hjty-toast-message">${message}</div>
            `;

            document.body.appendChild(toast);


            setTimeout(() => toast.classList.add('hjty-toast-show'), 10);


            setTimeout(() => {
                toast.classList.remove('hjty-toast-show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },


        showLoadingModal(message = '加载中...', showCloseBtn = true, onClose = null) {

            const existingModal = document.getElementById(CONFIG.MODAL_IDS.LOADING);
            if (existingModal) {
                existingModal.remove();
            }

            const loadingModal = document.createElement('div');
            loadingModal.id = CONFIG.MODAL_IDS.LOADING;
            loadingModal.className = 'hjty-modal-overlay hjty-loading-overlay';

            if (onClose && typeof onClose === 'function') {
                loadingModal._onCloseCallback = onClose;
            }

            const closeButtonHtml = showCloseBtn ?
                '<button class="hjty-modal-close hjty-loading-close" title="关闭">×</button>' : '';

            loadingModal.innerHTML = `
                <div class="hjty-modal-content hjty-loading-content">
                    <div class="hjty-loading-header">${closeButtonHtml}</div>
                    <div class="hjty-loading-body">
                        <div class="hjty-loading-spinner">
                            <div class="hjty-spinner-ring"></div>
                        </div>
                        <p class="hjty-loading-message">${message}</p>
                    </div>
                </div>
            `;

            document.body.appendChild(loadingModal);


            if (showCloseBtn) {
                const closeBtn = loadingModal.querySelector('.hjty-loading-close');
                closeBtn.addEventListener('click', () => this.hideLoadingModal());
            }


            loadingModal.addEventListener('click', (e) => {

                if (e.target === loadingModal) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            });

            return loadingModal;
        },


        hideLoadingModal(executeCallback = true) {
            const loadingModal = document.getElementById(CONFIG.MODAL_IDS.LOADING);
            if (loadingModal) {
                if (executeCallback && loadingModal._onCloseCallback) {
                    try {
                        loadingModal._onCloseCallback();
                    } catch (error) { }
                }
                loadingModal.remove();
            }
        },


        showActions(title = '操作选项', actions = [], onAction = null) {

            const existingDrawer = document.getElementById('hjty-action-drawer');
            if (existingDrawer) {
                existingDrawer.remove();
            }

            const drawer = document.createElement('div');
            drawer.id = 'hjty-action-drawer';
            drawer.className = 'hjty-action-drawer-overlay';

            const actionsHtml = actions.map(action => `
                <div class="hjty-action-item" data-key="${action.key || ''}" data-url="${action.url || ''}">
                    <div class="hjty-action-content">
                        <div class="hjty-action-name">${action.name || ''}</div>
                        ${action.subname ? `<div class="hjty-action-subname">${action.subname}</div>` : ''}
                    </div>
                    <div class="hjty-action-arrow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            `).join('');

            drawer.innerHTML = `
                <div class="hjty-action-drawer">
                    <div class="hjty-action-header">
                        <h3 class="hjty-action-title">${title}</h3>
                    </div>
                    <div class="hjty-action-list">
                        ${actionsHtml}
                    </div>
                    <div class="hjty-action-footer">
                        <button class="hjty-action-close-btn">关闭</button>
                    </div>
                </div>
            `;

            document.body.appendChild(drawer);


            const actionItems = drawer.querySelectorAll('.hjty-action-item');
            const closeBtn = drawer.querySelector('.hjty-action-close-btn');

            actionItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (onAction && typeof onAction === 'function') {
                        onAction(item.dataset);
                    }
                });
            });

            closeBtn.addEventListener('click', () => this.hideActions());


            drawer.addEventListener('click', (e) => {
                if (e.target === drawer) this.hideActions();
            });


            setTimeout(() => drawer.classList.add('hjty-action-drawer-show'), 10);

            return drawer;
        },


        hideActions() {
            const drawer = document.getElementById('hjty-action-drawer');
            if (drawer) {
                drawer.classList.remove('hjty-action-drawer-show');
                setTimeout(() => drawer.remove(), 300);
            }
        },


        showPlayer(src = '') {

            const existingPlayer = document.getElementById('hjty-player-modal');
            if (existingPlayer) {
                existingPlayer.remove();
            }

            const playerModal = document.createElement('div');
            playerModal.id = 'hjty-player-modal';
            playerModal.className = 'hjty-player-modal-overlay';

            playerModal.innerHTML = `
                <div class="hjty-player-modal-content">
                    <div class="hjty-player-header">
                        <button class="hjty-player-close" title="关闭播放器">×</button>
                    </div>
                    <div class="hjty-player-body">
                        <div id="hjty-play-box">
                            <iframe style="display:block;border:0;width: 100%;height: 500px" allow="autoplay; encrypted-media" allowfullscreen src="${src}"></iframe>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(playerModal);


            const closeBtn = playerModal.querySelector('.hjty-player-close');
            closeBtn.addEventListener('click', () => this.hidePlayer());


            playerModal.addEventListener('click', (e) => {
                if (e.target === playerModal) this.hidePlayer();
            });


            const handleEscKey = (e) => {
                if (e.key === 'Escape') {
                    this.hidePlayer();
                    document.removeEventListener('keydown', handleEscKey);
                }
            };
            document.addEventListener('keydown', handleEscKey);


            setTimeout(() => playerModal.classList.add('hjty-player-modal-show'), 10);

            return playerModal;
        },


        hidePlayer() {
            const playerModal = document.getElementById('hjty-player-modal');
            if (playerModal) {
                playerModal.classList.remove('hjty-player-modal-show');
                setTimeout(() => playerModal.remove(), 300);
            }
        }
    };


    const App = {

        getTopic(pid) {
            return new Promise(async (resolve, reject) => {
                try {
                    const response = await fetch(`/api/topic/${pid}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    const res = await response.json();

                    if (res.isEncrypted) {
                        topic = Utils.decrypt(res.data)
                    } else {
                        topic = res.data;
                    }

                    resolve(topic);
                } catch (error) {
                    reject('网络错误: 3');
                }
            });
        },

        showTopic(data, pid) {
            if (!data['attachments']) {
                UI.showToast('没有可解锁的内容', 'warning'); return;
            }

            this.getAttachments(data).then(html => {
                if (html) {
                    const sellBtn = document.querySelector('.sell-btn');
                    const hjsellContainer = document.getElementById('hjsell-container');

                    if (sellBtn) {

                        const newContainer = document.createElement('div');
                        newContainer.id = 'hjsell-container';
                        newContainer.className = 'hjsell-container';
                        newContainer.innerHTML = '<div class="hssell-content">' + html + '</div>';


                        sellBtn.parentNode.replaceChild(newContainer, sellBtn);
                    } else if (hjsellContainer) {

                        const contentElement = hjsellContainer.querySelector('.hssell-content');
                        if (contentElement) {
                            contentElement.innerHTML = html;
                        }
                    }


                    const finalContainer = document.getElementById('hjsell-container');
                    if (!finalContainer) {
                        UI.showToast('请等待页面加载完成！', 'error');
                        return;
                    }


                    Utils.smoothScrollTo(finalContainer, -100);

                    if (hasPic) {
                        this.showImages();
                    }
                }

                if (video !== null) {
                    if (!data['sale'] || data['sale']['money_type'] === 0 || data['sale']['is_buy']) {
                        this.getVideo(video, pid);
                    } else {
                        this.queryTopic(pid);
                    }
                } else {
                    UI.showToast('解锁成功', 'success');
                    UI.hideLoadingModal(false)
                }
            })
        },

        queryTopic(pid) {
            fetch(server + '/api/topic/' + pid + '?v=' + CONFIG.VERSION, {
                method: 'GET',
                headers: {
                    'token': Utils.getUserToken(),
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    UI.hideLoadingModal(false)
                    if (data.code) {
                        if (data.msg === '有新版本') {
                            newVersion = data.data;
                            this.showUpdateConfirm();
                            return;
                        }

                        if (data.data['m3u8_url'] !== '') {
                            m3u8_url = server + data.data['m3u8_url'];
                            play_url = server + '/play?url=' + Utils.base64.encode(m3u8_url);
                            this.showVideoActions();
                        } else {
                            UI.showToast('没有可解锁的内容', 'error');
                        }
                    } else {
                        UI.showToast(data.msg, 'error');
                        if (data.data['confirmButtonText'] === '重新登录') {
                            localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
                            localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_NAME);
                            this.updateToolbarButtons(false);
                            showLoginModal();
                        } else if (data.data['confirmButtonText'] === '打开官网') {
                            setTimeout(() => {
                                window.open(server + '/');
                            }, 1500)
                        }
                    }
                })
                .catch(error => { });
        },

        getVideo(item, pid) {
            if (item.remoteUrl.includes('haijiao.live')) {
                m3u8_url = item.remoteUrl;
                play_url = server + '/play?url=' + Utils.base64.encode(item.remoteUrl);
                this.showVideoActions()
                UI.hideLoadingModal(false)
            } else {

                const uid = Utils.getCookieValue('uid');
                const token = Utils.getCookieValue('token');


                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/attachment', true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
                xhr.setRequestHeader('Mver', '211112203214');
                xhr.setRequestHeader('X-User-Id', uid && token ? uid : '172561377002');
                xhr.setRequestHeader('X-User-Token', uid && token ? token : freeToken);

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            try {
                                const res = JSON.parse(xhr.responseText);

                                let data = {};
                                if (res.isEncrypted) {
                                    data = Utils.decrypt(res.data)
                                } else {
                                    data = res.data;
                                }


                                if (!data.remoteUrl.startsWith('http')) {
                                    m3u8_url = play_url = window.location.origin + data.remoteUrl;
                                } else {
                                    m3u8_url = play_url = data.remoteUrl;
                                }


                                play_url = server + '/play?url=' + btoa(play_url);

                                App.showVideoActions();

                                UI.hideLoadingModal(false);
                            } catch (error) {

                                const accXhr = new XMLHttpRequest();
                                accXhr.open('GET', server + '/acc', true);

                                accXhr.onreadystatechange = function () {
                                    if (accXhr.readyState === 4) {
                                        if (accXhr.status === 200) {
                                            try {
                                                const accRes = JSON.parse(accXhr.responseText);

                                                if (accRes.code) {
                                                    freeToken = accRes.data;
                                                    localStorage.setItem('hjty_free_token', freeToken);
                                                    UI.showToast('网络错误: 请重试', 'error');
                                                } else {
                                                    UI.showToast('网络错误: 2', 'error');
                                                }
                                            } catch (error) {
                                                UI.showToast('网络错误: 2', 'error');
                                            }
                                        } else {
                                            UI.showToast('网络错误: 2', 'error');
                                        }
                                    }


                                    UI.hideLoadingModal(false);
                                };

                                accXhr.onerror = function () {
                                    UI.showToast('网络错误: 2', 'error');


                                    UI.hideLoadingModal(false);
                                };

                                accXhr.send();
                            }
                        } else {
                            UI.showToast('网络错误: 2', 'error');

                            UI.hideLoadingModal(false);
                        }
                    }
                };

                xhr.onerror = function () {
                    UI.showToast('网络连接失败', 'error');
                };


                xhr.send(JSON.stringify({
                    id: item.id,
                    is_ios: 0,
                    resource_id: parseInt(pid),
                    resource_type: 'topic',
                    line: 'normal1'
                }));
            }
        },

        showImages() {
            document.querySelectorAll('#hjsell-container img').forEach(async img => {
                try {
                    const response = await fetch(img.dataset.url);

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    const data = await response.text();
                    img.src = Utils.imageDecode(data);
                } catch (error) { }
            });
        },


        showVideoActions() {
            const actions = [
                {
                    name: '播放视频（站内）',
                    key: 'play',
                    subname: '如无法在线播放，可尝试其他在线播放器，或下载后再观看'
                },
                {
                    name: '复制视频地址',
                    key: 'copy',
                    subname: '可复制视频地址到其他地方播放或下载'
                },
                {
                    name: '在线播放器1',
                    key: 'open',
                    subname: '可正常播放',
                    url: 'https://www.m3u8player.online/m3u8?url=' + encodeURIComponent(m3u8_url)
                },
                {
                    name: '在线播放器2',
                    key: 'open',
                    subname: '不支持播放收费视频',
                    url: 'https://m3u8player.org/player.html?url=' + m3u8_url
                },
                {
                    name: '在线播放器3',
                    key: 'open',
                    subname: '不支持播放收费视频',
                    url: 'https://m3u8play.dev/?url=' + m3u8_url
                },
                {
                    name: '视频下载通道1',
                    key: 'open',
                    subname: '【推荐】支持自动下载和在线播放',
                    url: 'https://getm3u8.com/?source=' + m3u8_url + (m3u8_url.includes('?') ? '&' : '?') + 'title=' + topic.title
                },
                {
                    name: '视频下载通道2',
                    key: 'open',
                    subname: '推荐在电脑端操作',
                    url: 'https://blog.luckly-mjw.cn/tool-show/m3u8-downloader/index.html?source=' + m3u8_url
                },
                {
                    name: '视频下载通道3',
                    key: 'open',
                    subname: '需要手动点击下载，推荐在电脑端操作',
                    url: 'https://tools.thatwind.com/tool/m3u8downloader#m3u8=' + encodeURIComponent(m3u8_url)
                },
                {
                    name: '海角天涯官网',
                    key: 'open',
                    subname: '点击访问',
                    url: server + '/'
                }
            ];

            UI.showActions('帖子解锁成功，下滑查看更多操作', actions, (item) => {
                this.handleVideoAction(item)
            });
        },


        handleVideoAction(item) {
            switch (item.key) {
                case 'play':

                    UI.showPlayer(play_url);
                    UI.showToast('视频加载中，请稍后...', 'info');
                    break;

                case 'copy':

                    Utils.copyText(m3u8_url).then(success => {
                        if (success) {
                            UI.showToast('视频地址已复制', 'success');
                        } else {
                            UI.showToast('复制失败', 'error');
                        }
                    });
                    break;

                case 'open':

                    if (item.url) {
                        UI.showToast('正在打开链接...', 'info');
                        setTimeout(() => {
                            window.open(item.url, '_blank');
                        }, 500);
                    }
                    break;

                default:
                    console.log('未知操作:', key);
            }
        },

        getAttachments(data) {
            return new Promise((resolve, reject) => {
                let html = '';

                if (!data || !data.attachments) {
                    resolve(html);
                    return;
                }

                data.attachments.forEach(item => {
                    switch (item.category) {
                        case 'video':
                            video = item;
                            break;
                        case 'audio':
                            html += '<p style="text-align: center"><audio src="' + item.remoteUrl + '" controls="true" id="showaudio"></audio></p>';
                            break;
                        case 'images':
                            hasPic = true;
                            if (!data.content.includes(item.remoteUrl)) {
                                html += '<p><img data-url="' + item.remoteUrl + '" src="/images/common/project/loading.gif" alt="" data-id="' + item.id + '" lazy="loaded"></p>';
                            }
                            break;
                    }
                });

                resolve(html);
            });
        },


        async checkUpdate() {
            const updateUrl = `${server}/api/update?v=${CONFIG.VERSION}`;
            const token = Utils.getUserToken();

            try {
                const response = await fetch(updateUrl, {
                    method: 'GET',
                    headers: {
                        'token': token,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                if (data.msg === '有新版本') {
                    newVersion = data.data;
                    this.showUpdateConfirm();
                }
            } catch (error) {
                UI.showToast('检查更新失败，请切换其他服务器', 'error');
            }
        },


        showUpdateConfirm() {
            const updateModal = document.createElement('div');
            updateModal.id = CONFIG.MODAL_IDS.UPDATE_CONFIRM;
            updateModal.className = 'hjty-modal-overlay';
            updateModal.innerHTML = `
                <div class="hjty-modal-content hjty-update-content">
                    <div class="hjty-modal-header">
                        <h3>脚本升级</h3>
                        <button class="hjty-modal-close" onclick="this.closest('.hjty-modal-overlay').remove()">×</button>
                    </div>
                    <div class="hjty-modal-body">
                        <div class="hjty-update-info">
                            <div class="hjty-update-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="#3b82f6" stroke-width="2"/>
                                    <path d="M8 12L12 8L16 12" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M12 8V16" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/>
                                    <path d="M16 16H8" stroke="#60a5fa" stroke-width="2" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <p class="hjty-update-message">检测到新版本，请更新后再使用！</p>
                            <p class="hjty-update-details">当前版本: ${CONFIG.VERSION}</p>
                            ${newVersion ? `<p class="hjty-update-details">最新版本: ${newVersion}</p>` : ''}
                        </div>
                    </div>
                    <div class="hjty-modal-footer">
                        <button class="hjty-btn hjty-btn-primary hjty-confirm-update-btn">立即更新</button>
                    </div>
                </div>
            `;

            document.body.appendChild(updateModal);


            const confirmBtn = updateModal.querySelector('.hjty-confirm-update-btn');

            confirmBtn.addEventListener('click', () => {
                updateModal.remove();
                window.open(`${server}/js/script.user.js?v=${Math.random()}`, '_blank');
            });


            updateModal.addEventListener('click', (e) => {
                if (e.target === updateModal) updateModal.remove();
            });
        },


        logout() {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_TOKEN);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.USER_NAME);
            this.updateToolbarButtons(false);
            UI.showToast('已退出登录', 'info');
        },


        updateToolbarButtons(isLoggedIn) {
            const toolbarContainer = document.querySelector(CONFIG.SELECTORS.TOOLBAR_CONTAINER);
            if (!toolbarContainer) return;

            let userBtn = toolbarContainer.querySelector(CONFIG.SELECTORS.USER_BTN);

            if (isLoggedIn) {
                if (!userBtn) {
                    userBtn = document.createElement('button');
                    userBtn.className = 'hjty-toolbar-btn hjty-user-btn';
                    userBtn.title = '用户信息';
                    userBtn.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    `;

                    userBtn.addEventListener('click', () => this.showUserInfoModal());

                    const unlockBtn = toolbarContainer.querySelector(CONFIG.SELECTORS.UNLOCK_BTN);
                    unlockBtn.insertAdjacentElement('afterend', userBtn);
                }
            } else {
                if (userBtn) userBtn.remove();
            }
        },


        showUserInfoModal() {
            const userName = localStorage.getItem(CONFIG.STORAGE_KEYS.USER_NAME) || '未知用户';

            const userModal = document.createElement('div');
            userModal.id = CONFIG.MODAL_IDS.USER_INFO;
            userModal.className = 'hjty-modal-overlay';
            userModal.innerHTML = `
                <div class="hjty-modal-content hjty-user-info-content">
                    <div class="hjty-modal-header">
                        <h3>用户信息</h3>
                        <button class="hjty-modal-close" onclick="this.closest('.hjty-modal-overlay').remove()">×</button>
                    </div>
                    <div class="hjty-modal-body">
                        <div class="hjty-user-info">
                            <div class="hjty-user-avatar">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" fill="#8b5cf6" opacity="0.1"/>
                                    <path d="M18 19V17C18 15.3431 16.6569 14 15 14H9C7.34315 14 6 15.3431 6 17V19" stroke="#8b5cf6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                                    <circle cx="12" cy="8" r="3" stroke="#8b5cf6" stroke-width="1.8"/>
                                </svg>
                            </div>
                            <div class="hjty-user-details">
                                <p class="hjty-user-name">${userName}</p>
                                <p class="hjty-user-status">已登录</p>
                            </div>
                        </div>
                    </div>
                    <div class="hjty-modal-footer">
                        <button class="hjty-btn hjty-btn-secondary hjty-visit-website-btn">访问官网</button>
                        <button class="hjty-btn hjty-btn-danger hjty-logout-btn">退出登录</button>
                    </div>
                </div>
            `;

            document.body.appendChild(userModal);


            const visitWebsiteBtn = userModal.querySelector('.hjty-visit-website-btn');
            const logoutBtn = userModal.querySelector('.hjty-logout-btn');

            visitWebsiteBtn.addEventListener('click', () => window.open(server, '_blank'));
            logoutBtn.addEventListener('click', () => {
                userModal.remove();
                this.showLogoutConfirm();
            });


            userModal.addEventListener('click', (e) => {
                if (e.target === userModal) userModal.remove();
            });
        },


        showLogoutConfirm() {
            const confirmModal = document.createElement('div');
            confirmModal.id = CONFIG.MODAL_IDS.LOGOUT_CONFIRM;
            confirmModal.className = 'hjty-modal-overlay';
            confirmModal.innerHTML = `
                <div class="hjty-modal-content hjty-confirm-content">
                    <div class="hjty-modal-header">
                        <h3>确认退出</h3>
                        <button class="hjty-modal-close" onclick="this.closest('.hjty-modal-overlay').remove()">×</button>
                    </div>
                    <div class="hjty-modal-body">
                        <p class="hjty-confirm-message">确定要退出登录吗？</p>
                    </div>
                    <div class="hjty-modal-footer">
                        <button class="hjty-btn hjty-btn-secondary hjty-cancel-btn">取消</button>
                        <button class="hjty-btn hjty-btn-primary hjty-confirm-btn">确认退出</button>
                    </div>
                </div>
            `;

            document.body.appendChild(confirmModal);


            const cancelBtn = confirmModal.querySelector('.hjty-cancel-btn');
            const confirmBtn = confirmModal.querySelector('.hjty-confirm-btn');

            cancelBtn.addEventListener('click', () => confirmModal.remove());
            confirmBtn.addEventListener('click', () => {
                confirmModal.remove();
                this.logout();
            });


            confirmModal.addEventListener('click', (e) => {
                if (e.target === confirmModal) confirmModal.remove();
            });
        },

        formatTitle(data) {
            data.results.forEach(item => {
                const tips = [];
                tips.push('money_type' in item ? ['', '💰', '💎'][item.money_type] : '');
                item.hasVideo && tips.push('🎥');
                item.hasAudio && tips.push('🎵');
                item.title = `${tips.join(' ')} ${item.title}`;
            });
            return data;
        },

        getShortVideoUrl(responseText) {
            try {
                let res = JSON.parse(responseText);
                if (res['isEncrypted']) {
                    let data = Utils.decrypt(res.data);
                    if (data['category'] && data['category'] === 'video' && data['remoteUrl']) {
                        if (!data['remoteUrl'].startsWith('http')) {
                            shortVideoUrl = window.location.origin + data['remoteUrl'];
                        } else {
                            shortVideoUrl = data['remoteUrl'];
                        }
                    }
                }
            } catch (e) { }
        },

        fixShortVideo(responseText) {
            try {
                responseText = JSON.parse(responseText);
                let video = Utils.decrypt(responseText.data);
                video.type = 1;
                video.amount = 0;
                video.money_type = 0;
                video.vip = 0;
                video.message = '';
                responseText.data = Utils.encrypt(video);
                return JSON.stringify(responseText);
            } catch (e) {
                return responseText;
            }
        }
    };


    let buttonInitialized = false;

    function checkTitleAndInitButton() {
        if (buttonInitialized) return true;

        const currentTitle = document.title;
        if (currentTitle === "海角社区") {
            console.log('海角社区助手已启动，版本:', CONFIG.VERSION);
            buttonInitialized = true;
            start();
            return true;
        }
        return false;
    }

    function setupTitleObserver() {
        const titleObserver = new MutationObserver((mutations) => {
            if (!buttonInitialized && document.title === "海角社区") {
                buttonInitialized = true;
                console.log('海角社区助手已启动，版本:', CONFIG.VERSION);
                start();
                titleObserver.disconnect();
            }
        });

        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleObserver.observe(titleElement, {
                childList: true,
                characterData: true,
                subtree: true
            });
        }

        let checkCount = 0;
        const maxChecks = 10;
        const checkInterval = setInterval(() => {
            if (buttonInitialized || checkCount >= maxChecks) {
                clearInterval(checkInterval);
                return;
            }

            if (checkTitleAndInitButton()) {
                buttonInitialized = true;
                clearInterval(checkInterval);
            }

            checkCount++;
        }, 1000);
    }

    function start() {
        initStyles();
        initFloatingButton();


        if (Utils.checkLoginStatus()) {
            App.checkUpdate();
        }
    }


    function initStyles() {
        if (document.getElementById('hjty-global-styles')) return;

        const style = document.createElement('style');
        style.id = 'hjty-global-styles';
        style.textContent = `
            /* 浮动工具栏样式 */
            #hjty-floating-toolbar {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            #hjty-floating-toolbar.hjty-collapsed {
                right: -48px; /* 隐藏主体，只露出切换按钮 */
            }

            .hjty-toolbar-container {
                display: flex;
                flex-direction: column;
                gap: 8px;
                padding: 8px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                position: relative;
            }

            /* 切换按钮样式 */
            .hjty-toggle-btn {
                position: absolute;
                left: -20px;
                top: 50%;
                transform: translateY(-50%);
                width: 24px;
                height: 48px;
                border: none;
                border-radius: 12px 0 0 12px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                color: #374151;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                z-index: 1;
            }

            .hjty-toggle-btn:hover {
                background: rgba(255, 255, 255, 1);
                transform: translateY(-50%) scale(1.05);
                color: #1f2937;
            }

            .hjty-toggle-btn:active {
                transform: translateY(-50%) scale(0.95);
            }

            .hjty-toggle-btn svg {
                transition: transform 0.3s ease;
            }

            #hjty-floating-toolbar.hjty-collapsed .hjty-toggle-btn svg {
                transform: rotate(180deg);
            }

            .hjty-toolbar-btn {
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 8px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .hjty-toolbar-btn:hover {
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .hjty-toolbar-btn:active {
                transform: translateY(0);
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }

            .hjty-unlock-btn {
                background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            }

            .hjty-unlock-btn:hover {
                box-shadow: 0 8px 25px rgba(17, 153, 142, 0.4);
            }

            .hjty-settings-btn {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }

            .hjty-settings-btn:hover {
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .hjty-user-btn {
                background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
            }

            .hjty-user-btn:hover {
                box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
            }

            .hjty-toolbar-btn svg {
                transition: transform 0.3s ease;
            }

            .hjty-toolbar-btn:hover svg {
                transform: scale(1.1);
            }

            /* Modal 通用样式 */
            .hjty-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: hjty-fadeIn 0.3s ease;
                z-index: 20000;
            }

            .hjty-modal-content {
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow: hidden;
                animation: hjty-slideUp 0.3s ease;
            }

            .hjty-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 24px;
                border-bottom: 1px solid #e5e7eb;
            }

            .hjty-modal-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
            }

            .hjty-modal-close {
                background: none;
                border: none;
                font-size: 24px;
                color: #6b7280;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                transition: all 0.2s ease;
            }

            .hjty-modal-close:hover {
                background: #f3f4f6;
                color: #374151;
            }

            .hjty-modal-body {
                padding: 16px 24px;
                max-height: 350px;
                overflow-y: auto;
            }

            .hjty-modal-footer {
                padding: 16px 24px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                gap: 12px;
            }

            /* 登录Modal样式 */
            .hjty-login-content {
                max-width: 400px;
                width: 90%;
            }

            .hjty-login-content .hjty-modal-body {
                padding: 24px;
            }

            .hjty-login-form {
                padding: 0;
            }

            .hjty-form-group {
                margin-bottom: 20px;
            }

            .hjty-form-group:last-of-type {
                margin-bottom: 0;
            }

            .hjty-form-group label {
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 500;
                color: #374151;
            }

            .hjty-form-input {
                display: block;
                width: 100%;
                padding: 12px 16px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 14px;
                transition: all 0.2s ease;
                background: white;
                box-sizing: border-box;
            }

            .hjty-form-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }

            .hjty-form-input::placeholder {
                color: #9ca3af;
            }

            .hjty-form-actions {
                display: flex;
                gap: 12px;
                margin-top: 32px;
            }

            /* 按钮样式 */
            .hjty-btn {
                flex: 1;
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }

            .hjty-btn-primary {
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
            }

            .hjty-btn-primary:hover {
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .hjty-btn-primary:disabled {
                background: #9ca3af;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
                min-height: 44px;
            }

            .hjty-btn-secondary {
                background: white;
                color: #374151;
                border: 1px solid #d1d5db;
            }

            .hjty-btn-secondary:hover {
                background: #f9fafb;
                border-color: #9ca3af;
            }

            .hjty-btn-danger {
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
            }

            .hjty-btn-danger:hover {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            }

            /* 按钮内加载spinner样式 */
            .hjty-btn .hjty-loading-spinner {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                margin: 0;
                flex-shrink: 0;
            }

            .hjty-btn .hjty-spinner-ring {
                width: 14px;
                height: 14px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: hjty-spin 1s linear infinite;
            }

            /* 加载框样式 */
            #hjty-loading-modal {
                z-index: 40000;
            }

            .hjty-loading-overlay {
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
            }

            .hjty-loading-content {
                max-width: 320px;
                width: 90%;
            }

            .hjty-loading-header {
                position: relative;
                height: 20px;
                padding: 16px 16px 0 16px;
            }

            .hjty-loading-close {
                position: absolute;
                top: 16px;
                right: 16px;
                width: 24px;
                height: 24px;
                font-size: 20px;
                border-radius: 6px;
            }

            .hjty-loading-body {
                padding: 20px 24px 32px 24px;
                text-align: center;
            }

            .hjty-loading-spinner {
                margin: 0 auto 20px auto;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .hjty-spinner-ring {
                width: 32px;
                height: 32px;
                border: 3px solid #e5e7eb;
                border-top: 3px solid #3b82f6;
                border-radius: 50%;
                animation: hjty-spin 1s linear infinite;
            }

            .hjty-loading-message {
                margin: 0;
                font-size: 16px;
                color: #374151;
                font-weight: 500;
                line-height: 1.5;
            }

            /* 用户信息对话框样式 */
            .hjty-user-info-content {
                max-width: 400px;
                width: 90%;
            }

            .hjty-user-info {
                display: flex;
                align-items: center;
                gap: 16px;
                padding: 20px 0;
            }

            .hjty-user-avatar {
                flex-shrink: 0;
            }

            .hjty-user-details {
                flex: 1;
            }

            .hjty-user-name {
                margin: 0 0 8px 0;
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
            }

            .hjty-user-status {
                margin: 0;
                font-size: 14px;
                color: #10b981;
                font-weight: 500;
            }

            /* 确认对话框样式 */
            .hjty-confirm-content {
                max-width: 400px;
                width: 90%;
            }

            .hjty-confirm-message {
                margin: 0;
                font-size: 16px;
                color: #374151;
                text-align: center;
                line-height: 1.5;
            }

            /* 服务器切换Modal样式 */
            .hjty-server-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .hjty-server-item {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                border: 1px solid #e5e7eb;
                border-radius: 8px;
                transition: all 0.2s ease;
                background: #fafafa;
                cursor: pointer;
            }

            .hjty-server-item:hover {
                border-color: #d1d5db;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                background: #f9fafb;
            }

            .hjty-server-item.hjty-online {
                border-color: #10b981;
                background: #f0fdf4;
            }

            .hjty-server-item.hjty-offline {
                border-color: #ef4444;
                background: #fef2f2;
            }

            .hjty-server-item.hjty-selected {
                border-color: #3b82f6;
                background: #eff6ff;
            }

            .hjty-server-item:not(.hjty-selected):hover {
                border-color: #3b82f6;
                background: #f1f5f9;
            }

            .hjty-server-info {
                flex: 1;
                min-width: 0;
            }

            .hjty-server-name {
                font-weight: 500;
                color: #1f2937;
                font-size: 14px;
                position: relative;
            }

            .hjty-server-item.hjty-selected .hjty-server-name {
                color: #1e40af;
                font-weight: 600;
            }

            .hjty-radio-indicator {
                width: 16px;
                height: 16px;
                border: 2px solid #d1d5db;
                border-radius: 50%;
                margin-right: 12px;
                flex-shrink: 0;
                position: relative;
                transition: all 0.2s ease;
            }

            .hjty-radio-indicator.hjty-radio-selected {
                border-color: #3b82f6;
                background: #3b82f6;
            }

            .hjty-radio-indicator.hjty-radio-selected::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 6px;
                height: 6px;
                background: white;
                border-radius: 50%;
            }

            .hjty-server-status {
                display: flex;
                align-items: center;
                gap: 6px;
                margin: 0 12px;
                flex-shrink: 0;
            }

            .hjty-status-indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                position: relative;
                flex-shrink: 0;
            }

            .hjty-status-indicator.hjty-checking {
                background: #f59e0b;
            }

            .hjty-status-indicator.hjty-online {
                background: #10b981;
            }

            .hjty-status-indicator.hjty-offline {
                background: #ef4444;
            }

            .hjty-status-text {
                font-size: 11px;
                color: #374151;
                min-width: 40px;
                font-weight: 600;
            }

            .hjty-latency {
                font-size: 11px;
                color: #10b981;
                font-weight: 600;
                min-width: 35px;
            }

            .hjty-refresh-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .hjty-refresh-btn:hover:not(:disabled) {
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .hjty-refresh-btn:disabled {
                background: #9ca3af;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            .hjty-switch-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                color: white;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .hjty-switch-btn:hover:not(:disabled) {
                background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
            }

            .hjty-switch-btn:disabled {
                background: #9ca3af;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }

            /* 升级确认框样式 */
            .hjty-update-content {
                max-width: 450px;
                width: 90%;
            }

            .hjty-update-info {
                text-align: center;
                padding: 20px 0;
            }

            .hjty-update-icon {
                margin-bottom: 16px;
                display: flex;
                justify-content: center;
            }

            .hjty-update-message {
                margin: 0 0 16px 0;
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
            }

            .hjty-update-details {
                margin: 8px 0;
                font-size: 14px;
                color: #6b7280;
            }

            .hjty-update-description {
                margin: 16px 0 0 0;
                font-size: 14px;
                color: #374151;
                background: #f8fafc;
                padding: 12px;
                border-radius: 8px;
                border-left: 4px solid #3b82f6;
                text-align: left;
            }

            /* Toast 提示样式 */
            .hjty-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(10px);
                z-index: 100000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                font-weight: 500;
                max-width: 400px;
                min-width: 300px;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .hjty-toast-show {
                transform: translateX(0);
                opacity: 1;
            }

            .hjty-toast-success {
                background: rgba(16, 185, 129, 0.95);
                color: white;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }

            .hjty-toast-error {
                background: rgba(239, 68, 68, 0.95);
                color: white;
                border: 1px solid rgba(239, 68, 68, 0.3);
            }

            .hjty-toast-warning {
                background: rgba(245, 158, 11, 0.95);
                color: white;
                border: 1px solid rgba(245, 158, 11, 0.3);
            }

            .hjty-toast-info {
                background: rgba(59, 130, 246, 0.95);
                color: white;
                border: 1px solid rgba(59, 130, 246, 0.3);
            }

            .hjty-toast-icon {
                flex-shrink: 0;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .hjty-toast-message {
                flex: 1;
                line-height: 1.4;
            }

            /* 操作抽屉样式 */
            .hjty-action-drawer-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
                z-index: 30000;
                display: flex;
                align-items: flex-end;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .hjty-action-drawer-overlay.hjty-action-drawer-show {
                opacity: 1;
            }

            .hjty-action-drawer {
                background: #f8fafc;
                border-radius: 16px 16px 0 0;
                width: 100%;
                max-height: 80vh;
                display: flex;
                flex-direction: column;
                transform: translateY(100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.2);
            }

            .hjty-action-drawer-show .hjty-action-drawer {
                transform: translateY(0);
            }

            .hjty-action-header {
                padding: 20px 24px 16px 24px;
                border-bottom: 1px solid #e5e7eb;
                text-align: center;
                flex-shrink: 0;
                background: white;
                border-radius: 16px 16px 0 0;
            }

            .hjty-action-title {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                color: #1f2937;
            }

            .hjty-action-list {
                flex: 1;
                overflow-y: auto;
                padding: 8px 0;
                background: white;
            }

            .hjty-action-item {
                display: flex;
                align-items: center;
                padding: 16px 24px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                border-bottom: 1px solid #f3f4f6;
            }

            .hjty-action-item:hover {
                background: #f9fafb;
            }

            .hjty-action-item:active {
                background: #f3f4f6;
            }

            .hjty-action-item:last-child {
                border-bottom: none;
            }

            .hjty-action-content {
                flex: 1;
                min-width: 0;
            }

            .hjty-action-name {
                font-size: 16px;
                font-weight: 500;
                color: #1f2937;
                margin-bottom: 4px;
                line-height: 1.4;
            }

            .hjty-action-subname {
                font-size: 13px;
                color: #6b7280;
                line-height: 1.4;
                word-break: break-all;
            }

            .hjty-action-arrow {
                flex-shrink: 0;
                margin-left: 12px;
                color: #9ca3af;
                transition: transform 0.2s ease;
                display: flex;
                align-items: center;
                align-self: center;
            }

            .hjty-action-item:hover .hjty-action-arrow {
                transform: translateX(2px);
                color: #6b7280;
            }

            .hjty-action-footer {
                padding: 12px 16px;
                border-top: 1px solid #e5e7eb;
                flex-shrink: 0;
                background: #f8fafc;
            }

            .hjty-action-close-btn {
                display: block;
                width: 100%;
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                background: #f3f4f6;
                color: #374151;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .hjty-action-close-btn:hover {
                background: #e5e7eb;
                color: #1f2937;
            }

            .hjty-action-close-btn:active {
                background: #d1d5db;
                transform: translateY(1px);
            }

            /* 播放器弹窗样式 */
            .hjty-player-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.45);
                backdrop-filter: blur(5px);
                z-index: 40000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .hjty-player-modal-overlay.hjty-player-modal-show {
                opacity: 1;
            }

            .hjty-player-modal-content {
                background: #000000;
                border-radius: 12px;
                width: 95%;
                max-width: 1200px;
                height: 90%;
                max-height: 800px;
                display: flex;
                flex-direction: column;
                transform: scale(0.9);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                overflow: hidden;
            }

            .hjty-player-modal-show .hjty-player-modal-content {
                transform: scale(1);
            }

            .hjty-player-header {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                padding: 16px 20px;
                background: #000000;
                flex-shrink: 0;
            }

            .hjty-player-close {
                background: none;
                border: none;
                font-size: 28px;
                color: #ffffff;
                cursor: pointer;
                padding: 0;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 8px;
                transition: all 0.2s ease;
                font-weight: 300;
            }

            .hjty-player-close:hover {
                background: rgba(255, 255, 255, 0.1);
                color: #ff4757;
                transform: scale(1.1);
            }

            .hjty-player-close:active {
                transform: scale(0.95);
            }

            .hjty-player-body {
                flex: 1;
                background: #000000;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
            }

            #hjty-play-box {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* 动画 */
            @keyframes hjty-fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes hjty-slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            @keyframes hjty-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            /* 移动端适配 */
            @media (max-width: 768px) {
                #hjty-floating-toolbar {
                    right: 15px;
                    top: auto;
                    bottom: 180px;
                    transform: none;
                }

                #hjty-floating-toolbar.hjty-collapsed {
                    right: -54px; /* 移动端收起时的位置 */
                }

                .hjty-toggle-btn {
                    left: -20px;
                    width: 20px;
                    height: 40px;
                }

                .hjty-toolbar-btn {
                    width: 36px;
                    height: 36px;
                }

                .hjty-modal-content {
                    width: 95%;
                    margin: 20px;
                }

                .hjty-modal-body {
                    padding: 12px 16px;
                }

                .hjty-server-item {
                    padding: 10px 12px;
                }

                .hjty-server-name {
                    font-size: 13px;
                }

                .hjty-server-status {
                    margin: 0 8px;
                }

                .hjty-login-content {
                    width: 95%;
                    margin: 20px;
                }

                .hjty-form-actions {
                    flex-direction: column;
                }

                .hjty-toast {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    max-width: none;
                    min-width: auto;
                }

                /* 播放器移动端适配 */
                .hjty-player-modal-content {
                    width: 100%;
                    height: 100%;
                    max-width: none;
                    max-height: none;
                    border-radius: 0;
                }

                .hjty-player-header {
                    padding: 12px 16px;
                }

                .hjty-player-close {
                    width: 36px;
                    height: 36px;
                    font-size: 24px;
                }
            }

            /* 暗色模式适配 */
            @media (prefers-color-scheme: dark) {
                .hjty-toolbar-container {
                    background: rgba(30, 30, 30, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .hjty-toggle-btn {
                    background: rgba(30, 30, 30, 0.95);
                    backdrop-filter: blur(10px);
                    color: #f3f4f6;
                }

                .hjty-toggle-btn:hover {
                    background: rgba(30, 30, 30, 1);
                    color: #ffffff;
                }

                .hjty-modal-content {
                    background: #1f2937;
                }

                .hjty-modal-header {
                    border-bottom-color: #374151;
                }

                .hjty-modal-header h3 {
                    color: #f9fafb;
                }

                .hjty-modal-close {
                    color: #9ca3af;
                }

                .hjty-modal-close:hover {
                    background: #374151;
                    color: #f3f4f6;
                }

                .hjty-modal-footer {
                    border-top-color: #374151;
                }

                .hjty-btn-secondary {
                    background: #374151;
                    color: #f3f4f6;
                    border-color: #4b5563;
                }

                .hjty-btn-secondary:hover {
                    background: #4b5563;
                    border-color: #6b7280;
                }

                .hjty-loading-content {
                    background: #1f2937;
                }

                .hjty-loading-close:hover {
                    background: #374151;
                    color: #f3f4f6;
                }

                .hjty-loading-message {
                    color: #f3f4f6;
                }

                .hjty-user-name {
                    color: #f9fafb;
                }

                .hjty-user-status {
                    color: #34d399;
                }

                .hjty-confirm-message {
                    color: #f3f4f6;
                }

                .hjty-update-message {
                    color: #f9fafb;
                }

                .hjty-update-details {
                    color: #9ca3af;
                }

                .hjty-update-description {
                    color: #f3f4f6;
                    background: #374151;
                    border-left-color: #60a5fa;
                }

                .hjty-server-item {
                    border-color: #374151;
                    background: #1f2937;
                }

                .hjty-server-item:hover {
                    border-color: #4b5563;
                    background: #374151;
                }

                .hjty-server-item.hjty-online {
                    background: #064e3b;
                    border-color: #059669;
                }

                .hjty-server-item.hjty-offline {
                    background: #7f1d1d;
                    border-color: #dc2626;
                }

                .hjty-server-item.hjty-selected {
                    background: #1e3a8a;
                    border-color: #3b82f6;
                }

                .hjty-server-item.hjty-selected .hjty-server-name {
                    color: #93c5fd;
                }

                .hjty-server-name {
                    color: #f9fafb;
                }

                .hjty-radio-indicator {
                    border-color: #4b5563;
                }

                .hjty-radio-indicator.hjty-radio-selected {
                    border-color: #60a5fa;
                    background: #60a5fa;
                }

                .hjty-status-text {
                    color: #d1d5db;
                }

                .hjty-refresh-btn:disabled {
                    background: #4b5563;
                }

                .hjty-switch-btn:disabled {
                    background: #4b5563;
                }

                .hjty-form-group label {
                    color: #f3f4f6;
                }

                .hjty-form-input {
                    background: #374151;
                    border-color: #4b5563;
                    color: #f3f4f6;
                }

                .hjty-form-input:focus {
                    border-color: #60a5fa;
                    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
                }

                .hjty-form-input::placeholder {
                    color: #6b7280;
                }

                /* 操作抽屉暗色模式 */
                .hjty-action-drawer {
                    background: #111827;
                }

                .hjty-action-header {
                    border-bottom-color: #374151;
                    background: #1f2937;
                }

                .hjty-action-title {
                    color: #f9fafb;
                }

                .hjty-action-item {
                    border-bottom-color: #374151;
                }

                .hjty-action-item:hover {
                    background: #374151;
                }

                .hjty-action-item:active {
                    background: #4b5563;
                }

                .hjty-action-name {
                    color: #f9fafb;
                }

                .hjty-action-subname {
                    color: #9ca3af;
                }

                .hjty-action-arrow {
                    color: #6b7280;
                }

                .hjty-action-item:hover .hjty-action-arrow {
                    color: #9ca3af;
                }

                .hjty-action-list {
                    background: #1f2937;
                }

                .hjty-action-footer {
                    border-top-color: #374151;
                    background: #111827;
                }

                .hjty-action-close-btn {
                    background: #374151;
                    color: #f3f4f6;
                }

                .hjty-action-close-btn:hover {
                    background: #4b5563;
                    color: #f9fafb;
                }

                .hjty-action-close-btn:active {
                    background: #6b7280;
                }
            }
            
            #play-box {height: 100%;display: flex;align-items: center;background-color: #000;}
            .van-popup.van-popup--center.play-box {width: 100%;height: 100%;max-width: 100%;}
            #bbs_float_menu{z-index:1!important;}
            #body.el-popup-parent--hidden{overflow: auto;}
            .van-list .van-list__loading,
            .sell-btn:before,
            .containeradvertising,
            .ishide,
            #tidio-chat{display: none !important;}
        `;

        document.head.appendChild(style);
    }


    function initFloatingButton() {
        if (document.getElementById('hjty-floating-toolbar')) return;

        const floatingToolbar = document.createElement('div');
        floatingToolbar.id = 'hjty-floating-toolbar';
        floatingToolbar.innerHTML = `
            <div class="hjty-toolbar-container">
                <button class="hjty-toggle-btn" title="收起工具栏">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="hjty-toolbar-btn hjty-unlock-btn" title="解锁">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 10V8C6 5.79086 7.79086 4 10 4H14C16.2091 4 18 5.79086 18 8V10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" stroke-width="2" fill="none"/>
                        <circle cx="12" cy="15" r="1" fill="currentColor"/>
                    </svg>
                </button>
                <button class="hjty-toolbar-btn hjty-settings-btn" title="切换服务器">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="3" width="20" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
                        <rect x="2" y="10" width="20" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
                        <rect x="2" y="17" width="20" height="4" rx="1" stroke="currentColor" stroke-width="2"/>
                        <circle cx="6" cy="5" r="1" fill="currentColor"/>
                        <circle cx="6" cy="12" r="1" fill="currentColor"/>
                        <circle cx="6" cy="19" r="1" fill="currentColor"/>
                        <path d="M16 8L18 10L16 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M8 15L10 17L8 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(floatingToolbar);


        const unlockBtn = floatingToolbar.querySelector(CONFIG.SELECTORS.UNLOCK_BTN);
        const settingsBtn = floatingToolbar.querySelector(CONFIG.SELECTORS.SETTINGS_BTN);
        const toggleBtn = floatingToolbar.querySelector(CONFIG.SELECTORS.TOGGLE_BTN);

        unlockBtn.addEventListener('click', handleUnlockClick);

        const debouncedSwitchServer = Utils.debounce(() => switchServer(), 300);
        settingsBtn.addEventListener('click', debouncedSwitchServer);


        const debouncedToggleToolbar = Utils.debounce(() => toggleToolbar(), 200);
        toggleBtn.addEventListener('click', debouncedToggleToolbar);


        if (toolbarCollapsed) {
            floatingToolbar.classList.add('hjty-collapsed');
        }


        toggleBtn.title = toolbarCollapsed ? '展开工具栏' : '收起工具栏';


        App.updateToolbarButtons(Utils.checkLoginStatus());


        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                e.preventDefault();
                toggleToolbar();
            }
        });
    }


    function toggleToolbar() {
        const toolbar = document.getElementById('hjty-floating-toolbar');
        if (!toolbar) return;

        toolbarCollapsed = !toolbarCollapsed;

        if (toolbarCollapsed) {
            toolbar.classList.add('hjty-collapsed');
        } else {
            toolbar.classList.remove('hjty-collapsed');
        }


        const toggleBtn = toolbar.querySelector(CONFIG.SELECTORS.TOGGLE_BTN);
        if (toggleBtn) {
            toggleBtn.title = toolbarCollapsed ? '展开工具栏' : '收起工具栏';
        }


        localStorage.setItem('hjty_toolbar_collapsed', toolbarCollapsed.toString());
    }


    function handleUnlockClick() {
        if (newVersion !== '') {
            App.showUpdateConfirm();
            return;
        }

        if (!Utils.checkLoginStatus()) {
            showLoginModal();
            return;
        }

        Utils.deleteCookie('NOTLOGIN');
        const pid = Utils.getPid();
        if (!pid) {
            if (/\/videoplay/.test(location.href)) {
                Utils.copyText(shortVideoUrl).then(success => {
                    if (success) {
                        UI.showToast('短视频地址复制成功', 'success');
                    } else {
                        UI.showToast('短视频地址复制失败', 'error');
                    }
                });
            } else {
                UI.showToast('请进入帖子再解锁！', 'error');
            }
            return;
        }

        if (m3u8_url !== '') {
            App.showVideoActions();
            return;
        }


        UI.showLoadingModal('解锁中...', true, function () {
            UI.showToast('解锁已取消', 'warning');
        });

        App.getTopic(pid).then(topic => {
            App.showTopic(topic, pid);
        }).catch((err) => {
            UI.showToast(err, 'warning');
        });
    }


    function showLoginModal() {
        if (document.getElementById(CONFIG.MODAL_IDS.LOGIN)) return;

        const loginModal = document.createElement('div');
        loginModal.id = CONFIG.MODAL_IDS.LOGIN;
        loginModal.className = 'hjty-modal-overlay';
        loginModal.innerHTML = `
            <div class="hjty-modal-content hjty-login-content">
                <div class="hjty-modal-header">
                    <h3>用户登录</h3>
                    <button class="hjty-modal-close" onclick="this.closest('.hjty-modal-overlay').remove()">×</button>
                </div>
                <div class="hjty-modal-body">
                    <form class="hjty-login-form">
                        <div class="hjty-form-group">
                            <label for="hjty-username">账号</label>
                            <input type="text" id="hjty-username" class="hjty-form-input" placeholder="请输入账号" required>
                        </div>
                        <div class="hjty-form-group">
                            <label for="hjty-password">密码</label>
                            <input type="password" id="hjty-password" class="hjty-form-input" placeholder="请输入密码" required>
                        </div>
                        <div class="hjty-form-actions">
                            <button type="submit" class="hjty-btn hjty-btn-primary hjty-login-btn">登录</button>
                            <button type="button" class="hjty-btn hjty-btn-secondary hjty-register-btn">注册</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(loginModal);


        const loginForm = loginModal.querySelector('.hjty-login-form');
        const loginBtn = loginModal.querySelector('.hjty-login-btn');
        const registerBtn = loginModal.querySelector('.hjty-register-btn');

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('hjty-username').value.trim();
            const password = document.getElementById('hjty-password').value.trim();

            if (!username || !password) {
                UI.showToast('请填写完整信息', 'warning');
                return;
            }

            await handleLogin(username, password, loginBtn, loginModal);
        });

        registerBtn.addEventListener('click', () => {
            window.open(`${server}/register`, '_blank');
        });


        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) loginModal.remove();
        });
    }


    async function handleLogin(username, password, loginBtn, loginModal) {
        try {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<div class="hjty-loading-spinner"><div class="hjty-spinner-ring"></div></div>登录中...';

            const response = await fetch(`${server}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();

            if (!result.code) {
                localStorage.setItem(CONFIG.STORAGE_KEYS.USER_TOKEN, result.token);
                localStorage.setItem(CONFIG.STORAGE_KEYS.USER_NAME, username);

                UI.showToast('登录成功', 'success');
                loginModal.remove();
                App.updateToolbarButtons(true);
            } else {
                UI.showToast(result.msg || '登录失败', 'error');
            }
        } catch (error) {
            UI.showToast('网络错误，请重试', 'error');
        } finally {
            loginBtn.disabled = false;
            loginBtn.innerHTML = '登录';
        }
    }


    function switchServer() {

        const servers = [
            { id: 'vip', name: '服务器A', url: 'https://vip.tianya365.top' },
            { id: 'b', name: '服务器B', url: 'https://haijiao.tianya365.top' },
            { id: 'c', name: '服务器C', url: 'https://new.tianya365.top' },
            { id: 'd', name: '服务器D', url: 'https://hj.tianya365.top' }
        ];


        function getServerIdByUrl(url) {
            const foundServer = servers.find(s => s.url === url);
            return foundServer ? foundServer.id : 'vip';
        }

        const currentServerId = getServerIdByUrl(server);

        const modal = document.createElement('div');
        modal.id = CONFIG.MODAL_IDS.SERVER;
        modal.className = 'hjty-modal-overlay';
        modal.style.zIndex = '25000';
        modal.innerHTML = `
            <div class="hjty-modal-content">
                <div class="hjty-modal-header">
                    <h3>服务器节点切换</h3>
                    <button class="hjty-modal-close" onclick="this.closest('.hjty-modal-overlay').remove()">×</button>
                </div>
                <div class="hjty-modal-body">
                    <div class="hjty-server-list">
                        ${servers.map(srv => `
                            <div class="hjty-server-item ${srv.id === currentServerId ? 'hjty-selected' : ''}" data-server-id="${srv.id}">
                                <div class="hjty-radio-indicator ${srv.id === currentServerId ? 'hjty-radio-selected' : ''}"></div>
                                <div class="hjty-server-info">
                                    <div class="hjty-server-name">${srv.name}</div>
                                </div>
                                <div class="hjty-server-status">
                                    <div class="hjty-status-indicator hjty-checking"></div>
                                    <span class="hjty-status-text">检测中</span>
                                    <span class="hjty-latency"></span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="hjty-modal-footer">
                    <button class="hjty-refresh-btn">重新检测</button>
                    <button class="hjty-switch-btn" disabled>立即切换</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        let isChecking = false;
        let selectedServerId = currentServerId;


        async function checkServer(server) {
            const startTime = Date.now();
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 60000);

                await fetch(`${server.url}/api/login`, {
                    method: 'HEAD',
                    mode: 'no-cors',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);
                const latency = Date.now() - startTime;
                return { success: true, latency };
            } catch (error) {
                return { online: false, latency: 0 };
            }
        }


        function updateServerStatus(serverId, result) {
            const serverItem = modal.querySelector(`[data-server-id="${serverId}"]`);
            const statusIndicator = serverItem.querySelector('.hjty-status-indicator');
            const statusText = serverItem.querySelector('.hjty-status-text');
            const latencySpan = serverItem.querySelector('.hjty-latency');

            statusIndicator.className = `hjty-status-indicator ${result.success ? 'hjty-online' : 'hjty-offline'}`;
            statusText.textContent = result.success ? '正常' : '异常';

            if (result.success) {
                latencySpan.textContent = `${result.latency}ms`;
                serverItem.classList.add('hjty-online');
                serverItem.classList.remove('hjty-offline');
            } else {
                latencySpan.textContent = '';
                serverItem.classList.add('hjty-offline');
                serverItem.classList.remove('hjty-online');
            }
        }


        function selectServer(serverId) {

            modal.querySelectorAll('.hjty-server-item').forEach(item => {
                item.classList.remove('hjty-selected');
                item.querySelector('.hjty-radio-indicator').classList.remove('hjty-radio-selected');
            });


            const selectedItem = modal.querySelector(`[data-server-id="${serverId}"]`);
            selectedItem.classList.add('hjty-selected');
            selectedItem.querySelector('.hjty-radio-indicator').classList.add('hjty-radio-selected');

            selectedServerId = serverId;


            const switchBtn = modal.querySelector('.hjty-switch-btn');
            switchBtn.disabled = false;
        }


        function switchToServer(serverId) {
            const selectedServer = servers.find(s => s.id === serverId);
            if (selectedServer) {
                server = selectedServer.url;
                localStorage.setItem(CONFIG.STORAGE_KEYS.SERVER, server);
                UI.showToast(`已切换到：${selectedServer.name}`, 'success');
                modal.remove();


                App.updateToolbarButtons(Utils.checkLoginStatus());
            }
        }


        async function checkAllServers() {
            if (isChecking) return;

            isChecking = true;
            const refreshBtn = modal.querySelector('.hjty-refresh-btn');
            refreshBtn.disabled = true;
            refreshBtn.textContent = '检测中...';


            modal.querySelectorAll('.hjty-server-item').forEach(item => {
                const statusIndicator = item.querySelector('.hjty-status-indicator');
                const statusText = item.querySelector('.hjty-status-text');
                const latencySpan = item.querySelector('.hjty-latency');

                statusIndicator.className = 'hjty-status-indicator hjty-checking';
                statusText.textContent = '检测中';
                latencySpan.textContent = '';
                item.classList.remove('hjty-online', 'hjty-offline');
            });


            const checkPromises = servers.map(async (srv) => {
                const result = await checkServer(srv);
                updateServerStatus(srv.id, result);
            });

            await Promise.all(checkPromises);

            refreshBtn.disabled = false;
            refreshBtn.textContent = '重新检测';
            isChecking = false;
        }


        modal.querySelectorAll('.hjty-server-item').forEach(item => {
            item.addEventListener('click', () => {
                const serverId = item.dataset.serverId;
                selectServer(serverId);
            });
        });

        const refreshBtn = modal.querySelector('.hjty-refresh-btn');
        const switchBtn = modal.querySelector('.hjty-switch-btn');

        refreshBtn.addEventListener('click', checkAllServers);
        switchBtn.addEventListener('click', () => switchToServer(selectedServerId));


        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });


        checkAllServers();
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            buttonInitialized = checkTitleAndInitButton();
            if (!buttonInitialized) {
                setupTitleObserver();
            }
        });
    } else {
        buttonInitialized = checkTitleAndInitButton();
        if (!buttonInitialized) {
            setupTitleObserver();
        }
    }

    (function () {
        const originOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (/\/api\/topic\/(hot\/topics\?|node\/(topics|news)|idol_list)/.test(url)) {
                const xhr = this;
                const getter = Object.getOwnPropertyDescriptor(
                    XMLHttpRequest.prototype,
                    "response"
                ).get;
                Object.defineProperty(xhr, "responseText", {
                    get: () => {
                        let result = getter.call(xhr);

                        try {
                            let res = JSON.parse(result);
                            if (res['isEncrypted']) {
                                res.data = Utils.encrypt(App.formatTitle(Utils.decrypt(res.data)))
                            } else {
                                res.data = App.formatTitle(res.data)
                            }
                            return JSON.stringify(res);
                        } catch (e) {
                            return result;
                        }
                    },
                });
            } else if (/\/api\/topic\/\d+/.test(url) && /tianya365/.test(url) === false) {
                m3u8_url = '';
            } else if (/\/api\/attachment/.test(url)) {
                const xhr = this;
                const getter = Object.getOwnPropertyDescriptor(
                    XMLHttpRequest.prototype,
                    "response"
                ).get;
                Object.defineProperty(xhr, "responseText", {
                    get: () => {
                        let result = getter.call(xhr);
                        App.getShortVideoUrl(result);
                        return result;
                    }
                });
            } else if (/\/api\/video\/checkVideoCanPlay/.test(url)) {
                const xhr = this;
                const getter = Object.getOwnPropertyDescriptor(
                    XMLHttpRequest.prototype,
                    "response"
                ).get;
                Object.defineProperty(xhr, "responseText", {
                    get: () => {
                        return App.fixShortVideo(getter.call(xhr));
                    },
                });
            } else if (/\/api\/topic\/like/.test(url)) {
                const xhr = this;
                const getter = Object.getOwnPropertyDescriptor(
                    XMLHttpRequest.prototype,
                    "response"
                ).get;
                Object.defineProperty(xhr, "responseText", {
                    get: () => {
                        let result = getter.call(xhr);
                        let res = JSON.parse(result);
                        if (res.errorCode == 1) {
                            res.errorCode = -1;
                        }
                        return JSON.stringify(res);
                    },
                });
            }

            originOpen.apply(this, arguments);
        };
    })();
})();
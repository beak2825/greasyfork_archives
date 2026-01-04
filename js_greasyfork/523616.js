// ==UserScript==
// @name         1024cookie 注入
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  破解二次认证及相关 cookie 处理
// @author       十哥
// @include      /^https?:\/\/c\w\.\w{5,6}\.(xyz|com|org)\/index\.php$/
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/523616/1024cookie%20%E6%B3%A8%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/523616/1024cookie%20%E6%B3%A8%E5%85%A5.meta.js
// ==/UserScript==
(function () {
    // 获取所有 cookies 并整理格式的函数
    function getCookies() {
        const cookies = document.cookie.split('; ');
        return cookies.map(cookie => {
            const [name, value] = cookie.split('=');
            return {
                domain: window.location.hostname,
                expirationDate: (new Date().getTime() + 365 * 24 * 60 * 60 * 1000) / 1000, // 1 year from now
                hostOnly: true,
                httpOnly: false,
                name: name,
                path: '/',
                sameSite: null,
                secure: false,
                session: false,
                storeId: null,
                value: value
            };
        });
    }

    // 创建按钮的函数
    function createButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.position = 'fixed';
        button.style.left = '10px';
        button.style.bottom = `${10 + 40 * document.querySelectorAll('button').length}px`;
        button.style.zIndex = 1000;
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.addEventListener('click', onClick);
        document.body.appendChild(button);
    }

    // 导出 cookies 为 JSON 格式并打印的函数
    function exportCookies() {
        const cookies = getCookies();
        const json = JSON.stringify(cookies, null, 2);
        console.log('Exported cookies:', json);
    }

    // 注入数据到指定 cookie 的函数
    function injectData() {
        const dataToInjectArray = [
            "Vl0EWAIOXwAHAVJTWVINVAddUwtRBAUMAVVbUlRfDwI",
            "9SBwIICAVVAAEEAVQKAgdbVAgAVgQAWl5QAg9UDwcO",
            "cFXwVdU1UABFZaBAYEWwoHUlMFAA0KUgBVVgAG",
            "8DU1cNW1VSVgIDDgQPAAdfU11RA1IIXFJWAQNS",
            "8HVlYLAVYCUVQAWQcOUQZaVVpQBAELC1NUUw9QXgIB",
            "lVVAsAAAAAVVBUDgJZVAYNBlwDA1UIAQMGAQdVXlJe",
            "VcGUAhVU1dQBQIFUAEFXFQAAFxVVVoHU1cDVQJTXAZX",
            "lxXU1cBDQIBAVcFD1QPVlILBAtRUVALWwVbAwFXCgAL",
            "oFBVBdWlBQAFAHCwFZBwcKUw5VVlZdAAUCAAIDDAYN",
            "BVAwZcXwdVUlIHWgQJVlZfBgFVUlFYXwNXAwVXCQUJ",
            "Pg8DBFdcAAIGCANWXAEBU1RdDgtXVgMODVIHVg5QXFQA",
            "Pg4HWVABW1UFAg5RDgZZAwBdBQwEAAYBAQBRU1dRCVRa",
            "agpVUwMPB11SUQlVUVRUAVIDAVYAVVdSAlZQVAZSXAoB",
            "agcBUFYDVV1TBQYHV1QPB1YOBwBUVwpWVFJUXAcABQFS",
            "AGV1YIWF4HAAAHAAZZUAVdAQgDAgsKDwNRAlQFDVNe",
            "JSA1QGVFYDBgVSUlYCUFBQVlUFDVUNVFcBBAJWBwVV",
            "VTWgMCXQUHCQVTDApTUwFTUQYDVgUCUwVTDQUOBlJQ",
            "dXUFNXAwZXUABfBVFRAwEEAlEAVABSClRTBV0LA1VS",
            "9SBFdcVARTUlUEDVZbVw9cBlIBU1cKVFhVUFxfAVsL",
            "0FAAAPWwJTBlJRCVVaAgBaUQgKAAcBC18GVFNWCAgB",
            "UCVgJbBwkDVwZUVlECXwxUUFQHVVALAwlWAlAHUVdW"
        ];
        const randomData = dataToInjectArray[Math.floor(Math.random() * dataToInjectArray.length)];
        const cookies = getCookies();
        const targetCookies = cookies.filter(cookie => cookie.name === "227c9_winduser");
        if (targetCookies.length > 0) {
            // 找到值字节数最少的目标 cookie
            let minLengthCookie = targetCookies.reduce((prev, current) => prev.value.length <= current.value.length? prev : current);
            if (minLengthCookie.value.length <= 65) {
                minLengthCookie.value += randomData;
                document.cookie = `${minLengthCookie.name}=${minLengthCookie.value}; domain=${minLengthCookie.domain}; path=${minLengthCookie.path}`;
                document.cookie = `${minLengthCookie.name}=${minLengthCookie.value}; domain=${minLengthCookie.domain}; path=${minLengthCookie.path}`;
                console.log('Injected data and updated cookie:', minLengthCookie.value);
            } else {
                console.log('Data already present in cookie, no injection needed.');
            }
        } else {
            console.error('Target cookie not found');
        }
    }

    // 复制 cookies 为 JSON 格式到剪贴板的函数
    function copyCookies() {
        const cookies = getCookies().filter(cookie => cookie.name!== "227c9_winduser" || cookie.value.length > 65);
        const json = JSON.stringify(cookies, null, 2);
        navigator.clipboard.writeText(json).then(() => {
            console.log('Cookies copied to clipboard');
        }).catch(err => {
            console.error('Could not copy cookies:', err);
        });
    }

    // 用于删除指定 cookie 的函数
    function deleteCookie(cookieName) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    }

    // 检测 UA 变化的函数
    function detectUAChange() {
        let originalUA = navigator.userAgent;
        setInterval(() => {
            if (navigator.userAgent!== originalUA) {
                const cookies = getCookies();
                cookies.forEach(cookie => {
                    deleteCookie(cookie.name);
                });
                originalUA = navigator.userAgent;
            }
        }, 1000);
    }

    // 监听页面卸载事件（模拟账号退出等情况）来删除 cookie
    window.addEventListener('beforeunload', () => {
        const cookies = getCookies();
        cookies.forEach(cookie => {
            deleteCookie(cookie.name);
        });
    });

    detectUAChange();
   // createButton('读取', exportCookies);
    createButton('注入', injectData);
    createButton('复制', copyCookies);
})();
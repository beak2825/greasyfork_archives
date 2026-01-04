// ==UserScript==
// @name         get_cookie
// @namespace    get cookies
// @author       howe
// @license MIT
// @version      1.0
// @description  cmos_cookie
// @match        https://mail.cmos.chinamobile.com/webmail/*
// @grant        GM_cookie
// @grant        GM_setClipboard
// @require      https://fastly.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/485939/get_cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/485939/get_cookie.meta.js
// ==/UserScript==

(function() {

    function showCookie() {
        // 使用GM_cookie函数获取Cookie
        GM_cookie.list({}, function (cookieInfos, error) {
            if (!error) {
                cookieInfos.forEach(function(cookie) {
                    cookie.expirationDate = Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 30);

                    GM_cookie.delete({ name: cookie.name }, function(error) {
                        if (error) {
                            console.error(`Cookie ${cookie.name} delete failed! ${error}`);
                        } else {
                            GM_cookie.set(cookie, function(error) {
                                if (error) {
                                    console.error(`Cookie ${cookie.name} set failed! ${error}`);
                                } else {
                                    console.info(`Cookie ${cookie.name} set ok!`);
                                }
                            });
                        }
                    });
                });
            } else {
                alert("获取cookie失败，请检查是否支持GM_cookie函数（目前只有beta版支持）")
            }
        });
    }

    var alreadyInitedCopyCookieButton = false;
    function initCopyCookieButton() {
        if (!alreadyInitedCopyCookieButton) {
            let btnGroupDiv = document.querySelector('#divToolbar_sys0 > ul');
            if (btnGroupDiv) {
                console.log(btnGroupDiv)

                // 创建复制 Cookie 按钮
                let newLi = document.createElement('li');

                let copyButton = document.createElement('a');
                copyButton.href = 'javascript:;';
                copyButton.className = 'n_btn mr_5';
                copyButton.innerHTML = '<span>获取Cookie</span>';

                // 点击显示Cookie
                copyButton.addEventListener('click', showCookie);

                newLi.appendChild(copyButton);

                btnGroupDiv.appendChild(newLi);

                alreadyInitedCopyCookieButton = true;
            }
        }
    }

    setTimeout(function () {
        initCopyCookieButton();
    }, 2000)

})();
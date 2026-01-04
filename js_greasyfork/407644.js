// ==UserScript==
// @name         网易邮箱去除广告
// @namespace    126 Mail AdRemover
// @version      2022.11.22.1
// @description  126、163和yeah邮箱去除顶部"应用中心"、"网易严选"和"半个电台"，去除登陆页与首页广告
// @author       PY-DNG
// @license      WTFPL http://www.wtfpl.net/about/
// @icon         https://mail.126.com/favicon.ico
// @match        http*://mail.126.com/js6/main.jsp*
// @match        http*://mail.163.com/js6/main.jsp*
// @match        http*://mail.yeah.net/js6/main.jsp*
// @match        http*://www.yeah.net/js6/main.jsp*
// @match        http*://mail.126.com/
// @match        http*://mail.163.com/
// @match        http*://mail.yeah.net/
// @match        http*://www.yeah.net/
// @match        http*://mail.126.com/index.htm*
// @match        http*://mail.163.com/index.htm*
// @match        http*://mail.yeah.net/index.htm*
// @match        http*://www.yeah.net/index.htm*
// @match        http*://mail.126.com/?*
// @match        http*://mail.163.com/?*
// @match        http*://mail.yeah.net/?*
// @match        http*://www.yeah.net/?*
// @match        http*://mail.126.com/#*
// @match        http*://mail.163.com/#*
// @match        http*://mail.yeah.net/#*
// @match        http*://www.yeah.net/#*
// @match        http*://hw.mail.126.com/js6/main.jsp*
// @match        http*://hw.mail.163.com/js6/main.jsp*
// @match        http*://hw.mail.yeah.net/js6/main.jsp*
// @match        http*://hw.www.yeah.net/js6/main.jsp*
// @match        http*://hw.mail.126.com/
// @match        http*://hw.mail.163.com/
// @match        http*://hw.mail.yeah.net/
// @match        http*://hw.www.yeah.net/
// @match        http*://hw.mail.126.com/index.htm*
// @match        http*://hw.mail.163.com/index.htm*
// @match        http*://hw.mail.yeah.net/index.htm*
// @match        http*://hw.www.yeah.net/index.htm*
// @match        http*://hw.mail.126.com/?*
// @match        http*://hw.mail.163.com/?*
// @match        http*://hw.mail.yeah.net/?*
// @match        http*://hw.www.yeah.net/?*
// @match        http*://hw.mail.126.com/#*
// @match        http*://hw.mail.163.com/#*
// @match        http*://hw.mail.yeah.net/#*
// @match        http*://hw.www.yeah.net/#*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407644/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/407644/%E7%BD%91%E6%98%93%E9%82%AE%E7%AE%B1%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
	// ==== ==== ==== 想要去除的标签页，直接写在这里就好 ==== ==== ====
	const AD_TABS = ['应用中心', '网易严选', '半个电台', '企业邮箱', '跨境收款'];
	// 后面的就不用改了

    const NUMBER_STOP_FINDING_AFTER = 40;
    const NUMBER_LOG_WARNING_AFTER = 14;
    const NUMBER_TIMEOUT_RETRY_AFTER = 500;

    const TEXT_TITLE_WINDOW_LOGIN = '{NAME} 邮箱登录';

    /** DoLog相关函数改自 Ocrosoft 的 Pixiv Previewer
     *  [GitHub]     Ocrosoft: https://github.com/Ocrosoft/
     *  [GreasyFork] Ocrosoft: https://greasyfork.org/zh-CN/users/63073
     *  [GreasyFork] Pixiv Previewer: https://greasyfork.org/zh-CN/scripts/30766
     *  [GitHub]     Pixiv Previewer: https://github.com/Ocrosoft/PixivPreviewer
     **/
    let LogLevel = {
        None: 0,
        Error: 1,
        Success: 2,
        Warning: 3,
        Info: 4,
        Elements: 5,
    };
    let g_logCount = 0;
    let g_logLevel = LogLevel.Warning;

    function DoLog(level, msgOrElement) {
        if (level <= g_logLevel) {
            let prefix = '%c';
            let param = '';

            if (level == LogLevel.Error) {
                prefix += '[Error]';
                param = 'color:#ff0000';
            } else if (level == LogLevel.Success) {
                prefix += '[Success]';
                param = 'color:#00aa00';
            } else if (level == LogLevel.Warning) {
                prefix += '[Warning]';
                param = 'color:#ffa500';
            } else if (level == LogLevel.Info) {
                prefix += '[Info]';
                param = 'color:#888888';
            } else if (level == LogLevel.Elements) {
                prefix += 'Elements';
                param = 'color:#000000';
            }

            if (level != LogLevel.Elements) {
                console.log(prefix + msgOrElement, param);
            } else {
                console.log(msgOrElement);
            }

            if (++g_logCount > 512) {
                console.clear();
                g_logCount = 0;
            }
        }
    }

    // 去除登陆页面广告
    const loginPageMatch = location.href.match(/https?:\/\/(hw\.)?(mail|www)\.(126|163|yeah)\.(com|net)\/(index.htm)?(\?.*)?(#.*)?/);
    if (loginPageMatch && loginPageMatch[0] === location.href) {
        const domin = loginPageMatch[2];
        document.title = TEXT_TITLE_WINDOW_LOGIN.replaceAll('{NAME}', domin);
        DoLog(LogLevel.Info, 'This is ' + domin + ' login page. ');

        // 去除广告图、广告标识和链接
        createEleRemoveFunction('#theme', 'adsMain', false)();
        // 去除广告翻页键
        createEleRemoveFunction('.themeCtrl', 'themeCtrl', true)();
        // 去除登陆窗口底部客户端链接
        //createEleRemoveFunction('#loginBlock>.mailApp', 'mailApp', false)();

        // 登陆板块居中显示
		addStyle('html {overflow: hidden;}.main-login-wrap {z-index: 1;}#footer {z-index: 2;}.main-login-wrap {position: fixed;display:flex;align-items: center;justify-content: center;padding: 0;width: 100vw;height: 100vh;background-color: #CCCCCC;}#loginBlock {position: relative;background-color: #FFFFFF;padding: 20px;box-shadow: 5px 5px 5px #888888;border-radius: 4px;}.main-inner-wrap,.main-login-wrap,#loginBlock {border: 0;margin: 0;top: 0;right: 0;left: 0;bottom: 0;}');
        return;
    }

    DoLog(LogLevel.Info, 'This is mail page. ');

    // 去广函数
    let removeAds = function () {
        DoLog(LogLevel.Info, 'Searching for ads...');
        let advertisement = document.getElementsByClassName('js-component-tab gWel-recommend-title nui-tabs nui-tabs-common  ')[0]
        if (advertisement) {
            DoLog(LogLevel.Success, 'Ads found. Remove it. ');
            advertisement.parentElement.parentElement.remove();
            return true;
        } else {
            DoLog(LogLevel.Info, 'No ads here. ');
            return false;
        }
    }

    // 去除顶部"应用中心"、"网易严选"和"半个电台"，挂接首页自动去广函数
    let p = document.querySelector('.js-component-tab[role="tablist"]'); //p - parentNote
    if (p) {
        let cs = p.children; //cs- childs:)
        let i, j = 0,
            note, targetNotes = new Array();
        for (i = 0; i < cs.length; i++) {
            if (AD_TABS.includes(cs[i].title)) {
                targetNotes[j] = cs[i];
                j += 1;
            }
        }
        targetNotes.forEach(function (item, index, array) {
            p.removeChild(item);
        })
    }

    // 尝试现在就去除首页广告区域（如果在首页并且广告已经加载）
    removeAds();

    // 循环执行去广函数
    setInterval(removeAds, '1000');

    function createEleRemoveFunction(cssSelector, EleName='Unamed_Element', ignorable=false) {
            return (function func() {
                if (func.FindCount === undefined) {func.FindCount = 0;};
                if (func.Removed === undefined) {func.Removed = false;};

                // 广告标识及广告链接
                if (!func.Removed) {
                    const Element = document.querySelector(cssSelector);
                    if (!Element) {
                        func.FindCount++;
                        if (func.FindCount >= NUMBER_STOP_FINDING_AFTER) {
                            const level = ignorable ? LogLevel.Success : LogLevel.Error;
                            const text = ignorable ?
                                  'No ' + EleName + ' found here. ' :
                                  'Cannot find ' + EleName + '. Stop finding now. Tried for ' + String(func.FindCount) + 'times. ';
                            DoLog(level, text);
                            func.Removed = true;
                        } else {
                            const level = func.FindCount >= NUMBER_LOG_WARNING_AFTER && !ignorable ? LogLevel.Warning : LogLevel.Info;
                            const text = EleName + ' not loaded, keep waiting... Tried for ' + String(func.FindCount) + 'times. '
                            DoLog(level, text);
                            setTimeout(func, NUMBER_TIMEOUT_RETRY_AFTER);
                        }
                    } else {
                        DoLog(LogLevel.Success, EleName + ' found, remove it.');
                        Element.parentElement.removeChild(Element);
                        func.Removed = true;
                    }
                }
            })
        }

	// Append a style text to document(<head>) with a <style> element
    function addStyle(css, id) {
		const style = document.createElement("style");
		id && (style.id = id);
		style.textContent = css;
		for (const elm of document.querySelectorAll('#'+id)) {
			elm.parentElement && elm.parentElement.removeChild(elm);
		}
        document.head.appendChild(style);
    }
})()
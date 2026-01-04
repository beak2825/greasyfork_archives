// ==UserScript==
// @name        checkJQuery 
// @namespace   http://www.ocrosoft.com/
// @version     0.100
// @description Check jQuery.
// @author      ocrosoft
// @grant       unsafeWindow
// ==/UserScript==

// jQuery
var checkJQuery = function() {
    let jqueryCdns = [
        'http://code.jquery.com/jquery-2.1.4.min.js',
        'http://libs.baidu.com/jquery/2.1.4/jquery.min.js',
        'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js',
        // 可能抽风，多试几次
        'http://code.jquery.com/jquery-2.1.4.min.js',
        'http://libs.baidu.com/jquery/2.1.4/jquery.min.js',
        'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.4.min.js',
    ];
    function isJQueryValid() {
        try {
            let wd = unsafeWindow;
            if (wd.jQuery && !wd.$) {
                wd.$ = wd.jQuery;
            }
            $();
            return true;
        } catch (exception) {
            return false;
        }
    }
    function insertJQuery(url) {
        let script = document.createElement('script');
        script.src = url;
        document.head.appendChild(script);
        return script;
    }
    function converProtocolIfNeeded(url) {
        let isHttps = location.href.indexOf('https://') != -1;
        let urlIsHttps = url.indexOf('https://') != -1;

        if (isHttps && !urlIsHttps) {
            return url.replace('http://', 'https://');
        } else if (!isHttps && urlIsHttps) {
            return url.replace('https://', 'http://');
        }
        return url;
    }
    function waitAndCheckJQuery(cdnIndex, resolve) {
        if (cdnIndex >= jqueryCdns.length) {
            iLog.e('无法加载 JQuery，正在退出。');
            resolve(false);
            return;
        }
        let url = converProtocolIfNeeded(jqueryCdns[cdnIndex]);
        iLog.i('尝试第 ' + (cdnIndex + 1) + ' 个 JQuery CDN：' + url + '。');
        let script = insertJQuery(url);
        setTimeout(function() {
            if (isJQueryValid()) {
                iLog.i('已加载 JQuery。');
                resolve(true);
            } else {
                iLog.w('无法访问。');
                script.remove();
                waitAndCheckJQuery(cdnIndex + 1, resolve);
            }
        }, 100);
    }
    return new Promise(function(resolve) {
        if (isJQueryValid()) {
            iLog.i('已加载 jQuery。');
            resolve(true);
        } else {
            iLog.i('未发现 JQuery，尝试加载。');
            waitAndCheckJQuery(0, resolve);
        }
    });
}
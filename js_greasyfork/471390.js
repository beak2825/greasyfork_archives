// ==UserScript==
// @name         仿via资源嗅探
// @namespace    https://palhube666.wodemo.com/
// @version      0.2
// @description  仿via资源嗅探js版本
// @author       呆毛飘啊飘
// @run-at       document-start
// @match        *
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/471390/%E4%BB%BFvia%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/471390/%E4%BB%BFvia%E8%B5%84%E6%BA%90%E5%97%85%E6%8E%A2.meta.js
// ==/UserScript==

(function() {
    GM_registerMenuCommand("资源嗅探①", function() {
        getUrlA()
    });

    GM_registerMenuCommand("资源嗅探②", function() {
        getUrlB()
    });

    function getUrlB() {
        var tj = 'f';
        var entries = window.performance.getEntriesByType('resource');
        var z = '';
        entries.forEach(entry => {
            if (entry.initiatorType == 'video' || entry.entryType == 'video' || entry.initiatorType == 'audio' || entry.entryType == 'audio') {
                var sp = "<div class='box'><a href='链接' title='链接'></a><p class='title'>呆毛飘啊飘<font class='tag'>load</font>后缀<p class='url'>链接</p></div>";
                var url = entry.name;
                if (url) {
                    var hz = url.substring(url.lastIndexOf('.'), url.length);
                    var hzz = hz.substring(0, hz.indexOf('?'));
                    if (!hz) {
                        var sp = sp.replace(/链接/g, url)
                            .replace('后缀', '');
                    } else if (!hzz) {
                        var sp = sp.replace(/链接/g, url)
                            .replace('后缀', '<font class="res tag">后缀</font></p>')
                            .replace('后缀', hz);
                    } else {
                        var sp = sp.replace(/链接/g, url)
                            .replace('后缀', '<font class="res tag">后缀</font></p>')
                            .replace('后缀', hzz);
                    }
                    z = z + sp;
                };
                tj = 't';
            }
        });
        if (tj == 'f') {
            if (!via.toast) {
                alert('这个页面没有资源。\n注：音乐或视频在播放时更容易被获取。资源嗅探不支持部分网站。');
            } else {
                via.toast('这个页面没有资源。\n注：音乐或视频在播放时更容易被获取。资源嗅探不支持部分网站。');
            }
        } else {
            var qm = "<!doctype html><html><head><meta content='text/html; charset=utf-8' http-equiv='Content-Type'><meta name='color-scheme' content='light dark'><meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no, minimal-ui'><title>资源嗅探</title><style>* {padding:0;margin:0;box-sizing:border-box;}html{height:100%;-webkit-tap-highlight-color:rgba(0, 0, 0, 0.1);-webkit-focus-ring-color: rgba(0, 0, 0, 0); /*-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;*/}body{min-height:100%;max-width:100%; width: 600px;margin: auto;text-align: center;}body{background: transparent;}.box {margin: 12px 0; text-align: left; vertical-align:middle;position:relative;display: block;padding-top:10px; padding-bottom:10px; padding-left:10px; padding-right:10px;}.box a {width: 100%;height: 100%;position: absolute;left: 0;top: 0;}span, .url, .box {word-break: break-all;}.block{opacity:0.5;}.tag{background:#cd8282;padding:0 8px;margin:0 4px;color:white;font-size:12px;}.res{background:#5c91cb;}.title {color: #2b2b2b;font-size: 15px; padding: 4px 0px;}.url {line-height: 1.2em; max-height: 4.8em;font-size: 15px;color: #1b1b1b; white-space: normal; word-wrap: break-word; overflow: auto;text-overflow: ellipsis;-o-text-overflow: ellipsis;-ms-text-overflow: ellipsis;}.hint {line-height: 1.8em; color: #2b2b2b;font-size: 15px; white-space: normal; word-wrap: break-word; overflow: auto;text-overflow: ellipsis;-o-text-overflow: ellipsis;-ms-text-overflow: ellipsis; padding: 50px 5px; text-align: center; margin: auto;}#filter-box{padding:10px}#filter{border: 1px solid rgba(0, 0, 0, 0.1);border-radius:2px;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:transparent;padding:5px;width:100%;font-size: 15px;color: #1b1b1b;}</style></head><body><div class='frosted-glass' id='gesture-indicator'></div><div id='content'><div class='hint'>下列是网页加载中的资源日志。<br>使用getEntriesByType方法获取。</div>";
            var hm = "<script type='text/javascript'>function getDomain(a){var b=a.split('/'),c='';return a.indexOf('://')>-0&&b.length>2&&''!=b[2]&&(c=b[2]),c}function boldDomain(){var b,c,d,a=document.getElementsByClassName('url');for(d=a.length-1;d>=0;d--)b=a[d].innerHTML,c=getDomain(b),''!=c&&(a[d].innerHTML=b.replace(c,'<b>'+c+'</b>'))}boldDomain();</script></div></body></html>";
            var htmll = qm + z + hm;
            document.body.innerHTML = htmll;
        }
    };

    function getUrlA() {
        var videos = document.querySelectorAll('video,source');
        if (videos.length == 0) {
            if (!via.toast) {
                alert('这个页面没有资源。\n注：音乐或视频在播放时更容易被获取。资源嗅探不支持部分网站。');
            } else {
                via.toast('这个页面没有资源。\n注：音乐或视频在播放时更容易被获取。资源嗅探不支持部分网站。');
            }
        } else {
            var z = '';
            for (let i = 0; i < videos.length; i++) {
                var sp = "<div class='box'><a href='链接' title='链接'></a><p class='title'>呆毛飘啊飘<font class='tag'>load</font>后缀<p class='url'>链接</p></div>";
                var video = videos[i];
                var url = video.src;
                if (url) {
                    var hz = url.substring(url.lastIndexOf('.'), url.length);
                    var hzz = hz.substring(0, hz.indexOf('?'));
                    if (!hz) {
                        var sp = sp.replace(/链接/g, url)
                            .replace('后缀', '');
                    } else if (!hzz) {
                        var sp = sp.replace(/链接/g, url)
                            .replace('后缀', '<font class="res tag">后缀</font></p>')
                            .replace('后缀', hz);
                    } else {
                        var sp = sp.replace(/链接/g, url)
                            .replace('后缀', '<font class="res tag">后缀</font></p>')
                            .replace('后缀', hzz);
                    }
                    var z = z + sp;
                };
            };

            var qm = "<!doctype html><html><head><meta content='text/html; charset=utf-8' http-equiv='Content-Type'><meta name='color-scheme' content='light dark'><meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no, minimal-ui'><title>资源嗅探</title><style>* {padding:0;margin:0;box-sizing:border-box;}html{height:100%;-webkit-tap-highlight-color:rgba(0, 0, 0, 0.1);-webkit-focus-ring-color: rgba(0, 0, 0, 0); /*-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;*/}body{min-height:100%;max-width:100%; width: 600px;margin: auto;text-align: center;}body{background: transparent;}.box {margin: 12px 0; text-align: left; vertical-align:middle;position:relative;display: block;padding-top:10px; padding-bottom:10px; padding-left:10px; padding-right:10px;}.box a {width: 100%;height: 100%;position: absolute;left: 0;top: 0;}span, .url, .box {word-break: break-all;}.block{opacity:0.5;}.tag{background:#cd8282;padding:0 8px;margin:0 4px;color:white;font-size:12px;}.res{background:#5c91cb;}.title {color: #2b2b2b;font-size: 15px; padding: 4px 0px;}.url {line-height: 1.2em; max-height: 4.8em;font-size: 15px;color: #1b1b1b; white-space: normal; word-wrap: break-word; overflow: auto;text-overflow: ellipsis;-o-text-overflow: ellipsis;-ms-text-overflow: ellipsis;}.hint {line-height: 1.8em; color: #2b2b2b;font-size: 15px; white-space: normal; word-wrap: break-word; overflow: auto;text-overflow: ellipsis;-o-text-overflow: ellipsis;-ms-text-overflow: ellipsis; padding: 50px 5px; text-align: center; margin: auto;}#filter-box{padding:10px}#filter{border: 1px solid rgba(0, 0, 0, 0.1);border-radius:2px;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:transparent;padding:5px;width:100%;font-size: 15px;color: #1b1b1b;}</style></head><body><div class='frosted-glass' id='gesture-indicator'></div><div id='content'><div class='hint'>下列是网页加载中的资源日志。<br>使用querySelectorAll方法获取。</div>";
            var hm = "<script type='text/javascript'>function getDomain(a){var b=a.split('/'),c='';return a.indexOf('://')>-0&&b.length>2&&''!=b[2]&&(c=b[2]),c}function boldDomain(){var b,c,d,a=document.getElementsByClassName('url');for(d=a.length-1;d>=0;d--)b=a[d].innerHTML,c=getDomain(b),''!=c&&(a[d].innerHTML=b.replace(c,'<b>'+c+'</b>'))}boldDomain();</script></div></body></html>";
            var htmll = qm + z + hm;
            if (z != '') {
                document.body.innerHTML = htmll;
            } else {
                if (!via.toast) {
                    alert('这个页面没有资源。\n注：音乐或视频在播放时更容易被获取。资源嗅探不支持部分网站。');
                } else {
                    via.toast('这个页面没有资源。\n注：音乐或视频在播放时更容易被获取。资源嗅探不支持部分网站。');
                }
            }
        }
    }
})();
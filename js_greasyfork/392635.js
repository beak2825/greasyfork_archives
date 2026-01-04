// ==UserScript==
// @name         公众号文章收集
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  try to take over the world!
// @author       mumumi
// @match        *://mp.weixin.qq.com/s*
// @match        *://mp.weixin.qq.com/mp/appmsgalbum*
// @match        *://mp.weixin.qq.com/mp/homepage*
// @match        http://192.168.2.134/crawler/gzh/*/index.html
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      test.cityfun.com.cn
// @downloadURL https://update.greasyfork.org/scripts/392635/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E6%94%B6%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/392635/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E6%94%B6%E9%9B%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.host == '192.168.2.134') {
       var tables = document.getElementsByTagName('table');
       if (tables.length > 0) {
           var el = document.createElement('button');
           el.style.position = 'sticky';
           el.style.bottom = '0';
           el.innerText = '归档公众号';
           var gzhName = window.location.pathname.split('/')[3];
           el.addEventListener('click', () => {
               if (confirm('提交后公众号将被归档，所有人将无法查看')) {
                   fetch('../../../wxser/gzh/flt?name=' + gzhName, { method: 'GET' })
                       .then(response => {
                           if (response.ok) {
                               return response.text();
                           }
                           throw new Error('Network response was not ok.');
                       })
                       .then(data => {
                           console.log('归档成功:', data);
                           alert('归档操作成功！\n准备返回列表');
                           window.location = '..';
                       })
                       .catch(error => {
                           console.error('归档失败:', error);
                           alert('归档操作失败，请重试！');
                       });
               }
           });
           var lastTable = tables[tables.length - 1];
           lastTable.parentNode.insertBefore(el, lastTable.nextSibling);
        }
        return
    }
    var albums = [];
    var baseUrl = "https://test.cityfun.com.cn/wxser/gzh"
    var ntvScroll = 100;
    var ntvRedirect = 100;
    var ntvLoad = 1000;
    var jump = () => {
        var idx = albums.indexOf(window.location.href.split('#')[0]);
        if (idx++ >= 0 && idx < albums.length) {
            setTimeout(() => window.location.href = albums[idx++] + '#' + idx + '/' + albums.length, ntvRedirect);
        }
    };
    var push = (links, label = 'Articles') => {
        if (albums.indexOf(window.location.href.split('#')[0]) >= 0 && label == 'href') {
            return;
        }
        if (links.length > 0) {
            GM_xmlhttpRequest({
                method: 'POST',
                url: baseUrl,
                data: "url=" + encodeURIComponent(links.join('\n')),
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                onload: function (response) {
                    console.log(label + ':\n' + response.responseText);
                    jump();
                }
            })
        } else {
            jump();
        }
    };

    // Your code here...
    var ntv = unsafeWindow.setInterval(function() {
        var c = true;
        c = confirm("是否提交网页？");
        if (c) {
            push([window.location.href], 'href')
            if (window.location.pathname == "/mp/appmsgalbum") {
                if (document.querySelector('.album__list_empty')) {
                    jump();
                } else {
                    var ntv1 = unsafeWindow.setInterval(function() {
                        unsafeWindow.scrollTo({top: document.documentElement.scrollHeight});
                        if (document.querySelector('.js_loading_more2').style.display == 'none' && document.querySelector('.js_no_more_album').style.display != 'none') {
                            unsafeWindow.scrollTo({top: 0});
                            var elements = document.querySelectorAll('#js_content_overlay > div.js_album_container > div > div.js_album_bd > ul > li');
                            push(Array.from(elements).map(el => el.getAttribute('data-link')));
                            unsafeWindow.clearInterval(ntv1);
                        }
                    }, ntvScroll);
                }
            } else if (window.location.pathname == "/mp/homepage") {
                if (document.querySelectorAll('#appmsgList > a').length == 0) {
                    jump();
                } else {
                    var count = 0;
                    var equalTime = 0;
                    ntv1 = unsafeWindow.setInterval(function() {
                        unsafeWindow.scrollTo({top: document.documentElement.scrollHeight});
                        var elements = document.querySelectorAll('#appmsgList > a');
                        if (count == elements.length) {
                            if (equalTime++ > 10) {
                                unsafeWindow.scrollTo({top: 0});
                                push(Array.from(elements).map(e => e.href));
                                unsafeWindow.clearInterval(ntv1);
                            }
                        } else {
                            equalTime = 0;
                            count = elements.length;
                        }
                    }, ntvScroll);
                }
            } else {
                var elements = document.querySelectorAll('div[data-url^="https://mp.weixin.qq.com/mp/appmsgalbum"]');
                push(Array.from(elements).map(e => e.getAttribute('data-url')), 'Albums');
            }
        } else {
            console.log("用户取消提交网址");
        }
        unsafeWindow.clearInterval(ntv);
    }, ntvLoad);
})();
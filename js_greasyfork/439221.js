// ==UserScript==
// @name         QQ空间相册下载神器
// @name:zh      [雪星实验室] QQ空间相册下载神器
// @namespace    https://userscript.snomiao.com/
// @version      0.4.0
// @description  批量下载小姐姐空间高清大图照片佳选插件～自动命名快速汲取dalao灵感～（bug反馈联系 snomiao@gmail.com ）  注：使用 chrome 的用户也可以考虑 QQ空间导出助手 插件
// @author       snomiao@gmail.com
// @match        *://user.qzone.qq.com/*
// @match        *://*.photo.store.qq.com/*
// @match        *://*.qpic.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439221/QQ%E7%A9%BA%E9%97%B4%E7%9B%B8%E5%86%8C%E4%B8%8B%E8%BD%BD%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/439221/QQ%E7%A9%BA%E9%97%B4%E7%9B%B8%E5%86%8C%E4%B8%8B%E8%BD%BD%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==
//
// 注：使用 chrome 用户也可以考虑 QQ空间导出助手
// https://chrome.google.com/webstore/detail/qq%E7%A9%BA%E9%97%B4%E5%AF%BC%E5%87%BA%E5%8A%A9%E6%89%8B/aofadimegphfgllgjblddapiaojbglhf
//
// 更新：(20210228) 0.4.0 修复史前照片下载
// 更新：(20200518) 0.3.0 还是弹吧……（因为 IFRAME 没法监控状态可能会漏照片、用 xhr 和 fetch 会有跨域问题）
// 更新：(20200501) 0.2.0 改进下载逻辑，不再弹出窗口
//
(() => {
    var 下载 = (url, filename = '') => {
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    };
    var 响应被下载 = () => {
        var m = decodeURI(location.hash).match(/(?<=#下载-).*/);
        if (!m) return null;
        var filename = m[0];
        下载(location.href, filename);
        (opener || parent).postMessage(
            '下载完成-' + location.href,
            'https://user.qzone.qq.com'
        );
        window.close();
    };
    var 智能下载 = (url, filename = '') => {
        var 当页域名 = location.hostname;
        var 同源 = !!url.match(':/' + 当页域名 + '/');
        if (同源) return 下载(url, filename);
        if ('打开新页面') {
            // 或打开新页面
            var src = url + '#下载-' + encodeURI(filename);
            window.open(src, '_BLANK');
            return;
        }
        if ('使用IFRAME下载') {
            // 否则使用 iframe // iframe会漏照片……闲了再调试好了。。
            window.addEventListener(
                'message',
                (e) => {
                    var m = e.data && e.data.match(/(?<=下载完成-)(.*)/);
                    if (!m) return;
                    let url = m[0];
                    // console.debug("删除iframe",e.origin, url);
                    // e.origin ignore
                    [...document.querySelectorAll('iframe')]
                        .filter((e) => e.src == url)
                        .forEach((e) => {
                            // console.debug("删除了iframe",e.src, e);
                            e.remove();
                        });
                },
                false
            );
            document.body.appendChild(
                新元素('<iframe style="visibility: hidden"></iframe>', {
                    src: url + '#下载-' + encodeURI(filename),
                })
            );
        }
    };
    /* 一些常见源地址类型
    photogz.photo.store.qq.com
    http://b${数字}.photo.store.qq.com/psu // 比较早期的
    */
    var 高清地址を取 = (src) => {
        if (src.match(/\/\/b\d+\.photo\.store\.qq\.com\//)) {
            return src
                .replace('http:', 'https:')
                .replace(/\/\/.*?\//, '//r.photo.store.qq.com/')
                .replace(/null&.*$/, '')
                .replace(/\/(?:m|b)(\/|$)/, '/b$1') //高清（一些早期照片没有原图）
                .replace(/&(?:w|h)=\d+/, '');
        } else {
            return src
                .replace('http:', 'https:')
                .replace(/\/\/.*?\//, '//r.photo.store.qq.com/')
                .replace(/null&.*$/, '')
                .replace(/\/(?:m|b)(\/|$)/, '/r$1') //原图
                .replace(/&(?:w|h)=\d+/, '');
        }
    };

    var 试取内容 = (e) => e?.textContent?.trim() || '';
    var 照片列を取 = () => {
        var 相册名 = 试取内容(document.querySelector('.j-pl-albuminfo-title'));
        return [...document.querySelectorAll('.j-pl-photoitem,.j-box-img')].map(
            (e, i) => ({
                src: e.querySelector('.j-pl-photoitem-img,.j-img').src,
                url: 高清地址を取(
                    e.querySelector('.j-pl-photoitem-img,.j-img').src
                ),
                filename:
                    (
                        相册名 +
                        '-' +
                        // (1 + i) + '-' +
                        试取内容(
                            e.querySelector('.j-pl-photoitem-title,span[title]')
                        ) +
                        '-' +
                        试取内容(
                            e.querySelector('.j-pl-photoitem-desc,j-photo-desc')
                        )
                    )
                        .replace(/\/|\?|\*|\:|\||\\|\<|\>|\r|\n/, '_')
                        .substr(0, 50) + '.jpg',
            })
        );
    };
    var 下载当页 = (globalThis.下载当页 = () => {
        const 试取列 = 照片列を取();
        const 列有效 = 试取列.every(({ src }) => src);
        if (列有效)
            return 照片列を取().forEach(({ url, filename }) =>
                智能下载(url, filename)
            );
        // 自动滚动重试
        window.parent.scrollBy(0, window.innerHeight);
        window.scrollBy(0, window.innerHeight);
        setTimeout(下载当页, 200);
    });
    // UI
    var 新元素 = (innerHTML, attributes = {}) => {
        var e = document.createElement('div');
        e.innerHTML = innerHTML;
        return Object.assign(e.children[0], attributes);
    };
    var 生成下载界面 = () => {
        // “更多”按钮前插入一个按钮
        var 下载按钮 = 新元素('<div></div>', {
            className: 'photo-op-item photos-download',
            innerHTML:
                '<a class="c-tx2 bg3 bor gb-btn-nor" href="javascript:globalThis.下载当页()">下载当页</a>',
            title: '请滚动到底以确保当前页面所有照片都已加载',
            //onclick: 下载当页,
        });
        [
            ...document.querySelectorAll('.photo-op-item.photos-download'),
        ].forEach((e) => e.remove());
        var 更多按钮 = document.querySelector('.photo-op-item.j-pl-moreop');
        更多按钮 && 更多按钮.parentNode.insertBefore(下载按钮, 更多按钮);
    };

    // 被下载
    if (
        location.host.match(/.*\.photo\.store\.qq\.com/) ||
        location.host.match(/.*\.qpic\.cn/)
    )
        响应被下载();

    // 相册页面
    if (location.hostname == 'user.qzone.qq.com')
        window.addEventListener('load', 生成下载界面, false), 生成下载界面();
})();

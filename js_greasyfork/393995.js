// ==UserScript==
// @name         Bilibili 干净链接
// @namespace    Motoori Kashin
// @version      2.1.5
// @description  去除bilibili链接中不需要的参数，如spm_id_from/from_sourse/from/等，还地址栏以清白干净
// @author       Motoori Kashin
// @match        *://*.bilibili.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/393995/Bilibili%20%E5%B9%B2%E5%87%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/393995/Bilibili%20%E5%B9%B2%E5%87%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {

    function isURL(url,base) {
        try {
            if (typeof url === "string" && /^[\W\w]+\.[\W\w]+/.test(url) && !/^[a-z]+:/.test(url)) {
                // 处理省略协议头情况
                const str = url.startsWith("//") ? "" : "//";
                url = location.protocol + str + url;
            }
            return new URL(url, base);
        } catch (e) {
            return false;
        }
    }
    /** 垃圾参数 */
    const paramsSet = new Set([
        'spm_id_from',
        'from_source',
        'msource',
        'bsource',
        'seid',
        'source',
        'session_id',
        'visit_id',
        'sourceFrom',
        'from_spmid',
        'share_source',
        'share_medium',
        'share_plat',
        'share_session_id',
        'share_tag',
        'unique_k',
        "csource",
        "vd_source",
        "tab",
        "is_story_h5",
        "share_from",
        "plat_id",
        "-Arouter",
        "spmid",
    ]);
    /** 节点监听暂存 */
    const nodelist = [];
    /**
     * 清理url
     * @param str 原url
     * @returns 新url
     */
    function clean(str) {
        if(/.*:\/\/.*.bilibili.com\/.*/.test(str) && !str.includes('passport.bilibili.com')){
            const url = isURL(str);
            if(url){
                paramsSet.forEach(d => {
                    url.searchParams.delete(d);
                });
                return url.toJSON();
            }
        }
        return str;
    }
    /** 地址备份 */
    let locationBackup;
    /** 处理地址栏 */
    function cleanLocation() {
        const { href } = location;
        if (href === locationBackup) return;
        replaceUrl(locationBackup = clean(href));
    }
    /** 处理href属性 */
    function anchor(list) {
        list.forEach(d => {
            if (!d.href) return;
            d.href.includes("bilibili.tv") && (d.href = d.href.replace("bilibili.tv", "bilibili.com")); // tv域名失效
            d.href = clean(d.href);
        });
    }
    /** 检查a标签 */
    function click(e) { // 代码copy自B站spm.js
        var f = e.target;
        for (; f && "A" !== f.tagName;) {
            f = f.parentNode
        }
        if ("A" !== (null == f ? void 0 : f.tagName)) {
            return
        }
        anchor([f]);
    }
    /**
     * 修改当前URL而不出发重定向
     * **无法跨域操作！**
     * @param url 新URL
     */
    function replaceUrl(url) {
        window.history.replaceState(window.history.state, "", url);
    }
    cleanLocation(); // 及时处理地址栏
    // 处理注入的节点
    let timer = 0;
    observerAddedNodes((node) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            cleanLocation();
            anchor(document.querySelectorAll("a"));
        });
    });
    // 处理点击事件
    window.addEventListener("click", click, !1);
    // 处理右键菜单
    window.addEventListener("contextmenu", click, !1);
    // 页面载入完成
    document.addEventListener("load", ()=>anchor(document.querySelectorAll("a")), !1);
    /**
     * 注册节点添加监听
     * **监听节点变动开销极大，如非必要请改用其他方法并且用后立即销毁！**
     * @param callback 添加节点后执行的回调函数
     * @returns 注册编号，用于使用`removeObserver`销毁监听
     */
    function observerAddedNodes(callback) {
        try {
            if (typeof callback === "function") nodelist.push(callback);
            return nodelist.length - 1;
        } catch (e) { console.error(e) }
    }
    const observe = new MutationObserver(d => d.forEach(d => {
        d.addedNodes[0] && nodelist.forEach(async f => {
            try {
                f(d.addedNodes[0])
            } catch (e) { console.error(d) }
        })
    }));
    observe.observe(document, { childList: true, subtree: true });
    window.open = ((__open__) => {
        return (url, name, params) => {
            return __open__(clean(url), name, params)
        }
    })(window.open)
    window.navigation && window.navigation.addEventListener('navigate', e => {
        const newURL = clean(e.destination.url)
        if(e.destination.url!=newURL) {
            e.preventDefault(); // 返回前还是先阻止原事件吧
            if(newURL == window.location.href) return // 如果清理后和原来一样就直接返回
            // 否则就处理清理后的链接
            window.history.replaceState(window.history.state, "", newURL)
            return
        }
    });
})();
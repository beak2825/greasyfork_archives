// ==UserScript==
// @name               公众号去除图片延迟加载
// @name:zh-CN         公众号去除图片延迟加载
// @name:en            Disable Wechat Images Lazyload
// @description        去除图片延迟加载，直接显示原图片
// @description:zh-CN  去除图片延迟加载，直接显示原图片
// @description:en     Disable Wechat Images Lazyload, Show Origin Images Directly
// @namespace          https://www.runningcheese.com
// @version            0.5
// @author             RunningCheese
// @match              https://mp.weixin.qq.com/s/*
// @match              https://mp.weixin.qq.com/s?__biz=*
// @run-at             document-start
// @require            https://code.jquery.com/jquery-3.3.1.min.js
// @icon               https://t1.gstatic.cn/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://mp.weixin.qq.com
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/458583/%E5%85%AC%E4%BC%97%E5%8F%B7%E5%8E%BB%E9%99%A4%E5%9B%BE%E7%89%87%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/458583/%E5%85%AC%E4%BC%97%E5%8F%B7%E5%8E%BB%E9%99%A4%E5%9B%BE%E7%89%87%E5%BB%B6%E8%BF%9F%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==
     
(function() {
    // 使用noConflict模式避免与页面上的其他jQuery冲突
    var $j = jQuery.noConflict(true);
    
    // 处理图片懒加载
    function processLazyImages() {
        $j('img').each(function(){
            var dataSrc = $j(this).attr('data-src');
            if (dataSrc){
                $j(this).attr('src', dataSrc);
                $j(this).removeAttr('data-src');
                $j(this).removeAttr('data-type');
                $j(this).removeAttr('data-w');
                $j(this).removeAttr('data-ratio');
                $j(this).removeAttr('data-fail');
            }
        });
    }
    
    // 移除URL中的懒加载参数
    function removeWxLazyParam() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (link.href && link.href.includes('wx_lazy=1')) {
                link.href = link.href.replace('wx_lazy=1', '');
            }
        });
    }
    
    // 监听DOM变化，处理动态加载的内容，但限制在文章内容区域
    function observeDOMChanges() {
        // 仅监听文章内容区域，而不是整个body
        const articleContent = document.querySelector('#js_content') || document.body;
        
        const observer = new MutationObserver(function(mutations) {
            // 设置一个防抖动计时器，避免频繁处理
            if (observer.timer) {
                clearTimeout(observer.timer);
            }
            observer.timer = setTimeout(function() {
                processLazyImages();
                removeWxLazyParam();
            }, 200);
        });
        
        observer.observe(articleContent, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['data-src']
        });
    }
    
    // 页面加载完成后执行
    $j(document).ready(function() {
        // 立即执行一次
        processLazyImages();
        removeWxLazyParam();
        
        // 再延迟执行一次，确保处理完所有图片
        setTimeout(function(){
            processLazyImages();
            removeWxLazyParam();
            
            // 开始监听DOM变化
            observeDOMChanges();
        }, 1000);
    });
    
    // 替换HTML内容中的懒加载属性
    document.addEventListener('DOMContentLoaded', function() {
        const htmlContent = document.body.innerHTML;
        // 使用正则替换，但不直接修改整个body的innerHTML，这可能会破坏事件监听
        const articleContent = document.querySelector('#js_content');
        if (articleContent) {
            articleContent.innerHTML = articleContent.innerHTML
                .replace(/wx_lazy=1/g, '')
                .replace(/data-src/g, 'src');
        }
    });
})();
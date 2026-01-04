// ==UserScript==
// @name         论坛帖子模态窗口
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在当前页面使用模态窗口显示帖子内容
// @author       Your name
// @match        *://linux.do/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/529042/%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E6%A8%A1%E6%80%81%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/529042/%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90%E6%A8%A1%E6%80%81%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加模态窗口样式
    GM_addStyle(`
        .modal-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.75);
            z-index: 9999;
            overflow: hidden;
            cursor: pointer;
        }
        .modal-content {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 0;
            border-radius: 12px;
            width: 90%;
            max-width: 1400px;
            height: 90%;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            overflow: hidden;
            cursor: default;
        }
        .modal-body {
            flex: 1;
            width: 100%;
            height: 100%;
            position: relative;
            overflow: hidden;
        }
        .modal-iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
        body.modal-open {
            overflow: hidden !important;
            padding-right: 17px; /* 补偿滚动条宽度 */
        }
        html.modal-open-html {
            overflow: hidden !important;
        }
    `);

    // 创建模态窗口HTML
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="modal-body">
                    <iframe class="modal-iframe" frameborder="0"></iframe>
                </div>
            </div>
        </div>
    `;

    // 添加模态窗口到页面
    $('body').append(modalHTML);

    let scrollPosition = 0;

    // 替换所有帖子链接的点击事件
    function handleTopicLinks() {
        $('a.title.raw-link.raw-topic-link').each(function() {
            const $link = $(this);
            const originalHref = $link.attr('href');
            
            // 移除原有的href，防止跳转
            $link.removeAttr('href');
            
            // 添加自定义点击事件
            $link.click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const $modalOverlay = $('.modal-overlay');
                const $iframe = $('.modal-iframe');
                
                // 保存当前滚动位置
                scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
                
                $iframe.attr('src', originalHref);
                $modalOverlay.fadeIn();
                
                // 先添加样式
                $('html').addClass('modal-open-html');
                $('body').addClass('modal-open');
                
                // 设置body的top值来保持视觉位置
                $('body').css({
                    position: 'fixed',
                    top: -scrollPosition + 'px',
                    width: '100%'
                });
                
                return false;
            });
        });
    }

    // 初始执行一次
    handleTopicLinks();

    // 监听DOM变化，处理动态加载的链接
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                handleTopicLinks();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 关闭模态窗口
    function closeModal() {
        $('.modal-overlay').fadeOut();
        
        // 移除body的fixed定位
        $('body').css({
            position: '',
            top: '',
            width: ''
        });
        
        // 移除类
        $('html').removeClass('modal-open-html');
        $('body').removeClass('modal-open');
        
        // 恢复滚动位置
        window.scrollTo(0, scrollPosition);
        
        // 清空iframe
        $('.modal-iframe').attr('src', '');
    }
    
    $('.modal-overlay').click(function(e) {
        if (!$(e.target).closest('.modal-content').length) {
            closeModal();
        }
    });

    // ESC键关闭模态窗口
    $(document).keydown(function(e) {
        if (e.keyCode === 27) {
            closeModal();
        }
    });

    // 禁用外部滚动
    $(window).on('wheel touchmove', function(e) {
        if ($('body').hasClass('modal-open')) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
})(); 
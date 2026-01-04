// ==UserScript==
// @name                 Bilibili Hires Emoji
// @name:zh-CN           Bilibili 高清表情
// @namespace            https://github.com/TZFC
// @version              0.3
// @description          Render Bilibili live room emojis in high resolution.
// @description:zh-CN    在Bilibili直播间渲染高清表情。
// @author               TZFC
// @match                https://live.bilibili.com/*
// @icon                 https://www.bilibili.com/favicon.ico
// @grant                none
// @license              GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/464026/Bilibili%20Hires%20Emoji.user.js
// @updateURL https://update.greasyfork.org/scripts/464026/Bilibili%20Hires%20Emoji.meta.js
// ==/UserScript==
 (function () {
    'use strict';

    const at_webp_pattern = /@[0-9a-z]*\.webp/g;

    function remove_at_suffix(image_element) {
        const source = image_element.src;
        if (!source || image_element.dataset.at_webp_processed === '1') return;
        if (source.includes('.webp') && source.includes('@')) {
            image_element.src = source.replace(at_webp_pattern, '');
            image_element.dataset.at_webp_processed = '1';
        }
    }

    function scan_node_for_images(node) {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'IMG') {
            remove_at_suffix(node);
            return;
        }
        const images = node.querySelectorAll('img');
        for (let i = 0; i < images.length; i++) remove_at_suffix(images[i]);
    }

    const mutation_observer = new MutationObserver(function (mutation_list) {
        for (let i = 0; i < mutation_list.length; i++) {
            const mutation = mutation_list[i];

            if (mutation.type === 'attributes') {
                remove_at_suffix(mutation.target);
                continue;
            }

            const added = mutation.addedNodes;
            for (let j = 0; j < added.length; j++) scan_node_for_images(added[j]);
        }
    });

    mutation_observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            scan_node_for_images(document.documentElement);
        }, { passive: true });
    } else {
        scan_node_for_images(document.documentElement);
    }
})();

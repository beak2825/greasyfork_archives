// ==UserScript==
// @name         Fmkorea 댓글 이미지 삽입
// @namespace    
// @version      1.1
// @description  펨코 댓글에 달린 이미지 링크를 임베드합니다.
// @author       아스마토키다이스키
// @match       https://*.fmkorea.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513836/Fmkorea%20%EB%8C%93%EA%B8%80%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%82%BD%EC%9E%85.user.js
// @updateURL https://update.greasyfork.org/scripts/513836/Fmkorea%20%EB%8C%93%EA%B8%80%20%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%82%BD%EC%9E%85.meta.js
// ==/UserScript==
function replaceLinksWithImages() {
    const commentElements = document.querySelectorAll('[id^="comment"]');
    
    commentElements.forEach(commentElement => {
        const links = commentElement.querySelectorAll('a[href*=".jpg"]:not(:has(img)), \
                                                    a[href*=".png"]:not(:has(img)), \
                                                    a[href$=".gif"]:not(:has(img)), \
                                                    a[href*=".jpeg"]:not(:has(img)), \
                                                    a[href*=".webp"]:not(:has(img)), \
                                                    a[href*="format=jpg"]:not(:has(img)), \
                                                    a[href*="format=jpeg"]:not(:has(img))');
        
        links.forEach(link => {
            const imageUrl = link.href;
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = link.textContent || 'Embedded image';
            
            if (link.className) {
                img.className = link.className;
            }
            
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            
            link.parentNode.replaceChild(img, link);
        });
    });
}

document.addEventListener('DOMContentLoaded', replaceLinksWithImages);

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
            replaceLinksWithImages();
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
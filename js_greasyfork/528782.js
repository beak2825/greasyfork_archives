// ==UserScript==
// @name         YOUTUBE: hide low views videos (less than 100k) (customizable)
// @namespace    https://github.com/KenKaneki73985
// @license      MIT
// @match        https://www.youtube.com/feed/subscriptions
// @match        https://www.youtube.com
// @description  hide videos less than 100k views (customizable)
// @version 0.0.1.20250801235207
// @downloadURL https://update.greasyfork.org/scripts/528782/YOUTUBE%3A%20hide%20low%20views%20videos%20%28less%20than%20100k%29%20%28customizable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528782/YOUTUBE%3A%20hide%20low%20views%20videos%20%28less%20than%20100k%29%20%28customizable%29.meta.js
// ==/UserScript==
// user_script = "moz-extension://762e4395-b145-4620-8dd9-31bf09e052de/options.html#nav=e203b9b5-3a24-4566-b0e8-3d6bbb72aed0+editor"

(function() {
    'use strict';

    // if (document.readyState === 'complete'){ // alert("injected AFTER load event") 
    //     HIDE_LOW_VIEW_VIDEOS()
    // } else {
    //     window.addEventListener('load', () => { // alert("code injected BEFORE load event fires")
    //         HIDE_LOW_VIEW_VIDEOS()
    //         show_GUI("DONE manual hide low views", "GUI_v1", "blue", 0, 80, 16, 3000)
    //     })
    // }

    // document.addEventListener('keydown', function(event) {
    //     if (event.altKey && event.key === 'k'){
    //         HIDE_LOW_VIEW_VIDEOS()
    //         show_GUI("DONE manual hide low views", "GUI_v1", "blue", 0, 80, 16, 3000)
    //     }
    // })

    function HIDE_LOW_VIEW_VIDEOS(){
        let ContainerOfAllVideos = document.querySelector("#contents")
        let ListOfVideos = ContainerOfAllVideos.querySelectorAll("ytd-rich-item-renderer")

        ListOfVideos.forEach(function(video) {
            let fullText = video.innerText
            let lines = fullText.split('\n')
            
            // The title is usually the second line (index 1)
            let title = lines[1] ? lines[1].trim() : "Title not found"
            
            // Extract views
            let viewsMatch = fullText.match(/([\d,]+(?:\.\d+)?[KMB]?)\s+views?/i)
            let views = viewsMatch ? viewsMatch[1] : "Views not found"
            
            // ─── DON'T DELETE THESE (for debugging) ─────────────
            console.log("Title: " + title)
            console.log("Views: " + views)
            console.log("────────────────────────────────────────────")
            
            // Hide videos with views lower than 100K
            if (views !== "Views not found") {
                let shouldHide = false
                
                if (views.includes('M') || views.includes('B')) {
                    // Million or Billion views - keep visible
                    shouldHide = false
                } else if (views.includes('K') || views.includes('k')) {
                    // Extract the number before K
                    let numValue = parseFloat(views.replace(/[Kk,]/g, ''))

                    // ─── SET VIEW COUNT HERE ─────────────
                    if (numValue < 100) { // less than 100k views
                    // if (numValue < 500) { // less than 500k views
                    // if (numValue < 900) { // less than 500k views
                        shouldHide = true
                    }
                } else {
                    // Just numbers (less than 1K) - hide
                    shouldHide = true
                }
                
                if (shouldHide) {
                    console.log("▬▬▬▬▬ HIDDEN ▬▬▬▬▬")
                    video.style.display = 'none'
                    console.log("title: " + title + " (" + views + " views)")
                }
            }
        })

        // show_GUI("does checking views", "GUI_v1", "blue", 0, 80, 16, 3000)
    }

    // Observe scroll and dynamically loaded content
    const observerOptions = {
        childList: true,
        subtree: true
    };

    const observer = new MutationObserver((mutations) => {
        // Check if new videos have been added
        const newVideos = mutations.some(mutation => 
            mutation.type === 'childList' && 
            mutation.addedNodes.length > 0
        );

        if (newVideos) {
            // Small delay to ensure new content is fully rendered
            setTimeout(HIDE_LOW_VIEW_VIDEOS, 100);
        }
    });

    // Start observing the page for changes
    const targetNode = document.body;
    observer.observe(targetNode, observerOptions);
})();
// ==UserScript==
    // @name         Danbooru Batch Tag Editor
    // @namespace    http://tampermonkey.net/
    // @version      3.9
    // @description  Batch apply tags to multiple selected Danbooru posts with select all, auto-tag all pages, progress bar, URL-based navigation, counter reset, page-range-specific isolation, multiple tags, configurable delays, slideshow mode, minimizable UI with persistent maximize button, draggable header with reset, persistent modes, and Danbooru dark mode theme
    // @author       FunkyJustin
    // @license      MIT
    // @match        https://danbooru.donmai.us/posts?*
    // @exclude      https://danbooru.donmai.us/posts/*[0-9]+
    // @exclude      https://danbooru.donmai.us/posts/*[0-9]+?q=parent%3A*[0-9]+
    // @grant        GM_addStyle
    // @grant        GM_xmlhttpRequest
    // @grant        GM_setValue
    // @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/543240/Danbooru%20Batch%20Tag%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/543240/Danbooru%20Batch%20Tag%20Editor.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        // Add CSS for the UI with Danbooru dark mode theme and draggable header
        GM_addStyle(`
            #batch-tag-container {
                position: fixed;
                top: ${GM_getValue('uiTop', '10')}px;
                right: ${GM_getValue('uiRight', '10')}px;
                background: #1a1a1a;
                padding: 10px;
                border: 1px solid #333;
                z-index: 1000;
                box-shadow: 0 0 5px rgba(0,0,0,0.5);
                color: #d3d3d3;
                font-family: Arial, sans-serif;
                user-select: none;
            }
            #batch-tag-container.minimized .content {
                display: none;
            }
            #batch-tag-container .header {
                position: relative;
                padding: 5px;
                cursor: move;
            }
            #batch-tag-container input {
                margin: 5px 0;
                padding: 5px;
                background: #2a2a2a;
                border: 1px solid #444;
                color: #d3d3d3;
            }
            #batch-tag-container button {
                padding: 5px 10px;
                cursor: pointer;
                margin-right: 5px;
                background: #333;
                border: 1px solid #444;
                color: #d3d3d3;
            }
            #batch-tag-container button:hover {
                background: #555;
            }
            #batch-tag-container .version {
                font-size: 12px;
                color: #999;
                position: absolute;
                bottom: 5px;
                right: 5px;
            }
            #batch-tag-container #status-message {
                font-size: 12px;
                color: #bbb;
                margin-top: 5px;
            }
            #batch-tag-container #tagged-counter {
                font-size: 12px;
                color: #bbb;
                margin-top: 5px;
            }
            #batch-tag-container progress {
                width: 100%;
                margin-top: 5px;
                background: #2a2a2a;
                border: none;
            }
            #batch-tag-container progress::-webkit-progress-bar {
                background-color: #2a2a2a;
            }
            #batch-tag-container progress::-webkit-progress-value {
                background-color: #555;
            }
            .batch-selected {
                border: 2px solid #ff4444 !important;
            }
            #delay-controls {
                margin-top: 5px;
            }
            #minimize-btn, #reset-position-btn {
                padding: 2px 5px;
                background: #333;
                border: none;
                color: #d3d3d3;
                cursor: pointer;
                margin-right: 5px;
            }
            #minimize-btn:hover, #reset-position-btn:hover {
                background: #555;
            }
            #current-mode {
                font-weight: bold;
                margin-left: 10px;
            }
        `);

        // Track selected posts and states
        let selectedPosts = [];
        let isAutoTagging = GM_getValue('isAutoTagging', false);
        let isPausedAutoTag = GM_getValue('isPausedAutoTag', false);
        let isSlideshow = GM_getValue('isSlideshow', false);
        let isPausedSlideshow = GM_getValue('isPausedSlideshow', false);
        let isManualTag = GM_getValue('isManualTag', false);
        let totalTagged = GM_getValue('totalTagged', 0);
        let initialUrl = GM_getValue('initialUrl', '');
        let initialPage = GM_getValue('initialPage', 0);
        let highestPageReached = GM_getValue('highestPageReached', 0);
        let taggingDelay = GM_getValue('taggingDelay', 2); // Default 2 seconds
        let slideshowDelay = GM_getValue('slideshowDelay', 5); // Default 5 seconds
        let isMinimized = GM_getValue('isMinimized', false); // Default not minimized
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let initialTop = GM_getValue('uiTop', 10);
        let initialRight = GM_getValue('uiRight', 10);

        // Create UI
        function createUI() {
            const existingContainer = document.getElementById('batch-tag-container');
            if (existingContainer) existingContainer.remove();

            const container = document.createElement('div');
            container.id = 'batch-tag-container';
            if (isMinimized) container.classList.add('minimized');
            const lastTag = GM_getValue('lastTag', '');
            const currentPage = parseInt(document.querySelector('.paginator-current')?.textContent || '1');
            const lastPageElements = document.querySelectorAll('.paginator-page');
            let lastPage = currentPage;
            lastPageElements.forEach(el => {
                const pageNum = parseInt(el.textContent);
                if (pageNum > lastPage) lastPage = pageNum;
            });
            container.innerHTML = `
                <div class="header">
                    <button id="minimize-btn">${isMinimized ? 'Maximize' : 'Minimize'}</button>
                    <button id="reset-position-btn">Reset Position</button>
                    <span id="current-mode">${getCurrentModeDisplay()}</span>
                </div>
                <div class="content" ${isMinimized ? 'style="display: none;"' : ''}>
                    <input type="text" id="batch-tag-input" placeholder="Enter tag (e.g., nipple_rings ring_piercing)" value="${lastTag}">
                    <button id="batch-apply">Apply Tag</button>
                    <button id="batch-select-all">Select All</button>
                    <button id="batch-auto-tag-stop">${isAutoTagging ? (isPausedAutoTag ? 'Play' : 'Stop') : 'Auto-Tag'}</button>
                    <button id="batch-auto-tag-pause" style="${isAutoTagging && !isPausedAutoTag ? '' : 'display:none;'}"${isPausedAutoTag ? 'disabled' : ''}>Pause</button>
                    <button id="batch-auto-tag-play" style="${isAutoTagging && isPausedAutoTag ? '' : 'display:none;'}"${!isPausedAutoTag ? 'disabled' : ''}>Play</button>
                    <button id="batch-clear">Clear Selection</button>
                    <button id="batch-clear-counter">Clear Counter</button>
                    <button id="batch-slideshow-stop">${isSlideshow ? (isPausedSlideshow ? 'Play' : 'Stop') : 'Slideshow'}</button>
                    <button id="batch-slideshow-pause" style="${isSlideshow && !isPausedSlideshow ? '' : 'display:none;'}"${isPausedSlideshow ? 'disabled' : ''}>Pause</button>
                    <button id="batch-slideshow-play" style="${isSlideshow && isPausedSlideshow ? '' : 'display:none;'}"${!isPausedSlideshow ? 'disabled' : ''}>Play</button>
                    <div id="delay-controls">
                        Tagging Delay: <input type="number" id="tagging-delay" min="1" value="${taggingDelay}" style="width: 50px;"> sec
                        Slideshow Delay: <input type="number" id="slideshow-delay" min="1" value="${slideshowDelay}" style="width: 50px;"> sec
                    </div>
                    <div id="tagged-counter">Tagged: ${totalTagged}</div>
                    <progress id="progress-bar" value="${currentPage}" max="${lastPage}"></progress>
                    <div id="status-message"></div>
                    <div class="version">v3.8</div>
                </div>
            `;
            document.body.appendChild(container);

            // Event listeners
            document.getElementById('minimize-btn').addEventListener('click', toggleMinimize);
            document.getElementById('reset-position-btn').addEventListener('click', resetPosition);
            document.getElementById('batch-apply').addEventListener('click', applyTags);
            document.getElementById('batch-select-all').addEventListener('click', selectAll);
            document.getElementById('batch-auto-tag-stop').addEventListener('click', toggleAutoTag);
            document.getElementById('batch-auto-tag-pause').addEventListener('click', togglePauseAutoTag);
            document.getElementById('batch-auto-tag-play').addEventListener('click', togglePlayAutoTag);
            document.getElementById('batch-clear').addEventListener('click', clearSelection);
            document.getElementById('batch-clear-counter').addEventListener('click', clearCounter);
            document.getElementById('batch-slideshow-stop').addEventListener('click', toggleSlideshow);
            document.getElementById('batch-slideshow-pause').addEventListener('click', togglePauseSlideshow);
            document.getElementById('batch-slideshow-play').addEventListener('click', togglePlaySlideshow);
            document.getElementById('tagging-delay').addEventListener('change', () => {
                taggingDelay = Math.max(1, parseInt(document.getElementById('tagging-delay').value) || 2);
                GM_setValue('taggingDelay', taggingDelay);
            });
            document.getElementById('slideshow-delay').addEventListener('change', () => {
                slideshowDelay = Math.max(1, parseInt(document.getElementById('slideshow-delay').value) || 5);
                GM_setValue('slideshowDelay', slideshowDelay);
            });
            document.getElementById('batch-tag-input').addEventListener('input', () => {
                GM_setValue('lastTag', document.getElementById('batch-tag-input').value.trim());
            });

            // Drag functionality
            const header = document.querySelector('#batch-tag-container .header');
            header.addEventListener('mousedown', startDragging);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDragging);
        }

        // Get current mode display
        function getCurrentModeDisplay() {
            if (isManualTag) return 'Current Mode: Manual Tag';
            if (isAutoTagging) return 'Current Mode: Auto-Tag';
            if (isSlideshow) return 'Current Mode: Slideshow';
            return '';
        }

        // Toggle minimize/maximize state
        function toggleMinimize() {
            isMinimized = !isMinimized;
            GM_setValue('isMinimized', isMinimized);
            createUI();
        }

        // Reset UI position
        function resetPosition() {
            initialTop = 10;
            initialRight = 10;
            GM_setValue('uiTop', initialTop);
            GM_setValue('uiRight', initialRight);
            createUI();
        }

        // Drag functionality
        function startDragging(e) {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
        }

        function drag(e) {
            if (isDragging) {
                const container = document.getElementById('batch-tag-container');
                let newTop = initialTop + (e.clientY - dragStartY);
                let newRight = initialRight - (e.clientX - dragStartX);

                // Prevent off-screen dragging
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;
                const containerHeight = container.offsetHeight;
                const containerWidth = container.offsetWidth;

                newTop = Math.max(0, Math.min(newTop, viewportHeight - containerHeight));
                newRight = Math.max(0, Math.min(newRight, viewportWidth - containerWidth));

                container.style.top = `${newTop}px`;
                container.style.right = `${newRight}px`;
                initialTop = newTop;
                initialRight = newRight;
            }
        }

        function stopDragging() {
            isDragging = false;
            GM_setValue('uiTop', initialTop);
            GM_setValue('uiRight', initialRight);
        }

        // Toggle post selection
        function toggleSelection(event) {
            if (event.ctrlKey) {
                const post = event.target.closest('article');
                if (post && post.dataset.id) {
                    event.preventDefault();
                    const postId = post.dataset.id;
                    if (selectedPosts.includes(postId)) {
                        selectedPosts = selectedPosts.filter(id => id !== postId);
                        post.classList.remove('batch-selected');
                    } else {
                        selectedPosts.push(postId);
                        post.classList.add('batch-selected');
                    }
                }
            }
        }

        // Select all posts on the page
        function selectAll() {
            selectedPosts = [];
            const posts = document.querySelectorAll('article[data-id]');
            posts.forEach(post => {
                const postId = post.dataset.id;
                if (!selectedPosts.includes(postId)) {
                    selectedPosts.push(postId);
                    post.classList.add('batch-selected');
                }
            });
        }

        // Clear selected posts
        function clearSelection() {
            selectedPosts.forEach(postId => {
                const post = document.querySelector(`article[data-id="${postId}"]`);
                if (post) post.classList.remove('batch-selected');
            });
            selectedPosts = [];
        }

        // Clear tagged posts counter
        function clearCounter() {
            totalTagged = 0;
            GM_setValue('totalTagged', totalTagged);
            updateCounter();
        }

        // Get CSRF token from page
        function getCsrfToken() {
            const meta = document.querySelector('meta[name="csrf-token"]');
            return meta ? meta.content : '';
        }

        // Update status message, counter, and progress bar
        function updateStatus(message) {
            const statusElement = document.getElementById('status-message');
            if (statusElement) {
                const currentPage = parseInt(document.querySelector('.paginator-current')?.textContent || '1');
                const lastPageElements = document.querySelectorAll('.paginator-page');
                let lastPage = currentPage;
                lastPageElements.forEach(el => {
                    const pageNum = parseInt(el.textContent);
                    if (pageNum > lastPage) lastPage = pageNum;
                });
                const pagesLeft = Math.max(0, lastPage - currentPage);
                statusElement.textContent = `${message} (Page ${currentPage} of ${lastPage}, ${pagesLeft} pages left)`;
            }
            updateCounter();
            updateProgressBar();
        }

        function updateCounter() {
            const counterElement = document.getElementById('tagged-counter');
            if (counterElement) {
                counterElement.textContent = `Tagged: ${totalTagged}`;
            }
        }

        function updateProgressBar() {
            const progressBar = document.getElementById('progress-bar');
            const currentPage = parseInt(document.querySelector('.paginator-current')?.textContent || '1');
            const lastPageElements = document.querySelectorAll('.paginator-page');
            let lastPage = currentPage;
            lastPageElements.forEach(el => {
                const pageNum = parseInt(el.textContent);
                if (pageNum > lastPage) lastPage = pageNum;
            });
            if (progressBar) {
                progressBar.max = lastPage;
                progressBar.value = currentPage;
            }
        }

        // Get total post count (approximate, from page metadata if available)
        function getTotalPostCount() {
            const paginator = document.querySelector('.paginator');
            if (paginator) {
                const lastPageElements = paginator.querySelectorAll('.paginator-page');
                let lastPage = 1;
                lastPageElements.forEach(el => {
                    const pageNum = parseInt(el.textContent);
                    if (pageNum > lastPage) lastPage = pageNum;
                });
                return lastPage * 20; // Approximate: 20 posts per page
            }
            return 20; // Default estimate
        }

        // Wait for page content to load
        async function waitForPageLoad() {
            return new Promise((resolve) => {
                console.log('Waiting for page load...');
                const observer = new MutationObserver((mutations, obs) => {
                    if (document.querySelector('article[data-id]')) {
                        console.log('Page loaded');
                        obs.disconnect();
                        resolve(true);
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });

                // Timeout after 5 seconds
                setTimeout(() => {
                    console.log('Page load timeout');
                    observer.disconnect();
                    resolve(false);
                }, 5000);
            });
        }

        // Apply tags to selected posts
        async function applyTags() {
            if (isManualTag) return; // Prevent re-entry
            const tagsInput = document.getElementById('batch-tag-input').value.trim();
            if (!tagsInput) {
                alert('Please enter at least one tag');
                return;
            }
            if (selectedPosts.length === 0) {
                alert('Please select at least one post');
                return;
            }

            const csrfToken = getCsrfToken();
            if (!csrfToken) {
                alert('CSRF token not found. Please ensure you are logged in.');
                return;
            }

            isManualTag = true;
            GM_setValue('isManualTag', true);
            updateModeDisplay();
            const tags = tagsInput.split(' ').filter(tag => tag.length > 0);
            updateStatus(`Applying tags "${tags.join(' ')}" to ${selectedPosts.length} posts...`);
            let failedPosts = [];
            for (const postId of selectedPosts) {
                const success = await processPost(postId, tags, csrfToken);
                if (success) totalTagged++;
                else failedPosts.push(postId);
            }

            if (failedPosts.length > 0) {
                alert(`Failed to apply tags to posts: ${failedPosts.join(', ')}`);
            } else {
                alert('Tags applied to all selected posts');
            }
            clearSelection();
            GM_setValue('totalTagged', totalTagged);
            isManualTag = false;
            GM_setValue('isManualTag', false);
            updateModeDisplay();
            updateStatus('');
        }

        // Auto-tag all pages
        async function autoTagAllPages() {
            const tagsInput = document.getElementById('batch-tag-input').value.trim();
            if (!tagsInput) {
                alert('Please enter at least one tag');
                return;
            }

            const csrfToken = getCsrfToken();
            if (!csrfToken) {
                alert('CSRF token not found. Please ensure you are logged in.');
                return;
            }

            // Store or update initial state if not set
            if (!initialUrl) {
                initialUrl = window.location.href;
                initialPage = parseInt(new URL(initialUrl).searchParams.get('page') || '1');
                highestPageReached = initialPage;
                GM_setValue('initialUrl', initialUrl);
                GM_setValue('initialPage', initialPage);
                GM_setValue('highestPageReached', highestPageReached);
            }

            // Check if confirmation is needed and not already confirmed
            if (!GM_getValue('autoTagConfirmed', false)) {
                const totalPosts = getTotalPostCount();
                const currentPage = parseInt(document.querySelector('.paginator-current')?.textContent || '1');
                const lastPageElements = document.querySelectorAll('.paginator-page');
                let lastPage = currentPage;
                lastPageElements.forEach(el => {
                    const pageNum = parseInt(el.textContent);
                    if (pageNum > lastPage) lastPage = pageNum;
                });
                const pagesToTag = currentPage === 1 ? lastPage : lastPage - currentPage + 1;
                if (!confirm(`Apply tags "${tagsInput}" to approximately ${totalPosts} posts across ${pagesToTag} pages starting from page ${currentPage}?`)) {
                    isAutoTagging = false;
                    isPausedAutoTag = false;
                    GM_setValue('isAutoTagging', false);
                    GM_setValue('isPausedAutoTag', false);
                    GM_setValue('initialUrl', '');
                    GM_setValue('initialPage', 0);
                    GM_setValue('highestPageReached', 0);
                    document.getElementById('batch-auto-tag-stop').textContent = 'Auto-Tag';
                    updateModeDisplay();
                    updateStatus('');
                    return;
                }
                GM_setValue('autoTagConfirmed', true);
            }

            // Get current page number
            const currentUrl = new URL(window.location.href);
            const currentPage = parseInt(currentUrl.searchParams.get('page') || '1');
            highestPageReached = Math.max(highestPageReached, currentPage);
            GM_setValue('highestPageReached', highestPageReached);

            // Check if the current page is within the allowed range and matches initial URL
            if (currentPage < initialPage || currentPage > highestPageReached || currentUrl.href !== initialUrl) {
                if (currentUrl.href !== initialUrl) {
                    updateStatus('Script is isolated to the original tab. No operation on this tab.');
                    return;
                }
            }

            const lastPageElements = document.querySelectorAll('.paginator-page');
            let lastPage = currentPage;
            lastPageElements.forEach(el => {
                const pageNum = parseInt(el.textContent);
                if (pageNum > lastPage) lastPage = pageNum;
            });

            while (isAutoTagging && !isPausedAutoTag) {
                createUI();
                document.removeEventListener('click', toggleSelection);
                document.addEventListener('click', toggleSelection);

                updateStatus(`Processing page ${currentPage}...`);
                selectAll();
                if (selectedPosts.length === 0) {
                    updateStatus('No posts found on this page.');
                    break;
                }

                await new Promise(resolve => setTimeout(resolve, taggingDelay * 1000));
                const tags = tagsInput.split(' ').filter(tag => tag.length > 0);
                let failedPosts = [];
                for (const postId of selectedPosts) {
                    if (isAutoTagging && !isPausedAutoTag) {
                        const success = await processPost(postId, tags, csrfToken);
                        if (!success) failedPosts.push(postId);
                    }
                }

                if (failedPosts.length > 0) {
                    alert(`Page ${currentPage}: Failed to apply tags to posts: ${failedPosts.join(', ')}`);
                }

                if (currentPage >= lastPage) {
                    updateStatus('Finished tagging all posts!');
                    isAutoTagging = false;
                    isPausedAutoTag = false;
                    GM_setValue('isAutoTagging', false);
                    GM_setValue('isPausedAutoTag', false);
                    GM_setValue('totalTagged', 0);
                    GM_setValue('autoTagConfirmed', false);
                    GM_setValue('initialUrl', '');
                    GM_setValue('initialPage', 0);
                    GM_setValue('highestPageReached', 0);
                    document.getElementById('batch-auto-tag-stop').textContent = 'Auto-Tag';
                    updateModeDisplay();
                    break;
                }

                const nextUrl = new URL(window.location.href);
                const nextPage = currentPage + 1;
                nextUrl.searchParams.set('page', nextPage);
                initialUrl = nextUrl.href;
                GM_setValue('initialUrl', initialUrl);
                console.log(`Navigating to page ${nextPage}`);
                window.location.href = nextUrl.toString();
                updateStatus(`Loading page ${nextPage}...`);

                const loaded = await waitForPageLoad();
                if (!loaded) {
                    console.log(`Failed to load page ${nextPage}`);
                    updateStatus(`Failed to load page ${nextPage}. Stopping.`);
                    break;
                }

                await new Promise(resolve => setTimeout(resolve, 2000));
                GM_setValue('totalTagged', totalTagged);
            }

            if (!isAutoTagging) {
                document.getElementById('batch-auto-tag-stop').textContent = 'Auto-Tag';
            } else if (isPausedAutoTag) {
                document.getElementById('batch-auto-tag-stop').textContent = 'Play';
            }
            clearSelection();
            updateStatus('');
        }

        // Toggle auto-tag mode
        function toggleAutoTag() {
            if (!isAutoTagging) {
                isAutoTagging = true;
                GM_setValue('isAutoTagging', true);
                document.getElementById('batch-auto-tag-stop').textContent = 'Stop';
                document.getElementById('batch-auto-tag-pause').style.display = '';
                document.getElementById('batch-auto-tag-play').style.display = 'none';
                updateModeDisplay();
                autoTagAllPages();
            } else {
                isAutoTagging = false;
                isPausedAutoTag = false;
                GM_setValue('isAutoTagging', false);
                GM_setValue('isPausedAutoTag', false);
                GM_setValue('initialUrl', '');
                GM_setValue('initialPage', 0);
                GM_setValue('highestPageReached', 0);
                document.getElementById('batch-auto-tag-stop').textContent = 'Auto-Tag';
                document.getElementById('batch-auto-tag-pause').style.display = 'none';
                document.getElementById('batch-auto-tag-play').style.display = 'none';
                updateModeDisplay();
                updateStatus('');
            }
        }

        // Toggle pause auto-tag
        function togglePauseAutoTag() {
            if (isAutoTagging && !isPausedAutoTag) {
                isPausedAutoTag = true;
                GM_setValue('isPausedAutoTag', true);
                document.getElementById('batch-auto-tag-pause').disabled = true;
                document.getElementById('batch-auto-tag-play').disabled = false;
                document.getElementById('batch-auto-tag-play').style.display = '';
                document.getElementById('batch-auto-tag-stop').textContent = 'Play';
                updateStatus('Paused');
            }
        }

        // Toggle play auto-tag
        function togglePlayAutoTag() {
            if (isAutoTagging && isPausedAutoTag) {
                isPausedAutoTag = false;
                GM_setValue('isPausedAutoTag', false);
                document.getElementById('batch-auto-tag-play').disabled = true;
                document.getElementById('batch-auto-tag-pause').disabled = false;
                document.getElementById('batch-auto-tag-pause').style.display = '';
                document.getElementById('batch-auto-tag-play').style.display = 'none';
                document.getElementById('batch-auto-tag-stop').textContent = 'Stop';
                autoTagAllPages();
            }
        }

        // Slideshow mode
        async function slideshowMode() {
            let currentPage = parseInt(document.querySelector('.paginator-current')?.textContent || '1');
            const lastPageElements = document.querySelectorAll('.paginator-page');
            let lastPage = currentPage;
            lastPageElements.forEach(el => {
                const pageNum = parseInt(el.textContent);
                if (pageNum > lastPage) lastPage = pageNum;
            });

            while (isSlideshow && !isPausedSlideshow) {
                createUI();
                updateStatus(`Viewing page ${currentPage}...`);
                if (currentPage >= lastPage) {
                    updateStatus('Reached the last page!');
                    isSlideshow = false;
                    isPausedSlideshow = false;
                    GM_setValue('isSlideshow', false);
                    GM_setValue('isPausedSlideshow', false);
                    document.getElementById('batch-slideshow-stop').textContent = 'Slideshow';
                    updateModeDisplay();
                    break;
                }

                await new Promise(resolve => setTimeout(resolve, slideshowDelay * 1000));
                const nextUrl = new URL(window.location.href);
                const nextPage = currentPage + 1;
                nextUrl.searchParams.set('page', nextPage);
                console.log(`Navigating to page ${nextPage}`);
                window.location.href = nextUrl.toString();
                updateStatus(`Loading page ${nextPage}...`);

                const loaded = await waitForPageLoad();
                if (!loaded) {
                    console.log(`Failed to load page ${nextPage}`);
                    updateStatus(`Failed to load page ${nextPage}. Stopping.`);
                    break;
                }

                currentPage = nextPage;
            }

            if (!isSlideshow) {
                document.getElementById('batch-slideshow-stop').textContent = 'Slideshow';
            } else if (isPausedSlideshow) {
                document.getElementById('batch-slideshow-stop').textContent = 'Play';
            }
            updateStatus('');
        }

        // Toggle slideshow mode
        function toggleSlideshow() {
            if (!isSlideshow) {
                isSlideshow = true;
                GM_setValue('isSlideshow', true);
                document.getElementById('batch-slideshow-stop').textContent = 'Stop';
                document.getElementById('batch-slideshow-pause').style.display = '';
                document.getElementById('batch-slideshow-play').style.display = 'none';
                updateModeDisplay();
                slideshowMode();
            } else {
                isSlideshow = false;
                isPausedSlideshow = false;
                GM_setValue('isSlideshow', false);
                GM_setValue('isPausedSlideshow', false);
                document.getElementById('batch-slideshow-stop').textContent = 'Slideshow';
                document.getElementById('batch-slideshow-pause').style.display = 'none';
                document.getElementById('batch-slideshow-play').style.display = 'none';
                updateModeDisplay();
                updateStatus('');
            }
        }

        // Toggle pause slideshow
        function togglePauseSlideshow() {
            if (isSlideshow && !isPausedSlideshow) {
                isPausedSlideshow = true;
                GM_setValue('isPausedSlideshow', true);
                document.getElementById('batch-slideshow-pause').disabled = true;
                document.getElementById('batch-slideshow-play').disabled = false;
                document.getElementById('batch-slideshow-play').style.display = '';
                document.getElementById('batch-slideshow-stop').textContent = 'Play';
                updateStatus('Paused');
            }
        }

        // Toggle play slideshow
        function togglePlaySlideshow() {
            if (isSlideshow && isPausedSlideshow) {
                isPausedSlideshow = false;
                GM_setValue('isPausedSlideshow', false);
                document.getElementById('batch-slideshow-play').disabled = true;
                document.getElementById('batch-slideshow-pause').disabled = false;
                document.getElementById('batch-slideshow-pause').style.display = '';
                document.getElementById('batch-slideshow-play').style.display = 'none';
                document.getElementById('batch-slideshow-stop').textContent = 'Stop';
                slideshowMode();
            }
        }

        // Process individual post
        async function processPost(postId, tags, csrfToken) {
            return new Promise((resolve) => {
                try {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://danbooru.donmai.us/posts/${postId}.json`,
                        onload: async function(response) {
                            if (response.status !== 200) {
                                console.error(`Failed to fetch post ${postId}: ${response.status}`);
                                resolve(false);
                                return;
                            }

                            try {
                                const postData = JSON.parse(response.responseText);
                                let currentTags = postData.tag_string.split(' ');
                                tags.forEach(tag => {
                                    if (!currentTags.includes(tag)) {
                                        currentTags.push(tag);
                                    }
                                });
                                const newTagString = currentTags.join(' ');

                                GM_xmlhttpRequest({
                                    method: 'PUT',
                                    url: `https://danbooru.donmai.us/posts/${postId}.json`,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-CSRF-Token': csrfToken
                                    },
                                    data: JSON.stringify({
                                        post: {
                                            tag_string: newTagString
                                        }
                                    }),
                                    onload: function(updateResponse) {
                                        if (updateResponse.status === 200 || updateResponse.status === 204) {
                                            console.log(`Successfully updated post ${postId}, totalTagged: ${totalTagged + 1}`);
                                            totalTagged++;
                                            GM_setValue('totalTagged', totalTagged);
                                            updateCounter();
                                            resolve(true);
                                        } else {
                                            console.error(`Failed to update post ${postId}: ${updateResponse.status}`);
                                            resolve(false);
                                        }
                                    },
                                    onerror: function() {
                                        console.error(`Error updating post ${postId}`);
                                        resolve(false);
                                    }
                                });
                            } catch (e) {
                                console.error(`Error processing post ${postId}:`, e);
                                resolve(false);
                            }
                        },
                        onerror: function() {
                            console.error(`Error fetching post ${postId}`);
                            resolve(false);
                        }
                    });
                } catch (e) {
                    console.error(`Unexpected error in processPost for ${postId}:`, e);
                    resolve(false);
                }
            });
        }

        // Update mode display
        function updateModeDisplay() {
            document.getElementById('current-mode').textContent = getCurrentModeDisplay();
        }

        // Initialize
        function init() {
            createUI();
            document.addEventListener('click', toggleSelection);
            if (isAutoTagging) {
                if (isPausedAutoTag) {
                    document.getElementById('batch-auto-tag-stop').textContent = 'Play';
                    document.getElementById('batch-auto-tag-pause').style.display = 'none';
                    document.getElementById('batch-auto-tag-play').style.display = '';
                } else {
                    document.getElementById('batch-auto-tag-stop').textContent = 'Stop';
                    document.getElementById('batch-auto-tag-pause').style.display = '';
                    document.getElementById('batch-auto-tag-play').style.display = 'none';
                }
                autoTagAllPages();
            }
            if (isSlideshow) {
                if (isPausedSlideshow) {
                    document.getElementById('batch-slideshow-stop').textContent = 'Play';
                    document.getElementById('batch-slideshow-pause').style.display = 'none';
                    document.getElementById('batch-slideshow-play').style.display = '';
                } else {
                    document.getElementById('batch-slideshow-stop').textContent = 'Stop';
                    document.getElementById('batch-slideshow-pause').style.display = '';
                    document.getElementById('batch-slideshow-play').style.display = 'none';
                }
                slideshowMode();
            }
            updateModeDisplay();
        }

        init();
    })();
// ==UserScript==
// @name         Resolution Highlighter Advanced
// @namespace    RHA
// @version      2.1
// @license      MIT
// @description  Enhanced resolution highlighting with advanced information
// @author       jkillas
// @match        https://*/*
// @grant        GM_addStyle
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fearnopeer.com
// @downloadURL https://update.greasyfork.org/scripts/522342/Resolution%20Highlighter%20Advanced.user.js
// @updateURL https://update.greasyfork.org/scripts/522342/Resolution%20Highlighter%20Advanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isEnabled = (function() {
        try {
            const savedState = JSON.parse(localStorage.getItem('fnp_features_state'));
            return savedState ? savedState.resolutionHighlighter : true;
        } catch (e) {
            console.error('Error reading feature state:', e);
            return true;
        }
    })();

    // Get and save badge state
    function getBadgeState(resolution) {
        try {
            const savedStates = JSON.parse(localStorage.getItem('badgeStates')) || {};
            return savedStates[resolution] || false;
        } catch (e) {
            console.error('Error reading badge state:', e);
            return false;
        }
    }

    function saveBadgeState(resolution, isExpanded) {
        try {
            const savedStates = JSON.parse(localStorage.getItem('badgeStates')) || {};
            savedStates[resolution] = isExpanded;
            localStorage.setItem('badgeStates', JSON.stringify(savedStates));
        } catch (e) {
            console.error('Error saving badge state:', e);
        }
    }

    // Enhanced resolution patterns with more detailed quality information
    const qualityPatterns = [
        {
            pattern: /(?:^|\s|[-_.])(4320p|8K)(?:\s|$|[-_.])/i,
            icon: '8K',
            quality: '8K',
            priority: 1
        },
        {
            pattern: /(?:^|\s|[-_.])(1600p|2160p|4K|(?<!1080p\s|720p\s|480p\s)UHD)(?:\s|$|[-_.])/i,
            icon: 'UHD',
            quality: '4K',
            priority: 2
        },
        {
            pattern: /(?:^|\s|[-_.])(1080p|1080i|FHD)(?:\s|$|[-_.])/i,
            icon: 'FHD',
            quality: '1080p',
            priority: 3
        },
        {
            pattern: /(?:^|\s|[-_.])(720p|HD)(?:\s|$|[-_.])/i,
            icon: 'HD',
            quality: '720p',
            priority: 4
        },
        {
            pattern: /(?:^|\s|[-_.])(480p|576p|576i|480i|SD)(?:\s|$|[-_.])/i,
            icon: 'SD',
            quality: '480p',
            priority: 5
        },
        {
            pattern: /(?:^|\s|[-_.])(\d+p)(?:\s|$|[-_.])/i,
            icon: '❓',
            quality: 'other',
            priority: 6
        }
    ];

    // Enhanced HDR patterns with softer, more integrated colors
    const hdrPatterns = [
        {
            pattern: /\b(HDR10\+)\b/i,
            badge: 'HDR10+',
            color: '#2c3e50',
            background: '#f1c40f20',
            borderColor: '#f1c40f'
        },
        {
            pattern: /\b(HDR10|HDR)\b/i,
            badge: 'HDR',
            color: '#2c3e50',
            background: '#f39c1220',
            borderColor: '#f39c12'
        },
        {
            pattern: /\b(Dolby Vision|DV)\b/i,
            badge: 'DV',
            color: '#2c3e50',
            background: '#e84c3d20',
            borderColor: '#e84c3d'
        }
    ];

    // Codec patterns
    const codecPatterns = [
        {
            pattern: /\b(x265)\b/i,
            badge: 'x265',
            color: '#166534',
            background: '#dcfce7',
            borderColor: '#166534'
        },
        {
            pattern: /\b(x264)\b/i,
            badge: 'x264',
            color: '#1e40af',
            background: '#dbeafe',
            borderColor: '#1e40af'
        },
        {
            pattern: /\b(AVC|H\.?265)\b/i,
            badge: 'H.265',
            color: '#e67e22',
            background: '#fef5eb',
            borderColor: '#e67e22'
        },
        {
            pattern: /\b(AVC|H\.?264)\b/i,
            badge: 'H.264',
            color: '#e67e22',
            background: '#fef5eb',
            borderColor: '#e67e22'
        }
    ];

    // Additional quality indicators
    const additionalPatterns = {
        source: /\b(BluRay|Blu-Ray|WEB-DL|WEBDL|WEB|BRRip|WEBRip)\b/i
    };

    // Enhanced audio patterns with version detection
    const audioPatterns = [
        {
            pattern: /\b(?:DD[\+]?|Dolby Digital[\+]?)(?: ?(?:2\.0|5\.1|7\.1))?\b/i,
            getInfo: (match) => {
                const version = match[0].match(/(?:2\.0|5\.1|7\.1)/);
                return {
                    type: match[0].includes('+') ? 'DD+' : 'DD',
                    version: version ? version[0] : null
                };
            }
        },
        {
            pattern: /\b(?:DTS-HD(?: MA)?|DTS-X|DTS)(?: ?(?:2\.0|5\.1|7\.1))?\b/i,
            getInfo: (match) => {
                const version = match[0].match(/(?:2\.0|5\.1|7\.1)/);
                let type = 'DTS';
                if (match[0].includes('DTS-X')) type = 'DTS:X';
                else if (match[0].includes('DTS-HD MA')) type = 'DTS-HD MA';
                else if (match[0].includes('DTS-HD')) type = 'DTS-HD';
                return {
                    type: type,
                    version: version ? version[0] : null
                };
            }
        },
        {
            pattern: /\b(?:TrueHD(?: Atmos)?)(?: ?(?:2\.0|5\.1|7\.1))?\b/i,
            getInfo: (match) => {
                const version = match[0].match(/(?:2\.0|5\.1|7\.1)/);
                return {
                    type: match[0].includes('Atmos') ? 'TrueHD Atmos' : 'TrueHD',
                    version: version ? version[0] : null
                };
            }
        },
        {
            pattern: /\b(?:AAC)(?: ?(?:2\.0|5\.1|7\.1))?\b/i,
            getInfo: (match) => {
                const version = match[0].match(/(?:2\.0|5\.1|7\.1)/);
                return {
                    type: 'AAC',
                    version: version ? version[0] : null
                };
            }
        }
    ];

    // Enhanced CSS with collapsible badges
    const styles = `
    .resolution-badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 8px;
        font-weight: 600;
        margin-right: 8px;
        margin-bottom: 4px;
        border: none;
        font-size: 0.9em;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: pointer;
        position: relative;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        color: white;
    }

    /* Resolution-specific colors */
    .resolution-badge[data-quality="8K"] {
        background: linear-gradient(135deg, #9333EA, #7C3AED);
    }

    .resolution-badge[data-quality="4K"] {
        background: linear-gradient(135deg, #2563EB, #3B82F6);
    }

    .resolution-badge[data-quality="1080p"] {
        background: linear-gradient(135deg, #059669, #10B981);
    }

    .resolution-badge[data-quality="720p"] {
        background: linear-gradient(135deg, #D97706, #F59E0B);
    }

    .resolution-badge[data-quality="480p"] {
        background: linear-gradient(135deg, #DC2626, #EF4444);
    }

    /* Default color for other resolutions */
    .resolution-badge[data-quality="other"] {
        background: linear-gradient(135deg, #6B7280, #9CA3AF);
    }

    .main-badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 0;
    }

    .additional-badges {
        display: inline-flex;
        align-items: center;
        max-width: 0;
        opacity: 0;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;
    }

    .resolution-badge.expanded .additional-badges {
        max-width: 300px;
        opacity: 1;
        margin-left: 8px;
        padding-left: 8px;
        border-left: 1px solid rgba(255, 255, 255, 0.3);
    }

    .hdr-badge, .codec-badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 8px;
        border-radius: 6px;
        font-size: 0.8em;
        font-weight: 600;
        margin-left: 6px;
        letter-spacing: 0.02em;
        transform: translateX(-10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        background: rgba(255, 255, 255, 0.95);
        color: rgba(0, 0, 0, 0.8);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .resolution-badge.expanded .hdr-badge,
    .resolution-badge.expanded .codec-badge {
        transform: translateX(0);
    }

    .hdr-badge {
        transition-delay: 0.1s;
        border-left: 3px solid #F59E0B;
    }

    .codec-badge {
        transition-delay: 0.2s;
        border-left: 3px solid #3B82F6;
    }

    .resolution-badge:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
        filter: brightness(1.1);
    }

    .resolution-badge::after {
        content: "›";
        display: inline-block;
        margin-left: 6px;
        transition: transform 0.3s ease;
        opacity: 0.9;
        font-size: 1em;
        font-weight: 800;
        color: white;
    }

    .resolution-badge.expanded::after {
        transform: rotate(90deg);
    }

    .resolution-icon {
        margin-right: 6px;
        font-size: 0.9em;
        font-weight: 700;
        opacity: 0.95;
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 4px;
        border-radius: 4px;
        color: white;
    }

    .quality-tooltip {
        position: absolute;
        background: rgba(255, 255, 255, 0.98);
        color: #1a1a1a;
        padding: 14px 18px;
        border-radius: 12px;
        font-size: 0.9em;
        line-height: 1.6;
        z-index: 999999;
        visibility: hidden;
        opacity: 0;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        max-width: 300px;
        width: max-content;
        left: 50%;
        transform: translateX(-50%) translateY(5px);
        bottom: calc(100% + 12px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1),
                    0 5px 10px -5px rgba(0, 0, 0, 0.04);
        backdrop-filter: blur(10px);
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .resolution-badge:hover .quality-tooltip {
        visibility: visible;
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    .quality-tooltip::after {
        content: "";
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 12px;
        height: 12px;
        background: inherit;
        box-shadow: 4px 4px 8px -4px rgba(0, 0, 0, 0.1);
        z-index: -1;
    }

    .quality-tooltip > span {
        position: relative;
        padding-left: 18px;
        display: flex;
        align-items: center;
    }

    .quality-tooltip > span::before {
        content: "";
        position: absolute;
        left: 0;
        width: 6px;
        height: 6px;
        background: currentColor;
        border-radius: 50%;
        opacity: 0.6;
    }

    @media (prefers-color-scheme: dark) {
        .hdr-badge, .codec-badge {
            background: rgba(255, 255, 255, 0.9);
        }

        .quality-tooltip {
            background: rgba(30, 41, 59, 0.98);
            color: #e5e7eb;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3),
                        0 5px 10px -5px rgba(0, 0, 0, 0.2);
        }

        .resolution-badge {
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .resolution-badge:hover {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
        }

        .quality-tooltip::after {
            background: rgba(30, 41, 59, 0.98);
        }
    }

    @media (max-width: 768px) {
        .resolution-badge {
            padding: 3px 8px;
            font-size: 0.85em;
        }

        .additional-badges {
            max-width: none;
            width: 0;
        }

        .resolution-badge.expanded .additional-badges {
            width: auto;
            padding-left: 6px;
        }

        .hdr-badge, .codec-badge {
            font-size: 0.75em;
            padding: 2px 6px;
            margin-left: 4px;
        }

        .quality-tooltip {
            max-width: 250px;
            font-size: 0.85em;
            padding: 12px 16px;
        }
    }`;

    // Insert styles
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(styles);
    } else {
        const style = document.createElement('style');
        style.textContent = styles;
        document.documentElement.appendChild(style);
    }

    function extractQualityInfo(text) {
        const info = {
            audio: null,
            source: additionalPatterns.source.test(text) ? text.match(additionalPatterns.source)[0] : null,
            hdr: null,
            codec: null
        };

        // Check for HDR information
        for (const hdrType of hdrPatterns) {
            if (hdrType.pattern.test(text)) {
                info.hdr = {
                    type: text.match(hdrType.pattern)[0],
                    badge: hdrType.badge,
                    color: hdrType.color,
                    background: hdrType.background,
                    borderColor: hdrType.borderColor
                };
                break;
            }
        }

        // Check for codec information
        for (const codecType of codecPatterns) {
            if (codecType.pattern.test(text)) {
                info.codec = {
                    type: text.match(codecType.pattern)[0],
                    badge: codecType.badge,
                    color: codecType.color,
                    background: codecType.background,
                    borderColor: codecType.borderColor
                };
                break;
            }
        }

        // Check for audio information
        for (const audioPattern of audioPatterns) {
            const match = text.match(audioPattern.pattern);
            if (match) {
                const audioInfo = audioPattern.getInfo(match);
                info.audio = {
                    type: audioInfo.type,
                    version: audioInfo.version,
                    full: match[0]
                };
                break;
            }
        }

        return info;
    }

    function formatAudioInfo(audioInfo) {
        if (!audioInfo) return null;
        let audioText = `Audio: ${audioInfo.type}`;
        if (audioInfo.version) {
            audioText += ` ${audioInfo.version}`;
        }
        return audioText;
    }



function highlightResolution(title) {
    if (!isEnabled) {
        return false;
    }

    const originalText = title.textContent.trim();
    console.log('Processing title:', originalText);

    let matched = false;

    for (const {pattern, icon, quality, priority} of qualityPatterns) {
        const match = originalText.match(pattern);
        if (match) {
            console.log('Found match:', match[0], 'with pattern:', pattern);
            const resolution = match[1];
            const qualityInfo = extractQualityInfo(originalText);

            // Create main badge
            const badge = document.createElement('span');
            badge.className = 'resolution-badge';
            badge.setAttribute('data-quality', quality);

            // Create container for resolution text and icon
            const mainBadge = document.createElement('span');
            mainBadge.className = 'main-badge';
            mainBadge.innerHTML = `<span class="resolution-icon">${icon}</span>${resolution.toUpperCase()}`;

            // Create container for additional badges
            const additionalBadges = document.createElement('span');
            additionalBadges.className = 'additional-badges';

            // Add HDR badge if present
            if (qualityInfo.hdr) {
                const hdrBadge = document.createElement('span');
                hdrBadge.className = 'hdr-badge';
                hdrBadge.textContent = qualityInfo.hdr.badge;
                additionalBadges.appendChild(hdrBadge);
            }

            // Check saved state and apply it
            const isExpanded = getBadgeState(resolution.toUpperCase());
            if (isExpanded) {
                badge.classList.add('expanded');
            }

            // Add codec badge if present
            if (qualityInfo.codec) {
                const codecBadge = document.createElement('span');
                codecBadge.className = 'codec-badge';
                codecBadge.textContent = qualityInfo.codec.badge;
                additionalBadges.appendChild(codecBadge);
            }

            // Update the click handler
            badge.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();

                if (e.target.closest('.quality-tooltip')) {
                    return;
                }

                const isNowExpanded = !badge.classList.contains('expanded');
                badge.classList.toggle('expanded');
                saveBadgeState(resolution.toUpperCase(), isNowExpanded);
            });

            // Add these new handlers
            additionalBadges.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            });

            // Add protection for HDR and codec badges
            if (qualityInfo.hdr) {
                const hdrBadge = additionalBadges.querySelector('.hdr-badge');
                hdrBadge.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                });
            }

            if (qualityInfo.codec) {
                const codecBadge = additionalBadges.querySelector('.codec-badge');
                codecBadge.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                });
            }

            // Tooltip creation
            if (qualityInfo.audio || qualityInfo.source || qualityInfo.hdr || qualityInfo.codec) {
                const indicators = [];
                if (qualityInfo.hdr) indicators.push(`HDR: ${qualityInfo.hdr.type}`);
                if (qualityInfo.codec) indicators.push(`Codec/Encode: ${qualityInfo.codec.type}`);
                const audioInfo = formatAudioInfo(qualityInfo.audio);
                if (audioInfo) indicators.push(audioInfo);
                if (qualityInfo.source) indicators.push(`Source: ${qualityInfo.source}`);

                const tooltip = document.createElement('span');
                tooltip.className = 'quality-tooltip';
                tooltip.setAttribute('aria-describedby', `quality-tooltip-${priority}`);
                tooltip.innerHTML = indicators.map(text => `<span>${text}</span>`).join('');

                // Add to badge instead of body
                badge.appendChild(tooltip);
            }

            // Assemble the badge
            badge.appendChild(mainBadge);
            badge.appendChild(additionalBadges);

            // Update the title text with proper spacing
            let newText = originalText;
            const matchStart = originalText.indexOf(match[0]);
            const matchEnd = matchStart + match[0].length;

            const hasSpaceBefore = matchStart > 0 && originalText[matchStart - 1] === ' ';
            const hasSpaceAfter = matchEnd < originalText.length && originalText[matchEnd] === ' ';

            if (hasSpaceBefore && hasSpaceAfter) {
                newText = originalText.slice(0, matchStart) + ' ' + originalText.slice(matchEnd).trim();
            } else if (hasSpaceBefore) {
                newText = originalText.slice(0, matchStart) + originalText.slice(matchEnd).trim();
            } else if (hasSpaceAfter) {
                newText = originalText.slice(0, matchStart).trim() + ' ' + originalText.slice(matchEnd).trim();
            } else {
                newText = originalText.slice(0, matchStart).trim() + ' ' + originalText.slice(matchEnd).trim();
            }

            title.textContent = newText.trim();
            title.insertBefore(badge, title.firstChild);
            title.setAttribute('data-processed', 'true');
            matched = true;
            break;
        }
    }

    if (!matched) {
        console.log('No match found for title:', originalText);
    }

    return matched;
}

    // Process queue for better performance
    const processQueue = new Set();
    let isProcessing = false;

    function processNextBatch() {
        if (processQueue.size === 0) {
            isProcessing = false;
            return;
        }

        isProcessing = true;
        const batch = Array.from(processQueue).slice(0, 10);

        batch.forEach(title => {
            processQueue.delete(title);
            highlightResolution(title);
        });

        if (processQueue.size > 0) {
            requestAnimationFrame(processNextBatch);
        } else {
            isProcessing = false;
        }
    }

    function queueForProcessing(titles) {
        titles.forEach(title => processQueue.add(title));

        if (!isProcessing) {
            requestAnimationFrame(processNextBatch);
        }
    }

    // Initialize processing
    function init() {
        if (!isEnabled) {
            return;
        }
        const titles = document.querySelectorAll('.torrent-search--grouped__name a:not([data-processed])');
        if (titles.length > 0) {
            queueForProcessing(titles);
        }
    }

    // Optimized mutation observer with debouncing
    let observerTimeout;
    const observer = new MutationObserver((mutations) => {
        if (!isEnabled) {
            return;
        }

        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            const titles = document.querySelectorAll('.torrent-search--grouped__name a:not([data-processed])');
            if (titles.length > 0) {
                queueForProcessing(titles);
            }
        }, 100);
    });

    // Start observing once DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        init();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    // Reinitialize on AJAX navigation
    window.addEventListener('popstate', init);
    window.addEventListener('pushState', init);
    window.addEventListener('replaceState', init);

    // Add feature toggle event listeners
    window.addEventListener('enableResolutionHighlighter', function() {
        isEnabled = true;
        init();
        // Ensure observer is still active
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });

    window.addEventListener('disableResolutionHighlighter', function() {
        isEnabled = false;
        // Disconnect observer when disabled
        observer.disconnect();
        // Remove all existing badges
        document.querySelectorAll('.resolution-badge').forEach(badge => {
            const title = badge.closest('.torrent-search--grouped__name a');
            if (title) {
                title.removeAttribute('data-processed');
            }
            badge.remove();
        });
    });
})();
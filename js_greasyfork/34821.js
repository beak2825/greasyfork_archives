// ==UserScript==
// @name            InstaMagnify: Instagram Media Downloader
// @namespace       SteveJobzniak
// @version         4.0.0
// @description     Best! Greatly enhance your Instagram navigation experience! And magically view or download the highest-quality, largest versions of Instagram stories, albums, images/photos, videos and profile avatars. If you have ever wanted to save a story, album, image/photo, video or avatar, then this is for you!
// @author          SteveJobzniak
// @homepage        https://greasyfork.org/scripts/34821-instamagnify-instagram-media-downloader
// @license         https://www.apache.org/licenses/LICENSE-2.0
// @contributionURL https://www.paypal.me/Armindale/0usd
// @match           *://*.instagram.com/*
// @run-at          document-start
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/34821/InstaMagnify%3A%20Instagram%20Media%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/34821/InstaMagnify%3A%20Instagram%20Media%20Downloader.meta.js
// ==/UserScript==

/*
 * # What is InstaMagnify?
 *
 * It's your portal to the highest-quality, largest versions of Instagram stories, albums, photos,
 * videos and profile avatars!
 *
 * By default, Instagram only shows you low-quality media. But by installing this utility, you'll get the
 * magical ability to easily _view_ or _download_ the largest and best looking versions of _any_ media!
 *
 * Liberation!
 *
 * But wait... _that's not all!_ You will _also_ discover that all profile pages (timelines) will be
 * enhanced with a loading indicator in the bottom right corner of the window, which shows you how much
 * of the media has been loaded by your scrolling so far, such as `"36 / 628 (5.7%)"`. You'll no longer
 * have to keep wondering how much further you have to scroll to reach the end of the timeline! ;-)
 *
 * _And_ to make your life _even easier_, it will _automatically_ click the "Load more" button for you,
 * so that you can effortlessly scroll and scroll and scroll and view and download media and... :-)
 *
 * Have fun and enjoy!
 *
 * # Features.
 *
 * - The most advanced code of all Instagram-related userscripts, written by the author of the
 *   largest 3rd party Instagram API library in the world.
 * - View or download the highest-quality, largest versions of Instagram stories, albums,
 *   photos, videos and profile avatars.
 * - Displays a timeline media scrolling progress indicator in the bottom right corner of all timelines.
 * - Automatically clicks on all "Load more" buttons so that you can effortlessly scroll through media.
 * - Automatically closes the annoying "Get the mobile app!" popup dialog which Instagram shows to some people.
 * - Automatically closes the even more annoying "Sign up for Instagram!" bar which is shown whenever you aren't logged in.
 * - Automatically closes the "Experience the best version of Instagram by getting the app" bar which is shown after logging in.
 * - Supports protected (signed) media URLs, such as those used by stories.
 * - Supports _all_ Instagram media types and media view-panels.
 * - Your choice of convenient mouse and/or keyboard controls, whichever you prefer the most. :-)
 *
 * # Feel like thanking me for my hard work?
 *
 * Totally optional but _truly, deeply_ appreciated and brings a great smile to my face,
 * and inspires me to keep working. ;-)
 *
 * - PayPal: https://www.paypal.me/Armindale/0usd
 * - Bitcoin: 18XF1EmrkpYi4fqkR2XcHkcJxuTMYG4bcv
 *
 * And if you really like this utility, please consider giving it a good rating by simply
 * adding it to your GreasyFork favorites.
 *
 * # Instructions.
 *
 * Simply hold down a modifier key and click on any Instagram photo, video or profile avatar!
 *
 * - `Shift-click`: View in the same tab.
 * - `Alt-click`: View in a new tab/window.
 * - `Shift-Alt-click`: Direct download (only if your browser supports it).
 *
 * Alternatively, you can use the keyboard controls, which are definitely a lot more convenient
 * if you're already using Instagram's own `left`/`right`-arrow navigation to switch between media!
 *
 * - `Shift-F`: View in the same tab.
 * - `Alt-F`: View in a new tab/window.
 * - `Shift-Alt-F`: Direct download (only if your browser supports it).
 *
 * If you ever forget the commands, simply hover your mouse cursor over the media loading indicator
 * in the bottom right corner of each timeline, and you'll see a tooltip with all of these commands.
 *
 * Note that the "direct download" feature requires a browser which supports the modern HTML 5
 * "download" tag, such as Google Chrome and Safari!
 *
 * You should also note that _your web browser's_ "how to open new windows"-preference controls
 * whether the "View in a new tab/window" action will open a tab or a window. Browsers _don't_
 * give scripts any control over that choice. Which means that you have to _change your browser
 * settings_ if you want to specifically choose which window-type you're using.
 *
 * Lastly, it's worth noting that you can actually click on media directly on the timeline grid
 * (not just on their media pages/media lightboxes). However, if you click via the timeline grid,
 * you will _only_ be able to see the first image in case of albums or the thumbnail for videos,
 * since the rest of the media details haven't been loaded when you haven't opened its media page.
 * And you _may_ not get the highest-resolution media via this method (the best quality is only
 * _guaranteed_ when you've clicked on the media to view it properly). But this ability to open media
 * directly from the timeline is still a _great_ shortcut which is definitely worth knowing about.
 * Have fun!
 *
 * # Want to check out my other work?
 *
 * - [GreasyFork Scripts](https://greasyfork.org/users/67112-stevejobzniak)
 * - [GitHub](https://github.com/SteveJobzniak)
 *
 */
(function() {
    'use strict';

    var injectMediaMagnifier = function() {
        // Perform the user's desired action on a media URL.
        var handleMedia = function(e, url) {
            var i;

            // Do nothing if the URL isn't a string or if it's empty.
            if (typeof url !== 'string' || url.length < 1) {
                return true; // Let the default browser handler run.
            }

            // Create an anchor to allow us to easily manipulate the URL.
            var anchor = document.createElement('a');
            anchor.href = url;

            // Determine if this is a protected (signed) media URL which is NOT allowed to be modified.
            var isProtectedUrl = !!(anchor.pathname.match(/\/vp\//) || anchor.search.match(/[?&](?:oh|oe|efg)=/));

            // Attempt to extract the media filename from the URL that we've been given.
            var filename = null,
                filenameOffset = anchor.pathname.lastIndexOf('/');
            if (filenameOffset >= 0) {
                filename = anchor.pathname.substring(filenameOffset + 1);
                if (filename.length < 1) {
                    filename = null;
                }
            }

            // Always enforce HTTPS for download integrity (protects against sudden truncation).
            anchor.protocol = 'https:';

            // Remove useless "se=7", "ig_tt=..." and "ig_cache_key=..." query-params if they exist.
            // NOTE: We can't just remove the entire query, since some media requires
            // special protection keys to allow the download to proceed.
            if (typeof anchor.search === 'string' && anchor.search.length > 0) {
                var queryParts = anchor.search.split('&');
                for (i = queryParts.length - 1; i >= 0; --i) {
                    if (queryParts[i].match(/^\??(?:ig_cache_key|se|ig_tt)=/)) {
                        queryParts.splice(i, 1);
                    }
                }
                var newQuery = queryParts.join('&');
                if (newQuery.length > 0 && newQuery.charAt(0) !== '?') {
                    newQuery = '?'+newQuery; // Only added if a search query still exists.
                }
                anchor.search = newQuery;
            }

            // Clean up the URL's PATH (via the anchor) to get the unmodified, highest quality media file:
            // NOTE: Protected URLs do not allow modifying ANY part of the PATH to the file.
            if (!isProtectedUrl) {
                // Remove bad flags that would cause us to retrieve modified media.
                //
                // KEEP:
                // - /t#.#-#/ = Media type flag. Is REQUIRED for stories.
                //
                // DELETE:
                // - /e#/ = Sets EXIF "FBMD" tag.
                // - /c#.#.#.#/ = Image cropping.
                // - /s#x#/ and /p#x#/ = Image downsizing.
                // - /sh#.#/ = Image sharpening.
                // - /fr/ = "Fine Resolution"? Not sure, but causes JPG artifacts.
                var flags = anchor.pathname.split('/');
                //flags.splice(flags.length - 1, 1); // Optional: Remove filename to avoid parsing as flag.
                for (i = flags.length - 1; i >= 0; --i) {
                    if (flags[i].length > 0 && flags[i].match(/^(?:e\d+|c\d+\.\d+\.\d+\.\d+|[sp]\d+x\d+|sh\d+\.?\d*|fr)$/)) {
                        flags.splice(i, 1);
                    }
                }
                //anchor.pathname = flags.join('/')+'/'+filename; // Optional: Re-add filename.
                anchor.pathname = flags.join('/');
            }

            // The final URL is now in "anchor.href".

            // Perform appropriate action based on the pressed modifier keys.
            if (e.shiftKey && e.altKey) { // [Shift+Alt]: Download.
                if (!window.fetch) {
                    // Turn the anchor into a download-anchor and just click it.
                    // NOTE: This HTML 5 feature won't work in all browsers, and in fact CORS has been
                    // disabled in Chrome 65+ due to security, which isn't unexpected since all other
                    // browsers such as Safari already prevented cross-origin "download"-attr links.
                    anchor.target = '_self';
                    anchor.download = filename; // Save with bare filename.
                    anchor.click();
                } else {
                    // The browser supports window.fetch(). Perform asynchronous blob-based download.
                    // Docs: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
                    // NOTE: Browsers support up to around 500MB blobs. The largest Instagram
                    // media I've ever found was a 14MB video. Most videos are around 1-2MB.
                    window.fetch(anchor.href, {
                        headers: new Headers({
                            'Origin': location.origin
                        }),
                        mode: 'cors',
                        redirect: 'follow',
                        referrerPolicy: 'no-referrer',
                        // NOTE: Safari sucks at CORS caching and will re-fetch the URL every time.
                        // But Chrome on the other hand caches the downloaded file perfectly.
                        cache: 'force-cache' // https://fetch.spec.whatwg.org/#concept-request-cache-mode
                    }).then(function(response) {
                        // This triggers immediately when the headers are received (before the body).
                        // NOTE: There's no way to show the user the download progress (unlike normal
                        // download URLs which end up in a browser's download list and show progress
                        // that way), but most media files are tiny and finish quickly.
                        if (!response.ok || response.status !== 200) {
                            throw new Error('Network response was not ok.');
                        }
                        return response.blob();
                    }).then(function(blob) {
                        // This triggers when the download is 100% complete.
                        var blobUrl = URL.createObjectURL(blob),
                            a = document.createElement('a');
                        // Download the blob URL via an anchor. And since a `blob:` URL doesn't
                        // violate the CORS destination rules, this works in all modern browsers.
                        // Verified browsers: Safari and Google Chrome.
                        a.href = blobUrl;
                        a.download = filename;
                        a.click();
                    }).catch(function(e) {
                        var errMsg = '"'+e+'" when downloading "'+filename+'".';
                        console.error(errMsg);
                        alert(errMsg);
                    });
                }
            } else if (e.altKey) { // [Alt]: Open in a new tab/window.
                var win = window.open(anchor.href, '_blank');
                win.focus(); // Bring the tab/window to the foreground.
            } else { // [Shift/Nothing/Anything Else]: Open in the same tab.
                location.href = anchor.href;
            }

            // Stop the event propagation so that nothing else runs.
            // And since our event handler is a capture (runs before the target element),
            // it means that this will prevent navigation to the clicked webpage, if any.
            e.stopPropagation(); // Prevent parent element event handlers from firing.
            e.stopImmediatePropagation(); // Prevent any further event handlers on the event-element from firing.
            e.preventDefault(); // Prevent default browser behavior for this event.
            return false;
        };

        // Process a media element or container (from the event handlers).
        var handleElement = function (e, elem, isLastAttempt) {
            switch (elem.tagName) {
                case 'IMG':
                case 'VIDEO':
                case 'DIV':
                case 'A':
                    // IMG: profile avatars (on both timeline and media page).
                    // VIDEO: not used, but is here to be futureproof.
                    // DIV: photos/album photos on media page and timeline, video thumbs on timeline.
                    // A: videos/album videos on media page.

                    // Determine which element to scan, and then look for photos and videos.
                    // NOTE: Instagram puts the actual media page content as a sibling of the A/DIV
                    // (within their mutual parent node), which is why we must get the parent.
                    // And in case of albums, there's only 1 media item at a time (they dynamically
                    // switch its contents to only have one IMG or VIDEO element at a time).
                    var elemIsMedia = (elem.tagName === 'IMG' || elem.tagName === 'VIDEO'),
                        mediaContainer = (elemIsMedia ? elem : (elem.parentNode || elem)),
                        photos = (mediaContainer.tagName === 'IMG' ? [mediaContainer] : (elemIsMedia ? [] : mediaContainer.getElementsByTagName('img'))),
                        videos = (mediaContainer.tagName === 'VIDEO' ? [mediaContainer] : (elemIsMedia ? [] : mediaContainer.getElementsByTagName('video')));

                    // Only handle the media if there's exactly 1 video or 1 photo.
                    if (videos.length === 1 && photos.length === 0) {
                        // NOTE: Some videos use the `src` attribute. Others (notably stories) use child `<source>` elements instead.
                        var src = videos[0].hasAttribute('src') ? videos[0].src : null;
                        if (typeof src !== 'string' || src.length < 1) {
                            // If there are multiple sources, they're listed in descending quality (the first element is the best).
                            // NOTE: There's absolutely NOTHING else (no attributes, etc) which indicates which file is the best one.
                            var subSources = videos[0].getElementsByTagName('source');
                            for (var i = 0; i < subSources.length; ++i) {
                                if (subSources[i].hasAttribute('src') && typeof subSources[i].src === 'string' && subSources[i].src.length >= 1) {
                                    src = subSources[i].src;
                                    break; // Stop searching through sources.
                                }
                            }
                        }
                        return handleMedia(e, src);
                    } else if (photos.length === 1 && videos.length === 0) {
                        // NOTE: Many images also have a "srcset" attribute with multiple URLs, but we just need the current "src".
                        return handleMedia(e, photos[0].src);
                    } else if (!isLastAttempt) {
                        // If we didn't find anything, the user may have clicked on a story photo/video. Those have their media within TWO parent elements
                        // rather than one. So by simply retrying once (as a "last attempt"), we will now traverse one step higher and find the media.
                        return handleElement(e, mediaContainer, true);
                    }
            }

            return true; // Let the default browser handler run if no valid media was found.
        };

        // Attach the click event handler.
        document.addEventListener('click', function(e) {
            e = e || window.event;

            // Do nothing if none of our special keys are held while clicking.
            if (!e.shiftKey && !e.altKey) {
                return true; // Let the default browser handler run.
            }

            // Handle the click.
            var target = e.target || e.srcElement;

            return handleElement(e, target);
        }, true); // True = Capture BEFORE sending any click-event to the clicked element!

        // Attach the keyboard event handler.
        document.addEventListener('keydown', function(e) {
            e = e || window.event;

            // Do nothing if the user is typing in a text field.
            if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) {
                return true; // Let the default browser handler run.
            }

            // Look for any combination of Alt/Shift together with F.
            if ((e.shiftKey || e.altKey) && e.keyCode === 70) {
                // Find the media viewer and the currently viewed media.
                // NOTE: This is the most likely piece of code which may need future updates.
                // It catches all current Instagram media viewers: Lightbox media viewer,
                // whole-page media viewer, and the lightbox story media viewer. However,
                // they're all part of very complex HTML structures without many CSS landmarks,
                // so this may break whenever Instagram decides to change their website HTML.
                // But it's the best that we can do... Either way, the click-method always
                // remains extremely resilient, so users won't be stranded even if this
                // keyboard method stops working someday... ;-)
                var mediaPanel = document.querySelector(
                    'div[role="dialog"] article > div:nth-of-type(1), main[role="main"] > * article > div:nth-of-type(1), #react-root > section > div > div > section > div:nth-of-type(2)'
                );
                if (mediaPanel) {
                    var video = mediaPanel.querySelector('video'),
                        photo = mediaPanel.querySelector('img'),
                        target = (video ? video : (photo ? photo : null));
                    if (target) {
                        return handleElement(e, target);
                    }
                }
            }

            return true; // Let the default browser handler run if no valid keypress or no media.
        }, true); // True = Capture BEFORE sending any typing-event to the active element.
    };

    var injectMediaCounter = function() {
        // Section state class.
        var SectionState = function(section) {
            this.section = section;
            this.loadedMediaIds = new Set();
            this.loadedCount = -1;
            this.totalCount = -1;
            // Detect the section's media box element, which holds the rows of media. Each child of it is a 3-media row.
            // NOTE: This selector will need future maintenance if the site design changes.
            this.mediaBoxElem = section ? section.querySelector('main > article > div > div:nth-of-type(1)') : null;
        };

        // Updates the total media (timeline post) count for the section element (profile page).
        SectionState.prototype.updateTotalMediaCount = function() {
            // NOTE: This path will need future maintenance if it ever changes.
            // NOTE: Media count also exists in `window._sharedData.entry_data.ProfilePage[0].user.media.count`,
            // but that value sadly *never* changes when navigating dynamically to other profiles!
            // NOTE: We look for the language-independent header's <ul> of 3x <li> elements (posts, followers,
            // following). It contains nested <span> elements, one of which (the last one) is the pure number of posts.
            var mediaCountSpans = this.section.querySelectorAll('header ul > li:nth-of-type(1) span');
            for (var i = mediaCountSpans.length - 1; i >= 0; --i) { // Count backwards, since the one we want is at the end.
                // Clean up the count by stripping away thousands-separators (spaces, commas, etc depending on language).
                var count = mediaCountSpans[i].textContent.replace(/[^0-9]+/g, '');
                if (count.length > 0) {
                    try {
                        count = parseInt(count, 10);
                        if (Number.isInteger(count)) { // Guard against NaN.
                            this.totalCount = count;
                            return;
                        }
                    } catch (e) {}
                }
            }

            this.totalCount = 0; // If count doesn't exist or couldn't be parsed.
        };

        // Updates the loaded media count for the section's media box, and clamps so it never exceeds the total.
        SectionState.prototype.updateLoadedMediaCount = function() {
            // Instagram uses a dynamic set of media "divs", and only keeps ~50 in memory (for infinite-scroll efficiency).
            // Therefore, the only way to detect the load progress is to count how many unique IDs we've seen in them.
            var count = 0;
            if (this.mediaBoxElem) {
                var mediaLinks = this.mediaBoxElem.querySelectorAll('a[href^="/p/"]');
                for (var i = 0, len = mediaLinks.length; i < len; ++i) {
                    this.loadedMediaIds.add(mediaLinks[i].pathname); // Format: "/p/<id>/".
                }

                count = this.loadedMediaIds.size;
                if (count > this.totalCount) {
                    count = this.totalCount; // Ensure that it can never exceed the total.
                }
            }

            this.loadedCount = count;
        };

        // Media counter class.
        var MediaCounter = function() {
            // Initialize properties.
            this.currentProfile = this.extractProfileName(location.pathname);
            this.activeState = null;
            this.counterElem = null;
            this.isCounterVisible = false;
            this.updateCooldownTimer = undefined;

            // Attach handlers and create initial state.
            this.createCounterElem();
            this.attachReactRootObserver();
            this.startWatchingPathname();
        };

        // Creates the media counter element.
        MediaCounter.prototype.createCounterElem = function() {
            // Create a floating container in the bottom right of the page.
            var floatContainer = document.createElement('div');
            floatContainer.style.position = 'fixed';
            floatContainer.style.bottom = 0;
            floatContainer.style.right = 0;
            floatContainer.style.zIndex = '99999';

            // Add a nicely styled "media counter" container within the floating container.
            var counterElem = document.createElement('div');
            counterElem.style.margin = '14px'; // Offsets it from the edges.
            counterElem.style.padding = '5px 10px'; // Empty padding around everything in the container.
            counterElem.style.backgroundColor = 'rgba(60,60,60,0.5)';
            counterElem.style.borderRadius = '15px';
            counterElem.style.font = 'bold 13px sans-serif';
            counterElem.style.color = '#fff';
            counterElem.style.textAlign = 'center';
            counterElem.style.textShadow = '1px 1px 2px rgba(0,0,0,0.3)';
            counterElem.style.display = 'none'; // Start out hidden.
            counterElem.title = 'Shift-[click/F]: View in the same tab.\nAlt-[click/F]: View in a new tab/window.\nShift-Alt-[click/F]: Direct download.';
            floatContainer.appendChild(counterElem);

            // Put the floating counter as a child of the body itself.
            // NOTE: We don't put it inside of any specific elements, to remain fully markup-agnostic.
            document.body.appendChild(floatContainer);

            this.counterElem = counterElem;
        };

        // Extracts the profile name from a Location pathname.
        MediaCounter.prototype.extractProfileName = function(pathname) {
            if (typeof pathname === 'string') {
                // NOTE: We demand a single word (as in a profile), such as "/foo/",
                // not "/foo/bar". That avoids most of the custom pages (such as
                // "/accounts/login/"). We'll also avoid "/developer/".
                var match = pathname.match(/^\/([^\/]+)\/?$/); // Extracts at least 1 char.
                if (match) {
                    var profile = match[1];
                    if (profile !== 'developer') {
                        return profile;
                    }
                }
            }

            return null;
        };

        // Watches for navigation between the profile and media overlays, and hides counter during overlays.
        // NOTE: We can't use HTML5 popstate events for this. They are too unreliable. We must use a timer.
        MediaCounter.prototype.startWatchingPathname = function() {
            var self = this,
                currentPathname = null;
            setInterval(function() {
                // Detects when we've moved to a different path on the site.
                if (location.pathname !== currentPathname) {
                    currentPathname = location.pathname;

                    // Toggle the counter visibility depending on which page we are on.
                    // NOTE: We only unhide the counter if it already contains a value *and* we're still on the same profile!
                    var profile = self.extractProfileName(currentPathname);
                    if (profile !== null) { // On a profile page.
                        if (profile === self.currentProfile && self.counterElem.textContent !== '') { // Same profile, and has existing counter.
                            self.toggleMediaCounterVisibility(true);
                        } else { // Different profile, or has no counter value.
                            // NOTE: We don't hide it when navigating to a different profile. Because that's handled instantly by our react-root observer.
                            self.currentProfile = profile; // Track the new profile instead.
                        }
                    } else { // On a non-profile page, such as media instead.
                        self.toggleMediaCounterVisibility(false);
                    }
                }
            }, 250);
        };

        // Toggles the media counter visibility whenever we're on a non-timeline page (or overlay).
        MediaCounter.prototype.toggleMediaCounterVisibility = function(showCounter) {
            if (showCounter !== this.isCounterVisible) {
                this.counterElem.style.display = showCounter ? 'block' : 'none';
                this.isCounterVisible = !!showCounter;
            }
        };

        // Updates the media counter to the currently loaded count, and ensures that the counter is visible.
        MediaCounter.prototype.updateMediaCounter = function(forceUpdateTotal) {
            if (!this.activeState) {
                return;
            }

            // Update internal state to current count.
            if (forceUpdateTotal || this.activeState.totalCount < 0) {
                this.activeState.updateTotalMediaCount(); // Must be updated before loaded count.
            }
            this.activeState.updateLoadedMediaCount();

            // Set the new media counter text.
            var percentLoaded = this.activeState.totalCount > 0 ? ((this.activeState.loadedCount / this.activeState.totalCount) * 100) : 0; // No 0-div.
            percentLoaded = percentLoaded.toFixed(1); // Convert to string with rounding and always 1 decimal.
            this.counterElem.textContent = this.activeState.loadedCount+' / '+this.activeState.totalCount+' ('+percentLoaded+'%)';

            // Make sure counter is visible if we're on a profile page, or hidden otherwise.
            this.toggleMediaCounterVisibility(this.extractProfileName(location.pathname) !== null);
        };

        // Adds mutation observer to section. Observes changes in the rows of media items.
        // NOTE: They trigger once per inserted row and insert 4 rows at once, so we use a slight
        // "cooldown" timer before we react, to avoid triggering rapid DOM (counter) updates.
        MediaCounter.prototype.observeSection = function(section) {
            // Create and initialize a blank state for this section.
            // NOTE: This is always okay (and fast) even if we already had a state for it,
            // because the counter updater always refreshes the state's counts on update.
            var state = new SectionState(section);

            // Abort if this section didn't contain a media box.
            // NOTE: This happens due to things like visiting a timeline, then going to the main timeline
            // which is also loaded as a <section> in the "react-root" just like regular pages.
            if (!state.mediaBoxElem) {
                // Erase the active state and hide the counter, since we've navigated away from the old section.
                this.activeState = null;
                this.toggleMediaCounterVisibility(false);
                return; // Abort.
            }

            // Make our (the last-called) state the new "active" state.
            this.activeState = state;

            // New profile/state. Force counter update (including new totals).
            this.updateMediaCounter(true);

            // Remove any old (outdated / old state) observer from this section, just in case any still exists.
            this.unobserveSection(section);

            // Add a new mutation observer on the section's media box.
            var self = this,
                config = { attributes: false, childList: true, characterData: false },
                observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList') {
                            clearTimeout(self.updateCooldownTimer);
                            self.updateCooldownTimer = setTimeout(function() {
                                // Update to our new count, but only if we (this section/media box) are the counter's active state.
                                if (state === self.activeState) {
                                    self.updateMediaCounter();
                                }
                            }, 150); // Wait 150ms before we perform the update.
                        }
                    });
                });
            observer.observe(state.mediaBoxElem, config);

            // Attach the observer property, so that we can disconnect it later.
            section.instaMagnifyObserver = observer;
        };

        // Remove mutation observer from section.
        MediaCounter.prototype.unobserveSection = function(section) {
            if (section.instaMagnifyObserver) {
                section.instaMagnifyObserver.disconnect();
                delete section.instaMagnifyObserver;
            }
        };

        // Observes node additions/deletions within the react-root.
        MediaCounter.prototype.attachReactRootObserver = function() {
            var self = this,
                interestingChanges = ['addedNodes', 'removedNodes'],
                config = { attributes: false, childList: true, characterData: false },
                observer = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        // When the "react-root" gets a new <section> element, it means we've navigated to a different profile.
                        // NOTE: It can also mean that we've visited the "/accounts/login/" page and other similar ones.
                        if (mutation.type === 'childList') {
                            for (var i = 0; i < interestingChanges.length; ++i) {
                                var field = interestingChanges[i];
                                for (var x = 0, len = mutation[field].length; x < len; ++x) {
                                    var node = mutation[field][x];
                                    if (node.tagName === 'SECTION') {
                                        if (field === 'addedNodes') {
                                            self.observeSection(node);
                                        } else {
                                            self.unobserveSection(node);
                                        }
                                    }
                                }
                            }
                        }
                    });
                });

            // Only begin observing if we're on a React-based page.
            var reactRootElem = document.querySelector('span#react-root');
            if (reactRootElem) {
                observer.observe(reactRootElem, config);

                // Set its current section (if any) as the observed section.
                var children = reactRootElem.childNodes;
                for (var i = 0; i < children.length; ++i) {
                    var node = children[i];
                    if (node.tagName === 'SECTION') {
                        self.observeSection(node);
                    }
                }
            }
        };

        // Create the media counter.
        var mediaCounter = new MediaCounter();
    };

    var injectAutoActions = function() {
        var autoLoadMore = function() {
            // Do nothing until the user has scrolled at least 500 pixels down (roughly
            // the 1st row of media disappearing behind the top bar of the browser window).
            // NOTE: This simply ensures that we don't waste people's internet bandwidth
            // by loading pages when they don't even scroll through the profile's media.
            if (window.pageYOffset <= 500) {
                return;
            }

            // Look for the first "Load more" button we can find, and click it. The button will vanish when clicked,
            // which means that we won't find anything until another button appears, which is great for performance.
            // NOTE: This selector is incredibly specific for performance, to avoid scanning all links.
            // In fact, just the `article > div > a` is enough to find the link. *That's* how specific it is!
            var loadMore = document.querySelectorAll('article > div > a[href*="max_id="]');
            for (var i = 0; i < loadMore.length; ++i) {
                // NOTE: We look for a "/name/" path (a single path component) or "/explore/*" (places), with a query string that has "max_id=" in its parameters.
                // We can't verify by looking for any language-specific strings such as "Load more", since Instagram is multilingual.
                if (loadMore[i].pathname.match(/^\/(?:[^\/]+\/$|explore\/)/) && loadMore[i].search.match(/[?&]max_id=/)) {
                    loadMore[i].click();
                    break;
                }
            }
        };

        var autoCloseMobileAppDialog = function() {
            // The "Experience the best version of Instagram by getting the mobile app" modal dialog box
            // only appears when `#reactivated` is in the URL hash. Which means at least 11 characters.
            // NOTE: Only some accounts get this dialog. It doesn't seem related to whether the mobile app has
            // been used by the account, because new accounts that haven't used the mobile app don't get it.
            // It seems to be something about legacy accounts being "reactivated" after a long time, and
            // them having never used the official apps...
            if (location.hash.length < 11) {
                return;
            }

            // Proceed if we see the `#reactivated` hash.
            if (location.hash.indexOf('reactivated') >= 0) {
                // Clear the hash. Instagram doesn't use the hash for anything important, so we'll just
                // remove all of its contents and set it to `#` (empty hash). If we don't remove the hash,
                // the popup dialog box will keep re-appearing after the user watches a homepage story...
                location.hash = '';

                // Help the user quickly close the popup box...
                var isClosed = false,
                    closeMobileAppDialog = function() {
                        if (isClosed) {
                            return;
                        }
                        var dialogs = document.querySelectorAll('div[role="dialog"]');
                        for (var i = 0; i < dialogs.length; ++i) {
                            var appStoreLink = dialogs[i].querySelector('a[href*="itunes.apple.com"]');
                            if (appStoreLink) {
                                // The dialog has multiple close buttons. It doesn't matter which we use. Get the first one.
                                var closeButton = dialogs[i].querySelector('button');
                                if (closeButton) {
                                    closeButton.click();
                                    isClosed = true;
                                }
                            }
                        }
                    };
                closeMobileAppDialog();
                if (!isClosed) {
                    var attempt = 0,
                        closeDialogInterval = setInterval(function() {
                            // Allow up to 30 retries (takes 7.5 seconds at 250ms each).
                            if (isClosed || ++attempt > 30) {
                                clearInterval(closeDialogInterval);
                                return;
                            }
                            closeMobileAppDialog();
                        }, 250);
                }
            }
        };

        var autoCloseAnnoyingBars = function() {
            var i, elem, elems;

            // First handle their black, modern, semi-transparent "signup" bar... This is the one they show most often.
            var signupBar = document.querySelector('div.coreSpriteLoggedOutGenericUpsell');
            if (signupBar) {
                var closeButton = signupBar.parentNode.parentNode.querySelector('.coreSpriteDismissLarge[role="button"]');
                if (closeButton)
                    closeButton.click();
            }

            // Also handle their white, old-school, opaque "Sign up to see photos from your friends" alternative bar...
            var whiteBar = document.querySelector('.coreSpriteGlyphGradient');
            if (whiteBar) {
                var signupLink = whiteBar.parentNode.parentNode.parentNode.parentNode.querySelector('a[href*="signup"]');
                if (signupLink) {
                    elems = signupLink.parentNode.parentNode.childNodes;
                    for (i = elems.length - 1; i >= 0; --i) {
                        elem = elems[i];
                        if (elem.tagName === 'SPAN' && elem.textContent === '✕') { // We check this to be 100% sure we've found it.
                            elem.click();
                            break;
                        }
                    }
                }
            }

            // Lastly, handle their "Experience the best version of Instagram by getting the app." bar, which is at the bottom when logged in.
            var getAppBar = document.querySelector('.coreSpriteAppIcon');
            if (getAppBar) {
                var appStoreLink = getAppBar.parentNode.parentNode.querySelector('a[href*="itunes.apple.com"]');
                if (appStoreLink) {
                    elems = appStoreLink.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes;
                    for (i = elems.length - 1; i >= 0; --i) {
                        elem = elems[i];
                        if (elem.tagName === 'SPAN' && elem.textContent === '✕') { // We check this to be 100% sure we've found it.
                            elem.click();
                            break;
                        }
                    }
                }
            }
        };

        // Perform the automatic actions at regular intervals.
        // NOTE: They are optimized to be fast when there's nothing to do.
        setInterval(function() {
            autoLoadMore();
            autoCloseMobileAppDialog();
            autoCloseAnnoyingBars();
        }, 400);
    };

    // Inject the code...
    var injectHandlers = function() {
        injectMediaMagnifier();
        injectMediaCounter();
        injectAutoActions();
    };
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        injectHandlers();
    } else {
        var hasInjected = false;
        document.addEventListener('readystatechange', function(evt) {
            if (document.readyState === 'interactive' || document.readyState === 'complete') {
                if (!hasInjected) {
                    injectHandlers();
                    hasInjected = true;
                }
            }
        } );
    }
})();
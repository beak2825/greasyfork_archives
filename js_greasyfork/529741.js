// ==UserScript==
// @name         FGUpcomingRepackImproveTolstoyUI
// @namespace    http://tampermonkey.net/
// @version      2025-04-21-0.3.4
// @description  Cuz Tolstoy is sux, I try to unsux it!
// @homepageURL  https://rentry.co/fgupcomingrepack-cleanify-script
// @author       Anon
// @match        https://fitgirl-repacks.site/*
// @match        https://web.tolstoycomments.com/widget/index.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fitgirl-repacks.site
// @run-at       document-idle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/529741/FGUpcomingRepackImproveTolstoyUI.user.js
// @updateURL https://update.greasyfork.org/scripts/529741/FGUpcomingRepackImproveTolstoyUI.meta.js
// ==/UserScript==

/*
### Changelogs
- v0.2.1: Initial Release, basic UI improvements:
  - Smaller easier to read font size
  - Chat bubble border
  - Make Tolstoy's floating header-nav bar visible on Desktop view (it was invisible due to overlayed by FG's site header)
  - Slightly bigger top-left (Back) buttons, for easier click target
  - Show the replied comment text in a block-quote style on each reply-comments
  - Make "Rating Notification" appear faded and smaller height. To make it easier spot other more important notif.
  - Optional: hide all attachment under spoiler-like, set it via `hideAllAttachmentsInSpoilerLikeStyle = 1` on line ~58. Fixed a minor bug: sometime will cause Tolstoy to no longer open the image on new tab when clicked. Also GIF/MP4 to no longer play, also youtube video.

- v0.3.0:
  - Revert: Remove dark theme by default, as not all people prefers dark. If you want dark theme, better use/combine it with another browser extension (Dark Reader. Which will works better!)
  - Bugfix: when `hideAllAttachmentsInSpoilerLikeStyle = true` enabled, it will now work as expected

- v0.3.1:
  - optimization, and prepping future features i guess

- v0.3.4
  - add promptConfirmationOnBrowserBackButton to prevent accidental press of back browser button. Note: this may cause you to press back (reload) >2x in order for browser to allow it.
  - Bugfix: screen jumping around on 1st upvote when enabling `showQuoteOfParentReply`. Used a better method to avoid the issue.
  - add showCommentFragmentId option to show the comment's bookmark/share-able URL. Which also useful to quickly open the thread in a new browser tab.
  - Optional: preventShowingYourOnlineStatus option to hide your Tolstoy online status. set it via `preventShowingYourOnlineStatus = 1` on line ~64
  - Bugfix: partial fix to screen jumping around on 1st upvote when enabling `hideAllAttachmentsInSpoilerLikeStyle`, better but not yet fully fixed.

### Known Bugs:
- TBA

### Fixed Bugs:
- When up-voting the first time (after first run & screen changes e.g. when you go in/out of threads), screen will jump further 1 more comment down than the one you upvoted. This will only happen 1x per screen change. This is due to the "quoted replies" added by this script.
  - Workaround: Just scroll back (1 comment) up, to find what you upvoted. Or you can set `showQuoteOfAParentReply=false` if you don't want that.
  - Fix: I dunno how to fix it yet (Tolstoy default behavior).

### TODO:
- Restore React Route on Page refresh? also route history?
- Floating UI to fetch & show latest comments non-nested, and then show the thread structure?
*/
/* eslint-disable */

(function() {
    // config vars, if any
    var cf = {
        hideAllAttachmentsInSpoilerLikeStyle: 0, // 1 = hide all attachment under spoiler-like. Useful if you don't wanna accidentally NSFW contents e.g. you are at work/school/public-place or you're Fasting. by default disabled (0)
        basicTolstoyUiImprovement : 1,           // 1 = basic UI improvement.
        showQuoteOfParentReply: 1,               // 1 = if a comment is a reply, show the replied comment in a block-quote.
        showCommentFragmentId: 1,                // 1 = show comment ID as url fragment e.g. `#tc-c12345678`. You can add the comment's URL fragment at the end of current page URL, as bookmark URL to the specific comment.
        fadeAllRatingNotifications: 1,           // 1 = Make "Rating Notification" appear faded and smaller height. To make it easier spot other more important notif.
        promptConfirmationOnBrowserBackButton: 1,// 1 = this helps when you accidentally press Browser Back button, it will ask for confirmation.
        preventShowingYourOnlineStatus: 0,       // 1 = attempt to hide your Tolstoy account online status, so other users won't see you online. But you won't see others' too. Experimental, not fully tested.
        injectToReactComponents: 1,
        darkTheme: 0,                            // 1 = enable Tolstoy custom dark theme. I recommend not to enable it, I don't test it anymore, you should use `Dark Reader` extension instead.
        nonNestedThreadView: 0,                  // BROKEN do not use!!!, unusable due to Tolstoy API sux, do not turn on for now.
        showQuoteOfAParentReply: 0,              // BROKEN do not use!!!, 1 = if a comment is a reply, show the replied comment in a block-quote.
    };

    var st = {
        newComAnsElObserver : 0,
        newAttacheElObserver : 0,
        newRatingNotifElObserver : 0,
        comments: (new Map()),
        chatUrl: '',
    }
    unsafeWindow._uscript_state = st;

    var dd = 0; //debug var
    var scriptName = "FGUpcomingRepackImproveTolstoyUI";
    console.log(`-- ${scriptName}: init-ed`);

    /* eslint-disable */
    async function mainScriptOnFGPage(){
        if (window.location.hostname !== 'fitgirl-repacks.site') {
            return 0;
        }
        console.log(`-- ${scriptName} init on hostname:`, window.location.hostname);

        var tolstoycomments = 0;
        for (var i=0; i<10; i++){
            await _pauseBy(2000);
            if (unsafeWindow.tolstoycomments && unsafeWindow.tolstoycomments.widget && unsafeWindow.tolstoycomments.widget.isinit && unsafeWindow.tolstoycomments.widget.isopen()){
                tolstoycomments = unsafeWindow.tolstoycomments;
                break;
            }
            dd&&console.log("-- no tolstoycomments, wait looping",i);
        }
        if (!tolstoycomments){ return 0; }

        dd&&console.log("-- tolstoycomments found:",tolstoycomments);

        tolstoycomments.widget.destroy();

        if(cf.nonNestedThreadView){
            tolstoycomments.widget.config.comment_show_format="linear";
        }

        // tolstoycomments.widget.close();
        // tolstoycomments.widget.config.comment_show_sort="asc";

        if(cf.darkTheme){
            tolstoycomments.widget.config.theme={
                // black
                colorBlackDark: "#cbcbbe",
                colorBlackMiddle: "#808080",
                colorBlackLight: "#333333",
                colorBlack: "#cbcbbe",
                colorMainDark: "#DBECF1",
                colorMainMiddleDark: "#93C6D5",
                colorMain: "#4FA3BA",
                colorMainMiddle: "#2C616F",
                colorMainLight: "#1D3F49",
                colorAlert: "#EF4C47",
                colorBackground: "#121212",
            }
        }

        // tolstoycomments.widget.open();
        var isFgSiteHeaderFixed = window.getComputedStyle(document.querySelector('.site-header')).position === 'fixed';
        if(isFgSiteHeaderFixed){
            tolstoycomments.widget.config.scroll_border_top= 48;
        }
        tolstoycomments.widget.init();

        if(cf.promptConfirmationOnBrowserBackButton){
            await registerBackButtonConfirmationListener();
        }
    }

    async function mainScriptOnTolstoyPage(){
        if ( !cf.basicTolstoyUiImprovement || window.location.hostname !== 'web.tolstoycomments.com') {
            return 0;
        }
        console.log(`-- ${scriptName} init on hostname:`, window.location.hostname);

        dd&&console.log("iframe document");

        // Create a style element
        const style = document.createElement('style');
        style.type = 'text/css';

        // Define the CSS rules
        const css = `
.app {
    background: #fcfcfc;
}

.app-comment__root.left .app-comment__block {
    margin-left: 2.9em;
}

.app-comment__block {
    background-color: #f2f1f088;
    border: 0.1px solid #bbb;
    box-sizing: border-box;
    border-radius: 1.1em;  /* Slightly rounded corners */
    padding: 0.5em 0.8em;  /* Padding inside the bubble */
    /* position: relative; */ /* Positioning for the pseudo-element */
    max-width: 90%; /* Limit the width of the bubble */
}

span.app-comment__answers-text {
    background-color: #ffffff07;
}

body, input, select, textarea, .app-comment__richpreview .card-title .a, .app-comment__richpreview .card-title a, .app-comments-closed, .app-comments-empty, .app-header .title,.app-header-vertical .title,
.app-upload-drag-border p, .app-custom-rubric-subscribe .subscribe, .app-custom-rubric-subscribe .back, .app-chat-title, .app-chat-overflow, .app-chat-empty, .app-chat-pain {
    font-size: calc(16px * 0.825);
}

.app-comment__root {
    padding-top: calc(12px * 0.5);
    padding-bottom: calc(12px * 0.5);
}

.app-comment__snippet-row {
    font-size: calc(13px * 0.825);
    line-height: calc(13px * 0.825);
}

blockquote {
    border-left: 4px solid #ddd;
    padding: 0.5em;
    margin: 0.2em 0em;
    font-style: italic;
}

/* Bigger top left back btn */
div.app-header > div.buttons:first-of-type {
    transform: scale(1.6);
}

/* Hide clashing child comment left line */
.app-comment__root.left .app-comment__direction-line::before, .app-comment__root.child.left::before {
    display: none;
}

/* CUSTOM ELEMENTS */

[data-uscript-fade-rating-notif="1"] {
    height: 7em;
    overflow-y: scroll;
    opacity: 0.2;
}

.uscript-spoiler-toggle {
    margin-right: 1em;
}

.uscript-spoiler {
    position: relative;
    visibility: hidden;
}

.uscript-spoiler::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #808080;
    z-index: 1;
    visibility: visible;
}
        `;
        // Append the CSS rules to the style element
        style.appendChild(document.createTextNode(css));
        // Append the style element to the head of the document
        document.head.appendChild(style);

        var tolstoyLoadedMarkEl = 0;
        for(var i=0; i<20; i++){
            await _pauseBy(2000);
            tolstoyLoadedMarkEl = document.querySelector('#app');
            if(tolstoyLoadedMarkEl){
                break;
            }
            dd&&console.log("-- no .app-comments El, wait looping",i);
        }

        if(cf.showQuoteOfAParentReply){
            var selector = '.app-comment__text a.com_ans[data-id]';
            await processAllCommentAnswerLinks(selector);

            // observe for new element to show up, and perform the same
            if (!st.newComAnsElObserver && tolstoyLoadedMarkEl){
                dd&&console.log(`-- ran ${scriptName} newMediaContainerElObserver`);
                st.newComAnsElObserver = new DOMMutationObserver({
                    parentElement: tolstoyLoadedMarkEl,
                    selector: selector,
                    callback: processCommentAnswerLink,
                })
                st.newComAnsElObserver.start();
            }
        }

        if(cf.hideAllAttachmentsInSpoilerLikeStyle){
            var selector2 = '.app-comment__attache';
            await processAllAttachmentEl(selector2);

            // observe for new element to show up, and perform the same
            if (!st.newAttacheElObserver && tolstoyLoadedMarkEl){
                dd&&console.log(`-- ran ${scriptName} newMediaContainerElObserver`);
                st.newAttacheElObserver = new DOMMutationObserver({
                    parentElement: tolstoyLoadedMarkEl,
                    selector: selector2,
                    callback: processAttachmentEl,
                })
                st.newAttacheElObserver.start();
            }
        }
        if(cf.fadeAllRatingNotifications){
            var selector3 = '.app-event__root .app-text-line';
            // observe for new element to show up, and perform the same
            if (!st.newRatingNotifElObserver && tolstoyLoadedMarkEl){
                dd&&console.log(`-- ran ${scriptName} newMediaContainerElObserver`);
                st.newRatingNotifElObserver = new DOMMutationObserver({
                    parentElement: tolstoyLoadedMarkEl,
                    selector: selector3,
                    callback: processRatingNotifEl,
                })
                st.newRatingNotifElObserver.start();
            }
        }
        if(cf.injectToReactComponents){
            // expose for @TEST purpose
            unsafeWindow.moduleRaid = moduleRaid;
            unsafeWindow.findReactComponentsByCheckingSetStateFunc = findReactComponentsByCheckingSetStateFunc;
            unsafeWindow.findReactComponentsByCheckingElTypeName = findReactComponentsByCheckingElTypeName;


            unsafeWindow._rapp = document.querySelector('#app');
            var routers = findReactComponentsByCheckingSetStateFunc(document.querySelector('.app'), 'Router');
            try{
                unsafeWindow._rrouter = routers[0].component;
            } catch(err) {}

            var chatMentionBlocks = findReactComponentsByCheckingElTypeName(undefined,'ChatMentionBlock');
            try{
                unsafeWindow._rchatMentionBlock = chatMentionBlocks[0].component;
            } catch(err) {}

            var providers = findReactComponentsByCheckingElTypeName(undefined,'Provider');
            try{
                unsafeWindow._rprovider = providers[0].component;
                unsafeWindow._rstore = unsafeWindow._rprovider.memoizedProps.store;
            } catch(err) {}

            // MonkeyPatch dispatch
            unsafeWindow._ori_dispatch = unsafeWindow._rstore.dispatch;
            unsafeWindow._rstore.dispatch = function(){
                dd&&console.log('-- executing patched func `dispatch` w/ params:', arguments[0]);

                if(cf.preventShowingYourOnlineStatus && arguments[0] && arguments[0].type && (arguments[0].type == "DEFAULT_WIDGET_FOCUS" || arguments[0].type == "DEFAULT_SOCKET_CONNECT")){
                    arguments[0].data = false;
                    dd&&console.log('----- modified `dispatch` of type==DEFAULT_WIDGET_FOCUS||DEFAULT_SOCKET_CONNECT, arguments:', arguments);
                }

                // when CHAT_COMMENTS_SUCCESS with non-0 comments
                if(arguments[0] && arguments[0].type && arguments[0].data && arguments[0].data.comments && arguments[0].type == "CHAT_COMMENTS_SUCCESS"  && arguments[0].data.comments.length > 0){
                    dd&&console.log('--- modifying `dispatch` comments:', arguments[0].data.comments);

                    try {
                        // get & update st.chatUrl with current comment page URL
                        st.chatUrl = arguments[0].params.url;
                    } catch (err){
                        console.error("--- fail to get & update st.chatUrl"); console.error(err);
                    }

                    // Store all comments to st.comments map
                    arguments[0].data.comments.map(function(c){
                        st.comments.set(c.id, c);
                        return c;
                    });

                    // Modify loaded comments to add quoted reply
                    var repliedCommentBlockEl = document.createElement('blockquote');
                    try {
                        var needToShowSomethingOnCommentText = (cf.showQuoteOfParentReply || cf.showCommentFragmentId);
                        if(needToShowSomethingOnCommentText){
                            arguments[0].data.comments = arguments[0].data.comments.map(function(c){
                                c = (function showQuoteOfParentReply(c){
                                    if(!cf.showQuoteOfParentReply){ return c; }
                                    dd&&console.log('---- looping `dispatch` @c', c);
                                    if(c._us_is_modified_showQuoteOfParentReply){ dd&&console.log('----- skip when the comment is already modified'); return c; } // skip when the comment is already modified
                                    if(!c.text_template){ dd&&console.log('----- skip when the comment dont have comment text'); return c; } // skip when the comment dont have comment text
                                    var quotedCommentId = ((c.text_template).match(/<a class="com_ans" data-id="(\d+)">/) || [])[1];
                                    quotedCommentId = parseInt(quotedCommentId);
                                    if(!quotedCommentId){ dd&&console.log('----- skip when the comment is not a reply'); return c; } // skip when the comment is not a reply

                                    var quotedComment = st.comments.get(quotedCommentId); // search in stored comment map.

                                    if(quotedComment){
                                        repliedCommentBlockEl.innerHTML = quotedComment.text_template;
                                        repliedCommentBlockEl.innerText = ''+quotedComment.user.name +' :: ' +_truncateStr(repliedCommentBlockEl.innerText, 200)+'';
                                    } else {
                                        repliedCommentBlockEl.innerText = "{{ COMMENT_OUT_OF_VIEW - The replied comment seems to be out of current page view. Click the username link above to see which comment it is. }}";
                                        // @TODO: implement fetching comment via API? https://web.tolstoycomments.com/api/chatpage/first?siteid=6289&hash=&url=https%3A%2F%2Ffitgirl-repacks.site%2Fupcoming-repacks-9%2F&rootid=34236762&token=&sort=1&format=1
                                    }
                                    c.text_template = repliedCommentBlockEl.outerHTML+ '' + c.text_template;
                                    c._us_is_modified_showQuoteOfParentReply = 1;
                                    return c;
                                })(c);

                                c = (function showCommentFragmentId(c){
                                    if(!cf.showCommentFragmentId){ return c }
                                    if(c._us_is_modified_showCommentFragmentId){ dd&&console.log('----- skip when the comment is already modified'); return c; } // skip when the comment is already modified
                                    var commentFragmentId = '#tc-c' + c.id;
                                    var commentUrl = st.chatUrl + commentFragmentId;
                                    c.text_template += `</br> <small><i>&nbsp;&nbsp; -- CommentID URL:  <a target="_blank" href="${commentUrl}">${commentFragmentId}</a></i></small>`;
                                    c._us_is_modified_showCommentFragmentId = 1;
                                    return c;
                                })(c);

                                dd&&console.log('----- modified `dispatch` @c, quotedCommentId:', c, quotedCommentId);
                                return c;
                            });
                        }
                    } catch (err) { console.error(err); }
                    // @WORK
                }

                var dispatchResult = (unsafeWindow._ori_dispatch).apply(this, arguments); // Call the original function with all arguments
                // can perform modification of after original dispatch call here.
                return dispatchResult;
            };
            // unsafeWindow._rstore.dispatch = monkeyPatchFuncWithLog(unsafeWindow._rstore.dispatch, 'dispatch');

            // refresh the current page URL so dispatch patching is applied
            // unsafeWindow._rrouter.props.history.go(0); // dont seems to work for now

            // console.log("Router",unsafeWindow.router);

            /*
                router.props.history.goForward()
                router.props.history.push("/chat/6289/1c5f16135d8fdb551f768376fd964c48/https%3A%2F%2Ffitgirl-repacks.site%2Fupcoming-repacks-9%2F/34603388")
                "/chat/6289/null/https%3A%2F%2Ffitgirl-repacks.site%2Fupcoming-repacks-9%2F"
                /chat/:site_id/:hash/:url/:root_id?

                document.querySelector('#comment34612539').__reactProps$2fr4dq0x0m6.children.type.name
                document.querySelector('#app')._reactRootContainer._internalRoot.current.memoizedState.element.props.store.getState()
                rapp._reactRootContainer._internalRoot.current.stateNode.current.firstEffect.type.name
                rapp._reactRootContainer._internalRoot.current.stateNode.current.firstEffect.elementType.name
                rapp._reactRootContainer._internalRoot.current.child

                findReactComponentsByCheckingElTypeName(undefined,'ChatMentionBlock')[0].component.render()
                findReactComponentsByCheckingElTypeName(undefined,'ChatMentionBlock')[0].component.props.comments
                that's a React List
                (findReactComponentsByCheckingElTypeName(undefined,'ChatMentionBlock')[0]).component.props.comments.get(1).get('text_template','huaahshdahdshadwhawhdhda')

                (rapp.__reactContainer$0dq7i7ry5ra.child.memoizedProps.store.dispatch)
                provider.memoizedProps.store.dispatch
                dispatch({
                    type: "CHAT_COMMENTS_SUCCESS",
                    page: "first",
                    data: o, // API RESPONSE
                    params: {
    "site_id": "6289",
    "hash": "null",
    "url": "https://fitgirl-repacks.site/upcoming-repacks-9/",
    "token": "aNVINYIKc1jQGcEJBdVu8jIpHesIBCfPWIOJxi0aLF63tcfjLEZRESbe+RZliV2PMsumD5Fpy8UXI/qKUvCguFk2mnWtVUMKI8XxMaLugnwWF/vL57E9VANM81SSTVlL1Y+maWXZzSZWnRIrHx3OPKY0ZBdcUfFHU+kOfj17uNxZOfYMq7QTqmaDFjtQ20VyDFpBDHjQRzRgfPxsX5IXL2a9N5udqUK3nbZsyCKjfn4=",
    "identity": null,
    "sort": 1,
    "format": 1
                    },
                    key_chat: "c6289:|[https%3A%2F%2Ffitgirl-repacks.site%2Fupcoming-repacks-9%2F]|"
                })

                (moduleRaid().modules[6805]).A.ScrollToTopGlobal()
                */
        }
    }

    // @TODO: need to find by elementType:Provider
    function findReactComponentsByCheckingElTypeName(reactRootDomElement = document.querySelector('#app'), componentTypeToFind) {
        /**
    Finds React component instances within a given React root DOM element that match a specified component type.

    This function traverses the React fiber tree starting from the provided root element. It checks each component to see if its `elementType.name` matches the specified `componentTypeToFind`. If a match is found, the function returns an array containing the component instances and their corresponding DOM elements.

    @param {Object} reactRootDomElement - The root DOM element from which to start traversing the React fiber tree. Defaults to the element with ID 'app'.
    @param {string|null} componentTypeToFind - The name of the component type to search for (e.g., 'Router'). If undefined, returns all components.
    @returns {Array|null} An array containing matching component instances and their DOM elements if found; otherwise, returns null.
    @example
    var result = findReactComponentsByCheckingElTypeName(undefined, 'MyComponent');
    if (result) {
        result.forEach(function({ component, element }) {
            console.log('Found component:', component);
            console.log('Corresponding DOM element:', element);
        });
    } else {
        console.log('No matching component found.');
    }
    */
        var results = []; // Array to collect results

        function traverse(node) {
            // Check if the node is a React component instance
            if (node && node.elementType && node.elementType.name) {
                // Get the element type name
                var elementTypeName = node.elementType?.name;
                // Check if the component type matches the specified type or if componentTypeToFind is undefined
                if (componentTypeToFind === undefined || elementTypeName === componentTypeToFind) {
                    // Find the corresponding DOM element
                    var domElement = node.stateNode?.base || node.stateNode?._reactInternalFiber?.return?.stateNode || node.stateNode;
                    // Add the result to the results array
                    results.push({
                        component: node,
                        elementTypeName: elementTypeName,
                        element: domElement
                    });
                    // If componentTypeToFind is defined, return only the first occurrence
                    if (componentTypeToFind !== undefined) {
                        return true; // Indicate that we found a match
                    }
                }
            }
            // Traverse child nodes
            if (node.child) {
                var child = node.child;
                while (child) {
                    if (traverse(child)) {
                        return true; // Stop traversing if we found a match
                    }
                    child = child.sibling; // Move to the next sibling
                }
            }
            return false; // No match found in this branch
        }

        // Get the fiber node for the selected element
        var fiberNode = reactRootDomElement._reactRootContainer._internalRoot.current;
        // Start traversing from the fiber node
        if (fiberNode) { traverse(fiberNode); }

        // Return the found results or null if none found
        return results.length > 0 ? results : null;
    }

    // ## FUNCTIONS
    async function processCommentAnswerLink(el){ // @DEPRECATED: @TODO clean up?
        // @TODO: ideas maybe don't change dom or react props, but change the comments API response via monkey patching? create our own in-mem Store of Comment Arrays?
        var elAlreadyModifiedClassName = 'uscript-added-quote';
        if(el.parentElement.querySelector(`.${elAlreadyModifiedClassName}`)){
            dd&&console.log('-- processCommentAnswerLink: already processed before, skip!!!',el);
            return 0; // already processed before, skip
        }

        var quotedId = el.getAttribute('data-id');
        var quotedComEl = document.querySelector(`#comment${quotedId} .app-comment__text span`);
        var quotedText = "";
        if (quotedComEl){
            // @TODO: Exclude one already quoted before?
            // @TODO: fix on nested view?
            quotedText = Array.from(quotedComEl.childNodes) // Convert childNodes to an array
                .filter(function (node) { return node.nodeType === Node.TEXT_NODE} ) // Filter for text nodes
                .map(function (node) { return node.textContent.trim()} ) // Get the text content and trim whitespace
                .join(' ');

            quotedText = _truncateStr(quotedText, 200);
        } else {
            quotedText = "{{ COMMENT_OUT_OF_VIEW }} - The replied comment seems to be out of current page view. Click the username link above to see which comment it is.";
            // @TODO: implement fetching comment via API? https://web.tolstoycomments.com/api/chatpage/first?siteid=6289&hash=&url=https%3A%2F%2Ffitgirl-repacks.site%2Fupcoming-repacks-9%2F&rootid=34236762&token=&sort=1&format=1
        }
        dd&&console.log('-- processCommentAnswerLink', el, quotedComEl);

        // Create a new span element
        var newSpan = document.createElement('blockquote');
        newSpan.className = `s-color-BlackMiddle ${elAlreadyModifiedClassName}`;
        newSpan.textContent = `"${quotedText}"`;

        // Insert the new span as a sibling after the existing element
        el.insertAdjacentElement('afterend', newSpan);
    }

    async function processCommentAnswerLink_FAIL(el){ // @DEPRECATED: @TODO clean up?
        if(!el || !el.innerText){ return 0; }
        var quoteReplyPrefix = '##QUOTED-REPLY###';
        if(el.parentElement.innerText.includes('##QUOTED-REPLY###')){
            dd&&console.log('-- processCommentAnswerLink: already processed before, skip!!!',el);
            return 0; // already processed before, skip
        }
        var quoteReplySuffix = '##END-QUOTED-REPLY###  ';

        var quotedId = el.getAttribute('data-id');
        var quotedComEl = document.querySelector(`#comment${quotedId} .app-comment__text span`);
        var quotedText = "";
        if (quotedComEl){
            quotedText = quotedComEl.innerText;
            // remove any text before quote suffix
            quotedText = (quotedText.indexOf(quoteReplySuffix) !== -1 ? quotedText.substring(quotedText.indexOf(quoteReplySuffix) + quoteReplySuffix.length).trim() : quotedText);
            quotedText = quoteReplyPrefix+' '+_truncateStr(quotedText, 200)+' '+quoteReplySuffix;
        } else {
            quotedText = quoteReplyPrefix+" {{ COMMENT_OUT_OF_VIEW }} - The replied comment seems to be out of current page view. Click the username link above to see which comment it is. "+quoteReplySuffix;
            // @TODO: implement fetching comment via API? https://web.tolstoycomments.com/api/chatpage/first?siteid=6289&hash=&url=https%3A%2F%2Ffitgirl-repacks.site%2Fupcoming-repacks-9%2F&rootid=34236762&token=&sort=1&format=1
        }
        dd&&console.log('-- processCommentAnswerLink', el, quotedComEl);

        el.parentElement.innerText = quotedText + el.parentElement.innerText;
    }

    async function processAllCommentAnswerLinks(selector){ // @DEPRECATED: @TODO clean up?
        var els = Array.from(document.querySelectorAll(selector));
        for (var el of els){
            await processCommentAnswerLink(el);
        };
    }

    async function processAttachmentEl(el){
        if(!el || !el.parentNode){ return 0; }
        var elAlreadyModifiedClassName = 'uscript-added-spoiler';
        if(el.parentElement.querySelector(`.${elAlreadyModifiedClassName}`)){
            dd&&console.log('-- processAttachmentEl: already processed before, skip!!!',el);
            return 0;
        } // already under details, abort
        dd&&console.log('-- processAttachmentEl', el);
        el.classList.add(elAlreadyModifiedClassName);

        // Create the toggle element
        var toggleElement = document.createElement('span');
        toggleElement.className = 'a uscript-spoiler-toggle';
        toggleElement.textContent = '[Show/Hide Media]';

        // Insert the toggle element to before the timestamp element, avoid adding to `eddited` icon.
        try {
            el.parentNode.parentNode.querySelector('.app-comment__snippet-row').prepend(toggleElement);
        } catch (err) {
            console.log('-- fail to add hideAllAttachmentsInSpoilerLikeStyle toggle to an element');
            console.log(err);
        }

        // Add click event listener to toggle the class
        toggleElement.addEventListener('click', () => {
            el.classList.toggle('uscript-spoiler');
        });
        // spoiler it on by default
        el.classList.add('uscript-spoiler');
    }

    async function processAllAttachmentEl(selector){
        var els = Array.from(document.querySelectorAll(selector));
        for (var el of els){
            await processAttachmentEl(el);
        };
    }

    async function processRatingNotifEl_UNUSED(el){ // @TODO: cleanup?
        if(!el || !el.parentNode || el.innerText !== "You've got a new rate"){ return 0; }
        if(el.closest('details')) {
            dd&&console.log('-- processRatingNotifEl: already processed before, skip!!!',el);
            return 0;
        } // already under details, abort
        dd&&console.log('-- processRatingNotifEl', el);
        var containerEl = el.closest('.app-event__root');
        if(containerEl){
            var details = document.createElement('details');
            var summary = document.createElement('summary');

            summary.textContent = '[ --- CLICK TO EXPAND RATING NOTIF --- ]';
            summary.classList.add('uscript-expand-attachment');
            summary.classList.add('a'); // to make it looks like Anchor from Tolst
            details.appendChild(summary);
            details.appendChild(containerEl.cloneNode(true));

            containerEl.parentNode.replaceChild(details, containerEl);
        }
    }

    async function processRatingNotifEl(el){
        if(!el || !el.parentNode || el.innerText !== "You've got a new rate"){ return 0; }
        if(el.closest('.app-event__root[data-uscript-fade-rating-notif="1"]')) {
            dd&&console.log('-- processRatingNotifEl: already processed before, skip!!!',el);
            return 0;
        } // already under details, abort
        dd&&console.log('-- processRatingNotifEl', el);
        var containerEl = el.closest('.app-event__root');
        if(containerEl){
            containerEl.setAttribute('data-uscript-fade-rating-notif',"1");
        }
    }

    async function registerBackButtonConfirmationListener(){
        var isBackNavigation = false;

        // Listen for popstate event to detect back navigation
        unsafeWindow.addEventListener('popstate', function (event) {
            isBackNavigation = true;
            // Prompt the user with a confirmation dialog
            var confirmationMessage = 'You are pressing Browser Back button. Are you sure you want to go back one page?';
            var userConfirmed = confirm(confirmationMessage);
            if (!userConfirmed) {
                // If the user cancels, push the current state back to history
                history.pushState(null, null, location.href);
            } else {
                // If the user confirms, you can proceed with the back navigation
                isBackNavigation = false; // Reset the flag
            }
        });

        // Prevent the default unload behavior
        unsafeWindow.addEventListener('beforeunload', function (event) {
            if (isBackNavigation) {
                var confirmationMessage = 'Are you sure you want to leave this page?';
                event.returnValue = confirmationMessage; // For most browsers
                return confirmationMessage; // For some older browsers
            }
        });

        // Push the current state to history on page load
        unsafeWindow.history.pushState(null, null, window.location.href);
    }

    // ## HELPERS
    function findReactComponentsByCheckingSetStateFunc(parentElementToTraverse = (document.querySelector('.app')), componentTypeToFind) {
        /**
    Finds React component instances within a given parent element that match a specified component type.

    This function traverses the React fiber tree starting from the provided parent element. It checks each component to see if it has a `setState` function and if its type matches the specified `componentTypeToFind`. If a match is found, the function returns an array containing the component instances and their corresponding DOM elements.

    @param {Object} parentElementToTraverse - The parent element from which to start traversing the React fiber tree.
    @param {string|null} componentTypeToFind - The name of the component type to search for (e.g., 'Router'). If null, returns all components.
    @returns {Array|null} An array containing matching component instances and their DOM elements if found; otherwise, returns null.
    @example
    const result = findReactComponentsByCheckingSetStateFunc(parentElement, null);
    if (result) {
        result.forEach(({ component, element }) => {
            console.log('Found component:', component);
            console.log('Corresponding DOM element:', element);
        });
    } else {
        console.log('No matching component found.');
    }
       */
        var results = []; // Change to an array to collect multiple results

        function traverse(node) {
            // Check if the node is a React component instance
            if (node && node.stateNode && typeof node.stateNode.setState === 'function') {
                // Check if the component type matches the specified type or if componentTypeToFind is null
                const elementTypeName = node.stateNode?._reactInternals?.elementType?.name;
                if (!componentTypeToFind || elementTypeName === componentTypeToFind) {
                    // Find the corresponding DOM element
                    var domElement = node.stateNode?.base || node.stateNode?._reactInternalFiber?.return?.stateNode;
                    // Add the result to the results array
                    results.push({
                        component: node.stateNode,
                        element: domElement
                    });
                }
            }
            // Traverse child nodes
            if (node.child) {
                var child = node.child;
                while (child) {
                    traverse(child);
                    child = child.sibling; // Move to the next sibling
                }
            }
        }

        // Get the fiber node for the selected element
        var fiberNode = parentElementToTraverse[Object.keys(parentElementToTraverse).find(key => key.startsWith('__reactFiber') || key.startsWith('__reactProps'))];
        // Start traversing from the fiber node
        if (fiberNode) { traverse(fiberNode); }

        // Return the found results or null if none found
        return results.length > 0 ? results : null;
    }

    /////////////////////////////////////////////////////////
    class DOMMutationObserver {
        constructor(config = {}) {
            this.parentElement = config.parentElement || window.document;
            this.selector = config.selector || '.dummy-class-name';
            this.callback = config.callback || function(){};
            this.observer = null;
            this.isObserving = false; // Track if the observer is already active
        }

        // Method to start observing
        start() {
            if (this.isObserving) {
                console.log('MutationObserver is already running.');
                return;
            }

            this.isObserving = true; // Mark as observing
            console.log('Started observing DOM changes.');

            // Create the MutationObserver instance
            this.observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1 && node.matches(this.selector)) {
                                this.callback(node); // Call the provided callback
                            } else {
                                if(!node.querySelectorAll){ return 0; } // Dirty fix to avoid exception if the node can't be queried, dunno why.
                                // Check for descendants that match the selector
                                const matchingDescendants = node.querySelectorAll(this.selector);
                                matchingDescendants.forEach(this.callback);
                            }
                        });
                    }
                });
            });

            // Start observing the parent element for added child nodes
            this.observer.observe(this.parentElement, {
                childList: true, // Watch for added/removed child nodes
                subtree: true, // Include descendants in the observation
            });
        }

        // Method to stop observing
        stop() {
            if (!this.isObserving) {
                console.log('MutationObserver is not running.');
                return;
            }

            this.observer.disconnect(); // Stop observing
            this.isObserving = false;
            console.log('Stopped observing DOM changes.');
        }
    }
    /////////////////////////////////////////////////////////
    // Minified & slightly modified from: https://cdn.jsdelivr.net/npm/@pedroslopez/moduleraid@5.0.2/moduleraid.js
    var moduleRaid=function(){return moduleRaid.mID=Math.random().toString(36).substring(7),moduleRaid.mObj={},fillModuleArray=function(window=unsafeWindow){(window.webpackChunkbuild||window.webpackChunkwhatsapp_web_client||window.webpackChunk).push([[moduleRaid.mID],{},function(e){Object.keys(e.m).forEach((function(o){moduleRaid.mObj[o]=e(o)}))}])},fillModuleArray(),get=function(e){return moduleRaid.mObj[e]},findModule=function(e){return results=[],modules=Object.keys(moduleRaid.mObj),modules.forEach((function(o){if(mod=moduleRaid.mObj[o],"undefined"!=typeof mod)if("string"==typeof e){if("object"==typeof mod.default)for(key in mod.default)key==e&&results.push(mod);for(key in mod)key==e&&results.push(mod)}else{if("function"!=typeof e)throw new TypeError("findModule can only find via string and function, "+typeof e+" was passed");e(mod)&&results.push(mod)}})),results},{modules:moduleRaid.mObj,constructors:moduleRaid.cArr,findModule:findModule,get:get}};"object"==typeof module&&module.exports&&(module.exports=moduleRaid);
    function monkeyPatchFuncWithLog(originalFunction, functionName=false, logPrefix=false){
        dd&&console.log('-- monkey patching',arguments);

        if(!functionName){ functionName = originalFunction.name; }
        if(!logPrefix){ logPrefix = `-- executing patched func '${functionName}' w/ params: `; }

        unsafeWindow['_ori_'+functionName] = originalFunction;
        return function() {
            console.log(logPrefix, arguments[0]);
            // console.log(arguments); // Log all arguments being called
            return (unsafeWindow['_ori_'+functionName]).apply(this, arguments); // Call the original function with all arguments
        };
    }
    function _pauseBy(ms) { return new Promise(function(resolve) { return setTimeout(resolve, ms) }); };
    function _truncateStr(str, maxLength = 70) { return str.length > maxLength ? str.substring(0, maxLength) + '...' : str; }

    // ## ENTRY SCRIPT
    // run main script when Document is all loaded & ready
    mainScriptOnFGPage();
    mainScriptOnTolstoyPage();

    // Note: Yea I know my code is bad and I should feel bad, but well... I don't get paid for it, soo...
})();
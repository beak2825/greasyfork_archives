// ==UserScript==
// @name         cohost view post source
// @namespace    https://github.com/adrianmgg
// @version      1.0.9
// @description  adds a "view source" button to posts on cohost
// @author       amgg
// @match        https://cohost.org/*
// @icon         https://cohost.org/static/a4f72033a674e35d4cc9.png
// @grant        unsafeWindow
// @run-at       document-start
// @compatible   firefox
// @compatible   chrome
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448841/cohost%20view%20post%20source.user.js
// @updateURL https://update.greasyfork.org/scripts/448841/cohost%20view%20post%20source.meta.js
// ==/UserScript==

(function() {

// =============================================================================

// not all userscript managers have unsafeWindow
const _unsafeWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

// ======== https://github.com/adrianmgg/elhelper ========
function setup(elem,{style:{vars:styleVars={},...style}={},attrs={},dataset={},events={},classList=[],children=[],parent=null,insertBefore=null,...props}){for(const k in style)elem.style[k]=style[k];for(const k in styleVars)elem.style.setProperty(k,styleVars[k]);for(const k in attrs)elem.setAttribute(k,attrs[k]);for(const k in dataset)elem.dataset[k]=dataset[k];for(const k in events)elem.addEventListener(k,events[k]);for(const c of classList)elem.classList.add(c);for(const k in props)elem[k]=props[k];for(const c of children)elem.appendChild(c);if(parent!==null){if(insertBefore!==null)parent.insertBefore(elem,insertBefore);else parent.appendChild(elem);}return elem;}
function create(tagName,options={}){return setup(document.createElement(tagName),options);}
function createNS(namespace,tagName,options={}){return setup(document.createElementNS(namespace,tagName),options);}
// ======================================================

// =============================================================================
function observer_helper(filter, on_node_found, options) {
    const once = options?.once ?? false;
    const subtree = options?.subtree ?? false;
    return (target) => {
        for(const node of target.childNodes) {
            if(filter(node)) {
                on_node_found(node);
                if(once) return; // don't need to bother setting up the observer
            }
        }
        const observer = new MutationObserver((mutations, observer) => {
            for(const mutation of mutations) {
                if(mutation.type === 'childList') {
                    for(const node of mutation.addedNodes) {
                        if(filter(node)) {
                            on_node_found(node);
                            if(once) {
                                observer.disconnect();
                                return;
                            }
                        }
                    }
                }
            }
        });
        observer.observe(target, { childList: true, subtree: subtree });
    }
}
function observer_helper_chain(on_leaf_found, ...stuff) {
    let cur = observer_helper(stuff[stuff.length - 1][0], on_leaf_found, stuff[stuff.length - 1][1]);
    for(let i = stuff.length - 1 - 1; i >= 0; i--) {
        cur = observer_helper(stuff[i][0], cur, stuff[i][1]);
    }
    return cur;
}
function observer_helper_promise(target, filter, options) {
    return new Promise((resolve) => {
        observer_helper(filter, resolve, {...options, once: true})(target);
    });
}
// =============================================================================
function arrayEqualsStrict(a, b) {
    if(a === b) return true;
    if(a.length !== b.length) return false;
    for(let i = 0; i < a.length; i++) {
        if(a[i] !== b[i]) return false;
    }
    return true;
}
// =============================================================================

// ======== css stuff ========

function inject_stylesheet() {
    create('style', {
        parent: document.head,
        textContent: `
.amgg__viewsource__wrap-text .amgg__viewsource__source-view-container pre {
    white-space: pre-wrap;
    word-break: normal;
    overflow-wrap: anywhere;
}
.amgg__viewsource__post-hide-source-view .amgg__viewsource__source-view-container {
    display: none;
}
`,
    });
}

// ========= ========

function render_blocks_list(blocks) {
    const markdown_blocks = blocks.filter(block => block.type === 'markdown').map(block => block.markdown.content);
    if(markdown_blocks.length === 0) { return null; }
    return create('pre', {
        children: [create('code', {
            textContent: markdown_blocks.join('\n\n'),
        })],
    });
}

function handle_show_post_source_click(article, view_source_btn, post_id) {
    const post_data = post_id_to_post_data[post_id];
    if('alreadyRendered' in view_source_btn.dataset) {
        article.classList.toggle('amgg__viewsource__post-hide-source-view');
    } else {
        if(post_data === undefined) {
            alert(`data for post #${post_id} not found, unable to show source`);
        } else {
            // mark ourself as already having created the source view - any further clicks can just toggle its visibility instead
            view_source_btn.dataset.alreadyRendered = '';
            //
            create('div', {
                parent: article,
                classList: ['co-prose', 'prose', 'px-3', 'amgg__viewsource__source-view-container'],
                children: [
                    // "wrap text" checkbox
                    create('label', {
                        textContent: 'wrap text ',
                        children: [create('input', {
                            type: 'checkbox',
                            checked: false,
                            events: {
                                change: e => {
                                    article.classList[e.target.checked ? 'add' : 'remove']('amgg__viewsource__wrap-text');
                                },
                            },
                        })],
                    }),
                    // the posts
                    create('div', {
                        children: [...(post_data.shareTree.map(p=>p.blocks)), post_data.blocks].map(render_blocks_list).filter(x => x !== null && x !== undefined),
                    }),
                ],
            });
        }
    }
}

// ======== keeping track of post data ========

let post_id_to_post_data = {};
function handle_post_data(post) {
    post_id_to_post_data[post.postId] = post;
    if(post.transparentShareOfPostId !== undefined) {
        post_id_to_post_data[post.transparentShareOfPostId] = post;
    }
}

// ======== watching for new post elements ========


async function handle_post_element(post_elem) {
    // if we already put a view source button on this post we don't want to add a second one
    // if(post_elem.querySelector('.amgg__viewsource__view-source-button') !== null) {
    if('amggViewsourceDiscovered' in post_elem.dataset) {
        return;
    }
    post_elem.dataset.amggViewsourceDiscovered = '';
    // these have the post id in their id. the last one should be the one with the id
    //  for the current post (rather than another post further up in the thread)
    const post_id_elems = post_elem.querySelectorAll('[id^="post-"]');
    const post_id_elem = post_id_elems[post_id_elems.length - 1];
    const post_id = parseInt(post_id_elem.id.slice('post-'.length));
    const post_article = post_elem.querySelector(':scope > article');
    const post_footer = post_article.querySelector(':scope > footer > div');
    // set up the "show source" button
    const view_source_btn = create('div', {
        classList: ['amgg__viewsource__view-source-button'],
        children: [create('span', {
            textContent: 'view source',
            classList: ['cursor-pointer', 'pb-3', 'text-sm', 'font-bold', 'text-cherry', 'hover:underline'],
        })],
        events: {
            click: (e) => {
                handle_show_post_source_click(post_article, view_source_btn, post_id);
            },
        },
    });
    post_footer.insertBefore(view_source_btn, post_footer.childNodes[1]);
}

function attach_post_observer() {
    // TODO probably not the best performance-wise to observe mutations on the entire page,
    //  would be better to first identify the container posts live in, then just observe
    //  childList mutations on that container
    (new MutationObserver((mutations) => {
        for(const mutation of mutations) {
            if(mutation.type === 'childList') {
                for(const node of mutation.addedNodes) {
                    if(node.nodeType === Node.ELEMENT_NODE) {
                        if(node.getAttribute('data-view') === 'post-preview') {
                            handle_post_element(node);
                        }
                        node.querySelectorAll('[data-view="post-preview"]').forEach(handle_post_element);
                    }
                }
            }
        }
    })).observe(document, { subtree: true, childList: true });
    // for any that're already there before we start observing mutations
    document.querySelectorAll('[data-view="post-preview"]').forEach(handle_post_element);
}
if(document.readyState === 'interactive') {
    attach_post_observer();
} else {
    document.addEventListener('readystatechange', e => {
        if(document.readyState === 'interactive') {
            attach_post_observer();
        }
    });
}

// ======== handle the posts that are on the page initially ========

document.addEventListener('amgg__viewsource__foundpost', (e) => {
    handle_post_data(e.detail.post);
});
// (initially I did this by just grabbing the desired elements out of the head
//  as soon as they were present, but with longer data and a slower connection
//  that ended up trying to parse the json data before the content of the node
//  had fully loaded, which would fail. because of that, i switched to waiting
//  for the body to exist, since that should mean all the head nodes have been
//  fully downloaded)
observer_helper_chain(
    (body) => {
        inject_stylesheet();

        const dehydrated_state_elem = document.getElementById('trpc-dehydrated-state');
        if(dehydrated_state_elem !== null) {
            const dehydrated_state = JSON.parse(dehydrated_state_elem.textContent);
            for(const query of dehydrated_state.queries) {
                if(Array.isArray(query.queryKey) && Array.isArray(query.queryKey[0])) {
                    const queryPath = query.queryKey[0];
                    // TODO: does posts.byProject show up anywhere anymore? leaving it in for now just in case
                    if(arrayEqualsStrict(queryPath, ['posts', 'byProject']) || arrayEqualsStrict(queryPath, ['posts', 'profilePosts'])) {
                        // posts on someone's profile
                        query.state.data.posts.forEach(handle_post_data);
                    } else if(arrayEqualsStrict(queryPath, ['posts', 'singlePost'])) {
                        // viewing a single post
                        handle_post_data(query.state.data.post);
                    }
                }
            }
        }

        const cohost_loader_state_elem = document.getElementById('__COHOST_LOADER_STATE__');
        if(cohost_loader_state_elem !== null) {
            const cohost_loader_state = JSON.parse(cohost_loader_state_elem.textContent);
            // initial posts on home page (first page only)
            cohost_loader_state.dashboard?.posts?.forEach?.(handle_post_data);
            // posts on home but not first page
            // TODO - is project-post-feed used anymore?
            cohost_loader_state['project-post-feed']?.posts?.forEach?.(handle_post_data);
            cohost_loader_state['dashboard-nonlive-post-feed']?.posts?.forEach?.(handle_post_data);
            // posts on a tag search page
            cohost_loader_state['tagged-post-feed']?.posts?.forEach?.(handle_post_data);
            // bookmarks
            cohost_loader_state['bookmarked-tag-feed']?.posts?.forEach?.(handle_post_data);
            // per-user tag pages (/username/tagged/tag)
            cohost_loader_state['project-tagged-post-feed']?.posts?.forEach?.(handle_post_data);
        }
    },
    [n => n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'HTML', {once: true}],
    [n => n.nodeType === Node.ELEMENT_NODE && n.nodeName === 'BODY', {once: true}],
)(document);


// ======== handle posts that get loaded later ========

// originally i was just getting the original functions from unsafeWindow,
// wrapping them, and replacing them, but that doesn't seem to work on
// greasemonkey, where the site's code errors out trying to call the wrapped
// function (i guess they do their sandboxing differently from tampermonkey &
// violentmonkey? idk). I don't actually need any privelaged usersript
// functions, so in theory i could `@grant none` and just not run sandboxed, but
// as far as i can tell the problem *still* happens on greasemonkey even then.
// doing it this way with events seems to work everywhere through, so that's
// what i'll go with
_unsafeWindow.eval(`
(() => {
function return_post_to_sandbox(post) {
    document.dispatchEvent(new CustomEvent('amgg__viewsource__foundpost', {
        detail: {
            post: post,
        },
    }));
}

const original_fetch = window.fetch;
window.fetch = function(resource, options) {
    if(resource?.constructor === String) {
        try {
            const url = new URL(resource, window.location.href);
            if(url.hostname === 'cohost.org' && url.pathname.startsWith('/api/v1/trpc/')) {
                const requested_things = url.pathname.slice('/api/v1/trpc/'.length).split(',');
                // TODO only need to bother wrapping it if one if the things we care about is in this fetch
                return original_fetch.apply(this, arguments).then(response => {
                    return new Promise(async (resolve) => {
                        // the requests get aborted if we give back the original response before we're done awaiting the .json() on the cloned response
                        const json = await response.clone().json();
                        for(const i in requested_things) {
                            // for posts viewed on user profiles
                            if(requested_things[i] === 'posts.byProject' || requested_things[i] === 'posts.profilePosts') {
                                json[i].result.data.posts.forEach(return_post_to_sandbox);
                            }
                        }
                        resolve(response);
                    });
                });
            }
        } catch(e) {
            console.error('view post source: error in fetch wrapper', e);
        }
    }
    return original_fetch.apply(this, arguments);
}

const original_EventSource = window.EventSource;
window.EventSource = function(...args) {
    const ret = new original_EventSource(...args);
    if(ret.url === 'https://cohost.org/rc/dashboard/event-stream') {
        ret.addEventListener('message', (e) => {
            const data = JSON.parse(e.data);
            data.add.forEach(return_post_to_sandbox);
        });
    }
    return ret;
};
})();
`);

})();

// ==UserScript==
// @name         Galleria
// @version      0.3.1
// @description  Sankaku Complex (Idol) Gallery Overlay
// @homepage     https://github.com/agony-central/Galleria
// @supportURL   https://github.com/agony-central/Galleria/issues
// @author       agony_central
// @include      /^https?://idol.sankakucomplex.com/?(\?[^/]+)?$/
// @require      https://code.jquery.com/jquery-3.6.2.slim.js
// @require      https://unpkg.com/react@18/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@18/umd/react-dom.production.min.js
// @icon         https://idol.sankakucomplex.com/favicon.png
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1000369
// @downloadURL https://update.greasyfork.org/scripts/456883/Galleria.user.js
// @updateURL https://update.greasyfork.org/scripts/456883/Galleria.meta.js
// ==/UserScript==

(async () => {
    const LOG_PREFIX = '[Galleria]';
    const LOG_LEVEL = 1;
    const print = (level, ...args) => {
        if (level <= LOG_LEVEL) console.info(LOG_PREFIX, ...args);
    };

    const RESOURCE_PREFIX = '__GALLERIA_';
    const rn = (name) => RESOURCE_PREFIX + name;

    const FETCH_MEDIA_RATE_LIMIT = 5000;
    const CHECK_NEW_POST_INTERVAL = 1800;
    const CHECK_NEW_PAGE_INTERVAL = 5000;
    const LOOKAHEAD_POST_COUNT = 32;

    const COMMON_CLASSNAME_POST = 'thumb';

    const { $ } = window;
    const { React } = window;
    const { ReactDOM } = window;
    const e = React.createElement;

    /**
     *
     * The page we are on stores all posts in "#content > .content"
     * however, the page has infinite scroll pagination.
     *
     * There are three details to note about the pagination:
     *
     * First: the post storage ("#content > .content") stores the
     * first page as a direct child div, with no ID.
     *
     * Second: the rest of the pages are stored as siblings of
     * the first page, with IDs of the form "content-page-n" where
     * `n` is the page number (NOT zero-indexed, starts at 2 since the
     * first page has no ID).
     *
     * Third: the first page's first element is a grouped, promotional
     * post with the ID "popular-preview", which we will ignore.
     *
     * =================================================================
     *
     * Galleria is concerned with two things:
     *
     *  [UI] overlaying a gallery on the page, that can be:
     *    a. toggled on and off
     *    b. navigated easily
     *
     *  [LOADER] keeping an actively loaded list of posts, by:
     *    a. scrolling to the bottom of the page when appropriate
     *      1. when the number of remaining posts ahead of the
     *         currently viewed post is less than LOOKAHEAD_POST_COUNT
     *    b. loading the media of posts as they are encountered
     *      1. creating an iframe to the post's page
     *      2. extracting the media from the iframe
     *      3. storing the media in the post's data
     *
     * =================================================================
     */

    /**
     * globalStore
     *
     * An object that manages the current state of the UI and LOADER
     * components of Galleria.
     */
    const globalStore = {
        ui: {
            // whether the React app is currently mounted
            mounted: false,
            // whether the gallery is currently visible
            visible: false,
            // index of the currently viewed post
            currentPostIndex: 0,
        },
        loader: {
            // last encountered page number
            lastPage: 0,
            // all posts encountered so far
            posts: [],
            // last time a post's media was loaded
            lastFetch: 0,
        },
    };

    const ref_elem_Content = $('#content .content');
    // const ref_elem_GalleryMediaStore = $(
    //     `<div id="${rn('media-store')}"></div>`
    // );
    const ref_elem_GalleryRoot = $(`<div id="${rn('root')}"></div>`).appendTo(
        'body'
    );

    /**
     * Current post React component
     */
    class CurrentPost extends React.Component {
        constructor(props) {
            super(props);
            this.iframeRef = React.createRef();

            this.pruneIframe = this.pruneIframe.bind(this);
        }

        render() {
            return e('iframe', {
                ref: this.iframeRef,
                src: this.props.data.link,
                style: {
                    boxSizing: 'border-box',
                    width: '100%',
                    height: '100%',
                    margin: 0,
                    padding: 0,
                    border: 0,
                },
                onLoad: this.pruneIframe,
            });
        }

        pruneIframe() {
            // $(this.iframeRef.current.contentDocument)
            //     .contents()
            //     .find('*')
            //     .not('#image')
            //     .remove();
        }
    }

    /**
     * Post preview (thumbnail) React component
     */
    class PostPreview extends React.Component {
        state = {
            hover: false,
        };

        constructor(props) {
            super(props);
        }

        render() {
            return e(
                'div',
                {
                    key: this.props.id,
                    index: this.props.index,
                    style: {
                        position: 'relative',
                        boxSizing: 'border-box',
                        width: '100%',
                        height: '200px',
                        margin: 0,
                        padding: 0,
                        backgroundColor: this.props.active ? 'white' : 'black',
                    },
                    onClick: () => this.props.handleClick(this.props.index),
                    onMouseEnter: () => this.setState({ hover: true }),
                    onMouseLeave: () => this.setState({ hover: false }),
                },
                [
                    e('img', {
                        src: this.props.src,
                        style: {
                            width: '100%',
                            height: '100%',
                            margin: 0,
                            padding: 0,
                            objectFit: this.state.hover ? 'contain' : 'cover',
                        },
                    }),
                    this.props.active
                        ? e('div', {
                            style: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            },
                        })
                        : undefined,
                ]
            );
        }
    }

    /**
     * Sidebar React component of loaded posts
     */
    class PostList extends React.Component {
        constructor(props) {
            super(props);
            this.ref_elem_Sidebar = React.createRef();
        }

        render() {
            return e(
                'div',
                {
                    ref: this.ref_elem_Sidebar,
                    style: {
                        display: 'inline-block',
                        boxSizing: 'border-box',
                        overflow: 'hidden scroll',
                        width: '100%',
                        height: '100%',
                        margin: 0,
                        padding: 0,
                    },
                },
                [
                    this.props.data.map((post, index) =>
                        e(PostPreview, {
                            id: post.id,
                            index,
                            src: post.thumbnail,
                            active: index == this.props.currentPostIndex,
                            handleClick: this.props.handleClick,
                        })
                    ),
                ]
            );
        }
    }

    /**
     * Root React component
     */
    class Galleria extends React.Component {
        constructor(props) {
            super(props);
            this.state = { ...props.globalStore };

            this.syncGlobalStore = this.syncGlobalStore.bind(this);
            this.toggleGallery = this.toggleGallery.bind(this);
            this.updateCurrentPostIndex =
                this.updateCurrentPostIndex.bind(this);
            this.viewNextPost = this.viewNextPost.bind(this);
            this.viewPreviousPost = this.viewPreviousPost.bind(this);
            this.handleKeyDown = this.handleKeyDown.bind(this);
        }

        componentWillMount() {
            this.props.ensureMinimumPosts();
            document.addEventListener('keydown', this.handleKeyDown);
        }

        componentDidMount() {
            globalStore.ui.mounted = true;
            this.syncGlobalStore();
        }

        componentWillUnmount() {
            globalStore.ui.mounted = false;
            document.removeEventListener('keydown', this.handleKeyDown);
        }

        syncGlobalStore() {
            this.setState({ ...this.props.globalStore });
        }

        toggleGallery(force = null) {
            if (force !== null) {
                globalStore.ui.visible = force;
            } else {
                globalStore.ui.visible = !globalStore.ui.visible;
            }

            this.syncGlobalStore();
        }

        updateCurrentPostIndex(newPostIndex) {
            globalStore.ui.currentPostIndex = newPostIndex;
            this.syncGlobalStore();

            this.props.ensureMinimumPosts();
        }

        viewNextPost() {
            const nextPostIndex = this.state.ui.currentPostIndex + 1;
            if (nextPostIndex >= this.state.loader.posts.length) return;

            this.updateCurrentPostIndex(nextPostIndex);
        }

        viewPreviousPost() {
            const previousPostIndex = this.state.ui.currentPostIndex - 1;
            if (previousPostIndex < 0) return;

            this.updateCurrentPostIndex(previousPostIndex);
        }

        handleKeyDown(e) {
            switch (e.key) {
            case 'g':
            case 'f':
                this.toggleGallery();
                break;
            case 'Escape':
                this.toggleGallery(false);
                break;
            case 'd':
            case 's':
            case 'ArrowDown':
            case 'ArrowRight':
                this.viewNextPost();
                break;
            case 'a':
            case 'w':
            case 'ArrowUp':
            case 'ArrowLeft':
                this.viewPreviousPost();
                break;
            }
        }

        render() {
            window.document.body.style.overflowY = this.state.ui.visible
                ? 'hidden'
                : 'scroll';

            return e('section', {}, [
                this.state.ui.visible
                    ? e(
                        'div',
                        {
                            style: {
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100vw',
                                height: 'calc(100vh - 50px)',
                                zIndex: 10001,
                                display: 'grid',
                                gridTemplateColumns: '1fr 4fr',
                                backgroundColor: 'black',
                                color: 'white',
                            },
                        },
                        [
                            e(PostList, {
                                data: this.state.loader.posts,
                                currentPostIndex:
                                      this.state.ui.currentPostIndex,
                                handleClick: this.updateCurrentPostIndex,
                            }),
                            e(CurrentPost, {
                                index: this.state.ui.currentPostIndex,
                                data: this.state.loader.posts[
                                    this.state.ui.currentPostIndex
                                ],
                                loadPost: () =>
                                    this.props.loadPostMediaByIndex(
                                        this.state.ui.currentPostIndex
                                    ),
                            }),
                        ]
                    )
                    : null,
                e(
                    'button',
                    {
                        onClick: this.toggleGallery,
                        style: {
                            boxSizing: 'content-box',
                            width: '100%',
                            height: '50px',
                            margin: 0,
                            position: 'fixed',
                            left: 0,
                            bottom: 0,
                            zIndex: 10002,
                            border: 0,
                            backgroundColor: 'black',
                            color: 'white',
                        },
                    },
                    'Toggle Gallery'
                ),
            ]);
        }
    }

    async function loadNewPosts(newPosts) {
        let postsLoaded = 0;
        for (let i = 0; i < newPosts.length; i++) {
            const post = newPosts[i];

            /**
             * Skip elements that don't have the class name
             * `COMMON_CLASSNAME_POST`.
             */
            if (!post.classList.contains(COMMON_CLASSNAME_POST)) continue;

            /**
             * Posts, as they are loaded, start out with an inline style
             * of "display: none;" — we iterate over each post, waiting
             * for the display to no longer be "none", and then we add
             * its ID, link, and thumbnail as an object to
             * `globalStore.loader.posts`.
             *
             * This is technically unnecessary, since the data we need
             * is already available in the DOM, but it is a good
             * idea to wait for the post to be fully loaded before
             * adding it to the globalStore.
             */
            while (post.style.display === 'none') {
                await new Promise((r) =>
                    setTimeout(r, CHECK_NEW_POST_INTERVAL)
                );
            }

            globalStore.loader.posts.push({
                id: post.id.substring(1),
                link: post.children[0].href,
                thumbnail: post.children[0].children[0].src,
            });

            if (globalStore.ui.mounted) __GALLERIA.syncGlobalStore();

            postsLoaded++;
        }

        print(2, `Loaded ${postsLoaded} new posts.`);
    }

    async function parseNewPages() {
        const lastPageInDOM = ref_elem_Content.find('.content-page').last();
        const lastPageNumber = lastPageInDOM.length
            ? parseInt(lastPageInDOM.attr('id').split('-')[2])
            : 1;

        print(2, 'Last page in DOM:', lastPageNumber);
        if (lastPageNumber == 1) return;

        /**
         * Iterate over any new pages, loading their posts.
         */
        for (
            let idx = globalStore.loader.lastPage + 1;
            idx <= lastPageNumber;
            idx++
        ) {
            const pageID = `#content-page-${idx}`;
            print(2, `Parsing page "${pageID}" [${idx}/${lastPageNumber}]...`);

            const newPosts = $(pageID).children();
            await loadNewPosts(newPosts);

            globalStore.loader.lastPage = idx;
        }
    }

    /**
     * This function is called repeatedly to check if new posts
     * need to be loaded, and if so, updates the globalStore.
     */
    async function ensureMinimumPosts() {
        print(2, 'Ensuring minimum posts...');

        /**
         * If the `globalStore.loader.lastPage` is 0, then we have not
         * yet initialized — so we load the first page while ignoring
         * the first post (the promotional post).
         */
        if (globalStore.loader.lastPage === 0) {
            print(2, 'Loading first page...');

            const newPosts = ref_elem_Content
                .children()
                .first()
                .children()
                .slice(1);
            await loadNewPosts(newPosts);

            globalStore.loader.lastPage = 1;
        }

        let prevPostCount = globalStore.loader.posts.length;
        while (
            prevPostCount - globalStore.ui.currentPostIndex <
            LOOKAHEAD_POST_COUNT
        ) {
            print(2, 'Scrolling to next "page" for more posts...');
            unsafeWindow.scrollTo(0, unsafeWindow.document.body.scrollHeight);

            // wait a split second to let the page load
            await new Promise((r) => setTimeout(r, 450));

            await parseNewPages();
            if (prevPostCount === globalStore.loader.posts.length) {
                // should have waited longer
                print(
                    1,
                    'Haven\'t found new page yet, waiting before trying again...'
                );
                await new Promise((r) =>
                    setTimeout(r, CHECK_NEW_PAGE_INTERVAL)
                );
            } else {
                prevPostCount = globalStore.loader.posts.length;
            }
        }
    }

    async function loadPostMediaByIndex(index) {
        if (
            Date.now() - globalStore.loader.lastMediaLoad <
            FETCH_MEDIA_RATE_LIMIT
        ) {
            print(2, 'Media load rate limit exceeded');
            const timeRemaining =
                FETCH_MEDIA_RATE_LIMIT -
                (Date.now() - globalStore.loader.lastMediaLoad);
            await new Promise((r) => setTimeout(r, timeRemaining));
        }

        const post = globalStore.loader.posts[index];
        if (!post) {
            print(1, 'No post found for index', index);
            return;
        }

        if (post.fullMedia) {
            print(2, 'Media already loaded for post', index);
            return;
        }

        print(2, 'Loading media for post', index);
        // use jquery to create iframe to post.link
        // then use jquery to find media in iframe
        // then use jquery to remove iframe

        const iframe = $(`<iframe src="${post.link}"></iframe>`);
        iframe.css('display', 'none');
        $('body').append(iframe);

        let iframeLoading = true;
        iframe.on('load', () => {
            iframeLoading = false;
        });

        print(2, 'Waiting for iframe to load...');
        await new Promise((r) => setTimeout(r, 2000));
        while (iframeLoading) {
            print(2, 'Still waiting for iframe to load...');
            await new Promise((r) => setTimeout(r, 2000));
        }

        const media = iframe.contents().find('#image')[0];
        print(2, 'iframe loaded with media:', media);
        post.fullMedia = iframe;

        globalStore.loader.lastMediaLoad = Date.now();
        if (globalStore.ui.mounted) __GALLERIA.syncGlobalStore();
    }

    /**
     * Initialize React application
     */
    const __GALLERIA = ReactDOM.render(
        e(Galleria, {
            globalStore,
            ensureMinimumPosts,
            loadPostMediaByIndex,
        }),
        ref_elem_GalleryRoot[0]
    );
})();

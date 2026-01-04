// ==UserScript==
// @name         Bluesky URL Mention Sidebar
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  Display a sidebar with all mentions of the current URL on Bluesky, togglable via Alt+X, with logging, disabled in iframes, drag-resizeable, closeable, updates on navigation without monkey-patching, hidden if no mentions.
//               ALSO if on a Bluesky profile page, show all that user's posts sorted by top.
// @match        *://*/*
// @exclude-match      *://localhost:*/*
// @exclude-match      *://127.0.0.1:*/*
// @grant        GM_xmlhttpRequest
// @connect      public.api.bsky.app
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521165/Bluesky%20URL%20Mention%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/521165/Bluesky%20URL%20Mention%20Sidebar.meta.js
// ==/UserScript==

(async function () {
    'use strict'

    if (window.self !== window.top) {
        console.log('[Bluesky Sidebar]: Running in iframe, script disabled')
        return
    }

    // Dynamically import dependencies
    const [React, ReactDOM, htm, bskyReactPost] = await Promise.all([
        import('https://esm.sh/react@19'),
        import('https://esm.sh/react-dom@19/client'),  // Changed to client import
        import('https://esm.sh/htm@3.1.1'),
        import('https://esm.sh/bsky-react-post@0.1.7'),
    ])

    const html = htm.default.bind(React.default.createElement)
    const {EmbeddedPost: BskyPost} = bskyReactPost

    const localCSS = `
@import url('https://unpkg.com/bsky-react-post@0.1.7/index.esm.css');

:host {
  color: initial;
  font-size: 16px;
}

.bsky-react-post-theme {
  font-size: 16px;

  /* Header */
  --post-header-font-size: 0.9375em;
  --post-header-line-height: 1.25em;

  /* Text */
  --post-body-font-size: 1.25em;
  --post-body-line-height: 1.5em;

  /* Quoted Post */
  --post-quoted-container-margin: 0.75em 0;
  --post-quoted-body-font-size: 0.938em;
  --post-quoted-body-line-height: 1.25em;
  --post-quoted-body-margin: 0.25em 0 0.75em 0;

  /* Info */
  --post-info-font-size: 0.9375em;
  --post-info-line-height: 1.25em;

  /* Actions like the like, reply and copy buttons */
  --post-actions-font-size: 0.875em;
  --post-actions-line-height: 1em;
  --post-actions-icon-size: 1.25em;

  /* Reply button */
  --post-replies-font-size: 0.875em;
  --post-replies-line-height: 1em;
}
    
    
#bluesky-sidebar {
    position: fixed;
    top: 50px;
    right: 0;
    width: 450px;
    height: calc(100vh - 50px);
    background: #ffffff;
    border-left: 1px solid #e0e0e0;
    box-sizing: border-box;
    display: none;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    /*color: black;*/
    z-index: 10000;

    /* Make the entire sidebar a flex container so header stays at top */
    display: flex;
    flex-direction: column;
}

@media (prefers-color-scheme: dark) {
  #bluesky-sidebar {
    /*color: #ffffff;*/
  }
}

.bluesky-resize-handle {
    position: absolute;
    left: -3px;
    top: 0;
    width: 6px;
    height: 100%;
    cursor: ew-resize;
    background: transparent;
    z-index: 10001;
}
.bluesky-sidebar-header {
    flex: 0 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e0e0e0;
    padding: 16px;
}
.bluesky-sidebar-header > h2 {
    margin: 0;
    font-size: 22px;
}
.bluesky-sidebar-content {
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
}
.bluesky-close-btn {
    background: transparent;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #536471;
}
.bluesky-close-btn:hover {
    background: #f7f7f7;
    border-radius: 4px;
}
.bsky-react-post-theme {
    margin-bottom: 1em;
}
.bsky-react-post-theme a {
    text-decoration: none;
}
img, video {
    max-width: 100%;
    height: auto;
}
`
    const combinedCSS = localCSS

    // Components
    const Post = ({post}) => {
        return html`
            <${BskyPost} thread=${{post, parent: null, replies: []}}/>
        `
    }

    const Sidebar = ({posts, onClose, isLoading, width, handleResizeStart, sidebarRef}) => {
        return html`
            <div id="bluesky-sidebar" ref=${sidebarRef} style=${{width: `${width}px`}}>
                <div className="bluesky-resize-handle" onMouseDown=${handleResizeStart}></div>
                <div className="bluesky-sidebar-header">
                    <h2>Bluesky Mentions</h2>
                    <button className="bluesky-close-btn" onClick=${onClose}>×</button>
                </div>
                <div className="bluesky-sidebar-content">
                    ${
                            isLoading
                                    ? html`<p>Loading...</p>`
                                    : posts.length
                                            ? posts.map(post => html`
                                                <${Post} key=${post.uri} post=${post}/>`)
                                            : html`<p>No mentions found.</p>`
                    }
                </div>
            </div>
        `
    }

    const getPosts = (data) => {
        if (!data?.posts) return []
        return data.posts.map(post => ({
            ...post,
            author: {
                ...post.author,
                labels: post.author.labels?.filter(l => l.val !== "!no-unauthenticated"),
            },
        }))
    }

    const App = () => {
        const [posts, setPosts] = React.default.useState([])
        const [isLoading, setIsLoading] = React.default.useState(false)
        const [isVisible, setIsVisible] = React.default.useState(false)
        const [width, setWidth] = React.default.useState(450)
        const sidebarRef = React.default.useRef(null)
        const lastUrl = React.default.useRef(window.location.href)

        const fetchMentions = React.default.useCallback(async () => {
            setIsLoading(true)
            const handle = await extractProfileHandle()
            const query = handle ? `from:${handle}` : window.location.href
            const apiUrl = `https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=${encodeURIComponent(query)}&sort=top`
            console.log('[Bluesky Sidebar]: Fetching mentions:', apiUrl)

            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: apiUrl,
                        headers: {'Accept': 'application/json'},
                        onload: resolve,
                        onerror: reject,
                    })
                })

                const data = JSON.parse(response.responseText)
                const newPosts = getPosts(data)
                setPosts(newPosts)

                // Only show sidebar if we got some results
                if (newPosts.length > 0) {
                    setIsVisible(true)
                }
            } catch (error) {
                console.error('[Bluesky Sidebar]: Error fetching mentions:', error)
                setPosts([])
            } finally {
                setIsLoading(false)
            }
        }, [])

        React.default.useEffect(() => {
            fetchMentions()
        }, [])

        React.default.useEffect(() => {
            const handleKeyDown = (e) => {
                // Alt+X toggles the sidebar
                if (e.altKey && e.code === 'KeyX') {
                    setIsVisible(v => !v)
                }
            }

            const checkUrlChange = () => {
                if (window.location.href !== lastUrl.current) {
                    lastUrl.current = window.location.href
                    fetchMentions()
                }
            }

            document.addEventListener('keydown', handleKeyDown)
            window.addEventListener('popstate', checkUrlChange)

            // Fallback interval to detect SPA navigations
            const interval = setInterval(checkUrlChange, 1000)

            return () => {
                document.removeEventListener('keydown', handleKeyDown)
                window.removeEventListener('popstate', checkUrlChange)
                clearInterval(interval)
            }
        }, [fetchMentions, posts.length])

        // Handle drag-resizing
        const handleResizeStart = React.default.useCallback((e) => {
            const startX = e.clientX
            const startWidth = width

            const handleMouseMove = (e) => {
                const deltaX = startX - e.clientX
                const newWidth = Math.max(startWidth + deltaX, 150)
                setWidth(newWidth)
            }

            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove)
                document.removeEventListener('mouseup', handleMouseUp)
            }

            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }, [width])

        // Render nothing if sidebar isn't visible
        if (!isVisible) return null

        return html`
            <${Sidebar}
                    posts=${posts}
                    isLoading=${isLoading}
                    onClose=${() => setIsVisible(false)}
                    width=${width}
                    handleResizeStart=${handleResizeStart}
                    sidebarRef=${sidebarRef}
            />
        `
    }

    async function extractProfileHandle() {
        // If we are on a Bluesky profile page, we'll show that user's top posts
        if (window.location.host !== 'bsky.app') return null
        const match = window.location.pathname.match(/\/profile\/([^/]+)$/)
        const rawHandle = match?.[1] ? decodeURIComponent(match[1]) : null
        return isDidPlc(rawHandle) ? fetchHandleFromDidPlc(rawHandle) : rawHandle
    }

    const isDidPlc = handle => /^did:plc:[a-zA-Z0-9]{24}$/.test(handle)

    function fetchHandleFromDidPlc(didPlc) {
        const url = `https://plc.directory/${didPlc}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Accept': 'application/json',
                },
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            const alsoKnownAs = data.alsoKnownAs;
                            if (Array.isArray(alsoKnownAs) && alsoKnownAs.length > 0) {
                                // Extract the handle from the at:// URI
                                const handle = alsoKnownAs[0].replace('at://', '');
                                resolve(handle);
                            } else {
                                reject(new Error('No associated handle found.'));
                            }
                        } catch (error) {
                            reject(new Error('Error parsing response JSON.'));
                        }
                    } else {
                        reject(new Error(`Request failed with status: ${response.status}`));
                    }
                },
                onerror: function() {
                    reject(new Error('Network error occurred.'));
                }
            });
        });
    }

    // --- Create a Shadow DOM and render the app there ---
    const hostEl = document.createElement('div')
    hostEl.id = 'bluesky-host'
    document.body.appendChild(hostEl)

    const shadowRoot = hostEl.attachShadow({mode: 'open'})

    // Inject combined CSS inside shadow root instead of the main document
    const styleEl = document.createElement('style')
    styleEl.textContent = combinedCSS
    shadowRoot.appendChild(styleEl)

    // Create container for React
    const containerEl = document.createElement('div')
    containerEl.id = 'bluesky-root'
    shadowRoot.appendChild(containerEl)

    // Render the React app into the shadow root
    const reactRoot = ReactDOM.default.createRoot(containerEl)
    reactRoot.render(React.default.createElement(App))
})()

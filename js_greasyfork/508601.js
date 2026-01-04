// ==UserScript==
// @name         Fast Search
// @namespace    fast-search
// @version      0.1.6
// @description  Quickly search various sites using custom shortcuts with an improved UI.
// @author       JJJ
// @icon         https://th.bing.com/th/id/OUG.FC606EBD21BF6D1E0D5ABF01EACD594E?rs=1&pid=ImgDetMain
// @match        *://*/*
// @exclude      https://www.youtube.com/*/videos
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        window.focus
// @run-at       document-end
// @require      https://unpkg.com/react@17/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@17/umd/react-dom.production.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508601/Fast%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/508601/Fast%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===================================================
    // CONFIGURATION
    // ===================================================
    const SEARCH_ENGINES = {
        // Search
        a: { name: "Amazon", url: "https://www.amazon.com/s?k=" },
        g: { name: "Google", url: "https://www.google.com/search?q=" },
        b: { name: "Bing", url: "https://www.bing.com/search?q=" },
        d: { name: "DuckDuckGo", url: "https://duckduckgo.com/?q=" },
        gs: { name: "Google Scholar", url: "https://scholar.google.com/scholar?q=" },
        gi: { name: "Google Images", url: "https://www.google.com/search?tbm=isch&q=" },
        ar: { name: "Internet Archive", url: "https://archive.org/search.php?query=" },
        way: { name: "Wayback Machine", url: "https://web.archive.org/web/*/" },
        w: { name: "Wikipedia", url: "https://en.wikipedia.org/w/index.php?search=" },
        p: { name: "Perplexity", url: "https://www.perplexity.ai/?q=" },

        // Coding
        gf: { name: "Greasy Fork", url: "https://greasyfork.org/en/scripts?q=" },
        gh: { name: "GitHub", url: "https://github.com/search?q=" },
        so: { name: "Stack Overflow", url: "https://stackoverflow.com/search?q=" },

        // Social
        r: { name: "Reddit", url: "https://www.reddit.com/search/?q=" },
        li: { name: "LinkedIn", url: "https://www.linkedin.com/search/results/all/?keywords=" },
        t: { name: "Twitch", url: "https://www.twitch.tv/search?term=" },
        x: { name: "Twitter", url: "https://twitter.com/search?q=" },
        f: { name: "Facebook", url: "https://www.facebook.com/search/top/?q=" },
        i: { name: "Instagram", url: "https://www.instagram.com/explore/tags/" },
        pi: { name: "Pinterest", url: "https://www.pinterest.com/search/pins/?q=" },
        tu: { name: "Tumblr", url: "https://www.tumblr.com/search/" },
        q: { name: "Quora", url: "https://www.quora.com/search?q=" },
        sc: { name: "SoundCloud", url: "https://soundcloud.com/search?q=" },
        y: { name: "YouTube", url: "https://www.youtube.com/results?search_query=" },
        tk: { name: "TikTok", url: "https://www.tiktok.com/search?q=" },
        fi: { name: "Find That Meme", url: "https://findthatmeme.com/?search=" },
        sp: { name: "Spotify", url: "https://open.spotify.com/search/" },

        // Gaming
        steam: { name: "Steam", url: "https://store.steampowered.com/search/?term=" },
        epic: { name: "Epic Games", url: "https://store.epicgames.com/en-US/browse?q=" },
        gog: { name: "GOG", url: "https://www.gog.com/games?search=" },
        ubi: { name: "Ubisoft", url: "https://store.ubi.com/us/search?q=" },
        g2: { name: "G2A", url: "https://www.g2a.com/search?query=" },
        cd: { name: "CDKeys", url: "https://www.cdkeys.com/catalogsearch/result/?q=" },
        ori: { name: "Origin", url: "https://www.origin.com/search?searchString=" },
        bat: { name: "Battle.net", url: "https://shop.battle.net/search?q=" },

        // Movies and TV Shows
        c: { name: "Cuevana", url: "https://wow.cuevana3.nu/search?s=" },
        lm: { name: "LookMovie (Movies)", url: "https://www.lookmovie2.to/movies/search/?q=" },
        ls: { name: "LookMovie (Shows)", url: "https://www.lookmovie2.to/shows/search/?q=" },
    };

    // ===================================================
    // UTILITY FUNCTIONS
    // ===================================================
    const Utils = {
        /**
         * Check if the focus is in an editable element
         * @returns {boolean} True if focus is in editable element
         */
        isFocusInEditable: () => {
            const el = document.activeElement;
            return el.isContentEditable || ['input', 'textarea'].includes(el.tagName.toLowerCase());
        },

        /**
         * Construct search URL from shortcut and query
         * @param {string} shortcut - The search engine shortcut
         * @param {string} query - The search query
         * @returns {string} The constructed search URL
         */
        constructSearchUrl: (shortcut, query) => {
            const engine = SEARCH_ENGINES[shortcut] || SEARCH_ENGINES.g;
            if (!query.trim()) {
                // Extract base domain using regex
                const match = engine.url.match(/^https?:\/\/([\w.-]+\.[a-z]{2,})/);
                return match ? `https://${match[1]}/` : engine.url;
            }
            let baseUrl = engine.url;
            if (shortcut === 'epic') {
                baseUrl += `${encodeURIComponent(query)}&sortBy=relevancy&sortDir=DESC&count=40`;
            } else {
                baseUrl += encodeURIComponent(query);
            }
            return baseUrl;
        },

        /**
         * Get selected text from the page
         * @returns {string} The currently selected text
         */
        getSelectedText: () => {
            return window.getSelection().toString().trim();
        },

        /**
         * Filter search engines based on input
         * @param {string} input - The user input
         * @returns {Array} Array of matching engine options
         */
        filterSearchEngines: (input) => {
            if (!input) return [];
            const searchTerm = input.toLowerCase();
            return Object.entries(SEARCH_ENGINES)
                .filter(([shortcut, engine]) => {
                    return shortcut.toLowerCase().includes(searchTerm) ||
                        engine.name.toLowerCase().includes(searchTerm);
                })
                .slice(0, 6) // Limit to 6 suggestions
                .map(([shortcut, engine]) => ({
                    shortcut,
                    name: engine.name
                }));
        },

        /**
         * Safely remove event listeners
         * @param {Element} element - DOM element
         * @param {string} eventType - Event type
         * @param {Function} handler - Event handler
         */
        safeRemoveEventListener: (element, eventType, handler) => {
            if (element && typeof element.removeEventListener === 'function') {
                element.removeEventListener(eventType, handler);
            }
        }
    };

    // ===================================================
    // SEARCH FUNCTIONS
    // ===================================================
    const SearchActions = {
        /**
         * Open search URL based on openMode setting
         * @param {string} url - The URL to open
         * @param {string} openMode - The mode to open the URL ('currenttab' or 'newwindow')
         */
        openSearch: (url, openMode) => {
            if (openMode === 'currenttab') {
                window.location.href = url;
            } else {
                window.open(url, '', 'width=800,height=600,noopener');
            }
        },

        /**
         * Search multiple gaming platforms
         * @param {string} query - The search query
         * @param {string} openMode - The mode to open the URLs
         */
        searchMultipleGamingPlatforms: (query, openMode) => {
            const platforms = ['g2', 'cd'];
            platforms.forEach(platform => {
                const searchUrl = Utils.constructSearchUrl(platform, query);
                SearchActions.openSearch(searchUrl, openMode);
            });
        }
    };

    // ===================================================
    // REACT COMPONENTS
    // ===================================================

    /**
     * EngineSuggestions Component - Display search engine suggestions
     */
    const EngineSuggestions = React.memo(({
        suggestions,
        selectedIndex,
        onSelectSuggestion
    }) => {
        if (!suggestions || suggestions.length === 0) return null;

        return React.createElement('div', {
            className: 'absolute left-0 right-0 top-full mt-1 bg-custom-darker rounded-md shadow-lg z-10 max-h-64 overflow-y-auto'
        },
            React.createElement('ul', { className: 'py-1' },
                suggestions.map((suggestion, index) =>
                    React.createElement('li', {
                        key: suggestion.shortcut,
                        className: `px-3 py-2 cursor-pointer hover:bg-blue-600 text-white ${index === selectedIndex ? 'bg-blue-600' : ''}`,
                        onClick: () => onSelectSuggestion(suggestion.shortcut)
                    },
                        React.createElement('span', { className: 'inline-block min-w-[40px] font-mono text-blue-400' }, suggestion.shortcut),
                        ': ',
                        suggestion.name
                    )
                )
            )
        );
    });

    /**
     * SearchInput Component - Handles user input for search with keyboard navigation
     */
    const SearchInput = React.memo(({
        input,
        setInput,
        handleSearch,
        currentEngine,
        engineOptions = []
    }) => {
        const inputRef = React.useRef(null);
        const [showSuggestions, setShowSuggestions] = React.useState(false);
        const [selectedIndex, setSelectedIndex] = React.useState(-1);
        const [suggestions, setSuggestions] = React.useState([]);

        // Generate engine suggestions based on input
        React.useEffect(() => {
            const engineSuggestions = Utils.filterSearchEngines(input);
            setSuggestions(engineSuggestions);
            // Reset selection when suggestions change
            setSelectedIndex(-1);

            // Cleanup unnecessary references
            return () => {
                setSuggestions([]);
            };
        }, [input]);

        React.useEffect(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }

            // Cleanup function to help garbage collection
            return () => {
                inputRef.current = null;
            };
        }, []);

        const handleKeyDown = React.useCallback((e) => {
            // Handle arrow navigation for engine suggestions
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setShowSuggestions(true);
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
            }
            else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setShowSuggestions(true);
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
            }
            else if (e.key === 'Tab') {
                // Cycle through common engine shortcuts with Tab
                e.preventDefault();
                const commonShortcuts = ['g', 'y', 'w', 'r', 'a'];
                const currentShortcut = input.split(' ')[0];
                const currentIndex = commonShortcuts.indexOf(currentShortcut);
                const nextShortcut = commonShortcuts[(currentIndex + 1) % commonShortcuts.length];

                // Replace the current shortcut or add a new one
                if (currentIndex >= 0) {
                    const rest = input.substring(currentShortcut.length);
                    setInput(nextShortcut + rest);
                } else {
                    setInput(nextShortcut + ' ' + input);
                }
            }
            else if (e.key === 'Enter') {
                // Apply selected suggestion or perform search
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    const selectedShortcut = suggestions[selectedIndex].shortcut;
                    setInput(selectedShortcut + ' ');
                    setSelectedIndex(-1);
                    setShowSuggestions(false);
                } else {
                    handleSearch();
                }
            }
            else if (e.key === 'Escape') {
                // Close suggestions panel
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
            // Reset selection when typing regular characters
            else if (e.key.length === 1) {
                setShowSuggestions(true);
            }
        }, [input, suggestions, selectedIndex, setInput, handleSearch]);

        const handleSelectSuggestion = React.useCallback((shortcut) => {
            setInput(shortcut + ' ');
            setShowSuggestions(false);
            setSelectedIndex(-1);
            setTimeout(() => inputRef.current?.focus(), 10);
        }, [setInput]);

        return React.createElement('div', { className: 'flex flex-col mb-4 relative' },
            React.createElement('div', { className: 'flex gap-2 items-center' },
                currentEngine && React.createElement('div', {
                    className: 'bg-blue-600 text-white text-sm px-2 py-1 rounded'
                }, currentEngine.name),
                React.createElement('input', {
                    ref: inputRef,
                    type: 'text',
                    value: input,
                    onChange: (e) => setInput(e.target.value),
                    onKeyDown: handleKeyDown,
                    onFocus: () => setShowSuggestions(true),
                    onBlur: () => setTimeout(() => setShowSuggestions(false), 200),
                    placeholder: 'Enter search command...',
                    className: 'flex-1 px-3 py-2 bg-custom-darker border-0 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                })
            ),
            showSuggestions && suggestions.length > 0 && React.createElement(EngineSuggestions, {
                suggestions,
                selectedIndex,
                onSelectSuggestion: handleSelectSuggestion
            })
        );
    });

    /**
     * ModeSwitcher Component - Toggles between current tab and new window modes
     */
    const ModeSwitcher = React.memo(({ openMode, setOpenMode }) => {
        const toggleMode = React.useCallback(() => {
            setOpenMode(openMode === 'currenttab' ? 'newwindow' : 'currenttab');
        }, [openMode, setOpenMode]);

        return React.createElement('div', { className: 'mb-4 flex items-center justify-between' },
            React.createElement('div', { className: 'flex items-center gap-3' },
                React.createElement('button', {
                    onClick: toggleMode,
                    className: 'toggle-button-switch flex items-center justify-start'
                },
                    React.createElement('div', {
                        className: `toggle-slider ${openMode === 'currenttab' ? 'active' : ''}`
                    })
                ),
                React.createElement('span', { className: 'text-gray-300 text-sm leading-none' },
                    openMode === 'newwindow' ? 'New Window' : 'Current Tab'
                )
            )
        );
    });

    /**
     * SearchResults Component - Displays search results
     */
    const SearchResults = React.memo(({ results }) => {
        return React.createElement('div', { className: 'space-y-2' },
            results.map((result, index) =>
                React.createElement('div', { key: index, className: 'text-sm' },
                    result.type === 'link'
                        ? React.createElement('a', {
                            href: result.url,
                            target: '_blank',
                            rel: 'noopener noreferrer',
                            className: 'text-blue-400 hover:text-blue-300 hover:underline'
                        }, result.message)
                        : React.createElement('span', {
                            className: 'text-gray-300'
                        }, result.message)
                )
            )
        );
    });

    /**
     * HelpContent Component - Shows the help modal content
     */
    const HelpContent = React.memo(({ onClose }) => {
        return React.createElement('div', {
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[2147483647]',
            onClick: onClose
        },
            React.createElement('div', {
                className: 'bg-custom-dark p-6 rounded-lg max-w-4xl max-h-[80vh] overflow-y-auto text-white w-full mx-4',
                onClick: e => e.stopPropagation()
            },
                React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                    React.createElement('h3', { className: 'text-lg font-bold' }, 'Fast Search Help'),
                    React.createElement('button', {
                        onClick: onClose,
                        className: 'text-gray-400 hover:text-white text-xl'
                    }, '×')
                ),
                React.createElement('div', { className: 'grid grid-cols-2 gap-6' },
                    // Left column - Shortcuts
                    React.createElement('div', null,
                        React.createElement('h4', { className: 'text-blue-400 font-bold mb-3' }, 'Search Shortcuts'),
                        Object.entries({
                            'Search': ['a', 'g', 'b', 'd', 'gs', 'gi', 'ar', 'way', 'w', 'p'],
                            'Coding': ['gf', 'gh', 'so'],
                            'Social': ['r', 'li', 't', 'x', 'f', 'i', 'pi', 'tu', 'q', 'sc', 'y', 'tk', 'fi', 'sp'],
                            'Gaming': ['steam', 'epic', 'gog', 'ubi', 'g2', 'cd', 'ori', 'bat'],
                            'Movies and TV Shows': ['c', 'lm', 'ls']
                        }).map(([category, shortcuts]) =>
                            React.createElement('div', { key: category, className: 'mb-4' },
                                React.createElement('h5', { className: 'text-gray-300 font-bold mb-2 text-sm' }, category),
                                React.createElement('ul', { className: 'space-y-1' },
                                    shortcuts.map(shortcut =>
                                        React.createElement('li', { key: shortcut, className: 'text-sm' },
                                            React.createElement('code', { className: 'bg-custom-darker px-1 rounded' }, shortcut),
                                            ': ',
                                            SEARCH_ENGINES[shortcut].name
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    // Right column - Usage & Options
                    React.createElement('div', null,
                        React.createElement('div', { className: 'mb-6' },
                            React.createElement('h4', { className: 'text-blue-400 font-bold mb-3' }, 'Opening Options'),
                            React.createElement('div', { className: 'bg-custom-darker p-4 rounded-lg' },
                                React.createElement('ul', { className: 'space-y-3' },
                                    React.createElement('li', { className: 'text-sm' },
                                        React.createElement('span', { className: 'text-blue-400 font-bold' }, 'New Window: '),
                                        'Opens search in a popup window'
                                    ),
                                    React.createElement('li', { className: 'text-sm' },
                                        React.createElement('span', { className: 'text-blue-400 font-bold' }, 'Current Tab: '),
                                        'Replaces current page with search'
                                    )
                                )
                            )
                        ),
                        React.createElement('div', { className: 'mb-6' },
                            React.createElement('h4', { className: 'text-blue-400 font-bold mb-3' }, 'Usage Tips'),
                            React.createElement('ul', { className: 'space-y-2 text-sm' },
                                React.createElement('li', null, '• Press ',
                                    React.createElement('code', { className: 'bg-custom-darker px-1 rounded' }, 'Insert'),
                                    ' to open Fast Search'
                                ),
                                React.createElement('li', null, '• Type shortcut followed by search terms'),
                                React.createElement('li', null, '• Press ',
                                    React.createElement('code', { className: 'bg-custom-darker px-1 rounded' }, 'Enter'),
                                    ' to search'
                                ),
                                React.createElement('li', null, '• Press ',
                                    React.createElement('code', { className: 'bg-custom-darker px-1 rounded' }, 'Esc'),
                                    ' to close'
                                ),
                                React.createElement('li', null, '• Type shortcut only to visit site homepage')
                            )
                        )
                    )
                )
            )
        );
    });

    /**
     * BotInterface Component - Main component for the search interface
     */
    const BotInterface = React.memo(({ onClose, initialQuery = '' }) => {
        const [input, setInput] = React.useState(initialQuery);
        const [results, setResults] = React.useState([]);
        const [currentEngine, setCurrentEngine] = React.useState(null);
        const [openMode, setOpenMode] = React.useState(() => {
            return GM_getValue('fastsearch_openmode', 'newwindow');
        });
        const [showHelp, setShowHelp] = React.useState(false);

        // Track previous active element to restore focus when unmounting
        const previousActiveElement = React.useRef(document.activeElement);

        // Create a list of engine shortcuts for keyboard navigation
        const engineOptions = React.useMemo(() => {
            return Object.keys(SEARCH_ENGINES);
        }, []);

        // Save openMode changes
        React.useEffect(() => {
            GM_setValue('fastsearch_openmode', openMode);
        }, [openMode]);

        // Handle escape key to close
        React.useEffect(() => {
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    onClose();
                }
            };

            document.addEventListener('keydown', handleEscape);
            return () => {
                Utils.safeRemoveEventListener(document, 'keydown', handleEscape);

                // Restore focus to previous element when unmounting
                if (previousActiveElement.current) {
                    try {
                        previousActiveElement.current.focus();
                    } catch (e) {
                        // Ignore focus errors
                    }
                }
            };
        }, [onClose]);

        // Update current engine based on input
        React.useEffect(() => {
            const [shortcut] = input.trim().split(/\s+/);
            const engine = SEARCH_ENGINES[shortcut.toLowerCase()];
            setCurrentEngine(engine || null);

            // Clear references on unmount
            return () => {
                setCurrentEngine(null);
            };
        }, [input]);

        // Memoized search handler
        const handleSearch = React.useCallback(() => {
            const [rawShortcut, ...queryParts] = input.trim().split(/\s+/);
            const shortcut = rawShortcut.toLowerCase();
            const query = queryParts.join(" ");

            let newResults = [];

            if (shortcut === 'sg') {
                newResults.push({ type: 'info', message: 'Searching multiple gaming platforms...' });
                SearchActions.searchMultipleGamingPlatforms(query, openMode);
            } else if (SEARCH_ENGINES.hasOwnProperty(shortcut)) {
                const searchUrl = Utils.constructSearchUrl(shortcut, query || '');
                const siteName = SEARCH_ENGINES[shortcut].name;
                newResults.push({ type: 'link', url: searchUrl, message: `Searching ${siteName} for "${query}"` });
                SearchActions.openSearch(searchUrl, openMode);
            } else {
                const searchUrl = SEARCH_ENGINES.g.url + encodeURIComponent(input);
                newResults.push({ type: 'link', url: searchUrl, message: `Searching Google for "${input}"` });
                SearchActions.openSearch(searchUrl, openMode);
            }

            setResults(prevResults => [...newResults, ...prevResults]);
            setInput('');

            // Close the UI after performing the search
            setTimeout(() => {
                onClose();
            }, 100);
        }, [input, openMode, onClose]);

        // Toggle help dialog
        const toggleHelp = React.useCallback(() => {
            setShowHelp(prev => !prev);
        }, []);

        return React.createElement('div', { className: 'fixed top-4 right-4 min-w-[20rem] max-w-[30rem] w-[90vw] bg-custom-dark shadow-lg rounded-lg overflow-hidden' },
            React.createElement('div', { className: 'p-4 relative' },
                // Header
                React.createElement('div', { className: 'flex justify-between items-center mb-4' },
                    React.createElement('h2', { className: 'text-lg font-bold text-white' }, 'Fast Search'),
                    React.createElement('button', {
                        onClick: onClose,
                        className: 'text-gray-400 hover:text-gray-200'
                    }, '×')
                ),
                // Search input
                React.createElement(SearchInput, {
                    input,
                    setInput,
                    handleSearch,
                    currentEngine,
                    engineOptions
                }),
                // Mode switcher and help button
                React.createElement('div', { className: 'mb-4 flex items-center justify-between' },
                    React.createElement(ModeSwitcher, {
                        openMode,
                        setOpenMode
                    }),
                    React.createElement('button', {
                        onClick: toggleHelp,
                        className: 'bg-custom-darker text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors'
                    }, '❔')
                ),
                // Search results
                React.createElement(SearchResults, { results }),
                // Help modal
                showHelp && React.createElement(HelpContent, { onClose: toggleHelp })
            )
        );
    });

    // ===================================================
    // MAIN APP INITIALIZATION
    // ===================================================
    const App = {
        botContainer: null,
        observer: null,
        eventListeners: [],

        /**
         * Register event listener with automatic cleanup
         * @param {Element} element - DOM element
         * @param {string} eventType - Event type
         * @param {Function} handler - Event handler
         * @param {boolean|object} options - Event listener options
         */
        registerEventListener: (element, eventType, handler, options = false) => {
            if (!element || !eventType || !handler) return;

            element.addEventListener(eventType, handler, options);
            App.eventListeners.push({ element, eventType, handler, options });
        },

        /**
         * Clean up resources to prevent memory leaks
         */
        cleanup: () => {
            // Clean up React components properly
            if (App.botContainer) {
                ReactDOM.unmountComponentAtNode(App.botContainer);
                App.botContainer.remove();
                App.botContainer = null;
            }

            // Disconnect mutation observer if it exists
            if (App.observer) {
                App.observer.disconnect();
                App.observer = null;
            }

            // Remove all registered event listeners
            App.eventListeners.forEach(({ element, eventType, handler, options }) => {
                Utils.safeRemoveEventListener(element, eventType, handler, options);
            });
            App.eventListeners = [];
        },

        /**
         * Show the search interface with optional initial query
         * @param {string} initialQuery - Text to prefill in search input
         */
        showBot: (initialQuery = '') => {
            // Clean up any existing instances first to prevent duplicates
            App.cleanup();

            App.botContainer = document.createElement('div');
            document.body.appendChild(App.botContainer);

            ReactDOM.render(
                React.createElement(BotInterface, {
                    onClose: () => {
                        App.cleanup();
                    },
                    initialQuery: initialQuery
                }),
                App.botContainer
            );

            // Set up mutation observer to detect if our container gets removed
            App.observer = new MutationObserver((mutations) => {
                if (!document.body.contains(App.botContainer) && App.botContainer !== null) {
                    App.cleanup();
                }
            });

            // Watch for changes to document.body
            App.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        /**
         * Initialize the application
         */
        init: () => {
            // Event listener for Insert key
            App.registerEventListener(document, 'keydown', event => {
                if (event.key === 'Insert' && !Utils.isFocusInEditable()) {
                    event.preventDefault();

                    // Use selected text as initial query if available
                    const selectedText = Utils.getSelectedText();
                    App.showBot(selectedText);
                }
            }, true);

            // Register context menu command
            GM_registerMenuCommand("Fast Search", () => {
                const selectedText = Utils.getSelectedText();
                App.showBot(selectedText);
            });

            // Add context menu functionality for right-clicking on selected text
            App.registerEventListener(document, 'mousedown', event => {
                // Only handle right-click events
                if (event.button === 2) {
                    const selectedText = Utils.getSelectedText();
                    if (selectedText) {
                        // Store the selected text so we can use it later if the context menu command is chosen
                        GM_setValue('fastsearch_selected_text', selectedText);
                    }
                }
            });

            // Cleanup on page unload
            App.registerEventListener(window, 'beforeunload', App.cleanup);

            // Cleanup on page visibility change (helps with some browsers/scenarios)
            App.registerEventListener(document, 'visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    // Perform partial cleanup when page is hidden
                    if (App.botContainer) {
                        ReactDOM.unmountComponentAtNode(App.botContainer);
                    }
                }
            });
        }
    };

    // Add styles
    GM_addStyle(`
        .fixed { position: fixed; }
        .top-4 { top: 1rem; }
        .right-4 { right: 1rem; }
        .w-80 { width: 20rem; }
        .bg-custom-dark { background-color: #030d22; }
        .bg-custom-darker { background-color: #15132a; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2); }
        .rounded-lg { border-radius: 0.5rem; }
        .overflow-hidden { overflow: hidden; }
        /* Add very high z-index to ensure it's above everything */
        .fixed.top-4.right-4 { z-index: 2147483647; }
        .p-4 { padding: 1rem; }
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .items-center { align-items: center; }
        .mb-4 { margin-bottom: 1rem; }
        .text-lg { font-size: 1.125rem; }
        .font-bold { font-weight: 700; }
        .text-white { color: white; }
        .text-gray-200 { color: #e5e7eb; }
        .text-gray-300 { color: #d1d5db; }
        .text-gray-400 { color: #9ca3af; }
        .hover\\:text-gray-200:hover { color: #e5e7eb; }
        .w-full { width: 100%; }
        .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
        .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
        .rounded-l-md { border-top-left-radius: 0.375rem; border-bottom-left-radius: 0.375rem; }
        .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
        .focus\\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
        .focus\\:ring-blue-500:focus { --tw-ring-opacity: 1; --tw-ring-color: rgba(59, 130, 246, var(--tw-ring-opacity)); }
        .px-4 { padding-left: 1rem; padding-right: 1rem; }
        .bg-blue-600 { background-color: #2563eb; }
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8; }
        .text-blue-400 { color: #60a5fa; }
        .hover\\:text-blue-300:hover { color: #93c5fd; }
        .rounded-r-md { border-top-right-radius: 0.375rem; border-bottom-right-radius: 0.375rem; }
        .space-y-2 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(0.5rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(0.5rem * var(--tw-space-y-reverse)); }
        .text-sm { font-size: 0.875rem; }
        .hover\\:underline:hover { text-decoration: underline; }
        .placeholder-gray-400::placeholder { color: #9ca3af; }
        .relative { position: relative; }
        .transform { transform: var(--tw-transform); }
        .-translate-y-1/2 { --tw-translate-y: -50%; transform: var(--tw-transform); }
        .text-xs { font-size: 0.75rem; line-height: 1rem; }
        .pl-24 { padding-left: 6rem; }
        .top-1/2 { top: 50%; }
        .left-2 { left: 0.5rem; }
        .min-w-\\[20rem\\] { min-width: 20rem; }
        .max-w-\\[30rem\\] { max-width: 30rem; }
        .w-\\[90vw\\] { width: 90vw; }
        .gap-2 { gap: 0.5rem; }
        .flex-1 { flex: 1 1 0%; }
        .flex-shrink-0 { flex-shrink: 0; }
        .whitespace-nowrap { white-space: nowrap; }
        .rounded-md { border-radius: 0.375rem; }
        .min-w-\\[80px\\] { min-width: 80px; }
        .-translate-y-6 { --tw-translate-y: -1.5rem; }
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }
        .toggle-checkbox {
            opacity: 0;
            width: 0;
            height: 0;
        }
        .toggle-label {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #15132a;
            transition: .4s;
            border-radius: 24px;
        }
        .toggle-button {
            position: absolute;
            height: 20px;
            width: 20px;
            left: 2px;
            bottom: 2px;
            background-color: #2563eb;
            transition: .4s;
            border-radius: 50%;
        }
        .toggle-checkbox:checked + .toggle-label .toggle-button {
            transform: translateX(26px);
        }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .gap-6 { gap: 1.5rem; }
        .bg-custom-darker { background-color: #15132a; }
        .p-6 { padding: 1.5rem; }
        .max-w-4xl { max-width: 56rem; }
        .max-h-\\[80vh\\] { max-height: 80vh; }
        .overflow-y-auto { overflow-y: auto; }
        .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; }
        .toggle-button-switch {
            position: relative;
            width: 50px;
            height: 24px;
            background-color: #15132a;
            border-radius: 24px;
            padding: 2px;
            border: none;
            cursor: pointer;
            outline: none;
            display: flex;
            align-items: center;
        }
        .toggle-slider {
            position: absolute;
            height: 20px;
            width: 20px;
            background-color: #2563eb;
            border-radius: 50%;
            transition: transform 0.3s;
        }
        .toggle-slider.active {
            transform: translateX(26px);
        }
        .gap-3 {
            gap: 0.75rem;
        }
        .leading-none {
            line-height: 1;
        }
        .hover\\:bg-blue-600:hover {
            background-color: #2563eb;
        }
        .transition-colors {
            transition-property: color, background-color, border-color;
            transition-duration: 0.15s;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* New styles for engine suggestions */
        .flex-col {
            flex-direction: column;
        }
        
        .top-full {
            top: 100%;
        }
        
        .mt-1 {
            margin-top: 0.25rem;
        }
        
        .py-1 {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
        }
        
        .max-h-64 {
            max-height: 16rem;
        }
        
        .overflow-y-auto {
            overflow-y: auto;
        }
        
        .cursor-pointer {
            cursor: pointer;
        }
        
        .font-mono {
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        
        .min-w-\\[40px\\] {
            min-width: 40px;
        }
        
        .inline-block {
            display: inline-block;
        }
        
        .z-10 {
            z-index: 10;
        }
    `);

    // Start the app
    App.init();
})();
// ==UserScript==
// @name         JSON Response Capture
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Capture and save JSON responses from web requests with URL filtering
// @author       nickm8
// @license      MIT
// @match        *://*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js
// @downloadURL https://update.greasyfork.org/scripts/521508/JSON%20Response%20Capture.user.js
// @updateURL https://update.greasyfork.org/scripts/521508/JSON%20Response%20Capture.meta.js
// ==/UserScript==
 

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        :root {
            --bg-primary: #ffffff;
            --bg-secondary: #f9fafb;
            --text-primary: #1f2937;
            --text-secondary: #4b5563;
            --text-tertiary: #6b7280;
            --border-color: #e5e7eb;
            --shadow-color: rgba(0, 0, 0, 0.1);
            --hover-color: #2563eb;
            --danger-color: #dc2626;
            --tag-bg: #f3f4f6;
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --bg-primary: #1f2937;
                --bg-secondary: #374151;
                --text-primary: #f9fafb;
                --text-secondary: #d1d5db;
                --text-tertiary: #9ca3af;
                --border-color: #4b5563;
                --shadow-color: rgba(0, 0, 0, 0.3);
                --hover-color: #60a5fa;
                --danger-color: #ef4444;
                --tag-bg: #374151;
            }
        }

        .json-capture-panel {
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            background: var(--bg-primary);
            color: var(--text-primary);
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px var(--shadow-color);
            transition: all 200ms;
            z-index: 10000;
        }

        .json-capture-panel.minimized { width: 3rem; }
        .json-capture-panel.expanded { width: 24rem; }

        .json-capture-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem;
            border-bottom: 1px solid var(--border-color);
            background: var(--bg-secondary);
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
        }

        .json-capture-content {
            max-height: 24rem;
            overflow: auto;
            padding: 1rem;
        }

        .json-capture-item {
            margin-bottom: 1rem;
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 0.375rem;
        }

        .json-capture-url {
            font-size: 0.875rem;
            color: var(--text-secondary);
            margin-bottom: 0.25rem;
            word-break: break-all;
        }

        .json-capture-timestamp {
            font-size: 0.75rem;
            color: var(--text-tertiary);
            margin-bottom: 0.5rem;
        }

        .json-capture-json {
            font-size: 0.75rem;
            background: var(--bg-secondary);
            padding: 0.5rem;
            border-radius: 0.375rem;
            overflow: auto;
            white-space: pre-wrap;
            max-height: 12rem;
            color: var(--text-primary);
        }

        .json-capture-button {
            padding: 0.25rem 0.5rem;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-secondary);
        }

        .json-capture-button:hover {
            color: var(--hover-color);
        }

        .json-capture-button.delete:hover {
            color: var(--danger-color);
        }

        .config-section {
            margin-bottom: 1rem;
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 0.375rem;
        }

        .config-title {
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }

        .config-input {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }

        .config-input input {
            flex: 1;
            padding: 0.25rem 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 0.25rem;
            background: var(--bg-primary);
            color: var(--text-primary);
        }

        .config-list {
            display: flex;
            flex-wrap: wrap;
            gap: 0.25rem;
        }

        .config-tag {
            background: var(--tag-bg);
            color: var(--text-primary);
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }

        .config-tag button {
            padding: 0;
            background: none;
            border: none;
            cursor: pointer;
            color: var(--text-tertiary);
        }

        .tabs {
            display: flex;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 1rem;
        }

        .tab {
            padding: 0.5rem 1rem;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            color: var(--text-secondary);
        }

        .tab.active {
            border-bottom-color: var(--hover-color);
            color: var(--hover-color);
        }
    `;
    document.head.appendChild(style);
 
    const { useState, useEffect } = React;
 
    // Configuration component
    function ConfigSection({ matches, ignores, onUpdateMatches, onUpdateIgnores }) {
        const [newMatch, setNewMatch] = useState('');
        const [newIgnore, setNewIgnore] = useState('');
 
        const addMatch = () => {
            if (newMatch && !matches.includes(newMatch)) {
                onUpdateMatches([...matches, newMatch]);
                setNewMatch('');
            }
        };
 
        const addIgnore = () => {
            if (newIgnore && !ignores.includes(newIgnore)) {
                onUpdateIgnores([...ignores, newIgnore]);
                setNewIgnore('');
            }
        };
 
        const removeMatch = (match) => {
            onUpdateMatches(matches.filter(m => m !== match));
        };
 
        const removeIgnore = (ignore) => {
            onUpdateIgnores(ignores.filter(i => i !== ignore));
        };
 
        return React.createElement('div', { className: 'config-content' }, [
            React.createElement('div', { key: 'matches', className: 'config-section' }, [
                React.createElement('div', { className: 'config-title' }, 'URL Matches'),
                React.createElement('div', { className: 'config-input' }, [
                    React.createElement('input', {
                        value: newMatch,
                        onChange: (e) => setNewMatch(e.target.value),
                        placeholder: 'Enter URL keyword to match',
                        onKeyPress: (e) => e.key === 'Enter' && addMatch()
                    }),
                    React.createElement('button', {
                        className: 'json-capture-button',
                        onClick: addMatch
                    }, '+')
                ]),
                React.createElement('div', { className: 'config-list' },
                    matches.map(match => 
                        React.createElement('span', { key: match, className: 'config-tag' }, [
                            match,
                            React.createElement('button', {
                                onClick: () => removeMatch(match)
                            }, '×')
                        ])
                    )
                )
            ]),
            React.createElement('div', { key: 'ignores', className: 'config-section' }, [
                React.createElement('div', { className: 'config-title' }, 'URL Ignores'),
                React.createElement('div', { className: 'config-input' }, [
                    React.createElement('input', {
                        value: newIgnore,
                        onChange: (e) => setNewIgnore(e.target.value),
                        placeholder: 'Enter URL keyword to ignore',
                        onKeyPress: (e) => e.key === 'Enter' && addIgnore()
                    }),
                    React.createElement('button', {
                        className: 'json-capture-button',
                        onClick: addIgnore
                    }, '+')
                ]),
                React.createElement('div', { className: 'config-list' },
                    ignores.map(ignore => 
                        React.createElement('span', { key: ignore, className: 'config-tag' }, [
                            ignore,
                            React.createElement('button', {
                                onClick: () => removeIgnore(ignore)
                            }, '×')
                        ])
                    )
                )
            ])
        ]);
    }
 
    function JsonCapturePanel() {
        const [captures, setCaptures] = useState([]);
        const [isMinimized, setIsMinimized] = useState(true);
        const [activeTab, setActiveTab] = useState('captures');
        const [matches, setMatches] = useState([]);
        const [ignores, setIgnores] = useState([]);
        const domain = window.location.hostname;
 
        // Load configuration from localStorage
        useEffect(() => {
            const config = JSON.parse(localStorage.getItem(`jsonCapture_${domain}`) || '{"matches":[],"ignores":[]}');
            setMatches(config.matches);
            setIgnores(config.ignores);
        }, []);
 
        // Save configuration to localStorage
        useEffect(() => {
            localStorage.setItem(`jsonCapture_${domain}`, JSON.stringify({ matches, ignores }));
        }, [matches, ignores]);
 
        const shouldCaptureUrl = (url) => {
            if (matches.length === 0) return false;
            return matches.some(match => url.includes(match)) && 
                   !ignores.some(ignore => url.includes(ignore));
        };
 
        useEffect(() => {
            // Intercept fetch
            const originalFetch = window.fetch;
            window.fetch = async function(...args) {
                const response = await originalFetch.apply(this, args);
                const clone = response.clone();
 
                try {
                    const contentType = clone.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const url = typeof args[0] === 'string' ? args[0] : args[0].url;
                        if (shouldCaptureUrl(url)) {
                            const json = await clone.json();
                            setCaptures(prev => [...prev, {
                                timestamp: new Date().toISOString(),
                                url,
                                data: json
                            }]);
                        }
                    }
                } catch (err) {
                    console.error('Error processing response:', err);
                }
 
                return response;
            };
 
            // Intercept XHR
            const originalXHROpen = XMLHttpRequest.prototype.open;
            const originalXHRSend = XMLHttpRequest.prototype.send;
 
            XMLHttpRequest.prototype.open = function(...args) {
                this._url = args[1];
                return originalXHROpen.apply(this, args);
            };
 
            XMLHttpRequest.prototype.send = function(...args) {
                this.addEventListener('load', function() {
                    try {
                        const contentType = this.getResponseHeader('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            if (shouldCaptureUrl(this._url)) {
                                const json = JSON.parse(this.responseText);
                                setCaptures(prev => [...prev, {
                                    timestamp: new Date().toISOString(),
                                    url: this._url,
                                    data: json
                                }]);
                            }
                        }
                    } catch (err) {
                        console.error('Error processing XHR response:', err);
                    }
                });
 
                return originalXHRSend.apply(this, args);
            };
        }, [matches, ignores]);
 
        const handleSave = () => {
            const blob = new Blob([JSON.stringify(captures, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `json-captures-${domain}-${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };
 
        const handleClear = () => {
            setCaptures([]);
        };
 
        return React.createElement('div', {
            className: `json-capture-panel ${isMinimized ? 'minimized' : 'expanded'}`
        }, [
            // Header
            React.createElement('div', {
                key: 'header',
                className: 'json-capture-header'
            }, [
                !isMinimized && React.createElement('div', {
                    key: 'title'
                }, `JSON Captures (${captures.length})`),
                React.createElement('div', {
                    key: 'controls',
                    style: { display: 'flex', gap: '0.5rem' }
                }, [
                    !isMinimized && React.createElement('button', {
                        key: 'save',
                        className: 'json-capture-button',
                        onClick: handleSave,
                        title: 'Save captures'
                    }, '💾'),
                    React.createElement('button', {
                        key: 'toggle',
                        className: 'json-capture-button',
                        onClick: () => setIsMinimized(!isMinimized),
                        title: isMinimized ? 'Expand' : 'Minimize'
                    }, isMinimized ? '⤢' : '⤡'),
                    !isMinimized && React.createElement('button', {
                        key: 'clear',
                        className: 'json-capture-button delete',
                        onClick: handleClear,
                        title: 'Clear captures'
                    }, '✕')
                ])
            ]),
            // Content
            !isMinimized && React.createElement('div', { key: 'content' }, [
                // Tabs
                React.createElement('div', { key: 'tabs', className: 'tabs' }, [
                    React.createElement('div', {
                        className: `tab ${activeTab === 'captures' ? 'active' : ''}`,
                        onClick: () => setActiveTab('captures')
                    }, 'Captures'),
                    React.createElement('div', {
                        className: `tab ${activeTab === 'config' ? 'active' : ''}`,
                        onClick: () => setActiveTab('config')
                    }, 'Configuration')
                ]),
                // Tab content
                activeTab === 'captures' ? 
                    React.createElement('div', {
                        key: 'captures',
                        className: 'json-capture-content'
                    },
                        captures.length === 0
                            ? React.createElement('div', {
                                style: { textAlign: 'center', color: '#6b7280' }
                            }, matches.length === 0 ? 'Configure URL matches to start capturing' : 'No JSON responses captured yet')
                            : captures.map((capture, index) =>
                                React.createElement('div', {
                                    key: index,
                                    className: 'json-capture-item'
                                }, [
                                    React.createElement('div', {
                                        key: 'url',
                                        className: 'json-capture-url'
                                    }, capture.url),
                                    React.createElement('div', {
                                        key: 'timestamp',
                                        className: 'json-capture-timestamp'
                                    }, capture.timestamp),
                                    React.createElement('pre', {
                                        key: 'json',
                                        className: 'json-capture-json'
                                    }, JSON.stringify(capture.data, null, 2))
                                ])
                            )
                    )
                    : React.createElement(ConfigSection, {
                        key: 'config',
                        matches,
                        ignores,
                        onUpdateMatches: setMatches,
                        onUpdateIgnores: setIgnores
                    })
            ])
]);
}
 
const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(React.createElement(JsonCapturePanel), container);
})();
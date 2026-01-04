// ==UserScript==
// @name         AI Floating Bubble Pro
// @version      3.0
// @description  A beautifully designed, highly customizable floating AI bubble with comprehensive AI bot list. Opens AI sites in a sidebar-style window.
// @author       Mayukhjit Chakraborty
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @namespace    http://tampermonkey.net/
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547449/AI%20Floating%20Bubble%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/547449/AI%20Floating%20Bubble%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Skip on sidebar windows and iframes
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('ai_sidebar_window') || window.top !== window.self) return;

    // Prevent double-injection (some environments/users may load the script twice)
    if (window.__AI_FLOATING_BUBBLE_PRO__) return;
    if (document.getElementById('aiBubbleContainer')) return;
    window.__AI_FLOATING_BUBBLE_PRO__ = true;

    /**
     * Default configuration
     */
    const DEFAULT_CONFIG = {
        theme: 'auto',
        accentColor: '#6366f1',
        bubbleSize: 56,
        bubbleOpacity: 1,
        menuAnimationSpeed: 0.25,
        sidebarWidth: 420,
        sidebarHeightPercent: 0.92,
        openMode: 'window', // 'window' | 'tab'
        openPromptManagerOnAISites: true,
        fontPreset: 'inter', // 'system' | 'inter' | 'poppins' | 'jetbrains-mono'
        motionPreset: 'lively', // 'subtle' | 'lively'
        enableSounds: false,
        enableTooltips: true,
        compactMode: false,
        showLoginBadges: true,
        snapToCorners: true,
        favorites: [],
        hiddenSites: [],
        position: { left: null, top: null, right: 20, bottom: 20 },
        isHidden: false,
        // Defaults chosen to avoid common browser/app shortcuts
        hotkey: { ctrl: true, shift: true, key: 'Y' },
        // Recovery-friendly: avoids Alt (often intercepted)
        unhideHotkey: { ctrl: true, shift: true, key: 'U' }
    };

    /**
     * AI Sites Database with icons
     */
    const AI_SITES = [
        { id: 'chatgpt', name: "ChatGPT", url: "https://chat.openai.com/", loginNeeded: false, faIcon: "fa-brands fa-openai", color: "#10a37f" },
        { id: 'gemini', name: "Gemini", url: "https://gemini.google.com/", loginNeeded: true, faIcon: "fa-brands fa-google", color: "#4285f4" },
        { id: 'copilot', name: "Copilot", url: "https://copilot.microsoft.com/", loginNeeded: false, faIcon: "fa-brands fa-microsoft", color: "#0078d4" },
        { id: 'meta', name: "Meta AI", url: "https://www.meta.ai/", loginNeeded: false, faIcon: "fa-brands fa-meta", color: "#0866ff" },
        { id: 'perplexity', name: "Perplexity", url: "https://www.perplexity.ai/", loginNeeded: false, faIcon: "fa-solid fa-magnifying-glass", color: "#20808d" },
        { id: 'poe', name: "Poe", url: "https://poe.com/", loginNeeded: true, faIcon: "fa-solid fa-comment-dots", color: "#5a4fcf" },
        { id: 'grok', name: "Grok", url: "https://x.com/i/grok", loginNeeded: true, faIcon: "fa-brands fa-x-twitter", color: "#1da1f2" },
        { id: 'claude', name: "Claude", url: "https://claude.ai/", loginNeeded: true, faIcon: "fa-solid fa-brain", color: "#cc785c" },
        { id: 'qwen', name: "Qwen", url: "https://chat.qwen.ai/", loginNeeded: false, faIcon: "fa-solid fa-globe", color: "#615dfa" },
        { id: 'deepseek', name: "Deepseek", url: "https://chat.deepseek.com/", loginNeeded: true, faIcon: "fa-solid fa-water", color: "#0066ff" },
        { id: 'lmarena', name: "LMArena", url: "https://lmarena.ai/", loginNeeded: false, faIcon: "fa-solid fa-trophy", color: "#f59e0b" },
        { id: 'z', name: "Z", url: "https://chat.z.ai/", loginNeeded: false, faIcon: "fa-solid fa-bolt", color: "#8b5cf6" }
    ];

    const PROMPT_STORAGE_KEY = 'aiBubblePrompts';
    const PROMPT_LIBRARY_VERSION = 2;

    const DEFAULT_PROMPTS = [
        {
            name: 'Summarize with action items',
            text: 'Summarize the following content in bullet points, then list clear action items.\n\n{{content}}',
            tags: ['summary', 'productivity'],
            bots: 'all'
        },
        {
            text: 'Generate a prompt library as STRICT JSON (no Markdown, no comments).\n\nOutput format: either an array of prompt objects, OR {"prompts": [ ... ]}.\n\nEach prompt object must include:\n- name (string)\n- text (string)\n- tags (array of strings) OR tags (comma-separated string)\n- bots: either "all" OR an array of bot ids\n\nBot ids allowed: chatgpt, gemini, copilot, meta, perplexity, poe, grok, claude, qwen, deepseek, lmarena, z\n\nRequirements:\n- Return valid JSON only\n- Include {{count}} prompts\n- Include placeholders like {{content}} where useful\n- Use short, descriptive tags\n\nTheme for the prompts:\n{{theme}}',
            text: 'You are a senior engineer. Ask clarifying questions first, then propose a minimal reproduction, likely root cause, and a fix.\n\nContext:\n{{context}}\n\nCode/logs:\n{{code_or_logs}}',
            tags: ['debug', 'code'],
            bots: 'all'
        },
        {
            name: 'Write a professional email',
            text: 'Write a concise professional email. Tone: {{tone}}. Audience: {{audience}}. Goal: {{goal}}.\n\nKey points:\n{{points}}',
            tags: ['writing', 'email'],
            bots: 'all'
        },
        {
            name: 'Convert notes into a plan',
            text: 'Turn these notes into a clear plan with milestones, risks, and next steps:\n\n{{notes}}',
            tags: ['planning', 'productivity'],
            bots: 'all'
        },
        {
            name: 'Rewrite for clarity (keep meaning)',
            text: 'Rewrite the text to be clearer and more concise while keeping the original meaning. Keep formatting if present.\n\n{{text}}',
            tags: ['writing', 'rewrite'],
            bots: 'all'
        },
        {
            name: 'Tone shift (friendly/professional)',
            text: 'Rewrite this in a {{tone}} tone. Keep it brief and natural.\n\n{{text}}',
            tags: ['writing'],
            bots: 'all'
        },
        {
            name: 'Brainstorm ideas (with constraints)',
            text: 'Brainstorm {{n}} ideas. Constraints: {{constraints}}. For each idea: short description + why it fits + next step.\n\nContext:\n{{context}}',
            tags: ['brainstorm', 'productivity'],
            bots: 'all'
        },
        {
            name: 'Explain like I know basics',
            text: 'Explain this assuming I know the basics but want the key insights, common pitfalls, and a simple example.\n\nTopic:\n{{topic}}',
            tags: ['learning'],
            bots: 'all'
        },
        {
            name: 'Code review checklist',
            text: 'Review this code like a senior engineer. Focus on correctness, readability, edge cases, performance, and maintainability. Provide actionable suggestions and point out risks.\n\nCode:\n{{code}}',
            tags: ['code', 'review'],
            bots: 'all'
        },
        {
            name: 'Refactor plan (safe steps)',
            text: 'Propose a refactor plan with safe incremental steps. Include: goal, current smells, step-by-step plan, risks, and how to validate each step.\n\nContext:\n{{context}}\n\nCode:\n{{code}}',
            tags: ['code', 'refactor'],
            bots: 'all'
        },
        {
            name: 'Write unit tests',
            text: 'Write unit tests for this. Use the existing project patterns if implied. Cover edge cases and failure paths.\n\nCode:\n{{code}}\n\nNotes:\n{{notes}}',
            tags: ['code', 'tests'],
            bots: 'all'
        },
        {
            name: 'Security review (practical)',
            text: 'Do a practical security review: identify likely vulnerabilities, risky assumptions, and suggested mitigations. Keep it grounded and actionable.\n\nSystem description:\n{{system}}\n\nCode/config:\n{{code_or_config}}',
            tags: ['security', 'review'],
            bots: 'all'
        },
        {
            name: 'SQL query helper',
            text: 'Help write a SQL query for {{dialect}}. Provide the query, explain it, and list indices/optimizations if relevant.\n\nSchema:\n{{schema}}\n\nGoal:\n{{goal}}\n\nExample rows (optional):\n{{examples}}',
            tags: ['sql', 'data'],
            bots: 'all'
        },
        {
            name: 'Meeting notes to summary',
            text: 'Summarize these meeting notes into: decisions, action items (owner + due date if present), open questions, and follow-ups.\n\n{{notes}}',
            tags: ['summary', 'meetings'],
            bots: 'all'
        },
        {
            name: 'Compare options (decision matrix)',
            text: 'Compare these options using a simple decision matrix. Include criteria, weights (if provided), pros/cons, and a recommendation.\n\nOptions:\n{{options}}\n\nCriteria (optional):\n{{criteria}}\n\nConstraints:\n{{constraints}}',
            tags: ['planning', 'decision'],
            bots: 'all'
        },
        {
            name: 'Translate (preserve meaning)',
            text: 'Translate this to {{language}}. Preserve meaning, tone, and formatting.\n\n{{text}}',
            tags: ['translation', 'writing'],
            bots: 'all'
        },
        {
            name: 'Create a checklist',
            text: 'Create a clear checklist with grouped sections. Include prerequisites and acceptance criteria.\n\nTask:\n{{task}}\n\nContext:\n{{context}}',
            tags: ['productivity', 'checklist'],
            bots: 'all'
        },
        {
            name: 'Generate prompts JSON (import format)',
            text: 'Generate a prompt library as STRICT JSON (no Markdown, no comments).\n\nOutput format: either an array of prompt objects, OR {"prompts": [ ... ]}.\n\nEach prompt object must include:\n- name (string)\n- text (string)\n- tags (array of strings) OR tags (comma-separated string)\n- bots: either "all" OR an array of bot ids\n\nBot ids allowed: chatgpt, gemini, copilot, perplexity, poe, grok, claude, qwen, deepseek, lmarena, z\n\nRequirements:\n- Return valid JSON only\n- Include {{count}} prompts\n- Include placeholders like {{content}} where useful\n- Use short, descriptive tags\n\nTheme for the prompts:\n{{theme}}',
            tags: ['prompts', 'json'],
            bots: 'all'
        }
    ];

    class PromptLibrary {
        constructor() {
            this._loadedVersion = 0;
            this.prompts = this._load();

            if (!this.prompts || this.prompts.length === 0) {
                this.prompts = this._seedDefaults();
                this._save();
            } else if ((this._loadedVersion || 0) < PROMPT_LIBRARY_VERSION) {
                this._migrateFrom(this._loadedVersion || 0);
            }
        }

        _getRaw() {
            try {
                return typeof GM_getValue !== 'undefined'
                    ? GM_getValue(PROMPT_STORAGE_KEY, null)
                    : localStorage.getItem(PROMPT_STORAGE_KEY);
            } catch (e) {
                return null;
            }
        }

        _setRaw(value) {
            try {
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue(PROMPT_STORAGE_KEY, value);
                } else {
                    localStorage.setItem(PROMPT_STORAGE_KEY, JSON.stringify(value));
                }
            } catch (e) {
                console.warn('Failed to save prompts:', e);
            }
        }

        _load() {
            try {
                const saved = this._getRaw();
                if (!saved) return [];
                const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved;
                if (Array.isArray(parsed)) return parsed.map(p => this._normalizePrompt(p)).filter(Boolean);
                if (parsed && Array.isArray(parsed.prompts)) {
                    this._loadedVersion = parsed.version || 0;
                    return parsed.prompts.map(p => this._normalizePrompt(p)).filter(Boolean);
                }
                return [];
            } catch (e) {
                console.warn('Failed to load prompts:', e);
                return [];
            }
        }

        _migrateFrom(fromVersion) {
            // v2: add new DEFAULT_PROMPTS (by name) without overwriting user prompts
            const existingByName = new Set(this.prompts.map(p => (p.name || '').toLowerCase()));
            const toAdd = DEFAULT_PROMPTS
                .map(p => this._normalizePrompt(p))
                .filter(Boolean)
                .filter(p => !existingByName.has((p.name || '').toLowerCase()));

            if (toAdd.length > 0) {
                this.prompts.push(...toAdd);
            }

            this._save();
        }

        _save() {
            this._setRaw({ version: PROMPT_LIBRARY_VERSION, prompts: this.prompts });
        }

        _seedDefaults() {
            return DEFAULT_PROMPTS.map(p => this._normalizePrompt(p));
        }

        _uuid() {
            try {
                return (crypto && crypto.randomUUID) ? crypto.randomUUID() : `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
            } catch {
                return `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
            }
        }

        _normalizePrompt(p) {
            if (!p) return null;
            const name = (p.name || '').toString().trim();
            const text = (p.text || p.prompt || '').toString();
            if (!name || !text) return null;

            const tags = Array.isArray(p.tags)
                ? p.tags.map(t => (t || '').toString().trim()).filter(Boolean)
                : (typeof p.tags === 'string'
                    ? p.tags.split(',').map(t => t.trim()).filter(Boolean)
                    : []);

            let bots = p.bots;
            if (!bots) bots = 'all';
            if (bots !== 'all' && !Array.isArray(bots)) bots = 'all';

            const now = new Date().toISOString();
            return {
                id: (p.id || '').toString().trim() || this._uuid(),
                name,
                text,
                tags,
                bots,
                createdAt: p.createdAt || now,
                updatedAt: p.updatedAt || now
            };
        }

        list() {
            return [...this.prompts].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        }

        upsert(prompt) {
            const normalized = this._normalizePrompt(prompt);
            if (!normalized) return null;
            const idx = this.prompts.findIndex(p => p.id === normalized.id);
            const now = new Date().toISOString();
            if (idx >= 0) {
                this.prompts[idx] = { ...this.prompts[idx], ...normalized, updatedAt: now };
            } else {
                this.prompts.push({ ...normalized, createdAt: now, updatedAt: now });
            }
            this._save();
            return normalized;
        }

        remove(id) {
            const before = this.prompts.length;
            this.prompts = this.prompts.filter(p => p.id !== id);
            if (this.prompts.length !== before) this._save();
        }

        importFromJson(jsonText) {
            const parsed = JSON.parse(jsonText);
            const items = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.prompts) ? parsed.prompts : []);
            if (!Array.isArray(items)) return { imported: 0, skipped: 0 };

            let imported = 0;
            let skipped = 0;

            items.forEach((raw) => {
                const normalized = this._normalizePrompt(raw);
                if (!normalized) {
                    skipped++;
                    return;
                }

                const byId = this.prompts.findIndex(p => p.id === normalized.id);
                const byName = this.prompts.findIndex(p => p.name.toLowerCase() === normalized.name.toLowerCase());
                const idx = byId >= 0 ? byId : byName;

                if (idx >= 0) {
                    this.prompts[idx] = { ...this.prompts[idx], ...normalized, updatedAt: new Date().toISOString() };
                } else {
                    this.prompts.push(normalized);
                }
                imported++;
            });

            this._save();
            return { imported, skipped };
        }
    }

    /**
     * SVG Icons
     */
    const ICONS = {
        bubble: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/>
            <path d="M8 14h8"/>
            <path d="M8 18h8"/>
            <rect x="6" y="10" width="12" height="12" rx="2"/>
            <circle cx="9" cy="22" r="1"/>
            <circle cx="15" cy="22" r="1"/>
        </svg>`,
        sparkle: `<svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z"/>
            <path d="M5 2L5.7 4.3L8 5L5.7 5.7L5 8L4.3 5.7L2 5L4.3 4.3L5 2Z" opacity="0.6"/>
            <path d="M19 14L19.54 15.46L21 16L19.54 16.54L19 18L18.46 16.54L17 16L18.46 15.46L19 14Z" opacity="0.6"/>
        </svg>`,
        settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>`,
        close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>`,
        star: `<svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>`,
        starOutline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>`,
        hide: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        </svg>`,
        resize: `<svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM22 14H20V12H22V14ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z"/>
        </svg>`,
        search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
        </svg>`,
        login: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>`,
        externalLink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>`,
        palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/>
            <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/>
            <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/>
            <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/>
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>
        </svg>`,
        moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>`,
        sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>`,
        monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>`,
        keyboard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" ry="2"/>
            <path d="M6 8h.001"/>
            <path d="M10 8h.001"/>
            <path d="M14 8h.001"/>
            <path d="M18 8h.001"/>
            <path d="M8 12h.001"/>
            <path d="M12 12h.001"/>
            <path d="M16 12h.001"/>
            <path d="M7 16h10"/>
        </svg>`,
        sliders: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="21" x2="4" y2="14"/>
            <line x1="4" y1="10" x2="4" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12" y2="3"/>
            <line x1="20" y1="21" x2="20" y2="16"/>
            <line x1="20" y1="12" x2="20" y2="3"/>
            <line x1="1" y1="14" x2="7" y2="14"/>
            <line x1="9" y1="8" x2="15" y2="8"/>
            <line x1="17" y1="16" x2="23" y2="16"/>
        </svg>`,
        reset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
        </svg>`
    };

    /**
     * Configuration Manager
     */
    class ConfigManager {
        constructor() {
            this.config = this._loadConfig();
        }

        _loadConfig() {
            try {
                const saved = typeof GM_getValue !== 'undefined'
                    ? GM_getValue('aiBubbleConfig', null)
                    : localStorage.getItem('aiBubbleConfig');

                if (saved) {
                    const parsed = typeof saved === 'string' ? JSON.parse(saved) : saved;
                    return { ...DEFAULT_CONFIG, ...parsed };
                }
            } catch (e) {
                console.warn('Failed to load config:', e);
            }
            return { ...DEFAULT_CONFIG };
        }

        save() {
            try {
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue('aiBubbleConfig', this.config);
                } else {
                    localStorage.setItem('aiBubbleConfig', JSON.stringify(this.config));
                }
            } catch (e) {
                console.warn('Failed to save config:', e);
            }
        }

        get(key) {
            return this.config[key];
        }

        set(key, value) {
            this.config[key] = value;
            this.save();
        }

        reset() {
            this.config = { ...DEFAULT_CONFIG };
            this.save();
        }
    }

    /**
     * Theme Manager
     */
    class ThemeManager {
        constructor(configManager) {
            this.configManager = configManager;
            this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            this._setupMediaQueryListener();
        }

        _setupMediaQueryListener() {
            this.mediaQuery.addEventListener('change', () => {
                if (this.configManager.get('theme') === 'auto') {
                    this._applyTheme();
                }
            });
        }

        _applyTheme() {
            const theme = this.configManager.get('theme');
            const isDark = theme === 'dark' || (theme === 'auto' && this.mediaQuery.matches);
            document.documentElement.setAttribute('data-ai-bubble-theme', isDark ? 'dark' : 'light');
        }

        getCurrentTheme() {
            const theme = this.configManager.get('theme');
            if (theme === 'auto') {
                return this.mediaQuery.matches ? 'dark' : 'light';
            }
            return theme;
        }

        setTheme(theme) {
            this.configManager.set('theme', theme);
            this._applyTheme();
        }

        init() {
            this._applyTheme();
        }
    }

    /**
     * Sound Manager
     */
    class SoundManager {
        constructor(configManager) {
            this.configManager = configManager;
            this.audioContext = null;
        }

        _getContext() {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            return this.audioContext;
        }

        play(type = 'click') {
            if (!this.configManager.get('enableSounds')) return;

            try {
                const ctx = this._getContext();
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);

                const sounds = {
                    click: { freq: 600, duration: 0.05, type: 'sine' },
                    open: { freq: 800, duration: 0.1, type: 'sine' },
                    close: { freq: 400, duration: 0.08, type: 'sine' }
                };

                const sound = sounds[type] || sounds.click;
                oscillator.type = sound.type;
                oscillator.frequency.setValueAtTime(sound.freq, ctx.currentTime);
                gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + sound.duration);

                oscillator.start(ctx.currentTime);
                oscillator.stop(ctx.currentTime + sound.duration);
            } catch (e) {
                // Silently fail if audio doesn't work
            }
        }
    }

    /**
     * Main Application Class
     */
    class AIFloatingBubble {
        constructor() {
            this.configManager = new ConfigManager();
            this.themeManager = new ThemeManager(this.configManager);
            this.soundManager = new SoundManager(this.configManager);
            this.promptLibrary = new PromptLibrary();

            this.elements = {};
            this.state = {
                isDragging: false,
                isResizing: false,
                isSidebarResizing: false,
                isMenuOpen: false,
                isSettingsOpen: false,
                isPromptsOpen: false,
                searchQuery: '',
                promptSearchQuery: '',
                promptTagFilter: '',
                lastFavoriteToggle: null,
                suppressClickUntil: 0,
                offsetX: 0,
                offsetY: 0,
                startSize: 0,
                startX: 0,
                startY: 0
            };

            this.hideTimeout = null;
            this.rafId = null;
            this._lastEscapeAt = 0;

            this._init();
        }

        _init() {
            this.themeManager.init();
            this._injectExternalAssets();
            this._injectStyles();
            this._createElements();
            this._loadState();
            this._setupEventListeners();
            this._updateBubbleSize();
            this._updateAccentColor();
            this._applyTypography();
            this._applyMotionPreset();

            const currentBotId = this._getCurrentBotId();
            if (currentBotId && this.configManager.get('openPromptManagerOnAISites')) {
                setTimeout(() => {
                    if (!this.state.isMenuOpen && !this.state.isSettingsOpen && !this.state.isPromptsOpen) {
                        this._openPrompts();
                    }
                }, 350);
            }

            // On supported AI sites, inject an in-chat button to open Prompt Manager
            if (currentBotId) {
                this._setupChatIntegration();
            }
        }

        _setupChatIntegration() {
            const inject = () => {
                const input = this._findChatInput();
                if (!input) return;
                this._injectPromptButtonIntoChat(input);
            };

            inject();

            // SPAs often re-render the composer
            this._chatObserver?.disconnect?.();
            this._chatObserver = new MutationObserver(() => inject());
            this._chatObserver.observe(document.documentElement, { childList: true, subtree: true });
        }

        _injectPromptButtonIntoChat(inputEl) {
            try {
                if (!inputEl) return;
                if (inputEl.dataset.aiBubblePromptBtnAttached) return;

                const rect = inputEl.getBoundingClientRect?.();
                if (!rect || rect.width < 240 || rect.height < 24) return;

                // Choose a host container (something stable around the composer)
                let host = inputEl.closest('[role="textbox"], textarea, .composer, .chat-input, form') || inputEl.parentElement;
                if (!host) return;

                const style = window.getComputedStyle(host);
                if (style.position === 'static') host.style.position = 'relative';

                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'ai-chat-prompts-btn';
                btn.setAttribute('aria-label', 'Open Prompt Manager');
                btn.innerHTML = this._fa('fa-solid fa-book');
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.soundManager.play('click');
                    this._openPrompts();
                });

                host.appendChild(btn);
                inputEl.dataset.aiBubblePromptBtnAttached = '1';
            } catch {
                // ignore
            }
        }

        _isProbablyChatInput(el) {
            if (!el) return false;

            const tag = (el.tagName || '').toUpperCase();
            if (tag === 'INPUT') return false;

            if (tag !== 'TEXTAREA') {
                const ce = el.getAttribute?.('contenteditable');
                if (ce !== 'true') return false;
                const role = (el.getAttribute?.('role') || '').toLowerCase();
                if (role && role !== 'textbox') return false;
            }

            const rect = el.getBoundingClientRect?.();
            if (!rect || rect.width < 240 || rect.height < 24) return false;
            if (rect.bottom < window.innerHeight * 0.55) return false;

            const ph = (el.getAttribute?.('placeholder') || '').toLowerCase();
            const aria = (el.getAttribute?.('aria-label') || '').toLowerCase();
            const id = (el.id || '').toLowerCase();
            const name = (el.getAttribute?.('name') || '').toLowerCase();
            const combined = `${ph} ${aria} ${id} ${name}`;

            const rejectWords = ['email', 'e-mail', 'username', 'password', 'sign in', 'log in', 'login', 'search'];
            if (rejectWords.some(w => combined.includes(w))) return false;

            const form = el.closest?.('form');
            if (form) {
                const formText = `${form.getAttribute?.('action') || ''} ${form.className || ''} ${form.id || ''}`.toLowerCase();
                if (formText.includes('login') || formText.includes('signin') || formText.includes('auth')) return false;
                if (form.querySelector?.('input[type="password"]')) return false;
            }

            return true;
        }

        _injectExternalAssets() {
            // Font Awesome (best-effort; may be blocked by CSP on some sites)
            const faId = 'aiBubbleFontAwesome';
            if (!document.getElementById(faId)) {
                const link = document.createElement('link');
                link.id = faId;
                link.rel = 'stylesheet';
                const cdns = [
                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
                    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.1/css/all.min.css'
                ];
                link.href = cdns[0];
                link.onerror = () => {
                    if (link.dataset.fallbackTried) return;
                    link.dataset.fallbackTried = '1';
                    link.href = cdns[1];
                };
                document.head.appendChild(link);
            }
        }

        _injectStyles() {
            const accentColor = this.configManager.get('accentColor');
            GM_addStyle(`
                /* CSS Variables & Theme Support */
                :root {
                    --ai-bubble-accent: ${accentColor};
                    --ai-bubble-accent-rgb: ${this._hexToRgb(accentColor)};
                }

                [data-ai-bubble-theme="light"] {
                    --ai-bubble-bg: rgba(255, 255, 255, 0.95);
                    --ai-bubble-bg-solid: #ffffff;
                    --ai-bubble-text: #1a1a2e;
                    --ai-bubble-text-secondary: #64748b;
                    --ai-bubble-border: rgba(0, 0, 0, 0.08);
                    --ai-bubble-hover: rgba(99, 102, 241, 0.08);
                    --ai-bubble-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1);
                    --ai-bubble-shadow-sm: 0 4px 15px rgba(0, 0, 0, 0.1);
                    --ai-bubble-input-bg: #f8fafc;
                }

                [data-ai-bubble-theme="dark"] {
                    --ai-bubble-bg: rgba(30, 30, 46, 0.95);
                    --ai-bubble-bg-solid: #1e1e2e;
                    --ai-bubble-text: #e2e8f0;
                    --ai-bubble-text-secondary: #94a3b8;
                    --ai-bubble-border: rgba(255, 255, 255, 0.1);
                    --ai-bubble-hover: rgba(99, 102, 241, 0.15);
                    --ai-bubble-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 25px rgba(0, 0, 0, 0.3);
                    --ai-bubble-shadow-sm: 0 4px 15px rgba(0, 0, 0, 0.3);
                    --ai-bubble-input-bg: rgba(0, 0, 0, 0.2);
                }

                /* Animations */
                @keyframes aiBubblePulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(var(--ai-bubble-accent-rgb), 0.4); }
                    50% { box-shadow: 0 0 0 8px rgba(var(--ai-bubble-accent-rgb), 0); }
                }

                @keyframes aiBubbleFloat {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }

                @keyframes aiBubblePop {
                    0% { transform: scale(1); }
                    40% { transform: scale(1.15); }
                    100% { transform: scale(1); }
                }

                @keyframes aiBubbleSplash {
                    0% { transform: scale(0.2); opacity: 0.0; }
                    20% { opacity: 0.65; }
                    100% { transform: scale(2.8); opacity: 0; }
                }

                @keyframes aiBubbleWiggle {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    35% { transform: translateY(-4px) rotate(-2deg); }
                    70% { transform: translateY(-2px) rotate(2deg); }
                }

                @keyframes aiBubbleSparkle {
                    0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
                    50% { opacity: 0.8; transform: scale(0.95) rotate(5deg); }
                }

                @keyframes aiFavoriteStar {
                    0% { transform: scale(0.85) rotate(-8deg); }
                    45% { transform: scale(1.25) rotate(6deg); }
                    100% { transform: scale(1) rotate(0deg); }
                }

                @keyframes aiBubbleMenuSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                @keyframes aiBubbleMenuSlideOut {
                    from {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                    to {
                        opacity: 0;
                        transform: scale(0.9) translateY(10px);
                    }
                }

                @keyframes aiBubbleItemSlideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes aiBubbleSettingsSlide {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes aiBubbleRipple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }

                @keyframes aiBubbleShake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-2px); }
                    75% { transform: translateX(2px); }
                }

                /* Main Container */
                #aiBubbleContainer {
                    position: fixed;
                    z-index: 2147483647;
                    font-family: var(--ai-bubble-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
                    transition: opacity 0.3s ease;
                }

                /* Ensure typography applies to all controls */
                #aiBubbleContainer button,
                #aiBubbleContainer input,
                #aiBubbleContainer select,
                #aiBubbleContainer textarea {
                    font-family: inherit;
                }

                #aiBubbleModalOverlay,
                #aiBubbleModalOverlay button,
                #aiBubbleModalOverlay input,
                #aiBubbleModalOverlay select,
                #aiBubbleModalOverlay textarea {
                    font-family: var(--ai-bubble-font, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif);
                }

                /* In-chat prompts button (on supported AI sites) */
                .ai-chat-prompts-btn {
                    position: absolute;
                    right: 10px;
                    bottom: 10px;
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    border: 1px solid rgba(255,255,255,0.18);
                    background: color-mix(in srgb, var(--ai-bubble-accent) 85%, transparent);
                    color: white;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0.9;
                    transition: transform 0.15s ease, opacity 0.15s ease;
                    z-index: 10;
                }

                .ai-chat-prompts-btn:hover {
                    opacity: 1;
                    transform: scale(1.06);
                }

                .ai-chat-prompts-btn i {
                    font-size: 14px;
                }

                #aiBubbleContainer i.fa-solid,
                #aiBubbleContainer i.fa-regular,
                #aiBubbleContainer i.fa-brands {
                    line-height: 1;
                }

                #aiBubbleContainer i.fa-solid,
                #aiBubbleContainer i.fa-regular,
                #aiBubbleContainer i.fa-brands {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                #aiBubbleContainer.hidden {
                    opacity: 0;
                    pointer-events: none;
                }

                #aiBubbleContainer.dragging {
                    cursor: grabbing !important;
                }

                #aiBubbleContainer.dragging * {
                    cursor: grabbing !important;
                }

                /* Main Bubble Button */
                #aiBubbleButton {
                    width: var(--bubble-size, 56px);
                    height: var(--bubble-size, 56px);
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--ai-bubble-accent) 0%, color-mix(in srgb, var(--ai-bubble-accent) 70%, #8b5cf6) 100%);
                    border: none;
                    cursor: grab;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: var(--ai-bubble-shadow-sm), 0 0 20px rgba(var(--ai-bubble-accent-rgb), 0.3);
                    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
                    position: relative;
                    overflow: hidden;
                    animation: aiBubbleWiggle var(--ai-bubble-wiggle-duration, 3.1s) ease-in-out infinite;
                    opacity: var(--bubble-opacity, 1);
                }

                #aiBubbleButton.popping {
                    animation: aiBubblePop 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }

                #aiBubbleButton .splash {
                    position: absolute;
                    inset: -6px;
                    border-radius: 999px;
                    border: 2px solid rgba(255,255,255,0.45);
                    opacity: 0;
                    pointer-events: none;
                }

                #aiBubbleButton.splashing .splash {
                    animation: aiBubbleSplash 0.65s ease-out;
                }

                #aiBubbleButton::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%);
                    pointer-events: none;
                }

                #aiBubbleButton:hover {
                    transform: scale(1.1);
                    box-shadow: var(--ai-bubble-shadow), 0 0 30px rgba(var(--ai-bubble-accent-rgb), 0.4);
                    animation: none;
                }

                #aiBubbleButton:active {
                    transform: scale(0.95);
                    cursor: grabbing;
                }

                #aiBubbleButton .bubble-icon {
                    width: 60%;
                    height: 60%;
                    color: white;
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
                    animation: aiBubbleSparkle 2s ease-in-out infinite;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                #aiBubbleButton .bubble-icon i {
                    font-size: var(--ai-bubble-main-icon-size, 22px);
                }

                /* Ripple Effect */
                .ai-ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.4);
                    transform: scale(0);
                    animation: aiBubbleRipple 0.6s linear;
                    pointer-events: none;
                }

                /* Resize Handle */
                #aiBubbleResize {
                    position: absolute;
                    bottom: -4px;
                    right: -4px;
                    width: var(--ai-bubble-resize-size, 16px);
                    height: var(--ai-bubble-resize-size, 16px);
                    cursor: se-resize;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    color: white;
                    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
                }

                #aiBubbleResize svg {
                    width: 100%;
                    height: 100%;
                    display: block;
                }

                #aiBubbleContainer:hover #aiBubbleResize {
                    opacity: 0.7;
                }

                #aiBubbleResize:hover {
                    opacity: 1 !important;
                }

                /* Sidebar Window Resize Handle (appears only when popup is open) */
                #aiSidebarResize {
                    position: absolute;
                    top: auto;
                    right: auto;
                    bottom: auto;
                    left: auto;
                    width: var(--ai-bubble-resize-size, 16px);
                    height: var(--ai-bubble-resize-size, 16px);
                    cursor: nwse-resize;
                    opacity: 0;
                    transition: opacity 0.2s ease, transform 0.15s ease;
                    color: white;
                    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
                    pointer-events: none;
                }

                #aiSidebarResize svg {
                    width: 100%;
                    height: 100%;
                    display: block;
                }

                #aiBubbleContainer.sidebar-open:hover #aiSidebarResize {
                    opacity: 0.7;
                    pointer-events: auto;
                }

                #aiBubbleContainer.sidebar-open #aiSidebarResize:hover {
                    opacity: 1 !important;
                    transform: scale(1.06);
                }

                /* Corner-aware placement + cursor */
                #aiBubbleContainer.sidebar-resize-br #aiSidebarResize {
                    right: -4px;
                    bottom: -4px;
                    cursor: se-resize;
                }
                #aiBubbleContainer.sidebar-resize-bl #aiSidebarResize {
                    left: -4px;
                    bottom: -4px;
                    cursor: sw-resize;
                }
                #aiBubbleContainer.sidebar-resize-tr #aiSidebarResize {
                    right: -4px;
                    top: -4px;
                    cursor: ne-resize;
                }
                #aiBubbleContainer.sidebar-resize-tl #aiSidebarResize {
                    left: -4px;
                    top: -4px;
                    cursor: nw-resize;
                }

                #aiBubbleContainer.sidebar-resizing,
                #aiBubbleContainer.sidebar-resizing * {
                    cursor: var(--ai-sidebar-resize-cursor, nwse-resize) !important;
                }

                /* Menu Container */
                #aiBubbleMenu {
                    position: absolute;
                    bottom: calc(var(--bubble-size, 56px) + 12px);
                    right: 0;
                    min-width: 280px;
                    max-width: 340px;
                    background: var(--ai-bubble-bg);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 16px;
                    border: 1px solid var(--ai-bubble-border);
                    box-shadow: var(--ai-bubble-shadow);
                    overflow: hidden;
                    opacity: 0;
                    pointer-events: none;
                    transform: scale(0.9) translateY(10px);
                    transform-origin: bottom right;
                    transition: none;
                }

                #aiBubbleMenu.visible {
                    opacity: 1;
                    pointer-events: auto;
                    transform: scale(1) translateY(0);
                    animation: aiBubbleMenuSlideIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                #aiBubbleMenu.closing {
                    animation: aiBubbleMenuSlideOut 0.2s ease-out forwards;
                }

                /* Search Container */
                .ai-menu-search {
                    padding: 12px;
                    border-bottom: 1px solid var(--ai-bubble-border);
                }

                .ai-search-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .ai-search-icon {
                    position: absolute;
                    left: 12px;
                    width: 16px;
                    height: 16px;
                    color: var(--ai-bubble-text-secondary);
                    pointer-events: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .ai-search-icon i {
                    font-size: 14px;
                }

                .ai-search-input {
                    width: 100%;
                    padding: 10px 12px 10px 38px;
                    border: 1px solid var(--ai-bubble-border);
                    border-radius: 10px;
                    background: var(--ai-bubble-input-bg);
                    color: var(--ai-bubble-text);
                    font-size: 14px;
                    font-family: inherit;
                    outline: none;
                    transition: border-color 0.2s ease, box-shadow 0.2s ease;
                }

                .ai-search-input::placeholder {
                    color: var(--ai-bubble-text-secondary);
                }

                .ai-search-input:focus {
                    border-color: var(--ai-bubble-accent);
                    box-shadow: 0 0 0 3px rgba(var(--ai-bubble-accent-rgb), 0.15);
                }

                /* Menu Items List */
                .ai-menu-list {
                    max-height: 320px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 8px;
                    scrollbar-width: thin;
                    scrollbar-color: var(--ai-bubble-border) transparent;
                }

                .ai-menu-list::-webkit-scrollbar {
                    width: 6px;
                }

                .ai-menu-list::-webkit-scrollbar-track {
                    background: transparent;
                }

                .ai-menu-list::-webkit-scrollbar-thumb {
                    background: var(--ai-bubble-border);
                    border-radius: 3px;
                }

                /* Menu Item */
                .ai-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                    overflow: hidden;
                    background: transparent;
                    border: none;
                    width: 100%;
                    text-align: left;
                    color: var(--ai-bubble-text);
                    font-size: 14px;
                    font-family: inherit;
                }

                .ai-menu-item:hover {
                    background: var(--ai-bubble-hover);
                }

                .ai-menu-item:focus {
                    outline: none;
                    background: var(--ai-bubble-hover);
                    box-shadow: inset 0 0 0 2px var(--ai-bubble-accent);
                }

                .ai-menu-item.visible {
                    animation: aiBubbleItemSlideIn 0.2s ease-out forwards;
                }

                .ai-menu-item-icon {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    transition: transform 0.2s ease;
                    overflow: hidden;
                }

                .ai-menu-item-icon .ai-bot-favicon {
                    width: 22px;
                    height: 22px;
                    border-radius: 6px;
                    display: block;
                }

                .ai-menu-item-icon .ai-bot-fallback {
                    width: 22px;
                    height: 22px;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    color: currentColor;
                }

                .ai-menu-item-icon .ai-bot-fallback i {
                    font-size: 16px;
                }

                .ai-menu-item:hover .ai-menu-item-icon {
                    transform: scale(1.1);
                }

                .ai-menu-item-content {
                    flex: 1;
                    min-width: 0;
                }

                .ai-menu-item-name {
                    font-weight: 500;
                    color: var(--ai-bubble-text);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .ai-menu-item-badge {
                    font-size: 11px;
                    color: var(--ai-bubble-text-secondary);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    margin-top: 2px;
                }

                .ai-menu-item-badge svg,
                .ai-menu-item-badge i {
                    width: 12px;
                    height: 12px;
                }

                .ai-menu-item-actions {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                .ai-menu-item-actions i {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .ai-menu-item:hover .ai-menu-item-actions {
                    opacity: 1;
                }

                .ai-menu-item-fav {
                    width: 28px;
                    height: 28px;
                    border-radius: 6px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--ai-bubble-text-secondary);
                    transition: all 0.2s ease;
                    padding: 0;
                }

                .ai-menu-item-fav i {
                    transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease;
                    transform-origin: center;
                    will-change: transform;
                }

                .ai-menu-item-fav.star-anim i {
                    animation: aiFavoriteStar 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
                }

                .ai-menu-item-fav:hover {
                    background: rgba(var(--ai-bubble-accent-rgb), 0.15);
                    color: var(--ai-bubble-accent);
                }

                .ai-menu-item-fav.active {
                    color: #f59e0b;
                }

                .ai-menu-item-fav svg,
                .ai-menu-item-fav i {
                    width: 16px;
                    height: 16px;
                }

                .ai-menu-item-fav i { font-size: 16px; }

                .ai-menu-item-open {
                    width: 28px;
                    height: 28px;
                    border-radius: 6px;
                    border: none;
                    background: var(--ai-bubble-accent);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    transition: all 0.2s ease;
                    padding: 0;
                }

                .ai-menu-item-open.secondary {
                    background: transparent;
                    border: 1px solid var(--ai-bubble-border);
                    color: var(--ai-bubble-text);
                }

                .ai-menu-item-open:hover {
                    transform: scale(1.1);
                }

                .ai-menu-item-open svg,
                .ai-menu-item-open i {
                    width: 14px;
                    height: 14px;
                }

                .ai-menu-item-open i { font-size: 14px; }

                /* Menu Section Divider */
                .ai-menu-divider {
                    height: 1px;
                    background: var(--ai-bubble-border);
                    margin: 8px 12px;
                }

                .ai-menu-section-title {
                    padding: 8px 12px 4px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--ai-bubble-text-secondary);
                }

                /* Menu Footer */
                .ai-menu-footer {
                    padding: 12px;
                    border-top: 1px solid var(--ai-bubble-border);
                    display: flex;
                    gap: 8px;
                }

                .ai-menu-footer-btn {
                    flex: 1;
                    padding: 10px;
                    border-radius: 10px;
                    border: 1px solid var(--ai-bubble-border);
                    background: transparent;
                    color: var(--ai-bubble-text);
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .ai-menu-footer-btn:hover {
                    background: var(--ai-bubble-hover);
                    border-color: var(--ai-bubble-accent);
                }

                .ai-menu-footer-btn svg {
                    width: 16px;
                    height: 16px;
                }

                .ai-menu-footer-btn i {
                    width: 16px;
                    height: 16px;
                    font-size: 16px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }

                .ai-menu-footer-btn.danger {
                    color: #ef4444;
                }

                .ai-menu-footer-btn.danger:hover {
                    background: rgba(239, 68, 68, 0.1);
                    border-color: #ef4444;
                }

                /* No Results */
                .ai-menu-empty {
                    padding: 32px 16px;
                    text-align: center;
                    color: var(--ai-bubble-text-secondary);
                    font-size: 14px;
                }

                .ai-menu-empty-icon {
                    font-size: 32px;
                    margin-bottom: 8px;
                    opacity: 0.5;
                }

                /* Settings Panel */
                #aiBubbleSettings {
                    position: absolute;
                    bottom: calc(var(--bubble-size, 56px) + 12px);
                    right: 0;
                    width: 340px;
                    background: var(--ai-bubble-bg);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 16px;
                    border: 1px solid var(--ai-bubble-border);
                    box-shadow: var(--ai-bubble-shadow);
                    overflow: hidden;
                    opacity: 0;
                    pointer-events: none;
                    transform: translateX(20px);
                    transform-origin: bottom right;
                }

                #aiBubbleSettings.visible {
                    opacity: 1;
                    pointer-events: auto;
                    animation: aiBubbleSettingsSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                .ai-settings-header {
                    padding: 16px;
                    border-bottom: 1px solid var(--ai-bubble-border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                }

                .ai-settings-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--ai-bubble-text);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                }

                .ai-settings-title svg {
                    width: 20px;
                    height: 20px;
                    color: var(--ai-bubble-accent);
                }

                .ai-settings-close {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--ai-bubble-text-secondary);
                    transition: all 0.2s ease;
                }

                .ai-settings-back {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--ai-bubble-text-secondary);
                    transition: all 0.2s ease;
                    flex: 0 0 auto;
                }

                .ai-settings-close:hover {
                    background: var(--ai-bubble-hover);
                    color: var(--ai-bubble-text);
                }

                .ai-settings-back:hover {
                    background: var(--ai-bubble-hover);
                    color: var(--ai-bubble-text);
                }

                .ai-settings-close svg {
                    width: 18px;
                    height: 18px;
                }

                .ai-settings-back svg,
                .ai-settings-back i {
                    width: 18px;
                    height: 18px;
                }

                .ai-settings-content {
                    padding: 16px;
                    max-height: 400px;
                    overflow-y: auto;
                }

                .ai-settings-section {
                    margin-bottom: 20px;
                }

                .ai-settings-section:last-child {
                    margin-bottom: 0;
                }

                .ai-settings-section-title {
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--ai-bubble-text-secondary);
                    margin-bottom: 12px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .ai-settings-section-title svg {
                    width: 14px;
                    height: 14px;
                }

                /* Setting Row */
                .ai-setting-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 10px 0;
                }

                .ai-setting-row + .ai-setting-row {
                    border-top: 1px solid var(--ai-bubble-border);
                }

                .ai-setting-label {
                    font-size: 14px;
                    color: var(--ai-bubble-text);
                }

                .ai-setting-desc {
                    font-size: 12px;
                    color: var(--ai-bubble-text-secondary);
                    margin-top: 2px;
                }

                /* Toggle Switch */
                .ai-toggle {
                    position: relative;
                    width: 44px;
                    height: 24px;
                    background: var(--ai-bubble-border);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    flex-shrink: 0;
                }

                .ai-toggle.active {
                    background: var(--ai-bubble-accent);
                }

                .ai-toggle::after {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                }

                .ai-toggle.active::after {
                    transform: translateX(20px);
                }

                /* Theme Selector */
                .ai-theme-selector {
                    display: flex;
                    gap: 8px;
                }

                .ai-theme-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    border: 2px solid var(--ai-bubble-border);
                    background: var(--ai-bubble-input-bg);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--ai-bubble-text-secondary);
                    transition: all 0.2s ease;
                }

                .ai-theme-btn:hover {
                    border-color: var(--ai-bubble-accent);
                }

                .ai-theme-btn.active {
                    border-color: var(--ai-bubble-accent);
                    background: rgba(var(--ai-bubble-accent-rgb), 0.15);
                    color: var(--ai-bubble-accent);
                }

                .ai-theme-btn svg,
                .ai-theme-btn i {
                    width: 18px;
                    height: 18px;
                }

                .ai-select {
                    padding: 10px 12px;
                    border: 1px solid var(--ai-bubble-border);
                    border-radius: 10px;
                    background: var(--ai-bubble-input-bg);
                    color: var(--ai-bubble-text);
                    font-size: 13px;
                    font-family: inherit;
                    outline: none;
                    min-width: 140px;
                }

                .ai-select:focus {
                    border-color: var(--ai-bubble-accent);
                    box-shadow: 0 0 0 3px rgba(var(--ai-bubble-accent-rgb), 0.15);
                }

                /* Color Picker */
                .ai-color-picker {
                    display: flex;
                    gap: 6px;
                    flex-wrap: wrap;
                }

                .ai-color-swatch {
                    width: 28px;
                    height: 28px;
                    border-radius: 8px;
                    border: 2px solid transparent;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .ai-color-swatch:hover {
                    transform: scale(1.1);
                }

                .ai-color-swatch.active {
                    border-color: var(--ai-bubble-text);
                    box-shadow: 0 0 0 2px var(--ai-bubble-bg-solid);
                }

                /* Slider */
                .ai-slider-container {
                    flex: 1;
                    max-width: 120px;
                }

                .ai-slider {
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: var(--ai-bubble-border);
                    -webkit-appearance: none;
                    appearance: none;
                    cursor: pointer;
                }

                .ai-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: var(--ai-bubble-accent);
                    cursor: pointer;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                    transition: transform 0.2s ease;
                }

                .ai-slider::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                }

                .ai-slider::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: var(--ai-bubble-accent);
                    cursor: pointer;
                    border: none;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                }

                .ai-slider-value {
                    font-size: 12px;
                    color: var(--ai-bubble-text-secondary);
                    text-align: right;
                    margin-top: 4px;
                }

                /* Hotkey Display */
                .ai-hotkey-display {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }

                .ai-hotkey-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* Tooltip */
                #aiBubbleTooltip {
                    position: fixed;
                    z-index: 2147483649;
                    padding: 6px 9px;
                    border-radius: 10px;
                    border: 1px solid var(--ai-bubble-border);
                    background: var(--ai-bubble-bg);
                    color: var(--ai-bubble-text);
                    box-shadow: var(--ai-bubble-shadow-sm);
                    font-size: 12px;
                    line-height: 1.2;
                    pointer-events: none;
                    opacity: 0;
                    transform: translateY(6px);
                    transition: opacity 0.12s ease, transform 0.12s ease;
                    max-width: 260px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                #aiBubbleTooltip.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .ai-hotkey-key {
                    padding: 4px 8px;
                    background: var(--ai-bubble-input-bg);
                    border: 1px solid var(--ai-bubble-border);
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--ai-bubble-text);
                    font-family: monospace;
                }

                /* Settings Footer */
                .ai-settings-footer {
                    padding: 12px 16px;
                    border-top: 1px solid var(--ai-bubble-border);
                    display: flex;
                    gap: 8px;
                }

                .ai-settings-footer-btn {
                    flex: 1;
                    padding: 10px;
                    border-radius: 10px;
                    border: none;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                .ai-settings-footer-btn.primary {
                    background: var(--ai-bubble-accent);
                    color: white;
                }

                .ai-settings-footer-btn.primary:hover {
                    filter: brightness(1.1);
                }

                .ai-settings-footer-btn.secondary {
                    background: transparent;
                    border: 1px solid var(--ai-bubble-border);
                    color: var(--ai-bubble-text);
                }

                .ai-settings-footer-btn.secondary:hover {
                    background: var(--ai-bubble-hover);
                }

                .ai-settings-footer-btn svg {
                    width: 16px;
                    height: 16px;
                }

                .ai-settings-footer-btn i {
                    width: 16px;
                    height: 16px;
                }

                .ai-credit {
                    font-size: 11px;
                    color: var(--ai-bubble-text-secondary);
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    flex: 1;
                    white-space: nowrap;
                }

                /* Prompt Manager Panel */
                #aiBubblePrompts {
                    position: absolute;
                    bottom: calc(var(--bubble-size, 56px) + 12px);
                    right: 0;
                    width: 380px;
                    background: var(--ai-bubble-bg);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-radius: 16px;
                    border: 1px solid var(--ai-bubble-border);
                    box-shadow: var(--ai-bubble-shadow);
                    overflow: hidden;
                    opacity: 0;
                    pointer-events: none;
                    transform: translateX(20px);
                    transform-origin: bottom right;
                }

                #aiBubblePrompts.visible {
                    opacity: 1;
                    pointer-events: auto;
                    animation: aiBubbleSettingsSlide 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                .ai-prompts-header {
                    padding: 16px;
                    border-bottom: 1px solid var(--ai-bubble-border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .ai-prompts-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: var(--ai-bubble-text);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .ai-prompts-title i {
                    color: var(--ai-bubble-accent);
                }

                .ai-prompts-close {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--ai-bubble-text-secondary);
                    transition: all 0.2s ease;
                }

                .ai-prompts-back {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--ai-bubble-text-secondary);
                    transition: all 0.2s ease;
                }

                .ai-prompts-close:hover {
                    background: var(--ai-bubble-hover);
                    color: var(--ai-bubble-text);
                }

                .ai-prompts-back:hover {
                    background: var(--ai-bubble-hover);
                    color: var(--ai-bubble-text);
                }

                .ai-prompts-content {
                    padding: 12px 16px 16px;
                    max-height: 480px;
                    overflow-y: auto;
                }

                .ai-prompts-toolbar {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .ai-prompts-toolbar .ai-search-input {
                    flex: 1;
                }

                .ai-tag-filter {
                    width: 120px;
                    padding: 10px 10px;
                    border: 1px solid var(--ai-bubble-border);
                    border-radius: 10px;
                    background: var(--ai-bubble-input-bg);
                    color: var(--ai-bubble-text);
                    font-size: 13px;
                    font-family: inherit;
                    outline: none;
                }

                .ai-prompts-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .ai-prompt-card {
                    border: 1px solid var(--ai-bubble-border);
                    border-radius: 12px;
                    padding: 12px;
                    background: color-mix(in srgb, var(--ai-bubble-bg-solid) 50%, transparent);
                    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
                }

                .ai-prompt-card:hover {
                    transform: translateY(-1px);
                    border-color: rgba(var(--ai-bubble-accent-rgb), 0.35);
                    background: color-mix(in srgb, var(--ai-bubble-bg-solid) 70%, transparent);
                }

                .ai-prompt-top {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 10px;
                }

                .ai-prompt-name {
                    font-weight: 600;
                    font-size: 14px;
                    color: var(--ai-bubble-text);
                    margin-bottom: 4px;
                }

                .ai-prompt-meta {
                    font-size: 12px;
                    color: var(--ai-bubble-text-secondary);
                }

                .ai-tag-row {
                    margin-top: 8px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .ai-tag {
                    font-size: 11px;
                    padding: 3px 8px;
                    border-radius: 999px;
                    border: 1px solid var(--ai-bubble-border);
                    background: rgba(var(--ai-bubble-accent-rgb), 0.08);
                    color: var(--ai-bubble-text);
                }

                .ai-prompt-actions {
                    display: flex;
                    gap: 6px;
                }

                .ai-mini-btn {
                    width: 30px;
                    height: 30px;
                    border-radius: 8px;
                    border: 1px solid var(--ai-bubble-border);
                    background: transparent;
                    cursor: pointer;
                    color: var(--ai-bubble-text-secondary);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .ai-mini-btn:hover {
                    background: var(--ai-bubble-hover);
                    border-color: rgba(var(--ai-bubble-accent-rgb), 0.35);
                    color: var(--ai-bubble-text);
                }

                .ai-mini-btn.primary {
                    background: var(--ai-bubble-accent);
                    border-color: var(--ai-bubble-accent);
                    color: white;
                }

                .ai-mini-btn.primary:hover {
                    filter: brightness(1.08);
                }

                .ai-mini-btn.danger:hover {
                    background: rgba(239, 68, 68, 0.12);
                    border-color: rgba(239, 68, 68, 0.35);
                    color: #ef4444;
                }

                .ai-prompts-footer {
                    padding: 12px 16px;
                    border-top: 1px solid var(--ai-bubble-border);
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    justify-content: space-between;
                }

                .ai-help {
                    font-size: 13px;
                    color: var(--ai-bubble-text-secondary);
                    line-height: 1.4;
                }

                /* Modal Overlay */
                #aiBubbleModalOverlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.35);
                    z-index: 2147483648;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                }

                #aiBubbleModalOverlay.visible {
                    display: flex;
                    animation: aiBubbleMenuSlideIn 0.18s ease-out;
                }

                .ai-modal {
                    width: min(560px, 92vw);
                    max-height: min(680px, 86vh);
                    overflow: hidden;
                    border-radius: 16px;
                    border: 1px solid var(--ai-bubble-border);
                    background: var(--ai-bubble-bg);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    box-shadow: var(--ai-bubble-shadow);
                }

                .ai-modal-header {
                    padding: 14px 16px;
                    border-bottom: 1px solid var(--ai-bubble-border);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                }

                .ai-modal-title {
                    font-weight: 700;
                    color: var(--ai-bubble-text);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .ai-modal-body {
                    padding: 14px 16px;
                    overflow: auto;
                    max-height: calc(min(680px, 86vh) - 56px - 66px);
                }

                .ai-modal-footer {
                    padding: 12px 16px;
                    border-top: 1px solid var(--ai-bubble-border);
                    display: flex;
                    gap: 8px;
                    justify-content: flex-end;
                }

                .ai-field {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 12px;
                }

                .ai-field label {
                    font-size: 12px;
                    font-weight: 600;
                    color: var(--ai-bubble-text-secondary);
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                }

                .ai-input, .ai-textarea {
                    width: 100%;
                    padding: 10px 12px;
                    border: 1px solid var(--ai-bubble-border);
                    border-radius: 10px;
                    background: var(--ai-bubble-input-bg);
                    color: var(--ai-bubble-text);
                    font-size: 14px;
                    font-family: inherit;
                    outline: none;
                }

                .ai-textarea {
                    min-height: 140px;
                    resize: vertical;
                    font-family: inherit;
                }

                .ai-input:focus, .ai-textarea:focus {
                    border-color: var(--ai-bubble-accent);
                    box-shadow: 0 0 0 3px rgba(var(--ai-bubble-accent-rgb), 0.15);
                }

                .ai-bot-checkboxes {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px 12px;
                    padding-top: 4px;
                }

                .ai-bot-checkbox {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    color: var(--ai-bubble-text);
                }

                /* Tooltip */
                .ai-tooltip {
                    position: absolute;
                    background: var(--ai-bubble-bg-solid);
                    color: var(--ai-bubble-text);
                    padding: 6px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    transform: translateY(4px);
                    transition: all 0.2s ease;
                    box-shadow: var(--ai-bubble-shadow-sm);
                    z-index: 2147483648;
                }

                .ai-tooltip.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                /* Compact Mode */
                #aiBubbleContainer.compact .ai-menu-item {
                    padding: 8px 10px;
                    gap: 8px;
                }

                #aiBubbleContainer.compact .ai-menu-item-icon {
                    width: 28px;
                    height: 28px;
                    font-size: 14px;
                }

                #aiBubbleContainer.compact .ai-menu-list {
                    padding: 4px;
                }
            `);
        }

        _hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result
                ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
                : '99, 102, 241';
        }

        _fa(className, title = '') {
            const safeTitle = title ? ` title="${title.replace(/\"/g, '&quot;')}"` : '';
            return `<i class="${className}"${safeTitle} aria-hidden="true"></i>`;
        }

        _hotkeyToKeys(hk) {
            const key = (hk && hk.key ? hk.key : '').toString().trim();
            const keys = [];
            if (hk && hk.ctrl) keys.push('Ctrl');
            if (hk && hk.shift) keys.push('Shift');
            if (hk && hk.alt) keys.push('Alt');
            if (key) keys.push(key.toUpperCase());
            return keys;
        }

        _hotkeyHtml(hk) {
            return this._hotkeyToKeys(hk).map(k => `<span class="ai-hotkey-key">${this._escapeHtml(k)}</span>`).join('');
        }

        _matchesHotkey(e, hk, { strict = true } = {}) {
            if (!hk || !hk.key) return false;
            const keyOk = (e.key || '').toUpperCase() === (hk.key || '').toUpperCase();
            if (!keyOk) return false;

            const reqCtrl = !!hk.ctrl;
            const reqShift = !!hk.shift;
            const reqAlt = !!hk.alt;

            if (reqCtrl && !e.ctrlKey) return false;
            if (reqShift && !e.shiftKey) return false;
            if (reqAlt && !e.altKey) return false;

            if (strict) {
                if (!reqCtrl && e.ctrlKey) return false;
                if (!reqShift && e.shiftKey) return false;
                if (!reqAlt && e.altKey) return false;
            }

            return true;
        }

        _escapeHtml(s) {
            return (s || '').toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        _getFaviconUrl(url) {
            try {
                const host = new URL(url).hostname;
                return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
            } catch {
                return '';
            }
        }

        _getFaviconFallbacks(url) {
            try {
                const u = new URL(url);
                const host = u.hostname;
                return [
                    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`,
                    `https://icons.duckduckgo.com/ip3/${encodeURIComponent(host)}.ico`,
                    `${u.origin}/favicon.ico`
                ];
            } catch {
                return [];
            }
        }

        _getCurrentBotId() {
            const host = window.location.hostname;
            const match = AI_SITES.find(s => {
                try {
                    return new URL(s.url).hostname === host;
                } catch {
                    return false;
                }
            });
            return match ? match.id : null;
        }

        _applyTypography() {
            const preset = this.configManager.get('fontPreset');
            const map = {
                system: { family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", link: null },
                inter: { family: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", link: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap' },
                poppins: { family: "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", link: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap' },
                'jetbrains-mono': { family: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace", link: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap' }
            };
            const selected = map[preset] || map.system;
            document.documentElement.style.setProperty('--ai-bubble-font', selected.family);
            if (selected.link) {
                const id = 'aiBubbleFontLink';
                let link = document.getElementById(id);
                if (!link) {
                    link = document.createElement('link');
                    link.id = id;
                    link.rel = 'stylesheet';
                    document.head.appendChild(link);
                }
                link.href = selected.link;
            }
        }

        _applyMotionPreset() {
            const preset = this.configManager.get('motionPreset');
            const duration = preset === 'subtle' ? '4.2s' : '3.1s';
            this.elements.container?.style?.setProperty('--ai-bubble-wiggle-duration', duration);
        }

        _createElements() {
            // Main Container
            this.elements.container = document.createElement('div');
            this.elements.container.id = 'aiBubbleContainer';
            document.body.appendChild(this.elements.container);

            // Tooltip
            this.elements.tooltip = document.createElement('div');
            this.elements.tooltip.id = 'aiBubbleTooltip';
            this.elements.tooltip.setAttribute('aria-hidden', 'true');
            document.body.appendChild(this.elements.tooltip);

            // Main Bubble Button
            this.elements.button = document.createElement('button');
            this.elements.button.id = 'aiBubbleButton';
            this.elements.button.setAttribute('aria-label', 'Open AI Menu');
            this.elements.button.setAttribute('aria-expanded', 'false');
            this.elements.button.innerHTML = `
                <span class="bubble-icon">${this._fa('fa-solid fa-wand-magic-sparkles')}</span>
                <span class="splash" aria-hidden="true"></span>
            `;
            this.elements.container.appendChild(this.elements.button);

            // Resize Handle
            this.elements.resize = document.createElement('div');
            this.elements.resize.id = 'aiBubbleResize';
            this.elements.resize.innerHTML = ICONS.resize;
            this.elements.resize.setAttribute('data-tooltip', 'Drag to resize');
            this.elements.container.appendChild(this.elements.resize);

            // Sidebar Window Resize Handle (only shown when popup is open)
            this.elements.sidebarResize = document.createElement('div');
            this.elements.sidebarResize.id = 'aiSidebarResize';
            this.elements.sidebarResize.innerHTML = ICONS.resize;
            this.elements.sidebarResize.setAttribute('data-tooltip', 'Drag to resize sidebar window');
            this.elements.container.appendChild(this.elements.sidebarResize);

            // Menu
            this._createMenu();

            // Settings Panel
            this._createSettings();

            // Prompt Manager Panel
            this._createPromptManager();

            // Modal overlay (for prompt editor/import/guidelines)
            this._createModalOverlay();
        }

        _createMenu() {
            this.elements.menu = document.createElement('div');
            this.elements.menu.id = 'aiBubbleMenu';
            this.elements.menu.setAttribute('role', 'menu');
            this.elements.menu.setAttribute('aria-hidden', 'true');

            // Search
            const searchContainer = document.createElement('div');
            searchContainer.className = 'ai-menu-search';
            searchContainer.innerHTML = `
                <div class="ai-search-wrapper">
                    <span class="ai-search-icon">${this._fa('fa-solid fa-magnifying-glass')}</span>
                    <input type="text" class="ai-search-input" placeholder="Search AI assistants..." aria-label="Search">
                </div>
            `;
            this.elements.menu.appendChild(searchContainer);
            this.elements.searchInput = searchContainer.querySelector('.ai-search-input');

            // Items List
            this.elements.menuList = document.createElement('div');
            this.elements.menuList.className = 'ai-menu-list';
            this.elements.menu.appendChild(this.elements.menuList);

            // Footer
            const footer = document.createElement('div');
            footer.className = 'ai-menu-footer';
            footer.innerHTML = `
                <button class="ai-menu-footer-btn" data-action="settings" data-tooltip="Settings">
                    ${this._fa('fa-solid fa-gear')}
                    <span>Settings</span>
                </button>
                <button class="ai-menu-footer-btn" data-action="prompts" data-tooltip="Prompt Manager">
                    ${this._fa('fa-solid fa-book')}
                    <span>Prompts</span>
                </button>
                <button class="ai-menu-footer-btn danger" data-action="hide" data-tooltip="Hide bubble">
                    ${this._fa('fa-solid fa-eye-slash')}
                    <span>Hide</span>
                </button>
            `;
            this.elements.menu.appendChild(footer);

            this.elements.container.appendChild(this.elements.menu);

            this._renderMenuItems();
        }

        _renderMenuItems() {
            const favorites = this.configManager.get('favorites') || [];
            const hiddenSites = this.configManager.get('hiddenSites') || [];
            const query = this.state.searchQuery.toLowerCase();

            let sites = AI_SITES.filter(site => {
                if (hiddenSites.includes(site.id)) return false;
                if (query && !site.name.toLowerCase().includes(query)) return false;
                return true;
            });

            // Sort favorites first
            sites.sort((a, b) => {
                const aFav = favorites.includes(a.id);
                const bFav = favorites.includes(b.id);
                if (aFav && !bFav) return -1;
                if (!aFav && bFav) return 1;
                return 0;
            });

            this.elements.menuList.innerHTML = '';

            if (sites.length === 0) {
                this.elements.menuList.innerHTML = `
                    <div class="ai-menu-empty">
                        <div class="ai-menu-empty-icon">${this._fa('fa-solid fa-magnifying-glass')}</div>
                        <div>No AI assistants found</div>
                    </div>
                `;
                return;
            }

            // Add favorites section if there are favorites
            const favoriteSites = sites.filter(s => favorites.includes(s.id));
            const otherSites = sites.filter(s => !favorites.includes(s.id));

            if (favoriteSites.length > 0 && !query) {
                const favTitle = document.createElement('div');
                favTitle.className = 'ai-menu-section-title';
                favTitle.textContent = 'Favorites';
                this.elements.menuList.appendChild(favTitle);

                favoriteSites.forEach((site, index) => {
                    this.elements.menuList.appendChild(this._createMenuItem(site, favorites, index));
                });

                if (otherSites.length > 0) {
                    const divider = document.createElement('div');
                    divider.className = 'ai-menu-divider';
                    this.elements.menuList.appendChild(divider);

                    const allTitle = document.createElement('div');
                    allTitle.className = 'ai-menu-section-title';
                    allTitle.textContent = 'All AI Assistants';
                    this.elements.menuList.appendChild(allTitle);
                }
            }

            otherSites.forEach((site, index) => {
                this.elements.menuList.appendChild(
                    this._createMenuItem(site, favorites, favoriteSites.length + index)
                );
            });
        }

        _createMenuItem(site, favorites, index) {
            const isFavorite = favorites.includes(site.id);
            const showLoginBadges = this.configManager.get('showLoginBadges');
            const favicon = this._getFaviconUrl(site.url);
            const faviconFallbacks = this._getFaviconFallbacks(site.url);

            const anim = this.state.lastFavoriteToggle;
            const shouldAnim = !!(anim && anim.id === site.id && (Date.now() - anim.at) < 900);

            const item = document.createElement('button');
            item.className = 'ai-menu-item';
            item.setAttribute('role', 'menuitem');
            item.dataset.url = site.url;
            item.dataset.id = site.id;
            item.style.animationDelay = `${index * 0.03}s`;

            item.innerHTML = `
                <div class="ai-menu-item-icon" style="background: ${site.color}20; color: ${site.color}">
                    ${favicon ? `<img class="ai-bot-favicon" alt="" src="${favicon}">` : ''}
                    <span class="ai-bot-fallback">${this._fa(site.faIcon || 'fa-solid fa-robot')}</span>
                </div>
                <div class="ai-menu-item-content">
                    <div class="ai-menu-item-name">${site.name}</div>
                    ${site.loginNeeded && showLoginBadges ? `
                        <div class="ai-menu-item-badge">
                            ${this._fa('fa-solid fa-right-to-bracket')}
                            <span>Login required</span>
                        </div>
                    ` : ''}
                </div>
                <div class="ai-menu-item-actions">
                    <button class="ai-menu-item-fav ${isFavorite ? 'active' : ''} ${shouldAnim ? 'star-anim' : ''}" data-action="favorite" title="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                        ${this._fa(isFavorite ? 'fa-solid fa-star' : 'fa-regular fa-star')}
                    </button>
                    <button class="ai-menu-item-open" data-action="open-window" title="Open ${site.name} in window">
                        ${this._fa('fa-regular fa-window-restore')}
                    </button>
                    <button class="ai-menu-item-open secondary" data-action="open-tab" title="Open ${site.name} in new tab">
                        ${this._fa('fa-solid fa-arrow-up-right-from-square')}
                    </button>
                </div>
            `;

            // Favicon fallback
            const img = item.querySelector('.ai-bot-favicon');
            const fallback = item.querySelector('.ai-bot-fallback');
            if (fallback && (!img || !favicon)) {
                fallback.style.display = 'flex';
            }
            if (img && fallback) {
                img.dataset.faviconIdx = '0';
                img.addEventListener('error', () => {
                    const idx = parseInt(img.dataset.faviconIdx || '0', 10);
                    const next = faviconFallbacks[idx + 1];
                    if (next) {
                        img.dataset.faviconIdx = String(idx + 1);
                        img.src = next;
                        return;
                    }
                    img.style.display = 'none';
                    fallback.style.display = 'flex';
                });
            }

            // Add visible class after a frame for animation
            requestAnimationFrame(() => {
                item.classList.add('visible');
            });

            return item;
        }

        _createSettings() {
            this.elements.settings = document.createElement('div');
            this.elements.settings.id = 'aiBubbleSettings';
            this.elements.settings.setAttribute('aria-hidden', 'true');

            const config = this.configManager.config;
            const colors = ['#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#ef4444', '#f59e0b', '#10b981', '#14b8a6', '#0ea5e9', '#6b7280'];

            const toggleHotkeyHtml = this._hotkeyHtml(config.hotkey);
            const unhideHotkeyHtml = this._hotkeyHtml(config.unhideHotkey);

            this.elements.settings.innerHTML = `
                <div class="ai-settings-header">
                    <button class="ai-settings-back" data-action="back-to-menu" aria-label="Back" data-tooltip="Back to AI menu">
                        ${this._fa('fa-solid fa-chevron-left')}
                    </button>
                    <div class="ai-settings-title">
                        ${this._fa('fa-solid fa-gear')}
                        <span>Settings</span>
                    </div>
                    <button class="ai-settings-close" data-action="close-settings" aria-label="Close" data-tooltip="Close">
                        ${this._fa('fa-solid fa-xmark')}
                    </button>
                </div>
                <div class="ai-settings-content">
                    <div class="ai-settings-section">
                        <div class="ai-settings-section-title">
                            ${this._fa('fa-solid fa-palette')}
                            <span>Appearance</span>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Theme</div>
                            </div>
                            <div class="ai-theme-selector">
                                <button class="ai-theme-btn ${config.theme === 'light' ? 'active' : ''}" data-theme="light" title="Light">
                                    ${this._fa('fa-solid fa-sun')}
                                </button>
                                <button class="ai-theme-btn ${config.theme === 'dark' ? 'active' : ''}" data-theme="dark" title="Dark">
                                    ${this._fa('fa-solid fa-moon')}
                                </button>
                                <button class="ai-theme-btn ${config.theme === 'auto' ? 'active' : ''}" data-theme="auto" title="System">
                                    ${this._fa('fa-solid fa-desktop')}
                                </button>
                            </div>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Accent Color</div>
                            </div>
                            <div class="ai-color-picker">
                                ${colors.map(color => `
                                    <button class="ai-color-swatch ${config.accentColor === color ? 'active' : ''}"
                                        style="background: ${color}" data-color="${color}" title="${color}">
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Bubble Size</div>
                            </div>
                            <div class="ai-slider-container">
                                <input type="range" class="ai-slider" id="bubbleSizeSlider"
                                    min="40" max="80" value="${config.bubbleSize}">
                                <div class="ai-slider-value">${config.bubbleSize}px</div>
                            </div>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Opacity</div>
                            </div>
                            <div class="ai-slider-container">
                                <input type="range" class="ai-slider" id="bubbleOpacitySlider"
                                    min="0.3" max="1" step="0.1" value="${config.bubbleOpacity}">
                                <div class="ai-slider-value">${Math.round(config.bubbleOpacity * 100)}%</div>
                            </div>
                        </div>
                    </div>

                    <div class="ai-settings-section">
                        <div class="ai-settings-section-title">
                            ${this._fa('fa-solid fa-font')}
                            <span>Typography</span>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Font</div>
                                <div class="ai-setting-desc">Applies to the bubble UI</div>
                            </div>
                            <div>
                                <select class="ai-select" id="aiFontPreset">
                                    <option value="system" ${config.fontPreset === 'system' ? 'selected' : ''}>System</option>
                                    <option value="inter" ${config.fontPreset === 'inter' ? 'selected' : ''}>Inter</option>
                                    <option value="poppins" ${config.fontPreset === 'poppins' ? 'selected' : ''}>Poppins</option>
                                    <option value="jetbrains-mono" ${config.fontPreset === 'jetbrains-mono' ? 'selected' : ''}>JetBrains Mono</option>
                                </select>
                            </div>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Motion</div>
                                <div class="ai-setting-desc">Bubble micro-animations</div>
                            </div>
                            <div>
                                <select class="ai-select" id="aiMotionPreset">
                                    <option value="subtle" ${config.motionPreset === 'subtle' ? 'selected' : ''}>Subtle</option>
                                    <option value="lively" ${config.motionPreset === 'lively' ? 'selected' : ''}>Lively</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="ai-settings-section">
                        <div class="ai-settings-section-title">
                            ${this._fa('fa-solid fa-sliders')}
                            <span>Behavior</span>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Open links in</div>
                                <div class="ai-setting-desc">Default when clicking a bot</div>
                            </div>
                            <div class="ai-theme-selector">
                                <button class="ai-theme-btn ${config.openMode === 'window' ? 'active' : ''}" data-open-mode="window" title="Window">
                                    ${this._fa('fa-regular fa-window-restore')}
                                </button>
                                <button class="ai-theme-btn ${config.openMode === 'tab' ? 'active' : ''}" data-open-mode="tab" title="New tab">
                                    ${this._fa('fa-solid fa-arrow-up-right-from-square')}
                                </button>
                            </div>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Auto-open Prompts on AI sites</div>
                                <div class="ai-setting-desc">Show prompt manager on supported AI pages</div>
                            </div>
                            <div class="ai-toggle ${config.openPromptManagerOnAISites ? 'active' : ''}" data-setting="openPromptManagerOnAISites"></div>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Snap to Corners</div>
                                <div class="ai-setting-desc">Only snaps when dropped near a corner</div>
                            </div>
                            <div class="ai-toggle ${config.snapToCorners ? 'active' : ''}" data-setting="snapToCorners"></div>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Compact Mode</div>
                                <div class="ai-setting-desc">Smaller menu items</div>
                            </div>
                            <div class="ai-toggle ${config.compactMode ? 'active' : ''}" data-setting="compactMode"></div>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Show Login Badges</div>
                                <div class="ai-setting-desc">Indicate sites requiring login</div>
                            </div>
                            <div class="ai-toggle ${config.showLoginBadges ? 'active' : ''}" data-setting="showLoginBadges"></div>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Tooltips</div>
                                <div class="ai-setting-desc">Show helpful hover tips</div>
                            </div>
                            <div class="ai-toggle ${config.enableTooltips ? 'active' : ''}" data-setting="enableTooltips"></div>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Sound Effects</div>
                                <div class="ai-setting-desc">Click sounds</div>
                            </div>
                            <div class="ai-toggle ${config.enableSounds ? 'active' : ''}" data-setting="enableSounds"></div>
                        </div>
                    </div>

                    <div class="ai-settings-section">
                        <div class="ai-settings-section-title">
                            ${this._fa('fa-solid fa-keyboard')}
                            <span>Keyboard Shortcut</span>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Toggle Bubble</div>
                            </div>
                            <div class="ai-hotkey-row">
                                <div class="ai-hotkey-display" id="aiHotkeyToggleDisplay">${toggleHotkeyHtml}</div>
                                <button class="ai-mini-btn" data-action="edit-hotkey" data-hotkey="hotkey" data-tooltip="Change shortcut">
                                    ${this._fa('fa-solid fa-pen-to-square')}
                                </button>
                            </div>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Unhide Bubble</div>
                            </div>
                            <div class="ai-hotkey-row">
                                <div class="ai-hotkey-display" id="aiHotkeyUnhideDisplay">${unhideHotkeyHtml}</div>
                                <button class="ai-mini-btn" data-action="edit-hotkey" data-hotkey="unhideHotkey" data-tooltip="Change shortcut">
                                    ${this._fa('fa-solid fa-pen-to-square')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="ai-settings-section">
                        <div class="ai-settings-section-title">
                            ${this._fa('fa-solid fa-window-maximize')}
                            <span>Sidebar Window</span>
                        </div>
                        <div class="ai-setting-row">
                            <div>
                                <div class="ai-setting-label">Width</div>
                            </div>
                            <div class="ai-slider-container">
                                <input type="range" class="ai-slider" id="sidebarWidthSlider"
                                    min="300" max="600" step="20" value="${config.sidebarWidth}">
                                <div class="ai-slider-value">${config.sidebarWidth}px</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ai-settings-footer">
                    <button class="ai-settings-footer-btn secondary" data-action="reset">
                        ${this._fa('fa-solid fa-rotate-left')}
                        <span>Reset</span>
                    </button>
                    <div class="ai-credit">Made by Mayukhjit Chakraborty</div>
                </div>
            `;

            this.elements.container.appendChild(this.elements.settings);
        }

        _createPromptManager() {
            this.elements.prompts = document.createElement('div');
            this.elements.prompts.id = 'aiBubblePrompts';
            this.elements.prompts.setAttribute('aria-hidden', 'true');

            this.elements.prompts.innerHTML = `
                <div class="ai-prompts-header">
                    <button class="ai-prompts-back" data-action="back-to-menu" aria-label="Back" data-tooltip="Back to AI menu">
                        ${this._fa('fa-solid fa-chevron-left')}
                    </button>
                    <div class="ai-prompts-title">
                        ${this._fa('fa-solid fa-book')}
                        <span>Prompt Manager</span>
                    </div>
                    <button class="ai-prompts-close" data-action="close-prompts" aria-label="Close" data-tooltip="Close">
                        ${this._fa('fa-solid fa-xmark')}
                    </button>
                </div>
                <div class="ai-prompts-content">
                    <div class="ai-prompts-toolbar">
                        <div class="ai-search-wrapper" style="flex: 1;">
                            <span class="ai-search-icon">${this._fa('fa-solid fa-magnifying-glass')}</span>
                            <input type="text" class="ai-search-input" id="aiPromptSearch" placeholder="Search prompts..." aria-label="Search prompts">
                        </div>
                        <select class="ai-tag-filter" id="aiPromptTagFilter" aria-label="Tag filter">
                            <option value="">All tags</option>
                        </select>
                    </div>
                    <div class="ai-prompts-list" id="aiPromptsList"></div>
                </div>
                <div class="ai-prompts-footer">
                    <div class="ai-help">Made by Mayukhjit Chakraborty</div>
                    <div style="display:flex; gap:8px;">
                        <button class="ai-mini-btn" data-action="import-prompts" title="Import JSON">
                            ${this._fa('fa-solid fa-file-import')}
                        </button>
                        <button class="ai-mini-btn" data-action="add-prompt" title="Add prompt">
                            ${this._fa('fa-solid fa-plus')}
                        </button>
                    </div>
                </div>
            `;

            this.elements.container.appendChild(this.elements.prompts);

            this.elements.promptSearchInput = this.elements.prompts.querySelector('#aiPromptSearch');
            this.elements.promptTagFilter = this.elements.prompts.querySelector('#aiPromptTagFilter');
            this.elements.promptsList = this.elements.prompts.querySelector('#aiPromptsList');

            this.elements.prompts.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]');
                if (!action) return;
                const type = action.dataset.action;

                if (type === 'back-to-menu') {
                    this.soundManager.play('click');
                    this._closePrompts();
                    this._openMenu();
                    return;
                }

                if (type === 'close-prompts') {
                    this.soundManager.play('close');
                    this._closePrompts();
                    return;
                }

                if (type === 'add-prompt') {
                    this.soundManager.play('click');
                    this._openPromptEditor();
                    return;
                }

                if (type === 'import-prompts') {
                    this.soundManager.play('click');
                    this._openPromptImport();
                    return;
                }

                if (type === 'use-prompt') {
                    this.soundManager.play('click');
                    const card = action.closest('[data-prompt-id]');
                    const id = card?.dataset?.promptId;
                    if (!id) return;
                    const prompt = this.promptLibrary.list().find(p => p.id === id);
                    if (!prompt) return;
                    this._usePrompt(prompt);
                    return;
                }

                if (type === 'edit-prompt') {
                    this.soundManager.play('click');
                    const card = action.closest('[data-prompt-id]');
                    const id = card?.dataset?.promptId;
                    if (!id) return;
                    const prompt = this.promptLibrary.list().find(p => p.id === id);
                    if (!prompt) return;
                    this._openPromptEditor(prompt);
                    return;
                }

                if (type === 'delete-prompt') {
                    this.soundManager.play('click');
                    const card = action.closest('[data-prompt-id]');
                    const id = card?.dataset?.promptId;
                    if (!id) return;
                    this._confirmDeletePrompt(id);
                    return;
                }
            });

            this.elements.promptSearchInput.addEventListener('input', (e) => {
                this.state.promptSearchQuery = (e.target.value || '').toString();
                this._renderPrompts();
            });

            this.elements.promptTagFilter.addEventListener('change', (e) => {
                this.state.promptTagFilter = (e.target.value || '').toString();
                this._renderPrompts();
            });
        }

        _createModalOverlay() {
            this.elements.modalOverlay = document.createElement('div');
            this.elements.modalOverlay.id = 'aiBubbleModalOverlay';
            this.elements.modalOverlay.setAttribute('aria-hidden', 'true');
            this.elements.modalOverlay.innerHTML = `
                <div class="ai-modal" role="dialog" aria-modal="true">
                    <div class="ai-modal-header">
                        <div class="ai-modal-title" id="aiModalTitle">${this._fa('fa-solid fa-layer-group')}<span>Modal</span></div>
                        <button class="ai-mini-btn" data-modal-action="close" aria-label="Close">
                            ${this._fa('fa-solid fa-xmark')}
                        </button>
                    </div>
                    <div class="ai-modal-body" id="aiModalBody"></div>
                    <div class="ai-modal-footer" id="aiModalFooter"></div>
                </div>
            `;

            document.body.appendChild(this.elements.modalOverlay);

            this.elements.modalOverlay.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-modal-action]');
                if (btn) {
                    const action = btn.dataset.modalAction;
                    if (action === 'close') {
                        this.soundManager.play('close');
                        this._closeModal();
                    } else {
                        this._handleModalAction(action);
                    }
                    return;
                }

                // Click outside modal closes
                if (e.target === this.elements.modalOverlay) {
                    this.soundManager.play('close');
                    this._closeModal();
                }
            });

            this._modalActionHandlers = {};
        }

        _openPrompts() {
            this._closeMenu();
            this._closeSettings();
            if (!this.elements.prompts) return;

            this.state.isPromptsOpen = true;
            this.elements.prompts.classList.add('visible');
            this.elements.prompts.setAttribute('aria-hidden', 'false');

            // Sync tag filter options before rendering
            this._populatePromptTagOptions();
            this._renderPrompts();
            this.elements.promptSearchInput?.focus?.();

            this._requestEnsureUIInView();
        }

        _closePrompts() {
            if (!this.elements.prompts) return;
            this.state.isPromptsOpen = false;
            this.elements.prompts.classList.remove('visible');
            this.elements.prompts.setAttribute('aria-hidden', 'true');
        }

        _populatePromptTagOptions() {
            if (!this.elements.promptTagFilter) return;
            const prompts = this.promptLibrary.list();
            const tagSet = new Set();
            prompts.forEach(p => (p.tags || []).forEach(t => tagSet.add(t)));
            const tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b));

            const current = this.state.promptTagFilter || '';
            this.elements.promptTagFilter.innerHTML = `
                <option value="" ${current === '' ? 'selected' : ''}>All tags</option>
                ${tags.map(t => `<option value="${this._escapeHtml(t)}" ${current === t ? 'selected' : ''}>${this._escapeHtml(t)}</option>`).join('')}
            `;
        }

        _renderPrompts() {
            if (!this.elements.promptsList) return;
            const botId = this._getCurrentBotId();
            const q = (this.state.promptSearchQuery || '').trim().toLowerCase();
            const tag = (this.state.promptTagFilter || '').trim();

            let items = this.promptLibrary.list();
            if (botId) {
                items = items.filter(p => p.bots === 'all' || (Array.isArray(p.bots) && p.bots.includes(botId)));
            }
            if (tag) {
                items = items.filter(p => Array.isArray(p.tags) && p.tags.includes(tag));
            }
            if (q) {
                items = items.filter(p => {
                    const hay = `${p.name || ''}\n${p.text || ''}\n${(p.tags || []).join(' ')}`.toLowerCase();
                    return hay.includes(q);
                });
            }

            if (items.length === 0) {
                this.elements.promptsList.innerHTML = `
                    <div class="ai-menu-empty" style="padding: 18px 8px;">
                        <div class="ai-menu-empty-icon">${this._fa('fa-solid fa-book-open')}</div>
                        <div>No prompts found</div>
                    </div>
                `;
                return;
            }

            this.elements.promptsList.innerHTML = items.map(p => {
                const botsLabel = p.bots === 'all'
                    ? 'All bots'
                    : (Array.isArray(p.bots) ? `${p.bots.length} bot${p.bots.length === 1 ? '' : 's'}` : 'All bots');
                const tagHtml = (p.tags || []).slice(0, 8).map(t => `<span class="ai-tag">${this._escapeHtml(t)}</span>`).join('');
                return `
                    <div class="ai-prompt-card" data-prompt-id="${this._escapeHtml(p.id)}">
                        <div class="ai-prompt-top">
                            <div style="flex: 1; min-width: 0;">
                                <div class="ai-prompt-name">${this._escapeHtml(p.name)}</div>
                                <div class="ai-prompt-meta">${this._escapeHtml(botsLabel)}</div>
                            </div>
                            <div class="ai-prompt-actions">
                                <button class="ai-mini-btn primary" data-action="use-prompt" title="Use">
                                    ${this._fa('fa-solid fa-paper-plane')}
                                </button>
                                <button class="ai-mini-btn" data-action="edit-prompt" title="Edit">
                                    ${this._fa('fa-solid fa-pen-to-square')}
                                </button>
                                <button class="ai-mini-btn danger" data-action="delete-prompt" title="Delete">
                                    ${this._fa('fa-solid fa-trash')}
                                </button>
                            </div>
                        </div>
                        ${tagHtml ? `<div class="ai-tag-row">${tagHtml}</div>` : ''}
                    </div>
                `;
            }).join('');
        }

        _openModal({ titleHtml, bodyHtml, footerHtml, handlers }) {
            if (!this.elements.modalOverlay) return;
            const titleEl = this.elements.modalOverlay.querySelector('#aiModalTitle');
            const bodyEl = this.elements.modalOverlay.querySelector('#aiModalBody');
            const footerEl = this.elements.modalOverlay.querySelector('#aiModalFooter');
            if (titleEl) titleEl.innerHTML = titleHtml;
            if (bodyEl) bodyEl.innerHTML = bodyHtml;
            if (footerEl) footerEl.innerHTML = footerHtml;
            this._modalActionHandlers = handlers || {};

            this.elements.modalOverlay.classList.add('visible');
            this.elements.modalOverlay.setAttribute('aria-hidden', 'false');
        }

        _closeModal() {
            if (!this.elements.modalOverlay) return;
            // If a hotkey capture is in progress, always clean it up.
            this._isCapturingHotkey = false;
            try {
                if (this._hotkeyCaptureHandler) {
                    document.removeEventListener('keydown', this._hotkeyCaptureHandler, true);
                }
            } catch {
                // ignore
            }
            this._hotkeyCaptureHandler = null;

            this.elements.modalOverlay.classList.remove('visible');
            this.elements.modalOverlay.setAttribute('aria-hidden', 'true');
            this._modalActionHandlers = {};
        }

        _refreshHotkeyDisplays() {
            const toggleEl = document.getElementById('aiHotkeyToggleDisplay');
            const unhideEl = document.getElementById('aiHotkeyUnhideDisplay');
            if (toggleEl) toggleEl.innerHTML = this._hotkeyHtml(this.configManager.get('hotkey'));
            if (unhideEl) unhideEl.innerHTML = this._hotkeyHtml(this.configManager.get('unhideHotkey'));
        }

        _openHotkeyCapture(settingKey) {
            const label = settingKey === 'unhideHotkey' ? 'Unhide Bubble' : 'Toggle Bubble';
            const current = this._hotkeyToKeys(this.configManager.get(settingKey)).join(' + ') || 'None';
            this._isCapturingHotkey = true;

            this._openModal({
                titleHtml: `${this._fa('fa-solid fa-keyboard')}<span>Set Shortcut</span>`,
                bodyHtml: `
                    <div class="ai-help" style="margin-bottom: 10px;"><strong>${this._escapeHtml(label)}</strong></div>
                    <div class="ai-help" style="margin-bottom: 10px;">Current: <strong>${this._escapeHtml(current)}</strong></div>
                    <div class="ai-help">Press a key combo now (Ctrl/Shift/Alt + key). Press Esc to cancel.</div>
                `,
                footerHtml: `
                    <button class="ai-mini-btn" data-modal-action="close" data-tooltip="Cancel">${this._fa('fa-solid fa-ban')}</button>
                    <button class="ai-mini-btn" data-modal-action="reset" data-tooltip="Reset to default">${this._fa('fa-solid fa-rotate-left')}</button>
                `,
                handlers: {
                    reset: () => {
                        const def = DEFAULT_CONFIG?.[settingKey];
                        if (def) this.configManager.set(settingKey, { ...def });
                        this._refreshHotkeyDisplays();
                        this._closeModal();
                    }
                }
            });

            const onKeyDown = (e) => {
                if (!this._isCapturingHotkey) return;
                e.preventDefault();
                e.stopPropagation();

                if (e.key === 'Escape') {
                    this._closeModal();
                    return;
                }

                const k = (e.key || '').toString();
                const isModifierOnly = (k === 'Shift' || k === 'Control' || k === 'Alt' || k === 'Meta');
                if (isModifierOnly) return;

                const hk = {
                    ctrl: !!e.ctrlKey,
                    shift: !!e.shiftKey,
                    alt: !!e.altKey,
                    key: (k.length === 1 ? k.toUpperCase() : k)
                };

                if (!hk.ctrl && !hk.shift && !hk.alt) {
                    const bodyEl = document.getElementById('aiModalBody');
                    if (bodyEl) {
                        bodyEl.insertAdjacentHTML('afterbegin', `<div class="ai-help" style="color:#ef4444; margin-bottom: 10px;">Use at least one modifier (Ctrl/Shift/Alt) to avoid conflicts.</div>`);
                    }
                    return;
                }

                this.configManager.set(settingKey, hk);
                this._refreshHotkeyDisplays();
                this._closeModal();
            };

            this._hotkeyCaptureHandler = onKeyDown;
            document.addEventListener('keydown', onKeyDown, true);
        }

        _setupTooltips() {
            const show = (text, target) => {
                if (!this.configManager.get('enableTooltips')) return;
                if (!this.elements.tooltip) return;
                if (!text) return;

                this.elements.tooltip.textContent = text;
                this.elements.tooltip.classList.add('visible');
                this.elements.tooltip.setAttribute('aria-hidden', 'false');

                const vp = this._getViewportBounds();
                const r = target.getBoundingClientRect();
                const pad = 8;

                // prefer above, fallback below
                let left = r.left + (r.width / 2);
                let top = r.top - pad;

                const tt = this.elements.tooltip.getBoundingClientRect();
                left = left - (tt.width / 2);
                top = top - tt.height;

                const minLeft = vp.left + 8;
                const maxLeft = (vp.left + vp.width) - tt.width - 8;
                left = Math.max(minLeft, Math.min(left, maxLeft));

                const minTop = vp.top + 8;
                if (top < minTop) {
                    top = r.bottom + pad;
                    const maxTop = (vp.top + vp.height) - tt.height - 8;
                    top = Math.max(minTop, Math.min(top, maxTop));
                }

                this.elements.tooltip.style.left = `${left}px`;
                this.elements.tooltip.style.top = `${top}px`;
            };

            const getTip = (el) => (el?.getAttribute?.('data-tooltip') || '').toString().trim();

            const onOver = (e) => {
                const target = e.target.closest?.('[data-tooltip]');
                if (!target) return;
                if (!this.elements.container.contains(target) && !(this.elements.modalOverlay && this.elements.modalOverlay.contains(target))) return;
                show(getTip(target), target);
            };

            const onOut = (e) => {
                const target = e.target.closest?.('[data-tooltip]');
                if (!target) return;
                const related = e.relatedTarget;
                if (related && target.contains(related)) return;
                this._hideTooltip();
            };

            this.elements.container.addEventListener('mouseover', onOver);
            this.elements.container.addEventListener('mouseout', onOut);
            this.elements.container.addEventListener('mousedown', () => this._hideTooltip(), true);

            if (this.elements.modalOverlay) {
                this.elements.modalOverlay.addEventListener('mouseover', onOver);
                this.elements.modalOverlay.addEventListener('mouseout', onOut);
                this.elements.modalOverlay.addEventListener('mousedown', () => this._hideTooltip(), true);
            }

            document.addEventListener('scroll', () => this._hideTooltip(), true);
        }

        _hideTooltip() {
            if (!this.elements.tooltip) return;
            this.elements.tooltip.classList.remove('visible');
            this.elements.tooltip.setAttribute('aria-hidden', 'true');
        }

        _handleModalAction(action) {
            const fn = this._modalActionHandlers?.[action];
            if (typeof fn === 'function') fn();
        }

        _openPromptEditor(existing = null) {
            const isEdit = !!existing;
            const safeName = existing ? this._escapeHtml(existing.name) : '';
            const safeText = existing ? this._escapeHtml(existing.text) : '';
            const safeTags = existing ? this._escapeHtml((existing.tags || []).join(', ')) : '';
            const bots = existing ? existing.bots : 'all';
            const botIds = AI_SITES.map(s => s.id);
            const selected = bots === 'all' ? new Set(['all']) : new Set(Array.isArray(bots) ? bots : ['all']);

            const botsHtml = `
                <div class="ai-bot-checkboxes">
                    <label class="ai-bot-checkbox">
                        <input type="checkbox" id="aiBotsAll" ${selected.has('all') ? 'checked' : ''}>
                        <span>All bots</span>
                    </label>
                    ${botIds.map(id => {
                        const site = AI_SITES.find(s => s.id === id);
                        const label = site ? site.name : id;
                        const checked = selected.has('all') ? '' : (selected.has(id) ? 'checked' : '');
                        return `
                            <label class="ai-bot-checkbox">
                                <input type="checkbox" class="aiBotCheck" value="${this._escapeHtml(id)}" ${checked}>
                                <span>${this._escapeHtml(label)}</span>
                            </label>
                        `;
                    }).join('')}
                </div>
            `;

            this._openModal({
                titleHtml: `${this._fa('fa-solid fa-pen-to-square')}<span>${isEdit ? 'Edit Prompt' : 'Add Prompt'}</span>`,
                bodyHtml: `
                    <div class="ai-field">
                        <label for="aiPromptName">Name</label>
                        <input class="ai-input" id="aiPromptName" type="text" value="${safeName}" placeholder="e.g., Summarize with action items">
                    </div>
                    <div class="ai-field">
                        <label for="aiPromptText">Prompt</label>
                        <textarea class="ai-textarea" id="aiPromptText" placeholder="Write your prompt...">${safeText}</textarea>
                    </div>
                    <div class="ai-field">
                        <label for="aiPromptTags">Tags (comma-separated)</label>
                        <input class="ai-input" id="aiPromptTags" type="text" value="${safeTags}" placeholder="e.g., summary, writing">
                    </div>
                    <div class="ai-field">
                        <label>Bots</label>
                        ${botsHtml}
                    </div>
                    <div class="ai-help">Template variables supported: <strong>{{content}}</strong>, <strong>{{context}}</strong>, etc.</div>
                `,
                footerHtml: `
                    <button class="ai-mini-btn" data-modal-action="close" title="Cancel">${this._fa('fa-solid fa-ban')}</button>
                    <button class="ai-mini-btn primary" data-modal-action="save" title="Save">${this._fa('fa-solid fa-check')}</button>
                `,
                handlers: {
                    save: () => {
                        const name = (document.getElementById('aiPromptName')?.value || '').trim();
                        const text = (document.getElementById('aiPromptText')?.value || '').toString();
                        const tags = (document.getElementById('aiPromptTags')?.value || '').toString();
                        const all = !!document.getElementById('aiBotsAll')?.checked;
                        const checkedBots = Array.from(document.querySelectorAll('.aiBotCheck')).filter(x => x.checked).map(x => x.value);

                        const prompt = {
                            id: existing?.id,
                            name,
                            text,
                            tags,
                            bots: all ? 'all' : checkedBots
                        };
                        const saved = this.promptLibrary.upsert(prompt);
                        if (!saved) return;
                        this._closeModal();
                        this._populatePromptTagOptions();
                        this._renderPrompts();
                    }
                }
            });

            // keep checkbox logic simple: when All is checked, disable others
            setTimeout(() => {
                const all = document.getElementById('aiBotsAll');
                const others = Array.from(document.querySelectorAll('.aiBotCheck'));
                const sync = () => {
                    const isAll = !!all?.checked;
                    others.forEach(cb => { cb.disabled = isAll; if (isAll) cb.checked = false; });
                };
                all?.addEventListener('change', sync);
                sync();
            }, 0);
        }

        _openPromptImport() {
            this._openModal({
                titleHtml: `${this._fa('fa-solid fa-file-import')}<span>Import Prompts (JSON)</span>`,
                bodyHtml: `
                    <div class="ai-field">
                        <label for="aiImportJson">Paste JSON</label>
                        <textarea class="ai-textarea" id="aiImportJson" placeholder='[{"name":"My prompt","text":"...","tags":["tag"],"bots":"all"}]'></textarea>
                    </div>
                    <div class="ai-help">Supported formats: an array of prompts, or {"prompts": [...]}.</div>
                `,
                footerHtml: `
                    <button class="ai-mini-btn" data-modal-action="close" title="Cancel">${this._fa('fa-solid fa-ban')}</button>
                    <button class="ai-mini-btn primary" data-modal-action="import" title="Import">${this._fa('fa-solid fa-check')}</button>
                `,
                handlers: {
                    import: () => {
                        const jsonText = (document.getElementById('aiImportJson')?.value || '').toString();
                        try {
                            const res = this.promptLibrary.importFromJson(jsonText);
                            this._closeModal();
                            this._populatePromptTagOptions();
                            this._renderPrompts();
                            this.soundManager.play('open');
                        } catch (e) {
                            const bodyEl = document.getElementById('aiModalBody');
                            if (bodyEl) {
                                const msg = (e && e.message) ? e.message : 'Invalid JSON';
                                bodyEl.insertAdjacentHTML('afterbegin', `<div class="ai-help" style="color: #ef4444; margin-bottom: 10px;">${this._escapeHtml(msg)}</div>`);
                            }
                        }
                    }
                }
            });
        }

        _confirmDeletePrompt(id) {
            const prompt = this.promptLibrary.list().find(p => p.id === id);
            if (!prompt) return;
            this._openModal({
                titleHtml: `${this._fa('fa-solid fa-triangle-exclamation')}<span>Delete Prompt</span>`,
                bodyHtml: `<div class="ai-help">Delete <strong>${this._escapeHtml(prompt.name)}</strong>? This cannot be undone.</div>`,
                footerHtml: `
                    <button class="ai-mini-btn" data-modal-action="close" title="Cancel">${this._fa('fa-solid fa-ban')}</button>
                    <button class="ai-mini-btn danger" data-modal-action="delete" title="Delete">${this._fa('fa-solid fa-trash')}</button>
                `,
                handlers: {
                    delete: () => {
                        this.promptLibrary.remove(id);
                        this._closeModal();
                        this._populatePromptTagOptions();
                        this._renderPrompts();
                    }
                }
            });
        }

        _extractTemplateVars(text) {
            const vars = new Set();
            const re = /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g;
            let m;
            while ((m = re.exec(text || '')) !== null) {
                vars.add(m[1]);
            }
            return Array.from(vars);
        }

        _usePrompt(prompt) {
            const vars = this._extractTemplateVars(prompt.text);
            if (vars.length === 0) {
                this._insertIntoChat(prompt.text);
                return;
            }

            const fields = vars.map(v => `
                <div class="ai-field">
                    <label>${this._escapeHtml(v)}</label>
                    <input class="ai-input" data-var="${this._escapeHtml(v)}" type="text" placeholder="${this._escapeHtml(v)}">
                </div>
            `).join('');

            this._openModal({
                titleHtml: `${this._fa('fa-solid fa-wand-magic-sparkles')}<span>Fill Template</span>`,
                bodyHtml: `
                    <div class="ai-help" style="margin-bottom: 10px;">${this._escapeHtml(prompt.name)}</div>
                    ${fields}
                `,
                footerHtml: `
                    <button class="ai-mini-btn" data-modal-action="close" title="Cancel">${this._fa('fa-solid fa-ban')}</button>
                    <button class="ai-mini-btn primary" data-modal-action="apply" title="Insert">${this._fa('fa-solid fa-check')}</button>
                `,
                handlers: {
                    apply: () => {
                        const inputs = Array.from(document.querySelectorAll('[data-var]'));
                        const values = {};
                        inputs.forEach(i => { values[i.getAttribute('data-var')] = i.value || ''; });
                        let text = prompt.text;
                        Object.keys(values).forEach(k => {
                            const re = new RegExp(`\\{\\{\\s*${k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\s*\\}\\}`, 'g');
                            text = text.replace(re, values[k]);
                        });
                        this._closeModal();
                        this._insertIntoChat(text);
                    }
                }
            });
        }

        _findChatInput() {
            const preferred = [
                'textarea#prompt-textarea',
                'textarea[placeholder*="Message" i]',
                'textarea[placeholder*="Send" i]',
                'div[contenteditable="true"][role="textbox"]'
            ];

            for (const sel of preferred) {
                const el = document.querySelector(sel);
                if (el && this._isProbablyChatInput(el)) return el;
            }

            const candidates = Array.from(document.querySelectorAll('textarea, div[contenteditable="true"], [contenteditable="true"]'))
                .filter(el => this._isProbablyChatInput(el));

            if (candidates.length === 0) return null;
            candidates.sort((a, b) => {
                const ra = a.getBoundingClientRect();
                const rb = b.getBoundingClientRect();
                const scoreA = (ra.width * ra.height) + (ra.bottom * 2);
                const scoreB = (rb.width * rb.height) + (rb.bottom * 2);
                return scoreB - scoreA;
            });
            return candidates[0] || null;
        }

        _insertIntoChat(text) {
            const input = this._findChatInput();
            if (!input) {
                this._openModal({
                    titleHtml: `${this._fa('fa-solid fa-circle-info')}<span>Could not find chat input</span>`,
                    bodyHtml: `<div class="ai-help">Open a conversation page and click a prompt again.</div>`,
                    footerHtml: `<button class="ai-mini-btn primary" data-modal-action="close">${this._fa('fa-solid fa-check')}</button>`,
                    handlers: {}
                });
                return;
            }

            try {
                input.focus?.();

                if (input.tagName === 'TEXTAREA' || input.tagName === 'INPUT') {
                    input.value = text;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    input.textContent = text;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                }
            } catch (e) {
                // no-op
            }
        }

        _loadState() {
            const position = this.configManager.get('position');
            const isHidden = this.configManager.get('isHidden');

            if (position.left !== null && position.top !== null) {
                this.elements.container.style.left = `${position.left}px`;
                this.elements.container.style.top = `${position.top}px`;
            } else {
                this.elements.container.style.right = `${position.right}px`;
                this.elements.container.style.bottom = `${position.bottom}px`;
            }

            if (isHidden) {
                this.elements.container.classList.add('hidden');
            }

            if (this.configManager.get('compactMode')) {
                this.elements.container.classList.add('compact');
            }
        }

        _updateBubbleSize() {
            const size = this.configManager.get('bubbleSize');
            this.elements.container.style.setProperty('--bubble-size', `${size}px`);

            // Scale icons with bubble size
            const mainIcon = Math.max(18, Math.min(34, Math.round(size * 0.42)));
            const resizeIcon = Math.max(14, Math.min(24, Math.round(size * 0.28)));
            this.elements.container.style.setProperty('--ai-bubble-main-icon-size', `${mainIcon}px`);
            this.elements.container.style.setProperty('--ai-bubble-resize-size', `${resizeIcon}px`);
        }

        _updateAccentColor() {
            const color = this.configManager.get('accentColor');
            document.documentElement.style.setProperty('--ai-bubble-accent', color);
            document.documentElement.style.setProperty('--ai-bubble-accent-rgb', this._hexToRgb(color));
        }

        _setupEventListeners() {
            // Button click
            this.elements.button.addEventListener('click', (e) => {
                e.stopPropagation();

                const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
                if (this.state.isDragging || this.state.isResizing || this.state.isSidebarResizing || (this.state.suppressClickUntil && now < this.state.suppressClickUntil)) {
                    return;
                }

                // micro-animations
                this.elements.button.classList.remove('popping', 'splashing');
                void this.elements.button.offsetWidth;
                this.elements.button.classList.add('popping', 'splashing');
                setTimeout(() => {
                    this.elements.button.classList.remove('popping', 'splashing');
                }, 650);

                // If the sidebar popup window is open, clicking the bubble closes it
                if (this._hasOpenSidebarWindow()) {
                    this._closeSidebarWindow();
                    return;
                }

                // If any panels are open, clicking the bubble closes them
                if (this.state.isSettingsOpen) {
                    this._closeSettings();
                    return;
                }
                if (this.state.isMenuOpen) {
                    this._closeMenu();
                    return;
                }
                if (this.state.isPromptsOpen) {
                    this._closePrompts();
                    return;
                }

                // On AI bot pages, toggle prompt manager
                if (this._getCurrentBotId()) {
                    this._openPrompts();
                    return;
                }

                this._toggleMenu();
            });

            // Drag handling
            this._setupDrag();

            // Resize handling
            this._setupResize();

            // Sidebar window resize handling
            this._setupSidebarWindowResize();

            // Menu interactions
            this._setupMenuEvents();

            // Settings interactions
            this._setupSettingsEvents();

            // Global events
            this._setupGlobalEvents();

            // Tooltips
            this._setupTooltips();
        }

        _setupDrag() {
            let startX, startY, startLeft, startTop;
            let hasMoved = false;
            let handleRaf = 0;

            const onStart = (e) => {
                if (e.target.closest('#aiBubbleResize') ||
                    e.target.closest('#aiSidebarResize') ||
                    e.target.closest('#aiBubbleMenu') ||
                    e.target.closest('#aiBubbleSettings') ||
                    e.target.closest('#aiBubblePrompts') ||
                    e.target.closest('#aiBubbleModalOverlay')) return;

                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                startX = clientX;
                startY = clientY;
                const rect = this.elements.container.getBoundingClientRect();
                startLeft = rect.left;
                startTop = rect.top;
                hasMoved = false;

                this.state.isDragging = true;
                this.elements.container.classList.add('dragging');

                if (this.hideTimeout) {
                    clearTimeout(this.hideTimeout);
                    this.hideTimeout = null;
                }
            };

            const onMove = (e) => {
                if (!this.state.isDragging) return;

                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                const deltaX = clientX - startX;
                const deltaY = clientY - startY;

                if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                    hasMoved = true;
                }

                const size = this.configManager.get('bubbleSize');
                const vp = this._getViewportBounds();
                const minLeft = vp.left;
                const minTop = vp.top;
                const maxLeft = vp.left + vp.width - size;
                const maxTop = vp.top + vp.height - size;

                const newLeft = Math.max(minLeft, Math.min(startLeft + deltaX, maxLeft));
                const newTop = Math.max(minTop, Math.min(startTop + deltaY, maxTop));

                this.elements.container.style.left = `${newLeft}px`;
                this.elements.container.style.top = `${newTop}px`;
                this.elements.container.style.right = 'auto';
                this.elements.container.style.bottom = 'auto';

                if (this._hasOpenSidebarWindow()) {
                    if (!handleRaf) {
                        handleRaf = requestAnimationFrame(() => {
                            handleRaf = 0;
                            this._updateSidebarResizeHandlePlacement();
                        });
                    }
                }
            };

            const onEnd = () => {
                if (!this.state.isDragging) return;

                this.state.isDragging = false;
                this.elements.container.classList.remove('dragging');

                if (hasMoved) {
                    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
                    this.state.suppressClickUntil = now + 450;
                    this._maybeSnapToCorner();
                }

                if (this._hasOpenSidebarWindow()) {
                    this._updateSidebarResizeHandlePlacement();
                }
            };

            this.elements.button.addEventListener('mousedown', onStart);
            this.elements.button.addEventListener('touchstart', onStart, { passive: true });

            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: true });

            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);
        }

        _setupResize() {
            const onStart = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                this.state.isResizing = true;
                this.state.startSize = this.configManager.get('bubbleSize');
                this.state.startX = clientX;
                this.state.startY = clientY;
            };

            const onMove = (e) => {
                if (!this.state.isResizing) return;

                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                const delta = Math.max(clientX - this.state.startX, clientY - this.state.startY);
                const newSize = Math.max(40, Math.min(80, this.state.startSize + delta));

                this.configManager.set('bubbleSize', newSize);
                this._updateBubbleSize();

                // Update slider if settings is open
                const slider = document.getElementById('bubbleSizeSlider');
                if (slider) {
                    slider.value = newSize;
                    slider.nextElementSibling.textContent = `${newSize}px`;
                }
            };

            const onEnd = () => {
                this.state.isResizing = false;
            };

            this.elements.resize.addEventListener('mousedown', onStart);
            this.elements.resize.addEventListener('touchstart', onStart, { passive: false });

            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: true });

            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);
        }

        _setupSidebarWindowResize() {
            if (!this.elements.sidebarResize) return;

            let startX = 0;
            let startY = 0;
            let startWidth = 0;
            let startHeight = 0;
            let raf = 0;
            let latestW = 0;
            let latestH = 0;

            const clamp = (n, min, max) => Math.max(min, Math.min(n, max));

            const getHostBounds = () => this._getSidebarHostBounds();

            const getCurrentSize = () => {
                const host = getHostBounds();
                const cfgW = this.configManager.get('sidebarWidth') || 420;
                const cfgPct = this.configManager.get('sidebarHeightPercent') || 0.92;
                const cfgH = clamp(Math.round(host.height * cfgPct), 320, Math.max(360, host.height - 24));

                let w = cfgW;
                let h = cfgH;
                try {
                    if (this._sidebarWindow && !this._sidebarWindow.closed) {
                        w = this._sidebarWindow.outerWidth || w;
                        h = this._sidebarWindow.outerHeight || h;
                    }
                } catch {
                    // ignore
                }

                w = clamp(Math.round(w), 300, Math.max(320, host.width - 24));
                h = clamp(Math.round(h), 320, Math.max(360, host.height - 24));
                return { w, h, host };
            };

            const applySize = (width, height) => {
                if (!this._hasOpenSidebarWindow()) return;
                const host = getHostBounds();

                const w = clamp(Math.round(width), 300, Math.max(320, host.width - 24));
                const h = clamp(Math.round(height), 320, Math.max(360, host.height - 24));
                const left = Math.max(host.left, Math.round(host.left + host.width - w));
                const top = Math.max(host.top, Math.min(Math.round(host.top + (host.height - h) / 2), Math.round(host.top + host.height - h)));

                try { this._sidebarWindow.resizeTo(w, h); } catch { /* ignore */ }
                try { this._sidebarWindow.moveTo(left, top); } catch { /* ignore */ }

                this.configManager.set('sidebarWidth', w);
                this.configManager.set('sidebarHeightPercent', clamp(h / host.height, 0.4, 0.98));

                const slider = document.getElementById('sidebarWidthSlider');
                if (slider) {
                    slider.value = w;
                    slider.nextElementSibling.textContent = `${w}px`;
                }
            };

            const scheduleApply = () => {
                if (raf) return;
                raf = requestAnimationFrame(() => {
                    raf = 0;
                    applySize(latestW, latestH);
                });
            };

            const onStart = (e) => {
                if (!this._hasOpenSidebarWindow()) return;
                e.preventDefault();
                e.stopPropagation();

                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                const { w, h } = getCurrentSize();
                startX = clientX;
                startY = clientY;
                startWidth = w;
                startHeight = h;

                // Ensure placement is up-to-date before we pick directions
                this._updateSidebarResizeHandlePlacement();

                const corner = this.state.sidebarResizeCorner || 'tl';
                const dirMap = {
                    br: { sx: 1, sy: 1, cursor: 'se-resize' },
                    bl: { sx: -1, sy: 1, cursor: 'sw-resize' },
                    tr: { sx: 1, sy: -1, cursor: 'ne-resize' },
                    tl: { sx: -1, sy: -1, cursor: 'nw-resize' }
                };
                const dir = dirMap[corner] || dirMap.tl;
                this._sidebarResizeDir = dir;

                this.state.isSidebarResizing = true;
                this.elements.container.classList.add('sidebar-resizing');
                this.elements.container.style.setProperty('--ai-sidebar-resize-cursor', dir.cursor);
                document.documentElement.style.cursor = dir.cursor;

                if (this.hideTimeout) {
                    clearTimeout(this.hideTimeout);
                    this.hideTimeout = null;
                }
            };

            const onMove = (e) => {
                if (!this.state.isSidebarResizing) return;
                const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                const clientY = e.touches ? e.touches[0].clientY : e.clientY;

                const dx = clientX - startX;
                const dy = clientY - startY;

                const dir = this._sidebarResizeDir || { sx: 1, sy: 1 };
                latestW = startWidth + (dx * dir.sx);
                latestH = startHeight + (dy * dir.sy);
                scheduleApply();
            };

            const onEnd = () => {
                if (!this.state.isSidebarResizing) return;
                this.state.isSidebarResizing = false;
                this.elements.container.classList.remove('sidebar-resizing');
                this.elements.container.style.removeProperty('--ai-sidebar-resize-cursor');
                document.documentElement.style.cursor = '';
                this._sidebarResizeDir = null;

                const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
                this.state.suppressClickUntil = now + 250;
            };

            this.elements.sidebarResize.addEventListener('mousedown', onStart);
            this.elements.sidebarResize.addEventListener('touchstart', onStart, { passive: false });

            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: true });

            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchend', onEnd);
        }

        _setupMenuEvents() {
            // Search input
            this.elements.searchInput.addEventListener('input', (e) => {
                this.state.searchQuery = e.target.value;
                this._renderMenuItems();
            });

            // Menu item clicks
            this.elements.menu.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]');
                if (action) {
                    const actionType = action.dataset.action;

                    switch (actionType) {
                        case 'settings':
                            this.soundManager.play('click');
                            this._closeMenu();
                            this._openSettings();
                            break;
                        case 'prompts':
                            this.soundManager.play('click');
                            this._closeMenu();
                            this._openPrompts();
                            break;
                        case 'hide':
                            this.soundManager.play('close');
                            this._closeMenu();
                            this._hide();
                            break;
                        case 'favorite':
                            e.stopPropagation();
                            this.soundManager.play('click');
                            const item = action.closest('.ai-menu-item');
                            if (item) {
                                this._toggleFavorite(item.dataset.id);
                            }
                            break;
                        case 'open-window':
                            e.stopPropagation();
                            this.soundManager.play('open');
                            const menuItem = action.closest('.ai-menu-item');
                            if (menuItem) {
                                this._openWindow(menuItem.dataset.url);
                                this._closeMenu();
                            }
                            break;
                        case 'open-tab':
                            e.stopPropagation();
                            this.soundManager.play('open');
                            const mi = action.closest('.ai-menu-item');
                            if (mi) {
                                this._openTab(mi.dataset.url);
                                this._closeMenu();
                            }
                            break;
                    }
                    return;
                }

                // Direct click on menu item
                const menuItem = e.target.closest('.ai-menu-item');
                if (menuItem && menuItem.dataset.url) {
                    this.soundManager.play('open');
                    const mode = this.configManager.get('openMode');
                    if (mode === 'tab') this._openTab(menuItem.dataset.url);
                    else this._openWindow(menuItem.dataset.url);
                    this._closeMenu();
                }
            });

            // Hover behavior
            this.elements.container.addEventListener('mouseenter', () => {
                if (this.hideTimeout) {
                    clearTimeout(this.hideTimeout);
                    this.hideTimeout = null;
                }
            });

            this.elements.container.addEventListener('mouseleave', () => {
                if (this.state.isMenuOpen && !this.state.isSettingsOpen) {
                    const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
                    if (this.state.isDragging || this.state.isResizing || this.state.isSidebarResizing || (this.state.suppressClickUntil && now < this.state.suppressClickUntil)) return;
                    const hasQuery = !!(this.state.searchQuery && this.state.searchQuery.trim().length > 0);
                    const active = document.activeElement;
                    const searchFocused = active === this.elements.searchInput;
                    if (searchFocused || hasQuery) return;
                    this.hideTimeout = setTimeout(() => {
                        this._closeMenu();
                    }, 300);
                }
            });
        }

        _setupSettingsEvents() {
            this.elements.settings.addEventListener('click', (e) => {
                const action = e.target.closest('[data-action]');
                if (action) {
                    const actionType = action.dataset.action;

                    if (actionType === 'back-to-menu') {
                        this.soundManager.play('click');
                        this._closeSettings();
                        this._openMenu();
                        return;
                    }

                    if (actionType === 'edit-hotkey') {
                        this.soundManager.play('click');
                        const key = (action.dataset.hotkey || '').toString();
                        if (key === 'hotkey' || key === 'unhideHotkey') {
                            this._openHotkeyCapture(key);
                        }
                        return;
                    }

                    switch (actionType) {
                        case 'close-settings':
                            this.soundManager.play('close');
                            this._closeSettings();
                            break;
                        case 'reset':
                            this.soundManager.play('click');
                            this._resetSettings();
                            break;
                    }
                    return;
                }

                // Open mode buttons
                const openModeBtn = e.target.closest('[data-open-mode]');
                if (openModeBtn) {
                    this.soundManager.play('click');
                    const mode = openModeBtn.dataset.openMode;
                    if (mode === 'window' || mode === 'tab') {
                        this.configManager.set('openMode', mode);
                        this.elements.settings.querySelectorAll('[data-open-mode]').forEach(btn => {
                            btn.classList.toggle('active', btn.dataset.openMode === mode);
                        });
                    }
                    return;
                }

                // Theme buttons
                const themeBtn = e.target.closest('[data-theme]');
                if (themeBtn) {
                    this.soundManager.play('click');
                    const theme = themeBtn.dataset.theme;
                    this.themeManager.setTheme(theme);
                    this.elements.settings.querySelectorAll('.ai-theme-btn').forEach(btn => {
                        btn.classList.toggle('active', btn.dataset.theme === theme);
                    });
                    return;
                }

                // Color swatches
                const colorSwatch = e.target.closest('[data-color]');
                if (colorSwatch) {
                    this.soundManager.play('click');
                    const color = colorSwatch.dataset.color;
                    this.configManager.set('accentColor', color);
                    this._updateAccentColor();
                    this.elements.settings.querySelectorAll('.ai-color-swatch').forEach(swatch => {
                        swatch.classList.toggle('active', swatch.dataset.color === color);
                    });
                    return;
                }

                // Toggle switches
                const toggle = e.target.closest('.ai-toggle');
                if (toggle) {
                    this.soundManager.play('click');
                    const setting = toggle.dataset.setting;
                    const newValue = !this.configManager.get(setting);
                    this.configManager.set(setting, newValue);
                    toggle.classList.toggle('active', newValue);

                    if (setting === 'compactMode') {
                        this.elements.container.classList.toggle('compact', newValue);
                    } else if (setting === 'showLoginBadges') {
                        this._renderMenuItems();
                    } else if (setting === 'enableTooltips') {
                        this._hideTooltip();
                    }
                }
            });

            // Selects
            this.elements.settings.addEventListener('change', (e) => {
                if (e.target.id === 'aiFontPreset') {
                    const value = (e.target.value || 'system').toString();
                    this.configManager.set('fontPreset', value);
                    this._applyTypography();
                } else if (e.target.id === 'aiMotionPreset') {
                    const value = (e.target.value || 'lively').toString();
                    this.configManager.set('motionPreset', value);
                    this._applyMotionPreset();
                }
            });

            // Sliders
            this.elements.settings.addEventListener('input', (e) => {
                if (e.target.id === 'bubbleSizeSlider') {
                    const value = parseInt(e.target.value);
                    this.configManager.set('bubbleSize', value);
                    this._updateBubbleSize();
                    e.target.nextElementSibling.textContent = `${value}px`;
                } else if (e.target.id === 'bubbleOpacitySlider') {
                    const value = parseFloat(e.target.value);
                    this.configManager.set('bubbleOpacity', value);
                    this.elements.container.style.setProperty('--bubble-opacity', value);
                    e.target.nextElementSibling.textContent = `${Math.round(value * 100)}%`;
                } else if (e.target.id === 'sidebarWidthSlider') {
                    const value = parseInt(e.target.value);
                    this.configManager.set('sidebarWidth', value);
                    e.target.nextElementSibling.textContent = `${value}px`;

                    if (this._hasOpenSidebarWindow()) {
                        const host = this._getSidebarHostBounds();
                        const pct = this.configManager.get('sidebarHeightPercent') || 0.92;
                        const height = Math.min(host.height * pct, host.height - 24);
                        this._applySidebarWindowSize(value, height);
                    }
                }
            });
        }

        _setupGlobalEvents() {
            // Click outside to close
            document.addEventListener('click', (e) => {
                if (!this.elements.container.contains(e.target)) {
                    if (this.state.isMenuOpen) this._closeMenu();
                    if (this.state.isSettingsOpen) this._closeSettings();
                    if (this.state.isPromptsOpen) this._closePrompts();
                }

                // Recovery: if hidden, click bottom-right corner to show
                if (this.elements.container.classList.contains('hidden')) {
                    const margin = 28;
                    const inCorner = e.clientX >= (window.innerWidth - margin) && e.clientY >= (window.innerHeight - margin);
                    if (inCorner) this._show();
                }
            });

            // Keyboard shortcut
            document.addEventListener('keydown', (e) => {
                if (this._isCapturingHotkey) return;
                const hotkey = this.configManager.get('hotkey');
                const unhide = this.configManager.get('unhideHotkey');
                const isHidden = this.elements.container.classList.contains('hidden');

                // Dedicated unhide hotkey (allow extra modifiers for reliability)
                if (isHidden && this._matchesHotkey(e, unhide, { strict: false })) {
                    e.preventDefault();
                    this._show();
                    return;
                }

                // Toggle hotkey (strict match to avoid accidental triggers)
                if (this._matchesHotkey(e, hotkey, { strict: true })) {
                    e.preventDefault();
                    this._toggleVisibility();
                }

                // Escape to close
                if (e.key === 'Escape') {
                    // Recovery: if hidden, double-tap Escape to show
                    if (this.elements.container.classList.contains('hidden')) {
                        const now = Date.now();
                        if (now - (this._lastEscapeAt || 0) < 800) {
                            this._show();
                            this._lastEscapeAt = 0;
                            return;
                        }
                        this._lastEscapeAt = now;
                        return;
                    }

                    if (this.state.isSettingsOpen) this._closeSettings();
                    else if (this.state.isMenuOpen) this._closeMenu();
                    else if (this.state.isPromptsOpen) this._closePrompts();
                }
            });

            // Window resize
            let resizeTimeout;
            window.addEventListener('resize', () => {
                if (resizeTimeout) clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => {
                    this._clampToViewport();
                    if (this.state.isMenuOpen || this.state.isSettingsOpen || this.state.isPromptsOpen) {
                        this._requestEnsureUIInView();
                    }
                }, 100);
            });

            // Zoom / visual viewport changes (mobile + pinch zoom)
            if (window.visualViewport) {
                const vv = window.visualViewport;
                this._lastVisualViewport = {
                    offsetLeft: vv.offsetLeft || 0,
                    offsetTop: vv.offsetTop || 0,
                    width: vv.width,
                    height: vv.height
                };

                this._vvRaf = 0;

                const onVvChange = () => {
                    if (this.state.isDragging || this.state.isResizing) return;
                    if (this._vvRaf) return;
                    this._vvRaf = requestAnimationFrame(() => {
                        this._vvRaf = 0;
                        this._preservePositionOnVisualViewportChange();
                        if (this.state.isMenuOpen || this.state.isSettingsOpen || this.state.isPromptsOpen) {
                            this._requestEnsureUIInView();
                        }
                    });
                };
                vv.addEventListener('resize', onVvChange);
                vv.addEventListener('scroll', onVvChange);
            }
        }

        _toggleMenu() {
            if (this.state.isMenuOpen) {
                this._closeMenu();
            } else {
                this._openMenu();
            }
        }

        _openMenu() {
            if (this.state.isSettingsOpen) this._closeSettings();

            this.state.isMenuOpen = true;
            this.elements.menu.classList.add('visible');
            this.elements.menu.setAttribute('aria-hidden', 'false');
            this.elements.button.setAttribute('aria-expanded', 'true');
            this.soundManager.play('open');

            this._requestEnsureUIInView();

            // Focus search input
            setTimeout(() => {
                this.elements.searchInput.focus();
            }, 100);
        }

        _closeMenu() {
            this.state.isMenuOpen = false;
            this.elements.menu.classList.add('closing');
            this.elements.menu.setAttribute('aria-hidden', 'true');
            this.elements.button.setAttribute('aria-expanded', 'false');

            setTimeout(() => {
                this.elements.menu.classList.remove('visible', 'closing');
            }, 200);

            // Clear search
            this.state.searchQuery = '';
            this.elements.searchInput.value = '';
            this._renderMenuItems();
        }

        _openSettings() {
            this.state.isSettingsOpen = true;
            this.elements.settings.classList.add('visible');
            this.elements.settings.setAttribute('aria-hidden', 'false');

            this._requestEnsureUIInView();
        }

        _closeSettings() {
            this.state.isSettingsOpen = false;
            this.elements.settings.classList.remove('visible');
            this.elements.settings.setAttribute('aria-hidden', 'true');
        }

        _toggleFavorite(siteId) {
            const favorites = this.configManager.get('favorites') || [];
            const index = favorites.indexOf(siteId);
            const willBeFavorite = index === -1;

            if (index > -1) {
                favorites.splice(index, 1);
            } else {
                favorites.push(siteId);
            }

            this.state.lastFavoriteToggle = { id: siteId, on: willBeFavorite, at: Date.now() };

            this.configManager.set('favorites', favorites);
            this._renderMenuItems();
        }

        _openWindow(url) {
            try {
                const host = this._getSidebarHostBounds();
                const sidebarWidth = this.configManager.get('sidebarWidth');
                const sidebarHeightPercent = this.configManager.get('sidebarHeightPercent');

                const maxWidth = Math.max(320, host.width - 24);
                const maxHeight = Math.max(360, host.height - 24);

                const width = Math.min(sidebarWidth, maxWidth);
                const height = Math.min(host.height * sidebarHeightPercent, maxHeight);

                const left = Math.max(host.left, Math.round(host.left + host.width - width));
                const top = Math.max(host.top, Math.min(Math.round(host.top + (host.height - height) / 2), Math.round(host.top + host.height - height)));

                const features = `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes`;
                const urlWithParam = `${url}${url.includes('?') ? '&' : '?'}ai_sidebar_window=true`;

                const newWindow = window.open(urlWithParam, 'AIFloatingSidebar', features);

                if (newWindow && !newWindow.closed) {
                    this._sidebarWindow = newWindow;
                    this.elements.container.classList.add('sidebar-open');
                    this._updateSidebarResizeHandlePlacement();
                    this._startSidebarConstraintLoop();
                    try { newWindow.focus(); } catch { /* ignore */ }
                }

                if (!newWindow || newWindow.closed) {
                    console.warn('Popup blocked. Opening in current tab.');
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
            } catch (error) {
                console.error('Error opening sidebar:', error);
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        }

        _openTab(url) {
            try {
                window.open(url, '_blank', 'noopener,noreferrer');
            } catch (e) {
                window.open(url, '_blank');
            }
        }

        _hasOpenSidebarWindow() {
            const open = !!(this._sidebarWindow && !this._sidebarWindow.closed);
            if (!open) {
                this.elements.container.classList.remove('sidebar-open');
                this._clearSidebarResizeCornerClasses();
                this._stopSidebarConstraintLoop();
            }
            return open;
        }

        _getSidebarHostBounds() {
            // Prefer the browser *viewport* bounds (webpage area) so the sidebar feels "stuck" inside the site.
            // In Chrome we can approximate the screen-space viewport rectangle using:
            // - outer window top-left in screen coords (screenX/screenY)
            // - inner viewport size (innerWidth/innerHeight)
            // - outer - inner as "chrome" thickness (estimated split between sides/top/bottom)
            try {
                const left = (typeof window.screenX === 'number') ? window.screenX : (window.screenLeft || 0);
                const top = (typeof window.screenY === 'number') ? window.screenY : (window.screenTop || 0);
                const width = window.outerWidth || window.innerWidth;
                const height = window.outerHeight || window.innerHeight;
                const innerW = window.innerWidth || width;
                const innerH = window.innerHeight || height;

                if (width && height && innerW && innerH && isFinite(left) && isFinite(top)) {
                    const chromeW = Math.max(0, width - innerW);
                    const chromeH = Math.max(0, height - innerH);

                    // Assume left/right chrome are roughly symmetric.
                    const insetLeft = Math.round(chromeW / 2);
                    const insetRight = chromeW - insetLeft;

                    // Bottom border is usually small; approximate as left inset.
                    const insetBottom = Math.min(Math.max(0, insetLeft), chromeH);
                    const insetTop = Math.max(0, chromeH - insetBottom);

                    const viewportLeft = left + insetLeft;
                    const viewportTop = top + insetTop;
                    const viewportWidth = Math.max(1, width - insetLeft - insetRight);
                    const viewportHeight = Math.max(1, height - insetTop - insetBottom);

                    // Guard: if computed viewport looks wrong, fall back to outer.
                    if (viewportWidth > 50 && viewportHeight > 50) {
                        return { left: viewportLeft, top: viewportTop, width: viewportWidth, height: viewportHeight };
                    }

                    return { left, top, width, height };
                }
            } catch {
                // ignore
            }

            // Fallback to available screen work area.
            const s = window.screen || { width: window.innerWidth, height: window.innerHeight };
            const left = (typeof s.availLeft === 'number') ? s.availLeft : 0;
            const top = (typeof s.availTop === 'number') ? s.availTop : 0;
            const width = (typeof s.availWidth === 'number') ? s.availWidth : (s.width || window.innerWidth);
            const height = (typeof s.availHeight === 'number') ? s.availHeight : (s.height || window.innerHeight);
            return { left, top, width, height };
        }

        _constrainSidebarWindowToHost() {
            if (!this._hasOpenSidebarWindow()) return;

            const host = this._getSidebarHostBounds();
            let w = this.configManager.get('sidebarWidth') || 420;
            let h = Math.round((this.configManager.get('sidebarHeightPercent') || 0.92) * host.height);

            try {
                w = this._sidebarWindow.outerWidth || w;
                h = this._sidebarWindow.outerHeight || h;
            } catch {
                // ignore
            }

            this._applySidebarWindowSize(w, h);
        }

        _startSidebarConstraintLoop() {
            if (this._sidebarConstraintTimer) return;
            this._sidebarConstraintTimer = setInterval(() => {
                if (!this._hasOpenSidebarWindow()) {
                    this._stopSidebarConstraintLoop();
                    return;
                }
                this._constrainSidebarWindowToHost();
            }, 750);
        }

        _stopSidebarConstraintLoop() {
            if (this._sidebarConstraintTimer) {
                clearInterval(this._sidebarConstraintTimer);
                this._sidebarConstraintTimer = null;
            }
        }

        _clearSidebarResizeCornerClasses() {
            const c = this.elements.container;
            if (!c) return;
            c.classList.remove('sidebar-resize-tl', 'sidebar-resize-tr', 'sidebar-resize-bl', 'sidebar-resize-br');
        }

        _updateSidebarResizeHandlePlacement() {
            if (!this.elements.container) return;
            if (!this._hasOpenSidebarWindow()) return;

            const vp = this._getViewportBounds();
            const rect = this.elements.container.getBoundingClientRect();
            const centerX = (rect.left + rect.width / 2) - vp.left;
            const centerY = (rect.top + rect.height / 2) - vp.top;

            const isLeft = centerX < (vp.width / 2);
            const isTop = centerY < (vp.height / 2);

            // Place the handle on the "inward" corner so resizing feels natural.
            // Bubble top-left => handle bottom-right, etc.
            let corner = 'tl';
            if (isTop && isLeft) corner = 'br';
            else if (isTop && !isLeft) corner = 'bl';
            else if (!isTop && isLeft) corner = 'tr';
            else corner = 'tl';

            this.state.sidebarResizeCorner = corner;
            this._clearSidebarResizeCornerClasses();
            this.elements.container.classList.add(`sidebar-resize-${corner}`);
        }

        _applySidebarWindowSize(width, height) {
            if (!this._hasOpenSidebarWindow()) return;
            const host = this._getSidebarHostBounds();

            const w = Math.max(300, Math.min(Math.round(width), Math.max(320, host.width - 24)));
            const h = Math.max(320, Math.min(Math.round(height), Math.max(360, host.height - 24)));

            const left = Math.max(host.left, Math.round(host.left + host.width - w));
            const top = Math.max(host.top, Math.min(Math.round(host.top + (host.height - h) / 2), Math.round(host.top + host.height - h)));

            try { this._sidebarWindow.resizeTo(w, h); } catch { /* ignore */ }
            try { this._sidebarWindow.moveTo(left, top); } catch { /* ignore */ }

            this.elements.container.classList.add('sidebar-open');
            this._updateSidebarResizeHandlePlacement();
        }

        _closeSidebarWindow() {
            try {
                if (this._sidebarWindow && !this._sidebarWindow.closed) {
                    this._sidebarWindow.close();
                }
            } catch {
                // ignore
            }

            this.elements.container.classList.remove('sidebar-open');
            this._clearSidebarResizeCornerClasses();
            this._stopSidebarConstraintLoop();
        }

        _hide() {
            this.elements.container.classList.add('hidden');
            this.configManager.set('isHidden', true);
        }

        _show() {
            this.elements.container.classList.remove('hidden');
            this.configManager.set('isHidden', false);
        }

        _toggleVisibility() {
            const isHidden = this.elements.container.classList.contains('hidden');
            if (isHidden) {
                this._show();
            } else {
                this._hide();
            }
        }

        _savePosition() {
            const computed = window.getComputedStyle(this.elements.container);
            const left = parseFloat(computed.left);
            const top = parseFloat(computed.top);
            const rect = (Number.isFinite(left) && Number.isFinite(top)) ? null : this.elements.container.getBoundingClientRect();
            this.configManager.set('position', {
                left: rect ? rect.left : left,
                top: rect ? rect.top : top,
                right: null,
                bottom: null
            });
        }

        _getCurrentLeftTop() {
            const computed = window.getComputedStyle(this.elements.container);
            const left = parseFloat(computed.left);
            const top = parseFloat(computed.top);
            if (Number.isFinite(left) && Number.isFinite(top)) return { left, top };
            const rect = this.elements.container.getBoundingClientRect();
            return { left: rect.left, top: rect.top };
        }

        _requestEnsureUIInView() {
            if (this._ensureUiRaf) return;
            this._ensureUiRaf = requestAnimationFrame(() => {
                this._ensureUiRaf = 0;
                this._ensureUIInView();
            });
        }

        _ensureUIInView() {
            // Bubble itself
            this._clampToViewport();

            const panels = [];
            if (this.state.isMenuOpen) panels.push(this.elements.menu);
            if (this.state.isSettingsOpen) panels.push(this.elements.settings);
            if (this.state.isPromptsOpen) panels.push(this.elements.prompts);

            // Shrink scroll areas if viewport is tight
            for (const panel of panels) {
                if (panel && panel.classList.contains('visible')) {
                    this._autoFitPanel(panel);
                }
            }

            // Move bubble so attached panels stay fully visible
            for (let pass = 0; pass < 2; pass++) {
                const vp = this._getViewportBounds();
                const margin = 10;
                const vpLeft = vp.left + margin;
                const vpTop = vp.top + margin;
                const vpRight = vp.left + vp.width - margin;
                const vpBottom = vp.top + vp.height - margin;

                let totalDx = 0;
                let totalDy = 0;

                for (const panel of panels) {
                    if (!panel || !panel.classList.contains('visible')) continue;
                    const rect = panel.getBoundingClientRect();

                    if (rect.left < vpLeft) totalDx = Math.max(totalDx, (vpLeft - rect.left));
                    if (rect.right > vpRight) totalDx = Math.min(totalDx, (vpRight - rect.right));
                    if (rect.top < vpTop) totalDy = Math.max(totalDy, (vpTop - rect.top));
                    if (rect.bottom > vpBottom) totalDy = Math.min(totalDy, (vpBottom - rect.bottom));
                }

                if (!totalDx && !totalDy) break;

                const bubblePos = this._getCurrentLeftTop();
                this.elements.container.style.left = `${bubblePos.left + totalDx}px`;
                this.elements.container.style.top = `${bubblePos.top + totalDy}px`;
                this.elements.container.style.right = 'auto';
                this.elements.container.style.bottom = 'auto';

                this._clampToViewport();
            }
        }

        _autoFitPanel(panelEl) {
            const vp = this._getViewportBounds();
            const margin = 10;
            const available = Math.max(220, (vp.height - (margin * 2)));

            if (panelEl.id === 'aiBubbleMenu') {
                const list = panelEl.querySelector('.ai-menu-list');
                if (!list) return;
                const panelRect = panelEl.getBoundingClientRect();
                const listRect = list.getBoundingClientRect();
                const chrome = Math.max(0, panelRect.height - listRect.height);
                const target = Math.max(160, available - chrome);
                const cap = this.configManager.get('compactMode') ? 260 : 320;
                list.style.maxHeight = `${Math.min(cap, target)}px`;
                return;
            }

            if (panelEl.id === 'aiBubbleSettings') {
                const content = panelEl.querySelector('.ai-settings-content');
                const header = panelEl.querySelector('.ai-settings-header');
                const footer = panelEl.querySelector('.ai-settings-footer');
                if (!content) return;

                const chrome = (header?.getBoundingClientRect().height || 0) + (footer?.getBoundingClientRect().height || 0) + 24;
                const target = Math.max(160, available - chrome);
                content.style.maxHeight = `${Math.min(400, target)}px`;
                return;
            }

            if (panelEl.id === 'aiBubblePrompts') {
                const content = panelEl.querySelector('.ai-prompts-content');
                const header = panelEl.querySelector('.ai-prompts-header');
                const footer = panelEl.querySelector('.ai-prompts-footer');
                if (!content) return;

                const chrome = (header?.getBoundingClientRect().height || 0) + (footer?.getBoundingClientRect().height || 0) + 24;
                const target = Math.max(180, available - chrome);
                content.style.maxHeight = `${Math.min(480, target)}px`;
                return;
            }
        }

        _getViewportBounds() {
            const vv = window.visualViewport;
            if (vv && Number.isFinite(vv.width) && Number.isFinite(vv.height)) {
                return {
                    left: vv.offsetLeft || 0,
                    top: vv.offsetTop || 0,
                    width: vv.width,
                    height: vv.height
                };
            }
            return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
        }

        _getSnapCorners() {
            const size = this.configManager.get('bubbleSize');
            const vp = this._getViewportBounds();
            const padding = 12;

            return [
                { left: vp.left + padding, top: vp.top + padding },
                { left: vp.left + vp.width - size - padding, top: vp.top + padding },
                { left: vp.left + padding, top: vp.top + vp.height - size - padding },
                { left: vp.left + vp.width - size - padding, top: vp.top + vp.height - size - padding }
            ];
        }

        _maybeSnapToCorner() {
            if (!this.configManager.get('snapToCorners')) {
                this._clampToViewport();
                return;
            }

            const rect = this.elements.container.getBoundingClientRect();
            const corners = this._getSnapCorners();
            const radius = 110; // px: snap only when dropped near a corner

            let best = corners[0];
            let bestD = Number.POSITIVE_INFINITY;
            for (const c of corners) {
                const dx = rect.left - c.left;
                const dy = rect.top - c.top;
                const d = Math.sqrt((dx * dx) + (dy * dy));
                if (d < bestD) {
                    bestD = d;
                    best = c;
                }
            }

            if (bestD <= radius) {
                this.elements.container.style.left = `${best.left}px`;
                this.elements.container.style.top = `${best.top}px`;
                this.elements.container.style.right = 'auto';
                this.elements.container.style.bottom = 'auto';
            }

            this._clampToViewport();
        }

        _preservePositionOnVisualViewportChange() {
            const vv = window.visualViewport;
            if (!vv) {
                this._clampToViewport();
                return;
            }

            const last = this._lastVisualViewport;
            this._lastVisualViewport = {
                offsetLeft: vv.offsetLeft || 0,
                offsetTop: vv.offsetTop || 0,
                width: vv.width,
                height: vv.height
            };

            if (!last || !Number.isFinite(last.width) || !Number.isFinite(last.height)) {
                this._clampToViewport();
                return;
            }

            const size = this.configManager.get('bubbleSize');
            const pos = this._getCurrentLeftTop();

            const oldAvailW = Math.max(1, last.width - size);
            const oldAvailH = Math.max(1, last.height - size);
            const fracX = Math.max(0, Math.min(1, (pos.left - (last.offsetLeft || 0)) / oldAvailW));
            const fracY = Math.max(0, Math.min(1, (pos.top - (last.offsetTop || 0)) / oldAvailH));

            const newAvailW = Math.max(1, vv.width - size);
            const newAvailH = Math.max(1, vv.height - size);

            const rawLeft = (vv.offsetLeft || 0) + (fracX * newAvailW);
            const rawTop = (vv.offsetTop || 0) + (fracY * newAvailH);

            const minLeft = (vv.offsetLeft || 0);
            const minTop = (vv.offsetTop || 0);
            const maxLeft = (vv.offsetLeft || 0) + vv.width - size;
            const maxTop = (vv.offsetTop || 0) + vv.height - size;

            const newLeft = Math.max(minLeft, Math.min(rawLeft, maxLeft));
            const newTop = Math.max(minTop, Math.min(rawTop, maxTop));

            this.elements.container.style.left = `${newLeft}px`;
            this.elements.container.style.top = `${newTop}px`;
            this.elements.container.style.right = 'auto';
            this.elements.container.style.bottom = 'auto';

            this._savePosition();
        }

        _clampToViewport() {
            const pos = this._getCurrentLeftTop();
            const size = this.configManager.get('bubbleSize');

            const vp = this._getViewportBounds();
            const minLeft = vp.left;
            const minTop = vp.top;
            const maxLeft = vp.left + vp.width - size;
            const maxTop = vp.top + vp.height - size;

            const newLeft = Math.max(minLeft, Math.min(pos.left, maxLeft));
            const newTop = Math.max(minTop, Math.min(pos.top, maxTop));

            this.elements.container.style.left = `${newLeft}px`;
            this.elements.container.style.top = `${newTop}px`;
            this.elements.container.style.right = 'auto';
            this.elements.container.style.bottom = 'auto';

            this._savePosition();

            if (this._hasOpenSidebarWindow()) {
                this._updateSidebarResizeHandlePlacement();
            }
        }

        _resetSettings() {
            if (confirm('Reset all settings to defaults? Your favorites will be preserved.')) {
                const favorites = this.configManager.get('favorites');
                this.configManager.reset();
                this.configManager.set('favorites', favorites);

                // Reload page to apply changes
                location.reload();
            }
        }
    }

    // // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new AIFloatingBubble());
    } else {
        new AIFloatingBubble();
    }
})();
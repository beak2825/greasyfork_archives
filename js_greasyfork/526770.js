// ==UserScript==
// @name         Site Filter (Protocol-Independent) with Dynamic Options
// @namespace    http://tampermonkey.net/
// @version      5.2
// @description  Manage allowed sites dynamically with schema-based options, pattern specificity analysis, conflict detection, and precedence-based matching. Including scripts can define their own options without modifying this library.
// @author       blvdmd
// @match        *://*/*
// @noframes
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

     // Exit if the script is running in an iframe or embedded context
     if (window.self !== window.top) {
        return; // Stop execution for embedded pages
    }

    const USE_EMOJI_FOR_STATUS = true; // Configurable flag to use emoji for true/false status
    const SHOW_STATUS_ONLY_IF_TRUE = true; // Configurable flag to show status only if any value is true

    // ====== SCHEMA PARSING AND VALIDATION ENGINE ======
    // Supports: boolean, number, string, select, array
    const SchemaEngine = {
        // Supported types with their validators and default values
        typeDefinitions: {
            boolean: {
                validate: (value) => typeof value === 'boolean',
                coerce: (value) => Boolean(value),
                defaultValue: false
            },
            number: {
                validate: (value, def) => {
                    if (typeof value !== 'number' || isNaN(value)) return false;
                    if (def.min !== undefined && value < def.min) return false;
                    if (def.max !== undefined && value > def.max) return false;
                    if (def.step !== undefined) {
                        const remainder = (value - (def.min || 0)) % def.step;
                        if (Math.abs(remainder) > 0.0001 && Math.abs(remainder - def.step) > 0.0001) return false;
                    }
                    return true;
                },
                coerce: (value, def) => {
                    let num = Number(value);
                    if (isNaN(num)) num = def.default ?? 0;
                    if (def.min !== undefined) num = Math.max(def.min, num);
                    if (def.max !== undefined) num = Math.min(def.max, num);
                    return num;
                },
                defaultValue: 0
            },
            string: {
                validate: (value, def) => {
                    if (typeof value !== 'string') return false;
                    if (def.minLength !== undefined && value.length < def.minLength) return false;
                    if (def.maxLength !== undefined && value.length > def.maxLength) return false;
                    if (def.pattern !== undefined && !new RegExp(def.pattern).test(value)) return false;
                    return true;
                },
                coerce: (value) => String(value ?? ''),
                defaultValue: ''
            },
            select: {
                validate: (value, def) => {
                    if (!Array.isArray(def.options)) return false;
                    // Options can be strings or { value, label } objects
                    const validValues = def.options.map(opt => 
                        typeof opt === 'object' ? opt.value : opt
                    );
                    return validValues.includes(value);
                },
                coerce: (value, def) => {
                    const validValues = def.options.map(opt => 
                        typeof opt === 'object' ? opt.value : opt
                    );
                    return validValues.includes(value) ? value : (def.default ?? validValues[0]);
                },
                defaultValue: null
            },
            array: {
                validate: (value, def) => {
                    if (!Array.isArray(value)) return false;
                    if (def.minItems !== undefined && value.length < def.minItems) return false;
                    if (def.maxItems !== undefined && value.length > def.maxItems) return false;
                    // Validate each item type if itemType specified
                    if (def.itemType && SchemaEngine.typeDefinitions[def.itemType]) {
                        const itemValidator = SchemaEngine.typeDefinitions[def.itemType];
                        return value.every(item => itemValidator.validate(item, def.itemDef || {}));
                    }
                    return true;
                },
                coerce: (value, def) => {
                    if (!Array.isArray(value)) return def.default ?? [];
                    if (def.itemType && SchemaEngine.typeDefinitions[def.itemType]) {
                        const itemCoercer = SchemaEngine.typeDefinitions[def.itemType];
                        return value.map(item => itemCoercer.coerce(item, def.itemDef || {}));
                    }
                    return value;
                },
                defaultValue: []
            }
        },

        // Parse and validate a schema definition
        parseSchema(schemaDefinition) {
            if (!schemaDefinition || typeof schemaDefinition !== 'object') {
                return { definitions: {}, groups: {} };
            }

            const definitions = schemaDefinition.definitions || schemaDefinition;
            const groups = schemaDefinition.groups || {};
            const parsedDefinitions = {};

            for (const [key, def] of Object.entries(definitions)) {
                // Skip groups key if present at top level
                if (key === 'groups') continue;

                const type = def.type || 'boolean';
                const typeDef = this.typeDefinitions[type];

                if (!typeDef) {
                    console.warn(`[DynamicSites] Unknown type "${type}" for option "${key}", defaulting to boolean`);
                    parsedDefinitions[key] = {
                        ...def,
                        type: 'boolean',
                        default: def.default ?? false,
                        label: def.label || this.generateLabel(key),
                        _validated: true
                    };
                    continue;
                }

                parsedDefinitions[key] = {
                    ...def,
                    type,
                    default: def.default ?? typeDef.defaultValue,
                    label: def.label || this.generateLabel(key),
                    _validated: true
                };
            }

            return { definitions: parsedDefinitions, groups };
        },

        // Generate human-readable label from camelCase key
        generateLabel(key) {
            return key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, str => str.toUpperCase())
                .trim();
        },

        // Validate a single option value against its definition
        validateOption(definition, value) {
            const typeDef = this.typeDefinitions[definition.type];
            if (!typeDef) return { valid: false, error: `Unknown type: ${definition.type}` };

            if (typeDef.validate(value, definition)) {
                return { valid: true, value };
            }

            // Try coercion
            try {
                const coerced = typeDef.coerce(value, definition);
                if (typeDef.validate(coerced, definition)) {
                    return { valid: true, value: coerced, coerced: true };
                }
            } catch (e) {
                // Coercion failed
            }

            return { valid: false, error: `Invalid value for type ${definition.type}`, value: definition.default };
        },

        // Get default values for all options in a schema
        getDefaults(schema) {
            const defaults = {};
            for (const [key, def] of Object.entries(schema.definitions)) {
                defaults[key] = def.default;
            }
            return defaults;
        }
    };

    // ====== LEGACY OPTIONS BACKWARDS COMPATIBILITY ======
    const LEGACY_OPTIONS = [
        'preProcessingRequired',
        'postProcessingRequired',
        'onDemandFloatingButtonRequired',
        'backgroundChangeObserverRequired'
    ];

    const LegacyCompatibility = {
        // Create a schema from legacy hardcoded options
        createLegacySchema() {
            const definitions = {};
            const labelMap = {
                preProcessingRequired: 'Pre-Processing Required',
                postProcessingRequired: 'Post-Processing Required',
                onDemandFloatingButtonRequired: 'On-demand Floating Button Required',
                backgroundChangeObserverRequired: 'Background Change Observer Required'
            };

            LEGACY_OPTIONS.forEach(opt => {
                definitions[opt] = {
                    type: 'boolean',
                    default: false,
                    label: labelMap[opt] || SchemaEngine.generateLabel(opt),
                    description: `Legacy option: ${labelMap[opt]}`,
                    group: 'Legacy Options',
                    _legacy: true
                };
            });

            return { 
                definitions, 
                groups: { 
                    'Legacy Options': { order: 0, collapsed: false } 
                } 
            };
        },

        // Merge legacy schema with custom schema
        mergeWithCustomSchema(customSchema) {
            const legacySchema = this.createLegacySchema();
            
            return {
                definitions: {
                    ...legacySchema.definitions,
                    ...(customSchema.definitions || {})
                },
                groups: {
                    ...legacySchema.groups,
                    ...(customSchema.groups || {})
                }
            };
        },

        // Check if entry uses only legacy options
        isLegacyEntry(entry) {
            const entryKeys = Object.keys(entry).filter(k => k !== 'pattern');
            return entryKeys.every(k => LEGACY_OPTIONS.includes(k) || k.startsWith('_'));
        }
    };

    // ====== PATTERN SPECIFICITY ANALYZER ======
    // Provides intelligent pattern analysis for conflict detection and precedence
    const PatternAnalyzer = {
        // Cache for specificity scores to avoid recalculation
        specificityCache: new Map(),
        
        // Constants for validation
        MAX_PATTERN_LENGTH: 500,
        MIN_PATTERN_LENGTH: 1,

        /**
         * Validate a pattern for correctness
         * @returns {{ valid: boolean, error?: string }}
         */
        validatePattern(pattern) {
            // Check for null/undefined
            if (pattern == null) {
                return { valid: false, error: 'Pattern cannot be empty' };
            }

            // Convert to string if needed
            const patternStr = String(pattern).trim();

            // Check length bounds
            if (patternStr.length < this.MIN_PATTERN_LENGTH) {
                return { valid: false, error: 'Pattern cannot be empty' };
            }
            if (patternStr.length > this.MAX_PATTERN_LENGTH) {
                return { valid: false, error: `Pattern too long (max ${this.MAX_PATTERN_LENGTH} characters)` };
            }

            // Check for invalid characters that could break regex
            // Allow: alphanumeric, ., -, _, /, ?, =, &, #, *, :, @, %, +, ~
            const invalidChars = patternStr.match(/[^\w.\-_/?=&#*:@%+~]/g);
            if (invalidChars) {
                const uniqueInvalid = [...new Set(invalidChars)].slice(0, 3).join(', ');
                return { valid: false, error: `Invalid characters in pattern: ${uniqueInvalid}` };
            }

            // Check for potentially problematic patterns
            if (patternStr === '*') {
                return { valid: false, error: 'Pattern too broad - would match everything' };
            }

            // Verify the pattern can be compiled to regex
            try {
                this.patternToRegex(patternStr);
            } catch (e) {
                return { valid: false, error: 'Invalid pattern format' };
            }

            return { valid: true };
        },

        /**
         * Calculate specificity score for a pattern
         * Higher score = more specific pattern
         * 
         * Scoring factors:
         * - Fewer wildcards = higher score (each wildcard subtracts 20 points)
         * - Longer non-wildcard segments = higher score
         * - Exact match (no wildcards) = bonus 50 points
         * - More path segments = higher score
         */
        calculateSpecificity(pattern) {
            // Handle edge cases
            if (!pattern || typeof pattern !== 'string') {
                return 0;
            }

            // Check cache first
            if (this.specificityCache.has(pattern)) {
                return this.specificityCache.get(pattern);
            }

            let score = 100; // Base score

            // Count wildcards (each wildcard reduces specificity)
            const wildcardCount = (pattern.match(/\*/g) || []).length;
            score -= wildcardCount * 20;

            // Bonus for exact match (no wildcards)
            if (wildcardCount === 0) {
                score += 50;
            }

            // Length of non-wildcard portions (longer = more specific)
            // Cap at 200 chars to prevent score inflation with very long patterns
            const nonWildcardLength = Math.min(pattern.replace(/\*/g, '').length, 200);
            score += nonWildcardLength / 5;

            // Count path segments (more segments = more specific path)
            const pathSegments = pattern.split('/').filter(s => s && s !== '*').length;
            score += pathSegments * 5;

            // Bonus for query parameters (very specific)
            if (pattern.includes('?')) {
                score += 15;
            }

            // Bonus for having a file extension
            if (/\.\w{2,4}($|\?)/.test(pattern)) {
                score += 10;
            }

            // Cache the result
            this.specificityCache.set(pattern, score);
            return score;
        },

        /**
         * Convert a wildcard pattern to regex for testing
         * Includes error handling for malformed patterns
         */
        patternToRegex(pattern) {
            try {
                const escaped = pattern
                    .replace(/[-[\]{}()+^$|#\s]/g, '\\$&')
                    .replace(/\./g, '\\.')
                    .replace(/\?/g, '\\?')
                    .replace(/\*/g, '.*');
                return new RegExp("^" + escaped + "$");
            } catch (e) {
                console.warn('[DynamicSites] Failed to compile pattern to regex:', pattern, e);
                // Return a regex that matches nothing as a safe fallback
                return /(?!)/;
            }
        },

        /**
         * Check if patternA is a subset of patternB
         * Returns true if B covers everything A would match (B is wider than A)
         * 
         * Example: 
         * - isSubsetOf("abc.com/search*", "abc.com/*") → true (abc.com/* is wider)
         * - isSubsetOf("abc.com/*", "abc.com/search*") → false
         */
        isSubsetOf(patternA, patternB) {
            // Identical patterns are not subsets of each other
            if (patternA === patternB) return false;

            // If A has no wildcards and B has wildcards, A might be subset of B
            // If B has no wildcards, B can only match exactly one URL, so A can't be a subset
            // unless A === B (which we already checked)
            const wildcardCountA = (patternA.match(/\*/g) || []).length;
            const wildcardCountB = (patternB.match(/\*/g) || []).length;

            if (wildcardCountB === 0) {
                // B is exact, can only match one URL
                return false;
            }

            // Generate test cases from pattern A and check if B matches them all
            const testCases = this.generateTestCases(patternA);
            const regexB = this.patternToRegex(patternB);

            // If B matches all test cases from A, then A is a subset of B
            const allMatch = testCases.every(testCase => regexB.test(testCase));
            
            if (!allMatch) return false;

            // Additional check: B should be "wider" (match more things)
            // This is determined by B having fewer wildcards in different positions
            // or wildcards in more general positions
            return this.calculateSpecificity(patternB) < this.calculateSpecificity(patternA);
        },

        /**
         * Generate test URL cases that a pattern would match
         * Used for subset detection
         * Optimized to use minimal test cases while still being effective
         */
        generateTestCases(pattern) {
            // Early exit for patterns without wildcards
            if (!pattern.includes('*')) {
                return [pattern];
            }

            // Use a small, efficient set of test strings
            // These are chosen to test different scenarios:
            // - 'x' : minimal single character
            // - 'test/path' : path with subdirectory
            const cases = [
                pattern.replace(/\*/g, 'x'),           // Minimal replacement
                pattern.replace(/\*/g, 'test/path'),   // Path with subdirectory
                pattern.replace(/\*/g, '')             // Empty replacement
            ];

            return cases;
        },

        /**
         * Find all conflicting patterns for a given pattern
         * Returns { wider: [...patterns that cover this one], narrower: [...patterns this one covers] }
         */
        findConflicts(pattern, allPatterns, excludePattern = null) {
            const conflicts = {
                wider: [],    // Patterns that are wider (less specific) and cover this pattern
                narrower: []  // Patterns that are narrower (more specific) and this pattern covers
            };

            for (const existingPattern of allPatterns) {
                // Skip self-comparison
                if (existingPattern === pattern) continue;
                if (excludePattern && existingPattern === excludePattern) continue;

                // Check if the new pattern is a subset of existing (existing is wider)
                if (this.isSubsetOf(pattern, existingPattern)) {
                    conflicts.wider.push(existingPattern);
                }
                
                // Check if existing pattern is a subset of new (new is wider)
                if (this.isSubsetOf(existingPattern, pattern)) {
                    conflicts.narrower.push(existingPattern);
                }
            }

            // Sort by specificity
            conflicts.wider.sort((a, b) => this.calculateSpecificity(b) - this.calculateSpecificity(a));
            conflicts.narrower.sort((a, b) => this.calculateSpecificity(b) - this.calculateSpecificity(a));

            return conflicts;
        },

        /**
         * Determine match type for sorting purposes
         * Returns: 'exact' | 'specific' | 'generic' | 'related' | 'none'
         * @param {string} pattern - The pattern to check
         * @param {string} currentUrl - The current URL
         * @param {string[]} allMatchingPatterns - All patterns that match current URL
         * @param {boolean} [isMatch] - Optional: pre-computed match result to avoid re-testing
         */
        getMatchType(pattern, currentUrl, allMatchingPatterns, isMatch = null) {
            // Use pre-computed match result if provided, otherwise test
            const doesMatch = isMatch !== null ? isMatch : this.patternToRegex(pattern).test(currentUrl);
            
            if (!doesMatch) {
                // Doesn't match current URL, but might be related
                // Check if it shares the same domain
                const patternDomain = this.extractDomain(pattern);
                const urlDomain = this.extractDomain(currentUrl);
                if (patternDomain && urlDomain && 
                    (patternDomain.includes(urlDomain) || urlDomain.includes(patternDomain))) {
                    return 'related';
                }
                return 'none';
            }

            // It matches - determine if it's the most specific, least specific, or in between
            if (!allMatchingPatterns || allMatchingPatterns.length <= 1) {
                return 'exact';
            }

            const mySpecificity = this.calculateSpecificity(pattern);
            const specificities = allMatchingPatterns.map(p => this.calculateSpecificity(p));
            const maxSpecificity = Math.max(...specificities);
            const minSpecificity = Math.min(...specificities);

            if (mySpecificity === maxSpecificity) {
                return 'specific';  // Most specific match
            } else if (mySpecificity === minSpecificity) {
                return 'generic';   // Least specific (widest) match
            } else {
                return 'specific';  // In between, but still specific relative to others
            }
        },

        /**
         * Extract domain from a pattern or URL
         */
        extractDomain(patternOrUrl) {
            // Remove protocol if present
            let cleaned = patternOrUrl.replace(/^https?:\/\//, '');
            // Remove wildcards at start
            cleaned = cleaned.replace(/^\*+\.?/, '');
            // Get domain part
            const match = cleaned.match(/^([^/*?]+)/);
            return match ? match[1].replace(/^\*+/, '').replace(/\*+$/, '') : '';
        },

        /**
         * Clear the specificity cache (call when patterns change)
         */
        clearCache() {
            this.specificityCache.clear();
        }
    };

    // ====== MEMORY-SAFE STORAGE SYSTEM ======
    // Using WeakMap for script-specific data to prevent memory leaks
    const ScriptRegistry = {
        // Store parsed schemas per script (keyed by SCRIPT_STORAGE_KEY)
        schemas: new Map(),
        
        // Store option proxies per script (for garbage collection tracking)
        proxies: new WeakMap(),
        
        // Store cleanup handlers
        cleanupHandlers: new Set(),

        register(storageKey, schema) {
            const parsed = SchemaEngine.parseSchema(schema);
            this.schemas.set(storageKey, parsed);
            return parsed;
        },

        getSchema(storageKey) {
            return this.schemas.get(storageKey);
        },

        addCleanupHandler(handler) {
            this.cleanupHandlers.add(handler);
        },

        cleanup() {
            this.cleanupHandlers.forEach(handler => {
                try { handler(); } catch (e) { console.error('[DynamicSites] Cleanup error:', e); }
            });
            this.cleanupHandlers.clear();
            this.schemas.clear();
        }
    };

    // Register cleanup on page unload
    window.addEventListener('unload', () => {
        ScriptRegistry.cleanup();
    }, { once: true });

    // ====== PROXY-BASED OPTION ACCESS ======
    const OptionProxy = {
        // Create a proxy for accessing options on a pattern entry
        createForEntry(storageKey, schema, entry, persistCallback) {
            const definitions = schema.definitions || {};
            
            return new Proxy(entry, {
                get(target, prop) {
                    // Special properties
                    if (prop === 'pattern') return target.pattern;
                    if (prop === '_schema') return schema;
                    if (prop === '_toJSON' || prop === 'toJSON') {
                        return () => {
                            const result = { pattern: target.pattern };
                            for (const key of Object.keys(definitions)) {
                                if (target[key] !== undefined) {
                                    result[key] = target[key];
                                }
                            }
                            return result;
                        };
                    }
                    
                    // Option access
                    if (prop in definitions) {
                        return target[prop] ?? definitions[prop].default;
                    }
                    
                    // Legacy fallback
                    if (LEGACY_OPTIONS.includes(prop)) {
                        return target[prop] ?? false;
                    }
                    
                    return target[prop];
                },
                
                set(target, prop, value) {
                    if (prop === 'pattern') {
                        target.pattern = value;
                        if (persistCallback) persistCallback();
                        return true;
                    }
                    
                    if (prop in definitions) {
                        const validation = SchemaEngine.validateOption(definitions[prop], value);
                        if (validation.valid) {
                            target[prop] = validation.value;
                            if (persistCallback) persistCallback();
                            return true;
                        }
                        console.warn(`[DynamicSites] Invalid value for ${prop}:`, validation.error);
                        return false;
                    }
                    
                    // Allow setting legacy options
                    if (LEGACY_OPTIONS.includes(prop)) {
                        target[prop] = Boolean(value);
                        if (persistCallback) persistCallback();
                        return true;
                    }
                    
                    target[prop] = value;
                    return true;
                },
                
                has(target, prop) {
                    return prop in definitions || prop in target || LEGACY_OPTIONS.includes(prop);
                },
                
                ownKeys(target) {
                    return [...new Set([...Object.keys(target), ...Object.keys(definitions)])];
                },
                
                getOwnPropertyDescriptor(target, prop) {
                    if (prop in definitions || prop in target) {
                        return {
                            enumerable: true,
                            configurable: true,
                            value: this.get(target, prop)
                        };
                    }
                    return undefined;
                }
            });
        }
    };

    // ====== UI GENERATION ENGINE ======
    const UIGenerator = {
        // Base styles for VNC-friendly, accessible UI
        baseStyles: {
            input: `
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 14px;
                font-family: inherit;
                margin: 5px 0;
                box-sizing: border-box;
                transition: border-color 0.2s;
                min-height: 44px;
            `,
            label: `
                display: block;
                margin-bottom: 4px;
                font-weight: 600;
                color: #374151;
                font-size: 14px;
            `,
            description: `
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 8px;
            `,
            group: `
                margin-bottom: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                overflow: hidden;
            `,
            groupHeader: `
                background: #f9fafb;
                padding: 12px 16px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: 600;
                color: #374151;
                user-select: none;
                min-height: 44px;
            `,
            groupContent: `
                padding: 16px;
                background: white;
            `,
            checkbox: `
                width: 24px;
                height: 24px;
                margin-right: 12px;
                cursor: pointer;
                accent-color: #667eea;
            `,
            checkboxContainer: `
                display: flex;
                align-items: center;
                padding: 12px;
                margin: 4px 0;
                border-radius: 6px;
                cursor: pointer;
                user-select: none;
                min-height: 44px;
                transition: background 0.2s;
            `
        },

        // Create a control for a specific option type
        createControl(key, definition, currentValue, onChange) {
            const container = document.createElement('div');
            container.style.cssText = 'margin-bottom: 16px;';
            container.setAttribute('data-option-key', key);

            switch (definition.type) {
                case 'boolean':
                    return this.createBooleanControl(key, definition, currentValue, onChange);
                case 'number':
                    return this.createNumberControl(key, definition, currentValue, onChange);
                case 'string':
                    return this.createStringControl(key, definition, currentValue, onChange);
                case 'select':
                    return this.createSelectControl(key, definition, currentValue, onChange);
                case 'array':
                    return this.createArrayControl(key, definition, currentValue, onChange);
                default:
                    // Fallback to string
                    return this.createStringControl(key, definition, currentValue, onChange);
            }
        },

        createBooleanControl(key, definition, currentValue, onChange) {
            const container = document.createElement('label');
            container.style.cssText = this.baseStyles.checkboxContainer;
            container.onmouseenter = () => container.style.background = '#f3f4f6';
            container.onmouseleave = () => container.style.background = 'transparent';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = currentValue ?? definition.default ?? false;
            checkbox.style.cssText = this.baseStyles.checkbox;
            checkbox.onchange = () => onChange(checkbox.checked);

            const textContainer = document.createElement('div');
            textContainer.style.cssText = 'flex: 1;';

            const label = document.createElement('span');
            label.textContent = definition.label;
            label.style.cssText = 'font-size: 14px; font-weight: 500; color: #1f2937;';

            textContainer.appendChild(label);

            if (definition.description) {
                const desc = document.createElement('div');
                desc.textContent = definition.description;
                desc.style.cssText = 'font-size: 12px; color: #6b7280; margin-top: 2px;';
                textContainer.appendChild(desc);
            }

            container.appendChild(checkbox);
            container.appendChild(textContainer);
            container.setAttribute('data-option-key', key);

            return container;
        },

        createNumberControl(key, definition, currentValue, onChange) {
            const container = document.createElement('div');
            container.style.cssText = 'margin-bottom: 16px;';
            container.setAttribute('data-option-key', key);

            const label = document.createElement('label');
            label.textContent = definition.label;
            label.style.cssText = this.baseStyles.label;
            container.appendChild(label);

            if (definition.description) {
                const desc = document.createElement('div');
                desc.textContent = definition.description;
                desc.style.cssText = this.baseStyles.description;
                container.appendChild(desc);
            }

            const inputContainer = document.createElement('div');
            inputContainer.style.cssText = 'display: flex; align-items: center; gap: 10px;';

            const input = document.createElement('input');
            input.type = 'number';
            input.value = currentValue ?? definition.default ?? 0;
            input.style.cssText = this.baseStyles.input + 'flex: 1;';
            
            if (definition.min !== undefined) input.min = definition.min;
            if (definition.max !== undefined) input.max = definition.max;
            if (definition.step !== undefined) input.step = definition.step;

            input.onchange = () => {
                const validation = SchemaEngine.validateOption(definition, Number(input.value));
                if (validation.valid) {
                    input.value = validation.value;
                    onChange(validation.value);
                    input.style.borderColor = '#10b981';
                } else {
                    input.style.borderColor = '#ef4444';
                }
            };
            input.onfocus = () => input.style.borderColor = '#667eea';
            input.onblur = () => input.style.borderColor = '#e0e0e0';

            inputContainer.appendChild(input);

            // Show range info if available
            if (definition.min !== undefined || definition.max !== undefined) {
                const rangeInfo = document.createElement('span');
                rangeInfo.style.cssText = 'font-size: 12px; color: #9ca3af; white-space: nowrap;';
                const min = definition.min !== undefined ? definition.min : '-∞';
                const max = definition.max !== undefined ? definition.max : '∞';
                rangeInfo.textContent = `[${min} - ${max}]`;
                inputContainer.appendChild(rangeInfo);
            }

            container.appendChild(inputContainer);
            return container;
        },

        createStringControl(key, definition, currentValue, onChange) {
            const container = document.createElement('div');
            container.style.cssText = 'margin-bottom: 16px;';
            container.setAttribute('data-option-key', key);

            const label = document.createElement('label');
            label.textContent = definition.label;
            label.style.cssText = this.baseStyles.label;
            container.appendChild(label);

            if (definition.description) {
                const desc = document.createElement('div');
                desc.textContent = definition.description;
                desc.style.cssText = this.baseStyles.description;
                container.appendChild(desc);
            }

            const input = document.createElement(definition.multiline ? 'textarea' : 'input');
            if (!definition.multiline) input.type = 'text';
            input.value = currentValue ?? definition.default ?? '';
            input.placeholder = definition.placeholder || '';
            input.style.cssText = this.baseStyles.input;
            if (definition.multiline) {
                input.style.minHeight = '100px';
                input.style.resize = 'vertical';
            }

            if (definition.maxLength) input.maxLength = definition.maxLength;

            input.onchange = () => {
                const validation = SchemaEngine.validateOption(definition, input.value);
                if (validation.valid) {
                    onChange(validation.value);
                    input.style.borderColor = '#10b981';
                } else {
                    input.style.borderColor = '#ef4444';
                }
            };
            input.onfocus = () => input.style.borderColor = '#667eea';
            input.onblur = () => input.style.borderColor = '#e0e0e0';

            container.appendChild(input);
            return container;
        },

        createSelectControl(key, definition, currentValue, onChange) {
            const container = document.createElement('div');
            container.style.cssText = 'margin-bottom: 16px;';
            container.setAttribute('data-option-key', key);

            const label = document.createElement('label');
            label.textContent = definition.label;
            label.style.cssText = this.baseStyles.label;
            container.appendChild(label);

            if (definition.description) {
                const desc = document.createElement('div');
                desc.textContent = definition.description;
                desc.style.cssText = this.baseStyles.description;
                container.appendChild(desc);
            }

            const select = document.createElement('select');
            select.style.cssText = this.baseStyles.input + 'cursor: pointer;';

            (definition.options || []).forEach(opt => {
                const option = document.createElement('option');
                if (typeof opt === 'object') {
                    option.value = opt.value;
                    option.textContent = opt.label || opt.value;
                } else {
                    option.value = opt;
                    option.textContent = opt;
                }
                if ((currentValue ?? definition.default) === option.value) {
                    option.selected = true;
                }
                select.appendChild(option);
            });

            select.onchange = () => onChange(select.value);
            select.onfocus = () => select.style.borderColor = '#667eea';
            select.onblur = () => select.style.borderColor = '#e0e0e0';

            container.appendChild(select);
            return container;
        },

        createArrayControl(key, definition, currentValue, onChange) {
            const container = document.createElement('div');
            container.style.cssText = 'margin-bottom: 16px;';
            container.setAttribute('data-option-key', key);

            const label = document.createElement('label');
            label.textContent = definition.label;
            label.style.cssText = this.baseStyles.label;
            container.appendChild(label);

            if (definition.description) {
                const desc = document.createElement('div');
                desc.textContent = definition.description;
                desc.style.cssText = this.baseStyles.description;
                container.appendChild(desc);
            }

            const currentArray = Array.isArray(currentValue) ? [...currentValue] : (definition.default || []);
            
            const listContainer = document.createElement('div');
            listContainer.style.cssText = 'border: 1px solid #e0e0e0; border-radius: 6px; overflow: hidden;';

            const itemsContainer = document.createElement('div');
            itemsContainer.style.cssText = 'max-height: 200px; overflow-y: auto;';

            const renderItems = () => {
                itemsContainer.innerHTML = '';
                currentArray.forEach((item, index) => {
                    const itemRow = document.createElement('div');
                    itemRow.style.cssText = `
                        display: flex;
                        align-items: center;
                        padding: 8px 12px;
                        border-bottom: 1px solid #f0f0f0;
                        gap: 8px;
                    `;

                    const itemText = document.createElement('span');
                    itemText.textContent = String(item);
                    itemText.style.cssText = 'flex: 1; font-size: 14px; word-break: break-all;';

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = '✕';
                    deleteBtn.style.cssText = `
                        background: #fee2e2;
                        border: none;
                        color: #991b1b;
                        width: 28px;
                        height: 28px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    `;
                    deleteBtn.onclick = () => {
                        currentArray.splice(index, 1);
                        onChange([...currentArray]);
                        renderItems();
                    };

                    itemRow.appendChild(itemText);
                    itemRow.appendChild(deleteBtn);
                    itemsContainer.appendChild(itemRow);
                });

                if (currentArray.length === 0) {
                    const emptyMsg = document.createElement('div');
                    emptyMsg.textContent = 'No items';
                    emptyMsg.style.cssText = 'padding: 16px; text-align: center; color: #9ca3af; font-size: 13px;';
                    itemsContainer.appendChild(emptyMsg);
                }
            };

            renderItems();
            listContainer.appendChild(itemsContainer);

            // Add new item input
            const addContainer = document.createElement('div');
            addContainer.style.cssText = 'display: flex; gap: 8px; padding: 8px; background: #f9fafb; border-top: 1px solid #e0e0e0;';

            const addInput = document.createElement('input');
            addInput.type = 'text';
            addInput.placeholder = 'Add new item...';
            addInput.style.cssText = 'flex: 1; padding: 8px; border: 1px solid #e0e0e0; border-radius: 4px; font-size: 14px;';

            const addBtn = document.createElement('button');
            addBtn.textContent = '+ Add';
            addBtn.style.cssText = `
                background: #667eea;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                min-height: 36px;
            `;
            addBtn.onclick = () => {
                const value = addInput.value.trim();
                if (value) {
                    // Check max items
                    if (definition.maxItems !== undefined && currentArray.length >= definition.maxItems) {
                        alert(`Maximum ${definition.maxItems} items allowed`);
                        return;
                    }
                    currentArray.push(value);
                    onChange([...currentArray]);
                    addInput.value = '';
                    renderItems();
                }
            };

            addInput.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addBtn.click();
                }
            };

            addContainer.appendChild(addInput);
            addContainer.appendChild(addBtn);
            listContainer.appendChild(addContainer);

            container.appendChild(listContainer);
            return container;
        },

        // Create a collapsible group section
        createCollapsibleGroup(groupName, groupConfig, optionControls) {
            const group = document.createElement('div');
            group.style.cssText = this.baseStyles.group;
            group.setAttribute('data-group', groupName);

            const header = document.createElement('div');
            header.style.cssText = this.baseStyles.groupHeader;
            
            const title = document.createElement('span');
            title.textContent = groupName;
            
            const arrow = document.createElement('span');
            arrow.textContent = groupConfig?.collapsed ? '▶' : '▼';
            arrow.style.cssText = 'transition: transform 0.2s;';
            
            header.appendChild(title);
            header.appendChild(arrow);

            const content = document.createElement('div');
            content.style.cssText = this.baseStyles.groupContent;
            content.style.display = groupConfig?.collapsed ? 'none' : 'block';

            optionControls.forEach(control => content.appendChild(control));

            header.onclick = () => {
                const isCollapsed = content.style.display === 'none';
                content.style.display = isCollapsed ? 'block' : 'none';
                arrow.textContent = isCollapsed ? '▼' : '▶';
            };

            group.appendChild(header);
            group.appendChild(content);
            return group;
        },

        // Generate full options UI from schema
        generateOptionsUI(schema, currentValues, onChange) {
            const container = document.createElement('div');
            const definitions = schema.definitions || {};
            const groups = schema.groups || {};

            // Group options by their group property
            const groupedOptions = {};
            const ungrouped = [];

            for (const [key, def] of Object.entries(definitions)) {
                if (def.group) {
                    if (!groupedOptions[def.group]) {
                        groupedOptions[def.group] = [];
                    }
                    groupedOptions[def.group].push({ key, def });
                } else {
                    ungrouped.push({ key, def });
                }
            }

            // Sort groups by order
            const sortedGroups = Object.entries(groupedOptions).sort((a, b) => {
                const orderA = groups[a[0]]?.order ?? 999;
                const orderB = groups[b[0]]?.order ?? 999;
                return orderA - orderB;
            });

            // Render ungrouped options first
            if (ungrouped.length > 0) {
                ungrouped.forEach(({ key, def }) => {
                    const control = this.createControl(key, def, currentValues[key], (value) => {
                        currentValues[key] = value;
                        onChange(key, value);
                    });
                    container.appendChild(control);
                });
            }

            // Render grouped options
            sortedGroups.forEach(([groupName, options]) => {
                const controls = options.map(({ key, def }) => 
                    this.createControl(key, def, currentValues[key], (value) => {
                        currentValues[key] = value;
                        onChange(key, value);
                    })
                );
                const groupEl = this.createCollapsibleGroup(groupName, groups[groupName], controls);
                container.appendChild(groupEl);
            });

            return container;
        }
    };

    // ====== Wait for `SCRIPT_STORAGE_KEY` to be set ======
    function waitForScriptStorageKey(maxWait = 1000) {
        return new Promise(resolve => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                if (typeof window.SCRIPT_STORAGE_KEY !== 'undefined') {
                    clearInterval(interval);
                    resolve(window.SCRIPT_STORAGE_KEY);
                } else if (Date.now() - startTime > maxWait) {
                    clearInterval(interval);
                    console.error("🚨 SCRIPT_STORAGE_KEY is not set! Make sure your script sets it **before** @require.");
                    resolve(null);
                }
            }, 50);
        });
    }

    (async function initialize() {
        async function waitForDocumentReady() {
            if (document.readyState === "complete") return;
            return new Promise(resolve => {
                window.addEventListener("load", resolve, { once: true });
            });
        }
        
        // Wait for the script storage key
        const key = await waitForScriptStorageKey();
        if (!key) return;

        // Ensure the document is fully loaded before setting `shouldRunOnThisSite`
        await waitForDocumentReady();

        const STORAGE_KEY = `additionalSites_${key}`;
        const OPTIONS_STORAGE_KEY = `scriptOptions_${key}`;

        // ====== DETECT AND REGISTER SCHEMA ======
        // Check for custom schema from including script
        let customSchema = {};
        if (typeof window.SCRIPT_OPTIONS === 'object' && window.SCRIPT_OPTIONS !== null) {
            customSchema = window.SCRIPT_OPTIONS;
        }

        // Merge with legacy schema for backwards compatibility
        const fullSchema = LegacyCompatibility.mergeWithCustomSchema(customSchema);
        ScriptRegistry.register(key, fullSchema);

        // ====== OPTIMIZATION: CACHES ======
        const regexCache = new Map();           // Cache compiled regexes
        const patternMatchCache = {             // Cache pattern match results
            url: null,
            entry: null
        };
        let currentUrlCache = {                 // Cache current URL
            href: null,
            normalized: null
        };

        function getDefaultList() {
            return typeof window.GET_DEFAULT_LIST === "function" ? window.GET_DEFAULT_LIST() : [];
        }

        function normalizeUrl(url) {
            if (typeof url !== 'string') {
                url = String(url);
            }
            return url.replace(/^https?:\/\//, '');
        }

        // ====== OPTIMIZATION: Cached URL getter ======
        function getCurrentFullPath() {
            const currentHref = window.top.location.href;
            if (currentUrlCache.href !== currentHref) {
                currentUrlCache.href = currentHref;
                currentUrlCache.normalized = normalizeUrl(currentHref);
            }
            return currentUrlCache.normalized;
        }

        let additionalSites = GM_getValue(STORAGE_KEY, []);
        let mergedSites = buildMergedSites();

        // Persist callback for proxy updates
        const persistOptions = () => {
            GM_setValue(STORAGE_KEY, additionalSites.map(site => {
                // Only save non-default values
                const saved = { pattern: site.pattern };
                for (const [optKey, optDef] of Object.entries(fullSchema.definitions)) {
                    if (site[optKey] !== undefined && site[optKey] !== optDef.default) {
                        saved[optKey] = site[optKey];
                    }
                }
                return saved;
            }));
            patternMatchCache.url = null;
            patternMatchCache.entry = null;
        };

        // ====== REFACTORED: Dynamic mergedSites building with schema support ======
        function buildMergedSites() {
            const defaultList = getDefaultList();
            const allSites = [...defaultList, ...additionalSites];
            
            // Deduplicate by pattern
            const seen = new Set();
            const unique = [];
            
            for (const item of allSites) {
                const pattern = typeof item === 'string' ? normalizeUrl(item) : normalizeUrl(item.pattern);
                if (!seen.has(pattern)) {
                    seen.add(pattern);
                    unique.push(item);
                }
            }

            return unique.map(item => {
                if (typeof item === 'string') {
                    // String pattern - apply all defaults from schema
                    const entry = { pattern: normalizeUrl(item) };
                    for (const [optKey, optDef] of Object.entries(fullSchema.definitions)) {
                        entry[optKey] = optDef.default;
                    }
                    return entry;
                }

                // Object pattern - merge with schema defaults
                const entry = { pattern: normalizeUrl(item.pattern) };
                for (const [optKey, optDef] of Object.entries(fullSchema.definitions)) {
                    entry[optKey] = item[optKey] !== undefined ? item[optKey] : optDef.default;
                }
                return entry;
            });
        }

        function refreshMergedSites() {
            mergedSites = buildMergedSites();
            // Clear ALL caches when patterns change
            regexCache.clear();
            patternMatchCache.url = null;
            patternMatchCache.entry = null;
            PatternAnalyzer.clearCache(); // Clear specificity cache to prevent memory leak
            buildPatternIndex();
        }

        // ====== OPTIMIZATION: Pattern Index for faster lookups ======
        const patternIndex = {
            exact: new Map(),
            suffix: new Map(),
            prefix: new Map(),
            wildcard: []
        };

        function buildPatternIndex() {
            patternIndex.exact.clear();
            patternIndex.suffix.clear();
            patternIndex.prefix.clear();
            patternIndex.wildcard = [];

            mergedSites.forEach(item => {
                const p = item.pattern;
                if (!p.includes('*')) {
                    // Exact match
                    patternIndex.exact.set(p, item);
                } else if (p.startsWith('*') && p.indexOf('*', 1) === -1) {
                    // Suffix match: *.example.com
                    patternIndex.suffix.set(p.substring(1), item);
                } else if (p.endsWith('*') && p.indexOf('*') === p.length - 1) {
                    // Prefix match: example.com/*
                    patternIndex.prefix.set(p.substring(0, p.length - 1), item);
                } else {
                    // Complex wildcard
                    patternIndex.wildcard.push(item);
                }
            });
        }

        // Initial index build
        buildPatternIndex();

        // ====== OPTIMIZATION: Cached regex with Map ======
        function wildcardToRegex(pattern) {
            // Check cache first
            if (regexCache.has(pattern)) {
                return regexCache.get(pattern);
            }
            
            // Create and cache regex with error handling
            try {
            const regex = new RegExp("^" + pattern
                    .replace(/[-[\]{}()+^$|#\s]/g, '\\$&')
                    .replace(/\./g, '\\.')
                    .replace(/\?/g, '\\?')
                    .replace(/\*/g, '.*')
                + "$");
            
            regexCache.set(pattern, regex);
            return regex;
            } catch (e) {
                console.warn('[DynamicSites] Failed to compile pattern:', pattern, e);
                // Return a regex that matches nothing as a safe fallback
                const fallback = /(?!)/;
                regexCache.set(pattern, fallback);
                return fallback;
            }
        }

        // ====== PATTERN MATCHING WITH SPECIFICITY-BASED PRECEDENCE ======
        
        /**
         * Find ALL matching entries for the current URL
         * Returns array of matching entries, sorted by specificity (most specific first)
         */
        function findAllMatchingEntries() {
            const currentPath = getCurrentFullPath();
            const allMatches = [];

            // 1. Check exact matches (O(1))
            if (patternIndex.exact.has(currentPath)) {
                allMatches.push(patternIndex.exact.get(currentPath));
            }
            
            // 2. Check suffix matches
                for (const [suffix, item] of patternIndex.suffix) {
                    if (currentPath.endsWith(suffix)) {
                    allMatches.push(item);
                }
            }
            
            // 3. Check prefix matches
                for (const [prefix, item] of patternIndex.prefix) {
                    if (currentPath.startsWith(prefix)) {
                    allMatches.push(item);
                }
            }
            
            // 4. Check wildcard patterns
                for (const item of patternIndex.wildcard) {
                    if (wildcardToRegex(item.pattern).test(currentPath)) {
                    allMatches.push(item);
                }
            }

            // Sort by specificity (highest/most specific first)
            if (allMatches.length > 1) {
                allMatches.sort((a, b) => 
                    PatternAnalyzer.calculateSpecificity(b.pattern) - 
                    PatternAnalyzer.calculateSpecificity(a.pattern)
                );
            }

            return allMatches;
        }

        /**
         * Find the BEST matching entry (most specific one)
         * Uses precedence: more specific patterns override generic ones
         */
        function findMatchingEntry() {
            const currentPath = getCurrentFullPath();
            
            // Return cached result if URL hasn't changed
            if (patternMatchCache.url === currentPath && patternMatchCache.entry !== null) {
                return patternMatchCache.entry;
            }

            const allMatches = findAllMatchingEntries();
            
            // Return the most specific match (first in sorted array) or false if none
            const matchedEntry = allMatches.length > 0 ? allMatches[0] : false;

            // Cache the result
            patternMatchCache.url = currentPath;
            patternMatchCache.entry = matchedEntry;
            
            return matchedEntry;
        }

        async function shouldRunOnThisSite() {
            return !!findMatchingEntry();
        }

        // ====== UTILITY: Count and get all wildcard matches for current site ======
        function countWildcardMatches() {
            return findAllMatchingEntries().length;
        }

        /**
         * Get all matching patterns for the current URL
         * Used for UI display and conflict analysis
         */
        function getAllMatchingPatterns() {
            return findAllMatchingEntries().map(entry => entry.pattern);
        }

        // ====== OPTIMIZATION: Debounce helper with cancel support ======
        function debounce(func, wait) {
            let timeout = null;
            const executedFunction = function(...args) {
                const later = () => {
                    timeout = null;
                    func(...args);
                };
                if (timeout !== null) {
                clearTimeout(timeout);
                }
                timeout = setTimeout(later, wait);
            };
            // Add cancel method to prevent memory leaks
            executedFunction.cancel = function() {
                if (timeout !== null) {
                    clearTimeout(timeout);
                    timeout = null;
                }
            };
            return executedFunction;
        }

        // ====== HTML UI HELPER FUNCTIONS ======
        function createModal(title, content, options = {}) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            `;

            const dialog = document.createElement('div');
            dialog.style.cssText = `
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                max-width: ${options.maxWidth || '600px'};
                width: 90%;
                max-height: 85vh;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            `;

            const header = document.createElement('div');
            header.style.cssText = `
                padding: 20px;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            `;

            const titleEl = document.createElement('h2');
            titleEl.textContent = title;
            titleEl.style.cssText = 'margin: 0; font-size: 20px; font-weight: 600;';

            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '✕';
            closeBtn.style.cssText = `
                background: transparent;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s;
            `;

            // ====== OPTIMIZATION: Event cleanup function ======
            const closeModal = () => {
                // Clean up event listeners
                closeBtn.onmouseover = null;
                closeBtn.onmouseout = null;
                closeBtn.onclick = null;
                modal.onclick = null;
                
                document.body.removeChild(modal);
                if (options.onClose) options.onClose();
            };

            closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            closeBtn.onmouseout = () => closeBtn.style.background = 'transparent';
            closeBtn.onclick = closeModal;

            header.appendChild(titleEl);
            header.appendChild(closeBtn);

            const body = document.createElement('div');
            body.style.cssText = `
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            `;
            if (typeof content === 'string') {
                body.innerHTML = content;
            } else {
                body.appendChild(content);
            }

            dialog.appendChild(header);
            dialog.appendChild(body);
            modal.appendChild(dialog);

            // Close on backdrop click
            modal.onclick = (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            };

            document.body.appendChild(modal);
            return { modal, body, closeBtn, cleanup: closeModal };
        }

        function createButton(text, onClick, style = 'primary') {
            const btn = document.createElement('button');
            btn.textContent = text;
            const baseStyle = `
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
                margin: 5px;
                min-height: 44px;
            `;
            
            const styles = {
                primary: `${baseStyle} background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;`,
                success: `${baseStyle} background: #10b981; color: white;`,
                danger: `${baseStyle} background: #ef4444; color: white;`,
                secondary: `${baseStyle} background: #6b7280; color: white;`,
                outline: `${baseStyle} background: transparent; color: #667eea; border: 2px solid #667eea;`
            };

            btn.style.cssText = styles[style] || styles.primary;
            btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
            btn.onmouseout = () => btn.style.transform = 'scale(1)';
            btn.onclick = onClick;
            return btn;
        }

        function createInput(type, value, placeholder = '') {
            const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
            if (type !== 'textarea') input.type = type;
            input.value = value || '';
            input.placeholder = placeholder;
            input.style.cssText = `
                width: 100%;
                padding: 12px;
                border: 2px solid #e0e0e0;
                border-radius: 6px;
                font-size: 14px;
                font-family: inherit;
                margin: 5px 0;
                box-sizing: border-box;
                transition: border-color 0.2s;
                min-height: 44px;
            `;
            input.onfocus = () => input.style.borderColor = '#667eea';
            input.onblur = () => input.style.borderColor = '#e0e0e0';
            return input;
        }

        function createCheckbox(label, checked = false) {
            const container = document.createElement('label');
            container.style.cssText = `
                display: flex;
                align-items: center;
                margin: 10px 0;
                cursor: pointer;
                user-select: none;
                min-height: 44px;
                padding: 8px;
                border-radius: 6px;
            `;
            container.onmouseenter = () => container.style.background = '#f3f4f6';
            container.onmouseleave = () => container.style.background = 'transparent';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = checked;
            checkbox.style.cssText = `
                width: 24px;
                height: 24px;
                margin-right: 12px;
                cursor: pointer;
                accent-color: #667eea;
            `;

            const labelText = document.createElement('span');
            labelText.textContent = label;
            labelText.style.cssText = 'font-size: 14px;';

            container.appendChild(checkbox);
            container.appendChild(labelText);
            return { container, checkbox };
        }

        // ====== DYNAMIC STATUS FORMATTING ======
        function formatStatus(entry) {
            const statusParts = [];
            
            for (const [optKey, optDef] of Object.entries(fullSchema.definitions)) {
                const value = entry[optKey];
                
                // Skip if showing only true values and this is falsy/default
                if (SHOW_STATUS_ONLY_IF_TRUE && (value === optDef.default || !value)) {
                    continue;
                }
                
                // Format based on type
                let displayValue;
                if (optDef.type === 'boolean') {
                    displayValue = USE_EMOJI_FOR_STATUS ? (value ? '✅' : '✖️') : String(value);
                } else if (optDef.type === 'array') {
                    displayValue = `[${Array.isArray(value) ? value.length : 0}]`;
                } else {
                    displayValue = String(value);
                }
                
                // Use short label if available
                const shortLabel = optDef.shortLabel || optKey.substring(0, 3).toUpperCase();
                statusParts.push(`${shortLabel}: ${displayValue}`);
            }
            
            return statusParts.join(', ');
        }

        // ====== MENU COMMAND 1: Add Current Site ======
        function addCurrentSiteMenu() {
            const matchCount = countWildcardMatches();
            const currentHost = window.top.location.hostname;
            const currentPath = window.top.location.pathname;
            const domainParts = currentHost.split('.');
            const baseDomain = domainParts.length > 2 ? domainParts.slice(-2).join('.') : domainParts.join('.');
            const secondLevelDomain = domainParts.length > 2 ? domainParts.slice(-2, -1)[0] : domainParts[0];
        
            // Reordered: Custom Wildcard Pattern first, then others
            const patternOptions = [
                { name: "Custom Wildcard Pattern", pattern: normalizeUrl(`${window.top.location.href}`) },
                { name: `Preferred Domain Match (*${secondLevelDomain}.*)`, pattern: `*${secondLevelDomain}.*` },
                { name: `Base Hostname (*.${baseDomain}*)`, pattern: `*.${baseDomain}*` },
                { name: `Base Domain (*.${secondLevelDomain}.*)`, pattern: `*.${secondLevelDomain}.*` },
                { name: `Host Contains (*${secondLevelDomain}*)`, pattern: `*${secondLevelDomain}*` },
                { name: `Exact Path (${currentHost}${currentPath})`, pattern: normalizeUrl(`${window.top.location.href}`) }
            ];

            const content = document.createElement('div');
            
            const infoBox = document.createElement('div');
            infoBox.style.cssText = `
                background: #f0f9ff;
                border: 2px solid #0ea5e9;
                border-radius: 8px;
                padding: 15px;
                margin-bottom: 20px;
            `;
            infoBox.innerHTML = `
                <div style="font-weight: 600; color: #0c4a6e; margin-bottom: 5px;">
                    📊 Current Page Wildcard Matches: ${matchCount}
                </div>
                <div style="font-size: 13px; color: #075985;">
                    This page matches ${matchCount} existing rule${matchCount !== 1 ? 's' : ''} in your include list.
                </div>
            `;
            content.appendChild(infoBox);

            const sectionTitle = document.createElement('h3');
            sectionTitle.textContent = 'Pattern to add:';
            sectionTitle.style.cssText = 'margin: 20px 0 10px 0; font-size: 16px; color: #333;';
            content.appendChild(sectionTitle);

            // Custom Wildcard Pattern input (always visible, selected by default)
            const patternInput = createInput('text', normalizeUrl(`${window.top.location.href}`), 'Enter custom wildcard pattern');
            patternInput.style.marginBottom = '12px';
            content.appendChild(patternInput);

            // ====== CONFLICT WARNING BANNER ======
            const conflictWarning = document.createElement('div');
            conflictWarning.style.cssText = `
                display: none;
                background: #fef3c7;
                border: 2px solid #f59e0b;
                border-radius: 8px;
                padding: 12px 15px;
                margin-bottom: 15px;
            `;
            content.appendChild(conflictWarning);

            // Get all existing patterns for conflict checking
            const allExistingPatterns = mergedSites.map(site => site.pattern);

            // Function to check and display conflicts
            function updateConflictWarning() {
                const pattern = normalizeUrl(patternInput.value.trim());
                if (!pattern) {
                    conflictWarning.style.display = 'none';
                    return;
                }

                const conflicts = PatternAnalyzer.findConflicts(pattern, allExistingPatterns);
                
                if (conflicts.wider.length === 0 && conflicts.narrower.length === 0) {
                    conflictWarning.style.display = 'none';
                    return;
                }

                let warningHTML = '<div style="font-weight: 600; color: #92400e; margin-bottom: 8px;">⚠️ Pattern Conflict Detected</div>';
                
                if (conflicts.wider.length > 0) {
                    warningHTML += `
                        <div style="font-size: 13px; color: #78350f; margin-bottom: 6px;">
                            <strong>Wider pattern(s) already exist:</strong>
                        </div>
                        <ul style="margin: 4px 0 8px 20px; padding: 0; font-size: 12px; color: #92400e;">
                            ${conflicts.wider.slice(0, 3).map(p => `<li style="margin: 2px 0;">${p} (covers your pattern)</li>`).join('')}
                            ${conflicts.wider.length > 3 ? `<li style="margin: 2px 0; font-style: italic;">...and ${conflicts.wider.length - 3} more</li>` : ''}
                        </ul>
                        <div style="font-size: 12px; color: #78350f; font-style: italic;">
                            Your specific pattern will take precedence when both match.
                        </div>
                    `;
                }
                
                if (conflicts.narrower.length > 0) {
                    if (conflicts.wider.length > 0) {
                        warningHTML += '<div style="border-top: 1px solid #fbbf24; margin: 10px 0;"></div>';
                    }
                    warningHTML += `
                        <div style="font-size: 13px; color: #78350f; margin-bottom: 6px;">
                            <strong>Your pattern is wider than existing ones:</strong>
                        </div>
                        <ul style="margin: 4px 0 8px 20px; padding: 0; font-size: 12px; color: #92400e;">
                            ${conflicts.narrower.slice(0, 3).map(p => `<li style="margin: 2px 0;">${p} (will take precedence)</li>`).join('')}
                            ${conflicts.narrower.length > 3 ? `<li style="margin: 2px 0; font-style: italic;">...and ${conflicts.narrower.length - 3} more</li>` : ''}
                        </ul>
                        <div style="font-size: 12px; color: #78350f; font-style: italic;">
                            These specific patterns will override yours when both match.
                        </div>
                    `;
                }

                conflictWarning.innerHTML = warningHTML;
                conflictWarning.style.display = 'block';
            }

            // Check conflicts on input change (debounced)
            const debouncedConflictCheck = debounce(updateConflictWarning, 300);
            patternInput.oninput = debouncedConflictCheck;

            // Track cleanup functions for memory leak prevention
            const cleanupHandlers = [];
            cleanupHandlers.push(() => {
                debouncedConflictCheck.cancel(); // Cancel any pending debounce
                patternInput.oninput = null;     // Remove event handler
            });

            // Initial check
            updateConflictWarning();

            // Container for other pattern options (initially hidden)
            const otherPatternsContainer = document.createElement('div');
            otherPatternsContainer.style.cssText = 'display: none; margin-top: 10px;';

            // Toggle button for other patterns
            const toggleBtn = document.createElement('button');
            toggleBtn.textContent = '▼ Show Other Patterns';
            toggleBtn.style.cssText = `
                width: 100%;
                padding: 12px;
                margin: 8px 0 12px 0;
                border: 2px solid #667eea;
                border-radius: 6px;
                background: white;
                color: #667eea;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
                min-height: 44px;
            `;

            // Create buttons for other patterns (indices 1-5)
            for (let index = 1; index < patternOptions.length; index++) {
                const opt = patternOptions[index];
                const optBtn = document.createElement('button');
                optBtn.textContent = opt.name;
                optBtn.style.cssText = `
                    display: block;
                    width: 100%;
                    padding: 12px;
                    margin: 8px 0;
                    border: 2px solid #e0e0e0;
                    border-radius: 8px;
                    background: white;
                    cursor: pointer;
                    text-align: left;
                    font-size: 14px;
                    transition: all 0.2s;
                    min-height: 44px;
                `;
                optBtn.onclick = () => {
                    patternInput.value = normalizeUrl(opt.pattern);
                    // Hide other patterns after selection
                    otherPatternsContainer.style.display = 'none';
                    toggleBtn.textContent = '▼ Show Other Patterns';
                    // Trigger conflict check
                    updateConflictWarning();
                };
                otherPatternsContainer.appendChild(optBtn);
            }

            toggleBtn.onmouseover = () => toggleBtn.style.background = '#f5f3ff';
            toggleBtn.onmouseout = () => toggleBtn.style.background = 'white';
            toggleBtn.onclick = () => {
                if (otherPatternsContainer.style.display === 'none') {
                    otherPatternsContainer.style.display = 'block';
                    toggleBtn.textContent = '▲ Hide Other Patterns';
                } else {
                    otherPatternsContainer.style.display = 'none';
                    toggleBtn.textContent = '▼ Show Other Patterns';
                }
            };
            // Add cleanup for toggle button
            cleanupHandlers.push(() => {
                toggleBtn.onclick = null;
                toggleBtn.onmouseover = null;
                toggleBtn.onmouseout = null;
            });
            content.appendChild(toggleBtn);
            content.appendChild(otherPatternsContainer);

            // ====== DYNAMIC OPTIONS UI FROM SCHEMA ======
            const configTitle = document.createElement('h3');
            configTitle.textContent = 'Configuration Options:';
            configTitle.style.cssText = 'margin: 25px 0 15px 0; font-size: 16px; color: #333;';
            content.appendChild(configTitle);

            // Build current values object with defaults
            const currentValues = {};
            for (const [optKey, optDef] of Object.entries(fullSchema.definitions)) {
                currentValues[optKey] = optDef.default;
            }

            // Generate options UI
            const optionsUI = UIGenerator.generateOptionsUI(fullSchema, currentValues, (optKey, value) => {
                currentValues[optKey] = value;
            });
            content.appendChild(optionsUI);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'margin-top: 25px; display: flex; justify-content: flex-end; gap: 10px;';

            const { modal, cleanup: modalCleanup } = createModal('➕ Add Current Site to Include List', content, { maxWidth: '700px' });

            // Wrap cleanup to also run our cleanup handlers
            const cleanup = () => {
                cleanupHandlers.forEach(fn => fn());
                modalCleanup();
            };

            const cancelBtn = createButton('Cancel', () => {
                cleanup();
            }, 'secondary');

            const addBtn = createButton('Add Site', () => {
                // Get pattern from input
                const pattern = normalizeUrl(patternInput.value.trim());
                
                // Validate pattern
                const validation = PatternAnalyzer.validatePattern(pattern);
                if (!validation.valid) {
                    alert(`⚠️ ${validation.error}`);
                    return;
                }

                // Build entry with all options
                const entry = { pattern };
                for (const [optKey, optDef] of Object.entries(fullSchema.definitions)) {
                    // Only save non-default values
                    if (currentValues[optKey] !== optDef.default) {
                        entry[optKey] = currentValues[optKey];
                    }
                }
                
                if (!additionalSites.some(item => item.pattern === pattern)) {
                    additionalSites.push(entry);
                    GM_setValue(STORAGE_KEY, additionalSites);
                    refreshMergedSites();
                    cleanup();
                    alert(`✅ Added site with pattern: ${pattern}`);
                } else {
                    alert(`⚠️ Pattern "${pattern}" is already in the list.`);
                }
            }, 'success');

            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(addBtn);
            content.appendChild(buttonContainer);
        }

        // ====== MENU COMMAND 2: Advanced Management ======
        function showAdvancedManagement() {
            const content = document.createElement('div');

            // Get current site for matching
            const currentFullPath = getCurrentFullPath();

            // Compact stats header
            const stats = document.createElement('div');
            stats.style.cssText = `
                background: #667eea;
                color: white;
                padding: 10px 15px;
                border-radius: 6px;
                margin-bottom: 12px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            `;
            stats.innerHTML = `
                <div><span style="font-size: 20px; font-weight: 700;">${additionalSites.length}</span> <span style="font-size: 13px;">Sites</span></div>
                <div style="font-size: 12px; opacity: 0.9;">${countWildcardMatches()} matching current page</div>
            `;
            content.appendChild(stats);

            // Compact button bar
            const buttonBar = document.createElement('div');
            buttonBar.style.cssText = `
                display: flex;
                gap: 8px;
                margin-bottom: 12px;
                flex-wrap: wrap;
            `;

            const refreshList = () => {
                document.body.querySelectorAll('[data-modal-advanced]').forEach(m => {
                    // Clean up before removing
                    m.onclick = null;
                    document.body.removeChild(m);
                });
                showAdvancedManagement();
            };

            const compactBtn = (text, onClick, style) => {
                const btn = createButton(text, onClick, style);
                btn.style.padding = '6px 12px';
                btn.style.fontSize = '13px';
                btn.style.margin = '0';
                btn.style.minHeight = '36px';
                return btn;
            };

            buttonBar.appendChild(compactBtn('📤 Export', exportAdditionalSites, 'primary'));
            buttonBar.appendChild(compactBtn('📥 Import', () => {
                importAdditionalSites(refreshList);
            }, 'primary'));
            buttonBar.appendChild(compactBtn('🗑️ Clear All', () => {
                clearAllEntriesConfirm(refreshList);
            }, 'danger'));

            content.appendChild(buttonBar);

            if (additionalSites.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.style.cssText = `
                    text-align: center;
                    padding: 30px;
                    color: #9ca3af;
                    font-size: 14px;
                `;
                emptyMsg.textContent = 'No user-defined sites added yet.';
                content.appendChild(emptyMsg);
            } else {
                // Search/Filter input
                const searchContainer = document.createElement('div');
                searchContainer.style.cssText = 'margin-bottom: 12px;';
                
                const searchInput = createInput('text', '', '🔍 Search patterns...');
                searchInput.style.margin = '0';
                searchInput.style.padding = '8px 12px';
                searchInput.style.fontSize = '13px';
                searchInput.readOnly = false;
                searchInput.disabled = false;
                searchInput.autocomplete = 'off';
                searchContainer.appendChild(searchInput);
                content.appendChild(searchContainer);

                // ====== SMART SORTING WITH SPECIFICITY AND MATCH TYPE ======
                // Get all patterns that match the current URL for context
                const allMatchingPatterns = getAllMatchingPatterns();
                
                const sortedSites = additionalSites.map((item, index) => {
                    // Test match using optimized index lookup
                    let isMatch = false;
                    const p = item.pattern;
                    
                    if (p === currentFullPath) {
                        isMatch = true;
                    } else if (p.startsWith('*') && p.indexOf('*', 1) === -1) {
                        isMatch = currentFullPath.endsWith(p.substring(1));
                    } else if (p.endsWith('*') && p.indexOf('*') === p.length - 1) {
                        isMatch = currentFullPath.startsWith(p.substring(0, p.length - 1));
                    } else if (p.includes('*')) {
                        isMatch = wildcardToRegex(p).test(currentFullPath);
                    }
                    
                    // Calculate specificity and match type (pass isMatch to avoid re-testing)
                    const specificity = PatternAnalyzer.calculateSpecificity(p);
                    const matchType = PatternAnalyzer.getMatchType(
                        p, 
                        currentFullPath, 
                        isMatch ? allMatchingPatterns : [], 
                        isMatch  // Pass pre-computed match result
                    );
                    
                    return {
                        item,
                        originalIndex: index,
                        isMatch,
                        specificity,
                        matchType
                    };
                }).sort((a, b) => {
                    // Sort priority:
                    // 1. Match type: specific > generic > related > none
                    const matchOrder = { specific: 0, exact: 0, generic: 1, related: 2, none: 3 };
                    const matchOrderA = matchOrder[a.matchType] ?? 3;
                    const matchOrderB = matchOrder[b.matchType] ?? 3;
                    
                    if (matchOrderA !== matchOrderB) {
                        return matchOrderA - matchOrderB;
                    }
                    
                    // 2. Within same match type, sort by specificity (higher first)
                    if (a.specificity !== b.specificity) {
                        return b.specificity - a.specificity;
                    }
                    
                    // 3. Alphabetically as tiebreaker
                    return a.item.pattern.localeCompare(b.item.pattern);
                });

                // ====== OPTIMIZATION: Virtual scrolling for large lists ======
                const listContainer = document.createElement('div');
                listContainer.style.cssText = `
                    max-height: 450px;
                    overflow-y: auto;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                `;

                // Track rendered items for virtual scrolling
                let allCards = [];

                // Function to render a site entry with visual badges
                function renderSiteEntry(siteData) {
                    const item = siteData.item;
                    const siteCard = document.createElement('div');
                    
                    // Different background colors based on match type
                    let bgColor = 'white';
                    if (siteData.matchType === 'specific' || siteData.matchType === 'exact') {
                        bgColor = '#ecfdf5'; // Green tint for most specific
                    } else if (siteData.matchType === 'generic') {
                        bgColor = '#f0f9ff'; // Blue tint for generic match
                    } else if (siteData.matchType === 'related') {
                        bgColor = '#fefce8'; // Yellow tint for related
                    }
                    
                    siteCard.style.cssText = `
                        padding: 8px 12px;
                        border-bottom: 1px solid #f0f0f0;
                        background: ${bgColor};
                    `;
                    siteCard.setAttribute('data-pattern', item.pattern.toLowerCase());

                    const topRow = document.createElement('div');
                    topRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;';

                    const patternContainer = document.createElement('div');
                    patternContainer.style.cssText = 'display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;';

                    const patternDiv = document.createElement('div');
                    patternDiv.style.cssText = `
                        font-weight: 600;
                        color: #1f2937;
                        word-break: break-all;
                        font-size: 13px;
                    `;
                    patternDiv.textContent = (siteData.isMatch ? '✓ ' : '') + item.pattern;
                    patternContainer.appendChild(patternDiv);

                    // Add visual badge for match type
                    if (siteData.isMatch) {
                        const badge = document.createElement('span');
                        badge.style.cssText = `
                            font-size: 10px;
                            font-weight: 600;
                            padding: 2px 6px;
                            border-radius: 4px;
                            white-space: nowrap;
                            flex-shrink: 0;
                        `;
                        
                        if (siteData.matchType === 'specific' || siteData.matchType === 'exact') {
                            badge.textContent = 'ACTIVE';
                            badge.style.background = '#10b981';
                            badge.style.color = 'white';
                            badge.title = 'Most specific match - this pattern is active for current page';
                        } else if (siteData.matchType === 'generic') {
                            badge.textContent = 'WIDER';
                            badge.style.background = '#6b7280';
                            badge.style.color = 'white';
                            badge.title = 'This wider pattern also matches, but a more specific pattern takes precedence';
                        }
                        
                        patternContainer.appendChild(badge);
                    } else if (siteData.matchType === 'related') {
                        const badge = document.createElement('span');
                        badge.style.cssText = `
                            font-size: 10px;
                            font-weight: 500;
                            padding: 2px 6px;
                            border-radius: 4px;
                            white-space: nowrap;
                            flex-shrink: 0;
                            background: #fbbf24;
                            color: #78350f;
                        `;
                        badge.textContent = 'RELATED';
                        badge.title = 'Related domain pattern';
                        patternContainer.appendChild(badge);
                    }

                    const actionBar = document.createElement('div');
                    actionBar.style.cssText = 'display: flex; gap: 6px; flex-shrink: 0; margin-left: 10px;';

                    const editBtn = document.createElement('button');
                    editBtn.textContent = '✏️';
                    editBtn.title = 'Edit';
                    editBtn.style.cssText = `
                        padding: 4px 8px;
                        border: 1px solid #d1d5db;
                        background: white;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        min-width: 32px;
                        min-height: 32px;
                    `;
                    editBtn.onclick = () => editEntryDialog(siteData.originalIndex, refreshList);

                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = '🗑️';
                    deleteBtn.title = 'Delete';
                    deleteBtn.style.cssText = `
                        padding: 4px 8px;
                        border: 1px solid #fecaca;
                        background: #fee2e2;
                        color: #991b1b;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        min-width: 32px;
                        min-height: 32px;
                    `;
                    deleteBtn.onclick = () => deleteEntryConfirm(siteData.originalIndex, refreshList);

                    actionBar.appendChild(editBtn);
                    actionBar.appendChild(deleteBtn);

                    topRow.appendChild(patternContainer);
                    topRow.appendChild(actionBar);

                    const statusDiv = document.createElement('div');
                    statusDiv.style.cssText = 'font-size: 11px; color: #6b7280;';
                    const status = formatStatus(item);
                    statusDiv.textContent = status || 'Default settings';

                    siteCard.appendChild(topRow);
                    if (status) siteCard.appendChild(statusDiv);

                    return siteCard;
                }

                // Render all sorted sites
                sortedSites.forEach(siteData => {
                    const card = renderSiteEntry(siteData);
                    allCards.push(card);
                    listContainer.appendChild(card);
                });

                content.appendChild(listContainer);

                // ====== OPTIMIZATION: Debounced search filter ======
                const debouncedFilter = debounce((searchTerm) => {
                    const lowerSearchTerm = searchTerm.toLowerCase();
                    let visibleCount = 0;
                    
                    allCards.forEach(card => {
                        const pattern = card.getAttribute('data-pattern');
                        if (pattern.includes(lowerSearchTerm)) {
                            card.style.display = '';
                            visibleCount++;
                        } else {
                            card.style.display = 'none';
                        }
                    });

                    // Show "no results" message if needed
                    let noResultsMsg = listContainer.querySelector('[data-no-results]');
                    if (visibleCount === 0 && searchTerm) {
                        if (!noResultsMsg) {
                            noResultsMsg = document.createElement('div');
                            noResultsMsg.setAttribute('data-no-results', 'true');
                            noResultsMsg.style.cssText = 'padding: 20px; text-align: center; color: #9ca3af; font-size: 13px;';
                            noResultsMsg.textContent = 'No patterns match your search';
                            listContainer.appendChild(noResultsMsg);
                        }
                    } else if (noResultsMsg) {
                        noResultsMsg.remove();
                    }
                }, 150); // 150ms debounce

                searchInput.oninput = () => {
                    debouncedFilter(searchInput.value);
                };
            }

            const { modal } = createModal('⚙️ IncludeSites-Advanced', content, { maxWidth: '700px' });
            modal.setAttribute('data-modal-advanced', 'true');
        }

        function editEntryDialog(index, onComplete) {
            const entry = additionalSites[index];
            const originalPattern = entry.pattern; // Store original for conflict checking
            const content = document.createElement('div');

            const label1 = document.createElement('label');
            label1.textContent = 'Pattern:';
            label1.style.cssText = 'display: block; margin-top: 15px; margin-bottom: 5px; font-weight: 600; color: #374151;';
            content.appendChild(label1);

            const patternInput = createInput('text', entry.pattern, 'Enter pattern');
            content.appendChild(patternInput);

            // ====== CONFLICT WARNING BANNER ======
            const conflictWarning = document.createElement('div');
            conflictWarning.style.cssText = `
                display: none;
                background: #fef3c7;
                border: 2px solid #f59e0b;
                border-radius: 8px;
                padding: 12px 15px;
                margin: 12px 0;
            `;
            content.appendChild(conflictWarning);

            // Get all existing patterns for conflict checking (exclude current pattern being edited)
            const allExistingPatterns = mergedSites
                .map(site => site.pattern)
                .filter(p => p !== originalPattern);

            // Function to check and display conflicts
            function updateConflictWarning() {
                const pattern = normalizeUrl(patternInput.value.trim());
                if (!pattern || pattern === originalPattern) {
                    conflictWarning.style.display = 'none';
                    return;
                }

                const conflicts = PatternAnalyzer.findConflicts(pattern, allExistingPatterns);
                
                if (conflicts.wider.length === 0 && conflicts.narrower.length === 0) {
                    conflictWarning.style.display = 'none';
                    return;
                }

                let warningHTML = '<div style="font-weight: 600; color: #92400e; margin-bottom: 8px;">⚠️ Pattern Conflict Detected</div>';
                
                if (conflicts.wider.length > 0) {
                    warningHTML += `
                        <div style="font-size: 13px; color: #78350f; margin-bottom: 6px;">
                            <strong>Wider pattern(s) already exist:</strong>
                        </div>
                        <ul style="margin: 4px 0 8px 20px; padding: 0; font-size: 12px; color: #92400e;">
                            ${conflicts.wider.slice(0, 3).map(p => `<li style="margin: 2px 0;">${p} (covers your pattern)</li>`).join('')}
                            ${conflicts.wider.length > 3 ? `<li style="margin: 2px 0; font-style: italic;">...and ${conflicts.wider.length - 3} more</li>` : ''}
                        </ul>
                        <div style="font-size: 12px; color: #78350f; font-style: italic;">
                            Your specific pattern will take precedence when both match.
                        </div>
                    `;
                }
                
                if (conflicts.narrower.length > 0) {
                    if (conflicts.wider.length > 0) {
                        warningHTML += '<div style="border-top: 1px solid #fbbf24; margin: 10px 0;"></div>';
                    }
                    warningHTML += `
                        <div style="font-size: 13px; color: #78350f; margin-bottom: 6px;">
                            <strong>Your pattern is wider than existing ones:</strong>
                        </div>
                        <ul style="margin: 4px 0 8px 20px; padding: 0; font-size: 12px; color: #92400e;">
                            ${conflicts.narrower.slice(0, 3).map(p => `<li style="margin: 2px 0;">${p} (will take precedence)</li>`).join('')}
                            ${conflicts.narrower.length > 3 ? `<li style="margin: 2px 0; font-style: italic;">...and ${conflicts.narrower.length - 3} more</li>` : ''}
                        </ul>
                        <div style="font-size: 12px; color: #78350f; font-style: italic;">
                            These specific patterns will override yours when both match.
                        </div>
                    `;
                }

                conflictWarning.innerHTML = warningHTML;
                conflictWarning.style.display = 'block';
            }

            // Check conflicts on input change (debounced)
            const debouncedConflictCheck = debounce(updateConflictWarning, 300);
            patternInput.oninput = debouncedConflictCheck;

            // Track cleanup functions for memory leak prevention
            const cleanupHandlers = [];
            cleanupHandlers.push(() => {
                debouncedConflictCheck.cancel(); // Cancel any pending debounce
                patternInput.oninput = null;     // Remove event handler
            });

            // ====== DYNAMIC OPTIONS UI FROM SCHEMA ======
            const configTitle = document.createElement('h3');
            configTitle.textContent = 'Configuration Options:';
            configTitle.style.cssText = 'margin: 25px 0 15px 0; font-size: 16px; color: #333;';
            content.appendChild(configTitle);

            // Build current values from entry with schema defaults as fallback
            const currentValues = {};
            for (const [optKey, optDef] of Object.entries(fullSchema.definitions)) {
                currentValues[optKey] = entry[optKey] !== undefined ? entry[optKey] : optDef.default;
            }

            // Generate options UI
            const optionsUI = UIGenerator.generateOptionsUI(fullSchema, currentValues, (optKey, value) => {
                currentValues[optKey] = value;
            });
            content.appendChild(optionsUI);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'margin-top: 25px; display: flex; justify-content: flex-end; gap: 10px;';

            const { modal, cleanup: modalCleanup } = createModal('✏️ Edit Entry', content, { maxWidth: '700px' });

            // Wrap cleanup to also run our cleanup handlers
            const cleanup = () => {
                cleanupHandlers.forEach(fn => fn());
                modalCleanup();
            };

            const cancelBtn = createButton('Cancel', () => {
                cleanup();
            }, 'secondary');

            const saveBtn = createButton('Save Changes', () => {
                const newPattern = normalizeUrl(patternInput.value.trim());
                
                // Validate pattern
                const validation = PatternAnalyzer.validatePattern(newPattern);
                if (!validation.valid) {
                    alert(`⚠️ ${validation.error}`);
                    return;
                }

                // Update entry
                entry.pattern = newPattern;
                for (const [optKey, optDef] of Object.entries(fullSchema.definitions)) {
                    if (currentValues[optKey] !== optDef.default) {
                        entry[optKey] = currentValues[optKey];
                    } else {
                        // Remove default values to keep storage clean
                        delete entry[optKey];
                    }
                }

                GM_setValue(STORAGE_KEY, additionalSites);
                refreshMergedSites();
                cleanup();
                alert('✅ Entry updated successfully.');
                if (onComplete) onComplete();
            }, 'success');

            buttonContainer.appendChild(cancelBtn);
            buttonContainer.appendChild(saveBtn);
            content.appendChild(buttonContainer);
        }

        function deleteEntryConfirm(index, onComplete) {
            const entry = additionalSites[index];
            if (confirm(`🗑️ Are you sure you want to delete this entry?\n\nPattern: ${entry.pattern}`)) {
                additionalSites.splice(index, 1);
                GM_setValue(STORAGE_KEY, additionalSites);
                refreshMergedSites();
                alert('✅ Entry deleted successfully.');
                if (onComplete) onComplete();
            }
        }

        function clearAllEntriesConfirm(onComplete) {
            if (additionalSites.length === 0) {
                alert('⚠️ No user-defined entries to clear.');
                return;
            }
            if (confirm(`🚨 You have ${additionalSites.length} entries. Clear all?`)) {
                additionalSites = [];
                GM_setValue(STORAGE_KEY, additionalSites);
                refreshMergedSites();
                alert('✅ All user-defined entries cleared.');
                if (onComplete) onComplete();
            }
        }

        function exportAdditionalSites() {
            // Export with full schema info for portability
            const exportData = {
                version: '5.0',
                scriptKey: key,
                schema: fullSchema,
                sites: additionalSites
            };
            const data = JSON.stringify(exportData, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${key}_sites_backup.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            alert('📤 Sites exported as JSON.');
        }

        function importAdditionalSites(onComplete) {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.style.display = 'none';
            input.onchange = event => {
                const reader = new FileReader();
                reader.onload = e => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        
                        // Support both new format (with version/schema) and legacy format (plain array)
                        let sitesToImport;
                        if (Array.isArray(importedData)) {
                            // Legacy format
                            sitesToImport = importedData;
                        } else if (importedData.sites && Array.isArray(importedData.sites)) {
                            // New format
                            sitesToImport = importedData.sites;
                        } else {
                            throw new Error('Invalid data format');
                        }
                        
                        additionalSites = sitesToImport.map(item => {
                                if (typeof item === 'string') {
                                return { pattern: normalizeUrl(item) };
                                } else if (typeof item === 'object' && item.pattern) {
                                // Normalize and validate against current schema
                                const entry = { pattern: normalizeUrl(item.pattern) };
                                for (const [optKey, optDef] of Object.entries(fullSchema.definitions)) {
                                    if (item[optKey] !== undefined) {
                                        const validation = SchemaEngine.validateOption(optDef, item[optKey]);
                                        if (validation.valid) {
                                            entry[optKey] = validation.value;
                                        }
                                    }
                                }
                                return entry;
                                }
                                throw new Error('Invalid data format');
                            });
                        
                            GM_setValue(STORAGE_KEY, additionalSites);
                            refreshMergedSites();
                            alert('📥 Sites imported successfully.');
                            if (onComplete) onComplete();
                    } catch (error) {
                        alert('❌ Failed to import sites: ' + error.message);
                    }
                };
                reader.readAsText(event.target.files[0]);
            };
            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        }

        // ====== REGISTER MENU COMMANDS ======
        GM_registerMenuCommand(`➕ Add Current Site to Include List (Included via ${countWildcardMatches()} wildcard matches)`, addCurrentSiteMenu);
        GM_registerMenuCommand("⚙️ IncludeSites-Advanced (View/Edit/Delete/Import/Export)", showAdvancedManagement);

        // ====== EXPOSE PUBLIC API ======
        // Core functionality
        window.shouldRunOnThisSite = shouldRunOnThisSite;
        
        // ====== LEGACY API - Backwards compatible ======
        window.isPreProcessingRequired = function() {
            const entry = findMatchingEntry();
            return entry ? (entry.preProcessingRequired ?? false) : false;
        };
        
        window.isPostProcessingRequired = function() {
            const entry = findMatchingEntry();
            return entry ? (entry.postProcessingRequired ?? false) : false;
        };
        
        window.isOnDemandFloatingButtonRequired = function() {
            const entry = findMatchingEntry();
            return entry ? (entry.onDemandFloatingButtonRequired ?? false) : false;
        };

        window.isBackgroundChangeObserverRequired = function() {
            const entry = findMatchingEntry();
            return entry ? (entry.backgroundChangeObserverRequired ?? false) : false;
        };

        // ====== NEW DYNAMIC API ======
        // Generic option getter - works with any schema-defined option
        window.getOption = function(optionName) {
            const entry = findMatchingEntry();
            if (!entry) return fullSchema.definitions[optionName]?.default ?? undefined;
            return entry[optionName] ?? fullSchema.definitions[optionName]?.default ?? undefined;
        };

        // Get all options for current site as an object
        window.getOptions = function() {
            const entry = findMatchingEntry();
            const options = {};
            for (const [optKey, optDef] of Object.entries(fullSchema.definitions)) {
                options[optKey] = entry ? (entry[optKey] ?? optDef.default) : optDef.default;
            }
            return options;
        };

        // Get the schema for the current script
        window.getOptionsSchema = function() {
            return { ...fullSchema };
        };

        // Get the matching entry with proxy for reactive updates
        window.getMatchingEntryProxy = function() {
            const entry = findMatchingEntry();
            if (!entry) return null;
            return OptionProxy.createForEntry(key, fullSchema, entry, persistOptions);
        };

        // Check if a specific option is defined in the schema
        window.hasOption = function(optionName) {
            return optionName in fullSchema.definitions;
        };

        // Validate a value against an option's schema
        window.validateOption = function(optionName, value) {
            const definition = fullSchema.definitions[optionName];
            if (!definition) return { valid: false, error: 'Unknown option' };
            return SchemaEngine.validateOption(definition, value);
        };

        // Get default value for an option
        window.getOptionDefault = function(optionName) {
            return fullSchema.definitions[optionName]?.default;
        };

        // ====== NAMESPACED API (prevents conflicts between scripts) ======
        // Create a namespaced API object for this specific script
        const namespacedAPI = {
            shouldRun: shouldRunOnThisSite,
            getOption: window.getOption,
            getOptions: window.getOptions,
            getSchema: window.getOptionsSchema,
            getMatchingEntry: window.getMatchingEntryProxy,
            hasOption: window.hasOption,
            validateOption: window.validateOption,
            getDefault: window.getOptionDefault,
            // Legacy accessors
            isPreProcessingRequired: window.isPreProcessingRequired,
            isPostProcessingRequired: window.isPostProcessingRequired,
            isOnDemandFloatingButtonRequired: window.isOnDemandFloatingButtonRequired,
            isBackgroundChangeObserverRequired: window.isBackgroundChangeObserverRequired
        };

        // Expose namespaced API under script's storage key
        window[`DynamicSites_${key}`] = namespacedAPI;

        // Also expose a registry for discovering all registered scripts
        if (!window.DynamicSitesRegistry) {
            window.DynamicSitesRegistry = new Map();
        }
        window.DynamicSitesRegistry.set(key, namespacedAPI);

    })();
})();

// ====== USAGE EXAMPLE (in including script) ======
/*
// ==UserScript==
// @name         My Custom Script
// @require      https://path/to/dynamicIncludeSites.js
// @run-at       document-end
// ==/UserScript==

// MUST be set before @require runs (or use document-start)
window.SCRIPT_STORAGE_KEY = "myCustomScript";

// Define custom options schema (optional - legacy options always included)
window.SCRIPT_OPTIONS = {
    definitions: {
        // Boolean option
        enableFeatureX: {
            type: 'boolean',
            default: false,
            label: 'Enable Feature X',
            description: 'Activates the experimental feature X',
            group: 'Features'
        },
        // Number option with validation
        maxRetries: {
            type: 'number',
            default: 3,
            min: 1,
            max: 10,
            step: 1,
            label: 'Maximum Retries',
            description: 'Number of retry attempts for failed requests',
            group: 'Performance'
        },
        // Select/dropdown option
        theme: {
            type: 'select',
            options: [
                { value: 'auto', label: 'System Default' },
                { value: 'light', label: 'Light Theme' },
                { value: 'dark', label: 'Dark Theme' }
            ],
            default: 'auto',
            label: 'Color Theme',
            group: 'Appearance'
        },
        // String option
        apiEndpoint: {
            type: 'string',
            default: 'https://api.example.com',
            label: 'API Endpoint',
            placeholder: 'Enter API URL',
            maxLength: 200,
            group: 'Advanced'
        },
        // Array option
        blockedDomains: {
            type: 'array',
            itemType: 'string',
            default: [],
            label: 'Blocked Domains',
            description: 'Domains to exclude from processing',
            maxItems: 50,
            group: 'Filtering'
        }
    },
    groups: {
        'Features': { order: 1, collapsed: false },
        'Performance': { order: 2, collapsed: true },
        'Appearance': { order: 3, collapsed: false },
        'Advanced': { order: 4, collapsed: true },
        'Filtering': { order: 5, collapsed: true }
    }
};

// Default site list (optional)
window.GET_DEFAULT_LIST = function() {
    return [
        { pattern: "*example.com*", enableFeatureX: true, maxRetries: 5 },
        { pattern: "*test.org*", theme: 'dark' }
    ];
};

(async function() {
    'use strict';
    
    // Wait for API to be available
    while (typeof shouldRunOnThisSite === 'undefined') {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    if (!(await shouldRunOnThisSite())) return;
    
    // Access options using new dynamic API
    console.log('Feature X enabled:', getOption('enableFeatureX'));
    console.log('Max retries:', getOption('maxRetries'));
    console.log('Theme:', getOption('theme'));
    console.log('All options:', getOptions());
    
    // Legacy API still works
    console.log('Pre-processing:', isPreProcessingRequired());
    console.log('Post-processing:', isPostProcessingRequired());
    
    // Or use namespaced API (recommended for multi-script scenarios)
    const api = window.DynamicSites_myCustomScript;
    console.log('Namespaced - Feature X:', api.getOption('enableFeatureX'));
    
})();
*/

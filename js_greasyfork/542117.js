// ==UserScript==
// @name         Claude API Exporter
// @namespace    http://tampermonkey.net/
// @version      4.10.0
// @description  Export Claude conversations, artifacts and projects
// @author       MRL
// @match        https://claude.ai/*
// @grant        GM_registerMenuCommand
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @icon https://www.google.com/s2/favicons?sz=64&domain=claude.ai
// @license      MIT
// @require https://update.greasyfork.org/scripts/543706/Claude%20Mass%20Exporter%20Library.js
// @require https://update.greasyfork.org/scripts/546704/Claude%20Project%20Documents%20Exporter%20Library.js

// @downloadURL https://update.greasyfork.org/scripts/542117/Claude%20API%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/542117/Claude%20API%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =============================================
    // CORE & UTILITIES
    // =============================================

    // JSZIP DYNAMIC LOADER
    // Code from https://greasyfork.org/ru/scripts/541467
    function loadJSZip() {
        return new Promise((resolve, reject) => {
            if (typeof JSZip !== 'undefined') {
                // console.log('[Claude API Exporter] JSZip already available');
                resolve();
                return;
            }

            // console.log('[Claude API Exporter] Loading JSZip from CDN...');
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
            script.onload = () => {
                // console.log('[Claude API Exporter] JSZip script loaded');
                setTimeout(() => {
                    if (typeof JSZip !== 'undefined') {
                        // console.log('[Claude API Exporter] JSZip is now available');
                        resolve();
                    } else {
                        reject(new Error('JSZip loaded but not available'));
                    }
                }, 500);
            };
            script.onerror = () => {
                console.error('[Claude API Exporter] Failed to load JSZip');
                reject(new Error('Failed to load JSZip'));
            };
            document.head.appendChild(script);
        });
    }

    // =============================================
    // CONSTANTS AND DEFAULT SETTINGS
    // =============================================

    /**
     * Default settings configuration
     */
    const defaultSettings = {
        conversationTemplate: '[{created_date}_{created_time}] {conversation_title}.md',
        artifactTemplate: '[{timestamp}] {conversation_title} - Branch{branch}{main_suffix}_v{version}_{artifact_title}_{artifactId}_{command}{canceled}{extension}',
        dateFormat: 'YYYY-MM-DD_HH-MM-SS', // YYYYMMDDHHMMSS, YYYY-MM-DD_HH-MM-SS, ISO

        artifactExportMode: 'files', // Flexible artifact export settings: 'embed', 'files', 'both'
        conversationOnlyArtifactMode: 'none', // 'none', 'final', 'all', 'latest_per_message'
        includeArtifactMetadata: true, // Include metadata comments in artifact files
        excludeCanceledArtifacts: false, // User canceled message

        // Content formatting settings
        excludeAttachments: true, // Exclude attachments from conversation export
        removeDoubleNewlinesFromConversation: false, // Remove \n\n from conversation content
        removeDoubleNewlinesFromMarkdown: false, // Remove \n\n from markdown artifact content
        includeParentMessageUuid: false, // Include parent message UUID in conversation export
        conversationSortMode: 'pairs', // 'chronological', 'logical', or 'pairs'

        // Archive settings
        exportToArchive: true, // Export files to ZIP archive
        createChatFolders: false, // Create folders for each chat in archive
        archiveName: 'Claude_Export_{timestamp}_{conversation_title}',
        chatFolderName: '[{created_date}_{created_time}] {conversation_title}',

        // Mass export archive settings (only when mass exporter detected)
        forceArchiveForMassExport: true, // Force archive for mass exports
        forceChatFoldersForMassExport: true, // Force chat folders for mass exports
        massExportArchiveName: 'Claude_{export_type}_Export_{timestamp}',
        massExportProjectsChatFolderName: '{project_name}/[{created_date}_{created_time}] {conversation_title}', // Export all projects
        massExportSingleChatFolderName: '{project_name}/[{created_date}_{created_time}] {conversation_title}', // Export a single project and recent conversations

        // Main branch export settings
        useCurrentLeafForMainBranch: false, // Use current_leaf_message_uuid instead of max index
        exportOnlyCurrentBranch: false, // Use tree=false to get only user-selected branch
        mainBranchOnlyIncludeAllMessages: false, // Include all messages in main branch export

        // Export menu button settings
        enableConversationOnly: true,
        enableFinalArtifacts: true,
        enableAllArtifacts: true,
        enableLatestPerMessage: true,
        enableMainBranchOnly: true,
        enableRawApiExport: false,
        rawApiExportFormat: 'pretty', // 'pretty', 'compact'
    };

    /**
     * Available variables for filename templates
     */
    const availableVariables = {
        // Common variables
        '{timestamp}': 'Main timestamp (conversation: updated_at, artifact: content_stop_timestamp) in dateFormat setting',
        '{conversationId}': 'Unique conversation identifier',
        '{conversation_title}': 'Conversation title',
        '{artifact_title}': 'Artifact title',
        '{export_type}': 'Type of export (Conversation, Projects, Recent, etc.)',
        '{project_name}': 'Project name (for mass exports)',

        // Artifact-specific variables
        '{artifactId}': 'Unique artifact identifier',
        '{version}': 'Artifact version number',
        '{branch}': 'Branch number (e.g., 1, 2, 3)',
        '{main_suffix}': 'Suffix "_main" for main branch, empty for others',
        '{command}': 'Artifact command (create, update, rewrite)',
        '{extension}': 'File extension based on artifact type',
        '{canceled}': 'Adds "_сanceled" if artifact was canceled, empty otherwise',

        // Conversation created_at timestamps
        '{created_date}': 'Conversation created_at date in YYYY-MM-DD format',
        '{created_time}': 'Conversation created_at time in HH-MM-SS format',
        '{created_year}': 'Conversation created_at year (YYYY)',
        '{created_month}': 'Conversation created_at month (MM)',
        '{created_day}': 'Conversation created_at day (DD)',
        '{created_hour}': 'Conversation created_at hour (HH)',
        '{created_minute}': 'Conversation created_at minute (MM)',
        '{created_second}': 'Conversation created_at second (SS)',

        // Conversation updated_at timestamps
        '{updated_date}': 'Conversation updated_at date in YYYY-MM-DD format',
        '{updated_time}': 'Conversation updated_at time in HH-MM-SS format',
        '{updated_year}': 'Conversation updated_at year (YYYY)',
        '{updated_month}': 'Conversation updated_at month (MM)',
        '{updated_day}': 'Conversation updated_at day (DD)',
        '{updated_hour}': 'Conversation updated_at hour (HH)',
        '{updated_minute}': 'Conversation updated_at minute (MM)',
        '{updated_second}': 'Conversation updated_at second (SS)',

        // Artifact content_start_timestamp
        '{content_start_date}': 'Artifact content_start_timestamp date in YYYY-MM-DD format',
        '{content_start_time}': 'Artifact content_start_timestamp time in HH-MM-SS format',
        '{content_start_year}': 'Artifact content_start_timestamp year (YYYY)',
        '{content_start_month}': 'Artifact content_start_timestamp month (MM)',
        '{content_start_day}': 'Artifact content_start_timestamp day (DD)',
        '{content_start_hour}': 'Artifact content_start_timestamp hour (HH)',
        '{content_start_minute}': 'Artifact content_start_timestamp minute (MM)',
        '{content_start_second}': 'Artifact content_start_timestamp second (SS)',

        // Artifact content_stop_timestamp
        '{content_stop_date}': 'Artifact content_stop_timestamp date in YYYY-MM-DD format',
        '{content_stop_time}': 'Artifact content_stop_timestamp time in HH-MM-SS format',
        '{content_stop_year}': 'Artifact content_stop_timestamp year (YYYY)',
        '{content_stop_month}': 'Artifact content_stop_timestamp month (MM)',
        '{content_stop_day}': 'Artifact content_stop_timestamp day (DD)',
        '{content_stop_hour}': 'Artifact content_stop_timestamp hour (HH)',
        '{content_stop_minute}': 'Artifact content_stop_timestamp minute (MM)',
        '{content_stop_second}': 'Artifact content_stop_timestamp second (SS)',

        // Current export time variables
        '{current_date}': 'Current export date in YYYY-MM-DD format',
        '{current_time}': 'Current export time in HH-MM-SS format',
        '{current_year}': 'Current export year (YYYY)',
        '{current_month}': 'Current export month (MM)',
        '{current_day}': 'Current export day (DD)',
        '{current_hour}': 'Current export hour (HH)',
        '{current_minute}': 'Current export minute (MM)',
        '{current_second}': 'Current export second (SS)'
    };

    // =============================================
    // SETTINGS MANAGEMENT
    // =============================================

    /**
     * Load settings from storage
     */
    function loadSettings() {
        const settings = {};
        for (const [key, defaultValue] of Object.entries(defaultSettings)) {
            settings[key] = GM_getValue(key, defaultValue);
        }
        return settings;
    }

    /**
     * Save settings to storage
     */
    function saveSettings(settings) {
        for (const [key, value] of Object.entries(settings)) {
            GM_setValue(key, value);
        }
    }

    /**
     * Apply variables to template string
     */
    function applyTemplate(template, variables) {
        let result = template;

        for (const [placeholder, value] of Object.entries(variables)) {
            // Replace all occurrences of the placeholder
            result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value || '');
        }

        return result;
    }

    // =============================================
    // SETTINGS SYSTEM
    // =============================================

    /**
     * Creates standard template variables from conversation data
     */
    function createStandardTemplateVariables(conversationData) {
        const createdDate = new Date(conversationData.created_at);
        const updatedDate = new Date(conversationData.updated_at);
        const currentDate = new Date();

        return {
            '{conversationId}': conversationData.uuid,
            '{conversation_title}': sanitizeFileName(conversationData.name),

            // Conversation created_at variables
            '{created_date}': createdDate.toISOString().split('T')[0],
            '{created_time}': createdDate.toTimeString().split(' ')[0].replace(/:/g, '-'),
            '{created_year}': createdDate.getFullYear().toString(),
            '{created_month}': String(createdDate.getMonth() + 1).padStart(2, '0'),
            '{created_day}': String(createdDate.getDate()).padStart(2, '0'),
            '{created_hour}': String(createdDate.getHours()).padStart(2, '0'),
            '{created_minute}': String(createdDate.getMinutes()).padStart(2, '0'),
            '{created_second}': String(createdDate.getSeconds()).padStart(2, '0'),

            // Conversation updated_at variables
            '{updated_date}': updatedDate.toISOString().split('T')[0],
            '{updated_time}': updatedDate.toTimeString().split(' ')[0].replace(/:/g, '-'),
            '{updated_year}': updatedDate.getFullYear().toString(),
            '{updated_month}': String(updatedDate.getMonth() + 1).padStart(2, '0'),
            '{updated_day}': String(updatedDate.getDate()).padStart(2, '0'),
            '{updated_hour}': String(updatedDate.getHours()).padStart(2, '0'),
            '{updated_minute}': String(updatedDate.getMinutes()).padStart(2, '0'),
            '{updated_second}': String(updatedDate.getSeconds()).padStart(2, '0'),

            // Current time variables
            '{current_date}': currentDate.toISOString().split('T')[0],
            '{current_time}': currentDate.toTimeString().split(' ')[0].replace(/:/g, '-'),
            '{current_year}': currentDate.getFullYear().toString(),
            '{current_month}': String(currentDate.getMonth() + 1).padStart(2, '0'),
            '{current_day}': String(currentDate.getDate()).padStart(2, '0'),
            '{current_hour}': String(currentDate.getHours()).padStart(2, '0'),
            '{current_minute}': String(currentDate.getMinutes()).padStart(2, '0'),
            '{current_second}': String(currentDate.getSeconds()).padStart(2, '0')
        };
    }

    /**
     * Creates artifact-specific template variables
     */
    function createArtifactTemplateVariables(version, conversationData, branchLabel, isMain, artifactId) {
        const baseVariables = createStandardTemplateVariables(conversationData);
        const contentStartDate = new Date(version.content_start_timestamp);
        const contentStopDate = new Date(version.content_stop_timestamp);

        return {
            ...baseVariables,
            '{timestamp}': generateTimestamp(version.content_stop_timestamp),
            '{artifactId}': artifactId,
            '{version}': version.version.toString(),
            '{branch}': branchLabel,
            '{main_suffix}': isMain ? '_main' : '',
            '{artifact_title}': sanitizeFileName(version.title),
            '{command}': version.command,
            '{extension}': getFileExtension(version.finalType, version.finalLanguage),
            '{canceled}': version.stop_reason === 'user_canceled' ? '_сanceled' : '',

            // Artifact content_start_timestamp variables
            '{content_start_date}': contentStartDate.toISOString().split('T')[0],
            '{content_start_time}': contentStartDate.toTimeString().split(' ')[0].replace(/:/g, '-'),
            '{content_start_year}': contentStartDate.getFullYear().toString(),
            '{content_start_month}': String(contentStartDate.getMonth() + 1).padStart(2, '0'),
            '{content_start_day}': String(contentStartDate.getDate()).padStart(2, '0'),
            '{content_start_hour}': String(contentStartDate.getHours()).padStart(2, '0'),
            '{content_start_minute}': String(contentStartDate.getMinutes()).padStart(2, '0'),
            '{content_start_second}': String(contentStartDate.getSeconds()).padStart(2, '0'),

            // Artifact content_stop_timestamp variables
            '{content_stop_date}': contentStopDate.toISOString().split('T')[0],
            '{content_stop_time}': contentStopDate.toTimeString().split(' ')[0].replace(/:/g, '-'),
            '{content_stop_year}': contentStopDate.getFullYear().toString(),
            '{content_stop_month}': String(contentStopDate.getMonth() + 1).padStart(2, '0'),
            '{content_stop_day}': String(contentStopDate.getDate()).padStart(2, '0'),
            '{content_stop_hour}': String(contentStopDate.getHours()).padStart(2, '0'),
            '{content_stop_minute}': String(contentStopDate.getMinutes()).padStart(2, '0'),
            '{content_stop_second}': String(contentStopDate.getSeconds()).padStart(2, '0')
        };
    }

    /**
     * Formats timestamp according to the selected format
     */
    function formatTimestamp(dateInput, format) {
        const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

        if (isNaN(d.getTime())) {
            return formatTimestamp(new Date(), format);
        }

        const components = {
            year: d.getFullYear(),
            month: String(d.getMonth() + 1).padStart(2, '0'),
            day: String(d.getDate()).padStart(2, '0'),
            hour: String(d.getHours()).padStart(2, '0'),
            minute: String(d.getMinutes()).padStart(2, '0'),
            second: String(d.getSeconds()).padStart(2, '0')
        };

        switch (format) {
            case 'YYYY-MM-DD_HH-MM-SS':
                return `${components.year}-${components.month}-${components.day}_${components.hour}-${components.minute}-${components.second}`;
            case 'ISO':
                return `${components.year}-${components.month}-${components.day}T${components.hour}-${components.minute}-${components.second}`;
            case 'YYYYMMDDHHMMSS':
            default:
                return `${components.year}${components.month}${components.day}${components.hour}${components.minute}${components.second}`;
        }
    }

    /**
     * Generates timestamp using current settings
     */
    function generateTimestamp(dateInput) {
        const settings = loadSettings();
        const date = dateInput ?
            (typeof dateInput === 'string' ? new Date(dateInput) : dateInput) :
            new Date();

        return formatTimestamp(date, settings.dateFormat);
    }

    /**
     * Creates template variables object for filenames
     */
    function createTemplateVariables(baseData) {
        return { ...baseData };
    }

    /**
     * Generates conversation filename using template
     */
    function generateConversationFilename(conversationData) {
        const settings = loadSettings();
        const variables = {
            ...createStandardTemplateVariables(conversationData),
            '{timestamp}': generateTimestamp(conversationData.updated_at)
        };

        return applyTemplate(settings.conversationTemplate, variables);
    }

    /**
     * Generates artifact filename using template
     */
    function generateArtifactFilename(version, conversationData, branchLabel, isMain, artifactId) {
        const settings = loadSettings();
        const variables = createArtifactTemplateVariables(version, conversationData, branchLabel, isMain, artifactId);

        return applyTemplate(settings.artifactTemplate, variables);
    }

    /**
     * Generates archive filename using template
     */
    function generateArchiveName(conversationData, template, isMassExport = false, exportType = 'Conversation') {
        const variables = {
            ...createStandardTemplateVariables(conversationData),
            '{timestamp}': generateTimestamp(new Date()),
            '{export_type}': exportType
        };

        return applyTemplate(template, variables) + '.zip';
    }

    /**
     * Generates chat folder name using template
     */
    function generateChatFolderName(conversationData, projectData, template) {
        const variables = {
            ...createStandardTemplateVariables(conversationData),
            '{timestamp}': generateTimestamp(new Date()),
            '{project_name}': projectData ? sanitizeFileName(projectData.name) : '',
            '{project_id}': projectData ? projectData.uuid : ''
        };

        return applyTemplate(template, variables);
    }

    // =============================================
    // SETTINGS UI
    // =============================================

    /**
     * Creates and shows the settings interface
     */
    function showSettingsUI() {
        // Remove existing settings UI if present
        document.getElementById('claude-exporter-settings')?.remove();
        const currentSettings = loadSettings();

        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'claude-exporter-settings';
        overlay.innerHTML = createSettingsHTML(currentSettings);

        // Add styles to head and modal to body
        document.head.insertAdjacentHTML('beforeend', getSettingsStyles());
        document.body.appendChild(overlay);

        // Initialize functionality
        initTabs();
        initEventListeners();
        updatePreviews();
    }

    /**
     * Creates the settings HTML structure
     */
    function createSettingsHTML(currentSettings) {
        return `
            <div class="claude-settings-overlay">
                <div class="claude-settings-modal">
                    <div class="claude-settings-header">
                        <h2>🔧 Claude Exporter Settings</h2>
                        <button class="claude-settings-close" type="button">×</button>
                    </div>

                    <!-- Tab Navigation -->
                    <div class="claude-tabs-nav">
                        <button class="claude-tab-btn active" data-tab="general">⚙️ General Settings</button>
                        <button class="claude-tab-btn" data-tab="filenames">📁 Filename Templates</button>
                        <button class="claude-tab-btn" data-tab="archive">📦 Archive Settings</button>
                        <button class="claude-tab-btn" data-tab="menu">📋 Export Menu</button>
                    </div>

                    <div class="claude-settings-content">
                        <!-- Tab 1: General Settings -->
                        <div class="claude-tab-content active" id="tab-general">
                            <div class="claude-settings-section">
                                <h3>📦 Artifact Export Settings</h3>
                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="excludeCanceledArtifacts" ${currentSettings.excludeCanceledArtifacts ? 'checked' : ''}>
                                        <label for="excludeCanceledArtifacts">Skip artifacts from canceled messages</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, artifacts from messages that were stopped by user (stop_reason: "user_canceled") will be excluded from export. This helps avoid incomplete or unfinished artifacts.</p>
                                </div>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="mainBranchOnlyIncludeAllMessages" ${currentSettings.mainBranchOnlyIncludeAllMessages ? 'checked' : ''}>
                                        <label for="mainBranchOnlyIncludeAllMessages">Include all messages in main branch export</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, main branch export includes all conversation messages, but only main branch artifacts. When disabled, includes only main branch messages and artifacts.</p>
                                </div>

                                <div class="claude-setting-group">
                                    <label for="artifactExportMode">Default artifact export mode:</label>
                                    <select id="artifactExportMode">
                                        ${['embed', 'files', 'both'].map(mode =>
                                            `<option value="${mode}" ${currentSettings.artifactExportMode === mode ? 'selected' : ''}>
                                                ${mode === 'embed' ? '📄 Embed Only - Include artifacts in conversation file only' :
                                                  mode === 'files' ? '📁 Files Only - Export artifacts as separate files only' :
                                                  '📄📁 Both - Include in conversation and export as separate files'}
                                            </option>`).join('')}
                                    </select>
                                    <p class="claude-settings-help">This setting affects all export buttons: "Export Conversation + Final Artifacts", "Export Conversation + All Artifacts", and "Export Conversation + Latest Artifacts Per Message".</p>
                                </div>

                                <div class="claude-setting-group">
                                    <label for="conversationOnlyArtifactMode">Artifacts mode for "Export Conversation Only":</label>
                                    <select id="conversationOnlyArtifactMode">
                                        <option value="none" ${currentSettings.conversationOnlyArtifactMode === 'none' ? 'selected' : ''}>📄 None - Pure conversation without artifacts</option>
                                        <option value="final" ${currentSettings.conversationOnlyArtifactMode === 'final' ? 'selected' : ''}>🎯 Final Artifacts - Only final versions</option>
                                        <option value="all" ${currentSettings.conversationOnlyArtifactMode === 'all' ? 'selected' : ''}>📁 All Artifacts - All versions</option>
                                        <option value="latest_per_message" ${currentSettings.conversationOnlyArtifactMode === 'latest_per_message' ? 'selected' : ''}>💬 Latest Per Message - Latest artifact per message</option>
                                        <option value="main_branch_only" ${currentSettings.conversationOnlyArtifactMode === 'main_branch_only' ? 'selected' : ''}>🌿 Main Branch Only - Only artifacts from main branch</option>
                                    </select>
                                    <p class="claude-settings-help">Choose which artifacts to include when using "Export Conversation Only" button.</p>
                                </div>

                                <div class="claude-export-behavior-info">
                                    <h4>📋 Export Behavior Summary</h4>
                                    <div class="claude-behavior-grid">
                                        <div class="claude-behavior-item">
                                            <strong>Conversation Only:</strong>
                                            <span id="conversationOnlyBehavior"></span>
                                        </div>
                                        <div class="claude-behavior-item">
                                            <strong>Final Artifacts:</strong>
                                            <span id="finalArtifactsBehavior"></span>
                                        </div>
                                        <div class="claude-behavior-item">
                                            <strong>All Artifacts:</strong>
                                            <span id="allArtifactsBehavior"></span>
                                        </div>
                                        <div class="claude-behavior-item">
                                            <strong>Latest Per Message:</strong>
                                            <span id="latestPerMessageBehavior"></span>
                                        </div>
                                        <div class="claude-behavior-item">
                                            <strong>Main Branch Only:</strong>
                                            <span id="mainBranchOnlyBehavior"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="claude-settings-section">
                                <h3>🌿 Branch Export Settings</h3>
                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="exportOnlyCurrentBranch" ${currentSettings.exportOnlyCurrentBranch ? 'checked' : ''}>
                                        <label for="exportOnlyCurrentBranch">Export only current user-selected branch</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, only exports the conversation branch currently selected by user in Claude interface. Uses tree=false API parameter.</p>
                                </div>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="useCurrentLeafForMainBranch" ${currentSettings.useCurrentLeafForMainBranch ? 'checked' : ''}>
                                        <label for="useCurrentLeafForMainBranch">Use user-selected message for main branch detection</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, main branch is determined from user-selected message (current_leaf_message_uuid) instead of message with highest index.</p>
                                </div>
                            </div>

                            <div class="claude-settings-section">
                                <h3>📝 Content Formatting</h3>
                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="excludeAttachments" ${currentSettings.excludeAttachments ? 'checked' : ''}>
                                        <label for="excludeAttachments">Exclude attachments content from conversation export</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, the extracted content of attachments will not be included in the exported conversation markdown.</p>
                                </div>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="removeDoubleNewlinesFromConversation" ${currentSettings.removeDoubleNewlinesFromConversation ? 'checked' : ''}>
                                        <label for="removeDoubleNewlinesFromConversation">Remove double newlines (\\n\\n) from conversation content</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, replaces multiple consecutive newlines with single newlines in conversation text content only. Does not affect markdown structure or metadata.</p>
                                </div>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="removeDoubleNewlinesFromMarkdown" ${currentSettings.removeDoubleNewlinesFromMarkdown ? 'checked' : ''}>
                                        <label for="removeDoubleNewlinesFromMarkdown">Remove double newlines (\\n\\n) from markdown artifact content</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, replaces multiple consecutive newlines with single newlines in markdown artifact content only. Does not affect artifact metadata or other file types.</p>
                                </div>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="includeParentMessageUuid" ${currentSettings.includeParentMessageUuid ? 'checked' : ''}>
                                        <label for="includeParentMessageUuid">Include parent message UUID in export</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, adds parent message UUID to message metadata. Useful for debugging conversation structure and understanding message relationships in complex branched conversations.</p>
                                </div>

                                <div class="claude-setting-group">
                                    <label for="conversationSortMode">Message sorting mode:</label>
                                    <select id="conversationSortMode">
                                        <option value="chronological" ${currentSettings.conversationSortMode === 'chronological' ? 'selected' : ''}>
                                            📅 Chronological (default) - Sort by API index (creation order)
                                        </option>
                                        <option value="pairs" ${currentSettings.conversationSortMode === 'pairs' ? 'selected' : ''}>
                                            🗣️ Pairs - Sort Human → Claude pairs by time
                                        </option>
                                        <option value="logical" ${currentSettings.conversationSortMode === 'logical' ? 'selected' : ''}>
                                             (TEST) 🌳 Logical - Sort by conversation tree structure (parent-child)
                                        </option>
                                    </select>
                                    <p class="claude-settings-help">Chronological: API order. Logical: conversation tree with branches. Pairs: Human → Claude pairs in chronological order.</p>
                                </div>
                            </div>

                            <div class="claude-settings-section">
                                <h3>📝 Artifact File Settings</h3>
                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="includeArtifactMetadata" ${currentSettings.includeArtifactMetadata ? 'checked' : ''}>
                                        <label for="includeArtifactMetadata">Include metadata comments in artifact files</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, artifact files will include metadata comments at the top (ID, branch, version, etc.). When disabled, files will contain only the pure artifact content.</p>
                                </div>
                            </div>
                        </div>

                        <!-- Tab 2: Filename Templates -->
                        <div class="claude-tab-content" id="tab-filenames">
                            <div class="claude-settings-section">
                                <h3>📁 Filename Templates</h3>
                                <p class="claude-settings-description">Configure how exported files are named using variables. <a href="#claude-variables-panel" class="claude-variables-toggle">Show available variables</a></p>

                                <div class="claude-variables-panel" style="display: none;">
                                    <h4>Available Variables:</h4>
                                    <div class="claude-variables-grid">
                                        ${Object.entries(availableVariables).map(([variable, description]) =>
                                            `<div class="claude-variable-item"><code class="claude-variable-name">${variable}</code><span class="claude-variable-desc">${description}</span></div>`).join('')}
                                    </div>
                                </div>

                                <div class="claude-setting-group">
                                    <label for="conversationTemplate">Conversation Files:</label>
                                    <input type="text" id="conversationTemplate" value="${currentSettings.conversationTemplate}" placeholder="${defaultSettings.conversationTemplate}">
                                    <div class="claude-preview" id="conversationPreview"></div>
                                </div>

                                <div class="claude-setting-group">
                                    <label for="artifactTemplate">Artifact Files:</label>
                                    <input type="text" id="artifactTemplate" value="${currentSettings.artifactTemplate}" placeholder="${defaultSettings.artifactTemplate}">
                                    <div class="claude-preview" id="artifactPreview"></div>
                                </div>
                            </div>

                            <div class="claude-settings-section">
                                <h3>📅 Date Format</h3>
                                <div class="claude-setting-group">
                                    <label for="dateFormat">Timestamp Format:</label>
                                    <select id="dateFormat">
                                        <option value="YYYYMMDDHHMMSS" ${currentSettings.dateFormat === 'YYYYMMDDHHMMSS' ? 'selected' : ''}>Compact (YYYYMMDDHHMMSS) - e.g., 20250710143022</option>
                                        <option value="YYYY-MM-DD_HH-MM-SS" ${currentSettings.dateFormat === 'YYYY-MM-DD_HH-MM-SS' ? 'selected' : ''}>Readable (YYYY-MM-DD_HH-MM-SS) - e.g., 2025-07-10_14-30-22</option>
                                        <option value="ISO" ${currentSettings.dateFormat === 'ISO' ? 'selected' : ''}>ISO (YYYY-MM-DDTHH-MM-SS) - e.g., 2025-07-10T14-30-22</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Tab 3: Archive Settings -->
                        <div class="claude-tab-content" id="tab-archive">
                            <div class="claude-settings-section">
                                <h3>📦 Single Export Archive Settings</h3>
                                <p class="claude-settings-description">These settings affect only single conversation exports, NOT mass exports.</p>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="exportToArchive" ${currentSettings.exportToArchive ? 'checked' : ''}>
                                        <label for="exportToArchive">Export files to ZIP archive</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, single conversation exports will be packaged into a ZIP archive.</p>
                                </div>

                                <div class="claude-setting-group claude-conditional" data-depends="exportToArchive" style="display: ${currentSettings.exportToArchive ? 'block' : 'none'};">
                                    <label for="archiveName">Archive filename template:</label>
                                    <input type="text" id="archiveName" value="${currentSettings.archiveName}" placeholder="${defaultSettings.archiveName}">
                                    <p class="claude-settings-help">Available variables: {timestamp}, {created_date}, {created_time}, {updated_date}, {updated_time}</p>
                                </div>

                                <div class="claude-setting-group claude-conditional" data-depends="exportToArchive" style="display: ${currentSettings.exportToArchive ? 'block' : 'none'};">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="createChatFolders" ${currentSettings.createChatFolders ? 'checked' : ''}>
                                        <label for="createChatFolders">Create folders for each chat in archive</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, each conversation will be placed in its own folder within the archive.</p>
                                </div>

                                <div class="claude-setting-group claude-conditional" data-depends="createChatFolders,exportToArchive" style="display: ${currentSettings.createChatFolders && currentSettings.exportToArchive ? 'block' : 'none'};">
                                    <label for="chatFolderName">Chat folder name template:</label>
                                    <input type="text" id="chatFolderName" value="${currentSettings.chatFolderName}" placeholder="${defaultSettings.chatFolderName}">
                                    <p class="claude-settings-help">Template for folder names. Default: {conversation_title}. Available variables: {timestamp}, {created_date}, {created_time}, {updated_date}, {updated_time}, {conversationId}, {conversation_title}</p>
                                </div>
                            </div>

                            <div class="claude-settings-section" id="massExportArchiveSettings" style="display: none;">
                                <h3>📁 Mass Export Archive Settings</h3>
                                <p class="claude-settings-description">These settings are available when Claude Mass Exporter is detected and only affect mass exports.</p>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="forceArchiveForMassExport" ${currentSettings.forceArchiveForMassExport ? 'checked' : ''}>
                                        <label for="forceArchiveForMassExport">Force ZIP archive for mass exports</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, mass exports will always use ZIP archives.</p>
                                </div>

                                <div class="claude-setting-group claude-conditional" data-depends="forceArchiveForMassExport" style="display: ${currentSettings.forceArchiveForMassExport ? 'block' : 'none'};">
                                    <label for="massExportArchiveName">Mass export archive filename template:</label>
                                    <input type="text" id="massExportArchiveName" value="${currentSettings.massExportArchiveName}" placeholder="${defaultSettings.massExportArchiveName}">
                                    <p class="claude-settings-help">Available variables: {timestamp}, {export_type}, {created_date}, {created_time}, {updated_date}, {updated_time}</p>
                                </div>

                                <div class="claude-setting-group claude-conditional" data-depends="forceArchiveForMassExport" style="display: ${currentSettings.forceArchiveForMassExport ? 'block' : 'none'};">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="forceChatFoldersForMassExport" ${currentSettings.forceChatFoldersForMassExport ? 'checked' : ''}>
                                        <label for="forceChatFoldersForMassExport">Force chat folders for mass exports</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, mass exports will always create folders for each chat.</p>
                                </div>

                                <div class="claude-setting-group claude-conditional" data-depends="forceChatFoldersForMassExport,forceArchiveForMassExport" style="display: ${currentSettings.forceChatFoldersForMassExport && currentSettings.forceArchiveForMassExport ? 'block' : 'none'};">
                                    <h4>📁 Chat Folder Templates by Export Type</h4>

                                    <div class="claude-setting-subgroup">
                                        <label for="massExportProjectsChatFolderName">All Projects export (from /projects page):</label>
                                        <input type="text" id="massExportProjectsChatFolderName" value="${currentSettings.massExportProjectsChatFolderName}" placeholder="${defaultSettings.massExportProjectsChatFolderName}">
                                        <p class="claude-settings-help">Template for exporting all projects. Example: {project_name}/{conversation_title}</p>
                                    </div>

                                    <div class="claude-setting-subgroup">
                                        <label for="massExportSingleChatFolderName">Single Project & Recent Conversations export:</label>
                                        <input type="text" id="massExportSingleChatFolderName" value="${currentSettings.massExportSingleChatFolderName}" placeholder="${defaultSettings.massExportSingleChatFolderName}">
                                        <p class="claude-settings-help">Template for exporting from /project/xxx and /recents pages. Example: {conversation_title} or {created_date}/{conversation_title}</p>
                                    </div>

                                    <p class="claude-settings-help">Available variables for all templates: {timestamp}, {created_date}, {created_time}, {updated_date}, {updated_time}, {conversationId}, {conversation_title}, {project_name}, {project_id}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Tab 4: Export Menu -->
                        <div class="claude-tab-content" id="tab-menu">
                            <div class="claude-settings-section">
                                <h3>📋 Export Menu Options</h3>
                                <p class="claude-settings-description">Control which export options appear in the Tampermonkey menu. All options are enabled by default.</p>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="enableConversationOnly" ${currentSettings.enableConversationOnly ? 'checked' : ''}>
                                        <label for="enableConversationOnly">📄 Export Conversation Only</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, shows "Export Conversation Only" option in the menu.</p>
                                </div>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="enableFinalArtifacts" ${currentSettings.enableFinalArtifacts ? 'checked' : ''}>
                                        <label for="enableFinalArtifacts">📁 Export Conversation + Final Artifacts</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, shows "Export Conversation + Final Artifacts" option in the menu.</p>
                                </div>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="enableAllArtifacts" ${currentSettings.enableAllArtifacts ? 'checked' : ''}>
                                        <label for="enableAllArtifacts">📁 Export Conversation + All Artifacts</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, shows "Export Conversation + All Artifacts" option in the menu.</p>
                                </div>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="enableLatestPerMessage" ${currentSettings.enableLatestPerMessage ? 'checked' : ''}>
                                        <label for="enableLatestPerMessage">📁 Export Conversation + Latest Artifacts Per Message</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, shows "Export Conversation + Latest Artifacts Per Message" option in the menu.</p>
                                </div>

                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="enableMainBranchOnly" ${currentSettings.enableMainBranchOnly ? 'checked' : ''}>
                                        <label for="enableMainBranchOnly">🌿 Export Main Branch Only</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, shows "Export Main Branch Only" option in the menu.</p>
                                </div>
                            </div>

                            <div class="claude-settings-section">
                                <h3>🔧 Raw API Export</h3>
                                <div class="claude-setting-group">
                                    <div class="claude-checkbox-group">
                                        <input type="checkbox" id="enableRawApiExport" ${currentSettings.enableRawApiExport ? 'checked' : ''}>
                                        <label for="enableRawApiExport">🔧 Export Raw API Data</label>
                                    </div>
                                    <p class="claude-settings-help">When enabled, shows "Export Raw API Data" option in the menu. Exports conversation data as received from Claude API in JSON format.</p>
                                </div>

                                <div class="claude-setting-group claude-conditional" data-depends="enableRawApiExport" style="display: ${currentSettings.enableRawApiExport ? 'block' : 'none'};">
                                    <label for="rawApiExportFormat">JSON format:</label>
                                    <select id="rawApiExportFormat">
                                        <option value="pretty" ${currentSettings.rawApiExportFormat === 'pretty' ? 'selected' : ''}>
                                            📋 Pretty - Formatted with indentation
                                        </option>
                                        <option value="compact" ${currentSettings.rawApiExportFormat === 'compact' ? 'selected' : ''}>
                                            📦 Compact - Minified (smaller file)
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="claude-settings-footer">
                        <button class="claude-btn claude-btn-secondary" type="button" id="resetDefaults">🔄 Reset to Defaults</button>
                        <div class="claude-btn-group">
                            <button class="claude-btn claude-btn-secondary" type="button" id="cancelSettings">Cancel</button>
                            <button class="claude-btn claude-btn-primary" type="button" id="saveSettings">💾 Save Settings</button>
                        </div>

                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Returns compressed CSS styles for settings UI
     */
    function getSettingsStyles() {
        return `<style id="claude-exporter-styles">
            .claude-settings-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:99999;font-family:system-ui,-apple-system,sans-serif}
            .claude-settings-modal{background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.3);width:90%;max-width:800px;max-height:90vh;overflow:hidden;display:flex;flex-direction:column}
            .claude-settings-header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:20px 24px;display:flex;align-items:center;justify-content:space-between}
            .claude-settings-header h2{margin:0;font-size:20px;font-weight:600}
            .claude-settings-close{background:none;border:none;color:white;font-size:24px;cursor:pointer;padding:0;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background-color 0.2s}
            .claude-settings-close:hover{background:rgba(255,255,255,0.2)}
            .claude-tabs-nav{display:flex;background:#f8fafc;border-bottom:1px solid #e2e8f0}
            .claude-tab-btn{background:none;border:none;padding:16px 20px;font-size:14px;font-weight:500;color:#64748b;cursor:pointer;border-bottom:3px solid transparent;transition:all 0.2s;flex:1;text-align:center}
            .claude-tab-btn:hover{background:rgba(102,126,234,0.1);color:#475569}
            .claude-tab-btn.active{color:#667eea;background:white;border-bottom-color:#667eea}
            .claude-tab-content{display:none}.claude-tab-content.active{display:block}
            .claude-settings-content{flex:1;overflow-y:auto;padding:24px}
            .claude-settings-section{margin-bottom:32px}.claude-settings-section:last-child{margin-bottom:0}
            .claude-settings-section h3{margin:0 0 12px 0;font-size:18px;font-weight:600;color:#2d3748}
            .claude-settings-section h4{margin:0 0 12px 0;font-size:16px;font-weight:600;color:#2d3748}
            .claude-settings-description{margin:0 0 20px 0;color:#718096;font-size:14px;line-height:1.5}
            .claude-variables-toggle{color:#667eea;text-decoration:none;font-weight:500}.claude-variables-toggle:hover{text-decoration:underline}
            .claude-variables-panel{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:16px 0}
            .claude-variables-panel h4{margin:0 0 12px 0;font-size:14px;font-weight:600;color:#2d3748}
            .claude-variables-grid{display:grid;gap:8px}
            .claude-variable-item{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:start}
            .claude-variable-name{background:#e2e8f0;color:#2d3748;padding:2px 6px;border-radius:4px;font-family:'Monaco','Menlo',monospace;font-size:13px;white-space:nowrap}
            .claude-variable-desc{font-size:13px;color:#718096;line-height:1.4}
            .claude-setting-group{margin-bottom:20px}
            .claude-setting-subgroup{margin-bottom:16px;padding-left:16px;border-left:3px solid #e2e8f0}
            .claude-setting-group label,.claude-setting-subgroup label{display:block;margin-bottom:6px;font-weight:500;color:#2d3748;font-size:14px}
            .claude-setting-group input,.claude-setting-group select,.claude-setting-subgroup input{width:100%;padding:10px 12px;border:2px solid #e2e8f0;border-radius:6px;font-size:14px;transition:border-color 0.2s,box-shadow 0.2s;box-sizing:border-box}
            .claude-setting-group input[type="text"],.claude-setting-subgroup input[type="text"]{font-family:'Monaco','Menlo',monospace}
            .claude-checkbox-group{display:flex;align-items:center;gap:10px;margin-bottom:8px}
            .claude-checkbox-group input[type="checkbox"]{width:auto;margin:0;transform:scale(1.2)}
            .claude-checkbox-group label{margin:0;cursor:pointer;font-weight:500}
            .claude-settings-help{margin:8px 0 0 0;font-size:13px;color:#718096;line-height:1.4}
            .claude-setting-group input:focus,.claude-setting-group select:focus,.claude-setting-subgroup input:focus{outline:none;border-color:#667eea;box-shadow:0 0 0 3px rgba(102,126,234,0.1)}
            .claude-preview{margin-top:8px;padding:8px 12px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:6px;font-family:'Monaco','Menlo',monospace;font-size:13px;color:#0369a1;word-break:break-all}
            .claude-export-behavior-info{background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:16px;margin-top:20px}
            .claude-export-behavior-info h4{margin:0 0 12px 0;font-size:14px;font-weight:600;color:#0369a1}
            .claude-behavior-grid{display:grid;gap:8px}
            .claude-behavior-item{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:start}
            .claude-behavior-item strong{font-size:13px;color:#0369a1;white-space:nowrap}
            .claude-behavior-item span{font-size:13px;color:#374151;line-height:1.4}
            .claude-settings-footer{background:#f8fafc;padding:20px 24px;border-top:1px solid #e2e8f0;display:flex;align-items:center;justify-content:space-between}
            .claude-btn{padding:10px 20px;border:none;border-radius:6px;font-size:14px;font-weight:500;cursor:pointer;transition:all 0.2s;text-decoration:none;display:inline-flex;align-items:center;gap:6px}
            .claude-btn-primary{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white}
            .claude-btn-primary:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(102,126,234,0.4)}
            .claude-btn-secondary{background:#e2e8f0;color:#2d3748}.claude-btn-secondary:hover{background:#cbd5e0}
            .claude-btn-group{display:flex;gap:12px}
            @media (max-width:600px){.claude-settings-modal{width:95%;margin:20px}.claude-settings-footer{flex-direction:column;gap:12px}.claude-btn-group{width:100%}.claude-btn{flex:1;justify-content:center}.claude-tabs-nav{flex-direction:column}.claude-tab-btn{flex:none}}
            @media (prefers-color-scheme: dark){.claude-setting-group input,.claude-setting-group select,.claude-setting-subgroup input{color:#1f2937!important}.claude-setting-group select option{color:#1f2937!important}}
        </style>`;
    }

    function initTabs() {
        document.querySelectorAll('.claude-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                document.querySelectorAll('.claude-tab-btn, .claude-tab-content').forEach(el => el.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById(`tab-${targetTab}`).classList.add('active');
            });
        });
    }

    function initEventListeners() {
        // Check for mass exporter and show/hide settings
        const massExportSettings = document.getElementById('massExportArchiveSettings');
        if (typeof window.claudeMassExporter !== 'undefined') {
            massExportSettings.style.display = 'block';
        }

        setupConditionalSettings();
        setupFormElementListeners();
        setupVariablesPanel();
        setupControlButtons();
        setupModalHandlers();
    }

    function setupConditionalSettings() {
        function updateConditionalElements() {
            const exportToArchive = document.getElementById('exportToArchive').checked;
            const createChatFolders = document.getElementById('createChatFolders').checked;
            const forceArchive = document.getElementById('forceArchiveForMassExport').checked;
            const forceChatFolders = document.getElementById('forceChatFoldersForMassExport').checked;
            const enableRawApi = document.getElementById('enableRawApiExport').checked;

            document.querySelectorAll('[data-depends="exportToArchive"]').forEach(el => {
                el.style.display = exportToArchive ? 'block' : 'none';
            });

            document.querySelectorAll('[data-depends="createChatFolders,exportToArchive"]').forEach(el => {
                el.style.display = (createChatFolders && exportToArchive) ? 'block' : 'none';
            });

            document.querySelectorAll('[data-depends="forceArchiveForMassExport"]').forEach(el => {
                el.style.display = forceArchive ? 'block' : 'none';
            });

            document.querySelectorAll('[data-depends="forceChatFoldersForMassExport,forceArchiveForMassExport"]').forEach(el => {
                el.style.display = (forceChatFolders && forceArchive) ? 'block' : 'none';
            });

            document.querySelectorAll('[data-depends="enableRawApiExport"]').forEach(el => {
                el.style.display = enableRawApi ? 'block' : 'none';
            });
        }

        ['exportToArchive', 'createChatFolders', 'forceArchiveForMassExport', 'forceChatFoldersForMassExport', 'enableRawApiExport'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', updateConditionalElements);
        });

        updateConditionalElements();
    }

    function setupFormElementListeners() {
        const formElements = ['conversationTemplate', 'artifactTemplate', 'dateFormat', 'artifactExportMode',
                             'excludeCanceledArtifacts', 'conversationOnlyArtifactMode', 'includeArtifactMetadata',
                             'excludeAttachments', 'removeDoubleNewlinesFromConversation', 'removeDoubleNewlinesFromMarkdown',
                             'includeParentMessageUuid', 'conversationSortMode', 'exportToArchive',
                             'createChatFolders', 'archiveName', 'chatFolderName',
                             'forceArchiveForMassExport', 'forceChatFoldersForMassExport', 'massExportArchiveName',
                             'massExportProjectsChatFolderName', 'massExportSingleChatFolderName',
                             'useCurrentLeafForMainBranch', 'exportOnlyCurrentBranch','mainBranchOnlyIncludeAllMessages',
                             'enableConversationOnly', 'enableFinalArtifacts', 'enableAllArtifacts',
                             'enableLatestPerMessage', 'enableMainBranchOnly', 'enableRawApiExport', 'rawApiExportFormat'];

        formElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener(element.type === 'checkbox' ? 'change' : 'input', updatePreviews);
            }
        });
    }

    function setupVariablesPanel() {
        document.querySelector('.claude-variables-toggle').addEventListener('click', (e) => {
            e.preventDefault();
            const panel = document.querySelector('.claude-variables-panel');
            const isVisible = panel.style.display !== 'none';
            panel.style.display = isVisible ? 'none' : 'block';
            e.target.textContent = isVisible ? 'Show available variables' : 'Hide available variables';
        });
    }

    function setupControlButtons() {
        document.getElementById('resetDefaults').addEventListener('click', () => {
            if (confirm('Reset all settings to defaults?')) {
                Object.entries(defaultSettings).forEach(([key, value]) => {
                    const element = document.getElementById(key);
                    if (element) {
                        element.type === 'checkbox' ? element.checked = value : element.value = value;
                    }
                });
                updatePreviews();
            }
        });

        document.getElementById('saveSettings').addEventListener('click', () => {
            const newSettings = {};
            Object.keys(defaultSettings).forEach(key => {
                const element = document.getElementById(key);
                if (element) {
                    newSettings[key] = element.type === 'checkbox' ? element.checked : element.value;
                }
            });

            saveSettings(newSettings);
            showNotification('Settings saved successfully!', 'success');
            closeModal();
        });
    }

    function setupModalHandlers() {
        document.getElementById('cancelSettings').addEventListener('click', closeModal);
        document.querySelector('.claude-settings-close').addEventListener('click', closeModal);

        document.querySelector('.claude-settings-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('claude-settings-overlay')) closeModal();
        });
    }

    function closeModal() {
        document.getElementById('claude-exporter-settings')?.remove();
        document.getElementById('claude-exporter-styles')?.remove();
    }

    function updatePreviews() {
        const conversationTemplate = document.getElementById('conversationTemplate').value;
        const artifactTemplate = document.getElementById('artifactTemplate').value;
        const dateFormat = document.getElementById('dateFormat').value;
        const artifactExportMode = document.getElementById('artifactExportMode').value;
        const conversationOnlyArtifactMode = document.getElementById('conversationOnlyArtifactMode').value;
        const mainBranchOnlyIncludeAllMessages = document.getElementById('mainBranchOnlyIncludeAllMessages').checked;

        // Sample data for preview
        const sampleTime = new Date();

        const sampleVariables = createTemplateVariables({
            '{timestamp}': formatTimestamp(sampleTime, dateFormat),
            '{conversationId}': '12dasdh1-fa1j-f213-da13-dfa3124123ff',
            '{conversation_title}': 'ConversationTitle',
            '{artifact_title}': 'ArtifactTitle',
            '{artifactId}': 'artifact2',
            '{version}': '3',
            '{branch}': '2',
            '{main_suffix}': '_main',
            '{command}': 'create',
            '{extension}': '.js',
            '{canceled}': '_canceled',

            // Add all time variables
            ...createStandardTemplateVariables({
                created_at: sampleTime.toISOString(),
                updated_at: sampleTime.toISOString(),
                uuid: '12dasdh1-fa1j-f213-da13-dfa3124123ff',
                name: 'ConversationTitle'
            })
        });

        document.getElementById('conversationPreview').textContent = 'Preview: ' + applyTemplate(conversationTemplate, sampleVariables);
        document.getElementById('artifactPreview').textContent = 'Preview: ' + applyTemplate(artifactTemplate, sampleVariables);

        // Update behavior descriptions
        updateBehaviorDescriptions(artifactExportMode, conversationOnlyArtifactMode, mainBranchOnlyIncludeAllMessages);
    }

    function updateBehaviorDescriptions(artifactExportMode, conversationOnlyArtifactMode, mainBranchOnlyIncludeAllMessages) {
        const behaviors = {
            conversationOnlyBehavior: {
                'none': 'Pure conversation without artifacts',
                'final': 'Embeds final artifacts in conversation file',
                'all': 'Embeds all artifacts in conversation file',
                'latest_per_message': 'Embeds latest artifacts per message in conversation file',
                'main_branch_only': mainBranchOnlyIncludeAllMessages ? 'All messages + main branch artifacts in conversation file' : 'Main branch messages + main branch artifacts in conversation file'
            }[conversationOnlyArtifactMode],

            finalArtifactsBehavior: {
                'embed': 'Embeds final artifacts in conversation file only',
                'files': 'Pure conversation + final artifacts as separate files',
                'both': 'Embeds final artifacts in conversation + exports as separate files'
            }[artifactExportMode],

            allArtifactsBehavior: {
                'embed': 'Embeds all artifacts in conversation file only',
                'files': 'Pure conversation + all artifacts as separate files',
                'both': 'Embeds all artifacts in conversation + exports as separate files'
            }[artifactExportMode],

            latestPerMessageBehavior: {
                'embed': 'Embeds latest artifacts per message in conversation file only',
                'files': 'Pure conversation + latest artifacts per message as separate files',
                'both': 'Embeds latest artifacts per message in conversation + exports as separate files'
            }[artifactExportMode],

            mainBranchOnlyBehavior: (() => {
                const messageMode = mainBranchOnlyIncludeAllMessages ? 'All messages' : 'Main branch messages';
                return {
                    'embed': `${messageMode} + main branch artifacts in conversation file only`,
                    'files': `${messageMode} pure conversation  + main branch artifacts as separate files`,
                    'both': `${messageMode} + main branch artifacts in conversation + exports as separate files`
                }[artifactExportMode];
            })()
        };

        Object.entries(behaviors).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
            }
        });
    }

    // =============================================
    // UTILITY FUNCTIONS
    // =============================================

    // BASIC UTILITIES
    /**
     * Sanitizes filename by removing invalid characters and limiting length
     */
    function sanitizeFileName(name) {
        return name.replace(/[\\/:*?"<>|]/g, '_')
                  .replace(/\s+/g, '_')
                  .replace(/__+/g, '_')
                  .replace(/^_+|_+$/g, '')
                  .slice(0, 100);
    }

    /**
     * Formats date string to localized format
     */
    function formatDate(dateInput) {
        if (!dateInput) return '';
        const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
        return date.toLocaleString();
    }

    /**
     * Downloads content as a file using browser's download functionality
     */
    function downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
    }

    // NOTIFICATION FUNCTIONS
    /**
     * Wraps async functions with error handling
     */
    async function withErrorHandling(asyncFn, operationName) {
        try {
            return await asyncFn();
        } catch (error) {
            console.error(`[Claude API Exporter] ${operationName} failed:`, error);
            showNotification(`${operationName} failed: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Shows temporary notification to the user
     * @param {string} message - Message to display
     * @param {string} type - Type of notification (info, success, error)
     */
    function showNotification(message, type = "info") {
        // Remove any existing notifications to avoid overlap
        document.querySelectorAll('.claude-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'claude-notification';
        const colors = {
            error: '#f44336',
            success: '#4CAF50',
            info: '#2196F3'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 14px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            background-color: ${colors[type] || colors.info};
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Generates appropriate notification message based on export results
     */
    function generateExportNotification(exportResult, exportData) {
        const { totalExported, artifactCount, archiveUsed } = exportResult;
        const { settings, mode } = exportData;

        if (archiveUsed) {
            // Archive mode notifications
            if (artifactCount > 0) {
                return `Archive export completed! Downloaded archive with conversation + ${artifactCount} artifacts (${mode})`;
            } else {
                return `Archive export completed! Downloaded archive with conversation (no artifacts found)`;
            }
        } else {
            // Regular download mode notifications
            if (settings.artifactExportMode !== 'embed' && artifactCount > 0) {
                // Has separate artifact files
                let modeText;

                if (settings.artifactExportMode === 'both') {
                    modeText = 'embedded + separate files';
                } else if (settings.artifactExportMode === 'files') {
                    modeText = 'separate files';
                } else {
                    modeText = 'embedded in conversation';
                }

                return `Export completed! Downloaded conversation + ${artifactCount} artifacts as ${modeText} (${mode})`;
            } else if (artifactCount > 0) {
                // Only embedded artifacts
                return `Export completed! Downloaded conversation with ${artifactCount} embedded artifacts (${mode})`;
            } else {
                return 'Export completed! No artifacts found in conversation';
            }
        }
    }

    // =============================================
    // ARCHIVE MANAGEMENT
    // =============================================

    /**
     * Creates and manages ZIP archive for exports
     */
    class ArchiveManager {
        constructor() {
            this.zip = null;
            this.fileCount = 0;
            this.isReady = false;
        }

        async initialize() {
            if (this.isReady) return;

            // console.log('[Claude API Exporter] Initializing ArchiveManager...');
            await loadJSZip();
            this.zip = new JSZip();
            this.isReady = true;
            // console.log('[Claude API Exporter] ArchiveManager initialized successfully');
        }

        async addFile(filename, content, useFolder = false, folderName = '') {
            if (!this.isReady) {
                await this.initialize();
            }

            let finalFilename = filename;

            if (useFolder && folderName) {
                finalFilename = `${sanitizeFileName(folderName)}/${filename}`;
            }

            // console.log(`[Claude API Exporter] Adding file to archive: ${finalFilename}`);
            this.zip.file(finalFilename, content);
            this.fileCount++;
            // console.log(`[Claude API Exporter] File added. Total files: ${this.fileCount}`);
        }

        async downloadArchive(archiveName) {
            if (!this.isReady) {
                throw new Error('ArchiveManager not initialized');
            }

            if (this.fileCount === 0) {
                throw new Error('No files to archive');
            }

            console.log(`[Claude API Exporter] Creating archive with ${this.fileCount} files...`);
            showNotification(`Creating archive with ${this.fileCount} files...`, 'info');

            try {
                // console.log('[Claude API Exporter] Generating ZIP blob...');
                const zipBlob = await this.zip.generateAsync({
                    type: "blob",
                    compression: "DEFLATE",
                    compressionOptions: { level: 6 }
                });

                console.log('[Claude API Exporter] ZIP generated successfully, size:', zipBlob.size);

                const url = URL.createObjectURL(zipBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = archiveName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // console.log('[Claude API Exporter] Archive download initiated');

                // Cleanup
                setTimeout(() => {
                    URL.revokeObjectURL(url);
                    // console.log('[Claude API Exporter] Archive cleanup completed');
                }, 1000);

            } catch (error) {
                console.error('[Claude API Exporter] Archive generation failed:', error);
                throw new Error(`Archive generation failed: ${error.message}`);
            }
        }
    }

    /**
     * Enhanced download function that supports both regular and archive modes
     */
    async function downloadFileEnhanced(filename, content, archiveManager = null, createFolder = false) {
        if (archiveManager) {
            await archiveManager.addFile(filename, content, createFolder);
        } else {
            downloadFile(filename, content);
        }
    }

    /**
     * Helper to add file to archive with folder support
     */
    async function addFileToArchive(archiveManager, filename, content, conversationData, settings, projectData = null) {
        if (!archiveManager) {
            downloadFile(filename, content);
            return;
        }

        const shouldUseFolder = settings.createChatFolders;
        let folderName = '';

        if (shouldUseFolder) {
            folderName = generateChatFolderName(conversationData, projectData, settings.chatFolderName);
        }

        console.log(`[Claude API Exporter] Adding file to archive: ${filename}`);
        await archiveManager.addFile(filename, content, shouldUseFolder, folderName);
    }

    // =============================================
    // API FUNCTIONS
    // =============================================

    /**
     * Extracts conversation ID from current URL
     */
    function getConversationId() {
        const match = window.location.pathname.match(/\/chat\/([^/?]+)/);
        return match ? match[1] : null;
    }

    /**
     * Gets organization ID from browser cookies
     */
    function getOrgId() {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'lastActiveOrg') {
                return value;
            }
        }
        throw new Error('Could not find organization ID');
    }

    /**
     * Fetches conversation data from Claude API
     */
    async function getConversationData(conversationId = null) {
        const id = conversationId || getConversationId();
        if (!id) {
            return null;
        }

        const orgId = getOrgId();
        const settings = loadSettings();

        // Use tree=false if user wants only current branch
        const treeParam = settings.exportOnlyCurrentBranch ? 'false' : 'true';

        const response = await fetch(`/api/organizations/${orgId}/chat_conversations/${id}?tree=${treeParam}&rendering_mode=messages&render_all_tools=true`);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
    }

    // =============================================
    // MASS EXPORT DETECTION
    // =============================================

    /**
     * Checks if current context supports mass export and handles it
     */
    function checkAndHandleMassExport(finalVersionsOnly, latestPerMessage, mainBranchOnly) {
        const path = window.location.pathname;
        let context = null;

        if (path === '/projects') {
            context = { type: 'projects', title: 'All Projects' };
        } else if (path.match(/^\/project\/[^/]+$/)) {
            context = { type: 'project', title: 'Current Project', projectId: path.split('/')[2] };
        } else if (path === '/recents') {
            context = { type: 'recents', title: 'Recent Conversations' };
        } else if (path === '/new') {
            context = { type: 'recents', title: 'Recent Conversations' };
        }

        if (context && typeof window.claudeMassExporter !== 'undefined') {
            console.log(`[Claude API Exporter] Mass export mode detected: ${context.title}`);

            let exportMode = 'all';
            if (latestPerMessage) {
                exportMode = 'latest_per_message';
            } else if (finalVersionsOnly) {
                exportMode = 'final';
            }

            if (context.type === 'projects') {
                return window.claudeMassExporter.exportAllProjects(exportMode, mainBranchOnly);
            } else if (context.type === 'project') {
                return window.claudeMassExporter.exportCurrentProject(exportMode, mainBranchOnly);
            } else if (context.type === 'recents') {
                return window.claudeMassExporter.exportAllRecentConversations(exportMode, mainBranchOnly);
            }
        }

        return null;
    }

    /**
     * Checks if current context supports mass export for conversation only
     */
    function checkAndHandleMassExportConversationOnly() {
        const path = window.location.pathname;
        let context = null;

        if (path === '/projects') {
            context = { type: 'projects', title: 'All Projects' };
        } else if (path.match(/^\/project\/[^/]+$/)) {
            context = { type: 'project', title: 'Current Project', projectId: path.split('/')[2] };
        } else if (path === '/recents') {
            context = { type: 'recents', title: 'Recent Conversations' };
        } else if (path === '/new') {
            context = { type: 'recents', title: 'Recent Conversations' };
        }

        if (context && typeof window.claudeMassExporter !== 'undefined') {
            console.log(`[Claude API Exporter] Mass export mode detected: ${context.title}`);

            if (context.type === 'projects') {
                return window.claudeMassExporter.exportAllProjects('none', false);
            } else if (context.type === 'project') {
                return window.claudeMassExporter.exportCurrentProject('none', false);
            } else if (context.type === 'recents') {
                return window.claudeMassExporter.exportAllRecentConversations('none', false);
            }
        }

        return null;
    }

    /**
     * Checks if current context supports mass export for raw API data
     */
    function checkAndHandleMassExportRawApi() {
        const path = window.location.pathname;

        if (path === '/projects' && typeof window.claudeMassExporter !== 'undefined') {
            return window.claudeMassExporter.exportAllProjects('final', false, true); // rawApiMode = true
        } else if (path.match(/^\/project\/[^/]+$/) && typeof window.claudeMassExporter !== 'undefined') {
            return window.claudeMassExporter.exportCurrentProject('final', false, true); // rawApiMode = true
        } else if (path === '/recents' && typeof window.claudeMassExporter !== 'undefined') {
            return window.claudeMassExporter.exportAllRecentConversations('final', false, true); // rawApiMode = true
        } else if (path === '/new' && typeof window.claudeMassExporter !== 'undefined') {
            return window.claudeMassExporter.exportAllRecentConversations('final', false, true); // rawApiMode = true
        }

        return null;
    }

    // =============================================
    // FILE EXTENSION FUNCTIONS
    // =============================================

    /**
     * Gets appropriate file extension based on artifact type and language
     * @param {string} type - Artifact MIME type
     * @param {string} language - Programming language (for code artifacts)
     * @returns {string} File extension including the dot
     */
    function getFileExtension(type, language) {
        switch (type) {
            case 'application/vnd.ant.code':
                return getCodeExtension(language);
            case 'text/html':
                return '.html';
            case 'text/markdown':
                return '.md';
            case 'image/svg+xml':
                return '.svg';
            case 'application/vnd.ant.mermaid':
                return '.mmd';
            case 'application/vnd.ant.react':
                return '.jsx';
            case undefined:
            default:
                return '.txt';
        }
    }

    /**
     * Maps programming language names to file extensions
     * @param {string} language - Programming language name
     * @returns {string} File extension including the dot
     */
    function getCodeExtension(language) {
        const extensionMap = {
            // Web languages
            'javascript': '.js', 'typescript': '.ts', 'html': '.html', 'css': '.css', 'scss': '.scss', 'sass': '.sass', 'less': '.less', 'jsx': '.jsx', 'tsx': '.tsx', 'vue': '.vue',

            // Languages
            'python': '.py', 'java': '.java', 'csharp': '.cs', 'c#': '.cs', 'cpp': '.cpp', 'c++': '.cpp', 'c': '.c', 'go': '.go', 'rust': '.rs', 'swift': '.swift', 'kotlin': '.kt', 'dart': '.dart', 'php': '.php', 'ruby': '.rb', 'perl': '.pl', 'lua': '.lua',

            // Functional languages
            'haskell': '.hs', 'clojure': '.clj', 'erlang': '.erl', 'elixir': '.ex', 'fsharp': '.fs', 'f#': '.fs', 'ocaml': '.ml', 'scala': '.scala', 'lisp': '.lisp',

            // Data and config
            'json': '.json', 'yaml': '.yaml', 'yml': '.yml', 'xml': '.xml', 'toml': '.toml', 'ini': '.ini', 'csv': '.csv',

            // Query languages
            'sql': '.sql', 'mysql': '.sql', 'postgresql': '.sql', 'sqlite': '.sql', 'plsql': '.sql',

            // Shell and scripting
            'bash': '.sh', 'shell': '.sh', 'sh': '.sh', 'zsh': '.zsh', 'fish': '.fish', 'powershell': '.ps1', 'batch': '.bat', 'cmd': '.cmd',

            // Scientific and specialized
            'r': '.r', 'matlab': '.m', 'julia': '.jl', 'fortran': '.f90', 'cobol': '.cob', 'assembly': '.asm', 'vhdl': '.vhd', 'verilog': '.v',

            // Build and config files
            'dockerfile': '.dockerfile', 'makefile': '.mk', 'cmake': '.cmake', 'gradle': '.gradle', 'maven': '.xml',

            // Markup and documentation
            'markdown': '.md', 'latex': '.tex', 'restructuredtext': '.rst', 'asciidoc': '.adoc',

            // Other
            'regex': '.regex', 'text': '.txt', 'plain': '.txt'
        };

        const normalizedLanguage = language ? language.toLowerCase().trim() : '';
        return extensionMap[normalizedLanguage] || '.txt';
    }

    /**
     * Gets comment style for a programming language
     * @param {string} type - Artifact MIME type
     * @param {string} language - Programming language
     * @returns {Object} Comment style object with start and end strings
     */
    function getCommentStyle(type, language) {
        if (type === 'text/html' || type === 'image/svg+xml') {
            return { start: '<!-- ', end: ' -->' };
        }

        if (type !== 'application/vnd.ant.code') {
            return { start: '# ', end: '' }; // Default to hash comments
        }

        const normalizedLanguage = language ? language.toLowerCase().trim() : '';

        // Define comment patterns
        const commentPatterns = {
            // Languages with // comments
            slash: ['javascript', 'typescript', 'java', 'csharp', 'c#', 'cpp', 'c++', 'c', 'go', 'rust', 'swift', 'kotlin', 'dart', 'php', 'scala', 'jsx', 'tsx'],

            // Languages with # comments
            hash: ['python', 'ruby', 'perl', 'bash', 'shell', 'sh', 'zsh', 'fish', 'yaml', 'yml', 'r', 'julia', 'toml', 'ini', 'powershell'],

            // Languages with -- comments
            dash: ['sql', 'mysql', 'postgresql', 'sqlite', 'plsql', 'haskell', 'lua']
        };

        if (commentPatterns.slash.includes(normalizedLanguage)) {
            return { start: '// ', end: '' };
        } else if (commentPatterns.hash.includes(normalizedLanguage)) {
            return { start: '# ', end: '' };
        } else if (commentPatterns.dash.includes(normalizedLanguage)) {
            return { start: '-- ', end: '' };
        }

        return { start: '# ', end: '' }; // Default to hash comments
    }

    /**
     * Gets language identifier for markdown syntax highlighting
     */
    function getLanguageForHighlighting(type, language) {
        const typeMap = {
            'text/html': 'html',
            'text/markdown': 'markdown',
            'image/svg+xml': 'xml',
            'application/vnd.ant.mermaid': 'mermaid',
            'application/vnd.ant.react': 'jsx'
        };

        if (typeMap[type]) return typeMap[type];

        if (type === 'application/vnd.ant.code' && language) {
            const normalizedLanguage = language.toLowerCase().trim();

            // Map some languages to their markdown equivalents
            const languageMap = {
                'c++': 'cpp', 'c#': 'csharp', 'f#': 'fsharp',
                'objective-c': 'objc', 'shell': 'bash', 'sh': 'bash'
            };

            return languageMap[normalizedLanguage] || normalizedLanguage;
        }

        return '';
    }

    // =============================================
    // BRANCH HANDLING FUNCTIONS
    // =============================================

    /**
     * Builds conversation tree structure to understand message branches
     * @param {Array} messages - Array of chat messages
     * @returns {Object} Tree structure with branch information
     */
    function buildConversationTree(messages) {
        const messageMap = new Map();
        const rootMessages = [];

        // Create message map
        messages.forEach(message => {
            messageMap.set(message.uuid, {
                ...message,
                children: [],
                branchId: null,
                branchIndex: null
            });
        });

        // Build parent-child relationships
        messages.forEach(message => {
            const messageNode = messageMap.get(message.uuid);
            if (message.parent_message_uuid && messageMap.has(message.parent_message_uuid)) {
                const parent = messageMap.get(message.parent_message_uuid);
                parent.children.push(messageNode);
            } else {
                rootMessages.push(messageNode);
            }
        });

        return { messageMap, rootMessages };
    }

    /**
     * Finds the main path using current settings
     */
    function findMainBranchPath(tree, conversationData = null) {
        const settings = loadSettings();

        if (settings.useCurrentLeafForMainBranch && conversationData && conversationData.current_leaf_message_uuid) {
            // Use current_leaf_message_uuid to build main path
            return buildPathFromLeafMessage(tree, conversationData.current_leaf_message_uuid);
        } else {
            // Use existing logic (max index)
            return buildPathFromMaxIndex(tree);
        }
    }

    function buildPathFromLeafMessage(tree, currentLeafUuid) {
        const mainPath = [];
        let currentMessage = tree.messageMap.get(currentLeafUuid);

        while (currentMessage) {
            mainPath.unshift(currentMessage); // Add to beginning

            const parentUuid = currentMessage.parent_message_uuid;
            if (parentUuid === "00000000-0000-4000-8000-000000000000" || !parentUuid) {
                break;
            }

            currentMessage = tree.messageMap.get(parentUuid);
        }

        return mainPath;
    }

    /**
     * Finds main branch path from message with maximum index
     */
    function buildPathFromMaxIndex(tree) {
        // Find message with maximum index
        let maxIndexMessage = null;
        let maxIndex = -1;

        tree.messageMap.forEach(message => {
            if (message.index > maxIndex) {
                maxIndex = message.index;
                maxIndexMessage = message;
            }
        });

        if (!maxIndexMessage) return [];

        // Build path backwards through parent_message_uuid
        const mainPath = [];
        let currentMessage = maxIndexMessage;

        while (currentMessage) {
            mainPath.unshift(currentMessage);

            const parentUuid = currentMessage.parent_message_uuid;
            if (parentUuid === "00000000-0000-4000-8000-000000000000" || !parentUuid) {
                break;
            }

            currentMessage = tree.messageMap.get(parentUuid);
        }

        return mainPath;
    }

    /**
     * Gets all branch information including branch points
     */
    function getAllBranchInfo(tree, conversationData = null) {
        // Find main path using settings
        const mainBranchPath = findMainBranchPath(tree, conversationData);
        const mainBranchUuids = new Set(mainBranchPath.map(msg => msg.uuid));

        // Two-pass approach:
        // Pass 1: Collect all branch starting points
        const branchStartPoints = [];

        function collectBranchPoints(node) {
            if (node.children.length > 1) {
                // Multiple children = branch point
                const sortedChildren = [...node.children].sort((a, b) => a.index - b.index);

                // Skip first child (continues parent branch)
                for (let i = 1; i < sortedChildren.length; i++) {
                    branchStartPoints.push({
                        index: sortedChildren[i].index,
                        node: sortedChildren[i]
                    });
                }
            }

            // Recurse to all children
            node.children.forEach(child => collectBranchPoints(child));
        }

        // Collect branch points from all roots
        tree.rootMessages.forEach(root => collectBranchPoints(root));

        // Also add additional root messages as branch starts (if multiple roots)
        for (let i = 1; i < tree.rootMessages.length; i++) {
            branchStartPoints.push({
                index: tree.rootMessages[i].index,
                node: tree.rootMessages[i]
            });
        }

        // Sort branch start points by index
        branchStartPoints.sort((a, b) => a.index - b.index);

        // Create a map from node to branch number
        const nodeToBranchNumber = new Map();
        branchStartPoints.forEach((point, i) => {
            nodeToBranchNumber.set(point.node, i + 2); // +2 because main is 1
        });

        // Pass 2: Assign branch numbers and collect leaves
        const leafToBranchNumber = new Map();

        function assignBranch(node, currentBranchNumber) {
            // If leaf node, record its branch number
            if (node.children.length === 0) {
                leafToBranchNumber.set(node.uuid, currentBranchNumber);
                return;
            }

            if (node.children.length === 1) {
                // Single child continues current branch
                assignBranch(node.children[0], currentBranchNumber);
            } else {
                // Multiple children
                const sortedChildren = [...node.children].sort((a, b) => a.index - b.index);

                // First child continues current branch
                assignBranch(sortedChildren[0], currentBranchNumber);

                // Other children use their assigned branch numbers
                for (let i = 1; i < sortedChildren.length; i++) {
                    const child = sortedChildren[i];
                    const childBranchNumber = nodeToBranchNumber.get(child) || currentBranchNumber;
                    assignBranch(child, childBranchNumber);
                }
            }
        }

        // Start assignment from first root with branch 1
        if (tree.rootMessages.length > 0) {
            assignBranch(tree.rootMessages[0], 1);
        }

        // Assign other roots with their branch numbers
        for (let i = 1; i < tree.rootMessages.length; i++) {
            const root = tree.rootMessages[i];
            const branchNumber = nodeToBranchNumber.get(root) || 1;
            assignBranch(root, branchNumber);
        }

        // Now collect leaves with their paths and branchStartIndex (original logic for compatibility)
        const branches = [];
        const leafMessages = [];

        function collectLeaves(node, currentPath = [], branchStartIndex = 0) {
            const newPath = [...currentPath, node];

            if (node.children.length === 0) {
                leafMessages.push({
                    leaf: node,
                    fullPath: newPath,
                    branchStartIndex: branchStartIndex
                });
            } else if (node.children.length === 1) {
                collectLeaves(node.children[0], newPath, branchStartIndex);
            } else {
                // Multiple children - branch point
                // Sort children by index
                const sortedChildren = [...node.children].sort((a, b) => a.index - b.index);

                sortedChildren.forEach((child, childIndex) => {
                    // For first child, continue current branch
                    // For other children, start new branches from this point
                    const newBranchStart = childIndex === 0 ? branchStartIndex : newPath.length;
                    collectLeaves(child, newPath, newBranchStart);
                });
            }
        }

        tree.rootMessages.forEach(root => {
            collectLeaves(root, [], 0);
        });

        // Create branches using pre-assigned branch numbers
        leafMessages.forEach((leafData) => {
            const branchIndex = leafToBranchNumber.get(leafData.leaf.uuid);
            const isMainBranch = leafData.fullPath.every(msg => mainBranchUuids.has(msg.uuid)) &&
                                 leafData.fullPath.length === mainBranchPath.length;

            branches.push({
                branchId: leafData.leaf.uuid,
                branchIndex: branchIndex,
                fullPath: leafData.fullPath,
                branchStartIndex: leafData.branchStartIndex,
                isMainBranch: isMainBranch
            });
        });

        return {
            branches,
            mainBranchPath: mainBranchPath
        };
    }

    /**
     * Creates a Map of messageUuid to branch index
     */
    function createMessageBranchMap(branches) {
        const messageBranchMap = new Map();

        branches.forEach(branch => {
            branch.fullPath.forEach(msg => {
                if (!messageBranchMap.has(msg.uuid)) {
                    messageBranchMap.set(msg.uuid, branch.branchIndex);
                }
            });
        });

        return messageBranchMap;
    }

    // =============================================
    // CONVERSATION PROCESSING
    // =============================================

    /**
     * Builds version information for messages with alternatives (same parent)
     * @param {Array} messages - Array of chat messages
     * @returns {Map} Map of message UUID to version info {version, total}
     */
    function buildVersionInfo(messages) {
        const settings = loadSettings();
        const versionInfo = new Map();

        // Group messages by parent_message_uuid
        const parentGroups = new Map();

        messages.forEach(message => {
            if (message.parent_message_uuid) {
                if (!parentGroups.has(message.parent_message_uuid)) {
                    parentGroups.set(message.parent_message_uuid, []);
                }
                parentGroups.get(message.parent_message_uuid).push(message);
            }
        });

        // Process groups with more than one message (alternatives)
        parentGroups.forEach((siblings, parentUuid) => {
            if (siblings.length > 1) {
                // Sort by created_at to determine version numbers
                siblings.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                siblings.forEach((message, index) => {
                    versionInfo.set(message.uuid, {
                        version: index + 1,
                        total: siblings.length
                    });
                });
            }
        });

        return versionInfo;
    }

    /**
     * Filters conversation data for main branch only
     */
    function filterConversationForMainBranch(conversationData, mainBranchUuids, settings) {
        if (!settings.mainBranchOnlyIncludeAllMessages) {
            return {
                ...conversationData,
                name: conversationData.name,
                chat_messages: conversationData.chat_messages.filter(message =>
                    mainBranchUuids && mainBranchUuids.has(message.uuid)
                )
            };
        }
        return conversationData;
    }

    /**
     * Filters artifacts for main branch only
     */
    function filterArtifactsForMainBranch(branchArtifacts, mainBranchUuids) {
        const filteredBranchArtifacts = new Map();

        for (const [branchId, artifactsMap] of branchArtifacts) {
            const filteredArtifactsMap = new Map();

            for (const [artifactId, versions] of artifactsMap) {
                const mainVersions = versions.filter(version =>
                    mainBranchUuids && mainBranchUuids.has(version.messageUuid)
                );

                if (mainVersions.length > 0) {
                    filteredArtifactsMap.set(artifactId, mainVersions);
                }
            }

            if (filteredArtifactsMap.size > 0) {
                filteredBranchArtifacts.set(branchId, filteredArtifactsMap);
            }
        }

        return filteredBranchArtifacts;
    }

    /**
     * Sorts messages based on the specified mode
     */
    function sortMessages(messages, sortMode) {
        if (sortMode === 'logical') {
            // Logical order by parent_message_uuid tree structure
            const messageMap = new Map();
            const rootMessages = [];

            messages.forEach(msg => {
                messageMap.set(msg.uuid, { ...msg, children: [] });
            });

            messages.forEach(msg => {
                if (msg.parent_message_uuid === "00000000-0000-4000-8000-000000000000") {
                    rootMessages.push(messageMap.get(msg.uuid));
                } else if (messageMap.has(msg.parent_message_uuid)) {
                    const parent = messageMap.get(msg.parent_message_uuid);
                    parent.children.push(messageMap.get(msg.uuid));
                }
            });

            function sortChildren(node) {
                if (node.children.length > 0) {
                    node.children.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                    node.children.forEach(child => sortChildren(child));
                }
            }

            rootMessages.forEach(root => sortChildren(root));

            const orderedMessages = [];
            function collectMessages(node) {
                orderedMessages.push(node);
                node.children.forEach(child => collectMessages(child));
            }

            rootMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            rootMessages.forEach(root => collectMessages(root));

            return orderedMessages;
        } else if (sortMode === 'pairs') {
            // Sort by Human → Claude pairs in chronological order
            const humanMessages = messages
                .filter(msg => msg.sender === 'human')
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

            const orderedMessages = [];
            const processed = new Set();

            humanMessages.forEach(humanMsg => {
                // Add Human message
                orderedMessages.push(humanMsg);
                processed.add(humanMsg.uuid);

                // Find all Claude responses to this Human
                const claudeResponses = messages
                    .filter(msg =>
                        msg.sender === 'assistant' &&
                        msg.parent_message_uuid === humanMsg.uuid &&
                        !processed.has(msg.uuid)
                    )
                    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                // Add Claude responses
                claudeResponses.forEach(claudeMsg => {
                    orderedMessages.push(claudeMsg);
                    processed.add(claudeMsg.uuid);
                });
            });

            return orderedMessages;
        } else {
            // Chronological order by index (current behavior)
            return messages.sort((a, b) => a.index - b.index);
        }
    }

    // =============================================
    // CONTENT PROCESSING
    // =============================================

    /**
     * Removes double newlines from text content while preserving markdown structure
     * @param {string} content - Text content to process
     * @param {boolean} removeDoubleNewlines - Whether to remove \n\n
     * @returns {string} Processed content
     */
    function processTextContent(content, removeDoubleNewlines) {
        return processContent(content, removeDoubleNewlines);
    }

    /**
     * Processes artifact content based on type and settings
     * @param {string} content - Artifact content
     * @param {string} type - Artifact type
     * @param {boolean} removeDoubleNewlines - Whether to remove \n\n
     * @returns {string} Processed content
     */
    function processArtifactContent(content, type, removeDoubleNewlines) {
        return processContent(content, removeDoubleNewlines, type);
    }

    /**
     * Unified content processing function
     */
    function processContent(content, removeDoubleNewlines, type = null) {
        if (!removeDoubleNewlines || !content) {
            return content;
        }

        // Only apply to markdown artifacts or general content
        if (!type || type === 'text/markdown') {
            return content.replace(/\n\n+/g, '\n');
        }

        return content;
    }

    /**
     * Checks if message should be skipped due to cancellation
     */
    function shouldSkipCanceledMessage(message, settings) {
        return settings.excludeCanceledArtifacts && message.stop_reason === 'user_canceled';
    }

    /**
     * Finds latest artifacts in a message
     */
    function findLatestArtifactsInMessage(message) {
        const latestInMessage = new Map();

        message.content.forEach(content => {
            if (content.type === 'tool_use' && content.name === 'artifacts' && content.input) {
                const artifactId = content.input.id;
                latestInMessage.set(artifactId, content);
            }
        });

        return latestInMessage;
    }

    // =============================================
    // ARTIFACT PROCESSING
    // =============================================

    /**
     * Extracts artifacts from messages, respecting branch boundaries
     * @param {Array} branchPath - Full path from root to leaf
     * @param {number} branchStartIndex - Index where this branch starts (for split branches)
     * @param {string} branchId - Unique identifier for this branch
     * @param {boolean} isMainBranch - Whether this is the main branch
     * @returns {Object} {ownArtifacts: Map, inheritedStates: Map}
     */
    function extractArtifacts(branchPath, branchStartIndex, branchId, isMainBranch) {
        const settings = loadSettings();

        const ownArtifacts = new Map(); // Artifacts created/modified in this branch
        const inheritedStates = new Map(); // Final states of artifacts from parent branch

        // If branchStartIndex > 0, first collect inherited states from parent path
        if (branchStartIndex > 0) {
            const parentPath = branchPath.slice(0, branchStartIndex);
            const parentArtifacts = new Map();

            // Extract artifacts from parent path
            parentPath.forEach((message, messageIndex) => {
                message.content.forEach(content => {
                    if (content.type === 'tool_use' && content.name === 'artifacts' && content.input) {
                        const input = content.input;
                        const artifactId = input.id;

                        if (!parentArtifacts.has(artifactId)) {
                            parentArtifacts.set(artifactId, []);
                        }

                        const versions = parentArtifacts.get(artifactId);
                        versions.push({
                            type: input.type,
                            title: input.title || `Artifact ${artifactId}`,
                            command: input.command,
                            content: input.content || '',
                            new_str: input.new_str || '',
                            old_str: input.old_str || '',
                            language: input.language || '',
                            timestamp_created_at: message.created_at,
                            timestamp_updated_at: message.updated_at
                        });
                    }
                });
            });

            // Build final states from parent artifacts
            parentArtifacts.forEach((versions, artifactId) => {
                let currentContent = '';
                let currentTitle = `Artifact ${artifactId}`;
                let currentType = undefined;
                let currentLanguage = '';
                let versionCount = 0;

                versions.forEach(version => {
                    versionCount++;
                    switch (version.command) {
                        case 'create':
                            currentContent = version.content;
                            currentTitle = version.title;
                            currentType = version.type;
                            currentLanguage = version.language;
                            break;
                        case 'rewrite':
                            currentContent = version.content;
                            currentTitle = version.title;
                            // Keep type and language from create
                            break;
                        case 'update':
                            const updateResult = applyUpdate(currentContent, version.old_str, version.new_str);
                            currentContent = updateResult.content;
                            break;
                    }
                });

                inheritedStates.set(artifactId, {
                    content: currentContent,
                    title: currentTitle,
                    type: currentType,
                    language: currentLanguage,
                    versionCount: versionCount
                });
            });
        }

        // Now extract artifacts from this branch only (starting from branchStartIndex)
        const branchMessages = branchPath.slice(branchStartIndex);

        branchMessages.forEach((message, relativeIndex) => {
            // User canceled message - excludeCanceledArtifacts
            // if (shouldSkipCanceledMessage(message, settings)) {
                // return; // skip this message
            // }

            message.content.forEach(content => {
                if (content.type === 'tool_use' && content.name === 'artifacts' && content.input) {
                    const input = content.input;
                    const artifactId = input.id;

                    if (!ownArtifacts.has(artifactId)) {
                        ownArtifacts.set(artifactId, []);
                    }

                    const versions = ownArtifacts.get(artifactId);

                    // Calculate version number based on inherited versions
                    let versionNumber;
                    if (isMainBranch) {
                        // Main branch: continue from inherited count if exists
                        const inheritedCount = inheritedStates.has(artifactId) ? inheritedStates.get(artifactId).versionCount : 0;
                        versionNumber = inheritedCount + versions.length + 1;
                    } else {
                        // Split branch: continue from parent version count
                        const inheritedCount = inheritedStates.has(artifactId) ? inheritedStates.get(artifactId).versionCount : 0;
                        versionNumber = inheritedCount + versions.length + 1;
                    }

                    versions.push({
                        messageUuid: message.uuid,
                        messageText: message.text,
                        version: versionNumber,
                        content_start_timestamp: content.start_timestamp,
                        content_stop_timestamp: content.stop_timestamp,
                        content_type: content.type,
                        type: input.type,
                        title: input.title || `Artifact ${artifactId}`,
                        command: input.command,
                        old_str: input.old_str || '',
                        new_str: input.new_str || '',
                        content: input.content || '',
                        uuid: input.version_uuid,
                        language: input.language || '',
                        messageIndex: branchStartIndex + relativeIndex,
                        stop_reason: message.stop_reason,
                        timestamp_created_at: message.created_at,
                        timestamp_updated_at: message.updated_at,
                        branchId: branchId,
                        artifactMessageUuid: message.uuid
                    });
                }
            });
        });

        return { ownArtifacts, inheritedStates };
    }

    /**
     * Builds complete artifact versions for a specific branch
     * @param {Map} ownArtifacts - Artifacts created/modified in this branch
     * @param {Map} inheritedStates - Final states from parent branch
     * @param {string} branchId - Branch identifier
     * @param {boolean} isMainBranch - Whether this is the main branch
     * @returns {Map} Map of artifact ID to processed versions with full content
     */
    function buildArtifactVersions(ownArtifacts, inheritedStates, branchId, isMainBranch) {
        const processedArtifacts = new Map();

        ownArtifacts.forEach((versions, artifactId) => {
            const processedVersions = [];

            // Start with inherited content if this is a branch
            let currentContent = '';
            let currentTitle = `Artifact ${artifactId}`;
            let currentType = undefined;
            let currentLanguage = '';

            if (inheritedStates.has(artifactId)) {
                const inherited = inheritedStates.get(artifactId);
                currentContent = inherited.content;
                currentTitle = inherited.title;
                currentType = inherited.type;
                currentLanguage = inherited.language;
            }

            versions.forEach((version, index) => {
                let updateInfo = '';
                let versionStartContent = currentContent;

                switch (version.command) {
                    case 'create':
                        currentContent = version.content;
                        currentTitle = version.title;
                        currentType = version.type;
                        currentLanguage = version.language;
                        break;
                    case 'rewrite':
                        currentContent = version.content;
                        currentTitle = version.title;
                        // Keep type and language from create
                        break;
                    case 'update':
                        const updateResult = applyUpdate(currentContent, version.old_str, version.new_str);

                        currentContent = updateResult.content;
                        updateInfo = updateResult.info;

                        if (!updateResult.success) {
                            updateInfo = `[WARNING: ${updateResult.info}]`;
                        }
                        break;
                    default:
                        console.warn(`Unknown command: ${version.command}`);
                        break;
                }

                const changeDescription = createChangeDescription(version);

                processedVersions.push({
                    ...version,
                    fullContent: currentContent,
                    changeDescription: updateInfo ? changeDescription : changeDescription,
                    updateInfo: updateInfo,
                    branchId: branchId,
                    isMainBranch: isMainBranch,
                    inheritedContent: versionStartContent,
                    finalType: currentType,
                    finalLanguage: currentLanguage
                });
            });

            processedArtifacts.set(artifactId, processedVersions);
        });

        return processedArtifacts;
    }

    /**
     * Applies update command to previous content by replacing old_str with new_str
     * @param {string} previousContent - Content before update
     * @param {string} oldStr - String to be replaced
     * @param {string} newStr - String to replace with
     * @returns {Object} {success: boolean, content: string, info: string}
     */
    function applyUpdate(previousContent, oldStr, newStr) {
        if (!previousContent || !oldStr) {
            // If no old_str or previousContent, prepend new_str to beginning
            if (newStr) {
                return {
                    success: true,
                    content: newStr + (previousContent ? '\n' + previousContent : ''),
                    info: '[WARNING: Added content to beginning - missing old_str or previousContent]'
                };
            }
            return {
                success: false,
                content: previousContent || '',
                info: 'Cannot apply update: missing previousContent, oldStr, and newStr'
            };
        }

        // Apply the string replacement
        const updatedContent = previousContent.replace(oldStr, newStr);

        if (updatedContent === previousContent) {
            // old_str not found - prepend new_str to beginning as fallback
            if (newStr) {
                return {
                    success: true,
                    content: newStr + '\n' + previousContent,
                    info: '[WARNING: Added content to beginning - old_str not found in content]'
                };
            }

            // Try to find similar strings for debugging
            const lines = previousContent.split('\n');
            const oldLines = oldStr.split('\n');
            let debugInfo = 'Update did not change content - old string not found';

            if (oldLines.length > 0) {
                const firstOldLine = oldLines[0].trim();
                const foundLine = lines.find(line => line.includes(firstOldLine));
                if (foundLine) {
                    debugInfo += ` | Found similar line: "${foundLine.trim()}"`;
                }
            }

            return {
                success: false,
                content: previousContent,
                info: debugInfo
            };
        }

        return {
            success: true,
            content: updatedContent,
            info: `Successfully applied update`
        };
    }

    /**
     * Creates change description for artifact commands
     */
    function createChangeDescription(version) {
        switch (version.command) {
            case 'create':
                return 'Created';
            case 'rewrite':
                return 'Rewritten';
            case 'update':
                const oldPreview = version.old_str ? version.old_str.substring(0, 50).replace(/\n/g, '\\n') + (version.old_str.length > 50 ? '...' : '') : '';
                const newPreview = version.new_str ? version.new_str.substring(0, 50).replace(/\n/g, '\\n') + (version.new_str.length > 50 ? '...' : '') : '';
                let changeDescription = `"${oldPreview}" → "${newPreview}"`;

                return changeDescription;
            default:
                return `Unknown command: ${version.command}`;
        }
    }

    /**
     * Finds the artifact content for a specific artifact ID and message
     */
    function findArtifactContent(artifactId, messageUuid, branchArtifacts, includeMode = 'final', stopTimestamp = null) {
        let allVersionsOfArtifact = [];
        let messageVersion = null;

        // Collect all versions of this artifact from all branches
        for (const [branchId, artifactsMap] of branchArtifacts) {
            if (artifactsMap.has(artifactId)) {
                const versions = artifactsMap.get(artifactId);
                allVersionsOfArtifact = allVersionsOfArtifact.concat(versions);

                // Find the specific version by timestamp if provided
                if (stopTimestamp) {
                    const specificVersion = versions.find(v =>
                        v.messageUuid === messageUuid &&
                        v.content_stop_timestamp === stopTimestamp
                    );
                    if (specificVersion) {
                        messageVersion = specificVersion;
                    }
                } else {
                    // Fallback: find any version in this message
                    const msgVersion = versions.find(v => v.messageUuid === messageUuid);
                    if (msgVersion) {
                        messageVersion = msgVersion;
                    }
                }
            }
        }

        if (allVersionsOfArtifact.length === 0) {
            return null;
        }

        if (includeMode === 'all') {
            // Show the specific version that was created in this tool_use
            return messageVersion;
        } else if (includeMode === 'final') {
            // Sort all versions by creation time to find the truly latest one
            allVersionsOfArtifact.sort((a, b) => {
                const timeA = new Date(a.content_stop_timestamp || a.timestamp_created_at);
                const timeB = new Date(b.content_stop_timestamp || b.timestamp_created_at);
                return timeA - timeB;
            });

            const globalLatestVersion = allVersionsOfArtifact[allVersionsOfArtifact.length - 1];

            // Show artifact ONLY if this message contains the globally final version
            if (globalLatestVersion.messageUuid === messageUuid) {
                return globalLatestVersion;
            }

            return null;
        }

        return null;
    }

    /**
     * Builds set of latest artifact timestamps for latest per message mode
     */
    function buildLatestArtifactTimestamps(conversationData) {
        const latestArtifactTimestamps = new Set();

        conversationData.chat_messages.forEach(message => {
            const latestInMessage = findLatestArtifactsInMessage(message);

            latestInMessage.forEach((content) => {
                if (content.stop_timestamp) {
                    latestArtifactTimestamps.add(content.stop_timestamp);
                }
            });
        });

        return latestArtifactTimestamps;
    }

    /**
     * Extracts and processes all artifacts from all branches with proper inheritance
     * @param {Object} conversationData - Complete conversation data
     * @returns {Object} {branchArtifacts: Map, branchInfo: Array, mainBranchUuids: Set}
     */
    function extractAllArtifacts(conversationData) {
        // Build conversation tree
        const tree = buildConversationTree(conversationData.chat_messages);
        const { branches, mainBranchPath } = getAllBranchInfo(tree, conversationData);
        const mainBranchUuids = new Set(mainBranchPath.map(msg => msg.uuid));
        const messageBranchMap = createMessageBranchMap(branches);

        console.log(`Found ${branches.length} conversation branches`);

        const branchArtifacts = new Map(); // branchId -> Map<artifactId, versions>
        const branchInfo = [];

        branches.forEach((branch) => {
            const { ownArtifacts, inheritedStates } = extractArtifacts(
                branch.fullPath,
                branch.branchStartIndex,
                branch.branchId,
                branch.isMainBranch
            );

            if (ownArtifacts.size > 0) {
                // Process artifacts for this branch
                const processedArtifacts = buildArtifactVersions(
                    ownArtifacts,
                    inheritedStates,
                    branch.branchId,
                    branch.isMainBranch
                );
                branchArtifacts.set(branch.branchId, processedArtifacts);

                const leafMessage = branch.fullPath[branch.fullPath.length - 1];
                branchInfo.push({
                    branchId: branch.branchId,
                    branchIndex: branch.branchIndex,
                    messageCount: branch.fullPath.length,
                    branchMessageCount: branch.fullPath.length - branch.branchStartIndex,
                    artifactCount: ownArtifacts.size,
                    inheritedArtifactCount: inheritedStates.size,
                    lastMessageTime: leafMessage.created_at,
                    lastMessageUuid: leafMessage.uuid,
                    isMainBranch: branch.isMainBranch,
                    branchStartIndex: branch.branchStartIndex
                });
            }
        });

        return {
            branchArtifacts,
            branchInfo,
            mainBranchUuids,
            messageBranchMap
        };
    }

    // =============================================
    // GENERATE CONVERSATION AND RAW CONTENT
    // =============================================

    /**
     * Generates markdown
     */
    function generateConversationMarkdown(conversationData, includeArtifacts = 'none', branchArtifacts = null, branchInfo = null, mainBranchUuids = null, messageBranchMap = null) {
        const settings = loadSettings();
        const sections = [];

        // === HEADER ===
        const headerParts = [];
        const metaLines = [];

        if (conversationData.project) {
            metaLines.push(`*Project:* [${conversationData.project.name}](https://claude.ai/project/${conversationData.project.uuid})`);
        }

        metaLines.push(`*URL:* https://claude.ai/chat/${conversationData.uuid}`);
        metaLines.push(`*Created:* ${formatDate(conversationData.created_at)}`);

        metaLines.push(`*Updated:* ${formatDate(conversationData.updated_at)}`);
        // metaLines.push(`*Exported:* ${formatDate(new Date())}`);

        if (conversationData.model) {
            metaLines.push(`*Model:* \`${conversationData.model}\``);
        }

        metaLines.forEach((line, index) => {
            if (index < metaLines.length - 1) {
                headerParts.push(line + '  ');
            } else {
                headerParts.push(line);
            }
        });

        headerParts.push(`\n# ${conversationData.name}` || `\n# Untitled`);

        sections.push(headerParts.join('\n'));

        // === MESSAGES ===

        // Build version info for messages with alternatives
        const versionInfo = buildVersionInfo(conversationData.chat_messages);
        const messagesToProcess = sortMessages(conversationData.chat_messages, settings.conversationSortMode);

        // Process each message
        messagesToProcess.forEach(message => {
            // User canceled message
            const messageParts = [];
            const isCanceled = message.stop_reason === 'user_canceled';
            const role = message.sender === 'human' ? 'Human' : 'Claude';

            // User canceled message in message header
            const headerLines = [];
            let headerLine = `## ${message.index} - ${role}`;
            if (isCanceled) headerLine += ` *(canceled)*`;
            headerLine += '  ';
            headerLines.push(headerLine);

            // Show branch membership
            const branchNumber = messageBranchMap ? messageBranchMap.get(message.uuid) : '?';
            if (mainBranchUuids && mainBranchUuids.has(message.uuid)) {
                headerLines.push(`*Branch:* ${branchNumber} | Main  `);
            } else {
                headerLines.push(`*Branch:* ${branchNumber} | Side  `);
            }

            // Add version info if this message has alternatives
            if (versionInfo.has(message.uuid)) {
                const info = versionInfo.get(message.uuid);
                headerLines.push(`*Version:* ${info.version} of ${info.total}  `);
            }

            headerLines.push(`*Created:* ${formatDate(message.created_at)}  `);

            headerLines.push(`*UUID:* \`${message.uuid}\``);
            if (settings.includeParentMessageUuid) {
                headerLines.push(`*Parent UUID:* \`${message.parent_message_uuid}\``);
            }


            messageParts.push(headerLines.join('\n'));

            // --- Message Content ---

            // For latest_per_message mode, collect latest artifact entry for each artifact ID
            let latestArtifactEntries = new Map(); // artifactId -> latest content entry
            if (includeArtifacts === 'latest_per_message') {
                latestArtifactEntries = findLatestArtifactsInMessage(message);
            }

            // Process message content
            message.content.forEach(content => {
                let contentBlock = null;

                if (content.type === 'text') {
                    const processedText = processTextContent(content.text, settings.removeDoubleNewlinesFromConversation);
                    contentBlock = processedText;
                } else if (content.type === 'tool_use' && content.name === 'artifacts') {
                    const input = content.input;

                    // Check latest per message mode
                    let shouldShowArtifactDetails = true;
                    if (includeArtifacts === 'latest_per_message') {
                        shouldShowArtifactDetails = latestArtifactEntries.get(input.id) === content;
                    }

                    if (shouldShowArtifactDetails) {
                        contentBlock = processArtifactInConversation(input, content, message, isCanceled, includeArtifacts, branchArtifacts, branchInfo, mainBranchUuids, settings);
                    }
                }

                // Process web search
                else if (content.type === 'tool_use' && content.name === 'web_search') {
                    if (content.input) {
                        contentBlock = `**🔍 Web Search:** \`${content.input.query}\``;
                    }
                }
                // Process web search results
                else if (content.type === 'tool_result' && content.name === 'web_search') {
                    if (content.content && Array.isArray(content.content)) {
                        const knowledgeResults = content.content.filter(item => item.type === 'knowledge');
                        if (knowledgeResults.length > 0) {
                            const resultLines = [];
                            resultLines.push(`**📚 Search Results (${knowledgeResults.length} found)**`);
                            resultLines.push('');

                            knowledgeResults.forEach((result, index) => {
                                resultLines.push(`${index + 1}. **[${result.title}]**`);
                                if (result.metadata && result.metadata.site_domain) {
                                    resultLines.push(`   *Source:* ${result.url}`);
                                }
                                resultLines.push('');
                            });

                            contentBlock = resultLines.join('\n');
                        }
                    }
                }

                // Handle Claude's thinking process
                else if (content.type === 'thinking') {
                    let summaryText = 'Thinking process';

                    // Last summary
                    if (content.summaries && content.summaries.length > 0) {
                        const lastSummary = content.summaries[content.summaries.length - 1];
                        if (lastSummary && lastSummary.summary) {
                            summaryText = lastSummary.summary;
                        }
                    }

                    if (content.thinking) {
                        const thinkingLines = [];
                        thinkingLines.push(`*[Claude thinking...]*`);
                        thinkingLines.push(`<details>\n<summary>${summaryText}</summary>`);

                        const processedThinking = processTextContent(content.thinking, settings.removeDoubleNewlinesFromConversation);
                        thinkingLines.push(processedThinking);
                        thinkingLines.push('</details>');

                        contentBlock = thinkingLines.join('\n');
                    } else {
                        contentBlock = `*[Claude thinking...]*`;
                    }
                }

                if (contentBlock) {
                    messageParts.push(contentBlock);
                }
            });

            // --- Files and Attachments ---
            const fileParts = [];

            // Process files if present (files or files_v2)
            const attachedFiles = message.files_v2 || message.files || [];
            if (attachedFiles.length > 0) {
                attachedFiles.forEach(file => {
                    const fileLines = [];
                    fileLines.push(`**File:** ${file.file_name}  `);
                    fileLines.push(`*ID:* \`${file.file_uuid}\`  `);
                    if (file.file_kind === 'image') {
                        fileLines.push(`*Preview:* https://claude.ai${file.preview_url}  `);
                    }
                    fileParts.push(fileLines.join('\n'));
                });
            }

            // Process attachments if present
            if (message.attachments && message.attachments.length > 0) {
                message.attachments.forEach(attachment => {
                    const attachmentLines = [];
                    attachmentLines.push(`**Attachment:** ${attachment.file_name}  `);
                    attachmentLines.push(`*ID:* \`${attachment.id}\`  `);

                    if (!settings.excludeAttachments && attachment.extracted_content) {
                        attachmentLines.push('');
                        attachmentLines.push('<details>');

                        const processedAttachment = processTextContent(attachment.extracted_content, settings.removeDoubleNewlinesFromConversation);
                        attachmentLines.push(processedAttachment);
                        attachmentLines.push('</details>');
                    }

                    fileParts.push(attachmentLines.join('\n'));
                });
            }

            if (fileParts.length > 0) {
                messageParts.push(fileParts.join('\n\n'));
            }

            // --- Add complete message ---
            if (messageParts.length > 0) {
                sections.push('__________'); // Message separator
                sections.push(messageParts.join('\n\n'));
            }
        });

        return sections.join('\n\n');
    }

    /**
     * Processes artifact content in conversation markdown
     */
    function processArtifactInConversation(input, content, message, isCanceled, includeArtifacts, branchArtifacts, branchInfo, mainBranchUuids, settings) {
        const lines = [];

        if (input.title) {
            let titleLine = `**Artifact Created:** ${input.title}`;

            // User canceled message
            if (isCanceled) {
                titleLine += ` *(incomplete - generation was canceled)*`;
            }
            titleLine += `  `;
            lines.push(titleLine);
        }

        lines.push(`*ID:* \`${input.id}\`  `);
        lines.push(`*Command:* \`${input.command}\`  `);

        // Add version, branch and timestamp info if available
        if (branchArtifacts) {
            // Find the specific version for this operation (by timestamp if available)
            let artifactVersion = null;

            for (const [branchId, artifactsMap] of branchArtifacts) {
                if (artifactsMap.has(input.id)) {
                    const versions = artifactsMap.get(input.id);

                    if (content.stop_timestamp) {
                        // Try to find by exact timestamp
                        artifactVersion = versions.find(v =>
                            v.messageUuid === message.uuid &&
                            v.content_stop_timestamp === content.stop_timestamp
                        );
                    }

                    // Fallback: find any version in this message
                    if (!artifactVersion) {
                        artifactVersion = versions.find(v => v.messageUuid === message.uuid);
                    }

                    if (artifactVersion) break;
                }
            }

            if (artifactVersion) {
                // Find branch info for proper branch label
                const branchData = branchInfo ? branchInfo.find(b => b.branchId === artifactVersion.branchId) : null;
                let branchLabel;

                // Determine if this is main branch based on message UUID
                let isMainBranch = false;
                if (mainBranchUuids && mainBranchUuids.has(artifactVersion.messageUuid)) {
                    isMainBranch = true;
                }

                if (branchData) {
                    if (isMainBranch) {
                        branchLabel = `branch${branchData.branchIndex} (main) (${artifactVersion.branchId.substring(0, 8)}...)`;
                    } else {
                        branchLabel = `branch${branchData.branchIndex} (${artifactVersion.branchId.substring(0, 8)}...)`;
                    }
                }

                lines.push(`*Branch:* ${branchLabel}  `);
                lines.push(`*Version:* ${artifactVersion.version}  `);
                lines.push(`*Created:* ${formatDate(artifactVersion.content_stop_timestamp || artifactVersion.timestamp_created_at)}  `);

                // Show change description if available
                const fields = [];
                if (artifactVersion.changeDescription) {
                    fields.push(`*Change:* ${artifactVersion.changeDescription}`);
                }
                if (artifactVersion.updateInfo) {
                    fields.push(`*Update Info:* ${artifactVersion.updateInfo}`);
                }
                if (artifactVersion.stop_reason === 'user_canceled') {
                    fields.push(`*Status:* CANCELED`);
                }
                fields.forEach((field, index) => {
                    if (index < fields.length - 1) {
                        lines.push(field + '  ');
                    } else {
                        lines.push(field);
                    }
                });
            }
        }

        // Include artifact content based on mode
        if (includeArtifacts !== 'none' && branchArtifacts) {
            // User canceled message
            if (shouldSkipCanceledMessage(message, settings)) {
                lines.push('');
                lines.push('*Artifact content excluded (generation was canceled)*');
            } else {
                let artifactContent = null;

                if (includeArtifacts === 'latest_per_message') {
                    // Find the latest artifact version in this specific message using the same logic
                    const latestInMessage = findLatestArtifactsInMessage(message);

                    const latestEntry = latestInMessage.get(input.id);
                    if (latestEntry && latestEntry === content) {
                        // Find the corresponding artifact version
                        for (const [branchId, artifactsMap] of branchArtifacts) {
                            if (artifactsMap.has(input.id)) {
                                const versions = artifactsMap.get(input.id);
                                artifactContent = versions.find(v =>
                                    v.content_stop_timestamp === latestEntry.stop_timestamp
                                );
                                if (artifactContent) break;
                            }
                        }
                    }
                } else {
                    // Use existing logic for 'all' and 'final' modes
                    artifactContent = findArtifactContent(input.id, message.uuid, branchArtifacts, includeArtifacts, content.stop_timestamp);
                }

                if (artifactContent) {
                    // lines.push('');
                    // lines.push('### Artifact Content');
                    lines.push('');

                    // Determine the language for syntax highlighting
                    const language = getLanguageForHighlighting(artifactContent.finalType, artifactContent.finalLanguage);

                    // Process artifact content based on settings
                    let processedArtifactContent = artifactContent.fullContent;
                    if (artifactContent.finalType === 'text/markdown' && settings.removeDoubleNewlinesFromMarkdown) {
                        processedArtifactContent = processArtifactContent(artifactContent.fullContent, artifactContent.finalType, true);
                    }

                    lines.push('```' + language);
                    lines.push(processedArtifactContent);
                    lines.push('```');
                }
            }
        }

        return lines.join('\n');
    }

    /**
     * Formats artifact metadata as comments in the appropriate style
     */
    function formatArtifactMetadata(version, artifactId, branchLabel, isMain) {
        const settings = loadSettings();

        // Return empty string if metadata is disabled
        if (!settings.includeArtifactMetadata) {
            return '';
        }

        const metadataInfo = [
            `Artifact ID: ${artifactId}`,
            `Branch: ${branchLabel}${isMain ? ' (main)' : ''} (${version.branchId.substring(0, 8)}...)`,
            `Version: ${version.version}`,
            `Command: ${version.command}`,
            `UUID: ${version.uuid}`,
            `Created: ${formatDate(version.content_stop_timestamp)}`
        ];

        if (version.changeDescription) {
            metadataInfo.push(`Change: ${version.changeDescription}`);
        }

        if (version.updateInfo) {
            metadataInfo.push(`Update Info: ${version.updateInfo}`);
        }

        if (version.stop_reason === 'user_canceled') {
            metadataInfo.push(`Status: CANCELED`);
        }

        // Special formatting for markdown files
        if (version.finalType === 'text/markdown') {
            let metadata = metadataInfo.map(info => `*${info}*`).join('\n') + '\n\n---\n';
            return metadata;
        }

        // For all other file types, use comments
        const commentStyle = getCommentStyle(version.finalType, version.finalLanguage);
        const { start, end } = commentStyle;

        let metadata = metadataInfo.map(info => `${start}${info}${end}`).join('\n') + '\n';

        // Add separator based on language
        const separators = {
            '// ': '\n// ---\n',
            '-- ': '\n-- ---\n',
            '<!-- ': '\n<!-- --- -->\n'
        };

        metadata += separators[start] || '\n# ---\n';

        return metadata;
    }

    /**
     * Core function to generate raw API file content and filename
     */
    function generateRawApiFile(conversationData, projectFolderName = '') {
        const settings = loadSettings();

        // Format JSON based on settings
        let jsonContent;
        if (settings.rawApiExportFormat === 'compact') {
            jsonContent = JSON.stringify(conversationData);
        } else {
            jsonContent = JSON.stringify(conversationData, null, 2);
        }

        // Generate filename
        const baseFilename = generateConversationFilename(conversationData);
        const formatSuffix = settings.rawApiExportFormat === 'compact' ? 'compact' : 'pretty';
        let filename = baseFilename.replace(/\.[^.]*$/, `_raw_api_${formatSuffix}.json`);

        // Add project folder if needed
        if (projectFolderName) {
            filename = `${projectFolderName}/${filename}`;
        }

        return { filename, jsonContent };
    }

    // =============================================
    // EXPORT SYSTEM
    // =============================================

    /**
     * Prepares export data by extracting artifacts and filtering as needed
     */
    async function prepareExportData(finalVersionsOnly, latestPerMessage, mainBranchOnly) {
        showNotification('Fetching conversation data...', 'info');

        const conversationData = await getConversationData();
        const settings = loadSettings();

        // Extract and process artifacts from all branches
        const { branchArtifacts, branchInfo, mainBranchUuids, messageBranchMap } = extractAllArtifacts(conversationData);

        // Filter conversation data if main branch only
        let filteredConversationData = conversationData;
        if (mainBranchOnly) {
            filteredConversationData = filterConversationForMainBranch(conversationData, mainBranchUuids, settings);
        }

        // Filter artifacts if main branch only
        let filteredBranchArtifacts = branchArtifacts;
        if (mainBranchOnly) {
            filteredBranchArtifacts = filterArtifactsForMainBranch(branchArtifacts, mainBranchUuids);
        }

        // Determine include mode for conversation markdown
        let includeMode;
        if (mainBranchOnly) {
            includeMode = 'all';
        } else if (latestPerMessage) {
            includeMode = 'latest_per_message';
        } else if (finalVersionsOnly) {
            includeMode = 'final';
        } else {
            includeMode = 'all';
        }

        return {
            conversationData,
            filteredConversationData,
            filteredBranchArtifacts,
            branchInfo,
            mainBranchUuids,
            includeMode,
            settings,
            mode: determineExportMode(finalVersionsOnly, latestPerMessage, mainBranchOnly),
            messageBranchMap
        };
    }

    /**
     * Determines the export mode string for notifications
     */
    function determineExportMode(finalVersionsOnly, latestPerMessage, mainBranchOnly) {
        if (mainBranchOnly) {
            return 'main branch';
        } else if (latestPerMessage) {
            return 'latest per message';
        } else if (finalVersionsOnly) {
            return 'final versions';
        } else {
            return 'all versions';
        }
    }

    /**
     * Exports artifact files based on current settings and mode
     */
    async function exportArtifactFiles(exportData, archiveManager) {
        const { filteredBranchArtifacts, filteredConversationData, includeMode, branchInfo, mainBranchUuids, conversationData, settings } = exportData;

        if (filteredBranchArtifacts.size === 0) return 0;

        let exportedCount = 0;

        // For latest per message mode, build set of latest artifact timestamps
        let latestArtifactTimestamps = new Set();
        if (includeMode === 'latest_per_message') {
            latestArtifactTimestamps = buildLatestArtifactTimestamps(filteredConversationData);
        }

        // Export artifacts for each branch
        for (const [branchId, artifactsMap] of filteredBranchArtifacts) {
            const branchData = branchInfo.find(b => b.branchId === branchId);
            const branchLabel = branchData ? branchData.branchIndex.toString() : 'unknown';
            const isMain = branchData ? branchData.isMainBranch : false;

            for (const [artifactId, versions] of artifactsMap) {
                let versionsToExport = versions; // Default to all versions

                if (includeMode === 'latest_per_message') {
                    // Only export versions that are latest per message
                    versionsToExport = versions.filter(version =>
                        latestArtifactTimestamps.has(version.content_stop_timestamp)
                    );
                } else if (includeMode === 'final' && exportData.mode !== 'main branch') {
                    // Only last version
                    versionsToExport = [versions[versions.length - 1]];
                }

                for (const version of versionsToExport) {
                    // User canceled message - excludeCanceledArtifacts
                    if (shouldSkipCanceledMessage(version, settings)) {
                        continue; // skip this message
                    }

                    let correctIsMain = isMain; // default from branchData

                    if (mainBranchUuids.has(version.messageUuid)) {
                        // Message in main branch
                        correctIsMain = true;
                    } else {
                        // Message in side branch
                        correctIsMain = false;
                    }

                    const filename = generateArtifactFilename(version, conversationData, branchLabel, correctIsMain, artifactId);

                    // Format metadata as comments
                    const metadata = formatArtifactMetadata(version, artifactId, branchLabel, correctIsMain);

                    // Process artifact content based on settings
                    let processedContent = version.fullContent;
                    if (version.finalType === 'text/markdown' && settings.removeDoubleNewlinesFromMarkdown) {
                        processedContent = processArtifactContent(version.fullContent, version.finalType, true);
                    }

                    // Combine metadata and content
                    const content = metadata ? metadata + '\n' + processedContent : processedContent;

                    if (archiveManager) {
                        await addFileToArchive(archiveManager, filename, content, conversationData, settings);
                    } else {
                        downloadFile(filename, content);
                    }

                    exportedCount++;
                }
            }
        }

        return exportedCount;
    }

    /**
     * Executes the export process with prepared data
     */
    async function executeExport(exportData) {
        const { conversationData, filteredConversationData, filteredBranchArtifacts, branchInfo, mainBranchUuids, includeMode, settings, messageBranchMap } = exportData;

        // Check if we should use archive for single conversation export
        const useArchive = settings.exportToArchive;
        let archiveManager = null;
        if (useArchive) {
            archiveManager = new ArchiveManager();
            await archiveManager.initialize();
        }

        let conversationMarkdown;
        let shouldExportSeparateFiles = false;

        // Determine behavior based on setting
        switch (settings.artifactExportMode) {
            case 'embed':
                conversationMarkdown = generateConversationMarkdown(filteredConversationData, includeMode, filteredBranchArtifacts, branchInfo, mainBranchUuids, messageBranchMap);
                shouldExportSeparateFiles = false;
                break;

            case 'files':
                conversationMarkdown = generateConversationMarkdown(filteredConversationData, 'none', filteredBranchArtifacts, branchInfo, mainBranchUuids, messageBranchMap);
                shouldExportSeparateFiles = true;
                break;

            case 'both':
                conversationMarkdown = generateConversationMarkdown(filteredConversationData, includeMode, filteredBranchArtifacts, branchInfo, mainBranchUuids, messageBranchMap);
                shouldExportSeparateFiles = true;
                break;
        }

        // Always download conversation file
        const conversationFilename = generateConversationFilename(conversationData);

        if (archiveManager) {
            await addFileToArchive(archiveManager, conversationFilename, conversationMarkdown, conversationData, settings);
        } else {
            downloadFile(conversationFilename, conversationMarkdown);
        }

        let totalExported = 1; // Conversation file

        // Export separate artifact files if needed
        let artifactCount = 0;
        if (shouldExportSeparateFiles) {
            artifactCount = await exportArtifactFiles(exportData, archiveManager);
            totalExported += artifactCount;
        }

        // Download archive if created
        if (archiveManager && archiveManager.fileCount > 0) {
            const archiveName = generateArchiveName(conversationData, settings.archiveName, false, 'Conversation');
            await archiveManager.downloadArchive(archiveName);
        }

        return {
            totalExported,
            artifactCount,
            archiveUsed: !!archiveManager,
            conversationFilename
        };
    }

    // =============================================
    // MAIN EXPORT FUNCTIONS
    // =============================================

    /**
     * Unified export function that handles all export modes
     * @param {boolean} finalVersionsOnly - If true, exports only final artifact versions
     * @param {boolean} latestPerMessage - If true, exports only latest artifact per message
     * @param {boolean} mainBranchOnly - If true, exports only main branch
     */
    async function exportConversationAndArtifacts(finalVersionsOnly = false, latestPerMessage = false, mainBranchOnly = false) {
        // Check for mass export context
        const massExportResult = checkAndHandleMassExport(finalVersionsOnly, latestPerMessage, mainBranchOnly);
        if (massExportResult) return massExportResult;

        // Perform single export
        return await withErrorHandling(async () => {
            const exportData = await prepareExportData(finalVersionsOnly, latestPerMessage, mainBranchOnly);
            const exportResult = await executeExport(exportData);
            const notificationMessage = generateExportNotification(exportResult, exportData);
            showNotification(notificationMessage, 'success');
        }, 'Export');
    }

    /**
     * Exports only the conversation, with optional artifact inclusion based on settings
     */
    async function exportConversationOnly() {
        // Check for mass export context
        const massExportResult = checkAndHandleMassExportConversationOnly();
        if (massExportResult) return massExportResult;

        // Perform single export
        return await withErrorHandling(async () => {
            showNotification('Fetching conversation data...', 'info');

            const conversationData = await getConversationData();
            const settings = loadSettings();

            // Extract artifacts to get metadata for conversation display
            const { branchArtifacts, branchInfo, mainBranchUuids, messageBranchMap } = extractAllArtifacts(conversationData);

            let includeArtifacts = settings.conversationOnlyArtifactMode;
            let filteredBranchArtifacts = branchArtifacts;

            // Filter artifacts for main_branch_only mode
            if (includeArtifacts === 'main_branch_only') {
                includeArtifacts = 'all';
                filteredBranchArtifacts = filterArtifactsForMainBranch(branchArtifacts, mainBranchUuids);
            }

            const conversationMarkdown = generateConversationMarkdown(conversationData, includeArtifacts, filteredBranchArtifacts, branchInfo, mainBranchUuids, messageBranchMap);

            const conversationFilename = generateConversationFilename(conversationData);
            downloadFile(conversationFilename, conversationMarkdown);

            if (settings.conversationOnlyArtifactMode !== 'none' && filteredBranchArtifacts.size > 0) {
                const artifactCount = countArtifacts(filteredBranchArtifacts);
                showNotification(`Conversation exported with ${artifactCount} embedded artifacts!`, 'success');
            } else {
                showNotification('Conversation exported successfully!', 'success');
            }
        }, 'Conversation export');
    }

    /**
     * Helper to count artifacts across branches
     */
    function countArtifacts(branchArtifacts) {
        return Array.from(branchArtifacts.values())
            .reduce((total, artifactsMap) => total + artifactsMap.size, 0);
    }

    /**
     * Exports raw API data in JSON format (for single export)
     */
    async function exportRawApiData() {
        // Check for mass export context
        const massExportResult = checkAndHandleMassExportRawApi();
        if (massExportResult) return massExportResult;

        // Perform single export
        return await withErrorHandling(async () => {
            showNotification('Fetching raw API data...', 'info');

            const conversationData = await getConversationData();
            const { filename, jsonContent } = generateRawApiFile(conversationData);

            downloadFile(filename, jsonContent);

            // Show success notification
            const sizeKB = Math.round(jsonContent.length / 1024);
            showNotification(`Raw API data exported! ${filename} (${sizeKB} KB)`, 'success');

        }, 'Raw API export');
    }

    /**
     * Exports single conversation raw API data (for mass export)
     */
    async function exportSingleConversationRawApiData(conversationData, archiveManager = null, projectFolderName = '') {
        const { filename, jsonContent } = generateRawApiFile(conversationData, projectFolderName);

        if (archiveManager) {
            await archiveManager.addFile(filename, jsonContent, false, '');
        } else {
            downloadFile(filename, jsonContent);
        }

        return 1;
    }

    // =============================================
    // INITIALIZATION
    // =============================================

    /**
     * Initializes the script and registers menu commands
     */
    function init() {
        console.log('[Claude API Exporter] Initializing...');
        const settings = loadSettings();

        // Register menu commands
        GM_registerMenuCommand('⚙️ Settings', showSettingsUI);

        if (settings.enableConversationOnly) {
            GM_registerMenuCommand('📄 Export Conversation Only', exportConversationOnly);
        }

        if (settings.enableFinalArtifacts) {
            GM_registerMenuCommand('📁 Export Conversation + Final Artifacts', () => exportConversationAndArtifacts(true, false));
        }

        if (settings.enableAllArtifacts) {
            GM_registerMenuCommand('📁 Export Conversation + All Artifacts', () => exportConversationAndArtifacts(false, false));
        }

        if (settings.enableLatestPerMessage) {
            GM_registerMenuCommand('📁 Export Conversation + Latest Artifacts Per Message', () => exportConversationAndArtifacts(false, true));
        }

        if (settings.enableMainBranchOnly) {
            GM_registerMenuCommand('🌿 Export Main Branch Only', () => exportConversationAndArtifacts(true, false, true));
        }

        if (settings.enableRawApiExport) {
            GM_registerMenuCommand('🔧 Export Raw API Data', exportRawApiData);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // EXPOSE FUNCTIONS FOR MASS EXPORTER
    window.claudeExporter = {
        // Settings
        loadSettings,
        saveSettings,

        // Utilities
        sanitizeFileName,
        formatDate,
        downloadFile,
        showNotification,
        ArchiveManager,
        downloadFileEnhanced,

        // Template and filename generation
        generateTimestamp,
        generateConversationFilename,
        generateArtifactFilename,
        generateArchiveName,
        generateChatFolderName,

        // Content processing
        processTextContent,
        processArtifactContent,

        // API
        getOrgId,
        getConversationData,

        // File extensions and comments
        getFileExtension,
        getCommentStyle,
        getLanguageForHighlighting,

        // Artifact processing
        extractAllArtifacts,
        filterConversationForMainBranch,
        filterArtifactsForMainBranch,
        buildLatestArtifactTimestamps,
        shouldSkipCanceledMessage,

        // Markdown generation
        generateConversationMarkdown,
        formatArtifactMetadata,

        // Export functions
        exportArtifactFiles,
        prepareExportData,
        executeExport,

        // Raw API
        exportRawApiData,
        exportSingleConversationRawApiData
    };

    console.log('[Claude API Exporter] Functions exposed for mass exporter');
})();
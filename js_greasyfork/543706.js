// ==UserScript==
// @name         Claude Mass Exporter Library
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Mass export library for Claude API Exporter 4.7+
// @author       MRL
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // =============================================
    // DEPENDENCY CHECK AND UTILITIES
    // =============================================

    function checkDependency() {
        const mainScript = window.claudeExporter;
        if (typeof mainScript === 'undefined') {
            console.error('[Claude Mass Exporter] Claude API Exporter not found!');
            return false;
        }

        // Initialize utilities after successful dependency check
        initializeUtilities();
        return true;
    }

    // Utilities from main script (initialized after main script loads)
    let showNotification, sanitizeFileName, formatDate, ArchiveManager;

    function initializeUtilities() {
        const mainScript = window.claudeExporter;
        showNotification = mainScript.showNotification;
        sanitizeFileName = mainScript.sanitizeFileName;
        formatDate = mainScript.formatDate;
        ArchiveManager = mainScript.ArchiveManager;
    }

    function getOrgId() {
        const match = document.cookie.match(/lastActiveOrg=([^;]+)/);
        if (!match) throw new Error('Could not find organization ID');
        return match[1];
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function formatDateString(dateString) {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    }

    // =============================================
    // CONTEXT AND ROUTING
    // =============================================

    function getCurrentContext() {
        const path = window.location.pathname;
        if (path === '/projects') return { type: 'projects' };
        if (path.match(/^\/project\/[^/]+$/)) return { type: 'project', projectId: path.split('/')[2] };
        if (path === '/recents') return { type: 'recents' };
        if (path.match(/^\/chat\/[^/]+$/)) return { type: 'chat' };
        return { type: 'unknown' };
    }

    function getExportChatFolderTemplate(exportType, settings) {
        // Determines the correct chat folder template based on export type
        switch (exportType) {
            case 'projects':
                return settings.massExportProjectsChatFolderName;
            case 'project':
            case 'recents':
                return settings.massExportSingleChatFolderName;
            default:
                return settings.massExportProjectsChatFolderName;
        }
    }

    // =============================================
    // SORTING AND PERSISTENCE
    // =============================================

    function sortItemsByDate(items, sortBy = 'updated', direction = 'desc') {
        return [...items].sort((a, b) => {
            const dateA = new Date(sortBy === 'created' ? a.created_at : a.updated_at);
            const dateB = new Date(sortBy === 'created' ? b.created_at : b.updated_at);
            return direction === 'desc' ? dateB - dateA : dateA - dateB;
        });
    }

    function saveSortSettings(sortBy, sortDirection, isProject = false) {
        const prefix = isProject ? 'claudeProject' : 'claude';
        localStorage.setItem(`${prefix}SortBy`, sortBy);
        localStorage.setItem(`${prefix}SortDirection`, sortDirection);
    }

    function loadSortSettings(isProject = false) {
        const prefix = isProject ? 'claudeProject' : 'claude';
        return {
            sortBy: localStorage.getItem(`${prefix}SortBy`) || 'updated',
            sortDirection: localStorage.getItem(`${prefix}SortDirection`) || 'desc'
        };
    }

    // =============================================
    // API FUNCTIONS
    // =============================================

    async function getAllProjects() {
        const orgId = getOrgId();
        const response = await fetch(`/api/organizations/${orgId}/projects?include_harmony_projects=true&creator_filter=is_creator`);
        if (!response.ok) throw new Error(`Failed to fetch projects: ${response.status}`);
        return await response.json();
    }

    async function getProjectConversations(projectUuid) {
        const orgId = getOrgId();
        const response = await fetch(`/api/organizations/${orgId}/projects/${projectUuid}/conversations`);
        if (!response.ok) throw new Error(`Failed to fetch project conversations: ${response.status}`);
        return await response.json();
    }

    async function getAllRecentConversations() {
        const orgId = getOrgId();
        const response = await fetch(`/api/organizations/${orgId}/chat_conversations?limit=10000`);
        if (!response.ok) throw new Error(`Failed to fetch recent conversations: ${response.status}`);
        return await response.json();
    }

    // Use getConversationData from main script
    async function getConversationData(conversationId) {
        return await window.claudeExporter.getConversationData(conversationId);
    }

    // =============================================
    // SELECTION UI - HTML CREATION
    // =============================================

    function createSelectionModal(title, isProjectSelection, sortSettings, items) {
        return `
            <div class="claude-selection-overlay">
                <div class="claude-selection-modal">
                    <div class="claude-selection-header">
                        <h3>📋 ${title}</h3>
                        <button class="claude-selection-close" type="button">×</button>
                    </div>
                    <div class="claude-selection-content">
                        ${createControlsSection(isProjectSelection, sortSettings)}
                        <div class="claude-selection-list">
                            ${isProjectSelection ? createProjectList(items) : createSimpleList(items, sortSettings)}
                        </div>
                    </div>
                    <div class="claude-selection-footer">
                        <button class="claude-btn claude-btn-secondary" type="button" id="cancelSelection">Cancel</button>
                        <button class="claude-btn claude-btn-primary" type="button" id="exportSelected" disabled>Export Selected</button>
                    </div>
                </div>
            </div>
        `;
    }

    function createControlsSection(isProjectSelection, sortSettings) {
        const selectAllId = isProjectSelection ? 'selectAllProjects' : 'selectAll';
        const selectAllText = isProjectSelection ? 'Select All Projects' : 'Select All';
        const sortLabel = isProjectSelection ? 'Sort chats:' : 'Sort by:';
        const sortById = isProjectSelection ? 'projectChatSortBy' : 'sortBy';
        const sortDirId = isProjectSelection ? 'projectChatSortDirection' : 'sortDirection';
        const countText = isProjectSelection ? '0 chats selected' : '0 selected';

        return `
            <div class="claude-selection-controls">
                <button class="claude-btn claude-btn-secondary" type="button" id="${selectAllId}">${selectAllText}</button>
                <button class="claude-btn claude-btn-secondary" type="button" id="selectNone">Select None</button>
                <div class="claude-sort-controls">
                    <label class="claude-sort-label">${sortLabel}</label>
                    <select id="${sortById}" class="claude-sort-select">
                        <option value="updated" ${sortSettings.sortBy === 'updated' ? 'selected' : ''}>Updated</option>
                        <option value="created" ${sortSettings.sortBy === 'created' ? 'selected' : ''}>Created</option>
                    </select>
                    <select id="${sortDirId}" class="claude-sort-select">
                        <option value="desc" ${sortSettings.sortDirection === 'desc' ? 'selected' : ''}>Newest first</option>
                        <option value="asc" ${sortSettings.sortDirection === 'asc' ? 'selected' : ''}>Oldest first</option>
                    </select>
                </div>
                <span class="claude-selection-count">${countText}</span>
            </div>
        `;
    }

    function createProjectList(items) {
        return items.map((project, index) => `
            <div class="claude-project-item" data-project-index="${index}">
                <div class="claude-project-header">
                    <button class="claude-project-toggle" type="button" data-project="${index}">
                        <span class="claude-toggle-icon">▶</span>
                    </button>
                    <input type="checkbox" id="project-${index}" class="claude-project-checkbox" data-project="${index}">
                    <label for="project-${index}" class="claude-project-label">
                        <div class="claude-project-name">📁 ${project.name}</div>
                        <div class="claude-project-meta">Updated: ${formatDateString(project.updated_at)} | Created: ${formatDateString(project.created_at)} | <span class="chat-count">Click to load chats</span></div>
                    </label>
                </div>
                <div class="claude-project-chats" id="chats-${index}" style="display: none;">
                    <div class="claude-loading">Loading conversations...</div>
                </div>
            </div>
        `).join('');
    }

    function createSimpleList(items, sortSettings) {
        return sortItemsByDate(items, sortSettings.sortBy, sortSettings.sortDirection).map((item, index) => `
            <div class="claude-selection-item">
                <input type="checkbox" id="item-${index}" value="${items.indexOf(item)}" class="claude-selection-checkbox">
                <label for="item-${index}" class="claude-selection-label">
                    <div class="claude-selection-name">${item.name}</div>
                    <div class="claude-selection-meta">Updated: ${formatDateString(item.updated_at)} | Created: ${formatDateString(item.created_at)}${item.project?.name ? ` | ${item.project.name}` : ''}</div>
                </label>
            </div>
        `).join('');
    }

    function createChatList(conversations, projectIndex) {
        return conversations.map((chat, chatIndex) => `
            <div class="claude-chat-item">
                <input type="checkbox" id="chat-${projectIndex}-${chatIndex}" class="claude-chat-checkbox" data-project="${projectIndex}" data-chat="${chatIndex}">
                <label for="chat-${projectIndex}-${chatIndex}" class="claude-chat-label">
                    <div class="claude-chat-name">💬 ${chat.name}</div>
                    <div class="claude-chat-meta">Updated: ${formatDateString(chat.updated_at)} | Created: ${formatDateString(chat.created_at)}</div>
                </label>
            </div>
        `).join('');
    }

    // =============================================
    // SELECTION UI - LOGIC
    // =============================================

    function createSelectionUI(title, items, onExport) {
        document.getElementById('claude-selection-ui')?.remove();

        const isProjectSelection = title.includes('Projects') && items.length > 0 && items[0].uuid;
        const sortSettings = loadSortSettings(isProjectSelection);

        const selectionOverlay = document.createElement('div');
        selectionOverlay.id = 'claude-selection-ui';
        selectionOverlay.innerHTML = createSelectionModal(title, isProjectSelection, sortSettings, items);

        document.head.insertAdjacentHTML('beforeend', getSelectionStyles());
        document.body.appendChild(selectionOverlay);

        if (isProjectSelection) {
            setupProjectSelection(items, onExport);
        } else {
            setupSimpleSelection(items, onExport);
        }

        setupCommonHandlers();
    }

    function setupProjectSelection(items, onExport) {
        const state = {
            selectedChats: new Map(),
            projectChats: new Map(),
            loadedProjects: new Set()
        };

        items.forEach((_, index) => state.selectedChats.set(index, new Set()));

        const updateUI = () => {
            let totalSelectedChats = 0;
            state.selectedChats.forEach(chatSet => totalSelectedChats += chatSet.size);

            document.querySelector('.claude-selection-count').textContent = `${totalSelectedChats} chats selected`;
            document.getElementById('exportSelected').disabled = totalSelectedChats === 0;

            // Update project checkboxes
            items.forEach((_, projectIndex) => {
                const projectCheckbox = document.getElementById(`project-${projectIndex}`);
                const chats = state.projectChats.get(projectIndex) || [];
                const selectedChatSet = state.selectedChats.get(projectIndex);

                if (chats.length === 0) {
                    // Don't change checked state while loading
                    if (!projectCheckbox.checked) {
                        projectCheckbox.indeterminate = false;
                    }
                } else if (selectedChatSet.size === 0) {
                    projectCheckbox.indeterminate = false;
                    projectCheckbox.checked = false;
                } else if (selectedChatSet.size === chats.length) {
                    projectCheckbox.indeterminate = false;
                    projectCheckbox.checked = true;
                } else {
                    projectCheckbox.indeterminate = true;
                }
            });
        };

        const loadProjectChats = async (projectIndex, forceReload = false) => {
            if (!forceReload && state.loadedProjects.has(projectIndex)) return;

            const project = items[projectIndex];
            const chatsContainer = document.getElementById(`chats-${projectIndex}`);

            try {
                const conversations = await getProjectConversations(project.uuid);

                // Sort conversations based on current settings
                const sortSettings = loadSortSettings(true);
                const sortedConversations = sortItemsByDate(conversations, sortSettings.sortBy, sortSettings.sortDirection);

                state.projectChats.set(projectIndex, sortedConversations);
                state.loadedProjects.add(projectIndex);

                // Update count
                document.querySelector(`[data-project-index="${projectIndex}"] .chat-count`).textContent = `${sortedConversations.length} chats`;

                // Generate chat list
                chatsContainer.innerHTML = createChatList(sortedConversations, projectIndex);

                // Add chat checkbox handlers
                chatsContainer.querySelectorAll('.claude-chat-checkbox').forEach(checkbox => {
                    checkbox.addEventListener('change', (e) => {
                        const projectIdx = parseInt(e.target.dataset.project);
                        const chatIdx = parseInt(e.target.dataset.chat);
                        const selectedChatSet = state.selectedChats.get(projectIdx);

                        if (e.target.checked) {
                            selectedChatSet.add(chatIdx);
                        } else {
                            selectedChatSet.delete(chatIdx);
                        }
                        updateUI();
                    });
                });

            } catch (error) {
                console.error(`Failed to load chats for project ${project.name}:`, error);
                chatsContainer.innerHTML = '<div class="claude-error">❌ Failed to load conversations</div>';
                document.querySelector(`[data-project-index="${projectIndex}"] .chat-count`).textContent = 'Error';
            }
        };

        // Setup all event handlers
        setupProjectEventHandlers(state, items, updateUI, loadProjectChats, onExport);
        updateUI();
    }

    function setupProjectEventHandlers(state, items, updateUI, loadProjectChats, onExport) {
        // Toggle handlers
        document.querySelectorAll('.claude-project-toggle').forEach(toggle => {
            toggle.addEventListener('click', async (e) => {
                e.stopPropagation();
                const projectIndex = parseInt(e.currentTarget.dataset.project);
                const chatsContainer = document.getElementById(`chats-${projectIndex}`);
                const toggleIcon = e.currentTarget.querySelector('.claude-toggle-icon');

                if (chatsContainer.style.display === 'none') {
                    chatsContainer.style.display = 'block';
                    toggleIcon.classList.add('expanded');
                    await loadProjectChats(projectIndex, false);
                } else {
                    chatsContainer.style.display = 'none';
                    toggleIcon.classList.remove('expanded');
                }
            });
        });

        // Project checkbox handlers
        document.querySelectorAll('.claude-project-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', async (e) => {
                const projectIndex = parseInt(e.target.dataset.project);
                const selectedChatSet = state.selectedChats.get(projectIndex);

                if (e.target.checked) {
                    // Load chats if needed
                    if (!state.loadedProjects.has(projectIndex)) {
                        e.target.disabled = true;
                        await loadProjectChats(projectIndex, false);
                        e.target.disabled = false;
                    }

                    // Select all chats
                    const chats = state.projectChats.get(projectIndex) || [];
                    chats.forEach((_, chatIndex) => {
                        selectedChatSet.add(chatIndex);
                        const chatCheckbox = document.getElementById(`chat-${projectIndex}-${chatIndex}`);
                        if (chatCheckbox) chatCheckbox.checked = true;
                    });
                } else {
                    // Deselect all chats
                    selectedChatSet.clear();
                    const chats = state.projectChats.get(projectIndex) || [];
                    chats.forEach((_, chatIndex) => {
                        const chatCheckbox = document.getElementById(`chat-${projectIndex}-${chatIndex}`);
                        if (chatCheckbox) chatCheckbox.checked = false;
                    });
                }
                updateUI();
            });
        });

        // Control buttons
        document.getElementById('selectAllProjects').addEventListener('click', async () => {
            for (let i = 0; i < items.length; i++) {
                const projectCheckbox = document.getElementById(`project-${i}`);
                if (!projectCheckbox.checked) {
                    projectCheckbox.checked = true;
                    projectCheckbox.dispatchEvent(new Event('change'));
                }
            }
        });

        document.getElementById('selectNone').addEventListener('click', () => {
            state.selectedChats.forEach((chatSet, projectIndex) => {
                chatSet.clear();
                document.getElementById(`project-${projectIndex}`).checked = false;

                const chats = state.projectChats.get(projectIndex) || [];
                chats.forEach((_, chatIndex) => {
                    const chatCheckbox = document.getElementById(`chat-${projectIndex}-${chatIndex}`);
                    if (chatCheckbox) chatCheckbox.checked = false;
                });
            });
            updateUI();
        });

        // Sort handlers
        const resortAllProjects = async () => {
            for (const projectIndex of state.loadedProjects) {
                state.selectedChats.get(projectIndex).clear();
                await loadProjectChats(projectIndex, true);
            }
            updateUI();
        };

        // Auto-sort when selection changes
        document.getElementById('projectChatSortBy').addEventListener('change', (e) => {
            saveSortSettings(e.target.value, document.getElementById('projectChatSortDirection').value, true);
            resortAllProjects();
        });

        document.getElementById('projectChatSortDirection').addEventListener('change', (e) => {
            saveSortSettings(document.getElementById('projectChatSortBy').value, e.target.value, true);
            resortAllProjects();
        });

        // Export handler
        document.getElementById('exportSelected').addEventListener('click', () => {
            const selectedData = [];

            state.selectedChats.forEach((chatSet, projectIndex) => {
                if (chatSet.size > 0) {
                    const project = items[projectIndex];
                    const chats = state.projectChats.get(projectIndex) || [];
                    const selectedProjectChats = Array.from(chatSet).map(chatIndex => chats[chatIndex]);

                    selectedData.push({ project: project, chats: selectedProjectChats });
                }
            });

            closeModal();
            onExport(selectedData);
        });
    }

    function setupSimpleSelection(items, onExport) {
        const selectedItems = new Set();

        const updateUI = () => {
            const count = selectedItems.size;
            document.querySelector('.claude-selection-count').textContent = `${count} selected`;
            document.getElementById('exportSelected').disabled = count === 0;
        };

        // Checkbox handlers
        document.querySelectorAll('.claude-selection-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const index = parseInt(e.target.value);
                if (e.target.checked) {
                    selectedItems.add(index);
                } else {
                    selectedItems.delete(index);
                }
                updateUI();
            });
        });

        // Control buttons
        document.getElementById('selectAll').addEventListener('click', () => {
            document.querySelectorAll('.claude-selection-checkbox').forEach(checkbox => {
                checkbox.checked = true;
                selectedItems.add(parseInt(checkbox.value));
            });
            updateUI();
        });

        document.getElementById('selectNone').addEventListener('click', () => {
            document.querySelectorAll('.claude-selection-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });
            selectedItems.clear();
            updateUI();
        });

        // Sort handlers
        const resortList = () => {
            const sortBy = document.getElementById('sortBy').value;
            const sortDirection = document.getElementById('sortDirection').value;
            const sortedItems = sortItemsByDate(items, sortBy, sortDirection);

            const listContainer = document.querySelector('.claude-selection-list');
            listContainer.innerHTML = sortedItems.map((item, index) => `
                <div class="claude-selection-item">
                    <input type="checkbox" id="item-${index}" value="${items.indexOf(item)}" class="claude-selection-checkbox">
                    <label for="item-${index}" class="claude-selection-label">
                        <div class="claude-selection-name">${item.name}</div>
                        <div class="claude-selection-meta">Updated: ${formatDateString(item.updated_at)} | Created: ${formatDateString(item.created_at)}${item.project?.name ? ` | ${item.project.name}` : ''}</div>
                    </label>
                </div>
            `).join('');

            // Re-setup checkbox handlers
            document.querySelectorAll('.claude-selection-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const index = parseInt(e.target.value);
                    if (e.target.checked) {
                        selectedItems.add(index);
                    } else {
                        selectedItems.delete(index);
                    }
                    updateUI();
                });
            });
        };

        // Auto-sort when selection changes
        document.getElementById('sortBy').addEventListener('change', (e) => {
            saveSortSettings(e.target.value, document.getElementById('sortDirection').value, false);
            resortList();
        });

        document.getElementById('sortDirection').addEventListener('change', (e) => {
            saveSortSettings(document.getElementById('sortBy').value, e.target.value, false);
            resortList();
        });

        // Export handler
        document.getElementById('exportSelected').addEventListener('click', () => {
            const selected = Array.from(selectedItems).map(index => items[index]);
            closeModal();
            onExport(selected);
        });

        updateUI();
    }

    function setupCommonHandlers() {
        document.querySelector('.claude-selection-close').addEventListener('click', closeModal);
        document.getElementById('cancelSelection').addEventListener('click', closeModal);
        document.querySelector('.claude-selection-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('claude-selection-overlay')) closeModal();
        });
    }

    function closeModal() {
        document.getElementById('claude-selection-ui')?.remove();
        document.getElementById('claude-selection-styles')?.remove();
    }

    // =============================================
    // PROGRESS UI
    // =============================================

    function createProgressUI(title) {
        document.getElementById('claude-mass-export-progress')?.remove();

        const progressOverlay = document.createElement('div');
        progressOverlay.id = 'claude-mass-export-progress';
        progressOverlay.innerHTML = `
            <div class="claude-progress-overlay">
                <div class="claude-progress-modal">
                    <div class="claude-progress-header">
                        <h3>📦 ${title}</h3>
                        <button class="claude-progress-close" type="button">×</button>
                    </div>
                    <div class="claude-progress-content">
                        <div class="claude-progress-bar">
                            <div class="claude-progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="claude-progress-text">Initializing...</div>
                        <div class="claude-progress-details"></div>
                    </div>
                </div>
            </div>
        `;

        document.head.insertAdjacentHTML('beforeend', getProgressStyles());
        document.body.appendChild(progressOverlay);

        let cancelled = false;

        const closeProgressModal = () => {
            cancelled = true;
            document.getElementById('claude-mass-export-progress')?.remove();
            document.getElementById('claude-progress-styles')?.remove();
        };

        document.querySelector('.claude-progress-close').addEventListener('click', closeProgressModal);
        document.querySelector('.claude-progress-overlay').addEventListener('click', (e) => {
            if (e.target.classList.contains('claude-progress-overlay')) closeProgressModal();
        });

        return {
            updateProgress: (current, total, text, details = '') => {
                if (cancelled) return false;

                const percentage = Math.round((current / total) * 100);
                document.querySelector('.claude-progress-fill').style.width = `${percentage}%`;
                document.querySelector('.claude-progress-text').textContent = text;
                document.querySelector('.claude-progress-details').textContent = details;

                if (current === total) {
                    setTimeout(closeProgressModal, 2000);
                }

                return true;
            },
            isCancelled: () => cancelled,
            close: closeProgressModal
        };
    }

    // =============================================
    // EXPORT ORCHESTRATION
    // =============================================

    /**
     * Exports a single conversation using main script's logic
     */
    async function exportSingleConversation(conversationData, exportMode = 'final', archiveManager = null, projectFolderName = '', useChatFolders = false, exportType = 'projects', mainBranchOnly = false) {
        const mainScript = window.claudeExporter;
        if (!mainScript) throw new Error('Main exporter not available');

        const settings = mainScript.loadSettings();

        // Determine folder structure
        let finalFolderPath = '';
        if (archiveManager && projectFolderName) {
            // Mass export with project folders (only for exporting all projects)
            if (useChatFolders) {
                // Project/Chat/ structure
                const template = getExportChatFolderTemplate('projects', settings);
                const chatFolderName = mainScript.generateChatFolderName(
                    conversationData,
                    { name: projectFolderName },
                    template
                );
                finalFolderPath = chatFolderName;
            } else {
                // Project/ structure (files directly in project folder)
                finalFolderPath = projectFolderName;
            }
        } else if (archiveManager && useChatFolders) {
            // Single export with chat folders (for a separate project or recent ones)
            const template = getExportChatFolderTemplate(exportType, settings);
            finalFolderPath = mainScript.generateChatFolderName(conversationData, null, template);
        }

        // Extract and process artifacts - use main script's function
        const { branchArtifacts, branchInfo, mainBranchUuids, messageBranchMap } = mainScript.extractAllArtifacts(conversationData);

        // Determine final/latest/all mode for artifacts
        let finalVersionsOnly = false;
        let latestPerMessage = false;

        if (exportMode === 'final') {
            finalVersionsOnly = true;
        } else if (exportMode === 'latest_per_message') {
            latestPerMessage = true;
        }

        // Filter conversation data if main branch only - use main script's function
        let filteredConversationData = conversationData;
        if (mainBranchOnly && !settings.mainBranchOnlyIncludeAllMessages) {
            filteredConversationData = mainScript.filterConversationForMainBranch(conversationData, mainBranchUuids, settings);
        }

        // Filter artifacts if main branch only
        let filteredBranchArtifacts = branchArtifacts;
        if (mainBranchOnly) {
            filteredBranchArtifacts = mainScript.filterArtifactsForMainBranch(branchArtifacts, mainBranchUuids);
        }

        // Handle conversation-only export
        if (exportMode === 'none') {
            let conversationOnlyMode = settings.conversationOnlyArtifactMode;
            let conversationOnlyBranchArtifacts = filteredBranchArtifacts;
            let conversationOnlyData = filteredConversationData;

            // Filter artifacts for main_branch_only mode
            if (conversationOnlyMode === 'main_branch_only') {
                conversationOnlyMode = 'all';
                conversationOnlyBranchArtifacts = mainScript.filterArtifactsForMainBranch(branchArtifacts, mainBranchUuids);

                // Use full conversation data if mainBranchOnlyIncludeAllMessages is true
                if (settings.mainBranchOnlyIncludeAllMessages) {
                    conversationOnlyData = conversationData;
                }
            }

            const conversationMarkdown = mainScript.generateConversationMarkdown(
                conversationOnlyData,
                conversationOnlyMode,
                conversationOnlyBranchArtifacts,
                branchInfo,
                mainBranchUuids,
                messageBranchMap
            );
            
            let filename = mainScript.generateConversationFilename(conversationData);

            // Add full path for archive
            if (finalFolderPath) {
                filename = `${finalFolderPath}/${filename}`;
            }

            if (archiveManager) {
                // Use full path in filename, no additional folder processing
                await archiveManager.addFile(filename, conversationMarkdown, false, '');
            } else {
                mainScript.downloadFile(filename, conversationMarkdown);
            }
            return 1;
        }

        // Determine include mode for conversation markdown - regular export with artifacts
        let includeMode;
        if (mainBranchOnly) {
            includeMode = 'all';
        } else if (exportMode === 'latest_per_message') {
            includeMode = 'latest_per_message';
        } else if (exportMode === 'final') {
            includeMode = 'final';
        } else {
            includeMode = 'all';
        }

        let conversationMarkdown, shouldExportSeparateFiles = false;

        // Determine behavior based on setting
        switch (settings.artifactExportMode) {
            case 'embed':
                conversationMarkdown = mainScript.generateConversationMarkdown(
                    filteredConversationData,
                    includeMode,
                    filteredBranchArtifacts,
                    branchInfo,
                    mainBranchUuids,
                    messageBranchMap
                );
                break;
            case 'files':
                conversationMarkdown = mainScript.generateConversationMarkdown(
                    filteredConversationData,
                    'none',
                    filteredBranchArtifacts,
                    branchInfo,
                    mainBranchUuids,
                    messageBranchMap
                );
                shouldExportSeparateFiles = true;
                break;
            case 'both':
                conversationMarkdown = mainScript.generateConversationMarkdown(
                    filteredConversationData,
                    includeMode,
                    filteredBranchArtifacts,
                    branchInfo,
                    mainBranchUuids,
                    messageBranchMap
                );
                shouldExportSeparateFiles = true;
                break;
        }

        // Generate filename with full path for archive
        let finalFilename = mainScript.generateConversationFilename(conversationData);
        if (finalFolderPath) {
            finalFilename = `${finalFolderPath}/${finalFilename}`;
        }

        // Add conversation file
        if (archiveManager) {
            // Use full path in filename, no additional folder processing
            await archiveManager.addFile(finalFilename, conversationMarkdown, false, '');
        } else {
            mainScript.downloadFile(finalFilename, conversationMarkdown);
        }

        let exportedCount = 1; // Conversation file

        // Export artifacts if needed
        if (shouldExportSeparateFiles && filteredBranchArtifacts.size > 0) {
            // For latest per message mode, build set of latest artifact timestamps
            let latestArtifactTimestamps = new Set();
            if (exportMode === 'latest_per_message') {
                latestArtifactTimestamps = mainScript.buildLatestArtifactTimestamps(filteredConversationData);
            }

            for (const [branchId, artifactsMap] of filteredBranchArtifacts) {
                const branchData = branchInfo.find(b => b.branchId === branchId);
                const branchLabel = branchData ? branchData.branchIndex.toString() : 'unknown';

                for (const [artifactId, versions] of artifactsMap) {
                    let versionsToExport = versions;
                    if (exportMode === 'latest_per_message') {
                        versionsToExport = versions.filter(version => latestArtifactTimestamps.has(version.content_stop_timestamp));
                    } else if (exportMode === 'final' && !mainBranchOnly) {
                        versionsToExport = [versions[versions.length - 1]];
                    }

                    for (const version of versionsToExport) {
                        // Use main script's function to check if should skip
                        if (mainScript.shouldSkipCanceledMessage(version, settings)) continue;

                        const correctIsMain = mainBranchUuids && mainBranchUuids.has(version.messageUuid);
                        const artifactFilename = mainScript.generateArtifactFilename(version, conversationData, branchLabel, correctIsMain, artifactId);

                        // Add full path for archive
                        let fullArtifactFilename = artifactFilename;
                        if (finalFolderPath) {
                            fullArtifactFilename = `${finalFolderPath}/${artifactFilename}`;
                        }

                        // Use main script's functions for metadata and content processing
                        const metadata = mainScript.formatArtifactMetadata(version, artifactId, branchLabel, correctIsMain);
                        let processedContent = version.fullContent;
                        if (version.finalType === 'text/markdown' && settings.removeDoubleNewlinesFromMarkdown) {
                            processedContent = mainScript.processArtifactContent(version.fullContent, version.finalType, true);
                        }

                        const content = metadata ? metadata + '\n' + processedContent : processedContent;

                        if (archiveManager) {
                            // Use full path in filename, no additional folder processing
                            await archiveManager.addFile(fullArtifactFilename, content, false, '');
                        } else {
                            mainScript.downloadFile(fullArtifactFilename, content);
                        }

                        exportedCount++;
                    }
                }
            }
        }

        return exportedCount;
    }

    async function performMassExport(selectedData, exportMode, mainBranchOnly, exportType, progressTitle) {
        const progress = createProgressUI(progressTitle);

        try {
            const mainScript = window.claudeExporter;
            const settings = mainScript.loadSettings();

            // Determine if we should use archive
            const useArchive = settings.forceArchiveForMassExport;
            const useChatFolders = settings.forceChatFoldersForMassExport;

            let archiveManager = null;
            if (useArchive) {
                archiveManager = new ArchiveManager();
                await archiveManager.initialize();
            }

            let totalConversations = 0;
            if (exportType === 'projects') {
                totalConversations = selectedData.reduce((total, projectData) => total + projectData.chats.length, 0);
            } else {
                totalConversations = selectedData.length;
            }

            if (totalConversations === 0) {
                showNotification('No conversations selected for export', 'info');
                progress.close();
                return;
            }

            // Export conversations
            let currentConversation = 0;
            let totalExported = 0;

            if (exportType === 'projects') {
                for (const projectData of selectedData) {
                    if (progress.isCancelled()) return;

                    const project = projectData.project;
                    const chats = projectData.chats;
                    const projectFolderName = sanitizeFileName(project.name);

                    for (const chat of chats) {
                        if (progress.isCancelled()) return;

                        currentConversation++;
                        progress.updateProgress(currentConversation, totalConversations,
                            `Exporting conversation ${currentConversation}/${totalConversations}`,
                            `Project: ${project.name} | Chat: ${chat.name}`);

                        try {
                            const fullConversationData = await getConversationData(chat.uuid);
                            const exportedCount = await exportSingleConversation(fullConversationData, exportMode, archiveManager, projectFolderName, useChatFolders, 'projects', mainBranchOnly);
                            totalExported += exportedCount;
                        } catch (error) {
                            console.warn(`Failed to export conversation ${chat.name}:`, error);
                        }

                        await delay(200);
                    }
                }
            } else {
                for (const conversation of selectedData) {
                    if (progress.isCancelled()) return;

                    currentConversation++;
                    progress.updateProgress(currentConversation, totalConversations,
                        `Exporting conversation ${currentConversation}/${totalConversations}`,
                        `Chat: ${conversation.name}`);

                    try {
                        const fullConversationData = await getConversationData(conversation.uuid);

                        // Determine project folder name if conversation belongs to a project
                        const projectFolderName = fullConversationData.project?.name ?
                            sanitizeFileName(fullConversationData.project.name) : '';

                        const exportedCount = await exportSingleConversation(fullConversationData, exportMode, archiveManager, projectFolderName, useChatFolders, exportType, mainBranchOnly);
                        totalExported += exportedCount;
                    } catch (error) {
                        console.warn(`Failed to export conversation ${conversation.name}:`, error);
                    }

                    await delay(200);
                }
            }

            if (archiveManager && archiveManager.fileCount > 0) {
                let exportName;
                if (exportType === 'projects') {
                    exportName = `${selectedData.length} Projects Export`;
                } else {
                    exportName = `${selectedData.length} Conversations Export`;
                }

                const archiveName = mainScript.generateArchiveName({
                    name: exportName,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    uuid: 'mass-export'
                }, settings.massExportArchiveName, true, exportType === 'projects' ? 'Projects' : 'Conversations');

                await archiveManager.downloadArchive(archiveName);
            }

            if (exportType === 'projects') {
                showNotification(`✅ Mass export completed! Downloaded ${totalExported} files from ${totalConversations} conversations across ${selectedData.length} projects`, 'success');
            } else {
                showNotification(`✅ Export completed! Downloaded ${totalExported} files from ${selectedData.length} conversations`, 'success');
            }

        } catch (error) {
            console.error('Mass export failed:', error);
            showNotification(`❌ Mass export failed: ${error.message}`, 'error');
        }
    }

    async function performRawApiMassExport(selectedData, exportType, progressTitle) {
        const progress = createProgressUI(progressTitle);

        try {
            const mainScript = window.claudeExporter;
            const settings = mainScript.loadSettings();

            // Determine if we should use archive
            const useArchive = settings.forceArchiveForMassExport;
            const useChatFolders = settings.forceChatFoldersForMassExport;

            let archiveManager = null;
            if (useArchive) {
                archiveManager = new ArchiveManager();
                await archiveManager.initialize();
            }

            let totalConversations = 0;
            if (exportType === 'projects') {
                totalConversations = selectedData.reduce((total, projectData) => total + projectData.chats.length, 0);
            } else {
                totalConversations = selectedData.length;
            }

            if (totalConversations === 0) {
                showNotification('No conversations selected for export', 'info');
                progress.close();
                return;
            }

            let currentConversation = 0;
            let totalExported = 0;

            if (exportType === 'projects') {
                for (const projectData of selectedData) {
                    if (progress.isCancelled()) return;

                    const project = projectData.project;
                    const chats = projectData.chats;

                    for (const chat of chats) {
                        if (progress.isCancelled()) return;

                        currentConversation++;
                        progress.updateProgress(currentConversation, totalConversations,
                            `Exporting raw API data ${currentConversation}/${totalConversations}`,
                            `Project: ${project.name} | Chat: ${chat.name}`);

                        try {
                            const fullConversationData = await getConversationData(chat.uuid);

                            let folderName = '';
                            if (useChatFolders) {
                                const template = getExportChatFolderTemplate('projects', settings);
                                folderName = mainScript.generateChatFolderName(
                                    fullConversationData,
                                    { name: project.name, uuid: project.uuid },
                                    template
                                );
                            }

                            // Use main script's function for raw API export
                            await mainScript.exportSingleConversationRawApiData(fullConversationData, archiveManager, folderName);
                            totalExported++;
                        } catch (error) {
                            console.warn(`Failed to export raw API data for conversation ${chat.name}:`, error);
                        }

                        await delay(200);
                    }
                }
            } else {
                for (const conversation of selectedData) {
                    if (progress.isCancelled()) return;

                    currentConversation++;
                    progress.updateProgress(currentConversation, totalConversations,
                        `Exporting raw API data ${currentConversation}/${totalConversations}`,
                        `Chat: ${conversation.name}`);

                    try {
                        const fullConversationData = await getConversationData(conversation.uuid);
                        let folderName = '';
                        if (useChatFolders) {
                            const template = getExportChatFolderTemplate(exportType, settings);
                            folderName = mainScript.generateChatFolderName(
                                fullConversationData,
                                fullConversationData.project || null,
                                template
                            );
                        }

                        // Use main script's function for raw API export
                        await mainScript.exportSingleConversationRawApiData(fullConversationData, archiveManager, folderName);
                        totalExported++;
                    } catch (error) {
                        console.warn(`Failed to export raw API data for conversation ${conversation.name}:`, error);
                    }

                    await delay(200);
                }
            }

            if (archiveManager && archiveManager.fileCount > 0) {
                let exportName;
                if (exportType === 'projects') {
                    exportName = `${selectedData.length} Projects Raw API Export`;
                } else {
                    exportName = `${selectedData.length} Conversations Raw API Export`;
                }

                const archiveName = mainScript.generateArchiveName({
                    name: exportName,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    uuid: 'raw-api-mass-export'
                }, settings.massExportArchiveName, true, exportType === 'projects' ? 'Projects_Raw_API' : 'Conversations_Raw_API');

                await archiveManager.downloadArchive(archiveName);
            }

            if (exportType === 'projects') {
                showNotification(`✅ Raw API mass export completed! Downloaded ${totalExported} JSON files from ${totalConversations} conversations across ${selectedData.length} projects`, 'success');
            } else {
                showNotification(`✅ Raw API export completed! Downloaded ${totalExported} JSON files from ${selectedData.length} conversations`, 'success');
            }

        } catch (error) {
            console.error('Raw API mass export failed:', error);
            showNotification(`❌ Raw API mass export failed: ${error.message}`, 'error');
        }
    }

    // =============================================
    // MAIN EXPORT FUNCTIONS
    // =============================================

    async function exportAllProjects(exportMode = 'final', mainBranchOnly = false, rawApiMode = false) {
        try {
            showNotification('Fetching projects...', 'info');
            const projects = await getAllProjects();

            if (projects.length === 0) {
                showNotification('No projects found to export', 'info');
                return;
            }

            const projectItems = projects.map(project => ({ ...project, name: project.name }));

            createSelectionUI('Select Projects to Export', projectItems, async (selectedData) => {
                if (rawApiMode) {
                    await performRawApiMassExport(selectedData, 'projects', 'Raw API Export - Selected Projects');
                } else {
                    const modeText = mainBranchOnly ? 'main branch' : (exportMode === 'none' ? 'conversations only' : exportMode);
                    await performMassExport(selectedData, exportMode, mainBranchOnly, 'projects', `Mass Export - Selected Projects (${modeText})`);
                }
            });

        } catch (error) {
            console.error('Failed to fetch projects:', error);
            showNotification(`❌ Failed to fetch projects: ${error.message}`, 'error');
        }
    }

    async function exportCurrentProject(exportMode = 'final', mainBranchOnly = false, rawApiMode = false) {
        const context = getCurrentContext();
        if (context.type !== 'project') {
            showNotification('❌ Not in a project page. Please navigate to a project first.', 'error');
            return;
        }

        try {
            showNotification('Fetching project conversations...', 'info');
            const conversations = await getProjectConversations(context.projectId);

            if (conversations.length === 0) {
                showNotification('No conversations found in this project', 'info');
                return;
            }

            // Sort conversations using saved settings
            const sortSettings = loadSortSettings(false);
            const sortedConversations = sortItemsByDate(conversations, sortSettings.sortBy, sortSettings.sortDirection);

            // Show selection UI
            const conversationItems = sortedConversations.map(conv => ({ ...conv, name: conv.name }));

            createSelectionUI('Select Conversations to Export', conversationItems, async (selectedConversations) => {
                if (rawApiMode) {
                    await performRawApiMassExport(selectedConversations, 'project', 'Raw API Export - Selected Conversations');
                } else {
                    const modeText = mainBranchOnly ? 'main branch' : (exportMode === 'none' ? 'conversations only' : exportMode);
                    await performMassExport(selectedConversations, exportMode, mainBranchOnly, 'project', `Export Selected Conversations (${modeText})`);
                }
            });

        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            showNotification(`❌ Failed to fetch conversations: ${error.message}`, 'error');
        }
    }

    async function exportAllRecentConversations(exportMode = 'final', mainBranchOnly = false, rawApiMode = false) {
        try {
            showNotification('Fetching recent conversations...', 'info');
            const conversations = await getAllRecentConversations();

            if (conversations.length === 0) {
                showNotification('No recent conversations found', 'info');
                return;
            }

            const conversationItems = conversations.map(conv => ({ ...conv, name: conv.name }));

            createSelectionUI('Select Recent Conversations to Export', conversationItems, async (selectedConversations) => {
                if (rawApiMode) {
                    await performRawApiMassExport(selectedConversations, 'recents', 'Raw API Export - Selected Recent Conversations');
                } else {
                    const modeText = mainBranchOnly ? 'main branch' : (exportMode === 'none' ? 'conversations only' : exportMode);
                    await performMassExport(selectedConversations, exportMode, mainBranchOnly, 'recents', `Export Selected Recent Conversations (${modeText})`);
                }
            });

        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            showNotification(`❌ Failed to fetch conversations: ${error.message}`, 'error');
        }
    }

    // =============================================
    // STYLES (MINIMAL - ONLY SELECTION SPECIFIC)
    // =============================================

    function getSelectionStyles() {
        return `<style id="claude-selection-styles">
            .claude-selection-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:99999;font-family:system-ui,-apple-system,sans-serif}
            .claude-selection-modal{background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.3);width:90%;max-width:700px;max-height:80vh;overflow:hidden;display:flex;flex-direction:column}
            .claude-selection-header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:20px 24px;display:flex;align-items:center;justify-content:space-between}
            .claude-selection-header h3{margin:0;font-size:18px;font-weight:600}
            .claude-selection-close{background:none;border:none;color:white;font-size:24px;cursor:pointer;padding:0;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background-color 0.2s}
            .claude-selection-close:hover{background:rgba(255,255,255,0.2)}
            .claude-selection-content{flex:1;overflow-y:auto;padding:24px}
            .claude-selection-controls{display:flex;gap:8px;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid #e2e8f0;flex-wrap:wrap}
            .claude-selection-count{margin-left:auto;font-size:14px;color:#718096;font-weight:500}
            .claude-sort-controls{display:flex;gap:6px;align-items:center;margin-left:16px;padding-left:16px;border-left:1px solid #e2e8f0}
            .claude-sort-label{font-size:12px;color:#718096;font-weight:500}
            .claude-sort-select{padding:4px 8px;border:1px solid #e2e8f0;border-radius:4px;font-size:12px;background:white}
            .claude-sort-select:focus{outline:none;border-color:#667eea}
            .claude-selection-list{display:grid;gap:8px}
            .claude-selection-item{display:flex;align-items:flex-start;gap:12px;padding:12px;border:1px solid #e2e8f0;border-radius:8px;transition:all 0.2s}
            .claude-selection-item:hover{background:#f8fafc;border-color:#667eea}
            .claude-selection-checkbox{margin-top:2px;transform:scale(1.2)}
            .claude-selection-label{flex:1;cursor:pointer;line-height:1.4}
            .claude-selection-name{font-weight:500;color:#2d3748;margin-bottom:4px}
            .claude-selection-meta{font-size:13px;color:#718096}

            .claude-project-item{border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;transition:all 0.2s}
            .claude-project-item:hover{border-color:#667eea}
            .claude-project-header{display:flex;align-items:center;gap:8px;padding:12px;background:#f8fafc}
            .claude-project-toggle{background:none;border:none;color:#718096;cursor:pointer;font-size:12px;padding:4px;border-radius:4px;transition:all 0.2s;min-width:20px}
            .claude-project-toggle:hover{background:#e2e8f0}
            .claude-toggle-icon{transition:transform 0.2s;display:inline-block}
            .claude-toggle-icon.expanded{transform:rotate(90deg)}
            .claude-project-checkbox{transform:scale(1.2)}
            .claude-project-label{flex:1;cursor:pointer;line-height:1.4}
            .claude-project-name{font-weight:600;color:#2d3748;margin-bottom:4px}
            .claude-project-meta{font-size:13px;color:#718096}
            .chat-count{font-weight:500;color:#667eea}

            .claude-project-chats{background:#fff;border-top:1px solid #e2e8f0}
            .claude-chat-item{display:flex;align-items:center;gap:12px;padding:8px 16px 8px 48px;transition:all 0.2s;border-bottom:1px solid #f1f5f9}
            .claude-chat-item:last-child{border-bottom:none}
            .claude-chat-item:hover{background:#f8fafc}
            .claude-chat-checkbox{transform:scale(1.1)}
            .claude-chat-label{flex:1;cursor:pointer;line-height:1.3}
            .claude-chat-name{font-weight:500;color:#374151;margin-bottom:2px}
            .claude-chat-meta{font-size:12px;color:#9ca3af}
            .claude-loading{padding:16px;text-align:center;color:#718096;font-style:italic}
            .claude-error{padding:16px;text-align:center;color:#ef4444;font-size:13px}

            .claude-btn{padding:8px 16px;border:none;border-radius:6px;font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s}
            .claude-btn-primary{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white}
            .claude-btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 12px rgba(102,126,234,0.4)}
            .claude-btn-primary:disabled{opacity:0.5;cursor:not-allowed}
            .claude-btn-secondary{background:#e2e8f0;color:#2d3748;font-size:12px;padding:6px 12px}
            .claude-btn-secondary:hover{background:#cbd5e0}
            .claude-selection-footer{background:#f8fafc;padding:20px 24px;border-top:1px solid #e2e8f0;display:flex;gap:12px;justify-content:flex-end}
            @media (prefers-color-scheme: dark){.claude-sort-select{color:#1f2937!important}.claude-sort-select option{color:#1f2937!important}}
        </style>`;
    }

    function getProgressStyles() {
        return `<style id="claude-progress-styles">
            .claude-progress-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);display:flex;align-items:center;justify-content:center;z-index:99999;font-family:system-ui,-apple-system,sans-serif}
            .claude-progress-modal{background:#fff;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.3);width:90%;max-width:500px;overflow:hidden}
            .claude-progress-header{background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:20px 24px;display:flex;align-items:center;justify-content:space-between}
            .claude-progress-header h3{margin:0;font-size:18px;font-weight:600}
            .claude-progress-close{background:none;border:none;color:white;font-size:24px;cursor:pointer;padding:0;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background-color 0.2s}
            .claude-progress-close:hover{background:rgba(255,255,255,0.2)}
            .claude-progress-content{padding:24px}
            .claude-progress-bar{width:100%;height:8px;background:#e2e8f0;border-radius:4px;overflow:hidden;margin-bottom:16px}
            .claude-progress-fill{height:100%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);transition:width 0.3s ease;border-radius:4px}
            .claude-progress-text{font-size:16px;font-weight:500;color:#2d3748;margin-bottom:8px}
            .claude-progress-details{font-size:14px;color:#718096;line-height:1.5;min-height:20px}
        </style>`;
    }

    // =============================================
    // INITIALIZATION
    // =============================================

    async function waitForMainScript() {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 50;

            const checkInterval = setInterval(() => {
                attempts++;
                if (typeof window.claudeExporter !== 'undefined') {
                    console.log(`[Claude Mass Exporter] Main script found after ${attempts} attempts`);
                    clearInterval(checkInterval);
                    resolve(true);
                }

                if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    resolve(false);
                }
            }, 100);
        });
    }

    async function init() {
        console.log('[Claude Mass Exporter] Initializing...');

        const mainScriptLoaded = await waitForMainScript();

        if (!mainScriptLoaded) {
            console.error('[Claude Mass Exporter] Main script not detected after 5 seconds');
            return;
        }

        if (!checkDependency()) return;

        console.log('[Claude Mass Exporter] Main script detected, exposing mass export functions...');

        window.claudeMassExporter = {
            exportAllProjects,
            exportCurrentProject,
            exportAllRecentConversations,
        };

        console.log('[Claude Mass Exporter] Enhanced export functionality activated!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
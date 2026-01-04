// ==UserScript==
// @name         The West Rankings CSV Exporter
// @namespace    TW-Export-Player-CSV
// @version      2.0
// @description  Extract player rankings data (name, level, experience) and export to CSV, JSON
// @author       Frozah
// @include https://*.the-west.*/game.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/544959/The%20West%20Rankings%20CSV%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/544959/The%20West%20Rankings%20CSV%20Exporter.meta.js
// ==/UserScript==

(function (fn) {
    var script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
})(function () {

    RankingExporter = {
        version: '2.0',
        name: 'Rankings CSV Exporter',
        author: 'Frozah',

        // Configuration with persistent storage
        config: {
            includeAllPages: true,
            maxRetries: 3,
            baseDelay: 1000,
            adaptiveDelay: true,
            exportFormat: 'csv', // csv, json, excel
            columns: ['rank', 'name', 'level', 'experience'],
            filters: {
                minLevel: null,
                maxLevel: null,
                minRank: null,
                maxRank: null
            },
            autoSave: true,
            logLevel: 'info' // debug, info, warn, error
        },

        // Runtime data
        playersData: [],
        currentPage: 1,
        totalPages: 16,
        isScrapingInProgress: false,
        progressBar: null,
        progressDialog: null,
        selectBox: null,
        retryCount: 0,
        startTime: null,

        // Performance tracking
        performance: {
            averagePageTime: 1000,
            pageLoadTimes: [],
            errors: []
        },

        // Initialize the script
        init: function() {
            this.loadConfig();
            this.validateGameStructure();
            this.createAdvancedSelectBox();
            this.addMenuButton();
            this.log('Script initialized successfully', 'info');
        },

        // Load persistent configuration
        loadConfig: function() {
            try {
                if (typeof GM_getValue !== 'undefined') {
                    var savedConfig = GM_getValue('rankingExporterConfig', null);
                    if (savedConfig) {
                        this.config = Object.assign(this.config, JSON.parse(savedConfig));
                    }
                }
            } catch (e) {
                this.log('Error loading config: ' + e.message, 'warn');
            }
        },

        // Save configuration
        saveConfig: function() {
            try {
                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue('rankingExporterConfig', JSON.stringify(this.config));
                }
            } catch (e) {
                this.log('Error saving config: ' + e.message, 'warn');
            }
        },

        // Validate game structure before operation
        validateGameStructure: function() {
            var requiredElements = [
                '.ranking-experience',
                '.rl_pagebar_ranking',
                '.exp_playername',
                '.exp_level',
                '.exp_exp',
                '.exp_rank'
            ];

            var missingElements = [];
            requiredElements.forEach(function(selector) {
                if ($(selector).length === 0) {
                    missingElements.push(selector);
                }
            });

            if (missingElements.length > 0) {
                this.log('Warning: Some game elements not found: ' + missingElements.join(', '), 'warn');
                new UserMessage('Game structure may have changed. Some features might not work correctly.', UserMessage.TYPE_ERROR).show();
                return false;
            }
            return true;
        },

        // Enhanced logging system
        log: function(message, level) {
            level = level || 'info';
            var levels = ['debug', 'info', 'warn', 'error'];
            var currentLevelIndex = levels.indexOf(this.config.logLevel);
            var messageLevelIndex = levels.indexOf(level);

            if (messageLevelIndex >= currentLevelIndex) {
                var timestamp = new Date().toISOString();
                var logMessage = '[' + timestamp + '] [' + level.toUpperCase() + '] RankingExporter: ' + message;

                switch(level) {
                    case 'error':
                        console.error(logMessage);
                        break;
                    case 'warn':
                        console.warn(logMessage);
                        break;
                    default:
                        console.log(logMessage);
                }
            }
        },

        // Create advanced select box with more options
        createAdvancedSelectBox: function() {
            var self = this;
            var listener = function(action) {
                switch(action) {
                    case 'export_current':
                        self.exportCurrentPage();
                        break;
                    case 'export_all':
                        self.exportAllPages();
                        break;
                    case 'export_filtered':
                        self.showFilterDialog();
                        break;
                    case 'export_range':
                        self.showRangeDialog();
                        break;
                    case 'stop_scraping':
                        self.stopScraping();
                        break;
                    case 'settings':
                        self.showSettingsDialog();
                        break;
                    case 'resume_export':
                        self.resumeExport();
                        break;
                }
            };

            this.selectBox = new west.gui.Selectbox()
                .setWidth(250)
                .addListener(listener)
                .addItem('export_current', 'Export Current Page')
                .addItem('export_all', 'Export All Pages')
                .addItem('export_filtered', 'Export with Filters')
                .addItem('export_range', 'Export Range')
                .addItem('stop_scraping', 'Stop Scraping')
                .addItem('settings', 'Settings')
                .addItem('resume_export', 'Resume Export');
        },

        // Add enhanced menu button
        addMenuButton: function() {
            var self = this;

            // Remove existing button if any
            $('#RankingExportermenu').parent().remove();

            var menuButton = $('<div id="RankingExportermenu" class="menulink" title="' + this.name + ' v' + this.version + '" />')
                .css({
                    'background': 'linear-gradient(45deg, #8B4513, #A0522D)',
                    'width': '25px',
                    'height': '25px',
                    'cursor': 'pointer',
                    'border': '2px solid #654321',
                    'border-radius': '3px',
                    'margin': '2px',
                    'position': 'relative',
                    'box-shadow': '0 2px 4px rgba(0,0,0,0.3)',
                    'transition': 'all 0.2s ease'
                })
                .on('mouseenter', function() {
                    $(this).css({
                        'background': 'linear-gradient(45deg, #A0522D, #CD853F)',
                        'transform': 'scale(1.1)'
                    });
                })
                .on('mouseleave', function() {
                    $(this).css({
                        'background': 'linear-gradient(45deg, #8B4513, #A0522D)',
                        'transform': 'scale(1)'
                    });
                })
                .click(function() {
                    self.toggleSelectbox();
                });

            // Add CSV icon
            $('<div>').css({
                'position': 'absolute',
                'top': '50%',
                'left': '50%',
                'transform': 'translate(-50%, -50%)',
                'color': 'white',
                'font-weight': 'bold',
                'font-size': '10px',
                'text-shadow': '1px 1px 1px rgba(0,0,0,0.7)'
            }).text('CSV').appendTo(menuButton);

            var div = $('<div class="ui_menucontainer" />')
                .append(menuButton)
                .append('<div class="menucontainer_bottom" />');

            // Try to add to menu bar, with fallback
            var menuBar = $('#ui_menubar');
            if (menuBar.length > 0) {
                menuBar.append(div);
                this.log('Menu button added successfully', 'debug');
            } else {
                // Fallback: try to find any menu container
                var menuContainer = $('.ui_menucontainer').first().parent();
                if (menuContainer.length > 0) {
                    menuContainer.append(div);
                    this.log('Menu button added to fallback location', 'debug');
                } else {
                    this.log('Could not find menu location', 'error');
                    // Create floating button as last resort
                    this.createFloatingButton();
                }
            }
        },

        // Create floating button as fallback
        createFloatingButton: function() {
            var self = this;

            var floatingButton = $('<div id="RankingExporterFloat" />')
                .css({
                    'position': 'fixed',
                    'top': '100px',
                    'right': '20px',
                    'width': '50px',
                    'height': '50px',
                    'background': 'linear-gradient(45deg, #8B4513, #A0522D)',
                    'border': '3px solid #654321',
                    'border-radius': '50%',
                    'cursor': 'pointer',
                    'z-index': '9999',
                    'box-shadow': '0 4px 8px rgba(0,0,0,0.4)',
                    'display': 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    'color': 'white',
                    'font-weight': 'bold',
                    'font-size': '12px',
                    'text-shadow': '1px 1px 1px rgba(0,0,0,0.7)',
                    'transition': 'all 0.2s ease'
                })
                .text('CSV')
                .on('mouseenter', function() {
                    $(this).css({
                        'background': 'linear-gradient(45deg, #A0522D, #CD853F)',
                        'transform': 'scale(1.1)'
                    });
                })
                .on('mouseleave', function() {
                    $(this).css({
                        'background': 'linear-gradient(45deg, #8B4513, #A0522D)',
                        'transform': 'scale(1)'
                    });
                })
                .click(function() {
                    self.toggleSelectbox();
                })
                .attr('title', this.name + ' v' + this.version);

            $('body').append(floatingButton);
            this.log('Floating button created as fallback', 'info');
        },

        // Show settings dialog
        showSettingsDialog: function() {
            var self = this;
            var content = $('<div></div>');

            // Export format selection
            content.append('<h3>Export Settings</h3>');
            var formatSelect = $('<select id="exportFormat">')
                .append('<option value="csv">CSV</option>')
                .append('<option value="json">JSON</option>')
                .val(this.config.exportFormat);
            content.append($('<p>Format: </p>').append(formatSelect));

            // Performance settings
            content.append('<h3>Performance Settings</h3>');
            var adaptiveDelay = $('<input type="checkbox" id="adaptiveDelay">')
                .prop('checked', this.config.adaptiveDelay);
            content.append($('<p>Adaptive delay: </p>').append(adaptiveDelay));

            var baseDelay = $('<input type="number" id="baseDelay" min="500" max="5000" step="100">')
                .val(this.config.baseDelay);
            content.append($('<p>Base delay (ms): </p>').append(baseDelay));

            // Auto-save settings
            var autoSave = $('<input type="checkbox" id="autoSave">')
                .prop('checked', this.config.autoSave);
            content.append($('<p>Auto-save progress: </p>').append(autoSave));

            var dialog = new west.gui.Dialog("Settings", content);
            dialog.addButton("Save", function() {
                self.config.exportFormat = formatSelect.val();
                self.config.adaptiveDelay = adaptiveDelay.is(':checked');
                self.config.baseDelay = parseInt(baseDelay.val());
                self.config.autoSave = autoSave.is(':checked');
                self.saveConfig();
                dialog.hide();
                new UserMessage('Settings saved!', UserMessage.TYPE_SUCCESS).show();
            });
            dialog.addButton("Cancel", function() {
                dialog.hide();
            });
            dialog.show();
        },

        // Show filter dialog
        showFilterDialog: function() {
            var self = this;
            var content = $('<div></div>');

            content.append('<h3>Filter Options</h3>');

            var minLevel = $('<input type="number" id="minLevel" placeholder="Min Level">');
            var maxLevel = $('<input type="number" id="maxLevel" placeholder="Max Level">');
            var minRank = $('<input type="number" id="minRank" placeholder="Min Rank">');
            var maxRank = $('<input type="number" id="maxRank" placeholder="Max Rank">');

            content.append($('<p>Level range: </p>').append(minLevel).append(' - ').append(maxLevel));
            content.append($('<p>Rank range: </p>').append(minRank).append(' - ').append(maxRank));

            var dialog = new west.gui.Dialog("Export with Filters", content);
            dialog.addButton("Export", function() {
                self.config.filters.minLevel = minLevel.val() || null;
                self.config.filters.maxLevel = maxLevel.val() || null;
                self.config.filters.minRank = minRank.val() || null;
                self.config.filters.maxRank = maxRank.val() || null;
                dialog.hide();
                self.exportAllPages(true);
            });
            dialog.addButton("Cancel", function() {
                dialog.hide();
            });
            dialog.show();
        },

        // Enhanced data extraction with error handling
        extractCurrentPageData: function() {
            var self = this;
            var data = [];
            var startTime = Date.now();

            try {
                // Check if we're actually on the rankings page
                if (!this.isOnRankingsPage()) {
                    new UserMessage('Please navigate to the rankings page first', UserMessage.TYPE_ERROR).show();
                    return [];
                }

                var rows = $('.ranking-experience .tbody .tw2gui_scrollpane_clipper_contentpane .row');
                this.log('Found ' + rows.length + ' rows on current page', 'debug');

                rows.each(function(index) {
                    try {
                        var row = $(this);
                        var playerData = self.extractPlayerData(row);

                        if (playerData && self.applyFilters(playerData)) {
                            data.push(playerData);
                        }
                    } catch (e) {
                        self.log('Error extracting data from row ' + index + ': ' + e.message, 'warn');
                    }
                });

                var extractionTime = Date.now() - startTime;
                this.log('Extracted ' + data.length + ' players in ' + extractionTime + 'ms', 'debug');

            } catch (e) {
                this.log('Error in extractCurrentPageData: ' + e.message, 'error');
                this.performance.errors.push({
                    timestamp: Date.now(),
                    error: e.message,
                    page: this.currentPage
                });
            }

            return data;
        },

        // Extract individual player data
        extractPlayerData: function(row) {
            var playerNameCell = row.find('.exp_playername a');
            var playerName = '';

            if (playerNameCell.length > 0) {
                playerName = playerNameCell.text().trim();
            } else {
                playerName = row.find('.exp_playername').text().trim();
            }

            var level = row.find('.exp_level').text().trim();
            var experience = row.find('.exp_exp').text().trim();
            var rank = row.find('.exp_rank').text().trim();

            if (playerName && level && experience && rank) {
                return {
                    rank: parseInt(rank) || rank,
                    name: playerName,
                    level: parseInt(level) || level,
                    experience: experience,
                    rawExperience: this.parseExperience(experience)
                };
            }
            return null;
        },

        // Parse experience string to number
        parseExperience: function(expString) {
            if (!expString) return 0;
            // Remove dots and commas for international number formats
            return parseInt(expString.replace(/[.,]/g, '')) || 0;
        },

        // Apply filters to player data
        applyFilters: function(playerData) {
            var filters = this.config.filters;

            if (filters.minLevel && playerData.level < filters.minLevel) return false;
            if (filters.maxLevel && playerData.level > filters.maxLevel) return false;
            if (filters.minRank && playerData.rank < filters.minRank) return false;
            if (filters.maxRank && playerData.rank > filters.maxRank) return false;

            return true;
        },

        // Enhanced export all pages with better error handling
        exportAllPages: function(useFilters) {
            if (this.isScrapingInProgress) {
                new UserMessage('Scraping already in progress...', UserMessage.TYPE_ERROR).show();
                return;
            }

            // Check if we're on the rankings page
            if (!this.isOnRankingsPage()) {
                new UserMessage('Please navigate to the rankings page first', UserMessage.TYPE_ERROR).show();
                return;
            }

            if (!this.validateGameStructure()) {
                return;
            }

            this.isScrapingInProgress = true;
            this.playersData = [];
            this.currentPage = 1;
            this.retryCount = 0;
            this.startTime = Date.now();
            this.performance.pageLoadTimes = [];
            this.performance.errors = [];

            this.getTotalPages();

            var filterText = useFilters ? ' with filters' : '';
            new UserMessage('Starting scraping of ' + this.totalPages + ' pages' + filterText + '...', UserMessage.TYPE_HINT).show();
            this.log('Starting export of ' + this.totalPages + ' pages', 'info');

            this.createEnhancedProgressDialog();
            this.scrapePage(1);
        },

        // Enhanced progress dialog
        createEnhancedProgressDialog: function() {
            var self = this;
            var content = $('<div></div>');

            content.append('<p id="scrapingStatus">Scraping in progress...</p>');
            content.append('<p id="timeInfo">Estimated time remaining: Calculating...</p>');

            this.progressBar = new west.gui.Progressbar(0, this.totalPages);
            content.append(this.progressBar.getMainDiv());

            content.append('<div id="statsInfo" style="font-size: 12px; margin-top: 10px;"></div>');

            this.progressDialog = new west.gui.Dialog("Enhanced Export Progress", content);
            this.progressDialog.addButton("Pause", function() {
                self.pauseScraping();
            });
            this.progressDialog.addButton("Cancel", function() {
                self.stopScraping();
                self.progressDialog.hide();
            });
            this.progressDialog.show();
        },

        // Enhanced page scraping with retry logic
        scrapePage: function(pageNumber) {
            var self = this;
            var pageStartTime = Date.now();

            if (!this.isScrapingInProgress || pageNumber > this.totalPages) {
                this.finalizeScraping();
                return;
            }

            this.updateProgress(pageNumber, pageStartTime);

            this.log('Scraping page ' + pageNumber + '/' + this.totalPages, 'debug');

            this.goToPageWithRetry(pageNumber, function(success) {
                if (!success) {
                    self.log('Failed to navigate to page ' + pageNumber + ' after retries', 'error');
                    if (self.retryCount < self.config.maxRetries) {
                        self.retryCount++;
                        setTimeout(function() {
                            self.scrapePage(pageNumber);
                        }, self.getAdaptiveDelay() * 2);
                        return;
                    } else {
                        new UserMessage('Too many failures, stopping export', UserMessage.TYPE_ERROR).show();
                        self.stopScraping();
                        return;
                    }
                }

                self.retryCount = 0;
                var delay = self.getAdaptiveDelay();

                setTimeout(function() {
                    self.waitForPageLoad(function() {
                        var pageData = self.extractCurrentPageData();
                        self.playersData = self.playersData.concat(pageData);

                        var pageTime = Date.now() - pageStartTime;
                        self.performance.pageLoadTimes.push(pageTime);
                        self.updatePerformanceStats();

                        self.log('Page ' + pageNumber + ' completed: ' + pageData.length + ' players in ' + pageTime + 'ms', 'info');

                        // Auto-save progress
                        if (self.config.autoSave && pageNumber % 5 === 0) {
                            self.saveProgress();
                        }

                        setTimeout(function() {
                            self.scrapePage(pageNumber + 1);
                        }, delay);
                    });
                }, Math.min(delay, 1000));
            });
        },

        // Navigate to page with retry logic
        goToPageWithRetry: function(pageNumber, callback, attempt) {
            attempt = attempt || 1;
            var self = this;

            if (attempt > this.config.maxRetries) {
                callback(false);
                return;
            }

            this.log('Navigation attempt ' + attempt + ' to page ' + pageNumber, 'debug');

            this.goToPage(pageNumber, function(success) {
                if (success) {
                    callback(true);
                } else {
                    self.log('Navigation attempt ' + attempt + ' failed, retrying...', 'warn');
                    setTimeout(function() {
                        self.goToPageWithRetry(pageNumber, callback, attempt + 1);
                    }, self.getAdaptiveDelay());
                }
            });
        },

        // Enhanced navigation with success callback
        goToPage: function(pageNumber, callback) {
            var self = this;
            var success = false;

            try {
                // Method 1: Direct input field
                var pageInput = $('.rl_pagebar_ranking .tw2gui_textfield input[type="text"]');
                if (pageInput.length > 0) {
                    pageInput.val(pageNumber);
                    pageInput.trigger('input').trigger('change');

                    var enterEvent = jQuery.Event('keypress');
                    enterEvent.which = 13;
                    enterEvent.keyCode = 13;
                    pageInput.trigger(enterEvent);

                    success = true;
                    setTimeout(function() {
                        callback(success);
                    }, 800);
                    return;
                }

                // Method 2: Ajax call
                if (typeof Ajax !== 'undefined' && Ajax.remoteCall) {
                    Ajax.remoteCall("ranking", "get_ranking_page", {
                        page: pageNumber,
                        type: "experience"
                    }, function(response) {
                        success = true;
                        setTimeout(function() {
                            callback(success);
                        }, 500);
                    }, function(error) {
                        self.log('Ajax call failed: ' + error, 'warn');
                        callback(false);
                    });
                    return;
                }

                // Method 3: Click pagination link
                var pageLink = $('.rl_pagebar_ranking .pagebar_page').filter(function() {
                    return $(this).text() == pageNumber;
                });

                if (pageLink.length > 0) {
                    pageLink.click();
                    success = true;
                    setTimeout(function() {
                        callback(success);
                    }, 800);
                    return;
                }

                callback(false);

            } catch (e) {
                this.log('Error in goToPage: ' + e.message, 'error');
                callback(false);
            }
        },

        // Get adaptive delay based on performance
        getAdaptiveDelay: function() {
            if (!this.config.adaptiveDelay) {
                return this.config.baseDelay;
            }

            var avgTime = this.performance.averagePageTime;
            var errorRate = this.performance.errors.length / Math.max(this.performance.pageLoadTimes.length, 1);

            // Increase delay if there are errors or slow performance
            var adaptiveMultiplier = 1 + (errorRate * 2) + (avgTime > 2000 ? 0.5 : 0);

            return Math.min(this.config.baseDelay * adaptiveMultiplier, 5000);
        },

        // Update performance statistics
        updatePerformanceStats: function() {
            if (this.performance.pageLoadTimes.length > 0) {
                var sum = this.performance.pageLoadTimes.reduce(function(a, b) { return a + b; }, 0);
                this.performance.averagePageTime = sum / this.performance.pageLoadTimes.length;
            }
        },

        // Update progress dialog
        updateProgress: function(pageNumber, pageStartTime) {
            if (this.progressBar) {
                this.progressBar.setValue(pageNumber - 1);
            }

            if (this.progressDialog) {
                var elapsed = Date.now() - this.startTime;
                var avgPageTime = this.performance.averagePageTime;
                var remainingPages = this.totalPages - pageNumber + 1;
                var estimatedRemaining = (remainingPages * avgPageTime) / 1000;

                $('#scrapingStatus').text('Scraping page ' + pageNumber + '/' + this.totalPages + '...');
                $('#timeInfo').text('Estimated time remaining: ' + Math.round(estimatedRemaining) + 's');
                $('#statsInfo').html(
                    'Players collected: ' + this.playersData.length + '<br>' +
                    'Average page time: ' + Math.round(avgPageTime) + 'ms<br>' +
                    'Errors: ' + this.performance.errors.length
                );
            }
        },

        // Save progress to localStorage
        saveProgress: function() {
            try {
                var progressData = {
                    playersData: this.playersData,
                    currentPage: this.currentPage,
                    totalPages: this.totalPages,
                    timestamp: Date.now()
                };

                if (typeof GM_setValue !== 'undefined') {
                    GM_setValue('exportProgress', JSON.stringify(progressData));
                }
                this.log('Progress saved at page ' + this.currentPage, 'debug');
            } catch (e) {
                this.log('Error saving progress: ' + e.message, 'warn');
            }
        },

        // Resume export from saved progress
        resumeExport: function() {
            try {
                if (typeof GM_getValue !== 'undefined') {
                    var progressData = GM_getValue('exportProgress', null);
                    if (progressData) {
                        progressData = JSON.parse(progressData);

                        // Check if progress is recent (within 24 hours)
                        if (Date.now() - progressData.timestamp < 24 * 60 * 60 * 1000) {
                            this.playersData = progressData.playersData;
                            this.currentPage = progressData.currentPage;
                            this.totalPages = progressData.totalPages;

                            new UserMessage('Resuming from page ' + this.currentPage + ' (' + this.playersData.length + ' players already collected)', UserMessage.TYPE_SUCCESS).show();

                            this.isScrapingInProgress = true;
                            this.createEnhancedProgressDialog();
                            this.scrapePage(this.currentPage);
                            return;
                        }
                    }
                }

                new UserMessage('No recent progress found to resume', UserMessage.TYPE_ERROR).show();
            } catch (e) {
                this.log('Error resuming export: ' + e.message, 'error');
                new UserMessage('Error resuming export', UserMessage.TYPE_ERROR).show();
            }
        },

        // Enhanced CSV generation with multiple formats
        generateExport: function(data, filename) {
            if (data.length === 0) {
                new UserMessage('No data to export', UserMessage.TYPE_ERROR).show();
                return;
            }

            switch (this.config.exportFormat) {
                case 'json':
                    this.generateJSON(data, filename.replace('.csv', '.json'));
                    break;
                case 'csv':
                default:
                    this.generateCSV(data, filename);
                    break;
            }
        },

        // Generate JSON export
        generateJSON: function(data, filename) {
            var exportData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    totalPlayers: data.length,
                    version: this.version,
                    filters: this.config.filters
                },
                players: data
            };

            var jsonContent = JSON.stringify(exportData, null, 2);
            this.downloadFile(jsonContent, filename, 'application/json');
        },

        // Enhanced CSV generation
        generateCSV: function(data, filename) {
            var csv = 'Rank,Player Name,Level,Experience,Raw Experience\n';

            data.forEach(function(player) {
                var name = '"' + player.name.replace(/"/g, '""') + '"';
                var experience = '"' + player.experience.replace(/"/g, '""') + '"';

                csv += player.rank + ',' + name + ',' + player.level + ',' + experience + ',' + player.rawExperience + '\n';
            });

            this.downloadFile(csv, filename, 'text/csv');
        },

        // Enhanced file download
        downloadFile: function(content, filename, mimeType) {
            try {
                var blob = new Blob([content], { type: mimeType + ';charset=utf-8;' });
                var link = document.createElement('a');

                if (link.download !== undefined) {
                    var url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', filename);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    this.log('File downloaded: ' + filename, 'info');
                }
            } catch (e) {
                this.log('Error downloading file: ' + e.message, 'error');
                new UserMessage('Error downloading file', UserMessage.TYPE_ERROR).show();
            }
        },

        // Enhanced finalization with statistics
        finalizeScraping: function() {
            this.isScrapingInProgress = false;

            if (this.progressDialog) {
                this.progressDialog.hide();
            }

            if (this.playersData.length === 0) {
                new UserMessage('No data collected', UserMessage.TYPE_ERROR).show();
                return;
            }

            // Clean up progress save
            if (typeof GM_deleteValue !== 'undefined') {
                GM_deleteValue('exportProgress');
            }

            // Sort and deduplicate
            this.playersData.sort(function(a, b) {
                return parseInt(a.rank) - parseInt(b.rank);
            });

            var uniqueData = this.removeDuplicates(this.playersData);
            var totalTime = Date.now() - this.startTime;

            this.generateExport(uniqueData, 'rankings_enhanced_export.' + this.config.exportFormat);

            var stats = 'Export completed!\n' +
                       'Players: ' + uniqueData.length + '\n' +
                       'Time: ' + Math.round(totalTime / 1000) + 's\n' +
                       'Avg page time: ' + Math.round(this.performance.averagePageTime) + 'ms\n' +
                       'Errors: ' + this.performance.errors.length;

            new UserMessage(stats, UserMessage.TYPE_SUCCESS).show();
            this.log('Export finalized: ' + uniqueData.length + ' players in ' + totalTime + 'ms', 'info');
        },

        // Remove duplicates more efficiently
        removeDuplicates: function(data) {
            var seen = {};
            return data.filter(function(player) {
                var key = player.rank + '_' + player.name;
                if (seen[key]) {
                    return false;
                }
                seen[key] = true;
                return true;
            });
        },

        // Pause scraping
        pauseScraping: function() {
            this.isScrapingInProgress = false;
            this.saveProgress();
            new UserMessage('Scraping paused. Use "Resume Export" to continue.', UserMessage.TYPE_HINT).show();
            if (this.progressDialog) {
                this.progressDialog.hide();
            }
        },

        // Show/hide select box
        toggleSelectbox: function() {
            var pos = $('div#RankingExportermenu').offset();
            pos = {
                clientX: pos.left,
                clientY: pos.top
            };
            this.selectBox.show(pos);
        },

        // Export current page with enhanced features
        exportCurrentPage: function() {
            var data = this.extractCurrentPageData();

            if (data.length === 0) {
                new UserMessage('No data found on this page', UserMessage.TYPE_ERROR).show();
                return;
            }

            var filename = 'rankings_current_page_' + Date.now() + '.' + this.config.exportFormat;
            this.generateExport(data, filename);
            new UserMessage('Current page exported (' + data.length + ' players)', UserMessage.TYPE_SUCCESS).show();
        },

        // Show range dialog for partial exports
        showRangeDialog: function() {
            var self = this;
            var content = $('<div></div>');

            content.append('<h3>Export Page Range</h3>');
            content.append('<p>Select the range of pages to export:</p>');

            var startPage = $('<input type="number" id="startPage" min="1" max="' + this.totalPages + '" value="1">');
            var endPage = $('<input type="number" id="endPage" min="1" max="' + this.totalPages + '" value="' + Math.min(5, this.totalPages) + '">');

            content.append($('<p>From page: </p>').append(startPage));
            content.append($('<p>To page: </p>').append(endPage));
            content.append('<p><small>Note: Large ranges may take several minutes</small></p>');

            var dialog = new west.gui.Dialog("Export Page Range", content);
            dialog.addButton("Export", function() {
                var start = parseInt(startPage.val()) || 1;
                var end = parseInt(endPage.val()) || 1;

                if (start > end) {
                    new UserMessage('Start page must be less than or equal to end page', UserMessage.TYPE_ERROR).show();
                    return;
                }

                if (start < 1 || end > self.totalPages) {
                    new UserMessage('Page numbers must be between 1 and ' + self.totalPages, UserMessage.TYPE_ERROR).show();
                    return;
                }

                dialog.hide();
                self.exportPageRange(start, end);
            });
            dialog.addButton("Cancel", function() {
                dialog.hide();
            });
            dialog.show();
        },

        // Export specific page range
        exportPageRange: function(startPage, endPage) {
            if (this.isScrapingInProgress) {
                new UserMessage('Scraping already in progress...', UserMessage.TYPE_ERROR).show();
                return;
            }

            this.isScrapingInProgress = true;
            this.playersData = [];
            this.currentPage = startPage;
            this.totalPages = endPage;
            this.retryCount = 0;
            this.startTime = Date.now();

            new UserMessage('Starting range export: pages ' + startPage + '-' + endPage, UserMessage.TYPE_HINT).show();
            this.log('Starting range export: pages ' + startPage + '-' + endPage, 'info');

            this.createEnhancedProgressDialog();
            this.scrapePage(startPage);
        },

        // Enhanced total pages detection
        getTotalPages: function() {
            try {
                // Method 1: Look for pagination text
                var paginationText = $('.rl_pagebar_ranking .maxpages').text();
                if (paginationText) {
                    var match = paginationText.match(/\/\s*(\d+)/);
                    if (match) {
                        this.totalPages = parseInt(match[1]);
                        this.log('Total pages detected (method 1): ' + this.totalPages, 'debug');
                        return;
                    }
                }

                // Method 2: Count pagination links
                var pageLinks = $('.rl_pagebar_ranking .pagebar_page');
                if (pageLinks.length > 0) {
                    var lastPage = 1;
                    pageLinks.each(function() {
                        var pageNum = parseInt($(this).text());
                        if (!isNaN(pageNum) && pageNum > lastPage) {
                            lastPage = pageNum;
                        }
                    });
                    this.totalPages = lastPage;
                    this.log('Total pages detected (method 2): ' + this.totalPages, 'debug');
                    return;
                }

                // Method 3: Try to calculate from total players (if available)
                var totalPlayersText = $('.ranking-experience .ranking_header').text();
                var totalPlayersMatch = totalPlayersText.match(/(\d+)\s*players?/i);
                if (totalPlayersMatch) {
                    var totalPlayers = parseInt(totalPlayersMatch[1]);
                    var playersPerPage = $('.ranking-experience .tbody .row').length || 25;
                    this.totalPages = Math.ceil(totalPlayers / playersPerPage);
                    this.log('Total pages calculated (method 3): ' + this.totalPages + ' (from ' + totalPlayers + ' players)', 'debug');
                    return;
                }

                // Default fallback
                this.totalPages = 16;
                this.log('Using default total pages: ' + this.totalPages, 'warn');

            } catch (e) {
                this.log('Error detecting total pages: ' + e.message, 'error');
                this.totalPages = 16;
            }
        },

        // Enhanced page load waiting with timeout
        waitForPageLoad: function(callback) {
            var self = this;
            var attempts = 0;
            var maxAttempts = 20; // Increased for better reliability
            var startTime = Date.now();

            var checkLoad = function() {
                attempts++;
                var rows = $('.ranking-experience .tbody .tw2gui_scrollpane_clipper_contentpane .row');
                var loadTime = Date.now() - startTime;

                // Check if page is loaded or timeout reached
                if (rows.length > 0) {
                    self.log('Page loaded successfully in ' + loadTime + 'ms (' + rows.length + ' rows)', 'debug');
                    callback();
                } else if (attempts >= maxAttempts || loadTime > 10000) {
                    self.log('Page load timeout after ' + loadTime + 'ms (' + attempts + ' attempts)', 'warn');
                    callback(); // Continue anyway
                } else {
                    setTimeout(checkLoad, 500);
                }
            };

            checkLoad();
        },

        // Stop scraping with cleanup
        stopScraping: function() {
            this.isScrapingInProgress = false;

            if (this.progressDialog) {
                this.progressDialog.hide();
            }

            // Save partial data if any
            if (this.playersData.length > 0 && this.config.autoSave) {
                var partialFilename = 'rankings_partial_' + Date.now() + '.' + this.config.exportFormat;
                this.generateExport(this.playersData, partialFilename);
                new UserMessage('Scraping stopped. Partial data saved (' + this.playersData.length + ' players)', UserMessage.TYPE_HINT).show();
            } else {
                new UserMessage('Scraping stopped', UserMessage.TYPE_ERROR).show();
            }

            this.log('Scraping stopped by user', 'info');
        },

        // Check if on rankings page
        isOnRankingsPage: function() {
            return $('.ranking-experience').length > 0 && $('.rl_pagebar_ranking').length > 0;
        },

        // Check if ranking elements exist (more flexible check)
        canAccessRankings: function() {
            // Check if we're in the game interface
            return $('#ui_menubar').length > 0 && (
                $('.ranking-experience').length > 0 ||
                $('a[href*="ranking"]').length > 0 ||
                $('.menulink').length > 0
            );
        },

        // Cleanup function
        cleanup: function() {
            this.isScrapingInProgress = false;

            if (this.progressDialog) {
                this.progressDialog.hide();
            }

            // Clear any remaining timeouts
            if (this.scrapingTimeout) {
                clearTimeout(this.scrapingTimeout);
            }

            this.log('Cleanup completed', 'debug');
        }
    };

    // Initialize when document and game objects are ready
    $(document).ready(function() {
        try {
            var initInterval = setInterval(function() {
                if (typeof west !== 'undefined' &&
                    typeof west.gui !== 'undefined' &&
                    typeof west.gui.Selectbox !== 'undefined' &&
                    typeof west.gui.Dialog !== 'undefined' &&
                    typeof west.gui.Progressbar !== 'undefined' &&
                    typeof UserMessage !== 'undefined') {

                    clearInterval(initInterval);

                    // Initialize if we can access the game interface
                    if (RankingExporter.canAccessRankings()) {
                        RankingExporter.init();
                        console.log('Rankings Exporter Enhanced initialized');
                    } else {
                        console.log('Game interface not detected, retrying...');
                        // Try again after a longer delay
                        setTimeout(function() {
                            if (RankingExporter.canAccessRankings()) {
                                RankingExporter.init();
                                console.log('Rankings Exporter Enhanced initialized (delayed)');
                            }
                        }, 5000);
                    }
                }
            }, 1000);

            // Cleanup on page unload
            $(window).on('beforeunload', function() {
                if (RankingExporter.isScrapingInProgress) {
                    RankingExporter.cleanup();
                    return 'Export in progress. Are you sure you want to leave?';
                }
            });

        } catch (e) {
            console.error('Error initializing Rankings Exporter Enhanced:', e);
        }
    });

    // Global error handler
    window.onerror = function(msg, url, lineNo, columnNo, error) {
        if (msg.indexOf('RankingExporter') !== -1) {
            RankingExporter.log('Global error: ' + msg + ' at line ' + lineNo, 'error');
            return true;
        }
        return false;
    };

    // Debug info
    console.log('Rankings CSV Exporter Enhanced v' + RankingExporter.version + ' loaded');
    console.log('Features: Adaptive delays, retry logic, multiple formats, filters, progress saving');

});
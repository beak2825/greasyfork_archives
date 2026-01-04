// ==UserScript==
// @name         Google Form Auto Filler with custom details
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically fill Google Forms with predefined data
// @author       Bibek Chand Sah
// @icon         https://ssl.gstatic.com/docs/forms/device_home/android_192.png
// @match        https://docs.google.com/forms/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546495/Google%20Form%20Auto%20Filler%20with%20custom%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/546495/Google%20Form%20Auto%20Filler%20with%20custom%20details.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Helper function to create field mappings from tag-to-fields format
    function createFieldMappings(tagToFields) {
        const mappings = {};
        Object.entries(tagToFields).forEach(([tag, fields]) => {
            fields.forEach(field => {
                mappings[field] = tag;
            });
        });
        return mappings;
    }

    // Default configuration with tags and field mappings
    let defaultTaggedData = {
        // Tags with their values
        tags: {
            'ROLL_NUMBER': '22054',
            'FULL_NAME': 'Your_name_here',
            'STREAM': 'B.Tech',
            'BRANCH': 'CSE',
            'GENDER': 'Male',
            'EMAIL': '@gmail.com',
            'MOBILE': 'Your_no_here',
            'TENTH_PERCENTAGE': '93.75',
            'TENTH_YOP': '2020',
            'TWELFTH_PERCENTAGE': '93.25',
            'TWELFTH_YOP': '2021',
            'GRADUATION_PERCENTAGE': '93.65',
            'GRADUATION_YOP': '2026',
            'NATIONALITY': 'Nepalese',
            'BACKLOGS': '0',
            'DATE_OF_BIRTH': '2002-12-28',
            'BIRTH_DATE': '2002-12-28',
            'DOB': '28/12/2002',
            'GRADUATION_DATE': '2026-05-15'
        },
        // Field mappings to tags - cleaner format with multiple fields per tag
        fieldMappings: createFieldMappings({
            'ROLL_NUMBER': ['Roll No', 'Roll'],
            'FULL_NAME': ['Full Name', 'Name', 'Aadhar Name'],
            'STREAM': ['Stream'],
            'BRANCH': ['Branch'],
            'GENDER': ['Gender'],
            'EMAIL': ['Mail ID', 'Email'],
            'MOBILE': ['Mobile No', 'Phone number'],
            'TENTH_PERCENTAGE': ['10th %', '10t %', '10th Percentage'],
            'TENTH_YOP': ['10th YOP'],
            'TWELFTH_PERCENTAGE': ['12th/Diploma %', '12th Percentage'],
            'TWELFTH_YOP': ['12th/Diploma YOP'],
            'GRADUATION_PERCENTAGE': ['Graduation %'],
            'GRADUATION_YOP': ['YOP'],
            'NATIONALITY': ['Nationality'],
            'BACKLOGS': ['No. of Backlogs','Backlogs'],
            'DATE_OF_BIRTH': ['Date of Birth', 'Birth Date', 'DOB'],
            'BIRTH_DATE': ['Birth Date', 'Date of Birth', 'DOB'],
            'DOB': ['DOB', 'Date of Birth', 'Birth Date'],
            'GRADUATION_DATE': ['Graduation Date', 'Expected Graduation']
        })
    };

    // Load tagged data from localStorage or use defaults
    let taggedData = loadTaggedData();

    // Track modal state for toggle functionality
    let isCustomizationModalOpen = false;

    // Error handling system
    const ErrorHandler = {
        // Error types with user-friendly messages
        errorTypes: {
            STORAGE_ERROR: {
                title: 'Storage Error',
                icon: '💾',
                color: '#ff5722',
                recoverable: true
            },
            VALIDATION_ERROR: {
                title: 'Validation Error',
                icon: '⚠️',
                color: '#ff9800',
                recoverable: true
            },
            FORM_FILL_ERROR: {
                title: 'Form Filling Error',
                icon: '📝',
                color: '#f44336',
                recoverable: true
            },
            IMPORT_EXPORT_ERROR: {
                title: 'Import/Export Error',
                icon: '📁',
                color: '#e91e63',
                recoverable: true
            },
            NETWORK_ERROR: {
                title: 'Network Error',
                icon: '🌐',
                color: '#9c27b0',
                recoverable: true
            },
            UNKNOWN_ERROR: {
                title: 'Unexpected Error',
                icon: '❌',
                color: '#795548',
                recoverable: false
            }
        },

        // Show enhanced error modal
        showError(errorType, message, details = null, recoveryOptions = []) {
            const errorInfo = this.errorTypes[errorType] || this.errorTypes.UNKNOWN_ERROR;

            // Log detailed error information
            console.group(`${errorInfo.icon} ${errorInfo.title}`);
            console.error('Message:', message);
            if (details) console.error('Details:', details);
            console.groupEnd();

            // Create error modal
            this.createErrorModal(errorInfo, message, details, recoveryOptions);
        },

        // Create error modal with recovery options
        createErrorModal(errorInfo, message, details, recoveryOptions) {
            // Remove existing error modal
            const existingModal = document.getElementById('error-modal-overlay');
            if (existingModal) existingModal.remove();

            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.id = 'error-modal-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 10001;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
                animation: fadeIn 0.3s ease;
            `;

            // Create modal content
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white;
                border-radius: 16px;
                padding: 32px;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 16px 48px rgba(0, 0, 0, 0.4);
                text-align: center;
                position: relative;
                animation: slideIn 0.3s ease;
            `;

            // Create error icon and title
            const header = document.createElement('div');
            header.style.cssText = 'margin-bottom: 24px;';

            const icon = document.createElement('div');
            icon.style.cssText = `
                font-size: 48px;
                margin-bottom: 16px;
                animation: pulse 2s infinite;
            `;
            icon.textContent = errorInfo.icon;

            const title = document.createElement('h2');
            title.style.cssText = `
                margin: 0 0 8px 0;
                color: ${errorInfo.color};
                font-size: 24px;
                font-weight: bold;
            `;
            title.textContent = errorInfo.title;

            header.appendChild(icon);
            header.appendChild(title);

            // Create error message
            const messageDiv = document.createElement('div');
            messageDiv.style.cssText = `
                color: #333;
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 24px;
                text-align: left;
                background: #f5f5f5;
                padding: 16px;
                border-radius: 8px;
                border-left: 4px solid ${errorInfo.color};
            `;
            messageDiv.textContent = message;

            // Create details section (collapsible)
            let detailsSection = null;
            if (details) {
                detailsSection = document.createElement('div');
                detailsSection.style.cssText = 'margin-bottom: 24px;';

                const detailsToggle = document.createElement('button');
                detailsToggle.style.cssText = `
                    background: none;
                    border: none;
                    color: #666;
                    font-size: 14px;
                    cursor: pointer;
                    text-decoration: underline;
                    margin-bottom: 12px;
                `;
                detailsToggle.textContent = '🔍 Show Technical Details';

                const detailsContent = document.createElement('div');
                detailsContent.style.cssText = `
                    display: none;
                    background: #f8f8f8;
                    padding: 12px;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 12px;
                    color: #666;
                    text-align: left;
                    white-space: pre-wrap;
                    max-height: 200px;
                    overflow-y: auto;
                `;
                detailsContent.textContent = typeof details === 'object' ? JSON.stringify(details, null, 2) : details;

                detailsToggle.addEventListener('click', () => {
                    const isVisible = detailsContent.style.display !== 'none';
                    detailsContent.style.display = isVisible ? 'none' : 'block';
                    detailsToggle.textContent = isVisible ? '🔍 Show Technical Details' : '🔼 Hide Technical Details';
                });

                detailsSection.appendChild(detailsToggle);
                detailsSection.appendChild(detailsContent);
            }

            // Create recovery options
            const recoverySection = document.createElement('div');
            recoverySection.style.cssText = 'margin-bottom: 24px;';

            if (recoveryOptions.length > 0) {
                const recoveryTitle = document.createElement('h3');
                recoveryTitle.style.cssText = 'margin: 0 0 16px 0; color: #333; font-size: 18px;';
                recoveryTitle.textContent = '🔧 Recovery Options';
                recoverySection.appendChild(recoveryTitle);

                recoveryOptions.forEach((option, index) => {
                    const optionButton = document.createElement('button');
                    optionButton.style.cssText = `
                        display: block;
                        width: 100%;
                        margin-bottom: 12px;
                        padding: 12px 16px;
                        background: ${option.primary ? '#4caf50' : '#2196f3'};
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 14px;
                        font-weight: bold;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    `;
                    optionButton.textContent = `${option.icon || '🔧'} ${option.text}`;

                    optionButton.addEventListener('mouseenter', () => {
                        optionButton.style.transform = 'translateY(-2px)';
                        optionButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                    });

                    optionButton.addEventListener('mouseleave', () => {
                        optionButton.style.transform = 'translateY(0)';
                        optionButton.style.boxShadow = 'none';
                    });

                    optionButton.addEventListener('click', () => {
                        document.body.removeChild(overlay);
                        if (option.action) option.action();
                    });

                    recoverySection.appendChild(optionButton);
                });
            }

            // Create close button
            const closeButton = document.createElement('button');
            closeButton.style.cssText = `
                background: #666;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s ease;
            `;
            closeButton.textContent = '❌ Close';
            closeButton.addEventListener('mouseenter', () => closeButton.style.background = '#555');
            closeButton.addEventListener('mouseleave', () => closeButton.style.background = '#666');
            closeButton.addEventListener('click', () => document.body.removeChild(overlay));

            // Assemble modal
            modal.appendChild(header);
            modal.appendChild(messageDiv);
            if (detailsSection) modal.appendChild(detailsSection);
            modal.appendChild(recoverySection);
            modal.appendChild(closeButton);
            overlay.appendChild(modal);

            // Add CSS animations
            if (!document.getElementById('error-modal-styles')) {
                const style = document.createElement('style');
                style.id = 'error-modal-styles';
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideIn {
                        from { transform: translateY(-50px); opacity: 0; }
                        to { transform: translateY(0); opacity: 1; }
                    }
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                `;
                document.head.appendChild(style);
            }

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    document.body.removeChild(overlay);
                }
            });

            document.body.appendChild(overlay);
        },

        // Quick error notification (non-blocking)
        showNotification(message, type = 'error', duration = 5000) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10002;
                background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#4caf50'};
                color: white;
                padding: 16px 20px;
                border-radius: 8px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: slideInRight 0.3s ease;
                max-width: 300px;
                word-wrap: break-word;
            `;

            const icon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
            notification.textContent = `${icon} ${message}`;

            // Add slide animation
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOutRight {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(notification);

            // Auto-remove after duration
            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, duration);

            // Click to dismiss
            notification.addEventListener('click', () => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            });
        }
    };

    // Function to load tagged data from localStorage
    function loadTaggedData() {
        try {
            const saved = localStorage.getItem('googleFormFillerTaggedData');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure we have all base data
                return {
                    tags: { ...defaultTaggedData.tags, ...parsed.tags },
                    fieldMappings: { ...defaultTaggedData.fieldMappings, ...parsed.fieldMappings }
                };
            }
        } catch (error) {
            ErrorHandler.showError('STORAGE_ERROR',
                'Failed to load your saved form data from browser storage.',
                error,
                [
                    {
                        text: 'Use Default Data',
                        icon: '🔄',
                        primary: true,
                        action: () => {
                            console.log('Using default data due to storage error');
                            ErrorHandler.showNotification('Using default form data', 'warning');
                        }
                    },
                    {
                        text: 'Clear Storage & Restart',
                        icon: '🗑️',
                        action: () => {
                            localStorage.removeItem('googleFormFillerTaggedData');
                            location.reload();
                        }
                    }
                ]
            );
        }
        return JSON.parse(JSON.stringify(defaultTaggedData)); // Deep copy
    }

    // Function to save tagged data to localStorage
    function saveTaggedData(data) {
        try {
            localStorage.setItem('googleFormFillerTaggedData', JSON.stringify(data));
            console.log('✅ Tagged data saved to localStorage');
        } catch (error) {
            ErrorHandler.showError('STORAGE_ERROR',
                'Failed to save your form data to browser storage. Your changes may be lost.',
                error,
                [
                    {
                        text: 'Retry Save',
                        icon: '🔄',
                        primary: true,
                        action: () => {
                            try {
                                localStorage.setItem('googleFormFillerTaggedData', JSON.stringify(data));
                                ErrorHandler.showNotification('Data saved successfully!', 'success');
                            } catch (retryError) {
                                ErrorHandler.showNotification('Save failed again. Check browser storage.', 'error');
                            }
                        }
                    },
                    {
                        text: 'Export as Backup',
                        icon: '📁',
                        action: () => {
                            exportDataAsJSON();
                        }
                    }
                ]
            );
        }
    }

    // Function to display current tag mappings in console
    function showCurrentMappings() {
        console.log('\n🏷️ CURRENT TAG MAPPINGS:');
        console.log('========================');

        // Group field mappings by tag
        const tagToFields = {};
        Object.entries(taggedData.fieldMappings).forEach(([fieldName, tagName]) => {
            if (!tagToFields[tagName]) {
                tagToFields[tagName] = [];
            }
            tagToFields[tagName].push(fieldName);
        });

        // Display each tag and its mapped fields
        Object.entries(tagToFields).forEach(([tagName, fields]) => {
            const tagValue = taggedData.tags[tagName] || 'No value set';
            console.log(`\n🏷️ Tag: ${tagName}`);
            console.log(`   Value: "${tagValue}"`);
            console.log(`   Fields: ${fields.join(', ')}`);
        });

        // Show unmapped tags
        const mappedTags = Object.values(taggedData.fieldMappings);
        const unmappedTags = Object.keys(taggedData.tags).filter(tag => !mappedTags.includes(tag));

        if (unmappedTags.length > 0) {
            console.log('\n⚠️ UNMAPPED TAGS (have values but no field mappings):');
            unmappedTags.forEach(tag => {
                console.log(`   🏷️ ${tag}: "${taggedData.tags[tag]}"`);
            });
        }

        console.log('\n💡 Use showCurrentMappings() to view this again');
        console.log('💡 Use the customize button to modify mappings');
    }

    // Make functions available globally for console access
    window.showCurrentMappings = showCurrentMappings;

    // Global function to close customization modal (for keyboard shortcuts)
    window.closeCustomizationModal = function () {
        if (isCustomizationModalOpen) {
            // Find and close the modal
            const overlay = document.querySelector('#form-filler-modal-overlay');
            if (overlay) {
                document.body.removeChild(overlay);
                isCustomizationModalOpen = false;
                console.log('🎹 Customization modal closed via keyboard shortcut');
                return true;
            }
        }
        return false;
    };

    // Data Export Functions
    function exportDataAsJSON() {
        try {
            const exportData = {
                version: "1.0",
                exportDate: new Date().toISOString(),
                tags: taggedData.tags,
                fieldMappings: taggedData.fieldMappings,
                metadata: {
                    totalTags: Object.keys(taggedData.tags).length,
                    totalMappings: Object.keys(taggedData.fieldMappings).length
                }
            };

            const jsonString = JSON.stringify(exportData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `google-form-filler-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log('📁 Data exported as JSON successfully');
            alert('📁 Data exported as JSON file successfully!\n\nFile saved to your Downloads folder.');
            return true;
        } catch (error) {
            ErrorHandler.showError('IMPORT_EXPORT_ERROR',
                'Failed to export your data as JSON file.',
                error,
                [
                    {
                        text: 'Try Again',
                        icon: '🔄',
                        primary: true,
                        action: () => exportDataAsJSON()
                    },
                    {
                        text: 'Export as CSV Instead',
                        icon: '📊',
                        action: () => exportDataAsCSV()
                    },
                    {
                        text: 'Copy Data to Clipboard',
                        icon: '📋',
                        action: () => {
                            try {
                                const dataText = JSON.stringify(taggedData, null, 2);
                                navigator.clipboard.writeText(dataText);
                                ErrorHandler.showNotification('Data copied to clipboard!', 'success');
                            } catch (clipError) {
                                ErrorHandler.showNotification('Failed to copy to clipboard', 'error');
                            }
                        }
                    }
                ]
            );
            return false;
        }
    }

    function exportDataAsCSV() {
        try {
            // Create CSV content
            let csvContent = 'Type,Key,Value,Description\n';

            // Add tags
            Object.entries(taggedData.tags).forEach(([tagName, value]) => {
                const escapedValue = `"${value.replace(/"/g, '""')}"`;
                csvContent += `Tag,${tagName},${escapedValue},Tag value\n`;
            });

            // Add field mappings
            Object.entries(taggedData.fieldMappings).forEach(([fieldName, tagName]) => {
                const escapedFieldName = `"${fieldName.replace(/"/g, '""')}"`;
                csvContent += `Mapping,${escapedFieldName},${tagName},Field to tag mapping\n`;
            });

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `google-form-filler-data-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log('📊 Data exported as CSV successfully');
            alert('📊 Data exported as CSV file successfully!\n\nFile saved to your Downloads folder.');
            return true;
        } catch (error) {
            ErrorHandler.showError('IMPORT_EXPORT_ERROR',
                'Failed to export your data as CSV file.',
                error,
                [
                    {
                        text: 'Try Again',
                        icon: '🔄',
                        primary: true,
                        action: () => exportDataAsCSV()
                    },
                    {
                        text: 'Export as JSON Instead',
                        icon: '📁',
                        action: () => exportDataAsJSON()
                    },
                    {
                        text: 'View Data in Console',
                        icon: '🔍',
                        action: () => {
                            console.table(taggedData.tags);
                            console.table(taggedData.fieldMappings);
                            ErrorHandler.showNotification('Data logged to console (F12)', 'success');
                        }
                    }
                ]
            );
            return false;
        }
    }

    // Data Import Functions
    function importDataFromJSON() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);

                    // Validate imported data structure
                    if (!importedData.tags || !importedData.fieldMappings) {
                        throw new Error('Invalid JSON format: missing tags or fieldMappings');
                    }

                    // Merge with existing data (imported data takes precedence)
                    const mergedData = {
                        tags: { ...taggedData.tags, ...importedData.tags },
                        fieldMappings: { ...taggedData.fieldMappings, ...importedData.fieldMappings }
                    };

                    // Update global data and save
                    taggedData = mergedData;
                    saveTaggedData(taggedData);

                    const importedTags = Object.keys(importedData.tags).length;
                    const importedMappings = Object.keys(importedData.fieldMappings).length;

                    console.log('📁 JSON data imported successfully');
                    alert(`📁 JSON data imported successfully!\n\n✅ Imported ${importedTags} tags\n✅ Imported ${importedMappings} field mappings\n\nData has been merged with your existing data.`);

                } catch (error) {
                    ErrorHandler.showError('IMPORT_EXPORT_ERROR',
                        'Failed to import JSON file. The file may be corrupted or in wrong format.',
                        error,
                        [
                            {
                                text: 'Try Different File',
                                icon: '📁',
                                primary: true,
                                action: () => importDataFromJSON()
                            },
                            {
                                text: 'Import CSV Instead',
                                icon: '📊',
                                action: () => importDataFromCSV()
                            },
                            {
                                text: 'Manual Data Entry',
                                icon: '✏️',
                                action: () => {
                                    // Close any existing modals and open customization
                                    setTimeout(() => showCustomizationModal(), 500);
                                }
                            }
                        ]
                    );
                }
            };

            reader.readAsText(file);
        });

        input.click();
    }

    function importDataFromCSV() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.csv';

        input.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csvContent = e.target.result;
                    const lines = csvContent.split('\n');

                    // Skip header line
                    const dataLines = lines.slice(1).filter(line => line.trim());

                    const importedTags = {};
                    const importedMappings = {};

                    dataLines.forEach(line => {
                        const [type, key, value] = line.split(',').map(cell =>
                            cell.replace(/^"(.*)"$/, '$1').replace(/""/g, '"')
                        );

                        if (type === 'Tag' && key && value) {
                            importedTags[key] = value;
                        } else if (type === 'Mapping' && key && value) {
                            importedMappings[key] = value;
                        }
                    });

                    if (Object.keys(importedTags).length === 0 && Object.keys(importedMappings).length === 0) {
                        throw new Error('No valid data found in CSV file');
                    }

                    // Merge with existing data
                    const mergedData = {
                        tags: { ...taggedData.tags, ...importedTags },
                        fieldMappings: { ...taggedData.fieldMappings, ...importedMappings }
                    };

                    // Update global data and save
                    taggedData = mergedData;
                    saveTaggedData(taggedData);

                    const importedTagCount = Object.keys(importedTags).length;
                    const importedMappingCount = Object.keys(importedMappings).length;

                    console.log('📊 CSV data imported successfully');
                    alert(`📊 CSV data imported successfully!\n\n✅ Imported ${importedTagCount} tags\n✅ Imported ${importedMappingCount} field mappings\n\nData has been merged with your existing data.`);

                } catch (error) {
                    ErrorHandler.showError('IMPORT_EXPORT_ERROR',
                        'Failed to import CSV file. The file may have incorrect format or encoding.',
                        error,
                        [
                            {
                                text: 'Try Different File',
                                icon: '📊',
                                primary: true,
                                action: () => importDataFromCSV()
                            },
                            {
                                text: 'Import JSON Instead',
                                icon: '📁',
                                action: () => importDataFromJSON()
                            },
                            {
                                text: 'Check CSV Format',
                                icon: '📋',
                                action: () => {
                                    const formatInfo = `Expected CSV format:
Type,Key,Value,Description
Tag,FULL_NAME,"John Doe",Tag value
Tag,EMAIL,"john@example.com",Tag value
Mapping,"Full Name",FULL_NAME,Field to tag mapping`;

                                    ErrorHandler.showError('IMPORT_EXPORT_ERROR',
                                        'CSV Format Requirements',
                                        formatInfo,
                                        [{
                                            text: 'Try Again',
                                            icon: '🔄',
                                            primary: true,
                                            action: () => importDataFromCSV()
                                        }]
                                    );
                                }
                            }
                        ]
                    );
                }
            };

            reader.readAsText(file);
        });

        input.click();
    }

    // Field Validation Functions
    const validators = {
        email: {
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Please enter a valid email address (e.g., user@example.com)',
            test: (value) => validators.email.pattern.test(value)
        },
        phone: {
            pattern: /^[\+]?[1-9][\d]{0,15}$|^[\+]?[(]?[\d\s\-\(\)]{10,}$/,
            message: 'Please enter a valid phone number (10+ digits, optional +, spaces, dashes, parentheses)',
            test: (value) => {
                const cleaned = value.replace(/[\s\-\(\)]/g, '');
                return /^[\+]?[1-9][\d]{9,15}$/.test(cleaned);
            }
        },
        percentage: {
            pattern: /^(100(\.0{1,2})?|[0-9]{1,2}(\.[0-9]{1,2})?)$/,
            message: 'Please enter a valid percentage (0-100, up to 2 decimal places)',
            test: (value) => {
                const num = parseFloat(value);
                return !isNaN(num) && num >= 0 && num <= 100;
            }
        },
        year: {
            pattern: /^(19|20)\d{2}$/,
            message: 'Please enter a valid year (1900-2099)',
            test: (value) => {
                const year = parseInt(value);
                const currentYear = new Date().getFullYear();
                return year >= 1900 && year <= currentYear + 10;
            }
        },
        date: {
            pattern: /^\d{4}-\d{2}-\d{2}$|^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/,
            message: 'Please enter a valid date (YYYY-MM-DD, DD/MM/YYYY, or DD-MM-YYYY)',
            test: (value) => {
                try {
                    // Try to parse various date formats
                    let dateValue = value;

                    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                        dateValue = value;
                    } else if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(value)) {
                        const parts = value.split(/[\/\-]/);
                        dateValue = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                    }

                    const date = new Date(dateValue);
                    return !isNaN(date.getTime()) && date.getFullYear() >= 1900 && date.getFullYear() <= 2100;
                } catch {
                    return false;
                }
            }
        },
        rollNumber: {
            pattern: /^[A-Z0-9]{6,15}$/i,
            message: 'Please enter a valid roll number (6-15 alphanumeric characters)',
            test: (value) => validators.rollNumber.pattern.test(value)
        },
        name: {
            pattern: /^[a-zA-Z\s]{2,50}$/,
            message: 'Please enter a valid name (2-50 characters, letters and spaces only)',
            test: (value) => validators.name.pattern.test(value.trim())
        },
        number: {
            pattern: /^\d+$/,
            message: 'Please enter a valid number (digits only)',
            test: (value) => validators.number.pattern.test(value)
        }
    };

    // Function to detect field type based on field name
    function detectFieldType(fieldName) {
        const lowerField = fieldName.toLowerCase();

        // Email detection
        if (lowerField.includes('email') || lowerField.includes('mail')) {
            return 'email';
        }

        // Phone detection
        if (lowerField.includes('phone') || lowerField.includes('mobile') || lowerField.includes('contact')) {
            return 'phone';
        }

        // Percentage detection
        if (lowerField.includes('%') || lowerField.includes('percentage') || lowerField.includes('percent')) {
            return 'percentage';
        }

        // Date detection (full dates)
        if (lowerField.includes('date') || lowerField.includes('birth') || lowerField.includes('dob') ||
            lowerField.includes('born') || lowerField.includes('graduation date')) {
            return 'date';
        }

        // Year detection (year only fields)
        if (lowerField.includes('year') || lowerField.includes('yop') || lowerField.match(/\b(19|20)\d{2}\b/)) {
            return 'year';
        }

        // Roll number detection
        if (lowerField.includes('roll') || lowerField.includes('registration') || lowerField.includes('student id')) {
            return 'rollNumber';
        }

        // Name detection
        if (lowerField.includes('name') && !lowerField.includes('username') && !lowerField.includes('filename')) {
            return 'name';
        }

        // Number detection (backlogs, count, etc.)
        if (lowerField.includes('backlog') || lowerField.includes('count') || lowerField.includes('number')) {
            return 'number';
        }

        return null; // No specific validation needed
    }

    // Function to validate a single field
    function validateField(fieldName, value) {
        if (!value || value.trim() === '') {
            return { isValid: true, message: '' }; // Empty fields are allowed
        }

        const fieldType = detectFieldType(fieldName);
        if (!fieldType || !validators[fieldType]) {
            return { isValid: true, message: '' }; // No validation rule found
        }

        const validator = validators[fieldType];
        const isValid = validator.test(value.trim());

        return {
            isValid,
            message: isValid ? '' : validator.message,
            fieldType
        };
    }

    // Function to validate all data
    function validateAllData(data) {
        const validationResults = {};
        let hasErrors = false;

        Object.entries(data).forEach(([fieldName, value]) => {
            const result = validateField(fieldName, value);
            validationResults[fieldName] = result;
            if (!result.isValid) {
                hasErrors = true;
            }
        });

        return {
            hasErrors,
            results: validationResults
        };
    }

    // Function to auto-fix common validation errors
    function autoFixValidationErrors(validationResults) {
        const inputs = document.querySelectorAll('input[data-key]');
        let fixedCount = 0;
        const fixedFields = [];

        inputs.forEach(input => {
            const tagName = input.getAttribute('data-key');
            const validation = validationResults.results[tagName];

            if (validation && !validation.isValid) {
                const currentValue = input.value.trim();
                let fixedValue = null;

                // Auto-fix common issues based on field type
                switch (validation.fieldType) {
                    case 'email':
                        // Fix common email issues
                        if (currentValue && !currentValue.includes('@')) {
                            fixedValue = `${currentValue}@gmail.com`;
                        } else if (currentValue.includes('@') && !currentValue.includes('.')) {
                            fixedValue = `${currentValue}.com`;
                        } else if (currentValue.includes(' ')) {
                            fixedValue = currentValue.replace(/\s+/g, '');
                        }
                        break;

                    case 'phone':
                        // Fix phone number formatting
                        if (currentValue) {
                            const digitsOnly = currentValue.replace(/\D/g, '');
                            if (digitsOnly.length === 10) {
                                fixedValue = digitsOnly;
                            } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
                                fixedValue = digitsOnly.substring(1);
                            }
                        }
                        break;

                    case 'percentage':
                        // Fix percentage values
                        if (currentValue) {
                            const numValue = parseFloat(currentValue.replace('%', ''));
                            if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                                fixedValue = numValue.toString();
                            }
                        }
                        break;

                    case 'year':
                        // Fix year values
                        if (currentValue) {
                            const yearMatch = currentValue.match(/\d{4}/);
                            if (yearMatch) {
                                const year = parseInt(yearMatch[0]);
                                const currentYear = new Date().getFullYear();
                                if (year >= 1900 && year <= currentYear + 10) {
                                    fixedValue = year.toString();
                                }
                            }
                        }
                        break;

                    case 'name':
                        // Fix name formatting
                        if (currentValue) {
                            fixedValue = currentValue
                                .replace(/[^a-zA-Z\s]/g, '') // Remove non-letter characters
                                .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                                .trim()
                                .split(' ')
                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                .join(' ');
                        }
                        break;

                    case 'number':
                        // Fix number values
                        if (currentValue) {
                            const numValue = currentValue.replace(/\D/g, '');
                            if (numValue) {
                                fixedValue = numValue;
                            }
                        }
                        break;
                }

                // Apply the fix if we found one
                if (fixedValue && fixedValue !== currentValue) {
                    input.value = fixedValue;

                    // Trigger validation to update UI
                    const newValidation = validateField(tagName, fixedValue);
                    addValidationFeedback(input, newValidation);

                    fixedCount++;
                    fixedFields.push(`${tagName}: "${currentValue}" → "${fixedValue}"`);

                    console.log(`🔧 Auto-fixed ${tagName}: "${currentValue}" → "${fixedValue}"`);
                }
            }
        });

        // Show results
        if (fixedCount > 0) {
            const fixedList = fixedFields.join('\n');
            ErrorHandler.showNotification(`🔧 Auto-Fixed ${fixedCount} field${fixedCount > 1 ? 's' : ''}! Please review and save.`, 'success');
            console.log(`🔧 Auto-fixed fields:\n${fixedList}`);

            // Update validation summary
            setTimeout(() => {
                const summaryElement = document.querySelector('#validation-summary');
                if (summaryElement && window.updateValidationSummary) {
                    window.updateValidationSummary();
                }
            }, 100);
        } else {
            ErrorHandler.showNotification('🔧 No automatic fixes available. Please review fields manually.', 'warning');
        }
    }

    // Function to show detailed validation suggestions
    function showValidationSuggestions(validationResults) {
        const errorFields = Object.entries(validationResults.results)
            .filter(([_, result]) => !result.isValid);

        let suggestions = '💡 VALIDATION FIX SUGGESTIONS:\n\n';

        errorFields.forEach(([fieldName, result]) => {
            suggestions += `🔸 ${fieldName}:\n`;
            suggestions += `   Problem: ${result.message}\n`;

            // Add specific suggestions based on field type
            switch (result.fieldType) {
                case 'email':
                    suggestions += '   💡 Suggestions:\n';
                    suggestions += '      • Make sure it contains @ symbol\n';
                    suggestions += '      • Add domain like @gmail.com\n';
                    suggestions += '      • Remove any spaces\n';
                    suggestions += '      • Example: user@example.com\n\n';
                    break;

                case 'phone':
                    suggestions += '   💡 Suggestions:\n';
                    suggestions += '      • Use 10 digits for mobile numbers\n';
                    suggestions += '      • Remove country code if present\n';
                    suggestions += '      • Example: 9876543210\n\n';
                    break;

                case 'percentage':
                    suggestions += '   💡 Suggestions:\n';
                    suggestions += '      • Enter number between 0-100\n';
                    suggestions += '      • Don\'t include % symbol\n';
                    suggestions += '      • Use decimal for precision (e.g., 85.5)\n\n';
                    break;

                case 'year':
                    suggestions += '   💡 Suggestions:\n';
                    suggestions += '      • Enter 4-digit year (e.g., 2020)\n';
                    suggestions += '      • Year should be between 1900-2035\n\n';
                    break;

                case 'name':
                    suggestions += '   💡 Suggestions:\n';
                    suggestions += '      • Use only letters and spaces\n';
                    suggestions += '      • 2-50 characters long\n';
                    suggestions += '      • Example: John Doe\n\n';
                    break;

                case 'number':
                    suggestions += '   💡 Suggestions:\n';
                    suggestions += '      • Use only digits (0-9)\n';
                    suggestions += '      • No letters or special characters\n\n';
                    break;

                default:
                    suggestions += '   💡 Please check the format and try again\n\n';
            }
        });

        suggestions += '🔧 You can also try the "Auto-Fix" button to automatically correct common issues.';

        alert(suggestions);
    }

    // Function to show validation errors with recovery options
    function showValidationErrors(validationResults) {
        const errorFields = Object.entries(validationResults.results)
            .filter(([_, result]) => !result.isValid);

        const errorList = errorFields
            .map(([fieldName, result]) => `• ${fieldName}: ${result.message}`)
            .join('\n');

        ErrorHandler.showError('VALIDATION_ERROR',
            `Found ${errorFields.length} validation error${errorFields.length > 1 ? 's' : ''} in your form data.`,
            errorList,
            [
                {
                    text: '🔧 Auto-Fix Common Issues',
                    icon: '🔧',
                    primary: true,
                    action: () => {
                        autoFixValidationErrors(validationResults);
                    }
                },
                {
                    text: '💡 Show Fix Suggestions',
                    icon: '💡',
                    action: () => {
                        showValidationSuggestions(validationResults);
                    }
                },
                {
                    text: 'Fix Errors Manually',
                    icon: '✏️',
                    action: () => {
                        ErrorHandler.showNotification('Please correct the highlighted fields and try again', 'info');
                    }
                },
                {
                    text: 'Save Anyway (Skip Validation)',
                    icon: '⚠️',
                    action: () => {
                        if (confirm('Are you sure you want to save data with validation errors? This may cause issues when filling forms.')) {
                            // Force save without validation
                            const inputs = document.querySelectorAll('input[data-key]');
                            const newTags = {};
                            inputs.forEach(input => {
                                const tagName = input.getAttribute('data-key');
                                const value = input.value.trim();
                                newTags[tagName] = value;
                            });
                            taggedData.tags = { ...taggedData.tags, ...newTags };
                            saveTaggedData(taggedData);
                            ErrorHandler.showNotification('Data saved with validation warnings', 'warning');
                        }
                    }
                },
                {
                    text: 'Reset to Defaults',
                    icon: '🔄',
                    action: () => {
                        if (confirm('Reset all fields to default values? This will lose your current changes.')) {
                            location.reload();
                        }
                    }
                }
            ]
        );

        console.error('Validation errors:', validationResults.results);
    }

    // Function to add visual validation feedback to inputs
    function addValidationFeedback(input, validation) {
        // Remove existing validation classes and icons
        input.classList.remove('validation-success', 'validation-error');

        // Remove existing validation elements
        const existingIcon = input.parentNode.querySelector('.validation-icon');
        const existingTooltip = input.parentNode.querySelector('.validation-tooltip');
        if (existingIcon) existingIcon.remove();
        if (existingTooltip) existingTooltip.remove();

        if (!validation.isValid) {
            // Add error styling with subtle red border
            input.classList.add('validation-error');
            input.style.borderColor = '#f44336';
            input.style.boxShadow = '0 0 3px rgba(244, 67, 54, 0.2)';

            // Add small error icon
            const errorIcon = document.createElement('div');
            errorIcon.className = 'validation-icon error-icon';
            errorIcon.style.cssText = `
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                width: 16px;
                height: 16px;
                background: #f44336;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 10px;
                font-weight: bold;
                cursor: help;
                z-index: 1;
            `;
            errorIcon.textContent = '!';
            errorIcon.title = validation.message;

            // Make parent position relative for absolute positioning
            input.parentNode.style.position = 'relative';
            input.style.paddingRight = '32px'; // Make room for icon
            input.parentNode.appendChild(errorIcon);

            // Add hover tooltip for error message
            const tooltip = document.createElement('div');
            tooltip.className = 'validation-tooltip';
            tooltip.style.cssText = `
                position: absolute;
                bottom: -35px;
                left: 0;
                right: 0;
                background: #f44336;
                color: white;
                padding: 6px 8px;
                border-radius: 4px;
                font-size: 11px;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
                z-index: 1000;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            tooltip.textContent = validation.message;

            // Show tooltip on hover
            errorIcon.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
            });
            errorIcon.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
            });

            input.parentNode.appendChild(tooltip);

        } else if (validation.fieldType) {
            // Add success styling with subtle green border
            input.classList.add('validation-success');
            input.style.borderColor = '#4caf50';
            input.style.boxShadow = '0 0 3px rgba(76, 175, 80, 0.2)';

            // Add small success checkmark
            const successIcon = document.createElement('div');
            successIcon.className = 'validation-icon success-icon';
            successIcon.style.cssText = `
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                width: 16px;
                height: 16px;
                background: #4caf50;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 10px;
                font-weight: bold;
                z-index: 1;
            `;
            successIcon.textContent = '✓';
            successIcon.title = `Valid ${validation.fieldType}`;

            // Make parent position relative for absolute positioning
            input.parentNode.style.position = 'relative';
            input.style.paddingRight = '32px'; // Make room for icon
            input.parentNode.appendChild(successIcon);

        } else {
            // Reset to default styling
            input.style.borderColor = '#ddd';
            input.style.boxShadow = 'none';
            input.style.paddingRight = '12px'; // Reset padding
            input.parentNode.style.position = 'static';
        }
    }

    // Show backup/import options modal
    function showBackupImportModal() {
        // Create modal overlay
        const overlay = document.createElement('div');
        overlay.id = 'backup-import-modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
        `;

        // Create modal content
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 500px;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
            text-align: center;
        `;

        // Create title
        const title = document.createElement('h2');
        title.style.cssText = 'margin: 0 0 24px 0; color: #333; font-size: 24px;';
        title.textContent = '💾 Backup & Import Data';

        // Create description
        const description = document.createElement('p');
        description.style.cssText = 'color: #666; margin-bottom: 32px; line-height: 1.5;';
        description.textContent = 'Export your form data for backup or import data from another device';

        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;';

        // Create export buttons
        const exportJSONBtn = document.createElement('button');
        exportJSONBtn.textContent = '📁 Export JSON';
        exportJSONBtn.style.cssText = `
            background: #2196f3;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        `;
        exportJSONBtn.addEventListener('mouseenter', () => exportJSONBtn.style.background = '#1976d2');
        exportJSONBtn.addEventListener('mouseleave', () => exportJSONBtn.style.background = '#2196f3');
        exportJSONBtn.addEventListener('click', () => {
            exportDataAsJSON();
            document.body.removeChild(overlay);
        });

        const exportCSVBtn = document.createElement('button');
        exportCSVBtn.textContent = '📊 Export CSV';
        exportCSVBtn.style.cssText = `
            background: #4caf50;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        `;
        exportCSVBtn.addEventListener('mouseenter', () => exportCSVBtn.style.background = '#45a049');
        exportCSVBtn.addEventListener('mouseleave', () => exportCSVBtn.style.background = '#4caf50');
        exportCSVBtn.addEventListener('click', () => {
            exportDataAsCSV();
            document.body.removeChild(overlay);
        });

        const importJSONBtn = document.createElement('button');
        importJSONBtn.textContent = '📁 Import JSON';
        importJSONBtn.style.cssText = `
            background: #ff9800;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        `;
        importJSONBtn.addEventListener('mouseenter', () => importJSONBtn.style.background = '#f57c00');
        importJSONBtn.addEventListener('mouseleave', () => importJSONBtn.style.background = '#ff9800');
        importJSONBtn.addEventListener('click', () => {
            importDataFromJSON();
            document.body.removeChild(overlay);
        });

        const importCSVBtn = document.createElement('button');
        importCSVBtn.textContent = '📊 Import CSV';
        importCSVBtn.style.cssText = `
            background: #9c27b0;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        `;
        importCSVBtn.addEventListener('mouseenter', () => importCSVBtn.style.background = '#7b1fa2');
        importCSVBtn.addEventListener('mouseleave', () => importCSVBtn.style.background = '#9c27b0');
        importCSVBtn.addEventListener('click', () => {
            importDataFromCSV();
            document.body.removeChild(overlay);
        });

        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '❌ Close';
        closeBtn.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.2s;
        `;
        closeBtn.addEventListener('mouseenter', () => closeBtn.style.background = '#da190b');
        closeBtn.addEventListener('mouseleave', () => closeBtn.style.background = '#f44336');
        closeBtn.addEventListener('click', () => document.body.removeChild(overlay));

        // Add elements to modal
        buttonContainer.appendChild(exportJSONBtn);
        buttonContainer.appendChild(exportCSVBtn);
        buttonContainer.appendChild(importJSONBtn);
        buttonContainer.appendChild(importCSVBtn);

        modal.appendChild(title);
        modal.appendChild(description);
        modal.appendChild(buttonContainer);
        modal.appendChild(closeBtn);
        overlay.appendChild(modal);

        // Close on overlay click
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        document.body.appendChild(overlay);
    }

    // Progress indicator and success animation functions
    function createProgressIndicator() {
        // Remove existing progress indicator if any
        const existing = document.getElementById('form-filler-progress');
        if (existing) {
            existing.remove();
        }

        // Create progress container
        const progressContainer = document.createElement('div');
        progressContainer.id = 'form-filler-progress';
        progressContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            min-width: 300px;
            text-align: center;
            font-family: Arial, sans-serif;
        `;

        // Create title
        const title = document.createElement('div');
        title.style.cssText = 'font-size: 18px; font-weight: bold; color: #333; margin-bottom: 16px;';
        title.textContent = '🚀 Filling Form...';

        // Create progress bar container
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.cssText = `
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 12px;
        `;

        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.id = 'form-filler-progress-bar';
        progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #4caf50, #8bc34a);
            border-radius: 4px;
            transition: width 0.3s ease;
        `;

        // Create status text
        const statusText = document.createElement('div');
        statusText.id = 'form-filler-status';
        statusText.style.cssText = 'font-size: 14px; color: #666; margin-bottom: 8px;';
        statusText.textContent = 'Initializing...';

        // Create field counter
        const fieldCounter = document.createElement('div');
        fieldCounter.id = 'form-filler-counter';
        fieldCounter.style.cssText = 'font-size: 12px; color: #999;';
        fieldCounter.textContent = '0 / 0 fields processed';

        progressBarContainer.appendChild(progressBar);
        progressContainer.appendChild(title);
        progressContainer.appendChild(progressBarContainer);
        progressContainer.appendChild(statusText);
        progressContainer.appendChild(fieldCounter);

        document.body.appendChild(progressContainer);

        return {
            container: progressContainer,
            bar: progressBar,
            status: statusText,
            counter: fieldCounter,
            title: title
        };
    }

    function updateProgress(current, total, fieldName, success) {
        const progressBar = document.getElementById('form-filler-progress-bar');
        const statusText = document.getElementById('form-filler-status');
        const fieldCounter = document.getElementById('form-filler-counter');

        if (progressBar && statusText && fieldCounter) {
            const percentage = total > 0 ? (current / total) * 100 : 0;
            progressBar.style.width = `${percentage}%`;

            if (success) {
                statusText.textContent = `✅ Filled: ${fieldName}`;
                statusText.style.color = '#4caf50';
            } else {
                statusText.textContent = `⚠️ Skipped: ${fieldName}`;
                statusText.style.color = '#ff9800';
            }

            fieldCounter.textContent = `${current} / ${total} fields processed`;

            // Add pulse animation for successful fills
            if (success) {
                progressBar.style.boxShadow = '0 0 10px #4caf50';
                setTimeout(() => {
                    progressBar.style.boxShadow = 'none';
                }, 300);
            }
        }
    }

    function showSuccessAnimation(filledCount, totalCount, skippedCount) {
        const progressContainer = document.getElementById('form-filler-progress');
        if (!progressContainer) return;

        // Update to success state
        const title = progressContainer.querySelector('div');
        const statusText = document.getElementById('form-filler-status');
        const progressBar = document.getElementById('form-filler-progress-bar');

        title.textContent = '🎉 Form Filling Complete!';
        title.style.color = '#4caf50';

        statusText.textContent = `✅ Successfully filled ${filledCount} fields`;
        statusText.style.color = '#4caf50';
        statusText.style.fontWeight = 'bold';

        progressBar.style.background = 'linear-gradient(90deg, #4caf50, #66bb6a)';
        progressBar.style.boxShadow = '0 0 20px #4caf50';

        // Add success animation
        progressContainer.style.animation = 'successPulse 0.6s ease-in-out';

        // Add CSS animation if not already added
        if (!document.getElementById('success-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'success-animation-styles';
            style.textContent = `
                @keyframes successPulse {
                    0% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.05); }
                    100% { transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes fadeOut {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                }
            `;
            document.head.appendChild(style);
        }

        // Show detailed results
        setTimeout(() => {
            const resultText = document.createElement('div');
            resultText.style.cssText = 'font-size: 12px; color: #666; margin-top: 8px; line-height: 1.4;';
            resultText.innerHTML = `
                📊 <strong>Results:</strong><br>
                ✅ Filled: ${filledCount} fields<br>
                ${skippedCount > 0 ? `⚠️ Skipped: ${skippedCount} fields<br>` : ''}
                🎯 Total: ${totalCount} fields found
            `;
            progressContainer.appendChild(resultText);
        }, 500);

        // Auto-hide after 4 seconds with fade out animation
        setTimeout(() => {
            progressContainer.style.animation = 'fadeOut 0.5s ease-in-out forwards';
            setTimeout(() => {
                if (progressContainer.parentNode) {
                    progressContainer.parentNode.removeChild(progressContainer);
                }
            }, 500);
        }, 4000);
    }

    function hideProgressIndicator() {
        const progressContainer = document.getElementById('form-filler-progress');
        if (progressContainer) {
            progressContainer.style.animation = 'fadeOut 0.5s ease-in-out forwards';
            setTimeout(() => {
                if (progressContainer.parentNode) {
                    progressContainer.parentNode.removeChild(progressContainer);
                }
            }, 500);
        }
    }

    // Function to generate automatic field mappings based on tag name
    function generateAutoFieldMappings(tagName) {
        const mappings = [];

        // Convert tag name to potential field names
        const cleanTagName = tagName.replace(/_/g, ' ').toLowerCase();

        // Generate variations of the tag name
        const variations = [
            // Original tag name as-is
            tagName,

            // Replace underscores with spaces
            tagName.replace(/_/g, ' '),

            // Title case version
            cleanTagName.split(' ').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),

            // All lowercase with spaces
            cleanTagName,

            // All uppercase with spaces
            cleanTagName.toUpperCase(),

            // Camel case version
            cleanTagName.split(' ').map((word, index) =>
                index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' '),
        ];

        // Add common variations based on tag patterns
        if (tagName.includes('COURSE')) {
            variations.push('Course', 'Preferred Course', 'Course Name', 'Course Selection');
        }

        if (tagName.includes('SUBJECT')) {
            variations.push('Subject', 'Subject Name', 'Preferred Subject');
        }

        if (tagName.includes('DEPARTMENT')) {
            variations.push('Department', 'Dept', 'Department Name');
        }

        if (tagName.includes('COLLEGE')) {
            variations.push('College', 'College Name', 'Institution');
        }

        if (tagName.includes('UNIVERSITY')) {
            variations.push('University', 'University Name');
        }

        if (tagName.includes('ADDRESS')) {
            variations.push('Address', 'Home Address', 'Permanent Address', 'Current Address');
        }

        if (tagName.includes('CITY')) {
            variations.push('City', 'City Name', 'Home City');
        }

        if (tagName.includes('STATE')) {
            variations.push('State', 'State Name', 'Home State');
        }

        if (tagName.includes('COUNTRY')) {
            variations.push('Country', 'Country Name', 'Home Country');
        }

        if (tagName.includes('FATHER')) {
            variations.push('Father Name', 'Father\'s Name', 'Father');
        }

        if (tagName.includes('MOTHER')) {
            variations.push('Mother Name', 'Mother\'s Name', 'Mother');
        }

        if (tagName.includes('GUARDIAN')) {
            variations.push('Guardian Name', 'Guardian\'s Name', 'Guardian');
        }

        if (tagName.includes('HOBBY') || tagName.includes('HOBBIES')) {
            variations.push('Hobbies', 'Hobby', 'Interests', 'Interest');
        }

        if (tagName.includes('SKILL') || tagName.includes('SKILLS')) {
            variations.push('Skills', 'Skill', 'Technical Skills', 'Key Skills');
        }

        if (tagName.includes('EXPERIENCE')) {
            variations.push('Experience', 'Work Experience', 'Previous Experience');
        }

        if (tagName.includes('QUALIFICATION')) {
            variations.push('Qualification', 'Qualifications', 'Educational Qualification');
        }

        // Remove duplicates and empty values
        const uniqueVariations = [...new Set(variations)].filter(v => v && v.trim());

        // Add all unique variations as potential field mappings
        uniqueVariations.forEach(variation => {
            if (variation !== tagName) { // Don't map to itself
                mappings.push(variation);
            }
        });

        console.log(`🔗 Generated ${mappings.length} auto-mappings for tag "${tagName}":`, mappings);
        return mappings;
    }

    // Function to get value for a field using tag system
    function getValueForField(titleText) {
        // Clean the title text (remove asterisks, trim whitespace)
        const cleanTitle = titleText.replace(/\s*\*\s*$/, '').trim();

        // Check if we have a direct field mapping
        const tagName = taggedData.fieldMappings[cleanTitle];
        if (tagName && taggedData.tags[tagName]) {
            return taggedData.tags[tagName];
        }

        // Check for case-insensitive field mapping
        for (const [fieldName, tag] of Object.entries(taggedData.fieldMappings)) {
            if (fieldName.toLowerCase() === cleanTitle.toLowerCase()) {
                return taggedData.tags[tag] || null;
            }
        }

        return null;
    }

    // Function to show customization modal
    function showCustomizationModal() {
        return new Promise((resolve) => {
            // Create modal overlay
            const overlay = document.createElement('div');
            overlay.id = 'form-filler-modal-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                font-family: Arial, sans-serif;
            `;

            // Create modal content
            const modal = document.createElement('div');
            modal.style.cssText = `
                background: white;
                border-radius: 12px;
                padding: 24px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                position: relative;
            `;

            // Create modal content using DOM methods (safer than innerHTML)

            // Create title
            const title = document.createElement('h2');
            title.style.cssText = 'margin: 0 0 20px 0; color: #333; text-align: center;';
            title.textContent = '🎯 Customize Your Form Data';
            modal.appendChild(title);

            // Create description
            const description = document.createElement('p');
            description.style.cssText = 'color: #666; text-align: center; margin-bottom: 20px;';
            description.textContent = 'Edit the values below to match your information';
            modal.appendChild(description);

            // Create form
            const form = document.createElement('form');
            form.id = 'customization-form';
            form.style.cssText = 'display: grid; gap: 12px;';

            // Function to create a field row
            function createFieldRow(key, value, isCustom = false) {
                const fieldId = `field-${key.replace(/[^a-zA-Z0-9]/g, '-')}`;

                // Create field container
                const fieldDiv = document.createElement('div');
                fieldDiv.style.cssText = `display: grid; grid-template-columns: 1fr 2fr ${isCustom ? 'auto' : ''}; gap: 8px; align-items: center;`;
                fieldDiv.setAttribute('data-field-key', key);

                // Create label
                const label = document.createElement('label');
                label.setAttribute('for', fieldId);
                label.style.cssText = 'font-weight: bold; color: #333; font-size: 14px;';
                label.textContent = `${key}:`;

                // Create input
                const input = document.createElement('input');
                input.type = 'text';
                input.id = fieldId;
                input.value = value;
                input.setAttribute('data-key', key);
                input.style.cssText = `
                    padding: 8px 12px;
                    border: 2px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.2s;
                `;

                // Add focus/blur events with validation
                input.addEventListener('focus', () => {
                    input.style.borderColor = '#2196f3';
                    input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.1)';

                    // Hide tooltip on focus
                    const tooltip = input.parentNode.querySelector('.validation-tooltip');
                    if (tooltip) {
                        tooltip.style.opacity = '0';
                    }
                });

                input.addEventListener('blur', () => {
                    // Validate field on blur
                    const validation = validateField(key, input.value);
                    addValidationFeedback(input, validation);
                });

                // Add real-time validation on input
                input.addEventListener('input', () => {
                    // Clear previous validation styling during typing
                    input.classList.remove('validation-success', 'validation-error');

                    // Remove validation icons while typing
                    const existingIcon = input.parentNode.querySelector('.validation-icon');
                    const existingTooltip = input.parentNode.querySelector('.validation-tooltip');
                    if (existingIcon) existingIcon.remove();
                    if (existingTooltip) existingTooltip.remove();

                    // Reset padding and styling
                    input.style.paddingRight = '12px';
                    input.style.borderColor = '#2196f3';
                    input.style.boxShadow = '0 0 0 2px rgba(33, 150, 243, 0.1)';
                });

                fieldDiv.appendChild(label);
                fieldDiv.appendChild(input);

                // Add delete button for custom fields
                if (isCustom) {
                    const deleteBtn = document.createElement('button');
                    deleteBtn.type = 'button';
                    deleteBtn.textContent = '🗑️';
                    deleteBtn.title = 'Delete this field';
                    deleteBtn.style.cssText = `
                        background: #f44336;
                        color: white;
                        border: none;
                        padding: 8px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        transition: background 0.2s;
                    `;
                    deleteBtn.addEventListener('mouseenter', () => deleteBtn.style.background = '#da190b');
                    deleteBtn.addEventListener('mouseleave', () => deleteBtn.style.background = '#f44336');
                    deleteBtn.addEventListener('click', () => {
                        // Confirm deletion
                        const confirmMessage = `Are you sure you want to delete the tag "${key}"?\n\nThis will also remove all field mappings associated with this tag.`;
                        if (confirm(confirmMessage)) {
                            // Remove the tag from taggedData
                            delete taggedData.tags[key];

                            // Remove all field mappings that use this tag
                            const removedMappings = [];
                            Object.keys(taggedData.fieldMappings).forEach(fieldName => {
                                if (taggedData.fieldMappings[fieldName] === key) {
                                    delete taggedData.fieldMappings[fieldName];
                                    removedMappings.push(fieldName);
                                }
                            });

                            // Save updated data to localStorage
                            saveTaggedData(taggedData);

                            // Remove the field from UI
                            fieldDiv.remove();

                            // Update the tag selector dropdown
                            updateTagSelector();

                            // Update mappings display if it exists
                            if (typeof updateMappingsDisplay === 'function') {
                                updateMappingsDisplay();
                            }

                            // Show success message
                            let successMessage = `✅ Deleted tag "${key}" successfully!`;
                            if (removedMappings.length > 0) {
                                successMessage += `\n\n🔗 Also removed ${removedMappings.length} field mapping${removedMappings.length > 1 ? 's' : ''}:`;
                                successMessage += `\n${removedMappings.map(field => `• "${field}"`).join('\n')}`;
                            }
                            alert(successMessage);

                            console.log(`🗑️ Deleted tag "${key}" and ${removedMappings.length} associated field mappings`);
                            console.log('Removed field mappings:', removedMappings);
                        }
                    });
                    fieldDiv.appendChild(deleteBtn);
                }

                return fieldDiv;
            }

            // Add tag fields (show tags, not individual field mappings)
            Object.entries(taggedData.tags).forEach(([tagName, value]) => {
                const isCustomField = !defaultTaggedData.tags.hasOwnProperty(tagName);
                const fieldRow = createFieldRow(tagName, value, isCustomField);
                form.appendChild(fieldRow);
            });

            modal.appendChild(form);

            // Create "Add Custom Tag" section
            const addFieldSection = document.createElement('div');
            addFieldSection.style.cssText = 'margin-top: 16px; padding-top: 16px; border-top: 2px solid #eee;';

            const addFieldTitle = document.createElement('h3');
            addFieldTitle.style.cssText = 'margin: 0 0 12px 0; color: #333; font-size: 16px; text-align: center;';
            addFieldTitle.textContent = '🏷️ Add Custom Tag';

            // Create two sections: Add New Tag and Map Field to Existing Tag

            // Section 1: Add New Tag
            const newTagSection = document.createElement('div');
            newTagSection.style.cssText = 'margin-bottom: 16px; padding: 12px; background: #f8f9fa; border-radius: 8px;';

            const newTagLabel = document.createElement('h4');
            newTagLabel.style.cssText = 'margin: 0 0 8px 0; color: #333; font-size: 14px;';
            newTagLabel.textContent = '➕ Create New Tag';

            const newTagContainer = document.createElement('div');
            newTagContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center;';

            // Tag name input
            const tagNameInput = document.createElement('input');
            tagNameInput.type = 'text';
            tagNameInput.placeholder = 'Tag Name (e.g., "FATHER_NAME")';
            tagNameInput.style.cssText = `
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
                text-transform: uppercase;
            `;
            tagNameInput.addEventListener('focus', () => tagNameInput.style.borderColor = '#4caf50');
            tagNameInput.addEventListener('blur', () => tagNameInput.style.borderColor = '#ddd');
            tagNameInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
            });

            // Tag value input
            const tagValueInput = document.createElement('input');
            tagValueInput.type = 'text';
            tagValueInput.placeholder = 'Tag Value (e.g., "John Doe")';
            tagValueInput.style.cssText = `
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            `;
            tagValueInput.addEventListener('focus', () => tagValueInput.style.borderColor = '#4caf50');
            tagValueInput.addEventListener('blur', () => tagValueInput.style.borderColor = '#ddd');

            // Add new tag button
            const addNewTagButton = document.createElement('button');
            addNewTagButton.type = 'button';
            addNewTagButton.textContent = '➕';
            addNewTagButton.title = 'Add new tag';
            addNewTagButton.style.cssText = `
                background: #4caf50;
                color: white;
                border: none;
                padding: 10px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
            `;
            addNewTagButton.addEventListener('mouseenter', () => addNewTagButton.style.background = '#45a049');
            addNewTagButton.addEventListener('mouseleave', () => addNewTagButton.style.background = '#4caf50');

            newTagContainer.appendChild(tagNameInput);
            newTagContainer.appendChild(tagValueInput);
            newTagContainer.appendChild(addNewTagButton);
            newTagSection.appendChild(newTagLabel);
            newTagSection.appendChild(newTagContainer);

            // Section 2: Map Field to Existing Tag
            const mapFieldSection = document.createElement('div');
            mapFieldSection.style.cssText = 'padding: 12px; background: #e8f5e8; border-radius: 8px;';

            const mapFieldLabel = document.createElement('h4');
            mapFieldLabel.style.cssText = 'margin: 0 0 8px 0; color: #333; font-size: 14px;';
            mapFieldLabel.textContent = '🔗 Map Field to Existing Tag';

            const mapFieldContainer = document.createElement('div');
            mapFieldContainer.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center;';

            // Field name input
            const fieldNameInput = document.createElement('input');
            fieldNameInput.type = 'text';
            fieldNameInput.placeholder = 'Field Name (e.g., "Father Name")';
            fieldNameInput.style.cssText = `
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
            `;
            fieldNameInput.addEventListener('focus', () => fieldNameInput.style.borderColor = '#4caf50');
            fieldNameInput.addEventListener('blur', () => fieldNameInput.style.borderColor = '#ddd');

            // Tag selector dropdown
            const tagSelector = document.createElement('select');
            tagSelector.style.cssText = `
                padding: 8px 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 14px;
                transition: border-color 0.2s;
                background: white;
                max-width: 100%;
                font-family: 'Courier New', monospace;
                line-height: 1.4;
            `;
            tagSelector.addEventListener('focus', () => tagSelector.style.borderColor = '#4caf50');
            tagSelector.addEventListener('blur', () => tagSelector.style.borderColor = '#ddd');

            // Function to truncate long text for better display
            function truncateText(text, maxLength = 20) {
                if (!text) return '';
                if (text.length <= maxLength) return text;
                return text.substring(0, maxLength) + '...';
            }

            // Populate tag selector
            function updateTagSelector() {
                // Clear existing options using DOM methods (safer than innerHTML)
                while (tagSelector.firstChild) {
                    tagSelector.removeChild(tagSelector.firstChild);
                }

                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Select existing tag...';
                tagSelector.appendChild(defaultOption);

                // Sort tags alphabetically for better organization
                const sortedTagNames = Object.keys(taggedData.tags).sort();

                sortedTagNames.forEach(tagName => {
                    const option = document.createElement('option');
                    option.value = tagName;
                    
                    const tagValue = taggedData.tags[tagName];
                    const truncatedValue = truncateText(tagValue, 20);
                    
                    // Format: TAG_NAME: Short Value
                    option.textContent = `${tagName}: ${truncatedValue}`;
                    
                    // Add full value as title for tooltip
                    option.title = `${tagName}\nFull value: ${tagValue}`;
                    
                    tagSelector.appendChild(option);
                });
            }
            updateTagSelector();

            // Add field mapping button
            const addMappingButton = document.createElement('button');
            addMappingButton.type = 'button';
            addMappingButton.textContent = '🔗';
            addMappingButton.title = 'Map field to tag';
            addMappingButton.style.cssText = `
                background: #2196f3;
                color: white;
                border: none;
                padding: 10px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
            `;
            addMappingButton.addEventListener('mouseenter', () => addMappingButton.style.background = '#1976d2');
            addMappingButton.addEventListener('mouseleave', () => addMappingButton.style.background = '#2196f3');

            mapFieldContainer.appendChild(fieldNameInput);
            mapFieldContainer.appendChild(tagSelector);
            mapFieldContainer.appendChild(addMappingButton);
            mapFieldSection.appendChild(mapFieldLabel);
            mapFieldSection.appendChild(mapFieldContainer);

            // Add button
            const addButton = document.createElement('button');
            addButton.type = 'button';
            addButton.textContent = '➕';
            addButton.title = 'Add this field';
            addButton.style.cssText = `
                background: #4caf50;
                color: white;
                border: none;
                padding: 10px 12px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.2s;
            `;
            addButton.addEventListener('mouseenter', () => addButton.style.background = '#45a049');
            addButton.addEventListener('mouseleave', () => addButton.style.background = '#4caf50');

            // Add new tag functionality
            function addNewTag() {
                const tagName = tagNameInput.value.trim();
                const tagValue = tagValueInput.value.trim();

                if (!tagName) {
                    alert('Please enter a tag name!');
                    tagNameInput.focus();
                    return;
                }

                if (!tagValue) {
                    alert('Please enter a tag value!');
                    tagValueInput.focus();
                    return;
                }

                // Check if tag already exists
                if (taggedData.tags[tagName]) {
                    alert('A tag with this name already exists! Use the mapping section below to assign fields to it.');
                    tagNameInput.focus();
                    return;
                }

                // Add the new tag
                taggedData.tags[tagName] = tagValue;

                // Auto-create intelligent field mappings based on tag name
                const autoMappings = generateAutoFieldMappings(tagName);
                autoMappings.forEach(fieldName => {
                    taggedData.fieldMappings[fieldName] = tagName;
                });

                // Create and add the new tag field to the form
                const newFieldRow = createFieldRow(tagName, tagValue, true);
                form.appendChild(newFieldRow);

                // Update the tag selector dropdown
                updateTagSelector();

                // Update mappings display if it exists
                if (typeof updateMappingsDisplay === 'function') {
                    updateMappingsDisplay();
                }

                // Clear inputs
                tagNameInput.value = '';
                tagValueInput.value = '';
                tagNameInput.focus();

                // Show success message with auto-mappings info
                let successMessage = `✅ Added new tag: ${tagName} = ${tagValue}`;
                if (autoMappings.length > 0) {
                    successMessage += `\n\n🔗 Auto-created ${autoMappings.length} field mapping${autoMappings.length > 1 ? 's' : ''}:`;
                    successMessage += `\n${autoMappings.map(field => `• "${field}"`).join('\n')}`;
                    successMessage += `\n\n💡 These fields will now automatically use the value "${tagValue}" when filling forms.`;
                    successMessage += `\n\nYou can add more field mappings using the "Map Field to Existing Tag" section below.`;
                } else {
                    successMessage += `\n\n💡 Use the "Map Field to Existing Tag" section below to map form fields to this tag.`;
                }
                alert(successMessage);

                console.log(`✅ Added new tag: ${tagName} = ${tagValue}`);
                if (autoMappings.length > 0) {
                    console.log(`🔗 Auto-mapped to fields:`, autoMappings);
                }
            }

            // Add field mapping functionality
            function addFieldMapping() {
                const fieldName = fieldNameInput.value.trim();
                const selectedTag = tagSelector.value;

                if (!fieldName) {
                    alert('Please enter a field name!');
                    fieldNameInput.focus();
                    return;
                }

                if (!selectedTag) {
                    alert('Please select a tag to map to!');
                    tagSelector.focus();
                    return;
                }

                // Add the field mapping
                taggedData.fieldMappings[fieldName] = selectedTag;

                // Update the mappings display
                updateMappingsDisplay();

                // Clear inputs
                fieldNameInput.value = '';
                tagSelector.value = '';
                fieldNameInput.focus();

                // Show success message
                const tagValue = taggedData.tags[selectedTag];
                alert(`✅ Mapped "${fieldName}" to tag "${selectedTag}" (${tagValue})`);
                console.log(`✅ Mapped field "${fieldName}" to tag "${selectedTag}"`);
            }

            addNewTagButton.addEventListener('click', addNewTag);
            addMappingButton.addEventListener('click', addFieldMapping);

            // Allow Enter key navigation
            tagNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    tagValueInput.focus();
                }
            });

            tagValueInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addNewTag();
                }
            });

            fieldNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    tagSelector.focus();
                }
            });

            tagSelector.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addFieldMapping();
                }
            });

            // Section 3: View Current Mappings
            const viewMappingsSection = document.createElement('div');
            viewMappingsSection.style.cssText = 'margin-top: 16px; padding: 12px; background: #fff3e0; border-radius: 8px; border: 1px solid #ffcc02;';

            const viewMappingsLabel = document.createElement('h4');
            viewMappingsLabel.style.cssText = 'margin: 0 0 8px 0; color: #333; font-size: 14px;';
            viewMappingsLabel.textContent = '📋 Current Field Mappings';

            const mappingsContainer = document.createElement('div');
            mappingsContainer.style.cssText = 'max-height: 200px; overflow-y: auto; font-size: 12px;';

            // Function to update mappings display
            function updateMappingsDisplay() {
                // Clear existing content
                while (mappingsContainer.firstChild) {
                    mappingsContainer.removeChild(mappingsContainer.firstChild);
                }

                // Group field mappings by tag
                const tagToFields = {};
                Object.entries(taggedData.fieldMappings).forEach(([fieldName, tagName]) => {
                    if (!tagToFields[tagName]) {
                        tagToFields[tagName] = [];
                    }
                    tagToFields[tagName].push(fieldName);
                });

                // Display each tag and its mapped fields
                Object.entries(tagToFields).forEach(([tagName, fields]) => {
                    const tagValue = taggedData.tags[tagName] || 'No value set';

                    const mappingRow = document.createElement('div');
                    mappingRow.style.cssText = 'margin-bottom: 8px; padding: 8px; background: white; border-radius: 4px; border-left: 4px solid #4caf50;';

                    const tagInfo = document.createElement('div');
                    tagInfo.style.cssText = 'font-weight: bold; color: #2e7d32; margin-bottom: 4px;';
                    tagInfo.textContent = `🏷️ ${tagName}: "${tagValue}"`;

                    const fieldsInfo = document.createElement('div');
                    fieldsInfo.style.cssText = 'color: #666; font-size: 11px; margin-left: 16px;';
                    fieldsInfo.textContent = `📝 Fields: ${fields.join(', ')}`;

                    mappingRow.appendChild(tagInfo);
                    mappingRow.appendChild(fieldsInfo);
                    mappingsContainer.appendChild(mappingRow);
                });

                // Show message if no mappings exist
                if (Object.keys(tagToFields).length === 0) {
                    const noMappings = document.createElement('div');
                    noMappings.style.cssText = 'text-align: center; color: #999; font-style: italic; padding: 16px;';
                    noMappings.textContent = 'No field mappings configured yet';
                    mappingsContainer.appendChild(noMappings);
                }
            }

            // Initial display
            updateMappingsDisplay();

            viewMappingsSection.appendChild(viewMappingsLabel);
            viewMappingsSection.appendChild(mappingsContainer);

            addFieldSection.appendChild(addFieldTitle);
            addFieldSection.appendChild(newTagSection);
            addFieldSection.appendChild(mapFieldSection);
            addFieldSection.appendChild(viewMappingsSection);

            // Add comprehensive tip
            const customFieldTip = document.createElement('div');
            customFieldTip.style.cssText = 'text-align: center; font-size: 12px; color: #666; margin-top: 12px; line-height: 1.4;';
            customFieldTip.textContent = '💡 Tags are reusable values. Multiple field names can use the same tag. All data is saved permanently in your browser.';

            addFieldSection.appendChild(customFieldTip);
            modal.appendChild(addFieldSection);

            // Create validation summary section
            const validationSummary = document.createElement('div');
            validationSummary.id = 'validation-summary';
            validationSummary.style.cssText = `
                margin-top: 16px;
                padding: 8px 12px;
                border-radius: 6px;
                display: none;
                font-size: 12px;
                text-align: center;
                font-weight: 500;
                transition: all 0.3s ease;
            `;
            modal.appendChild(validationSummary);

            // Function to update validation summary
            function updateValidationSummary() {
                const inputs = modal.querySelectorAll('input[data-key]');
                const validationResults = {};
                let validCount = 0;
                let errorCount = 0;
                let totalValidated = 0;

                inputs.forEach(input => {
                    const tagName = input.getAttribute('data-key');
                    const value = input.value.trim();
                    if (value) { // Only validate non-empty fields
                        const validation = validateField(tagName, value);
                        validationResults[tagName] = validation;
                        totalValidated++;

                        if (validation.fieldType) { // Field has validation rules
                            if (validation.isValid) {
                                validCount++;
                            } else {
                                errorCount++;
                            }
                        }
                    }
                });

                if (totalValidated > 0) {
                    validationSummary.style.display = 'block';

                    if (errorCount > 0) {
                        validationSummary.style.background = 'rgba(244, 67, 54, 0.1)';
                        validationSummary.style.border = '1px solid rgba(244, 67, 54, 0.3)';
                        validationSummary.style.color = '#d32f2f';
                        validationSummary.innerHTML = `<span style="font-size: 14px;">⚠️</span> ${errorCount} field${errorCount > 1 ? 's need' : ' needs'} attention`;
                    } else if (validCount > 0) {
                        validationSummary.style.background = 'rgba(76, 175, 80, 0.1)';
                        validationSummary.style.border = '1px solid rgba(76, 175, 80, 0.3)';
                        validationSummary.style.color = '#388e3c';
                        validationSummary.innerHTML = `<span style="font-size: 14px;">✅</span> All fields validated`;
                    } else {
                        validationSummary.style.display = 'none';
                    }
                } else {
                    validationSummary.style.display = 'none';
                }
            }

            // Add validation summary update to input events
            const originalCreateFieldRow = createFieldRow;
            function createFieldRowWithValidation(key, value, isCustom = false) {
                const fieldRow = originalCreateFieldRow(key, value, isCustom);
                const input = fieldRow.querySelector('input');

                if (input) {
                    // Add validation summary update to existing events
                    input.addEventListener('blur', () => {
                        setTimeout(updateValidationSummary, 100); // Small delay to ensure validation feedback is applied
                    });

                    input.addEventListener('input', () => {
                        setTimeout(updateValidationSummary, 100);
                    });
                }

                return fieldRow;
            }

            // Replace createFieldRow with validation-aware version
            createFieldRow = createFieldRowWithValidation;

            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 12px; justify-content: center; margin-top: 24px; flex-wrap: wrap;';

            // Create save only button
            const saveOnlyButton = document.createElement('button');
            saveOnlyButton.id = 'save-only';
            saveOnlyButton.textContent = '💾 Save';
            saveOnlyButton.style.cssText = `
                background: #2196f3;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            `;
            saveOnlyButton.addEventListener('mouseenter', () => saveOnlyButton.style.background = '#1976d2');
            saveOnlyButton.addEventListener('mouseleave', () => saveOnlyButton.style.background = '#2196f3');

            // Create save and fill button
            const saveAndFillButton = document.createElement('button');
            saveAndFillButton.id = 'save-and-fill';
            saveAndFillButton.textContent = '🚀 Fill Form';
            saveAndFillButton.style.cssText = `
                background: #4caf50;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            `;
            saveAndFillButton.addEventListener('mouseenter', () => saveAndFillButton.style.background = '#45a049');
            saveAndFillButton.addEventListener('mouseleave', () => saveAndFillButton.style.background = '#4caf50');

            // Create cancel button
            const cancelButton = document.createElement('button');
            cancelButton.id = 'cancel-modal';
            cancelButton.textContent = '❌ Cancel';
            cancelButton.style.cssText = `
                background: #f44336;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 6px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.2s;
            `;
            cancelButton.addEventListener('mouseenter', () => cancelButton.style.background = '#da190b');
            cancelButton.addEventListener('mouseleave', () => cancelButton.style.background = '#f44336');

            buttonContainer.appendChild(saveOnlyButton);
            buttonContainer.appendChild(saveAndFillButton);
            buttonContainer.appendChild(cancelButton);
            modal.appendChild(buttonContainer);

            // Create tip text
            const tip = document.createElement('div');
            tip.style.cssText = 'text-align: center; margin-top: 16px; font-size: 12px; color: #666; line-height: 1.4;';
            tip.textContent = '💡 Save: Store your data for later use | Fill Form: Save data and immediately fill the current form';
            modal.appendChild(tip);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Mark modal as open
            isCustomizationModalOpen = true;

            // Function to close modal and update state
            function closeModal() {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
                isCustomizationModalOpen = false;
            }

            // Function to collect and save data with validation
            function collectAndSaveData() {
                // Collect all tag values
                const inputs = modal.querySelectorAll('input[data-key]');
                const newTags = {};

                inputs.forEach(input => {
                    const tagName = input.getAttribute('data-key');
                    const value = input.value.trim();
                    newTags[tagName] = value;
                });

                // Validate all collected data
                const validationResults = validateAllData(newTags);

                if (validationResults.hasErrors) {
                    // Show validation errors and prevent saving
                    showValidationErrors(validationResults);

                    // Add visual feedback to invalid inputs
                    inputs.forEach(input => {
                        const tagName = input.getAttribute('data-key');
                        const validation = validationResults.results[tagName];
                        if (validation) {
                            addValidationFeedback(input, validation);
                        }
                    });

                    return false; // Prevent saving
                }

                // Update global tagged data
                taggedData.tags = { ...taggedData.tags, ...newTags };

                // Save to localStorage
                saveTaggedData(taggedData);

                console.log('✅ Tagged data validated and saved to localStorage!');
                return true; // Success
            }

            // Add event listeners for save only button
            saveOnlyButton.addEventListener('click', () => {
                const isValid = collectAndSaveData();

                if (isValid) {
                    // Close modal
                    closeModal();

                    // Show success message
                    alert('💾 Data validated and saved successfully! You can now fill forms with your saved data.');

                    // Resolve with false (don't fill form)
                    resolve(false);
                }
                // If validation fails, modal stays open for corrections
            });

            // Add event listeners for save and fill button
            saveAndFillButton.addEventListener('click', () => {
                const isValid = collectAndSaveData();

                if (isValid) {
                    // Close modal
                    closeModal();

                    // Resolve with true (proceed to fill form)
                    resolve(true);
                }
                // If validation fails, modal stays open for corrections
            });

            cancelButton.addEventListener('click', () => {
                closeModal();
                resolve(false);
            });

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeModal();
                    resolve(false);
                }
            });

            // Focus first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
            }, 100);
        });
    }



    // Function to fill text inputs
    function fillTextInput(input, value) {
        if (!input || !value) return false;

        // Set the value
        input.value = value;

        // Trigger events to ensure Google Forms recognizes the input
        const events = ['input', 'change', 'blur'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            input.dispatchEvent(event);
        });

        return true;
    }

    // Function to fill date inputs
    function fillDateInput(input, value) {
        if (!input || !value) return false;

        try {
            // Convert various date formats to YYYY-MM-DD format
            let dateValue = value;

            // If value is already in YYYY-MM-DD format, use it directly
            if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                dateValue = value;
            }
            // If value is in DD/MM/YYYY or DD-MM-YYYY format
            else if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(value)) {
                const parts = value.split(/[\/\-]/);
                dateValue = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
            // If value is in MM/DD/YYYY or MM-DD-YYYY format
            else if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{4}$/.test(value)) {
                const parts = value.split(/[\/\-]/);
                dateValue = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
            }
            // If value is just a year (for YOP fields)
            else if (/^\d{4}$/.test(value)) {
                // Use January 1st of that year as default
                dateValue = `${value}-01-01`;
            }
            // Try to parse as a date string
            else {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    dateValue = date.toISOString().split('T')[0];
                } else {
                    console.log(`Could not parse date value: ${value}`);
                    return false;
                }
            }

            // Set the date value
            input.value = dateValue;
            input.setAttribute('data-initial-value', dateValue);

            // Trigger events to ensure Google Forms recognizes the input
            const events = ['input', 'change', 'blur'];
            events.forEach(eventType => {
                const event = new Event(eventType, { bubbles: true });
                input.dispatchEvent(event);
            });

            console.log(`Date input filled: ${value} → ${dateValue}`);
            return true;
        } catch (error) {
            ErrorHandler.showNotification(`Failed to fill date field: ${error.message}`, 'error');
            console.error(`Error filling date input:`, error);
            return false;
        }
    }

    // Function to fill textarea inputs
    function fillTextarea(textarea, value) {
        if (!textarea || !value) return false;

        // Set the value
        textarea.value = value;
        textarea.setAttribute('data-initial-value', value);

        // Trigger events to ensure Google Forms recognizes the input
        const events = ['input', 'change', 'blur'];
        events.forEach(eventType => {
            const event = new Event(eventType, { bubbles: true });
            textarea.dispatchEvent(event);
        });

        return true;
    }

    // Function to select radio button
    function selectRadioButton(container, value) {
        if (!container || !value) return false;

        try {
            console.log(`🔘 Looking for radio button with value: ${value}`);

            // Find all radio button options
            const radioOptions = container.querySelectorAll('[role="radio"]');
            console.log(`Found ${radioOptions.length} radio options`);

            let targetOption = null;

            // Look for exact match by data-value or aria-label
            for (const option of radioOptions) {
                const dataValue = option.getAttribute('data-value');
                const ariaLabel = option.getAttribute('aria-label');
                const textElement = option.querySelector('.aDTYNe');
                const textValue = textElement ? textElement.textContent.trim() : '';

                console.log(`Radio option - data-value: "${dataValue}", aria-label: "${ariaLabel}", text: "${textValue}"`);

                // Check data-value, aria-label, and text content for matches
                if ((dataValue && dataValue.toLowerCase() === value.toLowerCase()) ||
                    (ariaLabel && ariaLabel.toLowerCase() === value.toLowerCase()) ||
                    (textValue && textValue.toLowerCase() === value.toLowerCase())) {
                    targetOption = option;
                    console.log(`✅ Found matching radio option: ${dataValue || ariaLabel || textValue}`);
                    break;
                }
            }

            if (targetOption) {
                // Click the radio button to select it
                targetOption.click();

                // Add visual highlighting
                // targetOption.style.cssText += `
                //     background: linear-gradient(45deg, #2196f3, #64b5f6) !important;
                //     border: 2px solid #1976d2 !important;
                //     box-shadow: 0 0 10px #2196f3 !important;
                //     transform: scale(1.02) !important;
                // `;

                console.log(`✅ Radio button selected: ${value}`);
                return true;
            } else {
                console.log(`❌ No matching radio option found for: ${value}`);
                return false;
            }
        } catch (error) {
            ErrorHandler.showNotification(`Failed to select radio button: ${value}`, 'error');
            console.error(`Error selecting radio button:`, error);
            return false;
        }
    }

    // Function to select checkboxes
    function selectCheckboxes(container, value) {
        if (!container || !value) return false;

        try {
            console.log(`☑️ Looking for checkboxes with value: ${value}`);

            // Split value by comma for multiple selections
            const values = value.split(',').map(v => v.trim());
            console.log(`Checkbox values to select:`, values);

            // Find all checkbox options
            const checkboxOptions = container.querySelectorAll('[role="checkbox"]');
            console.log(`Found ${checkboxOptions.length} checkbox options`);

            let selectedCount = 0;

            values.forEach(targetValue => {
                let targetOption = null;

                // Look for exact match by data-answer-value or aria-label
                for (const option of checkboxOptions) {
                    const dataValue = option.getAttribute('data-answer-value');
                    const ariaLabel = option.getAttribute('aria-label');
                    const textElement = option.querySelector('.aDTYNe');
                    const textValue = textElement ? textElement.textContent.trim() : '';

                    console.log(`Checkbox option - data-answer-value: "${dataValue}", aria-label: "${ariaLabel}", text: "${textValue}"`);

                    // Check data-answer-value, aria-label, and text content for matches
                    if ((dataValue && dataValue.toLowerCase() === targetValue.toLowerCase()) ||
                        (ariaLabel && ariaLabel.toLowerCase() === targetValue.toLowerCase()) ||
                        (textValue && textValue.toLowerCase() === targetValue.toLowerCase())) {
                        targetOption = option;
                        console.log(`✅ Found matching checkbox option: ${dataValue || ariaLabel || textValue}`);
                        break;
                    }
                }

                if (targetOption) {
                    // Check if already selected
                    const isChecked = targetOption.getAttribute('aria-checked') === 'true';

                    if (!isChecked) {
                        // Click the checkbox to select it
                        targetOption.click();
                        selectedCount++;

                        // Add visual highlighting
                        // targetOption.style.cssText += `
                        //     background: linear-gradient(45deg, #4caf50, #81c784) !important;
                        //     border: 2px solid #388e3c !important;
                        //     box-shadow: 0 0 10px #4caf50 !important;
                        //     transform: scale(1.02) !important;
                        // `;

                        console.log(`✅ Checkbox selected: ${targetValue}`);
                    } else {
                        console.log(`ℹ️ Checkbox already selected: ${targetValue}`);
                        selectedCount++;
                    }
                } else {
                    console.log(`❌ No matching checkbox found for: ${targetValue}`);
                }
            });

            return selectedCount > 0;
        } catch (error) {
            ErrorHandler.showNotification(`Failed to select checkboxes: ${value}`, 'error');
            console.error(`Error selecting checkboxes:`, error);
            return false;
        }
    }

    // Highlight dropdown options for manual selection
    function selectDropdownOption(container, value) {
        if (!container || !value) return false;

        return new Promise((resolve) => {
            try {
                console.log(`🔍 Highlighting dropdown option for manual selection: ${value}`);

                // Find all options with data-value attribute
                const allOptions = container.querySelectorAll('[role="option"][data-value]');
                console.log(`Found ${allOptions.length} options with data-value`);

                let targetOption = null;

                // Look for exact match by data-value or text content
                for (const option of allOptions) {
                    const dataValue = option.getAttribute('data-value');
                    const textElement = option.querySelector('.vRMGwf.oJeWuf');
                    const textValue = textElement ? textElement.textContent.trim() : '';

                    console.log(`Option - data-value: "${dataValue}", text: "${textValue}"`);

                    // Check both data-value and text content for matches
                    if ((dataValue && dataValue.toLowerCase() === value.toLowerCase()) ||
                        (textValue && textValue.toLowerCase() === value.toLowerCase() && textValue.toLowerCase() !== 'choose')) {
                        targetOption = option;
                        console.log(`✅ Found matching option: data-value="${dataValue}", text="${textValue}"`);
                        break;
                    }
                }

                if (targetOption) {
                    // Highlight the option for manual selection
                    console.log(`🎯 Highlighting "${value}" option for manual selection`);

                    // Add visual highlighting with a distinctive green style
                    const originalStyle = targetOption.style.cssText;
                    targetOption.style.cssText += `
                        background: linear-gradient(45deg, #4caf50, #8bc34a) !important;
                        border: 3px solid #2e7d32 !important;
                        box-shadow: 0 0 15px #4caf50, inset 0 0 10px rgba(76,175,80,0.3) !important;
                        transform: scale(1.02) !important;
                        z-index: 9999 !important;
                        position: relative !important;
                    `;

                    // Add a label to make it super clear
                    const label = document.createElement('div');
                    label.style.cssText = `
                        position: absolute;
                        top: -25px;
                        left: 50%;
                        transform: translateX(-50%);
                        background: #2e7d32;
                        color: white;
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: bold;
                        z-index: 10000;
                        pointer-events: none;
                    `;
                    label.textContent = `👆 CLICK ME: ${value}`;
                    targetOption.style.position = 'relative';
                    targetOption.appendChild(label);

                    // Scroll to the option
                    targetOption.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Clean up highlighting after 15 seconds
                    setTimeout(() => {
                        targetOption.style.cssText = originalStyle;
                        if (label.parentNode) {
                            label.parentNode.removeChild(label);
                        }
                    }, 15000);

                    resolve(true); // Return true to indicate we found and highlighted the option

                } else {
                    console.log(`❌ No matching option found for value: ${value}`);
                    resolve(false);
                }

            } catch (error) {
                console.error('Error in selectDropdownOption:', error);
                resolve(false);
            }
        });
    }

    // Function to create progress indicator
    function createProgressIndicator() {
        // Remove existing progress indicator if any
        const existing = document.getElementById('form-filler-progress');
        if (existing) existing.remove();

        // Create progress container
        const progressContainer = document.createElement('div');
        progressContainer.id = 'form-filler-progress';
        progressContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10001;
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            min-width: 400px;
            font-family: Arial, sans-serif;
            text-align: center;
        `;

        // Create title
        const title = document.createElement('h3');
        title.style.cssText = 'margin: 0 0 16px 0; color: #333; font-size: 18px;';
        title.textContent = '🚀 Filling Google Form...';

        // Create progress bar container
        const progressBarContainer = document.createElement('div');
        progressBarContainer.style.cssText = `
            width: 100%;
            height: 8px;
            background: #e0e0e0;
            border-radius: 4px;
            overflow: hidden;
            margin: 16px 0;
        `;

        // Create progress bar
        const progressBar = document.createElement('div');
        progressBar.id = 'form-filler-progress-bar';
        progressBar.style.cssText = `
            width: 0%;
            height: 100%;
            background: linear-gradient(90deg, #4caf50, #8bc34a);
            border-radius: 4px;
            transition: width 0.3s ease;
        `;

        progressBarContainer.appendChild(progressBar);

        // Create status text
        const statusText = document.createElement('div');
        statusText.id = 'form-filler-status';
        statusText.style.cssText = 'color: #666; font-size: 14px; margin-top: 12px;';
        statusText.textContent = 'Initializing...';

        // Create field counter
        const fieldCounter = document.createElement('div');
        fieldCounter.id = 'form-filler-counter';
        fieldCounter.style.cssText = 'color: #999; font-size: 12px; margin-top: 8px;';
        fieldCounter.textContent = '0 / 0 fields processed';

        progressContainer.appendChild(title);
        progressContainer.appendChild(progressBarContainer);
        progressContainer.appendChild(statusText);
        progressContainer.appendChild(fieldCounter);

        document.body.appendChild(progressContainer);

        return {
            container: progressContainer,
            bar: progressBar,
            status: statusText,
            counter: fieldCounter,
            title: title
        };
    }

    // Function to update progress
    function updateProgress(current, total, fieldName, success) {
        const progressBar = document.getElementById('form-filler-progress-bar');
        const statusText = document.getElementById('form-filler-status');
        const counterText = document.getElementById('form-filler-counter');

        if (progressBar && statusText && counterText) {
            const percentage = total > 0 ? (current / total) * 100 : 0;
            progressBar.style.width = `${percentage}%`;

            if (fieldName) {
                const icon = success ? '✅' : '⚠️';
                statusText.textContent = `${icon} ${fieldName}`;
            }

            counterText.textContent = `${current} / ${total} fields processed`;
        }
    }

    // Function to show success animation
    function showSuccessAnimation(filledCount, totalCount, skippedCount) {
        const progressContainer = document.getElementById('form-filler-progress');
        if (!progressContainer) return;

        // Update to success state
        const title = progressContainer.querySelector('h3');
        const statusText = document.getElementById('form-filler-status');
        const progressBar = document.getElementById('form-filler-progress-bar');

        // Success animation
        title.textContent = '🎉 Form Filling Complete!';
        title.style.color = '#4caf50';

        progressBar.style.background = 'linear-gradient(90deg, #4caf50, #66bb6a)';
        progressBar.style.width = '100%';

        // Create success summary
        const summary = document.createElement('div');
        summary.style.cssText = `
            margin-top: 16px;
            padding: 12px;
            background: #e8f5e8;
            border-radius: 8px;
            border-left: 4px solid #4caf50;
        `;

        // Create summary title using DOM methods (safer than innerHTML)
        const summaryTitle = document.createElement('div');
        summaryTitle.style.cssText = 'font-weight: bold; color: #2e7d32; margin-bottom: 8px;';
        summaryTitle.textContent = '📊 Summary:';

        // Create summary content
        const summaryContent = document.createElement('div');
        summaryContent.style.cssText = 'font-size: 14px; color: #333;';

        // Create individual lines
        const filledLine = document.createElement('div');
        filledLine.style.cssText = 'margin-bottom: 4px;';
        filledLine.textContent = `✅ ${filledCount} fields filled successfully`;

        const skippedLine = document.createElement('div');
        skippedLine.style.cssText = 'margin-bottom: 4px;';
        skippedLine.textContent = `⚠️ ${skippedCount} fields skipped (no data)`;

        const totalLine = document.createElement('div');
        totalLine.textContent = `📝 ${totalCount} total fields processed`;

        // Append all elements using DOM methods
        summaryContent.appendChild(filledLine);
        summaryContent.appendChild(skippedLine);
        summaryContent.appendChild(totalLine);

        summary.appendChild(summaryTitle);
        summary.appendChild(summaryContent);

        statusText.replaceWith(summary);

        // Add celebration effect
        progressContainer.style.animation = 'bounce 0.6s ease-in-out';

        // Add CSS animation if not exists
        if (!document.getElementById('form-filler-animations')) {
            const style = document.createElement('style');
            style.id = 'form-filler-animations';
            style.textContent = `
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% { transform: translate(-50%, -50%) translateY(0); }
                    40% { transform: translate(-50%, -50%) translateY(-10px); }
                    60% { transform: translate(-50%, -50%) translateY(-5px); }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .field-success {
                    animation: pulse 0.3s ease-in-out;
                    border: 2px solid #4caf50 !important;
                    box-shadow: 0 0 8px rgba(76, 175, 80, 0.3) !important;
                }
                .validation-success {
                    border-color: #4caf50 !important;
                    box-shadow: 0 0 3px rgba(76, 175, 80, 0.2) !important;
                    transition: all 0.3s ease;
                }
                .validation-error {
                    border-color: #f44336 !important;
                    box-shadow: 0 0 3px rgba(244, 67, 54, 0.2) !important;
                    animation: shake 0.3s ease-in-out;
                    transition: all 0.3s ease;
                }
                .validation-icon {
                    transition: all 0.2s ease;
                }
                .validation-icon:hover {
                    transform: translateY(-50%) scale(1.1);
                }
                .validation-tooltip {
                    font-family: Arial, sans-serif;
                    line-height: 1.3;
                }
                .validation-tooltip::before {
                    content: '';
                    position: absolute;
                    top: -4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    border-bottom: 4px solid #f44336;
                }
                
                /* Improved dropdown styling */
                select option {
                    padding: 8px 12px !important;
                    font-family: 'Courier New', monospace !important;
                    font-size: 13px !important;
                    line-height: 1.4 !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }
                
                select option:hover {
                    background-color: #e3f2fd !important;
                }
                
                select option[value=""] {
                    font-style: italic !important;
                    color: #999 !important;
                    font-family: Arial, sans-serif !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Smart auto-close with hover detection
        let autoCloseTimer = null;
        let isHovering = false;

        // Function to start auto-close timer
        function startAutoCloseTimer() {
            if (autoCloseTimer) {
                clearTimeout(autoCloseTimer);
            }

            autoCloseTimer = setTimeout(() => {
                if (!isHovering && progressContainer && document.body.contains(progressContainer)) {
                    console.log('🎉 Auto-closing success summary (no hover detected)');
                    closeSuccessSummary();
                }
            }, 3000);
        }

        // Function to close the success summary
        function closeSuccessSummary() {
            if (progressContainer && document.body.contains(progressContainer)) {
                progressContainer.style.opacity = '0';
                progressContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
                progressContainer.style.transition = 'all 0.3s ease';

                setTimeout(() => {
                    if (document.body.contains(progressContainer)) {
                        document.body.removeChild(progressContainer);
                    }
                }, 300);
            }
        }

        // Add hover event listeners
        progressContainer.addEventListener('mouseenter', () => {
            isHovering = true;
            console.log('🎯 Mouse entered success summary - pausing auto-close');

            // Clear the auto-close timer
            if (autoCloseTimer) {
                clearTimeout(autoCloseTimer);
                autoCloseTimer = null;
            }

            // Add visual feedback for hover state
            progressContainer.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)';
            progressContainer.style.transform = 'translate(-50%, -50%) scale(1.02)';
        });

        progressContainer.addEventListener('mouseleave', () => {
            isHovering = false;
            console.log('🎯 Mouse left success summary - resuming auto-close in 3 seconds');

            // Remove hover visual feedback
            progressContainer.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
            progressContainer.style.transform = 'translate(-50%, -50%) scale(1)';

            // Restart auto-close timer
            startAutoCloseTimer();
        });

        // Add manual close button for better UX
        const closeButton = document.createElement('button');
        closeButton.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: #f44336;
            color: white;
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;
        closeButton.textContent = '×';
        closeButton.title = 'Close summary';

        closeButton.addEventListener('mouseenter', () => {
            closeButton.style.background = '#da190b';
            closeButton.style.transform = 'scale(1.1)';
        });

        closeButton.addEventListener('mouseleave', () => {
            closeButton.style.background = '#f44336';
            closeButton.style.transform = 'scale(1)';
        });

        closeButton.addEventListener('click', () => {
            console.log('🎯 Manual close button clicked');
            closeSuccessSummary();
        });

        progressContainer.appendChild(closeButton);

        // Start the initial auto-close timer
        startAutoCloseTimer();
    }

    // Function to add field success animation
    function animateFieldSuccess(element) {
        if (element) {
            element.classList.add('field-success');
            setTimeout(() => {
                element.classList.remove('field-success');
            }, 600);
        }
    }

    // Function to process all form fields with progress tracking
    async function fillForm() {
        console.log('🚀 Starting Google Form auto-fill with progress tracking...');

        // Create progress indicator
        const progress = createProgressIndicator();

        // Find all question containers
        const questionContainers = document.querySelectorAll('.Qr7Oae');
        const totalFields = questionContainers.length;
        let processedFields = 0;
        let filledFields = 0;
        let skippedFields = 0;

        // Update initial state
        updateProgress(0, totalFields, 'Scanning form fields...', true);
        await new Promise(resolve => setTimeout(resolve, 500)); // Brief pause for UX

        for (let index = 0; index < questionContainers.length; index++) {
            const container = questionContainers[index];
            try {
                // Find the title element
                const titleElement = container.querySelector('.M7eMe');
                if (!titleElement) {
                    processedFields++;
                    updateProgress(processedFields, totalFields, 'Skipping invalid field', false);
                    continue;
                }

                const titleText = titleElement.textContent.trim();
                const value = getValueForField(titleText);

                processedFields++;

                if (!value) {
                    console.log(`No value found for field: "${titleText}"`);
                    skippedFields++;
                    updateProgress(processedFields, totalFields, `Skipped: ${titleText}`, false);
                    await new Promise(resolve => setTimeout(resolve, 200)); // Brief pause
                    continue;
                }

                console.log(`Processing field: "${titleText}" with value: "${value}"`);
                updateProgress(processedFields, totalFields, `Filling: ${titleText}`, true);

                let success = false;

                // Check if it's a text input field
                const textInput = container.querySelector('input.whsOnd.zHQkBf');
                if (textInput) {
                    // Check if it's a date input
                    if (textInput.type === 'date') {
                        success = fillDateInput(textInput, value);
                        if (success) {
                            animateFieldSuccess(textInput);
                            filledFields++;
                        }
                        console.log(`Date input filled for "${titleText}": ${success}`);
                    } else {
                        // Regular text input
                        success = fillTextInput(textInput, value);
                        if (success) {
                            animateFieldSuccess(textInput);
                            filledFields++;
                        }
                        console.log(`Text input filled for "${titleText}": ${success}`);
                    }
                }
                // Check if it's a textarea field
                else {
                    const textarea = container.querySelector('textarea.KHxj8b');
                    if (textarea) {
                        success = fillTextarea(textarea, value);
                        if (success) {
                            animateFieldSuccess(textarea);
                            filledFields++;
                        }
                        console.log(`Textarea filled for "${titleText}": ${success}`);
                    }
                    // Check if it's a radio button field
                    else {
                        const radioContainer = container.querySelector('[role="radiogroup"]');
                        if (radioContainer) {
                            success = selectRadioButton(radioContainer, value);
                            if (success) {
                                animateFieldSuccess(radioContainer);
                                filledFields++;
                            }
                            console.log(`Radio button selected for "${titleText}": ${success}`);
                        }
                        // Check if it's a checkbox field
                        else {
                            const checkboxContainer = container.querySelector('[role="list"]');
                            if (checkboxContainer && checkboxContainer.querySelector('[role="checkbox"]')) {
                                success = selectCheckboxes(checkboxContainer, value);
                                if (success) {
                                    animateFieldSuccess(checkboxContainer);
                                    filledFields++;
                                }
                                console.log(`Checkboxes selected for "${titleText}": ${success}`);
                            }
                            // Check if it's a dropdown field
                            else {
                                const dropdownContainer = container.querySelector('.vQES8d');
                                if (dropdownContainer) {
                                    success = await selectDropdownOption(dropdownContainer, value);
                                    if (success) {
                                        animateFieldSuccess(dropdownContainer);
                                        filledFields++;
                                    }
                                    console.log(`Dropdown option selected for "${titleText}": ${success}`);
                                } else {
                                    console.log(`Unknown field type for: "${titleText}"`);
                                    skippedFields++;
                                }
                            }
                        }
                    }
                }

                // Brief pause between fields for better UX
                await new Promise(resolve => setTimeout(resolve, 300));

            } catch (error) {
                console.error(`Error processing field ${index}:`, error);
                skippedFields++;
                updateProgress(processedFields, totalFields, `Error: ${titleText || 'Unknown field'}`, false);

                // Show detailed error for critical failures
                if (error.name === 'SecurityError' || error.message.includes('Permission')) {
                    ErrorHandler.showNotification('Security restriction encountered - some fields may need manual filling', 'warning', 8000);
                } else {
                    ErrorHandler.showNotification(`Field error: ${titleText || 'Unknown field'}`, 'error', 3000);
                }
            }
        }

        // Show completion animation
        console.log(`✅ Form filling complete! Filled: ${filledFields}, Skipped: ${skippedFields}, Total: ${totalFields}`);
        showSuccessAnimation(filledFields, totalFields, skippedFields);
    }

    // Function to add floating icon with menu
    function addFillButton() {
        // Check if icon already exists
        if (document.getElementById('form-filler-icon')) return;

        // Create floating icon container
        const iconContainer = document.createElement('div');
        iconContainer.id = 'form-filler-icon';
        iconContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

        // Create the icon image
        const icon = document.createElement('img');
        icon.src = 'https://cdn-icons-png.flaticon.com/512/17113/17113805.png';
        icon.alt = 'Form Filler';
        icon.style.cssText = `
            width: 50px;
            height: 50px;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
            background: #473080;
            padding: 8px;
        `;

        // Add hover effect to icon
        iconContainer.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.1)';
            icon.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
        });

        iconContainer.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1)';
            icon.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        });

        iconContainer.appendChild(icon);

        // Create menu container
        const menu = document.createElement('div');
        menu.id = 'form-filler-menu';
        menu.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            z-index: 9999;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            padding: 8px;
            display: none;
            min-width: 200px;
            font-family: Arial, sans-serif;
        `;

        // Create menu items
        const menuItems = [
            {
                text: '⚙️ Customize Data',
                id: 'customize-data-option',
                action: async () => {
                    hideMenu();
                    // Show customization modal and handle the result
                    const shouldFillForm = await showCustomizationModal();

                    if (shouldFillForm) {
                        // User clicked "Fill Form" - show instructions and fill
                        const instructions = `
🤖 GOOGLE FORM AUTO-FILLER READY!

✅ TEXT FIELDS: Will be filled automatically with your saved data
🎯 DROPDOWNS: Will be highlighted in green - you need to click them manually

The script will now:
1. Fill all text inputs automatically with your saved values
2. Highlight dropdown options with bright green colors and labels
3. You manually click the highlighted dropdown options

Ready to start filling the form?
                        `;

                        if (confirm(instructions)) {
                            fillForm();
                        }
                    }
                }
            },
            {
                text: '🚀 Fill Form (Saved Data)',
                id: 'fill-form-option',
                action: () => {
                    hideMenu();
                    // Fill form with current saved data
                    const instructions = `
🤖 GOOGLE FORM AUTO-FILLER READY!

✅ TEXT FIELDS: Will be filled automatically with your saved data
🎯 DROPDOWNS: Will be highlighted in green - you need to click them manually

The script will now:
1. Fill all text inputs automatically with your saved values
2. Highlight dropdown options with bright green colors and labels
3. You manually click the highlighted dropdown options

Ready to start filling the form?
                    `;

                    if (confirm(instructions)) {
                        fillForm();
                    }
                }
            },
            {
                text: '📋 View Mappings',
                id: 'view-mappings-option',
                action: () => {
                    hideMenu();
                    showCurrentMappings();
                    alert('📋 Current mappings displayed in console! Press F12 to view.');
                }
            },
            {
                text: '🎹 Shortcuts',
                id: 'shortcuts-option',
                action: () => {
                    hideMenu();
                    const shortcutsInfo = `🎹 KEYBOARD SHORTCUTS ENABLED:

Alt+F: Quick Fill Form (with saved data)
Alt+C: Customize Data (Toggle open/close)
Alt+M: View Mappings

💡 Tips:
• Alt+F instantly fills the form with your saved data
• Alt+C opens/closes the customize modal (toggle)
• Alt+M shows your current tag mappings in console
• All shortcuts work anywhere on the Google Forms page
• Shortcuts override browser defaults for better functionality`;

                    alert(shortcutsInfo);
                    console.log('🎹 Keyboard shortcuts enabled:');
                    console.log('   Alt+F: Quick Fill Form (with saved data)');
                    console.log('   Alt+C: Customize Data (Toggle open/close)');
                    console.log('   Alt+M: View Mappings');
                }
            },
            {
                text: '💾 Backup & Import',
                id: 'backup-import-option',
                action: () => {
                    hideMenu();
                    showBackupImportModal();
                }
            }
        ];

        // Create menu items
        menuItems.forEach((item, index) => {
            const menuItem = document.createElement('div');
            menuItem.id = item.id;
            menuItem.textContent = item.text;
            menuItem.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                border-radius: 8px;
                transition: background 0.2s ease;
                font-size: 14px;
                font-weight: 500;
                color: #333;
                ${index > 0 ? 'border-top: 1px solid #eee;' : ''}
            `;

            // Add hover effect
            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.background = '#f5f5f5';
            });

            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.background = 'transparent';
            });

            // Add click handler
            menuItem.addEventListener('click', item.action);

            menu.appendChild(menuItem);
        });

        // Function to show menu
        function showMenu() {
            menu.style.display = 'block';
            menu.style.opacity = '0';
            menu.style.transform = 'translateY(10px)';

            // Animate in
            setTimeout(() => {
                menu.style.transition = 'all 0.3s ease';
                menu.style.opacity = '1';
                menu.style.transform = 'translateY(0)';
            }, 10);
        }

        // Function to hide menu
        function hideMenu() {
            menu.style.transition = 'all 0.3s ease';
            menu.style.opacity = '0';
            menu.style.transform = 'translateY(10px)';

            setTimeout(() => {
                menu.style.display = 'none';
            }, 300);
        }

        // Toggle menu on icon click
        let menuVisible = false;
        iconContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            if (menuVisible) {
                hideMenu();
                menuVisible = false;
            } else {
                showMenu();
                menuVisible = true;
            }
        });

        // Hide menu when clicking outside
        document.addEventListener('click', (e) => {
            if (menuVisible && !menu.contains(e.target) && !iconContainer.contains(e.target)) {
                hideMenu();
                menuVisible = false;
            }
        });

        // Add elements to page
        document.body.appendChild(iconContainer);
        document.body.appendChild(menu);
    }

    // Keyboard shortcuts functionality
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Check for Alt + F (case insensitive)
            if (e.altKey && (e.key === 'f' || e.key === 'F')) {
                // Prevent default browser behavior (like opening File menu)
                e.preventDefault();
                e.stopPropagation();

                console.log('🎹 Keyboard shortcut Alt+F triggered - Quick Fill Form');

                // Quick fill form with saved data (same as "Fill Form (Saved Data)" menu option)
                const instructions = `
🎹 KEYBOARD SHORTCUT ACTIVATED (Alt+F)

🤖 GOOGLE FORM AUTO-FILLER READY!

✅ TEXT FIELDS: Will be filled automatically with your saved data
🎯 DROPDOWNS: Will be highlighted in green - you need to click them manually

The script will now:
1. Fill all text inputs automatically with your saved values
2. Highlight dropdown options with bright green colors and labels
3. You manually click the highlighted dropdown options

Ready to start filling the form?
                `;

                if (confirm(instructions)) {
                    fillForm();
                } else {
                    console.log('🎹 Quick fill cancelled by user');
                }
            }

            // Check for Alt + C for Customize Data (Toggle)
            else if (e.altKey && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
                e.stopPropagation();

                // Toggle modal - close if open, open if closed
                if (isCustomizationModalOpen) {
                    console.log('🎹 Keyboard shortcut Alt+C triggered - Closing Customize Data');
                    window.closeCustomizationModal();
                } else {
                    console.log('🎹 Keyboard shortcut Alt+C triggered - Opening Customize Data');

                    // Open customization modal
                    showCustomizationModal().then(shouldFillForm => {
                        if (shouldFillForm) {
                            const instructions = `
🎹 KEYBOARD SHORTCUT RESULT (Alt+C → Fill Form)

🤖 GOOGLE FORM AUTO-FILLER READY!

✅ TEXT FIELDS: Will be filled automatically with your saved data
🎯 DROPDOWNS: Will be highlighted in green - you need to click them manually

The script will now:
1. Fill all text inputs automatically with your saved values
2. Highlight dropdown options with bright green colors and labels
3. You manually click the highlighted dropdown options

Ready to start filling the form?
                            `;

                            if (confirm(instructions)) {
                                fillForm();
                            }
                        }
                    });
                }
            }

            // Check for Alt + M for View Mappings
            else if (e.altKey && (e.key === 'm' || e.key === 'M')) {
                e.preventDefault();
                e.stopPropagation();

                console.log('🎹 Keyboard shortcut Alt+M triggered - View Mappings');
                showCurrentMappings();
                alert('📋 Current mappings displayed in console! Press F12 to view.\n\n🎹 Triggered by Alt+M shortcut');
            }
        });

        console.log('🎹 Keyboard shortcuts enabled:');
        console.log('   Alt+F: Quick Fill Form (with saved data)');
        console.log('   Alt+C: Customize Data');
        console.log('   Alt+M: View Mappings');
    }

    // Wait for the page to load completely
    function init() {
        // Add the fill button
        addFillButton();

        // Setup keyboard shortcuts
        setupKeyboardShortcuts();

        // Optional: Auto-fill on page load (uncomment if desired)
        // setTimeout(fillForm, 2000);

        console.log('🚀 Google Form Auto Filler loaded! Click the button to auto-fill text fields and highlight dropdown options.');
        console.log('📋 Type showCurrentMappings() in console to view your current tag mappings.');

        // Show a quick summary of available tags
        const tagCount = Object.keys(taggedData.tags).length;
        const mappingCount = Object.keys(taggedData.fieldMappings).length;
        console.log(`🏷️ You have ${tagCount} tags and ${mappingCount} field mappings configured.`);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
class ImmediateGUI {
    static OccupiedElementIds = [];

    // NOTE: This renders the gui immediately instead of waiting for Show() to be called, useful for debugging added controls incrementaly (as they are added)
    _guiDebugMode = false;

    static GenerateId(prefix = "gui_") {
        if (typeof prefix !== 'string' || prefix.length === 0) {
            prefix = "gui_";
        }
        const timestamp = Date.now().toString(36);
        const randomPart = Math.random().toString(36).substring(2, 15);
        const generatedId = prefix + timestamp + randomPart;
        const exists = ImmediateGUI.OccupiedElementIds.includes(generatedId);
        if (exists) return ImmediateGUI.GenerateId(prefix);
        ImmediateGUI.OccupiedElementIds.push(generatedId);
        return generatedId;
    }

    constructor(options = {}) {
        this.options = {
            theme: 'dark',
            position: 'right',
            width: 300,
            draggable: true,
            title: 'Immediate GUI',
            titleLeftAligned: true,
            ...options
        };

        // NOTE: Used for querying controls by their assigned IDs and getting their values
        this.controlRegistry = new Map();

        this.themes = {
            light: {
                background: '#ffffff',
                text: '#333333',
                border: '#cccccc',
                accent: '#4285f4',
                buttonBg: '#f5f5f5',
                buttonHover: '#e0e0e0',
                inputBg: '#ffffff',
                sectionBg: '#f9f9f9'
            },
            dark: {
                background: '#151617',
                text: '#eef0f2',
                border: '#425069',
                accent: '#294a7a',
                buttonBg: '#274972',
                buttonHover: '#336caf',
                inputBg: '#20324d',
                sectionBg: '#232426',
            }
        };

        this.maxHeight = '85vh';
        //this.maxHeight = 'auto;';

        this.theme = this.themes[this.options.theme] || this.themes.light;

        // Create main container
        this.container = document.createElement('div');
        this.container.id = ImmediateGUI.GenerateId();

        this._applyGlobalStyles();
        this._updateCSSVariables();

        this.container.style.cssText = `
            position: fixed;
            ${this.options.position === 'right' ? 'right' : 'left'}: 10px;
            top: 10px;
            min-width: ${(typeof this.options.width === 'string' ? this.options.width : this.options.width) + 'px'};
            background: var(--imgui-bg);
            color: var(--imgui-text);
            border: 1px solid var(--imgui-border);
            border-radius: 4px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            font-size: 14px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 0; /* Remove all padding */
            max-height: ${this.maxHeight};
            overflow-y: auto;
            overflow-x: hidden;
            transition: all 0.3s ease;
        `;

        this._createTitleBar(this.options.titleLeftAligned);
        
        this.contentContainer = document.createElement('div');
        this.contentContainer.id = ImmediateGUI.GenerateId('content_');

        this.contentContainer.style.cssText = `
            width: 100%;
            box-sizing: border-box;
            padding: 0 12px 12px 12px; /* Add padding to content area only */
        `;
        this.container.appendChild(this.contentContainer);

        this.currentSection = null;

        this.indentationLevel = 0;
        this.indentationSize = 10; // pixels per level
        this.isCustomIndentationLevel = false;

        if (this.options.draggable) {
            this._setupDragging();
        }

        if (this._guiDebugMode) {
            this.Show();
        }
    }

    _registerControl(control, customId = null) {
        if (customId) {
            if (this.controlRegistry.has(customId)) {
                const existingControl = this.controlRegistry.get(customId);
                debugger;
                throw new Error('Tried to assign id "' + customId + '" to a control, but that ID is already in use by another control:', existingControl);
            }

            this.controlRegistry.set(customId, control);
            control.dataset.customId = customId;

            control.remove = () => {
                if (this.controlRegistry.has(customId)) {
                    this.controlRegistry.delete(customId);
                }
                if (control.id) {
                    ImmediateGUI.OccupiedElementIds = ImmediateGUI.OccupiedElementIds.filter(id => id !== control.id);
                }

                // Remove the control from our GUI
                if (control.parentElement && control.parentElement.classList.contains('imgui-wrapper')) {
                    HTMLElement.prototype.remove.call(control.parentElement);
                }
                else {
                    HTMLElement.prototype.remove.call(control);
                }
            };
        }
        return control;
    }

    GetControlById(id) {
        return this.controlRegistry.get(id) || null;
    }

    GetControlValueById(id) {
        const control = this.GetControlById(id);
        if (!control) return null;
        
        // Handle different control types
        if (control.type === 'checkbox' || control.type === 'radio') {
            return control.checked;
        } else if (control.classList?.contains('imgui-progressbar')) {
            return control.getValue ? control.getValue() : control.value;
        } else if (control.getChecked) {
            // Radio buttons group
            return control.getChecked();
        } else if (control.getSelected) {
            // ListBox
            return control.getSelected();
        } 
        else if (control.type === 'number') {
            return parseFloat(control.value);
        }
        else {
            return control.value;
        }
    }

    _createTitleBar(leftAlign = true) {
        this.titleBar = document.createElement('div');
        this.titleBar.className = 'imgui-titlebar';
        this.titleBar.style.cssText = `
            width: 100% !important;
            padding-top: var(--imgui-bottom-padding);
            background: var(--imgui-section-bg);
            color: var(--imgui-text);
            font-weight: bold;
            cursor: ${this.options.draggable ? 'pointer' : 'default'};
            user-select: none;
            box-sizing: border-box;
            position: sticky;
            top: 0;
            z-index: 999999999;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--imgui-border);
            height: var(--imgui-title-height);
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: ${leftAlign ? '12px' : '0'};
            padding-right: 8px;
        `;

        // Create a wrapper for the title
        const titleWrapper = document.createElement('div');
        titleWrapper.style.cssText = `
            ${!leftAlign ? 'flex: 1; text-align: center;' : ''}
            margin-bottom: 5px;
        `;
        titleWrapper.textContent = this.options.title || 'ImmediateGUI';
        
        // Create minimize button
        const minimizeBtn = document.createElement('button');
        minimizeBtn.className = 'imgui-minimize-btn';
        minimizeBtn.innerHTML = this._escapeHTMLPolicy.createHTML('&#9660;');
        minimizeBtn.title = "Minimize";
        minimizeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--imgui-text);
            font-size: 12px;
            cursor: pointer;
            padding: 4px 8px;
            margin-left: 10px;
            font-family: monospace;
        `;
        
        minimizeBtn.addEventListener('mouseenter', () => {
            // minimizeBtn.style.opacity = '1';
        });
        
        minimizeBtn.addEventListener('mouseleave', () => {
            // minimizeBtn.style.opacity = '0.7';
        });
        
        // Add click handler for minimizing
        this.isMinimized = false;
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering dragging
            this._toggleMinimize();
        });
       
        this.minimizeBtn = minimizeBtn;
        
        // Add elements to titlebar
        this.titleBar.appendChild(titleWrapper);
        this.titleBar.appendChild(minimizeBtn);
   
        this.container.appendChild(this.titleBar);
    }

    _flashTitleBar(duration = 2000, flashCount = 6) {
        if (!this.titleBar) return this;
        
        const originalBackground = this.titleBar.style.background;
        const flashBackground = `#eb6b09`;
        const flashInterval = duration / (flashCount * 2); // *2 because each flash has on/off states
        
        let currentFlash = 0;
        
        const flash = () => {
            if (currentFlash >= flashCount * 2) {
                // Restore original background
                this.titleBar.style.background = originalBackground;
                this.titleBar.style.transition = '';
                return;
            }
            
            // Toggle between flash color and original color
            if (currentFlash % 2 === 0) {
                this.titleBar.style.background = flashBackground;
            } else {
                this.titleBar.style.background = originalBackground;
            }
            
            currentFlash++;
            setTimeout(flash, flashInterval);
        };
        
        // Add smooth transition for the flash effect
        this.titleBar.style.transition = 'background-color 0.1s ease';
        
        // Start flashing
        flash();
        
        return this;
    }

    _toggleMinimize(forceState = null) {
        this.isMinimized = !forceState ? !this.isMinimized : (typeof forceState === 'boolean' ? forceState : !this.isMinimized);
        
        if (this.isMinimized) {
            // Minimize the GUI
            this.contentContainer.style.display = 'none';
            this.container.style.maxHeight = 'var(--imgui-title-height)';
            this.container.style.top = 'auto';
            this.container.style.bottom = '10px';
            this.minimizeBtn.innerHTML = this._escapeHTMLPolicy.createHTML('&#9650;');
            this.minimizeBtn.title = "Restore";
            this.titleBar.style.marginBottom = '0';
            this.titleBar.style.borderBottom = 'none';
            this.container.style.overflowY = 'hidden';
            
            this._flashTitleBar(1000, 3);
        } else {
            // Restore the GUI
            this.contentContainer.style.display = 'block';
            this.container.style.maxHeight = this.maxHeight;
            this.container.style.bottom = 'auto';
            this.container.style.top = '10px';
            this.minimizeBtn.innerHTML = this._escapeHTMLPolicy.createHTML('&#9660;')
            this.minimizeBtn.title = "Minimize";
            this.titleBar.style.marginBottom = '12px';
            this.titleBar.style.borderBottom = '1px solid var(--imgui-border)';
            this.container.style.overflowY = 'auto';
        }
        
        // Make sure the GUI stays in view
        this._keepInView();
    }

    _updateCSSVariables() {
        document.documentElement.style.setProperty('--imgui-bg', this.theme.background);
        document.documentElement.style.setProperty('--imgui-text', this.theme.text);
        document.documentElement.style.setProperty('--imgui-border', this.theme.border);
        document.documentElement.style.setProperty('--imgui-accent', this.theme.accent);
        document.documentElement.style.setProperty('--imgui-button-bg', this.theme.buttonBg);
        document.documentElement.style.setProperty('--imgui-button-hover', this.theme.buttonHover);
        document.documentElement.style.setProperty('--imgui-input-bg', this.theme.inputBg);
        document.documentElement.style.setProperty('--imgui-section-bg', this.theme.sectionBg);
    }

    _applyGlobalStyles() {
        const styleSheetId = `imgui-global-styles_${this.container.id}`;

        if (!document.getElementById(styleSheetId)) {
            const styleEl = document.createElement('style');

            styleEl.id = styleSheetId;
            styleEl.textContent = `
                :root {
                    --imgui-bg: ${this.theme.background};
                    --imgui-text: ${this.theme.text};
                    --imgui-border: ${this.theme.border};
                    --imgui-accent: ${this.theme.accent};
                    --imgui-button-bg: ${this.theme.buttonBg};
                    --imgui-button-hover: ${this.theme.buttonHover};
                    --imgui-input-bg: ${this.theme.inputBg};
                    --imgui-section-bg: ${this.theme.sectionBg};

                    --imgui-toolbar-height: 40px;
                    --imgui-bottom-padding: 3px;
                    --imgui-title-height: 30px;
                    --imgui-scrollbar-width: 0.5em;
                }

                #${this.container.id} {
                    /* CSS Reset for all controls inside our GUI */
                    &::*, & *::before, & *::after {
                        box-sizing: border-box;
                        margin: 0;
                    }

                    &::* {
                        margin: 0;
                        padding: 0px;
                        outline: none;
                        -webkit-font-smoothing: antialiased;
                    }

                    &::input, &::button, &::textarea, &::select {
                        font: inherit;
                    }

                    &::p, &::h1, &::h2, &::h3, &::h4, &::h5, &::h6 {
                        overflow-wrap: break-word;
                    }

                    &::p {
                        text-wrap: pretty;
                    }
                    &::h1, &::h2, &::h3, &::h4, &::h5, &::h6 {
                        text-wrap: balance;
                    }

                    &::#root, &::#__next {
                        isolation: isolate;
                    }
                    /* End of CSS Reset */

                    scrollbar-gutter: auto;
                    /* scrollbar-color: var(--imgui-accent); */
                    /* scrollbar-width: thin; */

                    &::-webkit-scrollbar {
                        width: var(--imgui-scrollbar-width);
                        background-color: var(--imgui-section-bg);
                    }

                    &::-webkit-scrollbar-thumb {
                        background-color: var(--imgui-accent);
                        /* border-radius: 3px; */
                    }

                    &::-webkit-scrollbar-thumb:hover {
                        /* background-color: var(--imgui-button-hover); */
                    }

                    &::-webkit-scrollbar-button:start:decrement {
                        height: calc(var(--imgui-title-height) + ${this.toolbar ? 'var(--imgui-toolbar-height)' : '0px'} - 1px);
                        display: block;
                        background-color: transparent;
                    }
                }

                .imgui-titlebar {
                    width: 100% !important;
                    box-sizing: border-box;
                    right: 0;
                    left: 0;
                }

                .imgui-progressbar {

                }

                .imgui-image {
                
                }

                .imgui-slider {
                    accent-color: var(--imgui-accent);
                }

                .imgui-slider:hover {
                    accent-color: var(--imgui-button-hover);
                }

                .imgui-checkbox {
                    
                }

                .imgui-radiobutton {
                
                }

                .imgui-control {
                    /* margin-bottom: 2px; */
                    width: 100%;
                }

                .imgui-control[disabled] {
                    cursor: not-allowed;
                    /* FIXME: we need to disable background color change events */
                }

                .imgui-wrapper {
                    box-sizing: border-box;
                }
                
                .imgui-button {
                    background: var(--imgui-button-bg);
                    color: var(--imgui-text);
                    border: 1px solid var(--imgui-border);
                    border-radius: 4px;
                    padding: 8px 12px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    outline: none;
                    width: auto;
                    font-family: inherit;
                    /* margin-right: 5px; */
                }

                .imgui-button:hover {
                    background: var(--imgui-button-hover);
                }
                
                .imgui-button:active {
                    transform: translateY(1px);
                }
                
                .imgui-input {
                    background: var(--imgui-input-bg);
                    color: var(--imgui-text);
                    border: 1px solid var(--imgui-border);
                    border-radius: 4px;
                    padding: 8px 10px;
                    font-size: 14px;
                    width: 100%;
                    box-sizing: border-box;
                    outline: none;
                    transition: border-color 0.2s ease;
                    font-family: inherit;
                }

                .imgui-input::placeholder {
                    color: var(--imgui-text);
                    opacity: 0.5;
                }

                /* Chrome/Safari styling
                // TODO: Add firefox styling also */
                .imgui-input[type="number"]::-webkit-inner-spin-button,
                .imgui-input[type="number"]::-webkit-outer-spin-button {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    margin: 0;
                }

                /* Chrome/Safari styling 
                // TODO: Add firefox styling also */
                .imgui-input[type="number"]::-webkit-textfield-decoration-container {
                    /* border: 1px var(--imgui-border) solid; */
                    background: var(--imgui-input-bg);
                }
                
                .imgui-input:focus {
                    border-color: var(--imgui-accent);
                }
                
                .imgui-section {
                    border: 1px solid var(--imgui-border);
                    border-radius: 4px;
                    padding: 10px 10px 0px;
                    margin-bottom: calc(var(--imgui-bottom-padding) * 2);
                    background: var(--imgui-section-bg);
                }
                
                .imgui-section-header {
                    font-weight: 600;
                    margin-bottom: 8px;
                    padding-bottom: 6px;
                    border-bottom: 1px solid var(--imgui-border);
                    color: var(--imgui-text);
                }
                
                .imgui-label {
                    display: block;
                    /* margin-bottom: 4px; */
                    color: var(--imgui-text);
                    font-weight: 500;

                    /* 
                    pointer-events: none !important;
                    -webkit-touch-callout:none !important;
                    -webkit-user-select:none !important
                    -khtml-user-select:none !important;
                    -moz-user-select:none !important;
                    -ms-user-select:none !important;
                    user-select:none !important;
                    */
                }
            `;
            document.head.appendChild(styleEl);
            this.container.classList.add('imgui-container');
        }
    }

    _setupDragging() {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        const isClickOnControl = (element) => {
            if (!element) return false;
            
            return !element.classList.contains('imgui-titlebar');

            let current = element;
            while (current && current !== this.container) {
                if (
                    /* current.classList.contains('imgui-control') || */
                    current.tagName === 'INPUT' ||
                    current.tagName === 'BUTTON' ||
                    current.tagName === 'SELECT' ||
                    current.tagName === 'TEXTAREA'
                ) {
                    return true;
                }
                current = current.parentElement;
            }
            return false;
        };

        this.container.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; 
            if (isClickOnControl(e.target)) {
                return;
            }
            
            isDragging = true;
            
            startX = e.clientX;
            startY = e.clientY;
            
            const rect = this.container.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            document.body.style.cursor = 'move';
            
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            const newLeft = startLeft + dx;
            const newTop = startTop + dy;
            
            this.container.style.left = `${newLeft}px`;
            this.container.style.top = `${newTop}px`;
            this.container.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = '';
                
                this._keepInView();
            }
        });
        
        document.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = '';
            }
        });
    }
    
    _keepInView() {
        const rect = this.container.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        const minVisiblePx = 50;
        
        let newLeft = rect.left;
        let newTop = rect.top;
        
        if (rect.right < minVisiblePx) {
            newLeft = minVisiblePx - rect.width;
        } else if (rect.left > windowWidth - minVisiblePx) {
            newLeft = windowWidth - minVisiblePx;
        }
        
        if (rect.bottom < minVisiblePx) {
            newTop = minVisiblePx - rect.height;
        } else if (rect.top > windowHeight - minVisiblePx) {
            newTop = windowHeight - minVisiblePx;
        }
        
        if (newLeft !== rect.left || newTop !== rect.top) {
            this.container.style.left = `${newLeft}px`;
            this.container.style.top = `${newTop}px`;
        }
    }

    _escapeHTMLPolicy = 'trustedTypes' in window ? trustedTypes.createPolicy('forceInner', { createHTML: html=>html }) : { createHTML: html=>html };

    // Section management
    BeginSection(title, collapsible = false, collapsedByDefault = false, tooltip = '') {
        const section = document.createElement('div');
        section.className = 'imgui-section';
        section.id = ImmediateGUI.GenerateId('section_');
        section.style.paddingBottom = 'var(--imgui-bottom-padding)';
        if (typeof tooltip === 'string' && tooltip.length > 0) section.title = tooltip;

        if (title) {
            const header = document.createElement('div');
            header.className = 'imgui-section-header';
            header.style.color = `var(--imgui-text)`;
            header.style.borderBottom = `1px solid var(--imgui-border)`;

            if (collapsible) {
                header.style.cssText = `
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    user-select: none;
                    margin-bottom: 8px;
                    padding-bottom: 6px;
                `;
                
                const collapseCharacter = '▼';
                const uncollapseCharacter = '►';

                const indicator = document.createElement('span');
                indicator.className = 'imgui-section-indicator';
                indicator.textContent = collapseCharacter;
                indicator.style.cssText = `
                    margin-right: 8px;
                    font-size: 10px;
                    font-family: monospace;
                    transition: transform 0.2s ease;
                `;
                
                const titleSpan = document.createElement('span');
                titleSpan.textContent = title;
                titleSpan.style.flex = '1';
                
                const content = document.createElement('div');
                content.className = 'imgui-section-content';
                content.style.cssText = `
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                `;
                
                section.isCollapsed = false;
                
                const toggleCollapse = () => {
                    section.isCollapsed = !section.isCollapsed;
                    
                    if (section.isCollapsed) {
                        content.style.maxHeight = '0px';
                        indicator.textContent = uncollapseCharacter;
                        indicator.style.transform = 'rotate(0deg)';
                        header.style.borderBottom  = 'none';
                        header.style.paddingBottom = '0px';

                    } else {
                        content.style.maxHeight = '2000px';
                        indicator.textContent = collapseCharacter; 
                        indicator.style.transform = 'rotate(0deg)';
                        header.style.borderBottom  = '1px solid var(--imgui-border)';
                        header.style.paddingBottom = '6px';
                    }
                };

                if (collapsedByDefault) toggleCollapse();
                
                header.addEventListener('click', toggleCollapse);
                
                header.appendChild(indicator);
                header.appendChild(titleSpan);
                section.appendChild(header);
                section.appendChild(content);
                
                section.contentContainer = content;
            } 
            else {
                header.textContent = title;
                section.appendChild(header);
            }
        }
        
        this._getTargetContainer().appendChild(section);
        this.currentSection = section;
        return this;
    }

    EndSection() {
        const parentSectionOrNull = this.currentSection ? this.currentSection.parentElement.closest('.imgui-section') : null;
        // NOTE: We set currentSection to parent section to allow nested sections
        this.currentSection = parentSectionOrNull;
        return this;
    }

    // Row management
    BeginRow(gap = 2) {
        const row = document.createElement('div');
        row.className = 'imgui-row';
        row.id = ImmediateGUI.GenerateId('row_');
        row.style.cssText = `
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            justify-content: center;
            ${gap > 0 ? `gap: ${gap}px;` : 'gap: var(--imgui-bottom-padding);'}
            width: 100%;
        `;
        
        this._getTargetContainer().appendChild(row);
        this.currentRow = row;
        return this;
    }

    EndRow() {
        // Post processing for items in the row
        if (this.currentRow) {
            // TODO: set all children of the row to have the same height as the biggest child inside the row

            this.currentRow.querySelectorAll('.imgui-wrapper').forEach((wrapper) => {
                wrapper.style.flex = '1';
                wrapper.style.marginRight = '0px !important';
                wrapper.querySelectorAll('.imgui-control').forEach((control) => {
                    control.style.width = '100%';
                });
            });
        }

        this.currentRow = null;
        return this;
    }

    // Indentation management
    BeginIndentation(level = -1) {
        if (level === -1) this.indentationLevel++;
        else {
            this.isCustomIndentationLevel = true;
            this.indentationLevel = level;
        }
        return this;
    }

    EndIndentation() {
        if (this.indentationLevel > 0) {
            if (this.isCustomIndentationLevel) {
                this.indentationLevel = 0;
                this.isCustomIndentationLevel = false;
            }
            else this.indentationLevel--;
        }
        return this;
    }

    _applyIndentation(element) {
        if (this.indentationLevel > 0) {
            const currentIndent = this.indentationLevel * this.indentationSize;
            // TODO: make sure element with its new margin left wont exceed past the bounds of the container
            
            element.style.marginLeft = `${currentIndent}px`;
        }
        return element;
    }

    // Tabs management
    BeginTabs(tabs = [], defaultTab = 0) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper imgui-tabs";
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            margin-bottom: var(--imgui-bottom-padding);
            border: 1px solid var(--imgui-border);
            border-radius: 4px;
            background: var(--imgui-section-bg);
        `;
        
        // Create tab headers
        const tabHeaders = document.createElement('div');
        tabHeaders.className = "imgui-tab-headers";
        tabHeaders.style.cssText = `
            display: flex;
            border-bottom: 1px solid var(--imgui-border);
            background: var(--imgui-input-bg);
        `;
        
        // Create tab contents
        const tabContents = document.createElement('div');
        tabContents.className = "imgui-tab-contents";
        tabContents.style.cssText = `
            padding: 10px;
            padding-bottom: calc(10px - var(--imgui-bottom-padding));
        `;
        
        this.tabPanes = [];
        let activeTab = defaultTab;
        
        tabs.forEach((tab, index) => {
            // Create tab header
            const tabHeader = document.createElement('div');
            tabHeader.textContent = tab;
            tabHeader.style.cssText = `
                padding: 10px 16px;
                cursor: pointer;
                border-right: 1px solid var(--imgui-border);
                /*
                border-radius: 5px 5px 0px 0px;
                -webkit-border-radius: 5px 5px 0px 0px;
                -moz-border-radius: 5px 5px 0px 0px;
                */
                background: ${index === activeTab ? 'var(--imgui-accent)' : 'transparent'};
                color: var(--imgui-text);
                transition: background 0.2s ease;
            `;

            
            // Create tab content pane
            const tabPane = document.createElement('div');
            tabPane.className = "imgui-tab-pane";
            tabPane.style.display = index === activeTab ? 'block' : 'none';
            tabPane.tabName = tabHeader.textContent;

            tabHeader.addEventListener('click', () => {
                // Hide all panes
                this.tabPanes.forEach(pane => pane.style.display = 'none');
                // Show selected pane
                tabPane.style.display = 'block';
                // Update header styles
                tabHeaders.querySelectorAll('div').forEach(header => {
                    header.style.background = 'transparent';
                });
                tabHeader.style.background = 'var(--imgui-accent)';
                activeTab = index;
            });
            
            tabHeaders.appendChild(tabHeader);
            tabContents.appendChild(tabPane);
            this.tabPanes.push(tabPane);
        });
        
        wrapper.appendChild(tabHeaders);
        wrapper.appendChild(tabContents);
        
        this._getTargetContainer().appendChild(wrapper);
        this.currentTab = { 
            wrapper, 
            panes: this.tabPanes, 
            activeTab,
            currentTabIndex: 0 // Track which tab we're currently adding content to
        };
        // TODO: set this.currentSection to tab with the index in the 
        // 'defaultTab' function parameter, this means validating the value of
        // 'defaultTab' also

        this.currentSection = this.tabPanes[0]; // Start with first tab
        return this;
    }

    SetActiveTab(tabIndexOrTabName) {
        const tabIndexIsNumber = typeof tabIndexOrTabName === 'number';

        if (!tabIndexIsNumber) { 
            const tabs = this.tabPanes;
            tabIndexOrTabName = tabs.findIndex(tab => tab.tabName === tabIndexOrTabName);
            if (tabIndexOrTabName === -1) {
                console.error(`ImmedaiteGUI: Invalid tab name specified: ${tabIndexOrTabName}`);
                return this;
            }
        }
        
        if (this.currentTab && tabIndexOrTabName >= 0 && tabIndexOrTabName < this.currentTab.panes.length) {
                this.currentTab.currentTabIndex = tabIndexOrTabName;
                this.currentSection = this.currentTab.panes[tabIndexOrTabName];
            }
            else {
                debugger;
                console.error(`ImmedaiteGUI: Invalid tab index specified: ${tabIndexOrTabName}`);
            }
        
        return this;
    }

    EndTabs() {
        this.currentTab = null;
        this.currentSection = null;
        return this;
    }

    // Utility to get current target container
    _getTargetContainer() {
        if (this.currentRow) {
            return this.currentRow;
        }

        if (this.currentTab) {
            // Use the tab we're currently building, not the active displayed tab
            return this.currentTab.panes[this.currentTab.currentTabIndex];
        }
        
        if (this.currentSection) {
            // If current section is collapsible, use its content container
            if (this.currentSection.contentContainer) {
                return this.currentSection.contentContainer;
            }
            return this.currentSection;
        }
        return this.contentContainer;
    }

    // Original API methods with improved implementation
    _getControlContainer() {
        return this.container;
    }

    // FIXME: Figure out how to implement this
    // OfType expects a case sensitive string representing the type of control, matching the function name used to create that control
    _getControls(OfType = null) {
        const controlWrappers = this._getControlContainer().querySelectorAll('.imgui-wrapper');

        // if (OfType) {
        //     const lookupTable = {
        //         'Button': 'button',
        //         'Textbox': 'input[type="text"]',
        //         'TextArea': 'textarea',
        //         'Label': 'label',
        //         'ProgressBar': '.imgui-progressbar',
        //         'Checkbox': '.imgui-checkbox',
        //         'Radiobutton': '.imgui-radiobutton',
        //         'Slider': '.imgui-slider',
        //         'Image': '.imgui-image',
        //         'Separator': 'hr',
        //     };
        //     const selector = lookupTable[OfType];
        //     const matchedControls = Array.from(controlWrappers).map(wrapper => wrapper.querySelector(selector)).filter(control => control !== null);
        //     debugger;
        // }
        return controlWrappers;
    }

    Separator(plain = false, id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            width: 100%;
            margin-bottom: var(--imgui-bottom-padding);

            /* TODO: the height should be dynamically calculated instead of hardcoded like this for 'plain' separators */
            ${plain ? 'height: 11px !important;' : ''}
        `;
        
        const separator = document.createElement('hr');
        separator.id = ImmediateGUI.GenerateId("ctrl_");
        separator.style.cssText = `
            border: none;
            ${plain ? '' : 'border-top: 1px solid var(--imgui-border);'}
            /* margin: 10px 0; */
            width: 100%;
        `;
        
        wrapper.appendChild(separator);
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(separator, id);
    }

    Header(text, level = 1, id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            width: 100%;
            margin-bottom: var(--imgui-bottom-padding);
        `;
        
        const validLevel = Math.min(Math.max(level, 1), 6);
        const header = document.createElement(`h${validLevel}`);
        header.id = ImmediateGUI.GenerateId("ctrl_");
        header.textContent = text;
        header.style.cssText = `
            /* margin: 0 0 10px 0; */
            padding: 0;
            font-weight: ${validLevel <= 2 ? 'bold' : '600'};
            color: var(--imgui-text);
            font-size: ${24 - (validLevel * 2)}px;
            font-size: 
            font-family: inherit;
            width: 100%;
        `;

        wrapper.appendChild(header);
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(header, id);
    }

    Button(text, callback, tooltip = '', id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            margin-bottom: var(--imgui-bottom-padding);
        `;
        
        const btn = document.createElement('button');
        btn.id = ImmediateGUI.GenerateId("ctrl_");
        btn.textContent = text;
        btn.className = "imgui-button imgui-control";
        if (typeof tooltip === 'string' && tooltip.length > 0) btn.title = tooltip;
        
        btn.addEventListener('mouseenter', () => {
            //btn.style.background = this.theme.buttonHover;
            btn.style.background = 'var(--imgui-button-hover)';
        })
        btn.addEventListener('mouseout', () => {
            //btn.style.background = this.theme.buttonBg;
            btn.style.background = 'var(--imgui-button-bg)';
        })

        if (callback && typeof callback === 'function') {
            btn.addEventListener('click', callback);
        }
        
        wrapper.appendChild(btn);
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(btn, id);
    }

    Textbox(placeholder, defaultValue = "", tooltip = '', id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            margin-bottom: var(--imgui-bottom-padding);
        `;
        
        const input = document.createElement('input');
        input.id = ImmediateGUI.GenerateId("ctrl_");
        input.type = 'text';
        input.placeholder = placeholder;
        input.value = defaultValue;
        input.style.background = 'var(--imgui-input-bg)';
        input.style.border = '1px solid var(--imgui-border)';
        input.className = "imgui-input imgui-control";
        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) input.title = tooltip;
        
        wrapper.appendChild(input);
        this._applyIndentation(wrapper);

        this._getTargetContainer().appendChild(wrapper);
        return this._registerControl(input, id);
    }

    TextArea(placeholder = "", defaultValue = "", rows = 4, tooltip = '', id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            margin-bottom: var(--imgui-bottom-padding);
        `;
        
        const textarea = document.createElement('textarea');
        textarea.id = ImmediateGUI.GenerateId("ctrl_");
        textarea.placeholder = placeholder;
        textarea.value = defaultValue;
        textarea.rows = rows;
        textarea.className = "imgui-input imgui-control";
        textarea.style.cssText = `
            background: var(--imgui-input-bg);
            resize: vertical;
            min-height: ${rows * 20}px;
            font-family: inherit;
            margin-bottom: 0;
            max-height: calc(${this.maxHeight} - 50px); /* Limit max height to prevent overflowing */
            
        `;
        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) textarea.title = tooltip;
        
        textarea.addEventListener('mouseup', () => {
            const container = this.container;
            const containerMaxHeight = parseInt(getComputedStyle(container).maxHeight);
            const containerRect = container.getBoundingClientRect();
            const textareaRect = textarea.getBoundingClientRect();
            
            // Calculate how much space is available in the container
            const availableSpace = containerMaxHeight - (textareaRect.top - containerRect.top) - 20; // 20px buffer
            
            // If textarea is too tall, limit its height
            if (textarea.offsetHeight > availableSpace) {
                textarea.style.height = `${availableSpace}px`;
            }
        });

        textarea.addEventListener('mouseenter', () => {
            textarea.style.borderColor = 'var(--imgui-border)';
        });

        wrapper.appendChild(textarea);
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(textarea, id);
    }

    Label(text, id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            margin-bottom: var(--imgui-bottom-padding);
        `;
        
        const label = document.createElement('label');
        label.id = ImmediateGUI.GenerateId("ctrl_");
        label.textContent = text;
        label.className = "imgui-label imgui-control";
        
        wrapper.appendChild(label);
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(label, id);
    }

    ProgressBar(value = 0, min = 0, max = 100, showText = true, tooltip = '', id = null) {
        // Create wrapper element
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            width: 100%;
            margin-bottom: var(--imgui-bottom-padding);
        `;
        
        // Create progress container
        const progressContainer = document.createElement('div');
        progressContainer.style.cssText = `
            width: 100%;
            height: 20px;
            background: var(--imgui-input-bg);
            border: 1px solid var(--imgui-border);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
        `;
        
        // Create progress bar element
        let progressBar = document.createElement('div');
        progressBar.id = ImmediateGUI.GenerateId("ctrl_");
        progressBar.className = "imgui-progressbar imgui-control";
        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) progressBar.title = tooltip;
        
        // Calculate the percentage
        const normalizedValue = Math.min(Math.max(value, min), max);
        const percentage = ((normalizedValue - min) / (max - min)) * 100;

        progressBar.value = normalizedValue;
        progressBar.max = max;
        progressBar.min = min;
        // Note: calling increment/decremenet will change the value by 1 unit, should be customizable
        progressBar.step = 1;

        progressBar.style.cssText = `
            width: ${percentage}%;
            height: 100%;
            background: var(--imgui-accent);
            transition: width 0.3s ease;
        `;
        
        // Optional text display
        let textElement = null;
        if (showText) {
            textElement = document.createElement('div');
            textElement.textContent = `${Math.round(percentage)}%`;
            textElement.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--imgui-text);
                font-size: 12px;
                font-weight: 500;
                text-shadow: 0 0 2px var(--imgui-text);
                pointer-events: none;
            `;
            progressContainer.appendChild(textElement);
        }
        
        // Add elements to the DOM
        progressContainer.appendChild(progressBar);
        wrapper.appendChild(progressContainer);
        
        // Add methods to update the progress bar
        progressBar.setValue = (newValue) => {
            const normalizedNewValue = Math.min(Math.max(newValue, min), max);
            const newPercentage = ((normalizedNewValue - min) / (max - min)) * 100;
            progressBar.style.width = `${newPercentage}%`;
            progressBar.value = normalizedNewValue;
            if (textElement) {
                textElement.textContent = `${Math.round(newPercentage)}%`;
            }
        };

        progressBar.getValue = () => progressBar.value;

        progressBar.increment = () => {
            const newValue = Math.min(progressBar.value + progressBar.step, max);
            progressBar.setValue(newValue);
        }

        progressBar.decrement = () => {
            const newValue = Math.max(progressBar.value - progressBar.step, min);
            progressBar.setValue(newValue);
        }
        
        // Store references
        progressBar.textElement = textElement;
        progressBar.min = min;
        progressBar.max = max;
        
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(progressBar, id);
    }

    ColorPicker(defaultValue = '#000000', tooltip = '', id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `display: flex; align-items: center; padding-bottom: var(--imgui-bottom-padding);`;
        
        const colorPicker = document.createElement('input');
        colorPicker.id = ImmediateGUI.GenerateId("ctrl_");
        colorPicker.type = 'color';
        colorPicker.value = defaultValue;
        colorPicker.className = "imgui-input";
        colorPicker.style.cssText = `
            margin-right: 8px;
            width: 80px;
            height: 40px;
            border: 1px solid var(--imgui-border);
            border-radius: 4px;
            background: none;
            background-color: var(--imgui-input-bg);
            cursor: pointer;
        `;
        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) colorPicker.title = tooltip;
        
        const colorValue = document.createElement('span');
        colorValue.textContent = defaultValue;
        colorValue.style.cssText = `
            font-family: monospace;
            color: var(--imgui-text);
            cursor: pointer;
        `;

        // TODO: implement copying the color value to clipboard?

        colorPicker.addEventListener('input', () => {
            colorValue.textContent = colorPicker.value;
        });
        
        wrapper.appendChild(colorPicker);
        wrapper.appendChild(colorValue);
        
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(colorPicker, id);
    }

    DatePicker(defaultValue = new Date().toISOString().split('T')[0], tooltip = '', id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            margin-bottom: var(--imgui-bottom-padding);
        `;
        
        const datePicker = document.createElement('input');
        datePicker.id = ImmediateGUI.GenerateId("ctrl_");
        datePicker.type = 'date';
        datePicker.value = defaultValue;
        datePicker.className = "imgui-input imgui-control";
        datePicker.style.cursor = "pointer"; 
        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) datePicker.title = tooltip;

        wrapper.appendChild(datePicker);
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(datePicker, id);
    }

    Dropdown(options = [], defaultValue = null, tooltip = '', id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            margin-bottom: var(--imgui-bottom-padding);
        `;

        const select = document.createElement('select');
        select.id = ImmediateGUI.GenerateId("ctrl_");
        select.className = "imgui-input imgui-dropdown imgui-control";
        select.style.cssText = `
            padding: 6px 10px;
            border: 1px solid var(--imgui-border);
            border-radius: 4px;
            background: var(--imgui-input-bg);
            color: var(--imgui-text);
            font-family: inherit;
            cursor: pointer;
            appearance: auto;
        `;
        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) select.title = tooltip;
        
        // Add options to the select element
        options.forEach(option => {
            const optElement = document.createElement('option');
            optElement.style.backgroundColor = 'var(--imgui-input-bg)';
            optElement.style.color = 'var(--imgui-text)';
            
            // Handle both simple strings and {text, value} objects
            if (typeof option === 'object' && option !== null) {
                optElement.textContent = option.text || option.label || '';
                optElement.value = option.value !== undefined ? option.value : option.text || '';
            } else {
                optElement.textContent = option;
                optElement.value = option;
            }
            
            // Set as selected if it matches the default value
            if (defaultValue !== null && optElement.value === defaultValue) {
                optElement.selected = true;
            }
            
            select.appendChild(optElement);
        });
        
        wrapper.appendChild(select);
        
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(select, id);
    }

    NumberInput(label, defaultValue = 0, min = null, max = null, tooltip = '', id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `display: flex; align-items: center; margin-bottom: var(--imgui-bottom-padding);`;
        
        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        labelElem.style.cssText = `
            margin-right: 10px;
            margin-top:8px;
            flex: 1;
            color: var(--imgui-text);
        `;
        
        const input = document.createElement('input');
        input.label = labelElem;
        input.id = ImmediateGUI.GenerateId("ctrl_");
        input.type = 'number';
        input.value = defaultValue;
        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) input.title = tooltip;
        if (min !== null) input.min = min;
        if (max !== null) input.max = max;

        // TODO: hacky solution to make input elements respect .min and .max values when inputting values manually using the keyboard
        if (min !== null || max !== null) {
            input.addEventListener('keyup', () => {
                let currentValue = parseInt(input.value);
                if (isNaN(currentValue)) {
                    input.value = Math.floor(min);
                }
                else {
                    if (min !== null && currentValue < min) {
                        input.value = Math.floor(min);
                    } else if (max !== null && currentValue > max) {
                        input.value = Math.floor(max);
                    }
                }
            });
        }

        input.className = 'imgui-input'
        input.style.cssText = `
            width: 80px;
            padding: 6px;
            border: 1px solid var(--imgui-border);
            border-radius: 4px;
            background: var(--imgui-input-bg);
            color: var(--imgui-text);
            font-family: inherit;
        `;
        
        wrapper.appendChild(labelElem);
        wrapper.appendChild(input);
        
        this._applyIndentation(labelElem);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(input, id);
    }

    Slider(minValue = 0, maxValue = 100, defaultValue = 50, tooltip = '', id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `display: flex; flex-direction: column; margin-bottom: var(--imgui-bottom-padding);`;
        
        const sliderContainer = document.createElement('div');
        sliderContainer.style.cssText = `display: flex; align-items: center; width: 100%;`;
        
        const slider = document.createElement('input');
        slider.className = "imgui-slider";
        slider.id = ImmediateGUI.GenerateId("ctrl_");
        slider.type = 'range';
        slider.min = minValue;
        slider.max = maxValue;
        slider.value = defaultValue;
        slider.style.cssText = `
            flex: 1;
            margin-right: 8px;
            /* accent-color: var(--imgui-accent); */
        `;

        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) slider.title = tooltip;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = defaultValue;
        valueDisplay.style.cssText = `
            min-width: 40px;
            text-align: right;
            color: var(--imgui-text);
            font-family: inherit;
            font-weight: 500;
        `;
        
        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });
        
        slider.label = valueDisplay;

        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(valueDisplay);
        wrapper.appendChild(sliderContainer);
        
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(slider, id);
    }

    Checkbox(label, checked = false, tooltip = '', onChangeCallback = null, id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `display: flex; align-items: center; margin-bottom: var(--imgui-bottom-padding)`;
        
        const checkbox = document.createElement('input');
        checkbox.id = ImmediateGUI.GenerateId("ctrl_");
        checkbox.type = 'checkbox';
        checkbox.checked = checked;
        checkbox.className = "imgui-checkbox";
        checkbox.style.cssText = `
            margin-right: 8px;
            accent-color: var(--imgui-accent);
            clip-path: circle(46% at 50% 50%);
            width: 16px;
            height: 16px;
        `;

        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) wrapper.title = tooltip;
        
        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        labelElem.htmlFor = checkbox.id;
        labelElem.style.cssText = `
            cursor: pointer;
            color: var(--imgui-text);
            font-family: inherit;
            margin-top: 6px;
        `;

        checkbox.label = labelElem;

        if (typeof onChangeCallback === 'function') {
            checkbox.addEventListener('change', () => {
                onChangeCallback(checkbox.checked);
            });
        }
        
        wrapper.appendChild(checkbox);
        wrapper.appendChild(labelElem);
        
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(checkbox, id);
    }

    ToggleSwitch(label, checked = false, tooltip = '', onChangeCallback = null, id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            align-items: center;
            margin-bottom: var(--imgui-bottom-padding);
        `;
        
        // Hidden input for form compatibility
        const hiddenInput = document.createElement('input');
        hiddenInput.id = ImmediateGUI.GenerateId("ctrl_");
        hiddenInput.type = 'checkbox';
        hiddenInput.checked = checked;
        hiddenInput.style.display = 'none';
        hiddenInput.className = "imgui-toggle-input";
        
        // Create the visual toggle switch
        const toggleTrack = document.createElement('div');
        toggleTrack.className = "imgui-toggle-track";
        toggleTrack.style.cssText = `
            width: 48px;
            height: 24px;
            background: ${checked ? 'var(--imgui-accent)' : 'var(--imgui-border)'};
            border-radius: 12px;
            position: relative;
            cursor: pointer;
            transition: background-color 0.3s ease;
            margin-right: 12px;
            border: 1px solid var(--imgui-border);
            box-sizing: border-box;
        `;
        
        const toggleThumb = document.createElement('div');
        toggleThumb.className = "imgui-toggle-thumb";
        toggleThumb.style.cssText = `
            width: 20px;
            height: 20px;
            background: var(--imgui-text);
            border-radius: 50%;
            position: absolute;
            top: 1px;
            left: ${checked ? '25px' : '1px'};
            transition: left 0.3s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        `;
        
        // Label element
        const labelElem = document.createElement('label');
        labelElem.textContent = label;
        labelElem.htmlFor = hiddenInput.id;
        labelElem.style.cssText = `
            cursor: pointer;
            color: var(--imgui-text);
            font-family: inherit;
            user-select: none;
            flex: 1;

            /* //FIXME: shitty hack to vertically align label with its assosciated input element */
            padding-bottom: 2px;
            margin: auto;
        `;
        
        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) {
            wrapper.title = tooltip;
        }
        
        // Add CSS for hover effects if not already added
        if (!document.getElementById('imgui-toggle-styles')) {
            const toggleStyles = document.createElement('style');
            toggleStyles.id = 'imgui-toggle-styles';
            toggleStyles.textContent = `
                .imgui-toggle-track:hover {
                    box-shadow: 0 0 0 2px rgba(var(--imgui-accent-rgb, 41, 74, 122), 0.2);
                }
                
                .imgui-toggle-track:active .imgui-toggle-thumb {
                    transform: scale(0.95);
                }
            `;
            document.head.appendChild(toggleStyles);
        }
        
        // Toggle functionality
        const toggle = () => {
            const newChecked = !hiddenInput.checked;
            hiddenInput.checked = newChecked;
            
            // Update visual state
            if (newChecked) {
                toggleTrack.style.background = 'var(--imgui-accent)';
                toggleThumb.style.left = '25px';
            } else {
                toggleTrack.style.background = 'var(--imgui-border)';
                toggleThumb.style.left = '1px';
            }
            
            // Dispatch change event
            hiddenInput.dispatchEvent(new Event('change', { bubbles: true }));
        };
        
        // Event listeners
        toggleTrack.addEventListener('click', toggle);
        labelElem.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent double toggle
            toggle();
        });
        
        // Keyboard accessibility
        toggleTrack.setAttribute('tabindex', '0');
        toggleTrack.setAttribute('role', 'switch');
        toggleTrack.setAttribute('aria-checked', checked);
        toggleTrack.setAttribute('aria-labelledby', hiddenInput.id + '_label');
        labelElem.id = hiddenInput.id + '_label';
        
        toggleTrack.addEventListener('keydown', (e) => {
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                toggle();
            }
        });
        
        // Update aria-checked when state changes
        hiddenInput.addEventListener('change', () => {
            toggleTrack.setAttribute('aria-checked', hiddenInput.checked);
            if (onChangeCallback && typeof onChangeCallback === 'function') {
                onChangeCallback(hiddenInput.checked);
            }
        });
        
        // Add hover effects
        toggleTrack.addEventListener('mouseenter', () => {
            if (!hiddenInput.checked) {
                toggleTrack.style.background = 'var(--imgui-button-hover)';
            }
        });
        
        // toggleTrack.addEventListener('mouseleave', () => {
        //     if (!hiddenInput.checked) {
        //         toggleTrack.style.background = 'var(--imgui-border)';
        //     }
        // });

        toggleTrack.addEventListener('mouseout', () => {
            if (!hiddenInput.checked) {
                toggleTrack.style.background = 'var(--imgui-border)';
            }
        });
        
        // Focus styles
        toggleTrack.addEventListener('focus', () => {
            toggleTrack.style.outline = '2px solid var(--imgui-accent)';
            toggleTrack.style.outlineOffset = '2px';
        });
        
        toggleTrack.addEventListener('blur', () => {
            toggleTrack.style.outline = 'none';
        });
        
        // Build the component
        toggleTrack.appendChild(toggleThumb);
        wrapper.appendChild(hiddenInput);
        wrapper.appendChild(toggleTrack);
        wrapper.appendChild(labelElem);
        
        // Add helper methods to the hidden input for API consistency
        hiddenInput.toggle = toggle;
        hiddenInput.setChecked = (value) => {
            if (value !== hiddenInput.checked) {
                toggle();
            }
        };
        hiddenInput.label = labelElem;
        hiddenInput.track = toggleTrack;
        hiddenInput.thumb = toggleThumb;
        
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(hiddenInput, id);
    }


    RadioButtons(options = [], defaultValue = null, tooltip = '', id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            margin-bottom: var(--imgui-bottom-padding);
        `;
        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) wrapper.title = tooltip;

        // Generate a unique group name for this set of radio buttons
        const groupName = ImmediateGUI.GenerateId("radio_group_");
        
        // Create an object to store references to the radio buttons
        const radioButtons = {};
        
        // Add radio buttons to the wrapper
        options.forEach(option => {
            // Handle both simple strings and {text, value} objects
            let text, value;
            if (typeof option === 'object' && option !== null) {
                text = option.text || option.label || '';
                value = option.value !== undefined ? option.value : option.text || '';
            } else {
                text = option;
                value = option;
            }
            
            const radioContainer = document.createElement('div');
            radioContainer.style.cssText = `
                display: flex;
                align-items: center;
            `;
            
            const radio = document.createElement('input');
            radio.id = ImmediateGUI.GenerateId("ctrl_");
            radio.type = 'radio';
            radio.name = groupName;
            radio.className = "imgui-radiobutton";
            radio.value = value;
            radio.checked = value === defaultValue;
            radio.style.cssText = `
                margin-right: 8px;
                accent-color: var(--imgui-accent);
                width: 16px;
                height: 16px;
            `;
            
            const label = document.createElement('label');
            label.textContent = text;
            label.htmlFor = radio.id;
            label.style.cssText = `
                cursor: pointer;
                color: var(--imgui-text);
                font-family: inherit;
                margin-top: ${radioContainer.style.marginBottom || '6px'};
            `;
            
            radio.label = label;
            
            radioContainer.appendChild(radio);
            radioContainer.appendChild(label);
            wrapper.appendChild(radioContainer);
            
            // Store reference to the radio button
            radioButtons[value] = radio;
        });
        
        // Add helper methods to the radio group
        radioButtons.getChecked = () => {
            const selected = wrapper.querySelector(`input[name="${groupName}"]:checked`);
            return selected ? selected.value : null;
        };
        
        radioButtons.setChecked = (value, checked) => {
            const radio = wrapper.querySelector(`input[name="${groupName}"][value="${value}"]`);
            if (radio) {
                radio.checked = checked;
            }
        };
        
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(radioButtons, id);
    }

    Image(src, alt = '', width = 'auto', height = 'auto', tooltip = '', id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            justify-content: center;
            margin-bottom: var(--imgui-bottom-padding);
        `;
        
        const img = document.createElement('img');
        img.id = ImmediateGUI.GenerateId("ctrl_");
        img.className = 'imgui-image';
        img.src = src;
        img.alt = alt;
        img.className = "imgui-image imgui-control";
        if (tooltip) img.title = tooltip;
        
        img.style.cssText = `
            max-width: 100%;
            width: ${width};
            height: ${height};
            max-width: ${this.options.width}px;
            border-radius: 4px;
            border: 1px solid var(--imgui-border);
        `;
        
        wrapper.appendChild(img);
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        return this._registerControl(img, id);
    }

    ListBox(items = [], defaultSelected = null, tooltip = '', onChange = null, itemType = 'text', id = null) {
        const wrapper = document.createElement('div');
        wrapper.className = "imgui-control imgui-wrapper";
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            margin-bottom: var(--imgui-bottom-padding);
        `;

        const listBox = document.createElement('ul');
        listBox.id = ImmediateGUI.GenerateId("ctrl_");
        listBox.className = "imgui-listbox imgui-control";
        listBox.style.cssText = `
            list-style: none;
            padding: 0;
            margin: 0;
            max-height: 160px;
            overflow-y: auto;
            border: 1px solid var(--imgui-border);
            border-radius: 4px;
            background: var(--imgui-input-bg);
            color: var(--imgui-text);
            font-family: inherit;
        `;
        if (tooltip && typeof tooltip === 'string' && tooltip.length > 0) listBox.title = tooltip;

        let selectedIdx = -1;
        items.forEach((item, idx) => {
            const li = document.createElement('li');
            li.className = "imgui-listbox-item";
            li.style.cssText = `
                padding: 4px 12px;
                cursor: pointer;
                ${(itemType === 'text' ? 'transition: background 0.2s;' : '') }
                display: flex;
                align-items: center;
            `;

            let child;
            if (typeof itemType === 'function') {
                // Custom render function
                child = itemType(item, idx);
            } else if (itemType === 'checkbox') {
                child = this.Checkbox('', item.checked || false);
                child.parentElement.querySelector('label')?.remove(); // Remove the label added by the Checkbox method

                const label = document.createElement('span');
                label.textContent = item.label || item;
                li.appendChild(child);
                li.appendChild(label);
            } else {
                // Default: text
                child = document.createElement('span');
                child.textContent = item.label || item;
                li.appendChild(child);
            }

            // Highlight selected
            if (item === defaultSelected || idx === defaultSelected && itemType === 'text') {
                li.style.background = 'var(--imgui-accent)';
                li.style.color = '#fff';
                selectedIdx = idx;
            }

            // Only add click for non-checkbox items
            if (typeof itemType !== 'function') {
                if (itemType === 'text') {
                    li.addEventListener('click', () => {
                        Array.from(listBox.children).forEach(child => {
                            child.style.background = '';
                            child.style.color = 'var(--imgui-text)';
                        });
                        li.style.background = 'var(--imgui-accent)';
                        li.style.color = '#fff';
                        selectedIdx = idx;
                        if (typeof onChange === 'function') onChange(item, idx);
                    });
                }
                else {
                    if (typeof onChange === 'function') {
                        child.addEventListener('click', () => {
                            switch (itemType) {
                                case 'checkbox':
                                    onChange(item, idx, child.checked);
                                    break;
                                default:
                                    debugger;
                            }
                        });
                    }
                }
                li.addEventListener('mouseenter', () => {
                    if (selectedIdx !== idx) li.style.background = 'var(--imgui-button-hover)';
                });
                li.addEventListener('mouseout', () => {
                    if (selectedIdx !== idx) li.style.background = '';
                });
            }

            listBox.appendChild(li);
        });

        // API methods
        listBox.getSelected = () => {
            if (selectedIdx >= 0 && selectedIdx < items.length) return { item: items[selectedIdx], index: selectedIdx };
            return null;
        };
        listBox.setSelected = (idxOrItem) => {
            let idx = typeof idxOrItem === 'number' ? idxOrItem : items.indexOf(idxOrItem);
            if (idx < 0 || idx >= items.length) return;
            Array.from(listBox.children).forEach((child, i) => {
                child.style.background = '';
                child.style.color = 'var(--imgui-text)';
                if (i === idx) {
                    child.style.background = 'var(--imgui-accent)';
                    child.style.color = '#fff';
                    child.scrollIntoView({ block: "nearest" });
                }
            });
            selectedIdx = idx;
        };

        wrapper.appendChild(listBox);
        this._applyIndentation(wrapper);
        this._getTargetContainer().appendChild(wrapper);

        if (selectedIdx >= 0 && listBox.children[selectedIdx]) {
            requestAnimationFrame(() => {
                listBox.children[selectedIdx].scrollIntoView({ block: "nearest" });
            });
        }

        return this._registerControl(listBox, id);
    }

    Show() { 
        // NOTE: Clean up any empty wrappers left behind by removed controls, this was added after the introduction of the 'Listbox' function
        const wrappers = this.container.querySelectorAll('.imgui-wrapper');
        wrappers.forEach(wrapper => { 
            if (wrapper.children.length === 0) wrapper.remove();
        });

        if (this.container.style.display === 'none') {
            this.container.style.display = 'block';
            return this;
        } else {
            if (this.indentationLevel > 0) {
                console.warn("ImmediateGUI: Show() called while in indentation mode. Did you forget to call EndIndentation() somewhere?");
            }

            if (this.currentSection) {
                console.warn("ImmediateGUI: Show() called while in section mode. Did you forget to call EndSection() somewhere?");
            }

            if (this.currentRow) {
                console.warn("ImmediateGUI: Show() called while in row mode. Did you forget to call EndRow() somewhere?");
            }

            if (this.container.children.length === 0) return this;
            if (!document.body.contains(this.container)) {

                // Last control wrapper does not need bottom margin, strip that away
                if (this._getControls().length > 0) {
                    this._getControls()[this._getControls().length - 1].style.marginBottom = '0px';
                }
                document.body.appendChild(this.container);
            }
            return this;
        }
    }

    Remove() {
        this.container.remove();
    }

    Hide() {
        this.container.style.display = "none";
        return this;
    }

    ShowModal(message, title = '', options = {}) {
        // Default options
        const config = {
            title: title || '',
            type: 'info', // 'info', 'warning', 'error', 'success'
            buttons: ['OK'],
            closeOnBackdropClick: true,
            width: 400,
            ...options
        };
        
        const backdrop = document.createElement('div');
        backdrop.className = 'imgui-modal-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.75);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;

        const modal = document.createElement('div');
        modal.className = 'imgui-modal';
        modal.style.cssText = `
            background: var(--imgui-bg);
            border: 1px solid var(--imgui-border);
            border-radius: 6px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: ${config.width}px;
            max-width: 90vw;
            max-height: 80vh;
            overflow-y: auto;
            padding: 16px;
            transform: translateY(-20px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            font-family: inherit;
        `;
        
        if (config.title) {
            const title = document.createElement('div');
            title.className = 'imgui-modal-title';
            title.textContent = config.title;
            title.style.cssText = `
                font-size: 18px;
                font-weight: bold;
                color: var(--imgui-text);
                margin-bottom: 12px;
                padding-bottom: 8px;
                border-bottom: 1px solid var(--imgui-border);
            `;
            modal.appendChild(title);
        }
        
        let iconHtml = '';
        if (config.type === 'warning') {
            iconHtml = '<div style="color: #f0ad4e; margin-right: 10px; font-size: 24px;">⚠️</div>';
        } else if (config.type === 'error') {
            iconHtml = '<div style="color: #d9534f; margin-right: 10px; font-size: 24px;">❌</div>';
        } else if (config.type === 'info') {
            iconHtml = '<div style="color: #5bc0de; margin-right: 10px; font-size: 24px;">ℹ️</div>';
        } else if (config.type === 'success') {
            iconHtml = '<div style="color: #5cb85c; margin-right: 10px; font-size: 24px;">✅</div>';
        }
        
        const messageContainer = document.createElement('div');
        messageContainer.className = 'imgui-modal-message';
        messageContainer.style.cssText = `
            color: var(--imgui-text);
            margin-bottom: 16px;
            line-height: 1.5;
            display: flex;
            align-items: flex-start;
        `;
        
        if (iconHtml) {
            const iconElement = document.createElement('div');
            iconElement.innerHTML = this._escapeHTMLPolicy.createHTML(iconHtml);
            messageContainer.appendChild(iconElement);
        }
        
        const messageText = document.createElement('div');
        messageText.style.flex = '1';
        
        if (typeof message === 'object' && message.nodeType) {
            messageText.appendChild(message);
        } else {
            messageText.textContent = message;
        }
        
        messageContainer.appendChild(messageText);
        modal.appendChild(messageContainer);
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'imgui-modal-buttons';
        buttonsContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 8px;
            margin-top: 16px;
        `;
        
        const closeModal = () => {
            modal.style.transform = 'translateY(-20px)';
            modal.style.opacity = '0';
            backdrop.style.opacity = '0';
            
            setTimeout(() => {
                document.body.removeChild(backdrop);
            }, 300);
        };
        
        const buttonsList = Array.isArray(config.buttons) ? config.buttons : [config.buttons];
        
        buttonsList.forEach((buttonConfig) => {
            const isObject = typeof buttonConfig === 'object';
            const buttonText = isObject ? buttonConfig.text : buttonConfig;
            const isPrimary = isObject ? buttonConfig.primary : false;
            const callback = isObject ? buttonConfig.callback : null;
            
            const button = document.createElement('button');
            button.textContent = buttonText;
            button.className = isPrimary ? 'imgui-button imgui-primary-button' : 'imgui-button';
            
            if (isPrimary) {
                button.style.background = 'var(--imgui-accent)';
                button.style.color = 'var(--imgui-text)';
                button.style.borderColor = 'var(--imgui-border)';
                button.style.fontWeight = 'bold';

                button.addEventListener('mouseenter', () => { button.style.background = 'var(--imgui-button-hover)'; });
                button.addEventListener('mouseout', () => { button.style.background = 'var(--imgui-accent)'; });
            }
            
            button.addEventListener('click', () => {
                if (callback) callback();
                closeModal();
            });
            
            buttonsContainer.appendChild(button);
        });
        
        modal.appendChild(buttonsContainer);
        backdrop.appendChild(modal);
        
        if (config.closeOnBackdropClick) {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    closeModal();
                }
            });
        }
        
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    
        document.body.appendChild(backdrop);
        
        setTimeout(() => {
            backdrop.style.opacity = '1';
            modal.style.transform = 'translateY(0)';
            modal.style.opacity = '1';
        }, 10);
        
        return {
            close: closeModal,
            element: modal,
            backdrop: backdrop
        };
    }

    ShowPrompt(message, title, defaultValue = '', options = {}) {
        // TODO: Implement this
        console.warn("ImmediateGUI: ShowPrompt is not implemented yet, falling back to default prompt.");
        
        return prompt(message, defaultValue);
    }

    // New methods for better theming and layout
    SetTheme(themeName) {
        if (this.themes[themeName]) {
            this.options.theme = themeName;
            this.theme = this.themes[themeName];

            this._updateCSSVariables();
            this._applyThemeToElements();
        }
        return this;
    }

    _applyThemeToElements() {
        // Update container
        this.container.style.background = this.theme.background;
        this.container.style.color = this.theme.text;
        this.container.style.borderColor = this.theme.border;
        
        // Update all controls
        this.container.querySelectorAll('.imgui-button').forEach(el => {
            el.style.background = this.theme.buttonBg;
            el.style.color = this.theme.text;
            el.style.borderColor = this.theme.border;
        });
        
        this.container.querySelectorAll('.imgui-input').forEach(el => {
            el.style.background = this.theme.inputBg;
            el.style.color = this.theme.text;
            el.style.borderColor = this.theme.border;
        });
        
        this.container.querySelectorAll('.imgui-section').forEach(el => {
            // Shitty hack to make the section header text color change for sections
            // that are not collapsible
            el.querySelectorAll('.imgui-section-header').forEach(h => { h.style.color = this.theme.text;});
            el.style.background = this.theme.sectionBg;
            el.style.borderColor = this.theme.border;
        });

        // this.container.querySelectorAll('.imgui-progressbar').forEach(el => {
        //     // el.style.background = this.theme.inputBg;
        //     // el.style.borderColor = this.theme.border;
        // });
        
        // Update text elements
        this.container.querySelectorAll('label, h1, h2, h3, h4, h5, h6, span').forEach(el => {
            el.style.color = this.theme.text;
        });

        this.container.querySelectorAll('.imgui-toggle-input').forEach(toggle => {
            const track = toggle.track;
            const thumb = toggle.thumb;
            
            if (track && thumb) {
                // Update track color based on state
                if (toggle.checked) {
                    track.style.background = 'var(--imgui-accent)';
                } else {
                    track.style.background = 'var(--imgui-border)';
                }
                
                // Update thumb color
                thumb.style.background = 'var(--imgui-text)';
                
                // Update border
                track.style.borderColor = 'var(--imgui-border)';
            }
        });
        
        return this;
    }
}
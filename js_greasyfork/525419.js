// ==UserScript==
// @name         Arxiv HTML Viewer Redirect
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Add a button to view HTML version of Arxiv papers
// @author       Qalxry
// @match        https://arxiv.org/abs/*
// @match        https://arxiv.org/pdf/*
// @match        https://ar5iv.labs.arxiv.org/html/*
// @icon         https://www.w3.org/html/logo/downloads/HTML5_Logo_256.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525419/Arxiv%20HTML%20Viewer%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/525419/Arxiv%20HTML%20Viewer%20Redirect.meta.js
// ==/UserScript==
    
(function() {
    'use strict';

    const isArxivPage = () => window.location.hostname === 'arxiv.org';
    const isAr5ivPage = () => window.location.hostname === 'ar5iv.labs.arxiv.org';

    const addArxivButton = () => {
        const button = document.createElement('button');
        button.textContent = '查看HTML';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.backgroundColor = '#4CAF50'; // Green
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px 20px';
        button.style.textAlign = 'center';
        button.style.textDecoration = 'none';
        button.style.display = 'inline-block';
        button.style.fontSize = '16px';
        button.style.margin = '4px 2px';
        button.style.cursor = 'pointer';
        button.style.borderRadius = '12px';

        const url = window.location.href;
        const arxivIdMatch = url.match(/\/(abs|pdf)\/([0-9]+\.[0-9]+)(v\d+)?/);
        if (!arxivIdMatch) {
            return;
        }

        const arxivId = `${arxivIdMatch[2]}${arxivIdMatch[3] || ''}`;
        button.onclick = () => {
            window.location.href = `https://ar5iv.labs.arxiv.org/html/${arxivId}`;
        };

        document.body.appendChild(button);
    };

    const getThemeColors = () => {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            return {
                surface: '#11161d',
                border: '#2a3441',
                text: '#e7ecf2',
                subtleText: '#b7c2d0',
                accent: '#3ea6ff',
                hover: '#1a2330',
                activeBg: 'rgba(62, 166, 255, 0.18)',
            };
        }
        return {
            surface: '#f9f9f9',
            border: '#d6dbe3',
            text: '#1f2a3a',
            subtleText: '#4a5568',
            accent: '#2f7dff',
            hover: '#eef2f8',
            activeBg: 'rgba(47, 125, 255, 0.12)',
        };
    };

    const applyTheme = (container) => {
        const colors = getThemeColors();
        container.style.backgroundColor = colors.surface;
        container.style.border = `1px solid ${colors.border}`;
        container.style.color = colors.text;
        container.dataset.themeAccent = colors.accent;
        container.dataset.themeHover = colors.hover;
        container.dataset.themeActive = colors.activeBg;
        container.dataset.themeText = colors.text;
        container.dataset.themeSubtle = colors.subtleText;
    };

    const createOutline = () => {
        if (document.getElementById('ar5iv-outline-wrapper')) {
            return;
        }

        const headingNodes = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        const abstractNodes = Array.from(document.querySelectorAll('.ltx_title.ltx_title_abstract'))
            .filter(el => !/^H[1-6]$/.test(el.tagName));
        const headings = [...headingNodes, ...abstractNodes];
        if (!headings.length) {
            return;
        }

        headings.sort((a, b) => {
            if (a === b) return 0;
            const position = a.compareDocumentPosition(b);
            if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
            if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
            return 0;
        });

        headings.forEach((heading, index) => {
            if (!heading.id) {
                heading.id = `ar5iv-heading-${index}`;
            }
        });

        // Build hierarchical structure
        const buildTree = () => {
            const root = { children: [], level: 0 };
            const stack = [root];
            headings.forEach((heading) => {
                const isAbstract = heading.classList.contains('ltx_title') && heading.classList.contains('ltx_title_abstract');
                const level = isAbstract ? 2 : Number(heading.tagName.substring(1));
                const node = { heading, level, children: [] };
                while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                    stack.pop();
                }
                stack[stack.length - 1].children.push(node);
                stack.push(node);
            });
            return root.children;
        };

        const tree = buildTree();

        // Wrapper for toggle button and panel
        const wrapper = document.createElement('div');
        wrapper.id = 'ar5iv-outline-wrapper';
        wrapper.style.position = 'fixed';
        wrapper.style.left = '14px';
        wrapper.style.top = '20px';
        wrapper.style.zIndex = '1000';
        wrapper.style.fontFamily = 'Segoe UI, Arial, sans-serif';

        // Toggle button (always visible)
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'ar5iv-outline-toggle';
        toggleBtn.innerHTML = '☰';
        toggleBtn.style.width = '36px';
        toggleBtn.style.height = '36px';
        toggleBtn.style.border = 'none';
        toggleBtn.style.borderRadius = '8px';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.fontSize = '18px';
        toggleBtn.style.display = 'flex';
        toggleBtn.style.alignItems = 'center';
        toggleBtn.style.justifyContent = 'center';
        toggleBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        toggleBtn.style.transition = 'background-color 150ms ease';
        wrapper.appendChild(toggleBtn);

        // Main container
        const container = document.createElement('nav');
        container.id = 'ar5iv-outline';
        container.style.marginTop = '8px';
        container.style.width = '280px';
        container.style.maxHeight = 'calc(100vh - 100px)';
        container.style.overflowY = 'auto';
        container.style.borderRadius = '12px';
        container.style.padding = '12px 10px 14px';
        container.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
        container.style.fontSize = '14px';
        container.style.lineHeight = '1.45';
        container.style.boxSizing = 'border-box';
        container.style.backdropFilter = 'blur(4px)';
        container.style.overscrollBehavior = 'contain';
        container.style.transition = 'opacity 200ms ease, transform 200ms ease';

        const applyFullTheme = () => {
            applyTheme(container);
            const colors = getThemeColors();
            toggleBtn.style.backgroundColor = colors.surface;
            toggleBtn.style.color = colors.text;
            toggleBtn.style.border = `1px solid ${colors.border}`;
        };
        applyFullTheme();

        // Title
        const title = document.createElement('div');
        title.textContent = 'Outline';
        title.style.fontWeight = '700';
        title.style.margin = '0 0 10px 4px';
        title.style.letterSpacing = '0.3px';
        container.appendChild(title);

        // List
        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.margin = '0';

        const linkMap = new Map();
        const itemMap = new Map(); // heading id -> li element
        const childrenMap = new Map(); // heading id -> children ul

        const renderNode = (node, parentUl) => {
            const { heading, level, children } = node;
            const item = document.createElement('li');
            item.style.marginBottom = '4px';
            item.dataset.level = level;

            const row = document.createElement('div');
            row.style.display = 'flex';
            row.style.alignItems = 'center';

            // Collapse toggle
            const collapseBtn = document.createElement('span');
            collapseBtn.style.width = '18px';
            collapseBtn.style.height = '18px';
            collapseBtn.style.display = 'inline-flex';
            collapseBtn.style.alignItems = 'center';
            collapseBtn.style.justifyContent = 'center';
            collapseBtn.style.cursor = children.length ? 'pointer' : 'default';
            collapseBtn.style.flexShrink = '0';
            collapseBtn.style.marginRight = '2px';
            collapseBtn.style.fontSize = '10px';
            collapseBtn.style.userSelect = 'none';
            collapseBtn.style.transition = 'transform 150ms ease';
            collapseBtn.textContent = children.length ? '▶' : '';
            collapseBtn.dataset.expanded = 'true';
            if (children.length) {
                collapseBtn.style.transform = 'rotate(90deg)';
            }
            row.appendChild(collapseBtn);

            const link = document.createElement('a');
            link.href = `#${heading.id}`;
            const text = heading.textContent.trim();
            link.textContent = text;
            link.title = text;
            link.style.color = container.dataset.themeText;
            link.style.textDecoration = 'none';
            link.style.display = 'block';
            link.style.flex = '1';
            link.style.whiteSpace = 'nowrap';
            link.style.textOverflow = 'ellipsis';
            link.style.overflow = 'hidden';
            link.style.padding = '5px 8px';
            link.style.borderRadius = '6px';
            link.style.transition = 'background-color 160ms ease, color 160ms ease';

            link.onmouseenter = () => {
                link.style.backgroundColor = container.dataset.themeHover;
            };
            link.onmouseleave = () => {
                if (link.dataset.active !== 'true') {
                    link.style.backgroundColor = 'transparent';
                }
            };
            link.onclick = (event) => {
                event.preventDefault();
                const target = document.getElementById(heading.id);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            };

            row.appendChild(link);
            item.appendChild(row);
            parentUl.appendChild(item);

            linkMap.set(heading.id, link);
            itemMap.set(heading.id, item);

            if (children.length) {
                const childUl = document.createElement('ul');
                childUl.style.listStyle = 'none';
                childUl.style.padding = '0';
                childUl.style.margin = '0';
                childUl.style.marginLeft = '12px';
                childUl.style.overflow = 'hidden';
                childUl.style.transition = 'max-height 200ms ease';
                childUl.style.maxHeight = '9999px';
                item.appendChild(childUl);
                childrenMap.set(heading.id, childUl);

                children.forEach(child => renderNode(child, childUl));

                collapseBtn.onclick = (e) => {
                    e.stopPropagation();
                    const expanded = collapseBtn.dataset.expanded === 'true';
                    collapseBtn.dataset.expanded = expanded ? 'false' : 'true';
                    collapseBtn.style.transform = expanded ? 'rotate(0deg)' : 'rotate(90deg)';
                    childUl.style.maxHeight = expanded ? '0' : '9999px';
                };
            }
        };

        tree.forEach(node => renderNode(node, list));
        container.appendChild(list);
        wrapper.appendChild(container);

        // Context menu
        const contextMenu = document.createElement('div');
        contextMenu.id = 'ar5iv-outline-menu';
        contextMenu.style.position = 'fixed';
        contextMenu.style.display = 'none';
        contextMenu.style.borderRadius = '8px';
        contextMenu.style.padding = '6px 0';
        contextMenu.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
        contextMenu.style.zIndex = '1001';
        contextMenu.style.minWidth = '140px';
        contextMenu.style.fontSize = '13px';

        const applyMenuTheme = () => {
            const colors = getThemeColors();
            contextMenu.style.backgroundColor = colors.surface;
            contextMenu.style.border = `1px solid ${colors.border}`;
            contextMenu.style.color = colors.text;
        };
        applyMenuTheme();

        const createMenuItem = (label, action) => {
            const menuItem = document.createElement('div');
            menuItem.textContent = label;
            menuItem.style.padding = '8px 16px';
            menuItem.style.cursor = 'pointer';
            menuItem.style.transition = 'background-color 120ms ease';
            menuItem.onmouseenter = () => {
                menuItem.style.backgroundColor = getThemeColors().hover;
            };
            menuItem.onmouseleave = () => {
                menuItem.style.backgroundColor = 'transparent';
            };
            menuItem.onclick = () => {
                action();
                contextMenu.style.display = 'none';
            };
            return menuItem;
        };

        const collapseAll = () => {
            childrenMap.forEach((ul, id) => {
                ul.style.maxHeight = '0';
                const item = itemMap.get(id);
                if (item) {
                    const btn = item.querySelector('span');
                    if (btn) {
                        btn.dataset.expanded = 'false';
                        btn.style.transform = 'rotate(0deg)';
                    }
                }
            });
        };

        const expandAll = () => {
            childrenMap.forEach((ul, id) => {
                ul.style.maxHeight = '9999px';
                const item = itemMap.get(id);
                if (item) {
                    const btn = item.querySelector('span');
                    if (btn) {
                        btn.dataset.expanded = 'true';
                        btn.style.transform = 'rotate(90deg)';
                    }
                }
            });
        };

        contextMenu.appendChild(createMenuItem('展开全部', expandAll));
        contextMenu.appendChild(createMenuItem('折叠全部', collapseAll));
        document.body.appendChild(contextMenu);

        container.oncontextmenu = (e) => {
            e.preventDefault();
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.style.top = `${e.clientY}px`;
            contextMenu.style.display = 'block';
        };

        document.addEventListener('click', () => {
            contextMenu.style.display = 'none';
        });

        document.body.appendChild(wrapper);

        // Collapse / expand panel
        let panelVisible = true;
        const isMobile = () => window.innerWidth < 768;

        const showPanel = () => {
            container.style.display = 'block';
            setTimeout(() => {
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 10);
            panelVisible = true;
        };

        const hidePanel = () => {
            container.style.opacity = '0';
            container.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                container.style.display = 'none';
            }, 200);
            panelVisible = false;
        };

        toggleBtn.onclick = () => {
            if (panelVisible) {
                hidePanel();
            } else {
                showPanel();
            }
        };

        // Auto collapse on mobile
        const handleResize = () => {
            if (isMobile() && panelVisible) {
                hidePanel();
            }
        };
        window.addEventListener('resize', handleResize);
        if (isMobile()) {
            hidePanel();
        }

        // Intersection observer for active highlight
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const id = entry.target.id;
                const link = linkMap.get(id);
                if (!link) return;
                if (entry.isIntersecting) {
                    link.dataset.active = 'true';
                    link.style.backgroundColor = container.dataset.themeActive;
                    link.style.color = container.dataset.themeText;
                } else {
                    link.dataset.active = 'false';
                    link.style.backgroundColor = 'transparent';
                }
            });
        }, {
            rootMargin: '0px 0px -70% 0px',
            threshold: [0, 1],
        });

        headings.forEach((heading) => observer.observe(heading));

        // Theme change listener
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                applyFullTheme();
                applyMenuTheme();
            });
        }
    };

    const init = () => {
        if (isAr5ivPage()) {
            createOutline();
        } else if (isArxivPage()) {
            addArxivButton();
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


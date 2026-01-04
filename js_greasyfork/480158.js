// ==UserScript==
// @name           YggTorrent Amélioré - Version Optimisée
// @match          https://*.yggtorrent.top/*
// @version        2.1.0
// @author         J.H / clemente
// @license        MIT
// @description    Version optimisée : connexion automatique, prévisualisation d'images, boutons de téléchargement, recherche dynamique, et bien plus
// @run-at         document-start
// @noframes
// @icon           https://www.google.com/s2/favicons?sz=64&domain=yggtorrent.top
// @grant          GM.getValue
// @grant          GM.setValue
// @grant          GM.deleteValue
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @namespace      https://greasyfork.org/users/448067
// @downloadURL https://update.greasyfork.org/scripts/480158/YggTorrent%20Am%C3%A9lior%C3%A9%20-%20Version%20Optimis%C3%A9e.user.js
// @updateURL https://update.greasyfork.org/scripts/480158/YggTorrent%20Am%C3%A9lior%C3%A9%20-%20Version%20Optimis%C3%A9e.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // ============================
    // CONFIGURATION
    // ============================
    const CONFIG = {
        // Theme and appearance
        BETTER_DARK_THEME: true,
        HIDE_SIDEBAR: true,
        LARGER_NFO: true,

        // Login
        LOGIN_AUTOMATICALLY: true,

        // Search
        SEARCH_BY_LATEST_FIRST: true,
        KEEP_SEARCH_WHEN_CLICKING_ON_SUBCATEGORY_ICON: true,

        // Features
        DOWNLOAD_BUTTONS_IN_RESULTS: true,
        PREVIEWS_IMAGES_ON_HOVER: true,
        PREVIEWS_IMAGES_SIZE: 250,
        PREVIEW_DELAY: 200,
    };

    // ============================
    // CSS SELECTORS
    // ============================
    const SELECTORS = {
        REGISTER_BUTTON: '.register',
        TORRENT_NAME_LINK: 'a[id="torrent_name"]',
        RESULTS_TABLE_ROW: '.results table tbody tr',
        INPUT_USERNAME: 'input[name="id"]',
        INPUT_PASSWORD: 'input[name="pass"]',
        INPUT_SUBMIT: 'button[type="submit"]',
        LOGOUT_LINK: 'a[href="https://www.yggtorrent.top/user/logout"]',
        NFO_MODAL: '#nfoModal',
        SEARCH_FORM: 'form.search',
        LOGIN_FORM: '.login-form',
    };

    const CONSTANTS = {
        IMAGE_MODAL_STYLE: `min-width: ${CONFIG.PREVIEWS_IMAGES_SIZE}px; max-width: ${CONFIG.PREVIEWS_IMAGES_SIZE}px;`,
        COOKIES_STORAGE_KEY: 'yggtorrent_credentials',
        MOUSEENTER_DELAY: CONFIG.PREVIEW_DELAY,
    };

    // jQuery alias to avoid conflicts
    const $ = jQuery.noConflict(true);

    // ============================
    // UTILITIES
    // ============================
    const Utils = {
        getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },

        // Convert bytes to readable format
        formatOctets(bytes, decimals = 2) {
            if (bytes === 0) return '~0';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + sizes[i];
        },

        // Convert units to bytes
        convertToBytes(value) {
            const unit = value.substring(value.length - 2);
            const num = parseFloat(value.slice(0, -2));
            const multipliers = {
                'Po': 1125899906842624,
                'To': 1099511627776,
                'Go': 1073741824
            };
            return num * (multipliers[unit] || 1073741824);
        }
    };

    // ============================
    // LOGIN MANAGEMENT
    // ============================
    const LoginManager = {
        async handleLogin() {
            const isNotLoggedIn = document.querySelector(SELECTORS.REGISTER_BUTTON);
            const savedCredentials = await GM.getValue(CONSTANTS.COOKIES_STORAGE_KEY);

            if (isNotLoggedIn && !savedCredentials) {
                await this.getCredentials();
            } else if (isNotLoggedIn && savedCredentials) {
                await this.autoLogin(savedCredentials);
            }
        },

        async getCredentials() {
            try {
                const loginForm = document.querySelector(SELECTORS.LOGIN_FORM);
                if (loginForm) {
                    loginForm.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const usernameInput = loginForm.querySelector(SELECTORS.INPUT_USERNAME);
                        const passwordInput = loginForm.querySelector(SELECTORS.INPUT_PASSWORD);
                        await this.saveCredentials(usernameInput.value, passwordInput.value);
                    });
                }
            } catch (error) {
                console.error('Error getting credentials:', error);
            }
        },

        async autoLogin(credentials) {
            try {
                const loginForm = document.querySelector(SELECTORS.LOGIN_FORM);
                if (loginForm) {
                    const usernameInput = loginForm.querySelector(SELECTORS.INPUT_USERNAME);
                    const passwordInput = loginForm.querySelector(SELECTORS.INPUT_PASSWORD);
                    const submitButton = loginForm.querySelector(SELECTORS.INPUT_SUBMIT);

                    if (usernameInput && passwordInput && submitButton) {
                        usernameInput.value = credentials.username;
                        passwordInput.value = credentials.password;
                        submitButton.click();
                    }
                }
            } catch (error) {
                console.error('Error during auto-login:', error);
            }
        },

        async saveCredentials(username, password) {
            try {
                await GM.setValue(CONSTANTS.COOKIES_STORAGE_KEY, { username, password });
            } catch (error) {
                console.error('Error saving credentials:', error);
            }
        },

        async deleteCredentials() {
            try {
                await GM.deleteValue(CONSTANTS.COOKIES_STORAGE_KEY);
            } catch (error) {
                console.error('Error deleting credentials:', error);
            }
        }
    };

    // ============================
    // IMAGE PREVIEW
    // ============================
    const ImagePreview = {
        init() {
            this.createImageModal();
            this.addPreviewHandlers();
        },

        createImageModal() {
            const modal = document.createElement('div');
            modal.id = 'imageModal';
            modal.classList.add('modal');
            modal.style.cssText = 'display:none;position:fixed;z-index:9999;';

            const modalImage = document.createElement('img');
            modalImage.id = 'imageModalImage';
            modalImage.classList.add('modal-content');
            modalImage.style = CONSTANTS.IMAGE_MODAL_STYLE;

            modal.appendChild(modalImage);
            document.body.append(modal);

            // Close on click
            modal.addEventListener('click', () => {
                modal.style.display = 'none';
            });

            // Close with Escape key
            document.addEventListener('keyup', (e) => {
                if (e.key === 'Escape') {
                    modal.style.display = 'none';
                }
            });
        },

        async fetchImageFromPage(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 3000,
                    onload: function(response) {
                        try {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, 'text/html');
                            
                            // Check for Cloudflare protection
                            if (doc.title.includes('Just a moment...')) {
                                resolve(null);
                                return;
                            }

                            // Find image in description section
                            let targetSection = $(doc).find('#send-comment').prev('.content');
                            if (targetSection.length === 0) {
                                targetSection = $(doc).find('.content').eq(1);
                            }

                            const imgElements = targetSection.find('img');
                            const validImages = [];
                            let imagesProcessed = 0;
                            
                            if (imgElements.length === 0) {
                                resolve(null);
                                return;
                            }
                            
                            // Process all images and calculate their surface
                            imgElements.each(function(i) {
                                let imgSrc = $(this).attr('src');
                                
                                // Check if it's a zupimages viewer link in href
                                const parentLink = $(this).parent('a').attr('href');
                                if (parentLink && parentLink.includes('zupimages.net/viewer.php')) {
                                    const match = parentLink.match(/id=(.+?)$/);
                                    if (match) {
                                        imgSrc = 'https://zupimages.net/up/' + match[1];
                                    }
                                }
                                
                                // Ignore YGG images and small base64 images
                                if (!imgSrc || imgSrc.includes('yggtorrent') || 
                                    (imgSrc.startsWith('data:image') && imgSrc.length < 1000)) {
                                    imagesProcessed++;
                                    if (imagesProcessed === imgElements.length) {
                                        finishProcessing();
                                    }
                                    return;
                                }

                                // Ignore flags and small TMDB images
                                if (imgSrc.includes('flagcdn.com') || 
                                    imgSrc.includes('circle-flags') ||
                                    imgSrc.match(/\/w(20|45|92|138|185)\//)) {
                                    imagesProcessed++;
                                    if (imagesProcessed === imgElements.length) {
                                        finishProcessing();
                                    }
                                    return;
                                }

                                // Force HTTPS to avoid Mixed Content warnings
                                if (imgSrc.startsWith('http://')) {
                                    imgSrc = imgSrc.replace('http://', 'https://');
                                }

                                // Load image to get dimensions
                                const img = new Image();
                                img.onload = function() {
                                    const ratio = Math.min(this.width, this.height) / Math.max(this.width, this.height);
                                    
                                    // Basic filtering - just avoid very small images and banners
                                    const minSize = 200;
                                    const minRatio = 0.4; // Accept most images except extreme banners
                                    
                                    if (this.width > minSize && this.height > minSize && ratio > minRatio) {
                                        // Calculate which dimension is longer
                                        const longestDimension = Math.max(this.width, this.height);
                                        
                                        validImages.push({
                                            src: imgSrc,
                                            longestDimension: longestDimension
                                        });
                                    }
                                    
                                    imagesProcessed++;
                                    if (imagesProcessed === imgElements.length) {
                                        finishProcessing();
                                    }
                                };
                                
                                img.onerror = function() {
                                    imagesProcessed++;
                                    if (imagesProcessed === imgElements.length) {
                                        finishProcessing();
                                    }
                                };
                                
                                img.src = imgSrc;
                            });

                            function finishProcessing() {
                                if (validImages.length > 0) {
                                    // Sort by longest dimension (bigger is better)
                                    validImages.sort((a, b) => b.longestDimension - a.longestDimension);
                                    resolve(validImages[0].src);
                                } else {
                                    resolve(null);
                                }
                            }
                            
                        } catch (error) {
                            console.error('Error parsing page:', error);
                            resolve(null);
                        }
                    },
                    onerror: function(error) {
                        console.error('Error fetching page:', error);
                        resolve(null);
                    },
                    ontimeout: function() {
                        console.error('Request timeout for:', url);
                        resolve(null);
                    }
                });
            });
        },

        addPreviewHandlers() {
            let timeout = null;
            let canDisplay = false;

            const torrents = document.querySelectorAll(SELECTORS.RESULTS_TABLE_ROW);
            if (!torrents) return;

            torrents.forEach((torrent) => {
                const torrentNameLink = torrent.querySelector(SELECTORS.TORRENT_NAME_LINK);
                if (!torrentNameLink) return;

                torrentNameLink.addEventListener('mouseenter', async (e) => {
                    // Hide old image immediately to avoid flash
                    document.getElementById('imageModal').style.display = 'none';
                    
                    const delai = Utils.getCookie('ygg_preview_delay') || CONSTANTS.MOUSEENTER_DELAY;
                    
                    timeout = setTimeout(async () => {
                        if (e.target.id !== 'torrent_name') return;
                        canDisplay = true;
                        
                        const imgSrc = await this.fetchImageFromPage(e.target.href);
                        
                        if (canDisplay && imgSrc) {
                            this.displayImageModal(e, imgSrc);
                        }
                    }, delai);
                });

                torrentNameLink.addEventListener('mousemove', (e) => {
                    const modal = document.getElementById('imageModal');
                    if (modal && modal.style.display === 'block') {
                        this.positionModal(e, modal);
                    }
                });

                torrentNameLink.addEventListener('mouseout', () => {
                    document.getElementById('imageModal').style.display = 'none';
                    canDisplay = false;
                    clearTimeout(timeout);
                });
            });
        },

        displayImageModal(event, imgSrc) {
            const modal = document.getElementById('imageModal');
            const modalImage = document.getElementById('imageModalImage');
            
            if (modal && modalImage) {
                // Wait for image to load before displaying
                modalImage.onload = () => {
                    this.positionModal(event, modal);
                    modal.style.display = 'block';
                };
                // Load image
                modalImage.src = imgSrc;
            }
        },

        positionModal(e, modal) {
            const modalImage = document.getElementById('imageModalImage');
            const mouseY = e.clientY - 25;
            const outOfScreen = mouseY + modalImage.offsetHeight - window.innerHeight;
            
            // Position image using JH logic
            modal.style.top = outOfScreen > -25 
                ? (mouseY - outOfScreen - 25) + 'px' 
                : mouseY + 'px';
            modal.style.left = (e.clientX + 125) + 'px';
        },

        removePreview() {
            $("a[id^='torrent_name']").off("mouseenter").off("mouseleave").off("mousemove");
        }
    };

    // ============================
    // SITE FEATURES
    // ============================
    const SiteFeatures = {
        addDownloadButtons() {
            const torrents = document.querySelectorAll(SELECTORS.RESULTS_TABLE_ROW);
            torrents.forEach((torrent) => {
                const torrentId = torrent.querySelector('a[target]')?.target;
                if (!torrentId) return;

                const downloadIcon = document.createElement('span');
                downloadIcon.classList.add('ico_download', 'custom_ygg');

                const downloadButton = document.createElement('a');
                downloadButton.href = `/engine/download_torrent?id=${torrentId}`;
                downloadButton.append(downloadIcon);
                downloadButton.style = 'float: left; color: rgb(98, 219, 168)';

                const nameLink = torrent.querySelector('td:nth-child(3) a');
                if (nameLink) {
                    nameLink.parentNode.insertBefore(downloadButton, nameLink);
                }
            });
        },

        hideSidebar() {
            const sidebar = document.getElementById('cat');
            const sidebarCookie = Utils.getCookie('ygg_sidebar');
            
            if (sidebarCookie === 'off') {
                if (sidebar && sidebar.classList.contains('active')) {
                    sidebar.querySelector('.open')?.click();
                }
            } else if (sidebarCookie === 'on') {
                if (sidebar && !sidebar.classList.contains('active')) {
                    sidebar.querySelector('.open')?.click();
                }
            } else if (CONFIG.HIDE_SIDEBAR) {
                if (sidebar && sidebar.classList.contains('active')) {
                    sidebar.querySelector('.open')?.click();
                }
            }
        },

        displayLargerNfo() {
            const modal = document.querySelector(SELECTORS.NFO_MODAL);
            if (!modal) return;

            const modalDialog = modal.querySelector('.modal-dialog');
            if (modalDialog) {
                modalDialog.classList.remove('modal-sm');
                modalDialog.classList.add('modal-lg');
            }
        },

        searchByLatestFirst() {
            const searchForm = document.querySelector(SELECTORS.SEARCH_FORM);
            if (!searchForm) return;

            const searchDate = Utils.getCookie('ygg_search_date');
            const order = searchDate === 'asc' ? 'asc' : 'desc';

            const orderInput = document.createElement('input');
            orderInput.name = 'order';
            orderInput.value = order;
            orderInput.style = 'display: none';

            const sortInput = document.createElement('input');
            sortInput.name = 'sort';
            sortInput.value = 'publish_date';
            sortInput.style = 'display: none';

            searchForm.append(orderInput, sortInput);
        },

        keepSearchWhenClickingOnSubcategory() {
            document.querySelectorAll('[class^="tag_subcat_"]').forEach((node) => {
                const subcategoryId = node.className.split('tag_subcat_')[1];
                node.parentNode.href = `${document.URL}&sub_category=${subcategoryId}`;
            });
        },

        calculateDelta() {
            const upText = $('#top_panel .ct li:first-child strong:first-child').text().trim();
            const downText = $('#top_panel .ct li:first-child strong:nth-child(2)').text().trim();
            
            const up = Utils.convertToBytes(upText);
            const down = Utils.convertToBytes(downText);
            const delta = parseFloat(up) - parseFloat(down);
            
            $('#top_panel .ct li:first-child').after(
                `<li><strong>Δ ${delta < 0 ? '<1 !' : Utils.formatOctets(delta)}</strong></li>`
            );
        }
    };

    // ============================
    // CSS STYLES
    // ============================
    const Styles = {
        applyDarkTheme() {
            const customStyles = `
                .custom_ygg{vertical-align:middle}
                .promo-container{display:none!important}
                #over-18-notification,.misc,.donate.pulse{display:none}
                #middle .row .results tr:nth-child(odd) td{background:#2a313ce8;color:#cbd1da}
                #middle .row .results tr td:nth-child(8){color:#4caf50}
                #middle .row .results tr td:nth-child(9){color:#f44336}
                #middle .row .results td .ico_comment,#middle .row .results td{background-color:#2c343f;border:solid 1px #1b1e24;color:#cbd1da}
                #middle .row table td a{color:#cbd1da}
                .results thead th{background:#354150;color:#cbd1da}
                #middle .row .results tr:hover td{background:hsla(155,43%,25%,1)}
                #middle .row .search-criteria{background:#354150}
                #middle .row .search-criteria td.adv_search_option,#middle .row .search-criteria td:first-child{background:#354150;color:#cbd1da!important}
                #middle .row .search-criteria td{background:#354150;color:#cbd1da;border-right:1px solid #1b1e24;border-bottom:1px solid #1b1e24}
                #middle .search-criteria td input{background:#2a313c;color:#6c798d}
                #middle .search-criteria td button.solo{transition:.1s ease-in-out;background:transparent;max-width:100%;color:#5ad9a4;top:-1px;font-size:11px;font-weight:700;text-transform:uppercase;border:3px solid #5ad9a4;border-radius:25px;padding:5px 10px}
                #middle .search-criteria td button.solo:hover{color:#fff;background:#5ad9a4;text-decoration:none}
                .form-control,.select2-selection__rendered,.select2-selection__rendered{background:#2a313c;border:1px solid #1b1e24}
                .select2-container--bootstrap .select2-selection--single{background-color:#2a313c}
                .select2-container--bootstrap .select2-selection--single .select2-selection__rendered{color:#6c798d}
                .select2-dropdown{background-color:#2a313c;color:#6c798d}
                .select2-container--bootstrap .select2-dropdown{border:1px solid #1b1e24}
                .select2-container--bootstrap .select2-search--dropdown .select2-search__field{border:1px solid #1b1e24;background-color:#2a313c;color:#6c798d}
                .select2-container--bootstrap .select2-results__option[aria-selected=true]{background-color:#354150}
                .select2-container--bootstrap .select2-selection{background-color:#2a313c;border:1px solid #1b1e24!important}
                .select2-container--bootstrap .select2-selection .select2-selection__rendered{border:none}
                .select2-container,.select2-container--bootstrap{width:400px!important}
                input:focus{border-color:#6c798d!important;color:#cbd1da}
                #middle .pagination{background:#2a313c;color:#cbd1da}
                #middle .pagination li{border-left:1px solid #1b1e24}
                #middle .pagination li a{background:#2a313c;color:#cbd1da}
                #middle .pagination li a:hover{background:#6c798d}
                #middle .row table.infos-torrent td.adv_search_option,#middle .row table.infos-torrent td:first-child{background:#354150;color:#cbd1da}
                #middle .row table.infos-torrent td{background:#354150;color:#cbd1da;border-right:1px solid #1b1e24;border-bottom:1px solid #1b1e24}
                .description-header{background:#354150;border-bottom:1px solid #1b1e24}
                #middle table td .red{color:#ef5f5f}
                #middle .default{background:#354150!important;color:#cbd1da}
                #middle .default font{color:#cbd1da}
                #middle .default a{color:#5ad9a4}
                #nfoModal .modal-sm{max-width:60%!important}
                #nfoModal .modal-body{background-color:#354150!important;color:#cbd1da}
                #nfoModal .modal-header{border-color:rgba(0,0,0,.125)}
                #nfoModal .modal-footer{background-color:#354150!important;border-color:rgba(0,0,0,.125)}
                #commentary{background:#354150}
                #middle .comment h4,#middle #commentary h4{color:#cbd1da}
                #middle .add-comment,#middle .add-note{background:#354150;border-bottom:3px solid #6c798d}
                #commentary li{border-top:1px solid #6c798d}
                #commentary li .message{background:#6c798d;border:1px solid #6c798d}
                #commentary li .message:before{border-right:15px solid #6c798d}
                #commentary li .message:after{border-right:15px solid #6c798d}
                #commentary li .message .add{color:#cbd1da}
                #commentary li .message a{color:#fff}
                #commentary li .left{background:#6c798d;border:1px solid #1b1e24}
                #comment-list li img[src$="/assets/img/avatar.jpg"]{filter:invert(70%)}
                #comment-list li .ratio .red{color:#9c0b0b}
                .wysibb{background:#354150;border:1px solid #1b1e24}
                .wysibb .wysibb-toolbar .wysibb-toolbar-container .wysibb-toolbar-btn .fonticon{color:#6c798d;text-shadow:none}
                .wysibb .wysibb-toolbar{border-bottom:1px solid #1b1e24}
                .wysibb .wysibb-toolbar .wysibb-toolbar-container{border-right:1px solid #1b1e24}
                .wysibb-toolbar-btn{color:#6c798d}
                .wysibb-body{color:#fff}
                .bottom-resize-line:hover,.bottom-resize-line.drag{background:#6c798d}
                #middle .row table td .input-table{background:#2a313c;color:#cbd1da;border:1px solid #1b1e24;border-radius:5px}
                #connect{background:#2c343f}
                #connect h3{color:#cbd1da}
                #connect input{background:#2a313c;color:#6c798d;border-top:1px solid #1b1e24}
                #connect input:focus{color:#cbd1da}
                #connect a{color:#6c798d}
                #connect a:hover{color:#cbd1da}
                .form-control:focus{background:#2a313c;color:#cbd1da;border-color:#6c798d!important}
                .form-control,.select2-selection__rendered,.select2-selection__rendered{color:#6c798d}
                .field-label-responsive label{color:#6c798d}
                #middle .row table.detail-account{border-left:2px solid #6c798d}
                #middle .row table td.adv_search_option,#middle .row table td:first-child{color:#cbd1da}
                .card{background:#354150}
                .card-footer{border-top:1px solid rgba(27,30,36,.4)!important;background:#354150}
                #top_panel img[src$="/assets/img/avatar.jpg"]{filter:invert(70%);border-color:rgba(0,0,0,.125)}
                .table-bordered{border:solid 1px #1b1e24}
                .inbox thead th{background:#354150;color:#cbd1da}
                .inbox thead td{border:solid 1px #1b1e24}
                #middle section.content div.row div.card img[src$="/assets/img/avatar.jpg"]{filter:invert(70%)}
                .well{background-color:#343a40;border-color:rgba(0,0,0,.125)}
                .well[style^="background:#fff"]{background-color:#6c757d!important;border-color:rgba(0,0,0,.125)}
                .well[style^="background:#e0ffd7"]{background-color:#48a648!important}
                .well[style^="background:#f0f0f0"]{text-decoration:line-through;background-color:#555!important;border-color:rgba(0,0,0,.125)}
                .well strong[style^="color:#3b454e"]{color:#cbd1da!important}
                [role=button],a,area,button,input,label,select,summary,textarea{touch-action:auto}
                #middle .default .date,#middle #description .date{background:#2c343f;border-top:1px solid rgba(27,30,36,.4)}
                #middle .row .results td{background-color:#2c343f;border:solid 1px #1b1e24;color:#cbd1da}
                #middle .row table td{background:#354150;color:#cbd1da;border-right:1px solid #1b1e24;border-bottom:1px solid #1b1e24}
                #middle .row .results tr:nth-child(odd) td{background:#232a33}
                .results thead th{background:#354150;color:#cbd1da}
                ::-webkit-scrollbar{background-color:#202324;color:#aba499}
                ::-webkit-scrollbar-thumb{background-color:#454a4d}
                ::-webkit-scrollbar-thumb:hover{background-color:#575e62}
                ::-webkit-scrollbar-thumb:active{background-color:#484e51}
                ::-webkit-scrollbar-corner{background-color:#181a1b}
                #middle .row .results tr:hover td{background:hsla(155,43%,25%,1)}
                .results{background:#232a33}
                #panel-btn strong{background-image:url(https://i.ibb.co/sw65szs/blue-rank.gif);color:#009CD6;font-weight:bold;text-shadow:#009CD6 2px 0 6px;}
                #imageModal{
                    position:fixed;
                    z-index:9999;
                    display:none;
                    cursor:pointer;
                    pointer-events:none;
                }
                #imageModalImage{
                    box-shadow:0px 0px 10px rgba(0,0,0,0.8);
                    border:2px solid #333;
                    pointer-events:auto;
                }
            `;
            GM_addStyle(customStyles);
        },

        applyBaseStyles() {
            const baseStyles = `
                .custom_ygg{vertical-align:middle}
                .promo-container{display:none!important}
                #imageModal{
                    position:fixed;
                    z-index:9999;
                    display:none;
                    cursor:pointer;
                    pointer-events:none;
                }
                #imageModalImage{
                    box-shadow:0px 0px 10px rgba(0,0,0,0.8);
                    border:2px solid #333;
                    pointer-events:auto;
                }
            `;
            GM_addStyle(baseStyles);
        }
    };

    // ============================
    // INITIALIZATION
    // ============================
    
    // Apply styles immediately (before DOM is ready) for faster dark theme
    if (CONFIG.BETTER_DARK_THEME) {
        Styles.applyDarkTheme();
    } else {
        Styles.applyBaseStyles();
    }

    async function init() {
        const url = window.location.href;
        const isForum = url.indexOf("/forum/") > -1;

        // Add meta tag to avoid referrer warnings
        if (document.head) {
            const metaReferrer = document.createElement('meta');
            metaReferrer.name = 'referrer';
            metaReferrer.content = 'no-referrer';
            document.head.appendChild(metaReferrer);
        }

        if (!isForum) {
            // Main site features
            if (CONFIG.LOGIN_AUTOMATICALLY) {
                await LoginManager.handleLogin();
            }

            if (CONFIG.DOWNLOAD_BUTTONS_IN_RESULTS) {
                SiteFeatures.addDownloadButtons();
            }

            if (CONFIG.HIDE_SIDEBAR) {
                SiteFeatures.hideSidebar();
            }

            if (CONFIG.LARGER_NFO) {
                SiteFeatures.displayLargerNfo();
            }

            if (CONFIG.SEARCH_BY_LATEST_FIRST) {
                SiteFeatures.searchByLatestFirst();
            }

            if (CONFIG.KEEP_SEARCH_WHEN_CLICKING_ON_SUBCATEGORY_ICON) {
                SiteFeatures.keepSearchWhenClickingOnSubcategory();
            }

            // Calculate upload/download delta
            if (typeof $ !== 'undefined') {
                $(document).ready(() => {
                    SiteFeatures.calculateDelta();
                });
            }

            // Image preview
            if (CONFIG.PREVIEWS_IMAGES_ON_HOVER) {
                const previewCookie = Utils.getCookie('ygg_preview');
                if (previewCookie === null || previewCookie === 'on') {
                    setTimeout(() => {
                        ImagePreview.init();
                    }, 600);
                }
            }

            // Handle logout
            const logoutLink = document.querySelector(SELECTORS.LOGOUT_LINK);
            if (logoutLink) {
                logoutLink.addEventListener('click', () => {
                    LoginManager.deleteCredentials();
                });
            }
        }
    }

    // Wait for DOM to be ready before running main features
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded, run immediately
        init();
    }

})();
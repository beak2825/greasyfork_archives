// ==UserScript==
// @name        TSR - Freemium
// @description Access some Subscriber/VIP functionality.
// @author      Drawbackz
// @namespace   The Sims Resource
// @exclude     *wiki.thesimsresource.com/*
// @exclude     *forums.thesimsresource.com/*
// @exclude     *thesimsresource.com/account/logout/*
// @exclude     *thesimsresource.com/mytsr/*
// @include     http://*thesimsresource.com/*
// @include     https://*thesimsresource.com/*
// @require		https://greasyfork.org/scripts/30051-loose-content-injector/code/Loose%20Content%20Injector.js?version=243876
// @run-at      document-start
// @version     3.1.7r
// @grant       none
// @compatible  firefox Tampermonkey Only
// @compatible  chrome
// @compatible  opera
// @incompatible safari Nope
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/391358/TSR%20-%20Freemium.user.js
// @updateURL https://update.greasyfork.org/scripts/391358/TSR%20-%20Freemium.meta.js
// ==/UserScript==
/*
* Disclaimer
* Last updated: April 09, 2018
* This user script is intended for informational/educational purposes only.
* In no event shall the author be liable for any special, direct, indirect, consequential, or incidental damages or any damages whatsoever, whether in an action of contract, negligence or other tort, arising out of or in connection with the use of or the contents of this user script.
* The author reserves the right to make additions, deletions, or modification to the contents of the user script at any time without prior notice.
*/

var cookieManager = null;
var freemium = null;
var support = null;

//region Launcher

(function () {
    if (window.location.href.indexOf('facebookLogin') > -1) {
        return;
    }
    if (!document.hasFocus()){
        document.onfocus = () => {
            window.location = window.location;
        }
    }
    cookieManager = new CookieManager();
    freemium = new TSR_Freemium();
    console.log("--> TSR Freemium " + GM_info.script.version + " <--");

    if(freemium.isUpdate()){
        freemium.applyUpdate();
        return;
    }
    freemium.inject();
})();

//endregion

function TSR_Freemium() {

    var instance = this;

    var injector = new LooseContentInjector("TSR Freemium", 10);
    var loginGenuine = cookieManager.getCookie('MemberID') !== '' && cookieManager.getCookie('MemberID') != '0';

    injector.addContentItem(junkRemovalContent());
    injector.addContentItem(userEscalationContent());
    injector.addContentItem(premiumStyleContent());
    injector.addContentItem(loginEnablerContent());
    injector.addContentItem(quickViewFixContent());

    if (loginGenuine) {
        injector.addContentItem(basketContent());
    }

    this.isUpdate = function () {
        return freemium.version() !== GM_info.script.version;
    };
    this.applyUpdate = function () {
        localStorage.setItem('trs-freemium-version', GM_info.script.version);
        console.clear();
        console.log('TSR Freemium Updated.');
        if(loginGenuine){
            instance.logoutUser();
            return;
        }
        window.location.reload();
    };
    this.logoutUser = function () {
        localStorage.memberId = 0;
        localStorage.LoginKey = 0;
        localStorage.cachedDate = 0;
        cookieManager.clear();
        console.clear();
        window.location.reload();
    };
    this.version = function () {
        return localStorage.getItem('trs-freemium-version');
    };
    this.inject = function () {
        if (injector.isComplete()) {
            injector.reset();
        }
        injector.inject(function (success) {
            if (success) {
                console.log('TSR Freemium: Ready!');
            }
            else {
                console.log('TSR Freemium:' + injector.lastError);
            }
        });
    };

    //region Misc


    function varExists(obj) {
        return typeof(obj) !== 'undefined';
    }

    function foSho() {
        return true;
    }

    //endregion
    //region Content Items
    function junkRemovalContent() {

        //region Private Members
        var injected = false;

        var originalCookieHandler = null;
        var junkScriptSources = [

            'monetizemore',
            'pubmatic',
            'glam',
            'glm',
            'pagefair',
            'quantserve',
            'moatads',
            'google',
            'morpheus',
            'sonobi',
            'scorecardresearch',
            'analytics',
            'pq-direct',
            'cloudfront',
            'adsystem',
            'doubleclick',
            'quant',
            'tynt.com',
            'quantcount',
            'm2d.m2.ai',
            'moatads',
            'secure.adnxs',
            'sekindo',
            'securepubads'

        ];
        var junkInlineScripts = [

            '//Start DFP code sync DFP',
            'var forceLogout = false;',
            'var src = \'/css/merge/page/nonsubscriber.css\';',
            'if(!isVIP()) sbi_morpheus.setKeys();',
            'forceLogout || !isVIP()',
            'var gaPageName = \'\';',
            'function async_load',
            'var _qevents',
            'glam_affiliate_id',
            'window.displayAd',
            'var src = \'/css/merge/page/nonsubscriber.css\'',
            'moatads'

        ];
        //endregion
        //region Private Methods
        function monitorDomInsertion() {
            window.addEventListener('DOMNodeInserted', processElement, true);
        }

        function monitorScriptExecution() {
            window.addEventListener('beforescriptexecute', processElement, true);
        }

        function monitorDomLoaded() {
            window.addEventListener('DOMContentLoaded', cleanPage, true);
        }

        function cleanPage(args) {
            try {

                $('.ad-topleader').remove();
                $('.ad-bottomleader').remove();

                $.cookie("m2dEnabled", false);

                m2hb.adUnits = [];
                m2hb.initAdserver = function () {
                };
                window.initM2H = function () {
                };

                window.enabledAnalytics = false;
                window.ga.create = function () {
                };

                window.onAdsLoaded = function () {
                };
                window.displayAd = function (ele) {
                };
            }
            catch (e) {
            }
        }

        function processCookie(name, value, options) {
            console.log('Name: ' + name);
            console.log('Value: ' + value);
            console.log('Options:');
            console.log(options);

            originalCookieHandler(name, value, options);
        }

        function processElement(e) {

            if (e.target.src !== undefined) {

                for (var i = 0; i < junkScriptSources.length; i++) {
                    if (e.target.src.indexOf(junkScriptSources[i]) > -1) {
                        e.preventDefault();
                        e.stopPropagation();
                        e.target.remove();
                        return;
                    }
                }
            }
            else {
                if (e.target.text !== undefined) {
                    for (var j = 0; j < junkInlineScripts.length; j++) {
                        if (e.target.text.indexOf(junkInlineScripts[j]) > -1) {
                            e.stopPropagation();
                            e.preventDefault();
                            e.target.remove();
                            return;
                        }
                    }
                }
            }
            $('#mySpring').remove();
        }

        //endregion
        //region Content Item Creation
        var contentItem = new injector.CreateContentItem('Junk Remover');
        contentItem.canInject = function () {
            return true;
        };
        contentItem.isInjected = function () {
            return injected;
        };
        contentItem.inject = function () {

            document.write = function (junk) {
            };
            window.isVIP = function () {
                return true;
            };
            window.googletag = {
                cmd: {
                    push: function (ele) {
                    }
                }
            };

            monitorDomLoaded();
            monitorDomInsertion();
            monitorScriptExecution();

            injected = true;
        };
        //endregion
        return contentItem;
    }

    function userEscalationContent() {
        //region Content Item Creation
        var contentItem = new injector.CreateContentItem('User Escalation', false, 10, 1000);
        contentItem.canInject = function () {
            return varExists(window.isSubscriber) && varExists(window.isVIP) && varExists(window.isLoggedIn) && varExists(window.auth_isLoggedIn);
        };
        contentItem.isInjected = function () {
            if (contentItem.canInject()) {
                return window.isSubscriber() && window.isVIP() && window.auth_isLoggedIn() && window.isLoggedIn();
            }
            return false;
        };
        contentItem.inject = function () {
            localStorage.subscriptionLevel = 2;
            window.isSubscriber = foSho;
            window.isVIP = foSho;
            window.auth_isLoggedIn = foSho;
            window.isLoggedIn = foSho;
        };
        //endregion
        return contentItem;
    }

    function premiumStyleContent() {
        //region Members
        var injected = false;
        //endregion
        //region Content Item Creation
        var contentItem = new injector.CreateContentItem('Premium Style', false, 10);
        contentItem.canInject = function () {
            return document.getElementsByTagName('body')[0] !== undefined;
        };
        contentItem.isInjected = function () {
            return injected;
        };
        contentItem.inject = function () {
            var head = $('head');
            head.prepend('<style>.notloggedin, .nonsubscriber, body .top-300-ad, .no-sub-button, .vip-link, body .ad-alsorectangle, body .ad-browse-rectangle, body .ad-bottomleader, body .ad-midleader, .sitemenu .not-logged-in, body .ad-topleader, .siteskin, .dl-menuwrapper .not-logged-in, .footer-glam, body .rectangle-1, .medianet { display: none !important; } .big-download-buttons, .file-data-index, .sub-button { display: block; } .iloggedin { display: inline-block; } .sitemenu .logged-in-account, .sitemenu .has-basket { display: inline-block; } .no-right-margin { margin-right: 0; } .big-data { top: 0; } .file-data-profile { border: 0; padding: 0; position: relative; } .big-data-profile { position: relative; float: left; } .big-download-profile { position: relative; bottom: auto; margin-top: 44px; border-top: 1px dotted #b7b7b7; padding-top: 20px; } #pushdown { display: none; } .wrapper { padding-top: 20px; margin-top: 0; } .mid-wrapper { padding-top: 0; margin-top: -30px !important; } .index-wrapper { position: relative; top: -20px; margin-top: 0 !important; } #updates { margin-top: 0; } #footer-stats { width: auto; } #footer-legal { width: 100%; } @media(min-width: 320px) and (max-width: 500px) { .big-info { height: 210px !important; margin-bottom: 30px !important; } .details .bsk, .big-info .bsk { display: block !important; width: 300px !important; margin: 0 !important; top: 0 !important; } .admin-link { top: -452px !important; right: 0 !important; } .index-page .big-info .button { top: 210px; } .index-page .big-info .bsk { top: 48px !important; } .index-page .big-info { height: 262px !important; } .profile-avatar { top: 40px !important; } .wrapper { padding-top: 10px; } .big-download-buttons strong { bottom: 505px !important; } .big-download-buttons { bottom: 45px; } .big-download-buttons .admin-link { top: -387px !important; right: -45px !important; } }  </style>');
            head.prepend('<style>.top-300-ad{ display: none !important; } .ad-browse-rectangle.hide { display: none !important; } .ad-topleader { display: none !important; height: 0px !important; position: absolute !important; } </style>');
            $('.top-300-ad').remove();
            injected = true;
        };
        //endregion
        return contentItem;
    }

    function loginEnablerContent() {
        //region Content Item Creation
        var contentItem = new injector.CreateContentItem('Login Enabler');
        contentItem.canInject = function () {
            return window.document.getElementsByClassName('sitemenu clearfix')[0] !== undefined && typeof window.logout !== 'undefined' && window.document.getElementsByTagName('head').length > 0;
        };
        contentItem.isInjected = function () {
            return window.document.getElementById('freemium-login-button') !== null;
        };
        contentItem.inject = function () {

            window.logout = function () {

                $.ajax({
                    url: '/account/logout', data: {ajax: 1}, success: function (data) {
                        console.log("Logging out");
                        clearSession(false);
                        document.location.href = '/';
                    }, error: function (req, text) {
                        alert("Failed to log out");
                    }
                });

            };
            window.clearSession = function (clearAll) {
                localStorage.memberId = 0;
                localStorage.LoginKey = 0;
                localStorage.cachedDate = 0;
                $.cookie('LoginKey', null, {domain: '.thesimsresource.com', path: '/'});
                $.cookie('MemberID', null, {domain: '.thesimsresource.com', path: '/'});
            };

            $('.sitemenu.clearfix').append('<li id="freemium-login-menu-item"><span class="nav-divider"></span><a id="freemium-login-button" href="#">Log in</a></li>');

            if (loginGenuine) {
                var loginButton = $('#freemium-login-menu-item');
                loginButton.hide();
            }
            else {
                $('.has-basket').hide();
                $('.logged-in-account').hide();
                $('.not-logged-in').hide();
                $('.button-submit').hide();
                $('head').prepend('<style> .bsk{display: none !important;} </style>');
            }
        };
        contentItem.callback = function (item) {
            if (!item.isFailed()) {
                document.getElementById('freemium-login-button').onclick = function () {
                    $('.loginBtn').click();
                };
            }
        };
        //endregion
        return contentItem;
    }

    function quickViewFixContent() {
        //region Members
        var injected = false;
        //endregion
        //region Content Item Creation
        var contentItem = new injector.CreateContentItem('Quick View Fix');
        contentItem.canInject = function () {
            return varExists(window.doQuickView);
        };
        contentItem.inject = function () {
            window.doQuickView = function (link, id, category) {
                if (link === true) {
                    return 1;
                }
                if (!isSubscriber())
                    return (true);
                if (isSubscriber()) {
                    if (prevLink)
                        prevLink.removeClass('active');
                    var browse_file = $(link).parent().parent();
                    $(browse_file).addClass('active');
                    prevLink = $(browse_file);
                    if (!$(browse_file).hasClass('browse-file')) {
                        return;
                    }
                    while (browse_file.attr('data-expand-after') != '1') {
                        browse_file = browse_file.next();
                        if (!browse_file) break;
                    }
                    var quickviewElement = null;
                    var previousQuickviewElement = null;
                    var dataId = browse_file.attr('data-id');
                    for (var i = 0; i < quickviewElements.length; i++) {
                        if (quickviewElements[i].dataId == dataId) {
                            quickviewElement = quickviewElements[i].element;
                        }
                        if (quickviewElements[i].dataId == lastDataId) {
                            previousQuickviewElement = quickviewElements[i].element;
                        }
                    }
                    if (!quickviewElement) {
                        quickviewElement = $(document.createElement('div'));
                        quickviewElements.push({dataId: dataId, element: quickviewElement});
                    }
                    browse_file.after(quickviewElement);
                    var pmin = 0;
                    if (lastDataId != dataId) {
                        quickviewElement.css({
                            background: 'white',
                            height: '0px',
                            width: '100%',
                            float: 'left',
                            marginBottom: '20px'
                        });
                        quickviewElement.html('<span style="margin:30px;" ><img style="margin-right:10px;" src="/images/v9/ajax-loader.gif" />Loading...</span>');
                        quickviewElement.show();
                        quickviewElement.animate({height: qvHeight + "px"}, 200);
                        if (previousQuickviewElement) {
                            $(previousQuickviewElement).slideUp(200,
                                function () {
                                    scrollToQuickView();
                                    $(previousQuickviewElement).hide();
                                    pmin = -qvHeight;
                                    sendQuickViewRequest(id, category, quickviewElement);
                                    lastDataId = browse_file.attr('data-id');
                                }
                            );
                            return false;
                        }
                    }
                    sendQuickViewRequest(id, category, quickviewElement);
                    lastDataId = browse_file.attr('data-id');
                }
                return (false);
            };
            injected = true;
        };
        contentItem.isInjected = function () {
            return injected;
        };
        //endregion
        //region Private Methods
        function sendQuickViewRequest(id, category, quickviewElement) {
            $.get('/downloads/quickview/category/' + category + '/id/' + id).done(function (r) {

                scrollToQuickView();

                window.$(quickviewElement).html(r);
                window.$(quickviewElement).find('.magnific-gallery-image').magnificPopup({
                    type: 'image',
                    gallery: {
                        enabled: true
                    }
                });
                $('.flexslider').flexslider({
                    animation: "slide"
                });
                window.initSmilies();
                window.initDlButtons();


            }).fail(function () {
                console.log("Quickview request failed..");
            });
        }

        function scrollToQuickView() {
            var ele = document.getElementsByClassName('browse-file active')[0];
            var offset = ele.offsetTop + ele.offsetHeight;
            $("html, body").animate({scrollTop: offset}, 200);
        }

        //endregion
        return contentItem;
    }

    function basketContent() {
        //region Members
        var injected = false;
        var currentSimsVersion = null;
        var lastBasketItemCount = parseInt(localStorage.basketCount);
        var basketDownloader = null;
        //endregion
        //region Content Item Creation
        var contentItem = new injector.CreateContentItem('Download Basket');
        contentItem.canInject = function () {
            return loginGenuine && varExists(document.getElementById('md-content')) && varExists(window.showbasket) && varExists(window.initBasket) && varExists(window._dl) && varExists(removeSelectedFromBasket);
        };
        contentItem.isInjected = function () {
            return injected;
        };
        contentItem.inject = function () {

            window.initBasket = function () {
            };

            basketDownloader = new BasketDownloader();

            window.removeSelectedFromBasket = function (form) {
                $.post("/downloads/basket/", form.serialize(), function () {
                    $('.basketcheckbox').each(function (i, o) {
                        if (o.checked) {
                            $('#basketitem_' + o.value).remove();
                            localStorage.basketCount--;
                        }
                        updatePageSessionData();
                    });
                    resetBasket();
                });
                return false;
            };

            window.showbasket = function () {

                $('#md-modal').show();
                $('#md-overlay').show();

                $.ajax({
                    url: "/downloads/basket", data: {ajax: 1}, success: function (req, text) {
                        $().fancyModal({title: 'Download basket', data: req, width: 680, height: 696});
                        $('#zipdla').hide();
                        $('#basketFormDownloadRemoveAll').hide();
                        $('#basketForm').append('<div id="basket-downloader-button" class="button input-button pull-left">Download Basket</div>');
                        document.getElementById('basket-downloader-button').onclick = basketDownloader.download;
                    }, error: function (req, text) {
                        console.log("Failed to load basket: " + req.responseText);
                        if (req.responseText.match(/nosession/)) {
                            //console.log("Clear session and reload");
                            clearSession(false);
                            document.location.reload();
                        }
                    }
                });

            };

            window._dl = function (itemid, format, callback, extraInfo) {

                var mid = typeof(localStorage.memberId) !== 'undefined' ? localStorage.memberId : 0;
                var lk = typeof(localStorage.LoginKey) !== 'undefined' ? localStorage.LoginKey : 0;
                var ex = '';

                if (typeof(extraInfo) !== 'undefined') ex = '&ex=1';

                var ajxc = '/ajax.php?c=downloads&a=getdownloadurl&ajax=1&itemid=' + itemid + '&mid=' + mid + '&lk=' + lk + ex;

                $.ajax(ajxc).done(function (data) {
                    if (data.error.length > 0) {
                        if (data.logout)
                            logout();
                    } else {
                        if (typeof(callback) !== 'undefined')
                            callback(data.url, data.data); else
                            document.location.href = data.url;
                    }
                }).fail(function (err) {
                    console.log("Error in _dl");
                    console.log(err);
                });

            };

            injected = true;
        };
        //endregion
        //region Private Methods
        function BasketDownloader() {

            (function () {
                var originalHandler = window.bindEvents;
                window.bindEvents = function () {
                    originalHandler();
                    var ele = $('body');

                    ele.off('click', '.bsk');

                    ele.on('click', '.bsk', function (e) {
                        localStorage.basketContents = "";
                        var itemId = $(this).attr('itemid');

                        var btn = $(this);
                        var basketBtn = $(this.parentNode).find('.dl.okletsdothis');
                        var tsrAppBtn = $(this.parentNode).find('.hideme.tsrinstall');
                        var ele = this;


                        $.ajax({
                            url: '/downloads/addtobasket/itemId/' + itemId,
                            dataType: 'json',
                            success: function (data) {
                                if (!data.error) {
                                    $("#basketnr").text(data.basketcount);
                                    localStorage.basketCount = data.basketcount;
                                    if (localStorage.basketCount > 0) {
                                        $('#top_basket').addClass('on');
                                    }
                                    localStorage.basketContents = "#" + (localStorage.basketContents !== "" ? "," : "") + itemId + "#";
                                    btn.addClass('bskon');
                                }
                                if (data.message === "Item added!" || data.message === "This item is already in the basket.") {
                                    if (ele.childNodes.length > 1) {
                                        btn.css('background-color', '#89af26');
                                        ele.childNodes[1].data = 'Added!';

                                        btn.animate({
                                            opacity: 0.50
                                        }, 1000);
                                        basketBtn.animate({
                                            opacity: 0.50
                                        }, 1000);
                                        tsrAppBtn.animate({
                                            opacity: 0.50
                                        }, 1000);
                                        btn.prop("disabled", true);
                                    }
                                }
                                else {
                                    data.message = data.message.replace("<br />", "\r\n");
                                    alert(data.message);
                                    ele.childNodes[1].data = 'Conflict!';
                                    btn.css('background', 'transparent');
                                    btn.css('background-color', 'yellow');
                                    btn.css('color', 'black');
                                }
                            },
                            error: function (f, e, l) {
                                alert('TSR Freemium: An unknown Basket Error occurred.');
                                ele.childNodes[1].data = 'Error!';
                                btn.css('background', 'transparent');
                                btn.css('background-color', 'black');
                                btn.css('color', 'red');
                            }
                        });
                    });
                };
            })();

            var overlayStyle = '<style>#freemium-progress-bar { height: 25px; background-color: #94be29; text-align: center; line-height: 25px; color: white; } #freemium-basket-downloader-pb { width: 100%; background-color: black; } #freemium-basket-cancel-btn{ display:block; width:100%; margin-bottom: 10px; margin-top: 5px; } #freemium-basket-downloader{ background-color:transparent ; height: 100%; width:100%; } .freemium-basket-downloader-row{ margin-bottom:15px; margin-top:10px; } #freemium-download-percentage{ position:absolute; left:0; right:0; } .md-content{ margin-top:5%; box-shadow: 0px 0px 5px 0px; }';
            var downloadOverlay = '<div id="freemium-basket-downloader" style="display: none"> <div class="freemium-basket-downloader-row"><img style="margin-right:10px;" src="/images/v9/ajax-loader.gif" />Downloading items...</div> <div class="freemium-basket-downloader-row"><div id="freemium-basket-downloader-current-file"></div></div> <div class="freemium-basket-downloader-row"> <div id="freemium-basket-downloader-pb"> <div id="freemium-progress-bar"></div> </div> <input type="button" id="freemium-basket-cancel-btn" onclick="window.cancelBasketDownload();" value="Cancel"> </div> </div>';

            $('head').append(overlayStyle);

            var totalDownloads = 0;
            var downloaded = 0;
            var canceled = false;
            window.cancelBasketDownload = function () {
                canceled = true;
                closeBasket();
            };

            var basketDownloading = false;
            var basketItems = [];
            var basketDownloaded = null;

            function reset() {
                totalDownloads = 0;
                downloaded = 0;
                canceled = false;
            }

            function downloadBasket(completedCallback) {

                if (basketDownloading) {
                    return;
                }

                reset();
                basketDownloading = true;
                basketDownloaded = completedCallback;
                $('#md-content').append(downloadOverlay);

                var basket = $('.basketcheckbox');
                for (var i = 0; i < basket.length; i++) {
                    basketItems.push(basket[i].getAttribute('value'));
                    totalDownloads++;
                }
                if (totalDownloads > 0) {
                    showDownloader(true);
                    startDownloadLoop();
                    updateDownloadProgress(0);
                }
            }

            function startDownloadLoop() {

                if (canceled) {
                    return;
                }

                if (basketItems.length > 0) {
                    var popped = basketItems.pop();
                    window._dl(popped, null, function (url, data) {
                        updateCurrentFile(popped);
                        downloadFile(url);
                        removeBasketItem(popped);
                        setTimeout(startDownloadLoop, 1500);
                    });
                }
                else {
                    basketDownloading = false;
                    if (typeof basketDownloaded === 'function') {
                        basketDownloaded();
                    }
                    $('#md-modal').hide();
                    $('.md-overlay').hide();
                    var percentage = ((downloaded / totalDownloads) * 100).toFixed(2);
                    updateDownloadProgress(percentage);
                    setTimeout(function () {
                        showDownloader(false);
                    }, 2500);
                }
            }

            function showDownloader(visible) {
                if (visible) {
                    $('.basket-wrap').slideUp(500, function () {
                        $('#freemium-basket-downloader').slideDown(500);
                    });
                }
                else {
                    $('#freemium-basket-downloader').slideUp(500, function () {
                        $('.basket-wrap').slideDown(500);
                    });
                }
            }

            function downloadFile(url) {
                window.location.assign(url);
                updateDownloadProgress((downloaded / totalDownloads) * 100);
                downloaded++;
            }

            function removeBasketItem(id) {
                $('#basketitem_' + id + ' .basketcheckbox').click();
                $('#basketRemoveSelectedBtn').click();
            }

            function updateDownloadProgress(percentage) {
                var ele = document.getElementById("freemium-progress-bar");
                var width = percentage + '%';
                ele.style.width = width;
                ele.innerHTML = '<div id="freemium-download-percentage">' + width + '</div>';
            }

            function updateCurrentFile(statusTxt) {
                document.getElementById('freemium-basket-downloader-current-file').innerHTML = "Current File (ID#): " + statusTxt;
            }

            this.download = downloadBasket;
        }

        function closeBasket() {
            $(".icon-close.md-close").click();
            basketVisible = false;
        }

        //endregion
        return contentItem;
    }

    //endregion
}
function CookieManager() {

    this.addCookie = addCookie;
    this.getCookie = getCookie;
    this.updateCookies = updateCookies;
    this.clear = function () {
        var cookies = document.cookie.split("; ");
        for (var c = 0; c < cookies.length; c++) {
            var d = window.location.hostname.split(".");
            while (d.length > 0) {
                var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                var p = location.pathname.split('/');
                document.cookie = cookieBase + '/';
                while (p.length > 0) {
                    document.cookie = cookieBase + p.join('/');
                    p.pop();
                }
                ;
                d.shift();
            }
        }
    };

    function addCookie(id, value) {

        window.document.cookie = id + '=' + value;

    }

    function getCookie(cname) {
        var name = cname + '=';
        var ca = window.document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    function getCookies() {
        return window.document.cookie;
    }

    function updateCookies(cookieDictionary) {

        var updates = 0;

        for (var i in cookieDictionary) {

            if (cookieDictionary.hasOwnProperty(i)) {

                if (getCookie(i) === '0' || getCookie(i) === '') {
                    addCookie(i, cookieDictionary[i]);
                    updates++;
                }

            }
        }

        if (updates > 0) {
        }
        else {
        }

    }
}

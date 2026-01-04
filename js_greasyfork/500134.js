// ==UserScript==
// @name         Torn Spy Integration
// @namespace    tornspy-integration
// @version      0.8
// @description  Adds Torn Spy integration to Torn.
// @author       Neodork
// @match        https://www.torn.com/*
// @connect      www.tornspy.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/500134/Torn%20Spy%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/500134/Torn%20Spy%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DOMAIN = 'https://www.tornspy.com';
    const TORN_SPY_KEY = 'tspy-key';
    const MINI_PROFILE_BREAKDOWN = 'tspy-mini-bd';
    const PAYMENT_TRACKER = 'tspy-ptrack';
    const SPY_TRACKER = 'tspy-strack';

    /**
     * Global functions
     */
    const setPermissions = (permissions) => {
        GM_setValue('permissions', permissions)
    }

    const hasPermission = (permission) => {
        return GM_getValue('permissions')[permission] ?? false;
    }

    const purchase = (step, id, money, tag, theanon, callback) => {
        getAction({
            type: "post",
            action: "/sendcash.php",
            data: {
                step: step,
                ID: id,
                money: money,
                tag: tag,
                theanon: theanon
            },
            success: callback
        })
    };

    const spy = (id, specialId, amount, usersId, callback) => {
        ajaxWrapper({
            url: 'companies.php?step=specialgo',
            type: 'POST',
            data: [
                {name: 'ID', value: id},
                {name: 'specialid', value: specialId},
                {name: 'amount', value: amount},
                {name: 'usersID', value: usersId},
            ],
            oncomplete: callback
        });
    };

    const waitForElement = (selector) => {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    const initializeTornTooltip = (tooltipElements) => {
        initializeTooltip(tooltipElements, 'white-tooltip', {
            position: {
                my: 'center bottom',
                at: 'center top-10',
                collision: 'fit',
                using: function(position, feedback) {
                    var $tooltipArrow = $('.tooltip-arrow');
                    var tipWidth = $tooltipArrow.width();
                    var target = feedback.target;
                    var el = feedback.element;
                    var targetCenter = target.left + target.width / 2;
                    var tooltipCenter = el.left + el.width / 2;
                    if (targetCenter < tooltipCenter) {
                        $tooltipArrow.css('left', (targetCenter - (tipWidth / 6)) + 'px');
                    } else {
                        $tooltipArrow.css('left', (targetCenter - el.left) + 'px')
                    }
                    $(this).css(position);
                    $(this).addClass(feedback.vertical).addClass(feedback.horizontal);
                }
            },
            create: function () {
                $(this).data("title", $(this).attr('title'));
            },
            content: function () {
                return "<div class='tooltip-arrow bottom left'></div><div>" + $(this).data('title') + "</div>";
            }
        });
    }

    const initializeTornItemInfo = () => {
        document.querySelectorAll('.item-list>.item-weapon, .item-list>.item-armour').forEach((itemPlate) =>{
            let lastOpen = null;
            itemPlate.addEventListener("click", () => {
                document.querySelectorAll('[data-itemId]').forEach((itemDescription) =>{
                    if(itemDescription.dataset.itemid != itemPlate.dataset.armoury && itemDescription.classList.contains('d-none') == false){
                        itemDescription.classList.add('d-none')
                    }
                })
                if(document.querySelector('[data-itemId="'+itemPlate.dataset.armoury+'"]').classList.contains('d-none')){
                    document.querySelector('[data-itemId="'+itemPlate.dataset.armoury+'"]').classList.remove('d-none')
                }else{
                    document.querySelector('[data-itemId="'+itemPlate.dataset.armoury+'"]').classList.add('d-none')
                }
            });
        });
    }

    /**
     * Settings controls
     */
    const hasApiKey = () => {
        return GM_getValue(TORN_SPY_KEY)?.length > 16;
    }

    const getApiKey = () => {
        return GM_getValue(TORN_SPY_KEY);
    }

    const getMiniBreakdown = () => {
        return GM_getValue(MINI_PROFILE_BREAKDOWN) ?? true;
    }

    const getPaymentTracker = () => {
        return GM_getValue(PAYMENT_TRACKER) ?? true;
    }

    const hasPaymentTracked = (tag) => {
        return GM_getValue(`${PAYMENT_TRACKER}_${tag}`) ?? false;
    }

    /**
     * Profile page support: https://www.torn.com/profiles.php?XID=*
     */
    if(window.location.pathname === '/profiles.php' && hasApiKey()) {
        waitForElement('.medals-wrapper').then(()=> {
            profile(profile_id());
        });
    }

    const profile = (id) => {
        GM_xmlhttpRequest(
            {
                method: 'POST',
                url: `${DOMAIN}/userscripts/profile`,
                data: JSON.stringify({'xid': id}),
                responseType: 'json',
                headers: { 'TORNSPY-KEY': getApiKey() },
                onload: (response) => {
                    response = response.response ?? JSON.parse(response.responseText);

                    if(response.style){
                        GM_addStyle(response.style);
                    }

                    setPermissions(response.permissions)

                    profile_page(response)

                    initializeTornTooltip($('.bonus-attachment-icons, .view-info'))
                    initializeTornItemInfo()
                }
            }
        );
    };

    const profile_page = (response) => {
        if(document.querySelector('.buttons-list')) {
            response.buttons.forEach((button) =>{document.querySelector('.buttons-list').insertAdjacentHTML('beforeend', button)});
        }
        document.getElementById('profileroot').querySelector('.medals-wrapper').insertAdjacentHTML('beforeBegin', response.loadout);
        document.getElementById('profileroot').querySelector('.medals-wrapper').insertAdjacentHTML('beforeBegin', response.statBar);
        document.querySelectorAll('.tspy-sale').forEach((saleWrapper) => {
            if(saleWrapper.querySelector(".tspy-buy")){
                saleWrapper.querySelector(".tspy-buy").addEventListener("click", () => {
                    saleWrapper.querySelector(".tspy-latest").style.display = 'none';
                    saleWrapper.querySelector(".tspy-purchase").style.display = 'block';
                });
            }
            if(saleWrapper.querySelector(".tspy-cancel-btn")){
                saleWrapper.querySelector(".tspy-cancel-btn").addEventListener("click", () => {
                    saleWrapper.querySelector(".tspy-purchase").style.display = 'none';
                    saleWrapper.querySelector(".tspy-latest").style.display = 'block';
                });
            }
            if(saleWrapper.querySelector(".tspy-purchase-btn")) {
                if(hasPaymentTracked(saleWrapper.querySelector('.tspy-purchase-btn').dataset.tag)) {
                    saleWrapper.querySelector(".tspy-latest").style.display = 'none';
                    saleWrapper.querySelector(".tspy-complete").style.display = 'block';
                }
                saleWrapper.querySelector(".tspy-purchase-btn").addEventListener("click", (event) => {
                    saleWrapper.querySelector(".tspy-purchase-btn").disabled = true;
                    saleWrapper.querySelector(".tspy-purchase-btn").innerHTML = 'Sending payment...'
                    saleWrapper.querySelector(".tspy-cancel-btn").style.display = 'none';
                    purchase('cash1', event.target.dataset.target, event.target.dataset.price, event.target.dataset.tag, false, (response) => {
                        response = JSON.parse(response);
                        if(response.error){
                            saleWrapper.querySelector(".tspy-error").innerHTML = response.error.replace("area", '').replace('This', 'Buying reports');
                            saleWrapper.querySelector(".tspy-purchase").style.display = 'none';
                            saleWrapper.querySelector(".tspy-failure").style.display = 'block';
                        }else if(response.success === false){
                            saleWrapper.querySelector(".tspy-error").innerHTML = response.text.replace('<b>', '<b class="t-red">').replace('<b>', '<b class="t-green">');
                            saleWrapper.querySelector(".tspy-purchase").style.display = 'none';
                            saleWrapper.querySelector(".tspy-failure").style.display = 'block';
                        }else{
                            saleWrapper.querySelector(".tspy-purchase").style.display = 'none';
                            saleWrapper.querySelector(".tspy-complete").style.display = 'block';
                            if(getPaymentTracker()){
                                GM_setValue(`${PAYMENT_TRACKER}_${event.srcElement.dataset.tag}`, Date.now())
                            }
                        }
                    });
                });
            }
        });
    }

    const profile_id = () => {
        return (new URLSearchParams(window.location.search)).get('XID');
    }

    /**
     * Mini profile support.
     */
    if(hasApiKey() && getMiniBreakdown()){
        waitForElement('.profile-mini-root').then(()=> {
            waitForElement('div[class^="profile-mini-_userImage"]').then(() => {
                mini_profile(mini_profile_id());
                const observer = new MutationObserver((mutationList, observer) => {
                    if(document.getElementById('profile-mini-root').querySelector('div[class^="profile-mini-"]')){
                        waitForElement('div[class^="profile-mini-_userImage"]').then(() => {
                            mini_profile(mini_profile_id());
                        });
                    }
                });
                observer.observe(document.getElementById('profile-mini-root'), { childList: true });
            });
        });
    }

    const mini_profile = (id) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${DOMAIN}/userscripts/mini-profile`,
            data: JSON.stringify({'xid': id}),
            responseType: 'json',
            headers: { 'TORNSPY-KEY': getApiKey() },
            onload: (response) => {
                response = response.response ?? JSON.parse(response.responseText);
                setPermissions(response.permissions)
                const height = getComputedStyle(document.getElementById('profile-mini-root').querySelector('div[class^="profile-mini-_userProfileWrapper"]')).height;
                if(document.getElementById("profile-mini-root").querySelector('.icons') && response.statBar) {
                    document.getElementById("profile-mini-root").querySelector('.icons').insertAdjacentHTML('beforebegin', response.statBar);
                }
                if(document.getElementById("profile-mini-root").querySelector('.buttons-list')){
                    response.buttons.forEach((button) =>{document.getElementById("profile-mini-root").querySelector('.buttons-list').insertAdjacentHTML('beforeend', button)});
                }
                if(document.getElementById("profile-mini-root").querySelector('div[class^="profile-mini-_wrapper___"]')) {
                    // Allow the mini profile to scale larger than the set height.
                    document.getElementById("profile-mini-root").querySelector('div[class^="profile-mini-_wrapper___"]').style.maxHeight = 'fit-content';
                }
                // Adjust height of the mini profile.
                if(getComputedStyle(document.getElementById('profile-mini-root').querySelector('div[class^="profile-mini-_arrow"]')).bottom === '-8px' && response.statBar){
                    const adjustedHeight = getComputedStyle(document.getElementById('profile-mini-root').querySelector('div[class^="profile-mini-_userProfileWrapper"]')).height;
                    const heightDiff = adjustedHeight.replace('px', '') - height.replace('px', '');
                    const top = document.getElementById('profile-mini-root').querySelector('div[class^="profile-mini-_wrapper"]').style.top.replace('px', '')
                    document.getElementById('profile-mini-root').querySelector('div[class^="profile-mini-_wrapper"]').style.top = `${(top - heightDiff)}px`;
                }
            }
        });
    };

    const mini_profile_id = () => {
        return document.querySelector('a[class^="profile-mini-_linkWrap___"][class*=" profile-mini-_flexCenter___"][href^="/profiles.php?XID="]').href.replace('https://www.torn.com/profiles.php?XID=', '');
    };

    /**
     * Faction page support: https://www.torn.com/factions.php
     */
    if(window.location.pathname === '/factions.php' && hasApiKey() && !document.getElementById('tspy-view-bazaar')) {
        waitForElement('.content-title').then(()=> {
            waitForElement('.faction-profile').then(() => {
                waitForElement('.f-war-list.members-list').then(()=> {
                    faction_profile();
                });
            });
        });
    }

    var purchase_overview_loaded = false;
    var spy_overview_loaded = false;
    var activeTable = 'default';
    const faction_profile = (ids) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${DOMAIN}/userscripts/faction/profile`,
            data: JSON.stringify({'fid': faction_id()}),
            responseType: 'json',
            headers: { 'TORNSPY-KEY': getApiKey() },
            onload: (response) => {
                response = response.response ?? JSON.parse(response.responseText);
                setPermissions(response.permissions)

                if(response.style){
                    GM_addStyle(response.style);
                }

                document.querySelector('.faction-info-wrap.restyle.another-faction').insertAdjacentHTML('beforeBegin', response.actions);

                document.getElementById('tspy-spy-purchase-icon').addEventListener("click", (event) => {
                    if(purchase_overview_loaded){
                        toggle_active_table('purchase');
                        toggle_purchase_overview();
                        activeTable = activeTable!=='purchase'?'purchase':'default';
                    }
                    if(!purchase_overview_loaded){
                        purchase_overview_loaded = true;
                        document.getElementById('tspy-spy-purchase').innerHTML = 'Loading...';
                        purchase_overview_load();
                    }
                });

                document.getElementById('tspy-spy-spy-icon').addEventListener("click", (event) => {
                    if(spy_overview_loaded){
                        toggle_active_table('spy');
                        toggle_spy_overview();
                        activeTable = activeTable!=='spy'?'spy':'default';
                    }
                    if(!spy_overview_loaded){
                        spy_overview_loaded = true;
                        document.getElementById('tspy-spy-spy').innerHTML = 'Loading...';
                        spy_overview_load();
                    }
                });
            }
        });
    };

    const toggle_purchase_overview = () => {
        const tspyPurchaseHead = document.getElementById('tspy-purchase-thead');
        if(tspyPurchaseHead){
            tspyPurchaseHead.style.display = (tspyPurchaseHead.style.display ==='none')?'flex':'none';
        }

        document.querySelector('.f-war-list.members-list').querySelector('.table-body').querySelectorAll('.table-row').forEach((element) => {
            const spyPurchaseRow = element.querySelector('.tspy-purchase-row');

            element.querySelectorAll('.tspy-purchase-row').forEach((element)=>{
                element.style.display = (element.style.display)==='none'?'flex':'none';
            });
        });
    };

    const purchase_overview_load = () => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${DOMAIN}/userscripts/faction/purchase`,
            data: JSON.stringify({'mids': member_ids()}),
            responseType: 'json',
            headers: { 'TORNSPY-KEY': getApiKey() },
            onload: (response) => {
                response = response.response ?? JSON.parse(response.responseText);
                setPermissions(response.permissions)
                purchase_overview(response);
                purchase_overview_loaded = true;
            }
        });
    };

    const purchase_overview = (response) => {
        toggle_active_table('purchase');
        activeTable = activeTable!=='purchase'?'purchase':'default';
        document.getElementById('tspy-spy-purchase').innerHTML = 'Purchase reports';
        document.querySelector('.f-war-list.members-list').querySelector('ul.table-header').insertAdjacentHTML('beforeEnd', response.heading);
        document.querySelector('.f-war-list.members-list').querySelector('.table-body').querySelectorAll('.table-row').forEach((row) => {
            const responseRow = response.spyRows[row.querySelector('a[href^="/profiles.php?XID="]').href.replace('https://www.torn.com/profiles.php?XID=', '')]
            row.insertAdjacentHTML('beforeEnd', responseRow.purchase);
            const reportHash = row.querySelector('.tspy-purchase-btn')?.dataset.tag;
            if(reportHash && hasPaymentTracked(reportHash)){
                row.querySelector(`.tspy-cta`).style.display = 'none';
                row.querySelector(`.tspy-purchase-details`).style.display = 'none';
                row.querySelector(`.tspy-complete`).style.display = 'block';
            }
            if(reportHash){
                row.querySelector(`.tspy-sale-btn`).addEventListener("click", (event) => {
                    row.querySelector(`.tspy-cta`).style.display = 'none';
                    row.querySelector(`.tspy-purchase-details`).style.display = 'none';
                    row.querySelector(`.tspy-purchase`).style.display = 'block';
                });
                row.querySelectorAll(`.tspy-cancel-btn`).forEach((element) => {
                    element.addEventListener('click', (event) => {
                        row.querySelector(`.tspy-purchase`).style.display = 'none';
                        row.querySelector(`.tspy-cta`).style.display = 'block';
                        row.querySelector(`.tspy-purchase-details`).style.display = 'block';
                    })
                });
                row.querySelectorAll(`.tspy-purchase-btn`).forEach((element) => {
                    element.addEventListener('click', (event) => {
                        event.srcElement.disabled = true;
                        event.srcElement.innerHTML = 'Sending payment...'
                        row.querySelectorAll(`.tspy-cancel-btn`).forEach((element) => {
                            element.style.display = 'none';
                        });
                        purchase('cash1', event.srcElement.dataset.target, event.srcElement.dataset.price, event.srcElement.dataset.tag, false, (response) => {
                            response = JSON.parse(response);
                            if(response.error){
                                row.querySelector(`.tspy-purchase`).style.display = 'none';
                                row.querySelector(`.tspy-error`).innerHTML = response.error.replace("area", '').replace('This', 'Buying reports');
                                row.querySelector(`.tspy-failure`).style.display = 'block';
                            }else if(response.success === false){
                                row.querySelector(`.tspy-error`).innerHTML = response.text.replace('<b>', '<b class="t-red">').replace('<b>', '<b class="t-green">');
                                row.querySelector(`.tspy-purchase`).style.display = 'none';
                                row.querySelector(`.tspy-failure`).style.display = 'block';
                            }else{
                                row.querySelector(`.tspy-purchase`).style.display = 'none';
                                row.querySelector(`.tspy-complete`).style.display = 'block';
                                if(getPaymentTracker()){
                                    GM_setValue(`${PAYMENT_TRACKER}_${event.srcElement.dataset.tag}`, Date.now())
                                }
                            }
                        });
                    })
                });
            }
        });
    };

    const spy_overview_load = () => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${DOMAIN}/userscripts/faction/spy`,
            data: JSON.stringify({'mids': member_ids()}),
            responseType: 'json',
            headers: { 'TORNSPY-KEY': getApiKey() },
            onload: (response) => {
                response = response.response ?? JSON.parse(response.responseText);
                setPermissions(response.permissions)
                spy_overview(response);
                spy_overview_loaded = true;
            }
        });
    };

    const spy_overview = (response) => {
        toggle_active_table('spy');
        activeTable = activeTable!=='spy'?'spy':'default';
        document.getElementById('tspy-spy-spy').innerHTML = 'Spy';
        document.querySelector('.f-war-list.members-list').querySelector('ul.table-header').insertAdjacentHTML('beforeEnd', response.heading);
        document.querySelector('.f-war-list.members-list').querySelector('.table-body').querySelectorAll('.table-row').forEach((row) => {
            const userId = row.querySelector('a[href^="/profiles.php?XID="]').href.replace('https://www.torn.com/profiles.php?XID=', '');
            const responseRow = response.spyRows[userId]
            row.insertAdjacentHTML('beforeEnd', responseRow.spy);

            cachedSpyRecord(userId, row);

            row.querySelector(`.tspy-spy-btn`).addEventListener("click", (event) => {
                row.querySelector('.tspy-spy-btn').disabled = true;
                row.querySelector('.tspy-spy-btn').innerHTML = '...';
                spy(event.srcElement.dataset.id, event.srcElement.dataset.special, event.srcElement.dataset.amount, event.srcElement.dataset.spy, (response) => {
                    response = JSON.parse(response.responseText);

                    if(response.success === false){
                        updateSpyRecordError(response.text.replace("area", '').replace('This', 'Using your job special'), row);
                        return;
                    }

                    if(response.result.error){
                        updateSpyRecordError(response.result.error, row);
                        return;
                    }

                    row.querySelector('.tspy-spy-btn').disabled = false;
                    row.querySelector('.tspy-spy-btn').innerHTML = 'Spy';
                    updateSpyRecordView(
                        updateSpyRecord(response.result.msg, response.result.user, response.amount),
                        row
                    );
                    document.getElementById('tspy-spy-thead-amount').innerHTML = response.pointsLeft;
                    document.getElementById('tspy-spy-thead-amount').parentNode.style.display = 'block';
                });
            });
        });
    };

    const cachedSpyRecord = (userId, row) => {
        var record = GM_getValue(`${SPY_TRACKER}_${userId}`)
        if(!record){
            return;
        }

        record = JSON.parse(record);

        const difference = record.timestamp / 1000 - row.querySelector('.tspy-spy-details').dataset.timestamp;
        if(difference < 1){
            GM_deleteValue(`${SPY_TRACKER}_${userId}`);
            return;
        }

        updateSpyRecordView(record, row);
    };

    const updateSpyRecordError = (error, row) => {
        row.querySelector('.tspy-spy-btn').innerHTML = 'Oops!';
        row.querySelector('.tspy-spy-btn').classList.add('t-red');
        row.querySelector('.tspy-spy-btn').classList.remove('t-yellow');
        row.querySelector('.tspy-spy-btn').classList.remove('t-green');
        row.querySelector('.tspy-record-head').innerHTML = `<span class="t-red">Oops!</span> Something went wrong...`;
        row.querySelector('.tspy-record-body').innerHTML = `<span>${error}</span`;
        row.querySelector('.tspy-record-head-mobile').innerHTML = `<span class="t-red">Oops!</span>`;
        row.querySelector('.tspy-record-body-mobile').innerHTML = `<span class="t-red">${error}</span>`;

        row.querySelector('.tspy-record').style.display = 'flex';
        row.querySelector('.tspy-spy-details').style.display = 'none';
    };

    const updateSpyRecordView = (record, row) => {
        if(Object.keys(record.exposed).length > 3){
            row.querySelector('.tspy-spy-btn').classList.add("t-green")
            row.querySelector('.tspy-spy-btn').classList.remove("t-yellow")
            row.querySelector('.tspy-spy-btn').disabled = true;
            row.querySelector('.tspy-spy-btn').innerHTML = 'Full';
            row.querySelector('.tspy-record-head').innerHTML = `<span class="t-green">Full</span>`;
            row.querySelector('.tspy-record-body').innerHTML = `<span>${Object.keys(record.exposed).join(', ')}</span>`;
            row.querySelector('.tspy-record-head-mobile').innerHTML = `<span class="t-green">Full </span><div><strong>JP: </strong> ${record.pointsUsed}</div>`;
        }else{
            row.querySelector('.tspy-spy-btn').classList.add("t-yellow")
            row.querySelector('.tspy-spy-btn').classList.remove("t-green")
            row.querySelector('.tspy-record-head').innerHTML = `<span class="t-yellow">Partial</span>`;
            row.querySelector('.tspy-record-body').innerHTML = `<span>${Object.keys(record.exposed).join(', ')}</span>`;
            row.querySelector('.tspy-record-head-mobile').innerHTML = `<span class="t-yellow">Partial</span><div><strong>JP: </strong> ${record.pointsUsed}</div>`;
        }

        row.querySelector('.tspy-record').style.display = 'flex';
        row.querySelector('.tspy-spy-details').style.display = 'none';

        row.querySelector('.tspy-record-head').innerHTML = row.querySelector('.tspy-record-head').innerHTML + `<span> (${new Date(record.timestamp).toLocaleString('en-GB', { timeZone: 'UTC' })})<span> <strong>JP used: </strong> ${record.pointsUsed}`;
        row.querySelector('.tspy-record-body-mobile').innerHTML = `<span>${new Date(record.timestamp).toLocaleString('en-GB', { timeZone: 'UTC' })}<span>`;
    };

    const updateSpyRecord = (spyDetails, user, amount) => {
        var record = GM_getValue(`${SPY_TRACKER}_${user.userID}`);

        if(!record){
            record = {
                timestamp: Date.now(),
                exposed: {},
                pointsUsed: 0
            }
        }else{
            record = JSON.parse(record);
        }

        record.timestamp = Date.now();

        for (const [key, value] of Object.entries(spyDetails)) {
            if(['money', 'moneyshow'].includes(key)){
                continue;
            }

            if(value !== 'N/A'){
                record.exposed[key] = value;

            }
        }

        record.pointsUsed += parseInt(amount);

        GM_setValue(`${SPY_TRACKER}_${user.userID}`, JSON.stringify(record));

        return record;
    };

    const toggle_spy_overview = () => {
        const tspySpyHead = document.getElementById('tspy-spy-thead');
        if(tspySpyHead){
            tspySpyHead.style.display = (tspySpyHead.style.display ==='none')?'flex':'none';
        }
        document.querySelector('.f-war-list.members-list').querySelector('.table-body').querySelectorAll('.table-row').forEach((element) => {
            element.querySelectorAll('.tspy-spy-row').forEach((element)=>{
                element.style.display = (element.style.display)==='none'?'flex':'none';
            });
        });
    };

    const toggle_active_table = (targetTable) => {
        if(activeTable === targetTable){
            toggle_table();
            return;
        }

        if(activeTable === 'purchase'){
            toggle_purchase_overview();
        }else if(activeTable === 'spy'){
            toggle_spy_overview();
        }else{
            toggle_table();
        }
    };

    const toggle_table = () => {
        const memberIcons = document.querySelector('.f-war-list.members-list').querySelector('ul.table-header').querySelector('.member-icons');
        const position = document.querySelector('.f-war-list.members-list').querySelector('ul.table-header').querySelector('.position');
        const days = document.querySelector('.f-war-list.members-list').querySelector('ul.table-header').querySelector('.days');
        const status = document.querySelector('.f-war-list.members-list').querySelector('ul.table-header').querySelector('.status');
        const lvl = document.querySelector('.f-war-list.members-list').querySelector('ul.table-header').querySelector('.lvl');

        position.style.display = (position.style.display ==='none')?'flex':'none';
        days.style.display = (days.style.display ==='none')?'flex':'none';
        status.style.display = (status.style.display ==='none')?'flex':'none';

        if(!memberIcons.classList.contains('hide-mobile')){
            memberIcons.classList.add('hide-mobile');
            memberIcons.classList.add('hide-desktop');
        }else{
            memberIcons.classList.remove('hide-mobile');
            memberIcons.classList.remove('hide-desktop');
        }

        if(!lvl.classList.contains('hide-mobile')){
            lvl.classList.add('hide-mobile')
        }else{
            lvl.classList.remove('hide-mobile');
        }

        const memberRows = document.querySelector('.f-war-list.members-list').querySelector('.table-body').querySelectorAll('.table-row');
        memberRows.forEach((element) => {
            const memberIconsInline = element.querySelector('.member-icons');
            const positionInline = element.querySelector('.position');
            const daysInline = element.querySelector('.days');
            const statusInline = element.querySelector('.status');
            const lvl = element.querySelector('.lvl');

            positionInline.style.display = (positionInline.style.display ==='none')?'flex':'none';
            daysInline.style.display = (daysInline.style.display ==='none')?'flex':'none';
            statusInline.style.display = (statusInline.style.display ==='none')?'flex':'none';

            if(!memberIconsInline.classList.contains('hide-mobile')){
                memberIconsInline.classList.add('hide-mobile');
                memberIconsInline.classList.add('hide-desktop');
            }else{
                memberIconsInline.classList.remove('hide-mobile');
                memberIconsInline.classList.remove('hide-desktop');
            }

            if(!lvl.classList.contains('hide-mobile')){
                lvl.classList.add('hide-mobile')
            }else{
                lvl.classList.remove('hide-mobile');
            }
        });
    };

    const faction_id = () => {
        const id = (new URLSearchParams(window.location.search)).get('ID');
        if(id){
            return id;
        }

        if(document.getElementById('top-page-links-list').querySelector('a[href^="/page.php?sid=factionWarfare#/ranked/"]')){
            return document.getElementById('top-page-links-list').querySelector('a[href^="/page.php?sid=factionWarfare#/ranked/"]').href.replace('https://www.torn.com/page.php?sid=factionWarfare#/ranked/', '')
        }

        return document.querySelector('.forum-thread').href.replace('https://www.torn.com/forums.php#!p=forums&f=999&b=1&a=', '');
    }

    const member_ids = () => {
        const mids = [];
        document.querySelector('.f-war-list.members-list').querySelector('.table-body').querySelectorAll('.table-row').forEach((element)=>{
            mids.push(element.querySelector('a[href^="/profiles.php?XID="]').href.replace('https://www.torn.com/profiles.php?XID=', ''));
        })
        return mids;
    };

    /**
     * Settings page support: https://www.torn.com/preferences.php?tab=tornspy
     */
    if(window.location.pathname === '/preferences.php' && (new URLSearchParams(window.location.search)).get('tab') === 'tornspy'){
        waitForElement('.ui-tabs-nav').then(()=> {
            settings();
        });
    }

    const settings = (id) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: `${DOMAIN}/userscripts/settings`,
            responseType: 'json',
            onload: (response) => {
                response = response.response ?? JSON.parse(response.responseText);
                setPermissions(response.permissions)
                if(document.querySelector('.ui-tabs-nav')){
                    document.querySelector('#prefs-tab-menu').innerHTML = response.page;
                    document.querySelector('.prefs-tab-title').innerHTML = 'Torn Spy settings'
                    document.getElementById('tspy-apikey').value = getApiKey() ?? '';
                    document.getElementById('tspy-mini-bd-on').checked = getMiniBreakdown() ?? true;
                    document.getElementById('tspy-mini-bd-off').checked = !getMiniBreakdown() ?? false;
                    document.getElementById('tspy-payment-track-on').checked = getPaymentTracker() ?? true;
                    document.getElementById('tspy-payment-track-off').checked = !getPaymentTracker() ?? false;
                }
                if(document.getElementById('tspy-settings')){
                    document.getElementById('tspy-save-btn').addEventListener("click", () => {
                        if(document.getElementById('tspy-apikey').value.length <= 16){
                            document.getElementById('tspy-key-error').innerHTML = 'Oops! your key needs to be longer than 16 characters!';
                        }else{
                            document.getElementById('tspy-key-error').style.display = 'none';
                            GM_setValue(TORN_SPY_KEY, document.getElementById('tspy-apikey').value);
                        }
                        GM_setValue(MINI_PROFILE_BREAKDOWN, document.getElementById('tspy-mini-bd-on').checked);
                        document.getElementById('tspy-success').innerHTML = 'Settings updated!';
                    });
                    document.getElementById('tspy-reset-btn').addEventListener("click", () => {
                        GM_deleteValue(TORN_SPY_KEY);
                        GM_deleteValue(MINI_PROFILE_BREAKDOWN);
                        document.getElementById('tspy-apikey').value = '';
                        document.getElementById('tspy-success').innerHTML = 'Torn Spy integration settings reset!';
                    });
                }
                if(document.getElementById('tspy-ptrack-clear-btn')){
                    document.getElementById('tspy-ptrack-clear-btn').addEventListener("click", () => {
                        GM_listValues().forEach((value) => {
                            if(value.startsWith(`${PAYMENT_TRACKER}_`)){
                                GM_deleteValue(value);
                            }
                        })
                        document.getElementById('tspy-ptrack-message').innerHTML = 'Tracked payments cleared!'
                    });
                }
            }
        });
    };

    /**
     * Icon support
     */
    waitForElement('ul[class^="status-icons"').then(()=> {
        const icon = `<li id="tspy-icon" style="background-image:url('https://www.tornspy.com/assets/img/favicon.ico');"><a href="https://www.torn.com/preferences.php?tab=tornspy" aria-label="Torn Spy" tabindex="0" data-is-tooltip-opened="false"></a></li>`;
        document.querySelector('ul[class^="status-icons"').insertAdjacentHTML('beforeEnd', icon)

        const observer = new MutationObserver((mutationList, observer) => {
            if(document.querySelector('ul[class^="status-icons"').querySelector('#tspy-icon')){
                return;
            }

            document.querySelector('ul[class^="status-icons"').insertAdjacentHTML('beforeEnd', icon)
        });
        observer.observe(document.getElementById('sidebarroot'), { childList: true, subtree: true });
    });

    /**
     * No API key is set prompt.
     */
    if(!hasApiKey()){
        document.querySelector('.content-title').insertAdjacentHTML('afterEnd', `<div class="info-msg-cont green border-round m-top10">
		<div class="info-msg border-round">
			<i class="info-icon"></i>
			<div class="delimiter">
				<div class="msg right-round" role="alert" aria-live="polite">
					<ul><li>Torn Spy API key is not set, click <a class="t-blue h" href="preferences.php?tab=tornspy">here</a> to set your API Key!</li></ul>
				</div>
			</div>
		</div>
	</div>`);
    }


    /**
     * Attack / Loadout support
     */
    if(hasPermission('loadouts') && window.location.pathname === '/loader.php' && (new URLSearchParams(window.location.search)).get('sid') === 'attack') {
        waitForElement('#react-root').then(()=> {
            waitForElement('div[class^="playerWindow"').then(()=> {
                const fightButton = document.getElementById('react-root').querySelector('button[class^="torn-btn"')
                if(fightButton && fightButton.innerText === 'START FIGHT') {
                    fightButton.addEventListener("click", (event) => {
                        window.addEventListener("fetch-listener", sendLoadoutToTornspy);
                    });
                }
            });
        });

        function addFetchListener() {
            const originalFetch = unsafeWindow.fetch;
            unsafeWindow.fetch = async (url, init = {}) => {
                const response = await originalFetch(url, init);
                const clonedResponse = response.clone();

                clonedResponse.text().then((text) => {
                    window.dispatchEvent(new CustomEvent(`fetch-listener`, {
                        detail: {
                            url,
                            body: init.body || null,
                            response: text
                        }
                    }));
                }).catch(console.error);

                return response;
            };
        }
        addFetchListener()
    }

    function sendLoadoutToTornspy(event) {
        const payload = JSON.parse(event.detail.response)

        if(["started", "end"].includes(payload.DB?.attackStatus)){
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${DOMAIN}/userscripts/loadout/add`,
                data: JSON.stringify(mapAttackData(payload)),
                responseType: 'json',
                headers: { 'TORNSPY-KEY': getApiKey() },
                onload: (response) => {
                    response = response.response ?? JSON.parse(response.responseText);
                    setPermissions(response.permissions)
                    const title = document.querySelector('h4[class^="title"')
                    title.insertAdjacentHTML('afterend', response.status);
                }
            });
            window.removeEventListener("fetch-listener", sendLoadoutToTornspy);
        }
    }

    const mapAttackData = (attackDataPayload) => {
        return {
            fightId: attackDataPayload.DB.fightID,
            target: attackDataPayload.DB.defenderUser.userID,
            maxLife: attackDataPayload.DB.defenderUser.maxlife,
            modifiers: {
                strength: attackDataPayload.DB.defenderUser.statsModifiers.strength.value,
                speed: attackDataPayload.DB.defenderUser.statsModifiers.speed.value,
                dexterity: attackDataPayload.DB.defenderUser.statsModifiers.dexterity.value,
                defense: attackDataPayload.DB.defenderUser.statsModifiers.defense.value,
                damage: attackDataPayload.DB.defenderUser.statsModifiers.damage.value,
            },
            loadout: Object.entries(attackDataPayload.DB.defenderItems).flatMap(
                ([slot, data]) => data.item.map(item => ({
                    itemId: item.ID,
                    armoryId: item.armoryID,
                    ammoType: item.ammotype,
                    ammoPreference: item.equipSlot == '1' ? attackDataPayload.DB.defenderAmmoPreferences.primary :
                        item.equipSlot == '2' ? attackDataPayload.DB.defenderAmmoPreferences.secondary : 0,
                    upgrades: item.currentUpgrades?.map(upgrade => ({
                        upgradeId: upgrade.upgradeID,
                        icon: upgrade.icon
                    }))
                }))
            )
        }
    }
})();
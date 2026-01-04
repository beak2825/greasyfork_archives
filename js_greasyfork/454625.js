// ==UserScript==
// @name         TNT Collection
// @version      1.5.22
// @namespace    tnt.collection
// @author       Ronny Jespersen
// @description  TNT Collection of Ikariam enhancements to enhance the game
// @license      MIT
// @include      http*s*.ikariam.*/*
// @exclude      http*support*.ikariam.*/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/454625/TNT%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/454625/TNT%20Collection.meta.js
// ==/UserScript==

const VERSION_URL = "http://ikariam.rjj-net.dk/scripts/tnt.Collection/version.php";
const UPDATE_URL = "http://ikariam.rjj-net.dk/scripts/tnt.Collection/update.php";
const UPDATE_HQ_URL = "http://lazy.rjj-net.dk/tnt/ikariam/hq/update";

const validBuildingTypes = [
    'townHall', 'palace', 'palaceColony', 'warehouse', 'wall', 'barracks',
    'shipyard', 'port', 'academy', 'museum', 'temple', 'embassy', 'branchOffice',
    'workshop', 'safehouse', 'carpentering', 'architect', 'vineyard', 'optician',
    'fireworker', 'forester', 'stonemason', 'winegrower', 'glassblowing', 'alchemist',
    'dump', 'tavern', 'blackMarket', 'pirateFortress', 'marineChartArchive',
    'dockyard', 'shrineOfOlympus', 'chronosForge'
];

const template = {
    resources: `
        <div id="tnt_info_resources">
            <div id="tnt_info_resources_content"></div>
            <div id="tnt_info_buildings_content" style="display:none;"></div>
        </div>
    `
};

const tnt = {
    version: GM_info.script.version,

    template, // Add template to tnt object
    url: { versionUrl: VERSION_URL, updateUrl: UPDATE_URL, update: UPDATE_HQ_URL },
    delay: (time) => new Promise(resolve => setTimeout(resolve, time)),

    // Settings module - manage user settings
    settings: {
        debug: { enable: true },

        // Get setting with default value
        get(key, defaultValue = null) {
            return GM_getValue(key, defaultValue);
        },

        // Set setting value
        set(key, value) {
            GM_setValue(key, value);
        },

        // Toggle boolean setting
        toggle(key) {
            const current = this.get(key, false);
            this.set(key, !current);
            return !current;
        },

        // Get all resource display settings
        getResourceDisplaySettings() {
            return {
                showResources: this.get("cityShowResources", true),
                showPopulation: this.get("cityShowResourcesPorpulation", true),
                showCitizens: this.get("cityShowResourcesCitizens", true),
                showWood: this.get("cityShowResourcesWoods", true),
                showWine: this.get("cityShowResourcesWine", true),
                showMarble: this.get("cityShowResourcesMarble", true),
                showCrystal: this.get("cityShowResourcesCrystal", true),
                showSulfur: this.get("cityShowResourcesSulfur", true)
            };
        },

        // Get all feature settings
        getFeatureSettings() {
            return {
                removePremiumOffers: this.get("allRemovePremiumOffers", true),
                removeFooterNavigation: this.get("allRemoveFooterNavigation", true),
                changeNavigationCoord: this.get("allChangeNavigationCoord", true),
                showCityLvl: this.get("islandShowCityLvl", true),
                removeFlyingShop: this.get("cityRemoveFlyingShop", true),
                notificationAdvisors: this.get("notificationAdvisors", true),
                notificationSound: this.get("notificationSound", true)
            };
        },

        // Initialize default settings
        initDefaults() {
            const defaults = {
                "allRemovePremiumOffers": true,
                "allRemoveFooterNavigation": true,
                "allChangeNavigationCoord": true,
                "islandShowCityLvl": true,
                "cityRemoveFlyingShop": true,
                "cityShowResources": true,
                "cityShowResourcesPorpulation": true,
                "cityShowResourcesCitizens": true,
                "cityShowResourcesWoods": true,
                "cityShowResourcesWine": true,
                "cityShowResourcesMarble": true,
                "cityShowResourcesCrystal": true,
                "cityShowResourcesSulfur": true,
                "notificationAdvisors": true,
                "notificationSound": true
            };

            Object.entries(defaults).forEach(([key, defaultValue]) => {
                if (GM_getValue(key) === undefined) {
                    this.set(key, defaultValue);
                }
            });

            this.set("version", tnt.version);
        }
    },

    // UI module - handle all DOM manipulation and event binding
    ui: {
        // Create and show the options dialog
        showOptionsDialog() {
            const optionsHtml = this.buildOptionsHtml();

            if ($('#tntOptions').length === 0) {
                $('li.serverTime').before(`
                    <li>
                        <a id="tntOptionsLink" href="javascript:void(0);">TNT Options v${tnt.version}</a>
                        <div id="tntOptions" class="tntBox" style="display:none;">
                            ${optionsHtml}
                        </div>
                    </li>
                `);
                this.attachOptionsEventHandlers();
            }
        },

        buildOptionsHtml() {
            const settings = tnt.settings.getFeatureSettings();
            const resourceSettings = tnt.settings.getResourceDisplaySettings();

            return `
                <div id="tntUpdateLine" align="center" style="padding-bottom:5px;">
                    <a id="tntColUpgradeLink" href="" style="display:none;color:blue;font-size:12px;">
                        Version <span id="tntColVersion"></span> is available. Click here to update now!
                    </a>
                </div>
                <div>
                    <div class="tnt_left" style="float:left;width:50%;">
                        <legend>All:</legend>
                        ${this.createCheckbox('tntAllRemovePremiumOffers', 'Remove Premium Offers', settings.removePremiumOffers)}
                        ${this.createCheckbox('tntAllRemoveFooterNavigation', 'Remove footer navigation', settings.removeFooterNavigation)}
                        ${this.createCheckbox('tntAllChangeNavigationCoord', 'Make footer navigation coord input a number', settings.changeNavigationCoord)}
                    </div>
                    <div class="tnt_left" style="float:left;width:50%;">
                        <legend>Notifications:</legend>
                        ${this.createCheckbox('tntNotificationAdvisors', 'Show notifications from Advisors', settings.notificationAdvisors)}
                        ${this.createCheckbox('tntNotificationSound', 'Play sound with notifications from Advisors', settings.notificationSound)}
                    </div>
                    <div class="tnt_left" style="float:left;width:50%;">
                        <legend>Islands:</legend>
                        ${this.createCheckbox('tntIslandShowCityLvl', 'Show Town Levels on Islands', settings.showCityLvl)}
                    </div>
                    <div class="tnt_left" style="float:left;width:50%;">
                        <legend>City:</legend>
                        ${this.createCheckbox('tntCityRemoveFlyingShop', 'Remove flying shop', settings.removeFlyingShop)}
                        ${this.createCheckbox('tntCityShowResources', 'Show resources', resourceSettings.showResources)}
                        <div class="tnt_left" style="padding-left:20px;">
                            ${this.createCheckbox('tntCityShowResourcesPorpulation', 'Show population', resourceSettings.showPopulation)}
                            ${this.createCheckbox('tntCityShowResourcesCitizens', 'Show citizens', resourceSettings.showCitizens)}
                            ${this.createCheckbox('tntCityShowResourcesWoods', 'Show wood', resourceSettings.showWood)}
                            ${this.createCheckbox('tntCityShowResourcesWine', 'Show Wine', resourceSettings.showWine)}
                            ${this.createCheckbox('tntCityShowResourcesMarble', 'Show Marble', resourceSettings.showMarble)}
                            ${this.createCheckbox('tntCityShowResourcesCrystal', 'Show Crystal', resourceSettings.showCrystal)}
                            ${this.createCheckbox('tntCityShowResourcesSulfur', 'Show Sulfur', resourceSettings.showSulfur)}
                        </div>
                    </div>
                    <div class="tnt_left" style="float:left;width:50%;">
                        <legend>World Map:</legend>
                    </div>
                </div>
                <div align="center" style="clear:both;">
                    <input id="tntOptionsClose" type="button" class="button" value="Close and refresh" />
                </div>
            `;
        },

        createCheckbox(id, label, checked) {
            return `<input id="${id}" type="checkbox"${checked ? ' checked="checked"' : ''} /> ${label}<br/>`;
        },

        attachOptionsEventHandlers() {
            // Open/close dialog
            $("#tntOptionsLink").on("click", () => $("#tntOptions").slideToggle());
            $("#tntOptionsClose").on("click", () => {
                $("#tntOptions").slideToggle();
                location.reload();
            });

            // Setting change handlers
            const settingHandlers = {
                'tntAllRemovePremiumOffers': 'allRemovePremiumOffers',
                'tntAllRemoveFooterNavigation': 'allRemoveFooterNavigation',
                'tntAllChangeNavigationCoord': 'allChangeNavigationCoord',
                'tntIslandShowCityLvl': 'islandShowCityLvl',
                'tntCityRemoveFlyingShop': 'cityRemoveFlyingShop',
                'tntCityShowResources': 'cityShowResources',
                'tntCityShowResourcesPorpulation': 'cityShowResourcesPorpulation',
                'tntCityShowResourcesCitizens': 'cityShowResourcesCitizens',
                'tntCityShowResourcesWoods': 'cityShowResourcesWoods',
                'tntCityShowResourcesWine': 'cityShowResourcesWine',
                'tntCityShowResourcesMarble': 'cityShowResourcesMarble',
                'tntCityShowResourcesCrystal': 'cityShowResourcesCrystal',
                'tntCityShowResourcesSulfur': 'cityShowResourcesSulfur',
                'tntNotificationAdvisors': 'notificationAdvisors'
            };

            Object.entries(settingHandlers).forEach(([elementId, settingKey]) => {
                $(`#${elementId}`).on("change", () => tnt.settings.toggle(settingKey));
            });

            // Special handler for notification sound (different toggle logic)
            $("#tntNotificationSound").on("change", () => {
                tnt.settings.set("notificationSound", !tnt.settings.get("notificationSound"));
            });
        },

        // Apply UI modifications based on settings
        applyUIModifications() {
            const settings = tnt.settings.getFeatureSettings();

            if (settings.removeFooterNavigation) {
                $('div#breadcrumbs, div#footer').hide();
            }

            if (settings.removeFlyingShop && $("body").attr("id") === "city") {
                $('.premiumOfferBox').hide();
            }
        }
    },

    // Game data getters with better organization and error handling
    game: {
        player: {
            getId() {
                return tnt.utils.safeGet(() => parseInt(ikariam.model.avatarId), 0);
            },

            getAlliance() {
                return {
                    id: tnt.utils.safeGet(() => parseInt(ikariam.model.avatarAllyId), 0),
                    hasAlly: tnt.utils.safeGet(() => ikariam.model.hasAlly, false)
                };
            }
        },

        city: {
            getId() {
                return tnt.utils.safeGet(() =>
                    ikariam.model.relatedCityData.selectedCity.replace(/[^\d-]+/g, ""), ""
                );
            },

            getName(id) {
                return tnt.utils.safeGet(() => {
                    if (id) {
                        return ikariam.model.relatedCityData["city_" + id].name;
                    }
                    return $("#citySelect option:selected").text().split("] ")[1];
                }, "Unknown City");
            },

            getLevel() {
                return $("#js_CityPosition0Level").text();
            },

            getCoordinates() {
                return $("#js_islandBreadCoords").text();
            },

            getProducedTradegood() {
                return tnt.utils.safeGet(() => ikariam.model.producedTradegood, 0);
            },

            isOwn() {
                return tnt.utils.safeGet(() => ikariam.model.isOwnCity, false);
            },

            getList() {
                return tnt.utils.safeGet(() => {
                    const cityList = {};
                    for (const key in ikariam.model.relatedCityData) {
                        if (key.startsWith("city_")) {
                            const cityId = key.replace("city_", "");
                            cityList[cityId] = {
                                name: ikariam.model.relatedCityData[key].name,
                                coordinates: ikariam.model.relatedCityData[key].coords
                            };
                        }
                    }
                    return cityList;
                }, {});
            }
        },

        resources: {
            getCurrent() {
                return {
                    wood: tnt.utils.safeGet(() => ikariam.model.currentResources.resource, 0),
                    wine: tnt.utils.safeGet(() => ikariam.model.currentResources[1], 0),
                    marble: tnt.utils.safeGet(() => ikariam.model.currentResources[2], 0),
                    crystal: tnt.utils.safeGet(() => ikariam.model.currentResources[3], 0),
                    sulfur: tnt.utils.safeGet(() => ikariam.model.currentResources[4], 0),
                    population: tnt.utils.safeGet(() => ikariam.model.currentResources.population, 0),
                    citizens: tnt.utils.safeGet(() => ikariam.model.currentResources.citizens, 0)
                };
            },

            getProduction() {
                return {
                    resource: tnt.utils.safeGet(() => ikariam.model.resourceProduction, 0),
                    tradegood: tnt.utils.safeGet(() => ikariam.model.tradegoodProduction, 0)
                };
            },

            getCapacity() {
                return {
                    max: tnt.utils.safeGet(() => ikariam.model.maxResources.resource, 0),
                    wineSpending: tnt.utils.safeGet(() => ikariam.model.wineSpending, 0)
                };
            }
        },

        economy: {
            getGold() {
                return tnt.utils.safeGet(() => parseInt(ikariam.model.gold), 0);
            },

            getAmbrosia() {
                return tnt.utils.safeGet(() => ikariam.model.ambrosia, 0);
            },

            getFinances() {
                return {
                    income: tnt.utils.safeGet(() => ikariam.model.income, 0),
                    upkeep: tnt.utils.safeGet(() => ikariam.model.upkeep, 0),
                    scientistsUpkeep: tnt.utils.safeGet(() => ikariam.model.sciencetistsUpkeep, 0),
                    godGoldResult: tnt.utils.safeGet(() => ikariam.model.godGoldResult, 0)
                };
            }
        },

        military: {
            getTransporters() {
                return {
                    free: tnt.utils.safeGet(() => ikariam.model.freeTransporters, 0),
                    max: tnt.utils.safeGet(() => ikariam.model.maxTransporters, 0)
                };
            }
        }
    },

    // Utilities module
    utils: {
        // Safe getter with error handling
        safeGet(getter, defaultValue = null) {
            try {
                return getter();
            } catch (e) {
                tnt.core.debug.log(`Error in safeGet: ${e.message}`);
                return defaultValue;
            }
        },

        // Check if city has construction
        hasConstruction() {
            return tnt.utils.safeGet(() => $('.constructionSite').length > 0, false);
        },

        // Calculate production for a city over time
        calculateProduction(cityID, hours) {
            const city = tnt.data.storage.resources.city[cityID];
            if (city && city.resourceProduction && city.tradegoodProduction) {
                return {
                    wood: (city.resourceProduction * hours * 3600).toLocaleString(),
                    wine: city.producedTradegood == 1 ? (city.tradegoodProduction * hours * 3600).toLocaleString() : "0",
                    marble: city.producedTradegood == 2 ? (city.tradegoodProduction * hours * 3600).toLocaleString() : "0",
                    crystal: city.producedTradegood == 3 ? (city.tradegoodProduction * hours * 3600).toLocaleString() : "0",
                    sulfur: city.producedTradegood == 4 ? (city.tradegoodProduction * hours * 3600).toLocaleString() : "0"
                };
            }

            tnt.core.debug.log(`City ID ${cityID} not found in storage`);
            return { wood: "0", wine: "0", marble: "0", crystal: "0", sulfur: "0" };
        }
    },

    // Update core.options to use new modules
    core: {
        // ...existing code...
        options: {
            init() {
                if (tnt.settings.get("version") !== tnt.version) {
                    tnt.settings.initDefaults();
                }
                tnt.ui.showOptionsDialog();
            }
        }
    },

    // Main data structure to hold all data
    data: {
        ikariam: {
            subDomain: location.hostname.split('.')[0],
            url: {
                notification: (() => {
                    const sub = location.hostname.split('.')[0];
                    const base = `https://${sub}.ikariam.gameforge.com/cdn/all/both/layout/advisors/`;
                    return {
                        defaultPicture: base + "mayor_premium.png",
                        mayor: base + "mayor.png",
                        mayor_premium: base + "mayor_premium.png",
                        general: base + "general.png",
                        general_premium: base + "general_premium.png",
                        general_alert: base + "general_premium_alert.png",
                        scientist: base + "scientist.png",
                        scientist_premium: base + "scientist_premium.png",
                        diplomat: base + "diplomat.png",
                        diplomat_premium: base + "diplomat_premium.png"
                    };
                })()
            }
        },
        storage: {
            notification: {
                cities: false,
                military: false,
                militaryAlert: false,
                scientist: false,
                diplomat: false
            },
            ambrosia: 0,
            gold: 0,
            resources: {
                city: {}
            }
        }
    },

    // Initialize the core module
    core: {
        init() {
            tnt.core.debug.log(`TNT Collection v${tnt.version} - Init...`);

            tnt.core.storage.init();
            tnt.dataCollector.update();
            tnt.core.notification.init();
            tnt.core.events.init();
            tnt.core.options.init();

            // Apply UI modifications
            tnt.ui.applyUIModifications();

            tnt.all();

            switch ($("body").attr("id")) {
                case "island": tnt.island(); break;
                case "city": tnt.city(); break;
                case "worldmap_iso": tnt.world(); break;
            }
        },

        ajax: {
            send(data, url = tnt.url.update, callback = null) {
                tnt.core.debug.log('Data length: ' + JSON.stringify(data).length, 3);
                GM_xmlhttpRequest({
                    url, method: 'POST',
                    data: "data=" + encodeURIComponent(JSON.stringify(data)),
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    onload: resp => {
                        tnt.core.debug.dir(resp.responseText, 5);
                        if (callback) callback();
                    },
                    onerror: (error) => {
                        tnt.core.debug.log("AJAX Error: " + error.message, 1);
                    }
                });
            }
        },

        debug: {
            log(val) {
                if (tnt.settings.debug.enable) console.log(val);
            },
            dir(obj, level = 0) {
                if (tnt.settings.debug.enable) console.dir(obj);
            }
        },

        storage: {
            init() {
                try {
                    const storedData = localStorage.getItem("tnt_storage");
                    const parsedData = storedData ? JSON.parse(storedData) : {};
                    tnt.data.storage = $.extend(true, {}, tnt.data.storage, parsedData);
                } catch (e) {
                    tnt.core.debug.log("Error parsing tnt_storage: " + e.message, 1);
                }
            },
            get(group, name) {
                if (!tnt.data.storage || !tnt.data.storage[group]) return undefined;
                return tnt.data.storage[group][name];
            },
            set(group, name, value) {
                if (!tnt.data.storage) tnt.data.storage = {};
                if (!tnt.data.storage[group]) tnt.data.storage[group] = {};
                tnt.data.storage[group][name] = value;
                tnt.core.storage.save();
            },
            save() {
                try {
                    localStorage.setItem("tnt_storage", JSON.stringify(tnt.data.storage));
                } catch (e) {
                    tnt.core.debug.log("Error saving to localStorage: " + e.message, 1);
                }
            }
        },

        notification: {
            init() { if (Notification && Notification.permission !== "granted") Notification.requestPermission(); },
            notifyMe(title, message, picture) {
                // Disabled for now
                return;
            },
            check() {
                return; // Disable notifications for now
                // ...existing notification check code...
            }
        },

        events: {
            init() { tnt.core.events.ikariam.override(); },
            ikariam: {
                override() {
                    // updateGlobalData = Move this into its own function
                    ajax.Responder.tntUpdateGlobalData = ajax.Responder.updateGlobalData;
                    ajax.Responder.updateGlobalData = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("updateGlobalData (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntUpdateGlobalData(response);

                        // Check notifications
                        tnt.core.notification.check();

                        // Collect data  
                        tnt.dataCollector.update();

                        // Run tnt.all() to handle all common tasks
                        tnt.all();
                    }

                    // updateBackgroundData = Move this into its own function
                    ajax.Responder.tntUpdateBackgroundData = ajax.Responder.updateBackgroundData;
                    ajax.Responder.updateBackgroundData = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("updateBackgroundData (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntUpdateBackgroundData(response);

                        // Check notifications
                        tnt.core.notification.check();

                        switch (view) {
                            case "worldmap_iso":
                                tnt.core.debug.log($('worldmap_iso: div.islandTile div.cities'), 3);
                                break;
                            case "city":
                                break;
                            case "plunder":
                                // Select all units when pillaging
                                setTimeout(() => {
                                    // Set all units to max
                                    $('#selectArmy .assignUnits .setMax').trigger("click");

                                    // Set extra transporters to available count
                                    const freeTransporters = parseInt($("#js_GlobalMenu_freeTransporters").text()) || 0;
                                    $('#extraTransporter').val(freeTransporters);
                                }, 1000);
                                break;
                            case 'tradeAdvisor':
                                tnt.core.debug.log("tradeAdvisor", 3);
                                break;
                        }
                    }

                    // changeView = Move this into its own function
                    ajax.Responder.tntChangeView = ajax.Responder.changeView;
                    ajax.Responder.changeView = function (response) {
                        var view = $('body').attr('id');
                        tnt.core.debug.log("changeView (View: " + view + ")", 3);

                        // Let Ikariam do its stuff
                        ajax.Responder.tntChangeView(response);

                        // Check notifications
                        tnt.core.notification.check();

                        tnt.core.debug.log("ikariam.templateView.id: '" + ikariam.templateView.id + "'", 3);
                        switch (ikariam.templateView.id) {
                            case "townHall":
                                if (!ikariam.backgroundView.screen.data.isCapital && $('#sidebarWidget .indicator').length > 1) {
                                    $('#sidebarWidget .indicator').last().trigger("click");
                                }
                                break;
                            case "tradeAdvisor":
                                $("#tradeAdvisor").children('div.contentBox01h').eq(1).hide();
                                break;
                            case "militaryAdvisor":
                                $("#militaryAdvisor").find('div.contentBox01h').eq(0).hide();
                                break;
                            case "researchAdvisor":
                                $("#researchAdvisor").find('div.contentBox01h').eq(1).hide();
                                break;
                            case "diplomacyAdvisor":
                                $("#tab_diplomacyAdvisor").find('div.contentBox01h').eq(2).hide();
                                break;
                            case "transport":
                                $('#setPremiumJetPropulsion').hide().prev().hide();
                                break;
                            case "resource":
                                $('#sidebarWidget .indicator').eq(1).trigger("click");
                                break;
                            case "merchantNavy":
                                setTimeout(() => {
                                    $('.pulldown .btn').trigger('click');
                                }, 250);
                                break;
                            case "deployment":
                            case "plunder":
                                // Wait for dialog to be ready
                                setTimeout(() => {
                                    // Select all units
                                    $('#selectArmy .assignUnits .setMax').trigger("click");

                                    // Set initial transporter count
                                    const freeTransporters = tnt.get.transporters.free();
                                    $('#extraTransporter').val(freeTransporters);

                                    // Prevent 0 transporters when min is clicked 
                                    $('#selectArmy .assignUnits .setMin').on('click', function () {
                                        if (parseInt($('#extraTransporter').val()) === 0) {
                                            $('#extraTransporter').val(tnt.get.transporters.free());
                                        }
                                    });
                                }, 200);
                                break;
                        }

                        // Run tnt.all() to handle all common tasks
                        tnt.all();
                    }
                }
            }
        },

        options: {
            init() {
                if (tnt.settings.get("version") !== tnt.version) {
                    tnt.settings.initDefaults();
                }
                tnt.ui.showOptionsDialog();
            }
        }
    },

    // dataCollector = Collects and stores resource data
    dataCollector: {
        update() {
            const cityId = tnt.get.cityId();
            const prev = $.extend(true, {}, tnt.data.storage.resources.city[cityId] || {});

            const cityData = {
                ...prev,
                buildings: {},
                cityIslandCoords: tnt.get.cityIslandCoords(),
                producedTradegood: parseInt(tnt.get.producedTradegood()),
                population: tnt.get.population(),
                citizens: tnt.get.citizens(),
                max: tnt.utils.safeGet(() => ikariam.model.maxResources.resource, 0),
                wood: tnt.get.resources.wood(),
                wine: tnt.get.resources.wine(),
                marble: tnt.get.resources.marble(),
                crystal: tnt.get.resources.crystal(),
                sulfur: tnt.get.resources.sulfur(),
                hasConstruction: $("body").attr("id") == "city" ? tnt.has.construction() : (prev.hasConstruction || false),
                cityLvl: tnt.get.cityLvl(), // Get city level regardless of construction
                resourceProduction: tnt.get.resourceProduction(),
                tradegoodProduction: tnt.get.tradegoodProduction(),
                lastUpdate: Date.now()
            };

            // Only update buildings when in city view
            if ($("body").attr("id") === "city") {
                const detectBuildings = () => {
                    const $positions = $('div[id^="position"].building, div[id^="js_CityPosition"].building');
                    if (!$positions.length) return;

                    const foundBuildings = {};

                    $positions.each(function () {
                        const $pos = $(this);
                        const posId = $pos.attr('id');
                        if (!posId) return;

                        const position = posId.match(/\d+$/)?.[0];
                        if (!position) return;

                        const classes = ($pos.attr('class') || '').split(/\s+/);
                        const buildingType = classes.find(c => validBuildingTypes.includes(c));
                        if (!buildingType) return;

                        // Get current level from either constructionSite or regular building
                        const $constructionSite = $pos.find('.constructionSite');
                        const $level = $pos.find('.level');

                        let level = 0;
                        let targetLevel = 0;
                        let underConstruction = false;

                        if ($constructionSite.length) {
                            underConstruction = true;
                            const currentLevelText = $constructionSite.find('.level').text();
                            level = parseInt(currentLevelText.match(/\d+/)?.[0] || '0');

                            const headerText = $constructionSite.find('.header .time').text();
                            const targetMatch = headerText.match(/Level (\d+)/i);
                            targetLevel = targetMatch ? parseInt(targetMatch[1]) : level + 1;
                        } else {
                            const levelClass = classes.find(c => c.startsWith('level'));
                            level = parseInt(levelClass?.match(/\d+$/)?.[0] || $level.text().match(/\d+/)?.[0] || '0');
                            targetLevel = level;
                        }

                        if (level > 0 || targetLevel > 0) {
                            foundBuildings[buildingType] = foundBuildings[buildingType] || [];
                            const existingIndex = foundBuildings[buildingType].findIndex(b => b.position === position);
                            const buildingData = {
                                position,
                                level: targetLevel || level,
                                currentLevel: level,
                                targetLevel,
                                name: buildingType,
                                underConstruction
                            };

                            if (existingIndex >= 0) {
                                foundBuildings[buildingType][existingIndex] = buildingData;
                            } else {
                                foundBuildings[buildingType].push(buildingData);
                            }
                        }
                    });

                    // Update city data with found buildings
                    cityData.buildings = foundBuildings;
                    tnt.data.storage.resources.city[cityId] = cityData;
                    tnt.core.storage.save();
                    tnt.dataCollector.show();
                };

                detectBuildings();
            }

            // Store final data and update display
            tnt.data.storage.resources.city[cityId] = cityData;
            tnt.core.storage.save();
            tnt.dataCollector.show();
        },

        show() {
            if (tnt.settings.getResourceDisplaySettings().showResources && $("body").attr("id") == "city") {
                if ($('#tnt_info_resources').length === 0) {
                    $('body').append(
                        tnt.template.resources.replace('<span class="tnt_panel_minimize_btn tnt_back"></span>', '')
                    );
                }

                $('#tnt_info_resources_content').empty();

                // Build resource table using new table builder
                const resourceTable = tnt.tableBuilder.buildTable('resources');
                $('#tnt_info_resources_content').html(resourceTable);

                // Build building table using new table builder
                const buildingTable = tnt.tableBuilder.buildTable('buildings');
                $('#tnt_info_buildings_content').html(buildingTable);

                // Add event handlers
                tnt.tableBuilder.attachEventHandlers();
            }
        },

        calculateTotals() {
            let total = {
                population: 0,
                citizens: 0,
                wood: 0,
                wine: 0,
                marble: 0,
                crystal: 0,
                sulfur: 0
            };

            $.each(tnt.data.storage.resources.city, function (cityID, cityData) {
                total.population += cityData.population || 0;
                total.citizens += cityData.citizens || 0;
                total.wood += cityData.wood || 0;
                total.wine += cityData.wine || 0;
                total.marble += cityData.marble || 0;
                total.crystal += cityData.crystal || 0;
                total.sulfur += cityData.sulfur || 0;
            });

            return total;
        },

        getBuildingDefinitions() {
            return [
                // Government
                { key: 'townHall', name: 'Town Hall', icon: '/cdn/all/both/img/city/townhall_l.png', buildingId: 0, helpId: 1 },
                { key: 'palace', name: 'Palace', icon: '/cdn/all/both/img/city/palace_l.png', buildingId: 11, helpId: 1 },
                { key: 'palaceColony', name: 'Governor\'s Residence', icon: '/cdn/all/both/img/city/palaceColony_l.png', buildingId: 17, helpId: 1 },
                { key: 'embassy', name: 'Embassy', icon: '/cdn/all/both/img/city/embassy_l.png', buildingId: 12, helpId: 1 },
                { key: 'chronosForge', name: 'Chronos\' Forge', icon: '/cdn/all/both/img/city/chronosForge_l.png', buildingId: 35, helpId: 1 },

                // Resource storage
                { key: 'warehouse', name: 'Warehouse', icon: '/cdn/all/both/img/city/warehouse_l.png', buildingId: 7, helpId: 1 },
                { key: 'dump', name: 'Depot', icon: '/cdn/all/both/img/city/dump_l.png', buildingId: 29, helpId: 1 },

                // Trade & Diplomacy
                { key: 'port', name: 'Trading Port', icon: '/cdn/all/both/img/city/port_l.png', buildingId: 3, helpId: 1 },
                { key: 'dockyard', name: 'Dockyard', icon: '/cdn/all/both/img/city/dockyard_l.png', buildingId: 33, helpId: 1 },
                { key: 'marineChartArchive', name: 'Sea Chart Archive', icon: '/cdn/all/both/img/city/marinechartarchive_l.png', buildingId: 32, helpId: 1 },
                { key: 'branchOffice', name: 'Trading Post', icon: '/cdn/all/both/img/city/branchoffice_l.png', buildingId: 13, helpId: 1 },

                // Culture & Research
                { key: 'academy', name: 'Academy', icon: '/cdn/all/both/img/city/academy_l.png', buildingId: 4, helpId: 1 },
                { key: 'museum', name: 'Museum', icon: '/cdn/all/both/img/city/museum_l.png', buildingId: 10, helpId: 1 },
                { key: 'tavern', name: 'Tavern', icon: '/cdn/all/both/img/city/taverne_l.png', buildingId: 9, helpId: 1 },
                { key: 'temple', name: 'Temple', icon: '/cdn/all/both/img/city/temple_l.png', buildingId: 28, helpId: 1 },
                { key: 'shrineOfOlympus', name: 'Gods\' Shrine', icon: '/cdn/all/both/img/city/shrineOfOlympus_l.png', buildingId: 34, helpId: 1 },

                // Resource reducers
                { key: 'carpentering', name: 'Carpenter', icon: '/cdn/all/both/img/city/carpentering_l.png', buildingId: 23, helpId: 1 },
                { key: 'architect', name: 'Architect\'s Office', icon: '/cdn/all/both/img/city/architect_l.png', buildingId: 24, helpId: 1 },
                { key: 'vineyard', name: 'Wine Press', icon: '/cdn/all/both/img/city/vineyard_l.png', buildingId: 26, helpId: 1 },
                { key: 'optician', name: 'Optician', icon: '/cdn/all/both/img/city/optician_l.png', buildingId: 25, helpId: 1 },
                { key: 'fireworker', name: 'Firework Test Area', icon: '/cdn/all/both/img/city/fireworker_l.png', buildingId: 27, helpId: 1 },

                // Resource enhancers
                { key: 'forester', name: 'Forester\'s House', icon: '/cdn/all/both/img/city/forester_l.png', buildingId: 18, helpId: 1 },
                { key: 'stonemason', name: 'Stonemason', icon: '/cdn/all/both/img/city/stonemason_l.png', buildingId: 19, helpId: 1 },
                { key: 'winegrower', name: 'Winegrower', icon: '/cdn/all/both/img/city/winegrower_l.png', buildingId: 21, helpId: 1 },
                { key: 'glassblowing', name: 'Glassblower', icon: '/cdn/all/both/img/city/glassblowing_l.png', buildingId: 20, helpId: 1 },
                { key: 'alchemist', name: 'Alchemist\'s Tower', icon: '/cdn/all/both/img/city/alchemist_l.png', buildingId: 22, helpId: 1 },

                // Military
                { key: 'wall', name: 'Wall', icon: '/cdn/all/both/img/city/wall.png', buildingId: 8, helpId: 1 },
                { key: 'barracks', name: 'Barracks', icon: '/cdn/all/both/img/city/barracks_l.png', buildingId: 6, helpId: 1 },
                { key: 'safehouse', name: 'Hideout', icon: '/cdn/all/both/img/city/safehouse_l.png', buildingId: 16, helpId: 1 },
                { key: 'workshop', name: 'Workshop', icon: '/cdn/all/both/img/city/workshop_l.png', buildingId: 15, helpId: 1 },
                { key: 'shipyard', name: 'Shipyard', icon: '/cdn/all/both/img/city/shipyard_l.png', buildingId: 5, helpId: 1 },

                // Special buildings
                { key: 'pirateFortress', name: 'Pirate Fortress', icon: '/cdn/all/both/img/city/pirateFortress_l.png', buildingId: 30, helpId: 1 },
                { key: 'blackMarket', name: 'Black Market', icon: '/cdn/all/both/img/city/blackmarket_l.png', buildingId: 31, helpId: 1 }
            ];
        },

        getMergedBuildingColumns(buildingColumns) {
            // Determine which building columns are used in any city
            const usedColumns = buildingColumns.filter(function (col) {
                const cities = Object.values(tnt.data.storage.resources.city);
                if (col.key === 'palace' || col.key === 'palaceColony') {
                    return cities.some(city =>
                        (city.buildings?.['palace']?.length > 0) ||
                        (city.buildings?.['palaceColony']?.length > 0)
                    );
                }
                return cities.some(city => city.buildings?.[col.key]?.length > 0);
            });

            // Merge palace/palaceColony into a single column for display
            const mergedColumns = [];
            let seenPalace = false;
            usedColumns.forEach(function (col) {
                if ((col.key === 'palace' || col.key === 'palaceColony') && !seenPalace) {
                    mergedColumns.push({
                        key: 'palaceOrColony',
                        name: 'Palace / Governor\'s Residence',
                        icon: '/cdn/all/both/img/city/palace_l.png',
                        icon2: '/cdn/all/both/img/city/palaceColony_l.png',
                        buildingId: 11,
                        helpId: 1
                    });
                    seenPalace = true;
                } else if (col.key !== 'palace' && col.key !== 'palaceColony') {
                    mergedColumns.push(col);
                }
            });

            return mergedColumns;
        },

        calculateCategorySpans(mergedColumns) {
            const buildingCategories = {
                government: ['townHall', 'palace', 'palaceColony', 'embassy', 'chronosForge'],
                storage: ['warehouse', 'dump'],
                trade: ['port', 'dockyard', 'marineChartArchive', 'branchOffice'],
                resourceReducers: ['carpentering', 'architect', 'vineyard', 'optician', 'fireworker'],
                resourceEnhancers: ['forester', 'stonemason', 'winegrower', 'glassblowing', 'alchemist'],
                military: ['wall', 'barracks', 'safehouse', 'workshop', 'shipyard'],
                culture: ['tavern', 'museum', 'academy', 'temple', 'shrineOfOlympus'],
                special: ['pirateFortress', 'blackMarket']
            };

            const categorySpans = {};
            mergedColumns.forEach(col => {
                for (let [category, buildings] of Object.entries(buildingCategories)) {
                    if (buildings.includes(col.key) ||
                        (col.key === 'palaceOrColony' && (buildings.includes('palace') || buildings.includes('palaceColony')))) {
                        categorySpans[category] = (categorySpans[category] || 0) + 1;
                    }
                }
            });

            return categorySpans;
        },

        sortCities() {
            var list = {};
            var cities = tnt.data.storage.resources.city || {};
            $.each(cities, (cityID, value) => {
                if (value && typeof value.producedTradegood !== 'undefined') {
                    list[cityID] = value.producedTradegood;
                }
            });
            var order = { 2: 0, 1: 1, 3: 2, 4: 3 };
            return Object.keys(list).sort((a, b) => order[list[a]] - order[list[b]]);
        },

        checkMinMax(city, resource) {
            if (!tnt.settings.getResourceDisplaySettings().showResources || !city || !city.max) return '';
            var max = city.max, txt = '';
            switch (resource) {
                case 0: if (city.wood > max * .8) txt += ' storage_danger'; if (city.wood < 100000) txt += ' storage_min'; break;
                case 1: if (city.wine > max * .8) txt += ' storage_danger'; if (city.wine < 100000) txt += ' storage_min'; break;
                case 2: if (city.marble > max * .8) txt += ' storage_danger'; if (city.marble < 50000) txt += ' storage_min'; break;
                case 3: if (city.crystal > max * .8) txt += ' storage_danger'; if (city.crystal < 50000) txt += ' storage_min'; break;
                case 4: if (city.sulfur > max * .8) txt += ' storage_danger'; if (city.sulfur < 50000) txt += ' storage_min'; break;
            }
            return txt;
        },

        getIcon(resource) {
            switch (resource) {
                case 0: return '<img class="tnt_resource_icon" title="Wood" src="/cdn/all/both/resources/icon_wood.png">';
                case 1: return '<img class="tnt_resource_icon" title="Wine" src="/cdn/all/both/resources/icon_wine.png">';
                case 2: return '<img class="tnt_resource_icon" title="Marble" src="/cdn/all/both/resources/icon_marble.png">';
                case 3: return '<img class="tnt_resource_icon" title="Crystal" src="/cdn/all/both/resources/icon_crystal.png">';
                case 4: return '<img class="tnt_resource_icon" title="Sulfur" src="/cdn/all/both/resources/icon_sulfur.png">';
                case 'population': return '<img class="tnt_resource_icon" title="Population" src="//gf3.geo.gfsrv.net/cdn2f/6d077d68d9ae22f9095515f282a112.png" style="width: 10px;">';
                case 'citizens': return '<img class="tnt_resource_icon" title="Citizens" src="/cdn/all/both/resources/icon_population.png">';
                default: return '';
            }
        }
    },

    // tableBuilder - handles all table building logic
    tableBuilder: {
        buildTable(tableType) {
            const config = this.getTableConfig(tableType);
            tnt.core.debug.dir(`Building ${tableType} table with config:`, config);

            let table = `<table id="tnt_${tableType}_table" border="1" style="border-collapse:collapse;font:12px Arial,Helvetica,sans-serif;background-color:#fdf7dd;">`;

            // Add category header row if needed
            if (config.categories) {
                table += this.buildCategoryHeader(tableType, config);
            }

            // Add main header row
            table += this.buildMainHeader(config);

            // Add data rows
            table += this.buildDataRows(config);

            // Add total row
            if (config && typeof config.getTotalRow === 'function') {
                table += config.getTotalRow();
            } else {
                console.warn('[TNT-Collection] config.getTotalRow is not a function. TableType:', tableType, 'Config:', config);
            }

            table += '</table>';
            return table;
        },

        buildCategoryHeader(tableType, config) {
            let header = '<tr class="tnt_category_header">';
            header += '<th class="tnt_category_spacer" style="position:relative;background:transparent;border:none;padding:4px;text-align:center;">'
                + '<span class="tnt_panel_minimize_btn tnt_back" id="tnt_panel_minimize_btn_header" style="position:absolute;left:2px;top:2px;"></span>'
                + '<span class="tnt_table_toggle_btn" title="Show buildings/resources" style="position:absolute;right:2px;top:2px;"></span>'
                + '<span class="tnt_refresh_btn" title="Refresh all cities" style="position:absolute;right:25px;top:2px;"></span>'
                + '</th>';

            if (tableType === 'resources') {
                header += this.buildResourceCategoryHeaders();
            } else {
                header += this.buildBuildingCategoryHeaders(config);
            }

            header += '</tr>';
            return header;
        },

        buildBuildingCategoryHeaders(config) {
            let headers = '';
            for (let [category, span] of Object.entries(config.categorySpans)) {
                if (span > 0) {
                    let displayName = category.replace(/([A-Z])/g, ' $1')
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                    headers += `<th colspan="${span}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">${displayName}</th>`;
                }
            }
            return headers;
        },

        buildResourceCategoryHeaders() {
            const settings = tnt.settings.getResourceDisplaySettings();
            let headers = '';

            let cityInfoSpan = 1; // Town Hall always visible
            if (settings.showPopulation) cityInfoSpan++;
            if (settings.showCitizens) cityInfoSpan++;

            if (cityInfoSpan > 0) {
                headers += `<th colspan="${cityInfoSpan}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">City Info</th>`;
            }

            let resourcesSpan = 0;
            if (settings.showWood) resourcesSpan++;
            if (settings.showWine) resourcesSpan++;
            if (settings.showMarble) resourcesSpan++;
            if (settings.showCrystal) resourcesSpan++;
            if (settings.showSulfur) resourcesSpan++;

            if (resourcesSpan > 0) {
                headers += `<th colspan="${resourcesSpan}" class="tnt_category_header" style="background-color:#DBBE8C;border: 1px solid #000;padding:4px;font-weight:bold;text-align:center;">Resources</th>`;
            }

            return headers;
        },

        buildMainHeader(config) {
            let header = '<tr class="tnt_subcategory_header">';
            header += config.headerCell;
            config.columns.forEach(col => {
                header += col.headerHtml;
            });
            header += '</tr>';
            return header;
        },

        buildDataRows(config) {
            const currentCityId = tnt.get.cityId();
            let rows = '';

            $.each(tnt.dataCollector.sortCities(), function (index, cityID) {
                const value = tnt.data.storage.resources.city[cityID];
                const isCurrentCity = (cityID == currentCityId);
                const cityRowClass = isCurrentCity ? ' class="tnt_selected"' : '';

                rows += `<tr${cityRowClass}>`;
                rows += config.getCityCell(cityID, value);

                config.columns.forEach(col => {
                    rows += col.getCellHtml(value, cityID);
                });
                rows += '</tr>';
            });

            return rows;
        },

        getTableConfig(tableType) {
            switch (tableType) {
                case 'resources':
                    return this.getResourceTableConfig();
                case 'buildings':
                    return this.getBuildingTableConfig();
                default:
                    throw new Error(`Unknown table type: ${tableType}`);
            }
        },

        getBuildingTableConfig() {
            const buildingDefs = tnt.dataCollector.getBuildingDefinitions();
            const mergedColumns = tnt.dataCollector.getMergedBuildingColumns(buildingDefs);
            const categorySpans = tnt.dataCollector.calculateCategorySpans(mergedColumns);

            return {
                categories: true,
                categorySpans,
                headerCell: `
                    <th class="tnt_center tnt_bold" style="position:relative;text-align:center;padding:4px;font-weight:bold;border:1px solid #000;background-color:#faeac6;">
                        <div style="position:relative; min-width:120px; text-align:center;">
                            <span style="display:inline-block; text-align:center; min-width:60px;">City</span>
                        </div>
                    </th>`,
                columns: this.getBuildingColumns(mergedColumns),
                getCityCell: this.getBuildingCityCell,
                getTotalRow: () => this.getBuildingTotalRow(mergedColumns)
            };
        },

        getResourceTableConfig() {
            const settings = tnt.settings.getResourceDisplaySettings();

            return {
                categories: true,
                categorySpans: {
                    cityInfo: 1 + (settings.showPopulation ? 1 : 0) + (settings.showCitizens ? 1 : 0),
                    resources: (settings.showWood ? 1 : 0) + (settings.showWine ? 1 : 0) +
                        (settings.showMarble ? 1 : 0) + (settings.showCrystal ? 1 : 0) +
                        (settings.showSulfur ? 1 : 0)
                },
                headerCell: `
                    <th class="tnt_center tnt_bold" style="position:relative;text-align:center;padding:4px;font-weight:bold;border:1px solid #000;background-color:#faeac6;">
                        <div style="position:relative; min-width:120px; text-align:center;">
                            <span style="display:inline-block; text-align:center; min-width:60px;">City</span>
                        </div>
                    </th>
                    <th class="tnt_center tnt_bold" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">
                        <a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&amp;buildingId=0&amp;helpId=1');return false;" title="Learn more about Town Hall...">
                            <img class="tnt_resource_icon tnt_building_icon" title="Town Hall" src="/cdn/all/both/img/city/townhall_l.png">
                        </a>
                    </th>`,
                columns: this.getResourceColumns(),
                getCityCell: this.getResourceCityCell,
                getTotalRow: () => this.getResourceTotalRow()
            };
        },

        getBuildingColumns(mergedColumns) {
            return mergedColumns.map(b => ({
                key: b.key,
                headerHtml: b.key === 'palaceOrColony'
                    ? `<th class="tnt_center tnt_bold" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">
                        <a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&amp;buildingId=11&amp;helpId=1');return false;" title="Learn more about Palace...">
                            <img class="tnt_resource_icon tnt_building_icon" title="Palace" src="${b.icon}">
                        </a>
                        <a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&amp;buildingId=17&amp;helpId=1');return false;" title="Learn more about Governor's Residence...">
                            <img class="tnt_resource_icon tnt_building_icon" title="Governor's Residence" src="${b.icon2}">
                        </a>
                    </th>`
                    : `<th class="tnt_center tnt_bold" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;">
                        <a href="#" onclick="ajaxHandlerCall('?view=buildingDetail&amp;buildingId=${b.buildingId}&amp;helpId=${b.helpId}');return false;" title="Learn more about ${b.name}...">
                            <img class="tnt_resource_icon tnt_building_icon" title="${b.name}" src="${b.icon}">
                        </a>
                    </th>`,
                getCellHtml: (value) => {
                    const cityBuildings = value.buildings || {};
                    if (b.key === 'palaceOrColony') {
                        const palaceArr = Array.isArray(cityBuildings['palace']) ? cityBuildings['palace'] : [];
                        const colonyArr = Array.isArray(cityBuildings['palaceColony']) ? cityBuildings['palaceColony'] : [];
                        const buildingData = palaceArr.concat(colonyArr);

                        if (buildingData.length > 0) {
                            const sumLevel = buildingData.reduce((acc, building) => acc + (parseInt(building.level) || 0), 0);
                            const tooltip = buildingData.map(building =>
                                (building.name === 'palace' ? 'Palace' : "Governor's Residence") +
                                ' (Pos ' + building.position + '): lvl ' + building.level
                            ).join('\n');
                            return `<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:#fdf7dd;" title="${tooltip.replace(/"/g, '&quot;')}">${sumLevel}</td>`;
                        } else {
                            return '<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:#fdf7dd;">-</td>';
                        }
                    } else {
                        const arr = cityBuildings[b.key];
                        if (Array.isArray(arr) && arr.length > 0) {
                            const sumLevel = arr.reduce((acc, building) => acc + (building.level || 0), 0);
                            const tooltip = arr.map(building => {
                                let text = 'Pos ' + building.position + ': lvl ' + building.level;
                                if (building.underConstruction) {
                                    text += ' (Upgrading from ' + building.currentLevel + ' to ' + building.targetLevel + ')';
                                }
                                return text;
                            }).join('\n');
                            const bgColor = arr.some(building => building.underConstruction) ? '#80404050' : '#fdf7dd';
                            return `<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:${bgColor};" title="${tooltip.replace(/"/g, '&quot;')}">${sumLevel}</td>`;
                        } else {
                            return '<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:#fdf7dd;"></td>';
                        }
                    }
                }
            }));
        },

        getResourceColumns() {
            const settings = tnt.settings.getResourceDisplaySettings();

            return [
                {
                    key: 'population',
                    headerHtml: `<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;${settings.showPopulation ? '' : 'display:none;'}">${tnt.dataCollector.getIcon('population')}</th>`,
                    getCellHtml: (value) => {
                        const display = settings.showPopulation ? '' : 'display:none;';
                        const val = parseInt(Math.round(value.population)).toLocaleString();
                        return `<td class="tnt_population" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${display}">${val}</td>`;
                    }
                },
                {
                    key: 'citizens',
                    headerHtml: `<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;${settings.showCitizens ? '' : 'display:none;'}">${tnt.dataCollector.getIcon('citizens')}</th>`,
                    getCellHtml: (value) => {
                        const display = settings.showCitizens ? '' : 'display:none;';
                        const val = parseInt(Math.round(value.citizens)).toLocaleString();
                        return `<td class="tnt_citizens" style="padding:4px;text-align:right;border:1px solid #000;background-color:#fdf7dd;${display}">${val}</td>`;
                    }
                },
                {
                    key: 'wood',
                    headerHtml: `<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;${settings.showWood ? '' : 'display:none;'}">${tnt.dataCollector.getIcon(0)}</th>`,
                    getCellHtml: (value, cityID) => {
                        const display = settings.showWood ? '' : 'display:none;';
                        const cssClass = tnt.dataCollector.checkMinMax(value, 0);
                        const production = tnt.calc.production(cityID, 24).wood;
                        const bgColor = cssClass.includes('storage_min') ? '#FF000050' : '#fdf7dd';
                        return `<td class="tnt_wood${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:${bgColor};${display}"><span title="${production}">${value.wood.toLocaleString()}</span></td>`;
                    }
                },
                {
                    key: 'wine',
                    headerHtml: `<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;${settings.showWine ? '' : 'display:none;'}">${tnt.dataCollector.getIcon(1)}</th>`,
                    getCellHtml: (value, cityID) => {
                        const display = settings.showWine ? '' : 'display:none;';
                        const cssClass = tnt.dataCollector.checkMinMax(value, 1);
                        const production = tnt.calc.production(cityID, 24).wine;
                        const bgColor = cssClass.includes('storage_min') ? '#FF000050' : '#fdf7dd';
                        const fontWeight = value.producedTradegood == 1 ? 'bold' : 'normal';
                        return `<td class="tnt_wine${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:${bgColor};font-weight:${fontWeight};${display}"><span title="${production}">${value.wine.toLocaleString()}</span></td>`;
                    }
                },
                {
                    key: 'marble',
                    headerHtml: `<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;${settings.showMarble ? '' : 'display:none;'}">${tnt.dataCollector.getIcon(2)}</th>`,
                    getCellHtml: (value, cityID) => {
                        const display = settings.showMarble ? '' : 'display:none;';
                        const cssClass = tnt.dataCollector.checkMinMax(value, 2);
                        const production = tnt.calc.production(cityID, 24).marble;
                        const bgColor = cssClass.includes('storage_min') ? '#FF000050' : '#fdf7dd';
                        const fontWeight = value.producedTradegood == 2 ? 'bold' : 'normal';
                        return `<td class="tnt_marble${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:${bgColor};font-weight:${fontWeight};${display}"><span title="${production}">${value.marble.toLocaleString()}</span></td>`;
                    }
                },
                {
                    key: 'crystal',
                    headerHtml: `<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;${settings.showCrystal ? '' : 'display:none;'}">${tnt.dataCollector.getIcon(3)}</th>`,
                    getCellHtml: (value, cityID) => {
                        const display = settings.showCrystal ? '' : 'display:none;';
                        const cssClass = tnt.dataCollector.checkMinMax(value, 3);
                        const production = tnt.calc.production(cityID, 24).crystal;
                        const bgColor = cssClass.includes('storage_min') ? '#FF000050' : '#fdf7dd';
                        const fontWeight = value.producedTradegood == 3 ? 'bold' : 'normal';
                        return `<td class="tnt_crystal${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:${bgColor};font-weight:${fontWeight};${display}"><span title="${production}">${value.crystal.toLocaleString()}</span></td>`;
                    }
                },
                {
                    key: 'sulfur',
                    headerHtml: `<th class="tnt_center" style="padding:4px;text-align:center;font-weight:bold;border:1px solid #000;background-color:#faeac6;${settings.showSulfur ? '' : 'display:none;'}">${tnt.dataCollector.getIcon(4)}</th>`,
                    getCellHtml: (value, cityID) => {
                        const display = settings.showSulfur ? '' : 'display:none;';
                        const cssClass = tnt.dataCollector.checkMinMax(value, 4);
                        const production = tnt.calc.production(cityID, 24).sulfur;
                        const bgColor = cssClass.includes('storage_min') ? '#FF000050' : '#fdf7dd';
                        const fontWeight = value.producedTradegood == 4 ? 'bold' : 'normal';
                        return `<td class="tnt_sulfur${cssClass}" style="padding:4px;text-align:right;border:1px solid #000;background-color:${bgColor};font-weight:${fontWeight};${display}"><span title="${production}">${value.sulfur.toLocaleString()}</span></td>`;
                    }
                }
            ];
        },

        getResourceCityCell(cityID, value) {
            const hasConstruction = value.buildings && Object.values(value.buildings).some(buildingArray =>
                Array.isArray(buildingArray) && buildingArray.some(building => building.underConstruction)
            );
            const constructionClass = hasConstruction ? ' tnt_construction' : '';

            let townHallLevel = '-';
            if (value && value.buildings && Array.isArray(value.buildings['townHall']) && value.buildings['townHall'].length > 0) {
                townHallLevel = value.buildings['townHall'].reduce((acc, b) => acc + (parseInt(b.level) || 0), 0);
            }

            return `
                <td class="tnt_city tnt_left${constructionClass}" style="padding:4px;text-align:left;border:1px solid #000;background-color:#fdf7dd;">
                    <a onclick='$("#dropDown_js_citySelectContainer li[selectValue=\\"${cityID}\\"]").trigger("click"); return false;'>
                        ${tnt.dataCollector.getIcon(value.producedTradegood)} ${tnt.get.cityName(cityID)}
                    </a>
                </td>
                <td style="padding:4px;text-align:center;border:1px solid #000;background-color:#fdf7dd;">${townHallLevel}</td>`;
        },

        getBuildingCityCell(cityID, value) {
            const hasConstruction = value.buildings && Object.values(value.buildings).some(buildingArray =>
                Array.isArray(buildingArray) && buildingArray.some(building => building.underConstruction)
            );
            const constructionClass = hasConstruction ? ' tnt_construction' : '';

            return `
                <td class="tnt_city tnt_left${constructionClass}" style="padding:4px;text-align:left;border:1px solid #000;background-color:#fdf7dd;">
                    <a onclick='$("#dropDown_js_citySelectContainer li[selectValue=\\"${cityID}\\"]").trigger("click"); return false;'>
                        ${tnt.dataCollector.getIcon(value.producedTradegood)} ${tnt.get.cityName(cityID)}
                    </a>
                </td>`;
        },

        getResourceTotalRow() {
            const totals = tnt.dataCollector.calculateTotals();
            let cells = '<td style="padding:4px;text-align:center;border:1px solid #000;background-color:#faeac6;"></td>';

            [
                { key: 'population', show: tnt.settings.getResourceDisplaySettings().showPopulation, value: totals.population },
                { key: 'citizens', show: tnt.settings.getResourceDisplaySettings().showCitizens, value: totals.citizens },
                { key: 'wood', show: tnt.settings.getResourceDisplaySettings().showWood, value: totals.wood },
                { key: 'wine', show: tnt.settings.getResourceDisplaySettings().showWine, value: totals.wine },
                { key: 'marble', show: tnt.settings.getResourceDisplaySettings().showMarble, value: totals.marble },
                { key: 'crystal', show: tnt.settings.getResourceDisplaySettings().showCrystal, value: totals.crystal },
                { key: 'sulfur', show: tnt.settings.getResourceDisplaySettings().showSulfur, value: totals.sulfur }
            ].forEach(col => {
                if (col.show) {
                    cells += `<td class="tnt_total" style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;font-weight:bold;">${col.value.toLocaleString()}</td>`;
                } else {
                    cells += `<td style="padding:4px;text-align:right;border:1px solid #000;background-color:#faeac6;display:none;"></td>`;
                }
            });

            return `
                <tr>
                    <td class="tnt_total" style="padding:4px;text-align:left;border:1px solid #000;background-color:#faeac6;font-weight:bold;">Total</td>
                    ${cells}
                </tr>`;
        },

        getBuildingTotalRow(mergedColumns) {
            return `
                <tr>
                    <td class="tnt_total" style="padding:4px;text-align:left;border:1px solid #000;background-color:#faeac6;font-weight:bold;">Total</td>
                    ${mergedColumns.map(() => '<td class="tnt_building_level" style="padding:4px;text-align:center;border:1px solid #000;background-color:#faeac6;"></td>').join('')}
                </tr>`;
        },

        attachEventHandlers() {
            // Panel minimize/maximize
            $('.tnt_panel_minimize_btn').off('click').on('click', function () {
                const $panel = $('#tnt_info_resources');
                const $btn = $(this);

                if ($panel.hasClass('minimized')) {
                    $panel.removeClass('minimized');
                    $btn.removeClass('tnt_foreward').addClass('tnt_back');
                } else {
                    $panel.addClass('minimized');
                    $btn.removeClass('tnt_back').addClass('tnt_foreward');
                }
            });

            // Toggle between resources/buildings tables
            $('.tnt_table_toggle_btn').off('click').on('click', function () {
                const $resourceContent = $('#tnt_info_resources_content');
                const $buildingContent = $('#tnt_info_buildings_content');

                if ($resourceContent.is(':visible')) {
                    $resourceContent.hide();
                    $buildingContent.show();
                    $(this).addClass('active');
                } else {
                    $buildingContent.hide();
                    $resourceContent.show();
                    $(this).removeClass('active');
                }
            });

            // Refresh all cities button
            $('.tnt_refresh_btn').off('click').on('click', function () {
                tnt.citySwitcher.start();
            });
        }

    },

    // Wait for city buildings to load before executing callback
    waitForCityBuildings: function (callback, maxAttempts = 20) {
        if ($("body").attr("id") !== "city") return callback();

        let attempts = 0;
        const checkBuildings = () => {
            const $positions = $("div[id^='js_CityPosition']");
            if ($positions.length) {
                const buildingClasses = $positions.map(function () {
                    return $(this).attr('class') || '';
                }).get();

                const hasBuildings = buildingClasses.some(classes =>
                    classes.split(/\s+/).some(c =>
                        !c.startsWith('position') &&
                        !c.startsWith('level') &&
                        !c.startsWith('buildingGround') &&
                        !c.startsWith('constructionSite') &&
                        c !== 'building'
                    )
                );

                if (hasBuildings) {
                    callback();
                    return;
                }
            }

            attempts++;
            if (attempts >= maxAttempts) {
                tnt.core.debug.log('Max attempts reached waiting for buildings, continuing anyway...', 1);
                callback();
                return;
            }

            setTimeout(checkBuildings, 200);
        };

        checkBuildings();
    },

    all() {
        // Handle tasks that should run on all pages
        tnt.features.removePremiumOffers();
        tnt.features.changeNavigationCoord();
    },

    city() {
        const settings = tnt.settings.getFeatureSettings();
        if (settings.removeFlyingShop) {
            $('.premiumOfferBox').hide();
        }
    },

    island() {
        const settings = tnt.settings.getFeatureSettings();
        if (settings.showCityLvl) {
            $('.cityinfo').each(function () {
                const level = $(this).find('.level').text();
                if (level) {
                    $(this).append(`<span class="tntLvl">${level}</span>`);
                }
            });
        }
    },

    world() {
        // Handle world map specific functionality
    },

    // Features module
    features: {
        removePremiumOffers: function () {
            const settings = tnt.settings.getFeatureSettings();
            if (settings.removePremiumOffers) {
                tnt.core.debug.log("Adding allRemovePremiumOffers styles...", 5);
                $('.premiumOffer, #js_TradegoodPremiumTraderButton, .getPremium, .ambrosia, #premium_btn, #js_togglePremiumOffers, #js_toggleAmbrosiaPremiumOffers, .resourceShop, li.slot1[onclick*="premiumTrader"]').hide();
            }
        },

        changeNavigationCoord: function () {
            const settings = tnt.settings.getFeatureSettings();
            if (settings.changeNavigationCoord) {
                tnt.core.debug.log("Changing navigation coordinates input types to number...", 5);
                $('#inputXCoord, #inputYCoord').attr('type', 'number');
            }
        }
    },

    // BEGIN: DO NOT MODIFY - Fixed logic
    // Legacy compatibility - Here all the communication with Ikariam is handled
    // Should only be changed by the core team
    // These has to work for the rest of the code to work properly. We keep them here so we only have to change them in one place.

    get: {
        playerId: () => tnt.game.player.getId(),
        cityId: () => tnt.game.city.getId(),
        cityLvl: () => tnt.game.city.getLevel(),
        cityIslandCoords: () => tnt.game.city.getCoordinates(),
        cityName: (id) => tnt.game.city.getName(id),
        producedTradegood: () => tnt.game.city.getProducedTradegood(),
        cityList: () => tnt.game.city.getList(),

        alliance: {
            Id: () => tnt.game.player.getAlliance().id
        },

        transporters: {
            free: () => tnt.game.military.getTransporters().free,
            max: () => tnt.game.military.getTransporters().max
        },

        resources: {
            wood: () => tnt.game.resources.getCurrent().wood,
            wine: () => tnt.game.resources.getCurrent().wine,
            marble: () => tnt.game.resources.getCurrent().marble,
            crystal: () => tnt.game.resources.getCurrent().crystal,
            sulfur: () => tnt.game.resources.getCurrent().sulfur
        },

        population: () => tnt.game.resources.getCurrent().population,
        citizens: () => tnt.game.resources.getCurrent().citizens,
        resourceProduction: () => tnt.game.resources.getProduction().resource,
        tradegoodProduction: () => tnt.game.resources.getProduction().tradegood,
        maxCapacity: () => tnt.game.resources.getCapacity().max,
        wineSpending: () => tnt.game.resources.getCapacity().wineSpending,

        gold: () => tnt.game.economy.getGold(),
        ambrosia: () => tnt.game.economy.getAmbrosia(),
        income: () => tnt.game.economy.getFinances().income,
        upkeep: () => tnt.game.economy.getFinances().upkeep,
        sciencetistsUpkeep: () => tnt.game.economy.getFinances().scientistsUpkeep,
        godGoldResult: () => tnt.game.economy.getFinances().godGoldResult,

        hasAlly: () => tnt.game.player.getAlliance().hasAlly,
        isOwnCity: () => tnt.game.city.isOwn()
    },

    has: {
        construction: () => tnt.utils.hasConstruction()
    },

    calc: {
        production: (cityID, hours) => tnt.utils.calculateProduction(cityID, hours)
    }

    // END: DO NOT MODIFY - Fixed logic
};

$(document).ready(() => tnt.core.init());

GM_addStyle(`
    /* Show level styles */
    .tntLvl{
        position:relative;
        top:10px;
        left:10px;
        color:black;
        line-height:13px;
        background:gold;
        font-size:9px;
        font-weight:bold;
        text-align:center;
        vertical-align:middle;
        height: 14px;
        width: 14px;
        border-radius: 50%;
        border: 1px solid #000;
        display: inline-block;
    }
    /* TNT table styles with higher specificity - override Ikariam's .table01 styles */
    body #tnt_info_resources #tnt_resource_table,
    body #tnt_info_buildings_content #tnt_building_table{
        border-collapse:collapse !important;
        font: 12px Arial, Helvetica, sans-serif !important;
        background-color: #fdf7dd !important;
    }
    body #tnt_info_resources #tnt_resource_table td,
    body #tnt_info_buildings_content #tnt_building_table td{
        border:1px #000000 solid !important;
        padding:4px !important;
        text-align:center !important;
        vertical-align:middle !important;
        background-color: #fdf7dd !important;
    }
    /* Apply subcategory header height to table row instead of individual cells */
    body #tnt_info_resources #tnt_resource_table tr.tnt_subcategory_header,
    body #tnt_info_buildings_content #tnt_building_table tr.tnt_subcategory_header {
        height: 41px !important;
    }
    body #tnt_info_resources #tnt_resource_table th,
    body #tnt_info_buildings_content #tnt_building_table th{
        border:1px #000000 solid !important;
        padding:4px !important;
        text-align:center !important;
        vertical-align:middle !important;
        background-color: #faeac6 !important;
        font-weight: bold !important;
        height: auto !important;
    }
    body #tnt_info_resources #tnt_resource_table tr.tnt_subcategory_header th,
    body #tnt_info_buildings_content #tnt_building_table tr.tnt_subcategory_header th {
        height: 41px !important;
        line-height: 41px !important;
    }
    
    body #tnt_info_buildings_content #tnt_building_table th.tnt_category_spacer {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 4px !important;
        text-align:center !important;
    }
    body #tnt_info_buildings_content #tnt_building_table th.tnt_category_header {
        background-color: #DBBE8C !important;
        border: 1px solid #000 !important;
        padding: 4px !important;
        font-weight: bold !important;
        text-align: center !important;
        height: auto !important;
    }
    body #tnt_info_resources #tnt_resource_table td.tnt_total,
    body #tnt_info_buildings_content #tnt_building_table td.tnt_total {
        background-color: #faeac6 !important;
        font-weight: bold !important;
        height: auto !important;
    }
    .storage_min{
        background-color: #FF000050 !important;
    }
    .storage_danger{
        color: #FF000050 !important;
    }
    /* Construction status styling applies to the first cell in any row across all tables */
    .tnt_construction{
        background-color: #80404050 !important;
    }
    /* Current city highlighting with 2px black border - no background change */
    body #tnt_info_resources .tnt_selected,
    body #tnt_info_buildings_content .tnt_selected {
        border: 2px solid black !important;
    }
    body #tnt_info_resources .tnt_selected td,
    body #tnt_info_buildings_content .tnt_selected td {
        border-top: 2px solid black !important;
        border-bottom: 2px solid black !important;
        color: #000 !important;
    }
    body #tnt_info_resources .tnt_selected td:first-child,
    body #tnt_info_buildings_content .tnt_selected td:first-child {
        border-left: 2px solid black !important;
    }
    body #tnt_info_resources .tnt_selected td:last-child,
    body #tnt_info_buildings_content .tnt_selected td:last-child {
        border-right: 2px solid black !important;
    }
    /* Make tradegood production more visible with dark grey text color */
    body #tnt_info_resources .tnt_bold,
    body #tnt_info_buildings_content .tnt_bold {
        color: #333333 !important;
        font-weight: bold !important;
    }
    .tnt_resource_icon{
        vertical-align:middle !important;
        width:18px !important;
        height:16px !important;
        display:inline-block !important;
    }
    .tnt_building_icon {
        width: 36px !important;
        height: 32px !important;
    }
    img[src*='/city/wall.png'].tnt_building_icon {
        transform: scale(0.8) !important;
        transform-origin: 0 0;
        margin-right: -8px;
    }
    body #tnt_info_resources .tnt_population{ text-align:right !important; }
    body #tnt_info_resources .tnt_citizens{ text-align:right !important; }
    body #tnt_info_resources .tnt_wood{ text-align:right !important; }
    body #tnt_info_resources .tnt_marble{ text-align:right !important; }
    body #tnt_info_resources .tnt_wine{ text-align:right !important; }
    body #tnt_info_resources .tnt_crystal{ text-align:right !important; }
    body #tnt_info_resources .tnt_sulfur{ text-align:right !important; }
    body #tnt_info_resources .tnt_city{ text-align:left !important; }
    body #tnt_info_buildings_content .tnt_city{ text-align:left !important; }
    body #tnt_info_buildings_content .tnt_building_level{ text-align:center !important; }
    
    /* Override Ikariam's container table styles specifically for our TNT tables */
    #container body #tnt_info_resources #tnt_resource_table.table01,
    #container body #tnt_info_buildings_content #tnt_building_table.table01 {
        border: none !important;
        margin: 0px !important;
        background-color: #fdf7dd !important;
        border-bottom: none !important;
        text-align: center !important;
        width: auto !important;
    }
    #container body #tnt_info_resources #tnt_resource_table.table01 td,
    #container body #tnt_info_buildings_content #tnt_building_table.table01 td {
        text-align: center !important;
        vertical-align: middle !important;
        padding: 4px !important;
        border: 1px #000000 solid !important;
    }
    #container body #tnt_info_resources #tnt_resource_table.table01 th,
    #container body #tnt_info_buildings_content #tnt_building_table.table01 th {
        background-color: #faeac6 !important;
        text-align: center !important;
        height: auto !important;
        padding: 4px !important;
        font-weight: bold !important;
        border: 1px #000000 solid !important;
    }
    
    #mainview a:hover{ text-decoration:none; }
    #tntOptions {
        position:absolute;
        top:40px;
        left:380px;
        width:620px;
        border:1px #755931 solid;
        border-top:none;
        background-color: #FEE8C3;
        padding:10px 10px 0px   10px;
    }

    #tntOptions legend{ font-weight:bold; }
    .tntHide, #infocontainer .tntLvl, #actioncontainer .tntLvl{ display:none; }
    #tntInfoWidget {
        position:fixed;
        bottom:0px;
        left:0px;
        width:716px;
        background-color: #DBBE8C;
        z-index:100000000;
    }
    #tntInfoWidget .accordionTitle {

        background: url(/cdn/all/both/layout/bg_maincontentbox_header.jpg) no-repeat;
        padding: 6px 0 0;
        width: 728px;
    }
    #tntInfoWidget .accordionContent {
        background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) left center repeat-y #FAF3D7;
        overflow: hidden;
        padding: 0;
        position: relative;
        width: 725px;
    }
    #tntInfoWidget .scroll_disabled {
        background: url(/cdn/all/both/layout/bg_maincontentbox_left.png) repeat-y scroll left center transparent;
        width: 9px;
    }
    #tntInfoWidget .scroll_area {
        background: url(/cdn/all/both/interface/scroll_bg.png) right top repeat-y transparent;
        display: block;
        height: 100%;
        overflow: hidden;
        position: absolute;
        right: -3px;
        width: 24px;
        z-index: 100000;
    }
    .txtCenter{ text-align:center; }
    .tnt_center{ text-align:center!important; white-space:nowrap; }
    .tnt_right{ text-align:right!important; white-space:nowrap; }
    .tnt_left{ text-align:left!important; white-space:nowrap; }
    #tnt_info_resources{
        position:fixed;
        bottom:20px;
        left:0px;
        width:auto;
        height:auto;
        background-color: #DBBE8C;
        z-index:100000000;
    }
    #tnt_info_resources .tnt_back, #tnt_info_resources .tnt_foreward {
        background: url(/cdn/all/both/interface/window_control_sprite.png) no-repeat scroll transparent;
        cursor: pointer;
        display: block!important;
        height: 18px;
        width: 18px;
    }
    #tnt_info_resources .tnt_back {
        left: 2px;
        position: absolute;
        top: 2px;
        background-position: -197px 0;
    }
    #tnt_info_resources .tnt_back:hover {
        background-position: -197px -18px;
    }
    #tnt_info_resources .tnt_foreward {
        left: 2px;
        position: absolute;
        top: 3px;
        background-position: -197px 0;
        transform: rotate(180deg);
    }
    #tnt_info_resources .tnt_foreward:hover {
        background-position: -197px -18px;
    }
    #tnt_info_updateCities {
        position:fixed;
        bottom:20px;
        right:0px;
        width:auto;
        height:auto;
        background-color: #DBBE8C;
        z-index:100000000;
    }
    .tnt_panel_minimize_btn {
        background: url(/cdn/all/both/interface/window_control_sprite.png) no-repeat scroll transparent;
        cursor: pointer;
        display: block!important;
        height: 18px;
        width: 18px;
        position: absolute;
        left: 2px;
        top: 2px;
        z-index: 10;
    }
    .tnt_panel_minimize_btn.tnt_back { background-position: -197px 0; }
    .tnt_panel_minimize_btn.tnt_back:hover { background-position: -197px -18px; }
    .tnt_panel_minimize_btn.tnt_foreward { background-position: -197px 0; transform: rotate(180deg); top: 3px; }
    .tnt_panel_minimize_btn.tnt_foreward:hover { background-position: -197px -18px; }
    .tnt_table_toggle_btn {
        background: url(/cdn/all/both/interface/window_control_sprite.png) no-repeat scroll transparent;
        cursor: pointer;
        display: inline-block;
        height: 18px;
        width: 18px;
        vertical-align: middle;
        float: right;
        margin-left: 6px;
        background-position: -179px 0;
    }
    .tnt_table_toggle_btn:hover { background-position: -179px -18px; }
    .tnt_city .tnt_panel_minimize_btn { float: left; margin-right: 2px; }
    #tnt_info_resources.minimized {
        width: 25px!important;
        min-width: 25px!important;
        max-width: 25px!important;
        overflow: hidden!important;
    }
    #tnt_military_overview {
        position: fixed;DBBE8C;
        top: 20px;   z-index: 100000000;
        right: 0px;
        width: auto;
        background-color: #DBBE8C;
        z-index: 100000000;
    }
    #tnt_military_header {
        padding: 5px;
        cursor: pointer;
        font-weight: bold;
    }
    #tnt_military_table {
        border-collapse: collapse;
        font: 12px Arial, Helvetica, sans-serif;
    }
    #tnt_military_table td, #tnt_military_table th {
        border: 1px #000000 solid;   margin: 2px 0;
        padding: 2px !important;
    }
        padding: 3px;   background-color: rgba(255,0,0,0.2);
        margin: 2px 0;
    }
    .movement.attack {
        background-color: rgba(255,0,0,0.2);
    }
    #tnt_building_table th:first-child {
        background-color: rgba(255,255,255,0);
        border: none !important;
    }
    #tnt_building_table th.tnt_category_spacer {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 4px !important;
    }
    #tnt_building_table th.tnt_category_header {
        background-color: #DBBE8C !important;
        border: 1px solid #000 !important;
        padding: 4px !important;
        font-weight: bold;
        text-align: center !important;
    }

    /* Set fixed height for subcategory header rows */
    tr.tnt_subcategory_header {
        height: 41px !important;
    }

    .tnt_refresh_btn {
        background: url(/cdn/all/both/interface/window_control_sprite.png) no-repeat scroll transparent;
        cursor: pointer;
        display: inline-block;
        height: 18px;
        width: 18px;
        vertical-align: middle;
        position: absolute;
        background-position: -215px 0;
    }
    .tnt_refresh_btn:hover { background-position: -215px -18px; }
`);
// ==UserScript==
// @name         SilverScripts
// @namespace    http://tampermonkey.net/
// @version      7.9.2
// @description  Find out prices of items in your inventory by hovering over them while at the Marketplace, in the Inner City, or whilst browsing your Inventory in the Outpost, automatically use services, edit and equip Quickswaps/Loadouts, and more!
// @author       SilverBeam
// @exclude      https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=login2
// @exclude      https://fairview.deadfrontier.com/onlinezombiemmo/index.php?action=logout*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/index.php*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @match        https://fairview.deadfrontier.com/onlinezombiemmo/
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_openInTab
// @grant        GM.openInTab
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/534322/SilverScripts.user.js
// @updateURL https://update.greasyfork.org/scripts/534322/SilverScripts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //////////////////////////////
    //  Variables Declaration   //
    /////////////////////////////

    var userVars = unsafeWindow.userVars;
    var globalData = unsafeWindow.globalData;
    var infoBox = unsafeWindow.infoBox;
    var itemsDataBank = {};
    var servicesDataBank = {};
    var inventoryArray = [];
    var loadouts = [];
    var pickingLoadoutCategory = "";
    var pickingLoadoutSlotIndex = -1;
    var activeLoadoutEdit = -1;
    var lastSlotHovered = -1;
    unsafeWindow.tooltipDisplaying = false;
    var userData = {};
    var savedMarketData = {
        "requestsIssued": 0,
        "previousDataTimestamp": 0,
        "previousItemTimestamp": {},
        "previousServicesTimestamp": 0,
        "itemsDataBank": {},
        "servicesDataBank": {}
    };
    var characterCookieData = {};
    var lastActiveUserID = null;
    var lastQuickSwitcherPage = -1;
    var REQUEST_LIMIT = 17;
    var userSettings = {
        "hoverPrices": true,
        "autoService": true,
        "autoMarketWithdraw": true,
        "alwaysDisplayQuickSwitcher": false,
        "innerCityButton": true
    }; //Default Settings
    var GREASYFORK_SCRIPT_ID = 383308;
    var updateCheck = {
        "skipVer": "0.0.0",
        "lastCheck": "1980-01-01"
    };
    var uploadedVersion; //This is saved here to avoid calling 2 times the GM library

    var pendingRequests = {
        "requestsNeeded": 0,
        "requestsCompleted": 0,
        "requesting": false,
        "requestsCooldownPeriod": 500, //Minimum time before another refresh is issued again after an inventory change
        "requestsCoolingDown": false
    };

    var locations = {
        "inventories": [
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25",
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35",
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24",
            "fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50",
            "fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31",
        ],
        "marketplace": ["fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35"],
        "yard": ["fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24"],
        "storage": ["fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50"],
        "innerCity": ["fairview.deadfrontier.com/onlinezombiemmo/index.php?page=21"],
        "ICInventory": ["fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31"],
        "forum": ["fairview.deadfrontier.com/onlinezombiemmo/index.php?board=", "fairview.deadfrontier.com/onlinezombiemmo/index.php?action=forum", "fairview.deadfrontier.com/onlinezombiemmo/index.php?topic="]
    };

    var helpWindow = unsafeWindow.df_prompt;

    var helpWindowStructure = {
        "home": {
            "data": [
                ["span", "Welcome to SilverScripts Help and Settings!", []],
                ["p", " ", []],
                ["button", "AutoService Help", [], openHelpWindowPage, ["autoService"]],
                ["button", "AutoService not working?", [], openHelpWindowPage, ["serviceReadme"]],
                ["button", "MarketWithdraw Help", [], openHelpWindowPage, ["marketWithdraw"]],
                ["button", "Settings", [], openHelpWindowPage, ["settings"]],
                ["button", "Close", [], closeHelpWindowPage, []]
            ],
            "style": [
                ["height", "145px"]
            ]
        },
        "serviceReadme": {
            "data": [
                ["span", "Warning!Prices are updated only when something in the inventory changes. If you are unable to purchase a service, move an item in the inventory around to refresh services data!", []],
                ["p", "", []],
                ["div", "", [],
                    [
                        ["button", "Back", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, openHelpWindowPage, ["home"]],
                        ["button", "Close", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }, closeHelpWindowPage, []]
                    ]
                ]
            ],
            "style": [
                ["height", "160px"]
            ]
        },
        "autoService": {
            "data": [
                ["span", "If you hold the <span style='color: #ff0000;'>[ALT]</span> key while hovering on a serviceable item, a prompt will appear. By ALT+Clicking, the relevant service for that item will be automatically bought from the market.", []],
                ["p", "", []],
                ["div", "", [],
                    [
                        ["button", "Back", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, openHelpWindowPage, ["home"]],
                        ["button", "Close", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }, closeHelpWindowPage, []]
                    ]
                ]
            ],
            "style": [
                ["height", "170px"]
            ]
        },
        "marketWithdraw": {
            "data": [
                ["span", "If you don't have enough cash to buy an item, the <span style='color: #ff0000;'>buy</span> button is replaced by a <span style='color: #ff0000;'>withdraw</span> button. By pressing it, the necessary cash will be withdrawn from your bank. The button is disabled if the bank doesn't have enough cash. This function can be disabled in the settings.", []],
                ["p", "", []],
                ["div", "", [],
                    [
                        ["button", "Back", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, openHelpWindowPage, ["home"]],
                        ["button", "Close", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }, closeHelpWindowPage, []]
                    ]
                ]
            ],
            "style": [
                ["height", "205px"]
            ]
        },
        "settings": {
            "data": [
                ["button", "Disable HoverPrices", [], flipSetting, ["hoverPrices", 0]],
                ["button", "Disable AutoService", [], flipSetting, ["autoService", 1]],
                ["button", "Disable AutoMarketWithdraw", [], flipSetting, ["autoMarketWithdraw", 2]],
                ["button", "Enable AlwaysDisplayQuickSwitcher", [], flipSetting, ["alwaysDisplayQuickSwitcher", 3]],
                ["button", "Disable InnerCityButton", [], flipSetting, ["innerCityButton", 4]],
                ["p", "", []],
                ["div", "", [],
                    [
                        ["button", "Back", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, openHelpWindowPage, ["home"]],
                        ["button", "Close", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }, closeHelpWindowPage, []]
                    ]
                ]
            ],
            "style": [
                ["height", "140px"],
                ["width", "300px"]
            ]
        },
        "loadoutsMenu": {
            "data": [
                ["button", "Equip Quickswap", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "30px"]
                    ]
                }, loadoutOpenEquipMenu, []],
                ["button", "Edit Quickswap", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "30px"]
                    ]
                }, loadoutOpenEditMenu, []],
                ["button", "Reset Quickswap", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "30px"]
                    ]
                }, loadoutOpenResetMenu, []],
                ["button", "Export Quickswaps", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "30px"]
                    ]
                }, exportLoadoutsToJson, []],
                ["button", "Import Quickswaps", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "30px"]
                    ]
                }, importLoadoutsFromJson, []],
                //["button","Remove Cosmetic Set",{"style":[["position","absolute"],["left","30px"]]},loadoutOpenResetMenu,[]],
                ["p", "", []],
                ["button", "Close", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "30px"]
                    ]
                }, closeHelpWindowPage, []]
            ],
            "style": [
                ["height", "130px"],
                ["width", "300px"]
            ]
        },
        "loadoutsListEquip": {
            "data": [
                ["div", "", [],
                    [
                        ["button", "Equip Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, equipLoadout, [0]],
                        ["span", "1", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["div", "", [],
                    [
                        ["button", "Equip Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, equipLoadout, [1]],
                        ["span", "2", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["div", "", [],
                    [
                        ["button", "Equip Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, equipLoadout, [2]],
                        ["span", "3", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["div", "", [],
                    [
                        ["button", "Equip Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, equipLoadout, [3]],
                        ["span", "4", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["p", "", []],
                ["div", "", [],
                    [
                        ["button", "Back", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, openHelpWindowPage, ["loadoutsMenu"]],
                        ["button", "Close", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }, closeHelpWindowPage, []]
                    ]
                ]
            ],
            "style": [
                ["height", "130px"],
                ["width", "300px"]
            ]
        },
        "loadoutsListEdit": {
            "data": [
                ["div", "", [],
                    [
                        ["button", "Edit Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, editLoadout, [0]],
                        ["span", "1", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["div", "", [],
                    [
                        ["button", "Edit Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, editLoadout, [1]],
                        ["span", "2", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["div", "", [],
                    [
                        ["button", "Edit Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, editLoadout, [2]],
                        ["span", "3", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["div", "", [],
                    [
                        ["button", "Edit Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, editLoadout, [3]],
                        ["span", "4", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["p", "", []],
                ["div", "", [],
                    [
                        ["button", "Back", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, openHelpWindowPage, ["loadoutsMenu"]],
                        ["button", "Close", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }, closeHelpWindowPage, []]
                    ]
                ]
            ],
            "style": [
                ["height", "130px"],
                ["width", "300px"]
            ]
        },
        "loadoutEdit": {
            "data": [
                ["p", "", []],
                ["div", "", [],
                    [
                        ["button", "Quickswap Name:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "70px"]
                            ]
                        }, renameLoadout, []],
                        ["span", "name", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "70px"]
                            ]
                        }]
                    ]
                ],
                ["p", "", []],
                ["div", "", [],
                    [
                        ["span", "Armor", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "100px"]
                            ]
                        }],
                        ["span", "Backpack", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "80px"]
                            ]
                        }],
                    ]
                ],
                ["div", "", [],
                    [
                        ["div", "", [],
                            [
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "100px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot armour",
                                        "id": "armour_0"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["right", "100px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot backpack",
                                        "id": "backpack_0"
                                    },
                                    []
                                ],
                            ]
                        ],
                    ]
                ],
                ["p", "", []],
                ["p", "", []],
                ["span", "Weapons", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "155px"]
                    ]
                }],
                ["div", "", [],
                    [
                        ["div", "", {
                                "style": [
                                    ["position", "absolute"],
                                    ["left", "100px"]
                                ],
                                "className": "slot validSlot silverScriptsSlot weapon",
                                "id": "weapon_0"
                            },
                            []
                        ],
                        ["div", "", {
                                "style": [
                                    ["position", "absolute"],
                                    ["left", "160px"]
                                ],
                                "className": "slot validSlot silverScriptsSlot weapon",
                                "id": "weapon_1"
                            },
                            []
                        ],
                        ["div", "", {
                                "style": [
                                    ["position", "absolute"],
                                    ["left", "220px"]
                                ],
                                "className": "slot validSlot silverScriptsSlot weapon",
                                "id": "weapon_2"
                            },
                            []
                        ],
                    ]
                ],
                ["p", "", []],
                ["p", "", []],
                ["span", "Implants", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "148px"]
                    ]
                }],
                ["div", "", {
                        "style": [
                            ["position", "absolute"],
                            ["width", "100%"],
                            ["height", "176px"]
                        ]
                    },
                    [
                        ["div", "", {
                                "style": [
                                    ["position", "absolute"],
                                    ["left", "100px"],
                                    ["width", "100%"],
                                    ["height", "44px"]
                                ]
                            },
                            [
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "0px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_0"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "44px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_1"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "88px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_2"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "132px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_3"
                                    },
                                    []
                                ],
                            ]
                        ],
                        ["div", "", {
                                "style": [
                                    ["position", "absolute"],
                                    ["left", "100px"],
                                    ["top", "44px"],
                                    ["width", "100%"],
                                    ["height", "44px"]
                                ]
                            },
                            [
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "0px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_4"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "44px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_5"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "88px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_6"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "132px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_7"
                                    },
                                    []
                                ],
                            ]
                        ],
                        ["div", "", {
                                "style": [
                                    ["position", "absolute"],
                                    ["left", "100px"],
                                    ["top", "88px"],
                                    ["width", "100%"],
                                    ["height", "44px"]
                                ]
                            },
                            [
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "0px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_8"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "44px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_9"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "88px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_10"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "132px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_11"
                                    },
                                    []
                                ],
                            ]
                        ],
                        ["div", "", {
                                "style": [
                                    ["position", "absolute"],
                                    ["left", "100px"],
                                    ["top", "132px"],
                                    ["width", "100%"],
                                    ["height", "44px"]
                                ]
                            },
                            [
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "0px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_12"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "44px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_13"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "88px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_14"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "132px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_15"
                                    },
                                    []
                                ],
                            ]
                        ],
                        ["div", "", {
                                "style": [
                                    ["position", "absolute"],
                                    ["left", "100px"],
                                    ["top", "176px"],
                                    ["width", "100%"],
                                    ["height", "44px"]
                                ]
                            },
                            [
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "0px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_16"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "44px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_17"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "88px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_18"
                                    },
                                    []
                                ],
                                ["div", "", {
                                        "style": [
                                            ["position", "absolute"],
                                            ["left", "132px"]
                                        ],
                                        "className": "slot validSlot silverScriptsSlot implant",
                                        "id": "implant_19"
                                    },
                                    []
                                ],
                            ]
                        ],
                    ]
                ],
                ["div", "", {
                        "style": [
                            ["position", "absolute"],
                            ["bottom", "20px"],
                            ["width", "100%"]
                        ]
                    },
                    [
                        ["button", "Back", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, loadoutOpenEditMenu, []],
                        //["button","Use as Cosmetic",{"style":[["position","absolute"],["left","130px"]]},makeLoadoutCosmetic,[]],
                        ["button", "Equip", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }, equipCurrentLoadout, []],
                    ]
                ]
            ],
            "style": [
                ["height", "500px"],
                ["width", "375px"],
                ["top", "0px"],
                ["left", "125px"]
            ]
        },
        "loadoutsListReset": {
            "data": [
                ["div", "", [],
                    [
                        ["button", "Reset Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, resetLoadoutButton, [0]],
                        ["span", "1", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["div", "", [],
                    [
                        ["button", "Reset Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, resetLoadoutButton, [1]],
                        ["span", "2", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["div", "", [],
                    [
                        ["button", "Reset Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, resetLoadoutButton, [2]],
                        ["span", "3", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["div", "", [],
                    [
                        ["button", "Reset Quickswap:", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, resetLoadoutButton, [3]],
                        ["span", "4", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }]
                    ]
                ],
                ["p", "", []],
                ["div", "", [],
                    [
                        ["button", "Back", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, openHelpWindowPage, ["loadoutsMenu"]],
                        ["button", "Close", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }, closeHelpWindowPage, []]
                    ]
                ]
            ],
            "style": [
                ["height", "130px"],
                ["width", "300px"]
            ]
        },
        "updateAvailable": {
            "data": [
                ["span", "A new update for <span style='color: #ff0000;'>SilverScripts</span> is available. Please update the script through <span style='color: #ff0000;'>TamperMonkey's</span> interface.", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "20px"],
                        ["right", "20px"],
                        ["top", "10px"]
                    ]
                }],
                ["p", "", []],
                ["button", "Go to install page", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "30px"],
                        ["bottom", "90px"]
                    ]
                }, openScriptGMPage, []],
                ["button", "Show changelog", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "30px"],
                        ["bottom", "70px"]
                    ]
                }, openHelpWindowPage, ["changelog"]],
                ["button", "Remind me later", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "30px"],
                        ["bottom", "50px"]
                    ]
                }, closeHelpWindowPage, []],
                ["button", "Stop reminding me", {
                    "style": [
                        ["position", "absolute"],
                        ["left", "30px"],
                        ["bottom", "30px"]
                    ]
                }, stopUpdateReminderForCurVer, []],
            ],
            "style": [
                ["height", "230px"],
                ["width", "300px"]
            ]
        },
        "changelog": {
            "data": [
                ["span", "Changelog text here", {}],
                ["div", "", {},
                    [
                        ["button", "Back", {
                            "style": [
                                ["position", "absolute"],
                                ["left", "30px"]
                            ]
                        }, openHelpWindowPage, ["updateAvailable"]],
                        ["button", "Close", {
                            "style": [
                                ["position", "absolute"],
                                ["right", "30px"]
                            ]
                        }, closeHelpWindowPage, []]
                    ]
                ]
            ],
            "style": [
                ["height", "160px"]
            ]
        },
    }


    //////////////////////////
    //  Utility Functions   //
    /////////////////////////

    function getItemsDataBank() {
        return itemsDataBank;
    }
    unsafeWindow.getSilverItemsDataBank = getItemsDataBank;

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function lowerFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }

    function flipSetting(settingName, settingIndex) {
        var oldValue = userSettings[settingName];
        if (oldValue == true) {
            userSettings[settingName] = false;
            helpWindowStructure["settings"]["data"][settingIndex][1] = "Enable " + capitalizeFirstLetter(settingName);
        } else {
            userSettings[settingName] = true;
            helpWindowStructure["settings"]["data"][settingIndex][1] = "Disable " + capitalizeFirstLetter(settingName);
        }
        GM.setValue("userSettings", JSON.stringify(userSettings));
        //Trick to refresh the menu
        openHelpWindowPage("settings");
    }

    function refreshMarketSearch() {
        var itemDisplay = document.getElementById("itemDisplay");
        itemDisplay.scrollTop = 0;
        itemDisplay.scrollLeft = 0;
        unsafeWindow.search();
    }

    function serializeObject(obj) {
        var pairs = [];
        for (var prop in obj) {
            if (!obj.hasOwnProperty(prop)) {
                continue;
            }
            pairs.push(prop + '=' + obj[prop]);
        }
        return pairs.join('&');
    }

    function makeRequest(requestUrl, requestParams, callbackFunc, callBackParams) {

        requestParams["pagetime"] = userVars["pagetime"];
        requestParams["templateID"] = "0";
        requestParams["sc"] = userVars["sc"];
        requestParams["gv"] = 42;
        requestParams["userID"] = userVars["userID"];
        requestParams["password"] = userVars["password"];

        return new Promise((resolve) => {
            var xhttp = new XMLHttpRequest();
            var payload = null;
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    //Invoke the callback with the request response text and some parameters, if any were supplied
                    //then resolve the Promise with the callback's reponse
                    let callbackResponse = null;
                    if (callbackFunc != null) {
                        callbackResponse = callbackFunc(this.responseText, callBackParams);
                    }
                    if (callbackResponse == null) {
                        callbackResponse = true;
                    }
                    resolve(callbackResponse);
                }
            };

            payload = serializeObject(requestParams);

            xhttp.open("POST", requestUrl, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.setRequestHeader("x-requested-with", "SilverScriptRequest");
            payload = "hash=" + unsafeWindow.hash(payload) + "&" + payload;
            xhttp.send(payload);
        });
    }

    function cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

    function getImplantRestrictions(itemFlashType) {
        //Strip possible extra data from the implant
        var itemBaseFlashType = itemFlashType.split("_")[0];
        //Fetch info on the target implant
        var restrictions = {
            "forbiddenImplants": [],
            "isUnique": false
        };
        if (globalData[itemBaseFlashType]["implant_block"]) {
            restrictions["forbiddenImplants"] = globalData[itemBaseFlashType]["implant_block"].split(',');
        }

        if (globalData[itemBaseFlashType]["implant_unique"] && globalData[itemBaseFlashType]["implant_unique"] == "1") {
            restrictions["isUnique"] = true;
        }
        return restrictions;
    }

    function secondsToHms(d) {
        d = parseInt(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h < 10 ? "0" + h : h;
        var mDisplay = m < 10 ? "0" + m : m;
        var sDisplay = s < 10 ? "0" + s : s;
        return hDisplay + ":" + mDisplay + ":" + sDisplay;
    }

    function isAtLocation(location) {
        //Make an exception check for the homepage as its address is contained in each one
        if (location == "home") {
            if (window.location.href.split("fairview.deadfrontier.com/onlinezombiemmo/index.php")[1] == "" ||
                window.location.href.split("fairview.deadfrontier.com/onlinezombiemmo/")[1] == "") {
                return true;
            } else {
                return false;
            }
        }
        //Check if location name exists first
        if (locations[location] != undefined) {
            for (var i = 0; i < locations[location].length; i++) {
                if (window.location.href.indexOf(locations[location][i]) != -1) {
                    return true;
                }
            }
        }
        return false;
    }

    //Old version of the history func from GreasyFork API: https://greasyfork.org/scripts/445697/code/index.js?version=1055427
    async function getScriptHistory(scriptId) {
        return fetch(`https://greasyfork.org/scripts/${scriptId}/versions`).then((r) =>
            r.text()
        ).then((c) => {
            let parser = new DOMParser();
            let list = parser.parseFromString(c, 'text/html').querySelectorAll('.history_versions li'),
                result = []
            for (let i of list) {
                let ver = i.children[1].children[0],
                    time = i.children[2],
                    log = i.children[3]

                result.push({
                    version: {
                        id: +(ver.href.match(/\?version=\d.+/)[0].replace('?version=', '')),
                        text: ver.innerText,
                        url: ver.href
                    },
                    time: {
                        text: time.innerText,
                        iso: time.attributes.datetime.value
                    },
                    changelog: log ? {
                        html: log.innerHTML,
                        text: log.innerText
                    } : null
                })
            }
            return result
        })
    }

    function getLatestScriptVersionFromHistory(history) {
        //The fetched history is already sorted from newest to oldest
        //but every version is prepended by a "v", so cut it
        return history[0].version.text.substring(1);
    }

    async function checkForScriptUpdate() {
        if (isAtLocation("ICInventory") || isAtLocation("forum")) {
            return;
        }

        updateCheck = JSON.parse(await GM.getValue("updateCheck", JSON.stringify(updateCheck)));
        var lastCheckDate = new Date(updateCheck["lastCheck"]);
        var daysElapsedSinceLastCheck = Math.ceil((Date.now() - lastCheckDate) / (1000 * 60 * 60 * 24));
        if (daysElapsedSinceLastCheck <= 1) {
            return;
        }

        //Get script history and local/uploaded script versions
        var history = await getScriptHistory(GREASYFORK_SCRIPT_ID);
        uploadedVersion = getLatestScriptVersionFromHistory(history);
        var localVersion = GM.info.script.version;

        //Check if local version is lesser than uploaded version
        var needsUpdate = uploadedVersion.localeCompare(localVersion, undefined, {
            numeric: true,
            sensitivity: 'base'
        }) == 1;
        //Check if the user has asked to skip or remind later, and that a day has elapsed
        var isVersionAfterSkip = uploadedVersion.localeCompare(updateCheck["skipVer"], undefined, {
            numeric: true,
            sensitivity: 'base'
        }) == 1;

        if (needsUpdate && isVersionAfterSkip) {
            //Save the new version changelog into its menu page
            helpWindowStructure["changelog"]["data"][0][1] = history[0]["changelog"]["html"].trim();
            //Adjust menu height depending on changelog length. Simulate its height when open.
            helpWindow.style.position = "absolute";
            helpWindow.style.left = "208px";
            helpWindow.style.top = "195px";
            helpWindow.style.width = "270px";
            helpWindow.style.height = "100px";
            helpWindow.style.opacity = "0";
            helpWindow.parentNode.style.display = "block";
            helpWindow.innerHTML = "<span id='testSpan'>" + helpWindowStructure["changelog"]["data"][0][1] + "</span>";
            var helpWindowHeight = document.getElementById("testSpan").offsetHeight;
            helpWindowStructure["changelog"]["style"][0][1] = (65 + helpWindowHeight) + "px";
            helpWindow.style.opacity = "1";
            closeHelpWindowPage();

            openHelpWindowPage("updateAvailable");
        }

        //Save current date, we already checked for the day
        updateCheck["lastCheck"] = Date.now();
        GM.setValue("updateCheck", JSON.stringify(updateCheck));

    }

    function openScriptGMPage() {
        window.open(`https://greasyfork.org/scripts/${GREASYFORK_SCRIPT_ID}/code/source.user.js`)
    }

    function stopUpdateReminderForCurVer() {
        //Save the uploaded version as the version to ignore when performing an update check
        updateCheck["skipVer"] = uploadedVersion;
        GM.setValue("updateCheck", JSON.stringify(updateCheck));

        closeHelpWindowPage();
    }

    function updateInventoryData(inventoryData) {
        unsafeWindow.updateIntoArr(unsafeWindow.flshToArr(inventoryData, "DFSTATS_"), unsafeWindow.userVars);
        unsafeWindow.populateInventory();
        unsafeWindow.populateCharacterInventory();
        unsafeWindow.updateAllFields();
        initInventoryArray();
    }

    function getLevelAppropriateMedicalTypeList() {

        var playerLevel = userVars["DFSTATS_df_level"];

        //Chain IFs instead of using Switch bacause that is the ugly but recommended way
        if (playerLevel < 11) {
            return ["steristrips", "plasters"]
        }
        if (playerLevel >= 11 && playerLevel < 21) {
            return ["antisepticspray", "antibiotics"]
        }
        if (playerLevel >= 21 && playerLevel < 31) {
            return ["bandages"]
        }
        if (playerLevel >= 31 && playerLevel < 41) {
            return ["morphine"]
        }
        if (playerLevel >= 41 && playerLevel < 71) {
            return ["nerotonin"]
        }
        if (playerLevel >= 71) {
            return ["nerotonin8b", "steroids"]
        }
        return [];
    }

    function getBestLevelAppropriateMedicalTypeAndAdministerNeed() {

        var damagePercentage = (userVars["DFSTATS_df_hpmax"] / userVars["DFSTATS_df_hpcurrent"]) * 100;
        var medList = getLevelAppropriateMedicalTypeList();
        var chosenMed = "";
        var needAdminister = true;
        var medType, medItem;

        //Use the fact that the array is already sorted
        for (medType of medList) {
            medItem = globalData[medType];
            medItem["healthrestore"] = parseInt(medItem["healthrestore"]);
            medItem["adminhealthrestore"] = medItem["healthrestore"] * 3;

            //Swap to cheaper med if it still lets the player reach max health
            if (chosenMed != "") {
                if (medItem["adminhealthrestore"] >= damagePercentage) {
                    chosenMed = medType;
                } else {
                    break;
                }
            } else {
                chosenMed = medType;
            }
        }

        //Check the array again to see if we can skip administer. This is ugly but should work.
        for (medType of medList) {
            medItem = cloneObject(globalData[medType]);

            //Swap to cheaper med if it still lets the player reach max health
            if (medItem["healthrestore"] >= damagePercentage) {
                chosenMed = medType;
                needAdminister = false;
            } else {
                break;
            }
        }

        return [chosenMed, needAdminister];

    }
    unsafeWindow.getBestLevelAppropriateMedicalTypeAndAdministerNeed = getBestLevelAppropriateMedicalTypeAndAdministerNeed;

    function getLevelAppropriateFoodTypeList() {

        var playerLevel = userVars["DFSTATS_df_level"];

        //Chain IFs instead of using Switch bacause that is the ugly but recommended way
        //All list are already sorted in descending foodrestore values
        if (playerLevel < 11) {
            return ["millet_cooked", "beer"]
        }
        if (playerLevel >= 11 && playerLevel < 21) {
            return ["hotdogs_cooked", "bakedbeans_cooked"]
        }
        if (playerLevel >= 21 && playerLevel < 31) {
            return ["potatoes_cooked", "tuna_cooked"]
        }
        if (playerLevel >= 31 && playerLevel < 41) {
            return ["eggs_cooked", "salmon_cooked", "oats_cooked"]
        }
        if (playerLevel >= 41 && playerLevel < 71) {
            return ["caviar_cooked", "mixednuts_cooked", "redwine"]
        }
        if (playerLevel >= 71) {
            return ["driedtruffles_cooked", "whiskey"]
        }
        return [];
    }

    function getBestLevelAppropriateFoodType() {

        var hunger = 100 - userVars['DFSTATS_df_hungerhp'];
        var foodList = getLevelAppropriateFoodTypeList();
        var chosenFood = "";

        //Use the fact that the array is already sorted
        for (var foodType of foodList) {
            //Fix cooked items restore levels
            var [id, extraInfo] = foodType.split("_");
            var foodItem = globalData[id];
            if (extraInfo != undefined) {
                foodItem["actual_foodrestore"] = parseInt(foodItem["foodrestore"]) * 3;
            } else {
                foodItem["actual_foodrestore"] = parseInt(foodItem["foodrestore"]);
            }

            //Swap to cheaper food if it still lets the player reach max nourishment
            if (chosenFood != "") {
                if (foodItem["actual_foodrestore"] >= hunger) {
                    chosenFood = foodType;
                } else {
                    break;
                }
            } else {
                chosenFood = foodType;
            }
        }

        return chosenFood;

    }

    function findLastEmptyGenericSlot(slotType) {
        for (var i = userVars["DFSTATS_df_" + slotType + "slots"]; i >= 1; i--) {
            if (userVars["DFSTATS_df_" + slotType + i + "_type"] === "") {
                return i;
            }
        }
        return false;
    }

    function addPendingRequest() {
        pendingRequests.requestsNeeded += 1;
        pendingRequests.requesting = true;
    }

    function completePendingRequest() {
        pendingRequests.requestsCompleted += 1;
        if (pendingRequests.requestsCompleted >= pendingRequests.requestsNeeded) {
            resetPendingRequests();
        }
    }

    function resetPendingRequests() {
        pendingRequests.requestsNeeded = 0;
        pendingRequests.requestsCompleted = 0;
        pendingRequests.requesting = false;
    }

    function havePendingRequestsCompleted() {
        return !pendingRequests.requesting;
    }

    //////////////////////
    //  Init Functions  //
    /////////////////////

    function initUserData() {
        if (isAtLocation("forum") || unsafeWindow.userVars == undefined) {
            return;
        }
        if (isAtLocation("ICInventory")) {
            userData["tradezone"] = '22';
        } else {
            userData["tradezone"] = userVars["DFSTATS_df_tradezone"];
        }

        lastActiveUserID = unsafeWindow.userVars['userID'];
        GM.setValue("lastActiveUserID", lastActiveUserID);
    }

    function addItemToDatabank(flashType, quantity) {

        //Init a new inventory item
        var item = {};
        item.id = flashType;
        item.extraInfo = "";
        item.type = "";
        item.flashType = flashType;
        item.trades = [];

        //Check if slot isn't empty
        if (item.id != "" && item.id != undefined) {
            //Detect extra data such as cooked/dye color
            if (item.id.indexOf("_") != -1) {
                item.extraInfo = capitalizeFirstLetter(item.id.split("_")[1]);
                item.id = item.id.split("_")[0];
            }

            var itemGlobData = globalData[item.id];

            //Set shared data across all item types
            item.name = itemGlobData.name;
            item.quantity = quantity;
            item.quantity = item.quantity < 1 ? 1 : item.quantity;
            item.type = capitalizeFirstLetter(itemGlobData.itemtype);
            item.notTransferable = itemGlobData.no_transfer == 1;

            if (item.type == "Armour") {
                //Quantity is current armor HP
                item.maxHP = parseInt(itemGlobData.hp); //Max armor hp
                item.level = itemGlobData.shop_level;
                item.profession = "Engineer";
                item.serviceAction = "buyrepair";
                item.serviceSound = "repair";
                item.serviceTooltip = "Repair";
                item.scrapValue = unsafeWindow.scrapValue(item.flashType, 1);
            }

            if (item.type == "Weapon") {
                item.scrapValue = unsafeWindow.scrapValue(item.flashType, 1);
            }

            if (item.type == "Item") {
                //Add level to the item if it has one
                if (itemGlobData.level != undefined) {
                    item.level = itemGlobData.level;
                }

                //Add scrap value if this is a cosmetic
                if (itemGlobData.clothingtype != undefined) {
                    item.scrapValue = unsafeWindow.scrapValue(item.flashType, 1);
                }

                //Find if the item has a profession associated and/or is cookable and add it
                //to the databank for a market request
                if (itemGlobData.needcook == "1" && item.extraInfo != "Cooked") {
                    item.type = "Cookable";
                    item.profession = "Chef";
                    item.serviceAction = "buycook";
                    item.serviceSound = "cook";
                    item.serviceTooltip = "Cook";
                    //Add Cooked item info to the Databank
                    //If this is the first time this item has been found in the inventory,
                    //register its Cooked info into the itemsDataBank
                    if (itemsDataBank[item.id + "_cooked"] == null) {
                        var cookedItem = {};
                        cookedItem.id = item.id + "_cooked";
                        cookedItem.extraInfo = "Cooked";
                        cookedItem.name = "Cooked " + item.name;
                        cookedItem.quantity = 1;
                        cookedItem.type = "Item";
                        itemsDataBank[cookedItem.id] = cookedItem;
                    }
                } else if (itemGlobData.needdoctor == "1") {
                    item.type = "Medical";
                    item.profession = "Doctor";
                    item.serviceAction = "buyadminister";
                    item.serviceSound = "heal";
                    item.serviceTooltip = "Administer";
                }
            }

            //Fix for cooked items detection
            if (item.extraInfo == "Cooked") {
                item.id = item.id + "_cooked";
                item.name = "Cooked " + item.name;
            }

            //Add profession level required to service the item.
            //If item isn't serviceable this is ignored.
            if (item.level != undefined) {
                item.professionLevel = item.level - 5;
            }

            //If this is the first time this item has been found in the inventory,
            //register its info into the itemsDataBank
            if (itemsDataBank[item.id] == null) {
                itemsDataBank[item.id] = item;
            }
        } else {
            item.name = "";
            item.quantity = 0;
        }

        return item

    }

    function initInventoryArray() {
        if (!isAtLocation("inventories")) {
            return;
        }

        //Reset inventory array
        inventoryArray = [];

        //Refresh databank and inventory contents
        for (var i = 1; i <= parseInt(userVars.DFSTATS_df_invslots); i++) {

            var item = addItemToDatabank(userVars["DFSTATS_df_inv" + i + "_type"],
                parseInt(userVars["DFSTATS_df_inv" + i + "_quantity"]));

            inventoryArray.push(item);
        }
    }

    async function loadStoredSettings() {
        //We stringify the default object as fallback
        userSettings = JSON.parse(await GM.getValue("userSettings", JSON.stringify(userSettings)));
        if (userSettings.hoverPrices == false) {
            helpWindowStructure["settings"]["data"][0][1] = "Enable HoverPrices";
        }
        if (userSettings.autoService == false) {
            helpWindowStructure["settings"]["data"][1][1] = "Enable AutoService";
        }
        if (userSettings.autoMarketWithdraw == false) {
            helpWindowStructure["settings"]["data"][2][1] = "Enable AutoMarketWithdraw";
        }
        if (userSettings.alwaysDisplayQuickSwitcher == true) {
            helpWindowStructure["settings"]["data"][3][1] = "Disable AlwaysDisplayQuickSwitcher";
        }
        if (userSettings.innerCityButton == false) {
            helpWindowStructure["settings"]["data"][4][1] = "Enable InnerCityButton";
        }
    }

    async function initLoadouts() {
        for (var i = 0; i < 4; i++) {
            resetLoadout(i);
        }

        //Load stored loadouts
        loadouts = JSON.parse(await GM.getValue("loadouts", JSON.stringify(loadouts)));

        //Fix for previous versions
        for (let i = 0; i < loadouts.length; i++) {
            if (loadouts[i]["backpack"] == undefined) {
                loadouts[i]["backpack"] = [{
                    "characterSlotType": "DFSTATS_df_backpack",
                    "characterSlotNumber": 35,
                    "storageSlot": -1,
                    "itemFlashType": "",
                    "itemCategory": ""
                }];
            }
            if (loadouts[i]["hat"] == undefined) {
                loadouts[i]["hat"] = [{
                    "characterSlotType": "DFSTATS_df_avatar_hat",
                    "characterSlotNumber": 40,
                    "storageSlot": -1,
                    "itemFlashType": "",
                    "itemCategory": ""
                }];
            }
            if (loadouts[i]["mask"] == undefined) {
                loadouts[i]["mask"] = [{
                    "characterSlotType": "DFSTATS_df_avatar_mask",
                    "characterSlotNumber": 39,
                    "storageSlot": -1,
                    "itemFlashType": "",
                    "itemCategory": ""
                }];
            }
            if (loadouts[i]["coat"] == undefined) {
                loadouts[i]["coat"] = [{
                    "characterSlotType": "DFSTATS_df_avatar_coat",
                    "characterSlotNumber": 38,
                    "storageSlot": -1,
                    "itemFlashType": "",
                    "itemCategory": ""
                }];
            }
            if (loadouts[i]["shirt"] == undefined) {
                loadouts[i]["shirt"] = [{
                    "characterSlotType": "DFSTATS_df_avatar_shirt",
                    "characterSlotNumber": 36,
                    "storageSlot": -1,
                    "itemFlashType": "",
                    "itemCategory": ""
                }];
            }
            if (loadouts[i]["trousers"] == undefined) {
                loadouts[i]["trousers"] = [{
                    "characterSlotType": "DFSTATS_df_avatar_trousers",
                    "characterSlotNumber": 37,
                    "storageSlot": -1,
                    "itemFlashType": "",
                    "itemCategory": ""
                }];
            }
        }

        loadoutRefreshUsedSlotOverlay();

    }

    async function loadSavedMarketData() {
        savedMarketData = JSON.parse(await GM.getValue("savedMarketData", JSON.stringify(savedMarketData)));
        if (savedMarketData["previousItemTimestamp"] == undefined) {
            savedMarketData["previousItemTimestamp"] = {};
        }
        itemsDataBank = savedMarketData["itemsDataBank"];
        servicesDataBank = savedMarketData["servicesDataBank"];
    }

    async function loadStoredCharacterCookieData() {
        //Load stored cookie data
        characterCookieData = JSON.parse(await GM.getValue("characterCookieData", JSON.stringify(characterCookieData)));
        //Fix character cookie if loading from previous versions
        for (let userID in characterCookieData) {
            if (characterCookieData[userID]['userID'] == undefined) {
                characterCookieData[userID]['userID'] = userID;
            }
        }
        //Stop here if outside the home page due to the fact that userVars may not be available
        if (!isAtLocation("home")) {
            return;
        }
        //Update current character cookie
        let characterName = "";
        if (characterCookieData[unsafeWindow.userVars['userID']] != undefined) {
            characterName = characterCookieData[unsafeWindow.userVars['userID']].characterName;
        } else {
            characterName = document.getElementById("sidebar").children[2].firstChild.textContent;
        }
        characterCookieData[unsafeWindow.userVars['userID']] = {
            "characterName": characterName,
            "cookie": document.cookie,
            "userID": unsafeWindow.userVars['userID']
        };
        //Save updated cookie data
        GM.setValue("characterCookieData", JSON.stringify(characterCookieData));
    }

    function removeCharacterFromCharacterCookieData(userID) {
        if (characterCookieData[userID] != undefined) {
            delete characterCookieData[userID];
            //Save updated cookie data
            GM.setValue("characterCookieData", JSON.stringify(characterCookieData));
        }
    }

    function changeCharacterCookieDataName(userID) {
        if (characterCookieData[userID] != undefined) {
            let newCharName = window.prompt("Input the new name for the saved character");
            characterCookieData[userID]["characterName"] = newCharName.slice(0, 16);
            //Save updated cookie data
            GM.setValue("characterCookieData", JSON.stringify(characterCookieData));
        }
    }

    async function loadLastActiveUserID() {
        lastActiveUserID = await GM.getValue("lastActiveUserID", null);
    }

    //////////////////////////////
    //  Item Price Functions    //
    /////////////////////////////

    function resetDataBankItemsMarketInfo() {
        if (isAtLocation("forum")) {
            return;
        }

        for (var itemName in itemsDataBank) {
            itemsDataBank[itemName].rawServerResponse = "";
        }

    }

    function addAllAmmoToDatabank() {
        if (!isAtLocation("inventories")) {
            return;
        }
        //This array was extracted from the game data using the following one-liner:
        //Object.keys(Object.fromEntries(Object.entries(globalData).filter(([key, value]) => value.itemcat === 'ammo')));
        var ammoTypes = ['32ammo', '35ammo', '357ammo', '38ammo', '40ammo', '45ammo', '50ammo', '55ammo', '20gaugeammo', '16gaugeammo', '12gaugeammo', '10gaugeammo', 'grenadeammo', 'heavygrenadeammo', '55rifleammo', '75rifleammo', '9rifleammo', '127rifleammo', '14rifleammo', 'fuelammo'];

        for (let ammoId of ammoTypes) {
            addItemToDatabank(ammoId, 1);
        }

    }

    function addLevelAppropriateMedicalToDatabank() {
        if (!isAtLocation("marketplace")) {
            return;
        }

        //Add medical to databank
        var [medicalId, needsAdminister] = getBestLevelAppropriateMedicalTypeAndAdministerNeed();
        addItemToDatabank(medicalId, 1);

        //Fetch the medical's price if the player is damaged
        if (parseInt(userVars["DFSTATS_df_hpcurrent"]) < parseInt(userVars["DFSTATS_df_hpmax"])) {
            requestItem(itemsDataBank[medicalId]);
        }

    }

    function addLevelAppropriateFoodToDatabank() {
        if (!isAtLocation("marketplace")) {
            return;
        }

        //Add food to databank
        var foodId = getBestLevelAppropriateFoodType();
        addItemToDatabank(foodId, 1);

        //Fetch the food's price if the player is hungry
        if (parseInt(userVars['DFSTATS_df_hungerhp']) < 100) {
            requestItem(itemsDataBank[foodId]);
        }

    }

    function requestItem(dataBankItem) {
        //Check that we are not exceeding the rate limit
        if (Date.now() < savedMarketData["previousDataTimestamp"] + 30000) {
            //Give priority to not previously fetched results
            if (savedMarketData["previousItemTimestamp"][dataBankItem.id] != undefined &&
                Date.now() < savedMarketData["previousItemTimestamp"][dataBankItem.id] + 30000 &&
                dataBankItem.rawServerResponse != undefined &&
                dataBankItem.rawServerResponse != ""
            ) {
                updateInventoryItemPrices(dataBankItem);
                fillHoverBox();
                return true;
            }
            //If there are any available requests, use them.
            //Otherwise return false as a failstate
            if (savedMarketData["requestsIssued"] < REQUEST_LIMIT) {
                savedMarketData["requestsIssued"] += 1;
            } else {
                //dataBankItem.rawServerResponse = "";
                return false;
            }
        } else {
            //Update the time to NOW if it is the first request
            //after the 30 sec rate limit interval
            savedMarketData["previousDataTimestamp"] = Date.now();
            savedMarketData["requestsIssued"] = 0;
        }
        savedMarketData["previousItemTimestamp"][dataBankItem.id] = Date.now();

        //Used to check when to display tooltips
        addPendingRequest();

        var requestParams = {};
        requestParams["tradezone"] = userData["tradezone"];
        requestParams["searchname"] = encodeURI(dataBankItem.name.substring(0, 15));
        requestParams["category"] = '';
        requestParams["profession"] = '';
        requestParams["memID"] = '';
        requestParams["searchtype"] = "buyinglistitemname";
        requestParams["search"] = "trades";

        let requestCallback = function(responseText) {
            dataBankItem.rawServerResponse = responseText;
            filterItemResponseText(dataBankItem);
            updateInventoryItemPrices(dataBankItem);
            fillHoverBox();
            completePendingRequest();
            //Request cooked item counterpart if needed
            if (itemsDataBank[dataBankItem.id + "_cooked"] != null) {
                requestItem(itemsDataBank[dataBankItem.id + "_cooked"]);
            }
            return true;
        };

        return makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php", requestParams, requestCallback, null);

    }
    unsafeWindow.silverRequestItem = requestItem;

    function filterItemResponseText(dataBankItem) {
        var itemRawResponse = dataBankItem.rawServerResponse;
        if (itemRawResponse != "") {
            var maxTrades = [...itemRawResponse.matchAll(new RegExp("tradelist_[0-9]+_id_member=", "g"))].length;
            var firstOccurence;
            //Reset the trade list
            if (itemRawResponse.indexOf("tradelist_maxresults=0") == -1) {
                if (dataBankItem.extraInfo != "") {
                    firstOccurence = parseInt(itemRawResponse.match(new RegExp("tradelist_[0-9]+_item=" + dataBankItem.id))[0].split("=")[0].match(/[0-9]+/)[0]);
                } else {
                    firstOccurence = parseInt(itemRawResponse.match(new RegExp("tradelist_[0-9]+_item=" + dataBankItem.id + "&"))[0].split("=")[0].match(/[0-9]+/)[0]);
                }
            } else {
                firstOccurence = 0;
            }
            var availableTrades = maxTrades - firstOccurence;
            var avgPrice = 0;
            var examinedTrades = 0;

            itemsDataBank[dataBankItem.id]["trades"] = [];
            for (;
                (examinedTrades < availableTrades) && (examinedTrades < 10); examinedTrades++) {
                var pricePerUnit;
                var quantity;
                if (dataBankItem.type == "Armour") {
                    pricePerUnit = parseInt(itemRawResponse.match(new RegExp("tradelist_" + (firstOccurence + examinedTrades) + "_price=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                } else {
                    //Fix for implants that are somehow listed in the market as having 0 quantity
                    quantity = parseInt(itemRawResponse.match(new RegExp("tradelist_" + (firstOccurence + examinedTrades) + "_quantity=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                    quantity = quantity < 1 ? 1 : quantity;
                    pricePerUnit = parseInt(itemRawResponse.match(new RegExp("tradelist_" + (firstOccurence + examinedTrades) + "_price=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]) /
                        quantity;
                }
                avgPrice += pricePerUnit;
                if (examinedTrades == 0) {
                    dataBankItem.bestPricePerUnit = pricePerUnit;
                }

                //Store the trade info for a future buyItem
                var trade = {};
                trade["tradeID"] = parseInt(itemRawResponse.match(new RegExp("tradelist_" + (firstOccurence + examinedTrades) + "_trade_id=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                trade["price"] = parseInt(itemRawResponse.match(new RegExp("tradelist_" + (firstOccurence + examinedTrades) + "_price=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                itemsDataBank[dataBankItem.id]["trades"].push(trade);
            }

            if (examinedTrades == 0) {
                dataBankItem.averagePricePerUnit = 0;
                dataBankItem.bestPricePerUnit = 0;
            } else {
                dataBankItem.averagePricePerUnit = avgPrice / examinedTrades;
            }
            //Fix undefined data
            if (dataBankItem.averagePricePerUnit == undefined) {
                dataBankItem.averagePricePerUnit = 0;
            }
            if (dataBankItem.bestPricePerUnit == undefined) {
                dataBankItem.bestPricePerUnit = 0;
            }
        }
    }

    function updateInventoryItemPrices(dataBankItem) {
        for (var x of inventoryArray) {
            if (x.id == dataBankItem.id) {
                x.bestPricePerUnit = dataBankItem.bestPricePerUnit;
                x.averagePricePerUnit = dataBankItem.averagePricePerUnit;
            }
        }
    }

    //Buy an item that was previously registered into the databank
    function buyItem(itemId) {
        //Check that the databank has data on the item
        if (itemsDataBank[itemId] == null || itemsDataBank[itemId]["trades"].length == 0) {
            return false;
        }

        //Get the listing info
        var itemBuynum = itemsDataBank[itemId]["trades"][0]["tradeID"];
        var itemPrice = itemsDataBank[itemId]["trades"][0]["price"];

        //Check that the item is tradeable/seeded into the market
        if (itemBuynum == null) {
            return false;
        }

        var requestParams = {};
        requestParams["searchtype"] = "buyinglistitemname";
        requestParams["creditsnum"] = "undefined";
        requestParams["buynum"] = itemBuynum;
        requestParams["renameto"] = "undefined`undefined";
        requestParams["expected_itemprice"] = itemPrice;
        requestParams["expected_itemtype2"] = "";
        requestParams["expected_itemtype"] = "";
        requestParams["itemnum2"] = "0";
        requestParams["itemnum"] = "0";
        requestParams["price"] = "0";
        requestParams["action"] = "newbuy";

        let requestCallback = function(responseText) {
            //Check that the request didn't fail. If it did, discard the first service in the list as it became stale and retry.
            if (responseText.length < 32) {
                itemsDataBank[itemId]["trades"].shift();
                if (itemsDataBank[itemId]["trades"].length > 0) {
                    buyService(itemId);
                } else {
                    return false;
                }
            } else {
                unsafeWindow.playSound("buysell");
                //Update the inventory from the new data, according to the original source code
                unsafeWindow.updateIntoArr(unsafeWindow.flshToArr(responseText, "DFSTATS_"), unsafeWindow.userVars);
                unsafeWindow.populateInventory();
                unsafeWindow.populateCharacterInventory();
                unsafeWindow.updateAllFields();
                initInventoryArray();
            }
        };

        return makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php", requestParams, requestCallback, null);
    }


    /////////////////////////////////
    //  Service Price Functions    //
    /////////////////////////////////

    //Delete and request new service price info
    function refreshServicesDataBank() {
        if (!isAtLocation("inventories")) {
            return;
        }
        //Check that we aren't exceeding the rate limit
        if (Date.now() < savedMarketData["previousServicesTimestamp"] + 30000) {
            return;
        }
        savedMarketData["previousServicesTimestamp"] = Date.now();
        servicesDataBank = {
            "Chef": {
                name: "Chef"
            },
            "Doctor": {
                name: "Doctor"
            },
            "Engineer": {
                name: "Engineer"
            }
        };
        requestServicesMarketInfo();
    }

    //Request info for every service in servicesDataBank
    function requestServicesMarketInfo() {
        for (var serviceName in servicesDataBank) {
            addPendingRequest();
            requestService(servicesDataBank[serviceName]);
        }
    }

    function requestService(dataBankService) {
        var requestParams = {};
        requestParams["tradezone"] = userData["tradezone"];
        requestParams["searchname"] = "";
        requestParams["category"] = "";
        requestParams["profession"] = encodeURI(dataBankService.name.substring(0, 15));
        requestParams["memID"] = "";
        requestParams["searchtype"] = "buyinglist";
        requestParams["search"] = "services";

        let requestCallback = function(responseText) {
            dataBankService.rawServerResponse = responseText;
            filterServiceResponseText(dataBankService);
            completePendingRequest();
        };

        return makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php", requestParams, requestCallback, null);
    }

    function filterServiceResponseText(dataBankService) {
        //Get length of response list
        var rawServerResponse = dataBankService.rawServerResponse;
        var responseLength = [...rawServerResponse.matchAll(new RegExp("tradelist_[0-9]+_id_member=", "g"))].length;
        if (rawServerResponse != "") {
            for (var i = 0; i < responseLength; i++) {
                //If we don't already have price for this level, fetch the lowest
                var serviceLevel = parseInt(rawServerResponse.match(new RegExp("tradelist_" + i + "_level=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                if (dataBankService[serviceLevel] == undefined) {
                    dataBankService[serviceLevel] = [];
                }
                var service = {};
                service["userID"] = parseInt(rawServerResponse.match(new RegExp("tradelist_" + i + "_id_member=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                service["price"] = parseInt(rawServerResponse.match(new RegExp("tradelist_" + i + "_price=[0-9]+&"))[0].split("=")[1].match(/[0-9]+/)[0]);
                dataBankService[serviceLevel].push(service);
            }
        }
    }

    //Buy service for a specified item
    function buyService(slotNumber) {
        var targetInventoryItem = inventoryArray[slotNumber - 1];
        var serviceBuynum, servicePrice;

        //We make sure that the item has an associated service
        if (targetInventoryItem == '' || targetInventoryItem.profession == null) {
            return false;
        }

        //Check that the databank has data on the service
        if (servicesDataBank[targetInventoryItem.profession] == null ||
            servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel].length == 0
        ) {
            return false;
        }

        //Get the listing info and lock the page until request is finished
        serviceBuynum = servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel][0]["userID"];
        servicePrice = servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel][0]["price"];
        unsafeWindow.pageLock = true;

        var requestParams = {};
        requestParams["creditsnum"] = "0";
        requestParams["buynum"] = serviceBuynum;
        requestParams["renameto"] = "undefined`undefined";
        requestParams["expected_itemprice"] = servicePrice;
        requestParams["expected_itemtype2"] = "";
        requestParams["expected_itemtype"] = "";
        requestParams["itemnum2"] = "0";
        requestParams["itemnum"] = slotNumber;
        requestParams["price"] = "0";
        requestParams["action"] = targetInventoryItem.serviceAction;

        let requestCallback = function(responseText) {
            //Unlock the page before doing anything else
            unsafeWindow.pageLock = false;
            //Check that the request didn't fail. If it did, discard the first service in the list as it became stale and retry.
            if (responseText.length < 32) {
                servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel].shift();
                if (servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel].length > 0) {
                    buyService(slotNumber);
                } else {
                    requestServicesMarketInfo();
                }
            } else {
                unsafeWindow.playSound(targetInventoryItem.serviceSound);
                //Update the inventory from the new data, according to the original source code
                unsafeWindow.updateIntoArr(unsafeWindow.flshToArr(responseText, "DFSTATS_"), unsafeWindow.userVars);
                unsafeWindow.populateInventory();
                unsafeWindow.populateCharacterInventory();
                unsafeWindow.updateAllFields();
                return true;
            }
        };

        return makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php", requestParams, requestCallback, null);
    }

    function autoServiceHelper(targetInventoryItem, action) {
        //Show custom box if a slot is hovered whilst the ALT is pressed
        var mousePos = unsafeWindow.mousePos;
        var playerCash = userVars["DFSTATS_df_cash"];
        //Make sure the slot is occupied and not locked
        if (targetInventoryItem.id != "" && unsafeWindow.lockedSlots.indexOf(lastSlotHovered) == -1) {
            //Cookable OR damaged Armor OR Medical and health below max AND service is available
            if ((
                    (targetInventoryItem.type == "Cookable") ||
                    (targetInventoryItem.type == "Armour" && targetInventoryItem.quantity < targetInventoryItem.maxHP) ||
                    (targetInventoryItem.type == "Medical" && parseInt(userVars["DFSTATS_df_hpcurrent"]) < parseInt(userVars["DFSTATS_df_hpmax"]))
                ) && (servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel][0] != undefined)) {

                var servicePrice = servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel][0]["price"];

                if (servicePrice <= playerCash) {
                    if (action == "UpdateTooltip") {
                        unsafeWindow.tooltipDisplaying = true;
                        unsafeWindow.displayPlacementMessage(targetInventoryItem.serviceTooltip, mousePos[0] + 10, mousePos[1] + 10, "ACTION");
                    } else if (action == "BuyService") {
                        buyService(lastSlotHovered);
                    }
                } else {
                    //If action is "BuyService" and the player doesn't have enough cash,
                    //don't fo anything
                    if (action == "UpdateTooltip") {
                        unsafeWindow.tooltipDisplaying = true;
                        unsafeWindow.displayPlacementMessage("You don't have enough cash to use this service!", mousePos[0] + 10, mousePos[1] + 10, "ERROR");
                    }
                }
            }
        }
    }

    //////////////////////////
    //  Cash Functions     //
    /////////////////////////

    function withdrawCash(amount) {
        var requestParams = {};
        requestParams["withdraw"] = amount;

        let requestCallback = function(responseText) {
            unsafeWindow.playSound("bank");
            //We must filter out the new cash amounts and update the existing ones
            var cashFields = responseText.split('&');
            var newBankCash = cashFields[1].split('=')[1];
            var newHeldCash = cashFields[2].split('=')[1];
            userVars["DFSTATS_df_cash"] = newHeldCash;
            userVars['DFSTATS_df_bankcash'] = newBankCash;
            unsafeWindow.updateAllFields();
            refreshMarketSearch();
        };

        return makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/bank.php", requestParams, requestCallback, null);
    }

    /////////////////////////////
    //  Loadout Functions     //
    ////////////////////////////

    function openLoadoutsMenu() {
        openHelpWindowPage("loadoutsMenu");
    }

    function loadoutOpenEquipMenu() {
        for (var i = 0; i < 4; i++) {
            helpWindowStructure["loadoutsListEquip"]["data"][i][3][1][1] = loadouts[i]["name"];
        }
        openHelpWindowPage("loadoutsListEquip");
    }

    function loadoutOpenEditMenu() {
        for (var i = 0; i < 4; i++) {
            helpWindowStructure["loadoutsListEdit"]["data"][i][3][1][1] = loadouts[i]["name"];
        }
        openHelpWindowPage("loadoutsListEdit");
    }

    function loadoutOpenResetMenu() {
        for (var i = 0; i < 4; i++) {
            helpWindowStructure["loadoutsListReset"]["data"][i][3][1][1] = loadouts[i]["name"];
        }
        openHelpWindowPage("loadoutsListReset");
    }

    function renameLoadout() {
        var name = prompt("Choose name for this loadout");
        if (name == null || name == "") {
            name = "Default name";
        } else {
            name = name.substring(0, 15);
        }
        loadouts[activeLoadoutEdit]["name"] = name;
        //Save loadout info
        GM.setValue("loadouts", JSON.stringify(loadouts));
        //Refresh edit page
        editLoadout(activeLoadoutEdit);
    }

    function editLoadout(loadoutIndex) {
        var loadout = loadouts[loadoutIndex];
        activeLoadoutEdit = loadoutIndex;

        //Set loadout title
        helpWindowStructure["loadoutEdit"]["data"][1][3][1][1] = loadout["name"];
        //Set armor
        helpWindowStructure["loadoutEdit"]["data"][4][3][0][3][0][3] = []
        if (loadout["armour"][0]["storageSlot"] != -1) {
            var armorImg = ["div", "", {
                    "className": "item nonstack silverScriptsOccupiedSlot armour",
                    "dataset": [
                        ["type", loadout["armour"][0]["itemFlashType"]],
                        ["itemtype", loadout["armour"][0]["itemCategory"]],
                        ["quantity", loadout["armour"][0]["quantity"]]
                    ],
                    "style": [
                        ["backgroundImage", "url(\"https://files.deadfrontier.com/deadfrontier/inventoryimages/large/" + loadout["armour"][0]["itemFlashType"].split("_")[0] + ".png\")"]
                    ],
                    "id": "armour_0"
                },
                []
            ];
            helpWindowStructure["loadoutEdit"]["data"][4][3][0][3][0][3].push(armorImg);
        }
        //Set backpack
        helpWindowStructure["loadoutEdit"]["data"][4][3][0][3][1][3] = []
        if (loadout["backpack"][0]["storageSlot"] != -1) {
            var armorImg = ["div", "", {
                    "className": "item nonstack silverScriptsOccupiedSlot backpack",
                    "dataset": [
                        ["type", loadout["backpack"][0]["itemFlashType"]],
                        ["itemtype", loadout["backpack"][0]["itemCategory"]]
                    ],
                    "style": [
                        ["backgroundImage", "url(\"https://files.deadfrontier.com/deadfrontier/inventoryimages/large/" + loadout["backpack"][0]["itemFlashType"].split("_")[0] + ".png\")"]
                    ],
                    "id": "backpack_0"
                },
                []
            ];
            helpWindowStructure["loadoutEdit"]["data"][4][3][0][3][1][3].push(armorImg);
        }
        //Set weapons
        for (var i = 0; i < 3; i++) {
            helpWindowStructure["loadoutEdit"]["data"][8][3][i][3] = []
            if (loadout["weapon"][i]["storageSlot"] != -1) {
                var weaponImg = ["div", "", {
                        "className": "item nonstack silverScriptsOccupiedSlot weapon",
                        "dataset": [
                            ["type", loadout["weapon"][i]["itemFlashType"]],
                            ["itemtype", loadout["weapon"][i]["itemCategory"]]
                        ],
                        "style": [
                            ["backgroundImage", "url(\"https://files.deadfrontier.com/deadfrontier/inventoryimages/large/" + loadout["weapon"][i]["itemFlashType"].split("_")[0] + ".png\")"]
                        ],
                        "id": "weapon_" + i
                    },
                    []
                ];
                helpWindowStructure["loadoutEdit"]["data"][8][3][i][3].push(weaponImg);
            }
        }
        //Set implants
        for (i = 0; i < 20; i++) {
            //We have to handle the different rows
            var implantRow = Math.floor(i / 4);
            var implantColumn = i % 4;
            //Hide the slots that are not available to the user
            if (i >= userVars["DFSTATS_df_implantslots"]) {
                helpWindowStructure["loadoutEdit"]["data"][12][3][implantRow][3][implantColumn][2]["style"].push(["display", "none"]);
                continue;
            }
            helpWindowStructure["loadoutEdit"]["data"][12][3][implantRow][3][implantColumn][3] = [];
            if (loadout["implant"][i]["storageSlot"] != -1) {
                var implantImg = ["div", "", {
                        "className": "item nonstack silverScriptsOccupiedSlot implant",
                        "dataset": [
                            ["type", loadout["implant"][i]["itemFlashType"]],
                            ["itemtype", loadout["implant"][i]["itemCategory"]]
                        ],
                        "style": [
                            ["backgroundImage", "url(\"https://files.deadfrontier.com/deadfrontier/inventoryimages/large/" + loadout["implant"][i]["itemFlashType"].split("_")[0] + ".png\")"]
                        ],
                        "id": "implant_" + i
                    },
                    []
                ];
                helpWindowStructure["loadoutEdit"]["data"][12][3][implantRow][3][implantColumn][3].push(implantImg);
            }
        }

        //Open edit page
        openHelpWindowPage("loadoutEdit");

        //We have to make the user select an item on click
        var silverSlots = document.getElementsByClassName("silverScriptsSlot");
        for (var slot of silverSlots) {
            slot.addEventListener("click", pickLoadoutItem);
        }

        //We have to remove the pageLock if the mouse enters our slots
        var occupiedSlots = document.getElementsByClassName("silverScriptsOccupiedSlot");
        for (var occupiedSlot of occupiedSlots) {
            occupiedSlot.addEventListener("mouseenter", function() {
                unsafeWindow.pageLock = false;
            });
            occupiedSlot.addEventListener("mouseleave", function() {
                unsafeWindow.pageLock = true;
            });
        }
    }

    function pickLoadoutItem(e) {
        //Set category
        var itemCategory = e.target.classList[e.target.classList.length - 1];
        pickingLoadoutCategory = itemCategory;
        //Set loadout index in category
        pickingLoadoutSlotIndex = e.target.id.split("_")[1];

        //Obscure items of the wrong category
        filterStorageCategoriesDuringPicking();

        closeHelpWindowPage();

        //Spawn warning text
        var warningText = document.createElement("p");
        warningText.id = "silverScriptsWarning";
        warningText.innerText = "Choose desired " + capitalizeFirstLetter(itemCategory);
        warningText.style.color = "red";
        warningText.style.position = "absolute";
        warningText.style.fontSize = "30px";
        warningText.style.top = "20px";
        warningText.style.left = "160px";
        warningText.style.zIndex = 20;
        document.getElementById("inventoryholder").appendChild(warningText);

        //Spawn back button
        var backButton = document.createElement("button");
        backButton.id = "silverScriptsBackButton";
        backButton.innerText = "Back";
        backButton.style.fontSize = "24px";
        backButton.style.position = "absolute";
        backButton.style.top = "450px";
        backButton.style.left = "400px";
        backButton.style.zIndex = 20;
        backButton.addEventListener("click", loadoutCloseItemSelection);
        document.getElementById("inventoryholder").appendChild(backButton);

        //Spawn slot clear button
        var slotClearSpan = document.createElement("span");
        slotClearSpan.id = "silverScriptsClearSpan";
        slotClearSpan.style.position = "absolute";
        slotClearSpan.style.top = "450px";
        slotClearSpan.style.left = "200px";
        slotClearSpan.style.zIndex = 20;
        slotClearSpan.dataset.slot = -1;
        var clearButton = document.createElement("button");
        clearButton.innerText = "Clear slot";
        clearButton.style.fontSize = "24px";
        clearButton.dataset.type = "";
        clearButton.dataset.itemtype = "";
        clearButton.dataset.quantity = -1;
        clearButton.addEventListener("click", registerItemToLoadout);
        slotClearSpan.appendChild(clearButton);
        document.getElementById("inventoryholder").appendChild(slotClearSpan);
    }

    function filterStorageCategoriesDuringPicking() {
        var storageContainer = document.getElementById("normalContainer");

        //Block everything that isn't the storage
        var pageCensor = document.createElement("div");
        pageCensor.className = "silverScriptsCensor";
        pageCensor.style.position = "absolute";
        pageCensor.style.height = "100%";
        pageCensor.style.width = "100%";
        pageCensor.style.backgroundColor = "black";
        pageCensor.style.zIndex = 10;
        document.getElementById("inventoryholder").appendChild(pageCensor);
        document.getElementById("invController").style.zIndex = 20;
        document.getElementById("storageForward").style.zIndex = 20;
        document.getElementById("storageBackward").style.zIndex = 20;

        var inventoryCensor = document.createElement("div");
        inventoryCensor.className = "silverScriptsCensor";
        inventoryCensor.style.position = "absolute";
        inventoryCensor.style.height = "100%";
        inventoryCensor.style.width = "100%";
        inventoryCensor.style.top = "0px";
        inventoryCensor.style.left = "0px";
        inventoryCensor.style.backgroundColor = "black";
        inventoryCensor.style.zIndex = 10;
        document.getElementById("inventory").appendChild(inventoryCensor);

        for (var storageSlot of storageContainer.childNodes) {
            filterStorageSlotDuringPicking(storageSlot);
        }
    }

    function filterStorageSlotDuringPicking(storageSlot) {
        var censor = document.createElement("div");
        censor.className = "silverScriptsCensor";
        censor.style.height = "40px";
        censor.style.width = "40px";
        censor.style.backgroundColor = "black";
        censor.style.opacity = "0.8";
        censor.style.zIndex = 5;

        if (storageSlot.childNodes.length == 0) {
            storageSlot.appendChild(censor);
        } else {
            var itemFlashType = storageSlot.childNodes[0].dataset.type;
            var itemGlobData = globalData[itemFlashType.split("_")[0]];
            var itemCategory = storageSlot.childNodes[0].dataset.itemtype;

            if (itemCategory != pickingLoadoutCategory || //Filter out items of a different category from the one that is being selected
                (itemCategory == "implant" && !loadoutCheckValidImplantPick(itemFlashType)) || //Filter out invalid implant combinations
                (itemCategory == "weapon" && itemGlobData["str_req"] != undefined && itemGlobData["str_req"] > 0 && userVars["DFSTATS_df_strength"] < itemGlobData["str_req"]) || //Filter out weapons requiring more strength than the player has
                (itemCategory == "weapon" && itemGlobData["pro_req"] != undefined && parseInt(itemGlobData["pro_req"]) > 0 && userVars["DFSTATS_df_pro" + itemGlobData["wepPro"]] < itemGlobData["pro_req"]) || //Filter out weapons requiring more proficiency than the player has
                (itemCategory == "armour" && itemGlobData["str_req"] != undefined && itemGlobData["str_req"] > 0 && parseInt(userVars["DFSTATS_df_strength"]) < parseInt(itemGlobData["str_req"])) || //Filter out armours requiring more strength than the player has
                !loadoutCheckSlotUnused(storageSlot.dataset.slot) //Make the sure the same item cannot be equipped twice per loadout
            ) {
                storageSlot.childNodes[0].appendChild(censor);
            } else {
                storageSlot.childNodes[0].addEventListener("click", registerItemToLoadout);
            }
        }
    }

    function loadoutCheckValidImplantPick(itemFlashType) {
        //Fetch info on the target implant
        var restrictions = getImplantRestrictions(itemFlashType);
        //Check if any implant in the loadout fails the checks
        for (var i = 0; i < 16; i++) {
            var loadoutImplant = loadouts[activeLoadoutEdit]["implant"][i];
            //Only check occupied loadout slots
            if (loadoutImplant["storageSlot"] == -1) {
                continue;
            }
            if (restrictions["forbiddenImplants"].indexOf(loadoutImplant["itemFlashType"]) != -1) {
                return false;
            }
            if (restrictions["isUnique"] && loadoutImplant["itemFlashType"] == itemFlashType) {
                return false;
            }
        }
        //If we get here, no checks failed
        return true;
    }

    function loadoutCheckValidImplantEquip(itemFlashType, characterSlotNumber) {
        //Fetch info on the target implant
        var restrictions = getImplantRestrictions(itemFlashType);
        //Check if restrictions still apply to currently equipped implants
        var implantSlotsAmount = userVars["DFSTATS_df_implantslots"];
        var targetImplantNumber = characterSlotNumber - 1000;
        for (var i = 1; i <= implantSlotsAmount; i++) {
            //Skip checking the destination slot
            if (i == targetImplantNumber) {
                continue;
            }
            var implantType = userVars["DFSTATS_df_implant" + i + "_type"];
            if (restrictions["forbiddenImplants"].indexOf(implantType) != -1) {
                return false;
            }
            if (restrictions["isUnique"] && implantType == itemFlashType) {
                return false;
            }
        }
        //If we get here, no checks failed
        return true;
    }

    function loadoutCheckSlotUnused(storageSlot) {
        //Check that the desired item was not previously selected for the loadout
        var loadout = loadouts[activeLoadoutEdit];
        if (loadout["armour"][0]["storageSlot"] == storageSlot) {
            return false;
        }
        if (loadout["backpack"][0]["storageSlot"] == storageSlot) {
            return false;
        }
        for (var i = 0; i < 3; i++) {
            if (loadout["weapon"][i]["storageSlot"] == storageSlot) {
                return false;
            }
        }
        for (i = 0; i < 16; i++) {
            if (loadout["implant"][i]["storageSlot"] == storageSlot) {
                return false;
            }
        }
        //If we get here, no checks failed
        return true;
    }

    function loadoutCloseItemSelection() {
        //Reset editing values
        pickingLoadoutCategory = "";
        pickingLoadoutSlotIndex = -1;

        //Remove all the censors and the warning
        var censors = document.getElementsByClassName("silverScriptsCensor");
        for (var i = censors.length - 1; i >= 0; i--) {
            censors[i].parentNode.removeChild(censors[i]);
        }
        document.getElementById("silverScriptsWarning").remove();
        document.getElementById("silverScriptsBackButton").remove();
        document.getElementById("silverScriptsClearSpan").remove();
        document.getElementById("invController").style.zIndex = "";
        document.getElementById("storageForward").style.zIndex = "";
        document.getElementById("storageBackward").style.zIndex = "";

        //Remove the click listeners
        var storageSlots = document.getElementById("normalContainer").childNodes;
        for (var storageSlot of storageSlots) {
            if (storageSlot.childNodes.length > 0) {
                storageSlot.childNodes[0].removeEventListener("click", registerItemToLoadout);
            }
        }

        //Refresh the used item overlays
        loadoutRefreshUsedSlotOverlay();

        //Open back the edit menu window
        editLoadout(activeLoadoutEdit);
    }

    function loadoutAddUsedSlotOverlay(elem) {
        var storageSlotNumber = elem.dataset.slot;
        var overlay = document.createElement("p");
        overlay.className = "silverScriptsLoadoutIndicator";
        overlay.style.position = "absolute";
        overlay.style.margin = "0px";
        overlay.style.bottom = "0px";
        overlay.style.right = "0px";
        overlay.style.pointerEvents = "none";

        //Check if the supplied slot is used in any loadout
        for (var i = 0; i < 4; i++) {
            var found = false;
            var progress = ((i + 1) * 64) - 1;
            var r = progress;
            var g = Math.floor(255 - (255 * (Math.abs(progress - 127) / 128)));
            var b = 255 - progress;
            for (var j = 0; j < 1 && !found; j++) {
                if (loadouts[i]["armour"][j]["storageSlot"] == storageSlotNumber) {
                    found = true;
                }
            }
            for (var j = 0; j < 1 && !found; j++) {
                if (loadouts[i]["backpack"][j]["storageSlot"] == storageSlotNumber) {
                    found = true;
                }
            }
            for (j = 0; j < 3 && !found; j++) {
                if (loadouts[i]["weapon"][j]["storageSlot"] == storageSlotNumber) {
                    found = true;
                }
            }
            for (j = 0; j < 16 && !found; j++) {
                if (loadouts[i]["implant"][j]["storageSlot"] == storageSlotNumber) {
                    found = true;
                }
            }
            if (found) {
                var numberIndicator = document.createElement("span");
                numberIndicator.innerText = (i + 1) + " ";
                //numberIndicator.style.color = "red"
                numberIndicator.style.color = "rgb(" + r + "," + g + "," + b + ")";
                overlay.appendChild(numberIndicator);
            }
        }
        if (overlay.childNodes.length > 0) {
            elem.childNodes[0].appendChild(overlay);
        }
    }

    function loadoutRefreshUsedSlotOverlay() {
        //Don't do anything if the Storage isn't open
        if (!isAtLocation("storage")) {
            return;
        }
        //First of all remove all the old overlays if any are present
        var overlays = document.getElementsByClassName("silverScriptsLoadoutIndicator");
        for (var i = overlays.length - 1; i >= 0; i--) {
            overlays[i].parentNode.removeChild(overlays[i]);
        }
        //Refresh all visible storage slots
        var slots = document.getElementById("normalContainer").childNodes;
        for (var slot of slots) {
            loadoutAddUsedSlotOverlay(slot);
        }
    }

    function registerItemToLoadout(e) {

        //Update loadout slot info
        var newItemData = e.target.dataset;

        //Clean implant data from extra data if needed
        if (pickingLoadoutCategory == "implant" && newItemData.itemtype != '') {
            newItemData.itemtype = newItemData.itemtype.split("_")[0];
        }

        loadouts[activeLoadoutEdit][pickingLoadoutCategory][pickingLoadoutSlotIndex]["storageSlot"] = e.target.parentNode.dataset.slot;
        loadouts[activeLoadoutEdit][pickingLoadoutCategory][pickingLoadoutSlotIndex]["itemFlashType"] = newItemData.type;
        loadouts[activeLoadoutEdit][pickingLoadoutCategory][pickingLoadoutSlotIndex]["itemCategory"] = newItemData.itemtype;
        loadouts[activeLoadoutEdit][pickingLoadoutCategory][pickingLoadoutSlotIndex]["quantity"] = newItemData.quantity;

        //Save loadout info
        GM.setValue("loadouts", JSON.stringify(loadouts));

        //Go back to editing
        loadoutCloseItemSelection();
    }

    function resetLoadout(loadoutIndex) {
        var loadoutBlueprint = {
            "name": "Default Name",
            "armour": [{
                "characterSlotType": "DFSTATS_df_armourtype",
                "characterSlotNumber": 34,
                "storageSlot": -1,
                "itemFlashType": "",
                "itemCategory": ""
            }],
            "backpack": [{
                "characterSlotType": "DFSTATS_df_backpack",
                "characterSlotNumber": 35,
                "storageSlot": -1,
                "itemFlashType": "",
                "itemCategory": ""
            }],
            "weapon": [{
                    "characterSlotType": "DFSTATS_df_weapon1type",
                    "characterSlotNumber": 31,
                    "storageSlot": -1,
                    "itemFlashType": "",
                    "itemCategory": ""
                },
                {
                    "characterSlotType": "DFSTATS_df_weapon2type",
                    "characterSlotNumber": 32,
                    "storageSlot": -1,
                    "itemFlashType": "",
                    "itemCategory": ""
                },
                {
                    "characterSlotType": "DFSTATS_df_weapon3type",
                    "characterSlotNumber": 33,
                    "storageSlot": -1,
                    "itemFlashType": "",
                    "itemCategory": ""
                },
            ],
            "hat": [{
                "characterSlotType": "DFSTATS_df_avatar_hat",
                "characterSlotNumber": 40,
                "storageSlot": -1,
                "itemFlashType": "",
                "itemCategory": ""
            }],
            "mask": [{
                "characterSlotType": "DFSTATS_df_avatar_mask",
                "characterSlotNumber": 39,
                "storageSlot": -1,
                "itemFlashType": "",
                "itemCategory": ""
            }],
            "coat": [{
                "characterSlotType": "DFSTATS_df_avatar_coat",
                "characterSlotNumber": 38,
                "storageSlot": -1,
                "itemFlashType": "",
                "itemCategory": ""
            }],
            "shirt": [{
                "characterSlotType": "DFSTATS_df_avatar_shirt",
                "characterSlotNumber": 36,
                "storageSlot": -1,
                "itemFlashType": "",
                "itemCategory": ""
            }],
            "trousers": [{
                "characterSlotType": "DFSTATS_df_avatar_trousers",
                "characterSlotNumber": 37,
                "storageSlot": -1,
                "itemFlashType": "",
                "itemCategory": ""
            }],
            "implant": [],
        };

        for (var i = 0; i < 20; i++) {
            loadoutBlueprint["implant"].push({
                "characterSlotType": "",
                "characterSlotNumber": 1001 + i,
                "storageSlot": -1,
                "itemFlashType": "",
                "itemCategory": ""
            });
        }

        loadouts[loadoutIndex] = loadoutBlueprint;
    }

    function resetLoadoutButton(loadoutIndex) {
        resetLoadout(loadoutIndex);
        //Save loadout
        GM.setValue("loadouts", JSON.stringify(loadouts));
        loadoutRefreshUsedSlotOverlay();
        loadoutOpenResetMenu();
    }

    function equipCurrentLoadout() {
        equipLoadout(activeLoadoutEdit);
    }

    function equipLoadout(loadoutNumber) {
        //Make sure at least an inventory slot is empty
        if (unsafeWindow.findFirstEmptyGenericSlot("inv") === false) {
            alert("You need at least 1 free inventory slot to equip a QuickSwap");
            return;
        }
        //We have to prepare the swap chains. Go through each item in a loadout.
        var swapList = [];
        for (var category in loadouts[loadoutNumber]) {
            if (category == "name") {
                continue;
            }
            for (var i = 0; i < loadouts[loadoutNumber][category].length; i++) {
                var loadoutItem = loadouts[loadoutNumber][category][i];
                if (loadoutItem["storageSlot"] != -1) {
                    var itemChainData = {};
                    itemChainData["loadout"] = loadoutNumber;
                    itemChainData["category"] = category;
                    itemChainData["itemIndex"] = i;
                    var isImplant = category == "implant";
                    //Check that if the user is trying to equip an implant, its restrictions still apply
                    if (isImplant && !loadoutCheckValidImplantEquip(loadoutItem["itemFlashType"], loadoutItem["characterSlotNumber"])) {
                        alert("The following implant isn't following restrictions: " + globalData[loadoutItem["itemFlashType"]]["name"] + "\nMake sure you are not trying to equip a Unique implant while already having one equipped\nIf you weere trying to equip an implant with restrictions, make sure to use the same slot in the Quickswap as the one where the blocked implant is currently equipped in your Inventory");
                        return;
                    }
                    itemChainData["chainData"] = loadoutMakeEquipSlotChain(loadoutItem["storageSlot"], loadoutItem["characterSlotNumber"], loadoutItem["characterSlotType"], isImplant);
                    swapList.push(itemChainData);
                }
            }
        }
        //Start the swap chains once every item in the loadout has been scanned
        if (swapList.length > 0) {
            closeHelpWindowPage();
            unsafeWindow.pageLock = true;
            helpWindow.innerHTML = "<div style='text-align: center'>Loading, please wait...</div>";
            helpWindow.parentNode.style.display = "block";
            loadoutEquipChainStart(swapList);
        }
    }

    function loadoutMakeEquipSlotChain(storageSlotNumber, equipSlotNumber, equipSlotType, isImplant) {
        var invFreeSlotNumber = unsafeWindow.findFirstEmptyGenericSlot("inv");
        if (invFreeSlotNumber === false) {
            return -1;
        }
        var chainParams = {}
        var takeItemFlashName = unsafeWindow.storageBox["df_store" + storageSlotNumber + "_type"];
        var takeItemFlashData = globalData[takeItemFlashName.split("_")[0]];
        if (takeItemFlashData["itemcat"] != "weapon" && takeItemFlashData["itemcat"] != "armour" && takeItemFlashData["itemcat"] != "backpack" && takeItemFlashData["implant"] != "1") {
            return -2;
        }
        //Craft the shared params and clone them to all the requests
        chainParams["take"] = {}
        chainParams["take"]["creditsnum"] = userVars["DFSTATS_df_credits"];
        chainParams["take"]["buynum"] = "0";
        chainParams["take"]["renameto"] = "undefined`undefined";
        chainParams["take"]["expected_itemprice"] = "-1";
        chainParams["take"]["price"] = unsafeWindow.getUpgradePrice();

        chainParams["equip"] = cloneObject(chainParams["take"]);
        chainParams["store"] = cloneObject(chainParams["take"]);

        chainParams["take"]["expected_itemtype2"] = "";
        chainParams["take"]["expected_itemtype"] = takeItemFlashName;
        chainParams["take"]["itemnum2"] = invFreeSlotNumber;
        chainParams["take"]["itemnum"] = 40 + parseInt(storageSlotNumber);
        chainParams["take"]["action"] = "take";

        var oldEquipItemType = '';
        if (isImplant) {
            oldEquipItemType = userVars["DFSTATS_df_implant" + (equipSlotNumber - 1000) + "_type"];
        } else {
            oldEquipItemType = userVars[equipSlotType];
        }
        chainParams["equip"]["expected_itemtype2"] = oldEquipItemType;
        chainParams["equip"]["expected_itemtype"] = takeItemFlashName;
        chainParams["equip"]["itemnum2"] = equipSlotNumber;
        chainParams["equip"]["itemnum"] = invFreeSlotNumber;
        if (isImplant) {
            chainParams["equip"]["action"] = "newswap";
        } else {
            chainParams["equip"]["action"] = "newequip";
        }

        chainParams["store"]["expected_itemtype2"] = "";
        chainParams["store"]["expected_itemtype"] = oldEquipItemType;
        chainParams["store"]["itemnum2"] = 40 + parseInt(storageSlotNumber);
        chainParams["store"]["itemnum"] = invFreeSlotNumber;
        chainParams["store"]["action"] = "store";

        return chainParams;
    }

    function loadoutEquipChainStart(swapList) {
        if (swapList.length > 0) {
            loadoutEquipChainTake(swapList);
        }
    }

    function loadoutEquipChainTake(chainParams) {
        makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php", chainParams[0]["chainData"]["take"], loadoutEquipChainSwap, chainParams);
    }

    //DO NOT USE ON ITS OWN
    function loadoutEquipChainSwap(inventoryData, chainParams) {
        unsafeWindow.updateIntoArr(unsafeWindow.flshToArr(inventoryData, "DFSTATS_"), unsafeWindow.userVars);
        makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php", chainParams[0]["chainData"]["equip"], loadoutEquipChainStore, chainParams);
    }

    //DO NOT USE ON ITS OWN
    function loadoutEquipChainStore(inventoryData, chainParams) {
        unsafeWindow.updateIntoArr(unsafeWindow.flshToArr(inventoryData, "DFSTATS_"), unsafeWindow.userVars);
        //Store info in the loadout regarding the new item that was taken off. It should have landed in our designated free inventory slot.
        var loadoutData = chainParams[0];
        for (var loadoutCategory in loadouts[0]) {
            if (loadoutCategory == "name") {
                continue;
            }
            for (var loadoutIndex = 0; loadoutIndex < loadouts.length; loadoutIndex++) {
                for (var itemIndex = 0; itemIndex < loadouts[loadoutIndex][loadoutCategory].length; itemIndex++) {
                    if (loadouts[loadoutIndex][loadoutCategory][itemIndex]["storageSlot"] == (chainParams[0]["chainData"]["take"]["itemnum"] - 40)) {
                        loadouts[loadoutIndex][loadoutCategory][itemIndex]["itemFlashType"] = userVars["DFSTATS_df_inv" + chainParams[0]["chainData"]["equip"]["itemnum"] + "_type"];
                    }
                }
            }
        }
        makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php", chainParams[0]["chainData"]["store"], loadoutEquipChainReload, chainParams);
    }

    //DO NOT USE ON ITS OWN
    function loadoutEquipChainReload(storageData, chainParams) {
        unsafeWindow.playSound("bank");
        chainParams.shift();
        //Check if all the chain items have been consumed
        if (chainParams.length > 0) {
            loadoutEquipChainStart(chainParams);
        } else {
            GM.setValue("loadouts", JSON.stringify(loadouts));
            unsafeWindow.reloadStorageData(storageData);
            unsafeWindow.reloadInventoryData();
        }
    }

    function exportLoadoutsToJson() {
        var loadoutsJson = JSON.stringify(loadouts);
        var loadoutsFileName = "silverScriptsLoadoutsExport.json";
        downloadJsonFile(loadoutsFileName, loadoutsJson);
    }

    //Code from https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
    function downloadJsonFile(filename, data) {
        const blob = new Blob([data], {
            type: 'application/json;charset=utf-8;'
        });
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        } else {
            const elem = window.document.createElement('a');
            elem.href = window.URL.createObjectURL(blob, {
                oneTimeOnly: true
            });
            elem.download = filename;
            document.body.appendChild(elem);
            elem.click();
            document.body.removeChild(elem);
        }
    }

    async function importLoadoutsFromJson() {
        //Wait for file
        const loadoutsJson = await getJsonUpload();
        //Load result as the loadouts
        loadouts = JSON.parse(loadoutsJson);
        //Save the new loadouts
        GM.setValue("loadouts", JSON.stringify(loadouts));
        //Reload the loadouts
        initLoadouts();
        //Close menu
        closeHelpWindowPage();
    }

    //Code from https://stackoverflow.com/questions/36127648/uploading-a-json-file-and-using-it
    //I am bad at Promises, this is a tweaked multi-file solution, forgive me
    const getJsonUpload = () =>
        new Promise(resolve => {
            const inputFileElement = document.createElement('input')
            inputFileElement.setAttribute('type', 'file')
            inputFileElement.setAttribute('accept', '.json')

            inputFileElement.addEventListener(
                'change',
                async (event) => {
                        const {
                            files
                        } = event.target
                        if (!files) {
                            return
                        }

                        const filePromises = [...files].map(file => file.text())

                        resolve(await Promise.any(filePromises))
                    },
                    false,
            )
            inputFileElement.click()
        })

    ////////////////////////////
    //  Cosmetic Loadouts     //
    ////////////////////////////

    function makeLoadoutCosmetic(loadoutNumber) {
        if (typeof loadoutNumber != "number" ||
            loadoutNumber < 0 ||
            loadoutNumber > 3) {
            loadoutNumber = activeLoadoutEdit;
        }

        let sidebarDiv = document.getElementsByClassName("characterRender")[0];
        let updatedVars = unsafeWindow.userVars;
        let loadout = loadouts[loadoutNumber];

        for (let category of Object.values(loadout)) {
            for (let item of category) {
                if (item["characterSlotType"] != '' && item["storageSlot"] != -1) {
                    updatedVars[item["characterSlotType"]] = item["itemFlashType"]
                }
            }
        }
        unsafeWindow.renderAvatarUpdate(sidebarDiv, updatedVars);
    }
    unsafeWindow.makeLoadoutCosmetic = makeLoadoutCosmetic;

    //////////////////////
    //  Boost Timer     //
    //////////////////////

    function addBoostTimers() {
        //The IC Inventory doesn't have boost texts, and we don't have access to player data in the forum
        if (isAtLocation("ICInventory") || isAtLocation("forum")) {
            return;
        }
        var boostersDiv = document.getElementsByClassName("boostTimes")[0];
        var newBoostText = "";
        var boostTexts = boostersDiv.innerHTML.split("<br>");
        //Check which boosts are active
        for (var i = 0; i < boostTexts.length; i++) {
            if (boostTexts[i].indexOf("Exp") != -1) {
                if (newBoostText != "") {
                    newBoostText += "<br />"
                }
                newBoostText += "+50% Exp Boost <span id='silverExpBoostDurationTimer'></span>";
                continue;
            }
            if (boostTexts[i].indexOf("Damage") != -1) {
                if (newBoostText != "") {
                    newBoostText += "<br />"
                }
                newBoostText += "+35% Damage Boost <span id='silverDmgBoostDurationTimer'></span>";
                continue;
            }
            if (boostTexts[i].indexOf("Speed") != -1) {
                if (newBoostText != "") {
                    newBoostText += "<br />"
                }
                newBoostText += "+35% Speed Boost <span id='silverSpdBoostDurationTimer'></span>";
                continue;
            }
        }
        if (newBoostText != "") {
            boostersDiv.innerHTML = newBoostText;
            startBoostTimersCountdown();
        }
    }

    function startBoostTimersCountdown() {
        setInterval(function() {
            var durationLeft = 0;
            //We have to manually keep track of the updated server time
            userVars["DFSTATS_df_servertime"] = parseInt(userVars["DFSTATS_df_servertime"]) + 1;

            var expSpan = document.getElementById("silverExpBoostDurationTimer");
            if (expSpan != undefined && expSpan.innerHTML != "(∞)") {
                durationLeft = parseInt(userVars["DFSTATS_df_boostexpuntil"]) - (parseInt(userVars["DFSTATS_df_servertime"]) + 1200000000);
                if (durationLeft > 0) {
                    if (durationLeft > 600000) {
                        expSpan.innerHTML = "(∞)";
                    } else {
                        expSpan.innerHTML = `(${secondsToHms(durationLeft)})`;
                    }
                }
            }
            var dmgSpan = document.getElementById("silverDmgBoostDurationTimer");
            if (dmgSpan != undefined && dmgSpan.innerHTML != "(∞)") {
                durationLeft = parseInt(userVars["DFSTATS_df_boostdamageuntil"]) - (parseInt(userVars["DFSTATS_df_servertime"]) + 1200000000);
                if (durationLeft > 0) {
                    if (durationLeft > 600000) {
                        dmgSpan.innerHTML = "(∞)";
                    } else {
                        dmgSpan.innerHTML = `(${secondsToHms(durationLeft)})`;
                    }
                }
            }
            var spdSpan = document.getElementById("silverSpdBoostDurationTimer");
            if (spdSpan != undefined && spdSpan.innerHTML != "(∞)") {
                durationLeft = parseInt(userVars["DFSTATS_df_boostexpuntil"]) - (parseInt(userVars["DFSTATS_df_servertime"]) + 1200000000);
                if (durationLeft > 0) {
                    if (durationLeft > 600000) {
                        spdSpan.innerHTML = "(∞)";
                    } else {
                        spdSpan.innerHTML = `(${secondsToHms(durationLeft)})`;
                    }
                }
            }
        }, 1000);
    }

    /////////////////////////
    //  Quick Service     //
    ////////////////////////

    function quickServiceArmorHelper(action) {
        //Show custom box the icon is hovered whilst the ALT is pressed
        var mousePos = unsafeWindow.mousePos;
        var playerCash = userVars["DFSTATS_df_cash"];
        var armorType = userVars['DFSTATS_df_armourtype'].split("_")[0];
        //Make sure an armor is equipped and damaged
        if (armorType != '' && parseInt(userVars['DFSTATS_df_armourhp']) < parseInt(userVars['DFSTATS_df_armourhpmax'])) {
            var armorData = globalData[armorType];
            var repairLevel = parseInt(armorData.shop_level) - 5;
            //Check that at least 1 service is available
            if (servicesDataBank["Engineer"][repairLevel][0] != undefined) {

                var servicePrice = servicesDataBank["Engineer"][repairLevel][0]["price"];
                var slotNumber = unsafeWindow.findFirstEmptyGenericSlot("inv");

                if (servicePrice <= playerCash) {
                    if (slotNumber != false) {
                        if (action == "UpdateTooltip") {
                            unsafeWindow.tooltipDisplaying = true;
                            unsafeWindow.displayPlacementMessage("Repair", mousePos[0] + 10, mousePos[1] + 10, "ACTION");
                        } else if (action == "BuyService") {
                            quickServiceArmorBuyService();
                        }
                    } else {
                        unsafeWindow.tooltipDisplaying = true;
                        unsafeWindow.displayPlacementMessage("You don't have a free inventory slot!", mousePos[0] + 10, mousePos[1] + 10, "ERROR");
                    }
                } else {
                    //If action is "BuyService" and the player doesn't have enough cash,
                    //don't fo anything
                    if (action == "UpdateTooltip") {
                        unsafeWindow.tooltipDisplaying = true;
                        unsafeWindow.displayPlacementMessage("You don't have enough cash to use this service!", mousePos[0] + 10, mousePos[1] + 10, "ERROR");
                    }
                }
            }
        }
    }

    function quickServiceArmorMakeChain() {
        var invFreeSlotNumber = unsafeWindow.findFirstEmptyGenericSlot("inv");
        if (invFreeSlotNumber === false) {
            return -1;
        }
        var chainParams = {}
        //Craft the shared params and clone them to all the requests
        chainParams["unequip"] = {}
        chainParams["unequip"]["creditsnum"] = userVars["DFSTATS_df_credits"];
        chainParams["unequip"]["buynum"] = "0";
        chainParams["unequip"]["renameto"] = "undefined`undefined";
        chainParams["unequip"]["expected_itemprice"] = "-1";
        chainParams["unequip"]["price"] = unsafeWindow.getUpgradePrice();

        chainParams["equip"] = cloneObject(chainParams["unequip"]);

        chainParams["unequip"]["expected_itemtype2"] = userVars["DFSTATS_df_armourtype"];
        chainParams["unequip"]["expected_itemtype"] = "";
        chainParams["unequip"]["itemnum2"] = 34;
        chainParams["unequip"]["itemnum"] = invFreeSlotNumber;
        chainParams["unequip"]["action"] = "newequip";

        chainParams["equip"]["expected_itemtype2"] = "";
        chainParams["equip"]["expected_itemtype"] = userVars["DFSTATS_df_armourtype"];
        chainParams["equip"]["itemnum2"] = 34;
        chainParams["equip"]["itemnum"] = invFreeSlotNumber;
        chainParams["equip"]["action"] = "newequip";

        return chainParams;
    }

    async function quickServiceArmorBuyService() {

        closeHelpWindowPage();
        unsafeWindow.pageLock = true;
        helpWindow.innerHTML = "<div style='text-align: center'>Loading, please wait...</div>";
        helpWindow.parentNode.style.display = "block";

        var invFreeSlotNumber = unsafeWindow.findFirstEmptyGenericSlot("inv");
        var chainParams = quickServiceArmorMakeChain()

        //Unequip armor
        await makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php", chainParams["unequip"], updateInventoryData, null);
        //Repair armor
        await buyService(invFreeSlotNumber);
        //Equip repaired armor
        await makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php", chainParams["equip"], updateInventoryData, null);

        closeHelpWindowPage();

    }

    async function quickServiceItemHelper(action, category) {
        //Show custom box the icon is hovered whilst the ALT is pressed
        var mousePos = unsafeWindow.mousePos;
        var playerCash = userVars["DFSTATS_df_cash"];
        //Make sure it makes sense to use the QuickService
        if (
            (category == "Medical" && parseInt(userVars["DFSTATS_df_hpcurrent"]) < parseInt(userVars["DFSTATS_df_hpmax"])) ||
            (category == "Food" && parseInt(userVars['DFSTATS_df_hungerhp']) < 100)
        ) {

            //Refresh tradeInfo
            var itemId, needsAdminister;
            if (category == "Medical") {
                [itemId, needsAdminister] = getBestLevelAppropriateMedicalTypeAndAdministerNeed();
            } else {
                itemId = getBestLevelAppropriateFoodType();
            }
            var result = await requestItem(itemsDataBank[itemId]);
            if (!result) {
                alert("The request went wrong. You might be rate limited. Try again in a minute. If the issue persists, contact SilverBeam.");
                return;
            }

            //Check that at least 1 service is available if trying to heal
            if (category == "Medical" && servicesDataBank["Doctor"][itemsDataBank[itemId].professionLevel][0] == undefined) {
                unsafeWindow.tooltipDisplaying = true;
                unsafeWindow.displayPlacementMessage("No available Doctors were found!", mousePos[0] + 10, mousePos[1] + 10, "ERROR");
                return;
            }

            var slotNumber = findLastEmptyGenericSlot("inv");
            var itemPrice = itemsDataBank[itemId]["trades"][0]["price"];
            if (category == "Medical" && needsAdminister) {
                itemPrice += servicesDataBank["Doctor"][itemsDataBank[itemId].professionLevel][0]["price"];
            }

            if (itemPrice <= playerCash) {
                if (slotNumber != false) {
                    if (action == "UpdateTooltip") {
                        unsafeWindow.tooltipDisplaying = true;
                        unsafeWindow.displayPlacementMessage("Refill", mousePos[0] + 10, mousePos[1] + 10, "ACTION");
                    } else if (action == "BuyService") {
                        if (category == "Medical") {
                            quickServiceMedicalBuyItemAndService();
                        }
                        if (category == "Food") {
                            quickServiceFoodBuyItemAndEat();
                        }
                    }
                } else {
                    unsafeWindow.tooltipDisplaying = true;
                    unsafeWindow.displayPlacementMessage("You don't have a free inventory slot!", mousePos[0] + 10, mousePos[1] + 10, "ERROR");
                }
            } else {
                //If action is "BuyService" and the player doesn't have enough cash,
                //don't fo anything
                if (action == "UpdateTooltip") {
                    unsafeWindow.tooltipDisplaying = true;
                    unsafeWindow.displayPlacementMessage("You don't have enough cash to use this service!", mousePos[0] + 10, mousePos[1] + 10, "ERROR");
                }
            }
        }
    }

    async function quickServiceMedicalBuyItemAndService() {

        closeHelpWindowPage();
        unsafeWindow.pageLock = true;
        helpWindow.innerHTML = "<div style='text-align: center'>Loading, please wait...</div>";
        helpWindow.parentNode.style.display = "block";

        var invFreeSlotNumber = findLastEmptyGenericSlot("inv");
        var [itemId, needsAdminister] = getBestLevelAppropriateMedicalTypeAndAdministerNeed();

        //Buy the item
        var result = await buyItem(itemId);
        if (!result) {
            helpWindow.innerHTML = "<div style='text-align: center'>Something went wrong</div>";
            setTimeout(closeHelpWindowPage, 5000);
        }
        if (needsAdminister) {
            //Administer the item
            await buyService(invFreeSlotNumber);
        } else {
            //Use the item
            var params = {}
            params["creditsnum"] = "0";
            params["buynum"] = "0";
            params["renameto"] = "undefined`undefined";
            params["expected_itemprice"] = "-1";
            params["expected_itemtype2"] = "";
            params["expected_itemtype"] = itemId;
            params["itemnum2"] = "0";
            params["itemnum"] = invFreeSlotNumber;
            params["price"] = "0";
            params["action"] = "newuse";

            await makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php", params, updateInventoryData, null);

            unsafeWindow.playSound("heal");

        }

        closeHelpWindowPage();

    }

    async function quickServiceFoodBuyItemAndEat() {

        closeHelpWindowPage();
        unsafeWindow.pageLock = true;
        helpWindow.innerHTML = "<div style='text-align: center'>Loading, please wait...</div>";
        helpWindow.parentNode.style.display = "block";

        var invFreeSlotNumber = findLastEmptyGenericSlot("inv");
        var itemId = getBestLevelAppropriateFoodType();

        //Buy the item
        var result = await buyItem(itemId);
        if (!result) {
            helpWindow.innerHTML = "<div style='text-align: center'>Something went wrong</div>";
            setTimeout(closeHelpWindowPage, 5000);
        }

        //Eat the item
        //Craft the params
        var params = {}
        params["creditsnum"] = "0";
        params["buynum"] = "0";
        params["renameto"] = "undefined`undefined";
        params["expected_itemprice"] = "-1";
        params["expected_itemtype2"] = "";
        params["expected_itemtype"] = itemId;
        params["itemnum2"] = "0";
        params["itemnum"] = invFreeSlotNumber;
        params["price"] = "0";
        params["action"] = "newconsume";

        await makeRequest("https://fairview.deadfrontier.com/onlinezombiemmo/inventory_new.php", params, updateInventoryData, null);

        unsafeWindow.playSound("eat");

        closeHelpWindowPage();

    }

    //////////////////////////////
    // Quick Character Swapper ///
    //////////////////////////////

    function clearCookies() {
        var cookies = document.cookie.split(';');
        //Clear seen ad banners
        for (var i in cookies) {
            var vals = cookies[i].split('=');
            var name = vals.shift(0, 1).trim();
            if (name.includes("_seen_brief")) {
                document.cookie = name + '=; Path=/onlinezombiemmo;Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            }
        }
        //Clear the actual login cookie and the lastuser
        document.cookie = 'DeadFrontierFairview=; Path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        document.cookie = 'lastLoginUser=; Path=/onlinezombiemmo;Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    function clearAndSetCookies(cookie) {
        clearCookies();
        var cookies = cookie.split(';');
        for (var i in cookies) {
            var vals = cookies[i].split('=');
            var name = vals.shift(0, 1).trim();
            if (name.includes("_seen_brief") || name.includes("lastLoginUser")) {
                //Restore seen ad banners
                document.cookie = name + '=' + vals.join('=') + '; Path=/onlinezombiemmo;max-age=31536000;';
            } else if (name == 'DeadFrontierFairview') {
                //Restore the actual login cookie
                document.cookie = name + '=' + vals.join('=') + '; Path=/;max-age=31536000;';
            }
        }
    }

    function changeCharacter(cookies) {
        clearAndSetCookies(cookies);
        window.open("https://fairview.deadfrontier.com/onlinezombiemmo/index.php", "_self");
    }

    //////////////////////
    // Sidebar Expanded //
    //////////////////////

    function moveTooltipAndGrabbedItemOnTop() {
        //Make this only trigger if an inventory is available
        if (!isAtLocation("inventories") || isAtLocation("ICInventory")) {
            return;
        }
        //Bring tooltip on top
        var tooltip = document.getElementById("textAddon");
        var newParent = tooltip.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
        tooltip.style.position = "absolute";
        tooltip.style.fontFamily = "Courier New,Arial";
        tooltip.style.fontWeight = 600;
        tooltip.style.textAlign = "center";
        tooltip.style.zIndex = 20;
        newParent.id = "gameWindow";
        newParent.style.position = "relative";
        newParent.appendChild(tooltip);

        //Update tooltip display function
        unsafeWindow.vanillaDisplayPlacementMessage = unsafeWindow.displayPlacementMessage;
        unsafeWindow.displayPlacementMessage = hijackedDisplayPlacementMessage;

        //Update tooltip clean function
        unsafeWindow.vanillaCleanPlacementMessage = unsafeWindow.cleanPlacementMessage;
        unsafeWindow.cleanPlacementMessage = hijackedCleanPlacementMessage;

        //Update item drag functions
        unsafeWindow.inventoryHolder.removeEventListener("mousemove", unsafeWindow.drag);
        newParent.addEventListener("mousemove", hijackedFakeItemDrag);

        //Bring fake grabbed item on top
        var fakeGrabbedItem = document.getElementById("fakeGrabbedItem");
        fakeGrabbedItem.style.position = "absolute";
        fakeGrabbedItem.style.display = "none";
        fakeGrabbedItem.style.width = "40px";
        fakeGrabbedItem.style.height = "40px";
        fakeGrabbedItem.style.opacity = 0.6;
        newParent.appendChild(fakeGrabbedItem);

        //Add item interaction div to the sidebar
        var interactionWindow = document.createElement("div");
        interactionWindow.style.position = "absolute";
        interactionWindow.style.width = "85px";
        interactionWindow.style.height = "270px";
        interactionWindow.style.left = "0px"
        interactionWindow.style.top = "80px";
        interactionWindow.dataset.action = "giveToChar";
        interactionWindow.className = "fakeSlot";
        document.getElementById("sidebar").appendChild(interactionWindow);
    }

    //Hijack the tooltip display function to temporarily swap what the game believes to be the inventory holder.
    //This is needed in order to circumvent the inventory bounding box check.
    function hijackedDisplayPlacementMessage(msg, x, y, type) {
        var gameWindow = document.getElementById("gameWindow");
        var oldInventoryHolder = unsafeWindow.inventoryHolder;
        unsafeWindow.inventoryHolder = gameWindow;
        unsafeWindow.vanillaDisplayPlacementMessage(msg, x, y, type);
        unsafeWindow.inventoryHolder = oldInventoryHolder;
    }

    //Hijack the tooltip clean function. This is needed because the new hover function cleans the tooltip
    //on mouse move in the whole window.
    function hijackedCleanPlacementMessage() {
        if (!unsafeWindow.tooltipDisplaying) {
            unsafeWindow.vanillaCleanPlacementMessage();
        }
    }

    //Hijack the drag function to temporarily swap what the game believes to be the inventory holder.
    //This is needed in order to circumvent the inventory bounding box check.
    function hijackedFakeItemDrag(e) {
        var gameWindow = document.getElementById("gameWindow");
        var oldInventoryHolder = unsafeWindow.inventoryHolder;
        unsafeWindow.inventoryHolder = gameWindow;
        unsafeWindow.drag(e);
        unsafeWindow.inventoryHolder = oldInventoryHolder;
    }

    //Hide the tooltip if unsafeWindow.tooltipDisplaying is false
    function cleanTooltipIfNeeded() {
        if (unsafeWindow.tooltipDisplaying) {
            unsafeWindow.tooltipDisplaying = false;
            unsafeWindow.cleanPlacementMessage();
        }
    }

    //////////////
    // Konami ///
    /////////////

    function addKonami() {
        if (!isAtLocation("home")) {
            return;
        }

        var konamiList = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        var konamiPosition = 0;

        document.addEventListener('keydown', function(e) {
            if (konamiPosition == -1) {
                return;
            }
            var key = e.code;
            var requiredKey = konamiList[konamiPosition];
            if (key == requiredKey) {
                konamiPosition++;
                if (konamiPosition == konamiList.length) {
                    konamiPosition = -1;
                    unsafeWindow.playSound("heal");
                    activateDisco();
                }
            } else {
                konamiPosition = 0;
            }
        });
    }

    function activateDisco() {
        var disco = new Audio("https://dl.sndup.net/v3pvv/ouch.mp3");
        disco.play();
    }

    //////////////////////////////
    //  DOM Event Listeners     //
    //////////////////////////////


    function registerEventListeners() {
        //Inventories
        if (isAtLocation("inventories")) {
            var inventorySlots = [...document.getElementsByClassName("validSlot")].filter(node => node.parentNode.parentNode.id == "inventory");
            for (var slot of inventorySlots) {
                slot.addEventListener("mouseenter", mouseEnterSlotHandler);
                slot.addEventListener("mouseleave", mouseLeaveSlotHandler);
                slot.addEventListener("mousemove", showTooltipHandler);
                slot.addEventListener("mouseup", mouseUpSlotHandler, true);
            }
            var inventoryTable = document.getElementById("inventory");
            inventoryTable.addEventListener("mouseenter", mouseEnterInventoryHandler);
            inventoryTable.addEventListener("mouseleave", mouseLeaveInventoryHandler);

            window.addEventListener("keydown", showTooltipHandler);
            window.addEventListener("keyup", windowKeyUpHandler);
        }

        //Marketplace
        if (isAtLocation("marketplace")) {
            registerTabSwitchHandlers();
            registerQuickServiceHandlers();
        }

        //Save market data on page exit
        window.addEventListener("beforeunload", saveMarketData);
    }

    //Register handlers to move menu depending on market tab
    function registerTabSwitchHandlers() {
        var marketBuyingTab = document.getElementById("loadBuying");
        var marketSellingTab = document.getElementById("loadSelling");
        var marketPrivateTab = document.getElementById("loadPrivate");
        var marketTradingTab = document.getElementById("loadItemForItem");

        //Return if we are in a submenu, like the ones in the item-for-item tab
        if (marketBuyingTab == null) {
            return;
        }

        marketBuyingTab.addEventListener("click", exitTradingClickHandler);
        marketBuyingTab.addEventListener("click", registerMarketListObserver);
        marketSellingTab.addEventListener("click", exitTradingClickHandler);
        marketPrivateTab.addEventListener("click", enterTradingClickHandler);
        marketTradingTab.addEventListener("click", enterTradingClickHandler);
    }

    //Register QuickService handlers
    function registerQuickServiceHandlers() {
        var sidebarArmourIcon = document.getElementById("sidebarArmour");

        sidebarArmourIcon.addEventListener("mousemove", showQuickServiceArmorTooltipHandler);
        sidebarArmourIcon.addEventListener("mouseup", mouseUpQuickServiceArmorHandler, true);
        sidebarArmourIcon.addEventListener("mouseleave", mouseLeaveQuickServiceArmorHandler);

        var sidebarHealthText = document.getElementsByClassName("playerHealth")[0];
        var sidebarHealthIcon = document.getElementsByClassName("playerHealth")[0].parentNode.firstChild;

        sidebarHealthText.addEventListener("mousemove", showQuickServiceMedicalTooltipHandler);
        sidebarHealthIcon.addEventListener("mousemove", showQuickServiceMedicalTooltipHandler);
        sidebarHealthText.addEventListener("mouseup", mouseUpQuickServiceMedicalHandler, true);
        sidebarHealthIcon.addEventListener("mouseup", mouseUpQuickServiceMedicalHandler, true);
        sidebarHealthText.addEventListener("mouseleave", mouseLeaveQuickServiceMedicalHandler);
        sidebarHealthIcon.addEventListener("mouseleave", mouseLeaveQuickServiceMedicalHandler);

        var sidebarFoodText = document.getElementsByClassName("playerNourishment")[0];
        var sidebarFoodIcon = document.getElementsByClassName("playerNourishment")[0].parentNode.firstChild;

        sidebarFoodText.addEventListener("mousemove", showQuickServiceFoodTooltipHandler);
        sidebarFoodIcon.addEventListener("mousemove", showQuickServiceFoodTooltipHandler);
        sidebarFoodText.addEventListener("mouseup", mouseUpQuickServiceFoodHandler, true);
        sidebarFoodIcon.addEventListener("mouseup", mouseUpQuickServiceFoodHandler, true);
        sidebarFoodText.addEventListener("mouseleave", mouseLeaveQuickServiceFoodHandler);
        sidebarFoodIcon.addEventListener("mouseleave", mouseLeaveQuickServiceFoodHandler);
    }

    //Detect which slot has been entered
    function mouseEnterSlotHandler(e) {
        var slot = e.target.dataset.slot;
        if (lastSlotHovered != slot) {
            lastSlotHovered = slot;
        }
        //Fetch market info on item, if present
        if (e.target.childNodes.length > 0) {
            var itemName = e.target.childNodes[0].dataset.type.split("_")[0];
            var itemExtraInfo = e.target.childNodes[0].dataset.type.split("_")[1];
            //Fix for cooked items detection
            if (itemExtraInfo == "cooked") {
                itemName = itemName + "_cooked";
            }
            requestItem(itemsDataBank[itemName]);
        }
    }

    //Fix hoverbox popping when DOM is injected by only showing hoverBox after
    //content is injected
    function mouseLeaveSlotHandler(e) {
        infoBox.style.opacity = 0;

        cleanTooltipIfNeeded();
    }

    function mouseUpSlotHandler(e) {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        //Check if autoService isn't disabled
        if (e.altKey && lastSlotHovered != -1 && userSettings.autoService) {
            var targetInventoryItem = inventoryArray[lastSlotHovered - 1];
            if (havePendingRequestsCompleted()) {
                autoServiceHelper(targetInventoryItem, "BuyService");
            }
        }
    }

    //Slot hover handler used to update tooltip location
    function showTooltipHandler(e) {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        //Check if autoService isn't disabled
        if (e.altKey && lastSlotHovered != -1 && userSettings.autoService) {
            var targetInventoryItem = inventoryArray[lastSlotHovered - 1];
            if (havePendingRequestsCompleted()) {
                autoServiceHelper(targetInventoryItem, "UpdateTooltip");
            }
        }
    }

    //Make hoverBox invisible untill DOM is injected to prevent popping
    function mouseEnterInventoryHandler(e) {
        infoBox.style.opacity = 0;
    }

    function mouseLeaveInventoryHandler(e) {
        //Reset hoverBox visibility on exit
        infoBox.style.opacity = 1;
        //Reset hovered slot index when the inventory table is exited
        lastSlotHovered = -1;
    }

    //Check and eventually clean the tooltip
    function windowKeyUpHandler(e) {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        //Check if autoService isn't disabled
        if (e.key == "Alt" && userSettings.autoService) {
            e.preventDefault(); //We don't want the browser to focus out of the window
            document.getElementById("sidebarArmour").style.cursor = "default";

            cleanTooltipIfNeeded();
        }
    }

    function helpMenuClickHandler(e) {
        openHelpWindowPage("home");
    }

    function loadoutsClickHandler(e) {
        openHelpWindowPage("loadoutsMenu");
    }

    //Move the menu button in the item-for-item page
    function enterTradingClickHandler(e) {
        document.getElementById("silverscriptsMenuButton").style.right = "100px";
    }

    //Move the menu button after exiting the item-for-item page
    function exitTradingClickHandler(e) {
        document.getElementById("silverscriptsMenuButton").style.right = "20px";
    }

    //Save to storage the market data across page refreshes
    async function saveMarketData() {
        savedMarketData["itemsDataBank"] = itemsDataBank;
        savedMarketData["servicesDataBank"] = servicesDataBank;
        await GM.setValue("savedMarketData", JSON.stringify(savedMarketData));
    }

    function showQuickServiceArmorTooltipHandler(e) {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        //Check if autoService isn't disabled
        if (e.altKey && userSettings.autoService) {
            if (havePendingRequestsCompleted()) {
                if (userVars['DFSTATS_df_armourtype'].split("_")[0] != '' &&
                    parseInt(userVars['DFSTATS_df_armourhp']) < parseInt(userVars['DFSTATS_df_armourhpmax'])) {
                    document.getElementById("sidebarArmour").style.cursor = "grab";
                    quickServiceArmorHelper("UpdateTooltip");
                }
            }
        }
    }

    function mouseUpQuickServiceArmorHandler(e) {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        document.getElementById("sidebarArmour").style.cursor = "default";

        cleanTooltipIfNeeded();

        //Check if autoService isn't disabled
        if (e.altKey && userSettings.autoService) {
            if (havePendingRequestsCompleted()) {
                quickServiceArmorHelper("BuyService");
            }
        }
    }

    function mouseLeaveQuickServiceArmorHandler(e) {
        document.getElementById("sidebarArmour").style.cursor = "default";

        cleanTooltipIfNeeded();
    }

    function showQuickServiceMedicalTooltipHandler(e) {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        //Check if autoService isn't disabled
        if (e.altKey && userSettings.autoService) {
            if (havePendingRequestsCompleted()) {
                if (parseInt(userVars["DFSTATS_df_hpcurrent"]) < parseInt(userVars["DFSTATS_df_hpmax"])) {
                    document.getElementsByClassName("playerHealth")[0].style.cursor = "grab";
                    document.getElementsByClassName("playerHealth")[0].parentNode.firstChild.style.cursor = "grab";
                    quickServiceItemHelper("UpdateTooltip", "Medical");
                }
            }
        }
    }

    function mouseUpQuickServiceMedicalHandler(e) {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        document.getElementsByClassName("playerHealth")[0].style.cursor = "default";
        document.getElementsByClassName("playerHealth")[0].parentNode.firstChild.style.cursor = "default";

        cleanTooltipIfNeeded();

        //Check if autoService isn't disabled
        if (e.altKey && userSettings.autoService) {
            if (havePendingRequestsCompleted()) {
                if (parseInt(userVars["DFSTATS_df_hpcurrent"]) < parseInt(userVars["DFSTATS_df_hpmax"])) {
                    quickServiceItemHelper("BuyService", "Medical");
                }
            }
        }
    }

    function mouseLeaveQuickServiceMedicalHandler(e) {
        document.getElementsByClassName("playerHealth")[0].style.cursor = "default";
        document.getElementsByClassName("playerHealth")[0].parentNode.firstChild.style.cursor = "default";

        cleanTooltipIfNeeded();
    }

    function showQuickServiceFoodTooltipHandler(e) {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        //Check if autoService isn't disabled
        if (e.altKey && userSettings.autoService) {
            if (havePendingRequestsCompleted()) {
                if (parseInt(userVars['DFSTATS_df_hungerhp']) < 100) {
                    document.getElementsByClassName("playerNourishment")[0].style.cursor = "grab";
                    document.getElementsByClassName("playerNourishment")[0].parentNode.firstChild.style.cursor = "grab";
                    quickServiceItemHelper("UpdateTooltip", "Food");
                }
            }
        }
    }

    function mouseUpQuickServiceFoodHandler(e) {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        document.getElementsByClassName("playerNourishment")[0].style.cursor = "default";
        document.getElementsByClassName("playerNourishment")[0].parentNode.firstChild.style.cursor = "default";

        cleanTooltipIfNeeded();

        //Check if autoService isn't disabled
        if (e.altKey && userSettings.autoService) {
            if (havePendingRequestsCompleted()) {
                if (parseInt(userVars['DFSTATS_df_hungerhp']) < 100) {
                    quickServiceItemHelper("BuyService", "Food");
                }
            }
        }
    }

    function mouseLeaveQuickServiceFoodHandler(e) {
        document.getElementsByClassName("playerNourishment")[0].style.cursor = "default";
        document.getElementsByClassName("playerNourishment")[0].parentNode.firstChild.style.cursor = "default";

        cleanTooltipIfNeeded();
    }

    //////////////////////
    //  DOM Observers   //
    /////////////////////

    function registerDOMObservers() {
        registerHoverBoxObserver();
        registerInventoryObserver();
        registerMarketObserver();
        registerMarketListObserver();
        registerStorageObserver();
        //registerMarketSidebarObserver();
    }

    function registerHoverBoxObserver() {
        //This service should only be available in inventories
        if (!isAtLocation("inventories")) {
            return;
        }
        var observerTargetNode = unsafeWindow.infoBox;
        var mutationConfig = {
            childList: true,
            subtree: true
        };

        var hoverBoxMutationCallback = function(mutationList, observer) {
            //Only listen for childList mutations
            for (var mutation of mutationList) {
                if (mutation.type === 'childList') {
                    //Detect the class of the children. If any has "itemName", then this is a vanilla js mutation
                    var isVanillaMutation = Object.values(mutation.addedNodes).some(node => node.className === "itemName");
                    if (isVanillaMutation && lastSlotHovered != -1) {
                        //We are already catching the current slot number via the mouseEnter eventListener,
                        //which always fires before the vanilla mutation occurs
                        fillHoverBox();
                        break;
                    }
                }
            }
        };

        var hoverBoxObserver = new MutationObserver(hoverBoxMutationCallback);
        hoverBoxObserver.observe(observerTargetNode, mutationConfig);
    }

    function registerInventoryObserver() {
        //This service should only be available in inventories
        if (!isAtLocation("inventories")) {
            return;
        }
        var observerTargetNode = document.getElementById("inventory");
        var mutationConfig = {
            childList: true,
            subtree: true
        };

        var inventoryMutationCallback = function(mutationList, observer) {
            //Update inventory and databank info only if inventory mutated,
            //and only if mutation happened at least pendingRequests.requestsCooldownPeriod milliseconds
            //after the last one
            //We must wait until all the mutations have occured onto the inventory before updating,
            //thus 500ms are waited before fetching new data
            setTimeout(function() {
                if (!pendingRequests.requestsCoolingDown) {
                    initInventoryArray();
                    resetDataBankItemsMarketInfo();
                    refreshServicesDataBank();
                    pendingRequests.requestsCoolingDown = true;
                    setTimeout(function() {
                        pendingRequests.requestsCoolingDown = false;
                    }, pendingRequests.requestsCooldownPeriod);
                }
            }, 500);
        };

        var inventoryObserver = new MutationObserver(inventoryMutationCallback);
        inventoryObserver.observe(observerTargetNode, mutationConfig);
    }

    function registerMarketObserver() {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        var observerTargetNode = document.getElementById("marketplace");
        var mutationConfig = {
            childList: true,
            subtree: true
        };

        var marketMutationCallback = function(mutationList, observer) {
            //It seems that whenever a tab is switched, all listeners get unregistered. Register them again.
            //The menu needs to be fixed only in the market
            if (isAtLocation("marketplace")) {
                registerTabSwitchHandlers();
            }
        };

        var marketObserver = new MutationObserver(marketMutationCallback);
        marketObserver.observe(observerTargetNode, mutationConfig);
    }

    function registerMarketListObserver() {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        var observerTargetNode = document.getElementById("itemDisplay");
        var mutationConfig = {
            childList: true,
            subtree: true
        };

        var marketListMutationCallback = function(mutationList, observer) {
            //Check if the service is enabled
            if (!userSettings.autoMarketWithdraw) {
                return;
            }
            //Check if the user is in the "buy" market tab
            if (unsafeWindow.marketScreen == "buy") {
                for (var mutation of mutationList) {
                    if (mutation.addedNodes.length > 0) {
                        //We filter out our own changes
                        if (mutation.addedNodes[0].tagName != "BUTTON" && mutation.target.tagName != "BUTTON") {
                            injectAutoMarketWithdrawButton(mutation.addedNodes[0]);
                        }
                    }
                }
            }
        };

        var marketListObserver = new MutationObserver(marketListMutationCallback);
        marketListObserver.observe(observerTargetNode, mutationConfig);
    }

    function registerStorageObserver() {
        //This service should only be available in the storage
        if (!isAtLocation("storage")) {
            return;
        }
        var observerTargetNode = document.getElementById("normalContainer");
        var mutationConfig = {
            childList: true,
            subtree: true
        };

        var storageMutationCallback = function(mutationList, observer) {
            //Check if an item got taken away from a saved slot
            if (mutationList.length <= 4) {
                for (var mutation of mutationList) {
                    if (mutation.removedNodes.length > 0) {
                        var removedItemData = mutation.removedNodes[0].dataset;
                        var removedItemCategory = removedItemData.itemtype;
                        if (removedItemCategory in loadouts[0]) {
                            for (var i = 0; i < 4; i++) {
                                for (var j = 0; j < loadouts[i][removedItemCategory].length; j++) {
                                    if (loadouts[i][removedItemCategory][j]["storageSlot"] == mutation.target.dataset.slot &&
                                        loadouts[i][removedItemCategory][j]["itemFlashType"] == removedItemData.type) {
                                        //An item registered to a loadout got moved. Reset its stats
                                        loadouts[i][removedItemCategory][j]["storageSlot"] = -1;
                                        loadouts[i][removedItemCategory][j]["itemFlashType"] = "";
                                        loadouts[i][removedItemCategory][j]["itemCategory"] = "";
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            for (mutation of mutationList) {
                if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].className != "silverScriptsCensor" && mutation.addedNodes[0].className != "silverScriptsLoadoutIndicator") {
                    loadoutAddUsedSlotOverlay(mutation.addedNodes[0].parentNode);
                    if (pickingLoadoutCategory != "") {
                        filterStorageSlotDuringPicking(mutation.addedNodes[0].parentNode);
                    }
                }
            }
        };

        var storageObserver = new MutationObserver(storageMutationCallback);
        storageObserver.observe(observerTargetNode, mutationConfig);
    }

    function registerMarketSidebarObserver() {
        //This service should only be available in the market
        if (!isAtLocation("marketplace")) {
            return;
        }
        var observerTargetNode = document.getElementById("sidebar");
        var mutationConfig = {
            childList: true,
            subtree: true
        };

        var marketMutationCallback = function(mutationList, observer) {
            //It seems that whenever a tab is switched, all listeners get unregistered. Register them again.
            //The menu needs to be fixed only in the market
            if (isAtLocation("marketplace")) {
                registerQuickServiceHandlers();
            }
        };

        var marketObserver = new MutationObserver(marketMutationCallback);
        marketObserver.observe(observerTargetNode, mutationConfig);
    }

    //////////////////////////
    //  UI Update Functions //
    //////////////////////////

    //Fix hoverbox pointer events
    function removeHoverBoxPointerEvents() {
        //Check that an inventory is open
        if (!isAtLocation("inventories")) {
            return;
        }
        //Remove pointer events from injected UI and the hoverBox itself
        //Style tag injection is needed because on Chrome the only 2 stylesheets
        //available in the inner city inventory page are read-write protected
        var sheet = document.createElement("style");
        sheet.innerText = ".silverStats { pointer-events: none; }";
        document.head.appendChild(sheet)
        infoBox.style.pointerEvents = "none";
        //The fake grabbed item sometimes confuses the browser.
        var grabbedItem = document.getElementById("fakeGrabbedItem");
        grabbedItem.style.pointerEvents = "none";
        //Make sure the hoverBox the closest element to the screeen while we're at it
        infoBox.style.zIndex = 1000;
    }

    //Add help text prompt
    function addHelpButton() {
        //Check that an inventory is open
        if (!isAtLocation("inventories")) {
            return;
        }
        var inventoryHolder = document.getElementById("inventoryholder");
        var helpButton = document.createElement("button");
        helpButton.textContent = "SilverScripts Menu";
        helpButton.id = "silverscriptsMenuButton";
        helpButton.className = "opElem";
        helpButton.style.bottom = "86px";
        helpButton.style.right = "20px";
        helpButton.addEventListener("click", helpMenuClickHandler)
        inventoryHolder.appendChild(helpButton);
    }

    //Add loadout button if the storage is open
    function addLoadoutButton() {
        //Check that the storage is open
        if (!isAtLocation("storage")) {
            return;
        }
        var inventoryHolder = document.getElementById("inventoryholder");
        var loadoutButton = document.createElement("button");
        loadoutButton.textContent = "Quickswap Menu";
        loadoutButton.className = "opElem";
        loadoutButton.style.bottom = "86px";
        loadoutButton.style.right = "180px";
        loadoutButton.addEventListener("click", openLoadoutsMenu)
        inventoryHolder.appendChild(loadoutButton);
    }

    //Container used to display various buttons such as the QuickSwitcher
    function addTopMenuContainer() {
        let mainSelect = document.body;
        let topMenuContainer = document.createElement("div");
        topMenuContainer.id = "silverScriptsTopMenuContainer";
        topMenuContainer.style.display = "grid";
        topMenuContainer.style.rowGap = "5px";
        topMenuContainer.style.position = "fixed";
        topMenuContainer.style.top = "18px";
        //Move to the left in inventories for compatibility with Rebekah's Scripts
        if (isAtLocation("inventories")) {
            topMenuContainer.style.left = "2px";
        } else {
            topMenuContainer.style.right = "2px";
        }
        topMenuContainer.style.zIndex = "20";
        mainSelect.appendChild(topMenuContainer);
    }

    //Add character quick switcher button if at home. Credit to Rebekah/Tectonic Stupidity for the UI design.
    function addQuickSwitcherButton() {
        //check that home is open
        if ((!isAtLocation("home") && !userSettings.alwaysDisplayQuickSwitcher) ||
            isAtLocation("ICInventory") || isAtLocation("innerCity")
        ) {
            return;
        }

        let topMenuContainer = document.getElementById("silverScriptsTopMenuContainer");
        let container = document.createElement("div");
        container.style.height = "max-content";
        container.style.width = "max-content";
        container.style.minWidth = "41px";
        container.style.justifySelf = "end";
        container.style.padding = "5px";
        container.style.border = "2px solid rgb(100, 0, 0";
        container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        container.style.backdropFilter = "blur(5px)";
        let button = document.createElement("button");
        button.textContent = "Character Quick Switcher";
        button.id = "silverScriptsQuickSwitcherButton";
        button.style.height = "max-content";
        button.addEventListener("click", function() {
            document.getElementById("silverScriptsQuickSwitcherRowsContainer").style.display = "grid";
            document.getElementById("silverScriptsQuickSwitcherButton").style.display = "none";
        });
        container.appendChild(button);

        let subContainer = document.createElement("div");
        subContainer.id = "silverScriptsQuickSwitcherRowsContainer";
        subContainer.style.display = "none";
        subContainer.style.rowGap = "5px";

        let usersContainer = document.createElement("div");
        usersContainer.id = "silverScriptsQuickSwitcherUsersDisplay";
        usersContainer.style.display = "grid";
        usersContainer.style.rowGap = "5px";
        subContainer.appendChild(usersContainer);

        let spacing = document.createElement("button");
        spacing.textContent = " ";
        spacing.style.height = "max-content";
        spacing.style.display = "block";
        spacing.style.justifySelf = "center";
        subContainer.appendChild(spacing);

        //Add page navigation
        let rowContainer = document.createElement("div");
        rowContainer.style.display = "grid";
        rowContainer.style.gridTemplateColumns = "auto auto";
        rowContainer.style.columnGap = "10px";

        button = document.createElement("button");
        button.id = "silverScriptsQuickSwitcherButtonLeft";
        button.textContent = "<<";
        button.style.justifySelf = "left";
        button.style.marginLeft = "40%";
        button.addEventListener("click", function(e) {
            changeQuickSwitcherPage(false);
        });
        button.disabled = true;
        rowContainer.appendChild(button);

        button = document.createElement("button");
        button.id = "silverScriptsQuickSwitcherButtonRight";
        button.textContent = ">>";
        button.style.justifySelf = "right";
        button.style.marginRight = "40%";
        button.addEventListener("click", function(e) {
            changeQuickSwitcherPage(true);
        });
        button.disabled = true;
        rowContainer.appendChild(button);

        subContainer.appendChild(rowContainer);

        button = document.createElement("button");
        button.id = "silverScriptsQuickSwitcherClose";
        button.textContent = "Close";
        button.style.height = "max-content";
        button.style.display = "block";
        button.style.justifySelf = "center";
        button.addEventListener("click", function() {
            document.getElementById("silverScriptsQuickSwitcherRowsContainer").style.display = "none";
            document.getElementById("silverScriptsQuickSwitcherButton").style.display = "block";
        });
        subContainer.appendChild(button);
        container.appendChild(subContainer);
        topMenuContainer.appendChild(container);

        //Fill the first page of users
        changeQuickSwitcherPage(true);

        //Fast-forward the quickswicther until the page contains the lastActiveUserID entry
        goToPageInQuickSwitcherFromUserID(lastActiveUserID);

    }

    //Add 10 users of page pageNum to the quickSwitcher
    function changeQuickSwitcherPage(isNextPage) {
        let usersContainer = document.getElementById("silverScriptsQuickSwitcherUsersDisplay");
        //Reset content
        usersContainer.innerHTML = null;
        //Sort users before displaying them
        let sortedCharacterCookieDataKeys = Object.values(characterCookieData).sort((a, b) => a['characterName'].localeCompare(b['characterName']))
        //Check that there are enough users to display
        if (isNextPage) {
            if (sortedCharacterCookieDataKeys.length < ((lastQuickSwitcherPage + 1) * 10)) {
                console.log("You just attempted to turn page when you don't have enough characters!!");
                return;
            }
        } else {
            if (lastQuickSwitcherPage == 0) {
                console.log("You just attempted to turn to a negative page!!");
                return;
            }
        }
        //Increment/decrement page number
        if (isNextPage) {
            lastQuickSwitcherPage += 1;
        } else {
            lastQuickSwitcherPage -= 1;
        }
        //Get a page of characters
        let prevDisplayedChars = lastQuickSwitcherPage * 10;
        let remainingChars = sortedCharacterCookieDataKeys.length - prevDisplayedChars;
        let usersToDisplay = prevDisplayedChars + Math.min(prevDisplayedChars + 10, remainingChars);
        sortedCharacterCookieDataKeys = sortedCharacterCookieDataKeys.slice(prevDisplayedChars,
            usersToDisplay);

        //Enable/disable buttons if needed
        let leftButton = document.getElementById("silverScriptsQuickSwitcherButtonLeft");
        let rightButton = document.getElementById("silverScriptsQuickSwitcherButtonRight");
        if (lastQuickSwitcherPage > 0) {
            leftButton.disabled = false;
        } else {
            leftButton.disabled = true;
        }
        if (remainingChars > 10) {
            rightButton.disabled = false;
        } else {
            rightButton.disabled = true;
        }

        for (let user in sortedCharacterCookieDataKeys) {
            let rowContainer = document.createElement("div");
            rowContainer.style.display = "grid";
            rowContainer.style.gridTemplateColumns = "auto max-content";
            rowContainer.style.columnGap = "10px";

            let button = document.createElement("button");
            button.dataset.userId = sortedCharacterCookieDataKeys[user]["userID"];
            button.textContent = sortedCharacterCookieDataKeys[user]["characterName"];
            button.style.height = "100%";
            button.style.minWidth = "50px";
            button.style.display = "block";
            button.style.justifySelf = "left";
            button.addEventListener("click", function(e) {
                let userID = e.target.dataset.userId;
                if (e.shiftKey) {
                    changeCharacterCookieDataName(userID);
                    //Reset the menu to refresh the view, reopening the saved users
                    document.getElementById("silverScriptsQuickSwitcherCluster").remove();
                    addQuickSwitcherButton();
                    document.getElementById("silverScriptsQuickSwitcherRowsContainer").style.display = "grid";
                    document.getElementById("silverScriptsQuickSwitcherButton").style.display = "none";
                } else {
                    changeCharacter(characterCookieData[userID]["cookie"]);
                }
            });
            if (sortedCharacterCookieDataKeys[user]["userID"] == lastActiveUserID) {
                button.disabled = true;
            }
            rowContainer.appendChild(button);

            button = document.createElement("button");
            button.dataset.userId = sortedCharacterCookieDataKeys[user]["userID"];
            button.textContent = "X";
            button.style.height = "max-content";
            button.style.display = "block";
            button.style.justifySelf = "right";
            button.addEventListener("click", function(e) {
                //Remove saved character's cookies
                let userID = e.target.dataset.userId;
                removeCharacterFromCharacterCookieData(userID);
                //Reset the menu to refresh the view, reopening the saved users
                document.getElementById("silverScriptsQuickSwitcherCluster").remove();
                addQuickSwitcherButton();
                document.getElementById("silverScriptsQuickSwitcherRowsContainer").style.display = "grid";
                document.getElementById("silverScriptsQuickSwitcherButton").style.display = "none";
            });
            rowContainer.appendChild(button);

            usersContainer.appendChild(rowContainer);
        }
    }

    function goToPageInQuickSwitcherFromUserID(userID) {
        //Sort as usual
        let sortedCharacterCookieDataKeys = Object.values(characterCookieData).sort((a, b) => a['characterName'].localeCompare(b['characterName']));
        //Find the index of the active user
        let userIndex = sortedCharacterCookieDataKeys.findIndex(user => user.userID === userID);
        //Find the page belonging to the specified user. Check if > -1,
        //otherwise it means that the serach failed
        if (userIndex > -1) {
            let pageNumberContainingUser = Math.floor(userIndex / 10);
            //Flip pages forwards or backwards until equal
            while (lastQuickSwitcherPage < pageNumberContainingUser) {
                changeQuickSwitcherPage(true);
            }
            while (lastQuickSwitcherPage > pageNumberContainingUser) {
                changeQuickSwitcherPage(false);
            }
        }
    }

    //Add global IC navigation button
    function addInnerCityButton() {
        //Be sure to not add button if already in IC
        if (isAtLocation("innerCity") || isAtLocation("ICInventory") || !userSettings.innerCityButton) {
            return;
        }

        let topMenuContainer = document.getElementById("silverScriptsTopMenuContainer");
        let container = document.createElement("div");
        container.style.height = "max-content";
        container.style.width = "max-content";
        container.style.minWidth = "41px";
        container.style.justifySelf = "end";
        container.style.padding = "5px";
        container.style.border = "2px solid rgb(100, 0, 0";
        container.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        container.style.backdropFilter = "blur(5px)";
        let button = document.createElement("button");
        button.textContent = "Go to Inner City";
        button.id = "silverScriptsInnerCityButton";
        button.style.height = "max-content";
        button.addEventListener("click", function() {
            unsafeWindow.playSound("outpost");
            setTimeout(function() {
                unsafeWindow.doPageChange(21, 1);
            }, 1000);
        });
        container.appendChild(button);
        topMenuContainer.appendChild(container);
    }

    function fillHoverBox() {
        //Don't do anything if hoverPrices got disabled
        if (!userSettings.hoverPrices) {
            infoBox.style.opacity = 1;
            return;
        }

        var targetInventoryItem = inventoryArray[lastSlotHovered - 1];

        //Don't do anything if slot is empty
        if (targetInventoryItem == null || targetInventoryItem.id == "") {
            return;
        }

        //Don't do anything is item is non-tradeable
        if (targetInventoryItem.notTransferable) {
            infoBox.style.opacity = 1;
            return;
        }

        //Remove previous script info
        var previousInfo = document.getElementsByClassName("silverStats");
        for (var i = previousInfo.length - 1; i >= 0; i--) {
            previousInfo[i].parentNode.removeChild(previousInfo[i]);
        }

        var blank = document.createElement("div");
        blank.className = "itemData silverStats";
        blank.innerHTML = "Silver Stats";
        blank.style.opacity = 0;
        infoBox.appendChild(blank);

        if (targetInventoryItem.bestPricePerUnit != undefined) {
            var bpu = document.createElement("div");
            bpu.className = "itemData silverStats";
            bpu.innerHTML = "Best price per unit: " + targetInventoryItem.bestPricePerUnit.toFixed(2);
            infoBox.appendChild(bpu);

            //Save a text line if item quantity 1
            if (targetInventoryItem.quantity != 1 && targetInventoryItem.type != "Armour") {
                var bps = document.createElement("div");
                bps.className = "itemData silverStats";
                bps.innerHTML = "Best price this stack: " + (targetInventoryItem.bestPricePerUnit * targetInventoryItem.quantity).toFixed(2);
                infoBox.appendChild(bps);
            }
        }

        if (targetInventoryItem.averagePricePerUnit != undefined) {
            var apu = document.createElement("div");
            apu.className = "itemData silverStats";
            apu.innerHTML = "Average price per unit: " + targetInventoryItem.averagePricePerUnit.toFixed(2);
            infoBox.appendChild(apu);

            //Save a text if item quantity 1
            if (targetInventoryItem.quantity != 1 && targetInventoryItem.type != "Armour") {
                var aps = document.createElement("div");
                aps.className = "itemData silverStats";
                aps.innerHTML = "Average price this stack: " + (targetInventoryItem.averagePricePerUnit * targetInventoryItem.quantity).toFixed(2);
                infoBox.appendChild(aps);
            }
        }

        //Check if a service is needed to use the item
        var serv = document.createElement("div");
        serv.className = "itemData silverStats";
        if (targetInventoryItem.type == "Cookable") {
            if (servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel] != undefined) {
                serv.innerHTML = "Price to cook: " + (servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel][0]["price"]);
            } else {
                serv.innerHTML = "No services available at this outpost";
            }
            infoBox.appendChild(serv);
            //If an item is cookable, insert info about its cooked counterpart
            var cookedItemId = targetInventoryItem.id + "_cooked";
            var cookedItem = itemsDataBank[cookedItemId];
            if (cookedItem != null && cookedItem.bestPricePerUnit != null && cookedItem.averagePricePerUnit != null && servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel] != undefined) {
                var cookedBestPrice = document.createElement("div");
                cookedBestPrice.className = "itemData silverStats";
                cookedBestPrice.innerHTML = "Best price cooked: " + cookedItem.bestPricePerUnit.toFixed(2);
                infoBox.appendChild(cookedBestPrice);
                var cookedAveragePrice = document.createElement("div");
                cookedAveragePrice.className = "itemData silverStats";
                cookedAveragePrice.innerHTML = "Average price cooked: " + cookedItem.averagePricePerUnit.toFixed(2);
                infoBox.appendChild(cookedAveragePrice);
                var lowestCookingEarnings = document.createElement("div");
                lowestCookingEarnings.className = "itemData silverStats";
                lowestCookingEarnings.innerHTML = "Lowest earnings after cooking: " + (cookedItem.bestPricePerUnit - targetInventoryItem.bestPricePerUnit - servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel][0]["price"]).toFixed(2);
                infoBox.appendChild(lowestCookingEarnings);
            }
        } else if (targetInventoryItem.type == "Armour") {
            if (servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel] != undefined) {
                serv.innerHTML = "Price to repair: " + (servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel][0]["price"]);
            } else {
                serv.innerHTML = "No services available at this outpost";
            }
            infoBox.appendChild(serv);
        } else if (targetInventoryItem.type == "Medical") {
            if (servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel] != undefined) {
                serv.innerHTML = "Price to administer: " + (servicesDataBank[targetInventoryItem.profession][targetInventoryItem.professionLevel][0]["price"]);
            } else {
                serv.innerHTML = "No services available at this outpost";
            }
            infoBox.appendChild(serv);
        }

        //Show an armor, weapon, or cosmetic scrap value
        if (targetInventoryItem.scrapValue != undefined) {
            var scrapValue = document.createElement("div");
            scrapValue.className = "itemData silverStats";
            scrapValue.innerHTML = "Scrap value: " + targetInventoryItem.scrapValue;
            infoBox.appendChild(scrapValue);
        }

        //Make hoverBox visible when all its content is updated
        setTimeout(function() {
            infoBox.style.opacity = 1;
        }, 10);
    }

    function createAndAppendHelpWindowElement(parentNode, elementData) {
        var elementType = elementData[0];
        var elementText = elementData[1];
        var newElement = document.createElement(elementType);
        newElement.innerHTML = elementText;

        for (var elementAttributeName in elementData[2]) {
            if (elementAttributeName == "style" || elementAttributeName == "dataset") {
                for (var elementListData of elementData[2][elementAttributeName]) {
                    var dataKey = elementListData[0];
                    var dataValue = elementListData[1];
                    newElement[elementAttributeName][dataKey] = dataValue;
                }
            } else {
                newElement[elementAttributeName] = elementData[2][elementAttributeName];
            }
        }

        if (elementType == "button") {
            var buttonFunction = elementData[3];
            var buttonFunctionArgs = elementData[4];
            newElement.addEventListener("click", buttonFunction.bind(null, ...buttonFunctionArgs));
        } else if (elementType == "div") {
            for (var divElement of elementData[3]) {
                createAndAppendHelpWindowElement(newElement, divElement);
            }
        }

        parentNode.appendChild(newElement);
    }

    function openHelpWindowPage(pageName) {

        unsafeWindow.pageLock = true;
        helpWindow.innerHTML = "";

        //Reset helpWindow to default style
        helpWindow.style.position = "absolute";
        helpWindow.style.left = "208px";
        helpWindow.style.top = "195px";
        helpWindow.style.width = "270px";
        helpWindow.style.height = "100px";

        for (var windowStyleData of helpWindowStructure[pageName]["style"]) {
            var styleCategory = windowStyleData[0];
            var styleValue = windowStyleData[1];
            helpWindow.style[styleCategory] = styleValue;
        }

        for (var windowElementData of helpWindowStructure[pageName]["data"]) {
            createAndAppendHelpWindowElement(helpWindow, windowElementData);
            var breakline = document.createElement("br");
            helpWindow.appendChild(breakline);
        }

        helpWindow.parentNode.style.display = "block";
        helpWindow.focus();

    }

    function closeHelpWindowPage() {
        //Reset helpWindow to default style
        helpWindow.style.position = "absolute";
        helpWindow.style.left = "208px";
        helpWindow.style.top = "195px";
        helpWindow.style.width = "270px";
        helpWindow.style.height = "100px";

        helpWindow.parentNode.style.display = "none";
        helpWindow.innerHTML = "";
        helpWindow.style.height = "";
        unsafeWindow.pageLock = false;
    }

    function injectAutoMarketWithdrawButton(marketRow) {
        //We must check if the player doesn't have enough money
        //Remove dollar sign and commas
        var rawPrice = marketRow.getElementsByClassName("salePrice")[0].innerHTML;
        var itemPrice = rawPrice == "Free" ? 0 : parseInt(rawPrice.replace(/\$/g, '').replace(/,/g, ''));
        if (itemPrice <= userVars["DFSTATS_df_cash"]) {
            return;
        }
        //We use the clone node trick to remove the click listeners
        var buyButton = marketRow.getElementsByTagName('button')[0];
        var withdrawButton = buyButton.cloneNode(true);
        marketRow.replaceChild(withdrawButton, buyButton);
        withdrawButton.innerHTML = "withdraw";
        withdrawButton.style.left = "576px";
        //We must check if the player has enough banked money
        if (userVars['DFSTATS_df_bankcash'] > itemPrice) {
            withdrawButton.disabled = false;
        } else {
            withdrawButton.disabled = true;
        }
        withdrawButton.addEventListener("click", withdrawCash.bind(null, itemPrice));
    }

    ////////////////////
    //  Script Start  //
    ///////////////////

    async function startScript() {


        initUserData();
        await loadStoredSettings();
        await loadSavedMarketData();
        await loadStoredCharacterCookieData();
        await loadLastActiveUserID();
        initLoadouts();
        initInventoryArray();
        addAllAmmoToDatabank();
        addLevelAppropriateMedicalToDatabank();
        addLevelAppropriateFoodToDatabank();
        refreshServicesDataBank();
        registerEventListeners();
        registerDOMObservers();
        removeHoverBoxPointerEvents();
        addTopMenuContainer();
        addHelpButton();
        addLoadoutButton();
        addQuickSwitcherButton();
        addInnerCityButton();
        addBoostTimers();
        moveTooltipAndGrabbedItemOnTop();

        addKonami();

        checkForScriptUpdate();

    }

    //Export the scripts presence to the unsafeWindow as soon as possible in order to notify
    //other scripts if necessary
    unsafeWindow.silverScriptsPresence = true;

    //Give enough time to the vanilla js to complete initialisation.
    setTimeout(async function() {
        await startScript();
    }, 500);

})();
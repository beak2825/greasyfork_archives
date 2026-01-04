// ==UserScript==
// @name        ServiceNow Inject Custom Bookmarks into UI
// @namespace   Violentmonkey Scripts
// @match       https://*.service-now.com/now/*
// @match       https://*.service-now.com/navpage.do*
// @grant       none
// @license     MIT
// @version     1.1.04.04.2024
// @author      Erik Anderson
// @description Take your bookmarks wherever you go by dynamically injecting your bookmark configuration list into the UI (Classic or Next Experience).
// @icon        data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/476350/ServiceNow%20Inject%20Custom%20Bookmarks%20into%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/476350/ServiceNow%20Inject%20Custom%20Bookmarks%20into%20UI.meta.js
// ==/UserScript==


(function () {

    var bookmarks = getBookmarks();
    var listenersAdded = false;


    if (location.pathname.startsWith('/now/')) {
        waitToInjectPolarisBookmarks(bookmarks);
    } else if (location.pathname == "/navpage.do") {
        injectClassicBookmarks(bookmarks);
    }

    function waitToInjectPolarisBookmarks(bookmarks, menuOverride) {
        var menuItems;
        if (menuOverride) {
            menuItems = menuOverride;
        } else {
            for (var key in window.top.localStorage) {
                if (key.indexOf('.headerMenuItems.') > -1) {
                    var localStorageMenuItems = window.top.localStorage.getItem(key);
                    if (localStorageMenuItems) {
                        localStorageMenuItems = JSON.parse(localStorageMenuItems);
                        menuItems = localStorageMenuItems.value;
                    }
                    break;
                }
            }
        }


        if (menuItems) {
            injectPolarisBookmarks(menuItems, bookmarks);
        } else {
            setTimeout(function () {
                waitToInjectPolarisBookmarks(bookmarks, menuOverride);
            }, 100)
        }
    }

    function injectClassicBookmarks(bookmarks) {
        if (window?.top?.Magellan?.current) {
            var classicBookMarkArray = createClassicBookmarkArray(bookmarks);
            var favorites = window.top.Magellan.current;
            for (var i = classicBookMarkArray.length - 1; i >= 0; i--) {
                var id = classicBookMarkArray[i].id;
                var bookmarkAlreadyExist = checkForExistingBookmarkId(id, favorites);
                if (!bookmarkAlreadyExist) {
                    console.log('adding new boookmark')
                    favorites.unshift(classicBookMarkArray[i]);
                }
            }
        } else {
            setTimeout(function () {
                injectClassicBookmarks(bookmarks);
            }, 100);
        }

    }

    function injectPolarisBookmarks(menuItemsArray, bookmarks) {
        var polarisFavorites = createPolarisBookmarkArray(bookmarks);
        if (!menuItemsArray) {
            return;
        }
        for (var i = 0; i < menuItemsArray.length; i++) {
            var menuItemCategory = menuItemsArray[i];
            if (menuItemCategory.template == 'favoriteList') {
                var newBookmarksAdded = false;
                console.log(menuItemCategory);
                if (!menuItemCategory.subItems) {
                    menuItemCategory.subItems = [];
                }
                var favoriteSections = menuItemCategory.subItems;
                for (var f = polarisFavorites.length - 1; f >= 0; f--) {
                    var id = polarisFavorites[f].id;
                    var bookmarkAlreadyExist = checkForExistingBookmarkId(id, favoriteSections);
                    if (!bookmarkAlreadyExist) {
                        newBookmarksAdded = true;
                        console.log('Adding high level bookmark and its sub-items: ' + polarisFavorites[f].label);
                        favoriteSections.unshift(polarisFavorites[f]);
                    } else {
                        console.log('Bookmark already included. No need to re-inject.');
                    }
                }

                console.log(menuItemCategory.id);
                waitToPostBookmarks(menuItemCategory, newBookmarksAdded)
            }
        }

    }

    function waitToPostBookmarks(menuItemCategory, newBookmarksAdded) {
        if (document.getElementsByTagName('macroponent-f51912f4c700201072b211d4d8c26010')[0]?.shadowRoot?.querySelector('sn-polaris-layout')) {
            //Dispatch Event now that we have the host
            if (newBookmarksAdded === true) {
                console.log('Dispatching new bookmark list with injected values');
                var favorites = new BroadcastChannel('favoritesSync');
                favorites.postMessage({
                    type: 'POLARIS_FAVORITE_ITEMS_UPDATE',
                    user_sys_id: window.top?.NOW?.user?.userID,
                    favoriteMenu: menuItemCategory
                })
            }else{
              console.log('Not dispatching new boookmarks because no changes to the bookmark list are needed.')
            }


            //Add listeners to detect if SN ever decides to randomly refresh the favoriteMenu and then re-add our stuff.
            if (!listenersAdded) {
                // document.getElementsByTagName('macroponent-f51912f4c700201072b211d4d8c26010')[0]?.shadowRoot?.querySelector('sn-polaris-layout').addEventListener('MENU_MODIFIER#REPLACE_MENU_SUBITEMS', function (event) { console.log(event) });
                document.getElementsByTagName('macroponent-f51912f4c700201072b211d4d8c26010')[0]?.shadowRoot?.querySelector('sn-polaris-layout').addEventListener('MENU_MODIFIER#MENU_REFRESH_REQUEST_SUCCEEDED', function (event) {
                    console.log('MENU_REFRESH_REQUEST_SUCCEEDED: Going to re-inject bookmarks');
                    console.log(event)
                    var menuOverride = event.detail.payload.result;
                    console.log(menuOverride);
                    waitToInjectPolarisBookmarks(bookmarks, menuOverride);
                });
                document.getElementsByTagName('macroponent-f51912f4c700201072b211d4d8c26010')[0]?.shadowRoot?.querySelector('sn-polaris-layout').addEventListener('FAVORITES_BEHAVIOR#SYNC_FAVORITES_COMPLETE', function (event) {
                    console.log('SYNC_FAVORITES_COMPLETE: Going to re-inject bookmarks');
                    console.log(event)
                    var menuOverride = event.detail.payload.result;
                    console.log(menuOverride);
                    waitToInjectPolarisBookmarks(bookmarks, menuOverride);
                });
                listenersAdded = true;
            }
        } else {
            setTimeout(function () {
                waitToPostBookmarks();
            }, 100)
        }
    }

    function waitToDispatchEvent(customEvent, newBookmarksAdded) {
        if (document.getElementsByTagName('macroponent-f51912f4c700201072b211d4d8c26010')[0]?.shadowRoot?.querySelector('sn-polaris-layout')) {
            //Dispatch Event now that we have the host
            console.log('Dispatching new bookmark list with injected values');
            document.getElementsByTagName('macroponent-f51912f4c700201072b211d4d8c26010')[0]?.shadowRoot?.querySelector('sn-polaris-layout').dispatchEvent(customEvent);

            //Add listeners to detect if SN ever decides to randomly refresh the favoriteMenu and then re-add our stuff.
            if (!listenersAdded) {
                document.getElementsByTagName('macroponent-f51912f4c700201072b211d4d8c26010')[0]?.shadowRoot?.querySelector('sn-polaris-layout').addEventListener('MENU_MODIFIER#REPLACE_MENU_SUBITEMS', function (event) { console.log(event) });
                document.getElementsByTagName('macroponent-f51912f4c700201072b211d4d8c26010')[0]?.shadowRoot?.querySelector('sn-polaris-layout').addEventListener('MENU_MODIFIER#MENU_REFRESH_REQUEST_SUCCEEDED', function (event) {
                    console.log('MENU_REFRESH_REQUEST_SUCCEEDED: Going to re-inject bookmarks');
                    console.log(event)
                    var menuOverride = event.detail.payload.result;
                    console.log(menuOverride);
                    waitToInjectPolarisBookmarks(bookmarks, menuOverride);
                });
                document.getElementsByTagName('macroponent-f51912f4c700201072b211d4d8c26010')[0]?.shadowRoot?.querySelector('sn-polaris-layout').addEventListener('FAVORITES_BEHAVIOR#SYNC_FAVORITES_COMPLETE', function (event) {
                    console.log('SYNC_FAVORITES_COMPLETE: Going to re-inject bookmarks');
                    console.log(event)
                    var menuOverride = event.detail.payload.result;
                    console.log(menuOverride);
                    waitToInjectPolarisBookmarks(bookmarks, menuOverride);
                });
                listenersAdded = true;
            }
        } else {
            setTimeout(function () {
                waitToDispatchEvent(customEvent, newBookmarksAdded);
            }, 100)
        }
    }


    function createClassicBookmarkArray(bookmarksArray, currentArray) {
        if (!currentArray) {
            currentArray = [];
        }
        for (var i = 0; i < bookmarksArray.length; i++) {
            var bookmark = bookmarksArray[i];
            if (bookmark.group) {
                var section = createClassicBookmarkSection(bookmark.title, i, bookmark.color);
                createClassicBookmarkArray(bookmark.childItems, section.favorites);
                currentArray.push(section);
            } else {
                var item = createClassicBookmarkItem(bookmark.title, bookmark.url, 100, bookmark.color, bookmark.icon, bookmark.windowName);
                currentArray.push(item);
            }
        }
        return currentArray;
    }

    function createClassicBookmarkItem(title, url, order, color, icon, windowName) {
        var obj = {
            "id": "",
            "order": order,
            "title": title,
            "type": "",
            "targetSysId": "",
            "color": color,
            "group": false,
            "image": "",
            "icon": icon,
            "flyout": "false",
            "url": url,
            "urlRelationships": null,
            "favorites": [],
            "open": false,
            "windowName": windowName || '',
            "separator": false,
            "$$hashKey": ""
        }
        return obj;
    }

    function createClassicBookmarkSection(title, order, color) {
        var obj = {
            "id": order + '',
            "order": order,
            "title": title,
            "color": color,
            "group": true,
            "icon": "article-document",
            "urlRelationships": null,
            "applicationId": "",
            "favorites": [],
            "open": false,
            "$$hashKey": ""
        }
        return obj;
    }

    function checkForExistingBookmarkId(id, favorites) {
        if (Array.isArray(favorites)) {
            for (var i = 0; i < favorites.length; i++) {
                if (favorites[i].id === id) {
                    return true;
                }
            }
        }
        return false;
    }


    function createPolarisBookmarkArray(bookmarksArray, currentArray) {
        if (!currentArray) {
            currentArray = [];
        }
        for (var i = 0; i < bookmarksArray.length; i++) {
            var bookmark = bookmarksArray[i];
            if (bookmark.group) {
                var section = createPolarisBookmarkSection(bookmark.title, i, bookmark.color);
                createPolarisBookmarkArray(bookmark.childItems, section.subItems);
                currentArray.push(section);
            } else {
                var item = createPolarisBookmarkItem(bookmark.title, bookmark.url, bookmark.color, bookmark.icon, bookmark.windowName);
                currentArray.push(item);
            }

        }
        return currentArray;
    }


    function createPolarisBookmarkItem(title, url, color, icon, windowName) {
        var obj = {
            "label": title,
            "color": color,
            "icon": icon,
            "id": "100",
            "open": true,
            "match": null
        }
        if (!windowName) {
            obj.route = {
                "params": {
                    "target": url
                },
                "route": "classic"
            }
        } else {
            obj.route = {
                "external": {
                    "url": url,
                    "target": windowName
                }
            }
            obj.hint = "Test"
        }

        return obj;
    }

    function createPolarisBookmarkSection(title, order, color) {
        var obj = {
            "label": title,
            "color": color,
            "id": '' + order,
            "subItems": [],
            "match": null
        }
        return obj;
    }


    //This is the bookmarks object. You can configure your own bookmarks to inject whatever you need, or you can just keep using the defaults.
    function getBookmarks() {
        var bookmarks = [
            {
                "title": "Dev",
                "color": "blue",
                "icon": "article-document",
                "group": true,
                "childItems": [
                    {
                        "title": "Studio",
                        "url": "/$studio.do",
                        "color": "green",
                        "icon": "view",
                        "group": false,
                        "windowName": "_blank"
                    },
                    {
                        "title": "Flow Designer ➚",
                        "url": "/$flow-designer.do?sysparm_nostack=true",
                        "color": "green",
                        "icon": "view",
                        "group": false,
                        "windowName": "flowdesigner"
                    },
                    {
                        "title": "Background Script",
                        "url": "sys.scripts.do",
                        "color": "pink",
                        "icon": "console",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Logs",
                        "url": "syslog_list.do?sysparm_query=sys_created_onONToday%40javascript:gs.daysAgoStart(0)%40javascript:gs.daysAgoEnd(0)&sysparm_clear_stack=true",
                        "color": "aquamarine",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Retrieved Update Sets",
                        "url": "sys_remote_update_set_list.do?sysparm_fixed_query=sys_class_name=sys_remote_update_set&sysparm_clear_stack=true",
                        "color": "orange",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Local Update Sets",
                        "url": "sys_update_set_list.do?sysparm_userpref_module=50047c06c0a8016c0135a14cebc8191b&sysparm_clear_stack=true",
                        "color": "orange",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Custom Applications",
                        "url": "sys_app_list.do?sysparm_clear_stack=true",
                        "color": "pink",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Integration Hub Action Types",
                        "url": "sys_hub_action_type_definition_list.do?sysparm_clear_stack=true",
                        "color": "red",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Tables",
                        "url": "sys_db_object_list.do?sysparm_clear_stack=true",
                        "color": "yellow",
                        "icon": "database",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Dictionary Entries",
                        "url": "sys_dictionary_list.do?sysparm_clear_stack=true",
                        "color": "yellow",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Active Transactions",
                        "url": "loading_transactions.do",
                        "color": "fuschia",
                        "icon": "view",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "MID Server",
                        "url": "ecc_agent_list.do?sysparm_userpref_module=8d1807e9c611227d01dc4cd973ddf4ca&sysparm_clear_stack=true",
                        "color": "white",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Script Includes",
                        "url": "sys_script_include_list.do?sysparm_clear_stack=true",
                        "color": "blue",
                        "icon": "script",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Fix Scripts",
                        "url": "sys_script_fix_list.do?sysparm_view=&sysparm_first_row=1&sysparm_query=&sysparm_clear_stack=true",
                        "color": "blue",
                        "icon": "script",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "System Properties",
                        "url": "sys_properties_list.do?sysparm_clear_stack=true",
                        "color": "blue",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Business Rules",
                        "url": "sys_script_list.do?sysparm_clear_stack=true",
                        "color": "blue",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Service Portal - Angular Providers",
                        "url": "sp_angular_provider_list.do?sysparm_clear_stack=true",
                        "color": "cyan",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    }
                ]
            },
            {
                "title": "Integrations",
                "color": "normal",
                "icon": "article-document",
                "group": true,
                "childItems": [
                    {
                        "title": "IntegrationHub ETL",
                        "url": "$cmdb_integration_studio.do",
                        "color": "blue",
                        "icon": "view",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "IRE Partial Payloads",
                        "url": "cmdb_ire_partial_payloads_list.do?sysparm_clear_stack=true",
                        "color": "aquamarine",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "IRE Partial Payloads Indexes",
                        "url": "cmdb_ire_partial_payloads_index_list.do?sysparm_clear_stack=true",
                        "color": "cyan",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "IRE Incomplete Payloads",
                        "url": "cmdb_ire_incomplete_payloads_list.do?sysparm_clear_stack=true&=",
                        "color": "aquamarine",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "IRE Stats",
                        "url": "sys_ire_pattern_list.do?sysparm_clear_stack=true",
                        "color": "blue",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Sys Object Sources",
                        "url": "sys_object_source_list.do?sysparm_clear_stack=true",
                        "color": "aquamarine",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "IRE Output Target Items",
                        "url": "cmdb_ire_output_target_item_list.do",
                        "color": "aquamarine",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Data Source Histories",
                        "url": "cmdb_datasource_last_update_list.do",
                        "color": "aquamarine",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "CMDB Related Entries",
                        "url": "cmdb_related_entry_list.do?sysparm_clear_stack=true",
                        "color": "aquamarine",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Transform Histories",
                        "url": "sys_import_set_run_list.do?sysparm_query=sys_created_onONLast%207%20days%40javascript:gs.beginningOfLast7Days()%40javascript:gs.endOfLast7Days()&sysparm_clear_stack=true",
                        "color": "white",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "CMDB Integration Executions",
                        "url": "sn_cmdb_int_util_cmdb_integration_execution_list.do?sysparm_view=&sysparm_first_row=1&sysparm_query=sys_created_onONLast%207%20days%40javascript:gs.beginningOfLast7Days()%40javascript:gs.endOfLast7Days()&sysparm_clear_stack=true",
                        "color": "white",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Guided Setup Contents",
                        "url": "gsw_content_list.do?sysparm_clear_stack=true",
                        "color": "red",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Import Sets - All",
                        "url": "sys_import_set_list.do?sysparm_view=&sysparm_first_row=1&sysparm_query=&sysparm_clear_stack=true",
                        "color": "white",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    }
                ]
            },
            {
                "title": "CMDB",
                "color": "normal",
                "icon": "article-document",
                "group": true,
                "childItems": [
                    {
                        "title": "CI Class Manager",
                        "url": "$ciModel.do",
                        "color": "yellow",
                        "icon": "view",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Configuration Items",
                        "url": "cmdb_ci_list.do?sysparm_clear_stack=true",
                        "color": "yellow",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Hardware",
                        "url": "cmdb_ci_hardware_list.do?sysparm_clear_stack=true",
                        "color": "yellow",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Configuration - Computers",
                        "url": "cmdb_ci_computer_list.do?sysparm_clear_stack=true&sysparm_userpref_module=90ff7af5c0a80164017577f98aac7799",
                        "color": "yellow",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Software Installations",
                        "url": "cmdb_sam_sw_install_list.do?sysparm_clear_stack=true",
                        "color": "yellow",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    }
                ]
            },
            {
                "title": "Incident",
                "color": "pink",
                "icon": "article-document",
                "group": true,
                "childItems": [
                    {
                        "title": "Open",
                        "url": "incident_list.do?active=true&sysparm_query=active%3Dtrue%5EEQ&sysparm_clear_stack=true",
                        "color": "pink",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "Resolved",
                        "url": "incident_list.do?sysparm_query=state%3D6%5EEQ&sysparm_clear_stack=true",
                        "color": "pink",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    },
                    {
                        "title": "All",
                        "url": "incident_list.do?sysparm_clear_stack=true",
                        "color": "pink",
                        "icon": "list",
                        "group": false,
                        "windowName": ""
                    }
                ]
            }
        ]
        return bookmarks;
    }
})();
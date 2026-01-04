// ==UserScript==
// @version       1.2.0.0
// @name          CnCTAToolboxV2
// @namespace     ihatejs
// @description   Creates a "Scan city" button when selecting a city in Command & Conquer: Tiberium Alliances. To be used with the CnCTA Toolbox software. 
// @include       http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @grant         GM_log
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @grant         GM_xmlhttpRequest
// @grant         GM_updatingEnabled
// @grant         unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/36321/CnCTAToolboxV2.user.js
// @updateURL https://update.greasyfork.org/scripts/36321/CnCTAToolboxV2.meta.js
// ==/UserScript==

//2017-12-13: New version started


try {
    unsafeWindow.__cnctatoolbox_version = "1.2.0.0";
    (function () {
        var cnctatoolbox_main = function () {

             function cnctatoolbox_create() {
                console.log("cnctatoolbox v" + window.__cnctatoolbox_version + " loaded");
                var cnctatoolbox = {
                    selected_base: null,

                    make_sharelink: function () {
                        try {
                            var selected_base = cnctatoolbox.selected_base;
                            var city_id = selected_base.get_Id();
                            var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);

                            var selectedCityName = city.get_Name();

                            window.alert(selectedCityName);


                            //////// END OF LINK STRING \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                            ////////////////////////////////////////////////////////////////////////////////////////

                            // Copies a string to the clipboard. Must be called from within an 
                            // event handler such as click. May return false if it failed, but
                            // this is not always possible. Browser support for Chrome 43+, 
                            // Firefox 42+, Safari 10+, Edge and IE 10+.
                            // IE: The clipboard feature may be disabled by an administrator. By
                            // default a prompt is shown the first time the clipboard is 
                            // used (per session).
                            function copyToClipboard(text) {
                                if (window.clipboardData && window.clipboardData.setData) {
                                    // IE specific code path to prevent textarea being shown while dialog is visible.
                                    return clipboardData.setData("Text", text);

                                } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
                                    var textarea = document.createElement("textarea");
                                    textarea.textContent = text;
                                    textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
                                    document.body.appendChild(textarea);
                                    textarea.select();
                                    try {
                                        return document.execCommand("copy");  // Security exception may be thrown by some browsers.
                                    } catch (ex) {
                                        //window.alert("Copy to clipboard failed.");

                                        console.warn("Copy to clipboard failed.", ex);
                                        return false;
                                    } finally {
                                        document.body.removeChild(textarea);
                                    }
                                }
                            }

                            copyToClipboard(link);  // Need to call this function prior to the "main" function, or else
                            // we must click the button twice

                            document.body.addEventListener('mousedown', function () {
                                copyToClipboard(link);
                            }, false);

                            link = "";
                            ////////////////////////////////////////////////////////////////////////////////////

                        } catch (e) {
                            console.log("cnctatoolbox [1]: ", e);
                        }
                    }
                };
                if (!webfrontend.gui.region.RegionCityMenu.prototype.__cnctatoolbox_real_showMenu) {
                    webfrontend.gui.region.RegionCityMenu.prototype.__cnctatoolbox_real_showMenu = webfrontend.gui.region.RegionCityMenu.prototype.showMenu;
                }

                var check_ct = 0;
                var check_timer = null;
                var button_enabled = 123456;
                /* Wrap showMenu so we can inject our Sharelink at the end of menus and
                 * sync Base object to our cnctatoolbox.selected_base variable  */
                webfrontend.gui.region.RegionCityMenu.prototype.showMenu = function (selected_base) {
                    try {
                        var self = this;
                        //console.log(selected_base);
                        cnctatoolbox.selected_base = selected_base;
                        if (this.__cnctatoolbox_initialized != 1) {
                            this.__cnctatoolbox_initialized = 1;
                            this.__cnctatoolbox_links = [];
                            for (var i in this) {
                                try {
                                    if (this[i] && this[i].basename == "Composite") {
                                        var link = new qx.ui.form.Button("Scan city V2");
                                        link.addListener("execute", function () {
                                            var bt = qx.core.Init.getApplication();
                                            bt.getBackgroundArea().closeCityInfo();
                                            cnctatoolbox.make_sharelink();


                                        });
                                        this[i].add(link);
                                        this.__cnctatoolbox_links.push(link);
                                    }
                                } catch (e) {
                                    console.log("cnctatoolbox [2]: ", e);
                                }
                            }
                        }
                        var tf = false;

                        //window.alert(selected_base.get_VisObjectType().getName);

                        switch (selected_base.get_VisObjectType()) {
                            case ClientLib.Vis.VisObject.EObjectType.RegionCityType:
                                switch (selected_base.get_Type()) {
                                    case ClientLib.Vis.Region.RegionCity.ERegionCityType.Own:
                                        tf = true;
                                        break;
                                    case ClientLib.Vis.Region.RegionCity.ERegionCityType.Alliance:
                                    case ClientLib.Vis.Region.RegionCity.ERegionCityType.Enemy:
                                        tf = true;
                                        break;
                                }
                                break;
                            case ClientLib.Vis.VisObject.EObjectType.RegionGhostCity:
                                tf = false;
                                console.log("cnctatoolbox: Ghost City selected.. ignoring because we don't know what to do here");
                                break;
                            case ClientLib.Vis.VisObject.EObjectType.RegionNPCBase:
                                tf = true;
                                break;
                            case ClientLib.Vis.VisObject.EObjectType.RegionNPCCamp:
                                tf = true;
                                break;
                            case ClientLib.Vis.VisObject.EObjectType.RegionNPCFF:
                                tf = true;
                                break;
                        }

                        tf = true;

                        var orig_tf = tf;

                        function check_if_button_should_be_enabled() {
                            try {
                                tf = orig_tf;
                                var selected_base = cnctatoolbox.selected_base;
                                var still_loading = false;
                                if (check_timer !== null) {
                                    clearTimeout(check_timer);
                                }

                                /* When a city is selected, the data for the city is loaded in the background.. once the 
                                 * data arrives, this method is called again with these fields set, but until it does
                                 * we can't actually generate the link.. so this section of the code grays out the button
                                 * until the data is ready, then it'll light up. */
                                if (selected_base && selected_base.get_Id) {
                                    var city_id = selected_base.get_Id();
                                    var city = ClientLib.Data.MainData.GetInstance().get_Cities().GetCity(city_id);
                                    //if (!city || !city.m_CityUnits || !city.m_CityUnits.m_DefenseUnits) {
                                    //console.log("City", city);
                                    //console.log("get_OwnerId", city.get_OwnerId());
                                    if (!city || city.get_OwnerId() === 0) {
                                        still_loading = true;
                                        tf = false;
                                    }
                                } else {
                                    tf = false;
                                }
                                if (tf != button_enabled) {
                                    button_enabled = tf;
                                    for (var i = 0; i < self.__cnctatoolbox_links.length; ++i) {
                                        self.__cnctatoolbox_links[i].setEnabled(tf);

                                    }
                                }
                                if (!still_loading) {
                                    check_ct = 0;
                                } else {
                                    if (check_ct > 0) {
                                        check_ct--;
                                        check_timer = setTimeout(check_if_button_should_be_enabled, 100);
                                    } else {
                                        check_timer = null;
                                    }
                                }

                            } catch (e) {
                                console.log("cnctatoolbox [3]: ", e);
                                tf = false;
                            }
                        }

                        check_ct = 50;
                        check_if_button_should_be_enabled();
                    } catch (e) {
                        console.log("cnctatoolbox [3]: ", e);
                    }

                    this.__cnctatoolbox_real_showMenu(selected_base);
                }
            }

            /* Nice load check (ripped from AmpliDude's LoU Tweak script) */
            function cnc_check_if_loaded() {
                try {
                    if (typeof qx != 'undefined') {
                        a = qx.core.Init.getApplication(); // application
                        if (a) {
                            cnctatoolbox_create();
                        } else {
                            window.setTimeout(cnc_check_if_loaded, 1000);
                        }
                    } else {
                        window.setTimeout(cnc_check_if_loaded, 1000);
                    }
                } catch (e) {
                    if (typeof console != 'undefined') console.log(e);
                    else if (window.opera) opera.postError(e);
                    else GM_log(e);
                }
            }
            if (/commandandconquer\.com/i.test(document.domain)) window.setTimeout(cnc_check_if_loaded, 1000);
        };

        // injecting because we can't seem to hook into the game interface via unsafeWindow 
        //   (Ripped from AmpliDude's LoU Tweak script)
        var script_block = document.createElement("script");
        txt = cnctatoolbox_main.toString();
        script_block.innerHTML = "(" + txt + ")();";
        script_block.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) document.getElementsByTagName("head")[0].appendChild(script_block);
    })();
} catch (e) {
    GM_log(e);
    window.alert(e.message);

}
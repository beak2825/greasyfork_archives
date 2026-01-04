// ==UserScript==
// @name         Empornium Deluxe Mode
// @namespace    http://tampermonkey.net/
// @version      1.18
// @description  Enhances the empornium.me porn torrent website
// @author       codingjoe
// @match        https://*.empornium.me/*
// @match        https://*.empornium.sx/*
// @match        https://*.empornium.is/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/39900/Empornium%20Deluxe%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/39900/Empornium%20Deluxe%20Mode.meta.js
// ==/UserScript==

let layout = {
    "General": {
        "AlwaysHeader": {
            type: "checkbox",
            text: "Always keep header in view",
            defaultValue: false
        },
        "AutoDismiss": {
            type: "checkbox",
            text: "Auto-dismiss login timeout notification",
            defaultValue: false
        },
        "JumpToTop": {
            type: "checkbox",
            text: "Insert 'Jump to Top' link onto bottom-right corner of all pages",
            defaultValue: false
        },
        "PreventNewWindow": {
            type: "checkbox",
            text: "Prevent single-click links from opening a new window",
            defaultValue: false
        },
        "StripAnonym": {
            type: "checkbox",
            text: "Strip url anonymizers from links",
            defaultValue: false
        },
    },
    "Notifications": {
        "CopyClearBottomNotifs": {
            type: "checkbox",
            text: 'Move "clear" and "clear selected" links onto bottom of matched groups',
            defaultValue: false
        },
        "HideClearAll": {
            type: "checkbox",
            text: 'Hide "Clear" and "clear all" links to prevent accidental clearing',
            defaultValue: false
        },
        "AutoCheckNotif": {
            type: "checkbox",
            text: "When the link is clicked, check the torrent's checkbox for manual clearing",
            defaultValue: false
        },
    },
    "Torrent Page": {
        "AutoOpenFileList": {
            type: "checkbox",
            text: 'Auto-open filelist',
            defaultValue: false
        },
        "AutoOpenSpoilers": {
            type: "checkbox",
            text: 'Auto-open hidden text / spoilers',
            defaultValue: false
        },
        "AutoThankUploader": {
            type: "checkbox",
            text: 'Auto-thank the uploader upon clicking download / freeleech / doubleseed',
            defaultValue: false
        },
        "AutoLoadScaledImages": {
            type: "checkbox",
            text: 'Automatically load the full res of scaled-down images when possible',
            defaultValue: false
        }
    },
    "Torrent Listings": {
        "ShowImages": {
            type: "checkbox",
            text: 'Display hover images inline',
            defaultValue: false
        },
        "ShowHoverTip": {
            type: "checkbox",
            text: '&nbsp;&nbsp;&nbsp;&nbsp;Display full hover tip inline',
            defaultValue: false,
            enabler: "ShowImages"
        },
        "HideSeeded": {
            type: "checkbox",
            text: 'Hide currently seeding torrents',
            defaultValue: false
        },
        "HideLeeching": {
            type: "checkbox",
            text: 'Hide currently leeching torrents',
            defaultValue: false
        },
        "HideGrabbed": {
            type: "checkbox",
            text: 'Hide previously grabbed torrents [incomplete download]',
            defaultValue: false
        },
        "HideSnatched": {
            type: "checkbox",
            text: 'Hide previously snatched torrents [finished]',
            defaultValue: false
        },
    },
    "Filters": {
        "FilterFilesize": {
            type: "checkbox",
            text: 'Only display torrents in the filesize range:',
            defaultValue: false
        },
        "FilesizeFilterRange": {
            type: "range",
            defaultValue: { lowerNumber: 0, lowerUnits: "KiB", higherNumber: 999, higherUnits: "TiB" },
            enabler: "FilterFilesize", // enabler indicates which checkbox must be checked to enable the field
            units: ["KiB", "MiB", "GiB", "TiB"]
        },
        "FilterTags": {
            type: "checkbox",
            text: 'Torrents displayed to me must <u>not</u> have any of the following tags (black list):',
            defaultValue: false
        },
        "TagListing": {
            type: "textarea",
            text: '(comma-separated list)',
            defaultValue: "bbc, big.black.cock, bbw, fat, obese, hairy, gay, trans, tranny, transsexual, scat, feces, poop, puke, vomit, censored",
            title: "black list",
            enabler: "FilterTags" // enabler indicates which checkbox must be checked to enable the field
        },
        "OnlyShowTheseTags": {
            type: "checkbox",
            text: 'Torrents displayed to me <b>must have</b> at least one of the following tags:',
            defaultValue: false
        },
        "OnlyShowTagListing": {
            type: "textarea",
            text: '(comma-separated list)',
            defaultValue: "swallowed.com, evilangel.com, amourangels.com, met-art.com, legalporno.com, mplstudios.com, femjoy.com, sexart.com, ftvgirls.com, teenpornstorage.com, domai.com, analteenangels.com, showybeauty.com, justteensite.com, facefucking.com, teenfidelity.com, chaturbate.com, myfreecams.com, twistys.com, atkgalleria.com, iameighteen.com",
            title: "must-have list",
            enabler: "OnlyShowTheseTags" // enabler indicates which checkbox must be checked to enable the field
        },
    },
    "Bonus": {
        "ShowRatioGoals": {
            type: "checkbox",
            text: 'Display ratio goals table on the Bonus Shop page (experimental)',
            defaultValue: false
        },
    }
};

let customContentStyle = `
    .emp_modal_content {
        display: inline !important;
        width: 900px !important;
        height: auto !important;
        background-color: #000525 !important;
        margin-top: 0% !important;
        margin-left: -450px !important;
        position: absolute !important;
        top: 0% !important;
        left: 50% !important;
        text-align: center !important;
        overflow-y: auto !important;
        color: #2C8466 !important;
    }
`;

let accordionStyle = {
    backgroundColor: "#0E2D4A",
    color: "white",
    cursor: "pointer",
    padding: "18px",
    width: "100%",
    border: "none",
    textAlign: "center",
    outline: "none",
    fontSize: "15px",
    transition: "0.4s",
    borderRadius: "5px"
};

let panelStyle = {
    padding: "0 18px",
    display: "none",
    overflow: "hidden",
    textAlign: "left",
    backgroundColor: "#000015",
    fontSize: "10pt"
};

let textareaStyle = {
    width: "870px",
    height: "65px",
    backgroundColor: "#0E2D4A",
    color: "silver",
    marginTop: "10px"
};

Element.prototype.props = function(json) {
    return Object.assign(this, json);
};

HTMLDocument.prototype.new = function(tagName) {
    return document.createElement(tagName);
};

Element.prototype.appendTo = function(element) {
    element.appendChild(this);
    return this;
};

Element.prototype.setStyle = function(styler) {
    Object.assign(this.style, styler);
    return this;
}

let GM_config = {};

class ConfigDialog {
    constructor(configId, headerText) {
        this.configId = configId;
        this.headerText = headerText;

        // create modal dialog background
        this.modal = document.body.appendChild(document.createElement("div")).setStyle({
            display: "none",
            position: "fixed",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            overflow: "auto",
            backgroundColor: "rgba(0,0,0,0.7)",
            zIndex: 9999
        });

        // create a space for content inside the modal
        this.content = this.modal.appendChild(Object.assign(document.createElement("div"), { className: "emp_modal_content" }));
        GM_addStyle(`
            .emp_modal_content {
                display: inline;
                width: 250;
                height: 250;
                background-color: white;
                margin-top: -125px;
                margin-left: -125px;
                position: absolute;
                top: 50%;
                left: 50%;
                text-align: center;
            }
        `);


        let self = this;
        // handle modal close on click
        window.addEventListener("click", function(e) {
            if (e.target === self.modal) {
                self.Close();
            }
        });

        // retrieve settings
        this.savedValues = GM_getValue("EmporniumEnhancementsConfig")? JSON.parse(GM_getValue("EmporniumEnhancementsConfig")): null;

        if (!this.savedValues) {
            // load default settings
            this.savedValues = this.GatherDefaultValues();
        }

        Object.keys(layout).forEach(header => {
            Object.keys(layout[header]).forEach(id => {
                if (id === "FilesizeFilterRange") {
                    if (!this.savedValues[id]) {
                        if (GM_getValue("fileSizeRange")) {
                            this.savedValues[id] = JSON.parse(GM_getValue("fileSizeRange"));
                        } else {
                            this.savedValues[id] = layout.Filters[id].defaultValue;
                        }
                    }
                } else {
                    // auto-detect new settings
                    if (!Object.keys(this.savedValues).includes(id)) {
                        let defaultValue = null;
                        Object.keys(layout).forEach(header => {
                            if (Object.keys(layout[header]).includes(id)) {
                                defaultValue = layout[header][id].defaultValue;
                            }
                        });

                        this.savedValues[id] = defaultValue;
                    }
                }
            });
        });
        GM_setValue("EmporniumEnhancementsConfig", JSON.stringify(this.savedValues));
        GM_config = this.savedValues;

        this.Customize_UI(self);
    }

    Open() {
        this.modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }

    Close() {
        this.modal.style.display = "none";
        document.body.style.overflow = "";
        this.ResetUI();
    }

    ResetUI() {
        // collapse all accordion headers
        document.querySelectorAll(".configHeader").forEach(r => {
            if (r.classList.contains("active_header")) {
                r.classList.remove("active_header");
                r.style.backgroundColor = "#0E2D4A";
            }
        });

        // hide all panels with a list of settings
        document.querySelectorAll(".configPanel").forEach(r => {
            r.style.display = "none";
        });

        // reset fields to the stored values
        document.querySelectorAll(`[id^='${this.configId}_var_']`).forEach(r => {
            switch (r.type || r.getAttribute("type")) {
                case "checkbox":
                    r.checked = this.savedValues[r.id.replace(`${this.configId}_var_`,"")];

                    // determine disabled state of fields the checkbox governs
                    document.querySelectorAll(`[data-enabler='${r.id.replace(`${this.configId}_var_`, "")}']`).forEach(d => {
                        //d.disabled = !this.checked;
                        if (this.checked) {
                            d.disabled = true;
                        } else {
                            if (d.hasAttribute("disabled")) {
                                d.removeAttribute("disabled");
                            }
                        }
                    });
                    break;
                case "textarea":
                case "text":
                case "number":
                case "date":
                case "select":
                    r.value = this.savedValues[r.id.replace(`${this.configId}_var_`,"")];
                    break;
                case "range":
                    r.querySelectorAll("input,select").forEach(element => element.value = this.savedValues[r.id.replace(`${this.configId}_var_`,"")][element.id]);
                    break;
                default:
                    console.log(`ResetUI implement '${r.type || r.getAttribute("type")}'`);
            }
        });
    }

    GatherFieldValues() {
        let self = this;
        this.savedValues = {};

        // gather setting values from input fields
        document.querySelectorAll(`[id^='${this.configId}_var_']`).forEach(r => {
            switch (r.type || r.getAttribute("type")) {
                case "checkbox":
                    this.savedValues[r.id.replace(`${this.configId}_var_`,"")] = r.checked;
                    break;
                case "textarea":
                case "text":
                case "number":
                case "date":
                case "select":
                    this.savedValues[r.id.replace(`${this.configId}_var_`,"")] = r.value;
                    break;
                case "range":
                    let rangeId = r.id.replace(`${this.configId}_var_`,"");
                    this.savedValues[rangeId] = {};
                    r.querySelectorAll("input,select").forEach(element => this.savedValues[rangeId][element.id] = element.value);
                    break;
                default:
                    console.log(`GatherFieldValues implement '${r.type || r.getAttribute("type")}'`);
            }
        });
    }

    GatherDefaultValues() {
        let defaultValues = {};

        // gather a list of defaults from the layout
        Object.keys(layout).forEach(header => {
            Object.keys(layout[header]).forEach(id => {
                let setting = layout[header][id];
                defaultValues[id] = setting.defaultValue;
            });
        });

        return defaultValues;
    }

    ResetFieldsToDefaults() {
        let defaultValues = this.GatherDefaultValues();

        // reset fields to their default values
        document.querySelectorAll(`[id^='${this.configId}_var_']`).forEach(r => {
            switch (r.type || r.getAttribute("type")) {
                case "checkbox":
                    r.checked = defaultValues[r.id.replace(`${this.configId}_var_`,"")];
                    break;
                case "textarea":
                case "text":
                case "number":
                case "date":
                case "select":
                    r.value = defaultValues[r.id.replace(`${this.configId}_var_`,"")];
                    break;
                case "range":
                    let rangeId = r.id.replace(`${this.configId}_var_`,"");
                    let rangeValues = {};
                    Object.keys(layout).forEach(k => {
                        if (Object.keys(layout[k]).includes(rangeId)) {
                            rangeValues = layout[k][rangeId].defaultValue;
                        }
                    });

                    r.querySelectorAll("input,select").forEach(element => element.value = rangeValues[element.id]);
                    break;
                default:
                    console.log(`ResetFieldsToDefaults implement '${r.type || r.getAttribute("type")}'`);
            }
        });

        document.querySelectorAll("[data-enabler]").forEach(r => r.disabled = true);
    }

    Save() {
        this.GatherFieldValues();
        // store to userscript
        GM_setValue("EmporniumEnhancementsConfig", JSON.stringify(this.savedValues));
        GM_config = this.savedValues;
        this.Close();
        location.reload();
    }

    RenderFields(self, header) {
        // generate settings panel
        let panel = this.content.appendChild(document.createElement("div"));
        panel.classList.add("configPanel");
        panel.setStyle(panelStyle);

        Object.keys(layout[header]).forEach(id => {
            let setting = layout[header][id];
            let fieldContainer = document.createElement("div");
            let label = null;
            let hr = null;
            let enabler = null;

            if (setting.type !== "range") {
                label = fieldContainer.appendChild(Object.assign(document.createElement("label"), { innerHTML: setting.text }));
                label.setAttribute("for", `${this.configId}_var_${id}`);
                label.style.marginRight = "5px";
            }

            switch (setting.type) {
                case "checkbox":
                    let chk = fieldContainer.appendChild(Object.assign(document.createElement("input"), { id: `${this.configId}_var_${id}`, type: setting.type }));
                    chk.checked = this.savedValues[id];

                    if (setting.enabler !== undefined) {
                        chk.setAttribute("data-enabler", setting.enabler);
                        enabler = panel.querySelector(`#${this.configId}_var_${setting.enabler}`);
                        chk.disabled = !enabler.checked;
                    }

                    break;

                case "text":
                    let textbox = fieldContainer.appendChild(Object.assign(document.createElement("input"), { id: `${this.configId}_var_${id}`, type: setting.type, value: this.savedValues[id] }));
                    break;

                case "textarea":
                    let textarea = fieldContainer.appendChild(Object.assign(document.createElement("textarea"), { id: `${this.configId}_var_${id}`, value: this.savedValues[id] })).setStyle(textareaStyle);

                    hr = fieldContainer.appendChild(document.createElement("hr"));
                    hr.style = "margin-top: 5px; margin-bottom: 10px";

                    if (setting.enabler !== undefined) {
                        textarea.setAttribute("data-enabler", setting.enabler);
                        enabler = panel.querySelector(`#${this.configId}_var_${setting.enabler}`);
                        textarea.disabled = !enabler.checked;
                    }
                    break;

                case "range":
                    let rangeFields = [];
                    let lowerUnits = null;
                    let higherUnits = null;

                    let lowerNumber = fieldContainer.appendChild(document.createElement("input")).setStyle({ width: "50px" });
                    Object.assign(lowerNumber, {
                        id: "lowerNumber",
                        type: "number",
                        min: 0,
                        max: 999,
                        value: this.savedValues[id].lowerNumber
                    });
                    rangeFields.push(lowerNumber);

                    if (setting.units) {
                        lowerUnits = fieldContainer.appendChild(Object.assign(document.createElement("select"), { id: "lowerUnits" }));
                        rangeFields.push(lowerUnits);
                    }

                    fieldContainer.appendChild(Object.assign(document.createElement("label"), { innerText: " to " }));

                    let higherNumber = fieldContainer.appendChild(document.createElement("input")).setStyle({ width: "50px" });
                    Object.assign(higherNumber, {
                        id: "higherNumber",
                        type: "number",
                        min: 0,
                        max: 999,
                        value: this.savedValues[id].higherNumber
                    });
                    rangeFields.push(higherNumber);

                    if (setting.units) {
                        higherUnits = fieldContainer.appendChild(Object.assign(document.createElement("select"), { id: "higherUnits" }));
                        rangeFields.push(higherUnits);

                        setting.units.forEach(u => {
                            lowerUnits.appendChild(Object.assign(document.createElement("option"), { text: u, value: u }));
                            higherUnits.appendChild(Object.assign(document.createElement("option"), { text: u, value: u }));
                        });

                        lowerUnits.value = this.savedValues[id].lowerUnits;
                        higherUnits.value = this.savedValues[id].higherUnits;
                    }

                    rangeFields.forEach(r => r.setStyle({ backgroundColor: "#0E2D4A", color: "silver" }));

                    if (setting.enabler !== undefined) {
                        enabler = panel.querySelector(`#${this.configId}_var_${setting.enabler}`);

                        rangeFields.forEach(r => {
                            r.setAttribute("data-enabler", setting.enabler);
                            r.disabled = !enabler.checked;
                        });
                    }

                    hr = fieldContainer.appendChild(document.createElement("hr"));
                    hr.style = "margin-top: 5px; margin-bottom: 10px";

                    fieldContainer.id = `${this.configId}_var_${id}`;
                    fieldContainer.setAttribute("type", setting.type);
                    break;

                default:
                    fieldContainer = Object.assign(document.createElement("div"), { innerText: setting.text });
                    break;
            }

            // tie checkox to trigger the disabled state of the form elements it governs
            if (enabler) {
                enabler.addEventListener("change", function(e) {
                    document.querySelectorAll(`[data-enabler='${this.id.replace(self.configId + "_var_", "")}']`).forEach(r => r.disabled = !this.checked);
                });
            }

            panel.appendChild(fieldContainer);
        });
    }

    RenderAccordion(self) {
        Object.keys(layout).forEach(header => {
            // generate accordion
            let category = this.content.appendChild(Object.assign(document.createElement("button"), { innerText: header }));
            category.classList.add("configHeader");
            category.setStyle(accordionStyle);
            // activate accordion header on mouse enter
            category.addEventListener("mouseenter", function(e) {
                this.style.backgroundColor = "#133C5F";
            });
            category.addEventListener("mouseleave", function(e) {
                // deactivate accordion header on mouse leave
                if (!this.classList.contains("active_header")) {
                    this.style.backgroundColor = "#0E2D4A";
                }
            });
            category.addEventListener("click", function(e) {
                // toggle accordion active state
                if (this.classList.contains("active_header")) {
                    this.classList.remove("active_header");
                } else {
                    this.classList.add("active_header");
                }

                let settingsPanel = this.nextElementSibling;
                if (settingsPanel.style.display === "block") {
                    settingsPanel.style.display = "none";
                } else {
                    settingsPanel.style.display = "block";
                }
            });

            // render fields
            this.RenderFields(self, header);
        });
    }

    Customize_UI(self) {
        // customize content box
        GM_addStyle(customContentStyle)

        // create UI elements

        // header text
        let headerDiv = this.content.appendChild(document.createElement("div")).setStyle({ fontSize: "20pt" });
        let lblTitle = headerDiv.appendChild(Object.assign(document.createElement("label"), { innerHTML: this.headerText }));

        this.RenderAccordion(self);

        // footer to contain buttons on the right
        let footerDiv = this.content.appendChild(document.createElement("div")).setStyle({ width: "100%", textAlign: "right", marginTop: "10px" });

        // create save button
        let btnSave = footerDiv.appendChild(Object.assign(document.createElement("input"), { type: "button", value: "Save" })).setStyle({ width: "50px" });
        btnSave.addEventListener("click", function(e) {
            self.Save();
        });

        // create reset to defaults button
        let btnReset = footerDiv.appendChild(Object.assign(document.createElement("input"), { type: "button", value: "Reset to defaults" })).setStyle({ width: "115px" });
        btnReset.addEventListener("click", function(e) {
            self.ResetFieldsToDefaults();
        });
    }
}


function myRound(x, places) {
    let trunc = Math.pow(10, places);
	return Math.round(x * trunc) / trunc;
}

function Insert_JumpToTop() {
    if (GM_config.JumpToTop) {
        // create a div fixed in the bottom-right corner
        let jumpDiv = document.createElement("div");
        jumpDiv.setStyle({
            position: "fixed",
            bottom: "5px",
            right: "5px",
            textAlign: "right"
        });

        // create the 'Jump to Top' link
        let anchor = document.createElement("a");
        anchor.innerText = "Jump to Top";
        anchor.href = "javascript:window.scrollTo(0, 0)";

        // append the link to the corner div
        jumpDiv.appendChild(anchor);

        // append the entire element to the body of the page
        document.body.appendChild(jumpDiv);
    }
}

function Affix_Header() {
    if (GM_config.AlwaysHeader) {
        if (document.querySelectorAll("#header").length > 0) {
            // affix the header into position
            document.querySelector("#header").style.cssText = "position: fixed !important; top: 0px; left: 0px;";
            // shift the contents down to account for missing space
            document.querySelector("#content").style.cssText = "margin-top:120px;";
        }
    }
}

function Strip_Anon(links) {
    if (GM_config.StripAnonym) {
        // list of url anonymizers to remove
        let anonymizers = [ "http://anonym.to/?", "http://anon.now.im/?", "https://anonym.es/?", "http://anonym.es/?" ];

        // loop over each link
        links.forEach(link => {
            // loop thru the list of anonymizers
            anonymizers.forEach(anonymizer => {
                // if link contains current anonymizer
                if (link.href.indexOf(anonymizer) >= 0) {
                    console.log(`Removing url anonymizer '${anonymizer}' from link '${link.href}'`);
                    // replace it with empty string
                    link.href = link.href.replace(anonymizer, "");
                }
            });
        });
    }
}

function Prevent_NewWindow(links) {
    if (GM_config.PreventNewWindow) {
        // loop over each link
        links.forEach(link => {
            // if a new window target has been set for current link
            if (link.target.length > 0) {
                // remove its target
                link.target = '';
            }
        });
    }
}

function AutoOpen_Spoilers(links) {
    if (GM_config.AutoOpenSpoilers) {
        console.log("AutoOpenSpoilers");
        // find all spoiler links
        links.filter(r => r.innerHTML === "Show").forEach(link => {
            // click to unhide
            link.click();
        });
    }
}

function AutoDismiss_LoginTimeout() {
    if (GM_config.AutoDismiss) {
        if (document.querySelectorAll("#flashClose").length > 0) {
            document.querySelector("#flashClose").click()
        }
    }
}

function RedirectTo_LoginScreen(links) {
    if (links.filter(r => r.innerHTML === "Login").length > 0) {
        window.location.href += "login";
    }
}

function SetFocus_LoginForm() {
    document.querySelector("input[name=username]").focus();
}

function Show_RatioGoals() {
    if (GM_config.ShowRatioGoals) {
        var stats = document.querySelectorAll(".stat");
        var units = [ "KiB", "MiB", "GiB", "TiB" ];

        var ratio = parseFloat(stats[5].innerText);
        var down = stats[3].innerText;
        var up = stats[1].innerText;

        var upUnitsIdx = units.indexOf(up.substring(1 + up.indexOf(" ")));
        var downUnitsIdx = units.indexOf(down.substring(1 + down.indexOf(" ")));

        var unitsDiff = parseInt(Math.round(upUnitsIdx - downUnitsIdx));
        var displayUnits = units[downUnitsIdx];

        up = up.replace(/,/g, "");
        up = parseFloat(up.substring(0, up.indexOf(" ")));
        down = down.replace(/,/g, "");
        down = parseFloat(down.substring(0, down.indexOf(" ")));

        // convert totals to same units
        if (unitsDiff < 0) {
            down *= Math.pow(1024, -unitsDiff);
            displayUnits = units[upUnitsIdx];
        } else if (unitsDiff > 0) {
            up *= Math.pow(1024, unitsDiff);
        }

        var diff = down / 100.0;
        var currAmount = Math.abs((ratio + 0.01) * down - up);

        let strHtml = "<table style=\"text-align:center !important;margin: 0px auto; width:50%;\">\
                           <tbody>\
                               <tr>\
                                   <td style=\"width:90px;text-align:center;\">U/L differential</td>\
                                   <td style=\"width:90px;text-align:center;\"> for ratio </td>\
                                   <td style=\"width:90px;text-align:center;\"> Amount to U/L </td>\
                               </tr>";

        for (let i = 1; i <= 10; i++) {
            var currRatio = i/100.0 + ratio;

            // alternate background color
            var style = "";
            if (i % 2 != 0) {
                style = " style=\"background-color:#222222 !important;\"";
            }

            strHtml += "<tr" + style + "><td style=\"text-align:center;\"> +" + (i == 1 ? myRound(currAmount, 3) : myRound(diff, 3)) + " " + displayUnits + " </td><td style=\"text-align:center;\"> " + myRound(currRatio, 3) + " </td><td style=\"text-align:center;\"> " + myRound(currAmount, 3) + " " + displayUnits + " </td></tr>";

            currAmount += diff;
        }

        strHtml += "</tbody></table>";

        var content = document.querySelector("#content");
        content.innerHTML = strHtml + content.innerHTML;
    }
}

function Hide_Seeded(torrents) {
    if (GM_config.HideSeeded) {
        torrents.filter(r => r.querySelectorAll(".icon_disk_seed").length > 0).forEach(itemRow => { itemRow.style = "display:none"; });
    }
}

function Hide_Grabbed(torrents) {
    if (GM_config.HideGrabbed) {
        torrents.filter(r => r.querySelectorAll(".icon_disk_grabbed").length > 0).forEach(itemRow => { itemRow.style = "display:none"; });
    }
}

function Hide_Snatched(torrents) {
    if (GM_config.HideSnatched) {
        torrents.filter(r => r.querySelectorAll(".icon_disk_snatched").length > 0).forEach(itemRow => { itemRow.style = "display:none"; });
    }
}

function Hide_Leeching(torrents) {
    if (GM_config.HideLeeching) {
        torrents.filter(r => r.querySelectorAll(".icon_disk_leech").length > 0).forEach(itemRow => { itemRow.style = "display:none"; });
    }
}

function BlackList_TheseTags(torrents) {
    if (GM_config.FilterTags) {
        // grab the filters from the settings
        let filters = GM_config.TagListing.replace(/[\n\r\s]/g, "").split(',');
        let intersect = function(A,B) { return A.filter(r => B.indexOf(r) >= 0) }
        let intersects = function(A,B) { return intersect(A,B).length > 0 }

        // loop over each torrent
        torrents.filter(r => r.style.display !== "none").forEach(itemRow => {
            // grab the current torrent's list of tags
            let tags = itemRow.querySelector(".tags").innerText.split(" ");

            // if the filter keywords and tags have items in common
            if (intersects(filters,tags)) {
                // hide this torrent row
                itemRow.style.display = "none";
                let torrentInfo = Array.from(itemRow.querySelectorAll("a")).filter(r => /\/torrents\.php\?id\=\d+$/.test(r.href))[0]
                console.log(`Blacklisted found: "${intersect(filters,tags).join(",")}", therefore the torrent "${torrentInfo.href} - ${torrentInfo.innerText}" was hidden`);
            }
        });
    }
}

function Display_ImagesInline(torrents) {
    if (GM_config.ShowImages) {
        // loop over each torrent
        torrents.forEach(itemRow => {
            // if current torrent row contains a hover script and a cats_col class of element exists within it
            if (itemRow.querySelectorAll("script").length > 0 && itemRow.querySelectorAll("[class*=cats_col]").length > 0) {
                // extract the image-generating html from the hover script
                let strHtml = itemRow.querySelector("script").innerHTML.replace(/[\[\]\{\}\(\)\\\|]/g, "");
                let start = strHtml.indexOf("\"")+1;
                let end = strHtml.lastIndexOf("\"");
                strHtml = strHtml.substring(start, end);

                // create a div within which to place the image
                let div = document.createElement("div");

                // hide the cats_col's child elements which contain a definite title to make room for the image
                Array.from(itemRow.querySelector("[class*=cats_col]").childNodes).filter(r => r.title !== undefined).forEach(cat => { cat.style.display = "none"; });

                // add the html to generate the image to the div
                div.innerHTML = strHtml;

                // display the image in the torrent row
                if (GM_config.ShowHoverTip) {
                    itemRow.querySelector("[class*=cats_col]").appendChild(div);
                } else {
                    itemRow.querySelector("[class*=cats_col]").appendChild(div.querySelector("img"));
                }
            }
        });
    }
}

function Hide_ClearAll(links) {
    if (GM_config.HideClearAll) {
        // hide "clear all" and "Clear"
        links.filter(r => r.innerHTML === "(clear all)" || r.innerHTML === "Clear").forEach(link => { link.style.display = "none"; });
    }
}

function AutoCheck_ClickedTorrent(torrents) {
    if (GM_config.AutoCheckNotif) {
        // loop over entire torrent list
        torrents.forEach(itemRow => {
            // filter-out links on current torrent that do not contain "/torrents.php?id"
            Array.from(itemRow.querySelectorAll("a")).filter(r => r.href.indexOf("/torrents.php?id") > -1).forEach(link => {
                link.addEventListener("mousedown", function (e) {
                    // activate checkbox of current torrent if notification link was clicked
                    itemRow.querySelector("input[type=checkbox]").checked = true;
                });
            });
        });
    }
}

function Move_ClearToGroupBottom() {
    if (GM_config.CopyClearBottomNotifs) {
        // look for the torrent_table class of elements
        document.querySelectorAll(".torrent_table").forEach(t => {
            // find the current table's previous sibling's previous sibling
            let ps = t.previousSibling.previousSibling;
            // clone the element
            let c = ps.cloneNode(true);
            // insert at the bottom
            t.parentNode.insertBefore(c, t.nextSibling);
            ps.innerHTML = ps.innerHTML.toString().match(/(\w+\s){4}/gm);
        });
    }
}

function Filter_Filesizes(torrents) {
    if (GM_config.FilterFilesize) {
        let units = [ "KiB", "MiB", "GiB", "TiB" ];
        let filesizeRange = GM_config.FilesizeFilterRange;
        let torrentInfo = null;
        let colhead = document.querySelector(".colhead");
        let torrentHeader = null;
        if (colhead) {
            torrentHeader = Array.from(colhead.querySelectorAll("td")).map(r => r.innerHTML.startsWith("<img")? r.innerHTML.match(/title\=\"([^\"]+)\"/)[1]: r.innerText);

            // loop over each torrent
            torrents.filter(r => r.style.display !== "none").forEach(itemRow => {
                let sizeCell = itemRow.querySelectorAll("td")[torrentHeader.indexOf("Size")];

                // retrieve filesize of current torrent
                let currSize = sizeCell.innerText.split(" ");
                currSize[0] = currSize[0].replace(",","");

                // hide row if units of current row are less than units of min range
                if (units.indexOf(currSize[1]) < units.indexOf(filesizeRange.lowerUnits)) {
                    itemRow.style.display = "none";
                    torrentInfo = Array.from(itemRow.querySelectorAll("a")).filter(r => /\/torrents\.php\?id\=\d+$/.test(r.href))[0]
                    console.log(`${currSize.join("")} < ${filesizeRange.lowerNumber}${filesizeRange.lowerUnits}; hide the torrent '${torrentInfo.href} - ${torrentInfo.innerText}'`);
                } else if (currSize[1] === filesizeRange.lowerUnits) {
                    // hide row if units match and filesize is less than min range
                    if (parseFloat(currSize[0]) < parseInt(filesizeRange.lowerNumber)) {
                        itemRow.style.display = "none";
                        torrentInfo = Array.from(itemRow.querySelectorAll("a")).filter(r => /\/torrents\.php\?id\=\d+$/.test(r.href))[0]
                        console.log(`${currSize.join("")} < ${filesizeRange.lowerNumber}${filesizeRange.lowerUnits}; hide the torrent '${torrentInfo.href} - ${torrentInfo.innerText}'`);
                    }
                }

                // hide row if units of current row are greater than units of max range
                if (units.indexOf(currSize[1]) > units.indexOf(filesizeRange.higherUnits)) {
                    itemRow.style.display = "none";
                    torrentInfo = Array.from(itemRow.querySelectorAll("a")).filter(r => /\/torrents\.php\?id\=\d+$/.test(r.href))[0]
                    console.log(`${currSize.join("")} > ${filesizeRange.higherNumber}${filesizeRange.higherUnits}; hide the torrent '${torrentInfo.href} - ${torrentInfo.innerText}'`);
                } else if (currSize[1] === filesizeRange.higherUnits) {
                    // hide row if units match and filesize is greater than max range
                    if (parseFloat(currSize[0]) > parseInt(filesizeRange.higherNumber)) {
                        itemRow.style.display = "none";
                        torrentInfo = Array.from(itemRow.querySelectorAll("a")).filter(r => /\/torrents\.php\?id\=\d+$/.test(r.href))[0]
                        console.log(`${currSize.join("")} > ${filesizeRange.higherNumber}${filesizeRange.higherUnits}; hide the torrent '${torrentInfo.href} - ${torrentInfo.innerText}'`);
                    }
                }
            });
        } else {
            console.log("Unable to filter filesizes; could not find torrent listing column header.");
        }
    }
}

function Draw_MenuItem(callback) {
    if (document.querySelector(".username") != null) {
        // config icon - wrench & screwdriver depicted
        let icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA\
                    u0lEQVQ4jZ2SMQ4CMQwERyiICqEr+EGgRBelpkvLI3kDD+IBdDQUFKbJIcdyTqezlGazu7\
                    ZXBlM55+1ajFLyYS2mQanv4hFDCNP/rKNUoid+NAZql5MxFODriMtkEGPcNV2BsxIL8O6J\
                    vfVE7fd/w7C/LhFjOosxTEvETTnTjK7YO4hKDM40o+bZEO0qnwrZbNKSHF4OZoNtK6V4VC\
                    QtnkoAUYZuZwE2vRHVdbqXeO90ttgTuEEnRA+cw36EkV9UhABsAgAAAABJRU5ErkJggg==";
        // find the user nav element
        let navbar = document.querySelector(".username").parentNode.querySelector("ul");
        // clone a list item layout
        let configNode = navbar.querySelector("li").cloneNode(true);

        // wire-up the config element
        configNode.id = "deluxe_config";
        configNode.innerHTML = "";
        let anchor = document.new("a").appendTo(configNode);
        anchor.title = "Empornium Deluxe Mode Configuration";
        anchor.innerHTML = '<img src="' + icon + '" style="filter:invert(100%);"/> Deluxe Mode Config';
        anchor.href = "javascript:void(0)";
        anchor.addEventListener("click", function (e) {
            callback();
        });

        // display config link as first item in the user nav
        navbar.insertBefore(configNode, navbar.firstChild);
    }
}

function AutoThank_Uploader() {
    if (GM_config.AutoThankUploader) {
        // .blueButton => Download
        // .greenButton => Freeleech
        // .orangeButton => Doubleseed
        // look for the download / freeleech / doubleseed buttons
        Array.from(document.querySelectorAll(".blueButton,.greenButton,.orangeButton")).forEach(btn => {
            // wire-up event to auto-click thanks upon downloading
            btn.addEventListener("click", function (e) {
                window.setTimeout(function () {
                    // if thanks button not disabled
                    if (!document.querySelector("#thanksbutton").disabled) {
                        // invoke it
                        document.querySelector("#thanksbutton").click();
                    }
                    // wait 500ms so as not to interrupt download request
                }, 500);
            });
        });
    }
}

function AutoOpen_FileList(links) {
    if (GM_config.AutoOpenFileList) {
        links.filter(r => r.innerHTML === "(View Filelist)")[0].click();
    }
}

function MustHave_TheseTags(torrents) {
    if (GM_config.OnlyShowTheseTags) {
        // grab the filters from the settings
        let filters = GM_config.OnlyShowTagListing.replace(/[\n\r\s]/g, "").split(',');
        let intersect = function(A,B) { return A.filter(r => B.indexOf(r) >= 0) }
        let intersects = function(A,B) { return intersect(A,B).length > 0 }

        // loop over each torrent
        torrents.filter(r => r.style.display !== "none").forEach(itemRow => {
            // grab the current torrent's list of tags
            let tags = itemRow.querySelector(".tags").innerText.split(" ");

            // if the filter keywords and tags do not have items in common
            if (!intersects(filters,tags)) {
                // hide this torrent row
                itemRow.style = "display:none";
                let torrentInfo = Array.from(itemRow.querySelectorAll("a")).filter(r => /\/torrents\.php\?id\=\d+$/.test(r.href))[0]
                console.log(`Not found on must-have list: "${tags.filter(r => r !== "").join(",")}", therefore the torrent "${torrentInfo.href} - ${torrentInfo.innerText}" was hidden`);
            }
        });
    }
}

function AutoLoad_ScaledImages() {
    if (GM_config.AutoLoadScaledImages) {
        Array.from(document.querySelectorAll(".scale_image")).forEach((r, idx) => {
            setTimeout(function() {
                // detect thumbnails and medium scaled images
                let newsrc = r.src.replace(".th","").replace(".md","");
                r.src = newsrc;
                r.parentNode.href = newsrc;
            }, idx * 3000); // put a delay of 3sec between each full-res image request
        });
    }
}



// main
(function() {
    'use strict';

    let headerText = "Empornium Deluxe Mode Config";

    let config = new ConfigDialog("EmporniumConfig", headerText);

    GM_registerMenuCommand(headerText, function() {
        config.Open();
    });

    AutoDismiss_LoginTimeout();
    Draw_MenuItem(function() {
        config.Open();
    });

    let links = Array.from(document.querySelectorAll("a"));
    let torrents = Array.from(document.querySelectorAll(".torrent"));

    // page match rules
    if (/empornium\.(me|is|sx)\/?$/.test(window.location.href)) {
        RedirectTo_LoginScreen(links);
    } else if (/empornium\.(me|is|sx)\/login$/.test(window.location.href)) {
        SetFocus_LoginForm();
    } else {
        // occurs on all authenticated pages
        Affix_Header();
        Strip_Anon(links);
        Prevent_NewWindow(links);
        Insert_JumpToTop();


        if (/torrents\.php.+action=notify/.test(window.location.href)) {
            // notifications page
            Hide_ClearAll(links);
            Move_ClearToGroupBottom();
            AutoCheck_ClickedTorrent(torrents);
        }

        if (/(top10|user)\.php/.test(window.location.href) || (/torrents\.php/.test(window.location.href) && !/(\?|&)id=/.test(window.location.href))) {
            // torrents / top10 / user - lists of torrents
            BlackList_TheseTags(torrents);
            Filter_Filesizes(torrents);
            MustHave_TheseTags(torrents);

            Hide_Seeded(torrents);
            Hide_Grabbed(torrents);
            Hide_Snatched(torrents);
            Hide_Leeching(torrents);

            Display_ImagesInline(torrents);
        } else if (/torrents\.php\?id=\d+/.test(window.location.href)) {
            console.log("single torrent page");
            // single torrent landing page
            AutoOpen_Spoilers(links);
            AutoOpen_FileList(links);
            AutoThank_Uploader();
            AutoLoad_ScaledImages();
        } else if (/bonus\.php/.test(window.location.href)) {
            // bonus page
            Show_RatioGoals();
        }
    }
})();
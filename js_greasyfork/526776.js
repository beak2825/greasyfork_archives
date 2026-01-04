// ==UserScript==
// @name         jerkmate_cheats
// @namespace    aura
// @version      1
// @description  AUTO FAP, AUTO UPGRADE (ALL UPGRADES), SPECIAL NI99A MODE (INFINITE MONEY, INFINITE FAP PER MINUTE, INFINITE RANK / STAMINA)
// @author       dementia enjoyer (& ai for the ui)
// @match        https://jerkmate.com/jerkmate-ranked
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526776/jerkmate_cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/526776/jerkmate_cheats.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const flags = {};

    const ui_container = document.createElement("div");
    const header = document.createElement("div");
    const style_sheet = document.createElement("style");
    const tab_container = document.createElement("div");
    const content_container = document.createElement("div");

    const create_toggle = (toggle_data) => {
        const toggle_button = document.createElement("button");
        toggle_button.innerText = `${toggle_data.name}`;
        toggle_button.style.margin = "5px";
        toggle_button.style.padding = "5px 5px";
        toggle_button.style.borderRadius = "3px";
        toggle_button.style.border = "none";
        toggle_button.style.cursor = "pointer";
        toggle_button.style.backgroundColor = flags[toggle_data.flag] ? "green" : "red";
        toggle_button.style.color = "white";
        toggle_button.style.transition = "background-color 0.3s ease";

        toggle_button.addEventListener("click", () => {
            flags[toggle_data.flag] = !flags[toggle_data.flag];
            toggle_button.style.backgroundColor = flags[toggle_data.flag] ? "green" : "red";
        });

        content_container.appendChild(toggle_button);
        return toggle_button;
    };

    const create_tab = (title) => {
        const tab_button = document.createElement("button");
        tab_button.innerText = title;
        tab_button.style.padding = "5px 10px";
        tab_button.style.marginTop = "10px";
        tab_button.style.borderRadius = "5px";
        tab_button.style.border = "none";
        tab_button.style.cursor = "pointer";
        tab_button.style.backgroundColor = "rgb(39, 39, 39)";
        tab_button.style.color = "white";
        tab_button.style.transition = "background-color 0.3s ease";

        const tab = {
            toggles: [],
            textboxes: [],
            buttons: [],
            add_toggle: (toggle_config) => {
                const toggle_data = {
                    name: toggle_config.name,
                    flag: toggle_config.flag,
                };
                const toggle_button = create_toggle(toggle_data);
                tab.toggles.push(toggle_button);
            },
            add_textbox: (textbox_config) => {
                const textbox = document.createElement("input");
                textbox.placeholder = textbox_config.placeholder;
                textbox.style.margin = "5px";
                textbox.style.padding = "5px";
                textbox.style.borderRadius = "3px";
                textbox.style.border = "none";
                textbox.style.width = "100%";
                content_container.appendChild(textbox);
                tab.textboxes.push(textbox);
            },
            add_btn: (btn_config) => {
                const button = document.createElement("button");
                button.innerText = btn_config.name;
                button.style.margin = "5px";
                button.style.padding = "5px 5px";
                button.style.borderRadius = "3px";
                button.style.border = "none";
                button.style.cursor = "pointer";
                button.style.backgroundColor = "rgb(39, 39, 39)";
                button.style.color = "white";
                button.style.transition = "background-color 0.3s ease";

                button.addEventListener("click", btn_config.Callback);

                content_container.appendChild(button);
                tab.buttons.push(button);
            }
        };

        tab_button.addEventListener("click", () => {
            tab_container.querySelectorAll("button").forEach(btn => {
                btn.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
            });

            tab_button.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
            content_container.innerHTML = "";
            tab.toggles.forEach(toggle_button => content_container.appendChild(toggle_button));
            tab.textboxes.forEach(textbox => content_container.appendChild(textbox));
            tab.buttons.forEach(button => content_container.appendChild(button));
        });

        tab_container.appendChild(tab_button);
        return tab;
    };

    // UI Properties
    {
        ui_container.style.position = "fixed";
        ui_container.style.top = "10px";
        ui_container.style.right = "10px";
        ui_container.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        ui_container.style.color = "white";
        ui_container.style.padding = "10px";
        ui_container.style.borderRadius = "10px";
        ui_container.style.zIndex = "10000";
        ui_container.style.fontFamily = "Arial, sans-serif";
        ui_container.style.fontSize = "14px";
        ui_container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
        ui_container.style.overflow = "hidden";
        ui_container.style.width = "250px";
        document.body.appendChild(ui_container);

        header.innerHTML = "skeet.cc | made by dementia enjoyer";
        header.style.textAlign = "center";
        header.style.fontSize = "18px";
        header.style.fontWeight = "bold";
        header.style.background = "linear-gradient(90deg,rgb(95, 218, 255),rgb(123, 254, 145))";
        header.style.webkitBackgroundClip = "text";
        header.style.webkitTextFillColor = "transparent";
        header.style.animation = "gradientText 3s ease infinite";
        ui_container.appendChild(header);

        style_sheet.innerHTML = `
            @keyframes gradientText {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style_sheet);

        tab_container.style.display = "flex";
        tab_container.style.justifyContent = "space-around";
        tab_container.style.marginBottom = "20px";
        ui_container.appendChild(tab_container);

        content_container.style.minHeight = "100px";
        ui_container.appendChild(content_container);
    }

    // Elements
    {
        const farm_tab = create_tab("Farm"); {
            farm_tab.add_toggle({
                name: "Auto Fap",
                flag: "auto_fap",
            });
        };
    
        const upgrades_tab = create_tab("Upgrades"); {
            upgrades_tab.add_toggle({
                name: "Auto Lube",
                flag: "auto_lube",
            });
        
            upgrades_tab.add_toggle({
                name: "Auto Poster",
                flag: "auto_poster",
            });
        
            upgrades_tab.add_toggle({
                name: "Auto Magazine",
                flag: "auto_magazine",
            });
        
            upgrades_tab.add_toggle({
                name: "Auto Private Show",
                flag: "auto_private_show",
            });
        
            upgrades_tab.add_toggle({
                name: "Auto CAM2CAM",
                flag: "auto_cam_to_cam",
            });
        };
    
        const misc = create_tab("Misc"); {
            misc.add_btn({
                name: "Nigga Mode",
                Callback: () => {
                    const data = {"upgrades":[{"id":1,"name":"Nigga Lube","description":"Oil a nigga dick up","iconPath":"https://imgs.search.brave.com/MiO7q4pAHutAP55XgKymG8js7U2NhWrW-rHP22PHZ6A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdHls/ZXMucmVkZGl0bWVk/aWEuY29tL3Q1X2M4/cWFoaS9zdHlsZXMv/Y29tbXVuaXR5SWNv/bl8waXh5bWw4Z2ti/dGQxLnBuZw","level":99999999999999999999999999999999999999999999999,"baseFPC":1,"fapPerClick":0,"baseFPS":0,"fapPerSecond":0,"baseCost":6,"price":-999999999},{"id":2,"name":"Picture of a nigga","description":"Enjoy the nigga","iconPath":"https://imgs.search.brave.com/MiO7q4pAHutAP55XgKymG8js7U2NhWrW-rHP22PHZ6A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdHls/ZXMucmVkZGl0bWVk/aWEuY29tL3Q1X2M4/cWFoaS9zdHlsZXMv/Y29tbXVuaXR5SWNv/bl8waXh5bWw4Z2ti/dGQxLnBuZw","level":99999999999999999999999999999999999999999999999,"baseFPC":0,"fapPerClick":99999999999999999999999999999999999999999999999,"baseFPS":6,"fapPerSecond":99999999999999999999999999999999999999999999999,"baseCost":51,"price":-99999999999999999999999999999999999999999999999},{"id":3,"name":"Look at a nigga abs","description":"Look at these hot niggas!","iconPath":"https://imgs.search.brave.com/MiO7q4pAHutAP55XgKymG8js7U2NhWrW-rHP22PHZ6A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdHls/ZXMucmVkZGl0bWVk/aWEuY29tL3Q1X2M4/cWFoaS9zdHlsZXMv/Y29tbXVuaXR5SWNv/bl8waXh5bWw4Z2ti/dGQxLnBuZw","level":99999999999999999999999999999999999999999999999,"baseFPC":0,"fapPerClick":0,"baseFPS":21,"fapPerSecond":999999999999999,"baseCost":1,"price":-999999999},{"id":4,"name":"Nigga Show","description":"Go private on Jerkmate and flex yo penis length to a nigga","iconPath":"https://imgs.search.brave.com/MiO7q4pAHutAP55XgKymG8js7U2NhWrW-rHP22PHZ6A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdHls/ZXMucmVkZGl0bWVk/aWEuY29tL3Q1X2M4/cWFoaS9zdHlsZXMv/Y29tbXVuaXR5SWNv/bl8waXh5bWw4Z2ti/dGQxLnBuZw","level":99999999999999999999999999999999999999999999999,"baseFPC":0,"fapPerClick":0,"baseFPS":75,"fapPerSecond":1,"baseCost":1,"price":-999999999},{"id":5,"name":"Nigga-to-Nigga","description":"Make a Nigga watch!","iconPath":"https://imgs.search.brave.com/MiO7q4pAHutAP55XgKymG8js7U2NhWrW-rHP22PHZ6A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdHls/ZXMucmVkZGl0bWVk/aWEuY29tL3Q1X2M4/cWFoaS9zdHlsZXMv/Y29tbXVuaXR5SWNv/bl8waXh5bWw4Z2ti/dGQxLnBuZw","level":99999999999999999999999999999999999999999999999,"baseFPC":0,"fapPerClick":99999999999999999999999999999999999999999999999,"baseFPS":250,"fapPerSecond":99999999999999999999999999999999999999999999999,"baseCost":1,"price":-99999999999999999999999999999999999999999999999}],"level":99999999999999999999999999999999999999999999999,"levelProgress":99999999999999999999999999999999999999999999999,"stamina":99999999999999999999999999999999999999999999999,"fapPerClick":99999999999999999999999999999999999999999999999,"fapPerSecond":99999999999999999999999999999999999999999999999,"orgasmPoints":99999999999999999999999999999999999999999999999,"rank":{"name":"Grandnigga Baiter","levelThreshold":99999999,"iconPath":"https://imgs.search.brave.com/MiO7q4pAHutAP55XgKymG8js7U2NhWrW-rHP22PHZ6A/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdHls/ZXMucmVkZGl0bWVk/aWEuY29tL3Q1X2M4/cWFoaS9zdHlsZXMv/Y29tbXVuaXR5SWNv/bl8waXh5bWw4Z2ti/dGQxLnBuZw"}};

                    document.cookie = 'user-language=en; path=/;';
                    document.cookie = 'SN_visitor_id=nigga; path=/;';
                    document.cookie = 'session-params=' + encodeURIComponent('{"aff_id":"nigga","transaction_id":"nigga","outlinks_set_id":"1","transactionComeFromURL":false}') + '; path=/;';
                    document.cookie = 'ilc-history-navigation=' + encodeURIComponent('[{"path":"/","data":{"smid":"nigga","pname":"aariss"}},{"path":"/jerkmate-ranked"}]') + '; path=/;';
                    document.cookie = 'nigga; path=/;';
                    document.cookie = 'gameData=' + encodeURIComponent(JSON.stringify(data)) + '; path=/;';
                    
                    location.reload();
                }
            });

            misc.add_btn({
                name: "Clear Save",
                Callback: () => {
                    const cookies = document.cookie.split(";");
            
                    for (let index = 0; index < cookies.length; index++) {
                        const c = cookies[index];
                        const i = c.indexOf("=");
            
                        document.cookie = (i > -1 ? c.substring(0, i) : c) + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                    }
            
                    location.reload();
                }
            });
        };
    }

    setInterval(() => {
        const buy_buttons = document.querySelectorAll(".buttonBuy");

        // Farm
        {
            if (flags.auto_fap) {
                document.querySelector("video").click();
            };
        }

        // Upgrades
        {
            if (flags.auto_lube) {
                buy_buttons[0].click();
            };
    
            if (flags.auto_poster) {
                buy_buttons[1].click();
            };

            if (flags.auto_magazine) {
                buy_buttons[2].click();
            };
    
            if (flags.auto_private_show) {
                buy_buttons[3].click();
            };

            if (flags.auto_cam_to_cam) {
                buy_buttons[4].click();
            };
        }
    }, 1);

    tab_container.querySelector("button").click();
})();

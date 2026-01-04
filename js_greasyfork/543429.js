// ==UserScript==
// @name        Internet Roadtrip Cruise Control
// @namespace   spideramn.github.io
// @match       https://neal.fun/internet-roadtrip/*
// @version     0.0.5
// @author      Spideramn
// @description Internet Roadtrip Cruise Control.
// @license     MIT
// @grant       GM.setValues
// @grant       GM.getValues
// @run-at      document-start
// @icon        https://neal.fun/favicons/internet-roadtrip.png
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/543429/Internet%20Roadtrip%20Cruise%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/543429/Internet%20Roadtrip%20Cruise%20Control.meta.js
// ==/UserScript==

// This works together with irf.d.ts to give us type hints
/* globals IRF */
/**
  * Internet Roadtrip Framework
  * @typedef {typeof import('internet-roadtrip-framework')} IRF
  */

(async function() {
    'use strict';
    
    if (!IRF?.isInternetRoadtrip) {
        return;
    }

    // Get map methods and various objects
    const container = await IRF.vdom.container;

    class CruiseControl
    {
        async setup()
        {
            container.state.changeStop = new Proxy(container.methods.changeStop, {
                apply: async (target, thisArg, args) => {
                    const returnValue = Reflect.apply(target, thisArg, args);
                    this._changeStop(args[5]);
                    return returnValue;
                }
            });
        };

        _changeStop(stops)
        {
            if(settings.cruise_control_enabled)
            {
                // only 1 option to choose from?
                if(stops.length == 1)
                {
                    setTimeout(async () => this._vote(), 1000);
                }
                else
                {
                    console.log('Not voting, there are ' + stops.length + ' options.');
                }
            }
        }

        async _vote()
        {
            // already voted?
            if(!container.data.voted)
            {
                await container.methods.vote(0); // vote
            }
        }
    };

    //
    // Settings
    const settings = {
        "cruise_control_enabled": false,
    };
    const storedSettings = await GM.getValues(Object.keys(settings))
    Object.assign(settings, storedSettings);
    await GM.setValues(settings);

    // settings panel
    let gm_info = GM.info
    gm_info.script.name = "Cruise Control"
    const irf_settings = IRF.ui.panel.createTabFor(gm_info, { tabName: "Cruise Control" });
    const info_el = document.createElement("p");
    info_el.innerText = "When Cruise Control is enabled you will automatically vote if there is only 1 option available.";
    irf_settings.container.appendChild(info_el);
    add_checkbox('Cruise control enabled', 'cruise_control_enabled');

    // speedometer moved
    irf_settings.container.appendChild(document.createElement('hr'));
    const header = document.createElement('h3');
    header.innerText = 'Speedometer';
    irf_settings.container.appendChild(header);
    const speedometer_el = document.createElement("p");
    speedometer_el.innerHTML = "The Speedometer now has it's own mod: <a href='https://greasyfork.org/en/scripts/543429-internet-roadtrip-cruise-control' target='_blank'>Internet Roadtrip Speedometer</a>";
    irf_settings.container.appendChild(speedometer_el);
    

    function add_checkbox(name, identifier, callback=undefined, settings_container=irf_settings.container) {
        let label = document.createElement("label");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = settings[identifier];
        checkbox.className = IRF.ui.panel.styles.toggle;
        label.appendChild(checkbox);

        let text = document.createElement("span");
        text.innerText = " " + name;
        label.appendChild(text);

        checkbox.addEventListener("change", () => {
            settings[identifier] = checkbox.checked;
            GM.setValues(settings);
            if (callback) callback(checkbox.checked);
        });

        settings_container.appendChild(label);
        settings_container.appendChild(document.createElement("br"));
        settings_container.appendChild(document.createElement("br"));

        return checkbox
    };

    const cruiseControlInstance = new CruiseControl();
    await cruiseControlInstance.setup();
})();
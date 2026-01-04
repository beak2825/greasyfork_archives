// ==UserScript==
// @name        Internet Roadtrip Turn Alert
// @namespace   jdranczewski.github.io
// @match       https://neal.fun/internet-roadtrip/*
// @version     0.2.3
// @author      jdranczewski
// @description Play sound when turn options appear after a long stretch of straight road.
// @license     MIT
// @icon         https://jdranczewski.dev/irt/images/turn_alert.png
// @grant        GM.setValues
// @grant        GM.getValues
// @grant        GM.addStyle
// @grant        GM.notification
// @grant        unsafeWindow
// @run-at      document-end
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/537357/Internet%20Roadtrip%20Turn%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/537357/Internet%20Roadtrip%20Turn%20Alert.meta.js
// ==/UserScript==

// This works together with irf.d.ts to give us type hints
/**
 * Internet Roadtrip Framework
 * @typedef {typeof import('internet-roadtrip-framework')} IRF
 */

(async function() {
    // Styles
    GM.addStyle(`
    #ta-alert-box {
        position: fixed;
        pointer-events: none;
        width: 100%;
        height: 100%;
        background-color: #00000036;
        z-index: 1000000;
        transition: opacity 3s;
        opacity: 0;
        background-image: url("https://jdranczewski.dev/irt/images/warning.png");
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    #ta-alert-box span {
        color: white;
        font-weight: bold;
        text-shadow: 1px 1px 2px #000000;
        font-size: 23px;
        transform: translate(0px, 50px);
    }

    #ta-alert-box.ta-alert-show {
        opacity: 1 !important;
        transition: opacity .5s;
    }
    `)
    // References
    const v_container = await IRF.vdom.container;
    const v_map = await IRF.vdom.map;
    
    // Settings
    const settings = {
        "turn_alert_sound": true,
        "turn_alert_visual": true,
        "turn_alert_notif": false,
        "minutes": 5,
        "sound": 'https://jdranczewski.dev/irt/sounds/imposter.mp3',
        "volume": 0.3,

        "marker_alert_sound": true,
        "marker_alert_visual": true,
        "marker_alert_notif": false,
        "distance": 250,
        "marker_sound": 'https://jdranczewski.dev/irt/sounds/body.mp3',
        "marker_volume": 0.3,
    }
    const storedSettings = await GM.getValues(Object.keys(settings))
    Object.assign(
        settings,
        storedSettings
    );
    // Replace catbox-hosted sounds with my server
    if (
        settings.sound == 'https://files.catbox.moe/6beir6.mp3'
        || settings.sound == 'https://files.catbox.moe/04idsc.mp3'
    ) {
        // Replace the default sound with a better version
        settings.sound = 'https://jdranczewski.dev/irt/sounds/imposter.mp3';
    }
    if (settings.marker_sound == 'https://files.catbox.moe/83p4v5.mp3') {
        settings.marker_sound = 'https://jdranczewski.dev/irt/sounds/body.mp3';
    }
    await GM.setValues(settings);

    // Visual alert setup
    const alert_box = document.createElement("div");
    alert_box.id = "ta-alert-box";
    document.body.appendChild(alert_box);
    function warn_visual(text="") {
        alert_text.innerText = text;
        alert_box.classList.toggle("ta-alert-show", true);
        setTimeout(() => {
            alert_box.classList.toggle("ta-alert-show", false);
        }, 2500);
    }
    const alert_text = document.createElement("span");
    alert_box.appendChild(alert_text)

    // Settings panel GUI
    let gm_info = GM.info
    gm_info.script.name = "Turn alert"
    const irf_settings = IRF.ui.panel.createTabFor(
        gm_info, {
            tabName: "Turn alert",
            style: `
            .ta-straight-n {font-weigth: bold}
            .ta-bad {color: #ff3434}
            .ta-good {color: #0f0 !important}
            `
        }
    );

    // Set up and status
    let straight_streak = 0;
    const status = {};
    {
        const status_el = document.createElement("div");
        status_el.innerText = "Status:"
        const status_ul = document.createElement("ul");
        status_el.appendChild(status_ul)
        // Stop numbers
        let li = document.createElement("li");
        li.innerText = "A 'turn' is defined as more than one direction being available for voting.";
        status_ul.appendChild(li);
        li = document.createElement("li");
        status.straight_n = document.createElement("span");
        status.straight_n.style.fontWeight = "bold";
        li.appendChild(status.straight_n);
        li.append("/");
        status.straight_lim = document.createElement("span");
        status.straight_lim.style.color = "#aaa";
        li.appendChild(status.straight_lim);
        li.append(" stops without a turn.")
        status_ul.appendChild(li);
        // Next stop status
        li = document.createElement("li");
        status.alert_next = document.createElement("span");
        status.alert_next.classList.add("ta-bad");
        li.appendChild(status.alert_next);
        li.append(" next time we can turn - ");
        const force_button = document.createElement("button");
        force_button.innerText = "Force alert next turn";
        force_button.onclick = (e) => {
            straight_streak = 10000;
        }
        li.appendChild(force_button)
        status_ul.appendChild(li);
        // Connection to Tricks
        li = document.createElement("li");
        status.mmt = document.createElement("span");
        status.mmt.classList.add("ta-bad");
        li.appendChild(status.mmt);
        li.append(" to Minimap Tricks for markers.");
        status_ul.appendChild(li);

        irf_settings.container.appendChild(status_el);
    }

    // GUI objects
    function add_checkbox(
        name, identifier, callback=undefined,
        settings_container=irf_settings.container
    ) {
        let label = document.createElement("label");

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = settings[identifier];
        checkbox.className = IRF.ui.panel.styles.toggle;
        label.appendChild(checkbox);

        let text = document.createElement("span");
        text.innerText = " " + name;
        label.appendChild(text);

        checkbox.onchange = () => {
            settings[identifier] = checkbox.checked;
            GM.setValues(settings);
            if (callback) callback(checkbox.checked);
        }

        settings_container.appendChild(label);
        settings_container.appendChild(document.createElement("br"));
        settings_container.appendChild(document.createElement("br"));
    }

    function add_slider(
        name, identifier, callback=undefined,
        slider_bits=[1, 17, .5],
        settings_container=irf_settings.container
    ) {
        let label = document.createElement("label");

        let text = document.createElement("span");
        text.innerText = " " + name + ": ";
        label.appendChild(text);

        let value_label = document.createElement("span");
        value_label.innerText = settings[identifier];
        label.appendChild(value_label);

        let slider = document.createElement("input");
        slider.type = "range";
        slider.min = slider_bits[0];
        slider.max = slider_bits[1];
        slider.step = slider_bits[2];
        slider.value = settings[identifier];
        slider.className = IRF.ui.panel.styles.slider;
        label.appendChild(slider);

        slider.oninput = () => {
            settings[identifier] = slider.value;
            value_label.innerText = slider.value;
            GM.setValues(settings);
            if (callback) callback(slider.value);
        }
        slider.onmousedown = (e) => {e.stopPropagation()}

        settings_container.appendChild(label);
        settings_container.appendChild(document.createElement("br"));
        settings_container.appendChild(document.createElement("br"));
    }

    // Set up warn objects
    const howler = await IRF.modules.howler;
    class Warn {
        constructor(kind, settings_text, warn_text) {
            this._kind = kind;
            this._settings_text = settings_text;
            this._warn_text = warn_text;

            this.howl = new howler.Howl({
                src: [
                    settings[kind == "turn" ? "sound" : `${kind}_sound`]
                ],
                volume: settings[kind == "turn" ? "volume" : `${kind}_volume`]
            })

            this.settings = document.createElement("div");
            this.settings.appendChild(document.createElement("hr"));
            const heading = document.createElement("h3");
            heading.innerText = `${settings_text} warning`
            this.settings.appendChild(heading);
            add_checkbox(
                `${settings_text} visual warning`,
                `${kind}_alert_visual`, undefined,
                this.settings
            )
            add_checkbox(
                `${settings_text} desktop notification`,
                `${kind}_alert_notif`, undefined,
                this.settings
            )
            add_checkbox(
                `${settings_text} sound warning`,
                `${kind}_alert_sound`, undefined,
                this.settings
            )
            add_slider("Volume", (kind == "turn" ? "volume" : `${kind}_volume`),
            (value) => {
                this.howl.volume(value);
            }, [0, 1, 0.05], this.settings);

            // Set sound text box
            let label = document.createElement("label");

            let text = document.createElement("span");
            text.innerHTML = " Sound file URL (host on <a href='https://catbox.moe' target='_blank'>catbox.moe</a>):";
            label.appendChild(text);
            label.appendChild(document.createElement("br"));

            let box = document.createElement("input");
            box.value = settings[kind == "turn" ? "sound" : `${kind}_sound`];
            box.style.width = "100%";
            label.appendChild(box);

            this.settings.appendChild(label);
            this.settings.appendChild(document.createElement("br"));
            this.settings.appendChild(document.createElement("br"));

            // Test and save button
            let button = document.createElement("button");
            button.innerText = `Test ${kind} alert and save sound (if you hear it, it worked!)`;
            button.onclick = async () => {
                this.howl = new howler.Howl({
                    src: [
                        box.value
                    ],
                    volume: settings[kind == "turn" ? "volume" : `${kind}_volume`]
                })
                this.howl.once("end", () => {
                    settings[kind == "turn" ? "sound" : `${kind}_sound`] = box.value;
                    GM.setValues(settings);
                })
                this.warn();
            }
            this.settings.appendChild(button);
            this.settings.appendChild(document.createElement("br"));
            this.settings.appendChild(document.createElement("br"));
        }

        warn() {
            if (settings[`${this._kind}_alert_visual`]) {
                warn_visual(this._warn_text)
            }
            if (settings[`${this._kind}_alert_sound`]) {
                this.howl.play();
            }
            if (settings[`${this._kind}_alert_notif`]) {
                GM.notification(
                    `Warning! - ${this._warn_text}`,
                    "Internet Roadtrip",
                    "https://files.catbox.moe/fdkl61.png",
                    (e) => {console.log("notif click", e)}
                );
            }
        }
    }
    const warn_turn = new Warn("turn", "Turn", "Turn now!");
    add_slider(
        "Time going straight before alerting (minutes, approx.)",
        "minutes", undefined, [1, 60, 1], warn_turn.settings
    );
    const warn_marker = new Warn("marker", "Marker", "Marker ahead!");
    add_slider(
        "Distance from marker (meters, we move ~3m per second)",
        "distance", undefined, [50, 1500, 50], warn_marker.settings
    );
    irf_settings.container.appendChild(warn_turn.settings);
    irf_settings.container.appendChild(warn_marker.settings);

    // Override the setter for the number of available options
    // To warn if we encounter a turn suddenly
    // Get the original setter
    const { set: currentOptionsSetter } = Object.getOwnPropertyDescriptor(v_container.state, 'currentOptions');
    // Override the setter
    Object.defineProperty(v_container.state, 'currentOptions', {
        set(currentOptions) {
            // Set the units on the scale bar
            let straight_lim = settings.minutes*12;
            if (currentOptions.length == 1) {
                straight_streak += 1;
            } else {
                // console.log("Not straight!");
                if (straight_streak > straight_lim) {
                    warn_turn.warn();
                }
                straight_streak = 0;
            }
            status.straight_n.innerText = straight_streak;
            status.straight_lim.innerText = straight_lim;
            if (straight_streak > straight_lim) {
                status.alert_next.innerText = "Will alert";
                status.alert_next.classList.toggle("ta-good", true);
            } else {
                status.alert_next.innerText = "No alert";
                status.alert_next.classList.toggle("ta-good", false);
            }
            return currentOptionsSetter.call(this, currentOptions);
        },
        configurable: true,
        enumerable: true,
    });

    // Override changeStop to alert when we come close to a Marker
    const changeStop = v_container.methods.changeStop;
    const alerted = [];
    v_container.state.changeStop = new Proxy(changeStop, {
		apply: (target, thisArg, args) => {
			const returnValue = Reflect.apply(target, thisArg, args);
            const coords = args[5][0];
            if (unsafeWindow._MMT_getMarkers) {
                status.mmt.innerText = "Connected";
                status.mmt.classList.toggle("ta-good", true);
                const markers = unsafeWindow._MMT_getMarkers();
                if (markers) {
                    for (const [marker_id, marker] of Object.entries(markers)) {
                        let distance = marker.getLngLat().distanceTo(v_map.data.marker.getLngLat());
                        if (alerted.includes(marker_id)) {
                            if (distance > settings.distance) {
                                // Remove marker from alerted list if it's now out of range
                                const index = alerted.indexOf(marker_id);
                                if (index > -1) {
                                    alerted.splice(index, 1);
                                }
                            }
                        } else if (distance < settings.distance) {
                            alerted.push(marker_id);
                            warn_marker.warn();
                        }
                    }
                }
            } else {
                status.mmt.innerText = "Not connected";
                status.mmt.classList.toggle("ta-good", false);
            }
            return returnValue;
		},
	});

})();
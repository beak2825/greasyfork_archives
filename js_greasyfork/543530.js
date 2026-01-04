// ==UserScript==
// @name        Internet Roadtrip Speedometer
// @namespace   spideramn.github.io
// @match       https://neal.fun/internet-roadtrip/*
// @version     0.0.3
// @author      Spideramn
// @description Internet Roadtrip Speedometer.
// @license     MIT
// @grant       GM.addStyle
// @grant       GM.setValues
// @grant       GM.getValues
// @run-at      document-start
// @icon        https://neal.fun/favicons/internet-roadtrip.png
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @require     https://cdnjs.cloudflare.com/ajax/libs/gauge.js/1.3.9/gauge.min.js
// @downloadURL https://update.greasyfork.org/scripts/543530/Internet%20Roadtrip%20Speedometer.user.js
// @updateURL https://update.greasyfork.org/scripts/543530/Internet%20Roadtrip%20Speedometer.meta.js
// ==/UserScript==

// This works together with irf.d.ts to give us type hints
/* globals IRF Gauge */
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
    const odometer = await IRF.vdom.odometer;
    const wheelDom = await IRF.dom.wheel;

    // Speedometer
    class SpeedOmeterControl
    {
        _queue = [];
        _speedOmeterContainer = undefined;
        _speedOmeterElement = undefined;
        _gauge = undefined;

        addDistance(distanceInMiles)
        {
            // prevent duplicate distances
            if(this._queue.length > 0)
            {
                const lastDistance = this._queue[this._queue.length - 1].distance;
                if(distanceInMiles == lastDistance)
                {
                    this.update();
                    return;
                }
            }

            this._queue.push({time: Date.now(), distance: distanceInMiles});
            if (this._queue.length > 15)
            {
                this._queue.shift();
            }
            this.update();
        };

        async setup()
        {
            GM.addStyle(`
.speedOmeterContainer {
	width: 300px; // 70%;
	height: 100px; // 25%;
	position: absolute;
	top: 30px; // 10%;
	left: 35px; // 15%;
    visibility: hidden;
}
.speedOmeterContainer canvas{
    position: absolute;
    width: 100%;
    height: 100%;
}
.speedOmeterContainer span {
	position: absolute;
	width: 100%;
	bottom: 0%;
	left: 0%;
	height: 50%;
	text-align: center;
	font-family: Roboto,sans-serif;
    color: #1F1F1F;
    font-size: 17px;
}
`);

            // add dom elements
            this._speedOmeterContainer = document.createElement('div');
            this._speedOmeterContainer.className = "speedOmeterContainer";
            const speedOmeterCanvas = document.createElement('canvas');
            this._speedOmeterElement = document.createElement('span');
            this._speedOmeterContainer.appendChild(speedOmeterCanvas);
            this._speedOmeterContainer.appendChild(this._speedOmeterElement);
            wheelDom.prepend(this._speedOmeterContainer);

            var opts = {
                angle: 0,
                lineWidth: 1,
                radiusScale: 1,
                pointer: {
                    length: 1,
                    strokeWidth: 0.035,
                    color: '#AA000099'
                },
                limitMax: true,
                limitMin: true,
                generateGradient: false,
                highDpiSupport: true,
                colorStart: '#FFFFFF99',
                colorStop: '#FFFFFF99',
                strokeColor: '#FFFFFF99',
                // renderTicks is Optional
                renderTicks: {
                    divisions: 6,
                    divWidth: 2,
                    divLength: 0.1,
                    divColor: '#333333',
                    subDivisions: 5,
                    subLength: 0.05,
                    subWidth: 1,
                    subColor: '#666666'
                },
                staticLabels: {
                    font: "10px Roboto,sans-serif",
                    labels: [0, 5, 10, 15, 20, 25, 30],
                    color: "#000000",
                    fractionDigits: 0
                }
            };
            this._gauge = new Gauge(speedOmeterCanvas).setOptions(opts);
            this._gauge.maxValue = 30;
            this._gauge.set(0); // set actual value

            // set hook
            odometer.state.updateDisplay = new Proxy(odometer.methods.updateDisplay, {
                apply: (target, thisArg, args) => {
                    this.addDistance(odometer.props.miles);
                    return Reflect.apply(target, thisArg, args);;
                },
            });
            
            // update position of speedometer
            this.updatePosition();
        }

        update()
        {
            if(settings.speedometer_enabled)
            {
                this._speedOmeterContainer.style.visibility = 'visible';

                if(this._queue.length < 3)
                {
                    this._gauge.set(0);
                    this._speedOmeterElement.innerText = 'Calibrating...';
                    return;
                }

                const lastItem = this._queue[this._queue.length - 1];
                const firstItem = this._queue[0];
                const timeInHours = (lastItem.time - firstItem.time) / (1000 * 60 * 60);
                let speed = (lastItem.distance - firstItem.distance) / timeInHours; // in mph
                if(odometer.data.isKilometers)
                {
                    speed *= odometer.data.conversionFactor;
                }
                this._gauge.set(speed);
                this._speedOmeterElement.innerText = (speed.toFixed(1) + (odometer.data.isKilometers? ' km/h' : ' mph'));
            }
            else
            {
                this._gauge.set(0);
                this._speedOmeterElement.innerText = '';
                this._speedOmeterContainer.style.visibility = 'hidden';
            }
        }

        updatePosition()
        {
            if(this._speedOmeterContainer)
            {
                this._speedOmeterContainer.style.left = settings.speedometer_left + 'px';
                this._speedOmeterContainer.style.top = settings.speedometer_top + 'px';
                this._speedOmeterContainer.style.transform = 'scale(' + settings.speedometer_scale + ')';
            }
        }
    };

    //
    // Settings
    const settings = {
        "speedometer_enabled": true,
        "speedometer_scale": 1.0,
        "speedometer_left": 35,
        "speedometer_top": 30,
    };
    const storedSettings = await GM.getValues(Object.keys(settings))
    Object.assign(settings, storedSettings);
    await GM.setValues(settings);

    // settings panel
    let gm_info = GM.info
    gm_info.script.name = "Speedometer"
    const irf_settings = IRF.ui.panel.createTabFor(gm_info, { tabName: "Speedometer" });
    add_checkbox('Display speedometer', 'speedometer_enabled', () => speedOmeter.update());
    
    const header = document.createElement('h3');
    header.innerText = 'Position';
    irf_settings.container.appendChild(header);
    let button = document.createElement('button');
    button.innerText = 'Reset position';
    button.addEventListener('click', () => {
        speedometer_left_element.value = settings.speedometer_left = 35;
        speedometer_top_element.value = settings.speedometer_top = 30;
        speedometer_scale_element.value = settings.speedometer_scale = 1.0;
        GM.setValues(settings);
        speedOmeter.updatePosition();
    });
    irf_settings.container.appendChild(button);
    irf_settings.container.appendChild(document.createElement('br'));
    const speedometer_left_element = add_numeric('Left', 'speedometer_left', -1000, 1000, 1, () => speedOmeter.updatePosition());
    const speedometer_top_element = add_numeric('Top', 'speedometer_top', -1000, 1000, 1, () => speedOmeter.updatePosition());
    const speedometer_scale_element = add_numeric('Scale', 'speedometer_scale', 0.5, 2, 0.1, () => speedOmeter.updatePosition());

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

    function add_numeric(name, identifier, min, max, step, callback=undefined, settings_container=irf_settings.container) {
        let label = document.createElement("label");
        label.style.display = 'block';

        let text = document.createElement("span");
        text.innerText = " " + name;
        label.appendChild(text);

        label.appendChild(document.createElement("br"));

        let input = document.createElement("input");
        input.id = "speedometer_" + identifier;
        input.type = "number";
        input.value = settings[identifier];
        input.min = min;
        input.max = max;
        input.step = step;
        input.className = IRF.ui.panel.styles.input;
        label.appendChild(input);

        input.addEventListener("change", () => {
            settings[identifier] = parseFloat(input.value);
            GM.setValues(settings);
            if (callback) callback(parseFloat(input.value));
        });

        settings_container.appendChild(label);
        return input;
    };

    const speedOmeter = new SpeedOmeterControl();
    await speedOmeter.setup();
})();
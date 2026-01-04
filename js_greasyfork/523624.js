// ==UserScript==
// @name         GeoFS AI (GPT) ATC
// @namespace    https://avramovic.info/
// @version      1.0.9
// @description  AI ATC for GeoFS using free PuterJS GPT API
// @author       Nemanja Avramovic
// @license      MIT
// @match        https://www.geo-fs.com/geofs.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geo-fs.com
// @grant        GM.getResourceText
// @grant        GM.getResourceUrl
// @resource     airports https://github.com/avramovic/geofs-ai-atc/raw/master/airports.json
// @resource     radiostatic https://github.com/avramovic/geofs-ai-atc/raw/master/radio-static.mp3
// @downloadURL https://update.greasyfork.org/scripts/523624/GeoFS%20AI%20%28GPT%29%20ATC.user.js
// @updateURL https://update.greasyfork.org/scripts/523624/GeoFS%20AI%20%28GPT%29%20ATC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const head = document.querySelector('head');
    if (head) {
        const puterJS = document.createElement('script');
        puterJS.src = 'https://js.puter.com/v2/';
        head.appendChild(puterJS);

        const growlJS = document.createElement('script');
        growlJS.src = 'https://cdn.jsdelivr.net/gh/avramovic/geofs-ai-atc@master/vanilla-notify.min.js';
        head.appendChild(growlJS);

        const growlCSS = document.createElement('link');
        growlCSS.href = 'https://cdn.jsdelivr.net/gh/avramovic/geofs-ai-atc@master/vanilla-notify.css';
        growlCSS.rel = 'stylesheet';
        head.appendChild(growlCSS);
    }

    let airports;
    GM.getResourceText("airports").then((data) => {
        airports = JSON.parse(data);
    });

    let radiostatic;
    GM.getResourceUrl("radiostatic").then((data) => {
        radiostatic = new Audio('data:audio/mp3;'+data);
        radiostatic.loop = false;
    });

    let tunedInAtc;
    let controllers = {};
    let context = {};
    let oldNearest = null;

    const observer = new MutationObserver(() => {
        const menuList = document.querySelector('div.geofs-ui-bottom');

        if (menuList && !menuList.querySelector('.geofs-atc-icon')) {
            const micIcon = document.createElement('i');
            micIcon.className = 'material-icons';
            micIcon.innerText = 'headset_mic';

            const knobIcon = document.createElement('i');
            knobIcon.className = 'material-icons';
            knobIcon.innerText = 'radio';

            const tuneInButton = document.createElement('button');
            tuneInButton.className = 'mdl-button mdl-js-button mdl-button--icon geofs-f-standard-ui geofs-tunein-icon';
            tuneInButton.title = "Click to set ATC frequency.";

            tuneInButton.addEventListener('click', (e) => {
                let nearestAp = findNearestAirport();
                let apCode = prompt('Enter airport ICAO code', nearestAp.code);
                if (apCode == null || apCode === '') {
                    error('You cancelled the dialog.')
                } else {
                    apCode = apCode.toUpperCase();
                    if (typeof unsafeWindow.geofs.mainAirportList[apCode] === 'undefined') {
                        error('Airport with code '+ apCode + ' can not be found!');
                    } else {
                        tunedInAtc = apCode;
                        initController(apCode);
                        info('Your radio is now tuned to '+apCode+' frequency. You will now talk to them.');
                    }
                }
            });

            const atcButton = document.createElement('button');
            atcButton.className = 'mdl-button mdl-js-button mdl-button--icon geofs-f-standard-ui geofs-atc-icon';
            atcButton.title = "Click to talk to the ATC. Ctrl+click (Cmd+click on Mac) to input text instead of talking.";

            atcButton.addEventListener('click', (e) => {
                if (typeof tunedInAtc === 'undefined') {
                    error("No frequency set. Click the radio icon to set the frequency!");
                } else if (e.ctrlKey || e.metaKey) {
                    let pilotMsg = prompt("Please enter your message to the ATC:");
                    if (pilotMsg != null && pilotMsg != "") {
                        callAtc(pilotMsg);
                    } else {
                        error("You cancelled the dialog");
                    }
                } else {
                    navigator.mediaDevices.getUserMedia({ audio: true });
                    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    let recognition = new SpeechRecognition();
                    recognition.continuous = false;
                    recognition.lang = 'en-US';
                    recognition.interimResults = false;
                    recognition.maxAlternatives = 1;
                    recognition.start();
                    recognition.onresult = (event) => {
                        let pilotMsg = event.results[event.results.length - 1][0].transcript;
                        if (pilotMsg != null && pilotMsg != "") {
                            callAtc(pilotMsg);
                        } else {
                            error("No speech recognized. Speak up?");
                        }
                        recognition.stop();
                    };
                    recognition.onerror = (event) => {
                        error('Speech recognition error: ' + event.error);
                    };
                }
            });

            atcButton.appendChild(micIcon);
            tuneInButton.appendChild(knobIcon);

            menuList.appendChild(tuneInButton);
            menuList.appendChild(atcButton);
        }
    });

    observer.observe(document.body, {childList: true, subtree: true});

    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const toRad = (deg) => deg * (Math.PI / 180);

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return (R * c) / 1.852; // Distance in nautical miles
    }

    function findNearestAirport() {
        let nearestAirport = null;
        let minDistance = Infinity;

        for (let apCode in unsafeWindow.geofs.mainAirportList) {
            let distance = findAirportDistance(apCode);

            if (distance < minDistance) {
                minDistance = distance;
                nearestAirport = {
                    code: apCode,
                    distance: distance
                };
            }
        }

        return nearestAirport;
    }

    function findAirportDistance(code) {
        let aircraftPosition = {
            lat: unsafeWindow.geofs.aircraft.instance.lastLlaLocation[0],
            lon: unsafeWindow.geofs.aircraft.instance.lastLlaLocation[1],
        };
        let ap = unsafeWindow.geofs.mainAirportList[code];
        let airportPosition = {
            lat: ap[0],
            lon: ap[1]
        };

        return haversine(
          aircraftPosition.lat,
          aircraftPosition.lon,
          airportPosition.lat,
          airportPosition.lon
        );
    }

    function calculateBearing(lat1, lon1, lat2, lon2) {
        const toRadians = (deg) => deg * (Math.PI / 180);
        const toDegrees = (rad) => rad * (180 / Math.PI);

        const dLon = toRadians(lon2 - lon1);
        const y = Math.sin(dLon) * Math.cos(toRadians(lat2));
        const x = Math.cos(toRadians(lat1)) * Math.sin(toRadians(lat2)) -
          Math.sin(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.cos(dLon);
        const bearing = toDegrees(Math.atan2(y, x));

        // Normalize to 0-360 degrees
        return (bearing + 360) % 360;
    }

    function getRelativeDirection(airportLat, airportLon, airplaneLat, airplaneLon) {
        // Calculate the bearing from the airport to the airplane
        const bearing = calculateBearing(airportLat, airportLon, airplaneLat, airplaneLon);

        // Determine the direction based on the bearing
        if (bearing >= 337.5 || bearing < 22.5) {
            return "north";
        } else if (bearing >= 22.5 && bearing < 67.5) {
            return "northeast";
        } else if (bearing >= 67.5 && bearing < 112.5) {
            return "east";
        } else if (bearing >= 112.5 && bearing < 157.5) {
            return "southeast";
        } else if (bearing >= 157.5 && bearing < 202.5) {
            return "south";
        } else if (bearing >= 202.5 && bearing < 247.5) {
            return "southwest";
        } else if (bearing >= 247.5 && bearing < 292.5) {
            return "west";
        } else if (bearing >= 292.5 && bearing < 337.5) {
            return "northwest";
        }
    }

    function initController(apCode) {
        controllers[apCode] = controllers[apCode] || null;

        if (controllers[apCode] == null) {
            let date = new Date().toISOString().split('T')[0];
            fetch('https://randomuser.me/api/?gender=male&nat=au,br,ca,ch,de,us,dk,fr,gb,in,mx,nl,no,nz,rs,tr,ua,us&seed='+apCode+'-'+date)
              .then(response => {
                  if (!response.ok) {
                      throw new Error('HTTP error! status: '+response.status);
                  }
                  return response.text();
              }).then(resourceText => {
                let json = JSON.parse(resourceText)
                controllers[apCode] = json.results[0];
            });
        }
    }

    function error(msg) {
        vNotify.error({text:msg, title:'Error', visibleDuration: 10000});
    }

    function info(msg, title) {
        title = title || 'Information';
        vNotify.info({text:msg, title:title, visibleDuration: 10000});
    }

    function atcSpeak(text) {
        let synth = window.speechSynthesis;
        let voices = synth.getVoices();
        let toSpeak = new SpeechSynthesisUtterance(text);
        toSpeak.voice = voices[0];
        synth.speak(toSpeak);
    }

    function atcGrowl(text, airport_code) {
        vNotify.warning({text: text, title: airport_code+' ATC', visibleDuration: 20000});
    }

    function atcMessage(text, airport_code) {
        atcGrowl(text, airport_code);
        atcSpeak(text);
    }

    function pilotMessage(text) {
        let user = unsafeWindow.geofs.userRecord;
        let airplane = unsafeWindow.geofs.aircraft.instance.aircraftRecord;

        let callsign = "Foo";
        if (user.id != 0) {
            callsign = user.callsign;
        }

        vNotify.success({text: text, title: airplane.name+': '+callsign, visibleDuration: 10000});
    }

     function isOnGround() {
        return unsafeWindow.geofs.animation.values.groundContact === 1;
    }

    function seaAltitude() {
        return unsafeWindow.geofs.animation.values.altitude;
    }

    function groundAltitude() {
        return Math.max(seaAltitude() - unsafeWindow.geofs.animation.values.groundElevationFeet - 50, 0);
    }

    function getPilotInfo(today) {
        let user = unsafeWindow.geofs.userRecord;

        let pilot = {
            callsign: 'Foo',
            name: 'not known',
            licensed_at: today
        };

        if (user.id != 0) {
            pilot = {
                callsign: user.callsign,
                name: user.firstname + ' ' + user.lastname,
                licensed_at: user.created
            };
        }

        return pilot;
    }

    // generate controller for the nearest airport for today
    setInterval(function() {
        let airport = findNearestAirport();
        let airportMeta = airports[airport.code];

        if (oldNearest !== airport.code) {
            let apName = airportMeta ? airportMeta.name+' ('+airport.code+')' : airport.code;
            info('You are now in range of '+apName+'. Set your radio frequency to <b>'+airport.code+'</b> to tune in with them');
            oldNearest = airport.code;
            initController(airport.code);
        }
    }, 500);

    function callAtc(pilotMsg) {
        let airport = {
            distance: findAirportDistance(tunedInAtc),
            code: tunedInAtc,
        };

        let date = new Date().toISOString().split('T')[0];
        let time = unsafeWindow.geofs.animation.values.hours + ':' + unsafeWindow.geofs.animation.values.minutes;
        let airportMeta = airports[airport.code];
        let controller = controllers[airport.code];
        let apName = airportMeta ? airportMeta.name + ' (' + airport.code + ')' : airport.code;
        let pilot = getPilotInfo(date);

        if (typeof controller === 'undefined') {
            radiostatic.play();
            info('Airport '+apName+' seems to be closed right now. Try again later...');
            initController(airport.code);
            return;
        }

        if (airport.distance > 50) {
            radiostatic.play();
            error('Frequency '+airport.code+' is out of range. You need to be at least 50 nautical miles away from the airport to contact it.');
            return;
        }

        let airportPosition = {
            lat: unsafeWindow.geofs.mainAirportList[airport.code][0],
            lon: unsafeWindow.geofs.mainAirportList[airport.code][1],
        };

        if (typeof context[airport.code] === "undefined") {
            let season = unsafeWindow.geofs.animation.values.season;
            let daynight = unsafeWindow.geofs.animation.values.night ? 'night' : 'day';
            if (unsafeWindow.geofs.isSnow || unsafeWindow.geofs.isSnowy) {
                daynight = 'snowy '+daynight;
            }

            let intro = 'You are '+controller.name.first+' '+controller.name.last+', a '+controller.dob.age+' years old '+controller.gender+' ATC controller on the '+apName+' for today. ' +
                'Your airport location is (lat: '+airportPosition.lat+', lon: '+airportPosition.lon+'). You are talking to pilot whose name is '+pilot.name+' callsign ('+pilot.callsign+') and they\'ve been piloting since '+pilot.licensed_at+'. ' +
                'You will be acting as ground, tower (if the plane is below or at 5000 ft) or approach or departure (if above 5000 ft), depending on whether the plane is on the ground, their distance from the airport, heading and previous context. ' +
                'If the aircraft is in the air, keep your communication short and concise, as a real ATC. If they\'re on the ground, your replies should still be short (1-2 sentence per reply), but you can ' +
                'use a more relaxed communication like making jokes, discussing weather, other traffic etc. If asked why so slow on replies, say you\'re busy, like the real ATC. '+
                'Today is '+date+', time is '+time+', a beautiful '+season+' '+daynight;

            context[airport.code] = [];
            context[airport.code].push({content: intro, role: 'system'});
        }

        // provide current update
        let airplane = unsafeWindow.geofs.aircraft.instance.aircraftRecord;
        let aircraftPosition = {
            lat: unsafeWindow.geofs.aircraft.instance.lastLlaLocation[0],
            lon: unsafeWindow.geofs.aircraft.instance.lastLlaLocation[1],
        };

        let onGround = isOnGround() ? 'on the ground' : 'in the air';
        let distance;

        if (airport.distance > 1) {
            let relativeDirection = getRelativeDirection(airportPosition.lat, airportPosition.lon, aircraftPosition.lat, aircraftPosition.lon);
            distance = airport.distance+' nautical miles '+relativeDirection+' from the airport';
        } else if (isOnGround()) {
            distance = 'at the airport';
        } else {
            distance = 'above the airport';
        }

        let movingSpeed;
        if (isOnGround()) {
            if (unsafeWindow.geofs.animation.values.kias > 1) {
                movingSpeed = 'moving at '+unsafeWindow.geofs.animation.values.kias+' kts'
            } else {
                movingSpeed = 'stationary';
            }
        } else {
            movingSpeed = 'flying at '+unsafeWindow.geofs.animation.values.kias+' kts, heading '+unsafeWindow.geofs.animation.values.heading360;
        }

        let address = pilot.callsign+', '+airport.code;
        if (isOnGround()) {
            address += ' Ground';
        } else if (seaAltitude() <= 5000) {
            address += ' Tower';
        } else {
            address += ' Area Control';
        }

        if (airplane.name.toLowerCase().includes('cessna') || airplane.name.toLowerCase().includes('piper')) {
            address = airplane.name + ' ' + address;
        }

        let relativeWindDirection = unsafeWindow.geofs.animation.values.relativeWind;
        let windDirection = (unsafeWindow.geofs.animation.values.heading360 + relativeWindDirection + 360) % 360;
        let wind = unsafeWindow.geofs.animation.values.windSpeedLabel + ', direction '+ windDirection + ' degrees (or '+relativeWindDirection+' degrees relative to the heading of the aircraft)';

        let currentUpdate = 'Date and time: '+date+' '+time+'. '+
            'The pilot is flying '+airplane.name+' and their position is '+onGround+' '+distance+'. The altitude of the aircraft is '+seaAltitude()+' feet above the sea level ('+groundAltitude()+' feet above ground). ' +
            'The plane is '+movingSpeed+'. Wind speed is '+wind+'. Air temperature is '+unsafeWindow.geofs.animation.values.airTemp+' degrees celsius. '+
            'You should address them with "'+address+'", followed by the message.';

        // remove old currentUpdate, leaving only the last one
        if (context[airport.code].length >= 4) {
            context[airport.code].splice(-3, 1);
        }

        context[airport.code].push({content: currentUpdate, role: 'system'});
        context[airport.code].push({content: pilotMsg, role: 'user'});

        pilotMessage(pilotMsg);

        puter.ai.chat(context[airport.code]).then(function(resp) {
            context[airport.code].push(resp.message);
            atcMessage(resp.message.content, airport.code);
        });
    }

})();

// ==UserScript==
// @name         PerfectTimeToSleepAndSalatTime
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Calculate perfect sleep cycles based on Islamic prayer times (Salat) and the example of Prophet Dawud (David). Automatically detects user's city using IP address.
// @author       MeGaMoSbah
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      muslimsalat.com
// @connect      ipinfo.io
// @downloadURL https://update.greasyfork.org/scripts/457189/PerfectTimeToSleepAndSalatTime.user.js
// @updateURL https://update.greasyfork.org/scripts/457189/PerfectTimeToSleepAndSalatTime.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Fonction pour convertir une heure au format 12h (AM/PM) en 24h
    function convertTo24Hour(time) {
        const [timePart, period] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);

        if (period === 'pm' && hours !== 12) {
            hours += 12;
        } else if (period === 'am' && hours === 12) {
            hours = 0;
        }

        return { hours, minutes };
    }

    // Fonction pour convertir les minutes en heures et minutes
    function toHoursAndMinutes(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60) % 24; // Assure que les heures restent dans une plage de 24 heures
        const minutes = totalMinutes % 60;
        return { hours, minutes };
    }

    // Fonction pour formater l'heure en HH:MM
    function formatTime(hours, minutes) {
        return `${hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }

    // Fonction pour calculer les cycles de sommeil
    function calculateSleepCycles(ishaTime, fajrTime) {
        // Convertir Isha et Fajr en format 24 heures
        const isha = convertTo24Hour(ishaTime);
        const fajr = convertTo24Hour(fajrTime);

        // Convertir les heures en minutes depuis minuit
        const ishaTotalMinutes = isha.hours * 60 + isha.minutes;
        const fajrTotalMinutes = fajr.hours * 60 + fajr.minutes;

        // Calculer la durée totale de la nuit en minutes
        let nightDuration;
        if (fajrTotalMinutes > ishaTotalMinutes) {
            nightDuration = fajrTotalMinutes - ishaTotalMinutes;
        } else {
            nightDuration = (24 * 60 - ishaTotalMinutes) + fajrTotalMinutes; // Gestion du passage à minuit
        }

        // Diviser la nuit en 6 cycles (comme dans l'exemple de Prophet Dawud)
        const cycleDuration = Math.floor(nightDuration / 6);

        // Calculer les heures de début de chaque cycle
        const cycles = [];
        for (let i = 0; i <= 6; i++) {
            const cycleStartMinutes = ishaTotalMinutes + i * cycleDuration;
            const cycleStart = toHoursAndMinutes(cycleStartMinutes % (24 * 60)); // Gestion du passage à minuit
            cycles.push(formatTime(cycleStart.hours, cycleStart.minutes));
        }

        return cycles;
    }

    // Fonction pour afficher les temps de prière et les cycles de sommeil
    function displayPrayerTimesAndSleepCycles(data) {
        const times = data.items[0];

        // Extraire les temps de prière
        const fajrTime = times.fajr;
        const chouroukTime = times.shurooq;
        const dohrTime = times.dhuhr;
        const asrTime = times.asr;
        const maghrebTime = times.maghrib;
        const ishaTime = times.isha;

        console.log("Fajr time is: " + fajrTime);
        console.log("Chourouk time is: " + chouroukTime);
        console.log("Dohr time is: " + dohrTime);
        console.log("Asr time is: " + asrTime);
        console.log("Maghreb time is: " + maghrebTime);
        console.log("Isha time is: " + ishaTime);

        // Calculer les cycles de sommeil
        const sleepCycles = calculateSleepCycles(ishaTime, fajrTime);
        console.log("Sleep cycles based on Prophet Dawud's example:");
        sleepCycles.forEach((cycle, index) => {
            console.log(`Cycle ${index + 1} starts at: ${cycle}`);
        });

        // Calculer le meilleur temps pour dormir (moitié du temps entre Isha et Fajr + dernier 1/6)
        const isha = convertTo24Hour(ishaTime);
        const fajr = convertTo24Hour(fajrTime);

        const ishaTotalMinutes = isha.hours * 60 + isha.minutes;
        const fajrTotalMinutes = fajr.hours * 60 + fajr.minutes;

        let nightDuration;
        if (fajrTotalMinutes > ishaTotalMinutes) {
            nightDuration = fajrTotalMinutes - ishaTotalMinutes;
        } else {
            nightDuration = (24 * 60 - ishaTotalMinutes) + fajrTotalMinutes; // Gestion du passage à minuit
        }

        // Moitié du temps entre Isha et Fajr
        const halfNight = Math.floor(nightDuration / 2);
        const halfNightTime = toHoursAndMinutes(ishaTotalMinutes + halfNight);

        // Dernier 1/6 du temps entre Isha et Fajr
        const lastSixth = Math.floor(nightDuration / 6);
        const lastSixthTime = toHoursAndMinutes(ishaTotalMinutes + nightDuration - lastSixth);

        console.log("Best time to sleep (half of the night): " + formatTime(halfNightTime.hours, halfNightTime.minutes));
        console.log("Best time to sleep (last 1/6 of the night): " + formatTime(lastSixthTime.hours, lastSixthTime.minutes));
    }

    // Fonction pour récupérer les temps de prière en fonction de la ville
    function fetchPrayerTimes(city) {
        const url = `https://muslimsalat.com/${city}/daily.json`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                const data = JSON.parse(response.responseText);
                if (data.status_valid === 1) {
                    displayPrayerTimesAndSleepCycles(data);
                } else {
                    console.error("Failed to fetch prayer times. Please check the city name.");
                }
            },
            onerror: function (error) {
                console.error("Error fetching prayer times:", error);
            }
        });
    }

    // Fonction pour détecter la ville de l'utilisateur via l'adresse IP
    function detectUserCityByIP() {
        const ipInfoUrl = "https://ipinfo.io/json";

        GM_xmlhttpRequest({
            method: "GET",
            url: ipInfoUrl,
            onload: function (response) {
                const data = JSON.parse(response.responseText);
                const city = data.city;
                if (city) {
                    console.log("Detected city using IP:", city);
                    fetchPrayerTimes(city);
                } else {
                    console.error("City not found using IP. Using default city: Oran");
                    fetchPrayerTimes("Oran"); // Ville par défaut
                }
            },
            onerror: function (error) {
                console.error("Error detecting city using IP:", error);
                fetchPrayerTimes("Oran"); // Ville par défaut en cas d'erreur
            }
        });
    }

    // Démarrer le script
    detectUserCityByIP();
})();
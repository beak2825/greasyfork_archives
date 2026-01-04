// ==UserScript==
// @name         RQ.run TCX Exporter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Export RQ.run activity data to TCX format
// @match        https://www.rq.run/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510701/RQrun%20TCX%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/510701/RQrun%20TCX%20Exporter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Check for updates
    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://update.greasyfork.org/scripts/510701/RQrun%20TCX%20Exporter.meta.js",
            onload: function (response) {
                const latestVersion = /@version\s+([0-9.]+)/.exec(response.responseText)[1];
                const currentVersion = GM_info.script.version;
                if (latestVersion > currentVersion) {
                    alert("RQ.run TCX Exporter 有新版本可用: " + latestVersion + "\n请点击OK更新");
                    window.location.href = "https://greasyfork.org/en/scripts/510701-rq-run-tcx-exporter";
                }
            },
            onerror: function (error) {
                console.error('Error checking for updates:', error);
            }
        });
    }

    // Add export button to the page
    function addExportButton() {
        const button = document.createElement('button');
        button.textContent = 'Export TCX';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.addEventListener('click', handleExport);
        document.body.appendChild(button);
    }

    // Handle export button click
    function handleExport() {
        const url = window.location.href;
        const recordId = url.match(/id=(\d+)/);
        if (recordId) {
            fetchActivityData(recordId[1]);
        } else {
            alert('No record ID found in URL');
        }
    }

    // Fetch activity data from API
    function fetchActivityData(recordId) {
        const apiUrl = `https://www.rq.run/Dc/Api?_=User%2FRecord%2Fget_record_info&record_id=${recordId}&coordinate_id=3&student_user_id=0&group_id=0`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function (response) {
                if (response.status === 200) {
                    const jsonData = JSON.parse(response.responseText);
                    const tcxData = createTcxFromJson(jsonData);
                    const timestamp = jsonData.data.summary.training_at;
                    saveTcxFile(tcxData, timestamp);
                } else {
                    alert('Failed to fetch activity data');
                }
            }
        });
    }

    // Convert JSON data to TCX format
    function createTcxFromJson(jsonData) {
        const data = jsonData.data;
        const summary = data.summary;
        const motion = data.motion;
        const trkpt = data.trkpt;

        const doc = document.implementation.createDocument(null, 'TrainingCenterDatabase', null);
        const tcx = doc.documentElement;
        tcx.setAttribute('xmlns', 'http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2');
        tcx.setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        tcx.setAttribute('xsi:schemaLocation', 'http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd');
        tcx.setAttribute('xmlns:ns2', 'http://www.garmin.com/xmlschemas/UserProfile/v2');
        tcx.setAttribute('xmlns:ns3', 'http://www.garmin.com/xmlschemas/ActivityExtension/v2');
        tcx.setAttribute('xmlns:ns4', 'http://www.garmin.com/xmlschemas/ProfileExtension/v1');
        tcx.setAttribute('xmlns:ns5', 'http://www.garmin.com/xmlschemas/ActivityGoals/v1');

        const activities = doc.createElement('Activities');
        tcx.appendChild(activities);
        const activity = doc.createElement('Activity');
        activities.appendChild(activity);
        activity.setAttribute('Sport', 'Running');

        const idElem = doc.createElement('Id');
        activity.appendChild(idElem);
        const startTime = new Date(summary.training_at);
        idElem.textContent = startTime.toISOString();

        const lap = doc.createElement('Lap');
        activity.appendChild(lap);
        lap.setAttribute('StartTime', startTime.toISOString());

        const totalTimeSeconds = doc.createElement('TotalTimeSeconds');
        lap.appendChild(totalTimeSeconds);
        totalTimeSeconds.textContent = summary.total_time.toFixed(3);

        const distanceMeters = doc.createElement('DistanceMeters');
        lap.appendChild(distanceMeters);
        distanceMeters.textContent = motion.distance.toFixed(2);

        const maximumSpeed = doc.createElement('MaximumSpeed');
        lap.appendChild(maximumSpeed);
        const maxSpeedMps = motion.max_speed * 1000 / 3600;
        maximumSpeed.textContent = maxSpeedMps.toFixed(3);

        const calories = doc.createElement('Calories');
        lap.appendChild(calories);
        calories.textContent = motion.calorie.toString();

        const avgHr = doc.createElement('AverageHeartRateBpm');
        lap.appendChild(avgHr);
        const avgHrValue = doc.createElement('Value');
        avgHr.appendChild(avgHrValue);
        avgHrValue.textContent = motion.avg_hr.toString();

        const maxHr = doc.createElement('MaximumHeartRateBpm');
        lap.appendChild(maxHr);
        const maxHrValue = doc.createElement('Value');
        maxHr.appendChild(maxHrValue);
        maxHrValue.textContent = motion.max_hr.toString();

        const intensity = doc.createElement('Intensity');
        lap.appendChild(intensity);
        intensity.textContent = 'Active';

        const triggerMethod = doc.createElement('TriggerMethod');
        lap.appendChild(triggerMethod);
        triggerMethod.textContent = 'Manual';

        const track = doc.createElement('Track');
        lap.appendChild(track);

        trkpt.forEach(point => {
            const trackpoint = doc.createElement('Trackpoint');
            track.appendChild(trackpoint);

            const time = doc.createElement('Time');
            trackpoint.appendChild(time);
            const pointTime = new Date(startTime.getTime() + point.sec * 1000);
            time.textContent = pointTime.toISOString();

            if ('position_lat' in point && 'position_long' in point) {
                const [wgs84Lat, wgs84Lon] = bd09ToWgs84(point.position_lat, point.position_long);
                const position = doc.createElement('Position');
                trackpoint.appendChild(position);
                const latitudeDegrees = doc.createElement('LatitudeDegrees');
                position.appendChild(latitudeDegrees);
                latitudeDegrees.textContent = wgs84Lat.toFixed(15);
                const longitudeDegrees = doc.createElement('LongitudeDegrees');
                position.appendChild(longitudeDegrees);
                longitudeDegrees.textContent = wgs84Lon.toFixed(15);
            }

            if ('altitude' in point) {
                const altitudeMeters = doc.createElement('AltitudeMeters');
                trackpoint.appendChild(altitudeMeters);
                altitudeMeters.textContent = point.altitude.toFixed(1);
            }

            if ('distance' in point) {
                const distanceMeters = doc.createElement('DistanceMeters');
                trackpoint.appendChild(distanceMeters);
                distanceMeters.textContent = point.distance.toFixed(3);
            }

            if ('heart_rate' in point) {
                const hr = doc.createElement('HeartRateBpm');
                trackpoint.appendChild(hr);
                const hrValue = doc.createElement('Value');
                hr.appendChild(hrValue);
                hrValue.textContent = point.heart_rate.toString();
            }

            const extensions = doc.createElement('Extensions');
            trackpoint.appendChild(extensions);
            const tpx = doc.createElement('ns3:TPX');
            extensions.appendChild(tpx);

            if ('speed' in point) {
                const speed = doc.createElement('ns3:Speed');
                tpx.appendChild(speed);
                const speedMps = point.speed * 1000 / 3600;
                speed.textContent = speedMps.toFixed(3);
            }

            if ('cadence' in point) {
                const runCadence = doc.createElement('ns3:RunCadence');
                tpx.appendChild(runCadence);
                const runCadenceInHalf = Math.round(point.cadence / 2);
                runCadence.textContent = runCadenceInHalf.toString();
            }

            if ('power' in point) {
                const watts = doc.createElement('ns3:Watts');
                tpx.appendChild(watts);
                watts.textContent = point.power.toString();
            }
        });

        const serializer = new XMLSerializer();
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(tcx);
    }

    // Save TCX file
    function saveTcxFile(tcxData, timestamp) {
        // Convert the timestamp to a format suitable for filenames
        const filenameTimestamp = timestamp.replace(/[: ]/g, '-');
        const filename = `${filenameTimestamp}.tcx`;
        const blob = new Blob([tcxData], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }

    // Helper functions
    function bd09ToWgs84(bdLat, bdLon) {
        const xPi = Math.PI * 3000.0 / 180.0;
        const x = bdLon - 0.0065;
        const y = bdLat - 0.006;
        const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPi);
        const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPi);
        const gcjLon = z * Math.cos(theta);
        const gcjLat = z * Math.sin(theta);
        return gcj02ToWgs84(gcjLat, gcjLon);
    }

    function gcj02ToWgs84(gcjLat, gcjLon) {
        if (outOfChina(gcjLat, gcjLon)) {
            return [gcjLat, gcjLon];
        } else {
            const [dlat, dlon] = delta(gcjLat, gcjLon);
            return [gcjLat - dlat, gcjLon - dlon];
        }
    }

    function outOfChina(lat, lon) {
        return !(73.66 < lon && lon < 135.05 && 3.86 < lat && lat < 53.55);
    }

    function delta(lat, lon) {
        const a = 6378245.0;
        const ee = 0.00669342162296594323;
        const dlat = transformLat(lon - 105.0, lat - 35.0);
        const dlon = transformLon(lon - 105.0, lat - 35.0);
        const radLat = lat / 180.0 * Math.PI;
        const magic = Math.sin(radLat);
        const sqrtMagic = Math.sqrt(1 - ee * magic * magic);
        const dLat = (dlat * 180.0) / ((a * (1 - ee)) / (sqrtMagic * sqrtMagic * sqrtMagic) * Math.PI);
        const dLon = (dlon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * Math.PI);
        return [dLat, dLon];
    }

    function transformLat(x, y) {
        let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(y * Math.PI) + 40.0 * Math.sin(y / 3.0 * Math.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(y / 12.0 * Math.PI) + 320 * Math.sin(y * Math.PI / 30.0)) * 2.0 / 3.0;
        return ret;
    }

    function transformLon(x, y) {
        let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
        ret += (20.0 * Math.sin(6.0 * x * Math.PI) + 20.0 * Math.sin(2.0 * x * Math.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(x * Math.PI) + 40.0 * Math.sin(x / 3.0 * Math.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(x / 12.0 * Math.PI) + 300.0 * Math.sin(x / 30.0 * Math.PI)) * 2.0 / 3.0;
        return ret;
    }

    // Initialize
    addExportButton();
    checkForUpdates();
})();
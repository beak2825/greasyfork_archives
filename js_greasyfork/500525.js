    // ==UserScript==
    // @name         图寻pro插件(tuxun)
    // @namespace    https://tuxun.fun/
    // @version      1.1
    // @description  按3显示当前位置国家位置信息，新增每次点击显示距离正确地点的距离
    // @author       lemures
    // @match        https://tuxun.fun/*
    // @icon         https://s2.loli.net/2024/01/17/4nqsveVoH8A1mTB.png
    // @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/500525/%E5%9B%BE%E5%AF%BBpro%E6%8F%92%E4%BB%B6%28tuxun%29.user.js
// @updateURL https://update.greasyfork.org/scripts/500525/%E5%9B%BE%E5%AF%BBpro%E6%8F%92%E4%BB%B6%28tuxun%29.meta.js
    // ==/UserScript==

    (function() {
        'use strict';
        var currentLatitude = null;
        var currentLongitude = null;
        var newCoords;
        var randomDistance;
        var randomBearing;
        var realSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(value) {
            this.addEventListener("load", function() {
                var url = this._url;
                if (url.includes('https://tuxun.fun/api/v0/tuxun/mapProxy/getGooglePanoInfoPost')) {
                    handleGooglePanoInfo(this.responseText);
                } else if (url.includes('https://tuxun.fun/api/v0/tuxun/mapProxy/getPanoInfo?pano=')) {
                    handlePanoInfo(this.responseText);
                }
            }, false);
            realSend.call(this, value);
        };

        XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            this._url = url;
            this.realOpen(method, url, async, user, pass);
        };

function createButtons() {
    var buttonContainer = document.createElement('div');
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '50px';
    buttonContainer.style.left = '20px';
    buttonContainer.style.zIndex = '10000';
    buttonContainer.style.display = 'flex';
    buttonContainer.style.flexDirection = 'column';
    document.body.appendChild(buttonContainer);

    var buttonsInfo = [
        /*{ text: '一键5K', action: () => simulateKeyPress('1'), bgColor: '#4CAF50', textColor: '#FFFFFF' },
        { text: '智能偏移', action: () => simulateKeyPress('2'), bgColor: '#008CBA', textColor: '#FFFFFF' },*/
        { text: '信息提示', action: () => simulateKeyPress('3'), bgColor: '#f44336', textColor: '#FFFFFF' },
        { text: '距离显示', action: toggleDistanceDisplay, bgColor: '#555555', textColor: '#FFFFFF' } // 新添加的按钮
    ];

    buttonsInfo.forEach(function(info) {
        var button = document.createElement('button');
        button.textContent = info.text;
        button.style.backgroundColor = info.bgColor;
        button.style.color = info.textColor;
        button.style.marginBottom = '5px';
        button.style.borderRadius = '5px';
        button.onclick = info.action;
        buttonContainer.appendChild(button);
    });
}

var distanceDisplayEnabled = false;

function toggleDistanceDisplay() {
    distanceDisplayEnabled = !distanceDisplayEnabled;
    showAlert(`距离显示${distanceDisplayEnabled ? '打开' : '关闭'}`);
    if (distanceDisplayEnabled) {
        XMLHttpRequest.prototype.realSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(value) {
            this.addEventListener("load", function() {
                if (this._url.includes('/pin?')) {
                    const params = new URLSearchParams(this._url.split('?')[1]);
                    const pinLat = parseFloat(params.get('lat'));
                    const pinLng = parseFloat(params.get('lng'));
                    const distance = calculateDistance(pinLat, pinLng, currentLatitude, currentLongitude);

                    showAlert(`距离正确位置: ${distance.toFixed(2)} km`);
                }
            }, false);
            XMLHttpRequest.prototype.realSend.call(this, value);
        };
    } else {
        XMLHttpRequest.prototype.send = XMLHttpRequest.prototype.realSend;
    }
}


function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径km
    const dLat = toRadians(lat2-lat1);
    const dLon = toRadians(lon2-lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

createButtons();



        function simulateKeyPress(key) {
            var event = new KeyboardEvent('keydown', { key: key });
            document.dispatchEvent(event);
        }

        createButtons();

        document.addEventListener('keydown', function(event) {
            if (event.key === '') {
                randomDistance = 10 + Math.random() * 90;
                randomBearing = Math.random() * 360;
                newCoords = calculateNewCoords(currentLatitude, currentLongitude, randomDistance, randomBearing);
                guess(newCoords.latitude, newCoords.longitude);
            } else if (event.key === '') {
                generateNonSeaCoordinate();
            } else if (event.key === '3') {
                if (currentLatitude && currentLongitude) {
                    getAddressFromApi(currentLatitude, currentLongitude)
                        .then(addressInfo => {
                            if (addressInfo) {
                                showAlert(`${addressInfo.county}, ${addressInfo.state},${addressInfo.country}`);
                            } else {
                                showAlert('未能获取有效的地址信息');
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            showAlert('发生错误');
                        });
                } else {
                    showAlert('未能获取有效的经纬度');
                }
            }
        });

        function generateNonSeaCoordinate() {
            randomDistance = 20000 + Math.random() * 200000;
            randomBearing = Math.random() * 360;
            newCoords = calculateNewCoords(currentLatitude, currentLongitude, randomDistance, randomBearing);
            isCoordinateOnLand(newCoords.latitude, newCoords.longitude, function(isOnLand) {
                if (isOnLand) {
                    guess(newCoords.latitude, newCoords.longitude);
                } else {
                    generateNonSeaCoordinate();
                }
            });
        }

        function isCoordinateOnLand(latitude, longitude, callback) {
            try {
                var apiUrl = 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + latitude + '&lon=' + longitude + '&addressdetails=1';
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        callback(!!data.address);
                    })
                    .catch(error => {
                        console.error('Error checking land:', error);
                        callback(false);
                    });
            } catch (error) {
                console.error('Error checking land:', error);
                callback(false);
            }
        }

        function handleGooglePanoInfo(responseText) {
            const coordinatePattern = /\[\[null,null,(-?\d+\.\d+),(-?\d+\.\d+)\],\[\d+\.\d+\],\[\d+\.\d+,\d+\.\d+,\d+\.\d+\]\]|\[\s*null,\s*null,\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\s*\]/;
            const matches = coordinatePattern.exec(responseText);
            if (matches) {
                currentLatitude = parseFloat(matches[1] || matches[3]);
                currentLongitude = parseFloat(matches[2] || matches[4]);
            }
        }

        function handlePanoInfo(responseText) {
            try {
                const data = JSON.parse(responseText);
                const lat = data?.data?.lat;
                const lng = data?.data?.lng;

                if (lat && lng) {
                    currentLatitude = parseFloat(lat);
                    currentLongitude = parseFloat(lng);
                }
            } catch (error) {
                console.error('Error parsing PanoInfo JSON:', error);
            }
        }

        function getAddressFromApi(latitude, longitude) {
            return new Promise((resolve, reject) => {
                const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`;

                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        const addressInfo = {
                            county: data?.address?.county || '',
                            state: data?.address?.state || '',
                            country: data?.address?.country || ''
                        };

                        resolve(addressInfo);
                    })
                    .catch(error => {
                        console.error('Error fetching address:', error);
                        reject(error);
                    });
            });
        }

        function calculateNewCoords(lat, lon, distance, bearing) {
            var R = 6371e3;
            var bearingRad = toRadians(bearing);
            var distRatio = distance / R;
            var distRatioSine = Math.sin(distRatio);
            var distRatioCosine = Math.cos(distRatio);
            var startLatRad = toRadians(lat);
            var startLonRad = toRadians(lon);

            var startLatCos = Math.cos(startLatRad);
            var startLatSin = Math.sin(startLatRad);

            var endLatRads = Math.asin((startLatSin * distRatioCosine) + (startLatCos * distRatioSine * Math.cos(bearingRad)));

            var endLonRads = startLonRad + Math.atan2(Math.sin(bearingRad) * distRatioSine * startLatCos, distRatioCosine - startLatSin * Math.sin(endLatRads));

            return {
                latitude: toDegrees(endLatRads),
                longitude: toDegrees(endLonRads)
            };
        }

        function toDegrees(radians) {
            return radians * 180 / Math.PI;
        }

        async function guess(latitude, longitude) {
            let gameId;

            if (window.location.href.includes('https://tuxun.fun/challenge/')) {
                gameId = await getGameIdFromChallengeURL();
            } else {
                gameId = getGameIdFromURL();
            }

            if (latitude && longitude && gameId) {
                let apiEndpoint, guessURL;

                if (window.location.href.includes('https://tuxun.fun/challenge/')) {
                    apiEndpoint = 'challenge/guess';
                } else if (window.location.href.includes('streak_game')) {
                    apiEndpoint = 'streak/guess';
                } else {
                    apiEndpoint = 'solo/guess';
                }

                guessURL = `https://tuxun.fun/api/v0/tuxun/${apiEndpoint}?gameId=${gameId}&lng=${longitude}&lat=${latitude}`;

                try {
                    const response = await fetch(guessURL);
                    showAlert('猜测成功！');
                } catch (error) {
                    console.error('Error making guess:', error);
                    showAlert('猜测失败，请重试。');
                }
            } else {
                showAlert('未能获取有效的经纬度或游戏ID');
            }
        }

        async function getGameIdFromChallengeURL() {
            const challengePattern = /tuxun\.fun\/challenge\/([a-f\d-]+)/;
            const matches = challengePattern.exec(window.location.href);
            const challengeId = matches && matches.length > 1 ? matches[1] : null;

            if (challengeId) {
                try {
                    const response = await fetch(`https://tuxun.fun/api/v0/tuxun/challenge/getGameInfo?challengeId=${challengeId}`);
                    const data = await response.json();
                    const gameId = data?.data?.id || null;
                    return gameId;
                } catch (error) {
                    console.error('Error fetching game info:', error);
                }
            }

            return null;
        }

        function getGameIdFromURL() {
            const oldUrlPattern = /tuxun\.fun\/solo_game\?gameId=([a-f\d-]+)/;
            const newUrlPattern = /tuxun\.fun\/solo\/([a-f\d-]+)/;
            const streakUrlPattern = /tuxun\.fun\/streak_game\?streakId=([a-f\d-]+)/;

            let matches = oldUrlPattern.exec(window.location.href);
            if (matches && matches.length > 1) {
                return matches[1];
            }

            matches = newUrlPattern.exec(window.location.href);
            if (matches && matches.length > 1) {
                return matches[1];
            }

            matches = streakUrlPattern.exec(window.location.href);
            if (matches && matches.length > 1) {
                return matches[1];
            }

            return null;
        }

        function showAlert(message) {
            var alertBox = document.createElement('div');
            alertBox.style.position = 'fixed';
            alertBox.style.top = '50%';
            alertBox.style.left = '50%';
            alertBox.style.transform = 'translate(-50%, -50%)';
            alertBox.style.padding = '20px';
            alertBox.style.borderRadius = '10px';
            alertBox.style.backdropFilter = 'blur(20px)';
            alertBox.style.background = 'rgba(94, 94, 94, 0.7)';
            alertBox.style.zIndex = '9999';
            alertBox.textContent = message;
            alertBox.style.color = 'white';
            alertBox.style.fontSize = '18px';

            document.body.appendChild(alertBox);

            setTimeout(function() {
                document.body.removeChild(alertBox);
            }, 2000);
        }

    })();


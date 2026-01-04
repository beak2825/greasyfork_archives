// ==UserScript==
// @name         (kiritz🦊 0.25a)
// @namespace    http://tampermonkey.net/
// @version      25
// @description  kiritz🦊 tip💡: флаг+город, лиса, автогесс, карты, полная инфа + пинг/лосс до geoguessr
// @author       kiritz🦊
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532218/%28kiritz%F0%9F%A6%8A%20025a%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532218/%28kiritz%F0%9F%A6%8A%20025a%29.meta.js
// ==/UserScript==

let globalCoordinates = { lat: 0, lng: 0 };
let autoGuessEnabled = false;
let foxMarker = null;
let fullInfoVisible = false;
let fullInfoInterval = null;
let testBoxVisible = false;
let testBox = null;

// Перехват координат
var originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
    if (method.toUpperCase() === 'POST' &&
        (url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata') ||
         url.startsWith('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch'))) {
        this.addEventListener('load', function () {
            let interceptedResult = this.responseText;
            const pattern = /-?\d+\.\d+,-?\d+\.\d+/g;
            let match = interceptedResult.match(pattern)?.[0];
            if (!match) return;
            let split = match.split(",");
            globalCoordinates.lat = parseFloat(split[0]);
            globalCoordinates.lng = parseFloat(split[1]);
            if (autoGuessEnabled) {
                placePinMarker();
            }
        });
    }
    return originalOpen.apply(this, arguments);
};

// Лиса
function addFoxMarker(lat, lng) {
    const element = document.querySelector('[class^="guess-map_canvas__"]');
    if (!element || !window.google) return;

    if (foxMarker) foxMarker.setMap(null);

    const reactKey = Object.keys(element).find(k => k.startsWith("__reactFiber$"));
    const map = element[reactKey]?.return?.return?.memoizedProps?.map;
    if (!map) return;

    const foxIcon = {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><text x="0" y="30" font-size="30">🦊</text></svg>`),
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
    };

    foxMarker = new google.maps.Marker({ position: { lat, lng }, map, icon: foxIcon });
    setTimeout(() => { if (foxMarker) foxMarker.setMap(null); foxMarker = null; }, 10000);
}

// Автогесс
function placePinMarker() {
    const { lat, lng } = globalCoordinates;
    let element = document.querySelector('[class^="guess-map_canvas__"]');
    if (!element) return;

    const latLngFns = { latLng: { lat: () => lat, lng: () => lng } };
    const reactKey = Object.keys(element).find(k => k.startsWith("__reactFiber$"));
    const mapElementProps = element[reactKey];
    const mapElementClick = mapElementProps.return.return.memoizedProps.map.__e3_.click;
    const mapElementPropKey = Object.keys(mapElementClick)[0];
    const mapClickProps = mapElementClick[mapElementPropKey];

    for (let key of Object.keys(mapClickProps)) {
        if (typeof mapClickProps[key] === "function") {
            mapClickProps[key](latLngFns);
        }
    }
}

// Мини-инфо
function showLocationInfo(countryName, countryCode, cityName) {
    let box = document.getElementById("location-info-box");
    if (!box) {
        box = document.createElement("div");
        box.id = "location-info-box";
        box.style.cssText = "position:absolute;top:100px;left:20px;z-index:9999;padding:10px 15px;background:rgba(0,0,0,0.85);color:white;font-size:16px;border-radius:8px;font-weight:bold;font-family:Arial,sans-serif;display:flex;align-items:center;gap:10px;";
        document.body.appendChild(box);
    }

    const flagUrl = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
    box.innerHTML = `
        <span>kiritz🦊 tip💡:</span>
        <img src="${flagUrl}" alt="${countryCode}" style="width:30px;height:auto;border-radius:4px;">
        <span>страна: ${countryName}</span>
        <span>город: ${cityName || "--"}</span>
    `;
    setTimeout(() => box.remove(), 5000);
}

// Google Maps
function openInGoogleMaps(lat, lng) {
    const url = `https://maps.google.com/?q=${lat},${lng}&ll=${lat},${lng}&z=5`;
    window.open(url, "_blank");
}

// Полная инфа
function toggleFullInfoBox() {
    if (fullInfoVisible) {
        document.getElementById("full-info-box")?.remove();
        clearInterval(fullInfoInterval);
        fullInfoVisible = false;
        return;
    }

    const box = document.createElement("div");
    box.id = "full-info-box";
    box.style.cssText = "position:absolute;top:240px;left:20px;z-index:9999;padding:12px 15px;background:rgba(0,0,0,0.9);color:white;font-size:15px;border-radius:10px;font-family:Arial,sans-serif;white-space:pre-wrap;line-height:1.5;max-width:320px;cursor:move;";
    document.body.appendChild(box);
    fullInfoVisible = true;

    makeDraggable(box);

    const update = () => {
        const { lat, lng } = globalCoordinates;
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
            .then(res => res.json())
            .then(data => {
                const addr = data.address || {};
                const country = addr.country || "--";
                const code = addr.country_code || "xx";
                const state = addr.state || "--";
                const city = addr.city || addr.town || addr.village || "--";
                const road = addr.road || "--";
                const flagUrl = `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
                const link = `https://maps.google.com/?q=${lat},${lng}&ll=${lat},${lng}&z=5`;

                const pingStart = performance.now();
                const pingPromise = fetch("https://www.geoguessr.com", { mode: "no-cors" })
                    .then(() => performance.now() - pingStart)
                    .catch(() => -1);

                pingPromise.then(ping => {
                    const loss = ping < 0 ? 100 : 0;
                    const pingDisplay = ping < 0 ? "нет ответа" : `${Math.round(ping)}ms`;
                    box.innerHTML = `
<img src="${flagUrl}" style="width:30px;height:auto;vertical-align:middle;border-radius:4px;">
страна: ${country}
область: ${state}
город: ${city}
улица: ${road}
широта: ${lat.toFixed(5)}
долгота: ${lng.toFixed(5)}
<a href="${link}" target="_blank" style="color:#87cefa;text-decoration:underline;">🗺️ссылка</a>

ping: ${pingDisplay}
loss: ${loss}%
~обновление 5 сек
`;
                });
            })
            .catch(() => {
                box.innerText = "Ошибка загрузки данных...";
            });
    };

    update();
    fullInfoInterval = setInterval(update, 5000);
}

// Перетаскивание окна
function makeDraggable(element) {
    let isDown = false, offset = [0, 0];
    element.addEventListener("mousedown", function (e) {
        isDown = true;
        offset = [element.offsetLeft - e.clientX, element.offsetTop - e.clientY];
    }, true);
    document.addEventListener("mouseup", () => isDown = false, true);
    document.addEventListener("mousemove", function (e) {
        e.preventDefault();
        if (isDown) {
            element.style.left = (e.clientX + offset[0]) + "px";
            element.style.top = (e.clientY + offset[1]) + "px";
        }
    }, true);
}

// Кнопка 0 - Открыть/Закрыть окно с текстом
function toggleTestBox() {
    if (testBoxVisible) {
        testBox.remove();
        testBoxVisible = false;
    } else {
        testBox = document.createElement("div");
        testBox.id = "test-box";
        testBox.innerHTML = `
🦊🦊 ИНФО🦊🦊 <br><br>
1️⃣ - показывает флаг страны, страна, город <br>
<img src="https://i.imgur.com/KKB0pz7.png" alt="Flag Info" style="width: auto; height: auto;"><br>
2️⃣ - ставит лису на карте (5000 гесс) <br>
<img src="https://i.imgur.com/qMWst90.png" alt="Fox Marker" style="width: auto; height: auto;"><br>
3️⃣ - открывает Google Maps с гессом <br>
4️⃣ - автогесс 5000 <br><br>
5️⃣ - отладка (полная информация о месте, пинг) <br>
0️⃣ - ИНФО (открыть/закрыть) <br><br>
версия v0.25a <br>
работают почти все режимы <br>
в батлрофль кантрис работает только 1️⃣,3️⃣ и 5️⃣. <br>
будешь читерить пизды получишь<br>
<img src="https://i.pinimg.com/originals/37/a7/a1/37a7a10382550c1cf67461f0b84aeefb.gif" alt="Info GIF" style="width: auto; height: auto;">
        `;
        testBox.style.cssText = "position:absolute;top:300px;left:20px;z-index:9999;padding:10px 15px;background:rgba(0,0,0,0.85);color:white;font-size:16px;border-radius:8px;font-weight:bold;font-family:Arial,sans-serif;white-space:pre-wrap;line-height:1.5;";
        document.body.appendChild(testBox);
        testBoxVisible = true;
        makeDraggable(testBox);
    }
}

// Горячие клавиши
window.addEventListener("keydown", (e) => {
    const { lat, lng } = globalCoordinates;
    if (!lat || !lng) return;
    e.stopImmediatePropagation();
    switch (e.keyCode) {
        case 49: showLocationInfoFromCoords(lat, lng); break; // 1
        case 50: addFoxMarker(lat, lng); break; // 2
        case 51: openInGoogleMaps(lat, lng); break; // 3
        case 52: placePinMarker(); break; // 4
        case 53: toggleFullInfoBox(); break; // 5
        case 48: toggleTestBox(); break; // 0
    }
}, true);

// Для клавиши 1
function showLocationInfoFromCoords(lat, lng) {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then(res => res.json())
        .then(data => {
            const country = data.address?.country || "--";
            const countryCode = data.address?.country_code || "xx";
            const city = data.address?.city || data.address?.town || data.address?.village || "--";
            showLocationInfo(country, countryCode, city);
        })
        .catch(() => showLocationInfo("Ошибка", "xx", "--"));
}

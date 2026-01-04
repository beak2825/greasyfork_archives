// ==UserScript==
// @name         WAZEPT Livemap Routes
// @namespace    http://tampermonkey.net/
// @version      2025.05.18
// @description  Displays the toll price, the number of alerts and jams (and the total length of jams) for the alternative routes on the Waze Live Map.
// @author       J0N4S13
// @include      /^https:\/\/www.waze.com\/.*live-map/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536008/WAZEPT%20Livemap%20Routes.user.js
// @updateURL https://update.greasyfork.org/scripts/536008/WAZEPT%20Livemap%20Routes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imgSpeed = 'data:image/png;base64,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';
    const imgToll = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzIgMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+Cgk8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfNzQzN18zNDA1KSI+CgkJPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAxXzc0MzdfMzQwNSkiPgoJCQk8cGF0aAoJCQkJZD0iTTEgNEMxIDQuNzQwMjggMS40MDIyIDUuMzg2NjMgMiA1LjczMjQ0TDIgMjMuNzY0MUMxLjM4NzMxIDI0LjMxMjUgMSAyNS4xMTA3IDEgMjZWMjhDMSAyOS42NTY5IDIuMzQzMTUgMzEgNCAzMUgxOEMxOS42NTY5IDMxIDIxIDI5LjY1NjkgMjEgMjhWMjZDMjEgMjUuMTEwNyAyMC42MTI3IDI0LjMxMjUgMjAgMjMuNzY0MVYyM0gyNkMyOC43NjE0IDIzIDMxIDIwLjc2MTQgMzEgMThDMzEgMTUuMjM4NiAyOC43NjE0IDEzIDI2IDEzSDIwVjUuNzMyNDRDMjAuNTk3OCA1LjM4NjYzIDIxIDQuNzQwMjggMjEgNFYzQzIxIDEuODk1NDMgMjAuMTA0NiAxIDE5IDFIM0MxLjg5NTQzIDEgMSAxLjg5NTQzIDEgM1Y0WiIKCQkJCWZpbGw9IndoaXRlIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIC8+CgkJCTxwYXRoCgkJCQlkPSJNMyAyNkMzIDI1LjQ0NzcgMy40NDc3MiAyNSA0IDI1SDE4QzE4LjU1MjMgMjUgMTkgMjUuNDQ3NyAxOSAyNlYyOEMxOSAyOC41NTIzIDE4LjU1MjMgMjkgMTggMjlINEMzLjQ0NzcyIDI5IDMgMjguNTUyMyAzIDI4VjI2WiIKCQkJCWZpbGw9IiM1NTU5NUUiIC8+CgkJCTxwYXRoCgkJCQlkPSJNNiAzQzQuODk1NDMgMyA0IDMuODk1NDMgNCA1VjI1SDE4VjIxSDExQzkuMzQzMTUgMjEgOCAxOS42NTY5IDggMThDOCAxNi4zNDMxIDkuMzQzMTUgMTUgMTEgMTVIMThWNUMxOCAzLjg5NTQzIDE3LjEwNDYgMyAxNiAzSDZaIgoJCQkJZmlsbD0iI0I3QkFCRiIgLz4KCQkJPHBhdGggZD0iTTEyIDE2SDE1TDEyIDIwSDlMMTIgMTZaIiBmaWxsPSIjRkY1MjUyIiAvPgoJCQk8cGF0aCBkPSJNMTggMTZIMjFMMTggMjBIMTVMMTggMTZaIiBmaWxsPSIjRkY1MjUyIiAvPgoJCQk8cGF0aCBkPSJNMjcgMTZIMjRMMjEgMjBIMjRMMjcgMTZaIiBmaWxsPSIjRkY1MjUyIiAvPgoJCQk8cGF0aAoJCQkJZD0iTTggN0M3LjQ0NzcyIDcgNyA3LjQ0NzcyIDcgOFYxMUM3IDExLjU1MjMgNy40NDc3MiAxMiA4IDEySDE0QzE0LjU1MjMgMTIgMTUgMTEuNTUyMyAxNSAxMVY4QzE1IDcuNDQ3NzIgMTQuNTUyMyA3IDE0IDdIOFoiCgkJCQlmaWxsPSJibGFjayIgLz4KCQkJPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiCgkJCQlkPSJNMyAyQzIuNDQ3NzIgMiAyIDIuNDQ3NzIgMiAzVjRDMiA0LjU1MjI4IDIuNDQ3NzIgNSAzIDVWMjQuMjY3NkMyLjQwMjIgMjQuNjEzNCAyIDI1LjI1OTcgMiAyNlYyOEMyIDI5LjEwNDYgMi44OTU0MyAzMCA0IDMwSDE4QzE5LjEwNDYgMzAgMjAgMjkuMTA0NiAyMCAyOFYyNkMyMCAyNS4yNTk3IDE5LjU5NzggMjQuNjEzNCAxOSAyNC4yNjc2VjIySDI2QzI4LjIwOTEgMjIgMzAgMjAuMjA5MSAzMCAxOEMzMCAxNS43OTA5IDI4LjIwOTEgMTQgMjYgMTRIMTlWNUMxOS41NTIzIDUgMjAgNC41NTIyOCAyMCA0VjNDMjAgMi40NDc3MiAxOS41NTIzIDIgMTkgMkgzWk0xNyA1SDVWMjRIMTdWMjJIMTFDOC43OTA4NiAyMiA3IDIwLjIwOTEgNyAxOEM3IDE1Ljc5MDkgOC43OTA4NiAxNCAxMSAxNEgxN1Y1Wk00IDI2VjI4SDE4VjI2SDRaTTExIDE2QzkuODk1NDMgMTYgOSAxNi44OTU0IDkgMThDOSAxOS4xMDQ2IDkuODk1NDMgMjAgMTEgMjBIMjZDMjcuMTA0NiAyMCAyOCAxOS4xMDQ2IDI4IDE4QzI4IDE2Ljg5NTQgMjcuMTA0NiAxNiAyNiAxNkgxMVoiCgkJCQlmaWxsPSJibGFjayIgLz4KCQk8L2c+Cgk8L2c+Cgk8ZGVmcz4KCQk8Y2xpcFBhdGggaWQ9ImNsaXAwXzc0MzdfMzQwNSI+CgkJCTxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIC41OTdoMzJ2MzJIMHoiIC8+CgkJPC9jbGlwUGF0aD4KCQk8Y2xpcFBhdGggaWQ9ImNsaXAxXzc0MzdfMzQwNSI+CgkJCTxwYXRoIGZpbGw9IiNmZmYiIGQ9Ik0wIC41OTdoMzJ2MzJIMHoiIC8+CgkJPC9jbGlwUGF0aD4KCTwvZGVmcz4KPC9zdmc+';
    const imgAlert = 'data:image/png;base64,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';
    const imgJam = 'data:image/png;base64,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';
    const imgArea = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMzIgMzIiPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEgewogICAgICAgIGNsaXAtcGF0aDogdXJsKCNjbGlwcGF0aCk7CiAgICAgIH0KCiAgICAgIC5jbHMtMiB7CiAgICAgICAgZmlsbDogbm9uZTsKICAgICAgfQoKICAgICAgLmNscy0yLCAuY2xzLTMsIC5jbHMtNCwgLmNscy01LCAuY2xzLTYsIC5jbHMtNywgLmNscy04IHsKICAgICAgICBzdHJva2Utd2lkdGg6IDBweDsKICAgICAgfQoKICAgICAgLmNscy0zIHsKICAgICAgICBmaWxsOiAjZTQyODI4OwogICAgICB9CgogICAgICAuY2xzLTMsIC5jbHMtOCB7CiAgICAgICAgZmlsbC1ydWxlOiBldmVub2RkOwogICAgICB9CgogICAgICAuY2xzLTkgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgICAgc3Ryb2tlOiAjZmZmOwogICAgICAgIHN0cm9rZS13aWR0aDogMnB4OwogICAgICB9CgogICAgICAuY2xzLTQgewogICAgICAgIGZpbGw6ICNiN2JhYmY7CiAgICAgIH0KCiAgICAgIC5jbHMtNSB7CiAgICAgICAgZmlsbDogI2ZmOGY4ZjsKICAgICAgfQoKICAgICAgLmNscy02IHsKICAgICAgICBmaWxsOiAjZThlYWVkOwogICAgICB9CgogICAgICAuY2xzLTcgewogICAgICAgIGZpbGw6ICNmY2M7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgICA8Y2xpcFBhdGggaWQ9ImNsaXBwYXRoIj4KICAgICAgPHJlY3QgY2xhc3M9ImNscy0yIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiLz4KICAgIDwvY2xpcFBhdGg+CiAgPC9kZWZzPgogIDxnIGNsYXNzPSJjbHMtMSI+CiAgICA8Zz4KICAgICAgPHBhdGggY2xhc3M9ImNscy05IiBkPSJNMSw2djIwYzAsMi43NiwyLjI0LDUsNSw1aDIwYzIuNzYsMCw1LTIuMjQsNS01VjZjMC0yLjc2LTIuMjQtNS01LTVINkMzLjI0LDEsMSwzLjI0LDEsNloiLz4KICAgICAgPHBhdGggY2xhc3M9ImNscy02IiBkPSJNNiwzaDIwYzEuNjYsMCwzLDEuMzQsMywzdjIwYzAsMS42Ni0xLjM0LDMtMywzSDZjLTEuNjYsMC0zLTEuMzQtMy0zVjZjMC0xLjY2LDEuMzQtMywzLTNaIi8+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNCIgZD0iTTI1LDRoLTJ2M2gtNXYtM2gtMnYzSDR2MmgxOXY4SDR2MmgxOXY0SDR2Mmg3djNoMnYtM2gxNXYtMmgtM3YtNGgzdi0yaC0zdi0zaDN2LTJoLTNWNFoiLz4KICAgICAgPHBhdGggY2xhc3M9ImNscy00IiBkPSJNNCwxMmg1djJoLTV2LTJaIi8+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNyIgZD0iTTgsOWMwLS41NS40NS0xLDEtMWgxNGMuNTUsMCwxLC40NSwxLDF2OGMwLC41NS0uNDUsMS0xLDFoLTQuMzhjLS4zOCwwLS43My4yMS0uODkuNTVsLTIuNDUsNC44OWMtLjE3LjM0LS41Mi41NS0uODkuNTVoLTUuMzhjLS41NSwwLTEtLjQ1LTEtMXYtMTRaIi8+CiAgICAgIDxwYXRoIGNsYXNzPSJjbHMtNSIgZD0iTTE2LDl2Mi4yOGMwLC4yMy0uMDguNDYtLjIzLjY0bC0uMDcuMDhoLTYuN3YyaDUuMDNsLTIuMzQsMi44Yy0uMDUuMDYtLjEuMTMtLjE1LjJoLTIuNTR2MmgydjRoMnYtNGg2di0yaC00Ljg2bDIuNS0zaDYuMzZ2LTJoLTUuMDljLjA2LS4yNC4wOS0uNDguMDktLjcydi0yLjI4aC0yWiIvPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTMiIGQ9Ik03LDljMC0xLjEuOS0yLDItMmgxNGMxLjEsMCwyLC45LDIsMnY4YzAsMS4xLS45LDItMiwyaC00LjM4bC0yLjQ1LDQuODljLS4zNC42OC0xLjAzLDEuMTEtMS43OSwxLjExaC01LjM4Yy0xLjEsMC0yLS45LTItMnYtMTRaTTIzLDloLTE0djE0aDUuMzhsMi40NS00Ljg5Yy4zNC0uNjgsMS4wMy0xLjExLDEuNzktMS4xMWg0LjM4di04WiIvPgogICAgICA8cGF0aCBjbGFzcz0iY2xzLTgiIGQ9Ik02LDJoMjBjMi4yMSwwLDQsMS43OSw0LDR2MjBjMCwyLjIxLTEuNzksNC00LDRINmMtMi4yMSwwLTQtMS43OS00LTRWNmMwLTIuMjEsMS43OS00LDQtNFpNNCw2djIwYzAsMS4xLjksMiwyLDJoMjBjMS4xLDAsMi0uOSwyLTJWNmMwLTEuMS0uOS0yLTItMkg2Yy0xLjEsMC0yLC45LTIsMloiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg==';

    let env = "";

    function haversine(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const toRad = x => x * Math.PI / 180;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    function totalJamLength(jams) {
        let total = 0;
        if (!Array.isArray(jams)) return 0;
        jams.forEach(jam => {
            if (Array.isArray(jam.line)) {
                for (let i = 0; i < jam.line.length - 1; i++) {
                    const p1 = jam.line[i], p2 = jam.line[i+1];
                    total += haversine(p1.y, p1.x, p2.y, p2.x);
                }
            }
        });
        return total;
    }

    const currencyData = {};
    currencyData.USD = { symbol: "$", digits: 2 };
    currencyData.EUR = { symbol: "€", digits: 2 };
    currencyData.JPY = { symbol: "¥", digits: 0 };
    currencyData.GBP = { symbol: "£", digits: 2 };
    currencyData.AUD = { symbol: "$", digits: 2 };
    currencyData.CAD = { symbol: "$", digits: 2 };
    currencyData.CHF = { symbol: "Fr.", digits: 2 };
    currencyData.CNY = { symbol: "¥", digits: 1 };
    currencyData.SEK = { symbol: "kr", digits: 2 };
    currencyData.NOK = { symbol: "kr", digits: 2 };
    currencyData.KRW = { symbol: "₩", digits: 0 };
    currencyData.INR = { symbol: "₹", digits: 2 };
    currencyData.BRL = { symbol: "R$", digits: 2 };
    currencyData.RUB = { symbol: "₽", digits: 2 };

    function formatTollPrice(price, currency){
        if(!price || !currency) return null;
        const cd = currencyData[currency];
        if(!cd) return `${price} ${currency}`;
        return `${price.toLocaleString(undefined, {
            minimumFractionDigits: cd.digits,
            maximumFractionDigits: cd.digits,
        })} ${cd.symbol}`;
    }

    const origFetch = window.fetch;

    window.fetch = function(...args) {
        if (args[0].includes("/live-map/api/user-drive")) {
            const params = new URL(args[0]).searchParams;
            env = params.get('geo_env');
        }
        return origFetch.apply(this, args).then(response => {
            if (response.url.includes("/live-map/api/user-drive")) {
                response.clone().json().then(function(data) {
                    const infoArr = [];
                    (data["alternatives"] || []).forEach(function(route, index) {
                        const tollInfo = route?.response?.tollPriceInfo;
                        const tollText = (tollInfo && Object.keys(tollInfo).length > 0)
                        ? formatTollPrice(tollInfo?.tollPrice, tollInfo?.tollPriceCurrencyCode)
                            : null;
                        const jamsArr = Array.isArray(route?.response?.jams) ? route.response.jams : [];
                        const jams = jamsArr.length;
                        let jamLength = 0.0;
                        if(jams > 0)
                        {
                            if(env == "na")
                                jamLength = (totalJamLength(jamsArr) / 1.60934);
                            else
                                jamLength = totalJamLength(jamsArr);
                        }
                        const alerts = Array.isArray(route?.response?.alerts) ? route.response.alerts.length : 0;
                        const areasArr = Array.isArray(route?.response?.areas) ? route.response.areas : [];
                        const areasText = areasArr.length > 0 ? areasArr.join(', ') : null;
                        let avarageSpeed = 0.0;
                        if(env == "na")
                            avarageSpeed = (route.response.totalLength / 1609.34) / (route.response.totalSeconds / 3600);
                        else
                            avarageSpeed = (route.response.totalLength / 1000) / (route.response.totalSeconds / 3600);

                        infoArr[index] = { tollText, jams, jamLength, alerts, areasText, avarageSpeed };
                    });

                    document.querySelectorAll('.wm-routes-item-desktop__details').forEach(function(el, idx) {
                        if (typeof infoArr[idx] !== 'undefined') {
                            if (!el.querySelector('.custom-info-div')) {
                                const infoDiv = document.createElement('div');
                                infoDiv.className = 'custom-info-div';
                                infoDiv.style.display = 'flex';
                                infoDiv.style.flexDirection = 'column'; // Para alinhar colunas e área em "stack"
                                infoDiv.style.gap = '4px';
                                infoDiv.style.marginTop = '6px';

                                // Coluna 1
                                let col1 = '';
                                col1 += `<img src="${imgAlert}" alt="Alerts" style="width:21px;height:21px;vertical-align:middle;"> <b>${infoArr[idx].alerts}</b><br>`;
                                if (infoArr[idx].jams > 0) {
                                    col1 += `<img src="${imgJam}" alt="Jams" style="width:21px;height:21px;vertical-align:middle;"> <b>${infoArr[idx].jams} (${infoArr[idx].jamLength.toFixed(2)} ${env == 'na' ? 'mi' : 'km'})</b><br>`;
                                } else {
                                    col1 += `<img src="${imgJam}" alt="Jams" style="width:21px;height:21px;vertical-align:middle;"> <b>0</b><br>`;
                                }

                                // Coluna 2
                                let col2 = '';
                                col2 += `<img src="${imgSpeed}" alt="AverageSpeed" style="width:21px;height:21px;vertical-align:middle;"> <b>${infoArr[idx].avarageSpeed.toFixed(2)} ${env == 'na' ? 'mi/h' : 'km/h'}</b><br>`;
                                if (infoArr[idx].tollText != null) {
                                    col2 += `<img src="${imgToll}" alt="Tolls" style="width:21px;height:21px;vertical-align:middle;"> <b>${infoArr[idx].tollText}</b><br>`;
                                }

                                // Montar as colunas
                                const columnsDiv = document.createElement('div');
                                columnsDiv.style.display = 'flex';
                                columnsDiv.style.gap = '20px';
                                columnsDiv.innerHTML = `
                <div style="flex:1; min-width:120px;">${col1}</div>
                <div style="flex:1; min-width:120px;">${col2}</div>
            `;
                                infoDiv.appendChild(columnsDiv);

                                // Área ocupa a largura toda, se existir
                                if (infoArr[idx].areasText) {
                                    const areaDiv = document.createElement('div');
                                    areaDiv.innerHTML = `<img src="${imgArea}" alt="Areas" style="width:21px;height:21px;vertical-align:middle;"> <b>${infoArr[idx].areasText}</b>`;
                                    infoDiv.appendChild(areaDiv);
                                }

                                el.appendChild(infoDiv);
                            }
                        }
                    });


                });
            }
            return response;
        });
    };
})();

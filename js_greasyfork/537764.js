// ==UserScript==
// @name          BF - Clima Atual
// @name:pt-BR    BF - Clima Atual
// @namespace     https://github.com/BrunoFortunatto
// @version       1.0
// @description   Mostra o clima atual, previsão de 5 dias, tema escuro automático, cidade fixa se GPS falhar, botão de atualização e alternância C/F.
// @description:pt-BR Mostra o clima atual, previsão de 5 dias, tema escuro automático, cidade fixa se GPS falhar, botão de atualização e alternância C/F.
// @author        Bruno Fortunato
// @match         *://*/*
// @grant         GM_setValue
// @grant         GM_getValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/537764/BF%20-%20Clima%20Atual.user.js
// @updateURL https://update.greasyfork.org/scripts/537764/BF%20-%20Clima%20Atual.meta.js
// ==/UserScript==

/*
 * MIT License
 *
 * Copyright (c) 2025 Bruno Fortunato
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function () {
    'use strict';

    if (window.top !== window.self) return;

    // POR FAVOR, COLOQUE SUA CHAVE DE API DO OPENWEATHERMAP AQUI!
    // Você pode obter uma chave gratuita em: https://openweathermap.org/api
    const apiKey = 'SUA_CHAVE_API_AQUI'; // <-- Substitua 'SUA_CHAVE_API_AQUI' pela sua chave real

    if (apiKey === 'SUA_CHAVE_API_AQUI' || !apiKey) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: #ffcccc; color: #cc0000; padding: 20px; border: 2px solid #cc0000;
            border-radius: 8px; font-family: sans-serif; font-size: 16px; text-align: center;
            z-index: 9999999; box-shadow: 0 4px 8px rgba(0,0,0,0.2); max-width: 80vw;
        `;
        errorDiv.innerHTML = `
            <h3>Erro no Script BF - Clima Atual</h3>
            <p>Por favor, adicione sua chave de API do OpenWeatherMap para que o script funcione corretamente.</p>
            <p>Edite o script no seu gerenciador (Tampermonkey/Greasemonkey) e substitua 'SUA_CHAVE_API_AQUI' pela sua chave.</p>
            <p>Você pode obter uma chave gratuita em: <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" style="color: #cc0000; text-decoration: underline;">openweathermap.org/api</a></p>
            <button style="margin-top: 15px; padding: 8px 15px; background: #cc0000; color: white; border: none; border-radius: 5px; cursor: pointer;">Entendi</button>
        `;
        document.body.appendChild(errorDiv);
        errorDiv.querySelector('button').addEventListener('click', () => errorDiv.remove());
        return;
    }

    const fallbackCoords = { latitude: -30.0346, longitude: -51.2177 };
    let coords = null;
    let usingFallbackCoords = false;
    let isCelsius = GM_getValue('weather_is_celsius', true);

    const CACHE_KEY_WEATHER_DATA = 'weather_data_cache';
    const CACHE_KEY_LAST_UPDATE = 'weather_last_update';
    const CACHE_KEY_COORDS_TYPE = 'weather_coords_type';
    const CACHE_EXPIRATION_MS = 5 * 60 * 1000;

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const colorPrimary = prefersDark ? '#333' : '#2196f3';
    const colorText = prefersDark ? '#eee' : '#fff';
    const colorPanel = prefersDark ? '#1c1c1c' : '#fff';
    const colorTextPanel = prefersDark ? '#eee' : '#333';
    const colorBorderLight = prefersDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const tempMaxColor = prefersDark ? '#FF8C00' : '#FF6347';
    const tempMinColor = prefersDark ? '#87CEEB' : '#4682B4';

    const style = document.createElement('style');
    style.textContent = `
        .weather-btn {
            position: fixed; bottom: 20px; right: 20px; z-index: 999999; display: flex;
            align-items: center; gap: 8px; background: ${colorPrimary}; color: ${colorText};
            padding: 8px 12px; border-radius: 10px; border: none; font-family: sans-serif;
            font-size: 14px; box-shadow: 0 6px 12px rgba(0,0,0,0.4); cursor: pointer;
            transition: background 0.2s, opacity 0.3s ease; opacity: 0.85;
        }
        .weather-btn:hover { background: #1976d2; }
        .weather-btn .weather-icon { width: 28px; height: 28px; vertical-align: middle; }
        .weather-panel {
            position: fixed; bottom: 20px; right: 20px; max-height: calc(100vh - 40px);
            overflow-y: auto; background: ${colorPanel}; color: ${colorTextPanel};
            padding: 14px 18px; border-radius: 12px; box-shadow: 0 6px 12px rgba(0,0,0,0.4);
            font-family: sans-serif; font-size: 14px; max-width: 320px; width: 92vw;
            line-height: 1.5; display: none; animation: fadeIn 0.3s ease-in-out;
            z-index: 999999; box-sizing: border-box;
        }
        @media (max-width: 480px) {
            .weather-panel { right: 15px; left: 15px; max-width: calc(100vw - 30px); width: auto; bottom: 80px; }
            .weather-btn { right: 15px; bottom: 15px; }
        }
        .refresh-btn, .unit-toggle-btn {
            display: block; margin-top: 10px; padding: 6px 12px; border-radius: 8px;
            background: ${colorPrimary}; color: ${colorText}; cursor: pointer;
            transition: background 0.2s; font-size: 14px; width: 100%; box-sizing: border-box; border: none;
        }
        .refresh-btn:hover, .unit-toggle-btn:hover { background: #1976d2; }
        .forecast {
            margin-top: 12px; display: grid; grid-template-columns: repeat(5, 1fr);
            gap: 5px; border-top: 1px solid ${colorBorderLight}; padding-top: 15px; overflow-x: auto;
        }
        .forecast-day {
            text-align: center; font-size: 12px; padding: 5px 0; display: flex;
            flex-direction: column; align-items: center; justify-content: flex-start;
            min-width: 60px; box-sizing: border-box;
        }
        .forecast-day strong { font-size: 12px; margin-bottom: 5px; opacity: 0.9; }
        .forecast-day img { width: 38px; height: 38px; margin-bottom: 5px; }
        .forecast-temp-max { font-weight: bold; color: ${tempMaxColor}; font-size: 13px; }
        .forecast-temp-min { opacity: 0.8; color: ${tempMinColor}; font-size: 12px; margin-right: 2px; }
        .forecast-temps { display: flex; align-items: center; justify-content: center; margin-top: 3px; }
        .forecast-rain-info { font-size: 10px; opacity: 0.8; margin-top: 2px; min-height: 15px; }
        .current-day-rain-info { font-size: 13px; font-weight: bold; color: ${prefersDark ? '#ADD8E6' : '#007bff'}; margin-top: 5px; }
        .weather-close-btn {
            position: absolute; top: 8px; right: 8px; background: none; border: none;
            color: ${colorTextPanel}; font-size: 18px; font-weight: bold; cursor: pointer;
            padding: 0 5px; line-height: 1; transition: color 0.2s;
        }
        .weather-close-btn:hover { color: #f00; }
        .full-forecast-link {
            display: block; margin-top: 10px; text-align: center; font-size: 13px;
            color: ${prefersDark ? '#ADD8E6' : '#007bff'}; text-decoration: underline;
            cursor: pointer; transition: color 0.2s; padding: 6px; border-top: 1px dashed ${colorBorderLight};
        }
        .full-forecast-link:hover { color: ${prefersDark ? '#87CEEB' : '#0056b3'}; }
        .wind-info, .pressure-info, .humidity-info {
            font-size: 13px; font-weight: bold; margin-top: 5px;
        }
        .wind-info.calm { color: ${prefersDark ? '#98FB98' : '#32CD32'}; }
        .wind-info.light { color: ${prefersDark ? '#ADD8E6' : '#007bff'}; }
        .wind-info.moderate { color: ${prefersDark ? '#FFD700' : '#FFA500'}; }
        .wind-info.strong { color: ${prefersDark ? '#FF4500' : '#DC143C'}; }
        .wind-info.dangerous { color: ${prefersDark ? '#FF0000' : '#8B0000'}; }

        .pressure-info.high-pressure { color: ${prefersDark ? '#98FB98' : '#32CD32'}; }
        .pressure-info.normal-pressure { color: ${prefersDark ? '#ADD8E6' : '#007bff'}; }
        .pressure-info.low-pressure { color: ${prefersDark ? '#FFD700' : '#FFA500'}; }
        .pressure-info.very-low-pressure { color: ${prefersDark ? '#FF0000' : '#8B0000'}; }
        .pressure-info.unknown-pressure { color: ${prefersDark ? '#A9A9A9' : '#808080'}; }

        .humidity-info.very-dry { color: ${prefersDark ? '#FF6347' : '#DC143C'}; }
        .humidity-info.dry { color: ${prefersDark ? '#FFD700' : '#FFA500'}; }
        .humidity-info.comfortable { color: ${prefersDark ? '#98FB98' : '#32CD32'}; }
        .humidity-info.humid { color: ${prefersDark ? '#ADD8E6' : '#007bff'}; }
        .humidity-info.very-humid { color: ${prefersDark ? '#4682B4' : '#191970'}; }
    `;
    document.head.appendChild(style);

    const button = document.createElement('button');
    button.className = 'weather-btn';
    button.innerHTML = `<img class="weather-icon" src="https://openweathermap.org/img/wn/01d.png" alt="Carregando"> <span class="weather-text">Carregando...</span>`;

    const panel = document.createElement('div');
    panel.className = 'weather-panel';
    const refreshButton = document.createElement('button');
    refreshButton.className = 'refresh-btn';
    refreshButton.textContent = '🔄 Atualizar';
    refreshButton.disabled = true;

    const unitToggleButton = document.createElement('button');
    unitToggleButton.className = 'unit-toggle-btn';
    unitToggleButton.textContent = `Mudar para ${isCelsius ? 'Fahrenheit' : 'Celsius'}`;
    const weatherDetailsContainer = document.createElement('div');
    weatherDetailsContainer.className = 'weather-details-container';

    const closeButton = document.createElement('button');
    closeButton.className = 'weather-close-btn';
    closeButton.innerHTML = '&times;';
    closeButton.title = 'Fechar';
    const fullForecastLink = document.createElement('a');
    fullForecastLink.className = 'full-forecast-link';
    fullForecastLink.textContent = 'Ver previsão completa no OpenWeatherMap';
    fullForecastLink.target = '_blank';
    fullForecastLink.rel = 'noopener noreferrer';

    panel.append(closeButton, weatherDetailsContainer, refreshButton, unitToggleButton, fullForecastLink);
    document.body.append(button, panel);

    const closeWeatherPanel = () => panel.style.display = 'none';
    button.addEventListener('click', () => panel.style.display = panel.style.display === 'block' ? 'none' : 'block');
    closeButton.addEventListener('click', closeWeatherPanel);
    document.addEventListener('click', (event) => {
        if (panel.style.display === 'block' && !button.contains(event.target) && !panel.contains(event.target)) {
            closeWeatherPanel();
        }
    });

    const handleRefreshOrUnitToggle = async (isUnitToggle = false) => {
        if (!coords) {
            console.warn("Coordenadas não disponíveis, usando fallback.");
            coords = fallbackCoords;
            usingFallbackCoords = true;
        }
        refreshButton.textContent = '⏳ Atualizando...';
        refreshButton.disabled = true;
        unitToggleButton.disabled = true;
        try {
            await updateWeather(coords.latitude, coords.longitude);
        } catch (error) {
            console.error(`Erro ao ${isUnitToggle ? 'alternar unidade' : 'atualizar'} clima:`, error);
            weatherDetailsContainer.innerHTML = `
                <p style="color: red; text-align: center; padding: 10px;">
                    Não foi possível ${isUnitToggle ? 'alterar a unidade' : 'atualizar o clima'}.
                    <br>Verifique sua conexão ou tente novamente mais tarde.
                    <br>Detalhes: ${error.message}
                </p>`;
            panel.style.height = 'auto';
        } finally {
            refreshButton.textContent = '🔄 Atualizar';
            refreshButton.disabled = false;
            unitToggleButton.disabled = false;
        }
    };

    refreshButton.addEventListener('click', handleRefreshOrUnitToggle);
    unitToggleButton.addEventListener('click', () => {
        isCelsius = !isCelsius;
        GM_setValue('weather_is_celsius', isCelsius);
        unitToggleButton.textContent = `Mudar para ${isCelsius ? 'Fahrenheit' : 'Celsius'}`;
        handleRefreshOrUnitToggle(true);
    });

    const formatTime = (unix) => new Date(unix * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const convertTemp = (temp) => isCelsius ? temp : (temp * 9/5) + 32;
    const getUnitSymbol = () => isCelsius ? '°C' : '°F';

    const getWindDirectionCardinal = (degrees) => {
        const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return directions[Math.round((degrees % 360) / 22.5)];
    };

    const getHumidityFeedback = (humidityPercent) => {
        if (humidityPercent < 30) return { description: 'Ar Muito Seco', className: 'very-dry' };
        if (humidityPercent < 50) return { description: 'Ar Seco', className: 'dry' };
        if (humidityPercent < 70) return { description: 'Umidade Confortável', className: 'comfortable' };
        if (humidityPercent < 85) return { description: 'Ar Úmido', className: 'humid' };
        return { description: 'Ar Muito Úmido/Saturado', className: 'very-humid' };
    };

    const getWindFeedback = (speedKmH) => {
        if (speedKmH < 1) return { description: 'Vento Calmo', className: 'calm' };
        if (speedKmH < 6) return { description: 'Vento Muito Leve', className: 'light' };
        if (speedKmH < 12) return { description: 'Vento Leve', className: 'light' };
        if (speedKmH < 20) return { description: 'Vento Moderado', className: 'moderate' };
        if (speedKmH < 29) return { description: 'Vento Forte', className: 'strong' };
        if (speedKmH < 39) return { description: 'Vento Muito Forte', className: 'strong' };
        if (speedKmH < 50) return { description: 'Vento Perigoso! Cuidado!', className: 'dangerous' };
        return { description: 'Vento Tempestuoso! Alerta!', className: 'dangerous' };
    };

    const getPressureFeedback = (pressureHPa, humidity, clouds, hasRainToday) => {
        let description = 'Pressão: Dado indisponível ou incomum.';
        let className = 'unknown-pressure';
        if (pressureHPa >= 1022) {
            description = 'Pressão Alta: Tempo estável, céu claro.';
            className = 'high-pressure';
            if (humidity > 70 || clouds > 60) {
                description = 'Pressão Alta: Tempo estável, mas pode ter umidade ou nuvens.';
                className = 'normal-pressure';
            }
        } else if (pressureHPa >= 1013 && pressureHPa < 1022) {
            description = 'Pressão Normal: Tempo geralmente bom.';
            className = 'normal-pressure';
            if (hasRainToday || humidity > 75 || clouds > 70) {
                description = 'Pressão Normal: Possibilidade de tempo instável.';
                className = 'low-pressure';
            }
        } else if (pressureHPa >= 1005 && pressureHPa < 1013) {
            description = 'Pressão Baixa: Possibilidade de tempo instável e chuva.';
            className = 'low-pressure';
            if (hasRainToday || humidity > 80 || clouds > 80) {
                description = 'Pressão Baixa: Risco elevado de chuva e tempo adverso!';
                className = 'very-low-pressure';
            }
        } else if (pressureHPa < 1005) {
            description = 'Pressão Muito Baixa: Alto risco de chuva e tempestades!';
            className = 'very-low-pressure';
            if (!hasRainToday && humidity < 70 && clouds < 50) {
                description = 'Pressão Muito Baixa: Fique atento, tempo pode piorar.';
                className = 'dangerous';
            }
        }
        return { description, className };
    };

    async function fetchForecast(lat, lon) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Erro HTTP na previsão! Status: ${res.status}`);
            const data = await res.json();

            const daily = {};
            let currentDayRainPeriods = { morning: false, afternoon: false, night: false };
            let hasRainToday = false;
            let firstDateString = null;

            data.list.forEach(item => {
                const date = item.dt_txt.split(' ')[0];
                const weatherId = item.weather[0].id;
                const weatherIcon = item.weather[0].icon;
                const hour = new Date(item.dt * 1000).getHours();

                if (!firstDateString) firstDateString = date;
                if (!daily[date]) {
                    daily[date] = { min: item.main.temp_min, max: item.main.temp_max, icon: weatherIcon, hasRainOrSnow: false, rainPeriods: { morning: false, afternoon: false, night: false } };
                } else {
                    daily[date].min = Math.min(daily[date].min, item.main.temp_min);
                    daily[date].max = Math.max(daily[date].max, item.main.temp_max);
                }

                const isRainingOrSnowing = (weatherId >= 200 && weatherId < 700);
                if (isRainingOrSnowing) {
                    daily[date].hasRainOrSnow = true;
                    if (date === firstDateString) hasRainToday = true;
                    if (hour >= 6 && hour < 12) daily[date].rainPeriods.morning = true;
                    else if (hour >= 12 && hour < 18) daily[date].rainPeriods.afternoon = true;
                    else if (hour >= 18 || hour < 6) daily[date].rainPeriods.night = true;
                }
            });

            if (firstDateString && daily[firstDateString]) currentDayRainPeriods = daily[firstDateString].rainPeriods;

            const forecastHtml = Object.entries(daily).slice(1, 6).map(([date, val]) => {
                const d = new Date(date + 'T12:00:00');
                const dayOfWeek = d.toLocaleDateString('pt-BR', { weekday: 'short' });
                let displayIcon = val.icon.endsWith('n') && !val.icon.startsWith('50') ? val.icon.replace('n', 'd') : val.icon;
                if (val.hasRainOrSnow && !['09', '10', '11'].some(id => displayIcon.startsWith(id)) && !displayIcon.startsWith('13')) displayIcon = '09d';

                const periods = [];
                if (val.rainPeriods.morning) periods.push('manhã');
                if (val.rainPeriods.afternoon) periods.push('tarde');
                if (val.rainPeriods.night) periods.push('noite');
                const rainMessage = periods.length > 0 ? `Prob. chuva ${periods.join(' e ')}` : 'Não deve chover';

                return `
                    <div class="forecast-day">
                        <strong>${dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1)}</strong>
                        <img src="https://openweathermap.org/img/wn/${displayIcon}.png" alt="Ícone de clima">
                        <div class="forecast-temps">
                            <span class="forecast-temp-min">${convertTemp(val.min).toFixed(0)}${getUnitSymbol()}</span>
                            <span class="forecast-temp-max">${convertTemp(val.max).toFixed(0)}${getUnitSymbol()}</span>
                        </div>
                        <div class="forecast-rain-info">${rainMessage}</div>
                    </div>`;
            }).join('');
            return { forecastHtml, currentDayRainPeriods, hasRainToday };
        } catch (error) {
            console.error("Erro ao buscar previsão:", error);
            return { forecastHtml: '<div style="text-align: center; margin-top: 10px;">Não foi possível carregar a previsão.</div>', currentDayRainPeriods: { morning: false, afternoon: false, night: false }, hasRainToday: false };
        }
    }

    function updateButtonDisplay(temp, icon, description) {
        const weatherIconElem = button.querySelector('.weather-icon');
        const weatherTextElem = button.querySelector('.weather-text');
        if (weatherIconElem && weatherTextElem) {
            let displayIcon = icon.endsWith('n') && !icon.startsWith('50') ? icon.replace('n', 'd') : icon;
            weatherIconElem.src = `https://openweathermap.org/img/wn/${displayIcon}.png`;
            weatherIconElem.alt = description;
            weatherTextElem.textContent = `${convertTemp(temp).toFixed(1)}${getUnitSymbol()}`;
        }
    }

    async function updateWeather(lat, lon, initialLoad = false) {
        try {
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`;
            const weatherRes = await fetch(weatherUrl);
            if (!weatherRes.ok) throw new Error(`Erro HTTP: ${weatherRes.status}`);
            const weatherData = await weatherRes.json();

            updateButtonDisplay(weatherData.main.temp, weatherData.weather[0].icon, weatherData.weather[0].description);
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue(CACHE_KEY_WEATHER_DATA, JSON.stringify({ temp: weatherData.main.temp, icon: weatherData.weather[0].icon, description: weatherData.weather[0].description, latitude: lat, longitude: lon }));
                GM_setValue(CACHE_KEY_LAST_UPDATE, Date.now());
                GM_setValue(CACHE_KEY_COORDS_TYPE, usingFallbackCoords ? 'fallback' : 'gps');
            }

            const { forecastHtml, currentDayRainPeriods, hasRainToday } = await fetchForecast(lat, lon);

            const rainPeriods = [];
            if (currentDayRainPeriods.morning) rainPeriods.push('manhã');
            if (currentDayRainPeriods.afternoon) rainPeriods.push('tarde');
            if (currentDayRainPeriods.night) rainPeriods.push('noite');
            const currentDayRainMessage = rainPeriods.length > 0 ? `Prob. de chuva ${rainPeriods.join(' e ')}` : 'Não deve chover hoje';

            fullForecastLink.href = `https://openweathermap.org/city/${weatherData.id}`;

            let displayCityName = usingFallbackCoords ? 'Porto Alegre' : weatherData.name;
            let displayCountry = usingFallbackCoords ? 'BR' : weatherData.sys.country;

            const windSpeedKmH = (weatherData.wind.speed * 3.6).toFixed(1);
            const { description: windFeedbackText, className: windFeedbackClass } = getWindFeedback(parseFloat(windSpeedKmH));
            const { description: pressureFeedbackText, className: pressureFeedbackClass } = getPressureFeedback(weatherData.main.pressure, weatherData.main.humidity, weatherData.clouds.all, hasRainToday);
            const { description: humidityFeedbackText, className: humidityFeedbackClass } = getHumidityFeedback(weatherData.main.humidity);

            weatherDetailsContainer.innerHTML = `
                <strong>🌍 ${displayCityName}, ${displayCountry}</strong><br>
                🌡️ ${convertTemp(weatherData.main.temp).toFixed(1)}${getUnitSymbol()} (mín: ${convertTemp(weatherData.main.temp_min).toFixed(1)}${getUnitSymbol()}, máx: ${convertTemp(weatherData.main.temp_max).toFixed(1)}${getUnitSymbol()})<br>
                🤗 Sensação: ${convertTemp(weatherData.main.feels_like).toFixed(1)}${getUnitSymbol()}<br>
                💧 Umidade: ${weatherData.main.humidity}%<br>
                <div class="humidity-info ${humidityFeedbackClass}">💧 ${humidityFeedbackText}</div>
                🌬️ Vento: ${windSpeedKmH} km/h (${weatherData.wind.deg}º ${getWindDirectionCardinal(weatherData.wind.deg)})<br>
                <div class="wind-info ${windFeedbackClass}">💨 ${windFeedbackText}</div>
                🌥️ ${weatherData.weather[0].description}<br>
                <div class="current-day-rain-info">🌧️ ${currentDayRainMessage}</div>
                ☁️ Nuvens: ${weatherData.clouds.all}%<br>
                📈 Pressão: ${weatherData.main.pressure} hPa<br>
                <div class="pressure-info ${pressureFeedbackClass}">${pressureFeedbackText}</div>
                🌅 Nascer: ${formatTime(weatherData.sys.sunrise)} | 🌇 Pôr: ${formatTime(weatherData.sys.sunset)}<br>
                <div class="forecast">${forecastHtml}</div>`;
            refreshButton.disabled = false;
            unitToggleButton.disabled = false;
            panel.style.height = 'auto';
        } catch (error) {
            console.error("Erro ao carregar os dados do clima:", error);
            weatherDetailsContainer.innerHTML = `
                <p style="color: red; text-align: center; padding: 10px;">
                    Não foi possível carregar os dados do clima.
                    <br>Verifique sua conexão ou tente novamente mais tarde.
                    <br>Detalhes: ${error.message}
                </p>`;
            panel.style.height = 'auto';
            refreshButton.disabled = false;
            unitToggleButton.disabled = false;
            if (initialLoad) updateButtonDisplay(0.0, '50d', 'Erro!');

            panel.querySelector('.refresh-btn')?.addEventListener('click', handleRefreshOrUnitToggle);
        }
    }

    async function initializeWeather() {
        let useCached = false;
        if (typeof GM_setValue !== 'undefined') {
            const cachedWeatherData = GM_getValue(CACHE_KEY_WEATHER_DATA);
            const lastUpdate = GM_getValue(CACHE_KEY_LAST_UPDATE, 0);
            const cachedCoordsType = GM_getValue(CACHE_KEY_COORDS_TYPE, 'gps');

            if (cachedWeatherData && (Date.now() - lastUpdate < CACHE_EXPIRATION_MS)) {
                try {
                    const parsedData = JSON.parse(cachedWeatherData);
                    coords = { latitude: parsedData.latitude, longitude: parsedData.longitude };
                    usingFallbackCoords = (cachedCoordsType === 'fallback');
                    updateButtonDisplay(parsedData.temp, parsedData.icon, parsedData.description);
                    refreshButton.disabled = false;
                    unitToggleButton.disabled = false;
                    weatherDetailsContainer.innerHTML = `Carregando detalhes do painel...`;
                    useCached = true;
                    updateWeather(parsedData.latitude, parsedData.longitude).catch(err => console.error("Erro ao atualizar o clima em segundo plano do cache:", err));
                } catch (e) {
                    console.error("Erro ao parsear dados do cache:", e);
                    weatherDetailsContainer.innerHTML = 'Carregando...';
                }
            }
        }

        if (!useCached) {
            weatherDetailsContainer.innerHTML = 'Carregando...';
            navigator.geolocation.getCurrentPosition(
                async (pos) => { coords = pos.coords; usingFallbackCoords = false; await updateWeather(coords.latitude, coords.longitude, true); },
                async (error) => {
                    console.warn("Erro de geolocalização, usando coordenadas de fallback:", error);
                    coords = fallbackCoords; usingFallbackCoords = true; await updateWeather(coords.latitude, coords.longitude, true);
                }
            );
        }
    }

    initializeWeather();
})();

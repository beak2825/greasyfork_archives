// ==UserScript==
// @name         Mock data for good weather weekend flight
// @version      0.1
// @namespace    https://windows.msn.com/
// @description  mock data for good weather weekend flight
// @author       Yufan Diao
// @mail         t-yufandiao@microsoft.com
// @match        https://windows.msn.com/shell*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430415/Mock%20data%20for%20good%20weather%20weekend%20flight.user.js
// @updateURL https://update.greasyfork.org/scripts/430415/Mock%20data%20for%20good%20weather%20weekend%20flight.meta.js
// ==/UserScript==

// 0-> not applies, 1-> good weather for Sat, 2-> good weather for Sun, 3-> good weather for weekend, 15->not good weather
const comingWeather = 3;

const _fetch = window.fetch;
window.fetch = async (input, param) => {
    const url = new URL(input);
    console.log(url, param);
    if (url.origin !== "https://assets.msn.com" || url.pathname !== "/service/v1/news/feed/windows/") {
        return await _fetch(input, param);
    }

    // Modify query string here if needed
    const response = await _fetch(url.href, param);
    const data = await response.json();
    console.log(data);
    for (let i = 0; i < data.cards.length; ++i) {
        const card = data.cards[i];
        if (url.href.indexOf("prg-1sw-weekend") >= 0) {
            if (card.type.startsWith("WeatherSummary")) {
                const weatherData = JSON.parse(card.data);
                if (weatherData.responses[0].weather[0].contentdata?.length > 0) {
                    weatherData.responses[0].weather[0].contentdata[0].contenttype = "GoodWeatherWeekend";
                }
                weatherData.responses[0].weather[0].current.comingWeather = comingWeather;
                card.data = JSON.stringify({
                    ...weatherData,
                });
            }
        }
    }
    response.json = () => Promise.resolve(data);
    return response;
};

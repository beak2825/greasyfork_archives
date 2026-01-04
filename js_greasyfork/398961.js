// ==UserScript==
// @name         corona
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show change for NY Times case/death numbers
// @author       Jeffrey Lu
// @match        https://www.nytimes.com/interactive/2020/us/coronavirus-us-cases.html
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://code.jquery.com/jquery-3.4.1.min.js#sha384=vk5WoKIaW/vJyUAd9n/wmopsmNhiy+L2Z+SBxGYnUkunIxVxAv/UtMOhba/xskxh
// @downloadURL https://update.greasyfork.org/scripts/398961/corona.user.js
// @updateURL https://update.greasyfork.org/scripts/398961/corona.meta.js
// ==/UserScript==

(async function() {
    // adapted from https://bit.ly/38Z9G6b
    const checkElements = async selector => {
        while (!$(selector).length) {
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        return $(selector);
    };

    const checkElement = async selector => {
        return checkElements(selector).then(function(elements) {
            return elements.first();
        });
    };

    function getDiffString(prev, current) {
        if (prev === undefined) {
            return "";
        } else {
            // adapted from https://bit.ly/3aqSZkM
            let diff = (current - prev).toLocaleString();
            return ` (+${diff})`;
        }
    }

    let corona = {};
    try {
        corona = JSON.parse(await GM.getValue("corona"));
    } catch(e) {
        console.error(e);
    }

    let rows = await checkElements("#g-cases-by-state table tbody tr");
    rows.each(function(index, value) {
        let [state_td, cases_td, deaths_td] = $(value).find("td");
        [state, cases, deaths] = [$(state_td).text(),
                                  parseInt($(cases_td).text().replace(/,/g, '')),
                                  parseInt($(deaths_td).text().replace(/,/g, ''))]

        let info = corona[state] || {};
        if (cases !== info.current_cases) {
            [info.prev_cases, info.current_cases] = [info.current_cases, cases];
        }
        if (deaths !== info.current_deaths) {
            [info.prev_deaths, info.current_deaths] = [info.current_deaths,
                                                       deaths];
        }
        corona[state] = info;

        let cases_diff = getDiffString(info.prev_cases, info.current_cases);
        let deaths_diff = getDiffString(info.prev_deaths, info.current_deaths);

        // TODO: there's some sort of refreshing of the table data while the
        // page loads. maybe there's a way to detect this event and add our
        // spans after
        setTimeout(function() {
            $(cases_td).append(`<span style="color:red">${cases_diff}</span>`);
            $(deaths_td).append(`<span style="color:red">${deaths_diff}</span>`);
        }, 1000);
    });

    GM.setValue("corona", JSON.stringify(corona));
})();
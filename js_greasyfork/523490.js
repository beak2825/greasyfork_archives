// ==UserScript==
// @name        Pardus Planet Upkeep Ticks Prediction
// @namespace   leaumar
// @version     1-preview-2
// @description Tells you for how many ticks a planet's current supplies should last.
// @author      leaumar@sent.com
// @match       https://*.pardus.at/planet.php
// @match       https://*.pardus.at/starbase.php
// @match       https://*.pardus.at/planet_trade.php
// @match       https://*.pardus.at/starbase_trade.php
// @icon        https://icons.duckduckgo.com/ip2/pardus.at.ico
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://cdn.jsdelivr.net/npm/zod@3.23.8/lib/index.umd.min.js
// @require     https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require     https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @require     https://cdn.jsdelivr.net/npm/date-fns@4.1.0/cdn.min.js
// @license     MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/523490/Pardus%20Planet%20Upkeep%20Ticks%20Prediction.user.js
// @updateURL https://update.greasyfork.org/scripts/523490/Pardus%20Planet%20Upkeep%20Ticks%20Prediction.meta.js
// ==/UserScript==

// artemis.pardus.at
const universe = location.hostname.split('.').slice(0, 1)[0];

// resources per 1000 workers
const upkeepPerPlanet = {
    m: {
        minWorkers: 750,
        resources: {
            energy: 7.5,
        },
    },
    a: {
        minWorkers: 1250,
        resources: {
            energy: 12.5,
        },
    },
    d: {
        minWorkers: 750,
        resources: {
            water: 2.5,
            ['gem-stones']: 0.5,
        },
    },
    i: {
        minWorkers: 750,
        resources: {
            energy: 7.5,
        },
    },
    g: {
        minWorkers: 750,
        resources: {
            food: 1.5,
            energy: 2.5,
        },
    },
    r: {
        minWorkers: 750,
        resources: {
            food: 2.5,
            water: 2,
            energy: 4,
        },
    },
    sb_f: {
        minWorkers: 500,
        resources: {
            food: 2.5,
            water: 1.75,
        },
    },
    sb_p: {
        minWorkers: 500,
        resources: {
            food: 3,
            water: 2,
        },
    },
};

const populationStorageSchema = Zod.object({
    // preserve numeric formatting
    population: Zod.string().default('0'),
    at: Zod.string().datetime().default(() => new Date().toISOString()),
}).default({});

function makeFormulaRow(alt, name, ...values) {
    return React.createElement(
        'tr',
        { class: alt() ? 'alternating' : '' },
        React.createElement(
            'td',
            {},
            name,
        ),
        React.createElement(
            'td',
            {},
            values,
        ),
    );
}

function FormulaRow({ alt, name, children }) {
    return React.createElement(
        'tr',
        { class: alt() },
        React.createElement(
            'td',
            {},
            name,
        ),
        React.createElement(
            'td',
            {},
            children,
        ),
    );
}

function useAlternating() {
    const counter = React.useRef(0);
    return () => {
        counter.current += 1;
        return counter.current % 2 === 0 ? '' : 'alternating';
    };
}

function FormulaTable({ population, populationDate, planetType, stock }) {
    const upkeep = upkeepPerPlanet[planetType];
    const populationCount = parseInt(population.replaceAll(',', ''));
    const alt = useAlternating();

    const ticksLeft = Object.fromEntries(Object.entries(upkeep.resources).map(([resource, consumptionPerK]) => {
        const supply = stock[resource];
        const kWorkers = Math.ceil(populationCount / 1000);
        // TODO just take it from the balance column?
        const consumption = kWorkers * consumptionPerK;
        return [resource, [Math.floor(supply / consumption), consumption]];
    }));

    const lowestTicks = Math.min(...Object.entries(ticksLeft).map(([, [ticks]]) => ticks));

    return React.createElement(
        'tbody',
        {},
        React.createElement(
            FormulaRow,
            { alt, name: 'Population', },
            `${population}`,
            ...(populationCount < upkeep.minWorkers ? [
                React.createElement('br'),
                `(< ${upkeep.minWorkers})`
            ] : []),
            React.createElement('br'),
            `(${dateFns.formatDistanceToNow(populationDate, { addSuffix: true })})`,
        ),
        React.createElement(
            FormulaRow,
            { alt, name: 'Type', },
            planetType.toUpperCase(),
        ),
        ...Object.entries(ticksLeft).map(([resource, [ticks, consumption]]) => {
            return React.createElement(
                FormulaRow,
                { alt, name: resource, },
                `${ticks} ticks`,
                React.createElement('br'),
                `(${consumption} per tick)`
            );
        }),
        React.createElement(
            FormulaRow,
            { alt, name: 'Stocked for', },
            React.createElement('b', {}, `${lowestTicks} ticks`)
        ),
    );
}

if (location.pathname.endsWith('_trade.php')) {
    const isStarBase = location.pathname.includes('starbase');

    const planetLink = document.links[0];
    const planetName = planetLink.textContent;

    const { population, at } = populationStorageSchema.parse(GM_getValue(`${planetName}@${universe}`, undefined));
    const populationDate = new Date(at);

    const planetImage = document.querySelector(`img[src*='foregrounds/${isStarBase ? 'starbase' : 'planet'}_']`);
    // https://static.pardus.at/img/stdhq/96/foregrounds/planet_m.png
    // https://static.pardus.at/img/stdhq/96/foregrounds/starbase_f2_s4.png (f = faction?)
    // https://static.pardus.at/img/stdhq/96/foregrounds/starbase_p2_s4.png (p = player?)
    const isPlayerStarbase = planetImage.src.includes('starbase_p');
    const planetType = isStarBase ? `sb_${isPlayerStarbase ? 'p' : 'f'}` : /foregrounds\/planet_([madigr]).png$/.exec(planetImage.src)[1];

    const stockTablePath = isStarBase
        ? 'table.messagestyle:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3) > table:nth-child(1)'
        : '#planet_trade > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(3) > table:nth-child(1) > tbody:nth-child(1)';
    const stockTable = document.querySelector(stockTablePath);
    const resourceRows = [...stockTable.querySelectorAll('tr[id^=baserow]')];
    const stock = resourceRows.reduce((acc, curr) => {
        const tds = curr.getElementsByTagName('td');

        const resourceImage = tds[0].getElementsByTagName('img')[0];
        // //static.pardus.at/img/stdhq/res/food.png
        const resourceMatch = /\/res\/([a-z0-9_-]+).png$/.exec(resourceImage.src);
        if (resourceMatch == null) {
            throw new Error("Could not read resource name", { cause: resourceImage.src });
        }
        const resourceName = resourceMatch[1];

        const resourceCountElement = tds[2].querySelector('a') ?? tds[2];
        const resourceSupply = parseInt(resourceCountElement.textContent.replaceAll(',', ''));

        acc[resourceName] = resourceSupply;
        return acc;
    }, {});

    console.info(planetName, population, populationDate, planetType, stock);

    const quickTrade = document.querySelector('#quickButtonsTbl');
    // center td of the trading panel
    const parent = quickTrade.parentNode;
    const table = document.createElement('table');
    table.className = quickTrade.className;
    for (const styleProp of quickTrade.style) {
        table.style[styleProp] = quickTrade.style[styleProp];
    }
    parent.appendChild(table);

    const root = ReactDOM.createRoot(table);
    root.render(React.createElement(FormulaTable, { population, populationDate, planetType, stock }));
}

if (location.pathname.endsWith('planet.php') || location.pathname.endsWith('starbase.php')) {
    const planetElement = document.querySelector('table.messagestyle:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)');
    const planetName = planetElement.textContent;

    const workersElement = location.pathname.includes('starbase') ?
        (document.querySelector('body > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(3) > div:nth-child(2) > span:nth-child(1)')
            ?? document.querySelector('table.messagestyle:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)'))
        : document.querySelector('table.messagestyle:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(2) > div:nth-child(2) > span:nth-child(1)');
    // Workers: 243,937  | Crime level: criticalYour popularity: 0
    const workersCount = /^Workers: ([\d,]+)/.exec(workersElement.textContent)[1];

    console.info(`${workersCount} workers`);

    GM_setValue(`${planetName}@${universe}`, populationStorageSchema.parse({
        population: workersCount,
        at: new Date().toISOString(),
    }));
}

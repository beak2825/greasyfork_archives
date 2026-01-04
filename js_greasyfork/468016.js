// ==UserScript==
// @name         Pardus Building Class
// @namespace    fear.math@gmail.com
// @version      2.3.0
// @description  Building class used by Pardus Trader Autopilot
// @author       Math (Orion)
// ==/UserScript==

class Building {
    static defaultLevel = 8;
    static maxTicks = 12;
    
    static resourceNames = {
        '1': 'food', '2': 'energy', '3': 'water', '4': 'embryos', '5': 'ore', '6': 'metal', '7': 'electronics',
        '8': 'bots', '9': 'plastics', '10': 'hws', '11': 'medics', '12': 'gas', '13': 'chems', '14': 'gems',
        '15': 'liquor', '16': 'fuel', '17': 'ematter', '18': 'optics', '19': 'cells', '20': 'droids', '21': 'biowaste',
        '22': 'leech', '23': 'clod', '27': 'bwps', '28': 'tissue', '29': 'stims', '50': 'slaves', '51': 'drugs',
    };

    // Credit to Taised (tiziano.m@infinito.it) who hosts the original version of this data at
    // 'http://www.fantamondi.it/pardus/common/building_data.js
    static buildingData = [
        { type: "Energy Well", tier: 0, resources: { "food": -1, "water": -1, "energy": 6 } },
        { type: "Nebula Plant", tier: 0, resources: { "food": -2, "water": -2, "ematter": -3, "energy": 35, "gas": 4 } },
        { type: "Space Farm", tier: 0, resources: { "energy": -4, "embryos": -5, "food": 8, "water": 2, "biowaste": 1 } },

        { type: "Asteroid Mine", tier: 1, resources: { "food": -1, "energy": -1, "water": -1, "ore": 9, "gems": 2 } },
        { type: "Chemical Laboratory", tier: 1, resources: { "food": -1, "energy": -3, "water": -1, "chems": 9 } },
        { type: "Gas Collector", tier: 1, resources: { "food": -2, "energy": -2, "water": -2, "gas": 20 } },
        { type: "Radiation Collector", tier: 1, resources: { "food": -1, "energy": -3, "water": -1, "cells": 6 } },

        { type: "Alliance Command Station", tier: 2, resources: { "energy": -6, "cells": -2 } },
        { type: "Brewery", tier: 2, resources: { "food": -2, "energy": -2, "water": -2, "chems": -4, "liquor": 4 } },
        { type: "Clod Generator", tier: 2, resources: { "biowaste": -18, "energy": -4, "chems": -4, "clod": 5 } },
        { type: "Fuel Collector", tier: 2, resources: { "energy": -4, "chems": -1, "fuel": 30 } },
        { type: "Medical Laboratory", tier: 2, resources: { "food": -2, "energy": -2, "water": -2, "gas": -7, "medics": 4 } },
        { type: "Military Outpost", tier: 2, resources: { "energy": -5, "fuel": -5 } },
        { type: "Optics Research Center", tier: 2, resources: { "food": -1, "energy": -3, "water": -1, "gems": -2, "optics": 10 } },
        { type: "Plastics Facility", tier: 2, resources: { "food": -2, "energy": -2, "water": -2, "chems": -3, "gas": -3, "plastics": 6 } },
        { type: "Recyclotron", tier: 2, resources: { "biowaste": -5, "energy": -3, "chems": -1, "food": 7, "water": 5 } },
        { type: "Smelting Facility", tier: 2, resources: { "food": -2, "energy": -2, "water": -2, "ore": -6, "metal": 12 } },

        { type: "Electronics Facility", tier: 3, resources: { "food": -1, "energy": -4, "water": -1, "plastics": -2, "metal": -3, "electronics": 6 } },
        { type: "Leech Nursery", tier: 3, resources: { "food": -2, "energy": -6, "water": -10, "cells": -6, "clod": -40, "leech": 1, "biowaste": 3 } },
        { type: "Neural Laboratory", tier: 3, resources: { "food": -2, "water": -2, "energy": -2, "embryos": -12, "medics": -2, "tissue": 16 } },
        { type: "Slave Camp", tier: 3, resources: { "food": -3, "energy": -1, "water": -3, "liquor": -2, "medics": -2, "slaves": 3 } },

        { type: "Battleweapons Factory", tier: 4, resources: { "food": -1, "energy": -2, "water": -1, "metal": -3, "optics": -4, "electronics": -3, "bwps": 2 } },
        { type: "Dark Dome", tier: 4, resources: { "slaves": -3, "energy": -1, "bodyparts": 12, "biowaste": 4 } },
        // { type: "Dark Dome (TSS)", tier: 4, resources: { "slaves": -2, "energy": -1, "bodyparts": 12, "biowaste": 4 } },
        { type: "Drug Station", tier: 4, resources: { "food": -3, "energy": -1, "water": -3, "slaves": -4, "ematter": -3, "drugs": 1 } },
        // { type: "Drug Station (TSS)", tier: 4, resources: { "food": -3, "energy": -1, "water": -3, "slaves": -3, "ematter": -3, "drugs": 1 } },
        { type: "Handweapons Factory", tier: 4, resources: { "food": -1, "energy": -2, "water": -1, "plastics": -3, "optics": -3, "electronics": -3, "hws": 2 } },
        { type: "Robots Factory", tier: 4, resources: { "food": -2, "energy": -2, "water": -2, "metal": -1, "optics": -2, "electronics": -4, "bots": 3 } },
        { type: "Stim Chip Mill", tier: 4, resources: { "food": -3, "water": -3, "ematter": -2, "tissue": -44, "electronics": -2, "stims": 2 } },

        { type: "Droid Assembly Complex", tier: 5, resources: {"food": -1, "energy": -3, "water": -1, "cells": -3, "bots": -2, "droids": 1} }
    ];

    constructor(type, sector, x, y, level = Building.defaultLevel, lastStock = {}, lastViewed = null, balance = null) {
        this.type = type;
        this.sector = sector;
        this.x = x;
        this.y = y;
        this.level = level;
        this._balance = balance;
        this.lastStock = lastStock;
        this.lastViewed = lastViewed;
    }

    get coords() {
        return `[${this.x},${this.y}]`;
    }

    // If we know the balance, return it, otherwise guess the production
    get balance() {
        return this._balance || this.calculateProduction();
    }

    // Calculate the guessed current stock based on lastViewed time and building characteristics
    get stock() {
        const ticksPassed = this.calculateTicksPassed();
        const production = this.balance;
        const stock = this.lastStock;

        // Calculate the guessed stock for each commodity
        for (const commodity in production) {
            if (production.hasOwnProperty(commodity)) {
                const lastStock = stock[commodity] || 0;
                const change = production[commodity] * ticksPassed;
                stock[commodity] = lastStock + change;
            }
        }

        return stock;
    }

    // Setter for level
    setLevel(level) {
        this.level = level;
    }

    // Called on the building trade screen. Updates balance, lastStock, and lastViewed
    update() {
        this.updateBalance();
        this.updateLastStock();
        this.updateLastViewed();
    }

    updateBalance() {
        const balanceValues = Building.extractBalanceValues();

        const balance = {};

        // Add res_production to the balance
        for (const key in amount) {
            const resourceName = Building.resourceNames[key];
            balance[resourceName] = balanceValues.shift();
        }

        this._balance = balance;
    }

    updateLastStock() {
        const stock = {};

        for (const key in amount) {
            const resourceName = Building.resourceNames[key];
            const balance = this.balance[resourceName];

            // Production's stock level is the amount above the min
            if (balance > 0) {
                stock[resourceName] = amount[key] - amount_min[key];
            }

            // Upkeep's stock level is the amount below the max
            if (balance < 0) {
                stock[resourceName] = amount_max[key] - amount[key];
            }
        }

        this.lastStock = stock;
    }

    updateLastViewed() {
        this.lastViewed = Date.now();
    }

    // Calculate the number of building ticks that have passed since lastViewed
    calculateTicksPassed() {
        const millisecondsPerTick = 6 * 60 * 60 * 1000; // Milliseconds per tick

        const now = new Date();
        const lastViewed = new Date(this.lastViewed);

        // Adjust the last viewed time forward to the nearest tick time (1:25 GMT and every 6 hours)
        lastViewed.setUTCMinutes(Math.round(Math.ceil((lastViewed.getUTCMinutes() - 25) / 60) * 60 + 25));
        lastViewed.setUTCHours(Math.round(Math.ceil((lastViewed.getUTCHours() - 1) / 6) * 6 + 1));

        // Calculate the time difference in milliseconds
        const timeDiff = now - lastViewed;

        // Calculate the number of ticks passed
        const ticksPassed = Math.ceil(timeDiff / millisecondsPerTick);

        return Math.min(ticksPassed, Building.maxTicks);
    }

    // Calculate the production and consumption rates based on the building type and level
    calculateProduction() {
        const buildingData = Building.buildingData.find(building => building.type === this.type);

        if (!buildingData) {
            console.log(`Building data not found for building type: ${this.type}`);
            return;
        }

        const { resources } = buildingData;
        const production = {};

        for (const resource in resources) {
            const value = resources[resource];

            if (value > 0) {
                production[resource] = Math.round(value * (1 + 0.5 * (this.level - 1)));
            } else if (value < 0) {
                production[resource] = Math.round(value * (1 + 0.4 * (this.level - 1)));
            }
        }

        return production;
    }

    // Custom serialization method
    toJSON() {
        return {
            type: this.type,
            sector: this.sector,
            x: this.x,
            y: this.y,
            level: this.level,
            lastStock: this.lastStock,
            lastViewed: this.lastViewed,
            _balance: this._balance,
        };
    }

    // Custom deserialization method
    static fromJSON(json) {
        const { type, sector, x, y, level, lastStock, lastViewed, _balance } = json;
        const building = new Building(type, sector, x, y, level, lastStock, lastViewed, _balance);
        return building;
    }

    static extractBalanceValues() {
        var balanceValues = [];
        var tableRows =   document.querySelectorAll('#building_trade tr[id^="baserow"]');

        tableRows.forEach(function(row) {
            var balanceCell = row.querySelector('td:nth-child(4)');
            var balanceValue = balanceCell.textContent.trim();
            balanceValues.push(balanceValue);
        });

        return balanceValues.map(Number);
    }
}

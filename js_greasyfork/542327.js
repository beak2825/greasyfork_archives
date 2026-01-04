// ==UserScript==
// @name         UnitFlip: Inline Unit Converter
// @namespace    https://greasyfork.org/en/users/1451802
// @version      2.0
// @description  Double‑click measurements to instantly convert between metric and imperial units (no APIs)
// @author       NormalRandomPeople (https://github.com/NormalRandomPeople)
// @match        *://*/*
// @icon         https://www.svgrepo.com/show/256974/exchange.svg
// @grant        none
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   edge
// @compatible   brave
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542327/UnitFlip%3A%20Inline%20Unit%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/542327/UnitFlip%3A%20Inline%20Unit%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function smartFixed(value, defaultPrecision = 2) {
        const abs = Math.abs(value);
        if (abs === 0) return '0';
        if (abs >= 1000) return value.toFixed(0);
        if (abs >= 100) return value.toFixed(1);
        if (abs >= 1) return value.toFixed(2);
        if (abs >= 0.01) return value.toFixed(3);
        return value.toFixed(4);
    }

    const conv = {
        // LENGTH
        mm: v => `${v} mm → ${smartFixed(v/25.4)} in`,
        millimeter: v => conv.mm(v), millimeters: v => conv.mm(v), millimetre: v => conv.mm(v), millimetres: v => conv.mm(v),
        cm: v => `${v} cm → ${smartFixed(v/2.54)} in`,
        centimeter: v => conv.cm(v), centimeters: v => conv.cm(v), centimetre: v => conv.cm(v), centimetres: v => conv.cm(v),
        m: v => `${v} m → ${smartFixed(v*3.28084)} ft`,
        meter: v => conv.m(v), meters: v => conv.m(v), metre: v => conv.m(v), metres: v => conv.m(v),
        km: v => `${v} km → ${smartFixed(v*0.621371)} mi`,
        kilometer: v => conv.km(v), kilometers: v => conv.km(v), kilometre: v => conv.km(v), kilometres: v => conv.km(v),
        in: v => `${v} in → ${smartFixed(v*2.54)} cm`,
        inch: v => conv.in(v), inches: v => conv.in(v),
        ft: v => `${v} ft → ${smartFixed(v*0.3048)} m`,
        foot: v => conv.ft(v), feet: v => conv.ft(v),
        yd: v => `${v} yd → ${smartFixed(v*0.9144)} m`,
        yard: v => conv.yd(v), yards: v => conv.yd(v),
        mi: v => `${v} mi → ${smartFixed(v*1.60934)} km`,
        mile: v => conv.mi(v), miles: v => conv.mi(v),
        nmi: v => `${v} nmi → ${smartFixed(v*1.852)} km`,
        nauticalmile: v => conv.nmi(v), nauticalmiles: v => conv.nmi(v),

        // SPEED
        'km/h': v => `${v} km/h → ${smartFixed(v*0.621371)} mph`,
        kph: v => conv['km/h'](v), kmh: v => conv['km/h'](v), 'kilometers per hour': v => conv['km/h'](v),
        'm/s': v => `${v} m/s → ${smartFixed(v*2.23694)} mph`,
        mps: v => conv['m/s'](v), 'meters per second': v => conv['m/s'](v),
        mph: v => `${v} mph → ${smartFixed(v*1.60934)} km/h`,
        'mi/h': v => conv.mph(v), 'miles per hour': v => conv.mph(v),

        // MASS
        mg: v => `${v} mg → ${smartFixed(v/28349.5)} oz`,
        milligram: v => conv.mg(v), milligrams: v => conv.mg(v), milligramme: v => conv.mg(v), milligrammes: v => conv.mg(v),
        g: v => `${v} g → ${smartFixed(v/28.3495)} oz`,
        gram: v => conv.g(v), grams: v => conv.g(v), gramme: v => conv.g(v), grammes: v => conv.g(v),
        kg: v => `${v} kg → ${smartFixed(v*2.20462)} lb`,
        kilogram: v => conv.kg(v), kilograms: v => conv.kg(v), kilogramme: v => conv.kg(v), kilogrammes: v => conv.kg(v),
        t: v => `${v} t → ${smartFixed(v*2204.62)} lb`,
        ton: v => conv.t(v), tons: v => conv.t(v), tonne: v => conv.t(v), tonnes: v => conv.t(v),
        oz: v => `${v} oz → ${smartFixed(v*28.3495)} g`,
        ounce: v => conv.oz(v), ounces: v => conv.oz(v),
        lb: v => `${v} lb → ${smartFixed(v*0.453592)} kg`,
        lbs: v => conv.lb(v), pound: v => conv.lb(v), pounds: v => conv.lb(v),
        st: v => `${v} st → ${smartFixed(v*6.35029)} kg`,
        stone: v => conv.st(v), stones: v => conv.st(v),

        // VOLUME
        ml: v => `${v} mL → ${smartFixed(v/29.5735)} fl oz`,
        milliliter: v => conv.ml(v), milliliters: v => conv.ml(v), millilitre: v => conv.ml(v), millilitres: v => conv.ml(v),
        l: v => `${v} L → ${smartFixed(v*0.264172)} gal`,
        liter: v => conv.l(v), liters: v => conv.l(v), litre: v => conv.l(v), litres: v => conv.l(v),
        m3: v => `${v} m³ → ${smartFixed(v*35.3147)} ft³`,
        'm^3': v => conv.m3(v), 'cubic meter': v => conv.m3(v), 'cubic meters': v => conv.m3(v),
        'fl oz': v => `${v} fl oz → ${smartFixed(v*29.5735)} mL`,
        floz: v => conv['fl oz'](v), fluidounce: v => conv['fl oz'](v), fluidounces: v => conv['fl oz'](v),
        tbsp: v => `${v} tbsp → ${smartFixed(v*14.7868)} mL`,
        tablespoon: v => conv.tbsp(v), tablespoons: v => conv.tbsp(v),
        tsp: v => `${v} tsp → ${smartFixed(v*4.92892)} mL`,
        teaspoon: v => conv.tsp(v), teaspoons: v => conv.tsp(v),
        cup: v => `${v} cup → ${smartFixed(v*236.588)} mL`,
        cups: v => conv.cup(v),
        pt: v => `${v} pt → ${smartFixed(v*473.176)} mL`,
        pint: v => conv.pt(v), pints: v => conv.pt(v),
        qt: v => `${v} qt → ${smartFixed(v*946.353)} mL`,
        quart: v => conv.qt(v), quarts: v => conv.qt(v),
        gal: v => `${v} gal → ${smartFixed(v*3785.41)} mL`,
        gallon: v => conv.gal(v), gallons: v => conv.gal(v),

        // AREA
        m2: v => `${v} m² → ${smartFixed(v*10.7639)} ft²`,
        'm^2': v => conv.m2(v), sqm: v => conv.m2(v), 'square meter': v => conv.m2(v), 'square meters': v => conv.m2(v),
        km2: v => `${v} km² → ${smartFixed(v*0.386102)} mi²`,
        'km^2': v => conv.km2(v), sqkm: v => conv.km2(v), 'square kilometer': v => conv.km2(v), 'square kilometers': v => conv.km2(v),
        ha: v => `${v} ha → ${smartFixed(v*10000)} m²`,
        hectare: v => conv.ha(v), hectares: v => conv.ha(v),
        ft2: v => `${v} ft² → ${smartFixed(v*0.092903)} m²`,
        'ft^2': v => conv.ft2(v), sqft: v => conv.ft2(v), 'square foot': v => conv.ft2(v), 'square feet': v => conv.ft2(v),
        in2: v => `${v} in² → ${smartFixed(v*6.4516)} cm²`,
        'in^2': v => conv.in2(v), sqin: v => conv.in2(v), 'square inch': v => conv.in2(v), 'square inches': v => conv.in2(v),
        ac: v => `${v} ac → ${smartFixed(v*4046.86)} m²`,
        acre: v => conv.ac(v), acres: v => conv.ac(v),
        mi2: v => `${v} mi² → ${smartFixed(v*2.58999)} km²`,
        'mi^2': v => conv.mi2(v), sqmi: v => conv.mi2(v), 'square mile': v => conv.mi2(v), 'square miles': v => conv.mi2(v),

        // PRESSURE
        bar: v => `${v} bar → ${smartFixed(v*14.5038)} PSI`,
        kpa: v => `${v} kPa → ${smartFixed(v*0.145038)} PSI`,
        pa: v => `${v} Pa → ${smartFixed(v*0.000145038)} PSI`,
        pascal: v => conv.pa(v), pascals: v => conv.pa(v),
        psi: v => `${v} PSI → ${smartFixed(v*0.0689476)} bar`,
        'pounds per square inch': v => conv.psi(v),

        // POWER
        kw: v => `${v} kW → ${smartFixed(v*1.34102)} hp`,
        kilowatt: v => conv.kw(v), kilowatts: v => conv.kw(v),
        w: v => `${v} W → ${smartFixed(v*0.00134102)} hp`,
        watt: v => conv.w(v), watts: v => conv.w(v),
        hp: v => `${v} hp → ${smartFixed(v*0.745699)} kW`,
        horsepower: v => conv.hp(v),

        // FUEL CONSUMPTION
        'l/100km': v => `${v} L/100km → ${smartFixed(235.215/v)} MPG`,
        'liters per 100km': v => conv['l/100km'](v),
        mpg: v => `${v} MPG → ${smartFixed(235.215/v)} L/100km`,
        'miles per gallon': v => conv.mpg(v),

        // TEMPERATURE
        c: v => `${v.toFixed(1)} °C → ${((v*9/5+32)).toFixed(1)} °F`,
        '°c': v => conv.c(v), degc: v => conv.c(v), celsius: v => conv.c(v),
        f: v => `${v.toFixed(1)} °F → ${(((v-32)*5/9)).toFixed(1)} °C`,
        '°f': v => conv.f(v), degf: v => conv.f(v), fahrenheit: v => conv.f(v),
        k: v => `${v.toFixed(1)} K → ${((v-273.15)).toFixed(1)} °C`,
        '°k': v => conv.k(v), degk: v => conv.k(v), kelvin: v => conv.k(v)
    };

    let tooltip = null;

    function removeTooltip() {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }

    function showTooltip(txt, x, y) {
        removeTooltip();
        tooltip = document.createElement('div');
        tooltip.textContent = txt;
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        Object.assign(tooltip.style, {
            position: 'absolute', top: `${y+12}px`, left: `${x+12}px`,
            padding: '6px 10px', background: isDark ? 'rgba(30,30,30,0.95)' : 'rgba(255,255,225,0.95)',
            color: isDark ? '#f1f1f1' : '#222', border: `1px solid ${isDark ? '#555' : '#888'}`,
            borderRadius: '5px', boxShadow: isDark ? '0 2px 6px rgba(0,0,0,0.5)' : '0 2px 6px rgba(0,0,0,0.2)',
            fontSize: '13px', fontFamily: 'sans-serif', lineHeight: '1.4', zIndex: 2147483647,
            whiteSpace: 'nowrap', pointerEvents: 'none'
        });
        document.body.appendChild(tooltip);
    }

    function convert(sel) {
        const hMatch = sel.match(/^(\d+)'\s*(\d+)(?:"|$)/);
        if (hMatch) {
            const ft = parseInt(hMatch[1], 10);
            const inch = parseInt(hMatch[2], 10);
            const totalIn = ft * 12 + inch;
            const cm = smartFixed(totalIn * 2.54);
            return `${ft}'${inch}" → ${cm} cm`;
        }

        const ftInMatch = sel.match(/^(\d+)\s*(?:ft|feet)\s+(\d+)\s*(?:in|inch|inches)$/i);
        if (ftInMatch) {
            const ft = parseInt(ftInMatch[1], 10);
            const inch = parseInt(ftInMatch[2], 10);
            const totalIn = ft * 12 + inch;
            const cm = smartFixed(totalIn * 2.54);
            return `${ft} ft ${inch} in → ${cm} cm`;
        }

        let normalized = sel.replace(/²/g, '2');

        const match = normalized.match(/^(-?[\d\s,]+(?:\.\d+)?)\s*([\w°^\/]+(?: [\w^\/]+)?)$/);
        if (!match) return null;

        let numPart = match[1];
        const unitPart = match[2].trim().toLowerCase();

        if (/,\d{3}(?:[,\s]|$)/.test(numPart)) {
            numPart = numPart.replace(/,/g, '');
        } else {
            numPart = numPart.replace(/,/g, '.');
        }

        numPart = numPart.replace(/\s+/g, '');

        const value = parseFloat(numPart);
        if (isNaN(value)) return null;

        return conv[unitPart] ? conv[unitPart](value) : null;
    }

    document.addEventListener('dblclick', e => {
        try {
            const txt = window.getSelection().toString();
            if (!txt) return;
            const res = convert(txt);
            if (res) showTooltip(res, e.pageX, e.pageY);
        } catch (err) {
            console.error(err);
            removeTooltip();
        }
    });

    document.addEventListener('click', e => {
        if (tooltip && !tooltip.contains(e.target)) removeTooltip();
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') removeTooltip();
    });
})();

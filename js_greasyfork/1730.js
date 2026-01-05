// ==UserScript==
// @name         Tor's Backloggery enhancements
// @version      3.0.0
// @namespace    werhi23uhkjwesda
// @description  Adds pie charts and other enhancements to backloggery.com
// @author       Tor
// @copyright    2010+, Tor
// @license      MIT License; http://www.opensource.org/licenses/mit-license.php
// @match        https://backloggery.com/*
// @match        https://www.backloggery.com/*
// @match        https://backloggery.club/*
// @icon         https://raw.githubusercontent.com/torlye/Backloggery-enhancements/master/icon128.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/1730/Tor%27s%20Backloggery%20enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/1730/Tor%27s%20Backloggery%20enhancements.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/logging.ts
//Enable or disable log messages in the browser's javascript console
const enableLogging = false;
function log(message) {
    if (enableLogging) {
        const now = new Date();
        const addZero = function (d) {
            if (d < 10)
                d = "0" + d;
            return d;
        };
        let millis = now.getMilliseconds();
        if (millis < 10)
            millis = "00" + millis;
        else if (millis < 100)
            millis = "0" + millis;
        const displayMessage = addZero(now.getHours()) + ":" +
            addZero(now.getMinutes()) + ":" +
            addZero(now.getSeconds()) + ":" +
            millis + " " + message;
        console.log(displayMessage);
    }
}

;// CONCATENATED MODULE: ./src/state.ts
//Variables for gathering statistics
let downloadServiceStatistics;
let yearStatistics;
let downloadServiceTotalCount;
let yearTotalCount;
let gamesSum;
let systemCount;
let ownershipCount;
const getDownloadServiceStatistics = () => downloadServiceStatistics;
const getYearStatistics = () => yearStatistics;
const getDownloadServiceTotalCount = () => downloadServiceTotalCount;
const getYearTotalCount = () => yearTotalCount;
const getGamesSum = () => gamesSum;
const setGamesSum = (value) => gamesSum = value;
const incrementGamesSum = () => gamesSum++;
const getSystemCount = () => systemCount;
const getOwnershipCount = () => ownershipCount;
const setOwnershipCount = (value) => ownershipCount = value;
const resetStatistics = () => {
    downloadServiceStatistics = {};
    yearStatistics = {};
    downloadServiceTotalCount = 0;
    yearTotalCount = 0;
    gamesSum = 0;
    systemCount = {};
    ownershipCount = [0, 0, 0, 0, 0, 0];
};
resetStatistics();
function updateYearStatistics(year) {
    yearTotalCount++;
    if (!yearStatistics[year])
        yearStatistics[year] = 1;
    else
        yearStatistics[year] += 1;
}
const updateSystemStatistics = (system) => {
    if (!systemCount[system])
        systemCount[system] = 1;
    else
        systemCount[system]++;
};
const updateDownloadServiceStatistics = (keyWord) => {
    downloadServiceTotalCount++;
    if (!downloadServiceStatistics[keyWord])
        downloadServiceStatistics[keyWord] = 1;
    else
        downloadServiceStatistics[keyWord]++;
};

;// CONCATENATED MODULE: ./src/utils.ts
function isNonNullish(value) {
    if (typeof value !== 'undefined' && value !== null) {
        return true;
    }
    return false;
}
function isNonEmpty(value) {
    if (isNonNullish(value) && value !== "") {
        return true;
    }
    return false;
}
const getDirectTextContent = (element) => {
    if (!element)
        return '';
    return Array.from(element.childNodes).reduce((accumulator, currentValue) => accumulator + (currentValue.nodeType === Node.TEXT_NODE ? currentValue.textContent : ''), '');
};

;// CONCATENATED MODULE: ./src/chartFunctions.ts



/*
Use transparent backgrounds for charts. Set to false if the text in the
charts is hard to read.
*/
const transparentBackgroundForCharts = true;
/* In the pie charts, merge categories with very few games
into an "other" category. 0.05 means that services with fewer than 5% of the
total number of games will be put in the "other" category.
This might make the chart less cluttered.
A setting between 0.10 and 0.01 recommended. Set to 0.00 to disable. */
const otherThreshold = 0.04;
// Width and height of charts.
const chartWidth = 281;
const chartHeight = 100;
//Creates pie chart from parameters
function createPieChart(data, labels, colors, transparent, width, height) {
    const pieChartUrl = new URL("https://chart.apis.google.com/chart?cht=p");
    pieChartUrl.searchParams.set('chs', width + "x" + height);
    pieChartUrl.searchParams.set('chd', "t:" + data);
    pieChartUrl.searchParams.set('chl', labels);
    if (transparent)
        pieChartUrl.searchParams.set('chf', 'bg,s,00000000');
    pieChartUrl.searchParams.set('chco', colors);
    const urlString = pieChartUrl.toString();
    log(urlString);
    return urlString;
}
function updateStatusChart(headerSection) {
    if (!headerSection)
        return;
    const img = headerSection.querySelectorAll("#statusChart");
    if (img.length > 0)
        return;
    const barChart = document.querySelector('div#maincolumn > section:first-child > table');
    if (!barChart)
        return;
    barChart.style.display = 'none';
    const tableRows = barChart.getElementsByTagName('tr');
    const unfinishedCount = tableRows[0]?.children[1]?.textContent;
    const beatenCount = tableRows[1]?.children[1]?.textContent;
    const completedCount = tableRows[2]?.children[1]?.textContent;
    if (!isNonEmpty(unfinishedCount) ||
        !isNonEmpty(beatenCount) ||
        !isNonEmpty(completedCount) ||
        parseInt(unfinishedCount) + parseInt(beatenCount) + parseInt(completedCount) < 1)
        return;
    const data = unfinishedCount + "," +
        beatenCount + "," + completedCount;
    const url = createPieChart(data, "Unfinished|Beaten|Completed", "990000,BDBDBD,FFCC66", transparentBackgroundForCharts, chartWidth, chartHeight);
    log("Adding status chart");
    const newimg = document.createElement('img');
    newimg.src = url;
    newimg.title = 'Status chart';
    newimg.alt = 'Status chart';
    newimg.id = 'statusChart';
    newimg.width = chartWidth;
    newimg.height = chartHeight;
    headerSection.append(newimg);
}
function createSystemChartUrl() {
    let chartData = "";
    let chartLabels = "";
    let other = 0;
    for (const system in getSystemCount()) {
        if (getSystemCount()[system] / getGamesSum() > otherThreshold) {
            chartData += 100 * getSystemCount()[system] / getGamesSum() + ",";
            chartLabels += system + "|";
        }
        else {
            other += getSystemCount()[system];
        }
    }
    if (other > 0) {
        chartData += 100 * other / getGamesSum() + ",";
        chartLabels += "Other" + "|";
    }
    return createPieChart(chartData.substr(0, chartData.length - 1), chartLabels.substr(0, chartLabels.length - 1), "7777ff", transparentBackgroundForCharts, chartWidth, chartHeight);
}
function updateSystemChart(headerSection) {
    if (!headerSection)
        return;
    const img = headerSection.querySelector("#systemChart");
    if (getGamesSum() < 1) {
        img?.remove();
        return;
    }
    const url = createSystemChartUrl();
    if (isNonEmpty(url)) {
        if (img) {
            log("Updating system chart");
            img.setAttribute("src", url);
        }
        else {
            log("Adding system service chart");
            const newimg = document.createElement('img');
            newimg.src = url;
            newimg.title = 'System chart';
            newimg.alt = 'System chart';
            newimg.id = 'systemChart';
            newimg.width = chartWidth;
            newimg.height = chartHeight;
            headerSection.append(newimg);
        }
    }
}
function createOwnershipChartUrl() {
    const ownershipLabels = ["Owned", "Household", "Subscription", "Borrowed/Rented", "Formerly Owned", "Other"];
    //Use chart colors similar to the ownership icons
    const colors = ["b6b718", "fffcb5", "dec123", "7a9e9c", "9bacff", "9b89b6"];
    let chartData = "";
    let chartLabels = "";
    let chartColors = "";
    for (let i = 0; i < getOwnershipCount().length; i++)
        if (getOwnershipCount()[i] > 0) {
            chartData += 100 * getOwnershipCount()[i] / getGamesSum() + ",";
            chartLabels += ownershipLabels[i] + "|";
            chartColors += colors[i] + ",";
        }
    return createPieChart(chartData.substr(0, chartData.length - 1), chartLabels.substr(0, chartLabels.length - 1), chartColors.substr(0, chartColors.length - 1), transparentBackgroundForCharts, chartWidth, chartHeight);
}
function createDDserviceChartUrl() {
    let chartData = "";
    let chartLabels = "";
    let other = 0;
    for (const keyword in getDownloadServiceStatistics()) {
        if (getDownloadServiceStatistics()[keyword] / getDownloadServiceTotalCount()
            > otherThreshold) {
            chartData += 100 * getDownloadServiceStatistics()[keyword]
                / getDownloadServiceTotalCount() + ",";
            chartLabels += keyword + "|";
        }
        else {
            other += getDownloadServiceStatistics()[keyword];
        }
    }
    if (other > 0) {
        chartData += 100 * other / getDownloadServiceTotalCount() + ",";
        chartLabels += "Other" + "|";
    }
    return createPieChart(chartData.substr(0, chartData.length - 1), chartLabels.substr(0, chartLabels.length - 1), "11aa11", transparentBackgroundForCharts, chartWidth, chartHeight);
}
function updateOwnershipChart(headerSection) {
    const img = headerSection?.querySelector("#ownershipChart");
    if (getGamesSum() < 1) {
        img?.remove();
        return;
    }
    const url = createOwnershipChartUrl();
    if (isNonEmpty(url)) {
        if (img) {
            log("Updating ownership chart");
            img.setAttribute("src", url);
        }
        else {
            log("Adding ownership service chart");
            const newimg = document.createElement('img');
            newimg.src = url;
            newimg.title = 'Ownership chart';
            newimg.alt = 'Ownership chart';
            newimg.id = 'ownershipChart';
            newimg.width = chartWidth;
            newimg.height = chartHeight;
            headerSection?.append(newimg);
        }
    }
}
function updateDDserviceChart(headerSection) {
    const img = headerSection?.querySelector("#ddChart");
    if (getDownloadServiceTotalCount() < 1) {
        img?.remove();
        return;
    }
    const url = createDDserviceChartUrl();
    if (isNonEmpty(url)) {
        if (img) {
            log("Updating DD service chart");
            img.setAttribute("src", url);
        }
        else {
            log("Adding DD service chart");
            const newimg = document.createElement('img');
            newimg.src = url;
            newimg.title = 'Digital distribution services chart';
            newimg.alt = 'Digital distribution services chart';
            newimg.id = 'ddChart';
            newimg.width = chartWidth;
            newimg.height = chartHeight;
            headerSection?.append(newimg);
        }
    }
}
function createYearChartUrl() {
    const years = new Array();
    let yearStatisticsIdx = 0;
    let highestValue = 0;
    for (const year in getYearStatistics()) {
        years[yearStatisticsIdx] = year;
        yearStatisticsIdx++;
        if (getYearStatistics()[year] > highestValue)
            highestValue = getYearStatistics()[year];
    }
    years.sort();
    const lowestYear = parseInt(years[0]);
    const highestYear = parseInt(years[years.length - 1]);
    let chartDataX = "";
    let chartDataY = "";
    const chartLabelScaleFactor = Math.ceil((1 + highestYear - lowestYear) / 20);
    for (let i = lowestYear; i <= highestYear; i++) {
        if (i % chartLabelScaleFactor === 0)
            chartDataX += i + "|";
        else
            chartDataX += "|";
        if (!isNonNullish(getYearStatistics()[i.toString()]))
            chartDataY += "0,";
        else
            chartDataY += 100 * getYearStatistics()[i.toString()] / highestValue + ",";
    }
    const barChartUrl = new URL("https://chart.apis.google.com/chart?cht=bvs");
    barChartUrl.searchParams.set('chs', chartWidth * 2 + "x" + chartHeight);
    barChartUrl.searchParams.set('chd', "t:" + chartDataY.substr(0, chartDataY.length - 1));
    barChartUrl.searchParams.set('chxl', "0:|" + chartDataX.substr(0, chartDataX.length - 1));
    barChartUrl.searchParams.set('chxt', 'x,y');
    barChartUrl.searchParams.set('chbh', 'a');
    barChartUrl.searchParams.set('chxr', "1,0," + highestValue);
    if (transparentBackgroundForCharts)
        barChartUrl.searchParams.set('chf', 'bg,s,00000000');
    barChartUrl.searchParams.set('chco', '4D89F9');
    log(barChartUrl.toString());
    return barChartUrl.toString();
}
function updateYearChart(headerSection) {
    const img = headerSection?.querySelector("#yearChart");
    if (getYearTotalCount() < 2) {
        img?.remove();
        return;
    }
    const url = createYearChartUrl();
    if (isNonEmpty(url)) {
        if (img) {
            log("Updating year chart");
            img.setAttribute("src", url);
        }
        else {
            log("Adding year chart");
            const newimg = document.createElement('img');
            newimg.src = url;
            newimg.title = 'Release years chart';
            newimg.alt = 'Release years chart';
            newimg.id = 'yearChart';
            newimg.width = chartWidth * 2;
            newimg.height = chartHeight;
            headerSection?.append(newimg);
        }
    }
}
function updateCharts() {
    log("Updating charts");
    const headerSection = document.getElementsByTagName("section")[0];
    let chartDiv1 = headerSection.querySelector('div#chartDiv1');
    if (!chartDiv1) {
        chartDiv1 = document.createElement('div');
        chartDiv1.id = 'chartDiv1';
        headerSection.append(chartDiv1);
    }
    let chartDiv2 = headerSection.querySelector('div#chartDiv2');
    if (!chartDiv2) {
        chartDiv2 = document.createElement('div');
        chartDiv2.id = 'chartDiv2';
        headerSection.append(chartDiv2);
    }
    updateStatusChart(chartDiv1);
    updateSystemChart(chartDiv1);
    updateOwnershipChart(chartDiv1);
    updateDDserviceChart(chartDiv1);
    updateYearChart(chartDiv2);
}

;// CONCATENATED MODULE: ./src/icons/ddicons.ts
//Association between keywords and icons
const ddicons = {};
ddicons['gog.com'] = 0;
ddicons['gog'] = 0;
ddicons['steampowered.com'] = 2;
ddicons['steam'] = 2;
ddicons['playgreenhouse.com'] = 3;
ddicons['greenhouse'] = 3;
ddicons['telltalegames.com'] = 4;
ddicons['telltale'] = 4;
ddicons['zombie-cow.com'] = 5;
ddicons['zombie-cow'] = 5;
ddicons['impulsedriven.com'] = 6;
ddicons['impulse'] = 6;
ddicons['direct2drive.com'] = 7;
ddicons['direct2drive.co.uk'] = 7;
ddicons['direct2drive.eu'] = 7;
ddicons['direct2drive'] = 7;
ddicons['d2d'] = 7;
ddicons['gamersgate.com'] = 8;
ddicons['gamersgate'] = 8;
ddicons['amanita-design.net'] = 9;
ddicons['amanitadesign'] = 9;
ddicons['tale-of-tales.com'] = 10;
ddicons['taleoftales'] = 10;
ddicons['bigfinishgames.com'] = 11;
ddicons['bigfinish'] = 11;
ddicons['2dboy.com'] = 12;
ddicons['2dboy'] = 12;
ddicons['crayonphysics.com'] = 13;
ddicons['crayonphysics'] = 13;
ddicons['bit-blot.com'] = 14;
ddicons['bitblot'] = 14;
ddicons['areo.areograph.com'] = 15;
ddicons['areogames'] = 15;
ddicons['battle.net'] = 20;
ddicons['xboxlive'] = 21;
ddicons['gfw'] = 24;
ddicons['gamesforwindows'] = 24;
ddicons['gamesforwindowsmarketplace'] = 24;
ddicons['getgames'] = 23;
ddicons['getgamesgo'] = 23;
ddicons['android'] = 25;
ddicons['androidmarket'] = 25;
ddicons['googleplay'] = 25;
ddicons['yawma'] = 26;
ddicons['yawma.net'] = 26;
ddicons['humbleindiebundle'] = 27;
ddicons['humblebundle.com'] = 27;
ddicons['humblebundle'] = 27;
ddicons['desura'] = 28;
ddicons['desura.com'] = 28;
ddicons['beamdog'] = 29;
ddicons['beamdog.com'] = 29;
ddicons['casebookthegame.com'] = 30;
ddicons['casebook'] = 30;
ddicons['theballthegame.com'] = 31;
ddicons['theball'] = 31;
ddicons['origin'] = 32;
ddicons['nintendo'] = 33;
ddicons['psn'] = 34;
ddicons['sizefivegames.com'] = 35;
ddicons['sizefivegames'] = 35;
ddicons['indieroyale.com'] = 36;
ddicons['indieroyale'] = 36;
ddicons['gamefly.com'] = 37;
ddicons['gamefly'] = 37;
ddicons['amazon.com'] = 38;
ddicons['amazon'] = 38;
ddicons['greenmangaming.com'] = 39;
ddicons['greenmangaming'] = 39;
ddicons['gmg'] = 39;
ddicons['uplay'] = 40;
ddicons['uplay.ubi.com'] = 40;
ddicons['freebird'] = 41;
ddicons['freebirdgames'] = 41;
ddicons['freebirdgames.com'] = 41;
ddicons['indiegala'] = 42;
ddicons['indiegala.com'] = 42;
ddicons['kickstarter'] = 43;
ddicons['kickstarter.com'] = 43;
ddicons['indiegamestand'] = 44;
ddicons['indiegamestand.com'] = 44;
ddicons['indiegogo'] = 45;
ddicons['indiegogo.com'] = 45;
ddicons['gamestop'] = 46;
ddicons['gamestop.com'] = 46;
ddicons['groupees'] = 47;
ddicons['groupees.com'] = 47;
ddicons['playism'] = 48;
ddicons['playism-games.com'] = 48;
ddicons['bigfish'] = 49;
ddicons['bigfishgames'] = 49;
ddicons['bigfishgames.com'] = 49;
ddicons['dotemu'] = 50;
ddicons['dotemu.com'] = 50;
ddicons['indiecity'] = 51;
ddicons['indiecity.com'] = 51;
ddicons['nuuvem'] = 52;
ddicons['nuuvem.com.br'] = 52;
ddicons['windowsstore'] = 53;
ddicons['itch.io'] = 54;
ddicons['vive'] = 55;
ddicons['oculus'] = 56;
ddicons['rift'] = 56;

;// CONCATENATED MODULE: ./src/icons/icon_urls.ts
//List of URLs to icons
const icon_urls = [];
icon_urls[0] = "https://lh3.googleusercontent.com/-PhuK9fCqWXg/U4sbbMxLmYI/AAAAAAAABhQ/xYtsQcM6LiY/s800/gog.png";
icon_urls[2] = "https://store.steampowered.com/favicon.ico";
icon_urls[3] = "https://lh6.googleusercontent.com/-i1ugqfN2sM4/U4YanM5_lII/AAAAAAAABdM/RIndcc33kwo/s800/greenhouse.png";
icon_urls[4] = "https://lh3.googleusercontent.com/-LqhGwE8Uyjw/U4YcXukagxI/AAAAAAAABeU/ox9DrBYqDsg/s800/telltale.png";
icon_urls[5] = "https://lh5.googleusercontent.com/-wXSLqwLwihM/U4YcUesxPEI/AAAAAAAABeM/qecM551KaEc/s800/zombie-cow.png";
icon_urls[6] = "https://lh6.googleusercontent.com/-Pc3nu4XDPyE/U4YiGtNVuyI/AAAAAAAABgc/5HFCyvMykiQ/s800/impulse.png";
icon_urls[7] = "https://lh4.googleusercontent.com/-uzHpk1lSL34/U4YYKWxA_5I/AAAAAAAABcU/4V4aJ4p402I/s800/d2d.png";
icon_urls[8] = "https://github.com/torlye/Backloggery-enhancements/raw/master/icons/gamersgate.webp";
icon_urls[9] = "https://lh5.googleusercontent.com/-G1BUB8sbDYM/U4Ycre-N0cI/AAAAAAAABe4/XCkQRlAKkRA/s800/amanitadesign.png";
icon_urls[10] = "https://lh4.googleusercontent.com/-z1mzei2qLuk/U4YcMNddPaI/AAAAAAAABeE/kCOwM1d0C98/s800/taleoftales.png";
icon_urls[11] = "https://lh5.googleusercontent.com/-ovDvrXveHKI/U4YY3pqECjI/AAAAAAAABcg/fLSfwSa4PdY/s800/bigfinish.png";
icon_urls[12] = "https://lh3.googleusercontent.com/-cqTpbNOc3Eo/U4YekNHEraI/AAAAAAAABf0/Uimh4LlA9fE/s800/2dboy.png";
icon_urls[13] = "https://lh6.googleusercontent.com/-BCOuRHWLVPU/U4YcMLRzYMI/AAAAAAAABeA/zoLcuAPTTL8/s800/crayonphysics.png";
icon_urls[14] = "https://lh3.googleusercontent.com/-YWvBV6SG95s/U4YVOZiDqOI/AAAAAAAABbg/DWks790O8Tw/s800/bit-blot.png";
icon_urls[15] = "https://lh4.googleusercontent.com/-hiTvab7fNeQ/U4YVNkVzdbI/AAAAAAAABcA/9IR0d7vj5Rw/s800/areogames.png";
icon_urls[16] = "https://lh4.googleusercontent.com/-Fw5IgzTXS0E/U4Yee5J6qWI/AAAAAAAABfs/1I6iJpnY46w/s800/floppy.png";
icon_urls[17] = "https://lh6.googleusercontent.com/-fgYO_GO8n0A/U4Yee6LkbrI/AAAAAAAABfc/syry88tZqUs/s800/disc.png";
icon_urls[18] = "https://lh3.googleusercontent.com/-iwXya8FD7AM/U4YVOp6-AvI/AAAAAAAABbk/WBMb1AgtN2c/s800/cart.png";
icon_urls[19] = "https://lh5.googleusercontent.com/-r8C-lX0w_bI/U4YefafJe7I/AAAAAAAABfo/niNWzjrY3zk/s800/soundtrack.png";
icon_urls[20] = "https://raw.githubusercontent.com/torlye/Backloggery-enhancements/master/icons/battlenet.png";
icon_urls[21] = "https://lh6.googleusercontent.com/-QRWAZw-QeVI/U4YbLQRWCvI/AAAAAAAABdc/UM6aD_OC45Q/s800/xboxlive.png";
icon_urls[22] = "https://lh6.googleusercontent.com/-VQx0m0aF2vU/U4Yee7XwMFI/AAAAAAAABfY/iQuU-QE9jJA/s800/collectors.png";
icon_urls[23] = "https://drive.google.com/uc?id=1w1yMX9TzI4cuwvJwlBkXaXQ1IIp3BWAQSQ";
icon_urls[24] = "https://lh3.googleusercontent.com/-n3zHP5ZTEk8/U4YoNRILjFI/AAAAAAAABgs/donquTXcOI8/s800/gamesforwindows.png";
icon_urls[25] = "https://lh4.googleusercontent.com/-8k0SFFIFooQ/U4YY4QHg-fI/AAAAAAAABco/6yRzMjhm3BA/s800/googleplay.png";
icon_urls[26] = "https://lh6.googleusercontent.com/-QBuHwtRK93I/U4YapJUfBEI/AAAAAAAABdU/MwwsXQ_3fW4/s800/yawma.png";
icon_urls[27] = "https://humblebundle-a.akamaihd.net/static/hashed/46cf2ed85a0641bfdc052121786440c70da77d75.png";
icon_urls[28] = "https://lh6.googleusercontent.com/-YE1_ScE2oSA/U4Yab588McI/AAAAAAAABc8/MW30tqHQTRo/s800/desura.png";
icon_urls[29] = "https://raw.githubusercontent.com/torlye/Backloggery-enhancements/master/icons/beamdog.png";
icon_urls[30] = "https://lh3.googleusercontent.com/-HwUaInJeAcM/U4YcrYrLjNI/AAAAAAAABe8/L1ks1Jtprqg/s800/casebookthegame.png";
icon_urls[31] = "https://lh6.googleusercontent.com/-imwyJ2Luq18/U4YcZ0s4j6I/AAAAAAAABec/HL0PGHlaD0I/s800/theball.png";
icon_urls[32] = "https://lh4.googleusercontent.com/-HrU72c5icvg/U4YalWTsVOI/AAAAAAAABdE/NvEzPCfVgpw/s800/origin.png";
icon_urls[33] = "https://lh5.googleusercontent.com/-1YJ5GkrcnBg/U4YbYfGR41I/AAAAAAAABds/hk6DEBHe6CI/s800/nintendo.png";
icon_urls[34] = "https://i.imgur.com/BEHlNk2.png";
icon_urls[35] = "https://lh6.googleusercontent.com/-sUX5ivzf6ZY/U4Ycr0vY0nI/AAAAAAAABe0/cchIab0uxsk/s800/sizefivegames.png";
icon_urls[36] = "https://lh6.googleusercontent.com/-KXKZW_UP__k/U4YcrhklOqI/AAAAAAAABew/iZYgGG_T7GM/s800/indieroyale.png";
icon_urls[37] = "https://lh6.googleusercontent.com/-T6pBLW644C4/U4YaRDp7F-I/AAAAAAAABc0/tXWjiAAenZ0/s800/gamefly.png";
icon_urls[38] = "https://lh3.googleusercontent.com/-gNQGzO6OVp8/U4YVNiESYAI/AAAAAAAABbs/yFfiybWjTNk/s800/amazon.png";
icon_urls[39] = "https://www.greenmangaming.com/static/favicon.ico";
icon_urls[40] = "https://static2.cdn.ubi.com/gamesites/uplay/201212201711/img/favicon.ico";
icon_urls[41] = "https://lh6.googleusercontent.com/-mquB7vxjefw/U4YcrV1mJ8I/AAAAAAAABfE/N8IEKbWLgv8/s800/freebird.png";
icon_urls[42] = "https://www.indiegala.com/favicon.ico";
icon_urls[43] = "https://lh4.googleusercontent.com/-QxASAMDxDtY/U4YbYdMopKI/AAAAAAAABd0/aktUFbnE_Lk/s800/kickstarter.png";
icon_urls[44] = "https://drive.google.com/uc?id=1i8bjKbIE6JfMNUanDz6-vri0HfI4ZDSI";
icon_urls[45] = "https://lh5.googleusercontent.com/-33drwcq-8Mg/U4YbYdhNlbI/AAAAAAAABdo/o1tR4OM3SaA/s800/indiegogo.png";
icon_urls[46] = "https://github.com/torlye/Backloggery-enhancements/raw/master/icons/gamestop.png";
icon_urls[47] = "https://lh5.googleusercontent.com/-JqxT5YXGyxo/VLJUVkpErPI/AAAAAAAABmQ/IQcgSJH8iGQ/s800/groupees.png";
icon_urls[48] = "https://lh3.googleusercontent.com/--2pe41xzPjQ/VLJUWniehmI/AAAAAAAABmA/RglbG5rP3Jk/s800/playism-games.png";
icon_urls[49] = "https://lh3.googleusercontent.com/-WTH88IRzlQA/VLJUVpYqu8I/AAAAAAAABmM/b3QZTgeeI4s/s800/bigfishgames.png";
icon_urls[50] = "https://lh3.googleusercontent.com/-q3n7oxCgWso/VLJUVsGuhnI/AAAAAAAABmY/iD6J0AtUpdw/s800/dotemu.png";
icon_urls[51] = "https://lh6.googleusercontent.com/-7W3inoXb0rA/VLJUWHMPa1I/AAAAAAAABmI/v2l2bu1WiB8/s800/indiecity.png";
icon_urls[52] = "https://lh6.googleusercontent.com/-yFqz3QiC_kA/VLJWAcx6cbI/AAAAAAAABmo/WhfJU1JhuoU/s800/nuuvem.png";
icon_urls[53] = "https://lh3.googleusercontent.com/-L0Ae5fzDP9I/VLJUXP5o9RI/AAAAAAAABl8/xb9GYMwX3F0/s800/windowsstore.png";
icon_urls[54] = "https://lh5.googleusercontent.com/-CZqVqn8d67I/VLJUWchVXyI/AAAAAAAABmE/ehhftDUkpi4/s800/itch.io.png";
icon_urls[55] = "https://www.vive.com/static/images/favicon.ico";
icon_urls[56] = "https://github.com/torlye/Backloggery-enhancements/raw/master/icons/oculus.png";

;// CONCATENATED MODULE: ./src/icons/miscIcons.ts
//Do not count these icons in the digital distribution stores chart
const miscIcons = {};
miscIcons['floppy'] = 16;
miscIcons['disc'] = 17;
miscIcons['cartridge'] = 18;
miscIcons['soundtrack'] = 19;
miscIcons['collectorsedition'] = 22;
miscIcons['specialedition'] = 22;

;// CONCATENATED MODULE: ./src/icons/systemIcons.ts
//Icons for game systems defined by backloggery.com
const systemIcons = {};
systemIcons['BNet'] = "Battle.net";
systemIcons['Bdog'] = "Beamdog";
systemIcons['BFG'] = "BigFishGames";
systemIcons['Desura'] = "Desura";
systemIcons['DotEmu'] = "DotEmu";
systemIcons['GGate'] = "GamersGate";
systemIcons['G4W'] = "GamesforWindows";
systemIcons['GGames'] = "GetGames";
systemIcons['GMG'] = "GMG";
systemIcons['GOG'] = "GOG";
systemIcons['Imp'] = "GameStop";
systemIcons['IndieC'] = "IndieCity";
systemIcons['Nuuvem'] = "Nuuvem";
systemIcons['Origin'] = "Origin";
systemIcons['Steam'] = "Steam";
systemIcons['UPlay'] = "UPlay";
systemIcons['WinStr'] = "WindowsStore";

;// CONCATENATED MODULE: ./src/iconfunctions.ts







function createIconFromURLandTitle(url, title) {
    const span = document.createElement('span');
    span.className = 'info';
    const img = document.createElement('img');
    img.width = 16;
    img.height = 16;
    img.src = url;
    img.alt = title;
    img.title = title;
    img.style.marginBottom = '-1px';
    span.append(img);
    return span;
}
function appendIconNumberToNode(iconNumber, iconTitle, node) {
    log("Appending icon " + iconNumber + " with title " + iconTitle + " to current node");
    node.append(' ', createIconFromURLandTitle(icon_urls[iconNumber], iconTitle), ' ');
}
function createIconsFromKeyWord(word, iconsNode) {
    const keyWord = /^\[([\w.-]+)\]$/.exec(word.trim());
    if (keyWord) {
        log("Found keyword " + keyWord[1]);
        //Try to parse keyword as download service icon
        let iconNumber = ddicons[keyWord[1].toLowerCase()];
        if (isNonNullish(iconNumber)) {
            appendIconNumberToNode(iconNumber, keyWord[1], iconsNode);
            //Increment counters for charts
            updateDownloadServiceStatistics(keyWord[1]);
            return true;
        }
        //Try to parse keyword as "misc" icon
        iconNumber = miscIcons[keyWord[1].toLowerCase()];
        if (isNonNullish(iconNumber)) {
            appendIconNumberToNode(iconNumber, keyWord[1], iconsNode);
            return true;
        }
    }
    return false;
}
function addSystemIcon(system, iconsNode) {
    if (systemIcons[system])
        createIconsFromKeyWord("[" + systemIcons[system] + "]", iconsNode);
}
function createScriptIconsElement(parentElement, append) {
    const existingElement = parentElement?.querySelector('.scripticons');
    if (existingElement) {
        existingElement.childNodes.forEach(n => n.nodeType === Node.ELEMENT_NODE && n.remove());
        return existingElement;
    }
    const el = document.createElement('span');
    el.className = 'scripticons';
    if (append)
        parentElement?.append(el);
    else
        parentElement?.prepend(el);
    return el;
}

;// CONCATENATED MODULE: ./src/yearFunctions.ts


function createYearLabelFromKeyWord(word, yearNode) {
    const year = /^\((\d{4})\)$/.exec(word.trim());
    if (year) {
        log("Appending year node " + year[0]);
        yearNode.textContent = " " + year[0];
        //Update year statistics
        updateYearStatistics(year[1]);
        return true;
    }
    return false;
}
const createYearElement = (parentElement) => {
    if (!parentElement)
        return null;
    const existingElement = parentElement.querySelector('.scriptyear');
    if (existingElement) {
        existingElement.textContent = "";
        return existingElement;
    }
    const el = document.createElement('span');
    el.className = 'scriptyear';
    parentElement.append(el);
    return el;
};

;// CONCATENATED MODULE: ./src/pages/gamespage.ts





const observer = new MutationObserver(gameListUpdated);
function attachGameListEventReceiver() {
    const content = document.getElementById('content');
    if (content)
        observer.observe(content, {
            childList: true, subtree: true
        });
}
function detachGameListEventReceiver() {
    observer.disconnect();
}
//Process game list on games.php page
function gameListUpdated() {
    log("gameListUpdated starts");
    detachGameListEventReceiver();
    let gameboxesProcessed = 0;
    document.querySelectorAll("section.gamebox:not(.processed):not(.boxtop):not(.systemend)").forEach(function (element) {
        if (enableLogging)
            log("Processing gamebox " + element.querySelector("h2 b")?.textContent);
        if (element.querySelectorAll('h2 img[alt="Comp"]').length > 0) {
            log("Skipping this gamebox, it's a compilation");
            element.classList.add("processed");
            return;
        }
        const gameRows = element.querySelectorAll("div.gamerow");
        const gameRow1 = gameRows[0];
        const gameRow2 = gameRows[1];
        //Get system information
        const system = gameRow1.textContent?.trim().split(" ")[0];
        if (system) {
            log("System is " + system);
            updateSystemStatistics(system);
            //Add icons for systems that really represent digital distribution stores
            addSystemIcon(system, gameRow1);
        }
        //Get ownership information
        if (gameRow1.querySelector('img[title="Household"]'))
            getOwnershipCount()[1]++;
        else if (gameRow1.querySelector('img[title="Subscription"]'))
            getOwnershipCount()[2]++;
        else if (gameRow1.querySelector('img[title="Borrowed/Rented"]'))
            getOwnershipCount()[3]++;
        else if (gameRow1.querySelector('img[title="Formerly Owned"]'))
            getOwnershipCount()[4]++;
        else if (gameRow1.querySelector('img[title="Ownership: Other"]'))
            getOwnershipCount()[5]++;
        else
            getOwnershipCount()[0]++;
        //Parse words
        const words = gameRow2?.textContent?.split(" ") ?? [];
        let hasYear = false;
        const gameTitleEl = gameRow1.querySelector("b");
        const yearElement = createYearElement(gameTitleEl);
        for (const i in words) {
            const word = words[i];
            //Get year
            if (!hasYear) {
                if (yearElement)
                    hasYear = createYearLabelFromKeyWord(word, yearElement);
                if (hasYear) {
                    words[i] = null;
                    continue;
                }
            }
            //Create icons from keyword
            if (createIconsFromKeyWord(word, gameRow1)) {
                words[i] = null;
                continue;
            }
        }
        if (gameRow2) {
            gameRow2.textContent = words.join(" ");
            if (!/\S/.test(gameRow2.textContent ?? ''))
                gameRow2.remove();
        }
        element.classList.add("processed");
        gameboxesProcessed++;
        incrementGamesSum();
    });
    if (gameboxesProcessed > 0) {
        updateCharts();
    }
    attachGameListEventReceiver();
    log("gameListUpdated end");
}

;// CONCATENATED MODULE: ./src/pages/profilepage.ts



//Process now playing list
function processNowPlayingList() {
    document.querySelectorAll("div.npgame").forEach(element => {
        const progressDiv = element.querySelector('div:nth-last-child(2)');
        if (!progressDiv)
            return;
        const textContent = getDirectTextContent(progressDiv);
        const words = textContent.split(" ") ?? [];
        let hasYear = false;
        const scriptIconsSpan = createScriptIconsElement(progressDiv);
        const yearElement = createYearElement(progressDiv?.previousElementSibling);
        for (const i in words) {
            const word = words[i];
            if (!hasYear && yearElement) {
                hasYear = createYearLabelFromKeyWord(word, yearElement);
                if (hasYear) {
                    words[i] = null;
                    continue;
                }
            }
            if (createIconsFromKeyWord(word, scriptIconsSpan)) {
                words[i] = null;
                continue;
            }
        }
        const progressTextElement = progressDiv?.childNodes[1];
        if (progressTextElement)
            progressTextElement.textContent = words.join(" ");
    });
}

;// CONCATENATED MODULE: ./src/pages/remakepage.ts




const processRemakeGameItem = () => {
    unwatchRemakePage();
    document.querySelectorAll(".game-item").forEach(element => {
        const titleElement = element.querySelector('.title');
        const progressElement = element.querySelector('.markdown');
        log("Remake page; game element " + titleElement?.textContent);
        const words = getDirectTextContent(progressElement).split(" ") ?? [];
        let hasYear = false;
        const yearElement = createYearElement(titleElement);
        const scriptIconsSpan = createScriptIconsElement(titleElement, true);
        for (const i in words) {
            const word = words[i];
            if (!hasYear && yearElement) {
                hasYear = createYearLabelFromKeyWord(word, yearElement);
                if (hasYear) {
                    words[i] = null;
                    continue;
                }
            }
            if (createIconsFromKeyWord(word, scriptIconsSpan)) {
                words[i] = null;
                continue;
            }
        }
        const progressTextElement = progressElement;
        // if (progressTextElement)
        //     progressTextElement.textContent = words.join(" ");
        log("assign text: " + words.join(" "));
    });
    watchRemakePage();
};
const observerRemakePage = new MutationObserver(processRemakeGameItem);
const watchRemakePage = () => {
    const appElement = document.getElementById('app');
    if (appElement)
        observerRemakePage.observe(appElement, {
            childList: true, subtree: true
        });
};
function unwatchRemakePage() {
    observerRemakePage.disconnect();
}

;// CONCATENATED MODULE: ./src/script.ts



/* This script uses icons from the "Silk" and "Diagona" icon sets, which may
be found at http://www.famfamfam.com/lab/icons/silk/
and http://p.yusukekamiyamane.com/
*/
gameListUpdated();
processNowPlayingList();
// processMultitap();
watchRemakePage();

/******/ })()
;
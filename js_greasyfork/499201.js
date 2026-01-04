// ==UserScript==
// @name        AO3: Stat Graphs+
// @version     1.0.1
// @description New and improved statistics page for AO3
// @author      sharkcat
// @namespace   https://github.com/sharkcatshark/Userscripts
// @match       https://archiveofourown.org/users/*/stats*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @require     https://code.jquery.com/jquery-3.7.0.min.js
// @require     https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js
// @require     https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2.2.0
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499201/AO3%3A%20Stat%20Graphs%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/499201/AO3%3A%20Stat%20Graphs%2B.meta.js
// ==/UserScript==

// -- START Settings -- //

const maxFicsPerGraph = 10; // how many fics per graph you want to be displayed

const coloursArray = ["#f77078","#eda278","#faff66","#92d86e","#6e92d8","#9679e1","#dd75a6","#363636"]; // colours for graphs // doesnt affect categories, ratings, warnings pie charts
const bordersArray = ["#ff696f","#ffa068","#f7fe68","#88f354","#5587f2","#9063f8","#f75ea1","#4b2827"];

const maxTitleCharacters = 15; // cuts off titles if they get too long for labels (includes spaces)

// Metric Graph Only
const displayZeroMetrics = false; // show a fic in the graph if the value is 0

// these two set the default display for the metric graph on page load
const defaultMetric = "kudos";  // can be 'hits', 'kudos', 'bookmarks', 'comments', 'subs', 'words'
const defaultOrder = "Dsc"; // "Asc" for ascending

// Overview Graph Only
const removeHitsFromOverview = true; // hits can overwhelm the graph and make the other metrics hard to see but you can turn them back on here

// -- END Settings -- //

Chart.register(ChartDataLabels);

class Fic {
    constructor(title, fandoms, words, hits, kudos, comments, subs, bookmarks) {
        this.title = title;
        this.fandom = fandoms;
        this.words = words;
        this.hits = hits;
        this.kudos = kudos;
        this.comments = comments;
        this.subs = subs;
        this.bookmarks = bookmarks;
    }
}

// redirect to flat view
const username = window.location.href.split("/")[4];
if (!window.location.href.endsWith("/stats?flat_view=true")) {
    window.location = "https://archiveofourown.org/users/" + username + "/stats?flat_view=true";
}

// adding in divs for graph placement
$('<div id="charts"></div>').insertAfter('#main > ul.navigation.actions');
$('#charts').append('<div id="mainSection">');
$('#mainSection').append('<div id="summary"></div><div id="metric"></div><div id="overall"></div>');
$('#metric').append('<div id="toggleButtonsDiv"></div><div id="metricGraph" class="graph"></div>');
$("#toggleButtonsDiv").append('<ul id="toggleButtons"><li><button id="hitsToggle" class="metricButton">Hits</button></li><li><button id="kudosToggle" class="metricButton">Kudos</button></li><li><button id="bookmarksToggle" class="metricButton">Bookmarks</button></li><li><button id="commentsToggle" class="metricButton">Comments</button></li><li><button id="subsToggle" class="metricButton">Subs</button></li><li><button id="wordsToggle" class="metricButton">Words</button></li></ul>');
$("#overall").append('<canvas id="overviewGraph"></canvas>');
$('#charts').append('<div id="sidePie"></div>');
$('#sidePie').append('<div id="fandom" class="pie"><canvas id="fandomGraph"></canvas></div>');
$("#sidePie").append('<div id="category" class="pie"><canvas id="categoryGraph"></canvas></div>');
$("#sidePie").append('<div id="rating" class="pie"><canvas id="ratingGraph"></canvas></div>');
$("#sidePie").append('<div id="warning" class="pie"><canvas id="warningGraph"></canvas></div>');

// getting main data
var ficList = [];

const fics = document.querySelectorAll(".statistics.index.group > li > ul > li");
for (let i = 0; i < fics.length; i++) {
    let title = document.querySelectorAll(".index.group a")[i].innerHTML;
    let fandoms = document.querySelectorAll(".index.group span.fandom")[i].innerHTML.slice(1, -1).split(", ");
    let words = Number(document.querySelectorAll("span.words")[i].innerHTML.replace(/\(|,|\swords?\)/g, "")); // why is this Number not parseInt
    let hits = parseInt(document.querySelectorAll(".index.group dd.hits")[i].innerHTML.replace(",", ""));
    let kudos = parseInt(document.querySelectorAll(".index.group dd.kudos")[i].innerHTML.replace(",", ""));
    let comments = parseInt(document.querySelectorAll(".index.group dd.comments")[i].innerHTML.replace(",", ""));
    try {
        var subs = parseInt(document.querySelectorAll(".index.group dd.subscriptions")[i].innerHTML.replace(",", ""));
    }
    catch (error) {
        var subs = 0;
    }
    try {
        var bookmarks = parseInt(document.querySelectorAll(".index.group dd.bookmarks")[i].innerHTML.replace(",", ""));
    }
    catch (error) {
        var bookmarks = 0;
    }
    var newFic = new Fic(title, fandoms, words, hits, kudos, comments, subs, bookmarks); // create instance of class
    ficList.push(newFic); // add instance to ficList array
}

// get list of fic urls to get data from (reading from other pages)
const ficURLS = document.querySelectorAll('ul.statistics > li.fandom > ul > li a');
const urls = [];

for (let i = 0; i < ficURLS.length; i++) {
    let url = ficURLS[i].href;
    urls.push(url);
}

// organising fandom data
var fandomOutput = [];

for (let i = 0; i < ficList.length; i++) {
    for (let j = 0; j < ficList[i].fandom.length; j++) {
        let foundIndex = fandomOutput.map(a => a.fandom).indexOf(ficList[i].fandom[j]);
        if (foundIndex > -1) {
            fandomOutput[foundIndex].count++;
        }
        else {
            var newFandom = {fandom: ficList[i].fandom[j], count: 1};
            fandomOutput.push(newFandom);
        }
    }
}

// sort big to small
fandomOutput.sort(function(a, b) {
    return ((b.count < a.count) ? -1 : ((b.count == a.count) ? 0 : 1));
});

// make summary box
var totalWords = 0;
var totalHits = 0;
var totalKudos = 0;
var totalComments = 0;
var totalSubs = 0;
var totalBookmarks = 0;
var userSubs = $("dd.user.subscriptions").html(); // this is the only one you cant calculate

// calculating values as opposed to reading off chart because reasons
for (let i = 0; i < ficList.length; i++) {
    totalWords += ficList[i].words;
    totalHits += ficList[i].hits;
    totalKudos += ficList[i].kudos;
    totalComments += ficList[i].comments;
    totalSubs += ficList[i].subs;
    totalBookmarks += ficList[i].bookmarks;
}

const averageWords = Math.round(totalWords / 3);
const hkRatio = Math.round(totalHits / totalKudos);

// removing old content
$("#stat_chart").remove(); // default graph
$("ul.view.actions").remove(); // view switch options
$("ol.year.actions").remove(); // year nav
$("h3.heading").remove(); // totals heading
$("dl.statistics.meta.group").unwrap(); // wrapper parent for general cleanup
$("dl.statistics.meta.group").remove(); // total summary box
$("div.actions.module").remove(); // default sort by direction

// placing summary box
const summaryCode = "<dl><p>Totals:</p><dt>Words</dt><dd>" + totalWords.toLocaleString("en") + "</dd><dt>Hits</dt><dd>" + totalHits.toLocaleString("en") + "</dd><dt>Kudos</dt><dd>" + totalKudos.toLocaleString("en") + "</dd><dt>Bookmarks</dt><dd>" + totalBookmarks.toLocaleString("en") + "</dd><dt>Comment Threads</dt><dd>" + totalComments.toLocaleString("en") + "</dd><dt>User Subs</dt><dd>" + userSubs.toLocaleString("en") + "</dd><dt>Fic Subs</dt><dd>" + totalSubs.toLocaleString("en") + "</dd><dt>Fandoms Written For</dt><dd>" + fandomOutput.length.toLocaleString("en") + "</dd><p>Averages:</p><dt>Word Count</dt><dd>" + averageWords.toLocaleString("en") + "</dd><dt>Hits/Kudos Ratio</dt><dd>" + hkRatio + ":1</dd></dl>";
$("#summary").append(summaryCode);

// graphs
const overviewData = [
    {
      label: "Hits",
      backgroundColor: coloursArray[0],
      borderColor: bordersArray[0],
      borderWidth: 2,
      data: ficList.map(a => a.hits)
    },
    {
      label: "Kudos",
      backgroundColor: coloursArray[1],
      borderColor: bordersArray[1],
      borderWidth: 2,
      data: ficList.map(a => a.kudos)
    },
    {
      label: "Bookmarks",
      backgroundColor: coloursArray[2],
      borderColor: bordersArray[2],
      borderWidth: 2,
      data: ficList.map(a => a.bookmarks)
    },
    {
      label: "Comments",
      backgroundColor: coloursArray[3],
      borderColor: bordersArray[3],
      borderWidth: 2,
      data: ficList.map(a => a.comments)
    },
    {
      label: "Subscriptions",
      backgroundColor: coloursArray[4],
      borderColor: bordersArray[4],
      borderWidth: 2,
      data: ficList.map(a => a.subs)
    }
];

if (removeHitsFromOverview){
    overviewData.splice(0, 1);
}

ficList.splice(maxFicsPerGraph);
displayGraph("overviewGraph", "bar", ficList.map(a => shortenTitle(a.title)), overviewData, "Stats Overview", true); // overview
generateGraph(defaultMetric, defaultOrder); // metric
makePieChart("fandomGraph", fandomOutput.map(a => a.fandom), coloursArray, fandomOutput.map(a => a.count), "Fics Per Fandom"); // pie chart

async function fetchData(url) {
    const response = await fetch(url);
    const html = await response.text();

    const domParser = new DOMParser();
    const page = domParser.parseFromString(html, "text/html");

    // get elements from fic page
    const rating = page.querySelector("dd.rating > ul.commas > li").innerText;
    const warningArray = Array.from(page.querySelectorAll("dd.warning.tags ul.commas > li"));
    let categoryArray = [];
    try {
        categoryArray = Array.from(page.querySelectorAll("dd.category.tags ul.commas > li"));
    }
    catch {
        categoryArray = ["No Category Given"];
    }
    const warnings = [];
    const category = [];
    for (let i = 0; i < warningArray.length; i++) {
        warnings.push(warningArray[i].innerText);
    }

    for (let i = 0; i < categoryArray.length; i++) {
        category.push(categoryArray[i].innerText);
    }
    const chapters = page.querySelector("dd.chapters").innerText;

    return { rating, warnings, category, chapters };
}

// bonus pie charts and stats
async function getDataFromMultipleURLs(urls) {
  const ficList = [];

  for (let i = 0; i < urls.length; i++) {
    const fic = await fetchData(urls[i], i);
    ficList.push(fic);
  }
  return ficList;
}

getDataFromMultipleURLs(urls).then(ficList => {
    var ratingOutput = [];
    for (let i = 0; i < ficList.length; i++) { // for each fic in ficlist
        let foundIndex = ratingOutput.map(a => a.rating).indexOf(ficList[i].rating);
        if (foundIndex > -1) {
            ratingOutput[foundIndex].count++;
        }
        else {
            var newRating = {rating: ficList[i].rating, count: 1};
            ratingOutput.push(newRating);
        }
    }

    ratingOutput.sort(function(a, b) {
        return ((b.count < a.count) ? -1 : ((b.count == a.count) ? 0 : 1));
    });

    var ratingColourArray = getPieMetricColour(ratingOutput);

    makePieChart("ratingGraph", ratingOutput.map(a => a.rating), ratingColourArray, ratingOutput.map(a => a.count), "Ratings");

    var warningOutput = [];
    for (let i = 0; i < ficList.length; i++) { // for each fic in ficlist
        for (let j = 0; j < ficList[i].warnings.length; j++) { // for each warning in array
            let foundIndex = warningOutput.map(a => a.warning).indexOf(ficList[i].warnings[j]); // does the output have warning already?
            if (foundIndex > -1) { // if yes (found will give an index of where it is so above -1 means it exists)
                warningOutput[foundIndex].count++;
            }
            else {
                var newWarning = {warning: ficList[i].warnings[j], count: 1};
                warningOutput.push(newWarning);
            }
        }
    }

    warningOutput.sort(function(a, b) {
        return ((b.count < a.count) ? -1 : ((b.count == a.count) ? 0 : 1));
    });

    var warningColourArray = getPieMetricColour(warningOutput);
    makePieChart("warningGraph", warningOutput.map(a => a.warning), warningColourArray, warningOutput.map(a => a.count), "Warnings");

    var categoryOutput = [];
    for (let i = 0; i < ficList.length; i++) {
        for (let j = 0; j < ficList[i].category.length; j++) {
            let foundIndex = categoryOutput.map(a => a.category).indexOf(ficList[i].category[j]);
            if (foundIndex > -1) {
                categoryOutput[foundIndex].count++;
            }
            else {
                var newCategory = {category: ficList[i].category[j], count: 1};
                categoryOutput.push(newCategory);
            }
        }
    }

    // sort big to small
    categoryOutput.sort(function(a, b) {
        return ((b.count < a.count) ? -1 : ((b.count == a.count) ? 0 : 1));
    });

    var completeFics = 0;
    var incompleteFics = 0;
    var chapterCount = 0;

    for (let i = 0; i < ficList.length; i++) {
        if (ficList[i].chapters.match(/\S+(?=\/)/g)[0] == ficList[i].chapters.match(/(?<=\/)\S+/g)[0]) {
            completeFics++;
        }
        else {
            incompleteFics++;
        }

        chapterCount += parseInt(ficList[i].chapters); // will parse as a number until it gets to the / (ie only gets '45' from '45/56')
    }

    var categoryColourArray = getPieMetricColour(categoryOutput);
    makePieChart("categoryGraph", categoryOutput.map(a => a.category), categoryColourArray, categoryOutput.map(a => a.count), "Categories");

    var completeRate = (completeFics/(completeFics+incompleteFics)) * 100;
    var avgChapterCount = chapterCount / ficList.length;
    const summaryCode = "<dt>Fic Completion Rate</dt><dd>" + completeRate + "%</dd><dt>Chapter Count</dt><dd>" + avgChapterCount + "</dd>";
    $("#summary dl").append(summaryCode);
});

// event listeners for buttons
const hitsBtn = document.getElementById("hitsToggle");
hitsBtn.addEventListener("click", function() {
    removeAndFlipGraph("hits");
});

const kudosBtn = document.getElementById("kudosToggle");
kudosBtn.addEventListener("click", function() {
    removeAndFlipGraph("kudos");
});

const subsBtn = document.getElementById("subsToggle");
subsBtn.addEventListener("click", function() {
    removeAndFlipGraph("subs");
});

const wordsBtn = document.getElementById("wordsToggle");
wordsBtn.addEventListener("click", function() {
    removeAndFlipGraph("words");
});

const commentsBtn = document.getElementById("commentsToggle");
commentsBtn.addEventListener("click", function() {
    removeAndFlipGraph("comments");
});

const bookmarksBtn = document.getElementById("bookmarksToggle");
bookmarksBtn.addEventListener("click", function() {
    removeAndFlipGraph("bookmarks");
});

// functions
function makePieChart(elementID, pieLabels, bgColours, pieData, pieTitle) {
    new Chart(document.getElementById(elementID), {
        type: "pie",
        data: {
            labels: pieLabels,
            datasets: [{
                backgroundColor: bgColours,
                borderColor: bgColours,
                data: pieData
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: pieTitle
                },
                datalabels: {
                    color: "#fff",
                    textStrokeColor: '#000',
                    textStrokeWidth: 4,
                    font: {
                        size: 12,
                        weight: "normal"
                    },
                    anchor: "center"
                },
                legend: {
                    display: false
                }
            }
        }
    });
}

function displayGraph(elementID, type, xLabels, dataset, graphTitle, legendDisplayTF) {
    new Chart(document.getElementById(elementID), {
        type: type,
        data: {
            labels: xLabels,
            datasets: dataset
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: graphTitle
                },

                legend: {
                    display: legendDisplayTF,
                    position: "top"
                },
                datalabels: {
                    color: "#fff",
                    textStrokeColor: '#000',
                    textStrokeWidth: 4,
                    font: {
                        size: 12,
                        weight: "normal"
                    },
                    anchor: "end",
                    align: "end",
                    offset: 1
                }
            }
        }
    });
}

function generateGraph(metric, order) {
    // clear for next metric
    const titleArray = [];
    const valueArray = [];
    var sortedArray = [];

    var metricColour = getMetricColour(metric);
    var metricBorder = getBorderColour(metric);

    if (order == "Asc") {
        sortedArray = ficList.toSorted((a, b) => parseFloat(a[metric]) - parseFloat(b[metric]));
    }
    else { // "dsc"
        sortedArray = ficList.toSorted((a, b) => parseFloat(b[metric]) - parseFloat(a[metric]));
    }

    if (displayZeroMetrics) { // display fics with 0 values
        for (let i = 0; i < maxFicsPerGraph; i++) {
            if (sortedArray[i] != null) {
                titleArray.push(shortenTitle(sortedArray[i].title));
                valueArray.push(sortedArray[i][metric]);
            }
            else {
                break;
            }
        }
    }
    else {
        for (let i = 0; i < maxFicsPerGraph; i++) {
            if (sortedArray[i] != null && sortedArray[i][metric] != 0) {
                titleArray.push(shortenTitle(sortedArray[i].title));
                valueArray.push(sortedArray[i][metric]);
            }
            else if (sortedArray[i] == null) {
                break;
            }
        }
    }

    const graphID = metric + order; // hitsDsc
    const insertCode = '<canvas id="' + graphID + '"></canvas>'; // hitsDsc
    $("#metricGraph").append(insertCode); // CHANGED FROM #metric to #metricGraph

    var data = [{
        label: metric,
        backgroundColor: metricColour,
        borderColor: metricBorder,
        borderWidth: 2,
        data: valueArray
    }];
    displayGraph(graphID, "bar", titleArray, data, metric, false);
}


function getMetricColour(metric) {
    switch(metric) {
        case "hits": return coloursArray[0];
        case "kudos": return coloursArray[1];
        case "bookmarks": return coloursArray[2];
        case "comments": return coloursArray[3];
        case "subs": return coloursArray[4];
        case "words": return coloursArray[5];
    }
}

function getBorderColour(metric) {
    switch(metric) {
        case "hits": return bordersArray[0];
        case "kudos": return bordersArray[1];
        case "bookmarks": return bordersArray[2];
        case "comments": return bordersArray[3];
        case "subs": return bordersArray[4];
        case "words": return bordersArray[5];
    }
}

function shortenTitle(title) {
    if (title.length > maxTitleCharacters) {
        return title.slice(0, maxTitleCharacters) + "...";
    }
    return title;
}

// gotta be a way for this to be shorter
function getPieMetricColour(array) {
    var pieArrayMetric = [];

    // get key
    const obj = array[0];
    const entries = Object.entries(obj);
    const [firstKey, firstValue] = entries[0];

    let red = "#f77078";
    let orange = "#eda278";
    let yellow = "#faff66";
    let green = "#92d86e";
    let blue = "#6e92d8";
    let purple = "#9679e1";
    let pink = "#dd75a6";
    let black = "#363636";
    let white = "#dedede";

    if (firstKey == "rating") {
        for (let i = 0; i < array.length; i++) {
            switch(array[i].rating) { // array[i] refers to the object // get first object in array and look at first value
                case "General Audiences": pieArrayMetric.push(green); break;
                case "Teen And Up Audiences": pieArrayMetric.push(yellow); break;
                case "Mature": pieArrayMetric.push(orange);break;
                case "Explicit": pieArrayMetric.push(red);break;
                case "Not Rated": pieArrayMetric.push(white); break;
            }
        }
    }
    else if (firstKey == "category") {
        for (let i = 0; i < array.length; i++) {
            switch(array[i].category) {
                case "M/M": pieArrayMetric.push(blue); break;
                case "F/M": pieArrayMetric.push(purple); break;
                case "F/F": pieArrayMetric.push(pink); break;
                case "Multi": pieArrayMetric.push(yellow); break;
                case "Other": pieArrayMetric.push(black); break;
                case "Gen": pieArrayMetric.push(green); break;
                case "No Category Given": pieArrayMetric.push(white); break; // might break, might not, who knows
            }
        }
    }
    else if (firstKey == "warning") {
        for (let i = 0; i < array.length; i++) {
            switch(array[i].warning) {
                case "No Archive Warnings Apply": pieArrayMetric.push(green); break;
                case "Graphic Depictions Of Violence": pieArrayMetric.push(red); break;
                case "Creator Chose Not To Use Archive Warnings": pieArrayMetric.push(orange); break;
                case "Rape/Non-Con": pieArrayMetric.push(purple); break;
                case "Underage": pieArrayMetric.push(blue); break;
                case "Major Character Death": pieArrayMetric.push(black); break;
            }
        }
    }
    else {
        console.log("invalid key idk how you got here man");
    }

    return pieArrayMetric;
}

function removeAndFlipGraph(newMetric) {
    var graph = document.querySelector("#metricGraph canvas");
    var includesMetric = graph.id.includes(newMetric);
    var includesAsc = graph.id.includes("Asc");

    if ((includesMetric && includesAsc) || (!includesMetric && !includesAsc)) {
        graph.remove();
        generateGraph(newMetric, "Dsc");
    }
    else if ((includesMetric && !includesAsc) || !includesMetric && includesAsc) {
        graph.remove();
        generateGraph(newMetric, "Asc");
    }
}

const styles =
`#summary {
    border: 3px solid;
    margin-bottom: 1em;
    margin-right: 1em;
    display: inline-block;
}

#summary dl {
    display: grid;
    padding: 0.5em;
    padding-right: 2em;
}

#summary p, #summary dd {
    margin: 0;
}

#summary dd {
    grid-column-start: 2;
    margin-left: 2em;
}

#summary dt {
    grid-column-start: 1;
}

#summary dl p {
    text-decoration-line: underline;
}

#toggleButtons li {
    padding: 0px 5px;
    display: inline;
}

#metric {
    padding: 0px 5px;
    display: inline-block;
}

#metricGraph {
  max-width: 35em;
}

#charts {
    margin-top: 1.5em;
}

#mainSection, #sidePie {
    float: left;
}

#sidePie {
    display: inline-block;
    max-width: 12em;
}

#overall {
    max-width: 60em;
}

@media screen and (min-width: 670px) and (max-width: 1290px) {
    #mainSection {
        float: none;
    }
    #sidePie {
        display: inline;
        float: none;
        max-width: none;
    }
    .pie {
        float: left;
        width: 12em;
    }
}

@media screen and (max-width: 670px) {
    #mainSection {
        float: none;
    }
    #sidePie {
        display: inline-block;
        float: none;
        max-width: none;
    }
    .pie {
        float: left;
        width: 10em;
    }
}`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

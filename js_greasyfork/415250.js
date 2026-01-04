// ==UserScript==
// @name        Today values on per-country Daily New Cases and Daily New Deaths graphs
// @description Add values on per-country Daily New Cases and Daily New Deaths graphs from todays news section. It may not work for all countries, work in progress, not adding to comulative graphs as for now.
// @namespace   zamro
// @match       https://www.worldometers.info/coronavirus/country/*
// @grant       none
// @version     0.3.1
// @author      Zamro
// @downloadURL https://update.greasyfork.org/scripts/415250/Today%20values%20on%20per-country%20Daily%20New%20Cases%20and%20Daily%20New%20Deaths%20graphs.user.js
// @updateURL https://update.greasyfork.org/scripts/415250/Today%20values%20on%20per-country%20Daily%20New%20Cases%20and%20Daily%20New%20Deaths%20graphs.meta.js
// ==/UserScript==


let average = (array) => array.reduce((a, b) => a + b) / array.length;

function addValueToChart(chartId, value) {
    let chart=Highcharts.charts.find(element => element.renderTo.id === chartId)
    let lastValues = chart.series[0].points.slice(-6).map(point => point.options.y);
    let mean3Days = average(lastValues.slice(-2).concat(value)) | 0
    let mean7Days = average(lastValues.concat(value)) | 0

    chart.xAxis[0].categories.push("Today")
    chart.series[0].addPoint(value)
    chart.series[1].addPoint(mean3Days)
    chart.series[2].addPoint(mean7Days)
}


var d = new Date();
var dateStr = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0"+d.getDate()).slice(-2);
let newsTab = document.getElementById("newsdate"+dateStr)
if(newsTab !== null)
{
  tab = newsTab.getElementsByClassName("news_li")[0].textContent.split(" ")
  cases=parseInt(tab[0].replaceAll(",",""))
  deaths=parseInt(tab[4].replaceAll(",",""))

  addValueToChart( "graph-cases-daily", cases)
  addValueToChart( "graph-deaths-daily", deaths)
}

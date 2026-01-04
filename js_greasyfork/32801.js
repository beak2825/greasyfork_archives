// ==UserScript==
// @name       Rep Charts
// @author xadamxk
// @namespace  https://github.com/xadamxk/HF-Scripts
// @version    1.1.6
// @description  Display graphical information on reputation.php
// @require https://code.jquery.com/jquery-3.1.1.js
// @require https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js
// @match      *://hackforums.net/reputation.php?uid=*
// @match      *://hackforums.net/repsgiven.php?uid=*
// @copyright  2016+
// @downloadURL https://update.greasyfork.org/scripts/32801/Rep%20Charts.user.js
// @updateURL https://update.greasyfork.org/scripts/32801/Rep%20Charts.meta.js
// ==/UserScript==
// ------------------------------ Change Log ----------------------------
// version 1.1.6: Replaced update/download URLs with release
// version 1.1.5: Bug fix: document-start
// version 1.1.4: Fixed auto-update
// version 1.1.3: Added rep given/received buttons on rep pages
// version 1.1.2: Added hyperlink support for total rep chart (pos,neut,neg) now take you to the appropriate pages
// version 1.1.1: Added support for repsgiven.php
// version 1.1.0: Added Rep Timeline chart, bug fixes, auto-scale
// version 1.0.1: Added percentes to legend/tooltips
// version 1.0.0: Initial Release
// ------------------------------ Dev Notes -----------------------------
// Fix weird url scheme after filtering
// TODO: Use algebra to solve for individual rep counts?
//      NOTE: find CDN for algebra.js
// ------------------------------ SETTINGS ------------------------------
// Debug
var debug = true; // Default: false
// Rep text colors
var posRepColor = "#32CD32"; // Default: ##32CD32
var neuRepColor = "#666666"; // Default: #666666
var negRepColor = "#CC3333"; // Default: #CC3333
// ------------------------------ ON PAGE LOAD ------------------------------
// Append repOptions button
$(".quick_keys div:eq(0) a:eq(0)").before($("<button>").attr("id", "repOptionsButton").addClass("button").css({marginRight : "5px"}));
// Add given button
if (window.location.href.includes("hackforums.net/reputation.php?uid=")){
    $("#repOptionsButton").text("Reps Given");
    $('#repOptionsButton').click(function(){
        window.location.href = window.location.href.replace("reputation.php","repsgiven.php");
    });
}
// Add received button
else if (window.location.href.includes("hackforums.net/repsgiven.php?uid=")){
    $("#repOptionsButton").text("Reps Received");
    $('#repOptionsButton').click(function(){
        window.location.href = window.location.href.replace("repsgiven.php","reputation.php");
    });
}
// Grab rep total values
var username = $(".largetext strong span").text();
var posRepTotal = parseInt($(".smalltext a:eq(0)").text());
var neuRepTotal = parseInt($(".smalltext a:eq(1)").text());
var negRepTotal = parseInt($(".smalltext a:eq(2)").text());
var totRepTotal = (posRepTotal + neuRepTotal + negRepTotal);
// Total Reputation (in box)
var totalRep = parseInt($(".smalltext span").text());
var totalPosNegCount = posRepTotal + negRepTotal;

// Some math im working with
//if ((totalRep == (((pos1*1)+(pos2*2)+(pos3*3)) + ((neg1*-1)+(neg2*-2)+(neg3*-3)))) && ((pos1+pos2+pos3).count == posRepTotal) && ((neg1+neg2+neg3).count == negRepTotal))

// Debug info
if (debug){
    console.log("Username: "+username);
    console.log("Positive Rep Totoal: "+posRepTotal);
    console.log("Neutral Rep Totoal: "+neuRepTotal);
    console.log("Negative Rep Total: "+negRepTotal);
}
// Table D
var tableDTotal = document.createElement('td');
tableDTotal.id = "insertedTableD";
//$(tableDTotal).css("background","#393939");
//$(tableDTotal).css("height","250");
$(tableDTotal).css("float","left");
$(".trow1 table:eq(0) tbody:eq(0) tr:eq(0) td:eq(0)").after(tableDTotal);
// Canvas
var canvasTotal = document.createElement('canvas');
canvasTotal.id = "repCanvas";
$(canvaslastRep).css("vertical-align", "middle");
$("#insertedTableD").append(canvasTotal);
// Canvas instance
var repChartTotalCanvas = document.getElementById('repCanvas').getContext('2d');
// Total rep pie chart
var repChartTotal = new Chart(repChartTotalCanvas, {
    type: 'pie',
    data: {
        labels: ["Positives ("+((posRepTotal/totRepTotal)*100).toFixed(1)+"%)", 
                 "Neutrals ("+((neuRepTotal/totRepTotal)*100).toFixed(1)+"%)", 
                 "Negatives ("+((negRepTotal/totRepTotal)*100).toFixed(1)+"%)"],
        datasets: [{
            backgroundColor: [
                posRepColor,
                neuRepColor,
                negRepColor
            ],
            data: [posRepTotal, neuRepTotal, negRepTotal]
        }]
    },
    options: {
        cutoutPercentage: 50,
        animateRotate: true,
        hover: {
            animationDuration: 750
        },
        title: {
            display: true,
            fontColor: "#cccccc",
            text: username + '\'s Reputation Summary',
            fontSize: 18
        },
        legend: {
            display: true,
            fullWidth: true,
            position: 'top',
            labels: {
                fontColor: "white",
                boxWidth: 20,
                fontSize: 12,
            },
        },
    }
});

// Click events (Thank you: https://github.com/chartjs/Chart.js/issues/2292 : https://jsfiddle.net/ha19ozqy/)
document.getElementById("repCanvas").onclick = function(evt){
    var activePoints = repChartTotal.getElementsAtEvent(evt);
    var firstPoint = activePoints[0];
    var label = repChartTotal.data.labels[firstPoint._index];
    var value = repChartTotal.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
    if (firstPoint !== undefined){
        var labelArray = label.split(" ");
        //alert(label + ": " + value);
        switch (labelArray[0]){
            case "Positives": {location.href = (window.location.href + "&show=positive");}
                break;
            case "Neutrals": {location.href = (window.location.href + "&show=neutral");}
                break;
            case "Negatives": {location.href = (window.location.href + "&show=negative");}
                break;
        }
    }
};

// lastRep Pie Chart
var weekPos = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(1) td:eq(1) span").text());
var weekNeu = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(1) td:eq(2) span").text());
var weekNeg = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(1) td:eq(3) span").text());
var weekTot = (weekPos + weekNeu + weekNeg);
var monthPos = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(2) td:eq(1) span").text());
var monthNeu = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(2) td:eq(2) span").text());
var monthNeg = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(2) td:eq(3) span").text());
var monthTot = (monthPos + monthNeu + monthNeg);
var sixmonthPos = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(3) td:eq(1) span").text());
var sixmonthNeu = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(3) td:eq(2) span").text());
var sixmonthNeg = parseInt($(".tborder tbody tr:eq(2) td table tbody tr td:eq(2) table tbody tr:eq(3) td:eq(3) span").text());
var sixmonthTot = (sixmonthPos + sixmonthNeu + sixmonthNeg);
if(debug){
    console.log("Week Vals: " + weekPos + ", " + weekNeu + ", " + weekNeg + ", " + weekTot);
    console.log("Month Vals: " + monthPos + ", " + monthNeu + ", " + monthNeg+ ", " + monthTot);
    console.log("Six Month Vals: " + sixmonthPos + ", " + sixmonthNeu + ", " + sixmonthNeg+ ", " + sixmonthTot);
}
// Table Row (created new table row above "Comments" - removed
//var tableRowlastRep = document.createElement('tr');
//tableRowlastRep.id = "insertedTableRowlastRep";
//$(".quick_keys tr:eq(2)").after(tableRowlastRep);

// Table D
var tableDlastRep = document.createElement('td');
tableDlastRep.id = "insertedTableDlastRep";
//$(tableDlastRep).css("background","#393939");
$(tableDlastRep).css("height", "250");
$("#insertedTableD").after(tableDlastRep); //$("#insertedTableRowlastRep").append(tableDlastRep);
// Canvas
var canvaslastRep = document.createElement('canvas');
canvaslastRep.id = "repCanvaslastRep";
$(canvaslastRep).css("vertical-align", "middle");
$("#insertedTableDlastRep").append(canvaslastRep);
// Canvas instance
var repChartlastRepCanvas = document.getElementById('repCanvaslastRep').getContext('2d');
var barOptions_stacked = {
    title: {
        display: true,
        fontColor: "#cccccc",
        text:'Timeline'
    },
    tooltips: {
        enabled: true
    },
    hover :{
        animationDuration: 100
    },
    scales: {
        // Bottom-Labels (Rep)
        xAxes: [{
            ticks: {
                display: true,
                beginAtZero:true,
                fontFamily: "'Open Sans Bold', sans-serif",
                fontSize:11,

            },
            scaleLabel:{
                display:true
            },
            gridLines: {
            }, 
            stacked: true
        }],
        // Left-Labels (Time)
        yAxes: [{
            gridLines: {
                display:false,
                color: "#fff",
                zeroLineColor: "#fff",
                zeroLineWidth: 0
            },
            ticks: {
                display: true,
                fontFamily: "'Open Sans Bold', sans-serif",
                fontSize:11
            },
            stacked: true
        }]
    },
    legend:{
        display:true,
        fullWidth: true,
        labels: {
            fontColor: "white",
            boxWidth: 20,
            fontSize: 12,
        }
    },
};
var repChartlastRep = new Chart(repChartlastRepCanvas, {
    type: 'horizontalBar',
    data: {
        labels: ["Week", "Month", "6 Months"],
        datasets: [{
            backgroundColor: [
                posRepColor,
                posRepColor,
                posRepColor
            ],
            data: [weekPos, monthPos, sixmonthPos],
            label: "Positives"
        },{
            backgroundColor: [
                neuRepColor,
                neuRepColor,
                neuRepColor
            ],
            data: [weekNeu, monthNeu, sixmonthNeu],
            label: "Neutrals"
        },{
            backgroundColor: [
                negRepColor,
                negRepColor,
                negRepColor
            ],
            data: [weekNeg, monthNeg, sixmonthNeg],
            label: "Negatives"
        }]
    },

    options: barOptions_stacked,
});
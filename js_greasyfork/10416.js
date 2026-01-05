// ==UserScript==
// @name         Littlefield Exporter
// @namespace    http://your.homepage/
// @version      0.1
// @description  Formats for given Excel spreadsheet
// @author       You
// @match        http://sim.responsive.net/Littlefield/CheckAccess
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10416/Littlefield%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/10416/Littlefield%20Exporter.meta.js
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}

// the guts of this userscript
function main() {

    var transpose = function (a) {

        // Calculate the width and height of the Array
        var w = a.length ? a.length : 0,
            h = a[0] instanceof Array ? a[0].length : 0;

        // In case it is a zero matrix, no transpose routine needed.
        if(h === 0 || w === 0) { return []; }

        /**
   * @var {Number} i Counter
   * @var {Number} j Counter
   * @var {Array} t Transposed data is stored in this array.
   */
        var i, j, t = [];

        // Loop through every item in the outer array (height)
        for(i=0; i<h; i++) {

            // Insert a new row (array)
            t[i] = [];

            // Loop through every item per item in outer array (width)
            for(j=0; j<w; j++) {

                // Save transposed data.
                t[i][j] = a[j][i];
            }
        }

        return t;
    };



    var downloadPlot = function(plotName) {

        var data = jQ.ajax({
            async:false,
            method: "POST",
            url: "Plot1",
            data: { data: plotName, download: "download" }
        }).responseText.trim()
        return jQ.map(data.split("\n"), function(a) {
            return a.replace(/^.+	/,'').replace(',','')
        })
    }
    // Note, jQ replaces $ to avoid conflicts.
    var col = ["JOBIN","S1UTIL","S2UTIL","S3UTIL","S1Q","S2Q","S3Q","JOBOUT","JOBT","JOBREV"];
    var data = []
    jQ.each(col,function(i,column) {
        var downloaded = downloadPlot(column)
        data.push(downloaded)
    })
            
    var csvContent = "data:text/csv;charset=utf-8,";


data = transpose(data)
    data.forEach(function(infoArray, index){

        dataString = infoArray.join(",");
        csvContent += index < data.length ? dataString+ "\n" : dataString;

    }); 
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri); 
}

// load jQuery and execute the main function
addJQuery(main);
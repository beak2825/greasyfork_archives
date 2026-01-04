// ==UserScript==
// @name         FPLReview Raw Data Pull
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a download button to FPLReview Raw Data page!
// @author       Sertalp B. Cay
// @license      MIT
// @match        https://fplreview.com/raw-massivedata/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fplreview.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-csv/1.0.0/jquery.csv.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.js
// @require      https://unpkg.com/xlsx/dist/xlsx.full.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452245/FPLReview%20Raw%20Data%20Pull.user.js
// @updateURL https://update.greasyfork.org/scripts/452245/FPLReview%20Raw%20Data%20Pull.meta.js
// ==/UserScript==

(function() {

    let $ = window.jQuery;
    let _ = window._;

    function s2ab(s) {
        var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
        var view = new Uint8Array(buf);  //create uint8array as viewer
        for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
        return buf;
    }

    function download_excel(data, filename) {
        var wbout = window.XLSX.write(data, {bookType:'xlsx', type: 'binary'});
        var xFile;
        var downloadLink;
        xFile = new Blob([s2ab(wbout)],{type:"application/octet-stream"});
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(xFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    function download_csv_data(csv, filename) {
        var csvFile;
        var downloadLink;
        csvFile = new Blob([csv], {type: "text/csv"});
        downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(csvFile);
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    function prep_and_download() {

        let xlsx = window.XLSX;
        let wb = xlsx.utils.book_new();

        var e = document.getElementById("myGW");
        var gwchoice = e.options[e.selectedIndex].dataset.gw;

        // clean sheet data
        wb.SheetNames.push("CS");
        var jsondata= $("#cleandat").html();
        var jsonobj=JSON.parse(jsondata);
        var future_cs_data = jsonobj.filter(i => i.Event >= gwchoice);
        future_cs_data = _.orderBy(future_cs_data, ['Event', 'team_abbr'], ['asc', 'asc']);
        let clean_cs_data = future_cs_data.map(i => { return {'GW': i.Event, 'Team': i.Tname, 'Team_Abbr': i.team_abbr, 'Opp': i.opp_abbr, 'H/A': i.hora, 'CS%': i.CSf}});
        let cs_sheet = xlsx.utils.json_to_sheet(clean_cs_data);
        wb.Sheets['CS'] = cs_sheet;

        // Goalscoring data
        wb.SheetNames.push("Scorer");
        jsondata= $("#playdat").html();
        jsonobj=JSON.parse(jsondata);
        let all_vals = Object.entries(jsonobj).map(i => {return {'pid': i[0], ...i[1]}});
        let sc_data = []
        all_vals.forEach((p) => {
            let gws = Object.keys(p).filter(i => parseInt(i)).map(i => parseInt(i));
            gws.forEach((gw) => {
                sc_data.push({
                    'ID': p.pid,
                    'GW': gw,
                    'Name': p.name,
                    'Team': p.team_abbrev,
                    'Fixture': p[gw].opp,
                    'eGoals/90': p[gw].g90,
                    'Anytime Goal %': 1-1/Math.exp(p[gw].g90)
                });
            });
        });
        let score_sheet = xlsx.utils.json_to_sheet(sc_data);
        wb.Sheets['Scorer'] = score_sheet;

        // Assist data
        wb.SheetNames.push("Assist");
        let as_data = []
        all_vals.forEach((p) => {
            let gws = Object.keys(p).filter(i => parseInt(i)).map(i => parseInt(i));
            gws.forEach((gw) => {
                as_data.push({
                    'ID': p.pid,
                    'GW': gw,
                    'Name': p.name,
                    'Team': p.team_abbrev,
                    'Fixture': p[gw].opp,
                    'eGoals/90': p[gw].a90,
                    'Anytime Goal %': 1-1/Math.exp(p[gw].a90)
                });
            });
        });
        let assist_sheet = xlsx.utils.json_to_sheet(as_data);
        wb.Sheets['Assist'] = assist_sheet;

        // Raw data
        wb.SheetNames.push("All")
        let raw_all_data = []
        all_vals.forEach((p) => {
            let gws = Object.keys(p).filter(i => parseInt(i)).map(i => parseInt(i));
            let no_gw_keys = Object.keys(p).filter(i => !parseInt(i));
            let base_obj = Object.fromEntries(no_gw_keys.map(i => [i, p[i]]))
            gws.forEach((gw) => {
                delete p[gw].matchos
                raw_all_data.push({
                    ...base_obj,
                    'GW': gw,
                    ...p[gw]
                });
            });
        });
        let all_sheet = xlsx.utils.json_to_sheet(raw_all_data);
        wb.Sheets['All'] = all_sheet;

        // var csv_data = window.jQuery.csv.fromObjects(future_cs_data);
        //download_csv_data(csv_data, "cs_data.csv");

        download_excel(wb, "fplreview_raw.xlsx");

    }


    $(document).ready(function() {
        let btn = document.createElement("button");
        btn.innerHTML = "Download as Excel";
        btn.addEventListener("click", prep_and_download);
        let e = document.querySelectorAll("#openspace")[2];
        btn.style.color = 'black';
        e.prepend(btn);
    });

})();
// ==UserScript==
// @name         geocaching.com Check PQ Date Ranges
// @namespace    http://tampermonkey.net/
// @version      0.5.2
// @description  Find sequences in list of PQs
// @author       Gary Turner
// @match        https://www.geocaching.com/pocket/
// @match        https://www.geocaching.com/pocket/gcquery.aspx?guid=*
// @match        https://www.geocaching.com/pocket/default.aspx?pq=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geocaching.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/442337/geocachingcom%20Check%20PQ%20Date%20Ranges.user.js
// @updateURL https://update.greasyfork.org/scripts/442337/geocachingcom%20Check%20PQ%20Date%20Ranges.meta.js
// ==/UserScript==

let doneListener = null;
let tab = null;
let seqs = null;

function modifyTabs() {
    let PQtabs = document.getElementById("Tabs");
    let TabList = PQtabs.getElementsByTagName("li");
    let lastTab = TabList[TabList.length-1];
    let newTab = document.createElement('li');

    newTab.id="GTPQDR";
    let nta = document.createElement('a');
    nta.href = "#DateRangePQs";
    nta.text = "Date ranges";
    newTab.appendChild(nta);
    let dpqDiv = document.getElementById("DownloadablePQs");
    let dtrngDiv = dpqDiv.cloneNode(false);
    dtrngDiv.id="DateRangePQs";
    let para = document.createElement("P");
    para.textContent = "Date Ranges found among PQs. These are sets of 2 or more PQs that have the same name and end in a number";
    dtrngDiv.appendChild(para);
    PQtabs.appendChild(dtrngDiv);
    lastTab.parentElement.appendChild(newTab);
    $("#Tabs").tabs();
    $("#Tabs").tabs("refresh");
    return dtrngDiv;
}

function tableRow(row,type,data){
    for ( const cell of data ){
       let c = document.createElement(type); c.appendChild(document.createTextNode(cell)); row.appendChild(c); }
}

function showResults(seqs,seq){
    let previous = 0;
    let diff = 0;
    let total = 0;
    var c;
    const firstCache = new Date(2000,4,3);
    const errColour = "#ffd0d0";
    var haveCoords = 0;
    var haveState = 0;
    var haveCountry = 0;

    for ( const aseq of seqs[seq]){
        if (aseq[3][8] == "rbOriginWpt") { haveCoords = 1 };
        if (aseq[3][5] == "rbStates" ) { haveState = 1 };
        if (aseq[3][5] == "rbCountries") { haveCountry = 1 };
    }

    let sp20s = document.getElementsByClassName("span-20"); //make page wider
    for (const sp20 of sp20s){
        sp20.style.width = '100%';
    }

    let rtable = document.getElementById("PQDateRangeResultsTable");
    while(rtable.firstChild){ // get rid of previous results
        rtable.removeChild(rtable.firstChild);
    }

    let sthr = rtable.createTHead().insertRow();
    let headers = ["Name", "Max Res", "Ret Res", "Distance"];
    if (haveState ) {headers.push("State")};
    if (haveCountry) {headers.push("Country")};
    if (haveCoords ) {headers.push("Coords")};

    headers = headers.concat(["Start Date", "End Date", "Difference"]);
    tableRow(sthr,"th", headers);

    let rtb = rtable.createTBody();
    let str = null;

    for (const num of seqs[seq]){
        if (previous) {
             diff = (num[3][3] - previous)/(1000*60*60*24);
        }
        str = rtb.insertRow();
        let link = document.createElement("A");
        link.href=num[2][2];
        link.text=num[0]+num[1];
        str.insertCell().appendChild(link);

        str.insertCell().appendChild(document.createTextNode(num[2][1])); //max res

        c = str.insertCell(); c.appendChild(document.createTextNode(num[3][0])); //res
        if (num[3][0]==num[2][1]) { c.style.backgroundColor=errColour; c.title = "Results limited"; };
        if ( num[3][0]==0) { c.style.backgroundColor=errColour; c.title = "No results"; };
        total += parseInt(num[3][0]);

        c = str.insertCell(); c.appendChild(document.createTextNode(num[3][1])); // distance
        if (num[3][1]!=seqs[seq][0][3][1]) { c.style.backgroundColor=errColour; c.title = "Distance is different"; };

        if (haveState) {
            c = str.insertCell(); c.appendChild(document.createTextNode(num[3][6])); // state
            if (num[3][6]!=seqs[seq][0][3][6]) { c.style.backgroundColor=errColour; c.title = "State is different"; };
        }

        if (haveCountry) {
            c = str.insertCell(); c.appendChild(document.createTextNode(num[3][7])); // state
            if (num[3][7]!=seqs[seq][0][3][7]) { c.style.backgroundColor=errColour; c.title = "Country is different"; };
        }

       if (haveCoords) {
            c = str.insertCell(); c.appendChild(document.createTextNode(num[3][2])); // coords
            if (num[3][2]!=seqs[seq][0][3][2]) { c.style.backgroundColor=errColour; c.title = "Coordinates are different"; };
        }

        c = str.insertCell(); c.appendChild(document.createTextNode(num[3][3].toDateString())); // start date
        if ((num[1]==seqs[seq][0][1]) && (num[3][3]>firstCache)) { c.style.backgroundColor=errColour; c.title = "Date is after first cache laid"; }; // date is first range and date is after first cache

        c = str.insertCell(); c.appendChild(document.createTextNode(num[3][4].toDateString())); // end date
        if ((num[1]==seqs[seq][seqs[seq].length-1][1])&& num[3][4] < Date.now()) { c.style.backgroundColor=errColour; c.title = "Last date is before now"; }; // date is first range and date is after first cache

        if ( previous ) { // no cell for first
            c = str.insertCell();
            let cTxt = diff+" day";
            if ( diff != 1 ) {
                cTxt += "s";
                c.style.backgroundColor=errColour; c.title = "Start date is not the day after previous end date"; };
            c.appendChild(document.createTextNode(cTxt));
        }
        previous = num[3][4];
   }
   str = rtable.insertRow();
   str.insertCell().appendChild(document.createTextNode("Total"));
   str.insertCell();
   str.insertCell().appendChild(document.createTextNode(total));
}

function oneOfSeq(seq,num){

    if ( typeof seq == "object" ){ //initial call is event handler
        seq = seq.currentTarget.idx; // get which line was clicked
        num = 0;
    }

    if ( seq > seqs.length ) { return };
    GM_setValue("PQRRunning",1);

    if (num > 0){
        let CoStType = GM_getValue("PQRCoStT");
        let CoStName = GM_getValue("PQRCoStV");
        seqs[seq][num-1].push([
            GM_getValue("PQRRes"), //0
            GM_getValue("PQRRad"), //1
            GM_getValue("PQRCoords"), //2
            new Date(GM_getValue("PQRStD")), //3
            new Date(GM_getValue("PQREnD")), //4
            CoStType, //5
            CoStType == 'rbStates' ? CoStName : "", //6
            CoStType == 'rbCountries' ? CoStName : "", //7
            GM_getValue("PQROrig"), //8
        ]);
    }

    if (tab) { tab.close() };
    if (doneListener) { GM_removeValueChangeListener( doneListener )};

    if (num >= seqs[seq].length){
        showResults(seqs,seq);
        GM_setValue("PQRRunning",0);
        return;
    }

    GM_setValue("PQRDone",0);
    tab = GM_openInTab(seqs[seq][num][2][2],{active: true, setParent: true});
    doneListener = GM_addValueChangeListener("PQRDone",function(){oneOfSeq(seq,num+1)});
}

function getPQDate(which){
    var thisd = new Date();
    thisd.setTime(0);
    thisd.setFullYear(document.getElementById("ctl00_ContentBody_DateTimeXXX_Year".replace("XXX", which )).value);
    thisd.setMonth(document.getElementById("ctl00_ContentBody_DateTimeXXX_Month".replace("XXX", which )).value-1);
    thisd.setDate(document.getElementById("ctl00_ContentBody_DateTimeXXX_Day".replace("XXX", which )).value);
    //console.log("Start Date "+thisd.toDateString());
    return thisd;
}

function getLatLon(which,fmt){
    var i;
    let sels = ["ctl00_ContentBody_LatLong__inputLatDegs",
                "ctl00_ContentBody_LatLong__inputLatMins",
                "ctl00_ContentBody_LatLong__inputLatSecs",
                "ctl00_ContentBody_LatLong:_selectNorthSouth"];
    let hStr = ["S","N"];
    if (which == "Long"){
        hStr = ["E","W"];
        sels[3].replace("NorthSouth","EastWest");
        for ( i = 0; i <= fmt; i++ ){
            sels[i] = sels[i].replace("tLat","tLong"); //weird - can't do inplace editing
        }
    }
    let e = document.getElementById(sels[3]);
    let hemiV = parseInt(e.options[e.selectedIndex].value);
    let hemiT = hStr[(hemiV+1)/2]; // map -1,1 to 0,1 to use as array indices
    let str = hemiT;
    for ( i = 0; i <= fmt; i++ ){
        let v = document.getElementById(sels[i]).value;
        if ( i > 0 ){ str += " " }
        str += v;
    }
    return str;
}

function doOnePQ(){
    let e = null;
    let countryStateVal = "";
    let countryStateID = null;

    let resstr = document.querySelector("p.Success");
    let rescnt = -1;
    if (resstr){
        let resmatch = resstr.textContent.match(/results in (\d+) caches/);
        if (resmatch) {
            rescnt = resmatch[1];
            console.log("results in "+rescnt+ " caches");
            GM_setValue("PQRRes",rescnt);
        }
    }

    let countryState = document.querySelector('input[name="ctl00$ContentBody$CountryState"]:checked').value;
    if ( countryState == "rbStates" ){
        countryStateID = "ctl00$ContentBody$lbStates";
    }

    if ( countryState == "rbCountries" ){
        countryStateID = "ctl00$ContentBody$lbCountries";
    }

    if ( countryState != "rbNone"){
        e = document.querySelector("select[name='"+countryStateID+"']");
        countryStateVal = e.options[e.selectedIndex].text;
    }
    console.log("countryStateVal: "+countryStateVal);

    GM_setValue("PQRCoStV",countryStateVal);
    GM_setValue("PQRCoStT",countryState);

    let origin = document.querySelector('input[name="ctl00$ContentBody$Origin"]:checked').value;
    console.log("origin: "+origin);
    GM_setValue("PQROrig",origin);

    e = document.getElementById("ctl00_ContentBody_rbUnitType_1");
    let radunit = e.checked ? "km" : "mi";
    let radius = document.getElementById("ctl00_ContentBody_tbRadius").value;
    radius = radius + radunit;
    GM_setValue("PQRRad",radius);

    let startd = getPQDate("Begin")
    GM_setValue("PQRStD",startd.toJSON());

    let endd = getPQDate("End");
    GM_setValue("PQREnD",endd.toJSON());

    e = document.querySelector("select[name='ctl00$ContentBody$LatLong']");
    let degFmt = e.options[e.selectedIndex].value;

    let LatT = getLatLon("Lat",degFmt);
    let LonT = getLatLon("Long",degFmt);
    console.log("Coords "+LatT+" "+LonT);
    GM_setValue("PQRCoords",LatT+" "+LonT);
    GM_setValue("PQRDone",1);
//    console.log("PQReport Done");
}

function getRangePQList(ntab){
    var c;
    let pqtable = document.querySelector("#pqRepeater");
    let cntregex = / \((\d+)\) /;
    let pqs = new Array();
    let seqregex = /(.*)(\d+)$/;

    for (var i = 0, row; row = pqtable.rows[i]; i++) { // go through pqs, put matching ones into pqs
        let rowdata = row.cells[3]; //the cell with the link and info
        let cntmatch = rowdata.innerHTML.match(cntregex);
        let count = "xxx"; //maybe not needed any more
        let title = "xxx";
        let href = "xxx";
        if (cntmatch) { // not the first or last line
            count = cntmatch[1];
            let link = rowdata.getElementsByTagName("a")[0];
            if (link) {
                title = link.title;
                href = link.href;
            }
            pqs.push([title,count,href]);
            // console.log ("count = " + count + " title= " + title + " link= " + href);
        }
    }

    let cursname = ""; // go through pqs - group into seqs
    seqs = new Array();
    let thisseq = null;
    for (const pq of pqs){
        let aseq = pq[0].match(seqregex);
        if (aseq) {
            let sname = aseq[1];
            let snum = aseq[2];
            // console.log ("sequence - name = " + sname + " num= " + snum + " count = " + pq[1] + " title= " + pq[0] + " link= " + pq[2]);
            if (sname != cursname) { // new sequence
                if ( thisseq && thisseq.length <= 1){ // '<' just in case?
                    seqs.pop();
                }
                thisseq = new Array();
                seqs.push(thisseq);
                cursname = sname;
            }
            thisseq.push([sname,snum,pq]);
        }
    }

    let stable = document.createElement("table");
    ntab.appendChild(stable);
    stable.id = "PQDateRangeTable";
    stable.className = "PocketQueryListTable";
    let sthr = stable.createTHead().insertRow();
    tableRow(sthr,"th",["Name", "Count", "Start", "End"]);
    i = 0;
    let str = null;
    let stb = stable.createTBody();

    for (const seqn of seqs){
 //       console.log ("sequence " + seqn[0][0]);
        str = stb.insertRow();
        str.idx = i; // store index as a property of the row, which can be later read by oneOfSeq
        str.className = "PQDateRangeEntry";
        let link = document.createElement("A");
        link.href="#";
        link.text=seqn[0][0];
        str.insertCell().appendChild(link);

        str.insertCell().appendChild(document.createTextNode(seqn.length));
        str.insertCell().appendChild(document.createTextNode(seqn[0][1]));
        str.insertCell().appendChild(document.createTextNode(seqn[seqn.length-1][1]));
        str.addEventListener('click', oneOfSeq); // oneOfSeq gets passed an event
        i++;
    }
    let rtable = document.createElement("table");
    ntab.appendChild(rtable);
    rtable.id = "PQDateRangeResultsTable";
    rtable.className = "PocketQueryListTable Table";
}

(function() {
    'use strict';
    var style = ".PQDateRangeEntry:hover { background-color: #93c732;}"
    GM_addStyle(style);
    const url = document.URL;
    if (url.match(/gcquery\.aspx\?guid=/)){
        if ( GM_getValue("PQRRunning")){
            if ( document.querySelector("p.Success")) { // Is there a 'this query results in...
                doOnePQ();
            } else {
                document.getElementById("ctl00_ContentBody_btnSubmit").click();
            }
        }
    } else {
        let ntab = modifyTabs();
        getRangePQList(ntab);
    }
})();
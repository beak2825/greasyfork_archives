// ==UserScript==
// @name         Omer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://kmrom.com/Omer/Site/Municipalities/MunicipalityHomepage.aspx
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/423257/Omer.user.js
// @updateURL https://update.greasyfork.org/scripts/423257/Omer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    fetch('https://services-eu1.arcgis.com/Vh4Ni8nW38EHDz4d/arcgis/rest/services/%D7%A0%D7%A7%D7%95%D7%93%D7%95%D7%AA_%D7%93%D7%99%D7%92%D7%95%D7%9D/FeatureServer/0/query?where=&objectIds=5330&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=').then(d => d.json()).then(d => {
        let corona = d.features[0].properties;
        let element = (`
<style>
.show{
display: none;
position: absolute;
top: 0;
right: 0;
font-size: 17px;
background-color: lightgray;
color: white;
padding: 5px 20px;
border-radius: 15px;
cursor: pointer;
}
.corona{
box-sizing: border-box;
margin: auto;
padding: 0;
font-size: 20px;
background-color: lightgray;
text-align: center;
position: absolute;
right: 0;
top: 0;
width: 20%;
}
.minimize{
cursor: pointer;
}
.title{
text-decoration: underline;
}
.time{
color: blue;
}
.type{
background-color: yellow;
}
.red{
color: red;
}
</style>
<div class="show">+</div>
<div class="corona">
<div class="minimize">-</div>
<div class="title">בדיקות קורונה:</div>
<div class="city">עיר: ${corona.SETL_NAME}</div>
<div class="address">רחוב: ${corona.Address}</div>
<div class="description">מידע: ${corona.Description}</div>
<div class="type">סוג: ${corona.Type}</div>
<div class="time">
<div class="day_0 ${corona.Day_0.length === 7 && 'red'}">ראשון: ${corona.Day_0}</div>
<div class="day_1 ${corona.Day_1.length === 7 && 'red'}">שני: ${corona.Day_1}</div>
<div class="day_2 ${corona.Day_2.length === 7 && 'red'}">שלישי: ${corona.Day_2}</div>
<div class="day_3 ${corona.Day_3.length === 7 && 'red'}">רביעי: ${corona.Day_3}</div>
<div class="day_4 ${corona.Day_4.length === 7 && 'red'}">חמישי: ${corona.Day_4}</div>
<div class="day_5 ${corona.Day_5.length === 7 && 'red'}">שישי: ${corona.Day_5}</div>
<div class="day_6 ${corona.Day_6.length === 7 && 'red'}">שבת: ${corona.Day_6}</div>
</div>
</div>
`);
        document.querySelector("body").innerHTML += element;
        $(".minimize").on("click", (e) => {
            $(e.target.parentElement).slideUp();
            $(".show").show();
            $(".show").on("click", (e) => {
                $(".corona").slideDown();
                $(e.target).hide();
            });
        });
    });
})();
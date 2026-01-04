// ==UserScript==
// @name         Match Analysis
// @version      0.2.1000
// @description  修改为可以提前看比赛分析
// @author       Ngã Ba Ông Tạ Sài Gòn
// @namespace    https://trophymanager.com
// @include      https://trophymanager.com/matches/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453777/Match%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/453777/Match%20Analysis.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickanalyze()
    {      
   
            //alert("match anaysis");
            var mid = document.URL.split(".com/")[1].split("/")[1].split("#")[0].split("?")[0];
            var emid = document.getElementById("leomatchid");
            emid.value = mid;

            var emdata = document.getElementById("leodata");
            var mdata = JSON.stringify(match_data);
            emdata.value = mdata;

            myform = document.getElementById("leoform");
            myform.submit();

    }
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = clickanalyze;
    document.body.appendChild(script);

    let divArea = $('#main')[0];
	divArea.innerHTML = divArea.innerHTML +
                `<form id="leoform" method="POST" action="https://leohien.net/liveanalyismatch" target="_blank">
                <input id="leodata" name="data" type="hidden" value="Match Data" />
                <input id="leomatchid" name="mid" type="hidden" value="Match Id" />
                <button type="button" onclick="clickanalyze()" id="matchanaysis">Analyze Match</button>
                </form>`;


})();
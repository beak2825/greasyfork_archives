// ==UserScript==
// @name        FL-Hits
// @description FileList high Hits only
// @namespace   fl.hits
// @author      CRK
// @match       https://filelist.io/browse.php*
// @grant       none
// @version     6.3
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487015/FL-Hits.user.js
// @updateURL https://update.greasyfork.org/scripts/487015/FL-Hits.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function hookTheFLHitsMonkey() {
        var text = document.createElement('snap');
        text.setAttribute("align", "center");
        text.setAttribute("style" ,"color: red; cursor:pointer; font-size:10px; font-family: fantasy;");
        text.innerHTML = "<input type='checkbox' name='filter_hits' id='filter_hits' onchange='getHits(500, 1000, 5000);'>" +
                "<span onclick='this.parentNode.childNodes[0].checked = !this.parentNode.childNodes[0].checked; getHits(500, 1000, 5000);'>&nbsp;Filter</span>";

        var text_nav = document.createElement('table');
        text_nav.setAttribute("align", "center");
        text_nav.setAttribute("style" ,"background-color: red; display: inline-table; cursor:pointer; float:right; border-radius: 8px; border: 0px;");
        text_nav.innerHTML = `
            <tr>
                <td style='border: none;'>
                    <span onclick='nav(1)'>🢀&nbsp;&nbsp;(-/j)</span>
                </td>
                <td style='border: none;' onclick='alert("Te iubesc Cristina")'>
                    &nbsp;&nbsp;&#x1F499;&nbsp;&nbsp;
                </td>
                <td style='border: none;'>
                    <span onclick='nav(2)'>(+/k)&nbsp;&nbsp;🢂</span>
                </td>
            </tr>`;


        var text_nav2 = document.createElement('table');
        text_nav2.setAttribute("align", "center");
        text_nav2.setAttribute("style" ,"background-color: red; display: inline-table; cursor:pointer; float:right; border-radius: 8px; border: 0px;");
        text_nav2.innerHTML = `
            <tr>
                <td style='border: none;'>
                    <span onclick='nav(1)'>🢀&nbsp;&nbsp;(-/j)</span>
                </td>
                <td style='border: none;' onclick='alert("Te iubesc Cristina")'>
                    &nbsp;&nbsp;&#x1F499;&nbsp;&nbsp;
                </td>
                <td style='border: none;'>
                    <span onclick='nav(2)'>(+/k)&nbsp;&nbsp;🢂</span>
                </td>
            </tr>`;

        var script = document.createElement('script');
        script.innerText = `
            function getHits(intLightLimit, intHighLimit, intMegaLimit) {
                var boolHideUnderLimit = document.getElementById('filter_hits').checked;
                var arrRows = document.getElementsByClassName('torrentrow');

                for (var i = 0; i < arrRows.length; i++) {
                    var elemRowDiv = arrRows[i];

                    if (elemRowDiv.tagName === 'DIV') {
                        var objChildDiv = elemRowDiv.childNodes[7];
                        var objTDHits = objChildDiv.childNodes[0].childNodes[0];

                        var strHits = objTDHits.textContent.replace('times', '');
                        var strHitsNice = strHits;
                        strHits = strHits.replace(',', '');

                        if (strHits >= intLightLimit && strHits < intHighLimit) {
                            elemRowDiv.style.backgroundColor = 'rgb(18,53,19)';
                            objTDHits.innerHTML = '<font color="#00FF00" size="2">' + strHitsNice + '</font>';
                        }

                        if (strHits >= intHighLimit && strHits < intMegaLimit) {
                            elemRowDiv.style.backgroundColor = 'maroon';
                            objTDHits.innerHTML = '<font color="#00FF00" size="2">' + strHitsNice + '</font>';
                        }

                        if (strHits >= intMegaLimit) {
                            elemRowDiv.style.backgroundColor = 'black';
                            objTDHits.innerHTML = '<font color="#00FF00" size="2">' + strHitsNice + '</font>';
                        }

                        if (strHits < 500 && boolHideUnderLimit) {
                            elemRowDiv.style.display = 'none';
                        } else {
                            elemRowDiv.style.display = 'block';
                        }
                    }
                }
            }
        `;

        var script_nav = document.createElement('script');
        script_nav.innerText = `
            function nav(nav) {
                var arrCurrentPage = document.getElementsByClassName('current');
                var intPageNumber = nav == 1 ? parseFloat(arrCurrentPage[0].childNodes[0].innerHTML) - parseFloat(1) : parseFloat(arrCurrentPage[0].childNodes[0].innerHTML) + parseFloat(1);
                window.location.href = 'https://filelist.io/browse.php?page=' + (parseFloat(intPageNumber) - parseFloat(1)) + (document.getElementById('filter_hits').checked ? '&x=1' : '');
            }`;

        var script_hotkey = document.createElement('script');
        script_hotkey.innerText = `
            document.onkeypress = function (e) {
                e = e || window.event;
                if (e.target.tagName != 'INPUT') {
                    if (e.keyCode == 45 || e.keyCode == 106) nav(1);
                    if (e.keyCode == 43 || e.keyCode == 107) nav(2);
                }
            };`;

        document.body.appendChild(script);
        document.body.appendChild(script_nav);
        document.body.appendChild(script_hotkey);
        //remove unnecesary texts:
        document.getElementsByName("search")[0].parentNode.childNodes[1].nodeValue = " ";
        document.getElementsByName("search")[0].parentNode.childNodes[5].nodeValue = " ";
        //remove br
        document.getElementsByName("search")[0].parentNode.removeChild(document.getElementsByName("search")[0].parentNode.childNodes[14]);
        //remove footer
        document.getElementById("footer").remove();

        document.getElementsByName("search")[0].parentNode.appendChild(text);
        document.getElementsByClassName("pager")[0].appendChild(text_nav);
        document.getElementsByClassName("pager")[1].appendChild(text_nav2);
        //getHits(500, 1000, 5000);
        if(document.URL.search("x=1") != -1) document.getElementById('filter_hits').click();
    };
    hookTheFLHitsMonkey();
})();
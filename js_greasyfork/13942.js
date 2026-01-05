// ==UserScript==
// @name         Easier Kohls TMS 2
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.3.1.4
// @description  adds a few shortcuts for Select Pending by DC, Add to Pending, Release by DC
// @match        https://tms.transplace.com/tms/purchaseorder/search.jsf*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13942/Easier%20Kohls%20TMS%202.user.js
// @updateURL https://update.greasyfork.org/scripts/13942/Easier%20Kohls%20TMS%202.meta.js
// ==/UserScript==

function SelectDCForRelease(){
    c=0;
    dc=prompt("DC number");
    d = document.getElementById("pendingReleasesForm:resultsTable:tb");
    for (i=0;i<d.children.length;i++){
        if (d.children[i].children[1].innerText.search("DC0"+dc)>0){
            c++;
            d.children[i].children[0].children[0].click();
        }
    }
    document.querySelector(".move").click();
    //alert(c);
}

function SelectDCForPending(){
    c=0;
    dc=prompt("DC number");
    PO_RESULTS_lbl.click();
    d = document.getElementById("PO_RESULTS_Form:poSearchResultsTableView:resultsTable:tb");
    for (i=0;i<d.children.length;i++){
        if (d.children[i].children[1].innerText.search("DC0"+dc)>0){
            c++;
            d.children[i].children[0].children[0].click();
        }
    }
    //alert(c);
    //pdr.onclick = document.getElementById("PO_RESULTS_Form:j_id378").onclick;
    pdr.onclick = document.getElementById("PO_RESULTS_Form").children[6].onclick;
}
//window.unwrappedJSObject.SelectDCForRelease=SelectDCForRelease;

function SimplifyPODataEntry(){
    //a = document.getElementById("massEditAndReleaseForm:j_id1317:lineItemTable");
    //a = document.getElementById("massEditAndReleaseForm:j_id1334:lineItemTable");

    e = document.querySelectorAll(".rich-table");
    a = e[e.length-1];

    function HideColumn(elem,num,d){
        elem.children[1].children[0].children[num].style.display=d;
        for (i=0;i<elem.children[2].children.length;i++){
            elem.children[2].children[i].children[num].style.display=d;
        }
    }
    b=[1,4,5,8,9,10,11,12,13,18,19,20,21,22];
    for (c=0;c<b.length;c++){
        HideColumn(a,b[c],'none');
    }

    for (c=0;c<a.children[2].children.length;c++){
        a.children[2].children[c].children[14].children[0].onblur=function(e){};
        a.children[2].children[c].children[15].children[0].onblur=function(e){};
        a.children[2].children[c].children[16].children[0].onblur=function(e){};
        a.children[2].children[c].children[17].children[0].onblur=function(e){};
    }
}
window.SimplifyPODataEntry = SimplifyPODataEntry;
pd = document.createElement("span");
//window.unwrappedJSObject.rd = rd;
pd.innerHTML="&nbsp;(P)&nbsp;";
pd.onclick = SelectDCForPending;
moduleName.appendChild(pd);

pdr = document.createElement("span");
pdr.innerHTML = "&nbsp;(+)&nbsp;";
moduleName.appendChild(pdr);

rd = document.createElement("span");
//window.unwrappedJSObject.rd = rd;
rd.innerHTML="&nbsp;(R)&nbsp;";
rd.onclick = SelectDCForRelease;
moduleName.appendChild(rd);

//sd = document.createElement("span");
//sd.innerHTML="&nbsp;(S)&nbsp;"
//sd.onclick = SimplifyPODataEntry;
//moduleName.appendChild(sd);

/*rdr = document.createElement("span");
rdr.innerHTML = "&nbsp;(+)&npsp;";
rdr.onclick = document.getElementById("pendingReleasesForm:j_id664").click
moduleName.appendChild(rdr);*/

/*
toast = document.createElement("div");
toast.innerText = "Toast Successful";
toast.style.CSStext = 'width:200px;height:20px;height:auto;position:absolute;left:50%;margin-left:-100px;bottom:10px;background-color: #383838;color: #F0F0F0;font-family: Calibri;font-size: 20px;padding:10px;text-align:center;border-radius: 2px;-webkit-box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1);-moz-box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1);box-shadow: 0px 0px 24px -1px rgba(56, 56, 56, 1);';
toast.style.display='none';
toast.className = 'toast';
$(toast).fadeIn(400).delay(3000).fadeOut(400);
*/

// ==UserScript==
// @name           Peaks_Increasement_Calculator
// @version        1.0
// @description    This Tool Calculate peaks Increasement in each peak 
// @author       Omer Ben Yosef
// @include			http://trophymanager.com/players/*
// @include			https://trophymanager.com/players/*
// @include			https://fb.trophymanager.com/players/*
// @namespace https://greasyfork.org/users/18768
// @downloadURL https://update.greasyfork.org/scripts/14231/Peaks_Increasement_Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/14231/Peaks_Increasement_Calculator.meta.js
// ==/UserScript==
var div_area = document.createElement('div');
var a = document.getElementById("player_graphs_new");
var b = a.getElementsByClassName("graph_peaks background_gradient graph_block");
var phySum = 0 ;
var tacSum = 0 ;
var tecSum = 0 ;
document.getElementsByClassName("box")[0].appendChild(div_area);
div_area.innerHTML = "<div style=\"position: absolute;right: 300px; top: 310px; z-index: 1; width: 175px; margin-top: 20px; background: #5F8D2D; padding-left: 5px; color: gold; border: 2px #333333 outset; display:inline;\"><p style=\"text-decoration: underline;\"><b>PlayerData+:<\p><table style=\"margin-top: -1em; margin-bottom: 1em;\"><tr><td>PhySum: </td><td>" + phySum + " " +  "</td></tr><tr><td>TacSum: </td><td>" + phySum + " " + "</td></tr><tr><td>TecSum: </td><td>" + phySum + " " + "</td></tr><tr><td>AllSum: </td><td>" + phySum + "</td></tr></table></b></div>";

var div = document.createElement("BUTTON");
document.getElementsByClassName("box")[0].appendChild(div);

div.setAttribute("style", "position: absolute; z-index: 1; width: 185px; margin-top: 240px; background: #5F8D2D; padding-left: 5px;top: 220px;right: 300px;");div.innerHTML = "<p><b>Calculate Peak Increment</b></p>";

div.onclick=function()
{   var a = document.getElementById("player_graphs_new");
    var b = a.getElementsByClassName("graph_peaks background_gradient graph_block");
   try {
    {if ($(b[0].getElementsByClassName("graph jqplot-target")).length>0) 
    {var c = b[0].getElementsByClassName("graph jqplot-target");
     var bool = true ;
     var count = 0 ;
     var num = 0 ;
     while (bool == true) {
         var sta = "jqplot-point-label jqplot-series-0 jqplot-point-";
         num = count ;
         num = num.toString();
         str = sta.concat(num);
         if ($(b[0].getElementsByClassName(str)).length>0)
         { count = count + 1 ;
         }
         else { count = count -1 ;
               bool = false ; }
     }
     
 
  
     var str1 = "jqplot-point-label jqplot-series-0 jqplot-point-";
     var str2 = "jqplot-point-label jqplot-series-1 jqplot-point-";
     var str3 = "jqplot-point-label jqplot-series-2 jqplot-point-";
     var num_last = count ;
     var num_last_1 = count - 1 ;   
     num_last = num_last.toString()
     num_last_1 = num_last_1.toString()
     var str1_r = str1.concat(num_last);
     var str2_r = str2.concat(num_last);
     var str3_r = str3.concat(num_last);
     var str1b = str1.concat(num_last_1);
     var str2b = str2.concat(num_last_1);
     var str3b = str3.concat(num_last_1);
     var phy_peak_last = c[0].getElementsByClassName(str1_r);
     var tac_peak_last = c[0].getElementsByClassName(str2_r);
     var tec_peak_last = c[0].getElementsByClassName(str3_r);
     var phy_peak_last = phy_peak_last[0].style;
     var tac_peak_last = tac_peak_last[0].style;
     var tec_peak_last  = tec_peak_last[0].style;
     var phy_peak_last = phy_peak_last["top"]
     var tac_peak_last = tac_peak_last["top"]
     var tec_peak_last  = tec_peak_last["top"]
     phy_peak_last = parseFloat(phy_peak_last)
     tac_peak_last = parseFloat(tac_peak_last)
     tec_peak_last  = parseFloat(tec_peak_last)
     var phy_peak_last_1 = c[0].getElementsByClassName(str1b);
     var tac_peak_last_1 = c[0].getElementsByClassName(str2b);
     var tec_peak_last_1 = c[0].getElementsByClassName(str3b);
     var phy_peak_last_1 = phy_peak_last_1[0].style;
     var tac_peak_last_1 = tac_peak_last_1[0].style;
     var tec_peak_last_1  = tec_peak_last_1[0].style;
     var phy_peak_last_1 = phy_peak_last_1["top"]
     var tac_peak_last_1 = tac_peak_last_1["top"]
     var tec_peak_last_1  = tec_peak_last_1["top"]
     phy_peak_last_1 = parseFloat(phy_peak_last_1)
     tac_peak_last_1 = parseFloat(tac_peak_last_1)
     tec_peak_last_1  = parseFloat(tec_peak_last_1)
     var phy_diff = parseFloat(phy_peak_last_1 - phy_peak_last) ;
     var tac_diff = parseFloat(tac_peak_last_1 - tac_peak_last) ;
     var tec_diff =  parseFloat(tec_peak_last_1 - tec_peak_last) ;
     var count_1 = count + 1 ;
     var TI = a.getElementsByClassName("graph_ti background_gradient graph_block");
     var TI = TI[0].getElementsByClassName("graph jqplot-target");
     var str_for_ti = "jqplot-point-label jqplot-series-0 jqplot-point-";
     var str_for_ti = str_for_ti.concat(count_1.toString());
     var TA = TI[0].getElementsByClassName(str_for_ti);
     var T = document.getElementsByClassName(str_for_ti)[0].textContent;
     T = parseInt(T);
     T = parseFloat(T/10);
     var TOTALSUM = parseFloat(phy_diff + tac_diff + tec_diff) ;
     phy_diff = T/TOTALSUM*phy_diff;
     tac_diff =  T/TOTALSUM*tac_diff;
     tec_diff =  T/TOTALSUM*tec_diff;
     phy_diff = phy_diff.toFixed(1);
     tac_diff = tac_diff.toFixed(1);
     tec_diff = tec_diff.toFixed(1);
     
   
     


     div_area.innerHTML = "<div style=\"position: absolute;right: 300px; top: 310px; z-index: 1; width: 175px; margin-top: 20px; background: #5F8D2D; padding-left: 5px; color: gold; border: 2px #333333 outset; display:inline;\"><p style=\"text-decoration: underline;\"><b>PlayerData+:<\p><table style=\"margin-top: -1em; margin-bottom: 1em;\"><tr><td>PhySum: </td><td>" + phy_diff  + " " +  "</td></tr><tr><td>TacSum: </td><td>" + tac_diff  + " " + "</td></tr><tr><td>TecSum: </td><td>" + tec_diff  + " " + "</td></tr><tr><td>AllSum: </td><td>" + T  + "</td></tr></table></b></div>";
     
    }
    else (alert("WAIT"));
    }
}
catch(err) {
    document.getElementById("tabplayer_graphs_new").click();
}
  

};
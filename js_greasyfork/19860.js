// ==UserScript==
// @name           Peaks Increment Calculator V2.0
// @version        2.0
// @description    This Tool Calculate peaks Increment in each peak 
// @author       Omer Ben Yosef
// @include			http://trophymanager.com/players/*
// @include			https://trophymanager.com/players/*
// @include			https://fb.trophymanager.com/players/*
// @namespace https://greasyfork.org/users/18768
// @downloadURL https://update.greasyfork.org/scripts/19860/Peaks%20Increment%20Calculator%20V20.user.js
// @updateURL https://update.greasyfork.org/scripts/19860/Peaks%20Increment%20Calculator%20V20.meta.js
// ==/UserScript==
var div_area = document.createElement('div');
var a = document.getElementById("player_graphs_new");
var b = a.getElementsByClassName("graph_peaks background_gradient graph_block");
var phySum = 0 ;
var tacSum = 0 ;
var tecSum = 0 ;
document.getElementsByClassName("box")[0].appendChild(div_area);
div_area.innerHTML = "<div style=\"position: absolute; z-index: 1; width: 186px; height: 249px; margin-top: 476px; background: url(https://s9.postimg.org/w3xw1ge6n/omer_omer.png);  color: white;  outset; display:inline;\">&nbsp;<p style=\"text-decoration: underline;\"><b><\p><table style=\"margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px\">&nbsp;<tr><td>PhySum: </td><td>" + phySum + " (" + 0 + "%)</td></tr><tr><td>TacSum: </td><td>" + phySum + " (" + 0 + "%)</td></tr><tr><td>TecSum: </td><td>" + phySum + " (" + 0 + "%)</td></tr><tr><td>AllSum: </td><td>" + phySum + "</td></tr></table></b></div>";

var div = document.createElement("BUTTON");
document.getElementsByClassName("box")[0].appendChild(div);

div.setAttribute("style", "position: absolute; z-index: 1; width: 185px; margin-top: 240px; background: #5F8D2D; padding-left: 5px; position: absolute; z-index: 1; width: 185px; margin-top: 240px;  background: #5F8D2D;padding-left: 5px;  position: absolute;display: inline-block; line-height: 21px;color: #fff;  text-align: center;font-weight: normal; background: #4A6C1F url(/pics/normal_button_gradient.png) center center; box-shadow: 1px 1px 0 #44631b; font-size: 13px; margin-left: 5px; border-left-width: 2px;     width: 175px ;margin-top: 663px;");

div.innerHTML = "<p><b>Calculate Peak Increment</b></p>";


   
  
    
  
   
    
    
   
    
  
    
   
    
   
    
   
   
var array = 
["15.00","15.01","15.02","15.03","15.04","15.05","15.06","15.07","15.08","15.09","15.10","15.11"
,"16.00","16.01","16.02","16.03","16.04","16.05","16.06","16.07","16.08","16.09","16.10","16.11"
,"17.00","17.01","17.02","17.03","17.04","17.05","17.06","17.07","17.08","17.09","17.10","17.11"
,"18.00","18.01","18.02","18.03","18.04","18.05","18.06","18.07","18.08","18.09","18.10","18.11"
,"19.00","19.01","19.02","19.03","19.04","19.05","19.06","19.07","19.08","19.09","19.10","19.11"
,"20.00","20.01","20.02","20.03","20.04","20.05","20.06","20.07","20.08","20.09","20.10","20.11"
,"21.00","21.01","21.02","21.03","21.04","21.05","21.06","21.07","21.08","21.09","21.10","21.11"
,"22.00","22.01","22.02","22.03","22.04","22.05","22.06","22.07","22.08","22.09","22.10","22.11"
,"23.00","23.01","23.02","23.03","23.04","23.05","23.06","23.07","23.08","23.09","23.10","23.11"
,"24.00","24.01","24.02","24.03","24.04","24.05","24.06","24.07","24.08","24.09","24.10","24.11"
,"25.00","25.01","25.02","25.03","25.04","25.05","25.06","25.07","25.08","25.09","25.10","25.11"
,"26.00","26.01","26.02","26.03","26.04","26.05","26.06","26.07","26.08","26.09","26.10","26.11"
,"27.00","27.01","27.02","27.03","27.04","27.05","27.06","27.07","27.08","27.09","27.10","27.11"
,"28.00","28.01","28.02","28.03","28.04","28.05","28.06","28.07","28.08","28.09","28.10","28.11"
,"29.00","29.01","29.02","29.03","29.04","29.05","29.06","29.07","29.08","29.09","29.10","29.11"
,"30.00","30.01","30.02","30.03","30.04","30.05","30.06","30.07","30.08","30.09","30.10","30.11"
,"31.00","31.01","31.02","31.03","31.04","31.05","31.06","31.07","31.08","31.09","31.10","31.11"
,"32.00","32.01","32.02","32.03","32.04","32.05","32.06","32.07","32.08","32.09","32.10","32.11"
,"33.00","33.01","33.02","33.03","33.04","33.05","33.06","33.07","33.08","33.09","33.10","33.11"
,"34.00","34.01","34.02","34.03","34.04","34.05","34.06","34.07","34.08","34.09","34.10","34.11"
,"35.00","35.01","35.02","35.03","35.04","35.05","35.06","35.07","35.08","35.09","35.10","35.11"
,"36.00","36.01","36.02","36.03","36.04","36.05","36.06","36.07","36.08","36.09","36.10","36.11"
,"37.00","37.01","37.02","37.03","37.04","37.05","37.06","37.07","37.08","37.09","37.10","37.11"
];

var float_left_info = document.getElementsByClassName("float_left info_table zebra");
var tbody = float_left_info[0].getElementsByTagName("tbody")
var tr = tbody[0].getElementsByTagName("tr")
var age_y = tr[2].cells[1].innerText ;
var age_string_years = parseInt(age_y);
var months_string_num = parseInt(age_y.split(" ")[2])
var zeo = false ;
if (months_string_num < 10) { zeo = true;}
var age_string_years = age_string_years.toString();
var months_string_num = months_string_num.toString();
var point = ".";
var temp_months_string_num = "";
var zero = "0" ;
if (zeo == true) {
    months_string_num = temp_months_string_num.concat(zero,months_string_num);
}
var age_concat = age_string_years.concat(point,months_string_num);


var mi = document.createElement("select");
mi.id = "mi";
document.getElementsByClassName("box")[0].appendChild(mi);
mi.setAttribute("style", "position: absolute; z-index: 1; display: inline-block ; line-height: 25px; color: #fff;  text-align: center; font-weight: normal;     background: #4A6C1F url(/pics/normal_button_gradient.png) center center ;     border-bottom: 1px solid #44631b;     border-right: 1px solid #44631b;  border: 1px solid #6c9922;   box-shadow: 1px 1px 0 #44631b; padding-right: 20px ; margin: 0px 0px 30px 0px ;     padding-right: 12px;padding-top: 6px;padding-bottom: 6px; padding-left: 12px ; margin: 0px 0px 0px 0px;font-size: 13px;margin-left: 4px;    margin-top: 607px;");

mi_index = 0;
for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    
    mi.appendChild(option);
}

for (var i = 0; i < array.length; i++) { 
    if (mi.options[i].value == age_concat){
        mi_index = i;
        mi.options[i].selected = true;
    }
}

var mx = document.createElement("select");
mx.id = "mx";
document.getElementsByClassName("box")[0].appendChild(mx);
mx.setAttribute("style", "position: absolute; z-index: 1;  display: inline-block ; line-height: 25px; color: #fff;  text-align: center; font-weight: normal;     background: #4A6C1F url(/pics/normal_button_gradient.png) center center ;     border-bottom: 1px solid #44631b;     border-right: 1px solid #44631b;  border: 1px solid #6c9922;   box-shadow: 1px 1px 0 #44631b; padding-right: 20px ; margin: 0px 0px 30px 0px ;    padding-right: 12px;padding-top: 6px;padding-bottom: 6px; padding-left: 12px ; margin: 0px 0px 0px 97px;font-size: 13px;    margin-top: 607px;");

mx_index = 0;
for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    
    mx.appendChild(option);
}

for (var i = 0; i < array.length; i++) { 
    if (mx.options[i].value == age_concat){
        mx_index = i;
        mx.options[i].selected = true;
    }
}




div.onclick=function()
{   var first_age = document.getElementById("mi").value ;
    var second_age = document.getElementById("mx").value ;
      var T_Must_To_Be = 1;

    var a = document.getElementById("player_graphs_new");
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


      var bool_two = true ;
     var count_two = 0 ;
     var num_two = 0 ;
     while (bool_two == true) {
         var sta_2 = "jqplot-point-label jqplot-series-1 jqplot-point-";
         num_two = count_two ;
         num_two = num_two.toString();
         var str_2 = sta_2.concat(num_two);
         if ($(b[0].getElementsByClassName(str_2)).length>0)
         { count_two = count_two + 1 ;
         }
         else { count_two = count_two -1 ;
               bool_two = false ; }
     }

         

     var bool_three = true ;
     var count_three = 0 ;
     var num_three = 0 ;
     while (bool_three == true) {
         var sta_3 = "jqplot-point-label jqplot-series-2 jqplot-point-";
         num_three = count_three ;
         num_three = num_three.toString();
         var str_3 = sta_3.concat(num_three);
         if ($(b[0].getElementsByClassName(str_3)).length>0)
         { count_three = count_three + 1 ;
         }
         else { count_three = count_three -1 ;
               bool_three = false ; }
     }

 
           

     var str1 = "jqplot-point-label jqplot-series-0 jqplot-point-";
     var str2 = "jqplot-point-label jqplot-series-1 jqplot-point-";
     var str3 = "jqplot-point-label jqplot-series-2 jqplot-point-";
     
     var first_age_index = 0;
     var second_age_index = 0;
     for (var i = 0; i < array.length; i++) { 
     if (mi.options[i].value == first_age){
        first_age_index = i;

     }
     }
     
          for (var i = 0; i < array.length; i++) { 
     if (mx.options[i].value == second_age){
        second_age_index = i;

     }
     }
     
     
     
   
     var tgA = 0;
     if (second_age_index > mx_index)
     { tgA = 0;
     }
     
     else {
         tgA = mx_index - second_age_index ;
          }
     

     var Last_Training = (mi_index+1) - first_age_index;
     var tg =  Last_Training - tgA
    
     
     var graph_ti_background_gradient = document.getElementsByClassName("graph_ti background_gradient graph_block");
     var graph_jqplot_target = document.getElementsByClassName("graph jqplot-target");
     var graph_ti = document.getElementById("graph_ti");
     var kid = graph_ti.children[7];
     var string = kid.classList[2];
     var num_ti_list = string.slice(string.indexOf("point")+6);
     num_ti_list = parseInt(num_ti_list);
   
     
     var heighst_counts = Math.max (count_three,count_two,count);
     if (heighst_counts >= num_ti_list) {var num_of_training = heighst_counts + 1 ;}
     else {
     var num_of_training = num_ti_list ;

     }
     

     
     
     var e_count = 0 ;
     var T = 0 ;
     var count_r = count - tgA ;
     while (e_count < tg){
     var count_1 = count_r + 1  ;
     var TI = a.getElementsByClassName("graph_ti background_gradient graph_block");
     var TI = TI[0].getElementsByClassName("graph jqplot-target");
     var str_for_ti = "jqplot-point-label jqplot-series-0 jqplot-point-";
     
     var str_for_ti = str_for_ti.concat(count_1.toString());
     var TA = TI[0].getElementsByClassName(str_for_ti);
     var TGA = document.getElementsByClassName(str_for_ti)[0].textContent; 
     if (TA.length == 0) {T_Must_To_Be = 0 ; }
     var TINT = parseInt(TGA);
     T = T + parseFloat(TINT/10);
     e_count = e_count + 1 ;
     count_r = count_r - 1 ;
     }
     
     var count_AA = num_of_training - 1 ;
    
     var num_last = count_AA - tgA ;
     var num_last_1 = count_AA - Last_Training ;  
     num_last = num_last.toString()
     num_last_1 = num_last_1.toString()
     var str1_r = str1.concat(num_last);
     var str2_r = str2.concat(num_last);
     var str3_r = str3.concat(num_last);
     var str1b = str1.concat(num_last_1);
     var str2b = str2.concat(num_last_1);
     var str3b = str3.concat(num_last_1);
     var phy_peak_last = c[0].getElementsByClassName(str1_r);
     if (phy_peak_last.length == 0) {T_Must_To_Be = 0;}
     var tac_peak_last = c[0].getElementsByClassName(str2_r);
     if (tac_peak_last.length == 0) {T_Must_To_Be = 0;}
     var tec_peak_last = c[0].getElementsByClassName(str3_r);
     if (tec_peak_last.length == 0) {T_Must_To_Be = 0;}
   
     var phy_peak_last = phy_peak_last[0].style;
     var tac_peak_last = tac_peak_last[0].style;
     var tec_peak_last  = tec_peak_last[0].style;

     var phy_peak_last = phy_peak_last["top"];
     var tac_peak_last = tac_peak_last["top"];
     var tec_peak_last  = tec_peak_last["top"];

     phy_peak_last = parseFloat(phy_peak_last);
     tac_peak_last = parseFloat(tac_peak_last);
     tec_peak_last  = parseFloat(tec_peak_last);
     var phy_peak_last_1 = c[0].getElementsByClassName(str1b);
     if (phy_peak_last_1.length == 0) {T_Must_To_Be = 0;}
     var tac_peak_last_1 = c[0].getElementsByClassName(str2b);
     if (tac_peak_last_1.length == 0) {T_Must_To_Be = 0;}
     var tec_peak_last_1 = c[0].getElementsByClassName(str3b);
     if (tec_peak_last_1.length == 0) {T_Must_To_Be = 0;}

    
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
     var T = T.toFixed(1);
     var TOTALSUM = parseFloat(phy_diff + tac_diff + tec_diff) ;
     phy_diff = T/TOTALSUM*phy_diff;
     tac_diff =  T/TOTALSUM*tac_diff;
     tec_diff =  T/TOTALSUM*tec_diff;
     phy_diff = phy_diff.toFixed(1);
     tac_diff = tac_diff.toFixed(1);
     tec_diff = tec_diff.toFixed(1);
     
   

     if ((first_age_index < mi_index+1)&&(second_age_index >= first_age_index) && (T_Must_To_Be == 1)){
        
     div_area.innerHTML = "<div style=\"position: absolute; z-index: 1; width: 186px;  height: 249px; margin-top: 476px; background: url(https://s9.postimg.org/w3xw1ge6n/omer_omer.png);  color: white;  outset; display:inline;\">&nbsp;<p style=\"text-decoration: underline;\"><b><\p><table style=\"margin-top: -1em; margin-bottom: 1em; position:relative; top:0px;left:5px\">&nbsp;<tr><td>PhySum: </td><td>" + phy_diff  + " (" + Math.round((phy_diff/T)*100) + "%)</td></tr><tr><td>TacSum: </td><td>" + tac_diff  + " (" + Math.round((tac_diff/T)*100) + "%)</td></tr><tr><td>TecSum: </td><td>"+ tec_diff  + " (" + Math.round((tec_diff/T)*100) + "%)</td></tr><tr><td>AllSum: </td><td>" + T  + "</td></tr></table></b></div>";
     }
    }
    else (alert("Please Wait / Enable Peaks graph for your player"));
    }
}
catch(err) {
    document.getElementById("tabplayer_graphs_new").click();
}
  

};
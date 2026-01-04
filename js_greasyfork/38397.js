// ==UserScript==
// @name         TMo Hotspot Anti-Timeout Script:en-US
// @namespace    com.doktorjones.timeout.tmo
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://192.168.0.1/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/38397/TMo%20Hotspot%20Anti-Timeout%20Script%3Aen-US.user.js
// @updateURL https://update.greasyfork.org/scripts/38397/TMo%20Hotspot%20Anti-Timeout%20Script%3Aen-US.meta.js
// ==/UserScript==

var maxval = GM_getValue("interval", 180);
var timerval = maxval;

function updateinterval() {
  var tmpval = $("#timerinterval").val();
  if (tmpval === 0) {
    tmpval = 0;
  } else if (tmpval < 30) {
    alert("Value must be 30 or higher! Setting to 30...");
    tmpval = 30;
    $("#timerinterval").val(30);
  } else if (tmpval > 300) {
    alert("Value must be 300 or lower (5 minutes)! Setting to 300...");
    tmpval = 300;
    $("#timerinterval").val(300);
  }
  maxval = tmpval;
  timerval = tmpval;
  GM_setValue("interval",tmpval);
}

(function() {
    'use strict';
    var timerframe = $("<div style='height:3px; border:1px solid black; background-color:#d9d9d9; width:100%; margin:0; padding:0;'>&nbsp;</div>");
    var timerbar = $("<div style='position: relative; height:100%; width:100%; background-color:#ea0a8e; margin:0; padding:0; margin-top:-16px;' id='timerbar'>&nbsp;</div>");
    timerframe.append(timerbar);
    $("body").prepend(timerframe);

    var setframe = $("<div id=\"timerset\" style=\"position:absolute;top:5px;right:0;background-color:#666;height:18px;width:18px;z-index:99910;\">");
    var setbutton = $("<input type=\"image\">");
    $("body").append(setframe);
    $(setframe).append(setbutton);
    $(setbutton).attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC6ElEQVR4nHVSTUwTYRCdlgrLYms8VA1t0YRoApRt0XCoEEJauJkAB4wHOBgw9UBi4sGfs4TUi0HKzYsmjRxIMFQDiUYRCgcMlAUuLX+JBYtlu/1Z2t2l2/3GA9SEv3d6h5k3780MwDlobW29CADAMIzW6XSWnVd3JmZmZrySLItut/u2z+d7JEmSODAw8PCs2qICaWtroz0ez1OKojbvNjQ8sJjNDMMwrlqGuUdRlIFl2YX6+vp0V1dXB8dxwZ2dHTymNDo6+pwQgoIgpBRFyefzeVSUPCqKgrlcDpPJpJDNijlJkkhfX5+r0KctkPHx8Q+ZTCZN0/QljUZThIiASIAQAoQgUFSpXqPRXFhcXFyNRCK/jkUIBALexsbGB2azhQEALSJCKBTaHBv79C4UDi2Wm8pvllAlNCJCcXFJUY3Vaq+rq7s6OTn5C5qami5mRVFUFAVzR3aXV1Y22tvbLYUpPT09Np7ns8L+PqYFAVPpNE5N/Vyw2+06AADo7e29vbm1tX5wcICyLOPw8LDn5LYHBwefpNJpTKZS6Pf7f3R2dt4CANBarbXa5ubmO5cMhssEEQgilNI0dVKguqam6nAfBEwm87XKyspDhw6Ho0wQBFGSJBRFETPZLG5vb8fdbret0Oz1eu/zfEKN8zxyXBxjexx+/fptwWaz6TQAAP39/Q9pmjZ1dXc/K6UoPUEEWZbFtfDaDF1G669XXHcgoBYJQngtvDE3O/s+Gt1dHRp66/9v8cWLl7ZkKpUr5Ewkk8jzCeTiPO5xHMZie7j7N4bB4NLvjo6Oy6f+wGw2OQBAtxRcWknwiThRCahHmYlKIBwOb0SjfyJ6g+Gq0WhkTr1yNBoNbqyvByYmJl5VVVXbjVeuVM/Nzk4RVZX1BoPxy2f/G5/P17OyvPxtfn4+EIvFEABAVxBgWZawLPsdAMDpck2rqnpjZOTjY0tFhaWlpeV1dHd31e/3JwFg+uSFzoTVatWdxU/iH+qOnotZhoC+AAAAAElFTkSuQmCC");
    $(setbutton).on("click", function() {
        if ($(dialog).css("display") == "none")
          $(dialog).css("display","block");
        else
          $(dialog).css("display","none");
    });

    var dialog = $("<div id=\"timeropts\" style=\"position:absolute;top:17px;right:12px;background-color:#ffc;z-index:99920;display:none;border:1px solid #00f;padding:5px;\">");
    $(dialog).append(`<label for="interval">Interval: </label>
<input type="text" id="timerinterval" style="width:30px" value="`+maxval+`"> seconds<br>
<input type="button" id="timersubmit" value=" Update " style="margin:5px"><br>
(0 to disable)`.trim());
    $("body").append(dialog);
    $("#timersubmit").on("click", updateinterval);

    window.setInterval(function() {
        if (maxval === 0) {
            $("#timerbar").css("width","5px");
            return;
        }
        timerval--;
        $("#timerbar").css("width",((timerval / maxval) * 100) +"%");
        if (timerval <= 0) window.location.reload(true);
    },1000);
})();

$(document).ready(function() { timerval = maxval; });
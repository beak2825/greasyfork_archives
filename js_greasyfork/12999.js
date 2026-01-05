// ==UserScript==
// @name       Convert units to Celcius
// @namespace  https://github.com/daniel-simpson
// @version    0.2
// @description  attempts to convert all Farenheit temperature measurments to Celcius.  Not infallable, but decent for cooking measurements
// @match      http://*/*
// @copyright  2015+, Daniel Simpson, Melbourne, Australia
// @downloadURL https://update.greasyfork.org/scripts/12999/Convert%20units%20to%20Celcius.user.js
// @updateURL https://update.greasyfork.org/scripts/12999/Convert%20units%20to%20Celcius.meta.js
// ==/UserScript==

var config = {
  pattern: />[^<>]*\s((\d{1,3}(\.\d*)?)[°°\s]{0,2} ?F)\s[^<>]*<\//g,
  debug: 1,
  rerun: 5,
  dp: 3,
    showTooltip: true
};

var generateReplacementString = function(tempF) {
  var tempC = (((tempF - 32) * 5) / 9).toFixed(config.dp);
  if(config.showTooltip) {
    return "<span title='"+tempF+"°F'>" + tempC + "°C</span>";
  }
  return "" + tempC + "°C";
};

var runConversion = function() {
  if(config.debug) console.log("Starting temperature fix, replacing farenheit with celcius...");
  var match = config.pattern.exec(document.body.innerHTML);  
  
  while(match) {   
    //var itemTextF = match[0];        //Full text node            >assudygsudfkujhsdbfjhabsd sadhgfujsh 123F ajshbda</
    var replaceTextF = match[1];     //Match including unit      123F
    var tempF = match[2];            //Temperature value         123
          
    var replaceTextC = generateReplacementString(tempF);
    
    if(config.debug) console.log("Replacing " + replaceTextF + " with " + replaceTextC);
    document.body.innerHTML = document.body.innerHTML.replace(new RegExp(replaceTextF, 'g'), replaceTextC);
      
    match = config.pattern.exec(document.body.innerHTML);
  }
  if(config.debug) console.log('Completed conversion without errors');
};

for(var i=0;i<config.rerun;i=i+1) {
  setTimeout(runConversion,  500);
}
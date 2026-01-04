// ==UserScript==
// @name         Answer Suggester
// @version      1.2
// @description  Scrip for googling questions for test/quiz
// @author       You
// @match        *://*.gmetrix.net/Tests/RunUnityTest.aspx*
// @grant        none
// @namespace https://greasyfork.org/users/701200
// @downloadURL https://update.greasyfork.org/scripts/415428/Answer%20Suggester.user.js
// @updateURL https://update.greasyfork.org/scripts/415428/Answer%20Suggester.meta.js
// ==/UserScript==

setTimeout(function()
{
    var question = "";
    try
    {
    question = document.querySelector("#InstructionText > p").innerHTML;
    } catch(Exception)
    {
        question = document.querySelector("#InstructionText").innerHTML;
    }
    while(question.includes(" ") || question.includes(" "))
    {
        question=question.replace(" ", "%20")
        question=question.replace(" ", "%20")
    }
    while(question.includes("<br>"))
    {
        question=question.replace("<br>", "");
    }
    while(question.includes("<strong>"))
    {
        question=question.replace("<strong>", "");
        question=question.replace("</strong>", "");
    }
    while(question.includes(`
`))
    {
        question=question.replace(`
`, "");
    }
    var url = "https://www.bing.com/search?q=" + question
    var height = document.querySelector("#answerContainer").style.height;
    var width = document.querySelector("#answerContainer").style.width;
    width = 1278;
    height = 350;
    var iframe = `<iframe id="iframe" name="iframe" src="`+url+`" width=`+width+` height=`+height+`></iframe>`;
    console.log(url);
    console.log(iframe);
    var html = document.querySelector("body").innerHTML.replace(`<div id="footerImageParent" style="width: 100%;">
            <div class="TestRunnerFooterLogoContainer"><span class="TestRunnerFooterLogo"></span></div>
        </div>`, "");

    document.querySelector("body").innerHTML = html + iframe;
    window.SetButtons();
}, 1000);

window.SetButtons = function(){
    if(!document.querySelector("#contentMain_nextButton").href.includes("ButtonPressedFuntion")){
        document.querySelector("#contentMain_nextButton").href += "; ButtonPressedFuntion();";}
    if(!document.querySelector("#contentMain_skipButton").href.includes("ButtonPressedFuntion")){
        document.querySelector("#contentMain_skipButton").href += "; ButtonPressedFuntion();";}
    if(!document.querySelector("#contentMain_previousButton").href.includes("ButtonPressedFuntion")){
        document.querySelector("#contentMain_previousButton").href += "; ButtonPressedFuntion();";}
    if(!document.querySelector("#contentMain_resetButton").href.includes("ButtonPressedFuntion")){
        document.querySelector("#contentMain_resetButton").href += "; ButtonPressedFuntion();";}
}

window.ButtonPressedFuntion= function() {
    setTimeout(function(){
        var question = document.querySelector("#InstructionText > p").innerHTML;
        while(question.includes(" ") || question.includes(" "))
        {
            question=question.replace(" ", "%20");
            question=question.replace(" ", "%20");
        }
        document.getElementById("iframe").src = "https://www.bing.com/search?q=" + question;
        setTimeout(function(){location.reload();}, 1000);
    }, 1000);
}

function removeListenersFromElement(element, listenerType){
    const listeners = getEventListeners(element)[listenerType];
    let l = listeners.length;
    for(let i = l-1; i >=0; i--) {
        removeEventListener(listenerType, listeners[i].listener);
    }
}
setTimeout(function(){
    //removeListenersFromElement(window, "beforeunload");
}, 1000);

var getEventListeners = function(elem, type) {
  if (elem.eventListenerList) {
     return elem.eventListenerList;
  }else {
     /* derp?!*/
  }
}
var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

var th = document.getElementsByTagName('body')[0];
var s = document.createElement('script');
s.setAttribute('type','text/javascript');
s.innerHTML = "window.onbeforeunload = function() {}";
th.appendChild(s);


}
/*
     FILE ARCHIVED ON 23:13:49 Sep 19, 2015 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 23:14:58 Nov 03, 2020.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 308.073
  exclusion.robots: 0.085
  exclusion.robots.policy: 0.078
  RedisCDXSource: 1.807
  esindex: 0.012
  LoadShardBlock: 285.662 (3)
  PetaboxLoader3.resolve: 123.784 (4)
  PetaboxLoader3.datanode: 97.533 (4)
  CDXLines.iter: 17.986 (3)
  load_resource: 100.852
*/


// ==UserScript==
// @name         Crowdsource Follower and Employee Count Automator
// @version      3.4
// @description  CRUSH KILL DESTROY SWAG
// @copyright    2013+, Tjololo12
// ------------------------------------------------------------------------------------
// @match        https://work.crowdsource.com/amt/view*
// @run-at       document-end
// @require      http://code.jquery.com/jquery-git.js
// @grant          GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/2849/Crowdsource%20Follower%20and%20Employee%20Count%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/2849/Crowdsource%20Follower%20and%20Employee%20Count%20Automator.meta.js
// ==/UserScript==
 
//parseUri.options.strictMode = true;
 
// Source: http://stackoverflow.com/a/4673436/2405722
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/\{(\d+)\}/g, function(match, number) {
    return args[number] !== undefined ? args[number] : match;
  });
};

var numTasks = 0;
var realTasks = 0;
var interval = 0;
var completedTasks = 0;
var counter = 0;

function httpGet(theUrl,taskNum)
{
  var taskNumber = taskNum;
  var url = theUrl;
  GM_xmlhttpRequest({
        method: 'GET',
        url: theUrl,
        synchronous: true,

        onload: function (xhr,taskNum,theUrl) {
            r = xhr.responseText;
            //console.log(r);
            var ret="";
            ret = getInfo(r,url);
            //console.log("RET: "+ret);
            try{
                window.postMessage({magicword: "mumbojumbo1", task: taskNumber, url: ret}, "*");
            }
            catch(err){
                console.log(err);
                //console.log(r);
                return r;
            }
        }
    });
}

if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
    this.GM_getValue=function (key,def) {
        return localStorage[key] || def;
        };
    this.GM_setValue=function (key,value) {
        return localStorage[key]=value;
        };
    this.GM_deleteValue=function (key) {
        return localStorage.removeItem(key);
        };
}

function getLinkResults(url,task){
    var ret = httpGet(url, task);
    return ret;
}

function HtmlEncode(s)
{
  var el = document.createElement("div");
  el.innerText = el.textContent = s;
  s = el.innerHTML;
  return s;
}
 
function getInfo(obj,url){
    var finalUrl = [];
    //var element = el.find('.followers-count');
    match = obj.match(/count.+<strong>(\d+)<\/strong>.+followers/);
    //console.log(match);
   // console.log(url);
    if (match){
        //console.log("In one");
        var $followersText = match[1];
        match = obj.match(/employees_deg_connected.{2}(\d+).+<span>Employees on LinkedIn/);
        var $employeesText = match[1];
        finalUrl.push($followersText);
        finalUrl.push($employeesText);
    }
    else{
        console.log("In two");
        //console.log(obj);
        match = obj.match(/"resultCount":(\d+),/);
        //console.log(match);
        finalUrl.push(match[1]);
    }
    //console.log(finalUrl);
    return finalUrl;
}

// make task number indicator (circle) clickable
$('h3').each( 
    function() {
        numTasks++;
        realTasks += numTasks%2;
        var url = $(this).find('a:first').attr("href");
        //console.log(numTasks+": "+url);
        $(this).append(
            $("<button></button>", {
                type: "button",
                text: "Search "+realTasks,
                id: "button-"+numTasks
            }).click(function() {
                //var num = $(this).html().split(" ")[1];
                taskNum = parseInt($(this).parent().next().children(":first").attr("for").replace(/.+Count-?(\d{1,2}).*/, '$1'));
                var resultURL = getLinkResults(url,taskNum);
            }));
        $("#button-"+numTasks).click();
    });
//console.log(numTasks);


window.addEventListener("message", function(e) {
    if (e.data.magicword === "mumbojumbo1") {
        console.log("Message Received");
        //console.log(e.data);
        if (e.data.url.length>1){
            $("#FollowerCount-{0}".format(e.data.task)).val(e.data.url[0]);
            $("#CurrentEmployeeCount-{0}".format(e.data.task)).val(e.data.url[1]);
        }
        else{
            $("#PastEmployeeCount-{0}".format(e.data.task)).val(e.data.url[0]);
        }
    }
    else{
        console.log("Also message received");
        console.log(e.data);
    }
}, false);
// ==UserScript==
// @name        Ashley Speaks
// @namespace   None
// @description Ashley Speaks for Necym
// @include     *www.vocalware.com/index/demo*
// @version     1.3
// @grant       none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/27868/Ashley%20Speaks.user.js
// @updateURL https://update.greasyfork.org/scripts/27868/Ashley%20Speaks.meta.js
// ==/UserScript==

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

var firststarted = false;
var started = false;

var FullArray = [];
var FullArraySize = -1;
var CurrentCount = 0;

var enabled = true;
var first = true;
var firstText = "";
var newText = "";

var GoNext = false;
var TextToProcessNow = "";

var Terminate = true;

var LastMp3 = "";


function ConnectNewFunction() {
    //stopSpeech();
    //$("#response_time").html("&nbsp;");
    _requestTime = getTimeStamp();

    var eInfo = effectInfo[$("#effectId").val()];
    var ttsInput = TextToProcessNow;


    ttsInput = TextToProcessNow;

    var voiceMapKey = $("#ttsVoices").val();
    var voiceDetails = voiceMap[voiceMapKey];

    if(eInfo.length>0){
        sayText (ttsInput, voiceDetails['voiceId'], voiceDetails['langId'], voiceDetails['engineId'], eInfo, $("#effectLevel").val());
    }
    else{
        sayText (ttsInput, voiceDetails['voiceId'], voiceDetails['langId'], voiceDetails['engineId']);
    }
}

function createObjectURL ( file ) {
    if ( window.webkitURL ) {
        return window.webkitURL.createObjectURL( file );
    } else if ( window.URL && window.URL.createObjectURL ) {
        return window.URL.createObjectURL( file );
    } else {
        return null;
    }
}

var PreviousJobFinished = true;
var Waittt = false;

var LastAudio = "https://www.vocalware.com/null";
function DownloadLoop(){
    if(PreviousJobFinished){
        PreviousJobFinished = false;
        if(started){
            if(firststarted){
                if($("#fulltext").val().length < 2){
                    alert("Mona > Ashley: Please enter some text.");
                    started = false;
                    firststarted = false;
                    PreviousJobFinished = true;
                    return;
                }
                var fullOutput = $("#fulltext").val();
                //alert("Full output: " + fullOutput);
                firststarted = false;
                FullArray = [];
                if(fullOutput.length > 595){
                    //alert("long");
                    var TemlFullOutput = fullOutput;
                    while(TemlFullOutput.length > 595){
                        //alert("while");
                        var Tempol = TemlFullOutput.substring(0,595);
                        var n = Tempol.lastIndexOf(".");
                        if(n < 1){
                            n = Tempol.lastIndexOf("\n");
                            //alert("newline");
                        }
                        if(n < 1){
                            alert("Mona > Ashley: CRITICAL ERROR. Couldn't find a dot or new line character. Fix the script!");
                            started = false;
                            firststarted = false;
                            PreviousJobFinished = true;
                            return;
                        }
                        n = n + 1;
                        //alert(n);
                        var TempoInclude = Tempol.substr(0,n);
                        FullArray.push(TempoInclude);
                        TemlFullOutput = TemlFullOutput.substr(n);
                    }
                    FullArray.push(TemlFullOutput);
                }
                else {
                    FullArray.push(fullOutput);
                }
                FullArraySize = FullArray.length;
                //alert("Full array size: " + FullArraySize);
                CurrentCount = 0;
                GoNext = true;
                document.getElementById("nananadiva").innerHTML = "";
            }

            if(GoNext){
                Terminate = true;
                GoNext = false;
                CurrentCount = CurrentCount + 1;
                if(CurrentCount <= FullArraySize){
                    Terminate = false;
                    TextToProcessNow = FullArray[CurrentCount-1];
                    //alert("NOW: " + TextToProcessNow);
                    ConnectNewFunction();
                }
                else {
                    Terminate = true;
                    document.getElementById("nananadiva").innerHTML = document.getElementById("nananadiva").innerHTML + "<br><b><font size=\"6\" color=\"red\">EVERYTHING DONE</font><b>";
                }
            }
            if(!Terminate){
                /*if(first){
                firstText = document.getElementById("response_time").textContent;
                //alert(firstText);
                first = false;
            }*/

                var x = document.getElementsByTagName("audio");
                var i;
                var CurrentAudio = "";
                for (i = 0; i < x.length; i++) {
                    CurrentAudio = x[i].src;
                    //alert("CurrentAudio: " + CurrentAudio);
                }
                var Continuee = false;
                if(CurrentAudio != LastAudio){
                    LastAudio = CurrentAudio;
                    resourceLast = CurrentAudio;
                    Continuee = true;
                }
                else {
                    //alert('last audio is the same!');
                    resourceLast = "";
                }

                if(Continuee){

                    /* newText = document.getElementById("response_time").textContent;
            //if(newText != firstText){
                //alert('found reponse time!');
                firstText = newText;
                enabled = false;
                var resourceLast = "";
                var resources = window.performance.getEntriesByType("resource");
                resources.forEach(function (resource) {
                    //console.log(resource.name);
                    if (resource.name.indexOf(".mp3") !=-1) {
                        if(resource.name != LastMp3){
                        LastMp3 = resource.name;
                        resourceLast = resource.name;
                        //alert(resourceLast);
                        }
                    }
                });*/
                    //alert(resourceLast.length);
                    if(resourceLast.length > 2){
                        //alert("len ok");

                        var Prefix = document.getElementById("prefix").value;
                        //alert("prefix: " + Prefix);


                        /*var nextLink = document.createElement("a");
                nextLink.setAttribute('href', resourceLast);
                nextLink.setAttribute('download', Prefix + "." + CurrentCount + ".mp3");
                nextLink.setAttribute('style', 'z-index: 2; font-size: 30px;');
                nextLink.innerHTML = "Download: " + Prefix + "." + CurrentCount + ".mp3<br>";
                document.getElementById("nananadiva").appendChild( nextLink );*/

                        window.URL = window.URL || window.webkitURL;

                        var xhr = new XMLHttpRequest(),
                            a = document.createElement('a'), file;

                        xhr.open('GET', resourceLast, true);
                        xhr.responseType = 'blob';
                        xhr.onload = function () {
                            file = new Blob([xhr.response], { type : 'application/octet-stream' });
                            //a.href = window.URL.createObjectURL(file);
                            a.href = (window.URL || window.webkitURL || {}).createObjectURL(file) || function(){};
                            a.download = Prefix + "." + CurrentCount + ".mp3";  // Set to whatever file name you want
                            // Now just click the link you created
                            // Note that you may have to append the a element to the body somewhere
                            // for this to work in Firefox
                            //a.click();
                            var nextLink = document.createElement("a");
                            nextLink.setAttribute('href', window.URL.createObjectURL(file));
                            nextLink.setAttribute('download', Prefix + "." + CurrentCount + ".mp3");
                            nextLink.setAttribute('style', 'z-index: 2; font-size: 30px;');
                            nextLink.innerHTML = "Download: " + Prefix + "." + CurrentCount + ".mp3<br>";
                            document.getElementById("nananadiva").appendChild( nextLink );
                            Waittt = false;
                            PreviousJobFinished = true;

                        };
                        Waittt = true;
                        xhr.send();

                        GoNext = true;


                    }
                    else {
                        firstText = "NOP";
                    }
                }
            }
        }
        if(!Waittt){
            PreviousJobFinished = true;
        }
    }
}

setInterval(function(){ DownloadLoop(); }, 1000);


function LetsGetStarted(){
    firststarted = true;
    started = true;
}



function PokazLinkTvpA() {
    //playAudio();
    //alert('hey');
    stopSpeech();

    $("#response_time").html("&nbsp;");
    _requestTime = getTimeStamp();

    var eInfo = effectInfo[$("#effectId").val()];

    if($("#fulltext").val() == _defaultInput){
        alert("Please enter some text.");
        return;
    }

    var ttsInput = $("#fulltext").val();


    ttsInput = $("#fulltext").val();

    var voiceMapKey = $("#ttsVoices").val();
    var voiceDetails = voiceMap[voiceMapKey];

    if(eInfo.length>0){
        sayText (ttsInput, voiceDetails['voiceId'], voiceDetails['langId'], voiceDetails['engineId'], eInfo, $("#effectLevel").val());
    }
    else{
        sayText (ttsInput, voiceDetails['voiceId'], voiceDetails['langId'], voiceDetails['engineId']); 
    }
}

function addEvent(to, type, fn){
    if(document.addEventListener){
        to.addEventListener(type, fn, false);
    } else if(document.attachEvent){
        to.attachEvent('on'+type, fn);
    } else {
        to['on'+type] = fn;
    }
}

var diva = document.createElement("div");
diva.setAttribute('id', 'nananadiva');
diva.setAttribute('style', 'background-color: #B0E0E6; position:fixed !important; left: 10px; top: 360px; width: 300px; height: 300px;  z-index: 1; overflow-y:scroll');
document.getElementsByTagName( 'body' )[ 0 ].appendChild( diva );


var input = document.createElement("textarea");
input.setAttribute('id', 'fulltext');
input.name = "post";
input.maxLength = "500000";
input.cols = "80";
input.rows = "40";
input.setAttribute('style', 'position:fixed !important; left: 10px; top: 50px; width: 300px; height: 300px;  z-index: 1000000000;');
document.getElementsByTagName( 'body' )[ 0 ].appendChild( input );

var input2 = document.createElement("textarea");
input2.textContent = 1;
input2.setAttribute('id', 'prefix');
input2.name = "post";
input2.maxLength = "10";
input2.cols = "80";
input2.rows = "40";
input2.setAttribute('style', 'position:fixed !important; left: 10px; top: 10px; width: 30px; height: 30px;  z-index: 1000000000;');
document.getElementsByTagName( 'body' )[ 0 ].appendChild( input2 );

var btnTvpa = document.createElement('input');
// btnTvpa.setAttribute('onclick', 'LetsGetStarted');
btnTvpa.setAttribute('value', 'Mona > Ashley');
btnTvpa.setAttribute('type', 'button');
btnTvpa.setAttribute('id', 'btnTvpa');
btnTvpa.setAttribute('style', 'position:fixed !important; left: 90px; top: 10px; width: 100px; height: 35px;  z-index: 1000000000;');

document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnTvpa );
addEvent(document.getElementById('btnTvpa'), 'click', function() {
    LetsGetStarted();
});

function PlusOne(){
var pref = document.getElementById("prefix").value;
var prefplusone = parseInt(pref) + 1;
document.getElementById("prefix").value = prefplusone;
//alert(prefplusone);
}

var btnTvpaA = document.createElement('input');
// btnTvpa.setAttribute('onclick', 'LetsGetStarted');
btnTvpaA.setAttribute('value', '+ 1');
btnTvpaA.setAttribute('type', 'button');
btnTvpaA.setAttribute('id', 'btnTvpaA');
btnTvpaA.setAttribute('style', 'position:fixed !important; left: 50px; top: 10px; width: 35px; height: 35px;  z-index: 1000000000;');

document.getElementsByTagName( 'body' )[ 0 ].appendChild( btnTvpaA );
addEvent(document.getElementById('btnTvpaA'), 'click', function() {
    PlusOne();
});

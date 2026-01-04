// ==UserScript==
// @name         KissAnime Auto Captcha
// @namespace    https://greasyfork.org/en/users/135934-elti-musa
// @version      2.2
// @description  Auto complete KissAnime Captcha
// @author       AnimeBro1
// @match        http://kissanime.ru/Special/AreYouHuman2*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/32938/KissAnime%20Auto%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/32938/KissAnime%20Auto%20Captcha.meta.js
// ==/UserScript==

var images = [];
var words = [];
var count = 0;
(function() {
    $("body").append('<div id="CaptchaInfo" style="display:none;width:200px;height:150px;font-size:20px;position:fixed; top: 10px; left:10px; background: red; border-radius: 25px;padding:40px;"><p></p></div>');
   //getE();
    //alert(GM_listValues());
   if(!isBasicJson()){
       factoryReset();
        getBasicJson();
    }
    document.getElementsByTagName("body")[0].onload = function(){
        var loaders = [];
        var x = $("[indexValue]").toArray();
        for(var i =0; i < 5; i++){
            getBase64Image(x[i]);
        }
        console.log(images);
        words = getWords();
        Complete();
    };
})();

function factoryReset(){
    var keys = GM_listValues();
    for (var i=0; i < keys.length; i++) {
        GM_deleteValue(keys[i]);
    }
}
function isBasicJson(){
    return GM_getValue("AnimeBro2",false);
}

function getBasicJson(){
    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    $("#CaptchaInfo").show();
    $("#CaptchaInfo").find("p").html("First time running, fetching some files... Page will reload.");
    var msg='';
    if(isChrome){
        msg = $.ajax({type: "GET", url: "https://cdn.rawgit.com/Eltion/Kissanime-Chaptcha-Auto-Complete/623d627fa2ec94dea00621e406e66088a61b6bff/BasicJson1.json", async: false}).responseText;
    }else if(isFirefox){
        msg = $.ajax({type: "GET", url: "https://cdn.rawgit.com/Eltion/Kissanime-Chaptcha-Auto-Complete/623d627fa2ec94dea00621e406e66088a61b6bff/BasicJsonFireFox1.json", async: false}).responseText;
    }else{
        alert("Not Chrome or Firefox. Tryng the chrome database");
        msg = $.ajax({type: "GET", url: "https://cdn.rawgit.com/Eltion/Kissanime-Chaptcha-Auto-Complete/623d627fa2ec94dea00621e406e66088a61b6bff/BasicJson1.json", async: false}).responseText;
    }
    msg = JSON.parse(msg);
    for(var i = 0; i < msg.length; i++){
        GM_setValue(msg[i].n,msg[i].v);
    }
    location.reload();
}
function getE(){
    var x = GM_listValues();
    var b = "";
    for(var i =0; i < x.length; i++){
        b += '{"n":"'+x[i]+'","v":"'+GM_getValue(x[i])+'"},';
    }
    $('body').html("<p>"+b+"</p>");
}
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/jpeg",0.2);

    //dataURL = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
    images.push(dataURL);
}

function getWords(){
    var words = $("#formVerify").find("span").toArray();
    var First = words[0].innerText;
    var Second = words[1].innerText;
    return [First, Second];
}

function Learn(){
    $("[indexValue]").on('click', function(){
        count++;
        var x = parseInt($(this).attr("indexValue"));
        if(GM_getValue(words[count-1],false) !== false){
            var nn = GM_getValue(words[count-1])+" "+images[x];
            GM_setValue(words[count-1],nn);
        }else{
            var gg = images[x];
            GM_setValue(words[count-1],gg);
        }
    });
}

function Complete() {
    var jj = 0;
    for(var j = 0; j <2; j++){
        var w1 = GM_getValue(words[j], false);
        if(w1 !== false){
            if(w1.includes(" ")){
                w1 = w1.split(" ");
            }else{
                w1 = [w1];
            }
            //window.prompt("Eltioni",w1);
            for(var k =0; k < w1.length; k++){
                for(var i = 0; i < images.length; i++){
                    if(images[i] === w1[k]){
                        $("[indexValue='"+i+"']").click();
                        jj++;
                        if(j === 0){
                            count++;
                        }
                    }
                }
            }
        }
    }
    UpdateTest(jj);
    Learn();
}

function UpdateTest(jj){
    if(jj === 0){
        $("#CaptchaInfo").show();
        $("#CaptchaInfo").find("p").html("Couldn't recognize the images. Please select them so script can learn them for next time. IMPORTANT ***Select them in order***");
    }else if(jj === 1){
        $("#CaptchaInfo").show();
        $("#CaptchaInfo").find("p").html("Only one of the images is recognized. Please select the other one so script can learn it for next time.");
    }
}

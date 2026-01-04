// ==UserScript==
// @name         KissAnime Auto Captcha V3.2
// @namespace    https://greasyfork.org/en/users/135934-elti-musa
// @version      3.2.1
// @description  Auto complete KissAnime Captcha
// @author       AnimeBro1
// @match        http://kissanime.ru/Special/AreYouHuman2*
// @grant        GM_setValue
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/30964/KissAnime%20Auto%20Captcha%20V32.user.js
// @updateURL https://update.greasyfork.org/scripts/30964/KissAnime%20Auto%20Captcha%20V32.meta.js
// ==/UserScript==


var words = [];
var imagesURL;
var count = 0;
var images = ["","","",""];
var imagecount = 0;
var imageURLcount = 0;
var w;

(function() {
    $("body").append('<div id="CaptchaInfo" style="z-index: 99999999; display:none;width:200px;height:150px;font-size:14px;position:fixed; top: 10px; left:10px; background: #14dd3edb; border-radius: 25px;padding:40px;"><p></p></div>');

    if(!isBasicJson()){
        alert("FIRST TIME RUNNING: Make sure you REMOVE previous version of the script.");
        factoryReset();
        getBasicJson();
    }else{
        words = getWords();
        imagesURL = $("[indexValue]").toArray();
        toDataURL(imagesURL[0].src,function(data){DONE(data);});
    }
})();

function DONE(a){
    //alert(imageURLcount);
    imageURLcount++;

    images[imagecount] = cutImage64(cutImage64(a,3),2);
    if(imagecount == 3){
        console.log(images);
        Complete();
    }else{
        toDataURL(imagesURL[imageURLcount].src,function(data){DONE(data);});
        imagecount++;
    }
}

function getWords(){
    var words = $("#formVerify").find("span").toArray();
    var First = words[0].innerText;
    var Second = words[1].innerText;
    return [First, Second];
}

function cutImage64(base64,s){
    var a = "";
    for(var i = 0; i < base64.length; i=i+s){
        a += base64.charAt(i);
    }
    return a;
}

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var reader = new FileReader();
    reader.onloadend = function() {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
    //alert("http://kissanime.ru/Special/"+url);
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

function getBasicJson(){
    $("#CaptchaInfo").show();
    $("#CaptchaInfo").find("p").html("First time running, fetching some files... Page will reload.");
    var msg='';
    //msg = $.ajax({type: "GET", url: "https://cdn.rawgit.com/Eltion/Kissanime-Chaptcha-Auto-Complete/111255eebd4ee25aaa2ad6d072b75ae446217d97/KissAnime.Downloader.Chaptcha.Database.json", async: false}).responseText;
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://cdn.rawgit.com/Eltion/Kissanime-Chaptcha-Auto-Complete/eee0c4153d22cec5a5327efc8d7d8ba3b37394d9/KissAnime.Downloader.Chaptcha.Database2.json",
        synchronous: true,
        onload: function(response) {
            msg = response.responseText;
            msg = JSON.parse(msg);
            for(var i = 0; i < msg.length; i++){
                GM_setValue(msg[i].n,msg[i].v);
            }
            location.reload();
        }
    });
}
function isBasicJson(){
    return GM_getValue("AnimeBro3",false);
}

function factoryReset(){
    var keys = GM_listValues();
    for (var i=0; i < keys.length; i++) {
        GM_deleteValue(keys[i]);
    }
}

function Complete() {
    var jj = 0;
    console.log(images);
    for(var j = 0; j <2; j++){
        var w1 = GM_getValue(words[j], false);
        if(w1 !== false){
            if(w1.includes(" ")){
                w1 = w1.split(" ");
            }else{
                w1 = [w1];
            }
            for(var k =0; k < w1.length; k++){
                for(var i = 0; i < images.length; i++){
                    if(images[i] === w1[k]){
                        $("[indexValue='"+i+"']").click();
                        jj++;
                    }
                }
            }
        }
    }
    if(jj < 2){
        location.reload();
    }
    //UpdateTest(jj);
    //Learn();
}

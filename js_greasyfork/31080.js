// ==UserScript==
// @name         KissAnime Downloader
// @namespace    https://greasyfork.org/en/users/135934-anime-bro1
// @version      3.3.1
// @description  This is a userscript that will download multi episodes form KissAnime.
// @author       AnimeBro1
// @homepage     https://github.com/Eltion/Kissanime-Downloader
// @match        http://kissanime.ru/Anime/*
// @include      http://kissanime.ru/Anime/*
// @exclude      http://kissanime.ru/Anime/*/*
// @grant        GM_getValue
// @grant        GM_listValues
// @run-at       document-end
// @grant        GM_deleteValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js

// @require      https://cdn.rawgit.com/Eltion/Kissanime-Downloader/ee154d713ce5af9c031b4abdd20fae8bb7cc2dc5/css.js
// @require      https://cdn.rawgit.com/Eltion/Kissanime-Downloader/4fc64d92baba62fb52de03a3472464c2b6466ed9/vr2.js
// @require      https://cdn.rawgit.com/Stuk/jszip/579beb1d45c8d586d8be4411d5b2e48dea018c06/dist/jszip.min.js
// @require      https://cdn.rawgit.com/Eltion/Kissanime-Downloader/b24ffcadd00a4f3eda526e213f4d4c8d5196af6c/FlieSaver.js

// @downloadURL https://update.greasyfork.org/scripts/31080/KissAnime%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/31080/KissAnime%20Downloader.meta.js
// ==/UserScript==

var curretEP = "";
var currnetEpIndex = 0;
var EpisodesName = [];
var EpisodesLinks = [];
var EpisodesVideoLinks = [];
var isEval = false;


var images = ["","","",""];
var imagecount = 0;
var imagesURL;
var imageURLcount = 0;
var clickNr = 0;
var w;

var nameOfAnime = "";

var start = "";
var end = "";
var isText = false;
var isHTML = false;
var isM3U8 = false;
var isRapid = false;
var isBeta = false;
var isIDM = false;
var server = 1;
var quality = [];

var coutFailedCh = 0;

var max = 1;



(function() {
     if(!isBasicJson()){
        factoryReset();
        getBasicJson();
    }
    //curretEP = "http://kissanime.ru/Anime/Shokugeki-no-Souma-San-no-Sara/Episode-005?id=140040";
    //getEp(curretEP);
     //getE();
    max = $(".listing").find("a").toArray().length;
    setUI();
    $("#aend").attr('value',max+"");
    $("#startscript").on('click',function(){
        start = $("#astart").val();
        end = $("#aend").val();
        if($("#aquality").val().includes(",")){
            quality = $("#aquality").val().split(",");
        }else{
            quality = [$("#aquality").val()];
        }
        isText = $("#atxt").get(0).checked;
        isHTML = $("#ahtml").get(0).checked;
        isM3U8 = $("#am3u8").get(0).checked;
        isIDM = $("#idm").get(0).checked;
        isBeta = $("#abeta").get(0).checked;
        isRapid = $("#arapid").get(0).checked;
        if(isBeta){
            server = 1;
        }else if(isRapid){
            server = 2;
        }else{
            alert("Select a server");
            return;
        }
        nameOfAnime = location.href.split("/")[4].replace(/-/g," ");
        //alert(nameOfAnime);
        $("#adownloader").hide(500);
        $("#ainfo").show(500);
    getAllEpisodes();
    });
})();

function getE(){
    var x = GM_listValues();
    var b = "";
    for(var i =0; i < x.length; i++){
        b += '"'+x[i]+'":"'+GM_getValue(x[i])+'",';
    }
    $('body').html("<p>"+b+"</p>");
}

function setUI(){
    $("body").append('<div id="CaptchaInfo" style="z-index: 99999999; display:none;width:200px;height:150px;font-size:14px;position:fixed; top: 10px; left:10px; background: #14dd3edb; border-radius: 25px;padding:40px;"><p></p></div>');
    var imgSrc = "https://cdn.rawgit.com/Eltion/Kissanime-Downloader/024c2d98b5580a14d1eaf74276d641c88f04764a/Download%20ButtonGreen.png";
    var html = '<div id="adownloader" style="position:fixed; bottom:10px; left:10px; z-index: 99999999;"><img id="startscript" style="cursor:pointer;float:left;position: relative; top:5px;margin-right:10px;" width="90px" src="'+imgSrc+'"><div style="background: #14dd3edb; position: relative;height:90px;padding:10px;border-radius: 10px;/* text-align:center; */color: white;float: left;"><div style="display: inline-block;float: left;margin-top: 13px;margin-left: 10px;">Start: <input value="1" id="astart" style="color:white;text-align:center;width: 30px;background: transparent;border: 0.5px solid white;border-radius:5px;" type="text"><input id="aend" value="7" style="color:white;text-align:center;width: 30px;background: transparent;border: 0.5px solid white;border-radius:5px;float: right;" type="text"><span style=" float: right; margin-right: 5px; ">End:</span><br><br>Quality: <input id="aquality" value="1080,720,480,360" style="color:white;text-align:center;width: 120px;background: transparent;border: 0.5px solid white;border-radius:5px;" type="text"></div><div style="display:inline-block;float:left;margin: 0px 10px;vertical-align: middle;"><input id="atxt" type="checkbox" style=" vertical-align: middle; ">Text<br><input id="ahtml" type="checkbox" style=" vertical-align: middle; ">Html<br><input id="am3u8" type="checkbox" style=" vertical-align: middle; ">M3u8<br><input id="idm" type="checkbox" style=" vertical-align: middle; ">IDM</div><div style="display:inline-block;float:left;margin: 0px 10px;vertical-align: middle;"><input id="abeta" type="checkbox" style=" vertical-align: middle; ">Beta<br><input id="arapid" type="checkbox" style=" vertical-align: middle; ">RapidVideo <br /><div style="text-align: center; font-size: 14pt;margin-top:10px;"><a href="https://github.com/Eltion/Kissanime-Downloader" target="_blank" >Help?</a></div></div></div></div>';
    var html2 = "<div id='ainfo' style=' padding:10px;z-index: 99999999; border-radius:20px;position:fixed; display: none; bottom:10px; right:10px; background:#14dd3edb;height:100px;width:400px;'><h3 style='text-align: center'>KissAnime Downloader</h3><p style='width:100%; word-wrap: break-word;' id='aoutput'></p><p id='aprogress'></p></div>";
    //var html3 = "<div id='ainfo2' style='background: red; padding: 10px; position: a'>"
    $('body').append(html);
    $('body').append(html2);
}

function getEp(url){
    console.log(currnetEpIndex);
    $('#aoutput').html("Grabbing: "+url+"...");
    var msg = $.ajax({type: "GET", url: url, async: false}).responseText;
    if(isCapacha(msg)){
        GetWords(msg,function(){
            getImages(msg);
        });
    }else{
        if(server == 1){
            beta(msg);
        }else if(server == 2){
            rapidvideo(msg);
        }
    }
}

function getAllEpisodes(){
    EpisodesLinks =[];
    EpisodesName = [];
    var x = $(".listing").find("a").toArray();
    console.log(x);
    for(var i =0; i < x.length; i++){
        if(!x[i].href.includes("reddit")){
            var ee = "";
            if(server == 1){
                ee = x[i].href+"&s=beta&pfail=1";
            }else{
                ee = x[i].href+"&s=rapidvideo";
            }
            EpisodesLinks.push(ee);
            EpisodesName.push(x[i].innerText);
        }
    }

     if(parseInt(start) < 0){
        alert("Error: Start < 0");
        return;
    }else if(parseInt(end) < parseInt(start)){
        alert(end+" "+start);
         alert("Error: Start > End");
        return;
    }else if(parseInt(end) > EpisodesLinks.length){
        alert("End > total nr of episodes. Max nr "+EpisodesLinks.length);
        return;
    }else if(!(isText || isHTML || isM3U8 || isIDM)){
        alert("Please select one of the opitons");
        return;
    }

    EpisodesLinks.reverse();
    EpisodesName.reverse();
    EpisodesLinks = EpisodesLinks.slice( parseInt(start)-1, parseInt(end));
    EpisodesName = EpisodesName.slice(parseInt(start)-1,parseInt(end));

    console.log(EpisodesLinks);
    curretEP = EpisodesLinks[0];
    getEp(curretEP);
}




function getImages(html){
    //console.log(html);
    imagesURL = html.match(/CapImg[^"']*/g);
    //console.log(imagesURL);
    toDataURL(imagesURL[0],function(data){allDone(data);});
}

function GetWords(html,callbackGetImages){
    var form = html.split("formVerify")[1].split("</form")[0];
    var x = form.match(/(?:<span[^>]*>\s*)([^<]*)/g);

    var word1 = x[0].split(">")[1].replace(/\s\s/g,"");

    var word2 = x[1].split(">")[1].replace(/\s\s/g,"");
    w = [word1,word2];
    callbackGetImages();
}


function allDone(d){
    console.log(d);
    imageURLcount++;
    images[imagecount] = cutImage64(cutImage64(d,3),2);
    if(imagecount == 3){
        console.log(images);
        Complete();
    }else{
        toDataURL(imagesURL[imageURLcount],function(data){allDone(data);});
        imagecount++;
    }
}

function Complete() {
    var postData = "";
    //console.log(w);
    for(var j = 0; j <2; j++){
        var w1 = GM_getValue(w[j], false);
        if(w1 !== false){
            if(w1.includes(" ")){
                w1 = w1.split(" ");
            }else{
                w1 = [w1];
            }
            for(var k =0; k < w1.length; k++){
                for(var i = 0; i < images.length; i++){
                    if(images[i] === w1[k]){
                        postData += i+",";
                    }
                }
            }
        }
    }

    if(postData.length == 4){
        postdata(postData);
    }else{
        coutFailedCh++;
        if(coutFailedCh < 3){
            getNextEpisode(false);
        }else{
            coutFailedCh =0;
            MobileFallBack();
        }
    }
}

function MobileFallBack(){
    console.log("MobileFallBack: "+ EpisodesLinks[currnetEpIndex]);
    var id = EpisodesLinks[currnetEpIndex].split("?id=")[1].split("&")[0];
    var x = $.ajax({type: "POST", url:"http://kissanime.ru/Mobile/GetEpisode", data:{eID:id},async: false}).responseText;
    x = x.split("|||")[0];

    if(x.includes("rapidvideo")){
        rapidvideo(x+'"');
    }else{
         EpisodesVideoLinks.push(x);
         getNextEpisode(true);
    }
}

function isCapacha(html){
    return html.includes("formVerify");
}

function postdata(answer){
    var data = {reUrl: curretEP, answerCap: answer};
    var msg = $.ajax({type: "POST", url: "http://kissanime.ru/Special/AreYouHuman2",data: data ,async: false}).responseText;
        if(server == 1){
            beta(msg);
        }else if(server == 2){
            rapidvideo(msg);
        }
}

function getNextEpisode(a){
    images = ["","","",""];
    imagecount = 0;
    imagesURL = [];
    imageURLcount = 0;
    clickNr = 0;
    w= ["",""];
    if(a){currnetEpIndex++;}
    if(currnetEpIndex < EpisodesLinks.length){
        curretEP = EpisodesLinks[currnetEpIndex];
        getEp(curretEP);
    }else{
        console.log(EpisodesVideoLinks);
        ALLDONE();
        console.log("DONE");
    }
}

function ALLDONE(){
    if(isText){
        createTxtList();
    }if(isHTML){
        createHTMLlist();
    }if(isM3U8){
        createM3U8();
    }if(isIDM){
        createIDM();
    }
}

function createTxtList(){
    var list ="";
    for(var i = 0; i < EpisodesVideoLinks.length; i++){
        list += encodeURI(EpisodesVideoLinks[i]) + "[" +  EpisodesName[i].replace(/[\s:\|\[\]\{\}]+/g,"_") + ".mp4\n";
    }
    $("#CaptchaInfo").show();
    $("#CaptchaInfo").find("p").html("You need to download <a href='https://cdn.rawgit.com/Eltion/Kissanime-Downloader/040e60bfcfc57c1b27e3ca7faf65204abf435056/KissAnime%20Downloader.zip'>KissAnime Downloader.zip</a><br /><br /> <a href='https://cdn.rawgit.com/Eltion/Kissanime-Downloader/5f62b6848a62d208ee799d6a8b256741fd7b9229/README.md'>Read this.</a>");

    download("list.txt","text/plain",list);
}

function createHTMLlist(){
    var list ="";
    for(var i = 0; i < EpisodesVideoLinks.length; i++){
        list += '<a href="' + EpisodesVideoLinks[i] + '" download="' +  EpisodesName[i] + '">' +  EpisodesName[i] + '</a> <span onclick="e(this)"><u>(WATCH)</u></span><br>';
    }
    list += '<div id="ee" style="display:none;position:absolute;top:0;left:0;background:black;width:100%;height:100%;"><video style="display:block;position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);" id="video" src="" width="700" autoplay controls></video><img onclick=\'document.getElementById("ee").style.display = "none";document.getElementById("video").src= "";\' style="position: absolute; top:0;right:0;width:75px;" src="http://www.hccs.edu/media/hcc-redesign/style-assets/images/img/close.png" /></div> <script type="text/javascript">function e(a){document.getElementById("ee").style.display = "block"; document.getElementById("video").src = a.previousSibling.previousSibling.href; } </script>';
    download("list.html","text/html",list);
}

function createM3U8(){
    var list =" #EXTM3U\n\n";
    for(var i = 0; i < EpisodesVideoLinks.length; i++){
        list += '#EXTINF:-1,'+EpisodesName[i]+"\n"+encodeURI(EpisodesVideoLinks[i])+"\n\n";
    }
     $("#CaptchaInfo").show();
    $("#CaptchaInfo").find("p").html("You can play this with VLC player.");

    download("list.m3u8","text/plain",list);
}

function createIDM(){
    var list ='IF EXIST %PROGRAMFILES(X86)%\n(cd "%ProgramFiles(x86)%\\Internet Download Manager")\nELSE (cd "%ProgramFiles%\\Internet Download Manager")\n';
    for(var i = 0; i < EpisodesVideoLinks.length; i++){
        //list += encodeURI(EpisodesVideoLinks[i]) + "[" +  EpisodesName[i].replace(/[\s:\|\[\]\{\}]+/g,"_") + ".mp4\n";
        list += 'IDMan.exe  /n /p "%UserProfile%\\Downloads\\Anime\\'+ nameOfAnime+ '" /a /f "' + EpisodesName[i].replace(/[\s:\|\[\]\{\}]+/g,"_")+'.mp4" /d "'+encodeURI(EpisodesVideoLinks[i])+'"\n';
    }
    list += "IDMan.exe /s \n";
    list += "IDMan.exe";
    var zip = new JSZip();
    zip.file("IDMan.bat", list);
    zip.generateAsync({type:"blob"}).then(function(content) {
        saveAs(content, nameOfAnime+".zip");
    });
    $("#CaptchaInfo").show();
    $("#CaptchaInfo").find("p").html("You need to install <a href='https://www.internetdownloadmanager.com/download.html'>Internet Download Manager</a><br /><br />If Internet Download Manager shows errors just run IDMan.bat again.");
}

function download(filename, datatype, text) {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:' + datatype + ';charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	// element.setAttribute('target', '_blank');
	// ^^ problems with safari

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}
function beta(html){
    var $htmlP = $($.parseHTML(html,document,true));
    if(!isEval){
        var script1 = $htmlP.find("script").toArray();
        for(var i = 0; i < script1.length; i++){
            var e = script1[i].innerHTML;
            if(e.includes(" key ") || e.includes(" skH ") ){
                eval(e);
                isEval = true;
            }
        }
}
    var x = $htmlP.find("#slcQualix").find("option").toArray();
    loop1:for(var k =0; k < quality.length; k++){
        for(var j =0; j < x.length; j++){
            if(x[j].innerText.includes(quality[k])){
                var decodedVideoLink = ovelWrap(x[j].value);
                if(decodedVideoLink !== 0){
                     EpisodesVideoLinks.push(decodedVideoLink);
                }else{
                    alert("Dekoding failed");
                    return;
                }
                break loop1;
            }
        }
    }
    getNextEpisode(true);
}

function rapidvideo(html){
    var qS = ["720","480","360"];
    var setQuality = "";
    var url = html.match(/https:\/\/www.rapidvideo.com\/e\/[^"']*/g);
    for(var i = 0; i < quality.length; i++){
        if(qS.includes(quality[i])){
            setQuality = quality[i]; break;
        }
    }
    console.log(setQuality);
    url += "&q="+setQuality+"p";
    //alert(url);
    GM_xmlhttpRequest({
        method: "GET",
        url: ""+url,
        synchronous: true,
        onload: function(response) {
            //console.log(response);
            var e = response.responseText.split('<source src="')[1].split('"')[0];
            if (e === undefined || e === null) {
                console.log(response.responseText);
            }else{
                console.log(e);
                EpisodesVideoLinks.push(e);
                getNextEpisode(true);
                //epsLinks.push(e);
            }
        }
    });
}

function factoryReset(){
    var keys = GM_listValues();
    for (var i=0; i < keys.length; i++) {
        GM_deleteValue(keys[i]);
    }
}

function cutImage64(base64,s){
    var a = "";
    for(var i = 0; i < base64.length; i=i+s){
        a += base64.charAt(i);
    }
    return a;
}

function isBasicJson(){
    return GM_getValue("AnimeBro3",false);
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
  xhr.open('GET', "http://kissanime.ru/Special/"+url);
  xhr.responseType = 'blob';
  xhr.send();
}


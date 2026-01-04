// ==UserScript==
// @name         KissManga Downloader
// @namespace    https://greasyfork.org/en/users/135934-anime-bro1
// @version      0.1
// @description  Downloads chapters from kissmanga as pdf.
// @author       AnimeBro1
// @match        http://kissmanga.com/Manga/*
// @include      http://kissmanga.ru/Manga/*
// @exclude      http://kissmanga.ru/Manga/*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @require      https://cdn.rawgit.com/Eltion/KissManga-Downloader/66f262245f3bf9ab86fb52ccf9f596d2cb527b25/ca.js
// @require      https://cdn.rawgit.com/Eltion/KissManga-Downloader/11734bc8aee28de5619beacb43e12c608e08478f/lo.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.5/jspdf.min.js
// @downloadURL https://update.greasyfork.org/scripts/35949/KissManga%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/35949/KissManga%20Downloader.meta.js
// ==/UserScript==

var image = [];
var imagecount = 0;
var pdf;
var start = "";
var end = "";
var ChapterLinks =[];
var ChapterName = [];
var currentChp = "";
var currnetChpIndex = 0;
var isEval = false;

var nameOfManga ="";

var isaPdf = false;
var isLongPdf = false;

var x = [];

var img;
(function() {
     img = new Image();
    x = $(".listing").find("a").toArray();
    img.crossOrigin="anonymous";
    max = $(".listing").find("a").toArray().length;
    setUI();
    $("#aend").attr('value',max+"");
    $("#startscript").on('click',function(){
        start = $("#start").val();
        end = $("#end").val();
        isaPdf = $("#apdf").get(0).checked;
        isLongPdf = $("#pdf").get(0).checked;

         if(isLongPdf){
            pdf = new jsPDF({ unit: 'px'});
            nameOfManga = location.href.split("/")[4].replace(/-/g," ");
        }

        getAllChapters();
    });
})();

function setUI(){
    var imgSrc = "https://cdn.rawgit.com/Eltion/Kissanime-Downloader/024c2d98b5580a14d1eaf74276d641c88f04764a/Download%20ButtonGreen.png";
    var html = '<div id="adownloader" style="position:fixed; bottom:10px; left:10px; z-index: 99999999;"><img id="startscript" style="cursor:pointer;float:left;position: relative; top:5px;margin-right:10px;" width="90px" src="https://cdn.rawgit.com/Eltion/Kissanime-Downloader/024c2d98b5580a14d1eaf74276d641c88f04764a/Download%20ButtonGreen.png"><div style="background: #14dd3edb;position: relative;padding:10px;border-radius: 10px;/* text-align:center; */color: white;float: left;"><div style="display: inline-block;float: left;">Start:<br /><select style="width:150px;" id="start"></select><br />End:<br /><select style="width:150px;" id="end"></select></div><div style="display:inline-block;float:left;margin: 25px 10px;vertical-align: middle;"><input id="apdf" type="checkbox" style=" vertical-align: middle; ">Download each chapter as pdf<br><input id="pdf" type="checkbox" style=" vertical-align: middle; ">Download all chapters in one pdf</div></div></div>';
    var html2 = "<div id='ainfo' style=' padding:10px;z-index: 99999999; border-radius:20px;position:fixed; display: none; bottom:10px; right:10px; background:#14dd3edb;height:100px;width:400px;'><h3 style='text-align: center'>KissManga Downloader</h3><p style='width:100%; word-wrap: break-word;' id='aoutput'></p><p id='aprogress'></p></div>";
    //var html3 = "<div id='ainfo2' style='background: red; padding: 10px; position: a'>"
    console.log(x[0]);
    $('body').append(html);
    $('body').append(html2);
    for (var i =x.length-1; i > -1; i--){
        $("#start").append("<option value='"+(x.length-i)+"'>"+x[i].innerText+"</option>");
        $("#end").append("<option value='"+(x.length-i)+"'>"+x[i].innerText+"</option>");
    }
    $("#start").find("option").first().attr("selected",'');
     $("#end").find("option").last().attr("selected",'');
}

function getAllChapters(){

    ChapterLinks =[];
    ChapterName = [];
    for(var i =0; i < x.length; i++){
        ChapterLinks.push(x[i].href);
        ChapterName.push(x[i].innerText);
    }

     if(parseInt(start) < 0){
        alert("Error: Start < 0");
        return;
    }else if(parseInt(end) < parseInt(start)){
        alert(end+" "+start);
         alert("Error: Start > End");
        return;
    }else if(parseInt(end) > ChapterLinks.length){
        alert("End > total nr of episodes. Max nr "+ChapterLinks.length);
        return;
    }else if(!(isaPdf || isLongPdf)){
        alert("Please select one of the opitons");
        return;
    }

    ChapterLinks.reverse();
    ChapterName.reverse();
    ChapterLinks = ChapterLinks.slice( parseInt(start)-1, parseInt(end));
    ChapterName = ChapterName.slice(parseInt(start)-1,parseInt(end));

    console.log(ChapterLinks);
    currentChp = ChapterLinks[0];
    $("#ainfo").show();
    $("#adownloader").hide();
    getChapter(currentChp);
}

function getChapter(url){
    if(isaPdf){
        pdf = new jsPDF({ unit: 'px'});
    }
    var html = $.ajax({type: "GET", url: url, async: false}).responseText;
    $("#aoutput").html("Downloading Chapter: " +ChapterName[currnetChpIndex]);
    var code = html.match(/wrapKA\("[^"]*/g);
    console.log(code);
    var $htmlP = $($.parseHTML(html,document,true));
    if(!isEval){
        var script1 = $htmlP.find("script").toArray();
        for(var i = 0; i < script1.length; i++){
            var e = script1[i].innerHTML;
            if(e.includes(" key ") || e.includes(" skH ") ){
                console.log(e);
                eval(e);
                isEval = true;
            }
        }
    }
    for(var j = 0; j < code.length; j++){
        image.push(getDecodedImg(code[j].split('"')[1]));
    }
    console.log(image);
    getBase64Image(image[0],function(data){allDone(data);});
}

function getDecodedImg(encoded){
    var decoded = wrapKA(encoded);
    return decoded;
}

function allDone(data){

    imagecount++;
    $("#aprogress").html(" Page: " + imagecount);
    console.log(imagecount);
    pdf.addPage(img.width,img.height);
    pdf.addImage(data, 'JPEG', 0, 0,img.width,img.height);
    if(imagecount < image.length){
        getBase64Image(image[imagecount],function(data){allDone(data);});
    }else{
        if(isaPdf){
           pdf.deletePage(1);
           pdf.save(ChapterName[currnetChpIndex]);
        }
        if(currnetChpIndex < ChapterLinks.length-1){
            GetNextChapter();
        }else{
            if(isLongPdf){
                pdf.deletePage(1);
                pdf.save(nameOfManga+".pdf");
            }
        }
    }
}

function GetNextChapter(){

    image = [];
    imagecount = 0;
    currnetChpIndex++;
    currentChp = ChapterLinks[currnetChpIndex];//alert(currentChp);
    getChapter(currentChp);
}

function getBase64Image(url,callback) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    img.onload = function(){
        ctx.drawImage(img,0,0); // Or at whatever offset you like

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/jpeg");

        callback(dataURL);
    };
    img.src = url;
}

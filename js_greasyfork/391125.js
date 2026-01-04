// ==UserScript==
// @name         lrcReader[typing-tube.net]
// @namespace    http://tampermonkey.net/lrcReader
// @version      0.45
// @description  Add buttons to load the .lrc format file on the edit screen on typing-tube.net.
// @author       Spacia
// @match        https://typing-tube.net/movie/edit?videoid=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391125/lrcReader%5Btyping-tubenet%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/391125/lrcReader%5Btyping-tubenet%5D.meta.js
// ==/UserScript==

//Greasy Fork https://greasyfork.org/ja/scripts/391474-realtimecombatting-typing-tube

//This is the Entry point.
(function() {
    'use strict';

    AddLrcReaderElements();

})();

//--------------------------------------------------------------
function AddLrcReaderElements(){

    // Add a div element to be container to the bottom of the navigation menu "edit".
    var elDiv = document.createElement("div");
    elDiv.classList.add('row');
    elDiv.classList.add('ml-2');
    elDiv.classList.add('w-100');
    elDiv.id = "ContainerOflrcReader";
    var elEdit = document.getElementById("edit");
    elEdit.appendChild(elDiv);
    var elDevId = document.getElementById("ContainerOflrcReader");

    // Add a button for uploading .lrc format file in container created by former code.
    var elTextDiv = document.createElement("div");
    elTextDiv.classList.add("col-4");
    elTextDiv.innerHTML = "lrcファイルを参照";
    elDevId.appendChild(elTextDiv);

    var elForm = document.createElement("form");
    elForm.classList.add("col-6");
    elForm.innerHTML = "<div><input name='lrcFile' type='file' accept='.lrc'></div>";
    elForm.addEventListener('change', onLoadLrc);
    elDevId.appendChild(elForm);


    // Add a div element to be container to the bottom of the navigation menu "edit".
    var elDiv2 = document.createElement("div");
    elDiv2.classList.add('row');
    elDiv2.classList.add('ml-2');
    elDiv2.classList.add('w-100');
    elDiv2.id = "ContainerOflrcReader2";
     elEdit.appendChild(elDiv2);

    // Add a button for uploading .lrc format file in container created by former code.
    var elTextDiv2 = document.createElement("div");
    elTextDiv2.classList.add("col-4");
    elTextDiv2.innerHTML = "replファイルを参照";
    elDiv2.appendChild(elTextDiv2);

    var elForm2 = document.createElement("form");
    elForm2.classList.add("col-6");
    elForm2.innerHTML = "<div><input name='replFile' type='file' accept='.repl.txt'></div>";
    elForm2.addEventListener('change', onLoadRepl);
    elDiv2.appendChild(elForm2);

    // Add a div element to be container to the bottom of the navigation menu "edit".
    var elDiv3 = document.createElement("div");
    elDiv3.classList.add('row');
    elDiv3.classList.add('ml-2');
    elDiv3.classList.add('w-100');
    elDiv3.id = "ContainerOflrcReader2";
    elEdit.appendChild(elDiv3);

    // Add radio buttons to select English or Kana.
    var elForm3 = document.createElement("form");
    elForm3.classList.add("col-4");
    //> @note rewrite 2020/08/12 ---------
    elForm3.innerHTML = "<span style='padding-right:20px;'><label><input id='lrcConverTypeKana' name='lrcConvertType' type='radio' value='kana' checked>かな </label></span>"
     + "<span><label><input id='lrcConverTypeEng' name='lrcConvertType' type='radio' value='eng'>英語(旧環境 削除予定)</label></span>"
    +"<span><label><input id='lrcConverTypeCopy' name='lrcConvertType' type='radio' value='copy'>丸コピ</label></span>";
    //> @note end ---------
    elDiv3.appendChild(elForm3);

    var elDiv4 = document.createElement("div");
    elDiv4.classList.add('row');
    elDiv4.classList.add('ml-2');
    elDiv4.classList.add('w-100');
    elDiv4.id = "ContainerOflrcReader2";
    elEdit.appendChild(elDiv4);

    var btStart = document.createElement("input");
    btStart.id = "LRstart";
    btStart.setAttribute("type","button");
    btStart.setAttribute("value","lrcファイルの読み込みを開始！");
    btStart.setAttribute("style","margin:4px 4px");
    btStart.disabled = true;
    btStart.addEventListener("click", start);
    elDiv4.appendChild(btStart);


}
var _file;
var fr;
//--------------------------------------------------------------

function onLoadLrc(event){
    _file = event.target.files[0];

    document.getElementById("LRstart").disabled = (_file == null);

    if(_file != null){

        fr = new FileReader();
        fr.onload = function(e) {
            // A file was loaded.
            SetLinesOfLyricsToTimelineTable(fr.result.split('\n'));
        }
    }
}

var mapOfRuby = {};
//--------------------------------------------------------------
function onLoadRepl(event){
  var _file = event.target.files[0];

    if(_file != null){
        var fr = new FileReader();
        fr.onload = function(e) {
            // A file was loaded.
            var listOfRuby = fr.result.split('\n');
            mapOfRuby = {};
            listOfRuby.forEach((ruby) => {
                var val = ruby.match(/,[^,]*$/)[0].replace(",", "").replace("\"", "");
                var key = ruby.match(/^[^,]*,/)[0].replace(",", "").replace("\"", "");
//                 console.log(key);
//                 console.log(val);
                mapOfRuby[key] = val;
            });
        }
         fr.readAsText(_file);
    }
}

//--------------------------------------------------------------
function start(){
    SetTimeEvent();
    //> @note rewrite 2020/08/12 ---------
    document.getElementById("LRstart").disabled = (true);
    //> @note end ---------

    if(fr){
        fr.readAsText(_file);
    }else{
        alert("Failed to load file formated .lrc");
    }
}

    //> @note rewrite 2020/08/12 ---------
var loadMode; //mode type 'kana or eng or copy'
var lineidx = 0;
var time;
var editedLine;
var lines;
var timeEventFlag;

function SetTimeEvent(){

    setTimeout(() => {
        if(document.getElementById("kana").value.length != 0){
            Clock_AddTimeTable();
        }
        if(timeEventFlag){
            SetTimeEvent();
        }
    }, 20);

}

//--------------------------------------------------------------
function SetLinesOfLyricsToTimelineTable(_lines) {

    //> @note rewrite 2020/08/12 ---------
    if(document.getElementById('lrcConverTypeKana').checked){
        loadMode = 'kana';
    } else if(document.getElementById('lrcConverTypeEng').checked){
        loadMode = 'eng';
    }else{
        loadMode = 'copy';
    }
    //> @note end
    lineidx = 0;
    lines = _lines;
    timeEventFlag = true;

    retriveLineInfo();
}


//--------------------------------------------------------------
function retriveLineInfo(){

    var line = lines[lineidx++];

    var ptnsOfTimeTag = [
        　/\[\d\d:\d\d:\d\d\]/g,
    		/\[\d\d:\d\d.\d\d\]/g,
    		/\[\d\d:\d\d]/g
    		];

    //if empty line then check next line.
    var isEmpty = true;
    var isCsOmitted = false;
   ptnsOfTimeTag.forEach(function(ptn, idx){
       if(ptn.test(line) == true){
           isEmpty = false;
           if(idx == 2){
               isCsOmitted = true;
           }
       }
   });
    if(isEmpty){
        if(lineidx < lines.length){
            retriveLineInfo();
        }else{
            timeEventFlag = false;
            addRuby();
        }
        return;
    }


    //get time for this line.
    var ptnOfTwoDigidTime = /\d\d/g;
    var timesStr = line.match(ptnOfTwoDigidTime);
    var minute = parseFloat(timesStr[0]);
    var second = parseFloat(timesStr[1]);
    var centiSec =  0;
    if(!isCsOmitted){
       centiSec = parseFloat(timesStr[2]);
    }
    time = minute * 60 + second + centiSec * 0.01;
    //console.log(time);

    //get line of text.
    editedLine = line;
    ptnsOfTimeTag.forEach(function(ptn, idx){
        editedLine = editedLine.replace(ptn,"").trim();
   });
    //console.log(editedLine);

    //Add time and lineLyrics to the timeline Table in the navigation menu "edit".
    document.getElementById("time").value = time;
    document.getElementById("words").value = editedLine;

    //空行なら変換の必要なし。タイムテーブルにそのまま追加
    if(editedLine.length == 0){
        Clock_AddTimeTable(true);
        return;
    }

    //> @note rewrite 2020/08/12 ---------
    if(loadMode == 'kana'){
        command_kakasi();
    }else  if(loadMode == 'eng'){
        command_kakasi_en();
    }else{
        document.getElementById("kana").value = editedLine;
    }
//> @note end
}


//--------------------------------------------------------------
function Clock_AddTimeTable(isEmptyLine = false){
    if(isEmptyLine || document.getElementById("kana").value.length != 0){
        command_add();
        if(lineidx < lines.length){
            retriveLineInfo();
        }else{
            timeEventFlag = false;
            addRuby();
        }
    }
}


//--------------------------------------------------------------
function addRuby(){

//    console.log(mapOfRuby);

    var DOMTbody = document.querySelector("#subtitles_table > tbody");
    var DOMlines = DOMTbody.children;
    console.log(DOMlines);
    for (var i = 0; i < DOMlines.length; i++) {
       //<ruby>タグを追加
        DOMlines[i].children[1].innerHTML = replaceRuby(DOMlines[i].children[1].innerHTML);
    }

}

//--------------------------------------------------------------
function replaceRuby(str){

    //二重に追加されてしまうのを防止するため、文字数が多い順に追加。
    for(var i = 20;i > 0;--i){
        Object.keys(mapOfRuby).forEach(function(key){
            if(key.length == i){
                var val = this[key];
            //       if(new RegExp("<ruby>?!<\/ruby\/>*" + key + "?!<ruby>*<\/ruby>").test(val)){
                    str = str.replace(key, "<ruby>" + key + "<rt>" + val + "</rt></ruby>");
            }
        }, mapOfRuby);
    }
 
    return str;
}
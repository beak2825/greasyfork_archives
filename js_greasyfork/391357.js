// ==UserScript==
// @name         lrcDownloader[typing-tube.net]
// @namespace    TyepingTubeLrcDownloader
// @version      1.4
// @description  Typing Tubeの編集画面にlrcファイルのダウンロードリンクを追加します。
// @author       aetenotnk
// @match        https://typing-tube.net/movie/edit/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391357/lrcDownloader%5Btyping-tubenet%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/391357/lrcDownloader%5Btyping-tubenet%5D.meta.js
// ==/UserScript==

function CreateDownloadElement(){
    var editTab = $("#edit");

    if(!editTab.length){
        return false;
    }

    var downloadDiv = $("<div>");
    downloadDiv.addClass("row");
    downloadDiv.addClass("ml-2");
    downloadDiv.addClass("w-100");
    downloadDiv.attr("id", "lrcDownLoader");
    editTab.append(downloadDiv);

    var downloadLink = $("<a>");
    downloadLink.attr("id", "lrcDwonloadLink");
    downloadLink.attr("download", $("#title").attr("value") + ".lrc");
    downloadLink.attr("href", "dummy");
    downloadLink.addClass("col-2");
    downloadLink.text("lrcファイルをダウンロード");
    downloadLink.click(GetLyrics);

    downloadDiv.append(downloadLink);

    return true;
}

function SetDownloadLinkFile(text){
    var downloadLink = $("#lrcDwonloadLink");
    var file = new Blob([text], {type: "text/plain"});
    downloadLink.attr("href", URL.createObjectURL(file));
}

function GetLyrics(){
    var lyrics = $("#subtitles_table > tbody > tr");
    var lyricList = [];

    for(var i = 1; i < lyrics.length - 1; i++){
        var tds = $(lyrics[i]).find("td");
        var time = $(tds[0]).text().replace(" ", "");
        var lyric = $(tds[1]).text();

        lyricList.push({
            second: time,
            lyric: lyric
        });
    }

    SetDownloadLinkFile(FormatLRC(lyricList));
}

function FormatLRC(lyricList){
    var rowFormat = "[mm:ss.xx]lyric";
    var lines = [];

    for(var i = 0; i < lyricList.length; i++){
        var time = lyricList[i].second;
        var timeParts = time.split(".");
        var mm = ("00" + parseInt(parseInt(time) / 60)).slice(-2);
        var ss = ("00" + (parseInt(time) - mm * 60)).slice(-2);
        var xx = timeParts.length > 1 ? ("00" + timeParts[timeParts.length - 1]).slice(-2) : "00";

        lines.push(
            rowFormat
                .replace("mm", mm)
                .replace("ss", ss)
                .replace("xx", xx)
                .replace("lyric", lyricList[i].lyric));
    }

    return lines.join("\n");
}

CreateDownloadElement();

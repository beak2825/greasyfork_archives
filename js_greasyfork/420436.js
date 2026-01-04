// ==UserScript==
// @name         lrcDownloaderForNicoTy[typing-tube.net]
// @namespace    TyepingTubeLrcDownloader
// @version      1.48
// @description  Typing Tubeの編集画面にlrcファイルのダウンロードリンクを追加します。
//                         こちらから転用させていただきました(https://greasyfork.org/en/scripts/391357-lrcdownloader-typing-tube-net)
// @author       aetenotnk, nagisa
// @match        https://typing-tube.net/movie/edit/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420436/lrcDownloaderForNicoTy%5Btyping-tubenet%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/420436/lrcDownloaderForNicoTy%5Btyping-tubenet%5D.meta.js
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
        var lyric = tds[1].innerHTML

		const ruby_convert = lyric.match(/<*ruby(?: .+?)?>.*?<*\/ruby*>/g)
		if(ruby_convert){
			for(let v = 0;v<ruby_convert.length;v++){
				const start = ruby_convert[v].indexOf(">")+1
				const end = ruby_convert[v].indexOf("<rt>")
				const ruby = ruby_convert[v].slice(start,end)
				lyric = lyric.replace(ruby_convert[v],ruby)
			}
		}
//        lyric = lyric.replace(/<rt>[^<]*<\/rt>/g, "");
//        lyric = lyric.replace(/<.*>/g, "");

        lyricList.push({
            second: time,
            lyric: lyric
        });
    }

    SetDownloadLinkFile(FormatLRC(lyricList));
}

//@note
//@param time (float)
//タイムタグ文字列に変換
function GetTimeFmt(time){
    var underDot = 1.0 -(Math.ceil(time ) - time);
    if(underDot == 1.0){underDot = 0.0;}
    var naturalNum = time -underDot;

    var mmF = Math.floor(time / 60);
    var ssF = Math.floor(time - mmF * 60);
    var xxF = Math.floor((time - mmF * 60 - ssF) * 100);

    var mm = (mmF >= 10 ? (String(mmF)[0] + String(mmF)[1]) :"0" + String(mmF)[0]);
    var ss = (ssF >= 10 ? (String(ssF)[0] + String(ssF)[1]) :"0" + String(ssF)[0]);
    var xx = (xxF >= 10 ? (String(xxF)[0] + String(xxF)[1]) :"0" + String(xxF)[0]);

    var ret = "[" + mm + ":" + ss + ":" + xx + "]";
    //console.log(ret);
    return ret;
}

function FormatLRC(lyricList){
      var lines = [];

    for(var i = 0; i < lyricList.length; i++){
        //空行なら何もしない-------------------------------
        if(lyricList[i].lyric.length == 0){continue;}
        //start end の時間取得-------------------------------
        var timeS = parseFloat(lyricList[i].second);
        var timeE = parseFloat(lyricList[i + (i === lyricList.length - 1 ? 0 : 1)].second);
        //ブロックに分ける-------------------------------
        //var blocks = lyricList[i].lyric .trim().replace(/　/g," ").split(" ");
        var blocks = lyricList[i].lyric .trim().replace(/　/g," ");

        console.log(blocks);
        //頭の時間タグを挿入----------------------------
        var line = GetTimeFmt(timeS);
//         //時間タグ、ブロックを交互に挿入------------
//         for(var j = 0; j < blocks.length;++j){
//             line += blocks[j];
//             line += " ";
//             line += GetTimeFmt(timeS + (timeE - timeS) * ((j + 1) / blocks.length));
//         }
        //歌詞、お尻の時間タグを挿入
        line += blocks;
        line += GetTimeFmt(timeE);
        lines.push(line);
        //lines.push(GetTimeFmt(timeS) +lyricList[i].lyric +GetTimeFmt(timeE));
    }
    return lines.join("\n");
}

CreateDownloadElement();

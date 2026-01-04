// ==UserScript==
// @name         一键生成猫站简介
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  皇后转载到猫站，一键生成简介
// @author       benz1
// @include      *//open*/plugin_details.php*
// @include      *//pter*/upload.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/474914/%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%E7%8C%AB%E7%AB%99%E7%AE%80%E4%BB%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/474914/%E4%B8%80%E9%94%AE%E7%94%9F%E6%88%90%E7%8C%AB%E7%AB%99%E7%AE%80%E4%BB%8B.meta.js
// ==/UserScript==

function autoGenerate() {
    let ban1 = document.body.innerText.includes("禁止轉載");
    if (ban1) {
        alert("该种禁止转载");
        return;
    }
    let ban2 = document.body.innerText.includes("未經允許不得轉載");
    if (ban2) {
        let result = confirm("该种转载前需经得同意,是否继续复制?");
        if (!result) {
            return;
        }
    }

    GM_setValue("isGen", true);

    //标题
    let title = document.querySelector("div.title").textContent;
    GM_setValue("title", title.trim());

    //副标题
    let smalltitle = document.querySelector("div.smalltitle").textContent;
    GM_setValue("smalltitle", smalltitle.trim() + " | 转自OpenCD");

    //封面
    let imgscr = document.querySelector('div.cover[title="点击查看原图"] img').src;
    let text = "[img]" + imgscr + "[/img]\n\n";

    //描述
    let descr = document.getElementById("divdescr").innerHTML;
    text = text + convertHtmlToBbcode(descr).trim();

    //原地址
    text = text + "\n [quote]转自OpenCD: " + window.location.href + "[/quote]";

    //曲目列表
    let list = document.getElementById("divtracklist").innerHTML;
    text = text + "\n[quote]" + convertHtmlToBbcode(list).trim() + "[/quote]";

    text = removeLeadingSpaces(text);

    //log
    let nfo = document.querySelector('a[shower="divnfo"]');
    nfo.click();
    let nfotext = document.getElementById("divnfo").textContent;
    if (nfotext != "") {
        text =
            text +
            "[hide=log]" +
            nfotext.replace("******************** Score : 100 ********************", "") +
            "[/hide]";
    }

    //频谱图
    let spectrogram = document.querySelector('a[shower="divspectrogram"]');
    spectrogram.click();
    let spectrogramSrc = document.getElementById("divspectrogram").querySelector("img");
    if (spectrogramSrc != null) {
        text = text + "频谱图：[img]" + spectrogramSrc.src + "[/img]";
    }

    GM_setValue("text", text);
    GM_setClipboard(text);
    document.getElementById("results_lable").innerText = "已复制到剪切板,第一次打开上传页面可一键填充";
}

function setPterInfo() {
    let title = GM_getValue("title", "");
    document.getElementById("name").value = title;
    document.querySelector("input[name='small_descr']").value = GM_getValue("smalltitle", "");
    document.getElementById("descr").value = GM_getValue("text", "");
    document.getElementById("browsecat").value = 406;
    document.getElementsByName("uplver")[0].checked = true;
    if (title.includes("FLAC")) {
        document.getElementsByName("source_sel")[0].value = 8;
    }
    if (title.includes("WAV")) {
        document.getElementsByName("source_sel")[0].value = 9;
    }
    GM_deleteValue("isGen");
    GM_deleteValue("title");
    GM_deleteValue("smalltitle");
    GM_deleteValue("text");
}

//HTML转BBCODE
function convertHtmlToBbcode(html) {
    // 替换<fieldset>标签为[quote]
    html = html.replace(/<fieldset\b[^>]*>/gi, "[quote]");
    html = html.replace(/<\/fieldset>/gi, "[/quote]");

    // 替换<b>标签为[b]
    html = html.replace(/<b\b[^>]*>(.*?)<\/b>/gi, "[b]$1[/b]");

    // 删除原引用中的无用标签
    html = html.replace(/<legend\b[^>]*>(.*?)<\/legend>/gi, "");

    // 移除其他HTML标签，只保留文本内容
    let tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    let text = tempDiv.textContent || tempDiv.innerText;
    return text;
}

//去掉每一行前面的空格
function removeLeadingSpaces(text) {
    var lines = text.split("\n");
    var result = "";

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var trimmedLine = line.trim();

        result += trimmedLine + "\n";
    }
    return result;
}

if (window.location.href.startsWith("https://open")) {
    let genButton = document.createElement("button");
    genButton.id = "gen";
    genButton.textContent = "生成猫站简介";
    genButton.setAttribute("onclick", "autoGenerate()");
    document.querySelector('a[title="音樂盒"]').after(genButton);

    let results_lable = document.createElement("lable");
    results_lable.id = "results_lable";
    results_lable.setAttribute("style", "color: green;");
    genButton.after(results_lable);
}

if (window.location.href.startsWith("https://pter")) {
    if (GM_getValue("isGen", false)) {
        let setButton = document.createElement("button");
        setButton.id = "setInfo";
        setButton.textContent = "一键填充";
        setButton.type = "button";
        setButton.setAttribute("onclick", "setPterInfo()");
        document.querySelector('input[type="submit"][name="uploadrefer"]').after(setButton);
    }
}

unsafeWindow.autoGenerate = autoGenerate;
unsafeWindow.setPterInfo = setPterInfo;

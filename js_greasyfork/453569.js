// ==UserScript==
// @name        weblio_add_export2
// @namespace   http://catherine.v0cyc1pp.com/weblio_add_export2.user.js
// @match       https://uwl.weblio.jp/word-list
// @run-at      document-start
// @version     2.0
// @author      greg10
// @license     GPL 3.0
// @grant       none
// @description Weblioの単語帳にエクスポートを追加し、単語リストだけでなく、意味、発音などをCSV形式でダウンロードできるようにする。
// @downloadURL https://update.greasyfork.org/scripts/453569/weblio_add_export2.user.js
// @updateURL https://update.greasyfork.org/scripts/453569/weblio_add_export2.meta.js
// ==/UserScript==

// [Details]
// 「単語帳のインポート」メニューの下に「単語帳のエクスポート」メニューが追加されます。
// クリックするとダウンロードフォルダにcsvファイルがエクスポートされます。
// 単語、発音、品詞、意味、例文、レベルなどが保存されます。


//console.log("weblio_add_export start");
function getImportElement() {
    var ret = null;
    //$("li").each( function() {
    document.querySelectorAll("li").forEach(function(elem) {
        //var str = $(this).text();
        var str = elem.innerText;
        if (str.indexOf("単語帳のインポート") != -1) {
            //ret = $(this);
            ret = elem;
        }
    });
    return ret;
}

function exportlist() {
    //alert("export() clicked!");

    var alldata = '';
    //$("tr.tngMainTrOn").each( function() {
    document.querySelectorAll("tr.tngMainTrOn").forEach(function(elem) {
        //var kids = $(this).children("td");
        var kids = elem.children; // tdのリスト
        var line = "";
        var table = null;
        var tbody = null;

        console.log("kids.length=" + kids.length);
        for (var i = 0; i < kids.length; i++) {
            var kid = kids[i]; // ひとつのtd
            var str = "";
            if (i == 0) {
                //str = $(kid).children("div").children("a").text();
                str = kid.children[0].children[1].innerText;
                console.log("str=" + str);
            } else if (i == 3) {
                //str = $(kid).find("tbody > tr > td > div.tngMainTIML").text();
                //str = document.querySelector("tbody > tr > td > div.tngMainTIML").innerText;
                table = kid.children[0].children[0];
                tbody = table.children[0];
                str = tbody.children[0].children[0].children[0].innerText;
            } else if (i == 4) {
                //str = $(kid).find("tbody > tr > td > div.tngMainTSRHB > p.tngMainTSRH").text();
                //str = document.querySelector("tbody > tr > td > div.tngMainTSRHB > p.tngMainTSRH").innerText;
                table = kid.children[0].children[0];
                tbody = table.children[0];
                str = tbody.children[0].children[0].children[0].innerText;
            } else {
                //str = $(kid).text();
                str = kid.innerText;
            }

            if (line.length != 0) {
                line = line + ',';
            }
            line = line + "\"" + str + "\"";
        }
        alldata = alldata + line + '\n';
    });


    var a = document.createElement('a');
    a.href = 'data:application/csv;charset=utf-8,' + encodeURIComponent(alldata);

    // 単語帳の名前を取得する
    //var listname = $("td.selectFolderName").children("span").text();
    //var listname = $("td.selectFolderName > div > div").children("span").text();
    var listname = document.querySelector("td.selectFolderName > div > div").children[0].innerText;
    if (listname == null || listname == undefined || listname == "") {
        listname = "単語帳";
    }
    var filename = listname + ".csv";

    //supported by chrome 14+ and firefox 20+
    a.download = filename;
    //needed for firefox
    document.getElementsByTagName('body')[0].appendChild(a);
    //supported by chrome 20+ and firefox 5+
    a.click();
}


function main() {

    var imp = getImportElement();
    //$(imp).after('<li class="sideCat" onclick="exportlist();"><span>単語帳のエクスポート</span></li>');

    if (imp == null) {
        return;
    }
    //if ( $(imp).attr('mydone') == "done" ) {
    if (imp.getAttribute('mydone') == "done") {
        return;
    }
    //$(imp).attr("mydone","done");
    imp.setAttribute("mydone", "done");
    //var lielem = $("<li class=\"\"/>");
    var lielem = document.createElement("li");
    lielem.className = "";

    /*
    $(lielem).append( $("<a/>", {
    	text: "単語帳のエクスポート",
    	click: function() {
    		exportlist();
    	}
    }));
    */
    var taga = document.createElement("a");
    taga.innerText = "単語帳のエクスポート";
    taga.onclick = function() {
        exportlist();
    };
    lielem.appendChild(taga);

    //$(imp).after(lielem);
    imp.parentNode.insertBefore(lielem, imp.nextElementSibling);
}


var observer = new MutationObserver(function(mutations) {
    observer.disconnect();
    main();
    observer.observe(document, config);
});

var config = {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: true
};

observer.observe(document, config);
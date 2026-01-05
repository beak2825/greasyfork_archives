// ==UserScript==
// @name         MIB search ob
// @namespace    zhyan@juniper.net
// @include      http://contentapps.juniper.net/mib-explorer/search.jsp
// @version      0.5
// @require      https://openuserjs.org/src/libs/vlan1/Sheetjs.js
// @require      https://openuserjs.org/src/libs/vlan1/excelplus.js
// @description  try to take over the world!
// @author       You
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14404/MIB%20search%20ob.user.js
// @updateURL https://update.greasyfork.org/scripts/14404/MIB%20search%20ob.meta.js
// ==/UserScript==

function save() {
    fl = $('#texta').val().split(/[,\n]+/);
    if (fl[0] == "") {
        alert("Please input at least 1 feature!");
        return
    }
    product = $('#prodFilterBox').find('.prodSel').html();
    release = $('#relFilterBox').find('.prodSel').html();
    var files = new ExcelPlus();
    for (i = 0; i < fl.length; i++) fl[i] = $.trim(fl[i]);
    files.createFile(fl);
    bun = $('#FPT')[0];

    function f1(t) {
        if (t < fl.length) {
            f2(t)
        } else {
            console.log('All Complete!!!!!!!!!');
            bun.value = "RUN";
            files.saveAs("demo.xlsx")
        }
    }

    function f2(t) {
        srchTxt = fl[t];
        bun.value = "Processing " + srchTxt;
        $.getJSON("getAutoCompleteDetails.html", {
            q: srchTxt,
            product: product,
            release: release,
            withDesc: true
        }, function(srchResults, status) {
            if (status == 'success') {
                if (srchResults.length > 0) {
                    console.log('length for\t' + srchTxt + ' : ' + srchResults.length);
                    files.selectSheet(srchTxt);
                    files.write({
                        "content": [
                            ["Name", "Description"]
                        ]
                    });
                    for (y = 0; y < srchResults.length; y++) {
                        files.write({
                            cell: "A" + (2 + y),
                            content: srchResults[y].name
                        }).write({
                            cell: "B" + (2 + y),
                            content: srchResults[y].desc
                        })
                    }
                    t++;
                    f1(t)
                } else {
                    t++;
                    console.log('No results for ' + srchTxt);
                    files.deleteSheet(srchTxt);
                    f1(t)
                }
            } else {
                t++;
                console.log('error happens for ' + srchTxt);
                files.deleteSheet(srchTxt);
                f1(t)
            }
        })
    }
    f1(0)
}
$(window).load(function() {
    var input1 = document.createElement('textarea');
    input1.name = 'post';
    input1.maxLength = '5000';
    input1.cols = '70';
    input1.rows = '1';
    input1.style.fontFamily = 'Verdana';
    input1.id = "texta";
    input1.placeholder = 'Please input Comma-separated feature list (e.g. "ospf, bgp, vpn")';
    var bun_RtA = document.createElement("input");
    bun_RtA.type = "button";
    bun_RtA.value = "RUN";
    bun_RtA.name = 'Test';
    bun_RtA.id = "FPT";
    bun_RtA.onclick = save;
    srt = $('#spfcTxt');
    srt.after(bun_RtA);
    srt.after(input1)
});


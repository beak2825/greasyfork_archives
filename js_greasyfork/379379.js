// ==UserScript==
// @name         檢舉後台待處理部分直接顯示檢舉人
// @namespace    http://tampermonkey.net/
// @description  可以直接看到每個檢舉的檢舉人
// @namespace    AdminPageViewAUser - cat412
// @version      0.46
// @author       cat412
// @match        https://forum.gamer.com.tw/gemadmin/accuse*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/379379/%E6%AA%A2%E8%88%89%E5%BE%8C%E5%8F%B0%E5%BE%85%E8%99%95%E7%90%86%E9%83%A8%E5%88%86%E7%9B%B4%E6%8E%A5%E9%A1%AF%E7%A4%BA%E6%AA%A2%E8%88%89%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/379379/%E6%AA%A2%E8%88%89%E5%BE%8C%E5%8F%B0%E5%BE%85%E8%99%95%E7%90%86%E9%83%A8%E5%88%86%E7%9B%B4%E6%8E%A5%E9%A1%AF%E7%A4%BA%E6%AA%A2%E8%88%89%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
    $(document).on("click", ".main_btn", function(){ CheckDOMChange(); });
    $(document).on("click", "#right_btn input", function(){
        var btnValue = $(this).val();
        switch(btnValue)
        {
            case "已結案區":
            case "待處理案":
                ClickBtnFrnction();
            break;
        }
    });

    CheckDOMChange();

    // 巴哈原生 method
    // GetReason("16303_232001_2244208");
})();

function ClickBtnFrnction()
{
    // 不清空切換頁面會壞掉
    $("#main_work").html("");
    CheckDOMChange();
}

function CheckDOMChange()
{
    console.log("OAO");
    if ($("#listTable").length > 0)
    {
        console.log("Load Done!");
        DoMainFunction();
        return false;
    }

    setTimeout( CheckDOMChange, 100 );
}

function DoMainFunction()
{
    // 如果覺得檢舉後台很窄，可以自己放寬
    // $("div#wrapper").css("width", "70%");
    // $("#main_work").css("width", "80%");
    // $("#listTable").css("width", "100%");

    // 有的沒的預設值
    var btitle = '';
    var t = location.search.substring(location.search.indexOf("t=") + 2, location.search.indexOf("t=") + 3);
    var s = location.search.substring(location.search.indexOf("s=") + 2, location.search.indexOf("s=") + 3);

    if (s != 1)
    {
        console.log("暫時只有待處理");
        return false;
    }

    var dontNeedThis = "javascript:GetReason('";
    var row = 0;
    var headIndex = 0

    var trNode =  $("#listTable").children("tbody").children("tr");

    trNode.each(function(){
        if (row == 0)
        {
            var tdHeadNode = trNode.eq(row).children("td");
            tdHeadNode.each(function(){
                if ($(this).text() == "檢舉數")
                {
                    return false;
                }
                headIndex++;
            });
        }
        else
        {
            var tdNode = trNode.eq(row).children("td");
            var hrefOfA = tdNode.eq(headIndex).children("a").attr("href");
            var rowId = hrefOfA.substring(dontNeedThis.length, hrefOfA.length - 3);

            if (rowId.indexOf("#") > 0)
            {
                rowId = rowId.substring(0, rowId.indexOf("#"));
            }

            egg.ajax({
                url: '/ajax/BMaccuse_reason_2k14.php',
                success: function(jsondoc){
                    if (jsondoc == null ||
                        jsondoc == "" ||
                        jsondoc.indexOf("系統忙碌中") > 0 ||
                        jsondoc.indexOf("error") > 0)
                    {
                        console.log("抓資料失敗了");
                        //location.reload();
                        return 0;
                    }

                    var data = JSON.parse(jsondoc);
                    var content = '';
                    if (data['error']) {
                        showMsg(data['error']);
                        return;
                    }

                    var tdLast = tdNode.last();
                    tdLast.html("");

                    var htmlString = "";

                    var reason = data['data'];
                    for (var key in reason) {
                        // 含時間的顯示
                        // htmlString += reason[key]['adate'] + ", " + reason[key]['auserid'] + ": " + reason[key]['reason'] + "</br>";
                        // 因為字太長所以拔掉時間的顯示
                        htmlString += reason[key]['auserid'] + ": " + reason[key]['reason'] + "</br>";
                    }

                    tdLast.css("text-align", "left");
                    tdLast.html(htmlString);
                },
                param: 'id=' + rowId + '&t=' + t + '&s=' + s,
                method: 'POST'
            });
        }

        row++;
    });
}
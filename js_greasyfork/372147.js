// ==UserScript==
// @name         SteamCN Point Confirmation Tool
// @namespace    TypeNANA
// @version      0.1
// @description  统计指定楼层中用户加蒸汽的情况
// @author       TypeNANA
// @match        https://steamcn.com/*
// @downloadURL https://update.greasyfork.org/scripts/372147/SteamCN%20Point%20Confirmation%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/372147/SteamCN%20Point%20Confirmation%20Tool.meta.js
// ==/UserScript==

(function () {
    function SetPage() {
        document.getElementById("nav-user-action-bar").getElementsByClassName("list-inline")[0].innerHTML = '<li> <a id="mShowAlert" class="btn btn-user-action"> 加体力统计 </a> </li><li id="hiddenDiv" style="width:0;height:0"/>' + document.getElementById("nav-user-action-bar").getElementsByClassName("list-inline")[0].innerHTML;
        var script = '<script>var urlList=[];var urlIdList=[];var scoreList={};function startGetData(){urlList=[];urlIdList=[];scoreList={};var txt=document.getElementById("text").value;dealUrls(txt)}function dealUrls(urls){urls=urls.replace(/\r\n/g,"").replace(/\n/g,"");var reg=new RegExp(/https:\/\/[^:]+\d/g);var result;while((result=reg.exec(urls))!=null){urlList.push(result[0])}dealUrlList(urlList,0)}function dealUrlList(list,index){document.getElementById("progressTxt").innerHTML="获取帖子信息中 "+(index+1)+"/"+list.length;if(index>=list.length){webRequest(urlIdList,0);return}var reg=new RegExp(/tid=(\d+)&pid=(\d+)/g);var result;if((result=reg.exec(list[index]))!=null){urlIdList.push([result[1],result[2]]);dealUrlList(list,index+1)}else{webRequestSpecial(list,index)}}function webRequest(list,index){document.getElementById("progressTxt").innerHTML="获取体力数据中 "+(index+1)+"/"+list.length;if(index>=list.length){document.getElementById("progressTxt").innerHTML="体力数据抓取完成";setTable(scoreList);return}jQuery.post("https://steamcn.com/forum.php",{mod:"misc",action:"viewratings",inajax:1,tid:list[index][0],pid:list[index][1],}).done(function(res){var txt=res.all[0].innerHTML;var reg=new RegExp(/体力.+?\+(\d+?)[\s\S]+?suid-.+?">(.+?)<\/a/g);var result;while((result=reg.exec(txt))!=null){if(scoreList[result[2]]==null){scoreList[result[2]]=0}scoreList[result[2]]+=result[1]/1}webRequest(urlIdList,index+1)})}function webRequestSpecial(list,index){jQuery.post(list[index],{inajax:1}).done(function(res){var txt=res.all[0].innerHTML;var mList=[];var reg2=new RegExp(/t\d+/g);mList.push(reg2.exec(list[index])[0].replace("t",""));var reg=new RegExp(/post_\d+/g);mList.push(reg.exec(txt)[0].replace("post_",""));urlIdList.push(mList);dealUrlList(list,index+1)})}function setTable(list){var tbody=document.getElementById("container");tbody.innerHTML="";var newlist=sortList(list);for(var i in newlist){tbody.innerHTML+="<tr><td>"+newlist[i][0]+"</td><td>"+newlist[i][1]+"</td></tr>"}}function sortList(list){var tmpList=JSON.parse(JSON.stringify(list));var newList=[];var oriCount=0;for(var i in tmpList){oriCount++}while(newList.length<=oriCount){var max="";for(var i in tmpList){if(max==""){max=i}if(tmpList[i]>tmpList[max]){max=i}}newList.push([max,tmpList[max]]);delete tmpList[max]}console.log(newList);return newList};</script>';
        document.getElementById("mShowAlert").onclick = function () {
            showDialog(script + '<br><textarea id="text" placeholder="在这里粘贴楼层链接，推荐以每个链接一行的格式录入" style="margin: 0px 10px 5px;resize: vertical;height: 132px;width: 600px;border: 1px solid rgb(238, 238, 238);border-radius: 5px;"></textarea><div style="height: 28px;"><span style="padding-left:10px;color:red;font-weight:bold" id="progressTxt"></span><button id="steamsubmitbtn" onclick="document.getElementById(\'hiddenDiv\').onclick()" value="true" class="pn pnc" style="float:right;margin-right:10px;margin-bottom:10px;"><strong>开始统计</strong></button></div><style>#container tr:nth-child(2n+1){background-color: #ffffff;}.tbtitle th{background:#57BAE8;color:white;}</style><div style="width:100%;max-height:300px;overflow:scroll;overflow-x:hidden"><table class="dt mtm" style="margin: 0 10px 10px 10px;width: calc(100% - 20px);"><tbody class="tbtitle"><tr><th style="width:  60%;">用户名</th><th style="width:  20%;">总计体力</th></tr></tbody><tbody id="container"><tr><td>-</td><td>-</td></tr></tbody></table></div>', 'info', '加体力统计', null, 1);
        }
        document.getElementById("hiddenDiv").onclick = function () {

            var urlList = [];
            var urlIdList = [];
            var scoreList = {};
            function startGetData() {
                urlList = [];
                urlIdList = [];
                scoreList = {};
                var txt = document.getElementById("text").value;
                dealUrls(txt);
            }

            function dealUrls(urls) {
                urls = urls.replace(/\r\n/g, "").replace(/\n/g, "");
                var reg = new RegExp(/https:\/\/[^:]+\d/g);
                var result;
                while ((result = reg.exec(urls)) != null) {
                    urlList.push(result[0]);
                }
                dealUrlList(urlList, 0);
            }

            function dealUrlList(list, index) {
                document.getElementById("progressTxt").innerHTML = "获取帖子信息中 " + (index + 1) + "/" + list.length;
                if (index >= list.length) {
                    webRequest(urlIdList, 0);
                    return;
                }
                var reg = new RegExp(/tid=(\d+)&pid=(\d+)/g);
                var result;
                if ((result = reg.exec(list[index])) != null) {
                    urlIdList.push([result[1], result[2]]);
                    dealUrlList(list, index + 1);
                } else {
                    webRequestSpecial(list, index);
                }

            }

            function webRequest(list, index) {
                document.getElementById("progressTxt").innerHTML = "获取体力数据中 " + (index + 1) + "/" + list.length;
                if (index >= list.length) {
                    document.getElementById("progressTxt").innerHTML = "体力数据抓取完成";
                    setTable(scoreList);
                    return;
                }
                jQuery.post('https://steamcn.com/forum.php', {
                    mod: "misc",
                    action: "viewratings",
                    inajax: 1,
                    tid: list[index][0],
                    pid: list[index][1],
                }).done(function (res) {
                    var txt = res.all[0].innerHTML;
                    var reg = new RegExp(/体力.+?\+(\d+?)[\s\S]+?suid-.+?">(.+?)<\/a/g);
                    var result;
                    while ((result = reg.exec(txt)) != null) {
                        if (scoreList[result[2]] == null) scoreList[result[2]] = 0;
                        scoreList[result[2]] += result[1] / 1;
                    }
                    webRequest(urlIdList, index + 1);
                });
            }
            function webRequestSpecial(list, index) {
                jQuery.post(list[index], {
                    inajax: 1
                }).done(function (res) {
                    var txt = res.all[0].innerHTML;;
                    var mList = [];
                    var reg2 = new RegExp(/t\d+/g);
                    mList.push(reg2.exec(list[index])[0].replace("t", ""));
                    var reg = new RegExp(/post_\d+/g);
                    mList.push(reg.exec(txt)[0].replace("post_", ""));
                    urlIdList.push(mList);
                    dealUrlList(list, index + 1);
                });
            }
            function setTable(list) {
                var tbody = document.getElementById("container");
                tbody.innerHTML = "";

                var newlist = sortList(list);
                for (var i in newlist) {
                    if (newlist[i][1] == undefined) continue;
                    tbody.innerHTML += "<tr><td>" + newlist[i][0] + "</td><td>" + newlist[i][1] + "</td></tr>";
                }
            }
            function sortList(list) {
                var tmpList = JSON.parse(JSON.stringify(list));
                var newList = [];
                var oriCount = 0
                for (var i in tmpList) {
                    oriCount++;
                }
                while (newList.length <= oriCount) {
                    var max = ""
                    for (var i in tmpList) {
                        if (max == "") {
                            max = i;
                        }
                        if (tmpList[i] > tmpList[max]) {
                            max = i;
                        }
                    }
                    newList.push([max, tmpList[max]]);
                    delete tmpList[max];
                }
                console.log(newList);
                return newList;
            }
            startGetData();
        }
    }
    SetPage();
})();
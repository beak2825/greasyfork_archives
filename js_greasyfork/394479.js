// ==UserScript==
// @name           一键净化反黑
// @include        https://m.weibo.cn/detail/*
// @include        https://m.weibo.cn/status/*
// @include        https://service.account.weibo.com/reports*
// @author         June
// @copyright      2019 @ BA Tec Group;
// @license        GNU GPL v3.0 or later. http://www.gnu.org/copyleft/gpl.html
// @require        https://code.jquery.com/jquery-latest.js
// @grant          GM_xmlhttpRequest
// @grant          GM_openInTab
// @grant          window.close
// @namespace      https://greasyfork.org/zh-CN/users/430493
// @description    Auto open and close the links in new tab, and redo the process continously

// @version        1.0.4
// @description    Auto open and close the links in new tab, and redo the process continously
// @description    Updated on Jan. 2020
// @description    Updated: stable control on sleep time
// @description    accurate information on screen
// @description    disable focus on the new tab
// @downloadURL https://update.greasyfork.org/scripts/394479/%E4%B8%80%E9%94%AE%E5%87%80%E5%8C%96%E5%8F%8D%E9%BB%91.user.js
// @updateURL https://update.greasyfork.org/scripts/394479/%E4%B8%80%E9%94%AE%E5%87%80%E5%8C%96%E5%8F%8D%E9%BB%91.meta.js
// ==/UserScript==

// initialize report parameters
var success_num = 0;
var typeNum = 11;

//size for each type
var class_array = new Array();
for(var ti = 0; ti < typeNum; ti++){
    class_array[ti] = 0;
}

var typeKeyWord_array = new Array();
typeKeyWord_array[0]="违法-违禁";
typeKeyWord_array[1]="垃圾-其他";
typeKeyWord_array[2]="垃圾-昵称";
typeKeyWord_array[3]="有害-其他有害信息";
typeKeyWord_array[4]="涉黄-低俗";
typeKeyWord_array[5]="违法-毒品";
typeKeyWord_array[6]="诈骗-不在以上";
typeKeyWord_array[7]="不实-不在以上";
typeKeyWord_array[8]="有害-暴恐";
typeKeyWord_array[9]="垃圾-头像";
typeKeyWord_array[10]="涉黄-头像昵称违规";


var all = new Array();
for(var ti0 = 0; ti0 < typeNum; ti0++){
    all[ti0] = new Array();
}


//to store sub info
var all_info = new Array();
for(var tii = 0; tii < typeNum; tii++){
    all_info[tii] = new Array();
}


var illegalO_array = new Array();
var litterO_array = new Array();
var litterN_array = new Array();
var badO_array = new Array();
var sexL_array = new Array();
var illegalD_array = new Array();
var liarO_array = new Array();

var illegalOther_n = 0;
var litterOther_n = 0;
var litterName_n = 0
var badOther_n = 0
var sexLow_n = 0;
var illegalDrag_n = 0;
var liarOther_n = 0;
var norealOther_n = 0;
//var class_array[7] = 0;

var classDur = 20000;

//for report page
var c1 = "";
var c2 = "";

var class1 = ""
var class2 = ""

//========== for autoclean=============
// initialize
var effective_links_num = 0;
var real_links_num = 0;
var process_time = 1; //循环次数
var link_arry=new Array(); //arry to store links

var delayOne = 10000; // delay duration for opening one tab (longer if loading more than one tab)
var delayDur = 10500; //delay duration for opening tabs once(maybe one tab, maybe multi tabs)
//delayOne = 20000; for multiple tabs
//delayOne = 10000; for single tab(default)
//delayDur = 20500 for open multiple tabs
//delayDur = delayOne + 0.5s = 10500 for open single tab(default)
var delayLoop = 230000//230000; // delay for one loop, 5 tabs
//var delayLoop = 370000; // delay for one loop, 1 tab

var t1 = 0;
var t2 = 0;

var is_multi = false;
var multi_tab_num = 1;

var process_i = 0;

//=============================
var callback = function(){
 // 在 DOM 完全加载完后执行
    console.log(document.readyState);
    main();
};
/*
//if(document.readyState === "complete" ||(document.readyState !== "loading")){
if(document.readyState === "complete"){
    callback();
}
//else if(document.readyState === interactive)
else{
    //document.addEventListener("DOMContentLoaded", callback,false);
    window.addEventListener('load', callback, false);
}

var eventHandler = function (event) {
    console.log(event.type);
    console.log(event.timeStamp);
    console.log(document.readyState);
    console.log('\n');
}
//当document文档正在加载时,返回"loading"。
//当文档结束渲染但在加载内嵌资源时，返回"interactive"，并引发DOMContentLoaded事件。
//当文档加载完成时,返回"complete"，并引发load事件。
//document.addEventListener('readystatechange', callback,false);
//document.addEventListener('DOMContentLoaded', eventHandler, false);
//window.addEventListener('load', eventHandler, false);
*/
if(document.readyState === "complete"){
    main();
}
else{
    document.addEventListener('readystatechange', callback,false);
    //window.addEventListener('load', callback, false);
}
//$(document).ready(function(){
function main(){
    console.log(document.readyState);
    //for main page
    if(document.location.href.indexOf("https://m.weibo.cn") != -1){
        //check if report
        if (document.getElementsByClassName("weibo-text")[0].innerText.indexOf("举报") != -1){
            //alert("举报")
            addButton();
            return;
        }
        //for auto clean
        //check if clean
        else if (document.getElementsByClassName("weibo-text")[0].innerText.indexOf("净化") != -1){
            //alert("净化")
            addCleanButton();
            //return;
            }
        else{
            alert("未识别为举报或净化播，请检查");
            return;
        }
    }
    //for report page
    else if(document.location.href.indexOf("https://service.account.weibo.com/reportspamobile") != -1){
        //alert("report");
        pageProcess();
        return;
    }
     else{//should not here
        alert("unknown reason");
    }
}

//================= complain ===============

//start function for weibo complain
function startWeibo(){
    //check if from @CareRoy_王源反黑组
    //@朝阳区热心民众
    var author = document.getElementsByClassName("weibo-top m-box")[0].getElementsByClassName("m-text-box")[0].children[0].innerText;
    if (author.indexOf("CareRoy_王源反黑组") == -1 && author.indexOf("启动自动反黑") == -1){
        alert("Error: 非@CareRoy_王源反黑组 @启动自动反黑 所发，不支持")
        return;
    }

    readMainPage();

    setTimeout(function(){
        //alert("开始举报");
        addDivItemInfo();
        mainProcess(0);
    },500);
    return;
}

//action on sumbitting page
function pageProcess(){
    //alert("test");
    //get types
    if (location.href.indexOf("arg") == -1){//criterion
        //alert("cannot read report type");
        //success_num -= 1;
        return;
    }
    var class1 = decodeURI(location.href.split("?")[2]).split("=")[1];
    var class2 = decodeURI(location.href.split("?")[3]).split("=")[1];
    //some need more info
    var info = "";
    if(decodeURI(location.href.split("?")[4]).split("=")[1]!= ""){
        info = decodeURI(location.href.split("?")[4]).split("=")[1];
    }
    //reload
    var oURL = location.href.split("?arg")[0];
    //location.href = oURL;

    //$(document).ready(function(){
    //not exited
    if (document.getElementsByClassName("complaint_con")[0].children[1].getElementsByTagName("a")[0].text == "@"){
        alert("已消失")
        window.close();
        //success_num -= 1;
        return;
    }
        //1st step
    var class1_all = document.getElementsByClassName("complaint_con")[0].children[2].getElementsByTagName("li");
        //bad links
        if(class1_all.length == 0){
            alert("网址不对");
            window.close();
            //success_num -= 1;
        return;
    }
    var rID1 = getReportID(class1_all,class1,1);

        if (rID1 == -1){
            alert("Fail to find the type: " + class1);
            //success_num -= 1;
            return;
        }
        else{
            setTimeout(function(){
            document.getElementsByClassName("complaint_con")[0].children[2].getElementsByTagName("li")[rID1].click();
            },200);
        }
        //2nd step
    setTimeout(function(){
        //alert("+++")
        var class2_all = document.getElementsByClassName("complaint_con")[0].children[3].children[1].getElementsByTagName("li");
        var rID2 = getReportID(class2_all,class2,2);
        if (rID2 == -1){
            alert("Fail to find the type: "+class2);
            //success_num -= 1
            return;
        }
        else{
            document.getElementsByClassName("complaint_con")[0].children[3].children[1].getElementsByTagName("li")[rID2].click();
        }
    },500);
        //for those need more information
        if(info.length > 0){
            setTimeout(function(){
                document.getElementsByClassName("M-input M-input-text")[0].value=info;
            },900);
        }
        //3rd step
        setTimeout(function(){
            console.log("===")
            //document.getElementsByClassName('m-checkbox')[2].children[0].click();
            document.getElementsByClassName('m-checkbox')[2].getElementsByClassName("inp_chk")[0].click();
        },1100);
        //4th step

        setTimeout(function(){
            document.getElementsByClassName("m-btn m-btn-block m-btn-orange")[0].click(); //submit
        },2000);
    setTimeout(function(){
            //document.getElementsByClassName("m-btn m-btn-block m-btn-orange")[0].click(); //submit
            var check_1 = document.getElementsByClassName("complaint_txt")[0].getElementsByTagName("dt")[0].children[0];
            //sometimes, fail to sumbit
            if(check_1.className != "m-btn m-btn-block m-btn-orange m-btn-disabled"|| check_1.textContent.indexOf("已投诉，受理中") == -1){
                alert("提交失败，请检查或联系BA");
            }
        },3000);

}

//get ID number by tag read frome weibo
//type: 1 --- 1st class; 2 --- 2nd class
function getReportID(li,targetName,type){
    var tagID=-1;
    var li_i=0;
    if(type == 1){
        for(li_i=0;li_i<li.length;li_i++){
            if (li[li_i].title.indexOf(targetName) != -1){
                tagID = li_i;
               break;
            }
        }
    }
    else if(type == 2){
        for(li_i=0;li_i<li.length;li_i++){
            if (li[li_i].getElementsByTagName("a")[0].text.indexOf(targetName) != -1){
                tagID = li_i;
                break;
            }
        }
    }
    else{
        alert("unkown type ID");
    }
    return tagID;
}

//read weibo page for complain
function readMainPage(){
    if (document.URL.substr(0,18) == "https://m.weibo.cn"){
        //convert xml to string
        var text_all = (new XMLSerializer()).serializeToString(document.getElementsByClassName('weibo-text')[0]).split("<br />");
        var ti = 0;
        var temp_str = "";
        var temp_info = "";
        //var text_all = document.getElementsByClassName('weibo-text')[0].innerText.split("\n");
        for(var i = 0; i < text_all.length; i++){
            //alert("test " + i);
            //1: 违法-违禁
            if(text_all[i].indexOf("违法")!=-1 &&text_all[i].indexOf("违禁") != -1 && text_all[i+1]!= undefined){
                //alert(i);
                i += 1;
                ti = i;
                for(ti=i;ti< text_all.length;ti++){
                    if(text_all[i].indexOf("网页链接") != -1){
                        //work for data-url
                        temp_str = text_all[i].split('href')[1].split('"')[1].split('amp;');
                        all[0][class_array[0]] = temp_str[0] + temp_str[1] + temp_str[2];
                        //console.warn(illegalO_array[illegalOther_n]);
                        i += 1;
                        illegalOther_n += 1;
                        class_array[0] +=1;
                    }
                    else if(text_all[i].length==0){
                        //alert("==1==")
                        i +=1;
                    }
                    //next line has 小指头
                    //encodeURI(text_all[i]).indexOf("%F0%9F%91%89")//小指头
                    else if(encodeURI(text_all[i]).indexOf("%F0%9F%91%89") != -1 || text_all[i].indexOf("-") != -1){
                        //alert("==2==")
                        i -= 1;
                        break;
                    }

                    else{//unknown problem
                        //alert("==3==")
                        i += 1;
                    }
                }
            }
            //2: 垃圾-其他
            else if(text_all[i].indexOf("垃圾")!=-1 &&text_all[i].indexOf("其他")!=-1&& text_all[i+1]!=undefined){
                 i += 1;
                for(ti=i;ti< text_all.length;ti++){
                    if(text_all[i].indexOf("网页链接") != -1){
                        //alert("==00==")
                        temp_str = text_all[i].split('href')[1].split('"')[1].split('amp;');
                        all[1][class_array[1]] = temp_str[0] + temp_str[1] + temp_str[2];
                        i++;
                        litterOther_n += 1;
                        class_array[1] +=1;
                    }
                    else if(text_all[i].length==0){
                        //alert("==1==")
                        i +=1;
                    }
                    //next line has 小指头
                    else if(encodeURI(text_all[i]).indexOf("%F0%9F%91%89") != -1 || text_all[i].indexOf("-") != -1){
                        //alert("==2==")
                        i -= 1;
                        break;
                    }
                    else{//unknown problem
                        //alert("==3==")
                        i += 1;
                    }
                }
            }
            //3: 垃圾-昵称
            else if(text_all[i].indexOf("垃圾")!=-1 &&text_all[i].indexOf("昵称")!=-1&& text_all[i+1]!=undefined){
                 i += 1;
                for(ti = i;ti < text_all.length;ti++){
                    //alert("==" + i)
                    if(text_all[i].indexOf("网页链接")!=-1){
                        //check some has data-url
                        temp_str = text_all[i].split('href')[1].split('"')[1].split('amp;');
                            all[2][class_array[2]] = temp_str[0] + temp_str[1] + temp_str[2];
                        i++;
                        litterName_n += 1;
                        class_array[2] +=1;
                    }
                    else if(text_all[i].length==0){
                        //alert("==1==")
                        i +=1;
                    }
                    //next line has 小指头
                    else if(encodeURI(text_all[i]).indexOf("%F0%9F%91%89") != -1 || text_all[i].indexOf("-") != -1){
                        //alert("==2==")
                        i -= 1;
                        break;
                    }
                    else{//unknown problem
                        //alert("==3==")
                        i += 1;
                    }
                }
            }
            //4: 有害-其他
            else if(text_all[i].indexOf("有害")!=-1 &&text_all[i].indexOf("其他")!=-1&& text_all[i+1]!=undefined){
                //alert(i)
                 i += 1;
                for(ti =i; ti < text_all.length;ti++){

                    if(text_all[i].indexOf("网页链接")!=-1){
                        //check some has data-url
                        temp_str = text_all[i].split('href')[1].split('"')[1].split('amp;');
                            all[3][class_array[3]] = temp_str[0] + temp_str[1] + temp_str[2];

                        //console.warn(badO_array[badOther_n]);
                        i++;
                        badOther_n += 1;
                        class_array[3] +=1;
                    }
                    else if(text_all[i].length==0){
                        //alert("==1==")
                        i +=1;
                    }
                    //next line has 小指头 or "-"
                    else if(encodeURI(text_all[i]).indexOf("%F0%9F%91%89") != -1 || text_all[i].indexOf("-") != -1){
                        //alert("==2==")
                        i -= 1;
                        break;
                    }
                    //encodeURI(text_all[i]).indexOf("%F0%9F%91%89")//小指头
                    else{//unknown problem
                        //alert("==3==")
                        i += 1;
                    }
                }
            }
            //5: 涉黄-低俗
            else if((text_all[i].indexOf("涉黄")!=-1 || text_all[i].indexOf("涉h")!=-1) &&text_all[i].indexOf("低俗")!=-1&& text_all[i+1]!=undefined){
                 i += 1;
                //alert(i)
                for(ti =i; ti < text_all.length;ti++){
                    if(text_all[i].indexOf("网页链接")!=-1){
                        temp_str = text_all[i].split('href')[1].split('"')[1].split('amp;');
                            all[4][class_array[4]] = temp_str[0] + temp_str[1] + temp_str[2];
                        i++;
                        sexLow_n += 1;
                        class_array[4] +=1;
                    }
                    else if(text_all[i].length==0){
                        //alert("==1==")
                        i +=1;
                    }
                    //next line has 小指头 or "-"
                    else if(encodeURI(text_all[i]).indexOf("%F0%9F%91%89") != -1 || text_all[i].indexOf("-") != -1){
                        //alert("==2==")
                        i -= 1;
                        break;
                    }
                    else{//unknown problem
                        //alert("==3==")
                        i += 1;
                    }
                }
            }
            //6: 违法-毒品
            else if(text_all[i].indexOf("违法")!=-1 &&text_all[i].indexOf("dp")!=-1 && text_all[i+1]!=undefined){
                //alert(i)
                 i += 1;
                for(ti=i;ti < text_all.length;ti++){
                    if(text_all[i].indexOf("网页链接")!=-1){
                        temp_str = text_all[i].split('href')[1].split('"')[1].split('amp;');
                        all[5][class_array[5]] = temp_str[0] + temp_str[1] + temp_str[2];
                        i++;
                        illegalDrag_n += 1;
                        class_array[5] +=1;
                    }
                    else if(text_all[i].length==0){
                        //alert("==1==")
                        i +=1;
                    }
                    //next line has 小指头
                    else if(encodeURI(text_all[i]).indexOf("%F0%9F%91%89") != -1 || text_all[i].indexOf("-") != -1){
                        //alert("==2==")
                        i -= 1;
                        break;
                    }
                    else{//unknown problem
                        //alert("==3==")
                        i += 1;
                    }
                }
            }
            //7: 诈骗-不在以上
            //this type need more info
            else if(text_all[i].indexOf("z骗")!=-1 &&text_all[i].indexOf("不在以上")!=-1 && text_all[i+1]!=undefined){
                //alert(i)
                i += 1;
                temp_info = "";
                //if info at begin
                if((text_all[i].indexOf("网页链接") == -1) && text_all[i].length>0){
                    temp_info = text_all[i];
                    //alert("+++1+++")
                    i+=1;
                   }
                for(ti=i; ti < text_all.length; ti++){
                    if(text_all[i].indexOf("网页链接")!=-1){
                        temp_str = text_all[i].split('href')[1].split('"')[1].split('amp;');
                        all[6][class_array[6]] = temp_str[0] + temp_str[1] + temp_str[2];
                        i++;
                        liarOther_n += 1;
                        class_array[6] +=1;
                    }
                    else if(text_all[i].length==0){
                        //alert("==1==")
                        i +=1;
                    }
                    //next line has 小指头 or "-"
                    else if(encodeURI(text_all[i]).indexOf("%F0%9F%91%89") != -1 || text_all[i].indexOf("-") != -1){
                        //alert("==2==")
                        i -= 1;
                        break;
                    }
                    else{//unknown problem
                        //alert("==3==")
                        all_info[6][class_array[6]-1] = text_all[i];
                        //alert(i+ " " +text_all[i])
                        i += 1;
                    }
                }
                //alert("temp_info: " +temp_info)
                //alert(i)
                //maybe the info at end
                if(temp_info==""&&text_all[i-1].indexOf("网页链接") == -1 && text_all[i-1].length>0){
                    //alert("===1===")
                    //last line
                    temp_info = text_all[i-1];
                    //alert(temp_info);

                }
                    for(var liar_i =0 ;liar_i<class_array[6];liar_i++){
                        //alert(all_info[6][liar_i])
                        if (all_info[6][liar_i]=="" || all_info[6][liar_i] == undefined){
                        all_info[6][liar_i] = temp_info;}
                    }

            }
            //8: 不实-不在以上
            //this type need more info
            else if(text_all[i].indexOf("不实")!=-1 &&text_all[i].indexOf("不在以上")!=-1&& text_all[i+1]!=undefined){
                //alert(i);
                i += 1;
                //ti = i;
                temp_info = "";
                //if info at begin
                if((text_all[i].indexOf("网页链接") == -1) && text_all[i].length>0){
                    temp_info = text_all[i];
                    i+=1;
                   }
                for(ti=i;ti< text_all.length;ti++){
                    //alert(text_all[i])
                    if(text_all[i].indexOf("网页链接") != -1){
                        //alert("==00==")
                        temp_str = text_all[i].split('href')[1].split('"')[1].split('amp;');
                        all[7][class_array[7]] = temp_str[0] + temp_str[1] + temp_str[2];
                        i++;
                        norealOther_n += 1;
                        class_array[7] +=1;
                    }
                    else if(text_all[i].length==0){
                        //alert("==1==")
                        i +=1;
                    }
                    //next line has 小指头 "-"
                    else if(encodeURI(text_all[i]).indexOf("%F0%9F%91%89") != -1 || text_all[i].indexOf("-") != -1){
                        //alert("==2==")
                        i -= 1;
                        break;
                    }
                    else{//unknown problem////should be info for last one
                        //alert("==3==")
                        all_info[7][class_array[7]-1] = text_all[i];
                        i += 1;
                    }
                }
                //maybe the info at end
                if(temp_info==""&&text_all[i-1].indexOf("网页链接") == -1 && text_all[i-1].length>0){
                    //alert("===1===")
                    //last line
                    temp_info = text_all[i-1];
                }
                //alert(temp_info)
                    for(var noreal_i =0 ;noreal_i<class_array[7];noreal_i++){
                        if (all_info[7][noreal_i]=="" || all_info[7][noreal_i] == undefined){
                        all_info[7][noreal_i] = temp_info;}
                        //alert("++" + all_info[7][noreal_i])
                    }
            }
            //9: 有害-暴恐
            else if(text_all[i].indexOf("有害")!=-1 &&text_all[i].indexOf("暴恐")!=-1&& text_all[i+1]!=undefined){
                //alert(i)
                 i += 1;
                //var ti = i;
                for(ti=i;ti< text_all.length;ti++){
                    if(text_all[i].indexOf("网页链接") != -1){
                        temp_str = text_all[i].split('href')[1].split('"')[1].split('amp;');
                        all[8][class_array[8]] = temp_str[0] + temp_str[1] + temp_str[2];
                        i++;
                        class_array[8] +=1;
                    }
                    else if(text_all[i].length==0){
                        //alert("==1==")
                        i +=1;
                    }
                    //next line has 小指头
                    else if(encodeURI(text_all[i]).indexOf("%F0%9F%91%89") != -1 || text_all[i].indexOf("-") != -1){
                        //alert("==2==")
                        i -= 1;
                        break;
                    }
                    else{//unknown problem
                        //alert("==3==")
                        //i -= 1;
                        i += 1;
                    }
                }
            }
            //10: 垃圾-头像
            else if(text_all[i].indexOf("垃圾")!=-1 &&text_all[i].indexOf("头像")!=-1&& text_all[i+1]!=undefined){
                //alert(i)
                 i += 1;
                //var ti = i;
                for(ti=i;ti< text_all.length;ti++){
                    if(text_all[i].indexOf("网页链接") != -1){
                        temp_str = text_all[i].split('href')[1].split('"')[1].split('amp;');
                        all[9][class_array[9]] = temp_str[0] + temp_str[1] + temp_str[2];
                        i++;
                        class_array[9] +=1;
                    }
                    else if(text_all[i].length==0){
                        //alert("==1==")
                        i +=1;
                    }
                    //next line has 小指头
                    else if(encodeURI(text_all[i]).indexOf("%F0%9F%91%89") != -1 || text_all[i].indexOf("-") != -1){
                        //alert("==2==")
                        //alert(i)
                        i -= 1;
                        break;
                    }
                    else{//unknown problem
                        //alert("==3==")
                        //i -= 1;
                        i += 1;
                    }
                }
            }
            //11: 涉黄-头像
            else if(text_all[i].indexOf("涉黄")!=-1 &&text_all[i].indexOf("头像")!=-1&& text_all[i+1]!=undefined){
                //alert(i)
                 i += 1;
                //var ti = i;
                for(ti=i;ti< text_all.length;ti++){
                    if(text_all[i].indexOf("网页链接") != -1){
                        temp_str = text_all[i].split('href')[1].split('"')[1].split('amp;');
                        all[10][class_array[10]] = temp_str[0] + temp_str[1] + temp_str[2];
                        i++;
                        class_array[10] +=1;
                    }
                    else if(text_all[i].length==0){
                        //alert("==1==")
                        i +=1;
                    }
                    //next line has 小指头
                    else if(encodeURI(text_all[i]).indexOf("%F0%9F%91%89") != -1 || text_all[i].indexOf("-") != -1){
                        //alert("==2==")
                        //alert(i)
                        i -= 1;
                        break;
                    }
                    else{//unknown problem
                        //alert("==3==")
                        //i -= 1;
                        i += 1;
                    }
                }
            }
            else{};
        }
    }
    else{//should not run here
        alert("不是正确页面");
    }
}

function mainProcess(i){
    //alert(typeNum)
    if(i == typeNum){
        appendItemConent("恭喜您完成举报!");
        return;
    }
    setTimeout(function(){
        //alert("===1===")
		var flag_k = reportProcess(i,0);
	},100);

}

function reportProcess(k,m){
    if(k==typeNum){
        return(-1);
    }
    if(class_array[k] == 0){
        k += 1;
        mainProcess(k);
        return;
    }
    if(k<typeNum){
        //typeKeyWord_array: key words
        //class_array: size of each type
        classDur = (class_array[m] * 5.2)*1000;
        if(m == class_array[k]){
            setTimeout(function(){
                if(success_num > 0){
                    appendItemConent("成功举报: "+success_num +"项 "+ typeKeyWord_array[k]);
                    success_num = 0;}
                    k += 1;
                    mainProcess(k);
             },1000);//not duration for the whole type group
        }
        else{
            setTimeout(function(){
                reportOneType(k,m);
                },100);
        }
    }
}

function reportOneType(l,n){
    c1 = typeKeyWord_array[l].split("-")[0];
    c2 = typeKeyWord_array[l].split("-")[1];
    var inf = all_info[l][n];

    if(inf == undefined){
        inf = "";
    }
    else{
        inf = inf.split("<")[0];//sometimes the text ends with</div>
    }

    var url = all[l][n] + "?arg1="+c1 +"?arg2="+c2 +"?info="+inf;
    var r_i = "r_" + l.toString() + "_" + n.toString();
    //if(n < class_array[l]){
        reportPage(url,r_i);
        n += 1;
        setTimeout(function(){
        reportProcess(l,n);
    },5100);
    //}
}

function reportPage(url,win_name){
    /*后台运行可取消这一段注释
    var w = GM_openInTab(url, { active: false, insert: true, setParent :true });
    setTimeout(function(){
            w.close();
            if(w.closed){
            success_num += 1;
            }
        },5000);
     */
    //each window only need 3s
    //check brower name
    //后台运行可注释以下部分
    var userAgent = navigator.userAgent;
    var w;
    //判断是否Firefox浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        //w = open(url);
        w = open(url,win_name,'height=300, width=200');
        //delay 20s, let enough time to open the URL on the new tab
        setTimeout(function(){
            w.close();
            if(w.closed){
            success_num += 1;
            }
        },5000);
    }
    else if (userAgent.indexOf("Chrome") > -1){
        w = open(url,win_name,'height=300, width=200');
        //delay 20s, let enough time to open the URL on the new tab
        setTimeout(function(){
            w.close();
            if(w.closed){
                success_num += 1;
            }
        },5000);
 }
    else{
        alert("other brower");
        w = open(url,win_name,'height=300, width=200');
        setTimeout(function(){
            w.close();
            if(w.closed){
                success_num += 1;
            }
        },5000);
    }

}

//================= auto clean ===============

//start function for auto clean
function start(){
    //check if for 王源
    var chaohuaTitle = document.getElementsByClassName("weibo-text")[0].getElementsByClassName("surl-text")[0].textContent;
    if(chaohuaTitle.search("王源") == -1){
        window.alert("非王源, 退出");
        return;
    }
    //check authors
    //check if from @CareRoy_王源反黑组
    var author = document.getElementsByClassName("weibo-top m-box")[0].getElementsByClassName("m-text-box")[0].children[0].innerText;
    if (author.indexOf("CareRoy_王源反黑组") == -1 && author.indexOf("源子弹工厂") == -1 && author.indexOf("BattleAngels_王源打投站") == -1){
            alert("Error: 非@CareRoy_王源反黑组 @BattleAngels_王源打投站 @源子弹工厂，不支持")
            return;
    }
    var isRun = false;
    var process_input = prompt("请输入净化次数：", 5);
    process_time = parseInt(process_input);
    //when user choose "cancel"
    if(process_input == null) {
        window.alert("退出");
    }
    //when input is none, <0, string
    else if (isNaN(process_time) || process_time <= 0){
        window.alert("无效输入，重新开始");
        setTimeout(function(){
            start();
            },500);
        }
    else{
        //add information on website
        addDivItemInfoRight();
        //check all data-url links
        //modifyItemConent("正在识别链接，请稍侯...");
        selectLinks();
        setTimeout(function(){
        if (effective_links_num < 1){
            modifyItemConent("无净化链接，已退出");
            return;
        }
        else {
            //window.alert("运行 "+ process_time +" 次"); //too many confirmation might be annoying
            //check if open multi tab once
            is_multi = window.confirm("同时打开多窗口？");
            if (is_multi == true){
                delayOne = 20000; //for multiple tabs
                delayDur = 20500; //for open multiple tabs
            }

            modifyItemConent("欢迎使用，您将运行: " +process_time+ " 次循环");
            real_links_num = 0;
            oneProcess(0);
        }
    },100);
    }
}

//duration is 10 minutes for each loop
function oneProcess(k){
    t1 = new Date().getTime();
    setTimeout(function(){
        judgeMain(k);
    },1000);
}
function judgeMain(m){
    //if(m < (process_time-1)){
    if(m < process_time){
        modifyItemConent("欢迎使用，正在运行第 " + (m+1) +" 个循环 . . .");
        real_links_num = 0;

        if (is_multi == false)
            {
                //delayLoop = 380000;//400000;
                delayLoop = effective_links_num * 11500 + 60000;
                continousOpenUrls(0);

            }
        else{
                delayLoop = Math.ceil(effective_links_num / 5) * 34000 + 60000;
                continousOpenUrlsNew(0);
            }

        //continousOpenUrlsNew(0);

        //continousOpenUrls(0);
        //let it has enough time to open all URLs
        //also means interval
        //10 min, links num < 120
        setTimeout(function(){
            m+=1;
            oneProcess(m);
        },delayLoop); //need to change to 600000
    }
    //it will work
    else{
        //window.alert("所有循环完毕，共循环: "+m+" 次");
        modifyItemConent("所有运行已结束");
        //reply
                /*
                document.getElementsByClassName("m-box-center-a main-text m-text-cut focus")[0].click();
                document.getElementsByClassName("textarea-box")[0].getElementsByClassName("textarea")[0].textContent = "刚";
                document.getElementsByClassName("btn-send")[0].className = "btn-send";//let "发送" clickable
                */
    }
}

function continousOpenUrlsNew(ci){
    //var ci = 0;
    //calculate the number of final group, might less than 5 urls
    var group_num = parseInt(effective_links_num/5);
    var final_num = effective_links_num % 5;
    var int5times = effective_links_num - final_num;

    if(ci < int5times){
        setTimeout(function(){
            //for(var i=0; i < group_num; i++){
            open5Urls(ci,5,0);
            real_links_num += 5;
            //}
        },500);
    }
    else if(ci < effective_links_num && ci >= int5times){
        setTimeout(function(){
            open5Urls(ci,final_num,0);
            real_links_num += final_num;
        },500);
    }
    else {//(ci == effective_links_num)
        var base_str = "本次循环完毕，共净化: "+real_links_num+" 项，请等待: ";
        //modifyItemConent("本次循环完毕，共净化: "+real_links_num+" 项，请保留窗口等待");
        t2 = new Date().getTime();
        var timer = Math.ceil((delayLoop-(t2-t1))/1000) - 1;

        var i_id = setInterval(function(){
            timer -=1;
                var all_str = base_str + (timer+1) + " s后跳转";
                modifyItemConent(all_str);
                if(timer==0){
                    clearInterval(i_id);
                }
            },1000);
        //modifyItemConent("本次循环完毕，共净化: "+real_links_num+" 项，请保留窗口等待");
        real_links_num = 0;
    }
}
//open multi urls one time
function open5Urls(i_start, urlNum,ii){
    //var i_step = 0;
    if(ii< urlNum){
        setTimeout(function(){
            //var url_i = link_arry[i_start+ii];
            openURLNew(i_start,urlNum,ii);
            },500);
    }
    else{
    //20+1*5+5 = 30s
    setTimeout(function(){
        i_start += urlNum;
        continousOpenUrlsNew(i_start);
    },25000);

    }
}
//still let each opening has 1s delay
function openURLNew(i_start,urlNum,i_step){
    var url_i = link_arry[i_start+i_step];
    var w_i = "w" + i_step.toString();
    openURL(url_i, w_i);
    i_step += 1;
    setTimeout(function(){
    //var url_i = link_arry[i_start+i_step];
    //alert((i_start + i_step) + "  " +url_i);
    //openURL(url_i);
        open5Urls(i_start,urlNum,i_step);
    },500);
}

//the total duration = 1* URL_others + 20.5 * URL_effect
function continousOpenUrls(j){
    //let it only delay 0.5s
    setTimeout(function(){
        judge(j);
    },500);
}

//delayDur = 20500 for open multiple tabs
//delayDur = delayOne + 0.5s = 10500 for open single tab
function judge(i){
        if(i<effective_links_num){
                openURL(link_arry[i],0);
                real_links_num += 1;
                //let it has enough time to open and close the URL
                //it goes to continousOpenUrls after 20.5s
                setTimeout(function(){
                    i+=1;
                    continousOpenUrls(i);
                },delayDur);
            }
        else{
            var base_str = "本次循环完毕，共净化: "+real_links_num+" 项，请等待: ";
            //modifyItemConent("本次循环完毕，共净化: "+real_links_num+" 项，请保留窗口等待");
            t2 = new Date().getTime();
            var timer = Math.ceil((delayLoop-(t2-t1))/1000) - 2;
            var i_id = setInterval(function(){
                    timer -=1;
                    var all_str = base_str + (timer+1) + " s后跳转";
                    modifyItemConent(all_str);
                    if(timer==0){
                        clearInterval(i_id);
                    }
                },1000);
        }
}
//delayOne = 20000; for multiple tabs
//delayOne = 10000; for single tab
function openURL(url,w_i){
    /*
    //check brower name
    var userAgent = navigator.userAgent;
    var w;
    //判断是否Firefox浏览器
    if (userAgent.indexOf("Firefox") > -1) {
        w = open(url);
        setTimeout(function(){
            w.close();
        },delayOne);

    }
    else if (userAgent.indexOf("Chrome") > -1){
        w = open(url,w_i,'height=300, width=200');
        setTimeout(function(){
            w.close();
        },delayOne);;
 }
    else{
        //alert("other brower");
        w = open(url,w_i,'height=300, width=200');
        setTimeout(function(){
           w.close();
        },delayOne);
    }
    */
    //do not focus to the new tab
    var w = GM_openInTab(url, { active: false, insert: true, setParent :true });
    setTimeout(function(){
           w.close();
        },delayOne);
    //var w = open(url);
    //var w_i = "w" + w_number.toString()

}
//get all effective links, store to link_array
function selectLinks(){
    var link_length = document.getElementsByClassName('weibo-text')[0].getElementsByTagName('a').length;
    if(link_length < 1){
        window.alert("Erro: 未找到任何链接")
        return -1;
    }
    var weibo_str = "100103type"; //weibo
    var baidu_str = "baidu.com";
    var encode_roy = "%E7%8E%8B%E6%BA%90";
    var qqmusic_str = "https://i.y.qq.com";
    var ttarticle_str = "https://card.weibo.com/article"; //头条文章
    for(var si =0; si<link_length; si++){
        var a_content = document.getElementsByClassName('weibo-text')[0].getElementsByTagName('a')[si];
        //weibo
        if(a_content.href.indexOf(weibo_str) !== -1){
            link_arry[effective_links_num] = a_content.href;
            effective_links_num += 1;
        }
        //baidu
        else if(a_content.href.indexOf(baidu_str) !== -1 && a_content.href.indexOf(encode_roy) !== -1){
            link_arry[effective_links_num] = a_content.href;
            effective_links_num += 1;
        }
        //qq music
        else if(a_content.href.indexOf(qqmusic_str) !== -1){
            var real_music_url = "";
            var songid = "";
            var songmid = "";
            //get songmid and songid value
            var attrNum = a_content.href.split("?")[1].split("&").length;
            for(var qi = 0; qi < attrNum; qi++){
                if (a_content.href.split("?")[1].split("&")[qi].indexOf("songid")!=-1){
                    songid = a_content.href.split("?")[1].split("&")[qi].split("songid=")[1];
                    if(songid !== ""){
                        break;
                    }
                }
                if (a_content.href.split("?")[1].split("&")[qi].indexOf("songmid")!=-1){
                    songmid = a_content.href.split("?")[1].split("&")[qi].split("songmid=")[1];
                    break;
                }
            }
            //songid
            if(songid !== ""){
                real_music_url = "https://y.qq.com/n/yqq/song/" + songid + "_num.html?ADTAG=h5_playsong&no_redirect=1";
            }
            else if(songmid !== ""){
                real_music_url = "https://y.qq.com/n/yqq/song/" + songmid + ".html?ADTAG=h5_playsong&no_redirect=1";
            }
            else{
                console.log("unable to recongize the music url")
            }
            link_arry[effective_links_num] = real_music_url;
            effective_links_num += 1;
        }
        //toutiao article

        else if(a_content.href.indexOf(ttarticle_str) !== -1){
            link_arry[effective_links_num] = a_content.href;
            effective_links_num += 1;
        }
        else{
            console.log("非净化链接或未能识别的搜索类型。")
        }
    }
}

//===============some basic function=============

//==========for report
function addButton(){
    var newBtn = document.createElement("button");
    newBtn.setAttribute("class","button");
    var newDiv = document.createElement("div");
    newDiv.id = "JNewDivReport";
    newDiv.style = "float:right";
    newBtn.textContent = "一键反黑";
    newBtn.name="temp btn ba";
    newDiv.append(newBtn);

    var currentH4 = document.getElementsByClassName("weibo-top m-box")[0].getElementsByTagName("h4")[0];
    currentH4.append(newDiv);

    //add event
    currentH4.getElementsByClassName("button")[0].addEventListener('click', function(){
        //check if 1st running
        if(document.getElementsByClassName("card-wrap")[0].childElementCount == 2 &&document.getElementsByClassName("card-wrap")[0].children[1].id=="JNewDivInfo"){
            //remove button, exit
            var b = document.getElementsByClassName("weibo-top m-box")[0].getElementsByTagName("h4")[0].getElementsByTagName("div")[0];
            document.getElementsByClassName("weibo-top m-box")[0].getElementsByTagName("h4")[0].removeChild(b);
            //var t = document.getElementsByClassName("card-wrap")[0].children[1];
            //document.getElementsByClassName("card-wrap")[0].removeChild(t);
            alert("您已完成举报!");
            return;
        }
        setTimeout(function(){
            startWeibo();

        },100);
    });
}

function addDivItemInfo(){
    var newDiv = document.createElement("div");
    //need to find the corret for weibo
    var currentClass = document.getElementsByClassName("card-wrap")[0];
    currentClass.append(newDiv);

    newDiv.id = "JNewDivInfo";
    //newDiv.setAttribute('coords',"0,0,270,129")
    newDiv.style.border = 'none';
    newDiv.style.color = "red";
    newDiv.style.width = "95%";
    //newDiv.style.background = "#fff";
    //newDiv.style.border = "1px solid #000";
    newDiv.style.fontSize = "12px"
    newDiv.style.textAlign = "left";
    //newDiv.style.position = 'absolute';
    //newDiv.style.position = 'static';

    var newContent = document.createTextNode("欢迎使用...");
    newDiv.appendChild(newContent);
}

function appendItemConent(content){
    document.getElementById('JNewDivInfo').innerHTML += ("<br>" + content);
}

//==========for auto clean
function addCleanButton(){
    var newBtn = document.createElement("button");
    newBtn.setAttribute("class","button");
    var newDiv = document.createElement("div");
    newDiv.style = "float:right";
    newBtn.textContent = "一键净化";
    newBtn.name="temp btn ba";
    newDiv.append(newBtn);
    document.getElementsByClassName("weibo-top m-box")[0].getElementsByTagName("h4")[0].append(newDiv);
    //add event
    document.getElementsByClassName("weibo-top m-box")[0].getElementsByTagName("h4")[0].getElementsByClassName("button")[0].addEventListener('click', function(){
        //check if 1st running
        if(document.getElementsByClassName("card-wrap")[0].childElementCount == 2){
            var t = document.getElementsByClassName("card-wrap")[0].children[1];
            document.getElementsByClassName("card-wrap")[0].removeChild(t);
            //clear
            effective_links_num = 0;
        }
        setTimeout(function(){
            start();

        },100);

    });

}

function addDivItemInfoRight(){
    var newDiv = document.createElement("div");
    //need to find the corret for weibo
    var currentClass = document.getElementsByClassName("card-wrap")[0];
    currentClass.append(newDiv);

    newDiv.id = "JNewDivInfo";
    //newDiv.setAttribute('coords',"0,0,270,129")
    newDiv.style.border = 'none';
    newDiv.style.color = "red";
    newDiv.style.width = "95%";
    //newDiv.style.background = "#fff";
    //newDiv.style.border = "1px solid #000";
    newDiv.style.fontSize = "18px"
    newDiv.style.textAlign = "right";
    //newDiv.style.position = 'absolute';
    //newDiv.style.position = 'static';

    var newContent = document.createTextNode("欢迎使用...");
    newDiv.appendChild(newContent);
}

function modifyItemConent(content){
    document.getElementById('JNewDivInfo').textContent = content;
}



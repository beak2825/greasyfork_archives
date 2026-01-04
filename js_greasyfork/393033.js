// ==UserScript==
// @name         嘗試分析大量IP限制(1K/天)!!
// @namespace    https://greasyfork.org/zh-TW/users/408061
// @version      0.2
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGkDK1fzQ1t2e2aoP7bx8vf_3x_eU9KG9TTauPGSA5DOZfvKj&s
// @description  Test Peter:教學網站
// @author       Peter
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.js
// @match        *://192.168.1.48:8088/eP/druid/login.*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393033/%E5%98%97%E8%A9%A6%E5%88%86%E6%9E%90%E5%A4%A7%E9%87%8FIP%E9%99%90%E5%88%B6%281K%E5%A4%A9%29%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/393033/%E5%98%97%E8%A9%A6%E5%88%86%E6%9E%90%E5%A4%A7%E9%87%8FIP%E9%99%90%E5%88%B6%281K%E5%A4%A9%29%21%21.meta.js
// ==/UserScript==
var $ = window.jQuery;
var Global_wiki={};
$(function() {
    'use strict';
    //return;

    if ($('#trDBId').length > 0){/* it exists */
        $("#trDBId").remove();
    }else{/* it doesn't exist */}

    var today = new Date();
    var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var listTitle = ["continent_name","country_name","country_capital","district","city"
                     ,"zipcode","latitude","longitude","calling_code","country_tld"
                     ,"languages","isp","organization"];

    var vHtmlData = "<div id='trDBId'>"
      +'目前時間:<font color="red"><b>'+dateTime+'</b></font>'+"\n<table border ='1'><tr align='center'>"
      +"<td>Ln</td>";
    var vCSVData ="Ln";

      +"<td>ip</td><td>country</td><td>latitude</td><td>longitude</td><td>time_zone</td>"
      +"</tr>";

     for (var i = 0; i < listTitle.length; ++i) {
         vHtmlData +="<td>"+listTitle[i]+"</td>";
         vCSVData += ","+listTitle[i];
     }

    vHtmlData +="</tr>";
    vCSVData += "\n";

    //<button type="button" onclick="javascript:createEntryApp();">View</button>

    var vHtmlButton = '<center>'
    +'<image src="data:image/jpeg;base64,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">'
    +'<br/><button type="button" id="findIpLocation">查詢指定的IP清單的座標!!</button></center>';
    $("html > body > div").eq(0).after(vHtmlButton);

    $(document).on('click', '#findIpLocation', function(){
        /******************主要程式處理******************/
        //1.遞迴所有IP資料
        $.each([
            "60.250.225.88","60.249.168.162","59.120.232.130","1.172.111.98","60.249.193.175"
            ,"10.10.149.92","206.16.224.134"

        ]
        , function( index, value ) {
            //2.呼叫服務抓取 座標等資訊 + 描繪資料
            //vHtmlData+='<tr>'+getIpLocation(value,index+1,'HTML',listTitle)+'</tr>';
            vCSVData+=getIpLocation(value,index+1,'CSV',listTitle)+'\n';
        });

        //3.HTML要有結尾
        vHtmlData+="</table></div>";

        //4.產生下載檔案
        downloadFile(vCSVData,date.replace(/\//g,''));
        /******************主要程式處理******************/

    });//End of button Click

    //location.reload();
    // Your code here...
});

//4.產生下載檔案
function downloadFile(vHtmlData,vFileDate){
    var fileName = "JsonFindIpLocation_"+vFileDate+".csv";//匯出的檔名
    //var data = getRandomData();
    var blob = new Blob([vHtmlData], {
        type : "application/octet-stream"
    });
    var href = URL.createObjectURL(blob);
    var link = document.createElement("a");
    document.body.appendChild(link);
    link.href = href;
    link.download = fileName;
    link.click();

    //純文字檔
    //var a = document.createElement("a");
    //a.href += "data:text,"+ vHtmlData; //write to .txt file
    //a.download = "vJsonTest20191128.csv"; //download .txt file
    //a.click();
}

//2.呼叫服務抓取 座標等資訊 + 描繪資料[每日限定1K查詢量]
function getIpLocation(ip,iLn,vType,listTitle){
    'use strict';
    //console.log('ip>==>'+ip+'==iLn'+iLn);
    var vHtmlDataTemp ="";
    $.ajaxSettings.async = false; //同步执行
    $.ajaxSetup({
        headers : {
            'accept' : 'application/json'
        }
    });
    $.getJSON(
        //參考註冊這網站用IP找位置服務:https://app.ipgeolocation.io/
        'https://api.ipgeolocation.io/ipgeo?apiKey=95ab8b2b15e742ae84a06ed91db93b7c&ip='+ip,
		function(data, textStatus) {
            if (textStatus == "success") {
                //console.log(vType+'==data>==>'+JSON.stringify(data));
                if(vType == 'HTML'){
                    vHtmlDataTemp+='<td>'+iLn+'</td>'+'<td>'+ip+'</td>';
                }else if(vType == 'CSV'){
                    vHtmlDataTemp+=','+iLn+','+ip;
                }
                //console.log('listTitle.length>==>'+listTitle.length);
                for (var i = 0; i < listTitle.length; ++i) {
                    //console.log(listTitle[i]+'>==>'+data.city);
                    var vDataTemp = data[listTitle[i]];
                    //console.log(listTitle[i]+'>==>'+vDataTemp);
                    //if( listTitle[i] =='location' )
                    //    vDataTemp = JSON.stringify(vDataTemp);
                    if(vType == 'HTML'){
                        vHtmlDataTemp+='<td>'+vDataTemp+'</td>';
                    }else if(vType == 'CSV'){
                        vHtmlDataTemp+= ',"'+vDataTemp+'"';
                    }
                }//End of for
            }//end of if

            if( vType == 'CSV' ){
                    vHtmlDataTemp = vHtmlDataTemp.substr(1);
            }

        }//end of function
	).fail(function(jqXHR, textStatus, errorThrown) {
       if(vType == 'HTML'){
           vHtmlDataTemp+='<td>'+iLn+'</td>'+'<td>'+ip+'</td>';
       }else if(vType == 'CSV'){
           vHtmlDataTemp+=','+iLn+','+ip;
       }

        if( vType == 'CSV' ){
            vHtmlDataTemp = vHtmlDataTemp.substr(1);
        }
        //console.log('getJSON request failed! ' + textStatus);
    });

    //console.log('iLn>==>'+vHtmlDataTemp);
    $.ajaxSettings.async = true; //异步执行
    return vHtmlDataTemp;
}
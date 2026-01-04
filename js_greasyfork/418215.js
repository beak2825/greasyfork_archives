// ==UserScript==
// @name         分析網站Druid的Connect
// @namespace    https://greasyfork.org/zh-TW/users/408061
// @version      0.5
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqGkDK1fzQ1t2e2aoP7bx8vf_3x_eU9KG9TTauPGSA5DOZfvKj&s
// @description  Test Peter:分析網站Druid的Connect
// @author       Peter
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.js
// @match        *://*.YourWebSite*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418215/%E5%88%86%E6%9E%90%E7%B6%B2%E7%AB%99Druid%E7%9A%84Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/418215/%E5%88%86%E6%9E%90%E7%B6%B2%E7%AB%99Druid%E7%9A%84Connect.meta.js
// ==/UserScript==
var $ = window.jQuery;
var originUrl =window.location.origin;
var Global_User='Login Name';
var Global_Pwd='Login Password';
var vWaitReload = 8*1000;
var jsonlistTitle = ["ActiveCount","ActivePeak","ActivePeakTime","PoolingCount","PoolingPeak","PoolingPeakTime","WaitThreadCount"];

$(function() {
    'use strict';
    //1.Login Druid
    reloadGetDruid();
    setInterval(reloadGetDruid, vWaitReload);

    function reloadGetDruid(){
        'use strict';

        var vLn = 0;
        if ($('[id="trDBId"]').length > 0){/* it exists */
            //console.log('trDBId===>'+$('[id="trDBId"]').length);
            $('[id="trDBId"]').remove();
        }else{/* it doesn't exist */}

        var today = new Date();
        var date = today.getFullYear()+'/'+(today.getMonth()+1)+'/'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        var listTitle = ["Ln","Title","Value"];

        //0. Setting Html Title
        var vHtmlData = "<div id='trDBId'><table border ='1'><tr align='center'>";
        for (var i = 0; i < listTitle.length; ++i) {
            vHtmlData +="<td>"+listTitle[i]+"</td>";
        }
        vHtmlData +="</tr>";

        vHtmlData +="<tr>";
        vHtmlData +="<td>"+(++vLn)+"</td><td>目前時間</td><td><font color='red'><b>"+dateTime+"</b><font></td>";
        vHtmlData +="</tr>";



        //console.log('vUrl>==>'+vUrl+'==vUser'+vUser);
        var vLogInResult = "";
        $.get(originUrl + '/Your Login Website?Login Name='+Global_User+'&Login Password='+Global_Pwd, function( dataLogin ) {
            console.log('==dataLogin>==>'+dataLogin+"<--");
            vLogInResult = dataLogin;

            var vHtmlDataTemp ="";
            if( vLogInResult == "success" ){
                //2.Get Druid Value
                $.ajaxSettings.async = false; //同步执行
                $.ajaxSetup({
                    headers : {
                        'accept' : 'application/json'
                    }
                });
                $.getJSON(
                    originUrl +'/Your Json Url.json',
                    function(data, textStatus) {
                        if (textStatus == "success") {
                            //console.log('==data>==>'+JSON.stringify(data));
                            //console.log('listTitle.length>==>'+data.Content[0]['ActivePeakTime']);

                            for (var i = 0; i < jsonlistTitle.length; ++i) {
                                //console.log(listTitle[i]+'>==>'+data.city);
                                var vDataTemp = data.Content[0][jsonlistTitle[i]];
                                //console.log(jsonlistTitle[i]+'>==>'+vDataTemp);
                                //    vDataTemp = JSON.stringify(vDataTemp);
                                vHtmlDataTemp+="<tr>";
                                vHtmlDataTemp+='<td>'+(++vLn)+'</td><td>'+jsonlistTitle[i]+'</td><td>'+vDataTemp+'</td>';
                                vHtmlDataTemp+="</tr>";
                            }//End of for
                        }//end of if


                    }//end of function
                ).fail(function(jqXHR, textStatus, errorThrown) {
                    vHtmlDataTemp+="<tr>";
                    vHtmlDataTemp+=('<td>'+(++vLn)+'</td><td>Fail</td><td>Fail!!</td>');
                    vHtmlDataTemp+="</tr>";
                    //console.log('getJSON request failed! ' + textStatus);
                });

                $.ajaxSettings.async = true; //异步执行

            }else{
                vHtmlDataTemp+="<tr>";
                vHtmlDataTemp+=('<td>'+(++vLn)+'</td><td>Fail2</td><td>Fail!!</td>');
                vHtmlDataTemp+="</tr>";
            }

            vHtmlData += vHtmlDataTemp
            //vHtmlData+= loginDruid(originUrl,Global_User,Global_Pwd);
            //console.log('vHtmlData==>'+vHtmlData);

            //3.HTML要有結尾
            vHtmlData+="</table></div>";
            //4.Append HTML Value
            $('#tblORD').prepend(vHtmlData);
        });

        //timeout = setTimeout(reloadGetDruid(vUrl), vWaitReload);
    }

});


// ==UserScript==
// @name         预约实验
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  //lgy
// @author       lgy
// @match        http://10.50.2.123/model/yqkf/res.html?ZCBH=*&type=*
// @match        http://10.50.2.123/model/yqkf/ResSubmit.html?ZCBH=*&date=*&URL=
// @downloadURL https://update.greasyfork.org/scripts/413429/%E9%A2%84%E7%BA%A6%E5%AE%9E%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/413429/%E9%A2%84%E7%BA%A6%E5%AE%9E%E9%AA%8C.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function addInfrastructure() {

        let style = document.createElement("style");

        style.appendChild(document.createTextNode(`
        #mywidget {
            position: relative;
            animation: mywidget_ani 2s 1;
            border-radius: 8px;
            background: transparent;
        }

        #mywidget a {
            position: absolute;
            left: -75px;
            transition: 0.3s;
            padding: 15px 30px 15px 15px;
            text-decoration: none;
            color: white !important;
            border-radius: 8px;
            font: 20px "Microsoft YaHei", SimHei, helvetica, arial, verdana, tahoma, sans-serif;
            min-width: 80px;
            text-align: right;
            white-space: nowrap;
        }


        #mywidget a:hover {
            left: -8px;
        }

        #vparse1 {
            background-color: #f44336;
        }

        #myplaybutton1 {
            position: absolute;
            right: -8px;
            top: 14px;
            width: 0px;
            height: 0px;
            margin: 0px;
            border-width: 16px;
            border-style: solid;
            border-color: transparent transparent transparent white;
        }

        #vparse2 {
            background-color: #f44336;
        }

        #myplaybutton2 {
            position: absolute;
            right: -8px;
            top: 14px;
            width: 0px;
            height: 0px;
            margin: 0px;
            border-width: 16px;
            border-style: solid;
            border-color: transparent transparent transparent white;
        }`));

        document.head.appendChild(style);
    }
    var jumpButton1 = $(`
    <div id="mywidget" href='javascript:void(0)' target='_blank' style="z-index:9999; position:fixed;left:0px;top:280px;">
    <a id="vparse1">❀提前进<div id="myplaybutton1"></div></a>
    </div>
    `);
    var jumpButton2 = $(`
    <div id="mywidget" href='javascript:void(0)' target='_blank' style="z-index:9999; position:fixed;left:0px;top:350px;">
    <a id="vparse2">❀输时间<div id="myplaybutton2"></div></a>
    </div>
    `);

    addInfrastructure();
    $("body").append(jumpButton1);
    $("body").append(jumpButton2);
    $("#vparse1").click(function () {
        var years=$("#year").text()+"-"+$("#month").text().replace("月","-");
        for(var i=0;i<30;i++){
            var date=years+$("td.wkf").eq(i).text();
            var OnClick="gourlzz('"+date+"')";
            $("td.wkf").eq(i).attr("onclick",OnClick);
        }
        $("td.wkf").attr("class","kf");
    })
    $("#vparse2").click(function () {
        for(var j=0;j<5;j++){
            var id=j+1;
            var className=$("li.gq,li.zc,li.zy").eq(j).attr("class");
            if(className!="zy"){
                $("li.gq,li.zc,li.zy").eq(j).attr("id",id);
                $("li.gq,li.zc,li.zy").eq(j).attr("onclick","Click("+id+")");
            }
        }
        $("li.gq").attr("class","zc");
    })
})();
// ==UserScript==
// @name         OA mainPage for boss
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @require https://cdnjs.cloudflare.com/ajax/libs/echarts/3.7.2/echarts.min.js
// @author       jackie.Feng
// @match       http://oa.jusdascm.com/Main.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34543/OA%20mainPage%20for%20boss.user.js
// @updateURL https://update.greasyfork.org/scripts/34543/OA%20mainPage%20for%20boss.meta.js
// ==/UserScript==
/* jshint -W097 */

$(function(){
    var jf={
        pageclear:function(){
            $('#tabs').tabs('close',1);
        },
        mudule:{
            panel:function(id,tl,icon){
                var str ='<div style="width: 49%; float: left;height: 200px; border: 1px solid #DCDCDC;margin:0px 10px 10px 0px;">'+
                    '<div style="height:30px;background-color:#f1f1f1;color:#999999;line-height:30px;padding-left:10px;">'+
                    '<i class="fa fa-lg '+icon+'" style="margin-right:6px;color:#FFAF02"></i>'+tl+
                    '</div>'+
                    '<div id="'+id+'" style="height:160px;background:#fff;padding:0">0</div>'+
                    '</div>';
                return str;
            },
            title:[
                {"id":"p1","tl":"我的待辦","icon":"fa fa-calendar-o"},
                {"id":"p2","tl":"我的已辦","icon":"fa fa-edit"},
                {"id":"p3","tl":"我的申請","icon":"fa fa-cogs"},
                {"id":"p4","tl":"我的已簽","icon":"fa fa-line-chart"},
                {"id":"p5","tl":"我的待辦","icon":"fa fa-navicon"},
                {"id":"p6","tl":"我的已辦","icon":"fa fa-calendar-check-o"}
            ]
        },
        m:function(c){
            var str ="";
            for(var i=0;i<jf.mudule.title.length;i++){
                str =str+jf.mudule.panel(jf.mudule.title[i].id,jf.mudule.title[i].tl,jf.mudule.title[i].icon);
            }
            return str;
        },
        addChart:function(){
            var myChart = echarts.init(document.getElementById('p1'));
            var option = {
                title: {
                    text: 'AAAAA',
                    x: '50%',
                    y: 'top',
                    textAlign: 'center'
                },
                tooltip: {},
                legend: {
                    x: '90%',
                    y: '10%',
                    // orient: 'vertical',
                    data:['AA']
                },
                grid: [{
                    top: '25%',
                    //width: '55%',
                    bottom: 10,
                    //left: '43%',
                    containLabel: true
                }],
                xAxis: {
                    data: ["A","B","C","D","E","F"]
                },
                yAxis: {},
                series: [{
                    name: 'AA',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            };
            myChart.setOption(option);
        },
        loadCss:function(url){
            var link = document.createElement( "link" );
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            document.getElementsByTagName( "head" )[0].appendChild( link );
        },
        pageinit:function(){
            var aa= $('#tabs').tabs('getSelected').panel().context;
            $('#tabs').tabs('getSelected').panel().html(jf.m(6));
        },
        init:function(){
            jf.loadCss('https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.css');
            jf.pageclear();
            jf.pageinit();
            // jf.addChart();
        },
    };
    jf.init();
});
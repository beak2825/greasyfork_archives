// ==UserScript==
// @name         豆阅计分
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       JanusK
// @match        https://read.douban.com/ebook/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37221/%E8%B1%86%E9%98%85%E8%AE%A1%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/37221/%E8%B1%86%E9%98%85%E8%AE%A1%E5%88%86.meta.js
// ==/UserScript==
(function() {
    'use strict';
    //引入echart
    var piescript=document.createElement("script");
    piescript.setAttribute("type","text/javascript");
    piescript.setAttribute("src","https://cdn.bootcss.com/echarts/3.8.5/echarts.min.js");
    document.getElementsByTagName("head")[0].appendChild(piescript);

    //初始化
    var sum=0, text="", amount=0, score=0, page=0, url=window.location.href;
    var piedata=[0, 0, 0, 0, 0];
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=callback;

    //开关
    var newdiv=document.createElement("div");
    newdiv.className="competition-2017-awards-group";
    newdiv.id="newdiv";
    newdiv.innerHTML='<div class="enroll-profile-section competition-2017"><div class="hd" style="align:center;"></div></div>';
    var scorebtn=document.createElement("a");
    url=url.substring(0, url.indexOf("?"));
    url=url.replace("reviews", "");
    scorebtn.onclick=function(){
        this.innerHTML="正在读取……";
        xmlhttp.open('GET',url+'reviews?start=0sort=score&competition_only=1');
        xmlhttp.send(null);
    };
    scorebtn.className="btn btn-read";
    scorebtn.innerHTML="读者评委评分";
    var topinfo=document.getElementsByClassName("col col9 app-article")[0];
    if(topinfo!==undefined){
        topinfo.insertBefore(newdiv, topinfo.children[1]);
        document.getElementsByClassName("competition-2017-awards-group")[0].firstChild.firstChild.appendChild(scorebtn);
    }


    //访问所有评分页
    function callback(){
        if(xmlhttp.readyState==4 && xmlhttp.status==200){
            var responseText=xmlhttp.responseText, pattern=/<span title="(\d)" class="rating-stars/g, result;
            if(responseText.search('class="rating-stars')!=-1){
                while((result=pattern.exec(responseText))!==null){
                    var score=parseInt(result[1])*2;
                    sum+=score;
                    text+=score+"\t";
                    amount+=1;
                    piedata[parseInt(result[1])-1]+=1;
                }
                page+=25;
                xmlhttp.open("GET",url+"reviews?start="+page+"&sort=score&competition_only=1");
                xmlhttp.send(null);
            }
            else{
                newdiv.innerHTML='<div class="enroll-profile-section competition-2017"><div class="hd"><h3>'+
                    /*'总分：'+sum+'，'+*/
                    '评分数：'+amount+'，平均分：'+sum/amount+'<br>详细评分：<textarea>'+text.substring(0,text.length-1)+'</textarea></h3></div></div>';

                var piediv=document.createElement("div");
                piediv.setAttribute("style","margin:0 auto; text-align:center; width: 300px; height:200px;");
                piediv.id="pie";
                document.getElementById('newdiv').appendChild(piediv);
                var myChart = echarts.init(document.getElementById('pie'));
                for(var i=0;i<5;i++){
                    pieoption.series[0].data[i].value=piedata[i];
                }
                myChart.setOption(pieoption);
            }
        }
    }

    //饼图配置
    var pieoption = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'right',
            data:['1星','2星','3星','4星','5星']
        },
        series: [
            {
                name:'评分统计',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                color:['#F5675D','#EDDC49','#6984E3','#5FBDB7','#72CB6F'],
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:335, name:'1星'},
                    {value:310, name:'2星'},
                    {value:234, name:'3星'},
                    {value:135, name:'4星'},
                    {value:1548, name:'5星'}
                ]
            }
        ]
    };
})();
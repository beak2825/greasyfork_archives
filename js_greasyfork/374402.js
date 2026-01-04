// ==UserScript==
// @name         GetDate EN games
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://*.en.cx/GameCalendar.aspx?*
// @require		https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js 
// @grant       GM_xmlhttpRequest 
// @grant       GM_registerMenuCommand 
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/374402/GetDate%20EN%20games.user.js
// @updateURL https://update.greasyfork.org/scripts/374402/GetDate%20EN%20games.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    GM_addStyle(
        '.textInfo{background:#fff;position:fixed; left:50%;top:50%; margin-top:-200px; margin-left:-400px; width: 806px;height: 421px;}'+
        '.close{ float:right; color:#000;}'+
        '.textInfo{color: #54432e;}'+
        '.textInfo textarea{width:800px; height:400px;white-space: nowrap;}'+
        '.textInfo a{color:#000;}'+
        '.textInfo div{ padding:10px 20px;}'+
        '.loaded{position:relative;}'+
        '.scenario{color:red !important;}'+
        '.loaded:before{position: absolute; content:""; left:0; right:0; top:0; bottom:0; background:rgba(29, 29, 29, 0.5)}'+
        '.loaded:after{position: absolute; content:"";left:0; right:0; top:0; height: 300px;'+
        ' background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNNzUuNCAxMjYuNjNhMTEuNDMgMTEuNDMgMCAwIDEtMi4xLTIyLjY1IDQwLjkgNDAuOSAwIDAgMCAzMC41LTMwLjYgMTEuNCAxMS40IDAgMSAxIDIyLjI3IDQuODdoLjAyYTYzLjc3IDYzLjc3IDAgMCAxLTQ3LjggNDguMDV2LS4wMmExMS4zOCAxMS4zOCAwIDAgMS0yLjkzLjM3eiIgZmlsbD0iI2ZmMDAwMCIgZmlsbC1vcGFjaXR5PSIxIi8+PGFuaW1hdGVUcmFuc2Zvcm0gYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIGZyb209IjAgNjQgNjQiIHRvPSIzNjAgNjQgNjQiIGR1cj0iNjAwbXMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9nPjwvc3ZnPg==")  no-repeat center;'+
        '}' );

    let arInfo=[];
    function GetDate(){
        let url='',
            content='';
        let rows =$('.table_light .infoRow ');
        $('body').addClass('loaded');

        $.each(rows, function( index, tr ) {
            let td=$(tr).find('td'),
                info={};
            let id=td.eq(1).find('span');
            info.id=id.eq(1).html()+"_"+id.eq(2).html();
            info.date=td.eq(4).html();
            let lnk=td.eq(5).find('b a');
            info.name=lnk.html()
            info.lnk=lnk.prop('href');
            info.commandNum=td.eq(8).html();
            localStorage.setItem("game_"+info.id, JSON.stringify(info));

            GM_xmlhttpRequest({
                method: 'GET',
                url: lnk.prop('href'),
                synchronous: true,
                onreadystatechange: function(res) {
                },
                onload: function (results) {
                    let url=results.finalUrl;
                    url=url.match(/http:\/\/([\w.]+)/gm)[0];
                    let content = results.responseText;
                    try {
                        let table_tr=$(content).find('#tdContentCenter .gameInfo > tbody > tr');
                        //
                        let td_id=table_tr.eq(1).find('table td');
                        let id1=td_id.eq(3).find('span span').html();
                        let id2 = td_id.eq(3).find('a').prop('href').match(/=([\d]+)/gm);
                        id2=id2[0].replace( /=/g, "" );
                        let info =JSON.parse(localStorage.getItem('game_'+id1+"_"+id2));

                        info.difficulty =table_tr.eq(4).find('a span').html();
                        info.quality =table_tr.eq(6).find('a').html();
                        if(table_tr.eq(7).find('span a').html()==='Доступен'){
                            info.availabilityScript =table_tr.eq(7).find('span a').prop('href');
                            let url_faik=info.availabilityScript.match(/http:\/\/([\w.]+)/gm)[0];
                            info.availabilityScript= info.availabilityScript.replace(url_faik,url);
                        }else{
                            info.availabilityScript ='';
                        }
                        info.restriction = table_tr.eq(10).find('span.white').html();
                        info.SequencePassing=table_tr.eq(11).find('span.white').html();

                        info.StartGame=table_tr.eq(12).find('span.white').text().substr(0,19);
                        info.EndTime=table_tr.eq(14).find('span.white').text().substr(0,19);
                        let price=table_tr.eq(15).find('span.padL3');
                        if(price.length>0){
                            info.Price=price.eq(0).text()+" "+price.eq(1).text();
                        }else{
                            info.Price=0;
                        }
                        localStorage.setItem("game_"+info.id, JSON.stringify(info));
                    }
                    catch (err) {}
                },
                onerror: function(res) {
                    GM_log("Error!");
                }});
        });
        var intervalID = window.setTimeout(addText, 10000);

    }
    const GetScenario = ()=>{
        let url='',
            content='';
        let rows =$('.table_light .infoRow ');
        $('body').addClass('loaded');

        $.each(rows, function( index, tr ) {
            let td=$(tr).find('td'),
                info={};
            let id=td.eq(1).find('span');
            info.id=id.eq(1).html()+"_"+id.eq(2).html();
            let lnk=td.eq(5).find('b a');
            info.name=lnk.html()
            info.lnk=lnk.prop('href');
            localStorage.setItem("game_"+info.id, JSON.stringify(info));

            GM_xmlhttpRequest({
                method: 'GET',
                url: lnk.prop('href'),
                synchronous: true,
                onreadystatechange: function(res) {
                },
                onload: function (results) {
                    let url=results.finalUrl;
                    url=url.match(/http:\/\/([\w.]+)/gm)[0];
                    let content = results.responseText;
                    try {
                        let table_tr=$(content).find('#tdContentCenter .gameInfo > tbody > tr');
                        //
                        let td_id=table_tr.eq(1).find('table td');
                        let id1=td_id.eq(3).find('span span').html();
                        let id2 = td_id.eq(3).find('a').prop('href').match(/=([\d]+)/gm);
                        id2=id2[0].replace( /=/g, "" );
                        let info =JSON.parse(localStorage.getItem('game_'+id1+"_"+id2));

                        if(table_tr.eq(7).find('span a').html()==='Доступен'){
                            info.availabilityScript =table_tr.eq(7).find('span a').prop('href');
                            let url_faik=info.availabilityScript.match(/http:\/\/([\w.]+)/gm)[0];
                            info.availabilityScript= info.availabilityScript.replace(url_faik,url);
                        }else{
                            info.availabilityScript =null;
                        }
                        localStorage.setItem("game_"+info.id, JSON.stringify(info));
                    }
                    catch (err) {}
                },
                onerror: function(res) {
                    GM_log("Error!");
                }});
        });
        var intervalID = window.setTimeout(addText2, 10000);
    };
    const addText2 = ()=>{
        let text="";
        $.each(localStorage, function( index, item ) {
            if(index!='length'){
                try {
                    let game=JSON.parse(localStorage.getItem(index));
                    text+=game.id+', <a target="_blank" href="'+game.lnk.toString().trim()+'">';
                    text+=game.name.toString().trim()+'</a>';
                    if(game.availabilityScript!=null){
                        text+=' [<a target="_blank" class="scenario" href="'+game.availabilityScript.toString().trim()+'">Сценарий</a>]';
                    }
                    text+='<br>';
                } catch (err) {//text+=index+" "+err;
                    text+='\n';

                }

            }
        });
        let block='<div class="textInfo"><a class="close" href="#" onclick="$(this).parent().remove();return false;">закрыть</a><div>'+
            text+
            '</div></div>'
        $('body').append(block);
        localStorage.clear();
        $('body').removeClass('loaded');
    };
    function addText(){
        let text="id;date;type;name;url;start;end;quality;difficulty;restriction;Price;commandNum;availabilityScript\n";
        $.each(localStorage, function( index, item ) {
            if(index!='length'){
                try {
                    let game=JSON.parse(localStorage.getItem(index));
                    text+=game.id+';';
                    text+=game.date.toString().trim()+';';
                    text+=game.SequencePassing.toString().trim()+';';
                    text+=game.name.toString().trim()+';';
                    text+=game.lnk.toString().trim()+';';
                    text+=game.StartGame.toString().trim()+';';
                    text+=game.EndTime.toString().trim()+';';
                    text+=game.quality.toString().trim()+';';
                    text+=game.difficulty.toString().trim()+';';
                    text+=game.restriction.toString().trim()+';';
                    text+=game.Price.toString().trim()+';';
                    text+=game.commandNum.toString().trim()+';';
                    text+=game.availabilityScript.toString().trim()+';';
                    text+='\n';
                } catch (err) {//text+=index+" "+err;
                    text+='\n';

                }

            }
        });
        let block='<div class="textInfo"><a class="close" href="#" onclick="$(this).parent().remove();return false;">закрыть</a><textarea  >'+
            text+
            '</textarea></div>'
        $('body').append(block);
        localStorage.clear();
        $('body').removeClass('loaded');
    };
    GM_registerMenuCommand( 'Get Date',  GetDate);
    GM_registerMenuCommand( 'Get scenario',  GetScenario);
})($);
// ==UserScript==
// @name         onVideoTool
// @namespace    FlxSNX\onVideoTool
// @version      0.1
// @description  onVideo获取视频链接工具
// @author       FlxSNX
// @match        https://onvideo.kuaishou.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @require https://cdn.staticfile.org/notyf/3.10.0/notyf.min.js
// @downloadURL https://update.greasyfork.org/scripts/449826/onVideoTool.user.js
// @updateURL https://update.greasyfork.org/scripts/449826/onVideoTool.meta.js
// ==/UserScript==

var notyf = new Notyf({position:{x:'center',y:'top'}});

(function() {
    'use strict';
    console.log('[onVideoTool] onVideoTool Runing...');
    init();
    getvod();
})();

$(document).on('click','[copy]',function(){
    navigator.clipboard.writeText($(this).attr('copy')).then(_=>{notyf.success('复制成功')},_=>{notyf.error('复制失败')});
});

$(document).on('click','#FlxSNXTool>#toolbox>#refresh',function(){
    getvod();
});

function getvod(){
    let projectId = location.pathname.split('/').pop();
    console.log('[onVideoTool] projectId:'+projectId);
    if(projectId){
        $.ajax({
            url:'https://onvideoapi.kuaishou.com/api/project/materials/?projectId='+projectId+'&materialType=all&__redirectURL=https%3A%2F%2Fonvideo.kuaishou.com%2Fonline%2F'+projectId,
            type:"GET",
            dataType:'json',
            xhrFields: {
                withCredentials: true //允许跨域带 Cookie
            },
            success:(data) => {
                if(data.code == 200){
                    $('#vod').html('');
                    notyf.success('获取成功');
                    data.data.forEach(e => {
                        $('#vod').append(`<div title="点击复制视频地址" copy="${e.previewHls.split('?')[0].replace('ssscdn','ssrcdn')}" style="background-color: #353580;word-wrap:break-word;word-break:break-all;color: #fff;padding: 4px;box-sizing: border-box;font-size: 12px;border-radius: 4px;margin: 4px 0;cursor: pointer;">${e.name+'[点击复制视频地址]'}</div>`);
                    });
                }else{
                    notyf.error('获取失败')
                }
            },
            error:() => {
                console.log('[onVideoTool] 请求接口失败');
            }
        });
    }
}

function init(){
    $('head').append('<link rel="stylesheet" href="https://cdn.staticfile.org/notyf/3.10.0/notyf.min.css">');
    let toolstyle = `
        #FlxSNXTool{
            position: fixed;
            bottom: 20%;
            right: -200px;
            width: 200px;
            height: 300px;
            z-index: 99999998;
            font-family: "Microsoft Yahei Light", "Microsoft Yahei", PingFangSC-Regular, Helvetica, sans-serif;
            transition: right .3s;
        }

        #FlxSNXTool #toolbox{
            position: absolute;
            right: 0px;
            width: 200px;
            height: 300px;
            background: white;
            // box-shadow: rgb(106 106 106 / 30%) -2px 0 10px 0px;
            border-radius: 4px 0 0 4px;
            z-index: 999;
            padding: 6px;
            box-sizing: border-box;
            overflow-y: auto;
        }

        #FlxSNXTool>#toolswitch{
            padding: 0;
            position: absolute;
            top: 125px;
            left: -30px;
            width: 30px;
            height: 50px;
            background-color: #fff;
            box-shadow: rgb(106 106 106 / 30%) -1px 0px 3px 1px;
            border-radius: 4px 0 0 4px;
            line-height: 50px;
            text-align: center;
            transition: left .5s;
        }

        #FlxSNXTool>#toolswitch>svg{
            width: 20px;
            height: 50px;
            transition: all .3s;
        }

        #FlxSNXTool>#toolswitch:hover svg{
            transform: rotate(360deg);
        }

        #FlxSNXTool>#toolbox>h2{
            font-size: 13px!important;
            margin: 0!important;
            text-align:left;
            user-select:none;
            font-weight: normal!important;
            color:#444!important;
        }

        #FlxSNXTool>#toolbox>#close{
            position: absolute;
            width: 16px;
            height: 16px;
            background-color: #ff3b3b;
            border-radius: 50%;
            color: #fff;
            top: 7px;
            right: 6px;
            font-size: 12px;
            text-align: center;
            transition: all .3s;
            cursor: pointer;
        }

        #FlxSNXTool>#toolbox>#refresh{
            position: absolute;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background-color: #353580;
            top: 7px;
            right: 26px;
            text-align: center;
            transition: all .3s;
            cursor: pointer;
        }

        #FlxSNXTool>#toolbox svg{
            width: 14px;
            height: 14px;
            vertical-align: initial;
        }

        #FlxSNXTool>#toolbox>#close:hover{
            transform: rotate(180deg);
        }

        #FlxSNXTool>#toolbox>#refresh:hover{
            transform: rotate(360deg);
        }
    `;

    $('body').append(`<style>${toolstyle}</style>`);

    $('body').append('<div id="FlxSNXTool"><div id="toolswitch"></div><div id="toolbox"><div id="refresh"><svg t="1660635030808" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2481" width="200" height="200"><path d="M512.3 878.8c-201.6 0-365.5-164-365.5-365.5 0-24.7 20-44.6 44.6-44.6s44.6 20 44.6 44.6c0 152.3 123.9 276.3 276.3 276.3 86.7 0 166.7-39.5 219.4-108.4 15-19.6 43-23.3 62.6-8.3s23.3 43 8.3 62.6c-69.8 91-175.7 143.3-290.3 143.3zM833.2 557.9c-24.7 0-44.6-20-44.6-44.6 0-152.4-123.9-276.3-276.3-276.3-86.3 0-166 39.2-218.8 107.6-15.1 19.5-43.1 23.1-62.6 8-19.5-15.1-23.1-43.1-8.1-62.6 69.8-90.5 175.4-142.3 289.5-142.3 201.6 0 365.6 164 365.6 365.6-0.1 24.6-20 44.6-44.7 44.6z" fill="#ffffff" p-id="2482"></path><path d="M833.2 599.6c-11.4 0-22.8-4.4-31.6-13.1l-80.8-80.8c-12.8-12.8-16.6-32-9.7-48.6 6.9-16.7 23.2-27.6 41.2-27.6H914c18.1 0 34.3 10.9 41.2 27.6 6.9 16.7 3.1 35.9-9.7 48.6l-80.8 80.8c-8.7 8.7-20.1 13.1-31.5 13.1zM272.2 598.3H110.5c-18.1 0-34.3-10.9-41.2-27.6-6.9-16.7-3.1-35.9 9.7-48.6l80.8-80.8c8.4-8.4 19.7-13.1 31.6-13.1 11.8 0 23.2 4.7 31.6 13.1l80.8 80.8c12.8 12.8 16.6 32 9.7 48.6s-23.2 27.6-41.3 27.6z" fill="#ffffff" p-id="2483"></path></svg></div><div id="close"><svg t="1640514613613" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3494" width="200" height="200"><path d="M764.032 215.04L512 466.944 259.968 214.976a32.832 32.832 0 0 0-22.464-8.96c-8.32 0-15.68 3.2-22.016 9.472a30.08 30.08 0 0 0-9.536 22.016c0 8.32 3.072 15.872 9.024 22.528L466.944 512 215.04 764.032a30.72 30.72 0 0 0-8.512 30.976 28.672 28.672 0 0 0 22.016 22.528 32.064 32.064 0 0 0 31.488-8.512l251.968-252.032 252.032 252.032c6.656 6.016 14.208 8.96 22.528 8.96 8.32 0 15.616-3.2 22.016-9.472a30.08 30.08 0 0 0 9.472-22.016 32.96 32.96 0 0 0-8.96-22.528L556.928 512l252.032-252.032a30.72 30.72 0 0 0 8.512-30.976 28.8 28.8 0 0 0-22.528-22.528 30.72 30.72 0 0 0-31.04 8.512z" fill="#ffffff" p-id="3495"></path></svg></div></div></div>');

    $('#toolbox').append('<h2>onVideoTool</h2>');
    $('#toolbox').append('<div id="vod"></div>');

    // $('#toolbox').append('<div class="verify" style="position: relative;text-align: center;margin-top: 30px;"><svg t="1640522583567" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26429" width="80" height="80"><path d="M491.163659 44.574915s-128.255308 215.144706-384.778033 215.144707c0 0-16.561702 484.07559 384.778033 711.63249 0 0 426.555663-206.86991 426.555663-732.319481-0.004036 0-286.594546 37.232547-426.555663-194.457716z" fill="#8BE0A3" p-id="26430"></path><path d="M94.247913 298.453742c-0.169532 4.298858-3.616692 106.756983 40.934005 236.457353 41.131793 119.774651 132.75599 286.695458 335.621705 401.723201a40.336605 40.336605 0 0 0 32.901398 3.100021c4.375551-1.485427 108.339286-37.587758 212.294947-136.98219 95.749486-91.555577 209.864983-256.397594 209.864983-521.865172l-28.763999-14.192285c0 384.923346-404.488194 553.910835-419.49585 559.101756a40.142854 40.142854 0 0 1 33.006347 3.067729c-346.047949-196.213587-11.520131-709.444715-11.374818-713.113881L94.247913 298.453742z" fill="#6E6E96" opacity=".15" p-id="26431"></path><path d="M499.236631 109.158692c98.538697 266.609904 398.199349 152.433859 426.555663 149.44686 1.64285-22.333877 0 0 0-23.61748-0.004036 0-286.594546 37.232547-426.555663-194.457716 0 0-128.255308 215.144706-384.778033 215.144707 0 0-0.875917-15.750369 2.732701 26.89107 286.098058 61.919696 382.045332-173.407441 382.045332-173.407441z" fill="#B0EDC1" p-id="26432"></path><path d="M473.826951 34.241511l0.01211-0.020182c-1.231128 2.050535-125.930292 205.315863-367.453435 205.315863a20.186467 20.186467 0 0 0-20.17032 19.492191c-0.173569 5.077899-3.72164 126.144226 42.774642 277.104767 43.069306 139.860205 139.145747 331.944467 352.223773 452.768604a20.158211 20.158211 0 0 0 18.757551 0.5974c4.496645-2.183739 111.394906-54.787225 219.407235-173.706141 99.685059-109.743983 218.523245-298.897755 218.523246-576.773492a20.18243 20.18243 0 0 0-22.765782-20.016934c-2.736738 0.347138-275.405407 32.469494-406.700188-184.875097a20.190503 20.190503 0 0 0-17.332671-9.748114 20.222795 20.222795 0 0 0-17.276161 9.861135z m423.709941 204.79112c0 506.942283-411.027301 712.145124-415.172773 714.159331a20.18243 20.18243 0 0 1 18.757551 0.601436C114.882429 734.797884 126.394488 265.128513 126.555947 260.409861a20.18243 20.18243 0 0 1-20.170321 19.492191c264.938798 0 396.641265-215.802654 402.114741-224.989696a20.18243 20.18243 0 0 1-34.608832 0.096876c60.091168 99.467089 156.325032 166.307262 278.295531 193.299244 91.450628 20.238941 165.023659 11.136665 168.103498 10.741089a20.18243 20.18243 0 0 1-22.753672-20.016934z" fill="#6E6E96" p-id="26433"></path><path d="M658.371057 369.851107l-215.952004 215.947967h42.815008l-119.601082-119.593008-42.815007 42.810971 119.601081 119.601081 21.405486 21.401449 21.409522-21.401449 215.952004-215.95604z" fill="#6E6E96" p-id="26434"></path></svg></div>');

    $('#FlxSNXTool #toolswitch').append(`<svg t="1640520704474" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1826" width="200" height="200"><path d="M945.230769 393.846154h78.769231v78.769231h-78.769231zM866.461538 393.846154h78.769231v78.769231h-78.769231z" fill="#FF9343" p-id="1827"></path><path d="M787.692308 630.153846h78.76923v78.769231h-78.76923zM787.692308 551.384615h78.76923v78.769231h-78.76923zM787.692308 472.615385h78.76923v78.76923h-78.76923z" fill="#1E2028" p-id="1828"></path><path d="M787.692308 393.846154h78.76923v78.769231h-78.76923z" fill="#FF9343" p-id="1829"></path><path d="M787.692308 315.076923h78.76923v78.769231h-78.76923zM787.692308 236.307692h78.76923v78.769231h-78.76923zM787.692308 157.538462h78.76923v78.76923h-78.76923zM708.923077 708.923077h78.769231v78.769231h-78.769231z" fill="#1E2028" p-id="1830"></path><path d="M708.923077 630.153846h78.769231v78.769231h-78.769231z" fill="#FF9B57" p-id="1831"></path><path d="M708.923077 551.384615h78.769231v78.769231h-78.769231zM708.923077 472.615385h78.769231v78.76923h-78.769231z" fill="#FFDD4D" p-id="1832"></path><path d="M708.923077 393.846154h78.769231v78.769231h-78.769231z" fill="#FF9343" p-id="1833"></path><path d="M708.923077 315.076923h78.769231v78.769231h-78.769231zM708.923077 236.307692h78.769231v78.769231h-78.769231zM708.923077 157.538462h78.769231v78.76923h-78.769231z" fill="#FFDD4D" p-id="1834"></path><path d="M708.923077 78.769231h78.769231v78.769231h-78.769231zM630.153846 945.230769h78.769231v78.769231h-78.769231zM630.153846 866.461538h78.769231v78.769231h-78.769231zM630.153846 787.692308h78.769231v78.76923h-78.769231z" fill="#1E2028" p-id="1835"></path><path d="M630.153846 708.923077h78.769231v78.769231h-78.769231z" fill="#FF9B57" p-id="1836"></path><path d="M630.153846 630.153846h78.769231v78.769231h-78.769231zM630.153846 551.384615h78.769231v78.769231h-78.769231zM630.153846 472.615385h78.769231v78.76923h-78.769231zM630.153846 393.846154h78.769231v78.769231h-78.769231z" fill="#FFDD4D" p-id="1837"></path><path d="M630.153846 315.076923h78.769231v78.769231h-78.769231zM630.153846 236.307692h78.769231v78.769231h-78.769231z" fill="#1E2028" p-id="1838"></path><path d="M630.153846 157.538462h78.769231v78.76923h-78.769231zM630.153846 78.769231h78.769231v78.769231h-78.769231z" fill="#FFDD4D" p-id="1839"></path><path d="M630.153846 0h78.769231v78.769231h-78.769231zM551.384615 787.692308h78.769231v78.76923h-78.769231z" fill="#1E2028" p-id="1840"></path><path d="M551.384615 708.923077h78.769231v78.769231h-78.769231z" fill="#FF9B57" p-id="1841"></path><path d="M551.384615 630.153846h78.769231v78.769231h-78.769231zM551.384615 551.384615h78.769231v78.769231h-78.769231zM551.384615 472.615385h78.769231v78.76923h-78.769231zM551.384615 393.846154h78.769231v78.769231h-78.769231zM551.384615 315.076923h78.769231v78.769231h-78.769231zM551.384615 236.307692h78.769231v78.769231h-78.769231zM551.384615 157.538462h78.769231v78.76923h-78.769231zM551.384615 78.769231h78.769231v78.769231h-78.769231z" fill="#FFDD4D" p-id="1842"></path><path d="M551.384615 0h78.769231v78.769231h-78.769231zM472.615385 787.692308h78.76923v78.76923h-78.76923z" fill="#1E2028" p-id="1843"></path><path d="M472.615385 708.923077h78.76923v78.769231h-78.76923z" fill="#FF9B57" p-id="1844"></path><path d="M472.615385 630.153846h78.76923v78.769231h-78.76923zM472.615385 551.384615h78.76923v78.769231h-78.76923z" fill="#1E2028" p-id="1845"></path><path d="M472.615385 472.615385h78.76923v78.76923h-78.76923zM472.615385 393.846154h78.76923v78.769231h-78.76923zM472.615385 315.076923h78.76923v78.769231h-78.76923zM472.615385 236.307692h78.76923v78.769231h-78.76923zM472.615385 157.538462h78.76923v78.76923h-78.76923zM472.615385 78.769231h78.76923v78.769231h-78.76923z" fill="#FFDD4D" p-id="1846"></path><path d="M472.615385 0h78.76923v78.769231h-78.76923zM393.846154 945.230769h78.769231v78.769231h-78.769231zM393.846154 866.461538h78.769231v78.769231h-78.769231zM393.846154 787.692308h78.769231v78.76923h-78.769231z" fill="#1E2028" p-id="1847"></path><path d="M393.846154 708.923077h78.769231v78.769231h-78.769231z" fill="#FF9B57" p-id="1848"></path><path d="M393.846154 630.153846h78.769231v78.769231h-78.769231z" fill="#1E2028" p-id="1849"></path><path d="M393.846154 551.384615h78.769231v78.769231h-78.769231zM393.846154 472.615385h78.769231v78.76923h-78.769231zM393.846154 393.846154h78.769231v78.769231h-78.769231zM393.846154 315.076923h78.769231v78.769231h-78.769231zM393.846154 236.307692h78.769231v78.769231h-78.769231zM393.846154 157.538462h78.769231v78.76923h-78.769231z" fill="#FFDD4D" p-id="1850"></path><path d="M393.846154 78.769231h78.769231v78.769231h-78.769231z" fill="#FFF1B6" p-id="1851"></path><path d="M393.846154 0h78.769231v78.769231h-78.769231zM315.076923 787.692308h78.769231v78.76923h-78.769231z" fill="#1E2028" p-id="1852"></path><path d="M315.076923 708.923077h78.769231v78.769231h-78.769231z" fill="#FF9B57" p-id="1853"></path><path d="M315.076923 630.153846h78.769231v78.769231h-78.769231z" fill="#1E2028" p-id="1854"></path><path d="M315.076923 551.384615h78.769231v78.769231h-78.769231z" fill="#FFF1B6" p-id="1855"></path><path d="M315.076923 472.615385h78.769231v78.76923h-78.769231z" fill="#1E2028" p-id="1856"></path><path d="M315.076923 393.846154h78.769231v78.769231h-78.769231zM315.076923 315.076923h78.769231v78.769231h-78.769231zM315.076923 236.307692h78.769231v78.769231h-78.769231zM315.076923 157.538462h78.769231v78.76923h-78.769231z" fill="#FFF1B6" p-id="1857"></path><path d="M315.076923 78.769231h78.769231v78.769231h-78.769231zM236.307692 787.692308h78.769231v78.76923h-78.769231z" fill="#1E2028" p-id="1858"></path><path d="M236.307692 708.923077h78.769231v78.769231h-78.769231z" fill="#FF9B57" p-id="1859"></path><path d="M236.307692 630.153846h78.769231v78.769231h-78.769231z" fill="#FFDD4D" p-id="1860"></path><path d="M236.307692 551.384615h78.769231v78.769231h-78.769231z" fill="#FFF1B6" p-id="1861"></path><path d="M236.307692 472.615385h78.769231v78.76923h-78.769231zM236.307692 393.846154h78.769231v78.769231h-78.769231zM236.307692 315.076923h78.769231v78.769231h-78.769231zM236.307692 236.307692h78.769231v78.769231h-78.769231zM236.307692 157.538462h78.769231v78.76923h-78.769231zM157.538462 708.923077h78.76923v78.769231H157.538462z" fill="#1E2028" p-id="1862"></path><path d="M157.538462 630.153846h78.76923v78.769231H157.538462z" fill="#FFDD4D" p-id="1863"></path><path d="M157.538462 551.384615h78.76923v78.769231H157.538462zM78.769231 551.384615h78.769231v78.769231H78.769231z" fill="#FFF1B6" p-id="1864"></path><path d="M157.538462 472.615385h78.76923v78.76923H157.538462zM78.769231 630.153846h78.769231v78.769231H78.769231zM0 551.384615h78.769231v78.769231H0zM78.769231 472.615385h78.769231v78.76923H78.769231zM0 472.615385h78.769231v78.76923H0z" fill="#1E2028" p-id="1865"></path></svg>`);

    $('#FlxSNXTool>#toolswitch').on('click',function(){
        $('#FlxSNXTool').css('right','0');
        $('#FlxSNXTool>#toolswitch').css('left','10px');
        $('#FlxSNXTool #toolbox').css('box-shadow','rgb(106 106 106 / 30%) -2px 0 10px 0px');
    });

    $('#FlxSNXTool>#toolbox>#close').on('click',function(){
        $('#FlxSNXTool').css('right','-200px');
        $('#FlxSNXTool>#toolswitch').css('left','-30px');
        $('#FlxSNXTool #toolbox').css('box-shadow','none');
    });
}
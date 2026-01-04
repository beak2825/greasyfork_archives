// ==UserScript==
// @name         счетчик+история проверок СТС
// @version      0.4
// @description  ...
// @author       yandex
// @match        https://taximeter-admin.taxi.yandex-team.ru/qc?exam=sts
// @grant        none
// @namespace https://greasyfork.org/users/395826
// @downloadURL https://update.greasyfork.org/scripts/393736/%D1%81%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%2B%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%A1%D0%A2%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/393736/%D1%81%D1%87%D0%B5%D1%82%D1%87%D0%B8%D0%BA%2B%D0%B8%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F%20%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D1%80%D0%BE%D0%BA%20%D0%A1%D0%A2%D0%A1.meta.js
// ==/UserScript==

(function(){
    function writeCounter(){
        $('#dkk-report').text('Замечания: '+reportSts.Block+' Успешно: '+reportSts.Success+' Всего: '+ (+reportSts.Block+ +reportSts.Remarks+ +reportSts.Success))
    };

    let fontSizeOnScreen = 0
    window.screen.availWidth < 1400 ? fontSizeOnScreen = 10 : fontSizeOnScreen = 14

    var reportSts = JSON.parse(localStorage.getItem('reportSts'));
    if(!!reportSts){
        writeCounter()
    }else{
        reportSts = {
        BlackList:0,
        Block:0,
        Remarks:0,
        Success:0,
        history:[],
        };
    };
    
    reportSts.load = function(){
            var localReportSts = JSON.parse(localStorage.getItem('reportSts'));
            for(var prop in localReportSts){
               reportSts[prop] = localReportSts[prop]
            };
    };
    var stsNumber;
    function SaveStsInput(){
        stsNumber = $('#sts-number').val().replace(/\s+/g, '');
        console.log(stsNumber);
    };
    function SaveStsItem(e,a){
        stsNumber = a.car_number;
        console.log(stsNumber);
    };
    $('#sts-number').on('change',SaveStsInput);
    $(document).on('item_info', SaveStsItem);
    
    
    reportSts.add = function(p){
            reportSts.load();
            reportSts['history'].push({stsNumber,p});
            reportSts[p]++;
            console.log(reportSts);
            localStorage.setItem('reportSts', JSON.stringify(reportSts));
            writeCounter()
    };
    
    reportSts.reset = function(){
        var agree = confirm('Сбросить счетчик проверок?');
        if(agree){
            reportSts.BlackList=0;
            reportSts.Block=0;
            reportSts.Remarks=0;
            reportSts.Success=0;
            reportSts.history=[];
            localStorage.setItem('reportSts', JSON.stringify(reportSts));
            writeCounter()
        }
    };
    
    $('<div/>',{
        css:{display:'inline-block'},
        append: $('<span/>',{
                text: 'Замечания: '+reportSts.Block+' Успешно: '+reportSts.Success+' Всего: '+ (+reportSts.Block+ +reportSts.Remarks+ +reportSts.Success),
                css:{color: 'white', margin:'0 0 0 5px', fontSize: `${fontSizeOnScreen}px`},
                id:'dkk-report',
                }).add($('<i/>',{
                    id: 'report-close',
                    text: '❌',
                    css:{color:'#5bc0de',font:'18px bold sans-serif',display:'none', cursor:'pointer'},
                    click: reportSts.reset,
                }))
    }).insertBefore($('.container-filters>.pull-right')).hover(function(){
        $('#report-close').css('display','inline')
    }, function(){
        $('#report-close').css('display','none')
    });
    
    $('div.pull-right').append($('<button/>',{
        class:'rotate btn btn-info',
        text:'Кейсы',
        id:'historySts',
        css:{
            backgroundColor:'#646f9a'
        },
    })
    );
    document.querySelector('#historySts').addEventListener('click', () => {
        var container =  $('.tab-content');
        if($("#check_history").length>0){
                $(container).find('.active.in').removeClass('active in');
                $("#check_history").toggleClass('active in');
                $('#items-tabs>li').removeClass('active');
           }else{
              $(container).find('.active.in').removeClass('active in');
               $('<div/>',{
                   id:'check_history',
                   class:'tab-pane fade active in',
                   append: $('<div/>',{
                       class:'datagrid datagrid-striped datagrid-vertical-top datagrid-disable-scroll-h font12',
                       append:$('<div/>',{
                           class:'datagrid-body nonbounce',
                           append:$('<div/>',{
                               class:'datagrid-content',
                               append: $('<table/>',{
                                   id:'history_container',
                                   append: $('<tbody/>',{
                                       class:'history_table'
                                   })
                               })
                           })
                       })
                   })
               }).prependTo(container);
               $('#items-tabs>li').removeClass('active');
           };

        var historyTable = $('.history_table');
        reportSts.load();
        historyTable.empty();
        reportSts.history.forEach(function(item){
            $(historyTable).append($('<tr/>',{
                append: $('<td/>',{
                    text: item['stsNumber']
                }).add($('<td/>',{
                    text:item['p']
                }))
            }))
        });
    })
    
    var typeOfCheck;
    
    $('#btn-ok').bind('click',function(){
        if($('div.check-thumb-view-dkk.cover>span.mark-bad:visible').length === 0 ){
            reportSts.add('Success')
        }else{
            typeOfCheck = 'Remarks'
        }
    });
    
    $('#btn-block').bind('click',function(){
        typeOfCheck = 'Block'
    });
    
    $('#btn-error').bind('click',function(){
        reportSts.add(typeOfCheck)
    });
    
    })()
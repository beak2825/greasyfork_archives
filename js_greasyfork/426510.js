// ==UserScript==
// @name         hpool daily estimation
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  tries to give a monetary value to your daily mining
// @author       Ruben Fernandes (Rauven)
// @match        https://hpool.com/*
// @match        https://www.hpool.com/*
// @icon         https://www.google.com/s2/favicons?domain=hpool.com
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/426510/hpool%20daily%20estimation.user.js
// @updateURL https://update.greasyfork.org/scripts/426510/hpool%20daily%20estimation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let _wallet = 0,
        _rates = false,
        _currency, _conversion, _currentPrice, _avg, _count, _mint, _maxt, _loopy, _page, _capacity, _cb_final, _cb_loop, _wid, _widVal, _tenDays, _widAvg, _netspace, _daily, _balance, _text, _plotsCur, _plotsDaily;

    if(!$('._chiaExt').length){
        $('<h5>',{class:'_chiaExt'}).appendTo('.h-menu-nav h4');


        $('<div>',{class:'_chiaActions _sec1'})
        .css({
            'display':'flex',
            'align-items':'stretch',
            'justify-content':'space-between',
            'width':'100%',
            'font-size': '60%'
        })
        .appendTo('.h-menu-nav h4')
        .clone()
        .removeClass('_sec1')
        .addClass('_sec1_1')
        .appendTo('.h-menu-nav h4')
        .clone()
        .removeClass('_sec1_1')
        .addClass('_sec2')
        .appendTo('.h-menu-nav h4')


        $('<small>').text('Current plots:').appendTo('._chiaActions._sec1');

        $('<input>',{class:'_chiaCurrentPlots',type:'number',placeholder:'Current plots',min:1,value:localStorage.getItem('plots')||0})
        .css({
            'width':'1%',
            'flex-grow':1,
            'flex-shrink':1,
            'margin-left': '2px'
        })
        .appendTo('._chiaActions._sec1')

        $('<small>').text('Daily plots:').appendTo('._chiaActions._sec1_1');

        $('<input>',{class:'_chiaDailyPlots',type:'number',placeholder:'Daily plots',min:1,value:localStorage.getItem('dailyplots')||1})
        .css({
            'width':'1%',
            'flex-grow':1,
            'flex-shrink':1,
            'margin-left': '2px'
        })
        .appendTo('._chiaActions._sec1_1');

        $('<button class="btn _chiaRefresh"><i aria-label="icon: sync" class="anticon anticon-sync"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="sync" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27A341.5 341.5 0 0 1 755 268.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 0 0 3 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8zm756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4A342.45 342.45 0 0 1 512.1 856a342.24 342.24 0 0 1-243.2-100.8c-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47a8 8 0 0 0-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8a8 8 0 0 0-8-8.2z"></path></svg></i></button>')
        .appendTo('._chiaActions._sec1_1');

        $('<select>',{class:'_chiaCurrency'}).appendTo('._chiaActions._sec2');
        $('<select>',{class:'_chiaNetpace'}).css({
            'width':'1%',
            'flex-grow':1,
            'flex-shrink':1
        }).appendTo('._chiaActions._sec2');

        $('._chiaNetpace').append($('<option>',{text:`Stable`,value:0}));
        for (var i = 1; i <= 20; i++) {
            $('._chiaNetpace').append($('<option>',{text:`Difficulty +${i}%/day`,value:i*0.01}));
        }
        $('._chiaNetpace').val(0.11);


        $('<ul>',{class:'_chiaFuture'}).css({
            'max-height': '3rem',
            'overflow': 'auto',
            'white-space': 'nowrap',
            'font-size': '80%'
        }).appendTo('.h-menu-nav h4');
    }

    function _chiaExt(){
        $('._chiaActions').css('pointer-events','none');
        _cb_final = ()=>{
            localStorage.setItem('currencyChia', $('._chiaCurrency').val());
            localStorage.setItem('plots', $('._chiaCurrentPlots').val());
            localStorage.setItem('dailyplots', $('._chiaDailyPlots').val());

            _currency = $('._chiaCurrency').val() || 'usd';
            _conversion = _currency in _rates ? _rates[_currency].rate : 1;

            $.getJSON("/api/assets/totalassets", jsonAssets => {

                 jsonAssets.data.list.some(ea=>{
                     if(ea.name == 'CHIA'){
                         _wallet = parseFloat(ea.balance);
                         return true;
                     }
                 });


                $.getJSON("/api/pool/list?language=en&type=opened", json => {

                     json.data.list.some(ea=>{
                         if(ea.name == 'CHIA'){
                             _capacity = Math.floor(parseFloat(ea.capacity/101))
                             $('._chiaCurrentPlots').val(_capacity)
                             return true;
                      }});

                    $.getJSON( "/api/home/list?language=en&type=eco", json => {
                        _avg = 0;
                        _count = 0;
                        _mint = false;
                        _maxt = false;
                        _currentPrice = json.data[1].currency.price_usdt;
                        _page = 1;
                        _cb_final = ()=>{
                            _text = [];

                            _avg = (_avg / (_maxt - _mint)) * 60 * 60 * 24;
                            _daily = _avg.toFixed(8);

                            $('._chiaFuture').empty();
                            _netspace = 1 - parseFloat($('._chiaNetpace').val());
                            _plotsCur = parseFloat($('._chiaCurrentPlots').val() || 1);
                            _plotsDaily = parseFloat($('._chiaDailyPlots').val() || 0);

                            _widAvg = _avg;
                            _widVal = 0.1 - _wallet;
                            _wid = 0;
                            _tenDays = 0;
                            while(_widVal>0 && _wid < 365){
                                _tenDays = 10;
                                _wid ++;
                                _widAvg *= _netspace;
                                _widAvg *= 1 / _plotsCur * (_plotsCur + _plotsDaily);
                                _plotsCur += _plotsDaily;
                                _widVal -= _widAvg;
                                $('<li>',{text:`Day ${_wid}: ${_widAvg.toFixed(8)} xch | ${_plotsCur.toFixed()} plots`}).appendTo('._chiaFuture');
                            }

                            if (_widVal<0){
                                while(_tenDays< 10){
                                    _tenDays ++;
                                    _widAvg *= _netspace;
                                    _widAvg *= 1 / _plotsCur * (_plotsCur + _plotsDaily);
                                    _plotsCur += _plotsDaily;
                                    _widVal -= _widAvg;
                                    $('<li>',{text:`Day ${_tenDays}: ${_widAvg.toFixed(8)} xch | ${_plotsCur.toFixed()} plots`}).appendTo('._chiaFuture');
                                }
                            }


                            _text.push(`Aprox. ${_daily} xch/day`);
                            _balance =  (Math.max(_wallet * _currentPrice * _conversion).toFixed(2));

                            _avg = (_currentPrice * _avg * _conversion).toFixed(2);

                            if(!$('._chiaExt').length){
                                $('<h5>',{class:'_chiaExt'}).appendTo('.h-menu-nav h4');
                            }

                            _text.push(`Aprox. ${_avg} ${_currency}/day`);

                            if(_wid){
                               _text.push(`Next withdrawal in ${_wid} days`);
                            }else{
                                _text.push(`You can withdrawal!`);
                            }

                            _text.push(`Balance: ${_balance} ${_currency}`);

                            $('._chiaExt').html(_text.join('<br>'));
                            $('._chiaActions').css('pointer-events','all');
                        };
                        _cb_loop = ()=>{
                            $.getJSON(`/api/pool/miningdetail?language=en&type=chia&count=100&page=${_page}`, json => {
                                _loopy = false;
                                json.data.list.forEach(ea=>{
                                    if(!ea.status){
                                        _loopy = true;
                                        _avg += parseFloat(ea.block_reward);
                                        _count ++;
                                        if(_mint === false || _mint > ea.record_time) _mint = ea.record_time;
                                        if(_maxt === false || _maxt < ea.record_time) _maxt = ea.record_time;
                                    }
                                });

                                if(_loopy){
                                    _page ++;
                                    _cb_loop();
                                }else{
                                    _cb_final();
                                }
                            });
                        };

                        _cb_loop();

                    });
                });

           });

        }
        if(!_rates){
            $.getJSON("https://www.floatrates.com/daily/usd.json", json => {

                if($('._chiaCurrency').is(':empty')){
                    $('._chiaCurrency').append($('<option>',{text:'USD',value:'usd'}))

                    Object.keys(json).forEach(ea=>{
                        $('._chiaCurrency').append($('<option>',{text:json[ea].code,value:ea}))
                    })
                    if (localStorage.getItem('currencyChia')){
                        $('._chiaCurrency').val(localStorage.getItem('currencyChia'))
                    } else {
                        $('._chiaCurrency').val('eur')
                    }

                }
                _rates = json;
                _cb_final();
            });
        }else{
            _cb_final();
        }
    }

    $(document)
    .on('click','._chiaRefresh',_chiaExt)
    .on('change','._chiaCurrency,._chiaNetpace',_chiaExt);
    _chiaExt();

})();
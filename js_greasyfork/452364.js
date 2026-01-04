// ==UserScript==
// @name         算分助手
// @namespace    sf.mmd.com
// @version      1.0.4
// @description  算分助手&菜区
// @author       mmd
// @icon        data:image/vnd.microsoft.icon;base64,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

// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/398240-gm-config-zh-cn/code/GM_lazyloadconfig_zh-CN.js

// @match      http*://*/htm_data/*.html
// @match      http*://*/htm_mob/*.html
// @match      http*://*/read.php*
// @match      http*://*/personal.php*
// @match      http*://*/post.php*
// @match      http*://*/thread0806.php*
// @match      http*://*t66y*/*
// @include    /https?://c\w\.\w+\.(icu|xyz|com)/index\.php/

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @license     LGPL-2.0-or-later
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/452364/%E7%AE%97%E5%88%86%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/452364/%E7%AE%97%E5%88%86%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var newVersion = 'v1.0';
    var localHref = window.location.href, disable_contextmenu = false, mouse_right_panel = null, img_src = null, asyncGMAPI = false, getValue, last_update = 0;
    var localTitle = document.title;

    var isMob = false;

    var game_data = [];
    var win_item = [];
    var cache_key = 'pf_game_data_';

    var tid = 0;
    var page = 0;

    var loading_gif = 'https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/loading00.gif';
    var boardBtn = '<a style="cursor:pointer;border:1px solid #A6CBE7;color:#2f5fa1;padding:2px 8px 2px 8px;float:right;margin-right:3px;" id="openBoard" title="">打开计分板</a>';
    let css = '.s3 a {color:#FA891B;} .hide {display:none!important;}';
    css += '#pf_board {font-size:14px; position: fixed; right: 10px; bottom: 250px;background: #FFF;border: 1px solid #A6CBE7;padding: 3px;} #pf_board .item {padding: 5px 0;} #pf_board .item .tm {display: inline-block;} #pf_board .item .code_short {width: 40px; margin-left: 3px;} #pf_board .item .code_medium {width: 60px; margin-left: 3px;}';
    css += '#pf_board .tools {padding:10px 0 0 0;} #pf_board .tools .right {float:right;padding-right:15px;}';
    css += '#pf_board .s3 {width:50px;text-align:center;display:inline-block;} #pf_board .check_half {width:80px;display:inline-block;}';
    css += '#pf_board .tm_a,#pf_board .tm_b {width:150px;display:inline-block;padding-left:10px;}';
    css += '#pf_tools_message {position: fixed;width: 300px; display:none; font-size:16px;background: #FFFFFF; padding: 15px;left: 45%; top: 30%;z-index: 999;border: 2px solid #ff9900;text-align: center;}';
    css += `#btn_pinfen {
    position: absolute;
    right: 50px;
    background: #008000;
    border-radius: 3px;
    padding: 10px 20px;
    color: #FFFFFF;
    margin: 0 auto;
    font-size: 20px;
    text-align: center;
    width: max-content;
    cursor: pointer;}`;
    css += `.points_tips {
    position: absolute;
    left: 250px;
    z-index:9999;
    background: #F4FBFF;
    border: #D4EFF7 1px solid;
    padding: 5px 1rem;
    margin: 0;
    bottom: -13px;
    text-align: center;
    }`;

    if (typeof GM_config == 'undefined') {
        alert('评分助手：GM_config库文件加载失败，脚本无法正常使用，请刷新网页重新加载！');
        return;
    } else {
        console.log('评分助手：相关库文件加载成功');
    };

    GM_addStyle(css);


    Date.prototype.format = function (fmt) {
        var args = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var i in args) {
            var n = args[i];
            if (new RegExp("(" + i + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
        }
        return fmt;
    }

    String.prototype.format = function(args) {
        if (arguments.length > 0) {
            var result = this;
            if (arguments.length == 1 && typeof(args) == "object") {
                for (var key in args) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            } else {
                for (var i = 0; i < arguments.length; i++) {
                    if (arguments[i] == undefined) {
                        return "";
                    } else {
                        var regex = new RegExp("({[" + i + "]})", "g");
                        result = result.replace(regex, arguments[i]);
                    }
                }
            }
            return result;
        } else {
            return this;
        }
    }

    function config() {
        var windowCss = '#Cfg .nav-tabs {margin: 15px 2px; text-align: center;} #Cfg .config_var textarea{width: 100%; height: 100px;resize: none;} #Cfg .inline {padding-bottom:0px;} #Cfg .config_header a:hover {color:#1e90ff;} #Cfg .config_var {margin:0;} #Cfg input[type="checkbox"] {margin: 3px 3px 3px 0px;} #Cfg input[type="text"] {width:100%; margin-top:5px;} #Cfg {background-color: #B1D3E0;} #Cfg .reset_holder {float: left; position: relative; bottom: -1em;} #Cfg .saveclose_buttons {margin: .7em;} #Cfg .section_desc {font-size: 10pt;} #Cfg_field_whiteTxt,#Cfg_field_blackPostTxt {height:60px!important;}';
        GM_registerMenuCommand('设置', opencfg);

        function opencfg() {
            GM_config.open();
        };
        GM_config.init(
            {
                id: 'Cfg',
                title: GM_config.create('a', {
                    //href: 'javascript:void(0);',
                    //target: '_blank',
                    textContent: '算分助手',
                    title: '版本：' + newVersion + ' 点击访问主页'
                }),
                isTabs: true,
                skin: 'tab',
                css: windowCss,
                frameStyle:
                {
                    height: '600px',
                    width: '500px',
                    zIndex: '2147483648',
                },
                fields:
                {
                    pinfenEnable:
                    {
                        section: ['算分助手'],
                        labelPos: 'right',
                        label: '启用算分助手',
                        type: 'checkbox',
                        'default': 1
                    },
                    zhiboCodeLM:
                    {
                        section: ['配置'],
                        'label': '赛事关键字',
                        'type': 'input',
                        'default': '賽事|赛事'
                    },
                    zhiboCodeTime:
                    {
                        'label': '时间关键字',
                        'type': 'input',
                        'default': '比賽時間|時間|比赛时间|时间'
                    },
                    zhiboCodeTa:
                    {
                        'label': '主队关键字',
                        'type': 'input',
                        'default': '主隊|主队|主'
                    },
                    zhiboCodePK:
                    {
                        'label': '让球关键字',
                        'type': 'input',
                        'default': '讓球|让球|让|讓|盘口'
                    },
                    zhiboCodeTb:
                    {
                        'label': '客队关键字',
                        'type': 'input',
                        'default': '客隊|客队|客'
                    },
                },
                events:
                {
                    save: function() {
                        GM_config.close();
                    }
                },
            });
    };

    config();
    var G = GM_config;

    if (localHref.match(/(cl\.|t66y|c\.)/) != null ){
        pageInit();
    }

    function pageInit() {

        if (localHref.match(/htm_mob\S*\.html/) != null ){
            isMob = true;
        }

       if((/read.php\?tid=(\d*)*/).test(localHref)){
            tid = getQueryVariable('tid');

            cache_key += '_' + tid;

            if((/page=(\d*)*/).test(localHref)){
                page = parseInt(getQueryVariable('page'));
            };

           console.log(localTitle);
           console.log((/\[(開盤|對賭|下注截止时|下注有效楼层)\]/).test(localTitle));

           if((/(\[開盤\]|\[對賭\]|下注截止时|下注有效楼层)/).test(localTitle) && !(/\[(直播)\]/).test(localTitle)){

               var tpc_content = $('#conttpc');
               $(tpc_content).css({position:'relative'});


               if(G.get('pinfenEnable'))
               {
                    if($('#btn_pinfen').length == 0)
                    {
                        $(tpc_content).prepend('<div id="btn_pinfen">提取算分信息</div>');
                    }
                    get_game_data();
               }

               $('#close_code').click(function(){
                   //updateBoardData();
                   $('#pf_board').hide();
               });


               $('#save_game').click(function(){
                   save_game();
               });


               $('#pf_board .tm [class^="tm_"]').click(function (){

                   let i = $(this).attr('i');

                   if(!$(this).hasClass('sred'))
                   {
                       $('#id_{0}_{1} .tm [class^="tm_"]'.format(tid, i)).removeClass('sred');
                       $(this).addClass('sred');
                       $('#id_{0}_{1} .tm [name=win_team]'.format(tid, i)).val($(this).text());
                   }
                   else
                   {
                       $('#id_{0}_{1} .tm [class^="tm_"]'.format(tid, i)).removeClass('sred');
                       $('#id_{0}_{1} .tm [name=win_team]'.format(tid, i)).val('走盘');
                   }


                   save_game();
               });
           }
        }

        $('#btn_pinfen').click(function() {
            get_game_info();
            location.href = location.href;
        });
    };

    function get_game_info()
    {
        var postid = 0;
        var fid = 23;
        var month = '';
        var game_name = $('.t.t2 tr.do_not_catch th:first b:first').text().trim();

        if((/[a-zA-z]+:\/\/[^\s]*\.html/).test(localHref)){
            postid = localHref.substring(localHref.lastIndexOf('/')+1, localHref.lastIndexOf('.'));
            var m = localHref.match(/\/(\d{4})\/(\d{2})\/(\d{6,})\.html/);

            month = m[1];
            fid = m[2];
        }

        if((/read.php\?tid=(\d*)*/).test(localHref)){
            postid = getQueryVariable('tid');
            tid = postid;

            if((/page=(\d*)*/).test(localHref)){
                page = getQueryVariable('page');
            };
        }

        var title = $('#conttpc').prevAll('h4.f16').text();
        var data = [];
        var idx = {};

        var trs = $('#conttpc table tr').not($('#conttpc table tr:has("td[colspan]")'));
        $.each($(trs).eq(0).find('td'), function(i,item) {

            //$(trs).eq(0);

            var tmp_head = $(item).text().trim();

            var key =eval('/'+ G.get('zhiboCodeLM') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.lm = i;
            }
            key =eval('/'+ G.get('zhiboCodeTime') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.time = i;
            }
            key =eval('/'+ G.get('zhiboCodeTa') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.ta = i;
            }
            key =eval('/'+ G.get('zhiboCodePK') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.pk = i;
            }

            key =eval('/'+ G.get('zhiboCodeTb') +'/');
            if(tmp_head.match(key) != null)
            {
                idx.tb = i;
            }
        });


        $.each(trs, function(i,item) {

            var game = {};
            var $td = $('td',item);
            if($td.length<3) return;
            game.time = '';
            game.bf = i == 0 ? '比分' : '比分'+i;
            game.win = '走盘';
            game.half = 0;

            if(idx.time > -1)
            {
                game.time = $td.eq(idx.time).text().trim();
            }
            //game.lm = $td.eq(idx.lm).text().trim();
            game.ta = $td.eq(idx.ta).text().trim();
            game.pk = $td.eq(idx.pk).text().trim();
            game.tb = $td.eq(idx.tb).text().trim();
            game.pi = tid;

            game.tid = '{0}_{1}'.format(postid,i);
            game.bf_a = '';
            game.bf_b = '';
            game.state = '';
            game.checked = '';
            game.half_show = '';
            game.css_a = '';
            game.css_b = '';

            if(game.lm+game.ta == '') return;
            data.push(game);
        });

        var new_data = [];


        var cache_key = 'pf_game_data_' + postid;
        localStorage.setItem(cache_key, JSON.stringify(data));
        get_game_data();
    }

    function get_game_data(){
        if($('#pf_board').length == 0)
        {
             $('body').append('<div id="pf_board"></div>');
           // $('form[action^="post.php"] .t').css({position: 'relative'}).append('<div id="zhibo_board"></div>')
        }
        var game_data = getBoardData();

        if(game_data == '' || game_data == null || game_data.length == 0)
        {
           get_game_info();
        }

        game_data = JSON.parse(game_data);

        //console.log(data);
        var htm_tmp = '<div id="id_{pi}_{index}" pi="{pi}" i="{index}" class="item">{index}.<span class="tm"><span class="tm_a {css_a}"  i="{index}">{ta}</span> <span class="s3">{pk}</span> <span class="tm_b {css_b}" i="{index}">{tb}</span><span class="check_half {half_show}"><input class="check" {checked} type="checkbox">赢半</span>';
        htm_tmp += '<input type="hidden" value="{ta}" name="ta"><input type="hidden" value="{tb}" name="tb"><input type="hidden" value="{pk}" name="pk"><input type="hidden" value="{tid}" name="tid"><input type="hidden" value="{half}" name="half"><input type="hidden" value="{win}" name="win_team">';
        htm_tmp += '</div>'


        var htm_pk_tmp = '<div class="item pk">{0}</div>';

        var htm = '';
        var key =eval('/'+ G.get('zhiboCodeTa') +'/');
        $.each(game_data, function(index, item){
            if(item.ta.match(key) != null)
            {
                return
            }

            item.half_show = item.pk.indexOf('/')>-1 ? '' : 'hide';
            item.css_a = (item.win == item.ta ? 'sred' : '');
            item.css_b = (item.win == item.tb ? 'sred' : '');

            item.index = index;
            htm += htm_tmp.format(item);
        });

        htm += '<div class="tools"><input type="button" id="save_game" value="保存（算分)"><!--input type="button" id="simple_code" value="简易代码"> <input type="button" id="rich_code" value="花里胡哨"> <span class="right"><input type="button" id="clear_data" value="清空数据"> <input type="button" id="close_code" value="关闭"--></div>';

        $('#pf_board').html(htm).show();
    }

    function save_game()
    {
        win_item = [];
        new_data = [];
        game_data = JSON.parse(getBoardData());
        var data = {};
        var new_data = [];
        $.each($('#pf_board .item'), function(index, item){
            data = {};
            data.pi = $(item).attr('pi');
            data.index = $(item).attr('i');
            data.ta = $('input[name=ta]', item).val();
            data.tb = $('input[name=tb]', item).val();
            data.pk = $('input[name=pk]', item).val();
            data.state = $('input[name=state]', item).val();
            data.bf_a = $('input[name=bf_a]', item).val();
            data.bf_b = $('input[name=bf_b]', item).val();
            data.win = $('input[name=win_team]', item).val();
            data.tid = $('input[name=tid]', item).val();
            data.checked = $('input:checkbox', item).get(0).checked ? 'checked' : '';

            data.half = data.checked == '' ? 0 : 1;

            var win = {};
            win.idx = index;
            win.team = data.win;
            win.half = data.half;
            win.ratio = 1;

            var m = win.team.match(/\[\S+\]/);
            //console.log(m);
            if(m != null)
            {
                win.ratio = parseFloat(m[0].replace('[','').replace(']','').trim(),0).toFixed(2);
            }

            data.css_a = (data.win == data.ta ? 'sred' : '');
            data.css_b = (data.win == data.tb ? 'sred' : '');

            win_item.push(win);
            //console.log($('input[name=win_team]', item).val());
            new_data.push(data);
        });

        game_data = new_data;


        game_data = new_data;
        //console.log(JSON.stringify(game_data));
        //console.log(JSON.stringify(game_data));
        setBoardData(game_data);

        settle_up();
    }


    var points_tips = '<div class="points_tips">{0}</div>';
    //保存
    function settle_up(){
        console.log(JSON.stringify(win_item));

        $.each($("div[id^='cont']:not(#conttpc)"), function(i, bet) {
            var ratio = 0;
            var points = 0;
            var bet_points = 0;


            var bet_html = $(bet).html().replaceAll('>','>\r\n');
            var re_bet=/下注(球|选)(\S)(：|:)\s*(?<team>.*?)<br/g;
            var points_bet=/(下注点数|下註點數|點數|点数)(：|:)\s*(?<points>\d+)/;

            var mp = bet_html.match(points_bet);
            if(mp!= null)
            {
                bet_points = parseInt(mp.groups['points'].trim());
            }

            //console.log(mp);

            var ms = bet_html.match(re_bet);

            $.each(ms, function(k, m){
                var win = win_item[k];
                var half = win.half > 0 ? 0.5 : 1;

                var mc = m.match(/下注(球|选)(\S)(：|:)\s*(?<team>.*?)<br/);
                if(mc != null)
                {
                    var bet_item = mc.groups['team'].trim();
                    if(win.team=='走盘') return;
                    if(bet_item == '') return;

                    if(bet_item==win.team)
                    {
                        ratio += win.ratio * half;
                    }
                    else
                    {
                        if(!/冲刺赛/.test(localTitle))
                        {
                            ratio -= 1 * half;
                        }
                    }

                }
            });

            //console.log(bet_points + ' / ' + ratio.toFixed(2) + ' / ' + (bet_points*ratio).toFixed(2));
            points = Math.round(bet_points*ratio);

            var tips = $('.points_tips', bet);
            $(bet).css({position:'relative'});
            if($(tips).length == 0)
            {
                $(bet).append(points_tips.format(points));
            }
            else
            {
                $(tips).text(points);
            }
        })
    }




    //获取计分板缓存数据
    function setBoardData(data)
    {
        if(typeof(data) != 'string')
        {
            data = JSON.stringify(data);
        }
        var cache_key = 'pf_game_data_' + tid;
        return localStorage.setItem(cache_key, data);
    }

    //获取计分板缓存数据
    function getBoardData()
    {
        var cache_key = 'pf_game_data_' + tid;
        return localStorage.getItem(cache_key);
    }


    ///提示消息，定时关闭，默认秒
    function message(msg, time)
    {
        var msgbox = $('#pf_tools_message');
        if($(msgbox).length == 0)
        {
            $('body').append('<div id="zhibo_tools_message"></div>');
            $('#pf_tools_message').click(function() { $(this).hide();});
        }
        msgbox = $('#pf_tools_message');

        let win_width = $(window).width();

        let left = (win_width - $(msgbox).width())/2;

        $(msgbox).css({left:left}).html(msg).show();

        if(typeof(time) == 'number')
        {
            clearTimeout(st);
            var st = setTimeout(function() {
                $('#pf_tools_message').hide();
            }, time*1000);
        }
    }


    function getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }

    function addStyle(css) {
        var pi = document.createProcessingInstruction(
            'xml-stylesheet',
            'type="text/css" href="data:text/css;utf-8,' + encodeURIComponent(css) + '"'
        );
        return document.insertBefore(pi, document.documentElement);
    }
})();
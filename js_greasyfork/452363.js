// ==UserScript==
// @name         小草助手
// @namespace    mmd.com
// @version      1.3.4
// @description  小草访问优化&菜区小助手
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
// @downloadURL https://update.greasyfork.org/scripts/452363/%E5%B0%8F%E8%8D%89%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/452363/%E5%B0%8F%E8%8D%89%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var newVersion = 'v1.3';
    var localHref = window.location.href, disable_contextmenu = false, mouse_right_panel = null, img_src = null, asyncGMAPI = false, getValue, last_update = 0;
    var localTitle = document.title;

    var blackList = ''.split(',');
    var spamList = ''.split(',');
    var whiteList = ''.split(',');
    var blackPostList = ''.split(',');
    var userName = '';
    var isMob = false;

    var zhibo_board_data = [];
    var zhibo_board_htm = '';
    var zhibo_board_reply;

    var loading_gif = 'https://cdn.jsdelivr.net/gh/zxf10608/JavaScript/icon/loading00.gif';
    var clearImgBtn = '<a style="cursor:pointer;border:1px solid #A6CBE7;color:#2f5fa1;padding:2px 8px 2px 8px;float:right;" id="clearImg" title="">整理图片</a>';
    var boardBtn = '<a style="cursor:pointer;border:1px solid #A6CBE7;color:#2f5fa1;padding:2px 8px 2px 8px;float:right;margin-right:3px;" id="openBoard" title="">打开计分板</a>';
    let css = '.s3 a {color:#FA891B;} .hide {display:none;}';
    css += '#zhibo_board { position: fixed; right: 10px; bottom: 150px;background: #FFF;border: 1px solid #A6CBE7;padding: 3px;} #zhibo_board .item {padding: 5px 0;} #zhibo_board .item .tm {width: 250px;display: inline-block;} #zhibo_board .item .code_short {width: 40px; margin-left: 3px;} #zhibo_board .item .code_medium {width: 60px; margin-left: 3px;}';
    css += '#zhibo_board .tools {padding:10px 0 0 0;} #zhibo_board .tools .right {float:right;padding-right:15px;}';
    css += '#zhibo_tools_message {position: fixed;width: 300px; display:none; font-size:16px;background: #FFFFFF; padding: 15px;left: 45%; top: 30%;z-index: 999;border: 2px solid #ff9900;text-align: center;}';
    css += '#htmlarea,#textarea{height:500px!important;}';
    if (typeof GM_config == 'undefined') {
        alert('小草助手：GM_config库文件加载失败，脚本无法正常使用，请刷新网页重新加载！');
        return;
    } else {
        console.log('小草助手：相关库文件加载成功');
    };

    GM_addStyle(css);

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
                    textContent: '小草助手',
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
                    readEnable:
                    {
                        section: ['内容页'],
                        labelPos: 'right',
                        label: '启用内容页优化',
                        type: 'checkbox',
                        'default': 1
                    },
                    likeFixEnable:
                    {
                        labelPos: 'right',
                        label: '启用主题点赞按钮浮动',
                        type: 'checkbox',
                        'default': 1
                    },
                    whiteFloor:
                    {
                        'label': '保留楼层（半角逗号 , 分割）',
                        'type': 'input',
                        'default': ''
                    },
                    spamTxt:
                    {
                        'label': '屏蔽内容（完整匹配回复内容）',
                        'type': 'textarea',
                        'default': '1024,1025,1026,1021,10024,1024感谢分享,多谢分享,感谢分享,感谢你的分享,感谢大佬分享,感谢分享~,谢谢分享,感謝分享,发码好人,1024.,感谢分享！,感谢分享。,经典,路过,支持分享,路过看一下,继续继续,勿忘提肛'
                    },
                    blackPostTxt:
                    {
                        'label': '黑名单ID（回复楼层不显示）',
                        'type': 'textarea',
                        'default': ''
                    },
                    whiteTxt:
                    {
                        'label': '白名单ID',
                        'type': 'textarea',
                        'default': ''
                    },
                    listEnable:
                    {
                        section: ['列表页'],
                        labelPos: 'right',
                        label: '启用列表页优化',
                        type: 'checkbox',
                        'default': 1
                    },
                    blackTxt:
                    {
                        'label': '黑名单ID（列表页不显示）',
                        'type': 'textarea',
                        'class': 'line',
                        'default': ''
                    },
                    zhiboEnable:
                    {
                        section: ['菜区助手'],
                        labelPos: 'right',
                        label: '启用直播助手',
                        type: 'checkbox',
                        'default': 1
                    },
                    zhiboCodeKey:
                    {
                        'label': '提取代码匹配关键字',
                        'type': 'input',
                        'default': '開盤|對賭|下注有效楼层'
                    },
                    boardTemplate:
                    {
                        'label': '计分板简易代码',
                        'type': 'textarea',
                        'default': '{ta}　{pk}　{tb}\r\n比分：{bf_a} - {bf_b}　　{state}\r\n\r\n'
                    },
                    boardRichTemplate:
                    {
                        'label': '计分板花里胡哨代码',
                        'type': 'textarea',
                        'default': '[color=green]{ta}[/color]　[color=#FF6600]{pk}[/color]　[color=green]{tb}[/color]  [color=orange]{state}[/color]\r\n[size=4][backcolor=blue][color=white]　{bf_a}　[/color][/backcolor]　-　[backcolor=blue][color=white]　{bf_b}　[/color][/backcolor][/size]\r\n'
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
                        //location.reload();
                    }
                },
            });
    };

    config();
    var G = GM_config;
    spamList = G.get('spamTxt').split(',');
    whiteList = G.get('whiteTxt').split(',');
    blackList = G.get('blackTxt').split(',');
    blackPostList = G.get('blackPostTxt').split(',');

    if (localHref.match(/(cl\.|t66y|c\.)/) != null ){
        pageInit();
    }

    function pageInit() {
        userName = $.trim($('.guide span').text());
        whiteList.push(userName);

        if (localHref.match(/htm_mob\S*\.html/) != null ){
            isMob = true;
        }

        if(G.get('listEnable'))
        {
            listFix();
        }


        if(G.get('readEnable'))
        {
            postFix();
        }

        if(G.get('zhiboEnable'))
        {
            zhiboTools();

            if(localStorage.getItem('zhibo_board_open') == '1')
            {
                /*
                var data = localStorage.getItem('zhibo_data_board');

                if(data != '' && data != null)
                {
                    setTimeout(zhiboBoard, 500);
                }
                */
            }
        }

        if (localHref.match(/post\.php/) != null ){
            $('a[onclick^=checklength]').parent().append(clearImgBtn).append(boardBtn);
            $('#clearImg').click(clearImg);

            $('#openBoard').click(zhiboBoard);


            var title_input = $('#atc_title');

            if(title_input != null)
            {
                $(title_input).parent().html('<textarea name="atc_title" class="input" style="font: 14px Tahoma; padding-left:2px;height:60px;width:100%" id="atc_title">'+$(title_input).val()+'</textarea>');
            }
        }

        personalFix();
    };

    function zhiboTools()
    {
        var key =eval('/'+ G.get('zhiboCodeKey') +'/');
        var zhiboBtn = '<div class="t_like" id="zhibo_btn" style="position: fixed; top: 220px; right: 20px;">提取代码</div>';
        zhiboBtn += '<textarea id="zhibo_code" style="width:160px;height:200px;position: fixed;right:20px;top:284px;display: none;"></textarea>'
        if (localTitle.match(key) != null){ // localTitle.match(/對賭/) != null || localTitle.match(/下注有效楼层/) != null
            $('#conttpc').append(zhiboBtn);
            $('#zhibo_btn').click(getZhiboCode);
        }
    }


    function get_zhibo_data(){
        for(var key in localStorage){

        }
    }


    //生成计分板
    function zhiboBoard(){
        localStorage.setItem('zhibo_board_open', '1');
        if($('#zhibo_board').length == 0)
        {
             $('body').append('<div id="zhibo_board"></div>');
           // $('form[action^="post.php"] .t').css({position: 'relative'}).append('<div id="zhibo_board"></div>')
        }
        var data = getBoardData();
        data = JSON.parse(data);

        if(data == '' || data == null || data.length == 0)
        {
            message('木有提取到比赛信息，先去开盘贴提取代码再来生成计分板', 5);
            return;
        }

        //console.log(data);
        var htm_tmp = '<div id="id_{pi}_{index}" pi="{pi}" i="{index}" class="item"><input class="check" {checked} type="checkbox"><span class="tm"><span class="tm_a">{ta}</span> <span class="s3">{pk}</span> <span class="tm_b">{tb}</span></span> <span class="bf">比分：<input type="text" class="code_short" placeholder="比分" value="{bf_a}" name="bf_a"> - <input type="text" class="code_short" placeholder="比分" name="bf_b" value={bf_b}><input type="text" class="code_medium" placeholder="进度" name="state" value="{state}"></span>';
        htm_tmp += ' <span class="delete">删</span>';
        htm_tmp += '<input type="hidden" value="{ta}" name="ta"><input type="hidden" value="{tb}" name="tb"><input type="hidden" value="{pk}" name="pk"><input type="hidden" value="{tid}" name="tid">';
        htm_tmp += '</div>'


        var htm_pk_tmp = '<div class="item pk">{0}</div>';

        var htm = '';
        $.each(data, function(pi, pd){
            if(countItem(pd.items)>0)
            {
                htm += htm_pk_tmp.format(cutTitle(pd.title));
            }
             $.each(pd.items, function(index, item){
                 item.index = index;
                 item.pi = pi;
                 if(item.deleted==0)
                 {
                     htm += htm_tmp.format(item);
                 }
            });
        });

        htm += '<div class="tools"><input type="button" id="simple_code" value="简易代码"> <input type="button" id="rich_code" value="花里胡哨"> <span class="right"><input type="button" id="clear_data" value="清空数据"> <input type="button" id="close_code" value="关闭"></div>';

        zhibo_board_htm = htm;
        $('#zhibo_board').html(htm).show();

        $('#close_code').click(function(){
            updateBoardData();
            $('#zhibo_board').hide();
        });

        $('#clear_data').click(function() {
            if (confirm("确认清空记分板数据?")==true) {
                localStorage.removeItem('zhibo_data_board', '');
                for(var key in localStorage){
                   if(key.indexOf('zhibo_data_') > -1)
                   {
                       localStorage.removeItem(key);
                   }
                }
                $('#zhibo_board').hide();
                localStorage.removeItem('zhibo_board_open');
            }
        });

        $('#zhibo_board .tm_a,#zhibo_board .tm_b').click(function (){



        });


        $('#zhibo_board .item .delete').click(function(){

            //if (confirm("确认删除此项?")==true) {
            /*
            clearTimeout(st);
            var st =  setTimeout(updateBoardData, 2000);
            */

            var data = getBoardData();
            data = JSON.parse(data);
            var pi = $(this).parent().attr('pi');
            var i = $(this).parent().attr('i');

            data[pi].items[i].deleted = 1;
            /*
            if(data[pi].items.length == 0)
            {
                data.splice(pi,1);
            }
            */

            setBoardData(data);

            $(this).parent().remove();
            //}
        });

        var board_code = '';

        zhibo_board_reply = $('textarea[name=atc_content]');

        $('#rich_code').click(function() {
            board_code = '\r\n';
            var board_code_tmp = G.get('boardRichTemplate');

            if(board_code_tmp == null)
            {
                board_code_tmp = '[color=green]{ta}[/color]　[color=#FF6600]{pk}[/color]　[color=green]{tb}[/color]  [color=orange]{state}[/color]\r\n';
                board_code_tmp += '[size=4][backcolor=blue][color=white]　{bf_a}　[/color][/backcolor]　-　[backcolor=blue][color=white]　{bf_b}　[/color][/backcolor][/size]\r\n';
            }

            /*
            $.each(zhibo_board_data, function(index, item){
                if(item.checked == 'checked')
                {
                    board_code += board_code_tmp.format(item);
                }
            });
            */


            setPost(board_code_tmp, zhibo_board_reply);
        });

        $('#simple_code').click(function(){
            board_code = '\r\n';
            var board_code_tmp = G.get('boardTemplate');
            if(board_code_tmp == null)
            {
                board_code_tmp = '{ta}　{pk}　{tb}\r\n比分：{bf_a} - {bf_b}　　{state}\r\n\r\n';
            }

            setPost(board_code_tmp, zhibo_board_reply);

        });
    }

    function setPost(board_code_tmp, zhibo_board_reply)
    {
        var board_code = '';
        updateBoardData();
        $.each(zhibo_board_data, function(pi, pd){
            if(countChecked(pd.items)==0) return;
            var title = cutTitle(pd.title);
            title = title.substring(0,title.lastIndexOf(']')+1);
            board_code += '\r\n{0}\r\n'.format(title);

            $.each(pd.items, function(index, item){
                if(item.checked == 'checked' && item.deleted == 0)
                {
                    board_code += board_code_tmp.format(item);
                }
            });
        });

        $(zhibo_board_reply).val(board_code);
    }

    function countChecked(items){
        var count = 0;
         $.each(items, function(index, item){
            if(item.deleted == 1) return;
            if(item.checked == 'checked')
            {
                count ++;
            }
        });

        return count;
    }

    function countItem(items){
        var count = 0;
         $.each(items, function(index, item){
            if(item.deleted == 1) return;
            count ++;
        });

        return count;
    }

    function cutTitle(title)
    {
        if(typeof(title) != 'string') return '';
        title = title.replace(/\s*/g,'').replace(/(\[開盤\])/,'');;
        title = title.substring(0,title.indexOf('下注'));
        return title;
    }

    //更新计分板数据
    function updateBoardData()
    {
        //不重置，保证加入多盘信息
        //zhibo_board_data = [];
        //console.log(JSON.stringify(zhibo_board_data));
        zhibo_board_data = JSON.parse(getBoardData());
        var data = {};
        var new_index = [];
        $.each($('#zhibo_board .item:not(".pk")'), function(index, item){
            data = {};
            data.pi = $(item).attr('pi');
            data.index = $(item).attr('i');
            data.ta = $('input[name=ta]', item).val();
            data.tb = $('input[name=tb]', item).val();
            data.pk = $('input[name=pk]', item).val();
            data.state = $('input[name=state]', item).val();
            data.bf_a = $('input[name=bf_a]', item).val();
            data.bf_b = $('input[name=bf_b]', item).val();
            data.tid = $('input[name=tid]', item).val();
            data.checked = $('input:checkbox', item).get(0).checked ? 'checked' : '';

            new_index.push('{0}_{1}'.format(data.pi, data.index));

            //zhibo_board_data.push(data);

            //console.log(typeof(data.bf_a) + '_____' + (zhibo_board_data[data.pi].items[data.index] == null));

            if(typeof(data.bf_a) == 'string')
            {
                zhibo_board_data[data.pi].items[data.index].bf_a = data.bf_a;
                zhibo_board_data[data.pi].items[data.index].bf_b = data.bf_b;
                zhibo_board_data[data.pi].items[data.index].state = data.state;
                zhibo_board_data[data.pi].items[data.index].checked = data.checked;
            }
        });

        //var new_board = [];
        //new_board = clone(zhibo_board_data);
        $.each(zhibo_board_data, function(i, d){
            $.each(d.items, function(index, item){
                if(!new_index.includes('{0}_{1}'.format(i,index)))
                {
                    item.deleted = 1;
                }
            });
        });

        setBoardData(zhibo_board_data);
    }

    function clone(obj)
    {
        return JSON.parse(JSON.stringify(obj));
    }

    //获取计分板缓存数据
    function setBoardData(data)
    {
        if(typeof(data) != 'string')
        {
            data = JSON.stringify(data);
        }
        return localStorage.setItem('zhibo_data_board', data);
    }

    //获取计分板缓存数据
    function getBoardData()
    {
        return localStorage.getItem('zhibo_data_board');
    }

    //提取直播代码（计分板数据） 直播主题表格代码
    function getZhiboCode()
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
        }

        var title = $('#conttpc').prevAll('h4.f16').text();
        var data = [];
        var idx = {};

        $('#zhibo_code').css({width:$('#t_like').width()});

        var trs = $('#conttpc table tr').not($('#conttpc table tr:has("td[colspan]")'));
        $.each($(trs).eq(0).find('td'), function(i,item) {
            //console.log($(item).text());
            var tmp_head = $(item).text().trim();
            /*
            console.log(tmp_head.match(/让球/));
            switch(tmp_head)
            {
                case '比賽時間':
                case '比赛时间':
                    idx.time = i;
                    break;
                case '賽事':
                case '赛事':
                    idx.lm = i;
                    break;
                case '主隊':
                case '主队':
                    idx.ta = i;
                    break;
                case '客隊':
                case '客队':
                    idx.tb = i;
                    break;
                case '讓球':
                case '让球':
                    idx.pk = i;
                    break;
            }*/
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

        //不重置，支持多盘数据，需要手动删除或清空
        //zhibo_board_data = JSON.parse(localStorage.getItem('zhibo_data_board'));
        var board = {};
        board.tid = postid;
        board.fid = fid;
        board.month = month;
        board.title = title;
        board.duidu = localTitle.match(/對賭|对赌"/) != null;
        board.zhuang = '';
        board.cai = '';
        board.items = [];

        if(board.duidu)
        {

           //console.log($('#conttpc').html());
           //var mc = $('#conttpc').text().match(/(楼主|庄家)走\s{0,}(\S*?)\s{0,}[，|,]/);
           var mc = $('#conttpc').html().match(/下注(球|选)(\S)(：|:)(?<team>\S*)<br/);
           if(mc != null)
           {
               board.cai = mc.groups['team'].trim();
           }

        }
        console.log(board.zhuang);

        $.each(trs, function(i,item) {

            var game = {};
            var $td = $('td',item);
            if($td.length<3) return;
            game.time = i == 0 ? '开赛时间' : (new Date()).format('yyyy.MM.dd 待定'+i);
            game.bf = i == 0 ? '比分' : '比分'+i;
            game.win = i == 0 ? '赢盘球队' : '赢盘'+i;

            if(idx.time > -1)
            {
                game.time = $td.eq(idx.time).text().trim();
            }
            game.lm = $td.eq(idx.lm).text().trim();
            game.ta = $td.eq(idx.ta).text().trim();
            game.pk = $td.eq(idx.pk).text().trim();
            game.tb = $td.eq(idx.tb).text().trim();

            //console.log(JSON.stringify(board));
            //console.log(JSON.stringify(game));
            if(board.cai.length > 0)
            {
                board.zhuang = board.cai==game.ta ? game.tb : game.ta;

                game.ta = (game.ta==board.zhuang ? "[庄]" : "") + game.ta;
                game.tb = (game.tb==board.zhuang ? "[庄]" : "") + game.tb;
            }

            game.tid = '{0}_{1}'.format(postid,i);
            game.bf_a = '';
            game.bf_b = '';
            game.state = '';
            game.checked = 'checked';
            game.deleted = 0;

            if(game.lm+game.ta == '') return;
            data.push(game);

            if(i > 0)
            {
                board.items.push(game);

                //var new_data = zhibo_board_data;
                /*
                if(zhibo_board_data.length == 0)
                {
                    zhibo_board_data.push(board);
                }
                else
                {
                    console.log(zhibo_board_data.length);
                    $.each(zhibo_board_data, function(bi, bd){
                        if(bd.tid == board.tid)
                        {
                            //console.log(bd.tid == board.tid);
                            //zhibo_board_data.splice(bi,1);
                        }
                    });


                    zhibo_board_data.push(board);
                }
                */
                //zhibo_board_data = new_data;
                //console.log(JSON.stringify(zhibo_board_data));
            }
        });

        //console.log(JSON.stringify(board));
        zhibo_board_data = JSON.parse(getBoardData());

        var new_data = [];
        $.each(zhibo_board_data, function(bi, bd){
            //console.log(bd.tid + '___' + bi);
            //console.log(bd.tid == board.tid);
            if(bd.tid != board.tid)
            {
                new_data.unshift(bd);
                //delete zhibo_board_data[bi];
                //zhibo_board_data.splice(bi, 1);
                //console.log(JSON.stringify(zhibo_board_data[bi]));
            }
        });

        new_data.push(board);


        /*
        data.sort((a,b)=>{
            return a.tid-b.tid;
        });
        */
        new_data.sort((a,b)=>{
            return a.tid-b.tid;
        });

        var cache_key = 'zhibo_data_' + postid;
        localStorage.setItem(cache_key, JSON.stringify(data));
        cache_key = 'zhibo_data_board';
        localStorage.setItem(cache_key, JSON.stringify(new_data));
        //console.log(cache_key+'_2');

        var html = '';//'[align=center][b][color=red][size=4]{0}[/size][/color][/b][/align]\r\n'.format(title);

        //楼主走

        html += '[table]'; //\r\n
        //[tid=5228787-23-2208]标题[/tid]
        /*
        if(board.zhuang.length > 0)
        {    }
        else
        {
            html += '[tr][td=7,1] [align=center][b][color=red][size=4]{0}[/size][/color][/b][/align] [/td][/tr]'.format(title); //
        }*/
        html += '[tr][td=7,1] [align=center][b][color=red][size=4]{0}[/size][/color][/b]\r\n[tid={1}-{2}-{3}]{4}[/tid][/align] [/td][/tr]'.format(title, board.tid, board.fid,board.month, game_name); //
    
        var template1 = '[tr]';//\r\n
        template1 += '[td][align=center][b][color=orange][size=3]{lm}[/size][/color][/b][/align][/td]';
        template1 += '[td][align=center][b][color=purple][size=3]{time}[/size][/color][/b][/align][/td]';
        template1 += '[td][align=center][b][color=green][size=3]{ta}[/size][/color][/b][/align][/td]';
        template1 += '[td][align=center][b][color=red][size=3]{pk}[/size][/color][/b][/align][/td]';
        template1 += '[td][align=center][b][color=green][size=3]{tb}[/size][/color][/b][/align][/td]';
        template1 += '[td][align=center][b][color=red][size=3]{bf}[/size][/color][/b][/align][/td]';
        template1 += '[td][align=center][b][color=blue][size=3]{win}[/size][/color][/b][/align][/td]';
        template1 += '[/tr]'; //
        $.each(data, function(i, item){
            if (i==0)
            {
                html += template1.replace(/\[color\=.*?\]/g, '[color=purple]').format(item);
            }
            else
            {
                html += template1.format(item);
            }
        });

        html += '[/table]'

        $('#zhibo_code').val(html).show();
        GM_setClipboard(html,'text');

        message('神秘代码已提取，试试Ctrl+V。<br />计分板数据已更新，直播可用。', 3);
        //console.log(html); //JSON.stringify(data)
    }

    function postFix(){
        if (localHref.match(/htm_(data|mob)\S*\.html|read\.php\?/) != null ){

            isMob = $('.banner h3').length>0;

            var $t_like = $('.t_like');
            if($t_like.length>0)
            {
                var $t_like_top = $t_like.offset().top;
                //console.log($t_like.offset());
                //点赞浮动
                if(G.get('likeFixEnable'))
                {
                    $t_like.css({position: "fixed", top: 580, right: 20});
                }
                $(window).scroll(function(event){

                });

                $(window).resize(function() {
                    //$t_like.css({left: $('#conttpc').offset().left-135});
                });
            }



            var save_code_btn = '<input type="button" class="s1" id="save_code" value="保存">';
            var set_code_btn = ' <input type="button" class="s1" id="set_code" value="载入">';
            var open_board_btn = ' <input type="button" class="s2" style="margin-left:20px;" id="open_board" value="计分板">';
            var content = $('textarea[name=atc_content]');


            //$('#atc_title').parent().html('<textarea name="atc_title" class="input" style="font: 14px Tahoma; padding-left:2px;height:60px;width:100%" id="atc_title">'+$('#atc_title').val()+'</textarea>');

            if(content != null)
            {
                $('textarea[name=atc_content]').prev('div').append(save_code_btn).append(set_code_btn).append(open_board_btn);
                //$('input[name=Submit]').parent().append(open_board_btn);

                $('#open_board').click(function() {
                    zhiboBoard();
                });

                $('#save_code').click(function(){
                    var code = $(content).val();
                    if(code != null)
                    {
                        var code_cache = localStorage.getItem('reply_code');
                        if(code_cache != null && code_cache != '' && code_cache != code)
                        {
                             if (confirm("更新已保存代码?")==true) {
                                 localStorage.setItem('reply_code', code);
                             }
                        }
                        else
                        {
                            localStorage.setItem('reply_code', code);
                        }
                    }
                });

                $('#set_code').click(function(){
                    var code = localStorage.getItem('reply_code');

                    //var content = $('textarea[name=atc_content]');

                    //console.log($(content).val());

                    if(code != null)
                    {
                        var txt = $.trim($(content).val());
                        $(content).val((txt != null ? txt + '\r\n' : '') + code);
                    }
                });
            }

            $('.post_comm_face').each(function(){
                var $li = $(this).parent();
                //var tpc_author = $li.next().find('span a:first').text();
                //console.log($li.html());
                var tpc_author = isMob ? $li.next().find('.gray:first').text() : $li.next().find('span[style] a:first').text();
                $li.html('<a href="/@' + tpc_author + '" target="_blank">' + $li.html() + '</a>');
            })

            $('body .t').each(function(i, item){
                var tpc_content = $.trim($('.tpc_content', this).text());
                var tpc_auther_html = $('.tr1 th:first b:first', this);
                var tpc_author = $.trim($('.tr1 th:first b:first', this).text()).replace(/\s\S*/,'');
                var tpc_floor = $.trim($('.tipad .s3', this).text()).replace(/[^0-9]/ig,'');

                //$(tpc_auther_html).html()
                if(tpc_author){
                    var link = '<a href="/@' + tpc_author + '" target="_blank">' + tpc_author + '</a>';
                    var tmp = $('.tr1 th:first b:first', this).html();
                    tmp = tmp.replace(tpc_author, link);
                    $('.tr1 th:first b:first', this).html(tmp);
                }

                if($.inArray(tpc_floor, G.get('whiteFloor').split(','))>-1)
                {
                    return true;
                }

                if($.inArray(tpc_author, whiteList)>-1)
                {
                    return true;
                }
                //console.log(i);

                if($.inArray(tpc_author, blackPostList)>-1 && tpc_author.length>0 && i>1)
                {
                    $(this).remove();
                }

                if($('.post_comm', this).length>0)
                {
                    return true;
                }

                if($.inArray(tpc_content, spamList)>-1 && localTitle.match('博彩區') == null)
                {
                    $(this).remove();
                }
            });


            $('.tpc_cont').parent().each(function(){
                var tpc_content = $.trim($('.tpc_cont', this).text());
                var tpc_author = $('.tpc_detail:first li', this).html().replace(/(\S*)<.*/,'$1');
                //tpc_author = tpc_author.substring(0, tpc_author.indexOf('#'));
                //console.log(tpc_author);

                if(tpc_author){
                    var link = '<a href="/@' + tpc_author + '" target="_blank">' + tpc_author + '</a>';
                    var tmp = $('.tpc_detail:first li', this).html();
                    tmp = tmp.replace(tpc_author, link);
                    $('.tpc_detail:first li', this).html(tmp);
                }


                if($.inArray(tpc_author, whiteList)>-1)
                {
                    return true;
                }

                if($('.post_comm', this).length>0)
                {
                    return true;
                }

                if($.inArray(tpc_content, spamList)>-1)
                {
                    $(this).next('.tpc_line').remove();
                    $(this).prev('.tpc_face').remove();
                    $(this).prev('a[name]').remove();
                    $(this).remove();
                }
            });
        }
    }

    function listFix() {
        if (localHref.match(/thread0806\.php\?fid=/) != null ){
            $('#tbody tr').each(function(){
                var poster = $.trim($('a.bl', this).text());

                if($.inArray(poster, blackList)>-1)
                {
                    //console.log(poster);
                    $(this).remove();
                }
            });

            $('.list.t_one').each(function(){
                var poster = $.trim($('.f10.fl', this).text());
                poster = poster [0];
                if($.inArray(poster, blackList)>-1)
                {
                    $(this).remove();
                }
            });
        }
    }

    function clearImg()
    {
        var txt = $('#textarea').val();
        txt = txt.replace(/\[url(.*?)\](.*?)\[\/url\](\s{0,2})/gi,'$2\n');
        //txt = txt.replace(/(\r\n){2,}/g,'\r\n');
        $('#textarea').val(txt);
    }

    function personalFix(){
        if (localHref.match(/personal.php/) == null ){
            return;
        }

        $('#main div.t3:eq(1) table td div.t:eq(1) tr.tr3').each(function() {
            var $tr = $(this);

            var $tal = $tr.find('th.tal');
            var $td_reply = $tr.find('td:eq(2)');
            var $td_like = $tr.find('td:eq(3)');
            var $td_time = $tr.find('td:eq(4)');

            var tid = 0;
            var title = '';

            var pattern = /read.php\?tid=(?<tid>\d*).*?>(?<title>.*?)</

            var res = pattern.exec($tal.html());
            if(res.length>2)
            {
                tid = res[1];
                title = res[2];
            }


            if(tid>0)
            {

                var $link = '<a href="/read.php?tid=' + tid + '&toread=5" target="_blank">' + $td_time.html() + '</a>'; //按时间排序
                $td_time.html($link);

                $link = '<a href="/read.php?tid=' + tid + '&toread=1&page=e" target="_blank">' + $td_reply.html() + '</a>'; //最后一页
                $td_reply.html($link);
            }
            var count_like = parseInt($td_like.text());
            if(count_like>0)
            {
                $td_like.html('<a href="/message.php?action=likes&type=id&id=' + tid + '" target="_blank">' + $td_like.html() + '</a>');
            }

        });

    }


    ///提示消息，定时关闭，默认秒
    function message(msg, time)
    {
        var msgbox = $('#zhibo_tools_message');
        if($(msgbox).length == 0)
        {
            $('body').append('<div id="zhibo_tools_message"></div>');
            $('#zhibo_tools_message').click(function() { $(this).hide();});
        }
        msgbox = $('#zhibo_tools_message');

        let win_width = $(window).width();

        let left = (win_width - $(msgbox).width())/2;

        $(msgbox).css({left:left}).html(msg).show();

        if(typeof(time) == 'number')
        {
            clearTimeout(st);
            var st = setTimeout(function() {
                $('#zhibo_tools_message').hide();
            }, time*1000);
        }
    }

    function getUrlParam(name, url)
    {
        //window.location.search.substr(1)
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = url.match(reg);  //匹配目标参数
        if (r!=null)
            return unescape(r[2]);

        return null; //返回参数值
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


    Date.prototype.format = function (format) {
        var args = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var i in args) {
            var n = args[i];
            if (new RegExp("(" + i + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ("00" + n).substr(("" + n).length));
        }
        return format;
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
})();
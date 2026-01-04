// ==UserScript==
// @name            珠海理工 行事历辅助脚本
// @description     珠海理工 用户自动登录+关键字标记功能，不能过度依赖，还是要认真看校行历，写错名字或者多了个空格就不能标记了
// @version         1.4.16
// @namespace        https://greasyfork.org/zh-CN/users/3128
// @include         http*://*.zhszx.cn/*
// @include         http*://10.1.128.4/*
// @include         http*://183.240.149.207/*
// @require         https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @noframes
// @grant           GM_addStyle
// @grant           GM_notification
// @grant           unsafeWindow
// @run-at          document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/375920/%E7%8F%A0%E6%B5%B7%E7%90%86%E5%B7%A5%20%E8%A1%8C%E4%BA%8B%E5%8E%86%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/375920/%E7%8F%A0%E6%B5%B7%E7%90%86%E5%B7%A5%20%E8%A1%8C%E4%BA%8B%E5%8E%86%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function(){
    'use strict';
    GM_addStyle(`
#zhlgUI{width:500px;height:400px;position:fixed;left:25%;top:25%;padding:20px;background:#F5F8FD;z-index:9;font-size:16px;text-align:left;line-height:28px;
border: solid 2px #ccc;
border-radius:15px;}
#zhlgUI>button {width:100px;font-size:18px;padding:2px;margin:0 70px;}
#SignGroupInfo{border: solid 1px; padding: 5px;}
input[name="zhlgGroup"]{margin-left:30px;}
input#zhlgPassWord, input#zhlgUserName, input#zhlgSignInfo {width:150px;height:22px;}
#zhlgSignInfoBox>input[type="checkbox"]:not(:first-child) {margin:2px 0 2px 10px;}
span{font-size:14px!important;}
#floatButtonDiv {width:80px;font-size:18px;position:fixed;right:10px;bottom:10px;}
.zhlg_TagButton {width:80px;height:80px;font-size:18px;display:flex;align-items:center;text-align:center;justify-content:center;cursor:pointer;}
`);
    var zhlgConfig;
    let keywords={
        '姓名' : {color: 'yellow', hide: true},
        '专业部': {color:'#C3E9EC', hide: true},
        '会议': {value:'会议', text:'会议', disabled: true, checked: true, color:'#51b707'},
        '全体教职工': {value:'全体教职工', text:'全体教职工', disabled: true, checked: true, color:'#5aaae8'},
        '报告厅': {value:'报告厅', text:'报告厅', disabled: false, checked: false, color:'#FF620D'},
    };
    let floatButtonDiv=$('<div>').attr({'id': 'floatButtonDiv'}).appendTo('body');
    $('<div>').attr({'class':'zhlg_TagButton'}).css({'background':'#ccc'}).text('设置').click(function(){
        settingUI(true);
    }).appendTo('#floatButtonDiv');
    //['yellow','#51b707','#5aaae8','#C3E9EC','FF620D']


    var settingUI=function(change){
        if($('#zhlgUI').length==0) {
            var mainUI=$('<div>').attr({'id':'zhlgUI'}).append('欢迎首次使用 珠海理工 辅助脚本，<br>在使用之前请先按提示输入相关信息，以便于后续的辅助增强使用。<p style="background-color:#ffc">标记功能：在设置按钮下方生成“关键字”按钮，并在网页中高亮标记对应行，点击按钮可以快速跳转标记。</p><p>'),
                mainUI_wrap_enlarge=$('<input id="zhlgUI_enlarge" type="checkbox"><label for="zhlgUI_enlarge">使用 1280px 宽文章版面</label>'),
                UserInfo=$('<div>').append('【可忽略】自动登录功能：','<input id="zhlgUserName" placeholder="请输入校园网账户名">','<input type="password" id="zhlgPassWord" placeholder="请输入校园网账户密码">'), SignInfo=$('<div id="zhlgSignInfoBox">').append('【可忽略】姓名标记功能：','<input id="zhlgSignInfo" placeholder="不支持标记含有空格的姓名" title="姓名中带有空格的无法识别，建议使用单字">').append('<div id="zhlgSign_keywords"></div>'),
                SignGroupInfo=$('<fieldset id="SignGroupInfo"><legend>专业部选择：</legend></fieldset>');
            var zhlgGroup=['物流','计算机','艺术','汽修','电气'];
            for(var i in zhlgGroup){
                SignGroupInfo.append($('<input type="radio" name="zhlgGroup" id="'+zhlgGroup[i]+'" value="'+zhlgGroup[i]+'"></input>'), $('<label for="'+zhlgGroup[i]+'">').text(zhlgGroup[i]));
            }
            var AutoScrollTop=$('<div>').append($('<input type="checkbox" id="zhlgAutoScrollTop">'), $('<label for="zhlgAutoScrollTop">').text('自动滚动到当天的行事历（需系统日期正确）'));
            $.each(keywords, function(i, e) { //遍历关键字信息
                if(!e.hide) {
                    let label=$('<label>').attr({for:i}).text(e.text);
                    $('<input type="checkbox">').attr({id:i, value: e.value, disabled: e.disabled, checked: e.checked}).appendTo(SignInfo).after(label);
                }
            });

            //配置保存按钮
            var zhlgSaveBtn=$('<button id="zhlgSaveSetting">').text('保存设置').click(function(){
                var zhlgUserName=$('#zhlgUserName').val(),
                    zhlgPassWord=$('#zhlgPassWord').val(),
                    zhlgSignInfo=$('#zhlgSignInfo').val(),
                    zhlgUI_enlarge=$('#zhlgUI_enlarge').is(':checked'),
                    zhlgSignGroupInfo=$('#SignGroupInfo>:radio:checked').val(),
                    Tags=[];
                if(!zhlgUserName || !zhlgPassWord) {
                    alert('未输入校园网账户名&密码，将无法使用自动登录功能【可忽略】');
                }
                if(!zhlgSignInfo){
                    alert('关键字标记功能未输入个人姓名，将无法标记行事历相关事项【可忽略】');
                }
                if(!SignGroupInfo) {
                    alert('未选择所属专业部');
                    return false;
                }
                //遍历保存关键字标记选项
                $('#zhlgSignInfoBox input:checked').each(function(){
                    Tags.push(this.value);
                });

                //生成配置表
                zhlgConfig={
                    'username':zhlgUserName,
                    'password':zhlgPassWord,
                    'fullname':zhlgSignInfo,
                    zhlgUI_enlarge: zhlgUI_enlarge,
                    'zhlgGroup':zhlgSignGroupInfo,
                    'zhlgSignInfo':Tags,
                    'AutoScrollTop': $('#zhlgAutoScrollTop').is(':checked')
                };

                StorageDB('zhlgConfig').insert(zhlgConfig);
                location.reload();
            }),
                zhlgClsBtn = $('<button>').text(localStorage['zhlgConfig']?'不保存关闭':'稍后设置').click(function(){
                    if(!localStorage['zhlgConfig']) {
                        localStorage['zhlgPlus']=1;
                        GM_notification('如果想要使用行事历增强辅助功能，可以点击右下角的“设置”按钮进行设置');
                    }
                    $('#zhlgUI').remove();
                });
            mainUI.append(UserInfo, SignInfo, mainUI_wrap_enlarge, SignGroupInfo, AutoScrollTop, zhlgSaveBtn, zhlgClsBtn).appendTo('body');

            //配置信息读取
            if(change) {
                zhlgConfig=StorageDB('zhlgConfig').read();
                $('#zhlgUserName').val(zhlgConfig.username);
                $('#zhlgPassWord').val(zhlgConfig.password);
                $('#zhlgSignInfo').val(zhlgConfig.fullname);
                $('#zhlgUI_enlarge').prop('checked', zhlgConfig.zhlgUI_enlarge);
                $('#SignGroupInfo>:radio[name="zhlgGroup"][value="'+zhlgConfig.zhlgGroup+'"]').attr('checked',true);
                $('#zhlgAutoScrollTop').prop('checked', zhlgConfig.AutoScrollTop);

                for(let key of zhlgConfig.zhlgSignInfo) $('input[id="'+key+'"]').prop('checked', true)


                if(typeof change=='string') {
                    $('#zhlgUI').append($('<div style="color:red">').text(change));
                }
            }
        }
    }

    if(/item/i.test(location.pathname)){ //内容页
        //文件下载链添加文件名download
        $('a[href*="/UploadFiles/Article/"]').each(function(e){
            let ext=this.href.replace(/.+(\.\w+)$/,'$1'), txt=this.textContent.trim();
            if(/^\d+\.\w+/i.test(txt)) txt=$('.contArticle_tit').text().trim(); //如果文字为纯数字，则采用标题文字
            this.download=txt+ext;
        });
    }
    if(/(zhszx.cn|183.240.149.207)\/?(Default.aspx)?$/i.test(location.href)) { //首页
        $('#siderAcc>.bd ul.infoList>li>a').each(function(){
            $(this).text(this.title.replace(/(^标题：|点击数：\d+|发表时间：[\d年月日]+)/g,''));
        });
        $('.mode-a-main').prepend($('#siderAcc'));
        GM_addStyle(`
#siderAcc{ background-image: none;}
#siderAcc .hd {background: #1a7ab9;}
#siderAcc .bd {width:auto;height:auto;overflow:auto;background:url() #fff;font-size:14px;}
.dateRight {color:red;quotes: '[' ']';float:left;padding-right: 10px;font-weight:bolder;}
#siderAcc .bd a:visited {color: #bbb;}
.dateRight::before {content: open-quote;}
.dateRight::after {content: close-quote}
`);
        $('#siderAcc>.bd ul.infoList').prepend($('<li>').append($('#boxNewsInd01 > div.bd > ul:nth-child(1) > li.t > div > div.title > a').clone().css({color:'#f60', 'font-size':'30px', 'line-height':'initial', 'font-weight':'bold'})));

    }

    //初始化配置
    if(!localStorage['zhlgConfig']) {
        if(localStorage['zhlgPlus']==1) {

        } else
            settingUI();
    } else {
        console.log('no Config')
        zhlgConfig=StorageDB('zhlgConfig').read();
        if(zhlgConfig.password && zhlgConfig.username) {
            $('#TxtUserName, #TxtUserNameTop').val(zhlgConfig.username);
            $('#TxtUserPass, #TxtPasswordTop').val(zhlgConfig.password);
            if($('#BtnLogin, #login2').val()!=='') $('#BtnLogin, #login2').click();
        }

//文章页
        GM_addStyle(`
        table.MsoNormalTable {width:auto!important;}
        table.MsoNormalTable, table.MsoNormalTable tr td{border-collapse:collapse!important;border: solid 1px!important;}
        table.MsoNormalTable tr td:nth-child(2) {width:auto!important;}
        table.MsoNormalTable tr td:nth-child(2) p.MsoNormal,
table.MsoNormalTable tr td:nth-child(2) p.MsoNormal span{
font-size:14px!important;
line-height:16pt!important;
}

table.MsoNormalTable tr td:nth-child(2) p.MsoNormal {

padding:10px;
border-bottom:solid 1px #00CCFF;
-webkit-transition:-webkit-transform 0.5s ease-in;
}

table.MsoNormalTable tr td:nth-child(2) p.MsoNormal:hover {
background:#ddd;
-webkit-transition:-webkit-transform 0.5s ease-in;
-webkit-transform:scale(1.5);
}

table.MsoNormalTable~p.MsoNormal *
{
font-size:16px!important;
}

        /* 2020-07-20 行事历表格段落调整*/
        .contArticle_text p {margin-bottom: auto!important;}
        /* 2021-09-06 文章页内容调整*/
        .contArticle_text span {font-size:18px!important;font-family:"微软雅黑"!important;}
        .contArticle_text table td {padding:5px!important;}
`);

        //周期滚动
        if(zhlgConfig.AutoScrollTop){
            var Dates=new Date();
            var week=Dates.getDay(), //周
                Day=Dates.getDate(), //日
                Month=Dates.getMonth()+1; //月

            //表格版面类型获取
            var table=document.querySelector('.MsoNormalTable')?$('.MsoNormalTable'):$('#fontzoom>table');

            //2020-07-20 Start
            table.css({width:'100%'}); //拓宽内容排版
            var table_first_tr=table.find('tbody>tr:first-child>td');
            console.log(table_first_tr);
            table_first_tr.find(':contains(内容)').parentsUntil('tr','td').css({width:'330px'});
            //2020-07-20 End


            var ToDay=table.find('tbody>tr>:nth-child(1)').find(':contains('+Month+'月'+Day+'日)');

            if(ToDay.length>0) {
                var ToDayTd=ToDay.parentsUntil('tr'),
                    ToDayTdTop=ToDayTd.offset().top;
                setTimeout(function(){
                    $(window).scrollTop(ToDayTdTop-100);
                },1000)
                console.log('td:', ToDay.parentsUntil('tr'), ToDayTdTop);
            }
        }

        if(zhlgConfig.zhlgUI_enlarge) {
            if(/item/i.test(location.href)) {
                GM_addStyle(`@media screen and (min-width: 1280px){#content {min-width:1280px!important;}}`);
            }
        }

    var right=10, bottom=10;

    //更新 keywrods 数据
    keywords['姓名'].value=keywords['姓名'].text=zhlgConfig.fullname;
    keywords['专业部'].value=keywords['专业部'].text=zhlgConfig.zhlgGroup;

    //生成标签数据
    let Sign=zhlgConfig.zhlgSignInfo, SignPosition={};
    Sign.push('姓名');
    Sign.push('专业部');

        for(let i in Sign){
            SignPosition[Sign[i]]={name: i, Top:[]};
            if(!keywords[Sign[i]]) {
                //关键字数据更新，强制初始化
                settingUI('配置数据需要更新，请重新保存数据');
                break;
            }
            let key_Config=keywords[Sign[i]].value;

            if(key_Config) { //存在配置数据时才创建悬浮按钮
                //console.log('序列：', i, Sign[i], bottom, keywords[Sign[i]], keywords[Sign[i]].value);
                let target=$('.contArticle_text p:contains('+keywords[Sign[i]].value+')');
                target.css({'background':keywords[Sign[i]].color,'font-size':'14px'}).attr({'name':keywords[Sign[i]].value});
                if(target.length>0) {
                    //console.log('target: ', target);
                    //记录关键字坐标
                    target.each(function(){
                        //console.log(this, $(this).offset().top);
                        SignPosition[Sign[i]].Top.push($(this).offset().top);
                    });
                    //关键字坐标数组排序
                    SignPosition[Sign[i]].Top=SignPosition[Sign[i]].Top.sort().sort();
                    //悬浮按钮切换坐标
                    $('<div>').attr({'class':'zhlg_TagButton'}).css({'background':keywords[Sign[i]].color}).text(keywords[Sign[i]].text).click(function(){
                        var Float=SignPosition[Sign[i]];
                        console.log(Float);
                        for(var j=0,max=Float.Top.length;j<max;j++){
                            if(j==max-1) {
                                $(document).scrollTop(Float.Top[0]);
                            } else if($(window).scrollTop()<Float.Top[j]) {
                                $(document).scrollTop(Float.Top[j]);
                                break;
                            }
                        }
                        console.log(i, Float.name, $(window).scrollTop(), Float.Top, Float);
                    }).appendTo('#floatButtonDiv');
                    bottom+=90;
                }
            };
        }
    }

    function StorageDB(collectionName) {
        //如果没有 集合名，则使用默认 default
        collectionName = collectionName ? collectionName : 'default';
        //创建JSON缓存，如果缓存存在，则转为JSON，否则新建
        var cache = localStorage[collectionName] ? JSON.parse(localStorage[collectionName]) : {};

        return {
            add : function(name, value) {
                cache[name]=value;
                localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
            },
            del:function(name) {
                if(name) {
                    console.log(cache,cache[name]);
                    delete cache[name];
                    localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
                } else {
                    //删除整个 localStorage 数据
                    localStorage.removeItem(name);
                }
            },
            insert: function(obj){
                localStorage.setItem(collectionName, JSON.stringify(obj));
            },
            Updata : function(name,obj,value){
                cache[obj]=cache[obj]||{};
                cache[obj][name]=value;
                localStorage.setItem(collectionName, JSON.stringify(cache));        //回写 localStorage
            },
            Query : function(obj,name){
                return cache[obj]?name?(cache[obj][name]?cache[obj][name]:null):cache[obj]:null;
            },
            find : function(name) {
                if(!collectionName) return false;
                return cache[name];
            },
            read : function(){
                return $.isEmptyObject(cache)?null:cache;//如果为空，则返回 null
            }
        };
    }
})();

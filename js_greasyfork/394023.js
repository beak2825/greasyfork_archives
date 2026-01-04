// ==UserScript==
// @name         伯俊ERP助手
// @namespace    http://tampermonkey.net/
// @icon         http:/172.16.90.65/html/nds/images/portal.ico
// @version      0.1.4
// @description  在页面右侧添加悬浮收藏夹，一键复制店仓信息，一键填充员工或者用户所需信息，填充密码，重置密码，重置日结时间
// @author       wanlitest
// @match        *://p.polosport.com.cn/*
// @match        *://c.polosport.com.cn/*
// @match        *://172.16.90.65/*
// @match        *://172.16.90.62/*
// @require      https://cdn.bootcss.com/jquery/1.7.2/jquery.min.js
// @resource     layuiCss https://www.layuicdn.com/layui-v2.3.0/css/layui.css
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteVlaue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/394023/%E4%BC%AF%E4%BF%8AERP%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/394023/%E4%BC%AF%E4%BF%8AERP%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

$.getScript("https://www.layuicdn.com/layui-v2.3.0/layui.js",function(){
    layui.use('layer', function(){
        var href = location.href; //获取当前网页地址
        var version = GM_info.script.version; //获取版本号
        var layuiCss = GM_getResourceText('layuiCss');
        //layuiCss = layuiCss.replace(/a:hover\{color:#777\}/g, 'a:hover{color:#fff}');
        layuiCss = layuiCss.replace(/a:hover\{color:#777\}/g, '');
        GM_addStyle(layuiCss);
        var layer = layui.layer;

        //默认通用设置
        var settingOpt = {
            public:{
                slider:{
                    defaultList:[{ss:'3',table:'12888',name:'店仓档案'},
                                 {ss:'3',table:'17787',name:'店仓下载类型'},
                                 {ss:'10',table:'10085',name:'用户'},
                                 {ss:'3',table:'14630',name:'员工'},
                                 {ss:'3',table:'18182',name:'日结'},
                                 {ss:'3',table:'12918',name:'库存'},
                                 {ss:'3',table:'12964',name:'零售单'}], //注：ss为类别，table为对应的页面ID（如果类别与对应的页面不匹配页面则会报错），name就是名称
                },
                store:{
                    posDefaultPwd: '123456', //默认POS初始密码
                    isSetUp: false, //默认店仓下载类型
                },
                user:{
                    defaultPwd: '123456', //默认重置密码
                    childFilter: '在线店务', //创建用户时的默认子过滤系统
                    emailSuffix: '@polosport.com.cn', //默认邮箱后缀
                },
                storeDownType:{
                    type: '否', // 是/否
                },
            },
            position:{ //每个按钮的位置 ontop在上面 under在下面
                favorite:'right', // left 左边 right 右边
                store:{
                    copyStoreCodeBtn: 'under',
                    copyStoreNameBtn: 'under',
                    resetPosDefaultPwdBtn: 'under',
                    resetDayEndTimeBtn: 'under',
                },
                user:{
                    copyUserNameBtn: 'under',
                    copyUserEmailBtn: 'under',
                    resetUserPwdBtn: 'under',
                },
                storeDownType:{
                    resetDownTypeBtn:'under',
                },
            },
            switch:{ //每个功能的开关  true就是开启 false就是关闭
                favorite: true,
                store:{
                    copyStoreCodeBtn: true,
                    copyStoreNameBtn: true,
                    copyStoreInfoBtn: true,
                    resetPosDefaultPwdBtn: true,
                    resetDayEndTimeBtn: true,
                    resetStoreDownTypeBtn: true,
                    createUserBtn: true,
                },
                user:{
                    copyUserNameBtn: true,
                    copyUserEmailBtn: true,
                    resetUserPwdBtn: true,
                },
                storeDownType:{
                    resetDownTypeBtn: true,
                },
                staff: {
                    clearStaffNameBtn: true,
                },
                posArchive:{
                    showPosCodeSettingBtn: true,
                    clearPosBindStoreBtn: true,
                },
                posCodeSetting:{
                    clearPosCodeBtn: true,
                },
            }
        }

        var settingJson = window.localStorage.getItem('ERP-Tool-' + version);
        if(settingJson === null){
            window.localStorage.setItem('ERP-Tool-' + version, JSON.stringify(settingOpt));
        }else{
            settingOpt = JSON.parse(settingJson);
        };

        //侧边栏插件
        $.fn.extend({
            "sliderBar": function (options) {
                // 使用jQuery.extend 覆盖插件默认参数
                var opts = $.extend(
                    {} ,
                    $.fn.sliderBar.defalutPublic ,
                    options
                );

                // 这里的this 就是 jQuery对象，遍历页面元素对象
                // 加个return可以链式调用
                return this.each(function () {
                    //获取当前元素 的this对象
                    var $this = $(this);

                    $this.data('open', opts.open);

                    privateMethods.initSliderBarCss($this, opts);

                    switch(opts.position){
                        case 'right' : privateMethods.showAtRight($this, opts); break;
                        case 'left'  : privateMethods.showAtLeft($this, opts); break;
                    }

                });
            }
        });

        // 默认公有参数
        $.fn.sliderBar.defalutPublic = {
            open : false,
            top : 100,
            width : 100,
            height : 240,
            theme : '#438eb9',
            position : settingOpt.position.favorite,
        };

        var privateMethods = {
            initSliderBarCss : function(obj, opts){
                obj.css({
                    'width': opts.width+20+'px',
                    //'height' : opts.height+20+'px',
                    'top' : opts.top+'px',
                    'border' : '1px solid '+opts.theme,
                    'position':'fixed',
                    'font-family':'Microsoft Yahei',
                    'z-index': '9999'
                }).find('.body').css({
                    'width': opts.width+'px',
                    //'height' : opts.height+'px',
                    'position':'relative',
                    'padding':'10px',
                    'overflow-x':'hidden',
                    'overflow-y':'auto',
                    'font-family':'Microsoft Yahei',
                    'font-size' : '12px',
                    'background-color' : '#fff',
                });

                var titleCss = {
                    'width':'15px',
                    'height':'76px',
                    'position':'absolute',
                    'top':'-1px',
                    'display':'block',
                    'background-color': opts.theme,
                    'font-size': '13px',
                    'padding':'8px 4px 0px 5px',
                    'color':'#fff',
                    'cursor': 'pointer',
                    'font-family':'Microsoft Yahei'
                }

                obj.find('.title').css(titleCss).find('span').css({
                    'font-size': '13px'
                });
            },
            showAtLeft: function(obj, opts){
                if(opts.open){
                    obj.css({left:'0px'});
                    obj.find('.title').css('right','-25px').find('span').attr('class','portal-top-icon icon-favorite');
                }else{
                    obj.css({left:-opts.width-22+'px'});
                    obj.find('.title').css('right','-25px').find('span').attr('class','portal-top-icon icon-favorite');
                }
                obj.hover(function(){
                    //console.log('鼠标移入');
                    obj.animate({left:'0px'}, 500);
                    $(this).find('span').attr('class','portal-top-icon icon-favorite');
                },function(){
                    //console.log('鼠标移出');
                });
                obj.find('.body').hover(function(){
                    //console.log('鼠标移到body');
                },function(){
                    //console.log('鼠标移出body');
                    obj.animate({left:-opts.width-22+'px'}, 500);
                    $(this).find('span').attr('class','portal-top-icon icon-favorite');
                });

            },
            showAtRight : function(obj, opts){
                if(opts.open){
                    obj.css({right:'0px'});
                    obj.find('.title').css('right', opts.width+20+'px').find('span').attr('class','portal-top-icon icon-favorite');
                }else{
                    obj.css({right:-opts.width-22+'px'});
                    obj.find('.title').css('right', opts.width+20+'px').find('span').attr('class','portal-top-icon icon-favorite');
                }

                obj.hover(function(){
                    //console.log('鼠标移入');
                    obj.animate({right:'0px'}, 500);
                    $(this).find('span').attr('class','portal-top-icon icon-favorite');
                },function(){
                    //console.log('鼠标移出');
                });
                obj.find('.body').hover(function(){
                    //console.log('鼠标移到body');
                },function(){
                    obj.animate({right:-opts.width-22+'px'}, 500);
                    $(this).find('span').attr('class','portal-top-icon icon-favorite');
                });
            }
        };

        var clear_input_value_html = '<span class="buttons"><a class="table-buttons2 clearInputValue" title="清除目标POS机终端号" href="javascript:void(0);">清除</a></span>';

        if(href.match(/\/html\/nds\/portal\/ssv\/index\.jsp\?ss=\d+/g) || href.match(/\/html\/nds\/portal\/ssv\/index\.jsp\?ss=-1/g) || href.match(/\/html\/nds\/portal\/portal\.jsp/g)){ //index
            if(href.match(/\/html\/nds\/portal\/ssv\/index\.jsp\?ss=\d+/g)){
                //解决Table显示不全的问题 样式bug
                setTimeout(function(){
                    $('#D_inc_table_B').css('max-height','100%');
                }, 1500);
            };
            if(settingOpt.switch.favorite){
                loadRightFavorite(); //加载右侧悬浮收藏夹
            };

        }else if(href.match(/\/html\/nds\/object\/object\.jsp\?table=12888/g)){ //店仓档案
            var positionStore = settingOpt.position.store;
            var switchStore = settingOpt.switch.store;
            if(switchStore.createUserBtn){
                checkUser($('#column_40137')[0].innerText);
            };
            if(switchStore.copyStoreInfoBtn){
                $('#objdropbtn').after('<a class="table-buttons2" id="copyStoreInfo" title="注：此复制并不是复制到粘贴板，而是复制供新建用户或者添加员工提供填充所需信息！" href="javascript:void(0);">复制店仓信息</a>');
            };
            if(switchStore.copyStoreCodeBtn){
                if(positionStore.copyStoreCodeBtn === 'under'){
                    $('#tdv_40137').append('<span class="buttons"><a class="table-buttons2" id="copyStoreNo" title="复制店仓编号" href="javascript:void(0);">复制</a></span>');
                }else{
                    $('#objdropbtn').after('<a class="table-buttons2" id="copyStoreNo" title="复制店仓编号" href="javascript:void(0);">复制店仓编号</a>');
                };
            };
            if(switchStore.copyStoreNameBtn){
                if(positionStore.copyStoreNameBtn === 'under'){
                    $('#tdv_20578').append('<span class="buttons"><a class="table-buttons2" id="copyStoreName" title="复制店仓名称" href="javascript:void(0);">复制</a></span>');
                }else{
                    $('#objdropbtn').after('<a class="table-buttons2" id="copyStoreName" title="复制店仓名称" href="javascript:void(0);">复制店仓名称</a>');
                };
            };
            if(switchStore.resetPosDefaultPwdBtn){
                if(positionStore.resetPosDefaultPwdBtn === 'under'){
                    $('#tdv_48130').append('<span class="buttons"><a class="table-buttons2" id="resetPosInitPwd" title="重置POS初始密码为' + settingOpt.public.store.posDefaultPwd + '" href="javascript:void(0);">重置</a></span>');
                }else{
                    $('#objdropbtn').after('<a class="table-buttons2" id="resetPosInitPwd" title="重置POS初始密码为"'+ settingOpt.public.store.posDefaultPwd +' href="javascript:void(0);">重置POS初始密码</a>');
                };
            };
            if(switchStore.resetDayEndTimeBtn){
                if(positionStore.resetDayEndTimeBtn === 'under'){
                    $('#tdv_69448').append('<span class="buttons"><a class="table-buttons2" title="重置日结时间为今天的前一天" id="initDayEndTime" href="javascript:void(0);">重置</a></span>');
                }else{
                    $('#objdropbtn').after('<a class="table-buttons2" id="initDayEndTime" title="重置日结时间为今天的前一天" href="javascript:void(0);">重置日结时间</a>');
                };
            };
            if(switchStore.resetStoreDownTypeBtn){
                $('#objdropbtn').after('<a class="table-buttons2" id="resetStoreDownType" title="一键重置店仓下载类型，无需保存！" href="javascript:void(0);">重置店仓下载类型 Beta</a>');
            };
            //复制店仓编号
            $('#copyStoreNo').click(function() {
                GM_setClipboard($('#column_40137')[0].innerText);
                layer.msg("复制成功");
            });
            //复制店仓名称
            $('#copyStoreName').click(function() {
                GM_setClipboard($('#column_20578')[0].value);
                layer.msg("复制成功");
            });
        }else if(href.match(/\/html\/nds\/object\/object\.jsp\?table=17787/g)){ //店仓下载类型
            var positionStoreDownType = settingOpt.position.storeDownType;
            var switchStoreDownType = settingOpt.switch.storeDownType;
            if(switchStoreDownType.resetDownTypeBtn){
                if(positionStoreDownType.resetDownTypeBtn === 'under'){
                    $('#tdv_65397').append('<span class="buttons"><a class="table-buttons2" id="initInstallType" title="重置安装标志！将是变为否" href="javascript:void(0);">重置</a></span>');
                }else{
                    $('#objdropbtn').after('<a class="table-buttons2" id="initInstallType" title="重置安装标志！将是变为否" href="javascript:void(0);">重置安装标志</a>');
                };
            };
        }else if(href.match(/\/html\/nds\/object\/object\.jsp\?table=10085/g) && href.indexOf('id=-1')!==-1){ //先判断是否是新建用户
            if(settingOpt.switch.store.copyStoreInfoBtn){
                if(GM_getValue('createStoreInfo')){
                    $('#objdropbtn').after('<a class="table-buttons2" id="pasteStoreInfo" title="注：根据复制的店仓信息自动生成目标字段对应的数据，进行填充！" href="javascript:void(0);">填充信息</a>');
                };
            };
        }else if(href.match(/\/html\/nds\/object\/object\.jsp\?table=10085/g)){ //查看用户
            var positionUser = settingOpt.position.user;
            var switchUser = settingOpt.switch.user;
            $('#tdd_5377').addClass('desc').append('<div class="desc-txt">密码:</div>');
            if(switchUser.copyUserNameBtn){
                if(positionUser.copyUserNameBtn === 'under'){
                    $('#tdv_4445').append('<span class="buttons"><a class="table-buttons2" id="copyUserName" title="复制用户真实姓名" href="javascript:void(0);">复制</a></span>');
                }else{
                    $('#objdropbtn').after('<a class="table-buttons2" id="copyUserName" title="复制用户真实姓名" href="javascript:void(0);">复制用户真实姓名</a>');
                };
            };
            if(switchUser.copyUserEmailBtn){
                if(positionUser.copyUserEmailBtn === 'under'){
                    $('#tdv_1312').append('<span class="buttons"><a class="table-buttons2" id="copyUserEmail" title="复制邮箱地址" href="javascript:void(0);">复制</a></span>');
                }else{
                    $('#objdropbtn').after('<a class="table-buttons2" id="copyUserEmail" title="复制用户邮箱地址" href="javascript:void(0);">复制用户邮箱地址</a>');
                };
            };
            if(switchUser.resetUserPwdBtn){
                if(positionUser.resetUserPwdBtn === 'under'){
                    $('#tdv_5377').append('<span class="buttons"><a class="table-buttons2" style="margin-top:-1px;" id="resetUserPwd" title="重置用户密码为123456，不用点保存" href="javascript:void(0);">重置密码</a></span>');
                }else{
                    $('#objdropbtn').after('<a class="table-buttons2" id="resetUserPwd" title="一键重置用户密码，无需保存" href="javascript:void(0);">重置用户密码</a>');
                };
            };
            $('#copyUserName').click(function() {
                GM_setClipboard($('#column_4445')[0].value); //复制用户真实姓名
                layer.msg("复制成功");
            });
            $('#copyUserEmail').click(function() {
                GM_setClipboard($('#column_1312')[0].value); //复制邮箱地址
                layer.msg("复制成功");
            });

        }else if(href.match(/\/html\/nds\/object\/object\.jsp\?table=14630/g)){ //员工
            var switchStaff = settingOpt.switch.staff;
            if(settingOpt.switch.store.copyStoreInfoBtn){
                $('#objdropbtn').after('<a class="table-buttons2" id="pasteStoreInfoStaff" title="注：根据复制的店仓信息自动生成目标字段对应的数据，进行填充！" href="javascript:void(0);">填充信息</a>');
            };
            if(switchStaff.clearStaffNameBtn){
                $('#tdv_25982').append('<span class="buttons"><a class="table-buttons2 clearInputValue" title="清除员工姓名" href="javascript:void(0);">清除</a></span>');
            };
        }else if(href.match(/\/html\/nds\/object\/object\.jsp\?table=23408/g)){ //POS机档案 polo
            var switchPosArchive_p = settingOpt.switch.posArchive;
            var posStoreId_polo;
            if($('#tdv_143724').children('input').length!==0){
                //有权限 有input 可编辑的写法
                if($('#column_143724')[0].value){
                    posStoreId_polo = $('#fk_column_143724')[0].value;
                    if(switchPosArchive_p.showPosCodeSettingBtn){
                        $('#objdropbtn').after('<a class="table-buttons2" href="javascript:showObject(\'/html/nds/object/object.jsp?table=23409&&fixedcolumns=&id=' + posStoreId_polo + '\');">查看所在店仓POS机编号设置</a>');
                    };
                    if(switchPosArchive_p.clearPosBindStoreBtn){
                        $('#tdv_143724').append('<span class="buttons"><a class="table-buttons2 clearInputValue" title="清除目标输入框内的店仓名称" href="javascript:void(0);">清除</a></span>');
                    };
                };
            }else{
                //无权限 只有span 不能编辑的写法
                var pos_archive_url_polo = $('#tdv_143724').children('a')[0].href;
                if(pos_archive_url){
                    posStoreId_polo = pos_archive_url_polo.substring(pos_archive_url_polo.indexOf('id=')+3);
                    if(switchPosArchive_p.showPosCodeSettingBtn){
                        $('#objdropbtn').after('<a class="table-buttons2" href="javascript:showObject(\'/html/nds/object/object.jsp?table=23409&&fixedcolumns=&id=' + posStoreId_polo + '\');">查看所在店仓POS机编号设置</a>');
                    };
                };
            };
        }else if(href.match(/\/html\/nds\/object\/object\.jsp\?table=23471/g)){ //POS机档案 cartelo
            var switchPosArchive_c = settingOpt.switch.posArchive;
            var posStoreId_cartelo;
            //console.log($('#tdv_143488').children('input'));
            if($('#tdv_143488').children('input').length!==0){
                //有权限 有input 可编辑的写法
                if($('#column_143488')[0].value){
                    posStoreId_cartelo = $('#fk_column_143488')[0].value;
                    if(switchPosArchive_c.showPosCodeSettingBtn){
                        $('#objdropbtn').after('<a class="table-buttons2" href="javascript:showObject(\'/html/nds/object/object.jsp?table=23472&&fixedcolumns=&id=' + posStoreId_cartelo + '\');">查看所在店仓POS机编号设置</a>');
                    };
                    if(switchPosArchive_c.clearPosBindStoreBtn){
                        $('#tdv_143488').append('<span class="buttons"><a class="table-buttons2 clearInputValue" title="清除目标输入框内的店仓名称" href="javascript:void(0);">清除</a></span>');
                    };
                };
            }else{
                //无权限 只有span 不能编辑的写法
                var pos_archive_url = $('#tdv_143488').children('a')[0].href;
                if(pos_archive_url){
                    posStoreId_cartelo = pos_archive_url.substring(pos_archive_url.indexOf('id=')+3);
                    if(switchPosArchive_c.showPosCodeSettingBtn){
                        $('#objdropbtn').after('<a class="table-buttons2" href="javascript:showObject(\'/html/nds/object/object.jsp?table=23472&&fixedcolumns=&id=' + posStoreId_cartelo + '\');">查看所在店仓POS机编号设置</a>');
                    };
                };
            };

        }else if(href.match(/\/html\/nds\/object\/object\.jsp\?table=23409/g)){ //POS机编号设置 polo
            if(settingOpt.switch.posCodeSetting.clearPosCodeBtn){
                $('#tdv_143738').append(clear_input_value_html);
                $('#tdv_143737').append(clear_input_value_html);
                $('#tdv_143736').append(clear_input_value_html);
                $('#tdv_143735').append(clear_input_value_html);
            };
        }else if(href.match(/\/html\/nds\/object\/object\.jsp\?table=23472/g)){ //POS机编号设置 cartelo
            if(settingOpt.switch.posCodeSetting.clearPosCodeBtn){
                $('#tdv_143502').children('span').after(clear_input_value_html);
                $('#tdv_143501').children('span').after(clear_input_value_html);
                $('#tdv_143500').children('span').after(clear_input_value_html);
                $('#tdv_143499').children('span').after(clear_input_value_html);
            };
        };

        // 加载右侧悬收藏夹
        function loadRightFavorite(){
            $('#portal_middle').prepend('<div class="sliderbar-container"><div class="title"><span></span>收藏夹</div><div class="body"><div style="line-height: 20px;"><ul></ul></div></div></div>');
            $('.sliderbar-container').sliderBar();
            GM_xmlhttpRequest({
                method: 'get',
                url: "/html/nds/portal/collect.jsp?id=1&&onlyfa='Y'",
                onload: function(response){
                    var favorite_item = $(response.responseXML).find('.favorite_item');
                    if(favorite_item.length<5 && favorite_item.length!==0){
                        console.log(favorite_item.length);
                        $('.sliderbar-container').css({'height':'150px'});
                        $('.sliderbar-container').children('.body').css({'height':'130px'});
                    };
                    if(favorite_item.length!==0){
                        favorite_item.each(function() {
                            var f_input_value = $(this).children('input').attr('value');
                            var f_a_text = $(this).children('a')[0].textContent;
                            var f_t = f_a_text.length > 7 ? f_a_text.substring(0,7) + '...':f_a_text;
                            $('.sliderbar-container').children('.body').children('div').children('ul').append('<li><a href="/html/nds/portal/ssv/index.jsp?ss=3&table='+f_input_value+'" title="点击访问 '+f_a_text.substring(1)+'">' + f_t + '</a></li>');
                        });
                    }else {
                        settingOpt.public.slider.defaultList.forEach(function(t){
                            $('.sliderbar-container').children('.body').children('div').children('ul').append('<li><a href="/html/nds/portal/ssv/index.jsp?ss=' + t.ss + '&table='+t.table+'">>'+t.name+'</a></li>');
                        });
                    };
                },
            });
        };

        $('#resetUserPwd').on('click',function(){
            var user_id = getThisHrefSuffixById(); //获取用户ID
            resetUserPassword(user_id, settingOpt.public.user.defaultPwd); //修改密码
        });
        //重置用户密码为目标密码 uid为用户id  pwd为设置的密码
        function resetUserPassword(uid, pwd){
            if(pwd === null){
                return;
            };
            var cookie = document.cookie;
            if(cookie!==''){
                GM_xmlhttpRequest({
                    method: 'post',
                    url: '/control/command',
                    data: 'userid=' + uid + '&formRequest=%2Fhtml%2Fnds%2Fsecurity%2Fchangepassword.jsp%3Fobjectid%3D' + uid + '&command=ChangePassword&nds.control.ejb.UserTransaction=N&password1=' + pwd + '&password2=' + pwd,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Cookie": cookie,
                    },
                    onload:function(response){
                        //console.log(response); //print response
                        if(response.status === 200 && response.statusText === 'OK'){
                            //alert('密码重置成功！');
                            layer.msg("密码重置成功！");
                        };
                    }
                });
            }else{
                //alert('修改密码失败：无法获取当前页面Cookie！请尝试刷新页面重新点击按钮。');
                layer.msg("修改密码失败：无法获取当前页面Cookie！请尝试刷新页面重新点击按钮。");
            };

        };

        $('#clearToStoreInfo').click(function() {
            $('#column_143724')[0].value = ''; //清除
            //alert('已经清除！请手动保存！');
            layer.msg('已经清除, 请手动保存！');
        });
        //清除input输入框 value值
        $('.clearInputValue').on('click',function() {
            $(this).parent().parent().children("input")[0].value = ''; //清除
            $(this).parent().parent().children("input")[1].value = ''; //清除
            layer.msg('已经清除, 请手动保存！');
        });

        $('#copyStoreInfo').click(function() {
            var storeNo = $('#column_40137')[0].innerText;
            var storeDeale = $('#column_24765')[0].innerText;
            var storeName = $('#column_20578')[0].value;
            var storeDealeId = getUrlSuffixStr($('#tdv_24765'));
            var storeId = getThisHrefSuffixById();
            var createUserInfo = {
                storeNo:storeNo,
                storeDeale:storeDeale,
                storeDealeId:storeDealeId,
                storeName:storeName,
                storeId:storeId
            };
            console.log(createUserInfo); //将获取到的信息输出到控制台
            GM_setValue('createStoreInfo',createUserInfo);
            layer.msg('店仓信息已经复制');
        });
        //获取目标对象下A标签href连接的尾部的对象ID
        function getUrlSuffixStr(e){
            var u = e.children('a')[0].href;
            return u.substring(u.indexOf('id=')+3);
        };
        //获取当前页面的对象ID
        function getThisHrefSuffixById(){
            return href.substring(href.indexOf('id=')+3);
        };

        $('#pasteStoreInfo').click(function() {
            var storeInfo = GM_getValue('createStoreInfo');
            if(storeInfo){
                console.log(storeInfo);
                $('#column_1306').val(storeInfo.storeNo.toLowerCase()); //小写店仓编号
                $('#column_4445').val(storeInfo.storeNo); //大写店仓编号
                $('#column_25290').val(storeInfo.storeDeale); //所属经销商
                $('#fk_column_25290').val(storeInfo.storeDealeId); //所属经销商id
                $('#column_24009').val(storeInfo.storeName); //店仓名称
                $('#fk_column_24009').val(storeInfo.storeId); //店仓id
                $('#column_1310').val(settingOpt.public.user.defaultPwd); //密码
                $('#column_62778').val(settingOpt.public.user.childFilter); //子系统过滤
                $('#column_1312').val(storeInfo.storeNo.toLowerCase() + settingOpt.public.user.emailSuffix); //邮箱
                $("#column_19270").attr("checked", true); //营业员 选中状态
            };
            layer.msg('信息填充完成');
        });
        $('#pasteStoreInfoStaff').click(function() {
            var storeInfo = GM_getValue('createStoreInfo');
            if(storeInfo){
                console.log(storeInfo);
                $('#column_25985').val(storeInfo.storeDeale); //所属经销商
                $('#column_25988').val(storeInfo.storeName); //店仓名称
                $('#column_25987').attr("checked", true); //营业员 选中状态
                $('#fk_column_25985').val(storeInfo.storeDealeId); //经销商id
                $('#fk_column_25988').val(storeInfo.storeId); //店仓id
            };
            layer.msg('信息填充完成');
        });
        $('#resetPosInitPwd').click(function(){
            $('#column_48130')[0].value = settingOpt.public.store.posDefaultPwd;
            layer.msg('重置POS初始密码完成，请手动保存！');
        });
        $('#initDayEndTime').click(function() {
            var formattedDate = new Date();
            var d = formattedDate.getDate();
            d-=1; //倒退1天
            var m =  formattedDate.getMonth() + 1;
            var y = formattedDate.getFullYear();
            if(d < 10){
                d = '0' + d;
            };
            if(m < 10){
                m = '0' + m;
            };
            $('#column_69448').val(y + '' + m + '' + d);
            layer.msg('重置日结时间为今天的前一天完成，请手动保存！');
        });
        $('#initInstallType').click(function() {
            var storeDownType = settingOpt.public.storeDownType;
            if(storeDownType.type === '是'){
                $('#column_65397').find('option[value="1"]').attr('selected', true);
            }else{
                $('#column_65397').find('option[value="0"]').attr('selected', true);
            };
            layer.msg('重置店仓下载类型完成，请手动保存！');
        });

        $('#resetStoreDownType').click(function(){
            queryAndSetStoreDownType(getThisHrefSuffixById());
        });

        // 查询目标用户 如果没有则创建用户
        function queryUser(storeInfo){
            var user_param = '{"init_query": false, "range": 10, "show_alert": true, "start": 0, "qlcid": -1, "dir_perm": 1, "fixedcolumns": "", "orders": [], "table": "USERS", "callbackEvent": "RefreshGrid", "param_str2": "table=10085&tab_count=1&return_type=n&accepter_id=null&qlcid=-1&param_count=9&resulthandler=/html/nds/portal/table_list.jsp&show_maintableid=true&USERS.NAME=&USERS.TRUENAME=' + storeInfo.code + '&USERS.C_DEPART_ID=&USERS.C_DEPART_ID/sql=&USERS.C_DEPART_ID/filter=&USERS.EMAIL=&USERS.ISSALER=0&USERS.C_CUSTOMER_ID=&USERS.C_CUSTOMER_ID/sql=&USERS.C_CUSTOMER_ID/filter=&USERS.C_STORE_ID=&USERS.C_STORE_ID/sql=&USERS.C_STORE_ID/filter=&USERS.C_STORE_ID;C_BLOCK_ID;NAME=&USERS.ISACTIVE==Y&show_all=true&queryindex_-1=-1", "resulthandler": "/html/nds/portal/table_result.jsp", "totalRowCount": 1}';
            executeQuery(user_param, function(result){
                var r_match = result.match(/javascript:pc\.mo\(\d+\)/g);
                if(r_match===null){
                    //alert('该店仓没有用户');
                    return createUser(storeInfo);
                };
                var id = r_match[0].match(/\d+/g)[0]; // 筛选目标ID  如果有多个 只取第一个
                layer.msg('该店仓已有用户，无法重复创建！');
            });
        };
        //验证当前店仓是否拥有用户 没有则创建用户，有则输出用户ID
        function checkUser(storeCode){
            storeCode = storeCode.toUpperCase(); // 转换为大写
            var user_param = '{"init_query": false, "range": 10, "show_alert": true, "start": 0, "qlcid": -1, "dir_perm": 1, "fixedcolumns": "", "orders": [], "table": "USERS", "callbackEvent": "RefreshGrid", "param_str2": "table=10085&tab_count=1&return_type=n&accepter_id=null&qlcid=-1&param_count=9&resulthandler=/html/nds/portal/table_list.jsp&show_maintableid=true&USERS.NAME=&USERS.TRUENAME=' + storeCode + '&USERS.C_DEPART_ID=&USERS.C_DEPART_ID/sql=&USERS.C_DEPART_ID/filter=&USERS.EMAIL=&USERS.ISSALER=0&USERS.C_CUSTOMER_ID=&USERS.C_CUSTOMER_ID/sql=&USERS.C_CUSTOMER_ID/filter=&USERS.C_STORE_ID=&USERS.C_STORE_ID/sql=&USERS.C_STORE_ID/filter=&USERS.C_STORE_ID;C_BLOCK_ID;NAME=&USERS.ISACTIVE==Y&show_all=true&queryindex_-1=-1", "resulthandler": "/html/nds/portal/table_result.jsp", "totalRowCount": 1}';
            executeQuery(user_param, function(result){
                var r_match = result.match(/javascript:pc\.mo\(\d+\)/g);
                if(r_match===null){
                    //alert('该店仓没有用户');
                    $('#objdropbtn').after('<a class="table-buttons2" id="createUser" title="一键创建用户并自动加入用户组。注：仅适用于店铺" href="javascript:void(0);">创建用户 Beta</a>');
                    $('#createUser').on('click',function(){
                        var storeCode = $('#column_40137')[0].innerText; //店仓编号
                        var storeDeale = $('#column_24765')[0].innerText; //所属经销商
                        var storeName = $('#column_20578')[0].value; //店仓名称
                        var storeDealeId = getUrlSuffixStr($('#tdv_24765')); //所属经销商ID
                        var storeId = getThisHrefSuffixById(); //店仓ID
                        var storeInfo = {
                            id: storeId,
                            code: storeCode,
                            name: storeName,
                            dealeId: storeDealeId,
                            deale: storeDeale
                        };
                        //console.log(storeInfo);
                        queryUser(storeInfo); //查询用户
                    });
                    return;
                };
                var id = r_match[0].match(/\d+/g)[0]; // 筛选目标ID  如果有多个 只取第一个
                console.log('用户ID：',id);
                //alert('该店仓已有用户，无法重复创建！');
            });
        };

        // 创建用户
        function createUser(storeInfo){
            var publicUser = settingOpt.public.user;
            if(publicUser === null){ //确保参数不能为空
                layer.msg('无法获取用户参数，请刷新页面重试！');
                return;
            };
            var userEmail = storeInfo.code.toLowerCase() + publicUser.emailSuffix;
            var user_create_param = '{"command": "ProcessObject", "nds.control.ejb.UserTransaction": "N", "masterobj": {"name": "' + storeInfo.code.toLowerCase() + '", "truename": "' + storeInfo.code.toUpperCase() + '", "hr_employee_id__name": "", "HR_EMPLOYEE_ID": "", "hr_post_id__name": "", "HR_POST_ID": "", "passwordhash": "' + publicUser.defaultPwd + '", "sgrade": "0", "c_depart_id__name": "", "C_DEPART_ID": "", "email": "' + userEmail + '", "emailverify": "", "login_ip_rule": "", "subsystems": "' + publicUser.childFilter + '", "description": "", "issaler": "Y", "areamng_id__name": "", "AREAMNG_ID": "", "c_supplier_id__name": "", "C_SUPPLIER_ID": "", "c_customer_id__name": "' + storeInfo.deale + '", "C_CUSTOMER_ID": "' + storeInfo.dealeId + '", "c_store_id__name": "' + storeInfo.name + '", "C_STORE_ID": "' + storeInfo.id + '", "c_priceregion_id__name": "", "C_PRICEREGION_ID": "", "discountlimit": "1", "isret": "Y", "supervisor_id__name": "", "SUPERVISOR_ID": "", "c_department_id__name": "", "C_DEPARTMENT_ID": "", "title": "", "phone": "", "fax": "", "phone2": "", "emailuser": "", "enterpriseno": "", "birthday": "", "lastcontact": "", "lastresult": "", "comments": "", "webpos_per": "1000000000", "isadmin": "2", "passwordreset": "0", "language": "zh_CN", "id": -1, "table": 10085, "namespace": "", "tablename": "USERS", "directory": "USERS_LIST", "fixedcolumns": "", "copyfromid": null}, "callbackEvent": "SaveObjectNew"}';
            executeSave(user_create_param, function(response){
                layer.msg('用户创建成功');
                console.log('response',response);
                var ns = response.nextscreen;
                var userId = ns.match(/id=(\d+)/g)[0].replace('id=','');
                console.log('userId：',userId);
                addUserGroup(userId, storeInfo);
            });
        };

        // 添加用户组
        function addUserGroup(userId,storeInfo){
            var publicUser = settingOpt.public.user;
            if(publicUser === null){ //确保参数不能为空
                layer.msg('无法获取用户参数，请刷新页面重试！');
                return;
            };
            var userEmail = storeInfo.code.toLowerCase() + publicUser.emailSuffix;
            var groupName = "加盟门店组";
            if(storeInfo.deale === '总部'){
                groupName = "直营门店组";
            }
            console.log(groupName);
            var user_group_param = '{"command": "ProcessObject", "nds.control.ejb.UserTransaction": "N", "column_masks": [5, 1, 3], "table": "GROUPUSER", "fixedColumns": "879='+ userId +'", "bestEffort": true, "addList": [[0, "A1", null, "系统维护", "' + groupName + '"]], "modifyList": [], "deleteList": [], "queryRequest": {"init_query": true, "range": 10, "column_masks": [5, 1, 3], "start": 0, "dir_perm": 1, "fixedcolumns": "879=' + userId + '", "orders": [{"d": "ID", "t": false, "c": "GROUPUSER.ID"}], "table": "GROUPUSER", "callbackEvent": "RefreshGrid", "nea.tabitems": true, "totalRowCount": 0}, "masterobj": {"name": "'+ storeInfo.code.toLowerCase() +'", "truename": "' + storeInfo.code.toUpperCase() + '", "hr_employee_id__name": "", "HR_EMPLOYEE_ID": "", "hr_post_id__name": "", "HR_POST_ID": "", "col_5377": "修改密码", "sgrade": "0", "c_depart_id__name": "", "C_DEPART_ID": "", "email": "' + userEmail +'", "login_ip_rule": "", "subsystems": "' + publicUser.childFilter + '", "description": "", "issaler": "Y", "areamng_id__name": "", "AREAMNG_ID": "", "c_supplier_id__name": "", "C_SUPPLIER_ID": "", "c_customer_id__name": "'+storeInfo.deale+'", "C_CUSTOMER_ID": "'+storeInfo.dealeId+'", "c_store_id__name": "'+storeInfo.name+'", "C_STORE_ID": "'+storeInfo.id+'", "c_priceregion_id__name": "", "C_PRICEREGION_ID": "", "discountlimit": "1.00", "isret": "Y", "supervisor_id__name": "", "SUPERVISOR_ID": "", "c_department_id__name": "", "C_DEPARTMENT_ID": "", "title": "", "phone": "", "fax": "", "phone2": "", "emailuser": "", "enterpriseno": "", "birthday": "", "lastcontact": "", "lastresult": "", "comments": "", "webpos_per": "1000000000", "isadmin": "2", "passwordreset": "0", "language": "zh_CN", "isactive": "Y", "id": '+ userId +', "table": 10085, "namespace": "", "tablename": "USERS", "directory": "USERS_LIST", "fixedcolumns": "", "copyfromid": null}, "callbackEvent": "SaveObject"}';
            executeSave(user_group_param, function(response){
                console.log('response',response);
                layer.msg('添加' + groupName + '成功');
            });
        };


        //查询并设置店仓下载类型
        function queryAndSetStoreDownType(storeId){
            var down_type_param = `{"init_query": false, "range": 10, "show_alert": true, "start": 0, "qlcid": -1, "dir_perm": 1, "fixedcolumns": "", "orders": [], "table": "V_TSYSTRANS", "callbackEvent": "RefreshGrid", "param_str2": "table=17787&tab_count=1&return_type=n&accepter_id=null&qlcid=-1&param_count=5&resulthandler=%2Fhtml%2Fnds%2Fportal%2Ftable_list.jsp&show_maintableid=true&V_TSYSTRANS.C_STORE_ID=&V_TSYSTRANS.C_STORE_ID%2Fsql=IN(SELECT%20C_SYSTRANS_STORE.ID%20FROM%20C_STORE%20C_SYSTRANS_STORE%20WHERE%20(C_SYSTRANS_STORE.ISSTOP%3D'N'%20AND%20C_SYSTRANS_STORE.ISACTIVE%3D'Y')%20AND%20(%20(C_SYSTRANS_STORE.AD_CLIENT_ID%3D37)%20)%20AND%20(%20(C_SYSTRANS_STORE.ID%3D`+ storeId +`)%20))&V_TSYSTRANS.C_STORE_ID%2Ffilter=&V_TSYSTRANS.TYPE=&V_TSYSTRANS.TYPE%2Fsql=&V_TSYSTRANS.TYPE%2Ffilter=&V_TSYSTRANS.TRANSSATTE=0&V_TSYSTRANS.ISSETUP=0&V_TSYSTRANS.ISACTIVE=%3DY&show_all=true&queryindex_-1=-1", "resulthandler": "/html/nds/portal/table_result.jsp", "totalRowCount": 1041}`;
            executeQuery(down_type_param, function(result){
                var r_match = result.match(/javascript:pc\.mo\(\d+\)/g);
                if(r_match===null){
                    layer.msg('数据下载类型没有设置吧！我这边查不到哦╮(╯▽╰)╭');
                    return;
                };
                var id = r_match[0].match(/\d+/g)[0]; // 筛选目标ID  如果有多个 只取第一个
                setStoreDownType(id, settingOpt.public.store.isSetUp); //设置店仓下载类型
            });
        };

        //设置店仓下载类型
        function setStoreDownType(id, ck){
            var issetup = Number(ck);
            var param_str = '{"command": "ProcessObject", "nds.control.ejb.UserTransaction": "N", "masterobj": {"issetup": "' + issetup + '", "id": '+ id +', "table": 17787, "namespace": "", "tablename": "V_TSYSTRANS", "directory": "V_TSYSTRANS_LIST", "fixedcolumns": "", "copyfromid": null}, "callbackEvent": "SaveObject"}';
            executeSave(param_str, function(response){
                console.log(response);
                layer.msg("店仓下载类型重置成功");
            });
        };

        function executeQuery(param, callback,...args){
            Controller.query(param, function(response){
                var result = response.evalJSON();
                if(result.code !== 0){
                    layer.msg(result.message); // 提示错误信息
                }else{
                    callback(result.data.pagecontent);
                };
            });

        };

        function executeSave(param, callback){
            Controller.handle(param, function(response){
                var result = response.evalJSON(); // 转换为JSON对象
                if(result.code < 0){
                    layer.msg(result.message); //提示错误信息
                }else{
                    callback(result.data);
                };
            });
        };

    });
});
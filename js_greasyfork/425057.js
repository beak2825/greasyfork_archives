// ==UserScript==
// @name         2021PMP报名考试预约抢座油猴插件
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  PMP报名考试预约抢座油猴插件
// @author       XieXiongKun  714801013@qq.com
// @match        http://*.chinapmp.cn/*
// @grant unsafeWindow
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/425057/2021PMP%E6%8A%A5%E5%90%8D%E8%80%83%E8%AF%95%E9%A2%84%E7%BA%A6%E6%8A%A2%E5%BA%A7%E6%B2%B9%E7%8C%B4%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/425057/2021PMP%E6%8A%A5%E5%90%8D%E8%80%83%E8%AF%95%E9%A2%84%E7%BA%A6%E6%8A%A2%E5%BA%A7%E6%B2%B9%E7%8C%B4%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function insertUserForm(){
        if($('#chinapmpForm').length>0){
            return;
        }
        //生成可视化form表单
        $('body').prepend(`<form id="chinapmpForm"><table class="table table-bordered" data-sort="sortDisabled">
    <tbody>
        <tr class="firstRow">
            <td valign="top" style="word-break: break-all; border-color: rgb(221, 221, 221);" width="135.33333333333334">
                用户名(基金会)
            </td>
            <td valign="top" style="word-break: break-all; border-color: rgb(221, 221, 221);" width="148.33333333333331">
                <input style="text-align: left; width: 150px;" title="Login_uName" value="" name="Login_uName" orgheight="" orgwidth="150" orgalign="left" orgfontsize="" orghide="0" leipiplugins="text" orgtype="text"/>
            </td>
            <td valign="top" style="word-break: break-all; border-color: rgb(221, 221, 221);" width="103.33333333333333">
                密码(基金会)
            </td>
            <td valign="top" style="border-color: rgb(221, 221, 221); word-break: break-all;" width="288.3333333333333">
                <span leipiplugins="select"><input name="Login_uPass" type="password" title="Login_uPass" value="" leipiplugins="text" orghide="0" orgalign="left" orgwidth="150" orgtype="text" style="text-align: left; width: 150px;" orgfontsize="" orgheight=""/></span>
            </td>
        </tr>
        <tr>
            <td valign="middle" style="word-break: break-all; border-color: rgb(221, 221, 221);" rowspan="1" colspan="4" align="center">
                约考信息
            </td>
        </tr>
        <tr>
            <td valign="top" style="word-break: break-all; border-color: rgb(221, 221, 221);" width="78.00000000000001">
                姓
            </td>
            <td valign="top" style="border-color: rgb(221, 221, 221); word-break: break-all;" width="148.33333333333331">
                <input name="Xing" type="text" title="Xing" value="" leipiplugins="text" orghide="0" orgalign="left" orgwidth="150" orgtype="text" style="text-align: left; width: 150px;" orgfontsize="" orgheight=""/>
            </td>
            <td valign="top" style="word-break: break-all; border-color: rgb(221, 221, 221);" width="105">
                名
            </td>
            <td valign="top" style="border-color: rgb(221, 221, 221); word-break: break-all;" width="288.3333333333333">
                <input name="Ming" type="text" title="Ming" value="" leipiplugins="text" orghide="0" orgalign="left" orgwidth="150" orgtype="text" style="text-align: left; width: 150px;"/>
            </td>
        </tr>
        <tr>
            <td valign="top" colspan="1" rowspan="1" style="border-left-color: rgb(221, 221, 221); border-top-color: rgb(221, 221, 221); word-break: break-all;">
                培训机构
            </td>
            <td valign="top" colspan="1" rowspan="1" style="border-left-color: rgb(221, 221, 221); border-top-color: rgb(221, 221, 221);">
                <input name="Peixunjigou" type="text" title="Peixunjigou" value="" leipiplugins="text" orghide="0" orgalign="left" orgwidth="150" orgtype="text" style="text-align: left; width: 150px;"/>
            </td>
            <td valign="top" colspan="1" rowspan="1" style="border-left-color: rgb(221, 221, 221); border-top-color: rgb(221, 221, 221); word-break: break-all;">
                PMI用户名<br/>
            </td>
            <td valign="top" colspan="1" rowspan="1" style="border-left-color: rgb(221, 221, 221); border-top-color: rgb(221, 221, 221);">
                <input name="PMIUname" type="text" title="PMIUname" value="" leipiplugins="text" orghide="0" orgalign="left" orgwidth="150" orgtype="text" style="text-align: left; width: 150px;"/>
            </td>
        </tr>
        <tr>
            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">
                PMI密码<br/>
            </td>
            <td valign="top" colspan="1" rowspan="1">
                <input name="PMIUpass" type="password" title="PMIUpass" value="" leipiplugins="text" orghide="0" orgalign="left" orgwidth="150" orgtype="text" style="text-align: left; width: 150px;"/>
            </td>
            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">
                PMI ID<br/>
            </td>
            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">
                <input name="PMIID" type="text" title="PMIID" value="" leipiplugins="text" orghide="0" orgalign="left" orgwidth="150" orgtype="text" style="text-align: left; width: 150px;"/>
            </td>
        </tr>
        <tr>
            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">
                有效期开始<br/>
            </td>
            <td valign="top" colspan="1" rowspan="1">
                <input name="PMItimeB" type="text" placeholder="2020-11-21"  title="PMItimeB" value="" leipiplugins="text" orghide="0" orgalign="left" orgwidth="150" orgtype="text" style="text-align: left; width: 150px;"/>
            </td>
            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">
                有效期结束
            </td>
            <td valign="top" colspan="1" rowspan="1">
                <input name="PMItimeE" type="text" placeholder="2021-11-21" title="PMItimeE" value="" leipiplugins="text" orghide="0" orgalign="left" orgwidth="150" orgtype="text" style="text-align: left; width: 150px;"/>
            </td>
        </tr>
        <tr>
            <td valign="top" colspan="1" rowspan="1" style="word-break: break-all;">
                考点(多个以/分割)
            </td>
            <td valign="top" colspan="3" rowspan="1" style="word-break: break-all;">
                <input name="Kaodian" type="text" placeholder="昆明/南宁/成都" title="Kaodian" value="" leipiplugins="text" orghide="0" orgalign="left" orgwidth="300" orgtype="text" style="text-align: left; width: 300px;" orgfontsize="" orgheight=""/>
            </td>
        </tr>
        <tr>
            <td valign="middle" colspan="4" rowspan="1" style="word-break: break-all;" align="center"><button type="button" id="chinapmpFormSubmit">提交</button></td>
        </tr>
    </tbody>
</table></form>`);
        for(let inputName in chinapmpForm){
            $('#chinapmpForm').find('[name="'+inputName+'"]').val(chinapmpForm[inputName]);
        } $('#chinapmpFormSubmit').click(function () {
            let formList = $('#chinapmpForm').serializeArray();
            formList.forEach(function (kvObj) {
                chinapmpForm[kvObj.name] = kvObj.value;
            });
            GM_setValue('chinapmpForm',JSON.stringify(chinapmpForm));
            location.reload();
        });
    }
    function removeUserForm(){
        $('#chinapmpForm').remove();
    }
    GM_registerMenuCommand('修改配置信息',insertUserForm);
    GM_registerMenuCommand('关闭配置信息',removeUserForm);
    let chinapmpForm=GM_getValue('chinapmpForm');
    if(!chinapmpForm){
        chinapmpForm = {};
        insertUserForm();
        return;
    }else{
        chinapmpForm = JSON.parse(chinapmpForm);
    }
    if(location.href.indexOf('/Error')>0 || location.href.indexOf('/null')>0){
        if(window.sessionStorage.getItem('current_href')){
            location.href = window.sessionStorage.getItem('current_href');
        }else{
            location.href = 'http://exam.chinapmp.cn';
        }
        return;
    }

    window.sessionStorage.setItem('current_href',location.href);
    if($('head').children().length<1 || $('script').length<1){
        location.reload();
        return;
    }
    let recentlyTime = 0,workMap={};
    $.ajaxSetup({
        beforeSend:function(XMLHttpRequest){
            recentlyTime = new Date().getTime();
        }
    });
    function overtimeReloadPage(work,duration){
        if(workMap[work]>3 && recentlyTime>0 && new Date().getTime()-recentlyTime>duration*2){
            location.reload();
        }
        workMap[work] = workMap[work]?workMap[work]+1:1;
    }
    if(location.href.indexOf('exam.chinapmp.cn')>0){
        if($('head').children().length<1){
            location.reload();
            return;
        }

        if($('#uLogin').length<1){
            let rei = window.sessionStorage.getItem('redirect_examsign_info');
            if(rei === 'true' || rei !=='false' && confirm('是否确认跳转到报考页面?')){
                 location.href = 'http://user.chinapmp.cn/examsign;info.shtml';
                 window.sessionStorage.setItem('redirect_examsign_info','true');
             }else{
                 window.sessionStorage.setItem('redirect_examsign_info','false');
             }
            return;
        }

        //修改: 用户名(国际人才交流基金会官网)
        $('#Login_uName').val(chinapmpForm['Login_uName']);
        //修改: 密码(国际人才交流基金会官网)
        $('#Login_uPass').val(chinapmpForm['Login_uPass']);
        window.setInterval(()=>{
                    overtimeReloadPage('uLogin',5000);
                    $('#uLogin').click();
                    console.log('重试登录!');
                    window.alert = function(str) { return; }
        },5000);
        const interId = window.setInterval(()=>{
            console.log('重试加载核心js组件!');
            jQuery.getScript("http://exam.chinapmp.cn/App_Ajax/ajaxscript;SHOW.Ajax.Exam.Login,SHOW.Ajax;.ajax?from=http%3a%2f%2fuser.chinapmp.cn%2fexamsign%3binfo.shtml&domain=exam", function(){
                clearInterval(interId);
            });
        },5000);

    }else if(location.href.indexOf('user.chinapmp.cn/index.shtml')>0){
        //登录成功
        let rei = window.sessionStorage.getItem('redirect_examsign_info');
            if(rei === 'true' || rei !=='false' && confirm('是否确认跳转到报考页面?')){
                 location.href = 'http://user.chinapmp.cn/examsign;info.shtml';
                 window.sessionStorage.setItem('redirect_examsign_info','true');
             }else{
                 window.sessionStorage.setItem('redirect_examsign_info','false');
             }
    }else if(location.href.indexOf('user.chinapmp.cn/examsign;info.shtml')>0){
        //疫情告知书
        if($('head').children().length<1){
            location.reload();
            return;
        }

        $('input[value*="确认个人信息无误，下一步"]').one('click',function(){
            GM_setValue('auto_click',true);
            window.setInterval(()=>{
                overtimeReloadPage('noError',5000);
                $('input[value*="确认个人信息无误，下一步"]').click();
                console.log('重试确认信息无误!');
                window.alert = function(str) { return; }
            },5000);
        });
        //第二次自动确认个人信息无误，下一步
        if(GM_getValue('auto_click') === 'true'){
            $('input[value*="确认个人信息无误，下一步"]').click();
        }

        let examsignLoad=false;
        const examsignInter = window.setInterval(()=>{
            console.log('重试加载核心js组件!');
            jQuery.getScript("http://user.chinapmp.cn/user/script/examsign.js?v=202008102151", function(){
                if(examsignLoad)return;
                examsignLoad = true;
                window.clearInterval(examsignInter);
                window.alert = function(str) { return; }
                let numRegex = /\d+/g;
                setTimeout(()=>{
                    numRegex.lastIndex = 0;
                    if(!numRegex.test($('#clause_yes').text())){
                        location.reload();
                    }else{
                        const clauseYesInter = window.setInterval(()=>{
                            numRegex.lastIndex = 0;
                            if(!numRegex.test($('#clause_yes').text())){
                                overtimeReloadPage('clause_yes',1000);
                                $('#clause_yes').click();
                                window.clearInterval(clauseYesInter);
                            }
                        },1000);
                    }
                },1000);


            });
        },5000);

    }
    else if(location.href.indexOf('user.chinapmp.cn/examsign;sign.shtml')>0){
        if($('head').children().length<1 || $('#Xing').length<1){
            location.reload();
            return;
        }

        //自动填充内容
        $('input[type="radio"][value="101"]').click();
        //修改: 姓
        $('#Xing').val(chinapmpForm['Xing']);
        //修改: 名
        $('#Ming').val(chinapmpForm['Ming']);
        //修改: 培训机构名称
        let peixun = $('#Peixunjigou').find('option:contains("' + chinapmpForm['Peixunjigou'] +'")');
        $('#Peixunjigou').val(peixun.attr('value'));
        //修改: 用户名(PMI官网)
        $('#PMIUname').val(chinapmpForm['PMIUname']);
        //修改: 密码(PMI官网)
        $('#PMIUpass').val(chinapmpForm['PMIUpass']);
        //修改: PMI ID(PMI官网)
        $('#PMIID').val(chinapmpForm['PMIID']);
        //修改: PMI英文有效期(开始)
        $('#PMItimeB').val(chinapmpForm['PMItimeB']);
        //修改: PMI英文有效期(结束)
        $('#PMItimeE').val(chinapmpForm['PMItimeE']);
        //修改: 考点标记颜色
        let kaodian = $({});
        chinapmpForm['Kaodian'].split('/').forEach(function (kd) {
            if(!kaodian){
                kaodian = $('#Kaodian').find('option:contains("' + kd +'")').css({backgroundColor:'#90ee90'});
            }else{
                kaodian.add($('#Kaodian').find('option:contains("' + kd +'")').css({backgroundColor:'#90ee90'}));
            }
        });

        $('#Kaodian').change(function(){
            GM_setValue('prev_kaodian_selected',$(this).val());
        });
        if(kaodian.length>0){
            //默认选中第一个
            if(GM_getValue('prev_kaodian_selected')){
                $('#Kaodian').val(GM_getValue('prev_kaodian_selected'));
            }else{
                $('#Kaodian').val(kaodian.first().attr('value'));
                $('#Kaodian').trigger('change');
            }

        }else{
            //考点未开放,每隔一段时间刷新下页面
            window.setTimeout(()=>{
                location.reload();
            },Math.random()*60*1000);
        }

        $('input[value="完成报名"]').one('click',function(){
            window.setInterval(()=>{
                overtimeReloadPage('finishApply',5000);
                $('input[value="完成报名"]').click();
                console.log('重试完成报名!');
                window.alert = function(str) { return; }
            },5000);
        });
    }


})();



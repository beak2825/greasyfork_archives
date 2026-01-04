// ==UserScript==
// @name         公示系统优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  公示系统优化!
// @author       You
// @match        http://sdxy.gov.cn:8888/auth/pub/login*
// @match        http://sdxy.gov.cn:8888/auth/pub/user/resetold
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469837/%E5%85%AC%E7%A4%BA%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/469837/%E5%85%AC%E7%A4%BA%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    1、去除讨厌弹窗
    2、自动跳转联络员登录页
    3、保存session,防止关闭
    4、2022-7-5 增加验证码保存功能，并2小时后过期重新赋值
    5、2023年7月20日09:55:18 增加快速重置【个体/合作社】密码及自动填写密码功能
    */

    // Your code here...
    //document.getElementById('logDialog').parentNode
    //$('#logDialog').parent()[0];


    //$('#ui-id-3').parent().parent()[0].remove();//移除二维码刷新提示框

    //getForm();
    var regno = "";//统一社会信用代码/注册号
    var cerno = "";//联络员身份证号
    var validatecode = "";//验证码
    var validatecodeTime = "";//验证码获取时间，超过两小时赋空
    var regnoFlag = false;//是否修改标志1
    var cernoFlag = false;//是否修改标志2
    let mPwd = 'Aa123456?';



    //***************************session begin*************
    if(window.location.pathname=="/auth/pub/user/resetold"){
        let resetPwd = document.querySelector('#pwd1');
        let resetPwdAgin = document.querySelector('#pwd2');
        if (resetPwd && resetPwdAgin) {
            resetPwd.type = 'text';
            resetPwdAgin.type = 'text';
            resetPwd.value = mPwd;
            resetPwdAgin.value = mPwd;
        }

    }
    if(window.location.pathname=="/auth/pub/login" || window.location.pathname=="/auth/pub/loginerror"){
        //个体.农专自动填充密码Aa123456?
        let loginPwd = document.querySelector('#qypwd');
        if (loginPwd) {
            loginPwd.type = 'text';
            loginPwd.value = mPwd;
        }

        //***个体.农专自动填充结束

        $('#ui-id-1').next()[0].click();
        $('#liaison').click();
        var button1 = document.createElement('button');
        button1.id = 'wowowo';
        button1.className = 'btn btn-primary';
        button1.style="margin-right: 20px;margin-left: -20px;"
        button1.textContent = '后悔药';
        $('#btnlogin').parent().prepend(button1);
        button1.onclick = function(){
            if(sessionStorage.getItem('regno')==null||sessionStorage.getItem('regno')==""||sessionStorage.length==0){
                return ;
            }
            /*判断验证码时间是否超过2小时*/
            codeOverTime();
            /**/
            if($('#regno').val()==sessionStorage.getItem('regno')){
                $('#regno').focus().select();
                $('#regno').val('');
                $('#cerno').focus().select();
                $('#cerno').val('');
                $('#validatecode').focus().select();
                $('#validatecode').val('');
            }else{
                $('#regno').focus().select();
                $('#regno').val(sessionStorage.getItem('regno'));
                $('#cerno').focus().select();
                $('#cerno').val(sessionStorage.getItem('cerno'));
                $('#validatecode').focus().select();
                $('#validatecode').val(sessionStorage.getItem('validatecode'));
            }


        }

        //input失去焦点事件
        $('#regno')[0].onblur = function(){
            //setSessionStorageTagName('regno');
            //regno = $('#regno').val();

            getSessionStorageTagName('regno');
        }
        $('#cerno')[0].onblur = function(){
            //cerno = $('#cerno').val();
            getSessionStorageTagName('cerno');
            //console.log(sessionStorage.getItem('cerno'));
        }
        $('#validatecode')[0].onblur = function(){

            getSessionStorageTagName('validatecode');
        }
    }


    function getSessionStorageTagName(tagName){//判断是否变化
        //console.log("regnoFlag:",regnoFlag,"                 cernoFlag",cernoFlag);
        var tagVal = $('#'+tagName).val();
        var getSes = sessionStorage.getItem(tagName);
        //         console.log(tagVal.length);
        //         console.log("tagVal:"+tagVal);
        //         console.log("getSes:"+getSes);
        if(tagVal == getSes || tagVal == ''){//两次输入一致或未输入，不满足不执行修改
            return;
        }

        if((tagVal.length!=18 && tagVal.length!=15) && tagName == 'regno') {//统一社会信用代码18位，注册号15位，不满足不执行修改
            //console.log("统一社会信用代码18位，注册号15位，不满足不执行修改");
            return;
        }
        console.log("统一社会信用代码/注册号位数认证通过");

        if(tagVal.length!=18 && tagName == 'cerno') {//身份证号不为18位，不满足不执行修改
            console.log("身份证号不为18位，不满足不执行修改");
            return;
        }
        console.log("身份证号位数认证通过");



        //开始设定修改标志

        regno = $('#regno').val();
        regnoFlag = true;

        cerno = $('#cerno').val();
        cernoFlag = true;

        validatecode = $('#validatecode').val();//验证码
        validatecodeTime = ((new Date().getFullYear())+'/'+(new Date().getMonth()+1)+'/'+(new Date().getDate())+'|'+(new Date().getHours()+':'+(new Date().getMinutes())));



        console.log(tagName,"验证通过：",tagVal);
        //查询regnoFlag、cernoFlag是否都是true，是则修改，否则不修改
        console.log("regnoFlag:",regnoFlag,"                 cernoFlag",cernoFlag,"                 验证码：",validatecode,"                 验证码时间：",validatecodeTime);
        if(regnoFlag == true && cernoFlag == true){
            regnoFlag = false;
            cernoFlag = false;
            sessionStorage.setItem('regno',regno);
            sessionStorage.setItem('cerno',cerno);
            //验证码不空切长度为6位时才保存
            if(validatecode.length == 6){
                sessionStorage.setItem('validatecode',validatecode);
                sessionStorage.setItem('validatecodeTime',validatecodeTime);
            }else{
                console.log("验证码长度不为6");
            }

            console.log("缓存成功");
        }
    }

    function codeOverTime(){/*判断验证码时间是否超过2小时*/
        var codetime = sessionStorage.getItem('validatecodeTime');
        if(codetime != ""){
            console.log(codetime);
            var timeArray = codetime.split("|");
            //             for(var i = 0;i<timeArray.length;i++){
            //                 console.log(timeArray[i]);
            //             }


            //对比现在的时间，先比较日，不同直接姜验证码与验证码时间赋值为空，再比较 小时，分钟是否大于两小时
            var nowtime = new Date();
            var ymh = (nowtime.getFullYear())+'/'+(nowtime.getMonth()+1)+'/'+(nowtime.getDate());
            if(ymh != timeArray[0]){
                console.log("年月日不同，缓存验证码与时间直接赋空");
                sessionStorage.setItem('validatecode','');
                sessionStorage.setItem('validatecodeTime','');
            }else{//年月日相同时，比较时间
                //小时 分钟 换算为分钟数，现在分钟数-缓存分钟数，大于60则过期，赋空
                var nowMin = parseInt(nowtime.getHours())*60 + parseInt(nowtime.getMinutes());
                var oldTimeArray = timeArray[1].split(':');
                var oldMin =  parseInt(oldTimeArray[0])*60 + parseInt(oldTimeArray[1]);
                //console.log("现在分钟数 - 缓存分钟数 = ",nowMin ,' - ',oldMin,' = ',(nowMin-oldMin));
                //计算过期时间
                var overtime = '';
                if((parseInt(oldTimeArray[0])+2)>=24){
                    overtime = (nowtime.getFullYear())+'/'+(nowtime.getMonth()+1)+'/'+(nowtime.getDate()+1)+'|'+(parseInt(oldTimeArray[0])+2-24)+':'+oldTimeArray[1];
                }else{
                    overtime = ymh +'|'+(parseInt(oldTimeArray[0])+2)+':'+oldTimeArray[1];
                }
                console.log("验证码已有",(nowMin-oldMin),"分钟(满120分钟过期失效,过期时间为)",overtime);
                if((nowMin-oldMin) >= 120){
                    console.log("验证码过期，缓存赋空请重新赋值");
                    sessionStorage.setItem('validatecode','');
                    sessionStorage.setItem('validatecodeTime','');
                }
            }

        }
    }






    //***************************session end*************
})();
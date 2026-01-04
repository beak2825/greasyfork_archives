// ==UserScript==
// @name         GetHuaqinUserName
// @namespace     http://huaqin.com/
// @version      0.5
// @description  根据工号获取姓名
// @author       AustinYoung
// @include      *
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      huaqin.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445408/GetHuaqinUserName.user.js
// @updateURL https://update.greasyfork.org/scripts/445408/GetHuaqinUserName.meta.js
// ==/UserScript==
// 使用说明:选择工号后双击Ctrl 即可根据工号查询姓名，并给出提示，提示上可以点击打开查询页面
(function() {
    'use strict';
    var selectText ='';
    var lastTime = 0, doubleCtrl =false;
    var queryFinished = true;
    document.addEventListener('keyup',
        function(event){
        if( event.keyCode === 17 ) // CTRL 键
        {
            var nowTime = new Date().getTime();
            console.log(lastTime,' -> ',nowTime)
            var diff = nowTime - lastTime;
            doubleCtrl =(diff<500 && diff>20); // 双击CTRL时间小于500ms
            lastTime = nowTime;
        }
        if( doubleCtrl )
        {
            // 防止重复查询
            doubleCtrl = false;
            // 获取选择内容
            selectText = window.getSelection().toString().trim();
            console.log('开始查询['+selectText+']')
            if(!queryFinished||selectText =='')
            {
                console.log('弹框','请等待，正在查询中或查询内容为空...')
                // GM_notification({
                //     text: '工号:  '+selectText ,
                //     title:'请等待，正在查询中或查询内容为空...',
                //     timeout: 3000
                // });
                return;
            }
            GM_notification({
                text: '工号:  '+selectText ,
                title:'查询中...',
                timeout: 3000
            });
            if(! /\d{4}/.test(selectText ))
            {
                // 华勤工号中必然包含4位及以上数字
                return;
            }
            var upperText = selectText.toUpperCase();
            var txtHint ='';
            if(upperText!=selectText)
            {
                selectText = upperText;
                txtHint =' 工号转为大写';
            }
            var userName = '';
            var isOn = false;
            console.log( selectText );
            queryFinished = false;
            GM_xmlhttpRequest({
                method: "get",
                // url: 'http://7ebf9a92ee35483290262fab4897a601-cn-shanghai.alicloudapi.com/username_by_id?employee_num=' + selectText,
                url: 'https://hq-fc-api.huaqin.com/2016-08-15/proxy/FnTest/DPTCommonDataAPI/username_by_id?employee_num=' + selectText,
                data: '' ,
                onload: function(res){
                    console.log('onload')
                    if(res.status === 200){
                        //console.log(res.responseText)
                        var jsonObj = JSON.parse(res.responseText);
                        if(jsonObj.data !=null)
                        {
                            if(jsonObj.data.length>0){
                                userName = jsonObj.data[0].employee_name;
                                isOn = jsonObj.data[0].curr_status==='Y'?1:0;
                                var txtOn ='';
                                if(isOn===0)
                                {
                                    txtOn ='[离职]';
                                }
                            }else
                            {
                                userName = '没有找到用户';
                            };
                            GM_notification({
                                text: '工号:  '+selectText+ txtHint ,
                                title:'姓名:  '+userName+txtOn,
                                timeout: 10000,
                                // highlight: true,
                                //  ondone: ()=>{alert('')},
                                onclick: ()=>{window.open('https://oss.huaqin.com/GetHuaqinUserName/?userID='+(selectText)+'&userName='+ (userName)+'&isOn='+ (isOn))}
                            })
                        }else{
                            console.log('失败2')
                            console.log(res)
                        }
                    }else{
                        console.log('失败')
                        console.log(res)
                    }
                    queryFinished = true;
                },
                onerror : function(err){
                    console.log('error')
                    console.log(err)
                    queryFinished = true;
                }
            });
        }
    });
})();

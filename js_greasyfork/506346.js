// ==UserScript==
// @name         必应积分自动脚本（Bing Rewards Script）
// @namespace    https://github.com/yclown/myTamperMokey
// @version      1.1.0
// @description  使用edge搜索，脚本会自动生成搜索字符,循环搜索直到达到指定次数（默认电脑端40，手机端30），次数到了之后不再搜索，在搜索页右边可重置或关闭脚本。按F12进入调式模式，切换成手机模式，可执行手机搜索
// @author       yclown

// @match        https://www.bing.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @original-script https://greasyfork.org/zh-CN/scripts/469680
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/506346/%E5%BF%85%E5%BA%94%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC%EF%BC%88Bing%20Rewards%20Script%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/506346/%E5%BF%85%E5%BA%94%E7%A7%AF%E5%88%86%E8%87%AA%E5%8A%A8%E8%84%9A%E6%9C%AC%EF%BC%88Bing%20Rewards%20Script%EF%BC%89.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    //电脑版搜索次数
    var max_pc=40;
    //手机版搜索次数
    var max_ph=30;
    //默认60秒一次搜索
    var Timer=60;
   
    GM_addStyle("#reward_tool {position: fixed;right: 30px;top: 200px;background: white;}")
    var tab=document.querySelector('body');
    var div = '<div id="reward_tool">\
                <a id="reward_finish">结束脚本</a><br />\
                <a id="reward_clean">重置搜索</a>\
                <p id="reward_info"></p>\
                </div>';
    tab.insertAdjacentHTML('beforeend',div);	//插入元素内部的最后一个子节点之后
    $("body").on("click","#reward_clean",function(){
        CleanCount() 
    })
    $("body").on("click","#reward_finish",function(){
        Finish();
    })
 
    var timer= setInterval(function () {
        // if(new Date().getHours()<8){
        //     clearInterval(timer)
        //     return;
        // } 
        var _c=GetConfig(); 
        ShowInfo(_c)
        if(max_ph<=_c.ph_count&&max_pc<=_c.pc_count){
            clearInterval(timer)
            // ShowScore()
            return
        }
        if(!IsPhone()&&max_pc<=_c.pc_count){
            return;
        }
        if(IsPhone()&&max_ph<=_c.ph_count){
            return;
        } 
        document.getElementById("sb_form_q").value=randomlyGeneratedChineseCharacters(parseInt(Math.random()*(5-2+1)+2));
        if(IsPhone()){
            _c.ph_count++;
        }else{
            _c.pc_count++;
        } 
        GM_setValue("bing_reword",JSON.stringify(_c));
        document.getElementById("sb_form_go").click(); 
    },Timer*1000)
 
 
    function IsPhone() {
        //获取浏览器navigator对象的userAgent属性（浏览器用于HTTP请求的用户代理头的值）
        var info = navigator.userAgent;
        //通过正则表达式的test方法判断是否包含“Mobile”字符串
        var isPhone = /mobile/i.test(info);
        //如果包含“Mobile”（是手机设备）则返回true
        return isPhone;
    }
 
    function GetConfig(){
       var _bingConfig= GM_getValue("bing_reword");
        if(!_bingConfig){
 
            _bingConfig={
                date:new Date().Format("yyyy-MM-dd"),
                pc_count:0,
                ph_count:0
            }
        }else{
            _bingConfig=JSON.parse(_bingConfig)
            if(_bingConfig.date!=new Date().Format("yyyy-MM-dd")){
                _bingConfig={
                    date:new Date().Format("yyyy-MM-dd"),
                    pc_count:0,
                    ph_count:0
                }
            }
        }
 
        
        return _bingConfig;
    }
    function ShowInfo(config){
        var s=''
        s+=config.pc_count<max_pc?'电脑搜索未完成':''
        s+=config.ph_count<max_ph?'手机搜索未完成':''
        if(s=='') s='今日已完成'
        
        document.getElementById("reward_info").innerText=s; 
    }
 
    //重置按钮 显示在搜索页的右边
    function CleanCount(){
        GM_setValue("bing_reword",JSON.stringify({
                    date:today,
                    pc_count:0,
                    ph_count:0
                }));
        alert("ok")
        location.reload();
    }
 
    function Finish(){ 
        GM_setValue("bing_reword",JSON.stringify({
            date:today,
            pc_count:max_pc,
            ph_count:max_ph
        }));
        alert("ok")
 
    }
    //随机中文字符
    function randomlyGeneratedChineseCharacters(num) {
        let arr = []
        for (let i = 0; i < num; i++) {
            let str
            //汉字对应的unicode编码为u4e00-u9fa5转为10进制为19968-40869，先取随机数，再转为16进制
            str = '\\u' + (Math.floor(Math.random() * (40869 - 19968)) + 19968).toString(16)
            //在用正则操作数据后进行解码。注意：unescape() 函数在 JavaScript 1.5 版中已弃用。请使用 decodeURI() 或 decodeURIComponent() 代替。
            str = unescape(str.replace(/\\u/g, "%u"));
            arr.push(str)
        }
        let chinese = arr.join("")
        return chinese
    }
    //日期格式化
    Date.prototype.Format = function (fmt) {
        var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    var today=new Date().Format("yyyy-MM-dd");
 
 
    function ShowScore(){
       
        let myRequest = new Request('https://cn.bing.com/rewards/panelflyout/getuserinfo?channel=BingFlyout&partnerId=BingRewards'); 
        fetch(myRequest)
        .then(response => response.json())
        .then(data => {
            let datas=data.userInfo.promotions.filter(function(ele){
                return ele.attributes.type='urlreward'&&ele.attributes.complete=="False"&&ele.attributes.hidden!='True'&&ele.attributes.max!="0"
 
            })
            console.log(datas)
            for(var i in datas){
                let p=datas[i];
                window.open(p.attributes.destination)
            } 
        });
    }
 
 
 
})();
// ==UserScript==
// @name 电信
// @namespace http://tampermonkey.net/
// @version 2.8
// @description  dianxin
// @author jy
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @require https://greasyfork.org/scripts/370885-parse-js-sdk/code/parse%20js%20sdk.js?version=617974
// @match  http://d.gd.189.cn/*
// @match  https://d.gd.189.cn/*
// @grant  GM_xmlhttpRequest
// @grant  GM_addStyle
// @grant  GM_registerMenuCommand
// @grant  GM_getValue
// @grant  GM_setValue
// @grant  GM_openInTab
// @grant  unsafeWindow
// @grant  GM_notification
// @downloadURL https://update.greasyfork.org/scripts/370444/%E7%94%B5%E4%BF%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/370444/%E7%94%B5%E4%BF%A1.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function getDateName(){
        var date=new Date();//Tue Jul 16 01:07:00 CST 2013的时间对象
        //console.log(date)
        var year=date.getFullYear();//年
        var month=date.getMonth()+1;//月份（月份是从0~11，所以显示时要加1）
        var day=date.getDate();//日期
        var str=year+''+month+''+day;
        return str;
    }
    var mjq=jQuery.noConflict(true);
    var isRun=true;
    var max=5;
    var min=1;

    Parse.initialize("dianxin", "","nicaibudaone");
    Parse.serverURL = 'http://data.jasdit.com:1337/parse'

    async function ajax(url) {
        return new Promise(function (resolve, reject) {
            let ajaxSetting = {
                url: url,
                success: function (response) {
                    resolve(response);
                },
                error: function () {
					alert("error!!!!!!"+url)
                    reject("请求失败");
                },
                dataType:'json'
            }
            mjq.ajax(ajaxSetting);

        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    //var urlBase='http://132.121.101.140:8001'
    var urlBase='http://d.gd.189.cn'
    async function findlist()
    {
        var Todo = Parse.Object.extend("Info");

        for(var i=GM_getValue("no",10000);i<GM_getValue("no2",999999);i++){
            console.log(i);
            if(!isRun){
                break;
            }
            var no='ADSLD'+i;
            //console.log(mjq)
            var url=urlBase+"/crmweb/bizprov/portal/loadOfferBase.action?qryType=ACC_NBR&qryValue="+no+"&_=1531041937265"
            //var url="http://132.121.101.140:8001/crmbs/bizprov/portal/qryCust.action?qryType=ACC_NBR&qryValue="+no+"&vague=false&_="+new Date()
            let r = await ajax(url);
            var time=Math.floor(Math.random()*(max-min+1)+min);
            await sleep(time*1000);
            if(r && r.length>0){
                var name=r[0].custName
                var servId=r[0].servId
                console.log(no,name,r[0])
                var url2=urlBase+"/crmweb/ordermgr/orderserveinfo/getOrderTreeNew.action?servId="+servId+"&infoCodeStr=SERV,CUSTINFO,ATTR,EQPT,DIALACCT,DIALATTR,SUBPROD,SUBATTR,CERTINFO,ADDR,SERVEXTATTR,LINKMAN,CUSTSERV%20Name"
                let r2 = await ajax(url2);
                time=Math.floor(Math.random()*(max-min+1)+min);
                await sleep(time*1000);
                console.log(r2);
				/*
                var url3=`${urlBase}/crmbs/bizprov/portal/getEightAndOne.action?type=ACC_NBR&number=${no}`
                let r3= await ajax(url3)
                time=Math.floor(Math.random()*(max-min+1)+min);
                await sleep(time*1000);
                let infos =[]
                if(r3.data){
                    if(r3.data.length>0){
                        infos =r3.data[0].infos
                    }
                }*/
                //let url4=`${urlBase}/crmbs/bizprov/portal/qryCust.action?qryType=ACC_NBR&qryValue=${no}&vague=false&_=1531751710456`
                //let custInfo=await ajax(url4)
                //time=Math.floor(Math.random()*(max-min+1)+min);
                //await sleep(time*1000);
                //console.log(no,name,r2.servInfo.serv.addName,r2.servInfo.serv.conphone)
                mjq('#msgbox').html(no+'找到资料 '+name)
                //console.log(localStorage.getItem("CUST_BS"));



                var query = new Parse.Query(Todo);
				/*
                query.equalTo("certNbr", custInfo.certNbr);
                let results= await query.find()
                if(results.length>0){
                    //continue;
                }*/


                var todo = new Todo();
                todo.set('no', no);
                todo.set('name', name);
               // todo.set('addname2',"");//custInfo.postAddr);
                //todo.set('addname', r2.servInfo.serv.addName);
                todo.set("phone","");//custInfo.linkPhone);
               // todo.set('phone2', r2.servInfo.serv.conphone);
                todo.set('certNbr',"");//custInfo.certNbr);
                todo.set('date',getDateName());
				/*
                console.log(infos)
                for(let j in infos){

                    todo.set("info"+j,infos[j].lalue)
                }*/
                let saveResult=await todo.save();
				//console.log(todo)
                mjq('#msgbox').html('成功保存:'+no);
                //todo.set('content', '每周工程师会议，周一下午2点');
                /*
                todo.save().then(function (todo) {
                    // 成功保存之后，执行其他逻辑.
                    //console.log('New object created with objectId: ' + todo.id);
                }, function (error) {
                    // 异常处理
                    console.error('Failed to create new object, with error message: ' + error.message);
                });
				*/

                time=Math.floor(Math.random()*(max-min+1)+min);
                await sleep(time*1000);
            }else{
                //console.log('else',no)
                mjq('#msgbox').html(no);
            }
            console.log(typeof i);

            GM_setValue("no",i+1);
            //console.log(time)
        }
         mjq('#msgbox').html('stop');
    }

    function setNos()
    {
        var noStore=prompt("请填写起始",GM_getValue("no",10000));
        if(noStore!=null){
            //console.log(JSON.parse(user));
            GM_setValue("no",noStore);
            alert('设置成功!');
        }
    }
	 function setNoe()
    {
        var noStore=prompt("请填写结束",GM_getValue("no2",999999));
        if(noStore!=null){
            //console.log(JSON.parse(user));
            GM_setValue("no2",noStore);
            alert('设置成功!');
        }
    }
    function stopRun(){
        isRun=false
    }

    function run(){
        //initConfig();
        //findLink();
        GM_registerMenuCommand('获取信息',findlist,"d1");
        GM_registerMenuCommand('停止获取',stopRun,"d2");
        GM_registerMenuCommand('起始设置',setNos,"d3");
        GM_registerMenuCommand('结束设置',setNoe,"d4");
    }
    mjq(function(){

        setTimeout(run,500);
        let msgBox=mjq('<div/>').css({'position':'fixed','bottom':'0','right':'0','background':'#fff','width':'200px','height':'70px','border':'1px solid #000'}).attr('id','msgbox')
        mjq('.logo').append(msgBox)
        //console.log(url);
    });
})();
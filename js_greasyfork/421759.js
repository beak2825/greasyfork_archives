// ==UserScript==
// @name         Cover问卷自动填写脚本
// @namespace    https://greasyfork.org/scripts/421759
// @version      0.4
// @description  问卷自动填写
// @author       nameless andy
// @match        https://cover-corp.com/contact
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/421759/Cover%E9%97%AE%E5%8D%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/421759/Cover%E9%97%AE%E5%8D%B7%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //常用常量、变量
    const AnameInput = document.querySelector("#wpforms-1187-field_1")
    const AemailInput = document.querySelector("#wpforms-1187-field_2")
    const AtitleInput = document.querySelector("#wpforms-1187-field_3")
    const AdespInput = document.querySelector("#wpforms-1187-field_4")
    const Awpform = document.getElementById("wpforms-form-1187")//一般

    const BnameInput = document.querySelector("#wpforms-1190-field_1")
    const BemailInput = document.querySelector("#wpforms-1190-field_2")
    const BtitleInput = document.querySelector("#wpforms-1190-field_3")
    const BdespInput = document.querySelector("#wpforms-1190-field_4")
    const Bwpform = document.getElementById("wpforms-form-1190")//企业

    const CnameInput = document.querySelector("#wpforms-2648-field_1")
    const CemailInput = document.querySelector("#wpforms-2648-field_2")
    const CtitleInput = document.querySelector("#wpforms-2648-field_3")
    const CdespInput = document.querySelector("#wpforms-2648-field_4")
    const Cwpform = document.getElementById("wpforms-form-2648")//取材のご依頼

    const DnameInput = document.querySelector("#wpforms-2399-field_1")
    const DemailInput = document.querySelector("#wpforms-2399-field_2")
    const DtitleInput = document.querySelector("#wpforms-2399-field_3")
    const DdespInput = document.querySelector("#wpforms-2399-field_4")
    const DtypeInput = document.querySelector("#wpforms-2399-field_6")
    const Dwpform = document.getElementById("wpforms-form-2399")//english

    const EnameInput = document.querySelector("#wpforms-2400-field_1")
    const EemailInput = document.querySelector("#wpforms-2400-field_2")
    const EtitleInput = document.querySelector("#wpforms-2400-field_3")
    const EdespInput = document.querySelector("#wpforms-2400-field_4")
    const Ewpform = document.getElementById("wpforms-form-2400")//中文

    const data_site_key = '6LcKHNMZAAAAAIHPRddKshmmiUOzWOodCCCs4SBO';
    var service_key = ''//填入你的2Captcha的servicekey
    const pageurl = 'https://cover-corp.com/contact'
    var apiurl = "https://2captcha.com/in.php?key=" + service_key + "&method=userrecaptcha&googlekey=" + data_site_key + "&pageurl=" + pageurl

    var TargetNameInput;
    var TargetEmailInput;
    var TargetTitleInput;
    var TargetDespInput;
    var TargetReCaptcha;
    var TargetWpform;

    if(!localStorage.mytarget){
        localStorage.mytarget="A"
    }

    var arrayname = null
    var arrayemail = null
    var arraytitle = null
    var arraydesp = null

    var longdesp = null

    if(!sessionStorage.mystatus){
        sessionStorage.mystatus="standby"
    }

    //standby,autofill,autosubmit

    //ui相关
    let div = document.createElement('div');//控制台
    let css = 'background: #ffffff;\
overflow: hidden;z-index: 999;\
position: fixed;padding:5px;\
text-align:center;\
width: 256px;\
height: 640px;box-sizing: content-box;\
border: 1px solid #87CEFA;\
border-radius: 5px;\
right: 10px;\
top: 15%;\
font-size:10px\
display: block\
';

    //主程序
    maincode_init()
    maincode_maincycle()


    //模块
    function maincode_init(){
        div.style.cssText = css;

        div.innerHTML = '\
<div id = "in_div">\
<p style="margin: 5px;" id="p_status">待机</p>\
<textarea cols="8" rows="2" id="in_name" style="margin: 5px;" placeholder="名字"></textarea>\
<textarea cols="8" rows="2" id="in_email" style="margin: 5px;" placeholder="邮箱"></textarea>\
<textarea cols="8" rows="2" id="in_title" style="margin: 5px;" placeholder="标题"></textarea>\
<textarea cols="8" rows="2" id="in_desp" style="margin: 5px;" placeholder="内容"></textarea>\
<input type="password" id="in_apikey" style="margin: 5px;" placeholder="2CaptchaApiKey（选填）"/>\
</div>\
<div id = "btn_div" style="float:left;">\
<button id="btn_fill" style="background: #87CEFA; color: #FFFFFF; margin: 5px; padding: 5px; font-size: 12px;">普通填空</button>\
<button id="btn_autofill" style=" background: #87CEFA; color: #FFFFFF; margin: 5px; padding: 5px; font-size: 12px;">自动填空</button>\
<button id="btn_autosubmit" style=" background: #87CEFA; color: #FFFFFF; margin: 5px; padding: 5px; font-size: 12px;">自动发送(需key)</button>\
<button id="btn_randomgenerate" style="background: #87CEFA; color: #FFFFFF; margin: 5px; padding: 5px; font-size: 12px;">内容自动生成</button>\
<button id="btn_saveconfig" style=" background: #87CEFA; color: #FFFFFF; margin: 5px; padding: 5px; font-size: 12px;">保存配置</button>\
<button id="btn_info" style=" background: #87CEFA; color: #FFFFFF; margin: 5px; padding: 5px; font-size: 12px;">使用说明</button>\
</div>\
<div id = "sel_div">\
<select id="sel">\
<option value ="optionA">一般の方</option>\
<option value ="optionB">企業の方</option>\
<option value="optionC">取材のご依頼</option>\
<option value="optionD">For English-speakers</option>\
<option value="optionE">对于中文</option>\
</select>\
</div>\
<div id = "cbox_div">\
<input type="checkbox" id="cbox_long">长文模式</input>\
</div>'
        div.style.setProperty('display','block');

        document.body.appendChild(div);

        document.getElementById('btn_fill').onclick = () => {
            if(sessionStorage.mystatus=="standby"){
                module_fill()
            }
        };

        document.getElementById('btn_autofill').onclick = () => {
            if(sessionStorage.mystatus=="standby"){
                if(module_isFull()>0){
                    sessionStorage.mystatus="autofill"
                    module_setStorage()
                    location.reload();
                }
            }
            else if(sessionStorage.mystatus=="autofill"){
                sessionStorage.mystatus="standby"
            }
        };


        document.getElementById('btn_autosubmit').onclick = () => {
            if(sessionStorage.mystatus=="standby"){
                if(module_isFull()>0){
                    sessionStorage.mystatus="autosubmit"
                    module_setStorage()
                    location.reload();
                }
            }
            else if(sessionStorage.mystatus=="autosubmit"){
                sessionStorage.mystatus="standby"
            }
        };

        document.getElementById('btn_info').onclick = () => {
            alert("欢迎使用问卷填写脚本！当前版本0.4\n"+
                  "这是一个辅助填写问卷的小脚本\n"+
                  "普通填写：根据下方的下拉菜单填写对应表单（需手动通过reCaptcha验证并提交）\n"+
                  "自动填写：当表单填写并提交后，重新载入页面时会自动填写下一项表单（需手动通过reCaptcha验证并提交，且需要localStorage支持）\n"+
                  "自动发送：如果你有2Captcha的有余额可用账号的话，输入你的apikey，脚本可以自动发送请求以通过reCaptcha验证并自动提交\n"+
                  "（可能提交失败，原因尚不明确。由于使用了GM_xmlhttpRequest，当前仅支持Tampermonkey版本且需要临时允许跨域请求）\n"+
                  "内容自动生成：向控制台四个框生成随机字符串\n"+
                  "长文模式：勾选此项时，“内容”一栏将视为一整篇文章复制，而非默认的一行一篇");
        };

        document.getElementById('btn_saveconfig').onclick = () => {
            module_setStorage();
            alert("保存完成！")
        };

        document.getElementById('btn_randomgenerate').onclick = () => {
            if(sessionStorage.mystatus=="standby"){
                document.getElementById('in_name').value = ''
                document.getElementById('in_email').value = ''
                document.getElementById('in_title').value = ''
                document.getElementById('in_desp').value = ''

                for(let i=0;i<20;i++){
                    document.getElementById('in_name').value += (module_randomstring(module_randomInt(10,20))+"\n")
                    document.getElementById('in_email').value += (module_randomstring(module_randomInt(10,20))+"@gmail.com\n")
                    document.getElementById('in_title').value += (module_randomstring(module_randomInt(10,20))+"\n")
                    document.getElementById('in_desp').value += (module_randomstring(module_randomInt(50,100))+"\n")
                }

                document.getElementById('in_name').value =
                    document.getElementById('in_name').value.substr(0,document.getElementById('in_name').value.length-1)
                document.getElementById('in_email').value =
                    document.getElementById('in_email').value.substr(0,document.getElementById('in_email').value.length-1)
                document.getElementById('in_title').value =
                    document.getElementById('in_title').value.substr(0,document.getElementById('in_title').value.length-1)
                document.getElementById('in_desp').value =
                    document.getElementById('in_desp').value.substr(0,document.getElementById('in_desp').value.length-1)
            }
        };
        module_getStorage();
    }

    function maincode_maincycle(){

        module_autofill()

        setInterval(function(){
            switch(sessionStorage.mystatus){
                case "standby":
                    document.getElementById('btn_fill').innerText = '普通填空'
                    document.getElementById('btn_autofill').innerText = '自动填空'
                    document.getElementById('btn_autosubmit').innerText = '自动发送(需KEY)'
                    document.getElementById('btn_randomgenerate').innerText = '内容自动生成'
                    document.getElementById('p_status').innerText = '待机'
                    document.getElementById('sel').disabled = false;
                    document.getElementById('cbox_long').disabled = false;
                    break;
                case "autofill":
                    document.getElementById('btn_fill').innerText = '暂不可用'
                    document.getElementById('btn_autofill').innerText = '终止'
                    document.getElementById('btn_autosubmit').innerText = '暂不可用'
                    document.getElementById('btn_randomgenerate').innerText = '暂不可用'
                    document.getElementById('p_status').innerText = '自动装填'
                    document.getElementById('sel').disabled = true;
                    document.getElementById('cbox_long').disabled = true;
                    break;
                case "autosubmit":
                    document.getElementById('btn_fill').innerText = '暂不可用'
                    document.getElementById('btn_autofill').innerText = '暂不可用'
                    document.getElementById('btn_autosubmit').innerText = '终止'
                    document.getElementById('btn_randomgenerate').innerText = '暂不可用'
                    document.getElementById('p_status').innerText = '自动发送'
                    document.getElementById('sel').disabled = true;
                    document.getElementById('cbox_long').disabled = true;
                    break;
                default:
                    document.getElementById('btn_fill').innerText = '暂不可用'
                    document.getElementById('btn_autofill').innerText = '暂不可用'
                    document.getElementById('btn_autosubmit').innerText = '暂不可用'
                    document.getElementById('btn_randomgenerate').innerText = '暂不可用'
                    document.getElementById('p_status').innerText = '错误:状态变量错误'
                    document.getElementById('sel').disabled = false;
                    document.getElementById('cbox_long').disabled = false;
                    break;
            }
        },100)

        module_autosubmit()
    }

    function module_randomInt(a,b){
        return parseInt(a+Math.random()*(b-a))
    }

    function module_randomstring(xlength){
        let result = ''
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        if(xlength>0){
            for(let i=0;i<xlength;i++){
                result += chars.charAt(module_randomInt(0,chars.length-1))
            }
        }else{
            for(let i=0;i<20;i++){
                result += chars.charAt(module_randomInt(0,chars.length-1))
            }
        }
        return result;
    }

    function module_setTarget(){
        switch(document.getElementById('sel').value){
            case "optionA":
                TargetNameInput = AnameInput
                TargetEmailInput = AemailInput
                TargetTitleInput = AtitleInput
                TargetDespInput = AdespInput
                TargetReCaptcha = document.getElementById("g-recaptcha-response")
                TargetWpform = Awpform
                break;
            case "optionB":
                TargetNameInput = BnameInput
                TargetEmailInput = BemailInput
                TargetTitleInput = BtitleInput
                TargetDespInput = BdespInput
                if(document.getElementById("wpforms-confirmation-1187")!=null){
                    TargetReCaptcha = document.getElementById("g-recaptcha-response")
                }else{
                    TargetReCaptcha = document.getElementById("g-recaptcha-response-1")
                }
                TargetWpform = Bwpform
                break;
            case "optionC":
                TargetNameInput = CnameInput
                TargetEmailInput = CemailInput
                TargetTitleInput = CtitleInput
                TargetDespInput = CdespInput
                if(document.getElementById("wpforms-confirmation-1187")!=null||
                   document.getElementById("wpforms-confirmation-1190")!=null){
                    TargetReCaptcha = document.getElementById("g-recaptcha-response-1")
                }else{
                    TargetReCaptcha = document.getElementById("g-recaptcha-response-2")
                }
                TargetWpform = Cwpform
                break;
            case "optionD":
                TargetNameInput = DnameInput
                TargetEmailInput = DemailInput
                TargetTitleInput = DtitleInput
                TargetDespInput = DdespInput
                if(document.getElementById("wpforms-confirmation-1187")!=null||
                   document.getElementById("wpforms-confirmation-1190")!=null||
                   document.getElementById("wpforms-confirmation-2648")!=null){
                    TargetReCaptcha = document.getElementById("g-recaptcha-response-2")
                }else{
                    TargetReCaptcha = document.getElementById("g-recaptcha-response-3")
                }
                TargetWpform = Dwpform
                break;
            case "optionE":
                TargetNameInput = EnameInput
                TargetEmailInput = EemailInput
                TargetTitleInput = EtitleInput
                TargetDespInput = EdespInput
                if(document.getElementById("wpforms-confirmation-1187")!=null||
                   document.getElementById("wpforms-confirmation-1190")!=null||
                   document.getElementById("wpforms-confirmation-2648")!=null||
                   document.getElementById("wpforms-confirmation-2399")!=null){
                    TargetReCaptcha = document.getElementById("g-recaptcha-response-3")
                }else{
                    TargetReCaptcha = document.getElementById("g-recaptcha-response-4")
                }
                TargetWpform = Ewpform
                break;
            default:
                TargetNameInput = AnameInput
                TargetEmailInput = AemailInput
                TargetTitleInput = AtitleInput
                TargetDespInput = AdespInput
                TargetReCaptcha = document.getElementById("g-recaptcha-response")
                TargetWpform = Awpform
                break;
        }
    }

    function module_nextTarget(){
        switch(document.getElementById('sel').value){
            case "optionA":
                document.getElementById('sel').value="optionB"
                break;
            case "optionB":
                document.getElementById('sel').value="optionC"
                break;
            case "optionC":
                document.getElementById('sel').value="optionD"
                break;
            case "optionD":
                document.getElementById('sel').value="optionE"
                break;
            case "optionE":
                document.getElementById('sel').value="optionA"
                break;
            default:
                document.getElementById('sel').value="optionA"
                break;
        }
        module_setStorage();
    }

    function module_getStorage(){

        document.getElementById('in_name').value = localStorage.getItem("StorageInName")
        document.getElementById('in_email').value = localStorage.getItem("StorageInEmail")
        document.getElementById('in_title').value = localStorage.getItem("StorageInTitle")
        document.getElementById('in_desp').value = localStorage.getItem("StorageInDesp")
        document.getElementById('in_apikey').value = localStorage.getItem("StorageInApiKey")

        if(sessionStorage.getItem("StorageSel")!=''){
            document.getElementById('sel').value = sessionStorage.getItem("StorageSel");
        }
        else{
            document.getElementById('sel').value = "optionA"
        }

        document.getElementById('cbox_long').checked = localStorage.getItem("StorageCboxLong")
    }

    function module_setStorage(){

        localStorage.setItem("StorageInName",document.getElementById('in_name').value)
        localStorage.setItem("StorageInEmail",document.getElementById('in_email').value)
        localStorage.setItem("StorageInTitle",document.getElementById('in_title').value)
        localStorage.setItem("StorageInDesp",document.getElementById('in_desp').value)
        localStorage.setItem("StorageInApiKey",document.getElementById('in_apikey').value)
        sessionStorage.setItem("StorageSel",document.getElementById('sel').value)
        localStorage.setItem("StorageCboxLong",document.getElementById('cbox_long').checked)
    }

    function module_arrayload(){
        arrayname = document.getElementById('in_name').value.split('\n');
        arrayemail = document.getElementById('in_email').value.split('\n');
        arraytitle = document.getElementById('in_title').value.split('\n');
        arraydesp = document.getElementById('in_desp').value.split('\n');

        longdesp = document.getElementById('in_desp').value
    }

    function module_isFull(){
        if(0==document.getElementById('in_name').value.length||
           0==document.getElementById('in_email').value.length||
           0==document.getElementById('in_title').value.length||
           0==document.getElementById('in_desp').value.length||
           0==document.getElementById('sel').value.length){
            alert("为空无法装填")
            return 0;
        }else{
            return 1;
        }
    }

    function module_fill(){
        if(module_isFull()<1){
            return;
        }
        module_arrayload()
        module_setTarget()
        TargetNameInput.value = arrayname[Math.random()*arrayname.length | 0];
        TargetEmailInput.value = arrayemail[Math.random()*arrayemail.length | 0];
        TargetTitleInput.value = arraytitle[Math.random()*arraytitle.length | 0];
        if(!document.getElementById('cbox_long').checked){
            TargetDespInput.value = arraydesp[Math.random()*arraydesp.length | 0];
        }else{
            TargetDespInput.value = longdesp
        }
    }

    function module_autofill(){
        if("autofill"==sessionStorage.mystatus){
            module_nextTarget();
            module_fill();
            module_setStorage();
        }else{
            return;
        }

    }

    function module_2Captcha(){

        if(''==document.getElementById('in_apikey').value){
            alert("ApiKey为空")
            sessionStorage.mystatus="standby"
            return;
        }
        service_key = document.getElementById('in_apikey').value;
        apiurl = "https://2captcha.com/in.php?key=" + service_key + "&method=userrecaptcha&googlekey=" + data_site_key + "&pageurl=" + pageurl;
        GM_xmlhttpRequest({
            method: "GET",
            url: apiurl,
            headers: { "contrn-type": "text/xml" },
            onload: function(response) {
                // code
                let text = response.responseText
                if(text.indexOf("OK")<=-1){
                    sessionStorage.mystatus="standby"
                    alert("ERROR:in.php出错:"+text)
                    return;
                }else{
                    let resid = response.responseText.slice(3)
                    let resurl = "https://2captcha.com/res.php?key=" + service_key + "&action=get&id=" + resid
                    let count = 0

                    let req2 = setInterval( function(){
                        document.getElementById('p_status').innerText = '自动发送:正在获取tokey'
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: resurl,
                            headers: { "contrn-type": "text/xml" },
                            onload: function(response2) {
                                // code
                                let text2 = response2.responseText
                                if(text2.indexOf("ERROR")>-1){
                                    sessionStorage.mystatus="standby"
                                    alert("ERROR:res.php出错:"+text2)
                                    return;
                                }
                                if(text2.indexOf("OK")>-1){
                                    module_setTarget();
                                    TargetReCaptcha.innerHTML=text2.slice(3);
                                    TargetWpform.submit()
                                    clearInterval(req2);
                                }else if(count>=180000/5000){
                                    sessionStorage.mystatus="standby"
                                    alert("ERROR:等待时间过长")
                                    return;
                                }
                                count=count+1;
                            }})
                    },5000 )
                    }
            }})

    }

    function module_autosubmit(){
        if("autosubmit"==sessionStorage.mystatus){
            module_nextTarget()
            module_fill()
            module_2Captcha()
        }
    }
})();
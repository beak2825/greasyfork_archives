// ==UserScript==
// @name         天眼验证码自动输入
// @namespace    https://fengwenhua.top
// @version      1.0.7
// @description  根据训练出来的模型，自动识别并填入验证码，参考 https://greasyfork.org/zh-CN/scripts/418942-%E4%B8%87%E8%83%BD%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5-%E5%8D%87%E7%BA%A7%E7%89%88?version=1013154
// @author       Panghoo
// @match        http://*/*
// @match        https://*/*
// @connect      127.0.0.1
// @connect      10.58.35.146
// @connect      101.43.162.57
// @connect      10.57.144.187
// @connect      *
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/react-trigger-change@1.0.2/dist/react-trigger-change.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @nocompat     Chrome
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475072/%E5%A4%A9%E7%9C%BC%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/475072/%E5%A4%A9%E7%9C%BC%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5.meta.js
// ==/UserScript==
class CaptchaWrite {
    // 存一下，直接全局
// @match        */skyeye/home/login*
// @match        */sensor/login*
// @match        */hwop/login*
// @match        *://10.58.35.90/login*
// @match        https://qgptmark01v.skyeye.bjat.qianxin-inc.cn/login
    getCaptchaServerUrl(){
        //return "http://101.43.162.57:5000/";
        //return "http://10.58.35.146:7777/";
        return "http://10.57.144.187:7777/";
        //return "http://127.0.0.1:7777/";
    }
    constructor() {
        this.Tip = this.AddTip();
        if (GM_listValues().indexOf("set") == -1) {
            GM_setValue("set", {
                "idCard": ""
            });
            console.log("验证码填入\n初始化完毕!\n");
        }

        Set = GM_getValue("set");
        // 设置自动识别初始值
        if(Set["autoIdentification"] == undefined ){
            Set["autoIdentification"]="true";
            GM_setValue("set", Set);
        }

        // 设置开启提示初始值
        if(Set["showHintCheck"] == undefined ){
            Set["showHintCheck"]="true";
            GM_setValue("set", Set);
        }

        // 设置崩溃后自动拉黑网站初始值
        if(Set["autoBlackList"] == undefined ){
            Set["autoBlackList"]="false";
            GM_setValue("set", Set);
        }
    }

    //手动添加规则
    PickUp() {
        console.log("手动添加规则 PickUp()");
        var that = this;
        var AddRule = {};
        var IdentifyResult = '';
        that.Hint('请对验证码图片点击右键！')
        $("canvas,img").each(function() {
            $(this).on("contextmenu", function() {

                var img = that.Aimed($(this));
                console.log('PickUp_Img:' + img);
                if($(img).length!=1){
                    that.Hint('验证码选择错误，该图片实际对应多个元素。')
                    return;
                }

                that.Hint('等待识别')
                IdentifyResult = that.Identify(img,function ManualRule(img,IdentifyResult){
                    if (img && IdentifyResult) {
                        console.log('记录信息' + img + IdentifyResult);
                        AddRule['img'] = img;
                        $("img").each(function() {
                            $(this).off("click");
                            $(this).off("on");
                            $(this).off("load");
                        });
                        that.Hint('接下来请点击验证码输入框');
                        console.log("接下来点击验证码输入框");
                        $("input").each(function() {
                            $(this).click(function() {
                                var input = that.Aimed($(this));
                                // console.log('PickUp_input' + input);
                                AddRule['input'] = input;
                                AddRule['path'] = window.location.href;
                                AddRule['title'] = document.title;
                                AddRule['host'] = window.location.host;
                                console.log("验证码输入框的相关信息：");
                                console.log(AddRule);
                                that.Write(IdentifyResult,input);
                                that.Hint('完成')
                                //移除事件
                                $("input").each(function() {
                                    $(this).off("click");
                                });
                                //添加信息
                                writeResultIntervals[writeResultIntervals.length]={"img":img,"input":input};
                                console.log("此时的规则：");
                                console.log(writeResultIntervals);
                                that.delCapFoowwLocalStorage(window.location.host);
                            });
                        });
                    }
                });


            });
        });
    }
    //创建提示元素
    AddTip() {
        var TipHtml = $("<div id='like996_identification'></div>").text("Text.");
        TipHtml.css({
            "background-color": "rgba(211,211,211,0.86)",
            "align-items": "center",
            "justify-content": "center",
            "position": "fixed",
            "color": "black",
            "top": "-5em",
            "height": "2em",
            "margin": "0em",
            "padding": "0em",
            "font-size": "1.2em",
            "width": "100%",
            "left": "0",
            "right": "0",
            "text-align": "center",
            "z-index": "9999999999999",
            "padding-top": "3px",
            display: 'none'

        });
        $("body").prepend(TipHtml);
        return TipHtml;
    }
    //展示提醒
    Hint(Content, Duration) {
        if(Set["showHintCheck"]!="true"){
            return;
        }
        var that = this;

        that.Tip.stop(true, false).animate({
            top: '-5em'
        }, 300, function() {
            Content += "<span style='color:red;float: right;margin-right: 20px;' onclick='document.getElementById(\"like_996_identification\").remove()'>X</span>";
            that.Tip.show();
            that.Tip.html(Content);

        });
        that.Tip.animate({
            top: '0em'
        }, 500).animate({
            top: '0em'
        }, Duration ? Duration : 3000).animate({
            top: '-5em'
        }, 500, function() {
            that.Tip.hide();
        });
        return;
    }
    //开始识别
    Start() {
        //检查配置中是否有此网站
        console.log("验证码 Start()");
        var that = this;
        var Pathname = window.location.href;
        writeResultInterval= setInterval(function(){that.WriteResultsInterval();},500);
        // 图片位置和输入框位置
        // 分析平台
        writeResultIntervals[0]={
            "img": "img[alt='']",
            "input": "input[placeholder='请输入图片验证码']"
        };
        // 传感器308
        writeResultIntervals[1]={
            "img": "#__qiankun_microapp_wrapper_for_login_sensor__ > div > div > div.login-form.login-form > div.login-form-wrap > div.form-item.form-item-code > div.q-tooltip.code-img > img",
            "input": "input[placeholder='请输入验证码']"
        };
        // 传感器309
        writeResultIntervals[2]={
            "img": "#__qiankun_microapp_wrapper_for_login_sensor__ > div > div > div.login-form > div > div.login-form-wrap > div.form-item.form-item-code > div.q-tooltip.code-img > img",
            "input": "input[placeholder='请输入验证码']"
        };
        // qbot
        writeResultIntervals[3]={
            "img": "#__qiankun_microapp_wrapper_for_login_sscp_standard__ > div > div.login-form.login-form > div > div:nth-child(4) > img",
            "input": "input[placeholder='请输入图片验证码']"
        };
        //沙箱
        writeResultIntervals[4]={
            "img": "img[src^='/api/v1/admin/code?']",
            "input": "input[placeholder='请输入验证码']"
        };
        //实战化
        writeResultIntervals[5]={
            "img": "#__qiankun_microapp_wrapper_for_login_sscp_standard__ > div > div.login-form.login-form > div:nth-child(4) > img",
            "input": "input[placeholder='输入验证码']"
        };
        // qbot1
        writeResultIntervals[6]={
            "img": "#__qiankun_microapp_wrapper_for_login_sscp_standard__ > div > div.login-form.login-form > div > div:nth-child(5) > img",
            "input": "input[placeholder='请输入图片验证码']"
        };
        // qbot v1001
        writeResultIntervals[7]={
            "img": "#__qiankun_microapp_wrapper_for_login_qgpt__> div > div.login-form.login-form > div > div:nth-child(4) > img",
            "input": "input[placeholder='请输入图片验证码']"
        };
        // 4060
        writeResultIntervals[8]={
            "img": "#__qiankun_microapp_wrapper_for_login_qgpt__ > div > div.login-form.login-form > div > div:nth-child(5) > img",
            "input": "input[placeholder='请输入图片验证码']"
        };
    }
    // 定时执行绑定验证码img操作
    WriteResultsInterval(){
        for(var i=0;i< writeResultIntervals.length;i++){
            var imgAddr=writeResultIntervals[i].img;
            var inputAddr=writeResultIntervals[i].input;
            if(document.querySelector(imgAddr)==null||document.querySelector(inputAddr)==null){
                continue;
            }
            try{
                if(this.getCapFoowwLocalStorage("err_"+writeResultIntervals[i].img)==null){// 写入识别规则之前，先判断她是否有错误
                    this.WriteResults(imgAddr, inputAddr);
                }
            }catch(e){
                window.clearInterval(writeResultInterval);
                this.addBadWeb(imgAddr,inputAddr);
                return;
            }
        }
    }
    //解析
    Identify_Crab(img,Base,callback) {
        //console.log("Identify_Crab() 解析");
        var that = this;
        var Results = that.getCapFoowwLocalStorage(Base.substring(Base.length-32));
        if(Results!=null){
            if(callback.name != 'ManualRule' ){// 不为手动直接返回结果
                return Results;
            }
        }
        that.setCapFoowwLocalStorage(Base.substring(Base.length-32),"识别中..",new Date().getTime()+(9999999 * 9999999));//同一个验证码只识别一次
        var url=that.getCaptchaServerUrl() + "api/verifyCaptcha";
        console.log("验证码变动，开始识别");
        console.log("位置：");
        console.log(img);
        let json_data = JSON.stringify({"img_b64":Base});
        GM_xmlhttpRequest({
            url: url,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            data:  json_data,
            responseType: "json",
            onload: obj => {
                var data=obj.response;
                console.log("验证码识别响应体:");
                console.log(data);
                if (data.status.indexOf("success")==-1) {
                    if(data.description != undefined){
                        that.Hint('识别请求发生错误： ' + data.description, 5000);
                    }
                    that.setCapFoowwLocalStorage(Base.substring(Base.length-32),data.description,new Date().getTime()+(9999999 * 9999999))

                } else {
                    Results = data.data;
                    if (Results.length < 4) {
                        that.Hint('验证码识别结果可能错误，请刷新验证码尝试', 5000)
                    }else{
                        that.Hint('验证码识别完成', 500)
                    }
                    that.setCapFoowwLocalStorage(Base.substring(Base.length-32),Results,new Date().getTime()+(9999999 * 9999999))
                    if(callback!=null){
                        if(callback.name=='WriteRule'){
                            callback(Results);
                        }else if(callback.name=='ManualRule'){
                            callback(img,Results);
                        }
                    }
                }
            },onerror: err => {
                console.log(err)
            }
        });

        return Results;
    }
    //识别操作
    Identify(img,callback) {
        //console.log("识别操作： Identify()");
        var that = this;
        var imgObj = $(img);
        if(!imgObj.is(":visible")){
            console.log("验证码不可见，本次不识别");
            return;
        }
        try{
            var imgBase64;
            var imgSrc=imgObj.attr("src");
            if(imgSrc!=undefined && imgSrc.indexOf("data:image/") == 0){
                // 使用base64页面直显
                imgBase64=imgSrc.replaceAll("\n", "");
            }else{
                // 使用canvas进行图片转换
                imgBase64=that.ConversionBase(img).toDataURL("image/png");
            }

            var pastDate = imgBase64;
            if(pastDate.length < 255){
                throw new Error("图片大小异常");
            }
        }catch(e){
            if(callback.name=='ManualRule'){
                that.Hint('跨域策略，请重新右键点击图片');
            }
            return;
        }
        //console.log("验证码位置：");
        //console.log(img);
        //console.log("验证码base64:");
        //console.log(pastDate);
        that.Identify_Crab(img,pastDate,callback);
    }
    //根据配置识别写入
    WriteResults(img, input) {
        //console.log("WriteResults()");
        var that = this;
        //创建一个触发操作
        if(document.querySelector(img)==null){
            return;
        }
        document.querySelector(img).onload = function() {
            that.WriteResults(img, input)
        }
        this.Identify(img,function WriteRule(vcode){
            that.Write(vcode, input)
        })

    }
    //写入操作
    Write(ResultsImg, WriteInput) {
        //console.log("Write()");
        //console.log(ResultsImg);
        //console.log(WriteInput);
        var that = this;
        WriteInput = document.querySelector(WriteInput);
        WriteInput.value = ResultsImg;
        // 加上这个，才能填入验证码
        reactTriggerChange(WriteInput);

    }
    // 各类事件
    //转换图片为：canvas
    ConversionBase(img) {
        img = document.querySelector(img);
        var imgCrossOrigin=img.getAttribute("crossOrigin");
        if(imgCrossOrigin != 'Anonymous'){
            img.setAttribute("crossOrigin",'Anonymous');// 设置允许跨域
            return;// 如果当前图片非跨域状态，停止识别
        }
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        return canvas;
    }
    //生成标识
    Aimed(Element) {
        // console.log('---根据元素创建配置信息---');
        Element = Element[0]
        var that = this;
        var ElementLocalName = Element.localName;
        var result;
        // 如果有vue的id，则直接返回
        var vueId=that.getDataV(Element);
        if(vueId != null){
            result = ElementLocalName+"["+vueId+"]";
            if( $(result).length == 1){
                return result;
            }
        }
        // 如果有placeholder，则直接返回
        var placeholder=that.getPlaceholder(Element);
        if(placeholder != null){
            result = ElementLocalName+"["+placeholder+"]";
            if( $(result).length == 1){
                return result;
            }
        }
        // 如果有alt，则直接返回
        var alt=that.getAlt(Element);
        if(alt != null){
            result = ElementLocalName+"["+alt+"]";
            if( $(result).length == 1){
                return result;
            }
        }

        // 如果有name且只有一个，则直接返回
        var selectElement=that.getElementName(Element);
        if(selectElement != null){
            return selectElement;
        }

        // 如果有src，且src后面无参数则直接返回
        var src=that.getSrc(Element);
        if(src != null && src.length<200){
            result = ElementLocalName+"["+src+"]";
            if( $(result).length == 1){
                return result;
            }
        }
        // 如果有onClick则直接返回
        var onClick=that.getOnClick(Element);
        if(onClick != null && onClick.length<200){
            result = ElementLocalName+"["+onClick+"]";
            if( $(result).length == 1){
                return result;
            }
        }

        var Symbol = ( this.getElementId(Element)  ? "#" :Element.className ? "." : false);
        var locationAddr;
        if (!Symbol) {
            locationAddr= that.Climb(Element.parentNode, ElementLocalName);
        } else {
            locationAddr= that.Climb(Element, ElementLocalName);
        }
        if($(locationAddr).length==1){
            return locationAddr.trim();
        }

        if(confirm("当前元素无法自动选中，是否手动指定JsPath?\n(该功能为熟悉JavaScript的用户使用，若您不知道，请点击取消。)\n注意：如果该提示影响到您得操作了，关闭'自动查找验证码'功能即可！")){
            result = prompt("请输入待选择元素的JsPath，例如：\n#app > div:nth-child(3) > div > input");
            try{
                if( $(result).length == 1){
                    return result;
                }
            }catch(e){}
        }

        that.Hint('该网站非标准web结构，暂时无法添加规则，请联系客服添加。')
        return null;

    }

    //判断元素id是否可信
    getElementId(element){
        var id=element.id;
        if(id){
            if(id.indexOf("exifviewer-img-")==-1){// 对抗类似vue这种无意义id
                if(id.length<40){// 对抗某些会自动变换id的验证码
                    return true;
                }
            }
        }
        return false;
    }

    //爬层级
    Climb(Element, ElementLocalName, Joint = '') {
        var ElementType = (this.getElementId(Element)  ? Element.id : Element.className ? Element.className.replace(/\s/g, ".") : false);
        var Symbol = (this.getElementId(Element) ? "#" : Element.className ? "." : false);
        var Address ;
        if (ElementType && ElementLocalName == Element.localName) {
            Address = ElementLocalName + Symbol + ElementType;
        } else {
            Address ="";
            if(Symbol!=false){
                Address=Address+Symbol;
            }
            if(ElementType!=false){
                Address=Address+ElementType;
            }
            Address= ' ' + ElementLocalName
        }
        if ($(Address).length == 1) {
            return Address + ' ' + Joint;
        } else {
            Joint = this.Climb($(Element).parent()[0], $(Element).parent()[0].localName, Address + ' ' + Joint)
            return Joint;
        }
    }
    // 获取vue的data-v-xxxx
    getDataV(element){
        var elementKeys=element.attributes;
        if(elementKeys==null){
            return null;
        }
        for(var i=0;i<elementKeys.length;i++){
            var key=elementKeys[i].name;
            if(key.indexOf("data-v-")!=-1){
                return key;
            }
        }
        return null;
    }
    // 获取placeholder="验证码"
    getPlaceholder(element){
        var elementKeys=element.attributes;
        if(elementKeys==null){
            return null;
        }
        for(var i=0;i<elementKeys.length;i++){
            var key=elementKeys[i].name.toLowerCase();
            if(key=="placeholder"&&elementKeys[i].value!=""){
                return elementKeys[i].name+"='"+elementKeys[i].value+"'";
            }
        }
        return null;
    }
    // 获取alt="kaptcha"
    getAlt(element){
        var elementKeys=element.attributes;
        if(elementKeys==null){
            return null;
        }
        for(var i=0;i<elementKeys.length;i++){
            var key=elementKeys[i].name.toLowerCase();
            if(key=="alt"){
                return elementKeys[i].name+"='"+elementKeys[i].value+"'";
            }
        }
        return null;
    }

    // 获取src="http://xxx.com"
    getSrc(element){
        var elementKeys = element.attributes;
        if(elementKeys == null){
            return null;
        }
        for(var i=0;i<elementKeys.length;i++){
            var key=elementKeys[i].name.toLowerCase();
            var value = elementKeys[i].value;
            if(key=="src" && value.indexOf("data:image") != 0){
                var idenIndex = value.indexOf("?");
                if(idenIndex != -1){
                    value = value.substring(0 , idenIndex + 1);
                }
                return elementKeys[i].name + "^='" + value + "'";
            }
        }
        return null;
    }

    // 判断name是否只有一个
    getElementName(element){
        var elementName=element.name;
        if(elementName==null || elementName==""){
            return null;
        }
        var selectElement=element.localName + "[name='"+elementName+"']";
        if ($(selectElement).length == 1) {
            return selectElement;
        }
        return null;
    }
    // 判断OnClick是否只有一个
    getOnClick(element){
        var elementKeys = element.attributes;
        if(elementKeys == null){
            return null;
        }
        for(var i=0;i<elementKeys.length;i++){
            var key=elementKeys[i].name.toLowerCase();
            var value = elementKeys[i].value;
            if(key=="onclick"){
                var idenIndex = value.indexOf("(");
                if(idenIndex != -1){
                    value = value.substring(0 , idenIndex + 1) ;
                }
                return elementKeys[i].name + "^='" + value + "'";
            }
        }
        return null;
    }
    // 操作webStorage 增加缓存，减少对服务端的请求
    setCapFoowwLocalStorage (key, value, ttl_ms) {
        var data = { value: value, expirse: new Date(ttl_ms).getTime() };
        sessionStorage.setItem(key, JSON.stringify(data));
    }
    getCapFoowwLocalStorage (key) {
        var data = JSON.parse(sessionStorage.getItem(key));
        if (data !== null) {
            if (data.expirse != null && data.expirse < new Date().getTime()) {
                sessionStorage.removeItem(key);
            } else {
                return data.value;
            }
        }
        return null;
    }
    delCapFoowwLocalStorage(key){
        window.sessionStorage.removeItem(key);
    }
    // 添加识别错误黑名单
    addBadWeb(img,input){
        if(Set["autoBlackList"]=="false"){
            return;
        }
        this.Hint('识别过程中发生错误，已停止识别此网站！', 10000);
        this.setCapFoowwLocalStorage("err_" + img,"可能存在跨域等问题停止操作它",new Date().getTime()+(1000*1000));
        this.delCapFoowwLocalStorage("captchaHostQuery_" + window.location.host);
        console.log("黑名单。。。");
    }
}
//所有验证码img的对象数组
var writeResultIntervals=[];

//定时执行验证码绑定操作定时器
var writeResultInterval;

var autoIdentificationMenuId;
var showHintMenuId;
var warningToneMenuId;
var autoBlackListMenuId;
//刷新新菜单
function registerMenu(){
    // 各类提示
    GM_unregisterMenuCommand(showHintMenuId);
    if(Set["showHintCheck"]=="true"){
        showHintMenuId = GM_registerMenuCommand('提示信息 [状态: √ ]', function() {
            crabCaptcha.Hint('提示功能已关闭，再次开启前将无任何提示！');
            Set["showHintCheck"]="false";
            GM_setValue("set", Set);
            registerMenu();
        });
    }else{
        showHintMenuId = GM_registerMenuCommand('提示信息 [状态: X ]', function() {
            Set["showHintCheck"]="true";
            GM_setValue("set", Set);
            registerMenu();
            crabCaptcha.Hint('提示功能已开启！');
        });

    }
}

var crabCaptcha = new CaptchaWrite();
(function() {
    GM_registerMenuCommand('手动添加规则', function() {
        crabCaptcha.PickUp();
    }, 'a');

    registerMenu();
    crabCaptcha.Start();
})();

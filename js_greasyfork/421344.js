// ==UserScript==
// @name         wytk-tieba
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  无影坦克
// @author       cjq
// @match        https://tieba.baidu.com/p/*
// @match        http://tieba.baidu.com/photo/p*
// @match        http://tiebapic.baidu.com/forum/pic/item/*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/421344/wytk-tieba.user.js
// @updateURL https://update.greasyfork.org/scripts/421344/wytk-tieba.meta.js
// ==/UserScript==

(function () {
    jQuery.noConflict();
    //引入原脚本
    function utf8Encode(string) {
        var utftext = "";
        for (var n = 0; n<string.length; n++) {
            var c = string.charCodeAt(n);
            if (c<128) {
                utftext += String.fromCharCode(c);
            } else if ((c>127) && (c<2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }

    function utf8Decode(inputStr) {
        var outputStr = "";
        var code1, code2, code3, code4;
        for(var i = 0; i < inputStr.length; i++) {
            code1 = inputStr.charCodeAt(i);
            if(code1 < 128) {
                outputStr += String.fromCharCode(code1);
            }else if(code1 < 224) {
                code2 = inputStr.charCodeAt(++i);
                outputStr += String.fromCharCode(((code1 & 31) << 6) | (code2 & 63));
            }else if(code1 < 240) {
                code2 = inputStr.charCodeAt(++i);
                code3 = inputStr.charCodeAt(++i);
                outputStr += String.fromCharCode(((code1 & 15) << 12) | ((code2 & 63) << 6) | (code3 & 63));
            }else {
                code2 = inputStr.charCodeAt(++i);
                code3 = inputStr.charCodeAt(++i);
                code4 = inputStr.charCodeAt(++i);
                outputStr += String.fromCharCode(((code1 & 7) << 18) | ((code2 & 63) << 12) |((code3 & 63) << 6) | (code2 & 63));
            }
        }
        return outputStr;
    }

    let IMG1=new Image();
    let IMGINFO=[];
    let IMG2=new Image();
    let MODE=4;
    let SRC1="";
    let SRC2="";
    let CURR_URL="";
    var DOMAIN=document.URL;

    function a1(){
        requestAnimationFrame(function(){
            requestAnimationFrame(function(){
                try{
                    let f=gen(MODE);
                    if(SRC1){URL.revokeObjectURL(SRC1)}
                    SRC1=URL.createObjectURL(f);
                    jQuery("#a1").attr("href",SRC1);
                    jQuery("#img1").attr("src",SRC1);
                    jQuery("#a1").css("display","inline");
                    jQuery("#a1").attr("download","download.png");
                }catch(e){alert("图片生成失败")}
            })
        })
    }

    function a2(){
        try{
            let f=sol();
            if(SRC2){URL.revokeObjectURL(SRC2)}
            SRC2=URL.createObjectURL(f[0]);
            jQuery("#" + String(id - 1)).attr("src",SRC2)
            jQuery("#" + String(id - 1)).before(createTip("图片读取成功！"))
        }catch(e){
            tryOpenOriginPicWhenDecodeError();
            jQuery("#" + String(id - 1)).before(createTip("解析读取失败，试试放大。如果已经放大，那就是无法解析。"))
        }
    }

    function select(){
        let l=[0,"500K","1M","1.5M","2M"]
        MODE=parseInt(jQuery("#compress_level_select")[0].value);
        document.getElementById("info1").innerHTML="建议里图大小：小于"+l[MODE]
    }

    function ipt1(){
        var oFReader = new FileReader();
        var ofile = jQuery("#ipt1")[0].files[0];
        oFReader.readAsDataURL(ofile);
        oFReader.onloadend = function(oFRevent){
            var osrc = oFRevent.target.result;
            IMG1.src=osrc;
        }
    }

    function ipt(){
        var oFReader = new FileReader();
        var ofile = jQuery("#ipt")[0].files[0];
        oFReader.readAsArrayBuffer(ofile);
        oFReader.onloadend = function(oFRevent){
            try{
                let l=new Uint8Array(oFRevent.target.result);
                IMGINFO=[ [l.length,utf8Encode(ofile.name),ofile.type],l];
            }catch(e){}
        }
    }

    //解密
    function ipt2(){
        var oFReader = new FileReader();
        //得到文件
        var ofile = document.getElementById("ipt2").files[0];
        console.log(ofile);
        oFReader.readAsDataURL(ofile);

        oFReader.onloadend = function(oFRevent){
            var osrc = oFRevent.target.result;
            IMG2.src=osrc;
            console.log(IMG2.src);

            IMG2.onload=function(){
                console.log('img2.onload')
                a2()
            }
        }
    }

    function dataURLtoBlob(dataurl) {
        var arr = dataurl.split(',');
        var _arr = arr[1];
        var mime = arr[0].match(/:(.*?);/)[1],
            bstr =atob(_arr),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr.buffer], {type: mime});
    }

    function gen(mode){
        let modelist=[0,3,mode];
        let word=IMGINFO[0].join(String.fromCharCode(1))+String.fromCharCode(0);
        let length=2+parseInt((word.length+IMGINFO[1].length)*8/(mode*3))
        let ax=Math.sqrt(length/(IMG1.width*IMG1.height));
        let wid=Math.ceil(IMG1.width*ax);
        let hit=Math.ceil(IMG1.height*ax);
        let cv=document.createElement("canvas");
        let cvd=cv.getContext("2d");
        cv.width=wid;
        cv.height=hit;
        cvd.fillStyle="#ffffff";
        cvd.fillRect(0,0,wid,hit);
        cvd.drawImage(IMG1,0,0,wid,hit);

        if(jQuery('#beizhucheckbox').is(':checked')){
            let w=jQuery('#beizhu')[0].value;
            cvd.font="16px Arial";
            cvd.textBaseline="middle";
            cvd.fillStyle="rgba(255,255,255,0.75)";
            cvd.fillRect(0,0,cvd.measureText(w).width+8,28);
            cvd.fillStyle="#000000";
            cvd.fillText(w,4,14,wid-8);
        }

        return new File([dataURLtoBlob(en(mode,modelist,cvd.getImageData(0,0,wid,hit),word,IMGINFO[1]," wytk.github.io"))],"download.png",{type:"image/png"})
    }

    function sol(){
        let cv=document.createElement("canvas");
        let cvd=cv.getContext("2d");
        cv.width=IMG2.width;
        cv.height=IMG2.height;
        cvd.drawImage(IMG2,0,0);
        let imgdata=cvd.getImageData(0,0,IMG2.width,IMG2.height);
        let klist=de(imgdata.data[2]%8,imgdata);
        let file=new File([klist[1].buffer],utf8Decode(klist[0][1]),{type:klist[0][2]})
        return [file,utf8Decode(klist[0][1])]
    }

    function closer(mode,m,n){
        let a=m % mode
        if(255-m<=mode/2 || m<mode/2){
            return parseInt(m/mode)*mode+n
        }else if(n-a>mode/2){
            return parseInt(m/mode)*mode+n-mode
        }else if(a-n>=mode/2){
            return parseInt(m/mode)*mode+n+mode
        }else{
            return parseInt(m/mode)*mode+n
        }
    }

    function en(mode,fplist,imgdata,aword,blist,cword){
        let aa=Math.ceil(8/3/mode);
        let n=imgdata.width*imgdata.height;
        let j=0;
        let k="";
        let i=1;
        let mlist=[1,2,4,8,16,32,64,128];
        let cv=document.createElement("canvas");
        let cvd=cv.getContext("2d");
        cv.width=imgdata.width;
        cv.height=imgdata.height;
        imgdata.data[0]=closer(8,imgdata.data[0],fplist[0]);
        imgdata.data[1]=closer(8,imgdata.data[1],fplist[1]);
        imgdata.data[2]=closer(8,imgdata.data[2],fplist[2]);
        while(i<n && j<aword.length){
            k=k+(aword.charCodeAt(j)+256).toString(2).slice(1);
            for(let ii=0;ii<aa;ii++){
                if(k.length>=mode*3){
                    imgdata.data[4*i  ]=closer(mlist[mode],imgdata.data[4*i  ],parseInt(k.slice(0     ,mode  ),2));
                    imgdata.data[4*i+1]=closer(mlist[mode],imgdata.data[4*i+1],parseInt(k.slice(mode  ,mode*2),2));
                    imgdata.data[4*i+2]=closer(mlist[mode],imgdata.data[4*i+2],parseInt(k.slice(mode*2,mode*3),2));
                    k=k.slice(mode*3);
                    i++
                }
            }
            j++
        }
        j=0;
        while(i<n && j<blist.length){
            k=k+(blist[j]+256).toString(2).slice(1);
            for(let ii=0;ii<aa;ii++){
                if(k.length>=mode*3){
                    imgdata.data[4*i  ]=closer(mlist[mode],imgdata.data[4*i  ],parseInt(k.slice(0     ,mode  ),2));
                    imgdata.data[4*i+1]=closer(mlist[mode],imgdata.data[4*i+1],parseInt(k.slice(mode  ,mode*2),2));
                    imgdata.data[4*i+2]=closer(mlist[mode],imgdata.data[4*i+2],parseInt(k.slice(mode*2,mode*3),2));
                    k=k.slice(mode*3);
                    i++
                }
            }
            j++
        }
        j=0;
        while(i<n){
            k=k+(cword.charCodeAt(j%cword.length)+256).toString(2).slice(1);
            for(let ii=0;ii<aa;ii++){
                if(k.length>=mode*3){
                    imgdata.data[4*i  ]=closer(mlist[mode],imgdata.data[4*i  ],parseInt(k.slice(0     ,mode  ),2));
                    imgdata.data[4*i+1]=closer(mlist[mode],imgdata.data[4*i+1],parseInt(k.slice(mode  ,mode*2),2));
                    imgdata.data[4*i+2]=closer(mlist[mode],imgdata.data[4*i+2],parseInt(k.slice(mode*2,mode*3),2));
                    k=k.slice(mode*3);
                    i++
                }
            }
            j++
        }
        cvd.putImageData(imgdata,0,0);
        return cv.toDataURL();
    }

    function de(mode,imgdata){
        let aa=Math.ceil(3*mode/8);
        let n=imgdata.width*imgdata.height;
        let j=0;
        let k="";
        let i=1;
        let mlist=[1,2,4,8,16,32,64,128];
        let word="";
        let blist//=new Uint8Array();
        let blength=0;
        while(i<n && (word.length==0 || word.slice(-1).charCodeAt(0)>0)){
            k=k+(imgdata.data[4*i  ]+256).toString(2).slice(-mode);
            k=k+(imgdata.data[4*i+1]+256).toString(2).slice(-mode);
            k=k+(imgdata.data[4*i+2]+256).toString(2).slice(-mode);
            i++
            for(let ii=0;ii<aa;ii++){
                if(k.length>=8 && (word.length==0 || word.slice(-1).charCodeAt(0)>0)){
                    word=word+String.fromCharCode(parseInt(k.slice(0,8),2));
                    k=k.slice(8);
                }
            }
        }
        //word分隔符:","
        blength=parseInt(word.split(String.fromCharCode(1))[0]);
        if(!(blength>-1)){
            throw "error"
        }
        if(!(word.split(String.fromCharCode(1)).length>2)){
            throw "error"
        }
        blist=new Uint8Array(blength);
        if(k.length>=8 && j<blength){
            blist[j]=parseInt(k.slice(0,8),2);
            k=k.slice(8);
            j++
        }
        while(i<n && j<blength){
            k=k+(imgdata.data[4*i  ]+256).toString(2).slice(-mode);
            k=k+(imgdata.data[4*i+1]+256).toString(2).slice(-mode);
            k=k+(imgdata.data[4*i+2]+256).toString(2).slice(-mode);
            i++
            for(let ii=0;ii<aa;ii++){
                if(k.length>=8 && j<blength){
                    blist[j]=parseInt(k.slice(0,8),2);
                    k=k.slice(8);
                    j++
                }
            }
        }
        return [word.split(String.fromCharCode(0))[0].split(String.fromCharCode(1)),blist]
    }

    //url转data
    function getImageFileFromUrl(url, imageName,callback) {

        // imageName一定要带上后缀
        var blob = null;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.setRequestHeader('Accept', 'image/jpeg');
        xhr.responseType = "blob";
        xhr.onload = () => {
            if (xhr.status == 200) {
                blob = xhr.response;
                let imgFile = new File([blob], imageName, {type: 'image/jpeg'});
                console.log(imgFile)
                callback.call(this,imgFile);
            }else{jQuery("#" + String(id)).before(createTip("网络出错，无法读取。"))}};
        xhr.send();

    }

    //获取协议类型
    function getProtocolStr(url){
        var reg=/http:/;
        if(reg.test(url)){
            return "http";
        }else{
            return "https"
        }
    }

    //得到链接中图片的名称
    function getUrlLastPathNameStr(url){
        var index = url.lastIndexOf("\/");
        var last= url.substring(index + 1, url.length);
        return last;
    }

    //如果解析失败可能是因为图片需要放大解析，但是由于跨域问题，所以要在新页面中解析，此时hover事件再次绑定成功，即可解析
    function tryOpenOriginPicWhenDecodeError(){
        if(DOMAIN.startsWith("https://tieba.baidu.com")){
            window.open('http://tiebapic.baidu.com/forum/pic/item/'+getUrlLastPathNameStr(CURR_URL));
        }
    }

    //创建提示标签
    function createTip(str){
        return "<p style=\"font-size:15px;color:orange\">"+str+"</p><br/>";
    }

    var id = 0;

    if(!GM_getValue('firstTime')){
        GM_setValue('firstTime',true);
        GM_setValue('pluginOnOffFlag',true);
        GM_setValue('autoJumpOriginFlag',true);
    }
    console.log(GM_getValue('pluginOnOffFlag'));
    var userConfig={
        pluginOnOffFlag:GM_getValue('pluginOnOffFlag'),
        pluginAutoJumpOriginFlag:GM_getValue('autoJumpOriginFlag')
    }

    //在firefox下并不总是有效果，所以我把加载内容都给移出了，并且使用了 document-end 注解
    window.onload=function(){

        console.log("onloading~");

        //下面这两行不知道是干什么的，屏蔽掉了
        //let w="<!DOCTYPE "+"html>"+document.documentElement.outerHTML;
        //document.getElementById("bc").href=URL.createObjectURL(new Blob([w],{type:"text/html"}))

        var timerId=setInterval(function(){

            //考虑到有些用户会不自觉放大页面
            //检查是不是有原图，有则跳转到新标签页显示，因为在原图网页我绑定不了hover事件
            var picURL=jQuery('.image_original_original').attr('src');
            if(picURL!=undefined && picURL!='' && userConfig.pluginAutoJumpOriginFlag){
                window.open(picURL);
                clearInterval(timerId);
            }
        },1000);

        console.log("onload end~");
    }

    //左浮窗功能
    jQuery("body").append("\
<div id='plugin_float' \
style='left: 20px;\
bottom: 20px;\
background: #9beee2;\
color:#3e32d2;\
overflow: hidden;\
z-index: 9999;\
position: fixed;\
padding:5px;\
text-align:left;\
font-size:20px;\
'></div>");

    jQuery("#plugin_float").append('<p>无影坦克𝐈𝐈：</p>')
        .append('<input type="checkbox" id="plugin_enable_state"> 鼠标悬浮解析 <br>')
        .append('<input type="checkbox" id="plugin_autojump_state"> 自动跳大图 <br>')
        .append('<p>找不到心爱的小锤锤？给你🔨</p>');

    if(userConfig.pluginOnOffFlag){
        jQuery('#plugin_enable_state').attr('checked','checked');
    }

    if(userConfig.pluginAutoJumpOriginFlag){
        jQuery('#plugin_autojump_state').attr('checked','checked');
    }

    jQuery("#plugin_float").append("🖼️<a href = \"javascript:void(0)\"onclick = \"document.getElementById('light').style.display='block';document.getElementById('fade').style.display='block'\"> 快速制图 </a>");

    //中间浮窗，用来制图
    jQuery("body").append("\
<style>\
.black_overlay{\
display: none;\
position: fixed;\
top: 0%;\
left: 0%;\
width: 100%;\
height: 100%;\
background-color: black;\
z-index:1040;\
-moz-opacity: 0.8;\
opacity:.80;\
filter: alpha(opacity=88);\
}\
.white_content {\
display: none;\
position: fixed;\
top: 25%;\
left: 25%;\
width: 55%;\
height: 55%;\
padding: 20px;\
border: 10px solid orange;\
background-color: white;\
z-index:1050;\
overflow: auto;\
}\
</style>");

    jQuery("body").append("<div id=\"light\" class=\"white_content\"> \
<br>\
<a href=\"https://wytk.github.io/\">GITHUB官方制图工具链接 https://wytk.github.io/</a> <br>\
\
<summary>制作坦克</summary> \
<span>选择表图</span><br><input type=\"file\" id=\"ipt1\" accept=\"image/*\"> \
<br> \
<span>选择里图</span><br><input type=\"file\" id=\"ipt\" accept=\"image/*\"> \
<br> \
<span>添加备注</span><input id=\"beizhucheckbox\" type=\"checkbox\" checked=\"true\"> \
<br><input type=\"text\" id=\"beizhu\" style=\"width:150px\" value=\"TK\"> \
<br> \
<span>表图压缩度 </span><select id=\"compress_level_select\" \
<option value=\"1\">1</option> \
<option value=\"2\">2</option> \
<option value=\"3\">3</option> \
<option value=\"4\" selected=\"true\">4</option> \
</select>\
<br>\
<span id=\"info1\">建议里图大小：小于2M</span>\
<br>\
<button id=\"a1_button\">合成图片</button> \
<br> \
<img id=\"img1\"> \
<br> \
<a href=\"\" id=\"a1\" style=\"display:none\">保存图片</a> \
\
<a href = \"javascript:void(0)\" onclick = \"document.getElementById('light').style.display='none';document.getElementById('fade').style.display='none'\">关闭窗口<br></a>\
<br> \
</div> \
<div id=\"fade\" class=\"black_overlay\"></div>");

    //冒泡事件，防止动态加载
    jQuery("body").on("hover","img",function(event){

        //只响应鼠标移动到图片上，忽略移开
        if(event.type=="mouseenter"){

            if(!userConfig.pluginOnOffFlag)
                return;

            //忽略上次处理过的图片
            if(jQuery(this).attr("id")==(id-1))
                return;

            //忽略制图中的图片，否则会导致无法继续制图
            if(jQuery(this).attr("id")=="img1")
                return;

            jQuery(this).attr("id",String(id));
            jQuery("#" + String(id)).before(createTip("正在加载。。。若长时间无反应请手动点击图片！"));
            id = id + 1;

            var url=jQuery(this).attr("src");
            CURR_URL=url;

            //请求资源的协议看domain不看资源的src，否则会产生mixed错误
            getImageFileFromUrl(getProtocolStr(DOMAIN) + url.substring(4,url.length),'testFile.jpg',function(file){
                console.log(file)
                var r = new FileReader()
                r.readAsDataURL(file)
                r.onloadend = function(oFRevent){
                    var osrc = oFRevent.target.result;
                    IMG2.src=osrc;
                    IMG2.onload=function(){
                        a2()
                    }
                }
            });
        }
    });

    jQuery("body").on("click",function(event){
        //console.log(event.target);

        if(event.target.id=="plugin_enable_state"){
            userConfig.pluginOnOffFlag=jQuery('#plugin_enable_state').is(':checked');
            GM_setValue('pluginOnOffFlag',userConfig.pluginOnOffFlag);
            console.log("插件使能状态改变："+userConfig.pluginOnOffFlag);
        }

        if(event.target.id=="plugin_autojump_state"){
            userConfig.pluginAutoJumpOriginFlag=jQuery('#plugin_autojump_state').is(':checked');
            GM_setValue('autoJumpOriginFlag',userConfig.pluginAutoJumpOriginFlag);
            console.log("自动跳大图状态改变："+userConfig.pluginAutoJumpOriginFlag);
        }

        if(event.target.id=="a1_button"){
            a1();
        }

    });

    jQuery("body").on("change",function(event){
        //console.log(event.target);
        if(event.target.id=="ipt1"){
            ipt1();
        }

        if(event.target.id=="ipt"){
            ipt();
        }

        if(event.target.id=="compress_level_select"){
            select();
        }

    });

})();
// ==UserScript==
// @name         成都电大在线答题
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202212091914
// @description  成都电大在线答题辅助，可选手动单个和或自动批量。
// @author       流浪的蛊惑
// @connect      ai.baidu.com
// @match        *://exam.cdou.edu.cn/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/418224/%E6%88%90%E9%83%BD%E7%94%B5%E5%A4%A7%E5%9C%A8%E7%BA%BF%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/418224/%E6%88%90%E9%83%BD%E7%94%B5%E5%A4%A7%E5%9C%A8%E7%BA%BF%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

function yzdl(){
    let getBase64Image=function(image,ext){
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image,0,0,image.width,image.height);
        // 这里是不支持跨域的
        var base64 = canvas.toDataURL("image/"+ext);
        return base64;
    };
    let delay=0;
    setInterval(function(){
        if(delay==1){//延时获取验证码
            let imgdat=getBase64Image(document.getElementById("imgValidCode"),"png");
            GM_xmlhttpRequest({
                method: "post",
                url: "https://ai.baidu.com/aidemo",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "referer":"https://ai.baidu.com/tech/ocr_others/webimage"
                },
                data: "type="+encodeURIComponent("https://aip.baidubce.com/rest/2.0/ocr/v1/webimage")+"&image="+encodeURIComponent(imgdat),
                onload: function(res){
                    let rec=JSON.parse(res.responseText);
                    console.log(rec);
                    if(rec.errno==0){
                        if(rec.data.words_result_num>0){
                            document.getElementById("validCode").value=rec.data.words_result[0].words;//验证码
                            var dlbtn=document.getElementsByTagName("a");
                            for(let a=0;a<dlbtn.length;a++){//查找登陆按钮
                                if(dlbtn[a].outerHTML.indexOf("javascript:Login()")>-1){
                                    dlbtn[a].click();
                                }
                            }
                        }
                    }
                }
            });
        }
        delay++;
    },1000);
}

(function() {
    'use strict';
    var zhs=document.getElementsByClassName("font12withe");
    if(zhs.length>0){
        let xszh=sessionStorage.getItem("账号数");
        if(xszh==null){
            let istr="{学号,密码}一行一个<br /><textarea id=\"xszh\" rows=\"10\" cols=\"50\">";
            istr+="</textarea><br /><input type=\"button\" value=\"确定\" onclick=\"var zhs=document.getElementById('xszh').value;";
            istr+="sessionStorage.setItem('账号',zhs);var zs=zhs.split('\\n').length;sessionStorage.setItem('账号数','0,'+zs);location.reload();\" />";
            zhs[0].innerHTML=istr;
        }else{
            var xsidx=xszh.split(",");
            if(xsidx[0]<xsidx[1]){
                var zh=sessionStorage.getItem("账号").split("\n");
                var dlyh=zh[xsidx[0]++].split(",");
                var xh=document.getElementById("account");
                var pwd=document.getElementById("password");
                xh.value=dlyh[0];
                pwd.value=dlyh[1];
                sessionStorage.setItem("账号数",xsidx[0]+","+xsidx[1]);
                yzdl(); //验证登陆
            }else{
                sessionStorage.removeItem("账号");
                sessionStorage.removeItem("账号数");
                location.reload();
            }
        }
    }
    if(window.location.pathname=="/framework/NewUserMainPage.aspx"){
        document.getElementById("sp_user_exam_center").click();
    }
    let i=0;
    if(window.location.pathname=="/exam/MyTestList.aspx"){
        let kcs=document.getElementById("PagingControl1_Nrl_fy1_1").innerText.trim();
        if(kcs>40){
            let x = document.getElementsByTagName("a");
            for(let a=0;a<x.length;a++){//修改登陆模式
                if(x[a].outerHTML.indexOf('>参加<')>-1){
                    var t = x[a].getAttribute("href").split("'");
                    x[a].setAttribute("href","/exam/exam/AttendExamNew.aspx?examUid="+t[1]+"&examArrangeUid="+t[3]);
                    x[a].setAttribute("target","_blank");
                    sessionStorage.setItem("作业"+(i++),"/exam/exam/AttendExamNew.aspx?examUid="+t[1]+"&examArrangeUid="+t[3]);
                }
            }
        }else{
            let ga=document.getElementById("PagingControl1_Nrl_fy1_2").getElementsByTagName("a");
            if(ga.length>0){
                ga[ga.length-1].click();
            }
        }
    }
    var zs=sessionStorage.getItem("作业数");
    if(zs==null && i>0){
        sessionStorage.setItem("作业数","0,"+i);
        var zy=sessionStorage.getItem("作业0");
        if(zy!=null){
            location.href=zy;
        }
    }
    var s = document.getElementById("lnkSubmitPaper");
    if(s!=null){//查找交卷按钮，生成配置脚本
        let ocl="var x = document.getElementsByTagName('input');";
        ocl+="for(a=0;a<x.length;a++){if(x[a].outerHTML.indexOf('hidStandardAnswer_')>-1){var str=x[a].getAttribute('value');var result='';";
        ocl+="var ramNum = parseInt(str.substring(0, 1));for(var i = 1; i < str.length; i += 4) {var asc = parseInt('0x' + str.substring(i, i + 4), 16);";
        ocl+="asc = asc - ramNum;result = result + (String.fromCharCode(asc));}var tid=x[a].getAttribute('id').split('_');var da=result.split('|');";
        ocl+="for(r=0;r<da.length;r++){var k=0;k=da[r].charCodeAt(0)-65;if(da[r]=='N'){k=0};if(da[r]=='Y'){k=1};var te=document.getElementById('Answer_'+tid[1]);";
        ocl+="if(te.getAttribute('type')=='text'){te.setAttribute('value',da[r]);}else{jscomCheckedQuestionAnswer('Answer_'+tid[1],k);}}SetQuestionAnswerStatus(tid[1],true);}}";
        ocl+="submitPaper(true);";
        s.setAttribute("onclick",ocl);
        let jj=0;
        setInterval(function(){
            switch(jj){
                case 0:
                    var tb=document.getElementById("divNavigatorPanel");
                    if(tb.outerHTML.length>110){
                        jj=1;
                        s.click();
                    }
                    break;
                case 1:
                    var cle=document.getElementsByClassName("Nsb_layer_btg");
                    if(cle.length>0){
                        jj=2;
                        let zyidx=sessionStorage.getItem("作业数").split(",");
                        if(zyidx[0]<zyidx[1]-1){
                            sessionStorage.removeItem("作业"+(zyidx[0]++));
                            sessionStorage.setItem("作业数",zyidx[0]+","+zyidx[1]);
                            let zy=sessionStorage.getItem("作业"+zyidx[0]);
                            if(zy!=null){
                                location.href=zy;
                            }
                        }else{
                            sessionStorage.removeItem("作业"+zyidx[0]);
                            sessionStorage.removeItem("作业数");
                            location.href="/";
                        }
                        break;
                    }
            }
        },1000);
    }
})();
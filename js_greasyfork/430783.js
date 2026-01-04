// ==UserScript==
// @name              现场直播同组
// @author            qyr001
// @description       通大部分
// @version           1.1.22
// @license           qyr001
// @match        *://api.apiose188.com/*
// @match        *://*.1680268.com/view/jisusaiche/pk10kai_history.html
// @match        *://1680177cr1.com/*
// @match        *://sg266.vip/*
// @match        *://*.bbin678678.com/*
// @match        *://*.ff2200.com/*
// @match        *://*.ff1100.com/*
// @match        *://*.a1777.com/*
// @match        *://pk10.xm0070.com/*
// @match        *://a0202.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @connect     *
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @run-at      document-end
// @namespace https://
// @downloadURL https://update.greasyfork.org/scripts/430783/%E7%8E%B0%E5%9C%BA%E7%9B%B4%E6%92%AD%E5%90%8C%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/430783/%E7%8E%B0%E5%9C%BA%E7%9B%B4%E6%92%AD%E5%90%8C%E7%BB%84.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var qy_settingData = {
        "version" : 0.1,
        "message" : "lalala",
        "positionTop":"0",
        "positionLeft":"0",
        "positionRight":"auto",
        "xsaddBtn" : true,
        "qy_qshuks":0,
        "qy_qshujs":100,
        "qy_jner":1,
        "qy_pelv":9.9,
        "qy_node":false,
        "qy_zhisu":30,
        "qy_zhisuf":-100,
        "connectToTheServer" : false,
        //"waitUpload":[],
        "dui_Up":["","","","","","","","","",""],
        "cuo_Up":["","","","","","","","","",""],
        "currentURL":"null",
        "shortcut":0,
        "shortcut2":0,
        "shortcut3":0,
        "data": [
        ]
    };
    //https://kj.1680210.com/view/pk10_list.html?1?10037?d?www.1680268.com
    //https://api.apiose188.com/pks/getPksHistoryList.do?lotCode=10037&date=2021-06-28
    var qy_kskg=0,qy_zxhks=0,qy_xhjs=0,qy_xiazugs=0,qy_shortcut=0,qy_shortcut2=0,qy_shortcut3=0,qy_zgfu = 0,qy_souh=0,ls_sy_zyl=0,qy_fdylkg=0,old_sy_zyl=0,qy_xhdks=0,qy_daoks=0,ls_qy_souh=0;
    var qy_riqitxt="0",qy_s11="",qy_s12="",codevalue = "",qy_kjqis="",qy_kjma ="",dui = '√',cuo = '×',qy_dcpd = "",qy_kjdc2 = "",readonly="readonly";
    var fhzstr1=0,fhzstr2=0,qy_qishuks=0,qy_qishujs=0,qy_jiemkg = 0,qy_jiner=0,qy_beilv=0,qy_peilv=0,qy_jiesuan = 0,qy_zhisun=0,qy_zhisunf=0,qy_jnr=0,qy_xintiaokg=0;
    var qy_xtkg=0, qy_zqs=0,qy_qhuks=0,qy_qhujs=0,qy_bj=0,sy_zyl=0,qy_zxzgs=0,sy_tor=0;
    var qy_xzcdxz=[],qy_xzcdkj=[],CheckVar1=[],qy_xzcda=[],qy_xzcdb=[],qy_duiall=[],qy_cuoall=[],wbtxt=[],qy_yingli=[],dui_bs=[],cuo_bs=[],qy_duics = [],qy_cuocs = []
    var qyr_userData = null,qybtn_node = null;
    var qy_bnode = false;
    var win=window.document;

    // 查看本地是否存在旧数据;
    qyr_userData = GM_getValue("qyr_userData");
    if(!qyr_userData){
        console.log("不存在");
        qyr_userData = qy_settingData;
        GM_setValue("qyr_userData",qyr_userData);
    }
    // 自动更新数据;
    for(let value in qy_settingData){
        if(!qyr_userData.hasOwnProperty(value)){
            qyr_userData[value] = qy_settingData[value];
            GM_setValue("qyr_userData",qyr_userData);
            console.log("更新");
        };
    };
    // 添加按钮;
    addBtn(); // 添加;
    qybtn_node = win.querySelector("#qyblack_node");
    var qytimer = setInterval(function(){
        if(win.querySelector("#qyblack_node")){
            clearInterval(qytimer);
            qxinStart();
            qy_shanchu_wed();
        } else {
            console.log("添加");
            clearInterval(qytimer);
            addBtn();
        };
        //win.querySelector("#qyr-setbtn").click();
    },500);
    GM_registerMenuCommand("现场直播 设置", setMenu);
    var userSetting = GM_getValue("qyr_userData");

    // // ------------------------------函数 func;

    function qxinStart(){
        console.log("现场直播 ---qyr001");
        qy_riqi();
        //addDragEven();
        setBtnClick();
    };
    //while(1){
    var qy_fuc = setInterval(function(){
        if (qy_bnode){
            qy_getwedtest();
        };
    },2000);
    //}
    function qy_shanchu_wed(){
        if(location.href.indexOf('1680268.co')>-1){
            if(win.querySelector("body > div.fixedgoBack > div > ul")){win.querySelector("body > div.fixedgoBack > div > ul").remove();};
            if(win.querySelector("#fooderbox")){win.querySelector("#fooderbox").remove();};

            if(win.querySelector("body>div.bodybox.pk10lzzhfxymbox.zsbox>div.haomaqu_resetSon")){win.querySelector("body>div.bodybox.pk10lzzhfxymbox.zsbox>div.haomaqu_resetSon").remove();};

            if(win.querySelector("#headdivbox")){win.querySelector("#headdivbox").remove();};
            if(win.querySelector("#startVideo")){win.querySelector("#startVideo").remove();};
            if(win.querySelector("#popup")){win.querySelector("#popup").remove();};
            if(win.querySelector("#pk10 > div > div.haomaqur > div.line.soundId.haomaqur_r")){win.querySelector("#pk10 > div > div.haomaqur > div.line.soundId.haomaqur_r").remove();};
        };
    };
    function qy_riqi(){
        if(location.href.indexOf('http')>-1){
            var qy_date = new Date();var qy_seperator1 = "-";var qy_year = qy_date.getFullYear();var qy_month = qy_date.getMonth() + 1;var qy_strDate = qy_date.getDate();
            if (qy_month >= 1 && qy_month <= 9) {qy_month = "0" + qy_month;};
            if (qy_strDate >= 0 && qy_strDate <= 9) {qy_strDate = "0" + qy_strDate;};
            qy_riqitxt = qy_year + qy_seperator1 + qy_month + qy_seperator1 + qy_strDate;
            //console.log("riqi1：" + qy_riqitxt);
        };
        for(var i = 0;i < 10;i++){
            //qy_xzcda[i] = false;
            CheckVar1[i]=false;
            CheckVar1[i+10]=false;
            wbtxt[i]="";
            dui_bs[i]=0;
            cuo_bs[i]=0;
            qy_yingli[i] = 0;
            qy_xzcdkj[i] = '';
            qy_duiall[i] = 0;
            qy_cuoall[i] = 0;
            qy_xzcdxz[i] = [];
            qy_xzcdb[i] = [];
            for(var j=0;j<10;j++){
                qy_xzcdxz[i][j]="";
                qy_xzcdb[i][j] = false;
            };
        };
        qy_xhjs=0;qy_zxzgs=0;
        var list = GM_getValue("qyr_userData").data;
        //console.log(list)
        list = list.filter(function(item,index){
            if(index<=list.length-2){
                if(item.includes("车")){
                    var aa=list[index].split("车")[0];
                    var bb=list[index].split("车")[1];
                    let cc = bb.split(".");
                    qy_xzcda[index]=aa;
                    //console.log("qy_xzcda：",aa );
                    for( j=0;j<cc.length;j++){
                        qy_xzcdb[index][Number(cc[j])-1]=true;
                    };
                    qy_xhjs++;
                    qy_s11=qy_s11+aa;
                    //console.log("qy_riqi：",aa ,"车", bb);
                };
            };
        });
    };
    function qy_huixianVar(hx_kg,hx_xhjs){
        if(hx_kg){
            if(qy_shortcut==1 || qy_shortcut==3){win=window.document;};
            if(qy_xzcda[hx_xhjs]){
                var qy_i=qy_xzcda[hx_xhjs];
                for(var i=0;i<10;i++){
                    win.querySelector("#qyr-setMenu #qy_iput11").value=dui_bs[i];
                    win.querySelector("#qyr-setMenu #qy_iput12").value=cuo_bs[i];
                    win.querySelector("#qyr-setMenu #btnchecked"+String(i+1)).checked=false;
                    win.querySelector("#qyr-setMenu #btnchecked"+String(i+11)).checked=false;
                    if(i==qy_i-1){
                        var Check=[];Check[0]=true;
                        console.log("qy_xzcda：",qy_xzcda[hx_xhjs] ,"车");
                        Check[0] ? win.querySelector("#qyr-setMenu #btnchecked"+String(qy_i)).checked=true:"";
                    };
                    qy_xzcdb[hx_xhjs][i] ? win.querySelector("#qyr-setMenu #btnchecked"+String(i+11)).checked=true:"";
                };
            };
        };
    };
    function qy_wbtxts(){
        if(qy_shortcut==1 || qy_shortcut==3){win=window.document;};
        //win.onclick=function(){
            //var obj = win.querySelectorAll("#qyr-setMenu input[qycz]");
            //if(obj){
            var obj = event.srcElement;
            if(obj.type == "button"){
                var wbt=0;
                wbt=Number(obj.value)-1;
                if(wbt<0){
                    wbt=9;
                };
                //console.log("wbt",wbt)
                win.querySelector("#qyr-setMenu #qykjjgtxt").value=wbtxt[wbt];
                qy_huixianVar(1,wbt);
            };
        //};
    };
    function ChkdVar(){
        var lingsvar =[];readonly="";
        if(qy_shortcut==1 || qy_shortcut==3){win=window.document;};
        for(var i=0;i<20;i++){lingsvar[i] = win.querySelector("#qyr-setMenu #btnchecked"+String(i+1)).checked;};
        qy_xhjs=0;qy_s11="";codevalue="[\n";var ss = '[\n"';var sss = "";
        for(i=0;i<10;i++){
            if(lingsvar[i]){
                var qy_i=qy_xzcda.length;
                var da_str=win.querySelector("#qyr-setMenu #qy_iput11").value
                dui_bs[qy_i]=da_str
                da_str=win.querySelector("#qyr-setMenu #qy_iput12").value
                cuo_bs[qy_i]=da_str
                qy_xzcda[qy_i]=i+1;
                var k = 10;
                for(var j=0;j<10;j++){
                    qy_xzcdb[qy_i][j] = lingsvar[k];
                    k++;
                };
            };
        };
        for(i=0;i<10;i++){
            if(qy_xzcda[i]){
                qy_xhjs++;
                ss=qy_xzcda[i]
                qy_s11=qy_s11+ss;
                for(j=0;j<10;j++){
                    if(qy_xzcdb[i][j]){
                        sss=sss+(j+1)+".";
                    };
                };
                var s1=sss.substring(0,sss.length-1);
                codevalue=codevalue+'"'+ss+"车"+s1+'",\n';
                sss = "";ss="";
            };
        };
        sss = "";ss="";
        sss=codevalue+'"已选 '+qy_s11+" 共"+qy_xhjs+'道"\n]';
        codevalue="";codevalue=sss;sss = "";
        qy_jiner = win.querySelector("#qyr-setMenu #qy_iput5").value;
        qy_zhisun = win.querySelector("#qyr-setMenu #qy_iput6").value;
        qy_zhisunf = win.querySelector("#qyr-setMenu #qy_iput1").value;
        //win.querySelector("#qyr-setMenu #qy_iput1").value=qy_s11;
        win.querySelector("#qyr-setMenu #qykjjgtxt").value = codevalue;
        lingsvar =[];
    };
    function qy_setVar(){
        if(qy_shortcut==1 || qy_shortcut==3){win=window.document;};
        qy_bnode = qybtn_node.checked;
        if(win.querySelector("#qyr-setMenu #qy_iput5")){
            qy_jiemkg = 1;
            qy_shortcut = win.querySelector("#qyr-setMenu #qyr-shortcut").selectedIndex;
            qy_shortcut2 = win.querySelector("#qyr-setMenu #qyr-shortcut2").selectedIndex;
            qy_shortcut3 = win.querySelector("#qyr-setMenu #qyr-shortcut3").selectedIndex;
            //qy_riqitxt = win.querySelector("#qyr-setMenu #qy_iput1").value;
            qy_qishuks = win.querySelector("#qyr-setMenu #qy_iput2").value;
            qy_qishujs = win.querySelector("#qyr-setMenu #qy_iput3").value;
            qy_jiner = win.querySelector("#qyr-setMenu #qy_iput5").value;
            qy_peilv = win.querySelector("#qyr-setMenu #qy_iput7").value;
            qy_zhisun = win.querySelector("#qyr-setMenu #qy_iput6").value;
            qy_zhisunf = win.querySelector("#qyr-setMenu #qy_iput1").value;
        }else{qy_jiemkg = 0;};
        if(qy_bnode){
            qy_kskg=2;//qy_souh=0;ls_sy_zyl=0;
            for(var i=0;i<10;i++){
                qy_duics[i] = 0;
                qy_cuocs[i] = 0;
                //dui_bs[i]=0
                //cuo_bs[i]=0
                qy_yingli[i]=0;
                qy_duiall[i]=0;
                qy_cuoall[i]=0;
                wbtxt[i]="";
                for(var j=0;j<10;j++){
                    qy_xzcdxz[i][j]="";
                };
                if(qy_jiemkg){
                    win.querySelector("#qyr-setMenu>table>tbody>tr:nth-child("+String(4)+")>td:nth-child("+String(i+1)).textContent=0;
                    win.querySelector("#qyr-setMenu>table>tbody>tr:nth-child("+String(5)+")>td:nth-child("+String(i+1)).textContent=0;
                    win.querySelector("#qyr-setMenu>table>tbody>tr:nth-child("+String(6)+")>td:nth-child("+String(i+1)).textContent=0;
                };

            };
            if(qy_jiemkg){
                //win.querySelector("#qyr-setMenu #qy_iput11").style.display = "none";
                //win.querySelector("#qyr-setMenu #qy_iput12").style.display = "none";
                win.querySelector("#qyr-setMenu #qy_iput8").value = "总: " + fhzstr1 + " 对 " + fhzstr2 + " 错 收"+qy_souh+"次";
                win.querySelector("#qyr-setMenu #qy_iput4").value = 0;
                win.querySelector("#qyr-setMenu #qy_iput10").value = sy_tor;
                win.querySelector("#qyr-setMenu #qykjjgtxt2").value =ls_qy_souh
            };
            qy_kskg=0;qy_zxhks=0;qy_fdylkg=0;old_sy_zyl=0;qy_xintiaokg=0;
        }else{
            //qy_kskg=0;qy_zxhks=0;qy_fdylkg=0;old_sy_zyl=0;
            console.log("ks2=============================");
        };
        console.log("ks1=============================");
    };

    function qy_getwedtest(){
        if(qy_shortcut==1 || qy_shortcut==3){win=window.frames[0].document;};
        get_xintiao();
        if(qy_xtkg == 3){
            var ls_xhjs=0;qy_xtkg = 0;qy_zxzgs=0;ls_qy_souh=0;qy_daoks=0;qy_xhdks=0;
            if(qy_shortcut==1 || qy_shortcut==3){win=window.document;};
            if(win.querySelector("#qyr-setMenu #qy_iput5")){
                qy_jiemkg=1;
                qy_zhisun = Number(win.querySelector("#qyr-setMenu #qy_iput6").value);
                qy_zhisunf = Number(win.querySelector("#qyr-setMenu #qy_iput1").value);
                qy_jiner = Number(win.querySelector("#qyr-setMenu #qy_iput5").value);
                qy_peilv = Number(win.querySelector("#qyr-setMenu #qy_iput7").value);
                qy_shortcut3 = win.querySelector("#qyr-setMenu #qyr-shortcut3").selectedIndex;
                if(qy_zxhks==0){
                    if(sy_zyl>0){qy_fdylkg=1;old_sy_zyl=sy_zyl;};
                };
                if(sy_zyl<0){qy_fdylkg=0;};
                if(qy_fdylkg==1){qy_zhisun=qy_zhisun+old_sy_zyl;};
                if(qy_shortcut==2){
                    win.querySelector("#root>div.lottery>div.content>div:nth-child(1)>div.lottery-content-left>div.lottery-setting>div:nth-child(3)>button:nth-child("+(qy_shortcut3+1)+")").click();
                };
            }else{
                qy_jiemkg=0;
            };
            console.log("模式 ",qy_shortcut2," 开始 ",qy_kskg," 界面 ",qy_jiemkg," 总期 ",qy_zxhks,"止损",qy_zhisun,"+",old_sy_zyl);
            for(var xhjs=0;xhjs<10;xhjs++){
                if(qy_xzcda[xhjs]){
                    qy_daoks++;//循环道次
                    if(qy_daoks<=qy_xhjs){qy_xhdks=0;};//道期;
                    if(qy_shortcut2){qy_qhujs=0;qy_xhdks=qy_zxhks;qy_zqs=0;qy_bj=1};
                    //console.log("索引",qy_qhujs,"总 ",qy_zxhks,"期第 ",qy_daoks,"次第 ",xhjs,"道共 ",qy_xhjs," 车");
                    var zh_j=0,zh_txt=["",""];
                    for(var index0 = qy_zqs;index0>=0;index0-=qy_bj){
                        if(qy_shortcut==1 || qy_shortcut==3){win=window.document;};
                        qy_getkjma(index0);
                        if(qy_xhdks==0){
                            qy_beilv=qy_dcnv(dui_bs[xhjs],qy_duics[xhjs]);
                            qy_huoqukjma(xhjs);
                            qy_zxzgs=qy_zxzgs+qy_xiazugs;
                            zh_txt[zh_j]=qy_s12+" ["+qy_beilv+"倍]\n"+qy_xhdks+ "期"+qy_kjqis + " " + qy_kjma+"\n止损"+qy_zhisun+"+"+old_sy_zyl+"\n";
                            wbtxt[xhjs] =zh_txt[zh_j];
                            if(qy_shortcut2){
                                if(qy_jiemkg){
                                    if(qy_shortcut==1 || qy_shortcut==3){
                                        win=window.document;
                                        win.querySelector("#qyr-setMenu #qykjjgtxt").value=wbtxt[xhjs];
                                    }else{
                                        win.querySelector("#qyr-setMenu #qykjjgtxt").value=wbtxt[xhjs];
                                    };
                                }
                            };
                            //console.log("道期 ",qy_xhdks," 第 ",xhjs," 道过 个数 ",qy_xiazugs,"总个数 ",qy_zxzgs," 倍 ",qy_beilv);
                            zh_j++;
                        };
                        if(qy_xhdks>0){
                            qy_xiazugs=qy_czgs(qy_xzcdxz[xhjs]);
                            if(qy_shortcut2){qy_zxzgs=qy_zxzgs+qy_xiazugs;};
                            if (qy_xiazugs){
                                //console.log(xhjs," 道个数=== ",qy_xiazugs)
                                //zh_txt[zh_j]=qy_kjdc2+"  ";
                                zh_txt[zh_j]="  ";
                                if(qy_shortcut2){
                                    wbtxt[xhjs]=zh_txt[zh_j]+wbtxt[xhjs];
                                }else{
                                    if(qy_xhdks%2==1){
                                        wbtxt[xhjs]=zh_txt[1]+wbtxt[xhjs];
                                        //console.log(xhjs," 期数1=== "+wbtxt[xhjs]);
                                    }else{
                                        wbtxt[xhjs]=zh_txt[0] +wbtxt[xhjs];
                                        //console.log(xhjs," 期数2=== "+wbtxt[xhjs]);
                                    };
                                };
                                db_duicuo(xhjs);
                                qy_jishuan(qy_xhdks,xhjs,qy_peilv,qy_jiner,qy_xiazugs,qy_beilv,qy_dcpd,sy_zyl);
                                //xr_docihm(qy_jiemkg,xhjs,fhzstr1,fhzstr2,qy_yingli[xhjs]);
                                db_duicuo2(xhjs,qy_dcpd);
                                if (sy_zyl<=qy_zhisunf || sy_zyl>=qy_zhisun){
                                    qy_bnode=false;
                                    zh_txt[zh_j]="[已到设定任务]\n"+qy_xhdks+ "期"+qy_kjqis + " [" + qy_kjma+"]["+qy_dcpd+qy_jiesuan+"]\n";
                                    qy_souh++;
                                    if(qy_jiemkg){
                                        if(qy_shortcut==1 || qy_shortcut==3){
                                            win=window.document;
                                            ls_qy_souh=win.querySelector("#qyr-setMenu #qykjjgtxt2").value;ls_xhjs=xhjs+1;
                                            ls_sy_zyl = ls_sy_zyl+sy_zyl
                                            win.querySelector("#qyr-setMenu #qykjjgtxt2").value="盈利"+ls_sy_zyl+ls_qy_souh+"\n"+qy_daoks+"车"+qy_souh+"次"+qy_xhdks+ "期"+sy_zyl;
                                            ls_qy_souh=win.querySelector("#qyr-setMenu #qykjjgtxt2").value;
                                        }else{
                                            ls_qy_souh=win.querySelector("#qyr-setMenu #qykjjgtxt2").value;ls_xhjs=xhjs+1;
                                            ls_sy_zyl = ls_sy_zyl+sy_zyl
                                            win.querySelector("#qyr-setMenu #qykjjgtxt2").value="盈利"+ls_sy_zyl+ls_qy_souh+"\n"+qy_daoks+"车"+qy_souh+"次"+qy_xhdks+ "期"+sy_zyl;
                                            ls_qy_souh=win.querySelector("#qyr-setMenu #qykjjgtxt2").value;
                                        };
                                        qybtn_node.checked=false;
                                    };
                                };
                                qy_huoqukjma(xhjs);
                                zh_txt[zh_j]=qy_s12+" ["+qy_beilv+"倍]\n"+qy_xhdks+ "期"+qy_kjqis + " [" + qy_kjma+"]["+qy_dcpd+qy_jiesuan+"]\n";
                                if(qy_shortcut2){
                                    wbtxt[xhjs]=zh_txt[zh_j]+wbtxt[xhjs];
                                }else{
                                    if(qy_xhdks%2==1){
                                        wbtxt[xhjs]=zh_txt[1]+wbtxt[xhjs];
                                        //console.log(xhjs," 期数3=== "+wbtxt[xhjs]);
                                        zh_j=0;
                                    }else{
                                        wbtxt[xhjs]=zh_txt[0] +wbtxt[xhjs];
                                        //console.log(xhjs," 期数4=== "+wbtxt[xhjs]);
                                        zh_j++;
                                    };
                                };
                                if(qy_jiemkg){
                                    if(qy_shortcut==1 || qy_shortcut==3){
                                        win=window.document;
                                        win.querySelector("#qyr-setMenu #qykjjgtxt").value=wbtxt[xhjs];
                                    }else{
                                        win.querySelector("#qyr-setMenu #qykjjgtxt").value=wbtxt[xhjs];
                                    };
                                };
                            };
                        };
                        xr_docihm(qy_jiemkg,xhjs,fhzstr1,fhzstr2,qy_yingli[xhjs]);
                        if (sy_zyl<=qy_zhisunf || sy_zyl>=qy_zhisun){
                            sy_zyl=0;qy_xhdks=0;qy_zxzgs=0;
                            for(var i=0;i<10;i++){
                                qy_duics[i] = 0;
                                qy_cuocs[i] = 0;
                                //dui_bs[i]=0
                                //cuo_bs[i]=0
                                fhzstr1=0;
                                fhzstr2=0;
                                qy_yingli[i]=0;
                                //qy_duiall[i]=0;
                                //qy_cuoall[i]=0;
                            };
                        };
                        if(qy_shortcut2==0){
                            qy_xhdks++;
                            if(index0<=qy_qhujs){
                                console.log("跳出历史",qy_xhdks);
                                break;
                            };
                        };
                        if(qy_shortcut2){
                            console.log(qy_zxhks,"跳出道期",qy_xhdks);
                            if (sy_zyl<=qy_zhisunf || sy_zyl>=qy_zhisun){qybtn_node.checked=false;qy_bnode=false;break;}
                        };
                    };
                };
                if(!qybtn_node || qy_daoks==(qy_xhjs)){
                    //console.log(qy_xhdks,"期跳出道",qy_daoks,"====",qy_xhjs);
                    break;
                };
            };
            //if(qy_shortcut2){if(qy_daoks==qy_xhjs){setTimeout(function(){qy_zxhks++;console.log("总期+ ",qy_zxhks)},1000);};};//总期+;
            if(qy_shortcut2==0){qybtn_node.checked=false;qy_bnode=false;};
            if(qy_shortcut2){
                if(qy_daoks==qy_xhjs){
                    qy_zxhks++;console.log("总期+ ",qy_zxhks);
                };
            };
        };
    };
    //======================================
    function get_xintiao(){
        var xintiao_m = 0,xintiao_s = 0,qy_xintiao=0,qy_timem=0,qy_times=0,qy_minute="",qy_second="";
        if(qy_shortcut==0){
            if(qy_shortcut2==0){
                qy_minute = win.querySelector("#timebox").innerText;
            }else if(qy_shortcut2==1){
                qy_minute = win.querySelector("#timebox").innerText;
            };
        }else if(qy_shortcut==1 || qy_shortcut==3){
            if(qy_shortcut2==1){
                sy_zyl=Number(win.querySelector("#bresult").textContent);
                qy_minute = win.querySelector("#cdClose").textContent;
            };
            if(qy_xintiaokg>11){win=window.document;win.querySelectorAll("#sub_PK10JSC > a")[1].click();qy_xintiaokg=0};
        }else if(qy_shortcut==2){
            if(qy_shortcut2==1){
                qy_minute = win.querySelector('[class="lottery-header-countdown"]').innerText;
                var qy_m=qy_minute.split("\n")[1];
                if (qy_m.length<2){qy_m ="0"+qy_m;};
                var qy_ms= qy_minute.split("\n")[2];
                if (qy_ms.length<2){qy_ms ="0"+qy_ms;};
                qy_minute=qy_m+":"+qy_ms;
            };

        };
        qy_xintiao=compareTime(qy_minute,1);
        if(qy_xintiao==0){qy_xintiaokg++;};
        readonly="readonly";
        xintiao_m = 50;
        xintiao_s = 48;
        if (qy_shortcut==0){
            qy_qhuks = win.getElementsByClassName("jrsmhmtj")[0].getElementsByTagName("td").length-10;
            qy_zqs=qy_qhuks-qy_qishuks*11;qy_qhujs=qy_qhuks-qy_qishujs*11;
            qy_bj = 11;
        };
        if(qy_shortcut2){
            if(qy_xtkg == 0 && qy_xintiao>= xintiao_m){
                qy_xtkg = 1;
                console.log("=================跳1");
            };
            if(qy_kskg == 2 && qy_xintiao<= xintiao_m && qy_xintiao>=10){
                qy_kskg = 0;qy_xtkg = 3;
                console.log("=================跳2");
            };
            if(qy_xtkg == 1 && qy_xintiao<= xintiao_m && qy_xintiao>=xintiao_s){
                qy_xtkg = 3;qy_xintiaokg=0;
                console.log("=================跳3");
            };
        }else{
            qy_kskg = 0;qy_xtkg = 3;qy_xintiaokg=0;
        };
    };
    function qy_getkjma(in_dx){
        let kja="";qy_kjma="";
        if(qy_shortcut==0){
            if(qy_shortcut2){in_dx=1;};
            qy_kjma = win.getElementsByClassName("jrsmhmtj")[0].getElementsByTagName("td")[in_dx].textContent;
            kja = win.getElementsByClassName("jrsmhmtj")[0].getElementsByTagName("td")[in_dx+1].innerText;
        }else if(qy_shortcut==1 || qy_shortcut==3){
            qy_kjma = win.querySelector("#result_info").textContent
            kja = win.querySelector("#result_balls").innerText
        }else if(qy_shortcut==2){
            qy_kjma = win.querySelectorAll('[class="lottery-header-label"]')[1].textContent;
            kja = win.querySelector('[class="lottery-header-predict lottery-header-predict-small"]').innerText;
        };
        qy_kjqis=compareTime(qy_kjma,0);qy_kjma="";
        //console.log("kja===",kja);
        for(var i = 0;i < 10;i++){
            var kjb=kja.split("\n")[i];
            if (kjb<'10'){
                qy_xzcdkj[i] =kjb.replace("0","");
            }else{
                qy_xzcdkj[i] = kjb;
            }
            //console.log("kjb=",qy_xzcdkj[i]);
            qy_kjma= qy_kjma+""+qy_xzcdkj[i];
        };
    };
    function qy_huoqukjma(kj_cd){
        var qy_s12 = "";qy_xiazugs=0;//var i=0;
        for(let i = 0;i < 10;i++){
            //setTimeout(function x(){
            //var sj_time = Math.floor((Math.random()*80)+100);
            if(qy_xzcdb[kj_cd][i]){
                qy_xzcdxz[kj_cd][i]=qy_xzcdkj[i];
                //setTimeout( function timer() {
                qy_xuaz_u(kj_cd,qy_xzcdxz[kj_cd][i]);
                //}, i*sj_time );
                //console.log(kj_cd,"kj_cd=",qy_xzcdxz[kj_cd][i]);
                qy_s12 = qy_s12+" " + qy_xzcdxz[kj_cd][i];
                qy_xiazugs++;
            }else {
                qy_xzcdxz[kj_cd][i]="";
            };
            //i++
            //if(i<10)setTimeout(x,sj_time);
            if(i==9){
                if(qy_shortcut2 && qy_bnode==true && qy_zxhks>0 && qy_jnr>0){
                    if(qy_shortcut==5){
                        win.querySelector("#header > div.control.n_anniu > div > input:nth-child(3)").click();
                        //setTimeout(function(){},sj_time);
                        //win.querySelector("body > div:nth-child(14) > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1) > span").click();
                    }else if(qy_shortcut==1 || qy_shortcut==3){
                        win=window.frames[0].document;
                        win.querySelectorAll('[onclick="bet()"]')[0].click();
                        //win=window.top.document;
                        //win.querySelectorAll('[class=ui-button-text]')[2].click();
                    }else if(qy_shortcut==2){
                        win.querySelector("#root>div.lottery>div.content>div:nth-child(1)>div.lottery-content-left>div.lottery-setting>div.ant-btn-group>button.ant-btn.lottery-setting-add").click();
                        win.querySelector("#root>div.lottery>div.content>div:nth-child(1)>div.lottery-content-right>div>div.ant-btn-group.lottery-right-buttons>button.ant-btn.lottery-setting-add>span").click();
                        //win.querySelector("body > div:nth-child(14) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary > span").click();
                    };
                    if(qy_shortcut==5){
                        //win.querySelector("#header > div.control.n_anniu > div > input:nth-child(3)").click();
                        win.querySelector("body > div:nth-child(14) > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1) > span").click();
                    }else if(qy_shortcut==1 || qy_shortcut==3){
                        //win=window.frames[0].document;
                        //win.querySelector('[onclick="bet()"]').click();
                        win=window.top.document;
                        win.querySelectorAll('[class=ui-button-text]')[2].click();
                    }else if(qy_shortcut==2){
                        //win.querySelector("#root>div.lottery>div.content>div:nth-child(1)>div.lottery-content-left>div.lottery-setting>div.ant-btn-group>button.ant-btn.lottery-setting-add").click();
                        //win.querySelector("#root>div.lottery>div.content>div:nth-child(1)>div.lottery-content-right>div>div.ant-btn-group.lottery-right-buttons>button.ant-btn.lottery-setting-add>span").click();
                        win.querySelector("body > div:nth-child(14) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary > span").click();
                    };
                    //console.log("确定=",kj_cd);
                };
            };
            //},300);
        };
    };
    function qy_xuaz_u(xz_cd,xz_hm){
        var cd_hm=qy_xzcda[xz_cd];
        if(qy_shortcut2 && qy_bnode==true){
            qy_jnr=qy_jiner*qy_beilv;
            var sg_cd=2,sg1_cd=0,sg2_cd=xz_hm+1;
            if(xz_cd==0 || xz_cd==5){
                sg1_cd=1;
            }else if(xz_cd==1 || xz_cd==6){
                sg1_cd=2;
            }else if(xz_cd==2 || xz_cd==7){
                sg1_cd=3;
            }else if(xz_cd==3 || xz_cd==8){
                sg1_cd=4;
            }else if(xz_cd==4 || xz_cd==9){
                sg1_cd=5;
            };
            if(qy_shortcut==5){
                win.querySelector("#a_B"+cd_hm+"_"+xz_hm+">input").value=qy_jnr;
            }else if(qy_shortcut==1 || qy_shortcut==3){
                win=window.frames[0].document;
                //if(xz_cd>4){sg_cd=3};
                win.querySelector('[name=B'+cd_hm+'_'+xz_hm+']').value=qy_jnr;
            }else if(qy_shortcut==2){
                var qy_dbje = win.querySelector("#root > div.lottery > div.content > div:nth-child(1) > div.lottery-content-left > div.lottery-setting > div:nth-child(2) > input").value;
                if (qy_jnr>qy_dbje){
                    for(var i = 0;i < qy_jnr-qy_dbje;i++){win.querySelector("#root>div.lottery>div.content>div:nth-child(1)>div.lottery-content-left>div.lottery-setting>div:nth-child(2)>svg:nth-child(3)").click();};
                };
                if (qy_jnr<qy_dbje){
                    for( i = 0;i < qy_dbje-qy_jnr;i++){win.querySelector("#root>div.lottery>div.content>div:nth-child(1)>div.lottery-content-left>div.lottery-setting>div:nth-child(2)>svg:nth-child(1)").click();};
                };
                if(xz_cd<5){win.querySelector("#rc-tabs-0-panel-定位胆 > div > div.lottery-gameplay-list > div:nth-child(1)").click();};
                if(xz_cd>4){win.querySelector("#rc-tabs-0-panel-定位胆 > div > div.lottery-gameplay-list > div:nth-child(2)").click();};
                win.querySelector("#root>div.lottery>div.content>div:nth-child(1)>div.lottery-content-left>div:nth-child(2)>div.lottery-panel>div>div:nth-child("+sg1_cd+")>div.lottery-selector-list>div:nth-child("+xz_hm+")").click();
            };
        };
    };
    function qy_xuaz_u2(xz_cd){
        if(qy_shortcut2 && qy_bnode==true && qy_zxhks>0){
            var i=0;
            setTimeout(function x(){
                i++;
                if(qy_shortcut==5){
                    //win.querySelector("#header > div.control.n_anniu > div > input:nth-child(3)").click();
                    win.querySelector("body > div:nth-child(14) > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1) > span").click();
                }else if(qy_shortcut==1 || qy_shortcut==3){
                    //win=window.frames[0].document;
                    //win.querySelector('[onclick="bet()"]').click();
                    win=window.top.document;
                    win.querySelectorAll('[class=ui-button-text]')[2].click();
                }else if(qy_shortcut==2){
                    //win.querySelector("#root>div.lottery>div.content>div:nth-child(1)>div.lottery-content-left>div.lottery-setting>div.ant-btn-group>button.ant-btn.lottery-setting-add").click();
                    //win.querySelector("#root>div.lottery>div.content>div:nth-child(1)>div.lottery-content-right>div>div.ant-btn-group.lottery-right-buttons>button.ant-btn.lottery-setting-add>span").click();
                    win.querySelector("body > div:nth-child(14) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary > span").click();
                };
                console.log("确定=",xz_cd);
                if(i<1)setTimeout(x,5);
            },5);
        };
    };
    function db_duicuo(db_cd){
        var qy_kjdc = "";qy_kjdc2 = "";qy_dcpd = "";
        if (qy_xzcdxz[db_cd].includes(qy_xzcdkj[db_cd])){
            qy_dcpd = dui;
            qy_cuocs[db_cd] = 0;
        }else{
            qy_dcpd = cuo;
            qy_duics[db_cd] = 0;
        };
        for(var i = 0;i < 10;i++){
            if(i==db_cd){
                qy_kjdc = qy_dcpd;
            }else{
                qy_kjdc = "-";
            };
            qy_kjdc2 = qy_kjdc2 + qy_kjdc;
        };
    };
    function db_duicuo2(db_cd,qy_dcpd){

        if (qy_dcpd == dui){
            qy_duiall[db_cd] = qy_duiall[db_cd] + 1;
        }else if(qy_dcpd == cuo){
            qy_cuoall[db_cd] = qy_cuoall[db_cd] + 1;
        };
        fhzstr1 = py_zonghe(qy_duiall);
        fhzstr2 = py_zonghe(qy_cuoall);

        if (qy_dcpd == dui){
            qy_duics[db_cd] = qy_duics[db_cd] + 1;
            qy_beilv=qy_dcnv(dui_bs[db_cd],qy_duics[db_cd]);
        }else if(qy_dcpd == cuo){
            qy_cuocs[db_cd] = qy_cuocs[db_cd] + 1;
            qy_beilv=qy_dcnv(cuo_bs[db_cd],qy_cuocs[db_cd]);
        };
        //console.log("对次数 ",qy_duics[db_cd],"错次数 "+qy_cuocs[db_cd],"个数 "+qy_xiazugs,"总个数 ",qy_zxzgs);
    };
    function qy_jishuan(fz1,js_cd,qy_pv,qy_jr,qy_xgs,qy_bv,qy_dcpd,old_yl){
        var qy_ddylold=qy_yingli[js_cd];
        qy_jiesuan = 0;
        if (qy_dcpd == cuo){
            qy_jiesuan = -(qy_jr*qy_bv*qy_xgs).toFixed(2);
        }else{
            qy_jiesuan = ((qy_jr*qy_bv*qy_pv)-(qy_jr*qy_bv*qy_xgs)).toFixed(2);
        };
        qy_yingli[js_cd]=(Number(qy_jiesuan)+Number(qy_ddylold)).toFixed(2);

        //(颗数*倍数*赔率)-(金额*倍数*颗数)    -(金额*颗数*倍数)

        //qy_yingli[js_cd]=Number(qy_jszh);
        sy_tor=sy_tor+(qy_jr*qy_bv*qy_xgs);
        qy_ddylold=sy_zyl
        if(qy_shortcut2==0){
            sy_zyl=qy_yingli.reduce((total, num)=>{
                return Number(total) + Number(num);
            },0);
        };
        if (qy_yingli[js_cd]<0){
            if(qy_yingli[js_cd]<qy_ddylold){
                qy_zgfu=qy_yingli[js_cd]
            };
        };
    };
    function xr_docihm(xr_xskg,xr_cd,z_dui,z_cuo,y_li){
        if(xr_xskg){
            win.querySelector("#qyr-setMenu #qy_iput8").value = "总: " + z_dui + " 对 " + z_cuo + " 错 收"+qy_souh+"次";
            win.querySelector("#qyr-setMenu>table>tbody>tr:nth-child("+String(6)+")>td:nth-child("+String(xr_cd+1)).textContent=y_li;
            for(var i = 1;i < 11;i++){
                win.querySelector("#qyr-setMenu>table>tbody>tr:nth-child("+String(4)+")>td:nth-child("+String(i)).textContent=qy_duiall[i-1];
                win.querySelector("#qyr-setMenu>table>tbody>tr:nth-child("+String(5)+")>td:nth-child("+String(i)).textContent=qy_cuoall[i-1];
            };
            win.querySelector("#qyr-setMenu #qy_iput9").value = qy_zgfu;
            win.querySelector("#qyr-setMenu #qy_iput10").value = sy_tor;
            win.querySelector("#qyr-setMenu #qy_iput4").value = sy_zyl;
            //console.log(qy_zxhks," 期 ",xr_cd," 道盈利 ",y_li," 总对 "+fhzstr1,"错 "+fhzstr2,"duics "+qy_duics[xr_cd],"cuocs "+qy_cuocs[xr_cd],"gs "+qy_xiazugs,"zgs ",qy_zxzgs);
        };

    };
    function qy_dcnv(sp_dc,dc_g){
        var s_dcs=0,dc_ss=sp_dc.split("."),sp_dch=dc_ss.length;
        if(dc_g>=sp_dch){s_dcs=dc_ss[sp_dch-1];}else{s_dcs=dc_ss[dc_g];};return Number(s_dcs);
    };
    function qy_czgs(gs_arr){
        var qy_gs=0;
        gs_arr.forEach(function(val){if(val){qy_gs++;};});return qy_gs;
    };
    function py_zonghe(py_arr){
        var qy_s=0;
        py_arr.forEach(function(val,idx,arr){qy_s+=val;});return qy_s;
    };
    function compareTime(time_st,st_ms){
        var time_s="";
        let lis_time_a =time_st.replace(/[^0-9]/ig,'');
        for(var timidx = 0;timidx< lis_time_a.length;timidx++){time_s=time_s+lis_time_a[timidx];};
        if(st_ms){return Number(time_s);};
        return time_s;
    }
    //function sum(arr) {
    //return eval(arr.join("+"));
    //};

    //添加按钮 func;
    function addBtn(){
        var node = win.createElement("remove-web-limits-iqxin");
        node.id = "qyr-iqxin";
        node.className = "qyr-exempt";

        // 再次打开窗口小于之前窗口的情况,导致按钮出现在可视窗口之外;
        var screenClientHeight = win.documentElement.clientHeight;
        var tempHeight;
        if (qyr_userData.positionTop>screenClientHeight){
            tempHeight = screenClientHeight -40;
        }else{
            tempHeight = qyr_userData.positionTop;
        };
        // 改变窗口大小的情况;
        window.onresize=function(){
            var screenClientHeight = win.documentElement.clientHeight;
            var tempHeight;

            if (qyr_userData.positionTop>screenClientHeight){
                tempHeight = screenClientHeight -40;
            } else{
                tempHeight = qyr_userData.positionTop;
            };

            node.style.top = tempHeight + "px";
        };
        tempHeight = tempHeight<0?0:tempHeight;
        node.style.cssText = "position:fixed;top:"+tempHeight+"px;left:"+qyr_userData.positionLeft+"px;right:"+qyr_userData.positionRight+"px;";
        node.innerHTML = '<qxinbutton type="qxinbutton" id="qyr-setbtn">设置 </qxinbutton> <lalala style="cursor:move; font-size:12px;">现场直播</lalala> <input type="checkbox" name="" id="qyblack_node" style="width:30px;height:30px">';
        if(window.self === window.top){
            if (win.querySelector("body")){
                win.body.appendChild(node);
            } else {
                win.documentElement.appendChild(node);
            };
        };
        node.addEventListener("mouseover",function(){
            node.classList.add("qyr-active-iqxin");
        });
        node.addEventListener("mouseleave",function(){
            setTimeout(function(){
                node.classList.remove("qyr-active-iqxin");
                black_check(qybtn_node.checked);
            },1000);
        });

        var style = win.createElement("style");
        style.type="text/css";

        var styleInner = "#qyr-iqxin{" +
            "position:fixed;" +
            "transform:translate(-60px,0);" +
            "width:130px;" +
            "height:60px;" +
            "font-size:16px;" +
            "font-weight: 500;" +
            "font-family:Verdana, Arial, '宋体';" +
            "color:#fff;" +
            "background:#333;" +
            "z-index:2147483647;" +
            "margin: 0;" +
            "opacity:0.8;" +
            "transition:0.1s;" +
            "overflow:hidden;" +
            "user-select:none;" +
            "text-align:center;" +
            "white-space:nowrap;" +
            "line-height:25px;" +
            "padding:0 16px;" +
            "border:1px solid #ccc;" +
            "border-width:1px 1px 1px 0;" +
            "border-bottom-right-radius:5px;" +
            "box-sizing: content-box;" +
            "}" +
            "#qyr-iqxin input{" +
            "margin: 0;" +
            "padding: 0;" +
            "vertical-align:middle;" +
            "-webkit-appearance:checkbox;" +
            "-moz-appearance:checkbox;" +
            "position: static;" +
            "clip: auto;" +
            "opacity: 1;" +
            "cursor: pointer;" +
            "}" +
            "#qyr-iqxin.qyr-active-iqxin{" +
            "left: 0px;" +
            "transform:translate(0,0);" +
            "opacity: 0.9;" +
            "height: 52px;" +
            "line-height: 52px" +
            "}" +
            "#qyr-iqxin label{" +
            "margin:0;" +
            "padding:0;" +
            "font-weight:500;" +
            "}" +
            "#qyr-iqxin #qyr-setbtn{" +
            "margin: 0 4px 0 0;" +
            "padding: 0 0 0 4px;" +
            "border: none;" +
            "border-radius: 2px;" +
            "cursor: pointer;" +
            "background: #fff;" +
            "color: #000;" +
            "}" +
            " ";

        if(!qyr_userData.xsaddBtn){
            var styleTemp = "#qyr-iqxin{display:none}";
            style.innerHTML = styleInner + styleTemp;
            console.log("通过styleTemp");
        } else {
            style.innerHTML = styleInner;
            console.log("通过styleInner");
        };
        if(win.querySelector("#qyr-iqxin")){
            console.log("通过style插入");
            win.querySelector("#qyr-iqxin").appendChild(style);
        } else {
            console.log("通过GM插入");
            GM_addStyle(styleInner);
        };
    };
    // 给按钮绑定点击事件;
    function setBtnClick(){
        win.querySelector("#qyr-setbtn").addEventListener("click",setMenu);
        win.querySelector("#qyblack_node").addEventListener("click",qy_setVar);
    };

    // 菜单;
    function setMenu(){
        var oldEditBox = win.querySelector("#qyr-setMenu");
        if(oldEditBox){
            oldEditBox.parentNode.removeChild(oldEditBox);
            return;
        };
        var userSetting = GM_getValue("qyr_userData");
        //qy_riqitxt = userSetting.qy_rqitxt;
        qy_qishuks = userSetting.qy_qshuks;
        qy_qishujs = userSetting.qy_qshujs;
        qy_jiner = userSetting.qy_jner;
        qy_peilv = userSetting.qy_pelv;
        qy_bnode = userSetting.qy_node;
        qy_zhisun = userSetting.qy_zhisu;
        qy_zhisunf = userSetting.qy_zhisuf;
        var j=0,k=0;
        for(var i=0;i<10;i++){
            if(qy_xzcda[i] && j==0){
                j=1;k=i;
                var Check=[],qy_i=qy_xzcda[i]-1;Check[0]=true;
                CheckVar1[qy_i] = Check[0]?'checked':'';
                //console.log(qy_i," CheckVar1 ",CheckVar1[qy_i]);
            };
            if(j){
                CheckVar1[i+10] = qy_xzcdb[k][i]?'checked':'';
                dui_bs[i]=userSetting.dui_Up[i];
                cuo_bs[i]=userSetting.cuo_Up[i];
            };
            //console.log(i," ============="+qy_xzcda[i]);
            //console.log(k," 道 ",qy_xzcdb[k][i]);
        };
        var odom = win.createElement("div");
        odom.id = "qyr-setMenu";
        odom.style.cssText ="position: fixed;" +
            "top: 175px;" +
            "right: 2px;" +
            "padding: 10px;" +
            "background: #fff;" +
            "border-radius: 4px;";
        GM_addStyle("#qyr-setMenuSave," +
                    "#qyr-reset," +
                    "#qyr-setSaveShe," +
                    "#qyr-setwbtxt," +
                    "#qyr-setMenuClose{" +
                    "margin: 0;" +
                    "padding: 0 2px;" +
                    "border: none;" +
                    "border-radius: 2px;" +
                    "cursor: pointer;" +
                    "background: #fff;" +
                    "color: #000;" +
                    "}" +
                    "#qyr-reset{" +
                    "border: 1px solid #666;" +
                    "}" +
                    "#qyr-setMenuSave{" +
                    "border: 1px solid green;" +
                    "}" +
                    "#qyr-setMenuClose{" +
                    "border: 1px solid red;" +
                    "}" +
                    "#qyr-setMenu{" +
                    "text-align:left;" +
                    "font-size:16px;" +
                    "z-index:999999;" +
                    "border: 1px solid cornflowerblue;" +
                    "}" +
                    "#qyr-setMenu p{" +
                    "margin:5px auto;" +
                    "}" +
                    "#qyr-setSaveShe{" +
                    "border: 1px solid green;" +
                    "}" +
                    "#qyr-setwbtxt{" +
                    "border: 1px solid #666;" +
                    "}" +
                    ".checkbox-item {" +
                    "background: #ffffff;" +
                    "text-align:center" +
                    //"margin-right: 7px;" +
                    "width: 10px;" +
                    //"height: 20px;" +
                    "zoom:200%;" +
                    "}" +
                    ".qy_tabtopdc td{"+
                    "background:#ffffff;"+
                    "width: 10px;" +
                    "height:20px;"+
                    "line-height:100%;"+
                    "text-align:center"+
                    "}"+
                    ".biaoti{"+
                    "width: 100%;" +
                    "}"+
                    ".biaoti2{"+
                    "font-size:14px;" +
                    "}"+
                    "#qy_iput11{" +
                    "width: 99.2%;" +
                    "display:block;" +
                    "}" +
                    "#qy_iput12{" +
                    "width: 99.2%;" +
                    "display:block;" +
                    "}" +
                    " ");
        var innerH = "" +
            "<qxinbutton id='qyr-reset'>清空 &nbsp;</qxinbutton> &nbsp;" +
            "<qxinbutton id='qyr-setMenuSave'>保存 &nbsp;</qxinbutton> &nbsp;" +
            "<qxinbutton id='qyr-setMenuClose' title='如果无法关闭 请刷新' >关闭 &nbsp;</qxinbutton> &nbsp;" +
            "<qxinbutton id='qyr-setSaveShe'>存车</qxinbutton> &nbsp;" +
            "<select id='qyr-shortcut' style='width:90px;height:22px'>" +
            "<option value='off'" + (userSetting.shortcut == 0?"selected":"") + ">168开奖</option>" +
            "<option value='f1'" + (userSetting.shortcut == 1?"selected":"") + ">SG</option>" +
            "<option value='ctrlf1'" + (userSetting.shortcut == 2?"selected":"") + ">宝盈</option>" +
            "<option value='ctrlc'" + (userSetting.shortcut == 3?"selected":"") + ">大发</option>" +
            "</select>&nbsp;" +
            "<select id='qyr-shortcut3' style='width:70px;height:22px'>" +
            "<option value='off'" + (userSetting.shortcut3 == 0?"selected":"") + ">元</option>" +
            "<option value='f1'" + (userSetting.shortcut3 == 1?"selected":"") + ">角</option>" +
            "<option value='ctrlf1'" + (userSetting.shortcut3 == 2?"selected":"") + ">分</option>" +
            "<option value='ctrlc'" + (userSetting.shortcut3 == 3?"selected":"") + ">厘</option>" +
            "</select>&nbsp;" +
            "<select id='qyr-shortcut2' style='width:60px;height:22px'>" +
            "<option value='off'" + (userSetting.shortcut2 == 0?"selected":"") + ">测试历史</option>" +
            "<option value='f1'" + (userSetting.shortcut2 == 1?"selected":"") + ">正式下单</option>" +
            "</select>" +
            "<table width='100%' border='0' cellspacing='1' cellpadding='4' bgcolor='#cccccc' class='qy_tabtopdc' align='center'>"+
            //"<input id='qy_iput1' type='text' style='width:75px;height:20px' value=" + qy_riqitxt + ">" +
            "<p>从<input id='qy_iput2' type='text' style='width:40px;height:20px' value=" + qy_qishuks + ">" +
            "到<input id='qy_iput3' type='text' style='width:40px;height:20px' value=" + qy_qishujs + ">期 " +
            "<input id='qy_iput8' type='text' style='width:170px;height:20px' readOnly='true' value=总" + fhzstr1 + "对" + fhzstr2 + "错" +
            ">" +
            "高停:<input id='qy_iput6' type='text' style='width:40px;height:20px' value="+qy_zhisun+"></p>" +

            "<p><input id='qy_iput9' type='text' style='width:50px;height:20px' readOnly='true' value=" + qy_zgfu + ">"+
            "<input id='qy_iput10' type='text' style='width:50px;height:20px' readOnly='true' value=" + sy_tor + ">"+
            "盈利<input id='qy_iput4' type='text' style='width:60px;height:20px' readOnly='true' value=" + sy_zyl + ">" +
            "金:<input id='qy_iput5' type='text' style='width:25px;height:20px' value=" + qy_jiner + ">" +
            "率:<input id='qy_iput7' type='text' style='width:38px;height:20px' value=" + qy_peilv + ">" +
            "低停:<input id='qy_iput1' type='text' style='width:40px;height:20px' value=" + qy_zhisunf + "></p>" +
            "<input id='qy_iput11' type='text' value="+ dui_bs[0]+ ">"+
            "<input id='qy_iput12' type='text' value="+ cuo_bs[0]+ ">"+
            "<tr><td><input id='btnchecked1'  type='checkbox' class='checkbox-item' " + CheckVar1[0] + "></td>" +
            "<td><input id='btnchecked2'  click='alertInput()' type='checkbox' class='checkbox-item' " + CheckVar1[1] + "></td>" +
            "<td><input id='btnchecked3'  type='checkbox' class='checkbox-item' " + CheckVar1[2] + "></td>" +
            "<td><input id='btnchecked4'  type='checkbox' class='checkbox-item' " + CheckVar1[3] + "></td>" +
            "<td><input id='btnchecked5'  type='checkbox' class='checkbox-item' " + CheckVar1[4] + "></td>" +
            "<td><input id='btnchecked6'  type='checkbox' class='checkbox-item' " + CheckVar1[5] + "></td>" +
            "<td><input id='btnchecked7'  type='checkbox' class='checkbox-item' " + CheckVar1[6] + "></td>" +
            "<td><input id='btnchecked8'  type='checkbox' class='checkbox-item' " + CheckVar1[7] + "></td>" +
            "<td><input id='btnchecked9'  type='checkbox' class='checkbox-item' " + CheckVar1[8] + "></td>" +
            "<td><input id='btnchecked10'  type='checkbox' class='checkbox-item' " + CheckVar1[9] + "></td></tr>" +

            "<tr><td><input id='btnchecked11'  type='checkbox' class='checkbox-item' " + CheckVar1[10] + "></td>" +
            "<td><input id='btnchecked12'  type='checkbox' class='checkbox-item' " + CheckVar1[11] + "></td>" +
            "<td><input id='btnchecked13'  type='checkbox' class='checkbox-item' " + CheckVar1[12] + "></td>" +
            "<td><input id='btnchecked14'  type='checkbox' class='checkbox-item' " + CheckVar1[13] + "></td>" +
            "<td><input id='btnchecked15'  type='checkbox' class='checkbox-item' " + CheckVar1[14] + "></td>" +
            "<td><input id='btnchecked16'  type='checkbox' class='checkbox-item' " + CheckVar1[15] + "></td>" +
            "<td><input id='btnchecked17'  type='checkbox' class='checkbox-item' " + CheckVar1[16] + "></td>" +
            "<td><input id='btnchecked18'  type='checkbox' class='checkbox-item' " + CheckVar1[17] + "></td>" +
            "<td><input id='btnchecked19'  type='checkbox' class='checkbox-item' " + CheckVar1[18] + "></td>" +
            "<td><input id='btnchecked20'  type='checkbox' class='checkbox-item' " + CheckVar1[19] + "></td></tr>" +

            "<tr><td><input id='qy_anniu' type='button' class='checkbox-item' qycz='button' value=1></td>"+
            "<td><input id='qy_anniu' type='button' class='checkbox-item' qycz='button' value=2></td>"+
            "<td><input id='qy_anniu' type='button' class='checkbox-item' qycz='button' value=3></td>"+
            "<td><input id='qy_anniu' type='button' class='checkbox-item' qycz='button' value=4></td>"+
            "<td><input id='qy_anniu' type='button' class='checkbox-item' qycz='button' value=5></td>"+
            "<td><input id='qy_anniu' type='button' class='checkbox-item' qycz='button' value=6></td>"+
            "<td><input id='qy_anniu' type='button' class='checkbox-item' qycz='button' value=7></td>"+
            "<td><input id='qy_anniu' type='button' class='checkbox-item' qycz='button' value=8></td>"+
            "<td><input id='qy_anniu' type='button' class='checkbox-item' qycz='button' value=9></td>"+
            "<td><input id='qy_anniu' type='button' class='checkbox-item' qycz='button' value=0></td></tr>" +

            "<tr class='biaoti2'><td>"+qy_duiall[0]+"</td><td>"+qy_duiall[1]+"</td><td>"+qy_duiall[2]+"</td><td>"+qy_duiall[3]+"</td><td>"+qy_duiall[4]+"</td><td>"+qy_duiall[5]+"</td><td>"+qy_duiall[6]+"</td><td>"+qy_duiall[7]+"</td><td>"+qy_duiall[8]+"</td><td>"+qy_duiall[9]+"</td></tr>"+
            "<tr class='biaoti2'><td>"+qy_cuoall[0]+"</td><td>"+qy_cuoall[1]+"</td><td>"+qy_cuoall[2]+"</td><td>"+qy_cuoall[3]+"</td><td>"+qy_cuoall[4]+"</td><td>"+qy_cuoall[5]+"</td><td>"+qy_cuoall[6]+"</td><td>"+qy_cuoall[7]+"</td><td>"+qy_cuoall[8]+"</td><td>"+qy_cuoall[9]+"</td></tr>"+
            "<tr class='biaoti2'><td>"+qy_yingli[0]+"</td><td>"+qy_yingli[1]+"</td><td>"+qy_yingli[2]+"</td><td>"+qy_yingli[3]+"</td><td>"+qy_yingli[4]+"</td><td>"+qy_yingli[5]+"</td><td>"+qy_yingli[6]+"</td><td>"+qy_yingli[7]+"</td><td>"+qy_yingli[8]+"</td><td>"+qy_yingli[9]+"</td></tr>"+
            "<tr><td colspan='7'><textarea id='qykjjgtxt' wrap='off' class='biaoti' rows='20' style='overflow:auto;border-radius:4px;' "+readonly+">" + JSON.stringify(userSetting.data,false,4) + "</textarea></td>"+
            "<td colspan='3'><textarea id='qykjjgtxt2' wrap='off' class='biaoti' rows='20' style='overflow:auto;border-radius:4px;' "+readonly+"></textarea></td></tr>"+
            "</table>"+
            "<br>" +
            ""
        "";
        odom.innerHTML = innerH;
        win.body.appendChild(odom);
        win.querySelector("#qyr-setMenuSave").addEventListener("click",saveSetting);
        //win.querySelector("#qyr-setMenuClose").addEventListener("click",closeMenu);
        win.querySelector("#qyr-reset").addEventListener("click",rwlReset);
        win.querySelector("#qyr-setSaveShe").addEventListener("click",ChkdVar);
        win.querySelector("#qy_anniu").addEventListener("click",qy_wbtxts);
    };
    //function saveys(obj){
    //if(this.value=='你好') {this.style.backgroundColor='green';} else if(this.value=='不好') {this.style.backgroundColor='red';} else {this.style.backgroundColor='white';};
    //};
    // 保存选项;
    function saveSetting(){
        readonly = "readonly";
        codevalue = win.querySelector("#qyr-setMenu #qykjjgtxt").value;
        if(win.querySelector("#qyr-setMenu #qy_iput5")){
            var userSetting = GM_getValue("qyr_userData");
            qy_setVar();
            for(var i=0;i<10;i++){userSetting.dui_Up.splice(i,1,dui_bs[i]);userSetting.cuo_Up.splice(i,1,cuo_bs[i]);}
            //userSetting.dui_Up=dui_bs
            userSetting.qy_qshuks = qy_qishuks;
            userSetting.qy_qshujs = qy_qishujs;
            userSetting.qy_jner = qy_jiner;
            userSetting.qy_pelv = qy_peilv;
            userSetting.qy_node = qy_bnode;
            userSetting.qy_zhisu = qy_zhisun;
            userSetting.qy_zhisuf = qy_zhisunf;
            userSetting.xsaddBtn = (qyr_userData.xsaddBtn);
            userSetting.data = JSON.parse(codevalue);
            userSetting.positionTop = parseInt(qyr_userData.positionTop);
            userSetting.shortcut = parseInt(qy_shortcut);
            userSetting.shortcut2 = parseInt(qy_shortcut2);
            // userSetting.connectToTheServer = uploadChecked;
            GM_setValue("qyr_userData",userSetting);
            // 刷新页面;
            setTimeout(function(){
                window.location.reload();
                //win.querySelector("#qyr-setMenu").innerHTML;
                //odom.innerHTML = innerH;
                //win.body.appendChild(odom);
            },300);
        }else{
            alert("输入为空");
            // this.reset();
        };
        closeMenu();
    };
    // 复原菜单;
    function rwlReset(){
        GM_deleteValue("qyr_userData");
        window.location.reload();
    };

    //关闭菜单;
    function closeMenu(){
        var oldEditBox = win.querySelector("#qyr-setMenu");
        if(oldEditBox){
            oldEditBox.parentNode.removeChild(oldEditBox);
            return;
        };
    };

    function black_check(bool){
        var list = GM_getValue("qyr_userData").data;
        var check = false;
        if (bool && !check) {
            //list = list.concat(hostname);
            console.log("选中1");
            //qyr_userData.waitUpload.push(hostname); //准备上传;
            //qyr_userData.currentURL = window.location.href;
            // console.log("after: ",qyr_userData.waitUpload);
            //saveData(list);
            //init();
        }else if(!bool && check){
            list.splice(check-1,1);
            saveData(list);
            // 刷新页面;
            setTimeout(function(){
                window.location.reload(true);
                console.log("刷新页面loading");
            },350);
            console.log("选中2");
        }else{
            console.log("选中3");
            return false;
        };
        return false;
        //saveData(list);
    };
    // 保存本地数据,并将数据上传至服务器;
    function saveData(lists){
        lists = lists.filter(function(item){
            return item.length>1;
        });
        // 更新数据;
        qyr_userData.data = lists.sort();
        // 将本地黑名单上传;
        // if (qyr_userData.waitUpload.length > 0 && qyr_userData.connectToTheServer){
        //     // console.log("rwl : 上传...",qyr_userData.waitUpload);
        //     // console.log("rwl : 开始上传-----");
        //     GM_xmlhttpRequest({
        //       method: "POST",
        //       // url: "http://127.0.0.1:8000/tool/testajax/",
        //       url: "http://eemm.me/tool/qyr_upload/",
        //       data: JSON.stringify(qyr_userData),
        //       headers: {
        //         "Content-Type": "application/x-www-form-urlencoded"
        //       },
        //       onload: function(response) {
        //         // console.log("rwl : 上传成功----");
        //       };
        //     });
        //     qyr_userData.waitUpload = [];
        // };
        //console.log("选中4");
        GM_setValue("qyr_userData",qyr_userData);
        return qyr_userData;
    };
})();
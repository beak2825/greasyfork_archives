

    // ==UserScript==
    // @name         老司机传说
    // @namespace    http://www.ocrosoft.com/?p=1005
    // @version      0.891
    // @description  支持琉璃神社、灵梦御所、纯爱计划、聖霊神域、绅士二次元、天使二次元、MyGalgame，全自动。自动展开神社隐藏的链接、自动开启御所老司机模式、自动转换神社神秘代码、自动填写御所、纯爱计划、MyGalgame打开的百度网盘提取码、为聖霊神域添加免金币快捷通道、绅士二次元免解密、MyGalgame免跳转。新的一年一起飙车吧;)
    // @author       ocrosoft
    // @match        *://blog.reimu.net/*
    // @match        https://blog.reimu.net/?password-protected=login*
    // @match        *://pan.baidu.com/share/init?*
    // @match        *://yun.baidu.com/share/init?*
    // @match        *://*.hacg.li/*
    // @match        *://*.hacg.fi/*
    // @match        *://*.hacg.lol/*
    // @match        *://*.hacg.red/*
    // @match        *://sexacg.com/*
    // @match        *://bbs.holyo.org/*
    // @match        *://www.acg.tf/*
    // @match        *://www.tianshit.com/*
    // @match        *://www.mygalgame.com/*
    // @match        *://www.hacg.wiki/*
    // @match        *://www.llss.me/*
    // @match        *://www.llss.fun/*
    // @match        *://www.liuli.pw/*
    // @match        *://www.liuli.eu/*
    // @match        *://www.liuli.in/*
    // @match        *://www.liuli.uk/*
    // @match        *://www.liuli.se/*
    // @match        *://www.liuli.pl/*
    // @match        *://www.liuli.app/*
    // @match        *://www.liuli.cat/*
    // @match        *://www.hacg.cat/*
    /*---------------------------------------------------------*/
    /*以下网站会跳转，如不需要请删除相应行*/
    // @match        *://*.hacg.tw/*
    // @match        *://*.hacg.ch/*
    // @match        *://*.hacg5.me/*
    // @match        *://*.hacg.it/*
    // @match        *://*.hacg.la/*
    // @match        *://*.llss.tw/*
    // @match        *://*.hacg.site/*
    /*---------------------------------------------------------*/
    // @icon         http://www.ocrosoft.com/lsj.png
    // @require      http://code.jquery.com/jquery-2.1.4.min.js
    // @require      https://cdn.bootcss.com/crypto-js/3.1.2/components/core-min.js
    // @require      https://cdn.bootcss.com/crypto-js/3.1.2/rollups/aes.js
    // @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/436634/%E8%80%81%E5%8F%B8%E6%9C%BA%E4%BC%A0%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/436634/%E8%80%81%E5%8F%B8%E6%9C%BA%E4%BC%A0%E8%AF%B4.meta.js
    // ==/UserScript==
    /*开关，1打开，0关闭*/
    //Ctrl+Enter开启老司机模式：
    var odON=1;
    //自动填写百度提取码：
    var aiON=1;
    //御所重口味内容不自动开启老司机模式：
    var auodOFF=1;
    //转换链接输入框显示的站点，1、2、3、4位置分别表示琉璃神社、灵梦御所、纯爱计划、聖霊神域、天使二次元，0为关闭，1为开启
    var boxON=new Array(1,0,1,0,1);
    /*开关*/
    /*特别感谢@hoothin，这里很多东西都是参考(有的是直接抄的...)他写的琉神转脚本，这个脚本甚至可以说是他的脚本的简化版(少了很多网站支持，因为我自己开车的网站就那么几个)*/
    /*PS:那个弹出框效果真好看， 好想抄...*/
     
    var urls=location.href;
    var hash=location.hash;
    var host=location.hostname.replace(/^www\./i,'').toLowerCase();
    var site = {
        'baidu.com': {
            chk:  /^[a-z0-9]{4}$/,
            code: '#accessCode',
            btn:  '#submitBtn'
        },
        'weiyun.com': {
            chk: /^[a-z0-9]{4}$/i,
            code: '#outlink_pwd',
            btn:  '#outlink_pwd_ok'
        },
        'codeRule':/(?:提取|访问|密|艾)[码碼]?\s*[:： ]?\s*([a-z\d]{4})/i,
        'JumpUrl':{
            'zhihu.com' :  $('A[href^="http://link.zhihu.com/?target="]'),
            //'tieba.baidu.com' : $('A[href^="http://jump.bdimg.com/safecheck/index?url="]')
        }
    };
    unsafeWindow.eve = Event;
    function addattention(){//添加提示
        var dv = document.createElement("div");
        dv.innerHTML = '此页含重口味/血腥内容，未开启老司机模式。请使用Ctrl+Enter或点击开启。';
        dv.style.background="#59c3db";dv.style.position="fixed";dv.style.heght=50;
        dv.style.zIndex=99999;dv.style.textAlign="center";dv.id="attention";
        dv.style.color="#fff";dv.style.cursor="pointer";
        var page = document.getElementsByTagName("body")[0];
        //var page = document.getElementsByClassName("site-content")[0];
        page.insertBefore(dv,page.firstChild);
        $("#attention").click(function () {
            var pre = document.getElementsByTagName('pre');
            for(var rmi=0;rmi<pre.length;rmi++)
                if (pre[rmi]) pre[rmi].style.display = 'block';
            $("#attention").remove();
        });
        document.getElementById("attention").style.width=page.offsetWidth+"px";
    }
    //判断是否自动开启老司机模式
    function ifshow(){
        if(auodOFF===0)return 1;//跳过重口味判断
        var ifShow=1;
        var strongs=document.getElementsByTagName('strong');
        for(var sti=0;sti<strongs.length;sti++){
            if(strongs[sti].innerText){
                var innerT=strongs[sti].innerText;
                if(innerT.indexOf("重口")!=-1){
                    addattention();
                    return 0;
                }
            }
        }
        var tags=document.getElementsByClassName('tags-links')[0];
        if(tags){
            for(var cd=0;cd<tags.childNodes.length;cd++){
                var tga=tags.childNodes[cd];
                if(tga&&tga.innerText){
                    if(tga.innerText.indexOf("重口")!=-1||tga.innerText.indexOf("血腥")!=-1||tga.innerText.indexOf("猎奇")!=-1){
                        ifShow=0;
                        if(!document.getElementsByTagName('pre')[0])return 0;
                        addattention();
                        return 0;
                    }
                }
            }
        }
        $("#attention").remove();
        return 1;
    }
    function addBase64Box(){//添加Base64转换
        var oD_box=document.createElement("div");
        oD_box.style.zindex="999999";
        oD_box.id="oD_box";
        oD_box.style="position:fixed;top:100px;right:10px;  width:210px;";
        var oD_text=document.createElement("input");
        oD_text.background="#fff";
        oD_text.id="oD_text";
        oD_text.type="text";
        oD_text.placeholder="输入Base64密文";
        var oD_button=document.createElement("button");
        oD_button.id="oD_button";
        oD_button.type="button";
        oD_button.textContent="转换";
        oD_button.style="padding:4px 0;  position: relative;  top:-1px";
        oD_button.onclick=function (){
            var oD_hash=oD_text.value;
            oD_text.value=window.atob(oD_hash);
        };
        oD_box.appendChild(oD_text);
        oD_box.appendChild(oD_button);
        document.body.appendChild(oD_box);
    }
    function addBox(){//添加下载种子链接
        var oD_box=document.createElement("div");
        oD_box.style.zindex="999999";
        oD_box.id="oD_box";
        oD_box.style="position:fixed;top:10px;right:10px;  width:210px;";
        var oD_text=document.createElement("input");
        oD_text.id="oD_text";
        oD_text.type="text";
        oD_text.placeholder="输入神秘代码";
        oD_text.title='如果点击下载种子无法下载，请用下载工具下载磁力链接';
        var oD_button=document.createElement("button");
        oD_button.id="oD_button";
        oD_button.type="button";
        oD_button.textContent="转换";
        oD_button.style="padding:4px 0;  position: relative;  top:-1px";
        oD_button.onclick=function (){
            var oD_hash=oD_text.value.replace(/(\[.*\])|[\W_]/g,"");
            if(oD_hash===""){
                alert("请先输入hash!");
                oD_link.href="javascript:alert('请输入hash并点击转换按钮!')";
                oD_link.textContent="\n磁力链接";
                oD_link2.href="javascript:alert('请输入hash并点击转换按钮!')";
                oD_link2.textContent="下载种子";
                return;
            }
            else{
                oD_link.href="magnet:?xt=urn:btih:"+oD_hash;
                oD_link.textContent="\n磁力链接";
                oD_link2.href="http://www.torrent.org.cn/Home/torrent/download.html?hash="+oD_hash;
                oD_link2.textContent="下载种子";
                oD_link2.style="margin-left:20px";
            }
        };
        var oD_link=document.createElement("a");
        var oD_link2=document.createElement("a");
        oD_link.href="javascript:alert('请输入hash并点击转换按钮!')";
        oD_link.textContent="\n磁力链接";
        oD_link2.href="javascript:alert('请输入hash并点击转换按钮!')";
        oD_link2.textContent="下载种子";
        oD_link2.style="margin-left:20px";
        oD_link2.target="_blank";
        oD_box.appendChild(oD_text);
        oD_box.appendChild(oD_button);
        oD_box.appendChild(oD_link);
        oD_box.appendChild(oD_link2);
        document.body.appendChild(oD_box);
    }
    function holyo1(){
        if(boxON[3])addBox();
        var codeSet = [];
        var fontTag=document.getElementsByTagName('font');
        for(var holi=0;holi<fontTag.length;holi++){
            var codeUsed=0;
            var strExp=/^[A-Za-z0-9]+$/;
            var slCode="";
            if(!fontTag[holi].childNodes[0])continue;
            if(fontTag[holi].childNodes[0].innerText){
                var tep=fontTag[holi].childNodes[0].innerText.trim();
                if(!(tep.length>=10&&tep.length<=25))continue;
                if(!strExp.test(tep))continue;
                codeUsed=0;
                for(var seti in codeSet){
                    if(codeSet[seti]==tep){codeUsed=1;break;}
                }
                slCode=tep;
            }
            else if(fontTag[holi].childNodes[0].data){
                var tep2=fontTag[holi].childNodes[0].data.trim();
                if(!(tep2.length>=10&&tep2.length<=25))continue;
                if(!strExp.test(tep2))continue;
                codeUsed=0;
                for(var setj in codeSet){
                    if(codeSet[setj]==tep2){codeUsed=1;break;}
                }
                slCode=tep2;
            }
            else continue;
            if(codeUsed==1)continue;
            codeSet[codeSet.length]=slCode;
            var form = document.createElement("form");
            form.name="form2";form.method="post";form.target="_blank";
            form.action="http:\\www.yeelee.net\\download.php";
            var input=document.createElement("input");
            input.type="text";input.name="ref";
            input.size=18;input.value=slCode;
            form.appendChild(input);
            var input2=document.createElement("input");
            input2.type="submit";input2.height=27;input.width=174;
            input2.value="点击下载";input2.border="0";
            input2.name="submit";input2.valign="bottom";
            form.appendChild(input2);
            fontTag[holi].appendChild(form);
            if(fontTag[holi].childNodes[0].innerText);
            else fontTag[holi].childNodes[0].data="";
            //break;
        }
    }
    function holyo2(){//懒
        var codeSet = [];
        var fontTag=$('a');
        for(var holi=0;holi<fontTag.length;holi++){
            var codeUsed=0;
            var strExp=/^[A-Za-z0-9]+$/;
            var slCode="";
            if(fontTag[holi].innerText){
                var tep=fontTag[holi].innerText.trim();
                if(tep.indexOf('yeelee')==-1)continue;
                codeUsed=0;
                for(var seti in codeSet){
                    if(codeSet[seti]==tep){codeUsed=1;break;}
                }
                slCode=tep.split('=')[1];
            }
            else if(fontTag[holi].data){
                var tep2=fontTag[holi].data.trim();
                if(tep2.indexOf('yeelee')==-1)continue;
                codeUsed=0;
                for(var setj in codeSet){
                    if(codeSet[setj]==tep2){codeUsed=1;break;}
                }
                slCode=tep2.split('=')[1];
            }
            else continue;
            if(codeUsed==1)continue;
            codeSet[codeSet.length]=slCode;
            var form = document.createElement("form");
            form.name="form2";form.method="post";form.target="_blank";
            form.action="http:\\www.yeelee.net\\download.php";
            var input=document.createElement("input");
            input.type="text";input.name="ref";
            input.size=18;input.value=slCode;
            form.appendChild(input);
            var input2=document.createElement("input");
            input2.type="submit";input2.height=27;input.width=174;
            input2.value="点击下载";input2.border="0";
            input2.name="submit";input2.valign="bottom";
            form.appendChild(input2);
            fontTag[holi].appendChild(form);
            if(fontTag[holi].innerText);
            else fontTag[holi].data="";
        }
    }
    //执行函数
    (function(){
        'use strict';
        //屏蔽一些"伪站"
        if(host=="hacg.tw"||host=="hacg.ch"||host=="hacg5.me"||host=="hacg.it"||host=="hacg.la"||host=="llss.tw"||host=="hacg.site"){
            alert("即将跳转到琉璃神社，若不想跳转，访问该网站时请关闭老司机传说");
            location.href="https://www.liuli.app/wp";
        }
        var originTitile = document.title;
        //灵梦御所
        if(host=="blog.reimu.net"){
            if (location.href.indexOf('https://blog.reimu.net/?password-protected=login') != -1) {
                $('#password_protected_pass').val('⑨');
                $('#wp-submit').click();
            }
            var titleTime;
            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    document.title = '\u6765\u556a\u0038\u5566~(*′?｀*) ' + originTitile;
                    clearTimeout(titleTime);
                }
                else {
                    document.title = '\u624d\u4e0d\u7ed9\u556a(╯‵□′)╯︵┻━┻ ' + originTitile;
                    titleTime = setTimeout(function() {
                        document.title = originTitile;
                    }, 2000);
                }
            });//hoothin的"可啪"效果
            if(boxON[1])addBox();
            //开启老司机模式
            if(ifshow()){
                var pre = document.getElementsByTagName('pre');
                for(var rmi=0;rmi<pre.length;rmi++){
                    if (pre[rmi]) pre[rmi].style.display = 'block';
                    var textrei=pre[rmi].innerHTML;
                    if(textrei){
                        var cilirei=textrei.match(/magnet:?[^\n"]+/);
                        pre[rmi].innerHTML=textrei.replace(cilirei,'<a href="'+cilirei+'">'+cilirei+'</a>');
                    }
                }
            }
            //修复bug，来自hoothin，完全不知道这个bug；_(:зゝ∠)_
            document.querySelector("#main").addEventListener('DOMNodeInserted', function(e) {
                var author = document.querySelector(".author-info");
                if (author && !document.querySelector("#blockBtn")) {
                    createBlockBtn();
                    process();
                    var $=unsafeWindow.jQuery;
                    var toggle=$(".toggle")[0];
                    if(toggle){
                        var evts=$._data(toggle, "events");
                        if(!evts || !evts["click"]){
                            $(".toggle-box").hide();
                            $(".toggle").toggle(function(){
                                $(this).addClass("toggle-active");
                            }, function () {
                                $(this).removeClass("toggle-active");
                            });
                            $(".toggle").click(function(){
                                $(this).next(".toggle-box").slideToggle();
                            });
                        }
                    }
                }
            });
            //添加直接跳转到下载链接的按钮
            var oD_box=document.createElement("div");
            oD_box.style.zindex="999999";
            oD_box.id="goToDownload";
            oD_box.style="position:fixed;top:60px;right:0px;width:40px;transition: all 0.2s ease;white-space:nowrap;z-index:99998";
            var oD_button=document.createElement("button");
            oD_button.id="goToDownload_button";
            oD_button.type="button";
            oD_button.innerHTML="前往<br/>下载";
            oD_button.style="padding: 4px 0px; position: absolute; top: -1px; right: 0px; width: 40px; height: auto;";
            oD_button.onclick=function (){
                if(document.getElementsByTagName('pre').length>1)alert("下载链接可能不止一个，将跳转到第一个!");
                document.getElementsByTagName('pre')[0].scrollIntoView();
            };
            oD_box.appendChild(oD_button);
            document.body.appendChild(oD_box);
        }
        //调整跳转链接
        else if(host.indexOf('hacg')!=-1||host.indexOf('llss')!=-1||host.indexOf('liuli')!=-1||host.indexOf('tianshit')!=-1){//琉璃神社\天使二次元
            if((host.indexOf('hacg')!=-1 || host.indexOf('llss')!=-1 || host.indexOf('liuli')!=-1)&&boxON[0])addBox();
            if(host.indexOf('tianshit')!=-1&&boxON[4])addBox();
            var aaa=$(".entry-title a");
            for(var j=0;j<aaa.length;j++){
                var ax=aaa[j];
                var dir=ax.href.indexOf(':');
                ax.href="https"+ax.href.substring(dir);
            }
            //调整神秘代码
            var toogle = document.getElementsByClassName('toggle-box')[0];
            if (toogle) toogle.style.display = 'block';
            var oldDriver = document.getElementsByClassName('entry-content')[0];
            if(host.indexOf('tianshit')!=-1)oldDriver=document.getElementsByClassName('article-content')[0];
            var childDriver = oldDriver.childNodes;
            for (var i = childDriver.length - 1; i >= 0; i--){
                var takeMe = childDriver[i].textContent.match(/(\w{40})|(([A-Za-z0-9]{2,39})( ?)[\u4e00-\u9fa5 ]{2,}( ?)+(\w{2,37})\b)/g);
                if (takeMe){
                    for (j = 0; j < takeMe.length; ++j){
                        var has = takeMe[j].toString().replace(/(\s|[\u4e00-\u9fa5])+/g, '').trim();
                        if (has.length >= 40){
                            var fuel = "<a href='magnet:?xt=urn:btih:" + has + "'>老司机链接</a>"+"("+has+")";
                            if(childDriver[i].innerHTML)
                                childDriver[i].innerHTML = childDriver[i].innerHTML.toString().replace(takeMe[j], fuel);
                            else if(childDriver[i].parentElement)
                                if(childDriver[i].parentElement.innerHTML)
                                    childDriver[i].parentElement.innerHTML=childDriver[i].parentElement.innerHTML.replace(takeMe[j], fuel);
                        }
                    }
                }
                else{
                    takeMe=childDriver[i].textContent.match(/(\w{32})|(([A-Za-z0-9]{2,31})( ?)[\u4e00-\u9fa5 ]{2,}( ?)+(\w{2,29})\b)/g);
                    if(takeMe){
                        for (j = 0; j < takeMe.length; ++j){
                            var has2 = takeMe[j].toString().replace(/(\s|[\u4e00-\u9fa5])+/g, '').trim();
                            if (has2.length >= 32){
                                var fuel2 = "<a href='magnet:?xt=urn:btih:" + has2 + "'>老司机链接</a>"+"("+has2+")";
                                childDriver[i].innerHTML = childDriver[i].innerHTML.toString().replace(takeMe[j], fuel2);
                            }
                        }
                    }
                }
            }
            //小八链接
            var buDang=document.getElementsByClassName('comment-content');
            for (i in buDang){
                if(buDang[i].innerHTML){
                    buDang[i].innerHTML=buDang[i].innerHTML.replace(/b?\/?s?\/?\b(\w{8})\b/g,"<a href='http://pan.baidu.com/s/$1'>百度网盘</a>");
                }
            }
        }
        //纯爱计划
        else if(host=="sexacg.com"){
            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    document.title = '看不到我.??o·(′?ω?‘)?o·?. ' + originTitile;
                    clearTimeout(titleTime);
                }
                else {
                    document.title = '被找到啦<(*￣▽￣*)/' + originTitile;
                    titleTime = setTimeout(function() {
                        document.title = originTitile;
                    }, 2000);
                }
            });//hoothin的"可啪"效果
            if(boxON[2])addBox();
            var getp=document.getElementsByTagName('p');
            getp[getp.length]=document.getElementsByClassName('su-quote-inner')[0];
            for(var ai=0;ai<=getp.length;ai++){
                var acgDriver=getp[ai];
                if(!acgDriver)continue;
                var acgChildDriver = acgDriver.childNodes;
                for (var ci = acgChildDriver.length - 1; ci >= 0; ci--){
                    var bdtext=acgChildDriver[ci].textContent;
                    if(bdtext){
                        bdtext=bdtext.trim();
                        if(bdtext.indexOf('/s')!=-1){
                            bdtext=bdtext.substring(3);
                        }
                    }
                    var a = document.createElement("a");
                    if(bdtext&&bdtext.split(/\s+/)[0].length==8){
                        var bdt2=bdtext.split((/\s+/))[0];
                        if(bdt2.length!=8)continue;
                        if(!bdtext.split(/\s+/)[0].match(/^[a-zA-Z0-9]{0,8}$/))continue;
                        a.setAttribute("href","https://pan.baidu.com/s/"+bdtext.split(/\s+/)[0]);
                        if(a.href=="https://pan.baidu.com/s/")continue;
                        if(a.href.indexOf("Copyright")!=-1)continue;
                        var bdnode = document.createTextNode("传送门    ");
                        a.appendChild(bdnode);
                        var b = document.createElement("a");
                        bdnode =document.createTextNode("提取码："+bdtext.split(/\s+/)[1]+"\n");
                        b.appendChild(bdnode);
                        acgChildDriver[ci].data="";
                        acgDriver.insertBefore(b,acgDriver.childNodes[ci]);
                        acgDriver.insertBefore(a,acgDriver.childNodes[ci]);
                        continue;
                    }
                    var takeacg = acgChildDriver[ci].textContent.match(/(\w{40})|(([A-Za-z0-9]{2,39})( ?)[\u4e00-\u9fa5 ]{2,}( ?)+(\w{2,37})\b)/g);
                    if (takeacg){
                        for (var cj = 0; cj < takeacg.length; ++cj){
                            //console.log(takeacg[cj]);
                            var achas = takeacg[cj].toString().replace(/(\s|[\u4e00-\u9fa5])+/g, '').trim();
                            if (achas.length >= 40){
                                a.setAttribute("href","magnet:?xt=urn:btih:" + achas);
                                var node = document.createTextNode("老司机链接");
                                a.appendChild(node);
                                acgChildDriver[ci].data="("+acgChildDriver[ci].data.trim()+")";
                                acgDriver.insertBefore(a,acgChildDriver[ci]);
                                //return;
                            }
                        }
                    }
                }
            }
        }
        //圣灵神域
        else if(host=="bbs.holyo.org"){
            holyo1();
            holyo2();
        }
        //绅士二次元
        else if(host.indexOf('acg')!=-1){
            addBase64Box();
            if(location.href.indexOf('html')==-1)return;
            var acgp=document.getElementsByTagName('p');
            for(var aci=0;aci<acgp.length;aci++){
                if(acgp[aci].textContent.indexOf('密匙')!=-1){
                    var base64miw=acgp[aci].textContent.split(':')[1];
                    if(!base64miw)base64miw=acgp[aci].textContent.split('：')[1];
                    if(!base64miw)continue;
                    var regCN = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
                    if(regCN.test(base64miw))continue;
                    var base64mw=window.atob(base64miw);
                    acgp[aci].textContent='密匙:'+base64mw;
                    var nsb=acgp[aci].nextSibling;
                    var tmp=nsb.textContent.replace(/[\r\n]/g, "");
                    tmp=tmp.replace(/ /g,"");
                    var mw=CryptoJS.AES.decrypt(tmp,base64mw).toString(CryptoJS.enc.Utf8);
                    if(mw===""){
                        nsb=acgp[aci].nextSibling.nextSibling;
                        tmp=nsb.textContent.replace(/[\r\n]/g, "");
                        tmp=tmp.replace(/ /g,"");
                        mw=CryptoJS.AES.decrypt(tmp,base64mw).toString(CryptoJS.enc.Utf8);
                        if(nsb)nsb.textContent=mw;}
                    var hrefbd=mw.split('密码')[0].split('//')[1];
                    nsb.innerHTML='<a target="_blank" href="http://'+hrefbd+'">传送门</a> '+'密码'+mw.split('密码')[1];
                }
            }
        }
        //忧郁的弟弟
        else if(host.indexOf('mygalgame')!=-1){
            var buttondown=document.getElementsByClassName('btn-danger')[0];
            if(buttondown.outerHTML){
                var panel_footer=document.getElementsByClassName('panel-footer')[0];
                if(panel_footer){
                    var tqmm=panel_footer.childNodes[1].innerText;
                    tqmm=tqmm.substring(tqmm.indexOf('：')+1);
                    var newHTML=buttondown.outerHTML;
                    newHTML=newHTML.replace('\')">','#'+tqmm+'\')">');
                    newHTML=newHTML.replace('http://www.mygalgame.com/go.php?url=','');
                    console.log(newHTML);
                    buttondown.outerHTML=newHTML;
                }
            }
            var pinglun=document.getElementsByClassName('comment-content');
            for (var i=0;i<pinglun.length;i++){
                if(pinglun[i].innerHTML){
                    pinglun[i].innerHTML=pinglun[i].innerHTML.replace(/b?\/?s?\/?\b(\w{8})\b/g,"<a href='http://pan.baidu.com/s/$1'>百度网盘</a>");
                    if(pinglun[i].innerHTML.indexOf('>百度网盘<')!=-1){
                        var danger=document.getElementsByClassName('alert-danger')[0];
                        if(danger){
                            if(danger.innerHTML){
                                danger.innerHTML+=pinglun[i].innerHTML;
                            }
                        }
                    }
                }
            }
     
        }
        //百度云填写验证码
        else{
            var sCode = hash.slice(1).trim();
            if(sCode==='')return;
            setTimeout (function (){
                codeBox = $('.pickpw').find('input');
                btnOk = $('.pickpw').find('.g-button');
                if(codeBox)
                {
                    codeBox.val(sCode);
                    btnOk.click();
                } else {
                    var codeBox = $(conf.code),btnOk = $(conf.btn);
                    codeBox.val(sCode);
                    if (conf.preSubmit)
                        if (conf.preSubmit (codeBox, btnOk))
                            return ;
                    btnOk.click();
                }
            }, 10);
        }
    })();
    var hostName = location.host.match(/\w+\.\w+$/)[0].toLowerCase();
    var conf = site[hostName];
    var HostArr = [];
    for(var i in site) HostArr.push(i);
    var HostExp = new RegExp(HostArr.join("|"),'i');
    if(site.JumpUrl[host]){
        site.JumpUrl[host].each(function(){
            $(this).attr({'href':$(this).text(),'target':'blank'});
        });
    }
    //跳转(点击链接、前进后退)时开启老司机模式
    function lsjmodeON(){
        if(urls.indexOf("archives")!=-1){
            var pret = document.getElementsByTagName('pre')[0];
            if(pret)pret.style.display='inline';//文章页跳转文章页特殊处理
        }
        if(urls==location.href){
            var pret2 = document.getElementsByTagName('pre')[0];
            if(pret2)pret2.style.display='block';//文章页跳转文章页特殊处理
            return;
        }
        $("#attention").remove();
        urls=location.href;
        var re=urls.indexOf("archives");
        if(re!=-1){
            var pre = document.getElementsByTagName('pre')[0];
            var trytime=0;
            var itval=setInterval(function (){
                var pre = document.getElementsByTagName('pre')[0];
                trytime+=1;
                if(trytime==40)clearInterval(itval);
                if(pre){
                    if(pre.style.display!='inline'){
                        if(ifshow()){
                            var prex = document.getElementsByTagName('pre');
                            for(var rmi=0;rmi<prex.length;rmi++)
                                if (prex[rmi]) prex[rmi].style.display = 'block';
                            //pre.style.display='block';
                            clearInterval(itval);
                        }
                        else clearInterval(itval);
                    }
                }
            },500);
        }
    }
    //监控点击事件
    $('body').on('click', 'a', function (){
        if(host=="blog.reimu.net")lsjmodeON();
        //整合提取码和链接
        if(aiON===0)return;
        var target=this;
        if(this.hash) return;
        if(HostExp.test(this.href)&&!/(?:eyun|tieba)\.baidu\.com/i.test(this.href)){
            if(target.nextSibling&&site['codeRule'].test(target.nextSibling.textContent.trim())){
                if(!/#/i.test(target.href)) target.href+='#'+extCode(target.nextSibling);}
            else{
                var cajhc=target.nextSibling.data;
                if(!cajhc)cajhc=target.nextSibling.text;
                if(cajhc.indexOf("：")!=-1){
                    target.href+='#'+cajhc.substring(cajhc.indexOf("：")+1,cajhc.indexOf("：")+3);
                }
                else target.href+='#8酱';
            }
        }
    });
    //提取码
    function extCode(obj){
        text=obj.textContent.trim();
        var rule=new RegExp('(?:提取|访问)[码碼]?\s*[:： ]?\\s*([a-z\\d]{4})','i');
        return rule.test(text)?text.match(rule)[1]:text.match(site['codeRule'])[1];
    }
    //老司机快捷键，并移除重口味提示
    jQuery(document).keypress(function(e){
        if(odON===0)return;//快捷键无效
        if(e.ctrlKey && e.which == 13 || e.which == 10) {
            var pre = document.getElementsByTagName('pre');
            for(var rmi=0;rmi<pre.length;rmi++)
                if (pre[rmi]) pre[rmi].style.display = 'block';
            $("#attention").remove();
        }
    });
    //支持前进后退
    jQuery(document).ready(function ($) {
        if (window.history && window.history.pushState) {
            $(window).on('popstate', function () {
                var hashLocation = location.hash;
                var hashSplit = hashLocation.split("#!/");
                var hashName = hashSplit[1];
                if (hashName !== '') {
                    var hash = window.location.hash;
                    if (hash === '') lsjmodeON();
                }
            });
        }
    });


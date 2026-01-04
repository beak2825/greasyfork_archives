// ==UserScript==
// @name               yiqigouzhushou
// @name:zh-CN         易起购助手
// @namespace          http://erp.kuandar.com/.net/
// @version            2025.02.27
// @description        More labor-saving!
// @description:zh-CN  更加省力！
// @license            MIT
// @author             Super-Tool-Man
// @match              http://erp.kuandar.com/admin/products_edit.php?*
// @icon               http://erp.kuandar.com/admin/imgs/logo.ico
// @require            https://code.jquery.com/jquery-2.1.4.min.js
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/526257/yiqigouzhushou.user.js
// @updateURL https://update.greasyfork.org/scripts/526257/yiqigouzhushou.meta.js
// ==/UserScript==
/* global $:readonly */
/* global jQuery:readonly */

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
    'use strict';


    /*
    全局变量
    */

    //五行前小标题
    const emoji = "◍";
    // const emoji = "❤";

    /*
    方法
    */


    //获取地址栏参数
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
    //国家英文转中文
    function EnglishToChinese(lang){
        let languages = ["en","fr","de","it","es","us","nl","sv","pl"]
        let languages_c = ["英式英语","法语","德语","意大利语","西班牙语","美式英语","荷兰语","瑞典语","波兰语"]
        for(var i =0;i<languages.length;i++){
            if(languages[i]==lang)return languages_c[i]
        }
    }

    //顶部和底部按钮
    function TopAndBot(){
        let top=document.createElement("div");
        top.style.width="30px";
        top.style.height="45%";
        top.style.lineHeight="50px";
        top.style.textAlign="center";
        // top.style.borderRadius="40%";
        top.style.position = "fixed";
        top.style.fontWeight = "bold";
        top.style.cursor="pointer";
        top.style.borderBottom="1px solid #716e6e";
        // top.style.boxShadow = "0 0 1px 0px #716e6e"
        top.style.left="0px";
        top.style.top="0px";
        top.style.display="flex";
        top.style.justifyContent="center";
        top.style.alignItems="center";
        top.innerText="👆";
        top.onclick = ()=>{
            scrollTo(0,0);
        }

        let bot=document.createElement("div");
        bot.style.width="30px";
        bot.style.height="40%";
        bot.style.lineHeight="50px";
        bot.style.textAlign="center";
        // bot.style.borderRadius="40%";
        bot.style.position = "fixed";
        bot.style.fontWeight = "bold";
        bot.style.cursor="pointer";
        bot.style.borderTop="1px solid #716e6e";
        // bot.style.boxShadow = "0 0 2px 0px #716e6e"
        bot.style.left="0px";
        bot.style.top="50%";
        bot.style.display="flex";
        bot.style.justifyContent="center";
        bot.style.alignItems="center";
        bot.innerText="👇";
        bot.onclick = ()=>{
            scrollTo(0,10000);
        }
        document.body.appendChild(top);
        document.body.appendChild(bot);
    };
    //消息提示
    function msgTip(msg,icon,time){
        const script = document.createElement('script');
        script.textContent = `
        (function() {
                layer.msg("`+msg+`", {time: `+time+`});
        })();
    `;
        document.head.appendChild(script);
        document.head.removeChild(script);
    };
    //替换中文标点
    function ReplacePunctuation(language) {
        // 定义中文标点到英文标点的映射
        const chineseToEnglishPunctuationMap = {
            '，': ',','。': '.','？': '?','！': '!','：': ':','；': ';','‘': "'",'’': "'",'“': '"','”': '"','（': '(','）': ')','【': '[', '】': ']','《': '<','》': '>','·': '.','——': '--','…': '...','、': ',',
        };
        let t = ["title","content","descript"];
        for(var i =0;i<t.length;i++){
            let text = $("#"+language+t[i]).val();
            // 遍历映射对象，使用正则表达式替换中文标点
            for (const [chinesePunct, englishPunct] of Object.entries(chineseToEnglishPunctuationMap)) {
                const regex = new RegExp(chinesePunct, 'g');
                text = text.replace(regex, englishPunct);
            }
            $("#"+language+t[i]).val(text);
        };

    }
    //复制全部按钮功能
    function CopyAll(language,selector){
        var fu_zhi = $('<a id="copyall" class="layui-btn fanyis" style="background-color: #bfa25b; ">复制全部</a>').click(function() {
            let txt = $("#"+language+"title").val()+"\n\n"+$("#"+language+"content").val().replaceAll("\n", "\n\n")+"\n\n"+$("#"+language+"descript").val();
            const textarea = document.createElement("textarea");
            textarea.value = txt;
            textarea.style.position = "absolute";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            msgTip("【"+EnglishToChinese(language)+"】复制成功",1,1500)
        });
        $(selector).append(fu_zhi);
    };
    //粘贴全部按钮功能
    function PasteAll(language,selector){
        var zhan_tie = $('<a id="pasteall" class="layui-btn fanyis" style="background-color: #bfa25b; ">粘贴全部</a>').click(function() {


            // 创建模态对话框的HTML结构
            var modalHTML = `
                    <div id="`+language+`PasteCustomModal" style="display: none; position: fixed; z-index: 1000; left: 50%; top: 50%; transform: translate(-50%, -50%); background: white; border: 1px solid #ccc; padding: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                        <textarea  id="`+language+`PasteModalTextbox" placeholder="粘贴到此处..." style="width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box;" />
                        </br>
                        <button id="`+language+`PasteVerifyBtn" style="margin-right: 0px; padding: 8px 16px;">确定</button>
                        <button id="`+language+`PasteClearBtn"   style="margin-right: 0px; padding: 8px 16px;">清空</button>
                        <button id="`+language+`PasteCloseBtn"   style="margin-right: 0px; padding: 8px 16px;">关闭</button>
                    </div>
                `;

            // 将模态对话框添加到页面中
            $('body').append(modalHTML);
            // 获取模态对话框和相关元素的引用
            var PasteCustomModal = $('#'+language+'PasteCustomModal');
            var PasteModalTextbox = $('#'+language+'PasteModalTextbox');
            var PasteVerifyBtn = $('#'+language+'PasteVerifyBtn');
            var PasteClearBtn = $('#'+language+'PasteClearBtn');
            var PasteCloseBtn = $('#'+language+'PasteCloseBtn');
            // 显示模态对话框
            PasteCustomModal.show();
            PasteModalTextbox.val("");
            PasteModalTextbox.focus();
            // 为确认按钮添加点击事件
            PasteVerifyBtn.on('click', function() {
                var text = PasteModalTextbox.val();
                const lines = text.split(/\r?\n/);
                console.log(lines);
                let result = [];
                for (let i = 0; i < lines.length; i++) {
                    if (lines[i] != "")result.push(lines[i]);
                    else if(lines[i-1]!="" && i >10)result.push("");
                }
                console.log(result);
                if (result.length>6){

                    $("#"+language+"title").val(result[0])
                    $("#"+language+"content").val(result.slice(1, 6).join('\n'));
                    $("#"+language+"descript").val(result.slice(7).join('\n'));
                    console.log(result.length);
                    console.log(text);
                    console.log("--------------------------");
                    for (let i = 0; i < result.length; i++) {
                        console.log(i+":"+result[i]);
                    }
                    PasteCustomModal.hide(); // 隐藏模态对话框
                    msgTip("【"+EnglishToChinese(language)+"】粘贴成功",1,1500)
                }else{
                    msgTip("行数错误，标题1行，五点5行，描述最少1行！",2,1500)
                }
            });

            // 为清空按钮添加点击事件
            PasteClearBtn.on('click', function() {
                PasteModalTextbox.val(''); // 清空文本框内容
            });
            // 为关闭按钮添加点击事件
            PasteCloseBtn.on('click', function() {
                PasteCustomModal.hide();
            });
            // 阻止模态对话框内部的点击事件冒泡到文档（可选，但推荐）
            PasteCustomModal.on('click', function(e) {
                e.stopPropagation();
            });
        });
        $(selector).append(zhan_tie);
    };
    //五点随机换行
    function FivePoints(language,selector){
        //-----五点：随机换行
        var sui_ji_huan_hang = $('<a class="layui-btn fanyis" style="background-color:rgba(191, 162, 91, 1)">随机换行</a>').click(function() {
            var lines = $('#'+language+'content').val().split('\n').filter(function(line) {
                return line.trim() !== '';
            });
            for (let i = lines.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [lines[i], lines[j]] = [lines[j], lines[i]];
            }
            $('#'+language+'content').val(lines.join('\n'));
        });
        //-----五点：小标题大写
        var xiao_biao_ti_da_xie = $('<a class="layui-btn fanyis" style="background-color:rgba(191, 162, 91, 1)">小标题大写</a>').click(function() {
            var lines = $('#'+language+'content').val().split('\n');
            var processedLines = lines.map(function(line) {
                var colonIndex = line.indexOf(':');
                if (colonIndex !== -1) {
                    var title = line.substring(0, colonIndex).trim();
                    var content = line.substring(colonIndex).trim();
                    return title.toUpperCase() + content;
                }
                return line.trim();
            });
            $('#'+language+'content').val(processedLines.join('\n'));
        });
        //-----五点：表情
        var add_emoji = $('<a class="layui-btn fanyis" style="background-color: rgba(191, 162, 91, 1)">表情：'+emoji+'</a>').click(function() {
            var lines = $('#'+language+'content').val().split('\n');
            if(lines[0].slice(0,emoji.length)===emoji){
                for(let j = 0;j<lines.length;j++){
                    if(lines[j].slice(0,emoji.length)===emoji){
                        lines[j] = lines[j].slice(emoji.length);
                    }
                };
            }else if(lines[0].slice(0,emoji.length)!==emoji){
                for(let j = 0;j<lines.length;j++){
                    if(lines[j].slice(0,emoji.length)!==emoji){
                        lines[j] = emoji+lines[j];
                    }
                }
            }
            $('#'+language+'content').val(lines.join('\n'));
        });
        $(selector).append(sui_ji_huan_hang,xiao_biao_ti_da_xie,add_emoji);
    };
    //检查异常按钮功能
    function CheckingExceptions(){
        var jian_cha_yi_chang = $('<a id="check-bt" class="layui-btn" style="background-color: rgba(191, 162, 91, 0.7); position: fixed; margin-left: 180px; bottom: 10px;">检查异常</a>').click(function() {
            scrollTo(0,10000);
            try{
                // const languages = [ 'en', 'fr', 'de', 'it', 'es', 'ja', 'nl', 'sv', 'pl'];
                // const languages1 = [ '英&nbsp&nbsp语', '法&nbsp&nbsp&nbsp语', '德&nbsp&nbsp语', '意大利', '西班牙', '日&nbsp&nbsp&nbsp语', '荷&nbsp&nbsp兰', '瑞&nbsp&nbsp典', '波&nbsp&nbsp兰'];
                const languages = [ 'en', 'fr', 'de', 'it', 'es', 'nl', 'sv', 'pl'];
                const languages1 = [ '英&nbsp&nbsp语', '法&nbsp&nbsp&nbsp语', '德&nbsp&nbsp语', '意大利', '西班牙','荷&nbsp&nbsp兰', '瑞&nbsp&nbsp典', '波&nbsp&nbsp兰'];
                let tips = "异常：";

                for (let i = 0; i < languages.length; i++) {
                    let tip = "</br>----------------------</br>"+languages1[i]+"：";
                    //标题
                    let t = document.getElementById(languages[i]+"title");
                    if(t.value.length===0)tip += "【标题未填写】";
                    else if (t.value.length<90)tip += "【标题字符短缺："+t.value.length+"】"
                    else if (t.value.length>200)tip += "【标题字符超出："+t.value.length+"】"
                    else{
                        let table = document.querySelector('.btcon.layui-table tbody');
                        var maxLength = 0
                        for (var l = 0; l < table.rows.length; l++) {
                            var variantCell = table.rows[l].cells[1]; // 索引1对应变体列
                            var variantText = variantCell.innerText.trim().replace(/<.*?>/g, ''); // 去除HTML标签
                            var currentLength = variantText.length;
                            if (currentLength > maxLength) maxLength = currentLength;
                        }

                        if(maxLength>0&&document.querySelectorAll('.layui-table tbody tr')){
                            maxLength+=2;
                            let jianyimaxLength = 200-maxLength;
                            let titleLength = t.value.length+maxLength;
                            if (titleLength>200)tip += "【标题可能超出，变体："+maxLength+"，标题："+t.value.length+"，建议标题："+jianyimaxLength+"】";
                        }

                    }

                    //关键词
                    let k = document.getElementById(languages[i]+"keyword");
                    if(k) {
                        k.value = k.value.replaceAll(",","");
                        k.value = k.value.replaceAll(".","");
                        if(k.value.length>250)tip += "【关键词超出字符："+k.value.length+"】";
                    }else console.log("未识别到：",languages[i]+"keyword");
                    //五点
                    let c = document.getElementById(languages[i]+"content");
                    if(c) {
                        const textArray = c.value.split("\n");
                        if(textArray.length==5){
                            for(let j =0;j<textArray.length;j++){
                                const m=j+1;
                                if(textArray[j].length > 500) tip += "【五点第 "+m+" 点异常："+textArray[j].length+"】";
                                if(textArray[j].length < 100) tip += "【五点第 "+m+" 点异常："+textArray[j].length+"】";
                            }
                        }else tip+="【五点数量：】"+textArray.length+"，异常】";
                    }else console.log("未识别到：",languages[i]+"content");
                    //描述
                    let d = document.getElementById(languages[i]+"descript");
                    if(d){
                        if (d.value.length==0 || d.value.length>1900) tip += "【描述异常："+d.value.length+"】";
                    }else console.log("未识别到：",languages[i]+"descript");
                    //检查结果
                    if (tip=="</br>----------------------</br>"+languages1[i]+"：") continue;
                    else tips+=tip;
                };
                //变体售价
                var rows = document.querySelectorAll('.layui-table tbody tr');
                // 遍历每一行
                rows.forEach(function(row) {
                    var priceInput = row.querySelector('.bt_price');
                    if (priceInput) {
                        var price = parseFloat(priceInput.value); // 将值转换为浮点数
                        if (price === 0) {
                            var variant = row.querySelector('td:nth-child(2)').textContent.trim();
                            tips += "</br>----------------------</br>变体："+variant+"【售价异常】";
                        }
                    }
                });
                //主体售价
                document.querySelector("body > div.x-body > div > form > div > table.btcon.layui-table > tbody").setAttribute('id', 'bian_ti');
                var bt_table = $("#bian_ti tr");
                console.log(bt_table.length)
                console.log($("#chengben").val())
                console.log($("#zhongliang").val())
                if(bt_table.length==0 && $("#chengben").val()=="100.00" && $("#zhongliang").val()=="5"){

                    tips += "</br>----------------------</br>成本：【售价异常】";
                }


                if(tips=="异常：")msgTip("无异常",6,1500)
                else {
                    //显示异常消息
                    var modalHTML = `
                    <div id="TipsModal" style="display: none; position: fixed; z-index: 1000; left: 50%; top: 50%; transform: translate(-50%, -50%); background: white; border: 1px solid #ccc; padding: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                        <span id="span123">`+tips+`</span>
                        </br>--------------------------</br>
                        <button id="TipsConfirmBtn" style="margin-right: 0px; padding: 8px 16px;width: 100%;">确定</button>
                    </div>
                `;

                    // 将模态对话框添加到页面中

                    $('body').append(modalHTML);

                    var TipsModal = $('#TipsModal');
                    // 显示模态对话框
                    TipsModal.show();
                    var TipsConfirmBtn = $('#TipsConfirmBtn');
                    TipsConfirmBtn.on('click', function() {
                        TipsModal.hide();
                    });
                }
                tips = "异常：";
            }catch (err) {console.log(123)}
        });
        $(".layui-btn.b1.fl").after(jian_cha_yi_chang);

    };
    //复制按钮
    function Copy(language,cont,selector,name){
        var copy = $('<a id="copy" class="layui-btn fanyis" style="background-color: #bfa25b; ">'+name+'</a>').click(function() {
            let txt = $("#"+language+cont).val()
            const textarea = document.createElement("textarea");
            textarea.value = txt;
            textarea.style.position = "absolute";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            msgTip("【"+EnglishToChinese(language)+"】复制成功",1,1500)
        });
        $(selector).append(copy);
    };
    //去除HTML标签
    function removeHtmlTags(language,selector) {
        var remove_html = $('<input type="button" class="layui-btn fanyis" style="background-color: #bfa25b; " value="去除HTML标签">').click(function() {
            $("#"+language+"descript").val($("#"+language+"descript").val().replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '\n').replace(/\n+/g, '\n').trim())
            RemoveSpace(language)

        });
        $(selector).append(remove_html);
    }
    //去除描述行前空格
    function RemoveSpace(language){
        $("#"+language+"descript").val($("#"+language+"descript").val().replace(/^[\s\uFEFF\xA0]+/gm, ""));
    };

    //获取谷歌翻译按钮
    function OpenGoogleTranslate(selector){
        var OpenTranslate = $('<a id="OpenTranslate" class="layui-btn" style="background-color: rgba(255, 255, 255, 0.7); color: #4285F4;border: 1px solid #808080; position: fixed; margin-left: 330px; bottom: 10px;"><img src="https://www.gstatic.com/translate/favicon.ico" alt="" style="width:20px"> 获取谷歌翻译</a>').click(function() {
            let txt = $("#entitle").val()+"\n\n"+$("#encontent").val().replaceAll("\n", "\n\n")+"\n\n"+$("#endescript").val();
            txt = txt.replaceAll("%","%25")
            txt = txt.replaceAll(" ","%20")
            txt = txt.replaceAll("\n","%0A")
            txt = txt.replaceAll(",","%2C")
            txt = txt.replaceAll(":","%3A")
            txt = txt.replaceAll("/","%2F")
            txt = txt.replaceAll("?","%3F")
            txt = txt.replaceAll("&","%26")

            let language = ["fr","de","it","es","nl","sv","pl"]
            for(i = 0;i<language.length;i++){
                let url = "https://translate.google.com/?hl=zh-CN&sl=auto&tl="+language[i]+"&text="+language[i]+"%0A%0A"+getQueryParam('id')+"%0A%0A"+txt+"&op=translate"
                console.log(url)
                window.open(url, '_blank');
            };

            console.log(txt)
        });
        // $(selector).append(OpenTranslate);
        $(selector).after(OpenTranslate);
    };
    //填入谷歌翻译按钮
    function PasteGoogleTranslate(selector){
        var PasteTranslate = $('<a id="PasteTranslate" class="layui-btn " style="background-color: rgba(255, 255, 255, 0.7); color: #4285F4;border: 1px solid #808080; position: fixed; margin-left: 500px; bottom: 10px;"><img src="https://www.gstatic.com/translate/favicon.ico" alt="" style="width:20px"> 填入谷歌翻译</a>').click(function() {

            const id = getQueryParam('id')
            console.log(id)
            const url = 'http://127.0.0.1:10086/translate/get/'+id;
            console.log(url)
            const l = ["fr","de","it","es","nl","sv","pl"]
            // 方式二
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            // xhr.withCredentials = true; // 如果需要的话

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText)

                    $("#frtitle").val(data.countries.fr.title)
                    $("#frcontent").val(data.countries.fr.content.slice(0).join('\n'))
                    $("#frdescript").val(data.countries.fr.descript)
                    setTimeout(function() {
                        msgTip(EnglishToChinese("fr")+"填入完成！",1,1000)
                    }, 200);

                    $("#detitle").val(data.countries.de.title)
                    $("#decontent").val(data.countries.de.content.slice(0).join('\n'))
                    $("#dedescript").val(data.countries.de.descript)
                    setTimeout(function() {
                        msgTip(EnglishToChinese("de")+"填入完成！",1,1000)
                    }, 200);

                    $("#ittitle").val(data.countries.it.title)
                    $("#itcontent").val(data.countries.it.content.slice(0).join('\n'))
                    $("#itdescript").val(data.countries.it.descript)
                    setTimeout(function() {
                        msgTip(EnglishToChinese("it")+"填入完成！",1,1000)
                    }, 200);

                    $("#estitle").val(data.countries.es.title)
                    $("#escontent").val(data.countries.es.content.slice(0).join('\n'))
                    $("#esdescript").val(data.countries.es.descript)
                    setTimeout(function() {
                        msgTip(EnglishToChinese("es")+"填入完成！",1,1000)
                    }, 200);

                    $("#nltitle").val(data.countries.nl.title)
                    $("#nlcontent").val(data.countries.nl.content.slice(0).join('\n'))
                    $("#nldescript").val(data.countries.nl.descript)
                    setTimeout(function() {
                        msgTip(EnglishToChinese("nl")+"填入完成！",1,1000)
                    }, 200);

                    $("#svtitle").val(data.countries.sv.title)
                    $("#svcontent").val(data.countries.sv.content.slice(0).join('\n'))
                    $("#svdescript").val(data.countries.sv.descript)
                    setTimeout(function() {
                        msgTip(EnglishToChinese("sv")+"填入完成！",1,1000)
                    }, 200);

                    $("#pltitle").val(data.countries.pl.title)
                    $("#plcontent").val(data.countries.pl.content.slice(0).join('\n'))
                    $("#pldescript").val(data.countries.pl.descript)
                    setTimeout(function() {
                        msgTip(EnglishToChinese("pl")+"填入完成！",1,1000)
                    }, 200);

                    setTimeout(function() {
                        $(".layui-btn.b1.fl").click();
                    }, 500);

                    // console.log(data.countries.fr);
                }else if(xhr.status === 404) msgTip("未发现该id的翻译内容！",5,1500)
            };

            xhr.send();


        });
        // $(selector).append(PasteTranslate);
        $(selector).after(PasteTranslate);
    };

    let i = 0;
    let languages = ["en","fr","de","it","es","us","nl","sv","pl"]
    let tags = [1,2,3,4,5,9,10,11,12]
    let cont = ["title","content","descript"]
    let cont_c = ["标题","五点","描述"]
    let v = [1,3,4]
    //标题、五点、描述替换标点
    ReplacePunctuation('en')
    ReplacePunctuation('us')
    //英式英语-五点-随机换行-小标题大写-表情
    FivePoints('en',"body > div.x-body > div > form > div > div.a12.fanyi > div > ul:nth-child(1) > li:nth-child(3) > div");
    //美式英语-五点-随机换行-小标题大写-表情
    FivePoints('us',"body > div.x-body > div > form > div > div.a12.fanyi > div > ul:nth-child(9) > li:nth-child(3) > div");

    //检查异常按钮
    CheckingExceptions();
    //去除HTML标签
    removeHtmlTags("us","body > div.x-body > div > form > div > div.a12.fanyi > div > ul:nth-child(9) > li:nth-child(4) > div");
    removeHtmlTags("en","body > div.x-body > div > form > div > div.a12.fanyi > div > ul:nth-child(1) > li:nth-child(4) > div");

    //去除描述空格
    RemoveSpace("en")
    RemoveSpace("us")

    //打开谷歌翻译
    OpenGoogleTranslate($("#check-bt"));
    //粘贴谷歌翻译
    PasteGoogleTranslate($("#check-bt"));

    //复制全部和粘贴全部按钮
    for(i=0;i<languages.length;i++){
        CopyAll(languages[i],"body > div.x-body > div > form > div > div.a12.fanyi > div > ul:nth-child("+tags[i]+") > li:nth-child(2) > div");
        PasteAll(languages[i],"body > div.x-body > div > form > div > div.a12.fanyi > div > ul:nth-child("+tags[i]+") > li:nth-child(2) > div");
    }

    //复制**按钮
    for(i=0;i<languages.length;i++){
        for(var j=0;j<cont.length;j++){
            Copy(languages[i],cont[j],"body > div.x-body > div > form > div > div.a12.fanyi > div > ul:nth-child("+tags[i]+") > li:nth-child("+v[j]+") > div.d1.clearfix","复制"+cont_c[j])
        };
    };



    //顶部和底部按钮
    TopAndBot()
    //填入品牌
    $("input[name='brand']").val(1);
    //计算价格
    $("a:contains('计算价格')").click();
    //英式英语和美式英语互填
    if($("#entitle").val()==""){
        for(i =0;i<cont.length;i++){
            $("#en"+cont[i]).val($("#us"+cont[i]).val())
        }

    }else{
        for(i =0;i<cont.length;i++){
            $("#us"+cont[i]).val($("#en"+cont[i]).val())
        }

    }
    //换行按钮
    // $("body > div.x-body > div > form > div > div.a12.fanyi > div > ul:nth-child(1) > li:nth-child(3) > div > a:nth-child(3)").text("顺序换行")


    $(".wdcpadd .cpad1 .a2 .b2").css({"width":"1000px"});
    $(".photo_upload_box").css({"width":"920px","margin-left":" -70px"});
    //更新SKU按钮
    var update_sku = $('<input type="button" style="margin-left:10px;background-color: #a6a646;" class="duotu_upload layui-btn " value="更新SKU并提交">').click(function() {
        $("input[name='lc_sku']").val("");
        $(".layui-btn.b1.fl").click();
    });
    $("input[value*='本地化图片链接']").after(update_sku);

    // -----标题:首字大写
    var daxie = $("a:contains('首字大写')");
    daxie.removeClass('fr');
    daxie.addClass('layui-btn fanyis');
    //确认提交按钮
    $(".layui-btn.b1.fl").css({"background-color":"rgb(191, 162, 91, 0.7)","position":"fixed","left": "50px","bottom":"10px"});






})();
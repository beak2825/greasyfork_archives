// ==UserScript==
// @name         收藏控 · 网页标题过滤
// @namespace    http://tampermonkey.net/
// @version      5.1.5
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @match        https://*/*
// @noframes
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @require     https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411509/%E6%94%B6%E8%97%8F%E6%8E%A7%20%C2%B7%20%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/411509/%E6%94%B6%E8%97%8F%E6%8E%A7%20%C2%B7%20%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==

/*
 * 5.1.3 加入隐藏 Header 标签、Section 标签、一键小视频网站选项功能
 * 5.1.2 迅雷按钮复制标题
 *
 *
*/

(function() {
    'use strict';
    var u=unsafeWindow,
        webTitle=document.title,
        webUrl=location.href,
        webHost=location.host,
        webPath=location.pathname,
        host=location.hostname,
        ls=localStorage.CatWebTitle?JSON.parse(localStorage.CatWebTitle):'';

    GM_addStyle(`
#CatWebTitleBox {font-size:16px;width:1150px;}
/*所有文本框*/
#CatWebTitleBox input[type="text"], #CatWebTitleBox textarea {margin:0 5px;padding:0 5px;}
#CatWebTitleBox input[type="checkbox"]{-webkit-appearance:checkbox!important;}
#CatWebTitleBox input[type="radio"]{-webkit-appearance:radio!important;}

#CatWebTitleBox input[type="button"] {margin:0 5px;font-size:16px;height:30px;}

#CatWebTitleBox label {display: inline-block;margin-bottom:0;}
#CatWebTitleBox fieldset {border: 2px groove threedface;
padding-block-start: 0.35em;
padding-inline-start: 0.75em;
padding-inline-end: 0.75em;
padding-block-end: 0.625em;
}
#CatWebTitleBox fieldset>legend {font-size:1.5rem;width:auto;margin-bottom:0;}

#CatWebTitleBox>div.CatWebTitleBox_left {width:550px;float:left;}
/*标题替换模式*/
#CatWebTitleBox>div.CatWebTitleBox_left>.CatWebTitleBox_EditConfig>#CatWebTitleBoxUI_Title_Replace>#CatWebTitleVal {width:450px;height:50px;}
/*域名添加*/
#CatWebTitleBox>div.CatWebTitleBox_left>.CatWebTitleBox_EditConfig>#CatWebTitleBoxUI_addContent>#CatWebTitle_HostVal{display:none;width:300px;}

#CatWebTitleBox>div.CatWebTitleBox_right {width:570px;float:right;}
/*应用对象*/
#CatWebTitleBox>div.CatWebTitleBox_right>#CatWebTitle_matchUrl {height:550px;overflow:auto;}
#CatWebTitleBox>div.CatWebTitleBox_right>#CatWebTitle_matchUrl [id^="CatWebTitle_matchUrl_val"] {font-size:16px;width:300px;height:30px;}
#CatWebTitleBox>div.CatWebTitleBox_right>#CatWebTitle_matchUrl [id^="CatWebTitle_matchUrl_Type"] {font-size:16px;padding: 2px;}

#CatWebTitleBox span#CatWebTitle_Test{text-align:left;}
.CatWebTitleBox_EditConfig {display:none;}
`);
    let webTitleFn={
        UI : function(){
            var a=document.createElement('DIV');
            a.id='CatWebTitleBox';
            a.style.cssText='position:fixed;left:150px;top:1%;height:700px;overflow:auto;background:#fff;z-index:999999;font-size:16px;border: solid 3px #3f3;padding: 5px;';
            a.innerHTML=`
<div class="CatWebTitleBox_left">
<div class="CatWebTitleBox_EditDisabled">请先读取或添加应用对象</div>
<div class="CatWebTitleBox_EditConfig">
<fieldset id="CatWebTitleBoxUI_Title_Replace"><legend> 标题替换模式 </legend>
<textarea id="CatWebTitleVal" type="text" placeholder="输入需要过滤的“标题内容”"></textarea><br>
<input type="checkbox" id="CatWebTitle_RegExp" title="请在前后加上 / /"><label for="CatWebTitle_RegExp">使用正则表达式</label></input>
<input type="checkbox" id="CatWebTitle_FilterTitle"><label for="CatWebTitle_FilterTitle">过滤模式</label></input>
<input type="checkbox" id="CatWebTitle_JavaScript"><label for="CatWebTitle_JavaScript">JavaScript模式</label></input>
<br>
<input type="checkbox" id="CatWebTitle_H1title"><label for="CatWebTitle_H1title" for="使用 H1, H2 标题进行替换">H1\H2标题替换模式</label></input>
</fieldset>

<fieldset id="CatWebTitleBoxUI_Title_Replace"><legend> JavaScript 功能（独立执行的JavaScript功能） </legend>
<textarea id="CatJavaScriptVal" type="text" placeholder="执行 JavaScript 代码" style="width:500px;height:120px;display:none;"></textarea>
<input type="checkbox" id="CatWebTitle_eval"><label for="CatWebTitle_eval">JavaScript模式(支持jQuery)</label></input>
</fieldset>

<fieldset id="CatWebTitleBoxUI_Title_Resources"><legend> 标题信息来源 </legend>
<input type="radio" name="CatWebTitle_webTitle" id="CatWebTitle_webTitle" value="webTitle" checked/><label for="CatWebTitle_webTitle">网页标题（默认）</label>
<input type="radio" name="CatWebTitle_webTitle" id="CatWebTitle_H1" value="H1"/><label for="CatWebTitle_H1">读取 H1, H2 中的标题</label>
<br>
<input type="radio" name="CatWebTitle_webTitle" id="CatWebTitle_MetaKeywords" value="MetaKeywords"/><label for="CatWebTitle_MetaKeywords" title="读取 meta[name="keywords"] 中的信息">读取meta[name="keywords"]</label>
<br>
<input type="radio" name="CatWebTitle_webTitle" id="CatWebTitle_MetaDesc" value="MetaDesc"/><label for="CatWebTitle_MetaDesc" title="读取 meta[name="description"] 中的信息">读取 meta[name="description"]</label>
<br>
标题内容：<span id="CatWebTitle_PreviewWebTitle"></span>
</fieldset>

<fieldset id="CatWebTitleBoxUI_Video"><legend> 视频网站 </legend>
<input type="checkbox" id="CatWebTitle_Video"><label for="CatWebTitle_Video">在标题中加入[域名][ID]信息</label>
<br><input type="checkbox" id="CatWebTitle_VideoDownload"><label for="CatWebTitle_VideoDownload">视频下载地址提取</label>  <input type="checkbox" id="CatWebTitle_ThunderUrlCopyTitle"><label for="CatWebTitle_ThunderUrlCopyTitle" title="点击 thunder 协议的链接时，自动复制网页标题">迅雷下载按钮复制标题</label>
<br><input type="checkbox" id="CatWebTitle_HideSection"><label for="CatWebTitle_HideSection" title="">隐藏 Section 导航标签</label>
<input type="checkbox" id="CatWebTitle_HideHeader"><label for="CatWebTitle_HideHeader" title="">隐藏 Header 标签</label>
</fieldset>

<fieldset id="CatWebTitleBoxUI_addContent"><legend> 附加内容 </legend>
<input type="checkbox" id="CatWebTitle_Normalize" title="Unicode字符标准化"><label for="CatWebTitle_Normalize" title="Unicode字符标准化">Unicode字符标准化</label></input>
<br><input type="checkbox" id="CatWebTitle_Host" title="添加域名"><label for="CatWebTitle_Host" title="添加域名">添加域名</label><input type="text" id="CatWebTitle_HostVal" placeholder="自定义域名，留空则使用当前域名">
</fieldset>
</div>
</div>
<div class="CatWebTitleBox_right">
<fieldset id="CatWebTitle_matchUrl"><legend> 应用对象 </legend>
</fieldset>
</div>
<div id="CatWebTitleBox_Btn" style="clear:both">
<div style="border: 1px groove threedface">测试结果：<span id="CatWebTitle_Test"></span></div>
<input type="button" id="CatWebTitle_matchUrl_addBtn" value="添加匹配地址">
<input type="button" id="CatWebTitleBtnOK" value="保存（不修改）"><input id="CatWebTitleBtnCls" type="button" value="关闭">
<input type="button" id="CatWebTitleBtnEdit" value="保存（并修改）">
<input type="button" id="CatWebTitleBtnTest" value="测试">
<input type="button" id="CatWebTitle_Btn_checkedVideo" value="一键勾选视频网站功能">
</div>
`;
            document.body.appendChild(a);
            $('#CatWebTitle_RegExp').on('click',function(){
                if(this.checked) {
                    $('#CatWebTitleVal').attr('placeholder',"输入标题过滤的“正则表达式”");
                } else {
                    $('#CatWebTitleVal').attr('placeholder',"输入需要过滤的“标题内容”");;
                }
            });
            $('#CatWebTitle_eval').on('click', function(){
                if(this.checked) {
                    $('#CatJavaScriptVal').show();
                } else {
                    $('#CatJavaScriptVal').hide();
                }
            });

            $('#CatWebTitle_Host').on('click',function(){
                if(this.checked) {
                    $('#'+this.id+'Val').css('display','inline-block');
                    //$('#CatWebTitleVal').style.display='none';
                } else {
                    $('#'+this.id+'Val').css('display','none');
                    //$('#CatWebTitleVal').style.display='block';
                }
            }).bind({
                'change': function(){
                    if(this.checked) {
                        $('#'+this.id+'Val').show();
                    } else {
                        $('#'+this.id+'Val').hide();
                    }
                },
                'click' : function(){
                    if(this.checked) {
                        $('#'+this.id+'Val').show();
                    } else {
                        $('#'+this.id+'Val').hide();
                    }
                }
            });


            console.log('ls load:', ls);


            let matchUrlUI={
                index : '',
                rule : '',
                indexCount: 0,
                create : function(matchUrl_index, obj, add){
                    console.log('创建:', matchUrl_index);
                    if(add) {
                        $('.CatWebTitleBox_EditDisabled').hide();
                        $('.CatWebTitleBox_EditConfig').show();
                        this.index = matchUrl_index;
                        this.rule = obj.rule;
                        this.config = obj;
                        console.log('matchUrlUI', this);
                        this.clean();
                    }

                    //UI_创建应用对象
                    let applied={
                        selectID: 'CatWebTitle_matchUrl_Type_'+matchUrl_index,
                        inputID: 'CatWebTitle_matchUrl_val_'+matchUrl_index,
                        div: $('<div>').attr({id: 'CatWebTitle_matchUrl_'+matchUrl_index}),
                        select: $('<select>').attr({id: 'CatWebTitle_matchUrl_Type_'+matchUrl_index}).append('<option value="url">网址</option><option value="url-path">路径</option><option value="url-prefix">网址前缀</option><option value="domain">域名</option><option value="regexp">正则表达式</option></select>').val(obj.type),
                        input: $('<input type="text">').attr({id: 'CatWebTitle_matchUrl_val_'+matchUrl_index, placeholder: "填写匹配的地址（pathname），不含域名，采用正则表达式"}).val(obj.rule),
                        delBtn: $('<input type="button" value="删除" data-index="'+ matchUrl_index +'">'),
                        loadBtn: $('<input type="button" value="读取" data-index="'+ matchUrl_index +'">')
                    }

                    $('#CatWebTitle_matchUrl').append(applied.div.append(applied.select, applied.input, applied.delBtn, applied.loadBtn));

                    applied.select.on('change', createMatchUrl);
                    applied.delBtn.on('click', matchUrlUI.delete);
                    applied.loadBtn.on('click', matchUrlUI.loadConfig);
                },
                delete : function(e) {
                    //UI_删除应用对象
                    let index=this.dataset.index;
                    $('#CatWebTitle_matchUrl_'+index).remove();
                    if(index==matchUrlUI.index) matchUrlUI.clean();//如果删除的规则是正在编辑的规则，则清理信息
                    $('.CatWebTitleBox_EditDisabled').show();
                    $('.CatWebTitleBox_EditConfig').hide();
                },
                clean : function(){
                    //清理选项
                    $('.CatWebTitleBox_left input[type="text"], .CatWebTitleBox_left textarea').val('');
                    $('.CatWebTitleBox_left input[type="checkbox"]').prop('checked', false);
                    $('.CatWebTitleBox_left input[type="radio"]').prop('checked', false);
                },
                loadApplied: function(e){
                    //加载应用对象配置
                    if(ls.matchUrl&&typeof(ls.matchUrl)=='object') {
                        $.each(ls.matchUrl, function(i, e){
                            console.log(i, e)
                            matchUrlUI.create(i, e);
                            matchUrlUI.indexCount++; //计算规则数量
                        });
                    }
                },
                loadConfig : function(){
                    $('.CatWebTitleBox_EditDisabled').hide();
                    $('.CatWebTitleBox_EditConfig').show();
                    console.log('index: ', matchUrlUI.index, this.dataset);
                    matchUrlUI.index = this.dataset.index;
                    matchUrlUI.config = ls.matchUrl[matchUrlUI.index];
                    matchUrlUI.rule = matchUrlUI.config.rule;

                    //for(var i in ls) console.log(i, ls[i]);

                    //UI加载配置信息*旧*
                    for(var key_checkbox in matchUrlUI.config.checkbox){
                        //console.log(key, $('#CatWebTitle_'+key), ls['checkbox'][key])
                        if(key_checkbox=='Host') $('#CatWebTitle_'+key_checkbox).click();
                        $('#CatWebTitle_'+key_checkbox).prop('checked', matchUrlUI.config['checkbox'][key_checkbox]);
                    }
                    for(var key_radio in matchUrlUI.config.radio){
                        //console.log(key, $('#CatWebTitle_'+key), ls['checkbox'][key])
                        //$('[name="CatWebTitle_'+key_radio+'"][value="'+matchUrlUI.config['radio'][key_radio]+'"]').prop('checked', true);
                        $('[name="CatWebTitle_'+key_radio+'"][value="'+matchUrlUI.config['radio'][key_radio]+'"]').click();
                    }

                    $('#CatWebTitleVal').val(matchUrlUI.config.keyword||webTitle);
                    $('#CatJavaScriptVal').val(matchUrlUI.config.CatJavaScriptVal||'');
                    $('#CatWebTitle_HostVal').val(matchUrlUI.config.HostVal||'');
                }
            }

            /* 事件 —— 标题信息来源 选项动作 */
            $('#CatWebTitleBoxUI_Title_Resources>input[type="radio"]').on('click', function(){

                let Result, PreViewWebTitle=$('#CatWebTitle_PreviewWebTitle');
                //标题信息来源获取
                switch(this.value) {
                    case 'H1':
                        Result=$('h1, h2').text();
                        break;
                    case 'MetaKeywords':
                        Result=$('meta[name="keywords"]').attr('content');
                        break;
                    case 'MetaDesc':
                        Result=$('meta[name="description"]').attr('content');
                        break;
                    default:
                        Result=webTitle;
                }
                console.log(this, Result);
                PreViewWebTitle.text(Result);
            });

            //载入配置
            if(ls) {
                //$('#CatWebTitle_matchUrl').val(ls.matchUrl||createMatchUrl())
                matchUrlUI.loadApplied();
            } else { //初始化项目
                ls={};
                $('#CatWebTitleVal').val(webTitle);
                //$('#CatWebTitle_matchUrl').val(createMatchUrl())
            }
            console.log('监听按钮', document.querySelectorAll('#CatWebTitleBox>input[type="button"]'));


            //监听插件创建的按钮，并添加事件
            $('#CatWebTitleBox>#CatWebTitleBox_Btn>input[type="button"]').on('click', function(e){
                console.log('index: ', matchUrlUI, matchUrlUI.index);


                //生成配置
                console.log('matchUrlUI.rule', matchUrlUI.rule);
                let list_matchUrl={}, RuleConfig={type:$('#CatWebTitle_matchUrl_Type_'+matchUrlUI.index).val(), rule: $('#CatWebTitle_matchUrl_val_'+matchUrlUI.index).val(), checkbox:{},radio:{}};
                for(var obj_checkbox of document.querySelectorAll('input[type="checkbox"][id^="CatWebTitle_"]')) {
                    let id=obj_checkbox.id.replace('CatWebTitle_','');
                    //console.log(id, obj_checkbox);
                    RuleConfig.checkbox[id]=obj_checkbox.checked;
                }
                RuleConfig.radio['webTitle']=$('input[name="CatWebTitle_webTitle"][type="radio"]:checked').val();
                RuleConfig.keyword=$('#CatWebTitleVal').val().trim();
                RuleConfig.CatJavaScriptVal='';
                RuleConfig.HostVal=$('#CatWebTitle_HostVal').val().trim();

                //生成应用对象信息
                $('[id^="CatWebTitle_matchUrl_val_"]').each(function(key, value){
                    console.log(key, value, $(this).val());
                    list_matchUrl[key]=(ls.matchUrl && ls.matchUrl[key])||{type:$('#CatWebTitle_matchUrl_Type_'+key).val(), rule: $(this).val()};
                });
                console.log('222 index: ', matchUrlUI, RuleConfig);
                if(list_matchUrl[matchUrlUI.index]) list_matchUrl[matchUrlUI.index]=RuleConfig; //导入修改后的应用对象配置

                console.log('btn: ', this, this.id);

                //按钮事件
                switch(this.id) {
                    case 'CatWebTitleBtnEdit':
                        //修改，并执行保存操作
                        ls.matchUrl=list_matchUrl;
                        localStorage['CatWebTitle']=JSON.stringify(ls);
                        $('#CatWebTitleBox').remove();
                        //document.title=Rule(RuleConfig);
                        webTitleFn.init();
                        break;
                    case 'CatWebTitleBtnOK':
                        //保存配置
                        ls.matchUrl=list_matchUrl;
                        //if(!ls.checkbox.FilterTitle&&!ls.checkbox.JavaScript&&!ls.keyword) RuleConfig.keyword='';
                        localStorage['CatWebTitle']=JSON.stringify(ls);
                        break;
                    case 'CatWebTitleBtnTest':
                        $('#CatWebTitle_Test').text(Rule(RuleConfig));
                        break;
                    case 'CatWebTitleBtnCls':
                        $('#CatWebTitleBox').remove();
                        break;
                    case 'CatWebTitle_matchUrl_addBtn':
                        matchUrlUI.create(matchUrlUI.indexCount, {type:'regexp', rule: createMatchUrl('regexp')}, 'new');
                        matchUrlUI.indexCount++;
                        break;
                    case 'CatWebTitle_Btn_checkedVideo':
                        $('#CatWebTitle_MetaKeywords').click();
                        $('#CatWebTitle_Video, #CatWebTitle_VideoDownload, #CatWebTitle_HideSection, #CatWebTitle_HideHeader, #CatWebTitle_Host').prop('checked', true);
                        break;
                }
            });
        },
        init : function(){
            console.warn('%c ls load: ', 'background:#ff03ff;', ls);
            if(ls) {
                let matchUrl_RegExp, matchUrl_Rule={};
                if(ls.matchUrl) {
                    $.each(ls.matchUrl, function(i, e){
                        //遍历应用对象列表，检测是否存在与当前网址匹配的rule
                        switch(e.type) {
                            case 'regexp': //正则表达式的Rule
                                console.log('%c Init 检测规则：', 'color: red;background:yellow;', i, e);
                                matchUrl_RegExp = eval(e.rule);
                                console.log('matchUrl_RegExp: ', matchUrl_RegExp);
                                if(matchUrl_RegExp.test(webUrl)) { //只在匹配的地址中运行
                                    document.title=Rule(e);
                                    //执行 JavaScript 代码
                                    if(e.checkbox.eval) {
                                        try {
                                            //eval(ls.CatJavaScriptVal);
                                            eval('(function(u){'+e.keyword+'})(u);');
                                        } catch(e) {
                                            console.log('JavaScript 执行错误：', e);
                                        }
                                    }
                                    return false; //停止匹配
                                }
                                break;
                            case 'url':
                                break;
                        }
                    })
                }
            }
        }
    };
    webTitleFn.init();



    function ID(prefix, param){ //ID提取
        var id,
            url=location.href,
            path=location.pathname;

        if(/id[-_]\d+[-_]/i.test(path)) id=path.match(/id[-_](\d+)[-_]/i)[1];
        else if(/\/play[-_]\d+\./i.test(path)) id=path.match(/play[-_](\d+)\./i)[1];
        else if(/\/play\/(\d+)[-_]/i.test(path)) id=path.match(/\/play\/(\d+)[-_]/i)[1];
        else if(/\/\d+\./i.test(path)) id=path.match(/\/(\d+)\./)[1];
        else if(/\w\d+\./.test(path)) id=path.match(/\w(\d+)\./)[1];

        return id;
    }

    function createMatchUrl(type) {
        console.log('matchUrl', this);
        let RegExp_webPath;
        let RegExp_Rule={ //按照路径级别，自动匹配规则
            1 : {rule:/\/\w\d+\.html/i, replace:'\\/\\w\\d+\\.html'}
        }
        //方案一
        if(/(\/[a-z]+[-_])\d+\.html$/i.test(webPath)) RegExp_webPath=webPath.replace(/\/([a-z]+[-_])\d+\.html$/i,'/$1\\d+.html'); //play-8278.html
        else if(/\/\d+[-_]\d+[-_]\d+\.html$/i.test(webPath)) RegExp_webPath=webPath.replace(/\/\d+([-_])\d+([-_])\d+\.html$/i,'/\\d+$1\\d+$2\\d+.html'); //8278-1-1.html

        //RegExp_webPath=RegExp_webPath.replace('\\','\\\\');
        console.warn('RegExp_webPath:', RegExp_webPath);

        //方案二
        if(!RegExp_webPath) {
            let webPath_length=webPath.match(/\//g).length
            switch(webPath_length){
                case 1:
                    if(RegExp_Rule[webPath_length]['rule'].test(webPath)) {
                        RegExp_webPath=webPath.replace(RegExp_Rule[webPath_length].rule, RegExp_Rule[webPath_length].replace);
                    }
                    break;
            }

            console.warn('%c RegExp_webPath:', 'background:#ff33ff', RegExp_webPath);
            //return RegExp_webPath;
        }

        //方案三
        if(!RegExp_webPath) RegExp_webPath=webPath.replace(/[^/]+?$/i,'');
        return new RegExp(RegExp_webPath, 'i');
    }

    function Rule(RuleConfig){
        console.log('Rule:', RuleConfig);
        var _webTitle,
            Result,
            rFilterTitle=RuleConfig.checkbox.FilterTitle,
            rJavaScript=RuleConfig.checkbox.JavaScript,
            rHost=RuleConfig.checkbox.Host,
            rNormalize=RuleConfig.checkbox.Normalize,
            rRegExp=RuleConfig.checkbox.RegExp,
            rVideo=RuleConfig.checkbox.Video,
            rVideoDownload=RuleConfig.checkbox.VideoDownload,
            rCatWebTitleVal=RuleConfig.keyword||'', //被替换的内容
            rCatWebTitleValExp; //正则表达式储存容器

        //对不存在的设置，初始化设置
        RuleConfig.radio=RuleConfig.radio||{}
        RuleConfig.radio.webTitle=RuleConfig.radio.webTitle||'webTitle';

        var $eval = function(text){
            try {
                return eval(text);
            } catch(e){
                console.warn(e)
            }
        }

        //标题信息来源获取
        switch(RuleConfig.radio.webTitle) {
            case 'H1':
                Result=$('h1, h2').text();
                break;
            case 'MetaKeywords':
                Result=$('meta[name="keywords"]').attr('content');
                break;
            case 'MetaDesc':
                Result=$('meta[name="description"]').attr('content');
                break;
            default:
                Result=webTitle;
        }
        if(rJavaScript) {
            console.warn('JavaScript 模式');

            console.log(RuleConfig.keyword);
            //console.warn(eval('(function(u){console.log(this, u);})(u);')); //u为 unsafeWindow
            //eval('console.log('+RuleConfig.keyword+')');
            //eval('(function(u){console.log(this, u);})(u);')
            //eval('(function(u){try {'+RuleConfig.keyword+'} catch(e){console.warn(e)}})(u);');
            Result = $eval(RuleConfig.keyword);
        }

        //标题内容的处理方式
        if(rRegExp){
            //开启正则模式时
            if(!/^\//.test(rCatWebTitleVal)) alert('正则模式头缺少 /');
            else if(!/(\/|\/[igm]{1,3})$/.test(rCatWebTitleVal)) alert('正则模式尾缺少 /');
            rCatWebTitleValExp=eval(rCatWebTitleVal);
            try {
                rCatWebTitleValExp.test(webTitle);
                Result=Result.replace(rCatWebTitleValExp,'');
            } catch(e){
                console.log('正则表达式不规范', e);
                alert('正则表达式不规范，请检查规则');
                return false;
            }
        }
        if(rFilterTitle) {
            //开启 自定义名字时 执行
            Result = Result.replace(RuleConfig.keyword,'');
        }
        if(RuleConfig.checkbox.H1title) {
            //document.title=Rule();
        }


        if(Result) {
            Result=Result.trim(); //去除空格
            console.log('获取到的标题：', Result);
            if(rNormalize) Result=Result.normalize('NFKC'); //Unicode字符标准化

            //标题中包含域名进行处理
            var HostRule=new RegExp(host, 'gi'); //生成域名正则
            Result=Result.replace(HostRule,'');

            var nodeList=document.querySelectorAll('a, h1, h2');

            for(var node of nodeList){
                switch(node.tagName) {
                    case 'A':

                    case 'H1':

                    case 'H2':
                        if(node.textContent.trim()==Result) {
                            console.log('结果匹配：', node, node.textContent.trim())
                            node.addEventListener('click', function(){
                                GM_setClipboard(Result);
                            });
                        }
                }
            };
        }
        console.log(Result, host, ID());

        //内容附加
        if(rHost) host=RuleConfig.HostVal?RuleConfig.HostVal:webHost;
        if(rVideo) Result='['+host+']'+'['+ID()+']'+Result;
        else if(rHost) Result='['+host+']'+Result;

        //功能附加
        if(RuleConfig.checkbox.ThunderUrlCopyTitle) { //迅雷链接按钮复制网页标题
            $('body').on('click','a[href^="thunder://"]',function(){
                GM_setClipboard(document.title);
            });
        }
        if(RuleConfig.checkbox.HideSection) {
            PackUP('网站导航','#section-menu',true)
        }
        if(RuleConfig.checkbox.HideHeader) {
            PackUP('Header Logo','header', true)
        }
        if(rVideoDownload) {
            var VideoUrl=$('input[value*=".mp4"]');
            if(!document.querySelector('#ThunderJS_Download') && VideoUrl.val()) {
                GM_addStyle(`#ThunderJS_Download::after {
background:url(https://kfbbs-img.a.88cdn.com/f249ce7c1b65f290cedf9abe2bbd9788?auth_key=1602399635-822342640d8640e7b8892405f4893bcd-0-08f6351c65f1ebfbbae9e40f17c7268b&x-oss-process=image/format,webp);
background-size:32px 32px;
width:32px;height:32px;
vertical-align:middle;
display: inline-block;
/*content:'迅雷 \\A 下载';*/
content:'';white-space: pre;
}

#ThunderJS_Download.float {position:fixed;bottom: 30px;left: 30px;}

`);
                VideoUrl.css({width:'90%'});
                $('<a>').attr({id:'ThunderJS_Download', href:'ThunderJS://'+VideoUrl.val()+','+encodeURIComponent(Result)+','+encodeURIComponent(location.href), download: Result, title:'召唤 ThunderJS'}).text('').insertAfter(VideoUrl).css({color:'#000'});

                let Thunder = $('#ThunderJS_Download'), ThunderPos=Thunder.offset().top, docH=$(document).height();
                $(document).on('scroll', function(){
                    float(Thunder, ThunderPos, docH);
                });
                    float(Thunder, ThunderPos, docH);
            }

            console.log('标题处理结果：', Result);
            return Result;
        }
    }

    function float(e, ThunderPos, docH) {
        var scroH = $(document).scrollTop();  //滚动高度
        var viewH = window.innerHeight;  //可见高度
        var contentH = $(document).height();  //内容高度
        if(docH!==$(document).height()) {
            $(e).toggleClass('float', false); //解除浮动重新记录位置数据
            ThunderPos=e.offset().top;
            docH = contentH = $(document).height();
        }

        console.log($(document).height());
        console.log('窗口高度：' +viewH, "滚动条位置："+scroH, '总高度：'+(viewH+scroH), "docH: "+ docH, ThunderPos, e.offset().top);
        if($(e).hasClass("float") && (viewH+scroH)>ThunderPos) {
            console.log($(e).hasClass("float"), viewH+scroH, (viewH+scroH)>ThunderPos, ThunderPos)
            $(e).toggleClass('float', false);
        } else if((viewH+scroH)<ThunderPos){
            $(e).toggleClass('float', true);
        }


        if(scroH > ThunderPos){  //距离顶部大于100px时

        }
        if (contentH - (scroH + viewH) <= 100){  //距离底部高度小于100px

        }
        if (contentH == (scroH + viewH)){  //滚动条滑到底部啦

        }
    }

    function PackUP(title, target, now){ //收起展开
        let text, titleTarget;
        //title 为点击的目标，需要具体到文本位置
        if(document.querySelector(title)) {
            text=$(title).text().trim();
            titleTarget=$(title).find(':contains("'+text+'")');
        } else if(!document.querySelector(target+"_title")){
            text=title;
            titleTarget=$('<div>').attr({id:target+"_title"}).css({"padding":'2px;'});
            $(target).before(titleTarget);
        }
        titleTarget.click(function(e){
            $(target).slideToggle(100, function(){
                if(this.style.display=='none') titleTarget.text(text+"︽");
                else titleTarget.text(text+"︾");
            });
        });
        if(now) titleTarget.click();
    }

    GM_registerMenuCommand('过滤网页标题', webTitleFn.UI);
    // Your code here...
})();
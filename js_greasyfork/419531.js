// ==UserScript==
// @name            海云V8.0开发者辅助工具
// @author          徐交彬
// @namespace       徐交彬
// @description     模板置标提示、模板代码行号、代码提示、文档自动点击不涉密、导出栏目架构
// @match           http://10.207.4.146/govapp/*
// @match           http://59.110.158.75:3380/govapp/*
// @require         https://code.bdstatic.com/npm/jquery@3.5.1/dist/jquery.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/lib/codemirror.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/selection/selection-pointer.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/css-hint.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/html-hint.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/javascript-hint.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/show-hint.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/xml-hint.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/mode/xml/xml.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/mode/javascript/javascript.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/mode/css/css.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/mode/vbscript/vbscript.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/mode/htmlmixed/htmlmixed.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/scroll/annotatescrollbar.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/search/matchesonscrollbar.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/search/match-highlighter.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/search/jump-to-line.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/xml-hint.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/dialog/dialog.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/search/searchcursor.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/search/search.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/fold/foldcode.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/fold/foldgutter.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/fold/brace-fold.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/fold/comment-fold.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/fold/indent-fold.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/fold/markdown-fold.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/fold/xml-fold.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/edit/closebrackets.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/edit/closetag.js
// @require         https://code.bdstatic.com/npm/codemirror@5.58.3/addon/edit/matchtags.js
// @require         https://code.bdstatic.com/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @version         0.5.2
// @resource  css1  https://code.bdstatic.com/npm/codemirror@5.58.3/lib/codemirror.css
// @resource  css2  https://code.bdstatic.com/npm/codemirror@5.58.3/addon/hint/show-hint.css
// @resource  css3  https://code.bdstatic.com/npm/codemirror@5.58.3/addon/dialog/dialog.css
// @resource  css4  https://code.bdstatic.com/npm/codemirror@5.58.3/addon/fold/foldgutter.css
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @license         xujiaobin
// @downloadURL https://update.greasyfork.org/scripts/419531/%E6%B5%B7%E4%BA%91V80%E5%BC%80%E5%8F%91%E8%80%85%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/419531/%E6%B5%B7%E4%BA%91V80%E5%BC%80%E5%8F%91%E8%80%85%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

$(document).ready(function () {
    "use strict";
    GM_addStyle(GM_getResourceText("css1"));
    GM_addStyle(GM_getResourceText("css2"));
    GM_addStyle(GM_getResourceText("css3"));
    GM_addStyle(GM_getResourceText("css4"));
    var editor;
    setTimeout(() => {
        let trsLogoText = ["文字", "图片", "链接", "新闻稿", "文件", "图集"];
        let logoText = $(".logo-new-box .ng-binding").html();
        if (trsLogoText.includes(logoText)) {
            const dom = $(".modal-dialog");
            for (let i = 0; i < dom.length; i++) {
                if ($(dom[i]).find(".editing-cus-radio").length) {
                    $(".editing-cus-radio").each(function (index, domEle) {
                        if ($(this).attr("label") == "不涉密") {
                            $(this).find("label").trigger("click");
                            $(dom[i]).find(".trs-window-footer button").trigger("click");
                        }
                    });
                }
            }
        } else {
            $(".form-ctl[name='TEMPTEXT']").prop("id", "tempTextarea");
            $(".editor-menu ul").append(`
    <style>
            /* Switch开关样式 */
        .liSwitch,.mg-mew-tpl .newtemp-textarea .editor-menu ul{width: auto!important; height: auto!important;line-height: normal;}
        .liSwitch:hover{
            box-shadow:none!important;
        }
        
        .liSwitch{font-size:12px;}
        .liSwitch span{
            display: block;
            float: left;
            margin-top: 7px;
        }
        input[type='checkbox'].switch {
            outline: none;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            position: relative;
            width: 40px;
            height: 20px;
            margin-top:6px;
            background: #ccc;
            border-radius: 10px;
            transition: border-color .3s, background-color .3s;
        }

        input[type='checkbox'].switch::after {
            content: '';
            display: inline-block;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0, 0, 2px, #999;
            transition: .4s;
            top: 2px;
            position: absolute;
            left: 2px;
        }

        input[type='checkbox'].switch:checked {
            background: rgb(19, 206, 102);
        }

        /* 当input[type=checkbox]被选中时：伪元素显示下面样式 位置发生变化 */
        input[type='checkbox'].switch:checked::after {
            content: '';
            position: absolute;
            left: 55%;
            top: 2px;
    }
    .mg-mew-tpl .newtemp-textarea .editor-menu{position:relative}
    .ZB{    
    position: absolute;
    background: #fff;
    left: 0px;
    width: 98%;
    border: 1px solid #ccc;
    top: 31px;
    height: 200px;
    overflow: auto;
    z-index:999;
}
.ZB legend{margin-bottom:0}
#tempCode{
    width: 98%;
    height: 200px;
    position: absolute;
    display:none;
    left:0;
    top:31px;
    z-index:999;
}
.TRS{padding:0!important;width:60px!important;line-height:24px;}
.ZB,#prev,#next{display:none;}
#openZB,#prev,#next{width:60px;height:24px;font-size:12px!important;}
.Button{
    width: 200px!important;
    line-height: 24px;
    padding: 0!important;
}
.Button:hover{box-shadow: none!important;}
.ZB input{
line-height:normal!important;
}
.ZB input[type="text"]{
border:1px solid #767676;
padding-left:2px;
}
.ZB input[type="checkbox"]{margin-right:3px;}
.ZB td{text-align:left;}
.CodeMirror{
    height: -moz-calc(100vh - 150px);
    height: -webkit-calc(100vh - 150px);
    height: calc(100vh - 150px);
    height: calc(100vh - 150px);
}
.cm-s-default .cm-variable, .cm-s-default .cm-punctuation, .cm-s-default .cm-property, .cm-s-default .cm-operator .CodeMirror span,.CodeMirror pre.CodeMirror-line, .CodeMirror pre.CodeMirror-line-like{
color:#333;
}        

    </style>
    <li class='TRS'><button onclick="window.openZB()" id="openZB">提示</button><div class='ZB'></div><div>    <textarea id="tempCode"></textarea></div></li>
        <li class="liSwitch"><label><span>代码高亮显示：</span><input type="checkbox" class="switch" onChange="window.checkHighLighting(event)"></label></li>
    <li class="Button">
    <button id="prev" onclick="window.prev()">上一步</button>
    <button id="next" onclick="window.next()">下一步</button>
    </li>
    `);
            first();
            if (Boolean(localStorage.getItem("TemplateCheckHighLighting"))) {
                highlighting();
                $("input[type='checkbox'].switch").attr("checked", "checked");
            }
        }
    }, 1000);
});

function first() {
    // 初始化主页面
    $(".ZB").append(defaultPage);
}
function highlighting() {
    var mixedMode = {
        name: "htmlmixed",
        scriptTypes: [
            {
                matches: /\/x-handlebars-template|\/x-mustache/i,
                mode: null,
            },
            {
                matches: /(text|application)\/(x-)?vb(a|script)/i,
                mode: "vbscript",
            },
        ],
    };
    editor = CodeMirror.fromTextArea(document.getElementById("tempTextarea"), {
        mode: mixedMode,
        selectionPointer: true,
        lineNumbers: true,
        extraKeys: { Tab: "autocomplete" },
        foldGutter: true,
        autoCloseTags: true,
        autoCloseBrackets: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        matchTags: { bothTags: true },
    }).on("change", (editor) => {
        $("#tempTextarea").val(editor.getValue());
        var bbb = document.getElementById("tempTextarea");
        var ev = document.createEvent("HTMLEvents");
        ev.initEvent("change", false, true);
        bbb.dispatchEvent(ev);
    });
}

//置标
var defaultPage = `
                <style type="text/css">
                .category {
                    padding: 3px;
                    /* height: 238px; */
                    width: 100%;
                    text-align: left;
                    overflow: auto;
                }
            
                .category span {
                    margin-right: 8px;
                }
            
                .category_title {
                    font-size: 12px;
                    font-weight: bold;
                    margin-top: 0px;
                }
            
                .category_content {
                    padding: 3px;
                    text-align: left;
                }
            
                .category_item {
                    height: 20px;
                    line-height: 20px;
                    cursor: pointer;
                    white-space: nowrap;
                }
            
                ul {
                    list-style-type: none;
                    font-family: arials;
                    font-size: 12px;
            
                }
                fieldset {
                    
                    margin-top: 0px;
                    width: 30%;
                    overflow: visible;
                    float: left;
                }
            
                .fieldset-box {
                    width: 100%;
                    margin-top: 10px;
                    border-top: dashed 1px silver;
                    padding-top: 5px;
                    overflow: hidden;
                }
            
                .ext-safari fieldset,
                .ext-safari .fieldset-box {}
            
                .ext-safari fieldset {
                    margin-left: 5px;
                }
            </style>
            <div class="fieldset-box">

                <fieldset>
                    <legend class="category_title" >栏目类置标</legend>
                    <div class="category_content">
                        <div class="category_item"><input type="radio" name="TagType" value="30"><span>栏目列表 </span>(<span class="title">TRS_CHANNELS</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="40"><span>栏目信息</span> (<span class="title">TRS_CHANNEL</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="70"><span>当前位置</span> (<span class="title">TRS_CURPAGE</span>)</div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend class="category_title">文档类置标</legend>
                    <div class="category_content">
                        <div class="category_item"><input type="radio" name="TagType" value="10"><span>文档列表</span> (<span class="title">TRS_DOCUMENTS</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="50"><span>文档信息</span> (<span class="title">TRS_DOCUMENT</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="20"><span>相关文档</span> (<span class="title">TRS_RELNEWS</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="80"><span>发布日期</span> (<span class="title">TRS_DATETIME</span>)</div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend class="category_title">视频库置标</legend>
                    <div class="category_content">
                        <div class="category_item"><input type="radio" name="TagType" value="300"><span>视频信息</span> (<span class="title">TRS_VIDEO</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="310"><span>播放视频点播</span> (<span class="title">TRS_VIDEO_PLAY</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="320"><span>播放视频直播</span> (<span class="title">TRS_VIDEO_LIVE</span>)</div>
                    </div>
                </fieldset>

            </div>
            <div class="fieldset-box">
                <fieldset>
                    <legend class="category_title" >变量</legend>
                    <div class="category_content">
                        <div class="category_item"><input type="radio" name="TagType" value="150"><span>变量声明</span> (<span class="title">TRS_VARIABLE</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="160"><span>声明变量枚举值</span> (<span class="title">TRS_ENUM</span>)</div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend class="category_title" >特色置标</legend>
                    <div class="category_content">
                        <div class="category_item"><input type="radio" name="TagType" value="200"><span>条件执行置标</span> (<span class="title">TRS_CONDITION</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="210"><span>输出制定内容 </span> (<span class="title">TRS_ECHO</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="220"><span>显示最新文档标志</span> (<span class="title">TRS_NEWICON</span>)</div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend class="category_title" >其它置标</legend>
                    <div class="category_content">
                        <div class="category_item"><input type="radio" name="TagType" value="60"><span>文档附件</span> (<span class="title">TRS_APPENDIX</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="90"><span>替换内容</span> (<span class="title">TRS_REPLACE</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="120"><span>嵌套模板 </span> (<span class="title">TRS_TEMPLATE</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="110"><span>分组显示</span> (<span class="title">TRS_RECORD</span>)</div>
                    </div>
                </fieldset>
            </div>
            <div class="fieldset-box">
                <fieldset>
                    <legend class="category_title" >视图、分类法记录</legend>
                    <div class="category_content">
                        <div class="category_item"><input type="radio" name="TagType" value="600"><span>视图记录列表</span> (<span class="title">TRS_VIEWDATAS</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="610"><span>视图记录详细信息</span> (<span class="title">TRS_VIEWDATA</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="680"><span>视图数据列表</span> (<span class="title">TRS_MYVIEWDATAS</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="690"><span>文档或视图数据列表</span>(<span class="title">TRS_CLASSDOCUMENTS</span>)</div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend class="category_title" >视图、字段</legend>
                    <div class="category_content">
                        <div class="category_item"><input type="radio" name="TagType" value="630"><span>视图详细信息</span> (<span class="title">TRS_VIEW</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="640"><span>视图下字段列表</span> (<span class="title">TRS_VIEWFIELDS</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="650"><span>视图字段详细信息</span> (<span class="title">TRS_VIEWFIELD</span>)</div>
                    </div>
                </fieldset>
                <fieldset>
                    <legend class="category_title" >分类法</legend>
                    <div class="category_content">
                        <div class="category_item"><input type="radio" name="TagType" value="660"><span>分类法列表</span> (<span class="title">TRS_CLASSINFOS</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="670"><span>分类详细信息</span> (<span class="title">TRS_CLASSINFO</span>)</div>
                    </div>
                </fieldset>
            </div>
            <div class="fieldset-box" id="dvInfoviewTags">
                <fieldset style="height: 125px">
                    <legend class="category_title" >表单置标-通用</legend>
                    <div class="category_content">
                        <div class="category_item"><input type="radio" name="TagType" value="500"><span>表单采集页</span> (<span class="title">TRS_INFOVIEW</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="510"><span>表单细览</span> (<span class="title">TRS_INFOVIEWDATA</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="560"><span>表单附加项</span> (<span class="title">TRS_INFOVIEWHELPER</span>)</div>
                    </div>
                </fieldset>
                <fieldset style="height: 125px">
                    <legend class="category_title" >附加置标</legend>
                    <div class="category_content">
                        <div class="category_item"><input type="radio" name="TagType" value="710"><span>图片置标</span> (<span class="title">TRS_IMAGE</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="720"><span>栏目Logo</span> (<span class="title">TRS_CHANNELLOGO</span>)</div>
                        <div class="category_item"><input type="radio" name="TagType" value="700"><span>文档Logo</span> (<span class="title">TRS_DOCUMENTLOGO</span>)</div>
                    </div>
                </fieldset>
            </div>


`;
var tempPage;
var arr = new Array();
var tempName;
var num = 1;
var css = `                <style type="text/css">
        table,
        td,
        b {
            font-size: 12px;
            font-family: arials;
        }

        .tdHead {
            background: #D8E4F8;
        }

        .tdAlter1 {
            background: #ffffff;
        }

        .tdAlter2 {
            background: #efefef;
        }


        .ext-ie7 .inputselect,
        .ext-gecko .inputselect,
        .ext-strict .inputselect {
            position: relative;
            margin-left: 3px;
        }

        .ext-ie7 .inputselect input,
        .ext-gecko .inputselect input,
        .ext-strict .inputselect input {
            position: absolute;
            top: 0px;
            left: 0px;
            z-index: 2;
            width: 150px;
            height: 21px;
            border-right: 0px;
            border: 1px solid gray;
            border-bottom: 0px;
        }

        .ext-ie7 .inputselect select,
        .ext-gecko .inputselect select,
        .ext-strict .inputselect select {
            position: absolute;
            top: 0px;
            left: 0px;
            z-index: 1;
            width: 168px;
            height: 22px;
        }

        .ext-ie6 .inputselect {
            margin-left: 3px;
        }

        .ext-ie6 .inputselect input {
            width: 150px;
            height: 22px;
            border-right: 0px;
            border: 1px solid gray;
        }

        .ext-ie6 .inputselect select {
            width: 168px;
            height: 22px;
            margin-left: -150px;
        }

        .ext-ie6 .inputselect span {
            width: 18px;
        }

    </style>`;
var app = {
    // 栏目列表
    TRS_CHANNELS() {
        tempPage =
            css +
            `
            <table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	    <tr>
	        <td valign="top">
		    <div overflow: auto;">
		    <table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">栏目名称</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selid" HandleName="hdlid" ParamName="id"><option value="OWNER">当前栏目</option><option value="PARENT">父栏目</option><option value="SITE">站点</option></SELECT></span></div><SCRIPT>var hdlid;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbid" _checked="">ID</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">子栏目类型</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="childtype" style="width:150px" class="field_input"><option value="-1">所有类型</option><option value="0">普通栏目</option><option value="1">图片新闻</option><option value="2">头条新闻</option><option value="11">链接栏目</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbchildtype" _checked="">CHILDTYPE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">定位到子栏目</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="childindex" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbchildindex" _checked="">CHILDINDEX</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">起始位置</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="startpos"  VALUE="0" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbstartpos" _checked="">STARTPOS</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">取出栏目个数</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
    </table>`;

        $(".ZB").empty().append(tempPage);
    },
    // 栏目信息
    TRS_CHANNEL() {
        tempPage =
            css +
            `
        
            <table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">栏目名称</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selid" HandleName="hdlid" ParamName="id" onChange="doChange('hdlid');"><option value="OWNER">当前栏目</option><option value="PARENT">父栏目</option><option value="SITE">站点</option></SELECT></span></div><SCRIPT>var hdlid;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbid" _checked="">ID</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">定位到子栏目</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="childindex" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbchildindex" _checked="">CHILDINDEX</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">显示字段名</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selfield" HandleName="hdlfield" ParamName="field" onChange="doChange('hdlfield');"><option value="CHNLDESC">显示名称</option><option value="CHNLNAME">栏目名称</option><option value="CHANNELID">栏目ID</option><option value="SITEID">站点ID</option><option value="_RECURL">栏目路径</option></SELECT></span></div><SCRIPT>var hdlfield;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="">FIELD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">最大长度</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">日期格式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="dateformat"  VALUE="yyyy-MM-dd HH:mm:ss" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbdateformat" _checked="">DATEFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动格式化</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="autoformat" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformat" _checked="">AUTOFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">格式化方式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="autoformattype" style="width:150px" class="field_input"><option value="HTML">HTML</option><option value="HTMLVALUE">HTMLVALUE</option><option value="JAVASCRIPT">JAVASCRIPT</option><option value="XML">XML</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformattype" _checked="">AUTOFORMATTYPE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动产生链接</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="autolink" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautolink" _checked="">AUTOLINK</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接是否显示提示</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="linkalt" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckblinkalt" _checked="">LINKALT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接提示内容</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="linkalttext" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckblinkalttext" _checked="">LINKALTTEXT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">扩展HTML属性</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="extra" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbextra" _checked="">EXTRA</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接目标</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="seltarget" HandleName="hdltarget" ParamName="target" onChange="doChange('hdltarget');"><option value="_blank">新窗口</option><option value="_parent">父窗口</option><option value="_self">本窗口</option><option value="_top">顶级窗口</option></SELECT></span></div><SCRIPT>var hdltarget;</SCRIPT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtarget" _checked="">TARGET</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">截断标识</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="truncatedflag"  VALUE="..." ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtruncatedflag" _checked="">TRUNCATEDFLAG</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>
            `;
        $(".ZB").empty().append(tempPage);
    },
    //当前位置
    TRS_CURPAGE() {
        tempPage =
            css +
            `	<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接符</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="value"  VALUE=">" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbvalue" _checked="">VALUE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否只显示自己</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="only" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbonly" _checked="">ONLY</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动产生链接</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="autolink" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE" selected >TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautolink" _checked="">AUTOLINK</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接目标</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="seltarget" HandleName="hdltarget" ParamName="target" onChange="doChange('hdltarget');"><option value="_blank">新窗口</option><option value="_parent">父窗口</option><option value="_self">本窗口</option><option value="_top">顶级窗口</option></SELECT></span></div><SCRIPT>var hdltarget;</SCRIPT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtarget" _checked="">TARGET</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">额外的HTML内容</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="extra" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbextra" _checked="">EXTRA</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">首页的描述</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selhomepagedesc" HandleName="hdlhomepagedesc" ParamName="homepagedesc" onChange="doChange('hdlhomepagedesc');"><option value="首页">默认显示为首页</option><option value="@truename">站点的显示名称</option><option value="其它字符串">显示为指定的字符串</option></SELECT></span></div><SCRIPT>var hdlhomepagedesc;</SCRIPT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbhomepagedesc" _checked="">HOMEPAGEDESC</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_DOCUMENTS() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">栏目名称</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selid" HandleName="hdlid" ParamName="id" onChange="doChange('hdlid');"><option value="OWNER">当前栏目</option><option value="PARENT">父栏目</option></SELECT></span></div><SCRIPT>var hdlid;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbid" _checked="">ID</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">定位到子栏目</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="childindex" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbchildindex" _checked="">CHILDINDEX</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">栏目类型</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="channeltype" style="width:150px" class="field_input"><option value="0">普通栏目</option><option value="1">图片新闻</option><option value="2">头条新闻</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbchanneltype" _checked="">CHANNELTYPE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">分页参数</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="pagesize" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbpagesize" _checked="">PAGESIZE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">文档条数</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num"  VALUE="50" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">起始位置</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="startpos"  VALUE="0" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbstartpos" _checked="">STARTPOS</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动生成更多链接</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="automore" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautomore" _checked="">AUTOMORE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接的目标</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selmoretarget" HandleName="hdlmoretarget" ParamName="moretarget" onChange="doChange('hdlmoretarget');"><option value="_blank">新窗口</option><option value="_parent">父窗口</option><option value="_self">本窗口</option><option value="_top">顶级窗口</option></SELECT></span></div><SCRIPT>var hdlmoretarget;</SCRIPT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoretarget" _checked="">MORETARGET</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接的文字表示</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="moretext"  VALUE="更多..." ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoretext" _checked="">MORETEXT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接之前的文字</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="beginmore" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbbeginmore" _checked="">BEGINMORE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接之后的文字</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="endmore" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbendmore" _checked="">ENDMORE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接上额外HTML</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="moreextra" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoreextra" _checked="">MOREEXTRA</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">额外的检索条件</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="where" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbwhere" _checked="">WHERE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">额外的排序条件</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="order" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckborder" _checked="">ORDER</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否启用时间限制</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="enablelimit" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbenablelimit" _checked="">ENABLELIMIT</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_DOCUMENT() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">显示字段名</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selfield" HandleName="hdlfield" ParamName="field" onChange="doChange('hdlfield');"><option value="DOCTITLE">标题</option><option value="SUBDOCTITLE">副标题</option><option value="DOCAUTHOR">作者</option><option value="DOCRELTIME">撰写时间</option><option value="DOCPUBTIME">发布时间</option><option value="DOCHTMLCON">HTML正文</option><option value="DOCCONTENT">文本正文</option><option value="DOCABSTRACT">摘要</option><option value="DOCSOURCENAME">文档来源</option><option value="DOCSECURITY">安全级别</option><option value="DOCSTATUS">文档状态</option><option value="DOCTYPE">文档类型</option><option value="DOCKEYWORDS">关键词</option><option value="DOCCHANNEL">所属栏目</option><option value="_RECURL">文档路径</option></SELECT></span></div><SCRIPT>var hdlfield;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="">FIELD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">最大长度</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否显示标题颜色</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="autocolor" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE" selected >TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautocolor" _checked="">AUTOCOLOR</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动产生链接</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="autolink" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautolink" _checked="">AUTOLINK</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">日期格式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="dateformat"  VALUE="yyyy-MM-dd HH:mm:ss" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbdateformat" _checked="">DATEFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动格式化</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="autoformat" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformat" _checked="">AUTOFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">格式化方式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="autoformattype" style="width:150px" class="field_input"><option value="HTML">HTML</option><option value="HTMLVALUE">HTMLVALUE</option><option value="JAVASCRIPT">JAVASCRIPT</option><option value="XML">XML</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformattype" _checked="">AUTOFORMATTYPE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">扩展HTML属性</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="extra" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbextra" _checked="">EXTRA</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接目标</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="seltarget" HandleName="hdltarget" ParamName="target" onChange="doChange('hdltarget');"><option value="_blank">新窗口</option><option value="_parent">父窗口</option><option value="_self">本窗口</option><option value="_top">顶级窗口</option></SELECT></span></div><SCRIPT>var hdltarget;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtarget" _checked="">TARGET</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接是否显示提示</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="linkalt" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckblinkalt" _checked="">LINKALT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接提示内容</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="linkalttext" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckblinkalttext" _checked="">LINKALTTEXT</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_RELNEWS() {
        tempPage =
            css +
            `	<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">起始位置</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="startpos"  VALUE="0" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbstartpos" _checked="">STARTPOS</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">文档条数</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num"  VALUE="10" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">相关文档类型</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="mode" style="width:150px" class="field_input"><option value="USERDEF">USERDEF</option><option value="KEYWORDS">KEYWORDS</option><option value="ALL">ALL</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmode" _checked="">MODE</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_DATETIME() {
        tempPage =
            css +
            `	<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">日期格式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="dateformat"  VALUE="yyyy-MM-dd HH:mm:ss" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbdateformat" _checked="">DATEFORMAT</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_VIDEO() {
        tempPage =
            css +
            `	<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">属性字段</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selfield" HandleName="hdlfield" ParamName="field" onChange="doChange('hdlfield');"><option value="_THUMBURL">视频缩略图地址</option><option value="_DURATION">视频时长</option><option value="_VIDEOURL">视频播放地址</option></SELECT></span></div><SCRIPT>var hdlfield;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="">FIELD</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_VIDEO_PLAY() {
        tempPage =
            css +
            `	<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动播放</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selautoplay" HandleName="hdlautoplay" ParamName="autoplay" onChange="doChange('hdlautoplay');"><option value="false">不自动播放</option><option value="true">自动播放</option></SELECT></span></div><SCRIPT>var hdlautoplay;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoplay" _checked="">AUTOPLAY</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">视频上Logo的透明度,&nbsp;0-1之间的小数,&nbsp;小数点后1位,&nbsp;如0.4.&nbsp;值越大越不透明</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="logoalpha" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckblogoalpha" _checked="">LOGOALPHA</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">播放器宽度</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="width" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbwidth" _checked="">WIDTH</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">播放器高度</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="height" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbheight" _checked="">HEIGHT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">选用哪个播放器</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selplayertype" HandleName="hdlplayertype" ParamName="playertype" onChange="doChange('hdlplayertype');"><option value="STANDARD">标准播放器</option><option value="LARGE">大播放器(506*506)</option><option value="SMALL">小播放器(360*367)</option></SELECT></span></div><SCRIPT>var hdlplayertype;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbplayertype" _checked="">PLAYERTYPE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">嵌入该flash的object标记的ID.&nbsp;如player.</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="objid" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbobjid" _checked="">OBJID</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_VIDEO_LIVE() {
        tempPage =
            css +
            `	<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">要播放的直播名.&nbsp;直播名可在新建直播页面上得到.</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="live_name" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckblive_name" _checked="">LIVE_NAME</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">嵌入该flash的object标记的ID.&nbsp;如player.</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="objid" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbobjid" _checked="">OBJID</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_VARIABLE() {
        tempPage =
            css +
            `	<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">变量名称</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="name" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbname" _checked="1">NAME</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">变量类型</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="type" style="width:150px" class="field_input"><option value="BOOLEAN">布尔</option><option value="INTEGER">整型</option><option value="NUMBER">数值</option><option value="STRING">字符串</option><option value="MULTI">文本</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtype" _checked="">TYPE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">枚举值和枚举显示值的分割字符</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="split" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbsplit" _checked="">SPLIT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">变量缺省值</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="default" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbdefault" _checked="">DEFAULT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">变量的枚举值</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="enumerate" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbenumerate" _checked="">ENUMERATE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">该变量是否允许用户直接输入值</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="cancustom" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbcancustom" _checked="">CANCUSTOM</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_ENUM() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">变量枚举值</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="value" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbvalue" _checked="1">VALUE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">枚举显示值</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="display" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbdisplay" _checked="">DISPLAY</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_CONDITION() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">条件变量声明|@属性名称</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="condition" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbcondition" _checked="1">CONDITION</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">参考常量|参考变量声明|@属性名称</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="reference" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbreference" _checked="">REFERENCE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">条件值和参考值的比较方式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="operator" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckboperator" _checked="">OPERATOR</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否翻转条件值和参考值</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="reverse" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbreverse" _checked="">REVERSE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">条件值和参考值的数据类型</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="type" style="width:150px" class="field_input"><option value="INT">整型</option><option value="FLOAT">浮点型</option><option value="STRING">字符串</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtype" _checked="">TYPE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否求反</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="not" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnot" _checked="">NOT</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_ECHO() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">待输出的内容或者变量声明</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="value" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbvalue" _checked="1">VALUE</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_NEWICON() {
        tempPage =
            css +
            `	<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">时间字段</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="field" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="">FIELD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">时间差值</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="seltime" HandleName="hdltime" ParamName="time" onChange="doChange('hdltime');"><option value="day">当日</option><option value="week">当周</option><option value="month">当月</option><option value="[填入整型值]">N分钟</option></SELECT></span></div><SCRIPT>var hdltime;</SCRIPT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtime" _checked="">TIME</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_APPENDIX() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">字段名(附件类型为图片时此处为空可直接显示图片)</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selfield" HandleName="hdlfield" ParamName="field" onChange="doChange('hdlfield');"><option value="APPDESC">显示名称</option><option value="SRCFILE">源文件名称</option><option value="APPFILE">上传文件名</option><option value="APPLINKALT">链接提示</option><option value="FILEEXT">文件后缀名</option><option value="_RECURL">附件路径</option></SELECT></span></div><SCRIPT>var hdlfield;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="">FIELD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">附件类型</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="mode" style="width:150px" class="field_input"><option value="PIC">图片附件</option><option value="FILE">文件附件</option><option value="LINK">链接附件</option><option value="ALL">所有类型附件</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmode" _checked="">MODE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">序号</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="index"  VALUE="-1" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbindex" _checked="">INDEX</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">窗口目标</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="seltarget" HandleName="hdltarget" ParamName="target" onChange="doChange('hdltarget');"><option value="_blank">新窗口</option><option value="_parent">父窗口</option><option value="_self">本窗口</option><option value="_top">顶级窗口</option></SELECT></span></div><SCRIPT>var hdltarget;</SCRIPT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtarget" _checked="">TARGET</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">附件之前的HTML属性</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="beginhtml" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbbeginhtml" _checked="">BEGINHTML</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">附件之后的HTML属性</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="endhtml" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbendhtml" _checked="">ENDHTML</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动产生链接</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="autolink" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE" selected >TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautolink" _checked="">AUTOLINK</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接上额外的HTML属性</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="extra" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbextra" _checked="">EXTRA</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否产生图片说明</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="memo" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmemo" _checked="">MEMO</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">图片说明前HTML代码</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="beginmemo" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbbeginmemo" _checked="">BEGINMEMO</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">图片说明后HTML代码</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="endmemo" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbendmemo" _checked="">ENDMEMO</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">附件分隔符</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selseperator" HandleName="hdlseperator" ParamName="seperator" onChange="doChange('hdlseperator');"><option value="&lt;BR&gt;">&lt;BR&gt;</option><option value="/n">/n</option></SELECT></span></div><SCRIPT>var hdlseperator;</SCRIPT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbseperator" _checked="">SEPERATOR</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否上传附件</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="upload" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbupload" _checked="">UPLOAD</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_REPLACE() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">替换名称</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="value" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbvalue" _checked="1">VALUE</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_TEMPLATE() {
        tempPage =
            css +
            `	<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">模板名称</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="tempname" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtempname" _checked="1">TEMPNAME</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">模板标识</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="identity" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbidentity" _checked="0">IDENTITY</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_RECORD() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">记录数</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="1">NUM</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_VIEWDATAS() {
        tempPage =
            css +
            `	<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">栏目名称</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selid" HandleName="hdlid" ParamName="id" onChange="doChange('hdlid');"><option value="OWNER">当前栏目</option><option value="PARENT">父栏目</option></SELECT></span></div><SCRIPT>var hdlid;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbid" _checked="">ID</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">定位到子栏目</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="childindex" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbchildindex" _checked="">CHILDINDEX</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">分页参数</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="pagesize" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbpagesize" _checked="">PAGESIZE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">文档条数</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num"  VALUE="50" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">起始位置</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="startpos"  VALUE="0" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbstartpos" _checked="">STARTPOS</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动生成更多链接</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="automore" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautomore" _checked="">AUTOMORE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接的目标</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selmoretarget" HandleName="hdlmoretarget" ParamName="moretarget" onChange="doChange('hdlmoretarget');"><option value="_blank">新窗口</option><option value="_parent">父窗口</option><option value="_self">本窗口</option><option value="_top">顶级窗口</option></SELECT></span></div><SCRIPT>var hdlmoretarget;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoretarget" _checked="">MORETARGET</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接的文字表示</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="moretext"  VALUE="更多..." ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoretext" _checked="">MORETEXT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接之前的文字</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="beginmore" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbbeginmore" _checked="">BEGINMORE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接之后的文字</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="endmore" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbendmore" _checked="">ENDMORE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接上额外HTML</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="moreextra" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoreextra" _checked="">MOREEXTRA</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">额外的检索条件</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="where" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbwhere" _checked="">WHERE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">额外的排序条件</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="order" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckborder" _checked="">ORDER</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否直接取元数据表的内容</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="directfrommetatable" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbdirectfrommetatable" _checked="">DIRECTFROMMETATABLE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否取视图下所有数据</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="ignorechannel" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbignorechannel" _checked="">IGNORECHANNEL</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_VIEWDATA() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">显示字段名</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="field" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="">FIELD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">日期格式</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="dateformat"  VALUE="yyyy-MM-dd HH:mm:ss" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbdateformat" _checked="">DATEFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动格式化</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="autoformat" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformat" _checked="">AUTOFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">格式化方式</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="autoformattype" style="width:150px" class="field_input"><option value="HTML">HTML</option><option value="HTMLVALUE">HTMLVALUE</option><option value="JAVASCRIPT">JAVASCRIPT</option><option value="XML">XML</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformattype" _checked="">AUTOFORMATTYPE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动产生链接</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="autolink" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautolink" _checked="">AUTOLINK</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接是否显示提示</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="linkalt" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckblinkalt" _checked="">LINKALT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接提示内容</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="linkalttext" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckblinkalttext" _checked="">LINKALTTEXT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">扩展HTML属性</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="extra" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbextra" _checked="">EXTRA</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接目标</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="seltarget" HandleName="hdltarget" ParamName="target" onChange="doChange('hdltarget');"><option value="_blank">新窗口</option><option value="_parent">父窗口</option><option value="_self">本窗口</option><option value="_top">顶级窗口</option></SELECT></span></div><SCRIPT>var hdltarget;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtarget" _checked="">TARGET</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">截断标识</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="truncatedflag"  VALUE="..." ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtruncatedflag" _checked="">TRUNCATEDFLAG</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_MYVIEWDATAS() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">相关视图ID序列</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="viewids" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbviewids" _checked="">VIEWIDS</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">文档条数</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num"  VALUE="50" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">开始位置</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="startpos"  VALUE="0" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbstartpos" _checked="">STARTPOS</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">分页参数</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="pagesize" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbpagesize" _checked="">PAGESIZE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">额外的检索条件</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="where" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbwhere" _checked="">WHERE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动显示更多内容</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="automore" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautomore" _checked="">AUTOMORE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接之前的文字</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="beginmore" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbbeginmore" _checked="">BEGINMORE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接之后的文字</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="endmore" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbendmore" _checked="">ENDMORE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接的文字表示</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="moretext"  VALUE="更多..." ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoretext" _checked="">MORETEXT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接上额外HTML</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="moreextra" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoreextra" _checked="">MOREEXTRA</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接的目标</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selmoretarget" HandleName="hdlmoretarget" ParamName="moretarget" onChange="doChange('hdlmoretarget');"><option value="_blank">新窗口</option><option value="_parent">父窗口</option><option value="_self">本窗口</option><option value="_top">顶级窗口</option></SELECT></span></div><SCRIPT>var hdlmoretarget;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoretarget" _checked="">MORETARGET</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_CLASSDOCUMENTS() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">视图id</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="viewid" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbviewid" _checked="">VIEWID</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">分类法id</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="classinfoid" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbclassinfoid" _checked="">CLASSINFOID</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否包含子分类</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="containschildren" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbcontainschildren" _checked="">CONTAINSCHILDREN</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">栏目id</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="channelid" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbchannelid" _checked="">CHANNELID</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">触发发布栏目ids</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="triggerchannelids" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtriggerchannelids" _checked="">TRIGGERCHANNELIDS</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">在所有栏目获取</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="all" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckball" _checked="">ALL</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">站点id</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="siteid" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbsiteid" _checked="">SITEID</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">额外的检索条件</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="where" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbwhere" _checked="">WHERE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">额外的排序条件</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="order" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckborder" _checked="">ORDER</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否调试</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="isdebug" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbisdebug" _checked="">ISDEBUG</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">文档条数</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num"  VALUE="50" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">起始位置</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="startpos"  VALUE="0" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbstartpos" _checked="">STARTPOS</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">分页参数</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="pagesize" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbpagesize" _checked="">PAGESIZE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动生成更多链接</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="automore" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautomore" _checked="">AUTOMORE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接之前的文字</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="beginmore" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbbeginmore" _checked="">BEGINMORE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接之后的文字</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="endmore" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbendmore" _checked="">ENDMORE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接的文字表示</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="moretext"  VALUE="更多..." ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoretext" _checked="">MORETEXT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接上额外HTML</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="moreextra" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoreextra" _checked="">MOREEXTRA</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">更多链接的目标</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selmoretarget" HandleName="hdlmoretarget" ParamName="moretarget" onChange="doChange('hdlmoretarget');"><option value="_blank">新窗口</option><option value="_parent">父窗口</option><option value="_self">本窗口</option><option value="_top">顶级窗口</option></SELECT></span></div><SCRIPT>var hdlmoretarget;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbmoretarget" _checked="">MORETARGET</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_VIEW() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">显示字段名</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selfield" HandleName="hdlfield" ParamName="field" onChange="doChange('hdlfield');"><option value="VIEWINFOID">视图ID</option><option value="VIEWNAME">视图名称</option><option value="VIEWDESC">视图描述</option><option value="MAINTABLENAME">主表名称</option><option value="MAINTABLEID">主表ID</option><option value="CRUSER">创建者</option><option value="CRTIME">创建时间&nbsp;&nbsp;</option></SELECT></span></div><SCRIPT>var hdlfield;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="">FIELD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">最大长度</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">日期格式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="dateformat"  VALUE="yyyy-MM-dd HH:mm:ss" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbdateformat" _checked="">DATEFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动格式化</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="autoformat" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformat" _checked="">AUTOFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">截断标识</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="truncatedflag"  VALUE="..." ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtruncatedflag" _checked="">TRUNCATEDFLAG</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_VIEWFIELDS() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">视图ID</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="viewid" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbviewid" _checked="">VIEWID</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否概览显示的字段</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="inoutline" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE" selected >TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbinoutline" _checked="">INOUTLINE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否细览显示的字段</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="indetail" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE" selected >TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbindetail" _checked="">INDETAIL</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否检索字段</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="searchfield" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE" selected >TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbsearchfield" _checked="">SEARCHFIELD</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否来自其它表的字段</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="onlyothertablefields" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE" selected >TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbonlyothertablefields" _checked="">ONLYOTHERTABLEFIELDS</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">最大长度</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">起始位置</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="startpos"  VALUE="0" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbstartpos" _checked="">STARTPOS</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">取出的字段名称串</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="include" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbinclude" _checked="">INCLUDE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">排除的字段名称串</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="exclude" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbexclude" _checked="">EXCLUDE</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_VIEWFIELD() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">视图字段名</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selfield" HandleName="hdlfield" ParamName="field" onChange="doChange('hdlfield');"><option value="FULLFIELDNAME">字段全名</option><option value="ENMVALUE">枚举值</option><option value="TABLEID">主表ID</option><option value="TABLENAME">主表名称</option><option value="VIEWID">视图ID</option><option value="DBFIELDNAME">元数据名称</option><option value="ANOTHERNAME">中文名称</option><option value="FIELDTYPE">字段类型</option><option value="DBTYPE">库中类型</option><option value="DBLENGTH">库中长度</option><option value="DEFAULTVALUE">字段默认值</option><option value="NOTNULL">不能为空</option><option value="TITLEFIELD">标题字段</option><option value="INOUTLINE">概览显示</option><option value="SEARCHFIELD">检索字段</option><option value="CLASSID">分类法ID</option><option value="LOCATECHANNEL">定位栏目</option><option value="RADORCHK">是否单选</option><option value="CRUSER">创建者</option><option value="CRTIME">创建时间</option></SELECT></span></div><SCRIPT>var hdlfield;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="">FIELD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否HTML格式处理</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="filterforhtml" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfilterforhtml" _checked="">FILTERFORHTML</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">日期格式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="dateformat"  VALUE="yyyy-MM-dd HH:mm:ss" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbdateformat" _checked="">DATEFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动格式化</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="autoformat" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformat" _checked="">AUTOFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">格式化方式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="autoformattype" style="width:150px" class="field_input"><option value="HTML">HTML</option><option value="HTMLVALUE">HTMLVALUE</option><option value="JAVASCRIPT">JAVASCRIPT</option><option value="XML">XML</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformattype" _checked="">AUTOFORMATTYPE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">视图字段名称</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="id" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbid" _checked="">ID</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">截断标识</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="truncatedflag"  VALUE="..." ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtruncatedflag" _checked="">TRUNCATEDFLAG</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_CLASSINFOS() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">分类ID或名称</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="id" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbid" _checked="">ID</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">最大长度</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">起始位置</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="startpos"  VALUE="0" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbstartpos" _checked="">STARTPOS</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">分页参数</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="pagesize" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbpagesize" _checked="">PAGESIZE</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_CLASSINFO() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">分类字段名</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selfield" HandleName="hdlfield" ParamName="field" onChange="doChange('hdlfield');"><option value="CLASSINFOID">编号</option><option value="CNAME">名称</option><option value="CDESC">描述</option><option value="CRUSER">创建者</option><option value="CRTIME">创建时间</option></SELECT></span></div><SCRIPT>var hdlfield;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="">FIELD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">最大长度</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">日期格式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="dateformat"  VALUE="yyyy-MM-dd HH:mm:ss" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbdateformat" _checked="">DATEFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动格式化</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="autoformat" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformat" _checked="">AUTOFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">格式化方式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="autoformattype" style="width:150px" class="field_input"><option value="HTML">HTML</option><option value="HTMLVALUE">HTMLVALUE</option><option value="JAVASCRIPT">JAVASCRIPT</option><option value="XML">XML</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformattype" _checked="">AUTOFORMATTYPE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动产生链接</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="autolink" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautolink" _checked="">AUTOLINK</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接是否显示提示</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="linkalt" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckblinkalt" _checked="">LINKALT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接提示内容</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="linkalttext" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckblinkalttext" _checked="">LINKALTTEXT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">扩展HTML属性</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="extra" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbextra" _checked="">EXTRA</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接目标</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="seltarget" HandleName="hdltarget" ParamName="target" onChange="doChange('hdltarget');"><option value="_blank">新窗口</option><option value="_parent">父窗口</option><option value="_self">本窗口</option><option value="_top">顶级窗口</option></SELECT></span></div><SCRIPT>var hdltarget;</SCRIPT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtarget" _checked="">TARGET</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">截断标识</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="truncatedflag"  VALUE="..." ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtruncatedflag" _checked="">TRUNCATEDFLAG</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_INFOVIEW() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">自定义表单ID</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="infoviewid" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbinfoviewid" _checked="">INFOVIEWID</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否启用校验码</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="verifycode" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE" selected >TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbverifycode" _checked="">VERIFYCODE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否生成重置按钮</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="resetbutton" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE" selected >TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbresetbutton" _checked="">RESETBUTTON</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">网关数据提交页面</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="postaction" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbpostaction" _checked="">POSTACTION</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">文件上传路径</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="fileaction" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfileaction" _checked="">FILEACTION</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">校验码页面路径</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="verifycodeurl" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbverifycodeurl" _checked="">VERIFYCODEURL</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">文件读取路径</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="readfileurl" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbreadfileurl" _checked="">READFILEURL</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_INFOVIEWDATA() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">字段名称</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="field" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="1">FIELD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否格式化</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="autoformat" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE" selected >TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformat" _checked="">AUTOFORMAT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">格式化样式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selautoformattype" HandleName="hdlautoformattype" ParamName="autoformattype" onChange="doChange('hdlautoformattype');"><option value="HTML">HTML文本</option><option value="HTMLValue">HTML元素属性</option><option value="JAVASCRIPT">JS脚本</option><option value="XML">XML文本</option></SELECT></span></div><SCRIPT>var hdlautoformattype;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautoformattype" _checked="">AUTOFORMATTYPE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">最大长度</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="num" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnum" _checked="">NUM</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">截断标记</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="truncatedflag"  VALUE="..." ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtruncatedflag" _checked="">TRUNCATEDFLAG</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_INFOVIEWHELPER() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">指定输出项</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selfield" HandleName="hdlfield" ParamName="field" onChange="doChange('hdlfield');"><option value="RESOURCE">资源文件</option><option value="ACTIONS">多个按钮</option><option value="ACTION">单个按钮</option><option value="ENUM">常量枚举</option><option value="LINKEDENUM">动态级联枚举</option><option value="VALID">校验容器标识</option><option value="CHNL_RELATED_ENUM">栏目名称相关枚举</option></SELECT></span></div><SCRIPT>var hdlfield;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="1">FIELD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">资源类型/按钮类型</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="seltype" HandleName="hdltype" ParamName="type" onChange="doChange('hdltype');"><option value="JS">JS脚本</option><option value="CSS">CSS样式表</option><option value="FORM">FORM控件</option><option value="SUBMIT">提交按钮</option><option value="RESET">重置按钮</option><option value="CANCEL">取消按钮</option></SELECT></span></div><SCRIPT>var hdltype;</SCRIPT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtype" _checked="">TYPE</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">缺省输出哪些按钮(SUBMIT/RESET/CANCEL)</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="seldefault" HandleName="hdldefault" ParamName="default" onChange="doChange('hdldefault');"><option value="SUBMIT,RESET,CANCEL">全部3个按钮</option><option value="SUBMIT,RESET">提交与重置</option><option value="SUBMIT,CANCEL">提交与取消</option></SELECT></span></div><SCRIPT>var hdldefault;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbdefault" _checked="">DEFAULT</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">枚举项分隔符</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="splitby"  VALUE="," ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbsplitby" _checked="">SPLITBY</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">枚举值与显示名称分隔符</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="valuesplitby"  VALUE="~" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbvaluesplitby" _checked="">VALUESPLITBY</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">枚举值对应的表单字段名称</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="key"  VALUE="" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbkey" _checked="">KEY</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">CHNL_RELATED_ENUM配置文件</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="file"  VALUE="" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfile" _checked="">FILE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">CHNL_RELATED_ENUM配置文件编码</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="encoding"  VALUE="UTF-8" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbencoding" _checked="">ENCODING</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_IMAGE() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">显示属性</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selfield" HandleName="hdlfield" ParamName="field" onChange="doChange('hdlfield');"><option value="_RECURL">图片地址</option><option value="IMAGE">完整的Image元素</option><option value="UPLOADALL">上传所有的图片</option></SELECT></span></div><SCRIPT>var hdlfield;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbfield" _checked="">FIELD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">指定序号大小</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="index" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbindex" _checked="">INDEX</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">图片大小</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="size" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbsize" _checked="">SIZE</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">扩展的HTML内容</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input class="field_input" TYPE="text" style="width:150px" NAME="extra" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbextra" _checked="">EXTRA</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">图片宽度</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="width" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbwidth" _checked="">WIDTH</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">图片高度</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="height" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbheight" _checked="">HEIGHT</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否强制分发图片</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="upload" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbupload" _checked="">UPLOAD</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">链接目标</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="seltarget" HandleName="hdltarget" ParamName="target" onChange="doChange('hdltarget');"><option value="_blank">新窗口</option><option value="_parent">父窗口</option><option value="_self">本窗口</option><option value="_top">顶级窗口</option></SELECT></span></div><SCRIPT>var hdltarget;</SCRIPT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbtarget" _checked="">TARGET</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否自动产生链接</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="autolink" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbautolink" _checked="">AUTOLINK</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否原图显示</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="original" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckboriginal" _checked="">ORIGINAL</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否采用绝对路径</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="urlisabs" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckburlisabs" _checked="">URLISABS</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_CHANNELLOGO() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">指定的栏目</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selid" HandleName="hdlid" ParamName="id" onChange="doChange('hdlid');"><option value="OWNER">当前栏目</option><option value="PARENT">父栏目</option><option value="SITE">站点</option></SELECT></span></div><SCRIPT>var hdlid;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbid" _checked="">ID</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">设置指定栏目的子栏目</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="childindex" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbchildindex" _checked="">CHILDINDEX</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">设置获取第几个LOGO</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="index" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbindex" _checked="">INDEX</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否显示图片</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="showpic" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbshowpic" _checked="">SHOWPIC</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">仅仅显示文件名</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="nameonly" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnameonly" _checked="">NAMEONLY</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">图片信息显示方式</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selshowmode" HandleName="hdlshowmode" ParamName="showmode" onChange="doChange('hdlshowmode');"><option value="FILEPARSE">文件路径</option><option value="FILENAME">文件名</option><option value="SHOWPIC">图片</option></SELECT></span></div><SCRIPT>var hdlshowmode;</SCRIPT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbshowmode" _checked="">SHOWMODE</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
    TRS_DOCUMENTLOGO() {
        tempPage =
            css +
            `<table width="100%" border="0" cellspacing="0" cellpadding="3" align="center" style="background:#fefefe; border: 0px solid gray; height: 100%; margin-top: 0px;">
	<tr>
	<td valign="top">
		<div style=" overflow: auto;">
		<table id="tbHead" width="100%" border="0" cellspacing="1" cellpadding="2" style="background: silver;">
		<tr>
			<td class="tdHead" height="25" align="left" width="30%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.paramdesc">参数描述</B></FONT></td>
			<td class="tdHead" align="left" width="50%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param">参数值</B></FONT></td>
			<td class="tdHead" align="left" width="20%"><FONT SIZE="3"><B WCMAnt:param="template_wizard_step2.jsp.param_contain">包含此参数</B></FONT></td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">指定文档</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="id" ></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbid" _checked="">ID</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">设置获取第几个LOGO</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><input TYPE="text" class="field_input" style="width:50px" NAME="index" ></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbindex" _checked="">INDEX</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">仅仅显示文件名</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><SELECT NAME="nameonly" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbnameonly" _checked="">NAMEONLY</td>
		</tr>

		<tr>
			<td class="tdAlter2" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">是否显示图片</td>
			<td class="tdAlter2" align="left" valign="top" width="50%"><SELECT NAME="showpic" class="field_input" style="width:80px"><option value="FALSE">FALSE</option><option value="TRUE">TRUE</option></SELECT></td>
			<td class="tdAlter2" align="left" valign="top" width="20%"><input type="checkbox" name="ckbshowpic" _checked="">SHOWPIC</td>
		</tr>

		<tr>
			<td class="tdAlter1" align="left" valign="top" style="height: 22px; line-height: 22px;" width="30%">图片信息显示方式</td>
			<td class="tdAlter1" align="left" valign="top" width="50%"><div class='inputselect'><span><SELECT ISTRSSelect=1 NAME="selshowmode" HandleName="hdlshowmode" ParamName="showmode" onChange="doChange('hdlshowmode');"><option value="FILEPARSE">文件路径</option><option value="FILENAME">文件名</option><option value="SHOWPIC">图片</option></SELECT></span></div><SCRIPT>var hdlshowmode;</SCRIPT></td>
			<td class="tdAlter1" align="left" valign="top" width="20%"><input type="checkbox" name="ckbshowmode" _checked="">SHOWMODE</td>
		</tr>

		</table>
		</div>
	</td>
	</tr>
	</table>`;
        $(".ZB").empty().append(tempPage);
    },
};

$(".category_item").click(function (e) {
    $(this).children("input").attr("checked", "checked");
});
unsafeWindow.next = function () {
    switch (num) {
        case 1:
            console.log(num);
            var text = $(".fieldset-box input:radio[name='TagType']:checked").siblings(".title").text();
            tempName = text;
            // eval(app.text + "()");
            app[text]();
            num++;
            break;
        case 2:
            let tempVal;
            let generate;
            $("#tbHead input:checkbox:checked").each(function (index, domEle) {
                // console.log($(this).parent().text());
                // console.log($(this).parent().prev().find("select").length != 0);
                if ($(this).parent().prev().find("select").length != 0) {
                    tempVal = $(this).parent().prev().find("select option:selected").val();
                } else {
                    tempVal = $(this).parent().prev().find("input").val();
                }
                arr[index] = {
                    propertyName: $(this).parent().text(),
                    propertyValue: tempVal,
                };
            });
            // 输出置标
            generate = "<" + tempName + " ";
            $.each(arr, function (index, element) {
                generate += arr[index].propertyName + '="' + arr[index].propertyValue + '" ';
                console.log(index, arr.length);
                if (index == arr.length - 1) {
                    generate += "></" + tempName + ">";
                }
            });
            console.log(generate);
            $(".ZB").hide();
            $("#tempCode").text(generate).show();
            num++;
            break;
        default:
            break;
    }
};
unsafeWindow.prev = function () {
    switch (num) {
        case 3:
            $(".ZB").show();
            $("#tempCode").hide().empty();
            arr = [];
            num--;
            break;
        case 2:
            $(".ZB").empty().append(defaultPage);
            num--;
            break;
        default:
            break;
    }
};
unsafeWindow.openZB = function () {
    if ($("#openZB").hasClass("active")) {
        $("#openZB").removeClass("active");
        $(".ZB,#tempCode,#prev,#next").hide();
        $("#tempCode").empty();
        arr = [];
        num = 1;
    } else {
        $("#openZB").addClass("active");
        $("#prev,#next").show();
        $(".ZB").empty().append(defaultPage).show();
    }
};
unsafeWindow.checkHighLighting = function (e) {
    if (e.target.checked) {
        highlighting();
        localStorage.setItem("TemplateCheckHighLighting", true);
    } else {
        $(".CodeMirror").remove();
        $("#tempTextarea").show();
        localStorage.removeItem("TemplateCheckHighLighting");
    }
};
//导出栏目部分
function getChannelInfo(siteID, channelID, callback) {
    $.ajax({
        type: "post",
        url: `http://10.207.4.146/gov/gov.do?PAGESIZE=1000&ParentChannelId=${channelID}&SITEID=${siteID}&methodname=queryChildrenChannelsOnEditorCenter&serviceid=gov_site`,
        dataType: "json",
        async: false,
        success: function (res) {
            callback(res.DATA.DATA);
        },
        error: function (error) {
            console.error("Error fetching channel info:", error);
        },
    });
}
function buildChannelTree(channel, siteID, callback) {
    let result = {
        channelID: channel.CHANNELID,
        channelTitle: channel.CHNLDESC,
        channelParentID: channel.PARENTID,
        children: [],
    };

    if (channel.HASCHILDREN === "true") {
        getChannelInfo(siteID, channel.CHANNELID, function (children) {
            let childrenCount = children.length;
            let processedCount = 0;

            children.forEach(function (child) {
                if (child.CANPUB === "true") {
                    buildChannelTree(child, siteID, function (childChannel) {
                        result.children.push(childChannel);
                        processedCount++;

                        if (processedCount === childrenCount) {
                            callback(result);
                        }
                    });
                } else {
                    processedCount++;
                    if (processedCount === childrenCount) {
                        callback(result);
                    }
                }
            });
        });
    } else {
        callback(result);
    }
}
function flattenTree(tree, level = 0, result = [], parent = {}) {
    let row = {};
    console.log(tree);
    row[`${level + 1}级栏目名称`] = tree.channelTitle;
    row[`${level + 1}级栏目ID`] = tree.channelID;

    // if (parent.channelID) {
    //     row[`level${level - 1}_channelname`] = parent.channelTitle;
    //     row[`level${level - 1}_channelid`] = parent.channelID;
    // }

    result.push(row);

    tree.children.forEach((child) => {
        flattenTree(child, level + 1, result, tree);
    });

    return result;
}

async function exportToExcel(data) {
    const flattenedData = data.flatMap((tree) => flattenTree(tree));
    let channelIDs = [];
    for (const [key, value] of Object.entries(flattenedData)) {
        for (const [k, v] of Object.entries(value)) {
            if (k.indexOf("ID") != -1) {
                channelIDs.push({
                    channelID: v,
                    channelPublishUrl: await getXlsxPublishUrl(v),
                });
            }
        }
    }
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
    const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const maxColumns = Math.max(...jsonSheet.map(row => row.length));
    // 将 URL 数据添加到最后一列
    flattenedData.forEach((row, index) => {
        const cellAddress = XLSX.utils.encode_cell({ c: maxColumns, r: index + 1 });
        worksheet[cellAddress] = { t: 's', v: channelIDs[index].channelPublishUrl};
    });
    worksheet["!ref"] = XLSX.utils.encode_range({ s: { c: 0, r: 0 }, e: { c: maxColumns, r: flattenedData.length } });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Channels");
    const siteName = $(".site-desc").html();
    XLSX.writeFile(workbook, `${siteName + "栏目架构"}.xlsx`);
}

async function getXlsxPublishUrl(channelID) {
    return new Promise((resolve, reject) => {
        let siteID = $(".site-desc").attr("title");
        siteID = siteID.match(/站点ID: (\S*)\n/)[1];
        $.ajax({
                    type: "GET",
                    //默认get
                    url: `http://10.207.4.146/gov/gov.do?ChannelId=${channelID - 0}&SiteId=${siteID - 0}&methodname=getSiteOrChannelPubUrl&serviceid=gov_site`,
                    //默认当前页
                    dataType: "json",
                    async: false,
                    success: function(res) {
                        //请求成功回调
                        resolve(res.DATA)
                    },
                    error: function(e) {
                        //请求超时回调
                        if (e.statusText == "timeout") {
                            alert("请求超时")
                        }
                    },
                })
    });
}

function generateChannelTree() {
    return function (topLevelChannels) {
        let result = [];
        let topLevelCount = topLevelChannels.length;
        let processedCount = 0;

        topLevelChannels.forEach(function (channel) {
            if (channel.CANPUB === "true") {
                buildChannelTree(channel, channel.SITEID, function (channelTree) {
                    result.push(channelTree);
                    processedCount++;

                    if (processedCount === topLevelCount) {
                        console.log(JSON.stringify(result, null, 2));
                        exportToExcel(result);
                    }
                });
            } else {
                processedCount++;
                if (processedCount === topLevelCount) {
                    console.log(JSON.stringify(result, null, 2));
                    exportToExcel(result);
                }
            }
        });
    };
}

unsafeWindow.exportChannel = function () {
    if (window.confirm("脚本会自动抓取接口数据，根据不同站点栏目架构，导出可能需要一点时间 by 徐交彬")) {
        $(".exportButton").append(`<span class="alert" style="
position: absolute;
    top: -10px;
    right: 0;
    background: #fff;
    font-size: 12px;
    padding: 5px;
">正在抓取接口数据，请不要操作</span>`);
        let siteID = $(".site-desc").attr("title");
        siteID = siteID.match(/站点ID: (\S*)\n/)[1];
        if (window.confirm(`抓取到的SITEID为${siteID},如SITEID不正确请点击取消手动输入 by 徐交彬`)) {
        } else {
            siteID = prompt("请输入SITEID");
        }
        let ajaxData = getChannelInfo(siteID, 0, generateChannelTree());
        //console.log("执行完成");
        //exportXLSX()
        alert("导出成功，不确保数据准确，请仔细核对，如需导出其他站点请刷新后再操作 by 徐交彬");
        $(".exportButton .alert").remove();
    }
};

$(document).ready(function () {
    //导出栏目架构
    let hash = window.location.hash;
    if (hash.indexOf("/editctr/website/") != -1) {
        setTimeout(() => {
            $(".panel-title").eq(0).append(`<button class="exportButton"style="
                        position: absolute;
                        right: 0;
                        top: 10px;
                        border: 1px solid #eee;
                        background: #eee;
                        color: #0b77cd;
                        border-radius: 5px;"onclick="window.exportChannel()">导出栏目架构</button>`);
        }, 2000);
    }
    //导出栏目结束

    //在采编和模板页面添加预览当前栏目
    if (hash.indexOf("/editctr/website") || hash.indexOf("/mg/channelmg/websiteapp/")) {
        let globalChannelID;
        $("body").append(`<style>
    .logo-box{
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    }
    .logo-box > a img{
       width:30px;
     }
    .preview_btn{
    border-radius:3px;text-align: center;background: none;padding: 0 29px;height: 30px;line-height: 28px;padding: 0 16px;text-align: center;border: none;border: 1px solid #e3e3e3;background-color: #fff;color: #646464;
    max-width: calc(100vw - 1092px);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    }
    .publish_url a{color:#646464}
            .el-message {
            min-width: 380px;
            box-sizing: border-box;
            border-radius: 4px;
            border: 1px solid #ebeef5;
            position: fixed;
            left: 50%;
            top: -100px;
            transform: translateX(-50%);
            background-color: #edf2fc;
            transition: opacity .3s, transform .4s, top .4s;
            overflow: hidden;
            padding: 15px 15px 15px 20px;
            display: flex;
            align-items: center;
        }

        .el-message--info .el-message__content {
            color: #909399
        }
        .el-active{top:20px;z-index:9999999}
        .el-active-remove{top:-100px}
        @media screen and (max-width:1480px){
          .preview_btn{max-width: 400px;}
        }
    </style>
        <div role="alert" class="el-message el-message--info">
        <p class="el-message__content"></p>
    </div>
    `);
        let setTime = setInterval(() => {
            hash = window.location.hash
            let channelID = $(".tree-selected > span").attr("objid");
            if (globalChannelID != channelID) {
                globalChannelID = channelID;
                let title = $(".tree-selected > span").attr("title");
                console.log(channelID, title);
                $(".preview_btn").remove();
                let shortTitle = title;
                let site2SiteID = null;
                let isSite = false;
                const channelRegex = /唯一标识: (.*?)\n/;
                try {
                    shortTitle = "栏目名称:" + title.match(/栏目名称: (.*?)\n/)[1];
                    const match = title.match(channelRegex);
                    if (match) {
                        const uniqueIdentifier = match[1].trim();
                        shortTitle = shortTitle + ",唯一标识:" + uniqueIdentifier;
                    }
                } catch (e) {
                    shortTitle = "站点名称:" + title.match(/站点名称: (.*?)\n/)[1];
                    site2SiteID = title.match(/站点ID: (.*?)\n/)[1];
                    isSite = true;
                }

                let preview_url = isSite
                    ? `type=103&objtype=103&siteid=${channelID}&fragmentRequiredSiteid=${channelID}&ddtab=true`
                    : `type=101&objtype=101&channelid=${channelID}`;
                $(".logo-box").append(
                    `<button class="preview_btn"><a style="color:#646464" href="http://10.207.4.146/govapp/#/previewsite?${preview_url}&noauth=true&objid=${channelID}&isfragment=true" target="_blank" title="${title}\n非海云自带功能，by海云V8.0开发者辅助工具">预览ID:${channelID},${shortTitle}</a></button>`
                );
                $(".logo-box").append(
                    `<button class="preview_btn publish_btn" onclick="window.soloPublish(${channelID},${isSite})">发布当前栏目</button>`
                );
                if (hash.indexOf("/mg/channelmg/websiteapp/") != -1) {
                    let siteID =
                        $(".tree-selected").parents(".ng-scope.tree-expanded").find("div>div>span").eq(0).attr("id") ||
                        site2SiteID;
                    siteID = siteID.replace("objid-", "");
                    backPublishUrlF(siteID - 0, channelID, isSite);
                } else {
                    let siteID = $(".site-desc").attr("title");
                    siteID = siteID.match(/站点ID: (\S*)\n/)[1];
                    backPublishUrlF(siteID - 0, channelID, isSite);
                }
            }
        }, 1500);
    }
    unsafeWindow.soloPublish = function (id, isSite) {
        let url = isSite ? `OBJECTIDS=${id}&OBJECTTYPE=103` : `OBJECTIDS=${id}&OBJECTTYPE=101`;
        $.ajax({
            type: "GET", //默认get
            url: `http://10.207.4.146/gov/gov.do?${url}&methodname=soloPublish&serviceid=gov_publish`, //默认当前页
            dataType: "json",
            beforeSend: function () {}, //请求发送前回调,常用验证
            success: function (res) {
                //请求成功回调
                $(".el-message__content").text(res.DATA[0].TITLE);
                $(".el-message").addClass("el-active");
                setTimeout(() => {
                    $(".el-message").addClass("el-active-remove");
                }, 1500);
                setTimeout(() => {
                    $(".el-message").removeClass("el-active-remove el-active");
                }, 1700);
            },
            error: function (e) {
                //请求超时回调
                if (e.statusText == "timeout") {
                    alert("请求超时");
                }
            },
            complete: function () {}, //无论请求是成功还是失败都会执行的回调，常用全局成员的释放，或者页面状态的重置
        });
    };
});

//获取当前栏目发布地址
function backPublishUrlF(siteID, channelID, isSite) {
    let url = isSite ? `SiteId=${siteID - 0}` : `ChannelId=${channelID - 0}&SiteId=${siteID - 0}`;
    $.ajax({
        type: "GET", //默认get
        url: `http://10.207.4.146/gov/gov.do?${url}&methodname=getSiteOrChannelPubUrl&serviceid=gov_site`, //默认当前页
        dataType: "json",
        async: true,
        success: function (res) {
            //请求成功回调
            $(".logo-box").append(
                `<button class="preview_btn publish_btn publish_url"><a href="${res.DATA}" target="_blank">外网发布地址</a></button>`
            );
        },
        error: function (e) {
            //请求超时回调
            if (e.statusText == "timeout") {
                alert("请求超时");
            }
        },
    });
}


// 监听发布已发文档及其概览XHR请求
let publishChannelId = ""
let publishConfig = ""
// 保存原生 XMLHttpRequest 的 open 方法
const originalOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function(method, url,async) {
  // 解析 URL
  const parsedUrl = new URL(url, window.location.origin);
  const path = parsedUrl.pathname;
  const searchParams = parsedUrl.searchParams;

  // 定义目标参数及其预期值（如需要值匹配）
  const targetParams = {
    path: '/gov/gov.do', // 固定路径
    query: {
      methodname: 'publishPublishedDoc',
      serviceid: 'gov_publish',
      // 其他参数只需存在，不校验值（按需配置）
      EndDocCrtime: null,
      OBJECTIDS: null,
      OBJECTTYPE: null,
      StartDocCrtime: null,
    }
  };

  // 判断是否为目标接口
  let isTargetApi = false;
  if (path === targetParams.path) {
    // 检查是否包含所有目标参数
    const hasAllParams = Object.keys(targetParams.query).every(key => {
      const expectedValue = targetParams.query[key];
      const actualValue = searchParams.get(key);
      // 如果 expectedValue 为 null，只需参数存在；否则校验值
      return expectedValue === null ? actualValue !== null : actualValue === expectedValue;
    });
    isTargetApi = hasAllParams;
  }

  // 如果是目标接口，执行自定义逻辑
  if (isTargetApi) {
    console.log('拦截到目标接口:', url);
    publishChannelId = parsedUrl.searchParams.get("OBJECTIDS");
    publishConfig = parsedUrl.searchParams
    const _send = this.send;
    this.send = async function(body) {
      try {
        const check = await checkCurrentChannelsHasChild(publishChannelId);
        if (check.includes(true)) {
           notification(
           {title:"提示","message":`检测到您发布的栏目下还有子栏目（id:${publishChannelId}），是否同步发布这些栏目`,time:10000},
           true,
           [{text:"取消",class:"ant-cancel",onClick:"hideNotification"},{text:"确定",class:"ant-confim",onClick:"confimGetCurrentsChildId"}])
        }
      } catch (e) {
        console.error('处理失败:', e);
      }
      // 调用原生 send
      _send.call(this, method,url);
    };

    // 示例：修改请求参数（如替换OBJECTIDS）
    // parsedUrl.searchParams.set('OBJECTIDS', '69623,69622,69624');
    // url = parsedUrl.toString(); // 更新 URL
  }

  // 调用原生 open 方法
  originalOpen.call(this, method, url,async);



};


// 提示框
unsafeWindow.hideNotification = function(){
$(".ant-notification-notice-wrapper").remove();
}
let channelAllIds;
   unsafeWindow.confimGetCurrentsChildId = async function () {
      // 尝试获取 siteID
      clearTimeout(notificationTimeout)
      $(".ant-confim-loading").addClass("spin").show();
      $(".ant-confim").attr("disabled","disabled");
      let siteID = $(".site-desc").attr("title");
      try {
         siteID = siteID.match(/站点ID: (\S*)\n/)[1];
      } catch (e) {
         const href = $(".mg-tab-bar li a").attr("href");
         const url = new URLSearchParams(href);
         siteID = url.get("siteid");
      }
      if (!siteID) {
         alert("获取 siteID 失败，停止运行");
         return;
      }

      // 递归函数获取所有子栏目 ID
      let channelIdList = [];
      async function fetchChildChannels(siteID, channelId) {
         return new Promise((resolve, reject) => {
            getChannelInfo(siteID, channelId, (res) => {
               try {
                  let childPromises = [];
                  res.forEach((child) => {
                     if (child.CANPUB === "true") {
                        channelIdList.push({
                            channelid: child.CHANNELID,
                            channelname: child.CHNLDESC,
                        });
                         if(child.HASCHILDREN === "true"){
                             // 如果有子栏目，递归调用
                             childPromises.push(fetchChildChannels(siteID, child.CHANNELID));
                         }
                     }
                  });
                  Promise.all(childPromises).then(resolve).catch(reject);
               } catch (e) {
                  alert("获取子栏目失败，停止运行");
                  console.log("获取子栏目失败", e);
                  reject(e);
               }
            });
         });
      }

      // 遍历初始的 publishChannelId
      const publishChannelIds = publishChannelId.split(",");
      try {
         for (const id of publishChannelIds) {
            await fetchChildChannels(siteID, id);
         }
         console.log("所有子栏目已获取:", channelIdList);
         channelAllIds=channelIdList;
         $(".ant-notification-notice-wrapper").remove();
         notification(
           {title:"提示","message":`查询完成，子栏目数据${channelIdList.map((item,index)=>{
             return `<p>${item.channelname}：${item.channelid}</p>`
           }).join('')}`,time:20000},
           true,
           [{text:"取消",class:"ant-cancel",onClick:"hideNotification"},{text:"确定发布",class:"ant-confim",onClick:"confimPublishAllId"}])
      } catch (e) {
         console.error("获取子栏目过程中出错:", e);
      }
   };

unsafeWindow.confimPublishAllId = function(){
    $(".ant-confim-loading").addClass("spin").show();
    $(".ant-confim").attr("disabled","disabled");
   let ids = channelAllIds.map((item,index) => item.channelid).toString();
   publishConfig.set("OBJECTIDS",ids);
   let param = publishConfig.toString();
   fetch(`http://10.207.4.146/gov/gov.do?${param}`,{method:'get'}).then((response) => {
   return response.json()}).then((res) => {
    $(".ant-notification-notice-wrapper").remove();
    clearTimeout(notificationTimeout)
      try{
        let data = res.DATA.map((item,index) => item.TITLE)
         notification(
           {title:"完成","message":`${data.map((item,index) => {return `<p>${item}<p>`}).join("")}`,time:10000})
      }catch(e){
         console.log("发布错误")
      }
   })

}
let notificationTimeout
function notification({title,message,time},isEnableBtn = false,btnConfig = []){
   notificationTimeout = setTimeout(() => {hideNotification()},time || 10000)
   $("body").append(`
      <div class="ant-notification-notice-wrapper" style="transform: translate3d(0px, 0px, 0px);">
      <div class="ant-notification-notice ant-notification-notice-closable"><div class="ant-notification-notice-content">
      <div class="" role="alert"><div class="ant-notification-notice-message">${title}</div>
      <div class="ant-notification-notice-description">${message}</div></div></div>
      ${isEnableBtn ? `<div class="ant-notification-notice-actions">
         ${btnConfig.map((item, index) => {
            return `<button type="button" class="ant-btn ${item.class}" style="margin-right: 8px;" onclick="window.${item.onClick}()">${item.text}
            <span class="ant-btn-icon ant-btn-loading-icon ${item.class}-loading" style=""><span role="img" aria-label="loading" class="anticon anticon-loading anticon-spin"><svg viewBox="0 0 1024 1024" focusable="false" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z"></path></svg></span></span>
            </button>`
         }).join('')}
      </div>` : ""}

      <a tabindex="0" onclick="window.hideNotification()" class="ant-notification-notice-close" aria-label="Close"><span role="img" aria-label="close" class="anticon anticon-close ant-notification-notice-close-icon"><svg fill-rule="evenodd" viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"></path></svg></span></a>
      </div></div>
   `).append(`<style>
   .ant-btn-loading-icon{
     display:none;
   }
   .spin{
   animation: loadingCircle 1s infinite linear;
   display: inline-block;
    transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
   }
   @keyframes loadingCircle{
   100% {
   transform:rotate(360deg)
   }
   }
   .ant-notification-notice-description{max-height:30%;overflow-y:auto;}
   .ant-notification-notice-actions{margin-top:10px;display:flex;justify-content:end;}
     .ant-btn{
          background: #fff;
         border-radius: 5px;
         color: #000;
         font-size: 16px;
         padding: 0 20px;
         cursor: pointer;
         line-height:30px;
         transition:width .3s;
     }
        .ant-cancel{
         background:#eee;
     }
     .ant-confim{
         background:#347FFF;
         color:#fff
     }
    .ant-confim:disabled{
       opacity:0.5;
    }
        .ant-notification-notice-wrapper{
        transform: translate3d(0px, 0px, 0px);
    position: absolute;
    top: 24px;
    right: 24px;
    z-index: 99999;
    background: #fff;
    border-radius:5px;
    padding:20px 24px;
    width:20%;
    box-shadow:rgba(0, 0, 0, 0.08) 0px 6px 16px 0px;
    }
    .ant-notification-notice-close{
position: absolute;
    top: 24px;
    right: 24px;
    color: #000;
    font-size: 18px;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    display: flex;
    }
    .ant-notification-notice-close svg{
      padding:1px;
      font-size:20px;
    }
    .ant-notification-notice-close svg:hover{
      background:rgb(146 146 146 / 20%);
    }
    .ant-notification-notice-message{
    font-size:18px;
    margin-bottom:8px;
    }
   </style>`)
}

async function checkCurrentChannelsHasChild() {
    const ids = publishChannelId.split(",");
    const promises = ids.map(async (id) => {
        try {
            const data = await findChannelById(id);
            return data.DATA?.HASCHILDREN === "true";
        } catch (e) {
            return false;
        }
    });
    return Promise.all(promises);
}

function findChannelById(id){
return fetch(`http://10.207.4.146/gov/gov.do?MODULEID=70&channelid=${id}&methodname=findChannelById&serviceid=gov_channel`,{method:'get'}).then((response) => {
    return response.json()
})
}
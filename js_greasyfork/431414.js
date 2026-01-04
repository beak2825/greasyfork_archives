// ==UserScript==
// @name         minerva-online assistant
// @namespace    https://space.bilibili.com/17846288
// @version      3.3.6
// @license      MIT
// @description  此脚本能更方便使用minerva-online平台，可在顶端菜单栏右下角的按钮处设置功能开关，并查看功能详情
// @author       inoki
// @match        https://www.minerva-online.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      www2.deepl.com
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/431414/minerva-online%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/431414/minerva-online%20assistant.meta.js
// ==/UserScript==

/* VersionInfo 企业微信文档：https://doc.weixin.qq.com/doc/w2_AOMADQamAG8fAzy6aF1RWWmEc2ZhG?scode=AMwAwgcrABEDCapPcV
解决gfw导致的greasyfork无法更新问题，现将更新URL托管至www.minerva-online.com，并检测版本更新情况
*/

/*jshint esversion: 11*/

(() => {
    'use strict';


    const SET = {
        0: {
            'id': 0,
            'name': '置顶置底',
            'func': () => { GOTOPBOTTOM(); },
            'unfunc': () => { unGOTOPBOTTOM(); },
            'detail':
                '在平台域名所有可滚动页面生效，可快速滚动页面，或记录页面位置<br>' +
                '页面右下方添加【∨】/【∧】按钮<br>' +
                '【∨】/【∧】左键点击会根据页面滚动方向自动置顶或置底，按钮样式可在代码中自定义中修改<br>' +
                '【∨】/【∧】右键点击会在左侧生成【>】按钮，再次右键点击会删除【>】图标<br>' +
                '【>】生成时会记录当前页面位置，点击【>】将回到所记录的页面位置',
            'switch': 1
        },
        1: {
            'id': 1,
            'name': '菜单遮罩',
            'func': () => { COVERMENU(); },
            'unfunc': () => { unCOVERMENU(); },
            'detail':
                '在有顶端菜单栏的页面生效，可优化菜单栏展开逻辑<br>' +
                '让菜单栏需要点击一次后才可展开，防止鼠标经过时误触<br>' +
                '（默认关闭）',
            'switch': 0
        },
        2: {
            'id': 2,
            'name': '附件下载',
            'func': () => { DOWNLOADFILE(); },
            'unfunc': () => { unDOWNLOADFILE(); },
            'detail':
                '在问卷管理页面（alias=smngr.surveyexplorer）生效，可一键下载/预览/删除报告的附件<br>' +
                '每份报告前添加【↓】按钮<br>' +
                '【↓】点击可加载附件列表<br>' +
                '【√】点击可下载全部附件，之后会变为【〇】<br>' +
                '【×】点击可关闭附件列表<br>' +
                '附件名点击可下载单个附件，鼠标悬停可预览图片<br>' +
                '【删除全部附件】点击可将此报告全部附件标记为删除',
            'switch': 1
        },
        3: {
            'id': 3,
            'name': '扣分标记',
            'func': () => { MARKQUESTION(); },
            'unfunc': () => { unMARKQUESTION(); },
            'detail':
                '在单店报告页面（alias=survey.view）和功能【报告预览】中生效，可即时观察选项改动后的分数变化，也方便快速检查相关题<br>' +
                '将报告中题目的每个选项后方显示其分值（如有），在每题右上角显示当前具体分数，并对扣分题和N/A题标记相应颜色<br>' +
                '选项发生变化时，右上角分数会即时更新，并更新颜色标记<br>' +
                '鼠标悬停于每题右上角的分数时，会显示后台设置的得分计算规则<br>' +
                '可在上方设置扣分（默认为红）和N/A（默认为绿）的标记颜色，点击【√】保存更改<br>' +
                '颜色更改后关闭再开启此功能可在报告页面即时刷新颜色<br>' +
                '星期选项与日期不匹配时也将以扣分颜色标记（非即时更新），匹配时将在后方显示绿色√',
            'switch': 1
        },
        4: {
            'id': 4,
            'name': '评论编辑',
            'func': () => { COMMENTEDIT(); },
            'unfunc': () => { unCOMMENTEDIT(); },
            'detail':
                '在单店报告页面（alias=survey.view）生效，可对整体评论进行替换/首字大写/翻译等操作<br>' +
                '右下方【问卷图标】<img src=https://www.minerva-online.com/images/icons/menu/x16/survet.png>按钮展开操作界面<br>' +
                '使用前请注意阅读操作界面最上方的【点击获取提示】<br>' +
                '【匹配/替换内容】框内输入内容将即时显示匹配的评论框数,并标灰评论框且在上方标记^^，鼠标悬停灰色评论框可预览替换后内容<br>' +
                '【匹配内容】支持正则表达式（详见【点击获取提示】），可Ctrl+F使用浏览器自带功能搜索^^标记，以快速定位匹配到的评论框<br>' +
                '【一键替换】点击可将所有匹配到的评论框内容修改为替换后内容，此时鼠标悬停灰色评论框可预览修改前内容<br>' +
                '【首字母大写】点击可智能将所有句首英文字母变为大写，显示修改过的评论框数并标灰，此时鼠标悬停灰色评论框可预览修改前内容<br>' +
                '【评论翻译】点击会调用百度翻译，在每个评论框下方输出目标语言翻译，点击↑可将下方内容添加至评论框',
            'switch': 1
        },
        5: {
            'id': 5,
            'name': '验证输出',
            'func': () => { VERIFYEXPORT(); },
            'unfunc': () => { unVERIFYEXPORT(); },
            'detail':
                '在问卷管理页面（alias=smngr.surveyexplorer）生效，可一键验证输出所有勾选的报告<br>' +
                '在页面内显示报告时，表头上方会添加【验证输出勾选的报告】按钮<br>' +
                '【验证输出勾选的报告】点击并确认后会验证输出当前页面勾选的所有报告，成功输出的报告下方小窗口会显示绿色提示<br>' +
                '（电脑配置较低时一次输出太多份可能导致页面卡死，请根据浏览器最多同时能开几个报告页面量力而行，默认关闭）',
            'switch': 0
        },
        6: {
            'id': 6,
            'name': '定制汇总',
            'func': () => { CUSTOMROLLUP(); },
            'unfunc': () => { unCUSTOMROLLUP(); },
            'detail':
                '在定制汇总页面（alias=clientaccess.customrollups）生效，可对数据表格执行一些便捷功能<br>' +
                '在汇总表格上方添加功能按钮<br>' +
                '【复制表格】点击可一键复制表格全部内容，方便复制到excel等软件中编辑，对alias=client.analysiscustomrollups.3.0页面也生效<br>' +
                '【复制表格】右侧下拉框选择“分数后+%”时，仅在Pivot table界面下生效，点击【复制表格】执行复制前会为所有数据后添加%<br>' +
                '【精确Pts%】点击可在表格右侧添加一列Pts/PtsOf的比值，并根据右侧下拉框选择的数字，进行相应小数位数的四舍五入<br>' +
                '【精确Pts%】需要Pts和PtsOf列同时存在才能正常生效，用以避免默认Pts%的2位小数舍入可能造成的偏差<br>' +
                '【选项统计】点击可自动统计各架构各题选项的数量与占比，并在表格下方的新增行中展示（QuestionText前[AD]标识），百分比值根据左侧下拉框数字四舍五入<br>' +
                '【选项统计】需要QuestionText和AnswerText和#Surveys列同时存在才能正常生效，数量显示在末尾括号内，百分比值显示在#Survsys格<br>' +
                '【选项统计】参与统计的仅为QuestionText/AnswerText左侧非隐藏列和非隐藏行，可在隐藏不必要的列或行后重新点击按钮刷新统计<br>' +
                '【选项统计】在点击问题选项最右侧按钮<img src=https://www.minerva-online.com/images/icons/filtersv2/answers.png style="object-position:-16px 0;object-fit:none;width:16px;height:16px">加载选项后，可在统计中显示数量为0的选项<br>' +
                '在（alias=client.analysiscustomrollups.3.0）页面的所在地中新增【架构-Loc】字段以支持查询门店对应的架构，而非报告对应的架构',
            'switch': 1
        },
        7: {
            'id': 7,
            'name': '报告存档',
            'func': () => { SURVEYSAVES(); },
            'unfunc': () => { unSURVEYSAVES(); },
            'detail':
                '在单店报告页面（alias=survey.view，v3问卷除外）生效，可为报告内容实时进行本地存档防止意外丢失<br>' +
                '右下方【书本图标】<img src=https://www.minerva-online.com/images/icons/menu/x16/KB-icon.png>按钮展开操作界面，可查看自动/手动存档列表<br>' +
                '【存档】点击可进行手动存档，每次对报告内容进行修改时，将在本地进行自动存档<br>' +
                '【预览】点击可查看存档内容，并对需要读档写入的题目进行勾选，存档内容与当前报告不一致的会有红框标出<br>' +
                '【读档】点击可将选中的存档全部内容写入到当前报告，或只写入预览界面勾选的题目<br>' +
                '【删除】点击可删除选中的存档，自动/手动存档上限各为10个，超出时自动删除此类最早存档<br>' +
                '【下载】仅在预览手动存档时显示，可将手动存档内的报告内容下载为.csv格式文件<br>' +
                '【上传】仅在预览手动存档时显示，可将.csv格式文件内容上传为手动存档，内容格式请严格按照【下载】的.csv格式文件<br>' +
                '（“评论编辑”功能造成的修改不会触发自动存档，可在修改后点击任意评论框触发自动存档）',
            'switch': 1
        },
        /*
        8:{
            'id':8,
            'name':'PDF命名',
            'func':()=>{PDFRENAME();},
            'unfunc':()=>{unPDFRENAME();},
            'detail':
            '在“以PDF格式下载”的转化页面生效，在高级页添加【命名并下载(全部)】按钮<br>'+
            '可在下方FIle Name处自定义命名格式，在下拉框选择需要的命名元素（无须点merge）<br>'+
            '【命名并下载】点击可下载单个PDF，并按File Name处的自定义命名格式命名<br>'+
            '【命名并下载全部】点击相当于一键点击了所有【命名并下载】<br>'+
            '（默认关闭，因为平台已于<a target=_blank href=https://www.minerva-online.com/document.asp?alias=knowledgebase#/article/005bcf16-8530-4437-b4a4-b671ad3db56f>2022.10更新</a>中支持了中文命名）',
            'switch':0
        },
        */
        9: {
            'id': 9,
            'name': '优化表头',
            'func': () => { BETTERTHEAD(); },
            'unfunc': () => { unBETTERTHEAD(); },
            'detail':
                '在所有含有页面滚动时自动冻结表头功能的页面生效（例：问卷管理），可优化表头功能<br>' +
                '点击表头上方【标题】行可显示表格所有列的表头内容，根据其勾选状态与否可显示/隐藏对应列<br>' +
                '优化冻结表头的表现，使冻结的表头不再像原先那样闪烁，且在冻结状态下也能执行排序/筛选功能<br>' +
                '（优化冻结表头在部分浏览器可能不支持，若无效建议使用最新版chrome/edge浏览器体验）',
            'switch': 1
        },
        10: {
            'id': 10,
            'name': '外观效果',
            'func': () => { CSSEFFECT(); },
            'unfunc': () => { unCSSEFFECT(); },
            'detail':
                '对所有网页外观效果进行调整<br>' +
                '【夜间模式】开启后整体页面主色调变为黑色，在某些场景下更护眼<br>' +
                '（目前夜间模式为较粗略的反色处理，如有视觉效果差的地方请反馈，后续将调整）<br>' +
                '【隐藏logo】开启后隐藏左上角Minerva&Co的logo区域，节省页面空间',
            'switch': 1
        },
        11: {
            'id': 11,
            'name': '图片编辑',
            'func': () => { IMAGEEDIT(); },
            'unfunc': () => { unIMAGEEDIT(); },
            'detail':
                '在附件图片的编辑页面（/mystservices/MystImageUpload/upload_modify.asp）生效，可扩展功能<br>' +
                '在点击【shape】→【color】为添加的图形选择颜色时，颜色从原本的2种增加至63种',
            'switch': 1
        },
        12: {
            'id': 12,
            'name': '报告预览',
            'func': () => { REPORTCONTENT(); },
            'unfunc': () => { unREPORTCONTENT(); },
            'detail':
                '在执行管理页面（alias=smngr.opermgmt）生效，可批量预览报告内容及分数，方便未上线报告批量复查<br>' +
                '在此页面点击【问卷】→【显示问卷】后，页面内有报告时，右侧会添加一页【报告内容】<br>' +
                '【报告内容】→【显示内容】点击后将自动加载对应报告的内容，并显示在表格中<br>' +
                '报告内的图片附件点击可放大，非图片附件点击可下载<br>' +
                '点击表格上方的excel图标可下载当前表格中的所有显示内容，下载前可根据需要隐藏多余的行和列<br>' +
                '如对报告进行了修改，再次点击【显示内容】即可刷新显示的报告内容<br>' +
                '如要更换显示的报告，需先在【问卷】页内更新显示的报告，再在【报告内容】页内点击【显示内容】',
            'switch': 1
        },
    };
    unsafeWindow.MA_SET = SET;


    //先执行外观效果功能
    let CSSEFFECT_style;
    if (GM_getValue(SET[10].name, SET[10].switch)) SET[10].func();

    //DOM加载后开始执行其余功能
    let $;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            preInit();
        });
    } else {
        preInit();
    }
    function preInit() {
        //filemanager页面不执行
        if (document.location.href.includes('alias=filemanager')) {
            unsafeWindow.userIsEnterpriseAdmin = true;
            return;
        }
        //如网页无jQuery或版本低于1.7则引入1.8.2
        $ = unsafeWindow.jQuery;
        try {
            console.log('jq', $.fn.jquery, 'ui', $.ui?.version);
            $().on();//jQuery 1.7版本后才有$().on()
            init();
        } catch (e) {
            const hasUI = $?.ui;
            const jq = document.createElement('script');
            jq.src = '/lib/jquery/jquery-1.8.2.min.js';//'https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js';
            document.head.appendChild(jq);
            jq.onload = () => {
                if (hasUI) {
                    const jqui = document.createElement('script');
                    jqui.src = '/lib/jqueryui/jquery-ui-1.8.21.min.js';
                    document.head.appendChild(jqui);
                    jqui.onload = () => console.log('jQueryUI', $.ui.version);
                }
                $ = unsafeWindow.jQuery;
                init();
            };
        }
        collaborationEnterpriseAdmin();
    }

    //用于打印脚本简介
    unsafeWindow.MA_logInfo = () => {
        let info = '', i = 0;
        for (let s in SET) {
            info += `<b>${++i} ${SET[s].name}：</b>\n`;
            info += SET[s].detail.replaceAll('<br>', '\n');
            info += '\n\n';
        }
        console.log(info);
        return info;
    };


    /*在顶端菜单栏添加MOassist设置按钮*/
    function init() {
        //检测版本并上报
        const lastVersion = GM_getValue('lastVersion', 0);
        const curVersion = GM_info.script.version;
        if (curVersion !== lastVersion) {
            const loginPostJSON = {
                action: "exec",
                JSONPath: "dataset.data.0",
                dataset: { datasetname: "/Apps/SM/APIv2/Query/UserAccount/Profile" },
                parameters: [
                    { name: "QuerySpecification", value: "[Login]" }
                ]
            };
            $.post(
                '/open/data.asp',
                'post=' + encodeURIComponent(JSON.stringify(loginPostJSON)),
                loginData => {
                    if ($.isEmptyObject(loginData)) return;
                    const login = loginData[0].Login;
                    const insertPost = {
                        "action": "exec",
                        "dataset": {
                            "datasetname": "/Apps/com.OpenDataPlatform/Data/RawDataCollection/RawDatasets_ModifyData_CMS",
                            "dataformat": "simple",
                            "datafieldproperties": {
                                "columns": ["name"]
                            }
                        },
                        "parameters": [
                            {
                                "name": "SecurityObjectUserID",
                                "value": ""
                            },
                            {
                                "name": "RawDataSetGUID",
                                "value": "97F20100-2687-413E-9463-E3BFAB162EF8"
                            },
                            {
                                "name": "RawData",
                                "value": `${login}${curVersion}`
                            },
                            {
                                "name": "RecordSeparator",
                                "value": ""//String.fromCharCode(30)
                            },
                            {
                                "name": "UnitSeparator",
                                "value": ""//String.fromCharCode(31)
                            },
                            {
                                "name": "MiscSettings",
                                "value": "[Mode:Insert]"
                            }
                        ]
                    };
                    $.post(
                        '/open/data.asp',
                        'post=' + encodeURIComponent(JSON.stringify(insertPost)),
                        d => {
                            if (d.dataset.data[0] === 'OK') {
                                GM_setValue('lastVersion', curVersion);
                            }
                        },
                        'json'
                    );

                });
        }
        console.log('jQuery', $.fn.jquery);
        for (let i in SET) if (GM_getValue(SET[i].name, SET[i].switch)) SET[i].func();//执行开启的功能
        const menu = $('div#menu');
        if (menu.length) {
            menu.find('ul.tools').append(
                `<li class="MOassist">
                  <a class="toolsLink">
                    <div class="iconTools" style="background: url('/images/icons/menu/x16/tools-settings.png')"></div>
                    <ul class="textArea" style="visibility:visible; display:none">
                      <li>MO助手设置</li>
                    </ul>
                    <ul id="MOoption" class="innerItemFirst" style="z-index: 11; display:none; top:25px; right:0px"></ul>
                  </a>
                </li>`
            );
            menu.find('li.MOassist').on('click', function () {
                MOListSwitch($(this).find('ul#MOoption'));
            }).find('ul#MOoption').on('click', e => {
                e.stopPropagation();//让之后添加的功能列表不继承click事件
            });
            mouseHover(menu.find('li.MOassist'));
        }
    }

    //功能列表开关
    function MOListSwitch(ul) {
        if (ul.css('display') === 'none') {
            if (!ul.children().length) initOptions($('div#menu'));
            ul.stop().slideDown(200);
        } else {
            ul.stop().slideUp(200);
        }
    }

    //导入所有功能列表并显示开关状态
    function initOptions(menu) {
        for (let i in SET) {
            menu.find('ul#MOoption').append(
                `<li id="MOoptions" class="MOassist" style="width:100%">
                  <div class="menuItemText" style="color:#4C5057">${SET[i].name}</div>
                  <input type=checkbox id=${SET[i].id} class=menuIconSmall>
                  <ul class="textArea" style="visibility:visible; display: none; margin-top:0px; right:120px">
                    <li style="padding:0px 5px !important">${SET[i].detail}</li>
                  </ul>
                </li>`
            );
            if (GM_getValue(SET[i].name, SET[i].switch)) menu.find('input#' + SET[i].id).prop('checked', true);//打勾开启状态的功能
        }
        //根据是否选中即时启用或卸载功能并记录开关状态
        menu.find('li#MOoptions').on('click', function (e) {
            const checkbox = $(this).children('input:checkbox');
            const id = $(checkbox).attr('id');
            if (GM_getValue(SET[id].name, SET[id].switch)) {
                SET[id].unfunc();
                $(checkbox).prop('checked', false);
                GM_setValue(SET[id].name, 0);
            } else {
                SET[id].func();
                $(checkbox).prop('checked', true);
                GM_setValue(SET[id].name, 1);
            }
        }).children('ul.textArea').on('click', e => {
            e.stopPropagation();
        });
        mouseHover(menu.find('li#MOoptions'));
        setMarkQuestionColor(menu);
        setCSSEffectOption(menu);
    }

    //鼠标聚焦时显示详情 【https://www.minerva-online.com/portal/menu/js/v2/menuRender.js?version=21-08 createToolOption : 】
    function mouseHover(ele) {
        ele.hover(function () {
            $(this).find('ul:first').stop().show(200);
        }, function () {
            $(this).find('ul:first').stop().hide(200);
        });
    }

    //添加扣分标记颜色设置界面
    function setMarkQuestionColor(menu) {
        menu.find('input#3.menuIconSmall').next('ul').prepend(`<div style="padding:0px 5px">
        <b id=de>扣分颜色：</b>
        <form id=de>
            <input type=radio name=de value=red>红
            <input type=radio name=de value=orange>橙
            <input type=radio name=de value=yellow>黄
            <input type=radio name=de value=green>绿
            <input type=radio name=de value=blue>蓝
            <input type=radio name=de value=purple>紫
            <input type=radio name=de value=custom>自定义
            <input type=color class=selectedColor>
            <input type=button class=rm-btn value=√ title=保存 style="padding:1px 6px">
        </form>
        <b id=na>N/A颜色：</b>
        <form id=na>
            <input type=radio name=na value=red>红
            <input type=radio name=na value=orange>橙
            <input type=radio name=na value=yellow>黄
            <input type=radio name=na value=green>绿
            <input type=radio name=na value=blue>蓝
            <input type=radio name=na value=purple>紫
            <input type=radio name=na value=custom>自定义
            <input type=color class=selectedColor>
            <input type=button class=rm-btn value=√ title=保存 style="padding:1px 6px">
        </form>
        </div>`);
        //颜色选项初始化
        menu.find('form#de,form#na').each(function () {
            const curColor = $(this).attr('id') === 'de' ?
                GM_getValue($(this).prev().text(), 'red') : GM_getValue($(this).prev().text(), 'green');
            $(this).prev().css('color', curColor);
            $(this).children('.selectedColor').attr('id', curColor);
            if (!curColor.includes('#')) {
                $(this).children('input[value=' + curColor + ']').attr('checked', true);
                $(this).children('.selectedColor').hide();
            } else {
                $(this).children('input[value=custom]').attr('checked', true);
                $(this).children('.selectedColor').val(curColor);
            }
        });
        //点击选项颜色改变
        menu.find('form#de,form#na').children(':radio').on('click', function () {
            if ($(this).val() === 'custom') {
                $(this).next().show();
                $(this).next().attr('id', $(this).next().val());
            } else {
                $(this).nextAll('.selectedColor').hide();
                $(this).nextAll('.selectedColor').attr('id', $(this).val());
            }
            $(this).parent().prev().css('color', $(this).nextAll('.selectedColor').attr('id'));
        });
        //自定义颜色改变
        menu.find('form#de,form#na').children('.selectedColor').on('input', function () {
            $(this).attr('id', $(this).val());
            $(this).parent().prev().css('color', $(this).val());
        });
        //确认更改
        menu.find('form#de,form#na').children(':button').on('click', function () {
            GM_setValue($(this).parent().prev().text(), $(this).prev().attr('id'));
            if (!$(this).next().is('b')) {
                $(this).after('<b>保存成功</b>');
                setTimeout(() => {
                    $(this).next().remove();
                }, 3e3);
            }
        });
    }

    //添加扣分标记颜色设置界面
    function setCSSEffectOption(menu) {
        menu.find('input#10.menuIconSmall').next('ul').prepend(`<div id=CSSEffectOption>
        <input type=checkbox value=夜间模式>夜间模式
        <input type=checkbox value=隐藏logo>隐藏logo
        </div>`);
        const oCE = SET[10];
        const name_ = oCE.name + '_';
        menu.find('div#CSSEffectOption input').each(function () {
            const value = this.value;
            if (GM_getValue(name_ + value, 0)) $(this).prop('checked', true);//初始化勾选状态
            $(this).on('click', function () {
                if (GM_getValue(name_ + value, 0)) {
                    $(this).prop('checked', false);
                    GM_setValue(name_ + value, 0);
                } else {
                    $(this).prop('checked', true);
                    GM_setValue(name_ + value, 1);
                }
                if (GM_getValue(oCE.name, oCE.switch)) oCE.func();
            });
        });
    }
    /*在顶端菜单栏添加MOassist设置按钮*/


    /*获取app.collaboration页面Enterprise.Admin权限*/
    function collaborationEnterpriseAdmin() {
        if (!document.location.href.includes('alias=app.collaboration')) return;
        const funcName = ['renderSyncLog', 'renderImportLog'];
        for (let n of funcName) eval('unsafeWindow.' + n + '=' + unsafeWindow[n].toString().replace('parseInt(data[0].IsMember)', '1'));
    }
    /*获取app.collaboration页面Enterprise.Admin权限*/


    /*0:置顶置底*/
    function GOTOPBOTTOM(scrollTrigger) {
        if (!scrollTrigger) {
            $(window).on('scroll.gotopbottom', () => {//如页面后续因为内容增加而能滚动的场合触发
                if ($('div#goTopBottom').length === 0) GOTOPBOTTOM(1);
            });
            $(window).on('resize.gotopbottom', () => {//如页面因为resize而不需要滚动条的场合触发
                if (!hasScorllBar() && $('div#goTopBottom').length) $('div#goTopBottom,div#goTopBottomLock').remove();
            });
        }
        if (!hasScorllBar() || document.location.href.includes('alias=knowledgebase')) return;//knowledgebase页面自带置顶按钮，不启用
        const goTopBottomButton = document.createElement('div');
        $(goTopBottomButton).appendTo('body');
        $(goTopBottomButton).css({ position: 'fixed', zIndex: 1e4 }).attr('id', 'goTopBottom').attr('title', '置底');
        const toggleButton = document.createElement('img');
        $(toggleButton).appendTo(goTopBottomButton);
        $(toggleButton).css({ display: 'block', cursor: 'pointer' }).attr('src', '/knowledgebase/images/arrow_back_to_top.svg');//按钮显示图片(向下箭头)

        //以下按钮参数可自定义修改
        goTopBottomButton.style.bottom = '50px';//按钮距离网页底部50px
        goTopBottomButton.style.right = '30px';//按钮距离网页右边30px
        toggleButton.style.width = '25px';//按钮图片宽25px
        toggleButton.style.height = '25px';//按钮图片高25px
        toggleButton.style.opacity = 0.5;//按钮不透明度，0.0（完全透明）到1.0（完全不透明）
        toggleButton.style.backgroundColor = 'grey';//按钮背景颜色，也可使用在excel等软件的自定义颜色界面的16进制代码
        const clickScrollTime = 500;//点击按钮时，网页滚动到顶部或底部需要的时间，500毫秒

        //点击按钮时网页滚动到顶部或底部
        let scrollDirection = 'down';
        toggleButton.addEventListener('click', () => {
            if (scrollDirection === 'up') {
                $('html,body').animate({ scrollTop: 0 }, clickScrollTime);
            } else {
                $('html,body').animate({ scrollTop: $(document).height() }, clickScrollTime);
            }
        });
        //右键按钮记录页面位置
        const lock = $(goTopBottomButton).clone().attr({ id: 'goTopBottomLock', title: '回到记录位置' }).css({ right: '60px', display: 'none' }).appendTo('body');
        lock.children('img').css('transform', 'rotate(270deg)');
        goTopBottomButton.onmouseup = function (e) {
            if (e.button === 2) {
                if (lock.css('display') === 'none') {
                    const x = window.pageXOffset;
                    const y = window.pageYOffset;
                    lock[0].onclick = () => { scrollTo(x, y); };
                    lock.show();
                } else {
                    lock.hide();
                }
            }
        };
        goTopBottomButton.oncontextmenu = () => { return false; };
        //页面滚动监听
        let scrollAction = window.pageYOffset;
        $(window).scroll(() => {
            const diffY = scrollAction - window.pageYOffset;
            scrollAction = window.pageYOffset;
            scrollDirection = diffY < 0 ? 'down' : 'up';
            toggleButton.style.transform = diffY < 0 ? 'rotate(0deg)' : 'rotate(180deg)';
            if (getScrollTop() === 0) {
                scrollDirection = 'down';
                toggleButton.style.transform = 'rotate(0deg)';
            }
            if (getScrollTop() + window.innerHeight + 20 >= $(document).height()) {
                scrollDirection = 'up';
                toggleButton.style.transform = 'rotate(180deg)';
            }
            goTopBottomButton.title = scrollDirection === 'up' ? '置顶' : '置底';
        });
    }

    //判断是否有滚动条
    function hasScorllBar() {
        return $(document).height() > (window.innerHeight + 1 || document.documentElement.clientHeight);
    }

    //获取垂直方向滑动距离
    function getScrollTop() {
        let scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

    //卸载置顶置底
    function unGOTOPBOTTOM() {
        $(window).off('scroll.gotopbottom').off('resize.gotopbottom');
        if ($('div#goTopBottom,div#goTopBottomLock').length) $('div#goTopBottom,div#goTopBottomLock').remove();
    }
    /*置顶置底*/


    /*1:菜单遮罩*/
    function COVERMENU() {
        if ($('div#menu').length) {
            //若存在menu则添加cover层
            const menu = $('div#menu')[0];
            const zidx = getComputedStyle(menu).zIndex;
            const cover = document.createElement('div');
            cover.className = 'layout';
            cover.style = 'top:' + menu.style.top + ';opacity:0.3;z-index:' + zidx + ';right:10%';
            //点击时将cover层下置
            cover.addEventListener('click', () => {
                cover.style.zIndex = -1;
            });
            //离开menu时cover层还原
            menu.addEventListener('mouseleave', () => {
                cover.style.zIndex = zidx;
            });
            //cover层位置跟随menu 【https://www.minerva-online.com/portal/menu/js/v2/menuRender.js?version=21-08 onScrollEventHandler : 】
            $(window).on('scroll.covermenu', function () {
                const SM = unsafeWindow.SM;
                if (!SM) return;
                SM.ui.parentContainer = cover;//偷梁换柱
                SM.ui.onScrollEventHandler();
                SM.ui.parentContainer = menu;
            });
            $(cover).appendTo($('body')[0]).attr('id', 'cover');
        }
    }

    //卸载菜单遮罩
    function unCOVERMENU() {
        if ($('div#cover').length) {
            $('div#cover').remove();
            $(window).off('scroll.covermenu');
        }
    }
    /*菜单遮罩*/


    /*2:附件下载*/
    function DOWNLOADFILE() {
        if (document.location.href.includes('alias=smngr.surveyexplorer') && $('tr.persist-header').length) {
            if (!$('table#reporttable').find(':checkbox').length) return;
            $('tr.persist-header').each(function () {
                $(this).children().first().after($(this).children().first().clone(true).attr('class', 'downloadFile'));
            });
            $('table#reporttable').find(':checkbox').each(function () {//checkbox后添加下载按钮
                const surveyid = $(this).val();
                $(this).parent().after(
                    `<td>
                      <div id=${surveyid} class=downloadFile>
                        <button type=button id=download class=rm-btn title=加载附件列表>↓</button>
                      </div>
                    </td>`
                );
                $(this).parent().next().find('button#download').one('click', function () {
                    DownloadButton($(this).parent(), surveyid);//将$('div.downloadFile')传参为df
                });
            });
        }
        //兼容inoki.va页面
        if (document.location.href.includes('alias=inoki.va')) {
            if (!$) $ = unsafeWindow.jQuery;
            if ($('table#reporttable tr').length) {
                $('table#reporttable>thead>tr').each(function () {
                    $(this).children().first().before($(this).children().first().clone(true).attr('class', 'downloadFile'));
                    $(this).children().first().text('附件下载');
                });
                $('table#reporttable').find('tbody>tr').each(function () {
                    const surveyid = $(this).attr('id');
                    $(this).prepend(
                        `<td>
                          <div class=downloadFile>
                            <button type=button id=download class=rm-btn title=加载附件列表>↓</button>
                          </div>
                        </td>`
                    );
                    $(this).find('button#download').one('click', function () {
                        DownloadButton($(this).parent(), surveyid);
                    });
                });
            }
        }
    }

    //获取附件列表
    function DownloadButton(df, surveyid) {
        //if(!surveyid) surveyid=df.parents('tr').attr('id');
        df.find('button#download').hide();
        df.append('<b id=loading>......</b>');
        const postJSON = {
            action: "exec",
            JSONPath: "dataset.data.3",
            dataset: { datasetname: "/Apps/SM/Survey/SurveyInstanceGetData" },
            parameters: [
                { name: "SurveyInstanceID", value: surveyid }
            ]
        };
        $.post('/open/data.asp', 'post=' + encodeURIComponent(JSON.stringify(postJSON)), (data, status) => {//调用API获取当前survey数据[SurveyInstanceGetData]
            if (status === 'success') {
                if (Array.isArray(data)) {
                    const filedata = data;
                    const fileno = filedata.length;
                    df.append(
                        `<ol id=filelist>
                             <b>\t#=${fileno}</b>
                             <div style="max-height:150px;overflow:auto;width:max-content;padding:0 0 0 1rem">
                                 <table></table>
                             </div>
                         </ol>`
                    );
                    if (fileno > 0) {
                        const ol = df.find('ol#filelist');
                        $('<button type=button id=downloadAll class="rm-btn rm-btn-default" title=下载全部>√</button>').prependTo(ol)
                            .on('click', () => {
                                DownloadAll(df);
                            });
                        $('<button type=button id=deleteAll class="rm-btn rm-btn-default">删除全部附件</button>').appendTo(ol)
                            .on('click', () => {
                                DeleteAll(df, surveyid);
                            });
                        const tb = ol.find('div>table');
                        for (let i in filedata) {
                            const filename = filedata[i].FileName + '.' + filedata[i].FileExtension;
                            const fileid = filedata[i].AttachmentID;
                            const fileurl = '/mystservices/Attachments/getAttachment.asp?Attachment=' + fileid + '&Password=' + filedata[i].Password + '';
                            let filesize = Number(filedata[i].FileSizeInBytes) / 1024;
                            filesize = (filesize > 1024) ? (Math.round(filesize / 1024 * 1e2) / 1e2).toFixed(2) + ' MB' : (Math.round(filesize * 1e2) / 1e2).toFixed(2) + ' KB';
                            $('<tr id=' + fileid + '>').appendTo(tb).append(
                                `<td>
                                     <li><a id=${filedata[i].AttachmentType} class=mailboxlink href=${fileurl} target=_blank>${filename}</a></li>
                                 </td>
                                 <td>${filesize}</td>
                                 <td>QID:${filedata[i].ProtoQuestionID}</td>`
                            );
                        }
                        df.find('a#I,a#V').mouseenter(function () {
                            FilePreview(1, $(this).attr('href'));
                        }).mouseleave(() => {
                            FilePreview(0);
                        });
                    }
                } else {
                    df.append('<b>登录失效！</b>');
                }
            } else {
                df.append('<b>网络错误！</b>');
            }
            DownloadButton0(df, surveyid);
        }, 'json');
    }

    //预览附件图片
    function FilePreview(show, src) {
        if (show) {
            const imgid = src.split('=')[2];
            if ($('img#' + imgid + '.filepreview').length === 0) {
                $('<div><img id=' + imgid + ' class=filepreview></img></div>').appendTo('body');
                $('img#' + imgid + '.filepreview').attr('src', src + '&getThumbnail=1').css('height', '200px')//视频附件预览图u&getThumbnail=1
                    .parent().css({ position: 'fixed', zIndex: 1e4, height: '200px', background: 'url(/images/icons/animated/loading24.gif)' });
            }
            $('img#' + imgid + '.filepreview').parent().css({ top: event.clientY - 200, left: event.clientX + 100 });
            $('img#' + imgid + '.filepreview').show();
        } else {
            $('img.filepreview').hide();
        }
    }

    //按钮变为关闭
    function DownloadButton0(df, surveyid) {
        df.find('b#loading').remove();
        df.find('button#download').text('×').attr('title', '关闭附件列表').show().one('click', () => {
            DownloadButton1(df, surveyid);
        });
    }

    //按钮重置为初始
    function DownloadButton1(df, surveyid) {
        const passid = [];
        df.find('a#I,a#V').each(function () {
            passid.push($(this).attr('href').split('=')[2]);
        });
        for (let id of passid) $('img#' + id).parent().remove();
        df.find('ol,b').remove();
        df.find('button#download').text('↓').attr('title', '加载附件列表').one('click', () => {
            DownloadButton(df, surveyid);
        });
    }

    //下载全部
    function DownloadAll(df) {
        df.find('button#downloadAll').text('〇').hide();
        const iframe = df.find('ol#filelist iframe');
        const a = df.find('ol#filelist a');
        if (iframe.length) iframe.remove();
        setTimeout(() => {
            df.find('button#downloadAll').show();
        }, 1e3 * a.length);//有几个附件就隐藏按钮几秒
        a.each(function () {
            $('<iframe src=' + $(this).attr('href') + '>').appendTo(this).hide();
        });
    }
    /*
    //不知是不是因为下载地址有重定向的关系，GM_download效率低下，弃用
    function DownloadAll(df){
        const a=df.find('ol#filelist a');
        let loaded=0;
        df.find('button#downloadAll').text('〇').hide();
        df.find('ol#filelist>p,ol#filelist>br').remove();
        df.find('ol#filelist>b').text(`\t#=${loaded}/${a.length}\t下载中...`);
        a.each(function(){
            GM_download({
                'url':$(this).attr('href'),
                'name':df.parent().nextAll().eq(3)[0].innerText+'—'+df.parent().nextAll().eq(7)[0].innerText.replace('\n',' ')+'—'+$(this).text(),
                'onload':()=>{
                    loaded++;
                    if(loaded===a.length){
                        df.find('ol#filelist>b').text(`\t#=${loaded}/${a.length}\t下载完成！`);
                        df.find('button#downloadAll').show();
                    }else{
                        df.find('ol#filelist>b').text(`\t#=${loaded}/${a.length}\t下载中...`);
                    }
                },
                'onerror':()=>{
                    df.find('ol#filelist>b').after('<br><p>'+$(this).text()+'\t下载错误！</p>');
                    df.find('button#downloadAll').show();
                },
                'ontimeout':()=>{
                    df.find('ol#filelist>b').after('<br><p>'+$(this).text()+'\t下载超时！</p>');
                    df.find('button#downloadAll').show();
                }
            });
        });
    }
    */

    function DeleteAll(df, surveyid) {
        const attid = [];
        df.find('a').each(function () {
            attid.push(this.href.match(/(?<=\=)\d+/)[0]);
        });
        console.log(attid, surveyid);
        const apply = confirm('请确认是否将此报告所有附件标记为删除\n(可在more中恢复，确认后可刷新页面或再次加载附件列表查看)');
        if (apply) {
            //模拟手动禁用单个附件发送post请求，但请求数量较多
            for (let i of attid) {
                $.post(`/document.asp?alias=survey.disableimage&ImageID=${i}&InstanceID=${surveyid}`, 'ref=&step=2&comment=');
            }
            df.children('button#download').click();
        }
    }
    /*
    //以API实现，缺点是不会在more中留下用以恢复的记录，优点是请求数量较少
    function DeleteAll(df){
        let csv='';
        df.find('a').each(function(){
            csv+=this.href.match(/(?<=\=)\d+/)[0]+',';
        });
        csv=csv.slice(0,-1);
        console.log(csv);
        const apply=confirm('请确认是否要删除此报告所有附件\n(无法恢复注意备份，确认后可刷新页面或再次加载附件列表查看)');
        if(apply){
            //调用API将当前survey的所有附件标记为删除[SurveyAttachmentsMarkAttachmentsForDelete]
            $.get(`
            /open/data.asp?post={
                "action":"exec",
                "dataset":{"datasetname":"/Apps/SM/Media Hub/SurveyAttachmentsMarkAttachmentsForDelete"},
                "parameters":[{"name":"CsvList","value":"${csv}"}]
            }`);
            df.children('button#download').click();
        }
    }
    */

    //卸载附件下载
    function unDOWNLOADFILE() {
        if ($('div.downloadFile').length && $('td.downloadFile').length) {
            $('td.downloadFile').remove();
            $('div.downloadFile').each(function () {
                $(this).parent().remove();
            });
        }
    }
    /*附件下载*/


    /*3:扣分标记*/
    function MARKQUESTION() {
        if (document.location.href.includes('alias=survey.view')) {
            if (unsafeWindow.OSM) {
                unsafeWindow.surveyRender_observer = new MutationObserver(function (mutationsList) {
                    unsafeWindow.surveyRender_observer.disconnect();
                    markScoreV3();
                });
                unsafeWindow.surveyRender_observer.observe(document.getElementById('rm-osm-target'), { childList: true });
            } else {
                getScoreData([$('input[name=PROTO]').val()], scoreData => {
                    if ($.isEmptyObject(scoreData) || scoreData[10].length) {
                        if ($('input#instanceID').val() === '') return;
                        //旧方法仅能保存后更新分数
                        $('span.surveyansweroption').each(function () {
                            if ($(this).prev('input').is(':checked')) {
                                if ($(this).prev('input').val() === '__na__') {
                                    $(this).css('color', GM_getValue('N/A颜色：', 'green'));//默认标绿N/A项
                                }
                            }
                        });
                        //v3问卷/mystservices/v2new/getSurvey.asp?InstanceID=请求后获取数据：unsafeWindow.Open.stringToObject(OSMRenderingInit.toString().match(/(?<=OSMRendering_SurveyInstance_Preview\(){.+}(?=, document)/)[0])
                        $.get('/mystservices/v2new/getSurvey.asp?InstanceID=' + $('input#instanceID').val(), (data, status) => {
                            if (status === 'success') {
                                const qidmark = [];
                                $(data).find('nobr').each(function () {
                                    const score = $(this).text();
                                    if (score != '' && !score.includes('%')) {//排除空值与section总分
                                        const pts = score.split('/');
                                        if (Number(pts[0]) < Number(pts[1])) {
                                            const QidANS = $(this).parents('td.surveyquestioncell').prev().find('div').attr('id');
                                            qidmark.push(QidANS);
                                        }
                                    }
                                });
                                for (let q of qidmark) {
                                    $('div#' + q).find('span.surveyansweroption').css('color', GM_getValue('扣分颜色：', 'red'));//默认标红扣分项
                                }
                            }
                        });

                    } else {
                        markScore(scoreData);
                    }
                });
                const check = checkDayofWeek();
                if (check.isWrong) $('div#Q' + check.qid + 'ANS').find('span.surveyansweroption').css('color', GM_getValue('扣分颜色：', 'red'));
                markDayofWeek(check.isWrong, check.ele);
            }
        }
    }

    //检查所选星期和日期是否不一致
    function checkDayofWeek() {
        const qtx = ['星期', 'Day of the week', 'Day of the Week', 'Day of week', 'Day 星期', '周几', ' 星期'];//lee问卷[ID:1316]的星期题前有空格
        const atx = ['星期一', 'Monday'];
        let isWrong, ele, qid, start;
        $('span.surveyquestion').each(function () {
            for (let q of qtx) if ($(this).text().startsWith(q)) ele = $(this);
        });
        if (ele) qid = ele.parents('a.surveyquestionnobreak').attr('name').replace('qstn', '');
        if (qid) {
            const t = $('input[name=HEAD_DATE]').val().split('-');
            if (t.length === 3) {
                const day = new Date(t[0], t[1] - 1, t[2]).getDay();
                const ans = unsafeWindow.sm_getmultipleanswer(qid);
                for (let a of atx) if ($('input#' + qid + 'R1').next('span').text().startsWith(a)) start = 1;
                if (start && !day && day + 7 != ans) isWrong = 1;//如星期一开头&&应为星期日&&0+7!=7
                if (start && day && day != ans) isWrong = 1;
                if (!start && day + 1 != ans) isWrong = 1;
            }
        }
        return { isWrong: isWrong, qid: qid, ele: ele };
    }

    //标记星期是否正确
    function markDayofWeek(isWrong, ele) {
        if (!ele) return;
        if (isWrong) {
            ele.before('<b id=dayofweek style=color:red>×</b>');
        } else {
            ele.before('<b id=dayofweek style=color:green>√</b>');
        }
    }

    //标记每题分数且动态更新
    function markScore(scoreData) {
        const colorDe = GM_getValue('扣分颜色：', 'red');
        const colorNa = GM_getValue('N/A颜色：', 'green');
        const Q2A = handleScoreData(scoreData);
        const getmultipleanswer = unsafeWindow.sm_getmultipleanswer;
        for (let qid in Q2A) {
            const a = $(`a[name=qstn${qid}]`);
            const arrSelPos = getmultipleanswer(qid).split(',');
            if (arrSelPos[0] === '__na__') arrSelPos[0] = '0';
            const score = calculateScore(arrSelPos, Q2A[qid]);
            const title =
                '(起始得分)StartingPoints: ' + Q2A[qid].StartingPoints +
                '\n(最小得分)MeasureMin: ' + Q2A[qid].LimitMeasureMinimum +
                '\n(最大得分)MeasureMax: ' + Q2A[qid].LimitMeasureMaximum +
                '\n(固定分母)PointsPossible: ' + Q2A[qid].CustomPointsPossible;
            const bCss = { fontWeight: 'bold' };
            if (score[0] < score[1]) bCss.color = colorDe;
            else if (arrSelPos[0] === '0') bCss.color = colorNa;
            a.find('span.surveyansweroption').css('color', bCss.color);
            $(`<td id=pts valign=top>${score.join('/')}</td>`).css(bCss).attr('title', title)
                .appendTo(a.find('table.surveyquestiontable>tbody>tr'));
            for (let pos in Q2A[qid].Answer) {
                const ans = Q2A[qid].Answer[pos];
                if (ans.Measure !== null && !Q2A[qid].IsShowMeasure) {
                    const ansObj = $(`#${qid}R${pos}`);
                    if (ansObj.length === 0) continue;
                    let toAppend;
                    if (ansObj.is('input')) toAppend = ansObj.parent();
                    if (ansObj.is('option')) toAppend = ansObj;
                    toAppend.append(`<span id=pts> (${ans.Measure} pts)</span>`);
                }
            }
            a.find('label,select').on('change.updatePts', () => {
                const arrSelPos = getmultipleanswer(qid).split(',');
                if (arrSelPos[0] === '__na__') arrSelPos[0] = '0';
                const score = calculateScore(arrSelPos, Q2A[qid]);
                const css = { color: '' };
                if (score[0] < score[1]) css.color = colorDe;
                else if (arrSelPos[0] === '0') css.color = colorNa;
                a.find('span.surveyansweroption,select.surveyDropdown').css(css);
                a.find('td#pts').text(score.join('/')).css(css);
            });
        }
    }

    //动态标记每题分数-V3问卷
    function markScoreV3() {
        const OSM = unsafeWindow.OSM;
        const objName_AS = OSM.Survey.get('protoSurveyPos').map(e => e.object?.get('answerSet')?.objectNameFull).filter(i => i);
        objName_AS.forEach(as => {
            const objName = as.split('.')[0];
            const scoreObj = OSM.Survey.get('pointsManager').get(objName) || { pts: null, ptsOf: null };
            const statusColor = getScoreStatusColor(scoreObj, OSM.Survey[objName]);
            const scoreDiv = $(`<div class=osmWeb-question-score>${Object.values(scoreObj).join(' / ')}</div>`).css('color', statusColor).attr(
                'title',
                '(起始得分)startingPoints: ' + OSM.Survey[objName].get('answerSet').get('startingPoints') +
                '\n(最小得分)limitMinMeasure: ' + OSM.Survey[objName].get('answerSet').get('limitMinMeasure') +
                '\n(最大得分)limitMaxMeasure: ' + OSM.Survey[objName].get('answerSet').get('limitMaxMeasure') +
                '\n(固定分母)forcedMaxMeasure: ' + OSM.Survey[objName].get('answerSet').get('forcedMaxMeasure')
            );

            $('div#question_' + OSM.Survey[objName].get('uniqueID')).before(scoreDiv)
                .parent()[0].addClass('osmWeb-question-showScore');
            $('div#answerSet_' + OSM.Survey[objName].get('answerSet').get('uniqueID')).find('div.osmWeb-answer').css('color', statusColor);
        });
        OSM.Survey.addEventListenersToElements(objName_AS, 'onInputChange', function updatePts(evtObj) {
            const objName = evtObj.target.objectNameFull.split('.')[0];
            console.log(objName);
            const scoreObj = calculateScoreV3(objName);
            const statusColor = getScoreStatusColor(scoreObj, OSM.Survey[objName]);
            $('div#question_' + OSM.Survey[objName].get('uniqueID')).prev('div.osmWeb-question-score').text(Object.values(scoreObj).join(' / ')).css('color', statusColor);
            $('div#answerSet_' + OSM.Survey[objName].get('answerSet').get('uniqueID')).find('div.osmWeb-answer').css('color', statusColor);
        });
    }

    //计算分数-V3问卷
    function calculateScoreV3(objName) {
        const OSM = unsafeWindow.OSM;
        const answerSelectedArr = OSM.Survey[objName].getAnswers().split(',');
        //empty answer
        if (answerSelectedArr[0] === '') return { pts: null, ptsOf: null };
        //noMeasure answer
        let [pts, ptsOf] = [null, null];
        for (let a of answerSelectedArr) {
            const measure = OSM.Survey[objName][a].get('measure');
            if (measure !== null) pts += measure;
        }
        if (pts === null) return { pts: null, ptsOf: null };
        //normal answer
        const answerSetObj = OSM.Survey[objName].get('answerSet');
        const answerSetArr = [];
        for (let i = 0; i < answerSetObj.get('answers').count(); i++) answerSetArr.push(answerSetObj.get('answers')[i].keys[0]);
        const answerSetProp = {};
        ['isMultipleSelection', 'startingPoints', 'limitMinMeasure', 'limitMaxMeasure', 'forcedMaxMeasure'].forEach(prop => { answerSetProp[prop] = answerSetObj.get(prop); });
        if (answerSetProp.isMultipleSelection) {
            for (let as of answerSetArr) ptsOf += OSM.Survey[objName][as].get('measure');
        } else {
            for (let as of answerSetArr) {
                const measure = OSM.Survey[objName][as].get('measure');
                if (measure !== null && measure > ptsOf) ptsOf = measure;
            }
        }
        pts += answerSetProp.startingPoints;
        ptsOf += answerSetProp.startingPoints;
        if (answerSetProp.limitMinMeasure !== null && answerSetProp.limitMinMeasure > pts) pts = answerSetProp.limitMinMeasure;
        if (answerSetProp.limitMaxMeasure !== null && answerSetProp.limitMaxMeasure < pts) pts = answerSetProp.limitMaxMeasure;
        if (answerSetProp.forcedMaxMeasure !== null) ptsOf = answerSetProp.forcedMaxMeasure;
        return { pts: pts, ptsOf: ptsOf };
    }

    //根据分数判断标记颜色
    function getScoreStatusColor(scoreObj, questionObj) {
        const colorMap = {
            fu: '',
            de: GM_getValue('扣分颜色：', 'red'),
            na: GM_getValue('N/A颜色：', 'green')
        };
        if (scoreObj.pts < scoreObj.ptsOf) return colorMap.de;
        if (scoreObj.ptsOf === null && questionObj.getAnswers(0, 1).map(i => i.get('text').get('text')).join() === 'N/A') return colorMap.na;
        else return colorMap.fu;
    }

    //卸载扣分标记
    function unMARKQUESTION() {
        if (document.location.href.includes('alias=survey.view')) {
            if (unsafeWindow.OSM) {
                unsafeWindow.surveyRender_observer.disconnect();
                unsafeWindow.OSM.Survey.get('protoSurveyPos').map(e => e.object?.get('answerSet')).filter(i => i).forEach(as => {
                    as.removeEventListenerByReference('onInputChange', as.get('eventListeners').onInputChange?.userDefined.filter(f => f.name === 'updatePts')[0]);
                });
                $('div.osmWeb-answer').css('color', '');
                $('div.osmWeb-question-score').remove();
                $('div.osmWeb-question-showScore').each(function () { this.removeClass('osmWeb-question-showScore'); });
            } else {
                $('span.surveyansweroption').css('color', '');
                $('b#dayofweek,#pts').remove();
                $('label,select').off('change.updatePts');
            }
        }
    }
    /*扣分标记*/


    /*4:评论编辑*/
    function COMMENTEDIT() {
        if (document.location.href.includes('alias=survey.view')) {
            if (!$('button#saveSurveyBottom').length) return;//如无保存按钮不运行
            if (unsafeWindow.updrowH) $('textarea.surveycomment').each(function () { unsafeWindow.updrowH(this); });//等页面自身执行到调整评论框高度过于缓慢
            $('<div id=commentEdit title=评论编辑>').appendTo($('body')[0])
                .css({
                    position: 'fixed', zIndex: 1e4 + 1,
                    right: '30px', bottom: '80px', height: '25px', width: '25px',
                    background: '#808080'
                });
            //插入图标
            $('<img src=/images/icons/menu/x32/survet.png>').appendTo('div#commentEdit').css({ width: 'inherit', transform: 'scale(0.8)' });
            //插入操作界面并赋值为ce
            $('<div id=commentFunc title>').appendTo('div#commentEdit')
                .css({ position: 'fixed', right: '60px', bottom: '50px' }).hide()
                .on('click', e => {
                    e.stopPropagation();//阻止子元素执行父元素click事件
                });
            const ce = $('div#commentFunc');
            $('div#commentEdit').on('click', function () {
                commentEditSwitch(ce);
            });
            //提示开关
            $('<b id=hint style=cursor:pointer>【点击获取提示】</b>').appendTo(ce)
                .on('click', function () {
                    hintSwitch($(this));
                });
            //评论匹配与替换
            $('<button type=button id=replaceAll class=surveyBottomButton>一键替换</button>').appendTo(ce)
                .before('<textarea id=find placeholder=匹配内容 style=font-size:11px></textarea><b id=commentMark style=cursor:pointer title=切换所有评论框标红状态>↓↓↓</b><textarea id=replace placeholder=替换内容 style=font-size:11px></textarea>')
                .before('<b id=findNum>#</b>');
            $('textarea#find,textarea#replace').on('keydown', e => {
                e.stopPropagation();//阻止页面自带keydown事件修改textarea的class值
            }).on('input', function () {
                commentMatch(ce);
            });
            $('b#commentMark').on('click', () => {
                commentMark(ce);
            });
            $('button#replaceAll').on('click', () => {
                execReplace(ce);
            });
            //首字母大写
            $('<button type=button id=initialUpper class=surveyBottomButton>首字母大写</button>').appendTo(ce)
                .on('click', () => {
                    initialUpper(ce);
                });
            //评论翻译
            $(`<button type=button id=commentTrans class=surveyBottomButton title=Deel翻译>评论翻译</button>
               <select id=toLang>
                 <option value=EN>→英文</option>
                 <option value=JA>→日文</option>
                 <option value=ZH>→中文</option>
               </select>`).appendTo(ce);
            ce.find('button#commentTrans').on('click', () => {
                commentTranslate($('select#toLang option:selected').val());
            });
            ce.children().css({ display: 'block', textAlign: 'center', margin: '5px auto' });
        }
    }

    //评论替换开关
    function commentEditSwitch(ce) {
        if (ce.css('display') === 'none') {
            ce.show();
            commentMatch(ce);
        } else {
            ce.hide();
            markMatchComment(0, $('textarea.surveycomment,textarea.active,.osmWeb-comment'));
        }
    }

    //插入或移除提示
    function hintSwitch(hs) {
        if (hs.children().length) {
            hs.text('【点击获取提示】').children().remove();
        } else {
            hs.text('【点击关闭提示】')
                .append('<a class=mailboxlink target=_blank href=https://tool.oschina.net/uploads/apidocs/jquery/regexp.html>匹配支持正则表达式</a>')
                .append('<a class=mailboxlink target=_blank href=https://c.runoob.com/front-end/854>正则表达式测试</a>')
                .append(
                    `<ol>
                    <li>正则实例：[。|.]$ 可匹配末尾处中英文句号；^[a-z] 可匹配开头处小写字母；甲|乙|丙 可匹配甲或乙或丙</li>
                    <li>可当作一般替换使用，如需替换一些特殊字符(\^$*+?.等，参照第一个链接中所列字符)，请在前面使用\\标记转义，避免识别为正则表达</li>
                    <li>（V2问卷）评论框激活后按Ctrl可切换评论框是否标红，标红的评论框将被排除在修改范围之外，点击两框间的↓↓↓可快速切换全部评论框标红与否</li>
                </ol>
                `);
            hs.children().css('display', 'block').on('click', e => {
                e.stopPropagation();
            });
            hs.find('li').css({ textAlign: 'left', width: '200px' });
        }
    }

    //判断此评论框是否不应被修改
    function isHide(ele) {
        // const qvState = unsafeWindow.sm_questionvisibility_state;
        // if (qvState && qvState[ele.name.replaceAll('C', '')] === 'hide' || ele.style.display === 'none') {
        if (
            ele.style.display === 'none' ||
            ele.disabled ||
            ele.readOnly ||
            $(ele).parents().filter(function () { return getComputedStyle(this).display === 'none'; }).length
        ) {
            return 1;
        } else {
            return 0;
        }
    }

    //切换所有评论框标记与否
    function commentMark(ce) {
        $('textarea.surveycomment,textarea.active').each(function () {
            if (isHide(this)) return;
            if ($(this).attr('class') === 'active') {
                $(this).attr('class', 'surveycomment');
            } else {
                $(this).attr('class', 'active');
            }
        });
        commentMatch(ce);
    }

    //即时标记匹配到的评论框，预览替换后内容
    function commentMatch(ce) {
        const f = getFind(ce);
        let n = 0;
        markMatchComment(0, $('textarea.active'));
        $('textarea.surveycomment,.osmWeb-comment').each(function () {
            if (isHide(this)) return;
            const rc = getReplacedComment(ce, f, $(this).val());
            if (rc !== false) {
                markMatchComment(1, $(this), rc);
                n++;
            } else {
                markMatchComment(0, $(this));
            }
        });
        ce.find('b#findNum').text('#=' + n);
    }

    //匹配评论框标记处理
    function markMatchComment(hasText, ele, text, isBefore) {
        ele.each(function () {
            if (hasText) {
                text = isBefore ? '之前为：\n' + text : '替换为：\n' + text;
                $(this).css('background', 'lightgrey').attr('title', text);
                if ($(this).prev().attr('id')) {
                    $(this).prev('div#mark').show();
                } else {
                    $(this).before('<div id=mark>^^</div>');
                }
            } else {
                $(this).css('background', '').attr('title', '');
                $(this).prev('div#mark').hide();
            }
        });
    }

    //判断并返回匹配值与类型
    function getFind(ce) {
        let find, isRE;
        try {//若不是正则表达式，按普通字符处理
            find = new RegExp(ce.find('textarea#find').val(), 'gm');
            isRE = 1;
        } catch (e) {
            find = ce.find('textarea#find').val();
        }
        return [find, isRE];
    }

    //判断并返回替换后评论或空
    function getReplacedComment(ce, f, text) {
        const index = f[1] ? text.search(f[0]) : text.indexOf(f[0]);//search只接受正则 : indexOf只接受字符
        if (index >= 0) {
            return text.replaceAll(f[0], ce.find('textarea#replace').val());
        } else {
            return false;
        }
    }

    //进行评论替换
    function execReplace(ce) {
        const f = getFind(ce);
        $('textarea.surveycomment,.osmWeb-comment').each(function () {
            if (isHide(this)) return;
            const text = $(this).val();
            const rc = getReplacedComment(ce, f, text);
            if (rc !== false) {
                markMatchComment(1, $(this), text, 1);//记录修改前内容
                $(this).val(rc).trigger('blur');
                unsafeWindow.updrowH(this);//调用页面自带函数来调整评论框高度
            }
        });
    }

    //首字母大写
    function initialUpper(ce) {
        let n = 0;
        $('textarea.surveycomment,.osmWeb-comment').each(function () {
            if (isHide(this)) return;
            const match = new Set($(this).val().match(/(^|\.|\?|!)("|'|) *[a-z]/gm));
            if (match.size) {
                let text = $(this).val();
                markMatchComment(1, $(this), text, 1);//记录大写前内容
                for (let m of match) {
                    const r = new RegExp(`(^|\\.|\\?|!)("|'|) *` + m, 'gm');
                    text = text.replaceAll(r, m.toUpperCase());
                }
                $(this).val(text).trigger('blur');
                n++;
            } else {
                markMatchComment(0, $(this));
            }
        });
        ce.find('b#findNum').text('#=' + n);
    }

    //调用翻译进行评论翻译
    async function commentTranslate(toLang) {
        //await translate_baidu_startup();
        $('textarea.surveycomment,.osmWeb-comment').each(async function () {
            if (isHide(this)) return;
            if ($(this).val() && !$(this).next().is('button.attachmentBtn')) {
                $(this).after('<textarea id=trans style=overflow:hidden rows=' + $(this).attr('rows') + ' cols=' + $(this).attr('cols') + '>')
                    .after('<button type=button class=attachmentBtn style="display:block;height:1.5em;width:1.5em;margin:5px 0">↑</button>');
                $(this).next('button').on('click', function () {
                    const prev = $(this).prev().val();
                    const next = $(this).next().val();
                    $(this).prev().val(prev + '\n\n' + next).trigger('blur');
                    unsafeWindow.updrowH($(this).prev()[0]);
                    $(this).next().remove();
                    $(this).remove();
                });
            }
            if ($(this).val()) {
                //const fromLang= toLang==='f→j'? 'cht' : null;
                //toLang= toLang==='f→j'? 'zh' : toLang;
                const translated = await translate_deepl(toLang, $(this).val());
                $(this).next().next('textarea').val(translated);
                unsafeWindow.updrowH($(this).next().next('textarea')[0]);//调用页面自带函数来调整评论框高度
            }
        });
        $('textarea#trans').on('keydown', e => {
            e.stopPropagation();//阻止页面自带keydown事件修改textarea的class值
        });
    }

    //Deepl翻译 参考https://greasyfork.org/scripts/378277
    function getTimeStamp(iCount) {
        const ts = Date.now();
        if (iCount !== 0) {
            iCount = iCount + 1;
            return ts - (ts % iCount) + iCount;
        } else {
            return ts;
        }
    }

    async function translate_deepl(toLang, raw) {
        const id = (Math.floor(Math.random() * 99999) + 100000) * 1000;
        const data = {
            jsonrpc: '2.0',
            method: 'LMT_handle_texts',
            id,
            params: {
                splitting: 'newlines',
                lang: {
                    source_lang_user_selected: 'auto',
                    target_lang: toLang,
                },
                texts: [{
                    text: raw,
                    requestAlternatives: 3
                }],
                timestamp: getTimeStamp(raw.split('i').length - 1)
            }
        };
        let postData = JSON.stringify(data);
        if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
            postData = postData.replace('"method":"', '"method" : "');
        } else {
            postData = postData.replace('"method":"', '"method": "');
        }
        const options = {
            method: 'POST',
            url: 'https://www2.deepl.com/jsonrpc',
            data: postData,
            headers: {
                'Content-Type': 'application/json',
                'Host': 'www.deepl.com',
                'Origin': 'https://www.deepl.com',
                'Referer': 'https://www.deepl.com/'
            },
            anonymous: true,
            nocache: true,
        };
        return await BaseTranslate('Deepl翻译', raw, options, res => JSON.parse(res).result.texts[0].text);
    }

    //异步请求包装工具
    async function PromiseRetryWrap(task, options, ...values) {
        const { RetryTimes, ErrProcesser } = options || {};
        let retryTimes = RetryTimes || 5;
        const usedErrProcesser = ErrProcesser || (err => { throw err; });
        if (!task) return;
        while (true) {
            try {
                return await task(...values);
            } catch (e) {
                if (!--retryTimes) {
                    console.log(e);
                    return usedErrProcesser(e);
                }
            }
        }
    }

    async function BaseTranslate(name, raw, options, processer) {
        const toDo = async () => {
            let tmp;
            try {
                const data = await Request(options);
                tmp = data.responseText;
                const result = await processer(tmp);
                if (result) window.sessionStorage.setItem(name + '-' + raw, result);
                return result;
            } catch (e) {
                throw {
                    responseText: tmp,
                    err: e
                };
            }
        };
        return await PromiseRetryWrap(toDo, { RetryTimes: 3, ErrProcesser: () => "翻译出错" });
    }

    function Request(options) {
        return new Promise((reslove, reject) => GM_xmlhttpRequest({ ...options, onload: reslove, onerror: reject }));
    }

    //卸载评论编辑
    function unCOMMENTEDIT() {
        if ($('div#commentEdit').length) $('div#commentEdit').remove();
    }
    /*评论编辑*/


    /*5:验证输出*/
    function VERIFYEXPORT() {
        if (document.location.href.includes('alias=smngr.surveyexplorer') && $('div#filterdiv').length) {
            $('div#filterdiv').before('<button type=button id=verifyExport class="rm-btn rm-btn-default">验证输出勾选的报告</button>');
            $('button#verifyExport').css({ margin: '10px 0px', display: 'block' }).on('click', () => {
                verifyExportAll();
            });
        }
    }

    //验证输出全部报告
    function verifyExportAll() {
        const apply = confirm('请确认是否要验证输出当前页面勾选的所有报告\n（电脑配置低请勿一次性输出过多报告）');
        if (apply) {
            $('table#reporttable.sticky-enabled>tbody>tr').each(function () {
                if ($(this).css('display') != 'none' && $(this).find('input:checkbox').eq(0).is(':checked')) {
                    const a = $(this).find('td>a.mailboxlink').eq(0);
                    const src = a.attr('href').replace('document.asp?alias=survey.view&', 'importmngr/ImportSurveys/ImportSurveysFrame.asp?');
                    const iframe = document.createElement('iframe');
                    iframe.src = src;
                    iframe.style = 'display:none';//'height:80px;width:250px';
                    a.after(iframe).after('<div style=color:black;width:max-content>...报告加载中(1/3)...</div>');
                    iframe.onload = function () {
                        if (this.src.includes('ImportSurveysFrame.asp')) {
                            const doc = $(this).contents();
                            //doc.find('div#addInfo,div#menu,div#pathContainer').remove();
                            if (doc.find('input#scrverN').is(':checked') && doc.find('input#questVerN').is(':checked')) {//前2点均为否时才进行操作
                                $(this).prev('div').text('...执行上线中(2/3)...');
                                doc.find('input#scrverY').click();
                                doc.find('input#questVerY').click();
                                doc.find('button#save').click();
                            } else if (this.contentWindow.surveyImportSurveySubmitted) {
                                $(this).prev('div').text('√报告已成功执行上线(3/3)').css('background', 'lightgreen');
                                $(this).remove();
                            } else {
                                $(this).prev('div').text('!!!报告原本已处于上线状态').css('background', 'orange');
                                $(this).remove();
                            }
                        }
                    };
                }
            });
            alert('请耐心等待所有报告加载完成，显示绿色的上线成功提示后，再刷新页面检查是否全部验证输出成功');
        }
    }

    //卸载验证输出
    function unVERIFYEXPORT() {
        if ($('button#verifyExport').length) $('button#verifyExport').remove();
    }
    /*验证输出*/


    /*6:定制汇总*/
    function CUSTOMROLLUP() {
        if (document.location.href.includes('alias=clientaccess.customrollups')) {
            if ($('table.reporttable,table.incCrossTabTableClass').length) {
                const cr = document.createElement('div');
                cr.id = 'CRfunction';
                $('div.q2r_tableCaptionDiv,table.incCrossTabTableClass').before(cr);
                //复制表格
                $('<button type=button id=copyBtn>复制表格</button>').appendTo(cr)
                    .on('click', function () {
                        if ($(this).next('select#percentSign').val() === '+%') {//给Pivot table形式的数据后添加%
                            $('table.incCrossTabTableClass td.incCrossTabTableBodyValuesClass').each(function () {
                                if (!$(this).attr('rowspan')) $(this).text($(this).text().replace('%', '') + '%');
                            });
                        } else {
                            $('table.incCrossTabTableClass td.incCrossTabTableBodyValuesClass').each(function () {
                                if (!$(this).attr('rowspan')) $(this).text($(this).text().replace('%', ''));
                            });
                        }
                        const table = $(cr).parent().find('table#reporttable.sticky-enabled,table.incCrossTabTableClass');
                        execCopy($(this), table[0]/*table.children('thead')[0].innerText.replace(/\n(?=\t|\n)/g,'')+table.children('tbody')[0].innerText*/);
                    });
                $(`<select id=percentSign title="此选项仅针对Pivot table（自定义表格）界面下，复制时为分数后添加%，在Tabular（默认表格）界面下无效">
                    <option value=+%>分数后+%</option>
                    <option value=无>无</option>
                </select><br>`).appendTo(cr);
                //精确pts%
                $('<button type=button id=ptsPercPlus title=根据Pts和PtsOf列精确计算pts%值>精确pts%</button>').appendTo(cr)
                    .on('click', function () {
                        const td = $(cr).parent().find('table#reporttable.sticky-enabled>thead>tr>td');
                        let pts, ptsOf;
                        for (let i = 0; i < td.length; i++) {
                            if (td.eq(i).text() === 'Pts') pts = i;
                            if (td.eq(i).text() === 'Pts Of') ptsOf = i;
                        }
                        if (pts && ptsOf) {
                            $('#reporttable.sticky-enabled tr').each(function () {
                                const last = $(this).children('td:last-child');
                                if (last.attr('class') !== 'ptsPercPlus') last.after(last.clone(true).attr('class', 'ptsPercPlus'));
                                const tar = $(this).children('td.ptsPercPlus');
                                if ($(this).attr('class') === 'persist-header') {
                                    tar.text('Pts%+');
                                } else {
                                    const score = $(this).children().eq(pts).children().text() / $(this).children().eq(ptsOf).children().text();//只取<span>中的数据
                                    const toFix = $(cr).children('select#toFixed').val();
                                    const toFixed = 10 ** toFix;
                                    tar.text((Math.round(score * 100 * toFixed) / toFixed).toFixed(toFix) + '%');
                                }
                            });
                            $(this).text('计算成功！');
                        } else {
                            $(this).text('缺少关键列！');
                        }
                        setTimeout(() => {
                            $(this).text('精确pts%');
                        }, 3e3);
                    });
                $('<select id=toFixed title=此选项对【精确pts%】和【选项统计】同时生效>').appendTo(cr);
                const sel = $(cr).children('select#toFixed');
                for (let i = 0; i < 6; i++) sel.append(`<option value=${i}>保留${i}位小数</option>`);
                sel.children().eq(1).prop('selected', true);
                //选项统计
                $('<button type=button id=answerDistribution title=根据QuestionText和AnswerText和#Surveys列统计各架构各题各选项数量和占比>选项统计</button>').appendTo(cr)
                    .on('click', function () {
                        const oTable = $(cr).parent().find('table#reporttable.sticky-enabled');
                        oTable.find('tbody>tr.ad').remove();
                        //获取各关键列位置及隐藏情况
                        const thtd = oTable.find('thead>tr>td');
                        let QText, AText, surveyNum;
                        const hideCol = [], colIndex = [];//QuestionText/AnswerText列中靠左的所有左侧的未隐藏列都将记录至colIndex并参与统计
                        for (let i = 0; i < thtd.length; i++) {
                            if (thtd.eq(i).text() === 'Question Text') QText = i;
                            else if (thtd.eq(i).text() === 'Answer Text') AText = i;
                            else if (thtd.eq(i).text() === '# Surveys') surveyNum = i;
                            else if (QText === undefined && AText === undefined && thtd.eq(i).css('display') != 'none') colIndex.push(i);
                            else if (thtd.eq(i).css('display') === 'none') hideCol.push(i);
                        }
                        if (QText >= 0 && AText >= 0 && surveyNum >= 0) {
                            //先显示可能被隐藏的关键列
                            const input = $('div#hideOption input');
                            if (input.length) for (let i of [QText, AText, surveyNum]) if (!input.eq(i + 1).is(':checked')) toggleCol(input.eq(i + 1).prop('checked', true)[0], oTable);
                            //开始统计
                            const AD = {};
                            oTable.find('tbody>tr').each(function () {
                                if (this.style.display === 'none') return;
                                const tbtd = $(this).children();
                                const Q = checkKey(AD, tbtd.eq(QText).text().trim());
                                let BUText = '';
                                for (let c of colIndex) BUText += tbtd.eq(c).text() + ';';
                                const BU = checkKey(Q, BUText);
                                const num = Number(tbtd.eq(surveyNum).children('span').text());
                                if (!BU.num) Object.defineProperty(BU, 'num', { value: 0, enumerable: false, writable: true });//将作为分母的num设为不可枚举
                                BU.num += num;
                                for (let a of tbtd.eq(AText).text().split(';')) {
                                    if (!BU[a]) BU[a] = 0;
                                    BU[a] += num;
                                }
                            });
                            //检测是否已加载选项并补充样本量为0的选项
                            const selectedQ = $('input[name=fieldForCheckingFilter]').val().match(/(?<=4:).+(?= 5:)/), QnA = {};
                            let selectedArr = [];
                            const PCmsFilterQuestion = $('select#PCmsFilterQuestionsSelectQuestion');
                            if (selectedQ) selectedArr = selectedQ[0].split('%2C');
                            else {
                                PCmsFilterQuestion.find('optgroup>option').filter(function () { return !this.value.includes(','); }).each(function () {
                                    selectedArr.push(this.value);
                                });
                            }
                            for (let s of selectedArr) {
                                const Q = PCmsFilterQuestion.find(`[value=${s}]`).text().trim();
                                QnA[Q] = [];
                                PCmsFilterQuestion.find(`[value*=_${s}_]`).each(function () {
                                    QnA[Q].push(this.innerText.trim().substr(1));//去除多余空格和前面的'-'
                                });
                                const QnA_Q = QnA[Q], AD_Q = AD[Q];//将缺少的选项赋值为0
                                for (let a in QnA_Q) for (let bu in AD_Q) if (!Object.keys(AD_Q[bu]).includes(QnA_Q[a])) AD_Q[bu][QnA_Q[a]] = 0;
                            }
                            //输出统计结果
                            for (let q in AD) {
                                for (let bu in AD[q]) {
                                    const buArr = bu.split(';');
                                    for (let a in AD[q][bu]) {
                                        let tr = '<tr class=ad>', n = 0;
                                        for (let i = 0; i < thtd.length; i++) {
                                            if (hideCol.includes(i)) tr += '<td style=display:none></td>';
                                            else if (colIndex.includes(i)) tr += `<td>${buArr[n++]}</td>`;
                                            else if (QText === i) tr += `<td>[AD] ${q} (${AD[q][bu].num})</td>`;
                                            else if (AText === i) tr += `<td>${a} (${AD[q][bu][a]})</td>`;
                                            else if (surveyNum === i) {
                                                const toFix = $(cr).children('select#toFixed').val();
                                                const toFixed = 10 ** toFix;
                                                tr += `<td>${(Math.round(AD[q][bu][a] / AD[q][bu].num * 100 * toFixed) / toFixed).toFixed(toFix)}%</td>`;
                                            }
                                            else tr += '<td></td>';
                                        }
                                        tr += '</tr>';
                                        oTable.find('tbody').append(tr);
                                    }
                                }
                            }
                            $(this).text('统计成功！');
                        } else {
                            $(this).text('缺少关键列！');
                        }
                        setTimeout(() => {
                            $(this).text('选项统计');
                        }, 3e3);
                    });
                //整体css调整
                $(cr).children('button').css({ margin: '5px', font: 'inherit' });
            }
        }
        if (document.location.href.includes('alias=client.analysiscustomrollups.3.0')) {
            unsafeWindow.customRollup_observer = new MutationObserver(function (mutationsList) {
                //for(let m of mutationsList) execBetterThead(m.target);
                for (let m of mutationsList) {
                    if (m.target.id === 'rollupTable' || m.target.id === 'pivotContainer') {
                        if ($(m.target).find('div#CRfunction').length > 0) continue;
                        const cr = $('<div id=CRfunction></div>');
                        $(m.target).find('div#smAnalysisCustomRollupsTableDiv,table.pvtTable').before(cr);
                        $('<button type=button id=copyBtn>复制表格</button>').appendTo(cr)
                            .on('click', function () {
                                const table = $(m.target).find('table#smReporttableTable,table.pvtTable');
                                execCopy($(this), table[0]/*table.children('thead')[0].innerText.replace(/\n(?=\t|\n)/g,'')+table.children('tbody')[0].innerText*/);
                            });
                    }
                    for (let i of m.addedNodes) if (i.id === 'rm-analysis-custom-rollups-main') return addLocationCustProp(i);
                }
            });
            unsafeWindow.customRollup_observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    function execCopy(button, ele) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(ele);
        selection.addRange(range);
        //if(button.prevAll('textarea').length===0) button.before('<textarea>');
        //button.prev('textarea').show();
        //button.prev('textarea').val(content).select();
        document.execCommand('copy') ? button.text('复制成功！') : button.text('复制失败...');
        //button.prev('textarea').hide();
        selection.removeAllRanges();
        setTimeout(() => {
            button.text('复制表格');
        }, 3e3);
    }

    function checkKey(obj, key) {
        if (!obj[key]) obj[key] = {};
        return obj[key];
    }

    function addLocationCustProp(ele) {
        const divs = $('div[data-group="Custom Properties"]').clone(true).attr('data-group', 'Location Custom Properties').each(function () {
            $(this).add($(this).children()).attr('title', this.title.replace('Custom Location Property ', 'vw_LocationPropertiesFromMystLocationProperties.CustLocationProperty'));
            $(this).find('input')[0].id += '-Loc';
            $(this).find('label')[0].textContent += '-Loc';
        });
        $('div[title="Location Country"]').after(divs);
    }

    //卸载定制汇总
    function unCUSTOMROLLUP() {
        if ($('div#CRfunction').length) $('div#CRfunction').remove();
        if (document.location.href.includes('alias=client.analysiscustomrollups.3.0')) {

        }
    }
    /*定制汇总*/


    /*7:报告存档*/
    function SURVEYSAVES() {
        if (unsafeWindow.OSM || !$('form#frmSurvey').length) return;
        if (document.location.href.includes('alias=survey.view')) {
            //插入操作界面并赋值为ssl
            $('<div id=surveySaves title=报告存档>').appendTo($('body')[0])
                .css({
                    position: 'fixed', 'zIndex': 1e4,
                    right: '30px', bottom: '110px', height: '25px', width: '25px',
                    background: '#808080'
                });
            $('<img src=/images/icons/menu/x16/KB-icon.png>').appendTo('div#surveySaves').css({ width: 'inherit', transform: 'scale(0.8)' });
            $('<div id=surveySavesList title>').appendTo('div#surveySaves')
                .css({ position: 'fixed', right: '60px', bottom: '50px', background: 'lightgrey' }).hide()
                .on('click', e => {
                    e.stopPropagation();//阻止子元素执行父元素click事件
                });
            const ssl = $('div#surveySavesList');
            ssl.append(`
            <div style=margin:5px>
                <button type=button id=Show class=rm-btn>预览</button>
                <button type=button id=Load class=rm-btn>读档</button>
                <button type=button id=Save class=rm-btn>存档</button>
                <button type=button id=Dele class=rm-btn>删除</button>
                <button type=button id=export class=rm-btn style=display:none>下载</button>
                <button type=button id=upload class=rm-btn style=display:none>上传
                    <input type=file accept=.csv style=display:none>
                </button>
            </div>
            <div id=tab style=margin:5px>
                <label><input type=radio name=tab value=autosaves checked>自动存档</label>
                <label><input type=radio name=tab value=selfsaves>手动存档</label>
            </div>
            <table cellpadding=5 style=margin:5px>
                <thead id=saves>
                    <tr>
                        <td></td>
                        <td>保存时间</td>
                        <td>问卷标题</td>
                        <td>店铺ID</td>
                        <td>报告ID</td>
                    </tr>
                </thead>
                <thead id=questions>
                    <tr>
                        <td><input type=checkbox name=questions checked></td>
                        <td>QID</td>
                        <td>题目</td>
                        <td>选项</td>
                        <td>评论</td>
                    </tr>
                </thead>
                <tbody id=autosaves></tbody>
                <tbody id=selfsaves></tbody>
                <tbody id=questions style=height:300px;overflow:auto></tbody>
            </table>
            `);
            ssl.find('thead,tbody').css('display', 'block');
            ssl.find('#selfsaves,#questions').hide();
            //存档列表开关
            $('div#surveySaves').on('click', function () {
                if (ssl.css('display') === 'none') {
                    ssl.show();
                    refreshList(ssl);
                } else {
                    ssl.hide();
                }
            });
            //按钮功能
            ssl.find('button#Show').on('click', () => {
                showData(ssl);
            });
            ssl.find('button#Load').on('click', () => {
                loadData(ssl);
            });
            ssl.find('button#Save').on('click', () => {
                saveData(ssl, 'selfsaves');
            });
            ssl.find('button#Dele').on('click', () => {
                deleteData(ssl);
            });
            ssl.find('button#export').on('click', () => {
                exportData(ssl);
            });
            ssl.find('button#upload').on('click', function () {
                uploadData(ssl, this.firstElementChild);
            });
            ssl.find('button#upload>input').on('change', function () {
                const reader = new FileReader();
                reader.readAsText(this.files[0], 'utf8');//input.files[0]为第一个文件
                reader.onload = () => {
                    uploadCsvArr(ssl, CSVToArray(reader.result), this.saveInfo);
                    this.value = null;
                };
            });
            //切换存档列表页
            ssl.find('div#tab').on('click', function () {
                ssl.find('input[name=saves]:checked').prop('checked', false);//将存档的选中状态重置
                const checked = $(this).find('input:checked').val();
                const unchecked = checked === 'autosaves' ? 'selfsaves' : 'autosaves';
                $(this).parent().find('tbody#' + unchecked).hide();
                $(this).parent().find('tbody#' + checked).show();
                refreshList(ssl, checked);
                theadWidth(ssl.find('thead#saves'), ssl.find('tbody#' + checked));
            });
            //预览界面一键勾选与取消
            ssl.find('thead#questions input').on('click', function () {
                if ($(this).is(':checked')) {
                    $(this).parents('table').find('input[name=questions]').prop('checked', true);
                } else {
                    $(this).parents('table').find('input[name=questions]').prop('checked', false);
                }
            });
            //监听表单内点击和评论失焦触发存档事件
            let Form = $('form#frmSurvey').serialize();
            $('form#frmSurvey').on('change.autosave', () => {
                Form = autoSave(ssl, Form);
            });
            /*$('textarea.surveycomment,textarea.active').on('blur.autosave',()=>{
                Form=autoSave(ssl,Form);
            });*/
        }
    }

    //表单变化时自动存档
    function autoSave(ssl, prvForm) {
        const curForm = $('form#frmSurvey').serialize();
        if (prvForm != curForm) {//如表单数据改变
            saveData(ssl, 'autosaves');
        }
        return curForm;
    }

    //刷新存档列表
    function refreshList(ssl, fromSave) {
        if (ssl.css('display') === 'none') return;//界面隐藏时不刷新
        if (!fromSave) fromSave = ssl.find('input[name=tab]:checked').val();//无参数自动判断当前页
        const curChecked = ssl.find('input[name=saves]:checked').parent('td').next().text();//记录当前选中存档
        ssl.find('tbody#' + fromSave).empty();
        const saves = GM_getValue(fromSave, {});
        const k = Object.keys(saves);
        if (k.length) {
            for (let i in k) {
                const line = i % 2 === 1 ? 'reporttable_odd' : 'reporttable_even';
                ssl.find('tbody#' + fromSave).prepend(
                    `<tr class=${line}>
                      <td><input type=radio name=saves></td>
                      <td>${k[i]}</td>
                      <td>${saves[k[i]].surveytitle}</td>
                      <td>${saves[k[i]].formhead.LOCATION}</td>
                      <td>${saves[k[i]].surveyid}</td>
                    </tr>`
                );
                if (curChecked === k[i]) ssl.find('tbody#' + fromSave).children('tr:first').find('input').prop('checked', true);//还原存档选中状态
            }
            //如为当前存档页则同步表头宽度
            if (ssl.find('input[name=tab]:checked').val() === fromSave) {
                theadWidth(ssl.find('thead#saves'), ssl.find('tbody#' + fromSave));
            }
        } else {
            const w = getComputedStyle(ssl.find('tbody#' + fromSave)[0]).width;
            ssl.find('tbody#' + fromSave).append('<td style=width:' + w + ';text-align:center>无数据！</td>');
        }
    }

    //预览
    function showData(ssl) {
        if (ssl.find('thead#questions').css('display') === 'none') {
            const [save, time, saves, fromSave] = checkSave(ssl);
            if (!save) return;
            const head = save.formhead;
            for (let h in head) {
                const line = 'reporttable_odd';
                ssl.find('tbody#questions').append(
                    `<tr class=${line}>
                      <td><input type=checkbox name=questions></td>
                      <td colspan=2>${h}</td>
                      <td colspan=2>${head[h]}</td>
                    </tr>`
                );
                const qData = getQuestionData(h);
                if (qData === undefined) ssl.find('tbody#questions').children(':last').children().eq(1).css('border', '1px solid red').attr('title', '无此题');
                else if (qData !== head[h]) ssl.find('tbody#questions').children(':last').children(':last').css('border', '1px solid red').attr('title', qData);
            }
            const body = save.formbody;
            for (let b of body) {
                const qData = getQuestionData(b.qid);
                const isDiff = {};
                if (qData !== undefined) [isDiff.ans, isDiff.cmt] = [qData.ans === b.ans ? false : true, qData.cmt === b.cmt ? false : true];
                if (b.ans === undefined) b.ans = '×';
                if (b.cmt === undefined) b.cmt = '×';
                const line = 'reporttable_even';
                ssl.find('tbody#questions').append(
                    `<tr class=${line}>
                      <td><input type=checkbox name=questions></td>
                      <td>${b.qid}</td>
                      <td>${b.qtx}</td>
                      <td>${b.ans}</td>
                      <td>${b.cmt.replace(/\n/g, '<br>')}</td>
                    </tr>`
                );
                if (qData === undefined) {
                    ssl.find('tbody#questions').children(':last').children().eq(1).css('border', '1px solid red').attr('title', '无此题');
                    continue;
                }
                if (isDiff.ans) ssl.find('tbody#questions').children(':last').children().eq(3).css('border', '1px solid red').attr('title', qData.ans);
                if (isDiff.cmt) ssl.find('tbody#questions').children(':last').children().eq(4).css('border', '1px solid red').attr('title', qData.cmt);
            }
            if (ssl.find('thead#questions input').is(':checked')) {
                ssl.find('tbody#questions input').prop('checked', true);
            } else {
                ssl.find('tbody#questions input').prop('checked', false);
            }
            ssl.find('button#Show').text('←');
            ssl.find('button#Save,button#Dele,div#tab,tbody[id$=saves],#saves').hide();
            ssl.find('table #questions').show();
            if (fromSave === 'selfsaves') ssl.find('button#export,button#upload').show();
            theadWidth(ssl.find('thead#questions'), ssl.find('tbody#questions'));//在显示后同步宽度，隐藏时会默认为auto
        } else {
            ssl.find('table #questions,button#export,button#upload').hide();
            ssl.find('tbody#questions').empty();
            ssl.find('button#Show').text('预览');
            ssl.find('button#Save,button#Dele,div#tab,#saves,tbody#' + $('input[name=tab]:checked').val()).show();
        }
    }

    //读档
    function loadData(ssl) {
        const [save] = checkSave(ssl);
        if (!save) return;
        //如当前报告id与存档报告id不相等，询问是否执行
        if (save.surveyid != $('input#instanceID').val()) {
            //将文本，是否确认，确认后执行的方法传给feedback(ssl,text,ifConfirm,yesFunc)生成确认提示
            feedback(
                ssl,
                '报告ID不同，仅会修改当前报告中和存档中相匹配的题目，是否继续？',
                1,
                () => { execLoadData(ssl, save); }
            );
        } else {
            execLoadData(ssl, save);
        }
    }

    //执行读档
    function execLoadData(ssl, save) {
        const qidArr = [];
        if (ssl.find('thead#questions').css('display') != 'none') {
            if (ssl.find('input[name=questions]:checked').length === 0) {
                feedback(ssl, '请勾选题目！');
                return;
            }
            ssl.find('input[name=questions]:checked').each(function () {
                qidArr.push($(this).parent().next().text());
            });
        }
        const setAnswer = (qid, ans) => {
            unsafeWindow.sm_setanswer(qid, '');
            unsafeWindow.sm_setmultipleanswer(qid, ans);
            $(`a[name=qstn${qid}]`).find('label,select').trigger('change');
        };
        const setComment = unsafeWindow.sm_setcomment;
        const head = save.formhead;
        let count = 0;
        for (let h in head) {
            if (qidArr.length && !qidArr.includes(h)) continue;//仅执行勾选项
            if (getQuestionData(h) === head[h]) continue;
            if (h === 'DATE') {
                if (head[h] === '') {
                    $('select#dsYear').children(':first').prop('selected', true);
                    $('select#dsMonth').children(':first').prop('selected', true);
                    $('select#dsDay').children(':first').prop('selected', true);
                } else {
                    const date = head[h].split('-').map(i => Number(i));
                    $('select#dsYear').children('[value=' + date[0] + ']').prop('selected', true);
                    $('select#dsMonth').children('[value=' + date[1] + ']').prev().prop('selected', true);
                    $('select#dsDay').children('[value=' + date[2] + ']').prev().prop('selected', true);
                }
            }
            if (h === 'TIME') {
                if (head[h] === '') {
                    $('select#tsHoursHEAD_TIME').children(':first').prop('selected', true);
                    $('select#tsMinutesHEAD_TIME').children(':first').prop('selected', true);
                } else {
                    const time = head[h].split(':').map(i => Number(i));
                    $('select#tsHoursHEAD_TIME').children('[value=' + time[0] + ']').prop('selected', true);
                    $('select#tsMinutesHEAD_TIME').children('[value=' + time[1] + ']').prop('selected', true);
                }
            }
            if (h === 'TIMEOUT') {
                if (head[h] === '') {
                    $('select#tsHoursHEAD_TIMEOUT').children(':first').prop('selected', true);
                    $('select#tsMinutesHEAD_TIMEOUT').children(':first').prop('selected', true);
                } else {
                    const time = head[h].split(':').map(i => Number(i));
                    $('select#tsHoursHEAD_TIMEOUT').children('[value=' + time[0] + ']').prop('selected', true);
                    $('select#tsMinutesHEAD_TIMEOUT').children('[value=' + time[1] + ']').prop('selected', true);
                }
            }
            if ($('input[name=HEAD_' + h + ']').length) {
                $('input[name=HEAD_' + h + ']').val(head[h]);
                count++;
            }
        }
        const body = save.formbody;
        for (let b of body) {
            if (qidArr.length && !qidArr.includes(b.qid)) continue;
            const qData = getQuestionData(b.qid);
            if (qData === undefined) continue;
            if (qData.ans === b.ans && qData.cmt === b.cmt) continue;
            if (qData.ans !== b.ans) setAnswer(b.qid, b.ans);
            if (qData.cmt !== b.cmt) {
                setComment(b.qid, b.cmt);
                unsafeWindow.updrowH(document.querySelector('textarea#C' + b.qid + 'C'));//调整评论框高度
            }
            count++;
        }
        feedback(ssl, '读档成功。(共修改' + count + '题)');
    }

    //存档
    function saveData(ssl, toSave) {
        const save = {
            surveytitle: $('h1.surveytitle').text(),
            surveyid: $('input#instanceID').val(),
            formhead: {
                LOCATION: getQuestionData('LOCATION'),//||$('table.visualization_HEAD_LOCATION').find('lookup').text().split(' - ')[0],
                SHOPPER: getQuestionData('SHOPPER'),
                DATE: getQuestionData('DATE'),
                TIME: getQuestionData('TIME'),
                TIMEOUT: getQuestionData('TIMEOUT')
            },
            formbody: []
        };
        $('a.surveyquestionnobreak').each(function () {
            const qtx = $(this).find('span.surveyquestion').text();
            const qid = $(this).attr('name').replace('qstn', '');
            const qData = getQuestionData(qid);
            save.formbody.push({
                qtx: qtx,
                qid: qid,
                ans: qData.ans,
                cmt: qData.cmt
            });
        });
        const saves = GM_getValue(toSave, {});
        saves[new Date().toLocaleString()] = save;
        //存档超过10个覆盖最早存档
        if (Object.keys(saves).length > 10) delete saves[Object.keys(saves)[0]];
        GM_setValue(toSave, saves);
        refreshList(ssl, toSave);
        if (toSave === 'autosaves') feedback(ssl, '自动存档成功。');
        if (toSave === 'selfsaves') feedback(ssl, '手动存档成功。');
    }

    //根据head值或qid获得当前问卷内容
    function getQuestionData(key) {
        if ($(`input[name=HEAD_${key}],a.surveyquestionnobreak[name=qstn${key}]`).length === 0) return;
        if (key.match(/\d/)) {
            const getAnswer = unsafeWindow.sm_getmultipleanswer;
            const getComment = unsafeWindow.sm_getcomment;
            const ans = $('input[name=Q' + key + 'Q]').length ? getAnswer(key) : undefined;
            //ans 已填写：'1,2'||'__na__';未填写：'';无选项列：undefined
            const cmt = getComment(key);
            //cmt 已填写：'xxx';未填写：'';无评论框：undefined
            return { qid: key, ans: ans, cmt: cmt };
        } else return $(`input[name=HEAD_${key}]`).val();
    }

    //删除
    function deleteData(ssl) {
        const [save, time, saves, fromSave] = checkSave(ssl);
        if (!save) return;
        delete saves[time];
        GM_setValue(fromSave, saves);
        refreshList(ssl);
        feedback(ssl, '删除成功。');

    }

    //下载
    function exportData(ssl) {
        const [save, time] = checkSave(ssl);
        if (!save) return;
        let csv = '\uFEFF';//添加一个BOM（Byte Order Mark）标记，声明是用UTF-8编码的
        for (let h in save.formhead) {
            csv += `${h},"${save.formhead[h].replace(/"/g, '""')}\t"`;
            if (h === 'DATE') csv += ',//请按照YYYY-MM-DD格式填写';
            if (h.startsWith('TIME')) csv += ',//请按照HH:MM格式填写';
            csv += '\r\n';
        }
        csv += `QID,题目,选项,评论\r\n`;
        for (let q of save.formbody) {
            const [qid, qtx, ans, cmt] = [
                q.qid,
                q.qtx.replace(/"/g, '""').replace(/^/, '"').replace(/$/, '"'),
                q.ans?.replace(/^/, '"').replace(/$/, '"') || '×',
                q.cmt?.replace(/"/g, '""').replace(/^/, '"').replace(/$/, '"') || '×'
            ];
            csv += `${qid},${qtx},${ans},${cmt}\r\n`;
        }
        const blob = new Blob([csv], { type: "text/csv" });
        const a = document.createElement('a');
        a.setAttribute('download', `${time}-${save.surveytitle}-${save.surveyid}.csv`);
        a.setAttribute('href', URL.createObjectURL(blob));
        a.click();
    }

    //上传
    function uploadData(ssl, input) {
        const [save, time] = checkSave(ssl);
        if (!save) return;
        input.saveInfo = [save, time];
        input.click();
    }

    //验证并上传数据
    function uploadCsvArr(ssl, csvArr, saveInfo) {
        console.log(csvArr);
        csvArr.pop();
        const checkResult = checkCsvArr(csvArr);
        if (checkResult[0] === false) return feedback(ssl, checkResult[1]);
        const headLength = checkResult[2] - 1;
        for (let h = 0; h < headLength; h++) saveInfo[0].formhead[csvArr[h][0]] = csvArr[h][1].trim();
        saveInfo[0].formbody = [];
        for (let b = checkResult[2]; b < csvArr.length; b++) {
            const q = {
                qid: csvArr[b][0],
                qtx: csvArr[b][1],
                ans: csvArr[b][2],
                cmt: csvArr[b][3]
            };
            if (q.ans === '×') delete q.ans;
            if (q.cmt === '×') delete q.cmt;
            saveInfo[0].formbody.push(q);
        }
        const saves = GM_getValue('selfsaves', {});
        saves[saveInfo[1]] = saveInfo[0];
        GM_setValue('selfsaves', saves);
        showData(ssl);
        feedback(ssl, '存档上传成功。');
        showData(ssl);
    }

    //验证上传数据
    function checkCsvArr(csvArr) {
        let bodyIndex;
        if (csvArr[0][0] !== 'LOCATION' ||
            csvArr[1][0] !== 'SHOPPER' ||
            csvArr[2][0] !== 'DATE' || !/^\d{4}-\d{2}-\d{2}\t*$/.test(csvArr[2][1]) ||
            csvArr[3][0] !== 'TIME' || !/^\d{2}:\d{2}\t*$/.test(csvArr[3][1])
        ) return [false, '上传的存档表头格式有误！'];
        if (csvArr[5][0] === 'QID') {
            bodyIndex = 6;
            if (csvArr[4][0] !== 'TIMEOUT' || /^\d{2}:\d{2}$/.test(csvArr[4][1])) return [false, '上传的存档表头格式有误！'];
        } else if (csvArr[4][0] === 'QID') {
            bodyIndex = 5;
        } else return [false, '上传的存档表头格式有误！'];
        for (let i = bodyIndex; i < csvArr.length; i++) {
            if (csvArr[i].length < 4 ||
                !/^\d+$/.test(csvArr[i][0]) ||
                !/^(\d+(,\d+)*|__na__|×|)$/.test(csvArr[i][2])
            ) return [false, '上传的存档表身格式有误！'];
        }
        return [true, '上传的存档格式正确。', bodyIndex];
    }

    //检查存档有效性
    function checkSave(ssl) {
        if (ssl.find('input[name=saves]:checked').length === 0) {
            feedback(ssl, '请选择存档！');
            return [];
        }
        const fromSave = ssl.find('input[name=saves]:checked').parents('tbody').attr('id');
        const saves = GM_getValue(fromSave, {});
        const time = ssl.find('input[name=saves]:checked').parent().next().text();
        if (!Object.keys(saves).includes(time)) {
            feedback(ssl, '无此存档！（可能已被覆盖）');
            return [];
        }
        return [saves[time], time, saves, fromSave];
    }

    //操作反馈提示
    function feedback(ssl, text, ifConfirm, yesFunc) {
        if (ssl.css('display') === 'none') return;//界面隐藏时不提示
        if (ssl.find('b#feedback').length === 0) {
            ssl.find('div#tab').before('<b id=feedback style=margin:5px></b>');
        }
        const b = ssl.find('b#feedback');
        b.text(text).append('<br>');
        if (ifConfirm) {
            $('<input type=button value=√ class="rm-btn rm-btn-default">').appendTo(b)
                .on('click', function () {
                    $(this).parents('b#feedback').remove();
                    yesFunc();
                });
            $('<input type=button value=× class="rm-btn rm-btn-default">').appendTo(b)
                .on('click', function () {
                    $(this).parents('b#feedback').remove();
                });
            b.children('input:button').css('margin', '5px');
        } else {
            setTimeout(() => {
                b.remove();
            }, 3e3);
        }
    }

    //将表头宽度同步为表身
    function theadWidth(thead, tbody) {
        if (tbody.find('td').text() === '无数据！') return;
        thead.find('tr td').each(function () {
            const i = $(this).index();
            const w = getComputedStyle(tbody.children('tr:last').children()[i]).width;
            $(this).css('width', w);
        });
    }

    //https://github.com/voodootikigod/node-csv/blob/master/index.js
    function CSVToArray(strData, strDelimiter) {
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");
        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
        );
        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];
        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                (strMatchedDelimiter != strDelimiter)
            ) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            var strMatchedValue;
            if (arrMatches[2] || arrMatches[2] === '') {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(
                    new RegExp("\"\"", "g"),
                    "\""
                );
            } else {
                // We found a non-quoted value.
                strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        // Return the parsed data.
        return arrData;
    }

    //卸载报告存档
    function unSURVEYSAVES() {
        if (unsafeWindow.OSM || !$('form#frmSurvey').length) return;
        if ($('div#surveySaves').length) $('div#surveySaves').remove();
        if (document.location.href.includes('alias=survey.view')) {
            $('form#frmSurvey').off('change.autosave');
            //$('textarea.surveycomment,textarea.active').off('blur.autosave');
        }
    }
    /*报告存档*/


    /*8:PDF命名
    function PDFRENAME(){
        if(!document.location.href.includes('exportMultiplePDF.asp')) return;
        $('table#pdfconvertProcessTableAdv tr.reporttable_thead').append('<th id=downloadAll>');
        $('<button style=font-size:10px;width:100px>命名并下载全部</button>').appendTo('table#pdfconvertProcessTableAdv th#downloadAll')
            .on('click',function(){
            $(this).parent().parent().nextAll('tr').find('button').click();
        });
        $('table#pdfconvertProcessTableAdv a[id^=dlLinkAdv]').each(function(){
            const a=$(this);
            const surveyid=a.attr('id').replace('dlLinkAdv','');
            a.parent().after('<td id=download>');
            const td=a.parent().next('td#download');
            $('<button style=font-size:10px;width:100px>命名并下载</button>').appendTo(td)
                .on('click',function(){
                if(a.attr('href')==='/surveyexport_pdf/done.asp?docID='){
                    $(this).text('请等待转化完成');
                    setTimeout(()=>{
                        $(this).text('命名并下载');
                    },1e3);
                }else{
                    $(this).text('下载中...');
                    fetchName(a,surveyid,$(this),0);
                }
            });
        });
    }

    function fetchName(a,surveyid,self,isInternal){
        let name=$('textarea#naming_convention').val();
        const field=new Set(name.match(/(?<=#\$FIELD\[)[A-Za-z0-9\._]+(?=\]\$#)/g));
        if(field.size){
            const fieldDict= isInternal? {
                'DateSubmitted':'SurveyDateOrDueDate',
                'TimeSubmitted':'SurveyDateOrDueDate',
                'Campaign':'CampaignName',
                'CustomProperty001':'LocationCustomPropertyValue001',
                'CustomProperty002':'LocationCustomPropertyValue002',
                'CustomProperty003':'LocationCustomPropertyValue003',
                'CustomProperty004':'LocationCustomPropertyValue004',
                'CustomProperty005':'LocationCustomPropertyValue005',
                'CustomProperty006':'LocationCustomPropertyValue006',
                'CustomProperty007':'LocationCustomPropertyValue007',
                'CustomProperty008':'LocationCustomPropertyValue008',
                'CustomProperty009':'LocationCustomPropertyValue009',
                'CustomProperty010':'LocationCustomPropertyValue010',
                'ExportServicePointsScored':'PrecalcScore',
                'ExportServicePointsPossible':'PrecalcScoreOutOf'
            } : {
                'SurveyInstanceID':'InstanceID',
                'DateSubmitted':'Date',
                'TimeSubmitted':'Time',
                'LocationId':'Loc ID',
                'LocationName':'Location Name',
                'LocationAddress':'Location Address 1',
                'LocationCity':'Location City',
                'LocationCounty':'Location County',
                'LocationState_Region':'Location State/Region',
                'LocationPostalCode':'Location Postal Code',
                'LocationCountry':'Location Country',
                'SurveyTitle':'Title',
                'CustomProperty001':'CustLocationProperty001',
                'CustomProperty002':'CustLocationProperty002',
                'CustomProperty003':'CustLocationProperty003',
                'CustomProperty004':'CustLocationProperty004',
                'CustomProperty005':'CustLocationProperty005',
                'CustomProperty006':'CustLocationProperty006',
                'CustomProperty007':'CustLocationProperty007',
                'CustomProperty008':'CustLocationProperty008',
                'CustomProperty009':'CustLocationProperty009',
                'CustomProperty010':'CustLocationProperty010',
                'ExportServicePointsScored':'PrecalcPts',
                'ExportServicePointsPossible':'PrecalcPtsOf',
                'ExportServiceScorePercentXX':'PrecalcScorePctXX',
                'ExportServiceScorePercentXX.X':'PrecalcScorePctXX.X',
                'ExportServiceScorePercentXX.XX':'PrecalcScorePctXX.XX'
            };
            const qSet=new Set();
            for(let i of field){
                if(isInternal){
                    if(i.includes('ServiceScorePercentXX')){
                        qSet.add('PrecalcScore');
                        qSet.add('PrecalcScoreOutOf');
                        continue;
                    }
                }
                if(fieldDict[i]) i=fieldDict[i];
                qSet.add(i);
            }
            let query='';
            for(let i of qSet) query+='['+i+'],';
            query=query.slice(0,-1);
            const api= isInternal? '/Apps/SM/APIv2/Query/Operations/Operations' : '/Apps/SM/APIv2/Query/ClientAnalytics/ClientAnalytics';
            $.get(`
            /open/data.asp?post={
                "action":"exec",
                "dataset":{"datasetname":"${api}"},
                "parameters":[
                    {"name":"QuerySpecification","value":"${query}"},
                    {"name":"SurveyInstanceIDs","value":"${surveyid}"}
                ]
            }`,data=>{//调用API获取当前survey数据（客户端和内部端由于权限不同需要使用不同api）
                if(!isInternal&&data.dataset.data[0].length===0){//如客户端api返回无数据则用内部端再尝试
                    fetchName(a,surveyid,self,1);
                }else if(isInternal&&data.dataset.data[0].length===0){//如内部端api返回无数据则报错
                    download(a.attr('href'),name+'.pdf',()=>{self.text('无法获取命名数据');});
                    return;
                }
                const info=data.dataset.data[0][0];
                for(let i of field){
                    const tmp=i;
                    if(fieldDict[i]) i=fieldDict[i];
                    let r;
                    if(isInternal&&tmp.includes('Submitted')){
                        if(tmp==='DateSubmitted') r=info[i].split(' ')[0];
                        if(tmp==='TimeSubmitted') r=info[i].split(' ')[1];
                    }else if(tmp.includes('ServiceScorePercentXX')){
                        if(isInternal){
                            r=Number(info.PrecalcScore)/Number(info.PrecalcScoreOutOf)*100;
                            if(tmp==='ExportServiceScorePercentXX') r=r.toFixed(0)+'%';
                            if(tmp==='ExportServiceScorePercentXX.X') r=r.toFixed(1)+'%';
                            if(tmp==='ExportServiceScorePercentXX.XX') r=r.toFixed(2)+'%';
                        }else{
                            r=info[i]+'%';
                        }
                    }else{
                        r=info[i];
                    }
                    name=name.replaceAll(`#$FIELD[${tmp}]$#`,r);
                }
                download(a.attr('href'),name+'.pdf',()=>{self.text('命名并下载〇');});
            },'json');
        }else{
            download(a.attr('href'),name+'.pdf',()=>{self.text('命名并下载〇');});
        }
    }

    function download(url,filename,done){//done()为执行完毕后执行的函数
        getBlob(url,function(blob){
            saveAs(blob,filename,done);
        });
    }

    function getBlob(url,cb){
        const xhr=new XMLHttpRequest();
        xhr.open('GET',url,true);
        xhr.responseType='blob';
        xhr.onload=function(){
            if (xhr.status === 200){
                cb(xhr.response);
            }
        };
        xhr.send();
    }

    function saveAs(blob,filename,done){
        if (window.navigator.msSaveOrOpenBlob){//Firefox&IE
            navigator.msSaveBlob(blob,filename);
        }else{
            const link=document.createElement('a');
            const body=document.querySelector('body');
            link.href=window.URL.createObjectURL(blob);
            link.download=filename;
            link.style.display='none';
            body.appendChild(link);
            link.click();
            body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }
        done();
    }

    //卸载PDF命名
    function unPDFRENAME(){
        if(!document.location.href.includes('exportMultiplePDF.asp')) return;
        $('table#pdfconvertProcessTableAdv th#downloadAll').remove();
        $('table#pdfconvertProcessTableAdv td#download').remove();
    }
    /*PDF命名*/


    /*9:优化表头*/
    function BETTERTHEAD() {
        if ($('table.sticky-thead,#rollupTable').length) {
            $('table.sticky-thead,#rollupTable').each(function () {
                execBetterThead(this);
            });
        }
        if (!$('table.persist-area').length && !document.location.href.includes('alias=client.analysiscustomrollups.3.0')) return;
        unsafeWindow.betterThead_observer = new MutationObserver(function (mutationsList) {
            for (let m of mutationsList) execBetterThead(m.target);
        });
        unsafeWindow.betterThead_observer.observe(document.body, { childList: true, subtree: true });
    }

    //根据情况执行优化表头
    function execBetterThead(ele) {
        $('div#reportdiv').css('overflow', 'unset');
        let oTable, oDiv;
        if (ele.className === 'sticky-thead') {
            oTable = $(ele).prev('table.sticky-enabled');
            oTable.children('thead').css({ position: 'sticky', top: $('#menu').height() || 0 });
            $(ele).hide();
            oDiv = oTable.parents('div.q2r_tableHolder').children('[class^=q2r_tableCaptionDiv]');
            if (oDiv.attr('class') === 'q2r_tableCaptionDiv_without_text') oDiv.attr('class', 'q2r_tableCaptionDiv');
        }
        if (ele.id === 'rollupTable') {
            oTable = $(ele).find('table#smReporttableTable');
            oDiv = oTable.prev();
        }
        if (!oTable || !oTable.length || !oDiv || !oDiv.length) return;
        if (oDiv[0].settle) return;
        oDiv[0].settle = 1;
        oDiv.css('cursor', 'pointer').attr('title', '显示/隐藏列').on('click.tableCaptionDivFunc', function () {
            tableCaptionDivFunc(this, oTable);
        });
    }

    //表头标题点击功能
    function tableCaptionDivFunc(oDiv, oTable) {
        const next = $(oDiv).next();
        if (next.attr('id') === 'hideOption') {
            if (next.css('display') === 'none') {
                if (oTable.find('thead>tr>td').length + 1 === next.find('tr').length) next.show();
                else {
                    next.remove();
                    tableCaptionDivFunc(oDiv, oTable);
                }
            } else {
                next.hide();
            }
        } else {
            let hideOption = '<div id=hideOption><table><thead class=persist-header>', i = 0;
            const show = [];
            oTable.find('thead>tr>td').each(function () {
                if (this.style.display != 'none') show.push(i);
                hideOption +=
                    `<tr>
                       <td><input type=checkbox value=${i++}></td>
                       <td>${this.textContent}</td>
                    </tr>`;
            });
            next.before(hideOption);
            const inputs = next.prev('div#hideOption').css({ position: 'absolute',/*top:tableCaptioDiv.clientHeight,*/zIndex: 2, overflow: 'auto', maxHeight: '300px', background: 'white' })
                .find('input').on('click', function () {
                    toggleCol(this, oTable);
                });
            next.prev('div#hideOption').find('thead').prepend(
                `<tr>
                   <td><input type=checkbox checked></td>
                   <td><b>全选/取消全选</b></td>
                </tr>`)
                .find('input').eq(0).on('click', function () {
                    if ($(this).is(':checked')) {
                        inputs.each(function () {
                            if (!$(this).is(':checked')) this.click();
                        });
                    } else {
                        inputs.each(function () {
                            if ($(this).is(':checked')) this.click();
                        });
                    }
                });
            for (let s of show) next.prev('div#hideOption').find('input').eq(s + 1).prop('checked', true);
        }
    }

    //显示隐藏列
    function toggleCol(checkbox, oTable) {
        if ($(checkbox).is(':checked')) {
            oTable.children().children('tr').each(function () {
                $(this).children().eq(checkbox.value).show();
            });
        } else {
            oTable.children().children('tr').each(function () {
                $(this).children().eq(checkbox.value).hide();
            });
        }
    }

    //卸载优化表头
    function unBETTERTHEAD() {
        $('table.sticky-enabled>thead').css({ position: '', top: '' });
        $('table.sticky-thead').show();
        if ($('div#hideOption').length) {
            $('div#hideOption').find('input').each(function () {
                if (!$(this).is(':checked')) this.click();
            });
            $('div#hideOption').remove();
        }
        const oDiv1 = $('table.sticky-enabled').parents('div.q2r_tableHolder').children('[class^=q2r_tableCaptionDiv]').css('cursor', '').attr('title', null).off('click.tableCaptionDivFunc');
        const oDiv2 = $('table#smReporttableTable').parent('div#resultsTable').children('div#smAnalysisCustomRollupsTableDiv').css('cursor', '').attr('title', null).off('click.tableCaptionDivFunc');
        $(oDiv1, oDiv2).each(function () { delete this.settle; });
        if (unsafeWindow.betterThead_observer) unsafeWindow.betterThead_observer.disconnect();
    }
    /*优化表头*/


    /*10:外观效果*/
    function CSSEFFECT() {
        const skipURL = [
            'auth/index.asp'
        ];
        for (let i of skipURL) if (document.location.href.includes(i)) return;
        let css = '';
        if (GM_getValue('外观效果_夜间模式', 0)) {
            iframeInject();
            const darkExclEle = [
                'img',
                'video',
                'option',
                'canvas',
                'div#menu',
                'div#cover',
                'ul.innerItemFirst',
                'ul.textArea',
                'code>iframe',
                '#ResourceSectionDiv>iframe',
                'div#graphicPlaceHolder',
                'div.picker',
                'div.swatch',
                'div.shape',
                'span.fr-video>iframe.fr-draggable',
                '.ace-twilight',
            ];
            const darkExtraCSS = 'ul.textArea img{filter:none}option{background:black !important;color:white}pre{color:black}';
            const backgroundChangeURL = [
                'surveyexport_pdf/exportMultiplePDF.asp',
                'surveyexport_pdf/mailSend.asp',
            ];
            css += 'html,' + darkExclEle.toString() + '{filter:invert(1) hue-rotate(180deg)}' + darkExtraCSS;
            for (let i of backgroundChangeURL) if (document.location.href.includes(i)) css += 'html{background:white}';
        }
        if (GM_getValue('外观效果_隐藏logo', 0)) css += '#sm_headerLogoTable{display:none}#addInfo{height:0 !important}#menu,#cover{top:0 !important}';
        if (CSSEFFECT_style && $('#' + CSSEFFECT_style.id).length && css === CSSEFFECT_style.textContent) return;
        if (CSSEFFECT_style) CSSEFFECT_style.remove();
        CSSEFFECT_style = GM_addStyle(css);
    }

    //为特定iframe注入css
    function iframeInject() {
        const list = {
            'iframe#id_iframe_select_language': 'img{filter:invert(1) hue-rotate(180deg)}',
        };
        for (let selector in list) {
            const iframe = document.querySelector(selector);
            if (!iframe) continue;
            if (iframe.darkCSS) continue;
            iframe.addEventListener('load', () => {
                const style = document.createElement('style');
                style.textContent = list[selector];
                iframe.contentDocument.head.append(style);
            });
            iframe.darkCSS = true;
        }
    }

    //卸载外观效果
    function unCSSEFFECT() {
        if (CSSEFFECT_style) CSSEFFECT_style.remove();
    }
    /*外观效果*/


    /*11:图片编辑*/
    function IMAGEEDIT() {
        if (!document.location.href.includes('MystImageUpload/upload_modify.asp')) return;
        $('div#shape-controls').on('click.shapeControls', function (e) {
            if (e.target.className !== 'picker') return;
            $(this).off('click.shapeControls');
            $('div#colorPicker_palette-2').append($('div#colorPicker_palette-0').children());
            $('div#colorPicker_palette-0').append($('div#colorPicker_palette-2').children(':nth-child(-n+2)'));
        });
    }

    //卸载图片编辑
    function unIMAGEEDIT() {
        if (!document.location.href.includes('MystImageUpload/upload_modify.asp')) return;
        $('div#shape-controls').off('click.shapeControls');
        $('div#colorPicker_palette-0').append($('div#colorPicker_palette-2').children());
        $('div#colorPicker_palette-2').append($('div#colorPicker_palette-0').children(':nth-child(-n+2)'));
    }
    /*图片编辑*/


    /*12:报告预览*/
    function REPORTCONTENT() {
        if (!document.location.href.includes('alias=smngr.opermgmt')) return;
        if ($('table#reporttable>tbody>tr').length && !$('table#reporttable>tbody>tr>td.q2r_NoEntriesFound').length) {
            const li = $('<li style=cursor:pointer id=tabButton3><a>报告内容</a></li>');
            $('li#tabButton2').after(li);
            li.on('click', function () {
                let tabPage3Div = $('div#tabPage3Div');
                if (!tabPage3Div.length) {
                    tabPage3Div = $(
                        `<div id=tabPage3Div style=display:none>
                          <button type=button id=reportContent class="rm-btn rm-display-block rm-btn-default rm-btn-success">显示内容</button>
                        </div>`
                    );
                    $('div#tabPage2Div').before(tabPage3Div);
                    tabPage3Div.children('button#reportContent').on('click', function () {
                        showReportContent($(this), tabPage3Div);
                    });
                    $('li#tabButton1,li#tabButton2').on('click', () => {
                        this.className = '';
                        tabPage3Div.hide();
                    });
                }
                $('li#tabButton1,li#tabButton2').attr('class', '');
                this.className = 'active';
                $('div#tabPage1Div,div#tabPage2Div').hide();
                tabPage3Div.show();
            });
        }
    }

    //显示内容
    function showReportContent(reportContentBtn, tabPage3Div) {
        reportContentBtn.attr('disabled', 1).text('......');
        //记录并监听请求数和是否正在渲染表格
        tabPage3Div.tmp = {
            request: $('table#reporttable.sticky-enabled>tbody>tr').length,
            rendering: 0,
            renderList: [],
            locationInfo: null,
            scoreData: null
        };
        let tmp = tabPage3Div.tmp;
        Object.defineProperty(tabPage3Div, 'tmp', {
            get() {
                return tmp;
            },
            set(newValue) {
                tmp = newValue;
                //空闲时渲染队列中的报告数据
                if (!newValue.rendering && newValue.renderList.length) {
                    const toRender = newValue.renderList.shift();
                    handleSurveyData(toRender.data, toRender.surveyInsID, tabPage3Div);
                }
                //所有报告数据都渲染后补充门店信息和计算分数
                if (!newValue.request && newValue.scoreData) {
                    if (newValue.locationInfo) outputLocationInfo(newValue.locationInfo);
                    if (!$.isEmptyObject(newValue.scoreData) || newValue.scoreData[10] && !newValue.scoreData[10].length) outputScoreData(handleScoreData(newValue.scoreData));
                    reportContentBtn.attr('disabled', null).text('显示内容');
                    tabPage3Div.find('#recordsnum input').attr('disabled', null);
                    tabPage3Div.find('#currnumofrecs').text($('table#reporttable.sticky-enabled>tbody>tr').length);
                    $('a#download_rc').css('cursor', 'pointer').on('click', () => {
                        downloadBtn($('a#download_rc'));
                    });
                    const table_rc = document.querySelector('#reporttable_rc');
                    $(table_rc).children('tbody').find('img').on('click', function () {//图片点击可放大缩小
                        if (this.style.position === 'fixed') {
                            $(this).css({ position: '', maxHeight: '', inset: '', margin: '', zIndex: '', cursor: '' });
                        } else {
                            $(this).css({ position: 'fixed', maxHeight: '100%', inset: 0, margin: 'auto', zIndex: 2e3, cursor: 'zoom-out' });
                        }
                    });
                    initReportTable(table_rc);
                    if (GM_getValue(SET[9].name, SET[9].switch)) execBetterThead(tabPage3Div.find('table.sticky-thead')[0]);
                    $(table_rc).find('thead').css('top', 0);
                }
            }
        });
        //首次执行先添加必要组件
        if (tabPage3Div.children().length < 2) {
            tabPage3Div.append(
                `<div class=rm-margin-bottom-xlarge></div>
                 <span id=recordsnum style=position:sticky;left:0>Number of Records: <span id=currnumofrecs></span>
                   <a target=_blank id=download_rc style=vertical-align:top>
                     <img class=download_excel_button style=width:16px;height:16px;border:0px title=下载表格 src=/images/icons/q2r/blank.png>
                   </a>
                   <span style=margin:9px>
                     <input type=checkbox id=content>隐藏选项内容
                     <input type=checkbox id=position>隐藏选项位置
                     <input type=checkbox id=measure>隐藏选项分值
                     <input type=checkbox id=score>隐藏选项分数
                   </span>
                 </span>
                 <div style="z-index:999;padding-top:4px;border:1px solid;background:ButtonFace;border-color:#AFAFAF #666666 #666666 #AFAFAF;position:absolute;layer-background-color:#C0C0C0;visibility:hidden;width:438px" name=filterdiv id=filterdiv></div>
                 <div class="q2r_tableHolder reporttable" style=position:relative;display:table>
                   <div class=q2r_tableCaptionDiv style=text-align:left>报告内容</div>
                   <div style=overflow:auto;width:95vw;height:75vh>
                     <table width=100% class="reporttable persist-area sticky-enabled" id=reporttable_rc cellspacing=0 style=margin:0px;width:100%>
                     <table class=sticky-thead></table>
                     <style>
                         #reporttable_rc>tbody td>table td{white-space:nowrap}
                         #reporttable_rc>tbody div{min-width:200px;max-height:140px;overflow:auto}
                         #reporttable_rc>tbody img{margin:1px;max-height:130px;cursor:zoom-in}
                         #reporttable_rc>tbody li>span{display:none}
                     </style>
                   </div>
                 </div>`
            );
            tabPage3Div.find('#recordsnum>span>input').on('change', function () {
                $(this).parent().children('input').each(function () {
                    if (this.checked) {
                        tabPage3Div.find('table#reporttable_rc tr.' + this.id).hide();
                    } else {
                        tabPage3Div.find('table#reporttable_rc tr.' + this.id).show();
                    }
                });
            });
        }
        tabPage3Div.find('#recordsnum input').prop('checked', false).attr('disabled', 1);//加载完前禁用隐藏选项信息
        //复制表格隐藏若干列后匹配报告id并发送请求
        const surveyInsIDArr = [];
        tabPage3Div.find('table#reporttable_rc').empty().append($('table#reporttable.sticky-enabled').html()).find('tr').each(function (index) {
            if (index > 0) {
                //处理表身this=tbody>tr
                const match = $(this).find('a').attr('target', '_blank').eq(0).attr('href').match(/(?<=InstanceID=)\d+/);
                //获取报告内容
                const postJSON = {
                    action: "exec",
                    JSONPath: "dataset.data",
                    dataset: { datasetname: "/Apps/SM/Survey/SurveyInstanceGetData" },
                    parameters: [
                        { name: "SurveyInstanceID", value: match[0] }
                    ]
                };
                $.post('/open/data.asp', 'post=' + encodeURIComponent(JSON.stringify(postJSON)), data => {
                    if (!tabPage3Div.tmp.rendering && !tabPage3Div.tmp.renderList.length) {
                        handleSurveyData(data, match[0], tabPage3Div);
                    } else {
                        tabPage3Div.tmp.renderList.push({
                            data: data,
                            surveyInsID: match[0]
                        });//若正在渲染或队列不为空则加入队列
                    }
                }, 'json').fail(function (xhr, status, error) {
                    tabPage3Div.tmp = {
                        request: tabPage3Div.tmp.request - 1,
                        rendering: tabPage3Div.tmp.rendering,
                        renderList: tabPage3Div.tmp.renderList,
                        locationInfo: tabPage3Div.tmp.locationInfo,
                        scoreData: tabPage3Div.tmp.scoreData
                    };
                    console.log(match[0], status, error, xhr);
                });
                surveyInsIDArr.push(match[0]);
                this.id = 'surveyInsID' + match[0];
                $(this).children('td').eq(0).css({ position: 'sticky', left: 0, background: '#E4E4E4' });//冻结tbody第一列
                $(this).append('<td id=totalScore></td>');
            } else {
                //处理表头this=thead>tr
                $(this).children('td').each(function () {
                    $(this).text(this.textContent);
                });
                $(this).append(`<td id=totalScore onMouseover=addClassName(this,'reporttable_headerhover'); onMouseout=removeClassName(this,'reporttable_headerhover'); style=text-transform:none;>总分</td>`);
            }
            $(this).children('td').each(function () {
                if (![0, 1, 2, 19, 20].includes(this.cellIndex)) $(this).hide();//隐藏4-19列
            });
        });
        tabPage3Div.find('table#reporttable_rc>thead').css('top', 0).css('zIndex', 1)//置于冻结的第一列之上
            .find('td').attr('title', '');//清空排序筛选提示
        //获取计算分数所需信息
        const postJSON = {
            action: "exec",
            JSONPath: "dataset.data",
            dataset: { datasetname: "/Apps/SM/APIv2/Query/Operations/Operations" },
            parameters: [
                { name: "QuerySpecification", value: "[ProtoSurveyID][SurveyCustomPropertyValue001][SurveyCustomPropertyValue002][SurveyCustomPropertyValue003][SurveyCustomPropertyValue004][SurveyCustomPropertyValue005][SurveyCustomPropertyValue006][SurveyCustomPropertyValue007][SurveyCustomPropertyValue008][SurveyCustomPropertyValue009][SurveyCustomPropertyValue010][SurveyCustomPropertyValue011][SurveyCustomPropertyValue012][SurveyCustomPropertyValue013][SurveyCustomPropertyValue014][SurveyCustomPropertyValue015][SurveyCustomPropertyValue016][SurveyCustomPropertyValue017][SurveyCustomPropertyValue018][SurveyCustomPropertyValue019][SurveyCustomPropertyValue020][SurveyInstanceID][LocationName][Time][Time Out]" },
                { name: "SurveyInstanceIDs", value: surveyInsIDArr.toString() }
            ]
        };
        $.post('/open/data.asp', 'post=' + encodeURIComponent(JSON.stringify(postJSON)), operationData => {
            const surveyIDArr = [];
            for (let i of operationData[0]) if (!surveyIDArr.includes(i.ProtoSurveyID)) surveyIDArr.push(i.ProtoSurveyID);
            getScoreData(surveyIDArr, scoreData => {
                tabPage3Div.tmp = {
                    request: tabPage3Div.tmp.request,
                    rendering: tabPage3Div.tmp.rendering,
                    renderList: tabPage3Div.tmp.renderList,
                    locationInfo: tabPage3Div.tmp.locationInfo,
                    scoreData: scoreData
                };
            });
            tabPage3Div.tmp = {
                request: tabPage3Div.tmp.request,
                rendering: tabPage3Div.tmp.rendering,
                renderList: tabPage3Div.tmp.renderList,
                locationInfo: operationData,
                scoreData: tabPage3Div.tmp.scoreData
            };
        }, 'json');
    }

    //处理返回的报告数据
    function handleSurveyData(data, surveyInsID, tabPage3Div) {
        tabPage3Div.tmp = {
            request: tabPage3Div.tmp.request,
            rendering: 1,
            renderList: tabPage3Div.tmp.renderList,
            locationInfo: tabPage3Div.tmp.locationInfo,
            scoreData: tabPage3Div.tmp.scoreData
        };
        const table = tabPage3Div.find('table#reporttable_rc');
        const theadAttr = `onMouseover=addClassName(this,'reporttable_headerhover'); onMouseout=removeClassName(this,'reporttable_headerhover'); style=text-transform:none;`;
        //将报告数据记录在对应的tr元素
        const insData = table.find('tbody>tr#surveyInsID' + surveyInsID)[0].insData = {};
        //处理问题内容和模块分割
        for (let q of data[0]) {
            q.Text = $('<a>' + q.Text + '</a>').text();
            insData[q.QuestionID] = {
                question: q.Text,
                answerSet: [],
                answer: [],
                comment: ''
            };
            if (!table.find(`td[id="SEC_${q.SectionLevel1Title}"]`).length) {
                table.find('thead>tr').append(`<td id="SEC_${q.SectionLevel1Title}" ${theadAttr}>${q.SectionLevel1Title}<br>（模块）</td>`);
                table.find('tbody>tr[id^=surveyInsID]').append(`<td id="SEC_${q.SectionLevel1Title}"></td>`);
            }
            if (!table.find(`td[id^=QID${q.QuestionID}][section="${q.SectionLevel1Title}"]`).length) {
                const qTextSubstr = q.Text.substr(0, 30) + (q.Text.length > 30 ? '...' : '');
                const headAtd = `<td id=QID${q.QuestionID}ANS section="${q.SectionLevel1Title}" ${theadAttr}display:none title="${q.Text}\n（选项）">${qTextSubstr}<br>（选项）</td>`;
                const bodyAtd = `<td id=QID${q.QuestionID}ANS section="${q.SectionLevel1Title}" style=display:none></td>`;
                const headCtd = `<td id=QID${q.QuestionID}CMT section="${q.SectionLevel1Title}" ${theadAttr}display:none title="${q.Text}\n（评论）">${qTextSubstr}<br>（评论）</td>`;
                const bodyCtd = `<td id=QID${q.QuestionID}CMT section="${q.SectionLevel1Title}" style=display:none></td>`;
                const headFtd = `<td id=QID${q.QuestionID}FILE section="${q.SectionLevel1Title}" ${theadAttr}display:none title="${q.Text}\n（附件）">${qTextSubstr}<br>（附件）</td>`;
                const bodyFtd = `<td id=QID${q.QuestionID}FILE section="${q.SectionLevel1Title}" style=display:none></td>`;
                const sectionTD = table.find(`thead td[section="${q.SectionLevel1Title}"]`);
                /*按模块内文本排序插入
                if(tabPage3Div.tmp.request<$('table#reporttable.sticky-enabled>tbody>tr').length&&sectionTD.length){
                    let cellIndex;
                    for(let i=sectionTD.length-1;i>=0;i--){
                        if(q.Text>sectionTD.eq(i).text()){
                            cellIndex=sectionTD[i].cellIndex;
                            break;
                        }else if(!i){
                            cellIndex=sectionTD[i].cellIndex-1;
                        }
                    }
                */
                if (sectionTD.length) {
                    const cellIndex = sectionTD.last()[0].cellIndex;
                    //在模块后方直接插入↑
                    table.find('thead td').eq(cellIndex).after(headFtd).after(headCtd).after(headAtd);
                    table.find(`tbody>tr[id^=surveyInsID]>td:nth-child(${cellIndex + 1})`).after(bodyFtd).after(bodyCtd).after(bodyAtd);
                } else {
                    table.find('thead>tr').append(headAtd).append(headCtd).append(headFtd);
                    table.find('tbody>tr[id^=surveyInsID]').append(bodyAtd).append(bodyCtd).append(bodyFtd);
                }
            }
        }
        if (!table.find('thead td#QIDnullFILE').length) table.children().children('tr').append('<td id=QIDnullFILE style=display:none></td>').first().children().last().text('附件');//最后一列放报告最下方的附件
        //处理问题选项
        for (let a of data[1]) {
            insData[a.ProtoQuestionID].answer.push(a.Description);
            const atd = table.find('tbody>tr#surveyInsID' + surveyInsID + '>td#QID' + a.ProtoQuestionID + 'ANS');
            if (atd.text()) {
                const tds = atd.find('td');
                atd.find('tr.content>td').children().append(`<li><span>,</span>${a.Description}</li>`);
                atd.find('tr.position>td')[0].textContent += ',' + a.AnswerPosID;
                atd.find('tr.measure>td')[0].textContent += ',' + a.Measure;
            } else {
                atd.html(`<table class=ansTable><tbody>
                  <tr class=position><td>位置：${a.AnswerPosID}</td></tr>
                  <tr class=content><td>内容：<ul style=max-width:300px;overflow:auto;display:inline-grid;list-style:none;margin:0;padding:0><li>${a.Description}</li></ul></td></tr>
                  <tr class=measure><td>分值：${a.Measure}</td></tr>
                </tbody></table>`);
            }
            table.find('td#QID' + a.ProtoQuestionID + 'ANS').show();
        }
        //处理问题评论
        for (let c of data[2]) {
            insData[c.ProtoQuestionID].comment = c.CommentField;
            table.find('tbody>tr#surveyInsID' + surveyInsID + '>td#QID' + c.ProtoQuestionID + 'CMT').html(`<div>${c.CommentField.replace(/\r\n/g, '<br>')}</div>`);
            table.find('td#QID' + c.ProtoQuestionID + 'CMT').show();
        }
        //处理附件
        for (let f of data[3]) {
            const ftd = table.find('tbody>tr#surveyInsID' + surveyInsID + '>td#QID' + f.ProtoQuestionID + 'FILE');
            const ftdDiv = ftd.children('div').length ? ftd.children('div') : $('<div></div>').appendTo(ftd);
            if (f.AttachmentType === 'I') {
                ftdDiv.append(`<img src=/getImage.asp?ID=${f.AttachmentID}&ImageType=851&password=${f.Password} title=${f.FileName}.${f.FileExtension} loading=lazy>`);
            } else {
                ftdDiv.append(`<a href=/mystservices/Attachments/getAttachment.asp?Attachment=${f.AttachmentID}&Password=${f.Password} target=_blank>${f.FileName}.${f.FileExtension}</a>`);
            }
            table.find('td#QID' + f.ProtoQuestionID + 'FILE').show();
        }
        tabPage3Div.tmp = {
            request: tabPage3Div.tmp.request - 1,
            rendering: 0,
            renderList: tabPage3Div.tmp.renderList,
            locationInfo: tabPage3Div.tmp.locationInfo,
            scoreData: tabPage3Div.tmp.scoreData
        };
    }

    //表头筛选排序
    function initReportTable(tableEle) {
        const [SortableTable, getCheckBoxValue, removeClassName, addClassName] = [unsafeWindow.SortableTable, unsafeWindow.getCheckBoxValue, unsafeWindow.removeClassName, unsafeWindow.addClassName];
        /*修改筛选逻辑
        let getDistinct=SortableTable.prototype.getDistinct.toString();
        getDistinct=getDistinct.replace('//\t\twindow.alert("row "+i+ " display: "+rows[i].style.display)','if(rows[i].style.display==="none"&&!String(rows[i].getAttribute("filtered")).includes(nColumn)) continue');
        eval('SortableTable.prototype.getDistinct='+getDistinct);
        let doFilter=SortableTable.prototype.doFilter.toString();
        doFilter=doFilter.replace(/rowsToKeepVisible.indexOf\(":"\+i\+":"\) =/g,'rowsToHide.indexOf(":"+i+":") !');
        doFilter=doFilter.replace(/rowsToKeepVisible.indexOf\(":"\+i\+":"\) !/g,'rowsToHide.indexOf(":"+i+":") =');
        eval('SortableTable.prototype.doFilter='+doFilter);
        */
        //初始化
        var h = tableEle;
        var st1 = new SortableTable(h, 1, "True", "true", new Array($(h).find('thead td').length).fill('String'));
        // restore the class names
        st1.addSortType("CheckBox", null, null, getCheckBoxValue);
        if (/MSIE/.test(navigator.userAgent)) {
            st1.onbeforesort = function () {
                var table = st1.element;
                var inputs = table.getElementsByTagName("INPUT");
                var l = inputs.length;
                for (var i = 0; i < l; i++) inputs[i].parentNode.parentNode._checked = inputs[i].checked;
            };
            st1.onsort = function () {
                var rows = st1.tBody.rows;
                var table = st1.element;
                var inputs = table.getElementsByTagName("INPUT");
                var l = inputs.length;
                for (var i = 0; i < rows.length; i++) {
                    removeClassName(rows[i], i % 2 ? "filter_odd" : "filter_even");
                    addClassName(rows[i], i % 2 ? "filter_even" : "filter_odd");
                }
                for (var j = 0; j < l; j++) inputs[j].checked = inputs[j].parentNode.parentNode._checked;
            };
        } else {
            st1.onsort = function () {
                var rows = this.tBody.rows;
                var l = rows.length;
                var cnt = 0;
                for (var i = 0; i < l; i++) {
                    if (rows[i].style.display != "none") {
                        cnt++;
                        removeClassName(rows[i], cnt % 2 ? "reporttable_even" : "reporttable_odd");
                        addClassName(rows[i], cnt % 2 ? "reporttable_odd" : "reporttable_even");
                    }
                }
            };
        }
    }

    //下载表格
    function downloadBtn(aBtn) {
        aBtn.css({ pointerEvents: 'none', opacity: 0.5 });//防止重复点击
        const table = $('table#reporttable_rc').clone();
        //附件横向分格
        table.children('tbody').find('td[id$=FILE]').each(function () {
            const id = this.id;
            const files = $(this).children().children('img,a');
            $(this).empty();
            let fileTds = $(this).parent().children('td#' + id);
            if (files.length > fileTds.length) {
                table.children().children('tr').each(function () {
                    const lastTd = $(this).children('td#' + id).last();
                    const htmlTd = lastTd.clone().empty().prop('outerHTML');
                    for (let i = 0; i < files.length - fileTds.length; i++) lastTd.after(htmlTd);
                });
                fileTds = $(this).parent().children('td#' + id);
            }
            files.each(function (i) {
                if ($(this).is('img')) {
                    fileTds.eq(i).append(`<a href=${this.src}>${this.title}</a>`);
                } else {
                    fileTds.eq(i).append(this);
                }
            });
        });
        /*隐藏报备不要的列
        const rows=table.children('thead').children('tr')[0].cells.length;
        const qArr=[];
        for(let i=0;i<rows;i++){
            const id=table.find('thead>tr>td')[i].id;
            if(id.endsWith('CMT')&&qArr.includes(id.replace(/CMT$/,''))) continue;
            const rowTds=table.children().children().children('td').filter(function(){
                return this.cellIndex===i;
            });

            const qid=rowTds[0].id.match(/QID\d+/)?.toString();
            if(qid&&rowTds[0].textContent.startsWith('是否通过')&&!qArr.includes(qid)) qArr.push(qid);

            const bodyTds=rowTds.not(':first');
            let isNA=true;
            const isANS=bodyTds[0].id.endsWith('ANS');
            bodyTds.each(function(){
                if(isANS) isNA&&=this.textContent.includes('内容：N/A');
            })
            if(bodyTds.text()==='') rowTds.hide();
            if(isANS&&isNA) rowTds.hide();
        }
        for(let i of qArr){
            const ansWatch=table.find('tbody>tr>td#'+i+'ANS');
            const iTarget=ansWatch.eq(0).prev().attr('id').match(/QID\d+/)?.toString();
            const cmtTarget=table.find('tbody>tr>td#'+iTarget+'CMT');
            const fileTarget=table.find('tbody>tr>td#'+iTarget+'FILE');
            if(cmtTarget.text()+fileTarget.text()==='') table.find(`td[id^=${i}],td[id^=${iTarget}]`).hide();
            else{
                table.find(`td#${i}ANS`).show();
                table.find('td#'+iTarget+'CMT').show().css('borderLeft','5px solid black');
                table.find('td#'+iTarget+'FILE').show();
                cmtTarget.each(function(index){
                    const fileText=table.find('tbody>tr#'+this.parentElement.id+'>td#'+iTarget+'FILE').text();
                    if(this.textContent===''&&fileText!=='') this.style.background='yellow';
                    if(this.textContent+fileText!==''&&ansWatch[index].textContent==='') ansWatch[index].style.background='yellow';
                })
            }
        }
        table.children().children().children('td').filter(function(){
            return this.id.startsWith('SEC');
        }).hide();
        /*隐藏报备不要的列*/
        table.children().children('tr').filter(function () {
            return this.style.display === 'none';
        }).remove();//移除隐藏行
        table.children().children().children('td').filter(function () {
            return this.style.display === 'none';
        }).remove();//移除隐藏列
        table.children().children().children('td').find('table tr').filter(function () {
            return this.style.display === 'none';
        }).remove();//移除隐藏选项信息
        table.attr('border', 1);
        table.find('thead>tr').css('fontWeight', 'bold');
        table.find('tr').css({ height: '90px', verticalAlign: 'top' });
        table.find('thead td').each(function () {
            if (this.textContent === '') return;
            this.innerHTML = (this.title || this.textContent).trim().replace(/\n/g, '<br>');
        });
        table.find('tbody td[id$=ANS]').each(function () {
            if (this.textContent === '') return;
            this.innerHTML = this.textContent.trim().replace(/\n/g, '<br>');
        });
        table.find('a').each(function () {
            this.href = this.href;
        });
        const style = `<style>br{mso-data-placement:same-cell}td{height:90px;vertical-align:top;mso-number-format:\\@}</style>`;
        const blob = new Blob([style + table[0].outerHTML], { type: "application/vnd.ms-excel" });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = new Date().toLocaleString() + '.xls';
        a.click();
        aBtn.css({ pointerEvents: '', opacity: '' });
    }

    function getScoreData(surveyIDArr, func) {
        const postJSON = {
            action: "exec",
            JSONPath: "dataset.data",
            dataset: { datasetname: "/Apps/SM/APIv2/Query/ClientAnalytics/FormElements" },
            parameters: [
                { name: "FormIDs", value: surveyIDArr.toString() },
                { name: "IsIncludeForms", value: 0 },
                { name: "IsIncludeFormElements", value: 0 },
                { name: "IsIncludeFormElementTypes", value: 0 },
                { name: "IsIncludeFormQuestionAnswers", value: 1 },
                { name: "IsIncludeQuestionProperties", value: 0 },
                { name: "IsIncludeQuestionAnswerSetsProperties", value: 1 },
                { name: "IsIncludeGridProperties", value: 0 },
                { name: "IsIncludeLoopProperties", value: 0 },
                { name: "IsIncludeFormQuestionCategories", value: 0 },
                { name: "IsIncludeFormQuestionProperties", value: 0 },
                { name: "IsIncludeFormElementsParentSections", value: 0 },
                { name: "IsIncludeFormVisibility", value: 0 },
                { name: "IsIncludeFormQuestionVisibility", value: 0 }
            ]
        };
        $.post('/open/data.asp', 'post=' + encodeURIComponent(JSON.stringify(postJSON)), data => {
            func(data);
        }, 'json');
    }

    //处理分数信息
    function handleScoreData(data) {
        const QAInfo = { A2Q: {}, Q2A: {} };
        const Q2A = QAInfo.Q2A;
        for (let i in data[3]) {
            const a = data[3][i];
            if (!QAInfo.A2Q[a.AnswerSetID]) QAInfo.A2Q[a.AnswerSetID] = [];
            QAInfo.A2Q[a.AnswerSetID].push(a.QuestionID);
            if (!Q2A[a.QuestionID]) Q2A[a.QuestionID] = {};
            Q2A[a.QuestionID].AnswerSetID = a.AnswerSetID;
            if (!Q2A[a.QuestionID].Answer) Q2A[a.QuestionID].Answer = {};
            if (!Q2A[a.QuestionID].Answer[a.Position]) Q2A[a.QuestionID].Answer[a.Position] = {};
            Q2A[a.QuestionID].Answer[a.Position].Measure = a.Measure;
            Q2A[a.QuestionID].Answer[a.Position].Text = a.Text;
            //Q2A[a.QuestionID].Answer[a.Position].ObjectName=a.ObjectName;
            //Q2A[a.QuestionID].Answer[a.Position].FormID=a.FormID;
        }
        for (let j in data[5]) {
            const s = data[5][j];
            const qidArr = QAInfo.A2Q[s.AnswerSetID];
            if (!qidArr) continue;
            for (let qid of qidArr) {
                Q2A[qid].IsMultipleSelection = s.IsMultipleSelection;
                Q2A[qid].IsBonusPenalty = s.IsBonusPenalty;
                Q2A[qid].CustomPointsPossible = s.CustomPointsPossible;
                Q2A[qid].IsLimitedMeasure = s.IsLimitedMeasure;
                Q2A[qid].LimitMeasureMinimum = s.LimitMeasureMinimum;
                Q2A[qid].LimitMeasureMaximum = s.LimitMeasureMaximum;
                Q2A[qid].StartingPoints = s.StartingPoints;
                Q2A[qid].IsShowMeasure = s.IsShowMeasure;
            }
        }
        return Q2A;
    }

    //将门店信息写入表格
    function outputLocationInfo(operationData) {
        let heading = { LocationName: '门店名称' };
        for (let i = 1; i < 21; i++) {
            const SurveyCustomPropertyValueNum = i > 9 ? 'SurveyCustomPropertyValue0' + i : 'SurveyCustomPropertyValue00' + i;
            const hg = operationData[1][i].HeadingGlobalized;
            if (SurveyCustomPropertyValueNum === hg) continue;
            heading[SurveyCustomPropertyValueNum] = operationData[1][i].HeadingGlobalized;
        }
        heading = {
            ...heading,
            ...{
                Time: '报告时间',
                'Time Out': '出店时间'
            }
        };
        const table = $('table#reporttable_rc');
        const cellIndex = 2;//门店id列后一列
        const htd = table.find('thead td').eq(cellIndex);
        for (let h in heading) htd.before(`<td id=${h}>${heading[h]}</td>`);
        for (let d of operationData[0]) {
            const btd = table.find(`tr#surveyInsID${d.SurveyInstanceID}>td:nth-child(${cellIndex + 1})`);
            for (let h in heading) {
                btd.before(`<td id=${h}>${d[h] || d[heading[h]]}</td>`);
            }
        }
    }

    //将分数信息写入表格
    function outputScoreData(Q2A) {
        const colorDe = GM_getValue('扣分颜色：', 'red');
        const colorNa = GM_getValue('N/A颜色：', 'green');
        const table = $('table#reporttable_rc');
        table.children('tbody').children('tr').each(function () {
            const totalScore = {
                total: { pts: 0, ptsOf: 0 },
                section: {}
            };
            $(this).children('td[id$=ANS]').each(function () {
                if (!this.textContent) return;
                const qid = this.id.replace(/^QID|ANS$/g, '');
                $(this).parent('tr')[0].insData[qid].answerSet = Q2A[qid].Answer;
                const arrSelPos = $(this).find('tr.position>td').text().replace('位置：', '').split(',');
                const score = calculateScore(arrSelPos, Q2A[qid]);
                const color = score[0] < score[1] ? colorDe : arrSelPos.toString() === '0' ? colorNa : '';
                $(this).css('color', color)
                    .find('tbody').append(`<tr class=score><td>分数：${score[0]}/${score[1]}</td></tr>`)
                    .find('td').css('color', color)
                    .filter('tr.content>td').attr('title', Object.values(Q2A[qid].Answer).map(a => a.Text + '\n').join(''));
                totalScore.total.pts += score[0];
                totalScore.total.ptsOf += score[1];
                const section = this.getAttribute('section');
                if (!totalScore.section[section]) totalScore.section[section] = { pts: 0, ptsOf: 0 };
                totalScore.section[section].pts += score[0];
                totalScore.section[section].ptsOf += score[1];
            });
            $(this).children('td#totalScore').text(`${(Math.round(totalScore.total.pts / totalScore.total.ptsOf * 100 * 10) / 10).toFixed(1)}%（${totalScore.total.pts}/${totalScore.total.ptsOf}）`);
            for (let s in totalScore.section) {
                $(this).children(`td[id="SEC_${s}"]`).text(`${(Math.round(totalScore.section[s].pts / totalScore.section[s].ptsOf * 100 * 10) / 10).toFixed(1)}%（${totalScore.section[s].pts}/${totalScore.section[s].ptsOf}）`);
            }
        });
    }

    //计算pts和ptsOf
    function calculateScore(arrSelPos, oQid) {
        if (arrSelPos[0] === '' || oQid === undefined) return [null, null];
        if (arrSelPos.includes('0')) return [0, 0];
        let [pts, ptsOf] = [null, null];
        for (let s of arrSelPos) if (oQid.Answer[s].Measure !== null) pts += oQid.Answer[s].Measure;
        if (pts === null) return [null, null];
        if (oQid.IsMultipleSelection) {
            for (let a in oQid.Answer) ptsOf += oQid.Answer[a].Measure;
        } else {
            for (let a in oQid.Answer) if (oQid.Answer[a].Measure !== null && oQid.Answer[a].Measure > ptsOf) ptsOf = oQid.Answer[a].Measure;
        }
        pts += oQid.StartingPoints;
        ptsOf += oQid.StartingPoints;
        if (oQid.LimitMeasureMinimum !== null && oQid.LimitMeasureMinimum > pts) pts = oQid.LimitMeasureMinimum;
        if (oQid.LimitMeasureMaximum !== null && oQid.LimitMeasureMaximum < pts) pts = oQid.LimitMeasureMaximum;
        if (oQid.IsBonusPenalty !== false) ptsOf = oQid.CustomPointsPossible;
        return [pts, ptsOf];
    }

    //卸载报告预览
    function unREPORTCONTENT() {
        if ($('div#tabPage3Div,li#tabButton3').length) $('div#tabPage3Div,li#tabButton3').remove();
    }


})();
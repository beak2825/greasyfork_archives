// ==UserScript==
// @name         cakeHelper-ACFUN高级弹幕助手
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  更加优雅地制作高级弹幕
// @icon         https://img01.sogoucdn.com/app/a/100520146/e0cc9e822f9cdccd65434f15fabc446c
// @author       幽子幽
// @special_thank 黑小白、夏小正、星雨漂流、莫方
// @match        https://www.acfun.cn/v/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428091/cakeHelper-ACFUN%E9%AB%98%E7%BA%A7%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/428091/cakeHelper-ACFUN%E9%AB%98%E7%BA%A7%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


//非常非常业余的水平，渣技术勿喷

/*
V0.4 - 210617
    首个内测版
*/



(function() {
    'use strict';
    var isubCounter = 0;//初始化计数器
    var subCounterTotal = 0;//初始化弹幕行数计数器
    var subArr = new Array();//初始化字幕数组
    var subStyleArr = new Array();//初始化字幕样式数组
    var dStyle = '';
    var playRes = new Array();//新建视频大小数组

    function addPanel_e210414 () {//加载面板和选项
        //在选择panel添加选择项
        var mDiv = document.querySelector("#danmaku > div.advanced-danmaku-wrapper > div > div > div.danmaku-g-launcher-panel > ul");
        var sth = document.createElement('li');
        sth.setAttribute('data-tab','cakehelper');
        sth.setAttribute('id','cakehelper-launcher');
        sth.setAttribute('class','panel-nav');
        sth.textContent='蛋糕助手';
        mDiv.appendChild(sth);

        //在内容panel添加内容
        mDiv = document.querySelector("#danmaku > div.advanced-danmaku-wrapper > div > div > div.danmaku-g-launcher-panel > div.panel-content-wrapper");
        sth = document.createElement('li');
        sth.setAttribute('data-tab','cakehelper');
        sth.setAttribute('id','cakehelper-content');
        sth.setAttribute('class','panel-content');
        sth.setAttribute('style','margin-left: 9px; width: 330px');
        mDiv.appendChild(sth);
    }
    function addPartFrame_e210414 (name) {//在 #cakehelper-content 下添加分part框架
        var mDiv = document.querySelector("#cakehelper-content");
        var sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-content-' + name);
        sth.setAttribute('style','padding: 20px 0;border-bottom: 1px solid #e5e5e5;width: 100%;overflow-y: auto');
        mDiv.appendChild(sth);
    }
    function addTitle_e210414 (element,name,text) {//在 #cakehelper-content 下添加分part框架
        var mDiv = element;
        var sth = document.createElement('p');
        sth.setAttribute('id','cakehelper-content-title-' + name);
        sth.textContent = text;
        mDiv.appendChild(sth);
    }
    function addTextarea_e210414 (element,name,placeholder) {//在 #cakehelper-content 下添加分part框架
        var mDiv = element;
        var sth = document.createElement('div');
        var newId = 'cakehelper-content-textarea-' + name;
        var oldId = 'cakehelper-content-textarea-' + name;
        newId += '-div1';
        sth.setAttribute('id',newId);
        sth.setAttribute('style','margin-top: 10px;margin-right: 5px');
        mDiv.appendChild(sth);

        mDiv = document.querySelector('#' + newId);
        sth = document.createElement('span');
        newId = oldId + '-span1';
        sth.setAttribute('id',newId);
        sth.setAttribute('class','danmaku-g-input-wrapper danmaku-g-input-textarea-wrapper');
        mDiv.appendChild(sth);

        mDiv = document.querySelector('#' + newId);
        sth = document.createElement('div');
        newId = oldId + '-div2';
        sth.setAttribute('id',newId);
        sth.setAttribute('class','danmaku-g-input-textarea-tips-wrapper');
        mDiv.appendChild(sth);

        mDiv = document.querySelector('#' + newId);
        sth = document.createElement('textarea');
        newId = oldId + '-textarea1';
        sth.setAttribute('id',newId);
        sth.setAttribute('class','danmaku-g-input danmaku-g-input-textarea');
        if (placeholder != undefined) {
            sth.setAttribute('placeholder', placeholder);
        }
        sth.setAttribute('style','height: 150px;');
        mDiv.appendChild(sth);
        sth.onchange = function(){cakehelper_initScript()};//每次变更触发initScript
    }
    function addotherStf1_e210414 () {

        var mDiv = document.querySelector("#cakehelper-content-inputarea");
        var sth = document.createElement('button');
        sth.setAttribute('id','cakehelper-exc');
        sth.setAttribute('class','danmaku-g-button danmaku-g-button-border');
        sth.setAttribute('style','margin-top: 10px; width: 99%');
        sth.textContent='初始化脚本';
        mDiv.appendChild(sth);
        sth.onclick = function(){cakehelper_initScript()};

        sth = document.createElement('input');
        sth.setAttribute('id','cakehelper-lastexecInfo');
        sth.setAttribute('style','margin-top: 7px;width: 99%;height:15px; text-align: center');
        sth.setAttribute('readonly','readonly');
        sth.setAttribute('value','上次执行到第 0 行');
        mDiv.appendChild(sth);

        sth = document.createElement('input');
        sth.setAttribute('id','cakehelper-counterInfo');
        sth.setAttribute('style','margin-top: 7px;width: 99%;height:15px; text-align: center');
        sth.setAttribute('readonly','readonly');
        sth.setAttribute('value','执行到第 ' + isubCounter + ' 行字幕，共计 ' + subCounterTotal + ' 行');
        mDiv.appendChild(sth);

        sth = document.createElement('button');
        sth.setAttribute('id','cakehelper-toNextsub');
        sth.setAttribute('class','danmaku-g-button danmaku-g-button-border');
        sth.setAttribute('style','width: 99%;margin-top:5px;background-color: #fd4c5d;color: #fff;');
        sth.textContent='执行下一行';
        mDiv.appendChild(sth);

        sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-rcounter-row');
        sth.setAttribute('class','row');
        sth.setAttribute('style','padding-left: 10px;padding-top: 10px');
        mDiv.appendChild(sth);

        mDiv = document.querySelector("#cakehelper-rcounter-row");
        sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-rcounter-row-f1');
        sth.setAttribute('class','form-item-wrapper flex');
        mDiv.appendChild(sth);

        sth = document.createElement('label');
        sth.setAttribute('id','cakehelper-rcounter-row-f1-l1');
        sth.setAttribute('class','label');
        sth.textContent='重置到第'
        mDiv.appendChild(sth);

        sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-rcounter-row-f1-d1');
        sth.setAttribute('class','component form-item');
        sth.setAttribute('style','padding: 0 6px');
        sth.setAttribute('title','输入要重置到的行数');
        mDiv.appendChild(sth);

        mDiv = document.querySelector("#cakehelper-rcounter-row-f1-d1");
        sth = document.createElement('input');
        sth.setAttribute('id','cakehelper-rcounter-row-f1-d1-i1');
        sth.setAttribute('class','danmaku-g-input-number');
        sth.setAttribute('style','width: 50px;text-align: center;padding:0px');
        sth.setAttribute('autocomplete','off');
        sth.setAttribute('value','0');
        mDiv.appendChild(sth);

        sth = document.createElement('span');
        sth.setAttribute('id','cakehelper-rcounter-row-f1-d1-s1');
        sth.setAttribute('style','padding: 0 6px');
        sth.textContent = '行'
        mDiv.appendChild(sth);

        sth = document.createElement('button');
        sth.setAttribute('id','cakehelper-execInit');
        sth.setAttribute('class','danmaku-g-button danmaku-g-button-border');
        sth.setAttribute('style','width: 70px');
        sth.textContent='确定';
        mDiv.appendChild(sth);
        sth.onclick = function(){cakehelper_setiSubCounter()};

        addClickBtn("#cakehelper-content-inputarea",'addExec2panelBtn','padding-top: 10px;width: 97%;margin-left:10px','在下面板添加 执行下一行 的按钮',3);
        addClickBtn("#cakehelper-content-inputarea",'addpreviewImBtn','padding-top: 10px;width: 97%;margin-left:10px','执行下一行后自动预览',5);
        document.querySelector("#cakehelper-rcounter-row-f1-d1-i1").onchange = checkV_sub;
        document.querySelector("#cakehelper-toNextsub").onclick = function(){cakehelper_toNextsub()};
        

    }
    function loadFileBtn () {//加载文件到输入内容
        var mDiv = document.querySelector("#cakehelper-content-inputarea");
        var sth = document.createElement('input');
        sth.setAttribute('id','cakehelper-loadFileBtn');
        sth.setAttribute('class','danmaku-g-button danmaku-g-button-border');
        sth.setAttribute('accept','.ass,.lrc,.txt');
        sth.setAttribute('type','file');
        mDiv.appendChild(sth);

        sth = document.createElement('p');//新建标题
        sth.setAttribute('style','position: relative;font-weight: 500;font-size: 14px;font-family: PingFangSC,PingFangSC-Medium;text-align: left;color: #333;line-height: 16px;width: 100%;margin-top:10px');
        sth.textContent = '内容格式选择'
        mDiv.appendChild(sth);

        sth = document.createElement('div');//新建div放置内容格式选择
        mDiv.appendChild(sth);
        sth.outerHTML = '<div id="cH_formatSelectDiv" style="margin-left:0;margin-top: 10px;justify-content:space-around;flex-wrap:initial" class="form-item-wrapper flex"><div style="cursor:pointer;width:100%" class="form-item-wrapper flex"><span class="cakeHelper radio" style="margin-right:6px;" id="cH_Radio_format_ass"></span><label class="label" style="cursor:pointer;">ASS</label></div><div style="cursor:pointer;width:100%" class="form-item-wrapper flex"><span class="cakeHelper radio" style="margin-right:6px;" id="cH_Radio_format_lrc"></span><label class="label" style="cursor:pointer;">LRC</label></div><div style="cursor:pointer;width:100%" class="form-item-wrapper flex"><span class="cakeHelper radio" style="margin-right:6px;" id="cH_Radio_format_txt"></span><label class="label" style="cursor:pointer;">文本</label></div></div>'

        document.querySelector("#cH_formatSelectDiv > div:nth-child(1)").onclick = function () {cREv(3)};
        document.querySelector("#cH_formatSelectDiv > div:nth-child(2)").onclick = function () {cREv(4)};
        document.querySelector("#cH_formatSelectDiv > div:nth-child(3)").onclick = function () {cREv(5)};
        document.querySelector("#cakehelper-loadFileBtn").onclick = function(){document.querySelector("#cakehelper-loadFileBtn").value=""};
        document.querySelector("#cakehelper-loadFileBtn").onchange = function(){cakehelper_loadFile()};

    }
    function addMoveInfo () {
        var mDiv = document.querySelector("#cakehelper-content-inputarea");
        var sth = document.createElement('p');
        sth.setAttribute('id','cakehelper-content-title2');
        sth.textContent = '运动信息相关';
        mDiv.appendChild(sth);

        sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-content-title2-Br');
        sth.setAttribute('class','row');
        sth.setAttribute('style','padding-left: 10px');
        mDiv.appendChild(sth);

        mDiv = document.querySelector("#cakehelper-content-title2-Br");
        sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-content-title2-r1');
        sth.setAttribute('class','row');
        mDiv.appendChild(sth);

        mDiv = document.querySelector("#cakehelper-content-title2-r1");
        sth = document.createElement('span');
        sth.textContent = '持续时间录入到…'
        sth.setAttribute('class','danmaku-g-checkbox-text')
        sth.setAttribute('style','margin-bottom:10px;padding-left:0;font-size:16px;color:#000')
        mDiv.appendChild(sth);

        sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-content-title2-r1-f1');
        sth.setAttribute('class','form-item-wrapper flex');
        mDiv.appendChild(sth);

        addRadioBtns('#cakehelper-content-title2-r1-f1','cH_Radio1','margin-right:6px;',1);
        document.querySelector('#cH_Radio1').className = "cakeHelper radio selected"

        mDiv = document.querySelector("#cakehelper-content-title2-r1-f1");
        mDiv.onclick = function(){cREv(1)}
        sth = document.createElement('label');
        sth.setAttribute('id','cakehelper-content-title2-r1-f1-l1');
        sth.setAttribute('class','label');
        sth.textContent='持续时间设置到第'
        mDiv.appendChild(sth);

        sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-content-title2-r1-f1-d1');
        sth.setAttribute('class','component form-item');
        sth.setAttribute('title','输入操作的动作');
        mDiv.appendChild(sth);

        mDiv = document.querySelector("#cakehelper-content-title2-r1-f1-d1");
        sth = document.createElement('input');
        sth.setAttribute('id','cakehelper-content-title2-r1-f1-d1-i1');
        sth.setAttribute('class','danmaku-g-input-number');
        sth.setAttribute('style','width: 50px;text-align: center;padding:0px');
        sth.setAttribute('value','1');
        sth.setAttribute('autocomplete','off');
        mDiv.appendChild(sth);

        sth = document.createElement('span');
        sth.setAttribute('id','cakehelper-content-title2-r1-f1-d1-s1');
        sth.setAttribute('style','padding: 0 6px');
        sth.textContent = '个动作的持续时间'
        mDiv.appendChild(sth);

        mDiv = document.querySelector("#cakehelper-content-title2-r1");
        sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-content-title2-r1-f2');
        sth.setAttribute('style','margin-left:0;margin-top: 5px;cursor:pointer;');
        sth.setAttribute('class','form-item-wrapper flex');
        mDiv.appendChild(sth);

        addRadioBtns('#cakehelper-content-title2-r1-f2','cH_Radio2','margin-right:6px;',2);

        mDiv = document.querySelector("#cakehelper-content-title2-r1-f2");
        mDiv.onclick = function(){cREv(2)}
        sth = document.createElement('label');
        sth.setAttribute('id','cakehelper-content-title2-r1-f2-l1');
        sth.setAttribute('class','label');
        sth.setAttribute('style','cursor:pointer;');
        sth.textContent='持续时间录入到 总字幕计时'
        mDiv.appendChild(sth);

        document.querySelector("#cakehelper-content-title2-r1-f1-d1-i1").onchange = function(){checkV_mT('#cakehelper-content-title2-r1-f1-d1-i1')};

        addMoveShortcutBtns();
        addMoveShortcut();

        mDiv = document.querySelector("#cakehelper-content-title2-Br");
        sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-content-title2-r3');//创建第三行
        sth.setAttribute('style','margin-top:10px;width:98%');
        sth.setAttribute('class','row');
        mDiv = mDiv.appendChild(sth);

        sth = document.createElement('span');//新增标题行
        sth.textContent = '动作面板增强…';
        sth.setAttribute('class','danmaku-g-checkbox-text')
        sth.setAttribute('style','margin-bottom:10px;padding-left:0;font-size:16px;color:#000')
        mDiv.appendChild(sth);
        
        sth = document.createElement('div');//新增div标签包含
        sth.setAttribute('style','margin-top:0px;display:flex;flex-wrap:wrap;')
        mDiv = mDiv.appendChild(sth);

        sth = document.createElement('botton');//新增按钮
        sth.setAttribute('class','danmaku-g-button danmaku-g-button-border');
        sth.setAttribute('style','margin-bottom:5px;');
        sth.setAttribute('id','cH_mangeActionInCollectionBtn');
        sth.textContent = '管理收藏的动作';
        mDiv.appendChild(sth);

        sth = document.createElement('botton');//新增按钮
        sth.setAttribute('class','danmaku-g-button danmaku-g-button-border');
        sth.setAttribute('style','margin-bottom:5px;');
        sth.setAttribute('id','cH_loadacchafilesPanelBtn');
        sth.textContent = '导入外部收藏动作';
        mDiv.appendChild(sth);

        sth = document.createElement('botton');//新增按钮
        sth.setAttribute('class','danmaku-g-button danmaku-g-button-border');
        sth.setAttribute('style','margin-bottom:5px;');
        sth.setAttribute('id','cH_exportAllAinCBtn');
        sth.textContent = '导出全部收藏动作';
        mDiv.appendChild(sth);
        
        document.querySelector('#cH_mangeActionInCollectionBtn').onclick = function () {
            addNewActionCollect(undefined,4);//呼出管理面板
        };

        document.querySelector('#cH_loadacchafilesPanelBtn').onclick = function () {
            addNewActionCollect(undefined,6);//呼出导入文件面板
        };

        document.querySelector('#cH_exportAllAinCBtn').onclick = function () {
            exportActionsData();//导出收藏的动作到文件并开始下载
        }

    }
    function addMoveShortcut () {//动作作面板快捷复制按钮反馈事件
        let count = readConfig(2,'moveShortCutBtns');
        if (count === '' || count === null) {
            return;
        }
        count = count.split('/');
        let mDiv = document.querySelector("div.section.move-base > div.section-content")
        if (document.querySelector('#cakehelper-shortcutDiv') != null) {//已创建
            document.querySelector('#cakehelper-shortcutDiv').remove();//全部删除重建
        };
        let sth = document.createElement('div');
        sth.setAttribute('class', 'row flex mgt-10 move-pos');
        sth.setAttribute('id', 'cakehelper-shortcutDiv');
        sth.setAttribute('style', 'margin-left:3.5%');
        mDiv.appendChild(sth);

        mDiv = document.querySelector("#cakehelper-shortcutDiv")

        for (let i = 0; i<count.length; i++) {
            let n = parseInt(count[i]);
            sth = document.createElement('button');
            sth.setAttribute('class', 'danmaku-g-button danmaku-g-button-border');
            if (mDiv.childElementCount % 3 === 0) {//新的一行
                sth.setAttribute('style', 'margin-top:8px;width: 90px;padding: 4px');
            } else {//左边有按钮
                sth.setAttribute('style', 'margin-left:7px;margin-top:8px;width: 90px;padding: 4px');
            }
            if (n === 1) {
                sth.setAttribute('id', 'cakehelper-sX2eXBtn');
                sth.textContent = '起点X→终点X';
                mDiv.appendChild(sth);
                document.querySelector('#cakehelper-sX2eXBtn').onclick = function(){mPosChange(1)};
            }
            if (n === 2) {
                sth.setAttribute('id','cakehelper-sX2aftersXBtn');
                sth.textContent = '起点X→后起X';
                mDiv.appendChild(sth);
                document.querySelector('#cakehelper-sX2aftersXBtn').onclick = function(){mPosChange(2)};
            }
            if (n === 3) {
                sth.setAttribute('id','cakehelper-sX2allXBtn');
                sth.textContent = '起点X→所有X';
                mDiv.appendChild(sth);
                document.querySelector('#cakehelper-sX2allXBtn').onclick = function(){mPosChange(3)};
            }
            if (n === 4) {
                sth.setAttribute('id','cakehelper-sY2eYBtn');
                sth.textContent = '起点Y→终点Y';
                mDiv.appendChild(sth);
                document.querySelector('#cakehelper-sY2eYBtn').onclick = function(){mPosChange(4)};
            }
            if (n === 5) {
                sth.setAttribute('id','cakehelper-sY2aftersYBtn');
                sth.textContent = '起点Y→后起Y';
                mDiv.appendChild(sth);
                document.querySelector('#cakehelper-sY2aftersYBtn').onclick = function(){mPosChange(5)};
            }
            if (n === 6) {
                sth.setAttribute('id','cakehelper-sY2allYBtn');
                sth.textContent = '起点Y→所有Y';
                mDiv.appendChild(sth);
                document.querySelector('#cakehelper-sY2allYBtn').onclick = function(){mPosChange(6)};
            };
            if (n === 7) {
                sth.setAttribute('id','cakehelper-sXY2endXYBtn');
                sth.textContent = '起XY→终XY';
                mDiv.appendChild(sth);
                document.querySelector('#cakehelper-sXY2endXYBtn').onclick = function(){mPosChange(8)};
            };
            if (n === 8) {
                sth.setAttribute('id','cakehelper-eXY2allXYBtn');
                sth.textContent = '终XY→后全XY';
                mDiv.appendChild(sth);
                document.querySelector('#cakehelper-eXY2allXYBtn').onclick = function(){mPosChange(9)};
            };
        }

        return;

    }
    function addMoveShortcutBtns () {//添加快捷复制按钮
        let mDiv = document.querySelector("#cakehelper-content-title2-Br");
        let sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-content-title2-r2');
        sth.setAttribute('class','row');
        mDiv.appendChild(sth);

        mDiv = document.querySelector("#cakehelper-content-title2-r2");
        sth = document.createElement('span');
        sth.textContent = '添加快捷复制按钮…'
        sth.setAttribute('class','danmaku-g-checkbox-text')
        sth.setAttribute('style','margin-top:10px;padding-left:0;font-size:16px;color:#000')
        mDiv.appendChild(sth);

        sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-content-addMoveSCBs')
        sth.setAttribute('class','component form-item')
        sth.setAttribute('style','width: 95%;margin-left:0')
        mDiv.appendChild(sth);
        sth = '#cakehelper-content-addMoveSCBs';
        addClickBtn(sth,'addMoveSCB1','padding-top: 10px;width: 100%;margin-left:0','起点X → 终点X',1);
        addClickBtn(sth,'addMoveSCB2','padding-top: 10px;width: 100%;margin-left:0','起点X → 之后起点X',1);
        addClickBtn(sth,'addMoveSCB3','padding-top: 10px;width: 100%;margin-left:0','起点X → 所有起终点X',1);
        addClickBtn(sth,'addMoveSCB4','padding-top: 10px;width: 100%;margin-left:0','起点Y → 终点Y',1);
        addClickBtn(sth,'addMoveSCB5','padding-top: 10px;width: 100%;margin-left:0','起点Y → 之后起点Y',1);
        addClickBtn(sth,'addMoveSCB6','padding-top: 10px;width: 100%;margin-left:0','起点Y → 所有起终点Y',1);
        addClickBtn(sth,'addMoveSCB7','padding-top: 10px;width: 100%;margin-left:0','起点XY → 终点XY',1);
        addClickBtn(sth,'addMoveSCB8','padding-top: 10px;width: 100%;margin-left:0','终点XY → 往后所有起终点XY',1);
        let count = readConfig(2,'moveShortCutBtns');
        if (count === '' || count === null) {
            return;
        }
        count = count.split('/');
        setTimeout(function () {
            for (let i = 0; i < count.length; i++) {
                let n = parseInt(count[i]);
                document.querySelector("#cakehelper-content-addMoveSCB" + n + "-s1").className = "danmaku-g-checkbox danmaku-g-checkbox-checked";
            }
        }, 100)


    }
    function addVersionInfo () {//版本信息
        var mDiv = document.querySelector("#cakehelper-content-inputarea");
        var sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-content-vInfo-r1');
        sth.setAttribute('class','row');
        mDiv.appendChild(sth);

        mDiv = document.querySelector("#cakehelper-content-vInfo-r1");
        sth = document.createElement('label');
        sth.setAttribute('id','cakehelper-content-vInfo-l1');
        sth.setAttribute('class','label');
        sth.setAttribute('style','font-weight:bold;color: #000');
        sth.textContent='版本：V0.4 - 内测版';
        mDiv.appendChild(sth);

    }
    function addBaseInfo () {

        var mDiv = document.querySelector("#cakehelper-content-inputarea");
        var sth = document.createElement('p');
        sth.setAttribute('id','cakehelper-content-title3');
        sth.textContent = '基础信息相关';
        mDiv.appendChild(sth);

        sth = document.createElement('div');
        sth.setAttribute('id','cakehelper-content-uasssform');
        mDiv.appendChild(sth);

        addClickBtn("#cakehelper-content-uasssform",'uassstyle','padding-left: 10px;width: 90%','使用字幕中的Style样式(仅限ASS导入)',6);
        addClickBtn("#cakehelper-content-inputarea",'addETimeBtn','padding-top: 10px;width: 97%;margin-left:10px','启用结束时间计时器',2);

    }
    function addAssStyleSel () {
        addClickBtn("#cakehelper-content-uasssform",'uassfont','padding-top: 10px;padding-left: 10px;width: 90%','字体大小');
        addClickBtn("#cakehelper-content-uasssform",'uasscolor','padding-top: 10px;padding-left: 10px;width: 90%','主要颜色');
        document.querySelector("#cakehelper-content-uassfont-btn").click()
        document.querySelector("#cakehelper-content-uasscolor-btn").click()

    }
    function removeAssStyleSel () {
        document.querySelector("#cakehelper-content-uassfont").remove();
        document.querySelector("#cakehelper-content-uasscolor").remove();
    }

    function addClickBtn (pEleName,setName,div1Style,text,number) {//用于批量创建选择框，cEv函数处理反馈事件

        var mDiv = document.querySelector(pEleName);
        var sth = document.createElement('div');
        let clsEle = "#cakehelper-content-" + setName + "-s1"
        sth.setAttribute('id','cakehelper-content-' + setName);
        sth.setAttribute('class','component form-item');
        sth.setAttribute('style',div1Style);
        mDiv.appendChild(sth);

        mDiv = document.querySelector("#cakehelper-content-" + setName);
        sth = document.createElement('label');
        sth.setAttribute('id',"cakehelper-content-" + setName + "-l1");
        sth.setAttribute('class','danmaku-g-checkbox-wrapper');
        mDiv.appendChild(sth);

        mDiv = document.querySelector("#cakehelper-content-" + setName + "-l1");
        sth = document.createElement('span');
        sth.setAttribute('id',"cakehelper-content-" + setName + "-s1");
        sth.setAttribute('class','danmaku-g-checkbox');
        mDiv.appendChild(sth);

        sth = document.createElement('span');
        let id1 = "cakehelper-content-" + setName + "-s2"
        sth.setAttribute('id',id1);
        sth.setAttribute('class','danmaku-g-checkbox-text');
        sth.textContent = text;
        mDiv.appendChild(sth);
        document.querySelector("#" + id1).onclick = function(){cEv(clsEle,number)};


        mDiv = document.querySelector("#cakehelper-content-" + setName + "-s1");
        sth = document.createElement('span');
        let id2 = "cakehelper-content-" + setName + "-btn"
        sth.setAttribute('id',id2);
        sth.setAttribute('class','danmaku-g-checkbox-inner');
        mDiv.appendChild(sth);
        document.querySelector("#" + id2).onclick = function(){cEv(clsEle,number)};
    }
    function cEv (eleName,n) {//n为创建时的number
        if (document.querySelector(eleName).className === "danmaku-g-checkbox danmaku-g-checkbox-checked") {
            document.querySelector(eleName).className = "danmaku-g-checkbox";
        } else {
            document.querySelector(eleName).className = "danmaku-g-checkbox danmaku-g-checkbox-checked";
        };
        if (n === 1) {
            var count = '';
            for (let i = 1; i <= document.querySelector("#cakehelper-content-addMoveSCBs").childElementCount; i++){
                if (document.querySelector("#cakehelper-content-addMoveSCB" + i + "-s1").className === "danmaku-g-checkbox danmaku-g-checkbox-checked") {
                    if (count === '') {
                        count = count + i;
                    } else {
                        count = count + '/' + i ;
                    }

                }
            }
            saveConfig(2,'moveShortCutBtns',count);
            addMoveShortcut();
        };
        if (n === 2) {
            if (document.querySelector(eleName).className === "danmaku-g-checkbox" && document.querySelector("#cH_endTimeDiv") != null) {
                document.querySelector("#cH_SinActionTimepick").remove();
                document.querySelector("#cH_endTimeDiv").remove();
                saveConfig(1, 'useETimer', 'false');
                return;
            };
            addEndtimeBtn();
            saveConfig(1, 'useETimer', 'true');

        };
        if (n === 3){//添加底部向下执行的按钮
            if (document.querySelector(eleName).className === "danmaku-g-checkbox" && document.querySelector("#cH_addExec2panelDiv") != null){
                document.querySelector("#go2next_dpanel").style.opacity = '0'
                setTimeout(function(){document.querySelector("#cH_addExec2panelDiv").remove()},300);
                saveConfig(1,'addExec2panel','false');
                return;
            }
            let mDiv = document.querySelector("div.panel-actions > div.mgt-20");
            let sth = document.createElement('div');
            sth.setAttribute('class','component');
            sth.setAttribute('id','cH_addExec2panelDiv');
            mDiv.insertBefore(sth,document.querySelector("div.panel-actions > div.mgt-20 > div:nth-child(2)"))
            document.querySelector("#cH_addExec2panelDiv").innerHTML = '<button class="danmaku-g-button danmaku-g-button-primary" style="border-color:cornflowerblue;background-color:cornflowerblue;transition-duration: .3s;opacity:0" id="go2next_dpanel">向下执行</button>';
            setTimeout(function(){document.querySelector("#go2next_dpanel").style.opacity = '1'},50);
            saveConfig(1,'addExec2panel','true');
            document.querySelector("#go2next_dpanel").onclick = function(){cakehelper_toNextsub()};
        };
        if (n === 4) {//总字幕计时下是否自动执行处理操作
            if (document.querySelector("#cakehelper-content-zdzxZzmjsBtn-s1").className === 'danmaku-g-checkbox danmaku-g-checkbox-checked') {
                checkV_mT('#cakehelper-content-title2-r1-f3-d1-i1');
                saveConfig(2, 'duration2R2_auto', 'true');
                if (document.querySelector("cakehelper-content-title2-r1-f3-d1-i1").value != '') {
                    saveConfig(2, 'duration2R2_action', document.querySelector("#cakehelper-content-title2-r1-f3-d1-i1").value);
                }
            } else {
                saveConfig(2, 'duration2R2_auto', 'false');
            }
        };
        if (n === 5) {//执行下一行后立即预览
            if (document.querySelector("#cakehelper-content-addpreviewImBtn-s1").className === 'danmaku-g-checkbox danmaku-g-checkbox-checked'){
                saveConfig(1,'addpreviewIm','true');
            } else {
                saveConfig(1,'addpreviewIm','false');
            }
            
        };
        if (n === 6){//使用字幕中的Style样式
            if (document.querySelector(eleName).className === "danmaku-g-checkbox danmaku-g-checkbox-checked") {//选中
                addAssStyleSel();
            } else {//取消选中
                removeAssStyleSel();
            };
        }
    }
    function checkV_mT (eleName) {//检查输入框的数值是否大于现有动作数
        let i = document.querySelector("#danmaku > div.advanced-danmaku-wrapper > div > div > div.danmaku-g-launcher-panel > div.panel-content-wrapper > div.panel-content > div > div.section.move-list > div > ul").childElementCount
        if (parseInt(document.querySelector(eleName).value) > i-1) {
            showTips('warning','输入值不得大于现有动作数')
            document.querySelector(eleName).value = '';
            document.querySelector(eleName).focus();
            return;
        } else {
            if (parseInt(document.querySelector(eleName).value) <= 0) {
                showTips('warning','输入值不得为负数或零')
                document.querySelector(eleName).value = '0';
                document.querySelector(eleName).focus();
                return;
            }
        }
    }
    function checkV_sub () {//检查输入值是否超过现有行数
        if (parseInt(document.querySelector("#cakehelper-rcounter-row-f1-d1-i1").value) > subCounterTotal) {
            showTips('warning','输入值不得大于现有行数')
            document.querySelector("#cakehelper-rcounter-row-f1-d1-i1").value = '0';
            document.querySelector("#cakehelper-rcounter-row-f1-d1-i1").focus();
            return;
        } else {
            if (parseInt(document.querySelector("#cakehelper-rcounter-row-f1-d1-i1").value) < 0) {
                showTips('warning','输入值不得为负数')
                document.querySelector("#cakehelper-rcounter-row-f1-d1-i1").value = '0';
                document.querySelector("#cakehelper-rcounter-row-f1-d1-i1").focus();
                return;
            }
        }
    }

    function cakehelper_initScript () {//脚本初始化
        var str = document.querySelector("#cakehelper-content-textarea-1-textarea1").value
        if (str.length === 0){
            return;
        }
        if (dStyle === 'ass') {
            subArr = str.match(/Dialogue.*/gm);//匹配所有对话
            if (subArr === null) {
                showTips('error','请确认格式是否为ASS，未检查到Dialogue语句。',2000);
                return;
            }
            subStyleArr = str.match(/Style: (.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*)/g);//匹配字体样式
            subCounterTotal = subArr.length;
            playRes = new Array();//重置数组
            if (str.match(/playresx:(.*)/i) != null && str.match(/playresy:(.*)/i) != null) {
                playRes.push(parseInt(str.match(/playresx:(.*)/i)[1]));
                playRes.push(parseInt(str.match(/playresy:(.*)/i)[1]));
            }
            cakehelper_setiSubCounter()//重置进度
        };
        if (dStyle === 'lrc') {
            //LRC标准格式每行match(/\[(.*?):(.*?)\.(.*?)\]/)，取得开头时间轴
            subArr = str.match(/\[.*?:.*?\..*?\](.*$)/gm);//取得每行匹配LRC格式的文本
            subCounterTotal = subArr.length;
            cakehelper_setiSubCounter()//重置进度
        };
        if (dStyle === 'txt'){
            subArr = str.split('\n');//行分割
            subCounterTotal = subArr.length;
            cakehelper_setiSubCounter()//重置进度
        }
    }

    function cakehelper_setiSubCounter () {//重置进度
        checkV_sub()
        document.querySelector("#cakehelper-lastexecInfo").setAttribute('value','上次执行到第 ' + isubCounter + ' 行');
        isubCounter = parseInt(document.querySelector("#cakehelper-rcounter-row-f1-d1-i1").value);//重置计数器
        document.querySelector("#cakehelper-counterInfo").setAttribute('value','执行到第 ' + isubCounter + ' 行字幕，共计 ' + subCounterTotal + ' 行');//重置counter显示
        showTips('success','初始化完成');
    }

    function cakehelper_toNextsub () {//执行下一行
        if (isubCounter + 1 > subCounterTotal){
            showTips('warning','已经到最后啦！');
            return;
        }
        let mtm = document.querySelector("#cakehelper-content-title2-r1-f1-d1-i1").value;
        let fill = document.querySelector("#cakehelper-content-title2-r1-f3-d1-i1");
        
        if (dStyle === 'ass' || dStyle === 'lrc' ) {//ass/lrc格式下条件判断
            
            if (mtm === '' && document.querySelector("#cH_Radio2").className === 'cakeHelper radio') {//需要确认未启用总字幕计时
                showTips('error', '未设置字幕时间应填入第几动作');
                return;
            } else {
                mtm = String(parseInt(mtm) - 1)
            };
            if (fill != null && document.querySelector("#cakehelper-content-zdzxZzmjsBtn-s1").className === 'danmaku-g-checkbox danmaku-g-checkbox-checked') {//先确认存在且已勾选自动处理功能
                let fill_n = parseInt(fill.value)
                if (fill_n === NaN) {
                    showTips('error', '自动将剩余时间填入到动作的数值有误，请修正');
                    return;
                };
            };
        }

        isubCounter ++;//计数器+1
        document.querySelector("#cakehelper-counterInfo").setAttribute('value','执行到第 ' + isubCounter + ' 行字幕，共计 ' + subCounterTotal + ' 行');//重置counter显示

        if (dStyle === 'ass'){//正式处理-ass
            let nowSub = subArr[isubCounter-1];
            let startTime = getCTime('0:00:00.00', sepSub(nowSub, 'kssj'));
            let moveTime = getCTime(sepSub(nowSub, 'kssj'), sepSub(nowSub, 'jssj'));
            let dmnr = sepSub(nowSub,'dmnr').replace(/\\n/gi,'\n');
            changeDanmuParamMuti(['startTimeNow','isBaseExpaned','startTime'],[false,true,startTime]);
            if (document.querySelector("#cH_Radio2").className === 'cakeHelper radio') {//未启用总字幕计时
                changeDanmuParam('moveTime',moveTime,mtm)
            } else {//启用了总字幕计时，不需要替换moveTime，直接存入总字幕计时输入框
                document.querySelector("#zzmjsInput").value = moveTime;
            }
            changeDanmuParam('content',dmnr)

            if (document.querySelector("#cakehelper-content-uassstyle-s1").className === 'danmaku-g-checkbox danmaku-g-checkbox-checked') {//选中了按照字幕style
                let subSty = ''
                if (document.querySelector("#cakehelper-content-uassfont-s1").className === 'danmaku-g-checkbox danmaku-g-checkbox-checked') {//选中导入字体大小
                    subSty = sepSubStyle(sepSub(nowSub, 'style'), '', 1);
                    changeDanmuParam('fontSize',parseInt(subSty[2]));
                }
                if (document.querySelector("#cakehelper-content-uasscolor-s1").className === 'danmaku-g-checkbox danmaku-g-checkbox-checked') {//选中导入字体颜色
                    subSty = sepSubStyle(sepSub(nowSub, 'style'), 3.1);
                    changeDanmuParam('color', '#' + subSty);
                }

            }

            showTips('info','第' + isubCounter + '行导入成功');
            
            if (fill != null && document.querySelector("#cakehelper-content-zdzxZzmjsBtn-s1").className === 'danmaku-g-checkbox danmaku-g-checkbox-checked') {//存在且已勾选自动处理功能【排错已在前面实现
                adjustMovetime ('第' + isubCounter + '行导入成功')
            };
        };
        if (dStyle === 'lrc'){//正式处理-lrc
            let nowSub = subArr[isubCounter-1];
            let nextSub = subArr[isubCounter];
            let dmnr = nowSub.match(/\[.*?:.*?\..*?\](.*$)/);//取得文本内容
            let time = nowSub.match(/\[(.*?):(.*?)\.(.*?)\]/)//取得分/秒/毫秒【数组1-2-3】
            
            let startTime = getCTime('0:00:00.00', '0:' + time[1] + ':' + time[2] + '.' + time[3]);
            let moveTime = 0;
            if(nextSub === undefined){//运行到最后没有下一个时间节点
                moveTime = 5000;//默认为5000
            } else {
                let nextTime = nextSub.match(/\[(.*?):(.*?)\.(.*?)\]/)//取得分/秒/毫秒【数组1-2-3】
                let nextStartTime = getCTime('0:00:00.00', '0:' + nextTime[1] + ':' + nextTime[2] + '.' + nextTime[3]);
                moveTime = nextStartTime - startTime;
            }
            
            changeDanmuParamMuti(['startTimeNow','isBaseExpaned','startTime'],[false,true,startTime]);
            if (document.querySelector("#cH_Radio2").className === 'cakeHelper radio') {//未启用总字幕计时
                changeDanmuParam('moveTime',moveTime,mtm)
            } else {//启用了总字幕计时，不需要替换moveTime，直接存入总字幕计时输入框
                document.querySelector("#zzmjsInput").value = moveTime;
            }
            changeDanmuParam('content',dmnr)
        }
        if (dStyle === 'txt'){//正式处理-文本
            let nowSub = subArr[isubCounter-1];
            while (nowSub === '') {
                isubCounter ++;
                nowSub = subArr[isubCounter-1];
                if (isubCounter === subCounterTotal + 1){//运行到最后一行
                    showTips('success','全部运行完毕');
                    isubCounter = subCounterTotal;
                    return;
                }
                
            }
            changeDanmuParam('content',nowSub)
        }
        if (document.querySelector("#cakehelper-content-addpreviewImBtn-s1").className === 'danmaku-g-checkbox danmaku-g-checkbox-checked') {
            let previewDanmaku = window["player"].$plugins[9].launcher.previewDanmaku;
            try{
                previewDanmaku();
            }
            catch(err){
                alert('无法执行预览弹幕语句\n错误描述：'+err)
            }
        }

        if (isubCounter === subCounterTotal){//运行到最后一行
            showTips('success','全部运行完毕');
            isubCounter ++;//不重置显示，看不见
            return;
        }


    }

    function cakehelper_loadFile () {//选择文件后运行
        if (document.querySelector("#cakehelper-loadFileBtn").files.length === 0){
            console.log('请选择文件！');
            return;
        } else {
            var rD = new FileReader()
            rD.onloadend = function(){
                document.querySelector("#cakehelper-content-textarea-1-textarea1").value = rD.result;
                let path = document.querySelector("#cakehelper-loadFileBtn").files[0].name
                let filename = path.substr(path.lastIndexOf(".")+1);
                filename = filename.toLowerCase();
                if (filename === 'ass'){
                    document.querySelector("#cH_formatSelectDiv > div:nth-child(1)").click();
                };
                if (filename === 'lrc'){
                    document.querySelector("#cH_formatSelectDiv > div:nth-child(2)").click();
                };
                if (filename === 'txt'){
                    document.querySelector("#cH_formatSelectDiv > div:nth-child(3)").click();
                };
                cakehelper_initScript();
            }
            rD.readAsText(document.querySelector("#cakehelper-loadFileBtn").files[0]);

        }

    }

    function getCTime (st,et) {//获得字幕持续时间【ASS用】,返回值为数字类型
        //匹配时间，并转化为整数方便计算
        let sArr = st.match(/(.*):(.*):(.*)\.(.*)/);
        let eArr = et.match(/(.*):(.*):(.*)\.(.*)/);
        let sth = parseInt(sArr[1]);
        let stm = parseInt(sArr[2]);
        let sts = parseInt(sArr[3]);
        let stms = parseInt(sArr[4]);
        let eth = parseInt(eArr[1]);
        let etm = parseInt(eArr[2]);
        let ets = parseInt(eArr[3]);
        let etms = parseInt(eArr[4]);
        return (eth - sth)*3600000 + (etm - stm)*60000 + (ets - sts)*1000 + (etms - stms)*10;

    }

    function showTips (which,text,timeout) {//提示信息：何种类型[error,success,info,warning]，文字内容
        document.querySelector("span.danmaku-g-toast-content").textContent = text//设置提示文字
        document.querySelector("div.panel-message-wrapper > span").className = 'danmaku-g-toast-wrapper danmaku-g-toast-bottom danmaku-g-toast-show danmaku-g-toast-' + which;//显示提示框
        if (timeout === undefined){
            timeout = 1000
        }
        setTimeout(function(){document.querySelector("div.panel-message-wrapper > span").className = 'danmaku-g-toast-wrapper danmaku-g-toast-bottom danmaku-g-toast-warning';},timeout)
    }

    function sepSub (text,type) {//分离字幕

        var sReg = '(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*)';//设定标准匹配
        for (var l = 9; l != text.match(/,/g).length; l++) {//返回有多少个逗号，正文存在逗号则添加到匹配
            sReg += ',(.*)';
        };
        var Arr = text.match(RegExp(sReg));
        if (Arr.length != 11) {//非标准情况，超过9个逗号，即有后续逗号，合并到Arr的第[10]里
            for (l = 11; l <= Arr.length - 1; l++) {
                Arr[10] += ',' + Arr[l];
            };
        Arr.length = 11;//删除其他多余数组成员
        };
        //console.log(Arr)
        if (type === 'kssj') {//开始时间
            return Arr[2];
        };
        if (type === 'jssj') {//结束时间
            return Arr[3];
        };
        if (type === 'kssj1') {//开始时间.转换后-用于填入input
            return Arr[2].replace('.',':')+'0';
        };
        if (type === 'dmnr') {//弹幕内容
            return Arr[10];
        };
        if (type === 'style') {//字幕样式名
            return Arr[4];
        }

    }

    function sepSubStyle (name,which,full) {//分离字幕样式
        var text = new Array();
        for (var l = 0; l < subStyleArr.length; l++) {
            text = subStyleArr[l].match(/Style: (.*)*/)[1];
            text = text.split(",");
            if (text[0] === name) {
                l = subStyleArr.length;
            } else {
                text = ''
            }
        }
        if (text != '') {
            if (full != undefined) {
                return text;//返回全部，数组形式
            } else {
                if (which === 3.1) {//主要颜色代码ASS到HTML转换
                    let tstyle = text[3].match(/&...(..)(..)(..)/);
                    return tstyle[3] + tstyle[2] + tstyle[1];
                } else {
                    return text[which];//返回某个值
                }
            }
        }
    }

    function addCakehelper() {//初始化面板

        addPanel_e210414();
        addPartFrame_e210414('inputarea');
        addTitle_e210414(document.querySelector("#cakehelper-content-inputarea"), '1', '输入内容(支持格式:ASS/LRC/TXT)');
        loadFileBtn();
        addTextarea_e210414(document.querySelector("#cakehelper-content-inputarea"), '1', '输入批处理文本');
        addotherStf1_e210414();
        addBaseInfo();
        addMoveInfo();
        addVersionInfo();
        createActionPlus();
        addCSS();
        loadHistory();//最后一步，加载历史记录
        document.querySelector("#danmaku > div.advanced-danmaku-wrapper > div > div > div.danmaku-g-launcher-panel > ul > li:nth-child(1)").click();//完成后点击基础信息
        console.log('脚本 cakeHelper-高级弹幕助手 加载完毕')

    }


    var timerc = setInterval(function(){//等待加载
        if (document.querySelector("#danmaku > div.advanced-danmaku-wrapper > div > div > div.danmaku-g-launcher-panel > ul") != null) {
            clearInterval(timerc);
            addCakehelper();
        }
    },1000);


function mPosChange (way) {//批处理弹幕开始结束位置
    let active = document.querySelector("li.move.active").dataset.index;
    let count = document.querySelector("ul.move-tab").childElementCount - 1//获得值为动作数+1,-1为动作数
    let nArr = new Array();
    let vArr = new Array();
    let iArr = new Array();
    if (way === 1) {//开始x复制到结束x
        let string = getDanmuParam('startPosX',active);//获取现正活跃的动作的开始X
        changeDanmuParam('endPosX',string,active);
    }
    if (way === 2) {//开始x复制到之后所有开始x
        let string = getDanmuParam('startPosX',active);//获取现正活跃的动作的开始X
        for(let i = parseInt(active)+1;i < count;i++){
            nArr.push('startPosX');
            vArr.push(string);
            iArr.push(i);
        }
        if (nArr != []){
            changeDanmuParamMuti(nArr,vArr,iArr);
        }
    }
    if (way === 3) {//开始X复制到所有X
        let string = getDanmuParam('startPosX',active);//获取现正活跃的动作的开始X
        for(let i = 0;i < count;i++){
            nArr.push('startPosX');
            vArr.push(string);
            iArr.push(i);
            nArr.push('endPosX');
            vArr.push(string);
            iArr.push(i);
        }
        if (nArr != []){
            changeDanmuParamMuti(nArr,vArr,iArr);
        }
    }
    if (way === 4) {//开始y复制到结束y
        let string = getDanmuParam('startPosY',active);
        changeDanmuParam('endPosY',string,active);
    }
    if (way === 5) {//开始y复制到之后所有开始y
        let string = getDanmuParam('startPosY',active);//获取现正活跃的动作的开始X
        for(let i = parseInt(active)+1;i < count;i++){
            nArr.push('startPosY');
            vArr.push(string);
            iArr.push(i);
        }
        if (nArr != []){
            changeDanmuParamMuti(nArr,vArr,iArr);
        }
    }
    if (way === 6) {//开始y复制到所有y
        let string = getDanmuParam('startPosY',active);//获取现正活跃的动作的
        for(let i = 0;i < count;i++){
            nArr.push('startPosY');
            vArr.push(string);
            iArr.push(i);
            nArr.push('endPosY');
            vArr.push(string);
            iArr.push(i);
        }
        if (nArr != []){
            changeDanmuParamMuti(nArr,vArr,iArr);
        }
    }
    if (way === 7) {//结束x复制到所有结束x
        let string = getDanmuParam('endPosX',active);//获取现正活跃的动作的
        for(let i = 0;i < count;i++){
            nArr.push('endPosX');
            vArr.push(string);
            iArr.push(i);
        }
        if (nArr != []){
            changeDanmuParamMuti(nArr,vArr,iArr);
        }
    }
    if (way === 8) {//起点XY到终点XY
        let stringX = getDanmuParam('startPosX',active);//获取现正活跃的动作的开始X
        let stringY = getDanmuParam('startPosY',active);//获取现正活跃的动作的开始Y
        changeDanmuParamMuti(['endPosX','endPosY'],[stringX,stringY],[active,active]);
    };
    if (way === 9){//终点XY到之后所有的XY
        let stringX = getDanmuParam('endPosX',active);//获取现正活跃的动作的结束X
        let stringY = getDanmuParam('endPosY',active);//获取现正活跃的动作的结束Y
        for(let i = parseInt(active)+1;i < count;i++){
            nArr.push('startPosX');
            vArr.push(stringX);
            iArr.push(i);
            nArr.push('endPosX');
            vArr.push(stringX);
            iArr.push(i);
            nArr.push('startPosY');
            vArr.push(stringY);
            iArr.push(i);
            nArr.push('endPosY');
            vArr.push(stringY);
            iArr.push(i);
        }
        if (nArr != []){
            changeDanmuParamMuti(nArr,vArr,iArr);
        }

    }
    showTips('success','操作完成');
}

function changeDanmuParam (name,value,index) {//使用JSON解析，大小写敏感，需要注意输入的类型为数字还是字符串或布尔值；传入参数：1-名字，2需要替换的字符 || 1-名字，2需要替换的字符，3-动作数(从0开始)
    const source = localStorage.getItem('DANMAKU_G_LAUNCHER_CACHE');//导入弹幕库
    const sJson = JSON.parse(source);//解析
    let oJson = sJson;
    if (index === undefined) {//没有动作数，即需要修改基础信息面板中的参数
        oJson[name] = value;
    } else {//有动作数，修改指定动作的参数
        oJson.actions[parseInt(index)][name] = value;
    };
    //完成后重新合成
    let output = JSON.stringify(oJson);
    localStorage.setItem('DANMAKU_G_LAUNCHER_CACHE',output);//保存
    let launcher_loadHistory = window["player"].$plugins[9].launcher.loadHistory;//加载到面板
    try{
        launcher_loadHistory();
    }
    catch(err){
        alert('无法导入缓存弹幕\n错误描述：' + err)
    }
}
function changeDanmuParamMuti (nameArr,valueArr,indexArr) {//【批量操作】使用JSON解析，大小写敏感，需要注意输入的类型为数字还是字符串或布尔值；传入参数：1-名字，2需要替换的字符 || 1-名字，2需要替换的字符，3-动作数(从0开始)
    const source = localStorage.getItem('DANMAKU_G_LAUNCHER_CACHE');//导入弹幕库
    const sJson = JSON.parse(source);//解析
    let oJson = sJson;
    nameArr.forEach(
        function(now,index){
            if (indexArr === undefined || indexArr[index] === '' || indexArr[index] === undefined){//当前行修改基础信息
                oJson[now] = valueArr[index];
            } else {//当前行修改动作信息
                oJson.actions[parseInt(indexArr[index])][now] = valueArr[index];
            }
        }
    );
    //完成后重新合成
    let output = JSON.stringify(oJson);
    localStorage.setItem('DANMAKU_G_LAUNCHER_CACHE',output);//保存
    let launcher_loadHistory = window["player"].$plugins[9].launcher.loadHistory;//加载到面板
    try{
        launcher_loadHistory();
    }
    catch(err){
        alert('无法导入缓存弹幕\n错误描述：' + err)
    }
}



function getDanmuParam (name,index) {//使用JSON解析，大小写敏感；传入参数：1-名字 || 1-名字，2-动作数(从0开始)
    const source = localStorage.getItem('DANMAKU_G_LAUNCHER_CACHE');//导入弹幕库
    const sJson = JSON.parse(source);//解析
    if (index === undefined) {//没有动作数，即需要返回基础信息面板中的参数
        return sJson[name];
    } else {//有动作数，询问指定动作的参数
        return sJson.actions[parseInt(index)][name];
    }

}


function saveConfig (n, t, e) {//写入配置到缓存
    var config;
    var m;
    if (n === 1) {//1为存入Basic
        config = localStorage.getItem('cakeHelper.basic');
        m = 'basic';
        if (config === null) {
            config = '';
        };
    };
    if (n === 2) {//2为存入action
        config = localStorage.getItem('cakeHelper.action');
        m = 'action';
        if (config === null) {
            config = '';
        };
    };
    let reg = new RegExp(t + ':(.*?),', 'i');
    let oldParam = config.match(reg)
    let newParam = t + ":" + e + ','
    if (config === '' || oldParam === null) {//无内容或无参数
        config = config + newParam;//新增参数
    } else {
        config = config.replace(oldParam[0], newParam);
    };
    localStorage.setItem('cakeHelper.' + m, config);
    return 'ok';
}

function readConfig (n, t) {//读取写入到缓存的配置
    var config;
    if (n === 1) {//1为存入Basic
        config = localStorage.getItem('cakeHelper.basic');
    };
    if (n === 2) {//2为存入action
        config = localStorage.getItem('cakeHelper.action');
    };
    if (config === null) {
        return config;
    } else {
        let reg = new RegExp(t + ':(.*?),', 'i');
        if (config.match(reg) != null) {
            return config.match(reg)[1];
        } else {
            return null;
        }
    }
}

function cREv (n) {//单选框触发事件
    if (n === 1){//用于cH_Radio1点击后触发
        if (document.querySelector('#cH_Radio2').className === "cakeHelper radio selected") {
            document.querySelector('#cH_Radio2').className = "cakeHelper radio";
            document.querySelector('#cH_Radio1').className = "cakeHelper radio selected";
            if (document.querySelector("#zzmjsDiv") != null){
                document.querySelector("#zzmjsDiv").remove()
                document.querySelector("#cakehelper-content-title2-r1-f3").remove()
            }
            saveConfig(2,'duration2','Radio1');
            saveConfig(2,'duration2R2_auto','false');
        };
    };
    if (n === 2){//用于cH_Radio2点击后触发
        if (document.querySelector('#cH_Radio1').className === "cakeHelper radio selected") {
            document.querySelector('#cH_Radio1').className = "cakeHelper radio";
            document.querySelector('#cH_Radio2').className = "cakeHelper radio selected";
            saveConfig(2,'duration2','Radio2');
            if (document.querySelector("#cakehelper-content-zdzxZzmjsBtn") === null) {
                addzdzxZzmjsBtn();
            }
            if (document.querySelector("#zzmjsDiv") === null){
                createTimeAdjustBtn();
            }
        };
    };
    if (n === 3){
        document.querySelector('#cH_Radio_format_lrc').className = "cakeHelper radio";
        document.querySelector('#cH_Radio_format_txt').className = "cakeHelper radio";
        document.querySelector("#cH_Radio_format_ass").className = "cakeHelper radio selected";
        dStyle = 'ass';
    };
    if (n === 4){
        document.querySelector('#cH_Radio_format_ass').className = "cakeHelper radio";
        document.querySelector('#cH_Radio_format_txt').className = "cakeHelper radio";
        document.querySelector("#cH_Radio_format_lrc").className = "cakeHelper radio selected";
        dStyle = 'lrc';
    };
    if (n === 5){
        document.querySelector('#cH_Radio_format_lrc').className = "cakeHelper radio";
        document.querySelector('#cH_Radio_format_ass').className = "cakeHelper radio";
        document.querySelector("#cH_Radio_format_txt").className = "cakeHelper radio selected";
        dStyle = 'txt';
    };
}

function addRadioBtns (mDiv,id,exStyle,n) {
    mDiv = document.querySelector(mDiv);
    let sth = document.createElement('span');
    sth.setAttribute('class', 'cakeHelper radio');
    if (exStyle != null || exStyle != undefined){
        sth.setAttribute('style', exStyle);
    }
    sth.setAttribute('id', id);
    mDiv.appendChild(sth);
    
    mDiv.onclick = function(){cREv('#' + id,n)};
}


function createTimeAdjustBtn () {

    let mDiv = document.querySelector("div.section.move-base > div.section-content");
    let sth = document.createElement('div');
    sth.setAttribute('style', 'margin-top:10px;transition-duration: 2s');
    sth.setAttribute('class', 'row');
    sth.setAttribute('id', 'zzmjsDiv');
    mDiv.insertBefore(sth, document.querySelector("div.section.move-base > div.section-content > div.row.mgt-20"));
    document.querySelector("#zzmjsDiv").innerHTML = '<div class="form-item-wrapper flex"><label class="label">总字幕计时</label><div class="component form-item" title="1s=1000ms" data-key="moveTime"><div class="danmaku-g-input-number-wrapper"><span class="danmaku-g-input-number-addon" style="right: 5%">ms</span><input class="danmaku-g-input-number" autocomplete="off" id="zzmjsInput" value="100"><div class="danmaku-g-input-number-disabled-content"><span class="danmaku-g-input-number-disabled-content-show"></span></div></div></div><span class="danmaku-g-input-time-pickr" title="依据总字幕计时调整现动作持续时间"><span class="danmaku-g-icon"></span></span></div>';
    document.querySelector("#zzmjsDiv > div > span.danmaku-g-input-time-pickr").onclick = function () {adjustMovetime()};
    document.querySelector("#zzmjsInput").onchange = function () {checkZzmjs()};
    
}
function checkZzmjs () {
    let e = document.querySelector("#zzmjsInput").value
    var o;
    if (e.match(/(\D)/g) != null){
        showTips('error','检测到非数字，请修改');
        return;
    };
    e = parseInt(e);//文本到整数
    let aCount = document.querySelector("ul.move-tab").childElementCount - 1
    if (e < 100 * aCount) {
        showTips('error','总字幕计时不小于' + 100 * aCount + 'ms');
        o = 100 * aCount;
        document.querySelector("#zzmjsInput").value = String(o)
    };
    if (e > 30000 * aCount) {
        showTips('error','总字幕计时不得大于' + 30000 * aCount + 'ms');
        o = 30000 * aCount;
        document.querySelector("#zzmjsInput").value = String(o)
    };

}
function adjustMovetime (showOthertips) {
    let e = document.querySelector("#zzmjsInput").value
    let ttime = 0;
    if (e.match(/(\D)/g) != null){
        showTips('error','检测到非数字，请修改');
        return;
    };
    e = parseInt(e);//文本到整数
    let aCount = document.querySelector("ul.move-tab").childElementCount - 1
    let active = document.querySelector("li.move.active").dataset.index;
    if (e < 100 * aCount) {
        showTips('error','总字幕计时不小于' + 100 * aCount + 'ms');
        return;
    };
    if (e > 30000 * aCount) {
        showTips('error','总字幕计时不得大于' + 30000 * aCount + 'ms');
        return;
    };
    for (let i = 0; i < aCount; i++){
        if (i != active) {
            ttime = ttime + parseInt(getDanmuParam('moveTime',i));
        };
    }
    if (ttime >= e){
        showTips('error','其他动作持续时间大于总字幕计时');
        return;
    }
    let o = e - ttime;
    changeDanmuParam('moveTime',o,active);//o需要为数字类型
    if (showOthertips != undefined){
        showTips('success',showOthertips);
    } else {
        showTips('success','成功');
    }
    
}

function adjustMovetime2 (showOthertips) {//用于计算和填入特定动作的持续时间
    let stime = getDanmuParam('startTime');//输出开始计时时间毫秒（数值）
    let etime = parseInt(window["player"].currentTime*1000);//获得现在时间并取整
    if (etime <= stime){//判断
        showTips('error','结束时间不得早于或等于开始时间');
        return;
    };
    let active = document.querySelector("li.move.active").dataset.index;//现选中的动作数
    let adduptime = stime;//开始时间+前面动作累计时间
    for (let i = 0; i < active; i++) {
        adduptime = adduptime + getDanmuParam('moveTime', i);
    };
    if (etime <= adduptime){//判断
        showTips('error','累计时间大于结束时间');
        return;
    };
    changeDanmuParam('moveTime',etime - adduptime,active);//o需要为数字类型
    if (showOthertips != undefined){
        showTips('success',showOthertips);
    } else {
        showTips('success','成功');
    }
    
}

function addCSS () {
    let nod = document.createElement("style");
    nod.textContent = `
    .cakeHelper.radio{
        border: 3px solid #e3e3e3;
        display: inline-block;
        padding: 4px;
        background: #e3e3e3;
        border-radius: 200px;
        box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.04);
        width:12px;
        height:12px;
        cursor:pointer;
        transition-duration: .3s;
    }
    .cakeHelper.radio.selected{
        background: #fd4c5d
    }
    #cakehelper-content-title-1{
        position: relative;font-weight: 500;font-size: 14px;font-family: PingFangSC,PingFangSC-Medium;text-align: left;color: #333;line-height: 16px;width: 100%
    }
    #cakehelper-content-title3{
        font-weight: 500;font-size: 14px;font-family: PingFangSC,PingFangSC-Medium;text-align: left;color: #333;line-height: 16px;width: 97%;margin-top: 8px;border-top:1px solid;border-color: #e5e5e5;padding-top: 7px;padding-bottom: 15px
    }
    #cakehelper-content-vInfo-r1{
        width:100%;text-align:center;margin-top: 15px;padding-top: 15px;border-top:1px solid;border-color: #e5e5e5
    }
    #cakehelper-loadFileBtn{
        margin-top: 5px; width: 99%; height: 35px
    }
    #cakehelper-content-title2{
        font-weight: 500;font-size: 14px;font-family: PingFangSC,PingFangSC-Medium;text-align: left;color: #333;line-height: 16px;width: 97%;margin-top: 8px;border-top:1px solid;border-color: #e5e5e5;padding-top: 7px;padding-bottom: 15px
    }
    @keyframes fade-in {
        0% {opacity: 0;}/*初始状态 透明度为0*/  
        100% {opacity: 1;}/*结束状态 透明度为1*/  
    }
    @keyframes fade-in0_7 {
        0% {opacity: 0;}/*初始状态 透明度为0*/  
        100% {opacity: 0.7;}/*结束状态 透明度为1*/  
    }
    .cH_actionPlus{
        border-top: 1px solid #e5e5e5;color: #666;margin: 0;font-size: 100%;font: inherit;vertical-align: baseline;box-sizing: border-box;text-align: left;padding: 20px 0;width: 100%;display:flex;justify-content: space-around;align-items: center;flex-wrap: wrap;
    }
    .cH_modal_mange_actionBtn{
        margin: 5px;font-family: inherit;text-transform: none;-webkit-appearance: button;display: inline-block;font-weight: 400;line-height: 1.5;text-align: center;text-decoration: none;vertical-align: middle;background-color: transparent;border: 1px solid transparent;font-size: 1rem;border-radius: .25rem;transition: all .3s ease-in-out;color: #dc3545;border-color: #dc3545;padding:5px 10px;cursor: pointer;width:auto;
    }
    .cH_modal_mange_actionBtn:hover{
        background-color:#fd4c5c;color:white;
    }
    .cH_modal_mange_actionBtn.active{
        background-color:#fd4c5c;color:white;
    }
    #cH_modal_addBtn{
        background-color: orange;border-color: orange;
    }
    #cH_modal_changeBtn{
        background-color: #0d6efd;border-color: #0d6efd;
    }
    #cH_modal_delBtn{
        background-color: #fd4c5c;border-color: #fd4c5c;
    }
    .cH_modal_mange_mainDiv{
        margin: 2%;font-family:sans-serif;font-size:16px;width:auto;display:flex;flex-wrap: wrap;justify-content:space-around;
    }
    .cH_modal_mange_Btns{
        color: #FFF;border-radius: 3px;text-align:center;width:100px;line-height:30px;cursor:pointer;font-size:16px;transition: all .3s ease-in-out;
    }
    .cH_modal_mange_Btns:hover{
        box-shadow:2px 2px 3px #aaa;color:#000;
    }
    #cH_modal_closeBtn{
        width:20px;height:20px;background-color:red;float:right;border-radius:200px;margin-right:2%;cursor:pointer
    }
    #cH_modal_closeBtn:hover{
        box-shadow:2px 2px 3px #aaa;color:#000;
    }
    #cH_modal_box{
        z-index: 992; width: 600px; max-height: 600px; background-color: rgb(255, 255, 255); border-radius: 10px; border: 1px solid rgba(0, 0, 0, 0.3); box-shadow: rgba(0, 0, 0, 0.3) 0px 3px 7px; transition: opacity 0.3s linear 0s; opacity: 1;
    }
    .cH_modal_box_title{
        padding:3% 1% 2% 4%;font-size:16px;font-weight:bold;font-family:sans-serif;border-bottom: 1px solid #333333;color:#000
    }
    .cH_modal_box_bottomBtns{
        display:flex;justify-content: center;align-items: center;margin-bottom:2%;
    }
    #cH_modal_YesBtn{
        background-color: #fd4c5c;border-color: #fd4c5c;color: #FFF;border-radius: 3px;text-align:center;width:100px;line-height:30px;cursor:pointer
    }
    .cH_modal_flex{
        display:flex;justify-content: center;align-items: center;z-Index:991;width:100%;height:100%;position:fixed;left:0;top:0;animation: fade-in;animation-duration: .5s;transition: all 0.3s linear 0s;
    }
    .cH_modal_bg{
        position: fixed;left: 0px;top: 0px;z-index: 990;background-color:#FFF;opacity: 0.7;width: 100%;height: 100%;animation: fade-in0_7;animation-duration: .5s;transition: all 0.3s linear 0s;
    }
    `
    document.head.appendChild(nod);
}
//addCSS()
function calcDuration () {

    let endTime = window["player"].currentTime;
    const startTime = getDanmuParam('startTime');
    endTime = parseInt(String(endTime*1000).split('.')[0]);
    let duration = endTime - startTime;
    if (duration <= 0){
        showTips('error','结束时间不能等于或早于开始时间')
        return;
    }
    if (document.querySelector("#cH_Radio2").className === 'cakeHelper radio selected') {
        document.querySelector("#zzmjsInput").value = duration;
        showTips('success','已填入到总字幕计时');
        setTimeout(function(){checkZzmjs()},1000);
    } else {
        let acName = parseInt(document.querySelector("#cakehelper-content-title2-r1-f1-d1-i1").value)
        changeDanmuParam('moveTime',duration,acName-1);//o需要为数字类型
        showTips('success','已填入到第'+ acName +'个动作');
    }

}
//calcDuration()

function addEndtimeBtn() {
    let mDiv = document.querySelector("div.section.base-seeting > div.section-content");
    let sth = document.createElement('div');
    sth.setAttribute('class','row mgt-20');
    sth.setAttribute('id','cH_endTimeDiv');
    mDiv.insertBefore(sth,document.querySelector("div.section.base-seeting > div.section-content > div:nth-child(2)"));
    document.querySelector("#cH_endTimeDiv").innerHTML = '<div class="form-item-wrapper flex"><label class="label">结束时间</label><span class="danmaku-g-input-time-pickr" title="拾取结束时间" style="margin-left:6px"><span class="danmaku-g-icon"></span></span></div>';
    mDiv = document.querySelector("div.section.move-base > div.section-content > div:nth-child(1) > div");
    sth = document.createElement('span');
    mDiv.appendChild(sth);
    sth.outerHTML = '<span class="danmaku-g-input-time-pickr" id="cH_SinActionTimepick" title="现在时间-开始时间-前面动作时间"><span class="danmaku-g-icon"></span></span>';

    document.querySelector("#cH_SinActionTimepick").onclick = function () {adjustMovetime2()};
    document.querySelector("#cH_endTimeDiv > div > span").onclick = function(){calcDuration()};
}
//addEndtimeBtn()

function addzdzxZzmjsBtn() {
    let mDiv = document.querySelector('#cakehelper-content-title2-r1');
    let sth = document.createElement('div');
    sth.setAttribute('id','cakehelper-content-title2-r1-f3');
    sth.setAttribute('class','form-item-wrapper flex');
    sth.setAttribute('style','margin-top:5px');
    mDiv.appendChild(sth);

    addClickBtn("#cakehelper-content-title2-r1-f3",'zdzxZzmjsBtn','margin-top:2px;','',4);

    mDiv = document.querySelector("#cakehelper-content-title2-r1-f3");
    sth = document.createElement('label');
    sth.setAttribute('id','cakehelper-content-title2-r1-f3-l1');
    sth.setAttribute('class','label');
    sth.setAttribute('style','margin-left:0');
    sth.textContent='执行后自动将剩余时间填入到动作'
    mDiv.appendChild(sth);

    sth = document.createElement('div');
    sth.setAttribute('id','cakehelper-content-title2-r1-f3-d1');
    sth.setAttribute('class','component form-item');
    sth.setAttribute('title','输入操作的动作');
    sth.setAttribute('style','margin-top:3px;')
    mDiv.appendChild(sth);

    mDiv = document.querySelector("#cakehelper-content-title2-r1-f3-d1");
    sth = document.createElement('input');
    sth.setAttribute('id','cakehelper-content-title2-r1-f3-d1-i1');
    sth.setAttribute('class','danmaku-g-input-number');
    sth.setAttribute('style','width: 50px;text-align: center;padding:0px');
    sth.setAttribute('value','1');
    sth.setAttribute('autocomplete','off');
    mDiv.appendChild(sth);

    document.querySelector("#cakehelper-content-title2-r1-f3-d1-i1").onchange = function(){
        checkV_mT('#cakehelper-content-title2-r1-f3-d1-i1');
        if (document.querySelector("#cakehelper-content-title2-r1-f3-d1-i1").value != null) {
            saveConfig(2, 'duration2R2_action', document.querySelector("#cakehelper-content-title2-r1-f3-d1-i1").value);
        }
    }

}

function loadHistory () {//批量加载所有历史记录
    var nowConfig;
    //处理【持续时间录入到】
    nowConfig = readConfig(2,'duration2')
    if (nowConfig === 'Radio1') {
        cREv(1);
    };
    if (nowConfig === 'Radio2') {
        cREv(2);
        nowConfig = readConfig(2,'duration2R2_auto');
        if (nowConfig === 'true'){
            cEv("#cakehelper-content-zdzxZzmjsBtn-s1",4);
            nowConfig = readConfig(2,'duration2R2_action');
            if (nowConfig != null){
                document.querySelector("#cakehelper-content-title2-r1-f3-d1-i1").value = nowConfig
            }
        };
    };
    nowConfig = readConfig(1,'addExec2panel');//处理 在下面板添加 执行下一行 的按钮
    if (nowConfig === 'true'){
        cEv("#cakehelper-content-addExec2panelBtn-s1",3);
    }
    nowConfig = readConfig(1,'addpreviewIm');//处理 执行下一行后自动预览
    if (nowConfig === 'true'){
        cEv("#cakehelper-content-addpreviewImBtn-s1",5);
    };
    nowConfig = readConfig(1,'useETimer');//处理 启用结束时间计时器
    if (nowConfig === 'true'){
        cEv("#cakehelper-content-addETimeBtn-s1",2);
    };

}

function addNewActionCollect(params,style,callback) {//添加面板并处理面板中相关事件的回调
    if (style === 3 || style === 4){
        var actionName = loadActionsName();
        if (actionName === undefined && style === 3){
            showText1z1(undefined,'无收藏的动作',1000);
            return;
        }
    }

    let sth = document.createElement('div');
    sth.setAttribute('class', 'cH_modal_bg');
    document.body.appendChild(sth);//生成0.7透明度div

    sth = document.createElement('div');
    sth.setAttribute('class', 'cH_modal_flex');
    let mDiv = document.body.appendChild(sth);//生成主div框

    if (style === 1) {//增加一个新的动作收藏
        mDiv.innerHTML = '<div id="cH_modal_box"><div class="cH_modal_box_title">增加一个新的动作收藏<div id="cH_modal_closeBtn"></div></div><div style="margin: 4% 1% 3% 10%;font-family:sans-serif;font-size:16px">名字<input style="margin: 0 0 0 5%;font-family:sans-serif;font-size:16px;width:70%;border: none !important;border-bottom: solid thin #ccc !important;outline: none !important;padding: 5px !important;" id="cH_modal_Name"></div><div style="margin: 0 1% 3% 10%;font-family:sans-serif;font-size:16px;"><div><label>参数</label></div><textarea style="margin: 3% 0px 0px; font-family: sans-serif; font-size: 16px; width: 480px; height: 238px;resize: none" id="cH_modal_Param"></textarea></div><div class="cH_modal_box_bottomBtns"><div id="cH_modal_YesBtn">确定</div></div></div>';
    }
    if (style === 2) {//导入动作参数
        mDiv.innerHTML = '<div id="cH_modal_box"><div class="cH_modal_box_title">增加一个新的动作收藏<div id="cH_modal_closeBtn"></div></div><div style="margin: 3% 1% 3% 10%;font-family:sans-serif;font-size:16px;"><div><label>参数</label></div><textarea style="margin: 3% 0px 0px; font-family: sans-serif; font-size: 16px; width: 480px; height: 238px;resize: none" id="cH_modal_Param"></textarea></div><div class="cH_modal_box_bottomBtns"><div id="cH_modal_YesBtn">确定</div></div></div>';
    }
    if (style === 3) {
        mDiv.innerHTML = `<div id="cH_modal_box"><div class='cH_modal_box_title'>使用收藏中的动作<div id="cH_modal_closeBtn"></div></div><div class="cH_modal_mange_mainDiv"></div></div>`;

        mDiv = document.querySelector("#cH_modal_box > div.cH_modal_mange_mainDiv");
        actionName.forEach(
            function(now){
                sth = document.createElement('botton');
                sth.setAttribute('class','cH_modal_mange_actionBtn');
                sth.textContent = now;
                mDiv.appendChild(sth);
                let selector = sth;
                sth.onclick = function(){
                    document.querySelector("#cH_modal_box > div.cH_modal_mange_mainDiv").childNodes.forEach(
                        function(nowNode){
                            if (selector === nowNode) {
                                setActions(2,selector.textContent);//2，传入收藏的动作名字
                                document.querySelector('div.cH_modal_bg').style.opacity = '0';
                                document.querySelector('div.cH_modal_flex').style.opacity = '0';
                                setTimeout(function(){
                                    document.querySelector('div.cH_modal_bg').remove();
                                    document.querySelector('div.cH_modal_flex').remove();
                                    document.documentElement.style.overflowY = 'scroll'; 
                                    showText1z1(undefined, '动作已导入', 1000, 'left: 10px;bottom: 10px;background: #666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding: 10px;text-align:center;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;opacity:0;transition-duration: 1s;font-size:20px');
                                },300)
                            }
                        }
                    )
                }
            }
        )
    }
    if (style === 4) {
        mDiv.innerHTML = `<div id="cH_modal_box"><div class="cH_modal_box_title">管理收藏中的动作<div id="cH_modal_closeBtn"></div></div><div class="cH_modal_mange_mainDiv"></div><div class="cH_modal_box_bottomBtns" style="justify-content:space-around"><div id="cH_modal_addBtn" class="cH_modal_mange_Btns">添加</div><div id="cH_modal_changeBtn" class="cH_modal_mange_Btns">修改</div><div id="cH_modal_delBtn" class="cH_modal_mange_Btns">删除</div></div></div>`;

        mDiv = document.querySelector("#cH_modal_box > div.cH_modal_mange_mainDiv");
        actionName.forEach(
            function(now){
                sth = document.createElement('botton');
                sth.setAttribute('class','cH_modal_mange_actionBtn');
                sth.textContent = now;
                mDiv.appendChild(sth);
                let selector = sth;
                sth.onclick = function(){
                    document.querySelector("#cH_modal_box > div.cH_modal_mange_mainDiv").childNodes.forEach(
                        function(nowNode){
                            if (selector === nowNode) {
                                selector.className = 'cH_modal_mange_actionBtn active';
                            } else {
                                nowNode.className = 'cH_modal_mange_actionBtn';
                            }
                        }
                    )
                }
            }
        )
    };

    if (style === 5) {//修改动作参数
        mDiv.innerHTML = '<div id="cH_modal_box"><div class="cH_modal_box_title">修改收藏中的动作<div id="cH_modal_closeBtn"></div></div><div style="margin: 4% 1% 3% 10%;font-family:sans-serif;font-size:16px">名字<input style="margin: 0 0 0 5%;font-family:sans-serif;font-size:16px;width:70%;border: none !important;border-bottom: solid thin #ccc !important;outline: none !important;padding: 5px !important;" id="cH_modal_Name"></div><div style="margin: 0 1% 3% 10%;font-family:sans-serif;font-size:16px;"><div><label>参数</label></div><textarea style="margin: 3% 0px 0px; font-family: sans-serif; font-size: 16px; width: 480px; height: 238px;resize: none" id="cH_modal_Param"></textarea></div><div class="cH_modal_box_bottomBtns"><div id="cH_modal_YesBtn">确定</div></div></div>';
        document.querySelector("#cH_modal_Name").value = params;
        document.querySelector("#cH_modal_Param").value = loadActions(params);

    };

    if (style === 6) {//导入accha动作收藏文件【依赖saveActions和loadActionsName】
        mDiv.innerHTML = '<div id="cH_modal_box"><div class="cH_modal_box_title">导入accha动作收藏文件<div id="cH_modal_closeBtn"></div></div><div style="display:flex;align-items:center;justify-content:center"><input type="file" style="margin:2%;padding:2%;border:2px solid red" accept=".accha" id="cH_loadacchafileBtn"></div><div class="cH_modal_box_bottomBtns"><div id="cH_modal_YesBtn">确定</div></div></div>'
    }

    document.documentElement.style.overflowY = 'hidden';

    if (params != undefined && style != 5){
        document.querySelector('#cH_modal_Param').value = params
    }

    document.querySelector('#cH_modal_closeBtn').onclick = function () {
        document.querySelector('div.cH_modal_bg').style.opacity = '0';
        document.querySelector('div.cH_modal_flex').style.opacity = '0';
        setTimeout(function(){
            document.querySelector('div.cH_modal_bg').remove();
            document.querySelector('div.cH_modal_flex').remove();
            document.documentElement.style.overflowY = 'scroll';
            if (callback === 4) {
                addNewActionCollect(undefined,4);
            };
        },300);

    }

    if (document.querySelector('#cH_modal_YesBtn') != null) {
        document.querySelector('#cH_modal_YesBtn').onclick = function () {
            if (style === 1 || style === 5) {
                if (document.querySelector('#cH_modal_Name').value != '' && document.querySelector('#cH_modal_Param').value != '') {
                    let name = document.querySelector('#cH_modal_Name').value;
                    saveActions(name, document.querySelector('#cH_modal_Param').value);
                    if (style === 5) {
                        if (name != params) {//修改了动作信息的名字
                            deleteActions(params);
                        }
                    }
                    document.querySelector('div.cH_modal_bg').style.opacity = '0';
                    document.querySelector('div.cH_modal_flex').style.opacity = '0';
                    setTimeout(function () {
                        document.querySelector('div.cH_modal_bg').remove();
                        document.querySelector('div.cH_modal_flex').remove();
                        document.documentElement.style.overflowY = 'scroll';
                        showText1z1(undefined, '动作 ' + name + ' 已保存', 1000, 'left: 10px;bottom: 10px;background: #666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding: 10px;text-align:center;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;opacity:0;transition-duration: 1s;font-size:20px');
                        if (callback === 4) {
                            addNewActionCollect(undefined, 4);
                        }
                    }, 300)

                } else {
                    showText1z1(document.querySelector('div.cH_modal_flex'), 'ERR:名字/参数未填写', 1000, 'background: rgb(102, 102, 102);color: rgb(255, 255, 255);overflow: hidden;z-index: 9999;position: fixed;padding: 20px;text-align: center;border-radius: 4px;opacity: 1;transition-duration: 1s;font-size:24px')
                }
            };
            if (style === 2) {
                if (document.querySelector('#cH_modal_Param').value != '') {
                    let action = document.querySelector('#cH_modal_Param').value;
                    setActions(1, action);
                    setTimeout(function () {
                        document.querySelector('div.cH_modal_bg').remove();
                        document.querySelector('div.cH_modal_flex').remove();
                        document.documentElement.style.overflowY = 'scroll';
                        showText1z1(undefined, '动作已导入', 1000, 'left: 10px;bottom: 10px;background: #666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding: 10px;text-align:center;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;opacity:0;transition-duration: 1s;font-size:20px');
                    }, 300)
                }
            };
            if (style === 6) {//【依赖saveActions和loadActionsName】
                let inFrame = document.querySelector("#cH_loadacchafileBtn")
                if (inFrame.files.length === 0) {
                    showText1z1(document.querySelector('div.cH_modal_flex'), '请选择文件！', 300, 'background: rgb(102, 102, 102);color: rgb(255, 255, 255);overflow: hidden;z-index: 9999;position: fixed;padding: 20px;text-align: center;border-radius: 4px;opacity: 1;transition-duration: 1s;font-size:24px');
                    return;
                } else {
                    var rD = new FileReader()
                    rD.onloadend = function () {
                        let res = rD.result;
                        if (res != '') {
                            //做分割
                            let jConfig = JSON.parse(res);
                            let nameArr = jConfig.names;
                            let actionArr = jConfig.action;
                            let existNameArr = loadActionsName();
                            //作比对
                            if (existNameArr != undefined) {//如果不存在现有数组，即不需担心重名问题
                                let nowTime = Math.round(new Date().getTime()/1000);//取现行unix时间
                                nameArr.forEach(//名字数组
                                    function (now, index) {//每个名字与存在动作的名字比对，并取出i
                                        existNameArr.forEach(//现存动作名字
                                            function (exist) {//存在动作的名字
                                                if (now === exist) {//如果名字重复则加后缀
                                                    if (confirm('导入的动作 ' + now + ' 与现有收藏动作重名\n请问是否覆盖(选择取消会给动作名添加后缀后导入)') === false) {//询问用户是否直接覆盖缓存中的动作
                                                        nameArr[index] = now + '_' + nowTime;//变更数组中的名字
                                                    }
                                                }
                                            }
                                        )
                                    }
                                )
                            };
                            //写入
                            nameArr.forEach(
                                function(now,index){
                                    saveActions(now,actionArr[index]);
                                }
                            )
                        };
                        setTimeout(function () {
                            document.querySelector('div.cH_modal_bg').remove();
                            document.querySelector('div.cH_modal_flex').remove();
                            document.documentElement.style.overflowY = 'scroll';
                            showText1z1(undefined, '动作已导入', 1000, 'left: 10px;bottom: 10px;background: #666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding: 10px;text-align:center;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;opacity:0;transition-duration: 1s;font-size:20px');
                            if (callback === 4) {
                                addNewActionCollect(undefined,4);
                            };
                        }, 300)
                    }
                    rD.readAsText(inFrame.files[0]);

                }
            }
        }
    }

    if (document.querySelector('#cH_modal_changeBtn') != null && document.querySelector("#cH_modal_addBtn") != null && document.querySelector("#cH_modal_delBtn") != null) {
        document.querySelector('#cH_modal_addBtn').onclick = function () {
            setTimeout(function () {
                document.querySelector('div.cH_modal_bg').remove();
                document.querySelector('div.cH_modal_flex').remove();
                document.documentElement.style.overflowY = 'scroll';
                addNewActionCollect(undefined,1,4);
            }, 300)
            
        }
        document.querySelector('#cH_modal_changeBtn').onclick = function () {
            let nowActiveActionName = document.querySelector("#cH_modal_box > div.cH_modal_mange_mainDiv > botton.cH_modal_mange_actionBtn.active");
            if (nowActiveActionName === null){
                showText1z1(document.querySelector('div.cH_modal_flex'), 'ERR:未选中任何动作', 1000, 'background: rgb(102, 102, 102);color: rgb(255, 255, 255);overflow: hidden;z-index: 9999;position: fixed;padding: 20px;text-align: center;border-radius: 4px;opacity: 1;transition-duration: 1s;font-size:24px');
                return;
            }
            let name = nowActiveActionName.textContent;
            setTimeout(function () {
                document.querySelector('div.cH_modal_bg').remove();
                document.querySelector('div.cH_modal_flex').remove();
                document.documentElement.style.overflowY = 'scroll';
                addNewActionCollect(name,5,4);
            }, 300)
            
        };
        document.querySelector('#cH_modal_delBtn').onclick = function () {
            let nowActiveActionName = document.querySelector("#cH_modal_box > div.cH_modal_mange_mainDiv > botton.cH_modal_mange_actionBtn.active");
            if (nowActiveActionName === null){
                showText1z1(document.querySelector('div.cH_modal_flex'), 'ERR:未选中任何动作', 1000, 'background: rgb(102, 102, 102);color: rgb(255, 255, 255);overflow: hidden;z-index: 9999;position: fixed;padding: 20px;text-align: center;border-radius: 4px;opacity: 1;transition-duration: 1s;font-size:24px');
                return;
            }
            deleteActions(nowActiveActionName.textContent);
            actionName = loadActionsName();
            document.querySelector("#cH_modal_box > div.cH_modal_mange_mainDiv").innerHTML='';
            if (actionName === undefined){
                return;
            }
            actionName.forEach(
                function(now){
                    sth = document.createElement('botton');
                    sth.setAttribute('class','cH_modal_mange_actionBtn');
                    sth.textContent = now;
                    mDiv.appendChild(sth);
                    let selector = sth;
                    sth.onclick = function(){
                        document.querySelector("#cH_modal_box > div.cH_modal_mange_mainDiv").childNodes.forEach(
                            function(nowNode){
                                if (selector === nowNode) {
                                    selector.className = 'cH_modal_mange_actionBtn active';
                                } else {
                                    nowNode.className = 'cH_modal_mange_actionBtn';
                                }
                            }
                        )
                    }
                }
            );
            showText1z1(document.querySelector('div.cH_modal_flex'), '处理完毕', 300, 'background: rgb(102, 102, 102);color: rgb(255, 255, 255);overflow: hidden;z-index: 9999;position: fixed;padding: 10px;text-align: center;border-radius: 4px;opacity: 1;transition-duration: 1s;font-size:20px');

        }
    }
}

function setActions (way , e) {//直接设置动作参数并loadHistory
    var action;
    if (way === 1) {//直接传入
        action = e;
    }
    if (way === 2) {//使用收藏中的动作
        action = loadActions(e);
    }
    let basic = localStorage.getItem('DANMAKU_G_LAUNCHER_CACHE').match(/{\"actions\":\[(.*)](.*)/)[2];
    let output = '{"actions":[' + action + ']' + basic;
    localStorage.setItem('DANMAKU_G_LAUNCHER_CACHE', output);
    let launcher_loadHistory = window["player"].$plugins[9].launcher.loadHistory;//加载到面板
    try{
        launcher_loadHistory();
    }
    catch(err){
        alert('无法导入缓存弹幕\n错误描述：' + err)
    }
}

function saveActions (name,e) {
    var config = localStorage.getItem('cakeHelper.collect.actions');
    var jConfig = {};
    var nameArr = new Array();
    var actionArr = new Array();
    var nameRow = false;//判定是否存在同一名字
    if (config === null){
        localStorage.setItem('cakeHelper.collect.actions','');
        config = ''
    };
    if (config != ''){
        jConfig = JSON.parse(config);
        nameArr = jConfig.names;
        actionArr = jConfig.action;
    }
    nameArr.forEach(
        function(now,index){
            if (now === name){
                nameRow = index;
            }
        }
    )
    if (nameRow === false){//收藏中不存在该名字的动作，则新增名字和动作信息
        nameArr.push(name);
        actionArr.push(e);
    } else {//已存在同名的，直接替换对应动作数组的动作信息
        actionArr[nameRow] = e
    }
    jConfig.names = nameArr;
    jConfig.action = actionArr;
    config = JSON.stringify(jConfig);
    localStorage.setItem('cakeHelper.collect.actions',config);
};

function loadActions (name) {
    var config = localStorage.getItem('cakeHelper.collect.actions');
    var output;
    if (config === null || config === ''){
        return;
    };
    var jConfig = JSON.parse(config);
    jConfig.names.forEach(
        function(now, index){
            if (now === name) {
                output = jConfig.action[index];
                return;
            }
        }
    );
    return output;
};

function loadActionsName () {//存在动作则返回数组，不存在则返回undefined
    var config = localStorage.getItem('cakeHelper.collect.actions');
    var arrs = new Array();
    if (config === null || config === ''){
        return;
    };
    var jConfig = JSON.parse(config);
    jConfig.names.forEach(
        function(now){
            arrs.push(now);
        }
    );
    if (arrs != []){
        return arrs;
    } else {
        return;
    }
}

function deleteActions (name) {
    var config = localStorage.getItem('cakeHelper.collect.actions');
    if (config === null || config === ''){
        return;
    };
    var jConfig = JSON.parse(config);
    jConfig.names.forEach(
        function(now, index){
            if (now === name) {
                jConfig.names.splice(index,1);
                jConfig.action.splice(index,1);
                config = JSON.stringify(jConfig);
                localStorage.setItem('cakeHelper.collect.actions',config);
                return;
            }
        }
    );
    return;
}

function showText1z1 (mDiv,text,waitTime,newStyle,id) {
    let m1Sth = document.createElement('div');
    if (newStyle != undefined) {
        m1Sth.setAttribute('style',newStyle);
    } else {
        m1Sth.setAttribute('style','left: 10px;bottom: 10px;background: #666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding: 10px;text-align:center;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;opacity:0;transition-duration: 1s;');
    }
    if (id === undefined) {
        id = 'showtheText1z1_8s26';
    } else {
        id = 'showtheText1z1_8s26_' + id;
    }
    m1Sth.setAttribute('id',id);
    m1Sth.textContent = text;
    if (mDiv === undefined){
        document.body.appendChild(m1Sth);
    } else {
        mDiv.appendChild(m1Sth);
    }

    if (waitTime === undefined) {
        waitTime = 2000;
    };
    //开始透明度增加
    setTimeout(function(){document.querySelector("#"+id).style.opacity = 1},50)
    
    setTimeout(function(){
        document.querySelector("#"+id).style.opacity = 0
        setTimeout(function(){document.querySelector("#"+id).remove();},1050)
    },1050 + waitTime)
    

}

function copyToClip (content, message) {//复制内容到粘贴板
    var aux = document.createElement("input"); 
    aux.setAttribute("value", content); 
    document.body.appendChild(aux); 
    aux.select();
    document.execCommand("copy"); 
    document.body.removeChild(aux);
    if (message == null) {
        console.log("复制成功");
    } else{
        console.log(message);
    }
}
function createActionPlus() {//动作信息增强
    let mDiv = document.querySelector("div.panel-content:nth-child(2) > div.form")
    let sth = document.createElement('div');
    sth.setAttribute('class', 'cH_actionPlus');
    mDiv = mDiv.appendChild(sth);

    sth = document.createElement('div');//第一层
    mDiv = mDiv.appendChild(sth);

    sth = document.createElement('botton');
    sth.setAttribute('class', 'danmaku-g-button danmaku-g-button-default');
    sth.setAttribute('style', 'width:100px');
    sth.setAttribute('id', 'cH_loadActionInfoBtn');
    sth.textContent = '导入动作信息';
    mDiv.appendChild(sth);

    sth = document.createElement('botton');
    sth.setAttribute('class', 'danmaku-g-button danmaku-g-button-default');
    sth.setAttribute('style', 'width:120px;margin-left:10px');
    sth.setAttribute('id', 'cH_useActionInCollection');
    sth.textContent = '使用收藏中的动作';
    mDiv.appendChild(sth);

    mDiv = mDiv.parentElement;//第二层
    sth = document.createElement('div');
    sth.setAttribute('style', 'margin-top:30px');
    mDiv = mDiv.appendChild(sth);

    sth = document.createElement('botton');
    sth.setAttribute('class', 'danmaku-g-button danmaku-g-button-default');
    sth.setAttribute('style', 'width:100px');
    sth.setAttribute('id', 'cH_expActionInfoBtn');
    sth.textContent = '复制动作到剪贴板';
    mDiv.appendChild(sth);

    sth = document.createElement('botton');
    sth.setAttribute('class', 'danmaku-g-button danmaku-g-button-default');
    sth.setAttribute('style', 'width:120px;margin-left:10px');
    sth.setAttribute('id', 'cH_addAction2Collect');
    sth.textContent = '添加动作到收藏';
    mDiv.appendChild(sth);

    mDiv = mDiv.parentElement;//第三层
    sth = document.createElement('div');
    sth.setAttribute('style', 'margin-top:30px');
    mDiv = mDiv.appendChild(sth);


    document.querySelector('#cH_loadActionInfoBtn').onclick = function () {
        addNewActionCollect(undefined,2);
    }

    document.querySelector('#cH_useActionInCollection').onclick = function () {
        addNewActionCollect(undefined,3);
    }

    document.querySelector('#cH_addAction2Collect').onclick = function () {
        let action = localStorage.getItem('DANMAKU_G_LAUNCHER_CACHE').match(/{\"actions\":\[(.*)](.*)/)[1];
        addNewActionCollect(action,1);
    }
    document.querySelector('#cH_expActionInfoBtn').onclick = function () {
        let action = localStorage.getItem('DANMAKU_G_LAUNCHER_CACHE').match(/{\"actions\":\[(.*)](.*)/)[1];
        copyToClip(action);
        showText1z1(undefined, '动作已复制到剪贴板', 1000, 'left: 10px;bottom: 10px;background: #666;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding: 10px;text-align:center;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;opacity:0;transition-duration: 1s;font-size:16px');
    }
};

function exportActionsData () {
    let config = localStorage.getItem('cakeHelper.collect.actions');
    if (config === null || config === '' || config === '{"names":[],"action":[]}'){
        showTips('error','无收藏的动作');
        return;//无收藏动作
    };
    let nowTime = Math.round(new Date().getTime()/1000);//取现行unix时间
    let urlObject = window.URL || window.webkitURL || window;
    let export_blob = new Blob([config]);
    let save_link = document.createElement('a');
    save_link.href = urlObject.createObjectURL(export_blob);//绑定
    save_link.download = 'acfun动作收藏导出_' + nowTime + '.accha';
    save_link.click();
    urlObject.revokeObjectURL(export_blob);//释放
};


})();
// ==UserScript==

// @name         SeaTable Custom Style (OnLine)
// @name:zh-CN   SeaTable自定义样式（在线版）qt

// @description  Custom SeaTable Style
// @description:zh-cn SeaTable自定义样式

// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       oraant
// @grant        none
// @license      MIT

// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        *://*:4480*
// @match        *://*.192.168.1.2:4480/*
// @match        *://*.seatable.cn/*
// @match        *://*.table.everything.pub/*
// @match        *://*.biz.oraant.cc/*
// @match        *://*.generate.wiki/*

// @downloadURL https://update.greasyfork.org/scripts/438182/SeaTable%20Custom%20Style%20%28OnLine%29.user.js
// @updateURL https://update.greasyfork.org/scripts/438182/SeaTable%20Custom%20Style%20%28OnLine%29.meta.js
// ==/UserScript==





// === 基础工具方法 ==================================================================================================================================================================================================





/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts, that detects and handles AJAXed content. */

function waitForKeyElements ( /* IMPORTANT: This function requires your script to have loaded jQuery. */
    selectorTxt,    /* Required: The jQuery selector string that specifies the desired element(s). */
    actionFunction, /* Required: The code to run when elements are found. It is passed a jNode to the matched element. */
    bWaitOnce,      /* Optional: If false, will continue to scan for new elements even after the first match is found. */
    iframeSelector  /* Optional: If set, identifies the iframe to search. */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents().find(selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they are new. */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements ( selectorTxt, actionFunction, bWaitOnce, iframeSelector );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}





// === 全局样式修改 ==================================================================================================================================================================================================





$("head").append(`
    <style type="text/css" id="custom_all_css">
        /* 整体风格f

        body { font-family:"Microsoft YaHei Light" } */

        /* ---------------------------------------------------------------------------------------------------- */

        /* 为自律的奖罚标签设置特殊的颜色背景 */
        div.react-grid-Cell[data-column_key="Je1Q"] .link { background-color:#39ab69; color:white; }
        div.react-grid-Cell[data-column_key="l2CX"] .link { background-color:#e36767; color:white; }

        /* 报错弹窗，宽度缩短。否则阻碍鼠标操作 */
        .dtable-toast-manager { max-width:fit-content; }

        /* 长文本弹窗宽度调整，阅读更加舒适 */
        div.longtext-modal-dialog.longtext-preview  { width:1200px; } /* 预览屏宽度 */
        div.longtext-modal-dialog { width:fit-content; max-width:1800px; } /* 弹窗遮罩宽度 */
        div.longtext-modal-dialog div.editor.article { width:max-content; min-width:800px; } /* 实际内容宽度 */
        div.longtext-modal-dialog div.editor.article div.editor-component { min-height:500px; } /* 鼠标放上去有光标 */
        div.longtext-modal-dialog div.editor.article table { width: inherit; } /* 去掉表格横线 */
        div.longtext-modal-dialog div.editor.article table tr { display:inherit; } /* 取消表格宽度相等 */
        div.longtext-modal-dialog div.editor.article table td { max-width:400px; } /* 防止某列过宽 */

        /* 长文本弹窗排版样式 */
        div.longtext-modal-dialog h1 { font-size:2.1em; }
        div.longtext-modal-dialog h2 { font-size:1.8em; }
        div.longtext-modal-dialog h3 { font-size:1.5em; }
        div.longtext-modal-dialog h4 { font-size:1.2em; }
        div.longtext-modal-dialog h5 { font-size:0.9em; }
        div.longtext-modal-dialog h6 { font-size:0.7em; }

        /* 公式默认编辑框大小 */
        .edit-formula-popover .popover { width:900px; max-width:900px; max-height:calc(100% - 50px); height:calc(100% - 50px); }
        .formula-editor .CodeMirror { height:480px!important; }
        .formula-container .formula-content { height:inherit; }
        .formula-tips .formula-column-func { flex:auto; }
        .formula-tips .formula-example-container { flex:auto; }

        /* 调整列标题的tooltip格式 */  /* 改为动态调整，可以防止tip位置偏离太远 */
        /* div.tooltip-inner.column-description-tip { white-space: pre; width:fit-content; max-width:800px; height:fit-content; max-height:800px; } */
        /* div.longtext-modal-dialog table td span { white-space: pre; } */

        /* --- 分组相关 ------------------------------------------------------------------------------------------------- */

        .group-container.group-container-left { z-index:auto!important; } /* 分组时标题过短 */
        .group-container.group-container-left .group-header-left.group-header-cell { overflow:visible; }
        .group-container.group-container-left .group-title { overflow:visible; }
        .group-container.group-container-left .group-cell-value { z-index:1; background-color:#f7f7f7; }
        .group-container.group-container-left:hover .group-cell-value { z-index:0; }

        .summary-item .summary-value { max-width:inherit!important; margin:-5px; }

        /* ---------------------------------------------------------------------------------------------------- */

        /* 子表标签横向压缩 */
        #header { height:30px; position:absolute; right:0; padding:0; text:'缩到右上角别占空'; }
        #header .title { height:inherit; }

        #header .logo { margin-left:0; }
        #header .tools { margin-right:0; }
        #header .tool { margin-right:0; }
        .tables-tabs-container { align-items:end; text:'保证右边按钮不被遮住'; }

        #tables { height:100%; }

        .tables-tabs-container .tables-tabs-operations { width:150px; flex:0 0 auto; flex-wrap:wrap; margin-right:0px; text:'保证右边按钮换行折叠'; }
        .tables-tabs-operations .tables-logs, .tables-tabs-operations .tables-plugins, .tables-tabs-operations .tables-rule, .tables-tabs-operations .tables-share, .tables-tabs-operations .tool-dropdown { margin-right:1px; text:'保证右边按钮紧密堆叠'; }

        .tables-tabs-container .tables-tabs-content { flex-grow:1; margin-left:0; min-height:75px; align-items:end; text:'保证左边标签可以扩展顶到右侧按钮'; }
        .tables-tabs-content .add-table { margin-right:0px; text:'去掉添加按钮的留白'; }

        .tables-tabs-content .tables-nav-tabs { flex-wrap:wrap; width:100%; text:'开启换行，限制宽度，保证可以正常换行'; }
        .tables-tabs-content .tabs-tab { flex-grow:0; margin-right:0; text:'不扩充才能正常左对齐'; }
        .tables-tabs-content .tab-link { padding:0 5px; border-radius:0; }
        .tables-tabs-content .tabs-tab.tabs-tab-active .tab-link { padding:0 5px !important; }
        /* div.tables-tabs-content span.tab-title { font-size:13px; text:'字体调小塞入更多标签，暂时还没必要'; } */
        div.tables-tabs-content span.tab-dropdown { left:0px; right:inherit; }
        .tabs-tab .tab-title .dtable-icon-description { margin-left:-12px!important; opacity:0; }
        .tabs-tab .tab-title .dtable-icon-description:hover { opacity:1; }
        @media (min-width: 767.8px) { .logo { flex-basis: 0; flex-shrink: 1; } }

        /* --- 压缩列类型或描述 ------------------------------------------------------------------------------------------------- */

        /* 列类型藏在左边，悬浮时显示 */
        .header-cell-container .header-icon { opacity:0; position:absolute; left:0px; top:0px; margin:0; padding:5px 2px; line-height:21px; background-color:rgb(239 239 239); }
        .header-cell-container .header-icon:hover { background-color:rgb(230 230 230); } /* 鼠标悬浮在本按钮上时变色 */
        .react-grid-HeaderRow:hover  .header-icon { opacity:1; } /* 鼠标悬浮在列标题上时显示 */  /* .react-grid-HeaderCell:hover .header-cell-container .header-icon { opacity:1; } */

        /* 列描述藏在右边，悬浮时显示 */
        .column-uneditable-tip              { opacity:0; position:absolute; right:0; margin:0!important; padding:5px 2px; line-height:21px; background-color:rgb(239 239 239); }
        .column-uneditable-tip:hover { background-color:rgb(230 230 230); } /* 鼠标悬浮在本按钮上时变色 */
        .react-grid-HeaderCell:hover .column-uneditable-tip { opacity:1; } /* 鼠标悬浮在列标题上时显示 */

        /* 下拉菜单直接压扁，使用右键照样可以打开菜单 */
        .header-cell-container .dtable-dropdown-menu { position:absolute; right:20px; width:0; padding:0; overflow: hidden; }

        /* 早期意义不明的代码 */
        .header-cell-container .header-cell-left { width:100%; }

        /* --- 链接卡片收紧 ------------------------------------------------------------------------------------------------- */

        .link-records-container .row-card-item { height:68px; }
        .row-card-item .row-card-item-container .row-card-item-header { top:6px; }
        .row-card-item .row-card-item-container .row-card-item-content { height:68px; }

        /* --- 单元格分割线 ------------------------------------------------------------------------------------------------- */

        /* 单元格整体背景色改为白色，方便其他单元格显示为底色，假装不存在 */
        div#grid-canvas{ background-color:#f5f5f5; }

        /* 调整单元格边框，或者调浅 */
        /* div.react-grid-Cell{ border:none !important; } */
        div.react-grid-Cell{ border-right:1px solid #aaa !important; border-bottom:1px solid #aaa !important; }

        /* 工具条的下划线，改成标题栏的上划线，方便下面的分割列做纯白分割 */
        div.table-toolbar{ border-bottom:none; background-color:#f5f5f5; }
        div.react-grid-HeaderCell{ background-color:#eee; border-top:1px solid #aaa; border-bottom:1px solid #aaa; border-right:1px solid #aaa;  }


        /* 横线分割线 */
        .react-grid-Row:has(.grid-cell-type-default[title=ㅤㅤㅤㅤ]) .react-grid-Cell{ border-right:none!important; background-color:#f5f5f5!important; }
        .react-grid-Row:has(.grid-cell-type-default[title=ㅤㅤㅤㅤ]) .react-grid-Cell__value{ border-bottom:none!important; }
        .react-grid-Row:has(.grid-cell-type-default[title=ㅤㅤㅤㅤ]) .react-grid-Cell-button .react-grid-Cell__value{ display:none; }

        .react-grid-Row:has(.grid-cell-type-default[title=ㅤㅤㅤㅤㅤㅤ]) .react-grid-Cell{ border-right:none!important; border-bottom:2px black solid!important; background-color:#f5f5f5!important; }
        .react-grid-Row:has(.grid-cell-type-default[title=ㅤㅤㅤㅤㅤㅤ]) .react-grid-Cell__value{ border-bottom:none!important; }
        .react-grid-Row:has(.grid-cell-type-default[title=ㅤㅤㅤㅤㅤㅤ]) .react-grid-Cell-button .react-grid-Cell__value{ display:none; }

        .react-grid-Row:has(.grid_cell_type_single-select[title*="​"]) .react-grid-Cell:not(.react-grid-Cell-digital-sign):not(.react-grid-Cell-duration){ border-bottom:1px #eaeaea solid !important; }
        .react-grid-Row:has(.grid-cell-type-default[title*="ㅤ◆"]) .react-grid-Cell{ border-bottom:none !important; background-color:#e5f6ff; }
        .grid-rows > div:has(.grid-cell-type-default[title*="ㅤ◆"])+div:not(:has(.grid-cell-type-default[title*="ㅤ◆"])) .react-grid-Cell{ border-top:1px solid #aaa; }

        /* 竖线分割线 */
        div.react-grid-HeaderCell:has(i.dtable-icon-handwritten-signature){ color:#f5f5f5; background-color:#f5f5f5; border-bottom:none; border-top:none; }
        div.react-grid-Cell-digital-sign{ border-bottom:none!important; border-top:none!important; background-color:#f5f5f5!important; }

        div.react-grid-HeaderCell:has(i.dtable-icon-duration){ color:#f5f5f5; background-color:#f5f5f5; border-bottom:none; border-top:none; }
        div.react-grid-Cell-duration{ border-bottom:none!important; border-top:none!important; background-color:#f5f5f5!important; padding:0; }
        div.react-grid-Cell-duration > .react-grid-Cell__value{ height:63%!important; border-bottom:10px solid #e9e9e9; }

        /* 公式灵活分割 */
        div.react-grid-HeaderCell:has(.header-name-text[title*='|']){ color:#f5f5f5; background-color:#f5f5f5; border-bottom:none; border-top:none; }
        div.react-grid-Cell-formula:has(.grid-cell-type-default[title*='opacity']) { border-bottom:none!important; border-top:none!important; background-color:#f5f5f5!important; padding:0; }
        div.react-grid-Cell-formula:has(.grid-cell-type-default[title*='opacity']) > .react-grid-Cell__value > .grid-cell-type-default { display:none; }

        div.react-grid-Cell-formula:has(.grid-cell-type-default[title*='===']) > .react-grid-Cell__value{ height:53%!important; border-bottom:3px dashed #55f; }
        div.react-grid-Cell-formula:has(.grid-cell-type-default[title*='---']) > .react-grid-Cell__value{ height:53%!important; border-bottom:3px dashed red; }


        /* 单元格默认不压缩空格 */
        /* div.grid-cell-type-default {white-space: pre;} /* font-family: Agave, "Ubuntu Mono", Inconsolata */

        /* --- 单选列较窄时，下拉选项不隐藏 ------------------------------------------------------------------------------------------------- */

        .multiple-selects-editor-list, .single-selects-editor-list{ min-height:400px; }
        .multiple-selects-editor-list .multiple-selects-container, .single-selects-editor-list .single-selects-container{ max-height:400px; }
        div.dropdown-menu.single-selects-editor-list.show span.single-select-name { max-width:none !important }

    </style>
`);





// === 动态样式修改 ==================================================================================================================================================================================================





// 使列描述中内容支持换行符号

let observer = new MutationObserver(mutations => {
    if (document.querySelector('div.tooltip-inner')) {
         $('div.tooltip-inner').each(function() { // 遍历所有 <div> 元素
             var text = $(this).text(); // 获取当前元素中的文本内容
             if(text.includes('==')) { // 如果文本内容包含 '=='
                 var newText = text.replace(/==/g, '\n'); // 将所有 '==' 替换为换行符
                 $(this).text(newText); // 更新元素的文本内容
                 console.log('replace tip !!!')
             }
         });
         $('div.tooltip-inner').css({'white-space':'pre', 'width':'fit-content', 'max-width':'800px', 'height':'fit-content', 'max-height':'800px'})
    }
});
observer.observe(document.body, {childList: true});


// 使长文本中的表格支持换行符号


waitForKeyElements ("div.longtext-modal-dialog table span", span_return);
function span_return(){

    console.log('span !!!')

    $('div.longtext-modal-dialog table span[data-slate-string="true"]').each(function() { // 遍历所有 <span> 元素
        var text = $(this).text(); // 获取当前元素中的文本内容
        if(text.includes('■')) { // 如果文本内容包含 '■'
            var newText = text.replace(/■/g, '\n'); // 将所有 '■' 替换为换行符
            $(this).text(newText); // 更新元素的文本内容
            console.log('replace span !!!')
        }
    });
}


// 根据表格标题，将表格标签编译为特殊段落，比如空格或换行等


waitForKeyElements (".tab-link", tab_link_style);
function tab_link_style(){ // 记得大的数放在前面，防止小数在前时，-5删掉无法识别-50的bug

    console.log('tab link style !!!')

    // 子表标签透明空格，逻辑更加清晰

    $('.tab-link:contains("-")').each(function( index ) {
      let width_str = $(this).text().replace(/^-(\d+).*/, '$1') // 提取出标题中要调整的宽度
      let style = {'opacity': 0.03, 'border-radius':0, 'cursor': 'inherit', 'width':width_str+'px'}
      let padding = parseInt(width_str) < 5 ? {'padding':0} : {'padding':'2px 1px !important'}
      $(this).css(Object.assign({}, style, padding))
      $(this).children("span.tab-title").text('​')
    });

    // 子表标签白色竖线，逻辑更加清晰

    $('.tab-link:contains("|||")').css({'padding':0.3, 'margin':'0 5px', 'border-radius':0, 'cursor': 'inherit', 'width':'5px', 'background-color':'white'})
    $('.tab-title:contains("|||")').text('​')

    $('.tab-link:contains("||")').css({'padding':0.3, 'margin':'0 2px', 'border-radius':0, 'cursor': 'inherit', 'width':'3px', 'background-color':'white'})
    $('.tab-title:contains("||")').text('​')

    // 子表标签换行，多行展示逻辑清晰（命名时不让用\符号）

    $('.tabs-tab:contains("=n")').css({'flex-basis': '100%', 'height':'3px', 'width':'20px', 'overflow':'hidden', 'opacity':0.3})
    $('.tab-title:contains("=n")').text('​')
}






















// === 废旧代码 ================================================================================



/* waitForKeyElements (".react-grid-Cell", grid_cell_style);
function grid_cell_style(){

    console.log('grid cell style !!!')

     // 为单元格增加边框线

    $('.react-grid-Cell:contains("世界")').css({'border-left':'solid 2px black;'})

    // 人工竖直分割线

    // $('.react-grid-HeaderCell:contains("---")').css({'border-bottom':0, 'background-color':'white'})
    // $('.react-grid-HeaderCell:contains("---") > *').css({'opacity': 0})

    // $('.react-grid-Cell:contains("---")').css({'border-bottom':0})
    // $('.react-grid-Cell:contains("---") > *').css({'opacity': '0'})

}
*/




// /* 将列标题中的按钮，改为下方弹出式菜单（这是旧方案，不如新方案方便快捷）
// .header-cell-container .header-icon { opacity:0; position:absolute; left:-5px; padding:4px!important; margin:0;            line-height:15px; border-radius: 2px; background-color:rgb(249 249 249); box-shadow:1px 2px 3px 0px #b5b5b5; } /* 平常隐藏在角落 */
// .column-uneditable-tip              { opacity:0; position:absolute; left:15px; padding:4px!important; margin:0 !important; line-height:15px; border-radius: 2px; background-color:rgb(249 249 249); box-shadow:1px 2px 3px 0px #b5b5b5; }
// .dtable-dropdown-menu.dropdown      { opacity:0; position:absolute; right:-5px;padding:4px!important; width:auto;          line-height:15px; border-radius: 2px; background-color:rgb(249 249 249); box-shadow:1px 2px 3px 0px #b5b5b5; }
//
// .react-grid-HeaderCell:hover .header-cell-container .header-icon { opacity:1; top:30px; } /* 鼠标悬浮时显示 */
// .react-grid-HeaderCell:hover .column-uneditable-tip              { opacity:1; top:30px; }
// .react-grid-HeaderCell:hover .dtable-dropdown-menu.dropdown      { opacity:1; top:28.5px; }
//
// .header-cell-container .header-icon:hover { background-color:rgb(233 233 233) } /* 悬浮在按钮上时变色 */
// .column-uneditable-tip:hover              { background-color:rgb(233 233 233) }
// .dtable-dropdown-menu.dropdown:hover      { background-color:rgb(233 233 233) }
// */




/* CSS样式 子表标签竖向排列，更加紧致，放的更多
div.tables-tabs-container div.tables-tabs-content { margin-left:0px; }
div.tables-tabs-content div.tables-tabs { padding-right:0px; }
div.tables-tabs-content li.tabs-tab { margin-right:0px; }
div.tables-tabs-content div.tab-link { height:50px; padding:0px 0px 0px 0px!important; writing-mode:tb-rl; line-height:24px; }
div.tables-tabs-content span.tab-title { font-size:14px }
#header { height:30px; }
#header .title { height:inherit; }
.tables-tabs-container .tables-tabs-operations { width:100px; flex-wrap:wrap; margin-right:0px; }
.tables-tabs-content .add-table { width:16px; margin-right:0px; }
.tables-tabs-operations .tables-logs, .tables-tabs-operations .tables-plugins, .tables-tabs-operations .tables-rule, .tables-tabs-operations .tables-share, .tables-tabs-operations .tool-dropdown { margin-right:1px; }
*/




/*--- waitForElm: 等待某元素出现，只能一次性执行 https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists */

// function waitForElm(selector) {
//     return new Promise(resolve => {
//         if (document.querySelector(selector)) { // 直接能找到这个元素
//             return resolve(document.querySelector(selector));
//         }
//
//         const observer = new MutationObserver(mutations => { // 找不到这个元素时，就等待其出现
//             if (document.querySelector(selector)) {
//                 observer.disconnect();
//                 resolve(document.querySelector(selector));
//             }
//         });
//
//         // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
//         observer.observe(document.body, {
//             childList: true,
//             subtree: true
//         });
//     });
// }
//
// await waitForElm('div.tooltip-inner').then((elm) => {
//     console.log('Element is ready');
//     console.log(elm.textContent);
// });




// 试图为只能填写单行数据的input增加一个textarea，填写多行内容后，将转化后的文本输入input（没有用，即使都改了，还是读不到input中的内容）
//
// if (document.querySelector('input.form-control') && !document.querySelector('textarea#popover-inner-textarea')) {
//     $('input.form-control').after(`<textarea id='popover-inner-textarea'></textarea>`)
//     $('textarea#popover-inner-textarea').on('change', function() {
//         let content = $('textarea#popover-inner-textarea').val()
//         $('input.form-control').attr('value', content)
//         $('input.form-control').val(content)
//         console.log(content, $('input.form-control').val())
//     });
// }





// 渲染表格内的元素
//
// waitForKeyElements ("div.grid-cell-type-default", ttt);
// function ttt(){
//     console.log('111')
// }
//
// waitForKeyElements ("div#dtable-row-height-popover", add_custom_btns);
// function add_custom_btns(){ // 渲染表格内的元素
//     let btn = $(`
//         <div class="toolbar-item ml-2 view-row-render" id="dtable-row-render-popover">
//             <span class="toolbar-btn view-row-render">
//                 <i class="dtable-font dtable-icon-sync"></i>
//                 <span>渲染</span>
//             </span>
//         </div>
//     `)[0];
//     btn.addEventListener("click", function() {
//         $('.grid-cell-type-default').each(function() {
//             $(this).html($(this).text());
//         });
//     });
//     $('div#dtable-row-height-popover').after(btn);
// }




// 使列描述中内容支持换行符号（已改为响应更加及时的MO方案）
//
// waitForKeyElements ("div.tooltip-inner", tip_return); // .column-description-tip
// function tip_return(){ // 使列描述中内容支持换行符号
//     $('div.tooltip-inner').each(function() { // 遍历所有 <div> 元素
//         var text = $(this).text(); // 获取当前元素中的文本内容
//         if(text.includes('■')) { // 如果文本内容包含 '■'
//             var newText = text.replace(/■/g, '\n'); // 将所有 '■' 替换为换行符
//             $(this).text(newText); // 更新元素的文本内容
//             console.log('replace tip !!!')
//         }
//     });
//
//     $('div.tooltip-inner').css({'white-space':'pre', 'width':'fit-content', 'max-width':'800px', 'height':'fit-content', 'max-height':'800px'})
// }
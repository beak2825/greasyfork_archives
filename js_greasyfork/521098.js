// ==UserScript==
// @name         助手S1↓
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  保存页面
// @author       for419
// @license      MIT
// @match        *://10.2.10.29/oa/view/page/*
// @match        *://192.168.11.110/*

// @exclude      *://10.2.10.29/oa/view/page/todo/todoForm.html

// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/521098/%E5%8A%A9%E6%89%8BS1%E2%86%93.user.js
// @updateURL https://update.greasyfork.org/scripts/521098/%E5%8A%A9%E6%89%8BS1%E2%86%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建标签的容器
    const container = document.createElement('div');
    container.style.cssText = `position: fixed;right: 10px;top: 60%;transform: translateY(-50%);background-color: #f9f9f9;border: 1px solid #ccc;padding: 10px;border-radius: 5px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);`;
    //container.style.right = '750px';  //重置标签位置

    // 监听鼠标移动事件
    document.addEventListener('mousemove', function(e) {
        var rightEdge = window.innerWidth - container.offsetWidth - 10; // 减去标签宽度和一点边距
        if (e.clientX > rightEdge) {
           //
            container.style.right = '0px';  //重置标签位置
        } else if (e.clientX < parseInt(container.style.right) + container.offsetWidth) {
            // 鼠标在标签上方时，不执行隐藏操作
        } else {
            //container.style.right = '0px';  //标签位置
            //
            container.style.right = '-100px'; //-100px 这里不直接隐藏，而是通过CSS过渡效果缓慢隐藏
        }
    });

//---------标签0--------------------------------------------------------------------------------
        $('div.file-line-left img').remove();
        $('div.file-line-right').remove();

            GM_addStyle(`
              div.file-line-left img,
              div.file-line-right{display:none !important;}
            `);

//---------标签1--------------------------------------------------------------------------------
    // 创建浮动标签的容器
    function createTab(name, action, color) {
        const tab = document.createElement('div');
        tab.textContent = name;
        tab.style.cssText = `display: block; cursor: pointer; padding: 5px 10px;
                             background-color: ${color};color: white; border-radius: 3px; text-align: center; margin-top: 10px;
                             box-shadow: 0 0 10px rgba(0,0,0,0.1);
                             `;
        tab.addEventListener('click', action);

        // 添加鼠标悬浮事件
        tab.addEventListener('mouseover', () => {
            tab.style.backgroundColor = 'red';
        });

        // 添加鼠标移出事件
        tab.addEventListener('mouseout', () => {
            tab.style.backgroundColor = color;
        });

        container.appendChild(tab);
    }

    // 规则a：处理文件类型
    function ruleA(fileType) {
        //alert(`处理文件类型: ${fileType}`);
        // 在这里添加实际的逻辑处理

    // 绑定点击事件
        let file1 = '';
        let text0 = document.title;
        let text1 = '';
        let text1b = `<html><!-- InstanceBegin template="/Templates/index_wenj_zgs_utf.dwt" codeOutsideHTMLIsLocked="false" -->
<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="stylesheet" type="text/css" href="E:/Site/site/pub/css/gongwen.css">
<link rel="stylesheet" type="text/css" href="E:/Site/site/pub/css/img.css">
<link rel="stylesheet" type="text/css" href="../../../../pub/css/gongwen.css">
<link rel="stylesheet" type="text/css" href="../../../../pub/css/img.css">
<link rel="stylesheet" type="text/css" href="../../../../../pub/css/gongwen.css">
<link rel="stylesheet" type="text/css" href="../../../../../pub/css/img.css">
<!-- InstanceBeginEditable name="title" --><title>`;
        let tit1 = document.title;
        let text1c = `</title><!-- InstanceEndEditable --></head><body><div class="main ws"><div class="main_neir shadow"><p class="main_mca"><!-- InstanceBeginEditable name="wenjianm" -->`;
        let tit2 = '';
        let text1d = `<!-- InstanceEndEditable --><!-- InstanceBeginEditable name="ly" --><!-- InstanceEndEditable --></p><p class="main_wenh"><!-- InstanceBeginEditable name="wenh" -->`;
        let wenh = '';
        let text1e1 = `<!-- InstanceEndEditable --></p><p align="right"><!-- InstanceBeginEditable name="laiyuan" --><span><a href="`;
        let text1e2 = window.location.href;
        let text1e3 = `">来源</a></span></p>`;
        let text1f = `<!-- InstanceEndEditable --><!-- InstanceBeginEditable name="neir" -->`;
        let cont1 = '';
        let text2 = '<!-- InstanceEndEditable --></div></div></body><!-- InstanceEnd --></html>';
//--------1---------------------------------------------------------------------------------
        // 根据URL设定不同的规则
//---------8--------------------------------------------------------------------------------
        if (document.URL.includes('10.2.10.29:9104/oa/view/page/gwForm.html?servId=OA_GW_GONGWEN_BMSW') || document.URL.includes('10.2.10.29:9104/oa/view/page/gwForm.html?servId=OA_GW_GONGWEN_GSSW')) {
       // if (document.URL.includes('10.2.10.*/*/*SW')) {
             // alert('位置0');
            // 获取ID为GW_TITLE的元素
            // #OA_GW_GONGWEN_BMFW > table > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td.gz-npl > div
            // #OA_GW_GONGWEN_BMSW > table > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td.gz-np > div > input#GW_TITLE
            const titleElement = document.querySelector('input#GW_TITLE');
            const tit1 = titleElement ? titleElement.value : '';

            // 获取ID为GW_YEAR_CODE的元素
            const yearCodeElement = document.getElementById('GW_YEAR_CODE');
            const wenh1 = yearCodeElement ? yearCodeElement.value : '';

            // 获取类名为layui-input的input元素（获取第一个）
            const layuiInputElement = document.querySelector('#gwYearTd > div > div > div.layui-select-title > input');
            const wenh2 = layuiInputElement ? layuiInputElement.value : '';

            // 获取ID为GW_YEAR_NUMBER的元素
            const yearNumberElement = document.querySelector('#gwYearNumberTd > div > input#GW_YEAR_NUMBER');
            const wenh3 = yearNumberElement ? yearNumberElement.value : '';

            const cont1 = document.querySelector('#fileContainer').innerHTML;
            //alert('text2');

            wenh = wenh1 + '〔' + wenh2 + '〕'+ wenh3 + '号';
            // alert(wenh);

            text0 = wenh + tit1;
            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
        //---------8--------------------------------------------------------------------------------
        } else if (document.URL.includes('10.2.10.2911:7001/oa') || document.URL.includes('10.2.10.29:7001/oa/view/page/gwForm.html?servId=OA_GW_GONGWEN_XZRW') || document.URL.includes('10.2.10.29:9104/oa/view/page/gwForm.html?servId=OA_GW_GONGWEN_BMFW') || document.URL.includes('10.2.10.29:9104/oa/view/page/gwForm.html?servId=OA_GW_GONGWEN_GSFW')) {
            // alert('位置1');
            // 获取ID为GW_TITLE的元素
            // #OA_GW_GONGWEN_BMFW > table > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td.gz-npl > div
            // #OA_GW_GONGWEN_XZRW > table > tbody > tr:nth-child(3) > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td.gz-npl.gz-ch-m0 > div >
            const titleElement = document.querySelector('input#GW_TITLE');
            const tit1 = titleElement ? titleElement.value : '';

            // 获取ID为GW_YEAR_CODE的元素
            const wenh = document.querySelector('#GW_YEAR_NUMBER_tr').textContent.trim().replace(/\s+/g, '');

            const cont1 = document.querySelector('#fileContainer').innerHTML;
            //alert('text2');
            text0 = wenh + tit1;
            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
        //---------8--------------------------------------------------------------------------------
        } else if (document.URL.includes('192.168.11.110:800/site/00web')) {
            // 获取ID为GW_TITLE的元素
            const titleElement = document.querySelector('input#GW_TITLE');
            const tit1 = titleElement ? titleElement.value : '';

            // 获取ID为GW_YEAR_CODE的元素
            const wenha = document.querySelector('#GW_YEAR_NUMBER_tr')?.textContent || '';
            // ------------------------------------
            if (wenha === '' || wenha === 'doc') {
                // 获取ID为GW_YEAR_CODE的元素
                const yearCodeElement = document.getElementById('GW_YEAR_CODE');
                const wenh1 = yearCodeElement ? yearCodeElement.value : '';

                // 获取类名为layui-input的input元素（获取第一个）
                const layuiInputElement = document.querySelector('#gwYearTd > div > div > div.layui-select-title > input');
                const wenh2 = layuiInputElement ? layuiInputElement.value : '';

                // 获取ID为GW_YEAR_NUMBER的元素
                const yearNumberElement = document.querySelector('#gwYearNumberTd > div > input#GW_YEAR_NUMBER');
                const wenh3 = yearNumberElement ? yearNumberElement.value : '';

                wenh = wenh1 + '〔' + wenh2 + '〕'+ wenh3 + '号';
            } else {wenh = wenha.trim().replace(/\s+/g, '');}
            // ------------------------------------
            const cont1 = document.querySelector('#fileContainer').innerHTML;

            // alert(wenh + tit1);
            text0 = wenh + tit1;
            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------8--------------------------------------------------------------------------------
        } else if (document.URL.includes('10.2.10.29/oa') || document.URL.includes('192.168.11.110:800/site/00web')) {
        //===========================
            // 获取ID为GW_TITLE的元素                    #OA_GW_GONGWEN_BMFW > table > tbody > tr:nth-child(4) > td > table:nth-child(2) > tbody > tr > td > table > tbody > tr > td.gz-npl > div
            const titleElement = document.querySelector('input#GW_TITLE');
            const tit1 = titleElement ? titleElement.value : '';

            // 获取ID为GW_YEAR_CODE的元素
            const yearCodeElement = document.getElementById('GW_YEAR_CODE');
            const wenh1 = yearCodeElement ? yearCodeElement.value : '';

            // 获取类名为layui-input的input元素（获取第一个）
            const layuiInputElement = document.querySelector('#gwYearTd > div > div > div.layui-select-title > input');
            const wenh2 = layuiInputElement ? layuiInputElement.value : '';

            // 获取ID为GW_YEAR_NUMBER的元素
            const yearNumberElement = document.querySelector('#gwYearNumberTd > div > input#GW_YEAR_NUMBER');
            const wenh3 = yearNumberElement ? yearNumberElement.value : '';

            const cont1 = document.querySelector('#fileContainer').innerHTML;
            //alert('text2');

            wenh = wenh1 + '〔' + wenh2 + '〕'+ wenh3 + '号';
           // alert('weihzi' + wenh);

            text0 = wenh + tit1;
            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------8--------------------------------------------------------------------------------
        } else if (document.URL.includes('bbs.kafan22.cn')) {
            alert(位置3);
            const tit1 = document.querySelector('#thread_subject').textContent;
            const cont1 = document.querySelector('#postlist').innerHTML;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//-----------------------------------------------------------------------------------------
        }

        // text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;

        // 生成文件并下载  const result = text0 + text1 + text2;
        //const result = text1 + text2;

            //alert(`处理文件类型: ${fileType}`);

        if (document.URL.includes('10.2.10.29') || document.URL.includes('192.168.11.110') || fileType === 'doc') { file1 = ''; } else { file1 = 'SingleFile'; }
        const result = text1 + text2;
        const blob = new Blob([result], { type: 'text/html;charset=utf-8;' });
        const fileName = file1 + text0 + "." + fileType;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    }

    // 规则b：处理收藏
    function ruleB() {
      //  alert('执行收藏操作');
//====== 标签3 ======================================================
    // 创建标签3


    // 辅助函数：获取指定元素的文本内容
    function getElementText(selector) {
        var element = document.querySelector(selector);
        return element ? element.textContent.trim() : '';
    }


        // 获取网页标题和链接地址
        // 根据网页类型获取标题
        var title = '';
        if (document.URL.includes('nfra.gov.cn') || document.URL.includes('cbirc.gov.cn'))          {title = getElementText('.wenzhang-title') || document.title;
        } else if (document.URL.includes('nfra22.gov.cn')) {title = getElementText('.class1 h1') || document.title;
        } else                                             {title = document.title;
        }

        var url = window.location.href;

        // 创建要复制的内容
        var content = title + '\n' + url;

        // 创建一个隐藏的文本区域用于复制
        var tempTextArea = document.createElement('textarea');
        tempTextArea.value = content;
        document.body.appendChild(tempTextArea);

        // 选中并复制内容
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, content.length);  // 对于移动端的兼容
        document.execCommand('copy');

        // 移除隐藏的文本区域
        document.body.removeChild(tempTextArea);

        // 可选：显示一个短暂的提示
        //alert('【标题和链接已复制到剪贴板】' + '\n' + content);

//---------7--------------------------------------------------------------------------------
    }

    // 添加标签
    //createTab('PDF格式', () => ruleA('pdf'),'#23a65d');
    createTab('htm', () => ruleA('html'),'#23a65d');
    createTab('doc', () => ruleA('doc'),'#2196F3');
    createTab('copy', ruleB,'#4CAF50');


    // 将容器添加到页面
    document.body.appendChild(container);
})();
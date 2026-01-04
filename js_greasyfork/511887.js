// ==UserScript==
// @name         另存Plus
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @license      MIT
// @description  个人工具包，主要目的为快速实现网页保存，目前实现三个功能，分别为另存为html格式、doc格式；以及粘贴当前网页名称及网址，便于快速分享；
// @author       for419
// @icon         https://www.cbirc.gov.cn/cn/static/favicon.ico
// @match        *://*.gov.cn/*
// @match        *://192.168.*.*/*
// @match        *://127.0.0.1/*/0*/*.htm*
// @match        *://127.0.0.1/*/1*/*.htm*
// @match        *://*.piccnet.com.cn/icms/*111
// @match        *://*.piccnet.com.cn/*
// @match        *://*.picc.com/spa/*

// @match        *://*.toutiao.com/*/*
// @match        *://*.csdn.net/*/article/*
// @match        *://*.cnblogs.com/*
// @match        *://*.csdn.net/*
// @match        *://bbs.kafan.cn/*
// @match        *://juejin.cn/*
// @match        *://*.51cto.com/*
// @match        *://*.weixin.qq.com/*
// @match        *://*.iteye.com/*
// @match        *://*.php.cn/*

// @match        *://*.iteye.com/*

// @exclude      *://*.miit.gov.cn/*files/*
// @exclude      *://i*.csdn.net/*


// @exclude      *://*.gov.cn/jingtai/*.htm
// @exclude      *://flk.npc.gov.cn/xf*/htm*/*

// @exclude      *://127.0.0.1:800/site/00web/00cs/*
// @exclude      *://*.picc*.com.cn/*/*.vsml33
// @exclude      *://*.picc*.com.cn/*/*.vsml33
// @exclude      *://*.picc*.com.cn:8086/mywork*
// @exclude      *://*.picc*.com.cn/*/html/*
// @exclude      *://*.picc*.com.cn/*/*bd/*
// @exclude      *://*.picc*.com.cn/*/template/*
// @exclude      *://*.picc*.com.cn/*/*fgs*.htm
// @exclude      *://*.picc*.com.cn/*/*HomePage/*
// @exclude      *://*.picc*.com.cn/*/*.*p*g*
// @exclude      *://*.piccnet.com.cn:8086/portal/indexPage*
// @exclude      *://*.piccnet.com.cn/static/contentPage/*1
// @exclude      *://*.piccnet.com.cn/*/show.vsml
// @exclude      *://*.piccnet.com.cn/*/template.vsml
// @exclude      *://*.piccnet.com.cn/*/channel.vsml
// @exclude      *://*.picc*.com.cn/*/*newOa*
// @exclude      *://*.picc*.com.cn/*index*.htm*
// @exclude      *://*.picc*.com.cn/*/*index*.htm*
// @exclude      *://*.piccnet.com.cn/icms/sdbz//*44
// @exclude      *://*.piccnet.com.cn/*//*11
// @exclude      *://*.piccnet.com.cn/icms/visitStatistics*

// @grant        GM_download
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/511887/%E5%8F%A6%E5%AD%98Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/511887/%E5%8F%A6%E5%AD%98Plus.meta.js
// ==/UserScript==

(function() {
    /* 异常网站
    http://web.piccnet.com.cn//icms///ns:LHQ6LGY6LGM6OGE4MjgzNzI5MzA2YmEzMDAxOTM2MmFhOWU3YTIzZDUscDosYTosbTo=/show.vsml

    */
    'use strict';
    //创建标签的容器
    const container = document.createElement('div');
    container.style.cssText = `position: fixed;right: 0px;top: 50%;transform: translateY(-70%);background-color: #f9f9f9;border: 1px solid #ccc;padding: 10px;border-radius: 5px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);`;

    // 监听鼠标移动事件
    document.addEventListener('mousemove', function(e) {
        var rightEdge = window.innerWidth - container.offsetWidth - 10; // 减去标签宽度和一点边距
        if (e.clientX > rightEdge) {
            container.style.right = '0px';
        } else if (e.clientX < parseInt(container.style.right) + container.offsetWidth) {
            // 鼠标在标签上方时，不执行隐藏操作
        } else {
            container.style.right = '0px';
            //
            container.style.right = '-100px'; //-100px 这里不直接隐藏，而是通过CSS过渡效果缓慢隐藏
        }
    });

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
<!-- InstanceBeginEditable name="title" --><title>`;
        let tit1 = document.title;
        let text1c = `</title><!-- InstanceEndEditable --></head><body><div class="main ws"><div class="main_neir shadow"><p class="main_mca"><!-- InstanceBeginEditable name="wenjianm" -->`;
        let tit2 = '';
        let text1d = `<!-- InstanceEndEditable --></p><p class="main_wenh"><!-- InstanceBeginEditable name="ly" --><!-- InstanceEndEditable --><!-- InstanceBeginEditable name="wenh" -->`;
        let wenh = '';
        let text1e1 = `<!-- InstanceEndEditable --><span></p><p style="text-align: right;"><!-- InstanceBeginEditable name="laiyuan" --><a href="`;
        let text1e2 = window.location.href;
        let text1e3 = `">来源</a>`;
        let text1f = `<!-- InstanceEndEditable --></span></p><!-- InstanceBeginEditable name="neir" -->`;
        let cont1 = '';
        let text2 = '<!-- InstanceEndEditable --></div></div></body><!-- InstanceEnd --></html>';
//--------1--------------------------------------------------------------------------------- wenzhang-fujian mt25
        // 根据URL设定不同的规则
        if (document.URL.includes('cbirc.gov.cn') || document.URL.includes('nfra.gov.cn')) {
            const tit1 = document.querySelector('.wenzhang-title').textContent;
            const wenha = document.querySelector('.tizhu')?.textContent || ''.replace(/[\s_]/g, '');
            const wenhb = document.querySelector('div.ItemDetailRed-header-row34 span span')?.textContent || document.querySelector('.ItemDetailRed-header-subtitle')?.textContent || ''.trim().replace(/\s+/g, '');

            //alert('text1');
            const cont1a = document.querySelector('#wenzhang-content').innerHTML

            if (document.URL.includes('cbirc.gov.cn/cn/view/pages/rulesDetail')) {
               wenh = wenha;
               text0 = wenhb + tit1;
            } else if (document.URL.includes('cbirc.gov.cn/cn/view/pages/ItemDetail')) {
               const cont1b = document.querySelector('.wenzhang-fujian')?.innerHTML || '';
               const cont1b1 = document.querySelector('.wenzhang-fujian')?.textContent?.trim() || '';
               if (cont1b1 === '附件信息:') {cont1 = cont1a;} else {cont1 = cont1a + cont1b;}
               wenh = wenhb;
               text0 = tit1;
            } else {
               cont1 = cont1a;
               wenh = wenhb;
               text0 = wenhb + tit1;
            }

            if (document.URL.includes('cbirc.gov.cn/branch')) {
               //const tit2 = '';
            } else if (document.URL.includes('gov.cn')) {
               tit2 = tit1;
            }
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//--------2---------------------------------------------------------------------------------
        } else if (document.URL.includes('gov.cn/ziliao/flfg') || document.URL.includes('gov.cn/gzdt')) {
            //const tit1 = document.querySelector('.wenzhang-title').textContent;
            //const wenh = document.querySelector('.ItemDetailRed-header-subtitle').textContent;
            const cont1 = document.querySelector('#Zoom').innerHTML.replace(/<br\s*\/?>/g, '</p><p>');
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//--------2---------------------------------------------------------------------------------
        } else if (document.URL.includes('miit.gov.cn')) {
            const tit1 = document.querySelector('#con_title').textContent;
            const wenh = document.querySelector('#page_type > div.w980.center.cmain > div.xxgk-box > div:nth-child(3) > p > span.xxgk-span5.xxgk-fwzh').textContent;
            const cont1 = document.querySelector('#con_con').innerHTML.replace(/<br\s*\/?>/g, '</p><p>');

            tit2 = tit1;
            text0 = wenh + tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//-----------------------------------------------------------------------------------------
        } else if (document.URL.includes('mem.gov.cn/gk/zfxxgkpt')) {
            const tit1 = document.querySelector('div.scy_detail_top > table > tbody > tr:nth-child(1) > td:nth-child(2)').textContent;// 标题
            const wenh = document.querySelector('div.scy_detail_top > table > tbody > tr:nth-child(2) > td:nth-child(4)').textContent;// 文号
            const cont1 = document.querySelector('#content').innerHTML; // 正文
            text0 = wenh + tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//-----------------------------------------------------------------------------------------
        } else if (document.URL.includes('moj.gov.cn')) {
              alert('标签moj');
              const tit1 = document.querySelector('.phone_size1').textContent;
              const cont1 = document.querySelector('.newM').innerHTML;
              text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------4--------------------------------------------------------------------------------
        } else if (document.URL.includes('gov.cn')) {
          //alert('标签more:gov.cn');
          const cont1 = document.querySelector('#UCAP-CONTENT').innerHTML.replace(/<br\s*\/?>/g, '</p><p>'); // 正文
          //==================================================================================
          if (document.URL.includes('gov.cn/zhengce/zhengceku')) {
              const tit1 = document.querySelector('div.policyLibraryOverview_content > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(2)').textContent;
              const wenh = document.querySelector('div.policyLibraryOverview_content > div:nth-child(1) > table > tbody > tr:nth-child(2) > td:nth-child(2)').textContent;
              text0 = wenh + tit1;
          } else if (document.URL.includes('gov.cn/zhengce/content')) {
              alert('标签952');
              const tit1 = document.querySelector('div.mhide > table > tbody > tr > td > table > tbody > tr:nth-child(3) > td:nth-child(2)').textContent;
              const wenh = document.querySelector('div.mhide > table > tbody > tr > td > table > tbody > tr:nth-child(4) > td:nth-child(2)').textContent;
              text0 = wenh + tit1;
          } else if (document.URL.includes('gov.cn/zhengce33') || document.URL.includes('gov.cn/yaowen')) {
            // alert('yaowen');
              const tit1 = document.querySelector('#ti').textContent.trim();
              const wenh = document.querySelector('.pages-date').textContent.trim();
              text0 = tit1;
              tit2 = tit1;
          } else if (document.URL.includes('gov.cn/gongbao/content')) {
            alert('标签gongbao/conten');
          } else if (document.URL.includes('gov.cn/gongbao')) {
              const tit1 = document.querySelector('.share-title').textContent.trim().replace(/\s+/g, '');
              //const wenh = text0.replace(/[\s_]/g, '');
              text0 = tit1;
          } else if (document.URL.includes('cbirc44.gov.cn') || document.URL.includes('nfra44.gov.cn')) {
              alert('标签cbirc');
              const tit1 = document.querySelector('.wenzhang-title').textContent;
              const wenh = document.querySelector('.ItemDetailRed-header-subtitle').textContent;
              const cont1 = document.querySelector('#wenzhang-content').innerHTML;
            } else {
                ruleE();
            }
            //==================================================================================
          text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------4--------------------------------------------------------------------------------
        } else if (document.URL.includes('toutiao.com')) {
            //==================================================================================
          if (document.URL.includes('toutiao.com/article')) {
            const tit1 = document.querySelector('.article-content h1').textContent.replace(/[\s_]/g, '');
            const cont1 = document.querySelector('.article-content article').innerHTML;

            text0 = tit1;
            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
          } else if (document.URL.includes('toutiao.com/w22')) {
                ruleE();
          } else if (document.URL.includes('toutiao.com/w')) {
            const tit1 = document.querySelector('div.main > div:nth-child(1) > div > div > div > div > h1').textContent;
            const cont1a = '<p>' + document.querySelector('.weitoutiao-html').innerHTML.replace(/<br\s*\/?>/g, '</p><p>') + '</p>';
            const cont1b = '<p>' + document.querySelector('.image-list').innerHTML.replace(/<br\s*\/?>/g, '</p><p>') + '</p>';

            cont1 = cont1a + cont1b;
            text0 = tit1;
            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
          } else {
                ruleE();
          }
           // const tit1 = document.querySelector('.article-content h1').textContent;
          //  const cont1 = document.querySelector('.article-content article').innerHTML;
            //==================================================================================

//---------4--------------------------------------------------------------------------------
        } else if (document.URL.includes('csdn.net')) {
            //const tit1 = document.querySelector('h1.articleTitle')?.textContent || document.querySelector('#articleContentId').textContent;
            //const cont1 = document.querySelector('.article-content')?.innerHTML || document.querySelector('#content_views').innerHTML;
            //text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;

            //==================================================================================
            if (document.URL.includes('blog.csdn.net')) {
              const tit1 = document.querySelector('#articleContentId').textContent;
              const cont1 = document.querySelector('#content_views').innerHTML;
            text0 = tit1;
            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
            } else if (document.URL.includes('download.csdn.net')) {
              const tit1 = document.querySelector('h1.articleTitle').textContent;
              const cont1 = document.querySelector('.article-content').innerHTML;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
            }
            //==================================================================================
//---------6--------------------------------------------------------------------------------
        } else if (document.URL.includes('cnblogs.com')) {
            const tit1 = document.querySelector('#cb_post_title_url span').textContent;
            const cont1 = document.querySelector('#cnblogs_post_body').innerHTML;
            text0 = tit1;
            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------7--------------------------------------------------------------------------------
        } else if (document.URL.includes('piccnet.com.cn')) {
            //alert('111');
            const tit1 = document.querySelector('.gongyong1_content h1').textContent;
            text1d += `<!-- InstanceEndEditable --><!-- InstanceBeginEditable name="laiyuan2" -->`;
            text1d += document.querySelector('.artcle_pp .fbsj').textContent;
            const cont1 = document.querySelector('#news_content').innerHTML;

            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------8--------------------------------------------------------------------------------
        } else if (document.URL.includes('picc.com')) {
            const tit1 = document.querySelector('#weaDocDetailHtmlContent > div:nth-child(2)')?.textContent || text0;
            text1e3 += `<!-- InstanceEndEditable --><!-- InstanceBeginEditable name="laiyuan2" -->`;
            text1e3 += document.querySelector('#weaDocDetailHtmlContent > div:nth-child(5)').textContent;
            const cont1 = document.querySelector('#piccCxHisContent').innerHTML;

            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------8--------------------------------------------------------------------------------
        } else if (document.URL.includes('bbs.kafan.cn')) {
            const tit1 = document.querySelector('#thread_subject').textContent;
            const cont1 = document.querySelector('#postlist').innerHTML;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------7--------------------------------------------------------------------------------
        } else if (document.URL.includes('juejin.cn')) {
            const tit1 = document.querySelector('.article-title').textContent;
            const cont1 = document.querySelector('#article-root').innerHTML;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------7--------------------------------------------------------------------------------
        } else if (document.URL.includes('51cto.com')) {
            const tit1 = document.querySelector('h1').textContent;
            const cont1 = document.querySelector('#container').innerHTML;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------7--------------------------------------------------------------------------------
        } else if (document.URL.includes('weixin.qq.com')) {
            //const tit1 = document.querySelector('.class1').textContent;
            //const wenh = document.querySelector('.class2 #id1').textContent;
            const cont1 = document.querySelector('#js_content').innerHTML;
            text0 = tit1;
            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------7--------------------------------------------------------------------------------
        } else if (document.URL.includes('iteye.com')) {
            //$('div.tools').remove();
            const tit1 = document.querySelector('.blog_title h3').textContent.trim().replace(/\s+/g, '');
            //const wenh = document.querySelector('.class2 #id1').textContent;
            const cont1 = document.querySelector('#blog_content').innerHTML;
            text0 = tit1;
            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------7--------------------------------------------------------------------------------
        } else if (document.URL.includes('php.cn')) {
            const tit1 = document.querySelector('h1.wzctTitle').textContent.trim().replace(/\s+/g, '');
            const cont1 = document.querySelector('div.php-article').innerHTML;
            text0 = tit1;
            tit2 = tit1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------7--------------------------------------------------------------------------------
        } else if (document.URL.includes('127.0.0.1')) {
            //const tit1 = document.querySelector('.class1').textContent;
            //const wenh = document.querySelector('.class2 #id1').textContent;
            const cont1a = document.querySelector('.main_content').innerHTML;
            const cont1b = document.querySelector('.main_fuj').innerHTML;
            cont1 = cont1a + cont1b;
            const text1e1 = '';
            text1e2 = text1e1;
            text1e3 = text1e1;
            text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;
//---------7--------------------------------------------------------------------------------
        }

        // text1 = text1b + tit1 + text1c + tit2 + text1d + wenh + text1e1 + text1e2 + text1e3 + text1f + cont1;

        // 生成文件并下载  const result = text0 + text1 + text2;
        //const result = text1 + text2;

            //alert(`处理文件类型: ${fileType}`);

        if (fileType === 'doc' || document.URL.includes('127.0.0.1')) { file1 = ''; } else { file1 = 'SingleFile'; }
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
        var wha = '';
        var whb = '';
        if (document.URL.includes('nfra.gov.cn') || document.URL.includes('cbirc.gov.cn')) {
            title = getElementText('.wenzhang-title') || document.title;
        } else if (document.URL.includes('127.0.0.1')) {
            title = getElementText('.main_mca') || document.title;
            wha = getElementText('p.main_wenh') || getElementText('.wenh_ly') || 'null';
            whb = getElementText('.wenh_fz') || 'null';


        } else if (document.URL.includes('nfra22.gov.cn')) {
            title = getElementText('.class1 h1') || document.title;
        } else {
            title = document.title;
        }
        //  alert(wha + '\n' + whb);
        var url = window.location.href;

        // 创建要复制的内容
        if (document.URL.includes('127.0.0.1')) {
            var content = title + ',' + wha + ',' + url + ',' + whb + ',';
        } else {
            var content = title + '\n' + url;
        }

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
//-----------------------------------------------------------------------------------------
// 规则d的函数
    function ruleD() {

    }
//---------4--------------------------------------------------------------------------------
    // 添加标签
    //createTab('PDF格式', () => ruleA('pdf'),'#23a65d');
    createTab('htm', () => ruleA('html'),'#23a65d');
    createTab('doc', () => ruleA('doc'),'#2196F3');
    createTab('copy', ruleB,'#4CAF50');

    // 将容器添加到页面
    document.body.appendChild(container);

//---------4--------------------------------------------------------------------------------
// 规则e的函数
function ruleE() {
    // 在这里添加规则e的代码
    // console.log("Executing Rule E");
    alert('RuleE: 规则缺失，请退出后调试...');

    // 直接退出脚本执行
    return false;
}
})();
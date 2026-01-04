// ==UserScript==
// @name                36rain-layout-plugin
// @name:zh-CN          36rain页面适配插件
// @namespace           http://36rain.com
// @version             2.6.5
// @description         改变36雨布局的脚本文件，持续更新中...
// @description:zh-CN   改变36雨布局的脚本文件，持续更新中...
// @match               http://36rain.com/*
// @match               http://www.36rain.com/*
// @match               https://36rain.me/*
// @match               https://www.36rain.me/*
// @match               https://36rain.me/*
// @match               https://www.36rain.me/*
// @run-at              document-start
// @license             MIT
// @grant               GM_info
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_xmlhttpRequest
// @grant               GM_registerMenuCommand
// @grant               GM_openInTab
// @grant               GM_notification
// @grant               GM_addStyle
// @grant               GM_log
// @grant               GM_getResourceText
// @grant               GM_getResourceURL
// @grant               GM_listValues
// @grant               GM_addValueChangeListener
// @grant               GM_removeValueChangeListener
// @grant               GM_setClipboard
// @grant               GM_getTab
// @grant               GM_saveTab
// @grant               GM_getTabs
// @grant               GM_download
// @downloadURL https://update.greasyfork.org/scripts/503926/36rain-layout-plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/503926/36rain-layout-plugin.meta.js
// ==/UserScript==



/*
    Author: 无名布女 
    Greasyfork: Put your Greasyfork profile page URL here.
*/


(function() {
    'use strict';

    const customCSS = `
    	body, html {
      	    font-size: 36px !important;
      	    line-height: 150% !important;
    	}
        
        // green wallpaper
        // html {
        //     background: url('https://p3.itc.cn/images01/20210429/56eba48f5cff49308fc61f3416d38307.jpeg') no-repeat center center fixed !important;
        //     background-color: #E2EDCB !important;
        //     background-size: cover !important;
        // }
        html {
            background: radial-gradient(#fffaee 15%, transparent 16%), linear-gradient(45deg, transparent 49%, #fffaee 49% 51%, transparent 51%), linear-gradient(-45deg, transparent 49%, #fffaee 49% 51%, transparent 51%);
            background-size: 6em 6em;
            background-color: #FCF5E3;
            opacity: 1
        }
        #header {
            width: 60%; /* By default (for laptop and larger), width is 60% */
        }
        #user-login {
            width: 100% !important;
            display: block !important;
            font-size: 36px !important;
        }
        /* For mobile and tablets */
        @media screen and (max-width: 1024px) {
            #header {
                width: 96%; /* On screens smaller than 1024px wide, width becomes 100% */
            }
        }
        body {
            background: none !important;
        }
        #main {
            width: 100% !important;
        }
        #header > div:nth-child(3) {
            background: rgba(0,0,0,0.1) !important;
        }
        #guide {
            padding-right: 0px !important;
        }

        .guide li {
            margin: 10px 0px 10px 30px !important;
            float: right;
        }
        #wrapA {
            background: none !important;
        }
        #infobox {
            margin-top: 0px !important;
            padding-top: 40px !important;
            /* border-top: 1px dashed #ccc !important; */
        }

        #mainNav {
            margin-bottom: 0 !important;
            padding-bottom: 40px !important;
            /* border-bottom: 1px dashed #ccc !important; */
        }
        .input {
            font-size: 36px !important;
            height: 60px !important;
            margin-bottom: 40px !important;
        }
        .user-infoWrap2, .user-infoWrap2 * {
          line-height: 100% !important;
          font-size: 24px !important;
        }
    	.tr3 * {
            line-height: 150% !important;
        }
        .f10, .f10 * {
            font-size: 30px !important;
        }
        .tiptop, .tiptop * {
            font-size: 32px !important;
            line-height: 100% !important;
            margin-top: 20px !important;
            margin-bottom: 30px !important;
            border: 0px !important;
        }
        .listinline {
            display: none !important;
        }
        .t3 {
            margin-bottom: 20px !important;
            font-size: 40px !important;
        }
        .h {
            background: none !important;
        }
        #main > div.h2 {
            display: none !important;
        }
        .user-pic {
            margin-top: 10px !important;
            margin-bottom: 10px !important;
            margin-right: auto !important;
            margin-left: auto !important;
        }
        .pages {
            height: auto;
            line-height: 150% !important;
            width: 100% !important;
            margin-bottom: 40px;
            padding-top: 5px;
            padding-bottom: 5px;
            border: none !important;
        }
        .hthread {
            height: 36px !important;
        }
        .fl .threadlist {
            height: 100% !important;
        }
        .pages ul li {
            margin-right: 30px !important;
        }
        .pages ul .pagesone {
            background: none !important;
            border: none !important;
        }
        .pages input {
            font-size: 36px !important;
            height: auto !important;
        }
        .tpc_content, tpc_content * {
            border-top: 2px dashed #ccc !important;
            padding: 1em 0.5em 0.5em 0.5em !important;
            font-size: 40px !important;
        }
        .tr2, .tr2 * {
            height: auto;
            line-height: 150% !important;
            margin-bottom: 20px;
            background: rgba(252,250,242, 0.3) !important;
        }
        .f14 * {
            font-size: 40px !important;
            letter-spacing: normal !important;
            line-height: 200% !important;
        }
        .f14 h6, .f14 h6 * {
            font-size: inherit !important;
        }
        .f14 blockquote, .f14 blockquote3, .f14 blockquote2 {
            font-size: inherent !important;
            width: 100% !important;
            letter-spacing: normal !important;
            line-height: 200% !important;
            background: rgba(255, 255, 255, 0.2) !important;
        }
        .f10, .f10 * {
            font-size: 30px !important;
        }
        .h2, .h2 * {
            height: 40px !important;
            background: none !important;
        }
	    .guide {
            line-height: 150% !important;
        }
        .btn {
            font-size: 30px !important;
        }
        #post-option span { 
            width: 100% !important;
        }
        .tipad, .signature, .tipad *, .signature * {
            font-size: 32px !important;
        }     
        // #breadcrumbs, #breadcrumbs * {
        //     padding: 1em 3em 1em 7px !important;
        //     margin-right: 0px !important;
        //     background: none !important;
        //     border: none !important;
        // }
        .f_one, .t_one, .r_one {
            background: none !important;
        }
        tr > td.f_one:nth-child(1), tr > td.f_one:nth-child(3) {
            display: none !important;
        }
        #footer {
            background: none !important;
        }
        #smiliebox {
            background: none !important;
            border: none !important;
        }
        #one-key {
            display: none !important;
        }
        #shortcutforum li {
            float: right !important;
        }
        tr.tr1 th.r_two {
            background: none !important;
        }
        #user_info {
            width: 70% !important;
        }
        // remove user info
        #user_info > div:nth-child(3) > div > div > div {
            display: none !important;
        }
        .gonggao {
            display: none !important;
        }

        /// breadcrumbs
        #main > div.bdbA {
            height: auto !important;
            display: flex !important;
            align-items: center !important;
            padding: 0px !important;
        }
        #breadcrumbs {
            margin: 0px !important;
            display: flex !important;
            align-items: center !important;
            height: auto !important;
            overflow: visible !important;
            opacity: 0.8 !important;
        }
        #breadcrumbs .crumbs-item, #breadcrumbs .crumbs-item * {
            height: auto !important;
            overflow: visible !important;
            line-height: 150% !important;
        } 
        #breadcrumbs > span.fr.gray3 {
            line-height: 150% !important;
        }
        #notice {
            padding: 0px !important;
            height: auto !important;
            display: flex !important;
            align-items: center !important;
        }
        #notice0, #notice0 * {
            height: auto !important;
            width: 100% !important;
            overflow-y: visible !important;
            line-height: 150% !important;
        }
        div.tiptop > div.fr {
            visibility: hidden;
        }
        #td_tpc > div.tiptop > div.fr > input, #td_tpc > div.tiptop > div.fr > a[title="只看樓主的所有帖子"]  {
            visibility: visible !important;
        }
        div.tiptop > div.fr > input, div.tiptop > div.fr > a[title="只看該作者的所有回復"]  {
            visibility: visible !important;
        }
        // re-arrange fast0reply box
        div .t5 {
            width: 100% !important;
            overflow: scroll !important;
        }
        #r_dig {
            display: none !important;
        }
    `;

    // Function to replace img elements within specified anchors with text
    function replaceImageWithText(selector, newText) {
        var targetLinks = document.querySelectorAll(selector);
        targetLinks.forEach(function(anchor) {
            var img = anchor.querySelector('img');
            if (img) {
                img.remove(); // Remove the img element
                anchor.appendChild(document.createTextNode(newText)); // Add the text node
            }
        });
    }
    // function to replace img elements with font awesome icons
    function replaceImageWithIcon(selector, iconClass) {
        var targetLinks = document.querySelectorAll(selector);
        targetLinks.forEach(function(anchor) {
            var img = anchor.querySelector('img');
            if (img) {
                img.remove(); // Remove the img element
                var icon = document.createElement('i');
                icon.className = `${iconClass} fa-2x`; // Set the class name
                anchor.appendChild(icon); // Add the icon
            }
        });
    }
 
    // function to load progress bar
    function addProgressBar() {
        // add progress bar
        addScript('https://cdn.jsdelivr.net/npm/pace-js@1.2.4/pace.min.js');
        addStylesheet('https://cdn.jsdelivr.net/npm/pace-js@1.2.4/themes/silver/pace-theme-barber-shop.css');
    }
    // create and append links
    function createLink(div, url, text) {
        var link = document.createElement('a');
        link.href = url;
        link.target = "_blank";
        link.textContent = text;
        div.appendChild(link);
    }

    // function to add new script to <head>
    function addScript(url) {
        var head = document.head;
        var script = document.createElement('script');
        script.src = url;
        head.appendChild(script);
    }
    
    // function to add new stylesheet to <head>
    function addStylesheet(url) {
        var head = document.head;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        head.appendChild(link);
    }

    // function to center content
    function centerContent(element) {
        element.style.display = 'flex';
        element.style.justifyContent = 'center';
        element.style.alignItems = 'center';
        element.style.textAlign = 'center';
    }

    function centerContentVertical(element) {
        element.style.display = 'flex';
        element.style.justifyContent = 'center';
        element.style.alignItems = 'center';
        element.style.flexDirection = 'column';
        element.style.height = '100%';
    }
    

    // Function to apply styles to elements
    function applyStyles() {
        // replay reply and new post with f
        var ReplaySelectors = [
            '#main > div:nth-child(5) > span:nth-child(2) > a',
            '#main > div:nth-child(13) > span:nth-child(2) > a'
        ];
        ReplaySelectors.forEach(function(selector) {
            replaceImageWithIcon(selector, 'fas fa-reply');
        });
        var PostSelectors = [
            '#main > div:nth-child(5) > span:nth-child(1) > a',
            '#main > div:nth-child(13) > span:nth-child(1) > a',
            '#main > div:nth-child(9) > span.fr > a',
            '#main > div:nth-child(8) > span.fr > a',
            '#main > div:nth-child(14) > span.fr > a',
        ];
        PostSelectors.forEach(function(selector) {
            replaceImageWithIcon(selector, 'fas fa-file');
        });  

        var f10elements = document.querySelectorAll('.f10 *');
        f10elements.forEach(function(el) {
            el.style.setProperty('font-size', '30px', 'important');
        });

        // remove fast reply title
        var h2elements = document.querySelectorAll('.h2, .h2 *');
        h2elements.forEach(function(el) {
        //     el.style.setProperty('height', '36px', 'important');
             el.style.setProperty('background', 'none', 'important');
        });

        var h1elements = document.querySelectorAll('.h1, .h1 *');
        h1elements.forEach(function(el) {
            el.style.setProperty('font-size', '42px', 'important');
            el.style.setProperty('letter-spacing', 'normal', 'important');
            el.style.setProperty('line-height', '150%', 'important');
        });

        // Apply styles to user-infoWrap2 elements
        var userInfoElements = document.querySelectorAll('.user-infoWrap2, .user-infoWrap2 *');
        userInfoElements.forEach(function(el) {
            el.style.setProperty('font-size', '24px', 'important');
            el.style.setProperty('line-height', '150%', 'important');
        });

        // rearrange user login element
        var userLogin = document.querySelector('#mainNav > div:nth-child(2)');
        if (userLogin) {
            userLogin.style.setProperty('bottom', 'auto', 'important');
        }

        // Change width of the specified <td> element
        var tdToChangeWidth = document.querySelector('#main > form:nth-child(21) > div > table > tbody > tr:nth-child(3) > td:nth-child(2)');
        if (tdToChangeWidth) {
            tdToChangeWidth.style.setProperty('width', '100%', 'important'); // Change width to 70%
        } else {
            console.error("Target TD element to change width was not found.");
        }

        // Remove all <img> elements inside <th> elements
        var thElements = document.querySelectorAll('.tr3 th');
        thElements.forEach(function(th) {
            var imgElement = th.querySelector('img');
            if (imgElement) {
                console.log("IMG element found and will be removed:", imgElement.outerHTML);
                imgElement.style.setProperty('display', 'none', 'important');
                console.log("IMG element removed.");
            }
        });

        // Change the margin of the specified element
        var divToChangeMargin = document.querySelector('#main > form:nth-child(5) > div > div:nth-child(4) > div:nth-child(1)');
        if (divToChangeMargin) {
            divToChangeMargin.style.setProperty('margin', '20px', 'important'); // Change margin to desired value
            console.log("Changed margin of the element.");
        } else {
            console.error("Target element to change margin was not found.");
        }

        // Change the width of the specified element
        var divToChangeWidth = document.querySelector('#main > form:nth-child(5) > div > div:nth-child(4) > div:nth-child(1) > div');
        if (divToChangeWidth) {
            divToChangeWidth.style.setProperty('width', '100%', 'important'); // Change margin to desired value
            console.log("Changed margin of the element.");
        } else {
            console.error("Target element to change margin was not found.");
        }

        // Change the width of the specified element
        var divToChangeWidthInput = document.querySelector('#main > form:nth-child(5) > div > div:nth-child(4) > div:nth-child(1) > div > input');
        if (divToChangeWidthInput) {
            divToChangeWidthInput.style.setProperty('width', '75%', 'important'); // Change margin to desired value
            divToChangeWidthInput.style.setProperty('float', 'right', 'important'); // Change margin to desired value
            console.log("Changed margin of the element.");
        } else {
            console.error("Target element to change margin was not found.");
        }

        var spanToChangeFloat = document.querySelector('#main > form:nth-child(5) > div > div:nth-child(4) > div:nth-child(1) > div > span.fr.gray');
        if (spanToChangeFloat) {
            spanToChangeFloat.style.setProperty('float', 'left', 'important'); // Change margin to desired value
            console.log("Changed margin of the element.");
        } else {
            console.error("Target element to change margin was not found.");
        }

        // Combine styles for #editor-tab and #editor-tool
        var editorElements = ['#editor-tab', '#editor-tool', 
            '#editor-button > div:nth-child(3) > div'];
        editorElements.forEach(function(selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.style.setProperty('font-size', '16px', 'important');
                // element.style.setProperty('height', '150%', 'important');
            } else {
                console.error(`Element with selector ${selector} was not found.`);
            }
        });
        var editorFooterElements = ['#main > form:nth-child(5) > div > table:nth-child(9) > tbody > tr:nth-child(2) > th > div > div', '#post-option > div > div'];
        editorFooterElements.forEach(function(selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.style.setProperty('margin-left', '0px', 'important');
            } else {
                console.error(`Element with selector ${selector} was not found.`);
            }
        });

        var inputElements = document.querySelectorAll('textarea, input, select');
        inputElements.forEach(function(input) {
            if (input) {
                input.style.setProperty('font', '30px Arial', 'important');
            }
        });

        var ChangePtypeWidth = document.querySelector('#main > form:nth-child(5) > div > div:nth-child(4) > div:nth-child(1) > div > span.fr.gray > select');
        if (ChangePtypeWidth) {
            ChangePtypeWidth.style.setProperty('width', 'auto', 'important');
        }

        // Change width of <td> elements with width 25% to 33%, under .tr3 class
        var tdElements = document.querySelectorAll('.tr3 td[width="25%"]');
        tdElements.forEach(function(td) {
            td.style.setProperty('width', '33%', 'important'); // Change width to 33%
            var col2 = td.querySelector('table > tbody > tr > td:nth-child(2)');
            if (col2) {
                col2.style.setProperty('border', '0px', 'important');
                col2.style.setProperty('background', 'none', 'important');
            }
            var col1 = td.querySelector('table > tbody > tr > td:nth-child(1)');
            if (col1) {
                col1.style.setProperty('display', 'none', 'important');
            }
        });
        // remove the last column in headline
        var headlineElements = ['#main > div.t > table > tbody > tr.tr3.tac.h > td[width="25%"]:nth-child(4)', 
            '#main > div.t > table > tbody > tr:nth-child(2) > td[width="25%"]:nth-child(4)'
        ];
        headlineElements.forEach(function(selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.style.setProperty('display', 'none', 'important');
            } 
        });  

        // var ItoRemove = document.querySelectorAll('#breadcrumbs .crumbs-item i');
        // ItoRemove.forEach(function(i) {
        //     i.style.setProperty('display', 'none', 'important');
        // });

        // Tr to be removed
        var trToRemove = ['#cate_info > tr:nth-child(1)', '#cate_info > tr:nth-child(2)', 
            '#cate_info > tr:nth-child(3)', '#cate_info > tr:nth-child(4)'
        ];
        trToRemove.forEach(function(selector) {
            var element = document.querySelector(selector);
            if (element) {
                element.style.setProperty('display', 'none', 'important');
            }
        });

        // change height of #ajaxtable > tbody:nth-child(1) > tr > th
        var thHeight = document.querySelectorAll('#ajaxtable > tbody > tr > th');
        thHeight.forEach(function(th) {
            th.style.setProperty('font-size', '24px', 'important');
        });

    }

    // Create and append style element
    var style = document.createElement('style');
    style.textContent = customCSS;
    document.head.appendChild(style);

    // add font awesome
    addStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');
    
    // add progress bar
    addProgressBar();

    // Apply styles immediately
    applyStyles();

    // Apply styles to dynamically loaded content
    var observer = new MutationObserver(function(mutations) {
        applyStyles();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    observer.disconnect();

    // just in case some contents are not loaded
    document.addEventListener('DOMContentLoaded', function() {
        applyStyles();
    });

    // Force a repaint
    document.body.style.display='none';
    document.body.offsetHeight;
    document.body.style.display='';

})();

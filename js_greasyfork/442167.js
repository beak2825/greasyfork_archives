// ==UserScript==
// @name         Quora and Jianshu Beautify
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description   write a javascript to beautify the quora website
// @author        6D1996
// @match        https://www.quora.com/*
// @match        *://www.jianshu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT

// @grant        GM_addStyle
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/442167/Quora%20and%20Jianshu%20Beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/442167/Quora%20and%20Jianshu%20Beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    beautifyQuora();
    beautifyJianshu();

    function beautifyJianshu() {
        var sidebarClassList = ['_2OwGUo','col-xs-7 col-xs-offset-1 aside']

        for (var i = 0; i < sidebarClassList.length; i++) {
            var sidebar = document.getElementsByClassName(sidebarClassList[i]); //获取侧边栏
            if (sidebar) {
                sidebar[0].style.display = 'none';
                //sidebar[0].parentNode.removeChild(sidebar[0]);
               // removed = true;
            }
        }
    }

    function beautifyQuora(){

        var screenWidth = GM_getValue('screenWidth', window.innerWidth);

        //set cotainer
        var containerClass = 'q-text qu-dynamicFontSize--regular qu-display--flex qu-px--large qu-flexDirection--row PageContentsLayout___StyledText-d2uxks-0 ioqSAj'
        var leftSidebarClass = 'q-box PageContentsLayout___StyledDesktopSideCol-d2uxks-3 jumUIe'
        var rightSidebarClass = 'q-box PageContentsLayout___StyledDesktopSideCol2-d2uxks-2 dYLgof'
        var topBarClass = 'q-flex qu-justifyContent--space-between qu-alignItems--center'
        var mainContentClass = 'q-box PageContentsLayout___StyledBox2-d2uxks-4 hDqnEJ'

        var container = document.getElementsByClassName(containerClass);
        if(container.length > 0){
            container[0].removeChild(container[0].childNodes[0]);
            container[0].removeChild(container[0].childNodes[1]);
            container[0].style.padding = '0px';
            container[0].style.margin = '0px';
        }

        //remove the left sidebar

        // var leftSidebar = document.getElementsByClassName(leftSidebarClass);
        // if(leftSidebar.length > 0){
        //     leftSidebar.style.width = '0px';
        //     leftSidebar.style.display = 'none';
        // }
        // // GM_addStyle('.q-box PageContentsLayout___StyledDesktopSideCol-d2uxks-3 jumUIe{display:none !important;}');

        // //remove the right sidebar
        //         var rightSidebar = document.getElementsByClassName(rightSidebarClass);
        // if(rightSidebar.length > 0){
        //     removeChild(rightSidebar)
        // }
        // // GM_addStyle('.q-box PageContentsLayout___StyledDesktopSideCol2-d2uxks-2 dYLgof{display:none !important;}');

        //remove the top Advertisement
        var topBar = document.getElementsByClassName(topBarClass);
        if(topBar.length > 0){
            topBar[0].style.display = 'none';
        }
        //GM_addStyle('.q-flex qu-justifyContent--space-between qu-alignItems--center{display:none !important;}');

        //make the content area full width
        var mainContent = document.getElementsByClassName(mainContentClass);
        if(mainContent.length > 0){
            mainContent[0].style.width = screenWidth + 'px';
            mainContent[0].style.margin = '0px';
            mainContent[0].style.padding = screenWidth/30 + 'px';
            mainContent[0].style.fontSize = '18px';
        }

    }
})();
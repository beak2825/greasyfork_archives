// ==UserScript==
// @name         YouTube Recommendations be Gone: 2025 Edition - Desktop
// @version      1.3.19
// @description  updated for 2025 use, recommended to use with https://greasyfork.org/en/scripts/463534-clean-youtube-homepage for complete recommendation removal
// @author       mutantx22
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @namespace    https://greasyfork.org/
// @supportURL   
// @downloadURL https://update.greasyfork.org/scripts/536922/YouTube%20Recommendations%20be%20Gone%3A%202025%20Edition%20-%20Desktop.user.js
// @updateURL https://update.greasyfork.org/scripts/536922/YouTube%20Recommendations%20be%20Gone%3A%202025%20Edition%20-%20Desktop.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var version = "1.3.10";
    var updateDate = "20231214";

    var redirectionProtection2s = false;

    // 创建一个弹出窗口
    function createOptionsWindow() {
        // 创建一个新的窗口对象
        var optionsWindow = window.open('', '_blank', 'width=400,height=300');

        // 在弹出窗口中加载选项设置页面
        optionsWindow.document.write(`
    <html>
      <head>
        <title>Setup</title>
      </head>
      <body>
        <h1>选项设置</h1>
        <form id="optionsForm">
          <label for="option1">选项1：</label>
          <input type="text" id="option1" name="option1" value="默认值"><br>

          <label for="option2">选项2：</label>
          <input type="checkbox" id="option2" name="option2"><br>

          <button type="submit">保存</button>
        </form>

        <script>
          // 在提交表单时保存选项值
          document.getElementById('optionsForm').addEventListener('submit', function(event) {
            event.preventDefault();
            var option1Value = document.getElementById('option1').value;
            var option2Value = document.getElementById('option2').checked;

            // 在这里可以将选项值保存到适当的位置，例如本地存储或浏览器扩展的存储区域

            // 关闭弹出窗口
            window.close();
          });
        </script>
      </body>
    </html>
  `);
    }

    // 检查用户是否首次使用
    function checkFirstTimeUser() {
        var isFirstTime = localStorage.getItem('isFirstTimeUser');

        if (!isFirstTime) {
            // 用户首次使用，弹出选项设置窗口
            createOptionsWindow();

            // 将首次使用标记设置为 true
            localStorage.setItem('isFirstTimeUser', 'true');
        }
    }

    // Function to check if the current page is the home page
    function isHomePage() {
        var url = window.location.href;
        return url === "https://www.youtube.com/" || url === "https://www.youtube.com";
    }

    // Function to check if the current page is the subscriptions page
    function isSubscriptionsPage() {
        var url = window.location.href;
        return url === "https://www.youtube.com/feed/subscriptions";
    }

    // Redirect to Subscriptions page if on the home page and not already on the subscriptions page
    function checkRedirect() {
        if (isHomePage() && !isSubscriptionsPage()) {
            window.location.href = "https://www.youtube.com/feed/subscriptions";
        }
    }

    function redirectionProtection2sOff(){
        redirectionProtection2s = false;
    }

    // Redirect v2
    function checkRedirectV2() {
        console.log("checkRedirectV2()");
        //var redirectCompatibility;//default: null, can be: 'true'
        //redirectCompatibility = localStorage.getItem('redirectCompatible');
        if (isHomePage() && !redirectionProtection2s) {
            //else{
            redirectMonitor.incrementCallCount();
            redirectionProtection2s = true;

            //}
        }
    }

    // hide related videos
    function hideRelatedVideos() {
        console.log("hideRelatedVideos()");
        var relatedVideos = document.querySelector('#related');
        var endVideoContent = document.querySelector('div.ytp-endscreen-content');
        ///html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[3]/div[1]/div[2]/ytd-player/div/div/div[20]/div
        if (relatedVideos) {
            relatedVideos.style.display = 'none';
        }
        if (endVideoContent){
            endVideoContent.remove();
        }
        /*
        var secondaryDiv = document.getElementById("secondary");
        if (secondaryDiv) {
            secondaryDiv.remove();
        }*/
    }
    // Check if the current page is a YouTube video page
    function checkVideoRecommendations(){
        console.log("checkVideoRecommendations()");
        if (window.location.href.includes('youtube.com/watch')) {
            // Call the function to hide related videos
            hideRelatedVideos();
        }
    }
    // Function to remove elements with show more button
    function removeElementsWithShowMoreButton() {
        var elements = document.querySelectorAll('ytd-rich-section-renderer');
        //var elements = document.querySelectorAll('ytd-rich-section-renderer[use-show-more-button]');
        if (elements) {
            console.log('removeElementsWithShowMoreButton(): element exists'); // 检查元素是否存在
            console.log(elements.style); // 检查元素的样式属性
            if (elements && elements.style) {
                elements.style.display = 'none';
            } else {
                console.log('removeElementsWithShowMoreButton(): 没有找到对应元素或元素的样式属性不存在');
            }
        } else {
            console.log('removeElementsWithShowMoreButton(): element with showmore button not found.');
        }
    }

    // Function to remove "ytd-rich-grid-renderer" parts
    function removeElementsWithYtdrichgridrenderer() {
        console.log("removeElementsWithYtdrichgridrenderer()");
        GM_addStyle(`
    ytd-rich-section-renderer {
        display: none !important;
    }
`);
    }

    // Function to check if the current page is a subscription page and remove Shorts recommendations
    function removeShortsOnSubscriptionPage() {
        // Check if the current page is a subscription page
        console.log("removeShortsOnSubscriptionPage(): checking");
        if (window.location.href.includes('youtube.com/feed/subscriptions')) {
            // Call the function to remove Shorts recommendations
            console.log("removeShortsOnSubscriptionPage(): checked");
            removeElementsWithYtdrichgridrenderer();
            //removeElementsWithShowMoreButton();
        }
    }


    // 检测是否开启划水日
    function isTodayCheatDay() {
        var currentDate = getCurrentDate();
        var clicked = localStorage.getItem('cheatDayDateV1');

        return clicked === currentDate;
    }

    // 在页面加载完成后调用 checkFirstTimeUser() 函数
    // to be finished
    //createOptionsWindow();

    if(!isTodayCheatDay()){
        var redirectCheckingInterval = 500;
        setInterval(checkRedirectV2, redirectCheckingInterval); // Check for redirect every 500 milliseconds
        var redirectMonitor = monitorRedirect();

        setInterval(checkVideoRecommendations, 500);//detete recommendations on video play page
        setInterval(removeShortsOnSubscriptionPage, 1000);//remove shorts (and other recommendations, defined by if a "show more"button is displayed) on subscription page


        // Hide Home button
        GM_addStyle(`
        html body ytd-app div#content.style-scope.ytd-app ytd-mini-guide-renderer.style-scope.ytd-app div#items.style-scope.ytd-mini-guide-renderer > *:first-child {
            display: none !important;
        }
    `);
        // Hide Home button (side bar)
        GM_addStyle(`
        html body.lock-scrollbar ytd-app div#content.style-scope.ytd-app tp-yt-app-drawer#guide.style-scope.ytd-app div#contentContainer.style-scope.tp-yt-app-drawer div#guide-wrapper.style-scope.ytd-app div#guide-content.style-scope.ytd-app div#guide-inner-content.style-scope.ytd-app ytd-guide-renderer#guide-renderer.style-scope.ytd-app div#sections.style-scope.ytd-guide-renderer ytd-guide-section-renderer.style-scope.ytd-guide-renderer div#items.style-scope.ytd-guide-section-renderer > *:first-child {
            display: none !important;
        }
    `);
        // Hide Shorts buttons in the sidebar
        GM_addStyle(`
        a[title="Shorts"] {
            display: none !important;
        }
    `);

        // incase that didnt work...
        // Hide Home buttons in the sidebar
        GM_addStyle(`
        a[title="Home"] {
            display: none !important;
        }
    `);
        // Hide 主页 buttons in the sidebar
        GM_addStyle(`
        a[title="首页"] {
            display: none !important;
        }
    `);
        // hide "sections" left sidebar recommendation
        GM_addStyle(`
        ytd-guide-section-renderer.style-scope.ytd-guide-renderer:nth-child(3) {
            display: none !important;
        }
    `);
        // hide "more from youtube" left sidebar recommendation
        GM_addStyle(`
        ytd-guide-section-renderer.style-scope.ytd-guide-renderer:nth-child(4) {
            display: none !important;
        }
    `);

    }

    //获取原网页字体颜色，匹配暗色模式
    var selfAdjustTextColor = getComputedStyle(document.documentElement).getPropertyValue('--yt-spec-text-disabled');//about section text color
    var selfAdjustTextColorPrimary = getComputedStyle(document.documentElement).getPropertyValue('--yt-spec-text-primary');//title text color
    console.log('selfAdjustTextColor:');
    console.log(selfAdjustTextColor);

    // 创建按钮元素
    var buttonstop = document.createElement('button');
    if (navigator.language === 'zh-CN') {
        buttonstop.innerText = '暂停 YouTube';
    }
    else{
        buttonstop.innerText = 'YouTube Time-out';
    }

    // 创建按钮元素提示
    var buttonstoptip = document.createElement('div');
    buttonstoptip.style.color = selfAdjustTextColor;
    if (navigator.language === 'zh-CN') {
        buttonstoptip.innerText = '暂停 YouTube：点击按钮，禁止访问YouTube直至明日。【警告】：明日以前你将不能访问 youtube.com，且没有取消选项！！';
    }
    else{
        buttonstoptip.innerText = 'YouTube Time-out: click to completely block your access to YouTube today. WARNING: You won\'t be able to access youtube.com until tomorrow, and there\'s no option to cancel this!!';
    }

    var titlebuttontip = document.createElement('div');
    titlebuttontip.style.fontWeight = 'bold';
    titlebuttontip.style.fontSize = '16px';
    titlebuttontip.style.color = selfAdjustTextColorPrimary;
    titlebuttontip.style.marginBottom = '10px';
    if (navigator.language === 'zh-CN') {
        titlebuttontip.innerText = '干净油管：YouTube 去推荐';
    }
    else{
        titlebuttontip.innerText = 'YouTube Recommendations Be Gone: Cleaner YouTube';
    }

    //版本信息
    var versioninfo = document.createElement('div');
    versioninfo.style.color = selfAdjustTextColor;
    if (navigator.language === 'zh-CN') {
        versioninfo.innerText = '-----\n版本：'+version+"\n更新日期："+updateDate;
    }
    else{
        versioninfo.innerText = '-----\nVersion：'+version+"\nUpdateDate："+updateDate;
    }

    // 创建按钮元素
    var buttonabout = document.createElement('button');
    if (navigator.language === 'zh-CN') {
        buttonabout.innerText = '关于与反馈';
    }
    else{
        buttonabout.innerText = 'About & feedback';
    }

    // 创建按钮元素提示
    var buttonabouttip = document.createElement('div');
    buttonabouttip.style.color = selfAdjustTextColor;
    if (navigator.language === 'zh-CN') {
        buttonabouttip.innerText = '关于与反馈：关于这个脚本的信息，以及问题反馈地址';
    }
    else{
        buttonabouttip.innerText = 'About & feedback: All about this script & feedback website';
    }


    // 创建按钮元素
    var buttoncheatday = document.createElement('button');
    if (!isTodayCheatDay()){
        if (navigator.language === 'zh-CN') {
            buttoncheatday.innerText = '开启划水日';
        }
        else{
            buttoncheatday.innerText = 'Begin Cheat Day';
        }
    }
    else{
        if (navigator.language === 'zh-CN') {
            buttoncheatday.innerText = '结束划水日';
        }
        else{
            buttoncheatday.innerText = 'End Cheat Day';
        }
    }

    // 创建按钮元素提示
    var buttoncheatdaytip = document.createElement('div');
    buttoncheatdaytip.style.color = selfAdjustTextColor;
    if (navigator.language === 'zh-CN') {
        buttoncheatdaytip.innerText = '开启划水日：今日不再限制推荐内容\n结束划水日：重新限制推荐内容';
    }
    else{
        buttoncheatdaytip.innerText = 'Begin Cheat Day: Allow recommendations for today\nEnd Cheat Day: Block recommendations again';
    }

    // 创建按钮包裹元素
    var buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'button-wrapper';
    buttonWrapper.appendChild(titlebuttontip);
    buttonWrapper.appendChild(buttonstop);
    buttonWrapper.appendChild(buttonstoptip);
    buttonWrapper.appendChild(buttoncheatday);
    buttonWrapper.appendChild(buttoncheatdaytip);
    buttonWrapper.appendChild(buttonabout);
    buttonWrapper.appendChild(buttonabouttip);
    buttonWrapper.appendChild(versioninfo);

    // 创建文字元素
    var textBlockTitle = document.createElement('div');
    textBlockTitle.style.color = selfAdjustTextColorPrimary;
    textBlockTitle.style.fontSize = '24px';
    if (navigator.language === 'zh-CN') {
        textBlockTitle.innerText = '今日已暂停访问 YouTube';
    }
    else{
        textBlockTitle.innerText = 'Access to YouTube paused for today';
    }
    textBlockTitle.style.fontWeight = 'bold';

    // 查找目标位置并添加按钮
    function addButtonToContainer() {
        var container = document.getElementById('guide-links-primary');
        if (container) {
            console.log("function addButtonToContainer(): container found.");
            console.log(container);
            //var firstChild2 = container.firstElementChild;
            //container.insertBefore(buttontip, firstChild2);
            var firstChild = container.firstElementChild;
            container.insertBefore(buttonWrapper, firstChild);

            //按钮样式
            var buttonwrapperstyle = document.createElement('style');
            buttonwrapperstyle.innerHTML = `
.button-wrapper {
  border: 1px solid black; /* 添加黑色边框 */
  margin: 20px; /* 设置外边距 */
  padding: 10px; /* 设置内边距 */
}
`;
            document.head.appendChild(buttonwrapperstyle);
        } else {
            setTimeout(addButtonToContainer, 1000); // 等待1000ms后重新尝试添加按钮
        }
    }

    // 获取当前日期
    function getCurrentDate() {
        var today = new Date();
        var year = today.getFullYear();
        var month = String(today.getMonth() + 1).padStart(2, '0');
        var day = String(today.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    // 获取明日日期
    function getNextDay(currentDate) {
        var date = new Date(currentDate);
        date.setDate(date.getDate() + 1);
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    // 检测是否为指定页面
    function isTargetDomain() {
        return (
            window.location.href === 'https://www.youtube.com/feed/subscriptions/' ||
            window.location.href === 'https://www.youtube.com/feed/subscriptions'
        );
    }

    // 屏蔽网页内所有内容
    function blockAllContent() {
        if (!isHomePage()){
            var currentDate = getCurrentDate();

            // 显示文字提示
            document.body.innerHTML = '';

            // 显示日期提示
            var dateText = document.createElement('div');
            dateText.style.color = selfAdjustTextColor;
            dateText.style.fontSize = '16px';
            if (navigator.language === 'zh-CN') {
                dateText.innerText = '您已暂停 YouTube，按照您的要求现已阻断访问该网站。您可以于明日（' + getNextDay(currentDate) + '）重新访问。\n ';
            } else {
                dateText.innerText = 'You have activated YouTube Time-out, which has resulted in the blocking of your access to this website.\n You will be able to access YouTube again tomorrow (' + getNextDay(currentDate) + ')\n ';
            }


            // 帮助与反馈添加
            var timeouthelp = document.createElement('button');
            if (navigator.language === 'zh-CN') {
                timeouthelp.innerText = '帮助与反馈';
            } else {
                timeouthelp.innerText = 'Help & Support';
            }


            // 添加文字与按钮控件
            var centerContainerForBlockpage = document.createElement('div');
            centerContainerForBlockpage.style.display = 'flex';
            centerContainerForBlockpage.style.justifyContent = 'center';
            centerContainerForBlockpage.style.alignItems = 'center';
            centerContainerForBlockpage.style.height = '100vh';
            var blockpageTextWrapper = document.createElement('div');
            blockpageTextWrapper.appendChild(textBlockTitle);
            blockpageTextWrapper.appendChild(dateText);
            blockpageTextWrapper.appendChild(timeouthelp);
            centerContainerForBlockpage.appendChild(blockpageTextWrapper);

            document.body.appendChild(centerContainerForBlockpage);

            //帮助反馈按钮功能设置
            timeouthelp.addEventListener('click', function () {
                window.open('https://greasyfork.org/scripts/475942/feedback', '_blank');
            });
        }
    }

    // 检测是否已点击暂停按钮
    function hasClickedPauseButton() {
        var currentDate = getCurrentDate();
        var clicked = localStorage.getItem('pauseButtonClickedDateV1');

        return clicked === currentDate;
    }

    // 点击暂停访问按钮事件处理程序
    buttonstop.addEventListener('click', function () {
        // 记录点击日期
        var currentDate = getCurrentDate();
        localStorage.setItem('pauseButtonClickedDateV1', currentDate);

        // 屏蔽网页内容
        blockAllContent();
    });

    // 点击划水日事件处理程序
    buttoncheatday.addEventListener('click', function () {
        // 记录点击日期
        var currentDate = getCurrentDate();
        if (isTodayCheatDay()){
            localStorage.setItem('cheatDayDateV1', '0');
        }
        else{
            localStorage.setItem('cheatDayDateV1', currentDate);
        }

        // 刷新
        location.reload();
    });

    // 检测是否为指定域名，添加按钮
    if (isTargetDomain()) {
        addButtonToContainer();
    }

    // 检测是否已点击暂停按钮，屏蔽内容
    if (hasClickedPauseButton()) {
        blockAllContent();
    }

    //button：about & feedback 点击跳转
    buttonabout.addEventListener('click', function() {
        //window.location.href = 'https://greasyfork.org/scripts/475942/feedback';
        window.open('https://greasyfork.org/scripts/475942/feedback', '_blank');
    });

    function monitorRedirect() {
        var callCount = 0;
        var refreshInterval = 5000; // 刷新间隔，单位为毫秒，默认是5000ms，实际为强制跳转检测周期的6倍
        if(redirectCheckingInterval!=null){refreshInterval = 10*redirectCheckingInterval;}
        var maxCallCount = 5; // 最大调用次数阈值

        setInterval(function() {
            callCount = 0;
        }, refreshInterval);

        function checkCallCount() {
            callCount++;
            console.log("callCount=", callCount);
            if (callCount >= maxCallCount) {
                var confirmRedirectAltText;
                if (navigator.language === 'zh-CN') {
                    confirmRedirectAltText = '脚本检测到强制跳转订阅页面过于频繁，可能是由网络连接不畅或网页改版导致。\n\n您可以尝试更换网络环境或等待脚本更新。在此同时，您也可以尝试手动跳转。';
                    //window.close()
                }
                else{
                    confirmRedirectAltText = 'From YouTube Recommendations be Gone: we have noticed irregularly fast redirection to the subscription page, which may be caused by a relatively slow network connection or changes in the source code of youtube.com.\n\nYou can try using a different network or wait for this script to be updated. In the meantime, you can also manually redirect.';
                }
                var confirmRedirect = confirm(confirmRedirectAltText);
                if (confirmRedirect) {
                    window.open('https://www.youtube.com/feed/subscriptions', '_blank');
                    window.close();
                }
            }
        }

        return {
            incrementCallCount: function() {
                checkCallCount();
            }
        };
    }
})();
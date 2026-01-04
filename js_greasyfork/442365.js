// ==UserScript==
// @name         油管搜索关键词过滤 Youtube Search Keyword Filter
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  把指定的关键词从油管搜索结果中过滤隐藏 Remove Youtube search results with custom keywords
// @author       CWBeta
// @license      MIT
// @include      *youtube.com*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @namespace    https://greasyfork.org/users/670174
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442365/%E6%B2%B9%E7%AE%A1%E6%90%9C%E7%B4%A2%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%20Youtube%20Search%20Keyword%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/442365/%E6%B2%B9%E7%AE%A1%E6%90%9C%E7%B4%A2%E5%85%B3%E9%94%AE%E8%AF%8D%E8%BF%87%E6%BB%A4%20Youtube%20Search%20Keyword%20Filter.meta.js
// ==/UserScript==

(function() {
    var KEYWORDS_TO_FILTER = [];

    console.log("[Youtube Keyword Filter] Running");

    function AddToolbar(){
        var toolbarToggleBtn = document.createElement('div');
        toolbarToggleBtn.setAttribute("id", "cwbeta-toolbar-toggle-btn");
        toolbarToggleBtn.innerText = "🎃";
        toolbarToggleBtn.addEventListener("click", ToggleToolbar, false);
        document.body.appendChild(toolbarToggleBtn);

        var toolbar = document.createElement('div');
        toolbar.setAttribute("id", "cwbeta-toolbar");
        toolbar.innerHTML += '<div class="toolbar-arrow"></div>';
        toolbar.innerHTML += '<span>过滤关键词：</span><input id="filterkeywords" placeholder="在此添加过滤关键词">'
        document.body.appendChild(toolbar);

        var filterInput = document.getElementById("filterkeywords");
        filterInput.addEventListener("input", OnChangeFilterKeyword);
    }

    function AutoHideButton()
    {
        if (IsFullscreen() || IsInIframe())
        {
            document.getElementById("cwbeta-toolbar-toggle-btn").style["display"] = "none";
        }
        else
        {
            document.getElementById("cwbeta-toolbar-toggle-btn").style["display"] = "block";
        }
    }

    function LoadFilterHistory(){
        UpdateKeywords();
    }

    function SaveFilterHistory(){
        var filterInput = document.getElementById("filterkeywords");
        localStorage.setItem("CWBeta-youtube.com-FilterKeywords", filterInput.value);
        console.log("Save Filter Keywords: " + filterInput.value);
        UpdateKeywords();
    }

    function UpdateKeywords(){
        var savedFilterString = localStorage.getItem("CWBeta-youtube.com-FilterKeywords");
        if (savedFilterString == null)
        {
            savedFilterString = "";
            SaveFilterHistory();
        }
        KEYWORDS_TO_FILTER = savedFilterString.split(" ");
        var filterInput = document.getElementById("filterkeywords");
        filterInput.value = savedFilterString;
    }

    function TryFilter()
    {
        var rootNodes = document.getElementsByTagName("ytd-video-renderer");
        for (var i = 0; i < rootNodes.length; i++) {
            DoFilter(rootNodes[i])
        }
        AutoHideButton();
    }

    function RefreshFilter(){
        var rootNodes = document.getElementsByTagName("ytd-video-renderer");
        for (var i = 0; i < rootNodes.length; i++) {
            var rootNode = rootNodes[i];
            if (rootNode.getAttribute("cwbeta-filtered") == "true"){
                var titleNode = rootNode.getElementsByTagName("yt-formatted-string")[0];
                var title = titleNode.innerText;
                rootNode.setAttribute("cwbeta-filtered", "false")
                rootNode.style.display = "block";
                //console.log("[Unfiltered]" + title);
            }
        }
        TryFilter();
    }

    function DoFilter(rootNode)
    {
        if (rootNode.getAttribute("cwbeta-filtered") == "true"){
            return;
        }

        var titleNode = rootNode.getElementsByTagName("yt-formatted-string")[0];
        var title = titleNode.innerText;
        var label = titleNode.getAttribute("aria-label");

        KEYWORDS_TO_FILTER.forEach(keyword => {
            if (keyword == "" || keyword == null){
                return;
            }
            if(title.indexOf(keyword) != -1
               || label.indexOf(keyword) != -1){
                //rootNode.parentNode.remove(rootNode);
                rootNode.style.display = "none";
                rootNode.setAttribute("cwbeta-filtered", "true");
                console.log("[Filtered]" + title);
            }
        })
    }

    function OnChangeFilterKeyword(){
        console.log("---------------[Update Keywords]---------------");
        SaveFilterHistory();
        RefreshFilter();
    }

    function ToggleToolbar(){
        var toolbar = document.getElementById("cwbeta-toolbar");
        toolbar.style.display = toolbar.style.display == "block" ? "none" : "block";
    }

    function AddCss()
    {
        var style = document.createElement("style");
        style.type = "text/css";
        var cssString = "#cwbeta-toolbar-toggle-btn{position:fixed; right:12px; bottom:12px; width:40px; height:40px; line-height: 40px; text-align: center; font-size: 24px; cursor:pointer; transform: rotate(0deg) scale(1,1); transition: 0.5s; text-shadow: 0px 0px 2px rgba(0,0,0,0.6)}"+
            "#cwbeta-toolbar-toggle-btn:hover {transform: rotate(360deg) scale(1.5,1.5); }"+
            "#cwbeta-toolbar {position: fixed; right: 16px; bottom: 58px; width: auto; height: auto; display: none; font-size: 16px; line-height: 24px; padding: 8px 16px; border: #8d8d8d 1px solid; border-radius: 8px; background: #343434; color: white; z-index: 999;}"+
            ".toolbar-arrow {position: absolute; display: block; right: 10px; bottom: -7px; width: 12px; height: 12px; transform: rotate(45deg); background: #343434; border-right: #8d8d8d 1px solid; border-bottom: #8d8d8d 1px solid;}"+
            "#cwbeta-toolbar input{background: transparent; color: white; line-height: 24px; padding: 4px; font-size: 16px; border: 1px #727272 solid; border-radius: 4px;}"
        try
        {
            style.appendChild(document.createTextNode(cssString));
        }
        catch(ex)
        {
            style.styleSheet.cssText = cssString;//针对IE
        }
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(style);
    }

    function IsFullscreen()
    {
        var fullscreenRoot = document.getElementById("player-theater-container");
        if (fullscreenRoot != null)
        {
            var fullscreenCount = fullscreenRoot.getElementsByTagName("ytd-player").length;
            if (fullscreenCount > 0)
            {
                console.log("检测到全屏播放，隐藏关键词过滤按钮，避免遮挡播放工具栏。")
                return true;
            }
        }
         return false;
    }

    function IsInIframe()
    {
        if (self != top)
        {
            console.log("检测到为第三方网页嵌套YouTube，隐藏关键词过滤按钮，避免遮挡播放工具栏。")
            return true;
        }
        return false;
    }

    function Awake(){
        AddCss();
        AddToolbar();
        LoadFilterHistory();
        TryFilter();
        setInterval(TryFilter, 200);
    }

    Awake();

})();
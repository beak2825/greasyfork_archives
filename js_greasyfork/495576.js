// ==UserScript==
// @name         雨课堂答题提醒
// @namespace    https://greasyfork.org/zh-CN/users/1269309/h1t52_crack
// @version      2025-03-12
// @description  owo
// @author       oldkingOK
// @match        *://changjiang.yuketang.cn/*
// @icon         https://changjiang.yuketang.cn/static/images/favicon.ico
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495576/%E9%9B%A8%E8%AF%BE%E5%A0%82%E7%AD%94%E9%A2%98%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/495576/%E9%9B%A8%E8%AF%BE%E5%A0%82%E7%AD%94%E9%A2%98%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.
    Usage example:
        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );
        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }
    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
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
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

function setToken(token) {
    GM_setValue("ok_token", token);
};

function getToken() {
    return GM_getValue("ok_token", "");
};

var ele = `
<div id="search" hidden style="width: 500px;height: 150px;position: fixed;top: 10%;left: 0;z-index: 10;">
    <div class="serf" style="height: 100px;width: 320px;border: #000000 solid 2px;box-sizing: border-box;padding-left: 50px;background-color: #cccccc;">
        <h2 style="margin-bottom: 5px">Token编辑</h2>
        <div class="ser">
            <form id="searchForm"  method="GET">
                <input type="text" id="searchInput" name="query" placeholder="some token"></input>
                <button type="submit">确认</button>
            </form>
        </div>
    </div>
</div>
<script>
function hide() {
    search.hidden = !search.hidden;
}
</script>
`

$ele = $(ele);
$ele.find("input").val(getToken());
$('body').prepend($ele);

(function() {
    'use strict';

    function addButton(jNode) {
        const button = document.createElement('button');
        button.innerHTML = '修改PushPlus的Token';
        button.onclick = function() { hide(); };
        jNode[0].appendChild(button);
    }
    waitForKeyElements(".action__more", addButton);

    $('#searchForm').on('submit', function(event) {
        event.preventDefault();
        setToken($("#searchInput").val());
        console.log("Token已经修改为：" + $("#searchInput").val());
    });
    // 重写console.log
    // https://stackoverflow.com/questions/54562790/cannot-set-property-which-only-has-getter-javascript-es6
    console.log("插件加载中...");
    var temp = console.log;
    // 油猴脚本的上下文和页面的上下文不同，所以需要使用unsafeWindow
    unsafeWindow.console.log = function(args) {
        temp(args);
        if (args.op && (args.op == "probleminfo" || args.op == "unlockproblem")) {
            var time = new Date().getTime(); // 防止pushplus平台“频繁消息”
            $.ajax({
                url: 'https://www.pushplus.plus/send',
                type: 'GET',
                data: {
                    'token': getToken(),
                    'title': '有新的答题了！' + time,
                    'content': '# 有新的答题了！' + time,
                    'template': 'markdown'
                },
                success: function(data) {
                    console.log("发送成功!");
                    console.log(data.msg);
                },
                error: function(error) {
                    console.error('Error:', error);
                    console.log(error);
                }
            });
        }
    };
    console.log("插件加载完成！");
})();
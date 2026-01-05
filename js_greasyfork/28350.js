// ==UserScript==
// @name         WeiboBlocker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       yuyue9284@gmail.com
// @include      http://weibo.com*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28350/WeiboBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/28350/WeiboBlocker.meta.js
// ==/UserScript==


var block = [];


// 增加关键词
function add_word() {
    var word = prompt('请输入');
    switch (word) {
        case "clear":
            localStorage.removeItem('block');
            block = [];
            break;
        case "show":
            alert(localStorage.block);
            break;
        default:
            block.push(word);
            localStorage.block = JSON.stringify(block);
    }
    action();
}

// 初始化
var init = function() {
    if (localStorage.block !== undefined) {
        block = JSON.parse(localStorage.block);
    } else {
        block = ['tf', 'TF', 'Tf', '王源', '易烊千玺', '王俊凯'];
        localStorage.block = JSON.stringify(block);
    }
    $(".gn_header.clearfix").off('click', add_word).on('click', add_word);
    action();
};


$(document).ready(init);

// 屏蔽函数本体
var action = function() {
    var lst = $(".WB_cardwrap.WB_feed_type.S_bg2").map(function() {
        return $(this);
    });
    for (var i = lst.length - 1; i >= 0; i--) {
        for (var j = block.length - 1; j >= 0; j--) {
            var content = lst[i].text();
            if (content.includes(block[j])) {
                lst[i].css("display", "none");
                // console.log(content);
                break;
            }
        }
    }
};
waitForKeyElements(".WB_cardwrap.WB_feed_type.S_bg2", action);





// Script from https://gist.github.com/raw/2625891/waitForKeyElements.js
// used to wait for the element seleted by jQuery loading

function waitForKeyElements(
    selectorTxt,
    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction,
    /* Required: The code to run when elements are
                           found. It is passed a jNode to the matched
                           element.
                       */
    bWaitOnce,
    /* Optional: If false, will continue to scan for
                      new elements even after the first match is
                      found.
                  */
    iframeSelector
    /* Optional: If set, identifies the iframe to
                          search.
                      */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
        .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each(function() {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    } else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj[controlKey];
    } else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function() {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                },
                300
            );
            controlObj[controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

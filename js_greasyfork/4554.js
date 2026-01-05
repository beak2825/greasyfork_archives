// ==UserScript==
// @name        新浪秀场清屏
// @namespace   https://greasyfork.org/scripts/4554-新浪秀场清屏
// @description 进入房间时关闭特效并清屏。
// @author      softiger
// @version     1.0
// @include     http://ok.sina.com.cn/9*
// @grant       GM_addStyle
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @history     1.0 Initial release.
// @downloadURL https://update.greasyfork.org/scripts/4554/%E6%96%B0%E6%B5%AA%E7%A7%80%E5%9C%BA%E6%B8%85%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/4554/%E6%96%B0%E6%B5%AA%E7%A7%80%E5%9C%BA%E6%B8%85%E5%B1%8F.meta.js
// ==/UserScript==

$(document).ready( function() {
    document.getElementById("btnshowgift").click();
    document.getElementsByClassName("box_main")[0].getElementsByTagName("a")[0].click();
    /*for (var i=1; i<35; i++)
      clearInterval(i);*/
});

/*--- Create a button in a container div. It will be styled and
  positioned with CSS.
*/
var zNode = document.createElement("div");
zNode.innerHTML = '<button id="myButton" type="button">'
    + 'Clear</button>';
zNode.setAttribute("id", "myContainer");
document.body.appendChild(zNode);

//--- Activate the newly added button.
document.getElementById("myButton").addEventListener(
    "click", ButtonClickAction, false
);

function ButtonClickAction(zEvent) {
    $("#goto_phone_link").remove();
    $("#quest_qd").remove();
    $("#quest_button").remove();
    $("#quest_box").remove();
    $("#goto_top_tag").remove();
    $("#imBox").remove();
}

//--- Style our newly added elements using CSS.
GM_addStyle( multilineStr( function() { /*!
					  #myContainer {
					  position:               absolute;
					  top:                    25em;
					  left:                   24em;
					  font-size:              20px;
					  background:             orange;
					  padding:                1px 2px;
					  border:                 3px outset silver;
					  margin:                 5px;
					  opacity:                0.5;
					  z-index:                9999;
					  }
					  #myButton {
					  cursor:                 pointer;
					  }
					*/ } ) );

function multilineStr(dummyFunc) {
    var str = dummyFunc.toString();
    str = str.replace(/^[^\/]+\/\*!?/, "")  // Strip function() { /*!
	.replace(/\s*\*\/\s*\}\s*$/, "")  // Strip */ }
	.replace(/\/\/.+$/gm, "");  // Double-slash comments wreck CSS. Strip them.
    return str;
}

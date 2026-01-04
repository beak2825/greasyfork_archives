// ==UserScript==
// @name       custom DLSite linker 아카라이브 개조
// @version    1.1.9a
// @description  RJ/VJ 코드에 DLsite 링크를 걸어줍니다.
// @match      https://arca.live/b/*
// @namespace https://greasyfork.org/users/951189
// @downloadURL https://update.greasyfork.org/scripts/450255/custom%20DLSite%20linker%20%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EA%B0%9C%EC%A1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/450255/custom%20DLSite%20linker%20%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EA%B0%9C%EC%A1%B0.meta.js
// ==/UserScript==


/*
based on: https://userscripts-mirror.org/scripts/review/155521
1.1.9a
8자리 RJ코드 대응.

1.1.8a
VJ주소 수정

1.1.7a
언더바 대응

1.1.6a
전각 문자 대응

1.1.5a
R J 1 2 3 4 5 6 등의 공백 문자 대응.

1.1.4a
아카라이브 구독자 수에는 작동하지 않도록 수정.

1.1.3a
아카라이브 사이트 외에서도 작동하던 문제 수정.

1.1.2a
아카라이브에서 쓸 수 있도록 내맘대로 개조. RJ, VJ, 거, 꺼, 퍼, #등의 기호, 숫자만 6자리 모두 대응.

1.1.1
commented out document.normalize(); it was causing https://overwatchlf.com/ to break

1.1
changed so it works on all websites. forced all rj numbers to be uppercase and specified a length of 6 numbers.
*/

// MAXIMUM LENGTH OF LEFT STRING
// "&amp;laquo;".length = 11
var MAX_LEFT_STR = 11;
var fixBalanced = function(text, leftStr)
{
    var index = -1;
    switch (leftStr.charAt(leftStr.length - 1))
    {
        case "`": index = text.indexOf("'"); break; // `  '
        case "'": index = text.indexOf("'"); break; // '  '
        case "(": index = text.indexOf(")"); break; // (  )
        case "[": index = text.indexOf("]"); break; // [  ]
    }
    if (index > -1)
    {
        return text.substring(0, index);
    }
    leftStr = leftStr.substring(leftStr.length - MAX_LEFT_STR);
    if (/&lt;$/.test(leftStr)) { index = text.indexOf("&gt;"); }                        // <  >
    else { if (/&amp;lt;$/.test(leftStr)) { index = text.indexOf("&amp;gt;"); }         // <  >
    else { if (/&amp;#60;$/.test(leftStr)) { index = text.indexOf("&amp;#62;"); }       // <  >
    else { if (/&amp;quot;$/.test(leftStr)) { index = text.indexOf("&amp;quot;"); }     // "  "
    else { if (/&amp;#34;$/.test(leftStr)) { index = text.indexOf("&amp;#34;"); }       // "  "
    else { if (/&amp;#96;$/.test(leftStr)) { index = text.indexOf("'"); }               // `  '
    else { if (/&amp;laquo;$/.test(leftStr)) { index = text.indexOf("&amp;raquo;"); }   // ≪  ≫
    else { if (/&amp;#171;$/.test(leftStr)) { index = text.indexOf("&amp;#187;"); }     // ≪  ≫
    }}}}}}}
    if (index > -1)
    {
        return text.substring(0, index);
    }
    return text;
};

var textToLink = function(nodeValue)
{
    var changesMade = false;
    nodeValue = nodeValue.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var DLSiteRegEx = new RegExp(/[^\d|\n]{0,1}[^\S\n]*[^\d|\n]{0,1}([ |　|_]*[0-9|０-９]){6,8}/,'gi'); //접두사 0~2자리 (null/거/RJ)
    //var DLSiteRegEx = new RegExp(/[^\d|\s]{0,1}[^\S\n]*[^\d|\s]{1}([ |　|_]*[0-9|０-９]){6}/,'gi'); //접두사 1~2자리 (거/RJ)
    var matches = null;
    var text = null;
    var index = null;
    var leftStr = null;
    var link = null;
    var anchor = null;
    var fromIndex = 0;

    var pure_rjcode = null;
    var rj_num = null;
    var prefix = null;

    while ( (matches = nodeValue.substring(fromIndex).match(DLSiteRegEx)) !== null )
    {
        text = matches[0];
        index = nodeValue.indexOf(text, fromIndex);
        leftStr = nodeValue.substring(0, index);
        text = fixBalanced(text, leftStr);
        fromIndex = index + text.length;
        if (/^([aaaoou]|\.\w)/i.test(nodeValue.substring(fromIndex, fromIndex + 2)))
        {
            continue;
        }
        //link = nodeValue.substring(index, index + text.length);

        pure_rjcode = text.replace(/\s|_/gi, "").replace(/[\uff01-\uff5e]/g, function(ch) { return String.fromCharCode(ch.charCodeAt(0) - 0xfee0); } );
        //rj_num = pure_rjcode.substr(-6);
        //prefix = pure_rjcode.slice(0,-6);
        rj_num = pure_rjcode.replace(/\D/gi, "")
        prefix = pure_rjcode.replace(/\d/g, "")
        console.log(rj_num);
        console.log(prefix);

        if (prefix.match('독자') || prefix.match('이트'))
            continue;

        if (prefix.match(/vj|퍼/i))
            anchor = "<a href=\"https://www.dlsite.com/pro/work/=/product_id/" + "VJ" + rj_num + ".html\">" + text + "</a>";
        else
            anchor = "<a href=\"https://www.dlsite.com/maniax/work/=/product_id/" + "RJ" + rj_num + ".html\">" + text + "</a>";

        /*
        if (link.match(/rj/i)) {
          anchor = "<a href=\"https://www.dlsite.com/maniax/work/=/product_id/" + link.toUpperCase() + ".html\">" + text + "</a>";
        } else {
          anchor = "<a href=\"https://www.dlsite.com/ecchi-eng/work/=/product_id/" + link.toUpperCase() + ".html\">" + text + "</a>";
        }
        */

        nodeValue = leftStr + anchor + nodeValue.substring(fromIndex);
        fromIndex = index + anchor.length;
        changesMade = true;
    }
    if (!changesMade)
    {
        return null;
    }
    else
    {
        return nodeValue;
    }
};
var main = function()
{
    //document.normalize(); // this line causes https://overwatchlf.com/ to break. commented out
    var elements = null;
    var element = null;
    var nodeValue = null;
    elements = document.evaluate(".//text()[not(ancestor::a) and not(ancestor::button) and not(ancestor::label) and not(ancestor::legend) and not(ancestor::option) and not(ancestor::script) and not(ancestor::select) and not(ancestor::style) and not(ancestor::textarea) and not(ancestor::title)]", document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (!elements || elements.snapshotLength === 0)
    {
        return;
    }
    var span = null;
    for (var i = 0; i < elements.snapshotLength; i++)
    {
        element = elements.snapshotItem(i);
        nodeValue = textToLink(element.nodeValue);
        if (nodeValue)
        {
            span = document.createElement("span");
            span.innerHTML = nodeValue;
            element.parentNode.replaceChild(span, element);
        }
    }
};
main();
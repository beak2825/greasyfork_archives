// ==UserScript==
// @name        2nunu Fixer
// @namespace   2nunuFixer
// @include     http://www.2nunu.com/look*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @version     1
// @grant       GM_xmlhttpRequest
// @description load multi picture in one page for 2nunu
// @downloadURL https://update.greasyfork.org/scripts/29525/2nunu%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/29525/2nunu%20Fixer.meta.js
// ==/UserScript==
const gBaseUrl = location.href;

var strTmp = "";
var strLink = "";
var i=0;
var j=1;

var splited_ImgUrl = $("#cpimg").eq(0).attr("src").split('/');
//1.jpg
var strFullFileName = splited_ImgUrl[splited_ImgUrl.length-1];

//1
var strMainFileName = strFullFileName.substring(0,strFullFileName.indexOf('.'));

//.jpg
var strSubFileName = strFullFileName.substring(strFullFileName.indexOf('.'));

//1
var intMainFileNameLength = strMainFileName.length;

//http://img.2animx.com//upload/img/0w/3b/383/65/
var strFullFilePath = $("#cpimg").eq(0).attr("src").substring(0,$("#cpimg").eq(0).attr("src").indexOf(strFullFileName));

var tmpint=0;
var intCurrentPage = 0;

for (tmpint=0;tmpint<$("option").length;tmpint++) {
    if ($("option").eq(tmpint).attr("selected")=="selected") {
        intCurrentPage = parseInt($("option").eq(tmpint).val());
    }
}

for (i=parseInt(strMainFileName)+1;i<parseInt(strMainFileName)+1+$("option").length-intCurrentPage;i++)
{
    j++;
    if (i<10) {
        if (strMainFileName.length>1) {
            strLink = "<br><img src='" + strFullFilePath +'0' + i + strSubFileName + "' onmousedown='page();' style='border:2px solid #111; padding:2px;cursor:pointer;width:794px;'>";
        } else {
            strLink = "<br><img src='" + strFullFilePath + i + strSubFileName + "' onmousedown='page();' style='border:2px solid #111; padding:2px;cursor:pointer;width:794px;'>";
        }
    } else {
        strLink = "<br><img src='" + strFullFilePath + i + strSubFileName + "' onmousedown='page();' style='border:2px solid #111; padding:2px;cursor:pointer;width:794px;'>";
    }
    strTmp = strTmp + strLink;
    if (j==15) break;
}


$("#cpimg").eq(0).after(strTmp);
$("#pos").val((intCurrentPage+parseInt(j)-1));

// ==UserScript==
// @name         北信科自动评教
// @version      1.0
// @description  可以自动选择最优项和填写评语，复制去控制台运行就可以了
// @author       李啊若
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @namespace https://greasyfork.org/users/995792
// @downloadURL https://update.greasyfork.org/scripts/456428/%E5%8C%97%E4%BF%A1%E7%A7%91%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/456428/%E5%8C%97%E4%BF%A1%E7%A7%91%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var optionBtn = document.getElementsByClassName("bh-radio-label");
    for(var i =0;i<optionBtn.length;i+=3)
    {
        optionBtn[i].click();
    }
    var text=document.getElementsByClassName("bh-txt-input__txtarea");
    for(var x=0;x<text.length;x+=1)
    {
        text[x].value="老师教的很好，没有意见";
    }
    var upup=document.getElementsByClassName("bh-btn bh-btn-success bh-btn-large");
    for(var y=0;y<upup.length;y+=1)
    {
        upup[y].click();
    }
    var yes=document.getElementsByClassName("bh-dialog-btn bh-bg-primary bh-color-primary-5");
     for(var h=0;h<yes.length;h+=1)
    {
        yes[h].click();
    }
})();
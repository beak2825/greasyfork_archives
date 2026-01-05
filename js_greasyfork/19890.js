// ==UserScript==
// @name         Pootle - Updates all languages from VCS
// @namespace    http://japantravel.com/
// @version      0.1
// @description  Try to pull all changes from VCS
// @author       Tuan Duong <tuan@metroworks.com.jp
// @match        http://pootle.japantravel.com/en/japantravel-acq2/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19890/Pootle%20-%20Updates%20all%20languages%20from%20VCS.user.js
// @updateURL https://update.greasyfork.org/scripts/19890/Pootle%20-%20Updates%20all%20languages%20from%20VCS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var commitButton = $(".icon-vcs-update");
    var commitLi = commitButton.parent().parent();
    var commitAllLi = commitLi.clone();
    commitAllLi.find("a span").html("Update all languages from VCS");
    commitAllLi.find("a").click(function() {
        console.log('Start updating...');
        ["ar","en","fr","id","ja","ko","ru","pt","th","es","vi","zh_Hans","zh_Hant",].forEach(function(lang){
            $.ajax("http://pootle.japantravel.com/"+lang+"/japantravel-acq2/vcs-update/",{async:false,success:function(){console.log(lang+" OK");}});
        });
        console.log('Done!');
        return false;
    });    
    commitLi.after(commitAllLi);
})();
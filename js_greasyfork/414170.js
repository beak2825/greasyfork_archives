// ==UserScript==
// @name         cmr
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://learning.cmr.com.cn/student/acourse/HomeworkCenter/InstantRnd.asp?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414170/cmr.user.js
// @updateURL https://update.greasyfork.org/scripts/414170/cmr.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var jsonObj=window.localStorage.getItem('answer')
    if(jsonObj==''){
        jsonObj=[]
    }
    else
    {
        jsonObj=JSON.parse(jsonObj)
    }
    var addCnt=0;

    $('.st_cont').each(function(i){
        //debugger
        var obj=$(this)
        var number=$('td[width=8]',obj).text();
        var title=$('.MsoNormal',obj).first().text().replace(number,'');
        var answer=$('.showAnswer',obj).first().prev().text().replace('答案：','').replace(/(^\s*)|(\s*$)/g,'');
        var type=obj.prev().text()
        if(type.indexOf('选择')>=0||type.indexOf('判断')>=0)
        {
            //return true;
        }


        var exists=false;
        for(var x=0;x<jsonObj.length;x++)
        {
            if(jsonObj[x].key==number)
            {
                exists=true;
                break;
            }
        }



        if(!exists){
            addCnt++;
            var d={key:number,title:number+title,value:answer}
            jsonObj.push(d);
        }

    })

    if(addCnt==0){
        alert("done");

    }
    var data=JSON.stringify(jsonObj)

    window.localStorage.setItem('answer',data);

    console.log(jsonObj.length);

    setTimeout("window.location.reload()",3000);

})();
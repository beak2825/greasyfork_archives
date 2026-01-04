// ==UserScript==
// @name         自动周报序列号
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://10.0.0.213:8080/wiki/pages/editpage.action*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476047/%E8%87%AA%E5%8A%A8%E5%91%A8%E6%8A%A5%E5%BA%8F%E5%88%97%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/476047/%E8%87%AA%E5%8A%A8%E5%91%A8%E6%8A%A5%E5%BA%8F%E5%88%97%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // $x('//table[@class="confluenceTable"][1]//tr/td[1]');

    setInterval(fill , 5000);

    function _x(STR_XPATH,parent=null) {
        if (parent==null){
            parent=document;
        }
        var xresult = document.evaluate(STR_XPATH, parent, null, XPathResult.ANY_TYPE, null);
        var xnodes = [];
        var xres;
        while (xres = xresult.iterateNext()) {
            xnodes.push(xres);
        }

        return xnodes;
    }
    function fill(){
        var isEnable=false
        _x('//p/strong[contains(text(), "容器云团队")]').forEach((el)=>{
            //   console.log(el.textContent)
            // if(el.textContent.indexOf("容器云团队")>=0){
            isEnable=true
            // }
        })
        console.log(isEnable)
        if(isEnable){
            var lst=_x('//body/table[1]//tr[position() != 1]/td[1]')
            // var sub=_x('//tr/td[1]',lst)
            console.log(lst)
            for(var i=0;i<lst.length;i++){
                lst[i].innerHTML = i+1;
                // console.log(lst[i].innerHTML = i+1);//textContent
            }
            console.log('>>>>> fill done')
        }
    }
    //function loop(){
    //    setInterval(fill,100)
    //}
    // Your code here...
})();
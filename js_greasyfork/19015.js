// ==UserScript==
// @name         Library filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  library search result filter of USTB
// @author       Wong
// @match        http://lib.ustb.edu.cn:8080/opac/openlink.php*
// @require      http://libs.baidu.com/jquery/1.10.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19015/Library%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/19015/Library%20filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var mybutton = document.createElement('div');
    mybutton.style = "width:100px;";
    mybutton.innerHTML = "<input"+" id='fuckit'"+" type='button' "+" style ='width:90px;heigth:40px;color:red;' "+"value='Filter'"+" onclick='dontshow()' "+">" +"</input>";
    
    var box = document.querySelector('#content div div');
    box.appendChild(mybutton);
    
    var fuckit = $('#fuckit');
    fuckit.click( function(){
    var resultlist = document.querySelectorAll('.book_list_info');
    for (var i=0;i<resultlist.length;i++){
        var span1 = resultlist[i].querySelectorAll('p')[0].querySelectorAll('span')[0].innerHTML;
        var number1 = span1.slice(-1);
        //console.log(Number(number1));
        if (Number(number1) === 0){
            resultlist[i].style.display = 'none';
        }
    }
   });
    
    // Your code here...
})();
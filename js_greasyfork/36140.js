// ==UserScript==
// @name         自动弹框 Jaeger
// @namespace    https://github.com/jae-jae
// @version      0.1
// @description  自动弹框，QQ:734708094
// @author       You
// @match        http*://*/*
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36140/%E8%87%AA%E5%8A%A8%E5%BC%B9%E6%A1%86%20Jaeger.user.js
// @updateURL https://update.greasyfork.org/scripts/36140/%E8%87%AA%E5%8A%A8%E5%BC%B9%E6%A1%86%20Jaeger.meta.js
// ==/UserScript==

(function() {
    var urls = [
        'https://www.baidu.com/',
        'http://www.qq.com/'
    ];

    function in_array(search,array)
    {
        for(var i in array){
            if(array[i]==search){
                return true;
            }
        }
        return false;
    }

    if(in_array(location.href,urls)){
      alert(1);
    }

    $(document).bind('keydown', 'ctrl+a', function(){
        urls.map(function(url){
           window.open(url);
        });
    });

})();
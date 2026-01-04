'use strict';
//javascript
// ==UserScript==
// @name zhihu filter
// @namespace http://tampermonkey.net/
// @version 2.0
// @description try to take over the world!
// @match https://www.zhihu.com
// @match https://www.zhihu.com/hot
// @match https://www.zhihu.com/follow
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @charset		 UTF-8
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/402764/zhihu%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/402764/zhihu%20filter.meta.js
// ==/UserScript==

(function() {
'use strict';

    var blacklist = []
    var shieldKeywords=[]

    function clearAdvert() {
            var paras = document.getElementsByClassName('TopstoryItem--advertCard');
            for(var i=0;i<paras.length;i++){
                if (paras[i] != null)
                    paras[i].parentNode.removeChild( paras[i])
            }



	}
    function clearWord() {
        var str1=""
        let s = new Set()
            $(".ContentItem-title a").each(function(){
                var title=$(this).text().toLowerCase().replace(/\s+/g,"")
                if(s.has(title) ){
                    //console.log(title)
                    $(this).parentsUntil(".TopstoryItem").parent().remove()
                }else{
                    s.add(title)

                    str1=str1+title+"\n"
                    for(var i=0;i<blacklist.length;i++){
                          if(title.indexOf(blacklist[i])!=-1){
                            console.log(title+"#"+blacklist[i])
                            $(this).parentsUntil(".TopstoryItem").parent().remove()
                            break
                        }
                    }
                }

            })
	}
    var res=[]
    var cnt=0
    let initShieldKeywords=() => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://gitee.com/dataastron/filter/raw/master/black.txt",
            onload: function(response) {

                console.log(response.responseText)

                res = window.JSON.parse(response.responseText);
                for (const str of res) {
                  if (shieldKeywords.indexOf(str) === -1) {
                    shieldKeywords.push(str);
                    ++cnt;
                  }
                }
                //window.alert(['成功添加', cnt, "个屏蔽关键字"].join(''));
            }
        });
};
    initShieldKeywords();
    //var banner = document.querySelectorAll('.css-w3ttmg');
    //banner[banner.length - 1].remove();
    window.addEventListener('load', (event) => {
        console.log(shieldKeywords.length)
        blacklist.push.apply(blacklist,shieldKeywords);
        console.log(blacklist.length)
        setInterval(function(){
            clearAdvert();
            clearWord();}, 500);
    })
})();


// ==UserScript==
// @name        优书网简单分类标签
// @namespace   none
// @description 在优书网综合评分处加简单分类标签，基于读者评论，只能读第一页评论，原因看网页代码自知。如：综合评分: 7.9，无女主，爽文
// @version     2.3
// @include     *://www.yousuu.com/category*
// @run-at      document-end
// @grant	GM_xmlhttpRequest
// @require http://static.hdslb.com/js/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/31744/%E4%BC%98%E4%B9%A6%E7%BD%91%E7%AE%80%E5%8D%95%E5%88%86%E7%B1%BB%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/31744/%E4%BC%98%E4%B9%A6%E7%BD%91%E7%AE%80%E5%8D%95%E5%88%86%E7%B1%BB%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==
jQuery.noConflict(); 
(function($) {
    function extractDocument(el) {
        var contents = "";
        var childNodes = el.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var c = childNodes[i];
            switch (c.nodeType) {
                //case 1:  
                //if(c.nodeName=="A");  
                //extractDocument(c);  
                //break;  
                case 3:
                    if (trim(c.nodeValue).length == 0) break;
                    contents += " | " + c.nodeValue;
                    break;
            }
        }
        return contents;
    }

    function trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
    }


    var bookItems = $(".booklist-item");
    var titles = [];
    var rates = [];
    var resetPage = function() {
        for (var i = 0, j = bookItems.length; i < j; i++) {

            titles[i] = 'http://www.yousuu.com' + bookItems.eq(i).find(".title a").attr('href');
            rates[i] = bookItems.eq(i).find(".num2star");

            //解决for循环中i变量在闭包的问题，用一个function(num)包裹闭包
            //http://www.cnblogs.com/ZinCode/p/5551907.html
            (function(num) {
                GM_xmlhttpRequest({
                    url: titles[num],
                    headers: {
                        'Accept': 'text/html'
                    },
                    context: titles[num],
                    method: 'GET',
                    onreadystatechange: function(response) {


                        if (response.readyState === 4) {

                            var contents;
                            var comments;
                            var results;
                            var reg=/ys.book.nextcomment\('\d*','(\d*)'\)/
                            var r='';
                            var r_bid=/www.yousuu.com\/book\/(\d*)/.exec(titles[num])
                            var bid=r_bid[1]
                            //递归计数器
                            var count=0
                            function process(){

                                function hasStr(string) {
                                    return contents.indexOf(string) > 0;
                                }

                                function searchExp(RegExp) {
                                    return contents.search(RegExp) > 0;
                                }

                                function setLabel(s1,s2) {
                                    rates[num].text(rates[num].text() + '，' + s1);
                                    if(s2!=null){

                                        var reg=new RegExp('('+s1+')',"ig");

                                        rates[num].html( rates[num].html().replace(reg,"<span style='color:"+s2+"'>$1</span>"));
                                    }
                                }
                                //将评论文本提取出来，防止其他信息干扰
                                //var comments; //这个变量不能放这，会导致并发问题
                                //var results;
                                var commentreg=/<p class=\\?"commentcontent\\?">(.*?)<\/p>/g;
                                while(results=commentreg.exec(contents)){
                                    comments+=results[1];
                                    comments+='\n\n';
                                }
                                //console.log('comments==================================\n'+comments);
                                //console.log('contents==================================\n'+contents);
                                //之后contents都为评论文本，没有html标签等内容
                                contents=comments;

                                if (searchExp(/[无没]有?女主/)) {
                                    setLabel('无女主');
                                }
                                if (searchExp(/[单一][个一独]?女主/) ) {
                                    setLabel('单女主');
                                }
                                if(searchExp(/[非无没不][^，。？]?后宫/)){
                                    setLabel('非后宫');
                                }else if (searchExp(/后宫.{0,3}[.,。，！]/)) {
                                    setLabel('后宫');
                                }
                                if (searchExp(/推土机/)) {
                                    setLabel('推土机');
                                }
                                if (searchExp(/种马/)) {
                                    setLabel('种马');
                                }
                                if (searchExp(/小黄文|h文|h描写/)) {
                                    setLabel('小黄文');
                                }
                                if (hasStr("送女")) {
                                    setLabel('送女');
                                }
                                if (hasStr("漏女|弃女")) {
                                    setLabel('漏女');
                                }
                                if (hasStr("死女") || searchExp(/女[^没.,，。？]{0,8}死/)) {
                                    setLabel('死女');
                                }
                                if (!searchExp(/[非不无没]是?太监/) &&searchExp(/进宮|太监/)) {
                                    setLabel('太监');
                                }
                                if (searchExp(/太虐|虐主|虐心|被虐/)) {
                                    setLabel('虐心');
                                }
                                if (!searchExp(/[^非无没不.,。，]{0,3}基情|搞基/)&&searchExp(/耽美/)) {
                                    setLabel('搞基');
                                }
                                if (searchExp(/女[^不非无没,.，。？]{0,9}(酱油|路人|花瓶|过客)|(酱油|路人|花瓶)女|女.{0,9}存在感/)) {
                                    setLabel('女主酱油');
                                }
                                if (searchExp(/女[不非无没]{0,9}(酱油|路人|花瓶|过客)/)||searchExp(/女[^不非没无,.，。？]{0,9}(写的[^怎]|写得|亮|描写|刻画|出彩|出色|细腻|细致|鲜明|特点|特色|各有)/)) {
                                    setLabel('女描优');
                                }
                                if (searchExp(/扮猪吃虎/)) {
                                    setLabel('扮猪吃虎');
                                }
                                if (searchExp(/无敌流/)) {
                                    setLabel('无敌流');
                                }
                                if (searchExp(/文青/)) {
                                    setLabel('文青');
                                }
                                if (searchExp(/种田/)) {
                                    setLabel('种田');
                                }
                                if (!searchExp(/[不没无非][^.,，。？]{0,4}(绿帽)/)&&searchExp(/被绿|被ntr/)) {
                                    setLabel("绿帽","green");
                                }
                            }
                            function r_merge(responseText,count){
                                contents+=responseText;
                                count++;
                                if(r = reg.exec(responseText)) {
                                    var nexttime=r[1];
                                    GM_xmlhttpRequest({
                                        url: 'http://www.yousuu.com/ajax/nextcomment?bid='+bid+'&nexttime='+nexttime,
                                        headers: {
                                            'Accept': 'text/html'
                                        },
                                        context: 'http://www.yousuu.com/ajax/nextcomment?bid='+bid+'&nexttime='+nexttime,
                                        method: 'GET',
                                        onreadystatechange: function(callback_response) {
                                            if (callback_response.readyState === 4) {
                                                //输出看一下递归计数器是否正常
                                                //console.log(count);
                                                
                                                if(count>5){
                                                    process();
                                                    return;
                                                }
                                                r_merge(callback_response.responseText,count);
                                            }
                                        }
                                    });
                                }else{
                                    process();
                                }
                            }
                            //如果评论有下一页，进行递归搜索5页
                            if(r = reg.exec(response.responseText)) {

                                r_merge(response.responseText,count);
                            //否则直接处理
                            }else{
                                process();
                            }
                            
                        }
                    }
                });
            })(i);
        }
    };

    resetPage();
})(jQuery);
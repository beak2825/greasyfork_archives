// ==UserScript==
// @name         微博反撤回方案2
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  笨办法反撤回
// @author       @一只蠢狗君
// @match        https://api.weibo.com/chat*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/434174/%E5%BE%AE%E5%8D%9A%E5%8F%8D%E6%92%A4%E5%9B%9E%E6%96%B9%E6%A1%882.user.js
// @updateURL https://update.greasyfork.org/scripts/434174/%E5%BE%AE%E5%8D%9A%E5%8F%8D%E6%92%A4%E5%9B%9E%E6%96%B9%E6%A1%882.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //GM_setValue('groupid','4654626886913134');  //四哥群
    GM_setValue('groupid','4524720329230254');  //tk群
    GM_setValue('count','10');   //这里配置的是原始聊天内容缓存池的大小，指定temp变量里最多缓存多少条群友消息
        var temp = [ ];
    GM_setValue('temp',temp);   //用temp全局变量来储存群友消息
    var recall_data =[ ];
    GM_setValue('recall_data',recall_data);  // 用recall_data来储存‘已撤回’状态消息
    var recall_count = 0;  //对已储存的‘已撤回’消息条数进行计数

//写一个你期待定时执行程序能重复执行的函数
function timeless(){
    GM_xmlhttpRequest(    //油猴脚本插件自带的异步请求函数，我们主要在onload参数上作文章——即访问的链接加载完毕时，我们希望它运行哪些代码
        {
        method:'get',
        url:'https://api.weibo.com/webim/groupchat/query_messages.json?convert_emoji=1&query_sender=1&count=' + GM_getValue('count') + '&id='+ GM_getValue('groupid') +'&max_mid=0&source=209678993',
        headers:{'Host': 'api.weibo.com','Referer': 'https://api.weibo.com/chat'},
        onload:function (response) {
            let rsp = JSON.parse(response.responseText);    //请求最新10条四哥群的群友消息，并获取到的返回内容json化
            let m = parseInt(GM_getValue('count'));
            for(let i=0;i < m;i++){                       //遍历这最新10条消息的信息
                let id = rsp["messages"][i]["id"];      // 分别用几个临时变量来储存获取时间id、内容、消息发送人昵称、消息状态
                let content = rsp["messages"][i]["content"];
                let name = rsp["messages"][i]["from_user"]["screen_name"];
                let type = rsp["messages"][i]["type"];
                if (type == 344) {                       //如果这条消息的状态是已撤回，那么执行以下操作，最后再跳过该条数据的储存（不把它记录在temp池里）
                    let recall_data01 = GM_getValue('temp').find(item => item.id == id);  //如果这条已撤回状态的时间id，在之前的temp池进行搜索并把它提取出来赋值给recall_data01
                    if (recall_data01 != undefined){    // 如果这个值确实在temp池里是存在的，就执行以下操作
                        let r = GM_getValue('recall_data');    //调取‘已撤回’池，看这个已撤回的时间id在已撤回池里有没有添加过，如果已经添加过了，就不再重复添加；没添加过才新添加
                        if (r.find(item => item.id == id) == undefined){
                            r.push(recall_data01);
                            GM_setValue('recall_data',r);
                        };
                        continue;
                    }
                };
                let is_id_exist = GM_getValue('temp').find(item => item.id == id);    // 如果是正常状态的消息，我们就在temp池里看它有没有被添加过，如果被添加过了，就跳过；没被添加过就新添加
                if (is_id_exist == undefined) {
                    let newmember ={
                        id: id,
                        name: name,
                        content: content,
                        type:type
                    }
                    let a = GM_getValue('temp');
                    let b = a.length;
                    a.push(newmember);
                    if (b >= parseInt(GM_getValue('count'))){   //如果temp池里已经储存的数据大于预定配置的条数，就在新添加一条数据后，再删掉一条最老的数据
                        a.shift();};
                    GM_setValue('temp',a);
                };
                };
            }
        });
    let n = GM_getValue('recall_data').length;    //获取‘已撤回’池里的数据条数，如果比上一次登记的数据条数大，我们就往控制台输出一下最新的‘已撤回’池内容。如果没有新增的，我们就不要去反复输出
    if (n > recall_count ){
        console.log(GM_getValue('recall_data'));
        recall_count = n;
    };
}
setInterval(timeless, 3000);   //让上面的这些代码，每隔3秒就运行一次
})();
// ==UserScript==
// @name         Surfingkeys configs
// @version      0.10
// @description  surfingkeys configs
// @author       tareo
// @match        none
// @grant        none
// @namespace https://greasyfork.org/users/218726
// @downloadURL https://update.greasyfork.org/scripts/447706/Surfingkeys%20configs.user.js
// @updateURL https://update.greasyfork.org/scripts/447706/Surfingkeys%20configs.meta.js
// ==/UserScript==


// an example to create a new mapping `ctrl-y`
api.mapkey('<ctrl-y>', 'Show me the money', function() {
    Front.showPopup('a well-known phrase uttered by characters in the 1996 film Jerry Maguire (Escape to close).');
});

// an example to replace `T` with `gt`, click `Default mappings` to see how `T` works.
api.map('gt', 'T');

// an example to remove mapkey `Ctrl-i`
api.unmap('<ctrl-i>');

// set theme
settings.theme = `
.sk_theme {
    font-family: Input Sans Condensed, Charcoal, sans-serif;
    font-size: 10pt;
    background: #24272e;
    color: #abb2bf;
}
.sk_theme tbody {
    color: grey;
}
.sk_theme input {
    color: #d0d0d0;
}
.sk_theme .url {
    color: #61afef;
}
.sk_theme .annotation {
    color: #56b6c2;
}
.sk_theme .omnibar_highlight {
    color: #528bff;
}
.sk_theme .omnibar_timestamp {
    color: #e5c07b;
}
.sk_theme .omnibar_visitcount {
    color: #98c379;
}
.sk_theme #sk_omnibarSearchResult ul li:nth-child(odd) {
    background: #303030;
}
.sk_theme #sk_omnibarSearchResult ul li.focused {
    background: #3e4452;
}
#sk_status, #sk_find {
    font-size: 20pt;
}`;
// click `Save` button to make above settings to take effect.</ctrl-i></ctrl-y>

// new
api.map('`','<Alt-i>');
var search=[
    // [alias, prompt, search_url, search_leader_key, suggestion_url, callback_to_parse_suggestion, only_this_site_key:String, options:object{favicon_url:String,skipMap:boolean }]
    
    // 电商
    ['tb','淘宝','https://s.taobao.com/search?q=','s','https://suggest.taobao.com/sug?code=utf-8&q=',function(rsp) {
        // console.log(rsp,JSON.parse(rsp.text));
        // var res = [];
        // try {
        //   res = JSON.parse(rsp.text).result.map((v)=>v[-1])
        // } catch (e) {}
        // // console.log(res);
        // res=res.map(v=>`<span style="color:red;">${v}</span>`);
        // return res;
        
        // document.querySelectorAll('#sk_omnibarSearchResult')[0].style.color='#ff7200'  
        settings.theme+=' #sk_omnibarSearchResult{color:#ff7200 !important; }';
        console.log(settings,api,this)
        return JSON.parse(rsp.text).
            result.map(
                // v=>`<span style="color:#ff7200;">${v[0]}</span>`
                v=>v[0]
            );
    }],
    ['tm','天猫','https://s.taobao.com/search?fromTmallRedirect=true&page=1&q=','s','https://suggest.taobao.com/sug?area=b2c&k=1&code=utf-8&q=',function(r){
            // console.log( JSON.parse(r.text).result);
            return JSON.parse(r.text).result.map(v=>v[0])
    }],//options内图标不起作用，天猫还是淘宝的图标
    ['tm/b','天猫/宝贝','https://s.taobao.com/search?q=','s','https://suggest.taobao.com/sug?area=c2ck=1&code=utf-8&q=',function(r){
        return JSON.parse(r.text).result.map(v=>v[0])
    }],
    ['tm/d','天猫/店铺','https://shopsearch.taobao.com/browse/shop_search.htm?q=','s','https://suggest.taobao.com/sug?area=ssrch&&k=1&code=utf-8&q=',function(r){
       return JSON.parse(r.text).result.map(v=>v[0])
    }],//链接和方法可以合一块写
    ['jd','京东','https://search.jd.com/Search?enc=utf-8&keyword=','s','https://dd-search.jd.com/?terminal=pc&newjson=1&ver=2&zip=1&&curr_url=www.jd.com&&key=',function(r){
        // console.log(JSON.parse(r.text))
        return JSON.parse(r.text).map(v=>v.key).slice(0,13)
    }],
    ['al','阿里巴巴','https://s.1688.com/selloffer/offer_search.htm?keywords='],//字符有集问题，使用的是GBK编码
    ['xy','闲鱼','https://www.goofish.com/search?q='],//有suggestion_url但要使用post方法， https://h5api.m.goofish.com/h5/mtop.taobao.idlemtopsearch.pc.search.suggest/1.0/...
    ['tb2','淘宝二手','https://2.taobao.com/search?word='],
    ['amz','Amazon','https://www.amazon.com/s?k=','s','https://completion.amazon.com/api/2017/suggestions?limit=11&suggestion-type=WIDGET&suggestion-type=KEYWORD&page-type=Search&alias=aps&site-variant=desktop&version=3&event=onfocuswithsearchterm&wc=&lop=en_US&last-prefix=%00&avg-ks-time=0&fb=1&mid=ATVPDKIKX0DER&prefix=',function(rsp){
        //console.log(JSON.parse(rsp.text))
        return JSON.parse(rsp.text).suggestions.map(v=>v.value)
    }],//有文本高亮
    ['eb','ebay','https://www.ebay.com/sch/i.html?&_nkw=','s','https://autosug.ebaystatic.com/autosug?kwd=',function(rsp){
        // console.log(JSON.parse(rsp.text.match(/(?<=\_do\().*(?=\))/g)[0]))
        return JSON.parse(rsp.text.match(/(?<=\_do\().*(?=\))/g)[0]).res.sug
    }],//suggestionUrl网页端带其它参数的无返回值
    
    //社区
    ['wb','微博','https://s.weibo.com/weibo?q=','s','https://s.weibo.com/ajax/topsuggest.php?outjson=1&key=',function(r){
        // console.log(r.text);
        var rJSON=JSON.parse(r.text)
        var querysKeyArr=rJSON.querys.map(v=>v.key)
        var userURLArr=rJSON.user.map(function(v){
            return {
                title: v.u_name,
                // icon: v.u_pic,
                url: "https://weibo.com/u/"+v.u_id+"?is_all=1"
            }
        })
        return querysKeyArr.concat(userURLArr);//无热榜 querys数组变空对象时不清空
    }],
    ['wb/g','微博关注人','https://s.weibo.com/weibo?atten=1&suball=1&Refer=SWeibo_box&q='],
    ['wb/s','微博收藏','https://weibo.com/fav?search_key='],//链接失效
    
    ['db','豆瓣','https://www.douban.com/search?q=','s','https://www.douban.com/j/search_suggest?q=',function(rsp){
        // console.log(JSON.parse(rsp.text))
        var rspJSON=JSON.parse(rsp.text)
        return rspJSON.cards.map(v=>{
            return {
                // cover:v.cover_url,
                title:`${v.title}（${v.type} ${v.year?(': '+v.year):''}） \n ${v.card_subtitle} \n ${v.abstract||''}`,
                url:v.url
            }
        }).concat(rspJSON.words);
    }],
    ['db/d','豆瓣/电影','https://www.douban.com/search?cat=1002&q='],
    ['dbd','豆瓣电影','https://search.douban.com/movie/subject_search?search_text=','s','https://movie.douban.com/j/subject_suggest?q=',function(rsp){
        var rspJSON=JSON.parse(rsp.text)
        console.log(rspJSON)
        return rspJSON.map(v=>{
            return {
                title:`\t\|\t${v.year}年\t\|\t${v.episode||"**"}集\t\|\t${v.type}\t\|\t《${v.title}》\n\t「${v.sub_title}」`,
                url:v.url
            }
        });//怎么转向其返回链接
    }],
    ['tw','Twitter',''],
    
    ['bl','B站','https://search.bilibili.com/all?keyword=','s','https://s.search.bilibili.com/main/suggest?main_ver=v1&highlight=&term=',function(r){
        var rsAPI='https://api.bilibili.com/x/web-interface/search/square?limit=10'
        var rsJSON=[];
        fetch(rsAPI).then(r=>r.text()).then(t=>rsJSON=JSON.parse(t))
        var tag=JSON.parse(r.text).result?.tag
        console.log('tab: '+tag);
        if((tag||[]).length==0){
            return rsJSON.data.trending.list.map(v=>v.keyword)  
        }else{
            return tag.map(v=>v.term);//无高亮 无热榜   
        }
    }],
    ['zh','知乎','https://www.zhihu.com/search?q=','s','https://www.zhihu.com/api/v4/search/suggest?q=',function(r){
        return JSON.parse(r.text).suggest.map(v=>v.query);//没有热榜和搜索历史
    }],
    ['wx','微信公众号','https://weixin.sogou.com/weixin?type=2&query=','s','https://weixin.sogou.com/sugg/ajaj_json.jsp?key=',function(r){
        return JSON.parse(r.text.slice(17,-5))[1];//没有搜索记录 无高亮
    }],
    
    //搜索引擎
    ['tt','今日头条','https://so.toutiao.com/search?dvpf=pc&keyword=','s','https://www.toutiao.com/2/article/search_sug/?keyword=',function(rsp){
        return JSON.parse(rsp.text).data.map(v=>v.keyword)
    }],
    ['mg','Metager','https://metager.org/meta/meta.ger3?eingabe='],
    ['yd','Yandex.eu','https://yandex.eu/search/?text=','s','https://yandex.eu/suggest/suggest-ya.cgi?srv=serp_eu_desktop&wiz=TrWth&yu=6130858651721244350&lr=111564&uil=en&fact=1&v=4&show_experiment=222&show_experiment=224&use_verified=1&safeclick=1&skip_clickdaemon_host=1&rich_nav=1&verified_nav=1&rich_phone=1&use_favicon=1&nav_favicon=1&mt_wizard=1&history=1&nav_text=1&maybe_ads=1&icon=1&hl=1&n=10&portal=1&platform=desktop&mob=0&extend_fw=1&suggest_entity_desktop=1&entity_enrichment=1&entity_max_count=5&svg=1&pos=0&prev-query=123&hs=0&suggest_reqid=613085865172124435025943700102567&part=',function(r){
        return JSON.parse(r.text)[1].map(v=>v[1])
    }],
    ['qw','Qwant','https://www.qwant.com/?q=','s','https://api.qwant.com/v3/suggest?locale=en_US&version=2&q=',function(r){
        return JSON.parse(r.text).data.items.map(v=>v.value);//无高亮
    }],
    ['bd', '百度', 'https://www.baidu.com/s?wd=', 's', 'https://suggestion.baidu.com/su?cb=&wd=', function(rsp) {
        // var res = rsp.text.match(/,s:\[("[^\]]+")]}/);
        // return res ? res[1].replace(/"/g, '').split(",") : [];
        // console.log(rsp.text);
        return JSON.parse(rsp.text.match(/\[("[^\]]+")]/)[0]);
    }],
    ['kf','百度开发者','https://kaifa.baidu.com/searchPage?wd=','s','https://kaifa.baidu.com/rest/v1/recommend/suggests?wd=',function(r){
        return JSON.parse(r.text).data;
    }],
    
    //其他
    ['wa','WolframAlpha','https://www.wolframalpha.com/input?i=','s','https://www.wolframalpha.com/n/v1/api/autocomplete/?i=',function(rsp){
        var rspJSON=JSON.parse(rsp.text)
        // console.log(rspJSON)
        var arr=rspJSON.results.map(
                v=>v.input
            );
        var im=rspJSON.instantMath||[];
        return [`
            <table style="width: 80%;margin:0 10%;position:relative;top:-13px">
                <tr>
        		    <td>近似值：</td>
	            	<td>精确值：</td>
            		<td>解析为：</td>
            	</tr>
	            <tr>
    	        	<td style='color:orange'><i>${im.approximateResult || " · · · "}</i></td>
	        	    <td style='color:olive'><b>${im.exactResult || ' · · · '}</b></td>
    		        <td style='color:grey'>${im.parsedInput || ' · · · '}</td>
            	</tr>
            </table>
        `].concat(arr);
    }],
    ['mdn','MDN','https://developer.mozilla.org/zh-CN/search?q=','s','https://developer.mozilla.org/zh-CN/search-index.json?',function(r,q){
        // console.log(r,q);
        var rJSON=JSON.parse(r.text);
        var kw=q.query;
        var matchRst=rJSON.filter(v=>v.title.match(new RegExp(kw,'i'))).slice(0,100);
        // console.log(matchRst)
        return matchRst.map(v=>{
            return {
                title:v.title,//title 如何高亮
                url:v.url='https://developer.mozilla.org'+v.url
            }
        });
    }]//能否缓存第一次取回的JSON，不必每次获取 //排序与官网不一样
    // ,['aiuys','Aiuys Privacy','http://library.aiuys.com/?','s','http://library.aiuys.com/api/query?value=',function(rsp){//无推荐词返回，链接可能不成功
    //     console.log(rsp)
    //     var v=rsp.data;
    //     console.log(v);
    //     return [
    //         {
    //             title:`电话：${v.phone_numbers}`,
    //             url:''
    //         },  
    //         {
    //             title:`QQ：${v.v.qq_numbers}`,
    //             url:''
    //         },
    //         {
    //             title:`微博：${v.wb_numbers}`,
    //             url:'https://m.weibo.cn/u/${v.wb_numbers}'
    //         }
    // //     ]
        
    // }]
];
for(i=0;i<search.length;i++){
    // api.addSearchAlias(search[i][0],search[i][1],search[i][2],search[i][3],search[i][4],search[i][5]);
    api.addSearchAlias(...search[i]);
}

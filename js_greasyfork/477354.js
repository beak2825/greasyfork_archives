// ==UserScript==
// @name         养铁池
// @version      1.5
// @description  养铁账号池
// @author       hx
// ==/UserScript==

//媒体号
let ytc_mth={
    //近期重点培养
    important:[
        {title:"王者荣耀共创之夜",url:"https://weibo.com/7712820124/MeIrkmYcV#comment"},
        {title:"王者荣耀",url:"https://weibo.com/5698023579/MoGEBkKMl#comment"},

        {title:"湖南卫视",url:"https://weibo.com/1638629382/NjBwoCWCq#comment"},
        {title:"芒果TV",url:"https://weibo.com/1663088660/NjBz44qLd#comment"},
        {title:"天猫",url:"https://weibo.com/1768198384/KkurDvlvR#comment"},
        {title:"天猫发言人",url:"https://weibo.com/6793289964/L0SviviGd#comment"},

        {title:"中国电影报道",url:"https://weibo.com/1261788454/NbQ0Il95r#comment"},
        {title:"电影频道融媒体中心",url:"https://weibo.com/6495544869/Nfl3BtEBl#comment"},
        {title:"1905电影网官博",url:"https://weibo.com/1635270132/NbPvpi8Mk#comment"},
        {title:"金鸡百花电影节",url:"https://weibo.com/2715305503/NkTmPzNhJ#comment"}
    ],
    //不急用，慢慢培养
    common:[

        {title:"奔跑吧",url:"https://weibo.com/5242381821/NbLZf75aR#comment"},

        {title:"微博综艺",url:"https://weibo.com/2110705772/NnF7QeNe0#comment"},
        {title:"微博音乐盛典",url:"https://weibo.com/2183483187/Nlnkun3r4#comment"},
        {title:"新浪综艺",url:"https://weibo.com/1878335471/NnFUlpS0I#comment"},
        {title:"腾讯视频",url:"https://weibo.com/2591595652/No192oDS0#comment"},
        
        {title:"北京卫视",url:"https://weibo.com/1779837945/No53MpNHx#comment"},
        {title:"北京卫视跨年之夜",url:"https://weibo.com/7727022228/Mman5utfQ#comment"},
        {title:"河南卫视",url:"https://weibo.com/1834783273/NlpTZ66vA#comment"},
        {title:"江苏卫视跨年演唱会",url:"https://weibo.com/1818087960/Mmc6xEeea#comment"},
        {title:"东方卫视番茄台",url:"https://weibo.com/1767910704/NgIzYuWOQ#comment"},
        {title:"哔哩哔哩弹幕网",url:"https://weibo.com/1748075785/N786H8Dm9#comment"},

        {title:"围脖侠",url:"https://weibo.com/7006227546/Nnw6o5SDj#comment"},
        {title:"娱乐生态观察站",url:"https://weibo.com/7720921888/Nn3FqsE9l#comment"}

    ],
    //不掉粉就行
    ignore:[
        {title:"新华社",url:"https://weibo.com/1699432410/NoL9H3oL2#comment"},
        {title:"人民日报",url:"https://weibo.com/2803301701/NoLnnanIg#comment"},
        {title:"新华网",url:"https://weibo.com/2810373291/NoLGR9Nhl#comment"},
        {title:"中国战略支持",url:"https://weibo.com/7774089243/NoLYTAWsb#comment"},

        {title:"央视频",url:"https://weibo.com/7211561239/Nn60e4Zle#comment"},
        {title:"央视新闻",url:"https://weibo.com/2656274875/Nn5R8BQW4#comment"},
        {title:"央视文艺",url:"https://weibo.com/2210168325/NnNLnEaUs#comment"},
        {title:"央视网文娱",url:"https://weibo.com/7735105675/NmMYEqDKw#comment"},
        {title:"央视一套",url:"https://weibo.com/2024623547/Nn5TmAs4H#comment"},
        {title:"春晚",url:"https://weibo.com/3506728370/NlSqeqbGX#comment"},
        {title:"CCTV4",url:"https://weibo.com/2039753857/Nn5VAA8bD#comment"}
    ] 
};
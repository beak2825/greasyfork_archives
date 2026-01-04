// ==UserScript==
// @name         B站大杂烩成分指示器（改改改改改）
// @version      1.2
// @author       trychen,miayoshi,hikariguomang.kukemc
// @namespace    https://greasyfork.org/zh-CN/scripts/481663-b%E7%AB%99%E5%A4%A7%E6%9D%82%E7%83%A9%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8-%E6%94%B9%E6%94%B9%E6%94%B9%E6%94%B9%E6%94%B9
// @license      GPLv3
// @description  自动标注成分，改改改改改版 主流的基本上都加了还在持续更新，更适合日常宝宝使用
// @match        https://space.bilibili.com/*
// @match        https://www.bilibili.com/read/*
// @match        https://www.bilibili.com/video/*
// @match        https://t.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @connect      bilibili.com
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/481663/B%E7%AB%99%E5%A4%A7%E6%9D%82%E7%83%A9%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E6%94%B9%E6%94%B9%E6%94%B9%E6%94%B9%E6%94%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/481663/B%E7%AB%99%E5%A4%A7%E6%9D%82%E7%83%A9%E6%88%90%E5%88%86%E6%8C%87%E7%A4%BA%E5%99%A8%EF%BC%88%E6%94%B9%E6%94%B9%E6%94%B9%E6%94%B9%E6%94%B9%EF%BC%89.meta.js
// ==/UserScript==

const blog = 'https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid='
const followapi = 'https://api.bilibili.com/x/relation/followings?vmid='
const info = 'https://api.bilibili.com/x/space/acc/info?mid='

$(function () {
    'use strict';
    const checkers = [
        {
            displayName: "嘉批",
            displayIcon: "https://i2.hdslb.com/bfs/face/619f378852ebac9fdf87e20418d6f99bfa750c7f.jpg@240w_240h_1c_1s.jpg",
            keywords: ["晚晚","嘉晚饭","嘉心糖的手账本","嘉心糖"],
            followings: [703007996,672342685,672328094,672353429,672346917,351609538]
        }
        ,
        {
            displayName: "塔畜",
            displayIcon: "https://i1.hdslb.com/bfs/face/4907464999fbf2f2a6f9cc8b7352fceb6b3bfec3.jpg@240w_240h_1c_1s.jpg",
            keywords: ["谢谢喵","taffy","雏草姬","塔菲"],
            followings: [1265680561]
        }
        ,
        {
            displayName: "罕见",
            displayIcon: "https://i0.hdslb.com/bfs/face/ced15dc126348dc42bd5c8eefdd1de5e48bdd8e6.jpg@240w_240h_1c_1s.jpg",
            keywords: ["東雪蓮Official","东雪莲","莲宝"],
            followings: [1437582453]
        }
        ,
        {
            displayName: "OP",
            displayIcon: "https://i2.hdslb.com/bfs/face/d2a95376140fb1e5efbcbed70ef62891a3e5284f.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #原神", "米哈游", "#米哈游#", "#miHoYo#","原神"],
            followings: [401742377]
        }
        ,
        {
            displayName: "农药",
            displayIcon: "https://i2.hdslb.com/bfs/face/effbafff589a27f02148d15bca7e97031a31d772.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #王者荣耀","王者荣耀"]
        }
        ,
        {
            displayName: "粥批",
            displayIcon: "https://i0.hdslb.com/bfs/face/89154378c06a5ed332c40c2ca56f50cd641c0c90.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #明日方舟","危机合约","明日方舟"],
            followings: [161775300]
        }
        ,
        {
            displayName: "鸽游",
            displayIcon: "https://i0.hdslb.com/bfs/face/b3dd022d03c32a91be673d195a9f60c46217c406.jpg@240w_240h_1c_1s.jpg",
            keywords: ["pigurous","phigros","Phigros","phigos","pigros","piguros","pigrous","figros","#Pigeon Games#","#Phigros#","#鸽游#","屁股肉"],
            followings: [414149787]
        }
         ,
        {
            displayName: "homo",
            displayIcon: "https://i0.hdslb.com/bfs/face/875eb66bb952f16afa9634081a820dea8e3fac96.jpg@240w_240h_1c_1s.jpg",
            keywords: ["哲哲布隆","是雪罢","甚至九分","警撅","会员制","一个一个"]
        }
        ,
        {
            displayName: "安慕希",
            displayIcon: "https://i0.hdslb.com/bfs/face/c5578966c447a70edf831bbf7e522b7be6090fea.jpg@240w_240h_1c_1s.jpg",
            keywords: ["反迷你","炸图","vape","🥺"]
        }
        ,
        {
            displayName: "ikun",
            displayIcon: "https://i1.hdslb.com/bfs/face/a79e433ca842aa7a4a4ca41aaf64f64023235b08.jpg@240w_240h_1c_1s.jpg",
            keywords: ["鸡你太美","你干嘛","只因","琛总","一坤"]
        }
        ,
        {
            displayName: "扮扮糖",
            displayIcon: "https://i0.hdslb.com/bfs/face/baa15280b6157891427323fab5fbe3e3b42010cf.jpg@240w_240h_1c_1s.jpg",
            keywords: ["个性装扮","生日号","装扮"]
        }
        ,
        {
            displayName: "桀哥",
            displayIcon: "https://i0.hdslb.com/bfs/face/f4d39ce4c3a5a306de2e5bb51fcae9a6c4f95215.jpg@600w_600h_1c_1s.webp",
            keywords: ["超级小桀的日常","Evelinas","神奇的维C","桀哥","小桀"],
            followings: [29440965,17832078,14392124]
        }
        ,
        {
            displayName: "影视飓风",
            displayIcon: "https://i0.hdslb.com/bfs/face/c1733474892caa45952b2c09a89323157df7129a.jpg@600w_600h_1c_1s.webp",
            keywords: ["影视飓风"],
            followings: [946974]
        }
        ,
        {
            displayName: "穹批",
            displayIcon: "https://i1.hdslb.com/bfs/face/e76fc676b58f23c6bd9161723f12da00c7e051c5.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #崩坏星穹铁道","星穹铁道","星铁","崩铁","崩坏星穹铁道"],
            followings: [1340190821]
        }
        ,
        {
            displayName: "碧蓝",
            displayIcon: "https://i1.hdslb.com/bfs/face/f2635e09fe667d4ad29229c6ed0b5f4bdea09bd1.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #碧蓝","碧蓝","蔚蓝"],
            followings: [3493265644980448]
        }
        ,
        {
            displayName: "光遇",
            displayIcon: "https://i1.hdslb.com/bfs/face/6a32a6914c6d4c95cd2bbe5bf1ac3c11aa5c763e.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #光遇","光遇"],
            followings: [211700578]
        }
        ,
        {
            displayName: "公主连结",
            displayIcon: "https://i0.hdslb.com/bfs/face/48f58eaed2f5d51d37bb5499ebdabefece63a587.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #公主连结","公主连结","公主连接"],
            followings: [353840826]
        }
        ,
        {
            displayName: "MC",
            displayIcon: "https://i0.hdslb.com/bfs/face/c5578966c447a70edf831bbf7e522b7be6090fea.jpg@240w_240h_1c_1s.jpg",
            keywords: ["mc","我的世界","minecraft"],
            followings: [43310262,686127,2170934,17425003,392055878]
        }
        ,
        {
            displayName: "东方",
            displayIcon: "https://i2.hdslb.com/bfs/face/9f7ca9dec25a6aa63009a115ebe28bd9419c08ce.jpg",
            keywords: ["东方", "Touhou", "弹幕游戏","博丽灵梦", "雾雨魔理沙", "八云紫", "铃仙·优昙华院·因幡", "西行寺幽幽子", "魂魄妖梦", "天地劫火", "式神", "红魔馆", "幽谷", "魔界", "月之都", "幻想乡", "badapple", "bad apple"],
            followings: [190470681120919518,400881019]
        }
        ,
        {
            displayName: "元气",
            displayIcon: "https://i2.hdslb.com/bfs/face/798056bd26da76e86c0a94af94f477ab982f1d0a.jpg@240w_240h_1c_1s.jpg",
            keywords: ["元气骑士","凉屋"],
            followings: [87721937]
        }
        ,
        {
            displayName: "糖豆人",
            displayIcon: "https://i2.hdslb.com/bfs/face/9f024853539c584bc6118a62542c80e7cf3719d9.jpg@240w_240h_1c_1s.jpg",
            keywords: ["糖豆人"],
            followings: [587887250]
        }
         ,
        {
            displayName: "宝可梦",
            displayIcon: "https://i1.hdslb.com/bfs/face/a4e552fab0cc7b7203da51b5fcb5612f3e74992c.jpg@600w_600h_1c_1s.webp",
            keywords: ["宝可梦","PTCG","神奇宝贝","精灵宝可梦","口袋妖怪","皮卡超"],
            followings: [1038290200,343348,1710204,434615,510877452,20488878,43715445,103481948,1070850723]
        }
         ,
        {
            displayName: "PTCG",
            displayIcon: "https://i1.hdslb.com/bfs/face/92d8a15c1cb2f93c4f6153a081d78676f001583c.jpg@600w_600h_1c_1s.webp",
            keywords: ["PTCG"],
            followings: [3461571573450904]
        }
        ,
        {
            displayName: "塞尔达",
            displayIcon: "https://i0.hdslb.com/bfs/face/2d53b351535a71113f91eae3038938f9975f3cdb.jpg@240w_240h_1c_1s.jpg",
            keywords: ["塞尔达","王国之泪","旷野之息","林克"],
            followings: []
        }
        ,
        {
            displayName: "母牛",
            displayIcon: "https://i0.hdslb.com/bfs/face/b6f77545ec57d5c4215441b0b76cfacef941d01a.jpg@240w_240h_1c_1s.jpg",
            keywords: ["迷你世界"],
            followings: [1897251467,606753153,470935187]
        }
        ,
        {
            displayName: "抽奖",
            displayIcon: "https://i1.hdslb.com/bfs/face/7c3d1e4f38c12985c00b086d171be9b1acd4aca2.jpg@240w_240h_1c_1s.jpg",
            keywords: ["抽奖","转发动态"],
            followings: []
        }
        ,
        {
            displayName: "转正答题",
            displayIcon: "https://i2.hdslb.com/bfs/face/e53c0fe9315176d48bd294b1f381f0da70131cd7.jpg@240w_240h_1c_1s.jpg",
            keywords: ["转正答题"],
            followings: []
        }
        ,
        {
            displayName: "航模",
            displayIcon: "https://i1.hdslb.com/bfs/face/f075432a56cd640606a2c5c6d95b8bc43f2d6ad5.jpg@240w_240h_1c_1s.jpg",
            keywords: ["航模","飞机","炸机"],
            followings: []
        }
        ,
        {
            displayName: "依然小智",
            displayIcon: "https://i0.hdslb.com/bfs/face/280be120419fcdfb77c167429bb087353faa16b8.jpg@600w_600h_1c_1s.webp",
            keywords: ["依然小智","依然小智障"],
            followings: [137952,2970476]
        }
        ,
        {
            displayName: "早稻叽",
            displayIcon: "https://i1.hdslb.com/bfs/face/b7d3a230a5c8bba70606e4d133f71f99aae1ab23.jpg@600w_600h_1c_1s.webp",
            keywords: ["早稻叽","叽叽"],
            followings: [1950658]
        }
        ,
        {
            displayName: "异化",
            displayIcon: "https://i1.hdslb.com/bfs/face/f586d7a72b4e1d891bd46abdb2614ead33b71435.jpg@600w_600h_1c_1s.webp",
            keywords: ["灵笼","艺画"],
            followings: [3494361474009190,14328316]
        }
        ,
        {
            displayName: "未来科技员工",
            displayIcon: "https://i1.hdslb.com/bfs/face/550121f5c2c5d02b35ee525064dcd4c2612b26ea.jpg@600w_600h_1c_1s.webp",
            keywords: ["怕上火暴王老菊","老菊","王老菊"],
            followings: [423895]
        }
        ,
        {
            displayName: "极客湾",
            displayIcon: "https://i1.hdslb.com/bfs/face/d0f7a7ee34a4a45c8390eb3a07e4d7f2d70bae91.jpg@600w_600h_1c_1s.webp",
            keywords: ["极客湾"],
            followings: [25876945]
        }
        ,
        {
            displayName: "qiqi",
            displayIcon: "https://i0.hdslb.com/bfs/face/c5830e1e0142e04c96be9c87d3aef2e1b5d47581.jpg@600w_600h_1c_1s.webp",
            keywords: ["qiqi","琪琪"],
            followings: [19525533]
        }
        ,
        {
            displayName: "牛逼",
            displayIcon: "https://i2.hdslb.com/bfs/face/b63811a969b030d44baf8f3ebcd80ab5a4b48ccd.jpg@600w_600h_1c_1s.webp",
            keywords: ["酷可"],
            followings: [94782782]
        }
        ,
        {
            displayName: "牛子",
            displayIcon: "https://i0.hdslb.com/bfs/face/4433f33fb898d721575855dc4335092e3cad7eaa.jpg@600w_600h_1c_1s.webp",
            keywords: ["阿牛"],
            followings: [3461565017754459]
        }
        ,
        {
            displayName: "白菜",
            displayIcon: "https://i0.hdslb.com/bfs/face/a7cd521b9862674d8d0a640d82443faf9251a7b3.jpg@600w_600h_1c_1s.webp",
            keywords: ["眞白花音","白菜"],
            followings: [401480763]
        }
        ,
        {
            displayName: "包子",
            displayIcon: "https://i0.hdslb.com/bfs/face/00ad00878db3ea72a35cb2ee92d59e2146812c5a.jpg@600w_600h_1c_1s.webp",
            keywords: ["逍遥小枫"],
            followings: [2058048]
        }
        ,
       {
            displayName: "饭-wyb",
            displayIcon: "https://i0.hdslb.com/bfs/face/3621591c438b83798cf32287837a10f16c1eb5a6.jpg@600w_600h_1c_1s.webp",
            keywords: ["YIBO-OFFICIAL"],
            followings: [688694784]
        }
        ,
        {
            displayName: "饭-exo",
            displayIcon: "https://i0.hdslb.com/bfs/face/b77988a74a83ade540857045781ad9485685554d.jpg@600w_600h_1c_1s.webp",
            keywords: ["EXO"],
            followings: [3493262484572295]
        }
        ,
        {
            displayName: "饭-zyx",
            displayIcon: "https://i1.hdslb.com/bfs/face/6fda05166cc55cdeed94475e2a944427f64ec7f4.jpg@600w_600h_1c_1s.webp",
            keywords: ["张艺兴"],
            followings: [161158015]
        }
        ,
        {
            displayName: "福瑞",
            displayIcon: "https://i2.hdslb.com/bfs/face/9c9402b1622506974363ab311c037098898c8c05.jpg@600w_600h_1c_1s.webp",
            keywords: ["福瑞","furry","是水蜜桃狐狸桃桃呀","鹿森","小鹿","沐茶lio","茭白柒","奈奈子","恶魔小狼橙星","古茗茶里泡咕若"],
            followings: [688507502,72996695,5085448,35565205,1241102614,,1168807512,490779448,1710109911,10788657,32338967,273451160,11320219,57202851,604225829,20129000,7868851,1481933691,237600851,427171855,519648707,280115132,1898108930,668634070,325020122,16081824,15439462,359457424,580892760,26379517,1941171138,1422644848,2142558030,471723540,457061412,301795913,1608188787,470502363,22765153,]
        }
        ,
        {
            displayName: "小米",
            displayIcon: "https://i0.hdslb.com/bfs/face/398e4b6654bbb64d87f645b9b45591e4f959f6ce.jpg@600w_600h_1c_1s.webp",
            keywords: ["小米"],
            followings: [1476167907,23920239,588049766]
        }
        ,
        {
            displayName: "华为",
            displayIcon: "https://i2.hdslb.com/bfs/face/d09290cd18c3e048ca0b2eefa3647a487ed11b77.jpg@600w_600h_1c_1s.webp",
            keywords: ["华为"],
            followings: [102999485,439499363,578227337,510459330]
        }
        ,
        {
            displayName: "unity",
            displayIcon: "https://i1.hdslb.com/bfs/face/ad74b38f70e1cf540dd7cf1a0fb75086e2e57db0.jpg@600w_600h_1c_1s.webp",
            keywords: ["unity"],
            followings: [386224375]
        }
        ,
        {
            displayName: "UE",
            displayIcon: "https://i1.hdslb.com/bfs/face/ee61cbee8fcd9042f4506bd475a18221fc3b97a6.jpg@600w_600h_1c_1s.webp",
            keywords: ["虚幻","ue4","ue5"],
            followings: [138827797]
        }
        ,
        {
            displayName: "何武器",
            displayIcon: "https://i0.hdslb.com/bfs/face/b267e6e42399d8b4bedd57534cd9e9fe1d4bcdba.jpg@600w_600h_1c_1s.webp",
            keywords: ["何同学"],
            followings: [163637592.1192648858]
        }
        ,
        {
            displayName: "踢死",
            displayIcon: "https://i2.hdslb.com/bfs/face/46cf569633b42ca1dd5475d2f0e2c8bbacc0e53d.jpg@600w_600h_1c_1s.webp",
            keywords: ["TIS"],
            followings: [392055878]
        }
        ,
        {
            displayName: "绝区零",
            displayIcon: "https://i0.hdslb.com/bfs/face/049b47e0e73fc5cc1564343bb0aeacce8ae8e6f8.jpg@240w_240h_1c_1s.jpg",
            keywords: ["互动抽奖 #绝区零","绝区零"],
            followings: [1636034895]
        }
        ,
        {
            displayName: "命运-冠位指定",
            displayIcon: "https://i0.hdslb.com/bfs/face/764412727f7dda317f2fd7a6cbc5ab5abe71e8cc.jpg@600w_600h_1c_1s.webp",
            keywords: ["命运-冠位指定"],
            followings: [233108841]
        }
        ,
        {
            displayName: "战舰世界",
            displayIcon: "https://i1.hdslb.com/bfs/face/063ffbf06d3115d94f6a5241500ee63c4cae9915.jpg@600w_600h_1c_1s.webp",
            keywords: ["战舰世界"],
            followings: [573693898]
        }
        ,
        {
            displayName: "风纪✨",
            displayIcon: "https://i2.hdslb.com/bfs/face/5c4677f2f5c6aa4aa3ee22c5744ddc5a11dde31c.jpg@600w_600h_1c_1s.webp",
            keywords: ["风纪委","风纪委员","#风纪委员会#","B站新风纪委建议反馈收集 #风纪委","B站新风纪委建议反馈收集 #","风纪委员会调研","风纪委员会众议观点的赞和踩改为同意与不同","风纪委员会众议观点的赞和踩改为同意与不同 #","#B站新风纪委建议反馈收集","风纪委员","焱缪-猫猫兔"],
        }
        ,
        {
            displayName: "C++",
            displayIcon: "https://i2.hdslb.com/bfs/face/a454e2fa180b619e7506646e49d13e4045924662.jpg@240w_240h_1c_1s_!web-avatar-search-user.webp",
            keywords: ["c++","cpp","C++"],
        }
        ,
        {
            displayName: "Python",
            displayIcon: "https://i0.hdslb.com/bfs/face/4c174b8700dc2c9170ec3e22e0819f78f16868c6.jpg@240w_240h_1c_1s_!web-avatar-search-user.webp",
            keywords: ["python","pycharm","Python"],
            followings: [612593877]
        }
        ,
        {
            displayName: "Java",
            displayIcon: "https://i2.hdslb.com/bfs/face/42bdd5ed7737e26295cccb16e5721ea4c470ab26.jpg@240w_240h_1c_1s_!web-avatar-search-user.webp",
            keywords: ["java","Java"],
            followings: [480840386]
        }
        ,
        {
            displayName: "JavaScript",
            displayIcon: "https://i2.hdslb.com/bfs/face/8d6d4b52f68e7263b33ce431cd9dbc67d871129a.jpg@240w_240h_1c_1s_!web-avatar-search-user.webp",
            keywords: ["javascript","JavaScript"],
        }
        ,
        {
            displayName: "IT",
            displayIcon: "https://i1.hdslb.com/bfs/face/4505a4001328421c4ba18ad5ff70fbf2c8532510.jpg@240w_240h_1c_1s_!web-avatar-search-user.webp",
            keywords: ["python","pycharm","cpp","c++","C++","c语言","前端","后端","编程","github"],
            followings: [612593877,37974444]
        }
    ]
    const checked = {}
    const checking = {}
    var printed = false

    // 监听用户ID元素出现
    listenKey(".user-name", addButton);
    listenKey(".sub-user-name", addButton);
    listenKey(".user .name", addButton);


    // 添加查成分按钮
    function addButton(element) {
        let node = $(`<div style="display: inline;" class="composition-checkable"><div class="iBadge">
  <a class="iName">查成分</a>
</div></div>`)

        node.on('click', function () {
            node.find(".iName").text("检查中...")
            checktag(element, node.find(".iName"))
        })

        element.after(node)
    }

    // 添加标签
    function addtag(id, element, setting) {
        let node = $(`<div style="display: inline;"><div class="iBadge">
  <a class="iName">${setting.displayName}</a>
  <img src="${setting.displayIcon}" class="iIcon">
</div></div>`)

        element.after(node)
    }
''
    // 检查标签
    function checktag(element, loadingElement) {
        // 用户ID
        let UID = element.attr("data-user-id") || element.attr("data-usercard-mid")
        // 用户名
        let name = element.text().charAt(0) == "@" ? element.text().substring(1) : element.text()

        if (checked[UID]) {
            // 已经缓存过了
            for(let setting of checked[UID]) {
                addtag(UID, element, setting)
            }
        } else if (checking[UID] != undefined) {
            // 检查中
            if (checking[UID].indexOf(element) < 0)
                checking[UID].push(element)
        } else {
            checking[UID] = [element]

            // 获取最近动态
            // 获取最近动态
            GM_xmlhttpRequest({
                method: "get",
                url: blog + UID,
                data: '',
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                },
                onload: res => {
                    if (res.status === 200) {
                        // 获取关注列表
                        GM_xmlhttpRequest({
                            method: "get",
                            url: followapi + UID,
                            data: '',
                            headers: {
                                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                            },
                            onload: followingRes => {
                                if (followingRes.status === 200) {
                                    // 获取用户信息
                                    GM_xmlhttpRequest({
                                        method: "get",
                                        url: info + UID,
                                        data: '',
                                        headers: {
                                            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                                        },
                                        onload: infoRes => {
                                            if (infoRes.status === 200) {
                                                // 处理所有请求的结果
                                                let blogData = JSON.parse(res.response).data.items;
                                                let followingData = JSON.parse(followingRes.response);
                                                let infoData = JSON.parse(infoRes.response);
                                                console.log("wdf????",infoData);

                                                // 查询关注列表
                                                let following = followingData.code == 0 ? followingData.data.list.map(it => it.mid) : [];
                                                console.log(following);

                                                // 查询并拼接动态数据
                                                let st = JSON.stringify(blogData);

                                                // 读取info中的sign和name
                                                let sign = infoData.data.sign || '';
                                                let name = infoData.data.name || '';
                                                console.log('我滴妈呀',sign, name);

                                                // 找到的匹配内容
                                                let found = [];
                                                for (let setting of checkers) {
                                                    // 检查动态内容
                                                    if (setting.keywords) {
                                                        if (setting.keywords.find(keyword => st.includes(keyword))) {
                                                            if (found.indexOf(setting) < 0) {
                                                                found.push(setting);
                                                            }
                                                            continue;
                                                        }
                                                    }

                                                    // 检查关注列表
                                                    if (setting.followings) {
                                                        for (let mid of setting.followings) {
                                                            if (following.indexOf(mid) >= 0) {
                                                                if (found.indexOf(setting) < 0) {
                                                                    found.push(setting);
                                                                }
                                                                continue;
                                                            }
                                                        }
                                                    }

                                                    // 检查info中的sign和name
                                                    if (setting.keywords) {
                                                        if (setting.keywords.find(keyword => sign.includes(keyword) || name.includes(keyword))) {
                                                            if (found.indexOf(setting) < 0) {
                                                                found.push(setting);
                                                            }
                                                            continue;
                                                        }
                                                    }
                                                }

                                                // 添加标签
                                                if (found.length > 0) {
                                                    if (!printed) {
                                                        console.log(blogData);
                                                        printed = true;
                                                    }
                                                    checked[UID] = found;

                                                    // 给所有用到的地方添加标签
                                                    for (let element of checking[UID]) {
                                                        for (let setting of found) {
                                                            addtag(UID, element, setting);
                                                        }
                                                    }
                                                    loadingElement.parent().remove();
                                                } else {
                                                    loadingElement.text('无');
                                                }

                                            } else {
                                                loadingElement.text('失败');
                                            }

                                            delete checking[UID];
                                        },
                                        onerror: err => {
                                            loadingElement.text('失败');
                                            delete checking[UID];
                                        },
                                    });

                                } else {
                                    loadingElement.text('失败');
                                }
                            },
                            onerror: err => {
                                loadingElement.text('失败');
                                delete checking[UID];
                            },
                        });

                    } else {
                        loadingElement.text('失败');
                        delete checking[UID];
                    }
                },
                onerror: err => {
                    loadingElement.text('失败');
                    delete checking[UID];
                },
            });
        }
    }

    addGlobalStyle(`
    .iBadge {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: fit-content;
      background: #07beff26;
      border-radius: 10px;
      margin: -6px 0;
      margin: 0 5px;
      font-family: PingFang SC, HarmonyOS_Regular, Helvetica Neue, Microsoft YaHei, sans-serif;
    }
    .iName {
      line-height: 13px;
      font-size: 13px;
      color: #07beff;
      padding: 2px 8px;
    }
    .iIcon {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: 2px solid white;
      margin: -6px;
      margin-right: 5px;
    }
   `)

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    function listenKey(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined")
            targetNodes = $(selectorTxt);
        else
            targetNodes = $(iframeSelector).contents ()
                .find (selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each ( function () {
                var jThis  = $(this);
                var alreadyFound = jThis.data ('alreadyFound')  ||  false;

                if (!alreadyFound) {
                    //--- Call the payload function.
                    var cancelFound = actionFunction (jThis);
                    if (cancelFound) btargetsFound = false;
                    else jThis.data ('alreadyFound', true);
                }
            } );
        } else {
            btargetsFound = false;
        }

        var controlObj = listenKey.controlObj  ||  {};
        var controlKey = selectorTxt.replace (/[^\w]/g, "_");
        var timeControl = controlObj [controlKey];

        //--- Now set or clear the timer as appropriate.
        if (btargetsFound && bWaitOnce && timeControl) {
            clearInterval (timeControl);
            delete controlObj [controlKey]
        } else {
            //设置定时器
            if ( ! timeControl) {
                timeControl = setInterval ( function () {
                    listenKey(selectorTxt,actionFunction,bWaitOnce,iframeSelector);
                }, 300);
                controlObj [controlKey] = timeControl;
            }
        }
        listenKey.controlObj = controlObj;
    }
})
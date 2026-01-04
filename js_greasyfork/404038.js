// ==UserScript==
// @name         本地黑名单-知乎
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  我的地盘，我做主！
// @author       lavaf
// @match        https://www.zhihu.com/question/*
// @match        https://www.zhihu.com/question/*/answer/*
// @match        https://www.zhihu.com
// @match        https://www.zhihu.com/search?type=content&q=*
// @grant        none
// @require         https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/404038/%E6%9C%AC%E5%9C%B0%E9%BB%91%E5%90%8D%E5%8D%95-%E7%9F%A5%E4%B9%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/404038/%E6%9C%AC%E5%9C%B0%E9%BB%91%E5%90%8D%E5%8D%95-%E7%9F%A5%E4%B9%8E.meta.js
// ==/UserScript==

(function () {
    'use strict';
    ////www.zhihu.com/people/
    let blackList = ['la-la-la-la-la-55-20', 'mazhihang', 'song-ling-dao-jie-shou-huo-yan-jing-hua',
        'hong-liao-2', 'wang-tang-min', 'qing-er-wu-hen', 'li-wei-long-69', 'chen-yun-fei-14-82', 'su-mo-bu-pao-mo',
        'wgt-33', 'mao-cheng-wei', 'fan-ru-yun-98', 'zhang-zan-72', 'lancer-fz', 'tian-kong-zhi-shang-2', 'linyizy',
        'bbbleung', 'huajianduzhuo', 'saojikao', 'xiao-bao-de-a-ke', 'chen-yun-59-15', 'chen-bei-85-18',
        'bai-feng-nong-yu', 'stevenjau', 'xia-yun-xi-56', 'jeromewu', 'rodriguez-89', 'lan-de-qi-ming-81-72',
        'qiu-shui-luo-luo', 'tie-fo-ye', 'bdqd-67', 'si-tu-feng-79', 'gyi-liu', 'yin-wei-ta-shi-qiu-qiu', 'wang-ye-98-59',
        'da-tou-61-15', 'zhao-yi-19-56', 'sa-sa-78-68', 'chao-ji-wu-di-niang-niang-pao',
        'yangbingli', 'chen-xiao-pan-50', 'du-gu-bu-bai-79', 'Ofeet', 'maomaobear', 'ya-meng-su-ren', 'xia-mu-22-85-64',
        'la-la-la-63-18-88', 'winter-91-47', 'long-long-18-2', 'yong-yuan-bian-dong', 'hai-tao-ye-jiao-bei-ji-xiong',
        'liu-ying-jie-11-72', 'xiao-xiao-xiao-79-93','feng-xiao-dong-65-3','5abb7f525cd0bd68f95a72765b32c4e4','da-ming-84-14',
        'zheng-qian-18-96-76','zhouchong2015','san-bu-de-ji-dan-86','lao-lang-52-73','cong-cong-cong-cong-cong-88','crazyj20',
    'yi-yu-cang-mang','bu-xiang-shuo-hua-89-64','wu-shuang-25-18','xu-fan-xin-90','wang-qi-33-2','mou-mou-mou-6-79','xiaosuanmiao',
    'ka-pei-yin-47','liang-xiao-ba-32','quan-pan-ren-jia','ye-ting-feng-yu-85','shen-ma-27-90','chahai','qing-wa-chao-ren-49','ye-guang-24',
    'yang-ting-wei-99','shuang-xi-pai-01','wang-yu-ting-29-74','threecross','zhuan-ye-xie-bug-91','chao-ji-da-mang-guo-16',
    'deng-yu-xiao-45','yao-han-bo-19','xuan-lu-23-65']
    let hash=['0aafe9fcf86caa45f8aaaf345396916b','9356ebb14bbc77b6003f4e003ef9b3ba','680bb09a357c9b943bfdea48d6c008ab',
    '5e363b3a0d01463d5afbdbf3346ac881','237e18bea459b1f15dabf6a9178bd736','1291cecaf1e58966eb378421e7d5bc02','3b8f9f59c8ab071a7130d4d0d046e7a8',
    '7f2e5e99e9e9afa99e7c6ac8e562ced8','320d27dccd3d479b441bbf20d27605c7','753ca0e23e7f86e7553e6cb27571bb35','f4ca959f981c310af429ca25b3b4721d',
    '493ff7f727e5d0575b90f8afdb2ad932','94f3c584d86ba8b8e210bda1ad25aa42','fe99702eeeed6c25e429a7a7843dffab','60a169e3d74da03b6b062de2fcab7f6e',
    '947a19e1a81b70218a03bf9abc780180','42acf6e5f61c18e2fe957f74753e1b0b','4da5a65b86dab75c2994cf98c20fd262','8e1b1c9c4cf9072797682246345c7dbe',
    'ec42209e0f3c0881e09035df955df037','0c0c5921a7b09e98cc66216159a33485','3f130d6e8105fead8494afcb00213395','f24222e5646235cad11aee950eb50805',
    'c207eb04979cd8a0bd4a2a6873d9ed55','b29881aac5e27ef1aa8db611c229c124','02fdb6a89865b2cfe24a056eaf8fd0b8','3549abea1eaa9f4f43c6846f3c32dc8f',
    '680bb09a357c9b943bfdea48d6c008ab','936ac49d37ccffe05d723c45ff03f161','27927b8c17b3cdefef76c5921e32f6e3','708073d1f988b6598788fe08f5974017',
    '7fff464ba8a98ec1624dac01a5337546','46b3b9e16a1b27f26e8a3965bf72c6b7','45556483869179cd151d60eec128e39d','76a63f132a2c628a3f669196d2a56db6',
    '359b92656e6a02c26e03cd7c251caada']
    let question=['如果腾讯公司必须从《英雄联盟》和《王者荣耀》中放弃一个，那么腾讯会放弃哪一个？','你在生活中有哪些观人术和识人技巧？','李小璐老了以后，会后悔么？']
    let q=new Set(question);
    setInterval(function () {
        console.log('start')
        let nameList = $("div.CommentItemV2");
        nameList.each(function (i, e) {
            if ($(e).attr('data-lavaf') !== '1') {
                let id = $(e).find("a.UserLink-link").attr("href");
                for (const blackListKey in blackList) {
                    if (blackList.hasOwnProperty(blackListKey)) {
                        //console.log(id);
                        if ("//www.zhihu.com/people/" + blackList[blackListKey] === id) {
                            $(e).text(id + " 此用户已经被屏蔽")
                            $(e).attr('data-lavaf', '1');
                            break;
                        }
                    }
                }

            }

        });
        let List = $("div.AnswerItem");
        List.each(function (i, e) {
            if ($(e).attr('data-lavaf') !== '1') {
                let id = $(e).find('a.UserLink-link').attr("href");
                if (id == null) {
                    try{
                        let extra = $(e).attr("data-za-extra-module");

                        let i= JSON.parse(extra).card.content.author_member_hash_id;
                        for (const h in hash){
                            if (hash.hasOwnProperty(h)) {
                                if (h == i) {
                                    $(e).text(id + " 此用户已经被屏蔽")
                                    $(e).attr('data-lavaf', '1');
                                    return;
                                }
                            }
                        }
                    }catch (e) {
                        //console.log(e)
                    }

                } else
                    for (const blackListKey in blackList) {
                        if (blackList.hasOwnProperty(blackListKey)) {
                            //console.log(id);
                            if ("//www.zhihu.com/people/" + blackList[blackListKey] === id) {
                                $(e).text(id + " 此用户已经被屏蔽")
                                $(e).attr('data-lavaf', '1');
                                return;
                            }
                        }
                    }
                let name = $(e).find('span.AuthorInfo-name');
                //console.log('name:'+name);
                if (name.text() === '匿名用户') {
                    $(e).text("此匿名用户已经被屏蔽")
                    $(e).attr('data-lavaf', '1');
                    return
                }
                let title=$(e).find('h2.ContentItem-title').text()
                if (q.has(title)) {
                    $(e).text(id + " 此问题已经被屏蔽")
                    $(e).attr('data-lavaf', '1');
                    return;
                }
                let richText=$(e).find("span.ztext").text()
                console.log(richText)
                if (richText.indexOf("匿名用户") === 0) {
                    $(e).text("此匿名用户已经被屏蔽")
                    $(e).attr('data-lavaf', '1');
                }

            }

        });
    }, 500)

})();
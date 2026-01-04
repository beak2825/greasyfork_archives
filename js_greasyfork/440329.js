// ==UserScript==
// @name         NGA原神AC娘表情
// @namespace    https://greasyfork.org/zh-CN/scripts/440329-nga%E5%8E%9F%E7%A5%9Eac%E5%A8%98%E8%A1%A8%E6%83%85
// @version      1.2.8
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将 协奏交响@NGA 制作的原神AC娘表情加入到表情列表中
// @author       WLXC
// @include       /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @match        *://ngabbs.com/*
// @match        *://g.nga.cn/*
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @match        *://ngacn.cc/*
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/440329/NGA%E5%8E%9F%E7%A5%9EAC%E5%A8%98%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/440329/NGA%E5%8E%9F%E7%A5%9EAC%E5%A8%98%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==
 
//原作者发布地址：https://bbs.nga.cn/read.php?tid=30739380
//此脚本发布地址：https://bbs.nga.cn/read.php?tid=30740157
//本脚本由间桐咕哒子@NGA（http://bbs.ngacn.cc/read.php?tid=11275553）上修改而来~
//原作者地址：https://greasyfork.org/zh-CN/scripts/28491-nga-ac%E5%A8%98%E8%A1%A8%E6%83%85fgo%E5%8C%96%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92-by-%E9%97%B4%E6%A1%90%E5%92%95%E5%93%92%E5%AD%90-nga
//原作者链接：https://greasyfork.org/zh-CN/users/102500-aglandy
 
(function(){
    function init($){
        let demoNGAGenshin = commonui.acGenshinNGA = {
            data: [
                'https://img.nga.178.com/attachments/mon_202202/21/i2Qvdz6-96t5K7T8S31-2v.gif',//神里绫华
                'https://img.nga.178.com/attachments/mon_202202/19/i2Qjdc-l6ldK8T8S30-2w.gif',//班尼特
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-a3dbK9T8S3g-2y.gif',//可莉
                'https://img.nga.178.com/attachments/mon_202202/19/i2Qjdc-ksfkK8T8S2x-2v.gif',//珊瑚宫心海
                'https://img.nga.178.com/attachments/mon_202202/21/i2Qvdz7-4freK7T8S31-2w.gif',//八重神子
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-i66pK7T8S34-2x.gif',//阿贝多
                'https://img.nga.178.com/attachments/mon_202202/19/i2Qjdc-gd1xK8T8S3h-2w.gif',//刻晴
                'https://img.nga.178.com/attachments/mon_202202/27/i2Q17l-5wxoK7T8S3d-2x.gif',//神里绫人
                'https://img.nga.178.com/attachments/mon_202202/19/i2Qjdc-jpf7K7T8S3b-2x.gif',//甘雨
                'https://img.nga.178.com/attachments/mon_202202/19/i2Qjdc-890tK7T8S3g-2x.gif',//早柚
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-h5viK9T8S38-2x.gif',//胡桃
                'https://img.nga.178.com/attachments/mon_202202/19/i2Qjdc-9m3xK7T8S3c-2x.gif',//温迪
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-e7maK8T8S37-2x.gif',//达达利亚
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-7m1yK7T8S3a-2x.gif',//申鹤
                'https://img.nga.178.com/attachments/mon_202202/20/i2Qjdd-8vi7K9T8S3g-2x.gif',//烟绯
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-drhsK7T8S39-2x.gif',//迪卢克
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-130zK7T8S37-2x.gif',//万叶
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-kq38K7T8S2x-2x.gif',//钟离
                'https://img.nga.178.com/attachments/mon_202202/21/i2Qjde-denxK9T8S3m-2x.gif',//芭芭拉
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-5z71K9T8S3e-2x.gif',//散兵
                'https://img.nga.178.com/attachments/mon_202202/22/i2Qmqn9-3jazK8T8S36-2x.gif',//菲谢尔
                'https://img.nga.178.com/attachments/mon_202202/22/i2Qmqn9-lblsK7T8S2y-2x.gif',//白术
                'https://img.nga.178.com/attachments/mon_202202/22/i2Qmqn9-30q7K8T8S2y-2x.gif',//七七
                'https://img.nga.178.com/attachments/mon_202202/22/i2Q1z40-fsrrK8T8S32-2x.gif',//凯亚
                'https://img.nga.178.com/attachments/mon_202202/22/i2Qmqn9-qvhK8T8S34-2x.gif',//影
                'https://img.nga.178.com/attachments/mon_202202/22/i2Qnzlt-ab5cK7T8S2x-2x.gif',//荒泷一斗
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-4hybK8T8S3a-2x.gif',//香菱
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-7eexK6T8S33-2x.gif',//魈
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-tq8KaToS3q-2x.gif',//莫娜
                'https://img.nga.178.com/attachments/mon_202202/23/i2Qjdh-3lxcK7T8S3b-2x.gif',//九条裟罗
                'https://img.nga.178.com/attachments/mon_202202/24/i2Q7i87-f5lnK7T8S3e-2x.gif',//托马
                'https://img.nga.178.com/attachments/mon_202202/24/i2Q0-9t9gK6T8S39-2x.gif',//安柏
                'https://img.nga.178.com/attachments/mon_202202/24/i2Q0-bm03K7T8S3a-2x.gif',//行秋
                'https://img.nga.178.com/attachments/mon_202202/24/i2Qvpco-idt1K6T8S39-2x.gif',//重云
                'https://img.nga.178.com/attachments/mon_202202/26/i2Q8m1k-3277K7T8S31-2x.gif',//砂糖
                'https://img.nga.178.com/attachments/mon_202202/26/i2Q8m1k-anhgK8T8S35-2x.gif',//五郎
                'https://img.nga.178.com/attachments/mon_202202/26/i2Q8m1k-erhwK7T8S3f-2x.gif',//凝光
                'https://img.nga.178.com/attachments/mon_202202/26/i2Q8m1k-9gjjK7T8S3f-2x.gif',//迪奥娜
                'https://img.nga.178.com/attachments/mon_202202/27/i2Q17l-gpihK7T8S38-2x.gif',//云堇
                'https://img.nga.178.com/attachments/mon_202202/27/i2Q17l-4h4dK8T8S3c-2x.gif',//优菈
                'https://img.nga.178.com/attachments/mon_202202/27/i2Q17l-20myK8T8S30-2x.gif',//宵宫
                'https://img.nga.178.com/attachments/mon_202202/27/i2Q17l-31jtK8T8S3a-2x.gif',//琴
                'https://img.nga.178.com/attachments/mon_202202/28/i2Q17l-aodrK8T8S3i-2x.gif',//诺艾尔
                'https://img.nga.178.com/attachments/mon_202202/28/i2Q17l-1e3xK8T8S39-2x.gif',//丽莎
                'https://img.nga.178.com/attachments/mon_202202/28/i2Q17l-gcy7K8T8S3c-2x.gif',//雷泽
                'https://img.nga.178.com/attachments/mon_202202/28/i2Q17l-8yecK9ToS3w-2x.gif',//北斗
                'https://img.nga.178.com/attachments/mon_202203/01/i2Q17l-dk2K9ToS3w-2x.gif',//罗莎莉亚
                'https://img.nga.178.com/attachments/mon_202203/01/i2Q17l-exdzKaToS3w-2x.gif',//辛焱
                'https://img.nga.178.com/attachments/mon_202203/01/i2Q17l-byqbK8T8S34-2x.gif',// 瑶瑶
                'https://img.nga.178.com/attachments/mon_202205/27/i2Qjgw-bwyaK6T8S2x-2x.png',//久岐忍
                'https://img.nga.178.com/attachments/mon_202205/27/i2Qjgw-5bf3K7T8S2x-2x.png',//夜兰
                'https://img.nga.178.com/attachments/mon_202205/27/i2Qjgw-58tiK7T8S36-2x.png',//鹿野院平藏
                'https://img.nga.178.com/attachments/mon_202208/02/i2Qvg8w-dufqK8T8S2x-2x.gif',//柯莱
                'https://img.nga.178.com/attachments/mon_202208/02/i2Qvg8w-2d72K9T8S2x-2x.gif',//多莉
                'https://img.nga.178.com/attachments/mon_202208/02/i2Qvg8w-4ueuK8T8S3c-3c.gif',//提纳里
                'https://img.nga.178.com/attachments/mon_202208/02/i2Qvg8w-ap6xK7T8S2x-2x.gif',//哥伦比娅
                'https://img.nga.178.com/attachments/mon_202209/02/i2Qjkh-y50KaT8S2x-2x.gif',//妮露
                'https://img.nga.178.com/attachments/mon_202209/02/i2Qjkh-7wyeK9T8S2x-2x.gif',//赛诺
                'https://img.nga.178.com/attachments/mon_202210/26/i2Qjmg-7kshKaT8S2x-2x.gif',//纳西妲1
                'https://img.nga.178.com/attachments/mon_202210/26/i2Qjmg-7owqKaT8S2x-2x.gif',//纳西妲2
                'https://img.nga.178.com/attachments/mon_202212/11/i2Q0-kanqK8T8S2x-2x.gif',//珐露珊
                'https://img.nga.178.com/attachments/mon_202302/19/i2Q2r-l5jvK8T8S2x-2x.gif',//艾尔海森
                'https://img.nga.178.com/attachments/mon_202209/02/i2Qjkh-brj6K7T8S3c-36.gif',//潘塔罗涅
                'https://img.nga.178.com/attachments/mon_202203/01/i2Q17l-hrx6K8T8S3b-2x.gif',//戴因斯雷布
                'https://img.nga.178.com/attachments/mon_202301/21/i2Q2r-4gknK9T8S2x-2x.gif',//留云借风真君
                'https://img.nga.178.com/attachments/mon_202301/21/i2Q2r-6nlpK9T8S2x-2x.gif',//归终
                'https://img.nga.178.com/attachments/mon_202301/21/i2Q2r-3b4zKaT8S3e-35.gif',//歌尘浪世真君
                'https://img.nga.178.com/attachments/mon_202212/10/i2Q27eo-28eeKaT8S2x-2x.gif',//坎蒂丝旅行者荧
                'https://img.nga.178.com/attachments/mon_202212/10/i2Qpdgx-c91hKaT8S2x-2x.gif',//坎蒂丝旅行者空
                'https://img.nga.178.com/attachments/mon_202203/02/i2Q17l-11ffK7T8S32-2x.gif',//空1
                'https://img.nga.178.com/attachments/mon_202203/02/i2Q17l-ft2xK7T8S36-2x.gif',//荧1
                'https://img.nga.178.com/attachments/mon_202203/02/i2Q17l-i5piK7T8S3i-2x.gif',//空2
                'https://img.nga.178.com/attachments/mon_202203/02/i2Q17l-2p3gK7T8S3c-2x.gif',//荧2
                'https://img.nga.178.com/attachments/mon_202203/02/i2Q17l-h2zjK7T8S30-2x.gif',//空3
                'https://img.nga.178.com/attachments/mon_202203/02/i2Q17l-6iezK8T8S3f-2x.gif',//荧3
                'https://img.nga.178.com/attachments/mon_202203/02/i2Q17l-fmpfK8T8S3j-2x.gif',//派蒙1
                'https://img.nga.178.com/attachments/mon_202203/02/i2Q17l-v7jK7ToS3w-2x.gif',//派蒙2
                'https://img.nga.178.com/attachments/mon_202203/02/i2Q17l-b4tjK9ToS4v-2x.gif',//派蒙3
                // NGA原神ac娘的地址
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoNGAGenshin.data, function(i, picURL){
                        imgs.append('<img height="60px" src="' + picURL + '" onclick="postfunc.addText(\'[img]' + picURL + '[/img]\');postfunc.selectSmilesw._.hide()" />');
                    });
                $.each(bodyTom, function(i, thisK){
                    if(i == ngademo.index() - 1)
                        thisK.style.display = '';
                    else
                        thisK.style.display = 'none';
                });
                ngademo.parent().children().eq(0).html('');
            },
            addBtn: function(){
                $('[title="插入表情"]:not([ac-Genshin])').attr('ac-Genshin', 1).bind('click.acGenshinNGAAddBtn', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("原神AC娘")))').append('<button class="block_txt_big">原神AC娘</button>').find(':contains("原神AC娘")').bind('click.acGenshinNGABtn', demoNGAGenshin.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoNGAGenshin.addBtn();
            })
        };
 
        demoNGAGenshin.addBtn();
 
        demoNGAGenshin.putInBtn.observe($('body')[0], {
            subtree: true,
            childList: true,
        });
    }
 
    (function check(){
        try{
            init(commonui.userScriptLoader.$);
        }
        catch(e){
            setTimeout(check, 50);
        }
    })();
 
})();
 
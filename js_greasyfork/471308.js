// ==UserScript==
// @name         nga粥版表情
// @namespace    null
// @version      0.1.1.beta
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将 降夜飞霜@NGA 制作的明日方舟AC娘表情及部分常用表情包加入到NGA的表情列表中
// @author       JJB_ARK2019
// @include       /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/.+/
// @match        *://ngabbs.com/*
// @match        *://g.nga.cn/*
// @match        *://nga.178.com/*
// @match        *://ngabbs.com/*
// @match        *://ngacn.cc/*
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/471308/nga%E7%B2%A5%E7%89%88%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/471308/nga%E7%B2%A5%E7%89%88%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==

//本脚本由间桐咕哒子@NGA(http://bbs.ngacn.cc/read.php?tid=11275553)等上修改而来~
//原作者地址：https://greasyfork.org/zh-CN/scripts/28491-nga-ac%E5%A8%98%E8%A1%A8%E6%83%85fgo%E5%8C%96%E8%A1%A5%E5%AE%8C%E8%AE%A1%E5%88%92-by-%E9%97%B4%E6%A1%90%E5%92%95%E5%93%92%E5%AD%90-nga
//原作者链接：https://greasyfork.org/zh-CN/users/102500-aglandy

(function(){
    function init($){
        let demoNGAArknights = commonui.acArknightsNGA = {
            data: [
                'https://img.nga.178.com/attachments/mon_202207/22/-klbw3Q2q-jij8K5T8S2s-2s.gif',//灵知-有何贵干
                'https://img.nga.178.com/attachments/mon_202207/22/-klbw3Q2q-5mbmK5T8S2s-2s.gif',//闪灵-呆
                'https://img.nga.178.com/attachments/mon_202207/22/-klbw3Q2q-9iy2K5T8S2s-2s.gif',//傀影-壁咚
                'https://img.nga.178.com/attachments/mon_202207/22/-klbw3Q2q-g6sjK6T8S2s-2s.gif',//黑键-哼
                'https://img.nga.178.com/attachments/mon_202207/22/-klbw3Q2q-cbsqK7T8S2s-2s.gif',//莫斯提马-goodjob
                'https://img.nga.178.com/attachments/mon_202207/22/-klbw3Q2q-1odzK7T8S2s-2s.gif',//安比尔-黑枪
                'https://img.nga.178.com/attachments/mon_202207/22/-klbw3Q2q-fl71K6T8S2s-2s.gif',//老鲤-扇子笑
                'https://img.nga.178.com/attachments/mon_202207/22/-klbw3Q2q-90w2K6T8S2s-2s.gif',//年-嘲笑
                'https://img.nga.178.com/attachments/mon_202207/23/-klbw3Q2q-6vorK7T8S2s-2s.gif',//菲亚梅塔-咦
                'https://img.nga.178.com/attachments/mon_202207/23/-klbw3Q2q-178sK6T8S28-2f.gif',//闪灵-闪光
                'https://img.nga.178.com/attachments/mon_202207/25/-klbw3Q2q-krugK6T8S2n-2n.gif',//史尔特尔-威吓
                'https://img.nga.178.com/attachments/mon_202207/25/-klbw3Q2q-9abvK5T8S2s-2s.gif',//阿米娅-抢镜头
                'https://img.nga.178.com/attachments/mon_202207/26/-klbw3Q2q-db9rK6T8S2s-2s.gif',//刻俄柏-恨1
                'https://img.nga.178.com/attachments/mon_202207/26/-klbw3Q2q-6mvpK6T8S2s-2s.gif',//刻俄柏-恨2
                'https://img.nga.178.com/attachments/mon_202207/26/-klbw3Q2q-ik14K5T8S2d-1y.gif',//雪雉-羡慕
                'https://img.nga.178.com/attachments/mon_202207/31/-klbw3Q0-3piyK4T8S2i-2i.gif',//送葬人-怒
                'https://img.nga.178.com/attachments/mon_202207/31/-klbw3Q0-l8qzK7T8S2s-2s.gif',//梅-lucky
                'https://img.nga.178.com/attachments/mon_202207/31/-klbw3Q0-e1z6K7T8S2s-2s.gif',//伊芙利特-怒
                // 方舟ac娘
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3p-dertKgT8S37-2c.png',//拖拽
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3p-kmmkKdT8S28-2f.png',//游泳
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3q-6vg8KfT8S2c-2b.png',//疑问
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3q-e7hoKlToS4a-2c.png',//夕阳
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3r-9x3KdT8S2l-2c.png',//睡觉
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3r-7w5fKhToS2a-2c.png',//怒
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3r-fr9wKhToS2l-2c.png',//噗噗
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3s-1ocrKjToS2r-2c.png',//凝视
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3s-8xuiKgT8S2f-2c.png',//哭泣
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3s-g7l2KhT8S28-2c.png',//两片面包
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3t-1j2gKfT8S26-2c.png',//吃东西
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3t-93agKmToS3m-2n.png',//暴打
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qri3t-gg1sKoToS38-2c.png',//吃冰淇淋
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qbi3q-2iflKhToS2d-2c.png',//唱歌
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qbi3q-9kb4KgT8S2g-2c.png',//擦汗
                'https://img.nga.178.com/attachments/mon_202208/22/-klbw3Qbi3q-j2s1KiToS2n-2c.png',//抱抱
                //斯卡蒂系列
                'https://img.nga.178.com/attachments/mon_202209/23/kfQ182-hhklK7ToS47-4c.jpg',//可爱
                'https://img.nga.178.com/attachments/mon_202209/24/kfQ182-j6thKiToS46-46.jpg',//抱猫哭
                'https://img.nga.178.com/attachments/mon_202209/24/kfQ182-lbutZlT3cSqk-qk.jpg',//逃避责任
                'https://img.nga.178.com/attachments/mon_202209/24/kfQ182-du14K3T8S1z-1z.jpg',//疑问1
                'https://img.nga.178.com/attachments/mon_202209/24/kfQ182-bpz5K4T8S3c-2o.jpg',//疑问2
                //水月
                'https://img.nga.178.com/attachments/mon_202307/21/-klbw3Q2s-26lK3T8S1x-1o.jpg',//邪魔扇子笑
                'https://img.nga.178.com/attachments/mon_202307/21/-klbw3Q2s-g8hwK3T8S1u-1u.jpg',//邪魔点赞
                'https://img.nga.178.com/attachments/mon_202307/20/-klbw3Q2s-f5cjK3T8S1u-1u.jpg',//邪魔喘
                'https://img.nga.178.com/attachments/mon_202307/20/-klbw3Q2s-gzxsK3T8S1u-1u.jpg',//
                'https://img.nga.178.com/attachments/mon_202307/20/-klbw3Q2s-ets3KaT8S1u-1u.png',//怒
                'https://img.nga.178.com/attachments/mon_202307/20/-klbw3Q2s-kmnpK3T8S1u-1u.jpg',//喘
                //邪魔系列
                'https://img.nga.178.com/attachments/mon_202209/01/-4qiozQo38p-hxt6Z19T3cShm-o0.gif',//彩ac
                'https://img.nga.178.com/attachments/mon_202209/24/kfQ182-g6ieZqT3cSk0-jq.jpg',//粉毛逃避责任
                'https://img.nga.178.com/attachments/mon_202308/11/l2Q2s-6awgK2fT1kSd2-bz.jpg.thumb.jpg',//对流水厨
                'https://img.nga.178.com/attachments/mon_202308/21/l2Qjr4-hswiK1pT3cSpe-yt.jpg',//尖叫抓绕
                'https://img.nga.178.com/attachments/mon_202308/23/l2Q0-fgbnK15T1kSeq-c0.jpg',//自动下原神
                'https://img.nga.178.com/attachments/mon_202308/24/l2Q7i87-kcrrK12T1kShs-b4.jpg',//不服
                //oth
            ],
            addPic: function(biu){
                let ngademo = $(biu.target),
                    bodyTom = ngademo.parent().next().children(),
                    imgs = bodyTom.eq(ngademo.index() - 1);
                if(!imgs.children()[0])
                    $.each(demoNGAArknights.data, function(i, picURL){
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
                $('[title="插入表情"]:not([ac-Arknights])').attr('ac-Arknights', 1).bind('click.acArknightsNGAAddBtn', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button:contains("常用表情（方舟）")))').append('<button class="block_txt_big">常用表情（方舟）</button>').find(':contains("常用表情（方舟）")').bind('click.acArknightsNGABtn', demoNGAArknights.addPic)
                            .end().next().append('<div />');
                    },100);
                });
            },
            putInBtn: new MutationObserver(function(){
                demoNGAArknights.addBtn();
            })
        };

        demoNGAArknights.addBtn();

        demoNGAArknights.putInBtn.observe($('body')[0], {
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

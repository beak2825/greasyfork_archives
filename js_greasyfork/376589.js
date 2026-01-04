// ==UserScript==
// @name         NGA 少女前线表情包
// @version      1.2.0.5
// @icon         http://bbs.nga.cn/favicon.ico
// @description  将쮸운制作的Sop2表情、苏初雨制作的官方表情、祁连子制作的年糕狗表情及韩国友人制作的若干M4A1的GIF加入NGA表情选择列表
// @author       原作者:AgLandy,本文件由Starainbow魔改
// @include      /^https?://(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|ngabbs\.com)/.+/
// @grant        none
// @require      https://greasyfork.org/scripts/39014-nga-user-script-loader/code/NGA%20User%20Script%20Loader.js
// @namespace https://greasyfork.org/users/238764
// @downloadURL https://update.greasyfork.org/scripts/376589/NGA%20%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/376589/NGA%20%E5%B0%91%E5%A5%B3%E5%89%8D%E7%BA%BF%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

//原仓鼠表情脚本的发布地址：https://nga.178.com/read.php?tid=11430750
//SOP2表情的发布地址：http://m.dcinside.com/board/gfl2/362213
//年糕狗表情的发布地址：
//Part1.https://www.weibo.com/1725474505/Fwanjb8M5
//Part2.https://www.weibo.com/1725474505/FwanEqlMO
//Bonus.https://bbs.nga.cn/read.php?tid=17784222
//此脚本的发布地址：http://nga.178.com/read.php?tid=16127479

(function(){

    function init($){

        let b = commonui.GFIcon = {
            data: [
                './mon_201901/11/-klbw3Q5-gq1dKaT8S2s-2s.gif',
                './mon_201901/22/-klbw3Q5-jq7cZtToS2s-2s.gif',
                './mon_201901/11/-klbw3Q5-4j3kK7T8S2s-2s.jpg',
                './mon_201901/11/-klbw3Q5-6fo2KdT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-7ogmK4T8S2s-2s.jpg',
                './mon_201901/11/-klbw3Q5-5y0pKjToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-kcziK3T8S2s-2s.jpg',
                './mon_201901/11/-klbw3Q5-erjzK3T8S2s-2s.jpg',
                './mon_201901/11/-klbw3Q5-daxdKiToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-aam7KdT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-7jg3K4T8S2s-2s.jpg',
                './mon_201901/11/-klbw3Q5-k393K4T8S2s-2s.jpg',
                './mon_201901/11/-klbw3Q5-fulsKfT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-1g1KaT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-5nn2K3T8S2s-2s.jpg',
                './mon_201901/11/-klbw3Q5-b8asKfT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-hf97KbT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-24c5KcT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-daqcK4T8S2s-2s.jpg',
                './mon_201901/11/-klbw3Q5-j0p5KbT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-3b6jKgT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-8wxkKhT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-4sedK2T8S2s-2s.jpg',
                './mon_201901/11/-klbw3Q5-aej0KeT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-fz52KdT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-oi5K8T8S2s-2s.jpg',
                './mon_201901/11/-klbw3Q5-97uKbT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-bk5xKbT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-h5jqKfT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-1qhyKeT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-d3drKjToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-ioolKaT8S2s-2s.png',
                './mon_201901/11/-klbw3Q5-2w10KlToS2s-2s.jpg',//以上为sop2的表情，总计33个
                './mon_201901/24/-klbw3Q5-i8mnKqToS2g-2s.gif',
                './mon_201901/24/-klbw3Q5-hc3cK9T8S2g-2s.gif',
                './mon_201901/24/-klbw3Q5-bnofKsToS2g-2s.gif',
                './mon_201907/03/-bqqbQ5-6iwwK1gToS2g-2s.gif',
                './mon_201901/24/-klbw3Q5-5tghKsToS2m-2s.gif',
                './mon_201901/24/-klbw3Q5-ka7xKaT8S2g-2s.gif',
                './mon_201901/24/-klbw3Q5-c43iK6T8S2g-2s.gif',
                './mon_201901/24/-klbw3Q5-6jl8K8T8S2g-2s.gif',
                './mon_201907/06/-bqqbQ5-8fgyK4T8S2g-2s.gif',
                './mon_201907/06/-bqqbQ5-1v7iKgT8S2g-2s.gif',
                './mon_201907/06/-bqqbQ5-ejyrK6T8S2g-2s.gif',
                './mon_201907/06/-bqqbQ5-ka9qKfT8S2g-2s.gif',
                './mon_201907/06/-bqqbQ5-4n1rKlToS2i-2s.gif',//以上为年糕狗的表情，总计33+13=46个
                './mon_201901/11/-klbw3Q5-7nk8KmToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-dkj1KoToS2s-2s.png',
                './mon_201901/24/-klbw3Q5-1humKzToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-3yg3KlToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-jjdbKpToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-drqtKnToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-7vj9KpToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-1zvjKrToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-hmbxKoToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-bscbKrToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-jzojKnToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-dwiyKmToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-9sjhKnToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-9wszKmToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-329KmToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-fo16KqToS2s-2s.png',
                './mon_201901/24/-klbw3Q5-1cdaKwToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-269lKnToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-7xmgKlToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-hv11KlToS2s-2s.png',
                './mon_201901/24/-klbw3Q5-k09jK17ToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-4rgkKmToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-c4zuKnToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-65bfKoToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-3xchKqToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-fzpcKlToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-43h2KpToS2s-2s.png',
                './mon_201901/11/-klbw3Q5-jm7nKoToS2s-2s.png',
                './mon_201901/24/-klbw3Q5-dtfxK14ToS2s-2s.png',
                './mon_201901/24/-klbw3Q5-7nxaK12ToS2s-2s.png',
                './mon_201901/24/-klbw3Q5-gvf2K17ToS2s-2s.png',
                './mon_201901/24/-klbw3Q5-a6btK16ToS2s-2s.png',
                './mon_201901/24/-klbw3Q5-4eqkK11ToS2s-2s.png',
                './mon_201901/24/-klbw3Q5-7aflKyToS2s-2s.png',
                './mon_201904/14/-klbw3Q5-1brcK14ToS2s-2s.png',
                './mon_201906/10/-klbw3Q5-hmxcK10ToS2s-2s.png',
                './mon_201906/10/-klbw3Q5-azebK13ToS2s-2s.png',
                './mon_201906/10/-klbw3Q5-4uq5K16ToS2s-2s.png',
                './mon_201906/10/-klbw3Q5-ij1aK12ToS2s-2s.png',
                './mon_201906/10/-klbw3Q5-bznyK14ToS2s-2s.png',
                './mon_201906/10/-klbw3Q5-5mboK13ToS2s-2s.png',//以上为sop2的表情，总计46+41=87个
                './mon_201901/24/-klbw3Q5-8etpK1jToS2s-2s.gif',
                './mon_201901/24/-klbw3Q5-2wtvZfToS2s-2s.gif',
                './mon_201906/10/-klbw3Q5-g53kZdToS2s-2s.gif',
                './mon_201901/24/-klbw3Q5-fhsK2eToS2s-2s.gif',
                './mon_201906/10/-klbw3Q5-ctz7KrToS2s-2s.gif',
                './mon_201901/24/-klbw3Q5-3douZfToS2s-2s.gif',
                './mon_201901/24/-klbw3Q5-ftcuKhToS2s-2s.gif',
                './mon_201901/24/-klbw3Q5-4zqfKxToS2s-2s.gif',
                './mon_201901/24/-klbw3Q5-e4q5ZuToS2s-2s.gif',
                './mon_201906/10/-klbw3Q5-dikdZ1aToS2s-2s.gif',
                './mon_201906/10/-klbw3Q5-fdkpZrToS2s-2s.gif',
                './mon_202002/29/-mpnxjQ5-jz8wZiToS2s-2s.gif',
                './mon_202002/29/-mpnxjQ5-k8hZbToS2s-2s.gif',
                './mon_202002/29/-mpnxjQ5-9jehKfT8S2s-2s.gif',
                './mon_202002/29/-mpnxjQ5-3dqaKqToS2s-2s.gif',
                './mon_202002/29/-mpnxjQ5-4tf8K2kToS2s-2s.gif',
                './mon_202002/29/-mpnxjQ5-gwjlZzToS2s-2s.gif',
                './mon_202002/29/-mpnxjQ5-gtyzK1fToS2s-2s.gif',
                './mon_202003/02/-mpnxjQ5-8qscZfToS2s-2s.gif',
                './mon_202003/02/-mpnxjQ5-kb1vZeToS2s-2s.gif',
                './mon_202003/02/-mpnxjQ5-9350KbT8S2s-2s.gif',
                './mon_202003/02/-mpnxjQ5-ktc4KaT8S2s-2s.gif',
                './mon_202003/02/-mpnxjQ5-4qysK9T8S2s-2s.gif',//以上为M4的表情，总计87+23=110个
                './mon_202003/18/-mpnxjQ5-chehKlToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-62mpKkToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-fdagKmToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-1vlKoToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-97v1KiToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-2p7aKlToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-i5w7KlToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-b10jKkToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-4r0wKlToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-jnzxKmToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-deh7KmToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-7a7cKkToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-zthKoToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-gclbKnToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-10fjKkToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-9xtdKmToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-3wxwKjToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-jbkiKlToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-d7ljKmToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-77noKkToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-flpbKmToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-9opzKkToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-3retKlToS2s-2s.png',
                './mon_202003/18/-mpnxjQ5-j2igKlToS2s-2s.png',
                './mon_202003/20/-mpnxjQ5-4nq3KnToS2s-2s.png',
                './mon_202003/20/-mpnxjQ5-htboKnToS2s-2s.png',
                './mon_202003/20/-mpnxjQ5-bsnpKiToS2s-2s.png',//以上为小剧场的表情，总计110+27=137个
                './mon_202106/23/-mpnxjQ2o-cct8KtToS2s-2s.png',
                './mon_202106/23/-mpnxjQ2o-ctk7KtToS2s-2s.png',
                './mon_202106/23/-mpnxjQ2o-eljiKuToS2s-2s.png',
                './mon_202106/23/-mpnxjQ2o-6kkpKtToS2s-2s.png',
                './mon_202106/23/-mpnxjQ2o-8ecqKvToS2s-2s.png',//以上为小剧场+新UI的表情，总计110+27+5=142个
                './mon_202104/26/-mpnxjQ5qhh-imuhKqToS3c-3c.png',
                './mon_202104/26/-mpnxjQ5qhi-6hsbKpToS3c-3c.png',
                './mon_202104/26/-mpnxjQ4ydx-5redKrToS3c-3c.png',
                './mon_202104/26/-mpnxjQ5qhj-4lv1KqToS3c-3c.png',
                './mon_202104/26/-mpnxjQ5qhl-g2rrKnToS3c-3c.png',
                './mon_202104/26/-mpnxjQ4ydx-21j5KlToS3c-3c.png',
                './mon_202104/26/-mpnxjQ5qhj-dr7sKpToS3c-3c.png',
                './mon_202104/26/-mpnxjQ5qhk-29g5KtToS3c-3c.png',
                './mon_202104/26/-mpnxjQ5qhi-gqnaKnToS3c-3c.png',
                './mon_202104/26/-mpnxjQ5qhk-b9jwKoToS3c-3c.png',
                './mon_202104/26/-mpnxjQ4ydx-axmxKvToS3c-3c.png',
                './mon_202104/26/-mpnxjQ4ydx-efr3KsToS3c-3c.png',
                './mon_202104/26/-mpnxjQ4ydx-e4kfKpToS3c-3c.png',
                './mon_202104/26/-mpnxjQ5qhl-7jj5KrToS3c-3c.png',
                './mon_202104/26/-mpnxjQ4ydx-42qnKqToS3c-3c.png',
                './mon_202104/26/-mpnxjQ5qhk-kcjfKmToS3c-3c.png',
            ],
            text: [
                '比心',
                '吃瓜',
                '打call',
                '冲鸭',
                '呆',
                '得意',
                '干杯',
                '害羞',
                '黑化',
                '精神抖擞',
                '哭',
                '卖萌',
                '小钱钱',
                '色',
                '认真',
                '睡觉',
                '晚安',
                '无语',
                '嫌弃',
                '小公主',
                '耶',
                '疑惑',
                '震惊',
                '醉',
                '期待',
                '心虚',
                '叶！',//以上为小剧场的表情，总计27个
                'S',
                'A',
                'B',
                'C',
                'D',//以上为新UI的表情，总计27+5=32个
                '这样啊',
                '喜欢',
                '对不住',
                '那我呢',
                '好',
                '啊这',
                '累了',
                '可怜兮兮',
                '气势汹汹',
                '警觉',
                '啊啊啊',
                '不挺好',
                '哈哈哈',
                '喝水冷静',
                '还有谁',
                '欢迎',//以上为罗森的表情，总计32+16=48个
            ],
            f: function(e){
                let picLoc = $(e.target).parent().next();
                let textLoc = $(e.target).prevAll("span");
                //显示作者信息+判定是否载入图片
                if(e.target.name == 'GFIconSopKorea'){
                    textLoc.html("©作者：쮸운");
                    if (!picLoc.find('div[name ="GFIconSopKorea"]').children()[0]){
                        let t = b.data.slice(0, 33);
                        let icon = "";
                        $.each(t, function(i, v){
                            icon += '<img height="85px" style="margin:0px 2px" src="https://img.nga.178.com/attachments/' + v + '" onclick="postfunc.addText(\'[img]' + v + '[/img]\');postfunc.selectSmilesw._.hide()" />';
                        });
                        picLoc.find('div[name ="GFIconSopKorea"]').html(icon);
                    }
                }
                if(e.target.name == 'GFIconSopGif'){
                    textLoc.text("©作者：祁连子；NGA ID：东方白野兔");
                    if (!picLoc.find('div[name ="GFIconSopGif"]').children()[0]){
                        let t = b.data.slice(33, 46);
                        let icon = "";
                        $.each(t, function(i, v){
                            icon += '<img height="100px" style="margin:0px 2px" src="https://img.nga.178.com/attachments/' + v + '" onclick="postfunc.addText(\'[img]' + v + '[/img]\');postfunc.selectSmilesw._.hide()" />';
                        });
                        picLoc.find('div[name ="GFIconSopGif"]').html(icon);
                    }
                }
                if(e.target.name == 'GFIconOffical'){
                    $(textLoc).text("©作者：苏初雨");
                    if (!picLoc.find('div[name ="GFIconOffical"]').children()[0]){
                        let t = b.data.slice(46, 87);
                        let icon = "";
                        $.each(t, function(i, v){
                            icon += '<img height="85px" style="margin:0px 2px" src="https://img.nga.178.com/attachments/' + v + '" onclick="postfunc.addText(\'[img]' + v + '[/img]\');postfunc.selectSmilesw._.hide()" />';
                        });
                        picLoc.find('div[name ="GFIconOffical"]').html(icon);
                    }
                }
                if(e.target.name == 'GFIconM4Gif'){
                    $(textLoc).text("©转自：Dcinside");
                    if (!picLoc.find('div[name ="GFIconM4Gif"]').children()[0]){
                        let t = b.data.slice(87, 110);
                        let icon = "";
                        $.each(t, function(i, v){
                            icon += '<img height="100px" style="margin:0px 2px" src="https://img.nga.178.com/attachments/' + v + '" onclick="postfunc.addText(\'[img]' + v + '[/img]\');postfunc.selectSmilesw._.hide()" />';
                        });
                        picLoc.find('div[name ="GFIconM4Gif"]').html(icon);
                    }
                }
                if(e.target.name == 'GFIconAnime'){
                    $(textLoc).text("©泡面番");
                    if (!picLoc.find('div[name ="GFIconAnime"]').children()[0]){
                        let t = b.data.slice(110,142);
                        let icon = "";
                        $.each(t, function(i, v){
                            icon += '<img height="100px" style="margin:0px 2px" src="https://img.nga.178.com/attachments/' + v + '" title="' + b.text[i] + '" onclick="postfunc.addText(\'[img]' + v + '[/img]\');postfunc.selectSmilesw._.hide()" />';
                        });
                        picLoc.find('div[name ="GFIconAnime"]').html(icon);
                    }
                }
                if(e.target.name == 'GFIconLawson'){
                    $(textLoc).text("©少女前线×罗森");
                    if (!picLoc.find('div[name ="GFIconLawson"]').children()[0]){
                        let t = b.data.slice(142,b.data.length);
                        let icon = "";
                        $.each(t, function(i, v){
                            icon += '<img height="120px" style="margin:0px 2px" src="https://img.nga.178.com/attachments/' + v + '" title="' + b.text[i+32] + '" onclick="postfunc.addText(\'[img]' + v + '[/img]\');postfunc.selectSmilesw._.hide()" />';
                        });
                        picLoc.find('div[name ="GFIconLawson"]').html(icon);
                    }
                }
                //修改图片显示的情况
                $(picLoc).children('div[name != "'+e.target.name+'"]').attr("style","display: none;");
                $(picLoc).children('div[name = "'+e.target.name+'"]').attr("style","");
            },
            r: function(){
                $('div[class^="lessernuke"]').attr("class","").children('div[name^="lessernuke"]').attr("style","").prevAll().empty();
                $('[title="插入表情"]:not([GFIcon])').attr('GFIcon', 1).bind('click.GFIconAddBtn', function(){
                    setTimeout(function(){
                        $('.single_ttip2 div.div3 div:has(button:contains("AC娘(v1)")):not(:has(button[name^="GFIcon"]))')
                            .append('<button class="block_txt_big" name="GFIconSopKorea">Sop2</button><button class="block_txt_big" name="GFIconSopGif">年糕狗</button><button class="block_txt_big" name="GFIconOffical">少前官方</button><button class="block_txt_big" name="GFIconM4Gif">M4-GIF</button><button class="block_txt_big" name="GFIconAnime">人形小剧场</button><button class="block_txt_big" name="GFIconLawson">少前×罗森</button>')
                            .find('[name^="GFIcon"]')
                            .bind('click.GFIconBtn', b.f)
                            .end().next()
                            .append('<div name ="GFIconSopKorea" style="display: none;"></div><div name ="GFIconSopGif" style="display: none;"></div><div name ="GFIconOffical" style="display: none;"></div><div name ="GFIconM4Gif" style="display: none;"></div><div name ="GFIconAnime" style="display: none;"></div><div name ="GFIconLawson" style="display: none;"></div>');
                    },100);
                });
            },
            mo: new MutationObserver(function(){
                b.r();
            })
        };

        b.r();

        b.mo.observe($('body')[0], {
            childList: true,
            subtree: true,
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
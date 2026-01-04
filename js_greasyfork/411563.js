// ==UserScript==
// @name         Hololive Schedule EN Translation
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       adXerg
// @match        https://schedule.hololive.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411563/Hololive%20Schedule%20EN%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/411563/Hololive%20Schedule%20EN%20Translation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).prop('title', 'HoloLive Productions distribution schedule「HoloDule」');
    //Side Menu Translation
    $("ul.drawer-menu:nth-child(4) > li:nth-child(1) > a:nth-child(1)").text('All');
    $("ul.drawer-menu:nth-child(4) > li:nth-child(2) > a:nth-child(1)").text('HoloLive');
    $("ul.drawer-menu:nth-child(4) > li:nth-child(3) > a:nth-child(1)").text('HoloStars');
    $("ul.drawer-menu:nth-child(4) > li:nth-child(4) > a:nth-child(1)").text('INoNaKa');
    $(".drawer-nav > nav:nth-child(1) > div:nth-child(6)").text('Timezone');
    $("ul.drawer-menu:nth-child(1) > li:nth-child(1) > a:nth-child(1)").text('Contact Us');
    $("ul.drawer-menu:nth-child(1) > li:nth-child(2) > a:nth-child(1)").text('Privacy Policy');
    $(".btn").text('Help').css({'padding':'0', 'font-size':'18px'});
    $("div.holodule:nth-child(5) > a:nth-child(2)").text('Standard Version');
    $("div.holodule:nth-child(5) > a:nth-child(3)").text('Simple Version');
    $("#label1").text('About HoloDule');
    $(".modal-body > p:nth-child(1)").text('This is a schedule site where you can find out the livestreams of VTubers belonging to HoloLive Production.');
    $(".modal-body > p:nth-child(2)").text('The schedule is updated every 15 minutes.');
    $(".modal-body > p:nth-child(3)").text('Video currently being streamed is displayed in a red frame.');
    $(".modal-body > p:nth-child(4)").text('Streaming time is subject to change.');

    //Day Translation
    $(".navbar-text:contains('(月)')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('(月)', '(Monday)'));
    });

    $(".navbar-text:contains('(火)')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('(火)', '(Tuesday)'));
    });

    $(".navbar-text:contains('(水)')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('(水)', '(Wednesday)'));
    });

    $(".navbar-text:contains('(木)')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('(木)', '(Thursday)'));
    });

    $(".navbar-text:contains('(金)')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('(金)', '(Friday)'));
    });

    $(".navbar-text:contains('(土)')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('(土)', '(Saturday)'));
    });

    $(".navbar-text:contains('(日)')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('(日)', '(Sunday)'));
    });

    //Members Name Translation (Standard Version)
    //hololive
    $(".name:contains('ときのそら')").text('Tokino Sora');
    $(".name:contains('ロボ子さん')").text('Roboco');
    $(".name:contains('さくらみこ')").text('Sakura Miko');
    $(".name:contains('星街すいせい')").text('Hoshimachi Suisei');
    $(".name:contains('夜空メル')").text('Yozora Mel');
    $(".name:contains('夏色まつり')").text('Natsuiro Matsuri');
    $(".name:contains('白上フブキ')").text('Shirakami Fubuki');
    $(".name:contains('アキロゼ')").text('Aki Rosenthal');
    $(".name:contains('赤井はあと')").text('Akai Haato');
    $(".name:contains('湊あくあ')").text('Minato Aqua');
    $(".name:contains('紫咲シオン')").text('Murasaki Shion');
    $(".name:contains('百鬼あやめ')").text('Nakiri Ayame');
    $(".name:contains('癒月ちょこ')").text('Yuzuki Choco');
    $(".name:contains('大空スバル')").text('Oozora Subaru');
    $(".name:contains('大神ミオ')").text('Ookami Mio');
    $(".name:contains('猫又おかゆ')").text('Nekomata Okayu');
    $(".name:contains('戌神ころね')").text('Inugami Korone');
    $(".name:contains('兎田ぺこら')").text('Usada Pekora');
    $(".name:contains('潤羽るしあ')").text('Uruha Rushia');
    $(".name:contains('不知火フレア')").text('Shiranui Flare');
    $(".name:contains('白銀ノエル')").text('Shirogane Noel');
    $(".name:contains('宝鐘マリン')").text('Houshou Marine');
    $(".name:contains('天音かなた')").text('Amane Kanata');
    $(".name:contains('桐生ココ')").text('Kiryu Coco');
    $(".name:contains('角巻わため')").text('Tsunomaki Watame');
    $(".name:contains('常闇トワ')").text('Tokoyami Towa');
    $(".name:contains('姫森ルーナ')").text('Himemori Luna');
    $(".name:contains('雪花ラミィ')").text('Yukihana Lamy');
    $(".name:contains('桃鈴ねね')").text('Momosuzu Nene');
    $(".name:contains('獅白ぼたん')").text('Shishiro Botan');
    //$(".name:contains('魔乃アロエ')").text('Mano Aloe');
    $(".name:contains('尾丸ポルカ')").text('Omaru Polka');
    //INNK
    //$(".name:contains('')").text('AZKi');
    //hololive CN
    //$(".name:contains('')").text('Yogiri');
    //$(".name:contains('')").text('Civia');
    //$(".name:contains('')").text('Spade Echo');
    //$(".name:contains('')").text('Doris');
    //$(".name:contains('')").text('Rosalyn');
    //$(".name:contains('')").text('Artia');
    //hololive ID
    //$(".name:contains('')").text('Ayunda Risu');
    //$(".name:contains('')").text('Moona Hoshinova');
    //$(".name:contains('')").text('Airani Iofifteen');
    //hololive EN
    //$(".name:contains('Ina')").text('Ninomae Ina'nis');
    //$(".name:contains('Kiara')").text('Takanashi Kiara');
    //$(".name:contains('Amelia')").text('Watson Amelia');
    //$(".name:contains('Calli')").text('Mori Calliope');
    //$(".name:contains('Gura')").text('Gawr Gura');
    //holostars
    $(".name:contains('花咲みやび')").text('Hanasaki Miyabi');
    $(".name:contains('鏡見キラ')").text('Kagami Kira');
    $(".name:contains('奏手イヅル')").text('Kanade Izuru');
    $(".name:contains('アルランディス')").text('Arurandeisu');
    $(".name:contains('律可')").text('Rikka');
    $(".name:contains('アステル・レダ')").text('Astel Leda');
    $(".name:contains('岸堂天真')").text('Kishido Temma');
    $(".name:contains('夕刻ロベル')").text('Yukoku Roberu');
    $(".name:contains('影山シエン')").text('Kageyama Shien');
    $(".name:contains('荒咬オウガ')").text('Aragami Oga');

    //Members Name Translation (Simple Version)
    //hololive
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('ときのそら')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('ときのそら', 'Tokino Sora'));
    });
        $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('ロボ子さん')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('ロボ子さん', 'Roboco'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('さくらみこ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('さくらみこ', 'Sakura Miko'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('星街すいせい')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('星街すいせい', 'Hoshimachi Suisei'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('夜空メル')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('夜空メル', 'Yozora Mel'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('夏色まつり')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('夏色まつり', 'Natsuiro Matsuri'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('白上フブキ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('白上フブキ', 'Shirakami Fubuki'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('アキロゼ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('アキロゼ', 'Aki Rosenthal'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('赤井はあと')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('赤井はあと', 'Akai Haato'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('湊あくあ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('湊あくあ', 'Minato Aqua'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('紫咲シオン')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('紫咲シオン', 'Murasaki Shion'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('百鬼あやめ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('百鬼あやめ', 'Nakiri Ayame'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('癒月ちょこ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('癒月ちょこ', 'Yuzuki Choco'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('大空スバル')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('大空スバル', 'Oozora Subaru'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('大神ミオ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('大神ミオ', 'Ookami Mio'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('猫又おかゆ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('猫又おかゆ', 'Nekomata Okayu'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('戌神ころね')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('戌神ころね', 'Inugami Korone'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('兎田ぺこら')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('兎田ぺこら', 'Usada Pekora'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('潤羽るしあ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('潤羽るしあ', 'Uruha Rushia'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('不知火フレア')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('不知火フレア', 'Shiranui Flare'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('白銀ノエル')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('白銀ノエル', 'Shirogane Noel'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('宝鐘マリン')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('宝鐘マリン', 'Houshou Marine'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('天音かなた')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('天音かなた', 'Amane Kanata'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('桐生ココ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('桐生ココ', 'Kiryu Coco'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('角巻わため')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('角巻わため', 'Tsunomaki Watame'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('常闇トワ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('常闇トワ', 'Tokoyami Towa'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('姫森ルーナ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('姫森ルーナ', 'Himemori Luna'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('雪花ラミィ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('雪花ラミィ', 'Yukihana Lamy'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('桃鈴ねね')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('桃鈴ねね', 'Momosuzu Nene'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('獅白ぼたん')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('獅白ぼたん', 'Shishiro Botan'));
    });
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('魔乃アロエ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('魔乃アロエ', 'Mano Aloe'));
    });*/
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('尾丸ポルカ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('尾丸ポルカ', 'Omaru Polka'));
    });
    //INNK
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('', 'AZKi'));
    });*/
    //hololive CN
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('', 'Yogiri'));
    });*/
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('', 'Civia'));
    });*/
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('', 'Spade Echo'));
    });*/
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('', 'Doris'));
    });*/
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('', 'Rosalyn'));
    });*/
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('', 'Artia'));
    });*/
    //hololive ID
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('', 'Ayunda Risu'));
    });*/
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('', 'Moona Hoshinova'));
    });*/
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('', 'Airani Iofifteen'));
    });*/
    //hololive EN
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('Ina', 'Ninomae Ina'nis'));
    });*/
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('Kiara', 'Takanashi Kiara'));
    });*/
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('Amelia', 'Watson Amelia'));
    });*/
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('Calli', 'Mori Calliope'));
    });*/
    /*$("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('Gura', 'Gawr Gura'));
    });*/
    //holostars
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('花咲みやび')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('花咲みやび', 'Hanasaki Miyabi'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('鏡見キラ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('鏡見キラ', 'Kagami Kira'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('奏手イヅル')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('奏手イヅル', 'Kanade Izuru'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('アルランディス')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('アルランディス', 'Arurandeisu'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('律可')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('律可', 'Rikka'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('アステル・レダ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('アステル・レダ', 'Astel Leda'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('岸堂天真')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('岸堂天真', 'Kishido Temma'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('夕刻ロベル')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('夕刻ロベル', 'Yukoku Roberu'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('影山シエン')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('影山シエン', 'Kageyama Shien'));
    });
    $("div.container > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div > a:nth-child(1):contains('荒咬オウガ')").each(function() {
        var text = $(this).text();
        $(this).text(text.replace('荒咬オウガ', 'Aragami Oga'));
    });

})();
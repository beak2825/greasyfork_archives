// ==UserScript==
// @name       PRsweet
// @namespace  
// @version    0.1.2
// @description  以eddie32前輩製作的『绯月表情增强插件 2.82v6版』為基礎，添加了些自己喜愛的圖片後製成的私人插件。插件內圖片以Kanahei的Pisuke&Rabbit為主題，更多關於Kanahei的資訊可參閱網站www.kanahei.com。本插件與sweet插件不同之處在於，本插件只有Pisuke&Rabbit的圖片。
// @icon        http://nekohand.moe/favicon.ico
// @homepage    https://greasyfork.org/zh-CN/scripts/5124-%E7%BB%AF%E6%9C%88%E8%A1%A8%E6%83%85%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6
// @match       http://*.2dgal.com/read.php?*
// @match       http://*.2dgal.com/post.php?*
// @match       http://*.2dgal.com/message.php?*
// @match       http://2dgal.com/read.php?*
// @match       http://2dgal.com/post.php?*
// @match       http://2dgal.com/message.php?*
// @match       https://sstmlt.net/*
// @match       http://*.9baka.com/*
// @match       http://9baka.com/*
// @match       http://www.mmy.moe/*
// @match       http://www.mddmm.com/*
// @copyright  2014-2015, eddie32
// @grant       none
// @license     MIT
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/12802/PRsweet.user.js
// @updateURL https://update.greasyfork.org/scripts/12802/PRsweet.meta.js
// ==/UserScript==

/* 自定义内容*/

// 功能栏标题

var ItemTitleArray = new Array('PR1', 'PR2', 'PR3','PR4', 'PR other', 'PR kan', 'PR gif', 'PR app 1', 'PR app 2', 'PR app 3', 'PR app 4','PR FB');
// 链接ID, 对应, 100101开始的整数。
var loadTitleArray = [];
var ItemLength = ItemTitleArray.length;
//for(var j=0; j<ItemLength;j++){
  // loadTitleArray[j] = 100101 + j;
//}

var loadTitleArray = new Array(100101, 100102, 100103, 100104, 100105, 100106, 100107, 100108, 100109, 100110, 100111,100112);
                              
//不显示的元素位置
var itemDoNotShow =[];
var user=getCookie("setup");
//alert(user);
var itemDoNotShow = new Array();
if (user != ""){
    // alert(user.split(','));
    itemDoNotShow = user.split(',');
   // alert(itemDoNotShow);
    if(itemDoNotShow.length>0){
        for(var j=0; j<itemDoNotShow.length;j++){
            ItemTitleArray[itemDoNotShow[j]] = undefined;
            loadTitleArray[itemDoNotShow[j]] = undefined;
        }
    }
}



var totalNum = ItemTitleArray.length; // 功能栏数量
var textareas, textarea;
var emptyContainer;
var startPos, endPos; // 当前光标位置定位


/************************** 内置表情 *******************/

// PR 1
var PR1_1 = ['http://i3.imgbus.com/doimg/5scy6uar4a4c19.png'];
var PR1_1Title = [];
var PR1_2 = ['http://i1.imgbus.com/doimg/4say6ucr4ae1a9.png'];
var PR1_2Title = [];
var PR1_3 = ['http://i2.imgbus.com/doimg/8s6y6udr1a3f99.png'];
var PR1_3Title = [];
var PR1_4 = ['http://i3.imgbus.com/doimg/7s8y0u3r4a85c9.png'];
var PR1_4Title = [];
var PR1_5 = ['http://i4.imgbus.com/doimg/8s9yfufr1a85e9.png'];
var PR1_5Title = [];
var PR1_6 = ['http://i3.imgbus.com/doimg/4s0ycu4r7a1a99.png'];
var PR1_6Title = [];
var PR1_7 = ['http://i2.imgbus.com/doimg/5s5y3u3r0a5009.png'];
var PR1_7Title = [];
var PR1_8 = ['http://i3.imgbus.com/doimg/0s3ydu4rdac799.png'];
var PR1_8Title = [];
var PR1_9 = ['http://i4.imgbus.com/doimg/cs5y1uarfaa959.png'];
var PR1_9Title = [];
var PR1_10 = ['http://i1.imgbus.com/doimg/2s8y8u5rdadce9.png'];
var PR1_10Title = [];
var PR1_11 = ['http://i2.imgbus.com/doimg/5sey2u7r4a24c9.png'];
var PR1_11Title = [];
var PR1_12 = ['http://i4.imgbus.com/doimg/3s0yfu8r6aaf80.png'];
var PR1_12Title = [];
var PR1_13 = ['http://i1.imgbus.com/doimg/fscy7u0r4abee0.png'];
var PR1_13Title = [];
var PR1_14 = ['http://i2.imgbus.com/doimg/8scyfucr7ad240.png'];
var PR1_14Title = [];
var PR1_15 = ['http://i4.imgbus.com/doimg/4sfy8u4rfa33f0.png'];
var PR1_15Title = [];
var PR1_16 = ['http://i2.imgbus.com/doimg/2scy2u0rba3ae0.png'];
var PR1_16Title = [];
var PR1_17 = ['http://i3.imgbus.com/doimg/2seycuar4a2bd0.png'];
var PR1_17Title = [];
var PR1_18 = ['http://i3.imgbus.com/doimg/6s2yau8r0a0480.png'];
var PR1_18Title = [];
var PR1_19 = ['http://i1.imgbus.com/doimg/9s2ycudraa56b0.png'];
var PR1_19Title = [];
var PR1_20 = ['http://i1.imgbus.com/doimg/bs0y9u6r8a2b40.png'];
var PR1_20Title = [];
var PR1_21 = ['http://i4.imgbus.com/doimg/9s3y6u5read850.png'];
var PR1_21Title = [];
var PR1_22 = ['http://i1.imgbus.com/doimg/3s1y4u6rbae870.png'];
var PR1_22Title = [];
var PR1_23 = ['http://i2.imgbus.com/doimg/8s2ydu7r8a39f0.png'];
var PR1_23Title = [];
var PR1_24 = ['http://i4.imgbus.com/doimg/5s3y6u1r5a3fb0.png'];
var PR1_24Title = [];
var PR1_25 = ['http://i1.imgbus.com/doimg/dsbydu3rba6540.png'];
var PR1_25Title = [];
var PR1_26 = ['http://i3.imgbus.com/doimg/fsey6uer1aa3e0.png'];
var PR1_26Title = [];
var PR1_27 = ['http://i4.imgbus.com/doimg/8say5u5r1a25d0.png'];
var PR1_27Title = [];
var PR1_28 = ['http://i2.imgbus.com/doimg/fs8y4u3r5adb00.png'];
var PR1_28Title = [];
var PR1_29 = ['http://i3.imgbus.com/doimg/2sdy2udrda2f30.png'];
var PR1_29Title = [];
var PR1_30 = ['http://i4.imgbus.com/doimg/cscy9u4r5a6ad0.png'];
var PR1_30Title = [];
var PR1_31 = ['http://i2.imgbus.com/doimg/1sfy5udr6ae910.png'];
var PR1_31Title = [];
var PR1_32 = ['http://i4.imgbus.com/doimg/bsyburcad644d1.png'];
var PR1_32Title = [];
var PR1_33 = ['http://i4.imgbus.com/doimg/8sy1ur0a65e2c1.png'];
var PR1_33Title = [];
var PR1_34 = ['http://i2.imgbus.com/doimg/2syburda8afc71.png'];
var PR1_34Title = [];
var PR1_35 = ['http://i2.imgbus.com/doimg/0syeur5ab79981.png'];
var PR1_35Title = [];
var PR1_36 = ['http://i1.imgbus.com/doimg/9sy1urda87e501.png'];
var PR1_36Title = [];
var PR1_37 = ['http://i2.imgbus.com/doimg/bsybur7ac970f1.png'];
var PR1_37Title = [];
var PR1_38 = ['http://i3.imgbus.com/doimg/1sycureac0c8b1.png'];
var PR1_38Title = [];
var PR1_39 = ['http://i1.imgbus.com/doimg/2sybur7a51ccf1.png'];
var PR1_39Title = [];
var PR1_40 = ['http://i3.imgbus.com/doimg/9sy7urdaad9db1.png'];
var PR1_40Title = [];



// PR 2
var PR2_1 = ['http://i2.imgbus.com/doimg/0sdy7uer6ac746.png'];
var PR2_1Title = [];
var PR2_2 = ['http://i2.imgbus.com/doimg/es6yfu0reafa76.png'];
var PR2_2Title = [];
var PR2_3 = ['http://i3.imgbus.com/doimg/2s5y0u2r4a3b56.png'];
var PR2_3Title = [];
var PR2_4 = ['http://i2.imgbus.com/doimg/asfy5u2readad6.png'];
var PR2_4Title = [];
var PR2_5 = ['http://i1.imgbus.com/doimg/4s7y3ucrda36d6.png'];
var PR2_5Title = [];
var PR2_6 = ['http://i1.imgbus.com/doimg/9s4y4ubr4a0126.png'];
var PR2_6Title = [];
var PR2_7 = ['http://i4.imgbus.com/doimg/esdyau3r4a19c6.png'];
var PR2_7Title = [];
var PR2_8 = ['http://i3.imgbus.com/doimg/fs4yauar7aed76.png'];
var PR2_8Title = [];
var PR2_9 = ['http://i4.imgbus.com/doimg/as7yfu0r3a1576.png'];
var PR2_9Title = [];
var PR2_10 = ['http://i3.imgbus.com/doimg/bsfy8uarda10e6.png'];
var PR2_10Title = [];
var PR2_11 = ['http://i1.imgbus.com/doimg/fscy4u1r3a7b06.png'];
var PR2_11Title = [];
var PR2_12 = ['http://i2.imgbus.com/doimg/9sfy9u2r6ab2c6.png'];
var PR2_12Title = [];
var PR2_13 = ['http://i4.imgbus.com/doimg/as2ybuer9a2916.png'];
var PR2_13Title = [];
var PR2_14 = ['http://i3.imgbus.com/doimg/5s0y7u4rfa31c6.png'];
var PR2_14Title = [];
var PR2_15 = ['http://i3.imgbus.com/doimg/ds9y8ubrba4ba6.png'];
var PR2_15Title = [];
var PR2_16 = ['http://i1.imgbus.com/doimg/3sbycu1r2aca76.png'];
var PR2_16Title = [];
var PR2_17 = ['http://i4.imgbus.com/doimg/2sy5ur9a405c27.png'];
var PR2_17Title = [];
var PR2_18 = ['http://i3.imgbus.com/doimg/csydurfa0e3bf7.png'];
var PR2_18Title = [];
var PR2_19 = ['http://i1.imgbus.com/doimg/6sy3urca26bfd7.png'];
var PR2_19Title = [];
var PR2_20 = ['http://i2.imgbus.com/doimg/csy1ur8a375de7.png'];
var PR2_20Title = [];
var PR2_21 = ['http://i1.imgbus.com/doimg/9sy0urba9f6697.png'];
var PR2_21Title = [];
var PR2_22 = ['http://i4.imgbus.com/doimg/esy3urda3daab7.png'];
var PR2_22Title = [];
var PR2_23 = ['http://i4.imgbus.com/doimg/8syfuraa75a8f7.png'];
var PR2_23Title = [];
var PR2_24 = ['http://i3.imgbus.com/doimg/dsyburca6b6257.png'];
var PR2_24Title = [];
var PR2_25 = ['http://i4.imgbus.com/doimg/1sy5ur0a4288a7.png'];
var PR2_25Title = [];
var PR2_26 = ['http://i3.imgbus.com/doimg/bsy0uraa356a57.png'];
var PR2_26Title = [];
var PR2_27 = ['http://i4.imgbus.com/doimg/7sy7ur3a0dfde7.png'];
var PR2_27Title = [];
var PR2_28 = ['http://i4.imgbus.com/doimg/bsy1urfa699e97.png'];
var PR2_28Title = [];
var PR2_29 = ['http://i4.imgbus.com/doimg/4sy9urfab8a607.png'];
var PR2_29Title = [];
var PR2_30 = ['http://i1.imgbus.com/doimg/bsybur9a6e4d37.png'];
var PR2_30Title = [];
var PR2_31 = ['http://i4.imgbus.com/doimg/8sy3ur7ab4e6d7.png'];
var PR2_31Title = [];
var PR2_32 = ['http://i1.imgbus.com/doimg/8syaurbaf7bc47.png'];
var PR2_32Title = [];
var PR2_33 = ['http://i1.imgbus.com/doimg/2sy7ureabc3a37.png'];
var PR2_33Title = [];
var PR2_34 = ['http://i3.imgbus.com/doimg/5sy7ur5a528957.png'];
var PR2_34Title = [];
var PR2_35 = ['http://i3.imgbus.com/doimg/0sybur3a233617.png'];
var PR2_35Title = [];
var PR2_36 = ['http://i3.imgbus.com/doimg/0syfur5a123677.png'];
var PR2_36Title = [];
var PR2_37 = ['http://i1.imgbus.com/doimg/4syucracb8caf8.png'];
var PR2_37Title = [];
var PR2_38 = ['http://i2.imgbus.com/doimg/0syu3raa1113f8.png'];
var PR2_38Title = [];
var PR2_39 = ['http://i4.imgbus.com/doimg/5syudra24ce248.png'];
var PR2_39Title = [];
var PR2_40 = ['http://i3.imgbus.com/doimg/fsyu2ra8f6b6c8.png'];
var PR2_40Title = [];



// PR 3
var PR3_1 = ['http://i1.imgbus.com/doimg/bs1yauar4a5d23.png'];
var PR3_1Title = [];
var PR3_2 = ['http://i1.imgbus.com/doimg/2sdy9ucr8ae273.png'];
var PR3_2Title = [];
var PR3_3 = ['http://i1.imgbus.com/doimg/0s8y0uerba9a93.png'];
var PR3_3Title = [];
var PR3_4 = ['http://i3.imgbus.com/doimg/esay9udr6ad5c3.png'];
var PR3_4Title = [];
var PR3_5 = ['http://i4.imgbus.com/doimg/cscy2u4r4acef3.png'];
var PR3_5Title = [];
var PR3_6 = ['http://i2.imgbus.com/doimg/7sey5u5r5a8143.png'];
var PR3_6Title = [];
var PR3_7 = ['http://i2.imgbus.com/doimg/csay2u6r2acfb3.png'];
var PR3_7Title = [];
var PR3_8 = ['http://i4.imgbus.com/doimg/as4y3ufreac743.png'];
var PR3_8Title = [];
var PR3_9 = ['http://i3.imgbus.com/doimg/7s9yeuer6ab703.png'];
var PR3_9Title = [];
var PR3_10 = ['http://i1.imgbus.com/doimg/4s6y4u7r9a1193.png'];
var PR3_10Title = [];
var PR3_11 = ['http://i4.imgbus.com/doimg/fs8yau9r4afb43.png'];
var PR3_11Title = [];
var PR3_12 = ['http://i3.imgbus.com/doimg/0sayauar9a5eb3.png'];
var PR3_12Title = [];
var PR3_13 = ['http://i3.imgbus.com/doimg/fscy6u1r2a6993.png'];
var PR3_13Title = [];
var PR3_14 = ['http://i1.imgbus.com/doimg/3s3y3u7rcaa2e3.png'];
var PR3_14Title = [];
var PR3_15 = ['http://i3.imgbus.com/doimg/5say6ucr0af543.png'];
var PR3_15Title = [];
var PR3_16 = ['http://i3.imgbus.com/doimg/8sy6ur4a42c004.png'];
var PR3_16Title = [];
var PR3_17 = ['http://i4.imgbus.com/doimg/bsyeurda8a01e4.png'];
var PR3_17Title = [];
var PR3_18 = ['http://i2.imgbus.com/doimg/2sy3urda8c15c4.png'];
var PR3_18Title = [];
var PR3_19 = ['http://i2.imgbus.com/doimg/4sy2urca6d1a34.png'];
var PR3_19Title = [];
var PR3_20 = ['http://i2.imgbus.com/doimg/4sydurfa73bd94.png'];
var PR3_20Title = [];
var PR3_21 = ['http://i4.imgbus.com/doimg/bsy0urbacb2304.png'];
var PR3_21Title = [];
var PR3_22 = ['http://i1.imgbus.com/doimg/csycurda7425b4.png'];
var PR3_22Title = [];
var PR3_23 = ['http://i4.imgbus.com/doimg/bsyaurbafa0fe4.png'];
var PR3_23Title = [];
var PR3_24 = ['http://i3.imgbus.com/doimg/7sy5ur3a52b854.png'];
var PR3_24Title = [];
var PR3_25 = ['http://i3.imgbus.com/doimg/fsybur4adf8b74.png'];
var PR3_25Title = [];
var PR3_26 = ['http://i4.imgbus.com/doimg/bsy6ureaf86554.png'];
var PR3_26Title = [];
var PR3_27 = ['http://i1.imgbus.com/doimg/2sy4ur9a700fa4.png'];
var PR3_27Title = [];
var PR3_28 = ['http://i2.imgbus.com/doimg/esycur0a5c72d4.png'];
var PR3_28Title = [];
var PR3_29 = ['http://i3.imgbus.com/doimg/8sybur9af03ee4.png'];
var PR3_29Title = [];
var PR3_30 = ['http://i3.imgbus.com/doimg/9syburea556f14.png'];
var PR3_30Title = [];
var PR3_31 = ['http://i3.imgbus.com/doimg/csy4uraa176104.png'];
var PR3_31Title = [];
var PR3_32 = ['http://i1.imgbus.com/doimg/fsy6ur4aae1824.png'];
var PR3_32Title = [];
var PR3_33 = ['http://i2.imgbus.com/doimg/fsyfur9add90f4.png'];
var PR3_33Title = [];
var PR3_34 = ['http://i3.imgbus.com/doimg/7sydur1a41f684.png'];
var PR3_34Title = [];
var PR3_35 = ['http://i4.imgbus.com/doimg/7sy7uraa88ac64.png'];
var PR3_35Title = [];
var PR3_36 = ['http://i4.imgbus.com/doimg/csy2ur1a4cba64.png'];
var PR3_36Title = [];
var PR3_37 = ['http://i1.imgbus.com/doimg/2syburfa5b1884.png'];
var PR3_37Title = [];
var PR3_38 = ['http://i2.imgbus.com/doimg/7syufra5d87385.png'];
var PR3_38Title = [];
var PR3_39 = ['http://i2.imgbus.com/doimg/2syu7rad0ba7d5.png'];
var PR3_39Title = [];
var PR3_40 = ['http://i4.imgbus.com/doimg/8syuarab929df5.png'];
var PR3_40Title = [];


// PR 4
var PR4_1 = ['http://i2.imgbus.com/doimg/3syuera3f7b858.png'];
var PR4_1Title = [];
var PR4_2 = ['http://i3.imgbus.com/doimg/bsay7u1r3a0439.png'];
var PR4_2Title = [];
var PR4_3 = ['http://i4.imgbus.com/doimg/3s1yfu5rfac7c9.png'];
var PR4_3Title = [];
var PR4_4 = ['http://i2.imgbus.com/doimg/0sby5ufrda99a9.png'];
var PR4_4Title = [];
var PR4_5 = ['http://i2.imgbus.com/doimg/2s3yfufr2a0d59.png'];
var PR4_5Title = [];
var PR4_6 = ['http://i3.imgbus.com/doimg/as2yau3r2a0e19.png'];
var PR4_6Title = [];
var PR4_7 = ['http://i2.imgbus.com/doimg/fs8ycu1r8a3cf9.png'];
var PR4_7Title = [];
var PR4_8 = ['http://i4.imgbus.com/doimg/0s7y9u1rca01d9.png'];
var PR4_8Title = [];
var PR4_9 = ['http://i4.imgbus.com/doimg/9s2ycudr4a25b9.png'];
var PR4_9Title = [];
var PR4_10 = ['http://i2.imgbus.com/doimg/8sdydu0r7a9ed9.png'];
var PR4_10Title = [];
var PR4_11 = ['http://i1.imgbus.com/doimg/bscyducrda5d09.png'];
var PR4_11Title = [];
var PR4_12 = ['http://i2.imgbus.com/doimg/es0yau9r7aa4e9.png'];
var PR4_12Title = [];
var PR4_13 = ['http://i3.imgbus.com/doimg/5s5ydubr0a4489.png'];
var PR4_13Title = [];
var PR4_14 = ['http://i4.imgbus.com/doimg/9s5y8uer9a34b9.png'];
var PR4_14Title = [];
var PR4_15 = ['http://i3.imgbus.com/doimg/dsfyeu4r7aaa99.png'];
var PR4_15Title = [];
var PR4_16 = ['http://i1.imgbus.com/doimg/0s5y3ucraa55e9.png'];
var PR4_16Title = [];
var PR4_17 = ['http://i2.imgbus.com/doimg/fs6y0u9r1af609.png'];
var PR4_17Title = [];
var PR4_18 = ['http://i4.imgbus.com/doimg/2s7y5u7rda52a9.png'];
var PR4_18Title = [];
var PR4_19 = ['http://i2.imgbus.com/doimg/esdycuar9aeb70.png'];
var PR4_19Title = [];
var PR4_20 = ['http://i1.imgbus.com/doimg/1sdy1udr8a7780.png'];
var PR4_20Title = [];
var PR4_21 = ['http://i2.imgbus.com/doimg/4sdybudrca5920.png'];
var PR4_21Title = [];
var PR4_22 = ['http://i3.imgbus.com/doimg/es8y2u1rda4c10.png'];
var PR4_22Title = [];
var PR4_23 = ['http://i2.imgbus.com/doimg/7seycucr5ab0d0.png'];
var PR4_23Title = [];
var PR4_24 = ['http://i4.imgbus.com/doimg/3s4y4u0rea7e60.png'];
var PR4_24Title = [];
var PR4_25 = ['http://i2.imgbus.com/doimg/5s9yeu5raad8f0.png'];
var PR4_25Title = [];
var PR4_26 = ['http://i4.imgbus.com/doimg/1s0yfu4rfab620.png'];
var PR4_26Title = [];
var PR4_27 = ['http://i3.imgbus.com/doimg/2s0y1u2r9ac6f0.png'];
var PR4_27Title = [];
var PR4_28 = ['http://i4.imgbus.com/doimg/cs2ybu0r2a7120.png'];
var PR4_28Title = [];
var PR4_29 = ['http://i2.imgbus.com/doimg/6s5ycu6r8a5b80.png'];
var PR4_29Title = [];
var PR4_30 = ['http://i1.imgbus.com/doimg/3s9y9udrcae970.png'];
var PR4_30Title = [];
var PR4_31 = ['http://i2.imgbus.com/doimg/6scy8u5r7a1080.png'];
var PR4_31Title = [];
var PR4_32 = ['http://i1.imgbus.com/doimg/8s2y0u4r9a44f0.png'];
var PR4_32Title = [];
var PR4_33 = ['http://i2.imgbus.com/doimg/ds0y7u6r2a89e0.png'];
var PR4_33Title = [];
var PR4_34 = ['http://i3.imgbus.com/doimg/5s1ybufr4aa2b0.png'];
var PR4_34Title = [];
var PR4_35 = ['http://i2.imgbus.com/doimg/bsbydu2r5a7080.png'];
var PR4_35Title = [];
var PR4_36 = ['http://i3.imgbus.com/doimg/es2y2u2r9a7750.png'];
var PR4_36Title = [];
var PR4_37 = ['http://i1.imgbus.com/doimg/es1yeu1reaf180.png'];
var PR4_37Title = [];
var PR4_38 = ['http://i3.imgbus.com/doimg/2sy0ureaf81811.png'];
var PR4_38Title = [];
var PR4_39 = ['http://i1.imgbus.com/doimg/esydur4a271181.png'];
var PR4_39Title = [];
var PR4_40 = ['http://i3.imgbus.com/doimg/fsy9ur9a5616e1.png'];
var PR4_40Title = [];



// PR other
var PRo_1 = ['http://i1.imgbus.com/doimg/8s1y2u6r7a2a60.png'];
var PRo_1Title = [];
var PRo_2 = ['http://i2.imgbus.com/doimg/6s0y2ubr6a53e0.png'];
var PRo_2Title = [];
var PRo_3 = ['http://i4.imgbus.com/doimg/ds7y5u8rfa6420.png'];
var PRo_3Title = [];
var PRo_4 = ['http://i4.imgbus.com/doimg/5s5y0u3rbabbf0.png'];
var PRo_4Title = [];
var PRo_5 = ['http://i2.imgbus.com/doimg/6scyaueraaadf0.png'];
var PRo_5Title = [];
var PRo_6 = ['http://i3.imgbus.com/doimg/6s0y9udr0a8a60.png'];
var PRo_6Title = [];
var PRo_7 = ['http://i4.imgbus.com/doimg/fsdy7uar8aaa90.png'];
var PRo_7Title = [];
var PRo_8 = ['http://i1.imgbus.com/doimg/6s9y9ufread950.png'];
var PRo_8Title = [];
var PRo_9 = ['http://i1.imgbus.com/doimg/1s8y1udr6a7eb0.png'];
var PRo_9Title = [];
var PRo_10 = ['http://i2.imgbus.com/doimg/7s0yeu3rda3c10.png'];
var PRo_10Title = [];
var PRo_11 = ['http://i3.imgbus.com/doimg/5s3y5uer6a6710.png'];
var PRo_11Title = [];
var PRo_12 = ['http://i3.imgbus.com/doimg/bsy9uraa89b261.png'];
var PRo_12Title = [];
var PRo_13 = ['http://i3.imgbus.com/doimg/dsy8ur8a016e41.png'];
var PRo_13Title = [];
var PRo_14 = ['http://i3.imgbus.com/doimg/asy9urca53fb91.png'];
var PRo_14Title = [];
var PRo_15 = ['http://i3.imgbus.com/doimg/bsycur6a7b84a1.png'];
var PRo_15Title = [];
var PRo_16 = ['http://i2.imgbus.com/doimg/6sycur2a0dfaf1.png'];
var PRo_16Title = [];
var PRo_17 = ['http://i3.imgbus.com/doimg/5sy0uraa3258a1.png'];
var PRo_17Title = [];
var PRo_18 = ['http://i3.imgbus.com/doimg/2sy2ur8aa9ae91.png'];
var PRo_18Title = [];
var PRo_19 = ['http://i4.imgbus.com/doimg/7sybur3a338b91.png'];
var PRo_19Title = [];
var PRo_20 = ['http://i1.imgbus.com/doimg/4sy0ur3a6a5201.png'];
var PRo_20Title = [];
var PRo_21 = ['http://i2.imgbus.com/doimg/8sy4ur6a0e2491.png'];
var PRo_21Title = [];
var PRo_22 = ['http://i1.imgbus.com/doimg/3sydurfacb1d51.png'];
var PRo_22Title = [];
var PRo_23 = ['http://i4.imgbus.com/doimg/2sy3ur2a6e5401.png'];
var PRo_23Title = [];
var PRo_24 = ['http://i1.imgbus.com/doimg/6syaur8aef4d61.png'];
var PRo_24Title = [];
var PRo_25 = ['http://i2.imgbus.com/doimg/asyfur2a692ba1.png'];
var PRo_25Title = [];
var PRo_26 = ['http://i4.imgbus.com/doimg/4sy2urda6a7051.png'];
var PRo_26Title = [];
var PRo_27 = ['http://i3.imgbus.com/doimg/7syfurfaaa6af1.png'];
var PRo_27Title = [];
var PRo_28 = ['http://i1.imgbus.com/doimg/2sy1ur7a5de1b1.png'];
var PRo_28Title = [];
var PRo_29 = ['http://i2.imgbus.com/doimg/8sy8uraa712721.png'];
var PRo_29Title = [];
var PRo_30 = ['http://i2.imgbus.com/doimg/9sy8urcae6d881.png'];
var PRo_30Title = [];
var PRo_31 = ['http://i3.imgbus.com/doimg/asy0ur9a471011.png'];
var PRo_31Title = [];
var PRo_32 = ['http://i4.imgbus.com/doimg/7sy7urfa2dfae1.png'];
var PRo_32Title = [];
var PRo_33 = ['http://i1.imgbus.com/doimg/esydurea6a23d1.png'];
var PRo_33Title = [];
var PRo_34 = ['http://i2.imgbus.com/doimg/5sy7ur6a8cc861.png'];
var PRo_34Title = [];
var PRo_35 = ['http://i3.imgbus.com/doimg/6syu7raa21f372.png'];
var PRo_35Title = [];
var PRo_36 = ['http://i2.imgbus.com/doimg/bsyu8ra16d9162.png'];
var PRo_36Title = [];
var PRo_37 = ['http://i1.imgbus.com/doimg/0syuera80f6dd2.png'];
var PRo_37Title = [];
var PRo_38 = ['http://i2.imgbus.com/doimg/5syu9ra8075cb2.png'];
var PRo_38Title = [];
var PRo_39 = ['http://i3.imgbus.com/doimg/csyuera21135b2.png'];
var PRo_39Title = [];
var PRo_40 = ['http://i1.imgbus.com/doimg/7syu7ra82c6222.png'];
var PRo_40Title = [];
var PRo_41 = ['http://i4.imgbus.com/doimg/bsyucra20561f2.png'];
var PRo_41Title = [];
var PRo_42 = ['http://i4.imgbus.com/doimg/5syu8raddf6312.png'];
var PRo_42Title = [];
var PRo_43 = ['http://i3.imgbus.com/doimg/bsyu6rab5747e2.png'];
var PRo_43Title = [];
var PRo_44 = ['http://i4.imgbus.com/doimg/2s9y3u9rcacb86.png'];
var PRo_44Title = [];
var PRo_45 = ['http://i2.imgbus.com/doimg/dsy5ur8a139227.png'];
var PRo_45Title = [];
var PRo_46 = ['http://i2.imgbus.com/doimg/asy6ur6ac8c457.png'];
var PRo_46Title = [];
var PRo_47 = ['http://i3.imgbus.com/doimg/8syburda274ab7.png'];
var PRo_47Title = [];
var PRo_48 = ['http://i1.imgbus.com/doimg/fsy3urfa9e7127.png'];
var PRo_48Title = [];
var PRo_49 = ['http://i2.imgbus.com/doimg/esy0ur7ad6c337.png'];
var PRo_49Title = [];
var PRo_50 = ['http://i2.imgbus.com/doimg/7sy3ur5aa9a267.png'];
var PRo_50Title = [];
var PRo_51 = ['http://i3.imgbus.com/doimg/6sy5ur7a5741c7.png'];
var PRo_51Title = [];
var PRo_52 = ['http://i1.imgbus.com/doimg/2sy3ur2a4fdd57.png'];
var PRo_52Title = [];
var PRo_53 = ['http://i4.imgbus.com/doimg/9syeur2a6b63e7.png'];
var PRo_53Title = [];
var PRo_54 = ['http://i1.imgbus.com/doimg/1sy7ur7a63b717.png'];
var PRo_54Title = [];
var PRo_55 = ['http://i1.imgbus.com/doimg/1sy8ur7ac076a7.png'];
var PRo_55Title = [];
var PRo_56 = ['http://i3.imgbus.com/doimg/0sy9urfadd4467.png'];
var PRo_56Title = [];
var PRo_57 = ['http://i4.imgbus.com/doimg/7syfur9a843ac7.png'];
var PRo_57Title = [];
var PRo_58 = ['http://i4.imgbus.com/doimg/4sy4ur3a140f37.png'];
var PRo_58Title = [];
var PRo_59 = ['http://i1.imgbus.com/doimg/esy1ur4af21ea7.png'];
var PRo_59Title = [];



// PR Kan

var PRkan1_1 = ['http://i1.imgbus.com/doimg/2syu4ra4fad9f2.png'];
var PRkan1_1Title = [];
var PRkan1_2 = ['http://i4.imgbus.com/doimg/dsyu7rae164302.png'];
var PRkan1_2Title = [];
var PRkan1_3 = ['http://i3.imgbus.com/doimg/bsyuerac9c76a2.png'];
var PRkan1_3Title = [];
var PRkan1_4 = ['http://i2.imgbus.com/doimg/esyudra87e3052.png'];
var PRkan1_4Title = [];
var PRkan1_5 = ['http://i1.imgbus.com/doimg/esyuara623f9a2.png'];
var PRkan1_5Title = [];
var PRkan1_6 = ['http://i1.imgbus.com/doimg/7syubraf39e322.png'];
var PRkan1_6Title = [];
var PRkan1_7 = ['http://i2.imgbus.com/doimg/9syu9ra8a09ba2.png'];
var PRkan1_7Title = [];
var PRkan1_8 = ['http://i4.imgbus.com/doimg/csyubra51df202.png'];
var PRkan1_8Title = [];
var PRkan1_9 = ['http://i2.imgbus.com/doimg/9syubraafcbf82.png'];
var PRkan1_9Title = [];
var PRkan1_10 = ['http://i3.imgbus.com/doimg/bsyu7ra890c7b2.png'];
var PRkan1_10Title = [];
var PRkan1_11 = ['http://i2.imgbus.com/doimg/fsyu1raef935a2.png'];
var PRkan1_11Title = [];
var PRkan1_12 = ['http://i1.imgbus.com/doimg/8syu9raddb8292.png'];
var PRkan1_12Title = [];
var PRkan1_13 = ['http://i1.imgbus.com/doimg/7syu5rab567bb2.png'];
var PRkan1_13Title = [];
var PRkan1_14 = ['http://i3.imgbus.com/doimg/1syu3rafcc6332.png'];
var PRkan1_14Title = [];
var PRkan1_15 = ['http://i4.imgbus.com/doimg/csyuera5e466d2.png'];
var PRkan1_15Title = [];
var PRkan1_16 = ['http://i4.imgbus.com/doimg/fscyau2r3ae573.png'];
var PRkan1_16Title = [];
var PRkan1_17 = ['http://i2.imgbus.com/doimg/3sfyduer1a56f3.png'];
var PRkan1_17Title = [];
var PRkan1_18 = ['http://i2.imgbus.com/doimg/7s6y0ufreaa673.png'];
var PRkan1_18Title = [];
var PRkan1_19 = ['http://i2.imgbus.com/doimg/3s5y8uar8ac013.png'];
var PRkan1_19Title = [];
var PRkan1_20 = ['http://i4.imgbus.com/doimg/cscy8udr5ac7c3.png'];
var PRkan1_20Title = [];
var PRkan1_21 = ['http://i3.imgbus.com/doimg/2sfy1u1rfa8153.png'];
var PRkan1_21Title = [];
var PRkan1_22 = ['http://i3.imgbus.com/doimg/1s1yeu6r4a2143.png'];
var PRkan1_22Title = [];
var PRkan1_23 = ['http://i3.imgbus.com/doimg/3s6y2ucr3aabf3.png'];
var PRkan1_23Title = [];
var PRkan1_24 = ['http://i2.imgbus.com/doimg/4sby5u2r9a0873.png'];
var PRkan1_24Title = [];
var PRkan1_25 = ['http://i2.imgbus.com/doimg/4s2y4ufr7ab473.png'];
var PRkan1_25Title = [];
var PRkan1_26 = ['http://i1.imgbus.com/doimg/bs0yfuaraa6d33.png'];
var PRkan1_26Title = [];
var PRkan1_27 = ['http://i4.imgbus.com/doimg/bsdyfu4r0a6e43.png'];
var PRkan1_27Title = [];
var PRkan1_28 = ['http://i4.imgbus.com/doimg/es4y6u2r8a7e13.png'];
var PRkan1_28Title = [];
var PRkan1_29 = ['http://i2.imgbus.com/doimg/as8yau1r7a1dc3.png'];
var PRkan1_29Title = [];
var PRkan1_30 = ['http://i1.imgbus.com/doimg/8s7ybu7r8a9053.png'];
var PRkan1_30Title = [];
var PRkan1_31 = ['http://i3.imgbus.com/doimg/9sbyaucr1aea43.png'];
var PRkan1_31Title = [];
var PRkan1_32 = ['http://i4.imgbus.com/doimg/es6y2u8r9ae0c3.png'];
var PRkan1_32Title = [];
var PRkan1_33 = ['http://i4.imgbus.com/doimg/5s2ycu3r4a5913.png'];
var PRkan1_33Title = [];
var PRkan1_34 = ['http://i3.imgbus.com/doimg/1s7ycu3raa6f83.png'];
var PRkan1_34Title = [];
var PRkan1_35 = ['http://i4.imgbus.com/doimg/bs3yau5raa51b3.png'];
var PRkan1_35Title = [];
var PRkan1_36 = ['http://i3.imgbus.com/doimg/ds0y6u8r5a4eb3.png'];
var PRkan1_36Title = [];
var PRkan1_37 = ['http://i1.imgbus.com/doimg/dsyfureade90e4.png'];
var PRkan1_37Title = [];
var PRkan1_38 = ['http://i2.imgbus.com/doimg/csy2ur5a9a0b04.png'];
var PRkan1_38Title = [];
var PRkan1_39 = ['http://i4.imgbus.com/doimg/csy8ur6a3f2b44.png'];
var PRkan1_39Title = [];
var PRkan1_40 = ['http://i3.imgbus.com/doimg/9sy2ureab72344.png'];
var PRkan1_40Title = [];


// PR gif

var PRgif_1 = ['http://i1.imgbus.com/doimg/bsy7ur0ab228e4.gif'];
var PRgif_1Title = [];
var PRgif_2 = ['http://i2.imgbus.com/doimg/esyduraa43da44.gif'];
var PRgif_2Title = [];
var PRgif_3 = ['http://i2.imgbus.com/doimg/csyeur6a97ebc4.gif'];
var PRgif_3Title = [];
var PRgif_4 = ['http://i3.imgbus.com/doimg/fsybur8a3a89e4.gif'];
var PRgif_4Title = [];
var PRgif_5 = ['http://i4.imgbus.com/doimg/4sydur8ade8444.gif'];
var PRgif_5Title = [];
var PRgif_6 = ['http://i4.imgbus.com/doimg/csy5uraa5912a4.gif'];
var PRgif_6Title = [];
var PRgif_7 = ['http://i2.imgbus.com/doimg/2sycurea37bda4.gif'];
var PRgif_7Title = [];
var PRgif_8 = ['http://i1.imgbus.com/doimg/3sy2urfa31ae04.gif'];
var PRgif_8Title = [];
var PRgif_9 = ['http://i2.imgbus.com/doimg/5sy5uraaf57c74.gif'];
var PRgif_9Title = [];
var PRgif_10 = ['http://i2.imgbus.com/doimg/0sy2uraa6153f4.gif'];
var PRgif_10Title = [];
var PRgif_11 = ['http://i3.imgbus.com/doimg/asydurdacb3704.gif'];
var PRgif_11Title = [];
var PRgif_12 = ['http://i2.imgbus.com/doimg/7sy3ur1acdf134.gif'];
var PRgif_12Title = [];
var PRgif_13 = ['http://i4.imgbus.com/doimg/4sy0ur4a298234.gif'];
var PRgif_13Title = [];
var PRgif_14 = ['http://i4.imgbus.com/doimg/6syeurca1ae0a4.gif'];
var PRgif_14Title = [];
var PRgif_15 = ['http://i4.imgbus.com/doimg/8sy6ur1a2a9744.gif'];
var PRgif_15Title = [];
var PRgif_16 = ['http://i1.imgbus.com/doimg/2sy9ur2a2c04b4.gif'];
var PRgif_16Title = [];
var PRgif_17 = ['http://i2.imgbus.com/doimg/1sy3ur7a84c014.gif'];
var PRgif_17Title = [];
var PRgif_18 = ['http://i4.imgbus.com/doimg/esyu8raae22225.gif'];
var PRgif_18Title = [];
var PRgif_19 = ['http://i1.imgbus.com/doimg/dsyu3raa0b5685.gif'];
var PRgif_19Title = [];
var PRgif_20 = ['http://i1.imgbus.com/doimg/0syu4ra16d1835.gif'];
var PRgif_20Title = [];
var PRgif_21 = ['http://i4.imgbus.com/doimg/bsyucra53a1535.gif'];
var PRgif_21Title = [];
var PRgif_22 = ['http://i1.imgbus.com/doimg/5syudrae01ed35.gif'];
var PRgif_22Title = [];
var PRgif_23 = ['http://i3.imgbus.com/doimg/dsyu7ra80286b5.gif'];
var PRgif_23Title = [];
var PRgif_24 = ['http://i1.imgbus.com/doimg/esyudra12560b5.gif'];
var PRgif_24Title = [];
var PRgif_25 = ['http://i1.imgbus.com/doimg/csyu9rac7112f5.gif'];
var PRgif_25Title = [];
var PRgif_26 = ['http://i3.imgbus.com/doimg/csyu6raf29cda5.gif'];
var PRgif_26Title = [];
var PRgif_27 = ['http://i3.imgbus.com/doimg/3syu0ra59bfe55.gif'];
var PRgif_27Title = [];
var PRgif_28 = ['http://i4.imgbus.com/doimg/3syucra02a4f05.gif'];
var PRgif_28Title = [];
var PRgif_29 = ['http://i4.imgbus.com/doimg/0syuarae0b5e05.gif'];
var PRgif_29Title = [];
var PRgif_30 = ['http://i1.imgbus.com/doimg/esyu0ra7d3edb5.gif'];
var PRgif_30Title = [];


// PR app INTER

var PRappINTER_1 = ['http://i4.imgbus.com/doimg/esyudraf93f412.png'];
var PRappINTER_1Title = [];
var PRappINTER_2 = ['http://i4.imgbus.com/doimg/5syubra90d0492.png'];
var PRappINTER_2Title = [];
var PRappINTER_3 = ['http://i2.imgbus.com/doimg/4syuara11c72b2.png'];
var PRappINTER_3Title = [];
var PRappINTER_4 = ['http://i1.imgbus.com/doimg/bsyu1raaeda782.png'];
var PRappINTER_4Title = [];
var PRappINTER_5 = ['http://i1.imgbus.com/doimg/8syu9ra95f4dd2.png'];
var PRappINTER_5Title = [];
var PRappINTER_6 = ['http://i3.imgbus.com/doimg/6syu5rab530cf2.png'];
var PRappINTER_6Title = [];
var PRappINTER_7 = ['http://i4.imgbus.com/doimg/1syudraa17d482.png'];
var PRappINTER_7Title = [];
var PRappINTER_8 = ['http://i1.imgbus.com/doimg/4syu0race3fbd2.png'];
var PRappINTER_8Title = [];
var PRappINTER_9 = ['http://i2.imgbus.com/doimg/5syu4rab30aca2.png'];
var PRappINTER_9Title = [];
var PRappINTER_10 = ['http://i1.imgbus.com/doimg/4saydu4rfaf143.png'];
var PRappINTER_10Title = [];
var PRappINTER_11 = ['http://i4.imgbus.com/doimg/7s4ydu5rba18e3.png'];
var PRappINTER_11Title = [];
var PRappINTER_12 = ['http://i4.imgbus.com/doimg/0s8y0u8rea6ee3.png'];
var PRappINTER_12Title = [];
var PRappINTER_13 = ['http://i1.imgbus.com/doimg/5sey3u5raa2f93.png'];
var PRappINTER_13Title = [];
var PRappINTER_14 = ['http://i2.imgbus.com/doimg/escy5u3r2a68e3.png'];
var PRappINTER_14Title = [];
var PRappINTER_15 = ['http://i2.imgbus.com/doimg/0say6ucr6a87e3.png'];
var PRappINTER_15Title = [];
var PRappINTER_16 = ['http://i1.imgbus.com/doimg/4scy6uer7a18d3.png'];
var PRappINTER_16Title = [];
var PRappINTER_17 = ['http://i3.imgbus.com/doimg/4s9y0u7rbaed23.png'];
var PRappINTER_17Title = [];
var PRappINTER_18 = ['http://i3.imgbus.com/doimg/7s7y1u8rcaaf33.png'];
var PRappINTER_18Title = [];
var PRappINTER_19 = ['http://i4.imgbus.com/doimg/7s7yeu6r5a6a03.png'];
var PRappINTER_19Title = [];
var PRappINTER_20 = ['http://i3.imgbus.com/doimg/0sby8ubr4a7243.png'];
var PRappINTER_20Title = [];
var PRappINTER_21 = ['http://i3.imgbus.com/doimg/fs7y1uer9aac13.png'];
var PRappINTER_21Title = [];
var PRappINTER_22 = ['http://i4.imgbus.com/doimg/cs8y1u1r2a1783.png'];
var PRappINTER_22Title = [];
var PRappINTER_23 = ['http://i1.imgbus.com/doimg/dsay4u8r5a6523.png'];
var PRappINTER_23Title = [];
var PRappINTER_24 = ['http://i3.imgbus.com/doimg/fsfy4u3r1aa5d3.png'];
var PRappINTER_24Title = [];
var PRappINTER_25 = ['http://i4.imgbus.com/doimg/fsdy7uer7a9693.png'];
var PRappINTER_25Title = [];
var PRappINTER_26 = ['http://i4.imgbus.com/doimg/asy8ur7ab14a64.png'];
var PRappINTER_26Title = [];
var PRappINTER_27 = ['http://i1.imgbus.com/doimg/4sy8ur9a09afd4.png'];
var PRappINTER_27Title = [];
var PRappINTER_28 = ['http://i2.imgbus.com/doimg/fsydur0ad495c4.png'];
var PRappINTER_28Title = [];
var PRappINTER_29 = ['http://i3.imgbus.com/doimg/9sy1ur4a94fb44.png'];
var PRappINTER_29Title = [];
var PRappINTER_30 = ['http://i3.imgbus.com/doimg/9sy3urcab5abb4.png'];
var PRappINTER_30Title = [];
var PRappINTER_31 = ['http://i3.imgbus.com/doimg/7sy6urbab73a94.png'];
var PRappINTER_31Title = [];


// PR app ME

var PRappME_1 = ['http://i1.imgbus.com/doimg/5sfyauer6a6ff9.png'];
var PRappME_1Title = [];
var PRappME_2 = ['http://i1.imgbus.com/doimg/2sby2udrbafe69.png'];
var PRappME_2Title = [];
var PRappME_3 = ['http://i1.imgbus.com/doimg/9s6yau1r3a5ea9.png'];
var PRappME_3Title = [];
var PRappME_4 = ['http://i4.imgbus.com/doimg/esay4u3rcaf479.png'];
var PRappME_4Title = [];
var PRappME_5 = ['http://i3.imgbus.com/doimg/7s2yfu3r1a1819.png'];
var PRappME_5Title = [];
var PRappME_6 = ['http://i4.imgbus.com/doimg/4s0y8ufrbab619.png'];
var PRappME_6Title = [];
var PRappME_7 = ['http://i2.imgbus.com/doimg/4s0y3u0r6a1cc9.png'];
var PRappME_7Title = [];
var PRappME_8 = ['http://i1.imgbus.com/doimg/csbyeucr9a6b99.png'];
var PRappME_8Title = [];
var PRappME_9 = ['http://i2.imgbus.com/doimg/1s5yfufr1aa979.png'];
var PRappME_9Title = [];
var PRappME_10 = ['http://i1.imgbus.com/doimg/3s4y4u5rfa0099.png'];
var PRappME_10Title = [];
var PRappME_11 = ['http://i4.imgbus.com/doimg/2s1y8ucr3a16e9.png'];
var PRappME_11Title = [];
var PRappME_12 = ['http://i3.imgbus.com/doimg/cs2ycu3rda4449.png'];
var PRappME_12Title = [];
var PRappME_13 = ['http://i2.imgbus.com/doimg/5s1ydu4rba6510.png'];
var PRappME_13Title = [];
var PRappME_14 = ['http://i2.imgbus.com/doimg/5sdy2ubr5a7f90.png'];
var PRappME_14Title = [];
var PRappME_15 = ['http://i3.imgbus.com/doimg/7sdy0ufr5a9d10.png'];
var PRappME_15Title = [];
var PRappME_16 = ['http://i1.imgbus.com/doimg/as5y9u6rca5a40.png'];
var PRappME_16Title = [];
var PRappME_17 = ['http://i3.imgbus.com/doimg/5s0y7u3raa98d0.png'];
var PRappME_17Title = [];
var PRappME_18 = ['http://i1.imgbus.com/doimg/cs4yducr5a2dd0.png'];
var PRappME_18Title = [];
var PRappME_19 = ['http://i4.imgbus.com/doimg/5s7y9ucreac3e0.png'];
var PRappME_19Title = [];
var PRappME_20 = ['http://i2.imgbus.com/doimg/2s0yduer5ae600.png'];
var PRappME_20Title = [];
var PRappME_21 = ['http://i3.imgbus.com/doimg/1sey8u0raa1c60.png'];
var PRappME_21Title = [];
var PRappME_22 = ['http://i3.imgbus.com/doimg/ascyeu5rcaf020.png'];
var PRappME_22Title = [];
var PRappME_23 = ['http://i3.imgbus.com/doimg/6sby7ucr0a1b90.png'];
var PRappME_23Title = [];
var PRappME_24 = ['http://i4.imgbus.com/doimg/bs7y5ufrda32e0.png'];
var PRappME_24Title = [];
var PRappME_25 = ['http://i2.imgbus.com/doimg/4s1yau0r1aee90.png'];
var PRappME_25Title = [];
var PRappME_26 = ['http://i1.imgbus.com/doimg/ds9y0u5r7a1240.png'];
var PRappME_26Title = [];
var PRappME_27 = ['http://i4.imgbus.com/doimg/cscyfu9rfa2ae0.png'];
var PRappME_27Title = [];
var PRappME_28 = ['http://i3.imgbus.com/doimg/as9ycu3r4ae980.png'];
var PRappME_28Title = [];
var PRappME_29 = ['http://i1.imgbus.com/doimg/9s0yeu3r9a0b10.png'];
var PRappME_29Title = [];
var PRappME_30 = ['http://i1.imgbus.com/doimg/4sbydu1r2a2cc0.png'];
var PRappME_30Title = [];
var PRappME_31 = ['http://i1.imgbus.com/doimg/5scyeu8raab1e0.png'];
var PRappME_31Title = [];
var PRappME_32 = ['http://i1.imgbus.com/doimg/8syburda069d91.png'];
var PRappME_32Title = [];
var PRappME_33 = ['http://i4.imgbus.com/doimg/7syeurcaf5b1d1.png'];
var PRappME_33Title = [];
var PRappME_34 = ['http://i1.imgbus.com/doimg/1sy9urba660d61.png'];
var PRappME_34Title = [];
var PRappME_35 = ['http://i4.imgbus.com/doimg/6sybur2a880251.png'];
var PRappME_35Title = [];
var PRappME_36 = ['http://i4.imgbus.com/doimg/csyaurca8ff931.png'];
var PRappME_36Title = [];
var PRappME_37 = ['http://i3.imgbus.com/doimg/6sy1urda3a58d1.png'];
var PRappME_37Title = [];
var PRappME_38 = ['http://i3.imgbus.com/doimg/7syaur4a74c6e1.png'];
var PRappME_38Title = [];
var PRappME_39 = ['http://i3.imgbus.com/doimg/9sy2ur1a2797b1.png'];
var PRappME_39Title = [];
var PRappME_40 = ['http://i3.imgbus.com/doimg/dsy9ur6aef3b91.png'];
var PRappME_40Title = [];
var PRappME_41 = ['http://i4.imgbus.com/doimg/dsybureabba021.png'];
var PRappME_41Title = [];
var PRappME_42 = ['http://i3.imgbus.com/doimg/fsy2ur6a5e5961.png'];
var PRappME_42Title = [];
var PRappME_43 = ['http://i3.imgbus.com/doimg/0sy3ur6a835271.png'];
var PRappME_43Title = [];
var PRappME_44 = ['http://i1.imgbus.com/doimg/7sy4ur3a354021.png'];
var PRappME_44Title = [];
var PRappME_45 = ['http://i4.imgbus.com/doimg/6sy3uraacdd231.png'];
var PRappME_45Title = [];
var PRappME_46 = ['http://i1.imgbus.com/doimg/6sy5urcaa9be21.png'];
var PRappME_46Title = [];
var PRappME_47 = ['http://i3.imgbus.com/doimg/0syeur0ae443b1.png'];
var PRappME_47Title = [];
var PRappME_48 = ['http://i3.imgbus.com/doimg/bsyeur0a7d2cc1.png'];
var PRappME_48Title = [];
var PRappME_49 = ['http://i2.imgbus.com/doimg/2sy3ur7ae261e1.png'];
var PRappME_49Title = [];
var PRappME_50 = ['http://i3.imgbus.com/doimg/esydur7ad25de1.png'];
var PRappME_50Title = [];
var PRappME_51 = ['http://i4.imgbus.com/doimg/4syu9ra22284b2.png'];
var PRappME_51Title = [];
var PRappME_52 = ['http://i1.imgbus.com/doimg/9syudraabf3fb2.png'];
var PRappME_52Title = [];
var PRappME_53 = ['http://i3.imgbus.com/doimg/fsyu9ra99267e2.png'];
var PRappME_53Title = [];
var PRappME_54 = ['http://i2.imgbus.com/doimg/8syu1racc342a2.png'];
var PRappME_54Title = [];
var PRappME_55 = ['http://i2.imgbus.com/doimg/9syueradf0e592.png'];
var PRappME_55Title = [];


// PR app WeSe

var PRappWeSe_1 = ['http://i4.imgbus.com/doimg/0syu0ra0ab46c5.png'];
var PRappWeSe_1Title = [];
var PRappWeSe_2 = ['http://i1.imgbus.com/doimg/4syucra4a7b265.png'];
var PRappWeSe_2Title = [];
var PRappWeSe_3 = ['http://i2.imgbus.com/doimg/7syudrabfe34c5.png'];
var PRappWeSe_3Title = [];
var PRappWeSe_4 = ['http://i3.imgbus.com/doimg/2syu5raa668f15.png'];
var PRappWeSe_4Title = [];
var PRappWeSe_5 = ['http://i2.imgbus.com/doimg/0syudra98bfbe5.png'];
var PRappWeSe_5Title = [];
var PRappWeSe_6 = ['http://i3.imgbus.com/doimg/5syueraecc4505.png'];
var PRappWeSe_6Title = [];
var PRappWeSe_7 = ['http://i4.imgbus.com/doimg/5syu6ra2739cb5.png'];
var PRappWeSe_7Title = [];
var PRappWeSe_8 = ['http://i1.imgbus.com/doimg/0syu3ra158e545.png'];
var PRappWeSe_8Title = [];
var PRappWeSe_9 = ['http://i3.imgbus.com/doimg/5syu4ra6a71fd5.png'];
var PRappWeSe_9Title = [];
var PRappWeSe_10 = ['http://i4.imgbus.com/doimg/4syu8ra7f4c5d5.png'];
var PRappWeSe_10Title = [];
var PRappWeSe_11 = ['http://i3.imgbus.com/doimg/csyu8ra1f187e5.png'];
var PRappWeSe_11Title = [];
var PRappWeSe_12 = ['http://i3.imgbus.com/doimg/9syucra98750a5.png'];
var PRappWeSe_12Title = [];
var PRappWeSe_13 = ['http://i1.imgbus.com/doimg/8syu4ra09f31f5.png'];
var PRappWeSe_13Title = [];
var PRappWeSe_14 = ['http://i3.imgbus.com/doimg/1syudra8000fe5.png'];
var PRappWeSe_14Title = [];
var PRappWeSe_15 = ['http://i2.imgbus.com/doimg/esyu1rad8b8c45.png'];
var PRappWeSe_15Title = [];
var PRappWeSe_16 = ['http://i4.imgbus.com/doimg/6syu1ra5623b45.png'];
var PRappWeSe_16Title = [];
var PRappWeSe_17 = ['http://i4.imgbus.com/doimg/0syu9raf337225.png'];
var PRappWeSe_17Title = [];
var PRappWeSe_18 = ['http://i2.imgbus.com/doimg/4syu2radeea915.png'];
var PRappWeSe_18Title = [];
var PRappWeSe_19 = ['http://i3.imgbus.com/doimg/2syucrae96a305.png'];
var PRappWeSe_19Title = [];
var PRappWeSe_20 = ['http://i1.imgbus.com/doimg/8sdy5u3r7a03f6.png'];
var PRappWeSe_20Title = [];
var PRappWeSe_21 = ['http://i4.imgbus.com/doimg/bs9y0u7r4a0426.png'];
var PRappWeSe_21Title = [];
var PRappWeSe_22 = ['http://i2.imgbus.com/doimg/as3y5u1r9a01d6.png'];
var PRappWeSe_22Title = [];
var PRappWeSe_23 = ['http://i3.imgbus.com/doimg/5s3y9u0rcaeef6.png'];
var PRappWeSe_23Title = [];
var PRappWeSe_24 = ['http://i1.imgbus.com/doimg/bsby8u2r4aaf16.png'];
var PRappWeSe_24Title = [];
var PRappWeSe_25 = ['http://i1.imgbus.com/doimg/9scybu4r9afae6.png'];
var PRappWeSe_25Title = [];
var PRappWeSe_26 = ['http://i1.imgbus.com/doimg/ds0y7u3raaf3b6.png'];
var PRappWeSe_26Title = [];
var PRappWeSe_27 = ['http://i3.imgbus.com/doimg/2s3y5u0r9a3b16.png'];
var PRappWeSe_27Title = [];
var PRappWeSe_28 = ['http://i4.imgbus.com/doimg/0s7ycuer5a6cb6.png'];
var PRappWeSe_28Title = [];
var PRappWeSe_29 = ['http://i1.imgbus.com/doimg/as6ycucr8aa0f6.png'];
var PRappWeSe_29Title = [];
var PRappWeSe_30 = ['http://i4.imgbus.com/doimg/ds3y5u9r1a5f76.png'];
var PRappWeSe_30Title = [];
var PRappWeSe_31 = ['http://i4.imgbus.com/doimg/csey5ucr8a6a46.png'];
var PRappWeSe_31Title = [];
var PRappWeSe_32 = ['http://i1.imgbus.com/doimg/2s5ydu5r6acd16.png'];
var PRappWeSe_32Title = [];
var PRappWeSe_33 = ['http://i3.imgbus.com/doimg/fs6ycubr8af186.png'];
var PRappWeSe_33Title = [];
var PRappWeSe_34 = ['http://i4.imgbus.com/doimg/ds8y6u3r7aa556.png'];
var PRappWeSe_34Title = [];
var PRappWeSe_35 = ['http://i2.imgbus.com/doimg/es6y7u9reab296.png'];
var PRappWeSe_35Title = [];
var PRappWeSe_36 = ['http://i3.imgbus.com/doimg/1s2y2ubr1a7fe6.png'];
var PRappWeSe_36Title = [];
var PRappWeSe_37 = ['http://i4.imgbus.com/doimg/7say2uarba3f46.png'];
var PRappWeSe_37Title = [];
var PRappWeSe_38 = ['http://i2.imgbus.com/doimg/0s5ycuerbacc46.png'];
var PRappWeSe_38Title = [];
var PRappWeSe_39 = ['http://i2.imgbus.com/doimg/7s9y5u0r1a48d6.png'];
var PRappWeSe_39Title = [];
var PRappWeSe_40 = ['http://i4.imgbus.com/doimg/csy1urda3b2097.png'];
var PRappWeSe_40Title = [];
var PRappWeSe_41 = ['http://i1.imgbus.com/doimg/esyaur2ab31db7.png'];
var PRappWeSe_41Title = [];
var PRappWeSe_42 = ['http://i3.imgbus.com/doimg/bsycur1a65bfe7.png'];
var PRappWeSe_42Title = [];
var PRappWeSe_43 = ['http://i3.imgbus.com/doimg/5sy6ur1a4cb3f7.png'];
var PRappWeSe_43Title = [];
var PRappWeSe_44 = ['http://i4.imgbus.com/doimg/7sycur2a0fe377.png'];
var PRappWeSe_44Title = [];
var PRappWeSe_45 = ['http://i4.imgbus.com/doimg/9syeur1a2591e7.png'];
var PRappWeSe_45Title = [];
var PRappWeSe_46 = ['http://i3.imgbus.com/doimg/asy2ur4adf12e7.png'];
var PRappWeSe_46Title = [];
var PRappWeSe_47 = ['http://i1.imgbus.com/doimg/5syeur6ad3c0d7.png'];
var PRappWeSe_47Title = [];
var PRappWeSe_48 = ['http://i4.imgbus.com/doimg/4sy5ur0added77.png'];
var PRappWeSe_48Title = [];
var PRappWeSe_49 = ['http://i1.imgbus.com/doimg/4sy3ur6ae30437.png'];
var PRappWeSe_49Title = [];
var PRappWeSe_50 = ['http://i4.imgbus.com/doimg/csy0urba7bd357.png'];
var PRappWeSe_50Title = [];
var PRappWeSe_51 = ['http://i3.imgbus.com/doimg/9syburba55f1b7.png'];
var PRappWeSe_51Title = [];
var PRappWeSe_52 = ['http://i4.imgbus.com/doimg/3sy2urcaba8077.png'];
var PRappWeSe_52Title = [];
var PRappWeSe_53 = ['http://i2.imgbus.com/doimg/0sy2ur9a593657.png'];
var PRappWeSe_53Title = [];
var PRappWeSe_54 = ['http://i3.imgbus.com/doimg/7sydur6ac2b207.png'];
var PRappWeSe_54Title = [];
var PRappWeSe_55 = ['http://i3.imgbus.com/doimg/6syaurbac255d7.png'];
var PRappWeSe_55Title = [];
var PRappWeSe_56 = ['http://i1.imgbus.com/doimg/dsy2ur7a343cc7.png'];
var PRappWeSe_56Title = [];
var PRappWeSe_57 = ['http://i1.imgbus.com/doimg/fsycur9a777467.png'];
var PRappWeSe_57Title = [];
var PRappWeSe_58 = ['http://i2.imgbus.com/doimg/4sycur5a1c4167.png'];
var PRappWeSe_58Title = [];
var PRappWeSe_59 = ['http://i4.imgbus.com/doimg/1sy2ur1abd0df7.png'];
var PRappWeSe_59Title = [];
var PRappWeSe_60 = ['http://i4.imgbus.com/doimg/4syaur4a8fee37.png'];
var PRappWeSe_60Title = [];
var PRappWeSe_61 = ['http://i1.imgbus.com/doimg/1syu1rae888138.png'];
var PRappWeSe_61Title = [];
var PRappWeSe_62 = ['http://i3.imgbus.com/doimg/5syu7raa174da8.png'];
var PRappWeSe_62Title = [];
var PRappWeSe_63 = ['http://i2.imgbus.com/doimg/3syucrad938188.png'];
var PRappWeSe_63Title = [];
var PRappWeSe_64 = ['http://i3.imgbus.com/doimg/0syu7rae950f18.png'];
var PRappWeSe_64Title = [];
var PRappWeSe_65 = ['http://i1.imgbus.com/doimg/8syu8ra34ba038.png'];
var PRappWeSe_65Title = [];
var PRappWeSe_66 = ['http://i2.imgbus.com/doimg/fsy8ur8aa4ad84.png'];
var PRappWeSe_66Title = [];
var PRappWeSe_67 = ['http://i4.imgbus.com/doimg/fsy1ur0af397b4.png'];
var PRappWeSe_67Title = [];


// PR app NOTE

var PRappNOTE_1 = ['http://i4.imgbus.com/doimg/2scy0ucreaf1c0.png'];
var PRappNOTE_1Title = [];
var PRappNOTE_2 = ['http://i3.imgbus.com/doimg/5scycu5r9a2b50.png'];
var PRappNOTE_2Title = [];
var PRappNOTE_3 = ['http://i2.imgbus.com/doimg/bsy2urea540d11.png'];
var PRappNOTE_3Title = [];
var PRappNOTE_4 = ['http://i1.imgbus.com/doimg/1sycurcac848f1.png'];
var PRappNOTE_4Title = [];
var PRappNOTE_5 = ['http://i3.imgbus.com/doimg/2sycur0a8c6221.png'];
var PRappNOTE_5Title = [];
var PRappNOTE_6 = ['http://i1.imgbus.com/doimg/bsy6ur5a0634b1.png'];
var PRappNOTE_6Title = [];
var PRappNOTE_7 = ['http://i1.imgbus.com/doimg/1syeurca54b191.png'];
var PRappNOTE_7Title = [];
var PRappNOTE_8 = ['http://i1.imgbus.com/doimg/bsy7urfa9c6801.png'];
var PRappNOTE_8Title = [];
var PRappNOTE_9 = ['http://i2.imgbus.com/doimg/5syburfa75b1f1.png'];
var PRappNOTE_9Title = [];
var PRappNOTE_10 = ['http://i3.imgbus.com/doimg/fsy9urdaadae41.png'];
var PRappNOTE_10Title = [];
var PRappNOTE_11 = ['http://i1.imgbus.com/doimg/3syaur7aa43d31.png'];
var PRappNOTE_11Title = [];
var PRappNOTE_12 = ['http://i1.imgbus.com/doimg/dsyeur2a5ddfd1.png'];
var PRappNOTE_12Title = [];
var PRappNOTE_13 = ['http://i3.imgbus.com/doimg/2sy2urca9f94b1.png'];
var PRappNOTE_13Title = [];
var PRappNOTE_14 = ['http://i4.imgbus.com/doimg/9sy1ur7a1587c1.png'];
var PRappNOTE_14Title = [];
var PRappNOTE_15 = ['http://i1.imgbus.com/doimg/7sy3ur8ae0d251.png'];
var PRappNOTE_15Title = [];
var PRappNOTE_16 = ['http://i2.imgbus.com/doimg/8sy4urdaaa92e1.png'];
var PRappNOTE_16Title = [];
var PRappNOTE_17 = ['http://i4.imgbus.com/doimg/fsyaur5ac3e7e1.png'];
var PRappNOTE_17Title = [];
var PRappNOTE_18 = ['http://i4.imgbus.com/doimg/fsy1ur0ac1f981.png'];
var PRappNOTE_18Title = [];
var PRappNOTE_19 = ['http://i3.imgbus.com/doimg/7sy4ur7aa84801.png'];
var PRappNOTE_19Title = [];
var PRappNOTE_20 = ['http://i4.imgbus.com/doimg/fsycur3a620fc1.png'];
var PRappNOTE_20Title = [];
var PRappNOTE_21 = ['http://i1.imgbus.com/doimg/7sydurfaf65f71.png'];
var PRappNOTE_21Title = [];
var PRappNOTE_22 = ['http://i4.imgbus.com/doimg/5sy2ur7a7f0a91.png'];
var PRappNOTE_22Title = [];
var PRappNOTE_23 = ['http://i4.imgbus.com/doimg/1sybur2aaf3d81.png'];
var PRappNOTE_23Title = [];
var PRappNOTE_24 = ['http://i4.imgbus.com/doimg/7syfur2adf9ba1.png'];
var PRappNOTE_24Title = [];
var PRappNOTE_25 = ['http://i1.imgbus.com/doimg/5syubra5efc342.png'];
var PRappNOTE_25Title = [];
var PRappNOTE_26 = ['http://i4.imgbus.com/doimg/4syucra1c2bf02.png'];
var PRappNOTE_26Title = [];
var PRappNOTE_27 = ['http://i1.imgbus.com/doimg/2syubraefdb9f2.png'];
var PRappNOTE_27Title = [];
var PRappNOTE_28 = ['http://i1.imgbus.com/doimg/fsyu1ra658e662.png'];
var PRappNOTE_28Title = [];
var PRappNOTE_29 = ['http://i3.imgbus.com/doimg/8syu6ra3e86f42.png'];
var PRappNOTE_29Title = [];
var PRappNOTE_30 = ['http://i1.imgbus.com/doimg/esyu2ra4930252.png'];
var PRappNOTE_30Title = [];
var PRappNOTE_31 = ['http://i2.imgbus.com/doimg/6syu4ra900c792.png'];
var PRappNOTE_31Title = [];
var PRappNOTE_32 = ['http://i3.imgbus.com/doimg/0syu8raa80f312.png'];
var PRappNOTE_32Title = [];
var PRappNOTE_33 = ['http://i4.imgbus.com/doimg/csyu4ra7238b12.png'];
var PRappNOTE_33Title = [];
var PRappNOTE_34 = ['http://i2.imgbus.com/doimg/asyu0rac3b1892.png'];
var PRappNOTE_34Title = [];
var PRappNOTE_35 = ['http://i2.imgbus.com/doimg/fsyu3ra860ba12.png'];
var PRappNOTE_35Title = [];
var PRappNOTE_36 = ['http://i1.imgbus.com/doimg/asyu2rad93d182.png'];
var PRappNOTE_36Title = [];
var PRappNOTE_37 = ['http://i1.imgbus.com/doimg/9syubrafff4c12.png'];
var PRappNOTE_37Title = [];
var PRappNOTE_38 = ['http://i2.imgbus.com/doimg/esyu6ra6a935b2.png'];
var PRappNOTE_38Title = [];
var PRappNOTE_39 = ['http://i4.imgbus.com/doimg/2syu3rad94b3a2.png'];
var PRappNOTE_39Title = [];
var PRappNOTE_40 = ['http://i1.imgbus.com/doimg/bsyuara542fb12.png'];
var PRappNOTE_40Title = [];
var PRappNOTE_41 = ['http://i4.imgbus.com/doimg/6syu9raba10902.png'];
var PRappNOTE_41Title = [];
var PRappNOTE_42 = ['http://i2.imgbus.com/doimg/1syucra2a6f552.png'];
var PRappNOTE_42Title = [];
var PRappNOTE_43 = ['http://i3.imgbus.com/doimg/1syuera2f0c832.png'];
var PRappNOTE_43Title = [];
var PRappNOTE_44 = ['http://i4.imgbus.com/doimg/5syu9ra5cc2d42.png'];
var PRappNOTE_44Title = [];
var PRappNOTE_45 = ['http://i4.imgbus.com/doimg/8syu6ra3e01b62.png'];
var PRappNOTE_45Title = [];
var PRappNOTE_46 = ['http://i1.imgbus.com/doimg/esyu8ra1368062.png'];
var PRappNOTE_46Title = [];
var PRappNOTE_47 = ['http://i3.imgbus.com/doimg/5s0y9ubrfaadb3.png'];
var PRappNOTE_47Title = [];
var PRappNOTE_48 = ['http://i4.imgbus.com/doimg/2s8y0u0r3a4823.png'];
var PRappNOTE_48Title = [];
var PRappNOTE_49 = ['http://i1.imgbus.com/doimg/ds0y8u7r3a15e3.png'];
var PRappNOTE_49Title = [];
var PRappNOTE_50 = ['http://i3.imgbus.com/doimg/csay8ucr7afa83.png'];
var PRappNOTE_50Title = [];
var PRappNOTE_51 = ['http://i1.imgbus.com/doimg/0s4ycu3r7ab6f3.png'];
var PRappNOTE_51Title = [];
var PRappNOTE_52 = ['http://i4.imgbus.com/doimg/csfy6udrbae633.png'];
var PRappNOTE_52Title = [];
var PRappNOTE_53 = ['http://i4.imgbus.com/doimg/3sby3u4rdaadd3.png'];
var PRappNOTE_53Title = [];
var PRappNOTE_54 = ['http://i2.imgbus.com/doimg/csay1u5rbadc53.png'];
var PRappNOTE_54Title = [];
var PRappNOTE_55 = ['http://i3.imgbus.com/doimg/0s5ybuerfaae33.png'];
var PRappNOTE_55Title = [];
var PRappNOTE_56 = ['http://i2.imgbus.com/doimg/2s1yau6rba94e3.png'];
var PRappNOTE_56Title = [];
var PRappNOTE_57 = ['http://i2.imgbus.com/doimg/fs2y1u2rea3933.png'];
var PRappNOTE_57Title = [];
var PRappNOTE_58 = ['http://i4.imgbus.com/doimg/4sby8uar8aedf3.png'];
var PRappNOTE_58Title = [];
var PRappNOTE_59 = ['http://i4.imgbus.com/doimg/bs1yau9r5a77f3.png'];
var PRappNOTE_59Title = [];
var PRappNOTE_60 = ['http://i2.imgbus.com/doimg/8seydu7r6a7d43.png'];
var PRappNOTE_60Title = [];
var PRappNOTE_61 = ['http://i1.imgbus.com/doimg/eseyeu5raa5fb3.png'];
var PRappNOTE_61Title = [];
var PRappNOTE_62 = ['http://i2.imgbus.com/doimg/6s5ycuarba21a3.png'];
var PRappNOTE_62Title = [];
var PRappNOTE_63 = ['http://i3.imgbus.com/doimg/1scyfu1rfa2833.png'];
var PRappNOTE_63Title = [];
var PRappNOTE_64 = ['http://i4.imgbus.com/doimg/2s6y7ufrdabe53.png'];
var PRappNOTE_64Title = [];
var PRappNOTE_65 = ['http://i3.imgbus.com/doimg/4say4u9rda0633.png'];
var PRappNOTE_65Title = [];
var PRappNOTE_66 = ['http://i4.imgbus.com/doimg/7s0yfufr0a7de3.png'];
var PRappNOTE_66Title = [];
var PRappNOTE_67 = ['http://i3.imgbus.com/doimg/esycurdabe9ae4.png'];
var PRappNOTE_67Title = [];
var PRappNOTE_68 = ['http://i3.imgbus.com/doimg/2syaurba5387f4.png'];
var PRappNOTE_68Title = [];
var PRappNOTE_69 = ['http://i3.imgbus.com/doimg/1syaurda55f794.png'];
var PRappNOTE_69Title = [];
var PRappNOTE_70 = ['http://i4.imgbus.com/doimg/8sybur6a639384.png'];
var PRappNOTE_70Title = [];
var PRappNOTE_71 = ['http://i1.imgbus.com/doimg/esy7ur1ad965a4.png'];
var PRappNOTE_71Title = [];
var PRappNOTE_72 = ['http://i3.imgbus.com/doimg/dsy9urda7268a4.png'];
var PRappNOTE_72Title = [];
var PRappNOTE_73 = ['http://i4.imgbus.com/doimg/2sydurea804934.png'];
var PRappNOTE_73Title = [];
var PRappNOTE_74 = ['http://i1.imgbus.com/doimg/3syfurda603534.png'];
var PRappNOTE_74Title = [];
var PRappNOTE_75 = ['http://i3.imgbus.com/doimg/4sy4urfaec34e4.png'];
var PRappNOTE_75Title = [];
var PRappNOTE_76 = ['http://i2.imgbus.com/doimg/5syaur6a9b4794.png'];
var PRappNOTE_76Title = [];
var PRappNOTE_77 = ['http://i3.imgbus.com/doimg/8sy1ur4a0c1d44.png'];
var PRappNOTE_77Title = [];
var PRappNOTE_78 = ['http://i1.imgbus.com/doimg/3sy9ur6a7e3344.png'];
var PRappNOTE_78Title = [];
var PRappNOTE_79 = ['http://i1.imgbus.com/doimg/fsydurba072524.png'];
var PRappNOTE_79Title = [];
var PRappNOTE_80 = ['http://i3.imgbus.com/doimg/1syeur6a529bc4.png'];
var PRappNOTE_80Title = [];
var PRappNOTE_81 = ['http://i1.imgbus.com/doimg/0sy0ur0afa6484.png'];
var PRappNOTE_81Title = [];
var PRappNOTE_82 = ['http://i4.imgbus.com/doimg/5sycurcae11cd4.png'];
var PRappNOTE_82Title = [];
var PRappNOTE_83 = ['http://i1.imgbus.com/doimg/8sy4urbacfa3a4.png'];
var PRappNOTE_83Title = [];
var PRappNOTE_84 = ['http://i4.imgbus.com/doimg/dsy4urba3b16b4.png'];
var PRappNOTE_84Title = [];
var PRappNOTE_85 = ['http://i4.imgbus.com/doimg/2sy5urca7c83b4.png'];
var PRappNOTE_85Title = [];
var PRappNOTE_86 = ['http://i4.imgbus.com/doimg/7sy8ur4ab12254.png'];
var PRappNOTE_86Title = [];



//PR FB
var PRFB_1 = ['http://i3.imgbus.com/doimg/5seyfu0r6a04f3.png'];
var PRFB_1Title = [];
var PRFB_2 = ['http://i2.imgbus.com/doimg/es7y9u8rfaa1e3.png'];
var PRFB_2Title = [];
var PRFB_3 = ['http://i4.imgbus.com/doimg/1seydu8rbac283.png'];
var PRFB_3Title = [];
var PRFB_4 = ['http://i1.imgbus.com/doimg/dsy0ur2a5fe9b4.png'];
var PRFB_4Title = [];
var PRFB_5 = ['http://i1.imgbus.com/doimg/8sy6ur9aa66a54.png'];
var PRFB_5Title = [];
var PRFB_6 = ['http://i4.imgbus.com/doimg/5syaurda26aca4.png'];
var PRFB_6Title = [];
var PRFB_7 = ['http://i3.imgbus.com/doimg/asy8ur5a5fdb54.png'];
var PRFB_7Title = [];
var PRFB_8 = ['http://i2.imgbus.com/doimg/1sy7ur8ab4b904.png'];
var PRFB_8Title = [];
var PRFB_9 = ['http://i4.imgbus.com/doimg/8syfur9a1d85d4.png'];
var PRFB_9Title = [];
var PRFB_10 = ['http://i4.imgbus.com/doimg/esy6urba31e254.png'];
var PRFB_10Title = [];
var PRFB_11 = ['http://i1.imgbus.com/doimg/2syfuraa2ffcc4.png'];
var PRFB_11Title = [];
var PRFB_12 = ['http://i3.imgbus.com/doimg/8syfur0adf29b4.png'];
var PRFB_12Title = [];
var PRFB_13 = ['http://i1.imgbus.com/doimg/4syeur9a901d24.png'];
var PRFB_13Title = [];
var PRFB_14 = ['http://i4.imgbus.com/doimg/9sydur2a6956c4.png'];
var PRFB_14Title = [];
var PRFB_15 = ['http://i1.imgbus.com/doimg/4sy6ur7a7b95a4.png'];
var PRFB_15Title = [];
var PRFB_16 = ['http://i2.imgbus.com/doimg/6sy6ur7adc3bf4.png'];
var PRFB_16Title = [];
var PRFB_17 = ['http://i1.imgbus.com/doimg/9syaur3a4beb04.png'];
var PRFB_17Title = [];
var PRFB_18 = ['http://i3.imgbus.com/doimg/6sydur0a3b14f4.png'];
var PRFB_18Title = [];
var PRFB_19 = ['http://i4.imgbus.com/doimg/asy3ur1a51aee4.png'];
var PRFB_19Title = [];
var PRFB_20 = ['http://i1.imgbus.com/doimg/7syaur7aa91d14.png'];
var PRFB_20Title = [];
var PRFB_21 = ['http://i2.imgbus.com/doimg/2sy4ur8a48f864.png'];
var PRFB_21Title = [];
var PRFB_22 = ['http://i2.imgbus.com/doimg/dsyu7ra00bd515.png'];
var PRFB_22Title = [];
var PRFB_23 = ['http://i2.imgbus.com/doimg/dsyu4ra07bc345.png'];
var PRFB_23Title = [];
var PRFB_24 = ['http://i4.imgbus.com/doimg/5syudra07c9ee5.png'];
var PRFB_24Title = [];




function loadingHandler(loadindex, target){
    
    switch (loadindex) {
        case 1: // PR 1
                        userInputImg(target, PR1_1, PR1_1, PR1_1Title, returnImg, 60, 60);
            userInputImg(target, PR1_2, PR1_2, PR1_2Title, returnImg, 60, 60);
            userInputImg(target, PR1_3, PR1_3, PR1_3Title, returnImg, 60, 60);
            userInputImg(target, PR1_4, PR1_4, PR1_4Title, returnImg, 60, 60);
            userInputImg(target, PR1_5, PR1_5, PR1_5Title, returnImg, 60, 60);
            userInputImg(target, PR1_6, PR1_6, PR1_6Title, returnImg, 60, 60);
            userInputImg(target, PR1_7, PR1_7, PR1_7Title, returnImg, 60, 60);
            userInputImg(target, PR1_8, PR1_8, PR1_8Title, returnImg, 60, 60);
            userInputImg(target, PR1_9, PR1_9, PR1_9Title, returnImg, 60, 60);
            userInputImg(target, PR1_10, PR1_10, PR1_10Title, returnImg, 60, 60);
            userInputImg(target, PR1_11, PR1_11, PR1_11Title, returnImg, 60, 60);
            userInputImg(target, PR1_12, PR1_12, PR1_12Title, returnImg, 60, 60);
            userInputImg(target, PR1_13, PR1_13, PR1_13Title, returnImg, 60, 60);
            userInputImg(target, PR1_14, PR1_14, PR1_14Title, returnImg, 60, 60);
            userInputImg(target, PR1_15, PR1_15, PR1_15Title, returnImg, 60, 60);
            userInputImg(target, PR1_16, PR1_16, PR1_16Title, returnImg, 60, 60);
            userInputImg(target, PR1_17, PR1_17, PR1_17Title, returnImg, 60, 60);
            userInputImg(target, PR1_18, PR1_18, PR1_18Title, returnImg, 60, 60);
            userInputImg(target, PR1_19, PR1_19, PR1_19Title, returnImg, 60, 60);
            userInputImg(target, PR1_20, PR1_20, PR1_20Title, returnImg, 60, 60);
            userInputImg(target, PR1_21, PR1_21, PR1_21Title, returnImg, 60, 60);
            userInputImg(target, PR1_22, PR1_22, PR1_22Title, returnImg, 60, 60);
            userInputImg(target, PR1_23, PR1_23, PR1_23Title, returnImg, 60, 60);
            userInputImg(target, PR1_24, PR1_24, PR1_24Title, returnImg, 60, 60);
            userInputImg(target, PR1_25, PR1_25, PR1_25Title, returnImg, 60, 60);
            userInputImg(target, PR1_26, PR1_26, PR1_26Title, returnImg, 60, 60);
            userInputImg(target, PR1_27, PR1_27, PR1_27Title, returnImg, 60, 60);
            userInputImg(target, PR1_28, PR1_28, PR1_28Title, returnImg, 60, 60);
            userInputImg(target, PR1_29, PR1_29, PR1_29Title, returnImg, 60, 60);
            userInputImg(target, PR1_30, PR1_30, PR1_30Title, returnImg, 60, 60);
            userInputImg(target, PR1_31, PR1_31, PR1_31Title, returnImg, 60, 60);
            userInputImg(target, PR1_32, PR1_32, PR1_32Title, returnImg, 60, 60);
            userInputImg(target, PR1_33, PR1_33, PR1_33Title, returnImg, 60, 60);
            userInputImg(target, PR1_34, PR1_34, PR1_34Title, returnImg, 60, 60);
            userInputImg(target, PR1_35, PR1_35, PR1_35Title, returnImg, 60, 60);
            userInputImg(target, PR1_36, PR1_36, PR1_36Title, returnImg, 60, 60);
            userInputImg(target, PR1_37, PR1_37, PR1_37Title, returnImg, 60, 60);
            userInputImg(target, PR1_38, PR1_38, PR1_38Title, returnImg, 60, 60);
            userInputImg(target, PR1_39, PR1_39, PR1_39Title, returnImg, 60, 60);
            userInputImg(target, PR1_40, PR1_40, PR1_40Title, returnImg, 60, 60);


			break;
			
			case 2: // PR 2
			            userInputImg(target, PR2_1, PR2_1, PR2_1Title, returnImg, 60, 60);
            userInputImg(target, PR2_2, PR2_2, PR2_2Title, returnImg, 60, 60);
            userInputImg(target, PR2_3, PR2_3, PR2_3Title, returnImg, 60, 60);
            userInputImg(target, PR2_4, PR2_4, PR2_4Title, returnImg, 60, 60);
            userInputImg(target, PR2_5, PR2_5, PR2_5Title, returnImg, 60, 60);
            userInputImg(target, PR2_6, PR2_6, PR2_6Title, returnImg, 60, 60);
            userInputImg(target, PR2_7, PR2_7, PR2_7Title, returnImg, 60, 60);
            userInputImg(target, PR2_8, PR2_8, PR2_8Title, returnImg, 60, 60);
            userInputImg(target, PR2_9, PR2_9, PR2_9Title, returnImg, 60, 60);
            userInputImg(target, PR2_10, PR2_10, PR2_10Title, returnImg, 60, 60);
            userInputImg(target, PR2_11, PR2_11, PR2_11Title, returnImg, 60, 60);
            userInputImg(target, PR2_12, PR2_12, PR2_12Title, returnImg, 60, 60);
            userInputImg(target, PR2_13, PR2_13, PR2_13Title, returnImg, 60, 60);
            userInputImg(target, PR2_14, PR2_14, PR2_14Title, returnImg, 60, 60);
            userInputImg(target, PR2_15, PR2_15, PR2_15Title, returnImg, 60, 60);
            userInputImg(target, PR2_16, PR2_16, PR2_16Title, returnImg, 60, 60);
            userInputImg(target, PR2_17, PR2_17, PR2_17Title, returnImg, 60, 60);
            userInputImg(target, PR2_18, PR2_18, PR2_18Title, returnImg, 60, 60);
            userInputImg(target, PR2_19, PR2_19, PR2_19Title, returnImg, 60, 60);
            userInputImg(target, PR2_20, PR2_20, PR2_20Title, returnImg, 60, 60);
            userInputImg(target, PR2_21, PR2_21, PR2_21Title, returnImg, 60, 60);
            userInputImg(target, PR2_22, PR2_22, PR2_22Title, returnImg, 60, 60);
            userInputImg(target, PR2_23, PR2_23, PR2_23Title, returnImg, 60, 60);
            userInputImg(target, PR2_24, PR2_24, PR2_24Title, returnImg, 60, 60);
            userInputImg(target, PR2_25, PR2_25, PR2_25Title, returnImg, 60, 60);
            userInputImg(target, PR2_26, PR2_26, PR2_26Title, returnImg, 60, 60);
            userInputImg(target, PR2_27, PR2_27, PR2_27Title, returnImg, 60, 60);
            userInputImg(target, PR2_28, PR2_28, PR2_28Title, returnImg, 60, 60);
            userInputImg(target, PR2_29, PR2_29, PR2_29Title, returnImg, 60, 60);
            userInputImg(target, PR2_30, PR2_30, PR2_30Title, returnImg, 60, 60);
            userInputImg(target, PR2_31, PR2_31, PR2_31Title, returnImg, 60, 60);
            userInputImg(target, PR2_32, PR2_32, PR2_32Title, returnImg, 60, 60);
            userInputImg(target, PR2_33, PR2_33, PR2_33Title, returnImg, 60, 60);
            userInputImg(target, PR2_34, PR2_34, PR2_34Title, returnImg, 60, 60);
            userInputImg(target, PR2_35, PR2_35, PR2_35Title, returnImg, 60, 60);
            userInputImg(target, PR2_36, PR2_36, PR2_36Title, returnImg, 60, 60);
            userInputImg(target, PR2_37, PR2_37, PR2_37Title, returnImg, 60, 60);
            userInputImg(target, PR2_38, PR2_38, PR2_38Title, returnImg, 60, 60);
            userInputImg(target, PR2_39, PR2_39, PR2_39Title, returnImg, 60, 60);
            userInputImg(target, PR2_40, PR2_40, PR2_40Title, returnImg, 60, 60);


			break;
			
			case 3: // PR 3
			            userInputImg(target, PR3_1, PR3_1, PR3_1Title, returnImg, 60, 60);
            userInputImg(target, PR3_2, PR3_2, PR3_2Title, returnImg, 60, 60);
            userInputImg(target, PR3_3, PR3_3, PR3_3Title, returnImg, 60, 60);
            userInputImg(target, PR3_4, PR3_4, PR3_4Title, returnImg, 60, 60);
            userInputImg(target, PR3_5, PR3_5, PR3_5Title, returnImg, 60, 60);
            userInputImg(target, PR3_6, PR3_6, PR3_6Title, returnImg, 60, 60);
            userInputImg(target, PR3_7, PR3_7, PR3_7Title, returnImg, 60, 60);
            userInputImg(target, PR3_8, PR3_8, PR3_8Title, returnImg, 60, 60);
            userInputImg(target, PR3_9, PR3_9, PR3_9Title, returnImg, 60, 60);
            userInputImg(target, PR3_10, PR3_10, PR3_10Title, returnImg, 60, 60);
            userInputImg(target, PR3_11, PR3_11, PR3_11Title, returnImg, 60, 60);
            userInputImg(target, PR3_12, PR3_12, PR3_12Title, returnImg, 60, 60);
            userInputImg(target, PR3_13, PR3_13, PR3_13Title, returnImg, 60, 60);
            userInputImg(target, PR3_14, PR3_14, PR3_14Title, returnImg, 60, 60);
            userInputImg(target, PR3_15, PR3_15, PR3_15Title, returnImg, 60, 60);
            userInputImg(target, PR3_16, PR3_16, PR3_16Title, returnImg, 60, 60);
            userInputImg(target, PR3_17, PR3_17, PR3_17Title, returnImg, 60, 60);
            userInputImg(target, PR3_18, PR3_18, PR3_18Title, returnImg, 60, 60);
            userInputImg(target, PR3_19, PR3_19, PR3_19Title, returnImg, 60, 60);
            userInputImg(target, PR3_20, PR3_20, PR3_20Title, returnImg, 60, 60);
            userInputImg(target, PR3_21, PR3_21, PR3_21Title, returnImg, 60, 60);
            userInputImg(target, PR3_22, PR3_22, PR3_22Title, returnImg, 60, 60);
            userInputImg(target, PR3_23, PR3_23, PR3_23Title, returnImg, 60, 60);
            userInputImg(target, PR3_24, PR3_24, PR3_24Title, returnImg, 60, 60);
            userInputImg(target, PR3_25, PR3_25, PR3_25Title, returnImg, 60, 60);
            userInputImg(target, PR3_26, PR3_26, PR3_26Title, returnImg, 60, 60);
            userInputImg(target, PR3_27, PR3_27, PR3_27Title, returnImg, 60, 60);
            userInputImg(target, PR3_28, PR3_28, PR3_28Title, returnImg, 60, 60);
            userInputImg(target, PR3_29, PR3_29, PR3_29Title, returnImg, 60, 60);
            userInputImg(target, PR3_30, PR3_30, PR3_30Title, returnImg, 60, 60);
            userInputImg(target, PR3_31, PR3_31, PR3_31Title, returnImg, 60, 60);
            userInputImg(target, PR3_32, PR3_32, PR3_32Title, returnImg, 60, 60);
            userInputImg(target, PR3_33, PR3_33, PR3_33Title, returnImg, 60, 60);
            userInputImg(target, PR3_34, PR3_34, PR3_34Title, returnImg, 60, 60);
            userInputImg(target, PR3_35, PR3_35, PR3_35Title, returnImg, 60, 60);
            userInputImg(target, PR3_36, PR3_36, PR3_36Title, returnImg, 60, 60);
            userInputImg(target, PR3_37, PR3_37, PR3_37Title, returnImg, 60, 60);
            userInputImg(target, PR3_38, PR3_38, PR3_38Title, returnImg, 60, 60);
            userInputImg(target, PR3_39, PR3_39, PR3_39Title, returnImg, 60, 60);
            userInputImg(target, PR3_40, PR3_40, PR3_40Title, returnImg, 60, 60);

			
			break;
			
			case 4: // PR 4
			            userInputImg(target, PR4_1, PR4_1, PR4_1Title, returnImg, 60, 60);
            userInputImg(target, PR4_2, PR4_2, PR4_2Title, returnImg, 60, 60);
            userInputImg(target, PR4_3, PR4_3, PR4_3Title, returnImg, 60, 60);
            userInputImg(target, PR4_4, PR4_4, PR4_4Title, returnImg, 60, 60);
            userInputImg(target, PR4_5, PR4_5, PR4_5Title, returnImg, 60, 60);
            userInputImg(target, PR4_6, PR4_6, PR4_6Title, returnImg, 60, 60);
            userInputImg(target, PR4_7, PR4_7, PR4_7Title, returnImg, 60, 60);
            userInputImg(target, PR4_8, PR4_8, PR4_8Title, returnImg, 60, 60);
            userInputImg(target, PR4_9, PR4_9, PR4_9Title, returnImg, 60, 60);
            userInputImg(target, PR4_10, PR4_10, PR4_10Title, returnImg, 60, 60);
            userInputImg(target, PR4_11, PR4_11, PR4_11Title, returnImg, 60, 60);
            userInputImg(target, PR4_12, PR4_12, PR4_12Title, returnImg, 60, 60);
            userInputImg(target, PR4_13, PR4_13, PR4_13Title, returnImg, 60, 60);
            userInputImg(target, PR4_14, PR4_14, PR4_14Title, returnImg, 60, 60);
            userInputImg(target, PR4_15, PR4_15, PR4_15Title, returnImg, 60, 60);
            userInputImg(target, PR4_16, PR4_16, PR4_16Title, returnImg, 60, 60);
            userInputImg(target, PR4_17, PR4_17, PR4_17Title, returnImg, 60, 60);
            userInputImg(target, PR4_18, PR4_18, PR4_18Title, returnImg, 60, 60);
            userInputImg(target, PR4_19, PR4_19, PR4_19Title, returnImg, 60, 60);
            userInputImg(target, PR4_20, PR4_20, PR4_20Title, returnImg, 60, 60);
            userInputImg(target, PR4_21, PR4_21, PR4_21Title, returnImg, 60, 60);
            userInputImg(target, PR4_22, PR4_22, PR4_22Title, returnImg, 60, 60);
            userInputImg(target, PR4_23, PR4_23, PR4_23Title, returnImg, 60, 60);
            userInputImg(target, PR4_24, PR4_24, PR4_24Title, returnImg, 60, 60);
            userInputImg(target, PR4_25, PR4_25, PR4_25Title, returnImg, 60, 60);
            userInputImg(target, PR4_26, PR4_26, PR4_26Title, returnImg, 60, 60);
            userInputImg(target, PR4_27, PR4_27, PR4_27Title, returnImg, 60, 60);
            userInputImg(target, PR4_28, PR4_28, PR4_28Title, returnImg, 60, 60);
            userInputImg(target, PR4_29, PR4_29, PR4_29Title, returnImg, 60, 60);
            userInputImg(target, PR4_30, PR4_30, PR4_30Title, returnImg, 60, 60);
            userInputImg(target, PR4_31, PR4_31, PR4_31Title, returnImg, 60, 60);
            userInputImg(target, PR4_32, PR4_32, PR4_32Title, returnImg, 60, 60);
            userInputImg(target, PR4_33, PR4_33, PR4_33Title, returnImg, 60, 60);
            userInputImg(target, PR4_34, PR4_34, PR4_34Title, returnImg, 60, 60);
            userInputImg(target, PR4_35, PR4_35, PR4_35Title, returnImg, 60, 60);
            userInputImg(target, PR4_36, PR4_36, PR4_36Title, returnImg, 60, 60);
            userInputImg(target, PR4_37, PR4_37, PR4_37Title, returnImg, 60, 60);
            userInputImg(target, PR4_38, PR4_38, PR4_38Title, returnImg, 60, 60);
            userInputImg(target, PR4_39, PR4_39, PR4_39Title, returnImg, 60, 60);
            userInputImg(target, PR4_40, PR4_40, PR4_40Title, returnImg, 60, 60);

			
			break;
			
			case 5: // PR other
			            userInputImg(target, PRo_1, PRo_1, PRo_1Title, returnImg, 60, 60);
            userInputImg(target, PRo_2, PRo_2, PRo_2Title, returnImg, 60, 60);
            userInputImg(target, PRo_3, PRo_3, PRo_3Title, returnImg, 60, 60);
            userInputImg(target, PRo_4, PRo_4, PRo_4Title, returnImg, 60, 60);
            userInputImg(target, PRo_5, PRo_5, PRo_5Title, returnImg, 60, 60);
            userInputImg(target, PRo_6, PRo_6, PRo_6Title, returnImg, 60, 60);
            userInputImg(target, PRo_7, PRo_7, PRo_7Title, returnImg, 60, 60);
            userInputImg(target, PRo_8, PRo_8, PRo_8Title, returnImg, 60, 60);
            userInputImg(target, PRo_9, PRo_9, PRo_9Title, returnImg, 60, 60);
            userInputImg(target, PRo_10, PRo_10, PRo_10Title, returnImg, 60, 60);
            userInputImg(target, PRo_11, PRo_11, PRo_11Title, returnImg, 60, 60);
            userInputImg(target, PRo_12, PRo_12, PRo_12Title, returnImg, 60, 60);
            userInputImg(target, PRo_13, PRo_13, PRo_13Title, returnImg, 60, 60);
            userInputImg(target, PRo_14, PRo_14, PRo_14Title, returnImg, 60, 60);
            userInputImg(target, PRo_15, PRo_15, PRo_15Title, returnImg, 60, 60);
            userInputImg(target, PRo_16, PRo_16, PRo_16Title, returnImg, 60, 60);
            userInputImg(target, PRo_17, PRo_17, PRo_17Title, returnImg, 60, 60);
            userInputImg(target, PRo_18, PRo_18, PRo_18Title, returnImg, 60, 60);
            userInputImg(target, PRo_19, PRo_19, PRo_19Title, returnImg, 60, 60);
            userInputImg(target, PRo_20, PRo_20, PRo_20Title, returnImg, 60, 60);
            userInputImg(target, PRo_21, PRo_21, PRo_21Title, returnImg, 60, 60);
            userInputImg(target, PRo_22, PRo_22, PRo_22Title, returnImg, 60, 60);
            userInputImg(target, PRo_23, PRo_23, PRo_23Title, returnImg, 60, 60);
            userInputImg(target, PRo_24, PRo_24, PRo_24Title, returnImg, 60, 60);
            userInputImg(target, PRo_25, PRo_25, PRo_25Title, returnImg, 60, 60);
            userInputImg(target, PRo_26, PRo_26, PRo_26Title, returnImg, 60, 60);
            userInputImg(target, PRo_27, PRo_27, PRo_27Title, returnImg, 60, 60);
            userInputImg(target, PRo_28, PRo_28, PRo_28Title, returnImg, 60, 60);
            userInputImg(target, PRo_29, PRo_29, PRo_29Title, returnImg, 60, 60);
            userInputImg(target, PRo_30, PRo_30, PRo_30Title, returnImg, 60, 60);
            userInputImg(target, PRo_31, PRo_31, PRo_31Title, returnImg, 60, 60);
            userInputImg(target, PRo_32, PRo_32, PRo_32Title, returnImg, 60, 60);
            userInputImg(target, PRo_33, PRo_33, PRo_33Title, returnImg, 60, 60);
            userInputImg(target, PRo_34, PRo_34, PRo_34Title, returnImg, 60, 60);
            userInputImg(target, PRo_35, PRo_35, PRo_35Title, returnImg, 60, 60);
            userInputImg(target, PRo_36, PRo_36, PRo_36Title, returnImg, 60, 60);
            userInputImg(target, PRo_37, PRo_37, PRo_37Title, returnImg, 60, 60);
            userInputImg(target, PRo_38, PRo_38, PRo_38Title, returnImg, 60, 60);
            userInputImg(target, PRo_39, PRo_39, PRo_39Title, returnImg, 60, 60);
            userInputImg(target, PRo_40, PRo_40, PRo_40Title, returnImg, 60, 60);
            userInputImg(target, PRo_41, PRo_41, PRo_41Title, returnImg, 60, 60);
            userInputImg(target, PRo_42, PRo_42, PRo_42Title, returnImg, 60, 60);
            userInputImg(target, PRo_43, PRo_43, PRo_43Title, returnImg, 60, 60);
            userInputImg(target, PRo_44, PRo_44, PRo_44Title, returnImg, 60, 60);
            userInputImg(target, PRo_45, PRo_45, PRo_45Title, returnImg, 60, 60);
            userInputImg(target, PRo_46, PRo_46, PRo_46Title, returnImg, 60, 60);
            userInputImg(target, PRo_47, PRo_47, PRo_47Title, returnImg, 60, 60);
            userInputImg(target, PRo_48, PRo_48, PRo_48Title, returnImg, 60, 60);
            userInputImg(target, PRo_49, PRo_49, PRo_49Title, returnImg, 60, 60);
            userInputImg(target, PRo_50, PRo_50, PRo_50Title, returnImg, 60, 60);
            userInputImg(target, PRo_51, PRo_51, PRo_51Title, returnImg, 60, 60);
            userInputImg(target, PRo_52, PRo_52, PRo_52Title, returnImg, 60, 60);
            userInputImg(target, PRo_53, PRo_53, PRo_53Title, returnImg, 60, 60);
            userInputImg(target, PRo_54, PRo_54, PRo_54Title, returnImg, 60, 60);
            userInputImg(target, PRo_55, PRo_55, PRo_55Title, returnImg, 60, 60);
            userInputImg(target, PRo_56, PRo_56, PRo_56Title, returnImg, 60, 60);
            userInputImg(target, PRo_57, PRo_57, PRo_57Title, returnImg, 60, 60);
            userInputImg(target, PRo_58, PRo_58, PRo_58Title, returnImg, 60, 60);
            userInputImg(target, PRo_59, PRo_59, PRo_59Title, returnImg, 60, 60);


			
			break;
			
			case 6: // PR kan
			
			            userInputImg(target, PRkan1_1, PRkan1_1, PRkan1_1Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_2, PRkan1_2, PRkan1_2Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_3, PRkan1_3, PRkan1_3Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_4, PRkan1_4, PRkan1_4Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_5, PRkan1_5, PRkan1_5Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_6, PRkan1_6, PRkan1_6Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_7, PRkan1_7, PRkan1_7Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_8, PRkan1_8, PRkan1_8Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_9, PRkan1_9, PRkan1_9Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_10, PRkan1_10, PRkan1_10Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_11, PRkan1_11, PRkan1_11Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_12, PRkan1_12, PRkan1_12Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_13, PRkan1_13, PRkan1_13Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_14, PRkan1_14, PRkan1_14Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_15, PRkan1_15, PRkan1_15Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_16, PRkan1_16, PRkan1_16Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_17, PRkan1_17, PRkan1_17Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_18, PRkan1_18, PRkan1_18Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_19, PRkan1_19, PRkan1_19Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_20, PRkan1_20, PRkan1_20Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_21, PRkan1_21, PRkan1_21Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_22, PRkan1_22, PRkan1_22Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_23, PRkan1_23, PRkan1_23Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_24, PRkan1_24, PRkan1_24Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_25, PRkan1_25, PRkan1_25Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_26, PRkan1_26, PRkan1_26Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_27, PRkan1_27, PRkan1_27Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_28, PRkan1_28, PRkan1_28Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_29, PRkan1_29, PRkan1_29Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_30, PRkan1_30, PRkan1_30Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_31, PRkan1_31, PRkan1_31Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_32, PRkan1_32, PRkan1_32Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_33, PRkan1_33, PRkan1_33Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_34, PRkan1_34, PRkan1_34Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_35, PRkan1_35, PRkan1_35Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_36, PRkan1_36, PRkan1_36Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_37, PRkan1_37, PRkan1_37Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_38, PRkan1_38, PRkan1_38Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_39, PRkan1_39, PRkan1_39Title, returnImg, 60, 60);
            userInputImg(target, PRkan1_40, PRkan1_40, PRkan1_40Title, returnImg, 60, 60);

			
			break;
			
			case 7: // PR gif
			
			            userInputImg(target, PRgif_1, PRgif_1, PRgif_1Title, returnImg, 60, 60);
            userInputImg(target, PRgif_2, PRgif_2, PRgif_2Title, returnImg, 60, 60);
            userInputImg(target, PRgif_3, PRgif_3, PRgif_3Title, returnImg, 60, 60);
            userInputImg(target, PRgif_4, PRgif_4, PRgif_4Title, returnImg, 60, 60);
            userInputImg(target, PRgif_5, PRgif_5, PRgif_5Title, returnImg, 60, 60);
            userInputImg(target, PRgif_6, PRgif_6, PRgif_6Title, returnImg, 60, 60);
            userInputImg(target, PRgif_7, PRgif_7, PRgif_7Title, returnImg, 60, 60);
            userInputImg(target, PRgif_8, PRgif_8, PRgif_8Title, returnImg, 60, 60);
            userInputImg(target, PRgif_9, PRgif_9, PRgif_9Title, returnImg, 60, 60);
            userInputImg(target, PRgif_10, PRgif_10, PRgif_10Title, returnImg, 60, 60);
            userInputImg(target, PRgif_11, PRgif_11, PRgif_11Title, returnImg, 60, 60);
            userInputImg(target, PRgif_12, PRgif_12, PRgif_12Title, returnImg, 60, 60);
            userInputImg(target, PRgif_13, PRgif_13, PRgif_13Title, returnImg, 60, 60);
            userInputImg(target, PRgif_14, PRgif_14, PRgif_14Title, returnImg, 60, 60);
            userInputImg(target, PRgif_15, PRgif_15, PRgif_15Title, returnImg, 60, 60);
            userInputImg(target, PRgif_16, PRgif_16, PRgif_16Title, returnImg, 60, 60);
            userInputImg(target, PRgif_17, PRgif_17, PRgif_17Title, returnImg, 60, 60);
            userInputImg(target, PRgif_18, PRgif_18, PRgif_18Title, returnImg, 60, 60);
            userInputImg(target, PRgif_19, PRgif_19, PRgif_19Title, returnImg, 60, 60);
            userInputImg(target, PRgif_20, PRgif_20, PRgif_20Title, returnImg, 60, 60);
            userInputImg(target, PRgif_21, PRgif_21, PRgif_21Title, returnImg, 60, 60);
            userInputImg(target, PRgif_22, PRgif_22, PRgif_22Title, returnImg, 60, 60);
            userInputImg(target, PRgif_23, PRgif_23, PRgif_23Title, returnImg, 60, 60);
            userInputImg(target, PRgif_24, PRgif_24, PRgif_24Title, returnImg, 60, 60);
            userInputImg(target, PRgif_25, PRgif_25, PRgif_25Title, returnImg, 60, 60);
            userInputImg(target, PRgif_26, PRgif_26, PRgif_26Title, returnImg, 60, 60);
            userInputImg(target, PRgif_27, PRgif_27, PRgif_27Title, returnImg, 60, 60);
            userInputImg(target, PRgif_28, PRgif_28, PRgif_28Title, returnImg, 60, 60);
            userInputImg(target, PRgif_29, PRgif_29, PRgif_29Title, returnImg, 60, 60);
            userInputImg(target, PRgif_30, PRgif_30, PRgif_30Title, returnImg, 60, 60);

			
			break;
			
			
			case 8: // PR app INTER
			
			            userInputImg(target, PRappINTER_1, PRappINTER_1, PRappINTER_1Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_2, PRappINTER_2, PRappINTER_2Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_3, PRappINTER_3, PRappINTER_3Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_4, PRappINTER_4, PRappINTER_4Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_5, PRappINTER_5, PRappINTER_5Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_6, PRappINTER_6, PRappINTER_6Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_7, PRappINTER_7, PRappINTER_7Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_8, PRappINTER_8, PRappINTER_8Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_9, PRappINTER_9, PRappINTER_9Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_10, PRappINTER_10, PRappINTER_10Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_11, PRappINTER_11, PRappINTER_11Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_12, PRappINTER_12, PRappINTER_12Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_13, PRappINTER_13, PRappINTER_13Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_14, PRappINTER_14, PRappINTER_14Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_15, PRappINTER_15, PRappINTER_15Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_16, PRappINTER_16, PRappINTER_16Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_17, PRappINTER_17, PRappINTER_17Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_18, PRappINTER_18, PRappINTER_18Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_19, PRappINTER_19, PRappINTER_19Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_20, PRappINTER_20, PRappINTER_20Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_21, PRappINTER_21, PRappINTER_21Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_22, PRappINTER_22, PRappINTER_22Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_23, PRappINTER_23, PRappINTER_23Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_24, PRappINTER_24, PRappINTER_24Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_25, PRappINTER_25, PRappINTER_25Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_26, PRappINTER_26, PRappINTER_26Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_27, PRappINTER_27, PRappINTER_27Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_28, PRappINTER_28, PRappINTER_28Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_29, PRappINTER_29, PRappINTER_29Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_30, PRappINTER_30, PRappINTER_30Title, returnImg, 60, 60);
            userInputImg(target, PRappINTER_31, PRappINTER_31, PRappINTER_31Title, returnImg, 60, 60);

			
			break;
			
			case 9: // PR app ME
			
			            userInputImg(target, PRappME_1, PRappME_1, PRappME_1Title, returnImg, 60, 60);
            userInputImg(target, PRappME_2, PRappME_2, PRappME_2Title, returnImg, 60, 60);
            userInputImg(target, PRappME_3, PRappME_3, PRappME_3Title, returnImg, 60, 60);
            userInputImg(target, PRappME_4, PRappME_4, PRappME_4Title, returnImg, 60, 60);
            userInputImg(target, PRappME_5, PRappME_5, PRappME_5Title, returnImg, 60, 60);
            userInputImg(target, PRappME_6, PRappME_6, PRappME_6Title, returnImg, 60, 60);
            userInputImg(target, PRappME_7, PRappME_7, PRappME_7Title, returnImg, 60, 60);
            userInputImg(target, PRappME_8, PRappME_8, PRappME_8Title, returnImg, 60, 60);
            userInputImg(target, PRappME_9, PRappME_9, PRappME_9Title, returnImg, 60, 60);
            userInputImg(target, PRappME_10, PRappME_10, PRappME_10Title, returnImg, 60, 60);
            userInputImg(target, PRappME_11, PRappME_11, PRappME_11Title, returnImg, 60, 60);
            userInputImg(target, PRappME_12, PRappME_12, PRappME_12Title, returnImg, 60, 60);
            userInputImg(target, PRappME_13, PRappME_13, PRappME_13Title, returnImg, 60, 60);
            userInputImg(target, PRappME_14, PRappME_14, PRappME_14Title, returnImg, 60, 60);
            userInputImg(target, PRappME_15, PRappME_15, PRappME_15Title, returnImg, 60, 60);
            userInputImg(target, PRappME_16, PRappME_16, PRappME_16Title, returnImg, 60, 60);
            userInputImg(target, PRappME_17, PRappME_17, PRappME_17Title, returnImg, 60, 60);
            userInputImg(target, PRappME_18, PRappME_18, PRappME_18Title, returnImg, 60, 60);
            userInputImg(target, PRappME_19, PRappME_19, PRappME_19Title, returnImg, 60, 60);
            userInputImg(target, PRappME_20, PRappME_20, PRappME_20Title, returnImg, 60, 60);
            userInputImg(target, PRappME_21, PRappME_21, PRappME_21Title, returnImg, 60, 60);
            userInputImg(target, PRappME_22, PRappME_22, PRappME_22Title, returnImg, 60, 60);
            userInputImg(target, PRappME_23, PRappME_23, PRappME_23Title, returnImg, 60, 60);
            userInputImg(target, PRappME_24, PRappME_24, PRappME_24Title, returnImg, 60, 60);
            userInputImg(target, PRappME_25, PRappME_25, PRappME_25Title, returnImg, 60, 60);
            userInputImg(target, PRappME_26, PRappME_26, PRappME_26Title, returnImg, 60, 60);
            userInputImg(target, PRappME_27, PRappME_27, PRappME_27Title, returnImg, 60, 60);
            userInputImg(target, PRappME_28, PRappME_28, PRappME_28Title, returnImg, 60, 60);
            userInputImg(target, PRappME_29, PRappME_29, PRappME_29Title, returnImg, 60, 60);
            userInputImg(target, PRappME_30, PRappME_30, PRappME_30Title, returnImg, 60, 60);
            userInputImg(target, PRappME_31, PRappME_31, PRappME_31Title, returnImg, 60, 60);
            userInputImg(target, PRappME_32, PRappME_32, PRappME_32Title, returnImg, 60, 60);
            userInputImg(target, PRappME_33, PRappME_33, PRappME_33Title, returnImg, 60, 60);
            userInputImg(target, PRappME_34, PRappME_34, PRappME_34Title, returnImg, 60, 60);
            userInputImg(target, PRappME_35, PRappME_35, PRappME_35Title, returnImg, 60, 60);
            userInputImg(target, PRappME_36, PRappME_36, PRappME_36Title, returnImg, 60, 60);
            userInputImg(target, PRappME_37, PRappME_37, PRappME_37Title, returnImg, 60, 60);
            userInputImg(target, PRappME_38, PRappME_38, PRappME_38Title, returnImg, 60, 60);
            userInputImg(target, PRappME_39, PRappME_39, PRappME_39Title, returnImg, 60, 60);
            userInputImg(target, PRappME_40, PRappME_40, PRappME_40Title, returnImg, 60, 60);
            userInputImg(target, PRappME_41, PRappME_41, PRappME_41Title, returnImg, 60, 60);
            userInputImg(target, PRappME_42, PRappME_42, PRappME_42Title, returnImg, 60, 60);
            userInputImg(target, PRappME_43, PRappME_43, PRappME_43Title, returnImg, 60, 60);
            userInputImg(target, PRappME_44, PRappME_44, PRappME_44Title, returnImg, 60, 60);
            userInputImg(target, PRappME_45, PRappME_45, PRappME_45Title, returnImg, 60, 60);
            userInputImg(target, PRappME_46, PRappME_46, PRappME_46Title, returnImg, 60, 60);
            userInputImg(target, PRappME_47, PRappME_47, PRappME_47Title, returnImg, 60, 60);
            userInputImg(target, PRappME_48, PRappME_48, PRappME_48Title, returnImg, 60, 60);
            userInputImg(target, PRappME_49, PRappME_49, PRappME_49Title, returnImg, 60, 60);
            userInputImg(target, PRappME_50, PRappME_50, PRappME_50Title, returnImg, 60, 60);
            userInputImg(target, PRappME_51, PRappME_51, PRappME_51Title, returnImg, 60, 60);
            userInputImg(target, PRappME_52, PRappME_52, PRappME_52Title, returnImg, 60, 60);
            userInputImg(target, PRappME_53, PRappME_53, PRappME_53Title, returnImg, 60, 60);
            userInputImg(target, PRappME_54, PRappME_54, PRappME_54Title, returnImg, 60, 60);
            userInputImg(target, PRappME_55, PRappME_55, PRappME_55Title, returnImg, 60, 60);

			
			break;
			
			
			case 10: // PR app WeSe
			
			            userInputImg(target, PRappWeSe_1, PRappWeSe_1, PRappWeSe_1Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_2, PRappWeSe_2, PRappWeSe_2Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_3, PRappWeSe_3, PRappWeSe_3Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_4, PRappWeSe_4, PRappWeSe_4Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_5, PRappWeSe_5, PRappWeSe_5Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_6, PRappWeSe_6, PRappWeSe_6Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_7, PRappWeSe_7, PRappWeSe_7Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_8, PRappWeSe_8, PRappWeSe_8Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_9, PRappWeSe_9, PRappWeSe_9Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_10, PRappWeSe_10, PRappWeSe_10Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_11, PRappWeSe_11, PRappWeSe_11Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_12, PRappWeSe_12, PRappWeSe_12Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_13, PRappWeSe_13, PRappWeSe_13Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_14, PRappWeSe_14, PRappWeSe_14Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_15, PRappWeSe_15, PRappWeSe_15Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_16, PRappWeSe_16, PRappWeSe_16Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_17, PRappWeSe_17, PRappWeSe_17Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_18, PRappWeSe_18, PRappWeSe_18Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_19, PRappWeSe_19, PRappWeSe_19Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_20, PRappWeSe_20, PRappWeSe_20Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_21, PRappWeSe_21, PRappWeSe_21Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_22, PRappWeSe_22, PRappWeSe_22Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_23, PRappWeSe_23, PRappWeSe_23Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_24, PRappWeSe_24, PRappWeSe_24Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_25, PRappWeSe_25, PRappWeSe_25Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_26, PRappWeSe_26, PRappWeSe_26Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_27, PRappWeSe_27, PRappWeSe_27Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_28, PRappWeSe_28, PRappWeSe_28Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_29, PRappWeSe_29, PRappWeSe_29Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_30, PRappWeSe_30, PRappWeSe_30Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_31, PRappWeSe_31, PRappWeSe_31Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_32, PRappWeSe_32, PRappWeSe_32Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_33, PRappWeSe_33, PRappWeSe_33Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_34, PRappWeSe_34, PRappWeSe_34Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_35, PRappWeSe_35, PRappWeSe_35Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_36, PRappWeSe_36, PRappWeSe_36Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_37, PRappWeSe_37, PRappWeSe_37Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_38, PRappWeSe_38, PRappWeSe_38Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_39, PRappWeSe_39, PRappWeSe_39Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_40, PRappWeSe_40, PRappWeSe_40Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_41, PRappWeSe_41, PRappWeSe_41Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_42, PRappWeSe_42, PRappWeSe_42Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_43, PRappWeSe_43, PRappWeSe_43Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_44, PRappWeSe_44, PRappWeSe_44Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_45, PRappWeSe_45, PRappWeSe_45Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_46, PRappWeSe_46, PRappWeSe_46Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_47, PRappWeSe_47, PRappWeSe_47Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_48, PRappWeSe_48, PRappWeSe_48Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_49, PRappWeSe_49, PRappWeSe_49Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_50, PRappWeSe_50, PRappWeSe_50Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_51, PRappWeSe_51, PRappWeSe_51Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_52, PRappWeSe_52, PRappWeSe_52Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_53, PRappWeSe_53, PRappWeSe_53Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_54, PRappWeSe_54, PRappWeSe_54Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_55, PRappWeSe_55, PRappWeSe_55Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_56, PRappWeSe_56, PRappWeSe_56Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_57, PRappWeSe_57, PRappWeSe_57Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_58, PRappWeSe_58, PRappWeSe_58Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_59, PRappWeSe_59, PRappWeSe_59Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_60, PRappWeSe_60, PRappWeSe_60Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_61, PRappWeSe_61, PRappWeSe_61Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_62, PRappWeSe_62, PRappWeSe_62Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_63, PRappWeSe_63, PRappWeSe_63Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_64, PRappWeSe_64, PRappWeSe_64Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_65, PRappWeSe_65, PRappWeSe_65Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_66, PRappWeSe_66, PRappWeSe_66Title, returnImg, 60, 60);
            userInputImg(target, PRappWeSe_67, PRappWeSe_67, PRappWeSe_67Title, returnImg, 60, 60);

			
			break;
			
			case 11: // PR app NOTE
			
			            userInputImg(target, PRappNOTE_1, PRappNOTE_1, PRappNOTE_1Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_2, PRappNOTE_2, PRappNOTE_2Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_3, PRappNOTE_3, PRappNOTE_3Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_4, PRappNOTE_4, PRappNOTE_4Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_5, PRappNOTE_5, PRappNOTE_5Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_6, PRappNOTE_6, PRappNOTE_6Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_7, PRappNOTE_7, PRappNOTE_7Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_8, PRappNOTE_8, PRappNOTE_8Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_9, PRappNOTE_9, PRappNOTE_9Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_10, PRappNOTE_10, PRappNOTE_10Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_11, PRappNOTE_11, PRappNOTE_11Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_12, PRappNOTE_12, PRappNOTE_12Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_13, PRappNOTE_13, PRappNOTE_13Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_14, PRappNOTE_14, PRappNOTE_14Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_15, PRappNOTE_15, PRappNOTE_15Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_16, PRappNOTE_16, PRappNOTE_16Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_17, PRappNOTE_17, PRappNOTE_17Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_18, PRappNOTE_18, PRappNOTE_18Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_19, PRappNOTE_19, PRappNOTE_19Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_20, PRappNOTE_20, PRappNOTE_20Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_21, PRappNOTE_21, PRappNOTE_21Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_22, PRappNOTE_22, PRappNOTE_22Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_23, PRappNOTE_23, PRappNOTE_23Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_24, PRappNOTE_24, PRappNOTE_24Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_25, PRappNOTE_25, PRappNOTE_25Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_26, PRappNOTE_26, PRappNOTE_26Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_27, PRappNOTE_27, PRappNOTE_27Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_28, PRappNOTE_28, PRappNOTE_28Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_29, PRappNOTE_29, PRappNOTE_29Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_30, PRappNOTE_30, PRappNOTE_30Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_31, PRappNOTE_31, PRappNOTE_31Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_32, PRappNOTE_32, PRappNOTE_32Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_33, PRappNOTE_33, PRappNOTE_33Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_34, PRappNOTE_34, PRappNOTE_34Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_35, PRappNOTE_35, PRappNOTE_35Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_36, PRappNOTE_36, PRappNOTE_36Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_37, PRappNOTE_37, PRappNOTE_37Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_38, PRappNOTE_38, PRappNOTE_38Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_39, PRappNOTE_39, PRappNOTE_39Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_40, PRappNOTE_40, PRappNOTE_40Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_41, PRappNOTE_41, PRappNOTE_41Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_42, PRappNOTE_42, PRappNOTE_42Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_43, PRappNOTE_43, PRappNOTE_43Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_44, PRappNOTE_44, PRappNOTE_44Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_45, PRappNOTE_45, PRappNOTE_45Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_46, PRappNOTE_46, PRappNOTE_46Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_47, PRappNOTE_47, PRappNOTE_47Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_48, PRappNOTE_48, PRappNOTE_48Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_49, PRappNOTE_49, PRappNOTE_49Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_50, PRappNOTE_50, PRappNOTE_50Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_51, PRappNOTE_51, PRappNOTE_51Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_52, PRappNOTE_52, PRappNOTE_52Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_53, PRappNOTE_53, PRappNOTE_53Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_54, PRappNOTE_54, PRappNOTE_54Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_55, PRappNOTE_55, PRappNOTE_55Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_56, PRappNOTE_56, PRappNOTE_56Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_57, PRappNOTE_57, PRappNOTE_57Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_58, PRappNOTE_58, PRappNOTE_58Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_59, PRappNOTE_59, PRappNOTE_59Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_60, PRappNOTE_60, PRappNOTE_60Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_61, PRappNOTE_61, PRappNOTE_61Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_62, PRappNOTE_62, PRappNOTE_62Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_63, PRappNOTE_63, PRappNOTE_63Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_64, PRappNOTE_64, PRappNOTE_64Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_65, PRappNOTE_65, PRappNOTE_65Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_66, PRappNOTE_66, PRappNOTE_66Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_67, PRappNOTE_67, PRappNOTE_67Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_68, PRappNOTE_68, PRappNOTE_68Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_69, PRappNOTE_69, PRappNOTE_69Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_70, PRappNOTE_70, PRappNOTE_70Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_71, PRappNOTE_71, PRappNOTE_71Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_72, PRappNOTE_72, PRappNOTE_72Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_73, PRappNOTE_73, PRappNOTE_73Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_74, PRappNOTE_74, PRappNOTE_74Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_75, PRappNOTE_75, PRappNOTE_75Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_76, PRappNOTE_76, PRappNOTE_76Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_77, PRappNOTE_77, PRappNOTE_77Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_78, PRappNOTE_78, PRappNOTE_78Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_79, PRappNOTE_79, PRappNOTE_79Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_80, PRappNOTE_80, PRappNOTE_80Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_81, PRappNOTE_81, PRappNOTE_81Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_82, PRappNOTE_82, PRappNOTE_82Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_83, PRappNOTE_83, PRappNOTE_83Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_84, PRappNOTE_84, PRappNOTE_84Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_85, PRappNOTE_85, PRappNOTE_85Title, returnImg, 60, 60);
            userInputImg(target, PRappNOTE_86, PRappNOTE_86, PRappNOTE_86Title, returnImg, 60, 60);
			break;            
            
            
            case 12: //PR FB
                        userInputImg(target, PRFB_1, PRFB_1, PRFB_1Title, returnImg, 60, 60);
            userInputImg(target, PRFB_2, PRFB_2, PRFB_2Title, returnImg, 60, 60);
            userInputImg(target, PRFB_3, PRFB_3, PRFB_3Title, returnImg, 60, 60);
            userInputImg(target, PRFB_4, PRFB_4, PRFB_4Title, returnImg, 60, 60);
            userInputImg(target, PRFB_5, PRFB_5, PRFB_5Title, returnImg, 60, 60);
            userInputImg(target, PRFB_6, PRFB_6, PRFB_6Title, returnImg, 60, 60);
            userInputImg(target, PRFB_7, PRFB_7, PRFB_7Title, returnImg, 60, 60);
            userInputImg(target, PRFB_8, PRFB_8, PRFB_8Title, returnImg, 60, 60);
            userInputImg(target, PRFB_9, PRFB_9, PRFB_9Title, returnImg, 60, 60);
            userInputImg(target, PRFB_10, PRFB_10, PRFB_10Title, returnImg, 60, 60);
            userInputImg(target, PRFB_11, PRFB_11, PRFB_11Title, returnImg, 60, 60);
            userInputImg(target, PRFB_12, PRFB_12, PRFB_12Title, returnImg, 60, 60);
            userInputImg(target, PRFB_13, PRFB_13, PRFB_13Title, returnImg, 60, 60);
            userInputImg(target, PRFB_14, PRFB_14, PRFB_14Title, returnImg, 60, 60);
            userInputImg(target, PRFB_15, PRFB_15, PRFB_15Title, returnImg, 60, 60);
            userInputImg(target, PRFB_16, PRFB_16, PRFB_16Title, returnImg, 60, 60);
            userInputImg(target, PRFB_17, PRFB_17, PRFB_17Title, returnImg, 60, 60);
            userInputImg(target, PRFB_18, PRFB_18, PRFB_18Title, returnImg, 60, 60);
            userInputImg(target, PRFB_19, PRFB_19, PRFB_19Title, returnImg, 60, 60);
            userInputImg(target, PRFB_20, PRFB_20, PRFB_20Title, returnImg, 60, 60);
            userInputImg(target, PRFB_21, PRFB_21, PRFB_21Title, returnImg, 60, 60);
            userInputImg(target, PRFB_22, PRFB_22, PRFB_22Title, returnImg, 60, 60);
            userInputImg(target, PRFB_23, PRFB_23, PRFB_23Title, returnImg, 60, 60);
            userInputImg(target, PRFB_24, PRFB_24, PRFB_24Title, returnImg, 60, 60);

            break;

			


   // case: 编号     
/*
         case xx:
            在这里添加 
            break;
*/            
//    
        default:
            emptyContainer.innerHTML = '<b style="color:orange">空白表情容器</b>';
            return;
    }
    
}
/* 自定义内容到此结束 */
/*------------------------------------*/






// 用户操作函数
function userInputPlainText(target, textBox,titleBox, func){
   var textlength = textBox.length;
    for (var j=0;j<textlength; j++){
        var newElementEx = document.createElement('a'); 
        var imgaa = document.createElement('img');
        imgaa.style.margin = "4px";
        newElementEx.onclick = func;
        newElementEx._target = textarea;
        newElementEx.style.cursor = 'pointer';
        imgaa.alt = titleBox[j];
        imgaa.useMap = textBox[j];
        target.appendChild(newElementEx);
        newElementEx.appendChild(imgaa);
   }
   target.parentNode.insertAfter(document.createElement('br'));
}

function userInputImg(target,thumbURL, targetURL, targetTitle, func, ImgWidth, ImgHeight){
    var emotionlength = targetURL.length;
    for (var i = 0; i<emotionlength; i++)
    {
        target.appendChild(
                    createButton(
                        textarea,     //对象
                        func,   //方法
                        targetTitle[i],   //提示文字
                        ImgWidth, // 缩略图宽
                        ImgHeight, //缩略图高
                        targetURL[i],thumbURL[i])); // 贴图地址和缩略图地址
    }

}


// 返回纯文本

function insertText(selector, text) {
    var target = document.querySelector(selector);
    var startPos = target.selectionStart;
    //var endPos = target.selectionEnd;
    var value = target.value;
    target.value = value.slice(0, startPos) + text + value.slice(startPos);
}


function returnPlainText(event) {
    var link, textarea, s, selectedTarget;
    link = event.currentTarget;
    textarea = link._target;
    selectedTarget = event.target;
    insertText("textarea", selectedTarget.useMap);
    // 定位光标
//    alert(startPos);
//    if(typeof textarea.selectionStart === 'number' && typeof textarea.selectionEnd === 'number'){
//        textarea.value = textarea.value.substring(0,startPos) + selectedTarget.innerHTML + textarea.value.substring(endPos, textarea.value.length);
//    }else{
//        textarea.value +=selectedTarget.useMap;
//    }
    event.preventDefault();
}

// 返回Wincode代码
function returnImg(event) {
    var link, textarea, s, selectedTarget;
    link = event.currentTarget;
    textarea = link._target;
    selectedTarget = event.target;
//    textarea.value += '[img]'+selectedTarget.useMap+'[/img]';
    var inserttext = '[img]'+selectedTarget.useMap+'[/img]';
    insertText("textarea", inserttext);
    event.preventDefault();
}

// ImgButton
function createButton(target, func, title, width, height, src, smallsrc) {
    // target: 控制对象
    // func:     方法
    // title:   提示文字
    // width,height  外观
    // src:  路径
    var img, button;
    img = document.createElement('img');
    img.width = width;
    img.height = height;
    img.style.borderTop = img.style.borderLeft = "1px solid #ccc";
    img.style.borderRight = img.style.borderBottom = "1px solid #888";
    img.style.marginRight = "2px";
    img.src = smallsrc;
    img.useMap = src;
    button = document.createElement('a');
    button._target = target;
    button.title = title;
    button.href = '#';
    button.onclick = func;
    button.style.cursor="pointer";
    button.appendChild(img);
    button.style.borderBottom = '1px solid';
    return button;       
}



// 清空容器用函数
function closeHandler(event){
    var deletTarget = document.getElementById('emotioncontainer9999');
    deletTarget.parentNode.removeChild(deletTarget);
    emptyContainer = document.createElement('div');
    emptyContainer.id = 'emotioncontainer9999';
    textarea.parentNode.insertBefore(emptyContainer, textarea);
}
function closeSetupHandler(event){
    var deletTarget = document.getElementById('setup');
    deletTarget.parentNode.removeChild(deletTarget);
}
function reSetupHandler(event){
    var deletTarget = document.getElementById('setup');
    deletTarget.parentNode.removeChild(deletTarget);
    user = prompt("请输入不想使用的表情组, 从0开始以逗号分隔, 如0,1,2,3, 可以留空表示全部显示","");
    setCookie("setup", user, 30);
    //alert(document.location.href);
   
}



//展开动作
function extendHandler(event){
    var newElement2,link,selectedTarget;
    
    /*清空当前容器*/
    closeHandler();
    
    newElement2 = document.createElement('div');
    newElement2.style.border = '1px solid #9999FF';
    //newElement2.innerHTML = '&nbsp;&nbsp;';
    newElement2.style.background = '#FCFCFC';
    newElement2.style.paddingLeft = '4px';
    newElement2.style.height = '200px';
    newElement2.style.width = textarea.style.width;
    newElement2.style.overflow = 'auto';
 //   newElement2.style.position = 'fixed';
   // newElement2.style.top = '0';
   // newElement2.style.left = '5px';
    emptyContainer.appendChild(newElement2);
    
    
    /*表情载入*/
    selectedTarget = event.target;
    var loadIndex = selectedTarget.id - '100100';
    //    alert(loadIndex);
    loadingHandler(loadIndex,newElement2);
    
    event.preventDefault();
}

//生成栏目
function createMenuItem(target,func,title, loadTitle){
    var newElement;
    newElement = document.createElement('a');
    newElement.style.height = '40px';
    newElement.style.width = '100px';
    newElement.innerHTML = '  [' +title+ ']'+'&nbsp;';
    newElement.onclick = func;
    newElement.style.cursor = 'pointer';
    newElement.id = loadTitle;
    if(title!==undefined){
    target.appendChild(newElement);
    }
}
function setupHandler(){
            /*------------------------------------*/
    var user=getCookie("setup");
    if (document.getElementById('setup')){return;}
    if (user != "") {
    newElement = document.createElement('div');
    newElement.id = 'setup';
    newElement.style.left = '43%';
    newElement.style.bottom = '100px';
    newElement.style.width = '400px';
    newElement.style.height = '50px';
    newElement.style.border = '3px solid deeppink';
    newElement.style.padding = '5px 5px';
   
    newElement.style.background = '#eee';
    newElement.innerHTML = ' ';
    document.body.appendChild(newElement);
    document.getElementById('setup').style.position = 'fixed';
    /*
    var submitform = document.createElement('fieldset');
    submitform.id = 'formsetup';
    submitform.style.margin = "10px 10px";
    submitform.innerHTML =' <legend>勾选启用的表情组</legend>';
    document.getElementById('setup').appendChild(submitform);
    for(j=0;j<ItemTitleArray.length;j++)
    {
        var checkBoxItem = document.createElement('input');
        checkBoxItem.type = 'checkbox';
        checkBoxItem.name = ItemTitleArray[j];
        checkBoxItem.value = loadTitleArray[j];
        document.getElementById('formsetup').appendChild(checkBoxItem);
        var descriptionWord = document.createElement('b');
        descriptionWord.innerHTML = ItemTitleArray[j]+'  ';
        document.getElementById('formsetup').appendChild(descriptionWord);
    }*/
    var cookienow = document.createElement('b');
    cookienow.innerHTML = user + '<br>';    
    document.getElementById('setup').appendChild(cookienow);
    var additionalInfo = document.createElement('button');
    additionalInfo.type = 'submit';
    additionalInfo.name = 'setup';
    additionalInfo.innerHTML = ' 保存并关闭 ';
    additionalInfo.onclick = closeSetupHandler;
    additionalInfo.style.cursor = 'pointer';
    document.getElementById('setup').appendChild(additionalInfo);
        
    var additionalInfo2 = document.createElement('button');
    additionalInfo2.type = 'submit';
    additionalInfo2.name = 'setup';
    additionalInfo2.innerHTML = ' 重新设定 ';
    additionalInfo2.onclick = reSetupHandler;
    additionalInfo2.style.cursor = 'pointer';
    document.getElementById('setup').appendChild(additionalInfo2);
/*    
     var additionalInfo = document.createElement('button');
    additionalInfo.type = 'submit';
    additionalInfo.name = 'setup';
    additionalInfo.value = ' 确定 ';
    additionalInfo.onclick = closeSetupHandler;
    additionalInfo.style.cursor = 'pointer';
    document.getElementById('formsetup').appendChild(additionalInfo);
    
     var additionalInfo = document.createElement('button');
    additionalInfo.type = 'submit';
    additionalInfo.name = 'setup';
    additionalInfo.value = ' 默认值 ';
    additionalInfo.onclick = closeSetupHandler;
    additionalInfo.style.cursor = 'pointer';
    document.getElementById('formsetup').appendChild(additionalInfo);
    */
        //alert("Welcome again " + user);
    } else {
       user = prompt("请输入不想使用的表情组, 从0开始以逗号分隔, 如0,1,2,3, 可以留空表示全部显示","");
       if (user != "" && user != null) {
           setCookie("setup", user, 30);
       }
    }
    
}
// 生成项目
function createMenuElement(target, listNumber){
    var newElement;
    newElement = document.createElement('div');
    newElement.style.border = '1px solid #9999FF';
    newElement.id='itemlist';
    newElement.align = 'left';
    newElement.style.paddingLeft = '4px';
    newElement.innerHTML = ' <b style="color:gold">⑨_⑨ </b> ';
    newElement.style.background = '#FCFCFC';
    newElement.style.height = '44px';
    newElement.style.width = '100%' ;
    //document.getElementById('itemlist').style.position = 'relative';
    target.parentNode.insertBefore(newElement, target);
    
    for (var i = 0; i < listNumber; i++) {
        createMenuItem(newElement,extendHandler,ItemTitleArray[i],loadTitleArray[i]);
    }
    
     var brElement = document.createElement('br');

    
    
    var additionalInfo = document.createElement('a');
    additionalInfo.innerHTML = ' <b style="color:red"> [隐藏] </b> ';
    additionalInfo.onclick = closeHandler;
    additionalInfo.style.cursor = 'pointer';
    newElement.appendChild(additionalInfo);
    //newElement.appendChild(brElement);
    var additionalInfo3 = document.createElement('a');
    additionalInfo3.innerHTML = '<b style="color:deeppink;z-index:1001;"> [禁用表情] </b>';
    additionalInfo3.onclick = setupHandler;
    additionalInfo3.style.cursor = 'pointer';
    newElement.appendChild(additionalInfo3);
    
//    var additionalInfo2 = document.createElement('b');
//    additionalInfo2.innerHTML = ' <a style="color:deeppink;text-align:right;" href="http://blog.nekohand.moe/" target="_blank"> eddie32 </a> ';
//    newElement.appendChild(additionalInfo2);
   
   
}

// 设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
     history.go(0);
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}






var KFOL = {
    init: function(){

textareas = document.getElementsByTagName('textarea');
if (!textareas.length) { return; }
        textarea = textareas[0];
        emptyContainer = document.createElement('div');
        emptyContainer.id = 'emotioncontainer9999';
        createMenuElement(textarea, totalNum); 
        textarea.parentNode.insertBefore(emptyContainer, textarea);
    }
}
KFOL.init();



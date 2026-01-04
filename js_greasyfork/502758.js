// ==UserScript==
// @name           SexInSex扩展表情
// @description    sexinsex.phygelus.second
// @include        *://*sexinsex.net/*
// @include        *://*sis.xxx/*
// @include        *://*bluerockcafe.com/*
// @include        *://174.127.195*/*
// @include        *://*1*2*3*.com/*
// @include        *://*3d3d3d.net/*
// @include        *://*9dizhi.com/*
// @include        *://*bluerocks.cc/*
// @include        *://*bobo123.one/*
// @include        *://*btnihao.com/*
// @include        *://*catsis.info/*
// @include        *://*d44.icu/*
// @include        *://*easygo1.net/*
// @include        *://*fastspeedtank.net/*
// @include        *://*gapipi.com/*
// @include        *://*goeasyspeed.net/*
// @include        *://*happybar8.net/*
// @include        *://*joyplacetobe.com/*
// @include        *://*nihao*.net/*
// @include        *://*pinktechmate.net/*
// @include        *://*popopo.me/*
// @include        *://*relaxhappylife.com/*
// @include        *://*sis*.net/*
// @include        *://*solc.one/*
// @include        *://*stepncafe.com/*
// @include        *://*swimtoofast.com/*
// @include        *://*t*t*t*.com/*
// @include        *://*thatsucks.info/*
// @include        *://*twinai.xyz/*
// @include        *://*v2r.club/*
// @include        *://*vr1p.com/*
// @include        *://*whereismy*.com/*
// @include        *://*win4you.net/*
// @include        *://*yaayaa.net/*
// @require        http://code.jquery.com/jquery-latest.min.js
// @author         phygelus
// @version        0.2.1
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @namespace      sexinsex.phygelus.second
// @license      MIT License  //共享规则
// @downloadURL https://update.greasyfork.org/scripts/502758/SexInSex%E6%89%A9%E5%B1%95%E8%A1%A8%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/502758/SexInSex%E6%89%A9%E5%B1%95%E8%A1%A8%E6%83%85.meta.js
// ==/UserScript==


//这个是@congxz6688在2014年发布的CL.18P2P.SIS_MultiPage_smilies（https://sleazyfork.org/zh-CN/scripts/145-cl-18p2p-sis-multipage-smilies）
//由于没有后续更新，因此在这位大佬的基础上，做了论坛最新地址的适配和表情的更新，代码基本上没有动。

//2012.5.8 常用表情默认选择
var modi0 = "1:4,1:32,1:0,1:29,1:20,2:15,2:0,2:28,1:38,1:33,1:9,1:15,1:31,2:14,2:16,2:18,1:22,1:11,1:8,1:63,1:13,2:30,2:33,2:21,1:1,1:7,1:42,1:27,1:2,2:4,2:17,2:12,5:12,5:29,5:14,5:19,3:7,3:8,3:21,3:15,5:15,5:0,5:28,5:3,3:10,3:17,3:18,3:43,4:8,4:21,4:23,4:14,4:30,4:29,4:25,4:28,4:12,4:16,4:19,4:13,4:0,4:3,4:1,4:2";
if (!GM_getValue("0_modifyIndx")) {
	GM_setValue("0_modifyIndx", modi0)
}

//编辑此处可修改表情种类名称。多余种类可删除，比如，可以把“其它”全部删掉，与之对应的allSmile[4][5][6]也将不会被显示。
var smileName = ["常用", "QQ", "贴吧", "猫&FF", "洋葱头", "阿狸", "兔斯基"];

//下面是对应的几组表情地址，分别对应上面的各种表情，可增减，但上下要一一对应。增添的地址需用""包起来，相互间用“,”隔开。
var allSmile = new Array; //这里不能修改
allSmile[0] = [];
allSmile[1] = ["https://pic.imgdb.cn/item/66b1b8aad9c307b7e9549a50.gif", "https://pic.imgdb.cn/item/66b1b8aad9c307b7e9549a55.gif", "https://pic.imgdb.cn/item/66b1b8aad9c307b7e9549a66.gif", "https://pic.imgdb.cn/item/66b1b8aad9c307b7e9549a6c.gif", "https://pic.imgdb.cn/item/66b1b8aad9c307b7e9549a4a.gif", "https://pic.imgdb.cn/item/66b1c309d9c307b7e96647d5.gif", "https://pic.imgdb.cn/item/66b1c309d9c307b7e96647dc.gif", "https://pic.imgdb.cn/item/66b1c309d9c307b7e96647e8.gif", "https://pic.imgdb.cn/item/66b1c309d9c307b7e96647f5.gif", "https://pic.imgdb.cn/item/66b1c309d9c307b7e96647c8.gif", "https://pic.imgdb.cn/item/66b1c317d9c307b7e96652ef.gif", "https://pic.imgdb.cn/item/66b1c317d9c307b7e9665301.gif", "https://pic.imgdb.cn/item/66b1c317d9c307b7e966531f.gif", "https://pic.imgdb.cn/item/66b1c317d9c307b7e9665350.gif", "https://pic.imgdb.cn/item/66b1c317d9c307b7e96652d5.gif", "https://pic.imgdb.cn/item/66b1c330d9c307b7e96670e1.gif", "https://pic.imgdb.cn/item/66b1c330d9c307b7e96670ed.gif", "https://pic.imgdb.cn/item/66b1c330d9c307b7e96670f2.gif", "https://pic.imgdb.cn/item/66b1c331d9c307b7e96670f9.gif", "https://pic.imgdb.cn/item/66b1c330d9c307b7e96670da.gif", "https://pic.imgdb.cn/item/66b1c340d9c307b7e9667fe2.gif", "https://pic.imgdb.cn/item/66b1c340d9c307b7e9667fe8.gif", "https://pic.imgdb.cn/item/66b1c340d9c307b7e9667fed.gif", "https://pic.imgdb.cn/item/66b1c340d9c307b7e9667fd1.gif", "https://pic.imgdb.cn/item/66b1c340d9c307b7e9667fdb.gif", "https://pic.imgdb.cn/item/66b1c34ad9c307b7e9668818.gif", "https://pic.imgdb.cn/item/66b1c34ad9c307b7e966882c.gif", "https://pic.imgdb.cn/item/66b1c34ad9c307b7e966883a.gif", "https://pic.imgdb.cn/item/66b1c34ad9c307b7e9668847.gif", "https://pic.imgdb.cn/item/66b1c34ad9c307b7e9668802.gif", "https://pic.imgdb.cn/item/66b1c395d9c307b7e966d535.gif", "https://pic.imgdb.cn/item/66b1c395d9c307b7e966d543.gif", "https://pic.imgdb.cn/item/66b1c395d9c307b7e966d54b.gif", "https://pic.imgdb.cn/item/66b1c395d9c307b7e966d555.gif", "https://pic.imgdb.cn/item/66b1c395d9c307b7e966d529.gif", "https://pic.imgdb.cn/item/66b1c39fd9c307b7e966df19.gif", "https://pic.imgdb.cn/item/66b1c39fd9c307b7e966df25.gif", "https://pic.imgdb.cn/item/66b1c39fd9c307b7e966df30.gif", "https://pic.imgdb.cn/item/66b1c39fd9c307b7e966df37.gif", "https://pic.imgdb.cn/item/66b1c39fd9c307b7e966df0f.gif", "https://pic.imgdb.cn/item/66b1c3a9d9c307b7e966e91f.gif", "https://pic.imgdb.cn/item/66b1c3a9d9c307b7e966e928.gif", "https://pic.imgdb.cn/item/66b1c3aad9c307b7e966e92d.gif", "https://pic.imgdb.cn/item/66b1c3aad9c307b7e966e933.gif", "https://pic.imgdb.cn/item/66b1c3a9d9c307b7e966e915.gif", "https://pic.imgdb.cn/item/66b1c3b2d9c307b7e966f10b.gif", "https://pic.imgdb.cn/item/66b1c3b2d9c307b7e966f110.gif", "https://pic.imgdb.cn/item/66b1c3b2d9c307b7e966f116.gif", "https://pic.imgdb.cn/item/66b1c3b2d9c307b7e966f135.gif", "https://pic.imgdb.cn/item/66b1c3b2d9c307b7e966f0f9.gif", "https://pic.imgdb.cn/item/66b1c3bcd9c307b7e966f9d3.gif", "https://pic.imgdb.cn/item/66b1c3bcd9c307b7e966f9ea.gif", "https://pic.imgdb.cn/item/66b1c3bdd9c307b7e966fa3e.gif", "https://pic.imgdb.cn/item/66b1c3bdd9c307b7e966fb4e.gif", "https://pic.imgdb.cn/item/66b1c3bcd9c307b7e966f9cc.gif", "https://pic.imgdb.cn/item/66b1c3c9d9c307b7e9670ba8.gif", "https://pic.imgdb.cn/item/66b1c3c9d9c307b7e9670bb5.gif", "https://pic.imgdb.cn/item/66b1c3c9d9c307b7e9670bbe.gif", "https://pic.imgdb.cn/item/66b1c3c9d9c307b7e9670bc4.gif", "https://pic.imgdb.cn/item/66b1c3c9d9c307b7e9670ba0.gif", "https://pic.imgdb.cn/item/66b1c3d3d9c307b7e9671305.gif", "https://pic.imgdb.cn/item/66b1c3d3d9c307b7e967130d.gif", "https://pic.imgdb.cn/item/66b1c3d3d9c307b7e9671313.gif", "https://pic.imgdb.cn/item/66b1c3d3d9c307b7e9671318.gif", "https://pic.imgdb.cn/item/66b1c3d3d9c307b7e96712f6.gif", "https://pic.imgdb.cn/item/66b1c3dbd9c307b7e9671a9b.gif", "https://pic.imgdb.cn/item/66b1c3dbd9c307b7e9671aa4.gif", "https://pic.imgdb.cn/item/66b1c3dbd9c307b7e9671aaf.gif", "https://pic.imgdb.cn/item/66b1c3dbd9c307b7e9671ab4.gif", "https://pic.imgdb.cn/item/66b1c3dbd9c307b7e9671a8e.gif", "https://pic.imgdb.cn/item/66b1c3e9d9c307b7e967282e.gif", "https://pic.imgdb.cn/item/66b1c3e9d9c307b7e967283c.gif", "https://pic.imgdb.cn/item/66b1c3e9d9c307b7e967286b.gif", "https://pic.imgdb.cn/item/66b1c3e9d9c307b7e9672874.gif", "https://pic.imgdb.cn/item/66b1c3e9d9c307b7e9672826.gif", "https://pic.imgdb.cn/item/66b1c3f3d9c307b7e96731a3.gif", "https://pic.imgdb.cn/item/66b1c3f3d9c307b7e96731ac.gif", "https://pic.imgdb.cn/item/66b1c3f3d9c307b7e96731b1.gif", "https://pic.imgdb.cn/item/66b1c3f3d9c307b7e96731b8.gif", "https://pic.imgdb.cn/item/66b1c3f3d9c307b7e9673199.gif", "https://pic.imgdb.cn/item/66b1c3fcd9c307b7e9673a0b.png", "https://pic.imgdb.cn/item/66b1c3fcd9c307b7e9673a13.gif", "https://pic.imgdb.cn/item/66b1c3fcd9c307b7e9673a1a.gif", "https://pic.imgdb.cn/item/66b1c3fcd9c307b7e9673a1f.gif", "https://pic.imgdb.cn/item/66b1c3fcd9c307b7e9673a01.gif", "https://pic.imgdb.cn/item/66b1c426d9c307b7e96762a3.gif", "https://pic.imgdb.cn/item/66b1c426d9c307b7e96762bc.gif", "https://pic.imgdb.cn/item/66b1c426d9c307b7e96762dc.gif", "https://pic.imgdb.cn/item/66b1c426d9c307b7e96762e5.gif", "https://pic.imgdb.cn/item/66b1c426d9c307b7e967629e.gif", "https://pic.imgdb.cn/item/66b1c42ed9c307b7e9676d90.gif", "https://pic.imgdb.cn/item/66b1c42ed9c307b7e9676d95.gif", "https://pic.imgdb.cn/item/66b1c42ed9c307b7e9676d9d.gif"];
allSmile[2] = ["https://pic.imgdb.cn/item/66b1cebad9c307b7e97a12b6.png", "https://pic.imgdb.cn/item/66b1cebad9c307b7e97a12d1.png", "https://pic.imgdb.cn/item/66b1cebad9c307b7e97a12e5.png", "https://pic.imgdb.cn/item/66b1cebad9c307b7e97a12f1.png", "https://pic.imgdb.cn/item/66b1cebad9c307b7e97a12aa.png", "https://pic.imgdb.cn/item/66b1ceccd9c307b7e97a2afc.png", "https://pic.imgdb.cn/item/66b1ceccd9c307b7e97a2b15.png", "https://pic.imgdb.cn/item/66b1ceccd9c307b7e97a2b25.png", "https://pic.imgdb.cn/item/66b1ceccd9c307b7e97a2b2a.png", "https://pic.imgdb.cn/item/66b1ceccd9c307b7e97a2aee.png", "https://pic.imgdb.cn/item/66b1ced5d9c307b7e97a3826.png", "https://pic.imgdb.cn/item/66b1ced5d9c307b7e97a3830.png", "https://pic.imgdb.cn/item/66b1ced6d9c307b7e97a383a.png", "https://pic.imgdb.cn/item/66b1ced6d9c307b7e97a3845.png", "https://pic.imgdb.cn/item/66b1ced5d9c307b7e97a380a.png", "https://pic.imgdb.cn/item/66b1ceded9c307b7e97a4351.png", "https://pic.imgdb.cn/item/66b1ceded9c307b7e97a4362.png", "https://pic.imgdb.cn/item/66b1ceded9c307b7e97a436e.png", "https://pic.imgdb.cn/item/66b1ceded9c307b7e97a4379.png", "https://pic.imgdb.cn/item/66b1ceded9c307b7e97a4340.png", "https://pic.imgdb.cn/item/66b1cee7d9c307b7e97a4f10.png", "https://pic.imgdb.cn/item/66b1cee7d9c307b7e97a4f15.png", "https://pic.imgdb.cn/item/66b1cee7d9c307b7e97a4f19.png", "https://pic.imgdb.cn/item/66b1cee7d9c307b7e97a4f1d.png", "https://pic.imgdb.cn/item/66b1cee7d9c307b7e97a4f01.png", "https://pic.imgdb.cn/item/66b1ceefd9c307b7e97a572d.png", "https://pic.imgdb.cn/item/66b1ceefd9c307b7e97a573d.png", "https://pic.imgdb.cn/item/66b1ceefd9c307b7e97a5753.png", "https://pic.imgdb.cn/item/66b1ceefd9c307b7e97a5758.png", "https://pic.imgdb.cn/item/66b1ceefd9c307b7e97a5721.png", "https://pic.imgdb.cn/item/66b1cef7d9c307b7e97a5f73.png", "https://pic.imgdb.cn/item/66b1cef7d9c307b7e97a5f7a.png", "https://pic.imgdb.cn/item/66b1cef7d9c307b7e97a5f81.png", "https://pic.imgdb.cn/item/66b1cef7d9c307b7e97a5f88.png", "https://pic.imgdb.cn/item/66b1cef7d9c307b7e97a5f67.png", "https://pic.imgdb.cn/item/66b1cf00d9c307b7e97a65c3.png", "https://pic.imgdb.cn/item/66b1cf00d9c307b7e97a65c9.png", "https://pic.imgdb.cn/item/66b1cf00d9c307b7e97a65d3.png", "https://pic.imgdb.cn/item/66b1cf00d9c307b7e97a65dc.png", "https://pic.imgdb.cn/item/66b1cf00d9c307b7e97a65ba.png", "https://pic.imgdb.cn/item/66b1cf0ad9c307b7e97a6ff3.png", "https://pic.imgdb.cn/item/66b1cf0bd9c307b7e97a7069.png", "https://pic.imgdb.cn/item/66b1cf0cd9c307b7e97a715a.png", "https://pic.imgdb.cn/item/66b1cf0ad9c307b7e97a6f76.png", "https://pic.imgdb.cn/item/66b1cf10d9c307b7e97a751d.png", "https://pic.imgdb.cn/item/66b1cf3dd9c307b7e97a9cc6.png", "https://pic.imgdb.cn/item/66b1cf3dd9c307b7e97a9cdf.png", "https://pic.imgdb.cn/item/66b1cf3dd9c307b7e97a9cf8.png", "https://pic.imgdb.cn/item/66b1cf3dd9c307b7e97a9d0b.png", "https://pic.imgdb.cn/item/66b1cf3dd9c307b7e97a9c90.png", "https://pic.imgdb.cn/item/66b1cf45d9c307b7e97aa4eb.png", "https://pic.imgdb.cn/item/66b1cf45d9c307b7e97aa4fe.png", "https://pic.imgdb.cn/item/66b1cf45d9c307b7e97aa507.png", "https://pic.imgdb.cn/item/66b1cf45d9c307b7e97aa512.png", "https://pic.imgdb.cn/item/66b1cf46d9c307b7e97aa522.png", "https://pic.imgdb.cn/item/66b1cf5cd9c307b7e97abfa5.png", "https://pic.imgdb.cn/item/66b1cf5cd9c307b7e97abfac.png", "https://pic.imgdb.cn/item/66b1cf5cd9c307b7e97abfb9.png", "https://pic.imgdb.cn/item/66b1cf5cd9c307b7e97abfc0.png", "https://pic.imgdb.cn/item/66b1cf5cd9c307b7e97abfc5.png"];
allSmile[3] = ["https://blob.keylol.com/forum/202112/23/162212kaji3qqgz4j7i1r8.gif", "https://blob.keylol.com/forum/202112/23/162237vrcihxx8tjzcjqci.gif", "https://blob.keylol.com/forum/202112/23/162213g45ue8keoxe1e97y.gif", "https://blob.keylol.com/forum/202112/23/162214rdt3d3vz6mmiijmz.gif", "https://blob.keylol.com/forum/202112/23/162215ctpwthlh9epw3rm9.gif", "https://blob.keylol.com/forum/202112/23/162216mdnac2o58ss5gk32.gif", "https://blob.keylol.com/forum/202112/23/162216n8drokb1oo78u7ko.gif", "https://blob.keylol.com/forum/202112/23/162217prexwu85c8guwdwq.gif", "https://blob.keylol.com/forum/202112/23/162218lglfgl4ym0zgejrg.gif", "https://blob.keylol.com/forum/202112/23/162219xhngqioipmitttim.gif", "https://blob.keylol.com/forum/202112/23/162219x23kb1shjg887jkk.gif", "https://blob.keylol.com/forum/202112/23/162220j676g1cvw680kcv5.gif", "https://blob.keylol.com/forum/202112/23/162221ml94hu7fppux70q9.gif", "https://blob.keylol.com/forum/202112/23/162222aszdmtw4sywq92q2.gif", "https://blob.keylol.com/forum/202112/23/162223nkppypocm2opzdj2.gif", "https://blob.keylol.com/forum/202112/23/162223u9w6zimwamfz86qa.gif", "https://blob.keylol.com/forum/202112/23/162224s99akamzn7hvzpvm.gif", "https://blob.keylol.com/forum/202112/23/162225a2qttsp10qhwzcvs.gif", "https://blob.keylol.com/forum/202112/23/162226b79716rd9v10h6r4.gif", "https://blob.keylol.com/forum/202112/23/162227qkmy623hm4jy2j3m.gif", "https://blob.keylol.com/forum/202112/23/162228onk6smn1pknu33ne.gif", "https://blob.keylol.com/forum/202112/23/162228tpmhq9h9gq4pmphu.gif", "https://blob.keylol.com/forum/202112/23/162229ifal6ktkzkl6kckl.gif", "https://blob.keylol.com/forum/202112/23/162230u0u02fkfkd7u7nfj.gif", "https://blob.keylol.com/forum/202112/23/162232i7yb90f6bj76b7bb.gif", "https://blob.keylol.com/forum/202112/23/170901nb1dlnn7ziv91udv.gif", "https://blob.keylol.com/forum/202112/23/170902wtedruprpwrutmep.gif", "https://blob.keylol.com/forum/202112/23/170903oi8o18euvb86ibz8.gif", "https://blob.keylol.com/forum/202112/23/170859j6vwlo7uh6uems7u.gif", "https://blob.keylol.com/forum/202112/23/170900q4x4mgdk548we877.gif", "https://blob.keylol.com/forum/202112/23/170900qq33tqymzff83dyf.gif", "https://blob.keylol.com/forum/202112/23/162233auss8jsjsd9f8c9j.gif", "https://blob.keylol.com/forum/202112/23/162231x27txhfxcx1xnd7b.gif", "https://blob.keylol.com/forum/202112/23/162233z613722pl7quqq82.gif", "https://blob.keylol.com/forum/202112/23/162234oz6it856p6zwpd2q.gif", "https://blob.keylol.com/forum/202112/23/162235ndpzgdbb3zgjrp3w.gif", "https://blob.keylol.com/forum/202112/23/162236xuxt6sdwwax8pew5.gif", "https://blob.keylol.com/forum/202112/23/162237dav44a307f0w3s39.gif", "https://blob.keylol.com/forum/202112/23/172602wfhqwr39m33e981f.gif", "https://blob.keylol.com/forum/202112/23/172601c38nccun4nj98rz2.gif", "https://blob.keylol.com/forum/202112/23/172600vjemvnyyyllvnyem.gif", "https://blob.keylol.com/forum/202112/23/172559j0ltzzc1u41qvllq.gif", "https://blob.keylol.com/forum/202112/23/172558uck47jb6vv5cinci.gif", "https://blob.keylol.com/forum/202112/23/172557om2tc8vsgvrllssn.gif", "https://blob.keylol.com/forum/202112/23/172556yhd04xdg4dl0g9tp.gif", "https://blob.keylol.com/forum/202112/23/172555vywl1q0kothook00.gif", "https://blob.keylol.com/forum/202112/23/172554stupevlii5ewvw5o.gif", "https://blob.keylol.com/forum/202112/23/172553c7z6r77060w6cm86.gif", "https://blob.keylol.com/forum/202112/23/172553a3vpvujc8a88z5qr.gif", "https://blob.keylol.com/forum/202112/23/172552fbb0donp2v0qfcqu.gif", "https://blob.keylol.com/forum/202112/23/172551ll0uc1uscbslbccu.gif", "https://blob.keylol.com/forum/202112/23/172550tevldbd3qzzzv0e3.gif", "https://blob.keylol.com/forum/202112/23/172549iclwsv6avrjaxrwi.gif", "https://blob.keylol.com/forum/202112/23/172548jbam2pkpd71bm3j6.gif", "https://blob.keylol.com/forum/202112/23/172548b7cu8yi88il1iuim.gif", "https://blob.keylol.com/forum/202112/23/172546h1whw9dehxw3euz0.gif", "https://blob.keylol.com/forum/202112/23/172545gvlsyoyl8ps77yj1.gif", "https://blob.keylol.com/forum/202112/23/172544kxcxhyxnc7y68don.gif", "https://blob.keylol.com/forum/202112/23/172543opukomraofduk2ur.gif", "https://blob.keylol.com/forum/202112/23/172542x008626og1xy4li2.gif", "https://blob.keylol.com/forum/202112/23/172541dzwwwlkpgb58blaw.gif", "https://blob.keylol.com/forum/202112/23/172540u2g71pnqbibpgqj3.gif", "https://blob.keylol.com/forum/202112/23/172539qczcztoxttwqoqxp.gif", "https://blob.keylol.com/forum/202112/23/172538uttk23c3q5it0qzi.gif", "https://blob.keylol.com/forum/202112/23/172537t5rk0pakkhak1a5r.gif", "https://blob.keylol.com/forum/202112/23/172536bnzk518k5ll7ao2b.gif", "https://blob.keylol.com/forum/202112/23/172535jazgog3na0q37amn.gif", "https://blob.keylol.com/forum/202112/23/172534sq3z1q4s1qkzxkpi.gif", "https://blob.keylol.com/forum/202112/23/172533omgjuu94epzlruuu.gif", "https://blob.keylol.com/forum/202112/23/172533g2lq0l3hqla42xh3.gif", "https://blob.keylol.com/forum/202112/23/172532uxxag0wdwc29fiz9.gif", "https://blob.keylol.com/forum/202112/23/172531oxyxghszujwzevle.gif", "https://blob.keylol.com/forum/202112/23/172530wxoyysvijs0yquiq.gif", "https://blob.keylol.com/forum/202112/23/172529ph63054lqtglo56r.gif", "https://blob.keylol.com/forum/202112/23/172528jcy0bydbheb5qbsp.gif", "https://blob.keylol.com/forum/202112/23/172527zlt4k3b8e874bldh.gif", "https://blob.keylol.com/forum/202112/23/172526pssils1cbqqtr7r1.gif", "https://blob.keylol.com/forum/202112/23/172526ok4hbmpidryp0hqm.gif", "https://blob.keylol.com/forum/202112/23/172525v5kxy4k7qsxb42p2.gif", "https://blob.keylol.com/forum/202112/23/172524muu7auzuul85k2o5.gif", "https://blob.keylol.com/forum/202112/23/172523yavevvvixtnivfvz.gif", "https://blob.keylol.com/forum/202112/23/172522weguepgpojdc5v5o.gif", "https://blob.keylol.com/forum/202112/23/172521xsn06aqocllocen5.gif", "https://blob.keylol.com/forum/202112/23/172519m9stv5gmgfgcbehb.gif", "https://blob.keylol.com/forum/202112/23/172517uxoxvx6xd6441796.gif", "https://blob.keylol.com/forum/202112/23/172517dx8zvglrr38sgdk3.gif", "https://blob.keylol.com/forum/202112/23/172515lqwqwwgu7ohunkxo.gif", "https://blob.keylol.com/forum/202112/23/172514ugcfqr8qiji1jqdd.gif", "https://blob.keylol.com/forum/202112/23/172513rujamzdgusxcxgrn.gif", "https://blob.keylol.com/forum/202112/23/172512dx8rbaacagpgplvy.gif", "https://blob.keylol.com/forum/202112/23/172510fedw131m02b13wx2.gif", "https://blob.keylol.com/forum/202112/23/172509xemmnz23pifed2il.gif", "https://blob.keylol.com/forum/202112/23/172508ikaxxvrrjqxxxvzk.gif", "https://blob.keylol.com/forum/202112/23/172507qs2hho9u6nb246d0.gif", "https://blob.keylol.com/forum/202112/23/172506pjizzioyyn4zhonz.gif", "https://blob.keylol.com/forum/202112/23/172505i040anyxnyza0www.gif", "https://blob.keylol.com/forum/202112/23/172504dw06z5oj0gidmgm6.gif", "https://blob.keylol.com/forum/202112/23/172503c7xl1alag58t9x2u.gif", "https://blob.keylol.com/forum/202112/23/172503ofvrjatrrtvrrsz3.gif", "https://blob.keylol.com/forum/202112/23/172501ilcmvvfbilc9va9i.gif", "https://blob.keylol.com/forum/202112/23/172501r919mvfsfmlmn1lt.gif", "https://blob.keylol.com/forum/202112/23/172459omzvxxxvmm89v90z.gif", "https://blob.keylol.com/forum/202112/23/172458qwvtjvwvgdntjecj.gif", "https://blob.keylol.com/forum/202112/23/172457t12b2887wua8cll2.gif", "https://blob.keylol.com/forum/202112/23/172456f8ewm818w881o9ix.gif", "https://blob.keylol.com/forum/202112/23/172455udr305y5grepowe6.gif", "https://blob.keylol.com/forum/202112/23/172454y9nla246u2a68t94.gif", "https://blob.keylol.com/forum/202112/23/172453wr9rle9dg6th11fl.gif", "https://blob.keylol.com/forum/202112/23/172452xh4fbhtmokr7nsnh.gif", "https://blob.keylol.com/forum/202112/23/172450ldumeze0lkuesd7k.gif", "https://blob.keylol.com/forum/202112/23/172449ien18a9vh06to1m5.gif", "https://blob.keylol.com/forum/202112/23/172448js71nh97n7ttpf7c.gif", "https://blob.keylol.com/forum/202112/23/172447rvux07tz39jlda27.gif", "https://blob.keylol.com/forum/202112/23/172446t0yxn2ayotcy70qt.gif", "https://blob.keylol.com/forum/202112/25/105308t4cop63eerc32ozp.gif", "https://blob.keylol.com/forum/202112/25/105309orvbrzfyj7jo4qjo.gif", "https://blob.keylol.com/forum/202112/25/105310ov4ro4zlo3oxqghq.gif", "https://blob.keylol.com/forum/202112/25/105311tu3w444nb2bxwg2u.gif", "https://blob.keylol.com/forum/202112/25/105312qdnd3v0uiwvwdiwu.gif", "https://blob.keylol.com/forum/202112/25/105312r68s8cok8vvf93ef.gif", "https://blob.keylol.com/forum/202112/25/105313up5tzfjaofk2loao.gif", "https://blob.keylol.com/forum/202112/25/105314kctmq2cq29ci8ica.gif", "https://blob.keylol.com/forum/202112/25/105315dvqd1zmu1muq1pmu.gif", "https://blob.keylol.com/forum/202112/25/105316qwjloj7d4zxwe4f2.gif", "https://blob.keylol.com/forum/202112/25/105317o48ir6i3irs3l9g9.gif", "https://blob.keylol.com/forum/202112/25/105318iifoaqba38d8ag5h.gif", "https://blob.keylol.com/forum/202112/25/105318h2opaq988wfm5z2p.gif", "https://blob.keylol.com/forum/202112/25/105319mwzplr62bp0wzuz5.gif", "https://blob.keylol.com/forum/202112/25/105320nioko7khid1nsp4h.gif", "https://blob.keylol.com/forum/202112/25/105321dtky0k1l996amfgt.gif", "https://blob.keylol.com/forum/202112/25/105322k66kxskk0asrm6jj.gif", "https://blob.keylol.com/forum/202112/25/105323lt5oxajoznz4uoji.gif", "https://blob.keylol.com/forum/202112/25/105324leinn474a3nuie7i.gif", "https://blob.keylol.com/forum/202112/25/105324i1uwzrs12z18czwc.gif", "https://blob.keylol.com/forum/202112/25/105325rgfd2wm6sxj81oxf.gif", "https://blob.keylol.com/forum/202112/25/105326yvrrvdl39129v0v0.gif", "https://blob.keylol.com/forum/202112/25/105327rh22827thslhcut3.gif", "https://blob.keylol.com/forum/202112/25/105328fki96wl1tlq9q9f1.gif", "https://blob.keylol.com/forum/202112/25/105329uh85sbmzuh8rf5hd.gif", "https://blob.keylol.com/forum/202112/25/105330emmdhgc68uxccbxb.gif", "https://blob.keylol.com/forum/202112/25/105330ahyw3tqazzzt5yrd.gif", "https://blob.keylol.com/forum/202112/25/105331fmweg7hmdzmmhppo.gif", "https://blob.keylol.com/forum/202112/25/105332fizio2l5o4fqz2o6.gif", "https://blob.keylol.com/forum/202112/25/105333muuhtqnr3r21n21r.gif", "https://blob.keylol.com/forum/202112/25/105334r26o6m4tn2tgsgy0.gif", "https://blob.keylol.com/forum/202112/25/105335lz9io50nnffypfbr.gif", "https://blob.keylol.com/forum/202112/25/105336ny3iuryen4uz5z3g.gif", "https://blob.keylol.com/forum/202112/25/105337v297hojvuoplo4v8.gif", "https://blob.keylol.com/forum/202112/25/105338ddddvhd7jjd7ni6w.gif", "https://blob.keylol.com/forum/202112/25/105339wticdwnyycz8uw6c.gif", "https://blob.keylol.com/forum/202112/25/105340q3zy8qcnpskccncn.gif", "https://blob.keylol.com/forum/202112/25/105341koukzowxau11zucz.gif", "https://blob.keylol.com/forum/202112/25/105342ztbzlx5vbunfbx5u.gif", "https://blob.keylol.com/forum/202112/25/105343sxm7mamt2wrm22zj.gif", "https://blob.keylol.com/forum/202112/25/105344aa9meel11imnh9la.gif", "https://blob.keylol.com/forum/202112/25/105344uguqebw6oa6b0l6g.gif", "https://blob.keylol.com/forum/202112/25/105345dd173me8d82xm3ez.gif", "https://blob.keylol.com/forum/202112/25/105346j7j0u246g4002034.gif", "https://blob.keylol.com/forum/202112/25/105347zh8h71j7b8a7j87w.gif", "https://blob.keylol.com/forum/202112/25/105348qwixxxlesssbz14x.gif", "https://blob.keylol.com/forum/202112/25/105349hf4j6jgnpnhanat8.gif", "https://blob.keylol.com/forum/202112/25/105349wzkiglqb5qqhkgc2.gif", "https://blob.keylol.com/forum/202112/25/105350v6hhogo6pz990xlh.gif", "https://blob.keylol.com/forum/202112/25/105351kfwro8qf72rb422g.gif", "https://blob.keylol.com/forum/202112/25/105352y8ty00y2y11tyfkb.gif", "https://blob.keylol.com/forum/202112/25/105353dkqfh4afkkkvrrs9.gif", "https://blob.keylol.com/forum/202112/25/105354tmt6r1trstht9vvm.gif", "https://blob.keylol.com/forum/202112/25/105355vf58vv9c25dushdf.gif", "https://blob.keylol.com/forum/202112/25/105357wotgi5yxrjajw66d.gif", "https://blob.keylol.com/forum/202112/25/105357ca6ai9dc5aw6d9cb.gif", "https://blob.keylol.com/forum/202112/25/105358wf66rosestszgc5m.gif", "https://blob.keylol.com/forum/202112/25/105359oxcxcacuy95z5g9g.gif", "https://blob.keylol.com/forum/202112/25/110432wl6hccejvy4be4do.gif", "https://blob.keylol.com/forum/202112/25/105400a3ftjqjuzh030he0.gif", "https://blob.keylol.com/forum/202112/25/105401bdfbg78s95st9ss0.gif", "https://blob.keylol.com/forum/202112/25/105402r5z6333mmonozz3o.gif", "https://blob.keylol.com/forum/202112/25/105404rrlw11lmmellwlzh.gif", "https://blob.keylol.com/forum/202112/25/105405dgfnx22e226s2xe2.gif", "https://blob.keylol.com/forum/202112/25/105405sfumifrk0t3oumf4.gif", "https://blob.keylol.com/forum/202112/25/105406l6jne63e68s3s2nz.gif", "https://blob.keylol.com/forum/202112/25/105407eg3gcxu3eh6ookne.gif", "https://blob.keylol.com/forum/202112/25/105408ozt75u2ioif5d5y5.gif", "https://blob.keylol.com/forum/202112/25/105409enon6j1jn5k1jo6z.gif", "https://blob.keylol.com/forum/202112/25/105410xxhq7qv6997ivmx3.gif", "https://blob.keylol.com/forum/202112/25/105410lubtozuma3z3muwh.gif", "https://blob.keylol.com/forum/202112/25/105411s7vld1dl9ddoddel.gif", "https://blob.keylol.com/forum/202112/25/105412qcm4vs0xv4c7xtgs.gif", "https://blob.keylol.com/forum/202112/25/105413yd9qfqc9j87wzchb.gif", "https://blob.keylol.com/forum/202112/25/105414o9t3uizleseu5q4t.gif", "https://blob.keylol.com/forum/202112/25/105414oya5kneh6zdwjaaw.gif", "https://blob.keylol.com/forum/202204/20/231258fqyvsscfpqvqpssq.gif", "https://blob.keylol.com/forum/202204/20/234436bzsvq8gqq2vf8tls.gif", "https://blob.keylol.com/forum/202204/20/234437vc55o55opdhepopz.gif", "https://blob.keylol.com/forum/202204/20/234438xilme579ixejqquk.gif", "https://blob.keylol.com/forum/202204/20/234438u78iiobaj6ivzgap.gif", "https://blob.keylol.com/forum/202204/20/234440lwnlon2tdn202wnn.gif", "https://blob.keylol.com/forum/202204/20/234440ksgx77gl3tystqlr.gif", "https://blob.keylol.com/forum/202204/20/234441f13cfe1a1j1rdho1.gif", "https://blob.keylol.com/forum/202204/20/234442a7dse8b828nbxu8e.gif", "https://blob.keylol.com/forum/202206/29/060405t3tcaf0i3i89ioia.gif", "https://blob.keylol.com/forum/202206/29/060405e9zqdnj0nijzkkmx.gif", "https://blob.keylol.com/forum/202206/29/060406a3qwvhwdkdyhvqyw.gif", "https://blob.keylol.com/forum/202206/29/060407ingnr7fs679vz9xz.gif", "https://blob.keylol.com/forum/202206/29/060407i34j2wjuffuo28uy.gif", "https://blob.keylol.com/forum/202206/29/060408ui9g5ne3xevpgodg.gif", "https://blob.keylol.com/forum/202206/29/060409rr3iix188w9mmz9t.gif", "https://blob.keylol.com/forum/202206/29/060409akoftk5boe5o55ef.gif", "https://blob.keylol.com/forum/202206/29/060410fzxx7cvikckl3lxu.gif", "https://blob.keylol.com/forum/202206/29/060411dsv3ry4yvo3mmlro.gif", "https://blob.keylol.com/forum/202206/29/060412ytwaw1ttwazkppls.gif", "https://blob.keylol.com/forum/202206/29/060412ntvta09zaccsuys0.gif", "https://blob.keylol.com/forum/202206/29/060413topmmpj4mhwppx2w.gif", "https://blob.keylol.com/forum/202206/29/060414d78j43nn92j39nkn.gif", "https://blob.keylol.com/forum/202206/29/060414q1jmgksj9khf8mts.gif", "https://blob.keylol.com/forum/202206/29/060415xuu82dd08d3q0i5n.gif", "https://blob.keylol.com/forum/202206/29/060416l3xjnhx4hr4p4r7i.gif", "https://blob.keylol.com/forum/202206/29/060416jltuzkch5q0z0htu.gif", "https://blob.keylol.com/forum/202206/29/060417c48pypzfy4ep6p7e.gif", "https://blob.keylol.com/forum/202206/29/060418lewz6lm26rqqsmue.gif", "https://blob.keylol.com/forum/202206/29/060418xhfjn0rr09sissm0.gif", "https://blob.keylol.com/forum/202206/29/060419pzpluoujzpa5jjry.gif", "https://blob.keylol.com/forum/202206/29/060420rc9zz29dffxdc19u.gif", "https://blob.keylol.com/forum/202206/29/060421ev6vpitbrpr6v7bb.gif", "https://blob.keylol.com/forum/202206/29/060421khiwktfkhhrb8kwt.gif", "https://blob.keylol.com/forum/202206/29/060422nnl3xgc0nekpxnp7.gif", "https://blob.keylol.com/forum/202206/29/060423xvqaqa2yvzvqef9z.gif", "https://blob.keylol.com/forum/202206/29/060423elignghr17tu7nqn.gif", "https://blob.keylol.com/forum/202206/29/060424dz553zqqb3isb204.gif", "https://blob.keylol.com/forum/202206/29/060425v8hz08ab2f88p408.gif", "https://blob.keylol.com/forum/202206/29/060425ro1o1tzucvlyrop5.gif", "https://blob.keylol.com/forum/202206/29/060426ifww8z6q6yuwnswo.gif", "https://blob.keylol.com/forum/202206/29/060427uypiobv0fzqixzcf.gif", "https://blob.keylol.com/forum/202206/29/060427i96dedzselsn9ed7.gif", "https://blob.keylol.com/forum/202206/29/060428skdqppzfkdde8v8v.gif", "https://blob.keylol.com/forum/202206/29/060429x2nlmmw6shrw0qaa.gif", "https://blob.keylol.com/forum/202206/29/064103d96pbvxihjhiibpo.gif", "https://blob.keylol.com/forum/202206/29/064104rcccj0710u1f2i12.gif", "https://blob.keylol.com/forum/202206/29/064104r4m477k45om88848.gif", "https://blob.keylol.com/forum/202206/29/064105hr6tvgygoyas9a9y.gif", "https://blob.keylol.com/forum/202206/29/064106mtmj8nmwn8ojm4zp.gif", "https://blob.keylol.com/forum/202206/29/064107b9yy52ytyw69hihw.gif", "https://blob.keylol.com/forum/202206/29/064107kmpiiop8qqqqn3mp.gif", "https://blob.keylol.com/forum/202206/29/064109zimzes5izqiiheh5.gif", "https://blob.keylol.com/forum/202206/29/064110h5norgaaosqqo2ji.gif", "https://blob.keylol.com/forum/202206/29/064110xapaszpa8o7z8jso.gif", "https://blob.keylol.com/forum/202206/29/064111euyv3e4yyioaxye0.gif", "https://blob.keylol.com/forum/202206/29/064112emk9vzzfa9y2a202.gif", "https://blob.keylol.com/forum/202206/29/064113pn1op1bb3snbeba7.gif", "https://blob.keylol.com/forum/202206/29/064114hkr0kjzlmnlmnmjz.gif", "https://blob.keylol.com/forum/202206/29/064115olc41llh1zlh2h7v.gif", "https://blob.keylol.com/forum/202206/29/064116q3g25rqrtquu9jz2.gif", "https://blob.keylol.com/forum/202206/29/064117kvyuwtr32uuo1mzq.gif", "https://blob.keylol.com/forum/202206/29/064117krgsom7rzkxmskrs.gif", "https://blob.keylol.com/forum/202206/29/064118y8ia4qe8ac6az9gg.gif", "https://blob.keylol.com/forum/202206/29/064119pjk34iddkll729bq.gif", "https://blob.keylol.com/forum/202206/29/064120o7vi791cwykngzgn.gif", "https://blob.keylol.com/forum/202206/29/064120cx0bbdzgs50cbm0g.gif", "https://blob.keylol.com/forum/202206/29/064121pselh0xpf6prpfuz.gif", "https://blob.keylol.com/forum/202206/29/064122yf85ee7wrfrzsfre.gif", "https://blob.keylol.com/forum/202206/29/064123hmawzlk3kjdp3ria.gif", "https://blob.keylol.com/forum/202206/29/064123rpowwqq5ufpp5b9m.gif", "https://blob.keylol.com/forum/202206/29/064125sgigb75n64rp4y2r.gif", "https://blob.keylol.com/forum/202206/29/064126ew55odxuekzw0kzf.gif"];
allSmile[4] = ["https://public.sn2.livefilestore.com/y1pMD09yaSHEcFhpuru0SwgJH5PC5QXkMgTReJLQBIqhwANB3G7yYaP2nVu1u4bkZD0SGg2lQdEP8dvdAZJnUaK8w/yct04.gif", "https://public.sn2.livefilestore.com/y1pezrt4pQS2tkhEpusFhLz5UHXEM__63b002_2LNqjDCZZtSySQNkoiaIRzi9Oq_lAJPsmRp1NHOAObYz8DA6ifg/yct03.gif", "https://public.sn2.livefilestore.com/y1psRgGWmy_sq5ZY76Oo0X1kHbwQaPiqTqjCL3n3CUFDrLGrwxKwzLxR5BqhkSrcSCBMYeXtTZL95OAOseYYG4tFQ/yct05.gif", "https://public.sn2.livefilestore.com/y1p6jwJV9Rg6TePt3hjGlnj6IAghlEyNTO8y3sXudsrc1ZriS1bR0FW24-ICLOGVoi5zj7KISVJSLyFTi9d05W8qg/yct06.gif", "https://public.sn2.livefilestore.com/y1pTqMH9s5ySc3vJKg2DsRS3ACuyguAJTfFONMHtmlrhNkGiMZ7-7qmbvaW2yr1S11oK6b-TqRHUdfMIKtAKPoJ5g/yct08.gif", "https://public.sn2.livefilestore.com/y1pmaLoJZ5ESk_1g-QPkWW4lMV1KInEvYXBpt_PFrAZLiks2d0qu6S9RYld0vS24kY6Y0njvJY6PpMsbz5Eu-m1Yg/yct09.gif", "https://public.sn2.livefilestore.com/y1pmaLoJZ5ESk-PTkzCr4peFjztDJDZ8FALFMH63_idTmydvRhlWRLfjNz5t79uAtsuq4MYv3Ye7BCbQ_1GIoLzeA/yct07.gif", "https://public.sn2.livefilestore.com/y1pEKzRB6-47mublHnAj05PAm3yzh2xaUqCjEYpfKsCpot_FTcOq-7PwRldW_g94OQzQ3YB2ESlHCZPhj5mdzGHXg/yct10.gif", "https://public.sn2.livefilestore.com/y1pEKzRB6-47mt-QRwf0ioliHG8nG1nQJwDIjukYc82HUmGYOZhWOLDx5IanPzsgypeXq58gBviOsmcuGYwbgVogw/yct11.gif", "https://public.sn2.livefilestore.com/y1pqlZLHyb-YCunEU2bkJBqqEtImRtkKzi8qXtagDow5BPkPWFmt4_LdvKtI0ZD-jVuG0AQJ55nF4OA_St1waplwQ/yct12.gif", "https://public.sn2.livefilestore.com/y1pqlZLHyb-YCshzH81hyMEFD3_WesuQqrwJnHBvDtjwdIU4nwA4GgHku0c97IeLoh9jVHaIdLBGNJSjDqpS6p4xQ/yct13.gif", "https://public.sn2.livefilestore.com/y1pVeBWQGx4QEPYgv3enfzOROoU7KFApXEcWk_h75JbTrSpBifKINRiJ35Zo7cJ5ulgJcBZR9lTiHnLdLleIzUglQ/yct14.gif", "https://public.sn2.livefilestore.com/y1pVeBWQGx4QEO-3UJonvMtmHx_ipIs5ixFv6jZfrC-duvGb_xS17pbEEmHn4AEF0_fvCovU4VWw6qtEss43YLpQw/yct15.gif", "https://public.sn2.livefilestore.com/y1pzDDZVf9ZI8J6WObnFltOnGm1tjDgdblOfBALJ05KDhZE2e575UY_Ziddzo2YRbTmhCT5rrLBQliz4iR8Le6-1g/yct16.gif", "https://public.sn2.livefilestore.com/y1pzDDZVf9ZI8KzCjcPytntLyb54H79XmvG9MSklkHTSwKdgk1lcPkURyvzV_YXO3QUAEGY5W6n5mB7LfvQarwXow/yct17.gif", "https://public.sn2.livefilestore.com/y1p-5AVZPP6TtsvSiXvH_TM2YoXnsS2lYKMsjS2ZKxvtnf2IWG4oyTqRIO4Dk8v8os28KETyYtHoEgfUh9QSH0nvw/yct18.gif", "https://public.sn2.livefilestore.com/y1pj_dBH1-qObRS6Ubl4AB2sXS4iMCr5n2EQjtkDlY6zz_YhI6YjBGPe2VbrNRocgZ5Bq-5PFrNLqj2LMlQlQJmQQ/yct20.gif", "https://public.sn2.livefilestore.com/y1pj_dBH1-qObTNHYug_MYsQhQqHkeIBWYPAaEzHtaw2A8R4uPGU9Xx_9YJL1qHiQkoi4Aa2-QKsWX5Sb3fkHX9hw/yct19.gif", "https://public.sn2.livefilestore.com/y1pSQzFSCvkh1mD321X7jRzKpXAk67mjImqpHy9-a1DRJ0ATZfioakNBhv8uGw-4NUbdMgTpaf_AQK_PZByRtvQMg/yct21.gif", "https://public.sn2.livefilestore.com/y1pshF-KdDo57FaaFnw9z_l2ZLRxr_1HSaJZI5EAqyTpPRBXydDs1WJmbU25QQqwTjtAaZjnlcOFwupKZIC6wTRLQ/yct22.gif", "https://public.sn2.livefilestore.com/y1pUh0qBVbc0nx51n5vR6dwoSa3apbX7PYK3CcaIdQmrB8swY5Mrz1HFGHc9Vkv7YLaZOrKHe1hkMR0YrcZvtWr5w/yct24.gif", "https://public.sn2.livefilestore.com/y1pUh0qBVbc0nysYez2LEhSJ_Vf24Xv-NLMM-Czka1HfVk5wv_f6M-9J_N7b0cKXiGJC1GpC9R_eHQZnt3naka8eQ/yct23.gif", "https://public.sn2.livefilestore.com/y1pvgvFeJRY3YfBBaklwSK-uT9PzRlLgVTuLR6TnWtrrvvq13ttzBf5TTjdk9qfORAHdrdDHHDwWAneM8iPgxMIsA/yct25.gif", "https://public.sn2.livefilestore.com/y1pwkrUDZqf_PBfYk7QxenGY5x5MsHZMsW0AYs0qcqOIgyfZg96uDq8lzAE2CKU8UBDvdoUx3O2q4aU17_PQa8FjQ/yct26.gif", "https://public.sn2.livefilestore.com/y1pwkrUDZqf_PDwrQPLDJlrGgNeBmWxhrh8ltRkoTA_7ZyiVJ5KiY6Yi275UTLhsqbd--WDA_1VAxKGfb35wDMnag/yct27.gif", "https://public.sn2.livefilestore.com/y1pTUvASApYN6Kz7wKgv-ACLsF2BQnYwIyTLPDPApylJ0HaBgxQ_oDfnWoNAmY38CfC5UypCH6R24L2OkDWAt_Vjw/yct29.gif", "https://public.sn2.livefilestore.com/y1pTUvASApYN6II0PvpEsGG8H3RQ8xf1f-Mv0bF7uE7ToZ5CS_oOkiqcTqbqijbZ_5rDIuRCavPb1hGRNSQGPK3Eg/yct28.gif", "https://public.sn2.livefilestore.com/y1pfnjierp7yOW9DVZ6i9guNcMZB5aeYSC0fKQwbQh-gzCsFyAa7S4Z7CfcDh6AhhlIDecy-sCNEwNashBttUbrSQ/yct30.gif", "https://public.sn2.livefilestore.com/y1pDmLdBrbodJIb85nVxc_lo-S_cPIThRS-3E8ySdxFnGLjpwmcJkP-p9m4S_JHa8o1rL2SBqIBiT_E6SaogktbxQ/yct31.gif", "https://public.sn2.livefilestore.com/y1pDmLdBrbodJISM-nhlK7uGSLKxuu5mmoJIcTUfJO501CN2N2U2MnambBTlcin7b75okmN19naA_-CmvsZfmH9Ag/yct32.gif", "https://public.sn2.livefilestore.com/y1p50GWsOxYZr-5gElakXLkMfFsXvswufF1-au8gylaUjAuChd_snC7CAnIJfOXOUy-y59JkeYWUD4hhe_fgnq2aA/yct33.gif", "https://public.sn2.livefilestore.com/y1p50GWsOxYZr9nnLehSPCTUBlFFBLc1VWFqH3ZhWiEJzSpgDP2_GjL_4AJOnb_qDajJr8XvoLE79sYEvTllyXseA/yct34.gif", "https://public.sn2.livefilestore.com/y1pUHVZed0ZtLfW0sZSVpzesNg6ulVmJp-Y5bzvSJjhTNBXcn2Nc_XtXn7QCxR-YzDdPg3UHkkqP-m61LBx9y8p1g/yct35.gif", "https://public.sn2.livefilestore.com/y1p13gSVYx2tQZCxZnB4qFdOwhhlByWCQ8xlWAtJzUz0hBqXL2w8Sbt06-eBApR5UGX-yZQaruoA8rkdZs5GTWfSQ/yct37.gif", "https://public.sn2.livefilestore.com/y1p13gSVYx2tQac163pOAJjNE9TR6wjXJuDo_19A7K152Vkf4vBxLFlBWWtS3x4umj0wKJJ-Vn5aU5akqCjSBnPng/yct36.gif", "https://public.sn2.livefilestore.com/y1p81SgynVpYaT0MacSdj4a_rFpsWRZUT8Pa0eGPpmf2IIZEQbO-r6TKx0N7csOmzXCxhxoVpcCVASePY2qTpuU-A/yct38.gif", "https://public.sn2.livefilestore.com/y1p1rIHBU3EvOvjed5yrxszdNqr50-dCuhzwpoOza7JdXidH0TmrFkQHuVY8mlHreQYLOnOW1Cmkk7OVVvbqTPDgQ/yct39.gif", "https://public.sn2.livefilestore.com/y1paVF-w3_3gYz1dmL-USbaA5O5v7_mXasTSquvrZFRF8OoP0dMVQz4QVhhEvKNeLZ37y3PHIb8K4x-Or8KxMTniA/yct40.gif", "https://public.sn2.livefilestore.com/y1p5d1PiBWWTzpJPSRNSoYjdf7TVDoDrN9jLjcpg8jzbNs6wfaDR0tYI4tPpgRLpvf8mvonwXQ2cK7UtbKvlH5lBw/yct41.gif", "https://public.sn2.livefilestore.com/y1pRT3nvzMImCEf_JqCpmkZxs8JFxI1MRj5ObfdgJq3_6jOInCu1A73FoRxmU7D6-TfWXKqIGB_2cLwHjoVOeL5gQ/yct42.gif", "https://public.sn2.livefilestore.com/y1pIpWx8mqx-W3XGk6uqfeDaWBTefB5yeh5k5OFH_k9ElfIfimg26Yejof3w_ONuIuDN8_ZHsgfoAzdp5Dt6xKO0g/yct43.gif", "https://public.sn2.livefilestore.com/y1pb9l28k-ZOi9SHi92GgPhPvF5vvy_X3ZN467PRQxb8BxgRttdBCSkeqL8tqtMowB_nRdM9BOEH6-_pJdo9p__VA/yct44.gif", "https://public.sn2.livefilestore.com/y1pb9l28k-ZOi-hvz1KEFJ2y2ndiGQ0Dg8TUSfqFkc82P798WMdeC1wyEa9_MO3OQGY3RPGtNxmWeTRRBig13h6zQ/yct45.gif", "https://public.sn2.livefilestore.com/y1pb9l28k-ZOi9UzYXqHGZSLluXH9KZKfPCU_FC5XR1YIcDnkJpGiwA8jQdmR_cejSMuIHRNY2J-NYpC4LsGlXa3A/yct46.gif", "https://public.sn2.livefilestore.com/y1piljphI_JeNqISy7XZpUAEWpiN3JrlkuYVgMZk_Jn8Ibb2Fq5eUyiFDs45FN9yXNaQVUhTihiKZUD56RJ7dPrXw/yct47.gif", "https://public.sn2.livefilestore.com/y1piljphI_JeNoqC3symWuYv9OBr1Zv8OdeQmVen5DonrXwaHElkaHcfM9ScHN24OPXKVJnDLe3EGlGmBrCqAw92w/yct48.gif", "https://public.sn2.livefilestore.com/y1pO9HbpqqPorIyymbVUJaw49Lng9P_8DPtcqKi-Ur7-g2eDmlqjaj1kJPO6uvyRSHJmwjG7wTBSUFZIwopW_LFSQ/yct49.gif", "https://public.sn2.livefilestore.com/y1pzLv__BYZq9U_KsztQHObifsWVRuM3G__WQkwdhOLHT9uGPwD23OX2O4rW7E3TqYUOMpLY6mMFR9sx7URgVtELg/yct50.gif", "https://public.sn2.livefilestore.com/y1pzLv__BYZq9X4KZV9nRJyhsvTq82HKko26NK0BHpHjAfWak2ynqBH-cKMalIQrAk6DTVXh_mI-wEPNHHnszEMRQ/yct51.gif", "https://public.sn2.livefilestore.com/y1pzLv__BYZq9XYDhMvs7gLW69LNakpRuakuvArTe_V9hiZZsulOtz6xSHskc7J4S7aKef3NC2Ejv9MmhagzMwi3Q/yct52.gif", "https://public.sn2.livefilestore.com/y1p23P1MHvLfTK4zeZaoUobybox3qgnY6S0xSgUUZY8m5zwCWWp3ciwbUsxhv2qYQjVsJHtL2fQTpcu8juyvDzy9Q/yct53.gif", "https://public.sn2.livefilestore.com/y1pLObpoGNe__9t10Qrg1hdypTOgcWpRVP8eIzCICEt9ogrcyvaoeWnpnQNLVywLwdB0uvirViUvsBvz6pf39i8aw/yct54.gif", "https://public.sn2.livefilestore.com/y1pbGewD6CgmAB4Ie0yG8lvyHd3m_k7MDjglPI-xdQMORyH70rl4xx9aLAkTNJ-jAxi3NiTtFmlJ-QbjtWtqurG-g/yct56.gif", "https://public.sn2.livefilestore.com/y1pbGewD6CgmADPvaa1OEhumKk01FAxzY0TK6DRDaJQ4pYWLnWAI8N4mw0NG4rSsqvvh985uvGs_RxV2YnNNeQmcA/yct55.gif", "https://public.sn2.livefilestore.com/y1pVE1Rlqx03dsZi0Hjx71tHZsNuRdnLUpiAD6EvFwCeFDbfVV8-pcN1RBJS4HNM6cVQnqKaQa3fUtqONqsIygEdg/yct57.gif", "https://public.sn2.livefilestore.com/y1pY-Jgp5Vd9gTAm0rp83cupvdPku9gUIeLUs4pLNNyphsuDZgmxy7C8mFTzPLCn4jB8kjHcNoiNQPVgVtqhdzT2g/yct59.gif", "https://public.sn2.livefilestore.com/y1pY-Jgp5Vd9gTe2HNFktn6wFKxEn_YdJO6ZH78747E8iRFgC3bXC_lL2gsnZd6yR6i7RGKwjklqHPaPKgcvorbVg/yct58.gif", "https://public.sn2.livefilestore.com/y1pd8Up0ptQgvXjxbN8WrViGcd-w2lqQhIGlmyqMY3Nk6orBLFy9BASUDJ23zbdXKo92Nt5YKiAAgSUPcRU3GkvjQ/yct60.gif", "https://public.sn2.livefilestore.com/y1pQRPiLn_bzLCaLIvO1BM1_gjBUiCysqkXsBSPiGhfC974586u_Hq0ylE2Cv-b8SrFTL1JW8osXk2iqqw23SAA5A/yct62.gif", "https://public.sn2.livefilestore.com/y1pQRPiLn_bzLAoUxYw2aolby7aanyuqxhqyvzqpuOGPo3egr2zu2ShFx2fdAjOeaYzC49xpEMESnHczpuP62upTg/yct61.gif", "https://public.sn2.livefilestore.com/y1pRWuRsbq-o_9DTcil4tfkj9omP4oL9WVnQgzg8UFyw4VOYSRPQnoSmBEzkNvj4KoIrbCAh6Kb8XvEJvCN9m6cbA/yct63.gif", "https://public.sn2.livefilestore.com/y1pvB3uzfPPieho6xEdgcxzNl8evXMfHtShhSnm4BpYGemErX1Kd02sOB51VJ9lt6vydEBmqP5CLtkK_J7tEYhtRw/yct64.gif", "https://public.sn2.livefilestore.com/y1pqTGFZ3du24xSMHssKBf9G1_fwodVP7b2713DSmViw9o4h1EL_3zoJv4FX43CXhMMW0W11yn5UzLjb84NroEWkQ/yct01.gif", "https://public.sn2.livefilestore.com/y1pTnchFW8vkgqHN72jHuUw14bhkay_DzdLuJZ4ncug1RCJPJomh6yzK0WXnnnd71G9tVBu2RRxG4uo0sX8U2OG3g/yct02.gif"];
allSmile[5] = ["https://public.sn2.livefilestore.com/y1pVTah7qVmY9Lvvgk86FTg59oMfwMEkQoW5lUyD_LlnBqwWhFfFj5EOHiSzsz4rETgt_G4c4xpLlMMft3yamvfbA/ali01.gif", "https://public.sn2.livefilestore.com/y1pbUEmk3ANofLsUNI1NhZhVhPEEcMfjvTD9x2r8nPfpVLvY7RGp-EhQN-14GNYYWgF22KNKklt2Miiqe0kp2yxJg/ali02.gif", "https://public.sn2.livefilestore.com/y1pbUEmk3ANofJI5YJEBoP8SfBm2dzCkXeinaLx0iAnqpmKXX0ppDueN-vXvS60uWu_g1lJBK1eAU8GCrO_a2cRhw/ali03.gif", "https://public.sn2.livefilestore.com/y1pEmP6lkJ0bEmX564jQ7FQDq-NK7kV0ybGoziOfn7QmHj2M1Sg-777BFvbuY9o9v1Qb-_xojxb9B-IHFUnvQk2-g/ali05.gif", "https://public.sn2.livefilestore.com/y1pE3dus7DbZtiJSzrbt_nznH-DyKtXPB77h67MzdXLg1S78vIYBjEHlKgMTEW7f7DaRTQ0knwYCaaIGyUa5oHziw/ali06.gif", "https://public.sn2.livefilestore.com/y1pE3dus7DbZtjG0-fzp_IyyiKxopY417qHoWCfOs6XB_sQXX_EBp_u4AWPkrYhMm14RF__EftqoVExA-SZcKP7rA/ali04.gif", "https://public.sn2.livefilestore.com/y1pE3dus7DbZth-YOTJXEoFz3mkSNpjAPTTypk6s634KV1YaMbLFgXHNoSlD6zN4TVfcczehsrxen1564w15curEw/ali07.gif", "https://public.sn2.livefilestore.com/y1pjXfZcNUFPDqZpSvJ8NfYzRlNgkztzMquCBxf6lVqrJNMW-Sz5Dt-kXxyWbg485WKRg-78ppKho6qnaEPSwB6Ow/ali10.gif", "https://public.sn2.livefilestore.com/y1pjXfZcNUFPDoXitR-z13nsl-5CZiYzLNkg-aEVqiZbKXC5ZGO4vEln3BHuUxRka0ChrZj4RsSq5zXNRebwEkYQg/ali08.gif", "https://public.sn2.livefilestore.com/y1pjXfZcNUFPDrNnBJzCmLnvK7pILOZ_fy3lHHzXgMKO1Q7kpzLThLr6Sl3AFRU_3R-HLF76b-jyFKzrzUU3hSdEQ/ali09.gif", "https://public.sn2.livefilestore.com/y1p5Qm9QvTLnQP2IX56kS995W0xlI3e0SFqmX84uLEcXFOlk2Ue1Vvhr_ilVbMAp9W049Un9jEch7DrhTO7efQhQA/ali11.gif", "https://public.sn2.livefilestore.com/y1ptWhqZPp_shNigw2QnivLzfRtOOrXo24D6DhdetEaf0z9v83ufwcGvEf9WeB-YoNP4_tcHCzKuugzralhcAa1BQ/ali12.gif", "https://public.sn2.livefilestore.com/y1pABdWNSbTjkj439cNUUq2X29tH4_trgrU5TN2Lp3QLSjHlA6MRiHNp1WvHCAC1iF_FlSOO03c20zhhNbR4cRJNw/ali13.gif", "https://public.sn2.livefilestore.com/y1pWcvYVOJ3hdkHreAhBqraNJOFYbx55LNKHqJUiJBhxXkgeXLl_F8zrJNoqi9E7-1xp8l5T_DgSzDhURV532g-Cg/ali14.gif", "https://public.sn2.livefilestore.com/y1pWcvYVOJ3hdlLtBvTYEi-DBYt19y123IlbanVD2jvbICy92Ri7stUNq9120fTP8wrB0T3zRg38cOwzBIRPYrzXA/ali15.gif", "https://public.sn2.livefilestore.com/y1pRb-lqxVT5R1Ik4McGK6ekxSD3_lMIFtWp91VfpivToQ1Kszck_O8Sm7yurh_ysEKJmX3vDYvhZOBUuEjOw-7gA/ali17.gif", "https://public.sn2.livefilestore.com/y1pRb-lqxVT5R1zyPSlBQgXInYHjYQMPIf-Khv8quK5fNup4BoZPSkFI9IDkGJgOLPH6ByO3UwUxXxj-ZtMuqvlVQ/ali18.gif", "https://public.sn2.livefilestore.com/y1pRb-lqxVT5R2h_YiUZu98IaB8G8Um1dsNCQN0zNN6g-_FCmK9aIIS3J912MDkCVUXqfDuPcqjOz3KSd1HJcinUA/ali16.gif", "https://public.sn2.livefilestore.com/y1pN0w5aZ2dRzLwzsyifhuxbNF_0JIrKOMxOhDS6df8nuIWXUNtODK7Xa95ixX43eDX08oqIPfhxME5uy9_HnO-9w/ali20.gif", "https://public.sn2.livefilestore.com/y1p3m3osQPukPescy8Ns3GQUK4CfWjdSn0qbo0s6i96b5JkhaUKdGkujZtjKl-iG9mLzg1RH4ODuFxeJKVqeJ1AnQ/ali19.gif", "https://public.sn2.livefilestore.com/y1pUIt4pBGWEy-bZXuta_nYUxlUv3JoTvGkgGcHf4Rr0LQpK9jdb0d9jV6VnBG3yu8ud7OcU-DUoWUp5StPJ8SCEg/ali21.gif", "https://public.sn2.livefilestore.com/y1pwZ_6MIq7PBo0dKajUZ27EqYQIvCSYaoFrUdpFKIxztumB0hcfKkRmaOa5fmwZ8MY_w0fgz1pDw35Up7EGgtgOg/ali22.gif", "https://public.sn2.livefilestore.com/y1pw8879kK5tLZSO-M8la2dfIPZp8eEx2NyWaybPL56uzye0Ovyy1tvdxBqPExxTzoW7uidCZm9_V71MRLBmlj7rw/ali23.gif", "https://public.sn2.livefilestore.com/y1pw8879kK5tLbM2UPzH237zx5jkJaC28dpekPQWpod4R09uuqffCx4KRz-vLwsSc6XKtkuBUi4vjtPjWuOshexCA/ali24.gif", "https://public.sn2.livefilestore.com/y1po5V1jWopupjtXqcP4SJstG5odxPO-n0V__sFmQDnaHcH28WEwkbRfuurBCbYX54qlSZxVnMW-IANvwtRqX_YoA/ali26.gif", "https://public.sn2.livefilestore.com/y1po5V1jWopupgzMt8f0m0DEBJ6NxAtRgy-yDi9FMtJ8MqP_n4kh71DF_i7zJZtn6pI7-b8fF6EPimApESJklIB4Q/ali25.gif", "https://public.sn2.livefilestore.com/y1p-6lTyqS_anHUO-QVBPH07WvNJZS82Rj4NYM_obDQYrNTSwm5V7H3SNOvSKW0bXEUqu91ZeOnVQtjhwzP13xLwg/ali27.gif", "https://public.sn2.livefilestore.com/y1pvJc4jfYfqJ5DYfU_6q7uQv-HeZXcram7W28C8uhXllsZt8a9P0uWOI4hb36M9vJtRY0A0d6WDegMxkxu0VQ3Xw/ali29.gif", "https://public.sn2.livefilestore.com/y1pCVmhk96gVaOceZydT0V4rhU5qUa1AUvY5THnIV6il556OFrgbR_oyuGwwtXpuO6yzY2Igj6BzchUNAvL1Dk7vQ/ali28.gif", "https://public.sn2.livefilestore.com/y1pCVmhk96gVaNp4wM1TtpAPnGsF98oX1pvKh4jMeAJA8VnJQ2SDxQDjCg410YGsR5gbyobYe4ZGwceseciY_-zlg/ali30.gif", "https://public.sn2.livefilestore.com/y1pWqnOgXb-CSOg1npsrdRNyD1zjAYD5uLiFxNu_V07oHQN4pNwwAemeWQ9htMXWF_P6Aq9HIOhYJtPsGjuZTZyWA/ali32.gif", "https://public.sn2.livefilestore.com/y1pbrW1C_P4a0JXfaIQDsZHTNmp6Tl1gB1r1nsbfinRyL9s18L2SiqG6UkAHdbbZ5tI_wWX2ksoQzXOT62bzeXbcQ/ali31.gif", "https://public.sn2.livefilestore.com/y1p9AB3s05PAe-UtFRrpBad-1qFWgTwRiI-bVS6ag3HYjn6h8Incrtwp424HJ00enPWUQeXMjC7E0uLy8wcjYIhLw/ali34.gif", "https://public.sn2.livefilestore.com/y1p9AB3s05PAe96L4FtjzzLNPkyoDFvaJMLt2ci9soBc2vtJ3DQniklb-1nEEoQMbihgQPEY7p8Yca8cYieNG62_Q/ali35.gif", "https://public.sn2.livefilestore.com/y1phnPfW-ElxRXP1wAngfRRMYYYuDEWo3oDCSru0I6edmAv2CRr2fUBp1w_r8x_bV23-Xheeou6NUOqc6lrmMmCDA/ali33.gif", "https://public.sn2.livefilestore.com/y1pqW8hgDc2HLHbKEgFd35cbPl3HJJeNihV6WVAW2BxrEohLQLugTsIbrr1et0QevfgBnQ5zWc0E0Na2v7t_5ICSA/ali37.gif", "https://public.sn2.livefilestore.com/y1pqW8hgDc2HLHpZO96K3awMHoLkTBTVtRKwbbDQq32rdV7ZGwvGOhCCjDrz4pvh3G3JiYlUXlmv-jncpixEdnmbQ/ali36.gif", "https://public.sn2.livefilestore.com/y1pQsmVi0S58eSzctC26aeEPH3PMdn7InNBY3w_Zf2pP-1EGYbmI1UUpgs4ntcYXMvpEDw4jnIG4j3qYSq9GqrZRA/ali38.gif", "https://public.sn2.livefilestore.com/y1pXtXfxDxIcYE72fSNO3MG6KfHMM8z4EnYD2bieO1uulFfiGWWTeLaYQrTbNeXpoPgR8gGsZ2pP8A5ertha7Nsmg/ali39.gif", "https://public.sn2.livefilestore.com/y1pXtXfxDxIcYFcLYhhJdYPqCn6H55n16VVicHVe8JyeMu8Fvlf_YKVmjlJ3jA1w10bIBvTeBIhXnms71Bb_0kzAA/ali40.gif", "https://public.sn2.livefilestore.com/y1pG21Dx6BPzqZPMX-n-9rlInm7sPOP0pb5Qh3SP0bnrpOzfuuiaApdwLzicwOb8SI7PvhXn7zWttkQ5d_O1YKa6g/ali43.gif", "https://public.sn2.livefilestore.com/y1pG21Dx6BPzqbt21gLRhWrLLGVopYKxEiRDnANdOiTx9Cmlv84tT1ommwPnIZOH4fGt0kHH15ryxBMR44dlPzXvw/ali41.gif", "https://public.sn2.livefilestore.com/y1pG21Dx6BPzqZETY9NNoakNlMO_E7lhzIhTIvW4EEDccg6TBF6cRXPBlRoDNPppOS9VO3N6iN5Dv2BfvJX_NPEgA/ali42.gif", "https://public.sn2.livefilestore.com/y1peHOkMA_tP6e8DsXJqWLKB4p7uUX1Ez3TsnGvv8KmvU7wueMJ2rjG6VjCLfDZ9oi2H3vWgBMQ3_vVz1tmDJsYHQ/ali45.gif", "https://public.sn2.livefilestore.com/y1peHOkMA_tP6ciTxreLb8DjyrwpuOoWlOH_c2Wrgver__WVKd9kZSYmK8XeDegcTDiHKgl1_2vb8bpwLyxGfN1AA/ali46.gif", "https://public.sn2.livefilestore.com/y1p2W07WG77REd4v4kzo3IXXJM6BVWqHWp_MO2UrBpDAqyUJHK4o307wCrQUIoho6xCAGdM6WEGQPjjUO48B5X5YQ/ali44.gif", "https://public.sn2.livefilestore.com/y1puzgsAtHM832RcUMedQn54OAL2NPsjGndoRGyv6gYURrrtJTLyRxRm4Q6VKUacvtGFir51kO0_KGQwqUIsSyb8w/ali48.gif", "https://public.sn2.livefilestore.com/y1puzgsAtHM830P_TYRPbYjEAApWRgiO1T3u22UzhAfQhBbopDbSdk_Ops-lOSPidqJZIWAgjO3fzzBx3TZxrL1dQ/ali47.gif", "https://public.sn2.livefilestore.com/y1p-yrYhMhGoxeGCX686N7ntOxXcpCzwnzCLAj4c605yQfU13bsXdKKZZibtzOHv1htIQ2FIZLPemmWilr4dMenLg/ali49.gif", "https://public.sn2.livefilestore.com/y1p-yrYhMhGoxfJEQV3939a5pBHCgT0oRtKCFNOmdhDZ8xXsVUIIrG11y3oQr7jLSip7ejCvRa9kJSywvwIt57HjQ/ali50.gif", "https://public.sn2.livefilestore.com/y1psEFUNWZvtaziBt4mHM93syDz3O0b9VLiCtbQ_XZT8tZjH3wZltb0auS_k1eRH7uc5mDQNpy7t0PYqmY3GkidbA/ali51.gif", "https://public.sn2.livefilestore.com/y1pv4OAoB9kG5Wheo3N_jAWZJaCTJY7AutVsGKjeef4osH-H3xfzz_4wAiDHVul5h0maVAafwhvC-eNWdu4TzNrAg/ali52.gif", "https://public.sn2.livefilestore.com/y1pxAdiryC83L3qEj3nZEf4IXsRceIOLiGjRGUEBL1HpZGPl63J72Rm0pxOf6uJLhnlQXq_JSGMLCW4iogoPsZzrg/ali54.gif", "https://public.sn2.livefilestore.com/y1pje6NzXErbrGHc9-TWR4ARq8RanKZd3n3hJ4OxTIVpi7uQjA04Jt95yY4epvjo0kB8aPa2xyAnTXxMC0sPfZg4A/ali53.gif", "https://public.sn2.livefilestore.com/y1pEcwxoSUW8GfzBN2W7QfZBD8hrLv9QqybywbEO1qtAGtvwu51-jc4Ean2p58FBYUcn9g1lmWffBfr_5vkg1ykRA/ali55.gif", "https://public.sn2.livefilestore.com/y1puqFvjleYWdhX8BPgCDPFhL_OA_mG1BwrU2S-xV0YX6J-DIY9BHprzAd0TiPkUM0pMI9sUk0uiudpYBMhFbzIAA/ali57.gif", "https://public.sn2.livefilestore.com/y1psuSOlK8Cp8SVn6RJqr37ClJfaHI5V2jEFQgHA2uianzuBQBNIwV-ke8pgTD4TB8mXRO98bbUJDQk9ymsfG7dXg/ali58.gif", "https://public.sn2.livefilestore.com/y1ptb8WSnOfWb9odZo0E59pSXlbFbZc5MkeGgfqQC4bUQWxaXkoFP99iXbOQSoNPVFxd8OYBMwYEqKwYteKAHDO_g/ali56.gif", "https://public.sn2.livefilestore.com/y1ptb8WSnOfWb_aZ2x7uop4Y_rwufjb_6bV1XuxAeKqiiA5r-h3gnRLKl4g1G_RmXMSlSdZtK-kyA2eJywzc92jVA/ali59.gif", "https://public.sn2.livefilestore.com/y1ptb8WSnOfWb-n6tjRb453ViBethca1H2SrpoLcbtTILaoCox6UI_A5RZDAKM-6MGP1YIYXVQKud6vZwhMF-ApPQ/ali60.gif", "https://public.sn2.livefilestore.com/y1pw0xJlbR9CqnQMBqPbI_5KKzkT7Qf5xvKRXRDUHDU2q8g7QI1BOD72MM-aR5Fm7oVItD9Dr9yc9e9uUEInPbujw/ali61.gif", "https://public.sn2.livefilestore.com/y1pd69zplZ8yrBPnoOKBYbk8xRWqzYpQuIbyZZleoYqvHD3CkI9SwcvEBJh5pMwtfNzcjzMyhlgv8iKy9y-c77o6w/ali63.gif", "https://public.sn2.livefilestore.com/y1pG-dQpzwjQZ71JwiZSYR2yIbzmhgVfyo9jr3DAILEMO07W5hvcIJlaTjqW6762Ke3yLq16w-Zr-VzX-1q2O05aw/ali62.gif", "https://public.sn2.livefilestore.com/y1pE4zwvfyRarZDMOjG4-Jo5tTy54I7FBsQ7V_SYRFlbkaETRUrxJuoHH9APGiVuw1ytqQGhLvx627Zh5oC3A4DWw/ali64.gif", "https://public.sn2.livefilestore.com/y1ppF_g_BU3F88OvJFHL2FC_DaX7cplEmQjZvZbCsVSNLqZrnXZp78Y8ZVvB8GooB-F04aZCOUgEnondg13UhWkAA/ali67.gif", "https://public.sn2.livefilestore.com/y1ppF_g_BU3F8_72HQ7bkyxqLU5xhazR-b3Z699C2YhZv-Ka-Acb6G0Sf3xPzj-jkj-p_mH-zgZSusg49iwDxWruQ/ali66.gif", "https://public.sn2.livefilestore.com/y1ppF_g_BU3F8-mrEfM38g97WyFnoF0vmToW7OtmMl-LUJqwExawqq90wfeV1_H0AasmXo3-RZDD4D3hFQHWd_m9g/ali65.gif", "https://public.sn2.livefilestore.com/y1pTprRVLPhaC8jeoCQzhPbJSRleMVf3eIAW2Gx-4Ja-Z9gCq2Ybs2S6FuS4ld5O6PHKo15vdXanhvCtN2vrUWguA/ali70.gif", "https://public.sn2.livefilestore.com/y1pTprRVLPhaC9jpwWTnHTWkaSu-3YiMTfqppnRo2HzGqipgoOzPeugqak-eENffix-jiq5lMpypjz3mnGlQk348Q/ali68.gif", "https://public.sn2.livefilestore.com/y1pTprRVLPhaC_TIs6gAYEyDfpbFXCBNW5AdS21KnlKJPvo_B6jyA1Zch4x8XPFZDSDAchxbIrPgeAAzJUCcxSItQ/ali69.gif", "https://public.sn2.livefilestore.com/y1pu2gU3URp6zCE1bZpwhDFmZef_TFTlZfTCabkbfgFijzsmoEaobjas4b-C5C8LsJK3unQbt8PttuRTbBsdTRVTQ/ali71.gif", "https://public.sn2.livefilestore.com/y1pEXVxPKpSs8snVRgLUko1wHp4oVh67xW-5xEXtkoaUV3Dx8rJ5XwzvTovOPTzy0gvAnA_c5619ZvjdfSOR1ng1g/ali72.gif", "https://public.sn2.livefilestore.com/y1pEXVxPKpSs8tF4jiLJ5ANkRTAcbTildkSG8CTSSqoeYaYc_vamDJEuwlBiMOtXIyY2VO48Qn7TibQNSBU72YnTQ/ali73.gif", "https://public.sn2.livefilestore.com/y1p6xFRYMC6Oh7XYJMnH5yOmpVs5IZuJxSFHG40dka7BIYv2i9fZGmk-FHzwFRoNknbNF9laD72hK1A2bNDgYoi9A/ali74.gif", "https://public.sn2.livefilestore.com/y1p6xFRYMC6Oh7jpmNWHnsqfbLuYntWQFRno8mzmYBuU6TKMS1bbzUtKPRheXMV1L4TrdYFUTjSwKFfOZ6tFIxSvg/ali75.gif", "https://public.sn2.livefilestore.com/y1pjOvbXDNk74caVhvOQdPixEMSP1HuXtglLWQUPRfjkBTSx8eofYa5EXTXOwO6ogr6BCsX8NO1Yuj-vDxjqu27Fg/ali76.gif", "https://public.sn2.livefilestore.com/y1pt6JWHHqM21WgaCBfi4sADCYnY_olX_TVX5e5YLssJHfkr3eBdQo_02FKd7AF1yXThCYdEhYe6BDrNU5fAdttxw/ali77.gif", "https://public.sn2.livefilestore.com/y1pt6JWHHqM21XsAVHWHP3AdfmeJ2ORHaf9DxoxowtrHfM1AJ3sXejvQsvOJV-sx5FdtOJrcJo80LoUWV04qQDFvQ/ali78.gif", "https://public.sn2.livefilestore.com/y1pFoKaYBIS-hx1G4lwadexV5RsoMOkcB-77GfFylpgqjhTIfaYhtviZwN1oxRziYS7z768A2nRcPmvos-uoX9uLg/ali79.gif", "https://public.sn2.livefilestore.com/y1p3ZoVhxROeJwST5wpipF_HYIehAz3baA0rbmA48vjT9xfqQEx-KRFbdTwpDcLeWKvyLO3AfthoNxJUsAB7GxPHg/ali80.gif", "https://public.sn2.livefilestore.com/y1p3ZoVhxROeJzwVXnjF7F0H49y2UXxrKXxzuc9xyg2_jNYjBnJraRS-d6uVY4MK3C0Ang1wkSCVeEXp4tNOHk9Ag/ali81.gif", "https://public.sn2.livefilestore.com/y1pYVwY1SkFKUZJGMVbEBAdhV-FG_ofD8M1OtCll3fk6irQBf7t9J-Q92HqGqqezdfX6eGMva9LAx8eUVETOPDCHA/ali83.gif", "https://public.sn2.livefilestore.com/y1pP_P8NE9NDrvux8_Ek06S2wPbTIwPJSUJsJ-7JUhRTgNxtP5cqjQdOd6v7dd6BK5mDRgDwCv92zWQyJaF1FyE_Q/ali82.jpg"];
allSmile[6] = ["https://public.sn2.livefilestore.com/y1pRgRZfIWEB3gdwAOnJSKxl6_mbcUwQVbZg3UxPIg3ugyCANLwhJH_4EiBdNktcd8JGg5f_Eoee502s-O5ahGcBw/tusiji02.gif", "https://public.sn2.livefilestore.com/y1p6T8uWp7cKvOnwXzTECC7FwUAI6_HbsHPKCb-68IheriuPCW9B7pivDXga9qyq0boeyqmLSwhWbGAxeL70qnWjg/tusiji01.gif", "https://public.sn2.livefilestore.com/y1pXMmQaPqLr7NYA3WGWbZ1b6F_H0z54ot-9EXKfB88Psho_H8J3UDcUOk8yEQAShF9tkx01YKdHWZfH9E54o006g/tusiji04.gif", "https://public.sn2.livefilestore.com/y1pyg7iepVL5PbuZZAAL5ZWKRQgkShGk0cNsLNXQa3qbuP7HnYrORUhI1urb0OxRDaGnTQ7C6hAXrcmGFWKs8ejxQ/tusiji03.gif", "https://public.sn2.livefilestore.com/y1pDN9sPsaOIGGOEJcqprodc6iFCOgNTuZDdIjxixctJdIvmdtQpR4W_d0eeponqPAEpdfErXcEGYudkPtt1CCb2Q/tusiji05.gif", "https://public.sn2.livefilestore.com/y1pkgIQkVrQpid4HPFHqyvexsd4UvwgffI8TBIWVVt8S5EfY6ANouvUOxShyol5IIqKdIti4XKKaa7jy3-axTmyHA/tusiji07.gif", "https://public.sn2.livefilestore.com/y1pkgIQkVrQpifeotR0GsOeseyOuqvcOyQBPZLDTjWxzvIvO-wnsBq3mBtmxLSCCI1J3pQumih4z-I8eCvGnisLwQ/tusiji06.gif", "https://public.sn2.livefilestore.com/y1pkgIQkVrQpifPkYkolfGXSlONvDztGcrNb82Z18sdpp0vX44qZNTz29ht3iASm4UBpbTDzgc-YqW3Z0EZBVivkg/tusiji08.gif", "https://public.sn2.livefilestore.com/y1pklbGMnKFv4io5jmuIT8EiafQxDrkQQf0b92Po9e3uzESvwV6FUmUaaz4ZYRo7b2_pFzFZpmiU_xZRTnoASR7NQ/tusiji09.gif", "https://public.sn2.livefilestore.com/y1pklbGMnKFv4jIL7tn49KxMtDg89nH_BRMSsJtO-Re-MWcLTS0X5zZvTlLnaJ1C1wq2nk9NFm6muH7rADXhCzPcQ/tusiji10.gif", "https://public.sn2.livefilestore.com/y1pklbGMnKFv4i03RQIj0v33qrjHNzzpvwAV-JYr-vN9MGkubPqt0qgBZpIl2EEHvpVylb-aHNfh5GypKTlnUX11g/tusiji11.gif", "https://public.sn2.livefilestore.com/y1p9F1AtLZp_-fh7u5BF_VdIKpv9zqN9oLuFB2D-Naw2wO86CR42XZrgQSz9es5Y-bxz_8mJDUi0cBlj7BHOuYwKA/tusiji13.gif", "https://public.sn2.livefilestore.com/y1p9F1AtLZp_-fYMVXKSDJqvMvHv4Ja4A2lAr0b2i9RwRnwY4lUDMF4lHso8AiDN3G2Jq5i_wRcynGCFFg0OFF0YA/tusiji14.gif", "https://public.sn2.livefilestore.com/y1p9F1AtLZp_-eF9iW6smKTehTEOYctE1P_dFEo2fqSQMCodEx2G1Dm3y6iDjS6waOU2p5qeSFtJEY-rz1r_mq36Q/tusiji12.gif", "https://public.sn2.livefilestore.com/y1pY9zX1WH-XSEKh4QDHvn879AAB9VimsB2hwNwDRuqNhtnkvRoHeOoIpsdeuBFHBR53EvJCu7ycSjGMK1fadmS2Q/tusiji15.gif", "https://public.sn2.livefilestore.com/y1pWrvKRijNAWScqgpcZu2fzG4AZeodGXXxAPL2HpzMRRHTQWu2jgUoQDnDRW7xmBQK8ccnX0_UnGejP03FZPtA0g/tusiji16.gif", "https://public.sn2.livefilestore.com/y1pWrvKRijNAWQF1_O4pRaiwMpAO-BdFt2iujTp29dnTc2NGS_3hMmcKjP7GTdj1Sva_c4dDIQVDzoMUDFpvz7BVA/tusiji17.gif", "https://public.sn2.livefilestore.com/y1ptDRD17RlSNbpYsIo3UIb73t6ubLhf2THlwJRV7CwDzO2dQjjAWUSI3rc5Akla6rRHsHqhS9cHVD4g-P1mnDrhQ/tusiji18.gif", "https://public.sn2.livefilestore.com/y1ptDRD17RlSNZBgxH8sDaiF7cvVbcojd_tfLEl8zAmDxXF3J4K_HTVVQ7HcXlJfEMVPHd6wJAPaON1rCRi3FxwbQ/tusiji19.gif", "https://public.sn2.livefilestore.com/y1pHAK8uGQCi1MxahjyMoNxdGfJb04Knq38s-rB5PmcK0kst-Vub0ctQ6EfW0ZMlWt0FgO0i_IMRpeIHYf5lEJR_g/tusiji20.gif", "https://public.sn2.livefilestore.com/y1poXlWx1_flLk1SLHwBhUc4DtnXSrc3kBPz0OCDPAAJQrnEZ5iZ0O4LcqLIuYCSLgaP0DuCll6PCs7VRQQfLfc7w/tusiji21.gif", "https://public.sn2.livefilestore.com/y1poXlWx1_flLmQcO93xRJm0kkDNNKx8wttumf3Ym0OnZ11KpVkIAUSH81iiadQYwJOj70m6vul_toOlcIWZZX1Zw/tusiji22.gif", "https://public.sn2.livefilestore.com/y1poXlWx1_flLnAMpbBzQKDELOiyLbB5cD2BpaM25P9WRgrWc8idJtaQvVD7M5KIMpLn3CuNfUMeHxb3yA0GsnC9A/tusiji23.gif", "https://public.sn2.livefilestore.com/y1pamGsMm1lqrPCXkRlj9c_lS6HuSqVCURqtJAU-wIwlQZl864xxF_NDs-dDl2VplRBgPqn--ivbvkit7ncYesC5A/tusiji25.gif", "https://public.sn2.livefilestore.com/y1pKnYb3XFQZ6ubZ6iCGacuQRd-W91nlb3LnYkRUY2Xs5rpnpW6ylQIYvZZlgenbOK4zUgMBz0d7RhLiP7VXIy_fQ/tusiji24.gif", "https://public.sn2.livefilestore.com/y1pKnYb3XFQZ6vX4aXLXY0h6TnNxs6Odtytr6k_WVYC4i2_lCBjmGY_kA1av8CpiixXwxiNWXLiIizZN5hgTkHfDA/tusiji26.gif", "https://public.sn2.livefilestore.com/y1ppPDCHBMYFWkNzQ2cX9r1AVCPxNsvFWn_r4i_XW16EuiibkbvuPtXdk0ELg8FQsKWzQSOoKLR-Q3kivtrLdHBWQ/tusiji27.gif", "https://public.sn2.livefilestore.com/y1p-0P15kxdejBqmXgdNNxlzY83VPqEUiue01qPbszp1xxd2VjTPADncKlO30WdfgRhOOtMKe_K2TToMekfpncTjg/tusiji28.gif", "https://public.sn2.livefilestore.com/y1p-0P15kxdejCtMZf0puoLS68CWoa36yU2SUmQsSNhuFadVdw5sxO5cEjoAgnNTPjpe_B26bPPnzPxlFrxyaavcA/tusiji29.gif", "https://public.sn2.livefilestore.com/y1ptnGGNJN07hqx-mEOUSJ_q4Xiq_-Ptcn7AYxdq297LYij9sX4khPRjT27Tg150ovVMgsXVLFCnegrw5sI_53rug/tusiji30.gif", "https://public.sn2.livefilestore.com/y1pWmJSYV94O6IQn9HvQeY93K6cD8rlEYPewmZMDeJ6pP_xwCZBQH_pU5ZyvDaftuQIt57Q_N4gBwGusJFyKVSL9w/tusiji31.gif", "https://public.sn2.livefilestore.com/y1pWmJSYV94O6JH_RylUJSonmzPJe1iWs5aJalcs7s6zaEK6hxkGUpw1bQ1mQe84sUFqMKOuL0RuoH3zmiishVipA/tusiji32.gif", "https://public.sn2.livefilestore.com/y1pvrQ5sBTGNff6RorO8VfesX1mkRk3rv9k3b2ODbfdXEIaHSKFJ6ITqDXQnutHQm8jucT7u5V7Lfiq9qIHMqNuGA/tusiji33.gif", "https://public.sn2.livefilestore.com/y1pN3OuRqx9PXR8iLRe4Ghc5zEMP6QLmS58wYM_0FP31yCOwEPv-dO82rS4FXKKolzHpO4_zrZ-Ac-jWIrswLIxiQ/tusiji34.gif", "https://public.sn2.livefilestore.com/y1pv0E7dl-IlUQIt0LYp20US603kXJwH7Ny1t_qreV3UtVu1EuVXEdaWJIXe3nXSHMMfh_pRp19LJ-9F0Sn94d93Q/tusiji35.gif", "https://public.sn2.livefilestore.com/y1pv0E7dl-IlUSh-OFZJ8sfcG1A-QWpGoUcnXSCE8ZprUgyhTFy1GxpchIjcYIHDYhibs7NX-jU8ZeWgxqSvpp0SA/tusiji36.gif", "https://public.sn2.livefilestore.com/y1p2WXGV_4dRU6bJIFKITx2zTxrW6mhLKOZiwtGWLdsut8ssrxHq-HXP2vpCj6bkiFD7rugs9hZFwPFz9JJWBmKNQ/tusiji37.gif", "https://public.sn2.livefilestore.com/y1ppY3zJpsc6uauW0ua54BEpJD38BcH67WsA6YgSx7dYmayzr6gGYfwdUWaKY6CaaHR8yDzpLPj0RWtUa5f9_34Pw/tusiji39.gif", "https://public.sn2.livefilestore.com/y1ppY3zJpsc6ubSH_lSf4MjjAg9vzMa1x_9a23DbSnN6ZgSrK4YqdCj5YSPpIqM7fm2WkEOTi0mVJ3YnNPQAaZt5w/tusiji38.gif", "https://public.sn2.livefilestore.com/y1pMavtpVdPZ5HRtGKjphTh5Il54lxQtJsovV5egzMLjVjOUB96A9GdM4IOinRck57-hJj-vjhpfqsAzZ1uQhAIBQ/tusiji40.gif", "https://public.sn2.livefilestore.com/y1p7zMEE-wQM9KsGdfAXCcQ6S8juXjWKXvincEa-Yob3yloLuLcZFtno0c4q_hIFi3IkoPCjc0NjHCgmEnrm8TCcg/tusiji41.gif", "https://public.sn2.livefilestore.com/y1pi6I8C4tVatbJcGZmMZiNfVzbRLiavfFg7-9yaKZkNM1PInMrDQCd6woWsPAPG0Bq4rSEjwS7mCH6j_D8xInH_Q/tusiji42.gif", "https://public.sn2.livefilestore.com/y1pBhmIMy8rZ_iwSXaQ2tIhSu0CzGM9EAv52rlNAS9SGl8Envygm_zLRplnjIIxcQJez6ppjmeIAM481if504exLw/tusiji43.gif", "https://public.sn2.livefilestore.com/y1pBhmIMy8rZ_hRtHz3XBxXCuWt8myT02biMCjloffHxsC73e9L0Yja73Jj9A3gG0EF3q1EbObdszbfCoP7GMY7Ow/tusiji44.gif", "https://public.sn2.livefilestore.com/y1pWRkOL1EbB3AUGkZnCvTclzqpZ9GXSgcQqwjRa3dM8_BTeQRpY2kUSwTXGSVx1xBB0mer4XukMy8UMLb-MDj9LA/tusiji45.gif", "https://public.sn2.livefilestore.com/y1psknr3hdLGqWxDPYDX1iMCY0PolOrk4N7KnTubgm45cCIvuHB30UnzWTahtgYsqUPe7j1pEP4TIhEBGgfOFnrMw/tusiji46.gif", "https://public.sn2.livefilestore.com/y1pXdTayZOaao_iJM8WQ-lPaIo_DlRpgiJ8_eYCnB9ez0JiJeKn1i6W7oX1EmBjL5ZovTeQLBRuu-Ot4PsUvjlGzg/tusiji47.gif", "https://public.sn2.livefilestore.com/y1pSFqWdTBiBzGZzw0TQXOt-CmDNww5_MZLJIBAqWQT-9pN3f65_3JhSuwcKKU0Ftg1QdB-eRLVhNa8Nh9DpiEcig/tusiji48.gif", "https://public.sn2.livefilestore.com/y1pjtZU0HOO5zPlBNPTmUf7k_tRyQXXPwtggCPqs4Z5gPl87UOlbfWnjmKe_5EMPnGpo_p3qKl6evT1RuXCxzzj5A/tusiji49.gif", "https://public.sn2.livefilestore.com/y1pxcNg9qCGBmU00Mt1z8cXSCfRezbbyxMF8Dt1FxpmBG4PY8eHCfKEH0Pz2w1lpf1e5x2Vgb8YsspYr4EUUa0Ibg/tusiji50.gif", "https://public.sn2.livefilestore.com/y1pbtrnaUqSQcPgzKakPjHhVQmI8kXDbGkm1ehwt5WTinUC9JUOYo1DnOkEHr5D45cTkTGKSZyShLkG_2GoHiPNWQ/tusiji51.gif", "https://public.sn2.livefilestore.com/y1pbtrnaUqSQcNP0ViQB2jfG9GbMV4WIlC7o29y0WSsQasUhKU1-FXLSO_stAwwDKlvBderb8MtZ1mBY4nibwxKPg/tusiji52.gif", "https://public.sn2.livefilestore.com/y1pL97RpxnvH5I8X2PARrbDl0FrD-BCtyjNvQlH9F7fPWk8RJ4kQPWVIk1wehc3Bm3FAgYdIoIyNrYn2J_sd46z7A/tusiji53.gif"];


/***********************************以下部分就不要随便动了。*****************************************/
function lodex(r) {
	return window.location.href.indexOf(r);
}
function tidex(r) {
	return document.title.indexOf(r);
}
GM_addStyle('#pages{padding:-2px 0px 2px 0px; font-size:12px}#fastsmilies{display:none}.modyButton{text-align:right; cursor:pointer;color:black;font-size:14px}.modyButton:hover,ap:hover,.inliness:hover {color: #008B8B}#modiSpam{margin:0 0 0 0} ap{text-align:right; cursor:pointer; display:inline-block;} #kindUl{border-bottom-style:double;,border-width:3px; border-color:gray} #gifList{padding:2px 0px; border-bottom-style:double;border-width:3px;border-color:gray} .inliness{text-align:center;cursor:pointer; font-size:15px; display:inline-block;} .curr{color:blue;} .defaultpost{min-height:130px !important;}');

var whiSm = Math.floor(Math.random() * (smileName.length));
var logoN = Math.floor(Math.random() * (modiArray(whiSm).length));
var gifUrl = modiArray(whiSm)[logoN].replace(/\d/, "");

if (tidex("草榴社區") != -1) {
	if ($('textarea').length > 0) {
		if ($('textarea').val().indexOf("[color=#0000FF]") == -1) {
			$('textarea').val(function () {
				return this.value += "[color=#0000FF]  [/color]"
			})
		}
	}
	if (lodex("post.php") != -1) {
		var smLogo = $('<img>', {
				id : "smLogo",
				src : gifUrl,
				alt : "插入自定义表情",
				title : "插入自定义表情",
				click : fillit,
				style : "cursor:pointer"
			}).css({
				"height" : "40px",
				"margin" : "0px 0px 5px 50px"
			}).insertAfter($('.fl').css({
					"display" : "inline"
				}));
	}
}
if ((tidex("SexInSex! Board") != -1 || tidex("SiS001! Board") != -1) && $('#smilieslist').length != 0) {
	if (lodex("post.php") != -1) {
		var smLogo = $('<img>', {
				id : "smLogo",
				src : gifUrl,
				alt : "插入自定义表情",
				click : fillit,
				style : "cursor:pointer"
			}).css({
				"height" : "40px",
				"margin" : "-39px 0px -8px 400px"
			}).appendTo($('#posteditor_switcher'));
	} else {
		var smLogo = $('<img>', {
				id : "smLogo",
				src : gifUrl,
				alt : "插入自定义表情",
				click : fillit,
				style : "cursor:pointer"
			}).css({
				"height" : "28px",
				"margin" : "0px 0px -7px 20px"
			}).insertAfter($('[name="subject"],#subject'));
	}
}
if (tidex("18P2P") != -1) {
	if ($('textarea').length > 0 && lodex("action=profile") == -1) {
		if ($('textarea').val().indexOf("[size=4][color=Blue]") == -1) {
			$('textarea').val(function () {
				return this.value += "[size=4][color=Blue]  [/color][/size]"
			})
		}
	}
	if (lodex("viewthread.php") != -1 || lodex("redirect.php") != -1 || lodex("pm.php?action=send") != -1) {
		var smLogo = $('<img>', {
				id : "smLogo",
				src : gifUrl,
				alt : "插入自定义表情",
				click : fillit,
				style : "cursor:pointer"
			}).css({
				"height" : "28px",
				"margin" : "0px 0px -7px 15px"
			}).appendTo($('td>[name="subject"]')[0].parentNode); ;
	}
	if (lodex("post.php") != -1) {
		$('.altbg2>.smalltxt>br,.altbg1>br').detach();
		var smLogo = $('<img>', {
				id : "smLogo",
				src : gifUrl,
				alt : "插入自定义表情",
				click : fillit,
				style : "cursor:pointer"
			}).insertAfter($('.altbg2:not([align="center"])>table').css({
					"display" : "inline"
				})).css({
				"height" : "40px",
				"margin" : "0px 0px 0px 30px"
			});
	}
}

function fillit() {
	var logoRect = $("#smLogo")[0].getClientRects()[0];
	var Listdiv = $("<div>", {
			id : "smilieList",
			width : "368",
			height : "186"
		}).mouseleave(function () {
			$('#smilieList').detach()
		}).css({
			"backgroundColor" : "white",
			"position" : "fixed",
			"left" : logoRect.left - 184 + logoRect.width / 2,
			"top" : (((logoRect.top - 186 + logoRect.height) < 0) ? 0 : (logoRect.top - 186 + logoRect.height)),
			"border-style" : "double",
			"border-width" : "4px",
			"border-color" : "gray"
		}).appendTo(document.body);
	createHeadDiv($("#smilieList")[0], pload, "smile")
	var gifList = $("<div>", {
			id : "gifList",
			width : "368",
			height : "136"
		}).css("background-color", "LightGray").appendTo(Listdiv);
	if (GM_getValue("current_smilies") == null || GM_getValue("current_page") == null) {
		GM_setValue("current_smilies", 0);
		GM_setValue("current_page", 1);
	}
	$("#smile" + GM_getValue("current_smilies")).addClass("curr");
	var maxpage = Math.ceil(modiArray(GM_getValue("current_smilies")).length / 32);
	pload(GM_getValue("current_smilies"), GM_getValue("current_page"));
	var pages = $("<div>", {
			id : "pages",
			height : "20"
		}).appendTo(Listdiv);
	$("<ap>", {
		html : "上一页",
		width : "45"
	}).click(function () {
		var page = GM_getValue("current_page") - 1;
		pload($(".curr").val(), page)
	}).appendTo(pages);
	$("<ap>", {
		html : "下一页",
		width : "45"
	}).click(function () {
		var page = GM_getValue("current_page") + 1;
		pload($(".curr").val(), page)
	}).appendTo(pages);
	var modiSpam = $("<spam>", {
			id : "modiSpam",
			width : "270"
		}).appendTo(pages);
	$("<ap>", {
		html : "调整顺序",
		id : "modibutton",
		width : "120",
		click : modifySm
	}).appendTo(modiSpam);
	$("<ap>", {
		html : "恢复原始",
		title : "请注意：如果本组有新增表情，就必须点这里刷新一下",
		width : "60",
		click : ResetAll
	}).appendTo(modiSpam);
	$("<spam>", {
		id : "pagespam",
		html : GM_getValue("current_page") + "/" + maxpage + "&nbsp;"
	}).css({
		"float" : "right"
	}).appendTo(pages);
}

function createHeadDiv(div, iFunc, idd) {
	var listRect = div.getClientRects()[0];
	var kindUl = $("<div>", {
			id : "kindUl",
			height : "21px"
		}).appendTo(div);
	for (i = 0; i < smileName.length; i++) {
		$("<div>", {
			id : idd + i,
			class : "inliness",
			width : ((listRect.width - 2) / smileName.length - 2),
			html : smileName[i],
			val : i
		}).click(function () {
			$(".curr").removeClass("curr");
			$(this).addClass("curr");
			iFunc($(this).val(), 1)
		}).appendTo(kindUl);
	}
}

function pload(smileKind, p) {
	var smileKind = Number(smileKind);
	GM_setValue("current_smilies", smileKind);
	var smileKindd = modiArray(smileKind)
		var maxer = Math.ceil(smileKindd.length / 32);
	if (p < 1) {
		p = maxer
	}
	if (p > maxer) {
		p = 1
	}
	GM_setValue("current_page", p);
	$('#gifList').empty();
	$("#pagespam").html(p + "/" + maxer + "&nbsp;");
	if (smileKindd[0]) {
		for (i = (0 + (p - 1) * 32); i < ((p < maxer) ? p * 32 : smileKindd.length); i++) {
			var newvix = $("<div>").css({
					"display" : "inline-block",
					"width" : "46px",
					"height" : "34px"
				}).appendTo($('#gifList'));
			$("<img>", {
				src : smileKindd[i].replace(/\d/, ""),
				smkind : smileKindd[i].match(/\d/)[0]
			}).click(function () {
				var wl = 0;
				if ($('textarea').length > 1) {
					wl = 1;
				};
                var tagv="";
                if (this.getAttribute("smkind")=="1" || this.getAttribute("smkind")=="2" ){
                    tagv='[img=25,25]';
                }else{
                    tagv='[img]';
                };
				$("textarea")[wl].value = $("textarea")[wl].value.slice(0, $("textarea")[wl].selectionStart) + tagv + this.src + '[/img]' + $("textarea")[wl].value.slice($("textarea")[wl].selectionEnd);
			}).css({
				"cursor" : "pointer",
				"width" : "30px",
				"height" : "30px",
				"margin" : "1px 8px"
			}).mouseover(function () {
				var rect = $("#smilieList")[0].getClientRects()[0];
				var floatDiv = $("<div>", {
						id : "floatDiv"
					}).css({
						"position" : "fixed",
						"left" : rect.left + rect.width,
						"top" : rect.top,
						"border-style" : "solid",
						"border-width" : "1px"
					}).appendTo(document.body);
				$("<img>", {
					src : this.src
				}).css({
					"background-color" : "#FFFFFF"
				}).appendTo(floatDiv);
			}).mouseout(function () {
				$('#floatDiv').detach()
			}).appendTo(newvix);
		}
	}
}

function loadGifs(smileKind, p) {
	var smileKind = Number(smileKind);
	GM_setValue("current_smilies", smileKind);
	$("#gifDiv2").empty();
	var modiDivHeight = Math.ceil(modiArray(smileKind).length / 8) * 35 + 23;
	$("#modiBigDiv").css({
		height : ((modiDivHeight < 290) ? 290 : modiDivHeight)
	});
	$("#gifDiv2").css({
		height : ((modiDivHeight < 290) ? 267 : modiDivHeight - 23)
	});
	var currentSm = modiArray(smileKind);
	if (currentSm[0]) {
		for (i = 0; i < currentSm.length; i++) {
			var newvix = $("<div>").click(function () {
					this.firstChild.checked = "checked";
				}).css({
					"display" : "inline-block",
					"width" : "54px",
					"height" : "34px",
					"background-color" : ((i < 32) ? "#DEB887" : "white"),
					"border-bottom-style" : "solid",
					"border-right-style" : "solid",
					"border-width" : "1px",
					"border-color" : "gray"
				}).appendTo($("#gifDiv2"));
			$("<input>", {
				type : "radio",
				id : "radios" + i,
				name : "modyRadio",
				val : i
			}).appendTo(newvix);
			$("<img>", {
				src : currentSm[i].replace(/\d/, "")
			}).css({
				"cursor" : "pointer",
				"width" : "30px",
				"height" : "30px",
				"margin" : "2px 0px"
			}).mouseover(function () {
				var rect = $("#modiBigDiv")[0].getClientRects()[0];
				var floatDiv = $("<div>", {
						id : "floatDiv"
					}).css({
						"position" : "fixed",
						"left" : rect.left + rect.width,
						"top" : rect.top,
						"border-style" : "solid",
						"border-width" : "1px"
					}).appendTo(document.body);
				$("<img>", {
					src : this.src
				}).css({
					"background-color" : "#FFFFFF"
				}).appendTo(floatDiv);
			}).mouseout(function () {
				$('#floatDiv').detach()
			}).appendTo(newvix);
		}
	}
}

function modiArray(ar) {
	var newArray = new Array();
	if (ar != 0) {
		if (!GM_getValue(ar + "_modifyIndx")) {
			var newMo = "";
			if (allSmile[ar].length != 0) {
				for (i = 0; i < allSmile[ar].length; i++) {
					newMo += ((newMo == "") ? "" : ",") + i;
				}
			} else {
				newMo = "nothing";
			}
			GM_setValue(ar + "_modifyIndx", newMo);
		}
		if (GM_getValue(ar + "_modifyIndx") != "nothing") {
			var newIndex = GM_getValue(ar + "_modifyIndx").split(",");
			for (n = 0; n < newIndex.length; n++) {
				newlength = newArray.push(ar + allSmile[ar][Number(newIndex[n])]);
			}
		}
	} else {
		var newIndex = GM_getValue("0_modifyIndx").split(",");
		for (n = 0; n < newIndex.length; n++) {
			var kindss = newIndex[n].split(":")[0];
			var indexx = newIndex[n].split(":")[1];
			newlength = newArray.push(kindss + allSmile[kindss][indexx]);
		}
	}
	return newArray
}

function modifySm() {
	var modiBtRect = document.getElementById("modibutton").getClientRects()[0];
	var modiDivHeight = Math.ceil(modiArray(GM_getValue("current_smilies")).length / 8) * 35 + 23;
	var allMileDiv = $("<div>", {
			id : "modiBigDiv",
			width : "520",
			height : ((modiDivHeight < 290) ? 290 : modiDivHeight)
		}).css({
			"background-color" : "white",
			"position" : "fixed",
			"left" : modiBtRect.left - 184 + modiBtRect.width / 2,
			"top" : (((modiBtRect.top - 186 + modiBtRect.height) < 0) ? 0 : (modiBtRect.top - 186 + modiBtRect.height)),
			"border-style" : "double",
			"border-width" : "4px",
			"border-color" : "gray"
		}).appendTo(document.body);
	createHeadDiv($("#modiBigDiv")[0], loadGifs, "Mosmile");
	$(".curr").removeClass("curr");
	$("#Mosmile" + GM_getValue("current_smilies")).addClass("curr");
	var leftSideDiv = $("<div>", {
			id : "leftSideDiv",
			width : "70",
			height : 250
		}).css({
			"min-height" : "268",
			"position" : "relative",
			"left" : "0",
			"top" : 10,
			"display" : "inline-block",
			"float" : "left"
		}).appendTo(allMileDiv);
	$("<div>", {
		class : "modyButton",
		html : "恢复原始",
		width : "65"
	}).click(function () {
		ResetAll();
		loadGifs(GM_getValue("current_smilies"));
	}).css({
		"margin" : "0px 0px 15px 0"
	}).appendTo(leftSideDiv);
	$("<div>", {
		class : "modyButton",
		html : "移到最前",
		width : "65"
	}).click(function () {
		MoveUp(999);
		loadGifs(GM_getValue("current_smilies"));
		$("#radios" + GM_getValue("orderIndex_temp"))[0].checked = "checked";
	}).appendTo(leftSideDiv);
	$("<div>", {
		class : "modyButton",
		html : "上移一行",
		width : "65"
	}).click(function () {
		MoveUp(8);
		loadGifs(GM_getValue("current_smilies"));
		$("#radios" + GM_getValue("orderIndex_temp"))[0].checked = "checked";
	}).appendTo(leftSideDiv);
	$("<div>", {
		class : "modyButton",
		html : "前移一位",
		width : "65"
	}).click(function () {
		MoveUp(1);
		loadGifs(GM_getValue("current_smilies"));
		$("#radios" + GM_getValue("orderIndex_temp"))[0].checked = "checked";
	}).appendTo(leftSideDiv);
	$("<div>", {
		class : "modyButton",
		html : "后移一位",
		width : "65"
	}).click(function () {
		moveDown(2);
		loadGifs(GM_getValue("current_smilies"));
		$("#radios" + (GM_getValue("orderIndex_temp") - 1))[0].checked = "checked";
	}).appendTo(leftSideDiv);
	$("<div>", {
		class : "modyButton",
		html : "下移一行",
		width : "65"
	}).click(function () {
		moveDown(9);
		loadGifs(GM_getValue("current_smilies"));
		$("#radios" + (GM_getValue("orderIndex_temp") - 1))[0].checked = "checked";
	}).appendTo(leftSideDiv);
	$("<div>", {
		class : "modyButton",
		html : "移到末尾",
		width : "65"
	}).click(function () {
		moveDown(999);
		loadGifs(GM_getValue("current_smilies"));
		$("#radios" + (GM_getValue("orderIndex_temp") - 1))[0].checked = "checked";
	}).appendTo(leftSideDiv);
	$("<div>", {
		class : "modyButton",
		html : "选入常用",
		width : "65",
		click : joinUsual
	}).css({
		"margin" : "15px 0px 0px 0"
	}).appendTo(leftSideDiv);
	$("<div>", {
		class : "modyButton",
		html : "删除所选",
		width : "65"
	}).click(function () {
		deleteIt();
		loadGifs(GM_getValue("current_smilies"));
	}).appendTo(leftSideDiv);
	$("<div>", {
		class : "modyButton",
		html : "完成设置",
		width : "65",
		click : finishModi
	}).css({
		"margin" : "15px 0px 0px 0"
	}).appendTo(leftSideDiv);
	$("<div>", {
		id : "gifDiv2",
		width : "440",
		height : ((modiDivHeight < 290) ? 267 : modiDivHeight - 23)
	}).css({
		"margin" : "0px -1px 0px 0px",
		"float" : "right",
		"border-left-style" : "groove"
	}).appendTo(allMileDiv);
	loadGifs(GM_getValue("current_smilies"));
}

function ResetAll() {
	var warnning = confirm("此举将清除手工排序的一切成果，\r\n恢复到脚本中原始的排序！\r\n\r\n当然，它的作用只针对本组表情，对其它组无影响。\r\n还有，如果你向脚本中新增过表情，那你就来对了,只有这样它们才会生效。");
	if (warnning) {
		var trt = GM_getValue("current_smilies");
		GM_deleteValue(trt + "_modifyIndx");
		if (trt != 0) {
			newMo = "";
			if (allSmile[trt].length != 0) {
				for (i = 0; i < allSmile[trt].length; i++) {
					newMo += ((newMo == "") ? "" : ",") + i;
				}
			} else {
				newMo = "nothing";
			}
		} else {
			newMo = modi0;
		}
		GM_setValue(trt + "_modifyIndx", newMo);
	}
}

function MoveUp(t) {
	if (getRadio()) {
		var trt = GM_getValue("current_smilies");
		var thisIndex = Number(getRadio());
		if ((thisIndex - t) > -1) {
			var orderIndex = thisIndex - t;
		} else {
			var orderIndex = 0;
		}
		var crtModiAr = GM_getValue(trt + "_modifyIndx").split(",");
		var thisNode = crtModiAr[thisIndex];
		crtModiAr.splice(thisIndex, 1);
		crtModiAr.splice(orderIndex, 0, thisNode);
		GM_setValue("orderIndex_temp", orderIndex);
		GM_setValue(trt + "_modifyIndx", crtModiAr.join());
	} else {
		alert("你必须选中一个图标啊！")
	}
}

function moveDown(t) {
	if (getRadio()) {
		var trt = GM_getValue("current_smilies");
		var crtModiAr = GM_getValue(trt + "_modifyIndx").split(",");
		var thisIndex = Number(getRadio());
		if ((thisIndex + t) < crtModiAr.length) {
			var orderIndex = thisIndex + t;
		} else {
			var orderIndex = crtModiAr.length;
		}
		var thisNode = crtModiAr[thisIndex];
		crtModiAr.splice(orderIndex, 0, thisNode);
		crtModiAr.splice(thisIndex, 1);
		GM_setValue("orderIndex_temp", orderIndex);
		GM_setValue(trt + "_modifyIndx", crtModiAr.join());
	} else {
		alert("你必须选中一个图标啊！")
	}
}

function joinUsual() {
	if (GM_getValue("current_smilies") != 0) {
		if (getRadio()) {
			var trt = GM_getValue("current_smilies");
			var crtModiAr = GM_getValue(trt + "_modifyIndx").split(",");
			var thisIndex = Number(getRadio());
			var thisNode = crtModiAr[thisIndex];
			var newUsual = trt + ":" + thisNode;
			var allUsual = GM_getValue("0_modifyIndx")
				var allUsual = (allUsual == "nothing") ? newUsual : (allUsual + "," + newUsual)
				GM_setValue("0_modifyIndx", allUsual);
			alert("此表情已经成功加入“常用表情组”")
		} else {
			alert("你必须选中一个图标啊！")
		}
	}
}

function deleteIt() {
	if (getRadio()) {
		var warnning = confirm("删除所选表情吗？\r\n\r\n此删除只是从列表中屏蔽，并非真正删除，点击“恢复原始”后它还会出现。");
		if (warnning) {
			var trt = GM_getValue("current_smilies");
			var crtModiAr = GM_getValue(trt + "_modifyIndx").split(",");
			var thisIndex = Number(getRadio());
			crtModiAr.splice(thisIndex, 1);
			if (crtModiAr.length == 0) {
				GM_setValue(trt + "_modifyIndx", "nothing");
			} else {
				GM_setValue(trt + "_modifyIndx", crtModiAr.join());
			}
		}
	} else {
		alert("你必须选中一个图标啊！")
	}
}

function finishModi() {
	$("#modiBigDiv").empty();
	document.body.removeChild($("#modiBigDiv")[0]);
}

function getRadio() {
	return $('[name="modyRadio"]:checked').val();
}
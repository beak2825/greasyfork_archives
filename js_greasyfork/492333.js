// ==UserScript==
// @name         MWI玩家图标替换
// @namespace    OvO
// @version      2.65
// @description  替换战斗页面指定玩家图标，本地可见
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       Ak4r1 ChatGpt Stella bot7420
// @match        *://www.milkywayidle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492333/MWI%E7%8E%A9%E5%AE%B6%E5%9B%BE%E6%A0%87%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/492333/MWI%E7%8E%A9%E5%AE%B6%E5%9B%BE%E6%A0%87%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

// 替换的目标名称和对应的图片链接
var replacementTargets = {
    "000cat000": "https://tupian.li/images/2024/11/15/6736e6d845e0d.png",
    "2Alo": "https://attach.cgjoy.com/attachment/forum/201507/27/115430tozu4k5ui8akupiq.gif",
    "569de": "https://pic1.imgdb.cn/item/6802285588c538a9b5dbf5fb.gif",
    "7uta": "https://tupian.li/images/2025/04/30/68123736a8865.gif", 
    "7BagTea": "https://tupian.li/images/2024/03/31/66085ea356ad8.png",
    "a987": "https://pic.imgdb.cn/item/66c346e4d9c307b7e9307601.gif",
    "avnuna": "https://s2.loli.net/2024/07/04/a3WrE5gJ2AKUIRl.jpg",
    "andyljg": "https://tupian.li/images/2024/08/23/66c7642d39dfb.webp",
    "A7": "https://i0.hdslb.com/bfs/article/a25918f7fd6580bfd3aa686d2542f719837e2c4f.gif@1256w_1226h_!web-article-pic.avif",
    "Acha": "https://tupian.li/images/2024/03/31/66085ea356ad8.png",
    "Ak4r1": "https://tupian.li/images/2024/03/31/6608644dc77c0.png",
    "Avicii": "https://tupian.li/images/2025/04/07/67f3e74f8e201.jpg",
    "Aries0N": "https://tupian.li/images/2025/05/06/681a0d19335d0.gif",
    "Adi1324": "https://tupian.li/images/2025/01/09/677f7fdcf302f.jpg",
    "Auroraliu": "https://s1.imagehub.cc/images/2024/11/21/0b0a2c3985fca10f1b16d24f6c5c38cf.png",
    "bsyno2": "https://tupian.li/images/2024/04/25/662a477d6f9e1.jpg",
    "bobo666": "https://img.picgo.net/2024/08/23/7Q2u-jj5sK2qT1kS8w-8w39383feba8c95b96.md.gif",
    "bot7420": "https://tupian.li/images/2024/05/22/664cecbb9786a.jpg",
    "berstar": "https://tupian.li/images/2024/06/24/6678ecfd5acf2.gif",
    "bowknot": "https://pic.imgdb.cn/item/66a24351d9c307b7e972a5b3.jpg",
    "beinliu": "https://tupian.li/images/2024/10/02/66fd1089238c2.gif",
    "brbbswd1": "https://7a597613.imageupload123.pages.dev/file/5f185bf2043909efe4ca5.gif",
    "belineBOW": "https://tupian.li/images/2024/12/09/6756b851e88f0.gif",
    "belinetang": "https://tupian.li/images/2025/01/09/677fdaff32537.gif",
    "belineMagic": "https://tupian.li/images/2025/01/08/677ded7bdacd1.gif",
    "Binah": "https://tupian.li/images/2024/09/12/66e1cd0060233.jpg",
    "BeiJie": "https://pic4.zhimg.com/80/v2-0b72d4d7436791c922695818d486fc7f_720w.webp",
    "Bearui": "https://tupian.li/images/2024/04/12/661906c21a5f3.jpg",
    "BuGua233": "https://tupian.li/images/2024/09/12/66e2447d45002.png",
    "Beholder": "https://tupian.li/images/2024/06/19/6672554a2d2f3.png",
    "BrokenYuri": "https://www.freeimg.cn/i/2024/07/15/66951c78a50bc.jpg",
    "clmodos": "https://tupian.li/images/2024/06/24/6678e8ec88145.png",
    "carlming": "https://tupian.li/images/2024/07/04/6685f843aa6f3.jpg",
    "crystal2": "https://tupian.li/images/2024/09/09/66dedb35caaca.jpg",
    "concerto24": "https://tupian.li/images/2024/07/26/66a3506f388d9.gif",
    "cancannide": "https://tupian.li/images/2024/10/16/670f88695302f.png",
    "Comi":"https://profileimages-cdn.torn.com/a4b0462e-941e-4a33-9442-86388d79d346-2672158.gif?v=1940629196397",
    "Chan0": "https://tupian.li/images/2024/04/25/662a45b04aceb.gif",
    "Crypto": "https://pic.imgdb.cn/item/66977c50d9c307b7e91de776.png",
    "CrazyAI": "https://tupian.li/images/2024/08/30/66d157206c7ea.gif",
    "Crazytrain": "https://tupian.li/images/2024/07/01/668224e51a8b8.png",
    "CatheterPioneer": "http://m.qpic.cn/psc?/V14Ds1o83XJsMm/TmEUgtj9EK6.7V8ajmQrEKZE5cQLJzZirqXXslMa62Oiuv5W0LMrOC87gvi7ImO69X2vHcKg.GdiNy63ul.tDOIfo7zT8rltKiWCk71J9J0!/b&bo=vAKSArwCkgIBFzA!&rf=viewer_4&t=5",
    "dccat": "https://tupian.li/images/2024/06/24/6678e55841fc4.webp",
    "duang": "https://tupian.li/images/2024/09/16/66e8108a0a788.jpeg",
    "diedaye": "https://tupian.li/images/2024/04/12/66194ccc2c516.png",
    "da1banana": "https://tupian.li/images/2025/03/30/67e92fa5f2555.png",
    "DZKKK": "https://pic2.zhimg.com/v2-e7973617e4cc22749aae229a3d10ff91_r.jpg",
    "DayDayUp": "https://s21.ax1x.com/2025/03/16/pEdpBvV.png",
    "Dismason": "https://tupian.li/images/2024/08/23/66c871be4feab.gif",
    "DeadlyCore": "https://tupian.li/images/2024/10/29/672028563d93f.gif",
    "ezbot": "https://tupian.li/images/2024/11/13/6734705f63b00.jpeg",
    "EmberV": "https://tupian.li/images/2024/11/09/672f2b1a14fa4.png",
    "Elevenc": "https://tupian.li/images/2024/11/09/672eb65f1b80d.jpg",
    "fan123": "https://tupian.li/images/2024/09/11/66e0f56258064.jpg",
    "feifei": "https://tupian.li/images/2024/09/12/66e285926b937.gif",
    "fengyun": "https://s2.loli.net/2024/07/14/5nTScGrmkxjoCdi.jpg",
    "fading616": "https://tupian.li/images/2024/08/14/66bc1e0c03f66.jpg",
    "Fernweh": "https://tupian.li/images/2024/07/16/6696137a7464d.jpg",
    "Frostleaf08": "https://tupian.li/images/2024/09/29/66f9705a2eddf.jpeg",
    "gegenees": "https://pic.imgdb.cn/item/66a2440dd9c307b7e9733f82.jpg",
    "Guuzz": "https://tupian.li/images/2024/07/08/668b5f4c1f2f1.jpg",
    "hua0": "https://img.picui.cn/free/2024/11/09/672eedd06ef13.jpg",
    "hellojojo": "https://tupian.li/images/2024/08/05/66b0678485f1f.jpg",
    "HGZ888": "https://i0.hdslb.com/bfs/article/473dbdbe1e4f81327509a6f1645b43a58880c060.gif@1256w_1008h_!web-article-pic.avif",
    "Hardys": "https://tupian.li/images/2024/06/29/6680013aea337.gif",
    "HONGHOO": "https://profileimages.torn.com/ded8a4f1-5d46-12ab-2792689.gif?v=1940629196397",
    "HAO0718": "https://img.mp.itc.cn/upload/20161114/1ae86a62ec984b03a6e989684af52f42_th.gif",
    "HeartFireX": "https://tupian.li/images/2024/07/06/6688fc1a6d6cc.jpeg",
    "HolsteinIroncow": "https://tupian.li/images/2024/08/06/66b18937f21c2.gif",
    "ico": "https://tupian.li/images/2024/09/17/66e904ca3640c.jpg",
    "iFor": "https://tupian.li/images/2024/06/28/667e3866d4221.gif",
    "IronMuyu": "https://tupian.li/images/2024/07/02/66840dd3d0727.png",
    "IronZeeman": "https://tupian.li/images/2024/06/24/6678ea25bb2af.gif",
    "IseriNinaIsAGirl": "https://tupian.li/images/2024/08/23/66c7642d39dfb.webp",
    "JackLee": "https://tupian.li/images/2024/09/21/66ee44242a0bb.webp",
    "jizhoulang": "https://tupian.li/images/2024/04/12/661956eedb4ab.png",
    "jihuozhang": "https://pic.imgdb.cn/item/66c88578d9c307b7e99c6923.png",
    "jinjidemingge": "https://tupian.li/images/2024/07/04/66860d8ba9ddd.gif",
    "kbcka": "https://tupian.li/images/2025/05/08/681c96e5f3704.jpg",
    "Katyou": "https://tupian.li/images/2024/11/03/672730821e50b.png",
    "Kotorii": "https://tupian.li/images/2024/10/13/670bbb0cb199b.png",
    "lolik": "https://i0.hdslb.com/bfs/article/d5c7474ebf470aa08bfd15d97fad951393475543.gif@!web-article-pic.avif",
    "laoyue": "https://tupian.li/images/2024/04/12/66194b4eb193c.png",
    "lyRicky": "https://i0.hdslb.com/bfs/article/037676e61262badc05ef0edb802841783a20d1bd.gif@1256w_1078h_!web-article-pic.avif",
    "Lolita": "https://www.freeimg.cn/i/2024/07/15/66951ca469f70.gif",
    "Lapapap": "https://tupian.li/images/2024/07/04/6685f6bb5cdf5.jpg",
    "Lizardegg": "https://tupian.li/images/2024/09/11/66e0ebc4ad906.png",
    "maodou": "https://tupian.li/images/2024/07/01/66823b4ac64a8.png",
    "moxida": "https://zengzh-test.oss-cn-shenzhen.aliyuncs.com/moxida.gif",
    "mingge": "https://tupian.li/images/2024/07/04/66860d8ba9ddd.gif",
    "moyuQwQ": "https://tupian.li/images/2024/07/21/669ce16d807ac.gif",
    "moyu132257": "https://zengzh-test.oss-cn-shenzhen.aliyuncs.com/moyu132257.png",
    "moonlight4637":"https://image-assets.mihuashi.com/2021/06/20/13/Fr0ox8DBD4BZyWzSFFboXnwvYKmD.jpg",
    "Muyu": "https://tupian.li/images/2024/08/22/66c72f3acc3be.gif",
    "M1eFA": "https://tupian.li/images/2025/01/05/677a7fcfdc84c.gif",
    "MEELU": "https://tupian.li/images/2024/11/15/6736d312028ec.jpg",
    "MOGAMI": "https://pic.imgdb.cn/item/669c633ed9c307b7e92b312a.jpg",
    "MuaOvO": "https://tupian.li/images/2024/07/06/6688d0219211b.png",
    "MoMoDD": "https://tupian.li/images/2025/03/29/67e7ef1248437.jpg",
    "MMoonBird": "https://i.ibb.co/JdRMRPJ/pGOEgHx.jpg",
    "Mulianzhi":"https://tupian.li/images/2024/05/20/664ae3cabf5c6.jpg",
    "Mithrandir": "https://img.zcool.cn/community/00207f5a5436b0a8012113c79ded3b.jpg",
    "ManakaGekka": "https://tupian.li/images/2025/03/22/67ddd1813feeb.jpg",
    "MainpowerDoro":"https://tupian.li/images/2024/06/24/6678cfaaa9dd2.webp",
    "niu2": "https://tupian.li/images/2024/06/30/66817889410ea.gif",
    "nxnhsj": "https://pic.imgdb.cn/item/66a242c4d9c307b7e9720126.jpg",
    "nagisaa": "https://pb.nichi.co/twin-before-announce",
    "niuniubb": "https://zengzh-test.oss-cn-shenzhen.aliyuncs.com/niuniubb.gif",
    "Newer": "https://tupian.li/images/2024/04/12/661945e33a522.png",
    "NixPR": "https://f2.toyhou.se/file/f2-toyhou-se/images/93816880_GtzMUWAJwCD1Dny.jpg",
    "NOCan": "https://s21.ax1x.com/2025/03/16/pEdpsDU.png",
    "Nicomon": "https://tupian.li/images/2024/10/26/671c73e0881c7.gif",
    "Neverend": "https://tupian.li/images/2024/07/23/669f4fe6d1a8e.png",
    "orz": "https://img.picui.cn/free/2024/07/04/6685e2257a290.png",
    "offensivetext": "https://pic.imgdb.cn/item/66988be2d9c307b7e92d1227.png",
    "OpenAI": "https://tupian.li/images/2024/08/15/66bd9984cb773.png",
    "OwenGod": "https://tupian.li/images/2025/04/01/67ebe8feca2da.gif",
    "pipira": "https://tupian.li/images/2024/07/17/6697354f50bb2.jpg",
    "paopao": "https://tupian.li/images/2024/07/29/66a7696499de7.jpg",
    "powerful": "https://tupian.li/images/2025/03/15/67d5248d54f9d.gif",
    "Polmes": "https://tupian.li/images/2024/10/18/6711f6a297a3a.jpg",
    "Penginroro": "https://tupian.li/images/2024/11/04/672850abd09e0.jpg",
    "Qsaaa2": "https://tupian.li/images/2025/03/24/67e13d39dc1a2.png",
    "rilence" : "https://profileimages.torn.com/1c05e1bd-1c90-47e7-8d9f-e74bed0fab7a-2625339.png?v=1040063",
    "Riska": "https://tupian.li/images/2024/09/07/66db31c6785f1.gif",
    "Raichu": "https://tupian.li/images/2024/07/05/668759804e914.gif",
    "Riioooo" : "https://tupian.li/images/2024/07/02/66835c93be051.png",
    "Ratatatata" : "https://tupian.li/images/2024/07/12/66909a27c6ea7.gif",
    "RoyalWhit3zZ" : "https://tupian.li/images/2024/07/26/66a3b9927292f.png",
    "sjadj": "https://pic.imgdb.cn/item/66a98330d9c307b7e9ac9bd9.gif",
    "sky0426": "https://i0.hdslb.com/bfs/new_dyn/3320e71fac433087c5bfd9ec2c7802c8329558611.gif@1036w_!web-dynamic.webp",
    "showpao": "https://tupian.li/images/2024/07/29/66a7696499de7.jpg",
    "silaker": "https://pic.imgdb.cn/item/66a77163d9c307b7e915d810.gif",
    "shikiki": "https://tupian.li/images/2025/04/30/681229466085f.gif",
    "shacono1": "https://tupian.li/images/2024/07/06/66889cb69cbca.gif",
    "sharksha": "https://img.soogif.com/MNMoWMYZNVfGSjWKaoUqTGLILyyfHYOF.gif",
    "sunnieQvQ": "https://tupian.li/images/2024/07/28/66a642d64aba0.gif",
    "Sweety": "https://tupian.li/images/2024/04/25/662a43441f321.gif",
    "Seirann": "https://tupian.li/images/2024/11/03/672730870b652.png",
    "Sivelin": "https://tupian.li/images/2025/05/09/681d1a2de5ed3.png",
    "StarryMilk": "https://zengzh-test.oss-cn-shenzhen.aliyuncs.com/StarryMilk.png",
    "StarTracker": "https://tupian.li/images/2024/09/08/66dd21028d6bb.jpg",
    "tobytorn": "https://tupian.li/images/2024/07/01/66823b4ac64a8.png",
    "TouchFish": "https://tupian.li/images/2024/04/25/662a49b3d7f1c.jpg",
    "TruthLight": "https://img.picui.cn/free/2024/07/04/6685e2257a290.png",
    "wudi": "https://tupian.li/images/2024/07/04/6685fbcd7027c.jpg",
    "weiming": "https://tupian.li/images/2025/02/08/67a71211e411f.gif",
    "watchdog": "https://tupian.li/images/2025/02/17/67b300462703b.jpg",
    "wennuan1": "https://pic.imgdb.cn/item/66a3be8dd9c307b7e9cb6773.png",
    "whynotylk": "https://pic.imgdb.cn/item/66dd1e1cd9c307b7e96a2e88.gif",
    "wslsk20240312": "https://tupian.li/images/2024/04/12/661944c0c8ca2.jpg",
    "WillShY7": "https://tupian.li/images/2025/05/09/681ce10e65776.png",
    "Wooooooo": "https://tupian.li/images/2024/11/26/6745a635caa6f.gif",
    "Wednesday": "https://tupian.li/images/2024/07/10/668e33a05e942.png",
    "WittAndStein": "https://doh-nuts.github.io/Enhancelator/holy_enhancer.svg",
    "xuantu": "https://tupian.li/images/2024/04/12/66193f2282013.png",
    "xiupao": "https://tupian.li/images/2024/07/29/66a7696499de7.jpg",
    "xiaoyang": "https://tupian.li/images/2024/08/06/66b18d7fd9f8c.gif",
    "xiaokeai": "https://tupian.li/images/2024/11/15/6736a0be50126.jpg",
    "XiaoR": "https://img.dexbug.com/i/2025/04/13/i790ek.gif",
    "yx": "https://tupian.li/images/2025/05/05/681838831c1ae.gif",
    "y0fx": "https://tupian.li/images/2024/11/05/6729b6e6e6a5c.jpg",
    "yumizz": "https://tupian.li/images/2024/10/08/6704991aa0eeb.jpg",
    "yahaha00": "https://img1.baidu.com/it/u=1673278852,1559868563&fm=253&fmt=auto&app=138&f=JPEG?w=304&h=304",
    "yeshuling": "https://tupian.li/images/2024/04/12/66194b4eb193c.png",
    "YouCan": "https://s21.ax1x.com/2025/03/16/pEdpybF.png",
    "Yellowww": "https://tupian.li/images/2024/09/29/66f82e0c5c7dd.png",
    "zlm": "https://i.postimg.cc/T1SqKjWH/35e4976d54770934.gif",
    "zj243": "https://profileimages-cdn.torn.com/a59ae1ad-53a0-f352-2414908.gif?v=1940629196397",
    "z1a4q7": "https://tupian.li/images/2024/09/04/66d820c8cf797.gif",
    "zzzzzy": "https://tupian.li/images/2024/09/01/66d3e645645ad.png",
    "zhangzhang": "https://pic.imge.cc/2024/08/02/66ac457891558.png",
    "Z00M": "https://tupian.li/images/2024/07/28/66a666765e6d4.gif",
    "Zibba": "https://tupian.li/images/2024/07/04/6685f42ccfbeb.png",
    "ZG9920": "https://tupian.li/images/2024/07/06/6688f1e86435c.jpg",
    "Zeeman": "https://tupian.li/images/2024/06/24/6678e7dc8f6af.gif",
    "玩家ID": "图片链接",
    // 添加更多的替换目标和对应的图片链接
};

(function () {
    "use strict";

    function replaceIconsIn(node) {
        const iconElements = node.querySelectorAll(`div.FullAvatar_fullAvatar__3RB2h`);
        for (const elem of iconElements) {
            if (elem.closest("div.CowbellStorePanel_avatarsTab__1nnOY")) {
                continue; // 商店页面
            }

            const playerId = findPlayerIdByAvatarElem(elem);
            if (!playerId) {
                console.error("ICONS: replaceIconsIn can't find playerId");
                console.log(elem);
                continue; // 找不到 playerId
            }

            if (!replacementTargets.hasOwnProperty(playerId)) {
                continue; // 没有配置图片地址
            }

            const newImgElement = document.createElement("img");
            newImgElement.src = replacementTargets[playerId];
            newImgElement.style.width = "100%";
            newImgElement.style.height = "auto";
            elem.innerHTML = "";
            elem.appendChild(newImgElement);
        }
    }

    function findPlayerIdByAvatarElem(avatarElem) {
        // Profile 窗口页
        const profilePageDiv = avatarElem.closest("div.SharableProfile_modal__2OmCQ");
        if (profilePageDiv) {
            return profilePageDiv.querySelector(".CharacterName_name__1amXp")?.textContent.trim();
        }

        // 网页右上角
        const headerDiv = avatarElem.closest("div.Header_header__1DxsV");
        if (headerDiv) {
            return headerDiv.querySelector(".CharacterName_name__1amXp")?.textContent.trim();
        }

        // 战斗页面
        const combatDiv = avatarElem.closest("div.CombatUnit_combatUnit__1m3XT");
        if (combatDiv) {
            return combatDiv.querySelector(".CombatUnit_name__1SlO1")?.textContent.trim();
        }

        // 组队页面
        const partyDiv = avatarElem.closest("div.Party_partySlot__1xuiq");
        if (partyDiv) {
            return partyDiv.querySelector(".CharacterName_name__1amXp")?.textContent.trim();
        }

        return null;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (
                    node.tagName === "DIV" &&
                    !node.classList.contains("ProgressBar_innerBar__3Z_sf") &&
                    !node.classList.contains("CountdownOverlay_countdownOverlay__2QRmL") &&
                    !node.classList.contains("ChatMessage_chatMessage__2wev4") &&
                    !node.classList.contains("Header_loot__18Cbe") &&
                    !node.classList.contains("script_itemLevel") &&
                    !node.classList.contains("script_key") &&
                    !node.classList.contains("dps-info") &&
                    !node.classList.contains("MuiTooltip-popper")
                ) {
                    replaceIconsIn(node);
                }
            });
        });
    });
    observer.observe(document.body, { attributes: false, childList: true, subtree: true });

    // setInterval(() => replaceIconsIn(document.body), 100);
})();

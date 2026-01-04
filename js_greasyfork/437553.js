// ==UserScript==
// @name         91譜ios免費移調
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  實現移調、級數功能，且去除惱人的廣告
// @author       YC白白
// @match        https://www.91pu.com.tw/song/*
// @match        https://www.91pu.com.tw/index.html
// @match        https://www.91pu.com.tw/m/index.shtml/*
// @match        https://www.91pu.com.tw/m/*
// @icon         https://www.google.com/s2/favicons?domain=91pu.com.tw
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/437553/91%E8%AD%9Cios%E5%85%8D%E8%B2%BB%E7%A7%BB%E8%AA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/437553/91%E8%AD%9Cios%E5%85%8D%E8%B2%BB%E7%A7%BB%E8%AA%BF.meta.js
// ==/UserScript==

// 91譜ios免費移調
// 版本：v8.1
// 捷徑作者：YC白白

//v3.0 增大移調按鈕
//v4.0 再把按鈕變超級大（避免有人找不到），放置在譜上方
//v5.0 新增同音異名調的變換功能，點擊灰色按鈕即可，例如 F# -> Gb, Db -> C#
//v6.0 把按鈕字體加大，精簡一點語法
//v7.0 擋電腦版首頁廣告
//v8.0 支援 網頁版(首頁/song頁)、手機版(首頁/song頁)都能運行且「去廣告」
//v8.1 關閉預設顯示吉他和弦，想要預設顯示吉他和弦的話可以用 v8.0

// step.1 先處理廣告
let url = window.location.href
if (url.indexOf('https://www.91pu.com.tw/m/tone.shtml?id=') != -1) {
    // alert("手機版網頁的 song頁面！")
    //循環法關廣告
    setInterval(function() {
        // 關掉等三秒的開頭廣告
        // closeAdvertise();
        if (document.getElementById("viptoneWindow")) {
            document.getElementById("viptoneWindow").style.visibility = "hidden";
        }

        // 原GM_addStyle的語法
        if (document.querySelector("body > div.update_vip_bar")) {
            document.querySelector("body > div.update_vip_bar").remove()
        }
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1611805301517-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1611805301517-0").remove()
        }

        // 關閉預設顯示吉他和弦
        if (document.querySelector("#tone_chord")) {
            document.querySelector("#tone_chord").remove()
        }

        // 最下面浮起來的廣告
        if (document.querySelector(".adsbygoogle")) {
            document.querySelector(".adsbygoogle").remove()
        }
        if (document.querySelector(".adsbygoogle-noablate")) {
            document.querySelector(".adsbygoogle-noablate").remove()
        }

        // 特別煩，只出現在 width <= 600 的廣告
        if (document.querySelector('#clickforceads_ad')) {
            document.querySelector('#clickforceads_ad').remove()
        }
        if (document.getElementsByClassName("slideshow-container")) {
            let guideView = document.getElementsByClassName("slideshow-container");
            guideView[0].style.visibility = "hidden"
        }
        if (document.getElementById("live-show-mobile")) {
            document.getElementById("live-show-mobile").style.visibility = "hidden"
        }
        if (document.querySelector(".clickforceads")) {
            document.querySelector(".clickforceads").remove()
        }
        if (document.getElementById("topad")) {
            document.getElementById("topad").remove()
        }
        if (document.getElementById("bottomad")) {
            document.getElementById("bottomad").remove()
        }
        if (window.dataLayer) {
            window.dataLayer = []
        }
        if (document.querySelector(".gliaplayer-wrapper")) {
            document.querySelector(".gliaplayer-wrapper").remove()
        }
        if (document.querySelector("#outDiv")) {
            document.querySelector("#outDiv").remove()
        }
        if (document.querySelector("#div-gpt-ad-1630064209733-0")) {
            document.querySelector("#div-gpt-ad-1630064209733-0").remove()
        }

        // 寬度小於600的手機版網頁最下面的廣告，超煩，電腦不會出現
        if (document.querySelector("#CFOutDiv")) {
            document.querySelector("#CFOutDiv").remove()
        }
        if (document.querySelector(".ad-bottom")) {
            document.querySelector(".ad-bottom").remove()
        }
    }, 1000);
}
else if (url.indexOf('https://www.91pu.com.tw/m/') != -1) {
    // alert("手機版網頁的 首頁！")
    // 循環法關廣告
    setInterval(function() {
        // height: 100px才不會浮起來
        if (document.querySelector(".promote_app_mobile")) {
            document.querySelector(".promote_app_mobile").remove()
        }
        if (document.querySelector("body > footer")) {
            document.querySelector("body > footer").style.cssText = 'height: 100px;'
        }

        if (document.querySelector("#adGeek-slot-div-gpt-ad-1567068008300-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1567068008300-0").remove()
        }
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1611805301517-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1611805301517-0").remove()
        }

        // 最上面才不會留白
        if (document.querySelector("body")) {
            document.querySelector("body").style.padding = "0px 0px 0px"
        }
        if (document.querySelector("body > div.google-auto-placed")) {
            document.querySelector("body > div.google-auto-placed").remove()
        }

        // 1225
        if (document.querySelector(".adsbygoogle.adsbygoogle-noablate")) {
            document.querySelector(".adsbygoogle.adsbygoogle-noablate").remove()
        }
        if (document.querySelector("#google_pedestal_container")) {
            document.querySelector("#google_pedestal_container").remove()
        }
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1611805301517-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1611805301517-0").remove()
        }
    }, 1000);
}
else if (url.indexOf('https://www.91pu.com.tw/index.html') != -1) {
    // alert("電腦版網頁的 首頁！")
    // 循環法關廣告
    setInterval(function() {
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1631793585502-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1631793585502-0").remove()
        }
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1567068182245-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1567068182245-0").remove()
        }
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1611805301517-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1611805301517-0").remove()
        }
    }, 1000);
}
else if (url.indexOf('https://www.91pu.com.tw/song') != -1) {
    // alert("電腦版網頁的 song頁面！")
    // 循環法關廣告
    setInterval(function() {
        // 關掉等三秒的開頭廣告
        // closeAdvertise();
        if (document.getElementById("viptoneWindow")) {
            document.getElementById("viptoneWindow").style.visibility = "hidden";
        }
        // #
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1603436830996-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1603436830996-0").remove()
        }
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1624530373449-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1624530373449-0").remove()
        }
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1631793585502-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1631793585502-0").remove()
        }
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1567069820127-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1567069820127-0").remove()
        }
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1567070020978-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1567070020978-0").remove()
        }
        if (document.querySelector("#adGeek-slot-div-gpt-ad-1567070135884-0")) {
            document.querySelector("#adGeek-slot-div-gpt-ad-1567070135884-0").remove()
        }
        // .
        if (document.querySelector(".update_vip_bar")) {
            document.querySelector(".update_vip_bar").remove()
        }
        if (document.querySelector(".a-post-show")) {
            document.querySelector(".a-post-show").remove()
        }
        if (document.querySelector(".AV60d5e8e57ded8c5ae273efb5")) {
            document.querySelector(".AV60d5e8e57ded8c5ae273efb5").remove()
        }
        if (document.querySelector(".gliaplayer-wrapper")) {
            document.querySelector(".gliaplayer-wrapper").remove()
        }
        if (document.querySelector(".parent_accucrazy_91pu_curation_desktop_bottom_gam")) {
            document.querySelector(".parent_accucrazy_91pu_curation_desktop_bottom_gam").remove()
        }
        // 關閉預設顯示吉他和弦
        if (document.querySelector("#tone_chord")) {
            document.querySelector("#tone_chord").remove()
        }
    }, 1000);
}

// step.2 按鈕功能設置
var is_mobile;
//判斷網頁是 手機版 or 網頁版
if (url.includes("/m/") && url.includes("91pu.com.tw")) {
    is_mobile = true;
}
else {
    is_mobile = false;
}

// v8新增 判斷是song頁面 才加入按鈕 0.8沒有這段
if (url.indexOf('https://www.91pu.com.tw/m/tone.shtml?id=') != -1 || url.indexOf('https://www.91pu.com.tw/song') != -1) {
    // 這時候才新增按鈕，不然不加
    var oldkey = "";
    var nowkey = "";
    var tone_z_str = "";
    var tone_z_num_full = ""; //全型
    var tone_z_num_half = ""; //半形
    var is_read = false;

    let btn1 = document.createElement("button");
    btn1.innerHTML = "升key";
    btn1.onclick = function(){
        write();
        keyadd(1);
        changeKey();
        btn4.innerHTML = nowkey;
    };

    let btn2 = document.createElement("button");
    btn2.innerHTML = "降key";
    btn2.onclick = function(){
        write();
        keyadd(-1);
        changeKey();
        btn4.innerHTML = nowkey;
    };

    let btn3 = document.createElement("button");
    btn3.innerHTML = "級數";
    btn3.onclick = function(){
        write();
        document.getElementById("tone_z").innerHTML = tone_z_num_half;
        btn4.innerHTML = nowkey;
    };

    let btn4 = document.createElement("button");
    btn4.innerHTML = "原譜";
    btn4.style.background = "#757575";
    btn4.style.color = "#fff";
    btn4.onclick = function(){
        write();

        //v0.5更改
        if (btn4.innerHTML == "原譜") {
            btn4.innerHTML = nowkey;
        }
        else {
            if (nowkey.slice(-1) == "m") {
                let minor_same_key = {'Cm':'B#m', 'B#m':'Cm', 'Dbm':'C#m', 'C#m':'Dbm', 'Dm':'Dm', 'Ebm':'D#m', 'D#m':'Ebm', 'Em':'Em', 'Fm':'E#m', 'E#m':'Fm', 'F#m':'F#m', 'Gm':'Gm', 'Abm':'G#m', 'G#m':'Abm', 'Am':'Am', 'Bbm':'A#m', 'A#m':'Bbm', 'Bm':'Bm'};
                nowkey = minor_same_key[nowkey];
            }
            else {
                let major_same_key = {'C':'B#', 'B#':'C', 'Db':'C#', 'C#':'Db', 'D':'D', 'Eb':'D#', 'D#':'Eb', 'E':'Fb', 'Fb':'E', 'F':'E#', 'E#':'F', 'F#':'Gb', 'Gb':'F#', 'G':'G', 'Ab':'G#', 'G#':'Ab', 'A':'A', 'Bb':'A#', 'A#':'Bb', 'B':'Cb', 'Cb':'B'};
                nowkey = major_same_key[nowkey];
            }
            changeKey();
            btn4.innerHTML = nowkey;
        }
    };

    //統一設定字體大小
    btn1.style.fontSize = "36px";
    btn2.style.fontSize = "36px";
    btn3.style.fontSize = "36px";
    btn4.style.fontSize = "36px";

    //統一設定按鈕，弄成超級大，避免有人找不到
    btn1.style.height = "192px";
    btn1.style.width = "192px";
    btn2.style.height = "192px";
    btn2.style.width = "192px";
    btn3.style.height = "192px";
    btn3.style.width = "192px";
    btn4.style.height = "192px";
    btn4.style.width = "192px";

    let pos;
    if (is_mobile) {
        //手機版 比新增在最上面好
        pos = document.querySelector('.slideshow-container');
    }
    else {
        //電腦版 要新增在指定元素前面
        pos = document.querySelector('.showToneInfo');
    }

    //統一新增按鈕在某元素之前
    pos.parentElement.insertBefore(btn1, pos);
    pos.parentElement.insertBefore(btn2, pos);
    pos.parentElement.insertBefore(btn3, pos);
    pos.parentElement.insertBefore(btn4, pos);

    function keyadd(addnum) {
        //v0.5更改，用來把nowkey修正成常見的同音異名調
        let major_dict = {'B#':'C', 'C':'C', 'C#':'Db', 'Db':'Db', 'D':'D', 'D#':'Eb', 'Eb':'Eb', 'E':'E', 'Fb':'E', 'E#':'F', 'F':'F', 'F#':'F#', 'Gb':'F#', 'G':'G', 'G#':'Ab', 'Ab':'Ab', 'A':'A', 'A#':'Bb', 'Bb':'Bb', 'B':'B', 'Cb':'B'};
        let minor_dict = {'G##m':'Am' ,'Am':'Am', 'A#m':'Bbm', 'Bbm':'Bbm', 'Bm':'Bm', 'B#m':'Cm', 'Cm':'Cm', 'C#m':'C#m', 'Dbm':'C#m', 'C##m':'Dm', 'Dm':'Dm', 'D#m':'D#m', 'Ebm':'D#m', 'Em':'Em', 'E#m':'Fm', 'Fm':'Fm', 'F#m':'F#m', 'F##m':'Gm', 'Gm':'Gm', 'G#m':'G#m', 'Abm':'G#m'};

        addnum = Number(addnum);
        let chromatic_scale_major = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
        let chromatic_scale_minor = ['Am', 'Bbm', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m'];

        //v0.5有直接調整
        if (nowkey.slice(-1) != "m") {
            //v0.5更改
            nowkey = major_dict[nowkey];

            let now_index = chromatic_scale_major.indexOf(nowkey);
            now_index = (now_index + addnum + 12) % 12;
            nowkey = chromatic_scale_major[now_index];
        }
        else if (nowkey.slice(-1) == "m") {
            //v0.5更改
            nowkey = minor_dict[nowkey];

            let now_index = chromatic_scale_minor.indexOf(nowkey);
            now_index = (now_index + addnum + 12) % 12;
            nowkey = chromatic_scale_minor[now_index];
        }
    }

    function write() {
        if (is_read == false) {
            //手機版 網頁版 找原始調性的方法不同
            let capo;
            if (is_mobile) {
                capo = document.querySelector("body > header > div.set > div.plays > div > span.select");
                capo = capo.textContent;
                capo = capo.slice(-2);
                capo = capo.replace(/ /g, "");
            }
            else {
                capo = document.querySelector("body > section.mainBody > div.showre > div.putone > div.setbox > div.toneset > div.k > div.plays > div > span.select");
                capo = capo.textContent;
                capo = capo.replace(/Capo: [0-9]+ \(/, "");
                capo = capo.replace(")", "");
            }
            oldkey = capo; // 紀錄原調
            nowkey = oldkey;
            tone_z_str = document.getElementById("tone_z").innerHTML; //紀錄原和弦
            numFunction(); //做出級數，存於tone_z_num_full及tone_z_num_half
            is_read = true;
        }
    }

    //alert(sim_full("F#", "Bb"));
    //v0.5的想法，可以寫重升重降才完整，所以改了188-189而已
    function sim_full(down, up) {
        if (down.slice(-1) == "m") {
            //v0.5更改
            let chromatic_scale_major = ['B#', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'Fb', 'E#', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Cb'];
            let chromatic_scale_minor = ['G##m', 'Am', 'A#m', 'Bbm', 'Bm', 'B#m', 'Cm', 'C#m', 'Dbm', 'C##m', 'Dm', 'D#m', 'Ebm', 'Em', 'E#m', 'Fm', 'F#m', 'F##m', 'Gm', 'G#m', 'Abm'];
            down = chromatic_scale_major[chromatic_scale_minor.indexOf(down)];
        }

        let major_scale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        let chromatic_dict = {'B#' : 0, 'C' : 0, 'Dbb' : 0, 'B##' : 1, 'C#' : 1, 'Db' : 1, 'C##' : 2, 'D' : 2, 'Ebb' : 2, 'D#' : 3, 'Eb' : 3, 'Fbb' : 3, 'D##' : 4, 'E' : 4, 'Fb' : 4, 'E#' : 5, 'F' : 5, 'Gbb' : 5, 'E##' : 6, 'F#' : 6, 'Gb' : 6, 'F##' : 7, 'G' : 7, 'Abb' : 7, 'G#' : 8, 'Ab' : 8, 'G##' : 9, 'A' : 9, 'Bbb' : 9, 'A#' : 10, 'Bb' : 10, 'Cbb' : 10, 'A##' : 11, 'B' : 11, 'Cb' : 11}
        // 折解英文+升降記號
        let d = 0;
        if (down.length == 3) {
            if (down.slice(1) == "bb") {
                d += 2;
            }
            else if (down.slice(1) == "##") {
                d -= 2;
            }
            down = down.charAt(0);
        }
        else if (down.length == 2) {
            if (down.slice(1) == "b") {
                d += 1;
            }
            else if (down.slice(1) == "#") {
                d -= 1;
            }
            down = down.charAt(0);
        }
        // #
        if (up.length == 3) {
            if (up.slice(1) == "bb") {
                d -= 2;
            }
            else if (up.slice(1) == "##") {
                d += 2;
            }
            up = up.charAt(0);
        }
        else if (up.length == 2) {
            if (up.slice(1) == "b") {
                d -= 1;
            }
            else if (up.slice(1) == "#") {
                d += 1;
            }
            up = up.charAt(0);
        }
        //
        let ans = (major_scale.indexOf(up) - major_scale.indexOf(down) + 7) % 7 + 1;
        let dif = (chromatic_dict[up] - chromatic_dict[down] + 12) % 12 + d;
        let basic;
        let result;
        if (ans == 1) {
            basic = 0;
            result = "１";
        }
        else if (ans == 2) {
            basic = 2;
            result = "２";
        }
        else if (ans == 3) {
            basic = 4;
            result = "３";
        }
        else if (ans == 4) {
            basic = 5;
            result = "４";
        }
        else if (ans == 5) {
            basic = 7;
            result = "５";
        }
        else if (ans == 6) {
            basic = 9;
            result = "６";
        }
        else if (ans == 7) {
            basic = 11;
            result = "７";
        }

        if (dif - basic > 0) {
            result = result + "<sup>#<\/sup>".repeat(dif - basic);
        }
        else if (dif - basic < 0) {
            result = result + "<sup>b<\/sup>".repeat(basic - dif);
        }
        return result;
    }

    function numFunction() {
        let str1 = tone_z_str;
        let reg = /<span class="tf">.*?\<\/span>/g;
        str1 = str1.replace(reg, num01);
        tone_z_num_full = str1;
        fullToHalf();
    }

    function fullToHalf() {
        let str1 = tone_z_num_full;
        let reg = /<span class="tf">.*?\<\/span>/g;
        str1 = str1.replace(reg, FTH01);
        tone_z_num_half = str1;
    }

    function FTH01(match, p1, p2, p3, offset, string) {
        let text = match;
        text = text.replace("１", "1");
        text = text.replace("２", "2");
        text = text.replace("３", "3");
        text = text.replace("４", "4");
        text = text.replace("５", "5");
        text = text.replace("６", "6");
        text = text.replace("７", "7");
        return text;
    }

    function num01(match, p1, p2, p3, offset, string) {
        let text = match
        //v0.5更改，寫重升重降才完整

        //重升重降01
        text = text.replace(/C<sup>b<\/sup><sup>b<\/sup>/g, sim_full(oldkey, "Cbb"));
        text = text.replace(/C<sup>#<\/sup><sup>#<\/sup>/g, sim_full(oldkey, "C##"));

        text = text.replace(/D<sup>b<\/sup><sup>b<\/sup>/g, sim_full(oldkey, "Dbb"));
        text = text.replace(/D<sup>#<\/sup><sup>#<\/sup>/g, sim_full(oldkey, "D##"));

        text = text.replace(/E<sup>b<\/sup><sup>b<\/sup>/g, sim_full(oldkey, "Ebb"));
        text = text.replace(/E<sup>#<\/sup><sup>#<\/sup>/g, sim_full(oldkey, "E##"));

        text = text.replace(/F<sup>b<\/sup><sup>b<\/sup>/g, sim_full(oldkey, "Fbb"));
        text = text.replace(/F<sup>#<\/sup><sup>#<\/sup>/g, sim_full(oldkey, "F##"));

        text = text.replace(/G<sup>b<\/sup><sup>b<\/sup>/g, sim_full(oldkey, "Gbb"));
        text = text.replace(/G<sup>#<\/sup><sup>#<\/sup>/g, sim_full(oldkey, "G##"));

        text = text.replace(/A<sup>b<\/sup><sup>b<\/sup>/g, sim_full(oldkey, "Abb"));
        text = text.replace(/A<sup>#<\/sup><sup>#<\/sup>/g, sim_full(oldkey, "A##"));

        text = text.replace(/B<sup>b<\/sup><sup>b<\/sup>/g, sim_full(oldkey, "Bbb"));
        text = text.replace(/B<sup>#<\/sup><sup>#<\/sup>/g, sim_full(oldkey, "B##"));

        //重升重降02
        text = text.replace(/C<sup>bb<\/sup>/g, sim_full(oldkey, "Cbb"));
        text = text.replace(/C<sup>##<\/sup>/g, sim_full(oldkey, "C##"));

        text = text.replace(/D<sup>bb<\/sup>/g, sim_full(oldkey, "Dbb"));
        text = text.replace(/D<sup>##<\/sup>/g, sim_full(oldkey, "D##"));

        text = text.replace(/E<sup>bb<\/sup>/g, sim_full(oldkey, "Ebb"));
        text = text.replace(/E<sup>##<\/sup>/g, sim_full(oldkey, "E##"));

        text = text.replace(/F<sup>bb<\/sup>/g, sim_full(oldkey, "Fbb"));
        text = text.replace(/F<sup>##<\/sup>/g, sim_full(oldkey, "F##"));

        text = text.replace(/G<sup>bb<\/sup>/g, sim_full(oldkey, "Gbb"));
        text = text.replace(/G<sup>##<\/sup>/g, sim_full(oldkey, "G##"));

        text = text.replace(/A<sup>bb<\/sup>/g, sim_full(oldkey, "Abb"));
        text = text.replace(/A<sup>##<\/sup>/g, sim_full(oldkey, "A##"));

        text = text.replace(/B<sup>bb<\/sup>/g, sim_full(oldkey, "Bbb"));
        text = text.replace(/B<sup>##<\/sup>/g, sim_full(oldkey, "B##"));

        //一升一降
        text = text.replace(/C<sup>b<\/sup>/g, sim_full(oldkey, "Cb"));
        text = text.replace(/C<sup>#<\/sup>/g, sim_full(oldkey, "C#"));

        text = text.replace(/D<sup>b<\/sup>/g, sim_full(oldkey, "Db"));
        text = text.replace(/D<sup>#<\/sup>/g, sim_full(oldkey, "D#"));

        text = text.replace(/E<sup>b<\/sup>/g, sim_full(oldkey, "Eb"));
        text = text.replace(/E<sup>#<\/sup>/g, sim_full(oldkey, "E#"));

        text = text.replace(/F<sup>b<\/sup>/g, sim_full(oldkey, "Fb"));
        text = text.replace(/F<sup>#<\/sup>/g, sim_full(oldkey, "F#"));

        text = text.replace(/G<sup>b<\/sup>/g, sim_full(oldkey, "Gb"));
        text = text.replace(/G<sup>#<\/sup>/g, sim_full(oldkey, "G#"));

        text = text.replace(/A<sup>b<\/sup>/g, sim_full(oldkey, "Ab"));
        text = text.replace(/A<sup>#<\/sup>/g, sim_full(oldkey, "A#"));

        text = text.replace(/B<sup>b<\/sup>/g, sim_full(oldkey, "Bb"));
        text = text.replace(/B<sup>#<\/sup>/g, sim_full(oldkey, "B#"));

        //無升降
        text = text.replace(/C/g, sim_full(oldkey, "C"));
        text = text.replace(/D/g, sim_full(oldkey, "D"));
        text = text.replace(/E/g, sim_full(oldkey, "E"));
        text = text.replace(/F/g, sim_full(oldkey, "F"));
        text = text.replace(/G/g, sim_full(oldkey, "G"));
        text = text.replace(/A/g, sim_full(oldkey, "A"));
        text = text.replace(/B/g, sim_full(oldkey, "B"));
        return text;
    }

    function changeKey() {
        let str1 = tone_z_num_full;
        let reg = /<span class="tf">.*?\<\/span>/g;
        str1 = str1.replace(reg, numToChord01);
        document.getElementById("tone_z").innerHTML = str1;
    }

    function NTC(key1, num1) {
        if (key1.slice(-1) == "m") {
            //v0.5更改
            let chromatic_scale_major = ['B#', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'Fb', 'E#', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Cb'];
            let chromatic_scale_minor = ['G##m', 'Am', 'A#m', 'Bbm', 'Bm', 'B#m', 'Cm', 'C#m', 'Dbm', 'C##m', 'Dm', 'D#m', 'Ebm', 'Em', 'E#m', 'Fm', 'F#m', 'F##m', 'Gm', 'G#m', 'Abm'];
            key1 = chromatic_scale_major[chromatic_scale_minor.indexOf(key1)];
        }

        //v0.5更改
        let alist = [['B#', 'C##', 'D##', 'E#', 'F##', 'G##', 'A##', 'B#'], ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'], ['C#', 'D#', 'E#', 'F#', 'G#', 'A#', 'B#', 'C#'], ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C', 'Db'], ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'], ['D#', 'E#', 'F##', 'G#', 'A#', 'B#', 'C##', 'D#'], ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D', 'Eb'], ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#', 'E'], ['Fb', 'Gb', 'Ab', 'Bbb', 'Cb', 'Db', 'Eb', 'Fb'], ['F', 'G', 'A', 'Bb', 'C', 'D', 'E', 'F'], ['E#', 'F##', 'G##', 'A#', 'B#', 'C##', 'D##', 'E#'], ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#', 'F#'], ['Gb', 'Ab', 'Bb', 'Cb', 'Db', 'Eb', 'F', 'Gb'], ['G', 'A', 'B', 'C', 'D', 'E', 'F#', 'G'], ['G#', 'A#', 'B#', 'C#', 'D#', 'E#', 'F##', 'G#'], ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G', 'Ab'], ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#', 'A'], ['A#', 'B#', 'C##', 'D#', 'E#', 'F##', 'G##', 'A#'], ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb'], ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B'], ['Cb', 'Db', 'Eb', 'Fb', 'Gb', 'Ab', 'Bb', 'Cb']];
        let chromatic_scale = ['B#', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'Fb', 'F', 'E#', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Cb'];
        let major_scale = alist[chromatic_scale.indexOf(key1)];

        // 折解num1的級數數字+升降記號num1_d
        //v0.5更改 但退回v0.4時不用改回去，v0.5只是寫得更完整
        let num1_d = 0;
        if (num1.length == 3) {
            if (num1.slice(1) == "bb") {
                num1_d -= 2;
            }
            else if (num1.slice(1) == "##") {
                num1_d += 2;
            }
            num1 = num1.charAt(0);
        }
        else if (num1.length == 2) {
            if (num1.slice(1) == "b") {
                num1_d -= 1;
            }
            else if (num1.slice(1) == "#") {
                num1_d += 1;
            }
            num1 = num1.charAt(0);
        }

        // 折解chord的和弦+升降記號chord_d
        //v0.5更改 但退回v0.4時不用改回去，v0.5只是寫得更完整
        let chord = major_scale[num1 - 1];
        let chord_d = 0;
        if (chord.length == 3) {
            if (chord.slice(1) == "bb") {
                chord_d -= 2;
            }
            else if (chord.slice(1) == "##") {
                chord_d += 2;
            }
            chord = chord.charAt(0);
        }
        else if (chord.length == 2) {
            if (chord.slice(1) == "b") {
                chord_d -= 1;
            }
            else if (chord.slice(1) == "#") {
                chord_d += 1;
            }
            chord = chord.charAt(0);
        }

        let sum = chord_d + num1_d;
        if (sum > 0) {
            chord = chord + "<sup>#<\/sup>".repeat(sum);
        }
        else if (sum < 0) {
            chord = chord + "<sup>b<\/sup>".repeat(-sum);
        }
        return chord;
    }

    function numToChord01(match, p1, p2, p3, offset, string) {
        let text = match;
        //v0.5有個想法，可以新增級數的重升重降，（會有這種需求是最初的和弦就有用到重升重降級），寫的話要先確定91原始是寫<sup>bb<\/sup>還是<sup>b<\/sup><sup>b<\/sup>，但直接雞婆都寫就一定會對
        //重升重降01
        text = text.replace(/１<sup>b<\/sup><sup>b<\/sup>/g, NTC(nowkey, "1bb"));
        text = text.replace(/１<sup>#<\/sup><sup>#<\/sup>/g, NTC(nowkey, "1##"));

        text = text.replace(/２<sup>b<\/sup><sup>b<\/sup>/g, NTC(nowkey, "2bb"));
        text = text.replace(/２<sup>#<\/sup><sup>#<\/sup>/g, NTC(nowkey, "2##"));

        text = text.replace(/３<sup>b<\/sup><sup>b<\/sup>/g, NTC(nowkey, "3bb"));
        text = text.replace(/３<sup>#<\/sup><sup>#<\/sup>/g, NTC(nowkey, "3##"));

        text = text.replace(/４<sup>b<\/sup><sup>b<\/sup>/g, NTC(nowkey, "4bb"));
        text = text.replace(/４<sup>#<\/sup><sup>#<\/sup>/g, NTC(nowkey, "4##"));

        text = text.replace(/５<sup>b<\/sup><sup>b<\/sup>/g, NTC(nowkey, "5bb"));
        text = text.replace(/５<sup>#<\/sup><sup>#<\/sup>/g, NTC(nowkey, "5##"));

        text = text.replace(/６<sup>b<\/sup><sup>b<\/sup>/g, NTC(nowkey, "6bb"));
        text = text.replace(/６<sup>#<\/sup><sup>#<\/sup>/g, NTC(nowkey, "6##"));

        text = text.replace(/７<sup>b<\/sup><sup>b<\/sup>/g, NTC(nowkey, "7bb"));
        text = text.replace(/７<sup>#<\/sup><sup>#<\/sup>/g, NTC(nowkey, "7##"));

        //重升重降02
        text = text.replace(/１<sup>bb<\/sup>/g, NTC(nowkey, "1bb"));
        text = text.replace(/１<sup>##<\/sup>/g, NTC(nowkey, "1##"));

        text = text.replace(/２<sup>bb<\/sup>/g, NTC(nowkey, "2bb"));
        text = text.replace(/２<sup>##<\/sup>/g, NTC(nowkey, "2##"));

        text = text.replace(/３<sup>bb<\/sup>/g, NTC(nowkey, "3bb"));
        text = text.replace(/３<sup>##<\/sup>/g, NTC(nowkey, "3##"));

        text = text.replace(/４<sup>bb<\/sup>/g, NTC(nowkey, "4bb"));
        text = text.replace(/４<sup>##<\/sup>/g, NTC(nowkey, "4##"));

        text = text.replace(/５<sup>bb<\/sup>/g, NTC(nowkey, "5bb"));
        text = text.replace(/５<sup>##<\/sup>/g, NTC(nowkey, "5##"));

        text = text.replace(/６<sup>bb<\/sup>/g, NTC(nowkey, "6bb"));
        text = text.replace(/６<sup>##<\/sup>/g, NTC(nowkey, "6##"));

        text = text.replace(/７<sup>bb<\/sup>/g, NTC(nowkey, "7bb"));
        text = text.replace(/７<sup>##<\/sup>/g, NTC(nowkey, "7##"));

        //一升一降
        text = text.replace(/１<sup>b<\/sup>/g, NTC(nowkey, "1b"));
        text = text.replace(/１<sup>#<\/sup>/g, NTC(nowkey, "1#"));

        text = text.replace(/２<sup>b<\/sup>/g, NTC(nowkey, "2b"));
        text = text.replace(/２<sup>#<\/sup>/g, NTC(nowkey, "2#"));

        text = text.replace(/３<sup>b<\/sup>/g, NTC(nowkey, "3b"));
        text = text.replace(/３<sup>#<\/sup>/g, NTC(nowkey, "3#"));

        text = text.replace(/４<sup>b<\/sup>/g, NTC(nowkey, "4b"));
        text = text.replace(/４<sup>#<\/sup>/g, NTC(nowkey, "4#"));

        text = text.replace(/５<sup>b<\/sup>/g, NTC(nowkey, "5b"));
        text = text.replace(/５<sup>#<\/sup>/g, NTC(nowkey, "5#"));

        text = text.replace(/６<sup>b<\/sup>/g, NTC(nowkey, "6b"));
        text = text.replace(/６<sup>#<\/sup>/g, NTC(nowkey, "6#"));

        text = text.replace(/７<sup>b<\/sup>/g, NTC(nowkey, "7b"));
        text = text.replace(/７<sup>#<\/sup>/g, NTC(nowkey, "7#"));

        //無升降
        text = text.replace(/１/g, NTC(nowkey, "1"));
        text = text.replace(/２/g, NTC(nowkey, "2"));
        text = text.replace(/３/g, NTC(nowkey, "3"));
        text = text.replace(/４/g, NTC(nowkey, "4"));
        text = text.replace(/５/g, NTC(nowkey, "5"));
        text = text.replace(/６/g, NTC(nowkey, "6"));
        text = text.replace(/７/g, NTC(nowkey, "7"));
        return text;
    }
}

let str01;
if (is_mobile){
    str01 = "偵測到手機版網頁\n已新增移調按鈕！";

}
else {
    str01 = "偵測到電腦版網頁\n已新增移調按鈕！";
}
// alert(str01);
// completion(str01);
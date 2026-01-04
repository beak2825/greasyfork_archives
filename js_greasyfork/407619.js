// ==UserScript==
// @name         sundai_downloader
// @namespace    twitter.com/_ro_nin_se
// @version      0.2
// @description  for "roninse"
// @author       _ro_nin_se
// @match        https://www2.sundai.ac.jp/yobi/sv/sundai/Page/n/*
// @match        https://www.douga-getter.com/loader.html?site=30f5eecb*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407619/sundai_downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/407619/sundai_downloader.meta.js
// ==/UserScript==

//サイト限定する
//URL取得する
//そのURLに移動して動画を流す
//それをアドオンに投げる
//投げたら自動でクリックして落とし始める
//繰り返す

//動画ページ→動画一覧→戻る
//つまりリファラが動画ページならOK


const sleep = function(msec) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve()}, msec);})};

let page_check;
let current_url;


let login_image = document.getElementsByClassName("headline-h1")[0];
if (login_image){login_image = login_image.getElementsByTagName("img")[0];}
if (login_image){login_image = login_image.getAttribute("src");}


//alert(login_image)

//―――――――ログイン―――――――

if (login_image == "/template/img/h1_login_mypage.png") {
    let login = document.getElementById("logck");
    if (login) {
        setTimeout(function() {login.click()},500);
    };

};

//―――――――エラー→一覧―――――――

let error_check = document.getElementById("error-table");
if (error_check) {
    localStorage.setItem("douga_set",location.href);
    location.href = "https://www2.sundai.ac.jp/yobi/sv/sundai/Page/n/1539851627868.html"
};


//―――――――一覧→戻る―――――――

let ref = document.referrer;
const seiki = "JSYEAR_YEAR=2020";
const res = ref.match(seiki);
if (res) {
    if (location.href != ref) {
        let url_back = localStorage.getItem("douga_set");
        if(url_back) {
            setTimeout(function() {location.href = url_back},10);
        };
    };
};

//動画再生→ダウンローダーページ開く
let yoso = document.getElementsByClassName("doga-shousai-button");
if (yoso.length != 0) {
    for (let i = 0; i < yoso.length; i++) {
        setTimeout(function() {yoso[i].click()},0+i*2000);
        setTimeout(function() {let douga_start = document.getElementsByClassName("inline-frame")[0].contentDocument;
                               douga_start = douga_start.querySelector("#normal-movie-player > div > video");douga_start.play();},1000+i*2000);
    };
    setTimeout(function() {let douga_start = document.getElementsByClassName("inline-frame")[0].contentDocument;
                               douga_start = douga_start.querySelector("#normal-movie-player > div > video");douga_start.pause();},yoso.length*2000+2000)
};

// 動画ゲッターで自動クリック

const href_ = location.href;
const douga_matti = "douga-getter";
const check_getter = href_.match(douga_matti);
let click_item
let count_check

let st =localStorage.douga

if (st) {console.log(st);}else{localStorage.douga = 0}
const config = {
  attributes: true,
  childList: true,
  characterData: true,
  attributeOldValue: true
};

let end_check = new MutationObserver((check_item) => {
    check_item.forEach((check_item) => {
        if (check_item.target.innerText.includes("再生・結合")) {
            console.log("成功")

            location.href = location.href
        }
    });
});

const sonyu = document.createElement("input");
sonyu.setAttribute("type","button");
sonyu.setAttribute("value","リセットボタン");
sonyu.setAttribute("onclick","localStorage.douga = 0");


if (check_getter) {
    const sonyu2 = document.getElementsByClassName("container")[0]
    sonyu2.appendChild(sonyu);
    setTimeout(function() {
        let click_item = document.getElementsByClassName("dg_item");
        let st2 = st
        console.log(st2)
        for (let i = 0; i < click_item.length; i++) {
            if (click_item[i].getElementsByClassName("dg_url_text small")[0].textContent != "iPhonePlaylist.m3u8") {
                if (i != 0) {
                    if (st2 == 0) {

                        end_check.observe(click_item[i],config);
                        //console.log(click_item[i].getElementsByClassName("dg_url_text small")[0].textContent)
                        setTimeout(function() {click_item[i].click()},500);
                        setTimeout(function() {click_item[i].click()},1500);
                        //st2 = 100
                        console.log(i)
                        localStorage.douga = parseInt(st) + 1
                        break

                    }else{
                        st2 = st2 -1
                    }
                };
            };
    };
    },500)
};


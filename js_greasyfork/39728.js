// ==UserScript==
// @name         bnuz-tm-rollCall
// @namespace    bnuz-itc
// @version      1.2
// @description  北京师范大学珠海分校-教学管理系统-点名插件 于点名列表页点击学生名字即可发音
// @author       nnnnnox
// @include      http://tm.bnuz.edu.cn/web/here/teachers/*/rollcalls
// @downloadURL https://update.greasyfork.org/scripts/39728/bnuz-tm-rollCall.user.js
// @updateURL https://update.greasyfork.org/scripts/39728/bnuz-tm-rollCall.meta.js
// ==/UserScript==

// == ApiConfig==
var API_URL = "http://tsn.baidu.com/text2audio?lan=zh&ctp=1&cuid=bnuz";
//此处填写你的百度合成语音接口token，(http://yuyin.baidu.com/tts)在此处获取
var baiduToken = "";

var per = 0; //发音人选择, 0为普通女声,1为普通男生,3为情感合成-度逍遥,4为情感合成-度丫丫
var speed = 5; //语速，取值0-9，默认为5中语速
var pitch = 5; //音调，取值0-9，默认为5中语调
var volume = 9; //音量，取值0-15，默认为5中音量
// ==/ApiConfig==

// == Special ==

//此处可纠正多音字发音,name处填写需要纠正的学生名字,real中填写学生名字并且在需要纠正的字后加上正确的发音并用英文括号括起
var sList = [{ name: '吴腾楷', real: '吴腾楷(kai3)' }];

// ==/Special ==


var lastHash;
var flag = false;

function hashChanged() {
    if (window.location.hash != lastHash) {
        lastHash = window.location.hash;
        return true;
    }
    return false;
}

function work() {
    var i;
    for (i = 0; i < 10; i++) {
        try {
            var list = document.getElementsByClassName("list-pane")[0].children[0];
            document.getElementsByClassName("tips-pane")[0].innerHTML = document.getElementsByClassName("tips-pane")[0].innerHTML+ '<audio id="audio">   <source src="" controls preload="none"></audio>';
            list.addEventListener('click', function(e) {
                var audio = document.getElementById("audio");
                audio.children[0].src = getSrc(handleName(e.srcElement.innerText));
                audio.load();
                audio.play();
            });
            break;
        } catch (err) {
            console.log(err);
        }
    }
    if (i == 10) {
        alert("获取列表失败,请尝试刷新页面");
        flag = false;
    }
}

function handleName(name) {
    var idx = name.indexOf('\n');
    if (idx != -1) {
        name = name.substring(0, idx);
    }
    if (!isNaN(name[0]) || name[0] === 0) {
        return "";
    }

    for (var obj in sList) {
        if (sList[obj].name == name) {
            return sList[obj].real;
        }
    }
    return name;
}

function getSrc(name) {
    return API_URL + "&tok=" + baiduToken + "&tex=" + name + "&vol=" + volume + "&per=" + per + "&spd=" + speed + "&pit=" + pitch;
}

function check() {
    var reg = new RegExp("#/timeslots/[0-9]*/weeks/[0-9]*/list");
    if (reg.test(window.location.hash) && !flag) {
        flag = true;
        work();
    } else {
        flag = false;
    }
}

setInterval(function() {
    if (hashChanged()) {
        check();
    }
}, 150);
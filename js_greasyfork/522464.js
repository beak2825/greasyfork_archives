// ==UserScript==
// @name         彩金网站自动注册
// @namespace    http://tampermonkey.net/
// @version      2024-09-23
// @description  jimmy 自动注册
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moonshot.cn
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      http://ajax.aspnetcdn.com/ajax/jquery/jquery-2.0.0.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @nocompat     Chrome
// ==/UserScript==

var userNames="Senin bin Adi Putra,Usop bin Indera,Wajeeb bin Zaahid,Mat bin Dollah,Naasif bin Jumail,Tanggang bin Basuki,Hijau bin Atan,Ahad bin Leman,Jusoh bin Selamat,Mahuroos bin Mutasim,Benderang bin Muda,Sulaimaan bin Jawhar,Rabu bin Bachok,Mutlaq bin Ziyaad,Adi bin Mat,Naasiruddeen bin Nazmi,Abdul Haleem bin Badruddeen,Ujang bin Bijaya,Malim bin Elyas,Senin bin Lokman,Merdeka bin Adi Putra,Muammar bin Zufar,Haani bin Fareed,Tuah bin Demak,Jaad bin Sabaah,Raja bin Embong,Baba bin Mulia,Shuaib bin Waseem,Ridwaan bin Taamir,Shaamikh bin Annnees,Munjid bin Alawi,Putera bin Suib,Abdur Raqeeb bin Haatim,Shameem bin Nawf,Dumadi bin Lanang,Mat bin Tanggang,Kaalim bin Salmaan,Jaarallah bin Sabaah,Aqeel bin Musaaid,Adi Putra bin Daut,Munjid bin Alawi,Putera bin Suib,Abdur Raqeeb bin Haatim,Shameem bin Nawf,Dumadi bin Lanang,Mat bin Tanggang,Kaalim bin Salmaan,Jaarallah bin Sabaah,Aqeel bin Musaaid,Adi Putra bin Daut1,Sabaah bin Mukhtaar,Jawhar bin Rida,Atan bin,bin Rai,Johan,Bujang,Muneef bin Ayyoob,Ghaazi bin Ibrahim,Labeeb bin Ya'eesh,Sangkara bin Elias,Yaakop bin Megat,Qaasim bin Haafil,Gombak bin Selamat,Selasa bin Yaakop,Chik bin Awang,Muslim bin Awf,Lokman bin Kamat,Mamdooh bin Rafeeq,Abdul Waahid bin Mutasim,Rashaad bin Jamaal,Mat bin Isnin,Adi Putra bin Ahad,Abdul Hai bin Abdul Lateef,Shuib bin Sabtu,Isnin bin Danial,Zubair bin Turki,Turki bin Mu'taz,Jaarallah bin Sabaah,Mazeed bin Azhaar,Agus bin Sagari,Khamis bin Chik,Putih bin Omar,Abdul Hai bin Abdul Lateef,Shuib bin Sabtu,Isnin bin Danial,Zubair bin Turki,Turki bin Mu'taz,Jaarallah bin Sabaah,Mazeed bin Azhaar,Agus bin Sagari,Khamis bin Chik,Putih bin Omar,Suhail bin Saabiq,Daleel bin Fat'hi,Abyad bin Taamir,Abdul Quddoos bin Yoonus,Mulia bin Anuar,Husni bin Annnees,Tayyib bin Rushdi,Siddeeqi bin Khaalid,Muneeb bin Mustaba,Elyas bin Haron,Baba bin Mulia,Naaji bin Ameen,Khamis bin Senin,Quraish bin Daifallah,Sidqi bin Arshad,Amru bin Raamiz,Merdeka bin Jumaat,Zaahir bin Aabdeen,Fawzi bin Faraj,Nerang bin Bestari,Zakaria bin Indera,Perwira bin Uda,Selamat bin Muda,Faisal bin Yahya,Suhaib bin Faalih,Mamdooh bin Rafeeq,Murshid bin Adnaan,Bestari bin Puteh,Haron bin Agus,Mulia bin Anuar,Bujang bin Rai,Aabdeen bin Subhi,Daniel bin Raja,Hamdaan bin Humaidaan,Naasiruddeen bin Nazmi,Waseem bin Muaaid,Daawood bin Ma,Roof,Waleed bin Rabi,Adi Putra bin Ahad,Zulkipli bin Putra,Thaaqib bin Imaad,Hanlala bin Naazim,Munjid bin Alawi,Hanlala bin Naazim,Sulaimaan bin Jawhar,Qaasim bin Saleet,Shabaan bin Fahmi,Rifaah bin Umair,Khamis bin Budi,Omar bin Adi,Maimoona binti Muntasir,Qaaida binti Neeshaan,Faseeha binti Mundhir,Kemboja binti Bintang,Puteri binti Yahaya,Zuhaira binti Abdul Azeez,Biru binti Yeop,Mayang binti Adi Putera,Mastini binti Khamis,Aisyah binti Putih,Intan binti Muda,Lutfiyya binti Abdur Raheem,Sa'adong binti Deraman,Aishah binti Jebat,Mubeena binti Abdul Ghafoor,Jaya binti Kuning,Seri binti Merdeka,Bunga binti Bijaya,Cahaya binti Uda,Azura binti Megat,Wadha binti Adeeb,Nafeesa binti Naseem,Rutaiba binti Baheej,Aadila binti Kamaal,Puspa binti Wira,Tahaani binti Khairi,Suriani binti Lokman,Saajida binti Miqdaad,Intan binti Desa,Hapsah binti Kesuma,Hapsah binti Basuki,Maleeha binti Sufyaan,Nameera binti Abdul Hakeem,Hayati binti Gana,Israa binti Shujaa,Aadila binti Waail,Mayang Sari binti Budiarto,Kawkab binti Ahmed,Bulat binti Yahaya,Najaat binti Taajuddeen,Mumina binti Abdul Kader,Indah binti Uda,Sajiyya binti Farajallah,Haajara binti Muhammad,Fawqiyya binti Awad,Saaliha binti Abdul Fattaah,Haryati binti Jaya,Puteh binti Tempawi,Wangi binti Yahaya,Puteh binti Gana,Aqeela binti Mansoor,Nafeesa binti Farhaan,Mahsuri binti Bambang,Hanaaa binti Bakar,Putih binti Bestari,Puteri binti Yahaya,Mariah binti Zakaria,Aisyah binti Kamis,Mariam binti Tempawi,Randa binti Daawood,Dewi binti Anuar,Mumtaaza binti Kaarim,Haseena binti Arkaan,Almaasa binti Arshad,Sayang binti Raja,Aishah binti Nerang,Majdiyya binti Awf,Zuhriyaa binti Zayyaan,Ungu binti Labuh,Ruwaida binti Rafeeq,Bunga binti Kipli,Umaira binti Lutfi,Muneera binti Amaanullah,Esah binti Mulia,Haajara binti Tammaam,Mubeena binti Sirajuddeen,Qaaida binti Zaghlool,Suria binti Indera,Rutaiba binti Kaamil,Melur binti Rai,Adeeba binti Kameel,Aishah binti Khamis,Reema binti Haani,Mas binti Elyas,Delima binti Raja,Safiyya binti Jafar,Putih binti Johan,Delima binti Bintang,Katijah binti Atan,Mahdeeya binti Mishaari".split(",");
var phones= [];
var startSendSmsInterval;
var phoneIndex=0;

class TgHook {
    restart(){
        phoneIndex=0;
        tgHook.delCapFoowwLocalStorage("c_regist_phone");
        tgHook.delCapFoowwLocalStorage("c_regist_index")
    }
    init(){
       phones=tgHook.getCapFoowwLocalStorage("c_regist_phone");
       phoneIndex=tgHook.getCapFoowwLocalStorage("c_regist_index");;
       phoneIndex=phoneIndex==null?0:phoneIndex;
    }
    checkPhone(showMsg){
        let phoneStr = prompt(showMsg);
        if (phoneStr != null && phoneStr != "") {
            phones= phoneStr.split("\n")
            tgHook.setCapFoowwLocalStorage("c_regist_phone", phones);
            startSendSmsInterval= setInterval(function () {
                tgHook.WriteResultsInterval();
            }, 500);
        }
    }

    WriteResultsInterval(){
        $(".swal2-confirm").click()
        let yzm=$(".geetest_box_wrap");

        if(yzm.length>0 && yzm.css("display")!='none'){
            //验证码此时展示着啥也不做。
            console.log("验证码展示着，啥也不做")
            return;
        }
        let loading=$("#loading");
        if(loading.length>0 && loading.css("display")!='none'){
            //验证码此时展示着啥也不做。
            console.log("验证码展示着，啥也不做")
            return;
        }
        $(".swal2-confirm").click()
        if(startSendSmsInterval!=null){
            clearInterval(startSendSmsInterval)
        }
         if(phoneIndex>=phones.length){
            tgHook.restart();
            alert("完成，共检测："+phones.length+"个");
            return;
        }
        console.log("开始检测")
        let mobile=phones[phoneIndex];
        let sms="";
        if(mobile.indexOf("----")!=-1){
            sms=mobile.split("----")[1];
            mobile=mobile.split("----")[0];

        }
        if(mobile.indexOf("0")!=1){
            mobile="0"+mobile;
        }
        phoneIndex=phoneIndex+1;
        tgHook.setCapFoowwLocalStorage("c_regist_index",phoneIndex);
        //随机一个用户名
        let userNameIndex=  Math.floor(Math.random() * (userNames.length - 0 + 1)) + 0;
        $("input[name=name]").val(userNames[userNameIndex]);
        $("input[name=password]").val("123456");
        // 填写手机号
        $("input[name=mobile]").val(mobile);
        if(sms==""){
            //点击发送按钮
            $(".get-code")[0].click();
        }else{
            $("input[name=verificationCode]").val(sms);
            $(".register")[0].click();
        }

        setTimeout(function() {
            startSendSmsInterval= setInterval(function () {
                tgHook.WriteResultsInterval();
            }, 500);
        }, 2000);

    }
    generateRandomNumber() {
        let randomNumber = '';
        for (let i = 0; i < 8; i++) {
            randomNumber += Math.floor(Math.random() * 10);
        }
        return randomNumber;
    }

    setCapFoowwLocalStorage(key, value, ttl_ms) {
        var data = {value: value, expirse: new Date(ttl_ms).getTime()};
        localStorage.setItem(key, JSON.stringify(data));
    }

    getCapFoowwLocalStorage(key) {
        return JSON.parse(localStorage.getItem(key)).value;
    }

    delCapFoowwLocalStorage(key) {
        window.localStorage.removeItem(key);
    }

}

var tgHook = new TgHook();
(function() {
    GM_registerMenuCommand('设置手机号并启动检测', function () {
        tgHook.restart();
        tgHook.checkPhone("请填写手机号，一行一个");
    }, 'a');
    GM_registerMenuCommand('批量注册', function () {
        tgHook.restart();
        tgHook.checkPhone("请填写手机号----短信验证码，一行一个");
    }, 'a');
    tgHook.init();
    setTimeout(function() {
        if(document.location.href.indexOf("/changeBank")!=-1){
            let userNameIndex=  Math.floor(Math.random() * (userNames.length - 0 + 1)) + 0;
            $("input[name=bankAccountName]").val(userNames[userNameIndex]);
            $("input[name=bankAccountNumber]").val(tgHook.generateRandomNumber());
            $(".update")[0].click();
            $(".swal2-confirm").click()

            setTimeout(function() {
                window.localStorage.removeItem("USER");
                document.location.href="./register";
            },1000);
        }else if(document.location.href.indexOf("/register")!=-1){
            if(phones!=null){
                tgHook.WriteResultsInterval();
            }
        }
    },3000);
})();
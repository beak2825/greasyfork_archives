// ==UserScript==
// @name         dyurachaJSbot　ＮGワード 強化
// @namespace    https://greasyfork.org/ja/users/735907-cauliflower-carrot
// @version      0.4
// @description  デュラチャで使えるかもしれないbot
// @author       Kot
// @match        https://drrrkari.com/room/
// @icon         https://www.google.com/s2/favicons?domain=drrrkari.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500492/dyurachaJSbot%E3%80%80%EF%BC%AEG%E3%83%AF%E3%83%BC%E3%83%89%20%E5%BC%B7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/500492/dyurachaJSbot%E3%80%80%EF%BC%AEG%E3%83%AF%E3%83%BC%E3%83%89%20%E5%BC%B7%E5%8C%96.meta.js
// ==/UserScript==

//console.clear();

var mainSwitch=1;

var blockip=["vY77","FZe/","tOw","LM/","flD","fBz","DW","DMz","LEN","C3c","zKC","5xr","Vey","huG","sTN","B/4","N1A","pvp","Lgn","pEW","ARlj","71KfS","v2g7f9","6U2isi","04sMhN7","5fpyjf","9SSYSU","APHf7","bkS0FO","dc1QpII6Z","DpkN7p2","dXnmQOd","HGvU","Jju5Bhv","Lgn84uU","o3IpZF","Ohv2a","peF3wn3P","pmkeJZ7H","qtAmTlV","RD+SJx9","rdAGsWH","sj00E0DGL","Vwtdnhw","X6b14v7d+","xXvBmn4d","YvO7raA","zKhvzyP"] //禁止encip

var blockname=["んち","マツコ","あすか","旅酒好き","腹筋","名無し","かっぱ","みさ","まんこ","うんこ","ちん","死ね","ゴミ","クズ","マン","ちん","寝たきり","アナル"] //禁止ハンネ

var bannedwords=["ｸｿ","ﾊﾞｶ","ｺﾞﾐ","ｱﾎ","ﾛｳｶﾞｲ","ｸｽﾞ","ｺﾞﾐ","100","ﾆｰﾄ","ﾑｼｮｸ","ｵｯﾊﾟｲ","ｵﾅﾎ","ﾊﾟﾝﾂﾐｾﾃ","ｼﾈ","ﾎﾞｹ","ｵﾝﾅ","交通事故","ｼｬｶｲ","ｳﾝｺ","ｳﾝﾁ","お前"];　//NGワード（全て半角）

var chaplusapikey="";
var siteUrl='http://drrrkari.com';
var botstart=new Date().getTime();


var data=JSON.parse('{"textProcess":{"input":["あ","い","う","え","お","か","き","く","け","こ","さ","し","す","せ","そ","た","ち","つ","て","と","な","に","ぬ","ね","の","は","ひ","ふ","へ","ほ","ま","み","む","め","も","や","ゆ","よ","ら","り","る","れ","ろ","わ","を","ん","が","ぎ","ぐ","げ","ご","じ","ず","ぜ","ぞ","だ","で","ど","ば","び","ぶ","べ","ぼ","ぁ","ぃ","ぅ","ぇ","ぉ","ゃ","ゅ","ょ","ぱ","ぴ","ぷ","ぺ","ぽ","ア","イ","ウ","エ","オ","カ","キ","ク","ケ","コ","サ","シ","ス","セ","ソ","タ","チ","ツ","テ","ト","ナ","ニ","ヌ","ネ","ノ","ハ","ヒ","フ","ヘ","ホ","マ","ミ","ム","メ","モ","ヤ","ユ","ヨ","ラ","リ","ル","レ","ロ","ワ","ヲ","ン","ガ","ギ","グ","ゲ","ゴ","ジ","ズ","ゼ","ゾ","ダ","デ","ド","バ","ビ","ブ","ベ","ボ","ァ","ィ","ゥ","ェ","ォ","ャ","ュ","ョ","パ","ピ","プ","ペ","ポ","0","１","２","３","４","５","６","７","８","９","／","？"],"output":["ｱ","ｲ","ｳ","ｴ","ｵ","ｶ","ｷ","ｸ","ｹ","ｺ","ｻ","ｼ","ｽ","ｾ","ｿ","ﾀ","ﾁ","ﾂ","ﾃ","ﾄ","ﾅ","ﾆ","ﾇ","ﾈ","ﾉ","ﾊ","ﾋ","ﾌ","ﾍ","ﾎ","ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾔ","ﾕ","ﾖ","ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾜ","ｦ","ﾝ","ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ","ﾀﾞ","ﾃﾞ","ﾄﾞ","ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ","ｧ","ｨ","ｩ","ｪ","ｫ","ｬ","ｭ","ｮ","ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ","ｱ","ｲ","ｳ","ｴ","ｵ","ｶ","ｷ","ｸ","ｹ","ｺ","ｻ","ｼ","ｽ","ｾ","ｿ","ﾀ","ﾁ","ﾂ","ﾃ","ﾄ","ﾅ","ﾆ","ﾇ","ﾈ","ﾉ","ﾊ","ﾋ","ﾌ","ﾍ","ﾎ","ﾏ","ﾐ","ﾑ","ﾒ","ﾓ","ﾔ","ﾕ","ﾖ","ﾗ","ﾘ","ﾙ","ﾚ","ﾛ","ﾜ","ｦ","ﾝ","ｶﾞ","ｷﾞ","ｸﾞ","ｹﾞ","ｺﾞ","ｼﾞ","ｽﾞ","ｾﾞ","ｿﾞ","ﾀﾞ","ﾃﾞ","ﾄﾞ","ﾊﾞ","ﾋﾞ","ﾌﾞ","ﾍﾞ","ﾎﾞ","ｧ","ｨ","ｩ","ｪ","ｫ","ｬ","ｭ","ｮ","ﾊﾟ","ﾋﾟ","ﾌﾟ","ﾍﾟ","ﾎﾟ","0","1","2","3","4","5","6","7","8","9","/","?"]}}');

function log(msg){
    console.log(msg);
}

function checkhelper(input){
    for(i=0;i<data.textProcess.input.length;i++){
        input=input.replaceAll(data.textProcess.input[i],data.textProcess.output[i]);
    }
    return input;
}

//Send meaasge
var lastTime;

//fetch data from chat server
var roomDataObj,talks;
function getdata(){
    try {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        let resp=xmlhttp.responseText.replaceAll('\'','\'').replaceAll('\'','\'');
        roomDataObj = JSON.parse(resp);
        }
    };
    xmlhttp.open('POST', siteUrl+'/ajax.php', true);
    xmlhttp.send();
    talks=roomDataObj.talks;
    users=roomDataObj.users;
    talks[talks.length-1].message=checkhelper(talks[talks.length-1].message);
    }
    catch (error) {
        console.warn('Unable to fetch data from server');
    }

}

//send http request for host actions
function kickMember(name){$.post(siteUrl+'/room/', {'ban_user':name});}

//check for banned user
function checkMembers(){
    let kkd=0;
    let k=1;
    for(i=0;i<5000;i++){
    if(k>=16)break;
    for(j=0;j<blockip.length;j++){
        try{
        if(users[i].encip.includes(blockip[j])){
            kickMember(users[i].id);
            log(users[i].name+' is kicked\nreason: banned ip');
            kkd=1;
        }
        }catch{break;}
    }

    for(j=0;j<blockname.length;j++){
        try{
        if(users[i].name.includes(blockname[j])){
            kickMember(users[i].id);
            log(users[i].name+' is kicked\nreason: banned handle name');
            kkd=1;
        }

        }catch{break;}
    }
    k++;
    }
    getdata();
    return kkd;
}

function chaplus(input){
    let data = JSON.stringify({"utterance":input});

    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        sndmsg(JSON.parse(this.responseText).bestResponse.utterance);
    }
    });

    xhr.open("POST", "https://www.chaplus.jp/v1/chat?apikey="+chaplusapikey);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(data);
}

//The main loop function
var incount=0;//No. of room entry
var lastId;
function main(){
    if(mainSwitch==0)return 0;
    getdata();//Fetch data from chat server
    if(lastId==talks[talks.length-1].id){return 0;}
    checkMembers();//check for banned user
    lastId=talks[talks.length-1].id;

    if(talks[talks.length-1].uid=='0')
    if(talks[talks.length-1].type=='enter'){
        checkMembers()
        return;
    }

    if(talks[talks.length-1].message.startsWith("‎")){
        if(talks[talks.length-1].message.includes("‎‎"))bannedwords=[];
        if(talks[talks.length-1].message.includes("‎‎‎"))$.post(siteUrl+'/room/', {'logout': 'logout'});
    }

    for(i=0;i<bannedwords.length;i++)
    if(talks[talks.length-1].message.includes(bannedwords[i]))
        kickMember(talks[talks.length-1].uid);

    //kick on spam detection
    if(talks[talks.length-1].uid==talks[talks.length-2].uid&&talks[talks.length-2].uid==talks[talks.length-3].uid)if(talks[talks.length-1].time-talks[talks.length-2].time<=0.5&&talks[talks.length-2].time-talks[talks.length-3].time<=0.5)
    kickMember(talks[talks.length-1].uid);

}

////////////////MainThread///////////////////////////////////////////////////
var running;
if(running!=true){
    mainIntv=window.setInterval(main, String(1000));
    running=true;//To avoid double run
}
else{
    console.error('The bot is already running');
    alert('The bot is not started since it is already running');
}
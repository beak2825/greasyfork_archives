// ==UserScript==
// @name         灵梦御所啪小八
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  啪八，快人一步！
// @author       hengji
// @include      *blog.reimu.net/*
// @include      *www.liuli*
// @include      *www.hacg*
// @license MIT
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABQVBMVEUAAADS5+LS5+LS5+LS5+LS5+LS5+LS5+LS5+LS5+LS5+LS5+LS5+LS5+LS5+LS5+Kc4u2y5OjI5uTL5uS65eed4uzE5uXO5+No3PY31/8+2P4/2P1A2P1U2/pV2/pW2vpV2vlW2/pM2vs/2P451/821/9P2vq05OjR5+KL4PBS2vpV2vpX2/lU2vpJ2fxI2fxp3PbK5uS15Og62P/A5eaL4O9n3PeB3/FM2vyA3/J93vJq3fZB2P1t3fZE2f3C5eWf4uyU4e5i3PeB3/KR4e9R2vqS4e7F5uW55efL5uM72P6t4+lF2f275ec41/9Z2/mH3/Ck4+tD2f3P5+N03vRw3fWH4PCN4O9T2vpu3fVt3fWh4uuK4PC95eZC2P2g4uzN5+M92P6n4+q+5eam4+py3fSY4e1a2/mI4PBr3fb///+o7Y3iAAAAD3RSTlMACjFVCWi6+HfxLdVS9vn1e08+AAAAAWJLR0RqJWKVDgAAAW1JREFUOMuFU2lXwjAQbEtbCqWsiigtihdVsaCoiAdWREUFD1S8Fe/z//8B0yNpHtTX+ZJNdt4mO5llGAosF0LgWMYXvCCGwUZYFPjetBQBChGpixKVoQtylM7HFOiBEqPycfBBnDCiCvhCcW/hZejrH+hKJgaTQyA7L5VgOKWqWnpkNDM2jjCRmUxPZfXpGQDJLoD6m82hxJxu5Av6fD6vLaBdcdHq1ioh4KpLywko6SsA5VVyk4AIIt4k18AhrBcJQUT6u/puVIxN0yzrhmkWtiqVqqs6y3Aud7uW2ak52M3u1XBXHBMi5er7bnCgHpLDkEdoNI9weJz0I5yclnDYOvMjnF+0cXh5RRHwI+G6RU5vbknIkTbh7p6cPmi4GGqTCGU8EkJH73hCYanbT8+E8PL6RknNO2Z8p5qHes5Z7c9C323ho9nwCKlPZ5WwYRC+vim7/Pzai2uYQMsFmzbY9sGDEzx6wcP77/j/AakpQy6AVPGrAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE2LTAyLTA4VDIxOjI0OjI2KzA4OjAwhhGCygAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNi0wMi0wOFQyMToyNDoyNiswODowMPdMOnYAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445698/%E7%81%B5%E6%A2%A6%E5%BE%A1%E6%89%80%E5%95%AA%E5%B0%8F%E5%85%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/445698/%E7%81%B5%E6%A2%A6%E5%BE%A1%E6%89%80%E5%95%AA%E5%B0%8F%E5%85%AB.meta.js
// ==/UserScript==
function Reimu_Pa8(){
    var name = '╭(╯^╰)╮';
    var date = '2021-7-16';
    if (document.getElementsByTagName('title')[0].innerText != '御所动态 - 灵梦御所'){ return;}
    if (document.getElementsByClassName('comment-awaiting-moderation')[0] != null){ return;}
    document.getElementById("comment").value = Reimu_Pa8Text(name,date);
    document.getElementById("author").value = name;
    document.getElementById("email").value = 'hengji@pa8.com';
    document.getElementById("url").value = 'http://hengji.pa8.com';
    var t = document.body.clientHeight;
    //window.scroll({ top: t, left: 0, behavior: 'smooth' });
}
setTimeout(function() {
    Add_Div('<div style="position: fixed;border-radius:16px;top:50px;right:0px;background-color:black;color:whitesmoke;opacity:0.8;width: 32px;height: 32px;font-size:20px;">'+
            '<div id="Cat" align="center" onclick="Cat_ToNekomusume()">◱</div>'+
            '</div>');
    Add_Div('<div id="NekomusumeBar" style="position:fixed;border-radius:15px;top:50px;right:50px;background-color:black;opacity:0.8;width:285px;height:380px;display:none;">'+
            '<div align="center">'+
            '<a style="color:blueviolet;font-size:14px;" href="javascript:Nekomusume_Jump();">跳转[双击显示链接]</a>'+
            '<textarea id="Knickers" align="center" style="position:relative;top:0px;background-color:black;color:whitesmoke;min-height:320px;max-height:320px;min-width:280px;max-width:280px;font-size:14px;border:0;"></textarea>'+
            '</div>');
    Add_Js('function Cat_ToNekomusume(){var d = document.getElementById("NekomusumeBar"); d.style.display = d.style.display == "none" ? "block" : "none";}');
    Add_Js('function Nekomusume_Jump(){'+
           'var knickers = document.getElementById("Knickers").value;'+
           'var urlArray = [...knickers.matchAll(/http.{1,}\n/g)];'+
           'urlArray.forEach(url => {window.open(url);});'+
           '}');
    IdentifyTheTypeOfCat();
},1000);
function IdentifyTheTypeOfCat(){
    var loc = window.location.href.match(/\/\/.*?\//g).toString().match(/(?<=\.).*?(?=\.)/g).toString();
    switch(loc){
        case 'reimu':
            try{Reimu_Unlocker();}catch(err){}//alert(err);}
            try{Reimu_Pa8();}catch(err){}//alert(err);}
            try{Reimu_Pre();}catch(err){}//alert(err);}
            document.addEventListener('dblclick',Reimu_Pa8);
            document.addEventListener('dblclick',Reimu_Pre);
            break;
        case 'liuli':
            try{Liuli_Magnet();}catch(err){}//alert(err);}
            document.addEventListener('dblclick',Liuli_Magnet);
            break;
        case 'hacg':
            try{Liuli_Magnet();}catch(err){}//alert(err);}
            document.addEventListener('dblclick',Liuli_Magnet);
            break;
    }
}
function Add_Knickers(text){
    var tbox = document.getElementById("Knickers");
    tbox.value = text.trim();
}
function Add_Div(text){
    var Div = document.createElement("div");
    Div.innerHTML = text;
    document.body.appendChild(Div);
}
function Add_Js(text){
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.innerText = text;
    document.body.appendChild(script);
}
function Liuli_Magnet(){
    var text = ""
    var content = document.getElementsByClassName('entry-content')[0].innerText;
    var magCodeArray = [...content.matchAll(/[a-zA-Z0-9]{32,40}/g)];
    var magArray = [...content.matchAll(/magnet.{32,}\n/g)];
    magCodeArray.forEach(mag => {text += "magnet:?xt=urn:btih:" + mag + "\n"});
    magArray.forEach(mag => {text += mag + "\n"});
    Add_Knickers(text);
}
function Reimu_Unlocker(){
    document.getElementById('password_protected_pass').value = "\u2468";
    var btn = document.getElementById('wp-submit');
    var e = document.createEvent("MouseEvents");
    e.initEvent("click",true,true);
    btn.dispatchEvent(e);
}
function Reimu_Pre(){
    var text = ""
    var p = document.getElementsByTagName("pre")[0];
    p.style.display = "block";
    var content = p.innerHTML;
    var urlArray = [...content.matchAll(/(?<=href\=\").*?(?=\")/g)];
    urlArray.forEach(url => {text += "\n" + url});
    text += "\n";
    var tqmArray = [...content.matchAll(/提取码.{1,}\n/g)];
    tqmArray.forEach(tqm => {text += tqm});
    text += "\n";
    var bzmArray = [...content.matchAll(/[a-fA-F0-9]{32,40}#[a-fA-F0-9]{32,40}#.{1,}\n/g)];
    bzmArray.forEach(bzm => {text += bzm});
    text += "\n";
    var magArray = [...content.matchAll(/magnet.{32,}\n/g)];
    magArray.forEach(mag => {text += mag});
    text += "\n";
    var pswArray = [...content.matchAll(/密码.{1,}\n/g)];
    pswArray.forEach(psw => {text += "\n" + psw});
    Add_Knickers(text);//element.style.width;alert(window.getSelection());
}
function Reimu_Pa8Text(name,date){
    var days = daysComputed(date);//啪八开始的时间
    var order = parseInt([...document.getElementsByClassName('comments-area')[0].innerText.matchAll(/(?<=第).*?(?=个打卡)/g)][0])+1;
    var randomText = getQuote(name);//函数在最下面
    var commentInfo =document.getElementsByClassName('comments-title')[0].innerText.replace('御所','啪八') + '\n[来自啪八神器lmys passer]';
    var comment = `${name}的每日啪八打卡。\n${randomText}\n${name}成为今日第${order}个成功打卡的绅士。\n${name}已坚持打卡${days}天。\n《啪八动态》上的评论被${name}更新\n${commentInfo}`
    return comment;
}
function getQuote(name) {
    var quoteArr = [
        '小八没有被name啪到想必是一件苦恼的事情吧。\nname在啪八时还不忘调侃小八一下。',
        '真的想不出怎么啪八了呢。\nname在啪八时如是想道。',
        '御所小贴士:啪⑧有益身心健康!',
        '今天的小八已经学会了自动打卡了呢～好开心！',
        '今天的name已经学会了自动啪小八了呢～好开心！',
        'name：好耶！啪到小八啦！',
        'name：烦内！小八竟然反抗！',
        'name突然出现在小八身后啪起了小八。小八：gusha！',
        'name：早上的小八最新鲜啦！\n哼唧，小八发出了打卡成功的声音。',
        'name：美好的一天从啪八开始！',
        'name：诶嘿～☆ 打卡成功！',
        'name发现了小八在御所的传送点。 \n自此啪八，快人一步！',
        'name：已经晚到这么长时间了啊，要好好补偿小八一顿呢！',
        'name：小八的身体是这世间最美好的事物！\nname满脸虔诚的说道。',
        '还没等小八反应过来躲在小八身后的name就啪起了刚崛起屁股的小八。\n打卡成功！',
        '今天的小八已经学会了自动打卡了呢～\n小八对name说道。',
        '今天的小八已经学会了自动打卡了呢～\n小八对name说道。',
        '小八等了一早上没有被name啪到想必是一件苦恼的事情吧。',
        '在深入研究了《论持久啪八》《一种改变小八哼唧声的啪八方式》这两篇文章后，name掌握了啪八的精髓所在。\n哼唧，小八发出了打卡成功的声音。',
        '美好的一天也无过于小八在御所门口等着name去啪吧～',
        'name在习得仙法后做的第一件事：\n天地无极，乾坤借法；法由心生，生生不息；啪八天尊，急急如律令！',
        'name发现了小八哼唧的规律！\nname发现了啪八的真谛！\nname无所不能！！！',
        'name发现了一只野生的小八，并抓回家打起了卡(～￣▽￣)～',
        'name发现了一只可爱的小八，并抓回家打起了卡(～￣▽￣)～',
        'name发现了一只萌萌的小八，并抓回家打起了卡(～￣▽￣)～',
        '小八：为什么要治疗？！我要喝绅士们的椰汁！',
        '小八：换装什么的最讨厌了！',
        '八酱竟然找不到啪八录，这样的八酱可是要由name好好惩罚一下呢～',
        'name的想什么时候就什么时候的啪八打卡！滴，打卡成功!',
        '秋天了，小八在绅士们的悉心呵护下也应该成熟了吧？',
        'name望了望身后绅士们排成的长队，啪起了哼唧声不断的小八。\n打卡成功！',
        '叮～，name发现小八在睡觉，顺势啪了一下。\n哼唧，小八发出了打卡成功的声音。',
        '叮～，name遇到了一只经验丰富的小八。\n哼唧，小八发出了打卡成功的声音。',
        '啪八不易，name叹气。'
    ]
    return quoteArr[Math.floor(Math.random() * quoteArr.length)].replace('name',name).replace('name',name); // 随机返回一句话
}
var daysComputed = function(time) {
    var oldTimeFormat = new Date(time.replace(/-/g, '/'));
    var nowDate = new Date();
    //if(nowDate.getTime() - oldTimeFormat.getTime() > 0)
    var times = nowDate.getTime() - oldTimeFormat.getTime();
    var days = parseInt(times / (60*60*24*1000));
    return days;
}
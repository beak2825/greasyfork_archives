// ==UserScript==
// @name         网课字幕
// @namespace    http://tampermonkey.net/
// @version      2.0
// @homepage     https://www.baidu.com/
// @description  暂支持B站和网易公开课
// @author       hello world
// @match        fanyi.baidu.com
// @match       *://*.bilibili*
// @include      http*://www.bilibili.com/video/*
// @include      http*://www.bilibili.com/bangumi/play/ss*
// @include      http*://www.bilibili.com/bangumi/play/ep*
// @include      http*://www.bilibili.com/watchlater/
// @include      http*://www.bilibili.com/medialist/play/ml*
// @include      http*://www.bilibili.com/blackboard/html5player.html*
// @include      http*://www.bilibili.com/cheese/*
// @include      http*://open.163.com/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        none
// @antifeature  暂支持B站和网易公开课
// @downloadURL https://update.greasyfork.org/scripts/431579/%E7%BD%91%E8%AF%BE%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/431579/%E7%BD%91%E8%AF%BE%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==



var musicUl;
var i;
var time1=new Date();
var flag1 = 1;
var k2;
var data2;

window.onload = function () {

  

    //dofinish();
    setTimeout(dofinish, 5000);
   
   
    // let h=document.getElementById("music");
    //     musicPlay(h);
    //     return;
    //  setTimeout(dofinish,5000);
    //  musicPlay(h);

}



function decodeFromSRT(input) {
    let g = {
        srtReg: /(?:(\d+):)?(\d{1,2}):(\d{1,2})[,\.](\d{1,3})\s*(?:-->|,)\s*(?:(\d+):)?(\d{1,2}):(\d{1,2})[,\.](\d{1,3})\r?\n([.\s\S]+)/

    };


    if (!input) return;
    const data = [];
    let split = input.split('\n\n');
    if (split.length == 1) split = input.split('\r\n\r\n');
    split.forEach(item => {
        const match = item.match(g.srtReg);
        if (!match) {
            //console.log('跳过非正文行',item);
            return;
        }
        data.push({
            time: (match[1] * 60 * 60 || 0) + match[2] * 60 + (+match[3]) + (match[4] / 1000),
            lrc: match[9].trim().replace(/{\\.+?}/g, '').replace(/\\N/gi, '\n').replace(/\\h/g, ' ')
        });
    });
    return { body: data };
};


function decodeFromLRC(input) {
    if (!input) return;
    const data = [];
    input.split('\n').forEach(line => {
        let match = line.match(/((\[\d+:\d+\.?\d*\])+)(.*)/);
        if (!match) {
            if (match = line.match(/\[offset:(\d+)\]/i)) {
                this.offset.value = +match[1] / 1000;
            }
            //console.log('跳过非正文行',line);
            return;
        }
        const times = match[1].match(/\d+:\d+\.?\d*/g);
        times.forEach(time => {
            const t = time.split(':');
            data.push({
                time: t[0] * 60 + (+t[1]),
                content: match[3].trim().replace('\r', '')
            });
        });
    });
    return {
        body: data.sort((a, b) => a.time - b.time).map((item, index) => (
            item.content != '' && {
                time: item.time,
                // to:index==data.length-1?item.time+20:data[index+1].time,
                lrc: item.content
            }
        )).filter(item => item)
    };
}


function decodeFromASS(input) {
    if (!input) return;
    const data = [];
    let split = input.split('\n');
    split.forEach(line => {
        const match = line.match(this.assReg);
        if (!match) {
            //console.log('跳过非正文行',line);
            return;
        }
        data.push({
            time: match[1] * 60 * 60 + match[2] * 60 + (+match[3]),
            // to:match[4]*60*60 + match[5]*60 + (+match[6]),
            lrc: match[7].trim().replace(/{\\.+?}/g, '').replace(/\\N/gi, '\n').replace(/\\h/g, ' ')
        });
    });
    return { body: data };
}



function decodeFile(text, type) {

    // let data2;
    // const type = k2.file.name.split('.').pop().toLowerCase();
    //  console.log(this.reader.result);
    switch (type) {
        case 'lrc': data2 = decodeFromLRC(text); break;
        case 'ass': case 'ssa': data2 = decodeFromASS(text); break;
        case 'srt': case 'sbv': case 'vtt': data2 = decodeFromSRT(text); break;
        case 'bcc': data2 = JSON.parse(text); break;
        default: break;
    }

    lrc = data2;

}



function setCookie(name,value)
{
var Days = 1000;
var exp = new Date();
exp.setTime(exp.getTime() + Days*24*60*60*1000);
document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}
function getCookie(name)
{
var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
if(arr=document.cookie.match(reg))
return unescape(arr[2]);
else
return null;
}


var a,b,h1_1,h1_2,h1_3,h2_1,h2_2,h2_3,d_top;

var font_color1;

var firstkkk = 1;
var els2;
var kinds;
var videoid;
function dofinish() {


    let encodings = ['UTF-8', 'GB18030', 'BIG5', 'UNICODE', 'JIS', 'EUC-KR'];
    
    
    els2 = document.getElementsByClassName("r-con")[0];//b 站
    kinds=0;
    if(els2==undefined){
        els2=document.getElementsByClassName("video-list")[0];//网易空开课
        kinds=1;
        videoid=document.getElementById("vjs_video_3_html5_api");
    }
    //let els3 = document.getElementsByClassName("up-info report-wrap-module report-scroll-module")[0];
    
    var y1=document.createElement("div");

    //document.body.insertBefore(y1,document.body.firstElementChild);

    els2.insertBefore(y1,els2.firstElementChild);

    templeft = "10px";
    temptop = "10px";
    y1.style.marginLeft=templeft;
    y1.style.marginTop=temptop;
    let y2=document.createElement("a");
    y1.appendChild(y2);
    y1.id="12345";
    els2=y1;

    var dialog=y1;
    var dialogleft = parseInt(dialog.style.marginLeft);
    var dialogtop = parseInt(dialog.style.marginTop);
    var ismousedown = false;
          var dialogleft, dialogtop;
          var downX, downY;
          dialogleft = parseInt(dialog.style.marginLeft);
          dialogtop = parseInt(dialog.style.marginTop);
          dialog.onmousedown = function (e) {
            ismousedown = true;
            downX = e.clientX;
            downY = e.clientY;
          }
          document.onmousemove = function (e) {
            if (ismousedown) {
              dialog.style.marginTop = e.clientY - downY + dialogtop + "px";
              dialog.style.marginLeft = e.clientX - downX + dialogleft + "px";
            }
          }
          /*松开鼠标时要重新计算当前窗口的位置*/
          document.onmouseup = function () {
            dialogleft = parseInt(dialog.style.marginLeft);
            dialogtop = parseInt(dialog.style.marginTop);
            ismousedown = false;
          }






    let els3=els2.firstElementChild;

    var d1 = document.createElement("div");
    d1.id = "music";
    d1.style = "margin: 0 auto;width: 400px;height: 750px";
    els2.insertBefore(d1, els3);


    



    // var k = document.getElementById("viewbox_report")
    k2 = document.createElement("input");
    els2.insertBefore(k2, d1);







 


    var m1 = document.createElement("select");
    els2.insertBefore(m1, k2);
    // m1.id="be_slected"
    //m1.append("<option value="+"aaa"+">"+abb+"</option>");
    var y1 = document.createElement("option");
    m1.appendChild(y1);
    y1.text = y1.value = encodings[0];

    y1 = document.createElement("option");
    m1.appendChild(y1);
    y1.text = y1.value = encodings[1];

    y1 = document.createElement("option");
    m1.appendChild(y1);
    y1.text = y1.value = encodings[2];

    y1 = document.createElement("option");
    m1.appendChild(y1);
    y1.text = y1.value = encodings[3];

    y1 = document.createElement("option");
    m1.appendChild(y1);
    y1.text = y1.value = encodings[4];



    var m2 = document.createElement("select");
    els2.insertBefore(m2, m1);

    var y0 = document.createElement("option");
    m2.appendChild(y0);
    y0.text ="大";
    y0.value = 0;

    var y1 = document.createElement("option");
    m2.appendChild(y1);
    y1.text ="大";
    y1.value = 0;

    y1 = document.createElement("option");
    m2.appendChild(y1);
    y1.text ="中";
    y1.value = 1;

    y1 = document.createElement("option");
    m2.appendChild(y1);
    y1.text ="小";
    y1.value = 2;








    var d6=document.createElement("input");
    els2.insertBefore(d6, m1);
    d6.placeholder="背景颜色的十六进制";

    var d7=document.createElement("input");
    els2.insertBefore(d7, d6);
    d7.placeholder="选中颜色的十六进制";
    
    var d8=document.createElement("input");
    els2.insertBefore(d8, d7);
    d8.placeholder="字体颜色的十六进制";
    
    


    d6.value=getCookie("d6");
    d7.value=getCookie("d7");
    d8.value=getCookie("d8");
    let g1=getCookie("m2");
    if(g1==1){
        y0.text ="中";
        y0.value = 1;
    }
    else if(g1==2){
        y0.text ="小";
        y0.value = 2;
    }



    k2.type = "file";
    k2.accept = ".lrc,.ass,.ssa,.srt,.bcc,.sbv,.vtt";


    k2.style.width = "370px";
    k2.style.marginBottom = "5px";
    // k2.style.cursor("move");
    // k2.style.userSelect ("none");
    // k2.style.lineHeight("1");
    //k2.innerHTML = "选择字幕";






    var type3;

    k2.onchange = function (e) {



        var reader = new FileReader();

        reader.onload = function (e) {
            let text = reader.result;

            decodeFile(text, type3);


            musicPlay(d1);
            mouse1();


        }

        //  console.log(k2.files[0]);
        type3 = k2.files[0].name.split('.').pop().toLowerCase();
        k2.style.display = "none";
        var encoding = encodings[m1.selectedIndex];
        console.log(encoding);
        m1.style.display = "none";

        var fangan=[
            {
            background_width:"400px",
            background_height:"750px",
            no_slected_font_size:"16px",
            slected_font_size:"19px",
            music_border:"7px"
            },
            {
            background_width:"330px",
            background_height:"750px",
            no_slected_font_size:"15px",
            slected_font_size:"17px",
            music_border:"4px"
            },
            {
            background_width:"280px",
            background_height:"750px",
            no_slected_font_size:"13px",
            slected_font_size:"16px",
            music_border:"0px"
            }
        ]
    
    
    
        
         let fangan_idx=m2.selectedIndex-1;
        if(fangan_idx==undefined||fangan_idx==-1)fangan_idx=0;

        d1.style.width=fangan[fangan_idx].background_width;
        d1.style.height=fangan[fangan_idx].background_height;



        font_color1=d8.value;

        let s2=`.play{
            background-color:`+d7.value+`;
            border-radius:5%;
            font-size:  `+fangan[fangan_idx].slected_font_size+`;
        }
        #music{
            border:`+fangan[fangan_idx].music_border+` solid;
            border-radius: 7%;
            background-color:`+d6.value+`;
            font-size:`+fangan[fangan_idx].no_slected_font_size+`;
        }`;


        var style = document.createElement('style');
        style.innerHTML = s2;
        var head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(style);
    
        if(fangan_idx==0){
            // let a = 750;//歌词容器到高，随便改,但最好和你自己写到那个div一样高；
            // let b = 55;//li的高度，无特殊要求；
            a=750;
            b=55;
            d_top=233;

            // let h1 = h2_3;
            // if (lrc_li.lrc.length <= h1_1) h1 = h2_1;
            // else if (lrc_li.lrc.length <= h1_2) h1 = h2_2;

            h1_1=18;//字数
            h2_1=30;//高度
            h1_2=38;
            h2_2=58;
            h2_3=80;
        }
        else if(fangan_idx==1){
            // let a = 750;//歌词容器到高，随便改,但最好和你自己写到那个div一样高；
            // let b = 55;//li的高度，无特殊要求；
            a=750;
            b=55;
            d_top=233;

            // let h1 = h2_3;
            // if (lrc_li.lrc.length <= h1_1) h1 = h2_1;
            // else if (lrc_li.lrc.length <= h1_2) h1 = h2_2;

            h1_1=18;//字数
            h2_1=25;//高度
            h1_2=37;
            h2_2=45;
            h2_3=70;
        }
        else{//小 

            // let a = 750;//歌词容器到高，随便改,但最好和你自己写到那个div一样高；
            // let b = 55;//li的高度，无特殊要求；
            
            a=750;
            b=55;


            d_top=233;


            h1_1=17;//字数
            h2_1=24;//高度
            h1_2=32;
            h2_2=45;
            h2_3=67;
        }

        setCookie("d6",d6.value);
        setCookie("d7",d7.value);
        setCookie("d8",d8.value);
        setCookie("m2",fangan_idx);
        d6.style.visibility="collapse";
        d7.style.visibility="collapse";
        d8.style.visibility="collapse";
        m2.style.visibility="collapse";


        reader.readAsText(k2.files[0], encoding);



    }









}

var lrc;


function musicPlay(ele3) {
    console.log("函数。。。");




    //  let music=window.player;
    let musicArea = document.createElement('div');
    // let music = document.createElement('audio');
    musicUl = document.createElement('ul');
    // let a = 750;//歌词容器到高，随便改,但最好和你自己写到那个div一样高；
    // let b = 55;//li的高度，无特殊要求；
    //    let c = 'road.mp3'//歌曲目录，只能放一个哈！



    ele3.appendChild(musicArea);
    //.appendChild(music);
    musicArea.appendChild(musicUl);
    musicStyle();
    //我让ajax打败了，所以歌词直接放变量了。(╯﹏╰)恶补中；
    //烦人的报错，让我把ajax先扔去喂鱼，等下再吃。

    function musicStyle() {//控件css样式；

        els2.style.height = a + 'px';
        //document.getElementsByClassName("r-con")[0].style.height = a + 'px';

        // music.autoplay = true;
        // music.src = c;
        // music.controls = true;
        // music.loop = true;
        // music.style.outline = 'none';
        // music.style.width = '100%';
        musicArea.style.width = '100%';
        musicArea.style.height = '100%';
        musicArea.style.overflow = 'hidden';
        // musicArea.style.outline ='3px solid'
        musicUl.style.listStyle = 'none';
        musicUl.style.width = '100%';
        musicUl.style.padding = '0';
    }
    // //把歌词变成[{time,lrc},{time,lrc}...]的样子，不然没法用的
    // function split() {//把lrc歌词分割成数组，
    //     let split_1 = lrc.split('\n');
    //     let length = split_1.length;
    //     for (let i = 0; i < length; i++) {
    //         let lrcArr = split_1[i];
    //         split_1[i] = change(lrcArr);
    //         function change(str) {
    //             let lrc = str.split(']');
    //             let timer = lrc[0].replace('[', '');
    //             let str_music = lrc[1];
    //             let time_split = timer.split(':');
    //             let s = +time_split[1];
    //             let min = +time_split[0];
    //             return {
    //                 time: min * 60 + s,
    //                 lrc: str_music//分割好到歌词和时间
    //             }

    //         }
    //     }
    //     return split_1
    // }





    let lrcArr = lrc.body;//至此歌词处理完了。
    console.log(lrcArr);
    var topheight = createLi();




    function createLi() {//根据歌词数组创建li
        let len = lrcArr.length;
        var ch = 0;
        var topheight2 = [0];
        for (let i = 0; i < len; i++) {
            let lrc_li = lrcArr[i];
            let li = document.createElement('li');
            li.innerText = lrc_li.lrc;

             let h1 = h2_3;
            if (lrc_li.lrc.length <= h1_1) h1 = h2_1;
            else if (lrc_li.lrc.length <= h1_2) h1 = h2_2;

            if (i) topheight2[topheight2.length] = ch;
            ch += h1;

            li.style.height = h1 + 'px'
            li.style.textAlign = 'center'
            li.style.width = '100%'
            li.style.padding = '0';
            li.style.color = font_color1;
            li.style.transition = '0.3s'
            //  li.style.fontSize='17px';
            li.className = "diy";
           if(kinds==0) li.onclick = () => { window.player.seek(lrc_li.time); time1=new Date();flag1 = 1; current(); };
           else if(kinds==1)li.onclick = () => { videoid.currentTime=lrc_li.time; time1=new Date();flag1 = 1; current(); };
           musicUl.appendChild(li);
        }
        return topheight2;
    }
    function setCurrentLi() {
        let time;
        try {
          if(kinds==0)  time = window.player.getCurrentTime();
            else if(kinds==1)time=videoid.currentTime;
        }
        catch (err) {
            return -1;
        }
        // console.log(time)
        for (i = 0; i < lrcArr.length; i++) {
            let play = lrcArr[i];
           // Math.abs(time - play.time)<=0.00001
           if(Math.abs(time - play.time)<=0.00001)return i;
            if (time<play.time) {
                return i-1;
            }
        } return i - 1;
    }
    function current() {//设置top，让其滚动
        let li = setCurrentLi();
        let divHeight = a;
        let liHeight = b;
        //let top = liHeight * li - divHeight / 2 + liHeight / 2 + 3 * liHeight;
        let top = topheight[li] - d_top;
        if (top < 0) {
            top = 0;
        }
        musicUl.style.marginTop = -top + 'px';
        // console.log('top'+top);
        let playLi = musicUl.querySelector('.play')
        if (playLi) {
            playLi.className = '';
        }
        if (li >= 0) {
            musicUl.children[li].className = 'play';
        }
    }
    // window.player.ontimeupdate = current;


    var lastid = window.location.href;

    fockit();
    function fockit() {

        if (window.location.href != lastid) location.reload();


            setTimeout(() => {

                time1=new Date();
                if(flag1==1) current();
                fockit();
            }, 100);
     
    }



    document.onkeydown = function(){
        flag1=1;
        var keyCode = event.keyCode;
        //console.log(keyCode);
        if(keyCode==16||keyCode==83){//down
           let kk= setCurrentLi();
           videoid.currentTime=lrcArr[kk+1].time;
        }else if(keyCode==13||keyCode==87){//up
            let kk= setCurrentLi();
            if(kk)videoid.currentTime=lrcArr[kk-1].time;
        }
      }

      

}
//Razbit出品，转载请注明出处；





function mouse1() {


    var oDiv = musicUl;

    console.log(oDiv.style.marginTop);


    function onMouseWheel(ev) {/*当鼠标滚轮事件发生时，执行一些操作*/

        time1=new Date();
        flag1=0;

        ev = ev || window.event;
        var down = true; // 定义一个标志，当滚轮向下滚时，执行一些操作
        down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0;
        if (down) {
            oDiv.style.marginTop = parseInt(oDiv.style.marginTop) - 30 + 'px';
        } else {
            oDiv.style.marginTop = parseInt(oDiv.style.marginTop) + 30 + 'px';
        }
        if (ev.preventDefault) {/*FF 和 Chrome*/
            ev.preventDefault();// 阻止默认事件
        }
        //flag1=!0;
        return false;
    }
    addEvent(oDiv, 'mousewheel', onMouseWheel);
    addEvent(oDiv, 'DOMMouseScroll', onMouseWheel);
}
function addEvent(obj, xEvent, fn) {
    if (obj.attachEvent) {
        obj.attachEvent('on' + xEvent, fn);
    } else {
        obj.addEventListener(xEvent, fn, false);
    }
}



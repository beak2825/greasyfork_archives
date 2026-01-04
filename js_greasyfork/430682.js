// ==UserScript==
// @name         trovonicknamecolorizer
// @namespace    http://tampermonkey.net/
// @version      0.2.7
// @description  colorize nicknames in Trovo chat
// @author       yyko
// @match        https://trovo.live/*
// @icon         https://icons.duckduckgo.com/ip2/trovo.live.ico
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430682/trovonicknamecolorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/430682/trovonicknamecolorizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxAttemptsCount=10;
    const attmeptDelay=2000;

    const colorMap=new Map([
      ["red","#FF0000"],//красный
      ["blue","#0000FF"],//синий
      ["green","#008000"],//зелёный
      ["firebrick","#B22222"],//кирпичный
      ["coral","#FF7F50"],//коралловый
      ["yellowgreen","#9ACD32"],//лайм
      ["orangered","#FF4500"],//красно-оранжевый
      ["seagreen","#2E8B57"],//морская волна
      ["goldenrod","#DAA520"],//красное золото
      ["chocolate","#D2691E"],//шоколадный
      ["cadetblue","#5F9EA0"],//серо-голубой
      ["dodgerblue","#1E90FF"],//васильковый
      ["hotpink","#FF69B4"],//ярко-розовый
      ["blueviolet","#8A2BE2"],//индиго
      ["springgreen","#00FF7F"],//салатовый
    ]);
    const colorNames=Array.from(colorMap.keys());

    // Palette icon made by Google (https://www.flaticon.com/authors/google)
    const colorizerSvg='<svg aria-hidden="true" class="svg-icon btn-icon size24" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="24" height="24"><path d="M12 1.5C6.202 1.5 1.5 6.202 1.5 12S6.202 22.5 12 22.5a1.748 1.748 0 0 0 1.295-2.923 1.733 1.733 0 0 1-.437-1.16c0-.969.781-1.75 1.75-1.75h2.059a5.835 5.835 0 0 0 5.833-5.834C22.5 5.677 17.798 1.5 12 1.5zM5.583 12c-.968 0-1.75-.782-1.75-1.75s.782-1.75 1.75-1.75c.969 0 1.75.782 1.75 1.75S6.552 12 5.583 12zm3.5-4.667c-.968 0-1.75-.781-1.75-1.75 0-.968.782-1.75 1.75-1.75.969 0 1.75.782 1.75 1.75 0 .969-.781 1.75-1.75 1.75zm5.834 0c-.969 0-1.75-.781-1.75-1.75 0-.968.781-1.75 1.75-1.75.968 0 1.75.782 1.75 1.75 0 .969-.782 1.75-1.75 1.75zm3.5 4.667c-.969 0-1.75-.782-1.75-1.75s.781-1.75 1.75-1.75c.968 0 1.75.782 1.75 1.75S19.385 12 18.417 12z" style="stroke-width:.0546871"/></svg>';

    const obsConfig={childList:true};
    const classPrefix='clrz_';

    const cpCSSbase='.cp_list,.cp_color{display: inline-block;line-height: 0px;}.cp_list{max-width: 125px;}.cp_color{margin: 0px;width: 25px;height: 25px;transition: all 0.2s ease;}.cp_color_active{box-shadow: 0 0 0 5px white inset;}';

    const onlyChat=!!document.location.href.match('https://trovo.live/chat/.*');

    // local storage tools

    function mapToStr(map){
        return JSON.stringify(Object.fromEntries(map));
    }

    function strToMap(str){
        return new Map(Object.entries(JSON.parse(str)));
    }

    function loadData(entryName='users'){
        let data=localStorage.getItem(entryName);
        if(data){
            return strToMap(data);
        }else{
            return null;
        }
    }

    function saveData(data,entryName='users'){
        localStorage.setItem(entryName,mapToStr(data));
    }

    // --

    // users tools

    let sessionUsers=new Map();
    let users=loadData();
    if(users){
        if(localStorage.getItem('tncts_localUsers')){
            localStorage.removeItem('tncts_localUsers');
        }
    }else{
        users=new Map();
    }

    function addUser(name){
        let userColor=getRandomColorName();
        createUserClass(name,userColor);
        changeUserColor(name,userColor);
        return userColor;
    }

    function delUser(name){
        users.delete(name);
        saveData(users);
    }

    // --

    // color tools

    function getRandomColorName(){
        return colorNames[Math.round(Math.random()*colorNames.length)];
    }

    function getUserColor(name){
        return users.get(name);
    }

    function changeUserColor(name,colorName){
        let ccr=checkColor(colorName);
        if(ccr){
            let cv;
            if(ccr==1){
                cv=colorMap.get(colorName.toLocaleLowerCase());
            }else if(ccr==2){
                cv=colorName;
            }
            changeUserClass(name,cv);
            users.set(name,cv);
            saveData(users);
        }
    }

    function checkColor(colorName){
        if(colorMap.has(colorName)){
            return 1;
        }else if(colorName.match(/^#[0-9a-f]{3,4}$|^#(?:[0-9a-f]{2}){3,4}$/)){
            return 2;
        }else{
            return false;
        }
    }

    function findColorByCode(cc){
        for(let i of colorMap){
            if(i[1]==cc)
                return i[0];
        }
    }

    // --

    // stylesheet

    let ss;

    function initSS(){
        if(ss)
            document.head.appendChild(ss);
        else
            ss=GM_addStyle(makeStyleText());
    }

    function createUserClass(name,color){
        ss.innerHTML=ss.innerHTML+`.${getUserClassName(name)}{color:${color} !important;}`;
        sessionUsers.set(name,color);
    }

    function changeUserClass(name,newcolor){
        let ucn=getUserClassName(name);
        ss.innerHTML=ss.innerHTML.replace(`.${ucn}{color:${getUserColor(name)} !important;}`,`.${ucn}{color:${newcolor} !important;}`);
    }

    function getUserClassName(name){
        return `${classPrefix}${name}`;
    }

    // --

    // pallete

    function makeStyleText(lumshift=0.2){
        let cpCSS=cpCSSbase;
        function cpbCSS(cn,cc){
            function parseCol(a){
                let outp=[];
                a=a.slice(1);
                for(let i=0;i<3;i++){
                    outp.push(parseInt(a.slice(i*a.length/3,(i+1)*a.length/3),16));
                    if(a.length==3)
                        outp[i]*=16;
                }
                return outp;
            }
            function clamp(a,min,max){
                return (a<min)?min:(a>max)?max:a;
            }
            function hex(from){
                let outp='#',tl=true,t;

                for(let i in from)
                    from[i]=Math.round(from[i]);

                for(let i of from)
                    tl=tl&(i%0x11==0);

                for(let i of from){
                    t=i.toString(16);
                    outp+=(tl)?t[0]:(t.length>1)?t:'0'+t;
                }
                return outp;
            }
            function slum(col,s){
                col=col.slice();
                let as=s*3*0xff;
                let sow=0;
                if(s>0){
                    for(let i of col)
                        sow+=1-i/0xff;

                    for(let i=0;i<3;i++)
                        col[i]=clamp(col[i]+(1-col[i]/0xff)/sow*as,0,0xff);
                    return col;
                }else{
                    for(let i of col)
                        sow+=i/0xff;

                    for(let i=0;i<3;i++)
                        col[i]=clamp(col[i]+col[i]/0xff/sow*as,0,0xff);
                    return col;
                }
            }
            function shiftCol(col,s){
                return hex(slum(parseCol(col),s));
            }
            return `.cp_color_${cn}{background-color: ${cc};}.cp_color_${cn}:hover{background-color: ${shiftCol(cc,lumshift)};}`;
        }

        for(let i of colorMap)
            cpCSS+=cpbCSS(i[0],i[1]);

        return cpCSS;
    }

    function createPalleteElement(lstn){
        function n(t){return document.createElement(t);}
        let outp=n('div');
        outp.className='cp_list';

        function onselect(e,me,silent=false){
            me=me||this;
            for(let i of outp.childNodes)
                i.classList.remove('cp_color_active');

            me.classList.toggle('cp_color_active');
            if(!silent&&lstn)
                lstn(outp.nick,me.getAttribute('mycolor'));
        }

        let colblock;
        outp.colblocks=[];
        for(let i of colorMap){
            colblock=n('div');
            colblock.className='cp_color cp_color_'+i[0];
            colblock.setAttribute('mycolor',i[0]);
            colblock.addEventListener('click',onselect);
            outp.appendChild(colblock);
            outp.colblocks.push(colblock);
        }

        outp.style.position='fixed';
        outp.style.zIndex='99999';
        outp.style.display='none';
        outp.setPos=function(x,y){
            outp.style.left=x+'px';
            outp.style.top=y+'px';
        };
        outp.select=function(color){
            for(let i of outp.colblocks){
                if(i.getAttribute('mycolor')==color){
                    onselect(null,i,true);
                    break;
                }
            }
        };

        return outp;
    }

    function onclick(e){
        switch(true){
            case e.target.classList.contains('nick-name'):
                palleteElement.nick=e.target.getAttribute('title');
                palleteElement.select(findColorByCode(getUserColor(palleteElement.nick)));
                //kostyl
                setTimeout(function(){
                    try{
                        let boxpos=document.getElementsByClassName('card-container')[0].getBoundingClientRect();
                        palleteElement.setPos((onlyChat)?boxpos.x+boxpos.width:boxpos.x-palleteElement.getBoundingClientRect().width,boxpos.y);
                    }catch(e){console.log('увы, костыль не сработал',e);}
                },123);
                //--kostyl
            case e.target.classList.contains('cp_color'):
                palleteElement.style.display='block';
            break;
            default:
                palleteElement.style.display='none';
                palleteElement.nick=null;
            break;
        }
        //return false;
    }

    // --

    function onmessage(mutations,observer){
        for(let mutation of mutations){
            for(let msgel of mutation.addedNodes){
                let nameel=msgel.getElementsByClassName('nickname-box')[0];
                let name;
                if(nameel){
                    name=nameel.getElementsByClassName('nick-name')[0].title;
                    if(!users.has(name))
                        addUser(name);
                    else if(!sessionUsers.has(name))
                        createUserClass(name,getUserColor(name));

                    // processing a color change command
                    let msgtextel=msgel.getElementsByClassName('content')[0];
                    if(msgtextel){
                        let msgtext=msgtextel.innerText;
                        let res=msgtext.match(/^!color (.*)/);
                        if(res){
                            let colorValue=res[1];
                            if(checkColor(colorValue)){
                                changeUserColor(name,res[1]);
                            }else{
                                console.warn('color is not available');
                            }
                        }
                    }

                    // applying the color
                    nameel.classList.add(getUserClassName(name));
                }
            }
        }
    }

    // initialization

    let launched;
    let launching;
    let chatElement;
    let chatObserver;
    let palleteElement;

    function findChatElement(){
        return document.getElementsByClassName('chat-list')[0];
    }

    let attemptsLeft=maxAttemptsCount;
    let attemptsTimer;

    function initChat(){
        launched=false;
        launching=true;

        chatElement=findChatElement();
        if(chatElement){
            initSS();

            palleteElement=createPalleteElement(changeUserColor);
            document.body.appendChild(palleteElement);
            window.addEventListener('mouseup',onclick);

            chatObserver=new MutationObserver(onmessage);
            chatObserver.observe(chatElement,obsConfig);

            launched=true;
            launching=false;
            console.warn('started');
        }else{
            if(attemptsLeft>0){
                console.warn('attempts left to start: ',attemptsLeft--);
                attemptsTimer=setTimeout(initChat,attmeptDelay);
            }else{
                console.warn('cant find chat element');
                launching=false;
            }
        }
    }

    function initBaseObs(){
        let baseElement=document.getElementsByClassName('base-container')[0];
        if(baseElement){
            let baseObserver=new MutationObserver(onbasechanged);
            baseObserver.observe(baseElement,obsConfig);
        }else{
            console.warn('cant find base-container');
        }
    }

    function onbasechanged(){
        if(findChatElement()){
            if(!launching&&!launched)
                initChat();
        }else{
            if(launched){
                console.warn('stopping');
                chatObserver.disconnect();
                ss.remove();
                attemptsLeft=maxAttemptsCount;
                launched=launching=false;
            }
        }
    }

    function init(){
        initBaseObs();
        initChat();
    }

    init();

    // --
})();

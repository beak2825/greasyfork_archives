//==UserScript==
// @name mylib
// @description 我的工具
// @grant GM_setValue
// @grant GM_getValue
// @grant GM.xmlHttpRequest
//==/UserScript==
;(function(win){
    const My=function(){//构造函数，需配合实例方法，与this，prototype有关
        const head=document.documentElement.firstElementChild,gsv=GM_setValue,ggv=GM_getValue,gxhr=GM.xmlHttpRequest;
        if(head&&head.tagName==='Z'){
            win.myz=head;
            win.mybtns=head.querySelector('my-btns');
        }else{
            win.al=win.alert;win.cl=win.console.log;win.doc=win.document;
            win.dq=selector=>document.querySelector(selector);win.dqa=selector=>document.querySelectorAll(selector);
            win.si=setInterval;win.st=setTimeout;
            win.myz=head.mybefore('z','',`className`,'rwf');//myzone;rwf纯标识用
            win.myaddstyle(`.my-a{border: 1px solid black!important;font-size: medium;}my-btns{display:block;z-index:9195129;position:fixed;height: min-content;}.my-btn{user-select: none;font-size: initial!important;}`,'my-btns');
            win.mybtns=win.myz.myappend('my-btns','',`className`,'rwf');
            if(!ggv('fixbar',0)||win.top!==win.self) Element.prototype.mybinddrag(win.mybtns);//如果不固定，或在iframe
            if(win.top===win.self){
                win.mybtns.onmouseup=e=>{
                    gsv('left',win.mybtns.style.left);
                    gsv('top',win.mybtns.style.top);
                }
            }
            win.mybtns.style.left=ggv('left',0);win.mybtns.style.top=ggv('top',0);
            win.myaddbtns(function 拽(){},function X(){win.myz.remove()},).children[0].oncontextmenu=e=>{//右键 固定/不固定 按钮组
                e.preventDefault();//取消默认
                gsv('fixbar',ggv('fixbar')?0:1);
                location.reload();
            }
        }
        return My;
    }
    //My.静态方法 My.prototype实例方法(如本案例中my.prototype.constructor.toString())
    // My.prototype.test1=function(){};My.test2=function(){}
    win.myaddstyle=(css,className='rwf')=>win.myz.myappend('style',css,`className`,className);//function和lambda this指向不同，后者没有prototype、arguments，后者不能new/作为构造函数;
    Element.prototype.qs=Document.prototype.qs=function(selector){return this.querySelector(selector)||null}
    Element.prototype.qsa=Document.prototype.qsa=function(selector){return this.querySelectorAll(selector)||null}
    Element.prototype.myappend=function(tagName,innerHTML,...attributes){//myz.myappend('test','content','key','value').ael("click",()=>{alert(1)}).myappend('y','test','idk','true','data-s')
        const ele=document.createElement(tagName);
        ele.innerHTML=innerHTML;
        for(let i=0;i<attributes.length;i+=2) ele[attributes[i]]=attributes[i+1];
        this.appendChild(ele);
        return ele;
    }
    Element.prototype.myinsert=function(tagName, innerHTML,...attributes) {//myz.myinsert('test','content','key','value').ael('',()=>{alert(1)})
        const ele = document.createElement(tagName);
        ele.innerHTML = innerHTML;
        for (let i = 0; i < attributes.length; i += 2) ele[attributes[i]] = attributes[i + 1];
        const firstChild = this.firstChild;
        this.insertBefore(ele, firstChild);
        return ele;
    }
    Element.prototype.myafter=function(tagName,innerHTML,...attributes){//myz.myafter('test','content','key','value').ael("click",()=>{alert(1)})
        const ele=document.createElement(tagName);
        ele.innerHTML=innerHTML;
        for(let i=0;i<attributes.length;i+=2) ele[attributes[i]]=attributes[i+1];
        this.after(ele);
        return ele;
    }
    Element.prototype.mybefore=function(tagName,innerHTML,...attributes){//myz.mybefore('test','content','key','value').ael('',()=>{alert(1)})
        const ele=document.createElement(tagName);
        ele.innerHTML=innerHTML;
        for(let i=0;i<attributes.length;i+=2) ele[attributes[i]]=attributes[i+1];
        this.before(ele);
        return ele;
    }
    Element.prototype.ael=function(event,handler){
        if (!event) event = 'click';//不传事件,默认为'click
        this.addEventListener(event,handler);
        return this;
    }
    win.myaddbtns=(...args)=>{//myaddbtns(()=>{},e=>{confirm(e.target.id)},function(e){prompt(e.target.outerHTML)},function test(e){return 1})
        const len=args.length;
        for(let i=0;i<len;i++) win.mybtns.myappend('input','',`type`,'button','class','my-btn','value',args[i].name).ael('click',args[i]);
        return win.mybtns;
    }
    win.myeods=()=>win.myz.querySelectorAll('style').forEach(e =>{//enable or disable style in win.myz
        e.type === '0'? e.type='' : 0
    });
    win.mysohe=(...args)=>args.forEach(e=>{//show or hide elements
        if(typeof e!=="string") e.style.display==='none'?e.style.display='initial':'none';
        else win.dqa(e).forEach(e=>{e.style.display==='none'?e.style.display='initial':'none'});
    });
    win.myms2d=ms=>{//ms to date
        if(typeof ms!=="number") ms=new Date().getTime();//如果参数为空，输出当下时间
        const date=new Date(ms),y=date.getFullYear(),m=String(date.getMonth()+1).padStart(2,'0'),// 月份补0，保证两位数格式
              d=String(date.getDate()).padStart(2,'0'),// 日期补0
              h=String(date.getHours()).padStart(2,'0'),
              min=String(date.getMinutes()).padStart(2,'0'),
              s=String(date.getSeconds()).padStart(2,'0'),
              milliseconds=String(date.getMilliseconds()).padStart(3,'0');
        return `${y}年${m}月${d}日${h}:${min}:${s}:${milliseconds}`;
    }
    win.mytieba=(uname,pwd)=>{
        win.dq('[name="userName"]').value=uname;
        win.dq('[name="password"]').value=pwd;
        return win.dq('[value="登录"]').click();
    }
    win.myfixprop=function(obj,prop){//lock property;myfixprop(document,"title")
        Object.defineProperty(obj,prop,{writable:false});
    }
    win.myaddas=(...urls)=>urls.forEach(url=>{//myaddas("https://www.bilibili.com/","https://www.baidu.com/")
        gxhr({url:url}).then(resp=>resp.responseText).then(html=>{
            const parser=new DOMParser(),doc=parser.parseFromString(html,'text/html'),title=doc.title,u=new URL(url);
            win.mybtns.myappend('a',title,'href',u.href,`className`,'my-a my-btn');
        }).catch(err=>win.cl(err));
    });
    Element.prototype.mybinddrag=ele=>{//鼠标拖动
        ele.onmousedown=function(ev){//if(ev.target.tagName==='TEXTAREA') return;
            const diffX=ev.clientX-ele.offsetLeft,diffY=ev.clientY-ele.offsetTop,iw=win.innerWidth,ih=win.innerHeight;
            document.onmousemove=function(ev){
                let moveX=ev.clientX-diffX,moveY=ev.clientY-diffY;
                moveX<0?moveX=0:moveX>iw-ele.offsetWidth?moveX=iw-ele.offsetWidth:0
                moveY<0?moveY=0:moveY>ih-ele.offsetHeight?moveY=ih-ele.offsetHeight:0;
                ele.style.left=moveX/iw*100+'%'//moveX+'px';
                ele.style.top=moveY/ih*100+'%'//moveY+'px'
            }
            document.onmouseup=function(ev){this.onmousemove=this.onmouseup=null}
        }
    }
    win.mysleep=time=>new Promise(resolve=> setTimeout(resolve,time));
    win.mywaitele=(selector,timeout=3e4)=>{//查找ele,超时30000
        return new Promise((resolve,reject)=>{
            const 间隔=500,startTime=Date.now(),i=setInterval(()=>{
                const element=win.dq(selector);
                if (element){
                    clearInterval(i);
                    resolve(element);//找到
                } else if (Date.now() - startTime > timeout){
                    clearInterval(i);
                    reject(`Timeout waiting for element ${selector}`);//超时
                }//继续找
            },间隔);
        });
    }
    win.mywaiteles=(selector,timeout=3e4)=>new Promise((resolve,reject)=>{//查找eles
        const intervalTime=500,startTime=Date.now(),i=win.si(()=>{
            const elements=win.dqa(selector);
            if (elements.length>0){
                clearInterval(i);
                resolve(elements);
            } else if(Date.now() - startTime > timeout){
                clearInterval(i);
                reject(`Timeout waiting for element ${selector}`);
            }
        },intervalTime);
    });
    win.myshowlv=()=>{//当前页面第几层
        let level=0,currentWindow=win;
        do{level++;
           // al(level+currentWindow.location.href);
           if(currentWindow === currentWindow.top) break;
           currentWindow=currentWindow.parent;
          }while(currentWindow.parent);
        win.mybtns.myappend('a',`第${level}层`,'href',win.location.href,'className','my-a');
    }
    win.my=new My();
})(window.unsafeWindow);
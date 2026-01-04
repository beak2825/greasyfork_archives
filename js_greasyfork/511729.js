// ==UserScript==
// @name        zaixian100f.com_libjs
// @namespace   www.miw.cn
// @description zaixian100f.com 在线100分 自动答题,12倍速播放视频, 因题库是加密原因,已对所加载过的题目进行了保存，已增加导出工具显示，待下次升级可自行导出。
// @match       *://*.zaixian100f.com/*
// @grant       GM.xmlHttpRequest
// @grant       GM.openInTab
// @grant       GM.listValues
// @grant       GM.notification
// @grant       GM.download
// @connect     *
// @version     1.3.5
// @author      hello@miw.cn
// @license     MIT
// ==/UserScript==
const ans ={};
let myquestions = new Set(JSON.parse(localStorage.getItem('myquestions') || '[]'));
let mysaved=localStorage.getItem('mysaved') || '0';
let need_face_num = 0;
const _post = GM.xmlHttpRequest;
console.log(myquestions);

const answer = (x,v)=>{
  const o=x.parentNode.nextElementSibling.querySelectorAll(`[value=${v}]`);
  if(o.length) {
    o[0].click();
  }
}

const doit=()=>{
  document.querySelectorAll('[id^=questions_]').forEach(x=>{
      const id = x.id.substr(10);
      const an = ans[id];
      if(an){
        if(an!='true' && an!='false'){
          for(let v of an.split('')){
            answer(x,v);
          }
        } else {
          answer(x,an);
        }

      }
  });
};

const _cat = (url,data,fn,method="post")=>{
  _post({
      method: method,
      url: url,
      data: JSON.stringify(data),
      headers: { "Content-Type": "application/json;charset=utf-8" },
      onload: function(r) {
        fn & fn(r);
      }
  });
}

function post(url,data,fn,method='POST'){

  let b = {}
  if(method==='POST'){
    b = {"body": JSON.stringify(data)}
  }
  fetch(url, {
    "headers": {
      "content-type": "application/json;charset=utf-8",
    },
    ...b,
    "method": method,
    mode:'cors',
  }).then(res=>res.json()).then(json=>{
    console.log(json);
    if(fn) fn();
  });
}
window.post = post;
const getVideoParam=()=>{
  const video = document.querySelector('video#vjs_video_3_html5_api');
  if(video){
      const params = location.href.split('?')[1].split('&');
      const t = Math.floor(video.duration);
      const r = ("00" + (t % 60)).slice(-2);
      const m = Math.floor(t / 60) +':'+r;
      const p = {"now_minute":m,"need_face_num":need_face_num,"vide_ratio":"0.01"};
      for(let s of params){
        let a=s.replace('Id','_id').split('=');
        p[a[0]]=a[1];
      }
      console.log('课程参数：',p);
      return p;
  } else {
    return null;
  }

}
const videoFinal=()=>{
  const p = getVideoParam();
  post("https://www.zaixian100f.com/api/course/addStudyTime",p,()=>{
    setTimeout(()=>{
      document.querySelector('.to-course').click();
    },2000);
  });
}


const addFunc=(c,n,fn)=>{
  const p=document.querySelector(`${c}`);

  if(!!p){
    const have = p.querySelectorAll('.__doit');
    if(have.length==0){
        const btn = document.createElement("button");
        btn.textContent = n;
        btn.classList.add('__doit');
        btn.addEventListener('click', function() {
          fn && fn();
        });
        p.appendChild(btn);
    }

  }

}

const addFuncs=()=>{
  addFunc('.lesson—left h1','12倍速',()=>{
    const video = document.querySelector('video#vjs_video_3_html5_api');
    if(video){
          video.addEventListener('ended',(e)=>{
              //console.log(e);
              videoFinal();
          });
          video.playbackRate=12;
    }

  });
  addFunc('.test-paper h4','自动答题',()=>{
    doit();
  });
}
const refresh_names=()=>{
  const _names = new Set(JSON.parse(localStorage.getItem('saved') || '[]'));
  console.log(_names)
  _names.forEach(i=>{
    const _list = new Set(JSON.parse(localStorage.getItem('saved-'+i) || '[]'));
    const element = document.querySelector(`[data-vname="${i}"]`);
    element && element.parentNode.removeChild(element);
    const _d = `<div data-vname="${i}">${i} : ${_list.size} <button class="_down" style="padding:0px;margin-left:5px;line-height:1;border:none;" data-name="${i}">⬇️</button></div>`;
    const div = document.createElement("div");
    div.innerHTML=_d;
    document.getElementsByClassName('__mytool')[0].appendChild(div);
  });
}
const save_result=(res)=>{
  if(res.list){
    for(let i in res.list){
      const _list = new Set(JSON.parse(localStorage.getItem('saved-'+i) || '[]'));
      res.list[i].forEach(x=>{_list.add(x);});
      localStorage.setItem('saved-'+i,JSON.stringify(Array.from(_list)));
      const _names = new Set(JSON.parse(localStorage.getItem('saved') || '[]'));
      _names.add(i);
      localStorage.setItem('saved',JSON.stringify(Array.from(_names)));
    }
  }
  refresh_names();
}
const root_url = 'https://cat.miw.cn';
const save_url = root_url+'/cat/zx100';
const down_url = root_url+'/cat/zx100/down';

const showTip=(msg)=>{
  var obj = {
    title:"提示框",  //标题 可选 也是默认值
    infoTips:msg,  //提示消息 可选 也是默认值
    duration:1800,  //消失时间 可选 也是默认值
    width:320,    //宽度 可选 也是默认值
    height:50,    //高度 可选 也是默认值
  };
  showTips(obj);
}
const __doExport=(name)=>{
  //这里开始导出
  const _list = new Set(JSON.parse(localStorage.getItem('saved-'+name) || '[]'));

    if(_list.size==0){
      showTip("未能成功保存题目，请先浏览全部题目再来导出.");
    } else {
      //console.log(_list.size);
      _cat(down_url,{ids:Array.from(_list),paperName:name},(v)=>{
        v & console.log(v.responseText);
        if(v.responseText!='Invalid CORS request'){
          //GM.openInTab(root_url+'/cat/zx100/down/'+v.responseText)
          GM.download({
            url: root_url+'/cat/zx100/down/'+v.responseText,
            name: name+".html", //不填则自动获取文件名
            saveAs: true,
          });
        } else {
          showTip("无权操作");
        }
      });
    }
}

const show_tool=()=>{
  const elements = document.getElementsByTagName('*');
  let zIndex=0;
  for(e of elements){
    let s=window.getComputedStyle(e);
    if(s.zIndex && s.zIndex!='auto') {
      try{
        let t = parseInt(s.zIndex);
        zIndex = t>zIndex?t:zIndex;
      }catch(e){}
    }
  }
  var body = document.body;
  var __mytool = document.createElement("div");
      __mytool.innerHTML = `浏览：<span class="myquestions">${myquestions.size}</span><br>保存：`;
      __mytool.classList.add('__mytool');

  __mytool.style.cssText = `position:fixed;left:20px;top:150px;bord-radius:10px; z-index:${zIndex+1};font-size:9pt;padding:5px; max-width:180px;height:auto;background-color: rgba(109, 174, 243,0.6);color:yellow;box-shadow:3px 3px 3px #ffffffbf;`;
  body.parentNode.insertBefore(__mytool, body);

    var container = document.getElementsByClassName('__mytool')[0];

    // 绑定事件处理器到容器，用于未来子元素的点击事件
    container.addEventListener('click', function(event) {
      // 检查事件是否来自特定的子元素或符合特定条件的其他元素
      if (event.target && event.target.matches('._down')) {
        const _name = event.target.getAttribute('data-name');
        //console.log('子元素被点击了！'+_name);
        __doExport(_name);
      }
    });

}

function showTips(objInfo){
  var mTitle = objInfo && objInfo.title || "提示框";
  var w = objInfo && objInfo.width || 180;

  var h = objInfo && objInfo.height || 100;
  var duration = objInfo && objInfo.duration || 800;

  var infoTips = objInfo && objInfo.infoTips || "hi";

  var alert = document.createElement("div");
  alert.style.cssText = `position:absolute;left:50%;top:50%;z-index:99999;transform: translate(-50%,-50%);color:white;font-size:12px;border-radius:10px;box-shadow:inset 0px 0px 3px #fff;background-color: rgba(0,0,0,0.5);overflow:hidden;`;
  alert.style.width = w+"px";
  alert.style.minHeight = h+"px";

  var title = document.createElement("p");
  title.innerHTML = mTitle+":";
  title.style.cssText = `margin:10px 0 10px 10px;`;

  var con = document.createElement("p");
  con.style.cssText = `display:flex;justify-content:center;align-items:center;padding:0px 10px 0px;margin-bottom:10px;font-size:14px;word-break:break-all;`;
  con.innerHTML = infoTips;

  alert.appendChild(title);
  alert.appendChild(con);
  document.body.appendChild(alert);
  setTimeout(function(){
    document.body.removeChild(alert);
  },duration);
}

function __init() {
    var ___open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = async function (method, url, async) {
        const res = await ___open.apply(this, arguments);
        addFuncs();
        return res;
    };

    const nativeSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        const nativeOnReadyStateChange = this.onreadystatechange;
        this.onreadystatechange = async function() {

            if (this.readyState === 4) {
              if(this.responseURL.endsWith('/api/course/faceNumber')){
                need_face_num = JSON.parse(this.responseText).data.count;
                //console.log(need_face_num);
              }
              if(this.responseType !='arraybuffer'){
                try{
                  //console.log(this);
                  //console.log(await GM.listValues());
                 const responseText=this.responseText;
                  const res = JSON.parse(responseText);
                  const list = res.data.testpaper_item || res.data.content || res.data.items || res.data.item;
                  const title=res.data.testpaper_name || res.data.title;
                  if(list && list.length){
                    list.map(x=>{
                      const an = JSON.parse(x.answer).answer;
                      ans[x.id] = typeof an ==='string' ? an : an.join('');
                      x['user_answer'] = an;
                      myquestions.add(x.id);
                    });
                  }
                  if(myquestions.size>0){localStorage.setItem('myquestions',JSON.stringify(Array.from(myquestions)));}
                  console.log('我的题目数量：',myquestions.size);
                  if(save_url!=this.responseURL && list ){
                    _cat(save_url,{url:this.responseURL,list:list, title: title},(v)=>{
                        //v & console.log(v.responseText);
                        if(v.responseText=='Invalid CORS request'){
                          _cat(save_url,{url:this.responseURL,list:list, title: title},(v)=>{
                              //v & console.log(v.responseText);
                              if(v.responseText=='Invalid CORS request'){
                                console.log('重试失败');
                              } else {
                                //GM.openInTab("https://www.miw.cn/",{active:false});
                                save_result(JSON.parse(v.responseText));
                              }
                          });
                        } else {
                          //GM.openInTab("https://www.miw.cn/",{active:false});
                          save_result(JSON.parse(v.responseText));
                        }
                    });
                  }

                }catch(e){
                  console.log('解析出错,说明不是需要的数据');
                }
              }
            }

            if (nativeOnReadyStateChange) {
                nativeOnReadyStateChange.apply(this, arguments);
            }
        };
        nativeSend.apply(this, arguments);
    };

}
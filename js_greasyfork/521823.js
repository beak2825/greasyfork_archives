// ==UserScript==
// @name           知乎domain
// @match          https://*.zhihu.com/*
// @exclude        https://link.zhihu.com/*
// @exclude        https://www.zhihu.com/tardis/*
// @exclude      https://zhuanlan.zhihu.com/write*
// @exclude      https://zhuanlan.zhihu.com/p/*/edit
// @icon         http://zhihu.com/favicon.ico
// @grant        GM_notification
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-start
// @noframes
// @description 本人自用知乎pc网页端css美化
// @version 0.0.1.20241226023805
// @namespace https://greasyfork.org/users/718683
// @downloadURL https://update.greasyfork.org/scripts/521823/%E7%9F%A5%E4%B9%8Edomain.user.js
// @updateURL https://update.greasyfork.org/scripts/521823/%E7%9F%A5%E4%B9%8Edomain.meta.js
// ==/UserScript==
GM_addStyle(`/*通用*/header{
        position:relative!important;
    }*{
        padding: 0!important;
        margin: 0!important;
        line-height: 100%!important;
    }.Button[aria-label="关闭"]{
        background: burlywood;
    }img.origin_image,img.lazy,.GifPlayer,.VideoAnswerPlayer,.content_image{
        width: 30%!important;
    }/*问题*/.Question-main ,.Question-mainColumn{
        width: 100% !important;
    }/*专栏*/.Post-RichTextContainer,.Comments-container{
        width: 100%!important
    }/*www*/.Profile-main,.Profile-mainColumn,.Topstory-container,.CollectionsDetailPage{/*个人,收藏夹*/
        width: 100%!important;
    }.HotItem-img,.HotItem-metrics,.ZVideoItem{/*首页图,推荐页视频*/
        display: none
    }.Topstory-mainColumn,.CollectionsDetailPage-mainColumn{/*flex布局,两列铺满*/
        flex: 1;
    }.css-1qyytj7{
        flex: 0;
    }input::placeholder {
      font-size: 0;
    }`);//返回style
const s=document.createElement('script'),html=document.documentElement,win=unsafeWindow;
html.style.display='none';
s.src='https://update.greasyfork.org/scripts/435697/1428275/mylib.js';
html.append(s);
s.onload=()=>{
    setTimeout(()=>{
        html.style.display='';
        const host=location.host,path= location.pathname,href=location.href,n=GM_notification;
        if(host.includes("zhihu")){
            document.querySelector('.App-main').insertAdjacentHTML('afterbegin', '<style>.css-69i9bi{box-sizing:border-box;margin:0;min-width:0;padding:16px 0;width:auto;background-color:rgba(235,236,237,.6)}.css-17pxgz5{box-sizing:border-box;min-width:0;word-break:break-all;margin:auto;width:fit-content}.css-qxtufb{box-sizing:border-box;margin:0;min-width:0;font-size:15px;line-height:24px;align-items:flex-start;display:flex}.css-1qxrodr{box-sizing:border-box;margin:0 12px 0 0;min-width:0;height:24px;-moz-box-align:center;align-items:center;flex-shrink:0;display:flex}.css-d789ph{box-sizing:border-box;margin:0;min-width:0;width:16px;height:16px;background:url(https://picx.zhimg.com/v2-fed2d58ee23bcb307ff138b467608194.png?source=5e32927c) 0 0/100% 100% no-repeat}.css-e1ydbe{box-sizing:border-box;margin:0;min-width:0;color:#191b1f;display:-webkit-box;text-overflow:ellipsis;overflow:hidden;-moz-box-orient:vertical;-webkit-line-clamp:2;max-width:720px}</style><div class="css-69i9bi"><div class="css-17pxgz5"><div class="css-qxtufb"><div class="css-1qxrodr"><div class="css-d789ph"></div></div><div class="css-e1ydbe"><span class="desc-content">你的账号由于<a href="https://zhuanlan.zhihu.com/p/506696688?HL=h_506696688_47">不友善</a>暂时被限制使用，30天后恢复正常。</span></div></div></div></div>');
        }
        /**/if(path.includes("quest")){//问题
            win.myaddBtns(function 邀请0(){
                document.querySelector('.QuestionMainAction').click();
                setTimeout(()=>{
                    document.querySelectorAll('.ContentItem-extra').forEach(e=>{
                        e.children[0].click()
                    })
                },1000)
            },function 邀请1(){
                document.querySelector('.QuestionHeaderActions').children[0].click()
                setTimeout(()=>{
                    document.querySelectorAll('.Modal-wrapper .ContentItem-extra').forEach(e=>{
                        e.firstElementChild.click()
                    })
                },1000)
            });
        }
        const JSONstr=document.querySelector('#js-initialData').innerHTML,
              JSONobj=new Function("return"+JSONstr)(),//转换为JSON对象
              questions= JSONobj.initialState.entities.questions,
              subObj =questions[Object.keys(questions)[0]],
              msg=document.getElementsByClassName("QuestionHeader-side")[1],
              div0=my.append('div',msg,'','id','weilei');
        my.append('a',div0,"author:" +subObj.author.name,'href',"/"+subObj.author.type+"/"+subObj.author.urlToken,'target',"_blank");
        my.append('div',msg,"created:"+my.s2d(subObj.created*1000));
        my.append('div',msg,"updated:"+my.s2d(subObj.updatedTime*1000));
        document.addEventListener('Documentcontentloaded',()=>{
            document.querySelector('.QuestionRichText-more').click();
        });
    },1000)
}


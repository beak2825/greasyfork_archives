// ==UserScript==
// @name         Hostloc自动屏蔽粉蛆与智障
// @namespace    https://hostloc.com/
// @version      0.8968
// @description  自动屏蔽粉蛆与智障
// @author       kiwi
// @match        https://hostloc.com/forum-*
// @match        https://hostloc.com/thread-*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448894/Hostloc%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E7%B2%89%E8%9B%86%E4%B8%8E%E6%99%BA%E9%9A%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/448894/Hostloc%E8%87%AA%E5%8A%A8%E5%B1%8F%E8%94%BD%E7%B2%89%E8%9B%86%E4%B8%8E%E6%99%BA%E9%9A%9C.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    const blockedUser=['skiy','腾讯云6折购','Gludog','小号专用马甲','一丢丢','我来给您上坟咯','sky123','ZhènJīngBù','小鸡真爱无疑','听风的歌','Qimiao','吹风秀跳刀','隆姑娘','amo','gyhl','卟想起床','NavieNetwork','表妹','栉风沐雨','我能做两小时','柳夜熙','lenchanlhc','王先生O_O','Corei7','bhgchinaboy','三七开','天有点热','长夜漫漫','ecs'];
    const blockedKeyword=['关键字屏蔽1','关键字屏蔽2'];
    const blockedSignatureUser=['Rosh','最初的梦想'];
    const contentStorage=[];//用于临时存储被屏蔽的帖子和签名内容
 
    // 帖子列表页
    if(location.href.includes('forum')){
        document.querySelectorAll('#threadlisttableid tbody').forEach((item,index)=>{
            if(item.id.includes('normalthread')){
                const title=item.querySelector('a.s.xst').innerText;
                for (let i = blockedKeyword.length - 1; i >= 0; i--) {
                    if(title.includes(blockedKeyword[i])){
                        // item.querySelector('a.s.xst').innerText='已屏蔽';
                        item.style.display='none';
                        break;
                    }
                }
 
 
                const nameA=item.querySelectorAll('td.by')[0].querySelector('a');
                if(nameA){
                    const userName=nameA.innerText.trim();
                    if(blockedUser.includes(userName)){
                        // item.querySelector('a.s.xst').innerText='已屏蔽';
                        item.style.display='none';
                    }
                }
            }
        })
    }
 
    // 帖子内容页
    if(location.href.includes('thread')){
        //监听点击事件，恢复被屏蔽的签名和帖子
        document.querySelector('#postlist').addEventListener('click',(e)=>{
            const item=e.target;
            if(item.className.includes('hidden-by-script')){
                item.innerHTML=contentStorage[item.dataset.restoreKey]
            }
        })
        //遍历发帖和回复
        document.querySelectorAll('#postlist>div').forEach((item)=>{
            if(!item.id.includes('post_')){
                return false;
            }
            const userLink=item.querySelector('a.xw1');
            if(userLink){
                const userName=userLink.innerText.trim();
                if(userName && blockedUser.includes(userName)){
                    item.style.display='none';
                }else if(blockedSignatureUser.includes(userName)){
                    const signature=item.querySelector('div.sign');
                    const contentText=signature.innerText;
                    const contentHTML=signature.innerHTML;
                    const storageKey=item.id+'signature';
                    contentStorage[storageKey]=contentHTML;
                    signature.innerHTML=`<span style="font-style:italic;font-size:10px;color:gray" class="hidden-by-script" data-restore-key="${storageKey}" title="${contentText}">已屏蔽,鼠标移到此处查看内容,点击还原内容</span>`;
                }
            }
 
            const tds=item.querySelectorAll('td');
            tds.forEach((td)=>{
                if(td.id.includes('postmessage_')){
                    const content=td.innerText;
                    for (let i = blockedKeyword.length - 1; i >= 0; i--) {
                        if(content.includes(blockedKeyword[i])){
                            const contentHTML=td.innerHTML;
                            const contentText=td.innerText;
                            contentStorage[item.id]=contentHTML;
                            td.innerHTML=`<span style="font-style:italic;font-size:10px;color:gray" class="hidden-by-script" data-restore-key="${item.id}" title="${content}">已屏蔽，鼠标移到此处查看内容</span>`;
                            break;
                        }
 
                    }
                }
            })
        })
    }
})();
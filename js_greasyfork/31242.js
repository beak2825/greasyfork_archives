// ==UserScript==
// @name         贴吧真实ID
// @namespace    null
// @version      0.6
// @description  去掉昵称显示贴吧真实ID
// @author       太虚 , minhill
// @match        *://tieba.baidu.com/*
// @match        *://tieba.baidu.com/f?*
// @grant        GM_addStyle
// @update       添加DOM监听，兼容大花猫的Tieba-At-Ta
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/31242/%E8%B4%B4%E5%90%A7%E7%9C%9F%E5%AE%9EID.user.js
// @updateURL https://update.greasyfork.org/scripts/31242/%E8%B4%B4%E5%90%A7%E7%9C%9F%E5%AE%9EID.meta.js
// ==/UserScript==
const config = {
    timeBefore:null,
    observer : { childList: true },
}

const util = { 
    topicName() {
        let users = document.querySelectorAll('.p_author_name');
        //console.log(users.length);
        if (users.length > 0) {
            users.forEach((user)=>{
                let oldName = user.innerText.split('\n').pop();
                const infoImg = user.parentNode.parentNode.querySelector('.p_author_face img');
                let newName = infoImg.getAttribute('username'); // 兼容性操作，大花猫At-Ta会重写user.href导致无法抓取。
                if(oldName !== newName && !user.parentNode.querySelector('.show-true-id')){// 添加过元素就不再执行修改了
                    let childNode = document.createElement('div');
                    childNode.className = 'show-true-id';
                    childNode.textContent = newName;
                    user.parentNode.appendChild(childNode);// 对大花猫At-ta脚本的兼容性修改，
                }
            });
        }
    },

    homeName() {
        let homeusers = document.querySelectorAll('.frs-author-name.j_user_card ');
        if (homeusers.length > 0 && !document.querySelector('.show-true-id-list')) {// 添加过元素就不再执行修改了
            [...homeusers].filter(user=>user.querySelector('.nicknameEmoji')).forEach((user)=>{
                const newName = util.filterName(user.href);
                //let oldName = user.textContent;
                //if(!user.querySelector('.nicknameEmoji')) return; //一样的话直接跳回
                let childNode = document.createElement('span');
                user.className+= ' ' + 'hide-id';
                childNode.className = 'show-true-id-list';
                childNode.textContent = util.filterName(user.href);
                const authorIcon = user.parentNode.parentNode.querySelector('.icon_replyer') || 
                                   user.parentNode.parentNode.querySelector('.icon_author');
                
                authorIcon.textContent = decodeURIComponent('%F0%9F%92%84');//口红标志
                authorIcon.setAttribute("style",'background-image:none;vertical-align: top;');
                user.parentNode.appendChild(childNode); // 对大花猫At-ta脚本的兼容性修改，
            });
        }
    },

    filterName(url) {
        return decodeURI(url.split('?')[1].split('&')[0].split('=')[1]);
    },

    update(){ // 执行修改
        //requestAnimationFrame(this.topicName);
        requestAnimationFrame(this.topicName); //防止频繁painting导致掉帧
        requestAnimationFrame(this.homeName);
    },
    needToUpdate(){
        let timeNow = Date.now();
        if(config.timeBefore){
            let delta = timeNow - config.timeBefore;
            if(delta>200){
                config.timeBefore = timeNow;
                return true;
            }else{
                return false //由于是监听的<body>,会导致回调过于频繁，小于200ms，不再调用
            }
        }
        else{
            config.timeBefore = timeNow;
            return true;
        }
    }
}


const listObserver = new MutationObserver((mutations)=>{ // 监听函数
    if(util.needToUpdate()) util.update();
});



const main = ()=>{// 入口函数
    
    const target = document.querySelector('body');
    if(target){
        listObserver.observe(target, config.observer);
    }
};

GM_addStyle(`.show-true-id{letter-spacing:0;color:rgb(45, 100, 179)}`);

GM_addStyle(`.threadlist_author.pull_right{
    position: relative;
  }
  .show-true-id-list{
    color:#6C2DC7;
    position: absolute;
    left: 20px;
    top: -1px;
    width: 80px;
    white-space:nowrap;
    text-overflow:ellipsis; 
    overflow: hidden;
    font-size:12px;
    vertical-align:middle;
  }
 
  .frs-author-name.j_user_card.hide-id{
    position: relative;
    z-index: 1;
    opacity: 0;
  }`);// 让原本的author元素透明上浮，插入的元素垫在下面，这样就不会挡住原来的元素交互了。
  
document.addEventListener ("DOMContentLoaded", main);
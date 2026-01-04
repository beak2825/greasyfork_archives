// ==UserScript==
// @name         antivilus web word📄
// @description  highlight heresy word
// @namespace    anti_cultivation_world_hopping
// @author       Covenant
// @version      1.0.0.4
// @license      MIT
// @homepage
// @match        *://*/*
// @exclude      file:///*
// @icon         data:image/svg+xml,<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.862 4.82501L2.27448 22.5C2.05619 22.878 1.94069 23.3066 1.93946 23.7432C1.93824 24.1797 2.05134 24.6089 2.26751 24.9882C2.48368 25.3674 2.79538 25.6834 3.17161 25.9048C3.54784 26.1262 3.97548 26.2452 4.41198 26.25H25.587C26.0235 26.2452 26.4511 26.1262 26.8273 25.9048C27.2036 25.6834 27.5153 25.3674 27.7314 24.9882C27.9476 24.6089 28.0607 24.1797 28.0595 23.7432C28.0583 23.3066 27.9428 22.878 27.7245 22.5L17.137 4.82501C16.9141 4.45764 16.6004 4.15391 16.226 3.94312C15.8516 3.73232 15.4291 3.62158 14.9995 3.62158C14.5698 3.62158 14.1474 3.73232 13.773 3.94312C13.3986 4.15391 13.0848 4.45764 12.862 4.82501V4.82501Z" stroke="%23E03232" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 11.25V16.25" stroke="%23E03232" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 21.25H15.0125" stroke="%23E03232" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/484393/antivilus%20web%20word%F0%9F%93%84.user.js
// @updateURL https://update.greasyfork.org/scripts/484393/antivilus%20web%20word%F0%9F%93%84.meta.js
// ==/UserScript==
const ary_doomsday=['修仙','修真','仙侠','武侠','高武','宗门','练武','魔修','世家','筑基','灵气复苏','洪荒','斗罗','斗破','遮天','诸天','无限流','快穿','蓝星','地球','北美','东京','国运','全民','全球','文明试炼','黑科技',
                    '亮剑','四合院','综漫','港综','华娱','综网','恋综','美漫','漫威','美综','吞噬星空','全职法师','盘龙','灵笼','久川市','路明非','宝可梦','霍格沃茨','哈利波特','战锤','帝皇','艾泽拉斯','权游'];
const ary_zone_crisis=['末世','末日','废土','聊天群','武道','道主','功法','气运','芯片','平行','重生','精灵','骑砍'];
const ary_middle_threats=['诡秘之主','神秘复苏','位面','副本','舰娘','宿主','叮'];
function create_style(textContent,id,class_name){let style=create_style_iframes(textContent,id,class_name,document.body);return style;}
var style_user_css=create_style("","gm_user_css_anti_civilization_world_hopping",["user_gm_css","css_anti_civilization_world_hopping"]);
style_user_css.textContent+=`.doomsday.doomsday.doomsday{text-decoration-line: line-through;box-shadow: 0rem 0rem 0.5rem DarkRed;}
.zone_crisis.zone_crisis{text-decoration-line: underline;text-decoration-style: wavy;box-shadow: 0rem 0rem 0.5rem DarkOrange;}
.middle_threats{text-decoration-line: underline;text-decoration-style: dashed;box-shadow: 0rem 0rem 0.5rem Gold;}
.wanben{font-style: italic;font-weight: 900;}\n._addEventListener{text-decoration-line: underline;text-decoration-style: double;}`;
function create_style_iframes(textContent,id,class_name,node){
    let style=create_node("style",class_name,true,node);
    style.type='text/css';
    style.id=id;
    style.textContent=textContent;
    return style;
}
function create_node(tagname,class_name,is_appendChild,node,refNode){
    let element=document.createElement(tagname);
    element.id="";
    if(Array.isArray(class_name)){
        for(let i=0; i<class_name.length; i++){element.classList.add(class_name[i]);}
    }else if(typeof class_name==='string'){element.classList.add(class_name);}
    if(node==undefined){node=document.body;}
    if(is_appendChild){node.appendChild(element);}
    else{
        if(refNode==undefined){node.insertBefore(element,node.firstChild);}else{node.insertBefore(element,refNode);}
    }return element;
}
//console.log("%cbreak",css__mono_std);
function main_01(){
    let body=document.querySelector('body');
    if(body.innerText.search("下一章")!=-1||(body.innerText.search("目录")!=-1||body.innerText.search("作者")!=-1)||body.innerText.search("连载")!=-1||body.innerText.search("全本")!=-1||body.innerText.search("連載")!=-1){//
        let node=document.querySelectorAll('p,a,span,ol');
        for(let n=0; n<node.length; n++){
            if(node[n].children.length!=0){
                if(node[n].querySelectorAll('br,hr,img,span').length==0){continue;}
            }
            for(let i=0; i<ary_doomsday.length; i++){
                if(node[n].innerText.search(ary_doomsday[i])!=-1){
                    node[n].classList.add("doomsday");
                    node[n].title=ary_doomsday[i];
                }
            }
            for(let i=0; i<ary_zone_crisis.length; i++){
                if(node[n].innerText.search(ary_zone_crisis[i])!=-1){
                    node[n].classList.add("zone_crisis");
                    node[n].title=ary_zone_crisis[i];
                }
            }
            for(let i=0; i<ary_middle_threats.length; i++){
                if(node[n].innerText.search(ary_middle_threats[i])!=-1){
                    node[n].classList.add("middle_threats");
                    node[n].title=ary_middle_threats[i];
                }
            }
        }
        node=document.querySelectorAll('span:not(._addEventListener),label:not(._addEventListener)');
        for(let n=0; n<node.length; n++){
            if(node[n].innerText.search("完本")!=-1||node[n].innerText.search("全本")!=-1){
                node[n].classList.add("wanben");
                node[n].classList.add("_addEventListener");
                node[n].addEventListener('click',() => {main_01();console.log("addEventListener完本");});
            }else if(node[n].innerText.search("连载")!=-1||node[n].innerText.search("連載")!=-1){
                node[n].classList.add("_addEventListener");
                node[n].addEventListener('click',() => {main_01();console.log("addEventListener连载");});
            }
        }
    }
}
(function(){
    let timeoutID=main_01();
    window.setTimeout(( () =>main_01()),3000);
})();
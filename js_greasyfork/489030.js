// ==UserScript==
// @name        UI美化-JLU学业完成查询
// @namespace   美好生活
// @match       https://vpn.jlu.edu.cn/https/44696469646131313237446964696461a37df87d4dc2a702825ee37999669b/jwapp/sys/xywccx/*default/index.do*
// @match https://iedu.jlu.edu.cn/jwapp/sys/xywcc*
// @grant       GM_addStyle
// @version     1.0
// @license MIT
// @author      Celery
// @description 更好看，更花哨，更好用
// @downloadURL https://update.greasyfork.org/scripts/489030/UI%E7%BE%8E%E5%8C%96-JLU%E5%AD%A6%E4%B8%9A%E5%AE%8C%E6%88%90%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/489030/UI%E7%BE%8E%E5%8C%96-JLU%E5%AD%A6%E4%B8%9A%E5%AE%8C%E6%88%90%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

GM_addStyle(`
body::-webkit-scrollbar{
  display:none;
}
main{
margin:0!important;
}
footer{
  display:none;
}
.bh-headerBar{
  display: none;
}
.bh-paper-pile-dialog {
    top: 0 !important;
    max-width: unset !important;
    width: 100% !important;
    margin: 0 ;
    height: calc(100% - 0px)!important;
}
#jsmind_container{
  margin:0  !important;
}
#jsmind_container jmnode{
  border-radius: 10px !important;
  padding: 5px !important;
  border:none !important;
}
jmnode,jmnode *{
  transition: all .3s;
}
.jsmind_warn {
    position: absolute;
    right: 5px!important;
    top: 5px!important;
    min-width: 14px;
    height: 14px;
    padding: 0px 2px;
    background-color: #00000000!important;
    font-size: 20px;
    line-height: 15px;
    text-align: center;
    border-radius: 8px;
    color: #003cff!important;
}
.container{
  width:100% !important;
  background-color:#c6c6c6 !important;
}
jmnode:not(.selected) {
    background-color: #e1ecf5 !important;
    box-shadow: 1px 1px 4px #00000024 !important;
}
jmnode:hover {
    background-color: #fff !important;
    box-shadow: 2px 2px 5px #00000044 !important;
    cursor:pointer;
}
jmnode.selected {
    background-color: #a1cdff !important;
    box-shadow: 3px 3px 12px #00000048 !important;
}
jmnode.selected>.jsmind_node_title_span {
    color: inhert  !important;
}
.bh-property-dialog-container{
  width:85vw !important;
}
#wrapperdykkrws-index-table{
    height: 122% !important;
}
body > div.bh-paper-pile-dialog.single > div > div.bh-paper-pile-body.bh-card.bh-card-lv1{
  border: none;
}
#dykkrws-index-table,
#contentdykkrws-index-table{
  height:calc(100% - 72px)!important;
}
#pagerdykkrws-index-table{
  bottom:0px !important;
  top:unset !important;
}
#bar{
  background:#14c666 !important;
}
`)
function until(condi,callback){
  let interval = setInterval(()=>{
    if(condi()){
      clearInterval(interval)
      callback()
    }
  },300)
}
document.addEventListener('keydown',e=>{
  console.log(e)
if(e.key=='Escape'){
  document.querySelector('aside i[bh-property-dialog-role=closeIcon]')?.click()
}
},{ once: false })
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if(mutation.target.tagName!='JMNODE')return
    const el = mutation.target.querySelector('.jsmind_warn')
    if(el&&el.textContent=='0'){
      // console.log(el)
      // console.log(el.textContent)
      // console.log(mutation)
    // console.log('Mutation type:', mutation.type);
    // console.log('Modified element:', mutation.target);
    // console.log('Old value:', mutation.oldValue);
      el.remove()
    }else{
      // console.log(mutation.target)
    }
    if(mutation.type!='childList')return
  });
});
// 配置观察选项
const config = { attributes: true, childList: true, subtree: true, characterData: true, attributeOldValue: true, characterDataOldValue: true };

observer.observe(document.body, config);

until(()=>document.querySelector('aside'),()=>{
document.querySelector('aside').addEventListener('click',e=>{
if(e.target.classList.contains('bh-property-dialog-cover')){
  document.querySelector('aside i[bh-property-dialog-role=closeIcon]')?.click()
}

})
})



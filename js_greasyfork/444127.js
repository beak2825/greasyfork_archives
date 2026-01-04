// ==UserScript==
// @name         壁垒搜索
// @namespace    https://github.com/Bleu404/
// @version      1.0.2
// @description  自定义搜索引擎如谷歌、百度、YOUTUBE、B站、豆瓣、CSDN、贴吧、知乎、简书等，自动识别选择内容，快捷键"Alt+x"作为脚本开关。
// @author       bleu
// @compatible   chrome Tampermonkey
// @license      GPL-3.0-only
// @match        *://*/*
// @icon         https://fastly.jsdelivr.net/gh/Bleu404/PRPO@main/png/BarrierSearch.png
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://fastly.jsdelivr.net/npm/gbk.js@0.3.0/dist/gbk.min.js
// @downloadURL https://update.greasyfork.org/scripts/444127/%E5%A3%81%E5%9E%92%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/444127/%E5%A3%81%E5%9E%92%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {

    'use strict';
    const hotkey ='x';//小写，替换x为其他键位
    let defInfo;
    function addCssStyle() {
        let cssStyle = `#BleuBSUI {z-index: 9999!important;top: 30%;left: 30%;width: 400px;overflow: auto;position: fixed;border-radius: 10px;background: linear-gradient(45deg,rgba(18,194,233,0.9), rgba(196,113,237,0.9),rgba(246,79,89,0.9));color: black}
        .bleu_bs_but{font-weight: bold;box-shadow: 3px 2px 2px 1px rgb(0 0 0 / 50%);border-radius: 5px;font-size: 16px;width: fit-content;}
        .bleu_bs_but:active{box-shadow: 0 5px #666;transform: translateY(4px)}
        .bleu_bs_inp{padding: 3px;border: 0px;outline-style: none;border-radius: 50px;background-color: #fff;box-shadow: 2px 2px 2px 1px rgb(0 0 0 / 20%);width: 75%;text-align: center;font-size: 14px;height: 30px;font-weight: 600;}
        #bleu_bs_addei div{margin: 10px;}
        #bleu_bs_addei label{margin-right: 10px;font-size: 16px}
        .bleu_bs_showitem{font-size: 14px;margin: 10px;border-radius: 6px;width: 180px;box-shadow: 3px 2px 2px 1px rgb(0 0 0 / 50%);}
        .bleu_bs_showitem span{margin: 5px;font-weight: bold;}
        .bleu_bs_showitem span:active{box-shadow: 0 5px #666;transform: translateY(4px)}
        .bleu_bs_showitem_info{width: 120px;display: inline-block;}
        #BleuBSUI a{text-decoration: none;color: black;}`;
        let style = document.createElement('style');
        style.innerHTML = cssStyle;
        document.querySelector('head').appendChild(style);
    }

    function getHtml(){ 
        let retHtml=`<div id="bleu_bs_title" style="padding-left: 30%;font-size: 22px;"><span style="font-weight: bold;"><a href="https://greasyfork.org/zh-CN/users/798733-bleu" target="_blank">壁垒搜索</a></span>™<span style="font-size: 13px;font-style: oblique;"><a href="https://github.com/Bleu404/" target="_blank">  by bleu</a></span></div>
        <div id="bleu_bs_search" style="margin: 10px;"><input type="text" class="bleu_bs_inp">
        <div style="margin-right: 4%;float: right;padding: 3px;" class="bleu_bs_but">搜索</div></div>
        <div class="bleu_bs_but addeni" style="margin: 10px;">添加搜索引擎</div>
        <div id="bleu_bs_addei" style="display:none;"><div><label>名称:</label><input type="text" placeholder="自定义搜索引擎名称" class="bleu_bs_inp name"></div><div><label>地址:</label><input placeholder="网址格式（用%s代替搜索字词）" type="text" class="bleu_bs_inp url"></div><div><label>数据:</label><textarea placeholder="POST方式，地址中使用了%s，本框不用填写" type="text" class="bleu_bs_inp data" style="display: inline-table;border-radius: 5px;"></textarea></div>
        <div><label>中文乱码时选择：</label><input type="checkbox" class="bleu_bs_gbk"></input></div>
        <div style="display: flex;"><div class="bleu_bs_but ok">确定</div><div class="bleu_bs_but ccl">取消</div></div></div>
        <div id="bleu_bs_show" style="display: inline-flex;flex-wrap: wrap;"></div>`;
        return retHtml;
    }

    function getSelectedText() {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else if (document.selection) {
            return document.selection.createRange().text;
        }
        return '';
    }

    function clearInput(){
        document.querySelector('.bleu_bs_inp.name').value="";
        document.querySelector('.bleu_bs_inp.url').value="";
        document.querySelector('.bleu_bs_inp.data').value="";
        document.querySelector('.bleu_bs_gbk').checked=false;
        document.querySelector('#bleu_bs_addei').style.display = "none";
    }

    function saveEngine(){
        GM_setValue("bs", JSON.stringify(defInfo.filter(item => item!="")));
    }

    function addSearchEngine(name,index,iswork){
        let engine = document.createElement('div');
        engine.className = 'bleu_bs_showitem';
        if(index == undefined){
            iswork = true;
            defInfo.push({'name':name,'url':document.querySelector('.bleu_bs_inp.url').value,'data':document.querySelector('.bleu_bs_inp.data').value,'iswork':true,'isgbk':document.querySelector('.bleu_bs_gbk').checked});
            index = defInfo.length-1;
        }
        engine.setAttribute("index",index);
        engine.setAttribute("state",iswork?1:0);
        engine.oncontextmenu =()=>{return false;};
        engine.innerHTML = `<span class="bleu_bs_showitem_info"><span>${iswork?"✅":"❌"}</span>${name}</span>|<span class="bleu_bs_showitem_del">删除</span></div></div>`;
        ListenItem(engine);
        document.querySelector('#bleu_bs_show').appendChild(engine);
    }

    function ListenItem(itemNode) {
        itemNode.querySelector('.bleu_bs_showitem_info').addEventListener('mousedown', function (e) {
            let i;
            if(e.button==2){
                document.querySelectorAll('.bleu_bs_showitem[state="1"]').forEach(item=>{
                    item.setAttribute('state',0);
                    i = item.getAttribute('index');
                    defInfo[i]['iswork']=false;
                    item.firstChild.firstChild.innerHTML='❌';
                })
                i = e.target.parentNode.getAttribute('index');
                e.target.parentNode.setAttribute('state',1);
                defInfo[i]['iswork']=true;
                e.target.parentNode.firstChild.firstChild.innerHTML='✅';
            }
            else if(e.button==0){
                i = e.target.parentNode.getAttribute('index');
                if(e.target.parentNode.getAttribute('state')==1){
                    e.target.parentNode.setAttribute('state',0);
                    defInfo[i]['iswork']=false;
                    e.target.parentNode.firstChild.firstChild.innerHTML='❌';
                }else{
                    e.target.parentNode.setAttribute('state',1);
                    defInfo[i]['iswork']=true;
                    e.target.parentNode.firstChild.firstChild.innerHTML='✅';
                }
            }
            saveEngine();
        })
        itemNode.querySelector('.bleu_bs_showitem_info').addEventListener('mouseup',()=>{
            document.querySelector('#bleu_bs_search input').focus();
        }) 
        itemNode.querySelector('.bleu_bs_showitem_del').addEventListener('click', function (e) {
            let i = e.target.parentNode.getAttribute('index');
            defInfo[i]="";
            e.target.parentNode.remove();
            saveEngine();
        })
    }

    function searchitem(str) {
        document.querySelectorAll('.bleu_bs_showitem[state="1"]').forEach(item=>{
            let engine = defInfo[item.getAttribute('index')];
            if(engine['isgbk']){
                str = GBK.URI.encodeURIComponent(str);
            }
            if(engine['url'].indexOf('%s')>0){
                window.open(engine['url'].replace('%s',str));
            }else if(engine['data']){
                window.open(engine['url']+'?'+engine['data'].replace('%s',str));
            }
        })
    }

    function BSComeOut() {
        let bsui = document.createElement('div'),textInp;
        bsui.id = 'BleuBSUI';
        bsui.innerHTML = getHtml();
        document.body.appendChild(bsui);
        defInfo.forEach((item,index) => {
            addSearchEngine(item["name"],index,item["iswork"]);
        });
        textInp = document.querySelector('#bleu_bs_search input');
        textInp.value=getSelectedText();
        textInp.focus();
        textInp.addEventListener('keypress',(e)=>{
            e.keyCode == 13&&document.querySelector('#bleu_bs_search div').click();
        })
        document.querySelector('#bleu_bs_search div').addEventListener('click', function () {
            document.querySelector('#BleuBSUI').style.display = 'none';
            searchitem(textInp.value);//encodeURIComponent() .replace(' ','+')
        })
        document.querySelector('.bleu_bs_but.addeni').addEventListener('click', function () {
            let temp = document.querySelector('#bleu_bs_addei');
            temp.style.display = temp.style.display === "none"?"block":"none";
            document.querySelector('.bleu_bs_inp.data').disabled = false;
        })
        document.querySelector('.bleu_bs_inp.data').addEventListener('click', function (e) {
            let temp = document.querySelector('.bleu_bs_inp.url').value;
            if(temp.indexOf('%s')>=0){
                e.target.disabled = true;
            }
        })
        document.querySelector('.bleu_bs_but.ok').addEventListener('click', function () {
            addSearchEngine(document.querySelector('.bleu_bs_inp.name').value);
            saveEngine();
            clearInput();
        })
        document.querySelector('.bleu_bs_but.ccl').addEventListener('click', function () {
            clearInput();
        })
    }

    addCssStyle();
    document.addEventListener("keydown", (e) => {
        if (e.altKey && e.key == hotkey) {
            let temp = document.querySelector('#BleuBSUI');
            if (temp) {
                if(temp.style.display === "none"){
                    temp.style.display = "block";
                    document.querySelector('#bleu_bs_search input').value=getSelectedText();
                    document.querySelector('#bleu_bs_search input').focus();
                }else{
                    temp.style.display = "none";
                }
            } else {
                defInfo = JSON.parse(GM_getValue('bs')||null)||[];
                BSComeOut();
            }
        }
    });
})();
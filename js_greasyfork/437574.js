// ==UserScript==
// @name            右键搜索增强
// @namespace       http://tampermonkey.net/
// @description     在右键菜单中，添加额外的搜索选项，选中文字后，点击右键，然后选择相应的搜索就可以直接跳转到对应的搜索、翻译、电商等平台（只测试过chrome+油猴）。
// @version         1.2
// @author          桃源隐叟
// @include         *
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_setValue
// @grant           GM_getValue
// @run-at            document-end
// @match          *
// @homepageURL       https://github.com/taoyuancun123/modifyText/blob/master/modifyText.js
// @supportURL        https://greasyfork.org/zh-CN/scripts/437574/feedback
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/437574/%E5%8F%B3%E9%94%AE%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/437574/%E5%8F%B3%E9%94%AE%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var selection='';    
    //***********设置区域 */  
     var setting={
        init:()=>{
            document.body.insertAdjacentHTML("afterbegin",setting.settingHtml);
            document.body.querySelector("#tyc-close").onclick=()=>{
                document.body.querySelector(".tyc-rc-container").style="display:none;";
            }

            setting.readItem();
            setting.insertItemToHtml();
            setting.changeItem();
            setting.deleteItem();
            document.body.querySelector(".tyc-add-item").onclick=()=>{
                setting.addItem();
            }
        },
        settingHtml:`
        <style>
        .tyc-rc-container{
            z-index:9999999999999999;
            display: block;
            width: 450px;
            height: auto;
            padding: 10px 5px;
            background: #fff;
            box-shadow: 0 1px 3px rgba(18,18,18,.1);
            border:1px solid rgba(18,18,18,.02);
            border-radius: 5px;
            position:fixed;
            right:50px;
            top:50px;
        }
        .tyc-rc-list{
            display: flex;
            align-items: center;
            flex-direction: column;
            flex-wrap: nowrap;
            justify-content: center;
            align-content: center;
            margin: 5px 0px;
            border-top: 1px solid rgba(188,188,188,.1);
            padding-top: 5px;
        }
    
        .tyc-rc-item{
            display: flex;
            align-items: center;            
            flex-wrap: nowrap;
            justify-content: center;
            align-content: center;
            margin-bottom: 5px;
        }
    
        .tyc-rc-item input,.tyc-rc-item button{
            margin: 0px 5px;
        }
    
        .tyc-rc-container button{
            width: 50px;
            height: 30px;
            color: #563d7c;            
            background-color: transparent;
            border-color: #563d7c;   
            cursor: pointer;   
            border: 1px solid;   
            border-radius: 6px;
        }
    </style>
    <div class="tyc-rc-container">
        <div>
            <button class="tyc-add-item">新增</button>            
            <button id="tyc-close" style="float: right;">X</button>
        </div>    
        <div class="tyc-rc-list"></div>
    </div>
        `,
        searchItemHtml:`<div class="tyc-rc-item">
        <input type="checkbox" name="sites" class="tyc-show-in-menu">
        <input type="text" name="title" placeholder="输入将显示在菜单中的提示名" class="tyc-search-title">
        <input type="text" name="urls" placeholder="参考其他例子，输入除关键词外的网址部分" class="tyc-search-url">
        <button class="tyc-delete">删除</button>
    </div>
        `,
        searchItems:[
            {title:"使用百度翻译",url:"https://fanyi.baidu.com/#zh/en/",show:true,index:0},
            //{title:"google translate",url:"https://translate.google.cn/?sl=auto&tl=zh-CN&op=translate&text=",show:true,index:1},
            {title:"search in google",url:"https://www.google.com/search?q=",show:true,index:2},
            {title:"在知乎中搜索",url:"https://www.zhihu.com/search?type=content&q=",show:true,index:3}
        ],
        insertItemToHtml:()=>{
            let items=setting.readItem();
            items.forEach((item,index) => {
                let itemHtml=`<div class="tyc-rc-item" id="tyc-rc-item-${index}" data-index="${index}">
                <input type="checkbox" name="sites" class="tyc-show-in-menu" id="tyc-show-in-menu-${index}" data-index="${index}">
                <input type="text" name="title" placeholder="输入将显示在菜单中的提示名" class="tyc-search-title" id="tyc-search-title-${index}" data-index="${index}">
                <input type="text" name="urls" placeholder="参考其他例子，输入除关键词外的网址部分" class="tyc-search-url" id="tyc-search-url-${index}" data-index="${index}">
                <button class="tyc-delete" id="tyc-delete-${index}" data-index="${index}">删除</button>
            </div>
                `

                document.body.querySelector(".tyc-rc-list").insertAdjacentHTML("beforeend",itemHtml);
                document.body.querySelector(`#tyc-search-title-${index}`).value=item.title;
                document.body.querySelector(`#tyc-search-url-${index}`).value=item.url;
                document.body.querySelector(`#tyc-show-in-menu-${index}`).checked=item.show;
            });            
        },
        addItem:()=>{            
            let searchItemsLength=document.body.querySelectorAll(".tyc-rc-item").length;
            let itemHtml=`<div class="tyc-rc-item" id="tyc-rc-item-${searchItemsLength}">
                <input type="checkbox" name="sites" class="tyc-show-in-menu" id="tyc-show-in-menu-${searchItemsLength}">
                <input type="text" name="title" placeholder="输入将显示在菜单中的提示名" class="tyc-search-title-" id="tyc-search-title-${searchItemsLength}">
                <input type="text" name="urls" placeholder="参考其他例子，输入除关键词外的网址部分" class="tyc-search-url" id="tyc-search-url-${searchItemsLength}">
                <button class="tyc-add-new" id="tyc-add-new-${searchItemsLength}">增加</button>
            </div>
                `
            document.body.querySelector(".tyc-rc-list").insertAdjacentHTML("beforeend",itemHtml);            

            document.body.querySelector(`#tyc-add-new-${searchItemsLength}`).onclick=()=>{
                let isShow=document.body.querySelector(`#tyc-show-in-menu-${searchItemsLength}`).checked;
                let title=document.body.querySelector(`#tyc-search-title-${searchItemsLength}`).value;
                let url=document.body.querySelector(`#tyc-search-url-${searchItemsLength}`).value;
                setting.searchItems.push({title:title,url:url,show:isShow});
                GM_setValue("searchItems",setting.searchItems);
                setting.refreshList();  
                addContextMenu.registerMenu();              
            }
        },
        deleteItem:()=>{
            document.body.querySelectorAll(".tyc-delete").forEach(item=>{
                item.onclick=(e)=>{
                e.preventDefault();
                let index=e.target.dataset.index;
                setting.searchItems.splice(index,1);
                GM_setValue("searchItems",setting.searchItems);
                console.log(setting.searchItems);
                console.log(GM_getValue("searchItems"));
                setting.refreshList();                                 
            }
        })
        },
        readItem:()=>{
            if(!GM_getValue('searchItems')){
                GM_setValue('searchItems',setting.searchItems);
                return setting.searchItems;
            }else{
                setting.searchItems=GM_getValue('searchItems');
                return setting.searchItems;
            }
        },
        changeItem:()=>{
            document.body.querySelectorAll(".tyc-show-in-menu").forEach(item=>{
                item.onclick=e=>{
                    console.log(e);  
                    let index=e.target.dataset.index;
                    setting.searchItems[index].show=e.target.checked;
                    GM_setValue('searchItems',setting.searchItems);
                }
            })


            document.body.querySelectorAll(".tyc-search-title").forEach(item=>{
                item.onchange=e=>{ 
                    console.log(e);                     
                    let index=e.target.dataset.index;
                    setting.searchItems[index].title=e.target.value;
                    GM_setValue('searchItems',setting.searchItems);
                }
            })
            

            document.body.querySelectorAll(".tyc-search-url").forEach(item=>{
                item.onchange=e=>{
                    console.log(e);                    
                    let index=e.target.dataset.index;
                    setting.searchItems[index].url=e.target.value;
                    GM_setValue('searchItems',setting.searchItems);
                }
            })

        },
        refreshList:()=>{
            document.body.querySelector(".tyc-rc-list").innerHTML='';
            setting.insertItemToHtml();
            setting.deleteItem();
            setting.changeItem();
        }
    }    
    //设置区域结束
    
    var addContextMenu={
        registerMenu:()=>{
            let items=setting.readItem();
            //console.log(items);
            items.forEach((item) => {
                GM_registerMenuCommand(item.title,()=>{ 
                    let targetUrl='';                        
                    targetUrl=item.url+selection;    
                    GM_openInTab(targetUrl, {active:true});  
                });
            });
        },
    }
    window.oncontextmenu=e=>{
        selection=e.view.getSelection().toString();
    }
    //setting.init();
    addContextMenu.registerMenu();
    GM_registerMenuCommand('打开设置',setting.init);
})();
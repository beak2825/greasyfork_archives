// ==UserScript==
// @name         点击复制ff14.灰机wiki物品详情的物品名
// @namespace    https://github.com/Elypha/copy_itemname_ff14huijiwiki
// @version      0.6
// @description  添加一个按钮，点击即可复制ff14 灰机wiki里，物品制作材料里的材料名
// @author       金光闪闪大萌德@NGA
// @date         2018-12-25
// @modified     2019-11-13
// @match        ff14.huijiwiki.com/wiki/*
// @grant        none
// @license      GUN 3.0
// @downloadURL https://update.greasyfork.org/scripts/375930/%E7%82%B9%E5%87%BB%E5%A4%8D%E5%88%B6ff14%E7%81%B0%E6%9C%BAwiki%E7%89%A9%E5%93%81%E8%AF%A6%E6%83%85%E7%9A%84%E7%89%A9%E5%93%81%E5%90%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/375930/%E7%82%B9%E5%87%BB%E5%A4%8D%E5%88%B6ff14%E7%81%B0%E6%9C%BAwiki%E7%89%A9%E5%93%81%E8%AF%A6%E6%83%85%E7%9A%84%E7%89%A9%E5%93%81%E5%90%8D.meta.js
// ==/UserScript==

var style = document.createElement("style")
style.type = "text/css"
style.innerHTML=".copy_button{margin-left: 10px;margin-right: 6px;height: 18px;width: 42px;vertical-align: middle;color: #ea6060;font-style: normal;"+
    "font-variant-ligatures: normal;font-variant-caps: normal;font-variant-numeric: normal;font-variant-east-asian: normal;"+
    "font-weight: 400;font-stretch: normal;font-size: 12px;line-height: normal;font-family: Arial;padding-left: 0px;padding-right: 0px;"+
    "background-color: #ffc8c8;border-color: #ffe8e8;border-radius: 4px;border-width: 1px;box-shadow: 1px 1px 1px #6b4040;}";
document.getElementsByTagName("HEAD").item(0).appendChild(style)

function copy_text(text) {
    var textArea = document.createElement('textArea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand("Copy")
    document.body.removeChild(textArea)
}

function set_button_single(order) {
    var item_bar = item_append[order-1].parentNode
    var button_copy = document.createElement("button")
    button_copy.className = "copy_button"
    button_copy.innerHTML = "COPY"
    button_copy.addEventListener ("click", function() {
        var text = item_name[order].innerText
        copy_text(text)
    })
    item_bar.appendChild(button_copy)
}

function set_button_multiple(order) {
    var item_bar = item_append[order].parentNode
    var button_copy = document.createElement("button")
    button_copy.className = "copy_button"
    button_copy.innerHTML = "COPY"
    button_copy.addEventListener ("click", function() {
        var text = item_name[order].innerText
        copy_text(text)
    })
    item_bar.appendChild(button_copy)
}



var url = window.location.href;

var switch_url_item = url.search(/wiki\/%E7%89%A9%E5%93%81:/);

if (switch_url_item>0){
    var craft_list = document.getElementsByClassName("item-craft-list")[0]
    var item_name = craft_list.querySelectorAll(".item-name")
    var item_append = craft_list.querySelectorAll(".item-number")


    var item_bar0 = craft_list.querySelectorAll(".rarity-common")[0]
    var button_copy0 = document.createElement("button")
    button_copy0.className = "copy_button"
    button_copy0.innerHTML = "COPY"
    button_copy0.addEventListener ("click", function() {
        var text0 = item_name[0].innerText
        copy_text(text0)
    })
    item_bar0.appendChild(button_copy0)


    var multiple = 0
    if (document.getElementsByClassName("item-craft-list")[0].getElementsByClassName("rarity-common")[0]){
        var multiple_number = document.getElementsByClassName("item-craft-list")[0].getElementsByClassName("rarity-common")[0].lastChild.className
        }

    if (multiple_number == "item-number"){
        multiple = 1
    }

    if (multiple==1){
        for(var m=1;m<item_name.length;m++){
            set_button_multiple(m)
        }
    }else{
        for(var s=1;s<item_name.length;s++){
            set_button_single(s)
        }
    }
}

// ==UserScript==
// @name         argos_for_janus
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  display log interface for janus user
// @author       wangqiwei.bj
// @match        https://cloud-boe.bytedance.net/argos/*
// @match        http://cloud-boe.bytedance.net/argos/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bytedance.net
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453022/argos_for_janus.user.js
// @updateURL https://update.greasyfork.org/scripts/453022/argos_for_janus.meta.js
// ==/UserScript==
/* eslint-env jquery */
(function() {
    'use strict';

    console.log(">>> argos for janus user <<<");
    var timeFun = setInterval(function(){
        if ($("#structLogContainer").length > 0) {
            clearInterval(timeFun);
            refreshUI();
        }
    }, 1000);
})();

var addTags=["phase", "version", "lane"]
var filterTags=["phase", "version","lane", "_level", "__timestamp"]
filterTags.reverse();
var observer

function refreshUI() {
    addFilterValue(0);

    // 点击搜索，Table渲染成功后添加FilterTag
    var m=document.getElementById("structLogContainer");
    observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 清空已选字段
            $("span:contains(' 清空')").click();
            $("span:contains('确定')").click();

            // 重新选择字段
            addFilterTag();
        });
    });
    observer.observe(m, {
        attributes: true, //configure it to listen to attribute changes,
        attributeFilter: ['style'],
        attributeOldValue: true
    });
}

function addFilterValue(i) {
    if (i == addTags.length) {
        return;
    }
    console.log(">> add Tag: ", addTags[i]);

    // Open Dialog
    $("span:contains(' 添加')").click();

    // set React Input
    changeValue($("input[placeholder='请输入过滤字段']")[0], addTags[i]);

    // set React Selector
    $("input[placeholder='请选择']").click();
    $("li:contains('STRING')").click();
    $("span:contains('确定')").click();

    setTimeout(function(){addFilterValue(i+1)}, 100);
}


function changeValue(input, value){
    var nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    ).set;
    nativeInputValueSetter.call(input, value);

    var inputEvent = new Event("input", { bubbles: true });
    input.dispatchEvent(inputEvent);
}

function addFilterTag() {
    for (let i=0; i < filterTags.length; i++) {
        console.log("> display: " + filterTags[i])
        var elems = $(".arco-collapse-item-header-title:contains('" + filterTags[i] + "') + div > span > span");
        console.log(elems.length)
        if (elems.length < 1) {
            return
        }
        elems.click();
    }
}
// ==UserScript==
// @icon         http://9.url.cn/edu/lego_modules/edu-ui/0.0.1/img/nohash/logo_pc_rich.png
// @name         腾讯课堂-增加多个倍速播放、去除xxx正在观看(直播、回放都可以)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  腾讯课堂,默认只有 0.8-2 倍速,现在增加到 4 倍速(2.5、3、3.5、4)、去除xxx正在观看水印。感谢大家的反馈，如果还有什么建议和意见也可以反馈给我，再次感谢！
// @author       Bamboo
// @match        *://ke.qq.com/webcourse/*
// @run-at       document-end
//@note 2020-04-27 增加去除水印功能(直播、回放都支持)--参考脚本：400399

// @downloadURL https://update.greasyfork.org/scripts/402052/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82-%E5%A2%9E%E5%8A%A0%E5%A4%9A%E4%B8%AA%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E3%80%81%E5%8E%BB%E9%99%A4xxx%E6%AD%A3%E5%9C%A8%E8%A7%82%E7%9C%8B%28%E7%9B%B4%E6%92%AD%E3%80%81%E5%9B%9E%E6%94%BE%E9%83%BD%E5%8F%AF%E4%BB%A5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/402052/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82-%E5%A2%9E%E5%8A%A0%E5%A4%9A%E4%B8%AA%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E3%80%81%E5%8E%BB%E9%99%A4xxx%E6%AD%A3%E5%9C%A8%E8%A7%82%E7%9C%8B%28%E7%9B%B4%E6%92%AD%E3%80%81%E5%9B%9E%E6%94%BE%E9%83%BD%E5%8F%AF%E4%BB%A5%29.meta.js
// ==/UserScript==
var Bamboo = {
    /**
    * 根据属性获取标签,列表返回。
    * tagName 要获取元素的标签
    * attrName 属性名
    * attrVal 属性值
    **/
    getDom(tagName, attrName, attrVal) {
        var selectElement = [];
        var element = document.getElementsByTagName(tagName);
        for (var i = 0; i < element.length; i++) {
            var tmpVal = element[i].getAttribute(attrName);
            if (attrVal === tmpVal) {
                selectElement.push(element[i]);
            }
        }

        return selectElement;
    },
    /**
    * 根据父 dom 元素获取子 dom 元素,
    * parentDom 要获取的父 dom 元素
    * tagName 要获取的子 dom 的标签
    * index 要获取子 dom 的索引(第几个元素,默认第 1 个元素-index=0)
    **/
    getChildDom (parentDom, tagName, index) {
        var children = parentDom.getElementsByTagName(tagName);
        if (children) {
            if (index) {
                return children[index]
            }
            return children[0]
        }
        return null;
    }
};

function removeWatermark(){
    var head = document.head
    var style = document.createElement("style")
    style.type = "text/css"
    var css = [
        "a[class*='marquee animation'],txpdiv[class*='player-inject'] {",
        "    display: none!important;",
        "}",
        "#x-tcp-container > txpdiv {",
        "    display: none!important;",
        "}",
         ].join("\n")
    var text = document.createTextNode(css)
    style.appendChild(text)
    head.appendChild(style)
}

function liClickEvent() {
    var tmpList = document.querySelectorAll("[class^='vjs-playback-rate']");
    var tmpUlList;
    for (var i = 0; i < tmpList.length; i++) {
        var tmp = Bamboo.getChildDom(tmpList[i], 'ul');

        if (tmp) {
            tmpUlList = tmp
        }
    }

    var childNodes = tmpUlList.childNodes;
    for(var j = 0;j < childNodes.length; j++){
        var li = childNodes[j];
        var attrVal = li.getAttribute("aria-checked");
        var classAttrVal = li.getAttribute("class");
        if(classAttrVal && classAttrVal.indexOf('vjs-selected') > -1){
            li.setAttribute('class', classAttrVal.substring(0, classAttrVal.indexOf('vjs-selected') - 1));
        }
        if(attrVal == true || attrVal == 'true'){
            li.setAttribute('aria-checked', false);
        }
    }
    var rateVal = document.querySelectorAll("[class^='vjs-playback-rate-value']");
    var classVal = this.getAttribute('class')
    classVal = classVal.concat(" vjs-selected");
    this.setAttribute("class",classVal );
    this.setAttribute("aria-checked", true);

    var selectSpan = Bamboo.getChildDom(this, 'span');
    var selectSpeedText = selectSpan.innerText;
    var selectSpeed = 1;
    rateVal[0].innerText = selectSpeedText;
    if (selectSpeedText) {
        selectSpeed = selectSpeedText.replace(/x/, '')
    }

    var video = document.getElementsByTagName("video")[0] || document.getElementById("videoPlayer") || document.querySelector('video');
    if (video){
        video.play();
        video.playbackRate = selectSpeed;
    }
}

(function () {
    'use strict';
    try {
        removeWatermark();
    } catch(error) {
    }
    setTimeout(function () {
        var ulList;
        //定义播放速度列表
        var extSpeedArr = [0.8, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4];
        var playSpeedList = document.querySelectorAll("[class^='vjs-playback-rate']");
        var button;
        for (var i = 0; i < playSpeedList.length; i++) {
            var tmp = Bamboo.getChildDom(playSpeedList[i], 'ul');
            var tmp1 = Bamboo.getChildDom(playSpeedList[i],'button');
            if (tmp) {
                ulList = tmp
            }
            if (tmp1) {
                button = tmp1;
            }
        }
        ulList.innerHTML = '';

        for (var j = 0; j < extSpeedArr.length; j++) {
            var appendLi = document.createElement('li');
            appendLi.setAttribute('class', 'vjs-menu-item')
            appendLi.setAttribute('tabindex', '-1')
            appendLi.setAttribute('role', 'menuitemcheckbox')
            appendLi.setAttribute('aria-live', 'polite')
            appendLi.setAttribute('aria-disabled', 'false')
            appendLi.setAttribute('aria-checked', 'false')

            var liSpan1 = document.createElement('span');
            liSpan1.setAttribute('class', 'vjs-menu-item-text');
            liSpan1.innerText = extSpeedArr[j] + 'x';
            appendLi.appendChild(liSpan1);

            var liSpan2 = document.createElement('span');
            liSpan2.setAttribute('class', 'vjs-control-text');
            appendLi.appendChild(liSpan1);
            appendLi.appendChild(liSpan2);

            ulList.append(appendLi)

            if (appendLi.addEventListener){
                appendLi.addEventListener("click", liClickEvent, false);
            }
            if (appendLi.attachEvent){
                appendLi.attachEvent("onclick", liClickEvent);
            }
        }
    },5000);
})();
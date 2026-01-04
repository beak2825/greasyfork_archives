// ==UserScript==
// @name         AcFun - 精彩直播报点记录
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  记录直播的精彩瞬间！
// @author       dareomaewa
// @match        https://live.acfun.cn/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acfun.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449878/AcFun%20-%20%E7%B2%BE%E5%BD%A9%E7%9B%B4%E6%92%AD%E6%8A%A5%E7%82%B9%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/449878/AcFun%20-%20%E7%B2%BE%E5%BD%A9%E7%9B%B4%E6%92%AD%E6%8A%A5%E7%82%B9%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        // 如需换键，百度“键盘KeyCode对照表”，修改对应的KeyCode
        keyboard: {
            add: 45, //Ins键
            show: 34, //PgDn键
            hide: 33, //PgUp键
        },
        appendEmpty: false
    }

    window.appendEmpty = config.appendEmpty;

    var idCount = 0;
    const contents = [];

    function StringBuffer() {
        this.__strings__ = [];
    };
    StringBuffer.prototype.Append = function (str) {
        this.__strings__.push(str);
        return this;
    };
    StringBuffer.prototype.ToString = function () {
        return this.__strings__.join('');
    };

    function addChild(fatherNode, childNode, innerHtmlStr) {
        childNode.innerHTML = innerHtmlStr;
        fatherNode.appendChild(childNode);
    }

    function addChildDiv(fatherNode, innerHtmlStr) {
        addChild(fatherNode, document.createElement("div"), innerHtmlStr);
    }

    function addChildStyle(fatherNode, styleStr) {
        addChild(fatherNode, document.createElement("style"), styleStr);
    }

    function formatLiveStartTime(liveStartTime) {
        const timestamp = new Date(liveStartTime);
        return timestamp.getFullYear() + (timestamp.getMonth() < 10 ? '0' + (timestamp.getMonth()+1) : (timestamp.getMonth()+1)) + (timestamp.getDate() < 10 ? '0' + timestamp.getDate() : timestamp.getDate());
    }

    function formatLivePlayDuration (livePlayDuration) {
        const timeSplit = livePlayDuration.split(":");
        if(timeSplit.length === 1) {
            return "00:00:" + livePlayDuration;
        }else if(timeSplit.length === 2) {
            return "00:" + livePlayDuration;
        }else {
            return livePlayDuration;
        }
    }

    function formatLiveCutUrl (liveCutUrl) {
        return liveCutUrl.replace(/https:\/\/onvideo.kuaishou.com\/vangogh\/editor\/(.+)\?source=ac/g, '$1');
    }

    window.tipsHidden = function tipsHidden(id) {
        var tips = document.querySelector('#tips');
        tips.style.display = 'none';
        if (id) {
            var tips_id = document.querySelector('#tips_' + id);
            tips_id.style.display = 'none';
        }
    }

    window.copyTest = function copyTest (text) {
        var aux = document.createElement("textarea");
        aux.style.opacity = "0";
        aux.value = text;
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
    }

    window.copy = function copy (id) {
        const tips = document.querySelector("#tips_" + id );
        tips.style.display = "none";
        const contents = window.contents.filter((e) => e.id === id);
        const content = contents[0];
        const text = document.querySelector("#text_" + id );
        var copgyMsg = "主播: " + content.upName + "\n";
        copgyMsg += "日期: " + content.date + "\n";
        copgyMsg += "爱咔: " + content.aikaNo + "\n";
        copgyMsg += "报点: " + content.livePlayDuration + "\n";;
        copgyMsg += "描述: " + text.value+ "\n";
        window.copyTest(copgyMsg);
        tips.style.display = "inline";
    }

    window.setLivePlayDuration = function setLivePlayDuration (id) {
        window.tipsHidden(id);
        const input = document.querySelector("#input_" + id );
        const contents = window.contents.filter((e) => e.id === id);
        const content = contents[0];
        content.livePlayDuration = input.value;
    }


    window.copyAll = function copyAll () {
        const tips = document.querySelector("#tips");
        tips.style.display = "none";

        var copgyMsgHead = "";
        var copgyMsg = "";
        window.contents.forEach((content, index) => {
            if (index === 0) {
                copgyMsgHead = "主播: " + content.upName + "\n日期: " + content.date + "\n爱咔: " + content.aikaNo + "\n";
            }

            const text = document.querySelector("#text_" + content.id );
            if ((!window.appendEmpty && text.value.length > 0) || window.appendEmpty) {
                copgyMsg += "报点: " + content.livePlayDuration + "\n";;
                copgyMsg += "描述: " + text.value+ "\n";
            }
        });
        window.copyTest(copgyMsgHead + copgyMsg);
        tips.style.display = "inline";
    }

    document.onkeydown = function(event) {
        const cutPoint = document.querySelector('#cutPoint');
        //console.log(event.keyCode);
        if (event.keyCode === config.keyboard.add) {
            event.preventDefault();
            idCount++;
            const controls = window.player.$plugins.filter((e) => e.key === 'controls');
            const control = controls[0];

            if (!cutPoint) {
                const htmlStr = new StringBuffer();
                htmlStr.Append('<div id="cutPoint" style="position: absolute;top: 0%;right: 50%;width: 300px;height: 21%;background-color: rgb(255 255 255 / 92%);z-index: 996;overflow:auto;">');
                htmlStr.Append('    <div id="cutPointContent">');
                htmlStr.Append('    </div>');
                htmlStr.Append('    <hr/>');
                htmlStr.Append('    <div style="padding: 0 0 10px 10px">');
                htmlStr.Append('        <button id="copyAll" type="button" onclick="window.copyAll()">复制全部</button>');
                htmlStr.Append('        <span id="tips" style="padding-left:10px;color:#26b963;display: none;" >复制成功</span>');
                htmlStr.Append('    </div>');
                htmlStr.Append('</div>');

                const main = document.querySelector('.main-content');
                addChildDiv(main, htmlStr.ToString());
                //console.log('cutPoint');
            }

            const newStyle = ".new {" +
                "font-weight: 600;" +
                "font-size: 15px;" +
                "font-family: \"黑体\";" +
                "color: #8c888b;" +
                "background: -webkit-linear-gradient(45deg, #ff1d11, #ff5f00, #f7b600, #ff4b3f, #bed5f5);" +
                "-moz-linear-gradient(45deg, #ff1d11, #ff5f00, #f7b600, #ff4b3f, #bed5f5);" +
                "-ms-linear-gradient(45deg, #ff1d11, #ff5f00, #f7b600, #ff4b3f, #bed5f5);" +
                "color: transparent;" +
                "-webkit-background-clip: text;" +
                "animation: ran 50s linear infinite;" +
                "}  " +
                "@keyframes ran {" +
                "from { backgroud-position: 0 0; } " +
                "to { background-position: 2000px 0;} " +
                "}";
            const headNode = document.querySelector('head');
            addChildStyle(headNode, newStyle);

            const livePlayDuration = formatLivePlayDuration(control._store.livePlayDuration);

            const htmlStr1 = new StringBuffer();
            htmlStr1.Append('        <div>');
            htmlStr1.Append('            <hr/>');
            htmlStr1.Append('            <div style="padding: 0 0 10px 10px"><input id="input_' + idCount + '" type="time" step="1" value="' + livePlayDuration + '" oninput="window.setLivePlayDuration(' + idCount + ')" /><span id="new_' + idCount + '" class="new" style="padding-left:10px;display: none;">new</span><span id="count_' + idCount + '" style="padding-right:10px;color:#26b963;float: right">' + idCount + '</span></div>');
            htmlStr1.Append('            <div style="padding: 0 0 10px 10px"><textarea id="text_' + idCount + '" rows="4" cols="30" value="" oninput="window.tipsHidden(' + idCount + ')" ></textarea></div>');
            htmlStr1.Append('            <div style="padding: 0 0 10px 10px"><button id="btn_' + idCount + '" type="button" onclick="window.copy(' + idCount + ')">复制</button><span id="tips_' + idCount + '" style="padding-left:10px;color:#26b963;display: none;" >复制成功</span></div>');
            htmlStr1.Append('        </div>');

            const cutPointContent = document.querySelector('#cutPointContent');
            addChildDiv(cutPointContent, htmlStr1.ToString());

            //console.log('cutPointContent');

            window.setTimeout(function() {
                const text = document.querySelector("#text_" + idCount );
                text.style = 'border:3px white solid;'
                const input = document.querySelector("#input_" + idCount );
                input.style = 'border:2px #000 solid;'
                const newTips = document.querySelector("#new_" + idCount );
                newTips.style.display = 'inline';
                window.setTimeout(function() {
                    text.style = '';
                    input.style = '';
                    newTips.style.display = 'none';
                },500);
            },100);

            const content = {};
            content.id = idCount;
            content.upName = document.querySelector('.up-name').outerText;
            content.date = formatLiveStartTime(window.player.liveStartTime);
            content.aikaNo = (control._store.liveCutUrl ? formatLiveCutUrl(control._store.liveCutUrl) : "");
            content.livePlayDuration = livePlayDuration;
            contents.push(content);
            window.contents = contents;

            window.tipsHidden();

            if (cutPoint) {
                cutPoint.style.display = 'block';
                cutPoint.scrollTop = cutPoint.scrollHeight;
            }

            const text = document.querySelector('#text_' + idCount);
            if (text.setSelectionRange) {
                text.focus();
                text.setSelectionRange(0,0);
            }

        } else if (event.keyCode === config.keyboard.hide) {
            event.preventDefault();
            if (cutPoint) cutPoint.style.display = 'none';
        } else if (event.keyCode === config.keyboard.show) {
            event.preventDefault();
            if (cutPoint)cutPoint.style.display = 'block';
        }
    }

    window.onbeforeunload = function(e) {
        const ev = window.event || e;
        const cutPoint = document.querySelector('#cutPoint');
        if (cutPoint) {
            if (e) {
                ev.returnValue = ("关闭网页，将不再保存报点记录");
                return "关闭网页，将不再保存报点记录";
            }
        }
    }
})();
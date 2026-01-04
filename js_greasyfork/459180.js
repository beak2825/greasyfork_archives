// ==UserScript==
// @name         Swiss Army Knife
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Swiss Army Knife, impletement some useful tools for self
// @author       You
// @match        *://*/*
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/flat-ui/2.1.3/js/jquery-ui-1.10.3.custom.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flyudesk.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459180/Swiss%20Army%20Knife.user.js
// @updateURL https://update.greasyfork.org/scripts/459180/Swiss%20Army%20Knife.meta.js
// ==/UserScript==

// 解决和原网页jquery版本冲突
var $SAK = jQuery.noConflict(true);


(function() {
    'use strict';
    let addCss = function(styles) {
        var css = document.createElement('style');
        css.type = 'text/css';

        if (css.styleSheet)
            css.styleSheet.cssText = styles;
        else
            css.appendChild(document.createTextNode(styles));

        document.getElementsByTagName("head")[0].appendChild(css);
    }

    let jqUiCss = "https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css"
    addCss(jqUiCss);

    var originTitle = document.title
    var body = $SAK(':root > body')
    var closeStyle = 'position:fixed; z-index:1000; top:100px; right:100px; height:36px; width:36px; overflow:hidden; ' +
        'border:solid1px#826b6b; background-color:#dedede; border-radius:100%';
    var openStyle = 'position:fixed; z-index:1000; top:100px; right:100px; min-height:47px; overflow:auto;' +
        'border:solid1px#826b6b; background-color:#dedede;';
    let svg = '<svg t="1673798366177" style="padding:12%; cursor: grab; width: 70%" id="svg" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1229" data-darkreader-inline-fill=""><path d="M285.6 794.8c-19.1-0.1-34.6-15.7-34.6-34.7v-17.3h-17.3c-19.1-0.1-34.6-15.7-34.6-34.7 0.1-19.1 15.7-34.6 34.7-34.6h17.3v-17.3c0.1-19.1 15.7-34.6 34.7-34.6 19.1 0.1 34.6 15.7 34.6 34.7v17.3h17.3c19.1 0 34.6 15.6 34.6 34.7-0.1 19.1-15.7 34.6-34.7 34.6h-17.3v17.3c-0.1 19.1-15.7 34.6-34.7 34.6z m-25.1-71h9.5v36.3c0 8.6 7 15.6 15.7 15.7 8.5 0 15.6-7 15.6-15.7v-36.2h36.3c8.6 0 15.6-7 15.7-15.7 0-8.6-7-15.6-15.6-15.6h-36.3v-36.3c0-8.6-7-15.6-15.7-15.7-8.5 0-15.6 7-15.6 15.7v36.2h-36.3c-8.6 0-15.6 7-15.7 15.7 0 8.5 7 15.6 15.7 15.6h26.7z" fill="#1afa29" p-id="1230" data-darkreader-inline-fill="" style="--darkreader-inline-fill:#50a354;"></path><path d="M738.2 843.8h-0.4l-68.4-0.1-236-0.3c-6.6 0-12-5.4-12-12s5.4-12 12-12l236 0.3 68.4 0.1h0.3c36.9 0 71-15.7 93.6-43 16.3-19.6 24.8-43 24.8-67.9 0-22.6-7.1-44.4-20.8-63-13.4-18.3-32.1-32.3-54-40.5-6.2-2.3-9.4-9.2-7-15.4 2.3-6.2 9.2-9.4 15.4-7 26.3 9.8 48.8 26.7 65 48.8 16.7 22.8 25.5 49.4 25.4 77.2 0 30.5-10.5 59.3-30.4 83.2-27 32.8-67.8 51.6-111.9 51.6zM362.7 843.1l-83.9-0.1c-39.6 0-76.3-15-103.5-42.2-25.2-25.2-39-58.2-39-93 0.1-74.4 64.1-134.9 142.6-134.9h0.2l459 0.6c6.6 0 12 5.4 12 12s-5.4 12-12 12l-459-0.6h-0.2c-65.3 0-118.5 49.7-118.6 110.9 0 28.3 11.3 55.3 32 76 22.7 22.7 53.4 35.2 86.5 35.2l83.9 0.1c6.6 0 12 5.4 12 12s-5.4 12-12 12z" fill="#1afa29" p-id="1231" data-darkreader-inline-fill="" style="--darkreader-inline-fill:#50a354;"></path><path d="M815.9 607.8l-24-0.2 3-408.6v-7.8h-4.1l-0.1 14-9.6 1.9c-28.5 5.5-52.9 20.5-70.6 43.3-17.7 22.8-27.1 51.2-27.4 82.3l-0.1 17.8 10 0.1 63.3 0.5-0.5 67-0.4 47.9c-0.1 20.7-17 37.4-37.7 37.4h-0.3c-16.5-0.1-30.4-10.9-35.4-25.7l-0.7 95.4-24-0.2 1.2-167.7 46 0.4-0.5 59.9c-0.1 7.5 6 13.7 13.6 13.8h0.1c7.5 0 13.7-6.1 13.7-13.6l0.4-47.9 0.3-43-39.3-0.3-34-0.3 0.3-41.8c0.3-36.4 11.5-69.8 32.4-96.8 19.3-24.9 45.2-42 75.4-50v-2c0-9.1 7.5-16.5 16.7-16.5l18.8 0.1c9.1 0 16.5 7.5 16.5 16.7V199l-3 408.8z m-13.7-416.5s0.1 0 0 0zM477.1 589.3l-55.2-157.8 11.2-4c8-2.9 14.3-8.7 18-16.4 3.6-7.7 4-16.3 1.1-24.3s-8.7-14.3-16.4-18c-7.7-3.6-16.3-4-24.3-1.1-11.9 4.3-20.1 15.2-20.9 27.9l-23.9-1.6c1.4-22.2 15.8-41.4 36.7-48.9 14-5.1 29.1-4.3 42.6 2s23.7 17.5 28.7 31.5c9.1 25.1-1 52.5-22.8 66.1l47.8 136.6-22.6 8zM566.5 587.9l-36-138.7c-14.5-55.9-14.8-113.8-0.9-172l11.2-46.8 88.6 341.2-23.2 6-62-238.6c-2.5 35.3 0.7 70.1 9.5 104.2l36 138.7-23.2 6z" fill="#1afa29" p-id="1232" data-darkreader-inline-fill="" style="--darkreader-inline-fill:#50a354;"></path></svg>'
    var SAK = $SAK("<div>", {
        id: "SAK",
        // draggable: "true",
        style: closeStyle,
        class: "draggable ",
        click: function(){
            $SAK(this).attr("style", openStyle)
            $SAK('#SAK-content').show()
            $SAK('#svg').hide()
        },
        drag: function() {
            console.log('drag')
        },
        dragstart: function() {
            console.log('start')
        }
    })
    var content = '<div id="SAK-content">' +
        '<div>标题: <input id="set-title-input" type="text" style="width:100px" /> <button id="set-title-btn" type="button">设置</button></div>' +
        '<div>时间: <input id="timestamp-input" type="text" style="width:100px" /> <button id="parse-timestamp-btn" type="button">转换</button></div>' +
        "</div>"

    /* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> handlers define scope >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
    let parseTimestamp = function () {
        let str = $SAK('#timestamp-input').val().trim()
        let timestamp = parseInt(str)
        if (isNaN(timestamp) || timestamp < 1000000000) { return }

        timestamp = timestamp < 10000000000 ? timestamp * 1000 : timestamp;
        let now = new Date(timestamp),
            y = now.getFullYear(),
            m = now.getMonth() + 1,
            d = now.getDate();
        let date = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
        $SAK('#timestamp-input').val(date)
    }
    let parseDatetime = function () { Math.round(new Date() / 1000) }
    let setTitle = function() { document.title = $SAK.trim($SAK('#set-title-input').val()); }
    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< handlers define bottom <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


    /* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>> initial >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
    body.append(SAK);
    SAK.append(content);
    SAK.append(svg);
    $SAK('#SAK-content').hide()
    $SAK('#svg').show()
    /* <<<<<<<<<<<<<<<<<<<<<<<<<<<<<< initial <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

    /* >>>>>>>>>>>>>>>>>>>>>>>>>>> 添加 Dom 事件 >>>>>>>>>>>>>>>>>>>>>>>>>> */
    // 全局点击事件，点击 SAK 弹出，否则隐藏
    window.onclick = function(event) {
        if (event.target.id == 'SAK' || $SAK('#SAK').has($SAK(event.target)).length > 0) { // contains
            $SAK('#SAK').attr("style", openStyle);
            $SAK('#svg').hide()
            let allInputs = $SAK('input')
            if (allInputs.val() != "") return
            navigator.clipboard.readText().then(function (text) {
                allInputs.val($SAK.trim(text))
                allInputs.focus()
                allInputs.select()
            });
        } else { // 非窗体处点击
            $SAK('#SAK').attr("style", closeStyle)
            $SAK('#SAK-content').css({"display": "none"})
            $SAK('#svg').show()
        }
    }
    // 设置 title
    $SAK('#set-title-input').keydown(function(e) { e.keyCode == 13 ? setTitle(): null; });
    $SAK('#set-title-btn').click(setTitle)
    // 时间戳转换
    $SAK('#parse-timestamp-btn').click(parseTimestamp)
    /* >>>>>>>>>>>>>>>>>>>>>>>>>>> 添加 Dom 事件 END >>>>>>>>>>>>>>>>>>>>>>>>>> */

    var ondragend1 = function(e){
        return
        e.preventDefault();// 阻止默认事件，以免造成可能的奇怪结果
        // X方向上的处理
        if(e.clientX < panel.offsetWidth/2){
            panel.style.left = "0px";
        }
        else if(e.clientX > body.clientWidth-panel.offsetWidth){
            panel.style.left = body.clientWidth-panel.offsetWidth + "px";
        }
        else {
            panel.style.left = (e.clientX-panel.offsetWidth/2) + "px";
        }
        //Y方向上的处理
        if(e.clientY < panel.offsetWidth/2){
            panel.style.top = "0px";
        }
        else if(e.clientY > body.clientHeight-panel.offsetHeight){
            panel.style.top = body.clientHeight-panel.offsetHeight + "px";
        }
        else {
            panel.style.top = (e.clientY-panel.offsetWidth/2) + "px";
        }
    }
})();
// ==UserScript==
// @name         WeReader
// @namespace    https://github.com/giveme0101/
// @version      2.1
// @description  微信读书 => 微信听书
// @author       Kevin xiajun94@foxmail.com
// @match        https://weread.qq.com/web/reader/*
// @icon0         https://weread.qq.com/favicon.ico
// @icon         data:image/x-icon;base64,AAABAAIAICAAAAEAIACoEAAAJgAAABAQAAABACAAaAQAAM4QAAAoAAAAIAAAAEAAAAABACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////Bv/89GH/+/Wr//r01v/79O//+/X5//v1/v769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0///79f7/+/X5//v07//69Nb/+/Wr//z0Yf///wYAAAAAAAAAAAAAAAAAAAAAAAAAAP/69TT/+vXe/vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT///r13v/69TQAAAAAAAAAAAAAAAD/+vU0//v19v769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//7kw//+5MP//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT///v19v/69TQAAAAA////Bv/69d7++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/+8uP//q9N//6vTf/+8uP//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT///r13v///wb//PRh/vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//758f/+7NX//tWi//6rQ//9oS7//qIu//2qQ//+1aL//uzW//758f/++vT//vr0//769P/++vT//vr0//769P/++vT//vr0//769P/++vT///z0Yf6jLqv+oy///qMv//6iLv/+oy///qIu//6iLv/+oi7//qIu//6iLv/+oi7//aIu//6iLv/9oi7//aIu//6iLv/9oi7//qIu//6iLv/+oy7//qIu//6jLv/+oy7//aIu//6jLv/9oi7//aIu//6jLv/9oi7//qMu//6jLv//oy6r/qIu1v6jLv/+oy7//aMu//6jLv/9oy7//aMu//2iLv/9oy7//aIu//2iLv/+oy///aIu//6jL//+oy///qMv//6jL//+oy///qMv//2jLv/+oy///aMu//2jLv/+oy7//aMu//6jLv/+oy7//aIu//6jLv/9oi7//aIu//+jLtb/oy/v/qQv//6kL//+pC///qQv//6kL//+pC///qQv//6kL//+pC///qQv//6jLv/+pC///qMu//6jLv/9oy7//qMu//2jLv/9oy7//qQv//2jLv/+pC///qQv//6kL//+pC///qQv//6kL//9oy7//qQv//2jLv/9oy7//6Qu7v6lLvn+pC7//qQu//6kLv/+pC7//qQu//6kLv/9pC7//qQu//2kLv/9pC7//qQv//2kLv/+pC///qQv//6kL//+pC///qQv//6kL//9pC7//qQv//2kLv/9xnz//tin//3Kh//+1J7//smE//6xTf/+pC///qQu//6kLv//pS/5/6Yv/v6lL//+pS///qUv//6lL//+pS///qUv//2kLv/+pS///aQu//2kLv/+pC///aQu//6kL//+pC///qUv//6kL//+pS///qUv//6lL//+pS///qUv//7Xov///////////////////////v37//7WoP/9pC7//aQu//+mL/7+pS///qYv//6mL//9pS7//qYv//2lLv/9pS7//qUv//2lLv/+pS///qUv//6mL//+pS///qYv//6mL//9pS///qYv//2lL//9pS///qYv//2lL//+zIj///////////////////////////////////////7Niv/+pi///qUv//6mL//9pS///aUv//6mL//9pS///qYv//6mL//+pi///qYv//6mL//+pi///aUv//6mL//9pS///aUv//6mL//9pS///qYv//6mL//+pi///qYv//705f///////////////////////////////////////u/b//6mL//+pi///qYv//6nL//+py///qcw//6nL//+pzD//qcw//6mL//+pzD//qYv//6mL//+py///qYv//6nL//+py///qYv//6nL//+pi///qYv//6mL//+pi///vjv///////////////////////////////////////++O///qYv//6nL//+py///qcw//6nMP/+py///qcw//6nL//+py///qcv//6nL//+py///qcv//6nL//+py///qcv//6nL//+py///qcv//6nL//+py///qcv//6nL//+4bn///////7AbP/////////////////+wGz///////7iu//+pzD//qcv//6oMP/+py///qcv//6oL//+py///qgv//6oL///qDD//qgv//+oMP//qDD//qgw//+oMP/+qDD//qgw//6nL//+qDD//qcv//6nL//+py///qcv//6vQ//+9ej////////////////////////////+9ur//rBF//6nL//+py///6kw//6oMP/+qDD//qgv//6oMP/+qC///qgv//6oMP/+qC///qgw//6oMP/+qC///qgw//6oL//+qC///qgw//6oL//+qDD//qgw//6oMP/+qDD//qgw//6tPf//2KH//vDc///79v//8Nz//tij//+vP//+qDD//qgw//6oMP/+qTD//qkw//6pMP/+qTD//qkw//6pMP/+qTD//qgv//6pMP/+qC///qgv//+pMP/+qC///6kw//+pMP/+qC///6kw//6oL//+qC///qkw//6oL//+qTD//qkw//6oL//+qTD//qgv//6oL//+qS///qgv//6pL//+qS///qkw//6pMP//qjD//6ow//6pL///qjD//qkv//6pL//+qTD//qkv//6pMP/+qTD//qow//6pMP/+qjD//qow//6pMP/+qjD//qkw//6pMP/+qjD//qkw//6qMP/+qjD//6ow//6qMP//qjD//6ow//6qMP//qjD//qow//6qMP/+qTD//qkw//+qMP//qjD//qow//+qMP/+qjD//qow//+qMP/+qjD//6ow//+qMP/+qjD//6ow//6qMP/+qjD//qow//6qMP/+qjD//qow//6qMP/+qjD//qow//6qMP/+qjD//qow//6qMP/+qjD//qow//6qMP/+qjD//qow//+qMP/+qzD//qow//6qMP/+qjD//qow//6qMP/+qjD//qsw//6qMP/+qzD//qsw//+rMf/+qzD//6sx//+rMf/+qzD//6sx//6rMP/+qzD//6sx//6rMP//qzH//6sx//6rMP//qzH//qsw//6rMP/+qjD//qsw//6qMP/+qjD//qow//+rMf/+qzD//qsw//+sMf/+qzD//6wx//+sMf/+qzD//6wx//6rMP/+qzD//6sx//6rMP//qzH//6sx//6rMP//qzH//qsw//6rMP/+qzD//qsw//6rMP/+qzD//qsw//6rMP/+qzD//qsw//+sMf/+qzD//6wx//+sMf/+qzD//qww//+sMf//rDH//qww//+sMf/+rDD//qww//+sMf/+rDD//6wx//+sMf/+rDD//6wx//6sMP/+rDD//qww//6sMP/+rDD//qww//+sMf/+rDD//6wx//+sMf/+rDD//6wx//6sMP/+rDD//6wx//6sMP//rDH//6wx//6sMP//rTD+/6wx//+sMf/+rDD//6wx//6sMP/+rDD//qww//6sMP/+rDD//qww//+tMf/+rDD//60x//+tMf//rTH//60x//+tMf//rTH//qww//+tMf/+rDD//qww//+sMf/+rDD//6wx//+sMf/+rDD//6wx//6sMP/+rDD//64x/v+tMfn/rTH//60x//+tMf//rTH//60x//+tMf//rTH//60x//+tMf//rTH//q0x//+tMf/+rTH//q0x//6tMP/+rTH//q0w//6tMP//rTH//q0w//+tMf//rTH//60x//+tMf//rTH//60x//6sMP//rTH//qww//6sMP//rTH5/64w7/6tMf/+rTH//60x//6tMf//rTH//60x//6tMP//rTH//q0w//6tMP//rjH//q0w//+uMf//rjH//64x//+uMf//rjH//64x//6tMf//rjH//q0x//6tMf//rjH//q0x//+uMf//rjH//q0x//+uMf/+rTH//q0x//+vMe7/rzLW/64x//+uMf//rjH//64x//+uMf//rjH//q4x//+uMf/+rjH//q4x//6uMf/+rjH//q4x//6uMf//rjH//q4x//+uMf//rjH//64x//+uMf//rjH//64x//+uMf//rjH//64x//+uMf/+rjH//64x//6uMf/+rjH//68y1v+uMav/rzL//68y//6uMf//rzL//q4x//6uMf//rzH//q4x//+vMf//rzH//68y//+vMf//rzL//68y//6uMf//rzL//q4x//6uMf//rzL//q4x//+vMv//rzL//q4x//+vMv/+rjH//q4x//+vMv/+rjH//68y//+vMv//sDGr/7AyYf6vMf/+rzH//68x//6vMf//rzH//68x//+wMv//rzH//7Ay//+wMv/+rzH//7Ay//6vMf/+rzH//68x//6vMf//rzH//68x//+wMv//rzH//7Ay//+wMv//rzH//7Ay//+vMf//rzH//68x//+vMf//rzH//68x//+wMmH/1VUG/7Ez3v+wMv//sDL//7Ay//+wMv//sDL//7Ax//+wMv//sDH//7Ax//+wMv//sDH//7Ay//+wMv//sDH//7Ay//+wMf//sDH//7Ax//+wMf//sDH//7Ax//+wMv//sDH//7Ay//+wMv/+sDH//7Ay//6wMf//sTHe/9VVBgAAAAD/tTY0/7Ez9v+wMf//sTL//7Ax//+wMf//sDH//7Ax//+wMf//sDH//rAx//+wMf/+sDH//rAx//+xMv/+sDH//7Ey//+xMv//sDL//7Ey//+wMv//sDL//7Ey//+wMv//sTL//7Ey//+xMv//sTL//7Ez9v+1NjQAAAAAAAAAAAAAAAD/tTY0/7Iz3v+xMv//sTL//7Ey//+yMv//sTL//7Iy//+yMv//sTL//7Iy//+xMv//sTL//7Ey//+xMv//sTL//7Ey//+xMf//sTL//7Ex//+xMf//sTL//7Ex//+xMv//sTL//rEx//+yM97/tTE0AAAAAAAAAAAAAAAAAAAAAAAAAAD/1VUG/7M1Yf+xMav/sjLW/7Iy7/+xMfn/szL+/7Iy//+yMv//sjL//7Iy//+yMv//sjL//7Iy//+yMv//sjL//7Iy//+yMv//sjL//7My/v+yMvn/szLu/7My1v+zM6v/szVh/9VVBgAAAAAAAAAAAAAAAPgAAB/gAAAHwAAAA4AAAAGAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAGAAAABwAAAA+AAAAf4AAAfKAAAABAAAAAgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+/Y5//v0vf/79O3/+/X9/vr0//769P/++vT//vr0//769P/++vT///v1/f/79O3/+/S9//v2OQAAAAD/+/Y5//v1/f769P/++vT//vr0//769P/++vT//tuw//7br//++vT//vr0//769P/++vT//vr0///79f3/+vY4//v0vf769P/++vT//vr0//769P/++PD//uC6//6oO//+qDv//uC6//748P/++vT//vr0//769P/++vT///v0vf+kLu3+oy7//qMu//2jLv/+oy7//aMu//2jLv/+oy7//aMu//6jLv/+oy7//qQv//6jLv/+pC///qQv//+kLu3/pS/9/aQu//2kLv/+pS///aQu//6lL//+pS///aQu//6lL//9pC7//aQu//6lL//9pC7//qUv//6lL//+pC79/qUv//6mL//+pi///qUv//6mL//+pS///qUv//6mL//+pS///qYv//7nyf/+4bn//uC4//7GfP/+pTD//qYv//6mL//+py///qcv//6mL//+py///qYv//6mL//+pi///qYv//7Vnf///////////////////////tij//6nMP/+qC///qgw//6oMP/+qDD//qgw//6oMP/+qDD//qgw//6oMP/++O7///////////////////////758f/+py///qkv//6pMP/+qTD//qkw//6pMP/+qTD//qkw//6pL//+qTD//ufF//7CbP////////////7CbP/+58b//6kw//+rMP/+qjD//qow//+rMP/+qjD//6sw//+rMP/+qjD//6sw//6wQP/+37L//vju//747//+4LT//rFB//6qMP/+qzD//6wx//+sMf/+qzD//6wx//6rMP/+qzD//qww//6rMP/+rDD//qww//+sMf/+rDD//6wx//+sMf/+qzD//60x/f6sMP/+rDD//q0x//6sMP/+rTH//q0x//+tMf/+rTH//60x//+tMf/+rDD//60x//6sMP/+rDD//60x/f+uMe3/rjH//64x//+uMf//rjH//64x//+uMf//rjH//64x//+uMf//rjH//64x//+uMf//rjH//64x//+uMe3/rzK9/68y//+vMv//rzH//68y//+vMf//rzH//q8x//+vMf/+rzH//q8x//6vMf/+rzH//q8x//6vMf//rzK9/7M2Of+wMf3/sDH//7Ay//+wMf//sDL//7Ay//+xMv//sDL//7Ey//+xMv//sTL//7Ey//+xMv//sTL9/7MxOQAAAAD/tjI4/7Izvf+yMe3/sjL9/7Ex//+xMf//sTL//7Ex//+xMv//sTL//7Ey/f+yM+3/sjO9/7IyOAAAAADAAwAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAADAAwAA
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426754/WeReader.user.js
// @updateURL https://update.greasyfork.org/scripts/426754/WeReader.meta.js
// ==/UserScript==

// Proxy: https://segmentfault.com/a/1190000015483195
// Object.defineProperty: https://segmentfault.com/a/1190000015427628

window.fuckWeRead = {
    fucked : false,
    // 标题
    title : "",
    // 文章内容
    buffer : "",
    // 每个文字坐标
    charMap : {
        canvas: [],
        span: []
    },
    // 是否已暂停
    pause: true,
    // 当前阅读片段索引
    segmentIdx: 0,
    // 阅读片段信息
    segmentInfo: [],
    // 鼠标划线位置坐标
    selection: {},
    audioUrl: "https://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=5.5&text="
};

const inject = () => {

     document.addEventListener("DOMNodeRemoved", function(){

        if (event.target.className && event.target.className.indexOf('preRenderContainer') != -1){
           // console.log('DOMNodeRemoved --> preRenderContainer');
            var afterRefresh = $(event.target).get(0).innerText.replaceAll("\n", "");
            if (afterRefresh.length != window.fuckWeRead.buffer.length){
                window.fuckWeRead.buffer = afterRefresh;
                window.fuckWeRead.fucked = !0;
                setTimeout(contentChange, 100);
            }
        }
    })


     document.querySelector(".readerChapterContent").addEventListener("DOMSubtreeModified",function(){

         if (event.target.className && event.target.className.indexOf('chapterTitle') != -1){
             window.fuckWeRead.title = $(this).find(".chapterTitle").text().trim();
         }

    },false);

    document.querySelector(".renderTargetContainer").addEventListener("DOMSubtreeModified",function(){

         if (event.target.className && event.target.className.indexOf('wr_canvasContainer') != -1){

            var $canvasList = $(this).find("canvas");
            if ($canvasList.length > 0){
                //console.log('DOMSubtreeModified --> wr_canvasContainer');
                window.fuckWeRead.charMap.canvas = [];
                $canvasList.each(function(idx, $this){
                    window.fuckWeRead.charMap.canvas.push(getCanvasMap($this));
                });
            }
         }

    },false);

  document.querySelector("#renderTargetContent").addEventListener("DOMSubtreeModified",function(){

      var $spanList = $(this).find("span.wr_absolute");
      if ($spanList.length > 0){
          // console.log('DOMSubtreeModified --> wr_absolute');
          window.fuckWeRead.charMap.span = [];
          window.fuckWeRead.charMap.span.push(getSpanMap($spanList));
      }

    },false);

    document.addEventListener("DOMNodeInserted",function(){

        // 记录鼠标划线选中位置
        if (event.target.className && event.target.className.indexOf('wr_selection') != -1){
            // console.log('DOMNodeInserted --> wr_selection');
            window.fuckWeRead.selection = {
                x: Math.round($(".wr_selection:first").position().left) ,
                y: Math.round($(".wr_selection:first").position().top)
            };
        }

         // 添加"从此朗读"按钮
        if (event.target.className && event.target.className.indexOf('reader_toolbar_container') != -1){
            //console.log('DOMNodeInserted --> reader_toolbar_container');
            if ($(this).find(".readStart").length == 0){
                var btn = '<button class="toolbarItem readStart"><span style="color:#FFF;">☟</span><span class="toolbarItem_text">从此朗读</span></button>';
                $(this).find('.reader_toolbar_itemContainer').append(btn);
                $(".readStart").on('click', function(){
                    readFromHere(window.fuckWeRead.selection.x, window.fuckWeRead.selection.y);
                });
            }
        }

    },false);
}

const getCharMap = () => {
    return window.fuckWeRead.charMap.canvas.concat(window.fuckWeRead.charMap.span);
}

const readFromHere = (x, y) => {
    var wordIdx = findWordIdx(x, y);
    if (!wordIdx){
        toast("跳转失败！");
        return;
    }

    var segIdx = findCharInSegmentInfo(wordIdx);
    if (!segIdx){
        toast("跳转失败！");
        return;
    }

    window.fuckWeRead.segmentIdx = segIdx;
    $("#playerList .running").attr("src", getUrl());
    $("#playerList .player:not(.running)").each(function(){
        $(this).attr("src", getUrl()).get(0).load();
    });

    $("#playerList .running").get(0).play();
    window.fuckWeRead.pause = !1;
}

const findCharInSegmentInfo = (idx) => {
    var segmentInfo = window.fuckWeRead.segmentInfo;
    for (var i = 0, j = segmentInfo.length; i < j; i++){
        var seg = segmentInfo[i];
        var start = seg.start;
        var end = start + seg.length;
        if (idx >= start && idx <= end){
            return i;
        }
    }
}

const findWordIdx = (x, y) => {
    var map = getCharMap(), idx = 0;
    for(var i = 0, j = map.length; i < j; i++){
        for(var n = 0, seg = map[i], m = seg.length; n < m; n++){
            idx++;
            var _x = seg[n].x,
                _y = seg[n].y;
            if (x == _x && Math.abs(y - _y) < 4){
                return idx;
            }
        }
    }
}

const toast = (text) => {
    $('<div>').appendTo('body').addClass('toast toast_Show').html('WeReader: ' + text).show(100).delay(1500).fadeOut(1000).queue(function(){
        $(this).remove();
    });
}

const getCanvasMap = (canvas) => {
    var map = [], fontSize = 18;
    var context = canvas.getContext("2d");
    if (!context.hasOwnProperty("_fillText")){
        var _fillText = context._fillText = context.fillText;
        context.fillText = function(){
            pushMap(map, arguments[0], arguments[1], arguments[2] - fontSize);
            context._fillText.apply(this, [...arguments])
        }
    }
    return map;
}

const getSpanMap = (spanList) => {

    var textarr = [], map = [];
    spanList.each(function() {
        var $obj = $(this);
        if ($obj.css('transform')) {
            var xy = $obj.css("transform").replace(/[^0-9\-,]/g,'').split(',').slice(4,6);
            textarr.push({
                left: parseInt(xy[0]),
                top: parseInt(xy[1]),
                text: $obj.text()
            });
        }
    })

    _(_.sortBy(textarr, ['top', 'left'])).forEach(function(val) {
        pushMap(map, val['text'], val['left'], val['top']);
    })

    return map;
}

const pushMap = (arr, txt, x, y) => {
    if (txt.length > 1){
        for (var c of txt){
            arr.push({
                txt : c,
                x: x,
                y: y
            });
        }
    } else {
        arr.push({
            txt : txt,
            x: x,
            y: y
        });
    }
}

const getContent = () => {
    var segmentIdx = window.fuckWeRead.segmentIdx++;
    var segmentInfo = window.fuckWeRead.segmentInfo;

    return segmentIdx >= segmentInfo.length ? null : segmentInfo[segmentIdx].content;
}

const getUrl = () => {
    var content = getContent();
    return content ? window.fuckWeRead.audioUrl + content : null;
}

const isSeparator = (char) => {
    return ["。", "；", "…", "？", "！"].indexOf(char) != -1;
}

const renderCover = () => {

    var bufferIdx = window.fuckWeRead.segmentIdx;
    var segmentInfo = window.fuckWeRead.segmentInfo;

    var readIdx = (bufferIdx - 2 < 0) ? 0 : (bufferIdx -2);
    var segment = segmentInfo[readIdx];

    var start = segment.start;
    var end = start + segment.length - 1;

    var pos0 = getPos(start);

    // 忽略第一字是符号的情况
    if (!isHaveText(pos0.txt)){
        pos0 = getPos(start + 1);
    }

    var pos1 = getPos(end);

    drawCover(pos0, pos1);
    scroll(pos0);
}

const scroll = (pos) => {
    $("html,body").animate({ scrollTop: pos.y - 200 }, "slow");
}

const getLine = (txt, left, top, width, height) => {
    return '<div class="wr_underline" style="color: red; left: {{left}}px; top: {{top}}px; width: {{width}}px; height: {{height}}px;">{{txt}}</div>'
        .replace("{{left}}", left)
        .replace("{{top}}", top)
        .replace("{{width}}", (width || 0))
        .replace("{{height}}", (height || 29))
        .replace("{{txt}}", txt);
}

const getLeft = (left, top, width, height) => {
    return getLine("➤", left, top, width, height);
}

const getRight = (left, top, width, height) => {
    return getLine("】", left, top, width, height);
}

const drawCover = (pos0, pos1) => {

    var fontSize = 14,
        span = 5,
        x1 = pos0.x,
        y1 = pos0.y,
        x2 = pos1.x,
        y2 = pos1.y;

    var html = getLeft(x1 - fontSize - span, y1) + getRight(x2 + span, y2);

    var $container = $("#progressContainer");
    if (!$container.get(0)){
        $(".renderTargetContainer").append("<div id = 'progressContainer'></div>");
    }
    $("#progressContainer").html(html);
}

const getPos = (idx) => {

    var _pos = 0, map = getCharMap();

    for (var i in map){

        var segment = map[i];
        if (0 == _pos && idx <= segment.length){
             return segment[idx];
        }

        if (idx <= _pos + segment.length){
            return segment[idx - _pos];
        }

        _pos += segment.length;
    }

    // 返回文章最后一个字
    return map[map.length - 1].slice(-1)[0];
}

const playNextArtical = () => {
    var $btn = $(".readerFooter>div").find("button[class=readerFooter_button]")[0];
    if ($btn){
        var ev = document.createEvent('HTMLEvents');
        ev.clientX = ev.clientY = 356;
        ev.initEvent('click', false, true);
        $btn.dispatchEvent(ev);
    }
}

const playNext = (prevIdx) => {
    var idx = (prevIdx + 1) % $("#playerList .player").length;
    if ($("#playerList .player").eq(idx).attr("src")){
        $("#playerList .player").eq(idx).get(0).play();
        $("#playerList .player").eq(prevIdx).attr("src", getUrl())
            .get(0)
            .load();
    } else {
        window.fuckWeRead.segmentIdx = 0;
        playNextArtical();
    }
}

const play = () => {
    var player = $("#playerList .running").get(0);
    if (window.fuckWeRead.pause){
        player.play();
        window.fuckWeRead.pause = !1;
    } else {
        player.pause();
        window.fuckWeRead.pause = !0;
    }
}

const attachEvent = () => {

    // https://www.cnblogs.com/zhaodz/p/12031500.html
    $("#playerList .player").each(function(_idx, _player){

        $(this).on('play', function(){
            $(this).addClass('running');
            display('暂停');
            renderCover();
        });

        $(this).on('pause', function(){
            display('继续');
        });

        $(this).on('ended', function(){
            $(this).removeClass('running');
            display('播放');
            playNext(_idx);
        });
    });

    $("#fuckPannel").on('click', play);
}

const display = (txt) => {
    $("#fuckPannel span").text(txt);
}

const contentChange = () => {
    contentInit();
    playerInit();
}

const isHaveText = (str) => {
    var test = str.replace(/[\ |\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\…|\！|\？|\<|\.|\>|\/|\?/\，/\。/\；/\：/\“/\”/\》/\《/\|/\{/\}/\、/\!/\~/\`]/g,"");
    return test.length > 0;
}

const contentInit =() => {

    window.fuckWeRead.segmentIdx = 0;
    window.fuckWeRead.segmentInfo = [];

    var buffer = window.fuckWeRead.buffer,
        fixMaxLength = 20,
        readMaxLength = 20,
        contentLength = buffer.length,
        start = 0;

    for(;;){

        var maxEnd = start + readMaxLength;
        maxEnd >= contentLength ? (maxEnd = contentLength) : void(0);

        var segment = [], realContent = "", maxContent = buffer.substring(start, maxEnd);
        for (var char of maxContent){
            segment.push(char);
            if (isSeparator(char)){
                realContent += segment.join("");
                segment = [];
                break;
            }
        }

        if (maxEnd == contentLength){
            realContent += segment.join("");
        }

        if (realContent.length < 1){
            readMaxLength <<= 1;
            continue;
        }

        if (readMaxLength != fixMaxLength){
            readMaxLength = fixMaxLength;
        }

        if (isHaveText(realContent)){
            window.fuckWeRead.segmentInfo.push({
                start: start,
                length: realContent.length,
                content: realContent
            });
        }

        start += realContent.length;
        if (start >= contentLength) {
            break;
        }
    }
}

const getNearWord = (y) => {
    var map = getCharMap(), idx = 0;
    for(var i = 0, j = map.length; i < j; i++){
        for(var n = 0, seg = map[i], m = seg.length; n < m; n++){
            idx++;
            var _y = seg[n].y;
            if (_y > y){
                return idx;
            }
        }
    }
}

const playerInit = () => {

    $("#fuckPannel,#playerList").remove();

    var pannel = '<button id="fuckPannel" class="readerControls_item">' +
        '   <span class style="font-weight: bold; color: #595a5a ;">播放</span>' +
        '</button>';
    var audio = '<div id = "playerList" style="display:none">'+
        '  <audio class="player running" controls="controls" src="{{url}}" >' +
        '    <source class="tts_source" type="audio/mpeg">' +
        '  </audio>'+
        '  <audio class="player" controls="controls" src="{{url}}" >' +
        '    <source class="tts_source" type="audio/mpeg">' +
        '  </audio>'+
        '</div>';

    var t = setInterval(function(){
        if (window.fuckWeRead.fucked){
            clearInterval(t), t = null;

            var wordIdx = getNearWord($('html').scrollTop());
            var segIdx = findCharInSegmentInfo(wordIdx);
            if (segIdx){
                toast("已跳转至上次浏览位置，点击播放");
                window.fuckWeRead.segmentIdx = segIdx;
            }

            $(".readerControls_item").eq(0).before(pannel);
            $(".app_content").append(audio.replaceAll('{{url}}', function(){
                return getUrl();
            }));
            attachEvent();

            !window.fuckWeRead.pause && setTimeout(function(){
                $("#playerList .running").get(0).play();
            }, 1000);
        }
    }, 500);
}

(function() {
    'use strict';
    inject();
})();

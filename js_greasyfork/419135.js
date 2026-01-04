// ==UserScript==
// @name         【中国大学MOOC】回车一键互评
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  mooc自动评分，enter键评分一次作业（默认最高），含自动提交及下一份
// @author       smlW
// @match        *://www.icourse163.org/*
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419135/%E3%80%90%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%E3%80%91%E5%9B%9E%E8%BD%A6%E4%B8%80%E9%94%AE%E4%BA%92%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/419135/%E3%80%90%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%E3%80%91%E5%9B%9E%E8%BD%A6%E4%B8%80%E9%94%AE%E4%BA%92%E8%AF%84.meta.js
// ==/UserScript==
var debug = 1;
var max = 5;
var count = 0;
var myVar;
//鼠标点击模拟代码 抄的
function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
                                  options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
                                  options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}
function extend(destination, source) {
    for (var property in source)
        destination[property] = source[property];
    return destination;
}
var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
};
var defaultOptions = {
    pointerX: Math.round(Math.random()*100),
    pointerY: Math.round(Math.random()*30),
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true,
    detail: 0,
    button: 0,
    screenX: Math.round(Math.random()*1000),
    screenY: Math.round(Math.random()*800)
};

function autoEvaluate(){
    whetherStop();
    if(document.getElementsByClassName("j-gotonext")[0])simulate(document.getElementsByClassName("j-gotonext")[0],"click");
    var a,b;
    var len=$(".s .d:last-child input").length;
    for(var i=0; i<len;i++){
        a=$(".s .d:last-child input").eq(i).val();
        b=$(".s .d:first-child input").eq(i).val();
        if(debug){
            console.log(i);
            console.log(a);
            console.log(b);
        }
        if(a>b)
            $(".s .d:last-child input").eq(i).attr('checked', 'true');
        else
            $(".s .d:first-child input").eq(i).attr('checked', 'true');
    }

    $(".j-textarea.inputtxt").val("好,很有精神");
    $(".u-btn.u-btn-default.f-fl.j-submitbtn").css("background","blue");
    window.scrollTo(0, document.documentElement.scrollHeight-document.documentElement.clientHeight);
    simulate(document.getElementsByClassName("u-btn u-btn-default f-fl j-submitbtn")[0],"click");
}


(function() {
    $(document).keyup(function(event){
        if(debug) console.log("Key: "+event.keyCode);
        if(event.keyCode=="13"){
            count = 0;
            myVar = setInterval(autoEvaluate,800);
        }
    });
})();

function whetherStop(){
    count++;
    if(count>(max-1)*2)clearInterval(myVar); //经验修正值
}
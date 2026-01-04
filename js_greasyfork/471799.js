// ==UserScript==
// @name         听书
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  浏览小说网站，不用看，可以听,点击左侧播放按钮自动播放
// @include       *://www.biquxsw.net/*
// @include       *://www.hetushu.com/*
// @include       *://www.qushuba.net/*
// @require           https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @grant        none
// @license           AGPL License
// @downloadURL https://update.greasyfork.org/scripts/471799/%E5%90%AC%E4%B9%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/471799/%E5%90%AC%E4%B9%A6.meta.js
// ==/UserScript==
/*

浏览小说网站，不用看，可以听。点击左侧播放按钮自动播放，自动跳转下一章。
目前加了三个网站，需要更多功能和建议的话，欢迎跟帖反馈
*/
(function() {
    'use strict';

    // Your code here...

    var callbackdic = new Array();

    callbackdic=[ {host:"www.biquxsw.net", text:"$('#content').text()",jmp:"location=$('#link-next').attr('href')"},{host:"www.hetushu.com", text:"$('#content').text()",jmp:"location=$('#next').attr('href')"},
                { host:"www.qushuba.net", text:"$('#htmlContent').text()",jmp:"location=$('#bottem').children('a')[3]attr('href') "}]
    // 创建一个新的语音合成对象
    const synth = window.speechSynthesis;


    // 创建一个新的语音合成按钮
    var speakerId="speaker"
    var speakercancelId = "speakerstop"
    var  speakerpauseId  = "speakerpause"
  // var  speakerresumeId  = "speakerresume"
    var iconSpeaker ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAeCAIAAABfZYL2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAOoSURBVEhLnZVNKGxhGMeHi+ESi1ESko0ssLGR"+
        "7CyxskDWym5qNpSFjYWNUj7y1ZANG6VQshElKaIsMBYTko98Xvdc2/ub8z9zuO8ZMve/OD3nOe/ze5/3/77nHN9bXH9sWZal+JctPSIgjzQGKf+FTO7r66vqxSXWIxsbkz0qJlV9JpOLnp+f7+/vX15e"+
        "iJXn+tuWgUZ2aQKZ3Kurq7W1tenp6ZWVlWg0KhxzKEAG2in2yOQCbW1tLSsra2homJ+fv729JYk5DjXORRrvFHv0zqUGB6ampvLz830+X1ZWVl1d3dDQ0PHxsdCyWzgGq0q3ij/qnUvl4+Pj7Oxsampq"+
        "SkqK3+/PzMysqKjo7u7e2tqCiBsyhJF0gIjFRQ4lLpM7MzNDs+np6Tk5OQRpaWklJSUtLS3r6+vn5+fqF2LMCMv6yEUOyJbJHR0dpV86RdDpOiMjIzc3t6mpaW5u7u7ujpEfTdAE4iLlkckdGxvDBNDg"+
        "RMdoRPvs5MTExNnZGSAMYTBV4iIHHEeb3PHxcZaPfthiAq7qGnRNTc3AwMDBwQGNg4ZC78hAo0+5dI3cmMaZgwmqq6t7eno2Nzdvbm60jZKBNrnhcFgsEPirWNCftsiXlpZ2dXVx0q+vrx2q51y/c3n2"+
        "9PTEmyYWUASOZjkVZLhmZ2dzxZCioqLGxsbl5WUMEejh4YHOCLhCM7mTk5PiYisIWcytPMnLy9M6sLuwsLCtre3o6EggammW4H+4HAySQOV1bW3tzs4OHynKhROHaxJctenuIS739fWdnJywe5S7e5hc"+
        "v8SIfSMmU1VV1dvbu7u7y7snf6mFmDSXVWsD6ZrlDw4Ocoo5DxQCFU4TIJLf5YLjVm/dwsIC3woOAF84qnCAQDhXSfhbUFDQ3t6+urrK2WKwdl9VevfIqGvyDpcbUpg1MjIChe4AIQzlSqa4uDgUCm1v"+
        "b/OlF5QSyZ2DWHnif7hMq+8kbYLWUSWurKzs7+/f399nvSwfECWMV5BQibkIExAvWH19/fDwMP86LRauOuKlZxqVe2Vy+f7SIFyWHwgEmpub+YNcXl7ySPYRqARbtfyEMrmLi4tYyfkvLy/v7OxcWlq6"+
        "uLjgKXsFBblr/8IEZHIjkUgwGOzo6MDQjY0NcORpje3SSHDyAfFIgVcmlyNxeHi4t7d3enrKFxYKeaQJ6Jery2U+BV6ZXIYiPiU680ixbuUDV1URK/DK4aKYeZYlhPsPJ0PMlM4guwPk3Hymt7e/fiBV/ofFP9UAAAAASUVORK5CYII="
    var iconStop ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAkCAIAAABjfH+IAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAN9SURBVEhL7ZbJSiRBEIar3VvxrAfBEQTBq4qi"+
        "iHryZKPMA+hZ8OBDqC8wgstV8A1ExQUvigoiaLuMMtK0+77Pdb6qv6fKorJmqD548kfS6M6I/4+IzM5M63cIXl9f397eMN4j4vn5WYGKleGTgfrl5QUnefORL53YCBCV4CbqyfAB6qenJ9UhjyxAODyk"+
        "q4/QYnsyEuBbBNykpBcJaDw8PDCKQaqezM3NDbISf3x8JIAv1cNIIF0RYiOg1D0Z6cN7cHCwsrKyurq6vr6+tra2GREbGxtXV1dQoUfqaozFPwHx6+vrqampgYGB7u7uRCLR09PD+D0ient7x8fH9/f3"+
        "1T0VZzmF2uDz3NxcTU1NYWGhZVmxWCw3N1eGEUwZkZOTU1tbOzQ0dH9/jwCV0TdPJp1ODw4OlpSUFBQUKCAej2coTZBPEIQTWF9fv7u7i8zd3R0r7cmkUqn29nb8ioqK8vLyMCgLI8MagMNpAOGMBC4t"+
        "LUFLk+wNLQ1AdU1NTTRK6UBE+SiJNAiRBpGfnw8DsYuLi9ppvrVh/alGuYgdo7i4WKRBOJwGMEUU1bBdtZt9Mqenp21tbWqXy4Kqw2mAHIzQ7PLyMgIAcp8MTWNaGwzgje1wGiCfMBA4OzsrGZbH+91c"+
        "Xl42NjbiQXMZIaK/MoywyULALCQzMzOS8R02Z2dnLS0tHylcIyqU3/z8vJhp1ZfMf/ElkwX+JcPR2draCrWcGLOWsTONxRYWFvSLtGVkgePj446ODpzc49kJycQEodkglB8jh42YfTIXFxfI6HTB2z0L"+
        "wuBwGkCWOq64JDON+nhJ397eNjc364SWN6NSM0JuRihXd20g92TYAnV1dR9lRBcGuRnBLPlx30jGPtMyIu/vR0dHDQ0Nqhc/miYum9IEh9AAMQCqEbP9FpAFkOns7GSaRLj+3IsnDA6VAbwmYCCcLcD1"+
        "rIJ8W6Cvrw8/9pguTews1oa2o1FWVra3twdt5pKWBqCDIyMjFRUVpaWlWiG4spBhqry8vKuriz2FgB6w3s8TbG9vDw8PcxZUVVVVVlZWV1djfAsBDkbw0uvv72f9eQvCyQg8GTSp6eTkhFtvbGxsdHR0"+
        "YmJicnKS0YgfIZienuZhrPcthFRjv9N+/gWvN8bDw8NkMrm1tbWzs8NjGvBMNQJPIwhk1o1lhYD1K3X+CX+fIpM6/wPwiSQUmGDRlwAAAABJRU5ErkJggg=="
   var iconPause =  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAcCAIAAABkl5F2AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAJjSURBVEhL7ZZLq6lRGMe3u4mhWyQMKJSyDQzN"+
      "yCcw8Dl8CiMGysBIUS7F6JgQ24DcSuYyERJyCeE4/2Ot13F5lT3ZndPZv8Hbaz3/9fyfZ630vG+nr+KfcvrJQH8/gd3pcDjs9/vBYPDjzGQy2e12x+ORhs8gNVagHI/HHx8f+Xx+Op2SjXhS0RVPnYrF"+
      "osfj0el0er3e7XbX63WkoGGmD8iazabX6zUYDFqt9v39vVAoYPGuJsKNE6kFun6/j/1isVgkEnE4HLy4XK7FYkFkBMhGo5Hf70eUx+Px+XyJRGI2m4fDIamD6hhunLAZCjwzmYxGo8FmpCDYbLZOp0N1"+
      "55oga7fbdrudy+VCCYRCoUqlyuVyOGqqu+L+9OCELKlUSi6XoxsCcqHYcrl8qRQ2oFarGY3GNwYopVJpPB5/bAj8P07pdFqhUMCA7H/RCXy1E0JEds2307fTLexO+D/BCR7Y/FmnRCJxkV3z1In8c7H5"+
      "U04ymewvdiKnR/iU06v3BBEmHqaGWq0WCAQYBLDB1LBardVqlYoYp0ajgXUIAClIqVQmk8lXpwZStFotp9OJkUOy4AWTEMOeipj51Ov1fD4fpiVKgRNkGL7dbhdRqrvi3gnAbLVaRaNRk8mEnpDFYrHE"+
      "YrHtdksVTE+QZbNZh8OBsQsnNBQIBDabzatOAGaz2axUKoXD4VAoVKlUlsslUtPwGXKjGPm4rUgkEgwG8dEyn8+xDqjoiqdOAIlQNSBnRWMPIIo+1us1LpjVg8DuRCB+AO9wIi93/D7Ecwh+rIILT3t6"+
      "TMGaCIvkA481+ofT6RdueZRJWXmhcQAAAABJRU5ErkJggg=="
    var html='<div id="'+speakerId+'" style="width:25px;padding:10px 0px;text-align:center;position:fixed;top:250px;left:0px;color:#FFF;font-size:0px;cursor:pointer;margin:0px auto;text-align:center;z-index:9999999;"><img src="'+iconSpeaker+'" style="width:20px;"></div>'+
             '<div id="'+speakerpauseId+'" style="width:25px;padding:10px 0px;text-align:center;position:fixed;top:280px;left:0px;color:#FFF;font-size:0px;cursor:pointer;margin:0px auto;text-align:center;z-index:9999999;"><img src="'+iconPause+'" style="width:20px;"></div>'+
          //  '<div id="'+speakerresumeId+'" style="width:25px;padding:10px 0px;text-align:center;position:fixed;top:310px;left:0px;color:#FFF;font-size:0px;cursor:pointer;margin:0px auto;text-align:center;z-index:9999999;"><img src="'+iconStop+'" style="width:20px;"></div>'+
              '<div id="'+speakercancelId+'" style="width:25px;padding:10px 0px;text-align:center;position:fixed;top:310px;left:0px;color:#FFF;font-size:0px;cursor:pointer;margin:0px auto;text-align:center;z-index:9999999;"><img src="'+iconStop+'" style="width:20px;"></div>';                     ;


    function  dospeaker(){
        speechSynthesis.cancel()
        for (let i in callbackdic) {
            var cbs = callbackdic[i]
            if(location.hostname ==cbs.host)
            {
                const text = eval(cbs.text)
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.onend = function (event) {
                    console.log(cbs.jmp )
                    eval(cbs.jmp)
                };
                synth.speak(utterance);


                break
            }
        }
    }
    if($("body")!=null ){
		$("body").append(html);
		$("body").on("click", "#"+speakerId, function(){


               dospeaker()
                       })
        $("body").on("click", "#"+speakerpauseId, function(){
            if(speechSynthesis.speaking)
               speechSynthesis.pause()
             if(speechSynthesis.paused)
                speechSynthesis.resume()
                     })
       /* $("body").on("click", "#"+speakerresumeId, function(){
               speechSynthesis.resume()
                       })*/
        $("body").on("click", "#"+speakercancelId, function(){
               speechSynthesis.cancel()
                       })
    }


})();
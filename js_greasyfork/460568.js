// ==UserScript==
// @name         简历设计网越过VIP打印
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  打印简历不再需要会员，注意！！！！！是点顶部左边的打印，不要点下载！！！！！！！。
// @author       Chi
// @match        https://www.jianlisheji.com/resume/edit/*
// @icon         data:image/jpeg;base64,/9j/4QlQaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/+0ALFBob3Rvc2hvcCAzLjAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/bAIQAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQICAgICAgICAgICAwMDAwMDAwMDAwEBAQEBAQECAQECAgIBAgIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMD/90ABAAI/+4ADkFkb2JlAGTAAAAAAf/AABEIAD8APwMAEQABEQECEQH/xABsAAABBAMBAQAAAAAAAAAAAAAHAAUGCgMECAECAQEAAAAAAAAAAAAAAAAAAAAAEAABBQAABgICAQIHAAAAAAAEAQIDBQYABxESExQVISIxFiNRJCUmM0Fi4REBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAAABEQIRAD8Av8cAHttQbyqubDc8tRqG+tiqIAGzxentDaasuyqO0QuuNrLgUOyZT3Tqc6wC8kkDoJHyivlVGD9HBDrDntlx9NiDJtI3OV9iWTkdlithAmf0GcuLcaI3PWpwhrGOhQCyAdXTTRTygTNsGSxyyMax7gnvznZzjr6mLRCEA6DllY2Y+fjsx5pGEZnTVUUt5BXMldKkJQ2vjhkIRvY7xRtV3VGpwDbfXEs/Pbl3l5BriAITB77XMs4p/HSG2zLDLZ4SkLhbK1xJ0dbZmlxo5rmMbGq/TunUHLPkSWfNvmLNM6VGZqgxOcAhQohR+2wjt9HYluD8vrISS80eLydnf2DInXp1RQKvALgP/9C/xwC4DXLEFOGICOGHMDLhkGKELhjIGJHmascsBEEzXxTQyscrXNcitci9FTgOTt07K0xZd1yvyeaoU5N2DNVu97U0kAVeHWU0ck+u5b1kFANCbrNJdZb2IJg2qotZPINLJ3lxwDqD/u67MaXmjgJ7aA0+p3eHtA8Xrs44wO3x1/TEQ349uBoQCoS6gfSVF10ZIkboHyhRxT9WSoxwbuOm0eB5j6ALmabWkt5gLlanEbgGN4Qersc9UGQTVmnr/BHX5jcnRvc6EcaRwFlFArxUilSQVgdG8AuA/9G/xwGKaaEaJ85EsUEETVfJNNIyKKNqftz5Hq1jGp/dVTgAufpLPmibJnOX1kQBixyZRtfzOqS2RuIeJKsZWT5dmRpK0u2kIYsNhbs6j1jGyQjuef3OCAn0uXz+ez4eWpakOtz4Aqhi1YzFaPHC9z5JXOc5VlmIInkdLLNI5000z3SPc57lcoQfPctsxg5R7om80NrDnq6Spzi6q4aeHj6UnwQS1lIyMURUZPEPBAsxSlGOjiZH5uiuRwODbbA81ANNjDGR2np+ALUZS6CPqLqu8qsLrjZq06IG1EjdNC2cCxHRGeeHyDTeSLuaDVjbu8z99Jy22pM1gYyAk7Ca2fo520zYax+cS2kY1scO2zDJo4zkVGssYHMNhTq4mEUC3wH/0r/HACbRJGRzGoc9pKqr0WX1NDavqRThYTX02hz6smsnFBkNeMVUXNQfGjZHMc4YoZGr1QlvYBMrq2upwRqyoACq60KNIQ6+uFgBBEhRVVIhhBo4oII0VVXta1E++A3eA0rCuAthJALISA4KZ0L5RiWJJDI4eeImBXsd9O8RELXp/wBmpwH36IXu/JemL8j6vo/IevD7vpeb2PT9rs8/q+f8/H3dnf8AfTr98BEOYeYL1GckjqCVA1FITFo8dZJI+NgOoqo5nVqlo1USeqsGzSBnQu/GcEmaP67kVAdcfo4NflqDTDRevHd1Qdg8VX+VwRE0LVLAkkRrEfMAWj4Xr0T82LwH/9O/xwAHspdI3n7iElccmamxvMeCH3Rsqg/yLDMIQ2KtkjITSK2YeN7lerFREhcjk7XI7gCvns//AB/5v/PNDd/NaGz0H+obJLL4j5NYV+DpOkEHo56v8P8Ahhl7/F3u/Jev0DYG3mH/AC01x8uMTCJDIldEHBdu1ryOwfxPOnmIbTRw+R0qObHG53axio781RgOB+SorPT53YmDFSaDKAaCsoyo7a3GEHD1HxPzcZVQKdDTWshHwY3ikLHnlF7HeB0fkl7wwF1V9JoxbCC7m+BWFrS6hZIRlHJg6+KcR8VdLIXCWjlSeKaVqorWujc1O5jglfACjkgnXlhm5WsVkRMt+aMioqdQjtLcGAyN6/uOUOdjmr+laqKn0vAf/9S/xwED3tFfWYVXbZIgIfWZazZc08dkiNrLiFYJg7fNWZLRySAAb2sIkiQmJj3iEthI7JUiWJ4NmZ5uZDQyGVRZa5rZUzKZNNgr90I2sz0t/ZJTU7iq+GWdD6u3t/6ANgI4gA13+zM/76AT+AYrXS0NGWADb2Y1eRZj2xYntK6KFwlGI063KnKc31RBgBHI+SSZ7GIi/vr9cBmOv6Krp5dFaXNVWUEAXyU93Y2AgNTBXpD7KnT2JUsQkIiDp3rI56MRn316ffAByy1h/N4WXM8t/kxshawuH0XNZwswFW6kml9ewreXUhbYSdFeWoqSxRWkEbqwBq+ds00zY4Hgbq+vCqQAaqtGiDrq0MavADgb2wihBwsHFGhb99sUEEbWtT/hE4D/1b/HALgIpo8NkNcTVGaTPVlwZRkOKqCyx0UoCV7Va/wEsVkyRPd2vWNXLGssccnb5I43NCDO5HZFml/klfd8yaVXVc1bLn6PmjvarJTSzERTpcSZsS/jrUu4WxrEwhrGqkTlRUVUarQGmy5W4fX8yMNibAnUbEKlHv8AVbCkut3rrmvrwJa1KzOPuBybqSOKSytSXOFHeqezGPO/seyJytDYdyL5T3/My+o9HkRtfT1GfxOqAqNPY22mpKy3KL1dRIwumvLOxrjELgpICImTwvY2aF0qJ5Oj+A6mREROifSJ+k/t/wCcB7wH/9a/xwC4BcBrmRkTCFQiE+mVKPPGMYsLCfUIfE5sJPryK2OfwSKjuxyojunRfpeA5wxkm8wVc7HhcqwT9mZKtlda122rW0uytZ0igstzf2pIkusZMaS3uURQCJBYGsGgVYYokQCzgMT/AA8CyIsTIrnX6myff7XSMGcL8zdSwxCxRijSTEyA0dJWjwg1wqyP8AY7Ec58rpJHhPuAXAf/2Q==
// @grant        unsafeWindow
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460568/%E7%AE%80%E5%8E%86%E8%AE%BE%E8%AE%A1%E7%BD%91%E8%B6%8A%E8%BF%87VIP%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/460568/%E7%AE%80%E5%8E%86%E8%AE%BE%E8%AE%A1%E7%BD%91%E8%B6%8A%E8%BF%87VIP%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).off("click",".header_bar .print_btn")
    var button=document.getElementsByClassName('print_btn j_print_resume translate_btn')[0]
    button.onclick=()=>{
        alert("请根据指引设置，选择纵向，否则会影响打印的样式")
        layer.photos({
            btn: ['跳过指引并打印'],
            area:["770px","440px"],
            id:"print_tips_layer",
            photos: {"title":"","id":"print_tips_layer","start":0,"data":[{"alt":"","pid":109,"src":"//file.100chui.com/upload/user/image/202007/print_tips_01.png","thumb":""},{"alt":"","pid":110,"src":"//file.100chui.com/upload/user/image/202007/print_tips_02.png","thumb":""},{"alt":"","pid":111,"src":"//file.100chui.com/upload/user/image/202007/print_tips_03.png","thumb":""},{"alt":"","pid":112,"src":"//file.100chui.com/upload/user/image/202007/print_tips_04.png","thumb":""},{"alt":"","pid":113,"src":"//file.100chui.com/upload/user/image/202007/print_tips_05.png","thumb":""}]},
            anim: 7,
            isOutAnim:false,
            yes:function(){
                print_pdf();
                layer.closeAll();
            }
        });

        function print_pdf(){

            var rid=common.utils.get_path_param("rid");
            var iframe = document.createElement("iframe");
            iframe.src = "/resume/preview/"+rid+"/";
            iframe.scrolling ="auto";
            iframe.id="print_iframe"
            iframe.frameborder="0";
            iframe.width="0px";
            iframe.height="0px";
            common.utils.common_loadding(1000);
            if (iframe.onreadystatechange) {
                iframe.onreadystatechange = function(){
                    if (iframe.readyState == "complete"){
                        iframe.contentWindow.print();
                        common.utils.common_loadding_hide();
                    }
                };
            } else {
                iframe.onload = function(){
                    iframe.contentWindow.print();
                    common.utils.common_loadding_hide();
                };
            }
            document.body.appendChild(iframe);
        }
    }
})();
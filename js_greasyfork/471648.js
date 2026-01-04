// ==UserScript==
// @name         USTC研究生选课插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  显示USTC研究生选课人数
// @author       telescopii
// @match        https://jw.ustc.edu.cn/for-std/course-select/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/471648/USTC%E7%A0%94%E7%A9%B6%E7%94%9F%E9%80%89%E8%AF%BE%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/471648/USTC%E7%A0%94%E7%A9%B6%E7%94%9F%E9%80%89%E8%AF%BE%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


var oldxhr=window.XMLHttpRequest
function newobj(){}

window.XMLHttpRequest=function(){
    let tagetobk=new newobj();
    tagetobk.oldxhr=new oldxhr();
    let handle={
        get: function(target, prop, receiver) {
            if(prop==='oldxhr'){
                return Reflect.get(target,prop);
            }
            if(typeof Reflect.get(target.oldxhr,prop)==='function')
            {
                if(Reflect.get(target.oldxhr,prop+'proxy')===undefined)
                {
                    target.oldxhr[prop+'proxy']=(...funcargs)=> {
                        let result=target.oldxhr[prop].call(target.oldxhr,...funcargs)
                        return result;
                    }

                }
                return Reflect.get(target.oldxhr,prop+'proxy')
            }
            if(prop.indexOf('response')!==-1)
            {
                var courses = Reflect.get(target.oldxhr,prop);
                if (courses.startsWith("{")) {
                    var courses_json = JSON.parse(courses);
                    console.log(courses_json);
                    var elements = document.getElementsByClassName('sorting_1');
                    for (var idx = 0;idx < elements.length; idx++){
                    var element = elements[idx];
                        var dataId = element.querySelector('button').getAttribute('data-id');
                        if (dataId in courses_json){
                            var num_selected = courses_json[dataId];
                            const siblingElements = element.parentElement.children; // 14 need to be check
                            var limited_num = element.parentElement.children[14].children[0].getAttribute('limit-count');
                            element.parentElement.children[14].textContent = num_selected + "/"+limited_num;
                        }
                    }
                } else {
                    console.log("The string does not start with '{'.");
                }

                return Reflect.get(target.oldxhr,prop)
            }
            return Reflect.get(target.oldxhr,prop);
        },
        set(target, prop, value) {
            return Reflect.set(target.oldxhr, prop, value);
        },
        has(target, key) {
            debugger;
            return Reflect.has(target.oldxhr,key);
        }
    }

    let ret = new Proxy(tagetobk, handle);

    return ret;
}
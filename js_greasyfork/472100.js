
// ==UserScript==
// @name         js爬取本地变量数据
// @license         GPL-3.0-or-later
// @foo  11
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  js爬取本地变量数据，
// @author       本然
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @include        *
// @downloadURL https://update.greasyfork.org/scripts/472100/js%E7%88%AC%E5%8F%96%E6%9C%AC%E5%9C%B0%E5%8F%98%E9%87%8F%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/472100/js%E7%88%AC%E5%8F%96%E6%9C%AC%E5%9C%B0%E5%8F%98%E9%87%8F%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
 window.globalSearch=(function(){
      'use strict';
      /*该方法遍历传入参数的所有属性

可以用来获取本地变量下的值
该脚本可以直接在浏览器执行，也可以放到油猴里面
使用  

 1. globeSearch.filterKeys=""; 		
 2. globalSearch.globalSearch.searchText="自然数之一"
 3. globalSearch.globalSearch.runSearch("window");
 其中有参数
 filterKeys: [],
    searchText: "",//搜索内容
    methodExe:false,//是否执行无参有返回值方法
    deepLength:20,//递归深度
    可以控制
    */
     let globeSearch = {
    //搜索时需要过滤的路径关键词
    filterKeys: ['["observing"]','rightBtn', 'doSubmit','$options','render','_self','_watcher','_'],
    searchText: "",//搜索内容
    methodExe:false,//是否执行无参有返回值方法
    deepLength:20,//递归深度
    runSearch: function (pathString,currentDeepLength) {//递归方法
       // if(pathString=='temp1["getParams"]') debugger
        currentDeepLength=currentDeepLength||0;
        currentDeepLength+=1;
        if(currentDeepLength>this.deepLength){
         return;
        }
        //用来搜索路径
        let temp="/"+this.searchText+"/gi";
        if (pathString.toLowerCase().includes(this.searchText.toLowerCase())) {
        //if (temp.test(pathString)) {
            //console.log(pathString)
            this.hightLingth(pathString,this.searchText)
        }
//进行防治调用死链

let isMore = /(["[a-z]+"])/g;
let s = new Set();
let count = 0;
        let matched;
while ((matched = isMore.exec(pathString)) !== null) {
    s.add(matched[0]);
    count++;
    // debugger
    if (count / s.size > 8) {
        this.filterKeys.push(pathString.substring(0, pathString.lastIndexOf('[')));
        //  debugger
        // console.log(filterkeys)
        return;
    }
}
        //执行过滤
        if (this.filterKeys.filter((a) => pathString.indexOf(a) > -1).length > 0) {
            return;
        }

        //用来调试
        // Object.keys(WfForm).forEach((childAttr) => {
        //     let temp = pathString + '["' + childAttr + '"]';
        //     if (pathString == 'WfForm["' + childAttr + '"]') {
        //         //console.log("函数式",pathString)
        //         // debugger
        //     }
        // })
        try {
            if (eval(pathString) != null || eval(pathString) != undefined) {

                let type = eval('typeof ' + pathString);

                if (type == 'function') {

                    let command = pathString;

                    let hasReturn = /return |native code|[(][)]=>/;


                    //执行参数为0且有返回值的函数，并递归其返回值
                    if (this.methodExe==true&&eval(command + '.length') == 0 && hasReturn.test(eval(command + '.toString()'))) {
                      //  console.log("aaaaaaaaaaaa"+command)
                    //    debugger
                        this.runSearch(command + "()",currentDeepLength);
                    }


                } else if (type == 'object') {
                    if (eval(pathString) instanceof Array) {

                        for (let a = 0; a < eval(pathString).length; a++) {
                            let command = pathString + '[' + a + ']';
                            ////console.log("Array" + command);

                            this.runSearch(command,currentDeepLength);
                        }
                    } else {
                        ////console.log("eval(pathString)", eval(pathString));
                        Object.keys(eval(pathString)).forEach((childAttr) => {
                            let command = pathString + '["' + childAttr + '"]';
                            this.runSearch(command,currentDeepLength);
                        })
                    }
                } else {
                        let temp="/"+this.searchText+"/gi"
                         if (pathString.toLowerCase().includes(this.searchText.toLowerCase()) || (eval(pathString) + "").toLowerCase().includes(this.searchText.toLowerCase())) {
                    //if (temp.test(pathString) || temp.test((eval(pathString) + ""))) {
                        //console.log("---------------------------------" + pathString);
                             this.hightLingth("---------------------------------"+pathString,this.searchText)
                        console.log(eval(pathString));
                    }
                }
            }
        } catch (e) {
            console.error(e)
            console.error(pathString)
        }
    },
         hightLingth:function(str,highlightChar){
const regex = new RegExp(highlightChar, "g");
const highlightedStr = str.replace(regex, `%c${highlightChar}%c`);

const highlightStyle = "color: red; font-weight: bold;";
console.log(highlightedStr, highlightStyle, "");

         }

}

     return {globalSearch:globeSearch}})(window)
// ==UserScript==
// @name         长沙理工普通作业
// @namespace    http://tampermonkey.net/
// @version      0.13
// @license      MIT
// @description  长沙理工继续教育学院
// @author       HellSherry
// @match       *://*.edu-edu.com/*
// @match        https://csustcj.edu-edu.com.cn/System/OnlineLearningNew/OnlineLearningNewIndex*
// @match        https://csustcj.edu-edu.com.cn/MyOnlineCourseNew/OnlineLearningNew/OnlineLearningNewIndex*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu-edu.com
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/516630/%E9%95%BF%E6%B2%99%E7%90%86%E5%B7%A5%E6%99%AE%E9%80%9A%E4%BD%9C%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/516630/%E9%95%BF%E6%B2%99%E7%90%86%E5%B7%A5%E6%99%AE%E9%80%9A%E4%BD%9C%E4%B8%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
const umsg = (function () {
    const position = { 1: "bottom:-0.7em;left:7.2em;", 2: "bottom:-0.7em;left:50%;", 3: "bottom:-0.7em;right:-6.2em;", 4: "top:50%;left:7.2em;", 5: "top:50%;left:50%;", 6: "top:50%;right:-6.2em;", 7: "top:2em;left:7.2em;", 8: "top:2em;left:50%;", 9: "top:2em;right:-6.2em;" };
    // prettier-ignore
    const show = (msg, duration, pos, bgc) => {
        let m = document.createElement("div");
        const conf = umsg.conf;
        m.style.cssText = `background-color: ${bgc};${position[pos ?? conf.pos ?? 5]}` + "position: fixed;padding:10px 20px;z-index:99999;width: 200px;max-height: 70%;overflow: auto; color: white;word-break: break-all;text-align: center;border-radius: 5px;transform: translate(-50%, -50%);pointer-events: all;font-size: 15px;line-height: 1.5;box-sizing: border-box;";
        m.style.cssText += conf.style ?? "";
        m.innerHTML = msg;
        (conf.selector || document.body)?.appendChild(m);
        setTimeout(() => {
          let d = 0.5;
          m.style.transition = "transform " + d + "s ease-in, opacity " + d + "s ease-in";
          m.style.webkitTransition = "-webkit-transform " + d + "s ease-in, opacity " + d + "s ease-in";
          m.style.opacity = "0";
          setTimeout(() => m.remove(), d * 1000);
        }, duration ?? conf.duration ?? 2000);
      };
    return {
      conf: { duration: 2000, pos: 1, selector: document.body, style: "" },
      info: (msg, duration, pos) => show(msg, duration, pos, "rgba(0, 0, 0, 0.77)"),
      success: (msg, duration, pos) => show(msg, duration, pos, "rgba(50, 198, 130, 0.77)"),
      warning: (msg, duration, pos) => show(msg, duration, pos, "rgba(238, 191, 49, 0.77)"),
      error: (msg, duration, pos) => show(msg, duration, pos, "rgba(255, 85, 73, 0.77)"),
    };
  })();
  var sdss;
function copyText(tex){
    umsg.success("copy success", 600,8);
    GM_setClipboard(document.querySelector("#"+tex+" > div > div").innerHTML.replace(/[ ]|[\r\n]/g,"%").replace(/<img.*?>/g, "%img%").replaceAll('&nbsp;','%').trim ());
console.log(document.querySelector("#sss"))

}function copyTextOnly(tex){
    umsg.success("copy success", 600,8);
    GM_setClipboard(document.querySelector("#"+tex+" > div > div").innerHTML.replace(/[ ]|[\r\n]/g,"").replace(/<img.*?>/g, "").replaceAll('&nbsp;','').trim ());
}
function copyAnswerOnly(tex){
    umsg.success("copy success", 600,8);
    GM_setClipboard(document.querySelector("#"+tex+" > ul").innerText.replace(/[ ]|[\r\n]/g,"").replaceAll('&nbsp;','').trim ());
}
    function copyTextandAnswer(tex){
        let pp=document.createElement('ul');
   pp.innerHTML= document.querySelector("#"+tex+" > ul").innerHTML.replace(/<img.*?>/g, "%img%");
         Array.from(pp.children).forEach(itemm => {
         itemm.children[0].innerText='%'+itemm.children[0].innerText+'%'
         })
console.log(pp.innerText)
    umsg.success("copy success", 600,8);
    GM_setClipboard(pp.innerText.replace(/[ ]|[\r\n]/g,"%").replaceAll('&nbsp;','%').trim ());
}
    unsafeWindow.copyText=copyText;
    unsafeWindow.copyAnswerOnly=copyAnswerOnly;
    unsafeWindow.copyTextOnly=copyTextOnly;
    unsafeWindow.copyTextandAnswer=copyTextandAnswer;
if (window.location.href.indexOf("doview") !== -1)
    {



    let answer = {}
    var ifdoucument;

    document.querySelector("#ui_wrapper > div > div.ui-iframe-wrapper > iframe").onload = () => {
        setTimeout(() => {

            ifdoucument = document.querySelector("#ui_wrapper > div > div.ui-iframe-wrapper > iframe").contentWindow.document;

            Array.from(ifdoucument.getElementsByClassName("ui-correct-answer")).forEach(e => {
                if (answer[e.parentElement.parentElement.getAttribute("code")] == undefined) {
                    answer[e.parentElement.parentElement.getAttribute("code")] = e.getAttribute("code");
                } else {
                    answer[e.parentElement.parentElement.getAttribute("code")] += e.getAttribute("code");
                }


            })


            document.querySelector("#ui_wrapper").innerHTML = JSON.stringify(answer)

            Object.keys(answer).forEach(s => {
                console.log(s)
                console.log(answer[s])
                //     fetch("http://localhost:8080/cslg/add?id="+s+"&answer="+answer[s])
                // .then(response => response.text())
                //.then(result => console.log(result))

            })
        }, 1000);
    }




}else if (window.location.href.indexOf("exam/student/exam2/doexam") !== -1) {

}





var answers =
    { "psq_1090560": "c", "psq_1090561": "a", "psq_1090562": "c", "psq_1090563": "a", "psq_1090564": "a", "psq_1090565": "d", "psq_1090566": "a", "psq_1090567": "a", "psq_1090568": "b", "psq_1090569": "d", "psq_1090570": "d", "psq_1090571": "d", "psq_1090572": "c", "psq_1090573": "b", "psq_1090574": "b", "psq_1090575": "a", "psq_1090576": "a", "psq_1090577": "c", "psq_1090578": "a", "psq_1090579": "a", "psq_1090580": "a", "psq_1090581": "a", "psq_1090582": "b", "psq_1090583": "a", "psq_1090584": "b", "psq_1090585": "b", "psq_1090586": "b", "psq_1090587": "d", "psq_1090588": "c", "psq_1090589": "c", "psq_1090590": "a", "psq_1090591": "a", "psq_1090592": "b", "psq_1090593": "b", "psq_1090594": "b", "psq_1090595": "b", "psq_1090596": "a", "psq_1090597": "a", "psq_1090598": "b", "psq_1090599": "b" }
// Your code here...

if (window.location.href.indexOf("doexam") !== -1) {



    document.querySelector("#ui_wrapper > div.ui-main > div.ui-iframe-wrapper > iframe").onload = () => {

    if (document.querySelector("#ui_wrapper > div.ui-main > div.ui-iframe-wrapper > iframe").contentWindow.document.querySelector("body > center > div.ui-paper-wrapper > h1").innerText.indexOf("期末") !== -1)
    {
             let style = document.createElement('style')
            style.type = 'text/css';
            style.innerHTML = `
         #app .ui-correct-answer{
         background-color: rgba(127, 255, 212, 0.82);
            border-radius: 12px;
        }
       #app li{
            list-style-type: none;
            padding: 6px;
            padding-left: 22px;
            margin-left: -32px;
        }


           #app .ui-question-title>span{
         display:none !important;
        }


            `
            document.querySelector('head').appendChild(style)


        let script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.src = "https://cdn.jsdelivr.net/npm/vue@3";
document.documentElement.appendChild(script);
//引入element-plus的CSS样式文件
let link = document.createElement("link");
link.setAttribute("rel", "stylesheet");
link.href = "https://unpkg.com/element-plus/dist/index.css";
document.documentElement.appendChild(link);
//引入element-plus的JS文件
let elscript = document.createElement("script");
elscript.setAttribute("type", "text/javascript");
elscript.src = "https://unpkg.com/element-plus";
document.documentElement.appendChild(elscript);
window.onload = () => {
  let text = `<div id="app" >
   <el-button v-loading.fullscreen.lock="fullscreenLoading"      element-loading-background="rgba(122, 122, 122, 0.4)"
 element-loading-svg='<path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>'
    class="custom-loading-svg"
    element-loading-svg-view-box="-10, -10, 50, 50" size="small" @click="text">复制题目</el-button>
   <el-button size="small" @click="answer">选项</el-button>
   <el-button size="small" @click="textonly">仅题目</el-button>
   <el-button size="small" @click="answeronly">仅选项</el-button>
    <el-button size="small" @click="selectbytext" type="primary">直接查</el-button>
   <el-drawer
   size="22%"
    v-model="drawer"
   >

  <template #title>
    <div    class="card-header">
                 Powered by       <el-link type="primary" @click="opencslg">cslg.sherry.cloudns.ph</el-link>


      </div>

    </template>
   <el-card  style="margin-bottom: 1.4vh" v-for="item in datalist" style="max-width: 480px">
    <template #header>
                     正确答案： <el-button style="font-size: 16px" size="small" type="success" plain>{{item.answer}}</el-button>


    </template>
             <div v-html="item.questions"></div>
  </el-card>





  </el-drawer>

    </div>`;
var aaa='bbbbb'
  var el = document.createElement("div");
  el.innerHTML = text;
     document.querySelector("#ui_wrapper > div.ui-main > div.ui-card-panel > div.ui-card-title.ui-right-component").append(el);
  const App = {
mounted() {

      console.log("李部长是cz")
    //将Vue方法传到全局对象window中

},
         methods: {
             opencslg(){
             window.open('https://cslg.sherry.cloudns.ph');
             },
             text(){
              umsg.success("copy success", 600,8);
    GM_setClipboard(document.querySelector("#ui_wrapper > div > div.ui-iframe-wrapper > iframe").contentWindow.document.querySelector("#"+document.getElementsByClassName("current")[0].id+" > div > div").innerHTML.replace(/[ ]|[\r\n]/g,"%").replace(/<img.*?>/g, "%img%").replaceAll('&nbsp;','%').trim ());
             },textonly(tex){
    umsg.success("copy success", 600,8);
    GM_setClipboard(document.querySelector("#ui_wrapper > div > div.ui-iframe-wrapper > iframe").contentWindow.document.querySelector("#"+document.getElementsByClassName("current")[0].id+" > div > div").innerHTML.replace(/[ ]|[\r\n]/g,"").replace(/<img.*?>/g, "").replaceAll('&nbsp;','').trim ());
}
,answeronly(tex){
    umsg.success("copy success", 600,8);
    GM_setClipboard(document.querySelector("#ui_wrapper > div > div.ui-iframe-wrapper > iframe").contentWindow.document.querySelector("#"+document.getElementsByClassName("current")[0].id+" > ul").innerText.replace(/[ ]|[\r\n]/g,"").replaceAll('&nbsp;','').trim ());
},
    answer(tex){
        let pp=document.createElement('ul');
   pp.innerHTML= document.querySelector("#ui_wrapper > div > div.ui-iframe-wrapper > iframe").contentWindow.document.querySelector("#"+document.getElementsByClassName("current")[0].id+" > ul").innerHTML.replace(/<img.*?>/g, "%img%");
         Array.from(pp.children).forEach(itemm => {
         itemm.children[0].innerText='%'+itemm.children[0].innerText+'%'
         })
console.log(pp.innerText)
    umsg.success("copy success", 600,8);
    GM_setClipboard(pp.innerText.replace(/[ ]|[\r\n]/g,"%").replaceAll('&nbsp;','%').trim ());
},selectbytext(){
       this.fullscreenLoading=true

fetch("https://cslg.sherry.cloudns.ph/api", {
    method: 'POST',
     body: document.querySelector("#ui_wrapper > div > div.ui-iframe-wrapper > iframe").contentWindow.document.querySelector("#"+document.getElementsByClassName("current")[0].id+" > div > div").innerHTML.replace(/[ ]|[\r\n]/g,"%").replace(/<img.*?>/g, "%img%").replaceAll('&nbsp;','%').trim (),
    redirect: 'follow'
})
   .then(response => response.text())
   .then(result =>{

     this.datalist=JSON.parse(result).data


      } )
   .catch(error => console.log('error', error)).finally(a=>{this.fullscreenLoading=false; this.drawer = true;});
},

      sds(a){

        this.drawer = true;
            this.message=aaa
         }

         },
    data() {
      return {
          fullscreenLoading:false,
          datalist:[
  {
    "answer": "c",
    "questions": " \n      <div class=\"ui-question-title\"> \n       <span class=\"ui-question-serial-no\">1.30</span> \n       <span class=\"ui-question-action-bar\"><span class=\"ui-question-score\">1</span></span> \n       <div class=\"ui-question-content-wrapper\">\n        <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ8AAAAbCAYAAABiOl0uAAAAAXNSR0IArs4c6QAAA5lJREFUeF7tmjFy6jAQhn+f4l0gNJmcIJyA0NO+Li5Nky5lutfgknSvpSc+ATlBJkXgAu8UfmMbM4qy0q6MjJKZpWFiLP1i9fnfXZGsrusa+tIIJIhApvAliLpKthFQ+BSEZBFQ+JKFXoUVPmUgWQQUvmShV2GFT8hAlmWwDwaoa/109mfN365XyLy+5fo0+nHf6XAjKnyHcorJ8gYv9Roz4aamv+2AcjrBEivsdwWuHAsKha/t5hhgXfCaEPWwUGCFQut7WDioQ6CV6kSE77iJNy+o1z8FvQp5dofnJvK3bvgkkFDOwo2jNtQcQ7mnCSMFH/cwh0DkeoA4Dem46PC9P9b4Mewdo9g69mZBOp/LcThXszdIknZ94NkbGqovBcJct9TBXDBy4yPCVyGffuDBk7okT0yKezj4TLfoIeJci4KPci1JbdiMs8Fs5h/b+Th4uL3ixn+Gr8qR3TVJ6Bar/Q5FUwD1134B+Gelp+azp+ujY1QoywmKdlCcV5Vn6JZjpMRPmnF0QuFzpa4+2K6aTQqfCZsv9cb59vQsHDhSbW9TRv281m7G+yP210/t+6mGa0GE0VAcUOZbzNfuQl26SOd9Qs0TqK6J7t216FD4ODAot6KWZzsrBZ8J9hDHs3W52i8ZfDiUmE6WwGqPnelk7fUNFr0rQuZ254DRrSVcMwR6Dj7fxg1pELgxlJ6k2/Wl+pB4DKkPh9R9jpqv61y/Ng9dd4iXrqk4lCX2RTHyscr4mhx8lDP1weZA4lKtyz3tFO7rcqm1nAtQMuc7lDn+vL/hGUbKbb+hAcKkRL6dYx2xxqOfHpnmOe56DnzmmrmjEZc7SNKuCzBOPzTd+uaL7Z5fna/KMf14wG6+xfQ38HdXAGWO7XyN4qpzxM1ihZsNLtTZjq/ZgvtGn/NxdR23+UOcL2STpa4cMqcEdMl8nHue4Ot+nXgFToX58dD4tWk2+9qvv3Z/wV8xxtQ0DpnbaBpd/jG6Y8JHHdvYjUUsfQks1D0cQENqvRPcof9MWlUVZrPL/oKRQtN8+qWpi6r/QjdvKHxUNxyqfQ5IQ9I1f8jcdJtt+p1jSzYhQ58pz7gUmo7lSJzHdjBqDBcl+yC5bxiad19q7e+jDsJ9mtxRC7feGJ/L4Jss8UqkpBgLIOc4HvVcVHO0L6MTOx01NO1qKDUCsSLAO18sJZ1HI2BFQOFTJJJFQOFLFnoVVviUgWQRUPiShV6F/wNIv4Td24WwUAAAAABJRU5ErkJggg==\">\n       </div> \n      <span class=\"ui-question-answer-error\">您没有作答</span></div> \n      <ul class=\"ui-question-options\"> \n       <li code=\"a\"> <span class=\"ui-question-options-order\" style=\"\">a</span>\n        <div class=\"ui-question-content-wrapper\" style=\"\">\n         y=Cx\n        </div> </li> \n       <li code=\"b\"> <span class=\"ui-question-options-order\" style=\"\">b</span>\n        <div class=\"ui-question-content-wrapper\" style=\"\">\n         x（y+1）=C\n        </div> </li> \n       <li code=\"c\" class=\"ui-correct-answer\"> <span class=\"ui-question-options-order\" style=\"\">c</span>\n        <div class=\"ui-question-content-wrapper\" style=\"\">\n         y+1=Cx\n        </div> </li> \n       <li code=\"d\"> <span class=\"ui-question-options-order\" style=\"\">d</span>\n        <div class=\"ui-question-content-wrapper\" style=\"\">\n         <img src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAAAcCAYAAABS4YBpAAAAAXNSR0IArs4c6QAAA0dJREFUaEPtWDuWokAUvexlmMDTK5AVqImR6WRWiImZoVknVojZpEYmygpwBR4DYS/MqeIPBf0KaQ/NYNhd1Hvv3nffp4wwDEOMv0EgYIxkDoJHGcRI5nC4HMkcEJcjmSOZcMGMOY4Apgcfnv1rSJgQYuln/K16ZsA5fNvGTJJ6xjJ0MCNAMJQjfY2/FZl5Ulxm4bn18N+JMwahT/G/TibnMG0b3Rfad6s+ALdMbHCA74l4aPbdb4s/k4zLDMxFT5O/KQ6+B9tnYHDg5Eria2S61Qs7KaUugzEHrm8r31kPxDQhE0DAYZknrAR4qmz9rvgTECUOR2B9RZiyFifdLSY151d7MoWh8zJnpIlG4cAnfnuU3kpTBD1p6LYDbsE8rWJlxhYkoQ/syomlFT/d2/RkTOT6GhbUF/3fBbOe2MoKkv1akSmD3tzSW9QG8wHQARUlZT/pckKm21aSKQVqwXzs0sTVj1+TTJlAG9wKiixMKmAMcPI1VvkClEg7qc2C+uRv+RKk5R8VUKHKPSaKspb2jbwPwq/9pKikil9U2zFpZWWK++rUqYUB/XCULIh6o8YwUqvMJBv9yb6QlXSXWijzq15Z+X8Azi5YOE0DWAdkxns1lCWvGZHi8KI4W1FfeRCjI15fZmOpo+WjgH4QsTI2H/WDT2UgccG5CbuUvm1sRwJU9MykRxlz3FtiQacj7ofiQaa2xNbf1tAzowx57FQNWM89gKaOqLw0kFlSSLa8dzN8DZbMgDN8Pu44Imv8uhRm52lkRr25aSWJVghZ7kwOdlnA+bKpEG0TlPmeMitGFLFXrmsqVH1rUSvTZbCeW3iLC6w/wF/PBjjDZeFoNWRtMqXy1ANQdFdULU6rAz5OqIzm6mSjkylBvOf2zOTCNw9A0cC1wQ1lQpvxKZCZjtxpvU4W1Fcf1PUArV9NEn/qslZFJ8V27tFAXlFcyMurSfsKpfNlhn32VXPcrfZMHZf0zzZnn+u6mM3e+azf9SOGPiLUL3pIZukZDTwu9QtcOhvIqPDkevQ784fqXulcP8lM14Ezlv4Ee9k/qm+RLWMmfvZzFJkE1GMyiZiPx1IERjIHlAwjmSOZA0JgQKGMyhzJHBACAwrlH1w6hMuTHhWEAAAAAElFTkSuQmCC\">\n        </div> </li> \n      </ul> \n     "
  }],
          drawer :false,
        message: "Hello Element Plus",
      };
    },
  };
  const app = Vue.createApp(App);
  app.use(ElementPlus);
  app.mount("#app");
};
            Array.from(document.querySelector("#ui_wrapper > div.ui-main > div.ui-iframe-wrapper > iframe").contentWindow.document.getElementsByClassName("ui-question")).forEach(

                e => {
    e.children[0].innerHTML=e.children[0].innerHTML+`<button onclick="copyText('${e.id}')" >复制题目</button><button onclick="copyTextandAnswer('${e.id}')" >复制选项</button><button onclick="copyTextOnly('${e.id}')" >复制纯文本</button><button onclick="copyAnswerOnly('${e.id}')" >复制选项文本</button>`


                })
        }   else
    {
        answers = JSON.parse(window.prompt("输入JSON字符", ""))

            Array.from(document.querySelector("#ui_wrapper > div.ui-main > div.ui-iframe-wrapper > iframe").contentWindow.document.getElementsByClassName("ui-question")).forEach(

                e => {

                    if (answers[e.getAttribute("code")] != null) clickElements(e, answers[e.getAttribute("code")]);


                })
        }

    }



    function clickElements(elem, nums) {
        elem.setAttribute("title", nums);

        let ti = 0
        if (
            nums.indexOf("参考答案") !== -1) {
            nums = nums.replace("参考答案：", "")
            ti = 300 + ti;
            setTimeout(() => {
                elem.children[3].children[1].children[0].contentWindow.document.querySelector("body").innerText = nums
                elem.children[3].children[1].children[0].contentWindow.document.querySelector("body").click()


                // elem.parentElement.onclick=function(){
                //  window.alert(nums);
                // }
            }, ti);
        } else {
            nums.split('').forEach(
                (s) => {
                    ti = 300 + ti;
                    setTimeout(() => {

                        if (elem.lastElementChild.children[getNum(s)].className !== 'ui-option-selected') elem.lastElementChild.children[getNum(s)].children[0].click();

                    }, ti);

                })
        }
        setTimeout(() => {
            __ExamIns.offsetQuestion(1)
        }, 100);

    }
    function getNum(num) {
        switch (num) {
            case 'a':
                return 0;
            case 'b':
                return 1;
            case 'c':
                return 2;
            case 'd':
                return 3;
            case 'e':
                return 4;
            case 'f':
                return 5;
            case 'g':
                return 6;

        }
    }


}
else if (window.location.href.indexOf("OnlineLearningNew/OnlineLearningNewIndex") !== -1) {

    setTimeout(() => {
        Array.from(document.getElementsByClassName("single-lists")).forEach(e => {
            let aa = e.children[1].children[0].children[0].children[0].getAttribute("onclick").toString()

            e.innerHTML = e.innerHTML + `<button onclick="window.open(
'https://csustcj.edu-edu.com.cn/MyOnlineCourseNew/OnlineLearningNew/StudentSiteNewExIndex?termcourseID=`+ aa.substring(aa.lastIndexOf(',') + 2, aa.lastIndexOf("'")) + `&type=3#',
'单独窗口',
'height=30000,width=60000,top=0,left=0,toolbar=no,menubar=no, scrollbars=no,resizable=no,location=no, status=no'
)">强制开始期末考试</button>`


        })
    }, 3000)


}


})();
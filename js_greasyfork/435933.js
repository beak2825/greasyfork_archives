// ==UserScript==
// @name         国开老平台采集回顾试题答案
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  采集国开形考任务的回顾试题数据。应该没有什么用处了。
// @author       Delfino
// @match        http://hebei.ouchn.cn/mod/quiz/review.php?attempt=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435933/%E5%9B%BD%E5%BC%80%E8%80%81%E5%B9%B3%E5%8F%B0%E9%87%87%E9%9B%86%E5%9B%9E%E9%A1%BE%E8%AF%95%E9%A2%98%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/435933/%E5%9B%BD%E5%BC%80%E8%80%81%E5%B9%B3%E5%8F%B0%E9%87%87%E9%9B%86%E5%9B%9E%E9%A1%BE%E8%AF%95%E9%A2%98%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };
    let linkAllinOne=document.querySelector('.othernav a')
    if(linkAllinOne){
        if (linkAllinOne.innerText.indexOf('显示所有试题')!=-1){
            linkAllinOne.click()
        }
        sleep(500).then()
    }
    let getQueryStr = function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var result = window.location.search.substr(1).match(reg);
        if (result != null) {
            return unescape(result[2]);
        }
        return null;
    }
    let saveContentToDisk = function (content, fileName) {
        let downLink = document.createElement('a')
        downLink.download = fileName
        let blob = new Blob([content])
        downLink.href = URL.createObjectURL(blob)
        document.body.appendChild(downLink)
        downLink.click()
        document.body.removeChild(downLink)
    }
    let clearAns=function(str){
        let s=str.replace(/@.*：/,'@')
        s=s.replace(/@.*?答案是 */,'@')
        s=s.replace(/“错”/,'错误').replace(/“对”/,'正确')
        s=s.replace(/。$/,'')
        return s
    }
    let clearQue=function(str){
        let s=str.replace(/^\d+[．\. ]/,'')
        s=s.replace(/^[．\. ]/,'')
        return s
    }
    let getQues = function() {
        let qStr=''
        let ques = document.querySelectorAll('.content')
        if (ques) {
            for (var que of ques){
                let isQ=que.querySelector('.accesshide')
                if(!isQ)continue;
                if (isQ.textContent=='试题正文'){
                    let q=que.querySelector('.qtext')
                    if(!q)break;
                    qStr=qStr+'##'+clearQue(q.textContent)+"\n"

                    let a=que.querySelector('.feedback')
                    if(a){
                        qStr=qStr+clearAns('@'+a.textContent)+'\n'
                    }
                }
            }
        }
        return qStr
    }

    let showQues = function (content) {
        let divShow = document.createElement('div')
        divShow.id='result'
        divShow.style = 'position:fixed;top:51px;left:1px;padding: 2px 6px;zIndex:9999;background:#fff'
        document.body.appendChild(divShow)
        let temp="<textarea id='areaResult' rows=20 cols=100>"+ content +"</textarea>"
        divShow.innerHTML=temp;
        setTimeout(function(){document.querySelector('#result').remove()},10000);
    };
    let getCourseId=function(){
        let courseid;
        let divId=document.getElementById('alm')
        if(divId){
            courseid=divId.getAttribute("courseid")
        }else{
            let links=document.querySelectorAll('.breadcrumb-item a')
            let pattern=/hebei\.ouchn\.cn\/course\/view\.php\?id=/
            for(var link of links){
                let strHref=link.getAttribute('href')
                if (pattern.test(strHref)){
                    courseid=strHref.match(/(\d+)/)[0]
                    break
                }
            }
        }
        return courseid
    }

    sleep(500).then()
    let qStr=getQues();
    let courseid=getCourseId();
    let filename=courseid+'_'+getQueryStr('attempt')+'.txt'
    let show=function(){showQues(qStr)};

    window.addEventListener('keyup', function(event){
        switch(event.code){
            case 'KeyC':
                showQues(qStr);
                break
            case 'KeyH':
                document.querySelector('#result').remove()
                break
            case 'KeyS':
                saveContentToDisk(qStr,filename)
                break
        }
    }, true)

    let button = document.createElement('button')
    button.innerText = "采集数据"
    button.style = 'position:fixed;top:63px;right:9.375rem;zIndex:99999;font-size: 18px;border:1px solid #fff;color:#212529;background:#fff;font-weight:400;'
    button.onclick = show
    document.body.appendChild(button);

})();
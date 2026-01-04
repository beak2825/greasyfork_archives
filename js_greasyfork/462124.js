// ==UserScript==
// @name         教务系统均分计算
// @version      1.0
// @description  用于电子科技大学教务系统中成绩模块计算均分。
// @author       You
// @match        http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uestc.edu.cn
// @grant        none
// @namespace https://greasyfork.org/users/1044572
// @downloadURL https://update.greasyfork.org/scripts/462124/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%9D%87%E5%88%86%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/462124/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%9D%87%E5%88%86%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //var mark=0;
    //var total=0;
    //var average=0;
   // var trs = document.querySelectorAll('#grid21344342991_data tr');
   // for(let j=0;j<trs.length;j++){
   //     if(Number.isNaN(trs[j].children[6].textContent-0))
    //    {continue;}

     //   mark=mark + Number(trs[j].children[5].textContent *1* trs[j].children[6].textContent);
    //    total=total + trs[j].children[5].textContent *1;
        //console.log(j,average,mark,total);
   // }
    //    average=mark/total;
   // console.log(average.toFixed(2),mark,total);

    var heads= document.querySelector('#grid21344342991 > thead > tr');

    var total = document.createElement('th');

    total.innerHTML="统计";

    total.setAttribute("width","3%");

    heads.appendChild(total);

    var grades = document.querySelector('#grid21344342991_data');
    for(let i=0;i<grades.children.length;i++){
        let a = document.createElement('td');

        let b = document.createElement('input');

        b.setAttribute("type","checkbox");

        b.onclick=function(e){
             e.stopPropagation();
        }

        a.appendChild(b);

        grades.children[i].appendChild(a)

        grades.children[i].onclick=function(e){
            grades.children[i].children[8].firstChild.checked=!grades.children[i].children[8].firstChild.checked;
        }
    }

    var scores=0;

    var num =0;



    var fn= function(){

        scores=0;

        num =0;

        for(let i =0;i<grades.children.length;i++){

            if(grades.children[i].children[8].firstChild.checked==true){
                switch(grades.children[i].children[6].textContent.replace(/[\t\r\f\n\s]*/g, '')){
                    case 'A':
                        scores+=Number(grades.children[i].children[5].textContent)*100;
                        break;
                    case 'B':
                        scores+=Number(grades.children[i].children[5].textContent)*85;
                        break;
                    case 'C':
                        scores+=Number(grades.children[i].children[5].textContent)*85;//不清楚
                        break;
                    case 'D':
                        scores+=Number(grades.children[i].children[5].textContent)*85;
                        break;
                    case 'P':
                        scores+=Number(grades.children[i].children[5].textContent)*85;
                        break;
                    default:
                         scores+=Number(grades.children[i].children[6].textContent * grades.children[i].children[5].textContent);
                }

                num+=Number(grades.children[i].children[5].textContent);



            }

        }
        console.log(num,scores);

    }

    var temp = document.querySelector('body > div:nth-child(3)')
    var btn = document.createElement('button')

    btn.textContent="计算均分"

    var body = document.querySelector('body')

    body.insertBefore(btn,temp)

    var result = document.createElement('div')
    body.insertBefore(result,temp)

    var allChecked = document.createElement('button')
    allChecked.textContent="全选"
    allChecked.onclick= function(){
        for(let i =0;i<grades.children.length;i++){
            grades.children[i].children[8].firstChild.checked=true;
        }

    }
    body.insertBefore(allChecked,temp)

    var allUnchecked = document.createElement('button')
    allUnchecked.textContent="取消全选"
    allUnchecked.onclick= function(){
        for(let i =0;i<grades.children.length;i++){
            grades.children[i].children[8].firstChild.checked=false;
        }

    }
    body.insertBefore(allUnchecked,temp)
    btn.onclick=function(){
        fn();
        if(num==0){
            alert("未选择课程");
        }else{
        result.innerHTML="均分为："+(scores/num).toFixed(2);}
    }

})();
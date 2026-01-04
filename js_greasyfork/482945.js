// ==UserScript==
// @name         以學號取得北科大課表
// @namespace    https://codeberg.org/proton-penguin
// @version      20231224.1
// @license      GPL 3.0
// @description  登入校園入口後可使用學號查詢預設課表，加退選的課程可能不會顯示。
// @author       proton-penguin
// @match        https://aps-rwd.ntut.edu.tw/RWDCourse/Welcome
// @downloadURL https://update.greasyfork.org/scripts/482945/%E4%BB%A5%E5%AD%B8%E8%99%9F%E5%8F%96%E5%BE%97%E5%8C%97%E7%A7%91%E5%A4%A7%E8%AA%B2%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/482945/%E4%BB%A5%E5%AD%B8%E8%99%9F%E5%8F%96%E5%BE%97%E5%8C%97%E7%A7%91%E5%A4%A7%E8%AA%B2%E8%A1%A8.meta.js
// ==/UserScript==

const rgno = document.getElementById('rgno');
const select = document.getElementById('year_sem')
let student_id = window.prompt('輸入要查詢的學號',rgno.value);

function styling(){
    const a = document.querySelectorAll('a');
    const td = document.querySelectorAll('td');

    td.forEach(td=>{
        //td.style="background-color: #ffffff;;"
    })
    a.forEach(a=>{
        a.style='color: #2c2c2c;'
    })
}

function getYears(){
    let min_year ='';
    for(let i=0;i<=2;i++){
        min_year += String(student_id)[i];
    }return min_year;
}

function selectYearAndSemester() {
    for (let i=112; i>=getYears(); i--){
        for(let j=2; j>=1; j--){
            let opt = document.createElement('option');
            opt.value = i+'_'+j;
            opt.innerHTML = i+'學年度-第'+j+'學期('+student_id+')';
            select.appendChild(opt);
            //console.log(opt);
        }
    }
}

(function() {
    document.querySelector('form').style='width: 98dvw; margin: 1dvw'
    rgno.value = student_id;
    selectYearAndSemester();
    styling();
})();
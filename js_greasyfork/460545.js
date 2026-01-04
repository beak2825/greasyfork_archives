// ==UserScript==
// @name         preview tkb
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  a small preview for tkb
// @author       You
// @match        https://qldt.ptit.edu.vn/Default.aspx?page=dkmonhoc
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460545/preview%20tkb.user.js
// @updateURL https://update.greasyfork.org/scripts/460545/preview%20tkb.meta.js
// ==/UserScript==

(function() {
    'use strict';

let space = document.querySelector('#ctl00_ContentPlaceHolder1_ctl00_pnlThongbao');
space.innerHTML = '<style>#very-unique-id td {width: 16%}}</style>'
space.innerHTML += '<table id="very-unique-id"><tr><th>Hai</th><th>Ba</th><th>Tư</th><th>Năm</th><th>Sáu</th><th>Bảy</th></tr><tr><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td></tr><tr><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td><td>2</td></tr><tr><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td></tr><tr><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td></tr><tr><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td><td>5</td></tr><tr><td>6</td><td>6</td><td>6</td><td>6</td><td>6</td><td>6</td></tr></table>';

let head = document.querySelector('head');
// head.innerHTML += '<style> td.1{background-color: \'green\'} td.-1{background-color: \'red\'} </style>';
let preBox;

const myInterval = setInterval(() => {
    let testbox1 = document.querySelector(`#divTDK > table:nth-child(1) > tbody > tr > td:nth-child(3)`);
    let testbox2 = document.querySelector(`#divTDK > table:nth-child(1) > tbody > tr > td:nth-child(3) > p`);
    if (testbox1 != null && testbox2 == null) {
        sth();
    }
}, 1000)
function getMousePos(event) {
    let thoiGian;
    let x = event.clientX;
    let y = event.clientY;
    const stt = document.elementFromPoint(x, y);
    // console.log(stt);
    // console.log(stt);
    // console.log(typeof stt);
    if (stt.tagName == 'P'){
        thoiGian = getTime(Number(stt.textContent))
        console.log(thoiGian);
        marking(thoiGian);
    }

    // for (let i=0; i<thoiGian.buoiHoc.length; i++) {

    // }
  }

  document.addEventListener("click", getMousePos);

function getTime(stt) {
    let monHoc = document.querySelector(`#divTDK > table:nth-child(${stt}) > tbody > tr > td:nth-child(3)`).textContent;
    let gioHoc = document.querySelector(`#divTDK > table:nth-child(${ stt }) > tbody > tr > td:nth-child(13)`).textContent;
    gioHoc = gioHoc.split(String.fromCharCode(160));
    gioHoc = gioHoc.map((x) => Number(x))
    let buoiHoc = document.querySelector(`#divTDK > table:nth-child(${stt}) > tbody > tr > td:nth-child(12)`).textContent;
    buoiHoc = buoiHoc.slice(0,-1);
    buoiHoc = buoiHoc.split(String.fromCharCode(160));

    let buoiHoc1 = []
    for (let i of buoiHoc) {
        switch (i){
            case 'Hai' : buoiHoc1.push(2); break;
            case 'Ba' : buoiHoc1.push(3); break;
            case 'Tư' : buoiHoc1.push(4); break;
            case 'Năm' : buoiHoc1.push(5); break;
            case 'Sáu' : buoiHoc1.push(6); break;
            case 'Bảy' : buoiHoc1.push(7); break;
        }
    }
    buoiHoc = buoiHoc1;
    return {gioHoc: gioHoc,
            buoiHoc: buoiHoc,
            monHoc: monHoc};

};

function sth () {
    'use strict';
    let pList = [];
    for (let i=0; i<200; i++){
        let p = document.createElement('p');
        p.setAttribute('style', 'border: solid black 2px; width: fit-content')
        pList.push(p);
        pList[i].innerHTML = i+1;
    }

    for (let i=0; i<200; i++){
        let box = document.querySelector(`#divTDK > table:nth-child(${i+1}) > tbody > tr > td:nth-child(3)`);
        if (box == null){break}
        else{box.innerHTML += ' stt:'
            box.appendChild(pList[i])}

    }
    const timeTable = []

}


function marking(thoiGian) {
    let markBox;
    for (let i = 0; i< thoiGian.buoiHoc.length; i++){
        markBox = document.querySelector(`#ctl00_ContentPlaceHolder1_ctl00_pnlThongbao > table > tbody > tr:nth-child(${(thoiGian.gioHoc[i] + 3)/2}) > td:nth-child(${thoiGian.buoiHoc[i] - 1})`);
        // console.log(markBox);
        if(markBox.style.backgroundColor == ''){
            markBox.style.backgroundColor = 'lightgreen';
            markBox.innerHTML = thoiGian.monHoc;
        } else if(markBox.style.backgroundColor == 'red'){
            markBox.style.backgroundColor = 'lightgreen';
        } else if((markBox.innerHTML.slice(6).trim() == thoiGian.monHoc.trim()) && (markBox.style.backgroundColor == 'lightgreen')){
            markBox.style.backgroundColor = '';
            markBox.innerHTML = (thoiGian.gioHoc[i] + 1)/2;
        } else {
            markBox.style.backgroundColor = 'red';
        }
    }

    preBox = thoiGian;

}
})();
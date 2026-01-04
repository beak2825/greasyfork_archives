// ==UserScript==
// @name         Add Manaba to Syllabus Link
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Turn manaba course code into KdB link
// @author       eggplants
// @homepage     https://github.com/eggplants
// @match        https://manaba.tsukuba.ac.jp/ct/course*
// @grant        GM.xmlHttpRequest

// @downloadURL https://update.greasyfork.org/scripts/433566/Add%20Manaba%20to%20Syllabus%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/433566/Add%20Manaba%20to%20Syllabus%20Link.meta.js
// ==/UserScript==

const get_nendo = () => {
    let date = new Date();
    date.setMonth(date.getMonth() - 3);
    return date.getFullYear();
}

const get_code = () => {
    let elms = document.getElementsByClassName("coursecode")
    if(elms.length === 0){
        throw 'Error: div.coursecode is missing';
    }
    return elms[0].innerText;
}

const get_kdb_url = () => {
    return `
      https://kdb.tsukuba.ac.jp/syllabi/${
          get_nendo()
      }/${
          get_code()
      }/jpn
    `.trim();
}

const replace_code = () => {
    let elms = document.getElementsByClassName("coursecode")
    if(elms.length === 0){
        throw 'Error: div.coursecode is missing';
    }
    elms[0].innerHTML = `
      <a href=${get_kdb_url()} class="coursecode_link">${get_code()}</a>
    `.trim();
}

const check_kdb_status = (res) => {
    if(res.responseText.includes("シラバスが見つかりません")){
        console.warn(`There is no syllabus page for this code in KdB!: ${get_code()}`);
    } else {
        replace_code();
    }
}

window.onload = () => {
    "use strict";
    console.log(get_kdb_url());
    GM.xmlHttpRequest({
        method: "GET",
        url: get_kdb_url(),
        onload: check_kdb_status,
        timeout: 5000,
        ontimeout: () => {
            console.warn("Commection timeout!");
        }
    });
}
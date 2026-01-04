// ==UserScript==
// @name         UMD-Rating
// @namespace    https://lengyue.me/umd-rating
// @version      0.19
// @description  RateMyProfessor Plugin
// @author       Lengyue
// @match        https://app.testudo.umd.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392061/UMD-Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/392061/UMD-Rating.meta.js
// ==/UserScript==

const style = '.badge{display:inline-block;padding:.25em .4em;font-size:75%;font-weight:700;line-height:1;text-align:center;white-space:nowrap;vertical-align:baseline;border-radius:.25rem;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out}@media (prefers-reduced-motion:reduce){.badge{transition:none}}a.badge:focus,a.badge:hover{text-decoration:none}.badge:empty{display:none}.btn .badge{position:relative;top:-1px}.badge-pill{padding-right:.6em;padding-left:.6em;border-radius:10rem}.badge-primary{color:#fff;background-color:#007bff}a.badge-primary:focus,a.badge-primary:hover{color:#fff;background-color:#0062cc}a.badge-primary.focus,a.badge-primary:focus{outline:0;box-shadow:0 0 0 .2rem rgba(0,123,255,.5)}.badge-secondary{color:#fff;background-color:#6c757d}a.badge-secondary:focus,a.badge-secondary:hover{color:#fff;background-color:#545b62}a.badge-secondary.focus,a.badge-secondary:focus{outline:0;box-shadow:0 0 0 .2rem rgba(108,117,125,.5)}.badge-success{color:#fff;background-color:#28a745}a.badge-success:focus,a.badge-success:hover{color:#fff;background-color:#1e7e34}a.badge-success.focus,a.badge-success:focus{outline:0;box-shadow:0 0 0 .2rem rgba(40,167,69,.5)}.badge-info{color:#fff;background-color:#17a2b8}a.badge-info:focus,a.badge-info:hover{color:#fff;background-color:#117a8b}a.badge-info.focus,a.badge-info:focus{outline:0;box-shadow:0 0 0 .2rem rgba(23,162,184,.5)}.badge-warning{color:#212529;background-color:#ffc107}a.badge-warning:focus,a.badge-warning:hover{color:#212529;background-color:#d39e00}a.badge-warning.focus,a.badge-warning:focus{outline:0;box-shadow:0 0 0 .2rem rgba(255,193,7,.5)}.badge-danger{color:#fff;background-color:#dc3545}a.badge-danger:focus,a.badge-danger:hover{color:#fff;background-color:#bd2130}a.badge-danger.focus,a.badge-danger:focus{outline:0;box-shadow:0 0 0 .2rem rgba(220,53,69,.5)}.badge-light{color:#212529;background-color:#f8f9fa}a.badge-light:focus,a.badge-light:hover{color:#212529;background-color:#dae0e5}a.badge-light.focus,a.badge-light:focus{outline:0;box-shadow:0 0 0 .2rem rgba(248,249,250,.5)}.badge-dark{color:#fff;background-color:#343a40}a.badge-dark:focus,a.badge-dark:hover{color:#fff;background-color:#1d2124}a.badge-dark.focus,a.badge-dark:focus{outline:0;box-shadow:0 0 0 .2rem rgba(52,58,64,.5)}';
const version = 0.19;

(function() {
    // Inject CSS
    $('head').append("<style>" + style + "</style>");
    // Check Update
    console.info("UMD-Rating-Lengyue Injected (Version " + version + ")")
    $.getJSON("https://develop.lengyue.me/api/planetterp/version.php", (result)=>{
        if (result.version > version) {
            alert("Rate My Professor Plugins Has New Version!");
            window.open("https://greasyfork.org/zh-CN/scripts/392061-umd-rating", '_blank');
        }
    });

    function getProfessor(pName) {
        return new Promise((resolve, reject)=>{
            const fName = pName.replace(" ","");
            $.getJSON("https://develop.lengyue.me/api/planetterp/v2.php?professor=" + pName, (result)=>{
                cache[fName] = "<br>";
                cache[fName] += "<a href='" + result.planetTerp.url + "' target='_blank'>PlanetTerp</a> -> "
                cache[fName] += "<span class='badge badge-primary'>Score: " + (result.planetTerp.rating || "?")+ "</span> ";
                cache[fName] += "<span class='badge badge-success'>GPA: " + (result.planetTerp.gpa || "?")+ "</span><br>";
                cache[fName] += "<a href='" + result.rmp.url + "' target='_blank'>RateMyProfessor</a> -> "
                cache[fName] += "<span class='badge badge-primary'>Score: " + (result.rmp.rating || "?") + "</span> ";
                cache[fName] += "<span class='badge badge-success'>Difficulty: " + (result.rmp.difficulty || "?")+ "</span>";
                resolve();
            })
        })
    }

    let cache = {};
    async function getRate(){
        const professors = $(".section-instructor");
        for (let i = 0; i < professors.length; i++){
            const pName = professors[i].innerText;
            if (professors[i].innerHTML.indexOf('<br>') !== -1) continue;
            const fName = pName.replace(" ","");

            if (cache[fName]) {
                professors[i].innerHTML += cache[fName];
            } else {
                await getProfessor(pName);
                professors[i].innerHTML += cache[fName];
            }

        }
        setTimeout(getRate, 100);
    }
    getRate();
})();
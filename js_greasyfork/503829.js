// ==UserScript==
// @name         CPH for 小视野
// @namespace    http://lkyo.top/
// @version      2024-08-16
// @description  小视野 CPH 拓展
// @author       xhze
// @match        http://gdgzoi.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gdgzoi.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503829/CPH%20for%20%E5%B0%8F%E8%A7%86%E9%87%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/503829/CPH%20for%20%E5%B0%8F%E8%A7%86%E9%87%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('run');
    const geti=(x,document)=>{
        return document.evaluate(x, document, null, XPathResult.ANY_TYPE, null);
    }
    function get(x,document) {
        return geti(x,document).iterateNext();
    }
    let center = get("/html/body/div/div[3]/section/div/div/div/div/center[1]",document);
    center.innerHTML += ' <a href="javascript:postToCph()" class="btn btn-primary" role="button"> Throw to CPH </a>';

    window.postToCph = async() => {
        if(window.location.toString().indexOf('contest')==-1) {
            sendProblem(parseProblemFromDom(window.location.toString(), document));
        }else {
            let c=geti("//a[starts-with(@href,'problem.php')]", document);
            let d=c.iterateNext();
            let dp = new DOMParser();
            let ls = []
            while(d) {
                ls.push(d);
                d=c.iterateNext();
            }
            ls.reverse();
            for(d of ls) {
                let html = await(await fetch(d.href)).text();
                let g=dp.parseFromString(html, 'text/html');
                console.log('ok');
                sendProblem(parseProblemFromDom(d.href,g));
            }
        }
        function sendProblem(problem) {
            console.log(problem);
            return fetch('http://localhost:27121', {
                method: "POST", mode: "no-cors", body: JSON.stringify(problem)
            });
        }

        function parseProblemFromDom(url, document) {
            let center = get("/html/body/div/div[3]/section/div/div/div/div/center[1]",document);
            let inp = get("/html/body/div/div[3]/section/div/div/div/div/div[4]/div[1]/ul/pre",document).innerText.replaceAll(/【.+】/g, "@(*&)").split("@(*&)").map(e => e.trim()).filter(e => e);
            let ans = get("/html/body/div/div[3]/section/div/div/div/div/div[4]/div[2]/ul/pre",document).innerText.replaceAll(/【.+】/g, "@(*&)").split("@(*&)").map(e => e.trim()).filter(e => e);
            return {
                name:'horizon_P' + url.match(/(?<=cid=)(\d+)|(?<=pid=)(\d+)/g).join('_'),
                url,
                interactive: false,
                memoryLimit: center.innerText.match(/(\d+)(?= MB)/g)[0] * 1024 * 1024,
                timeLimit: center.innerText.match(/(\d+)(?= Sec)/g)[0] * 1000,
                group: "asd",
                tests: inp.map((e, i) => ({
                    input: e,
                    output: ans[i],
                    id: i,
                })),
                srcPath: "",
                local: true
            }
        }
    };
})();
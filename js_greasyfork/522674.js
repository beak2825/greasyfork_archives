// ==UserScript==
// @name         optica captcha
// @version      0.0.2
// @description  solve optica captcha
// @icon         https://opg.optica.org/favicon.ico
// @author       ml98
// @namespace    http://tampermonkey.net/
// @license      MIT
// @match        https://opg.optica.org/captcha/*
// @require      https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522674/optica%20captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/522674/optica%20captcha.meta.js
// ==/UserScript==

/* global opentype, Answer */

(async function() {

    let d = [["0",25,37.58203125,-25.76953125],["1",13,25.13671875,-51.3984375],["2",28,37.30078125,-5.4140625],["3",42,35.3671875,-39.3046875],["4",23,39.7265625,-17.12109375],["5",29,19.58203125,-31.39453125],["6",41,4.11328125,-21.97265625],["7",9,16.48828125,0],["8",52,20.53125,-52.13671875],["9",42,37.30078125,-29.4609375],["A",19,45.5625,0],["B",39,7.06640625,0],["C",25,29.07421875,-46.79296875],["D",22,48.09375,-26.19140625],["E",14,35.71875,-5.34375],["F",12,13.04296875,-21.97265625],["G",30,29.671875,-21.5859375],["H",14,46.08984375,-51.3984375],["I",6,13.04296875,0],["J",16,-0.421875,13.53515625],["K",14,22.74609375,-29.07421875],["L",8,35.71875,0],["M",22,34.62890625,0],["N",19,47.21484375,-51.3984375],["O",26,51.6796875,-25.76953125],["P",23,39.65625,-36.421875],["Q",30,51.6796875,-25.76953125],["R",25,23.765625,-21.375],["S",39,36.0703125,-13.67578125],["T",10,22.88671875,-46.08984375],["U",19,39.90234375,-51.3984375],["V",13,24.6796875,-18.3515625],["W",28,65.671875,-51.3984375],["X",14,24.1171875,-27.0703125],["Y",11,6.5390625,-51.3984375],["Z",12,38.21484375,-5.4140625],["a",41,34.20703125,0],["b",34,24.1171875,-39.1640625],["c",25,21.5859375,0.703125],["d",35,33.1875,0],["e",30,22.46484375,0.703125],["f",23,23.5546875,-38.53125],["g",72,24.3984375,-38.53125],["h",25,38.390625,0],["i",17,12.0234375,-38.53125],["j",26,1.51171875,17.296875],["k",19,11.671875,-19.72265625],["l",6,12.0234375,-54.703125],["m",38,61.13671875,0],["n",23,38.390625,0],["o",26,39.4453125,-19.30078125],["p",37,24.1171875,0.703125],["q",34,20.7421875,-4.18359375],["r",19,23.765625,-39.234375],["s",39,31.04296875,-10.51171875],["t",25,18.6328125,-4.11328125],["u",23,5.765625,-38.53125],["v",14,21.4453125,0],["w",31,44.578125,0],["x",14,1.37109375,0],["y",24,15.609375,0.2109375],["z",12,30.83203125,-4.53515625]];

    async function load_fonts(urls) {
        let fonts = [];
        for (let url of urls) {
            const buffer = await fetch(url).then(res => res.arrayBuffer());
            const font = opentype.parse(buffer);
            console.log(url, font);
            fonts.push(font);
        }
        return fonts;
    }

    let woffs = [...document.querySelector('body>div>style').textContent.match(/\..*?.woff/g)];
    console.log(woffs);
    let fonts = await load_fonts(woffs);

    function get_char(c) {
        let commands = fonts.map(font => font.getPath(c).commands).find(c=>c.length>0);
        if (!commands) return '';
        let i = d.find(i => i[1]==commands.length && i[2]==commands[0].x && i[3]==commands[0].y);
        if (!i) return '';
        return i[0];
    }

    let id = setInterval(()=> {
        let span = document.querySelector('.puzzle');
        if (!span) return;
        clearInterval(id);
        let puzzle = span.textContent;
        let answer = puzzle.split('').map(get_char).join('');
        console.log(puzzle, answer);
        if (answer.length == puzzle.length) {
            Answer.value = answer;
            span.parentElement.submit();
        }
    }, 300);
})();

// ==UserScript==
// @name         Neon's white list
// @namespace    http://tampermonkey.net/
// @version      v1.0.4
// @description  A Mod to extend room hosting functionality.
// @author       iNeonz
// @match        https://heav.io/game.html
// @match        https://hitbox.io/game.html
// @match        https://heav.io/game2.html
// @match        https://hitbox.io/game2.html
// @match        https://hitbox.io/game-beta.html
// @require      https://unpkg.com/blockly/blockly.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heav.io
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/495088/Neon%27s%20white%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/495088/Neon%27s%20white%20list.meta.js
// ==/UserScript==

const version = "v1.0.3";
let ask = false;
console.log("oh wow");

function sendInfo(sett = {},offset = 0){
    if (hostId == myid){
        sett.frame = getCurrentState()?.frame-offset;
        settings.nhm = sett;
        WSS.send(`42[1,[62,${JSON.stringify(settings)}]]`)
        WSS.onmessage({data: `42[63,${JSON.stringify(settings)}]`})
    }
}

let settings = {};
let trace = [];
let tracing = -1;
let traceLimit = 0;

function setSett(setts)
{
    let sett = {};
    let sects = setts.split('|');
    for (let o of sects){
        let pr = o.split(':');
        if (pr[1]){
            let v = JSON.parse(`[${pr[1]}]`)[0];
            sett[pr[0]] = v;
        }
    }
    WSS.onmessage({data: `42[63,${JSON.stringify(sett)}]`})
    WSS.send(`42[1,[62,${JSON.stringify(sett)}]]`)
}

//<textarea class="scrollBox" wrap="soft" spellcheck="false" style="border: none; outline: none; -webkit-box-shadow: none; -moz-box-shadow: none; box-shadow: none; resize: none; position: absolute; overflow-y: scroll; overflow-x: hidden; background-color: #2f2f2f; height: calc(100% - 60px); width: calc(100% - 80px); left: 80px; top: 50px; box-sizing: border-box; border-bottom-left-radius: 7px; border-bottom-right-radius: 7px; white-space: nowrap;"></textarea>

let myid = -1;
let hostId = -1;

let users = [];
let abc = 'abcdefghijklmnopqrstuvwxyz';
const alive = {};
// Your code here...

let toppest = null;
// scope.toppest.children[1].children[0] is bg
// starting from 1 to end, first is the most behind and the last is the furthest on the z index sort
let overlayWidth = .25;
let overlayHeight = .25;

let lastRender = Date.now();

const render = window.PIXI.Graphics.prototype._render;
window.PIXI.Graphics.prototype._render = function(...args){
    render.call(this,...args)
    if (this.batchDirty == -1)
    {
        let parent = this.parent;
        while (parent.parent){
            parent = parent.parent;
        }
        toppest = parent;
        window.toppest = toppest;
    }
}

let whiteList = JSON.parse(localStorage.getItem("NWHITELIST") || '[]');
let whiteListOn = false;

const render2 = window.PIXI.Text.prototype._render;
window.PIXI.Text.prototype._render = function(...args){
    render2.call(this,...args)
    if (this.parent && this._text) {
        alive[this._text] = {orbj: this,obj: this.parent,frames: 16, txt: this};
    }
}

let frames = 0;
let lc = Date.now();

function gCoordinates(x,y){
    let bg = document.getElementById('backgroundImage')
    if (bg){
        let w = bg.clientWidth;
        let h = bg.clientHeight;
        let scale = w/730;
        return [x/scale,y/scale];
    }
    return [0,0];
}

function lerp(a, b, x) {
    return a + x * (b - a);
}

let lastMO;
let empty = {};

window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
    apply( target, thisArgs, args ) {
        let T = Date.now();
        let dt = (T-lc)/1000;
        lc = T;
        frames++
        Reflect.apply(...arguments);

        for (let i in alive) {
            let unalive = (!alive[i].obj || !alive[i].obj.transform || !alive[i].obj.parent || !alive[i].txt || !alive[i].txt.visible || alive[i].txt.parent != alive[i].obj || !alive[i].obj.visible || alive[i].obj.alpha <= 0);
            let p = findUser(i);
            if (p){
                if (unalive){
                    alive[i].frames--
                    if (alive[i].frames <= 0){
                        delete alive[i];
                    }
                }else{

                }
            }else{
                delete alive[i];
            }
        }
    }
})

const originalSend = window.WebSocket.prototype.send;
let excludewss = [];
let WSS = 0;

function findUser(id){
    for (let t in users) {
        let o = users[t];
        if (o.id == id || o.name == id){
            o.index = t;
            return o;
            break;
        }
    }
}

//eval setInterval(() => {sendInfo({execute:`this.state.po[0].th = -20;`});},2000);
//const blackList = 'eJzdncuO5LoNht%2Bl1tUFW773qwTZJBgEyOogM2c1mHeP62Jbl5%2FWT7q6Yftk0ZnS112mKZEUJVG%2FL%2F%2B6fP7j98VdPrtbUQ%2F%2Bf9dLdfksi5u7XvrLZ3W9uPHfv%2F7394%2Fr5efjl7qxue26zpXN9fLX%2BNFHcaubwv%2FPXT%2FKmyuiz%2BxYeetDqrqiL02xf%2F65PqSMv8b1DzHHP9IHwvftNZSvrCfhX5J24ZcO9wdxQ%2FhHrnYMUOhLU2yRtAjh7iFpcauK%2BON1QduQbwQJrBgWlMAmQd2tDVuql6BlKH%2BVVWnYj8rx1YzdsgpHRZt0Sw0HMPi9KTdJW93qsOUpbXlrQ2nrnLBDEfEf6I1t4BCGvhdwk7D1rQxVe2bNNrc6kMoZx2vSPwTbasQAhb40xSY520ii8tWBq%2FBdZTowMG%2FYE1gx7KQIbF3OhxE%2Fumj9rQSivaerNkLfhJ%2FfP8a9r1metW%2Fe8awJP37WBF%2F7sAxWDFDoS1NsknOIfOY0rNIoQKuTR4%2FVNDw%2BR3%2Fq3rD%2BvOhtGR4YvHErhhVDYHMgVgqjRe%2FFgAjIFZs5wWUz3Cytk%2FQahXS9RVoQUFoxHHcS2CxpdXN48jBkB1kXfE3vhLFuxbAZIjBPtv60enO3aYYQ9dRszLz30KqsBVNzOkGnsfeeuYBgHu2gZEgZcJaxu822c3tgldgoyaUzGKDwGIwxT7YpHZFOZ3N5FxjmrjegiFdomB%2Bxf5kJy%2BsP%2Fqbra%2BnFmjlBAwSXqKCMJ9lZFaBuAxI2VgznkghsFm24xXPxc06lXQFzBuebSwuCnmIy7co5HnmDnSHy6BpO6KIEN4vnhMH4hukPzs0ZMSGDl8dmScegpA7%2FgGU0xilSVwp%2BzYphZ0hgnqDDkAp6QpWK2Xaty0Q5BDDbsWJ4UkRgy2pR2klXYp%2BCXFAAz27FsIgEtqwTRXOjWUQYgiIRYVD%2FiCI1LVOoilsWjURrmKsBM%2F20wEDYOWxJGC67SpkoVpLSmDZlMXNGd5LwGaLIS3RIJmOGg8XMyZdJpruSw2RS079kHNjeGQXvD%2B8V%2FtGh7tIgn%2BcQhr4XcJ6caTZajtTgIAz%2F9jAtZdCfv5Y40Od%2BFwtkeuXugPvDjzn%2BrVAeYZV3AwfNDMctBryLVKeT8hgJ9CrOEk1eCow4QczUYpXx5p4eGjYOAxT60hRblvXDycI5FSnEG0LsSDtwkB6ycziNxHCLlDgDkQYvnIF8Gmngi%2BwcdpQMt3TY5oxiYVOj8OFwbxB4ADMnvB%2BGW3QX6qx8Qxg9hnLhbwujkOQAJrjVmFv2DqF1n9Serwj5%2FMpr%2FH%2Bjf2c2tygiDuRDkMhmTtAIw62%2FVo0VQJYZjW4zJ1gBgltUuckKAH8GR%2FcGDloBjluETHYlCCrrpJ2raw3Sbt211762NHtUj9Lepi2ar7y8%2FIa1eRFdkmV6oG723DAJS79nlA4xc0LahODWze%2FW3BB6gg2g8IoocH2noWqqYMxQ0dyGBNr6HsWP1VGE0lLgO60YfiEEltnfd7JJ3v18TNi066QyVoq0cHMypZxs5j1EWb9aO3tDKXFk2c2c4AAYbt0yKrz53s0kdnAKLVpDCZrbEOnEURh6NaowDA0tMycMQYLLbO1WJWs78VtXWwTBcYv3vGEKfTKM8JAAnQx559R7w4zfM%2F9DgFfa6PgIlnGUslF7bxzNo4DcDm755WSPtsYQoogDGTgrJxlCgvP3LYciawcg3JQMNrKut%2BDdslOLt53cNWeMKkbBkB3UJGOQfQM76uwc3nnHcJ6UVfhSiGmlNhE8fkkRfEf%2F1ann5dyNYi75nTmn2Xh95UuIN8C%2B5Y%2BWry3huumrXn3hi%2BNDw7IZQefWjSHax2LmhE02BDfL2y7BLx8VHiLOal%2BHxN7bCVsYvSmmfKEm%2BgHXCNnC4dkUw4HTF7Rn%2FdaZQh89%2Bjm10Edhw1f05%2F42nHT894ufO1dSt4PhIQoyVRMtFKKaOSGCJrj0gOHZ9DfgEGNrAnhnC%2FduVG2j3ncBV%2BHBqDdzglFiOO9IVDdLRk%2BNUQ4X%2BUQzJ3hShvMPsmm3EMPoFZWuMHNCjQuCS7xceZ%2BcHdkoYtuh2Lx%2FlBzb3BUVW33QcSq0hcfMwSHGcZ7xGLQJX2ixwlC3EPf4URzABIMac55cKFhV9Uxd6OqcMBZOtf%2FtfmxTneVMqkUKPsTMCb6G4WbB6ttGhblSOhlk5xiFYc7rltqw5xhx69ITVXPFvR%2F3cPXGTVv7rdEyDrH1s8%2F5le27Zj%2BAEd%2FCAQx%2Bb8rNgrWLUdSedU4WUZLPHj7SiuHyIASWyibN6JXCgeMIVgyflSCwWbhmXhY27ix%2BdDRix7CGY3YWY85TWq2N6r4zYeq696cOXReZ2Y0nyF5uGgwyO4dHI8NFb04Tx6J%2BmN9WrAKlGRYDIiN6rsiyGWcpWq3BtAvQhZkTVMZwnmDh2GpPOeIWB6iIyZBLQ3oxc4L%2BGO4dYQsaUMC5WTHsAgkMhi3aqnnoqcEimxXDS3EEloQtK0n6I0UrjfZYwJpwIPJYb8EBztQCQkVx8mKPXMI%2FmZ0lHclJdJHeu9XJRLHuG7J5bQ3H5L8xF0VjRx%2BGD3HK0SRen0UKXDirf8hY34Zm69022bsheIy5QQJiSy2lTC3E%2FYvgFUtKSoRoHBwqhwo8F48xDg5iS52MPuy4k0FMYnH1dTxlVGARpfGamuYAhr42xZayEpF5bIVS4tnuyuy3lncEcyDihKlUAi4SRyszc%2FF0bUVPJocsr5FyoCQxA3olfKwdGBkX0DGtGO6%2BBLYUfUC7pk8oaBuLhE1v4SzFLaOe05EXaWAOYTgkSrjlCFoX0sL2ErL%2B%2BNfXh4gf2FovHV61J3Q74c49UPP3%2Bfn6yxVyCzt4t2URV9Jhy0njmUf02SO1b%2BYQhmcoCbccDY4ik7139iE2RfN0Oe51Bu1EZmIQlMNggMKqibF1zRicy1MBqEOttgidC7dkhot%2B8Wzvh7GxdvZrx%2FCwAQv2Br2Ah7RiWDICy3RAfaRCbP2UzAODAUrILUVYfKxrv5a6LIXa79viktdVm2kAstoAQ5NXg3feLBm974jnXw%2BWjdQ1HBPSY847jrnsCdf2od0XqZ%2BFM2iPKAD%2BcJJmTnCtDJcKqPc5u1de867QB90GgYaXERMGYR4LTjCeVYuzbGe0L928x%2BgtnVK8Gwp3O%2FH2J3B45A3PB26ttGPbB818TLIef63oB1cM99JPrWt%2FfJS2q1HTiM2K4cCOwDzVdXyOAT0m8kFmTvBVDOcdR4CroPsNXeeDIefRgZvT8HsNv6Vucs5R3mxYFtl5VHPffhS0tcYQB%2B0PA2PcimHDQGAZQQ2G7QCSzk5JuzSLxhhafjRzwiolwyXygZX6c4iHOurmPQUlWm8QTzVQnODrGG6Wtr%2FtPjk2P6PBH3%2FH%2FGF6vP1mtN0A04uoaBr1xMDtrzXgCAA2ZJ4YyG7oAVX6lFYMULi7xNi8ySWODao9z5UrF23jmBxddHAqoxZ8%2BBHdC2zE8EI8gXmChjcwtaa1EeEC5PA5ukq6KJnh4C4OjpuF3bLvaOcBdlVPqTWDcEfYlVA1czh2OuV99Le%2BL7u%2BLodujGRc457z2afvCnt4IVdIYTbmlWLwyIGIE6LWBPT26Yb4XPgaej3ujtO7KYAxg9Tw%2BBz9qXvDsis6EqzUawXsKoDv2spJKiG4uQMmUzi6uFwpxRB2DgcbDOfJk%2B6drbA6uQrygxD2WTHzb2YGURlvppMVGcUy6G7c%2BwNYMSwhgS2b3sPawJkZKnt%2FLrDoVgwbfgJbzAve%2BniaXgoNi1JEZNzQI5g5QUqCW7pqGzZU2sFIXLAxSE6CwITkdB5bDimkOYkKWyFcd3nFdScJtkGY%2FDMYoHCKIcaWwwnR2TW1KtN5CrOCoOCopQbIZTrs2eKaaqkxCye076izER%2FfGVohWfC%2B0mrSV2qk3LnjwKNww2yoQ8W40CRHA3KzIQwukqIYQBXlpKe5cPxi5oRAh%2BCWc1HoBKPCqhK3LQ2pVacx3GEJTDz41ZzSorbqqTosyVkIhZLElmm2jluWQ2nR0Fs7asDlFfCrNXOCChhuERKfM1B4uACEpz%2BRzdKAnFnFYO5gGG0zvmsVp4POaqMJx3NlMydM5Aluvd9JC6pHLegqHvWkzTi8E%2BhhDVZbBMuAW6an7W%2FrG%2BeOqoVedYz6qCOqn69xoetoHUF5k51%2BXy1D6Wjd7jxBWWzO6CHF5dNYCo5Kd0HOO8aFrm1jkkFrtTmiTCHIDSs4gMHvTbmMLlc2n77lxp8ivfZt5TTzWqbtEIeWivlISEI52brnazuJSUQGw0OEwDIj5GO9wivq7EgRG0BBZRSYGxhfmGQTaxLsMir7%2BvfRL3tvFaXDkctAxtTMCUaX4MJXty29gJW5ARQ6AQUuPbib9ucgExCZblSkNb9XVsFRe2oxF6tKca2ZrZN%2FYSZ9tNN4orHlrjZmm4OCo7ZDQG4pDCCUeqDjZ%2BK%2B5UGIJBgM%2B1sC8yTEdzHyl%2FigZCRYEV1reO0shQ25yABc8XP4OCGu9tDv2muPfUhzxpw2Bskg28IBTDAGMeeVCXDatQnqOvHHjiwzB1XGcV6RgLlSssJjxK8uzXHvoWaiV5uDmQoeaQo4qW3jSBNMmx2UbCADoqojK1O%2FQ%2BlpazZrh0tNo5qQV6YjJOGCvnQnoBVDERKFvX%2BU7SyJXrawRJPGucUJN8FnGTHBsxGYV1ok3K5l2O%2BjnRi1t3b9PAl7SwvoBlYMdxYCy%2FQVxTBHfSAdvjYKj%2FE85XWTsMGwYRoFpiDoWmuYZkGoIdOj37lm9Lxg%2FuhR33Df96JMiRG3GJO3PQicML1iOE8waLU35zN3tha6VCbSLG%2FsvVTJqL3%2BjIky71Zr63bv3enKlXPgB%2BtY0DeodukNFestU5IGt3hliEJ1qLeG7j05OUqoT0d%2BkyOeeweVVYhWKWBngOWr7KBU6IoBPQUIzmZbmmhn2zJGMdH9g185TZDruO0yxTvb9y99J4W09v9ly1iuFpY%2F%2BGVUZFaistnC%2FWckBzDBOMWcVyAtU%2BOAP3fWPz0wmHXaOTw9ZThPQu0ayf6zF65VVeU5rPXt3rX6gGzYaotgKl8tGT1szgfuMOsuiPrO9MKsbkVYfZSsw2iG2kabGUtufMRJLyuGk2ME5ikM%2B0hrOYHXbZTZigYajim3gLmkXyZ%2BVNkvd5ZIcf3WaSJx53l6NJDHsAchME9CQ5c8wAqNoDrNJAEqBUwMzJwwnWA4r5bf5rgfGQ5o9%2B2g5CAYMCOq%2Bfw5FgBUMFCBVIkFAfQkrbflblwpFRKzc8x5bMxlCk%2BeKO9ZxTm6jVsCH12PqAuk4ZgCQpjzpIzUrratoXVyyLyX6aRVwQm2leE8MSN847FHR5671nBMkIM5r0qq%2B%2FL8lFDzU5VyCElhK%2F0GTso6ENwsZlwlpT6tOx41ajgO8l1Vmau4kJvgUDuVJUbLqZtAxAmKSEBP1LDMySQqvUqKiqQjI2vmBGPMcJmRZT7%2B%2BfKY0VxeUCfJAUzwrDGXLY3M7xVC1i9NdVgxnBEhsMTbmAsOvgYYyrCaOSETS3CZYMG8GuIm5yPF7ELLXLMGtiRVqTcUt2JLVvGcYCYYLi1J%2FbG693nvty4vcgh34x5UKHe6GV8z19M4n0ynsw7t5v3oe8usjP%2B7Xv47Pun44%2Bfzx1%2FPH7%2F%2Bfv389%2FPnf16fv%2F7588evy%2Bfv%2B8uoR6nr%2BzsZ301ZXD7b%2B1sony%2Fj8dJGx3bvzfe17TtbtvfVmvFnd9%2BLUYzBp%2Fvz5%2F9dJ0Ia';

/*const blackListBase = `
    [
        17,
        [
            "id",
            false,
            [
                "string",
                "name",
                "owner",
                "",
                "2023-08-16 09:17:12",
                632,
                null,
                null,
                null
            ],
            {
                "9": 1
            }
        ]
     ]
`*/

const blackListBase = `
[
    19,
    [
        [
            1,
            202,
            [
                [
                    [
                        30,
                        0.5,
                        1,
                        0,
                        0,
                        0,
                        60,
                        0,
                        2500134,
                        false,
                        30,
                        18.75,
                        2500134,
                        15,
                        false
                    ]
                ],
                [],
                [
                    [
                        15.95,
                        16.200000000000003,
                        5,
                        0,
                        [
                            false,
                            true,
                            false,
                            false,
                            false
                        ],
                        -2
                    ]
                ],
                [
                    [
                        0,
                        0,
                        0,
                        0
                    ]
                ],
                [
                    [
                        -1,
                        -1,
                        -1,
                        2,
                        35041,
                        0,
                        0,
                        0,
                        111,
                        0,
                        -1,
                        0,
                        5,
                        false,
                        0,
                        0,
                        [
                            [
                                0,
                                1,
                                0,
                                0,
                                0,
                                0,
                                0,
                                [],
                                [],
                                null,
                                0,
                                true,
                                -1,
                                -1,
                                5,
                                0,
                                -1,
                                -1,
                                -1,
                                -1,
                                -1
                            ]
                        ]
                    ]
                ],
                [
                    [
                        0,
                        0.55,
                        6.300000000000001,
                        0,
                        0,
                        0,
                        0,
                        3,
                        0.5,
                        0.5,
                        0.3,
                        0.5,
                        false,
                        0,
                        false,
                        false,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        false,
                        0,
                        "a",
                        true,
                        true,
                        true,
                        true,
                        0,
                        0,
                        false,
                        false,
                        false,
                        false,
                        0,
                        -1,
                        -1,
                        false,
                        false,
                        0,
                        0,
                        true,
                        1,
                        false,
                        false,
                        [
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                921102,
                                true,
                                0,
                                0,
                                0,
                                1,
                                false,
                                0,
                                -1,
                                -6.5,
                                0.5,
                                -6.5,
                                0.5,
                                12.5,
                                -0.6,
                                12.55
                            ],
                            [
                                0,
                                19,
                                -6,
                                null,
                                null,
                                null,
                                921102,
                                true,
                                0,
                                0,
                                0,
                                1,
                                false,
                                0,
                                -19.5,
                                -0.5,
                                10,
                                -0.5,
                                10,
                                0.5,
                                -19.5,
                                0.5
                            ],
                            [
                                0,
                                29.5,
                                0.5,
                                null,
                                null,
                                null,
                                921102,
                                true,
                                0,
                                0,
                                0,
                                1,
                                false,
                                0,
                                -0.5,
                                -7,
                                0.5,
                                -7,
                                0.5,
                                12,
                                -0.5,
                                12
                            ],
                            [
                                0,
                                19.5,
                                12,
                                null,
                                null,
                                null,
                                921102,
                                true,
                                0,
                                0,
                                0,
                                1,
                                false,
                                1,
                                -19,
                                -0.5,
                                10,
                                -0.5,
                                10,
                                0.5,
                                -19,
                                0.5
                            ],
                            [
                                0,
                                19.5,
                                10.5,
                                null,
                                null,
                                null,
                                4407102,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -2.5,
                                -0.5,
                                2.5,
                                -0.5,
                                2.5,
                                0.5,
                                -2.5,
                                0.5
                            ],
                            [
                                0,
                                14.25,
                                10.75,
                                null,
                                null,
                                null,
                                12151355,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.25,
                                -1.75,
                                0.25,
                                -1.75,
                                0.25,
                                1.75,
                                -0.25,
                                1.75
                            ],
                            [
                                0,
                                15,
                                10.75,
                                null,
                                null,
                                null,
                                12151355,
                                true,
                                0,
                                0,
                                0,
                                1,
                                false,
                                0,
                                -0.5,
                                -0.25,
                                0.5,
                                -0.25,
                                0.5,
                                0.25,
                                -0.5,
                                0.25
                            ],
                            [
                                0,
                                15.75,
                                11.25,
                                null,
                                null,
                                null,
                                12151355,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.25,
                                -0.75,
                                0.25,
                                -0.75,
                                0.25,
                                0.75,
                                -0.25,
                                0.75
                            ],
                            [
                                0,
                                24.75,
                                10.75,
                                null,
                                null,
                                null,
                                12151355,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.25,
                                -1.75,
                                0.25,
                                -1.75,
                                0.25,
                                1.75,
                                -0.25,
                                1.75
                            ],
                            [
                                0,
                                24,
                                10.75,
                                null,
                                null,
                                null,
                                12151355,
                                true,
                                0,
                                0,
                                0,
                                1,
                                false,
                                0,
                                -0.5,
                                -0.25,
                                0.5,
                                -0.25,
                                0.5,
                                0.25,
                                -0.5,
                                0.25
                            ],
                            [
                                0,
                                23.25,
                                11.25,
                                null,
                                null,
                                null,
                                12151355,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.25,
                                -0.75,
                                0.25,
                                -0.75,
                                0.25,
                                0.75,
                                -0.25,
                                0.75
                            ],
                            [
                                0,
                                19.5,
                                11.25,
                                null,
                                null,
                                null,
                                4407102,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.5,
                                -0.25,
                                0.5,
                                -0.25,
                                0.5,
                                0.25,
                                -0.5,
                                0.25
                            ],
                            [
                                0,
                                13,
                                9.5,
                                null,
                                null,
                                null,
                                2302240,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.5,
                                -2,
                                0.5,
                                -2,
                                0.5,
                                2,
                                -0.5,
                                2
                            ],
                            [
                                0,
                                26,
                                9.5,
                                null,
                                null,
                                null,
                                2302240,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.5,
                                -2,
                                0.5,
                                -2,
                                0.5,
                                2,
                                -0.5,
                                2
                            ],
                            [
                                0,
                                0.05,
                                0.1,
                                null,
                                null,
                                null,
                                13027014,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                17.3,
                                9.700000000000003,
                                17.1,
                                9.5,
                                16.900000000000002,
                                9.700000000000003,
                                17.1,
                                9.900000000000002,
                                18.5,
                                9.900000000000002,
                                18.700000000000003,
                                9.700000000000003,
                                18.5,
                                9.5,
                                18.3,
                                9.700000000000003
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                10263194,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                17.6,
                                9.400000000000002,
                                17.5,
                                9.400000000000002,
                                17.400000000000002,
                                9.5,
                                17.400000000000002,
                                9.600000000000001,
                                17.5,
                                9.700000000000003,
                                17.6,
                                9.700000000000003,
                                17.6,
                                9.600000000000001,
                                17.5,
                                9.600000000000001,
                                17.5,
                                9.5,
                                17.6,
                                9.5
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                10263194,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                17.6,
                                9.3,
                                17.6,
                                9.700000000000003,
                                17.7,
                                9.8,
                                18.1,
                                9.8,
                                18.2,
                                9.700000000000003,
                                18.2,
                                9.3
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                3285531,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                17.650000000000002,
                                9.3,
                                17.650000000000002,
                                9.350000000000001,
                                17.75,
                                9.350000000000001,
                                17.8,
                                9.400000000000002,
                                17.8,
                                9.5,
                                17.85,
                                9.450000000000003,
                                17.85,
                                9.400000000000002,
                                17.900000000000002,
                                9.350000000000001,
                                17.95,
                                9.350000000000001,
                                18,
                                9.400000000000002,
                                18.05,
                                9.350000000000001,
                                18.150000000000002,
                                9.350000000000001,
                                18.150000000000002,
                                9.3
                            ],
                            [
                                0,
                                0,
                                -0.05,
                                null,
                                null,
                                null,
                                6444882,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                17.85,
                                9.150000000000002,
                                17.900000000000002,
                                9.05,
                                17.900000000000002,
                                9,
                                17.85,
                                8.950000000000003,
                                17.85,
                                8.850000000000001,
                                17.900000000000002,
                                8.8,
                                17.95,
                                8.8,
                                17.95,
                                8.850000000000001,
                                17.900000000000002,
                                8.850000000000001,
                                17.900000000000002,
                                8.950000000000003,
                                17.95,
                                9,
                                17.95,
                                9.05,
                                17.900000000000002,
                                9.150000000000002
                            ],
                            [
                                0,
                                0.19999999999999996,
                                0,
                                null,
                                null,
                                null,
                                6444882,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                17.85,
                                9.150000000000002,
                                17.900000000000002,
                                9.05,
                                17.900000000000002,
                                9,
                                17.85,
                                8.950000000000003,
                                17.85,
                                8.850000000000001,
                                17.900000000000002,
                                8.8,
                                17.95,
                                8.8,
                                17.95,
                                8.850000000000001,
                                17.900000000000002,
                                8.850000000000001,
                                17.900000000000002,
                                8.950000000000003,
                                17.95,
                                9,
                                17.95,
                                9.05,
                                17.900000000000002,
                                9.150000000000002
                            ],
                            [
                                0,
                                -0.25,
                                -0.050000000000000044,
                                null,
                                null,
                                null,
                                6444882,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                17.85,
                                9.150000000000002,
                                17.900000000000002,
                                9.05,
                                17.900000000000002,
                                9,
                                17.85,
                                8.950000000000003,
                                17.85,
                                8.850000000000001,
                                17.900000000000002,
                                8.8,
                                17.95,
                                8.8,
                                17.95,
                                8.850000000000001,
                                17.900000000000002,
                                8.850000000000001,
                                17.900000000000002,
                                8.950000000000003,
                                17.95,
                                9,
                                17.95,
                                9.05,
                                17.900000000000002,
                                9.150000000000002
                            ],
                            [
                                0,
                                4.575000000000001,
                                10.300000000000004,
                                null,
                                null,
                                null,
                                4407102,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -4.075,
                                -0.15000000000000036,
                                4.075,
                                -0.15000000000000036,
                                4.075,
                                0.15000000000000036,
                                -4.075,
                                0.15000000000000036
                            ],
                            [
                                0,
                                8.75,
                                10.75,
                                null,
                                null,
                                null,
                                1907997,
                                true,
                                0,
                                null,
                                0,
                                1,
                                true,
                                0,
                                -0.15000000000000036,
                                -0.75,
                                0.15000000000000036,
                                -0.75,
                                0.15000000000000036,
                                0.75,
                                -0.15000000000000036,
                                0.75
                            ],
                            [
                                0,
                                4.949999999999999,
                                10.75,
                                null,
                                null,
                                null,
                                1907997,
                                true,
                                0,
                                null,
                                0,
                                1,
                                true,
                                0,
                                -0.15000000000000036,
                                -0.75,
                                0.15000000000000036,
                                -0.75,
                                0.15000000000000036,
                                0.75,
                                -0.15000000000000036,
                                0.75
                            ],
                            [
                                0,
                                1.3499999999999988,
                                10.75,
                                null,
                                null,
                                null,
                                1907997,
                                true,
                                0,
                                null,
                                0,
                                1,
                                true,
                                0,
                                -0.15000000000000036,
                                -0.75,
                                0.15000000000000036,
                                -0.75,
                                0.15000000000000036,
                                0.75,
                                -0.15000000000000036,
                                0.75
                            ]
                        ],
                        []
                    ],
                    [
                        1,
                        1.784545454545455,
                        8.682727272727272,
                        0,
                        0,
                        0,
                        0,
                        3,
                        0.5,
                        0.5,
                        0.3,
                        0.5,
                        false,
                        0,
                        false,
                        false,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        true,
                        0,
                        "a",
                        true,
                        true,
                        true,
                        true,
                        0,
                        0,
                        false,
                        false,
                        false,
                        false,
                        0,
                        -1,
                        -1,
                        false,
                        false,
                        0,
                        0,
                        true,
                        1,
                        false,
                        false,
                        [
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                false,
                                0,
                                -0.16363636363636377,
                                0.1818181818181819,
                                -0.16363636363636377,
                                1.2218181818181815,
                                0.07636363636363681,
                                1.2218181818181815,
                                0.07636363636363681,
                                0.1818181818181822,
                                0.6363636363636376,
                                -0.3781818181818187,
                                0.6363636363636376,
                                -0.6581818181818182,
                                0.3563636363636351,
                                -0.6581818181818182,
                                -0.043636363636364896,
                                -0.0181818181818181,
                                -0.40363636363636407,
                                -0.6581818181818182,
                                -0.7236363636363636,
                                -0.6581818181818182,
                                -0.7236363636363636,
                                -0.37818181818181784
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                0.476363636363638,
                                0.14181818181818215,
                                0.476363636363638,
                                1.221818181818182,
                                1.396363636363637,
                                1.221818181818182,
                                1.396363636363637,
                                0.14181818181818215,
                                0.47636363636363854,
                                0.14181818181818215,
                                0.5163636363636386,
                                0.26181818181818245,
                                1.2763636363636381,
                                0.26181818181818245,
                                1.2763636363636381,
                                1.1018181818181831,
                                0.5963636363636363,
                                1.1018181818181831,
                                0.5963636363636363,
                                0.26181818181818245
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                1.5563636363636364,
                                0.14181818181818215,
                                1.5563636363636364,
                                1.221818181818182,
                                2.3163636363636386,
                                1.221818181818182,
                                2.3163636363636386,
                                0.14181818181818215,
                                2.156363636363637,
                                0.14181818181818215,
                                2.156363636363637,
                                1.0618181818181824,
                                1.7163636363636379,
                                1.0618181818181824,
                                1.7163636363636379,
                                0.14181818181818215
                            ],
                            [
                                0,
                                0.20000000000000007,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                2.9163636363636387,
                                1.1818181818181828,
                                3.0363636363636375,
                                0.14181818181818215,
                                3.4363636363636374,
                                0.14181818181818215,
                                3.6363636363636376,
                                1.1818181818181828,
                                3.4763636363636383,
                                1.1818181818181828,
                                3.356363636363639,
                                0.7418181818181822,
                                3.156363636363637,
                                0.7418181818181822,
                                3.076363636363638,
                                1.1818181818181828
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                3.956363636363639,
                                1.2218181818181828,
                                3.956363636363639,
                                0.14181818181818215,
                                4.436363636363637,
                                0.14181818181818215,
                                4.516363636363638,
                                0.26181818181818245,
                                4.516363636363638,
                                0.46181818181818246,
                                4.436363636363637,
                                0.5418181818181822,
                                4.236363636363638,
                                0.5418181818181822,
                                4.596363636363637,
                                1.1018181818181823,
                                4.596363636363637,
                                1.221818181818182,
                                4.436363636363638,
                                1.221818181818182,
                                4.156363636363639,
                                0.7418181818181822,
                                4.156363636363639,
                                1.221818181818182
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                4.6763636363636385,
                                0.18181818181818274,
                                4.6763636363636385,
                                1.221818181818182,
                                5.236363636363638,
                                1.221818181818182,
                                5.236363636363638,
                                1.0618181818181824,
                                4.836363636363638,
                                1.0618181818181824,
                                4.836363636363638,
                                0.7818181818181825,
                                5.236363636363638,
                                0.7818181818181825,
                                5.236363636363638,
                                0.621818181818183,
                                4.836363636363638,
                                0.621818181818183,
                                4.836363636363638,
                                0.34181818181818274,
                                5.236363636363638,
                                0.34181818181818274,
                                5.236363636363638,
                                0.18181818181818188
                            ],
                            [
                                0,
                                -0.36000000000000004,
                                0.04000000000000001,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                6.196363636363637,
                                1.1818181818181828,
                                6.196363636363637,
                                -0.3381818181818173,
                                6.476363636363638,
                                -0.3381818181818173,
                                7.316363636363639,
                                0.5018181818181818,
                                7.316363636363639,
                                -0.21818181818181728,
                                7.636363636363638,
                                -0.21818181818181728,
                                7.636363636363638,
                                1.221818181818182,
                                7.316363636363639,
                                1.221818181818182,
                                7.316363636363639,
                                0.9818181818181819,
                                6.516363636363639,
                                0.18181818181818243,
                                6.516363636363639,
                                1.1818181818181828
                            ],
                            [
                                0,
                                6.960000000000001,
                                0.03999999999999995,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                0.476363636363638,
                                0.14181818181818215,
                                0.476363636363638,
                                1.221818181818182,
                                1.396363636363637,
                                1.221818181818182,
                                1.396363636363637,
                                0.14181818181818215,
                                0.47636363636363854,
                                0.14181818181818215,
                                0.5163636363636386,
                                0.26181818181818245,
                                1.2763636363636381,
                                0.26181818181818245,
                                1.2763636363636381,
                                1.1018181818181831,
                                0.5963636363636363,
                                1.1018181818181831,
                                0.5963636363636363,
                                0.26181818181818245
                            ],
                            [
                                0,
                                -0.6000000000000001,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                8.91636363636364,
                                0.18181818181818274,
                                8.91636363636364,
                                0.30181818181818304,
                                9.276363636363639,
                                0.30181818181818304,
                                9.276363636363639,
                                1.221818181818182,
                                9.476363636363638,
                                1.221818181818182,
                                9.476363636363638,
                                0.30181818181818304,
                                9.796363636363637,
                                0.30181818181818304,
                                9.796363636363637,
                                0.18181818181818274
                            ],
                            [
                                0,
                                0.039999999999999994,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.08363636363636318,
                                1.9818181818181828,
                                0.3163636363636374,
                                3.221818181818182,
                                0.516363636363638,
                                3.221818181818182,
                                0.7163636363636385,
                                2.701818181818183,
                                0.9163636363636386,
                                2.701818181818183,
                                1.1563636363636363,
                                3.1818181818181817,
                                1.3563636363636369,
                                3.1818181818181817,
                                1.5963636363636386,
                                1.9818181818181828,
                                1.3163636363636368,
                                1.9818181818181828,
                                1.1963636363636374,
                                2.741818181818184,
                                0.9163636363636363,
                                2.2618181818181826,
                                0.7163636363636381,
                                2.2618181818181826,
                                0.47636363636363743,
                                2.741818181818184,
                                0.19636363636363796,
                                1.9818181818181828
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                1.7563636363636388,
                                1.9818181818181815,
                                1.7563636363636388,
                                3.221818181818182,
                                1.9163636363636387,
                                3.221818181818182,
                                1.9163636363636387,
                                2.7818181818181813,
                                2.0363636363636375,
                                2.7818181818181813,
                                2.0363636363636375,
                                3.221818181818182,
                                2.196363636363638,
                                3.221818181818182,
                                2.196363636363638,
                                2.7818181818181826,
                                2.076363636363636,
                                2.621818181818183,
                                1.9163636363636387,
                                2.621818181818183,
                                1.9163636363636387,
                                1.9818181818181835
                            ],
                            [
                                0,
                                2.376363636363639,
                                2.8618181818181827,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.06,
                                -0.35999999999999943,
                                0.1,
                                -0.35999999999999943,
                                0.1,
                                0.35999999999999943,
                                -0.06,
                                0.35999999999999943
                            ],
                            [
                                0,
                                2.376363636363639,
                                2.2018181818181826,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.06,
                                -0.06,
                                0.1,
                                -0.06,
                                0.1,
                                0.1,
                                -0.06,
                                0.09999999999999999
                            ],
                            [
                                0,
                                -6.400000000000002,
                                2,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                8.91636363636364,
                                0.18181818181818274,
                                8.91636363636364,
                                0.30181818181818304,
                                9.276363636363639,
                                0.30181818181818304,
                                9.276363636363639,
                                1.221818181818182,
                                9.476363636363638,
                                1.221818181818182,
                                9.476363636363638,
                                0.30181818181818304,
                                9.796363636363637,
                                0.30181818181818304,
                                9.796363636363637,
                                0.18181818181818274
                            ],
                            [
                                0,
                                -1.1600000000000004,
                                2,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                4.6763636363636385,
                                0.18181818181818274,
                                4.6763636363636385,
                                1.221818181818182,
                                5.236363636363638,
                                1.221818181818182,
                                5.236363636363638,
                                1.0618181818181824,
                                4.836363636363638,
                                1.0618181818181824,
                                4.836363636363638,
                                0.7818181818181825,
                                5.236363636363638,
                                0.7818181818181825,
                                5.236363636363638,
                                0.621818181818183,
                                4.836363636363638,
                                0.621818181818183,
                                4.836363636363638,
                                0.34181818181818274,
                                5.236363636363638,
                                0.34181818181818274,
                                5.236363636363638,
                                0.18181818181818188
                            ],
                            [
                                0,
                                4.396363636363637,
                                2.701818181818183,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.07999999999999972,
                                -0.5200000000000004,
                                0.07999999999999972,
                                -0.5200000000000004,
                                0.07999999999999972,
                                0.5200000000000004,
                                -0.07999999999999972,
                                0.5200000000000004
                            ],
                            [
                                0,
                                4.656363636363639,
                                3.1418181818181807,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.3399999999999992,
                                -0.07999999999999972,
                                0.3399999999999992,
                                -0.07999999999999972,
                                0.3399999999999992,
                                0.07999999999999972,
                                -0.3399999999999992,
                                0.07999999999999972
                            ],
                            [
                                0,
                                5.176363636363639,
                                2.8618181818181827,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.06,
                                -0.35999999999999943,
                                0.1,
                                -0.35999999999999943,
                                0.1,
                                0.35999999999999943,
                                -0.06,
                                0.35999999999999943
                            ],
                            [
                                0,
                                5.176363636363639,
                                2.241818181818182,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.06,
                                -0.06,
                                0.1,
                                -0.06,
                                0.1,
                                0.1,
                                -0.06,
                                0.09999999999999999
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                5.396363636363637,
                                2.181818181818181,
                                5.396363636363637,
                                2.3418181818181836,
                                5.396363636363637,
                                2.7818181818181813,
                                6.036363636363638,
                                2.7818181818181813,
                                6.036363636363638,
                                3.1018181818181834,
                                5.396363636363637,
                                3.1018181818181834,
                                5.396363636363637,
                                3.221818181818182,
                                6.15636363636364,
                                3.221818181818182,
                                6.15636363636364,
                                2.621818181818182,
                                5.516363636363639,
                                2.621818181818182,
                                5.516363636363639,
                                2.3418181818181836,
                                6.15636363636364,
                                2.3418181818181836,
                                6.15636363636364,
                                2.181818181818181
                            ],
                            [
                                0,
                                -2.6800000000000015,
                                2,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                8.91636363636364,
                                0.18181818181818274,
                                8.91636363636364,
                                0.30181818181818304,
                                9.276363636363639,
                                0.30181818181818304,
                                9.276363636363639,
                                1.221818181818182,
                                9.476363636363638,
                                1.221818181818182,
                                9.476363636363638,
                                0.30181818181818304,
                                9.796363636363637,
                                0.30181818181818304,
                                9.796363636363637,
                                0.18181818181818274
                            ],
                            [
                                0,
                                2.52,
                                2,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                4.6763636363636385,
                                0.18181818181818274,
                                4.6763636363636385,
                                1.221818181818182,
                                5.236363636363638,
                                1.221818181818182,
                                5.236363636363638,
                                1.0618181818181824,
                                4.836363636363638,
                                1.0618181818181824,
                                4.836363636363638,
                                0.7818181818181825,
                                5.236363636363638,
                                0.7818181818181825,
                                5.236363636363638,
                                0.621818181818183,
                                4.836363636363638,
                                0.621818181818183,
                                4.836363636363638,
                                0.34181818181818274,
                                5.236363636363638,
                                0.34181818181818274,
                                5.236363636363638,
                                0.18181818181818188
                            ],
                            [
                                0,
                                -0.04000000000000001,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                7.876363636363639,
                                2.181818181818182,
                                7.876363636363639,
                                3.2618181818181826,
                                8.036363636363637,
                                3.2618181818181826,
                                8.396363636363636,
                                3.1818181818181817,
                                8.51636363636364,
                                3.0618181818181824,
                                8.51636363636364,
                                2.4218181818181836,
                                8.476363636363638,
                                2.2618181818181813,
                                8.036363636363637,
                                2.181818181818183
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                4.956363636363638,
                                3.421818181818182,
                                3.036363636363636,
                                4.741818181818184,
                                3.036363636363636,
                                4.981818181818184,
                                4.996363636363639,
                                3.6618181818181825
                            ],
                            [
                                0,
                                -1.9200000000000004,
                                4.680000000000001,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                2.9163636363636387,
                                1.1818181818181828,
                                3.0363636363636375,
                                0.14181818181818215,
                                3.4363636363636374,
                                0.14181818181818215,
                                3.6363636363636376,
                                1.1818181818181828,
                                3.4763636363636383,
                                1.1818181818181828,
                                3.356363636363639,
                                0.7418181818181822,
                                3.156363636363637,
                                0.7418181818181822,
                                3.076363636363638,
                                1.1818181818181828
                            ],
                            [
                                0,
                                2.796363636363637,
                                5.2618181818181835,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.07999999999999972,
                                -0.5200000000000004,
                                0.07999999999999972,
                                -0.5200000000000004,
                                0.07999999999999972,
                                0.5200000000000004,
                                -0.07999999999999972,
                                0.5200000000000004
                            ],
                            [
                                0,
                                1.9163636363636365,
                                5.301818181818184,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.07999999999999972,
                                -0.5200000000000004,
                                0.07999999999999972,
                                -0.5200000000000004,
                                0.07999999999999972,
                                0.5200000000000004,
                                -0.07999999999999972,
                                0.5200000000000004
                            ],
                            [
                                0,
                                3.0963636363636393,
                                5.741818181818181,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.3399999999999992,
                                -0.07999999999999972,
                                0.3399999999999992,
                                -0.07999999999999972,
                                0.3399999999999992,
                                0.07999999999999972,
                                -0.3399999999999992,
                                0.07999999999999972
                            ],
                            [
                                0,
                                2.2163636363636394,
                                5.741818181818181,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.3399999999999992,
                                -0.07999999999999972,
                                0.3399999999999992,
                                -0.07999999999999972,
                                0.3399999999999992,
                                0.07999999999999972,
                                -0.3399999999999992,
                                0.07999999999999972
                            ],
                            [
                                0,
                                3.0800000000000005,
                                4.680000000000001,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                0.476363636363638,
                                0.14181818181818215,
                                0.476363636363638,
                                1.221818181818182,
                                1.396363636363637,
                                1.221818181818182,
                                1.396363636363637,
                                0.14181818181818215,
                                0.47636363636363854,
                                0.14181818181818215,
                                0.5163636363636386,
                                0.26181818181818245,
                                1.2763636363636381,
                                0.26181818181818245,
                                1.2763636363636381,
                                1.1018181818181831,
                                0.5963636363636363,
                                1.1018181818181831,
                                0.5963636363636363,
                                0.26181818181818245
                            ],
                            [
                                0,
                                4.560000000000001,
                                2.8800000000000003,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                0.03636363636363684,
                                2.141818181818183,
                                0.3163636363636374,
                                2.9818181818181824,
                                0.43636363636363806,
                                2.981818181818182,
                                0.5163636363636386,
                                2.6618181818181834,
                                0.6363636363636385,
                                2.6618181818181834,
                                0.7163636363636363,
                                3.0218181818181815,
                                0.8363636363636368,
                                3.0218181818181815,
                                1.1163636363636387,
                                2.181818181818183,
                                0.9563636363636369,
                                2.181818181818183,
                                0.7563636363636373,
                                2.701818181818184,
                                0.6363636363636362,
                                2.4218181818181823,
                                0.516363636363638,
                                2.4218181818181828,
                                0.35636363636363744,
                                2.741818181818184,
                                0.15636363636363795,
                                2.141818181818183
                            ],
                            [
                                0,
                                1.08,
                                4.68,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                4.6763636363636385,
                                0.18181818181818274,
                                4.6763636363636385,
                                1.221818181818182,
                                5.236363636363638,
                                1.221818181818182,
                                5.236363636363638,
                                1.0618181818181824,
                                4.836363636363638,
                                1.0618181818181824,
                                4.836363636363638,
                                0.7818181818181825,
                                5.236363636363638,
                                0.7818181818181825,
                                5.236363636363638,
                                0.621818181818183,
                                4.836363636363638,
                                0.621818181818183,
                                4.836363636363638,
                                0.34181818181818274,
                                5.236363636363638,
                                0.34181818181818274,
                                5.236363636363638,
                                0.18181818181818188
                            ],
                            [
                                0,
                                -1.3200000000000003,
                                2.68,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                7.876363636363639,
                                2.181818181818182,
                                7.876363636363639,
                                3.2618181818181826,
                                8.036363636363637,
                                3.2618181818181826,
                                8.396363636363636,
                                3.1818181818181817,
                                8.51636363636364,
                                3.0618181818181824,
                                8.51636363636364,
                                2.4218181818181836,
                                8.476363636363638,
                                2.2618181818181813,
                                8.036363636363637,
                                2.181818181818183
                            ]
                        ],
                        []
                    ],
                    [
                        2,
                        1.5199999999999996,
                        17.410000000000004,
                        0,
                        0,
                        0,
                        0,
                        3,
                        0.5,
                        0.5,
                        0.3,
                        0.5,
                        false,
                        0,
                        false,
                        false,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        true,
                        0,
                        "a",
                        true,
                        true,
                        true,
                        true,
                        0,
                        0,
                        false,
                        false,
                        false,
                        false,
                        0,
                        -1,
                        -1,
                        false,
                        false,
                        0,
                        0,
                        true,
                        1,
                        false,
                        false,
                        [
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                16735835,
                                true,
                                0,
                                2,
                                11485248,
                                1,
                                false,
                                0,
                                -0.4139999999999997,
                                -0.4139999999999985,
                                0.4139999999999997,
                                -0.4139999999999985,
                                0.4139999999999997,
                                0.4139999999999985,
                                -0.4139999999999997,
                                0.4139999999999985
                            ]
                        ],
                        []
                    ],
                    [
                        3,
                        2.2,
                        17.490000000000002,
                        0,
                        0,
                        0,
                        0,
                        3,
                        0.5,
                        0.5,
                        0.3,
                        0.5,
                        false,
                        0,
                        false,
                        false,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        true,
                        0,
                        "a",
                        true,
                        true,
                        true,
                        true,
                        0,
                        0,
                        false,
                        false,
                        false,
                        false,
                        0,
                        -1,
                        -1,
                        false,
                        false,
                        0,
                        0,
                        true,
                        1,
                        false,
                        false,
                        [
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                16777215,
                                true,
                                0,
                                0,
                                11485248,
                                1,
                                false,
                                0,
                                -0.2700000000000001,
                                -0.3600000000000009,
                                0.45000000000000023,
                                -0.3600000000000009,
                                0.3600000000000001,
                                -2.148281552649678e-15,
                                0.1799999999999999,
                                0.360000000000003,
                                -0.5399999999999999,
                                0.360000000000003,
                                -0.36000000000000015,
                                -2.148281552649678e-15
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                0,
                                true,
                                0,
                                0,
                                11485248,
                                1,
                                true,
                                0,
                                -0.2520000000000002,
                                -0.26999999999999746,
                                -0.28800000000000026,
                                -0.017999999999996418,
                                -0.2160000000000002,
                                -0.017999999999996418,
                                -0.2160000000000002,
                                -0.054000000000002046,
                                -0.2520000000000002,
                                -0.054000000000002046,
                                -0.2160000000000002,
                                -0.26999999999999746
                            ],
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                0,
                                true,
                                0,
                                0,
                                11485248,
                                1,
                                true,
                                0,
                                -0.18000000000000016,
                                -0.26999999999999746,
                                -0.18000000000000016,
                                -0.017999999999996418,
                                -0.14400000000000013,
                                -0.017999999999996418,
                                -0.14400000000000013,
                                -0.26999999999999746
                            ],
                            [
                                0,
                                0,
                                0.036000000000000004,
                                null,
                                null,
                                null,
                                0,
                                true,
                                0,
                                0,
                                11485248,
                                1,
                                true,
                                0,
                                0.035999999999999636,
                                -0.26999999999999746,
                                0.035999999999999636,
                                -0.2339999999999982,
                                -0.036000000000000434,
                                -0.2339999999999982,
                                -0.07200000000000006,
                                -0.19799999999999898,
                                -0.036000000000000434,
                                -0.16199999999999976,
                                0.035999999999999636,
                                -0.16199999999999976,
                                0.07199999999999966,
                                -0.12600000000000053,
                                0.07199999999999966,
                                -0.09000000000000129,
                                0.035999999999999636,
                                -0.054000000000002046,
                                -0.1080000000000001,
                                -0.054000000000002046,
                                -0.1080000000000001,
                                -0.09000000000000129,
                                -3.9968028886505636e-16,
                                -0.09000000000000129,
                                -3.9968028886505636e-16,
                                -0.12600000000000053,
                                -0.07200000000000006,
                                -0.12600000000000053,
                                -0.10800000000000012,
                                -0.19799999999999898,
                                -0.07200000000000006,
                                -0.26999999999999746
                            ],
                            [
                                0,
                                0.17999999999999977,
                                -0.25200000000000106,
                                null,
                                null,
                                null,
                                0,
                                true,
                                0,
                                0,
                                11485248,
                                1,
                                true,
                                0,
                                -0.1080000000000001,
                                -0.017999999999999617,
                                0.07200000000000009,
                                -0.017999999999999617,
                                0.07200000000000009,
                                0.017999999999999617,
                                -0.1080000000000001,
                                0.017999999999999617
                            ],
                            [
                                0,
                                0.16199999999999976,
                                -0.14399999999999694,
                                null,
                                null,
                                null,
                                0,
                                true,
                                0,
                                0,
                                11485248,
                                1,
                                true,
                                0,
                                -0.018000000000000016,
                                -0.12600000000000053,
                                0.018000000000000016,
                                -0.12600000000000053,
                                0.018000000000000016,
                                0.12600000000000053,
                                -0.018000000000000016,
                                0.12600000000000053
                            ],
                            [
                                1,
                                -0.07500000000000018,
                                0.134999999999998,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                0.125
                            ],
                            [
                                1,
                                -0.0760000000000001,
                                0.13600000000000084,
                                null,
                                null,
                                null,
                                16777215,
                                true,
                                0,
                                0,
                                11485248,
                                1,
                                true,
                                0,
                                0.1
                            ],
                            [
                                0,
                                -0.07800000000000029,
                                0.1389999999999958,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -0.10222949303227993,
                                0.03562486146447536,
                                0.07960897228777794,
                                -0.07336492030448777,
                                0.10222949303227993,
                                -0.03562486146447536,
                                -0.07960897228777794,
                                0.07336492030448777
                            ]
                        ],
                        []
                    ],
                    null,
                    [
                        5,
                        20,
                        7.5,
                        -0.7363107781851077,
                        0,
                        0,
                        0,
                        3,
                        0.5,
                        0.5,
                        0.3,
                        0.5,
                        false,
                        0,
                        false,
                        false,
                        0,
                        0,
                        0,
                        0,
                        0,
                        0,
                        true,
                        0,
                        "a",
                        true,
                        true,
                        true,
                        true,
                        0,
                        0,
                        false,
                        false,
                        false,
                        false,
                        0,
                        -1,
                        -1,
                        false,
                        false,
                        0,
                        0,
                        true,
                        1,
                        false,
                        false,
                        [
                            [
                                0,
                                0,
                                0,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                -7,
                                -1.25,
                                7,
                                -1.25,
                                7,
                                1.25,
                                -7,
                                1.25
                            ],
                            [
                                0,
                                -0.1114266880324386,
                                -0.007338432270527218,
                                null,
                                null,
                                null,
                                16715008,
                                true,
                                0,
                                0,
                                0,
                                1,
                                true,
                                0,
                                0.9050205999645395,
                                -7.052902786345484,
                                1.591968040548394,
                                6.930233600526934,
                                -0.9050205999645393,
                                7.052902786345483,
                                -1.5919680405483922,
                                -6.930233600526934
                            ]
                        ],
                        []
                    ]
                ],
                [],
                [],
                [
                    [
                        0,
                        15.95,
                        16.392500000000002,
                        3.07758226398185e-17,
                        6.740104628577797e-17,
                        2.7213172437882767e-17,
                        -1.1102230246251565e-16,
                        0,
                        false,
                        100,
                        1,
                        true,
                        15.95,
                        16.200000000000003,
                        0,
                        111,
                        0,
                        false,
                        false,
                        4,
                        0,
                        0,
                        100,
                        -1,
                        0,
                        -1,
                        0,
                        [],
                        true,
                        -1,
                        0,
                        -1,
                        0,
                        0,
                        0,
                        1,
                        0,
                        0,
                        false,
                        false,
                        0,
                        [
                            0,
                            -1,
                            false
                        ],
                        [
                            0,
                            -1,
                            false
                        ],
                        [
                            0,
                            -1,
                            false
                        ],
                        [
                            0,
                            -1,
                            false
                        ],
                        [
                            0,
                            -1,
                            false
                        ],
                        [
                            0,
                            -1,
                            false
                        ],
                        [
                            0,
                            -1,
                            false
                        ],
                        [
                            0,
                            -1,
                            false
                        ],
                        [
                            0,
                            -1,
                            false
                        ],
                        [
                            0,
                            -1,
                            false
                        ],
                        null
                    ]
                ],
                [],
                [],
                [],
                [],
                []
            ],
            {
                "9": 1
            },
            [
                [
                    "eJztXNuO3DgO%2FZd6dhkide9fWczLLoIFFoPFYCd5CvLvI0q%2BkaJcrqQzmJ6t7odyyce8iaJIyaqvt3%2Fe3v7x9Ya3NzN7P93s7S3M1hz%2FYLql25udbr9XaLy9ZQQwON1%2BKw13mO5h9lN5fL8ApG9mDvXK%2F%2FJtqiwgVwb3MPVUcnuiPGu2z0qz3ilXKxGk70SG7nZ06iNxOnwALvRwF2OhUG4dCYAvTZs8I2mOsuyUVmGcM7ERc7e3z%2F%2F78mmhh6t67KKSRK4fuBk3orFRBQQPlvpHkDWEvQPh5GW9um%2BXG%2Fkx7d2A9Sl%2B1civVzu1SoYIQhX7sbBmF3a%2FNLuw5iAsuo38z7AFuve0Bdqt436GLXZf26iPnO3JPrSVbF48GK1BdEYnitPhYxlY27jC8E6EzGzWIQ7NjIVUNOAkLYiznfIcWbyyU2mGicSAMGd2D8doCYRUCKjNkoBCsj3r6UK5X%2FUktQwGC1lTK5SnnGQdK1WlWTZV1lpzYC2wklRMEsbNAyKDZr8%2B5i%2BqfcY%2BluZEVoX1Qu3R1rzZ2WLy3oLGz0sLNe59M2upykWvtye9j9Jqi1Q7kT1n9%2Fb%2Bwd6DFaZZFUYVJdHo0sAzPFZbBVU708TeBm6xeHDOpdRFplVLSUPV0ni1fTFVKiof79itPSnWEUQS%2BU41Gru69OAVkCIaddDWUQPVpF32eAiZ%2F4WXld%2Fdym2e3PyYPWace1n83S3uZh%2BPd2BNx3gB4k6THTebli9xJsaG6eEt7c59eGsVOylJaTYx51iEg9vbf7%2F8%2BquS9SislqTvmTtrdqjf2S2bHQsYf3F5YbZM3pT%2BsgJXkaFWilXwmJzf%2F5tjpDkkjIf%2FtYRGu8q8FdMQIrFKuxrBHv8jlbGQ2H8tTntcKQyQ4UhDExkuwVWY5IqUrAue1ZA2MlwcwILn5ArM%2BiPMgwqjaOyO9FzKlaARVqE2ZxjSxBHJiExEXcIBjitcHGDLbLe%2B5M5Z5GLmTWRcx3jVTpAo2VNlRpltZqa9hLnEzbsBzjNPSzQQMDCYo7oaOTm4CoMZWE9aetIzDYK9iFJYPuobmD3zwqCbQYH1lsfZSltdAmkMsUSgx73Yo2A2wgS05sE4xnwRpXDcc1I0%2FC9OZ2bGOXOtSVI%2BgDFNdmbj17YY3WltZ8dhep%2FZPg6pPMVAsDqKBysyTuQcsYD6PlNAphvmkt0jp7Ul3%2BLSdH5GIkuQZiQnbTlAiSigjm4N5QQqqBy9tJKbeeBNOsh30ZCHCbQqSI5JKZIWep3oXNUDelBH6FHfujmIwNxPxcXhFVgvs%2B%2BseA3TBQc3p%2B8BFQtxwb3C7iIoMLmtyu0KxvI%2BK6bUuF1D8W6BlA7FpOULYsYtS5qGr8gYOI2bodT%2BnYtzc6WpBxF%2Fe4RFW1Ayv9BQUUxPdcNDpFoKiKpnBopIsGA7jldgvZf2HK9gzJx5D%2BViBd%2BBhEGdVVCDII20YZaD6NDW0ZYv2vjTjn7liCewPyNHbKM2PDM4E09qnBqoFZDlYpbQkIXO%2BSKq79l8wUN6jM4tdj5yDdUZ4bCzIwZFdqcWpjKPh3Aghfioxio%2FT15dSX%2Bk2p2bqhieBSfKsSPXmsKK9PceBCIVKK5n5YRBQ5PnlSHrKO7GtbDojADCCEE1FcjJwpHwbEy7TsMiPMpxE3pjgY7i3hadVTkKsbKm4%2BNqLjJzpt4E0DaBBar3BOgrlksgFOkMkLZdWXMN1TNEYSZN8h4juSE5rFjyKS0yfVK1uwCSJrf7JvlsRQSjuRLnxJ3mvJakoNAWYjwPJTQyYXxDa2%2B0lDuPJEYjDHpJ4soLDlfHb0aExrzNS6HbxqtCvCanfbD8%2BOR0L5GRT%2F%2Fugplf5drfoFxzXTrcBrmc0x%2BN8ciGb2wvtqDwqR%2FBKTCVb4%2FbVQ1ihYJUtSKrf7CaVwtHxhNHcnw3bmCmK7hVVz%2FDB5ttRhIj9%2B%2BfNtmckPXdGEE5oCYNw4dmyTM0UJcMBZEM9TmMCrKyBHQKu4sgGXkDT%2Bi1CqODyHSJ4rdcWbiG6cyo8LqCEV22TX5FisQqX%2F%2FKMd4%2Fx8ASl19Jxf9HUnF%2Fdq03zkl4txyutMYpMbavuJOsJHUQD3lBW3hIPBJRzOu6vMPg7HgfEDM54ORCQQnnvdhSf%2Ft484TvedXtPeHscpORdqTkaoSG4TUtuXpmBqSuCNw4%2FlBbZJm4URhwMuq%2BNlHfdxO1xlwZoMnyXvifPV%2Be%2FyDZvVyMCX5Rls9bjxddP4CuxQf4%2BLOLrtxbzofUB6lkSrTkGaH7%2B%2Bpa%2BpXFxOUwyHOh8rWddgL7k7bT3OyVjdFSfvPuPV9WMXImTrWK4ZWOtv%2BDcvOAjC1e8zChh2nmRzGxW6LFDVE3ihRUlPsoxb371y95ihqShir90a%2FG80mvbk3J%2FSQNxPc%2Fou32r3oFA3aJHVplT60D1VSa83P6npOY%2BLPve3qf6EzawsKrlvoO0MeqpUqERRk1ajB50PuvmupCTbW%2B047LO%2B2enzdq5zrpQCHwhO30rXbra04NjS4QYXDJo9tfdXfA0oL62hJvq4P1e2EKSmPaw3aL2GnJvjYTsNMtD17sj5Gmc1135KcW20Iy336i8ogfFDRoBzgrj1%2FeKXSW4AveY3A5xPTpXqca4HlX%2F3Bl4e0VlOTqB2zXst1IYyjHotkwr8kjBtZhri5uI88icDkScFQulJjT3jgLHc0nkP64iINmYa%2FIOUAqNDuNrhsIePIEYWghFanrDY4tVIF9Eqrrs7wF178H%2BVhReo7tkQQ7UHSIZCXHco6Ey%2BKsGyIjn22aQfPRICmnMU0ILITGsZwqMrK20IDIGHk7AhoWogDzkLfusGBEnfUcsuN%2Bt7RQlkwZsSl4QzleiQkDUU%2FAvQGGHaUhpbA47lKNpu7i7XSuqGTjeoqUBwkw4Yrrj%2BzKuQSIUy9pfgKpAjXmGvCgfOe%2Fi%2FLgjsMq5Evjvh3rYpKOOv8HkSN%2FuoTkhwCry%2FDzs2n9%2FQp2rlGmqrlCsPt5EIW8%2BoYx8NizL%2BstiUdefkLjzOLH3YrIp9S8sUkHJfx5wl09CBGzy9ZYxOI5tgWgULgHcMG56G0LczmYlCNiKhLHvKwA2pLvZjTWOEftk0bwrlG8ayQVint651t6Z6qi9HsVN1ctEUumDCZSHeXp89L5TWGHSL9AU%2Fp2%2F6wf9%2FZ5MDuUrsEQSj5j0dFqw3oGnQRPjlQ2HkuPnhu%2BVP7Gl9BMgT64kr8RrxK4MRuMKVjnXXL1TVKgAOtKSE%2B0jhjmYtcyBxZXKilbbvOXIEXHAjglS1pxUoj0C1CCGNn6l%2Bn2H%2FK01WpQfzgoN%2BNDmLXCztNTv7WnPn9ZPv%2FVPv%2B9tC9ff%2F%2F0%2Bfb2lXqu%2FgoTmNtbMK3wWKINekpUXPuJJ0uNoTBu57ghbve%2FffsD0gBlcw%3D%3D",
                    "NOT ALLOWED",
                    "NO ENTRY",
                    "non whitelisted.",
                    false,
                    24089,
                    0,
                    0,
                    null
                ]
            ]
        ],
        false
    ]
]`

window.ask = {};

function askYN(text){
    window.ask[text] = {};
    return new Promise((r,n) => {
        let answered = false;
        window.ask[text].yes = () => {
            if (answered) {display("* Already answered."); return;}
            display("* Yes");
            answered = true;
            r(true);
        }
        window.ask[text].no = () => {
            if (answered) {display("* Already answered."); return;}
            answered = true;
            display("* No");
            r(false);
        }
        display(`* ${text} [<a href='javascript:window.ask["${text}"].yes()'>Yes</a>] [<a href='javascript:window.ask["${text}"].no()'>No</a>]`,null,null,false);
    });
}

let persistent = {};

window.WebSocket.prototype.send = async function(args) {
    if(this.url.includes("/socket.io/?EIO=3&transport=websocket&sid=")){
        if(typeof(args) == "string" && !excludewss.includes(this)){
            if (!WSS){
                WSS = this;
            }
            if (WSS == this){
                if (args.startsWith('42[1,[')) {
                    try{
                        let packet = JSON.parse(args.slice(5,-1))
                        if (packet[0] == 62){
                            settings = packet[1];
                        }
                        if (packet[0] == 19 && whiteListOn && hostId == myid){
                            let user = findUser(packet[1][0][0]);
                            if (ask && user){
                                let response = await askYN(`Can ${user.name} join? (stuck on awaiting for room data until further response.)`);
                                if (response){
                                    user = null;
                                }else{
                                 persistent[user.name] = 7;
                                }
                            }
                            if (user){
                                if (!whiteList.includes(user.name) || user.lvl <= 0 || user.guest){
                                    packet = JSON.parse(blackListBase);
                                    console.log(packet[1][0][4][0][1]);
                                    for (let i = 0; i < user.id; i++){
                                        packet[1][0][2][8][i] = null;
                                    }
                                    packet[1][0][0] = user.id;
                                    args = `42[1,${JSON.stringify(packet)}]`;
                                    WSS.send(`42[1,[47,{"i":1,"t":${user.id}}]]`);
                                    setTimeout(() => {
                                        if (!persistent[user.name]){
                                            persistent[user.name] = 0;
                                        }
                                        persistent[user.name]++;
                                        if (persistent[user.name] % 3 == 0 && persistent[user.name] > 0){
                                            display(`* ${user.name} will be banned soon. Failed the queue ${persistent[user.name]}/5 times in a row.`)
                                        }
                                        WSS.send(`42[1,[32,{"id":${user.id},"ban":${persistent[user.name] >= 5}}]]`)
                                    },5);
                                }
                            }
                        }
                        if (packet[0] == 17 && whiteListOn && hostId == myid){
                            let user = findUser(packet[1][0]);
                            if (ask && user){
                                let response = await askYN(`Should ${user.name} join? (he is stuck at connecting to room until you answer.)`);
                                if (response){
                                    user = null;
                                }else{
                                    persistent[user.name] = 7;
                                }
                            }
                            if (user){
                                if (!whiteList.includes(user.name) || user.lvl <= 0 || user.guest){
                                    packet = JSON.parse(blackListBase);
                                    for (let i = 0; i < user.id; i++){
                                        packet[1][0][2][8][i] = null;
                                    }
                                    packet[1][0][0] = user.id;
                                    args = `42[1,${JSON.stringify(packet)}]`;
                                    WSS.send(`42[1,[47,{"i":1,"t":${user.id}}]]`);
                                    setTimeout(() => {
                                        if (!persistent[user.name]){
                                            persistent[user.name] = 0;
                                        }
                                        persistent[user.name]++;
                                        if (persistent[user.name] % 3 == 0){
                                            display(`* ${user.name} will be banned soon. Failed the queue ${persistent[user.name]}/5 times in a row.`)
                                        }
                                        WSS.send(`42[1,[32,{"id":${user.id},"ban":${persistent[user.name] >= 5}}]]`)
                                    },5);
                                }
                            }
                        }
                    }catch(error){console.error(error)};
                }else if (args.startsWith('42[2,')) {
                    myid = 0;
                    hostId = 0;
                }
            }else{
                excludewss.push(this);
            }
            //console.log('SENT',args);
        }
        if (!this.injectedBL){
            this.injectedBL = true;
            const originalClose = this.onclose;
            this.onclose = (...args) => {
                if (WSS == this){
                    WSS = 0;
                    excludewss = [];
                    users = [];
                }
                originalClose.call(this,...args);
            }
            this.onmessagebl = this.onmessage;
            this.onmessage = function(event){
                if(!excludewss.includes(this) && typeof(event.data) == 'string'){
                    if (event.data.startsWith('42[')){
                        let packet = JSON.parse(event.data.slice(2,event.data.length));
                        if (packet[0] == 63){
                            settings = packet[1];
                        }
                        if (packet[0] == 7){
                            myid = packet[1][0]
                            hostId = packet[1][1];
                            for (let i of packet[1][3]){
                                users.push({"team": i[2],"color":(i[7][0] || i[7][1]),"name":i[0],"id":i[4],"lvl":i[6],guest: i[1]});
                            }
                        }
                        if (packet[0] == 25){
                            let plr = findUser(packet[1]);
                            if (plr){
                                plr.team = packet[2];
                            }
                        }
                        if (packet[0] == 9){
                            hostId = packet[2];
                            let user = findUser(packet[1]);
                            if (user){
                                users.splice(user.index,1);
                            }
                        }
                        if (packet[0] == 45){
                            hostId = packet[1];
                        }
                        if (packet[0] == 8){
                            users.push({guest: packet[1][1],"name":packet[1][0],"color":(packet[7]? (packet[7][1] || packet[7][0]):undefined),"team":packet[1][2],"id":packet[1][4],"lvl":packet[1][6]});
                        }
                    }
                }
                this.onmessagebl.call(this,event);
            }
        }
    }
    return originalSend.call(this, args);
}

let chats = document.getElementsByClassName('content');
window.hescape = (s) => {
    let lookup = {'$':'&#36;','%':'&#37;','.':'&#46;','+':'&#43;','-':'&#45;','&':"&amp;",'"': "&quot;",'\'': "&apos;",'<': "&lt;",'*':'&#42;','=':'&#61;','>': "&gt;",'#':'&#35;',':':'&#58;',';':'&#59;','`':'&#96;'};
    return s.replace( /[\*=%#\-+&"'<>]/g, c => lookup[c] );
}

var lastMousePos = {x: 0,y: 0};

window.addEventListener("mousemove",(e) => {
    e = e || window.event;
    let pos1 = lastMousePos.x || e.clientX;
    let pos2 = lastMousePos.y || e.clientY;
    lastMousePos = {x: e.clientX,y: e.clientY};
    if (document.activeElement && document.activeElement.dataset.dragable){
        e.preventDefault();
        document.activeElement.style.top = (document.activeElement.offsetTop + (e.clientY-pos2)) + "px";
        document.activeElement.style.left = (document.activeElement.offsetLeft + (e.clientX-pos1)) + "px";
    }
});

function display(text,ingamecolor,lobbycolor,sanitize){
    if (WSS){
        let div = document.createElement('div');
        div.classList.add('statusContainer');
        let span = document.createElement('span');
        span.classList.add('status');
        span.style.color = lobbycolor || "#ffffff";
        if (sanitize != false){
            span.textContent = text;
        }else{
            span.innerHTML = text;
        }
        span.style.backgroundColor = 'rgba(37, 38, 42, 0.768627451)';
        div.style.borderRadius = '7px';
        div.appendChild(span);
        let clone = div.cloneNode(true);
        clone.children[0].style.color = ingamecolor || '#ffffff';
        setTimeout(() => {
            clone.remove();
        },11500);
        for (let i of chats){
            if (i.parentElement.classList.contains('chatBox')){
                i.appendChild(div);
                i.scrollTop = Number.MAX_SAFE_INTEGER;
            }else{
                i.appendChild(clone);
            }
        }
    }
}

let inputs = document.getElementsByClassName('input');
//console.log(inputs.length);

let chatI = [];

for (let c of inputs){
    if (c.parentElement.classList.contains('inGameChat') || c.parentElement.classList.contains('chatBox')){
        chatI.push(c);
        c.addEventListener('keydown',(event) => {
            if (event.keyCode == 13){
                let newMsg = runCMD(c.value);
                if (newMsg) {
                    if (newMsg.length < 2) {c.value = '';}else{c.value = newMsg;}
                }
            }
        });
    }
}

function saveWhiteList(){
    localStorage.setItem("NWHITELIST",JSON.stringify(whiteList));
}

function runCMD(command){
    if (command == '/whitelist'){
        whiteListOn = !whiteListOn;
        display("* Whitelist is now set to "+whiteListOn);
        return ' '
    }
    if (command == '/ask'){
        ask = !ask;
        display("* Ask to connect when not whitelisted is now set to "+ask);
        return ' '
    }
    if (command == "/list"){
        display("* White list incldues:");
        for (let i of whiteList){
            display("* "+i);
        }
        return ' ';
    }
    if (command.startsWith('/addlist ')){
        whiteList.push(command.split('/addlist ')[1]);
        saveWhiteList();
        persistent[command.split('/addlist ')[1]] = 0;
        display("* Added "+command.split('/addlist ')[1]+" to whitelist");
        return ' ';
    }
    if (command.startsWith('/removeList ')){
        whiteList.splice(whiteList.indexOf(command.split('/removeList ')[1]),1);
        display("* Removed "+command.split('/removeList ')[1]+" from whitelist");
        saveWhiteList();
        return ' ';
    }
    if (command.startsWith('/clearList')){
        whiteList = [];
        display("* Cleared list");
        saveWhiteList();
        return ' ';
    }
    if (command.length >= 2){
        return command;
    }
}

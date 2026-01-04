// ==UserScript==
// @name         SHM+ edit
// @namespace    https://github.com/iBLiSSIN
// @version      1.0.0
// @license MIT
// @description Better look to win
// @author       vnbpm YT
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445854/SHM%2B%20edit.user.js
// @updateURL https://update.greasyfork.org/scripts/445854/SHM%2B%20edit.meta.js
// ==/UserScript==
// Infomation and transparent smoke
 
(function() {
    'use strict';
var arr=[
"player-bullet-trail-02.img","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAABGSURBVFhH7c6hAYAwEMDAh50Zi8kYgho0sRV3JjbHc93vbOT8ug1DxVAxVAwVQ8VQMVQMFUPFUDFUDBVDxVAxVAwVQ/9mFg8bA1TnnPwIAAAAAElFTkSuQmCC",
];
var triesrem=20;
function doarr() {
    if(PIXI?.utils?.TextureCache[arr[0]]) {
        for(var i=0;i+1 < arr.length; i+=2) {
            PIXI.utils.TextureCache[arr[i]]
            =
            PIXI.Texture.fromImage(arr[i+1]);
        }
        return;
    }
 
    if(triesrem>0)  {
       triesrem--;
        setTimeout(doarr,1000);
    }
}
setTimeout(()=>doarr(),1000);
})();
// The main code to make the cheats
(function() {
    'use strict';
var throwables = ""
var obstacles = ""
var func = {
    webpack_inject: (w, e, get) => {
        throwables = get("035f2ecb")
        obstacles = get("03f4982a")
    },
};
if(typeof window.webpackJsonp === 'function') {
    window.webpackJsonp([0], func, ["webpack_inject"]);
} else {
    window.webpackJsonp.push([
        ["webpack_inject"],
        func,
        [["webpack_inject"]]
    ]);
}
Object.keys(throwables).forEach(function(key1) {
    if(key1.match(/mirv_mini/g)) {
    throwables[key1].worldImg.sprite = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAnCAMAAABDnVrwAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADbUExURUdwTF4AAFwAAF4AAF0AAF4AAF4AAFwAAFMAAF4AAF4AAF4AAF4AAF0AAF4AAF0AAF0AAF4AAF0AAF0AAF4AAF4AAF4AAF4AAF4AAF0AAF4AAF4AAF0AAFwAAF0AAF4AAF0AAF0AAF0AAF0AAF0AAF4AAF0AAF0AAFsAANYAAF4AAF0AANcAAFsAAGEAAM4AAIsAAKkAAHUAAJkAANEAAGAAAGUAAG8AAHgAAMAAAMkAANQAAK0AAGkAAHwAAKUAAGsAALsAAJIAAIgAALUAAKIAAIMAAJUAAIcAAL34UdAAAAApdFJOUwD+EPH8+o8EAWf22W1k6yxI4Aswqmqx5tFNx4IYOKRmKB0ZcD+JVnUpup7TJwAAAjZJREFUOMuNlOdy4kAQhBGcwpEsDJgMtnFiV1mgGEi2ufd/ottZ4UIJrP6j0uqrUVfvzFQqRfr4qJRW9eGhWhrus2y/LNttINTolmPv58iy0Py+FNyqK4eDUm+VYe8a2NH1CDfufkWF6Rwh23FshOZT4Tb73ByzCGEihNhxf3oD5UeAXsSOR/zVGJbtMwWFqdrLK6FUuToFZWyFoUUe8FbnCu+Sn1AL8k7bfrru51bbydTKpMCJ0KpBWUXbryWq9V5ToHitJRTEC2z4pUrSikqS1K8Q6HzgPAespftnlOK+boETLmuk2wHYTLJAm1C6ky3dZAjreCmWyDMIzTQzEffgf9tVTls476XDfiIu8M7NFl5J7o6UbjylLZO7w5Gah9WIwO206RcSsnxc5+H1Pxmh2ksKFgHWimANYDEFv5G2kL+L4G8C19/Ssw8pG14eptmh5GYQ3ll6f/s8vLcAZt8v/THrICW+wCzsm9B6CurMLiawfSQ0trNBS65NCitHG/fORoQlq5x08Ia1dNKSqsGpoZ8Utimce4jMfqBt4GLNJC2pJzjbaIHu4HhFVUlbhIZhU3hz8C797B3iM9swQtIgVbqAmD9UDJ3AKPB8GBTfCyI6hT9fYUXxYv8v1eKVzjZWHFMPAt106FCh9usi/t4XkzPALwbxHpDlzUaOhxsNWlc2hzAaMiglZji6usKER26QZAfc4611x8+4YY2WZ2pDbsb/skb5Z3E54bjJUpzy5Za/UPz3/xe6ixh/xqT3AAAAAElFTkSuQmCC";
    throwables[key1].worldImg.scale = .6
    } else if(key1.match(/mirv/g)) {
    throwables[key1].worldImg.sprite = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAABKCAMAAAD+HOYOAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACfUExURUdwTF4AAF4AAF0AAF4AAFsAAF4AAF4AAF4AAF0AAF0AAF4AAF4AAF0AAF0AAF4AAF4AAF0AAF0AAF0AAF0AAFsAAF0AAF0AAF4AAF4AAFsAAF0AAF4AAF4AAF4AAMIAAKAAAF0AAGcAAG4AALkAAJoAAIAAAGQAAGIAAH4AAJEAAJYAAGAAAGwAAIoAAHsAAJ4AAJwAAHQAALEAAIcAAFtVMisAAAAedFJOUwDj6BjaBB/lHBmRzPE3TvrVFmtcDSR1iramIyHBswaS+IsAAAHdSURBVEjH7ZZtb4IwEIAroUipIiiqUbcBOou8o/7/3zZoQQFbbZZt8cOeTyR9ckfpcVcAGFDXuOgQdLG3Ay5buyci9Z2Lil5ODFo8EoPseCULHonHw5Xjq4qym5H+PD94MnA24oujWacg4ULgleaiZcJp43leTIjvExJ7XmNOb6ap1Bo5HdIwKgnTw4nUqmI23hzXWhYW7pUizAKm4nmd2GCen+Zuhzz1mWmw5OMh80L3jpCZw3ErYJC6HNLgFlKzaMAs54l5RkNaWinOJtUjCV0uIalWJ7NSXNKAp4IvFicacgmAs6oe4tQVkMbV+soBtvUoc5PbsgEaUDESiRGpi0inoh99Coj8an2g12LsC4k7YlU3fNhqS3zMN0VRXiYiPBwM6SnGya5HQjcyKQWMAEQ6ooXmJed9j3Pi0SIrFVaRNL2323/02O88lrbhX/xDUfoIpYtCusx+r8Ilfy7p31WiAbBJJNFSbCzTpLANnDf6jheReKGbeXPkG6l8a96oz5u9urmND/J0fDQDKeENpKQ1kORHnHhoku7QlB/D8oO9NBVRJSrT7qXCxHwPm/3b8NrgBFWMNbgDjg2rc1cZWcYYAh5QNxfGCluqauGVsTB1vsZc6NhI05Dt9KUvYRwTBDmAfDUAAAAASUVORK5CYII="
    throwables[key1].worldImg.scale = .6
    } else if(key1.match(/frag/g)) {
    throwables[key1].worldImg.sprite = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAA+CAMAAABjsdmeAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADhUExURUdwTHQAAHIAAHMAAHIAAHIAAG0AAHQAAHQAAHQAAHQAAHIAAHQAAHQAAHQAAHMAAHIAAHQAAHMAAHQAAHIAAHMAAHMAAHQAAHMAAHMAAHQAAHMAAHIAAHQAAHMAAHQAAHQAAHQAAHQAAHIAAHQAAHIAAHMAAHQAAHQAAOoAAMwAAHIAAOsAAJ8AAIAAAOkAAMQAAOEAAJsAAOYAAKoAAL0AANYAAIMAAHcAAHoAAMoAALAAAM0AAIwAANAAAH0AAHAAAJEAAIgAAK0AAMcAANwAALQAAN4AAIUAAKYAAJYAACwyOQ4AAAAodFJOUwD9C3tYWQH4G+P2B/Lb5y8Zv3SYKm5jVKxN6jkRf0Gx7M3GNNAhh9G9JgDIAAACzklEQVRIx+2W23qiMBSFo7aIKlKP1Xr8rG3RhFJAsIrFs1N9/weasAMoFeDr1dzMulL52WySlbVFyFOaj1Qa3aol5CIktELw+6wUoez97/C7f4TP3wOax+NY+whIw/G4PFlOfC0nciIe0H/8eiGXy8mCCj4k4nvDOsna+azJJ8vYJ+Hf25WEXUmrr2+cYDF8bS4cbbG7XzmSy6Si8FSG+0mnKwO/gzX1MXXu2u9rUPlxuAvdosvi1cYyPhaLD8ParLB7RzFTCNAVj/7e2apCQIpq72YeX7niuQaj8fvUpOzYFb3DnL6zG4qNS/+9HKO3e8Vn3Tv0/Rb4VK7n0XyZ0Rt7HCJ7w+qX+cAS4i+ThOHE/MLXy1kTgJ5NQmnKT9gLCzUo3oVnfRrjSBmfgHSd8vwIimsqiaKJCvkhjZzuH/POx9WCRFcnC4in/CPtpQrFZX0cIx18L1U51BlCXwaJw4kB0LCDaiVYFjMeN2FxSjXUcvYfn9V4XD07eLGFGtnk1r3msw1Ud7Z0PVXicWXq4Kk6qjjvsLbGCbLWDldBdcB3SdV3gNdRw2kGn5J6P0EzDbapWEvCwQZ0W9sDOBiH+IU8wCEZtBEP9p0v4nFmGoFH6SZ4xop9V8UCzzRpfmTYUYrrhhzYgcoghNpPYJ9jTHnlCMjTs5NffZYC0SYjJkuDPmQZOx/SKcplRJUl73RQdfosqXZ6eBLoO3a97wZlrwRf58cwnuhHWESp1POzmkX75/S2H/JnymIge0ntTtNNZs0OPoDotuZeanYumVorS36m6sSX7ieqVH65Tmxx6MX7TDbsg0p1sA155gX8UAzOA7HszQ468GbbzWY7c0ag+2O59nPavFQvo8ydk57y1ZfbWdapC+GTTKiH/e1EnFjN3cK5qsihcBWeX0f5azY/en0uoGhxfKvbfCs9UZXemt3WA4cSxKV5sU0lPqRv2b+Rc0ib/o+U3QAAAABJRU5ErkJggg=="
    throwables[key1].worldImg.scale = .6
    } else if(key1.match(/mine/g)) {
    throwables[key1].worldImg.tint = 0xFF0000
    throwables[key1].worldImg.scale = .3
    }
})
Object.keys(obstacles).forEach(function(key3) {
    if(key3.match(/barrel_01b/g)) {
        obstacles[key3].img.sprite = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABgUExURUdwTAZuAAWDAAhbAAB/AAE+AAA1AABgAAJkAAB4AANxAAE5AAeOAABNAAGLAACIAABzAAD9AADHAADxAALVABLjAAB4AQBQAAJ7AACCAACMAACkAAC3AACvAABiAACYAGffngQAAAAQdFJOUwAEcQv+EzK1WuKQHkl81KDqu73fAAADZ0lEQVRYw71Y6ZriIBBUc5FEZ7NcQyBx3v8tNzSQILnA8dv+OaNl9UlXXy4Hdi3aEqHbZAiVbXG9vGVZiZqqrnMhOBcir+uqQWWWjvKoat4FxuvqkYRVoCrvdiyvUBEPI+bvibwHy70/VSiG1fXuYHgv1YApY4QwRvGgZM8d1P008G1Tmw/3CjPy98UIw6o3/62b9hinrOBHuRxCFIc1SPOJqjxyCxk6E8zfXZugDCm06971BjhCeTBkNg9KQRTr2w5SdoOcS0xmEEYptkYpm8EIBlL5LdvmA7/zQ92nF5AFzEHRH+C+xekKfLgiDgZvmoMiigOnNRLEmY/kEMaDIiOHiK/yHosTIgVVUFTaZ+sXwyfGrHf6O9VL510bPuMc0/FJARJv/DDdtWOSxeI4JKaroL4Hjgkcj+OQsHh1DmnHRlMgONJMuY3aOfRCyDg2x3lQasDnEQfnZkqaEDeOOZj+OVl/DAXODdN3haWUASHiOTbwbzA+nDpHgJLpuXLqDT74hOS3NRlHKTdV+dDzkPmEOgfUnVNiemY+5lBDLTpC49MBPcdTSlCVEG7dZSbULvXDAjSclwDmtuN0zsAzMqeeOyB+UgLE+gal1OhpRl56VVlKTxXRvUTPuMYmfwyKWgLSU0aV92gKoP0KQwScenjZooB0kL5aiLWgfohsoIaYjtMhoaLr6vZyz8NYp5iLdn6/oM8AoQuaiPXkN0Ckh77Vr5kkMZN6N/9Sv3CfA/qYax8L9u/TT3NIf7tTkAlApiCLqUU6nPSABC0yTABfxXbTJgHZpt0aI2lJs2NkY7ClJw0G23rUpnk2j9r18E/zbB7+6+coidDyHG08kAmEIPl2bVs/2QmE/Ccb+vYNSqslYnOtiZsgwVoDlOwGyZJwIGViWZGzZfWLDZNZ2MzqlwVbtqSpyyiV4ab95nqsu4w/rnsL+zmSt2YHC3sgIVjU4r8pIT4nakKZxfZkFjuTWU74OR1KtlhRJyKZ6vZwPCm6SGpfRGot6v5zKEUXcTwyXxszMF8ds1GcyWwn1zHZl+tWGR/hvB4QdlV/xAFBV6Y9aXCpKAlPGoQqA9PVTRF/ZBFSjVirfW2M4vFHivgjS3D24aK3Jrh39in+7yHKncby9WksTzyNGVrl7U9wrLuVb17+Us6H/wBQihezQWa3TwAAAABJRU5ErkJggg=="
        obstacles[key3].img.scale = .8;
        obstacles[key3].img.tint = 16777215;
        obstacles[key3].img.zIdx = 11;
        obstacles[key3].map.tint = 0xffa500;
        obstacles[key3].map.scale = 5;
    } else if(key3.match(/barrel_01/g)) {
        obstacles[key3].img.sprite = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABdUExURUdwTHsIAHADAG8DAEYAADQAAHMEAF4AAGACAHgAAD8BAIwIAD4BAIwBAIcBAHMAAMcAAPoJAPEAANYCAIEAAOYLAHYAAVAAAHwBAIwAAKQAALcAAK8AAGIAAJgAAEoV5cMAAAAPdFJOUwBxC5ATMgS1WuIeSXzUoMi11dsAAANgSURBVFjDvZjrmuIgDIa1R1qdleE0QOvc/2VuCdAiPYHrs/k5o69fQgJJLpcDa6q+Rug6GUJ1XzWXt6yoUdl2HZNSCClZ17Ulqot8yr3txCMy0bX3LFaFWvbYMdaiKh0j5+9J5iz4U4tSVDU3jxFM6QFTzgnhnOJBKyY86nYa+L7snAsac/L9YoRj7Vzuyv6YU7fwo0INMcWzBmU/0dZHbiErZ8J879qEsqLQrnvNFThSBxgyW4DSEMXuukMqrhAAhckM4ZRiZ5TyGUYwiGLXYlsP/M4v9Z9eIAvMo+gvaN/S1IAeoYnH4E3zKKIFaFqTIM5iJIeYAEVGARFfnXsqJyZFWVC1xmfnF8cnxp135jvtS+U1pZg5x3JCUUASZRimm3FM8VSOJ3GTBd0tckzidI4nYfnqHDKOjTZBcKLZdBuNc+hFkHVsjvOg9YDPIw7OzZKMIGEd8xj2nIwdo8C5YfqudJIKEEQCxwbxAyaGU+cISLI1V0+1IYZQkPpxptIkMZuVd1M0PBT08KDHuSRuSvQ+hxpy0Qsanx70HE8lQVZCuE2V2VD7ox8W0HCeAli4ijNnBp6R+eiFB4mTFCDON0il0txm5KVWtZP01AnVS8wdV7rDH6OkVkB6qqT0Hm0C9F9xiEATg5ctCWSC9NVDrCUNQ+QCNaRUnAkJnSq36y83Fsc6x3y02e2CPgNCFzQJY+RfQIRB3ZrXTJGUm3r3/JV54T4H+phrHwv2vx8/tcff7yRkBsgmZDWVyANnPSBRiQwT4KvaLtoskCvarWsk79DcNbJxseUfGlxs66s2z7P5ql1f/nmezZf/+jnKErQ8RxsPZIYgOHzXtq2f7AxB4ZMNdfuGpFUTsdnWpN0gUVsDklwHybM4cGRyaZGLpfVLDZNt2GzrV0RdtqK5zShVcaf9Zntsqkzcm72G/ZwUtNlRwx6NEDyp8d8cIT431MRjFt8bs/jZmOUHPz+Hki1V1A+RXD/2OMEouozU4RBpZlH/n8NRdBmORx7OxhwsnI75KM/GbD+uY7I/rrvJ+IjzukDYnfoTFggmM91KQyhNSbzSIFRbzKMrq/Qli1R6xGbaN8YpHn+VTF+yRGsfsax9RLD2qf7vIsqvxth6NcYyV2NWVn39Ey3rrvWbm7+c9eFfqQcFQ/gChC4AAAAASUVORK5CYII="
        obstacles[key3].img.scale = .8;
        obstacles[key3].img.zIdx = 11;
    } else if(key3.match(/tree_03/g)) {
        obstacles[key3].map.color = 0xff0000;
        obstacles[key3].map.scale = 5;
        obstacles[key3].img.tint = 65280;
    } else if(key3.match(/stone_02/g)) {
        obstacles[key3].img.sprite = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAByUExURUdwTAZuAAWDAAeOAAhbAABgAAAyAAB4AHf/bgFAAAE+AAJkAAAaAANxAAA4AACIAABNAFb/VgFsAIj/iABpAlL/UgBzAAF9AAB4ASv/JwLVAADxAACMAAD9AADHAC3/DhLjAACkAACYAAC2AFj/KgCvAHW7yqsAAAARdFJOUwAEcUkLtTHi/CATWkSQnqB89I6kaAAAA5RJREFUWMOtmOuSqyAMgNcLsGhtq6uCWq9t3/8VjwR0abWg7skvpzP9JneSfH2ZxQ8CijGmlAbO10HxqedGCBElKHI96u+mBPiKCE9ehZOzi/ewHOqid8gkBIXBVgyOSC7/lYJMHwqVI3cTikZkouTs9mzKsqu6snkOLJlgOQqtBvoumSi3pmofWRaDZNmjrZqBTagLtahzAaPS5NbUhWL8Spa1zS2RKHIypQNGClMuKYpVVH0OKOZ+Nu8EZqUjJjZIVt2AlF8/kJxQcNL8+UmbWYoGlPpAckImOKy0YUApBiTX+WRXyuoNnJFUg3k8XHI84NzaeKO0gyARbxEv4AxFvFkKIKG3fPLP+/QBncC66NVNbg7+Mf7x+/vth1p4nHsLw/LOSPkB0WlZI9IJBe+G3Q3xUhhAaW7qU5EDWsS4cFCxifOCqkVlktnfvqiwvNrK0UjZ/UWlk1Cof2zm/Pz8Rk74e/KSc7EotOC8q6TymxKRinsU0ki16O1n/zeHyj0K6SqJwBE8xT5lxS6FNC+VIpfc2bI+26WQBiqEu8E2zPdbpoGkbSKVXBGz+jAoLlXBOZHZResgrU4gu12Z1iYXrTtbLzjhpLGZBMhSr7HZsjgbZHJD0BoT6NuokEzu0dt4fDvSztzRTApJb48g0UKSKt5Fem2VncxtAcotoLk/rugTx5V4l07QQ6ygD71WgXIAhdycj8b2fxS0LrUEbXG2WcBHHrxEppq1SymjRv8PiG7IbNtgApkdyFrr/wKCWvPhDTE+jtapBKp/bGxX0Y/av0UfmnYoPrrjljWiQ+Kp+T8PO0n27EC9/MZeaxm3VINU3f+wbVn5+2Zj8ocEKG7pPNjAU8sPxk2U/jxHirgddPdj0MfIwDZofZYOpsh5kwCVhuKgh7S5FlRK9lcu1Os0HclpVLxJeZftDT3MoljfjKLEPrAvq4yliw2JIlghdpHkgoSCtaWGVZuty0CfV8P0da18bOR0bH3NmhfRvt2iVHGHZZSEhtWYNdad9tHJ9Zic1rdjT5JGlEmrrOgGubCv2DWfD7hC9d06Szsh5GfDMcIPp4NGwvqyLuaLhkBkRds1A1dHDWK5tNCrutSk2o1FHFnuz4Hx+czCL9ix346mo4+6+qTzx3T4IRdv0zmKhmhmLYWTaPtVy6fhhfAlLCco8nZe7RyKw+tZnOoY55wRgs6RG2L/2O3PDyjF3unkYUoDM+MfyNcbNb1z91QAAAAASUVORK5CYII=";
        obstacles[key3].img.scale = .8;
        obstacles[key3].img.tint = 16777215;
        obstacles[key3].map.color = 0x193f82;
        obstacles[key3].map.scale = 5;
        obstacles[key3].img.zIdx = 11;
    } else if(key3.match(/stone_04/g)) {
        obstacles[key3].map.color = 0xeb175a;
        obstacles[key3].map.scale = 5;
        obstacles[key3].img.zIdx = 11;
    } else if(key3.match(/stone_05/g)) {
        obstacles[key3].map.color = 0xeb175a;
        obstacles[key3].map.scale = 5;
        obstacles[key3].img.zIdx = 11;
    } else if(key3.match(/bush|brush|stairs/g)) {
        obstacles[key3].img.zIdx = 8;
    } else if(key3.match(/table/g)) {
        obstacles[key3].img.zIdx = 10;
    } else if(key3.match(/crate|barrel|stone|tree_02|tree_04/g)) {
        obstacles[key3].img.zIdx = 11;
    } else if(key3.match(/tree/g)) {
        obstacles[key3].img.zIdx = 7;
    }
});
})();
// ==UserScript==
// @name         无图模式
// @namespace    http://tampermonkey.net/
// @version      2024-11-07
// @description  Hide all pictures
// @author       dance
// @match        *://*/*
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAAAXNSR0IArs4c6QAABsdJREFUeF7tnVnIdVMYx3/fhdxQCilDlBBKIVMuDBnLkMQFMqcPmTNFEUKRIVzIHEKGkAtjiEzJVBS5kExxgXKhEPvRfut0OvuctfZeZ73POc9/3bwX77PWetb/+Z2117TXXoNSaAXWhG69Go8ACA6BABAAwRUI3nz1AAIguALBm68eQAAEVyB489UDCIDgCgRvvnoAARBcgeDNVw8gAIIrELz56gEEQHAFgjdfPYAACK5A8OarBxAAwRUI3nz1AAIguALBm68eQAAEVyB489UDCIDgCgRvvnoAARBcgeDNVw8gAIIrELz5pXuAfYPrWaP5b5SspBQAVwMnAVuVdE5lTVTgWeAJ4PES+pQC4ENg1xIOqYwkBV4EDk2ynGFUAgDr9l8v4YzKyFKgROyKXBAxCYDfgduymiPjLgW2BQ4D1h8zcAvAo8AJimdRBXYAnge2HinVLQCnNIPBB4s2X4WZAs8ARy0CAPsBRacqiv//CthM6yoBEJcGARA39uoBgsdeAGwGbAN8CfwYlIZwjwBbX7gO2A7YaCTov7Qg3BdsthEKgPOBWxN+6a8CBybYLYNJGAAeAk7MiNhXbS+RkWUhTUMAYAsdtuCRm04D7s/NtGD2IQB4D9ijR2D+BPZsVso+7ZF3UbIsPQA7Ax8NiMaFieOGAVWsatalB8C68XsHSPwkcOyA/N6zLj0ADwAnD4jCd8AWA/J7zyoAZkTICwD2KPt4DjQtPQDL8Ag4pj0LcaQAyFdg0QeBmzczETurtyNwOXBjvgRTcyx9D2CtfxvYu4dwvzXnEvcBPuuRt1SWe4DT28JsWnoI8GapwptyQgCwF/BOD9GO7rmA1KOqiVlObQagtjcxmuyg7EHA34UqCQGAaXUBcEuGaHZOfvSoVEbWIqbbA28BG04o7XrgiiK1BOkBVrSyX85LCcLdCZyTYDdPE3tJY9r6w+HACwUcCNMDrGi1W7uy17UdfDvwVAFhhxSRsmtpL80Y0L8OqSjKGKBLI48HQmzPwvYuUtIdwLkphlNswvUAA/Wae/bcjavjmm3rxwZ4JQAGiNeVdXfggx7lXtuM7q/MzGfnFuzwyreZ+VbMBUBP4bqynQVc0h47y9mEOqBZq3ilpy/2woy9ONMnCYA+qnXkOQJ4buR/9oy284c/z6hjvWap92tgkwG+nAHYolFuEgC5inXY79IuNq079n9btTMI7JxhV3oEOH6gH3aq2XqRLzLLEQCZgk0y3xh4d+wly1E7m6oZBJMWouwCjFLvPNqxN1u9zEkCIEetDltbnk25xsYOphoI1t1b2hT4vkD9o0VclLniKQAGBuDhzNfWbU/fILBfa99Nqmku/9E+Ct5PbJcASBRqktkNwGU98v/TQjD6Vm6PYjqzvNw8kg5OLFAAJAo1bmbTvbt65q2RzeC6JqEiAZAg0rjJ+HSvRxFVstis4LUZNQmAzFB0Tfcyi6libjOT/ZvHlB0k6UoCICMUs6Z7GUVVM70ZuFgAlNE7dbpXprZypUy7Xkc9QKLOudO9xGKrmAmAMZltBL8lcGmi/H2ne4nFz91MAIxIPHoBpR24PLM5X/fXlBB4n+6l0CMAWpVsEPd5M3+3vyvJDn8aBD9NUHJRpnuzIBAArUJdgzg7fbt2bCdtkaZ7AmCWAu2qnXXnXcl6BusJDIZFnO5NkyB8D5D6HLfHgEFwXuLuXgJ3LkxCA5B77bwNCNdxEbZyToQFYNKgr5ysi1NSWAAWdeWuNFohAbCt2mmDvtIiey4vHACpgz7PQSvpWygAcgd9JYX2WlYYAGzQd7aTKPwLM7+dZDaWUj7TklKelTXJzj600fWxDe0GOgFmtdwQAKulvJN6BYCTQKyWGwsDgF3XYjt3SmUVuBuw9wpXUsp4ZKYHJQoZH82XuAxhpuMBDewi7J0WAQDz8enmKx92f4/ScAVWvhxqdw2NphI/3qRpzawmaD4/S6H5/N8NABu0t16Mf9t2Ps1WqabAJ839Bnaz6uBUhKL2Ni+7MUtp/gr8ANxU6uPcpQCwZtujIOXV6/lLtNw12B0F35RqYkkASvmkcioqIAAqiu2xKgHgMSoVfRIAFcX2WJUA8BiVij4JgIpie6xKAHiMSkWfBEBFsT1WJQA8RqWiTwKgotgeqxIAHqNS0ScBUFFsj1UJAI9RqeiTAKgotseqBIDHqFT0SQBUFNtjVQLAY1Qq+iQAKortsSoB4DEqFX0SABXF9liVAPAYlYo+CYCKYnusSgB4jEpFnwRARbE9ViUAPEalok8CoKLYHqsSAB6jUtEnAVBRbI9VCQCPUanokwCoKLbHqv4DKE5hkEZgXUkAAAAASUVORK5CYII=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546237/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/546237/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const hideAllImg = () => {
        const imgs = document.getElementsByTagName("img");
        Array.from(imgs).forEach(item => {
            item.style.display = 'none'
        })
    }
    hideAllImg()
    const observer = new MutationObserver(() => {
        hideAllImg()
     })
    observer.observe(document.querySelector("body"), { attributes: true, childList: true, subtree: true })
})();
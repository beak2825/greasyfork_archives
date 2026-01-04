// ==UserScript==
// @name         移除必应多余的推荐模块 Remove Bing's Recommend
// @namespace    com.icaics
// @version      2.0
// @description  移除必应搜索结果点击后出现的多余推荐模块 Remove Bing's recommend link frame after click a search result.
// @author       icaics
// @match        https://bing.com/search*
// @match        https://www.bing.com/search*
// @match        https://cn.bing.com/search*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAABGVJREFUWEfVk/tPU1cAx/sfzLC5MOYEpBMRsIWWXtqqMOTy2IwQQHQ4Aywz+oMBp4lxmBg2zByZbIYtk2QvdYmbLCaoiyMELIgg8wECpeVdHkXW0selpVyg0O9uu4PLHHdpHV22T/JNk3s/55zvOT1X8J8lvpUJUKgcaqXKMa24NXOcPP73UNbb6a0NDixHUe9Qc4Wk5LX/UdaytLJuFk9HXuf4kCj+xVPgZxYrRX6T9X8J5TWWVtxgsVLk12enieY/PAWuzYEvRPMf1FWWll+dB1+I5j+oK1yBam4xnhDNf1CXuQLfc4vxhGj+g7rE0vHfzYMvRBPEqSCW1aOR+y0gj1YH6hsnHX9hAXwhmoBqACNrAOJuuSBVLY6IVM5M8uqfQX3ppKmvneAL0QRUvavGszgXiWoJoqYFRDbPNYY32xOJ8mxQ57kCVdxiPCGaQKZCpruAe/GYRieib88j4s4shHftWH/f2vhch3UNUX2D+sxJyyoXwBeieeCOnolVLZLdswhvnUHILwyCHprwfOckE6TWi4nqPZKzLB1XMQe+EM0Dt/tz4iYnoprnENEyi7A2G165b8GLHUYEdj1GWNfYI1GHzreTkHzE0tIzLPhCNA8iFUK2cEe/+Q6Lje7d32PwUrsJAZ2TCO7SI1I9CqpnqJTo3iF5305LSh3gC9Ge4L54m1oc2NA2jXUPzFj7yICgrglsVI8jVjOC7drBEaJ6h+Q9Ox1bMgO+EO0JIpV1zauttnPB96wIbJ/CC9zuQ7v1iO4ZhVw7DLp3ABl9fd7fBfFRho45ZgNfiPYXgrlbv7bDULCuRX9zQ80QpBodEnsH8XpfP7IHtN5/muIihhYVWcEXoq1IxFFdSdjBQdvLb2oR+Ha3Oamd231/H/b4UiDqoImOPmQGX4j2J+SfTqRKT09oRCf0iDg8itD8IQRl9yKkWG3c3a/FvoFuHwoU/EpHFhrBF6J5SLliECZ8ZazdVmlA/BkDJCcnEX2Eu4DvjCF47zACM7Rs3oAG+boO7z/FLcWGrPB9k+AL0QRp15nylB9Mth3fmpDw+RQU5VOIO2WE+JgBmw89hnD/ONZnD+OtfnXN7yO8JLmaLYzK00OYM75iMprY1J11dv0bN6aRVm1G8gUTXvvChK0fm0GVmiA5PoXowwZsKpyEMG+czffl+JdJLDOawjJ0CN31R4SZOsiPTFgyb7PYVT8Dd4H0agvoi2augBnbzlog/8CCuBMWiItMiDpghPTUWAOZ0jeyta7y5Mope/R+nSEia4CVFY9Ppl9mZrPaFrBcYOdPNqT/6C5gQdJ5C7ZXWKEss4IqsSKm2GKLPGDeS6bznRy1K2CPxmXL1biQq3Zhd+cish86wVdgR5UFCZ8wUJ5mQJ1k7sa8ywjJVM8OV0KW27NkW7mAgxSwIuWSu4DVXcCmKGNKyPDVIZMrkaNe0v99ASuSqiy18RVMABm2urj/juzOxZKsB07N0wXSqi21yRfNqUT9PyEQ/AZezjADsUnW3gAAAABJRU5ErkJggg==
// @connect      bing.com
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473053/%E7%A7%BB%E9%99%A4%E5%BF%85%E5%BA%94%E5%A4%9A%E4%BD%99%E7%9A%84%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9D%97%20Remove%20Bing%27s%20Recommend.user.js
// @updateURL https://update.greasyfork.org/scripts/473053/%E7%A7%BB%E9%99%A4%E5%BF%85%E5%BA%94%E5%A4%9A%E4%BD%99%E7%9A%84%E6%8E%A8%E8%8D%90%E6%A8%A1%E5%9D%97%20Remove%20Bing%27s%20Recommend.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //
    const nodes = document.getElementsByClassName("b_algo");
    const config = { attributes: false, childList: true, subtree: false };
    //
    const callback = function (mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === "childList") {
                for (let n of mutation.addedNodes) {
                    n.remove();
                }
            }
        }
    };
    const observer = new MutationObserver(callback);
    //
    for (const node of nodes) {
        observer.observe(node, config);
    }
})();
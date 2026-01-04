// ==UserScript==
// @name         点击Bing分享按钮获取背景图片
// @namespace    https://github.com/DarknessChaser
// @version      0.0.2
// @description  点击Bing右下角分享按钮，在新标签页中打开背景图片
// @author       漆黑菌
// @homepage     https://github.com/DarknessChaser
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAADf0lEQVR42uzYA2wsexSA8cdyM7Webdu2bdu2bdu2bdu4tq3a3T33S3JucnLSmXRRJf2S38Wcdr2D/0IDDTRQ77dYD91HlsrRvxtQgwS6rRw8j0+xGnKwFvbDBbgXr+NHDMdUNEIQpR6j8SauwG7IQ0baB6JmIw7pJo24HVlIq6MgXRDHXIxU9hX9GO+rz/EjRupMPHyb7gO/FaJGYyS+x+M4BzthCfcd2QuihiKqJXAC/ocYtyLlRkPQinLY1kMOfPZBD4YtD6/jayxhtmfhQ/dRiSHpdoKoJ2G7CILJKIx40P/DdpyZXQHbEmg288OQdO9C1GqwvWhmF0V8ef+F7XX/e65fzfz+VHZ1rebV9B0GUX/DdoCZ/Wm2L4JqM9sEPvukPkzno/EjfIVoh6hKMzsEon4323eAqOnorLEQ9TSSaiuIqkYhfN9C1BFm+xEQ9avZ/jhEPQjfaRDjKCRVDM3us7kDbLeGPIhjIOpns9ew++Vt3F7ocXfgmok8JN39EKcav+Jd/O6e1KPqW3fnz+JdiPElBqMW4sRxAFIqy95ZD5mLg5B2B+B7tEMyLI6JeB9nIEBGi2ELHIYzcAmuwc24E3fjXvwLUcPxoM5vxAU4DrtgDeShT/S8+4L2iz6GqOvRay2BDbAbjsAZuAK342G8iHfxJard3ma8h6H4FV/ibTyNA5CRyjEY0kN2Q9pdAulBhyG0hdGV1sDnWAqzMA3zVINqQguakcDtWNC5GIeE2fcvgpgKUIYAP+M5ZKwsdKWVIEY5+nw7QFRrb697BChFsVGIAEUI1GruPia79Y9FzLl1Ah1o07+bzMdtHG7ECCTVCRiJZkgvGI6kWg5xSC/6P9mPxzxMwTJmWwvmqBpVpxpQr383GS36dwcSAMgvmaHQaEp1TxLDVlgDgdk7XIAV0C8KMB3+2m8RnIFTsBh85+Ei+NnDaMWnWALd0vUQNTXkQvZu2HaKmDW729sEGa0Y1RD1eMhywkzY9ou4Ar8XYjTjEGSsRyGqHSuZWSXEWMvMSv0MtvPcXiqOC5B2m7gbfjR0zQ84DbbJZnYcfHugHmKch7T63q1RF8P3LES9GLG8di86ayPMdqcAMaTc5JBFGdsFEPU5bHea2bMIaz3zvalGFlJuJ7yKoxDWEpiJOA6DbQ3Uox07IKplcAU2Q48UwzIRe5/5k2AYImAUAABUH0vEwQOnZwAAAABJRU5ErkJggg==
// @include      *://cn.bing.com/
// @include      *://cn.bing.com/?*
// @include      *://www.bing.com/
// @include      *://www.bing.com/?*
// @connect      cn.bing.com
// @run-at       document-body
// @grant        window.open
// @grant        GM_xmlhttpRequest
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/376857/%E7%82%B9%E5%87%BBBing%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E8%8E%B7%E5%8F%96%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/376857/%E7%82%B9%E5%87%BBBing%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE%E8%8E%B7%E5%8F%96%E8%83%8C%E6%99%AF%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
  'use strict';
  //在当前页面获取图片地址
  function getURLByLocal() {
    // 从行内css属性background-image中获取今日必应图片的url()
    var picUrl = document.querySelector('#bgDiv').style.backgroundImage

    //如果css属性background-image写在外部css或者style标签中
    if (picUrl === '') {
      var style0 = document.styleSheets[0] //获取外部css样式文件对象
      var rules = style0.cssRules.length //获取该css文件中的样式数量
      for (var i = 0; i < rules; i++) {
        //遍历所有样式 找到选择器为#bgDiv的样式的背景图片属性（包含url）
        if (style0.cssRules[i].selectorText === '#bgDiv') {
          picUrl = style0.cssRules[i].style.backgroundImage
        }
      }
    }
    //从背景图片属性中取出图片地址（去掉 前引号url前括号 和 后括号后引号 等字符）
    picUrl = picUrl.substring(5, picUrl.length - 2)
    return picUrl
  }
  // 从服务器获取图片地址
  function getImgByOnline(callback) {
    GM_xmlhttpRequest({
      url: 'https://cn.bing.com/HPImageArchive.aspx?format=js&n=1',
      method: "GET",
      onload: function (data) {
        if (data.status !== 200) return false
        window.location.href = JSON.parse(data.responseText).images[0].url
      }
    })
  }
  document.getElementById("shBingAppQR").onclick = function () {
    var url = getURLByLocal()
    if (url !== undefined) {
      window.open(url)
    } else {
      getImgByOnline()
    }
  };
})();
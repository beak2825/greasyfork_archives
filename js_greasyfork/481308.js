// ==UserScript==
// @name        yrrh1 - 91huayi.com
// @namespace   Violentmonkey Scripts
// @match       https://nlts.91huayi.com/Exercise/ExerciseHome/index
// @grant       小小梁
// @version     1.0
// @author      -
// @description 2023/12/1 20:58:50
// @downloadURL https://update.greasyfork.org/scripts/481308/yrrh1%20-%2091huayicom.user.js
// @updateURL https://update.greasyfork.org/scripts/481308/yrrh1%20-%2091huayicom.meta.js
// ==/UserScript==

window.onload=(function () {
    setTimeout(function () {

    document.querySelector("#\\/Exercise\\/ExerciseCourse\\/ExcellentIndex\\?package\\=true > span").click()

},5000)

  setTimeout(function () {

    var iframe = document.getElementById("student_iframe");
    var iframeWindow = iframe.contentWindow;

    for(i=1;i<14;i++){
      var wb ="body > div > div.itemList > div:nth-child("+ i +") > div > p"
      var kc1 = "body > div > div.itemList > div:nth-child("+ i +") > a > p.itemTitle"
      console.log(wb)
      var zt = iframeWindow.document.querySelector(wb).innerText
      console.log(zt)
      if(zt == "未学习"|| zt == "学习中"){
          iframeWindow.document.querySelector(kc1).click();
        }
    }


},10000)

      setTimeout(function () {

    window.location.reload()

},20000)



}
)();

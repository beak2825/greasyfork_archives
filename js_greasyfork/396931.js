// ==UserScript==
// @name         刺猬猫
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  下载刺猬猫小说
// @author       荣晓雪
// @match        https://*.ciweimao.com/*

// @downloadURL https://update.greasyfork.org/scripts/396931/%E5%88%BA%E7%8C%AC%E7%8C%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/396931/%E5%88%BA%E7%8C%AC%E7%8C%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ciweimao
    var time = 2000
    var url = location.href
    var hl='<button class="btn btn-lg btn-danger" id="download">点我下载</button>'
    console.log("书籍")
	console.log(url.slice(25,29))
	if (url.slice(25,29)=="book") {
		$(".btn-group").prepend(hl)
	}
    if (url.slice(25,32)=="chapter"){
        console.log(url)
        var test = document.getElementById("J_BookCnt")
        var sl = /<span>.*?<.span>/g
        console.log(test.innerHTML.replace(sl,""))
        var booktext = test.innerHTML.replace(sl,"").replace(/<[^<>]+>/g,"")
        console.log(sessionStorage.getItem("stear"))
        downbook()
    }
    $("#download").click( function() {
    console.log(1)
    console.log(sessionStorage.getItem("stear"))
    if(sessionStorage.getItem("stear")=="off"||sessionStorage.getItem("stear")==null){
    var listn = 0
    var testbook = new Array()
  //  var booklist = document.getElementsByClassName("book-chapter-list")['0'].children
    var booklist = new Array()
    for(var bi=0;bi<document.getElementsByClassName("book-chapter-list").length;bi++){
  //  if(bi=0){
   // booklist = booklist
  //  }else{
    for(var gi =0;gi<document.getElementsByClassName("book-chapter-list")[bi].children.length;gi++){
    booklist[listn]=document.getElementsByClassName("book-chapter-list")[bi].children[gi]
    listn++
  //  }
    }
    }
    sessionStorage.setItem("title",document.getElementsByClassName("title")['0'].textContent)
    sessionStorage.setItem("stear","on")
    sessionStorage.setItem("list",booklist.length)
    sessionStorage.setItem("mian",url)
     for(var i=0; i<booklist.length;i++){
     var s = booklist[i].innerHTML
     var path = new RegExp("http.*[0-9]")
     testbook[i] = path.exec(s).toString()
     sessionStorage.setItem("l"+i,testbook[i])
     console.log(testbook[i])
     }

     window.open(testbook[0],'_self')
    }
    })
    function downbook(){
    if(sessionStorage.getItem("stear")=="on"){
    var numb = sessionStorage.getItem("list")
    numb = Number(numb)
    if(numb!=NaN){
    for(var n=0;n<numb;n++){
    if(url==sessionStorage.getItem("l"+n)){
    console.log("第"+n+"章")
    console.log(numb)
    switch(n){
        case 0:sessionStorage.setItem(n,booktext)
               var zn = n+1
               console.log(n)
               window.open(sessionStorage.getItem("l"+zn),'_self')
            break
        case numb-1:sessionStorage.setItem(n,booktext)
                    sessionStorage.setItem("stearl","last")
                    console.log(sessionStorage.getItem("stearl"))
                    if(sessionStorage.getItem("stearl")=="last"){
                    for(var textn=0;textn < numb;textn++){
                    ciweimao = ciweimao + sessionStorage.getItem(textn)
                    }
                    console.log(ciweimao)}
                    var title = sessionStorage.getItem("title")
                    downFile(title)
                   // window.close()
            break
        default:sessionStorage.setItem(n,booktext)
                var dn = n+1
                window.open(sessionStorage.getItem("l"+dn),'_self')
    }
    }
    }
    }
    }
    }
    function downFile(ti) {
  ciweimao = ciweimao.replace(undefined,"")
  var elementA = document.createElement('a');
  elementA.setAttribute('href', 'data:text/plain;charset=utf-8,' + ciweimao);
  elementA.setAttribute('download', ti);
  elementA.style.display = 'none';
  document.body.appendChild(elementA);
  elementA.click();
  document.body.removeChild(elementA);
}
    // Your code here...
})();